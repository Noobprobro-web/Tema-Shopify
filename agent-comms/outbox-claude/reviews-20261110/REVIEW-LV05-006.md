# REVIEW-LV05-006. Verificación final de LV-05 (CN-6)

Fecha: 2026-11-10. Revisor: Claude (subagente, solo lectura).
Commit: `cfe8b4fcbfdb7e0556b1ef3fee88e3feef33a079` (task/lv05, worktree `wt-lv05`). El diff de la rama desde su merge-base con `lote-e-claude` toca `assets/base.css`, `docs/requirements-ledger.md`, `locales/en.default.json`, `locales/es.json`, `snippets/card-swatch-fit.liquid` y `snippets/product-card.liquid`.
No modifiqué el repo ni hice commit o push, y `git status --short` sale vacío. Mis archivos están en `scratchpad/review-lv05-006/`.

## Veredicto

**ACEPTADO.**

CN-6 queda cerrada. Con una fila de menos de 88 px, el total se anuncia una sola vez y solo para tecnología asistiva. Con 88 px o más ese texto desaparece y queda únicamente el "+N", así que nunca se duplican. Las traducciones existen en EN y ES, Theme Check da `[]`, el ledger registra CN-7 y R01, y no hay regresiones en lo verificado en las revisiones 001 a 005.

## 1. CN-6 con el Liquid real y el árbol accesible

- **Markup.** `snippets/product-card.liquid:304`: `<span class="visually-hidden card-swatch-count">` con `'products.product.swatch_count' | t: count: swatch_total`. Está oculto por defecto (`assets/base.css:2179`) y se muestra solo dentro de `@container card-swatches (width < 88px)` (`base.css:2188`).
- **Liquid real con liquidjs** (`render6.js`, con un filtro `t` que aplica las formas one/other): da "30 options available", "2 options available" y "1 option available", y en ES "30 opciones disponibles", "1 opción disponible". Las tarjetas sin swatches no llevan el span. Las 30 cadenas `data-swatch-fit` coinciden con el harness del autor, sin cambios desde la revisión 005.
- **Árbol accesible** (Playwright `ariaSnapshot`, `ax6.js` y `ax6b.js`), en cada tarjeta:

| Fila | Swatches visibles | "+N" en el árbol | "N options available" en el árbol |
|---|---|---|---|
| 40 px (forzada) | 0 (grupo `display:none`) | 0 | 1 |
| 70 px | 1 | 0 | 1 |
| 87 px | 1 | 0 | 1 |
| 88 px | 1 | 1 | 0 |
| 100, 148, 300 px | 1 a 4 | 0 o 1, según queden ocultos | 0 |

El total se anuncia una vez y nunca convive con el "+N". La altura de la fila sigue en 44 px en todos los casos y el título arranca a 50 px de la fila. A 70 px, Tab va del radio al título: el texto de conteo no recibe foco.

- **Locales.** `en.default.json` y `es.json` tienen `products.product.swatch_count.{one,other}` (`locales/*:405-408`). No hay más locales de storefront en el tema.

## 2. Regresiones (revisiones 001 a 005)

Ejecuté el arnés de la revisión 005 (`r5.js`) con el Liquid y el CSS de cfe8b4f: letra al 100/125/150 % y zoom al 200 %, a 320, 390 y 1280, más 768 al 100 % (`r5-768.js`). Resultados en `v6-r5.log`.

- La salida por tarjeta es **idéntica** a la de cd4461c en todas las condiciones (diff vacío). Se mantienen:
  - 0 solapes, 0 desbordes y objetivos de 44 px o más en las rejillas del alcance.
  - Títulos alineados (LV-05).
  - Tallas cortas con 4 piezas sin "+N" a 1280 (CN-3).
  - Nombres largos legibles con `title` y `aria-label` (CN-1).
  - Ningún scroll causado por los swatches (el mismo `scrollWidth` con y sin swatches).
- Persisten sin cambios los pendientes registrados: bento y curated con zoom (R01), y el desfase con vendor mezclado (V01).

## 3. Ledger, Theme Check y credenciales

- `docs/requirements-ledger.md:73` registra LV05-CN7 y `:74` registra LV05-R01, los dos como `ausente` y con la advertencia de que R01 se midió con aproximaciones de las secciones. `node scripts/ledger-verify.mjs` da 65 filas, 3 ausentes y "Incoherencias: 0".
- `npx shopify theme check --output json` (4.8.0) devuelve `[]` con exit 0 (`review-lv05-006/tc.json`).
- No hay credenciales: busqué token, secret, password, api key, shpat_, shpss_, bearer y URLs en las líneas añadidas de `lote-e-claude...cfe8b4f`, sin coincidencias.

## 4. Observación aparte (preexistente, no bloquea)

El `<span class="visually-hidden" id="SwatchSoldOut-…">Sold out</span>` (`product-card.liquid:307`) se renderiza siempre y aparece como texto suelto en el modo lectura, aunque ningún valor esté agotado. Cuando se muestra el conteo, el árbol junta los dos textos: "30 options available Sold out", y puede leerse como si la opción estuviera agotada. Ese span ya estaba antes de LV-05. Propuesta para otro lote: ponerle `hidden` (aria-describedby sigue funcionando con nodos ocultos) o renderizarlo solo cuando algún valor esté agotado.
