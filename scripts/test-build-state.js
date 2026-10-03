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
assert.equal(Object.keys(HIGH_TIER_MATERIALS).every(material => lateResourceFilters.has(material)), true,
    'Every high-tier material filter starts enabled');
assert.equal(itemMatchesLateResourceFilters('VF Item', { components: ['VF Blood Sample'] }), true);
lateResourceFilters.delete('VF Blood Sample');
assert.equal(itemMatchesLateResourceFilters('VF Item', { components: ['VF Blood Sample'] }), false,
    'Disabling VF Blood Sample excludes VF items');
assert.equal(itemMatchesLateResourceFilters('Character Item', { components: [] }), true,
    'Items without a high-tier material remain available');
lateResourceFilters.add('VF Blood Sample');
assert.notEqual(buildFilterState[BUILD_TYPES.EARLY].substats, buildFilterState[BUILD_TYPES.LATE].substats);
assert.notEqual(recommendationStateByType[BUILD_TYPES.EARLY].priorities, recommendationStateByType[BUILD_TYPES.LATE].priorities);
assert.notEqual(recommendationStateByType[BUILD_TYPES.EARLY].weights, recommendationStateByType[BUILD_TYPES.LATE].weights);
assert.notEqual(recommendationStateByType[BUILD_TYPES.EARLY].passiveSkills, recommendationStateByType[BUILD_TYPES.LATE].passiveSkills);
assert.equal(recommendationStateByType[BUILD_TYPES.EARLY].automaticWeights, true);
assert.equal(recommendationStateByType[BUILD_TYPES.LATE].automaticWeights, true);
assert.equal(recommendationStateByType[BUILD_TYPES.EARLY].creditMin, '');
assert.equal(recommendationStateByType[BUILD_TYPES.LATE].creditMax, '');
assert.equal(matchesSearchTerm('Lidailin', 'Li Dailin', fixtureData.chars['Li Dailin'].nameKo), true,
    'Search ignores spaces and capitalization');
assert.equal(matchesSearchTerm('ntpn', 'Nathapon', fixtureData.chars.Nathapon.nameKo), true,
    'Search accepts an ordered subsequence with missing middle letters');
assert.equal(matchesSearchTerm('ㅇㅅㅌㄴ', fixtureData.chars.Justyna.nameKo), true,
    'Search accepts Korean initial consonants');
assert.equal(matchesSearchTerm('ㄴㅌㅍ', '나타폰'), true,
    'Korean initial-consonant search also accepts an ordered subsequence');
assert.equal(matchesSearchTerm('nptn', 'Nathapon'), false,
    'Fuzzy search still preserves the typed character order');
assert.equal(getMythicWeaponVariant('Scarlet Dagger - Dawn', { type: 'Mythic', part: 'Weapon' }), 'Dawn');
assert.equal(getMythicWeaponVariant('Scarlet Dagger - Crimson', { type: 'Mythic', part: 'Weapon' }), 'Crimson');
assert.equal(getMythicWeaponVariant('Crimson Bracelet', { type: 'Mythic', part: 'Arm' }), null,
    'Only Mythic weapon variants receive a Dawn or Crimson indicator');
assert.equal(getMythicWeaponVariant('Scarlet Dagger - Dawn', { type: 'Legend', part: 'Weapon' }), null);
const namedMythicVariants = Object.entries(fixtureData.items)
    .filter(([name]) => / - (Dawn|Crimson)$/.test(name));
assert.equal(namedMythicVariants.length > 0, true);
assert.equal(namedMythicVariants.every(([name, item]) => getMythicWeaponVariant(name, item) !== null), true,
    'Every Dawn and Crimson item in production data receives a variant indicator');
assert.deepEqual(
    Array.from(new Set(namedMythicVariants.map(([name, item]) => getMythicWeaponVariant(name, item)))).sort(),
    ['Crimson', 'Dawn']
);

activeBuildType = BUILD_TYPES.LATE;
const orderedCatalogFixture = [
    ['Mythic Leg', { type: 'Mythic', part: 'Leg' }],
    ['Legend Arm', { type: 'Legend', part: 'Arm' }],
    ['Mythic Gloves', { type: 'Mythic', part: 'Weapon', weaponType: 'Glove' }],
    ['Legend Tonfa', { type: 'Legend', part: 'Weapon', weaponType: 'Tonfa' }],
    ['Legend Leg', { type: 'Legend', part: 'Leg' }],
    ['Mythic Arm', { type: 'Mythic', part: 'Arm' }],
    ['Legend Gloves', { type: 'Legend', part: 'Weapon', weaponType: 'Glove' }],
    ['Mythic Tonfa', { type: 'Mythic', part: 'Weapon', weaponType: 'Tonfa' }]
];
assert.equal(
    orderedCatalogFixture.sort(compareCatalogItems).map(([name]) => name).join('|'),
    'Legend Gloves|Mythic Gloves|Legend Tonfa|Mythic Tonfa|Legend Arm|Mythic Arm|Legend Leg|Mythic Leg',
    'Late catalog groups each weapon or equipment type with Legendary items before Mythic items'
);

items = {
    'Epic Blade A': { type: 'Epic', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 10 } },
    'Epic Blade B': { type: 'Epic', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 20 } },
    'Legend Blade': { type: 'Legend', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 30 } },
    'Mythic Blade': { type: 'Mythic', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 40 } },
    'Legend Chest': {
        type: 'Legend',
        part: 'Chest',
        passiveSkills: [{ name: 'Late Passive' }, { name: 'Second Late Passive' }]
    },
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
assert.equal(isLateBuildComplete(lateBuild), false, 'Partial late builds are not marked complete');
assert.equal(canSaveLateComparisonBuild(lateBuild), true, 'Partial late builds can be saved for comparison');
const partialLateSnapshot = createLateBuildSnapshot(lateBuild);
assert.deepEqual(Array.from(partialLateSnapshot), ['Mythic Blade', 'Legend Chest'],
    'Comparison snapshots accept builds with fewer than five items');
addItemToBuild('Legend Head', BUILD_TYPES.LATE);
addItemToBuild('Legend Arm', BUILD_TYPES.LATE);
addItemToBuild('Legend Leg', BUILD_TYPES.LATE);
assert.equal(isLateBuildComplete(lateBuild), true, 'A late build is complete only when every slot is filled');
const lateSnapshot = createLateBuildSnapshot(lateBuild);
assert.deepEqual(Array.from(lateSnapshot), ['Mythic Blade', 'Legend Chest', 'Legend Head', 'Legend Arm', 'Legend Leg']);
lateBuild.delete('Legend Leg');
assert.equal(lateSnapshot.includes('Legend Leg'), true, 'Comparison snapshots are independent from later build edits');
lateBuild.clear();
assert.equal(canSaveLateComparisonBuild(lateBuild), false, 'Empty late builds cannot be saved for comparison');
assert.equal(createLateBuildSnapshot(lateBuild), null, 'Empty comparison snapshots are rejected');

buildSelectableStats(BUILD_TYPES.EARLY);
assert.equal(SELECTABLE_STATS.some(stat => stat.id === 'attackPower'), true);
buildPassiveSkillOptions(BUILD_TYPES.LATE);
assert.equal(PASSIVE_SKILL_OPTIONS.some(skill => skill.id === 'Late Passive'), true);
assert.equal(PASSIVE_SKILL_OPTIONS.some(skill => skill.id === 'Second Late Passive'), true,
    'Every passive on a multi-passive item is available as a filter');
assert.deepEqual(getItemPassiveSkills({ passiveSkill: { name: 'Legacy Passive' } }), [{ name: 'Legacy Passive' }],
    'Legacy singular passive data remains readable during migration');

items['Level Scaling Chest'] = {
    type: 'Legend',
    part: 'Chest',
    stats: { attackPower: 5 },
    statsByLv: { attackPower: 3 }
};
DISPLAY_STATS = [{ id: 'attackPower', name: getStatName('attackPower') }];
charLevel = 10;
currentCharacter = null;
assert.equal(getItemStatValue(items['Level Scaling Chest'], 'attackPower'), 35,
    'Item filtering includes the selected level in stats-per-level values');
assert.equal(getItemRecommendationStatParts('Level Scaling Chest', 'attackPower').additive, 35,
    'Recommendation search bounds include stats-per-level values');
assert.equal(calculateItemOnlyBuildStats(['Level Scaling Chest']).attackPower, 35,
    'Recommendation result totals include stats-per-level values');
assert.equal(calculateBuildStats(['Level Scaling Chest']).attackPower, 35,
    'Displayed build totals include stats-per-level values');
delete items['Level Scaling Chest'];
charLevel = 1;

assert.equal(solveEarlyBuildRoute(new Set(['Legend Blade'])).length, 0,
    'The route solver must reject late-game equipment');
assert.equal(hasFeasibleRouteWithinZones(['Mythic Blade'], 2), false,
    'Route feasibility checks must remain Early-only');

items = {
    'Legend Weapon': { type: 'Legend', part: 'Weapon', weaponType: 'TestSword', stats: { attackPower: 10 } },
    'Legend Chest': {
        type: 'Legend',
        part: 'Chest',
        stats: { attackPower: 10 },
        passiveSkills: [{ name: 'Late Passive' }, { name: 'Second Late Passive' }]
    },
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
recommendationWeights = { attackPower: 1 };
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
recommendationPassiveSkills = new Set(['Second Late Passive']);
lateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);
assert.equal(lateRecommendations.length > 0, true);
assert.equal(lateRecommendations.every(build => build.items.includes('Legend Chest')), true,
    'Late recommendations enforce a second passive on the same item');
assert.equal(lastRecommendationSearchMetrics.algorithm, 'branch-and-bound');
assert.equal(lastRecommendationSearchMetrics.exact, true);
assert.equal(lastRecommendationSearchMetrics.candidateCombinationCount, 32);
assert.equal(getEffectivePassiveSkills(['Legend Chest', 'Legend Chest']).length, 2,
    'Every passive is represented once even when a multi-passive item is duplicated');

Object.entries(items).forEach(([name, item]) => {
    item.components = [name.startsWith('Legend') ? 'Meteorite' : 'VF Blood Sample'];
});
recommendationPassiveSkills = new Set();
recommendationCreditMin = '';
recommendationCreditMax = '200';
lateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);
assert.equal(lateRecommendations.length > 0, true);
assert.equal(lateRecommendations.every(build => build.items.length === 1), true,
    'A 200-credit maximum produces partial one-item recommendations');
assert.equal(lateRecommendations.every(build => build.credit === 200), true);
assert.equal(lateRecommendations.every(build => build.items.every(name => items[name].type === 'Legend')), true);
assert.equal(lastRecommendationSearchMetrics.prunedByCredits > 0, true);

recommendationCreditMin = '500';
recommendationCreditMax = '500';
lateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);
assert.equal(lateRecommendations.length > 0, true);
assert.equal(lateRecommendations.every(build => build.items.length === 1 && build.credit === 500), true,
    'Credit minimum and maximum limits are both enforced');
assert.equal(lateRecommendations.every(build => build.items.every(name => items[name].type === 'Mythic')), true);
recommendationCreditMin = '';
recommendationCreditMax = '';

recommendationPriorities = ['attackPower', 'defense'];
recommendationAutomaticWeights = true;
recommendationWeights = {};
applyAutomaticRecommendationWeights();
assert.equal(recommendationWeights.attackPower, 1);
assert.equal(recommendationWeights.defense, 0.68,
    'Automatic weights use geometric decay based on stat order');

recommendationAutomaticWeights = false;
recommendationWeights = { attackPower: 1, defense: 0 };
assert.equal(scoreStatsForRecommendation(
    { attackPower: 50, defense: 100 },
    { attackPower: 100, defense: 100 }
), 0.5, 'A zero-weight stat must not affect recommendation scores');
recommendationWeights = { attackPower: 0.25, defense: 0.75 };
assert.equal(scoreStatsForRecommendation(
    { attackPower: 100, defense: 0 },
    { attackPower: 100, defense: 100 }
), 0.25, 'Manual weights between zero and one control relative stat importance');
assert.equal(normalizeRecommendationWeight(-1), 0);
assert.equal(normalizeRecommendationWeight(2), 1);

recommendationPriorities = ['attackPower'];
recommendationAutomaticWeights = true;
recommendationWeights = { attackPower: 1 };
lateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);

const exactCandidateSlots = getRecommendationCandidatesBySlot(BUILD_TYPES.LATE);
const exactModel = createRecommendationSearchModel(exactCandidateSlots);
const exhaustiveBuilds = [];
function enumerateRecommendationBuilds(depth, selectedItems) {
    if (depth === EQUIPMENT_SLOTS.length) {
        const stats = calculateItemOnlyBuildStats(selectedItems);
        if (!passesRecommendationConstraints(stats) || !passesRecommendationPassiveRequirements(selectedItems)) return;
        exhaustiveBuilds.push({
            items: [...selectedItems],
            score: scoreStatsForRecommendation(stats, exactModel.normalizers)
        });
        return;
    }
    const slot = EQUIPMENT_SLOTS[depth];
    exactCandidateSlots[slot].forEach(name => {
        selectedItems.push(name);
        enumerateRecommendationBuilds(depth + 1, selectedItems);
        selectedItems.pop();
    });
}
enumerateRecommendationBuilds(0, []);
exhaustiveBuilds.sort((a, b) => b.score - a.score);
assert.deepEqual(
    lateRecommendations.map(build => build.score),
    exhaustiveBuilds.slice(0, RECOMMENDATION_RESULT_LIMIT).map(build => build.score),
    'Branch-and-bound recommendations must match exhaustive top scores on a known search space'
);

items = fixtureData.items;
chars = fixtureData.chars;
const workbookPassiveItems = Object.values(items).filter(item => item.passiveSkills.length > 0);
assert.equal(workbookPassiveItems.length, 315, 'Every workbook item has passive data in the deployed dataset');
assert.equal(workbookPassiveItems.reduce((total, item) => total + item.passiveSkills.length, 0), 338,
    'Every workbook passive association is present in the deployed dataset');
assert.equal(workbookPassiveItems.filter(item => item.passiveSkills.length > 1).length, 23,
    'All workbook multi-passive items are preserved');
assert.equal(items['Red Star'].passiveSkills.map(passive => passive.name).join('|'), 'Blaze Up|Healing Reduction');
assert.equal(items['Sports Watch'].passiveSkills[0].name, 'Vigor - Circulation',
    'The workbook spelling is canonical for Vigor - Circulation');
assert.equal(items['Revenge of Goujian'].passiveSkills.length > 0, true);
assert.equal(items["Vulture's Eye"].passiveSkills.length > 0, true);
assert.equal(items.Fragarach.passiveSkills.length > 0, true);
currentCharacter = 'Aya';
currentWeaponFilter = 'All';
activeBuildType = BUILD_TYPES.LATE;
lateRarityFilters.clear();
BUILD_CONFIG[BUILD_TYPES.LATE].grades.forEach(grade => lateRarityFilters.add(grade));
recommendationPriorities = ['attackPower'];
recommendationAutomaticWeights = true;
recommendationWeights = { attackPower: 1 };
recommendationConstraints = { attackPower: { min: '200', max: '235' } };
recommendationPassiveSkills = new Set();
recommendationOnlyTwoZones = true;
buildDisplayStats(BUILD_TYPES.LATE);
assert.deepEqual(getHighTierMaterialsForItem('Eclipse'), ['Meteorite']);
assert.deepEqual(getHighTierMaterialsForItem('Soul Reaper'), ['Tree of Life']);
assert.deepEqual(getHighTierMaterialsForItem('Fragarach'), ['Mythril']);
assert.deepEqual(getHighTierMaterialsForItem('Elysian Halo'), ['Force Core'],
    'Flattened Meteorite plus Tree of Life recipes are recognized as Force Core');
assert.deepEqual(getHighTierMaterialsForItem('Scarlet Dagger'), ['VF Blood Sample']);
assert.equal(getItemCreditCost('Eclipse'), 200);
assert.equal(getItemCreditCost('Fragarach'), 250);
assert.equal(getItemCreditCost('Elysian Halo'), 350);
assert.equal(getItemCreditCost('Scarlet Dagger'), 500);
assert.equal(getItemCreditCost('Deathadder Queen FC'), 350,
    'Character-specific resource suffixes use the same credit model');
assert.equal(renderSingleStatColumn({ __passiveSkills: [] }).includes(t('totalCredits')), false,
    'Early stat summaries do not receive a credit row');
assert.equal(renderSingleStatColumn({ __passiveSkills: [] }, { creditCost: 350 }).includes('350'), true,
    'Late stat summaries show credits inside the stat list');
assert.deepEqual(getComparisonValueColors(200, 350, true), ['#27ae60', '#e74c3c'],
    'Lower credit use is highlighted as better');
assert.deepEqual(getComparisonValueColors(500, 350, true), ['#e74c3c', '#27ae60']);
const lateCreditComparison = renderComparisonColumns(
    { __passiveSkills: [] },
    { __passiveSkills: [] },
    ['A', 'B'],
    { creditCosts: [200, 350] }
);
assert.equal(lateCreditComparison.includes(t('totalCredits')), true,
    'Late Build A/B comparison includes credits inside the comparison chart');

lateResourceFilters.clear();
lateResourceFilters.add('Force Core');
let forceCoreCandidates = getRecommendationCandidatesBySlot(BUILD_TYPES.LATE);
assert.equal(Object.values(forceCoreCandidates).flat().length > 0, true);
assert.equal(Object.values(forceCoreCandidates).flat().every(name =>
    getHighTierMaterialsForItem(name).includes('Force Core')), true,
    'Late resource filters constrain recommendation candidates');
lateResourceFilters.clear();
Object.keys(HIGH_TIER_MATERIALS).forEach(material => lateResourceFilters.add(material));
const ayaLateRecommendations = generateRecommendedBuilds(BUILD_TYPES.LATE);
assert.equal(ayaLateRecommendations.length > 0, true, 'Real data should produce constrained Late recommendations for Aya');
assert.equal(ayaLateRecommendations.every(build => build.items.length === EQUIPMENT_SLOTS.length), true);
assert.equal(ayaLateRecommendations.every(build => build.stats.attackPower >= 200 && build.stats.attackPower <= 235), true);
assert.equal(ayaLateRecommendations.every(build => build.items.every(name => isItemEligibleForBuild(items[name], BUILD_TYPES.LATE))), true);
assert.equal(ayaLateRecommendations.every(build => !build.items.includes('Celestial Echo')), true,
    'Late recommendations must not give Priya-exclusive equipment to other characters');

let characterCandidates = getRecommendationCandidatesBySlot(BUILD_TYPES.LATE);
assert.equal(characterCandidates.Head.includes('Celestial Echo'), false,
    'Celestial Echo is not a candidate for non-Priya characters');
assert.equal(characterCandidates.Weapon.some(name => items[name].weaponType === 'VFArm'), false,
    'Late VF Prosthetic weapons are not candidates for non-Echion characters');

currentCharacter = 'Priya';
characterCandidates = getRecommendationCandidatesBySlot(BUILD_TYPES.LATE);
assert.deepEqual(characterCandidates.Head, ['Celestial Echo'],
    "Celestial Echo is Priya's only eligible Late head item");

currentCharacter = 'Echion';
characterCandidates = getRecommendationCandidatesBySlot(BUILD_TYPES.LATE);
assert.equal(characterCandidates.Weapon.length > 0, true);
assert.equal(characterCandidates.Weapon.every(name => items[name].weaponType === 'VFArm'), true,
    'Echion can receive Late VF Prosthetic recommendations');

for (const slot of EQUIPMENT_SLOTS) {
    assert.equal(Object.values(items).some(item => item.part === slot && isItemEligibleForBuild(item, BUILD_TYPES.EARLY)), true,
        \`Real data must contain an Early item for \${slot}\`);
    assert.equal(Object.values(items).some(item => item.part === slot && isItemEligibleForBuild(item, BUILD_TYPES.LATE)), true,
        \`Real data must contain a Late item for \${slot}\`);
}
`;

vm.runInNewContext(`${source}\n${assertions}`, context, { filename: scriptPath });
console.log('Validated early/late build state, recommendation constraints, rarity modes, passives, and route isolation.');
