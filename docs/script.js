// ==========================================
// GLOBAL STATE
// ==========================================

const DICT = {
    en: {
        title: "Eternal Return Build Optimizer",
        filters: "Filters",
        resetAll: "Reset All",
        level: "Level:",
        character: "Test Subject",
        itemPart: "Item Part",
        all: "ALL",
        weaponType: "Weapon Type",
        substats: "Item Stats",
        passiveSkills: "Unique Passives",
        buildWorkflow: "Build workflow",
        earlyGameRoute: "Early Game Build/Route",
        lateGameBuild: "Late Game Build",
        routeOptimizerTab: "Item Selection",
        recommendationsTab: "Item Recommendations",
        addPriorityStat: "Add weighted stat",
        addPassiveSkill: "Add unique passive",
        requirePassiveSkill: "Required unique passives",
        requiredPassiveSkills: "Required unique passives",
        searchPassiveSkillsPlaceholder: "Search unique passives...",
        recommendBuilds: "Recommend Builds",
        recommendationSelectCharacter: "Select a character and add weighted stats or required passives to get recommended builds.",
        recommendationNeedCharacter: "Please select a character first.",
        recommendationNeedStats: "Add a stat with weight above 0, a stat constraint, or a required passive.",
        recommendationNoBuilds: "No recommended builds matched the current filters.",
        recommendationScore: "Stat Score: ",
        recommendationMatch: "Requirement Match: ",
        recommendationApplied: "Build applied. Click Optimize Route to find farming routes.",
        applyRecommendation: "Use build",
        onlyTwoZones: "Only show builds with 2 or less zones",
        weightLabel: "Weight",
        automaticWeights: "Weight automatically by order",
        weightHelp: "Auto uses geometric decay (1, 0.68, 0.46…). Turn it off to enter relative weights from 0 to 1.",
        highTierMaterial: "Epic Material",
        hideRecommendationFilters: "Hide recommendation filters",
        showRecommendationFilters: "Show recommendation filters",
        buildCreditLimit: "Build credit limit",
        minCredits: "Min credits",
        maxCredits: "Max credits",
        credits: "Credits",
        totalCredits: "Total Credits",
        minLabel: "Min",
        maxLabel: "Max",
        selectCharacter: "Select Character",
        addStat: "Add stat",
        resetStats: "Reset",
        searchStatsPlaceholder: "Search stats...",
        yourEarlyBuild: "Your Early Build",
        yourLateBuild: "Your Late-Game Build",
        resetBuild: "Reset Build",
        clickToAdd: "Click items below to add them to your build.",
        clickToAddLate: "Choose one Legendary or Mythic item for each equipment slot.",
        selectEpicItems: "Select Epic Items",
        selectLateItems: "Select Legendary and Mythic Items",
        lateGameRouteNote: "Farming-route optimization is available only in Early Game Route mode.",
        lateBuildSummary: "Final Build Summary",
        currentBuildStats: "Current Build Stats",
        buildComparison: "Build Comparison",
        clearComparison: "Clear",
        comparisonHelp: "Save any build with at least one item, change your items, then save the second build to compare them.",
        saveBuildA: "Save as Build A",
        saveBuildB: "Save as Build B",
        buildA: "Build A",
        buildB: "Build B",
        loadBuild: "Load",
        comparisonWaiting: "Save two builds to compare their stats and passive effects.",
        incompleteLateBuild: "Select at least one item to save this build.",
        noBuildStats: "Add equipment to see total stats and passive effects.",
        itemsShown: "items shown",
        noMatchingItems: "No items match the current filters.",
        optimizeRoute: "Run Optimizer",
        optimizeThenCompare: "Optimize a route, then click up to 2 routes below to compare stats.",
        itemStatsComparison: "Item Stats Comparison",
        selectRoutesToCompare: "Select routes to see stat comparison.",
        calculating: "Calculating Variants...",
        pleaseSelect: "Please select items first.",
        noRoutes: "<p>No valid routes found for any combination.</p>",
        route1: "Route 1",
        route2: "Route 2",
        topRoutes: "<h3>Top Optimized Routes: <span style='font-size:0.6em; font-weight:normal; color:var(--text-muted);'>(*: Hyperloop not needed)</span></h3>",
        showMoreRoutes: "Show more routes",
        showFewerRoutes: "Show fewer routes",
        needDrone: "Need Drone: <strong>",
        noDrone: "No Drone Needed",
        buildVariant: "Build Variant:",
        searchCharPlaceholder: "Search...",
        searchItemPlaceholder: "Search item...",
        languageLabel: "Language",
        switchToDarkTheme: "Switch to dark theme",
        switchToLightTheme: "Switch to light theme",
        loadingData: "Loading item and character data…",
        dataLoadError: "The optimizer data could not be loaded. Refresh the page to try again.",
        addItem: "Add item",
        removeItem: "Remove item",
        selectRoute: "Select route for comparison",
        dataPatch: "Data patch",
        dataUpdated: "Data updated"
    },
    ko: {
        title: "이터널 리턴 빌드 옵티마이저",
        filters: "필터",
        resetAll: "전체 초기화",
        level: "레벨:",
        character: "실험체",
        itemPart: "아이템 부위",
        all: "ALL",
        weaponType: "무기 종류",
        substats: "아이템 스탯",
        selectCharacter: "실험체 선택",
        addStat: "스탯 추가",
        resetStats: "초기화",
        searchStatsPlaceholder: "스탯 검색...",
        yourEarlyBuild: "초반 빌드",
        yourLateBuild: "후반 빌드",
        resetBuild: "빌드 초기화",
        clickToAdd: "아래 아이템을 클릭하여 빌드에 추가하세요.",
        clickToAddLate: "각 장비 부위에 전설 또는 초월 아이템을 하나씩 선택하세요.",
        selectEpicItems: "영웅 아이템 선택",
        selectLateItems: "전설 및 초월 아이템 선택",
        buildWorkflow: "빌드 방식",
        earlyGameRoute: "초반 빌드/루트",
        lateGameBuild: "후반 빌드",
        lateGameRouteNote: "파밍 루트 최적화는 초반 파밍 루트 모드에서만 사용할 수 있습니다.",
        lateBuildSummary: "최종 빌드 요약",
        currentBuildStats: "현재 빌드 스탯",
        buildComparison: "빌드 비교",
        clearComparison: "초기화",
        comparisonHelp: "아이템이 하나 이상인 빌드를 저장하고 아이템을 변경한 뒤 두 번째 빌드를 저장하여 비교하세요.",
        saveBuildA: "빌드 A로 저장",
        saveBuildB: "빌드 B로 저장",
        buildA: "빌드 A",
        buildB: "빌드 B",
        loadBuild: "불러오기",
        comparisonWaiting: "빌드 두 개를 저장하면 스탯과 고유 장착 효과를 비교할 수 있습니다.",
        incompleteLateBuild: "빌드를 저장하려면 아이템을 하나 이상 선택해주세요.",
        noBuildStats: "장비를 추가하면 전체 스탯과 고유 장착 효과를 확인할 수 있습니다.",
        itemsShown: "개 아이템",
        noMatchingItems: "현재 필터와 일치하는 아이템이 없습니다.",
        optimizeRoute: "옵티마이저 실행",
        optimizeThenCompare: "옵티마이저 실행 후, 루트를 최대 2개까지 선택하여 스탯을 비교하세요.",
        itemStatsComparison: "아이템 스탯 비교",
        selectRoutesToCompare: "루트를 선택하여 스탯을 비교하세요.",
        calculating: "다양한 조합 계산 중...",
        pleaseSelect: "아이템을 먼저 선택해주세요.",
        noRoutes: "<p>가능한 루트를 찾지 못했습니다.</p>",
        route1: "루트 1",
        route2: "루트 2",
        topRoutes: "<h3>최적화 루트 TOP: <span style='font-size:0.6em; font-weight:normal; color:var(--text-muted);'>(*: 하이퍼루프 필요 X)</span></h3>",
        showMoreRoutes: "루트 더 보기",
        showFewerRoutes: "루트 접기",
        needDrone: "드론 필요: <strong>",
        noDrone: "드론 필요 없음",
        buildVariant: "빌드 변형:",
        searchCharPlaceholder: "실험체 검색...",
        searchItemPlaceholder: "아이템 검색...",
        languageLabel: "언어",
        switchToDarkTheme: "어두운 테마로 전환",
        switchToLightTheme: "밝은 테마로 전환",
        loadingData: "아이템 및 실험체 데이터를 불러오는 중…",
        dataLoadError: "옵티마이저 데이터를 불러오지 못했습니다. 페이지를 새로고침하여 다시 시도하세요.",
        addItem: "아이템 추가",
        removeItem: "아이템 제거",
        selectRoute: "비교할 루트 선택"
    }
};

Object.assign(DICT.ko, {
    routeOptimizerTab: "아이템 선택",
    recommendationsTab: "아이템 추천",
    addPriorityStat: "가중치 스탯 추가",
    recommendBuilds: "빌드 추천",
    recommendationSelectCharacter: "실험체를 선택하고 가중치 스탯이나 필수 고유 효과를 추가한 뒤 빌드를 추천받으세요.",
    recommendationNeedCharacter: "실험체를 먼저 선택해주세요.",
    recommendationNeedStats: "가중치가 0보다 큰 스탯, 스탯 조건 또는 필수 고유 효과를 추가해주세요.",
    recommendationNoBuilds: "현재 필터를 충족하는 추천 빌드가 없습니다.",
    recommendationScore: "스탯 점수: ",
    recommendationMatch: "조건 일치: ",
    recommendationApplied: "빌드가 적용되었습니다. '옵티마이저 실행' 버튼을 눌러 파밍 루트를 찾으세요.",
    applyRecommendation: "빌드 적용",
    onlyTwoZones: "2구역 이하 빌드만 보기",
    passiveSkills: "고유 장착 효과",
    addPassiveSkill: "고유 장착 효과 추가",
    requirePassiveSkill: "필수 고유 효과 추가",
    requiredPassiveSkills: "필수 고유 장착 효과",
    searchPassiveSkillsPlaceholder: "고유 장착 효과 검색...",
    weightLabel: "가중치",
    automaticWeights: "순서에 따라 가중치 자동 설정",
    weightHelp: "자동 설정은 기하급수적 감소(1, 0.68, 0.46…)를 사용합니다. 직접 입력하려면 끄고 0부터 1 사이의 상대 가중치를 설정하세요.",
    highTierMaterial: "영웅 재료",
    hideRecommendationFilters: "추천 필터 접기",
    showRecommendationFilters: "추천 필터 펼치기",
    buildCreditLimit: "빌드 크레딧 제한",
    minCredits: "최소 크레딧",
    maxCredits: "최대 크레딧",
    credits: "크레딧",
    totalCredits: "총 크레딧",
    minLabel: "최소",
    maxLabel: "최대"
});

DICT.ko.dataPatch = "패치 버전";
DICT.ko.dataUpdated = "업데이트 일자";

let currentLanguage = localStorage.getItem('language') || 'en';

function t(key) {
    return DICT[currentLanguage][key] || key;
}

function escapeAttribute(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

const KOREAN_INITIAL_CONSONANTS = Object.freeze([
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
]);

function normalizeSearchText(value) {
    return String(value ?? '')
        .normalize('NFC')
        .toLocaleLowerCase()
        .replace(/[\s\p{P}\p{S}]+/gu, '');
}

function getKoreanInitials(value) {
    return Array.from(normalizeSearchText(value)).map(character => {
        const codePoint = character.codePointAt(0);
        if (codePoint < 0xAC00 || codePoint > 0xD7A3) return character;
        return KOREAN_INITIAL_CONSONANTS[Math.floor((codePoint - 0xAC00) / 588)];
    }).join('');
}

function isOrderedSubsequence(query, candidate) {
    let queryIndex = 0;
    for (const character of candidate) {
        if (character === query[queryIndex]) queryIndex += 1;
        if (queryIndex === query.length) return true;
    }
    return query.length === 0;
}

function matchesSearchTerm(term, ...candidateValues) {
    const query = normalizeSearchText(term);
    if (!query) return true;

    return candidateValues.some(value => {
        if (value === null || value === undefined) return false;
        const candidate = normalizeSearchText(value);
        const koreanInitials = getKoreanInitials(value);
        return candidate.includes(query) ||
            isOrderedSubsequence(query, candidate) ||
            koreanInitials.includes(query) ||
            isOrderedSubsequence(query, koreanInitials);
    });
}

function getItemName(name) {
    if (currentLanguage === 'ko' && items[name] && items[name].nameKo) return items[name].nameKo;
    return name;
}

function getItemImagePath(name) {
    return items[name] && items[name].image
        ? items[name].image
        : getItemPlaceholderPath(name);
}

function getCharacterImagePath(name) {
    return chars[name] && chars[name].image
        ? chars[name].image
        : `images/characters/${name}.png`;
}

function getItemPlaceholderPath(name) {
    const part = items[name] && items[name].part;
    return PART_NAMES[part] ? `images/ui/${part}.png` : 'images/ui/Weapon.png';
}

function applyItemImageFallback(img, name) {
    if (!img) return;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = function() {
        if (this.dataset.placeholderApplied === 'true') {
            this.style.display = 'none';
            return;
        }
        this.dataset.placeholderApplied = 'true';
        this.src = getItemPlaceholderPath(name);
    };
}

function applyItemImageFallbacks(root) {
    if (!root) return;
    root.querySelectorAll('img[data-item-image]').forEach(img => {
        applyItemImageFallback(img, img.dataset.itemImage);
    });
}

function getCharName(name) {
    if (name === "All") return currentLanguage === 'ko' ? "전체" : "ALL";
    if (currentLanguage === 'ko' && chars[name] && chars[name].nameKo) return chars[name].nameKo;
    return name;
}

function applyTranslations() {
    document.documentElement.lang = currentLanguage === 'ko' ? 'ko' : 'en';
    document.body.classList.remove('lang-en', 'lang-ko');
    document.body.classList.add('lang-' + currentLanguage);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (DICT[currentLanguage][key]) {
            el.innerHTML = DICT[currentLanguage][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (DICT[currentLanguage][key]) {
            el.setAttribute('placeholder', DICT[currentLanguage][key]);
            el.setAttribute('aria-label', DICT[currentLanguage][key]);
        }
    });

    const languageSelect = document.getElementById('language-select');
    if (languageSelect) languageSelect.setAttribute('aria-label', t('languageLabel'));
    document.querySelectorAll('.workflow-switch-bar, .workflow-switch').forEach(element => {
        element.setAttribute('aria-label', t('buildWorkflow'));
    });
    const resourceFilterGroup = document.querySelector('.resource-filter-row');
    if (resourceFilterGroup) resourceFilterGroup.setAttribute('aria-label', t('highTierMaterial'));
    syncThemeControl();
}

function syncThemeControl() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const isDark = document.body.classList.contains('dark-mode');
    const label = t(isDark ? 'switchToLightTheme' : 'switchToDarkTheme');
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.title = label;
}

function setAppStatus(state) {
    const status = document.getElementById('app-status');
    const message = document.getElementById('app-status-message');
    const main = document.querySelector('main');
    if (!status || !message) return;

    status.dataset.state = state;
    status.hidden = state === 'ready';
    status.setAttribute('role', state === 'error' ? 'alert' : 'status');
    message.textContent = t(state === 'error' ? 'dataLoadError' : 'loadingData');
    if (main) main.setAttribute('aria-busy', String(state === 'loading'));
}

function prettifyStatId(id) {
    return id
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/\bHp\b/g, 'HP')
        .replace(/\bVf\b/g, 'VF')
        .replace(/\bCdr\b/g, 'CDR')
        .replace(/^./, c => c.toUpperCase());
}

function getStatName(id) {
    return STAT_LABELS[id] || { en: prettifyStatId(id), ko: prettifyStatId(id) };
}

function buildDisplayStats(buildType = activeBuildType) {
    const orderedIds = [];
    const seen = new Set();
    const addId = (id) => {
        if (!id || HIDDEN_DISPLAY_STATS.has(id) || seen.has(id)) return;
        seen.add(id);
        orderedIds.push(id);
    };

    DISPLAY_STAT_ORDER.forEach(addId);
    Object.values(items).forEach(item => {
        Object.keys(item.stats || {}).forEach(addId);
        Object.keys(item.uniqueStats || {}).forEach(addId);
        Object.keys(item.statsByLv || {}).forEach(addId);
    });

    DISPLAY_STATS = orderedIds.map(id => ({ id, name: getStatName(id) }));
    ITEM_TOOLTIP_STATS = DISPLAY_STATS;
    buildSelectableStats(buildType);
    buildPassiveSkillOptions(buildType);
}

function getSelectableStats() {
    return sortStatsByCurrentLanguage(SELECTABLE_STATS.length ? SELECTABLE_STATS : SUBSTATS);
}

function sortStatsByCurrentLanguage(stats) {
    const locale = currentLanguage === 'ko' ? 'ko' : 'en';
    return [...stats].sort((a, b) => {
        const labelA = (a.name[currentLanguage] || a.name.en || a.id).toLowerCase();
        const labelB = (b.name[currentLanguage] || b.name.en || b.id).toLowerCase();
        return labelA.localeCompare(labelB, locale);
    });
}

function buildSelectableStats(buildType = activeBuildType) {
    const actualIds = new Set();
    const normalizeId = (id) => id === 'moveSpeedRatio' ? 'moveSpeed' : id;
    const addActualId = (id) => {
        const normalizedId = normalizeId(id);
        if (!normalizedId || HIDDEN_DISPLAY_STATS.has(normalizedId)) return;
        actualIds.add(normalizedId);
    };

    Object.values(items).forEach(item => {
        if (!isItemEligibleForBuild(item, buildType)) return;
        Object.keys(item.stats || {}).forEach(addActualId);
        Object.keys(item.uniqueStats || {}).forEach(addActualId);
        Object.keys(item.statsByLv || {}).forEach(addActualId);
    });

    const orderedIds = [];
    const seen = new Set();
    const addOrderedId = (id) => {
        if (!actualIds.has(id) || seen.has(id)) return;
        seen.add(id);
        orderedIds.push(id);
    };

    DISPLAY_STAT_ORDER.forEach(addOrderedId);
    Array.from(actualIds)
        .sort((a, b) => getStatName(a).en.localeCompare(getStatName(b).en))
        .forEach(addOrderedId);

    SELECTABLE_STATS = orderedIds.map(id => ({ id, name: getStatName(id) }));
}

function buildPassiveSkillOptions(buildType = activeBuildType) {
    const passiveMap = new Map();

    Object.values(items).forEach(item => {
        if (!isItemEligibleForBuild(item, buildType)) return;
        getItemPassiveSkills(item).forEach(passiveSkill => {
            if (!passiveMap.has(passiveSkill.name)) {
                passiveMap.set(passiveSkill.name, {
                    id: passiveSkill.name,
                    name: passiveSkill.name,
                    nameKo: passiveSkill.nameKo || passiveSkill.name
                });
            }
        });
    });

    PASSIVE_SKILL_OPTIONS = Array.from(passiveMap.values());
}

function getPassiveSkillOptionName(option) {
    return currentLanguage === 'ko' ? (option.nameKo || option.name) : option.name;
}

function getPassiveSkillOptions() {
    const locale = currentLanguage === 'ko' ? 'ko' : 'en';
    return [...PASSIVE_SKILL_OPTIONS].sort((a, b) => {
        return getPassiveSkillOptionName(a).localeCompare(getPassiveSkillOptionName(b), locale);
    });
}

function getWeaponTypeName(api) {
    const weapon = WEAPON_TYPES.find(w => w.api === api);
    return weapon ? weapon.name[currentLanguage] : api;
}

const BUILD_TYPES = Object.freeze({
    EARLY: 'early',
    LATE: 'late'
});

const EQUIPMENT_SLOTS = Object.freeze(['Weapon', 'Chest', 'Head', 'Arm', 'Leg']);
const BUILD_SLOT_ORDER = Object.freeze(
    Object.fromEntries(EQUIPMENT_SLOTS.map((slot, index) => [slot, index + 1]))
);
const BUILD_CONFIG = Object.freeze({
    [BUILD_TYPES.EARLY]: Object.freeze({
        grades: Object.freeze(['Epic']),
        selectionMode: 'variants',
        routeEnabled: true
    }),
    [BUILD_TYPES.LATE]: Object.freeze({
        grades: Object.freeze(['Legend', 'Mythic']),
        selectionMode: 'single-per-slot',
        routeEnabled: false
    })
});

const ITEM_GRADE_STYLES = Object.freeze({
    Epic: Object.freeze({ color: '#9b59b6', cardStart: '#302A40', cardEnd: '#511D8C' }),
    Legend: Object.freeze({ color: '#f1c40f', cardStart: '#493d16', cardEnd: '#8a6810' }),
    Mythic: Object.freeze({ color: '#e74c3c', cardStart: '#491f25', cardEnd: '#8c1d2a' })
});
const LATE_GRADE_ORDER = Object.freeze({ Legend: 0, Mythic: 1 });

const MYTHIC_WEAPON_VARIANT_STYLES = Object.freeze({
    Dawn: Object.freeze({ className: 'dawn', color: '#3867ff' }),
    Crimson: Object.freeze({ className: 'crimson', color: '#e33f4f' })
});

const HIGH_TIER_MATERIALS = Object.freeze({
    Meteorite: Object.freeze({ price: 200, image: 'images/materials/Meteorite.png', nameKo: '운석' }),
    'Tree of Life': Object.freeze({ price: 200, image: 'images/materials/Tree of Life.png', nameKo: '생명의 나무' }),
    Mythril: Object.freeze({ price: 250, image: 'images/materials/Mythril.png', nameKo: '미스릴' }),
    'Force Core': Object.freeze({ price: 350, image: 'images/materials/Force Core.png', nameKo: '포스 코어' }),
    'VF Blood Sample': Object.freeze({ price: 500, image: 'images/materials/VF Blood Sample.png', nameKo: 'VF 혈액 샘플' })
});

const SPECIAL_ITEM_RESOURCE_SUFFIXES = Object.freeze({
    MT: 'Meteorite',
    TL: 'Tree of Life',
    ML: 'Mythril',
    FC: 'Force Core',
    VBS: 'VF Blood Sample'
});

function getBuildConfig(buildType = activeBuildType) {
    return BUILD_CONFIG[buildType] || BUILD_CONFIG[BUILD_TYPES.EARLY];
}

function getBuild(buildType = activeBuildType) {
    return buildsByType[buildType] || earlyBuild;
}

function isEquipmentItem(item) {
    return !!item && Object.prototype.hasOwnProperty.call(BUILD_SLOT_ORDER, item.part);
}

function isItemEligibleForBuild(item, buildType = activeBuildType) {
    return isEquipmentItem(item) && getBuildConfig(buildType).grades.includes(item.type);
}

function getItemGradeStyle(grade) {
    return ITEM_GRADE_STYLES[grade] || ITEM_GRADE_STYLES.Epic;
}

function getMythicWeaponVariant(name, item = items[name]) {
    if (!item || item.type !== 'Mythic' || item.part !== 'Weapon') return null;
    return Object.keys(MYTHIC_WEAPON_VARIANT_STYLES).find(variant => name.endsWith(` - ${variant}`)) || null;
}

function applyMythicWeaponVariantIndicator(element, name, item = items[name]) {
    const variant = getMythicWeaponVariant(name, item);
    element.classList.remove('item-variant', 'item-variant-dawn', 'item-variant-crimson');

    if (!variant) {
        element.style.removeProperty('--item-variant-accent');
        delete element.dataset.itemVariant;
        return null;
    }

    const variantStyle = MYTHIC_WEAPON_VARIANT_STYLES[variant];
    element.classList.add('item-variant', `item-variant-${variantStyle.className}`);
    element.style.setProperty('--item-variant-accent', variantStyle.color);
    element.dataset.itemVariant = variantStyle.className;
    return variant;
}

function getHighTierMaterialsForItem(name, item = items[name]) {
    if (!item) return [];
    const components = new Set(item.components || []);
    const suffix = Object.keys(SPECIAL_ITEM_RESOURCE_SUFFIXES).find(value => name.endsWith(` ${value}`));
    if (suffix) return [SPECIAL_ITEM_RESOURCE_SUFFIXES[suffix]];

    if (components.has('Force Core') || (components.has('Meteorite') && components.has('Tree of Life'))) {
        return ['Force Core'];
    }
    return Object.keys(HIGH_TIER_MATERIALS).filter(material => components.has(material));
}

function getItemCreditCost(name, item = items[name]) {
    return getHighTierMaterialsForItem(name, item)
        .reduce((total, material) => total + HIGH_TIER_MATERIALS[material].price, 0);
}

function getBuildCreditCost(itemNames) {
    return Array.from(itemNames || []).reduce((total, name) => total + getItemCreditCost(name), 0);
}

function getHighTierMaterialName(material) {
    const config = HIGH_TIER_MATERIALS[material];
    return currentLanguage === 'ko' && config ? config.nameKo : material;
}

function itemMatchesLateResourceFilters(name, item = items[name]) {
    const materials = getHighTierMaterialsForItem(name, item);
    if (materials.length === 0) return true;
    return materials.some(material => lateResourceFilters.has(material));
}

function compareCatalogItems(a, b) {
    const [nameA, dataA] = a;
    const [nameB, dataB] = b;
    const orderA = BUILD_SLOT_ORDER[dataA.part] || 99;
    const orderB = BUILD_SLOT_ORDER[dataB.part] || 99;

    if (orderA !== orderB) return orderA - orderB;

    if (dataA.part === 'Weapon' && dataB.part === 'Weapon') {
        const weaponDifference = (WEAPON_TYPE_ORDER[dataA.weaponType] ?? 99) -
            (WEAPON_TYPE_ORDER[dataB.weaponType] ?? 99);
        if (weaponDifference !== 0) return weaponDifference;
    }

    if (activeBuildType === BUILD_TYPES.LATE) {
        const gradeDifference = (LATE_GRADE_ORDER[dataA.type] ?? 99) -
            (LATE_GRADE_ORDER[dataB.type] ?? 99);
        if (gradeDifference !== 0) return gradeDifference;
    }

    return getItemName(nameA).localeCompare(getItemName(nameB), currentLanguage === 'ko' ? 'ko' : 'en');
}

function sortItemsByBuildSlot(itemNames) {
    return [...itemNames].sort((a, b) => {
        const itemA = items[a] || {};
        const itemB = items[b] || {};
        const partDiff = (BUILD_SLOT_ORDER[itemA.part] || 99) - (BUILD_SLOT_ORDER[itemB.part] || 99);
        if (partDiff !== 0) return partDiff;
        return getItemName(a).localeCompare(getItemName(b), currentLanguage === 'ko' ? 'ko' : 'en');
    });
}

const FILTER_STAT_KEYS = {
    damageReduction: ['preventBasicAttackDamaged', 'preventSkillDamaged'],
    hpRegen: ['hpRegen', 'hpRegenRatio'],
    omnisyphon: ['lifeSteal'],
    visionRange: ['sightRange'],
    moveSpeed: ['moveSpeed', 'moveSpeedRatio']
};

function getItemStatValue(item, statId, level = charLevel) {
    const keys = FILTER_STAT_KEYS[statId] || [statId];
    return keys.reduce((sum, key) => {
        const base = (item.stats && item.stats[key]) || 0;
        const unique = (item.uniqueStats && item.uniqueStats[key]) || 0;
        const perLevel = (item.statsByLv && item.statsByLv[key]) ? item.statsByLv[key] * level : 0;
        return sum + base + unique + perLevel;
    }, 0);
}

const earlyBuild = new Set();
const lateBuild = new Set();
const buildsByType = Object.freeze({
    [BUILD_TYPES.EARLY]: earlyBuild,
    [BUILD_TYPES.LATE]: lateBuild
});
const WORKFLOW_STORAGE_KEY = 'workflowMode';
const buildFilterState = {
    [BUILD_TYPES.EARLY]: {
        part: 'All',
        weapon: 'All',
        substats: new Set(),
        passiveSkills: new Set(),
        search: ''
    },
    [BUILD_TYPES.LATE]: {
        part: 'All',
        weapon: 'All',
        substats: new Set(),
        passiveSkills: new Set(),
        search: ''
    }
};
const lateRarityFilters = new Set(BUILD_CONFIG[BUILD_TYPES.LATE].grades);
const lateResourceFilters = new Set(Object.keys(HIGH_TIER_MATERIALS));
const lateComparisonBuilds = [null, null];
const recommendationStateByType = {
    [BUILD_TYPES.EARLY]: {
        priorities: [],
        weights: {},
        automaticWeights: true,
        constraints: {},
        results: [],
        passiveSkills: new Set(),
        onlyTwoZones: false,
        creditMin: '',
        creditMax: ''
    },
    [BUILD_TYPES.LATE]: {
        priorities: [],
        weights: {},
        automaticWeights: true,
        constraints: {},
        results: [],
        passiveSkills: new Set(),
        onlyTwoZones: false,
        creditMin: '',
        creditMax: ''
    }
};
let activeBuildType = BUILD_TYPES.EARLY;
let currentCenterMode = "optimizer";
let earlyCenterMode = "optimizer";
let lateCenterMode = "optimizer";
let recommendationPriorities = [];
let recommendationWeights = {};
let recommendationAutomaticWeights = true;
let recommendationConstraints = {};
let recommendationResults = [];
let recommendationPassiveSkills = new Set();
let recommendationOnlyTwoZones = false;
let recommendationCreditMin = '';
let recommendationCreditMax = '';
const recommendationFiltersCollapsedByType = {
    [BUILD_TYPES.EARLY]: false,
    [BUILD_TYPES.LATE]: false
};
const recommendationRouteCache = new Map();
const RECOMMENDATION_RESULT_LIMIT = 20;
let lastRecommendationSearchMetrics = null;
let currentFilter = buildFilterState[BUILD_TYPES.EARLY].part;
let currentWeaponFilter = buildFilterState[BUILD_TYPES.EARLY].weapon;
let activeSubstats = buildFilterState[BUILD_TYPES.EARLY].substats;
let activePassiveSkills = buildFilterState[BUILD_TYPES.EARLY].passiveSkills;
let currentCharacter = null;
let chars = {};
let charLevel = 1;
let selectedRoutes = [];
let generatedRoutes = [];
let activeTooltipTrigger = null;

function resolveInitialBuildType(search = '', storedMode = null) {
    const queryMode = new URLSearchParams(search).get('mode');
    if (queryMode === BUILD_TYPES.EARLY || queryMode === BUILD_TYPES.LATE) return queryMode;
    if (storedMode === BUILD_TYPES.EARLY || storedMode === BUILD_TYPES.LATE) return storedMode;
    return BUILD_TYPES.EARLY;
}

function saveCurrentBuildFilterState() {
    const state = buildFilterState[activeBuildType];
    state.part = currentFilter;
    state.weapon = currentWeaponFilter;
    state.substats = activeSubstats;
    state.passiveSkills = activePassiveSkills;
    const itemSearch = document.getElementById('item-search');
    if (itemSearch) state.search = itemSearch.value;
}

function loadBuildFilterState(buildType) {
    const state = buildFilterState[buildType];
    currentFilter = state.part;
    currentWeaponFilter = state.weapon;
    activeSubstats = state.substats;
    activePassiveSkills = state.passiveSkills;
}

function saveCurrentRecommendationState() {
    const state = recommendationStateByType[activeBuildType];
    state.priorities = recommendationPriorities;
    state.weights = recommendationWeights;
    state.automaticWeights = recommendationAutomaticWeights;
    state.constraints = recommendationConstraints;
    state.results = recommendationResults;
    state.passiveSkills = recommendationPassiveSkills;
    state.onlyTwoZones = recommendationOnlyTwoZones;
    state.creditMin = recommendationCreditMin;
    state.creditMax = recommendationCreditMax;
}

function loadRecommendationState(buildType) {
    const state = recommendationStateByType[buildType];
    recommendationPriorities = state.priorities;
    recommendationWeights = state.weights;
    recommendationAutomaticWeights = state.automaticWeights;
    recommendationConstraints = state.constraints;
    recommendationResults = state.results;
    recommendationPassiveSkills = state.passiveSkills;
    recommendationOnlyTwoZones = state.onlyTwoZones;
    recommendationCreditMin = state.creditMin;
    recommendationCreditMax = state.creditMax;
}

const ECHION_EXCLUSIVE_WEAPONS = new Set([
    "Black Mamba King",
    "Deathadder Queen",
    "Alpha Sidewinder"
]);

const PRIYA_EXCLUSIVE_HEAD_ITEMS = new Set([
    "Harmony in Full Bloom",
    "Celestial Echo"
]);

function isItemCompatibleWithCharacter(itemName, characterName = currentCharacter) {
    const item = items[itemName];
    if (!item) return false;
    if (!characterName) return true;

    const character = chars[characterName];
    if (!character) return false;
    if (item.part === 'Weapon' && !character.masteries.includes(item.weaponType)) return false;
    if (PRIYA_EXCLUSIVE_HEAD_ITEMS.has(itemName) && characterName !== 'Priya') return false;
    if (characterName === 'Priya' && item.part === 'Head' && !PRIYA_EXCLUSIVE_HEAD_ITEMS.has(itemName)) return false;
    if (characterName !== 'Echion' && (ECHION_EXCLUSIVE_WEAPONS.has(itemName) || item.weaponType === 'VFArm')) return false;
    return true;
}

function removeIncompatibleBuildItems(buildType, characterName = currentCharacter) {
    const build = getBuild(buildType);
    let changed = false;
    for (const itemName of build) {
        if (!isItemEligibleForBuild(items[itemName], buildType) || !isItemCompatibleWithCharacter(itemName, characterName)) {
            build.delete(itemName);
            changed = true;
        }
    }
    return changed;
}

function addItemToBuild(itemName, buildType = activeBuildType) {
    const item = items[itemName];
    if (!isItemEligibleForBuild(item, buildType) || !isItemCompatibleWithCharacter(itemName)) return false;

    const build = getBuild(buildType);
    if (getBuildConfig(buildType).selectionMode === 'single-per-slot') {
        for (const selectedName of build) {
            if (items[selectedName] && items[selectedName].part === item.part) build.delete(selectedName);
        }
    }
    build.add(itemName);
    return true;
}

function getBuildItemForSlot(build, slot) {
    return Array.from(build).find(name => items[name] && items[name].part === slot) || null;
}

function isLateBuildComplete(build = lateBuild) {
    return EQUIPMENT_SLOTS.every(slot => !!getBuildItemForSlot(build, slot));
}

function canSaveLateComparisonBuild(build = lateBuild) {
    return build.size > 0;
}

function createLateBuildSnapshot(build = lateBuild) {
    if (!canSaveLateComparisonBuild(build)) return null;
    return Object.freeze(sortItemsByBuildSlot(build));
}

const SUBSTATS = [
    { id: 'attackPower', name: { en: 'Attack Power', ko: '공격력' } },
    { id: 'attackSpeedRatio', name: { en: 'Attack Speed', ko: '공격 속도' } },
    { id: 'criticalStrikeChance', name: { en: 'Critical Strike Chance', ko: '치명타 확률' } },
    { id: 'attackRange', name: { en: 'Attack Range', ko: '기본 공격 사거리' } },
    { id: 'penetrationDefense', name: { en: 'Armor Penetration', ko: '방어 관통' } },
    { id: 'skillAmp', name: { en: 'Skill Amplification', ko: '스킬 증폭' } },
    { id: 'cooldownReduction', name: { en: 'Cooldown Reduction', ko: '쿨다운 감소' } },
    { id: 'maxHp', name: { en: 'Max HP', ko: '최대 체력' } },
    { id: 'hpRegen', name: { en: 'HP Regen', ko: '체력 재생' } },
    { id: 'defense', name: { en: 'Defense', ko: '방어력' } },
    { id: 'damageReduction', name: { en: 'Damage Reduction', ko: '피해 감소' } },
    { id: 'tenacity', name: { en: 'Tenacity', ko: '방해 효과 저항' } },
    { id: 'visionRange', name: { en: 'Vision Range', ko: '시야' } },
    { id: 'lifeSteal', name: { en: 'Lifesteal', ko: '생명력 흡수' } },
    { id: 'omnisyphon', name: { en: 'Omnisyphon', ko: '모든 피해 흡혈' } },
    { id: 'moveSpeed', name: { en: 'Movement Speed', ko: '이동 속도' } }
];

let DISPLAY_STATS = [];
let ITEM_TOOLTIP_STATS = DISPLAY_STATS;
let SELECTABLE_STATS = [];
let PASSIVE_SKILL_OPTIONS = [];

const STAT_LABELS = {
    adaptiveForce: { en: 'Adaptive Force', ko: '적응형 능력치' },
    attackPower: { en: 'Attack Power', ko: '공격력' },
    attackSpeedRatio: { en: 'Attack Speed', ko: '공격 속도' },
    criticalStrikeChance: { en: 'Critical Strike Chance', ko: '치명타 확률' },
    criticalStrikeDamage: { en: 'Critical Strike Damage', ko: '치명타 피해량' },
    attackRange: { en: 'Attack Range', ko: '기본 공격 사거리' },
    penetrationDefenseRatio: { en: 'Armor Penetration %', ko: '방어 관통 %' },
    penetrationDefense: { en: 'Armor Penetration', ko: '방어 관통' },
    skillAmp: { en: 'Skill Amplification', ko: '스킬 증폭' },
    skillAmpRatio: { en: 'Skill Amplification %', ko: '스킬 증폭 %' },
    cooldownReduction: { en: 'Cooldown Reduction', ko: '쿨다운 감소' },
    tacticalCooldownReduction: { en: 'Tactical Skill Cooldown Reduction', ko: '전술 스킬 쿨다운 감소' },
    ultCooldownReduction: { en: 'Ultimate Cooldown Reduction', ko: '궁극기 쿨다운 감소' },
    maxHp: { en: 'Max HP', ko: '최대 체력' },
    hpRegen: { en: 'HP Regen', ko: '체력 재생' },
    hpRegenRatio: { en: 'HP Regen', ko: '체력 재생' },
    defense: { en: 'Defense', ko: '방어력' },
    preventBasicAttackDamaged: { en: 'Basic Attack Damage Reduction', ko: '기본 공격 피해 감소' },
    preventSkillDamaged: { en: 'Skill Damage Reduction', ko: '스킬 피해 감소' },
    tenacity: { en: 'Tenacity', ko: '방해 효과 저항' },
    sightRange: { en: 'Vision Range', ko: '시야' },
    normalLifeSteal: { en: 'Lifesteal', ko: '생명력 흡수' },
    lifeSteal: { en: 'Omnisyphon', ko: '모든 피해 흡혈' },
    skillLifeSteal: { en: 'Skill Lifesteal', ko: '스킬 흡혈' },
    moveSpeed: { en: 'Movement Speed', ko: '이동 속도' },
    moveSpeedRatio: { en: 'Movement Speed %', ko: '이동 속도 %' },
    healerGiveHpHealRatio: { en: 'Healing Power', ko: '주는 회복 증가' },
    slowResistRatio: { en: 'Slow Resist', ko: '둔화 저항' },
    increaseBasicAttackDamageRatio: { en: 'Basic Attack Damage Increase', ko: '기본 공격 피해 증가' }
};

const HIDDEN_DISPLAY_STATS = new Set(['moveSpeedRatio']);

const DISPLAY_STAT_ORDER = [
    'attackPower',
    'attackSpeedRatio',
    'criticalStrikeChance',
    'criticalStrikeDamage',
    'attackRange',
    'penetrationDefenseRatio',
    'penetrationDefense',
    'adaptiveForce',
    'skillAmp',
    'skillAmpRatio',
    'cooldownReduction',
    'tacticalCooldownReduction',
    'ultCooldownReduction',
    'maxHp',
    'hpRegen',
    'hpRegenRatio',
    'defense',
    'preventBasicAttackDamaged',
    'preventSkillDamaged',
    'tenacity',
    'slowResistRatio',
    'sightRange',
    'normalLifeSteal',
    'lifeSteal',
    'skillLifeSteal',
    'moveSpeed',
    'healerGiveHpHealRatio',
    'increaseBasicAttackDamageRatio'
];

const PART_NAMES = {
    "Weapon": { en: "Weapon", ko: "무기" },
    "Chest": { en: "Chest", ko: "옷" },
    "Head": { en: "Head", ko: "머리" },
    "Arm": { en: "Arm", ko: "팔" },
    "Leg": { en: "Leg", ko: "다리" }
};

const TYPE_NAMES = {
    "Epic": { en: "Epic", ko: "영웅" },
    "Legend": { en: "Legendary", ko: "전설" },
    "Mythic": { en: "Mythic", ko: "초월" }
};

const WEAPON_TYPES = [
    { api: "Glove", name: { en: "Glove", ko: "글러브" }, img: "images/ui/weapon-types/Glove.png" },
    { api: "Tonfa", name: { en: "Tonfa", ko: "톤파" }, img: "images/ui/weapon-types/Tonfa.png" },
    { api: "Bat", name: { en: "Bat", ko: "방망이" }, img: "images/ui/weapon-types/Bat.png" },
    { api: "Hammer", name: { en: "Hammer", ko: "망치" }, img: "images/ui/weapon-types/Hammer.png" },
    { api: "Whip", name: { en: "Whip", ko: "채찍" }, img: "images/ui/weapon-types/Whip.png" },
    { api: "HighAngleFire", name: { en: "Throw", ko: "투척" }, img: "images/ui/weapon-types/Throwing.png" },
    { api: "DirectFire", name: { en: "Shuriken", ko: "암기" }, img: "images/ui/weapon-types/Shuriken.png" },
    { api: "Bow", name: { en: "Bow", ko: "활" }, img: "images/ui/weapon-types/Bow.png" },
    { api: "CrossBow", name: { en: "Crossbow", ko: "석궁" }, img: "images/ui/weapon-types/Crossbow.png" },
    { api: "Pistol", name: { en: "Pistol", ko: "권총" }, img: "images/ui/weapon-types/Pistol.png" },
    { api: "AssaultRifle", name: { en: "Assault Rifle", ko: "돌격 소총" }, img: "images/ui/weapon-types/Assault Rifle.png" },
    { api: "SniperRifle", name: { en: "Sniper Rifle", ko: "저격총" }, img: "images/ui/weapon-types/Sniper Rifle.png" },
    { api: "Axe", name: { en: "Axe", ko: "도끼" }, img: "images/ui/weapon-types/Axe.png" },
    { api: "OneHandSword", name: { en: "Dagger", ko: "단검" }, img: "images/ui/weapon-types/Dagger.png" },
    { api: "TwoHandSword", name: { en: "Two-Handed Sword", ko: "양손검" }, img: "images/ui/weapon-types/Two-Handed Sword.png" },
    { api: "DualSword", name: { en: "Dual Swords", ko: "쌍검" }, img: "images/ui/weapon-types/Dual Swords.png" },
    { api: "Spear", name: { en: "Spear", ko: "창" }, img: "images/ui/weapon-types/Spear.png" },
    { api: "Nunchaku", name: { en: "Nunchaku", ko: "쌍절곤" }, img: "images/ui/weapon-types/Nunchaku.png" },
    { api: "Rapier", name: { en: "Rapier", ko: "레이피어" }, img: "images/ui/weapon-types/Rapier.png" },
    { api: "Guitar", name: { en: "Guitar", ko: "기타" }, img: "images/ui/weapon-types/Guitar.png" },
    { api: "Camera", name: { en: "Camera", ko: "카메라" }, img: "images/ui/weapon-types/Camera.png" },
    { api: "Arcana", name: { en: "Arcana", ko: "아르카나" }, img: "images/ui/weapon-types/Arcana.png" },
    { api: "VFArm", name: { en: "VF Prosthetic", ko: "VF의수" }, img: "images/ui/weapon-types/VF Prosthetic.png" }
];
const WEAPON_TYPE_ORDER = Object.freeze(
    Object.fromEntries(WEAPON_TYPES.map((weapon, index) => [weapon.api, index]))
);

// HARDCODED BASE WEAPONS
const BASE_WEAPONS = new Set([
    "Cotton Gloves", "Bamboo", "Short Rod", "Hammer", "Whip", 
    "Baseball", "Razor", "Bow", "Short Crossbow", "Walther PPK", 
    "Fedorova", "Long Rifle", "Hatchet", "Kitchen Knife", 
    "Rusty Sword", "Twin Blades", "Short Spear", "Steel Chain", 
    "Needle", "Starter Guitar", "Lens", "Glass Bead"
]);

let items = {};
let mapData = {};
let dataMeta = {};

function setTranslatedElement(id, key) {
    const element = document.getElementById(id);
    if (!element) return;
    element.dataset.i18n = key;
    element.textContent = t(key);
}

function renderCenterMode(mode) {
    currentCenterMode = mode === 'recommendations' ? 'recommendations' : 'optimizer';
    document.querySelectorAll('.mode-tab').forEach(tab => {
        const selected = tab.dataset.mode === currentCenterMode;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('.mode-view').forEach(view => {
        view.classList.toggle('active', view.id === `${currentCenterMode}-view`);
    });
}

function renderWorkflowShell() {
    const isEarly = activeBuildType === BUILD_TYPES.EARLY;
    document.body.dataset.workflow = activeBuildType;

    document.querySelectorAll('.workflow-btn').forEach(button => {
        const selected = button.dataset.buildType === activeBuildType;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
    });

    const modeTabs = document.querySelector('.mode-tabs');
    if (modeTabs) modeTabs.hidden = false;
    renderCenterMode(isEarly ? earlyCenterMode : lateCenterMode);

    ['calculate-btn', 'route-results-container', 'resizer', 'stat-calculator'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.hidden = !isEarly;
    });
    const lateGamePanel = document.getElementById('late-game-panel');
    if (lateGamePanel) lateGamePanel.hidden = isEarly;
    const lateResourceFilterGroup = document.getElementById('late-resource-filter-group');
    if (lateResourceFilterGroup) lateResourceFilterGroup.hidden = isEarly;
    const routeFilter = document.querySelector('.recommendation-route-filter');
    if (routeFilter) routeFilter.hidden = !isEarly;
    const creditFilter = document.getElementById('recommendation-credit-filter');
    if (creditFilter) creditFilter.hidden = isEarly;

    setTranslatedElement('build-heading', isEarly ? 'yourEarlyBuild' : 'yourLateBuild');
    setTranslatedElement('item-catalog-heading', isEarly ? 'selectEpicItems' : 'selectLateItems');

    const itemSearch = document.getElementById('item-search');
    if (itemSearch) itemSearch.value = buildFilterState[activeBuildType].search;

    if (!isEarly) renderLateGamePanel();
}

function updateWorkflowUrl(buildType) {
    const url = new URL(window.location.href);
    if (buildType === BUILD_TYPES.LATE) url.searchParams.set('mode', BUILD_TYPES.LATE);
    else url.searchParams.delete('mode');
    window.history.replaceState({}, '', url);
}

function switchBuildType(buildType, { persist = true, updateUrl = true } = {}) {
    if (!BUILD_CONFIG[buildType]) return;

    saveCurrentBuildFilterState();
    saveCurrentRecommendationState();
    if (activeBuildType === BUILD_TYPES.EARLY) earlyCenterMode = currentCenterMode;
    else lateCenterMode = currentCenterMode;
    activeBuildType = buildType;
    loadBuildFilterState(buildType);
    loadRecommendationState(buildType);

    if (persist) localStorage.setItem(WORKFLOW_STORAGE_KEY, buildType);
    if (updateUrl) updateWorkflowUrl(buildType);

    buildDisplayStats(buildType);
    hideGlobalTooltip();
    renderWorkflowShell();
    setupFilters();
    setupRecommendationControls();
    renderRecommendationPriorityList();
    renderRecommendationResults();
    renderMainGrid();
    updateSelectedPanel();
    if (buildType === BUILD_TYPES.EARLY) renderStatComparison();
    else renderLateGamePanel();
}

function setupWorkflowSwitch() {
    document.querySelectorAll('.workflow-btn').forEach(button => {
        if (button.dataset.bound === 'true') return;
        button.addEventListener('click', () => switchBuildType(button.dataset.buildType));
        button.dataset.bound = 'true';
    });
}

function setupLateGameControls() {
    document.querySelectorAll('.resource-filter-btn').forEach(button => {
        const syncButton = () => {
            const resource = button.dataset.resource;
            const selected = lateResourceFilters.has(button.dataset.resource);
            const label = `${getHighTierMaterialName(resource)} · ${HIGH_TIER_MATERIALS[resource].price} ${t('credits')}`;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-pressed', String(selected));
            button.setAttribute('aria-label', label);
            button.title = label;
        };
        syncButton();
        if (button.dataset.bound === 'true') return;
        button.addEventListener('click', () => {
            const resource = button.dataset.resource;
            if (lateResourceFilters.has(resource)) lateResourceFilters.delete(resource);
            else lateResourceFilters.add(resource);
            document.querySelectorAll('.resource-filter-btn').forEach(resourceButton => {
                const selected = lateResourceFilters.has(resourceButton.dataset.resource);
                resourceButton.classList.toggle('active', selected);
                resourceButton.setAttribute('aria-pressed', String(selected));
            });
            if (activeBuildType === BUILD_TYPES.LATE) {
                recommendationResults = [];
                renderRecommendationResults();
            }
            renderMainGrid();
        });
        button.dataset.bound = 'true';
    });

    document.querySelectorAll('.late-save-btn').forEach(button => {
        if (button.dataset.bound === 'true') return;
        button.addEventListener('click', () => saveLateComparisonBuild(Number(button.dataset.slot)));
        button.dataset.bound = 'true';
    });

    const clearButton = document.getElementById('clear-late-comparison-btn');
    if (clearButton && clearButton.dataset.bound !== 'true') {
        clearButton.addEventListener('click', () => {
            lateComparisonBuilds[0] = null;
            lateComparisonBuilds[1] = null;
            renderLateGamePanel();
        });
        clearButton.dataset.bound = 'true';
    }
}

function renderDataStatus() {
    const patchElement = document.getElementById('data-patch');
    const updatedElement = document.getElementById('data-updated');
    if (!patchElement || !updatedElement) return;

    patchElement.textContent = `${t('dataPatch')}: ${dataMeta.patchVersion || '-'}`;

    const generatedAt = dataMeta.generatedAt ? new Date(dataMeta.generatedAt) : null;
    if (!generatedAt || Number.isNaN(generatedAt.getTime())) {
        updatedElement.textContent = `${t('dataUpdated')}: -`;
        updatedElement.removeAttribute('datetime');
        return;
    }

    const locale = currentLanguage === 'ko' ? 'ko-KR' : 'en-US';
    const formattedTimestamp = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    }).format(generatedAt);

    updatedElement.textContent = `${t('dataUpdated')}: ${formattedTimestamp}`;
    updatedElement.dateTime = dataMeta.generatedAt;
}

document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            syncThemeControl();
        });
    }

    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.value = currentLanguage;
        langSelect.addEventListener('change', (event) => {
            currentLanguage = event.target.value;
            localStorage.setItem('language', currentLanguage);
            applyTranslations();

            const loadState = document.getElementById('app-status')?.dataset.state || 'loading';
            if (loadState !== 'ready') {
                setAppStatus(loadState);
                return;
            }

            renderDataStatus();
            setupFilters();
            setupLateGameControls();
            setupRecommendationControls();
            renderRecommendationPriorityList();
            renderRecommendationResults();
            renderMainGrid();
            updateSelectedPanel();
            renderStatComparison();
            renderLateGamePanel();
        });
    }

    applyTranslations();
    setAppStatus('loading');

    try {
        const res = await fetch('data.json');
        if (!res.ok) throw new Error(`Data request failed with status ${res.status}`);
        const data = await res.json();
        if (!data || !data.items || !data.mapData || !data.chars) {
            throw new Error('Data response is missing required optimizer fields');
        }
        
        items = data.items;
        mapData = data.mapData;
        chars = data.chars;
        dataMeta = data.meta || {};
        activeBuildType = resolveInitialBuildType(
            window.location.search,
            localStorage.getItem(WORKFLOW_STORAGE_KEY)
        );
        loadBuildFilterState(activeBuildType);
        loadRecommendationState(activeBuildType);
        localStorage.setItem(WORKFLOW_STORAGE_KEY, activeBuildType);
        updateWorkflowUrl(activeBuildType);
        buildDisplayStats(activeBuildType);
        renderDataStatus();
        
        // 1. Setup Filters
        setupWorkflowSwitch();
        setupLateGameControls();
        setupFilters();
        setupModeTabs();
        setupRecommendationControls();
        renderWorkflowShell();
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.compact-select')) closeCompactSelects();
        });
        document.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'touch' && !window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

            const tappedTrigger = e.target.closest('.item-card, .recommendation-item-icon[data-item], .late-snapshot-icon[data-item]');
            if (tappedTrigger !== activeTooltipTrigger) hideGlobalTooltip();
        }, true);
        document.addEventListener('scroll', () => {
            if (window.matchMedia('(hover: none), (pointer: coarse)').matches) hideGlobalTooltip();
        }, { capture: true, passive: true });
        
        // 2. Initialize Grid
        renderMainGrid();
        updateSelectedPanel();

        // 3. Setup Events
        const itemSearch = document.getElementById('item-search');
        if (itemSearch) {
            itemSearch.addEventListener('input', () => {
                buildFilterState[activeBuildType].search = itemSearch.value;
                renderMainGrid();
            });
            setupSearchClearButton(itemSearch);
        }

        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateEarlyRouteVariants);
        }

        const levelInput = document.getElementById('char-level');
        if (levelInput) {
            levelInput.addEventListener('input', (e) => {
                let val = parseInt(e.target.value) || 1;
                if (val < 1) val = 1;
                if (val > 20) val = 20;
                e.target.value = val;
                charLevel = val;
                renderMainGrid();
                renderStatComparison();
                renderLateGamePanel();
                if (currentCenterMode === "recommendations") {
                    recommendationResults = [];
                    renderRecommendationResults();
                }
            });
        }

        const resetBtn = document.getElementById('reset-build-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                getBuild().clear();
                updateMainGridVisuals();
                updateSelectedPanel({ buildChanged: true });
            });
        }

        const resetAllBtn = document.getElementById('reset-all-btn');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                // Reset searches
                const itemSearch = document.getElementById('item-search');
                if (itemSearch) {
                    itemSearch.value = '';
                    buildFilterState[activeBuildType].search = '';
                }

                // Reset character
                selectCharacter(null);
                const charSearch = document.getElementById('char-search');
                if (charSearch) charSearch.value = '';

                // Reset substats
                activeSubstats.clear();
                activePassiveSkills.clear();
                recommendationPriorities = [];
                recommendationWeights = {};
                recommendationAutomaticWeights = true;
                recommendationConstraints = {};
                recommendationResults = [];
                recommendationPassiveSkills.clear();
                recommendationOnlyTwoZones = false;
                recommendationCreditMin = '';
                recommendationCreditMax = '';
                lateRarityFilters.clear();
                BUILD_CONFIG[BUILD_TYPES.LATE].grades.forEach(grade => lateRarityFilters.add(grade));
                lateResourceFilters.clear();
                Object.keys(HIGH_TIER_MATERIALS).forEach(material => lateResourceFilters.add(material));
                lateComparisonBuilds[0] = null;
                lateComparisonBuilds[1] = null;
                const twoZoneFilter = document.getElementById('recommend-two-zone-filter');
                if (twoZoneFilter) twoZoneFilter.checked = false;
                const autoWeight = document.getElementById('recommendation-auto-weight');
                if (autoWeight) autoWeight.checked = true;
                const creditMinInput = document.getElementById('recommendation-credit-min');
                const creditMaxInput = document.getElementById('recommendation-credit-max');
                if (creditMinInput) creditMinInput.value = '';
                if (creditMaxInput) creditMaxInput.value = '';
                const substatContainer = document.getElementById('substat-filters');
                if (substatContainer) renderSubstatPicker(substatContainer);
                const passiveSkillContainer = document.getElementById('passive-skill-filters');
                if (passiveSkillContainer) {
                    renderPassiveSkillPicker(passiveSkillContainer, activePassiveSkills, {
                        prefix: 'passive-skill-filter',
                        onChange: () => renderMainGrid()
                    });
                }
                setupRecommendationControls();
                setupLateGameControls();
                renderRecommendationPriorityList();
                renderRecommendationResults();
                renderMainGrid();

                // Reset item part filter
                const allFilterBtn = document.querySelector('.filter-row:not(#weapon-subfilters):not(.character-row):not(.substat-row) > .filter-btn[data-filter="All"]');
                if (allFilterBtn) allFilterBtn.click();

                // Reset weapon subfilter
                const allWeaponBtn = document.querySelector('#weapon-subfilters .weapon-btn[data-subfilter="All"]');
                if (allWeaponBtn) allWeaponBtn.click();

                // Reset build
                if (resetBtn) resetBtn.click();
            });
        }

        // Setup Resizer
        const resizer = document.getElementById('resizer');
        const topPanel = document.getElementById('route-results-container');
        const bottomPanel = document.getElementById('stat-calculator');
        
        if (resizer && topPanel && bottomPanel) {
            let isResizing = false;
            let startY, startTopFlex, startBottomFlex;

            resizer.addEventListener('mousedown', (e) => {
                isResizing = true;
                startY = e.clientY;
                startTopFlex = topPanel.getBoundingClientRect().height;
                startBottomFlex = bottomPanel.getBoundingClientRect().height;
                document.body.style.cursor = 'ns-resize';
                document.body.style.userSelect = 'none';
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                const dy = e.clientY - startY;
                const newTopHeight = startTopFlex + dy;
                const newBottomHeight = startBottomFlex - dy;
                
                if (newTopHeight > 100 && newBottomHeight > 100) {
                    topPanel.style.flex = `${newTopHeight}`;
                    bottomPanel.style.flex = `${newBottomHeight}`;
                }
            });

            document.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.cursor = 'default';
                    document.body.style.userSelect = 'auto';
                }
            });
        }
        setAppStatus('ready');
    } catch (e) {
        console.error("Failed to load API data", e);
        setAppStatus('error');
    }
});

// ==========================================
// UI: FILTERS & RENDERING
// ==========================================

function setupFilters() {
    const subfilterContainer = document.getElementById('weapon-subfilters');

    if (currentCharacter && currentWeaponFilter !== 'All') {
        const masteries = chars[currentCharacter] ? chars[currentCharacter].masteries : [];
        if (!masteries.includes(currentWeaponFilter)) {
            currentWeaponFilter = 'All';
            buildFilterState[activeBuildType].weapon = 'All';
        }
    }
    
    let subHtml = `<button type="button" class="filter-btn weapon-btn ${currentWeaponFilter === 'All' ? 'active' : ''}" data-subfilter="All" title="${t('all')}" aria-pressed="${currentWeaponFilter === 'All'}" style="color:white; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8em;">${t('all')}</button>`;
    WEAPON_TYPES.forEach(w => {
        const selected = currentWeaponFilter === w.api;
        subHtml += `<button type="button" class="filter-btn weapon-btn ${selected ? 'active' : ''}" data-subfilter="${escapeAttribute(w.api)}" title="${escapeAttribute(w.name[currentLanguage])}" aria-pressed="${selected}">
            <img src="${escapeAttribute(w.img)}" alt="${escapeAttribute(w.name[currentLanguage])}" loading="lazy" decoding="async" onerror="this.style.display='none'; this.parentElement.innerText='?'">
        </button>`;
    });
    if (subfilterContainer) subfilterContainer.innerHTML = subHtml;

    const charContainer = document.getElementById('character-selection');
    const substatContainer = document.getElementById('substat-filters');
    const passiveSkillContainer = document.getElementById('passive-skill-filters');

    if (charContainer && chars) renderCharacterPicker(charContainer);
    if (substatContainer) renderSubstatPicker(substatContainer);
    if (passiveSkillContainer) {
        renderPassiveSkillPicker(passiveSkillContainer, activePassiveSkills, {
            prefix: 'passive-skill-filter',
            onChange: () => renderMainGrid()
        });
    }

    const topBtns = document.querySelectorAll('.filter-row:not(#weapon-subfilters):not(.character-row):not(.substat-row) > .filter-btn');
    topBtns.forEach(btn => {
        const selected = btn.dataset.filter === currentFilter;
        const label = btn.dataset.filter === 'All'
            ? t('all')
            : (PART_NAMES[btn.dataset.filter]?.[currentLanguage] || btn.dataset.filter);
        btn.classList.toggle('active', selected);
        btn.setAttribute('aria-pressed', String(selected));
        btn.setAttribute('aria-label', label);
        btn.title = label;
        const image = btn.querySelector('img');
        if (image) image.alt = label;
        if (btn.dataset.bound === 'true') return;
        btn.addEventListener('click', () => {
            topBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            currentFilter = btn.dataset.filter;
            buildFilterState[activeBuildType].part = currentFilter;
            
            // Subfilter container remains always visible now
            renderMainGrid();
        });
        btn.dataset.bound = 'true';
    });

    const subBtns = document.querySelectorAll('#weapon-subfilters .filter-btn');
    const mainWeaponImg = document.querySelector('.filter-btn[data-filter="Weapon"] img');

    if (currentCharacter && chars[currentCharacter]) {
        const masteries = chars[currentCharacter].masteries;
        subBtns.forEach(button => {
            const weaponType = button.dataset.subfilter;
            const disabled = weaponType !== 'All' && !masteries.includes(weaponType);
            button.classList.toggle('disabled', disabled);
            button.disabled = disabled;
        });
    }

    if (mainWeaponImg) {
        const selectedWeapon = WEAPON_TYPES.find(weapon => weapon.api === currentWeaponFilter);
        mainWeaponImg.src = selectedWeapon ? selectedWeapon.img : 'images/ui/Weapon.png';
    }

    subBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentWeaponFilter = btn.dataset.subfilter;
            buildFilterState[activeBuildType].weapon = currentWeaponFilter;
            recommendationResults = [];

            if (mainWeaponImg) {
                if (currentWeaponFilter === "All") {
                    mainWeaponImg.src = "images/ui/Weapon.png";
                } else {
                    const clickedImg = btn.querySelector('img');
                    if (clickedImg) {
                        mainWeaponImg.src = clickedImg.src;
                    }
                }
            }

            renderMainGrid();
            renderRecommendationResults();
        });
    });
}

function setupModeTabs() {
    document.querySelectorAll('.mode-tab').forEach(tab => {
        if (tab.dataset.bound === 'true') return;
        tab.addEventListener('click', () => {
            const nextMode = tab.dataset.mode || 'optimizer';
            if (activeBuildType === BUILD_TYPES.EARLY) earlyCenterMode = nextMode;
            else lateCenterMode = nextMode;
            renderCenterMode(nextMode);
            if (currentCenterMode === 'recommendations') {
                setupRecommendationControls();
                renderRecommendationPriorityList();
                renderRecommendationResults();
            }
        });
        tab.dataset.bound = 'true';
    });
}

function setupRecommendationControls() {
    const select = document.getElementById('recommendation-stat-select');
    const toggle = document.getElementById('recommendation-stat-toggle');
    const search = document.getElementById('recommendation-stat-search');
    const options = document.getElementById('recommendation-stat-options');
    const recommendBtn = document.getElementById('recommend-builds-btn');
    const twoZoneFilter = document.getElementById('recommend-two-zone-filter');
    const autoWeight = document.getElementById('recommendation-auto-weight');
    const passivePicker = document.getElementById('recommendation-passive-picker');
    const filterToggle = document.getElementById('recommendation-filter-toggle');
    const recommendationControls = document.querySelector('.recommendation-controls');
    const creditMinInput = document.getElementById('recommendation-credit-min');
    const creditMaxInput = document.getElementById('recommendation-credit-max');

    if (!select || !toggle || !search || !options) return;

    const renderOptions = () => renderRecommendationStatOptions(options, search.value);
    renderOptions();

    if (filterToggle && recommendationControls) {
        const syncCollapsedState = () => {
            const collapsed = recommendationFiltersCollapsedByType[activeBuildType];
            recommendationControls.classList.toggle('collapsed', collapsed);
            filterToggle.setAttribute('aria-expanded', String(!collapsed));
            filterToggle.querySelector('span').textContent = t(collapsed ? 'showRecommendationFilters' : 'hideRecommendationFilters');
            const icon = filterToggle.querySelector('.recommendation-filter-toggle-icon');
            if (icon) icon.textContent = collapsed ? '▾' : '▴';
        };
        syncCollapsedState();
        if (filterToggle.dataset.bound !== 'true') {
            filterToggle.addEventListener('click', () => {
                recommendationFiltersCollapsedByType[activeBuildType] = !recommendationFiltersCollapsedByType[activeBuildType];
                syncCollapsedState();
            });
            filterToggle.dataset.bound = 'true';
        }
    }

    [[creditMinInput, 'min'], [creditMaxInput, 'max']].forEach(([input, bound]) => {
        if (!input) return;
        input.value = bound === 'min' ? recommendationCreditMin : recommendationCreditMax;
        if (input.dataset.bound === 'true') return;
        input.addEventListener('input', () => {
            if (bound === 'min') recommendationCreditMin = input.value;
            else recommendationCreditMax = input.value;
            recommendationResults = [];
            renderRecommendationResults();
        });
        input.dataset.bound = 'true';
    });

    if (toggle.dataset.bound !== 'true') {
        toggle.addEventListener('click', () => {
            closeCompactSelects(select);
            select.classList.toggle('open');
            if (select.classList.contains('open')) {
                search.focus();
                search.select();
            }
        });
        toggle.dataset.bound = 'true';
    }

    if (search.dataset.recommendationBound !== 'true') {
        search.addEventListener('input', renderOptions);
        setupSearchClearButton(search);
        search.dataset.recommendationBound = 'true';
    }

    if (recommendBtn && recommendBtn.dataset.bound !== 'true') {
        recommendBtn.addEventListener('click', recommendBuilds);
        recommendBtn.dataset.bound = 'true';
    }

    if (twoZoneFilter) {
        twoZoneFilter.checked = recommendationOnlyTwoZones;
        if (twoZoneFilter.dataset.bound !== 'true') {
            twoZoneFilter.addEventListener('change', () => {
                recommendationOnlyTwoZones = twoZoneFilter.checked;
                recommendationResults = [];
                renderRecommendationResults();
            });
            twoZoneFilter.dataset.bound = 'true';
        }
    }

    if (autoWeight) {
        autoWeight.checked = recommendationAutomaticWeights;
        if (autoWeight.dataset.bound !== 'true') {
            autoWeight.addEventListener('change', () => {
                recommendationAutomaticWeights = autoWeight.checked;
                if (recommendationAutomaticWeights) applyAutomaticRecommendationWeights();
                recommendationResults = [];
                renderRecommendationPriorityList();
                renderRecommendationResults();
            });
            autoWeight.dataset.bound = 'true';
        }
    }

    if (passivePicker) {
        renderPassiveSkillPicker(passivePicker, recommendationPassiveSkills, {
            prefix: 'recommendation-passive-skill',
            labelKey: 'requiredPassiveSkills',
            addLabelKey: 'requirePassiveSkill',
            labelBeforePills: true,
            showReset: false,
            onChange: () => {
                recommendationResults = [];
                renderRecommendationResults();
            }
        });
    }
}

function renderRecommendationStatOptions(container, term = '') {
    const selected = new Set(recommendationPriorities);
    const statOptions = getSelectableStats().filter(stat => {
        return !selected.has(stat.id) &&
            matchesSearchTerm(term, stat.id, stat.name.en, stat.name.ko);
    });

    container.innerHTML = '';
    statOptions.forEach(stat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'compact-option';
        btn.innerHTML = `<span class="stat-option-check"></span><span>${stat.name[currentLanguage]}</span>`;
        btn.addEventListener('click', () => {
            recommendationPriorities.push(stat.id);
            recommendationWeights[stat.id] = 1;
            if (recommendationAutomaticWeights) applyAutomaticRecommendationWeights();
            if (!recommendationConstraints[stat.id]) recommendationConstraints[stat.id] = { min: '', max: '' };
            recommendationResults = [];
            renderRecommendationPriorityList();
            renderRecommendationResults();
            renderRecommendationStatOptions(container, '');
            const search = document.getElementById('recommendation-stat-search');
            if (search) {
                search.value = '';
                search.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        container.appendChild(btn);
    });

    if (statOptions.length === 0) {
        container.innerHTML = `<div class="recommendation-empty-option">${currentLanguage === 'ko' ? '추가할 스탯 없음' : 'No stats available'}</div>`;
    }
}

function renderRecommendationPriorityList() {
    const container = document.getElementById('recommendation-priority-list');
    if (!container) return;

    if (recommendationPriorities.length === 0) {
        container.innerHTML = `<p class="empty-msg">${t('recommendationSelectCharacter')}</p>`;
        return;
    }

    if (recommendationAutomaticWeights) applyAutomaticRecommendationWeights();
    const statById = new Map(getSelectableStats().map(stat => [stat.id, stat]));
    container.innerHTML = recommendationPriorities.map((statId, index) => {
        const stat = statById.get(statId) || { id: statId, name: getStatName(statId) };
        const constraints = recommendationConstraints[statId] || { min: '', max: '' };
        const weight = getRecommendationWeight(statId);
        return `
            <div class="recommendation-priority-row" data-stat="${statId}">
                <div class="priority-name">${stat.name[currentLanguage]}</div>
                <label class="priority-weight-field">
                    <span>${t('weightLabel')}</span>
                    <input type="number" class="priority-weight-input" value="${weight}" min="0" max="1" step="0.01" inputmode="decimal" placeholder="${t('weightLabel')}" ${recommendationAutomaticWeights ? 'disabled' : ''} aria-label="${escapeAttribute(`${stat.name[currentLanguage]} ${t('weightLabel')}`)}">
                </label>
                <input type="number" class="priority-bound-input" data-bound="min" value="${constraints.min}" placeholder="${t('minLabel')}" step="any">
                <input type="number" class="priority-bound-input" data-bound="max" value="${constraints.max}" placeholder="${t('maxLabel')}" step="any">
                <button type="button" class="priority-order-btn" data-action="up" ${index === 0 ? 'disabled' : ''} aria-label="Move ${escapeAttribute(stat.name[currentLanguage])} up">↑</button>
                <button type="button" class="priority-order-btn" data-action="down" ${index === recommendationPriorities.length - 1 ? 'disabled' : ''} aria-label="Move ${escapeAttribute(stat.name[currentLanguage])} down">↓</button>
                <button type="button" class="priority-remove-btn" data-action="remove" aria-label="${escapeAttribute(`Remove ${stat.name[currentLanguage]}`)}">×</button>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.priority-weight-input').forEach(input => {
        input.addEventListener('input', () => {
            const statId = input.closest('.recommendation-priority-row').dataset.stat;
            recommendationWeights[statId] = normalizeRecommendationWeight(input.value);
            recommendationResults = [];
            renderRecommendationResults();
        });
        input.addEventListener('change', () => {
            const statId = input.closest('.recommendation-priority-row').dataset.stat;
            const weight = normalizeRecommendationWeight(input.value);
            recommendationWeights[statId] = weight;
            input.value = String(weight);
        });
    });

    container.querySelectorAll('.priority-bound-input').forEach(input => {
        input.addEventListener('input', () => {
            const statId = input.closest('.recommendation-priority-row').dataset.stat;
            const bound = input.dataset.bound;
            if (!recommendationConstraints[statId]) recommendationConstraints[statId] = { min: '', max: '' };
            recommendationConstraints[statId][bound] = input.value;
            recommendationResults = [];
            renderRecommendationResults();
        });
    });

    container.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const row = btn.closest('.recommendation-priority-row');
            const statId = row.dataset.stat;
            const index = recommendationPriorities.indexOf(statId);
            if (btn.dataset.action === 'remove') {
                recommendationPriorities.splice(index, 1);
                delete recommendationWeights[statId];
                delete recommendationConstraints[statId];
            } else if (btn.dataset.action === 'up' && index > 0) {
                [recommendationPriorities[index - 1], recommendationPriorities[index]] =
                    [recommendationPriorities[index], recommendationPriorities[index - 1]];
            } else if (btn.dataset.action === 'down' && index < recommendationPriorities.length - 1) {
                [recommendationPriorities[index + 1], recommendationPriorities[index]] =
                    [recommendationPriorities[index], recommendationPriorities[index + 1]];
            }
            if (recommendationAutomaticWeights) applyAutomaticRecommendationWeights();

            recommendationResults = [];
            renderRecommendationPriorityList();
            setupRecommendationControls();
            renderRecommendationResults();
        });
    });
}

function getRecommendationMessage(message) {
    return `<p class="empty-msg">${message}</p>`;
}

function recommendBuilds() {
    if (!currentCharacter) {
        renderRecommendationMessage(t('recommendationNeedCharacter'));
        return;
    }
    if (!hasRecommendationCriteria()) {
        renderRecommendationMessage(t('recommendationNeedStats'));
        return;
    }

    const results = generateRecommendedBuilds(activeBuildType);
    recommendationResults = results;
    if (results.length === 0) {
        renderRecommendationMessage(t('recommendationNoBuilds'));
    } else {
        renderRecommendationResults();
    }
}

function renderRecommendationMessage(message) {
    const container = document.getElementById('recommendation-results');
    if (container) container.innerHTML = getRecommendationMessage(message);
}

function renderRecommendationResults() {
    const container = document.getElementById('recommendation-results');
    if (!container) return;

    if (recommendationResults.length === 0) {
        container.innerHTML = getRecommendationMessage(t('recommendationSelectCharacter'));
        return;
    }

    const statById = new Map(getSelectableStats().map(stat => [stat.id, stat]));
    container.innerHTML = recommendationResults.map((result, index) => {
        const itemIcons = result.items.map(name => {
            const gradeStyle = getItemGradeStyle(items[name] && items[name].type);
            return `
            <div class="recommendation-item-icon" data-item="${escapeAttribute(name)}" title="${escapeAttribute(getItemName(name))}" style="--recommendation-item-start:${gradeStyle.cardStart};--recommendation-item-end:${gradeStyle.cardEnd}">
                <img src="${escapeAttribute(getItemImagePath(name))}" alt="${escapeAttribute(getItemName(name))}" data-item-image="${escapeAttribute(name)}" loading="lazy" decoding="async">
            </div>`;
        }).join('');

        const statHighlights = recommendationPriorities.map(statId => {
            const stat = statById.get(statId) || { id: statId, name: getStatName(statId) };
            return `<span class="recommendation-stat-chip">${stat.name[currentLanguage]} ${formatRecommendationStatValue(statId, result.stats[statId] || 0)}</span>`;
        }).join('');
        const creditCost = result.credit ?? getBuildCreditCost(result.items);

        return `
            <article class="recommendation-card ${result.applied ? 'selected' : ''}" data-index="${index}">
                <div class="recommendation-card-head">
                    <strong>${t(hasPositiveRecommendationWeight() ? 'recommendationScore' : 'recommendationMatch')} ${Math.round(result.score * 100)}%</strong>
                    <span class="recommendation-card-meta">${result.weaponType ? `${getWeaponTypeName(result.weaponType)} · ` : ''}${creditCost} ${t('credits')}</span>
                </div>
                <div class="recommendation-item-row">${itemIcons}</div>
                <div class="recommendation-stat-row">${statHighlights}</div>
                <div class="recommendation-card-actions">
                    <button type="button" class="recommendation-apply-btn" data-recommendation-apply="${index}">${t('applyRecommendation')}</button>
                </div>
            </article>
        `;
    }).join('');

    container.querySelectorAll('[data-recommendation-apply]').forEach(button => {
        button.addEventListener('click', () => applyRecommendedBuild(Number(button.dataset.recommendationApply)));
    });
    applyItemImageFallbacks(container);

    container.querySelectorAll('.recommendation-item-icon[data-item]').forEach(icon => {
        applyMythicWeaponVariantIndicator(icon, icon.dataset.item);
        icon.addEventListener('mouseenter', (e) => {
            showGlobalTooltip(icon.dataset.item, icon);
            moveGlobalTooltip(e);
        });
        icon.addEventListener('mousemove', moveGlobalTooltip);
        icon.addEventListener('mouseleave', hideGlobalTooltip);
    });
}

function generateRecommendedBuilds(buildType = activeBuildType) {
    const startedAt = Date.now();
    const candidateSlots = getRecommendationCandidatesBySlot(buildType);
    const requiredSlots = EQUIPMENT_SLOTS;
    const allowPartialBuilds = buildType === BUILD_TYPES.LATE && hasActiveRecommendationCreditLimit();
    const candidateCombinationCount = requiredSlots.reduce((count, slot) => {
        const candidateCount = (candidateSlots[slot] && candidateSlots[slot].length) || 0;
        return count * (candidateCount + (allowPartialBuilds ? 1 : 0));
    }, 1);
    const metrics = {
        algorithm: 'branch-and-bound',
        exact: true,
        candidateCombinationCount,
        visitedNodes: 0,
        completedBuilds: 0,
        prunedByScore: 0,
        prunedByConstraints: 0,
        prunedByCredits: 0,
        prunedByPassives: 0,
        prunedByRoute: 0,
        elapsedMs: 0,
        resultCount: 0
    };

    if (!allowPartialBuilds && requiredSlots.some(slot => !candidateSlots[slot] || candidateSlots[slot].length === 0)) {
        metrics.elapsedMs = Date.now() - startedAt;
        lastRecommendationSearchMetrics = metrics;
        return [];
    }

    const model = createRecommendationSearchModel(candidateSlots, allowPartialBuilds);
    const topResults = [];
    const selectedBySlot = {};
    const passiveCounts = new Map();
    const state = {
        additive: new Array(recommendationPriorities.length).fill(0),
        uniquePrimary: new Array(recommendationPriorities.length).fill(0),
        uniqueSecondary: new Array(recommendationPriorities.length).fill(0),
        credit: 0
    };
    const previousPrimary = model.searchSlots.map(() => new Array(recommendationPriorities.length).fill(0));
    const previousSecondary = model.searchSlots.map(() => new Array(recommendationPriorities.length).fill(0));

    function visit(depth) {
        metrics.visitedNodes++;
        const bounds = getRecommendationSearchBounds(model, state, depth);

        if (!bounds.constraintsFeasible) {
            metrics.prunedByConstraints++;
            return;
        }
        if (!bounds.creditFeasible) {
            metrics.prunedByCredits++;
            return;
        }
        if (!recommendationPassivesRemainFeasible(model, passiveCounts, depth)) {
            metrics.prunedByPassives++;
            return;
        }
        if (topResults.length === RECOMMENDATION_RESULT_LIMIT &&
            bounds.upperScore <= topResults[topResults.length - 1].score + 1e-12) {
            metrics.prunedByScore++;
            return;
        }

        if (depth === model.searchSlots.length) {
            metrics.completedBuilds++;
            const itemNames = EQUIPMENT_SLOTS.map(slot => selectedBySlot[slot]).filter(Boolean);
            if (itemNames.length === 0 || !passesRecommendationCreditLimit(state.credit)) return;
            const stats = calculateItemOnlyBuildStats(itemNames);
            if (!passesRecommendationConstraints(stats) || !passesRecommendationPassiveRequirements(itemNames)) return;
            if (buildType === BUILD_TYPES.EARLY && recommendationOnlyTwoZones &&
                !hasFeasibleRouteWithinZones(itemNames, 2)) {
                metrics.prunedByRoute++;
                return;
            }

            const weaponName = selectedBySlot.Weapon;
            insertRecommendedBuild(topResults, {
                items: itemNames,
                stats,
                passives: getEffectivePassiveSkills(itemNames),
                credit: state.credit,
                weaponType: items[weaponName] ? items[weaponName].weaponType : '',
                score: hasPositiveRecommendationWeight()
                    ? scoreStatsForRecommendation(stats, model.normalizers)
                    : 1
            });
            return;
        }

        const slot = model.searchSlots[depth];
        model.candidatesBySlot[slot].forEach(candidate => {
            if (candidate.name) selectedBySlot[slot] = candidate.name;
            else delete selectedBySlot[slot];
            candidate.passiveNames.forEach(passiveName => {
                passiveCounts.set(passiveName, (passiveCounts.get(passiveName) || 0) + 1);
            });
            state.credit += candidate.credit;

            candidate.parts.forEach((part, index) => {
                previousPrimary[depth][index] = state.uniquePrimary[index];
                previousSecondary[depth][index] = state.uniqueSecondary[index];
                state.additive[index] += part.additive;
                state.uniquePrimary[index] = Math.max(state.uniquePrimary[index], part.uniquePrimary);
                state.uniqueSecondary[index] = Math.max(state.uniqueSecondary[index], part.uniqueSecondary);
            });
            visit(depth + 1);

            candidate.parts.forEach((part, index) => {
                state.additive[index] -= part.additive;
                state.uniquePrimary[index] = previousPrimary[depth][index];
                state.uniqueSecondary[index] = previousSecondary[depth][index];
            });
            state.credit -= candidate.credit;
            candidate.passiveNames.forEach(passiveName => {
                const nextCount = passiveCounts.get(passiveName) - 1;
                if (nextCount > 0) passiveCounts.set(passiveName, nextCount);
                else passiveCounts.delete(passiveName);
            });
            delete selectedBySlot[slot];
        });
    }

    visit(0);
    metrics.elapsedMs = Date.now() - startedAt;
    metrics.resultCount = topResults.length;
    lastRecommendationSearchMetrics = metrics;
    return topResults;
}

function getItemRecommendationStatParts(itemName, statId, level = charLevel) {
    const item = items[itemName] || {};
    const regularStats = item.stats || {};
    const levelStats = item.statsByLv || {};
    const uniqueStats = item.uniqueStats || {};

    if (statId === 'moveSpeed') {
        return {
            additive: (Number(regularStats.moveSpeed) || 0) + (Number(levelStats.moveSpeed) || 0) * level +
                ((Number(regularStats.moveSpeedRatio) || 0) + (Number(levelStats.moveSpeedRatio) || 0) * level) * 10,
            uniquePrimary: Number(uniqueStats.moveSpeed) || 0,
            uniqueSecondary: (Number(uniqueStats.moveSpeedRatio) || 0) * 10
        };
    }

    return {
        additive: (Number(regularStats[statId]) || 0) + (Number(levelStats[statId]) || 0) * level,
        uniquePrimary: Number(uniqueStats[statId]) || 0,
        uniqueSecondary: 0
    };
}

function createRecommendationSearchModel(candidateSlots, allowPartialBuilds = false) {
    const searchSlots = [...EQUIPMENT_SLOTS].sort((a, b) => {
        const countDifference = candidateSlots[a].length - candidateSlots[b].length;
        return countDifference || BUILD_SLOT_ORDER[a] - BUILD_SLOT_ORDER[b];
    });
    const candidatesBySlot = {};

    searchSlots.forEach(slot => {
        const candidateNames = allowPartialBuilds ? [...candidateSlots[slot], null] : candidateSlots[slot];
        candidatesBySlot[slot] = candidateNames.map(name => {
            return {
                name,
                passiveNames: getItemPassiveSkills(items[name]).map(passiveSkill => passiveSkill.name),
                credit: name ? getItemCreditCost(name) : 0,
                parts: recommendationPriorities.map(statId => getItemRecommendationStatParts(name, statId))
            };
        });
    });

    const priorityCount = recommendationPriorities.length;
    const suffixAdditive = Array.from({ length: searchSlots.length + 1 }, () => new Array(priorityCount).fill(0));
    const suffixMinimumAdditive = Array.from({ length: searchSlots.length + 1 }, () => new Array(priorityCount).fill(0));
    const suffixUniquePrimary = Array.from({ length: searchSlots.length + 1 }, () => new Array(priorityCount).fill(0));
    const suffixUniqueSecondary = Array.from({ length: searchSlots.length + 1 }, () => new Array(priorityCount).fill(0));
    const suffixPassives = Array.from({ length: searchSlots.length + 1 }, () => new Set());
    const suffixMaximumCredit = new Array(searchSlots.length + 1).fill(0);

    for (let depth = searchSlots.length - 1; depth >= 0; depth--) {
        const candidates = candidatesBySlot[searchSlots[depth]];
        for (let index = 0; index < priorityCount; index++) {
            suffixAdditive[depth][index] = suffixAdditive[depth + 1][index] +
                Math.max(...candidates.map(candidate => candidate.parts[index].additive), 0);
            suffixMinimumAdditive[depth][index] = suffixMinimumAdditive[depth + 1][index] +
                Math.min(...candidates.map(candidate => candidate.parts[index].additive), 0);
            suffixUniquePrimary[depth][index] = Math.max(
                suffixUniquePrimary[depth + 1][index],
                ...candidates.map(candidate => candidate.parts[index].uniquePrimary),
                0
            );
            suffixUniqueSecondary[depth][index] = Math.max(
                suffixUniqueSecondary[depth + 1][index],
                ...candidates.map(candidate => candidate.parts[index].uniqueSecondary),
                0
            );
        }
        suffixPassives[depth] = new Set(suffixPassives[depth + 1]);
        candidates.forEach(candidate => {
            candidate.passiveNames.forEach(passiveName => suffixPassives[depth].add(passiveName));
        });
        suffixMaximumCredit[depth] = suffixMaximumCredit[depth + 1] +
            Math.max(...candidates.map(candidate => candidate.credit), 0);
    }

    const normalizers = {};
    recommendationPriorities.forEach((statId, index) => {
        normalizers[statId] = Math.max(
            suffixAdditive[0][index] + suffixUniquePrimary[0][index] + suffixUniqueSecondary[0][index],
            0.0001
        );
    });

    searchSlots.forEach(slot => {
        candidatesBySlot[slot].forEach(candidate => {
            const stats = {};
            recommendationPriorities.forEach((statId, index) => {
                stats[statId] = candidate.parts[index].additive + candidate.parts[index].uniquePrimary +
                    candidate.parts[index].uniqueSecondary;
            });
            candidate.searchScore = scoreStatsForRecommendation(stats, normalizers) +
                (itemHasSelectedRecommendationPassive(candidate.name) ? 1 : 0);
        });
        candidatesBySlot[slot].sort((a, b) => b.searchScore - a.searchScore ||
            (a.name || '').localeCompare(b.name || ''));
    });

    return {
        searchSlots,
        candidatesBySlot,
        suffixAdditive,
        suffixMinimumAdditive,
        suffixUniquePrimary,
        suffixUniqueSecondary,
        suffixPassives,
        suffixMaximumCredit,
        normalizers
    };
}

function getRecommendationSearchBounds(model, state, depth) {
    const upperValues = new Array(recommendationPriorities.length).fill(0);
    let constraintsFeasible = true;

    recommendationPriorities.forEach((statId, index) => {
        const upperValue = state.additive[index] + model.suffixAdditive[depth][index] +
            Math.max(state.uniquePrimary[index], model.suffixUniquePrimary[depth][index]) +
            Math.max(state.uniqueSecondary[index], model.suffixUniqueSecondary[depth][index]);
        const lowerValue = state.additive[index] + model.suffixMinimumAdditive[depth][index] +
            state.uniquePrimary[index] + state.uniqueSecondary[index];
        upperValues[index] = upperValue;

        const constraint = recommendationConstraints[statId] || {};
        const min = parseRecommendationBound(statId, constraint.min);
        const max = parseRecommendationBound(statId, constraint.max);
        if ((min !== null && upperValue < min) || (max !== null && lowerValue > max)) {
            constraintsFeasible = false;
        }
    });

    const upperStats = {};
    recommendationPriorities.forEach((statId, index) => upperStats[statId] = upperValues[index]);
    const creditBounds = getRecommendationCreditBounds();
    const creditFeasible = (creditBounds.max === null || state.credit <= creditBounds.max) &&
        (creditBounds.min === null || state.credit + model.suffixMaximumCredit[depth] >= creditBounds.min);
    return {
        constraintsFeasible,
        creditFeasible,
        upperScore: hasPositiveRecommendationWeight()
            ? scoreStatsForRecommendation(upperStats, model.normalizers)
            : 1
    };
}

function recommendationPassivesRemainFeasible(model, passiveCounts, depth) {
    return Array.from(recommendationPassiveSkills).every(passiveName => {
        return passiveCounts.has(passiveName) || model.suffixPassives[depth].has(passiveName);
    });
}

function insertRecommendedBuild(results, build) {
    results.push(build);
    results.sort((a, b) => {
        const scoreDifference = b.score - a.score;
        if (Math.abs(scoreDifference) > 1e-12) return scoreDifference;
        return a.items.join('\u0000').localeCompare(b.items.join('\u0000'));
    });
    if (results.length > RECOMMENDATION_RESULT_LIMIT) results.pop();
}

function getRecommendationCandidatesBySlot(buildType = activeBuildType) {
    const slots = Object.fromEntries(EQUIPMENT_SLOTS.map(slot => [slot, []]));
    const masteries = currentCharacter && chars[currentCharacter] ? chars[currentCharacter].masteries : [];

    Object.entries(items).forEach(([name, item]) => {
        if (!isItemEligibleForBuild(item, buildType)) return;
        if (buildType === BUILD_TYPES.LATE && !lateRarityFilters.has(item.type)) return;
        if (buildType === BUILD_TYPES.LATE && !itemMatchesLateResourceFilters(name, item)) return;
        if (item.part === "Weapon") {
            if (!masteries.includes(item.weaponType)) return;
            if (currentWeaponFilter !== "All" && item.weaponType !== currentWeaponFilter) return;
        }
        if (!isItemCompatibleWithCharacter(name, currentCharacter)) return;
        slots[item.part].push(name);
    });

    return slots;
}

function itemHasSelectedRecommendationPassive(itemName) {
    if (recommendationPassiveSkills.size === 0) return false;
    return getItemPassiveSkills(items[itemName])
        .some(passiveSkill => recommendationPassiveSkills.has(passiveSkill.name));
}

function passesRecommendationPassiveRequirements(itemNames) {
    if (recommendationPassiveSkills.size === 0) return true;
    const effectivePassives = new Set(getEffectivePassiveSkills(itemNames).map(passive => passive.name));
    return Array.from(recommendationPassiveSkills).every(passiveName => effectivePassives.has(passiveName));
}

function hasFeasibleRouteWithinZones(itemNames, maxZones) {
    if (itemNames.some(name => !isItemEligibleForBuild(items[name], BUILD_TYPES.EARLY))) return false;

    const cacheKey = `${maxZones}|${[...itemNames].sort().join('|')}`;
    if (recommendationRouteCache.has(cacheKey)) return recommendationRouteCache.get(cacheKey);

    const neededCounts = {};
    const uniqueItemsToIgnore = new Set([
        "Alpha Sidewinder",
        "Black Mamba King",
        "Deathadder Queen",
        "Harmony in Full Bloom"
    ]);

    itemNames.forEach(itemName => {
        if (!uniqueItemsToIgnore.has(itemName) && items[itemName] && items[itemName].components) {
            items[itemName].components.forEach(mat => {
                neededCounts[mat] = (neededCounts[mat] || 0) + 1;
            });
        }
    });

    const ownedCounts = { "Shirt": 1, "Running Shoes": 1 };
    itemNames.forEach(itemName => {
        const itemData = items[itemName];
        if (itemData && itemData.part === "Weapon" && itemData.components) {
            itemData.components.forEach(comp => {
                if (BASE_WEAPONS.has(comp)) ownedCounts[comp] = 1;
            });
        }
    });

    const requiredMaterials = new Set();
    Object.entries(neededCounts).forEach(([itemName, count]) => {
        const owned = ownedCounts[itemName] || 0;
        if (count - owned > 0) requiredMaterials.add(itemName);
    });

    if (requiredMaterials.size === 0) {
        recommendationRouteCache.set(cacheKey, true);
        return true;
    }

    const materialList = Array.from(requiredMaterials);
    const fullMask = (1n << BigInt(materialList.length)) - 1n;
    const validZones = [];

    Object.keys(mapData).forEach(zone => {
        let mask = 0n;
        materialList.forEach((mat, idx) => {
            if (items[mat] && items[mat].locations && items[mat].locations.includes(zone)) {
                mask |= (1n << BigInt(idx));
            }
        });
        if (mask > 0n) validZones.push({ id: zone, mask, itemCount: countSetBits(mask) });
    });

    validZones.sort((a, b) => b.itemCount - a.itemCount);

    const suffixUnions = new Array(validZones.length).fill(0n);
    let currentSuffix = 0n;
    for (let i = validZones.length - 1; i >= 0; i--) {
        currentSuffix |= validZones[i].mask;
        suffixUnions[i] = currentSuffix;
    }

    function search(index, currentMask, zoneCount) {
        const missingMask = fullMask ^ currentMask;
        const missingCount = countSetBits(missingMask);
        if (getRouteTier(zoneCount, missingCount) > 0 && zoneCount <= maxZones) return true;
        if (zoneCount >= maxZones) return false;

        if (index < validZones.length) {
            const potentialTotal = currentMask | suffixUnions[index];
            const potentialMissing = countSetBits(fullMask ^ potentialTotal);
            let allowedDrones = 2;
            if (zoneCount === 1) allowedDrones = 1;
            if (zoneCount >= 2) allowedDrones = 0;
            if (potentialMissing > allowedDrones) return false;
        }

        for (let i = index; i < validZones.length; i++) {
            const nextZone = validZones[i];
            const nextMask = currentMask | nextZone.mask;
            if (nextMask === currentMask) continue;
            if (search(i + 1, nextMask, zoneCount + 1)) return true;
        }
        return false;
    }

    const result = search(0, 0n, 0);
    recommendationRouteCache.set(cacheKey, result);
    return result;
}

function normalizeRecommendationWeight(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0;
    return Math.min(1, Math.max(0, parsed));
}

function getAutomaticRecommendationWeight(index) {
    return Number(Math.pow(0.68, index).toFixed(4));
}

function applyAutomaticRecommendationWeights() {
    recommendationPriorities.forEach((statId, index) => {
        recommendationWeights[statId] = getAutomaticRecommendationWeight(index);
    });
}

function getRecommendationWeight(statId) {
    if (!Object.prototype.hasOwnProperty.call(recommendationWeights, statId)) {
        const index = recommendationPriorities.indexOf(statId);
        return recommendationAutomaticWeights && index >= 0 ? getAutomaticRecommendationWeight(index) : 1;
    }
    return normalizeRecommendationWeight(recommendationWeights[statId]);
}

function hasPositiveRecommendationWeight() {
    return recommendationPriorities.some(statId => getRecommendationWeight(statId) > 0);
}

function parseCreditBound(value) {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
}

function getRecommendationCreditBounds() {
    return {
        min: parseCreditBound(recommendationCreditMin),
        max: parseCreditBound(recommendationCreditMax)
    };
}

function hasActiveRecommendationCreditLimit() {
    const bounds = getRecommendationCreditBounds();
    return bounds.min !== null || bounds.max !== null;
}

function passesRecommendationCreditLimit(credit) {
    const bounds = getRecommendationCreditBounds();
    return (bounds.min === null || credit >= bounds.min) &&
        (bounds.max === null || credit <= bounds.max);
}

function hasRecommendationCriteria() {
    if (recommendationPassiveSkills.size > 0 || hasPositiveRecommendationWeight()) return true;
    return recommendationPriorities.some(statId => {
        const constraint = recommendationConstraints[statId] || {};
        return parseRecommendationBound(statId, constraint.min) !== null ||
            parseRecommendationBound(statId, constraint.max) !== null;
    });
}

function scoreStatsForRecommendation(stats, normalizers) {
    let weightedScore = 0;
    let totalWeight = 0;
    recommendationPriorities.forEach(statId => {
        const weight = getRecommendationWeight(statId);
        weightedScore += weight * (getNumericRecommendationStat(stats, statId) / (normalizers[statId] || 1));
        totalWeight += weight;
    });
    return totalWeight > 0 ? weightedScore / totalWeight : 0;
}

function parseRecommendationBound(statId, value) {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return null;
    return isPercentStat(statId) && Math.abs(parsed) > 1 ? parsed / 100 : parsed;
}

function passesRecommendationConstraints(stats) {
    return recommendationPriorities.every(statId => {
        const constraints = recommendationConstraints[statId] || {};
        const value = getNumericRecommendationStat(stats, statId);
        const min = parseRecommendationBound(statId, constraints.min);
        const max = parseRecommendationBound(statId, constraints.max);
        if (min !== null && value < min) return false;
        if (max !== null && value > max) return false;
        return true;
    });
}

function calculateItemOnlyBuildStats(itemNames, level = charLevel) {
    const totalStats = {};
    DISPLAY_STATS.forEach(s => totalStats[s.id] = 0);
    totalStats.moveSpeedRatio = 0;
    const uniqueMaxStats = {};

    itemNames.forEach(name => {
        const itemObj = items[name];
        if (!itemObj) return;
        Object.keys(itemObj.stats || {}).forEach(key => {
            if (totalStats[key] === undefined) totalStats[key] = 0;
            totalStats[key] += itemObj.stats[key];
        });
        Object.keys(itemObj.uniqueStats || {}).forEach(key => {
            uniqueMaxStats[key] = Math.max(uniqueMaxStats[key] || 0, itemObj.uniqueStats[key]);
            if (totalStats[key] === undefined) totalStats[key] = 0;
        });
        Object.keys(itemObj.statsByLv || {}).forEach(key => {
            if (totalStats[key] === undefined) totalStats[key] = 0;
            totalStats[key] += itemObj.statsByLv[key] * level;
        });
    });

    Object.keys(uniqueMaxStats).forEach(key => {
        totalStats[key] += uniqueMaxStats[key];
    });

    const flatMoveSpeed = totalStats.moveSpeed || 0;
    const pctMoveSpeed = totalStats.moveSpeedRatio || 0;
    totalStats.moveSpeed = {
        flat: flatMoveSpeed,
        percent: pctMoveSpeed,
        valueOf: function() { return this.flat + (this.percent * 10); },
        toString: function() { return formatMovementSpeedValue(this.flat, this.percent); }
    };

    return totalStats;
}

function getNumericRecommendationStat(stats, statId) {
    const value = stats[statId] || 0;
    if (typeof value === 'object') return value.valueOf();
    return Number(value) || 0;
}

function formatRecommendationStatValue(statId, value) {
    if (typeof value === 'object') return value.toString();
    return formatStatValue(statId, value);
}

function applyRecommendedBuild(index) {
    const result = recommendationResults[index];
    if (!result) return;

    const build = getBuild(activeBuildType);
    build.clear();
    result.items.forEach(name => addItemToBuild(name, activeBuildType));
    recommendationResults.forEach((entry, entryIndex) => {
        entry.applied = entryIndex === index;
    });
    if (activeBuildType === BUILD_TYPES.EARLY) {
        selectedRoutes = [];
        generatedRoutes = [];
    }

    updateMainGridVisuals();
    updateSelectedPanel();
    renderRecommendationResults();

    if (activeBuildType === BUILD_TYPES.EARLY) {
        const resultOutput = document.getElementById('result-output');
        if (resultOutput) resultOutput.innerHTML = `<p class="empty-msg">${t('recommendationApplied')}</p>`;
    }
}

function closeCompactSelects(except = null) {
    document.querySelectorAll('.compact-select.open').forEach(select => {
        if (select !== except) select.classList.remove('open');
    });
}

function setupSearchClearButton(input) {
    if (!input || input.dataset.clearable === 'true') return;

    const wrapper = document.createElement('div');
    wrapper.className = 'search-clear-wrap';
    if (input.classList.contains('compact-select-search')) {
        wrapper.classList.add('compact-search-clear-wrap');
    }

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'search-clear-btn';
    clearBtn.textContent = '×';
    clearBtn.setAttribute('aria-label', currentLanguage === 'ko' ? '검색어 지우기' : 'Clear search');
    wrapper.appendChild(clearBtn);

    const updateClearButton = () => {
        wrapper.classList.toggle('has-value', input.value.length > 0);
    };

    input.dataset.clearable = 'true';
    input.addEventListener('input', updateClearButton);
    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!input.value) return;
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
    });
    updateClearButton();
}

function getSortedCharacterNames() {
    return Object.keys(chars).sort((a, b) => {
        const nameA = getCharName(a);
        const nameB = getCharName(b);
        return nameA.localeCompare(nameB, currentLanguage);
    });
}

function renderCharacterPicker(container) {
    const selectedLabel = currentCharacter ? getCharName(currentCharacter) : t('selectCharacter');
    const avatarHtml = currentCharacter
        ? `<img class="compact-avatar" src="${escapeAttribute(getCharacterImagePath(currentCharacter))}" alt="${escapeAttribute(selectedLabel)}" loading="lazy" decoding="async" onerror="this.outerHTML='<span class=\\'compact-avatar placeholder\\'>?</span>'">`
        : `<img class="compact-avatar" src="images/ui/CharacterSelect.png" alt="${escapeAttribute(selectedLabel)}" loading="lazy" decoding="async" onerror="this.outerHTML='<span class=\\'compact-avatar placeholder\\'>?</span>'">`;

    container.innerHTML = `
        <div class="compact-select" id="character-select">
            <button type="button" class="compact-select-toggle" id="char-select-toggle">
                ${avatarHtml}
                <span>${selectedLabel}</span>
                <span class="compact-select-arrow">▾</span>
            </button>
            <div class="compact-select-menu">
                <input type="text" id="char-search" class="compact-select-search" data-i18n-placeholder="searchCharPlaceholder" placeholder="${t('searchCharPlaceholder')}" aria-label="${t('searchCharPlaceholder')}">
                <div id="char-options" class="compact-options"></div>
            </div>
        </div>
    `;

    const select = container.querySelector('#character-select');
    const toggle = container.querySelector('#char-select-toggle');
    const search = container.querySelector('#char-search');
    const options = container.querySelector('#char-options');

    const renderOptions = () => renderCharacterOptions(options, search.value);
    renderOptions();

    toggle.addEventListener('click', () => {
        closeCompactSelects(select);
        select.classList.toggle('open');
        if (select.classList.contains('open')) {
            search.focus();
            search.select();
        }
    });

    search.addEventListener('input', renderOptions);
    setupSearchClearButton(search);
}

function renderCharacterOptions(container, term = '') {
    const optionData = [
        { value: null, label: t('selectCharacter') },
        ...getSortedCharacterNames().map(name => ({ value: name, label: getCharName(name) }))
    ].filter(option => {
        if (!term.trim() || option.value === null) return true;
        return matchesSearchTerm(term, option.value, option.label, chars[option.value]?.nameKo);
    });

    container.innerHTML = '';
    optionData.forEach(option => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'compact-option' + (option.value === currentCharacter || (!option.value && !currentCharacter) ? ' active' : '');
        btn.dataset.char = option.value || '';

        if (option.value) {
            const img = document.createElement('img');
            img.className = 'compact-avatar';
            img.src = getCharacterImagePath(option.value);
            img.alt = option.label;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.onerror = function() {
                this.replaceWith(createCompactPlaceholder('?'));
            };
            btn.appendChild(img);
        } else {
            const img = document.createElement('img');
            img.className = 'compact-avatar';
            img.src = 'images/ui/CharacterSelect.png';
            img.alt = option.label;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.onerror = function() {
                this.replaceWith(createCompactPlaceholder('?'));
            };
            btn.appendChild(img);
        }

        const label = document.createElement('span');
        label.textContent = option.label;
        btn.appendChild(label);
        btn.addEventListener('click', () => selectCharacter(option.value));
        container.appendChild(btn);
    });
}

function createCompactPlaceholder(text) {
    const span = document.createElement('span');
    span.className = 'compact-avatar placeholder';
    span.textContent = text;
    return span;
}

function selectCharacter(charName) {
    const previousCharacter = currentCharacter;
    currentCharacter = charName || null;
    recommendationResults = [];
    if (previousCharacter !== currentCharacter) {
        lateComparisonBuilds[0] = null;
        lateComparisonBuilds[1] = null;
    }
    const masteries = currentCharacter ? chars[currentCharacter].masteries : null;
    const weaponBtns = document.querySelectorAll('#weapon-subfilters .weapon-btn[data-subfilter]');

    if (currentCharacter) {
        const buildChanges = Object.fromEntries(
            Object.values(BUILD_TYPES).map(buildType => [
                buildType,
                removeIncompatibleBuildItems(buildType, currentCharacter)
            ])
        );
        if (buildChanges[BUILD_TYPES.EARLY]) selectedRoutes = [];
        if (Object.values(buildChanges).some(Boolean)) updateSelectedPanel();
    }

    let currentWeaponStillValid = currentCharacter === null;
    weaponBtns.forEach(wb => {
        const wType = wb.dataset.subfilter;
        if (wType === "All") return;
        if (currentCharacter && !masteries.includes(wType)) {
            wb.classList.add('disabled');
        } else {
            wb.classList.remove('disabled');
            if (currentWeaponFilter === wType) currentWeaponStillValid = true;
        }
    });

    const charContainer = document.getElementById('character-selection');
    if (charContainer) renderCharacterPicker(charContainer);

    if (!currentWeaponStillValid && currentWeaponFilter !== "All") {
        const allBtn = document.querySelector('#weapon-subfilters .weapon-btn[data-subfilter="All"]');
        if (allBtn) allBtn.click();
    } else {
        renderMainGrid();
    }
    renderStatComparison();
    renderRecommendationResults();
    renderLateGamePanel();
}

function renderSubstatPicker(container) {
    const selectedStats = getSelectableStats().filter(s => activeSubstats.has(s.id));
    const pillsHtml = selectedStats.length
        ? selectedStats.map(s => `<span class="stat-pill" data-stat="${s.id}">${s.name[currentLanguage]} <button type="button" aria-label="Remove ${s.name[currentLanguage]}">×</button></span>`).join('')
        : '';
    const resetHtml = `<button type="button" class="stat-reset-btn" id="stat-reset-btn" ${activeSubstats.size ? '' : 'disabled'}>${t('resetStats')}</button>`;

    container.innerHTML = `
        <div id="substat-pills" class="stat-pills">${pillsHtml}</div>
        <div class="stat-picker-row">
        <div class="compact-select" id="stat-select">
            <button type="button" class="compact-select-toggle" id="stat-select-toggle">
                <span>${currentLanguage === 'ko' ? '스탯 추가' : 'Add stat'}</span>
                <span class="compact-select-arrow">▾</span>
            </button>
            <div class="compact-select-menu">
                <input type="text" id="stat-search" class="compact-select-search" data-i18n-placeholder="searchStatsPlaceholder" placeholder="${t('searchStatsPlaceholder')}" aria-label="${t('searchStatsPlaceholder')}">
                <div id="stat-options" class="compact-options"></div>
            </div>
        </div>
        ${resetHtml}
        </div>
    `;

    container.querySelectorAll('.stat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            activeSubstats.delete(pill.dataset.stat);
            renderSubstatPicker(container);
            renderMainGrid();
        });
    });

    const statToggleLabel = container.querySelector('#stat-select-toggle span:first-child');
    if (statToggleLabel) statToggleLabel.textContent = t('addStat');

    const resetBtn = container.querySelector('#stat-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activeSubstats.clear();
            renderSubstatPicker(container);
            renderMainGrid();
        });
    }

    const select = container.querySelector('#stat-select');
    const toggle = container.querySelector('#stat-select-toggle');
    const search = container.querySelector('#stat-search');
    if (search) search.setAttribute('placeholder', t('searchStatsPlaceholder'));
    const options = container.querySelector('#stat-options');
    const renderOptions = () => renderSubstatOptions(options, search.value, container);
    renderOptions();

    toggle.addEventListener('click', () => {
        closeCompactSelects(select);
        select.classList.toggle('open');
        if (select.classList.contains('open')) {
            search.focus();
            search.select();
        }
    });

    search.addEventListener('input', renderOptions);
    setupSearchClearButton(search);
}

function renderSubstatOptions(container, term = '', pickerContainer) {
    const statOptions = getSelectableStats().filter(stat => {
        return matchesSearchTerm(term, stat.id, stat.name.en, stat.name.ko);
    });

    container.innerHTML = '';
    statOptions.forEach(stat => {
        const isActive = activeSubstats.has(stat.id);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'compact-option' + (isActive ? ' active' : '');
        btn.innerHTML = `<span class="stat-option-check">${isActive ? '✓' : ''}</span><span>${stat.name[currentLanguage]}</span>`;
        btn.addEventListener('click', () => {
            if (isActive) activeSubstats.delete(stat.id);
            else activeSubstats.add(stat.id);
            renderSubstatPicker(pickerContainer);
            renderMainGrid();
        });
        container.appendChild(btn);
    });
}

function renderPassiveSkillPicker(container, selectedSet, {
    prefix,
    onChange,
    labelKey = '',
    addLabelKey = 'addPassiveSkill',
    labelBeforePills = false,
    showReset = true
}) {
    const selectedOptions = getPassiveSkillOptions().filter(option => selectedSet.has(option.id));
    const pillsHtml = selectedOptions.length
        ? selectedOptions.map(option => `<span class="stat-pill passive-skill-pill" data-passive="${escapeAttribute(option.id)}">${getPassiveSkillOptionName(option)} <button type="button" aria-label="Remove ${escapeAttribute(getPassiveSkillOptionName(option))}">×</button></span>`).join('')
        : '';
    const resetHtml = showReset
        ? `<button type="button" class="stat-reset-btn" id="${prefix}-reset" ${selectedSet.size ? '' : 'disabled'}>${t('resetStats')}</button>`
        : '';
    const pickerOptions = { prefix, onChange, labelKey, addLabelKey, labelBeforePills, showReset };
    const labelHtml = labelKey
        ? `<div class="recommendation-block-label">${t(labelKey)}</div>`
        : '';
    const pillsSection = `<div id="${prefix}-pills" class="stat-pills">${pillsHtml}</div>`;
    const pickerRow = `
        <div class="stat-picker-row">
            <div class="compact-select" id="${prefix}-select">
                <button type="button" class="compact-select-toggle" id="${prefix}-toggle">
                    <span>${t(addLabelKey)}</span>
                    <span class="compact-select-arrow">▾</span>
                </button>
                <div class="compact-select-menu">
                    <input type="text" id="${prefix}-search" class="compact-select-search" data-i18n-placeholder="searchPassiveSkillsPlaceholder" placeholder="${t('searchPassiveSkillsPlaceholder')}" aria-label="${t('searchPassiveSkillsPlaceholder')}">
                    <div id="${prefix}-options" class="compact-options"></div>
                </div>
            </div>
            ${resetHtml}
        </div>
    `;

    container.innerHTML = labelBeforePills
        ? `${labelHtml}${pickerRow}${pillsSection}`
        : `${pillsSection}${pickerRow}${labelHtml}`;

    const select = container.querySelector(`#${prefix}-select`);
    const toggle = container.querySelector(`#${prefix}-toggle`);
    const search = container.querySelector(`#${prefix}-search`);
    const options = container.querySelector(`#${prefix}-options`);
    const resetBtn = container.querySelector(`#${prefix}-reset`);

    const notifyChange = () => {
        if (typeof onChange === 'function') onChange();
    };

    const renderOptions = () => renderPassiveSkillOptions(options, search.value, selectedSet, () => {
        renderPassiveSkillPicker(container, selectedSet, pickerOptions);
        notifyChange();
    });

    renderOptions();
    setupSearchClearButton(search);

    toggle.addEventListener('click', () => {
        closeCompactSelects(select);
        select.classList.toggle('open');
        if (select.classList.contains('open')) {
            search.focus();
            search.select();
        }
    });

    search.addEventListener('input', renderOptions);

    container.querySelectorAll('.passive-skill-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            selectedSet.delete(pill.dataset.passive);
            renderPassiveSkillPicker(container, selectedSet, pickerOptions);
            notifyChange();
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (selectedSet.size === 0) return;
            selectedSet.clear();
            renderPassiveSkillPicker(container, selectedSet, pickerOptions);
            notifyChange();
        });
    }
}

function renderPassiveSkillOptions(container, term, selectedSet, onSelect) {
    const options = getPassiveSkillOptions().filter(option => {
        return !selectedSet.has(option.id) &&
            matchesSearchTerm(term, option.id, option.name, option.nameKo);
    });

    container.innerHTML = '';
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'compact-option';
        btn.innerHTML = `<span class="stat-option-check"></span><span>${getPassiveSkillOptionName(option)}</span>`;
        btn.addEventListener('click', () => {
            selectedSet.add(option.id);
            onSelect();
        });
        container.appendChild(btn);
    });

    if (options.length === 0) {
        container.innerHTML = `<div class="recommendation-empty-option">${currentLanguage === 'ko' ? '추가할 고유 장착 효과 없음' : 'No unique passives available'}</div>`;
    }
}

function renderMainGrid() {
    const grid = document.getElementById('item-grid');
    if (!grid) return;
    grid.innerHTML = ''; 

    const catalogItems = Object.entries(items).filter(([name, data]) => {
        if (!isItemEligibleForBuild(data, activeBuildType)) return false;
        if (activeBuildType === BUILD_TYPES.LATE && !lateRarityFilters.has(data.type)) return false;
        if (activeBuildType === BUILD_TYPES.LATE && !itemMatchesLateResourceFilters(name, data)) return false;
        
        // Item search filtering
        const itemSearchInput = document.getElementById('item-search');
        if (itemSearchInput && !matchesSearchTerm(itemSearchInput.value, name, data.nameKo)) {
            return false;
        }
        
        // Substat filtering (including level scaling)
        if (activeSubstats.size > 0) {
            if (!data.stats && !data.uniqueStats && !data.statsByLv) return false;
            for (let stat of activeSubstats) {
                if (getItemStatValue(data, stat) <= 0) return false;
            }
        }

        if (activePassiveSkills.size > 0) {
            if (!getItemPassiveSkills(data).some(passiveSkill => activePassiveSkills.has(passiveSkill.name))) return false;
        }

        // Character mastery and character-exclusive equipment filtering
        if (!isItemCompatibleWithCharacter(name, currentCharacter)) return false;

        // If currentFilter is "All", we only filter out other weapons
        if (currentFilter === "All") {
            if (data.part === "Weapon" && currentWeaponFilter !== "All" && data.weaponType !== currentWeaponFilter) {
                return false;
            }
            return true;
        }

        // If not "All", check part match
        if (data.part !== currentFilter) return false;

        // If part is Weapon, further filter by weaponType
        if (data.part === "Weapon") {
            if (currentWeaponFilter !== "All" && data.weaponType !== currentWeaponFilter) return false;
        }

        return true;
    });

    catalogItems.sort(compareCatalogItems);

    catalogItems.forEach(([name]) => {
        const card = createItemCard(name);
        grid.appendChild(card);
    });

    const count = document.getElementById('catalog-item-count');
    if (count) count.textContent = `${catalogItems.length} ${t('itemsShown')}`;
    if (catalogItems.length === 0) {
        grid.innerHTML = `<p class="empty-msg catalog-empty">${t('noMatchingItems')}</p>`;
    }
}

function createItemCard(name) {
    const item = items[name];
    const gradeStyle = getItemGradeStyle(item && item.type);
    const card = document.createElement('button');
    card.type = 'button';
    card.classList.add('item-card');
    card.dataset.name = name;
    card.dataset.grade = item ? item.type : '';
    card.style.setProperty('--item-card-start', gradeStyle.cardStart);
    card.style.setProperty('--item-card-end', gradeStyle.cardEnd);
    applyMythicWeaponVariantIndicator(card, name, item);
    const selected = getBuild().has(name);
    const typeName = TYPE_NAMES[item.type] ? TYPE_NAMES[item.type][currentLanguage] : item.type;
    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', String(selected));
    card.setAttribute('aria-label', `${t(selected ? 'removeItem' : 'addItem')}: ${getItemName(name)}, ${typeName}`);

    const img = document.createElement('img');
    img.src = getItemImagePath(name);
    img.alt = getItemName(name);
    img.classList.add('item-icon');
    
    applyItemImageFallback(img, name);

    card.appendChild(img);

    card.addEventListener('mouseenter', (e) => {
        showGlobalTooltip(name, card);
        moveGlobalTooltip(e);
    });
    card.addEventListener('mousemove', (e) => {
        moveGlobalTooltip(e);
    });
    card.addEventListener('mouseleave', () => {
        hideGlobalTooltip();
    });

    card.addEventListener('click', () => toggleSelection(name));
    return card;
}

function showGlobalTooltip(name, trigger = null) {
    const itemData = items[name];
    if (!itemData) return;
    
    const tooltip = document.getElementById('global-tooltip');
    if (!tooltip) return;
    
    const gradeStyle = getItemGradeStyle(itemData.type);
    const typeColor = gradeStyle.color;
    const partName = PART_NAMES[itemData.part] ? PART_NAMES[itemData.part][currentLanguage] : itemData.part;
    const typeName = TYPE_NAMES[itemData.type] ? TYPE_NAMES[itemData.type][currentLanguage] : itemData.type;
    const highTierMaterials = getHighTierMaterialsForItem(name, itemData);
    const materialIcons = highTierMaterials.map(material => {
        const config = HIGH_TIER_MATERIALS[material];
        const label = `${getHighTierMaterialName(material)} · ${config.price} ${t('credits')}`;
        return `<img src="${escapeAttribute(config.image)}" alt="${escapeAttribute(label)}" title="${escapeAttribute(label)}" loading="lazy" decoding="async">`;
    }).join('');
    
    let tooltipHtml = `
        <div class="tooltip-header">
            <div class="tooltip-highlight" style="background-color: ${typeColor};"></div>
            <div class="tooltip-header-info">
                <div class="tooltip-name">${getItemName(name)}</div>
                <div class="tooltip-meta-row">
                    <div>
                        <div class="tooltip-type" style="color: ${typeColor};">${typeName}</div>
                        <div class="tooltip-part">${partName}</div>
                    </div>
                    ${materialIcons ? `<div class="tooltip-resource-list">${materialIcons}</div>` : ''}
                </div>
            </div>
            <div class="tooltip-image-container">
                <img src="${escapeAttribute(getItemImagePath(name))}" alt="${escapeAttribute(getItemName(name))}" data-item-image="${escapeAttribute(name)}" loading="lazy" decoding="async">
            </div>
        </div>
        <div class="tooltip-stats">
    `;
    
    if (itemData.stats) {
        let uniqueTooltipHtml = '';
        ITEM_TOOLTIP_STATS.forEach(s => {
            if (s.id === 'moveSpeed') {
                const flatVal = itemData.stats.moveSpeed || 0;
                const pctVal = itemData.stats.moveSpeedRatio || 0;
                const uniqueFlatVal = (itemData.uniqueStats && itemData.uniqueStats.moveSpeed) || 0;
                const uniquePctVal = (itemData.uniqueStats && itemData.uniqueStats.moveSpeedRatio) || 0;
                if (flatVal > 0 || pctVal > 0) {
                    tooltipHtml += renderTooltipStatLine(s.name[currentLanguage], formatMovementSpeedValue(flatVal, pctVal));
                }
                if (uniqueFlatVal > 0 || uniquePctVal > 0) {
                    uniqueTooltipHtml += renderTooltipStatLine(s.name[currentLanguage], formatMovementSpeedValue(uniqueFlatVal, uniquePctVal), true);
                }
                return;
            }

            let baseVal = itemData.stats[s.id] || 0;
            let lvVal = (itemData.statsByLv && itemData.statsByLv[s.id]) ? itemData.statsByLv[s.id] : 0;
            let uniqueVal = (itemData.uniqueStats && itemData.uniqueStats[s.id]) || 0;
            
            const statName = s.name[currentLanguage];
            const perLevelStr = currentLanguage === 'ko' ? `레벨 당 ${statName}` : `${statName} per level`;
            
            if (baseVal > 0 && lvVal === 0) {
                tooltipHtml += renderTooltipStatLine(statName, formatTooltipStatValue(s.id, baseVal));
            } else if (lvVal > 0 && baseVal === 0) {
                const maxLvVal = lvVal * 20;
                tooltipHtml += renderTooltipStatLine(perLevelStr, `${formatTooltipStatValue(s.id, lvVal)}~${formatTooltipStatValue(s.id, maxLvVal)}`);
            } else if (baseVal > 0 && lvVal > 0) {
                const maxLvVal = lvVal * 20;
                tooltipHtml += renderTooltipStatLine(statName, formatTooltipStatValue(s.id, baseVal));
                tooltipHtml += renderTooltipStatLine(perLevelStr, `${formatTooltipStatValue(s.id, lvVal)}~${formatTooltipStatValue(s.id, maxLvVal)}`);
            }

            if (uniqueVal > 0) {
                uniqueTooltipHtml += renderTooltipStatLine(statName, formatTooltipStatValue(s.id, uniqueVal), true);
            }
        });
        tooltipHtml += uniqueTooltipHtml;
    }
    getItemPassiveSkills(itemData).forEach(passiveSkill => {
        tooltipHtml += renderPassiveSkillLine(passiveSkill);
    });
    tooltipHtml += `</div>`;
    tooltip.innerHTML = tooltipHtml;
    tooltip.style.setProperty('--tooltip-start', gradeStyle.cardStart);
    tooltip.style.setProperty('--tooltip-end', gradeStyle.cardEnd);
    tooltip.style.setProperty('--tooltip-border', gradeStyle.color);
    applyMythicWeaponVariantIndicator(tooltip, name, itemData);
    applyItemImageFallbacks(tooltip);
    activeTooltipTrigger = trigger;
    tooltip.style.display = 'block';
}

function getUniquePrefixHtml() {
    const label = currentLanguage === 'ko' ? '(고유)' : '(Unique)';
    return `<span style="color:#f1c40f; font-weight:bold;">${label}</span> `;
}

function renderTooltipStatLine(statName, value, isUnique = false) {
    const prefix = isUnique ? getUniquePrefixHtml() : '';
    return `<div class="tooltip-stat"><span>${prefix}${statName} +${value}</span></div>`;
}

function getPassiveSkillName(passiveSkill) {
    return currentLanguage === 'ko' ? (passiveSkill.nameKo || passiveSkill.name) : passiveSkill.name;
}

function getItemPassiveSkills(item) {
    if (!item) return [];
    if (Array.isArray(item.passiveSkills)) return item.passiveSkills;
    return item.passiveSkill ? [item.passiveSkill] : [];
}

function getEffectivePassiveSkills(itemNames) {
    const passiveMap = new Map();
    itemNames.forEach(name => {
        getItemPassiveSkills(items[name]).forEach(passiveSkill => {
            if (!passiveMap.has(passiveSkill.name)) passiveMap.set(passiveSkill.name, passiveSkill);
        });
    });

    const locale = currentLanguage === 'ko' ? 'ko' : 'en';
    return Array.from(passiveMap.values()).sort((a, b) => {
        return getPassiveSkillName(a).localeCompare(getPassiveSkillName(b), locale);
    });
}

function renderPassiveSkillLine(passiveSkill) {
    return `<div class="tooltip-stat"><span style="color:#f1c40f; font-weight:bold;">${getPassiveSkillName(passiveSkill)}</span></div>`;
}

function moveGlobalTooltip(e) {
    const tooltip = document.getElementById('global-tooltip');
    if (!tooltip || tooltip.style.display === 'none') return;
    
    let x = e.clientX + 15;
    let y = e.clientY + 15;
    
    const rect = tooltip.getBoundingClientRect();
    if (x + rect.width > window.innerWidth) {
        x = e.clientX - rect.width - 15;
    }
    if (y + rect.height > window.innerHeight) {
        y = window.innerHeight - rect.height - 15;
    }

    const viewportMargin = 8;
    const maxX = Math.max(viewportMargin, window.innerWidth - rect.width - viewportMargin);
    const maxY = Math.max(viewportMargin, window.innerHeight - rect.height - viewportMargin);
    x = Math.min(Math.max(viewportMargin, x), maxX);
    y = Math.min(Math.max(viewportMargin, y), maxY);
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function hideGlobalTooltip() {
    const tooltip = document.getElementById('global-tooltip');
    if (tooltip) tooltip.style.display = 'none';
    activeTooltipTrigger = null;
}

function toggleSelection(name) {
    const build = getBuild();
    if (build.has(name)) {
        build.delete(name);
    } else {
        // Unique Selection Logic
        if (PRIYA_EXCLUSIVE_HEAD_ITEMS.has(name)) {
            forceCharacterSelection("Priya");
        } else if (ECHION_EXCLUSIVE_WEAPONS.has(name) || items[name].weaponType === "VFArm") {
            forceCharacterSelection("Echion");
        }

        if (!addItemToBuild(name)) return;
    }
    updateMainGridVisuals();
    updateSelectedPanel({ buildChanged: true });
}

function forceCharacterSelection(charName) {
    if (currentCharacter !== charName) selectCharacter(charName);
}

function updateMainGridVisuals() {
    // We only update visible cards. 
    // Since cards are re-created on filter change, this just handles selection state.
    const build = getBuild();
    const cards = document.querySelectorAll('#item-grid .item-card');
    cards.forEach(card => {
        const name = card.dataset.name;
        const selected = build.has(name);
        const item = items[name];
        const typeName = item && TYPE_NAMES[item.type] ? TYPE_NAMES[item.type][currentLanguage] : item?.type || '';
        card.classList.toggle('selected', selected);
        card.setAttribute('aria-pressed', String(selected));
        card.setAttribute('aria-label', `${t(selected ? 'removeItem' : 'addItem')}: ${getItemName(name)}, ${typeName}`);
    });
}

function updateSelectedPanel({ buildChanged = false } = {}) {
    const container = document.getElementById('selected-item-grid');
    if (!container) return;
    container.innerHTML = '';

    if (activeBuildType === BUILD_TYPES.LATE) {
        renderLateBuildSlots(container);
        renderLateGamePanel();
        return;
    }

    container.classList.remove('late-build-grid');

    const build = getBuild();
    if (build.size === 0) {
        const emptyKey = activeBuildType === BUILD_TYPES.LATE ? 'clickToAddLate' : 'clickToAdd';
        container.innerHTML = `<p class="empty-msg">${t(emptyKey)}</p>`;
        if (buildChanged && activeBuildType === BUILD_TYPES.EARLY) {
            selectedRoutes = [];
            renderStatComparison();
        }
        return;
    }

    const sortedItems = sortItemsByBuildSlot(build);

    sortedItems.forEach(name => {
        const card = createItemCard(name);
        card.classList.add('selected-build-card');
        card.title = `${t('removeItem')}: ${getItemName(name)}`;
        container.appendChild(card);
    });
    
    if (buildChanged && activeBuildType === BUILD_TYPES.EARLY) {
        selectedRoutes = [];
        renderStatComparison();
    }
}

function renderLateBuildSlots(container) {
    container.classList.add('late-build-grid');

    EQUIPMENT_SLOTS.forEach(slot => {
        const slotContainer = document.createElement('div');
        slotContainer.className = 'late-build-slot';
        slotContainer.dataset.slot = slot;

        const label = document.createElement('span');
        label.className = 'late-build-slot-label';
        label.textContent = PART_NAMES[slot][currentLanguage];
        slotContainer.appendChild(label);

        const itemName = getBuildItemForSlot(lateBuild, slot);
        if (itemName) {
            const card = createItemCard(itemName);
            card.classList.add('late-build-slot-card');
            card.title = currentLanguage === 'ko' ? '클릭하여 제거' : 'Click to remove';
            slotContainer.appendChild(card);
        } else {
            const emptyButton = document.createElement('button');
            emptyButton.type = 'button';
            emptyButton.className = 'late-build-empty-slot';
            emptyButton.setAttribute('aria-label', `${PART_NAMES[slot][currentLanguage]}: ${t('clickToAddLate')}`);
            emptyButton.innerHTML = `<img src="images/ui/${slot}.png" alt="" loading="lazy" decoding="async"><span>+</span>`;
            emptyButton.addEventListener('click', () => {
                const filterButton = document.querySelector(`.filter-row .filter-btn[data-filter="${slot}"]`);
                if (filterButton) filterButton.click();
                document.getElementById('item-search')?.focus();
            });
            slotContainer.appendChild(emptyButton);
        }

        container.appendChild(slotContainer);
    });
}

function saveLateComparisonBuild(index) {
    if (index !== 0 && index !== 1) return;
    const snapshot = createLateBuildSnapshot();
    if (!snapshot) return;
    lateComparisonBuilds[index] = snapshot;
    renderLateGamePanel();
}

function loadLateComparisonBuild(index) {
    const snapshot = lateComparisonBuilds[index];
    if (!snapshot) return;
    lateBuild.clear();
    snapshot.forEach(name => addItemToBuild(name, BUILD_TYPES.LATE));
    updateMainGridVisuals();
    updateSelectedPanel({ buildChanged: true });
}

function renderLateSnapshot(snapshot, index) {
    const label = index === 0 ? t('buildA') : t('buildB');
    if (!snapshot) {
        return `<div class="late-snapshot-card empty"><strong>${label}</strong><span>—</span></div>`;
    }

    const icons = snapshot.map(name => {
        const item = items[name];
        const gradeStyle = getItemGradeStyle(item && item.type);
        return `<div class="late-snapshot-icon" data-item="${escapeAttribute(name)}" tabindex="0" aria-label="${escapeAttribute(getItemName(name))}" style="--item-card-start:${gradeStyle.cardStart};--item-card-end:${gradeStyle.cardEnd}" title="${escapeAttribute(getItemName(name))}">
            <img src="${escapeAttribute(getItemImagePath(name))}" alt="${escapeAttribute(getItemName(name))}" data-item-image="${escapeAttribute(name)}" loading="lazy" decoding="async">
        </div>`;
    }).join('');
    return `<div class="late-snapshot-card">
        <div class="late-snapshot-head"><strong>${label}</strong><button type="button" class="late-load-btn" data-late-load="${index}">${t('loadBuild')}</button></div>
        <div class="late-snapshot-items">${icons}</div>
    </div>`;
}

function renderLateGamePanel() {
    const panel = document.getElementById('late-game-panel');
    if (!panel || activeBuildType !== BUILD_TYPES.LATE) return;

    const filledSlots = EQUIPMENT_SLOTS.filter(slot => !!getBuildItemForSlot(lateBuild, slot)).length;
    const complete = isLateBuildComplete();
    const progress = document.getElementById('late-build-progress');
    if (progress) {
        progress.textContent = `${filledSlots} / ${EQUIPMENT_SLOTS.length}`;
        progress.classList.toggle('complete', complete);
    }

    const currentStats = document.getElementById('late-current-stats');
    if (currentStats) {
        currentStats.innerHTML = lateBuild.size
            ? renderSingleStatColumn(calculateBuildStats(Array.from(lateBuild)), {
                creditCost: getBuildCreditCost(lateBuild)
            })
            : `<p class="empty-msg">${t('noBuildStats')}</p>`;
    }

    const canSaveComparison = canSaveLateComparisonBuild();
    document.querySelectorAll('.late-save-btn').forEach(button => {
        button.disabled = !canSaveComparison;
        button.title = canSaveComparison ? '' : t('incompleteLateBuild');
    });

    const clearButton = document.getElementById('clear-late-comparison-btn');
    if (clearButton) clearButton.disabled = !lateComparisonBuilds.some(Boolean);

    const output = document.getElementById('late-comparison-output');
    if (!output) return;
    const snapshots = lateComparisonBuilds.map((snapshot, index) => renderLateSnapshot(snapshot, index)).join('');
    const comparison = lateComparisonBuilds.every(Boolean)
        ? `<div class="late-stat-comparison">${renderComparisonColumns(
            calculateBuildStats(lateComparisonBuilds[0]),
            calculateBuildStats(lateComparisonBuilds[1]),
            [t('buildA'), t('buildB')],
            {
                creditCosts: [
                    getBuildCreditCost(lateComparisonBuilds[0]),
                    getBuildCreditCost(lateComparisonBuilds[1])
                ]
            }
        )}</div>`
        : `<p class="empty-msg late-comparison-waiting">${t('comparisonWaiting')}</p>`;
    output.innerHTML = `<div class="late-snapshot-grid">${snapshots}</div>${comparison}`;
    applyItemImageFallbacks(output);
    output.querySelectorAll('.late-snapshot-icon[data-item]').forEach(icon => {
        applyMythicWeaponVariantIndicator(icon, icon.dataset.item);
        icon.addEventListener('mouseenter', (event) => {
            showGlobalTooltip(icon.dataset.item, icon);
            moveGlobalTooltip(event);
        });
        icon.addEventListener('mousemove', moveGlobalTooltip);
        icon.addEventListener('mouseleave', hideGlobalTooltip);
        icon.addEventListener('focus', () => {
            const rect = icon.getBoundingClientRect();
            showGlobalTooltip(icon.dataset.item, icon);
            moveGlobalTooltip({ clientX: rect.right, clientY: rect.top });
        });
        icon.addEventListener('blur', hideGlobalTooltip);
    });
    output.querySelectorAll('[data-late-load]').forEach(button => {
        button.addEventListener('click', () => loadLateComparisonBuild(Number(button.dataset.lateLoad)));
    });
}

// ==========================================
// STATS COMPARISON LOGIC
// ==========================================

function renderStatComparison() {
    const statList = document.getElementById('stat-list');
    if (!statList) return;

    // Use selected routes if any
    let buildsToCompare = [];
    if (selectedRoutes.length > 0) {
        buildsToCompare = selectedRoutes.map(r => r.variantItems);
    }

    if (buildsToCompare.length === 0) {
        statList.innerHTML = `<p class="empty-msg">${t('optimizeThenCompare')}</p>`;
        return;
    }

    const calculatedBuilds = buildsToCompare.map(build => calculateBuildStats(build));

    if (calculatedBuilds.length === 1) {
        statList.innerHTML = renderSingleStatColumn(calculatedBuilds[0]);
    } else {
        statList.innerHTML = renderComparisonColumns(calculatedBuilds[0], calculatedBuilds[1]);
    }
}

function calculateBuildStats(itemNames) {
    const totalStats = {};
    DISPLAY_STATS.forEach(s => totalStats[s.id] = 0);
    totalStats.moveSpeedRatio = 0;
    totalStats.__passiveSkills = getEffectivePassiveSkills(itemNames);
    let baseMoveSpeed = 0;

    const ensureStat = (key) => {
        if (totalStats[key] === undefined) totalStats[key] = 0;
    };
    
    // Add Character Base & Growth Stats
    if (currentCharacter && chars[currentCharacter]) {
        const cBase = chars[currentCharacter].base;
        const cGrowth = chars[currentCharacter].growth;
        const lvMinusOne = charLevel - 1;
        ['maxHp', 'attackPower', 'defense', 'hpRegen', 'attackSpeedRatio', 'moveSpeed'].forEach(ensureStat);
        totalStats.maxHp += (cBase.maxHp || 0) + (cGrowth.maxHp || 0) * lvMinusOne;
        totalStats.attackPower += (cBase.attackPower || 0) + (cGrowth.attackPower || 0) * lvMinusOne;
        totalStats.defense += (cBase.defense || 0) + (cGrowth.defense || 0) * lvMinusOne;
        totalStats.hpRegen += (cBase.hpRegen || 0) + (cGrowth.hpRegen || 0) * lvMinusOne;
        
        if (cBase.attackSpeed !== undefined) {
            totalStats.attackSpeedRatio += (cBase.attackSpeed || 0) + (cGrowth.attackSpeed || 0) * lvMinusOne;
        }
        if (cBase.moveSpeed !== undefined) {
            totalStats.moveSpeed += cBase.moveSpeed;
            baseMoveSpeed = cBase.moveSpeed || 0;
        }
    }

    const uniqueMaxStats = {};

    itemNames.forEach(name => {
        const itemObj = items[name];
        if (itemObj) {
            if (itemObj.stats) {
                Object.keys(itemObj.stats).forEach(key => {
                    if (totalStats[key] !== undefined) totalStats[key] += itemObj.stats[key];
                });
            }
            if (itemObj.uniqueStats) {
                Object.keys(itemObj.uniqueStats).forEach(key => {
                    if (totalStats[key] !== undefined) {
                        uniqueMaxStats[key] = Math.max(uniqueMaxStats[key] || 0, itemObj.uniqueStats[key]);
                    }
                });
            }
            if (itemObj.statsByLv) {
                Object.keys(itemObj.statsByLv).forEach(key => {
                    if (totalStats[key] !== undefined) totalStats[key] += itemObj.statsByLv[key] * charLevel;
                });
            }
        }
    });

    Object.keys(uniqueMaxStats).forEach(key => {
        totalStats[key] += uniqueMaxStats[key];
    });

    let msFlat = totalStats.moveSpeed - baseMoveSpeed;
    let msPct = totalStats.moveSpeedRatio;
    totalStats.moveSpeed = {
        flat: msFlat,
        percent: msPct,
        baseFlat: baseMoveSpeed,
        valueOf: function() { return this.flat + (this.percent * 10); },
        toString: function() { return formatMovementSpeedValue(this.flat, this.percent, this.baseFlat); }
    };

    return totalStats;
}

function formatPercentValue(val) {
    return (val * 100).toFixed(0) + '%';
}

function formatMovementSpeedValue(flat, percent, fallbackFlat = 0) {
    const parts = [];
    if (percent > 0) parts.push(formatPercentValue(percent));
    if (flat > 0) parts.push(flat.toFixed(2));
    if (parts.length > 0) return parts.join(' + ');
    return fallbackFlat > 0 ? fallbackFlat.toFixed(2) : '0';
}

function isPercentStat(id) {
    return id.endsWith('Ratio') ||
        id.endsWith('Chance') ||
        id.endsWith('LifeSteal') ||
        id === 'criticalStrikeDamage' ||
        id === 'hpRegen' ||
        id === 'lifeSteal' ||
        id === 'tenacity' ||
        id === 'omnisyphon';
}

function formatTooltipStatValue(id, val) {
    if (isPercentStat(id)) return formatPercentValue(val);
    if (id === 'moveSpeed') return val.toFixed(2);
    if (id === 'attackRange' || id === 'visionRange') return val.toFixed(2);
    if (id === 'cooldownReduction') return Math.round(val);
    return Number.isInteger(val) ? String(val) : val.toFixed(1);
}

function isZeroStatValue(val) {
    return Number(val) === 0;
}

function formatStatValue(id, val) {
    if (id === 'attackSpeedRatio') return formatPercentValue(val);
    if (id === 'moveSpeed') {
        if (typeof val === 'object') return val.toString();
        return val.toFixed(2);
    }
    if (id === 'attackRange' || id === 'visionRange') return val.toFixed(2);
    if (id === 'hpRegen') return formatPercentValue(val);
    if (id === 'cooldownReduction') return Math.round(val) + ' (' + Math.round((val / (100 + val)) * 100) + '%)';
    if (isPercentStat(id)) return formatPercentValue(val);
    return Math.round(val);
}

function renderPassiveSkillsHeader() {
    return `<div style="margin-top:10px; padding-top:6px; border-top:1px solid var(--border-color); color:var(--text-muted); font-weight:bold; font-size:0.85em;">${t('passiveSkills')}</div>`;
}

function renderSinglePassiveSkills(passiveSkills) {
    if (!passiveSkills || passiveSkills.length === 0) return '';
    let html = renderPassiveSkillsHeader();
    passiveSkills.forEach(passiveSkill => {
        html += `<div style="padding:2px 0; color:#2ecc71; font-weight:bold;">${escapeAttribute(getPassiveSkillName(passiveSkill))}</div>`;
    });
    return html;
}

function renderPassiveSkillComparison(passiveSkills1 = [], passiveSkills2 = []) {
    if (passiveSkills1.length === 0 && passiveSkills2.length === 0) return '';

    const map1 = new Map(passiveSkills1.map(passive => [passive.name, passive]));
    const map2 = new Map(passiveSkills2.map(passive => [passive.name, passive]));
    const common = passiveSkills1.filter(passive => map2.has(passive.name));
    const leftOnly = passiveSkills1.filter(passive => !map2.has(passive.name));
    const rightOnly = passiveSkills2.filter(passive => !map1.has(passive.name));
    const rows = [];

    common.forEach(passiveSkill => {
        rows.push({
            left: getPassiveSkillName(passiveSkill),
            right: getPassiveSkillName(map2.get(passiveSkill.name)),
            shared: true
        });
    });

    const maxRows = Math.max(leftOnly.length, rightOnly.length);
    for (let i = 0; i < maxRows; i++) {
        rows.push({
            left: leftOnly[i] ? getPassiveSkillName(leftOnly[i]) : '',
            right: rightOnly[i] ? getPassiveSkillName(rightOnly[i]) : '',
            shared: false
        });
    }

    let html = '';
    rows.forEach((row, index) => {
        const leftColor = row.shared ? 'var(--text-main)' : (row.left ? '#27ae60' : 'var(--text-muted)');
        const rightColor = row.shared ? 'var(--text-main)' : (row.right ? '#27ae60' : 'var(--text-muted)');
        html += `
            <div style="display:flex; align-items:center; padding:3px 0; border-bottom:1px dashed var(--border-color); font-size:0.85em;">
                <div style="flex:1; text-align:right; font-weight:bold; color:${leftColor};">${escapeAttribute(row.left)}</div>
                <div style="flex:1.5; text-align:center; color:var(--text-muted); font-size:0.9em;">${t('passiveSkills')}</div>
                <div style="flex:1; text-align:left; font-weight:bold; color:${rightColor};">${escapeAttribute(row.right)}</div>
            </div>
        `;
    });

    return html;
}

function renderSingleStatColumn(stats, { creditCost = null } = {}) {
    let html = `<div style="flex:1;">`;
    let portraitHtml = '';
    if (currentCharacter) {
        portraitHtml = `
            <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:15px; position:relative; width:100%;">
                <div style="width:60px; height:60px; border-radius:50%; overflow:hidden; border:2px solid #ccc; margin:0 auto;">
                    <img src="${escapeAttribute(getCharacterImagePath(currentCharacter))}" alt="${escapeAttribute(getCharName(currentCharacter))}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:0.7em;\\'>${getCharName(currentCharacter)}</div>'">
                </div>
                <div style="position:absolute; bottom:-5px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.85); color:white; font-size:0.75em; padding:2px 6px; border-radius:8px; font-weight:bold; border:1px solid #555;">Lv.${charLevel}</div>
            </div>`;
    }
    html += portraitHtml;

    if (creditCost !== null) {
        html += `<div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px dashed var(--border-color);">
            <span>${t('totalCredits')}</span>
            <strong style="color:var(--text-main);">${creditCost} ${t('credits')}</strong>
        </div>`;
    }

    DISPLAY_STATS.forEach(s => {
        if (!isZeroStatValue(stats[s.id]) && stats[s.id] > 0) {
            html += `<div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px dashed var(--border-color);">
                <span>${s.name[currentLanguage]}</span>
                <strong style="color:var(--text-main);">${formatStatValue(s.id, stats[s.id])}</strong>
            </div>`;
        }
    });
    html += renderSinglePassiveSkills(stats.__passiveSkills);
    html += `</div>`;
    return html;
}

function getComparisonValueColors(value1, value2, lowerIsBetter = false) {
    if (value1 === value2) return ['var(--text-main)', 'var(--text-main)'];
    const leftIsBetter = lowerIsBetter ? value1 < value2 : value1 > value2;
    return leftIsBetter ? ['#27ae60', '#e74c3c'] : ['#e74c3c', '#27ae60'];
}

function renderComparisonColumns(stats1, stats2, labels = [t('route1'), t('route2')], { creditCosts = null } = {}) {
    let html = `<div style="flex:1; display:flex; gap:20px;">`;
    
    // Shared portrait
    let portraitHtml = '';
    if (currentCharacter) {
        portraitHtml = `
            <div style="display:flex; flex-direction:column; align-items:center; margin-bottom:15px; width:100%; position:relative;">
                <div style="width:50px; height:50px; border-radius:50%; overflow:hidden; border:2px solid #ccc; margin: 0 auto;">
                    <img src="${escapeAttribute(getCharacterImagePath(currentCharacter))}" alt="${escapeAttribute(getCharName(currentCharacter))}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:0.6em;\\'>${getCharName(currentCharacter)}</div>'">
                </div>
                <div style="position:absolute; bottom:-5px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.85); color:white; font-size:0.65em; padding:2px 5px; border-radius:6px; font-weight:bold; border:1px solid #555;">Lv.${charLevel}</div>
            </div>`;
    }

    const commonStats = [];
    const diffStats = [];

    DISPLAY_STATS.forEach(s => {
        const v1 = stats1[s.id] || 0;
        const v2 = stats2[s.id] || 0;
        if (isZeroStatValue(v1) && isZeroStatValue(v2)) return;
        if (Math.round(v1*100) === Math.round(v2*100)) {
            commonStats.push({ id: s.id, name: s.name, v1, v2 });
        } else {
            diffStats.push({ id: s.id, name: s.name, v1, v2 });
        }
    });

    const renderRow = (item, isCommon) => {
        const [color1, color2] = isCommon
            ? ['var(--text-main)', 'var(--text-main)']
            : getComparisonValueColors(item.v1, item.v2);
        return `
        <div style="display:flex; align-items:center; padding:3px 0; border-bottom:1px dashed var(--border-color); font-size:0.85em;">
            <div style="flex:1; text-align:right; font-weight:bold; color:${color1};">${item.v1 > 0 ? formatStatValue(item.id, item.v1) : '-'}</div>
            <div style="flex:1.5; text-align:center; color:var(--text-muted); font-size:0.9em;">${item.name[currentLanguage]}</div>
            <div style="flex:1; text-align:left; font-weight:bold; color:${color2};">${item.v2 > 0 ? formatStatValue(item.id, item.v2) : '-'}</div>
        </div>`;
    };

    html += `<div style="flex:1; display:flex; flex-direction:column;">`;
    html += portraitHtml;
    
    html += `<div style="display:flex; justify-content:center; margin-bottom:5px; font-weight:bold; border-bottom:2px solid #ccc;">
        <span style="flex:1; text-align:right; color:#2980b9;">${escapeAttribute(labels[0])}</span>
        <span style="flex:1.5;"></span>
        <span style="flex:1; text-align:left; color:#8e44ad;">${escapeAttribute(labels[1])}</span>
    </div>`;

    if (creditCosts) {
        const [leftCredits, rightCredits] = creditCosts;
        const [leftColor, rightColor] = getComparisonValueColors(leftCredits, rightCredits, true);
        html += `<div style="display:flex; align-items:center; padding:3px 0; border-bottom:1px dashed var(--border-color); font-size:0.85em;">
            <div style="flex:1; text-align:right; font-weight:bold; color:${leftColor};">${leftCredits}</div>
            <div style="flex:1.5; text-align:center; color:var(--text-muted); font-size:0.9em;">${t('totalCredits')}</div>
            <div style="flex:1; text-align:left; font-weight:bold; color:${rightColor};">${rightCredits}</div>
        </div>`;
    }

    commonStats.forEach(item => html += renderRow(item, true));
    diffStats.forEach(item => html += renderRow(item, false));
    html += renderPassiveSkillComparison(stats1.__passiveSkills, stats2.__passiveSkills);

    html += `</div></div>`;
    return html;
}

// ==========================================
// MASTER LOGIC: VARIANT GENERATOR
// ==========================================

async function calculateEarlyRouteVariants() {
    const resultOutput = document.getElementById('result-output');
    resultOutput.innerHTML = t("calculating");
    console.clear();

    if (earlyBuild.size === 0) {
        resultOutput.innerHTML = t("pleaseSelect");
        return;
    }

    // 1. Group Selected Items by Part
    // e.g. { Weapon: [A, B], Chest: [C], Head: [D, E] }
    const slots = {};
    earlyBuild.forEach(name => {
        if (!isItemEligibleForBuild(items[name], BUILD_TYPES.EARLY)) return;
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
        const routes = solveEarlyBuildRoute(buildSet);
        
        // Tag these routes with the specific variant used
        routes.forEach(r => {
            r.variantItems = combo; // Save which items generated this route
        });

        allResults = [...allResults, ...routes];
    });

    if (allResults.length === 0) {
        resultOutput.innerHTML = t("noRoutes");
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

    // Reset selections on new calculation
    selectedRoutes = [];
    renderStatComparison();

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

function solveEarlyBuildRoute(buildSet) {
    if (Array.from(buildSet).some(name => !isItemEligibleForBuild(items[name], BUILD_TYPES.EARLY))) {
        return [];
    }

    // --- STEP 1: CALCULATE NEEDS VS OWNED ---
    const neededCounts = {};
    const uniqueItemsToIgnore = new Set([
        "Alpha Sidewinder",
        "Black Mamba King",
        "Deathadder Queen",
        "Harmony in Full Bloom"
    ]);

    buildSet.forEach(itemName => {
        if (!uniqueItemsToIgnore.has(itemName) && items[itemName] && items[itemName].components) {
            items[itemName].components.forEach(mat => {
                neededCounts[mat] = (neededCounts[mat] || 0) + 1;
            });
        }
    });

    const ownedCounts = { "Shirt": 1, "Running Shoes": 1 };

    // Identify Base Weapon for THIS specific combination
    buildSet.forEach(itemName => {
        const itemData = items[itemName];
        if (itemData && itemData.part === "Weapon" && itemData.components) {
            itemData.components.forEach(comp => {
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
            let allowedDrones = 2;
            if (currentPath.length === 1) allowedDrones = 1;
            if (currentPath.length === 2) allowedDrones = 0;
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
    if (zoneCount === 1) {
        if (droneCount === 0) return 1;
        if (droneCount === 1) return 2;
        if (droneCount === 2) return 3;
    } else if (zoneCount === 2) {
        if (droneCount === 0) return 4;
        if (droneCount === 1) return 5;
    } else if (zoneCount === 3) {
        if (droneCount === 0) return 6;
    }
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
        if (mapData[current].neighbors.includes(next)) distance += 1; 
        else if (mapData[current].hasHyperloop) distance += 10; 
        else distance += 100; // Heavy penalty for no hyperloop and non-neighbor
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
    const mobilePreviewCount = 3;
    
    let html = `${t('topRoutes')}`;
    
    generatedRoutes = topRoutes;

    topRoutes.forEach((r, index) => {
        let tierLabel = "";
        if(r.tier === 1) tierLabel = `<span style="background:#8e44ad; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px; font-weight:bold;">1Z / 0D</span>`;
        else if(r.tier === 2) tierLabel = `<span style="background:#9b59b6; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">1Z / 1D</span>`;
        else if(r.tier === 3) tierLabel = `<span style="background:#af7ac5; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">1Z / 2D</span>`;
        else if(r.tier === 4) tierLabel = `<span style="background:#27ae60; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">2Z / 0D</span>`;
        else if(r.tier === 5) tierLabel = `<span style="background:#f39c12; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">2Z / 1D</span>`;
        else if(r.tier === 6) tierLabel = `<span style="background:#2980b9; color:white; padding:3px 8px; border-radius:4px; font-size:0.75em; margin-right:5px;">3Z / 0D</span>`;

        let droneHtml = r.drones.length > 0 
            ? `<span style="color:#e74c3c;">${t('needDrone')}${r.drones.map(getItemName).join(', ')}</strong></span>` 
            : `<span style="color:#27ae60;">${t('noDrone')}</span>`;

        // Create a summary of the variant (Build) used for this route
        // This is crucial if they selected 2 different weapons
        const variantSummary = sortItemsByBuildSlot(r.variantItems).map(item =>
            `<img src="${escapeAttribute(getItemImagePath(item))}" alt="${escapeAttribute(getItemName(item))}" title="${escapeAttribute(getItemName(item))}" data-item-image="${escapeAttribute(item)}" loading="lazy" decoding="async" style="width:30px; height:30px; object-fit:contain; vertical-align:middle; border:1px solid var(--border-color); border-radius:3px; margin-right:2px;">`
        ).join('');

        let formattedPath = r.path.map((z, idx) => {
            let translatedName = (currentLanguage === 'ko' && mapData[z] && mapData[z].nameKo) ? mapData[z].nameKo : z;
            if (idx > 0) {
                const prev = r.path[idx - 1];
                if (mapData[prev] && mapData[prev].neighbors.includes(z)) {
                    translatedName += '*';
                }
            }
            return translatedName;
        });

        html += `
        <button type="button" class="route-card${index >= mobilePreviewCount ? ' mobile-route-extra' : ''}" data-index="${index}" aria-pressed="false" aria-label="${escapeAttribute(`${t('selectRoute')}: ${formattedPath.join(' → ')}`)}" style="background: var(--route-card-bg); border:1px solid var(--route-card-border); border-left: 5px solid ${getColorForTier(r.tier)}; margin: 8px 0; padding: 12px; border-radius: 4px; cursor:pointer; transition:all 0.2s;">
            
            <div style="margin-bottom: 5px; font-size:0.8rem; color:var(--text-muted); display:flex; align-items:center;">
                <strong style="margin-right:5px;">${t('buildVariant')}</strong> ${variantSummary}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size: 1.1rem; color:var(--text-main);">
                    ${tierLabel} 
                    <strong>${formattedPath.join(" ➔ ")}</strong>
                </div>
            </div>
            
            <div style="font-size:0.85em; margin-top:4px; padding-left: 5px;">
                ${droneHtml}
            </div>
        </button>`;
    });

    if (topRoutes.length > mobilePreviewCount) {
        html += `<button type="button" class="route-show-more" aria-expanded="false">${t('showMoreRoutes')} (${topRoutes.length - mobilePreviewCount})</button>`;
    }
    
    container.classList.remove('routes-expanded');
    container.innerHTML = html;
    applyItemImageFallbacks(container);

    const showMoreButton = container.querySelector('.route-show-more');
    if (showMoreButton) {
        showMoreButton.addEventListener('click', () => {
            const expanded = container.classList.toggle('routes-expanded');
            showMoreButton.setAttribute('aria-expanded', String(expanded));
            showMoreButton.textContent = expanded
                ? t('showFewerRoutes')
                : `${t('showMoreRoutes')} (${topRoutes.length - mobilePreviewCount})`;
        });
    }

    // Add click listeners for comparison
    const routeCards = container.querySelectorAll('.route-card');
    routeCards.forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.dataset.index);
            const route = generatedRoutes[idx];
            
            const existingIdx = selectedRoutes.findIndex(sr => sr === route);
            if (existingIdx !== -1) {
                selectedRoutes.splice(existingIdx, 1);
            } else {
                if (selectedRoutes.length >= 2) {
                    selectedRoutes.shift();
                }
                selectedRoutes.push(route);
            }

            routeCards.forEach(routeCard => {
                const routeIndex = Number(routeCard.dataset.index);
                const comparisonIndex = selectedRoutes.indexOf(generatedRoutes[routeIndex]);
                const selected = comparisonIndex !== -1;
                routeCard.setAttribute('aria-pressed', String(selected));
                routeCard.style.boxShadow = selected
                    ? `0 0 8px ${comparisonIndex === 0 ? 'rgba(41, 128, 185, 0.6)' : 'rgba(142, 68, 173, 0.6)'}`
                    : 'none';
                routeCard.style.borderColor = selected
                    ? (comparisonIndex === 0 ? '#2980b9' : '#8e44ad')
                    : 'var(--route-card-border)';
            });

            renderStatComparison();
        });
    });
}

function getColorForTier(tier) {
    if (tier === 1) return "#8e44ad"; 
    if (tier === 2) return "#9b59b6"; 
    if (tier === 3) return "#af7ac5"; 
    if (tier === 4) return "#27ae60"; 
    if (tier === 5) return "#f39c12"; 
    if (tier === 6) return "#2980b9"; 
    return "#ccc";
}
