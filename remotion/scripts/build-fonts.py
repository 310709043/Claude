#!/usr/bin/env python3
"""
Build self-hosted, subsetted webfonts for the AICC intro video.

Google's CJK webfonts ship as ~105 unicode-range chunks per weight, which means
hundreds of network requests during a render. Instead we download the full TTFs
once and subset them down to exactly the glyphs the video uses, so rendering is
offline, deterministic and fast.

Usage:  python3 scripts/build-fonts.py
Output: public/fonts/*.woff2
"""

from __future__ import annotations

import pathlib
import re
import subprocess
import sys
import tempfile
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT = ROOT / "public" / "fonts"

UA_MODERN = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)
# Requesting the stylesheet without a browser UA makes the Google Fonts API hand
# back plain TTFs instead of unicode-range-split woff2 chunks.
UA_PLAIN = "python-urllib"

FAMILIES = [
    ("Noto Sans TC", "NotoSansTC", [400, 500, 700, 900]),
    ("Sora", "Sora", [400, 600, 800]),
]

# Always keep these, whether or not they appear in the source today.
EXTRA_CHARS = (
    "".join(chr(c) for c in range(0x20, 0x7F))
    + "0123456789"
    + "。，、；：？！…—～·「」『』（）〈〉《》【】"
    + "／＼％＋－＝＜＞＆＊＃＠"
    + "①②③④⑤⑥⑦⑧⑨⑩"
    + "→←↑↓⇄⇆★☆●○▲■□◆✓✕"
    + "×·’‘“”"
)


def collect_charset() -> set[str]:
    chars: set[str] = set(EXTRA_CHARS)
    for path in sorted(SRC.rglob("*.ts")) + sorted(SRC.rglob("*.tsx")):
        chars.update(path.read_text(encoding="utf-8"))
    # Drop control characters — pyftsubset chokes on them and they render nothing.
    return {c for c in chars if ord(c) >= 0x20 and c not in "﻿"}


def google_css(family: str, weights: list[int], user_agent: str) -> str:
    spec = f"{family.replace(' ', '+')}:wght@{';'.join(str(w) for w in weights)}"
    url = f"https://fonts.googleapis.com/css2?family={spec}&display=swap"
    req = urllib.request.Request(url, headers={"User-Agent": user_agent})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8")


def parse_faces(css: str) -> dict[int, str]:
    """Map font-weight -> source URL for each @font-face block."""
    faces: dict[int, str] = {}
    for block in css.split("@font-face")[1:]:
        weight = re.search(r"font-weight:\s*(\d+)", block)
        src = re.search(r"src:\s*url\((https://[^)]+)\)", block)
        if weight and src:
            faces[int(weight.group(1))] = src.group(1)
    return faces


def main() -> int:
    charset = collect_charset()
    unicodes = ",".join(f"U+{ord(c):04X}" for c in sorted(charset))
    print(f"charset: {len(charset)} unique characters")

    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp = pathlib.Path(tmpdir)
        for family, slug, weights in FAMILIES:
            faces = parse_faces(google_css(family, weights, UA_PLAIN))
            for weight in weights:
                url = faces.get(weight)
                if url is None:
                    print(f"!! no @font-face for {family} {weight}", file=sys.stderr)
                    return 1
                raw = tmp / f"{slug}-{weight}.ttf"
                req = urllib.request.Request(url, headers={"User-Agent": UA_MODERN})
                with urllib.request.urlopen(req, timeout=180) as resp:
                    raw.write_bytes(resp.read())

                dest = OUT / f"{slug}-{weight}.woff2"
                subprocess.run(
                    [
                        sys.executable, "-m", "fontTools.subset", str(raw),
                        f"--unicodes={unicodes}",
                        "--layout-features=kern,liga,clig,calt,vert,vrt2",
                        "--flavor=woff2",
                        "--desubroutinize",
                        "--no-hinting",
                        f"--output-file={dest}",
                    ],
                    check=True,
                )
                print(f"  {dest.relative_to(ROOT)}  "
                      f"{raw.stat().st_size // 1024} KB -> {dest.stat().st_size // 1024} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
