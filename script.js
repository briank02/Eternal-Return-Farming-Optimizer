document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the container where we want to put items
    const epicItemGrid = document.getElementById('epic-item-grid');

    // 2. Loop through every item in our 'items' database
    for (const [itemName, itemData] of Object.entries(items)) {
        
        // We only want to show "Epic" items in the middle selection panel
        if (itemData.type === "Epic") {
            createItemCard(itemName, epicItemGrid);
        }
    }
});

// Helper function to create the HTML for an item
function createItemCard(name, container) {
    const card = document.createElement('div');
    card.classList.add('item-card');
    
    // 1. Create the Image Element
    const img = document.createElement('img');
    // We assume the image is in the 'images' folder and is a PNG
    img.src = `images/${name}.png`; 
    img.alt = name; // Accessibility text if image fails to load
    img.classList.add('item-icon');

    // 2. Fallback: If image is missing, show text
    img.onerror = function() {
        this.style.display = 'none'; // Hide broken image
        const textFallback = document.createElement('span');
        textFallback.innerText = name;
        card.appendChild(textFallback);
        card.style.justifyContent = 'center'; // Center the text
    };

    // 3. Tooltip: Show name when hovering
    card.title = name;

    card.appendChild(img);
    
    // 4. Click Listener (Same as before)
    card.addEventListener('click', () => {
        toggleItemSelection(card, name);
    });

    container.appendChild(card);
}

// Simple function to handle clicking
function toggleItemSelection(cardElement, name) {
    // Toggle a visual class
    cardElement.classList.toggle('selected');
    console.log("Clicked:", name);
}

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
    
    // If nothing needed, stop
    if (requiredMaterials.size === 0) {
        resultOutput.innerHTML = "No materials needed (or no item selected).";
        return;
    }

    const requiredList = Array.from(requiredMaterials);
    const allZones = Object.keys(mapData);

    // 2. Pre-calculate: What items are in each zone?
    const zoneContents = {}; 
    allZones.forEach(zone => {
        zoneContents[zone] = new Set();
        requiredList.forEach(mat => {
            if (items[mat].locations.includes(zone)) {
                zoneContents[zone].add(mat);
            }
        });
    });

    // === THE SMART TIER SYSTEM ===
    
    // Priority 1: 2 Zones, 0 Drone
    let results = findRoutes(2, 0, allZones, zoneContents, requiredList);
    
    // Priority 2: 2 Zones, 1 Drone
    if (results.length === 0) results = findRoutes(2, 1, allZones, zoneContents, requiredList);
    
    // Priority 3: 3 Zones, 0 Drone
    if (results.length === 0) results = findRoutes(3, 0, allZones, zoneContents, requiredList);

    // Priority 4: 3 Zones, 1 Drone
    if (results.length === 0) results = findRoutes(3, 1, allZones, zoneContents, requiredList);


    // 3. Display Results
    if (results.length === 0) {
        resultOutput.innerHTML = "No valid route found within limits (Max 3 zones, 1 drone).";
    } else {
        // We sort results by distance (travel time) before showing
        const sortedResults = sortRoutesByDistance(results);
        displayResults(sortedResults, resultOutput);
    }
}

// === CORE LOGIC ===

/**
 * Finds valid routes for a specific constraints (e.g., "Size 2, Max 1 Drone")
 */
function findRoutes(routeSize, maxDrones, allZones, zoneContents, requiredList) {
    const validRoutes = [];
    const combinations = getCombinations(allZones, routeSize);

    for (const zones of combinations) {
        // 1. Gather everything found in these zones
        const foundItems = new Set();
        zones.forEach(zone => {
            zoneContents[zone].forEach(item => foundItems.add(item));
        });

        // 2. Identify what is missing
        const missingItems = requiredList.filter(item => !foundItems.has(item));

        // 3. Check if missing items can be droned
        if (missingItems.length <= maxDrones) {
            // Success! We found a valid group.
            validRoutes.push({
                zones: zones,
                dronedItems: missingItems, // These are the items we buy
                foundItems: Array.from(foundItems) // For display
            });
        }
    }
    return validRoutes;
}

// === DISTANCE & PATHING ===

function sortRoutesByDistance(routes) {
    // For each valid group of zones, we need to find the shortest permutation
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

    // Sort by total distance (lowest first)
    return routes.sort((a, b) => a.totalDistance - b.totalDistance);
}

// Calculates distance: A -> B -> C
function calculatePathDistance(path) {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i+1];
        
        // Distance Logic:
        // 1. Neighbors = 1
        // 2. Teleporter (Hyperloop) = 1
        // 3. Otherwise = Distance is technically "infinity" (invalid direct move), 
        //    but in ER, you usually walk through zones. For now, let's treat non-neighbors 
        //    as "high cost" or implement a BFS distance finder if you want exact walking.
        
        if (isConnected(current, next)) {
            distance += 1;
        } else {
            // If not connected, you have to walk through other zones. 
            // Simplified: Add penalty.
            distance += 3; 
        }
    }
    return distance;
}

function isConnected(zoneA, zoneB) {
    const data = mapData[zoneA];
    // Connected if Neighbor OR if zoneA has a Hyperloop
    if (data.neighbors.includes(zoneB)) return true;
    if (data.hasHyperloop) return true;
    return false;
}

// === UTILS ===

// Helper to get Combinations (Order doesn't matter: [A,B] is same as [B,A])
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

// Helper to get Permutations (Order matters: A->B is different from B->A)
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

// Pretty Print Results
function displayResults(routes, container) {
    let html = `<h3>Top Routes Found:</h3>`;
    
    // Show top 5 routes
    routes.slice(0, 5).forEach((r, index) => {
        const droneText = r.dronedItems.length > 0 
            ? `<span style="color: red;">(Drone: ${r.dronedItems.join(', ')})</span>` 
            : `<span style="color: green;">(No Drone)</span>`;
            
        html += `
        <div style="border:1px solid #ccc; margin: 10px 0; padding: 10px;">
            <strong>#${index + 1}: ${r.bestPath.join(" ➔ ")}</strong> <br>
            Distance Score: ${r.totalDistance} <br>
            ${droneText}
        </div>`;
    });
    
    container.innerHTML = html;
}