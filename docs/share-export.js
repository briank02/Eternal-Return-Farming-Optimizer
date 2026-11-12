const SHARE_SNAPSHOT_VERSION = 1;
const SHARE_CANVAS_WIDTH = 1200;
const SHARE_CANVAS_HEIGHT = 675;
const SHARE_FONT_FAMILY = 'Arial, "Noto Sans KR", sans-serif';
let activeShareSnapshot = null;
let activeShareRenderToken = 0;
let restoredSharedBuild = null;

function formatShareMessage(key, values = {}) {
    return Object.entries(values).reduce(
        (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
        t(key)
    );
}

function createShareReference(name, collection) {
    const entry = collection[name] || {};
    return {
        n: name,
        c: entry.code ?? null
    };
}

function resolveShareReference(reference, collection) {
    if (!reference || typeof reference !== 'object') return null;
    if (reference.c !== null && reference.c !== undefined) {
        const code = String(reference.c);
        const codeMatch = Object.entries(collection).find(([, entry]) => String(entry.code) === code);
        if (codeMatch) return codeMatch[0];
    }
    return typeof reference.n === 'string' && collection[reference.n] ? reference.n : null;
}

function createShareSnapshot(route = null) {
    const isEarly = activeBuildType === BUILD_TYPES.EARLY;
    const itemNames = isEarly
        ? sortItemsByBuildSlot(route?.variantItems || [])
        : sortItemsByBuildSlot(lateBuild);
    if (itemNames.length === 0 || (isEarly && !route)) return null;

    const snapshot = {
        v: SHARE_SNAPSHOT_VERSION,
        p: String(dataMeta.patchVersion || ''),
        m: activeBuildType,
        l: Math.max(1, Math.min(20, Number(charLevel) || 1)),
        c: currentCharacter ? createShareReference(currentCharacter, chars) : null,
        i: itemNames.map(name => createShareReference(name, items))
    };

    if (isEarly) {
        snapshot.r = {
            p: Array.isArray(route.path) ? [...route.path] : [],
            d: Array.isArray(route.drones) ? [...route.drones] : [],
            t: Number(route.tier) || 0
        };
    }
    return snapshot;
}

function validateShareSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return false;
    if (snapshot.v !== SHARE_SNAPSHOT_VERSION) return false;
    if (![BUILD_TYPES.EARLY, BUILD_TYPES.LATE].includes(snapshot.m)) return false;
    if (!Array.isArray(snapshot.i) || snapshot.i.length === 0 || snapshot.i.length > 10) return false;
    if (!snapshot.i.every(reference => reference && typeof reference === 'object' &&
        (typeof reference.n === 'string' || (reference.c !== null && reference.c !== undefined)))) return false;
    if (snapshot.c !== null && snapshot.c !== undefined && typeof snapshot.c !== 'object') return false;
    if (snapshot.m === BUILD_TYPES.EARLY) {
        if (!snapshot.r || !Array.isArray(snapshot.r.p) || snapshot.r.p.length === 0 || snapshot.r.p.length > 10) {
            return false;
        }
        if (snapshot.r.d !== undefined && (!Array.isArray(snapshot.r.d) || snapshot.r.d.length > 20)) return false;
    }
    return true;
}

function encodeShareSnapshot(snapshot) {
    const bytes = new TextEncoder().encode(JSON.stringify(snapshot));
    let binary = '';
    for (let index = 0; index < bytes.length; index += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    }
    return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
}

function decodeShareSnapshot(encoded) {
    if (typeof encoded !== 'string' || encoded.length === 0 || encoded.length > 12000) return null;
    try {
        const base64 = encoded.replaceAll('-', '+').replaceAll('_', '/');
        const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
        const binary = atob(padded);
        const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
        const snapshot = JSON.parse(new TextDecoder().decode(bytes));
        return validateShareSnapshot(snapshot) ? snapshot : null;
    } catch (error) {
        return null;
    }
}

function getSharedSnapshotFromLocation(locationLike = window.location) {
    const hash = String(locationLike.hash || '').replace(/^#/, '');
    if (!hash) return null;
    const encoded = new URLSearchParams(hash).get('build');
    return encoded ? decodeShareSnapshot(encoded) : null;
}

function getSharedBuildModeFromUrl(locationLike = window.location) {
    return getSharedSnapshotFromLocation(locationLike)?.m || null;
}

function createShareLink(snapshot, baseHref = window.location.href) {
    if (!validateShareSnapshot(snapshot)) throw new Error('Invalid share snapshot');
    const url = new URL(baseHref);
    url.searchParams.set('mode', snapshot.m);
    url.hash = new URLSearchParams({ build: encodeShareSnapshot(snapshot) }).toString();
    return url.href;
}

function restoreSharedBuildFromUrl(locationLike = window.location) {
    const snapshot = getSharedSnapshotFromLocation(locationLike);
    if (!snapshot) return null;

    const characterName = snapshot.c ? resolveShareReference(snapshot.c, chars) : null;
    currentCharacter = characterName;
    charLevel = Math.max(1, Math.min(20, Number(snapshot.l) || 1));
    const levelInput = document.getElementById('char-level');
    if (levelInput) levelInput.value = String(charLevel);

    const build = getBuild(snapshot.m);
    build.clear();
    const resolvedItems = [];
    let missingItems = 0;
    snapshot.i.forEach(reference => {
        const itemName = resolveShareReference(reference, items);
        if (!itemName || !addItemToBuild(itemName, snapshot.m)) {
            missingItems += 1;
            return;
        }
        resolvedItems.push(itemName);
    });

    let route = null;
    if (snapshot.m === BUILD_TYPES.EARLY && snapshot.r) {
        const path = snapshot.r.p.filter(zone => typeof zone === 'string' && mapData[zone]);
        if (path.length > 0) {
            route = {
                path,
                drones: (snapshot.r.d || []).filter(material => typeof material === 'string'),
                tier: Math.max(1, Math.min(6, Number(snapshot.r.t) || 6)),
                variantItems: sortItemsByBuildSlot(resolvedItems)
            };
            generatedRoutes = [route];
            selectedRoutes = [];
        }
    }

    restoredSharedBuild = { snapshot, route, missingItems };
    return restoredSharedBuild;
}

function renderRestoredSharedBuild() {
    if (!restoredSharedBuild) return;
    const { snapshot, route, missingItems } = restoredSharedBuild;
    const messages = [t('sharedBuildLoaded')];
    if (snapshot.p && dataMeta.patchVersion && snapshot.p !== String(dataMeta.patchVersion)) {
        messages.push(formatShareMessage('sharedPatchWarning', {
            patch: snapshot.p,
            current: dataMeta.patchVersion
        }));
    }
    if (missingItems > 0) {
        messages.push(formatShareMessage('sharedItemsMissing', { count: missingItems }));
    }

    const notice = document.getElementById('shared-build-notice');
    if (notice) {
        notice.textContent = messages.join(' ');
        notice.hidden = false;
    }
    if (route) {
        const output = document.getElementById('result-output');
        if (output) displayResults([route], output);
    }
    syncShareExportButton();
}

function syncShareExportButton() {
    const button = document.getElementById('share-build-btn');
    if (!button) return;
    const isEarly = activeBuildType === BUILD_TYPES.EARLY;
    const enabled = isEarly ? generatedRoutes.length > 0 : lateBuild.size > 0;
    const labelKey = isEarly ? 'shareEarlyRoute' : 'shareLateBuild';
    button.dataset.i18n = labelKey;
    button.textContent = t(labelKey);
    button.disabled = !enabled;
    button.title = enabled ? '' : t(isEarly ? 'shareNeedRoute' : 'shareNeedBuild');
}

function syncShareExportTranslations() {
    syncShareExportButton();
    syncShareImageActionAvailability();
    const closeButton = document.getElementById('close-share-build');
    if (closeButton) closeButton.setAttribute('aria-label', t('closeShareExport'));
    const canvas = document.getElementById('share-build-canvas');
    if (canvas) canvas.setAttribute('aria-label', t('shareExportTitle'));
    const dialog = document.getElementById('share-build-dialog');
    if (dialog?.open) {
        populateShareRoutePicker();
        updateActiveShareSnapshot();
    }
}

function setShareExportStatus(message, state = '') {
    const status = document.getElementById('share-build-status');
    if (!status) return;
    status.textContent = message;
    if (state) status.dataset.state = state;
    else status.removeAttribute('data-state');
}

function syncShareImageActionAvailability(rendering = false) {
    const copyImageButton = document.getElementById('copy-build-image');
    const downloadButton = document.getElementById('download-build-image');
    const supportsImageClipboard = !!(navigator.clipboard?.write && window.ClipboardItem);
    if (copyImageButton) {
        copyImageButton.disabled = rendering || !supportsImageClipboard;
        copyImageButton.title = supportsImageClipboard ? '' : t('copyImageUnsupported');
    }
    if (downloadButton) downloadButton.disabled = rendering;
}

function getDefaultShareRouteIndex() {
    if (selectedRoutes.length === 1) {
        const selectedIndex = generatedRoutes.indexOf(selectedRoutes[0]);
        if (selectedIndex >= 0) return selectedIndex;
    }
    return 0;
}

function populateShareRoutePicker(preferredIndex = null) {
    const wrapper = document.getElementById('share-route-picker-wrap');
    const picker = document.getElementById('share-route-picker');
    if (!wrapper || !picker) return;
    const isEarly = activeBuildType === BUILD_TYPES.EARLY;
    wrapper.hidden = !isEarly;
    if (!isEarly) return;

    const selectedIndex = preferredIndex ?? Number(picker.value) ?? getDefaultShareRouteIndex();
    picker.replaceChildren(...generatedRoutes.map((route, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${index + 1}. ${route.path.map(getLocalizedZoneName).join(' → ')}`;
        return option;
    }));
    picker.value = String(Math.min(Math.max(0, selectedIndex), Math.max(0, generatedRoutes.length - 1)));
}

function updateActiveShareSnapshot() {
    const routePicker = document.getElementById('share-route-picker');
    const route = activeBuildType === BUILD_TYPES.EARLY
        ? generatedRoutes[Number(routePicker?.value) || 0]
        : null;
    activeShareSnapshot = createShareSnapshot(route);
    renderShareCanvas(activeShareSnapshot).catch(error => {
        console.error('Failed to render share preview', error);
        syncShareImageActionAvailability();
        setShareExportStatus(t('shareExportFailed'), 'error');
    });
}

function openShareExportDialog() {
    const dialog = document.getElementById('share-build-dialog');
    if (!dialog) return;
    if (activeBuildType === BUILD_TYPES.EARLY && generatedRoutes.length === 0) return;
    if (activeBuildType === BUILD_TYPES.LATE && lateBuild.size === 0) return;

    populateShareRoutePicker(getDefaultShareRouteIndex());
    syncShareExportTranslations();
    setShareExportStatus(t('renderingPreview'));
    if (!dialog.open) dialog.showModal();
    updateActiveShareSnapshot();
}

function setupShareExport() {
    const dialog = document.getElementById('share-build-dialog');
    const openButton = document.getElementById('share-build-btn');
    const closeButton = document.getElementById('close-share-build');
    const routePicker = document.getElementById('share-route-picker');
    const copyLinkButton = document.getElementById('copy-build-link');
    const copyImageButton = document.getElementById('copy-build-image');
    const downloadButton = document.getElementById('download-build-image');
    if (!dialog || !openButton || !closeButton || !routePicker || !copyLinkButton ||
        !copyImageButton || !downloadButton || dialog.dataset.bound === 'true') return;

    openButton.addEventListener('click', openShareExportDialog);
    closeButton.addEventListener('click', () => dialog.close());
    routePicker.addEventListener('change', updateActiveShareSnapshot);
    copyLinkButton.addEventListener('click', copyActiveShareLink);
    copyImageButton.addEventListener('click', copyActiveShareImage);
    downloadButton.addEventListener('click', downloadActiveShareImage);
    dialog.addEventListener('click', event => {
        const bounds = dialog.getBoundingClientRect();
        const clickedBackdrop = event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom;
        if (clickedBackdrop) dialog.close();
    });
    dialog.addEventListener('close', () => {
        activeShareSnapshot = null;
        activeShareRenderToken += 1;
        setShareExportStatus('');
    });

    syncShareImageActionAvailability();
    dialog.dataset.bound = 'true';
    syncShareExportTranslations();
}

function loadShareImage(source) {
    return new Promise((resolve, reject) => {
        if (!source) return reject(new Error('Missing image source'));
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Could not load ${source}`));
        image.src = source;
    });
}

function drawRoundedRect(context, x, y, width, height, radius, fillStyle, strokeStyle = null) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    if (fillStyle) {
        context.fillStyle = fillStyle;
        context.fill();
    }
    if (strokeStyle) {
        context.strokeStyle = strokeStyle;
        context.stroke();
    }
}

function drawImageContained(context, image, x, y, width, height) {
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    context.drawImage(
        image,
        x + (width - drawWidth) / 2,
        y + (height - drawHeight) / 2,
        drawWidth,
        drawHeight
    );
}

function getWrappedLines(context, text, maxWidth, maxLines = Infinity) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach(word => {
        const candidate = line ? `${line} ${word}` : word;
        if (!line || context.measureText(candidate).width <= maxWidth) {
            line = candidate;
        } else {
            lines.push(line);
            line = word;
        }
    });
    if (line) lines.push(line);
    if (lines.length > maxLines) {
        const limited = lines.slice(0, maxLines);
        let last = limited[maxLines - 1];
        while (last && context.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
        limited[maxLines - 1] = `${last}…`;
        return limited;
    }
    return lines;
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
    const lines = getWrappedLines(context, text, maxWidth, maxLines);
    lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
    return lines.length;
}

function getShareSnapshotItemNames(snapshot) {
    return snapshot.i.map(reference => resolveShareReference(reference, items)).filter(Boolean);
}

function getShareSnapshotCharacterName(snapshot) {
    return snapshot.c ? resolveShareReference(snapshot.c, chars) : null;
}

function getShareSnapshotWeaponType(snapshot) {
    const weaponName = getShareSnapshotItemNames(snapshot)
        .find(itemName => items[itemName]?.part === 'Weapon');
    const weaponType = weaponName ? items[weaponName]?.weaponType : null;
    return weaponType ? getWeaponTypeName(weaponType) : '';
}

async function drawShareCharacter(context, snapshot) {
    const characterName = getShareSnapshotCharacterName(snapshot);
    let portrait = null;
    if (characterName) {
        try {
            portrait = await loadShareImage(getCharacterImagePath(characterName));
        } catch (error) {
            // The character name below remains a useful fallback.
        }
    }

    drawRoundedRect(context, 34, 88, 192, 516, 18, '#182335', '#2b3b53');
    if (portrait) drawImageContained(context, portrait, 55, 113, 150, 224);

    context.fillStyle = '#ffffff';
    context.font = `bold 25px ${SHARE_FONT_FAMILY}`;
    context.textAlign = 'center';
    const nameLineCount = drawWrappedText(
        context,
        characterName ? getCharName(characterName) : t('noCharacter'),
        130,
        378,
        160,
        29,
        2
    );

    let detailY = 378 + nameLineCount * 29 + 13;
    const weaponType = getShareSnapshotWeaponType(snapshot);
    if (weaponType) {
        context.fillStyle = '#65c9f3';
        context.font = `bold 16px ${SHARE_FONT_FAMILY}`;
        const weaponLineCount = drawWrappedText(context, weaponType, 130, detailY, 160, 20, 2);
        detailY += weaponLineCount * 20 + 13;
    }

    context.fillStyle = '#94a9c6';
    context.font = `18px ${SHARE_FONT_FAMILY}`;
    context.fillText(`${t('level').replace(':', '')} ${snapshot.l}`, 130, detailY);
    context.textAlign = 'left';
}

async function drawShareItemTiles(context, snapshot, itemNames) {
    const itemBySlot = new Map(itemNames.map(name => [items[name]?.part, name]));
    const itemImages = new Map();
    const tileWidth = 166;
    const tileHeight = 184;
    const startX = 255;
    const startY = 88;
    const gap = 12;

    await Promise.all([...itemBySlot.values()].filter(Boolean).map(async itemName => {
        try {
            itemImages.set(itemName, await loadShareImage(getItemImagePath(itemName)));
        } catch (error) {
            // The item name remains visible when an image cannot be loaded.
        }
    }));

    EQUIPMENT_SLOTS.forEach((slot, index) => {
        const x = startX + index * (tileWidth + gap);
        const itemName = itemBySlot.get(slot);
        const item = items[itemName];
        const gradeStyle = getItemGradeStyle(item?.type);
        const gradient = context.createLinearGradient(x, startY, x, startY + tileHeight);
        gradient.addColorStop(0, item ? gradeStyle.cardStart : '#202b3d');
        gradient.addColorStop(1, item ? gradeStyle.cardEnd : '#141d2b');
        drawRoundedRect(context, x, startY, tileWidth, tileHeight, 13, gradient, item ? gradeStyle.color : '#40516a');

        context.fillStyle = item ? gradeStyle.color : '#8292a8';
        context.font = `bold 14px ${SHARE_FONT_FAMILY}`;
        context.textAlign = 'center';
        context.fillText(PART_NAMES[slot][currentLanguage], x + tileWidth / 2, startY + 28);

        const image = itemImages.get(itemName);
        if (image) drawImageContained(context, image, x + 14, startY + 36, tileWidth - 28, 91);

        context.fillStyle = '#ffffff';
        context.font = `bold 15px ${SHARE_FONT_FAMILY}`;
        drawWrappedText(
            context,
            itemName ? getItemName(itemName) : t('emptySlot'),
            x + tileWidth / 2,
            startY + 151,
            tileWidth - 20,
            18,
            2
        );
        context.textAlign = 'left';
    });
}

function getShareStatLabel(statId) {
    const statName = getStatName(statId);
    if (typeof statName === 'string') return statName;
    return statName[currentLanguage] || statName.en || prettifyStatId(statId);
}

function getShareStatRows(itemNames) {
    const stats = calculateBuildStats(itemNames);
    const preferredStats = [
        'attackPower', 'defense', 'maxHp', 'attackSpeedRatio',
        'skillAmp', 'cooldownReduction', 'moveSpeed'
    ];
    return preferredStats
        .filter(statId => stats[statId] !== undefined && !isZeroStatValue(stats[statId]))
        .slice(0, 6)
        .map(statId => [getShareStatLabel(statId), formatStatValue(statId, stats[statId])]);
}

function drawShareStats(context, itemNames, x, y, width, maxRows = 6) {
    const rows = getShareStatRows(itemNames).slice(0, maxRows);
    context.fillStyle = '#9eb2cf';
    context.font = `bold 16px ${SHARE_FONT_FAMILY}`;
    context.fillText(t('currentBuildStats'), x, y);
    rows.forEach(([label, value], index) => {
        const rowY = y + 31 + index * 27;
        context.fillStyle = '#b8c7dc';
        context.font = `15px ${SHARE_FONT_FAMILY}`;
        context.fillText(label, x, rowY);
        context.fillStyle = '#ffffff';
        context.font = `bold 15px ${SHARE_FONT_FAMILY}`;
        context.textAlign = 'right';
        context.fillText(String(value), x + width, rowY);
        context.textAlign = 'left';
    });
}

function drawSharePassives(context, itemNames, x, y, width, maxRows = 5) {
    const passives = getEffectivePassiveSkills(itemNames).slice(0, maxRows);
    context.fillStyle = '#9eb2cf';
    context.font = `bold 16px ${SHARE_FONT_FAMILY}`;
    context.fillText(t('passiveSkills'), x, y);
    if (passives.length === 0) {
        context.fillStyle = '#6f829e';
        context.font = `15px ${SHARE_FONT_FAMILY}`;
        context.fillText('-', x, y + 31);
        return;
    }
    passives.forEach((passive, index) => {
        context.fillStyle = '#65d69b';
        context.font = `bold 14px ${SHARE_FONT_FAMILY}`;
        drawWrappedText(context, getPassiveSkillName(passive), x, y + 30 + index * 28, width, 18, 1);
    });
}

async function drawShareRouteMap(context, snapshot, x, y, width, height) {
    try {
        const mapImage = await loadShareImage('images/ui/Map.webp');
        drawImageContained(context, mapImage, x, y, width, height);
    } catch (error) {
        return;
    }
    const scale = Math.min(width / ROUTE_MAP_WIDTH, height / ROUTE_MAP_HEIGHT);
    const renderedWidth = ROUTE_MAP_WIDTH * scale;
    const renderedHeight = ROUTE_MAP_HEIGHT * scale;
    const offsetX = x + (width - renderedWidth) / 2;
    const offsetY = y + (height - renderedHeight) / 2;
    const points = snapshot.r.p.map(zone => ZONE_COORDINATES[zone]).filter(Boolean);

    if (points.length > 1) {
        context.beginPath();
        points.forEach((point, index) => {
            const pointX = offsetX + point.x * scale;
            const pointY = offsetY + point.y * scale;
            if (index === 0) context.moveTo(pointX, pointY);
            else context.lineTo(pointX, pointY);
        });
        context.strokeStyle = '#65c9f3';
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.stroke();
    }

    points.forEach((point, index) => {
        const pointX = offsetX + point.x * scale;
        const pointY = offsetY + point.y * scale;
        context.beginPath();
        context.arc(pointX, pointY, 11, 0, Math.PI * 2);
        context.fillStyle = '#65c9f3';
        context.fill();
        context.strokeStyle = '#17384a';
        context.lineWidth = 2;
        context.stroke();
        context.fillStyle = '#17384a';
        context.font = `bold 13px ${SHARE_FONT_FAMILY}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(String(index + 1), pointX, pointY + 1);
    });
    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
}

async function drawEarlyShareDetails(context, snapshot, itemNames) {
    drawRoundedRect(context, 252, 298, 594, 306, 16, '#152033', '#2b3b53');

    context.fillStyle = '#9eb2cf';
    context.font = `bold 16px ${SHARE_FONT_FAMILY}`;
    context.fillText(t('routeLabel'), 274, 329);
    context.fillStyle = '#ffffff';
    context.font = `bold 20px ${SHARE_FONT_FAMILY}`;
    drawWrappedText(
        context,
        snapshot.r.p.map(getLocalizedZoneName).join(' → '),
        274,
        360,
        250,
        26,
        2
    );

    context.fillStyle = '#9eb2cf';
    context.font = `bold 16px ${SHARE_FONT_FAMILY}`;
    context.fillText(t('droneMaterials'), 574, 329);
    context.fillStyle = snapshot.r.d.length ? '#f39c72' : '#65d69b';
    context.font = `bold 16px ${SHARE_FONT_FAMILY}`;
    drawWrappedText(
        context,
        snapshot.r.d.length ? formatMaterialCountList(snapshot.r.d) : t('noDrone'),
        574,
        360,
        250,
        20,
        3
    );
    drawShareStats(context, itemNames, 274, 452, 250, 4);
    drawSharePassives(context, itemNames, 574, 452, 250, 4);

    drawRoundedRect(context, 870, 298, 296, 306, 16, '#152033', '#2b3b53');
    await drawShareRouteMap(context, snapshot, 895, 312, 246, 280);
}

function drawLateShareDetails(context, itemNames) {
    drawRoundedRect(context, 252, 298, 914, 306, 16, '#152033', '#2b3b53');
    drawShareStats(context, itemNames, 278, 335, 350, 6);
    drawSharePassives(context, itemNames, 690, 335, 300, 6);
    context.fillStyle = '#9eb2cf';
    context.font = `bold 16px ${SHARE_FONT_FAMILY}`;
    context.fillText(t('totalCredits'), 1025, 335);
    context.fillStyle = '#f1c40f';
    context.font = `bold 31px ${SHARE_FONT_FAMILY}`;
    context.fillText(String(getBuildCreditCost(itemNames)), 1025, 377);
}

async function renderShareCanvas(snapshot) {
    if (!snapshot) return;
    const canvas = document.getElementById('share-build-canvas');
    if (!canvas) return;
    const renderToken = ++activeShareRenderToken;
    setShareExportStatus(t('renderingPreview'));
    syncShareImageActionAvailability(true);

    const renderCanvas = document.createElement('canvas');
    renderCanvas.width = SHARE_CANVAS_WIDTH;
    renderCanvas.height = SHARE_CANVAS_HEIGHT;
    const context = renderCanvas.getContext('2d');
    const background = context.createLinearGradient(0, 0, SHARE_CANVAS_WIDTH, SHARE_CANVAS_HEIGHT);
    background.addColorStop(0, '#0b1320');
    background.addColorStop(1, '#17263c');
    context.fillStyle = background;
    context.fillRect(0, 0, SHARE_CANVAS_WIDTH, SHARE_CANVAS_HEIGHT);

    const itemNames = getShareSnapshotItemNames(snapshot);
    context.fillStyle = '#ffffff';
    context.font = `bold 31px ${SHARE_FONT_FAMILY}`;
    context.fillText(snapshot.m === BUILD_TYPES.EARLY ? t('earlyGameRoute') : t('lateGameBuild'), 36, 52);
    context.fillStyle = '#8da3c2';
    context.font = `15px ${SHARE_FONT_FAMILY}`;
    context.textAlign = 'right';
    context.fillText(`${t('dataPatch')}: ${snapshot.p || '-'}`, 1164, 48);
    context.textAlign = 'left';

    await Promise.all([
        drawShareCharacter(context, snapshot),
        drawShareItemTiles(context, snapshot, itemNames)
    ]);
    if (snapshot.m === BUILD_TYPES.EARLY) await drawEarlyShareDetails(context, snapshot, itemNames);
    else drawLateShareDetails(context, itemNames);

    context.fillStyle = '#6f829e';
    context.font = `14px ${SHARE_FONT_FAMILY}`;
    context.fillText('Eternal Return Build Optimizer', 36, 647);
    context.textAlign = 'right';
    context.fillText(window.location.host || 'Eternal Return Build Optimizer', 1164, 647);
    context.textAlign = 'left';

    if (renderToken !== activeShareRenderToken) return;
    canvas.width = SHARE_CANVAS_WIDTH;
    canvas.height = SHARE_CANVAS_HEIGHT;
    canvas.getContext('2d').drawImage(renderCanvas, 0, 0);
    syncShareImageActionAvailability();
    setShareExportStatus('');
}

function getShareCanvasBlob() {
    const canvas = document.getElementById('share-build-canvas');
    return new Promise((resolve, reject) => {
        if (!canvas) return reject(new Error('Missing share canvas'));
        canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas export failed'));
        }, 'image/png');
    });
}

async function copyText(text) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('Clipboard copy failed');
}

async function copyActiveShareLink() {
    if (!activeShareSnapshot) return;
    try {
        await copyText(createShareLink(activeShareSnapshot));
        setShareExportStatus(t('linkCopied'), 'success');
    } catch (error) {
        setShareExportStatus(t('shareExportFailed'), 'error');
    }
}

async function copyActiveShareImage() {
    if (!activeShareSnapshot || !navigator.clipboard?.write || !window.ClipboardItem) {
        setShareExportStatus(t('copyImageUnsupported'), 'error');
        return;
    }
    try {
        const blob = await getShareCanvasBlob();
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setShareExportStatus(t('imageCopied'), 'success');
    } catch (error) {
        setShareExportStatus(t('shareExportFailed'), 'error');
    }
}

function getShareDownloadName(snapshot) {
    const characterName = getShareSnapshotCharacterName(snapshot) || 'build';
    const safeCharacter = characterName.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-|-$/g, '');
    return `${safeCharacter || 'build'}-${snapshot.m}-patch-${snapshot.p || 'unknown'}.png`;
}

async function downloadActiveShareImage() {
    if (!activeShareSnapshot) return;
    try {
        const blob = await getShareCanvasBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = getShareDownloadName(activeShareSnapshot);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setShareExportStatus(t('imageDownloaded'), 'success');
    } catch (error) {
        setShareExportStatus(t('shareExportFailed'), 'error');
    }
}
