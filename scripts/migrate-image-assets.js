const fs = require('fs');
const path = require('path');
const {
    PART_DIRECTORY,
    WEAPON_DIRECTORY_BY_TYPE,
    getBaseItemImageName
} = require('../image-paths');

const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(projectRoot, 'docs', 'images_new');
const destinationRoot = path.join(projectRoot, 'docs', 'images');
const data = JSON.parse(fs.readFileSync(path.join(projectRoot, 'docs', 'data.json'), 'utf8'));

const weaponSources = Object.freeze({
    '01. Dagger': 'OneHandSword',
    '02. Two-handed Sword': 'TwoHandSword',
    '03. Axe': 'Axe',
    '04. Dual Swords': 'DualSword',
    '05. Pistol': 'Pistol',
    '06. Assault Rifle': 'AssaultRifle',
    '07. Sniper Rifle': 'SniperRifle',
    '08. Rapier': 'Rapier',
    '09. Spear': 'Spear',
    '10. Hammer': 'Hammer',
    '11. Bat': 'Bat',
    '12. Throw': 'HighAngleFire',
    '13. Shuriken': 'DirectFire',
    '14. Bow': 'Bow',
    '15. Crossbow': 'CrossBow',
    '16. Glove': 'Glove',
    '17. Tonfa': 'Tonfa',
    '18. Guitar': 'Guitar',
    '19. Nunchaku': 'Nunchaku',
    '20. Whip': 'Whip',
    '21. Camera': 'Camera',
    '22. Arcana': 'Arcana',
    '23. VF Prosthetic': 'VFArm'
});

const armorSources = Object.freeze({
    '02. Chest': 'Chest',
    '03. Head': 'Head',
    '04. Arm, Accessory': 'Arm',
    '05. Leg': 'Leg'
});

const aliases = Object.freeze({
    'Twin Swords': 'Twin Blades',
    'Deadly Butterfly': 'Black Butterfly',
    'Lioigor Zahr': 'Lloigor & Zahr',
    Stempede: 'Stampede',
    Rapier: 'Fencing Rapier',
    'Shapened Spear': 'Sharpened Spear',
    'Eighteen Foor Spear': 'Eighteen Foot Spear',
    'Imperial Skil Gloves': 'Imperial Silk Gloves',
    'Ryuku Tonfa': 'Ryukyu Tonfa',
    'Wild Horst': 'Teen Spirit',
    'Cathod Lash': 'Cathode Lash',
    'Polaroid Camera': 'Instant Camera',
    'The Hang Man': 'The Hanged Man',
    'Alpha Siderwinder ML': 'Alpha Sidewinder ML',
    Black: 'Black Mamba',
    Slipper: 'Slippers',
    'SCV (Self-Controlled Vehicle)': 'SCV',
    'Mithril Boots': 'Mythril Boots',
    'Miltary Suit': 'Military Suit',
    'Mithril Armor': 'Mythril Armor',
    'Mithril Crop': 'Mythril Crop',
    'Beautiful Garnment': 'Beautiful Garment',
    'Vital Sign Censor': 'Vital Sign Sensor',
    'Mithril Shield': 'Mythril Shield',
    'Mithril Helm': 'Mythril Helm',
    Mithril: 'Mythril'
});

const weaponTypeIconNames = Object.freeze({
    'Twohanded Sword': 'Two-Handed Sword',
    'Dual Sword': 'Dual Swords'
});

function normalizeName(value) {
    return String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

function pngFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes: true })
        .filter(entry => entry.isFile() && path.extname(entry.name).toLowerCase() === '.png')
        .map(entry => path.join(directory, entry.name));
}

function canonicalLookup(names) {
    const lookup = new Map();
    for (const name of names) {
        const baseName = getBaseItemImageName(name);
        const key = normalizeName(baseName);
        if (!lookup.has(key)) lookup.set(key, baseName);
    }
    return lookup;
}

const moves = [];
const corrections = [];
const unassigned = [];

function scheduleMove(source, destinationDirectory, destinationBaseName, classification) {
    const sourceBaseName = path.basename(source, path.extname(source));
    const destination = path.join(destinationDirectory, `${destinationBaseName}.png`);
    moves.push({ source, destination });

    if (sourceBaseName !== destinationBaseName) {
        corrections.push({ from: sourceBaseName, to: destinationBaseName, classification });
    }
}

function scheduleCanonicalCategory(sourceDirectory, destinationDirectory, itemNames, classification) {
    const lookup = canonicalLookup(itemNames);
    const expected = new Set(lookup.values());

    for (const source of pngFiles(sourceDirectory)) {
        const sourceBaseName = path.basename(source, '.png');
        const alias = aliases[sourceBaseName];
        const canonicalName = alias || lookup.get(normalizeName(sourceBaseName));
        const finalName = canonicalName || sourceBaseName;

        scheduleMove(source, destinationDirectory, finalName, classification);
        if (!canonicalName || !expected.has(canonicalName)) {
            unassigned.push({ name: finalName, classification });
        }
    }
}

for (const [sourceFolder, weaponType] of Object.entries(weaponSources)) {
    const itemNames = Object.entries(data.items)
        .filter(([, item]) => item.part === 'Weapon' && item.weaponType === weaponType)
        .map(([name]) => name);
    scheduleCanonicalCategory(
        path.join(sourceRoot, '01. Weapons', sourceFolder),
        path.join(destinationRoot, 'equipment', 'weapons', WEAPON_DIRECTORY_BY_TYPE[weaponType]),
        itemNames,
        `weapon:${weaponType}`
    );
}

for (const [sourceFolder, part] of Object.entries(armorSources)) {
    const itemNames = Object.entries(data.items)
        .filter(([, item]) => item.part === part)
        .map(([name]) => name);
    scheduleCanonicalCategory(
        path.join(sourceRoot, sourceFolder),
        path.join(destinationRoot, 'equipment', PART_DIRECTORY[part]),
        itemNames,
        `armor:${part}`
    );
}

const materialNames = Object.entries(data.items)
    .filter(([, item]) => item.part === 'Misc')
    .map(([name]) => name);
scheduleCanonicalCategory(
    path.join(sourceRoot, '06. Material'),
    path.join(destinationRoot, 'materials'),
    materialNames,
    'material'
);

for (const source of pngFiles(path.join(sourceRoot, 'Characters'))) {
    const baseName = path.basename(source, '.png');
    scheduleMove(source, path.join(destinationRoot, 'characters'), baseName, 'character');
}

for (const source of pngFiles(path.join(sourceRoot, 'UI'))) {
    const sourceBaseName = path.basename(source, '.png');
    const destinationBaseName = sourceBaseName.toLowerCase() === 'thumbnail'
        ? 'thumbnail'
        : sourceBaseName;
    scheduleMove(source, path.join(destinationRoot, 'ui'), destinationBaseName, 'ui');
}

for (const source of pngFiles(path.join(sourceRoot, '01. Weapons', '00. Weapon Group'))) {
    const sourceBaseName = path.basename(source, '.png');
    const destinationBaseName = weaponTypeIconNames[sourceBaseName] || sourceBaseName;
    scheduleMove(source, path.join(destinationRoot, 'ui', 'weapon-types'), destinationBaseName, 'weapon-type-icon');
}

const duplicateDestinations = [...moves.reduce((counts, move) => {
    counts.set(move.destination, (counts.get(move.destination) || 0) + 1);
    return counts;
}, new Map()).entries()].filter(([, count]) => count > 1);

if (duplicateDestinations.length > 0) {
    throw new Error(`Migration aborted: ${duplicateDestinations.length} duplicate destination paths.`);
}

const existingDestinations = moves.filter(move => fs.existsSync(move.destination));
if (existingDestinations.length > 0) {
    throw new Error(`Migration aborted: ${existingDestinations.length} destination files already exist.`);
}

for (const { source, destination } of moves) {
    const resolvedSource = path.resolve(source);
    const resolvedDestination = path.resolve(destination);
    if (!resolvedSource.startsWith(`${sourceRoot}${path.sep}`)) {
        throw new Error(`Source escaped staging directory: ${source}`);
    }
    if (!resolvedDestination.startsWith(`${destinationRoot}${path.sep}`)) {
        throw new Error(`Destination escaped image directory: ${destination}`);
    }

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.renameSync(source, destination);
}

const report = {
    moved: moves.length,
    corrections,
    unassigned
};

fs.writeFileSync(
    path.join(projectRoot, 'image-asset-migration.json'),
    `${JSON.stringify(report, null, 2)}\n`
);

console.log(`Moved ${moves.length} PNG assets.`);
console.log(`Canonical filename corrections: ${corrections.length}.`);
console.log(`Assets not represented in current data: ${unassigned.length}.`);
