import json,re,sys,collections
def load(p):
    raw=open(p).read(); return json.loads(raw[raw.index('{'):])
SHOP=['origin-trial','A “link” element with an “as” attribute','“version” not allowed on element “link”','type=module” must not have a “defer”','speculationrules','“payment” not allowed on element “link”']
INFO=['Element “style” not allowed as child of element “div”','Bad value “combobox” for attribute “role” on element “input”','Attribute “aria-expanded” not allowed on element “input”']
def classify(m):
    msg=m['message']
    if any(k in msg for k in SHOP): return 'shopify'
    if any(k in msg for k in INFO): return 'informativo'
    return 'tema'
for label,p in [('antes',sys.argv[1]),('despues',sys.argv[2])]:
    d=load(p); c=collections.Counter(); msgs=collections.Counter()
    for m in d['messages']:
        if m['type']!='error': continue
        k=classify(m); c[k]+=1
        if k=='tema': msgs[re.sub(r'“(CardTitle|quick)[^”]*”','“ID…”',m['message'])[:110]]+=1
    print(label, dict(c), 'total', sum(c.values()))
    for k,v in msgs.most_common(): print('   ',v,k)
