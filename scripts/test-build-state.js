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
assert.notEqual(recommendationStateByType[BUILD_TYPES.EARLY].priorities, recommendationStateByType[BUILD_TYPES.LATE].priorities);
assert.notEqual(recommendationStateByType[BUILD_TYPES.EARLY].passiveSkills, recommendationStateByType[BUILD_TYPES.LATE].passiveSkills);

items = {
    'Epic Blade A': { type: 'Epic', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 10 } },
    'Epic Blade B': { type: 'Epic', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 20 } },
    'Legend Blade': { type: 'Legend', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 30 } },
    'Mythic Blade': { type: 'Mythic', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 40 } },
    'Legend Chest': { type: 'Legend', part: 'Chest', passiveSkill: { name: 'Late Passive' } },
    'Legend Head': { type: 'Legend', part: 'Head' },
    'Legend Arm': { type: 'Legend', part: 'Arm' },
    'Legend Leg': { type: 'Legend', part: 'Leg' },
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
assert.equal(isLateBuildComplete(lateBuild), false, 'Partial late builds are not comparison-ready');
addItemToBuild('Legend Head', BUILD_TYPES.LATE);
addItemToBuild('Legend Arm', BUILD_TYPES.LATE);
addItemToBuild('Legend Leg', BUILD_TYPES.LATE);
assert.equal(isLateBuildComplete(lateBuild), true, 'A late build is complete only when every slot is filled');
const lateSnapshot = createLateBuildSnapshot(lateBuild);
assert.deepEqual(Array.from(lateSnapshot), ['Mythic Blade', 'Legend Chest', 'Legend Head', 'Legend Arm', 'Legend Leg']);
lateBuild.delete('Legend Leg');
assert.equal(lateSnapshot.includes('Legend Leg'), true, 'Comparison snapshots are independent from later build edits');

buildSelectableStats(BUILD_TYPES.EARLY);
assert.equal(SELECTABLE_STATS.some(stat => stat.id === 'attackPower'), true);
buildPassiveSkillOptions(BUILD_TYPES.LATE);
assert.equal(PASSIVE_SKILL_OPTIONS.some(skill => skill.id === 'Late Passive'), true);

assert.equal(solveEarlyBuildRoute(new Set(['Legend Blade'])).length, 0,
    'The route solver must reject late-game equipment');
assert.equal(hasFeasibleRouteWithinZones(['Mythic Blade'], 2), false,
    'Route feasibility checks must remain Early-only');

items = {
    'Legend Weapon': { type: 'Legend', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 10 } },
    'Legend Chest': { type: 'Legend', part: 'Chest', stats: { attackPower: 10 }, passiveSkill: { name: 'Late Passive' } },
    'Legend Head': { type: 'Legend', part: 'Head', stats: { attackPower: 10 } },
    'Legend Arm': { type: 'Legend', part: 'Arm', stats: { attackPower: 10 } },
    'Legend Leg': { type: 'Legend', part: 'Leg', stats: { attackPower: 10 } },
    'Mythic Weapon': { type: 'Mythic', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 20 } },
    'Mythic Chest': { type: 'Mythic', part: 'Chest', stats: { attackPower: 20 } },
    'Mythic Head': { type: 'Mythic', part: 'Head', stats: { attackPower: 20 } },
    'Mythic Arm': { type: 'Mythic', part: 'Arm', stats: { attackPower: 20 } },
    'Mythic Leg': { type: 'Mythic', part: 'Leg', stats: { attackPower: 20 } }
};
chars = {
    Tester: { masteries: ['TestSword'], base: {}, growth: {} }
};
currentCharacter = 'Tester';
currentWeaponFilter = 'All';
activeBuildType = BUILD_TYPES.LATE;
recommendationPriorities = ['attackPower'];
recommendationConstraints = { attackPower: { min: '', max: '' } };
recommendationPassiveSkills = new Set();
recommendationOnlyTwoZones = true;
buildDisplayStats(BUILD_TYPES.LATE);

lateRarityFilters.clear();
lateRarityFilters.add('Legend');
let lateCandidates = getRecommendationCandidatesBySlot(BUILD_TYPES.LATE);
assert.equal(Object.values(lateCandidates).flat().every(name => items[name].type === 'Legend'), true,
    'Legend-only recommendations honor the Late rarity filter');
let lateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);
assert.equal(lateRecommendations.length > 0, true);
assert.equal(lateRecommendations[0].items.every(name => items[name].type === 'Legend'), true);
assert.equal(lateRecommendations[0].stats.attackPower, 50);

lateRarityFilters.clear();
lateRarityFilters.add('Mythic');
lateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);
assert.equal(lateRecommendations[0].items.every(name => items[name].type === 'Mythic'), true,
    'Mythic-only recommendations are supported');
assert.equal(lateRecommendations[0].stats.attackPower, 100);

lateRarityFilters.add('Legend');
recommendationConstraints.attackPower.min = '90';
lateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);
assert.equal(lateRecommendations.every(build => build.stats.attackPower >= 90), true,
    'Late recommendations preserve minimum stat constraints');
recommendationConstraints.attackPower = { min: '', max: '60' };
lateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);
assert.equal(lateRecommendations.every(build => build.stats.attackPower <= 60), true,
    'Late recommendations preserve maximum stat constraints');

recommendationConstraints.attackPower = { min: '', max: '' };
recommendationPassiveSkills = new Set(['Late Passive']);
lateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);
assert.equal(lateRecommendations.length > 0, true);
assert.equal(lateRecommendations.every(build => build.items.includes('Legend Chest')), true,
    'Late recommendations enforce required passive skills');

items = fixtureData.items;
chars = fixtureData.chars;
currentCharacter = 'Aya';
currentWeaponFilter = 'All';
activeBuildType = BUILD_TYPES.LATE;
lateRarityFilters.clear();
BUILD_CONFIG[BUILD_TYPES.LATE].grades.forEach(grade => lateRarityFilters.add(grade));
recommendationPriorities = ['attackPower'];
recommendationConstraints = { attackPower: { min: '200', max: '235' } };
recommendationPassiveSkills = new Set();
recommendationOnlyTwoZones = true;
buildDisplayStats(BUILD_TYPES.LATE);
const ayaLateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);
assert.equal(ayaLateRecommendations.length > 0, true, 'Real data should produce constrained Late recommendations for Aya');
assert.equal(ayaLateRecommendations.every(build => build.items.length === EQUIPMENT_SLOTS.length), true);
assert.equal(ayaLateRecommendations.every(build => build.stats.attackPower >= 200 && build.stats.attackPower <= 235), true);
assert.equal(ayaLateRecommendations.every(build => build.items.every(name => isItemEligibleForBuild(items[name], BUILD_TYPES.LATE))), true);

for (const slot of EQUIPMENT_SLOTS) {
    assert.equal(Object.values(items).some(item => item.part === slot && isItemEligibleForBuild(item, BUILD_TYPES.EARLY)), true,
        \`Real data must contain an Early item for \${slot}\`);
    assert.equal(Object.values(items).some(item => item.part === slot && isItemEligibleForBuild(item, BUILD_TYPES.LATE)), true,
        \`Real data must contain a Late item for \${slot}\`);
}
`;

vm.runInNewContext(`${source}\n${assertions}`, context, { filename: scriptPath });
console.log('Validated early/late build state, recommendation constraints, rarity modes, passives, and route isolation.');
