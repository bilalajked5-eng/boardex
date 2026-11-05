#!/usr/bin/env python3
"""Derives demonstration photography from CLIENT-SUPPLIED assets only:
 - the buffet photograph on page 2 of Plum_B2B-Catalogue-2026.pdf (crops)
 - the 76 product cut-outs from the same catalogue (collages on soft studio backgrounds)
 - the plum watercolour cover texture (page 1) for dark panels
No stock imagery is used. Output: src/assets/images/photos/*.jpg + media-manifest.json src fields.
Usage: python3 src/build/make-photos.py <extracted-raw-dir>   (dir with img-000.png, img-001.png)
"""
import json, os, sys, random, math
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = sys.argv[1]
OUT = os.path.join(ROOT, 'src/assets/images/photos'); os.makedirs(OUT, exist_ok=True)
PROD = os.path.join(ROOT, 'src/assets/images/products')
random.seed(7)

buffet = Image.open(os.path.join(RAW, 'img-001.png')).convert('RGB')
buffet = ImageEnhance.Brightness(buffet).enhance(1.18); buffet = ImageEnhance.Contrast(buffet).enhance(1.08); buffet = ImageEnhance.Color(buffet).enhance(1.08)
cover = Image.open(os.path.join(RAW, 'img-000.png')).convert('RGB')
BW, BH = buffet.size

def save(img, name, q=82):
    img.convert('RGB').save(os.path.join(OUT, f'{name}.jpg'), 'JPEG', quality=q, optimize=True, progressive=True)
    return img.size

def crop_fit(img, w, h, fx=0.5, fy=0.5, zoom=1.0):
    """Crop a w:h region from img centred at (fx,fy) fractions, scaled so it covers, then resize."""
    iw, ih = img.size
    scale = max(w / iw, h / ih) * zoom
    cw, ch = w / scale, h / scale
    cx, cy = iw * fx, ih * fy
    x0 = min(max(0, cx - cw / 2), iw - cw); y0 = min(max(0, cy - ch / 2), ih - ch)
    return img.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((w, h), Image.LANCZOS)

def studio_bg(w, h, tone='warm'):
    a, b = {'warm': ((252, 250, 246), (238, 233, 224)), 'cool': ((250, 249, 247), (229, 224, 218)), 'plum': ((246, 241, 245), (226, 214, 224))}[tone]
    bg = Image.new('RGB', (w, h), a); d = ImageDraw.Draw(bg)
    for y in range(h):
        t = y / h
        d.line([(0, y), (w, y)], fill=tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3)))
    # soft vignette light spot
    spot = Image.new('L', (w, h), 0); sd = ImageDraw.Draw(spot)
    sd.ellipse((w * 0.15, -h * 0.3, w * 0.85, h * 0.7), fill=90)
    spot = spot.filter(ImageFilter.GaussianBlur(w / 6))
    bg = Image.composite(Image.new('RGB', (w, h), (255, 255, 255)), bg, spot)
    return bg

def key_white(im, thresh=238):
    """Flood-fill near-white from the borders to transparent (cake cut-outs carry a white studio background)."""
    from PIL import ImageDraw as _D
    rgb = im.convert('RGB'); a = im.split()[3]
    if a.getextrema()[0] < 250:  # already has transparency
        return im
    mask = Image.new('L', im.size, 0)
    w, h = im.size
    # start fill from the four corners + edge midpoints
    px = rgb.load(); seen = mask.load()
    stack = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or seen[x, y]: continue
        r, g, b = px[x, y]
        if min(r, g, b) < thresh: continue
        seen[x, y] = 255
        stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    mask = mask.filter(ImageFilter.GaussianBlur(1.2))
    alpha = mask.point(lambda v: 255 - v)
    out = im.copy(); out.putalpha(alpha)
    return out

def prod(slug):
    return key_white(Image.open(os.path.join(PROD, f'{slug}.webp')).convert('RGBA'))

def shadowed(im, blur=28, dy=18, alpha=90):
    pad = blur * 3
    canvas = Image.new('RGBA', (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    sh = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    mask = im.split()[3].point(lambda v: min(255, int(v * alpha / 255)))
    sh.paste((40, 25, 40, 255), (pad, pad + dy), mask)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(sh); canvas.alpha_composite(im, (pad, pad))
    return canvas

def collage(slugs, w, h, tone='warm', scale=0.62, spread=0.78, rot=6):
    bg = studio_bg(w, h, tone).convert('RGBA')
    n = len(slugs)
    for i, s in enumerate(slugs):
        im = prod(s)
        bb = im.split()[3].getbbox() or im.getbbox(); im = im.crop(bb)
        target = int(min(w, h) * scale * (1.15 if n == 1 else 0.95 if n <= 3 else 0.8))
        im.thumbnail((target, target), Image.LANCZOS)
        im = im.rotate(random.uniform(-rot, rot), expand=True, resample=Image.BICUBIC)
        im = shadowed(im)
        if n == 1: cx, cy = w / 2, h / 2
        else:
            ang = -math.pi / 2 + i * 2 * math.pi / n
            cx = w / 2 + math.cos(ang) * w * spread / 2 * 0.62; cy = h / 2 + math.sin(ang) * h * spread / 2 * 0.62
        bg.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))
    return bg

photos = {}
def add(id_, img, name=None):
    name = name or id_
    size = save(img, name)
    photos[id_] = {'src': f'/assets/images/photos/{name}.jpg', 'width': size[0], 'height': size[1]}

# --- Buffet crops (hero & hospitality)
add('hero-poster', crop_fit(buffet, 1920, 1080, 0.55, 0.55))
add('corp-hero', crop_fit(buffet, 1600, 1100, 0.42, 0.5, 1.15))
add('cel-hero', crop_fit(buffet, 1600, 1100, 0.72, 0.45, 1.25))
add('about-hero', crop_fit(buffet, 1600, 1100, 0.3, 0.5, 1.3))
add('svc-corporates', crop_fit(buffet, 1200, 900, 0.5, 0.6, 1.2))
add('svc-celebrations', crop_fit(buffet, 1200, 900, 0.8, 0.4, 1.5))
add('corp-business', crop_fit(buffet, 1200, 900, 0.6, 0.62, 1.4))
add('corp-royal', crop_fit(buffet, 1200, 900, 0.85, 0.5, 1.7))
add('cel-weddings', crop_fit(buffet, 1200, 900, 0.78, 0.3, 1.6))
add('cel-private', crop_fit(buffet, 1200, 900, 0.25, 0.55, 1.5))
add('cel-canapes', crop_fit(buffet, 1200, 900, 0.88, 0.78, 1.8))
add('cel-vip', crop_fit(buffet, 1200, 900, 0.62, 0.72, 1.9))
add('team', crop_fit(buffet, 1200, 900, 0.15, 0.45, 1.6))
add('kitchen-facility', crop_fit(buffet, 1200, 900, 0.5, 0.48, 1.05))
add('kitchen-poster', crop_fit(buffet, 1600, 900, 0.45, 0.6, 1.1))
# --- Dark cover texture for the future-service panel
add('fm-hero', crop_fit(cover, 1600, 1100, 0.5, 0.5))
add('svc-facility', crop_fit(cover, 1200, 900, 0.5, 0.55, 1.2))
# --- Product collages (bakery, meal programmes, Ramadan, live stations)
add('b2b-hero', collage(['brown-sourdough-bread', 'plain-croissant', 'pistachio-eclair', 'honey-cake-whole-cake'], 1600, 1100, 'warm', scale=0.55))
add('svc-b2b', collage(['white-sourdough-bread', 'baguette-with-mixed-seeds', 'rye-bread'], 1200, 900, 'warm'))
add('corp-mealboxes', collage(['burger-bun', 'potato-bun', 'mini-burger-bun'], 1200, 900, 'cool'))
add('corp-hospitals', collage(['white-toast-bread', 'semolina-bread', 'ciabatta-bread'], 1200, 900, 'cool'))
add('corp-industrial', collage(['baguette-with-mixed-seeds', 'brown-baguette', 'white-sesame-baguette'], 1200, 900, 'cool'))
add('corp-schools', collage(['mini-baguette', 'mini-sesame-baguette', 'cheese-croissant', 'pain-au-chocolat'], 1200, 900, 'warm'))
add('corp-ramadan', collage(['dulcey-pecan-coffee', 'miracle-vanilla', 'miracle-strawberry'], 1200, 900, 'plum'))
add('cel-ramadan', collage(['pistachio-eclair', 'raspberry-eclair', 'salted-caramel-eclair', 'golden-hazelnut-eclair'], 1200, 900, 'plum'))
add('cel-live', collage(['olive-sourdough-bread', 'sourdough-mixed-with-seeds'], 1200, 900, 'warm', scale=0.7))
# --- Gallery (12)
G = [
  ('gallery-demo-01', crop_fit(buffet, 1200, 1500, 0.55, 0.55, 1.3)),
  ('gallery-demo-02', collage(['almond-croissant', 'pecan-croissant', 'zaatar-croissant'], 1200, 900, 'warm')),
  ('gallery-demo-03', crop_fit(buffet, 1200, 900, 0.86, 0.75, 2.0)),
  ('gallery-demo-04', collage(['chocolate-cake', 'red-fruits-cheesecake'], 1200, 1500, 'plum', scale=0.7)),
  ('gallery-demo-05', crop_fit(buffet, 1200, 900, 0.2, 0.4, 1.7)),
  ('gallery-demo-06', collage(['tiramisu', 'strawberry-lovers', 'pistachio-lovers', 'mango-lovers'], 1200, 1200, 'cool')),
  ('gallery-demo-07', crop_fit(buffet, 1200, 900, 0.5, 0.75, 1.6)),
  ('gallery-demo-08', collage(['cherry-tomato-focaccia', 'fetta-cheese-focaccia', 'sundried-tomato-focaccia'], 1200, 1200, 'warm')),
  ('gallery-demo-09', crop_fit(buffet, 1200, 1500, 0.9, 0.5, 1.8)),
  ('gallery-demo-10', collage(['vanilla-eclair', 'dark-chocolate-eclair', 'lemon-eclair', 'strawberry-eclair', 'coffee-eclair'], 1200, 900, 'plum', scale=0.55)),
  ('gallery-demo-11', collage(['millefeuille-cake', 'tiramisu-cake'], 1200, 900, 'cool', scale=0.7)),
  ('gallery-demo-12', collage(['pain-suisse-cheese', 'pain-swisse-kunafa', 'pain-swisse-pistachio', 'pain-swiss-chocolate'], 1200, 1500, 'warm')),
]
for gid, img in G: add(gid, img)

# --- Write back into the media manifest
mp = os.path.join(ROOT, 'src/data/media-manifest.json')
mm = json.load(open(mp, encoding='utf-8'))
SRC = 'Derived from client-supplied catalogue assets (buffet photograph p.2, product cut-outs, cover texture). Demonstration only — replace with final photography.'
for m in mm['images']:
    if m['id'] in photos:
        m.update(photos[m['id']]); m['demo'] = True; m['source'] = SRC
        m['alt'] = {'en': m['label']['en'], 'ar': m['label']['ar']}
gal_meta = {
  'gallery-demo-01': ('celebrations', 'Hospitality table setting', 'تنسيق مائدة ضيافة'), 'gallery-demo-02': ('b2b', 'Croissant selection', 'تشكيلة كرواسون'),
  'gallery-demo-03': ('corporates', 'Buffet service detail', 'تفاصيل خدمة البوفيه'), 'gallery-demo-04': ('b2b', 'Whole cakes', 'كيك كامل'),
  'gallery-demo-05': ('celebrations', 'Reception table', 'طاولة استقبال'), 'gallery-demo-06': ('b2b', 'Molded cakes', 'كيك القوالب'),
  'gallery-demo-07': ('corporates', 'Plated service', 'تقديم الأطباق'), 'gallery-demo-08': ('kitchen', 'Focaccia from the bakery', 'فوكاتشيا من المخبز'),
  'gallery-demo-09': ('celebrations', 'Floral table detail', 'تفاصيل الزهور على المائدة'), 'gallery-demo-10': ('b2b', 'Éclair range', 'تشكيلة الإكلير'),
  'gallery-demo-11': ('kitchen', 'Pâtisserie cakes', 'كيك الباتيسري'), 'gallery-demo-12': ('kitchen', 'Pain Suisse selection', 'تشكيلة بان سويس'),
}
mm['gallery'] = []
for gid, (cat, en, ar) in gal_meta.items():
    p = photos[gid]
    mm['gallery'].append({'id': gid, 'category': cat, 'src': p['src'], 'width': p['width'], 'height': p['height'], 'demo': True, 'source': SRC,
                          'label': {'en': en, 'ar': ar}, 'alt': {'en': en, 'ar': ar},
                          'pages': ['home'] + (['corporates'] if cat in ('corporates', 'kitchen') else []) + (['celebrations'] if cat in ('celebrations',) else [])})
mm['_note'] = 'Asset manifest. Photo entries are DERIVED from client-supplied catalogue assets (demo:true) until final photography is supplied; placeholders are generated for any entry without src. Target: 117 real gallery photos (0 final photos supplied).'
with open(mp, 'w', encoding='utf-8') as f: json.dump(mm, f, ensure_ascii=False, indent=2); f.write('\n')
print(f'{len(photos)} photos written')
