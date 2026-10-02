const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const docsRoot = path.join(projectRoot, 'docs');
const data = JSON.parse(fs.readFileSync(path.join(docsRoot, 'data.json'), 'utf8'));

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

const failures = [];
const validatedPaths = new Set();
let validatedItemCount = 0;
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function walkFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const entryPath = path.join(directory, entry.name);
        return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
    });
}

function validateRelativePath(relativePath, owner) {
    if (!relativePath) {
        failures.push(`${owner}: no image path`);
        return;
    }

    const absolutePath = path.join(docsRoot, ...relativePath.split('/'));
    if (!absolutePath.startsWith(`${docsRoot}${path.sep}`)) {
        failures.push(`${owner}: path escaped docs (${relativePath})`);
        return;
    }
    if (!fs.existsSync(absolutePath)) {
        failures.push(`${owner}: missing ${relativePath}`);
        return;
    }

    const signature = fs.readFileSync(absolutePath).subarray(0, 8);
    if (!signature.equals(pngSignature)) {
        failures.push(`${owner}: not a genuine PNG (${relativePath})`);
        return;
    }
    validatedPaths.add(relativePath);
}

for (const [name, item] of Object.entries(data.items)) {
    if (item.part === 'Misc') continue;
    validatedItemCount += 1;
    validateRelativePath(item.image, `item ${name}`);
}

for (const [name, character] of Object.entries(data.chars)) {
    validateRelativePath(character.image, `character ${name}`);
}

for (const relativePath of [...requiredUiImages, ...requiredWeaponTypeImages]) {
    validateRelativePath(relativePath, 'UI');
}

const allPngFiles = walkFiles(path.join(docsRoot, 'images'))
    .filter(file => path.extname(file).toLowerCase() === '.png');

for (const file of allPngFiles) {
    const contents = fs.readFileSync(file);
    const relativePath = path.relative(docsRoot, file).replaceAll(path.sep, '/');
    if (!contents.subarray(0, 8).equals(pngSignature)) {
        failures.push(`asset inventory: not a genuine PNG (${relativePath})`);
        continue;
    }
    if (/^\d+\.\s*/.test(path.basename(file))) {
        failures.push(`asset inventory: numeric filename prefix remains (${relativePath})`);
    }
    if (contents.length >= 24) {
        const width = contents.readUInt32BE(16);
        const height = contents.readUInt32BE(20);
        if (width === 128 && height === 71) {
            failures.push(`asset inventory: low-resolution 128x71 asset remains (${relativePath})`);
        }
    }
}

if (failures.length > 0) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
} else {
    console.log(`Validated ${validatedItemCount} equipment item references.`);
    console.log(`Validated ${Object.keys(data.chars).length} character images.`);
    console.log(`Validated ${validatedPaths.size} unique referenced PNG assets.`);
    console.log(`Validated all ${allPngFiles.length} organized PNG assets.`);
}
