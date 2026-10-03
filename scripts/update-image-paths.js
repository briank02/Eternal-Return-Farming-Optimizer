const fs = require('fs');
const path = require('path');
const {
    getCharacterImagePath,
    getItemImagePath
} = require('../image-paths');

const projectRoot = path.resolve(__dirname, '..');
const dataPath = path.join(projectRoot, 'docs', 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

for (const [name, item] of Object.entries(data.items)) {
    const image = getItemImagePath(name, item.part, item.weaponType);
    if (image) item.image = image;
    else delete item.image;
}

for (const [name, character] of Object.entries(data.chars)) {
    character.image = getCharacterImagePath(name);
}

fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Updated image metadata for ${Object.keys(data.items).length} items and ${Object.keys(data.chars).length} characters.`);
