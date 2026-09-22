# schema-defaults.py (LOCALE-AUDIT-001): lista ajustes de texto/url con default en el esquema que la plantilla no declara.
# Esos textos salen del esquema y no son traducibles desde la tienda. Uso: python3 schema-defaults.py (desde la raiz del tema)
import json,re,glob,os
def load(f):
  t=open(f).read(); t=re.sub(r'^\s*/\*.*?\*/','',t,flags=re.S); return json.loads(t)
def schema(typ):
  p=f"sections/{typ}.liquid"
  if not os.path.exists(p): return None
  t=open(p).read(); m=re.search(r'{%-?\s*schema\s*-?%}(.*?){%-?\s*endschema',t,re.S); return json.loads(m.group(1))
TX={'text','textarea','richtext','inline_richtext','html','url'}
files=['templates/index.json','templates/page.about.json','templates/page.contact.json','templates/page.documentation.json','templates/page.faq.json','templates/page.support.json','templates/product.json','templates/page.policy.json','templates/page.json','templates/collection.json','templates/list-collections.json','templates/cart.json','templates/search.json','templates/404.json','templates/blog.json','templates/article.json','templates/password.json','sections/header-group.json','sections/footer-group.json']
for f in files:
  j=load(f)
  for sid,s in j.get('sections',{}).items():
    sc=schema(s['type'])
    if not sc: continue
    for x in sc.get('settings',[]):
      if x.get('type') in TX and x.get('default') not in (None,'') and x['id'] not in s.get('settings',{}):
        print(f"{f}\t{sid}.{x['id']}\t{x['type']}\t{x['default']!r}")
    bdefs={b['type']:b for b in sc.get('blocks',[]) if 'type' in b}
    for bid,b in (s.get('blocks') or {}).items():
      bd=bdefs.get(b['type'])
      if not bd: continue
      for x in bd.get('settings',[]):
        if x.get('type') in TX and x.get('default') not in (None,'') and x['id'] not in (b.get('settings') or {}):
          print(f"{f}\t{sid}.{bid}.{x['id']}\t{x['type']}\t{x['default']!r}")
