"""Prepare the cat photos for the easter-egg gallery.

Drop original photos in photos/cats/<cat>/ (cat = coquelicot, puff or
ensemble), then run `pnpm run cats`. For each photo this:
  - applies the EXIF orientation, then drops ALL metadata (GPS included);
  - writes <name>.webp (long side 1600 px) and <name>.thumb.webp (480 px wide)
    to app/assets/cats/<cat>/, where the gallery picks them up automatically;
  - removes generated files whose original is gone.
photos/ is git-ignored: originals (with their GPS) never get committed.
Requires Python 3 + Pillow (pip install Pillow). HEIC is not supported:
export iPhone photos as JPEG first.
"""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos" / "cats"
OUT = ROOT / "app" / "assets" / "cats"
CATS = ("coquelicot", "puff", "ensemble")
EXTS = {".jpg", ".jpeg", ".png", ".webp"}
FULL_LONG_SIDE = 1600
THUMB_WIDTH = 480


def slug(stem):
    keep = "".join(c.lower() if c.isalnum() else "-" for c in stem)
    return "-".join(p for p in keep.split("-") if p)


def save(im, path, quality):
    # A fresh save without `exif=` writes no metadata at all.
    im.save(path, "WEBP", quality=quality, method=6)


def main():
    total = 0
    for cat in CATS:
        src_dir, out_dir = SRC / cat, OUT / cat
        src_dir.mkdir(parents=True, exist_ok=True)
        out_dir.mkdir(parents=True, exist_ok=True)
        wanted = set()
        for photo in sorted(src_dir.iterdir()):
            if photo.suffix.lower() not in EXTS:
                continue
            name = slug(photo.stem)
            full, thumb = out_dir / f"{name}.webp", out_dir / f"{name}.thumb.webp"
            wanted |= {full.name, thumb.name}
            if full.exists() and thumb.exists() and full.stat().st_mtime >= photo.stat().st_mtime:
                continue
            with Image.open(photo) as im:
                im = ImageOps.exif_transpose(im).convert("RGB")
                big = im.copy()
                big.thumbnail((FULL_LONG_SIDE, FULL_LONG_SIDE), Image.LANCZOS)
                save(big, full, 80)
                small = im.copy()
                small.thumbnail((THUMB_WIDTH, THUMB_WIDTH * 4), Image.LANCZOS)
                save(small, thumb, 72)
            total += 1
            print(f"  {cat}/{photo.name} -> {full.name} ({big.width}x{big.height}), {thumb.name}")
        for stale in out_dir.glob("*.webp"):
            if stale.name not in wanted:
                stale.unlink()
                print(f"  removed {cat}/{stale.name}")
    print(f"{total} photo(s) processed.")


if __name__ == "__main__":
    main()
