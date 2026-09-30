# Compara archivo por archivo el tema publicado en cada demo (descargado con `shopify theme pull`,
# solo lectura) contra el repositorio en HEAD, que es la fuente de Sartorial-1.0.0.zip.
# Uso: python 26-deploy-vs-repo.py <carpeta con full-atelier/, full-edition/, full-archive/>
# Las plantillas se comparan contra listings/<preset>/templates/ cuando existen (así se despliegan).
import json
import os
import sys

pulled = sys.argv[1]
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
PRESET = {'atelier': 'sartorial', 'edition': 'edition', 'archive': 'archive'}
TOPS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'blocks']


def rel_files(root, tops):
    out = set()
    for top in tops:
        base = os.path.join(root, top)
        if not os.path.isdir(base):
            continue
        for d, _, files in os.walk(base):
            for f in files:
                out.add(os.path.relpath(os.path.join(d, f), root).replace(os.sep, '/'))
    return out


def load(path):
    data = open(path, 'rb').read().replace(b'\r\n', b'\n').rstrip(b'\n')
    if path.endswith('.json'):
        text = data.decode('utf-8')
        if text.startswith('/*'):
            text = text.split('*/', 1)[1]
        try:
            return ('json', json.loads(text))
        except ValueError:
            pass
    return ('raw', data)


summary = {}
for store, preset in PRESET.items():
    remote_root = os.path.join(pulled, 'full-' + store)
    remote = rel_files(remote_root, TOPS)
    repo = rel_files(repo_root, TOPS)
    different, missing, extra = [], [], []
    for rel in sorted(remote | repo):
        if rel == 'config/settings_data.json':
            continue  # cambia por tienda a propósito (preset activo y ajustes del comerciante)
        local = os.path.join(repo_root, rel)
        listing = os.path.join(repo_root, 'listings', preset, rel)
        if rel.startswith('templates/') and os.path.exists(listing):
            local = listing
        if rel not in remote:
            missing.append(rel)
            continue
        if not os.path.exists(local):
            extra.append(rel)
            continue
        if load(local) != load(os.path.join(remote_root, rel)):
            different.append(rel)
    summary[store] = {'different': different, 'missing_in_deployed': missing, 'only_in_deployed': extra}
    print(f'## {store}: {len(different)} distintos {different}')
    print(f'   faltan en el tema publicado: {missing}')
    print(f'   solo en el tema publicado: {extra}')

json.dump(summary, open(os.path.join(os.path.dirname(__file__), 'results-26-deploy-vs-repo.json'), 'w'), indent=1)
