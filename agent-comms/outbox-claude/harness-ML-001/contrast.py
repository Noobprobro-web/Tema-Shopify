import json, re
raw=open('/home/claude/w2/config/settings_data.json').read()
raw=re.sub(r'/\*.*?\*/','',raw,flags=re.S)
data=json.loads(raw)
def hx(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def lum(c):
    def ch(v):
        v=v/255; return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4
    r,g,b=c; return 0.2126*ch(r)+0.7152*ch(g)+0.0722*ch(b)
def cr(a,b):
    la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb); return (hi+0.05)/(lo+0.05)
def mix(a,b,p): return tuple(round(a[i]*p+b[i]*(1-p)) for i in range(3))
def hexs(c): return '#%02X%02X%02X'%c
PAIRS=[('Texto / fondo','text','bg',4.5),('Texto atenuado 72% / fondo','muted','bg',4.5),('Enlace / fondo','link','bg',4.5),('Texto / superficie','text','surface',4.5),('Atenuado / superficie','muted','surface',4.5),('Etiqueta / botón','button_label','button',4.5),('Botón / fondo','button','bg',3.0),('Borde de campo (60%) / fondo','control','bg',3.0),('Borde / fondo','border','bg',3.0)]
out={}
for preset in ['Sartorial','Edition','Archive']:
    schemes=data['presets'][preset]['color_schemes']
    rows=[]
    for sid,s in schemes.items():
        st=s['settings']; bg=hx(st['background']); fg=hx(st['text'])
        c={'bg':bg,'text':fg,'muted':mix(fg,bg,0.72),'link':hx(st['secondary_button_label']),'surface':mix(bg,fg,0.94),'button':hx(st['button']),'button_label':hx(st['button_label']),'control':mix(fg,bg,0.60),'border':hx(st['border'])}
        for name,a,b,need in PAIRS:
            r=cr(c[a],c[b]); rows.append((sid,name,hexs(c[a]),hexs(c[b]),round(r,2),need,r>=need))
    out[preset]=rows
json.dump(out,open('/tmp/claude-0/-home-claude/d73764fe-4b4e-52bf-897c-0328b17337e3/scratchpad/ml/contrast.json','w'),indent=1)
for p,rows in out.items():
    fails=[r for r in rows if not r[6]]
    print(f'== {p}: {len(rows)} pares, {len(fails)} fallos')
    for r in rows:
        if not r[6] or r[4] < r[5]*1.1: print('  ', 'FALLA' if not r[6] else 'justo', r)
