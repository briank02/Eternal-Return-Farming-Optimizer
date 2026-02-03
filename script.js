// ==========================================
// GLOBAL STATE
// ==========================================
const selectedEpics = new Set();

// Hardcoded list of items that are considered "Base Weapons"
// These are the items characters spawn with.
const BASE_WEAPONS = new Set([
    "Cotton Gloves", "Bamboo", "Short Rod", "Hammer", "Whip", 
    "Baseball", "Razor", "Bow", "Short Crossbow", "Walther PPK", 
    "Fedorova", "Long Rifle", "Hatchet", "Kitchen Knife", 
    "Rusty Sword", "Twin Blades", "Short Spear", "Steel Chain", 
    "Needle", "Starter Guitar", "Lens", "Glass Bead"
]);

document.addEventListener('DOMContentLoaded', () => {
    renderMainGrid();
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateRoute);
    }
});

// ==========================================
// UI RENDERING
// ==========================================

function renderMainGrid() {
    const grid = document.getElementById('epic-item-grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    for (const [name, data] of Object.entries(items)) {
        if (data.type === "Epic") {
            const card = createItemCard(name);
            grid.appendChild(card);
        }
    }
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
        card.style.fontSize = '0.8rem';
        card.style.textAlign = 'center';
    };

    card.appendChild(img);
    card.addEventListener('click', () => toggleSelection(name));
    return card;
}

function toggleSelection(name) {
    if (selectedEpics.has(name)) {
        selectedEpics.delete(name);
    } else {
        selectedEpics.add(name);
    }
    updateMainGridVisuals();
    updateSelectedPanel();
}

function updateMainGridVisuals() {
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
        container.innerHTML = '<p class="empty-msg">Click items below to add them to your build.</p>';
        return;
    }

    selectedEpics.forEach(name => {
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
        };

        div.appendChild(img);
        div.addEventListener('click', () => toggleSelection(name)); 
        container.appendChild(div);
    });
}

// ==========================================
// ALGORITHM LOGIC
// ==========================================

async function calculateRoute() {
    const resultOutput = document.getElementById('result-output');
    resultOutput.innerHTML = "Calculating...";
    
    // --- STEP 1: CALCULATE REQUIRED MATERIALS ---
    // Start with universally free items
    const starterItems = new Set(["Shirt", "Running Shoes"]);
    
    // Scan selected Epics to find the "Base Weapon"
    selectedEpics.forEach(epicName => {
        const epicData = items[epicName];
        if (epicData && epicData.part === "Weapon" && epicData.components) {
            // Check which component is in our valid BASE_WEAPONS list
            epicData.components.forEach(comp => {
                if (BASE_WEAPONS.has(comp)) {
                    starterItems.add(comp);
                }
            });
        }
    });

    console.log("Free Starter Items:", Array.from(starterItems));

    const requiredMaterials = new Set();
    
    // Build required list, respecting the "One Free Copy" rule
    selectedEpics.forEach(epicName => {
        if (items[epicName] && items[epicName].components) {
            items[epicName].components.forEach(mat => {
                if (starterItems.has(mat)) {
                    // We have a free copy! Consume it so it can't be used twice.
                    starterItems.delete(mat);
                } else {
                    // We need to find this on the map
                    requiredMaterials.add(mat);
                }
            });
        }
    });
    
    if (requiredMaterials.size === 0) {
        resultOutput.innerHTML = "No materials needed (All covered by starter items).";
        return;
    }

    // --- STEP 2: BITMASK SETUP ---
    const materialList = Array.from(requiredMaterials);
    const TOTAL_ITEMS = materialList.length;
    // Use BigInt for bitmask to support >32 items
    const FULL_MASK = (1n << BigInt(TOTAL_ITEMS)) - 1n; 

    // --- STEP 3: ZONE PROCESSING ---
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

        if (hasItem) {
            validZones.push({
                id: zone,
                mask: mask,
                itemCount: countSetBits(mask) 
            });
        }
    });

    // Sort rich zones first for speed
    validZones.sort((a, b) => b.itemCount - a.itemCount);

    // --- STEP 4: SUFFIX UNIONS (PRUNING) ---
    const suffixUnions = new Array(validZones.length).fill(0n);
    let currentSuffix = 0n;
    for (let i = validZones.length - 1; i >= 0; i--) {
        currentSuffix |= validZones[i].mask;
        suffixUnions[i] = currentSuffix;
    }

    // --- STEP 5: RECURSIVE SEARCH ---
    const MAX_ZONES = 3; 
    let foundRoutes = [];

    function search(index, currentMask, currentPath) {
        const missingMask = FULL_MASK ^ currentMask;
        const missingCount = countSetBits(missingMask);
        
        // Check Validity & Tier
        const tier = getRouteTier(currentPath.length, missingCount);
        
        if (tier > 0) {
            foundRoutes.push({
                zones: [...currentPath],
                missingMask: missingMask,
                tier: tier
            });
            // Optimization: If we found a Tier 1 (1 Zone) or Tier 2 (2 Zone Perfect), 
            // deeper recursion is unnecessary for this path.
            if (tier === 1 || tier === 2) return;
        }

        if (currentPath.length >= MAX_ZONES) return;

        // Pruning
        if (index < validZones.length) {
            const potentialTotal = currentMask | suffixUnions[index];
            const potentialMissing = countSetBits(FULL_MASK ^ potentialTotal);
            
            // Allow up to 2 drones if currently at 0 zones (for 1-zone builds)
            // Otherwise strictly 1 drone max
            const allowedDrones = (currentPath.length === 0) ? 2 : 1;
            
            if (potentialMissing > allowedDrones) return; 
        }

        for (let i = index; i < validZones.length; i++) {
            const nextZone = validZones[i];
            if ((currentMask | nextZone.mask) === currentMask) continue;
            search(i + 1, currentMask | nextZone.mask, [...currentPath, nextZone.id]);
        }
    }

    search(0, 0n, []);

    if (foundRoutes.length === 0) {
        resultOutput.innerHTML = "<p>No valid routes found.</p>";
        return;
    }

    // --- STEP 6: PROCESS & SORT ---
    const processedRoutes = foundRoutes.map(route => {
        const missingItems = [];
        for(let i=0; i<TOTAL_ITEMS; i++) {
            if ((route.missingMask & (1n << BigInt(i))) !== 0n) {
                missingItems.push(materialList[i]);
            }
        }

        // Distance Calculation
        // If 1 zone, distance is 0. Else optimize path.
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

    processedRoutes.sort((a, b) => {
        if (a.tier !== b.tier) return a.tier - b.tier;
        return a.distance - b.distance;
    });

    displayResults(processedRoutes, resultOutput);
}

// ==========================================
// HELPER LOGIC
// ==========================================

function getRouteTier(zoneCount, droneCount) {
    // Tier 1: 1 Zone, 0-2 Drones (God Tier)
    if (zoneCount === 1 && droneCount <= 2) return 1;
    
    // Tier 2: 2 Zones, 0 Drones
    if (zoneCount === 2 && droneCount === 0) return 2;
    
    // Tier 3: 2 Zones, 1 Drone
    if (zoneCount === 2 && droneCount === 1) return 3;
    
    // Tier 4: 3 Zones, 0 Drones
    if (zoneCount === 3 && droneCount === 0) return 4;
    
    // Tier 5: 3 Zones, 1 Drone
    if (zoneCount === 3 && droneCount === 1) return 5;
    
    return 0; // Invalid
}

function getBestPermutation(zones) {
    const perms = getPermutations(zones);
    let bestDist = Infinity;
    let bestPath = [];

    perms.forEach(path => {
        const dist = calculatePathDistance(path);
        if (dist < bestDist) {
            bestDist = dist;
            bestPath = path;
        }
    });
    return { bestPath, dist: bestDist };
}

function calculatePathDistance(path) {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i+1];
        
        if (mapData[current].hasHyperloop) {
            distance += 1; 
        } else if (mapData[current].neighbors.includes(next)) {
            distance += 1; 
        } else {
            distance += 2; 
        }
    }
    return distance;
}

function countSetBits(n) {
    let count = 0;
    while (n > 0n) {
        n &= (n - 1n);
        count++;
    }
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
            const permWithFirst = [...perm.slice(0, i), firstEl, ...perm.slice(i)];
            allPermutations.push(permWithFirst);
        }
    });
    return allPermutations;
}

// ==========================================
// DISPLAY
// ==========================================

function displayResults(routes, container) {
    const topRoutes = routes.slice(0, 5);
    
    let html = `<h3>Top Efficient Routes:</h3>`;
    
    topRoutes.forEach((r, index) => {
        let tierLabel = "";
        
        if(r.tier === 1) tierLabel = `<span style="background:#8e44ad; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px; font-weight:bold;">1 ZONE</span>`;
        if(r.tier === 2) tierLabel = `<span style="background:#27ae60; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">2Z / 0D</span>`;
        if(r.tier === 3) tierLabel = `<span style="background:#f39c12; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">2Z / 1D</span>`;
        if(r.tier === 4) tierLabel = `<span style="background:#2980b9; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">3Z / 0D</span>`;
        if(r.tier === 5) tierLabel = `<span style="background:#c0392b; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">3Z / 1D</span>`;

        let droneHtml = "";
        if (r.drones.length > 0) {
            droneHtml = `<div style="font-size:0.85em; color:#e74c3c; margin-top:4px; padding-left: 5px;">Need Drone: <strong>${r.drones.join(', ')}</strong></div>`;
        } else {
            droneHtml = `<div style="font-size:0.85em; color:#27ae60; margin-top:4px; padding-left: 5px;">No Drone Needed</div>`;
        }

        html += `
        <div style="background: #fff; border:1px solid #ddd; border-left: 5px solid ${getColorForTier(r.tier)}; margin: 8px 0; padding: 12px; border-radius: 4px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size: 1.1rem; color:#333;">
                    ${tierLabel} 
                    <strong>${r.path.join(" ➔ ")}</strong>
                </div>
                <div style="font-weight:bold; color:#777; font-size:0.9em;">Dist: ${r.distance}</div>
            </div>
            ${droneHtml}
        </div>`;
    });
    
    container.innerHTML = html;
}

function getColorForTier(tier) {
    if (tier === 1) return "#8e44ad"; 
    if (tier === 2) return "#27ae60"; 
    if (tier === 3) return "#f39c12"; 
    if (tier === 4) return "#2980b9"; 
    if (tier === 5) return "#c0392b"; 
    return "#ccc";
}