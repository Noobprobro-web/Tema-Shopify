ID: CLAUDE-REPORT-A-02-001
Fecha: 2026-11-04
Autor: Claude (Sonnet 5.5), implementador. Modelo: claude-sonnet-5-5.
Estado: Implementado; «código completo» (D22); pendiente de revisión D11, de commit del coordinador (un único commit F1+F2+F3+F4) y de las pruebas R-A en tienda (PENDIENTES DE CREDENCIALES). Nada se declara `cumplido`.
Decisión requerida: Ninguna de Johandry. Revisión D11 por el revisor Opus de contexto limpio y commit por el coordinador.
Resumen en 5 líneas:
1. Retiradas las 14 fuentes automáticas (`custom.*` x10, `sartorial.*` x4) y las heurísticas H1–H8 de `snippets/product-technical-specs.liquid` y `snippets/product-provenance.liquid`; sin lectores sustitutos ni metafields nuevos.
2. Especificaciones y procedencia salen solo de los settings del bloque; con todo vacío no se renderiza nada en la tienda (procedencia conserva `editor_empty`).
3. Vaciado `provenance_notes` del producto destacado de Archive home (`listings/archive/templates/index.json:111`).
4. PD-1 aplicado (L-1): siete `info` de `locales/en.default.schema.json`. M-1..M-9 de la R-D incorporados (M-4 aplicado al comentario de F2).
5. V1–V15 y V5b pasan; Theme Check 92 archivos sin ofensas; hashes finales coinciden con los de la R-D (M-6).
Archivos tocados:
- `snippets/product-technical-specs.liquid` (F1): líneas 1–19 (comentario 1–12; bloque `liquid` 14–19); render 21–53 intacto.
- `snippets/product-provenance.liquid` (F2): comentario 3–5 (M-4); bloque 27–39 (sustituye a las 26–49 originales); resto intacto.
- `listings/archive/templates/index.json` (F3): línea 111, un valor.
- `locales/en.default.schema.json` (F4): líneas 1011, 1015, 1019, 1023, 1035, 1043, 1067 (siete `info`).
- `agent-comms/outbox-claude/CLAUDE-REPORT-A-02-001.md` (R): este informe.
Desviaciones (Nivel 1 o Nivel 2):
- Nivel 2 autorizado por `CLAUDE-REVIEW-A-02-RD-001` (D11), con condiciones (a)–(d) de su §2: (a) solo F1–F4 + informe, cumplido (V7); (b) un único commit, a cargo del coordinador; (c) máximo «código completo»; (d) aviso en C-04-R abierto.
- Nivel 1 (D-1): la rama activa es `lote0/base-09f8342`, no `lote-a` (el coordinador la creará al hacer commit, instrucción del encargo). El preflight «rama = lote-a» no se cumple literalmente; se sustituye por `git merge-base --is-ancestor eb7cca7 HEAD` = BASE_OK. Sin efecto técnico.
- Nivel 1 (D-2): se usó `rd-a02-tools/apply.py` de la R-D para F1.a, F1.b, F2.b, F3 y F4 (cada sustitución con conteo 1 afirmado) y después se aplicó M-4 sobre el comentario de F2 con una sustitución de conteo 1 propia. Salidas `APPLIED` y `M4 ok`.
- Aparecieron durante el turno más archivos `??` en `agent-comms/outbox-claude/` (p. ej. `CLAUDE-REVIEW-A-03-RD-001.md`): de otros agentes, permitidos por M-1; no tocados.
Hallazgos extra fuera de alcance (con parche listo): Sin parche (M-7, §9 de este informe).
Verificación: §5 (salidas literales). Estática; no sustituye la prueba en tienda.
Lista de afirmaciones falsables numeradas:
1. `git hash-object` finales: F1 `68354c31e7357f40bdf1385fa1916013cc1fa756`, F2 `2a624b236b5c31242fd3b6c042894196afb6baa7`, F3 `68f4b21a2812b6ec4302e8420f164c8d85994a9a`, F4 `34122e73def9ea02e0d43613da59341c71989b15` (idénticos a la R-D, M-6).
2. V1, V2, V4, V5 y V5b sin salida; V3 una línea (`snippets/cart-drawer-recommendations.liquid:80`, `metafields.custom.complementary_products`); V6 `0`; V8 `UNTOUCHED_OK`; V13 sin salida; V14 `F3_OK`; V15 `F4_OK`.
3. Theme Check: «92 files inspected with no offenses found.», exit 0; locale-key-inventory 0/0 sin resolver y 0/0 huérfanas; theme-check-sanity OK; json-validate 0 fallos.
4. `git diff --name-only` = {F1, F2, F3, F4}; `sections/`, `assets/`, `config/`, `templates/`, `listings/imprint`, locales de storefront sin cambios.
5. `grep -rn "product\.type" snippets sections` no devuelve nada tras el cambio.

---

# 1. Identidad y preflight

Rama: `lote0/base-09f8342`. HEAD antes de editar: `eb7cca797f9de142089c6c14daaa5ed449597f9f`. Modelo: claude-sonnet-5-5. Fecha: 2026-11-04.

```text
$ git rev-parse --abbrev-ref HEAD
lote0/base-09f8342
$ git rev-parse HEAD
eb7cca797f9de142089c6c14daaa5ed449597f9f
$ git merge-base --is-ancestor eb7cca7 HEAD && echo BASE_OK
BASE_OK
$ git status --porcelain -- assets config layout locales sections snippets templates listings scripts docs | wc -l     (M-1)
0
$ git status --porcelain     (M-1; solo ?? agent-comms/ admitidos)
?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-01-B-02-001.md
?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-02-001.md
?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-03-001.md
?? agent-comms/outbox-claude/CLAUDE-REVIEW-A-02-RD-001.md
$ git hash-object snippets/product-technical-specs.liquid snippets/product-provenance.liquid listings/archive/templates/index.json locales/en.default.schema.json
201343dd3e088698f74c850ef6cc9240ff3aa7ee
ca9796ea1a64c256b11e2c314b561d0657e41677
ce4ee46bbdcd72ce925feda88cf39339820e93c7
2a628d9be95a4a74ea266d9d4cf46924ae942981
$ (script M-2)
SECTIONS_OK
$ (script PRE_OK de §1.2)
PRE_OK
```

Línea base antes de editar (eb7cca7): Theme Check «92 files inspected with no offenses found.» exit 0; theme-check-sanity OK exit 0; locale-key-inventory Sin resolver 0/0, huérfanas 0/0, «OK», exit 0; json-validate exit 0 (en la base solo se comprobó el texto de salida, con la salida filtrada por `tail`; los exit codes reales de las compuertas están en §5, ejecución final).

# 2. Decisiones PD aplicadas (R-D `CLAUDE-REVIEW-A-02-RD-001` §6.1)

- PD-1 SÍ: F4 aplicado (siete `info`, V15 = `F4_OK`).
- PD-2 SÍ: guarda `contains '{{'` conservada (`snippets/product-provenance.liquid:29–31`).
- PD-3 NO: sin aviso de editor en especificaciones (hallazgo para Lote C, §9).
- PD-4: sin cambio de estado en «Presets Diferenciados» (`docs/requirements-ledger.md:109`).
- PD-5: no se crea fila de ledger; el implementador no edita el ledger.

# 3. Diff

```diff
 assets/base.css                         |  7 ++-
 listings/archive/templates/index.json   |  2 +-
 locales/en.default.schema.json          | 14 +++---
 snippets/product-provenance.liquid      | 28 ++++--------
 snippets/product-technical-specs.liquid | 81 +++------------------------------
 5 files changed, 29 insertions(+), 103 deletions(-)

diff --git a/listings/archive/templates/index.json b/listings/archive/templates/index.json
index ce4ee46..68f4b21 100644
--- a/listings/archive/templates/index.json
+++ b/listings/archive/templates/index.json
@@ -108,7 +108,7 @@
             "circa_year": "",
             "show_unique_piece": false,
             "condition_grade": "not_assessed",
-            "provenance_notes": "<p>Curated period selection with documented archival provenance.</p>"
+            "provenance_notes": ""
           }
         },
         "description": { "type": "description" },
diff --git a/locales/en.default.schema.json b/locales/en.default.schema.json
index 2a628d9..34122e7 100644
--- a/locales/en.default.schema.json
+++ b/locales/en.default.schema.json
@@ -1008,19 +1008,19 @@
             },
             "material": {
               "label": "Material composition",
-              "info": "Displays fabric composition or material blend."
+              "info": "Displays fabric composition or material blend. Shown as entered on every product that displays this block."
             },
             "gsm": {
               "label": "Fabric weight (GSM)",
-              "info": "Enter a documented fabric mass per square meter. This is not the garment or shipping weight."
+              "info": "Enter a documented fabric mass per square meter. This is not the garment or shipping weight. Shown as entered on every product that displays this block."
             },
             "hardware": {
               "label": "Hardware and trims",
-              "info": "Add the actual manufacturer, series and finish for this product. Leave unknown details blank."
+              "info": "Add the actual manufacturer, series and finish. Shown as entered on every product that displays this block. Leave unknown details blank."
             },
             "origin": {
               "label": "Origin and craftsmanship",
-              "info": "Use documented product data. Fabric origin and manufacturing location can differ."
+              "info": "Use documented product data. Fabric origin and manufacturing location can differ. Shown as entered on every product that displays this block."
             }
           }
         },
@@ -1032,7 +1032,7 @@
             },
             "circa_year": {
               "label": "Circa year",
-              "info": "Era or estimated year of production. Leave blank if unconfirmed."
+              "info": "Era or estimated year of production. Shown as entered on every product that displays this block. Leave blank if unconfirmed."
             },
             "show_unique_piece": {
               "label": "Show unique piece label",
@@ -1040,7 +1040,7 @@
             },
             "condition_grade": {
               "label": "Condition grade",
-              "info": "Select a grade only after inspection. Disclose damage, repairs and use restrictions separately.",
+              "info": "Select a grade only after inspection. Disclose damage, repairs and use restrictions separately. Shown as entered on every product that displays this block.",
               "options": {
                 "not_assessed": {
                   "label": "Not assessed"
@@ -1064,7 +1064,7 @@
             },
             "provenance_notes": {
               "label": "Provenance notes",
-              "info": "Historical context, collection season or archival record notes."
+              "info": "Historical context, collection season or archival record notes. Shown as entered on every product that displays this block."
             }
           }
         }
diff --git a/snippets/product-provenance.liquid b/snippets/product-provenance.liquid
index ca9796e..2a624b2 100644
--- a/snippets/product-provenance.liquid
+++ b/snippets/product-provenance.liquid
@@ -1,7 +1,8 @@
 {%- comment -%}
   Renders product provenance block for vintage/archive pieces.
-  Each row renders only when backed by verified product data or explicit settings.
-  Without verified data, nothing renders in the storefront.
+  Rows come only from this block's settings, which show as entered for every product that displays the block.
+  The unique piece label also checks the product's variant count and inventory settings.
+  With every setting empty or off, nothing renders in the storefront.
   Accepts:
   - block: {Object} Block object with settings and shopify_attributes.
   - product: {Object} Product Liquid object.
@@ -23,30 +24,19 @@
     assign unique_piece = true
   endif

-  # Provenance year: read from product metafields first (provenance_date, era, circa_year)
-  assign provenance_year = product.metafields.custom.provenance_date.value | default: product.metafields.custom.provenance_date | default: product.metafields.custom.era.value | default: product.metafields.custom.era | default: product.metafields.custom.circa_year.value | default: product.metafields.custom.circa_year
-
-  # If no product metafield exists: only use block.settings.circa_year if it is a verified archival product (has year in title/tags or archive type), preventing fixed 'Circa 1990' on generic products
-  if provenance_year == blank and block.settings.circa_year != blank
-    assign setting_year_clean = block.settings.circa_year | strip
-    unless setting_year_clean contains '{{' or setting_year_clean == blank
-      assign p_title_lower = product.title | downcase
-      assign p_type_lower = product.type | downcase
-      if p_title_lower contains '19' or p_title_lower contains '20' or p_title_lower contains 'archive' or p_title_lower contains 'vintage' or p_type_lower contains 'archive' or p_type_lower contains 'vintage'
-        assign provenance_year = setting_year_clean
-      endif
-    endunless
+  # Year, condition grade and notes come only from this block's settings.
+  assign provenance_year = block.settings.circa_year | strip
+  if provenance_year contains '{{'
+    assign provenance_year = ''
   endif

-  # Condition grade: read from metafield if present, fallback to block setting if assessed
-  assign condition_grade_val = product.metafields.custom.condition_grade.value | default: product.metafields.custom.condition_grade | default: block.settings.condition_grade
+  assign condition_grade_val = block.settings.condition_grade
   assign show_grade = false
   if condition_grade_val != blank and condition_grade_val != 'not_assessed'
     assign show_grade = true
   endif

-  # Provenance notes
-  assign provenance_notes_val = product.metafields.custom.provenance_notes.value | default: product.metafields.custom.provenance_notes | default: block.settings.provenance_notes
+  assign provenance_notes_val = block.settings.provenance_notes
 -%}

 {%- if unique_piece or show_grade or provenance_year != blank or provenance_notes_val != blank -%}
diff --git a/snippets/product-technical-specs.liquid b/snippets/product-technical-specs.liquid
index 201343d..68354c3 100644
--- a/snippets/product-technical-specs.liquid
+++ b/snippets/product-technical-specs.liquid
@@ -1,8 +1,10 @@
 {%- comment -%}
   Renders product technical specifications block.
+  Values come only from this block's settings and show as entered for every product that displays the block.
+  With every value empty, nothing renders.
   Accepts:
   - block: {Object} Block object with settings and shopify_attributes.
-  - product: {Object} Product Liquid object (optional).
+  - product: {Object} Product Liquid object (optional, not read; kept so existing render calls stay valid).
   - heading_tag: {String} Heading level for the parent context (optional, defaults to h3).

   Usage:
@@ -10,79 +12,10 @@
 {%- endcomment -%}

 {%- liquid
-  assign material_val = blank
-  assign gsm_val = blank
-  assign hardware_val = blank
-  assign origin_val = blank
-
-  if product != blank
-    # 1. Direct metafields
-    assign material_val = product.metafields.custom.material.value | default: product.metafields.custom.material | default: product.metafields.sartorial.material.value | default: product.metafields.sartorial.material
-    assign gsm_val = product.metafields.custom.gsm.value | default: product.metafields.custom.gsm | default: product.metafields.sartorial.gsm.value | default: product.metafields.sartorial.gsm
-    assign hardware_val = product.metafields.custom.hardware.value | default: product.metafields.custom.hardware | default: product.metafields.sartorial.hardware.value | default: product.metafields.sartorial.hardware
-    assign origin_val = product.metafields.custom.origin.value | default: product.metafields.custom.origin | default: product.metafields.sartorial.origin.value | default: product.metafields.sartorial.origin
-
-    # 2. JSON-structured technical_specs metafield
-    if product.metafields.custom.technical_specs.value != blank
-      assign ts = product.metafields.custom.technical_specs.value
-      if ts.material != blank and material_val == blank
-        assign material_val = ts.material
-      endif
-      if ts.gsm != blank and gsm_val == blank
-        assign gsm_val = ts.gsm
-      endif
-      if ts.hardware != blank and hardware_val == blank
-        assign hardware_val = ts.hardware
-      endif
-      if ts.origin != blank and origin_val == blank
-        assign origin_val = ts.origin
-      endif
-    endif
-
-    # 3. Product context guards (avoid leather/textile claims on metal/desk objects)
-    assign product_type_lower = product.type | downcase
-    assign product_handle_lower = product.handle | downcase
-
-    assign is_non_textile = false
-    if product_type_lower contains 'desk' or product_type_lower contains 'object' or product_type_lower contains 'metal' or product_type_lower contains 'hardware' or product_handle_lower contains 'brass' or product_handle_lower contains 'paperweight'
-      assign is_non_textile = true
-    endif
-
-    if material_val == blank
-      if is_non_textile
-        if product_handle_lower contains 'brass' or product_handle_lower contains 'paperweight'
-          assign material_val = 'Solid milled brass'
-        elsif product.type != blank
-          assign material_val = product.type
-        endif
-      else
-        assign material_val = block.settings.material
-      endif
-    endif
-
-    if gsm_val == blank and is_non_textile == false
-      assign gsm_val = block.settings.gsm
-    endif
-
-    if hardware_val == blank
-      if is_non_textile
-        if product_handle_lower contains 'brass' or product_handle_lower contains 'paperweight'
-          assign hardware_val = 'Precision machined'
-        endif
-      else
-        assign hardware_val = block.settings.hardware
-      endif
-    endif
-
-    if origin_val == blank
-      assign origin_val = block.settings.origin
-    endif
-  else
-    assign material_val = block.settings.material
-    assign gsm_val = block.settings.gsm
-    assign hardware_val = block.settings.hardware
-    assign origin_val = block.settings.origin
-  endif
+  assign material_val = block.settings.material
+  assign gsm_val = block.settings.gsm
+  assign hardware_val = block.settings.hardware
+  assign origin_val = block.settings.origin
 -%}

 {%- if material_val != blank or gsm_val != blank or hardware_val != blank or origin_val != blank -%}
```

# 4. Las 14 fuentes y H1–H8: antes -> después

Todas «retiradas»; prueba V1–V5/V5b en §5 (sin salida) y `grep -rn "product\.type" snippets sections` sin salida.

| # | Fuente / heurística | Antes (`eb7cca7`) | Después |
| --- | --- | --- | --- |
| 1–8 | `custom.`/`sartorial.` `material`, `gsm`, `hardware`, `origin` | `product-technical-specs.liquid:20–23` | retiradas; `:15–18` leen solo `block.settings.*` |
| 9 | `custom.technical_specs` y `ts.*` | `product-technical-specs.liquid:26–40` | retirada |
| 10–12 | `provenance_date`, `era`, `circa_year` | `product-provenance.liquid:27` | retiradas; `:28` lee solo el setting |
| 13 | `custom.condition_grade` | `product-provenance.liquid:42` | retirada; `:33` solo setting |
| 14 | `custom.provenance_notes` | `product-provenance.liquid:49` | retirada; `:39` solo setting |
| H1–H7 | tipo/handle en minúsculas, `is_non_textile`, «Solid milled brass», tipo como material, «Precision machined», filtros de `material`/`hardware`/`gsm` | `product-technical-specs.liquid:43–75` | retiradas |
| H8 | `circa_year` solo si el título contiene `19`/`20`/`archive`/`vintage` o el tipo `archive`/`vintage` | `product-provenance.liquid:30–39` | retirada |
| — | rama `else` por producto vacío | `product-technical-specs.liquid:80–85` | desaparece; el camino único es settings |

Equivalencia (§3.2 de la directiva): antes, con metafields vacíos y H8 cumplida, el año era `strip(circa_year)` salvo si contenía `{{` o quedaba vacío; ahora lo es para todo producto (`product-provenance.liquid:28–31`). `condition_grade` (`:33`) y `provenance_notes` (`:39`) toman el setting, igual que el último `default:` de su cadena anterior. `nil | strip` da `""`, que es `blank`.

# 5. Verificación (salida literal, todas estáticas)

Comandos ejecutados desde la raíz sobre el árbol final. Cada bloque: comando, salida, `[exit N]`. (V1–V13 de la directiva; V5b de M-5; V14, V15; hashes M-6.) Los comandos `grep` sin coincidencias terminan con exit 1 por diseño. V6 imprime 0 y su `grep -c` termina con exit 1 (cero líneas contadas), que es lo esperado.

```text
$ grep -n -E "metafields" snippets/product-technical-specs.liquid snippets/product-provenance.liquid
[exit 1]

$ grep -rn -E "metafields\.(custom|sartorial)\.(material|gsm|hardware|origin|technical_specs|provenance_date|era|circa_year|condition_grade|provenance_notes)" assets config layout locales sections snippets templates listings
[exit 1]

$ grep -rn -E "metafields\.(custom|sartorial)\." assets config layout locales sections snippets templates listings
snippets/cart-drawer-recommendations.liquid:80:              assign pool = anchor_product.metafields.custom.complementary_products.value
[exit 0]

$ grep -rn -E "metafields|metaobject" snippets/product-technical-specs.liquid snippets/product-provenance.liquid sections/main-product.liquid sections/featured-product.liquid
[exit 1]

$ grep -n -E "product\.(type|handle|title)|is_non_textile|Solid milled brass|Precision machined|p_title_lower|p_type_lower|product_type_lower|product_handle_lower" snippets/product-technical-specs.liquid snippets/product-provenance.liquid
[exit 1]

$ grep -n -E "(^|[^a-z_.])product(\.|\[)" snippets/product-technical-specs.liquid snippets/product-provenance.liquid | grep -v -E "product\.(selected_or_first_available_variant|variants\.size)"
[exit 1]

$ git diff -U0 -- snippets/ | grep -E '^\+' | grep -c 'default:'
0
[exit 1]

$ git diff --name-only ; git status --porcelain
listings/archive/templates/index.json
locales/en.default.schema.json
snippets/product-provenance.liquid
snippets/product-technical-specs.liquid
 M listings/archive/templates/index.json
 M locales/en.default.schema.json
 M snippets/product-provenance.liquid
 M snippets/product-technical-specs.liquid
?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-01-B-02-001.md
?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-02-001.md
?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-03-001.md
?? agent-comms/outbox-claude/CLAUDE-REVIEW-A-02-RD-001.md
?? agent-comms/outbox-claude/CLAUDE-REVIEW-A-03-RD-001.md
[exit 0]

$ git diff --quiet -- sections/ assets/ config/ templates/ locales/en.default.json locales/es.json listings/imprint listings/sartorial listings/archive/templates/product.json listings/archive/templates/collection.json && echo UNTOUCHED_OK
UNTOUCHED_OK
[exit 0]

$ node scripts/locale-key-inventory.mjs
--------------------------------------------------------------------------
INVENTARIO DE CLAVES DE TRADUCCION
--------------------------------------------------------------------------
Archivos escaneados:            87 (incluye /listings, fuera de Theme Check)
Referencias estaticas | t:      428 claves distintas
Referencias de schema t::       500 claves distintas
Claves en en.default.json:        438 hojas
Claves en en.default.schema.json: 500 hojas

Sin resolver en storefront:     0
Sin resolver en schema:         0
Construidas en runtime:         0  <- no verificables por ningun linter
Huerfanas en storefront:        0
Huerfanas en schema:            0

--------------------------------------------------------------------------
OK: todas las referencias estaticas resuelven contra los locales.
[exit 0]

$ npx shopify theme check --path .
<claude-code-hint v="1" type="plugin" value="shopify-ai-toolkit@claude-plugins-official" />
╭─ success ────────────────────────────────────────────────────────────────────╮
│                                                                              │
│  Theme Check Summary.                                                        │
│                                                                              │
│  92 files inspected with no offenses found.                                  │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯

[exit 0]

$ node scripts/theme-check-sanity.mjs
[theme-check-sanity] sandbox en .tmp/theme-check-sanity-22292 con 7 carpetas de tema
[theme-check-sanity] detectado LiquidHTMLSyntaxError (etiqueta Liquid sin cerrar) en sections/main-page.liquid
[theme-check-sanity] detectado TranslationKeyExists (clave de traduccion inexistente) en sections/main-blog.liquid
[theme-check-sanity] detectado ValidSchemaTranslations (clave t: de schema inexistente) en sections/main-placeholder.liquid

[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
[theme-check-sanity] ALCANCE DE ESTA PRUEBA: demuestra que esos tres checks estan activos y que disparan sobre archivos de tema. No demuestra cobertura exhaustiva de todas las referencias de traduccion. Para eso corre scripts/locale-key-inventory.mjs.
[exit 0]

$ node scripts/json-validate.mjs
----------------------------------------------------------------------
JSON VALIDATE
----------------------------------------------------------------------
Archivos .json comprobados: 521
  de ellos en /listings/:    11  <- fuera del alcance de Theme Check
Fallos de parseo:           0
URIs shopify://shop_images/: 0  <- solo carpetas de tema y /listings/

ALCANCE: comprueba que el JSON parsee. No comprueba que el schema
sea semanticamente valido para Shopify: eso lo cubre Theme Check
en las carpetas de tema, y nadie en /listings/.
[exit 0]

$ git diff --check
[exit 0]

$ python3 -I - <<'EOF'
import json, subprocess, copy
old = json.loads(subprocess.check_output(['git','show','HEAD:listings/archive/templates/index.json']))
new = json.load(open('listings/archive/templates/index.json', encoding='utf-8'))
exp = copy.deepcopy(old)
exp['sections']['featured_product']['blocks']['provenance']['settings']['provenance_notes'] = ''
assert new == exp
print('F3_OK')
EOF
F3_OK
[exit 0]

$ python3 -I - <<'EOF'
import json, subprocess, copy
old = json.loads(subprocess.check_output(['git','show','HEAD:locales/en.default.schema.json']))
new = json.load(open('locales/en.default.schema.json', encoding='utf-8'))
S = ' Shown as entered on every product that displays this block.'
b = lambda d: d['sections']['main_product']['blocks']
exp = copy.deepcopy(old)
e = b(exp)
e['technical_specs']['settings']['material']['info'] += S
e['technical_specs']['settings']['gsm']['info'] += S
e['technical_specs']['settings']['hardware']['info'] = 'Add the actual manufacturer, series and finish.' + S + ' Leave unknown details blank.'
e['technical_specs']['settings']['origin']['info'] += S
e['provenance']['settings']['circa_year']['info'] = 'Era or estimated year of production.' + S + ' Leave blank if unconfirmed.'
e['provenance']['settings']['condition_grade']['info'] += S
e['provenance']['settings']['provenance_notes']['info'] += S
assert new == exp
print('F4_OK')
EOF
F4_OK
[exit 0]

$ git hash-object snippets/product-technical-specs.liquid snippets/product-provenance.liquid listings/archive/templates/index.json locales/en.default.schema.json
68354c31e7357f40bdf1385fa1916013cc1fa756
2a624b236b5c31242fd3b6c042894196afb6baa7
68f4b21a2812b6ec4302e8420f164c8d85994a9a
34122e73def9ea02e0d43613da59341c71989b15
[exit 0]

$ sha256sum snippets/product-technical-specs.liquid snippets/product-provenance.liquid listings/archive/templates/index.json locales/en.default.schema.json
5d8b7e14878cf5a24482c7b3ab61b173c04265a56bfce69662afa531c8b3c47a  snippets/product-technical-specs.liquid
a217c745ad69ba8398c75433493c58786ff9f10c812219d1347b6b6ba9bd1959  snippets/product-provenance.liquid
9cc59fa907c0e4684a98e9699d27320aeece46cd71bc493c8b59733a34ea615d  listings/archive/templates/index.json
751953f9b156aea2411ccacf75eb45ffeb0ff1b058f591f90f34b8f2a974abe9  locales/en.default.schema.json
[exit 0]

$ grep -rn "product\.type" snippets sections
[exit 1]

$ grep -n -E "^\{%-? *(if|assign|unless|endif)" snippets/product-technical-specs.liquid | head; grep -n -E "product-technical-specs|product-provenance" sections/main-product.liquid sections/featured-product.liquid
21:{%- if material_val != blank or gsm_val != blank or hardware_val != blank or origin_val != blank -%}
53:{%- endif -%}
sections/main-product.liquid:700:              {% render 'product-technical-specs', block: block, product: product, heading_tag: 'h2' %}
sections/main-product.liquid:703:              {% render 'product-provenance', block: block, product: product, selected_variant: selected_variant %}
sections/featured-product.liquid:451:                {% render 'product-technical-specs', product: section.settings.product, block: block %}
sections/featured-product.liquid:456:                {% render 'product-provenance', product: section.settings.product, block: block, selected_variant: selected_variant %}
[exit 0]

```

Mapa V -> resultado: V1 pasa (sin salida); V2 pasa (sin salida); V3 pasa (una línea, `snippets/cart-drawer-recommendations.liquid:80`, `metafields.custom.complementary_products`, M-3); V4 pasa; V5 pasa; V5b pasa (sin salida; en `eb7cca7` daba 15 líneas según la R-D); V6 pasa (`0`); V7 pasa (`--name-only` = F1, F2, F3, F4; porcelain: cuatro ` M` y solo `??` de `agent-comms/`, ya anotados en el preflight más `CLAUDE-REVIEW-A-03-RD-001.md` de otro agente; este informe aparece como `??` al crearse); V8 pasa (`UNTOUCHED_OK`); V9 pasa (0/0 y 0/0, exit 0); V10 pasa (92 archivos, 0 ofensas, exit 0); V11 pasa (OK, exit 0); V12 pasa (exit 0, 0 fallos de parseo); V13 pasa (sin salida, exit 0); V14 pasa (`F3_OK`); V15 pasa (`F4_OK`). Hashes M-6 coinciden con la R-D (afirmación 1).

Nota sobre V10: la salida de Theme Check es un recuadro; la línea relevante es «92 files inspected with no offenses found.». Theme Check no ejecuta Liquid: prueba sintaxis, schema y traducciones, no comportamiento.

# 6. Estados degenerados (lectura del Liquid final; archivo:línea del árbol final)

F = `snippets/product-technical-specs.liquid`, P = `snippets/product-provenance.liquid`.

| Caso | Especificaciones | Procedencia |
| --- | --- | --- |
| Vacío: todos los settings vacíos / `not_assessed` | Nada: condición F:21 falsa, sin contenedor ni encabezado, tampoco en editor (PD-3). | Tienda: nada (P:42 falsa; `unique_piece` solo con `show_unique_piece`, P:23). Editor: `editor_empty` (P:69–72). |
| Uno solo: un setting relleno; producto de 1 variante | Encabezado (F:23–25) + 1 fila (F:27–50). | Encabezado (P:44–46) + 1 línea; badge solo con `show_unique_piece` y `variants.size == 1` con inventario `deny` (P:23, P:47–49). |
| Muchos: los cuatro / los cinco rellenos; 40 variantes | 4 filas (F:27–50). | Año + grado + notas (P:50–67); badge no aparece (`variants.size != 1`, P:23). |
| Muy largo: título de 120 caracteres con «1990 archive vintage»; valor de setting de 120+ caracteres | El título ya no se lee (V5/V5b). Valor con `| escape` (F:30,36,42,48); desborde cubierto por `assets/base.css:9982–9985` (R-D §4.2); visual en R-A (prueba 7). | Título ya no influye. Año escapado (P:51); notas richtext sin escape (P:66), como antes. |
| Faltante: sin tipo, sin metafields, sin descripción, sin imagen | Igual que con tipo: solo settings. | Igual: solo settings (P:28–39 no leen producto). |
| Textil vs no textil con `gsm`/`circa_year` rellenos | Se muestra en ambos (efecto declarado; antes se ocultaba en no textiles). | Se muestra en ambos (antes se ocultaba si el título no cumplía H8). |
| Producto con valores en las 14 claves | Ninguno se muestra (V1–V3). | Ninguno se muestra. |
| `circa_year` con `{{ ... }}` literal | n/a | Año oculto (P:29–31). |
| `heading` vacío con contenido | Filas sin encabezado (F:23). | Contenido sin encabezado (P:44). |
| Featured product sin producto elegido | No se renderiza (guarda `sections/featured-product.liquid:450`, intacta; llamada `:451`). | No se renderiza (`:455`; llamada `:456`). |

No aplican a estos bloques: «10+ imágenes de galería» y «200 productos paginados» (no leen media ni paginan).

# 7. Compuertas de AGENTS.md

1. Requisitos / ledger: ver §8. Evidencia con `archivo:línea` en §4 y §6. Demuestra: retiro completo de lectores y heurísticas (V1–V5b). No demuestra comportamiento en tienda.
2. Estados degenerados: §6, por lectura del Liquid. No sustituye render real; el desborde visual con valores largos queda en R-A (M-8, prueba 7).
3. Consistencia entre archivos: barrido de clase V2–V5b; `grep -rn "product\.type" snippets sections` sin resultados; la R-D §3.2 ya comprobó que el resto de lecturas `| downcase` no son dato de producto (`snippets/mega-menu.liquid:29` es navegación). La única lectura restante de `metafields.custom.*` es `snippets/cart-drawer-recommendations.liquid:80` (fuera de alcance, V3). Sin literales ni `default:` nuevos (V6 = 0).
4. Superficie del comerciante: sin labels nuevos; los siete `info` (PD-1) en sentence case, inglés neutro, sin jerga, siguen referenciados vía `t:` (V9 0/0). Corrige el «for this product» engañoso de `hardware` (`locales/en.default.schema.json:1019`). El único claim manual empaquetado queda vacío (F3). No hay otros locales de schema (R-D hecho 5).
5. Verificación en tienda real: PENDIENTE DE CREDENCIALES (D22). No ejecutado: ninguna tienda, ningún gate5. Prohibido declarar `cumplido`.

# 8. Ledger (PD-4/PD-5)

A-02 no cierra, crea ni modifica filas; no se edita `docs/requirements-ledger.md`.

| Fila | Estado | Propuesta tras A-02 |
| --- | --- | --- |
| «Schemas Válidos y Settings (100% t: Localizados)» (`docs/requirements-ledger.md:22`) | `cumplido` | Sin cambio. No regresión: V9, V10, V15 y las siete claves `info` en `locales/en.default.schema.json:1011,1015,1019,1023,1035,1043,1067`. |
| «Presets Diferenciados (1 a 4)» (`:109`) | `cumplido` | Sin cambio de estado (PD-4); R-C la regresará con el ZIP final. |
| «3 Tiendas Demo Auténticas» (`:111`) | `cumplido` | Sin cambio. |

Estado de la tarea: «código completo». Lo registra el coordinador en `CLAUDE-CLOUD-STATUS.md`/`BOARD.md`.

# 9. Hallazgos extra fuera de alcance (M-7; sin parche)

- `listings/archive/templates/index.json:22` (subheading), `:42` (body), `:56` (marquee «PARIS & ANTWERP HISTORICAL RUNWAY PROVENANCE») y `listings/archive/templates/collection.json:12`: claims de procedencia/documentación de Archive fuera de los bloques A-02 (C-08 o D-01-V).
- `listings/archive/templates/index.json:33–36` (grados «Grade I / Mint» … «Stabilized by master conservator…»), `:53–55` (marquee «CIRCA 1989–1999 THE PERMANENT ARCHIVE», «CURATED ARCHIVAL GARMENTS & CONSERVATION», «CURATED PERIOD SELECTIONS & ACCESSIONS») y `:116` (envío «Climate-controlled archival transport | Insured courier»): C-08. (Líneas tomadas de la R-D §6.3; no revalidadas por mí una a una.)
- `listings/archive/templates/product.json:68` (envío y devoluciones gratuitas): C-08.
- Tagline de Archive para la ficha de Theme Store, «Heritage catalogue pages, with provenance on every line.» (`docs/decisions.md:150,169`): tras A-02 el preset Archive no muestra procedencia en ninguna ficha; para C-04/G3.
- Especificaciones no tiene aviso de editor cuando está vacío (procedencia sí): mejora de superficie del comerciante para el Lote C (PD-3).
- `scripts/gate5-live-verify.mjs:181–188`: con presets vacíos informará `false` en `hasTechSpecsRendered` y `hasProvenanceRendered`; es lo esperado, no una regresión. Scripts no tocados.
- R-2 de la R-D: el hash canónico del ZIP (D21) cambia con este commit; esperado.

# 10. Texto de entrada para C-04-R (sin editar ningún release note)

«Technical specifications and Archival provenance blocks no longer read product metafields (custom.material, custom.gsm, custom.hardware, custom.origin, custom.technical_specs, custom.provenance_date, custom.era, custom.circa_year, custom.condition_grade, custom.provenance_notes and the sartorial.* aliases). Existing metafield values are no longer shown. Enter the information in the block settings; it shows as entered on every product that displays the block.»

La R-D (R-1, no obligatoria) sugiere mencionar las fuentes dinámicas nativas del editor solo si R-A lo comprueba antes, sin crear metafields (D17). Dependencia C-04-R abierta (condición (d)).

# 11. Pruebas de tienda de R-A (PENDIENTES DE CREDENCIALES, D22; solo tema no publicado en `tema-qkqpke0j`, sin escribir productos, metafields ni configuración)

1. `circa_year` relleno: PDP de producto textil y no textil con la misma plantilla -> «Circa …» en ambos; vacío -> sin bloque ni encabezado.
2. `gsm` relleno: textil y no textil (candidatos `leather-desk-mat`, `folded-valet-tray`, `milled-brass-paperweight`) -> aparece en ambos; vacío -> fila oculta.
3. Producto con valores hoy en alguna de las 14 claves (si existe; no se crean): no se muestran.
4. Ningún producto muestra «Solid milled brass», «Precision machined» ni su tipo como material sin setting.
5. Archive home: el producto destacado no muestra bloque de procedencia; el editor muestra el aviso.
6. PDP y featured product, escritorio y móvil, con viewport verificado.
7. (M-8) Valor de 120 caracteres o más, sin espacios, en `material` y en `circa_year`, en PDP con viewport verificado de 390 px: sin desbordamiento horizontal.
8. (M-8) Bloque de especificaciones con solo `heading` relleno: nada en la tienda y nada en la vista previa del editor (confirma PD-3). `scripts/gate5-live-verify.mjs:181–188` informará `false` para ambos bloques: esperado.

Hasta que R-A las ejecute, A-02 queda en «código completo».

# 12. Declaración

Sin commit, sin push, sin stash/checkout/reset, sin red, sin tiendas, sin gate5, sin `.secrets`, sin variables de entorno leídas, sin dependencias instaladas, sin metafields nuevos, sin lectores sustitutos, sin texto factual inventado, sin copiar código de SebastianDev017/atelier, sin credenciales en este informe. Solo se editaron F1–F4 y se creó este informe. Temporales en el scratchpad de la sesión (no en el repo).

# 13. Notas finales

- `assets/base.css` aparece modificado en el árbol al final del turno: no es de A-02 (trabajo concurrente de A-03). V8 pasó antes de ese cambio y mi diff no incluye `assets/`. El coordinador debe hacer el commit de A-02 solo con F1–F4 (`git add` por ruta).
- Compuerta del literal (ejecutada tras escribir los archivos; el conteo del propio informe se ejecutó antes de añadir esta sección, que no contiene el literal): los cuatro archivos tocados y el informe dan `ruta=0`; `ctx-check.py` desde la raíz: `fuera_de_tests_vendor_axe= 0` (la única línea con contexto está en `tests/vendor/axe.min.js`, excluida).
