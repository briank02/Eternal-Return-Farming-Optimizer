const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const localData = JSON.parse(fs.readFileSync(path.join(projectRoot, 'docs', 'data.json'), 'utf8'));
const siteUrl = process.argv[2] || process.env.SITE_URL;
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const concurrency = 4;

const requiredUiImages = [
    'images/ui/Arm.png',
    'images/ui/CharacterSelect.png',
    'images/ui/Chest.png',
    'images/ui/Head.png',
    'images/ui/Leg.png',
    'images/ui/Weapon.png'
];

const requiredWeaponTypeImages = [
    'Arcana', 'Assault Rifle', 'Axe', 'Bat', 'Bow', 'Camera', 'Crossbow',
    'Dagger', 'Dual Swords', 'Glove', 'Guitar', 'Hammer', 'Nunchaku',
    'Pistol', 'Rapier', 'Shuriken', 'Sniper Rifle', 'Spear', 'Throwing',
    'Tonfa', 'Two-Handed Sword', 'VF Prosthetic', 'Whip'
].map(name => `images/ui/weapon-types/${name}.png`);

function usageError() {
    console.error('Usage: npm run assets:validate:remote -- https://preview.example.com/');
    process.exitCode = 2;
}

function buildAssetUrl(baseUrl, relativePath) {
    const encodedPath = relativePath.split('/').map(encodeURIComponent).join('/');
    return new URL(encodedPath, baseUrl);
}

async function validatePng(baseUrl, relativePath) {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
            const response = await fetch(buildAssetUrl(baseUrl, relativePath), {
                headers: { Range: 'bytes=0-23' }
            });
            const contentType = response.headers.get('content-type') || '';
            const contents = Buffer.from(await response.arrayBuffer());
            if (!response.ok) return `${relativePath}: HTTP ${response.status}`;
            if (!contentType.toLowerCase().startsWith('image/png')) {
                return `${relativePath}: expected image/png, received ${contentType || 'no content type'}`;
            }
            if (!contents.subarray(0, pngSignature.length).equals(pngSignature)) {
                return `${relativePath}: response does not have a PNG signature`;
            }
            return null;
        } catch (error) {
            lastError = error;
        }
    }
    return `${relativePath}: ${lastError.message}`;
}

async function mapWithConcurrency(values, workerCount, callback) {
    const results = new Array(values.length);
    let nextIndex = 0;
    async function worker() {
        while (nextIndex < values.length) {
            const index = nextIndex++;
            results[index] = await callback(values[index]);
        }
    }
    await Promise.all(Array.from({ length: Math.min(workerCount, values.length) }, worker));
    return results;
}

async function main() {
    if (!siteUrl) return usageError();

    let baseUrl;
    try {
        baseUrl = new URL(siteUrl);
        if (!['http:', 'https:'].includes(baseUrl.protocol)) throw new Error('unsupported protocol');
        if (!baseUrl.pathname.endsWith('/')) baseUrl.pathname += '/';
    } catch (error) {
        console.error(`Invalid site URL: ${siteUrl}`);
        process.exitCode = 2;
        return;
    }

    const failures = [];
    try {
        const dataResponse = await fetch(new URL('data.json', baseUrl));
        const contentType = dataResponse.headers.get('content-type') || '';
        if (!dataResponse.ok) {
            failures.push(`data.json: HTTP ${dataResponse.status}`);
        } else if (!contentType.toLowerCase().includes('json')) {
            failures.push(`data.json: expected JSON, received ${contentType || 'no content type'}`);
        } else {
            const deployedData = await dataResponse.json();
            const expectedItems = Object.keys(localData.items).length;
            const expectedCharacters = Object.keys(localData.chars).length;
            const deployedItems = Object.keys(deployedData.items || {}).length;
            const deployedCharacters = Object.keys(deployedData.chars || {}).length;
            if (deployedItems !== expectedItems) {
                failures.push(`data.json: expected ${expectedItems} items, received ${deployedItems}`);
            }
            if (deployedCharacters !== expectedCharacters) {
                failures.push(`data.json: expected ${expectedCharacters} characters, received ${deployedCharacters}`);
            }
        }
    } catch (error) {
        failures.push(`data.json: ${error.message}`);
    }

    const referencedPaths = new Set([...requiredUiImages, ...requiredWeaponTypeImages]);
    Object.values(localData.items).forEach(item => {
        if (item.part !== 'Misc' && item.image) referencedPaths.add(item.image);
    });
    Object.values(localData.chars).forEach(character => {
        if (character.image) referencedPaths.add(character.image);
    });

    const assetPaths = [...referencedPaths].sort();
    const assetFailures = await mapWithConcurrency(assetPaths, concurrency, relativePath =>
        validatePng(baseUrl, relativePath)
    );
    failures.push(...assetFailures.filter(Boolean));

    const unicodePaths = assetPaths.filter(relativePath => /[^\x00-\x7f]/.test(relativePath));
    const pathsNeedingEncoding = assetPaths.filter(relativePath => /[^A-Za-z0-9._~/-]/.test(relativePath));

    if (failures.length > 0) {
        const displayLimit = 25;
        console.error(failures.slice(0, displayLimit).join('\n'));
        if (failures.length > displayLimit) {
            console.error(`...and ${failures.length - displayLimit} more failures.`);
        }
        console.error(`Deployment validation failed for ${baseUrl.href}`);
        process.exitCode = 1;
        return;
    }

    console.log(`Validated deployed data and ${assetPaths.length} referenced PNG assets at ${baseUrl.href}`);
    console.log(`Validated ${unicodePaths.length} Unicode paths and ${pathsNeedingEncoding.length} paths requiring URL encoding.`);
}

main();
