import json,hashlib,re,html,sys
from html.parser import HTMLParser
d=json.load(open(sys.argv[1],encoding='utf-8'))
BLOCK={'p','li','h1','h2','h3','h4'}
class U(HTMLParser):
  def __init__(s): super().__init__(convert_charrefs=True); s.stack=[]; s.units=[]; s.buf=[]
  def handle_starttag(s,t,a):
    if t in BLOCK: s.stack.append(len(s.buf)); s.buf.append('')
  def handle_endtag(s,t):
    if t in BLOCK and s.stack:
      i=s.stack.pop(); txt=''.join(s.buf[i:]); s.units.append(txt)
  def handle_data(s,x): s.buf.append(x)
def units(v):
  if '<' not in v: return [re.sub(r'\s+',' ',html.unescape(v)).strip()]
  p=U(); p.feed(v); return [re.sub(r'\s+',' ',u).strip() for u in p.units if u.strip()]
h=lambda t: hashlib.sha256(t.encode()).hexdigest()[:8]
PAGE={'index.json':'/es','page.about.json':'/es/pages/about','page.contact.json':'/es/pages/contact','page.documentation.json':'/es/pages/documentation','page.faq.json':'/es/pages/faq','page.support.json':'/es/pages/support','product.json':'PRODUCT','sections/header-group.json':'/es'}
exp={}; eng={}; labels={}
def add(page,es,en):
  for u in units(es): exp.setdefault(page,[]); hh=h(u); exp[page].append(hh); labels[hh]=u[:50]
  for u in units(en): eng.setdefault(page,[]); eng[page].append(h(u)); labels[h(u)]='EN:'+u[:50]
for f,entries in d['theme'].items():
  for p,e in entries.items():
    if e.get('pending_deploy'): continue
    page=PAGE[f]
    if e['es'].startswith('/es/'):
      exp.setdefault(page,[]).append(h('HREF:'+e['es'])); labels[h('HREF:'+e['es'])]='HREF:'+e['es']; continue
    add(page,e['es'],e['en'])
T={t['en']:t['es'] for t in d['titles']}
for en,page in [('Contact','/es/pages/contact'),('Documentation','/es/pages/documentation'),('Support','/es/pages/support'),('Frequently asked questions','/es/pages/faq'),('About','/es/pages/about'),('Shipping & returns','/es/pages/policy')]: add(page,T[en],en)
for en in ['Home','Catalog','Contact','Search','Outerwear','Knitwear','Tailoring','Accessories','The Autumn Series','The Permanent Collection','About','FAQ','Shipping & returns','Documentation','Support']: add('/es',T[en],en)
for en in ['Outerwear','Knitwear','Tailoring','Accessories','The Autumn Series','The Permanent Collection']: add('/es/collections',T[en],en)
b=d['page_bodies']['policy']; add('/es/pages/policy',b['es'],b['en'])
exp={k:sorted(set(v)) for k,v in exp.items()}; eng={k:sorted(set(v)-set(exp.get(k,[]))) for k,v in eng.items()}
json.dump({'exp':exp,'eng':eng},open(sys.argv[2],'w'),separators=(',',':'))
json.dump(labels,open(sys.argv[3],'w'),ensure_ascii=False,indent=0)
print({k:len(v) for k,v in exp.items()}, {k:len(v) for k,v in eng.items()}, 'bytes', len(open(sys.argv[2]).read()))
