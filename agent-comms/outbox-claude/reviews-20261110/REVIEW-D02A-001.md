# REVIEW-D02A-001. Revisión independiente de bed7b64 (task/d02a)

Revisor independiente (no autor), en solo lectura. No modifiqué el worktree ni hice commit ni push. `git status` del worktree sigue limpio.

Base: d8703c5. Commit: bed7b64 "Fix D-02-A: sticky bar shows the plan price on load".

## Veredicto: ACEPTADO

El fix es correcto y está acotado. No encontré regresiones. Lo del anuncio del precio no bloquea D-02-A. Lo dejo como recomendación aparte con severidad baja (ver punto 3).

## 1. Corrección y alcance del fix

El diff toca solo `assets/theme.js`: 5 líneas añadidas y 1 quitada, todas en `StickyCartBar.connectedCallback`. Además añade los archivos del harness del autor en `agent-comms/`.

```js
this.unitPrice = this.variantSelects?.currentAllocation?.price
  || this.priceOutput?.textContent.trim() || '';
```

Por qué funciona:
- `customElements.define('variant-selects')` (línea 5799) corre antes que `define('sticky-cart-bar')` (línea 5816), y `theme.js` carga con `defer`. Así, cuando la barra se conecta, `VariantSelects.connectedCallback` ya ejecutó `updatePurchaseOptions()` y `currentAllocation` ya tiene valor.
- `currentAllocation` solo tiene valor cuando el modo es suscripción y hay una allocation válida para la variante. Si no, queda en `null` o `undefined`, y la barra usa el texto del Liquid (que es `selected_variant.price | money`). Ese es el mismo origen que usa `dispatchPurchaseOptionChange` (`currentAllocation?.price || variant?.price`), así que la carga y los cambios siguen la misma regla.
- `allocation.price` es el string con formato `| money` que llega del JSON (`snippets/variant-no-js-select.liquid:62`), igual que `variant.price`. No hay una segunda conversión de moneda.

Casos pedidos (todos verificados en Chromium con Playwright, ver punto 4):

| Caso | Resultado |
|---|---|
| Sin plan (producto sin grupos, `?selling_plan` se ignora) | Precio de la variante (R-1) |
| Grupos presentes y compra única | Precio de la variante (R-2) |
| Plan obligatorio sin allocations | Precio de la variante y botón desactivado (R-3, M-5) |
| Plan obligatorio sin `?selling_plan` (toma la primera allocation) | Precio del plan (R-4, M-4) |
| Plan opcional por URL | Precio del plan (R-5, M-9) |
| Plan cambiado tras la carga (one_time, luego suscripción, luego plan 1, luego variantes B, E, D y A) | La barra siempre coincide con `[data-current-price]` (R-10, C-2, C-3) |
| Variante sin allocations con `?selling_plan` | Precio de la variante (R-6) |
| Plan inexistente en la URL | Precio de la variante (R-8) |
| Agotada con allocations y `?selling_plan` | Precio de la variante, sin plan y con cantidad bloqueada (R-7, R-16) |
| Formatos USD `$1,111.00 USD`, JPY `¥1,111`, NBSP con `€ & Co's` | Texto idéntico al de la allocation (R-9) |
| Cantidad 3 con plan cargado | `3 × €999,00 EUR`, y el total se copia de la línea (R-11) |
| `variant-selects` sin JSON o sección sin `variant-selects` | Usa el texto del Liquid, sin errores (R-12, R-13) |
| Re-render de la sección (editor de temas) | Precio del plan (R-14) |

Observaciones menores, ninguna bloquea:
- El Liquid de la barra (`sections/main-product.liquid:817`) sigue pintando `selected_variant.price`. Sin JS la barra no aparece (lleva `inert` y `aria-hidden`), así que nadie lo ve. Si se quiere coherencia también en el servidor, podría usar `selected_selling_plan_allocation.price` cuando exista. Es opcional.
- Si la tienda usa un money format con HTML (por ejemplo `<span class=money>`), `textContent` mostraría las etiquetas. Esto no lo introduce el fix: ya pasaba en el evento `theme:purchase-option-change` y en `updatePrice`. Queda fuera de alcance.

## 2. Regresiones

- La barra sticky al cambiar de variante, con agotado y con la vuelta funciona bien (autor S-1, C-1 y C-2; mío R-10 y R-16). La etiqueta, el estado desactivado, el `aria-label` y la variante quedan sincronizados.
- D-02-Q: el harness de revisión de D-02-Q (`rev-d02q/review-harness.js`), corrido sobre el `theme.js` de bed7b64, da una salida idéntica a `fix3.out` de esa revisión. La cantidad queda bloqueada en agotada (autor y R-16).
- C2 (sin bloque de inventario, umbral 0): el código no cambió entre aee5d43 y bed7b64, salvo B-01 y estas 6 líneas. Los casos de inventario del autor (A-3, M-1 a M-8) pasan.
- B-01: `harness-B-01-001/drawer-breakpoint.mjs` en modo fix da 0 fallos en escritorio y en `MOBILE=1`. Sus líneas PASS/FAIL son idénticas a `salida-fix.txt`.

## 3. El precio no se anuncia al cambiar de variante

Lo confirmo. Durante el cambio de variante (C-1), ninguna región viva visible recibe el precio. `[data-variant-status]` anuncia "Título: Variant available." o "sold out", pero sin precio. El precio solo se anuncia en dos situaciones: con cantidad mayor que 1 (total de línea, `aria-live`) y en modo suscripción (`data-selling-plan-status`).

Mi valoración: en sentido estricto no es un incumplimiento de WCAG 4.1.3. El resultado de la acción (disponible, agotada o no disponible) sí se comunica por una región de estado, y el precio es contenido actualizado en la página, que se puede encontrar navegando. Pero es una carencia real para quien usa lector de pantalla, cuando el precio cambia entre variantes. Además Dawn, la referencia que usan los revisores de la Theme Store, sí anuncia el precio (su contenedor de precio lleva `role="status"`).

- Severidad: baja (P3). No bloquea D-02-A ni el envío a la Theme Store.
- Recomendación: arreglarlo en una tarea aparte. Lo mejor es incluir el precio en el texto de `[data-variant-status]` con una clave de locale nueva, por ejemplo "[title], [price]: Variant available.", y solo cuando la variante está disponible. No conviene convertir `[data-price-wrapper]` en una región viva: `updatePrice` reescribe varios nodos (las etiquetas visually-hidden, el precio comparado y las insignias) y además `.price__badges` ya es `aria-live`. Eso daría anuncios duplicados o partidos.

## 4. Harnesses

- Autor (`agent-comms/outbox-claude/harness-D-02-A-001/harness.cjs`):
  - base d8703c5: 55/57, fallan M-4[pdp] y M-9[pdp] (`sticky.price=€50,00 EUR≠€10,00/€20,00 EUR`).
  - fix: 57/57.
  - Coincide con lo que declara el autor.
- Propio (`/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d02a/harness-rev.cjs`, 18 casos):
  - fix: 18/18.
  - base: 10/18, fallan R-4, R-5, R-9 en los tres formatos, R-11, R-14 y R-15. Los 8 fallos son siempre el precio de compra única con un plan activo, y todos los corrige el fix.
  - Salidas en `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d02a/out-fix.txt` y `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d02a/out-base.txt`.
  - Nota: en R-11 el total de línea sale en `$` porque mi página sintética usa `data-money-format="x"`. Es un artefacto del harness: la barra copia el texto tal cual, que es justo lo que se espera.

## 5. Comprobaciones

- `node --check assets/theme.js`: OK. `node --check harness.cjs`: OK.
- Theme Check (`@shopify/cli` 4.8.0 del worktree, `theme check --output json`): `[]`, exit 0.
- Credenciales: el diff del commit no tiene tokens, claves ni dominios de tienda. La única URL es la línea `Claude-Session` del mensaje del commit, y el servidor local escucha en 127.0.0.1.
