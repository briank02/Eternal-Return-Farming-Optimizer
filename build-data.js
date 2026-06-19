require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const API_KEY = process.env.ER_API_KEY;
const API_BASE = 'https://open-api.bser.io';

const PASSIVE_SKILL_TRANSLATIONS = {
    "Biotic Infusion": "의념",
    "Burden: Magnetic Midnight": "충전 - 섬광",
    "Debilitation": "부패",
    "Electric Shock": "전자기 충격",
    "Flame Barrier": "불꽃 결계",
    "Healing Reduction": "치유 감소",
    "Magic Bullet": "마탄",
    "Photon Launcher": "포톤 런처",
    "Primordial Hex": "저주",
    "Reflection": "리플렉션",
    "Streamlined": "신속",
    "Streamlined: Charge Carrier": "신속 - 플라즈마",
    "Streamlined: Rudra Embodied": "신속 - 루드라의 단검",
    "Swift Strides": "가벼운 발걸음",
    "Vigor": "열정",
    "Vigor-Circulation": "열정 - 순환"
};

const ITEM_PASSIVE_SKILLS = {
    "Buddha's Palm": "Primordial Hex",
    "Brasil Gauntlet": "Vigor",
    "Mai Sok": "Primordial Hex",
    "Pakua Chang": "Primordial Hex",
    "Mallet": "Healing Reduction",
    "Weight of the World": "Burden: Magnetic Midnight",
    "Bookmaster": "Healing Reduction",
    "Thunder Whip": "Healing Reduction",
    "Cathode Lash": "Streamlined: Charge Carrier",
    "Incendiary Bomb": "Healing Reduction",
    "Smoke Bomb": "Vigor",
    "Sticky Bomb": "Burden: Magnetic Midnight",
    "Mystic Jade Charm": "Primordial Hex",
    "Azure Dagger": "Healing Reduction",
    "Flechette": "Vigor",
    "Ancient Bolt": "Vigor",
    "Elemental Bow": "Primordial Hex",
    "Poisoned Crossbow": "Healing Reduction",
    "Glock 48": "Vigor",
    "Stampede": "Magic Bullet",
    "Type 95": "Healing Reduction",
    "AK-12": "Vigor",
    "Beam Axe": "Healing Reduction",
    "Scythe": "Burden: Magnetic Midnight",
    "Harpe": "Swift Strides",
    "Carnwennan": "Burden: Magnetic Midnight",
    "Vibroblade": "Vigor",
    "Damascus Steel Thorn": "Healing Reduction",
    "Maharaja": "Streamlined: Rudra Embodied",
    "Arondight": "Vigor",
    "Divine Dual Swords": "Healing Reduction",
    "Black Butterfly": "Primordial Hex",
    "Fangtian Huaji": "Healing Reduction",
    "The Smiting Dragon": "Healing Reduction",
    "Vibro Nunchaku": "Vigor",
    "Blue 3": "Healing Reduction",
    "Esprit": "Streamlined",
    "Red Panther": "Healing Reduction",
    "Durendal Mk2": "Burden: Magnetic Midnight",
    "Bohemian": "Healing Reduction",
    "The Wall": "Vigor",
    "V.I.C.G": "Biotic Infusion",
    "The Hermit": "Primordial Hex",
    "The Hierophant": "Healing Reduction",
    "Deathadder Queen": "Biotic Infusion",
    "Black Mamba King": "Flame Barrier",
    "Alpha Sidewinder": "Swift Strides",
    "Cardinal Robes": "Healing Reduction",
    "Sunset Armor": "Flame Barrier",
    "Rocker's Jacket": "Healing Reduction",
    "Amazoness Armor": "Streamlined",
    "Virtuous Outlaw": "Swift Strides",
    "Crystal Tiara": "Healing Reduction",
    "Motorcycle Helmet": "Photon Launcher",
    "Mohawk Headgear": "Reflection",
    "Tactical OPS Helmet": "Electric Shock",
    "Vigilante": "Debilitation",
    "Diadem": "Healing Reduction",
    "Cowboy Hat": "Healing Reduction",
    "Sport Sunglasses": "Healing Reduction",
    "White Witch Hat": "Healing Reduction",
    "Corrupting Touch": "Healing Reduction",
    "Sword Stopper": "Reflection",
    "Creed of the Knight": "Healing Reduction",
    "Vital Sign Sensor": "Photon Launcher",
    "Sports Watch": "Vigor-Circulation",
    "Schrödinger's Box": "Healing Reduction",
    "White Crane Fan": "Primordial Hex",
    "White Rhinos": "Healing Reduction",
    "SCV": "Healing Reduction"
};

function getPassiveSkill(itemName) {
    const name = ITEM_PASSIVE_SKILLS[itemName];
    if (!name) return null;
    return {
        name,
        nameKo: PASSIVE_SKILL_TRANSLATIONS[name] || name
    };
}

const NON_STAT_ITEM_FIELDS = new Set([
    'code',
    'initialCount',
    'makeMaterial1',
    'makeMaterial2',
    'manufacturableType',
    'stackable',
    'itemUsableValueList',
    'exclusiveProducer',
    'exchange',
    'modeType',
    'addStateCode',
    'creditValueWhenConvertedToBounty'
]);

function normalizeUniqueStatKey(key) {
    const withoutPrefix = key.replace(/^unique/, '');
    return withoutPrefix.charAt(0).toLowerCase() + withoutPrefix.slice(1);
}

function normalizeLevelStatKey(key) {
    if (key.endsWith('ByLevel')) return key.slice(0, -'ByLevel'.length);
    if (key.endsWith('ByLv')) return key.slice(0, -'ByLv'.length);
    return key;
}

function addStat(target, key, value) {
    if (!Number.isFinite(value) || value === 0) return;
    target[key] = (target[key] || 0) + value;
}

function extractItemStats(item) {
    const stats = {};
    const uniqueStats = {};
    const statsByLv = {};

    Object.entries(item).forEach(([key, value]) => {
        if (NON_STAT_ITEM_FIELDS.has(key)) return;
        if (typeof value !== 'number' || value === 0) return;

        if (key.startsWith('unique')) {
            addStat(uniqueStats, normalizeUniqueStatKey(key), value);
        } else if (key.endsWith('ByLv') || key.endsWith('ByLevel')) {
            addStat(statsByLv, normalizeLevelStatKey(key), value);
        } else {
            addStat(stats, key, value);
        }
    });

    return { stats, uniqueStats, statsByLv };
}

const hardcodedNeighbors = {
    "Alley": ["Gas Station", "Police Station", "Temple"],
    "Temple": ["Alley", "Police Station", "Stream"],
    "Police Station": ["Alley", "Temple", "Fire Station", "Stream"],
    "Stream": ["Temple", "Police Station", "Pond", "Hospital"],
    "Gas Station": ["Archery Range", "School", "Fire Station", "Alley"],
    "Fire Station": ["Gas Station", "School", "Police Station", "Research Center", "Pond"],
    "Pond": ["Fire Station", "Stream", "Hospital"],
    "Hospital": ["Pond", "Stream", "Factory", "Cemetery"],
    "Archery Range": ["Gas Station", "School", "Hotel"],
    "School": ["Archery Range", "Gas Station", "Fire Station", "Research Center", "Forest", "Hotel"],
    "Research Center": ["School", "Fire Station", "Forest", "Cemetery"],
    "Cemetery": ["Hospital", "Research Center", "Factory", "Chapel"],
    "Factory": ["Hospital", "Cemetery", "Chapel", "Dock"],
    "Hotel": ["Archery Range", "School", "Forest", "Beach"],
    "Forest": ["Hotel", "School", "Research Center", "Chapel", "Uptown", "Beach"],
    "Chapel": ["Forest", "Cemetery", "Factory", "Warehouse", "Uptown"],
    "Beach": ["Hotel", "Forest", "Uptown"],
    "Uptown": ["Beach", "Forest", "Chapel", "Warehouse"],
    "Warehouse": ["Uptown", "Chapel", "Dock"],
    "Dock": ["Warehouse", "Factory"]
};

async function fetchFromApi(endpoint) {
    const res = await axios.get(`${API_BASE}${endpoint}`, {
        headers: { 'x-api-key': API_KEY, 'accept': 'application/json' },
        timeout: 10000 // 10s timeout to prevent hanging
    });
    return res.data;
}

async function fetchL10n(language) {
    const res = await fetchFromApi(`/v1/l10n/${language}`);
    const txtUrl = res.data.l10Path;
    const txtRes = await axios.get(txtUrl, { timeout: 15000 });
    
    const lines = txtRes.data.split('\n');
    const l10n = {};
    for (let line of lines) {
        if (!line.trim()) continue;
        const [key, val] = line.trim().split('┃');
        if (key && val) {
            l10n[key] = val.replace(/\r/g, '').trim();
        }
    }
    return l10n;
}

function getLeafComponents(itemCode, allItemsMap, l10nEng, visited = new Set()) {
    if (visited.has(itemCode)) return [];
    visited.add(itemCode);

    const item = allItemsMap[itemCode];
    if (!item) return [];
    
    if (item.makeMaterial1 === 0 && item.makeMaterial2 === 0) {
        const engName = l10nEng[`Item/Name/${itemCode}`] || item.name;
        // For items like Stone/Leather that drop multiple at once, we still only need "1" to fulfill a recipe component in the optimizer
        return [engName];
    }
    
    let components = [];
    if (item.makeMaterial1) {
        components = components.concat(getLeafComponents(item.makeMaterial1, allItemsMap, l10nEng, new Set(visited)));
    }
    if (item.makeMaterial2) {
        components = components.concat(getLeafComponents(item.makeMaterial2, allItemsMap, l10nEng, new Set(visited)));
    }
    return components;
}

async function buildData() {
    console.log('Fetching data from ER API...');
    
    const [l10nEng, l10nKo, wRes, aRes, mRes, cRes, areaRes, spawnRes, charsRes, charAttrsRes, charLevelsRes] = await Promise.all([
        fetchL10n('English'),
        fetchL10n('Korean'),
        fetchFromApi('/v2/data/ItemWeapon'),
        fetchFromApi('/v2/data/ItemArmor'),
        fetchFromApi('/v2/data/ItemMisc'),
        fetchFromApi('/v2/data/ItemConsumable'),
        fetchFromApi('/v2/data/Area'),
        fetchFromApi('/v2/data/ItemSpawn'),
        fetchFromApi('/v2/data/Character'),
        fetchFromApi('/v2/data/CharacterAttributes'),
        fetchFromApi('/v2/data/CharacterLevelUpStat')
    ]);

    const allItemsList = [
        ...(wRes.data || []),
        ...(aRes.data || []),
        ...(mRes.data || []),
        ...(cRes.data || [])
    ];
    const charLevelsList = charLevelsRes.data || [];
    
    // Build Characters
    const charsData = {};
    const charList = charsRes.data || [];
    const charAttrsList = charAttrsRes.data || [];
    const EXCLUDE_CHARS = new Set(["Dummy", "Craver"]);
    
    charList.forEach(char => {
        const engName = l10nEng[`Character/Name/${char.code}`] || char.name;
        if (EXCLUDE_CHARS.has(engName)) return;
        const koName = l10nKo[`Character/Name/${char.code}`] || engName;
        charsData[engName] = {
            code: char.code,
            nameKo: koName,
            masteries: [],
            base: {
                maxHp: char.maxHp || 0,
                attackPower: char.attackPower || 0,
                defense: char.defense || 0,
                hpRegen: char.hpRegen || 0,
                attackSpeed: char.attackSpeed || 0,
                moveSpeed: char.moveSpeed || 0
            },
            growth: {}
        };
    });
    
    charLevelsList.forEach(stat => {
        const engName = l10nEng[`Character/Name/${stat.code}`] || stat.name;
        if (charsData[engName]) {
            charsData[engName].growth = {
                maxHp: stat.maxHp || 0,
                attackPower: stat.attackPower || 0,
                defense: stat.defense || 0,
                hpRegen: stat.hpRegen || 0,
                attackSpeed: stat.attackSpeed || 0
            };
        }
    });
    
    charAttrsList.forEach(attr => {
        const engName = l10nEng[`Character/Name/${attr.characterCode}`] || attr.character;
        if (charsData[engName] && attr.mastery && attr.mastery !== 'None') {
            if (!charsData[engName].masteries.includes(attr.mastery)) {
                charsData[engName].masteries.push(attr.mastery);
            }
        }
    });
    
    const allItemsMap = {};
    allItemsList.forEach(item => {
        allItemsMap[item.code] = item;
    });

    const areaCodeToEngName = {};
    const mapData = {};

    // Build Map Data
    (areaRes.data || []).forEach(area => {
        const engName = l10nEng[`Area/Name/${area.name}`] || area.name;
        const koName = l10nKo[`Area/Name/${area.name}`] || engName;
        areaCodeToEngName[area.code] = engName;
        
        if (hardcodedNeighbors[engName]) {
            mapData[engName] = {
                nameKo: koName,
                neighbors: hardcodedNeighbors[engName],
                hasHyperloop: area.isHyperLoopInstalled || false
            };
        }
    });

    // Match item spawns to areas
    const itemSpawnsMap = {}; // itemCode -> Set of English Area Names
    (spawnRes.data || []).forEach(spawn => {
        if (spawn.dropCount > 0) {
            if (!itemSpawnsMap[spawn.itemCode]) itemSpawnsMap[spawn.itemCode] = new Set();
            const areaName = areaCodeToEngName[spawn.areaCode];
            if (areaName) {
                itemSpawnsMap[spawn.itemCode].add(areaName);
            }
        }
    });

    const envSpawns = {
        "Stone": ["Dock", "Warehouse", "Pond", "Stream", "Beach", "Uptown", "Alley", "Gas Station", "Hotel", "Police Station", "Fire Station", "Hospital", "Temple", "Archery Range", "Cemetery", "Forest", "Factory", "Chapel", "School", "Barge"],
        "Branch": ["Dock", "Warehouse", "Pond", "Stream", "Beach", "Uptown", "Alley", "Gas Station", "Hotel", "Police Station", "Fire Station", "Hospital", "Temple", "Archery Range", "Cemetery", "Forest", "Factory", "Chapel", "School", "Barge"],
        "Leather": ["Dock", "Warehouse", "Pond", "Stream", "Beach", "Uptown", "Alley", "Gas Station", "Hotel", "Police Station", "Fire Station", "Hospital", "Temple", "Archery Range", "Cemetery", "Forest", "Factory", "Chapel", "School", "Barge"],
        "Flower": ["Pond", "Stream", "Uptown", "Temple", "Cemetery", "Forest"]
    };

    const EXCLUDE_ITEMS = new Set([
        "Force Core", "Fish and Chips", 
        "Mint Choco Ice Cream", "Frozen Pizza"
    ]);

    // Build Items
    const itemsData = {};
    allItemsList.forEach(item => {
        const engName = l10nEng[`Item/Name/${item.code}`] || item.name;
        const koName = l10nKo[`Item/Name/${item.code}`] || engName;
        
        // Exclude items that are removed/test items
        if (!engName || engName.includes('Test') || EXCLUDE_ITEMS.has(engName)) return;

        // Skip items that cannot be crafted AND do not drop anywhere (except some special cases)
        const isBaseItem = item.makeMaterial1 === 0 && item.makeMaterial2 === 0;
        let spawns = itemSpawnsMap[item.code] ? Array.from(itemSpawnsMap[item.code]) : [];
        if (envSpawns[engName]) {
            const merged = new Set([...spawns, ...envSpawns[engName]]);
            spawns = Array.from(merged);
        }
        if (isBaseItem && spawns.length === 0) return; 

        // Identify Part Type
        let partType = "Misc";
        if (item.itemType === "Weapon") partType = "Weapon";
        else if (item.itemType === "Armor") partType = item.armorType; // Head, Chest, Arm, Leg

        // Epic items usually have itemGrade "Rare", "Epic", "Legendary"
        // Let's map Epic/Legendary to "Epic" for the UI since they are end-goal items, 
        // or just keep their actual grade.
        const type = item.itemGrade; // Common, Uncommon, Rare, Epic, Legendary
        const itemStats = extractItemStats(item);

        const itemObj = {
            nameKo: koName,
            type: type,
            part: partType,
            locations: spawns,
            initialCount: item.initialCount || 1,
            weaponType: item.weaponType || "",
            passiveSkill: getPassiveSkill(engName),
            stats: itemStats.stats,
            uniqueStats: itemStats.uniqueStats,
            statsByLv: itemStats.statsByLv
        };

        if (!isBaseItem) {
            itemObj.components = getLeafComponents(item.code, allItemsMap, l10nEng);
        }

        itemsData[engName] = itemObj;
    });

    return { items: itemsData, mapData, chars: charsData };
}

buildData().then(data => {
    fs.writeFileSync(path.join(__dirname, 'docs', 'data.json'), JSON.stringify(data, null, 2));
    console.log('Successfully wrote docs/data.json!');
}).catch(err => {
    console.error('Error:', err);
});
