# Aplica al HTML ya renderizado exactamente el marcado que producen los cambios de Liquid
# de FIXES-PRE-SUBMISSION-001, para validar con vnu antes del despliegue.
import re, sys, os, json
# Uso: python3 vnu-aplicar-cambios.py harness-AUDIT-360-002/html-validation <carpeta_salida>
# y despues: java -jar vnu.jar --format json --exit-zero-always <carpeta_salida>/*.html
SRC = sys.argv[1]
DST = sys.argv[2]
os.makedirs(DST, exist_ok=True)
POWERED = '<a target="_blank" rel="nofollow" href="https://www.shopify.com?utm_campaign=poweredby&amp;utm_medium=shopify&amp;utm_source=onlinestore">Powered by Shopify</a>'
ID_PREFIX = r'(?:CardTitle|quick-add|QuickBuy|QuickBuyTitle|QuickBuyProduct|SwatchSoldOut)'
log = {}

def matching_close(s, start, tag):
    depth, i = 0, start
    pat = re.compile(r'<(/?)%s\b' % tag)
    for m in pat.finditer(s, start):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return m.start()
    raise ValueError('sin cierre')

def suffix_region(s, a, b, suffix):
    region = s[a:b]
    region, n = re.subn(r'(%s-[A-Za-z0-9_-]+?__[A-Za-z0-9_]+-\d+)(?=["\s])' % ID_PREFIX, r'\1-' + suffix, region)
    return s[:a] + region + s[b:], n

for f in sorted(os.listdir(SRC)):
    s = open(os.path.join(SRC, f), encoding='utf-8').read()
    c = {}
    # 1. Cajón del carrito: <aside> pasa a <div>
    m = re.search(r'<aside(\s+class="cart-drawer__panel")', s)
    if m:
        close = matching_close(s, m.start(), 'aside')
        s = s[:close] + '</div>' + s[close + len('</aside>'):]
        s = s[:m.start()] + '<div' + s[m.start() + len('<aside'):]
        c['cart_drawer'] = 1
    # 2. Zoom: sizes pasa a data-sizes en product-zoom__image
    s, n = re.subn(r'(<img\s+class="product-zoom__image"[^>]*?)\ssizes="100vw"', r'\1 data-sizes="100vw"', s)
    c['zoom'] = n
    # 3. Manifiesto: el índice pasa de span a dd
    s, n = re.subn(r'(<dd>[^<]*</dd>\s*)<span aria-hidden="true">(\d+)</span>', r'\1<dd class="brand-manifesto__index" aria-hidden="true">\2</dd>', s)
    c['manifesto'] = n
    # 4. IDs de tarjeta: sufijo block.id por panel de curated-showcase, índice por bloque de bento
    total = 0
    pos = 0
    while True:
        pm = re.compile(r'id="CuratedPanel-(template--\d+__[A-Za-z0-9_]+)-([A-Za-z0-9_]+)"').search(s, pos)
        if not pm: break
        start = s.rfind('<div', 0, pm.start()); end = matching_close(s, start, 'div')
        s, n = suffix_region(s, start, end, pm.group(2)); total += n
        pos = start + 1 + (end - start)
    idx = 0; pos = 0
    while True:
        bm = re.compile(r'<div class="bento-discovery__item bento-discovery__item--product"').search(s, pos)
        if not bm: break
        end = matching_close(s, bm.start(), 'div'); idx += 1
        s, n = suffix_region(s, bm.start(), end, 'bento%d' % idx); total += n
        pos = bm.start() + 1
    c['card_ids'] = total
    # 5. Footer: powered_by_link junto al copyright
    s, n = re.subn(r'(<div class="container site-footer__bottom">\s*)(<small>[^<]*</small>)',
                   r'\1<div class="site-footer__legal">\n      \2\n      <small class="site-footer__powered-by">' + POWERED.replace('\\', '\\\\') + r'</small>\n    </div>', s)
    c['footer'] = n
    # 6. Cabecera: el {% style %} del sticky sale del body (la regla pasa a base.css)
    s, n = re.subn(r'<style data-shopify="">\s*\.js #shopify-section-[^{]+\{[^}]*\}\s*</style>', '', s)
    c['header_style'] = n
    # 7. Buscador predictivo: type=search pasa a type=text con inputmode=search
    s, n = re.subn(r'(<input id="PredictiveSearchInput-[^"]*" class="predictive-search__input") type="search"', r'\1 type="text" inputmode="search"', s)
    c['search_input'] = n
    open(os.path.join(DST, f), 'w', encoding='utf-8').write(s)
    log[f] = c
json.dump(log, open(os.path.join(DST, '_cambios.json'), 'w'), indent=1)
print(json.dumps(log))
