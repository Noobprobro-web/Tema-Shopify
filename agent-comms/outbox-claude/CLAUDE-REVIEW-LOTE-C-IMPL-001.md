# CLAUDE-REVIEW-LOTE-C-IMPL-001

Fecha: 2026-11-07
Revisor: Claude Opus 5.5, contexto limpio, solo lectura.
Escritor revisado: GPT/Codex.
Snapshot: rama `lote-c-impl`, `a0f8b3f3f3b7dd56167078f6bad3edb1c3f59783`. Base `lote-d`, `258ca4f59910ebf3c024901a25f0010d69b13856` (merge-base verificado). Clon temporal en el scratchpad, sin cambios locales en archivos versionados (`git status` vacío).
Leídos: `GPT-REPORT-LOTE-C-IMPLEMENTACION-001.md`, `CLAUDE-REVIEW-LOTE-C-PROPUESTAS-001.md` (SHA-256 `5a2088ec…122a`, coincide con el registrado), `docs/decisions.md` y el diff completo `258ca4f..a0f8b3f` (21 archivos).
Límites: sin tienda, sin editor, sin credenciales, sin commit ni push. No se ejecutó el arnés de GPT (el entorno denegó ejecutar ese código externo); se escribió un arnés propio.

## 0. Veredicto

**ACEPTADO CON CONDICIONES.** La corrección funcional de C-07 es correcta y está demostrada en navegador: la base enviaba una variante distinta de la mostrada y la rama no. Pero la rama **no pasa Theme Check** con el CLI fijado en el repo, en contra de lo que afirma el informe de GPT, y eso bloquea Gate 5 y cualquier fusión hasta corregirlo (condición L-1).

Condiciones:

| ID | Tipo | Condición |
|---|---|---|
| L-1 | Bloqueante | Corregir `LiquidHTMLSyntaxError` en `snippets/variant-no-js-select.liquid:15-18` y `:77-90` (ver §4.1) y adjuntar la salida de Theme Check en verde con `node_modules/@shopify/cli` 4.8.0 y `theme-check-sanity.mjs` en verde. |
| L-2 | Bloqueante de proceso | Johandry aprueba por escrito la sustitución de `variant-state` por navegación al PDP en `docs/decisions.md` (hoy consta como no aprobada, entrada 2026-11-07). |
| L-3 | Antes de Gate 5 | Estado visual del valor seleccionado en el selector de enlaces: no hay ninguna regla CSS para `a.variant-picker__label[aria-current]` (§2.4). |
| L-4 | Antes de Gate 5 | Aviso visible y accesible de que elegir opción en un destacado con más de 250 variantes abre la ficha del producto (§2.4). |
| L-5 | Trazabilidad | El SHA-256 publicado de `harness-GPT-C07-VARIANTS-001/run.mjs` (`a63d11a3…042d`) no coincide con el archivo versionado (`7801f44e…9528`, tampoco con CRLF). Recalcular y corregir el informe. El de `capture.mjs` sí coincide. |
| L-6 | Recomendada | Durante la resolución por servidor el botón pasa a «Unavailable» (`theme.js:703`, `updateForms(null)`), y la barra sticky lo replica. Usar un estado de carga en lugar del texto de no disponible. |
| L-7 | Pendiente en tienda | Todo lo marcado como tal en §3, con los fixtures de la R-D §3.5. |

## 1. Fix P1 de `getInitialVariant` (C-07, H7-1 y H7-3)

### 1.1 Cambio revisado

`assets/theme.js:666-689`. La variante inicial ya no sale del input oculto ni cae a `variantData[0]`:

- Ruta inline (250 o menos): busca `data-initial-variant-id` en el JSON; si no está, devuelve `null` (falla cerrado).
- Ruta servidor (más de 250, solo PDP): lee `[data-variant-state]` renderizado por el snippet en modo `response` (`main-product.liquid:736-743`), exige `data-product-id` y `data-variant-id` coherentes con el elemento y, si la URL trae `option_values`, que coincidan con los valores marcados por Shopify. Cualquier incoherencia da `null`.
- `updateForms` (`theme.js:1007-1015`) desactiva el input `id` cuando no hay variante, de modo que `FormData` no lleva `id`. Un listener de `submit` en captura (`theme.js:628-637`) bloquea el envío si no hay variante válida, incluso con `requestSubmit()`.
- Con más de 250 el PDP ya no emite el JSON truncado; la resolución pasa entera a Section Rendering con `option_values` (`theme.js:690-782`), con `AbortController`, espera de 80 ms, caché de 16 entradas y verificación de producto, sección, IDs de opción, `variant.id` y etiquetas de opción.

### 1.2 Arnés

Ruta: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h/run.mjs` (SHA-256 `178007b22810652362c8d9da0b45f828362b8ed370a296c2e4a15b21d30a9257`).
Salidas: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h/out/stdout.txt`, `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h/out/log.txt` y `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h/out/results.json`.
Fuentes copiadas con `git show`: `c7h/src/{base,branch}/theme.js` y `variant-no-js-select.liquid` de cada commit.

Diseño:
- Chromium headless (Playwright 1.63 instalado), JS activado y desactivado, red interceptada en `https://theme.test`.
- Carga el `assets/theme.js` real de cada commit. El DOM replica el marcado de `main-product` y `featured-product` de cada commit (radios con IDs `option-<sección>-<pos>-<índice>`, formulario `data-cart-add-form`, botón, `data-variant-status`, `sticky-cart-bar`).
- El snippet real `variant-no-js-select.liquid` de cada commit se renderiza con LiquidJS 10 (filtros `money`, `json` y `t` sustitutos).
- Servidor emulado: `?variant=` se resuelve sobre el catálogo completo; un ID inexistente cae en la primera disponible; `option_values` sin variante da `null`; `product.variants` se trunca a 250; disponibilidad descendente por opciones previas; Section Rendering devuelve la sección para la URL pedida.
- Catálogo: 1 variante por defecto; 250 (10×25); 255 (13×20 menos 5 combinaciones, C2/S0 a C2/S4 inexistentes). Variante de prueba fuera del JSON: posición 253.
- Criterio: «mostrada» es la combinación marcada (radios con JS; select nativo o enlace `aria-current` sin JS). Falla si el formulario enviaría un `id` distinto de la mostrada, si la mostrada no es la que resolvió el servidor, si la sticky no coincide con el botón principal o si hay errores de página.

### 1.3 Resultados (carga inicial)

| Caso | Base JS on | Base JS off | Rama JS on | Rama JS off |
|---|---|---|---|---|
| 1 variante | PASS (1) | PASS | PASS | PASS |
| 250, `?variant=` pos 200 | PASS | PASS | PASS | PASS |
| 255, `?variant=` dentro (pos 100) | PASS | PASS | PASS | PASS |
| 255, `?variant=` fuera (pos 253) | **FAIL: muestra 300253, envía 300001** | PASS | PASS (envía 300253) | PASS |
| 255, `?variant=` inexistente | PASS (primera disponible) | PASS | PASS | PASS |
| 255, variante resuelta `null` | **FAIL: muestra C2/S0 inexistente, envía 300001, botón habilitado** | PASS (deshabilitado) | PASS (sin `id`, deshabilitado, sticky deshabilitada) | PASS |
| 250, `?variant=` inexistente | PASS | PASS | PASS | PASS |

Envío forzado con `requestSubmit()` (Parte 5), que muestra la petición real a `/cart/add`:

| Caso | Base | Rama |
|---|---|---|
| `null` | **POST con id 300001** | 0 peticiones |
| Fuera de 250 (pos 253) | **POST con id 300001** | POST con id 300253 |

Interacción con JS en PDP de 255 (Parte 2):

| Caso | Base | Rama |
|---|---|---|
| Cambio a C12/S16 (pos 252, fuera del JSON) | FAIL: «Unavailable», inalcanzable (H7-2) | PASS: 2 peticiones `section_id`, envía 300252 |
| Cambio a combinación inexistente | PASS | PASS: sin `id`, sticky deshabilitada |
| Cuatro cambios rápidos | PASS | PASS: 1 sola petición, gana el último (300235) |

Conclusión: el defecto H7-1 («mostrar B, enviar A») y su variante con `null` existían en `lote-d` y se reproducen con compra real; en `lote-c-impl` están corregidos en todos los casos pedidos. El selector mostrado y el `id` enviado coinciden siempre, y con `null` no se envía nada. Total de la rama: 0 FAIL.

### 1.4 Observaciones

- URL incompleta con JS (`?option_values=1012`, Parte 4): los radios muestran la variante que Shopify resolvió, pero el JS la rechaza y el botón dice «Unavailable». Falla cerrado y no compra mal; es UX mejorable para URLs editadas a mano. Sin JS el `id` y lo mostrado salen del mismo `selected_variant`, así que siempre coinciden (el resultado concreto depende de cómo resuelva Shopify la URL incompleta: pendiente en tienda).
- `history.replaceState` en la ruta servidor parte de `window.location.href` y elimina `option_values` al resolver una variante válida (`theme.js:1234-1239`). Correcto.
- Si el PDP se sirve con `?view=` o con una plantilla alternativa, la petición de estado no lleva `view` y podría devolver 404; falla cerrado. Pendiente en tienda.

## 2. Navegación al PDP para `featured-product` con más de 250 variantes

### 2.1 Implementación

`featured-product.liquid:13-19` activa `use_variant_links` con `variants_count > 250` y desactiva el select nativo. `:127-130` pinta el snippet en modo `option_links`; el JSON se reduce a la variante seleccionada (`:486-498`). El snippet (`variant-no-js-select.liquid:107-152`) construye, por cada valor, `{{ product.url | split: '?' | first }}?option_values=<id1>,<id2>…`, sustituyendo solo la posición de su opción. Se quitó `assign product = featured_product`; comprobé que no queda ningún uso del `product` global en la sección.

### 2.2 Pruebas (Parte 3, rama, JS on y off, desde `/` y desde `/products/other?variant=777`)

- 33 de 33 enlaces bien formados en los cuatro contextos: ruta del producto destacado, un único parámetro `option_values`, un ID por opción en orden, cada ID pertenece a su opción y solo cambia la posición propia. Un `aria-current` por grupo.
- El `id` del formulario del destacado nunca está vacío (300001, la primera disponible) y el botón está habilitado.
- Flujo C12 y luego S16 (posición 252, fuera de 250): llega al PDP y envía 300252, con y sin JS.
- Flujo a combinación inexistente: PDP con `id` ausente y botón deshabilitado, con y sin JS.
- El destacado no hace peticiones `section_id`; solo navega.

### 2.3 Corrección

- URLs: correctas. `escape` aplicado a ruta y lista de IDs; los IDs son numéricos.
- URL incompleta sin JS: el tema nunca la genera (siempre un ID por opción). Si alguien la escribe a mano, el PDP sin JS muestra y envía la misma `selected_variant` del servidor, y si es `null` no hay `id` (`variant-no-js-select.liquid:104`). Bien resuelto en lo que depende del tema.
- `id` vacío: nunca se envía. Con `selected_variant` en blanco el hidden nace `disabled`, y con JS `updateForms` lo mantiene así.
- Planes de venta: el destacado sigue el contrato vigente sobre la variante seleccionada; en el PDP, el de la ficha.

### 2.4 Accesibilidad

Correcto: son enlaces reales (navegan, así que no hay cambio de contexto oculto por WCAG 3.2.2), agrupados en `fieldset` con `legend` que nombra la opción y el valor actual, `aria-current="true"` en el seleccionado, los no disponibles siguen siendo navegables (A360-05) con `×` oculto y texto «option_unavailable» para lectores, objetivo táctil mínimo heredado de `.variant-picker__label` (`base.css:1395`) y foco visible por la regla global `:focus-visible` (`base.css:283`).

Faltas:
1. (L-3) `base.css` solo estiliza el estado elegido como `.variant-picker__input:checked + .variant-picker__label` (`:1411`). En el selector de enlaces todos los valores se ven iguales; el seleccionado solo se deduce del texto de la leyenda.
2. (L-4) Visualmente parecen chips de selección en el sitio, pero llevan a otra página. Hace falta un texto breve visible y asociado (por ejemplo con `aria-describedby` en el grupo) que diga que se abre la ficha del producto.

### 2.5 UX frente a `variant-state`

`variant-state` mantendría al comprador en la portada y actualizaría precio, disponibilidad y botón en el sitio: es mejor experiencia. Sus costes: un archivo nuevo (ya autorizado como Nivel 2 el 2026-11-06), una segunda vía de resolución que mantener y, sobre todo, que una sección pedida por nombre de archivo se pinta con settings por defecto, así que el cap AF-07 del bloque de inventario del destacado no viaja; habría que usar un cap conservador fijo y perder el aviso de «quedan N». La navegación evita todo eso, reutiliza la única vía de resolución del PDP (que sí conoce el cap y las reglas de su instancia), no añade superficie y no tiene riesgo de enviar una variante equivocada. El caso afectado es raro (un destacado con más de 250 variantes) y para 250 o menos se conserva el selector inline.

### 2.6 Cumplimiento de la política de Shopify

La guía de productos con muchas variantes pide diferir la carga de variantes, usar `option_values` con `product_option_value.id`, tratar `selected_or_first_available_variant` como posible `null` y no depender de `product.variants` completo; declara además que «Themes are no longer required to support users that have disabled JavaScript». La guía no regula el destacado fuera del PDP. Los requisitos de la Theme Store sobre selección de variantes se refieren a la página de producto, que aquí sigue íntegra. La propuesta cumple. Cumple también la R-D §4 (enlaces GET con `option_values`, `null` sin `id`, select nativo para 250 o menos) y C07-5 (identidad verificable: el PDP del propio producto, con `data-product-id` y sección comprobados).

### 2.7 Recomendación

**Aprobar** la navegación al PDP, con L-3 y L-4 antes de Gate 5 y con la aprobación expresa de Johandry registrada (L-2). Si Johandry prioriza la experiencia en portada por encima de la simplicidad, `variant-state` sigue siendo viable, pero exige resolver el cap AF-07 sin settings de instancia y una segunda revisión.

## 3. Condiciones de la R-D, punto por punto

### C-01

| Condición | Estado | Evidencia |
|---|---|---|
| C01-1 Matriz 3 presets × 2 viewports × antes/después | Pendiente en tienda | Solo hay script. |
| C01-2 Criterio sin umbral; escritorio sin cambios | Estático cumplido; empírico pendiente en tienda | `base.css:5604` mueve `21/8` de `min-width: 48rem` a la regla base y `:5615` limita el `gap` a `width < 48rem`, así que en escritorio no cambia nada. |
| C01-3 Barra de preview y script versionado con SHA | Cumplido | `capture.mjs:33-36` mide u oculta la barra; SHA coincide (`ce2dab82…1eb`). Mide la primera tarjeta de producto real, no el primer hijo, lo que mejora el criterio de la R-D. |
| C01-4 Escape y foco solo si hay disclosure | No aplica | No se añade disclosure. |
| C01-5 Persistencia tras el re-render AJAX | No aplica | `FacetFiltersForm` intacto. |
| C01-6 LCP y CLS antes y después | Pendiente en tienda | El banner cambia de proporción en móvil, por lo que el elemento LCP puede cambiar. |

Nota menor: `@media (width < 48rem)` usa sintaxis de rango, distinta del resto del archivo (`min-width`). Funciona en navegadores actuales.

### C-05

| Condición | Estado | Evidencia |
|---|---|---|
| C05-1 H1 vacío fuera de `page` | Cumplido | Las siete secciones envuelven el H1 y su `aria-labelledby` en `page.title != blank` (por ejemplo `main-page.liquid:7` y `:13-15`). |
| C05-2 `limit: 1` de sección con `enabled_on` | Cumplido | `"limit": 1` y `"enabled_on": { "templates": ["page"] }` en las siete. Solo `templates/page*.json` usan estas secciones; `listings` no las referencia. |
| C05-3 `main-documentation`/`main-support` en el ZIP | Pendiente de decisión de Johandry | No tratado, como reconoce el informe. |
| C05-4 Instalación y editor | Pendiente en tienda (C-02) | |
| C05-5 Diff JSON por lectura | Pendiente en tienda | `templates` y `listings` sin cambios en el diff. |

### C-07

| Condición | Estado | Evidencia |
|---|---|---|
| C07-1 H7-1 corregido con prueba | Cumplido | §1.3. |
| C07-2 Fuente única con más de 250 | Cumplido | PDP sin JSON (`main-product.liquid:736-743`); radios marcados y disponibilidad desde la respuesta. Destacado con JSON de una sola variante que no se usa para resolver. |
| C07-3 `null` en servidor y cliente y barrido de consumidores | Cumplido en estático y sintético; pendiente en tienda | `price.liquid:26-29,61`, botón (`main-product.liquid:646`), sticky (`:769-816`), `product-inventory` (estado `unavailable`), `product-provenance` y `pickup-availability` toleran nil. Queda por ver en tienda `{{ nil | money }}` en `data-one-time-price` (`main-product.liquid:529`) para productos con planes. |
| C07-4 `theme:variant-change` y sticky | Cumplido en sintético | El `detail.variant` de la vía servidor tiene los mismos 20 campos que el JSON; la sticky replica `disabled` y título en todos los casos. Pendiente en tienda con galería, inventario y recogida reales. |
| C07-5 Vía concreta para featured | Técnicamente cumplido; aprobación pendiente (L-2) | §2. |
| C07-6 Semántica A360-05 | Cumplido | En modo servidor los radios no se desactivan por `value.available` (`main-product.liquid:270`); solo `aria-disabled` y etiqueta. |
| C07-7 Fixtures y regresión de guardas | Pendiente en tienda | Los archivos de guardas no están en el diff. |
| C07-8 Foco, `aria-busy`, anuncio único, ATC sin perder foco | Cumplido en código; pendiente en tienda con lector | `aria-busy` en `[data-variant-picker]`; el anuncio se deduplica (`theme.js:1230`); los radios no se reemplazan, así que el foco se conserva. Ver L-6. |
| C07-9 Cita del límite de 2048 | Cumplido | Informe 016, línea 181, enlaza el changelog. |
| C07-10 Decisión sin JS registrada antes de implementar | Cumplido | `docs/decisions.md`, entrada 2026-11-06. |

## 4. Regresiones

### 4.1 Theme Check (bloqueante)

Instalé las dependencias del propio repo con `npm ci --ignore-scripts` (Shopify CLI 4.8.0, la versión fijada) y ejecuté `shopify theme check --path . --output json`:

- `lote-d` (258ca4f, exportado con `git archive`): `[]`, salida 0.
- `lote-c-impl` (a0f8b3f): **1 error**, salida 1.

```
snippets/variant-no-js-select.liquid  LiquidHTMLSyntaxError (error)
fila 18: "Attempting to close LiquidTag 'if' before it was opened without a matching 'if'"
```

Causa: `<div data-variant-state …>` y `<script …>` se abren dentro de `{%- if mode == 'response' -%}` (`:15-18`) y se cierran en otro `if` distinto (`:77-90`). El parser de Theme Check exige HTML equilibrado dentro de cada rama. Comprobación: en una copia temporal, quitando solo esos dos envoltorios, Theme Check vuelve a `[]`, así que no hay más ofensas ocultas tras el error de sintaxis. `scripts/theme-check-sanity.mjs` también falla («el sandbox restaurado no quedó limpio») porque la línea base ya no está limpia. El informe de GPT afirma `[]`; con el CLI del repo no se reproduce. Arreglo sugerido: capturar el JSON de estado en una variable y emitir el envoltorio completo dentro de una sola rama `response`. Shopify renderiza el archivo igualmente (Liquid no analiza HTML), pero la compuerta y la Theme Store exigen cero errores.

Salidas: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h/out/theme-check-branch.json` y `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h/out/theme-check-base.json`.

### 4.2 Resto de compuertas

- `node --check` de `assets/theme.js`, `assets/product-zoom.js` y los dos módulos del arnés de GPT: sin errores.
- `git diff --check 258ca4f..a0f8b3f`: limpio.
- `json-validate`, `dataset-hooks`, `locale-key-inventory` y `ledger-verify`: salida 0. El ledger solo cambia el conteo del encabezado (46/15), coherente con la verificación.

### 4.3 Alcance

Los 21 archivos del diff coinciden con el alcance declarado. Los hunks de `theme.js` están todos dentro de `VariantSelects`. `<variant-selects>` solo existe en `main-product` y `featured-product`, y ambos emiten `data-initial-variant-id`, así que el cambio de `getInitialVariant` no deja a nadie sin variante inicial. El cambio de `price.liquid` solo actúa con `use_variant` y una variante en blanco; ninguno de los demás llamadores (cards, lookbook, curated, complete-the-look) puede producir ese caso. `templates` y `listings` sin cambios.

Cambios de comportamiento colaterales, aceptables: con variante `null` la cantidad queda con mínimo 1 y máximo igual al mínimo, y la insignia de agotado se oculta (se muestra «Unavailable»). Tras una compra, `updateForms(currentVariant)` puede dejar el botón deshabilitado si hay una resolución en curso, y la respuesta lo reactiva.

### 4.4 `theme:variant-change` y sticky

Verificado en el arnés: un solo evento por resolución válida, `detail.variant` con la forma del JSON y `null` en combinación inexistente. La barra sticky copia `disabled` y el texto del botón principal por `MutationObserver`; el título de variante se actualiza con el evento. Por eso hereda el texto «Unavailable» durante la carga (L-6).

## 5. Seguridad

Sobre las 1.175 líneas añadidas del diff, sin imprimir valores: 0 coincidencias de tokens Shopify (`shpat_`, `shpss_`, `shpca_`, `shppa_`, `shptka_`, `atkn_`), tokens de GitHub, claves `sk-`, AWS `AKIA`, claves privadas PEM, `Bearer`, asignaciones de `api_key`/`secret`/`password`/`token` con literal largo, ni de `SHOPIFY_CLI_THEME_TOKEN` o `STOREFRONT_PASSWORD`. Ningún archivo del diff tiene nombre de secreto o `.env`. No se abrió `.secrets`.

## 6. Afirmaciones falsables

1. Con `lote-d`, JS activado y `?variant=` a la posición 253 de 255, `FormData` lleva el id de la posición 1 y se hace POST a `/cart/add` con él; con `lote-c-impl`, lleva el de la 253.
2. Con `lote-d` y `option_values` de una combinación inexistente, el botón queda habilitado y se envía la posición 1; con `lote-c-impl` no hay `id` ni petición.
3. `shopify theme check` 4.8.0 sobre a0f8b3f devuelve un `LiquidHTMLSyntaxError` en `snippets/variant-no-js-select.liquid`, y sobre 258ca4f devuelve `[]`.
4. `base.css` no tiene ninguna regla para `.variant-picker__label[aria-current]`.
5. El SHA-256 de `agent-comms/outbox-gpt/harness-GPT-C07-VARIANTS-001/run.mjs` en a0f8b3f es `7801f44ea434fae2edb59878e6309eec64878c15b909b34d03b26922b3cd9528`.
