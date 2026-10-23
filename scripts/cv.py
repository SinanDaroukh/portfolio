"""Update the CV from a LinkedIn data export.

1. LinkedIn > Settings > Data privacy > "Get a copy of your data".
2. Drop the ZIP it emails you (or its extracted CSV files) in linkedin/.
3. Run `pnpm run cv`.

This writes app/data/cv/linkedin.json (the CV in your profile's language,
French by default) and refreshes app/data/cv/translations.en.json: every text
gets an English entry; new or changed texts are listed so they can be
translated (until then the site shows the French text). linkedin/ is
git-ignored: the export holds personal data you don't want committed.

Options: --input <dir|zip>  --out <dir>  --dry-run
Python 3 standard library only.
"""
import argparse
import csv
import io
import json
import re
import sys
import unicodedata
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_INPUT = ROOT / "linkedin"
DEFAULT_OUT = ROOT / "app" / "data" / "cv"
SOURCE_LANG = "fr"

SECTION_FILES = {
    "profile": "Profile.csv",
    "positions": "Positions.csv",
    "education": "Education.csv",
    "certifications": "Certifications.csv",
    "skills": "Skills.csv",
    "languages": "Languages.csv",
}

PROFICIENCY = {
    "native or bilingual proficiency": "native",
    "full professional proficiency": "full",
    "professional working proficiency": "professional",
    "limited working proficiency": "limited",
    "elementary proficiency": "elementary",
}


def slug(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "x"


def year(value):
    m = re.search(r"\d{4}", value or "")
    return m.group(0) if m else None


def restore_breaks(text):
    """LinkedIn's export drops line breaks in free text, gluing sentences and
    list items together ("…juste.J'interviens", "missions :🧭 Réfléchir").
    Put a line break back wherever . ! ? : … is directly followed by an
    uppercase letter or an emoji/symbol. Text that kept its breaks is unchanged."""
    out = []
    for i, ch in enumerate(text):
        out.append(ch)
        nxt = text[i + 1] if i + 1 < len(text) else ""
        if ch in ".!?:…" and nxt and not nxt.isspace():
            symbol = unicodedata.category(nxt) in ("So", "Sk")
            if nxt.isupper() or symbol:
                out.append("\n")
    return "".join(out)


# ---------------------------------------------------------------- reading
class Export:
    """CSV files of a LinkedIn export, from a ZIP or a folder (searched recursively)."""

    def __init__(self, path):
        self.files = {}
        zips = [path] if path.suffix == ".zip" else sorted(path.glob("*.zip"), key=lambda p: p.stat().st_mtime)
        if zips:
            with zipfile.ZipFile(zips[-1]) as z:
                for name in z.namelist():
                    if name.lower().endswith(".csv"):
                        self.files[Path(name).name.lower()] = z.read(name).decode("utf-8-sig")
            self.source = zips[-1].name
        else:
            for p in path.rglob("*.csv"):
                self.files[p.name.lower()] = p.read_text(encoding="utf-8-sig")
            self.source = str(path)
        if not self.files:
            sys.exit(f"No LinkedIn export found in {path} (expected a .zip or .csv files).")

    def has(self, name):
        return name.lower() in self.files

    def rows(self, name, required):
        """Rows of <name>.csv as dicts. Skips any 'Notes' preamble before the header."""
        text = self.files.get(name.lower())
        if text is None:
            return []
        lines = text.splitlines()
        start = next((i for i, l in enumerate(lines) if all(col in l for col in required)), None)
        if start is None:
            print(f"  ! {name}: header not recognised, skipped")
            return []
        reader = csv.DictReader(io.StringIO("\n".join(lines[start:])))
        return [{k.strip(): (v or "").strip() for k, v in row.items() if k} for row in reader]


def unique(base, seen):
    key, n = base, 2
    while key in seen:
        key, n = f"{base}-{n}", n + 1
    seen.add(key)
    return key


def build(export):
    profile_rows = export.rows("Profile.csv", ["First Name", "Last Name"])
    p = profile_rows[0] if profile_rows else {}
    cv = {
        "lang": SOURCE_LANG,
        "profile": {
            "name": f"{p.get('First Name', '')} {p.get('Last Name', '').upper()}".strip(),
            "headline": p.get("Headline", ""),
            "summary": restore_breaks(p.get("Summary", "")),
            "location": p.get("Geo Location", ""),
        },
        "positions": [],
        "education": [],
        "certifications": [],
        "skills": [],
        "languages": [],
    }
    seen = set()
    for r in export.rows("Positions.csv", ["Company Name", "Title"]):
        start = year(r.get("Started On"))
        cv["positions"].append({
            "id": unique(f"{slug(r['Company Name'])}-{start or 'x'}", seen),
            "company": r["Company Name"],
            "title": r.get("Title", ""),
            "location": r.get("Location", ""),
            "start": start,
            "end": year(r.get("Finished On")),
            "description": restore_breaks(r.get("Description", "")),
        })
    cv["positions"].sort(key=lambda e: e["start"] or "", reverse=True)
    seen = set()
    for r in export.rows("Education.csv", ["School Name"]):
        start = year(r.get("Start Date"))
        cv["education"].append({
            "id": unique(f"{slug(r['School Name'])}-{start or 'x'}", seen),
            "school": r["School Name"],
            "degree": r.get("Degree Name", ""),
            "start": start,
            "end": year(r.get("End Date")),
        })
    cv["education"].sort(key=lambda e: e["start"] or "", reverse=True)
    seen = set()
    for r in export.rows("Certifications.csv", ["Name"]):
        cv["certifications"].append({
            "id": unique(slug(r["Name"]), seen),
            "name": r["Name"],
            "authority": r.get("Authority", ""),
        })
    cv["skills"] = [r["Name"] for r in export.rows("Skills.csv", ["Name"]) if r.get("Name")]
    seen = set()
    for r in export.rows("Languages.csv", ["Name"]):
        level = PROFICIENCY.get(r.get("Proficiency", "").lower(), "")
        cv["languages"].append({"id": unique(slug(r["Name"]), seen), "name": r["Name"], "proficiency": level})
    return cv


# ---------------------------------------------------------------- translations
def translatable(cv):
    """Every source-language text the site shows, keyed by a stable id.
    (The profile summary is kept in linkedin.json but not shown, so not translated.)"""
    t = {
        "profile.headline": cv["profile"]["headline"],
        "profile.location": cv["profile"]["location"],
    }
    for e in cv["positions"]:
        t[f"positions.{e['id']}.title"] = e["title"]
        t[f"positions.{e['id']}.location"] = e["location"]
        t[f"positions.{e['id']}.description"] = e["description"]
    for e in cv["education"]:
        t[f"education.{e['id']}.degree"] = e["degree"]
        t[f"education.{e['id']}.school"] = e["school"]
    for s in cv["skills"]:
        t[f"skills.{slug(s)}"] = s
    for l in cv["languages"]:
        t[f"languages.{l['id']}.name"] = l["name"]
    return {k: v for k, v in t.items() if v}


def merge_translations(old, texts):
    """Keep translations whose source text is unchanged; flag the others.
    An entry is to do while its text is empty ("new") or marked stale
    ("changed": the source moved on; the old translation is kept as a draft).
    Clear "stale" by hand once the translation is updated."""
    new, todo = {}, []
    for key, source in texts.items():
        entry = old.get(key) or {}
        if entry.get("source") == source:
            new[key] = entry
        else:
            new[key] = {"source": source, "text": entry.get("text", "")}
            if new[key]["text"]:
                new[key]["stale"] = True
        if not new[key].get("text"):
            todo.append(("new", key))
        elif new[key].get("stale"):
            todo.append(("changed", key))
    removed = sorted(set(old) - set(new))
    return new, todo, removed


# ---------------------------------------------------------------- report
def diff(old, new):
    lines = []
    for section, label in (("positions", "company"), ("education", "school"), ("certifications", "name")):
        before = {e["id"]: e for e in old.get(section, [])}
        after = {e["id"]: e for e in new[section]}
        for k in after.keys() - before.keys():
            lines.append(f"  + {section}: {after[k][label]}")
        for k in before.keys() - after.keys():
            lines.append(f"  - {section}: {before[k][label]}")
        for k in after.keys() & before.keys():
            if after[k] != before[k]:
                fields = [f for f in after[k] if after[k][f] != before[k].get(f)]
                lines.append(f"  ~ {section}: {after[k][label]} ({', '.join(fields)})")
    for section in ("skills",):
        for s in sorted(set(new[section]) - set(old.get(section, []))):
            lines.append(f"  + {section}: {s}")
        for s in sorted(set(old.get(section, [])) - set(new[section])):
            lines.append(f"  - {section}: {s}")
    if old.get("profile") != new["profile"]:
        fields = [f for f in new["profile"] if new["profile"][f] != old.get("profile", {}).get(f)]
        lines.append(f"  ~ profile ({', '.join(fields)})")
    return lines


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    args.input.mkdir(exist_ok=True) if args.input == DEFAULT_INPUT else None
    export = Export(args.input)
    cv = build(export)
    print(f"Read {export.source}: {len(cv['positions'])} positions, {len(cv['education'])} education, "
          f"{len(cv['certifications'])} certifications, {len(cv['skills'])} skills, {len(cv['languages'])} languages")

    cv_path = args.out / "linkedin.json"
    tr_path = args.out / "translations.en.json"
    old_cv = json.loads(cv_path.read_text(encoding="utf-8")) if cv_path.exists() else {}
    old_tr = json.loads(tr_path.read_text(encoding="utf-8")) if tr_path.exists() else {}

    # LinkedIn can send a partial archive first (sometimes just Profile.csv):
    # a section whose file is absent keeps its previous content, not emptied.
    kept = [section for section, name in SECTION_FILES.items() if not export.has(name) and section in old_cv]
    for section in kept:
        cv[section] = old_cv[section]
    if kept:
        print(f"  ! not in this archive, kept from the previous import: {', '.join(kept)}")
    changes = diff(old_cv, cv)
    translations, todo, removed = merge_translations(old_tr, translatable(cv))

    print("\nChanges since the last import:" if changes else "\nNo change since the last import.")
    print("\n".join(changes))
    if todo:
        print(f"\nEnglish translations to do ({len(todo)}) in {tr_path.relative_to(ROOT) if tr_path.is_relative_to(ROOT) else tr_path}:")
        for kind, key in todo:
            print(f"  [{kind}] {key}: {translations[key]['source'][:70]!r}")
    if removed:
        print(f"\nDropped {len(removed)} translation(s) no longer used: {', '.join(removed)}")

    if args.dry_run:
        print("\n--dry-run: nothing written.")
        return
    args.out.mkdir(parents=True, exist_ok=True)
    cv_path.write_text(json.dumps(cv, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tr_path.write_text(json.dumps(translations, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nWrote {cv_path.name} and {tr_path.name}.")


if __name__ == "__main__":
    main()
