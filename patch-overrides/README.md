# Upcoming Patch Preview Overrides

This directory provides a small, temporary layer for patch notes released before
the official Eternal Return API is updated. It does not replace or modify the
normal API import.

## Normal and preview builds

- `npm run build:data` rebuilds `docs/data.json` using only official API data.
- `npm run build:data:preview` performs a fresh official build and then applies
  `active.json`.

The preview build stores the patch number separately from its preview flag, so the
website can localize the preview label, and records the API patch used as its base.
The preview will fail if `basePatchVersion` does not match the generated data,
which prevents an old override from being applied to a newer API dataset
accidentally.

## Preparing a future patch

1. Copy the shape of `template.json` into `active.json`.
2. Set `patchVersion`, `basePatchVersion`, and the official patch-notes URL.
3. Add only changes represented by this optimizer:
   - `stats`, `uniqueStats`, and `statsByLv` merge into the matching item section.
   - Set a stat to `null` to remove it.
   - `fields` replaces other top-level item fields when necessary.
   - `locations.remove` and `locations.add` adjust item availability by area.
4. Run `npm run build:data:preview` and `npm test`.

Do not manually edit generated values in `docs/data.json`.

## When the official API catches up

1. Update `DATA_PATCH_VERSION` in `build-data.js`.
2. Run `npm run build:data` without the preview layer.
3. Compare the official output with the preview changes.
4. Replace `active.json` when preparing the next announced patch. Leaving the old
   file in place is safe because normal builds never load it.
