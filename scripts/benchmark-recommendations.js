const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const scriptPath = path.join(__dirname, '..', 'docs', 'script.js');
const source = fs.readFileSync(scriptPath, 'utf8');
const fixtureData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'data.json'), 'utf8'));

const context = {
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

const benchmark = `
items = fixtureData.items;
chars = fixtureData.chars;
mapData = fixtureData.mapData;
activeBuildType = BUILD_TYPES.LATE;
currentWeaponFilter = 'All';
lateRarityFilters.clear();
BUILD_CONFIG[BUILD_TYPES.LATE].grades.forEach(grade => lateRarityFilters.add(grade));
buildDisplayStats(BUILD_TYPES.LATE);

const cases = [
    { name: 'Aya: Attack Power', character: 'Aya', priorities: ['attackPower'] },
    {
        name: 'Aya: weighted Attack Power + Defense',
        character: 'Aya',
        priorities: ['attackPower', 'defense'],
        weights: { attackPower: 1, defense: 0.4 }
    },
    {
        name: 'Aya: constrained Attack Power',
        character: 'Aya',
        priorities: ['attackPower'],
        constraints: { attackPower: { min: '200', max: '235' } }
    },
    {
        name: 'Jackie: three priorities',
        character: 'Jackie',
        priorities: ['attackPower', 'attackSpeedRatio', 'maxHp']
    },
    {
        name: 'Aya: required passive',
        character: 'Aya',
        priorities: ['attackPower'],
        passives: ['Chasing Needle']
    },
    {
        name: 'Aya: passive only',
        character: 'Aya',
        priorities: [],
        passives: ['Chasing Needle']
    },
    {
        name: 'Aya Early: Attack Power',
        character: 'Aya',
        buildType: BUILD_TYPES.EARLY,
        priorities: ['attackPower']
    },
    {
        name: 'Aya Early: Attack Power + two zones',
        character: 'Aya',
        buildType: BUILD_TYPES.EARLY,
        priorities: ['attackPower'],
        onlyTwoZones: true
    }
];

const rows = cases.map(testCase => {
    const buildType = testCase.buildType || BUILD_TYPES.LATE;
    activeBuildType = buildType;
    buildDisplayStats(buildType);
    currentCharacter = testCase.character;
    recommendationPriorities = testCase.priorities;
    recommendationAutomaticWeights = !testCase.weights;
    recommendationWeights = testCase.weights ? { ...testCase.weights } : {};
    if (recommendationAutomaticWeights) applyAutomaticRecommendationWeights();
    recommendationConstraints = testCase.constraints || Object.fromEntries(
        testCase.priorities.map(statId => [statId, { min: '', max: '' }])
    );
    recommendationPassiveSkills = new Set(testCase.passives || []);
    recommendationOnlyTwoZones = !!testCase.onlyTwoZones;
    const results = generateRecommendedBuilds(buildType);
    return {
        case: testCase.name,
        combinations: lastRecommendationSearchMetrics.candidateCombinationCount,
        nodes: lastRecommendationSearchMetrics.visitedNodes,
        completed: lastRecommendationSearchMetrics.completedBuilds,
        scorePrunes: lastRecommendationSearchMetrics.prunedByScore,
        constraintPrunes: lastRecommendationSearchMetrics.prunedByConstraints,
        elapsedMs: lastRecommendationSearchMetrics.elapsedMs,
        results: results.length
    };
});

console.table(rows);
`;

vm.runInNewContext(`${source}\n${benchmark}`, context, { filename: scriptPath });
