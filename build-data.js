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
    
    const [l10nEng, l10nKo, wRes, aRes, mRes, cRes, areaRes, spawnRes] = await Promise.all([
        fetchL10n('English'),
        fetchL10n('Korean'),
        fetchFromApi('/v2/data/ItemWeapon'),
        fetchFromApi('/v2/data/ItemArmor'),
        fetchFromApi('/v2/data/ItemMisc'),
        fetchFromApi('/v2/data/ItemConsumable'),
        fetchFromApi('/v2/data/Area'),
        fetchFromApi('/v2/data/ItemSpawn')
    ]);

    const allItemsList = [
        ...(wRes.data || []),
        ...(aRes.data || []),
        ...(mRes.data || []),
        ...(cRes.data || [])
    ];
    
    const allItemsMap = {};
    allItemsList.forEach(item => {
        allItemsMap[item.code] = item;
    });

    const areaCodeToEngName = {};
    const mapData = {};

    // Build Map Data
    (areaRes.data || []).forEach(area => {
        const engName = l10nEng[`Area/Name/${area.name}`] || area.name;
        areaCodeToEngName[area.code] = engName;
        
        if (hardcodedNeighbors[engName]) {
            mapData[engName] = {
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
        "Deathadder Queen", "Black Mamba King", "Alpha Sidewinder", 
        "Harmony in Full Bloom", "Force Core", "Fish and Chips", 
        "Mint Choco Ice Cream", "Frozen Pizza"
    ]);

    // Build Items
    const itemsData = {};
    allItemsList.forEach(item => {
        const engName = l10nEng[`Item/Name/${item.code}`] || item.name;
        
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
            type: type,
            part: partType,
            locations: spawns,
            initialCount: item.initialCount || 1,
            weaponType: item.weaponType || ""
        };

        if (!isBaseItem) {
            itemObj.components = getLeafComponents(item.code, allItemsMap, l10nEng);
        }

        itemsData[engName] = itemObj;
    });

    return { items: itemsData, mapData };
}

buildData().then(data => {
    fs.writeFileSync(path.join(__dirname, 'docs', 'data.json'), JSON.stringify(data, null, 2));
    console.log('Successfully wrote docs/data.json!');
}).catch(err => {
    console.error('Error:', err);
});