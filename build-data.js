require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const API_KEY = process.env.ER_API_KEY;
const API_BASE = 'https://open-api.bser.io';

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
    
    // Build Characters
    const charsData = {};
    const charList = charsRes.data || [];
    const charAttrsList = charAttrsRes.data || [];
    const charLevelsList = charLevelsRes.data || [];
    
    charList.forEach(char => {
        const engName = l10nEng[`Character/Name/${char.code}`] || char.name;
        const koName = l10nKo[`Character/Name/${char.code}`] || engName;
        charsData[engName] = {
            code: char.code,
            nameKo: koName,
            masteries: [],
            base: {},
            growth: {}
        };
    });
    
    charLevelsList.forEach(stat => {
        const engName = l10nEng[`Character/Name/${stat.code}`] || stat.name;
        if (charsData[engName]) {
            // Because ER API sometimes sends multiple entries per char for different masteries/states, 
            // we just grab the first one we find or overwrite
            charsData[engName].base = {
                maxHp: stat.maxHp || 0,
                attackPower: stat.attackPower || 0,
                defense: stat.defense || 0,
                hpRegen: stat.hpRegen || 0,
                attackSpeed: stat.attackSpeed || 0,
                moveSpeed: stat.moveSpeed || 0
            };
            charsData[engName].growth = {
                maxHp: stat.maxHpByLv || 0,
                attackPower: stat.attackPowerByLv || 0,
                defense: stat.defenseByLv || 0,
                hpRegen: stat.hpRegenByLv || 0,
                attackSpeed: stat.attackSpeedByLv || 0
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

        const itemObj = {
            nameKo: koName,
            type: type,
            part: partType,
            locations: spawns,
            initialCount: item.initialCount || 1,
            weaponType: item.weaponType || "",
            stats: {
                attackPower: item.attackPower || 0,
                attackSpeedRatio: item.attackSpeedRatio || 0,
                criticalStrikeChance: item.criticalStrikeChance || 0,
                attackRange: (item.attackRange || 0) + (item.uniqueAttackRange || 0),
                penetrationDefenseRatio: item.penetrationDefenseRatio || item.uniquePenetrationDefenseRatio || 0,
                penetrationDefense: item.penetrationDefense || item.uniquePenetrationDefense || 0,
                skillAmp: item.skillAmp || 0,
                cooldownReduction: item.cooldownReduction || 0,
                maxHp: item.maxHp || 0,
                defense: item.defense || 0,
                damageReduction: (item.preventBasicAttackDamaged || 0) + (item.preventSkillDamaged || 0),
                tenacity: item.uniqueTenacity || 0,
                visionRange: item.sightRange || 0,
                lifeSteal: (item.normalLifeSteal || 0),
                omnisyphon: (item.lifeSteal || 0) + (item.skillLifeSteal || 0) + (item.uniqueLifeSteal || 0),
                moveSpeed: (item.moveSpeed || 0) + (item.uniqueMoveSpeed || 0),
                moveSpeedRatio: (item.moveSpeedRatio || 0),
                hpRegen: (item.hpRegen || 0) + (item.hpRegenRatio || 0)
            },
            statsByLv: {
                attackPower: item.attackPowerByLv || 0,
                attackSpeedRatio: item.attackSpeedRatioByLv || 0,
                criticalStrikeChance: 0,
                attackRange: 0,
                penetrationDefenseRatio: item.penetrationDefenseRatioByLv || 0,
                penetrationDefense: item.penetrationDefenseByLv || 0,
                skillAmp: item.skillAmpByLevel || 0,
                cooldownReduction: 0,
                maxHp: item.maxHpByLv || 0,
                defense: item.defenseByLv || 0,
                damageReduction: (item.preventBasicAttackDamagedByLv || 0) + (item.preventSkillDamagedByLv || 0),
                tenacity: 0,
                visionRange: 0,
                lifeSteal: 0,
                omnisyphon: 0,
                moveSpeed: 0,
                hpRegen: 0
            }
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