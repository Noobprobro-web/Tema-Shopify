import json,sys
en,ship,gift=sys.argv[1:4]
f='gate5/config/settings_data.json'
d=json.load(open(f)); c=d['current']
s={'enable_tiered_progress':en=='1'}
if ship!='-': s['free_shipping_threshold']=int(ship)
if gift!='-': s['atelier_gift_threshold']=int(gift)
c.setdefault('sections',{})['cart-drawer']={'type':'cart-drawer','settings':s}
json.dump(d,open(f,'w'),indent=2)
