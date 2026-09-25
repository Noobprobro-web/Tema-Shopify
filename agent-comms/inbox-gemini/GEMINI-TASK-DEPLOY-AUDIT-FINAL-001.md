# GEMINI-TASK-DEPLOY-AUDIT-FINAL-001: Commit y despliegue de las correcciones de AUDIT-FINAL

```text
Ruta: agent-comms/inbox-gemini/GEMINI-TASK-DEPLOY-AUDIT-FINAL-001.md
Origen: Johandry pidió a Claude en el chat "arregla lo que encontraste"
Informe: agent-comms/outbox-claude/CLAUDE-REPORT-FIXES-AUDIT-FINAL-001.md
Base: master 9b0b126. Hay 7 archivos modificados sin commit; gates:static en verde sobre ellos.
```

## 1. Commit

```bash
git add assets/base.css assets/theme.js locales/en.default.schema.json \
  sections/featured-product.liquid sections/hero-editorial.liquid sections/main-product.liquid \
  templates/gift_card.liquid \
  agent-comms/outbox-claude/CLAUDE-REPORT-FIXES-AUDIT-FINAL-001.md \
  agent-comms/outbox-claude/harness-FIXES-AUDIT-FINAL-001 \
  agent-comms/inbox-gemini/GEMINI-TASK-DEPLOY-AUDIT-FINAL-001.md
git commit -m "fix(audit): AF-07 to AF-14 inventory cap, sticky bar focus, long titles, hero sizes, orphan schema keys, inline handler"
npm run gates:static   # debe dar exit 0 y regenerar Sartorial-1.0.0.zip
```

## 2. Despliegue del código a los 4 temas

Hay que subir estos 10 archivos, que traen 02194ee, 9b0b126 y este commit. Van **sin plantillas JSON ni `config/settings_data.json`**:
- En Couture, `templates/index.json` y la configuración tienen ediciones del comerciante.
- En los presets, las plantillas vienen de su listing (paso 3).

```bash
FILES="--only assets/base.css --only assets/theme.js --only locales/en.default.schema.json \
  --only sections/cart-drawer.liquid --only sections/main-cart-items.liquid --only sections/main-search.liquid \
  --only sections/featured-product.liquid --only sections/hero-editorial.liquid --only sections/main-product.liquid \
  --only templates/gift_card.liquid"
shopify theme push --store tema-qkqpke0j.myshopify.com --theme 165809488115 --allow-live --nodelete $FILES
shopify theme push --store tema-qkqpke0j.myshopify.com --theme 166186909939 --nodelete $FILES
shopify theme push --store tema-qkqpke0j.myshopify.com --theme 166186942707 --nodelete $FILES
shopify theme push --store tema-qkqpke0j.myshopify.com --theme 166187041011 --nodelete $FILES
```

## 3. Plantillas del listing en cada preset

Hoy solo Sartorial tiene su `collection.json`. A Edition y Archive les falta el suyo, y Archive necesita además el `index.json` con el velo al 60 % (AF-01).

```bash
for p in sartorial:166186909939 edition:166186942707 archive:166187041011; do
  name=${p%%:*}; id=${p##*:}; tmp=$(mktemp -d); mkdir -p "$tmp/templates"
  cp listings/$name/templates/*.json "$tmp/templates/"
  shopify theme push --store tema-qkqpke0j.myshopify.com --theme $id --path "$tmp" --nodelete \
    --only templates/index.json --only templates/collection.json --only templates/product.json
done
```

## 4. Después del despliegue

1. Avisar a Claude. Claude comprueba:
   - los MD5 de los 4 temas contra el commit, por Admin API;
   - el hero de Archive en vivo: el subtítulo debe dar 4.85 o más a 1280 y 5.22 o más a 375;
   - la ficha de F10, con el botón de compra dentro de 1280x800.
2. AF-08 no se puede probar con el panel oculto. Hace falta teclado físico en `/products/qa5a-f04-colour-size` a 375: tabular desde "Add to cart" hasta el pie. Ningún foco debe quedar tapado por la barra fija.

## 5. BOARD

Corregir tres líneas de 9b0b126 que la tienda no confirma. Van ciertas solo después de los pasos 2 y 3:
- Plantillas de colección desplegadas en Edition y Archive.
- Zip "sincronizado a los 4 temas".
- "CERTIFICADO": el dictamen de Claude sigue siendo CERTIFICADO CON OBSERVACIONES hasta el paso 4.

## 6. Para Johandry (no automatizable desde aquí)

Borrar `layout/password.liquid` (48 bytes, no está en el repo) de los 4 temas, desde "Editar código" (AF-12).
