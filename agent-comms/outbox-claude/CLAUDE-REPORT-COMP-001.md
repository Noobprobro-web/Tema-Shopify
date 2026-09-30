# CLAUDE-REPORT-COMP-001 | Ola 1 (S-02 a S-05) y Ola 2 (presets)

```text
ID: CLAUDE-REPORT-COMP-001 (responde a CLAUDE-DIRECTIVE-COMP-001-ola1-ola2-polish)
Estado: ENTREGADO PARCIAL.
  - Ola 1 completa (S-02, S-03, S-04, S-05): en disco y verificada.
  - Tarea 2.1: ya estaba cumplida; no requirió cambios.
  - Tarea 2.2: RETENIDA con 2 parches listos (§3).
  Sin commit, sin push y sin theme push.
Decisión requerida (Gemini; Johandry en el punto 1):
  1. Tarea 2.2: elegir el parche A (directiva literal) o el B (mapeo de GPT-REPORT-014), y cuándo
     aplicarlo. Las 5 colecciones de la directiva no existen en ningún catálogo. Dos de ellas
     (desk-study, runway-selection) y los dos productos del bento contradicen GPT-REPORT-014.
     Recomiendo el B, justo después de importar el catálogo.
  2. Aceptar 4 desviaciones de Nivel 1 (§2), todas medidas en el DOM real.
  3. Paridad semántica del 404: la directiva fija en "Object not found." y es "Página no
     encontrada.". Son frases distintas. Propongo alinear las dos (§5, D-3).
  4. S-06 sigue abierto: la Tarea 2.1 confirma el estado actual, en el que Atelier y Archive
     comparten la pareja Libre Baskerville + Assistant.
  5. Autorizar el despliegue para cerrar la compuerta 5 en tienda real (§4.5).
Resumen en 5 líneas:
  1. S-02: con 0 productos, la cápsula ya no se pinta en la tienda (0 bytes) y conserva el aviso en
     el editor. Con 1 o 4 productos, la salida es idéntica byte a byte a la de antes.
  2. S-03: el nombre del footer ya no se parte en ninguna demo a 360, 390, 768 ni 1440 px
     (antes: "Sartorial" en Atelier; "Sartorial" y "Archive" en Archive, a 1440).
  3. S-04: a 360 y 390 px la marca pasa a 2 líneas en vez de "Sartorial Ateli…". La cabecera
     sigue en 76 px y el scroll horizontal es 0 en los 32 casos medidos.
  4. S-05: 11 textos por idioma sin "atelier"; paridad en/es de 406 claves; 0 huérfanas.
  5. npm run gates:static: exit 0. Theme Check revisó 352 archivos con 0 ofensas. Sartorial-1.0.0.zip regenerado.
Archivos tocados:
  - assets/base.css (+23 −2)
  - sections/complete-the-look.liquid (+7)
  - locales/en.default.json (11 líneas)
  - locales/es.json (11 líneas)
  - este informe y harness-COMP-001/ (sondas, parches, capturas, log).
  config/settings_data.json y listings/ no cambian.
Desviaciones: 4 de Nivel 1 (§2). Ninguna de Nivel 2 implementada.
Hallazgos extra fuera de alcance: sí (§5). El parche de E-1 y E-2 está en harness-COMP-001/patch-extra-E1-E2.diff.
Verificación: §4. Afirmaciones falsables: §6.
```

---

## 1. Cambios por tarea

| Tarea | Archivo:línea (selector o clave) | Cambio |
|---|---|---|
| S-02 | `sections/complete-the-look.liquid:57-62`, `:344` | Envuelve `<complete-the-look>` en `{%- if rendered_item_count > 0 or request.design_mode -%}` … `{%- endif -%}`, con un comentario COMP-001. `rendered_item_count` ya existía (`:8-18`) y cuenta solo los bloques con producto no vacío, así que un producto borrado también cuenta como vacío. No se reindentó, para que el diff quede en 7 líneas. |
| S-03 | `assets/base.css:853-859` (`.site-footer__title`) | `font-size: calc(clamp(1.75rem, 1.2rem + 1.5vw, 2.5rem) * var(--font-heading-scale))`, `overflow-wrap: break-word`, `word-break: normal`. |
| S-03 | `assets/base.css:841-846` (`.site-footer__brand`) | `min-width: 0` en el ítem de la rejilla (ver D-1). |
| S-04 | `assets/base.css:679-694` (`.site-header__brand-text`) | `display: -webkit-box`, `-webkit-box-orient: vertical` y `-webkit-line-clamp: 2`. `line-height` pasa de 1 a 1.1 para no recortar los descendentes de la segunda línea. Añade `text-align: center` y `overflow-wrap: normal`. Quita `white-space: nowrap` y mantiene `text-overflow: ellipsis`. |
| S-04 | `assets/base.css:8431-8434` (`.site-header__brand-text` dentro de `max-width: 47.99rem`) | `text-align: start`, porque en móvil la marca va a la izquierda desde 4F-002. El `clamp(1.1rem, 4.5vw, 1.5rem)` móvil se mantiene (D-4). |
| S-05 | `locales/en.default.json` y `locales/es.json`, mismas líneas | Tabla de abajo. `contact.atelier` es el nombre de una clave, no texto visible (valores "Studio hours" y "Showroom"). Renombrarla obligaría a tocar `sections/main-contact.liquid:43,49`, que está fuera de alcance, y no cambia nada para el comprador. |
| 2.1 | `config/settings_data.json:83,85` · `:103,105` · `:123,125` | Sin cambios: ya son `libre_baskerville_n4`/`assistant_n4` (Sartorial), `assistant_n4`/`assistant_n4` (Edition) y `libre_baskerville_n4`/`assistant_n4` (Archive). `listings/*/` no tiene `config/`; los presets viven en `config/settings_data.json`. |
| 2.2 | `listings/edition/templates/index.json`, `listings/archive/templates/index.json` | **No aplicado** (§3). |

**Textos de S-05:**

| Clave | en (antes → después) | es (antes → después) |
|---|---|---|
| `sections.homepage.manifesto.material_image_alt` (:171) | …an atelier material → "Close-up study of a material" | …del atelier → "Estudio en detalle de un material" |
| `contact.form.eyebrow` (:190) | → "Write to us" | → "Escríbenos" |
| `contact.form.success` (:192) | → "Thank you. We will reply as soon as possible." | → "Gracias. Te responderemos lo antes posible." |
| `faq.search.empty` (:224) | …or write to us. | …o escríbenos. |
| `search.header.eyebrow` (:315), `not_found.search_label` (:352), `predictive_search.dialog_label` (:590) | → "Search our collection" | → "Buscar en la tienda" |
| `not_found.title` (:350) | → "Object not found." | → "Página no encontrada." |
| `password.access.title` (:371) | → "Enter the store" | → "Entra a la tienda" |
| `password.access.instructions` (:372) | → "Use the password provided by the store owner." | → "Usa la contraseña que te facilitó el propietario de la tienda." |
| `newsletter.heading` (:579) | → "Notes from the studio" | → "Notas del estudio" |

Las plantillas de Sartorial (`templates/index.json:284` y `listings/sartorial/templates/index.json:137`) siguen diciendo "Notes from the atelier" a propósito: son la voz del preset Sartorial y no el valor por defecto.

---

## 2. Desviaciones de Nivel 1

- **D-1 · S-03: `overflow-wrap: break-word` y no `normal`, más `min-width: 0` en `.site-footer__brand`.**
  - **Qué pasa con `normal`, tal como pide la directiva:** un nombre de una sola palabra larga sale de la columna. Con "Aktiengesellschaftsverwaltungsgesellschaft", medido en Atelier, da 311 px de scroll horizontal a 360 y 281 px a 390. Eso incumple la compuerta 2 (estado "muy largo") y WCAG 1.4.10.
  - **Por qué `break-word` solo no basta:** no cuenta la palabra como divisible al calcular el ancho mínimo, así que la columna crecía igualmente (219 y 189 px de scroll). `min-width: 0` en el ítem de la rejilla lo evita.
  - **Resultado:** 0 px de scroll en todos los casos. Con los nombres reales no se parte ninguna palabra; la única palabra que se parte es la imposible, como último recurso (§4.2).
- **D-2 · S-03: multiplicador `var(--font-heading-scale)` sobre el `clamp()` de la directiva.** `.h2` escala con el ajuste "Heading scale" (`base.css:217-221`). Sin el multiplicador, ese ajuste dejaría de afectar al título del footer, y eso rompe un contrato con el comerciante. Tamaños resultantes:
  - Atelier (105): de 29,4 px a 42 px.
  - Edition (100): de 28 px a 40 px.
  - Archive (110): de 30,8 px a 44 px.
- **D-3 · S-04: se mantiene `text-overflow: ellipsis`.** Sin él, una palabra única más ancha que la columna se cortaba en seco ("Aktiengesellscha"). Con él termina en "Aktiengesellsc…" (`shots/after-header-390-oneword.png`).
- **D-4 · S-04: no cambia el `clamp()` móvil.** Ya existía en `base.css:8432` (`clamp(1.1rem, 4.5vw, 1.5rem)`, 17,6 px a 390). Con 2 líneas, "Sartorial Atelier" y "Sartorial Archive" caben sin recorte a 360 y 390, así que reducir el tamaño solo restaría legibilidad.

---

## 3. Tarea 2.2 retenida: los handles no existen y contradicen el catálogo aprobado para importar

**Qué encontré:**
- **Las 5 colecciones no existen en ningún catálogo:** `leather-goods`, `daily-objects`, `desk-study`, `permanent-archive` y `runway-selection` solo aparecen en la propia directiva (barrido con `grep -rl` en los dos proyectos). Las demos tienen 0 colecciones con productos (CLAUDE-AUDIT-COMP-001, §5.1).
- **Qué pinta la vitrina con una colección inexistente:** placeholders, es decir, SVG en el destacado, 2 tarjetas grises y un enlace a `/collections/all` (`sections/curated-showcase.liquid:94-137`). Con `all`, en cambio, muestra el catálogo de cualquier tienda, incluida la de un comerciante que instale el preset.
- **La línea 82 de `GPT-REPORT-014`, que define el catálogo que se va a importar**, dice otra cosa:

  | Elemento | Directiva | GPT-REPORT-014 |
  |---|---|---|
  | Pestañas de Edition | `leather-goods`, `daily-objects`, `desk-study` | `daily-objects`, **`desk-and-study`**, `leather-goods` |
  | Pestañas de Archive | `permanent-archive`, `runway-selection` | `permanent-archive`, **`restored-pieces`**. Runway "should not be a tab until its proof gate clears" |
  | Bento de Edition | `structured-tote`, `leather-belt` | **`leather-desk-mat`, `milled-brass-paperweight`** (`leather-belt` no está entre los 13 productos de Edition) |
  | Cápsula de Edition (no estaba en la directiva) | — | E04 + E08 + E11: "replace fashion handles" |

- **El bento de la directiva duplica la cápsula:** el bento quedaría con `structured-tote` y `leather-belt`, y la cápsula que va justo debajo (`set`) ya usa `structured-tote` y `leather-belt`.

**Parches listos (los dos pasan `git apply --check`):**
- **`harness-COMP-001/patch-2.2-A-directiva.diff`** (7 líneas): la directiva al pie de la letra.
  - Edition: daily → `daily-objects`, workspace → `desk-study`, limited → `leather-goods`; bento → `structured-tote` y `leather-belt`.
  - Archive: current → `permanent-archive`, archive → `runway-selection`.
- **`harness-COMP-001/patch-2.2-B-gpt014.diff`** (10 líneas): el mapeo de GPT-REPORT-014.
  - Edition: pestañas → `daily-objects`, `desk-and-study` y `leather-goods`; bento → `leather-desk-mat` y `milled-brass-paperweight`; cápsula → `leather-document-folio`, `four-slot-cardholder` y `folded-valet-tray`.
  - Archive: pestañas → `permanent-archive` y `restored-pieces`.

**Recomendación:** aplicar el B justo después de importar el catálogo de Edition y Archive. Aplicado antes, las vitrinas de las 2 demos y de la tienda de desarrollo pasan de productos (o de `all`) a placeholders.

**Nota:** la etiqueta "Limited studies" no encaja con `leather-goods` en ninguno de los dos parches. Si se aplica, conviene cambiarla también (por ejemplo, a "Leather goods").

---

## 4. Verificación

### 4.1 Compuertas estáticas

```text
npm run gates:static > harness-COMP-001/gates-static.log 2>&1; echo "EXIT=$?"
EXIT=0
JSON VALIDATE: Archivos .json comprobados: 310 · Fallos de parseo: 0
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
Sin resolver en storefront: 0 · Sin resolver en schema: 0 · Huerfanas en storefront: 0 · Huerfanas en schema: 0
LEDGER VERIFY: Filas de requisito: 57 (53 cumplido, 2 código completo, 2 no verificado, 0 ausente) · Incoherencias: 0
Theme Check Summary: 352 files inspected with no offenses found.
node --check assets/theme.js && node --check assets/product-zoom.js  (sin salida = OK)
Your local theme was packaged in Sartorial-1.0.0.zip
```

**Sobre las cifras de la directiva ("351 archivos", "304 JSON"):**
- **Theme Check, 352 archivos:** los 351 del tema más `scratch/tailoring_products.json`. Ese archivo lo creó otro agente hoy a las 18:06, git lo ignora (`.gitignore:25:scratch/`) y no lo toqué.
- **JSON, 310 archivos:** 304 más ese mismo archivo y 5 JSON de mis sondas (en `harness-COMP-001/.before/` y `.data/`), que se validan pero Theme Check no inspecciona.
- **Incidente corregido:** en una primera pasada, Theme Check marcó 29 avisos, todos en mi copia de línea base `harness-COMP-001/before/sections/complete-the-look.liquid`. La moví a `.before/` (carpeta con punto, que no se inspecciona) y la suite volvió a 0.

**Paridad de locales:**
```text
node -e '…hojas de en.default.json vs es.json…'
en hojas 406 es hojas 406 solo en 0 solo es 0
grep -n -i "atelier" locales/en.default.json locales/es.json
locales/en.default.json:185:    "atelier": {
locales/es.json:185:    "atelier": {
```

**Diff mínimo:**
```text
git diff --numstat -- assets/base.css sections/complete-the-look.liquid locales/
23  2   assets/base.css
7   0   sections/complete-the-look.liquid
11  11  locales/en.default.json
11  11  locales/es.json
```

- **Qué pasó con `base.css`:** el original tenía 4 secuencias `\r\r\n` (`base.css:3035-3036` y `:3771-3772`, de un sprint anterior). Git clasifica el archivo como `-text` por ellas. La herramienta de edición las normalizó y el diff salió como el archivo entero (8927/8906).
- **Cómo se resolvió:** restauré los 4 CR en su posición exacta, localizándolos por contexto. El archivo es idéntico byte a byte al de HEAD salvo mis líneas (`git ls-files --eol`: `i/-text w/-text`).

### 4.2 S-03 y S-04 contra el DOM real de las 3 demos

**Método:**
- Playwright con la sesión de la tienda ya abierta.
- `page.route` sustituye el `base.css` publicado por el local, antes o después, servido por `harness-COMP-001/serve.mjs` en 127.0.0.1. No se cambia nada en la tienda.
- Cada carga confirma qué CSS está activo buscando la regla nueva en `document.styleSheets`.
- Se mide en 4 anchos. En Atelier se inyectan 5 nombres además del real.
- Sonda: `harness-COMP-001/verify-css.js`.

Extracto literal de la última pasada:

```text
before atelier 1440 real      css=old | HDR 25.6px/26px … | FTR 75.6px/253px 3L … ROTA:Sartorial | hScroll=0
before archive 1440 real      css=old | HDR 25.6px/26px … | FTR 79.2px/348px 4L … ROTA:Sartorial|Archive | hScroll=0
before atelier 390  real      css=old | HDR 17.6px/18px 0L clampV=1 ovH=3 hdrH=76 …   (una línea con elipsis)
before archive 360  real      css=old | HDR 17.6px/18px 0L clampV=1 ovH=43 hdrH=76 …
after  atelier 360  real      css=new | HDR 17.6px/39px 2L clampV=0 ovH=0 hdrH=76 gapIconos=4 | FTR 29.4px/37px 1L … | hScroll=0
after  atelier 390  real      css=new | HDR 17.6px/39px 2L clampV=0 ovH=0 hdrH=76 gapIconos=4 | FTR 29.4px/37px 1L … | hScroll=0
after  atelier 390  long120   css=new | HDR 17.6px/39px 2L clampV=194 ovH=0 hdrH=76 … | FTR 29.4px/234px 7L … | hScroll=0
after  atelier 390  oneword   css=new | HDR 17.6px/19px 1L clampV=1 ovH=260 hdrH=76 … | FTR 29.4px/70px 2L … ROTA:Aktiengesellschaftsverwaltungsgesellschaft | hScroll=0
after  atelier 1440 real      css=new | HDR 25.6px/28px … | FTR 42px/96px 2L clampV=0 ovH=0 | hScroll=0
after  archive 1440 real      css=new | HDR 25.6px/28px … | FTR 44px/101px 2L clampV=0 ovH=0 | hScroll=0
after  edition 360  real      css=new | HDR 17.6px/39px … ovH=0 hdrH=76 | FTR 28px/37px 1L … | hScroll=0
```

**Lectura de la tabla:**
- **Nombres reales, footer:** después, "ROTA" no aparece en ningún caso con nombre real, a ningún ancho y en ninguna demo.
- **Scroll horizontal:** es 0 en los 32 casos de "after".
- **Cabecera:** mide 76 px en todos los casos, antes y después, y la marca deja al menos 4 px con los íconos (`gapIconos`).
- **Recorte de nombres largos:** `clampV` grande solo aparece con el nombre de 120 caracteres, que termina en "…" en la segunda línea.
- **Nota sobre la sonda:** `0L` en los casos de una sola línea es un artefacto de la sonda (el rect de línea sobresale del elemento). La altura en px es la medida fiable.

**Capturas** (`harness-COMP-001/shots/`):
- `after-header-390.png`: "Sartorial / Atelier".
- `after-header-390-long120.png`: "The / Considered…".
- `after-header-390-oneword.png`: "Aktiengesellsc…".
- `after-footer-1440.png`: "Sartorial / Atelier" en 2 líneas limpias.

### 4.3 S-02 con el Liquid real (liquidjs 10.29.0, `npm install --no-save`; `package.json` y el lockfile sin cambios)

```text
node harness-COMP-001/liquid-s02.mjs
== antes
  vacio, tienda                                  bytes=3070   seccion=si aviso-editor=SI total-0=SI items=0 contador="0 of 0 items selected"
  vacio, editor                                  bytes=3070   seccion=si aviso-editor=SI total-0=SI items=0 contador="0 of 0 items selected"
  producto borrado (bloque sin producto), tienda bytes=3070   seccion=si aviso-editor=SI total-0=SI items=0 contador="0 of 0 items selected"
  1 producto, tienda                             bytes=4784   seccion=si aviso-editor=no total-0=no items=1 contador="1 of 1 item selected"
  1 producto agotado, tienda                     bytes=4838   seccion=si aviso-editor=no total-0=SI items=1 contador="0 of 1 item selected"
  4 productos, tienda                            bytes=9881   seccion=si aviso-editor=no total-0=no items=4 contador="4 of 4 items selected"
== despues
  vacio, tienda                                  bytes=0      seccion=NO aviso-editor=no total-0=no items=0 contador="-"
  vacio, editor                                  bytes=3070   seccion=si aviso-editor=SI total-0=SI items=0 contador="0 of 0 items selected"
  producto borrado (bloque sin producto), tienda bytes=0      seccion=NO aviso-editor=no total-0=no items=0 contador="-"
  1 producto, tienda                             bytes=4784   seccion=si aviso-editor=no total-0=no items=1 contador="1 of 1 item selected"
  1 producto agotado, tienda                     bytes=4838   seccion=si aviso-editor=no total-0=SI items=1 contador="0 of 1 item selected"
  4 productos, tienda                            bytes=9881   seccion=si aviso-editor=no total-0=no items=4 contador="4 of 4 items selected"
```

### 4.4 Estados degenerados (compuerta 2)

| Estado | S-02 (cápsula) | S-03 (footer) | S-04 (cabecera) |
|---|---|---|---|
| Vacío | Oculta en la tienda; aviso en el editor | — | — |
| Uno solo | 1 producto: se pinta igual que antes | "Nove": 1 línea | "Nove": 1 línea |
| Muchos | 4 productos (el `max_blocks` de la sección): igual que antes | — | — |
| Muy largo | — | 120 caracteres: 7 a 13 líneas, sin palabras partidas y sin scroll | 120 caracteres: 2 líneas y "…" |
| Faltante | Producto borrado: se trata como vacío | Palabra de 42 letras: se parte como último recurso, 0 px de scroll | Palabra de 42 letras: "…" |

**Residual, sin cambios:** si todos los productos de la cápsula están agotados, la sección se sigue mostrando, con "Sold out" y un total de $0.00. Es información válida para el comprador y queda fuera de S-02.

### 4.5 Qué no demuestra esta verificación

- **Nada está desplegado.** S-03 y S-04 se midieron con el CSS local sustituido en las demos reales. S-02 se midió con liquidjs, no con el Liquid de Shopify. S-05 se verificó de forma estática.
- **Compuerta 5:** según RULES §3.8, las filas que dependan de estos cambios quedan en `código completo` hasta que Gemini despliegue y se mida en `tema-qkqpke0j` y en las 3 demos.
- **Qué comprobar tras el despliegue:**
  - que el inicio de Atelier ya no enseña la cápsula (sus productos no existen en la demo);
  - que el footer y el 404 de Edition dicen "Notes from the studio" y "Object not found.".
- **Tienda de desarrollo:** no pude entrar en `tema-qkqpke0j` (tiene contraseña) y no se tocó el editor de temas.

---

## 5. Hallazgos extra (fuera de alcance, sin tocar)

| ID | Qué | Dónde | Parche |
|---|---|---|---|
| E-1 | La PDP de Edition y Archive dice "Pieces held in the atelier leave within three business days…" (misma clase que S-05, pero en el contenido del preset) | `listings/edition/templates/product.json:68`, `listings/archive/templates/product.json:68` | `patch-extra-E1-E2.diff` → "Pieces in stock leave…" |
| E-2 | El comerciante ve el bloque "Atelier gallery". La compuerta 4 prohíbe la marca fija en la superficie del comerciante | `locales/en.default.schema.json:1303` | En el mismo diff → "Gallery" (solo cambia el valor; el `id` `atelier_gallery` se mantiene) |
| E-3 | Valores por defecto de schema con "atelier" (Nivel 2, porque cambian un `default`) | `complete-the-look.liquid:391`, `main-about.liquid:234`, `main-blog.liquid:198`, `main-collection.liquid:519`, `main-contact.liquid:282`, `main-faq.liquid:244,250`, `newsletter.liquid:89` | Propuesta: "studio" o frase neutra; necesita autorización |
| E-4 | El 404 también arrastra la voz de Archive en todos los presets: `not_found.eyebrow` "Error / Archive index" y `message` "…moved into the archive" | `locales/en.default.json:349,351` y el equivalente en `es.json` | Propuesta: "Error 404" y "The page you requested could not be found." |
| D-3 | Paridad semántica: en "Object not found." frente a es "Página no encontrada." | `locales/*.json:350` | Alinear a "Page not found." o a "Objeto no encontrado." |
| E-5 | `.playwright-mcp/` (registros del MCP de Playwright) no está en `.gitignore` | raíz | Añadir `.playwright-mcp/` a `.gitignore` |

`harness-COMP-001/patch-extra-E1-E2.diff` pasa `git apply --check` (3 líneas).

---

## 6. Afirmaciones falsables

1. `git diff --numstat` da `23 2 assets/base.css`, `7 0 sections/complete-the-look.liquid`, `11 11 locales/en.default.json` y `11 11 locales/es.json`. `config/settings_data.json` y `listings/` no aparecen en `git status`.
2. `sections/complete-the-look.liquid:62` es `{%- if rendered_item_count > 0 or request.design_mode -%}` y `:344` es `{%- endif -%}`, justo después de `</complete-the-look>`.
3. Con `harness-COMP-001/liquid-s02.mjs`, la versión nueva da 0 bytes con 0 productos en la tienda y 3070 bytes, con el aviso, en el editor. Con 1 y 4 productos da 4784 y 9881 bytes, igual que la versión anterior.
4. `.site-footer__title` (`base.css:853`) declara `overflow-wrap: break-word` y un `font-size` con `* var(--font-heading-scale)`. `.site-footer__brand` (`:841`) declara `min-width: 0`.
5. Con el CSS nuevo, ningún nombre real de las 3 demos parte palabra en el footer a 360, 390, 768 ni 1440 px, y `scrollWidth - clientWidth` del documento es 0 en los 32 casos, incluidos 120 caracteres y una palabra de 42 letras.
6. Con el CSS nuevo, `.site-header__brand-text` mide 39 px de alto (2 líneas) a 360 y 390 en Atelier y Archive, y `.site-header__inner` mide 76 px en todos los casos, antes y después.
7. `grep -n -i atelier` en los 2 locales de storefront solo devuelve la línea 185 (`"atelier": {`).
8. en.default.json y es.json tienen 406 hojas cada uno, con 0 claves exclusivas en cualquiera de los dos.
9. `npm run gates:static` termina con exit 0 y Theme Check informa "352 files inspected with no offenses found".
10. Ninguno de los 5 handles de colección de la Tarea 2.2 aparece fuera de la directiva en `Tema Shopify/` ni en `Creacion de productos/`. `GPT-REPORT-014.md:82` mapea las pestañas de Edition a `desk-and-study` y las de Archive a `restored-pieces`.
11. `harness-COMP-001/patch-2.2-A-directiva.diff`, `patch-2.2-B-gpt014.diff` y `patch-extra-E1-E2.diff` pasan `git apply --check` sobre el árbol actual.
