// ==========================================
// GLOBAL STATE
// ==========================================
const selectedEpics = new Set();
let currentFilter = "All"; // Track active filter

// HARDCODED BASE WEAPONS
const BASE_WEAPONS = new Set([
    "Cotton Gloves", "Bamboo", "Short Rod", "Hammer", "Whip", 
    "Baseball", "Razor", "Bow", "Short Crossbow", "Walther PPK", 
    "Fedorova", "Long Rifle", "Hatchet", "Kitchen Knife", 
    "Rusty Sword", "Twin Blades", "Short Spear", "Steel Chain", 
    "Needle", "Starter Guitar", "Lens", "Glass Bead"
]);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Filters
    setupFilters();
    
    // 2. Initialize Grid
    renderMainGrid();

    // 3. Setup Calculate Button
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateAllVariants);
    }
});

// ==========================================
// UI: FILTERS & RENDERING
// ==========================================

function setupFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Visual Update
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Logic Update
            currentFilter = btn.dataset.filter;
            renderMainGrid();
        });
    });
}

function renderMainGrid() {
    const grid = document.getElementById('epic-item-grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    for (const [name, data] of Object.entries(items)) {
        // Check Filter
        if (data.type === "Epic") {
            // If filter is "All", show everything. 
            // Else, check if item.part matches currentFilter
            if (currentFilter === "All" || data.part === currentFilter) {
                const card = createItemCard(name);
                grid.appendChild(card);
            }
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
        selectedEpics.add(name);
    }
    updateMainGridVisuals();
    updateSelectedPanel();
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
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
        };

        div.appendChild(img);
        div.addEventListener('click', () => toggleSelection(name)); 
        container.appendChild(div);
    });
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
    buildSet.forEach(epicName => {
        if (items[epicName] && items[epicName].components) {
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
    if (zoneCount === 1 && droneCount <= 2) return 1; 
    if (zoneCount === 2 && droneCount === 0) return 2; 
    if (zoneCount === 2 && droneCount === 1) return 3; 
    if (zoneCount === 3 && droneCount === 0) return 4; 
    if (zoneCount === 3 && droneCount === 1) return 5; 
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
        else distance += 2; 
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
    
    topRoutes.forEach((r, index) => {
        let tierLabel = "";
        if(r.tier === 1) tierLabel = `<span style="background:#8e44ad; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px; font-weight:bold;">1 ZONE</span>`;
        else if(r.tier === 2) tierLabel = `<span style="background:#27ae60; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">2Z / 0D</span>`;
        else if(r.tier === 3) tierLabel = `<span style="background:#f39c12; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">2Z / 1D</span>`;
        else if(r.tier === 4) tierLabel = `<span style="background:#2980b9; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">3Z / 0D</span>`;
        else if(r.tier === 5) tierLabel = `<span style="background:#c0392b; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">3Z / 1D</span>`;

        let droneHtml = r.drones.length > 0 
            ? `<span style="color:#e74c3c;">Need Drone: <strong>${r.drones.join(', ')}</strong></span>` 
            : `<span style="color:#27ae60;">No Drone Needed</span>`;

        // Create a summary of the variant (Build) used for this route
        // This is crucial if they selected 2 different weapons
        const variantSummary = r.variantItems.map(item => 
            `<img src="images/${item}.png" title="${item}" style="width:20px; height:20px; object-fit:contain; vertical-align:middle; border:1px solid #ddd; border-radius:3px; margin-right:2px;">`
        ).join('');

        html += `
        <div style="background: #fff; border:1px solid #ddd; border-left: 5px solid ${getColorForTier(r.tier)}; margin: 8px 0; padding: 12px; border-radius: 4px;">
            
            <div style="margin-bottom: 5px; font-size:0.8rem; color:#888; display:flex; align-items:center;">
                <strong style="margin-right:5px;">Build Variant:</strong> ${variantSummary}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size: 1.1rem; color:#333;">
                    ${tierLabel} 
                    <strong>${r.path.join(" ➔ ")}</strong>
                </div>
                <div style="font-weight:bold; color:#777; font-size:0.9em;">Dist: ${r.distance}</div>
            </div>
            
            <div style="font-size:0.85em; margin-top:4px; padding-left: 5px;">
                ${droneHtml}
            </div>
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