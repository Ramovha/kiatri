#!/usr/bin/env python3
"""Convert the supplied screenshots to WebP at 1x and 2x.

Reads   public/images/<folder>/<name>.png       (folders: app, portal)
Writes  public/images/<folder>/<name>-1x.webp, <name>-2x.webp (each <= 150 KB)
        public/images/<folder>/manifest.json (pixel sizes, used to reserve
        space so the page doesn't shift while images load)

Run after adding or replacing a screenshot:  python3 scripts/optimize-app-images.py
The pages fall back to original illustrations for any image not in a manifest.
"""
import io, json, os, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
MAX_BYTES = 150 * 1024
# folder -> {name: 1x display width in px (2x is double)}
FOLDERS = {
    'app': {
        'desktop-app': 640,
        'mobile-dialer': 260,
        'mobile-call-history': 260,
        'mobile-incoming-call': 260,
    },
    'portal': {
        'portal-dashboard': 640,
        'portal-login': 640,
    },
}

def encode(img, width):
    w = min(width, img.width)
    h = round(img.height * w / img.width)
    resized = img.resize((w, h), Image.LANCZOS)
    for quality in range(88, 30, -6):
        buf = io.BytesIO()
        resized.save(buf, 'WEBP', quality=quality, method=6)
        if buf.tell() <= MAX_BYTES:
            return buf.getvalue(), w, h
    # Still too big: shrink until it fits.
    return encode(img, int(width * 0.85))

for folder, targets in FOLDERS.items():
    directory = os.path.join(ROOT, folder)
    manifest = {}
    for name, base in targets.items():
        src = os.path.join(directory, name + '.png')
        if not os.path.exists(src):
            print('skip (not supplied):', folder + '/' + name)
            continue
        img = Image.open(src).convert('RGB')
        entry = {}
        for scale in (1, 2):
            data, w, h = encode(img, base * scale)
            open(os.path.join(directory, f'{name}-{scale}x.webp'), 'wb').write(data)
            entry[f'{scale}x'] = {'width': w, 'height': h, 'kb': round(len(data) / 1024)}
            print(f'{folder}/{name}-{scale}x.webp  {w}x{h}  {len(data)//1024} KB')
        manifest[name] = entry
    if manifest:
        json.dump(manifest, open(os.path.join(directory, 'manifest.json'), 'w'), indent=2)
