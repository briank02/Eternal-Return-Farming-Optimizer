const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DEFAULT_DATA_PATH = path.join(ROOT_DIR, 'docs', 'data.json');
const DEFAULT_OVERRIDE_PATH = path.join(ROOT_DIR, 'patch-overrides', 'active.json');
const MERGED_ITEM_SECTIONS = ['stats', 'uniqueStats', 'statsByLv'];

function requireObject(value, label) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`${label} must be an object.`);
    }
}

function mergeItemSection(item, sectionName, overrides, itemName, changes) {
    if (overrides === undefined) return;
    requireObject(overrides, `${itemName}.${sectionName}`);
    if (!item[sectionName]) item[sectionName] = {};

    Object.entries(overrides).forEach(([key, value]) => {
        const previous = item[sectionName][key];
        if (value === null) {
            delete item[sectionName][key];
        } else {
            item[sectionName][key] = value;
        }
        if (previous !== value) changes.push(`${itemName}.${sectionName}.${key}`);
    });
}

function applyLocationOverrides(item, overrides, itemName, changes) {
    if (overrides === undefined) return;
    requireObject(overrides, `${itemName}.locations`);

    const original = Array.isArray(item.locations) ? item.locations : [];
    const locations = new Set(
        Array.isArray(overrides.replace) ? overrides.replace : original
    );

    (overrides.remove || []).forEach(location => locations.delete(location));
    (overrides.add || []).forEach(location => locations.add(location));

    const updated = Array.from(locations);
    if (JSON.stringify(updated) !== JSON.stringify(original)) {
        changes.push(`${itemName}.locations`);
    }
    item.locations = updated;
}

function applyPatchPreview(data, config, appliedAt = new Date().toISOString()) {
    requireObject(data, 'Generated data');
    requireObject(data.meta, 'Generated data metadata');
    requireObject(data.items, 'Generated item data');
    requireObject(config, 'Preview override');
    requireObject(config.items, 'Preview override items');

    if (!config.patchVersion || !config.basePatchVersion) {
        throw new Error('Preview override requires patchVersion and basePatchVersion.');
    }

    const generatedBasePatch = data.meta.basePatchVersion || data.meta.patchVersion;
    if (generatedBasePatch !== config.basePatchVersion) {
        throw new Error(
            `Preview expects API patch ${config.basePatchVersion}, but generated data is ${generatedBasePatch}.`
        );
    }

    const changes = [];
    Object.entries(config.items).forEach(([itemName, itemOverrides]) => {
        const item = data.items[itemName];
        if (!item) throw new Error(`Preview item not found in generated data: ${itemName}`);
        requireObject(itemOverrides, `Override for ${itemName}`);

        MERGED_ITEM_SECTIONS.forEach(sectionName => {
            mergeItemSection(item, sectionName, itemOverrides[sectionName], itemName, changes);
        });

        if (itemOverrides.fields !== undefined) {
            requireObject(itemOverrides.fields, `${itemName}.fields`);
            Object.entries(itemOverrides.fields).forEach(([key, value]) => {
                if (item[key] !== value) changes.push(`${itemName}.${key}`);
                item[key] = value;
            });
        }

        applyLocationOverrides(item, itemOverrides.locations, itemName, changes);
    });

    data.meta.patchVersion = config.patchVersion;
    data.meta.basePatchVersion = config.basePatchVersion;
    data.meta.preview = true;
    data.meta.previewSource = config.sourceUrl || '';
    data.meta.previewAppliedAt = appliedAt;

    return { data, changes };
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function main() {
    const dataPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_DATA_PATH;
    const overridePath = process.argv[3] ? path.resolve(process.argv[3]) : DEFAULT_OVERRIDE_PATH;
    const data = readJson(dataPath);
    const config = readJson(overridePath);
    const result = applyPatchPreview(data, config);

    fs.writeFileSync(dataPath, JSON.stringify(result.data, null, 2));
    console.log(`Applied ${config.patchVersion} preview overrides (${result.changes.length} changes).`);
}

if (require.main === module) main();

module.exports = { applyPatchPreview };
