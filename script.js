// Global State: Keeps track of selected item names
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

// === UI RENDERING ===

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
    card.dataset.name = name; // Store name for easy finding later
    card.title = name;        // Tooltip on hover

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
        
        // Handle broken images in top panel too
        img.onerror = function() {
            this.style.display = 'none';
            div.innerText = name;
            div.style.fontSize = '0.7rem';
            div.style.textAlign = 'center';
        };

        div.appendChild(img);

        // Click to REMOVE
        div.addEventListener('click', () => {
            toggleSelection(name);
        });

        container.appendChild(div);
    });
}

// === ALGORITHM LOGIC ===

async function calculateRoute() {
    const resultOutput = document.getElementById('result-output');
    resultOutput.innerHTML = "Calculating...";
    console.clear();
    console.log("=== STARTING CALCULATION ===");

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

    const requiredList = Array.from(requiredMaterials);
    console.log("Required Items:", requiredList);

    const allZones = Object.keys(mapData);

    // 2. Pre-calculate Zone Contents
    const zoneContents = {}; 
    allZones.forEach(zone => {
        zoneContents[zone] = new Set();
        requiredList.forEach(mat => {
            // Safety Check: Does the item exist in our database?
            if (!items[mat]) {
                console.error(`CRITICAL ERROR: Item "${mat}" is required but not found in items list!`);
                return;
            }
            if (!items[mat].locations) {
                console.warn(`Warning: Item "${mat}" has no locations defined.`);
                return;
            }

            // Check if item is in this zone
            if (items[mat].locations.includes(zone)) {
                zoneContents[zone].add(mat);
            }
        });
    });

    // 3. Priority Tier System
    let results = [];
    
    console.log("--- Checking Priority 1: 2 Zones, 0 Drone ---");
    results = findRoutes(2, 0, allZones, zoneContents, requiredList);
    
    if (results.length === 0) {
        console.log("--- Checking Priority 2: 2 Zones, 1 Drone ---");
        results = findRoutes(2, 1, allZones, zoneContents, requiredList);
    }
    
    if (results.length === 0) {
        console.log("--- Checking Priority 3: 3 Zones, 0 Drone ---");
        results = findRoutes(3, 0, allZones, zoneContents, requiredList);
    }

    if (results.length === 0) {
        console.log("--- Checking Priority 4: 3 Zones, 1 Drone ---");
        results = findRoutes(3, 1, allZones, zoneContents, requiredList);
    }

    // 4. Display Results
    if (results.length === 0) {
        resultOutput.innerHTML = "<p>No valid route found (Max 3 zones, 1 drone).</p>";
    } else {
        const sortedResults = sortRoutesByDistance(results);
        displayResults(sortedResults, resultOutput);
    }
}

function findRoutes(routeSize, maxDrones, allZones, zoneContents, requiredList) {
    const validRoutes = [];
    const combinations = getCombinations(allZones, routeSize);

    // DEBUG: Limit log spam. Only log the first few failures.
    let debugCount = 0; 

    for (const zones of combinations) {
        // Gather found items
        const foundItems = new Set();
        zones.forEach(zone => {
            zoneContents[zone].forEach(item => foundItems.add(item));
        });

        // Identify missing
        const missingItems = requiredList.filter(item => !foundItems.has(item));

        if (missingItems.length <= maxDrones) {
            validRoutes.push({
                zones: zones,
                dronedItems: missingItems,
                foundItems: Array.from(foundItems)
            });
        } else {
            // DEBUG LOGGING: Why did this combination fail?
            if (routeSize === 2 && maxDrones === 1 && debugCount < 5) {
                console.log(`Rejected [${zones.join("+")}]: Missing ${missingItems.length} items: ${missingItems.join(", ")}`);
                debugCount++;
            }
        }
    }
    return validRoutes;
}

// === DISTANCE & PATHING ===

function sortRoutesByDistance(routes) {
    routes.forEach(route => {
        const permutations = getPermutations(route.zones);
        let bestDistance = Infinity;
        let bestPath = [];

        permutations.forEach(path => {
            const dist = calculatePathDistance(path);
            if (dist < bestDistance) {
                bestDistance = dist;
                bestPath = path;
            }
        });

        route.bestPath = bestPath;
        route.totalDistance = bestDistance;
    });

    return routes.sort((a, b) => a.totalDistance - b.totalDistance);
}

function calculatePathDistance(path) {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i+1];
        
        if (isConnected(current, next)) {
            distance += 1;
        } else {
            distance += 3; // Penalty for non-connected zones
        }
    }
    return distance;
}

function isConnected(zoneA, zoneB) {
    const data = mapData[zoneA];
    if (!data) return false;
    // Connected if Neighbor OR if current zone has Hyperloop
    if (data.neighbors.includes(zoneB)) return true;
    if (data.hasHyperloop) return true;
    return false;
}

// === MATH UTILS ===

function getCombinations(arr, size) {
    if (size === 1) return arr.map(i => [i]);
    const res = [];
    function backtrack(start, current) {
        if (current.length === size) {
            res.push([...current]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    backtrack(0, []);
    return res;
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

// === DISPLAY RESULTS ===

function displayResults(routes, container) {
    let html = `<h3>Top Routes:</h3>`;
    
    routes.slice(0, 5).forEach((r, index) => {
        const droneText = r.dronedItems.length > 0 
            ? `<br><span style="color: #e74c3c;">Drone Order: ${r.dronedItems.join(', ')}</span>` 
            : `<br><span style="color: #2ecc71;">No Drone Needed</span>`;
            
        html += `
        <div style="background: #fff; border:1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px;">
            <strong style="font-size: 1.1rem;">#${index + 1}: ${r.bestPath.join(" ➔ ")}</strong> 
            ${droneText}
        </div>`;
    });
    
    container.innerHTML = html;
}