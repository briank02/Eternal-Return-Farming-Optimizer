// ==========================================
// GLOBAL STATE & INITIALIZATION
// ==========================================
const selectedEpics = new Set();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize the Main Grid
    renderMainGrid();

    // 2. Setup Calculate Button
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

    grid.innerHTML = ''; // Clear existing content

    // Loop through data.js items
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

    // Image Handling
    const img = document.createElement('img');
    img.src = `images/${name}.png`; // Assumes .png and exact casing
    img.alt = name;
    img.classList.add('item-icon');
    
    // Fallback: If image fails to load, show text
    img.onerror = function() {
        this.style.display = 'none';
        card.innerText = name;
        card.style.fontSize = '0.8rem';
        card.style.textAlign = 'center';
    };

    card.appendChild(img);

    // Click Event
    card.addEventListener('click', () => {
        toggleSelection(name);
    });

    return card;
}

function toggleSelection(name) {
    // Add or Remove from State
    if (selectedEpics.has(name)) {
        selectedEpics.delete(name);
    } else {
        selectedEpics.add(name);
    }

    // Update UI
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

    container.innerHTML = ''; // Clear current

    if (selectedEpics.size === 0) {
        container.innerHTML = '<p class="empty-msg">Click items below to add them to your build.</p>';
        return;
    }

    selectedEpics.forEach(name => {
        // Create small card for top panel
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
        div.addEventListener('click', () => toggleSelection(name)); // Click to REMOVE
        container.appendChild(div);
    });
}

// ==========================================
// ALGORITHM LOGIC (OPTIMIZED)
// ==========================================

async function calculateRoute() {
    const resultOutput = document.getElementById('result-output');
    resultOutput.innerHTML = "Calculating...";
    
    // 1. Identify Required Materials
    const requiredMaterials = new Set();
    selectedEpics.forEach(epicName => {
        if (items[epicName] && items[epicName].components) {
            items[epicName].components.forEach(mat => requiredMaterials.add(mat));
        }
    });
    
    if (requiredMaterials.size === 0) {
        resultOutput.innerHTML = "No materials needed.";
        return;
    }

    // 2. Map Items to Bitmask Indices (Use BigInt for >32 items)
    const materialList = Array.from(requiredMaterials);
    const materialMap = {}; 
    materialList.forEach((mat, idx) => {
        materialMap[mat] = idx;
    });

    const TOTAL_ITEMS = materialList.length;
    const FULL_MASK = (1n << BigInt(TOTAL_ITEMS)) - 1n; // Binary: 1111...

    // 3. Prepare Zone Data
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

    // Heuristic: Check richer zones first to find good routes faster
    validZones.sort((a, b) => b.itemCount - a.itemCount);

    // 4. Optimization: Suffix Unions (Lookahead Pruning)
    // Allows us to see if a path is doomed before finishing it
    const suffixUnions = new Array(validZones.length).fill(0n);
    let currentSuffix = 0n;
    for (let i = validZones.length - 1; i >= 0; i--) {
        currentSuffix |= validZones[i].mask;
        suffixUnions[i] = currentSuffix;
    }

    // 5. Recursive Search
    // Constraints: Max 3 zones, Max 1 drone
    const MAX_ZONES = 3; 
    const MAX_DRONES = 1;
    let foundRoutes = [];

    function search(index, currentMask, currentPath) {
        // A. Check Success
        const missingMask = FULL_MASK ^ currentMask;
        const missingCount = countSetBits(missingMask);
        
        // Only accept if missing items <= MAX_DRONES
        if (missingCount <= MAX_DRONES) {
            // Determine Tier immediately
            const tier = getRouteTier(currentPath.length, missingCount);
            
            // Only save valid Tiers (1-4)
            if (tier > 0) {
                 foundRoutes.push({
                    zones: [...currentPath],
                    missingMask: missingMask,
                    tier: tier
                });
            }
            
            // Optimization: If we found a perfect route (0 missing), 
            // adding more zones just makes it worse (higher tier/distance).
            if (missingCount === 0) return;
        }

        // B. Stop if max depth reached
        if (currentPath.length >= MAX_ZONES) return;

        // C. Pruning (Lookahead)
        if (index < validZones.length) {
            const potentialTotal = currentMask | suffixUnions[index];
            const potentialMissing = countSetBits(FULL_MASK ^ potentialTotal);
            // If even adding ALL remaining zones won't fix the drones, stop.
            if (potentialMissing > MAX_DRONES) return; 
        }

        // D. Branching
        for (let i = index; i < validZones.length; i++) {
            const nextZone = validZones[i];
            
            // Skip if zone adds absolutely nothing new
            if ((currentMask | nextZone.mask) === currentMask) continue;

            search(i + 1, currentMask | nextZone.mask, [...currentPath, nextZone.id]);
        }
    }

    search(0, 0n, []);

    if (foundRoutes.length === 0) {
        resultOutput.innerHTML = "<p>No valid route found (Max 3 zones, 1 drone).</p>";
        return;
    }

    // 6. Process Paths & Distance
    const processedRoutes = foundRoutes.map(route => {
        // Decode missing items back to names
        const missingItems = [];
        for(let i=0; i<TOTAL_ITEMS; i++) {
            if ((route.missingMask & (1n << BigInt(i))) !== 0n) {
                missingItems.push(materialList[i]);
            }
        }

        // Calculate Best Path Order
        const { bestPath, dist } = getBestPermutation(route.zones);

        return {
            path: bestPath,
            drones: missingItems,
            distance: dist,
            tier: route.tier
        };
    });

    // 7. Sort by Tier Rules
    // Priority: Tier 1 > Tier 2 > Tier 3 > Tier 4 > Distance
    processedRoutes.sort((a, b) => {
        if (a.tier !== b.tier) return a.tier - b.tier; // Lower tier is better
        return a.distance - b.distance; // Shorter distance is better
    });

    displayResults(processedRoutes, resultOutput);
}

// ==========================================
// HELPER LOGIC
// ==========================================

// Returns 1-4 based on user preference, or 0 if invalid
function getRouteTier(zoneCount, droneCount) {
    if (zoneCount === 2 && droneCount === 0) return 1;
    if (zoneCount === 2 && droneCount === 1) return 2;
    if (zoneCount === 3 && droneCount === 0) return 3;
    if (zoneCount === 3 && droneCount === 1) return 4;
    return 0; // Invalid (e.g. 1 zone, or >3 zones)
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
    // Start distance is 0, we only count movement costs
    for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i+1];
        
        // RULE 1: If current zone has Hyperloop, can go ANYWHERE (Cost 1)
        if (mapData[current].hasHyperloop) {
            distance += 1;
        } 
        // RULE 2: If moving to neighbor (Walking), Cost 1
        else if (mapData[current].neighbors.includes(next)) {
            distance += 1;
        }
        // RULE 3: Not connected & No Hyperloop. 
        // Cost 2 (Walk to neighbor w/ loop + Teleport)
        else {
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
    // Only show top 5 relevant routes
    const topRoutes = routes.slice(0, 5);
    
    let html = `<h3>Top Efficient Routes:</h3>`;
    
    topRoutes.forEach((r, index) => {
        // Styling based on Tier
        let tierLabel = "";
        let droneHtml = "";
        
        // Tier Labels for clarity
        if(r.tier === 1) tierLabel = `<span style="background:#27ae60; color:white; padding:2px 6px; border-radius:4px; font-size:0.7em; margin-right:5px;">2Z / 0D</span>`;
        if(r.tier === 2) tierLabel = `<span style="background:#f39c12; color:white; padding:2px 6px; border-radius:4px; font-size:0.7em; margin-right:5px;">2Z / 1D</span>`;
        if(r.tier === 3) tierLabel = `<span style="background:#2980b9; color:white; padding:2px 6px; border-radius:4px; font-size:0.7em; margin-right:5px;">3Z / 0D</span>`;
        if(r.tier === 4) tierLabel = `<span style="background:#c0392b; color:white; padding:2px 6px; border-radius:4px; font-size:0.7em; margin-right:5px;">3Z / 1D</span>`;

        if (r.drones.length > 0) {
            droneHtml = `<div style="font-size:0.85em; color:#c0392b; margin-top:4px;">Drone: <strong>${r.drones.join(', ')}</strong></div>`;
        } else {
            droneHtml = `<div style="font-size:0.85em; color:#27ae60; margin-top:4px;">No Drone Needed</div>`;
        }

        html += `
        <div style="background: #fff; border:1px solid #ddd; border-left: 5px solid ${getColorForTier(r.tier)}; margin: 8px 0; padding: 12px; border-radius: 4px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size: 1.1rem; color:#333;">
                    ${tierLabel} 
                    <strong>${r.path.join(" ➔ ")}</strong>
                </div>
                <div style="font-weight:bold; color:#777;">Dist: ${r.distance}</div>
            </div>
            ${droneHtml}
        </div>`;
    });
    
    container.innerHTML = html;
}

function getColorForTier(tier) {
    if (tier === 1) return "#27ae60"; // Green
    if (tier === 2) return "#f39c12"; // Orange
    if (tier === 3) return "#2980b9"; // Blue
    if (tier === 4) return "#c0392b"; // Red
    return "#ccc";
}