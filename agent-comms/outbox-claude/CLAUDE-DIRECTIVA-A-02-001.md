ID: CLAUDE-DIRECTIVA-A-02-001
Fecha: 2026-11-04
Autor: Claude (Opus), redactor de directivas. No implementa.
Destinatario: implementador Sonnet sin contexto previo (ejecuta), revisor Opus de contexto limpio (R-D y revisión de la tarea, D11), coordinador Claude (rama, commit y push, D12/D16).
Estado: Borrador para R-D. No autoriza editar el tema hasta que exista el dictamen R-D favorable descrito en §0.
Decisión requerida: R-D independiente de esta directiva y autorización técnica de Nivel 2 de A-02, ambas por el revisor Opus de contexto limpio (D11 de `CLAUDE-DECISION-AUTONOMIA-001.md`). El R-D debe además decidir los puntos PD-1 a PD-5 de §9. Ninguno exige a Johandry (ver §9.2).
Resumen en 5 líneas:
1. A-02 retira del código las 14 fuentes automáticas de datos de producto (10 claves `custom.*` y 4 alias `sartorial.*`) y las heurísticas de título, handle, `product.type` e `is_non_textile` de dos snippets, sin lectores sustitutos ni metafields nuevos.
2. Tras el cambio, especificaciones y procedencia salen solo de los settings del bloque; con todo vacío no se renderiza nada en la tienda (procedencia conserva su aviso de editor existente).
3. Se vacía el único claim manual no respaldado de los presets: `provenance_notes` del producto destacado de Archive home (`listings/archive/templates/index.json:111`).
4. Lista cerrada: 2 snippets + 1 plantilla de listing obligatorios; 1 archivo de locale opcional (cambio L-1, solo textos `info`, decisión PD-1 del R-D). Sin tocar `sections/`, schemas, IDs, defaults, CSS, JS ni datos de Shopify.
5. Máximo alcanzable sin tienda: «código completo» (D22). Las pruebas de tienda de R-A quedan pendientes de credenciales; ninguna fila del ledger cambia de estado.
Archivos tocados (por esta entrega de redacción): solo este archivo nuevo, `agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-02-001.md`. Sin git de escritura, sin red, sin tiendas, sin `.secrets`.
Desviaciones (Nivel 1 o Nivel 2): La tarea A-02 es Nivel 2 por cambio de contrato con el comerciante (§4). La autoriza el revisor Opus según D11, que sustituye para A-02 a la autorización de Gemini/Antigravity prevista en el plan V4.1 (§9.1, conflicto C-1).
Hallazgos extra fuera de alcance (con parche listo): Sin parche. Registrados en §8.3 para C-08, D-01-V y C (superficie del comerciante).
Verificación (comando, resultado y qué demuestra/qué no): Localizadores y líneas base comprobados hoy sobre `lote0/base-09f8342` en `eb7cca7` (§1.2 y §2). Demuestra el estado del código base; no demuestra nada de tiendas ni de la implementación futura.
Lista de afirmaciones falsables numeradas:
1. En `eb7cca7`, `snippets/product-technical-specs.liquid` lee 9 de las 14 fuentes en las líneas 20–23 y 26–27, y `snippets/product-provenance.liquid` lee las 5 restantes en las líneas 27, 42 y 49.
2. En `eb7cca7`, las únicas lecturas de `metafields.custom.*` o `metafields.sartorial.*` del tema fuera de esos dos snippets son `snippets/cart-drawer-recommendations.liquid:80` (`custom.complementary_products`), fuera de alcance.
3. En `eb7cca7`, el único valor manual no vacío de los bloques `technical_specs`/`provenance` en `templates/` y `listings/` es `listings/archive/templates/index.json:111`; los otros tres bloques empaquetados (`listings/archive/templates/product.json:75–78`, `listings/imprint/templates/product.json:75–78`, `listings/imprint/templates/index.json:114–117`) ya están vacíos o en `not_assessed`.
4. Tras A-02 ningún setting, bloque ni clave de locale queda huérfano: todos los settings de ambos bloques siguen leyéndose y todas las claves `products.product.technical_specs.*` y `products.product.provenance.*` siguen referenciadas.
5. En `eb7cca7`: Theme Check «92 files inspected with no offenses found» (exit 0); `theme-check-sanity` OK (exit 0); `locale-key-inventory` 0 sin resolver y 0 huérfanas; `json-validate` exit 0.

---

# 0. Condiciones de entrada (bloqueantes)

El implementador NO empieza a editar si falta cualquiera de estas condiciones. Si falta, se detiene y lo informa al coordinador sin tocar archivos.

1. Existe un dictamen R-D del revisor Opus de contexto limpio sobre esta directiva (ID sugerido `CLAUDE-REVIEW-A-02-RD-001`) con resultado «apta para emitir» o «apta con condiciones», y en él consta literalmente la autorización técnica de Nivel 2 de A-02 (D11).
2. El R-D ha decidido PD-1 (si el cambio L-1 de locales entra o no). Si no se pronuncia, L-1 NO se ejecuta y `locales/en.default.schema.json` sale de la lista permitida.
3. La rama `lote-a` existe, está activa y la ha preparado el coordinador. Si no existe, el implementador no la crea: se detiene.
4. El preflight de §1.2 pasa completo.
5. Ningún otro agente escribe en el repositorio durante el turno (escritor único, plan V4.1 §2).

# 1. Base y preflight

## 1.1 Base

- Rama de trabajo: `lote-a`, creada por el coordinador desde la cabeza de `lote0/base-09f8342` (D12, D22). Cabeza de referencia de esta redacción: `eb7cca7` («Lote 0: BOARD reconciliado (B3), decisiones D19-D24 y estado vivo»).
- `lote-a` puede contener ya commits de otras tareas del Lote A (A-01/B-02, A-03, C-08). Eso es válido siempre que no hayan tocado los dos snippets de A-02 ni los valores concretos que A-02 edita (comprobación semántica en 1.2).
- A-02 no depende de datos nuevos, del fixture de suscripción (A-01), de previews ni de credenciales (plan V4.1 §4.1; D19 (c)).

## 1.2 Comandos de preflight (pegar salida literal en el informe)

Ejecutar desde la raíz del repo, en este orden:

```bash
git rev-parse --abbrev-ref HEAD
# esperado: lote-a

git rev-parse HEAD
# anotar el SHA completo en el informe

git merge-base --is-ancestor eb7cca7 HEAD && echo BASE_OK
# esperado: BASE_OK

git status --porcelain | wc -l
# esperado: 0

git hash-object snippets/product-technical-specs.liquid snippets/product-provenance.liquid sections/main-product.liquid sections/featured-product.liquid
# esperado, en este orden:
# 201343dd3e088698f74c850ef6cc9240ff3aa7ee
# ca9796ea1a64c256b11e2c314b561d0657e41677
# 34003beda635575dd0352aab87d2f6fbd30096c8
# 58c8c04a9f78a4d9787542153ec1610b5b6f6b72

git hash-object listings/archive/templates/index.json locales/en.default.schema.json
# en eb7cca7: ce4ee46bbdcd72ce925feda88cf39339820e93c7 y 2a628d9be95a4a74ea266d9d4cf46924ae942981
# Pueden diferir si C-08 u otra tarea ya editó otras partes de estos archivos; entonces manda la comprobación semántica siguiente.
```

Comprobación semántica de los valores que A-02 edita (debe imprimir `PRE_OK`):

```bash
python3 -I - <<'EOF'
import json
d = json.load(open('listings/archive/templates/index.json', encoding='utf-8'))
v = d['sections']['featured_product']['blocks']['provenance']['settings']['provenance_notes']
assert v == '<p>Curated period selection with documented archival provenance.</p>', v
s = json.load(open('locales/en.default.schema.json', encoding='utf-8'))['sections']['main_product']['blocks']
exp = {
 ('technical_specs','material'): 'Displays fabric composition or material blend.',
 ('technical_specs','gsm'): 'Enter a documented fabric mass per square meter. This is not the garment or shipping weight.',
 ('technical_specs','hardware'): 'Add the actual manufacturer, series and finish for this product. Leave unknown details blank.',
 ('technical_specs','origin'): 'Use documented product data. Fabric origin and manufacturing location can differ.',
 ('provenance','circa_year'): 'Era or estimated year of production. Leave blank if unconfirmed.',
 ('provenance','condition_grade'): 'Select a grade only after inspection. Disclose damage, repairs and use restrictions separately.',
 ('provenance','provenance_notes'): 'Historical context, collection season or archival record notes.',
}
for (b,k),t in exp.items():
    assert s[b]['settings'][k]['info'] == t, (b,k)
print('PRE_OK')
EOF
```

Si cualquier hash de los cuatro primeros archivos difiere, o `PRE_OK` no aparece: detenerse, no editar, informar «base cambiada» al coordinador para volver a R-D.

## 1.3 Línea base de compuertas (ya medida en `eb7cca7` por el redactor; el implementador la repite antes de editar)

```text
npx shopify theme check --path .            -> "92 files inspected with no offenses found." exit 0
node scripts/theme-check-sanity.mjs         -> "OK. Las 3 clases se detectaron por separado..." exit 0
node scripts/locale-key-inventory.mjs       -> Sin resolver 0/0, huérfanas 0/0, "OK" exit 0
node scripts/json-validate.mjs              -> exit 0
```

# 2. Objetivo y alcance exacto

## 2.1 Objetivo

Que especificaciones técnicas y procedencia muestren únicamente lo que el comerciante escribe en los settings del bloque, y nada si están vacíos. Fuente: plan V4.1 §1 (línea 58), §4.1 fila A-02 y subsección «A-02 — Retiro cerrado de catorce fuentes y conservación manual segura»; decisión empresarial de Johandry por chat 2026-10-30 (retiro autorizado; no espera datos nuevos); D17 (no crear metafields).

## 2.2 Las 14 fuentes a retirar (verificadas hoy en `eb7cca7`)

Acceder con `.value` o al objeto de la misma clave cuenta como una sola fuente (plan V4.1).

| # | Fuente | Archivo:línea actual | ¿Coincide con el plan? |
| --- | --- | --- | --- |
| 1 | `product.metafields.custom.material` | `snippets/product-technical-specs.liquid:20` | Sí |
| 2 | `product.metafields.sartorial.material` | `snippets/product-technical-specs.liquid:20` | Sí |
| 3 | `product.metafields.custom.gsm` | `snippets/product-technical-specs.liquid:21` | Sí |
| 4 | `product.metafields.sartorial.gsm` | `snippets/product-technical-specs.liquid:21` | Sí |
| 5 | `product.metafields.custom.hardware` | `snippets/product-technical-specs.liquid:22` | Sí |
| 6 | `product.metafields.sartorial.hardware` | `snippets/product-technical-specs.liquid:22` | Sí |
| 7 | `product.metafields.custom.origin` | `snippets/product-technical-specs.liquid:23` | Sí |
| 8 | `product.metafields.sartorial.origin` | `snippets/product-technical-specs.liquid:23` | Sí |
| 9 | `product.metafields.custom.technical_specs` y su consumo (`ts.material/gsm/hardware/origin`) | `snippets/product-technical-specs.liquid:26–39` (bloque `if` en 26–40, comentario en 25) | Corrección: el plan dice 26–38; el bloque real termina en 40 |
| 10 | `product.metafields.custom.provenance_date` | `snippets/product-provenance.liquid:27` | Sí |
| 11 | `product.metafields.custom.era` | `snippets/product-provenance.liquid:27` | Sí |
| 12 | `product.metafields.custom.circa_year` | `snippets/product-provenance.liquid:27` | Sí |
| 13 | `product.metafields.custom.condition_grade` | `snippets/product-provenance.liquid:42` | Sí |
| 14 | `product.metafields.custom.provenance_notes` | `snippets/product-provenance.liquid:49` | Sí |

## 2.3 Heurísticas a retirar (verificadas hoy)

| ID | Heurística | Archivo:línea actual |
| --- | --- | --- |
| H1 | Lectura de `product.type` y `product.handle` en minúsculas | `product-technical-specs.liquid:43–44` |
| H2 | `is_non_textile` por tipo (`desk`, `object`, `metal`, `hardware`) o handle (`brass`, `paperweight`) | `product-technical-specs.liquid:46–49` |
| H3 | Material literal `'Solid milled brass'` según handle | `product-technical-specs.liquid:53–54` |
| H4 | `product.type` usado como material | `product-technical-specs.liquid:55–56` (coincide con el plan) |
| H5 | Setting `material` y `hardware` ignorados si `is_non_textile` | `product-technical-specs.liquid:51–61` y `67–75` |
| H6 | Hardware literal `'Precision machined'` según handle | `product-technical-specs.liquid:69–70` |
| H7 | Setting `gsm` ignorado si `is_non_textile` | `product-technical-specs.liquid:63–65` |
| H8 | `circa_year` del setting solo si el título contiene `19`, `20`, `archive`, `vintage` o el tipo contiene `archive`/`vintage` | `product-provenance.liquid:30–39` (lecturas en 33–35; coincide con el plan 30–38 más `endif` en 39) |

Rama `else` de `product-technical-specs.liquid:80–85` (producto vacío): hoy es inalcanzable desde los llamadores (`main-product` siempre pasa el producto de la PDP; `featured-product.liquid:450` solo renderiza si hay producto). Tras A-02 desaparece la bifurcación y su comportamiento (solo settings) pasa a ser el único camino.

## 2.4 Se conserva (no tocar)

- Badge de pieza única por `show_unique_piece` + `product.variants.size == 1` + inventario (`product-provenance.liquid:20–24`). No es lector de metafields (plan V4.1).
- Guarda de texto `contains '{{'` sobre `circa_year` (`product-provenance.liquid:32`): sanea el setting manual, no lee el producto. Se conserva con comportamiento equivalente (PD-2).
- Cálculo de `heading_tag` de procedencia (`product-provenance.liquid:15–18`) y el `heading_tag | default: 'h3'` de especificaciones (`:91`).
- Todo el marcado de render: `product-technical-specs.liquid:88–120`, `product-provenance.liquid:52–83`, incluidas las clases CSS (`.product-technical-specs*`, `.product-provenance*`, usadas en `assets/base.css:9951–9994` y consultadas por los scripts gate5) y el aviso de editor `products.product.provenance.editor_empty` (`:79–83`).
- Schemas de ambos bloques en `sections/main-product.liquid:1117–1151` y `sections/featured-product.liquid:769–803`: mismos IDs, tipos, defaults y opciones.
- Llamadas `render` en `sections/main-product.liquid:700,703` y `sections/featured-product.liquid:451,456` (siguen pasando `product`; el parámetro queda sin leer en especificaciones, sin efecto).

## 2.5 Fuera de alcance (no tocar aunque parezca relacionado)

- `custom.complementary_products` (`snippets/cart-drawer-recommendations.liquid:80`) y el setting `use_product_metafield` (`sections/cart-drawer.liquid:422–424`).
- Recomendaciones nativas `related`/`complementary` (`sections/product-recommendations.liquid`; el plan cita 6–12 y 68–71: 6–12 coincide; 68–71 hoy cae en el schema `intent`, 66–72; irrelevante porque no se toca).
- Cualquier reemplazo global de `custom.*`.
- Claims de Archive fuera de los bloques A-02 (§8.3), promesas de envío/devoluciones (C-08), CTA y narrativa técnica (D-01-V), release notes (C-04-R).
- Crear, rellenar, borrar o modificar definiciones o valores de metafields en Shopify; crear o usar las «siete definiciones pendientes».

# 3. Lista cerrada de archivos permitidos y cambios exactos

Solo estos archivos pueden aparecer en `git diff --name-only`. Cualquier otro es Nivel 2 no autorizado: detenerse.

| # | Archivo | Obligatorio | Cambio |
| --- | --- | --- | --- |
| F1 | `snippets/product-technical-specs.liquid` | Sí | Sustituir comentario de cabecera (1–10) y bloque `liquid` (12–86). Render 88–120 intacto. |
| F2 | `snippets/product-provenance.liquid` | Sí | Ajustar comentario de cabecera (3–4) y sustituir 26–49. Resto intacto. |
| F3 | `listings/archive/templates/index.json` | Sí | Un valor: `provenance_notes` de `:111` a `""`. |
| F4 | `locales/en.default.schema.json` | Solo si el R-D aprueba PD-1 | Cambio L-1: siete valores `info` existentes. Sin claves nuevas ni borradas. |
| R | `agent-comms/outbox-claude/CLAUDE-REPORT-A-02-001.md` | Sí | Informe de entrega (§7). Archivo nuevo. |

No se tocan: `sections/*` (ni schemas ni render), `locales/en.default.json`, `locales/es.json`, `assets/*`, `config/*`, `templates/*`, `listings/archive/templates/product.json` (ya vacío en `:75–78`), `listings/imprint/templates/*` (ya vacíos en `product.json:75–78` e `index.json:114–117`), `docs/requirements-ledger.md`, `agent-comms/BOARD.md`, `CLAUDE-CLOUD-STATUS.md`, `docs/decisions*.md`, scripts.

## 3.1 F1 — `snippets/product-technical-specs.liquid`

Usar una herramienta de parche con contexto (RULES §3.2). No reescribir el archivo entero desde memoria.

Paso F1.a — Sustituir las líneas 1–10 (comentario) por:

```liquid
{%- comment -%}
  Renders product technical specifications block.
  Values come only from this block's settings and show as entered for every product that displays the block.
  With every value empty, nothing renders.
  Accepts:
  - block: {Object} Block object with settings and shopify_attributes.
  - product: {Object} Product Liquid object (optional, not read; kept so existing render calls stay valid).
  - heading_tag: {String} Heading level for the parent context (optional, defaults to h3).

  Usage:
  {% render 'product-technical-specs', block: block, product: product %}
{%- endcomment -%}
```

Paso F1.b — Sustituir el bloque completo que empieza en `{%- liquid` (línea 12) y termina en `-%}` (línea 86) por exactamente:

```liquid
{%- liquid
  assign material_val = block.settings.material
  assign gsm_val = block.settings.gsm
  assign hardware_val = block.settings.hardware
  assign origin_val = block.settings.origin
-%}
```

Paso F1.c — No tocar desde `{%- if material_val != blank or gsm_val != blank ...` hasta el final.

Resultado esperado: el archivo no contiene `metafields`, `product.type`, `product.handle`, `product.title`, `is_non_textile`, `Solid milled brass` ni `Precision machined`; no añade ningún `default:` nuevo.

## 3.2 F2 — `snippets/product-provenance.liquid`

Paso F2.a — Sustituir las líneas 3–4:

```text
  Each row renders only when backed by verified product data or explicit settings.
  Without verified data, nothing renders in the storefront.
```

por:

```text
  Each row renders only from this block's settings, which show as entered for every product that displays the block.
  With every setting empty, nothing renders in the storefront.
```

Paso F2.b — Sustituir desde la línea 26 (`# Provenance year: read from product metafields first ...`) hasta la línea 49 (`assign provenance_notes_val = ...`) inclusive por exactamente:

```liquid
  # Year, condition grade and notes come only from this block's settings.
  assign provenance_year = block.settings.circa_year | strip
  if provenance_year contains '{{'
    assign provenance_year = ''
  endif

  assign condition_grade_val = block.settings.condition_grade
  assign show_grade = false
  if condition_grade_val != blank and condition_grade_val != 'not_assessed'
    assign show_grade = true
  endif

  assign provenance_notes_val = block.settings.provenance_notes
```

Las líneas 14–25 (cabecera del `liquid`, `heading_tag`, `current_variant`, `unique_piece`, línea en blanco) y desde `-%}` (actual 50) hasta el final quedan intactas.

Equivalencia que el informe debe justificar: antes, con metafields vacíos y título/tipo que cumplían H8, `provenance_year = strip(circa_year)` salvo si contenía `{{` o quedaba vacío; ahora es lo mismo para todo producto. `condition_grade` y `provenance_notes` toman el setting igual que el último `default:` de su cadena actual.

## 3.3 F3 — `listings/archive/templates/index.json`

Sustituir exactamente una ocurrencia (afirmar conteo 1 antes de sustituir, RULES §3.2):

```text
"provenance_notes": "<p>Curated period selection with documented archival provenance.</p>"
```

por:

```text
"provenance_notes": ""
```

Ruta JSON: `sections.featured_product.blocks.provenance.settings.provenance_notes` (línea 111 en `eb7cca7`). Motivo: plan V4.1 §4.1 («la directiva A-02 dejará `provenance_notes` vacío si no existe respaldo aprobado; no inventará texto neutro») y GPT-DECISION-LOTE-0-04-C08-001 (sin respaldo verificable en la propia tienda se retira; preferir retirar a ocultar). No consta en el repo ningún respaldo factual aprobado para esa frase. No se cambia ningún otro valor, ni el formato, ni el orden de claves, ni `heading`, `circa_year`, `show_unique_piece` o `condition_grade` del mismo bloque.

Efecto: con `circa_year: ""`, `show_unique_piece: false`, `condition_grade: not_assessed` y notas vacías, el bloque de procedencia del producto destacado de Archive home no se renderiza en la tienda (ni encabezado); en el editor muestra el aviso existente `editor_empty`.

## 3.4 F4 — `locales/en.default.schema.json` (cambio L-1, condicionado a PD-1)

Motivo: tras A-02 el valor de cada setting deja de ser un fallback por producto y se muestra tal cual en todos los productos que muestran el bloque, incluidos los no textiles; el texto `info` actual de `hardware` dice «for this product», que pasa a ser engañoso. Compuerta 4 (superficie del comerciante). No cambia ninguna clave, ID, default ni opción: es Nivel 1 dentro de la tarea Nivel 2. Las claves se comparten entre `main-product` y `featured-product`, por eso la frase no menciona «template». No existe `locales/es.schema.json` (TT-56, diferido), así que no hay otra traducción que tocar.

Sustituir exactamente estos siete valores (cada original aparece una vez; afirmar conteo 1):

| Línea en `eb7cca7` | Ruta | Valor nuevo exacto |
| --- | --- | --- |
| 1011 | `sections.main_product.blocks.technical_specs.settings.material.info` | `Displays fabric composition or material blend. Shown as entered on every product that displays this block.` |
| 1015 | `...technical_specs.settings.gsm.info` | `Enter a documented fabric mass per square meter. This is not the garment or shipping weight. Shown as entered on every product that displays this block.` |
| 1019 | `...technical_specs.settings.hardware.info` | `Add the actual manufacturer, series and finish. Shown as entered on every product that displays this block. Leave unknown details blank.` |
| 1023 | `...technical_specs.settings.origin.info` | `Use documented product data. Fabric origin and manufacturing location can differ. Shown as entered on every product that displays this block.` |
| 1035 | `...provenance.settings.circa_year.info` | `Era or estimated year of production. Shown as entered on every product that displays this block. Leave blank if unconfirmed.` |
| 1043 | `...provenance.settings.condition_grade.info` | `Select a grade only after inspection. Disclose damage, repairs and use restrictions separately. Shown as entered on every product that displays this block.` |
| 1067 | `...provenance.settings.provenance_notes.info` | `Historical context, collection season or archival record notes. Shown as entered on every product that displays this block.` |

Si el R-D rechaza o no decide PD-1: no tocar F4.

## 3.5 Bloques, settings y locales: ¿algo queda huérfano?

No. Por eso no se retira ni se oculta nada del schema:

- Los bloques `technical_specs` y `provenance` siguen existiendo en ambos schemas y siguen renderizando.
- Los settings `heading`, `material`, `gsm`, `hardware`, `origin` (especificaciones) y `heading`, `circa_year`, `show_unique_piece`, `condition_grade`, `provenance_notes` (procedencia) siguen leyéndose todos.
- Claves de storefront: `products.product.technical_specs.{material,gsm,hardware,origin}` y `products.product.provenance.{single_piece,circa,condition,grade_1..grade_5,editor_empty}` siguen referenciadas en el render, que no cambia.
- Retirar settings o bloques sería Nivel 2 adicional (IDs) y rompería plantillas instaladas; está prohibido en A-02.
- Prueba exigida: `locale-key-inventory` con 0 huérfanas y 0 sin resolver (§5.1, V9).

## 3.6 Comportamiento cuando el comerciante añade el bloque (estado vacío honesto)

| Situación | Especificaciones técnicas | Procedencia |
| --- | --- | --- |
| Bloque recién añadido (defaults: solo `heading`; procedencia con `not_assessed` y `show_unique_piece: false`) | Tienda: nada. Editor: nada visible (el bloque sigue seleccionable en la barra lateral). Sin texto inventado. | Tienda: nada, salvo badge de pieza única si el comerciante lo activa y se cumplen sus condiciones de inventario. Editor: aviso existente `editor_empty`. |
| Un setting relleno | Encabezado + una fila. | Encabezado + esa línea. |
| Producto con valores en cualquiera de los 14 metafields | Se ignoran: no se muestran. | Se ignoran: no se muestran. |
| Producto no textil (escritorio, metal, latón…) con `gsm`/`material`/`hardware` rellenos | Se muestran tal cual (cambio de contrato; antes se ocultaban o sustituían). | n/a |
| Producto cuyo título no contiene año, `archive` ni `vintage`, con `circa_year` relleno | n/a | Se muestra «Circa {year}» (cambio de contrato; antes se ocultaba). |

No se añade un aviso de editor a especificaciones: requeriría claves nuevas en `locales/en.default.json` y `locales/es.json` fuera de lista (PD-3, hallazgo extra §8.3).

# 4. Justificación del Nivel 2 (RULES §3.5)

A-02 no cambia `id`, `default` ni opciones de select, y no toca archivos fuera de la lista cerrada. Es Nivel 2 por cambio de contrato con el comerciante, como fija el plan V4.1 (§1, §4.1, §5.2, §9):

1. Un comerciante que ya tenga valores en cualquiera de las 14 claves deja de verlos en la tienda tras actualizar el tema, sin tocar nada.
2. Los settings del bloque pasan de fallback por producto a fuente única, aplicada a todos los productos que muestran el bloque, sin filtro textil ni heurística de título.
3. Desaparecen dos textos fijos («Solid milled brass», «Precision machined») y el tipo de producto mostrado como material.

Autorización: el revisor Opus de contexto limpio, en el R-D, según D11 («Para A-02, la autorización técnica de Nivel 2 la da ese revisor»). La decisión empresarial de Johandry del 2026-10-30 (retirar) no sustituye esa autorización técnica. El aviso al comerciante corresponde a C-04-R (§8.1).

# 5. Criterios de aceptación y pruebas sin tienda

Todas las salidas se pegan literalmente en el informe, con el comando. Etiquetar cada prueba como «estática». Ninguna sustituye la prueba en tienda.

## 5.1 Verificaciones obligatorias

Comandos (copiar tal cual desde este bloque; no desde la tabla):

```bash
# V1
grep -n -E "metafields" snippets/product-technical-specs.liquid snippets/product-provenance.liquid
# V2
grep -rn -E "metafields\.(custom|sartorial)\.(material|gsm|hardware|origin|technical_specs|provenance_date|era|circa_year|condition_grade|provenance_notes)" assets config layout locales sections snippets templates listings
# V3
grep -rn -E "metafields\.(custom|sartorial)\." assets config layout locales sections snippets templates listings
# V4
grep -rn -E "metafields|metaobject" snippets/product-technical-specs.liquid snippets/product-provenance.liquid sections/main-product.liquid sections/featured-product.liquid
# V5
grep -n -E "product\.(type|handle|title)|is_non_textile|Solid milled brass|Precision machined|p_title_lower|p_type_lower|product_type_lower|product_handle_lower" snippets/product-technical-specs.liquid snippets/product-provenance.liquid
# V6
git diff -U0 -- snippets/ | grep -E '^\+' | grep -c 'default:'
# V7
git diff --name-only ; git status --porcelain
# V8
git diff --quiet -- sections/ assets/ config/ templates/ locales/en.default.json locales/es.json listings/imprint listings/sartorial listings/archive/templates/product.json listings/archive/templates/collection.json && echo UNTOUCHED_OK
# V9
node scripts/locale-key-inventory.mjs
# V10
npx shopify theme check --path .
# V11
node scripts/theme-check-sanity.mjs
# V12
node scripts/json-validate.mjs
# V13
git diff --check
```

Nota sobre V4: `sections/main-product.liquid` y `sections/featured-product.liquid` no contienen hoy `metafields` ni `metaobject`; el resultado vacío confirma que no se añadió nada allí.

| ID | Resultado exigido | Qué demuestra / qué no |
| --- | --- | --- |
| V1 | Sin salida (exit 1) | Ningún lector de metafields en los snippets. |
| V2 | Sin salida | Las 14 fuentes tienen 0 lecturas en todo el tema, también fuera de los snippets. |
| V3 | Exactamente 1 línea: `snippets/cart-drawer-recommendations.liquid:80` | El lector externo al alcance se preserva y no hay sustitutos con otro nombre. |
| V4 | Sin salida | Sin lectores sustitutos ni bindings dinámicos. |
| V5 | Sin salida | H1–H8 retiradas. |
| V6 | `0` | No se introduce ningún default sustituto. |
| V7 | `--name-only`: solo F1, F2, F3 y (si PD-1) F4. `--porcelain`: además, el informe R como `??`. | Lista cerrada respetada. |
| V8 | `UNTOUCHED_OK` | Schemas, render, CSS/JS y demás plantillas intactos. |
| V9 | Sin resolver 0 y 0; huérfanas 0 y 0; exit 0 | Ninguna clave huérfana ni rota. |
| V10 | `no offenses found`, exit 0 | Sintaxis/schema/traducciones según Theme Check. No es evidencia de comportamiento. |
| V11 | `OK`, exit 0 | Que el verde de V10 tiene valor. |
| V12 | exit 0 | Los JSON (incluido `/listings`, fuera de Theme Check) parsean. |
| V13 | Sin salida | Sin espacios finales ni conflictos. |
| V14 | `F3_OK` (script abajo) | Exactamente un valor cambiado en el JSON de Archive. |
| V15 | `F4_OK` (script abajo, solo si PD-1) | Exactamente siete `info` cambiados, mismo conjunto de claves. |

Script V14 (comparar contra el blob de la cabeza de `lote-a`, no del árbol):

```bash
python3 -I - <<'EOF'
import json, subprocess, copy
old = json.loads(subprocess.check_output(['git','show','HEAD:listings/archive/templates/index.json']))
new = json.load(open('listings/archive/templates/index.json', encoding='utf-8'))
exp = copy.deepcopy(old)
exp['sections']['featured_product']['blocks']['provenance']['settings']['provenance_notes'] = ''
assert new == exp
print('F3_OK')
EOF
```

Script V15:

```bash
python3 -I - <<'EOF'
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
```

No se instala ninguna dependencia (no hay motor Liquid en `node_modules`; no ejecutar `npm install`, `npx liquidjs` ni similares) y no se usa `shopify theme dev/push`: la verificación de render es por lectura (5.2) y en tienda por R-A (5.4).

## 5.2 Compuertas de AGENTS.md (estáticas)

1. Requisitos / ledger: §6. Cada afirmación del informe con `archivo:línea` del árbol final.
2. Estados degenerados: tabla de verdad por lectura del Liquid final. Para cada caso, indicar qué HTML se emite (ninguno, solo encabezado + filas, editor-only) y por qué (`archivo:línea`):

| Caso | Especificaciones | Procedencia |
| --- | --- | --- |
| Vacío: todos los settings vacíos/`not_assessed` | Nada (condición `:88` del render original, renumerada) | Tienda nada; editor `editor_empty` |
| Uno solo: un setting relleno; producto de 1 variante | 1 fila + encabezado | 1 línea + encabezado; badge solo si `show_unique_piece` y condiciones de inventario |
| Muchos: los cuatro / los cinco rellenos; producto con 40 variantes | 4 filas | Año + grado + notas; badge no aparece (`variants.size != 1`) |
| Muy largo: título de 120 caracteres con «1990 archive vintage»; valor de setting de 120+ caracteres | El título ya no influye; valor escapado (`| escape`) | El título ya no influye; año escapado; notas richtext sin escape (igual que hoy) |
| Faltante: producto sin tipo, sin metafields, sin descripción, sin imagen | Igual que con tipo: solo settings | Igual: solo settings |
| Producto textil vs no textil con `gsm`/`circa_year` rellenos | Se muestra en ambos (efecto declarado) | Se muestra en ambos (efecto declarado) |
| Producto con valores en las 14 claves | Ninguno se muestra (V1–V3) | Ninguno se muestra |
| `circa_year` con `{{ ... }}` literal | n/a | Línea de año oculta (guarda conservada) |
| `heading` vacío con contenido | Filas sin encabezado (igual que hoy) | Contenido sin encabezado (igual que hoy) |
| Featured product sin producto elegido | No se renderiza (guarda en `featured-product.liquid:450`, intacta) | No se renderiza (`:455`) |

3. Consistencia entre archivos: barrido V2–V5 (clase del defecto, no solo instancia; RULES §4.3); confirmar que no quedan otros lectores de `product.type`/`handle`/`title` usados como dato de especificación o época en otros snippets (`grep -rn -E "product\.type" snippets sections` y explicar cada resultado). Sin valores duplicados ni literales nuevos.
4. Superficie del comerciante: sin labels nuevos; si PD-1, los siete `info` en sentence case, inglés neutro, sin jerga, gestionados por `t:` (no cambia ninguna referencia `t:` del schema). Sin claims no verificables: el único claim manual empaquetado queda vacío (F3).
5. Tienda real: no ejecutable en esta sesión (D22). Se declara «pendiente de credenciales» y se lista lo que hará R-A (5.4). Prohibido declarar `cumplido`.

## 5.3 Criterio de aceptación de la tarea (lo comprueba el revisor Opus de D11)

Aceptar solo si: V1–V14 (y V15 si PD-1) dan exactamente el resultado exigido; el diff de F1/F2 coincide con §3.1/§3.2 sin cambios adicionales; F3 cambia un único valor; ningún archivo fuera de lista; tabla de estados degenerados completa y razonada con `archivo:línea`; informe con cabecera RULES §1.4 y sin credenciales.

## 5.4 Pruebas que hará R-A en tienda (PENDIENTES DE CREDENCIALES, D22)

Solo con tema no publicado en `tema-qkqpke0j` (D13); sin escribir productos, metafields, apps ni configuración. Los settings del bloque se ajustan en las plantillas del tema no publicado subido.

1. `circa_year` relleno: PDP de un producto textil y de uno no textil con la misma plantilla → «Circa …» aparece en ambos; vacío → no aparece y, sin otro contenido, no hay bloque ni encabezado.
2. `gsm` relleno: producto textil y no textil (candidatos históricos a revalidar: `leather-desk-mat`, `folded-valet-tray`, `milled-brass-paperweight`) → aparece en ambos; vacío → fila oculta.
3. Producto que tenga hoy valores en alguna de las 14 claves (si existe; no se crean): no se muestran.
4. Ningún producto muestra «Solid milled brass», «Precision machined» ni su tipo como material sin setting.
5. Archive home: el producto destacado no muestra bloque de procedencia; editor muestra el aviso.
6. PDP y featured product, escritorio y móvil con viewport verificado.

Si R-A no puede ejecutarlas, A-02 queda en «código completo».

# 6. Ledger

Ninguna fila de `docs/requirements-ledger.md` describe A-02 (veracidad de datos de especificación/procedencia). A-02 no cierra ni crea filas y el implementador no edita el ledger.

| Fila (línea en `eb7cca7`) | Estado actual | Relación con A-02 | Estado tras A-02 |
| --- | --- | --- | --- |
| «Schemas Válidos y Settings (100% t: Localizados)» (`docs/requirements-ledger.md:22`) | `cumplido` | Solo si PD-1: cambian siete valores `info`; siguen vía `t:` | `cumplido` sin cambio; evidencia de no regresión: V9 y V10 más `archivo:línea` de las siete claves |
| «Presets Diferenciados (1 a 4)» (`:109`) | `cumplido` | F3 cambia contenido de `listings/archive/` | Sin cambio de estado; la diferenciación no depende de esa frase (PD-4) |
| «3 Tiendas Demo Auténticas» (`:111`) | `cumplido` | Relacionada (claim de Archive), no se toca la tienda | Sin cambio |

Estado máximo alcanzable sin tienda para la tarea A-02: «código completo» (D22; RULES §3.8 y §5). El coordinador lo registra en `CLAUDE-CLOUD-STATUS.md`/`BOARD.md`, no el implementador.

# 7. Informe de entrega del implementador

Ruta: `agent-comms/outbox-claude/CLAUDE-REPORT-A-02-001.md` (archivo nuevo). Contenido mínimo, en este orden:

1. Cabecera RULES §1.4 completa: `ID: CLAUDE-REPORT-A-02-001`, `Estado` (p. ej. «Implementado; código completo; pendiente de revisión D11 y de R-A en tienda»), `Decisión requerida`, `Resumen en 5 líneas`, `Archivos tocados`, `Desviaciones (Nivel 1 o Nivel 2)` (citar el ID del R-D que autorizó el Nivel 2 y toda desviación Nivel 1), `Hallazgos extra fuera de alcance (con parche listo)`, `Verificación`, `Lista de afirmaciones falsables numeradas`.
2. Identidad: modelo, fecha, rama, SHA de HEAD antes de editar, salida de preflight §1.2 completa.
3. Decisión PD-1 aplicada (L-1 sí/no) y referencia al R-D.
4. Diff: `git diff --stat` y `git diff` completo de F1–F4 (son cortos), más SHA-256 y `git hash-object` finales de cada archivo tocado.
5. Tabla de las 14 fuentes y H1–H8: línea antes → «retirada», con prueba V1–V5.
6. Salida literal de V1–V15 con exit code.
7. Tabla de estados degenerados (5.2) con `archivo:línea` del árbol final.
8. Compuertas 1–5 una por una, con lo que demuestran y lo que no; compuerta 5 «pendiente de credenciales».
9. Ledger (§6): ninguna fila cerrada; propuesta de estado por fila.
10. Texto de entrada para C-04-R (§8.1), sin editar ningún release note.
11. Declaración: sin commit, sin push, sin red, sin tiendas, sin `.secrets`, sin variables de entorno leídas, sin dependencias instaladas, sin credenciales en el informe.

El implementador no hace commit ni push. Tras la revisión D11 favorable, el coordinador hace commit en `lote-a` (con la compuerta del literal de D12, que el coordinador ejecuta sin imprimirlo) y push sin force.

# 8. Riesgos, dependencias y qué no hacer

## 8.1 Dependencias

- C-04-R (Lote C, borrador para aprobación de Johandry, D23): las release notes deben avisar que especificaciones y procedencia dejan de leer los metafields `custom.*` y `sartorial.*`, que sus valores existentes ya no se muestran y que el dato se carga en los settings del bloque (plan V4.1 fila C-04-R). Texto de entrada sugerido, en inglés neutro, para que C-04-R lo adopte o reescriba: «Technical specifications and Archival provenance blocks no longer read product metafields (custom.material, custom.gsm, custom.hardware, custom.origin, custom.technical_specs, custom.provenance_date, custom.era, custom.circa_year, custom.condition_grade, custom.provenance_notes and the sartorial.* aliases). Existing metafield values are no longer shown. Enter the information in the block settings; it shows as entered on every product that displays the block.»
- C-08 (en paralelo en el Lote A): no debe editar `sections.featured_product.blocks.provenance.settings.provenance_notes` de `listings/archive/templates/index.json`; esa clave es de A-02. El resto del archivo puede ser editado por C-08 en otro turno (por eso el preflight de F3 es semántico).
- D-01-V: la narrativa técnica, CTA «VIEW TECHNICAL SPECS» y material por tipo son su alcance; A-02 cubre solo el código de `product.type`.
- R-A: pruebas 5.4, pendientes de credenciales.

## 8.2 Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Comerciantes con metafields rellenos pierden la visualización al actualizar | Decidido por Johandry; aviso en C-04-R; `info` del editor (PD-1). |
| `circa_year`/`gsm` se muestran en productos donde no aplican si el comerciante los rellena en una plantilla compartida | Efecto declarado en el plan; `info` (PD-1); R-A lo prueba. |
| Los scripts gate5 buscan `.product-technical-specs` / `.product-provenance` (`scripts/gate5-live-verify.mjs:181–182`); con presets vacíos no estarán en el DOM | Esperado, no es regresión del tema; R-A lo interpreta así. No se tocan los scripts. |
| Edición concurrente de `listings/archive/templates/index.json` o del locale por otra tarea | Escritor único; preflight semántico; si falla, volver a R-D. |
| Liquid: `strip` sobre setting nulo | Devuelve cadena vacía, que cuenta como `blank`; mismo resultado que hoy. |

## 8.3 Hallazgos extra fuera de alcance (registrar en el informe, sin parche)

- Claims de procedencia/documentación en Archive fuera de los bloques A-02: `listings/archive/templates/index.json:22` (subheading), `:42` (body), `:56` (marquee «PARIS & ANTWERP HISTORICAL RUNWAY PROVENANCE») y `listings/archive/templates/collection.json:12`. Son de C-08 o D-01-V; A-02 no los toca.
- `listings/archive/templates/product.json:68` (envío y devoluciones gratuitas): C-08.
- Especificaciones no tiene aviso de editor cuando está vacío (procedencia sí): mejora de superficie del comerciante para el Lote C (PD-3).

## 8.4 Qué no hacer

- No crear, leer, renombrar ni sustituir metafields, metaobjects, namespaces o bindings dinámicos; no proponer metafields nuevos (D17).
- No escribir texto neutro, genérico o de ejemplo en ningún setting ni en el Liquid.
- No borrar ni renombrar bloques, settings, IDs, opciones, defaults, clases CSS ni claves de locale.
- No tocar `sections/`, CSS, JS, otras plantillas, ledger, BOARD, decisiones ni scripts.
- No hacer commit, push, merge, rebase ni crear ramas; no usar force.
- No ejecutar scripts gate5, `shopify theme dev/push/pull`, ni nada contra tiendas; no instalar dependencias.
- No abrir, listar ni buscar en `.secrets`; no leer ni imprimir valores de variables de entorno; no escribir credenciales en archivos ni logs.
- No copiar código de SebastianDev017/atelier.
- No declarar `cumplido` nada.

# 9. Puntos que debe decidir el R-D y conflictos

## 9.1 Conflictos con el plan o decisiones

- C-1. Autoridad del Nivel 2: el plan V4.1 (líneas 4, 58, 87, 192, 375, 433, 439) y las decisiones GPT (`GPT-DECISION-LOTE-0-04-C08-001.md:37`, `GPT-DECISION-LOTE-0-M2-003.md:63`) atribuyen la autorización técnica de A-02 a Gemini (Antigravity). D11 (Johandry, 2026-11-04, posterior) la asigna al revisor Opus de contexto limpio. Resolución propuesta: prevalece D11 por ser decisión posterior y expresa del dueño; no es un caso de parada de D10. Antigravity conserva la revisión final antes del envío (D18).
- C-2. Implementador: el plan asigna la implementación a GPT; D9 asigna la ejecución a Claude (aquí, un subagente Sonnet). Sin efecto técnico.
- C-3. Localizadores del plan: `custom.technical_specs` 26–38 es en realidad 26–40 (consumo 26–39); `product-recommendations.liquid:68–71` ya no apunta a los lectores (fuera de alcance). El resto coincide en `eb7cca7`.
- C-4. C-08 («retirar o sustituir por contenido neutro») y A-02 («sin texto neutro»): compatibles para F3 porque A-02 retira (vacía) y no sustituye.

## 9.2 ¿Algo requiere a Johandry (D10)?

No. A-02 está dentro del plan y de las decisiones registradas (retiro autorizado el 2026-10-30, D11, D17, D22); no hay hallazgo P0/P1 nuevo, ni escritura en tiendas, ni credenciales. Solo si el R-D quisiera conservar la frase de Archive con texto (en lugar de vaciarla) haría falta respaldo factual acreditado por Johandry (plan V4.1 §9); esta directiva no lo propone.

## 9.3 Puntos dudosos para el R-D

- PD-1. ¿Se incluye L-1 (siete `info` en `locales/en.default.schema.json`)? Recomendación: sí. Explica al comerciante el nuevo contrato y corrige el «for this product» engañoso de `hardware`. Es Nivel 1 (sin IDs ni defaults). Si se excluye, F4 sale de la lista y el aviso queda solo en C-04-R.
- PD-2. ¿Se conserva la guarda `contains '{{'` de `circa_year`? Recomendación: sí. Sanea el setting manual, no lee el producto y mantiene el comportamiento actual.
- PD-3. ¿Se añade aviso de editor a especificaciones vacías? Recomendación: no en A-02 (claves nuevas en `en.default.json` y `es.json` fuera de lista). Pasa a hallazgo del Lote C.
- PD-4. ¿El cambio de `listings/archive/` exige anotar la fila «Presets Diferenciados» (`requirements-ledger.md:109`)? Recomendación: no cambiar estado; que R-A/R-C lo regresen con el ZIP final.
- PD-5. Fila de ledger para A-02: recomendación: no crear fila (el ledger refleja requisitos oficiales; A-02 se sigue en BOARD/STATUS como «código completo»). Si el R-D prefiere crearla, la crea el coordinador, no el implementador.

# 10. Esfuerzo

Plan V4.1: ~1 d. Reestimado tras inspección: 2–3 h de edición y verificación estática (cambios acotados a 3 o 4 archivos, sin JS ni CSS), más el tiempo de la revisión D11. Las pruebas en tienda de R-A van aparte y esperan credenciales.

# 11. Evidencia de redacción (comandos ejecutados hoy, solo lectura)

```text
git rev-parse --abbrev-ref HEAD ; git rev-parse --short HEAD ; git status --porcelain | wc -l
-> lote0/base-09f8342 ; eb7cca7 ; 0

npx shopify theme check --path .            -> "92 files inspected with no offenses found." TC_EXIT=0
node scripts/json-validate.mjs              -> JSON_EXIT=0
node scripts/locale-key-inventory.mjs       -> Sin resolver 0/0; Huérfanas 0/0; "OK: todas las referencias estaticas resuelven contra los locales."
node scripts/theme-check-sanity.mjs         -> "OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas." SANITY_EXIT=0
git status --porcelain | wc -l (después)    -> 0

grep -rn -E "metafields\.(custom|sartorial)\." (dirs del tema, excluidos los dos snippets)
-> snippets/cart-drawer-recommendations.liquid:80 (custom.complementary_products) — única

grep -c "Curated period selection with documented archival provenance" listings/archive/templates/index.json -> 1 (línea 111)
grep -n (siete textos info) locales/en.default.schema.json -> líneas 1011, 1015, 1019, 1023, 1035, 1043, 1067; 7 coincidencias, una por texto

Bloques technical_specs/provenance en templates/ y listings/ (lectura JSON):
listings/archive/templates/index.json   featured_product/provenance  provenance_notes no vacío (claim)
listings/archive/templates/product.json main/provenance              todo vacío / not_assessed
listings/imprint/templates/index.json   featured_product/technical_specs  todo vacío
listings/imprint/templates/product.json main/technical_specs              todo vacío
(templates/ raíz y config/settings_data.json: ninguno)

SHA-256 (LF) en eb7cca7:
beba8d51a42e822c8cefb340146046f81fe4e78047519365a41a93d8db58608c  snippets/product-technical-specs.liquid
57eebe0ea0da46485a78afce47c94f79834a7ce86688a6a433b8caad26b28dc4  snippets/product-provenance.liquid
79a1b27123bb2577d4d3737333572aae5546b0bb9593dc3a7e5db79e04736b95  listings/archive/templates/index.json
e01c35041546d2dc65c82307a0a2a0a4a710b62bf276085bc9efa823d39f4ddd  locales/en.default.schema.json
```

Simulación de F1 y F2 (fuera del repo, en el scratchpad del redactor; copia de assets/config/layout/locales/sections/snippets/templates con los dos bloques Liquid de §3.1/§3.2 aplicados):

```text
grep -n -E "metafields|product\.(type|handle|title)|is_non_textile|Solid milled brass|Precision machined" (2 snippets simulados) -> sin salida, exit 1
npx shopify theme check --path <copia simulada> -> "81 files inspected with no offenses found." exit 0
(81 = la copia no incluye listings/ ni package*.json; no es comparable con el 92 del repo)
git status --porcelain (repo) -> solo esta directiva como ??
```

Esto valida la sintaxis del Liquid propuesto y su paso por Theme Check. No sustituye la verificación del implementador sobre el repo (V1 a V15) ni el render en tienda.

Qué demuestra: el estado del código base y que los localizadores de esta directiva son correctos en `eb7cca7`. Qué no demuestra: el comportamiento en tienda, la existencia actual de valores en esos metafields en `tema-qkqpke0j`, ni el resultado de la implementación futura.
