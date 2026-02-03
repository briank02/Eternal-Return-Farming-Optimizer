// Map Data
const mapData = {
    "Alley": {
        neighbors: ["Gas Station", "Police Station", "Temple"],
        hasHyperloop: false
    },
    "Temple": {
        neighbors: ["Alley", "Police Station", "Stream"],
        hasHyperloop: true
    },
    "Police Station": {
        neighbors: ["Alley", "Temple", "Fire Station", "Stream"],
        hasHyperloop: false
    },
    "Stream": {
        neighbors: ["Temple", "Police Station", "Pond", "Hospital"],
        hasHyperloop: true
    },
    "Gas Station": {
        neighbors: ["Archery Range", "School", "Fire Station", "Alley"],
        hasHyperloop: true
    },
    "Fire Station": {
        neighbors: ["Gas Station", "School", "Police Station", "Research Center", "Pond"],
        hasHyperloop: false
    },
    "Pond": {
        neighbors: ["Fire Station", "Stream", "Hospital"],
        hasHyperloop: false
    },
    "Hospital": {
        neighbors: ["Pond", "Stream", "Factory", "Cemetery"],
        hasHyperloop: true
    },
    "Archery Range": {
        neighbors: ["Gas Station", "School", "Hotel"],
        hasHyperloop: false
    },
    "School": {
        neighbors: ["Archery Range", "Gas Station", "Fire Station", "Research Center", "Forest", "Hotel"],
        hasHyperloop: true
    },
    "Research Center": {
        neighbors: ["School", "Fire Station", "Forest", "Cemetery"],
        hasHyperloop: false
    },
    "Cemetery": {
        neighbors: ["Hospital", "Research Center", "Factory", "Chapel"],
        hasHyperloop: false
    },
    "Factory": {
        neighbors: ["Hospital", "Cemetery", "Chapel", "Dock"],
        hasHyperloop: true
    },
    "Hotel": {
        neighbors: ["Archery Range", "School", "Forest", "Beach"],
        hasHyperloop: true
    },
    "Forest": {
        neighbors: ["Hotel", "School", "Research Center", "Chapel", "Uptown", "Beach"],
        hasHyperloop: false
    },
    "Chapel": {
        neighbors: ["Forest", "Cemetery", "Factory", "Warehouse", "Uptown"],
        hasHyperloop: true
    },
    "Beach": {
        neighbors: ["Hotel", "Forest", "Uptown"],
        hasHyperloop: false
    },
    "Uptown": {
        neighbors: ["Beach", "Forest", "Chapel", "Warehouse"],
        hasHyperloop: true
    },
    "Warehouse": {
        neighbors: ["Uptown", "Chapel", "Dock"],
        hasHyperloop: false
    },
    "Dock": {
        neighbors: ["Warehouse", "Factory"],
        hasHyperloop: false
    }
};

// Item Data
const items = {
    // Common Items
    // Weapon
    "Cotton Gloves": { type: "Common", locations: ["Warehouse", "Gas Station", "Fire Station", "Factory"] },
    "Bamboo": { type: "Common", locations: ["Pond", "Temple", "Archery Range", "Forest"] },
    "Short Rod": { type: "Common", locations: ["Archery Range", "Cemetery", "Chapel", "School"] },
    "Hammer": { type: "Common", locations: ["Warehouse", "Stream", "Fire Station", "Factory"] },
    "Whip": { type: "Common", locations: ["Uptown", "Archery Range", "Cemetery", "Chapel"] },
    "Baseball": { type: "Common", locations: ["Beach", "Alley", "School"] },
    "Razor": { type: "Common", locations: ["Hotel", "Hospital", "Factory", "Chapel"] },
    "Bow": { type: "Common", locations: ["Pont", "Stream", "Archery Range", "Chapel"] },
    "Short Crossbow": { type: "Common", locations: ["Pond", "Archery Range", "Forest"] },
    "Walther PPK": { type: "Common", locations: ["Warehouse", "Hotel", "Police Station", "Factory"] },
    "Fedorova": { type: "Common", locations: ["Warehouse", "Hotel", "Police Station", "Factory"] },
    "Long Rifle": { type: "Common", locations: ["Uptown", "Police Station", "Fire Station", "Chapel"] },
    "Hatchet": { type: "Common", locations: ["Fire Station", "Forest", "Factory", "Chapel"] },
    "Kitchen Knife": { type: "Common", locations: ["Dock", "Uptown", "Hotel", "School"] },
    "Rusty Sword": { type: "Common", locations: ["Temple", "Archery Range", "Forest", "Chapel"] },
    "Twin Blades": { type: "Common", locations: ["Dock", "Beach", "Fire Station", "Temple"] },
    "Short Spear": { type: "Common", locations: ["Beach", "Temple", "Archery Range", "Factory"] },
    "Steel Chain": { type: "Common", locations: ["Dock", "Police Station", "Cemetery"] },
    "Needle": { type: "Common", locations: ["Uptown", "Hotel", "Fire Station", "Hospital"] },
    "Starter Guitar": { type: "Common", locations: ["Beach", "Uptown", "Chapel", "School"] },
    "Lens": { type: "Common", locations: ["Hotel", "Temple", "Chapel"] },
    "Glass Bead": { type: "Common", locations: ["Alley", "Temple", "Chapel", "School"] },
    // Chest
    "Windbreaker": { type: "Common", locations: ["Dock", "Beach", "School"] },
    "Monk's Robe": { type: "Common", locations: ["Temple", "Archery Range", "Cemetery"] },
    "Wetsuit": { type: "Common", locations: ["Dock", "Pond", "Beach"] },
    "Shirt": { type: "Common", locations: ["Stream", "Gas Station", "Chapel"] },
    // Head
    "Hairband": { type: "Common", locations: ["Warehouse", "Pond", "Stream", "Hotel", "Temple", "Chapel"] },
    "Hat": { type: "Common", locations: ["Warehouse", "Uptown", "Gas Station", "Temple", "Archery Range", "Forest"] },
    "Bike Helmet": { type: "Common", locations: ["Uptown", "Gas Station", "Fire Station", "Forest", "Factory"] },
    "Mask": { type: "Common", locations: ["Uptown", "Factory", "School"] },
    // Arm
    "Watch": { type: "Common", locations: ["Dock", "Uptown", "Gas Station", "Police Station", "Hospital", "Factory"] },
    "Bandage": { type: "Common", locations: ["Dock", "Fire Station", "Hospital", "Forest", "Factory", "School"] },
    "Bracelet": { type: "Common", locations: ["Warehouse", "Uptown", "Alley", "Hotel", "Hospital", "Cemetery"] },
    // Leg
    "Slippers": { type: "Common", locations: ["Warehouse", "Stream", "School"] },
    "Running Shoes": { type: "Common", locations: ["Beach", "Archery Range", "Factory"] },
    "Tights": { type: "Common", locations: ["Uptown", "Hospital", "Forest"] },
    "Clogs": { type: "Common", locations: ["Pond", "Temple", "Forest"] },
    // Misc
    "Scissors": { type: "Common", locations: ["Dock", "Uptown", "Alley", "Hospital", "Archery Range", "School"]},
    "Fountain Pen": { type: "Common", locations: [, "Uptown", "Alley", "Hotel", "Fire Station", "School"]},
    "Pickaxe": { type: "Common", locations: ["Warehouse", "Beach", "Alley", "Temple", "Cemetery", "Forest"]},
    "Branch": { type: "Common", locations: ["Dock", "Warehouse", "Pond", "Stream", "Beach", "Uptown", "Alley", "Gas Station", "Hotel", "Police Station", "Fire Station", "Hospital", "Temple", "Archery Range", "Cemetery", "Forest", "Factory", "Chapel", "School"] },
    "Stone": { type: "Common", locations: ["Dock", "Warehouse", "Pond", "Stream", "Beach", "Uptown", "Alley", "Gas Station", "Hotel", "Police Station", "Fire Station", "Hospital", "Temple", "Archery Range", "Cemetery", "Forest", "Factory", "Chapel", "School"] },
    "Iron Ball": { type: "Common", locations: ["Stream", "Uptown", "Police Station", "Fire Station", "Archery Range", "Factory"]},
    "Glass Bottle": { type: "Common", locations: ["Warehouse", "Beach", "Alley", "Hospital", "Archery Range", "Chapel"]},
    "Playing Cards": { type: "Common", locations: ["Stream", "Hotel", "Fire Station", "Chapel"]},
    "Chalk": { type: "Common", locations: ["Stream", "Factory", "School", "Chapel"]},
    "Feather": { type: "Common", locations: ["Dock", "Warehouse", "Pond", "Temple", "Archery Range", "Forest"]},
    "Flower": { type: "Common", locations: ["Pond", "Stream", "Uptown", "Temple", "Cemetery", "Forest"]},
    "Ribbon": { type: "Common", locations: ["Pond", "Warehouse", "Uptown", "Police Station", "Cemetery", "School"]},
    "Cross": { type: "Common", locations: ["Alley", "Cemetery", "Chapel", "School"]},
    "Binoculars": { type: "Common", locations: ["Police Station", "Archery Range", "Forest"]},
    "Magazine": { type: "Common", locations: ["Hotel", "Police Station", "Factory"]},
    "Ice": { type: "Common", locations: ["Warehouse", "Stream", "Hotel", "Forest"]},
    "Nail": { type: "Common", locations: ["Alley", "Hotel", "Fire Station", "Archery Range", "Factory", "Chapel"]},
    "Leather": { type: "Common", locations: ["Dock", "Warehouse", "Pond", "Stream", "Beach", "Uptown", "Alley", "Gas Station", "Hotel", "Police Station", "Fire Station", "Hospital", "Temple", "Archery Range", "Cemetery", "Forest", "Factory", "Chapel", "School"] },
    "Turtle Shell": { type: "Common", locations: ["Dock", "Pond", "Stream", "Beach", "Temple", "Forest"]},
    "Rubber": { type: "Common", locations: ["Warehouse", "Beach", "Gas Station", "Fire Station", "Hospital", "Factory"]},
    "Scrap Metal": { type: "Common", locations: ["Dock", "Stream", "Beach", "Gas Station", "Fire Station", "Factory", "School"]},
    "Lighter": { type: "Common", locations: ["Dock", "Uptown", "Alley", "Police Station", "Cemetery", "Forest", "School"]},
    "Laser Pointer": { type: "Common", locations: ["Police Station", "Hospital", "Forest", "School"]},
    "Stallion Medal": { type: "Common", locations: ["Dock", "Gas Station", "Police Station", "Temple", "Cemetery"]},
    "Battery": { type: "Common", locations: ["Warehouse", "Gas Station", "Hotel", "Fire Station", "Hospital", "Temple", "Factory"]},
    "Oil": { type: "Common", locations: ["Pond", "Beach", "Gas Station", "Hotel", "Hospital", "Factory"]},
    "Cloth": { type: "Common", locations: ["Uptown", "Gas Station", "Hotel", "Temple", "Cemetery", "Chapel"]},
    "Gemstone": { type: "Common", locations: ["Dock", "Pond", "Stream", "Beach", "Alley", "Temple", "Forest"]},
    "Paper": { type: "Common", locations: ["Pond", "Hotel", "Police Station", "Hospital", "Factory", "School"]},
    "Gunpowder": { type: "Common", locations: ["Stream", "Police Station", "Archery Range", "Cemetery", "Chapel"]},
    "Chemicals": { type: "Common", locations: ["Beach", "Gas Station", "Fire Station", "Hospital", "Cemetery", "Factory"]},
    "Graphite": { type: "Common", locations: ["Pond", "Police Station", "Archery Range", "Cemetery", "Forest", "Chapel", "School"]},
    "Plastic": { type: "Common", locations: ["Warehouse", "Stream", "Beach", "Alley", "Fire Station", "Factory"]},
    "Piano Wire": { type: "Common", locations: ["Stream", "Uptown", "Alley", "Hotel", "Police Station", "Archery Range", "Chapel"]},
    "Thread": { type: "Common", locations: ["Dock", "Pond", "Beach", "Fire Station", "Archery Range", "School"]},

    // Epic Items
    // Weapon
    // Glove
    "One Inch Punch": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Cotton Gloves", "Leather", "Turtle Shell", "Feather"],
    },
    "Divine Fist": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Cotton Gloves", "Scrap Metal", "Cloth", "Cross"],
    },
    "Bloodwing Knuckles": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Cotton Gloves", "Scrap Metal", "Gemstone", "Feather"],
    },
    "Frost Petal Hand": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Cotton Gloves", "Leather", "Lighter", "Ice"],
    },
    "Buddha's Palm": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Cotton Gloves", "Leather", "Turtle Shell", "Paper"],
    },
    "Brasil Gauntlet": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Cotton Gloves", "Scrap Metal", "Cloth", "Oil"],
    },
    "White Claw Punch": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Cotton Gloves", "Leather", "Lighter", "Chalk"],
    },
    // Tonfa
    "Tactical Tonfa": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Bamboo", "Branch", "Stallion Medal", "Fountain Pen"],
    },
    "Mai Sok": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Bamboo", "Branch", "Chalk", "Turtle Shell"],
    },
    "Plasma Tonfa": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Bamboo", "Branch", "Battery", "Graphite"],
    },
    "Holster Tonfa": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Bamboo", "Branch", "Stallion Medal", "Watch"],
    },
    // Bat
    "Vajra": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Rod", "Scrap Metal", "Glass Bottle", "Stone"],
    },
    "Pakua Chang": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Rod", "Scrap Metal", "Gemstone", "Thread"],
    },
    "Statue of Soteria": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Rod", "Scrap Metal", "Graphite", "Leather"],
    },
    "Mallet": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Rod", "Branch", "Nail", "Piano Wire"],
    },
    "Spy Umbrella": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Rod", "Branch", "Cloth", "Chemicals"],
    },
    // Hammer
    "Fang Mace": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Hammer", "Nail", "Iron Ball", "Stallion Medal"],
    },
    "Hammer of Dagda": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Hammer", "Nail", "Graphite", "Lighter"],
    },
    "Hammer of Thor": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Hammer", "Rubber", "Playing Cards", "Battery"],
    },
    "Weight of the World": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Hammer", "Rubber", "Playing Cards", "Glass Bottle"],
    },
    "Bookmaster": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Hammer", "Rubber", "Paper", "Leather"],
    },
    // Whip
    "Thunder Whip": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Whip", "Stallion Medal", "Pickaxe", "Gemstone"],
    },
    "Gleipnir": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Whip", "Stallion Medal", "Oil", "Bandage"],
    },
    "Plasma Whip": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Whip", "Nail ", "Battery", "Fountain Pen"],
    },
    "Cathode Lash": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Whip", "Feather", "Flower", "Gemstone"],
    },
    // Throw
    "Incendiary Bomb": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Baseball", "Gunpowder", "Battery", "Lighter"],
    },
    "David's Sling": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Baseball", "Fountain Pen", "Rubber", "Cross"],
    },
    "Smoke Bomb": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Baseball", "Gunpowder", "Chalk", "Chemicals"],
    },
    "Sticky Bomb": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Baseball", "Gunpowder", "Battery", "Fountain Pen"],
    },
    "Ruthenium Marble": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Baseball", "Fountain Pen", "Pickaxe", "Gemstone"],
    },
    // Shuriken
    "Cards of Tyranny": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Razor", "Playing Cards", "Paper", "Leather"],
    },
    "Mystic Jade Charm": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Razor", "Playing Cards", "Chalk", "Paper"],
    },
    "Fuhma Shuriken": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Razor", "Piano Wire", "Stallion Medal", "Graphite"],
    },
    "Azure Dagger": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Razor", "Branch", "Chalk", "Chemicals"],
    },
    "Flechette": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Razor", "Branch", "Scrap Metal", "Chalk"],
    },
    // Bow
    "Ancient Bolt": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Bow", "Piano Wire", "Oil", "Branch"],
    },
    "Golden-Ratio Bow": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Bow", "Piano Wire", "Pickaxe", "Gemstone"],
    },
    "Twinbow": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Bow", "Piano Wire", "Nail", "Chemicals"],
    },
    "Jebe's Altered Bow": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Bow", "Rubber", "Gunpowder", "Feather"],
    },
    "Elemental Bow": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Bow", "Rubber", "Gemstone", "Thread"],
    },
    // Crossbow
    "The Legend of The General": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Crossbow", "Piano Wire", "Scrap Metal", "Oil"],
    },
    "Ballista": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Crossbow", "Piano Wire", "Scrap Metal", "Nail"],
    },
    "Sniper Crossbow": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Crossbow", "Branch", "Laser Pointer", "Rubber"],
    },
    "Poisoned Crossbow": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Crossbow", "Branch", "Scrap Metal", "Chemicals"],
    },
    // Pistol
    "Elegance": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Walther PPK", "Leather", "Laser Pointer", "Feather"],
    },
    "Electron Blaster": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Walther PPK", "Oil", "Fountain Pen", "Battery"],
    },
    "Magnum-Boa": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Walther PPK", "Oil", "Fountain Pen", "Scrap Metal"],
    },
    "Glock 48": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Walther PPK", "Leather", "Fountain Pen", "Paper"],
    },
    "Stampede": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Walther PPK", "Piano Wire", "Plastic", "Scrap Metal"],
    },
    // Assault Rifle
    "Type 95": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Fedorova", "Gunpowder", "Piano Wire", "Chalk"],
    },
    "AK-12": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Fedorova", "Gunpowder", "Piano Wire", "Chalk"],
    },
    "XCR": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Fedorova", "Rubber", "Paper", "Lighter"],
    },
    "Gold Rush": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Fedorova", "Plastic", "Pickaxe", "Gemstone"],
    },
    "Agni": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Fedorova", "Plastic", "Fountain Pen", "Paper"],
    },
    // Sniper Rifle
    "Tac-50": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Long Rifle", "Gemstone", "Nail", "Paper"],
    },
    "NTW-20": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Long Rifle", "Gemstone", "Nail", "Laser Pointer"],
    },
    "Polaris": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Long Rifle", "Laser Pointer", "Piano Wire", "Chalk"],
    },
    "Gauss Rifle": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Long Rifle", "Laser Pointer", "Piano Wire", "Paper"],
    },
    // Axe
    "Beam Axe": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Hatchet", "Branch", "Scrap Metal", "Laser Pointer"],
    },
    "Santa Muerte": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Hatchet", "Thread", "Graphite", "Lighter"],
    },
    "Scythe": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Hatchet", "Thread", "Pickaxe", "Gemstone"],
    },
    "Parashu": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Hatchet", "Branch", "Feather", "Playing Cards"],
    },
    "Harpe": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Hatchet", "Thread", "Pickaxe", "Oil"],
    },
    // Dagger
    "Carnwennan": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Kitchen Knife", "Branch", "Flower", "Feather"],
    },
    "Mount Slicer": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Kitchen Knife", "Branch", "Flower", "Paper"],
    },
    "Vibroblade": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Kitchen Knife", "Fountain Pen", "Battery", "Piano Wire"],
    },
    "Damascus Steel Thorn": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Kitchen Knife", "Fountain Pen", "Scissors", "Chemicals"],
    },
    "Maharaja": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Kitchen Knife", "Branch", "Rubber", "Battery"],
    },
    "Highlander Dirk": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Kitchen Knife", "Fountain Pen", "Pickaxe", "Gemstone"],
    },
    // Two-Handed Sword
    "Thuan Thien": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Rusty Sword", "Oil", "Scrap Metal", "Turtle Shell"],
    },
    "Arondight": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Rusty Sword", "Oil", "Gemstone", "Cross"],
    },
    "Excalibur": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Rusty Sword", "Oil", "Scrap Metal", "Cross"],
    },
    "Plasma Sword": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Rusty Sword", "Oil", "Battery", "Graphite"],
    },
    "Monohoshizao": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Rusty Sword", "Chemicals", "Scrap Metal", "Pickaxe"],
    },
    "Hovud": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Rusty Sword", "Oil", "Glass Bottle", "Stone"],
    },
    "Arcane Edge": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Rusty Sword", "Oil", "Scrap Metal", "Fountain Pen"],
    },
    // Dual Swords
    "Divine Dual Swords": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Twin Blades", "Graphite", "Lighter", "Chalk"],
    },
    "Asura": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Twin Blades", "Graphite", "Lighter", "Gemstone"],
    },
    "Black Butterfly": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Twin Blades", "Pickaxe", "Scrap Metal", "Chemicals"],
    },
    "Dioscuri": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Twin Blades", "Pickaxe", "Battery", "Graphite"],
    },
    "Hook Swords": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Twin Blades", "Pickaxe", "Scrap Metal", "Nail"],
    },
    // Spear
    "Eighteen Foot Spear": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Spear", "Scrap Metal", "Flower", "Gemstone"],
    },
    "Lance of Poseidon": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Spear", "Branch", "Nail", "Oil"],
    },
    "Fangtian Huaji": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Spear", "Branch", "Feather", "Fountain Pen"],
    },
    "Dragon Guandao": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Short Spear", "Scrap Metal", "Pickaxe", "Chalk"],
    },
    // Nunchaku
    "Sharper": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Steel Chain", "Plastic", "Piano Wire", "Plastic"],
    },
    "The Smiting Dragon": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Steel Chain", "Plastic", "Nail", "Chemicals"],
    },
    "Vibro Nunchaku": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Steel Chain", "Plastic", "Nail", "Battery"],
    },
    "Blue 3": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Steel Chain", "Plastic", "Chemicals", "Glass Bottle"],
    },
    // Rapier
    "Sword of Justice": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Needle", "Scrap Metal", "Flower", "Bandage"],
    },
    "Durendal Mk2": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Needle", "Scrap Metal", "Flower", "Laser Pointer"],
    },
    "Volticletto": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Needle", "Scrap Metal", "Battery", "Piano Wire"],
    },
    "Red Panther": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Needle", "Scrap Metal", "Oil", "Gemstone"],
    },
    "Esprit": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Needle", "Scrap Metal", "Oil", "Glass Bottle"],
    },
    "Flamberge": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Needle", "Scrap Metal", "Piano Wire", "Plastic"],
    },
    // Guitar
    "Bohemian": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Starter Guitar", "Gemstone", "Lighter", "Playing Cards"],
    },
    "Stairway to Heaven": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Starter Guitar", "Gemstone", "Laser Pointer", "Cross"],
    },
    "Purple Haze": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Starter Guitar", "Gemstone", "Scissors", "Glass Bottle"],
    },
    "Satisfaction": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Starter Guitar", "Battery", "Fountain Pen", "Stallion Medal"],
    },
    "The Wall": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Starter Guitar", "Battery", "Piano Wire", "Chalk"],
    },
    "Teen Spirit": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Starter Guitar", "Battery", "Oil", "Lighter"],
    },
    // Camera
    "Mirrorless": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Battery", "Graphite", "Lens", "Piano Wire"],
    },
    "Laser Designator": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Fountain Pen", "Laser Pointer", "Lens", "Paper"],
    },
    "V.I.C.G": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Gunpowder", "Laser Pointer", "Lens", "Battery"],
    },
    "Instant Camera": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Battery", "Graphite", "Lens", "Paper"],
    },
    // Arcana
    "The Hermit": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Glass Bead", "Oil", "Pickaxe", "Cross"],
    },
    "The Hierophant": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Glass Bead", "Ice", "Nail", "Paper"],
    },
    "Temperance": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Glass Bead", "Oil", "Cross", "Paper"],
    },
    "The Star": { 
        type: "Epic", 
        part: "Weapon",
        components: ["Glass Bead", "Ice", "Stallion Medal", "Piano Wire"],
    },

    //Chest
    "Doctor's Gown": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Bandage", "Leather", "Cloth"],
    },
    "Cardinal Robes": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Cloth", "Oil", "Bandage"],
    },
    "Sunset Armor": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Leather", "Thread", "Gemstone"],
    },
    "Covert Agent Uniform": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Bandage", "Flower", "Stallion Medal"],
    },
    "Optical Camouflage Suit": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Rubber", "Glass Bottle", "Stone"],
    },
    "Rocker's Jacket": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Branch", "Chemicals", "Iron Ball"],
    },
    "Crusader Armor": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Thread", "Leather", "Cross"],
    },
    "Amazoness Armor": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Thread", "Leather", "Scissors"],
    },
    "Dragon Dobok": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Scissors", "Cloth", "Turtle Shell"],
    },
    "Commander's Armor": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Graphite", "Leather", "Lighter"],
    },
    "Butler's Suit": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Branch", "Ribbon", "Feather"],
    },
    "EOD Suit": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Branch", "Plastic", "Rubber"],
    },
    "Tuxedo": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Branch", "Ribbon", "Cloth"],
    },
    "High Priest Robes": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Cloth", "Gemstone", "Thread"],
    },
    "Changpao": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Scissors", "Cloth", "Feather"],
    },
    "Turnout Coat": { 
        type: "Epic", 
        part: "Chest",
        components: ["Shirt", "Branch", "Ribbon", "Plastic"],
    },
    
    // Head
    "Virtuous Outlaw": { 
        type: "Epic", 
        part: "Head",
        components: ["Cloth", "Feather", "Flower", "Gemstone"],
    },
    "Crystal Tiara": { 
        type: "Epic", 
        part: "Head",
        components: ["Hairband", "Branch", "Lighter", "Gemstone"],
    },
    "Motorcycle Helmet": { 
        type: "Epic", 
        part: "Head",
        components: ["Bike Helmet", "Battery", "Piano Wire", "Scrap Metal"],
    },
    "Tactical OPS Helmet": { 
        type: "Epic", 
        part: "Head",
        components: ["Hat", "Scissors", "Bike Helmet", "Battery"],
    },
    "Helm of Banneret": { 
        type: "Epic", 
        part: "Head",
        components: ["Hairband", "Scrap Metal", "Chemicals", "Graphite"],
    },
    "Imperial Crown": { 
        type: "Epic", 
        part: "Head",
        components: ["Hat", "Pickaxe", "Gemstone", "Ribbon"],
    },
    "Imperial Burgonet": { 
        type: "Epic", 
        part: "Head",
        components: ["Hairband", "Scrap Metal", "Chemicals", "Feather"],
    },
    "Mohawk Headgear": { 
        type: "Epic", 
        part: "Head",
        components: ["Bike Helmet", "Stone", "Plastic", "Nail"],
    },
    "Vigilante": { 
        type: "Epic", 
        part: "Head",
        components: ["Bike Helmet", "Stone", "Plastic", "Gunpowder"],
    },
    "Diadem": { 
        type: "Epic", 
        part: "Head",
        components: ["Hat", "Pickaxe", "Flower", "Gemstone"],
    },
    "Cowboy Hat": { 
        type: "Epic", 
        part: "Head",
        components: ["Hat", "Scissors", "Paper", "Lighter"],
    },
    "Plasma Helmet": { 
        type: "Epic", 
        part: "Head",
        components: ["Hat", "Thread", "Battery", "Graphite"],
    },
    "Welding Helmet": { 
        type: "Epic", 
        part: "Head",
        components: ["Hat", "Scissors", "Bike Helmet", "Plastic"],
    },
    "White Witch Hat": { 
        type: "Epic", 
        part: "Head",
        components: ["Hairband", "Branch", "Paper", "Lighter"],
    },
    "Fox Mask": { 
        type: "Epic", 
        part: "Head",
        components: ["Hairband", "Feather", "Flower", "Gemstone"],
    },
    "Sport Sunglasses": { 
        type: "Epic", 
        part: "Head",
        components: ["Hairband", "Battery", "Piano Wire", "Scrap Metal"],
    },
    "The Sailor": { 
        type: "Epic", 
        part: "Head",
        components: ["Hat", "Scissors", "Flower", "Gemstone"],
    },
    // Arm/Accessory
    "Corrupting Touch": { 
        type: "Epic", 
        part: "Arm",
        components: ["Oil", "Bandage", "Chemicals", "Glass Bottle"],
    },
    "Sword Stopper": { 
        type: "Epic", 
        part: "Arm",
        components: ["Bandage", "Leather", "Scrap Metal", "Nail"],
    },
    "Draupnir": { 
        type: "Epic", 
        part: "Arm",
        components: ["Bracelet", "Pickaxe", "Gemstone", "Bandage"],
    },
    "Vital Sign Sensor": { 
        type: "Epic", 
        part: "Arm",
        components: ["Watch", "Chemicals", "Battery", "Piano WIre"],
    },
    "Creed of the Knight": { 
        type: "Epic", 
        part: "Arm",
        components: ["Turtle Shell", "Leather", "Bandage", "Gunpowder"],
    },
    "Sheath of Shah Jahan": { 
        type: "Epic", 
        part: "Arm",
        components: ["Scrap Metal", "Chemicals", "Leather", "Gemstone"],
    },
    "Burnished Aegis": { 
        type: "Epic", 
        part: "Arm",
        components: ["Turtle Shell", "Leather", "Graphite", "Lighter"],
    },
    "Tindalos Band": { 
        type: "Epic", 
        part: "Arm",
        components: ["Bracelet", "Lighter", "Watch", "Gemstone"],
    },
    "Nightingale": { 
        type: "Epic", 
        part: "Arm",
        components: ["Bandage", "Feather", "Flower", "Gemstone"],
    },
    "Plasma Arc": { 
        type: "Epic", 
        part: "Arm",
        components: ["Turtle Shell", "Leather", "Battery", "Graphite"],
    },
    "Smart Band": { 
        type: "Epic", 
        part: "Arm",
        components: ["Watch", "Battery", "Piano Wire", "Scrap Metal"],
    },
    "Minuteman Armband": { 
        type: "Epic", 
        part: "Arm",
        components: ["Bandage", "Gunpowder", "Flower", "Gemstone"],
    },
    "Sports Watch": { 
        type: "Epic", 
        part: "Arm",
        components: ["Watch", "Chemicals", "Fountain Pen", "Paper"],
    },
    "White Crane Fan": { 
        type: "Epic", 
        part: "Arm",
        components: ["Nail", "Feather", "Flower", "Gemstone"],
    },
    "Laced Quiver": { 
        type: "Epic", 
        part: "Arm",
        components: ["Feather", "Branch", "Oil", "Bandage"],
    },
    "Music Box": { 
        type: "Epic", 
        part: "Arm",
        components: ["Cloth", "Branch", "Battery", "Graphite"],
    },
    "Schrodinger's Box": { 
        type: "Epic", 
        part: "Arm",
        components: ["Cloth", "Branch", "Chemicals", "Glass Bottle"],
    },
    "Veritas Lux Mea": { 
        type: "Epic", 
        part: "Arm",
        components: ["Ribbon", "Feather", "Flower", "Gemstone"],
    },

    // Leg
    "Hiking Boots": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Scissors", "Leather", "Cloth"],
    },
    "Glacier Crampons": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Scissors", "Piano Wire", "Plastic"],
    },
    "Steel Knee Pads": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Leather", "Rubber", "Scrap Metal"],
    },
    "Feather Boots": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Oil", "Leather", "Feather"],
    },
    "Maverick Runner": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Iron Ball", "Fountain Pen", "Paper"],
    },
    "StraitJacket Sneakers": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Scissors", "Paper", "Lighter"],
    },
    "Bucephalus": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Nail", "Glass Bottle", "Stone"],
    },
    "White Rhinos": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Oil", "Leather", "Nail"],
    },
    "Tachyon Brace": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Battery", "Piano Wire", "Scrap Metal"],
    },
    "SCV": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Iron Ball", "Piano Wire", "Battery"],
    },
    "Stellar Steps": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Nail", "Battery", "Graphite"],
    },
    "Cowboy Boots": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Thread", "Leather", "Cloth"],
    },
    "Gladiator": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Thread", "Piano Wire", "Plastic"],
    },
    "Delta Red": { 
        type: "Epic", 
        part: "Leg",
        components: ["Running Shoes", "Iron Ball", "Lighter", "Gemstone"],
    }
};