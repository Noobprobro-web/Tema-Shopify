#!/usr/bin/env python3
"""liquid-literals.py (LOCALE-AUDIT-001)
Busca texto visible escrito a mano en Liquid (sin | t). Cuatro barridos:
  1. Nodos de texto HTML con palabras, tras quitar comentarios, schema, style, script y
     todas las etiquetas Liquid ({{ }} se sustituye por un marcador).
  2. Atributos que el comprador ve o escucha: alt, title, aria-label, placeholder,
     value de botones/inputs submit, aria-description, data-*-text/label/message.
  3. Cadenas literales dentro de etiquetas Liquid que acaban en pantalla: default: '...',
     assign x = '...' con espacios o mayusculas, y append/prepend de frases.
  4. Salidas {{ }} que imprimen una cadena literal: una clave de traducción sin | t, o un
     default:/append:/prepend: con letras cuando la salida cae en un nodo de texto (fuera de
     una etiqueta HTML). Cubre el punto ciego del barrido 3 con palabras sueltas en minúscula.
Uso: python3 liquid-literals.py <raiz-del-tema>   (exit 1 si hay hallazgos)
"""
import re, sys, pathlib
ROOT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
FILES = sorted([p for d in ('sections', 'snippets', 'layout', 'templates', 'blocks') for p in (ROOT / d).glob('*.liquid')])
WORD = re.compile(r"[A-Za-zÀ-ÿ]{2,}")
ALLOW_TEXT = {'/', '|', '·', '×', '&', '–'}
def strip_blocks(s):
    for a, b in [(r'{%-?\s*schema\s*-?%}', r'{%-?\s*endschema\s*-?%}'), (r'{%-?\s*comment\s*-?%}', r'{%-?\s*endcomment\s*-?%}'),
                 (r'{%-?\s*javascript\s*-?%}', r'{%-?\s*endjavascript\s*-?%}'), (r'{%-?\s*style\s*-?%}', r'{%-?\s*endstyle\s*-?%}'),
                 (r'<style\b', r'</style>'), (r'<script\b', r'</script>'), (r'<svg\b', r'</svg>')]:
        s = re.sub(a + r'.*?' + b, lambda m: '\n' * m.group(0).count('\n'), s, flags=re.S | re.I)
    s = re.sub(r'{%-?\s*#.*?-?%}', '', s)
    return s
def line_of(s, i): return s.count('\n', 0, i) + 1
findings = []
for f in FILES:
    raw = f.read_text(encoding='utf-8')
    s = strip_blocks(raw)
    # 3. literales en etiquetas Liquid (antes de borrarlas)
    for m in re.finditer(r'{[{%]-?(.*?)-?[}%]}', s, flags=re.S):
        body = m.group(1)
        for lit in re.finditer(r"(default:|append:|prepend:|=)\s*(['\"])([^'\"]*)\2", body):
            val = lit.group(3)
            if not WORD.search(val): continue
            if re.fullmatch(r"[a-z0-9_.\-]+", val): continue            # claves, handles, clases
            if re.fullmatch(r"[\w\-]+(__[\w\-]+)?(--[\w\-]+)?", val) and val.lower() == val: continue
            if re.search(r"(^|\s)(color|scheme|image|h[1-6]|svh|px|rem|%)", val): continue
            if val.startswith(('#', '.', '[', 'data-', 'aria-', 'shopify', 'http', '/')): continue
            if ' ' not in val and not re.search(r'[A-Z]', val): continue
            if re.fullmatch(r"[A-Z][A-Za-z]+-", val): continue             # prefijos de id: 'ContactForm-'
            if val.startswith(('&', '?', '(min-width', '(max-width')): continue  # parametros de URL, sizes
            findings.append((str(f.relative_to(ROOT)), line_of(s, m.start()), 'liquid-literal', val))
    # 4. salidas {{ }} con literales impresos
    OK_FILTERS = ('asset_url', 'shopify_asset_url', 'file_url', 'asset_img_url', 'file_img_url', 'placeholder_svg_tag',
                  'inline_asset_content', 'stylesheet_tag', 'script_tag', 'preload_tag', 'global_asset_url')
    for m in re.finditer(r'{{-?(.*?)-?}}', s, flags=re.S):
        body = m.group(1).strip()
        filters = [x.strip().split(':')[0].strip() for x in body.split('|')[1:]]
        in_tag = s.rfind('<', 0, m.start()) > s.rfind('>', 0, m.start())
        first = re.match(r"(['\"])([^'\"]*)\1", body)
        if first and 't' not in filters and not any(x in OK_FILTERS for x in filters):
            val = first.group(2)
            if re.fullmatch(r"[a-z_]+(\.[a-z0-9_]+)+", val):
                findings.append((str(f.relative_to(ROOT)), line_of(s, m.start()), 'key-without-t', val))
        if not in_tag and 't' not in filters:
            for lit in re.finditer(r"(default:|append:|prepend:)\s*(['\"])([^'\"]*)\2", body):
                if WORD.search(lit.group(3)):
                    findings.append((str(f.relative_to(ROOT)), line_of(s, m.start()), 'output-literal', lit.group(3)))
    t = re.sub(r'{{.*?}}', ' ⟦L⟧ ', s, flags=re.S)
    t = re.sub(r'{%.*?%}', lambda m: '\n' * m.group(0).count('\n'), t, flags=re.S)
    # 2. atributos
    for m in re.finditer(r'\s(alt|title|aria-label|aria-description|placeholder|value|data-[\w-]*(?:text|label|message|title))\s*=\s*"([^"]*)"', t):
        name, val = m.group(1), m.group(2)
        clean = val.replace('⟦L⟧', ' ')
        if not WORD.search(clean): continue
        if name == 'value':
            tag_start = t.rfind('<', 0, m.start()); tag = t[tag_start:t.find('>', m.start())]
            if not re.search(r'type="(submit|button|reset)"', tag): continue
        findings.append((str(f.relative_to(ROOT)), line_of(t, m.start()), f'attr:{name}', val.strip()))
    # 1. nodos de texto
    for m in re.finditer(r'>([^<>]+)<', t):
        txt = m.group(1)
        clean = re.sub(r'&[a-z#0-9]+;', ' ', txt.replace('⟦L⟧', ' '))
        if not WORD.search(clean): continue
        findings.append((str(f.relative_to(ROOT)), line_of(t, m.start()), 'text', ' '.join(txt.split())[:90]))
for fnd in findings: print(' | '.join(map(str, fnd)))
print(f'\n{len(FILES)} archivos Liquid, {len(findings)} hallazgos')
sys.exit(1 if findings else 0)
