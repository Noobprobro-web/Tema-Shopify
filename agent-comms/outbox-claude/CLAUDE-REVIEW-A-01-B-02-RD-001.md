# CLAUDE-REVIEW-A-01-B-02-RD-001: R-D de `CLAUDE-DIRECTIVA-A-01-B-02-001` (suscripciones y variantes sin JS)

```text
ID: CLAUDE-REVIEW-A-01-B-02-RD-001
Estado: Entregado. Veredicto: APROBADA CON CAMBIOS (C-1 a C-8, §7).
Decisión requerida: Coordinador Claude: aplicar C-1 a C-8 a la directiva y entregarla al implementador sin
  nueva R-D. C-1 y C-2 corrigen el diseño dentro de los mismos archivos y siguen siendo Nivel 1; el resto son
  correcciones de procedimiento y redacción. Johandry: NINGUNA DECISIÓN DE ESTA R-D REQUIERE A JOHANDRY
  (PD-1 y PD-4 se resuelven dentro del plan y de D15; §4).
Resumen en 5 líneas:
  1. Diagnóstico confirmado: el <select name="selling_plan"> sin JS (main-product:577, featured:325) nunca se
     desactiva y el único name="id" es el hidden (:477 / :226), que solo cambia por JS (theme.js:835-841).
     El harness del redactor, repetido, da salidas idénticas byte a byte en base y en prototipo.
  2. Harness propio (Liquid propuesto traducido a mano, theme.js real con S-4): 11 pruebas por superficie.
     Pasan multiopción, 40/250 variantes, texto largo, JSON roto, theme.js lento, 404 y con error de sintaxis.
  3. Dos defectos del diseño: con más de 250 variantes y ?variant= fuera de las 250 se muestra 9260 y se
     envía 9000 (C-1). Con JS, form.elements.namedItem('id') y form.id pasan a ser RadioNodeList con
     value "" (C-2).
  4. PD-1 SÍ (S-5 entra: el plan exige «JS desactivado o fallido»). PD-2 NO. PD-3 SÍ. PD-4: lectura correcta.
     PD-5 SÍ. PD-6 reutilizar. K-1 y K-5 sin Johandry.
  5. Ledger: filas 69 y 71 → «código completo» tras implementar. La 69 vuelve a «cumplido» solo con
     credenciales (B-02 no necesita el fixture). La 71 necesita además el fixture C-R0-4 (C-6).
Archivos tocados: solo este archivo (nuevo). Scratch: /tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rd-a01/
  (rd-harness.mjs, rd-salida.txt, rep-base.txt, rep-fix.txt, count-review.py). Sin git de escritura, sin red,
  sin tiendas, sin .secrets, sin gate5, sin metafields.
Desviaciones (Nivel 1 o Nivel 2): ninguna en esta revisión. La directiva, con C-1 a C-8, es Nivel 1 (§5.2).
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo con parche. Se confirman los tres de §7.2 de
  la directiva. Se añade una observación de proceso: el árbol de lote-a tiene trabajo sin commit de otros turnos (§1, C-4).
Verificación (comando, resultado y qué demuestra/qué no): §1 a §3. ESTÁTICA y SINTÉTICA (Chromium local de
  Playwright 1.63.0, HTML traducido a mano). No demuestra cómo interpreta Shopify el payload, ni el
  comportamiento de «Buy it now», apps o tiendas.
Lista de afirmaciones falsables numeradas: §9.
```

# 1. Identidad de lo revisado

- Fecha: 2026-11-04 (lectura de `date -u`: `2026-11-04T19:41:36Z`).
- `git branch --show-current` → `lote-a`. `git rev-parse HEAD` → `eb7cca797f9de142089c6c14daaa5ed449597f9f`.
- `sha256sum` (prefijo de 16), idéntico a la tabla §1.3 de la directiva: `theme.js 024ba08f31f4d20c`, `main-product.liquid 56741a8a3bcda4b9`, `featured-product.liquid f4319ed320209db4`, `layout/theme.liquid 100ea68672dc99d0`.
- **Observación de proceso.** Durante esta revisión, `git status --short` pasó de mostrar solo directivas sin commit a mostrar, además, cambios sin commit de otros turnos:
  - `assets/base.css` (A-03);
  - `listings/archive/templates/index.json`, `locales/en.default.schema.json`, `snippets/product-provenance.liquid` y `snippets/product-technical-specs.liquid` (A-02);
  - `CLAUDE-REPORT-A-02-001.md`, `CLAUDE-REPORT-A-03-001.md`, `CLAUDE-REVIEW-A-02-001.md`, `CLAUDE-REVIEW-A-03-RD-001.md`, `CLAUDE-DIRECTIVA-C-08-001.md` y `harness-A-03-001/`, sin seguimiento.

  Ninguno toca los cuatro archivos de esta directiva (hashes sin cambios), pero eso afecta a C-4. Theme Check se ejecutó sobre ese árbol mixto: `92 files inspected with no offenses found.`
- Compuertas base: `node --check assets/theme.js` OK. `theme-check-sanity` da `OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.` `locale-key-inventory` da `OK: todas las referencias estaticas resuelven contra los locales.` `dataset-hooks` y `json-validate` salen sin fallos.

# 2. Diagnóstico A-01 y B-02 (punto 1 del encargo)

## 2.1 Causa común, comprobada en el código

| Afirmación de la directiva | Comprobación | Resultado |
| --- | --- | --- |
| Select sin JS de planes nunca desactivado | `rg -n "SellingPlanNoJs\|selling-plans__no-js\|no-js-only" assets/` solo encuentra CSS (`base.css:5294,5346,5354,5653`). `main-product.liquid:577` y `featured-product.liquid:325` no llevan `disabled`. | Confirmada |
| `.js .no-js-only` solo oculta | `base.css:5653-5655`, `display: none !important` | Confirmada |
| `FormData` en el cajón | `theme.js:2558` `new FormData(form)`, `:2588` `formData.get('id')` | Confirmada |
| Hidden de plan activado por JS | `theme.js:772` `this.sellingPlanInput.disabled = !subscriptionSelected`; nace `disabled` (`main-product:570`) | Confirmada |
| Radios fuera del `<form>` y sin `form=` | `main-product:238-248` (`name="options[...]"`), `featured:136-146`; el `<form>` abre en `:472` / `:221` | Confirmada |
| `id` solo por JS | `theme.js:835-841` (`updateForms`) | Confirmada |
| Sin `<noscript>` | `rg -n noscript` en las dos secciones, rc=1 | Confirmada |
| `theme.js` diferido y clase `js` en línea | `layout/theme.liquid:95` `defer="defer"`, `:97-99` | Confirmada |
| Antecedentes RC-01/RC-02, TT-100/TT-101 | `GPT-AUDIT-THREE-THEMES-MASTER-001.md:238-239`; `CLAUDE-AUDIT-THREE-THEMES-MASTER-001.md:167-168,212`. Esa fila `:212` dice literalmente «sin JS o theme.js caído». | Confirmada: no es un hallazgo P0/P1 nuevo según D10 |
| p3 = `qa5a-f06-subscription` | `GPT-REPORT-LOTE-0-AVANCE-002.md:77` (`requiresSellingPlan=true`, sin grupos) | Confirmada |

## 2.2 Repetición del harness del redactor

- `node harness.mjs /home/user/Tema-Shopify` y `FIX=1 node harness.mjs ...`, ejecutados desde `.../scratchpad/a01/` con salida en `.../scratchpad/rd-a01/rep-base.txt` y `rep-fix.txt`.
- `diff <(sort salida-eb7cca7.txt) <(sort rep-base.txt)` da `BASE-IDENTICA`. El mismo `diff` con el prototipo da `FIX-IDENTICA`.
- Se reproducen todas las filas de §2.2 y §3 de la directiva en las dos superficies. Ejemplos de la base:
  - suscribir: `["1",""]`;
  - caso C: `["1"]`;
  - `requires`, plan 2: `["2","1"]`;
  - B-02 sin JS y con 404: `id ["101"]` tras elegir 102.
- Con el prototipo: `[]`, `["1"]`, `["2"]`, `[]`, `["3"]`, y `id ["102"]` sin JS y con 404.

**Fidelidad del HTML a mano frente al Liquid.** Se comparó línea a línea con `main-product.liquid:1-24,215-268,470-635,722-779` y `featured-product.liquid:1-28,66-150,218-345,495-531`. La fidelidad es suficiente para el mecanismo (controles con nombre, `disabled`, orden en el DOM, clases `js-only`/`no-js-only`, JSON). Hay divergencias que no alteran el resultado, pero el harness entregable debe corregirlas (C-7):

1. En el producto destacado, los radios de compra se llaman `featured-purchase-option-{{ section.id }}` (Liquid), no `purchase-option-<id>`. La fila «Sin JS: residuos» de la directiva §2.2 cita mal el nombre en esa superficie.
2. Falta el `<pickup-availability data-variant-id>` dentro de `variant-selects` (`snippets/pickup-availability.liquid:20`, renderizado en `main-product:646`). Sin él no se prueba que el selector `input[data-variant-id]` de S-4 lo evite.
3. Solo hay productos de una opción. B-02 multiopción (H-15) exige dos opciones reales.
4. Separadores ` - ` en lugar de ` / ` y texto de opciones sin precio en el select de planes. Es cosmético.

# 3. Solución S-1 a S-5 (punto 2 del encargo)

## 3.1 Harness propio

Archivo: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rd-a01/rd-harness.mjs`. Salida: `.../rd-a01/rd-salida.txt`.

- Traduce a mano el Liquid PROPUESTO por S-1 a S-3, con el tope de 250 de `product.variants`, y añade `pickup-availability`.
- Carga `assets/theme.js` real con S-4 aplicado en memoria, en dos variantes: `fix` (S-4 literal) y `fixname` (S-4 más C-2).
- Incluye S-5 tal como está redactado.
- Modos de `theme.js`: lento (1500 ms), 404 y con error de sintaxis.
- Formato dinero largo: `€50,00 EUR`.

Resultados, idénticos en PDP y producto destacado salvo T10 y T11:

| Prueba | Resultado | Lectura |
| --- | --- | --- |
| T1 p8 (Color×Size, Red/M agotada), sin JS / 404 / error de sintaxis, elige Blue/M | `id ["804"]` en los tres; `html: no-js`; select `display:block`; picker `display:none`; opciones desactivadas `["802"]` | B-02 multiopción y S-5 correctos |
| T2 p4 (solo variante por defecto), sin JS | 1 `name="id"`; POST `id ["401"]` | H-12 correcto |
| T3 p3 (`requires` sin grupos), con y sin JS | `btn: true, notice: true` en ambos | H-6 correcto |
| T4 p5 / p6 | 40 / 250 opciones; bytes del bloque select 2203 / 12853 (PDP); elegir la última da `id` correcto | H-13 correcto; peso informado |
| **T4 p9, 300 variantes, `?variant=9260`, sin tocar** | **S-1 literal: POST `id ["9000"]` con la variante 9260 pintada por el servidor. Con C-1: `["9260"]`** | **Defecto del diseño: «se muestra B y se envía A» (C-1)** |
| T5 p7, título de 120 caracteres y precio largo | POST `id ["702"]`; texto de la opción con 138 caracteres | H-14 correcto |
| T6 p1, JSON roto, `?selling_plan=1` | `id ["101"]`, `selling_plan ["1"]`, un valor por nombre (estado del servidor) | §4.3.1 de la directiva correcto |
| T7 `theme.js` lento 1500 ms | `html: js`; hidden activo; `[data-no-js-control]` `[true,true]` desactivados | Sin vuelta falsa a `no-js`: `defer` se ejecuta antes de `DOMContentLoaded` |
| **T8 con JS, M y suscripción** | `FormData` correcto con `fix` y `fixname`: `id ["102"]`, `sp ["1"]`. **Con `fix`: `form.elements.namedItem('id')` y `form.id` son `RadioNodeList`, con `.value === ""`; lo mismo `selling_plan`. Con `fixname`: `HTMLInputElement`, valores `102` / `1`** | **Regresión introducida por S-1 + S-4 (C-2)** |
| T8 `pickup-availability` | propiedad `disabled` = `null` (no se toca) | El selector `input[...]` de S-4 es correcto |
| T9 foco sin JS (Tab ×3) | `SELECT:id` → `SELECT:selling_plan` → `BUTTON:add`; etiquetas `Choose options` y `Purchase options` asociadas por `for` | Orden y etiquetas correctos |
| T10 dos destacados en una página | IDs duplicados: `[]` | R-3 correcto |
| T11 PDP sin bloque `variant_picker` | 1 `name="id"`; POST `id ["101"]` | Se conserva el comportamiento actual |

## 3.2 Valoración

- **Corrección.** El principio «un único control exitoso por nombre en cada modo» es correcto y es la solución mínima. La lógica de `VariantSelects` no necesita cambios (repetición del harness, T1 y T8). Se aceptan S-1 a S-5 con dos correcciones:
  - **C-1 (más de 250 variantes).** `product.variants` devuelve como máximo 250 variantes (límite documentado por Shopify; en tienda no verificado). Con una variante seleccionada fuera de esas 250, ninguna opción lleva `selected`. Entonces el navegador selecciona la primera opción no desactivada y el formulario envía otra variante (T4 p9). La directiva no lo trata como degenerado: §4.3.5 solo habla de alcance.
  - **C-2 (named access).** Con JS quedan dos elementos `name="id"` (y dos `name="selling_plan"`) en `form.elements`. `FormData` y el POST nativo son correctos porque excluyen los desactivados, pero el acceso por nombre devuelve un `RadioNodeList` con valor vacío (T8). En `eb7cca7`, `form.id` era un único `HTMLInputElement`. El código de «Buy it now» (`form | payment_button`) y las apps de suscripción u opciones no están en el repositorio. Que lean el `id` por acceso con nombre no está verificado, pero quitar el `name` al tomar el control elimina el riesgo con una sola línea. Esto también mejora A-01, porque hoy `selling_plan` ya es un `RadioNodeList`.
- **Accesibilidad.**
  - Sin JS, el select nativo tiene `<label for>` (reutiliza `products.product.choose_options`) y queda en el orden de foco del formulario (T9). Los radios ocultos con `display:none` salen del orden de foco y del árbol accesible.
  - Con JS, el select está oculto, desactivado y, con C-2, sin `name`.
  - No hay `aria-*` nuevos ni en conflicto.
  - En las cuatro plantillas reales el bloque `variant_picker` precede a `quantity` y a `buy_buttons` (`templates/product.json`, `listings/*/templates/{product,index}.json`). Sin JS, el select aparece después de la cantidad: es aceptable y se informa, no se corrige.
- **Compatibilidad.**
  - `variant-selects` solo lo montan las dos secciones (`rg "<variant-selects"`).
  - Ningún JS del tema lee `namedItem('id')`, `elements.id` ni `[name="id"]`: el `rg` del preflight sale con rc=1.
  - La compra rápida (`product-card.liquid:92`) y las recomendaciones del cajón (`cart-drawer-recommendations.liquid:141`) excluyen productos con planes y usan formularios propios, sin `variant-selects`.
  - `StickyCartBar.handOffFocus` filtra `!element.disabled` y `checkVisibility` (`theme.js:1328-1335`).
  - `getInitialVariant` lee el primer `[data-variant-id]`, que es el hidden porque `pickup-availability` va después (`main-product:646`).
  - Ninguna sección se vuelve a renderizar por fetch dentro de un modal: `rg "main-product|featured-product" assets/theme.js` no da resultados.
- **Consistencia.**
  - Precio con `money | strip_html`, como `data-money-format` (`main-product:184`) y el select de planes (`:593`).
  - Sin `Intl` y sin claves nuevas: `choose_options` y `sold_out` existen en `en.default.json` («Choose options», «Sold out») y en `es.json` («Elegir opciones», «Agotado»).
  - Mismo hook en las dos secciones. `buy_buttons` y `variant_picker` tienen `"limit": 1` en los dos schemas, así que el `id` del select es único por sección.
- **Estados degenerados.** Están cubiertos: 1 variante (p4), 40 (p5), 250 (p6), 251+ (p9, tras C-1), agotada (p1 XL, p8), plan opcional (p1), plan obligatorio (p2), plan obligatorio sin grupos (p3), texto largo (p7), sin bloque picker (T11), JSON roto (T6) y destacado sin producto (no hay formulario: `featured-product:219`). El prototipo del redactor pasa todos sus casos. El mío también, salvo T4 p9 y T8 sin C-1/C-2.

# 4. Decisiones (punto 3 del encargo)

| ID | Decisión del R-D | Fundamento |
| --- | --- | --- |
| **PD-1** | **SÍ. `layout/theme.liquid` (S-5) entra en la lista cerrada. Está DENTRO del plan, no es un cambio fuera del plan (D10).** | (1) El criterio de B-02 del plan V4.1 §4.1 dice literalmente «JS desactivado **o fallido**», y TT-101 lo define como «sin JS o theme.js caído» (`CLAUDE-AUDIT-...:212`). (2) La columna del plan se titula «Dueño y superficies **candidatas**», y §5.1 asigna a la R-D fijar la «lista cerrada de archivos permitidos». Ampliar las candidatas para cumplir un criterio explícito es justo lo que la R-D decide. (3) No toca settings, schema, IDs ni defaults (RULES §3.5: Nivel 1 dentro de la lista). (4) T7: sin efecto con `theme.js` sano, aunque sea lento. T1 404 y T1 con error de sintaxis: aplica la degradación `.no-js` que ya existe. Condiciones en C-5. |
| **PD-2** | **NO en esta tarea.** | La matriz A-01 del plan define «residual» respecto de `selling_plan` («Cero valores serializados de `selling_plan`, sin plan residual»). `purchase-option-*` / `featured-purchase-option-*` es un control de interfaz que ya se envía hoy. El informe lo declara abierto y R-A comprueba con el payload real que Shopify lo ignora (C-8). |
| **PD-3** | **SÍ.** | §3 (B-02) demuestra que la selección sin JS falla en el componente de la fila 69. Un `cumplido` no convive con un P1 condicionado confirmado (RULES §3.8). |
| **PD-4** | **La lectura es correcta.** D19 (c) bloquea el CIERRE de A-01, no su código. | (1) D15 trata exactamente este caso y es una orden expresa: «si no existe cuando llegues a A-01, sigue con lo que no dependa de él y déjalo marcado». (2) D19 (c) está en el registro de cierre del Lote 0 y no dice que reemplace a D15. (3) El plan dice lo mismo: 0-03 «bloquea **cierre** A-01» y «aunque se pueda hacer prueba sintética etiquetada». (4) El código de A-01 no depende del fixture y está unido a B-02 (mismo formulario, mismo hook). El informe y `CLAUDE-CLOUD-STATUS.md` deben registrar «A-01: código completo; cierre en espera de C-R0-4 (Johandry)». |
| **PD-5** | **SÍ.** Opciones agotadas `disabled`, salvo la seleccionada. | Coherente con los radios (`main-product:247`). T1 confirma que sin JS no se puede enviar la combinación agotada. |
| **PD-6** | **Reutilizar `products.product.choose_options`.** | Existe en los dos locales y es comprensible. Una clave nueva sacaría `locales/*.json` de la lista. |
| **K-1** | **No requiere a Johandry.** | Resuelto por PD-4 dentro de D15 y del plan. |
| **K-5** | **No requiere a Johandry.** | Resuelto por PD-1: parte del criterio «fallido» del plan. |

K-2, K-3, K-4 y K-6: conformes con la directiva (no requieren a Johandry).

# 5. Lista cerrada, nivel, ledger y C-08 (punto 4 del encargo)

## 5.1 Lista cerrada final

1. `sections/main-product.liquid`
2. `sections/featured-product.liquid`
3. `assets/theme.js`
4. `layout/theme.liquid` (S-5, PD-1)
5. `agent-comms/outbox-claude/harness-A-01-B-02-001/` (nuevo)
6. `agent-comms/outbox-claude/CLAUDE-REPORT-A-01-B-02-001.md` (nuevo)

Fuera de la lista: CSS, locales, schemas, snippets, `layout/password.liquid` (no tiene formularios de producto) y el ledger.

## 5.2 Nivel

Nivel 1. Los nombres enviados (`id`, `selling_plan`, `quantity`) y todos los hooks existentes se conservan. Con C-2, `name` se retira solo en tiempo de ejecución y solo de los controles sin JS. Se añade un hook nuevo, `data-no-js-control`, emitido y leído dentro del mismo componente.

## 5.3 Ledger

- Verificado: `docs/requirements-ledger.md:69` es «Selector de Variantes y Swatches Nativos» y `:71` es «Planes de Venta / Suscripciones». Las dos están en `cumplido`. La cabecera dice `60 filas | 54 cumplido | 6 código completo`.
- Se acepta proponer las dos filas a `código completo` tras la implementación, con la evidencia de §6 de la directiva. La cabecera pasaría a 52 / 8, recalculada con `ledger-verify.mjs` por quien actualice. La R-D no mueve filas.
- Vuelta a `cumplido`:
  - fila 69: R-A/R-B en tienda con credenciales (D22) y el catálogo multivariante existente, sin fixture;
  - fila 71: R-A con el fixture C-R0-4 y credenciales (C-6).
- La evidencia de la fila 71 cita localizadores obsoletos (`main-product.liquid:129-166`, `theme.js:733-742`). Se corrige al actualizar la fila.

## 5.4 Coordinación con C-08

- `agent-comms/outbox-claude/CLAUDE-DIRECTIVA-C-08-001.md` no existía al empezar esta revisión. Apareció sin commit durante ella (1266 líneas, «Borrador para R-D») y se leyó.
- Su Anexo A hace exactamente 4 sustituciones `R(MP, ...)` y 2 `R(FP, ...)`, todas en los bloques `shipping_lead_time` y `trust_badges`:
  - T-01 a T-04: `main-product.liquid:659-689` y `featured-product.liquid:410-444`.
  - Su verificación cuenta `delivery_text != blank` y `returns_text != blank` (1 por archivo).
- No toca el `{%- liquid` inicial, el picker, el formulario `buy_buttons`, el JSON ni las claves `choose_options`/`sold_out`. No hay solape de hunks.
- Su §1.1 (línea 97) ya declara que «A-01/B-02 editan otras regiones», y A-01/B-02 no introduce esas cadenas.
- Orden: indiferente entre C-08 y A-01/B-02, siempre en turnos secuenciales y con commit entre turnos.
- A-02 y A-03 tienen ahora cambios sin commit en el árbol (§1). El turno A-01/B-02 empieza después de que el coordinador los confirme o los aparte (C-4).

# 6. Criterios y pruebas (punto 5 del encargo)

- H-1 a H-17 son verificables: cada uno fija valores de `getAll`/payload o un estado DOM concreto.
- La separación entre sintético (§5.1), estático (§5.2) y tienda (§5.4) es correcta, y §5.4 no declara nada cumplido por el harness.
- Faltan los casos de C-1 y C-2 y la variante «lenta» de S-5 (C-5). §5.2 sobrestima la cobertura de `dataset-hooks.mjs` (C-3). La comprobación de diff de §5.2 deja de ser válida en cuanto otro turno haga commit en `lote-a` (C-4).
- §5.4 mezcla dependencias: los puntos de B-02 no necesitan el fixture (C-6).

# 7. Cambios obligatorios

- **C-1 (S-1 y S-2, más de 250 variantes).** En el select nativo, el `<option>` de `selected_variant` debe existir siempre y llevar `selected`.
  - Patrón: al recorrer `product.variants` (`featured_product.variants`), marca un flag cuando `variant.id == selected_variant.id`.
  - Si tras el bucle el flag sigue en `false`, emite una opción adicional para `selected_variant` (`selected`, mismo formato de texto).
  - Añadir el caso H-13b: p9 con más de 250 variantes y `?variant=` de una variante fuera de las 250. Sin JS y sin tocar nada, el POST envía `id` igual a la variante pintada.
  - Corregir §4.3.5: sin JS solo son alcanzables las 250 primeras más la seleccionada.
- **C-2 (S-4a).** `takeOverNativeControls()` hace, para cada `[data-no-js-control]` de `this`, `disabled = true` y `removeAttribute('name')`. Retirar el nodo también vale, pero quitar `name` es lo mínimo.
  - Reformular H-16: tras conectar, `form.elements.namedItem('id')` y `form.elements.namedItem('selling_plan')` son un único `HTMLInputElement` (el hidden) y `form.querySelector('[name="id"]') === hidden`.
  - Actualizar §4.1, R-4 y la condición del preflight §1.2: con C-2, con JS ya no quedan dos `name="id"` en el DOM.
  - Sin JS no cambia nada.
- **C-3 (§4.4 y §5.2).** `scripts/dataset-hooks.mjs` solo cruza lecturas `this.dataset.*` (líneas de `matchAll`). No ve selectores de `querySelector` ni cubre `data-no-js-control`. Quitar «data-no-js-control emitido por ambas secciones» del comentario de §5.2 y decir que esa cobertura la dan las dos líneas `rg -c` (RULES §3.1, «no sobredimensiones su cobertura»).
- **C-4 (§0, §1.2 y §5.2, identidad del turno).**
  - Condición de entrada nueva: `git status --short -- . ':!agent-comms'` vacío al empezar. Si hay cambios de otros turnos, detente.
  - Registrar `HEAD_INICIO = git rev-parse HEAD`.
  - En §5.2, sustituir `git diff --stat eb7cca7 -- . ':!agent-comms'` por `git diff --stat $HEAD_INICIO -- . ':!agent-comms'`. Así la comprobación no atribuye a esta tarea los commits previos de A-02, A-03 o C-08 en `lote-a`.
  - Mantener el `merge-base --is-ancestor eb7cca7` y el `diff --stat eb7cca7` de los cuatro archivos solo como control de solape.
- **C-5 (S-5, PD-1 aprobado).** S-5 se ejecuta y H-8 es obligatorio.
  - Código: un único listener `DOMContentLoaded`, añadido después de las dos líneas actuales de la clase en `layout/theme.liquid:98-99`, sin modificarlas. Si `!window.customElements || !customElements.get('variant-selects')`, sustituye `js` por `no-js`.
  - Añadir H-18: `theme.js` servido con retraso de 1 s o más → `html.js` se conserva y los controles quedan tomados. `theme.js` con error de sintaxis → `html.no-js` y POST `id=[B]`.
  - Informar en R-8 de que el cambio es global solo cuando falla `theme.js`.
- **C-6 (§5.4 y §6).** Separar dependencias:
  - Puntos 5.4.3 (B-02 en tienda), 5.4.5 en su parte `?variant=` y 5.4.6 (móvil) para B-02: «pendiente de credenciales (D22)», con el catálogo multivariante existente y sin fixture.
  - Puntos 5.4.1, 5.4.2 y la parte de plan de 5.4.4 y 5.4.5: «pendiente de fixture (C-R0-4) y credenciales (D22)».
  - En §6: la fila 69 puede volver a `cumplido` sin fixture; la 71, no.
  - Añadir a R-A la recarga en Firefox con JS (persistencia de `disabled` en el formulario) como comprobación de tienda; no está verificado.
- **C-7 (§5.1, harness entregable).** Corregir las divergencias de §2.2 de esta R-D:
  - `featured-purchase-option-<id>` en el producto destacado, también en la fila «Sin JS: residuos» de §2.2 de la directiva;
  - `<pickup-availability data-variant-id>` dentro de `variant-selects`;
  - p8 con dos opciones reales;
  - separadores ` / `.
- **C-8 (§8, informe).** Registrar:
  - PD-1 a PD-6 con cita a esta R-D;
  - la lectura PD-4 («A-01: código completo; cierre en espera de C-R0-4 (Johandry)»);
  - el residuo PD-2 como abierto para R-A con el payload real.

Recomendaciones opcionales (no bloquean):

- **O-1.** En el select nativo, desactivar también, salvo la seleccionada, las variantes con `requires_selling_plan` y sin asignaciones. Coincide con el fallo cerrado 5A-003 (`main-product:13-24`). Sin JS evita un POST que Shopify responde sin crear la línea.
- **O-2.** Informar del orden de foco sin JS (cantidad → variante → plan → botón) como límite conocido.

# 8. Veredicto

**APROBADA CON CAMBIOS: C-1 a C-8 (§7).** Tras aplicarlos, el coordinador emite la directiva sin nueva R-D, ya que no cambian la lista de archivos ni el nivel.

NINGUNA DECISIÓN REQUIERE A JOHANDRY. PD-1 está dentro del plan y PD-4 dentro de D15 y del plan.

Bloqueo del siguiente paso: el implementador no empieza hasta que se cumplan C-4 (árbol limpio fuera de `agent-comms`) y las condiciones §0.2 a §0.4 de la directiva. El cierre de A-01 sigue bloqueado por C-R0-4 y D22. El de B-02, solo por D22.

# 9. Afirmaciones falsables

1. En `lote-a` @ `eb7cca7`, los cuatro archivos de la lista tienen los prefijos SHA-256 `024ba08f31f4d20c`, `56741a8a3bcda4b9`, `f4319ed320209db4` y `100ea68672dc99d0`.
2. `rg -n "SellingPlanNoJs|selling-plans__no-js|no-js-only" assets/` solo devuelve líneas de `assets/base.css`: 5294, 5346, 5354 y 5653.
3. El harness del redactor, repetido, produce salidas iguales tras `sort` a `salida-eb7cca7.txt` y `salida-prototipo.txt`.
4. Con el Liquid propuesto y S-4 literal, `form.elements.namedItem('id')` es `RadioNodeList` con `value === ""` tras elegir M y suscripción. Con `removeAttribute('name')` es `HTMLInputElement` con `value === "102"`. Lo mismo ocurre con `selling_plan` (valor `"1"`).
5. Con 300 variantes, `?variant=9260` y sin JS, el POST envía `id=9000` con el Liquid S-1 literal y `id=9260` con C-1.
6. Con `theme.js` servido a los 1500 ms y S-5, `<html>` termina con la clase `js` y los dos `[data-no-js-control]` están desactivados. Con 404 o con error de sintaxis termina en `no-js` y el POST envía la variante elegida en el select.
7. `scripts/dataset-hooks.mjs` solo extrae lecturas con la expresión `this\.dataset\.([A-Za-z][A-Za-z0-9]*)`: no detecta `data-no-js-control`.
8. El Anexo A de `CLAUDE-DIRECTIVA-C-08-001.md` (sin commit, aparecido durante esta revisión) solo sustituye, en las dos secciones, texto de los bloques `shipping_lead_time` y `trust_badges`: 4 llamadas `R(MP` y 2 `R(FP`.
9. En `templates/product.json` y en los `product.json`/`index.json` de los tres listings, `variant_picker` precede a `buy_buttons`, y los dos schemas limitan `variant_picker` y `buy_buttons` a 1.
10. Compuerta del literal sobre este archivo: 0 (§10).

# 10. Compuerta del literal

Script: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rd-a01/count-review.py`. Es una copia del contador de `rd-a03`: deriva el literal solo en memoria e imprime únicamente `ruta=N`.

`python3 -I .../rd-a01/count-review.py agent-comms/outbox-claude/CLAUDE-REVIEW-A-01-B-02-RD-001.md` → `agent-comms/outbox-claude/CLAUDE-REVIEW-A-01-B-02-RD-001.md=0` (versión anterior a esta línea). La cifra final se repite tras la última edición y consta en el informe de vuelta.
