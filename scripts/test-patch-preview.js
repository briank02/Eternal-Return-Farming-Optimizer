const assert = require('assert');
const { applyPatchPreview } = require('./apply-patch-preview');

function createFixture() {
    return {
        meta: { patchVersion: '1.0', generatedAt: '2026-01-01T00:00:00.000Z' },
        items: {
            Helmet: {
                stats: { defense: 20, skillAmp: 50 },
                uniqueStats: {},
                statsByLv: { defense: 1 },
                locations: ['Uptown', 'Warehouse']
            }
        }
    };
}

const preview = {
    patchVersion: '1.1',
    basePatchVersion: '1.0',
    sourceUrl: 'https://example.com/patch-notes',
    items: {
        Helmet: {
            stats: { skillAmp: 55, defense: null },
            fields: { initialCount: 2 },
            locations: { remove: ['Uptown'], add: ['Factory', 'Factory'] }
        }
    }
};

const appliedAt = '2026-01-02T00:00:00.000Z';
const result = applyPatchPreview(createFixture(), preview, appliedAt);
assert.deepEqual(result.data.items.Helmet.stats, { skillAmp: 55 });
assert.equal(result.data.items.Helmet.initialCount, 2);
assert.deepEqual(result.data.items.Helmet.locations, ['Warehouse', 'Factory']);
assert.deepEqual(result.data.meta, {
    patchVersion: '1.1',
    generatedAt: '2026-01-01T00:00:00.000Z',
    basePatchVersion: '1.0',
    preview: true,
    previewSource: 'https://example.com/patch-notes',
    previewAppliedAt: appliedAt
});

const reapplied = applyPatchPreview(result.data, preview, appliedAt);
assert.deepEqual(reapplied.data.items.Helmet.locations, ['Warehouse', 'Factory'],
    'Applying the preview twice remains idempotent');

assert.throws(
    () => applyPatchPreview(createFixture(), { ...preview, basePatchVersion: '0.9' }, appliedAt),
    /expects API patch 0.9/
);

assert.throws(
    () => applyPatchPreview(createFixture(), {
        ...preview,
        items: { Missing: { stats: { attackPower: 1 } } }
    }, appliedAt),
    /Preview item not found/
);

console.log('Validated reusable upcoming-patch preview overrides.');
