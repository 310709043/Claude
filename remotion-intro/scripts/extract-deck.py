"""
Inventory a .pptx so a deck swap is mechanical rather than archaeology.

Prints, for every slide, its text in reading order, and an inventory of the
embedded media — dimensions, and which slides use each file. That is what
decides which images are usable product shots, which are chrome, and which
are duplicates of each other.

    python3 scripts/extract-deck.py deck.pptx [--out DIR]

With --out, the media is also unpacked there so the rebranding pass
(scripts/rebrand-shots.py) can run against it.
"""
import argparse
import os
import re
import shutil
import zipfile

AT = re.compile(r'<a:t>(.*?)</a:t>', re.S)
PARA = re.compile(r'<a:p>.*?</a:p>', re.S)
MEDIA = re.compile(r'media/(image[0-9]+\.[a-zA-Z]+)')
SLIDE_NO = re.compile(r'slide([0-9]+)\.xml$')

UNESCAPE = [('&lt;', '<'), ('&gt;', '>'), ('&quot;', '"'), ('&apos;', "'"), ('&amp;', '&')]


def untag(s):
    for a, b in UNESCAPE:
        s = s.replace(a, b)
    return s


def slide_text(xml):
    out = []
    for p in PARA.findall(xml):
        line = ''.join(AT.findall(p)).strip()
        if line:
            out.append(untag(line))
    return out


def image_size(blob, name):
    """Dimensions without a decoder dependency: PNG and JPEG headers only."""
    if blob[:8] == b'\x89PNG\r\n\x1a\n':
        return int.from_bytes(blob[16:20], 'big'), int.from_bytes(blob[20:24], 'big')
    if blob[:2] == b'\xff\xd8':
        i = 2
        while i < len(blob) - 9:
            if blob[i] != 0xFF:
                i += 1
                continue
            marker = blob[i + 1]
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB):
                return (int.from_bytes(blob[i + 7:i + 9], 'big'),
                        int.from_bytes(blob[i + 5:i + 7], 'big'))
            i += 2 + int.from_bytes(blob[i + 2:i + 4], 'big')
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pptx')
    ap.add_argument('--out', help='also unpack ppt/media here')
    args = ap.parse_args()

    with zipfile.ZipFile(args.pptx) as z:
        names = z.namelist()

        slides = sorted(
            (n for n in names if SLIDE_NO.search(n) and n.startswith('ppt/slides/')),
            key=lambda n: int(SLIDE_NO.search(n).group(1)),
        )

        # which slides reference which media, via each slide's rels
        used = {}
        for s in slides:
            no = int(SLIDE_NO.search(s).group(1))
            rels = f'ppt/slides/_rels/slide{no}.xml.rels'
            if rels in names:
                for img in MEDIA.findall(z.read(rels).decode('utf-8', 'replace')):
                    used.setdefault(img, []).append(no)

        for s in slides:
            no = int(SLIDE_NO.search(s).group(1))
            print(f'=== SLIDE {no} ===')
            for line in slide_text(z.read(s).decode('utf-8', 'replace')):
                print(line)
            print()

        print('=== MEDIA ===')
        media = sorted(n for n in names if n.startswith('ppt/media/'))
        for m in media:
            blob = z.read(m)
            base = os.path.basename(m)
            size = image_size(blob, base)
            dim = f'{size[0]}x{size[1]}' if size else '?'
            slides_using = used.get(base)
            where = (','.join(map(str, slides_using))
                     if slides_using else 'layout/master only')
            print(f'{base:18} {dim:>12} {len(blob) // 1024:>6} KB   slides: {where}')

        if args.out:
            os.makedirs(args.out, exist_ok=True)
            for m in media:
                with z.open(m) as src, open(os.path.join(args.out, os.path.basename(m)), 'wb') as dst:
                    shutil.copyfileobj(src, dst)
            print(f'\nunpacked {len(media)} media files to {args.out}')


if __name__ == '__main__':
    main()
