#!/usr/bin/env bash
# Descarga assets/base.css y assets/theme.js de los 3 rc3 (CLI, token por entorno) y compara SHA-256 con el repo.
# Uso: deployed-sha.sh <commit> <scratchdir> <out.json>
set -u
C=$1; S=$2; OUT=$3
for p in sartorial:190317920560 imprint:190317953328 archive:190317986096; do n=${p%%:*}; id=${p##*:}; mkdir -p $S/pull/$n
 (cd $S/pull/$n && rm -f assets/base.css assets/theme.js && timeout 120 npx --prefix /home/user/Tema-Shopify shopify theme pull --theme $id --only assets/base.css --only assets/theme.js --path . --force --no-color >/dev/null 2>&1); sleep 4; done
node -e '
const fs=require("fs"),c=require("crypto");const h=f=>c.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
const [C,S,OUT]=process.argv.slice(1);const out={repoCommit:C,repo:{"assets/base.css":h("assets/base.css"),"assets/theme.js":h("assets/theme.js")},themes:{}};
for(const [n,id] of [["sartorial","190317920560"],["imprint","190317953328"],["archive","190317986096"]]){const t={id};for(const f of ["assets/base.css","assets/theme.js"]){const p=S+"/pull/"+n+"/"+f;const d=fs.existsSync(p)?h(p):null;t[f]={sha256:d,matchesRepo:d===out.repo[f]}}out.themes[n]=t}
fs.writeFileSync(OUT,JSON.stringify(out,null,2));console.log(JSON.stringify(Object.fromEntries(Object.entries(out.themes).map(([k,v])=>[k,[v["assets/base.css"].matchesRepo,v["assets/theme.js"].matchesRepo]]))))' $C $S $OUT
