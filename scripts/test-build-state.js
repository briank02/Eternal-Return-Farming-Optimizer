const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const scriptPath = path.join(__dirname, '..', 'docs', 'script.js');
const source = fs.readFileSync(scriptPath, 'utf8');
const fixtureData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'data.json'), 'utf8'));

const context = {
    assert,
    console,
    fixtureData,
    URL,
    URLSearchParams,
    localStorage: {
        getItem() { return null; },
        setItem() {}
    },
    document: {
        addEventListener() {}
    }
};

const assertions = `
assert.equal(BUILD_CONFIG[BUILD_TYPES.EARLY].grades.join(','), 'Epic');
assert.equal(BUILD_CONFIG[BUILD_TYPES.LATE].grades.join(','), 'Legend,Mythic');
assert.equal(BUILD_CONFIG[BUILD_TYPES.EARLY].routeEnabled, true);
assert.equal(BUILD_CONFIG[BUILD_TYPES.LATE].routeEnabled, false);
assert.equal(resolveInitialBuildType('?mode=late', BUILD_TYPES.EARLY), BUILD_TYPES.LATE);
assert.equal(resolveInitialBuildType('?mode=early', BUILD_TYPES.LATE), BUILD_TYPES.EARLY);
assert.equal(resolveInitialBuildType('', BUILD_TYPES.LATE), BUILD_TYPES.LATE);
assert.equal(resolveInitialBuildType('?mode=unsupported', 'unsupported'), BUILD_TYPES.EARLY);
assert.notEqual(buildFilterState[BUILD_TYPES.EARLY].substats, buildFilterState[BUILD_TYPES.LATE].substats);

items = {
    'Epic Blade A': { type: 'Epic', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 10 } },
    'Epic Blade B': { type: 'Epic', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 20 } },
    'Legend Blade': { type: 'Legend', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 30 } },
    'Mythic Blade': { type: 'Mythic', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 40 } },
    'Legend Chest': { type: 'Legend', part: 'Chest', passiveSkill: { name: 'Late Passive' } },
    'Material': { type: 'Common', part: 'Misc' }
};

assert.equal(isItemEligibleForBuild(items['Epic Blade A'], BUILD_TYPES.EARLY), true);
assert.equal(isItemEligibleForBuild(items['Legend Blade'], BUILD_TYPES.EARLY), false);
assert.equal(isItemEligibleForBuild(items['Legend Blade'], BUILD_TYPES.LATE), true);
assert.equal(isItemEligibleForBuild(items['Mythic Blade'], BUILD_TYPES.LATE), true);
assert.equal(isItemEligibleForBuild(items.Material, BUILD_TYPES.LATE), false);

addItemToBuild('Epic Blade A', BUILD_TYPES.EARLY);
addItemToBuild('Epic Blade B', BUILD_TYPES.EARLY);
assert.equal(earlyBuild.size, 2, 'Early builds preserve same-slot route variants');
assert.equal(lateBuild.size, 0, 'Early and late selections are independent');

addItemToBuild('Legend Blade', BUILD_TYPES.LATE);
addItemToBuild('Mythic Blade', BUILD_TYPES.LATE);
addItemToBuild('Legend Chest', BUILD_TYPES.LATE);
assert.equal(lateBuild.size, 2, 'Late builds allow only one item per equipment slot');
assert.equal(lateBuild.has('Legend Blade'), false);
assert.equal(lateBuild.has('Mythic Blade'), true);
assert.equal(earlyBuild.size, 2, 'Late selections do not modify the early build');

buildSelectableStats(BUILD_TYPES.EARLY);
assert.equal(SELECTABLE_STATS.some(stat => stat.id === 'attackPower'), true);
buildPassiveSkillOptions(BUILD_TYPES.LATE);
assert.equal(PASSIVE_SKILL_OPTIONS.some(skill => skill.id === 'Late Passive'), true);

assert.equal(solveEarlyBuildRoute(new Set(['Legend Blade'])).length, 0,
    'The route solver must reject late-game equipment');
assert.equal(hasFeasibleRouteWithinZones(['Mythic Blade'], 2), false,
    'Route feasibility checks must remain Early-only');

items = fixtureData.items;
for (const slot of EQUIPMENT_SLOTS) {
    assert.equal(Object.values(items).some(item => item.part === slot && isItemEligibleForBuild(item, BUILD_TYPES.EARLY)), true,
        \`Real data must contain an Early item for \${slot}\`);
    assert.equal(Object.values(items).some(item => item.part === slot && isItemEligibleForBuild(item, BUILD_TYPES.LATE)), true,
        \`Real data must contain a Late item for \${slot}\`);
}
`;

vm.runInNewContext(`${source}\n${assertions}`, context, { filename: scriptPath });
console.log('Validated early/late build state, eligibility, slots, filters, and route isolation.');
