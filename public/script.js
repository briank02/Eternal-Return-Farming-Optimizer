// ==========================================
// GLOBAL STATE
// ==========================================
const selectedEpics = new Set();
let currentFilter = "All"; // Track active filter
let currentWeaponFilter = "All";
let activeSubstats = new Set();
let currentCharacter = null;
let chars = {};
let charLevel = 1;
let selectedRoutes = [];
let generatedRoutes = [];

const SUBSTATS = [
    { id: 'attackPower', name: 'Attack Power' },
    { id: 'attackSpeedRatio', name: 'Attack Speed' },
    { id: 'criticalStrikeChance', name: 'Critical Strike Chance' },
    { id: 'attackRange', name: 'Attack Range' },
    { id: 'penetrationDefense', name: 'Armor Penetration' },
    { id: 'skillAmp', name: 'Skill Amplification' },
    { id: 'cooldownReduction', name: 'Cooldown Reduction' },
    { id: 'maxHp', name: 'Max HP' },
    { id: 'hpRegen', name: 'HP Regen' },
    { id: 'defense', name: 'Defense' },
    { id: 'damageReduction', name: 'Damage Reduction' },
    { id: 'tenacity', name: 'Tenacity' },
    { id: 'visionRange', name: 'Vision Range' },
    { id: 'lifeSteal', name: 'Lifesteal' },
    { id: 'omnisyphon', name: 'Omnisyphon' },
    { id: 'moveSpeed', name: 'Movement Speed' }
];

const WEAPON_TYPES = [
    { api: "Glove", name: "Glove", img: "01. Glove.png" },
    { api: "Tonfa", name: "Tonfa", img: "02. Tonfa.png" },
    { api: "Bat", name: "Bat", img: "03. Bat.png" },
    { api: "Hammer", name: "Hammer", img: "04. Hammer.png" },
    { api: "Whip", name: "Whip", img: "05. Whip.png" },
    { api: "HighAngleFire", name: "Throw", img: "06. Throwing.png" },
    { api: "DirectFire", name: "Shuriken", img: "07. Shuriken.png" },
    { api: "Bow", name: "Bow", img: "08. Bow.png" },
    { api: "CrossBow", name: "Crossbow", img: "09. Crossbow.png" },
    { api: "Pistol", name: "Pistol", img: "10. Pistol.png" },
    { api: "AssaultRifle", name: "Assault Rifle", img: "11. Assault Rifle.png" },
    { api: "SniperRifle", name: "Sniper Rifle", img: "12. Sniper Rifle.png" },
    { api: "Axe", name: "Axe", img: "13. Axe.png" },
    { api: "OneHandSword", name: "Dagger", img: "14. Dagger.png" },
    { api: "TwoHandSword", name: "Two-Handed Sword", img: "15. Twohanded Sword.png" },
    { api: "DualSword", name: "Dual Swords", img: "16. Dual Sword.png" },
    { api: "Spear", name: "Spear", img: "17. Spear.png" },
    { api: "Nunchaku", name: "Nunchaku", img: "18. Nunchaku.png" },
    { api: "Rapier", name: "Rapier", img: "19. Rapier.png" },
    { api: "Guitar", name: "Guitar", img: "20. Guitar.png" },
    { api: "Camera", name: "Camera", img: "21. Camera.png" },
    { api: "Arcana", name: "Arcana", img: "22. Arcana.png" },
    { api: "VFArm", name: "VF Prosthetic", img: "23. VF Prosthetic.png" }
];

// HARDCODED BASE WEAPONS
const BASE_WEAPONS = new Set([
    "Cotton Gloves", "Bamboo", "Short Rod", "Hammer", "Whip", 
    "Baseball", "Razor", "Bow", "Short Crossbow", "Walther PPK", 
    "Fedorova", "Long Rifle", "Hatchet", "Kitchen Knife", 
    "Rusty Sword", "Twin Blades", "Short Spear", "Steel Chain", 
    "Needle", "Starter Guitar", "Lens", "Glass Bead"
]);

let items = {};
let mapData = {};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        
        items = data.items;
        mapData = data.mapData;
        chars = data.chars;
        
        const loading = document.getElementById('loading-screen');
        if (loading) loading.style.display = 'none';

        // 1. Setup Filters
        setupFilters();
        
        // 2. Initialize Grid
        renderMainGrid();

        // 3. Setup Events
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateAllVariants);
        }

        const levelInput = document.getElementById('char-level');
        if (levelInput) {
            levelInput.addEventListener('input', (e) => {
                let val = parseInt(e.target.value) || 1;
                if (val < 1) val = 1;
                if (val > 20) val = 20;
                e.target.value = val;
                charLevel = val;
                renderMainGrid();
                renderStatComparison();
            });
        }

        const resetBtn = document.getElementById('reset-build-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                selectedEpics.clear();
                updateMainGridVisuals();
                updateSelectedPanel();
            });
        }

        const resetAllBtn = document.getElementById('reset-all-btn');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                // Reset character
                const allCharBtn = document.querySelector('#character-selection .char-btn[data-char="All"]');
                if (allCharBtn) allCharBtn.click();

                // Reset substats
                const activeSubstatsBtns = document.querySelectorAll('#substat-filters .substat-btn.active');
                activeSubstatsBtns.forEach(btn => btn.click());

                // Reset item part filter
                const allFilterBtn = document.querySelector('.filter-row:not(#weapon-subfilters):not(.character-row):not(.substat-row) > .filter-btn[data-filter="All"]');
                if (allFilterBtn) allFilterBtn.click();

                // Reset weapon subfilter
                const allWeaponBtn = document.querySelector('#weapon-subfilters .weapon-btn[data-subfilter="All"]');
                if (allWeaponBtn) allWeaponBtn.click();

                // Reset build
                if (resetBtn) resetBtn.click();
            });
        }

        // Setup Resizer
        const resizer = document.getElementById('resizer');
        const topPanel = document.getElementById('route-results-container');
        const bottomPanel = document.getElementById('stat-calculator');
        
        if (resizer && topPanel && bottomPanel) {
            let isResizing = false;
            let startY, startTopFlex, startBottomFlex;

            resizer.addEventListener('mousedown', (e) => {
                isResizing = true;
                startY = e.clientY;
                startTopFlex = topPanel.getBoundingClientRect().height;
                startBottomFlex = bottomPanel.getBoundingClientRect().height;
                document.body.style.cursor = 'ns-resize';
                document.body.style.userSelect = 'none';
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                const dy = e.clientY - startY;
                const newTopHeight = startTopFlex + dy;
                const newBottomHeight = startBottomFlex - dy;
                
                if (newTopHeight > 100 && newBottomHeight > 100) {
                    topPanel.style.flex = `${newTopHeight}`;
                    bottomPanel.style.flex = `${newBottomHeight}`;
                }
            });

            document.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.cursor = 'default';
                    document.body.style.userSelect = 'auto';
                }
            });
        }
    } catch (e) {
        console.error("Failed to load API data", e);
        const loading = document.getElementById('loading-screen');
        if (loading) loading.innerHTML = '<h2>Error loading API data. Please refresh.</h2>';
    }
});

// ==========================================
// UI: FILTERS & RENDERING
// ==========================================

function setupFilters() {
    const subfilterContainer = document.getElementById('weapon-subfilters');
    
    let subHtml = `<div class="filter-btn weapon-btn active" data-subfilter="All" title="All Weapons" style="color:white; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8em;">ALL</div>`;
    WEAPON_TYPES.forEach(w => {
        subHtml += `<div class="filter-btn weapon-btn" data-subfilter="${w.api}" title="${w.name}">
            <img src="images/${w.img}" alt="${w.name}" onerror="this.style.display='none'; this.parentElement.innerText='?'">
        </div>`;
    });
    if (subfilterContainer) subfilterContainer.innerHTML = subHtml;

    const charContainer = document.getElementById('character-selection');
    const substatContainer = document.getElementById('substat-filters');

    // Populate Characters
    if (charContainer && chars) {
        let charHtml = `<div class="char-btn active" data-char="All" title="All Characters">
            <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8em; color:#333;">ALL</div>
        </div>`;
        Object.keys(chars).sort().forEach(cName => {
            charHtml += `<div class="char-btn" data-char="${cName}" title="${cName}">
                <img src="images/${cName}.png" alt="${cName}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:0.6em; text-align:center; word-break:break-all;\\'>${cName}</div>'">
            </div>`;
        });
        charContainer.innerHTML = charHtml;

        const charBtns = charContainer.querySelectorAll('.char-btn');
        charBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active') && btn.dataset.char !== "All") {
                    // Clicked an already active character, switch to ALL
                    const allCharBtn = charContainer.querySelector('.char-btn[data-char="All"]');
                    if (allCharBtn) allCharBtn.click();
                    return;
                }

                charBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCharacter = btn.dataset.char === "All" ? null : btn.dataset.char;
                
                // Disable invalid weapons and deselect mismatching items in build
                const masteries = currentCharacter ? chars[currentCharacter].masteries : null;
                const weaponBtns = document.querySelectorAll('#weapon-subfilters .weapon-btn[data-subfilter]');
                
                if (currentCharacter) {
                    // Remove mismatching weapons from build
                    let buildChanged = false;
                    for (const itemName of selectedEpics) {
                        const itemData = items[itemName];
                        if (itemData && itemData.part === "Weapon") {
                            if (!masteries.includes(itemData.weaponType)) {
                                selectedEpics.delete(itemName);
                                buildChanged = true;
                            }
                        } else if (itemName === "Harmony in Full Bloom" && currentCharacter !== "Priya") {
                            selectedEpics.delete(itemName);
                            buildChanged = true;
                        } else if (itemData && itemData.part === "Head" && currentCharacter === "Priya" && itemName !== "Harmony in Full Bloom") {
                            selectedEpics.delete(itemName);
                            buildChanged = true;
                        } else if (currentCharacter !== "Echion") {
                            const echionWeapons = ["Black Mamba King", "Deathadder Queen", "Alpha Sidewinder"];
                            if (echionWeapons.includes(itemName) || itemData.weaponType === "VFArm") {
                                selectedEpics.delete(itemName);
                                buildChanged = true;
                            }
                        }
                    }
                    if (buildChanged) {
                        updateMainGridVisuals();
                        updateSelectedPanel();
                    }
                }

                let currentWeaponStillValid = currentCharacter === null;
                
                weaponBtns.forEach(wb => {
                    const wType = wb.dataset.subfilter;
                    if (wType === "All") return;
                    if (currentCharacter && !masteries.includes(wType)) {
                        wb.classList.add('disabled');
                    } else {
                        wb.classList.remove('disabled');
                        if (currentWeaponFilter === wType) currentWeaponStillValid = true;
                    }
                });

                if (!currentWeaponStillValid && currentWeaponFilter !== "All") {
                    const allBtn = document.querySelector('#weapon-subfilters .weapon-btn[data-subfilter="All"]');
                    if (allBtn) allBtn.click();
                } else {
                    renderMainGrid();
                }
            });
        });
    }

    // Populate Substats
    if (substatContainer) {
        let subHtml = '';
        SUBSTATS.forEach(s => {
            subHtml += `<div class="substat-btn" data-stat="${s.id}">${s.name}</div>`;
        });
        substatContainer.innerHTML = subHtml;

        const subBtns = substatContainer.querySelectorAll('.substat-btn');
        subBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const statId = btn.dataset.stat;
                if (activeSubstats.has(statId)) {
                    activeSubstats.delete(statId);
                    btn.classList.remove('active');
                } else {
                    activeSubstats.add(statId);
                    btn.classList.add('active');
                }
                renderMainGrid();
            });
        });
    }

    const topBtns = document.querySelectorAll('.filter-row:not(#weapon-subfilters):not(.character-row):not(.substat-row) > .filter-btn');
    topBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            topBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.dataset.filter;
            
            // Subfilter container remains always visible now
            renderMainGrid();
        });
    });

    const subBtns = document.querySelectorAll('#weapon-subfilters .filter-btn');
    const mainWeaponImg = document.querySelector('.filter-btn[data-filter="Weapon"] img');

    subBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentWeaponFilter = btn.dataset.subfilter;

            if (mainWeaponImg) {
                if (currentWeaponFilter === "All") {
                    mainWeaponImg.src = "images/Weapon.png";
                } else {
                    const clickedImg = btn.querySelector('img');
                    if (clickedImg) {
                        mainWeaponImg.src = clickedImg.src;
                    }
                }
            }

            renderMainGrid();
        });
    });
}

function renderMainGrid() {
    const grid = document.getElementById('epic-item-grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    const partOrder = { "Weapon": 1, "Chest": 2, "Head": 3, "Arm": 4, "Leg": 5 };

    const epicItems = Object.entries(items).filter(([name, data]) => {
        if (data.type !== "Epic" && data.type !== "Legendary") return false;
        if (!partOrder[data.part]) return false;
        
        // Substat filtering (including level scaling)
        if (activeSubstats.size > 0) {
            if (!data.stats) return false;
            for (let stat of activeSubstats) {
                const baseStat = data.stats[stat] || 0;
                const lvStat = (data.statsByLv && data.statsByLv[stat]) ? data.statsByLv[stat] * charLevel : 0;
                if (baseStat + lvStat <= 0) return false;
            }
        }

        // Character mastery & unique items filtering
        if (currentCharacter) {
            if (data.part === "Weapon") {
                const masteries = chars[currentCharacter].masteries;
                if (!masteries.includes(data.weaponType)) return false;
            }
            if (currentCharacter !== "Priya" && name === "Harmony in Full Bloom") return false;
            if (currentCharacter === "Priya" && data.part === "Head" && name !== "Harmony in Full Bloom") return false;
            
            const echionWeapons = ["Black Mamba King", "Deathadder Queen", "Alpha Sidewinder"];
            if (currentCharacter !== "Echion" && echionWeapons.includes(name)) return false;
        } else {
            // No character selected: you can't see Echion/Priya exclusive items to avoid confusion, 
            // OR we let them see it. The prompt says: "If the character is not selected, let them choose whatever."
        }

        // If currentFilter is "All", we only filter out other weapons
        if (currentFilter === "All") {
            if (data.part === "Weapon" && currentWeaponFilter !== "All" && data.weaponType !== currentWeaponFilter) {
                return false;
            }
            return true;
        }

        // If not "All", check part match
        if (data.part !== currentFilter) return false;

        // If part is Weapon, further filter by weaponType
        if (data.part === "Weapon") {
            if (currentWeaponFilter !== "All" && data.weaponType !== currentWeaponFilter) return false;
        }

        return true;
    });

    const weaponOrderMap = {};
    WEAPON_TYPES.forEach((w, i) => weaponOrderMap[w.api] = i);

    epicItems.sort((a, b) => {
        const dataA = a[1];
        const dataB = b[1];
        const orderA = partOrder[dataA.part] || 99;
        const orderB = partOrder[dataB.part] || 99;
        
        if (orderA !== orderB) return orderA - orderB;
        
        if (dataA.part === "Weapon" && dataA.weaponType && dataB.weaponType) {
             const wA = weaponOrderMap[dataA.weaponType] ?? 99;
             const wB = weaponOrderMap[dataB.weaponType] ?? 99;
             if (wA !== wB) return wA - wB;
        }
        
        return a[0].localeCompare(b[0]);
    });

    epicItems.forEach(([name, data]) => {
        const card = createItemCard(name);
        grid.appendChild(card);
    });
}

function createItemCard(name) {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.dataset.name = name; 
    card.title = name;

    const img = document.createElement('img');
    img.src = `images/${name}.png`; 
    img.alt = name;
    img.classList.add('item-icon');
    
    img.onerror = function() {
        this.style.display = 'none';
        card.innerText = name;
        card.style.fontSize = '0.75rem';
        card.style.textAlign = 'center';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'center';
        card.style.color = '#ccc';
    };

    card.appendChild(img);
    card.addEventListener('click', () => toggleSelection(name));
    return card;
}

function toggleSelection(name) {
    if (selectedEpics.has(name)) {
        selectedEpics.delete(name);
    } else {
        // Unique Selection Logic
        const echionWeapons = ["Black Mamba King", "Deathadder Queen", "Alpha Sidewinder"];
        if (name === "Harmony in Full Bloom") {
            forceCharacterSelection("Priya");
        } else if (echionWeapons.includes(name) || items[name].weaponType === "VFArm") {
            forceCharacterSelection("Echion");
        }

        // If a character is selected, ensure we don't allow mismatching uniques
        if (currentCharacter) {
            if (currentCharacter === "Priya" && items[name].part === "Head" && name !== "Harmony in Full Bloom") {
                return; // Deselect/block
            }
            if (currentCharacter !== "Priya" && name === "Harmony in Full Bloom") {
                return;
            }
            if (currentCharacter !== "Echion" && echionWeapons.includes(name)) {
                return;
            }
            if (items[name].part === "Weapon" && !chars[currentCharacter].masteries.includes(items[name].weaponType)) {
                return;
            }
        }

        selectedEpics.add(name);
    }
    updateMainGridVisuals();
    updateSelectedPanel();
}

function forceCharacterSelection(charName) {
    const btn = document.querySelector(`.char-btn[data-char="${charName}"]`);
    if (btn && !btn.classList.contains('active')) {
        btn.click();
    }
}

function updateMainGridVisuals() {
    // We only update visible cards. 
    // Since cards are re-created on filter change, this just handles selection state.
    const cards = document.querySelectorAll('#epic-item-grid .item-card');
    cards.forEach(card => {
        const name = card.dataset.name;
        if (selectedEpics.has(name)) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

function updateSelectedPanel() {
    const container = document.getElementById('selected-item-grid');
    if (!container) return;
    container.innerHTML = ''; 

    if (selectedEpics.size === 0) {
        container.innerHTML = '<p class="empty-msg">Click items to add to build.</p>';
        calculateStats();
        return;
    }

    const partOrder = { "Weapon": 1, "Chest": 2, "Head": 3, "Arm": 4, "Leg": 5 };
    const sortedEpics = Array.from(selectedEpics).sort((a, b) => {
        return (partOrder[items[a].part] || 99) - (partOrder[items[b].part] || 99);
    });

    sortedEpics.forEach(name => {
        const div = document.createElement('div');
        div.classList.add('item-card');
        div.title = "Click to remove";
        
        const img = document.createElement('img');
        img.src = `images/${name}.png`;
        img.classList.add('item-icon');
        
        img.onerror = function() {
            this.style.display = 'none';
            div.innerText = name;
            div.style.fontSize = '0.7rem';
            div.style.textAlign = 'center';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
        };

        div.appendChild(img);
        div.addEventListener('click', () => toggleSelection(name)); 
        container.appendChild(div);
    });
    
    // Reset comparison when build changes
    selectedRoutes = [];
    renderStatComparison();
}

// ==========================================
// STATS COMPARISON LOGIC
// ==========================================

function renderStatComparison() {
    const statList = document.getElementById('stat-list');
    if (!statList) return;

    // Use selected routes if any
    let buildsToCompare = [];
    if (selectedRoutes.length > 0) {
        buildsToCompare = selectedRoutes.map(r => r.variantItems);
    }

    if (buildsToCompare.length === 0) {
        statList.innerHTML = '<p class="empty-msg">Optimize a route, then click up to 2 routes below to compare stats.</p>';
        return;
    }

    const calculatedBuilds = buildsToCompare.map(build => calculateBuildStats(build));

    if (calculatedBuilds.length === 1) {
        statList.innerHTML = renderSingleStatColumn(calculatedBuilds[0]);
    } else {
        statList.innerHTML = renderComparisonColumns(calculatedBuilds[0], calculatedBuilds[1]);
    }
}

function calculateBuildStats(itemNames) {
    const totalStats = {};
    SUBSTATS.forEach(s => totalStats[s.id] = 0);
    
    // Add Character Base & Growth Stats
    if (currentCharacter && chars[currentCharacter]) {
        const cBase = chars[currentCharacter].base;
        const cGrowth = chars[currentCharacter].growth;
        const lvMinusOne = charLevel - 1;
        totalStats.maxHp += (cBase.maxHp || 0) + (cGrowth.maxHp || 0) * lvMinusOne;
        totalStats.attackPower += (cBase.attackPower || 0) + (cGrowth.attackPower || 0) * lvMinusOne;
        totalStats.defense += (cBase.defense || 0) + (cGrowth.defense || 0) * lvMinusOne;
        totalStats.hpRegen += (cBase.hpRegen || 0) + (cGrowth.hpRegen || 0) * lvMinusOne;
        
        if (cBase.attackSpeed !== undefined) {
            totalStats.attackSpeedRatio += (cBase.attackSpeed || 0) + (cGrowth.attackSpeed || 0) * lvMinusOne;
        }
        if (cBase.moveSpeed !== undefined) {
            totalStats.moveSpeed += cBase.moveSpeed;
        }
    }

    itemNames.forEach(name => {
        const itemObj = items[name];
        if (itemObj) {
            if (itemObj.stats) {
                Object.keys(itemObj.stats).forEach(key => {
                    if (totalStats[key] !== undefined) totalStats[key] += itemObj.stats[key];
                });
            }
            if (itemObj.statsByLv) {
                Object.keys(itemObj.statsByLv).forEach(key => {
                    if (totalStats[key] !== undefined) totalStats[key] += itemObj.statsByLv[key] * charLevel;
                });
            }
        }
    });

    return totalStats;
}

function formatStatValue(id, val) {
    if (id === 'attackSpeedRatio') return Math.round(val * 100) + '%';
    if (id === 'moveSpeed' || id === 'hpRegen' || id === 'attackRange' || id === 'visionRange') return val.toFixed(2);
    if (id === 'cooldownReduction') return Math.round(val) + ' (' + Math.round((val / (100 + val)) * 100) + '%)';
    if (['criticalStrikeChance', 'lifeSteal', 'omnisyphon', 'tenacity', 'penetrationDefenseRatio'].includes(id)) return (val * 100).toFixed(0) + '%';
    return Math.round(val);
}

function renderSingleStatColumn(stats) {
    let html = `<div style="flex:1;">`;
    let portraitHtml = '';
    if (currentCharacter) {
        portraitHtml = `
            <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:15px; position:relative; width:100%;">
                <div style="width:60px; height:60px; border-radius:50%; overflow:hidden; border:2px solid #ccc; margin:0 auto;">
                    <img src="images/${currentCharacter}.png" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:0.7em;\\'>${currentCharacter}</div>'">
                </div>
                <div style="position:absolute; bottom:-5px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.85); color:white; font-size:0.75em; padding:2px 6px; border-radius:8px; font-weight:bold; border:1px solid #555;">Lv.${charLevel}</div>
            </div>`;
    }
    html += portraitHtml;

    SUBSTATS.forEach(s => {
        if (stats[s.id] > 0) {
            html += `<div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px dashed #eee;">
                <span>${s.name}</span>
                <strong style="color:#2c3e50;">${formatStatValue(s.id, stats[s.id])}</strong>
            </div>`;
        }
    });
    html += `</div>`;
    return html;
}

function renderComparisonColumns(stats1, stats2) {
    let html = `<div style="flex:1; display:flex; gap:20px;">`;
    
    // Shared portrait
    let portraitHtml = '';
    if (currentCharacter) {
        portraitHtml = `
            <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:15px; width:100%; position:relative;">
                <div style="width:50px; height:50px; border-radius:50%; overflow:hidden; border:2px solid #ccc; margin: 0 auto;">
                    <img src="images/${currentCharacter}.png" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:0.6em;\\'>${currentCharacter}</div>'">
                </div>
                <div style="position:absolute; bottom:-5px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.85); color:white; font-size:0.65em; padding:2px 5px; border-radius:6px; font-weight:bold; border:1px solid #555;">Lv.${charLevel}</div>
            </div>`;
    }

    const commonStats = [];
    const diffStats = [];

    SUBSTATS.forEach(s => {
        const v1 = stats1[s.id] || 0;
        const v2 = stats2[s.id] || 0;
        if (v1 === 0 && v2 === 0) return;
        if (Math.round(v1*100) === Math.round(v2*100)) {
            commonStats.push({ id: s.id, name: s.name, v1, v2 });
        } else {
            diffStats.push({ id: s.id, name: s.name, v1, v2 });
        }
    });

    const renderRow = (item, isCommon) => {
        const color1 = isCommon ? '#333' : (item.v1 > item.v2 ? '#27ae60' : '#e74c3c');
        const color2 = isCommon ? '#333' : (item.v2 > item.v1 ? '#27ae60' : '#e74c3c');
        return `
        <div style="display:flex; align-items:center; padding:3px 0; border-bottom:1px dashed #eee; font-size:0.85em;">
            <div style="flex:1; text-align:right; font-weight:bold; color:${color1};">${item.v1 > 0 ? formatStatValue(item.id, item.v1) : '-'}</div>
            <div style="flex:1.5; text-align:center; color:#555; font-size:0.9em;">${item.name}</div>
            <div style="flex:1; text-align:left; font-weight:bold; color:${color2};">${item.v2 > 0 ? formatStatValue(item.id, item.v2) : '-'}</div>
        </div>`;
    };

    html += `<div style="flex:1; display:flex; flex-direction:column;">`;
    html += portraitHtml;
    
    html += `<div style="display:flex; justify-content:center; margin-bottom:5px; font-weight:bold; border-bottom:2px solid #ccc;">
        <span style="flex:1; text-align:right; color:#2980b9;">Route 1</span>
        <span style="flex:1.5;"></span>
        <span style="flex:1; text-align:left; color:#8e44ad;">Route 2</span>
    </div>`;

    commonStats.forEach(item => html += renderRow(item, true));
    diffStats.forEach(item => html += renderRow(item, false));

    html += `</div></div>`;
    return html;
}

// ==========================================
// MASTER LOGIC: VARIANT GENERATOR
// ==========================================

async function calculateAllVariants() {
    const resultOutput = document.getElementById('result-output');
    resultOutput.innerHTML = "Calculating Variants...";
    console.clear();

    if (selectedEpics.size === 0) {
        resultOutput.innerHTML = "Please select items first.";
        return;
    }

    // 1. Group Selected Items by Part
    // e.g. { Weapon: [A, B], Chest: [C], Head: [D, E] }
    const slots = {};
    selectedEpics.forEach(name => {
        const part = items[name].part;
        if (!slots[part]) slots[part] = [];
        slots[part].push(name);
    });

    // 2. Generate Cartesian Product (All valid combinations)
    // If you have 2 Weapons and 2 Heads, this creates 4 distinct builds
    const keys = Object.keys(slots);
    const combinations = cartesianProduct(keys.map(k => slots[k]));
    
    // 3. Run Optimizer for EACH combination
    let allResults = [];

    combinations.forEach(combo => {
        // combo is Array of strings: ["WeaponName", "ChestName", ...]
        const buildSet = new Set(combo);
        const routes = solveSpecificBuild(buildSet);
        
        // Tag these routes with the specific variant used
        routes.forEach(r => {
            r.variantItems = combo; // Save which items generated this route
        });

        allResults = [...allResults, ...routes];
    });

    if (allResults.length === 0) {
        resultOutput.innerHTML = "<p>No valid routes found for any combination.</p>";
        return;
    }

    // 4. Global Sort
    // We sort all variants together to find the absolute best setup
    allResults.sort((a, b) => {
        if (a.tier !== b.tier) return a.tier - b.tier;
        return a.distance - b.distance;
    });

    // 5. Deduplicate (Optional but recommended)
    // If Variant A and Variant B result in the EXACT same path and missing items, show one?
    // For now, let's just show them all so user sees options.

    // Reset selections on new calculation
    selectedRoutes = [];
    renderStatComparison();

    displayResults(allResults, resultOutput);
}

// Helper: Cartesian Product
function cartesianProduct(arrays) {
    return arrays.reduce((acc, curr) => 
        acc.flatMap(d => curr.map(e => [d, e].flat())), 
    [[]]);
}


// ==========================================
// CORE SOLVER (Solves 1 specific combination)
// ==========================================

function solveSpecificBuild(buildSet) {
    // --- STEP 1: CALCULATE NEEDS VS OWNED ---
    const neededCounts = {};
    const uniqueItemsToIgnore = new Set([
        "Alpha Sidewinder",
        "Black Mamba King",
        "Deathadder Queen",
        "Harmony in Full Bloom"
    ]);

    buildSet.forEach(epicName => {
        if (!uniqueItemsToIgnore.has(epicName) && items[epicName] && items[epicName].components) {
            items[epicName].components.forEach(mat => {
                neededCounts[mat] = (neededCounts[mat] || 0) + 1;
            });
        }
    });

    const ownedCounts = { "Shirt": 1, "Running Shoes": 1 };

    // Identify Base Weapon for THIS specific combination
    buildSet.forEach(epicName => {
        const epicData = items[epicName];
        if (epicData && epicData.part === "Weapon" && epicData.components) {
            epicData.components.forEach(comp => {
                if (BASE_WEAPONS.has(comp)) ownedCounts[comp] = 1;
            });
        }
    });

    const requiredMaterials = new Set();
    for (const [item, count] of Object.entries(neededCounts)) {
        const owned = ownedCounts[item] || 0;
        if (count - owned > 0) requiredMaterials.add(item);
    }
    
    if (requiredMaterials.size === 0) return []; // Should handle "Nothing needed" case in display

    // --- STEP 2: BITMASK & ZONES ---
    const materialList = Array.from(requiredMaterials);
    const TOTAL_ITEMS = materialList.length;
    const FULL_MASK = (1n << BigInt(TOTAL_ITEMS)) - 1n; 

    const allZones = Object.keys(mapData);
    const validZones = [];

    allZones.forEach(zone => {
        let mask = 0n;
        let hasItem = false;
        materialList.forEach((mat, idx) => {
            if (items[mat] && items[mat].locations && items[mat].locations.includes(zone)) {
                mask |= (1n << BigInt(idx));
                hasItem = true;
            }
        });
        if (hasItem) validZones.push({ id: zone, mask: mask, itemCount: countSetBits(mask) });
    });

    validZones.sort((a, b) => b.itemCount - a.itemCount);

    const suffixUnions = new Array(validZones.length).fill(0n);
    let currentSuffix = 0n;
    for (let i = validZones.length - 1; i >= 0; i--) {
        currentSuffix |= validZones[i].mask;
        suffixUnions[i] = currentSuffix;
    }

    // --- STEP 3: SEARCH ---
    const MAX_ZONES = 3; 
    let foundRoutes = [];

    function search(index, currentMask, currentPath) {
        const missingMask = FULL_MASK ^ currentMask;
        const missingCount = countSetBits(missingMask);
        const tier = getRouteTier(currentPath.length, missingCount);
        
        if (tier > 0) {
            foundRoutes.push({
                zones: [...currentPath],
                missingMask: missingMask,
                tier: tier
            });
            if (tier === 1 || tier === 2) return;
        }

        if (currentPath.length >= MAX_ZONES) return;

        if (index < validZones.length) {
            const potentialTotal = currentMask | suffixUnions[index];
            const potentialMissing = countSetBits(FULL_MASK ^ potentialTotal);
            let allowedDrones = 2;
            if (currentPath.length === 1) allowedDrones = 1;
            if (currentPath.length === 2) allowedDrones = 0;
            if (potentialMissing > allowedDrones) return; 
        }

        for (let i = index; i < validZones.length; i++) {
            const nextZone = validZones[i];
            if ((currentMask | nextZone.mask) === currentMask) continue;
            search(i + 1, currentMask | nextZone.mask, [...currentPath, nextZone.id]);
        }
    }

    search(0, 0n, []);

    // --- STEP 4: FORMAT ---
    return foundRoutes.map(route => {
        const missingItems = [];
        for(let i=0; i<TOTAL_ITEMS; i++) {
            if ((route.missingMask & (1n << BigInt(i))) !== 0n) {
                missingItems.push(materialList[i]);
            }
        }
        const { bestPath, dist } = (route.zones.length > 1) 
            ? getBestPermutation(route.zones) 
            : { bestPath: route.zones, dist: 0 };

        return {
            path: bestPath,
            drones: missingItems,
            distance: dist,
            tier: route.tier
        };
    });
}

// ==========================================
// UTILS
// ==========================================

function getRouteTier(zoneCount, droneCount) {
    if (zoneCount === 1) {
        if (droneCount === 0) return 1;
        if (droneCount === 1) return 2;
        if (droneCount === 2) return 3;
    } else if (zoneCount === 2) {
        if (droneCount === 0) return 4;
        if (droneCount === 1) return 5;
    } else if (zoneCount === 3) {
        if (droneCount === 0) return 6;
    }
    return 0; 
}

function getBestPermutation(zones) {
    const perms = getPermutations(zones);
    let bestDist = Infinity;
    let bestPath = [];
    perms.forEach(path => {
        const dist = calculatePathDistance(path);
        if (dist < bestDist) { bestDist = dist; bestPath = path; }
    });
    return { bestPath, dist: bestDist };
}

function calculatePathDistance(path) {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i+1];
        if (mapData[current].hasHyperloop) distance += 1; 
        else if (mapData[current].neighbors.includes(next)) distance += 1; 
        else distance += 100; // Heavy penalty for no hyperloop and non-neighbor
    }
    return distance;
}

function countSetBits(n) {
    let count = 0;
    while (n > 0n) { n &= (n - 1n); count++; }
    return count;
}

function getPermutations(arr) {
    if (arr.length === 0) return [[]];
    const firstEl = arr[0];
    const rest = arr.slice(1);
    const permsWithoutFirst = getPermutations(rest);
    const allPermutations = [];
    permsWithoutFirst.forEach(perm => {
        for (let i = 0; i <= perm.length; i++) {
            allPermutations.push([...perm.slice(0, i), firstEl, ...perm.slice(i)]);
        }
    });
    return allPermutations;
}

// ==========================================
// DISPLAY
// ==========================================

function displayResults(routes, container) {
    const topRoutes = routes.slice(0, 10); // Show top 10 now since we have variants
    
    let html = `<h3>Top Optimized Routes:</h3>`;
    
    generatedRoutes = topRoutes;

    topRoutes.forEach((r, index) => {
        let tierLabel = "";
        if(r.tier === 1) tierLabel = `<span style="background:#8e44ad; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px; font-weight:bold;">1Z / 0D</span>`;
        else if(r.tier === 2) tierLabel = `<span style="background:#9b59b6; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">1Z / 1D</span>`;
        else if(r.tier === 3) tierLabel = `<span style="background:#af7ac5; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">1Z / 2D</span>`;
        else if(r.tier === 4) tierLabel = `<span style="background:#27ae60; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">2Z / 0D</span>`;
        else if(r.tier === 5) tierLabel = `<span style="background:#f39c12; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">2Z / 1D</span>`;
        else if(r.tier === 6) tierLabel = `<span style="background:#2980b9; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">3Z / 0D</span>`;

        let droneHtml = r.drones.length > 0 
            ? `<span style="color:#e74c3c;">Need Drone: <strong>${r.drones.join(', ')}</strong></span>` 
            : `<span style="color:#27ae60;">No Drone Needed</span>`;

        // Create a summary of the variant (Build) used for this route
        // This is crucial if they selected 2 different weapons
        const variantSummary = r.variantItems.map(item => 
            `<img src="images/${item}.png" title="${item}" style="width:30px; height:30px; object-fit:contain; vertical-align:middle; border:1px solid #ddd; border-radius:3px; margin-right:2px;">`
        ).join('');

        html += `
        <div class="route-card" data-index="${index}" style="background: #fff; border:1px solid #ddd; border-left: 5px solid ${getColorForTier(r.tier)}; margin: 8px 0; padding: 12px; border-radius: 4px; cursor:pointer; transition:all 0.2s;">
            
            <div style="margin-bottom: 5px; font-size:0.8rem; color:#888; display:flex; align-items:center;">
                <strong style="margin-right:5px;">Build Variant:</strong> ${variantSummary}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size: 1.1rem; color:#333;">
                    ${tierLabel} 
                    <strong>${r.path.join(" ➔ ")}</strong>
                </div>
            </div>
            
            <div style="font-size:0.85em; margin-top:4px; padding-left: 5px;">
                ${droneHtml}
            </div>
        </div>`;
    });
    
    container.innerHTML = html;

    // Add click listeners for comparison
    const routeCards = container.querySelectorAll('.route-card');
    routeCards.forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.dataset.index);
            const route = generatedRoutes[idx];
            
            const existingIdx = selectedRoutes.findIndex(sr => sr === route);
            if (existingIdx !== -1) {
                // Deselect
                selectedRoutes.splice(existingIdx, 1);
                card.style.boxShadow = 'none';
                card.style.borderColor = '#ddd';
            } else {
                if (selectedRoutes.length >= 2) {
                    // Remove first
                    const removedRoute = selectedRoutes.shift();
                    const removedIdx = generatedRoutes.indexOf(removedRoute);
                    if (removedIdx !== -1) {
                        const rCard = container.querySelector(`.route-card[data-index="${removedIdx}"]`);
                        if (rCard) { rCard.style.boxShadow = 'none'; rCard.style.borderColor = '#ddd'; }
                    }
                }
                selectedRoutes.push(route);
            }
            
            // Apply styles to currently selected
            selectedRoutes.forEach((sr, i) => {
                const srIdx = generatedRoutes.indexOf(sr);
                if (srIdx !== -1) {
                    const rCard = container.querySelector(`.route-card[data-index="${srIdx}"]`);
                    if (rCard) {
                        rCard.style.boxShadow = '0 0 8px ' + (i === 0 ? 'rgba(41, 128, 185, 0.6)' : 'rgba(142, 68, 173, 0.6)');
                        rCard.style.borderColor = (i === 0 ? '#2980b9' : '#8e44ad');
                    }
                }
            });

            renderStatComparison();
        });
    });
}

function getColorForTier(tier) {
    if (tier === 1) return "#8e44ad"; 
    if (tier === 2) return "#9b59b6"; 
    if (tier === 3) return "#af7ac5"; 
    if (tier === 4) return "#27ae60"; 
    if (tier === 5) return "#f39c12"; 
    if (tier === 6) return "#2980b9"; 
    return "#ccc";
}