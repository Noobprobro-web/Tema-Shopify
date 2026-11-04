ID: CLAUDE-DIRECTIVA-A-01-B-02-001
Fecha: 2026-11-04
Autor: Claude (Opus), redactor de directivas. No implementa.
Destinatario: implementador Sonnet sin contexto previo (ejecuta). También el revisor Opus de contexto limpio (R-D de esta directiva y revisión de la tarea, D11) y el coordinador Claude (rama, commit y push, D12/D16).
Estado: Borrador para R-D. No autoriza editar el tema hasta que exista el dictamen R-D favorable descrito en §0.
Decisión requerida: R-D independiente de esta directiva por el revisor Opus de contexto limpio (D11 de `CLAUDE-DECISION-AUTONOMIA-001.md`). El R-D debe además decidir PD-1 a PD-6 de §9.1. Solo PD-4, y PD-1 si el revisor lo considera fuera del plan, podrían exigir consulta a Johandry (§9.2, D10).
Resumen en 5 líneas:
1. A-01 y B-02 tienen la misma causa: los formularios de compra de la ficha de producto (PDP) y del producto destacado dependen de JavaScript para `id`, y siempre envían el control sin JS de `selling_plan`, aunque esté oculto.
2. Diagnóstico estático confirmado con un harness Playwright local sobre `assets/theme.js` real: con JS hay 2 valores `selling_plan` en las suscripciones y el caso C envía el plan de la URL tras elegir compra única. Sin JS, o con `theme.js` caído, se muestra la variante B y se envía la A.
3. Solución: un único control exitoso por nombre (`id`, `selling_plan`) en cada modo. Selects nativos sin JS marcados con `data-no-js-control`, que `VariantSelects` desactiva al tomar el control. El hidden `id` nace desactivado si existe el select y el componente lo activa. Selector visual de variantes con `js-only`.
4. Lista cerrada: `sections/main-product.liquid`, `sections/featured-product.liquid`, `assets/theme.js` y, solo si el R-D aprueba PD-1, `layout/theme.liquid` (vuelta a `no-js` si `theme.js` no llegó a definir `variant-selects`). Sin schemas, settings, defaults, CSS ni locales nuevos. Nivel 1.
5. Máximo alcanzable sin tienda ni fixture: «código completo» (D22). La verificación en tienda queda pendiente del fixture de suscripción (C-R0-4, Johandry) y de credenciales. Se propone, sin aplicarlo, bajar las filas 69 y 71 del ledger de `cumplido` a `código completo`.
Archivos tocados (por esta entrega de redacción): solo este archivo nuevo, `agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-01-B-02-001.md`. Fuera del repositorio, en el scratch de esta sesión `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/a01/`: `harness.mjs`, `check-fallback.mjs`, `salida-eb7cca7.txt` y `salida-prototipo.txt`. Sin git de escritura, sin red, sin tiendas, sin `.secrets`.
Desviaciones (Nivel 1 o Nivel 2): Ninguna en esta redacción. La implementación propuesta es Nivel 1 (§4.4). `layout/theme.liquid` no figura entre las superficies candidatas del plan para B-02, así que su inclusión queda a decisión explícita del R-D (PD-1).
Hallazgos extra fuera de alcance (con parche listo): Sin parche. Están en §7.2: el producto destacado no tiene total de línea, faltan `price_cents` en sus asignaciones de plan y los localizadores de la fila 71 del ledger están obsoletos.
Verificación (comando, resultado y qué demuestra/qué no): Ver §1.3 y §2.1. Las líneas se comprobaron hoy sobre `lote0/base-09f8342` en `eb7cca7`. Las compuertas estáticas base están en verde. El harness sintético reproduce los fallos con `theme.js` real, y un prototipo en memoria los corrige. Esto demuestra el mecanismo en el navegador. No demuestra cómo interpreta Shopify el payload, ni nada de tiendas.
Lista de afirmaciones falsables numeradas:
1. En `eb7cca7`, ni `assets/theme.js` ni otro archivo del tema desactiva el `<select name="selling_plan">` sin JS (`sections/main-product.liquid:577`, `sections/featured-product.liquid:325`). `.js .no-js-only` solo lo oculta con `display: none` (`assets/base.css:5653-5655`), así que sigue siendo control exitoso de `new FormData(form)`, que es lo que envía `CartDrawer.addItem` (`assets/theme.js:2558`).
2. En `eb7cca7`, los radios de variante (`sections/main-product.liquid:238-248`, `sections/featured-product.liquid:136-146`) están fuera del `<form>` y no tienen atributo `form`. El único `name="id"` del formulario es el hidden `:477` / `:226`, que solo cambia por JS (`assets/theme.js:835-841`).
3. El harness de §2.1 da, con `theme.js` de `eb7cca7`, `selling_plan = ["1",""]` al suscribir con JS y `["1"]` en el caso C tras elegir compra única. Da `id = ["101"]` tras elegir la variante 102 sin JS y con `theme.js` en 404. Esto ocurre en las dos superficies.
4. Con el prototipo de §4 aplicado en memoria, el mismo harness da 0 valores `selling_plan` en compra única, exactamente 1 en cada plan elegido e `id = ["102"]` sin JS y con `theme.js` en 404, en ambas superficies.
5. En `eb7cca7`: `node --check assets/theme.js` OK; Theme Check «92 files inspected with no offenses found»; `theme-check-sanity` OK; `locale-key-inventory` «todas las referencias estaticas resuelven»; `dataset-hooks` y `json-validate` sin fallos.
6. Las claves `products.product.choose_options` y `products.product.sold_out` existen hoy en `locales/en.default.json` y `locales/es.json`, así que la solución no necesita claves nuevas.

---

# 0. Condiciones de entrada (bloqueantes)

El implementador NO empieza a editar si falta cualquiera de estas condiciones. Si falta alguna, se detiene y lo informa al coordinador sin tocar archivos.

1. Existe un dictamen R-D del revisor Opus de contexto limpio sobre esta directiva (ID sugerido `CLAUDE-REVIEW-A-01-B-02-RD-001`) con resultado «apta para emitir» o «apta con condiciones». El dictamen decide PD-1 a PD-6 (§9.1). Si no se pronuncia sobre PD-1, `layout/theme.liquid` queda FUERA de la lista y S-5 no se ejecuta.
2. La rama `lote-a` existe y está activa, preparada por el coordinador. Si no existe, el implementador no la crea: se detiene.
3. El preflight de §1.2 pasa completo.
4. Ningún otro agente escribe en el repositorio durante el turno (escritor único, plan V4.1 §2). Las directivas paralelas A-02, A-03 y C-08 escriben en turnos distintos (§7.1 R-9).
5. No se necesita el fixture de suscripción para empezar (D15, PD-4). Su ausencia solo limita el cierre (§5.3 y §6).

# 1. Base y preflight

## 1.1 Base

- Rama de trabajo: `lote-a`, creada por el coordinador desde la cabeza de `lote0/base-09f8342` (D12, D22). Cabeza de referencia de esta redacción: `eb7cca797f9de142089c6c14daaa5ed449597f9f` («Lote 0: BOARD reconciliado (B3), decisiones D19-D24 y estado vivo»).
- `lote-a` puede traer antes commits de A-02, A-03 o C-08. A-02 no toca los archivos de esta directiva. A-03 toca `assets/base.css`, que aquí no se edita. C-08 puede tocar los bloques `trust_badges` y `shipping_lead_time` de las dos secciones (`main-product.liquid:659-689`, `featured-product.liquid:410-444`). Si eso ocurrió, los números de línea de esta directiva se desplazan: localiza siempre por el ancla textual (función, selector o atributo) que acompaña a cada número, nunca solo por la línea.

## 1.2 Preflight obligatorio (antes de editar)

Ejecuta y pega la salida literal en el informe (§8):

```
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor eb7cca797f9de142089c6c14daaa5ed449597f9f HEAD && echo "desciende de eb7cca7"
git diff --stat eb7cca7 -- sections/main-product.liquid sections/featured-product.liquid assets/theme.js layout/theme.liquid
node --check assets/theme.js
rg -n 'name="selling_plan"|data-selling-plan-input|data-variant-id|name="id"|data-no-js-control' sections/main-product.liquid sections/featured-product.liquid
rg -n "data-no-js-control|takeOverNativeControls|elements\.namedItem\('id'\)|elements\.id\b|\[name=\"id\"\]" assets/
```

Condiciones de paso:

- La rama es `lote-a`, desciende de `eb7cca7` y no hay cambios sin commit en los cuatro archivos de la lista.
- `rg` encuentra, en cada sección, exactamente un `name="id"` (el hidden con `data-variant-id`), un hidden `data-selling-plan-input` y un `<select ... name="selling_plan">` sin JS.
- `data-no-js-control` y `takeOverNativeControls` no existen todavía. Ningún JS lee `elements.namedItem('id')`, `elements.id` ni `[name="id"]`; si apareciera alguno, detente y repórtalo, porque la solución deja dos elementos `name="id"` en el DOM (uno desactivado).
- Si `git diff --stat` muestra cambios de C-08 en las secciones, comprueba que no tocan las zonas de §4. Si las tocan, detente y repórtalo.

## 1.3 Estado base medido hoy (eb7cca7, referencia)

| Comando | Resultado literal (extracto) |
| --- | --- |
| `node --check assets/theme.js` | sin salida, exit 0 |
| `npx --no-install shopify theme check --fail-level error` | `92 files inspected with no offenses found.` |
| `node scripts/theme-check-sanity.mjs` | `[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.` |
| `node scripts/locale-key-inventory.mjs` | `OK: todas las referencias estaticas resuelven contra los locales.` |
| `node scripts/dataset-hooks.mjs`, `node scripts/json-validate.mjs` | exit 0, sin contratos rotos |
| `sha256sum` (prefijo) | `theme.js 024ba08f31f4d20c`, `main-product.liquid 56741a8a3bcda4b9`, `featured-product.liquid f4319ed320209db4`, `layout/theme.liquid 100ea68672dc99d0` |

# 2. A-01: matriz de suscripciones, diagnóstico

## 2.1 Método

1. Análisis estático de `sections/main-product.liquid`, `sections/featured-product.liquid`, `assets/theme.js`, `assets/base.css` y `layout/theme.liquid` en `eb7cca7`.
2. Harness sintético (Playwright 1.63 local, Chromium de `/opt/pw-browsers`), en `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/a01/harness.mjs`:
   - Un servidor Node local sirve el `assets/theme.js` REAL del repositorio y páginas HTML generadas a mano que traducen la lógica Liquid de ambas secciones. La traducción cubre `main-product.liquid:1-24`, el picker `:215-268`, el formulario `:470-635` y el JSON `:722-779`, más sus equivalentes en `featured-product.liquid`.
   - `<html class="no-js">` lleva el mismo script en línea que `layout/theme.liquid:97-99` y la regla `.js .no-js-only, .no-js .js-only { display:none !important }`.
   - Catálogo sintético:
     - p1, plan opcional: S y M con planes 1 y 2; L solo con el plan 3; XL agotada.
     - p2, `requires_selling_plan`: S con planes 1 y 2; M sin asignaciones.
   - Con JS, se lee `new FormData(form).getAll('id' | 'selling_plan')` tras cada transición.
   - Sin JS (`javaScriptEnabled: false`) y con JS fallido (`theme.js` servido con 404), se captura el cuerpo real del POST nativo a `/cart/add` con `page.route`.
   - Ejecución: `node harness.mjs /home/user/Tema-Shopify` (base) y `FIX=1 node harness.mjs ...` (prototipo de §4 parcheado en memoria; el repo no se toca).
3. Límite: es una prueba sintética. El HTML lo genera a mano el harness, no Shopify, y no prueba cómo interpreta Shopify los parámetros duplicados o vacíos.

## 2.2 Resultado por caso (base `eb7cca7`; idéntico en PDP y producto destacado)

| Caso de la matriz del plan (§4.1 A-01) | Exigido | Hoy (`getAll('selling_plan')` / payload) | Veredicto | Causa con evidencia |
| --- | --- | --- | --- | --- |
| 1. Compra única válida en producto con planes | 0 valores | `[""]` | FALLA (1 valor vacío) | El select sin JS `name="selling_plan"` (`main-product.liquid:577`, `featured-product.liquid:325`) tiene seleccionada la opción `value=""` (`:578-582` / `:326-330`). Nadie lo desactiva: `grep` sobre `assets/` no encuentra ningún acceso a él. `.js .no-js-only` solo aplica `display:none` (`assets/base.css:5653-5655`). `FormData` incluye los controles ocultos con CSS (`assets/theme.js:2558`). |
| 2a. Suscribir (plan 1 por defecto) | 1 valor válido | `["1",""]` | FALLA | El hidden `data-selling-plan-input` (`main-product.liquid:565-571`) lo activa `updatePurchaseOptions` (`assets/theme.js:768-779`), y el select sin JS añade `""` detrás en orden del DOM. Si Shopify toma el último valor (no verificado), la suscripción entra como compra única. |
| 2b. Plan 1 → plan 2 | 1 valor (2) | `["2",""]` | FALLA | La misma causa. |
| 2c. Plan 2 → compra única | 0 valores | `[""]` | FALLA | El hidden queda desactivado (`theme.js:772`), pero el select sin JS sigue enviando `""`. |
| 3. Plan 2 y cambio a variante L (solo plan 3) | 1 valor de L, nunca uno obsoleto | `["3",""]` | FALLA por el duplicado | La lógica JS es correcta: elige la primera asignación de L (`theme.js:736-739`). El select sin JS conserva las opciones y la selección de la variante inicial (`main-product.liquid:585-596`, que itera `selected_variant.selling_plan_allocations` del render). Con una variante inicial suscrita, ese valor sería un plan obsoleto de otra variante (ver R1/R2). |
| C1. Carga con `?selling_plan=1` | 1 valor | `["1","1"]` | FALLA (duplicado) | Liquid preselecciona el plan en ambos controles (`main-product.liquid:3-11`, `:545`, `:568`, `:589`). |
| C2. Caso C: URL con plan 1 y después compra única | 0 valores | `["1"]` | FALLA (caso C confirmado) | El hidden se desactiva, pero el select sin JS mantiene `selected` el plan de la URL y lo envía. «No basta ocultar el control no-JS si sigue siendo exitoso» (plan §4.1). |
| R1. `requires_selling_plan`, carga | 1 valor | `["1","1"]` | FALLA (duplicado) | La misma causa; el select sin JS no tiene opción de compra única (`:578`). |
| R2. `requires_selling_plan`, elige plan 2 | 1 valor (2) | `["2","1"]` | FALLA (valores contradictorios) | El select sin JS conserva el plan 1. |
| R3. `requires_selling_plan` sin asignaciones (variante M) | Envío bloqueado con mensaje | botón `disabled`, aviso visible; `selling_plan=["1"]` residual | Bloqueo OK; payload residual | El bloqueo es correcto (`theme.js:811-819`, `:843-874`; Liquid `main-product.liquid:19-24`, `:608-635`). El valor residual no llega a enviarse porque el botón está desactivado, pero incumple «sin valores residuales». |
| Sin JS: compra única tras URL con plan | Formulario nativo fiel, sin duplicados | `selling_plan=[""]`, sin duplicado | OK con límite | El hidden nace `disabled` (`:570`), así que sin JS solo envía el select. Límite: la compra única viaja como `selling_plan=` vacío. Con un `<select>` nativo es inevitable; que Shopify lo trate como «sin plan» no está verificado. |
| Sin JS: residuos | Sin controles duplicados exitosos | `purchase-option-<sección>=one_time` en el POST | Observación (PD-2) | Los radios JS (`main-product.liquid:489-511`) están dentro del `<form>` con `name`. Quedan ocultos por `.no-js .js-only`, pero se envían. No es `selling_plan`; es un residuo inocuo salvo prueba en contrario. |
| JS fallido (`theme.js` 404) y caso C | Lo visible = lo enviado | Se ve el fieldset JS (la clase `js` la pone el script en línea, `layout/theme.liquid:97-99`) y se marca compra única, pero se envía `selling_plan=["1"]` | FALLA | Con la clase `js`, el control sin JS está oculto pero sigue siendo exitoso, y los radios JS no hacen nada. |

Conclusión A-01: RC-02/TT-100 queda confirmado en el navegador para ambas superficies, en sus variantes de duplicado, valor contradictorio y caso C. La lógica de `VariantSelects` para elegir y validar el plan es correcta. El fallo está en que el formulario conserva siempre un segundo control `selling_plan` exitoso. Este mecanismo ya estaba descrito en GPT-AUDIT-THREE-THEMES-MASTER-001:239 (RC-02) y en CLAUDE-AUDIT-THREE-THEMES-MASTER-001:168 (TT-100): no es un hallazgo nuevo según D10.

Producto destacado: `variant-selects` no tiene `data-product-url` (`featured-product.liquid:71-81`), así que `updateUrl` no hace nada (`theme.js:1066`). Que `featured_product.selected_selling_plan_allocation` y `selected_or_first_available_variant` reaccionen a `?selling_plan=` o `?variant=` fuera de la plantilla de producto no está verificado. El harness simula la preselección en el HTML, que es lo que importa para el formulario.

# 3. B-02: variantes sin JS, diagnóstico

| Caso (plan §4.1 B-02) | Hoy (payload `id` del POST nativo) | Veredicto | Causa con evidencia |
| --- | --- | --- | --- |
| Sin JS: cargar A (101), elegir B (102) | `id=["101"]` con B marcada en pantalla | FALLA en PDP y destacado | Los radios `name="options[...]"` (`main-product.liquid:238-248`) y `name="featured-options-<id>[...]"` (`featured-product.liquid:136-146`) están fuera del `<form>` y sin atributo `form`. El único `id` es el hidden `:477` / `:226`, con el valor que pintó el servidor. Solo `VariantSelects.updateForms` lo cambia (`theme.js:835-841`). No hay `<noscript>` ni select nativo de variantes en ninguna de las dos secciones (`rg -n "noscript" sections/main-product.liquid sections/featured-product.liquid` sin resultados). |
| JS fallido (`theme.js` 404): cargar A, elegir B | `id=["101"]` | FALLA | El script en línea pone la clase `js` antes de que cargue `theme.js` (`layout/theme.liquid:95` `defer`, `:97-99`). Los radios quedan visibles e inertes. |
| URL de variante `?variant=B` (PDP) | `id=B` | OK (estático) | `product.selected_or_first_available_variant` (`main-product.liquid:2`) pinta B en el hidden (`:477`) y en `value.selected` de los radios (`:245`). Con JS, `updateUrl` conserva `?variant=` (`theme.js:1065-1076`). En el producto destacado no aplica a la URL de la página (§2.2, no verificado). |
| Disponible → agotada sin JS | En producto de una opción, el radio agotado nace `disabled` (`:247`). En producto multiopción, un valor disponible en combinación agotada sigue habilitado: se ve B agotada y se envía A disponible | FALLA (multiopción) | `value.available` no evalúa la combinación completa, y sin JS el botón conserva el estado de A (`:608-614`). |
| Agotada → disponible sin JS (entrada por `?variant=` agotada) | Botón `disabled` desde el servidor (`:613`); elegir otra variante no lo reactiva | Límite | Sin JS el estado del botón no puede cambiar. Se documenta como límite real (§4.3). |

Conclusión B-02: RC-01/TT-101/S-01 queda confirmado en el navegador para PDP y producto destacado. El mecanismo ya estaba descrito en GPT-AUDIT-THREE-THEMES-MASTER-001:238 y CLAUDE-AUDIT-THREE-THEMES-MASTER-001:167,212 («sin JS o theme.js caído»): no es un hallazgo nuevo.

# 4. Solución

## 4.1 Principio

En cada formulario y en cada modo hay exactamente un control exitoso por nombre:

| Modo | `id` | `selling_plan` | Controles visibles |
| --- | --- | --- | --- |
| Con JS (`VariantSelects` conectado) | hidden `data-variant-id` (activado por JS) | hidden `data-selling-plan-input` (activo solo con suscripción; lógica actual) | radios de variante y fieldset de compra (como hoy) |
| Sin JS / JS fallido con S-5 | `<select name="id" data-no-js-control>` | `<select name="selling_plan" data-no-js-control>` (actual) | los dos selects nativos; radios de variante y fieldset JS ocultos |

`VariantSelects` «toma el control» al conectarse: activa el hidden `id` y desactiva todo `[data-no-js-control]` de su subárbol. Sin JS, nada cambia el estado servidor. El código es original: no copies de SebastianDev017/atelier (D17) ni de otros temas.

## 4.2 Cambios (lista cerrada; líneas aproximadas en `eb7cca7`)

**S-1. `sections/main-product.liquid`, B-02**

- a) En el bloque `{%- liquid` inicial (`:1-54`), junto a `assign product_form_id` (`:25`), calcula `render_variant_no_js`:
  - `true` solo si `product.has_only_default_variant == false` y `section.blocks | where: 'type', 'variant_picker'` tiene tamaño mayor que 0.
  - Si el comerciante quitó el bloque `variant_picker`, se conserva el comportamiento actual.
- b) En `{%- when 'variant_picker' -%}` (`:215-217`), añade la clase `js-only` al `<div class="variant-picker flow" ...>`. Conserva `{{ block.shopify_attributes }}` y no toques los radios.
- c) En `{%- when 'buy_buttons' -%}`, dentro del `{%- form ... -%}` (`:472-477`):
  - El hidden `<input type="hidden" name="id" value="{{ selected_variant.id }}" data-variant-id>` (`:477`) recibe `{% if render_variant_no_js %}disabled{% endif %}`. Sigue siendo el PRIMER `name="id"` del formulario en orden del DOM (R-4).
  - Justo después del hidden, si `render_variant_no_js`, añade:
    - Un `<div class="form-field no-js-only">` con `<label for="ProductVariantNoJs-{{ section.id }}">{{ 'products.product.choose_options' | t }}</label>`.
    - Dentro, `<select id="ProductVariantNoJs-{{ section.id }}" name="id" autocomplete="off" data-no-js-control>` con un `<option>` por cada `product.variants`:
      - `value="{{ variant.id }}"`.
      - `selected` si `variant.id == selected_variant.id`.
      - `disabled` si `variant.available == false` y no es la seleccionada.
      - Texto: `{{ variant.title | escape }}`, `' / '`, `{{ variant.price | money | strip_html }}` y, si no está disponible, `' / '` más `{{ 'products.product.sold_out' | t }}`.
  - No hace falta CSS: `select` y `label` ya tienen estilo global (`assets/base.css:162-168`, `:930-947`) y `.form-field` existe (`:5684`).

**S-2. `sections/featured-product.liquid`, B-02**

Los mismos cambios que S-1, con estos equivalentes:

- `render_variant_no_js` en el `{%- liquid` inicial (`:1-28`): exige `featured_product != blank`, `featured_product.has_only_default_variant == false` y un bloque `variant_picker`.
- `js-only` en `<div class="variant-picker flow" ...>` (`:115`).
- Hidden `:226` con `disabled` condicional.
- Select `id="FeaturedProductVariantNoJs-{{ section.id }}"` con un `<option>` por cada `featured_product.variants`.

**S-3. Ambas secciones, A-01 (Liquid)**

- Añade `autocomplete="off" data-no-js-control` al `<select ... name="selling_plan">` sin JS (`main-product.liquid:577`, `featured-product.liquid:325`).
- No cambies sus opciones, su `id`, su `name` ni el hidden `data-selling-plan-input` (`:565-571` / `:313-319`), que ya nace `disabled`.

**S-4. `assets/theme.js`, clase `VariantSelects` (A-01 y B-02)**

- a) Método nuevo `takeOverNativeControls()`, junto a `cachePurchaseOptionElements()` (`:628-640`), con un comentario breve que cite A-01/B-02. Hace dos cosas, ambas limitadas a `this`:
  - pone `disabled = false` en cada `input[data-variant-id]`;
  - pone `disabled = true` en cada `[data-no-js-control]`.
  - El selector `input[...]` evita el elemento `<pickup-availability data-variant-id>` (`snippets/pickup-availability.liquid:20`), que también está dentro de `variant-selects`.
- b) En `connectedCallback()` (`:567-609`), llama a `this.takeOverNativeControls()` justo después de `if (this.variantData.length === 0) return;` (`:571`) y antes de cualquier otra inicialización.
- c) No cambies `updatePurchaseOptions`, `updateForms`, `isPurchaseOptionValid`, `updateUrl`, `CartDrawer` ni `StickyCartBar`. El harness muestra que su lógica es correcta una vez eliminado el control duplicado.
- d) Ningún formateo de moneda nuevo, ni `Intl` (RULES §2.3).

**S-5. `layout/theme.liquid` (SOLO si el R-D aprueba PD-1), JS fallido**

- En el script en línea (`:97-99`), tras añadir la clase `js`, registra un listener `DOMContentLoaded`. Si `window.customElements` no existe o `customElements.get('variant-selects')` es `undefined`, sustituye `js` por `no-js` en `document.documentElement`.
- Fundamento:
  - `theme.js` se carga con `defer` (`:95`) y los scripts diferidos se ejecutan antes de `DOMContentLoaded`.
  - `theme.js` es una IIFE que define `variant-selects` (`assets/theme.js:5313-5315`). Si falla la carga o el análisis, o hay una excepción antes de esa línea, el elemento no queda definido.
  - En el caso normal no hay cambio visual ni CLS.
  - En el caso fallido se aplican las reglas `.no-js` ya existentes en todo el tema, que es la degradación prevista.
- Si el R-D no aprueba PD-1, no se ejecuta S-5 y el informe declara el límite de §4.3 punto 1.

## 4.3 Límites reales que se documentan (no se resuelven)

1. JS fallido parcial: si `theme.js` define `variant-selects` pero `connectedCallback` lanza una excepción antes de `takeOverNativeControls`, la página queda en modo `js` con los selects nativos ocultos y exitosos. Esto no ocurre con el JSON roto (`:571` retorna antes). Sin S-5 se suma también el caso de `theme.js` caído.
2. Sin JS, la compra única viaja como `selling_plan=` (un valor vacío). Un `<select>` nativo no puede enviar cero valores. Que Shopify lo trate como sin plan está pendiente de R-A en tienda.
3. Sin JS, el select de planes no se vuelve a filtrar al cambiar de variante en el select nativo: lista las asignaciones de la variante pintada por el servidor. Una combinación variante/plan no válida la tiene que rechazar Shopify (no verificado). Tampoco cambian los precios visibles ni el estado del botón. Por eso el select de variantes muestra el precio de cada opción.
4. Sin JS, si se entra por `?variant=` de una variante agotada, el botón nace desactivado y no se reactiva al elegir otra.
5. El select nativo hereda el límite de `product.variants` en variantes por encima de 250 (tarea C-07, fuera de alcance).

## 4.4 Nivel de desviación: Nivel 1

- No toca ningún `id` de setting, `default`, schema, opción de select de schema, preset ni clave de locale (RULES §3.5).
- Los nombres de campo enviados a Shopify (`id`, `selling_plan`, `quantity`) y los hooks existentes (`data-variant-id`, `data-selling-plan-input`, `data-selling-plan-select`, `data-purchase-option`) se conservan.
- Se añade un hook nuevo, `data-no-js-control`, leído solo por `VariantSelects` y emitido por las dos secciones que montan el componente. `dataset-hooks.mjs` debe seguir en verde.
- Con JS, el comportamiento visible no cambia. Sin JS, se cambia un selector que hoy no funciona por uno que sí.
- `layout/theme.liquid` está fuera de las superficies candidatas del plan para B-02, pero no altera ningún contrato con el comerciante. Su inclusión es decisión del R-D (PD-1), no del implementador.

## 4.5 Orden de implementación: un solo turno

B-02 y A-01 se implementan en un único turno y con un único informe, porque comparten:

- los mismos bloques `buy_buttons` de las dos secciones;
- el mismo hook (`data-no-js-control`);
- el mismo método JS (`takeOverNativeControls`).

Hacer B-02 por separado dejaría un estado intermedio inválido: un hidden `id` desactivado sin el JS que lo active. Orden dentro del turno:

1. Preflight §1.2.
2. Harness en rojo: escribe el harness de §5.1 y ejecútalo contra la base. Debe reproducir los fallos de §2.2 y §3. Guarda la salida.
3. S-1 y S-2 (B-02).
4. S-3 y S-4 (A-01 y la activación JS).
5. S-5 solo con PD-1 aprobado.
6. Compuertas estáticas de §5.2 y harness en verde.
7. Informe de §8.

Esfuerzo orientativo: unas 0,5 jornadas entre código y harness. Está dentro de la banda del plan para B-02 (0,5-1 d), y A-01 era «código pequeño». La configuración y las pruebas en tienda van aparte y están bloqueadas (§5.3).

# 5. Criterios de aceptación y pruebas

## 5.1 Harness local (sintético, sin tienda): obligatorio

Ubicación entregable: `agent-comms/outbox-claude/harness-A-01-B-02-001/` (patrón de `harness-5A-001`). Puedes desarrollarlo en tu scratch y copiarlo ahí al final. Sin credenciales, sin URLs de tienda, sin red externa. Diseño mínimo:

- Un servidor Node local sirve `assets/theme.js` leído del repositorio, sin copiarlo ni modificarlo.
- Las páginas HTML las genera una función que traduce a mano el Liquid DEFINITIVO de ambas secciones: zona del picker, formulario completo, JSON de variantes y script en línea de `layout/theme.liquid`. Si S-5 se aplica, la función incluye ese script tal cual.
- El harness incluye una comprobación con `rg` o `grep` de que los atributos clave (`name="id"`, `data-variant-id`, `data-no-js-control`, `no-js-only`, `js-only`, `data-selling-plan-input`) aparecen en el Liquid real con el mismo número de ocurrencias que en el HTML generado. Así se reduce el riesgo de que el HTML diverja del Liquid.
- Modos:
  - JS: lee `new FormData(form).getAll('id')` y `getAll('selling_plan')`.
  - Sin JS (`javaScriptEnabled: false`): captura el cuerpo del POST nativo con `page.route('**/cart/add', ...)`.
  - JS fallido: sirve `theme.js` con 404.
- Superficies: PDP (con `data-product-url`) y producto destacado (sin él).
- Catálogo sintético mínimo:
  - p1, plan opcional: dos variantes con planes 1 y 2, una variante solo con el plan 3, una agotada.
  - p2, `requires_selling_plan`: una variante con planes y otra sin asignaciones.
  - p3, `requires_selling_plan` sin grupos, como `qa5a-f06-subscription` según GPT-REPORT-LOTE-0-AVANCE-002:77; no hay bloque de planes.
  - p4, solo variante por defecto.
  - p5, 40 variantes (2 opciones).
  - p6, 250 variantes.
  - p7, título de variante de 120 caracteres y un formato de dinero largo (por ejemplo `{{amount_with_comma_separator}} EUR`).
  - p8, producto con dos opciones donde una combinación con valores disponibles está agotada.

Criterios (todos en PDP y producto destacado):

| # | Caso | Criterio de aceptación |
| --- | --- | --- |
| H-1 | Compra única en p1 (JS) | `getAll('selling_plan')` = `[]`; `getAll('id')` = `[id]` |
| H-2 | Plan 1 → plan 2 → compra única (JS) | `["1"]`, luego `["2"]`, luego `[]`; `id` siempre con un único valor |
| H-3 | Plan 2 y cambio a variante con solo el plan 3 (JS) | `["3"]`, nunca `"2"`; cambio a la variante agotada: `[]` y botón desactivado |
| H-4 | Caso C: `?selling_plan=1` y después compra única (JS) | carga `["1"]`, tras compra única `[]` |
| H-5 | `requires_selling_plan` (p2, JS) | carga `["1"]`; plan 2 `["2"]`; variante sin asignaciones: `[]`, botón `disabled`, `[data-plan-required-notice]` visible, `.product-form__dynamic-checkout` oculto |
| H-6 | p3 `requires_selling_plan` sin grupos (JS y sin JS) | botón `disabled` y aviso visible en ambos modos |
| H-7 | B-02 sin JS: carga A, elige B en el select nativo | POST `id=[B]`, un solo valor; radios de variante con `display:none`; select visible |
| H-8 | B-02 JS fallido (solo con S-5) | `<html>` termina con `no-js`; el select es visible; POST `id=[B]` |
| H-9 | `?variant=B` en PDP (JS y sin JS) | `id=[B]` |
| H-10 | Sin JS, URL con plan 1 y elige compra única en el select nativo | POST `selling_plan=[""]` (límite §4.3.2, documentado) y `id` con un único valor |
| H-11 | Sin JS, opciones agotadas | `<option>` agotadas `disabled` salvo la seleccionada; texto con el sufijo de `products.product.sold_out` |
| H-12 | p4 solo variante por defecto | no se emite el select nativo; un solo `name="id"` (hidden activo); sin JS el POST envía ese `id` |
| H-13 | p5 / p6 (40 / 250 variantes) | select nativo con 40 / 250 opciones; los casos H-1, H-2 y H-7 siguen pasando; se informa del aumento de bytes del HTML de la sección |
| H-14 | p7 texto largo | sin errores; la opción contiene el título completo y el precio formateado por `money` (en el harness, la cadena equivalente) |
| H-15 | p8 multiopción, combinación agotada sin JS | no es posible enviar un `id` distinto del mostrado: el select nativo muestra la combinación agotada como `disabled` |
| H-16 | Regresión con JS | `takeOverNativeControls` deja `[data-no-js-control]` `disabled` y el hidden `id` activo; `StickyCartBar.handOffFocus` no puede elegir un control desactivado (`theme.js:1328-1335`) |
| H-17 | Prueba de que el harness detecta el defecto | contra la base `eb7cca7` (theme.js y Liquid sin cambios, reproducidos en el harness), H-1, H-2, H-4, H-7 y H-8 FALLAN, como en §2.2 y §3 |

## 5.2 Compuertas estáticas obligatorias

Pega la salida literal de cada una en el informe:

```
node --check assets/theme.js
npx --no-install shopify theme check --fail-level error     # esperado: 92 files ... no offenses
node scripts/theme-check-sanity.mjs
node scripts/locale-key-inventory.mjs                       # sin claves nuevas ni huérfanas
node scripts/dataset-hooks.mjs                              # data-no-js-control emitido por ambas secciones
node scripts/json-validate.mjs
rg -c 'name="id"' sections/main-product.liquid sections/featured-product.liquid      # 2 y 2
rg -c 'data-no-js-control' sections/main-product.liquid sections/featured-product.liquid   # 2 y 2
git diff --stat eb7cca7 -- . ':!agent-comms'                # solo los archivos de §4.2
```

Además, antes de cada push, el coordinador cuenta como 0 las apariciones del literal de contraseña fuera de `tests/vendor/axe.min.js`, sin imprimirlo (D12). El implementador no imprime ni busca ese literal en el informe.

## 5.3 Cinco compuertas (AGENTS.md / RULES §2)

| Compuerta | Exigencia para esta tarea |
| --- | --- |
| 1. Requisitos / ledger | Declarar las filas 69 y 71 (§6) con la evidencia `archivo:línea` de los cambios y el ID de prueba del harness. No editar el ledger. |
| 2. Estados degenerados | Vacío: destacado sin producto (no hay formulario; comprobar que no hay errores) y producto sin grupos. Uno: p4. Muchos: p5 y p6. Muy largo: p7. Faltante: variante sin asignaciones (p2), `requires_selling_plan` sin grupos (p3), combinación inexistente (con JS, `id` sin opción válida y botón desactivado). Plan opcional/obligatorio y agotado según H-1 a H-15. |
| 3. Consistencia | Precio de las opciones con el filtro `money` (usa `shop.money_format`), igual que el select de planes existente (`main-product.liquid:593`). Sin `Intl`. Reutilizar las claves `products.product.choose_options` y `products.product.sold_out`. Mismo patrón y mismo hook en ambas secciones; ningún umbral ni selector duplicado. |
| 4. Superficie del comerciante | Sin settings, labels ni schemas nuevos. Si crees necesaria una clave de locale nueva, DETENTE (fuera de lista, PD-6). |
| 5. Tienda real | No ejecutable (D22, sin credenciales; C-R0-4, sin fixture). Pendiente de §5.4. Estado máximo: «código completo». |

## 5.4 Pendiente para R-A en tienda (bloqueado por el fixture de Johandry y por credenciales)

Marca cada punto en el informe como «pendiente de fixture (C-R0-4) y credenciales (D22)». Ninguno se declara cumplido con el harness.

1. Matriz A-01 completa en PDP y producto destacado, con JS, sin JS y con JS fallido, sobre un producto con compra única y planes opcionales y otro con `requires_selling_plan`, con al menos dos planes. Incluye el payload de red real y, solo con autorización de mutación de carrito, la línea resultante (variante, plan, cantidad).
2. Interpretación de Shopify de `selling_plan=` vacío sin JS (§4.3.2) y de una combinación variante/plan inválida sin JS (§4.3.3).
3. B-02 en tienda: cargar A, elegir B sin JS; `?variant=` disponible y agotada; producto multiopción con combinación agotada.
4. «Buy it now» (`form | payment_button`) tras cambiar variante y plan con JS: compra la variante y el plan visibles (R-4).
5. Producto destacado en la home con `?selling_plan=` y `?variant=` en la URL: comportamiento real de Liquid (§2.2).
6. Móvil simulado con viewport verificado.

# 6. Filas del ledger y estado máximo

Filas reales afectadas, con su estado actual en `docs/requirements-ledger.md`:

| Fila (línea) | Estado actual | Relación | Estado propuesto tras esta tarea (sin tienda ni fixture) |
| --- | --- | --- | --- |
| «Planes de Venta / Suscripciones» (`:71`) | `cumplido` | Su evidencia (`main-product.liquid:129-166,570-597`, `theme.js:733-742`) tiene localizadores obsoletos. §2.2 demuestra que el formulario envía valores duplicados o contradictorios: hoy la fila no cumple. | `código completo`, con evidencia nueva (`archivo:línea` de S-3/S-4 y casos H-1 a H-6 y H-10). Vuelve a `cumplido` solo tras R-A con fixture. |
| «Selector de Variantes y Swatches Nativos» (`:69`) | `cumplido` | Evidencia de swatches y compra rápida verificada en vivo. No cubre la selección sin JS, que §3 demuestra que falla. | `código completo` (propuesta PD-3), con evidencia de S-1/S-2/S-4 y H-7 a H-9 y H-11 a H-15. |
| «Checkout Acelerado» (`:66`) | `cumplido` | Solo regresión (R-4). | Sin cambio. |

- El implementador NO edita `docs/requirements-ledger.md`. Propone en su informe y la actualización la decide la revisión (plan V4.1 §6).
- Si se aplican las propuestas, la cabecera del ledger pasaría de 54 `cumplido` / 6 `código completo` a 52 / 8. La recalcula quien actualice, con `node scripts/ledger-verify.mjs`.
- Estado máximo de A-01 y B-02 en este turno: «código completo».

# 7. Riesgos y hallazgos extra

## 7.1 Riesgos de regresión (cada uno con su comprobación)

| ID | Riesgo | Mitigación / prueba |
| --- | --- | --- |
| R-1 | Cajón del carrito: `CartDrawer.addItem` usa `FormData` y `formData.get('id')` para confirmar la línea (`theme.js:2558`, `:2588`). | H-1 a H-5 comprueban un único `id` con JS. El hidden `id` está antes del select en el DOM y el select está desactivado. |
| R-2 | Compra rápida (`snippets/product-card.liquid:308-400`), recomendaciones del cajón (`snippets/cart-drawer-recommendations.liquid`) y complete-the-look usan formularios propios y excluyen productos con planes (`product-card.liquid:92`, `cart-drawer-recommendations.liquid:141`). | No se tocan. `git diff --stat` debe mostrarlos sin cambios, y `rg -n "data-no-js-control" snippets/` debe salir vacío. |
| R-3 | Producto destacado: sin `data-product-url` ni `data-money-format`; varias instancias en la misma página. | Los IDs `FeaturedProductVariantNoJs-{{ section.id }}` son únicos por sección. El harness incluye dos secciones destacadas en una página para comprobar que no hay IDs duplicados (`document.querySelectorAll('[id]')` sin repetidos). |
| R-4 | «Buy it now» lee el `id` del formulario. Con JS hay dos `name="id"` en el DOM (uno desactivado). | El hidden activo va primero en orden del DOM. Es verificación de tienda (§5.4.4). Si falla, se devuelve a R-D. |
| R-5 | Barra fija: `requestSubmit` y `handOffFocus` (`theme.js:1265-1267`, `:1328-1335`). | `handOffFocus` filtra `!element.disabled`; con JS los selects nativos están desactivados (H-16). |
| R-6 | Peso del HTML: 250 opciones más el JSON existente. | H-13 informa del aumento en bytes; no hay umbral nuevo. |
| R-7 | Restauración de formularios del navegador al recargar o volver atrás. | `autocomplete="off"` en los dos selects nativos. Con JS, `getInitialVariant` lee el hidden (`theme.js:622-626`). |
| R-8 | S-5 es global: con `theme.js` caído, todo el tema pasa a `.no-js` (navegación, galería, etc.). | Es la degradación que ya implementan las reglas `.no-js` de `assets/base.css`. Sin cambio cuando `theme.js` funciona. El harness verifica las dos ramas (base de ese comportamiento en `check-fallback.mjs` del scratch). |
| R-9 | Concurrencia: C-08 puede editar las mismas dos secciones (bloques `trust_badges` y `shipping_lead_time`). | Escritor único y turnos secuenciales. Localizar por anclas (§1.1). Si hay solape de líneas, detente. |
| R-10 | Moneda: el texto de las opciones debe respetar `shop.money_format`. | Filtro Liquid `money` y `strip_html`, como `data-money-format` (`main-product.liquid:184`). Sin `Intl` ni formateo JS nuevo. |
| R-11 | D-02-A (Lote D) cambiará los mensajes de disponibilidad y de plan sobre esta base. | No anticipar D-02: no cambies textos ni mensajes existentes. |

## 7.2 Hallazgos extra fuera de alcance (sin parche; no tocar)

1. El producto destacado no tiene total de línea: su `variant-selects` no emite `data-money-format` ni `data-line-total-template` (`featured-product.liquid:71-81`). Además, sus asignaciones de plan en el JSON no tienen `price_cents` ni `compare_at_price_cents` (`:515-522`), que `updateLineTotal` necesita (`theme.js:939-960`). Candidato a D-02/C-07.
2. La fila 71 del ledger cita localizadores obsoletos (`main-product.liquid:129-166`, `theme.js:733-742`). Se corrige al actualizar la fila (§6).
3. Los radios `purchase-option-*` envían un parámetro residual en todos los modos (PD-2).

# 8. Informe del implementador

Ruta: `agent-comms/outbox-claude/CLAUDE-REPORT-A-01-B-02-001.md`.

Contenido obligatorio:

1. Cabecera completa RULES §1.4: ID, Estado, Decisión requerida, Resumen en 5 líneas, Archivos tocados, Desviaciones, Hallazgos extra, Verificación y Afirmaciones falsables.
2. Datos de identidad:
   - SHA base y SHA de `HEAD` de `lote-a` antes de editar;
   - `git diff --stat`;
   - lista cerrada permitida frente a lista efectivamente tocada, con líneas exactas.
3. Salida literal del preflight (§1.2), de las compuertas (§5.2) y del harness en rojo (base) y en verde (tras los cambios). Etiqueta todo como «sintético» o «estático».
4. Tabla H-1 a H-17 con resultado y `getAll` / payload por superficie y modo.
5. Decisión aplicada de cada PD de §9.1, citando el dictamen R-D.
6. Propuesta de estado de las filas 69 y 71 del ledger (§6), sin editar el ledger.
7. Límites de §4.3 confirmados o corregidos, y lista de §5.4 marcada como «pendiente de fixture (C-R0-4) y credenciales (D22)».
8. Ninguna credencial, URL de tienda con token, cookie ni valor de entorno. No se abre `.secrets` y no se crean metafields (D13, D17).
9. El implementador no hace commit ni push. Lo hace el coordinador tras la revisión (D11, D12, D16).

# 9. Decisiones para el R-D y conflictos

## 9.1 Puntos que decide el R-D (PD)

| ID | Pregunta | Recomendación del redactor |
| --- | --- | --- |
| PD-1 | ¿Entra `layout/theme.liquid` (S-5) en la lista cerrada para cubrir «JS fallido», que es criterio explícito de B-02 en el plan (§4.1)? | Sí. Son unas 5 líneas en el script en línea, no tienen efecto si `theme.js` funciona y son la única forma de cumplir el criterio sin CLS. Sin S-5, H-8 se declara límite y R-A no puede aceptar esa parte de B-02. |
| PD-2 | ¿Se eliminan los parámetros residuales `purchase-option-*` (radios JS dentro del `<form>`)? | No en esta tarea. Se envían ya hoy y no son `selling_plan`. Eliminarlos exige `disabled` desde el servidor en el fieldset, con un destello de estilo `:disabled` hasta que carga `theme.js` (`assets/base.css`, `.selling-plans__choice:has(input:disabled)`), y eso amplía la lista a `base.css`. Que R-A confirme que Shopify los ignora. |
| PD-3 | ¿Se propone bajar la fila 69 del ledger además de la 71? | Sí: hoy la selección sin JS falla, y una fila `cumplido` no puede convivir con un P1 condicionado confirmado en su componente. |
| PD-4 | Conciliar D15 («si [el fixture] no existe al llegar a A-01, Claude sigue con lo que no dependa de él y lo deja marcado») con D19 (c) («Lo único que queda en espera es A-01»). | Leer D19 (c) como espera del CIERRE de A-01 y D15 como permiso para implementar el código. Si el R-D no acepta esa lectura, A-01 se aparta (B-02 puede ir solo con S-1, S-2, S-4 sin la parte de `data-no-js-control` del select de planes, y S-5) y se consulta a Johandry (§9.2). |
| PD-5 | Sin JS, ¿se desactivan las opciones de variantes agotadas? | Sí, salvo la seleccionada. Evita un error de Shopify al añadir algo agotado sin JS y es coherente con los radios, que ya nacen `disabled`. La alternativa (opciones habilitadas, que Shopify rechace) también cumple «lo visible = lo enviado». |
| PD-6 | Etiqueta del select nativo: reutilizar `products.product.choose_options` («Choose options» / «Elegir opciones») o una clave nueva. | Reutilizar. Una clave nueva saca `locales/*.json` de la lista. |

## 9.2 Conflictos detectados (y si requieren a Johandry según D10)

| ID | Conflicto | ¿Johandry? |
| --- | --- | --- |
| K-1 | D15 frente a D19 (c) sobre si A-01 avanza sin el fixture (PD-4). | Solo si el R-D rechaza la lectura conciliadora. D10: «cambio fuera ... de las decisiones registradas». |
| K-2 | El plan V4.1 asigna A-01/B-02 a GPT y la autorización a Gemini/Antigravity. D9 y D11 los sustituyen por Claude y el revisor Opus de contexto limpio. | No (ya decidido por Johandry en D9 y D11). |
| K-3 | RULES §2.5 exige prueba en tienda; D22 limita a «código completo» sin credenciales. | No (decidido en D22). |
| K-4 | Filas 69 y 71 del ledger en `cumplido` frente a la evidencia de §2.2 y §3. | No: la propuesta la resuelve la revisión (§6). |
| K-5 | `layout/theme.liquid` fuera de las superficies candidatas del plan para B-02 (PD-1). | No, si el R-D lo considera parte del criterio «JS fallido» del plan. Sí, si lo considera «cambio fuera del plan» (D10). |
| K-6 | Concurrencia con C-08 en las mismas dos secciones (R-9). | No: lo coordina el coordinador mediante turnos. |
