const WEAPON_DIRECTORY_BY_TYPE = Object.freeze({
    OneHandSword: 'dagger',
    TwoHandSword: 'two-handed-sword',
    Axe: 'axe',
    DualSword: 'dual-swords',
    Pistol: 'pistol',
    AssaultRifle: 'assault-rifle',
    SniperRifle: 'sniper-rifle',
    Rapier: 'rapier',
    Spear: 'spear',
    Hammer: 'hammer',
    Bat: 'bat',
    HighAngleFire: 'throw',
    DirectFire: 'shuriken',
    Bow: 'bow',
    CrossBow: 'crossbow',
    Glove: 'glove',
    Tonfa: 'tonfa',
    Guitar: 'guitar',
    Nunchaku: 'nunchaku',
    Whip: 'whip',
    Camera: 'camera',
    Arcana: 'arcana',
    VFArm: 'vf-prosthetic'
});

const PART_DIRECTORY = Object.freeze({
    Chest: 'chest',
    Head: 'head',
    Arm: 'arm',
    Leg: 'leg'
});

function getBaseItemImageName(name) {
    return String(name).replace(/ - (Crimson|Dawn)$/, '');
}

function getItemImagePath(name, part, weaponType) {
    const imageName = getBaseItemImageName(name);

    if (part === 'Weapon') {
        const directory = WEAPON_DIRECTORY_BY_TYPE[weaponType];
        return directory
            ? `images/equipment/weapons/${directory}/${imageName}.png`
            : null;
    }

    const directory = PART_DIRECTORY[part];
    return directory
        ? `images/equipment/${directory}/${imageName}.png`
        : null;
}

function getCharacterImagePath(name) {
    return `images/characters/${name}.png`;
}

module.exports = {
    PART_DIRECTORY,
    WEAPON_DIRECTORY_BY_TYPE,
    getBaseItemImageName,
    getCharacterImagePath,
    getItemImagePath
};
