# Mini-renderizador Liquid (subconjunto) para renderizar el snippet REAL (o su copia parcheada)
# sin Shopify: tags liquid/form se sustituyen por un <form> equivalente. Solo para la revision B-05.
import re, json, sys, html
TOK = re.compile(r'(\{\{-?.*?-?\}\}|\{%-?.*?-?%\})', re.S)
def tokenize(src):
    parts = TOK.split(src); out = []
    for i, p in enumerate(parts):
        if i % 2 == 0: out.append(['text', p])
        else:
            lt = p.startswith('{{-') or p.startswith('{%-'); rt = p.endswith('-}}') or p.endswith('-%}')
            kind = 'out' if p.startswith('{{') else 'tag'
            inner = p[3 if lt else 2: -3 if rt else -2].strip()
            out.append([kind, inner, lt, rt])
    for i, t in enumerate(out):  # whitespace control
        if t[0] != 'text':
            if t[2] and i > 0 and out[i-1][0] == 'text': out[i-1][1] = out[i-1][1].rstrip()
            if t[3] and i + 1 < len(out) and out[i+1][0] == 'text': out[i+1][1] = out[i+1][1].lstrip()
    return out
def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#39;')
def lookup(path, ctx):
    if path.startswith("'"): return path.strip("'")
    if path in ('true', 'false'): return path == 'true'
    cur = ctx
    for k in path.split('.'):
        if isinstance(cur, dict): cur = cur.get(k, '')
        elif isinstance(cur, list) and k == 'size': cur = len(cur)
        else: cur = ''
    return cur
def evalexpr(expr, ctx):
    parts = [p.strip() for p in re.split(r'\|(?=(?:[^\']*\'[^\']*\')*[^\']*$)', expr)]
    v = lookup(parts[0], ctx)
    for f in parts[1:]:
        name, _, arg = f.partition(':'); name = name.strip()
        if name == 'upcase': v = str(v).upper()
        elif name == 'capitalize': v = str(v)[:1].upper() + str(v)[1:].lower()
        elif name == 'escape': v = esc(str(v))
        elif name == 't':
            v = ctx['__t'](v)
            m = re.match(r'\s*(\w+):\s*(\S+)', arg)
            if m: v = v.replace('{{ ' + m.group(1) + ' }}', str(lookup(m.group(2), ctx)))
            v = esc(v)  # Shopify escapa la salida de t salvo claves _html
        else: raise SystemExit('filtro no soportado: ' + name)
    return v
def cond(c, ctx):
    if '==' in c:
        a, b = [x.strip() for x in c.split('==')]; return lookup(a, ctx) == lookup(b, ctx)
    v = lookup(c.strip(), ctx); return bool(v)
def render(toks, ctx):
    out = []; i = 0
    def block(i, ends):
        body = []; depth = 0
        while i < len(toks):
            t = toks[i]
            if t[0] == 'tag':
                w = t[1].split()[0]
                if w in ('if', 'unless', 'for', 'comment'): depth += 1
                elif w in ('endif', 'endunless', 'endfor', 'endcomment'):
                    if depth == 0: return body, i
                    depth -= 1
                elif w == 'else' and depth == 0 and 'else' in ends: return body, i
            body.append(t); i += 1
        raise SystemExit('bloque sin cerrar')
    while i < len(toks):
        t = toks[i]
        if t[0] == 'text': out.append(t[1]); i += 1; continue
        if t[0] == 'out': out.append(str(evalexpr(t[1], ctx))); i += 1; continue
        w, _, rest = t[1].partition(' ')
        if w == 'comment':
            _, j = block(i + 1, ()); i = j + 1
        elif w == 'assign':
            n, _, e = rest.partition('='); ctx[n.strip()] = evalexpr(e.strip(), ctx); i += 1
        elif w in ('if', 'unless'):
            a, j = block(i + 1, ('else',)); b = []
            if toks[j][1] == 'else': b, j = block(j + 1, ())
            c = cond(rest, ctx); c = c if w == 'if' else not c
            out.append(render(a if c else b, ctx)); i = j + 1
        elif w == 'for':
            var, _, coll = rest.partition(' in '); body, j = block(i + 1, ())
            items = lookup(coll.strip(), ctx)
            for k, it in enumerate(items):
                ctx[var.strip()] = it; ctx['forloop'] = {'last': k == len(items) - 1}
                out.append(render(body, ctx))
            i = j + 1
        else: raise SystemExit('tag no soportado: ' + w)
    return ''.join(out)
def run(liquid_path, cfg):
    src = open(liquid_path).read()
    a = src.index('{%- form'); a2 = src.index('-%}', a) + 3; b = src.index('{%- endform -%}')
    inner = src[a2:b]
    loc = json.load(open(cfg['locale']))['general']['localization']
    def t(key): return loc[key.split('.')[-1]]
    ctx = {'__t': t, 'show_language_selector': len(cfg['langs']) > 1, 'show_country_selector': True,
           'localization_form_id': 'LocalizationForm-' + cfg['context'],
           'localization': {'available_languages': cfg['langs'], 'language': {'iso_code': cfg['current']},
                            'available_countries': cfg['countries'], 'country': {'iso_code': cfg['country']}}}
    body = render(tokenize(inner), ctx)
    return (f'<localization-form class="localization-form localization-form--{cfg["context"]}" data-localization-form>'
            f'<form method="post" action="/localization" id="LocalizationForm-{cfg["context"]}" accept-charset="UTF-8" class="localization-form__form">'
            f'{body}</form></localization-form>')
if __name__ == '__main__':
    cfg = json.loads(sys.argv[2]); print(run(sys.argv[1], cfg))
