"""Import item passive associations from the maintainer workbook.

Usage:
    python scripts/import-item-passives.py "path/to/ER Item Passives.xlsx"

The generated JSON uses canonical English item names from docs/data.json while
preserving the workbook's passive names and Korean translations.
"""

import argparse
import json
import re
import unicodedata
from collections import OrderedDict
from pathlib import Path

import pandas as pd


MANUAL_ITEM_NAME_CORRECTIONS = {
    "Reveng of Goujian": "Revenge of Goujian",
    "Vultur's Eye": "Vulture's Eye",
    "Fragrach": "Fragarach",
}


def normalized_name(value):
    decomposed = unicodedata.normalize("NFKD", str(value))
    without_marks = "".join(character for character in decomposed if not unicodedata.combining(character))
    return re.sub(r"[^a-z0-9]", "", without_marks.casefold())


def load_canonical_item_names(data_path):
    data = json.loads(data_path.read_text(encoding="utf-8"))
    names = list(data["items"])
    normalized = {}
    for name in names:
        normalized.setdefault(normalized_name(name), []).append(name)
    return set(names), normalized


def resolve_item_name(workbook_name, canonical_names, normalized_names):
    corrected = MANUAL_ITEM_NAME_CORRECTIONS.get(workbook_name, workbook_name)
    if corrected in canonical_names:
        return corrected

    matches = normalized_names.get(normalized_name(corrected), [])
    if len(matches) == 1:
        return matches[0]
    if not matches:
        raise ValueError(f"Workbook item is missing from docs/data.json: {workbook_name!r}")
    raise ValueError(f"Workbook item name is ambiguous: {workbook_name!r} -> {matches}")


def import_passives(workbook_path, data_path):
    canonical_names, normalized_names = load_canonical_item_names(data_path)
    item_passives = OrderedDict()
    translations = {}

    workbook = pd.ExcelFile(workbook_path)
    for sheet_name in workbook.sheet_names:
        rows = pd.read_excel(workbook_path, sheet_name=sheet_name, header=None, dtype=object)
        current_item = None
        for item_value, passive_value, korean_value, *_ in rows.itertuples(index=False, name=None):
            if pd.notna(item_value):
                current_item = str(item_value).strip()
            if not current_item or pd.isna(passive_value) or pd.isna(korean_value):
                continue

            passive_name = str(passive_value).strip()
            passive_name_ko = str(korean_value).strip()
            if passive_name == "English" and passive_name_ko == "Korean":
                continue

            existing_translation = translations.get(passive_name)
            if existing_translation and existing_translation != passive_name_ko:
                raise ValueError(
                    f"Conflicting Korean translations for {passive_name!r}: "
                    f"{existing_translation!r} and {passive_name_ko!r}"
                )
            translations[passive_name] = passive_name_ko

            canonical_name = resolve_item_name(current_item, canonical_names, normalized_names)
            passive = {"name": passive_name, "nameKo": passive_name_ko}
            passives = item_passives.setdefault(canonical_name, [])
            if passive not in passives:
                passives.append(passive)

    return item_passives


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    parser.add_argument("--data", type=Path, default=Path("docs/data.json"))
    parser.add_argument("--output", type=Path, default=Path("item-passives.json"))
    args = parser.parse_args()

    item_passives = import_passives(args.workbook, args.data)
    association_count = sum(len(passives) for passives in item_passives.values())
    multi_passive_count = sum(len(passives) > 1 for passives in item_passives.values())

    args.output.write_text(
        json.dumps(item_passives, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {len(item_passives)} items, {association_count} passive associations, "
        f"and {multi_passive_count} multi-passive items to {args.output}"
    )


if __name__ == "__main__":
    main()
