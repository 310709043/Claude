"""
Rebuild public/ui/*.png from the deck's product shots.

The deck's own 調整注記 asks for the former vendor branding in these
screenshots to be replaced, and the customer's updated slide 35 confirms the
product now ships with the Taiwan Mobile mark in its header. So each shot gets
the vendor name in its header replaced by the TWM mark + TAIPBX, and the
"AICC-X 客服系統" string in its status bar replaced too.

    unzip -q deck.pptx 'ppt/media/*' -d extracted
    python3 scripts/rebrand-shots.py extracted/ppt/media Inter-Bold.ttf NotoSansTC-Regular.otf

Inter and Noto Sans TC are needed as .ttf/.otf because Pillow cannot read the
.woff2 files the film itself bundles.
"""
import os
import sys
from collections import Counter

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = sys.argv[1] if len(sys.argv) > 1 else '.'
INTER = sys.argv[2] if len(sys.argv) > 2 else 'Inter-Bold.ttf'
NOTO = sys.argv[3] if len(sys.argv) > 3 else 'NotoSansTC-Regular.otf'
OUT = os.path.join(ROOT, 'public/ui') + os.sep
MARK = os.path.join(ROOT, 'public/brand/twm-mark.png')

os.makedirs(OUT, exist_ok=True)

JOBS = [
    # src, out, header brand rect (rel), has "AICC-X ..." status string
    ('image71.png', 'agent-status.png',      (0.000, 0.000, 0.064, 0.052), False),
    ('image73.png', 'customer-ivr.png',      (0.000, 0.000, 0.046, 0.052), False),
    ('image76.png', 'chat-inbound.png',      (0.000, 0.000, 0.066, 0.052), False),
    ('image77.png', 'customer-journey.png',  (0.000, 0.000, 0.046, 0.052), False),
    ('image79.png', 'service-record.png',    (0.000, 0.000, 0.064, 0.052), False),
    ('image89.png', 'outbound-config.png',   (0.000, 0.000, 0.064, 0.050), False),
    ('image91.png', 'outbound-preview.png',  (0.000, 0.000, 0.046, 0.055), False),
    ('image93.png', 'ai-copilot.png',        None,                          True),
    ('image94.png', 'ai-quality.png',        (0.000, 0.000, 0.050, 0.052), True),
]


def modal(img, box):
    return Counter(img.crop(box).convert('RGB').getdata()).most_common(1)[0][0]


def ink(bg):
    lum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2]
    return (244, 247, 251) if lum < 140 else (26, 30, 38)


def last_text_run(img, box, bg, min_gap, thresh=70):
    """
    Tight bbox of the right-most text run inside `box`.

    The vendor string sits at the right end of the status bar's left half, so
    segmenting the band into runs and taking the last one finds it without
    hard-coding an x per build (it lands in a different place in each).
    """
    a = np.asarray(img.crop(box).convert('RGB')).astype(np.int16)
    mask = np.abs(a - np.array(bg)).sum(axis=2) > thresh
    cols = mask.any(axis=0)
    runs, start, gap = [], None, 0
    for x, on in enumerate(cols):
        if on:
            if start is None:
                start = x
            gap = 0
        elif start is not None:
            gap += 1
            if gap >= min_gap:
                runs.append((start, x - gap))
                start = None
    if start is not None:
        runs.append((start, len(cols) - 1))
    if not runs:
        return None
    x0, x1 = runs[-1]
    rows = np.nonzero(mask[:, x0:x1 + 1].any(axis=1))[0]
    return (box[0] + x0, box[1] + rows.min(), box[0] + x1 + 1, box[1] + rows.max() + 1)


for src, dst, hrect, has_status in JOBS:
    im = Image.open(os.path.join(MEDIA, src)).convert('RGB')
    W, H = im.size
    d = ImageDraw.Draw(im)

    if hrect:
        x0, y0, x1, y1 = (int(hrect[0] * W), int(hrect[1] * H),
                          int(hrect[2] * W), int(hrect[3] * H))
        bg = modal(im, (x0, y0, x1, y1))
        d.rectangle([x0, y0, x1, y1], fill=bg)

        boxh = y1 - y0
        pad = int(W * 0.009)
        avail = (x1 - pad) - pad

        # Fit mark + wordmark into the footprint the vendor name occupied, so
        # the patch never spills into live UI sitting beside it.
        def lockup(scale):
            mh = max(10, int(boxh * 0.60 * scale))
            fnt = ImageFont.truetype(INTER, max(9, int(boxh * 0.40 * scale)))
            gap = max(4, int(boxh * 0.22 * scale))
            tw = int(d.textlength('TAIPBX', font=fnt))
            return mh, fnt, gap, mh + gap + tw

        scale = 1.0
        mark_h, font, gap, total = lockup(scale)
        while total > avail and scale > 0.45:
            scale -= 0.04
            mark_h, font, gap, total = lockup(scale)

        mark = Image.open(MARK).convert('RGBA').resize((mark_h, mark_h), Image.LANCZOS)
        im.paste(mark, (pad, y0 + (boxh - mark_h) // 2), mark)
        d.text((pad + mark_h + gap, y0 + boxh * 0.5),
               'TAIPBX', font=font, fill=ink(bg), anchor='lm')
        print(f'  {dst}: header lockup {total}px in {avail}px (scale {scale:.2f})')

    if has_status:
        # "AICC-X 客服系統 — 就緒中" in the status bar. It lands at a different
        # x in each build, so locate it rather than hard-coding a rect.
        band = (0, int(H * 0.955), int(W * 0.55), H)
        bg = modal(im, band)
        bb = last_text_run(im, band, bg, min_gap=int(W * 0.006))
        if bb:
            pad = max(3, int(H * 0.004))
            d.rectangle([bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad], fill=bg)
            # Match the run's own cap height so the replacement sits in the bar
            # exactly as the original did.
            f = ImageFont.truetype(NOTO, max(11, int((bb[3] - bb[1]) * 1.22)))
            d.text((bb[0], (bb[1] + bb[3]) / 2), 'TAIPBX 客服系統 — 就緒中',
                   font=f, fill=(120, 126, 138), anchor='lm')
            print(f'  {dst}: status run {bb} h={bb[3] - bb[1]}')
        else:
            raise SystemExit(f'{dst}: status text not found')

    if W > 2000:
        im = im.resize((2000, round(H * 2000 / W)), Image.LANCZOS)
    im.save(OUT + dst, optimize=True)
    print(dst, im.size)
