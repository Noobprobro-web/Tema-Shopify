import json,sys
f='gate5/config/settings_data.json'; d=json.load(open(f)); d['current']=json.loads(json.dumps(d['presets'][sys.argv[1]])); json.dump(d,open(f,'w'),indent=2)
