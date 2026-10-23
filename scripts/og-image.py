"""Generate the social preview image, the touch icon and the logo mask.

  public/og-image.png               1200x630, shown when a page is shared (Open Graph)
  public/apple-touch-icon.png       180x180, home-screen icon on iOS/Android
  public/img/logos/C9-Logo-C9Corp-mask.png 512x512, the logo's ink as alpha
                                           (white parts transparent), for a CSS
                                           mask that tints the logo (404 page)

Edit TITLE / LINES below if the headline changes, then run
`python3 scripts/og-image.py`. Requires Python 3 + Pillow.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
FONT = ROOT / "public" / "fonts" / "MuseoModerno-Regular.ttf"  # variable font, weight 100-900
LOGO = PUBLIC / "img" / "logos" / "C9-Logo.png"
LOGO_NAMED = PUBLIC / "img" / "logos" / "C9-Logo-C9Corp.png"  # with "C9 CORP." in the ring

TITLE = "Sinan Daroukh"
LINES = [
    ("Ingénieur logiciel freelance", 42, 500, (221, 221, 221)),
    ("Mobile · Web · Automatisation", 32, 400, (160, 160, 160)),
    ("Clermont-Ferrand", 32, 400, (160, 160, 160)),
]
URL = "sinan.daroukh.fr"
BG = (5, 5, 5)
ACCENT = (167, 139, 250)  # --c9-accent (dark theme)


def font(size, weight):
    f = ImageFont.truetype(str(FONT), size)
    f.set_variation_by_axes([weight])
    return f


def logo_bubble(size):
    """The C9 logo on a white disc, like the site's nav."""
    bubble = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(bubble).ellipse((0, 0, size - 1, size - 1), fill=(255, 255, 255, 255))
    inner = round(size * 0.9)
    logo = Image.open(LOGO).convert("RGBA").resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    bubble.alpha_composite(logo, (off, off))
    return bubble


def og_image():
    w, h, scale = 1200, 630, 2  # draw at 2x, downsample for clean edges
    im = Image.new("RGBA", (w * scale, h * scale), BG + (255,))
    d = ImageDraw.Draw(im)
    for y in range(12 * scale, h * scale, 24 * scale):  # the site's dot grid
        for x in range(12 * scale, w * scale, 24 * scale):
            d.rectangle((x, y, x + 2 * scale, y + 2 * scale), fill=(255, 255, 255, 22))
    s = scale
    im.alpha_composite(logo_bubble(250 * s), (96 * s, 190 * s))
    x = 420 * s
    d.text((x, 150 * s), TITLE, font=font(86 * s, 800), fill=(255, 255, 255))
    d.rectangle((x, 268 * s, x + 96 * s, 274 * s), fill=ACCENT)  # the design system's 96px rule
    y = 302 * s
    for text, size, weight, color in LINES:
        d.text((x, y), text, font=font(size * s, weight), fill=color)
        y += round(size * 1.45) * s
    url_font = font(26 * s, 500)
    tw = d.textlength(URL, font=url_font)
    d.text((w * s - 64 * s - tw, h * s - 72 * s), URL, font=url_font, fill=(138, 138, 138))
    im.resize((w, h), Image.LANCZOS).convert("RGB").save(PUBLIC / "og-image.png", optimize=True)


def touch_icon():
    icon = Image.new("RGBA", (180, 180), (255, 255, 255, 255))
    logo = Image.open(LOGO).convert("RGBA").resize((150, 150), Image.LANCZOS)
    icon.alpha_composite(logo, (15, 15))
    icon.convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)


def logo_mask(src):
    """Ink → opaque, paper → transparent, so CSS can tint the logo any colour."""
    logo = Image.open(src).convert("RGBA").resize((512, 512), Image.LANCZOS)
    r, g, b, a = logo.split()
    ink = Image.eval(logo.convert("L"), lambda v: 255 - v)
    alpha = Image.composite(ink, Image.new("L", logo.size, 0), a)
    mask = Image.new("RGBA", logo.size, (0, 0, 0, 0))
    mask.putalpha(alpha)
    mask.save(src.with_name(src.stem + "-mask.png"), optimize=True)


if __name__ == "__main__":
    og_image()
    touch_icon()
    logo_mask(LOGO_NAMED)
    print("wrote public/og-image.png, public/apple-touch-icon.png and public/img/logos/C9-Logo-C9Corp-mask.png")
