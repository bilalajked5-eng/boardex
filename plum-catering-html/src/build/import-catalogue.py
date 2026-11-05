#!/usr/bin/env python3
"""One-off importer: Plum B2B Catalogue 2026 (PDF) -> products.json + product images.

Source of truth for every value below is the catalogue PDF supplied by the client
on 5 Nov 2026. Names are kept exactly as printed (including the catalogue's own
spellings such as "Fetta", "Peperoni", "Pain Swisse"); only capitalisation of two
English names was normalised. Nothing else (ingredients, allergens, prices) is added.

Usage: python3 src/build/import-catalogue.py <extracted-images-dir>
  (images dir holds NNN_pP.png masked photos and cake_NN_pP.png unmasked photos,
   produced from `pdfimages -png` + soft-mask compositing).
"""
import json, re, sys, os, shutil
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IMG_IN = sys.argv[1]
OUT_IMG = os.path.join(ROOT, 'src/assets/images/products')
os.makedirs(OUT_IMG, exist_ok=True)

FRESH2 = {'fresh': {'ar': 'يومان', 'en': '2 days'}, 'bakedFrozen': {'ar': '3 أشهر', 'en': '3 months'}}
FRESH3 = {'fresh': {'ar': '3 أيام', 'en': '3 days'}, 'bakedFrozen': None}
SRC = 'Plum B2B Catalogue 2026 (client PDF, 5 Nov 2026)'

CATS = [
  ('bread', 'bread', 'الخبز', 'Bread', FRESH2),
  ('croissants', 'croissants', 'الكرواسون', 'Croissants', FRESH2),
  ('danish-focaccia', 'danish-focaccia', 'الدنش والفوكاشيا', 'Danish & Focaccia', FRESH2),
  ('eclairs', 'eclairs', 'الإكلير', 'Éclairs', FRESH2),
  ('miracle-cakes', 'miracle-cakes', 'كيك ميراكل', 'Miracle Cakes', FRESH2),
  ('molded-cakes', 'molded-cakes', 'كيك القوالب', 'Molded Cakes', FRESH3),
  ('whole-cakes', 'whole-cakes', 'الكيك الكامل', 'Whole Cakes', FRESH3),
]

# (category, ar name, en name, weight g, kcal, image file)  — variants as list for croissants
P = [
 # Bread (21)
 ('bread','خبز ساوردو أسمر','Brown Sourdough Bread',750,1850,'002'),
 ('bread','خبز ساوردو أبيض','White Sourdough Bread',750,1900,'001'),
 ('bread','خبز ساوردو بالبذور المشكلة','Sourdough Mixed with Seeds',750,2050,'000'),
 ('bread','خبز ساوردو بالزيتون','Olive Sourdough Bread',750,1950,'003'),
 ('bread','باغيت بالبذور المشكلة','Baguette with Mixed Seeds',230,600,'004'),
 ('bread','باغيت أسمر','Brown Baguette',230,570,'005'),
 ('bread','باغيت بالسمسم الأبيض','White Sesame Baguette',230,620,'006'),
 ('bread','خبز البرغر بالبطاطس','Potato Bun',90,250,'007'),
 ('bread','خبز برغر','Burger Bun',90,240,'008'),
 ('bread','خبز برغر صغير','Mini Burger Bun',40,110,'009'),
 ('bread','باغيت صغير','Mini Baguette',80,210,'012'),
 ('bread','باغيت صغير بالسمسم','Mini Sesame Baguette',80,220,'013'),
 ('bread','باغيت صغير بخليط السمسم','Mini Baguette Mixed Sesame Seeds',80,225,'010'),
 ('bread','باغيت أسمر صغير','Mini Brown Baguette',80,200,'011'),
 ('bread','باغيت أسمر صغير متعدد البذور','Mini Brown Baguette Mixed Seeds',80,220,'014'),
 ('bread','باغيت صغير متعدد البذور','Mini Baguette Mixed Seeds',80,215,'015'),
 ('bread','خبز السميد','Semolina Bread',80,210,'016'),
 ('bread','خبز تشاباتا','Ciabatta Bread',90,240,'017'),
 ('bread','خبز الجاودار','Rye Bread',90,230,'018'),
 ('bread','رول خبز أسمر بالبقان','Brown Bread Roll with Pecan',30,90,'019'),
 ('bread','خبز توست أبيض','White Toast Bread',950,2450,'020'),
 # Croissants (6) — three sizes each
 ('croissants','كرواسون سادة','Plain Croissant',[(80,420),(60,315),(30,160)],None,'021'),
 ('croissants','كرواسون بالجبنة','Cheese Croissant',[(80,430),(60,325),(30,165)],None,'022'),
 ('croissants','كرواسون بالزعتر','Zaatar Croissant',[(80,400),(60,300),(30,150)],None,'023'),
 ('croissants','كرواسون باللوز','Almond Croissant',[(80,480),(60,360),(30,180)],None,'024'),
 ('croissants','كرواسون بالبقان','Pecan Croissant',[(80,490),(60,370),(30,185)],None,'025'),
 ('croissants','بان أو شوكولا','Pain Au Chocolat',[(80,430),(60,325),(30,165)],None,'026'),
 # Danish & Focaccia (10)
 ('danish-focaccia','فوكاتشيا بالطماطم الكرزية','Cherry Tomato Focaccia',130,360,'027'),
 ('danish-focaccia','فوكاتشيا بجبنة الفيتا','Fetta Cheese Focaccia',130,390,'028'),
 ('danish-focaccia','فوكاتشيا بالطماطم المجففة','Sundried Tomato Focaccia',130,350,'029'),
 ('danish-focaccia','دانيش بجبنة الفيتا','Fetta Cheese Danish',110,420,'030'),
 ('danish-focaccia','دانيش بيتزا بالبيبروني','Peperoni Pizza Danish',110,430,'031'),
 ('danish-focaccia','دانيش بالحلوم والبيستو','Halloumi Pesto Danish',110,400,'032'),
 ('danish-focaccia','بان سويس بالجبنة','Pain Suisse Cheese',80,320,'033'),
 ('danish-focaccia','بان سويس بالكنافة','Pain Swisse Kunafa',80,360,'035'),
 ('danish-focaccia','بان سويس بالشوكولاتة','Pain Swiss Chocolate',80,340,'034'),
 ('danish-focaccia','بان سويس بالفستق الحلبي','Pain Swisse Pistachio',80,370,'036'),
 # Éclairs (12)
 ('eclairs','إكلير بالفانيليا','Vanilla Éclair',80,280,'037'),
 ('eclairs','إكلير بالتشيز كيك','Cheese Cake Éclair',80,320,'040'),
 ('eclairs','إكلير بالشوكولاتة الداكنة','Dark Chocolate Éclair',80,330,'038'),
 ('eclairs','إكلير بالقهوة','Coffee Éclair',80,290,'039'),
 ('eclairs','إكلير بالبندق الذهبي','Golden Hazelnut Éclair',80,340,'041'),
 ('eclairs','إكلير بالليمون','Lemon Éclair',80,270,'043'),
 ('eclairs','إكلير بالشوكولاتة بالحليب','Milk Chocolate Éclair',80,320,'042'),
 ('eclairs','إكلير بالفراولة','Strawberry Éclair',80,290,'044'),
 ('eclairs','إكلير بفاكهة الباشن فروت','Passion Fruit Éclair',80,280,'045'),
 ('eclairs','إكلير بالفستق الحلبي','Pistachio Éclair',80,350,'047'),
 ('eclairs','إكلير بالتوت العليق','Raspberry Éclair',80,290,'046'),
 ('eclairs','إكلير بالكراميل المملح','Salted Caramel Éclair',80,330,'048'),
 # Miracle (5)
 ('miracle-cakes','دولسي بالبقان والقهوة','Dulcey Pecan Coffee',200,720,'cake_00'),
 ('miracle-cakes','ميراكل بالشوكولاتة والبندق','Miracle Chocolate Hazelnut',200,760,'cake_02'),
 ('miracle-cakes','ميراكل بالمانجو والباشن فروت','Miracle Mango Passion Fruit',200,680,'cake_01'),
 ('miracle-cakes','ميراكل بالفانيليا','Miracle Vanilla',200,700,'cake_03'),
 ('miracle-cakes','ميراكل بالفراولة','Miracle Strawberry',200,690,'cake_04'),
 # Molded (12)
 ('molded-cakes','تيراميسو','Tiramisu',160,520,'cake_08'),
 ('molded-cakes','كيك الشوكولاتة واليوسفي','Chocolate Mandarine Cake',155,500,'cake_07'),
 ('molded-cakes','كيك العسل','Honey Cake',120,430,'cake_05'),
 ('molded-cakes','تارت الشوكولاتة','Chocolate Tart',110,470,'cake_06'),
 ('molded-cakes','عشاق الفراولة','Strawberry Lovers',160,480,'cake_09'),
 ('molded-cakes','براونيز بالكراميل المملح','Brownies Salted Caramel',220,980,'cake_12'),
 ('molded-cakes','عشاق الفستق الحلبي','Pistachio Lovers',140,560,'cake_10'),
 ('molded-cakes','تشيز كيك بالتوت العليق','Raspberry Cheesecake',190,540,'cake_11'),
 ('molded-cakes','عشاق البندق','Hazelnut Lovers',130,510,'cake_13'),
 ('molded-cakes','بلاك فورست','Black Forest',180,460,'cake_16'),
 ('molded-cakes','عشاق المانجو','Mango Lovers',180,450,'cake_14'),
 ('molded-cakes','دولسي بالبقان','Dulcey Pecan',250,950,'cake_15'),
 # Whole (10)
 ('whole-cakes','كيك العسل','Honey Cake',1700,5200,'049'),
 ('whole-cakes','كيك الشوكولاتة','Chocolate Cake',1800,7200,'051'),
 ('whole-cakes','كيك دولسي بالفانيليا والبقان','Dulce Vanilla Pecan Cake',2170,8600,'050'),
 ('whole-cakes','كيك الفستق الحلبي والتوت العليق','Pistachio Raspberry',1990,7900,'052'),
 ('whole-cakes','كيك الميل فوي','Millefeuille Cake',1200,4800,'053'),
 ('whole-cakes','كيك التيراميسو','Tiramisu Cake',1770,5600,'055'),
 ('whole-cakes','كيك البلاك فورست','Black Forest Cake',1450,4200,'054'),
 ('whole-cakes','تشيز كيك بالفواكه الحمراء','Red Fruits Cheesecake',1850,6100,'056'),
 ('whole-cakes','كيك الشوكولاتة والبندق','Chocolate Hazelnut',1500,6900,'058'),
 ('whole-cakes','تارت الشوكولاتة','Chocolate Tart',1300,5800,'057'),
]
assert len(P) == 76, len(P)

def slugify(s):
    s = s.lower().replace('é', 'e').replace('&', 'and')
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s)).strip('-')

# collision-safe slugs (same English name in two families -> family suffix)
from collections import Counter
name_counts = Counter(slugify(p[2]) for p in P)
cat_slug_en = {c[0]: slugify(c[3]).rstrip('s') if c[0] in ('molded-cakes', 'whole-cakes', 'miracle-cakes') else c[1] for c in CATS}

AR_FAMILY = {c[0]: c[2] for c in CATS}
EN_FAMILY = {c[0]: c[3] for c in CATS}

def fmt_ar_num(n): return f'{n:,}'
def short_desc(cat, ar, en, variants, shelf):
    v = variants[0]
    w, k = v['weight']['value'], v['energy']['value']
    multi = len(variants) > 1
    if multi:
        sizes_en = ', '.join(f"{x['weight']['value']} g" for x in variants)
        sizes_ar = '، '.join(f"{x['weight']['value']} غ" for x in variants)
        en_txt = f"{en} from Plum Catering's central kitchen in Riyadh, supplied to foodservice businesses in three sizes ({sizes_en}). Available fresh ({shelf['fresh']['en']}) or baked-frozen ({shelf['bakedFrozen']['en']})."
        ar_txt = f"{ar} من مطبخ بلام للتموين المركزي في الرياض، يُورَّد لمنشآت خدمات الطعام بثلاثة أحجام ({sizes_ar}). متاح طازجًا ({shelf['fresh']['ar']}) أو مخبوزًا مجمدًا ({shelf['bakedFrozen']['ar']})."
    else:
        frozen_en = f" or baked-frozen ({shelf['bakedFrozen']['en']})" if shelf.get('bakedFrozen') else ''
        frozen_ar = f" أو مخبوزًا مجمدًا ({shelf['bakedFrozen']['ar']})" if shelf.get('bakedFrozen') else ''
        en_txt = f"{en} from the {EN_FAMILY[cat]} range, produced in Plum Catering's central kitchen in Riyadh: {w:,} g per unit ({k:,} kcal). Available fresh ({shelf['fresh']['en']}){frozen_en} for wholesale supply."
        ar_txt = f"{ar} من فئة {AR_FAMILY[cat]}، يُنتج في مطبخ بلام للتموين المركزي بالرياض: {fmt_ar_num(w)} غ للوحدة ({fmt_ar_num(k)} سعرة حرارية). متاح طازجًا ({shelf['fresh']['ar']}){frozen_ar} للتوريد بالجملة."
    return {'ar': ar_txt, 'en': en_txt}

products = []
by_cat = {}
for idx, (cat, ar, en, w, k, img) in enumerate(P):
    base = slugify(en)
    slug = base if name_counts[base] == 1 else f'{base}-{cat_slug_en[cat]}'
    pid = f'prd-{cat_slug_en[cat]}-{base}' if name_counts[base] > 1 else f'prd-{base}'
    variants = [{'id': f'v{i+1}', 'weight': {'value': wv, 'unit': 'g'}, 'energy': {'value': kv, 'unit': 'kcal', 'basis': None}} for i, (wv, kv) in enumerate(w if isinstance(w, list) else [(w, k)])]
    shelf = dict(CATS[[c[0] for c in CATS].index(cat)][4])
    # image: pad to square 800x800
    src = os.path.join(IMG_IN, [f for f in os.listdir(IMG_IN) if f.startswith(img + '_')][0])
    im = Image.open(src).convert('RGBA')
    bg = (255, 255, 255, 255) if img.startswith('cake') else (0, 0, 0, 0)
    S = 800; pad = 64
    im.thumbnail((S - 2 * pad, S - 2 * pad), Image.LANCZOS)
    canvas = Image.new('RGBA', (S, S), bg)
    canvas.paste(im, ((S - im.width) // 2, (S - im.height) // 2), im)
    out = f'{slug}.webp'
    canvas.save(os.path.join(OUT_IMG, out), 'WEBP', quality=84, method=6)
    small = canvas.copy(); small.thumbnail((400, 400), Image.LANCZOS); small.save(os.path.join(OUT_IMG, f'{slug}-400.webp'), 'WEBP', quality=82, method=6)
    rec = {
        'id': pid, 'category': cat, 'status': 'provisional', 'source': SRC,
        'slug': {'ar': slug, 'en': slug},
        'name': {'ar': ar, 'en': en},
        'h1': {'ar': f'{ar} للتوريد بالجملة', 'en': f'{en} for Wholesale Supply'},
        'productCode': None,
        'heroImage': f'product-{slug}', 'galleryImages': [],
        'variants': variants,
        'shortDescription': short_desc(cat, ar, en, variants, shelf),
        'longDescription': {'ar': None, 'en': None},
        'ingredients': {'ar': None, 'en': None}, 'allergens': {'ar': None, 'en': None},
        'packaging': {'ar': None, 'en': None}, 'storage': {'ar': None, 'en': None},
        'foodserviceUse': {'ar': None, 'en': None},
        'freshOrFrozen': 'inherit-category', 'relatedProducts': [], 'pdfAttachment': None,
        'seo': {'title': {'ar': f'{ar} | {AR_FAMILY[cat]} بالجملة | بلام للتموين', 'en': f'{en} | Wholesale {EN_FAMILY[cat]} | Plum Catering'}, 'description': {'ar': None, 'en': None}},
        'indexabilityOverride': None,
        '_image': {'id': f'product-{slug}', 'src': f'/assets/images/products/{out}', 'small': f'/assets/images/products/{slug}-400.webp', 'alt': {'ar': f'{ar} — صورة المنتج من كتالوج بلام 2026', 'en': f'{en} — product photo from the Plum 2026 catalogue'}},
    }
    products.append(rec); by_cat.setdefault(cat, []).append(rec)

# related: 4 neighbours in the same family
for cat, lst in by_cat.items():
    n = len(lst)
    for i, r in enumerate(lst):
        r['relatedProducts'] = [lst[(i + d) % n]['id'] for d in range(1, min(5, n))]

ids = [p['id'] for p in products]; assert len(ids) == len(set(ids)), 'id collision'
slugs = [p['slug']['en'] for p in products]; assert len(slugs) == len(set(slugs)), 'slug collision'

# --- write products.json
pj = {
  '_note': 'Imported from the client-supplied Plum B2B Catalogue 2026 PDF by src/build/import-catalogue.py. Names, weights, energy and shelf lives are exactly as printed. status=provisional until the client confirms the data (then set status=approved per record, or run with --approve). No ingredients, allergens, prices or codes were added.',
  'schemaVersion': 1,
  'categories': [{'id': c[0], 'slug': c[1], 'name': {'ar': c[2], 'en': c[3]}, 'expectedCount': len(by_cat[c[0]]), 'shelfLife': {**c[4], 'status': 'provisional', 'source': SRC}} for c in CATS],
  'products': [{k: v for k, v in p.items() if not k.startswith('_')} for p in products],
}
with open(os.path.join(ROOT, 'src/data/products.json'), 'w', encoding='utf-8') as f:
    json.dump(pj, f, ensure_ascii=False, indent=2); f.write('\n')

# --- media manifest: replace product-* entries
mp = os.path.join(ROOT, 'src/data/media-manifest.json')
mm = json.load(open(mp, encoding='utf-8'))
mm['images'] = [m for m in mm['images'] if not m['id'].startswith('product-') or m['id'] == 'product-placeholder']
for p in products:
    i = p['_image']
    mm['images'].append({'id': i['id'], 'src': i['src'], 'srcset': [{'src': i['small'], 'w': 400}, {'src': i['src'], 'w': 800}], 'width': 800, 'height': 800, 'demo': False, 'source': SRC,
                         'label': {'ar': p['name']['ar'], 'en': p['name']['en']}, 'alt': i['alt']})
with open(mp, 'w', encoding='utf-8') as f:
    json.dump(mm, f, ensure_ascii=False, indent=2); f.write('\n')

print(f'{len(products)} products written; per family:', {c: len(v) for c, v in by_cat.items()})
