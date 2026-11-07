# Genera paginas sinteticas (SINTETICO) renderizando el Liquid REAL con mini.py.
# Uso: python3 gen.py <base.liquid> <work.liquid> <outdir>
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mini import run
R = os.environ.get('REPO') or os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
base, work, out = sys.argv[1:4]
L = {'en': ('en', 'English'), 'es': ('es', 'español'), 'fr': ('fr', 'français'), 'de': ('de', 'Deutsch'),
     'pt': ('pt-BR', 'português (Brasil)'), 'ar': ('ar', 'العربية'), 'zh': ('zh-TW', '中文 (台灣)'), 'xx': ('it', '')}
C = [{'iso_code': 'US', 'name': 'United States', 'currency': {'iso_code': 'USD', 'symbol': '$'}},
     {'iso_code': 'ES', 'name': 'Spain', 'currency': {'iso_code': 'EUR', 'symbol': '€'}}]
CASES = {'en2': ('en', 'en,es'), 'es2': ('es', 'en,es'), 'en5': ('en', 'en,es,fr,de,pt'),
         'rtl': ('en', 'en,ar,zh'), 'empty': ('en', 'en,xx'), 'one': ('en', 'en')}
os.makedirs(out, exist_ok=True); country = {}
for v, path in (('base', base), ('fix', work)):
    for name, (cur, avail) in CASES.items():
        loc = f'{R}/locales/' + ('es.json' if cur == 'es' else 'en.default.json')
        langs = [{'iso_code': L[c][0], 'endonym_name': L[c][1]} for c in avail.split(',')]
        frag = {ctx: run(path, {'context': ctx, 'locale': loc, 'current': L[cur][0], 'langs': langs,
                'countries': C, 'country': 'US'}) for ctx in ('header', 'header-mobile', 'footer')}
        for ctx, h in frag.items():
            country[f'{v}/{name}/{ctx}'] = h[h.index('<div class="localization-form__country-wrapper">'):]
        page = (f'<!doctype html><html class="js" lang="{L[cur][0]}"><head><meta charset="utf-8">'
                '<meta name="viewport" content="width=device-width,initial-scale=1"><title>b05</title>'
                '<link rel="stylesheet" href="/base.css"></head><body>'
                f'<header class="site-header"><div class="mobile-nav__localization">{frag["header-mobile"]}</div>'
                f'<div class="site-header__icons">{frag["header"]}</div></header><main><h1>x</h1></main>'
                f'<footer class="site-footer"><div class="container site-footer__utilities">{frag["footer"]}</div></footer>'
                '<script src="/theme.js" defer></script></body></html>')
        open(f'{out}/{v}-{name}.html', 'w').write(page)
diff = [k for k in country if k.startswith('base/') and country[k] != country['fix/' + k[5:]]]
print('H-10b bloques de pais renderizados (base vs fix):', sum(k.startswith('base/') for k in country), 'distintos:', len(diff))
