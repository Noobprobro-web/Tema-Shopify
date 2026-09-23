# 5C-001. Fusion aditiva sobre archivos compartidos con el Track 2 (GPT-6, 5C-002): anade el bloque CSS al final
# de base.css y las claves sections.header.* a los locales, sin reescribir lo que haya cambiado.
import json, sys, os

# Uso, desde la raiz del tema: python3 agent-comms/outbox-claude/harness-5C-001/merge-shared-5c001.py .
# Idempotente: si el bloque o las claves ya estan, no los toca otra vez.
root = sys.argv[1] if len(sys.argv) > 1 else '.'
CSS = '\n/* -------------------------------------------------------------------------- */\n/* 5C-001. Mega Menú Editorial Multicolumna                                   */\n/* -------------------------------------------------------------------------- */\n/* El panel es el mismo [data-disclosure-panel] de <theme-disclosure>: sin JS nuevo. Con el\n   disparador en position: static, el panel se ancla a .site-header (position: relative) y\n   ocupa todo el ancho bajo la cabecera; dentro, .container alinea la rejilla con la pagina.\n   Las tarjetas llevan loading="lazy" y viven en un panel con hidden: ninguna foto se pide\n   hasta abrir. Sin JS el panel se pinta dentro de la cabecera (reglas .no-js de arriba):\n   ahi sobran las fotos y solo quedan las columnas. */\n.no-js .mega-menu__promos {\n  display: none;\n}\n\n.no-js .mega-menu__grid {\n  width: auto;\n}\n\n.no-js .mega-menu__columns,\n.no-js .mega-menu__column-list,\n.no-js .mega-menu__sublist {\n  display: grid;\n  gap: var(--space-1);\n}\n\n.no-js .mega-menu__view-all,\n.no-js .mega-menu__column-title,\n.no-js .mega-menu__sublist a {\n  display: inline-flex;\n  min-height: var(--tap-target-min, 44px);\n  align-items: center;\n  color: currentColor;\n}\n\n@media (min-width: 62rem) {\n  .desktop-nav__disclosure--mega {\n    position: static;\n  }\n\n  .desktop-nav__mega-menu {\n    inset-block-start: 100%;\n    inset-inline: 0;\n    min-width: 0;\n    /* Con la cabecera pegada, un menu mas alto que la ventana se recorre dentro del panel. */\n    max-height: calc(100dvh - var(--header-offset, 0px) - var(--space-6));\n    padding: var(--space-5) 0 var(--space-6);\n    overflow-y: auto;\n    overscroll-behavior: contain;\n    border-inline: 0;\n  }\n\n  /* Las tarjetas abren una segunda columna implicita: sin ellas no queda hueco a la derecha. */\n  .mega-menu__grid {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr);\n    grid-auto-columns: auto;\n    grid-auto-flow: column;\n    align-items: start;\n    column-gap: var(--space-6);\n  }\n\n  .mega-menu__columns {\n    display: grid;\n    align-content: start;\n    gap: var(--space-3);\n  }\n\n  .mega-menu__view-all,\n  .mega-menu__column-title,\n  .mega-menu__sublist a,\n  .mega-menu__promo-card {\n    color: currentColor;\n    text-decoration: none;\n  }\n\n  .mega-menu__view-all {\n    display: inline-flex;\n    min-height: var(--tap-target-min, 44px);\n    justify-self: start;\n    align-items: center;\n    font-size: 0.75rem;\n    font-weight: 700;\n    letter-spacing: 0.08em;\n    text-decoration: underline;\n    text-decoration-thickness: 1px;\n    text-transform: uppercase;\n    text-underline-offset: 0.35em;\n  }\n\n  .mega-menu__column-list {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));\n    gap: var(--space-4) var(--space-5);\n  }\n\n  .mega-menu__column {\n    display: grid;\n    align-content: start;\n  }\n\n  .mega-menu__column-title {\n    display: flex;\n    min-height: var(--tap-target-min, 44px);\n    align-items: center;\n    border-block-end: 1px solid var(--color-border-hairline);\n    font-family: var(--font-heading-family);\n    font-size: 1.125rem;\n    line-height: 1.2;\n  }\n\n  .mega-menu__sublist {\n    display: grid;\n    padding-block-start: var(--space-1);\n  }\n\n  .mega-menu__sublist a {\n    display: flex;\n    min-height: var(--tap-target-min, 44px);\n    align-items: center;\n    font-size: 0.875rem;\n  }\n\n  .mega-menu__column-title:hover,\n  .mega-menu__sublist a:hover,\n  .mega-menu__view-all:hover {\n    text-decoration: underline;\n    text-decoration-thickness: 1px;\n    text-underline-offset: 0.25em;\n  }\n\n  .mega-menu__promos {\n    display: grid;\n    grid-auto-columns: 15rem;\n    grid-auto-flow: column;\n    gap: var(--space-4);\n  }\n\n  .mega-menu__promo-card {\n    display: grid;\n    min-height: var(--tap-target-min, 44px);\n    align-content: start;\n    gap: var(--space-1);\n  }\n\n  /* Retrato 4:5 fijo: la foto ocupa su hueco antes de llegar y no mueve el texto. */\n  .mega-menu__promo-media {\n    display: block;\n    overflow: hidden;\n    margin-block-end: var(--space-1);\n    aspect-ratio: 4 / 5;\n    background: var(--color-surface);\n  }\n\n  .mega-menu__promo-image {\n    display: block;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n  }\n\n  .mega-menu__promo-heading {\n    font-family: var(--font-heading-family);\n    font-size: 1.125rem;\n    line-height: 1.25;\n  }\n\n  .mega-menu__promo-subheading {\n    font-size: 0.8125rem;\n    line-height: 1.45;\n  }\n\n  a.mega-menu__promo-card:hover .mega-menu__promo-heading {\n    text-decoration: underline;\n    text-decoration-thickness: 1px;\n    text-underline-offset: 0.2em;\n  }\n\n  html[data-animations=\'full\'] .mega-menu__promo-image {\n    transition: transform var(--motion-slow) var(--ease-move);\n  }\n\n  /* El mismo gesto que la foto de la tarjeta de producto. */\n  html[data-animations=\'full\'] a.mega-menu__promo-card:hover .mega-menu__promo-image {\n    transform: scale(1.025);\n  }\n}\n'
SCHEMA_BLOCKS = json.loads('{"mega_menu_promo": {"name": "Mega menu promotion", "settings": {"menu_item": {"label": "Menu item", "info": "Name of the top-level menu item that opens this mega menu, for example \\"Catalog\\". Capitals don\'t matter, and in other languages the translated name also works. The item needs sub-links. Items with three levels of links open a mega menu even without this block."}, "card_1": {"content": "Card 1"}, "image_1": {"label": "Image", "info": "Shown in portrait, 4:5. Use an image at least 800 px wide."}, "heading_1": {"label": "Heading"}, "subheading_1": {"label": "Subheading"}, "link_1": {"label": "Link"}, "card_2": {"content": "Card 2"}, "image_2": {"label": "Image", "info": "Shown in portrait, 4:5. Use an image at least 800 px wide."}, "heading_2": {"label": "Heading"}, "subheading_2": {"label": "Subheading"}, "link_2": {"label": "Link"}}}}')
p = {'css': CSS, 'schema_blocks': SCHEMA_BLOCKS, 'en': {'featured': 'Featured'}, 'es': {'featured': 'Destacados'}}
log = []

def canon(path):
    raw = open(path, encoding='utf-8').read()
    d = json.loads(raw)
    nl = '\n' if raw.endswith('\n') else ''
    return raw, d, nl, (json.dumps(d, indent=2, ensure_ascii=False) + nl) == raw

path = os.path.join(root, 'assets/base.css')
css = open(path, encoding='utf-8').read()
if '5C-001. Mega Men' in css:
    log.append('base.css: bloque ya presente')
else:
    open(path, 'w', encoding='utf-8').write(css.rstrip('\n') + '\n' + p['css'])
    log.append('base.css: bloque anadido al final')

for f, key in [('locales/en.default.json', 'en'), ('locales/es.json', 'es')]:
    path = os.path.join(root, f)
    raw, d, nl, ok = canon(path)
    if not ok:
        log.append(f + ': formato no canonico, NO tocado'); continue
    h = d['sections']['header']
    if 'mega_menu' in h:
        log.append(f + ': clave ya presente'); continue
    h['mega_menu'] = p[key]
    open(path, 'w', encoding='utf-8').write(json.dumps(d, indent=2, ensure_ascii=False) + nl)
    log.append(f + ': sections.header.mega_menu anadida')

path = os.path.join(root, 'locales/en.default.schema.json')
raw, d, nl, ok = canon(path)
if not ok:
    log.append('schema: formato no canonico, NO tocado')
elif 'blocks' in d['sections']['header']:
    log.append('schema: bloques ya presentes')
else:
    d['sections']['header']['blocks'] = p['schema_blocks']
    open(path, 'w', encoding='utf-8').write(json.dumps(d, indent=2, ensure_ascii=False) + nl)
    log.append('schema: sections.header.blocks anadido')
print('\n'.join(log))
