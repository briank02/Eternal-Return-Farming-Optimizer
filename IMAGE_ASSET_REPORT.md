# Image Asset Migration Report

The imported image library has been reconciled against `docs/data.json` and moved into the production image structure under `docs/images`.

## Results

- 798 PNG assets organized.
- 614 equipment images, 63 material images, 91 character portraits, 23 weapon-type icons, and 7 general UI images.
- 56 filenames corrected to current canonical item names.
- 87 character portraits converted from mislabeled WebP files to genuine PNG files without resizing.
- 4 item images converted from mislabeled 128x71 WebP files and upscaled to 256x142 with Lanczos scaling.
- All 91 characters have a matching portrait.
- Every equipment item in `docs/data.json` resolves to an image.
- Crimson and Dawn Mythic variants intentionally reuse their base Mythic item image.

## Preserved assets outside current data

`Viper.png` and `Crown of Buds.png` are preserved even though the current API data does not expose matching equipment entries.

The following special materials are also preserved despite being omitted from `docs/data.json` by the current base-item filtering rules:

- Chalk
- Crimson Shard
- Dawnlight Shard
- Force Core
- Gem of Evolution
- Laser Pointer
- Leather
- Magazine
- Meteorite
- Mythril
- Tac. Skill Module
- Tree of Life
- VF Blood Sample

## Validation

Run:

```powershell
npm run assets:validate
```

The validator checks all item, character, UI, and weapon-type references; verifies every organized image has a genuine PNG signature; rejects numeric filename prefixes; and detects any remaining 128x71 assets.
