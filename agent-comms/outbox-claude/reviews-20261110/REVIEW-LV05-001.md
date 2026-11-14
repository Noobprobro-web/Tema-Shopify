# REVIEW-LV05-001. Revisión independiente de LV-05 (D-03)

Fecha: 2026-11-10. Revisor: Claude (subagente, solo lectura).
Commit: `605459cf61849cdcf2e94aea092ecbf215d3f036`, rama local `task/lv05`, worktree `wt-lv05`.
Alcance del diff: `assets/base.css` +20 líneas (2040-2059). Ningún otro archivo. Árbol limpio tras la revisión (`git status --short` vacío).

## Veredicto

**ACEPTADO CON CONDICIONES.**

El cambio corrige LV-05 en todos los contenedores previstos, a 390 y 1280 px, sin tocar el DOM, el árbol accesible ni el orden de foco. Si el navegador no soporta `:has()`, la regla se descarta sin efectos. Theme Check da `[]`. Las condiciones son de precisión y de deuda adyacente, no de corrección del arreglo:

1. **C1 (P3, comentario o alcance).** El comentario de `assets/base.css:2043-2044` dice "Solo en rejillas de varias columnas", pero la regla también se aplica a las rejillas de una sola columna. Hay que corregir el texto o restringir el selector (ver 2.2).
2. **C2 (registro).** Hay que registrar el hallazgo nuevo NF-01 (swatches de texto superpuestos, ya presente antes de este commit) y anotar en el ledger que, cuando se corrija, hay que revisar LV-05, porque la reserva fija de 44 px dejará de coincidir (ver 2.3).
3. **C3 (registro).** Hay que documentar como límite conocido el desfase residual de unos 24 px cuando el vendor está presente en unas tarjetas y ausente en otras de la misma fila (ver 4).
4. Como exige el plan (v4.1:316 y :379), D-03 no se cierra con este arnés local. R-Demo tiene que aportar evidencia en la tienda real con los productos QA.

## 1. Hallazgo y alcance del plan

- El hallazgo de origen está en `agent-comms/outbox-claude/CLAUDE-AUDIT-THREE-THEMES-LIVE-001.md:248` (LV-05, P3). La fila de swatches va encima del título y los títulos no comparten línea base (50 px). La recomendación es "Reservar la altura de la fila de swatches o ponerla debajo del título". El commit aplica la primera opción.
- El plan `GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md:308` incluye LV-05 dentro de D-03, con el criterio "Títulos largos, con/sin swatches, estados vacíos y viewport estable". El commit toca solo LV-05 y no mezcla LV-02, LV-03, LV-21, LV-22 ni V-08, así que el alcance es correcto.
- El hallazgo también menciona "títulos con largos distintos". Esa diferencia desplaza el precio, no el inicio del título. Con la corrección todos los títulos arrancan a la misma altura, y el desfase del precio no forma parte de lo que pedía LV-05.
- Fuera de mi alcance: no puedo comprobar desde el repo si hubo directiva R-D previa a este turno (plan §6).

## 2. Corrección del CSS

### 2.1 Selectores y especificidad (`assets/base.css:2046-2058`)
- La especificidad es (0,5,1): `:is()` toma la mayor de su lista, `.product-grid:not([data-grid-columns='list'])`, que vale (0,2,0). A eso se suman `:has(.product-card__swatches)` (0,1,0), `.product-card__content` (0,1,0), `:not(:has(> …))` (0,1,0) y `::before` (0,0,1). No hay ninguna otra regla `::before` sobre `.product-card__content` con la que pueda competir. El único `__content::before` del archivo es `.hero-editorial__content::before`, en `base.css:8437`.
- La sintaxis es válida. Usar `:has()` dentro de `:not()` está permitido, y la regla no anida un `:has()` dentro de otro. Chromium 153 la parsea como una sola regla, comprobado en el CSSOM.
- `:has(> .product-card__swatches)` es relativo al hijo directo, y coincide con el marcado de `snippets/product-card.liquid:162-178`, donde `.product-card__swatches` es hijo directo de `.product-card__content`.
- El `::before` es un ítem más del grid `.product-card__content` (`base.css:1917-1920`, `gap: var(--space-1)`). Recibe el mismo hueco que recibiría la fila de swatches, y por eso la alineación medida es exacta: 50 frente a 50 px.
- Contenedores: verifiqué que cada clase existe en su sección. `.product-grid` en `sections/main-collection.liquid:311-313`, `.product-recommendations__grid` en `product-recommendations.liquid:33`, `.recently-viewed__grid` en `recently-viewed.liquid:32`, `.search-results-grid` en `main-search.liquid:285`, `.main-404__product-grid` en `main-404.liquid:39` y `.main-article__product-grid` en `main-article.liquid:76`. Son todos los `render 'product-card'` del tema salvo bento y curated.

### 2.2 Vistas no previstas
- **Bento** (`.bento-discovery__grid`, `sections/bento-discovery.liquid:31`) y **curated** (`.curated-showcase__supporting`, `sections/curated-showcase.liquid:119`) no reciben `::before`. La medición antes y después es idéntica: en bento el desfase sigue en 50 px a 1280, que es el comportamiento intencionado.
- La **vista de lista** (`data-grid-columns='list'`) queda sin cambios a 390 y 1280.
- **Rejillas de una sola columna (C1).** `.product-grid[data-grid-columns='2']` tiene una sola columna en móvil (`base.css:5054-5056`), y `.search-results-grid` no define columnas por debajo de su breakpoint (`base.css:6373-6377`). A 390 px las tarjetas sin swatches de esas dos rejillas reciben una franja vacía de 44 px que no alinea nada. Lo mismo ocurre en una fila final con una sola tarjeta, aunque ahí el ritmo vertical entre filas sigue siendo coherente. El efecto es cosmético y el resultado puede defenderse como ritmo uniforme, pero contradice el comentario y el mensaje del commit ("multi-column grid").

### 2.3 ¿Los 44 px equivalen a la altura real de los swatches?
- `--tap-target-min: 44px` se define una sola vez (`base.css:42`) y ningún preset, breakpoint ni `layout/theme.liquid:66-79` lo redefine. Las variables por preset son fuentes, escalas, ancho, gutter, spacing y radio, y Sartorial, Imprint y Archive tienen `body_scale` 100. `.card-swatch` y `.card-swatch-more` miden 44×44 (`base.css:2097-2107`). Los tamaños de los swatches están en px o rem y no dependen de `--font-body-scale`.
- La altura medida de la fila fue 44 px en todos los casos de color, de enlace y de texto, a 390 y 1280, de modo que la reserva coincide hoy.
- **NF-01 (nuevo, ya presente antes del commit, P2 provisional, fuera de LV-05).** `.card-swatch--text { width: auto }` (`base.css:2061-2066`) queda anulado por `.card-swatch { width: var(--tap-target-min) }` (`base.css:2097-2101`), que tiene la misma especificidad y aparece más abajo en el archivo. Cada botón de texto mide 44 px de ancho y su etiqueta (`.card-swatch__text`, hasta 8rem) se desborda y se superpone a las vecinas (captura `review-lv05/textMix-1280.png`, medidas: botón 44 px, etiqueta 115-128 px). Por eso los swatches de texto nunca bajan a una segunda línea y la reserva de 44 "acierta". Con esa precedencia corregida (lo simulé con `.product-card__swatches .card-swatch--text{width:auto}`), los nombres largos ocupan 2 o 3 filas (88 y 132 px) y el desfase vuelve a ser de 44-88 px tanto a 390 como a 1280. Quien corrija NF-01 tiene que revisar LV-05: por ejemplo, limitar la fila de swatches a una sola línea con desbordamiento controlado, o alinear con subgrid.

### 2.4 Fallback sin `:has()`
La regla es un único selector, sin lista, así que un navegador que no reconoce `:has()` descarta solo esta regla. Lo simulé renombrando `:has(` a un pseudo desconocido tanto en el CSS anterior como en el posterior, y la geometría de las 15 rejillas resultó idéntica a 390 y 1280 (`fallback identical: true`).

### 2.5 Rendimiento
Medí 1200 tarjetas (la mitad con swatches) en una rejilla de 4 columnas, con 30 iteraciones. En cada una cambiaba las columnas y alternaba la clase `.product-card__swatches` en una tarjeta para forzar la invalidación de `:has()`, con 3 reflows por iteración. La mediana fue de 72,8 ms antes y 75,6 ms después; el p90, de 91,2 frente a 103,3, con mucho ruido entre ejecuciones (en otra ejecución salió 99,0 frente a 89,3). Es un impacto despreciable. `:has(.product-card__swatches)` se evalúa en el contenedor y Blink cachea el resultado. `theme.js` no añade ni quita la clase `.product-card__swatches` en tiempo de ejecución, así que en uso normal no hay invalidaciones repetidas.

## 3. Accesibilidad
- `content: ''` no aporta nombre ni texto accesible. El `ariaSnapshot()` de `main` es idéntico antes y después a 390 y 1280.
- El orden de foco con Tab se mantiene idéntico: 109 paradas a 390 y 99 a 1280, todas por elemento, tarjeta y rejilla. El DOM no cambia.

## 4. Prueba propia con Playwright
Arnés escrito por mí: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/review-lv05/review.js`. Las salidas están en `run.log` y `results.json`, y las capturas en `{before,after}-{390,1280}.png` y `textMix-1280.png`. Leí el arnés del autor (`harness-lv05/run.js`) y no lo reutilicé. Solo cubre swatches de color y una rejilla de 4 columnas más la lista; no incluye texto, vendor, una sola columna, bento ni los otros contenedores.

Casos: color con 3 o 5 swatches, swatches de texto con nombres largos, swatches como enlaces (no interactivos), vendor en todas las tarjetas, vendor mezclado, sin swatches y títulos de 1 a 3 líneas. Las rejillas probadas fueron product-grid de 4 y de 2 columnas, lista, recs, recently viewed, search, 404, article, bento y curated.

Desfase máximo entre los inicios de los títulos de una misma fila (px):

| Caso | 390 antes | 390 después | 1280 antes | 1280 después |
|---|---|---|---|---|
| Color mixto | 50 | 0 | 50 | 0 |
| Texto mixto (con el CSS actual) | 50 | 0 | 50 | 0 |
| Texto mixto con NF-01 corregido | n/a | 88 | n/a | 44 |
| Vendor en todas | 50 | 0 | 50 | 0 |
| Vendor mezclado | 73,9 | 23,9 | 73,9 | 23,9 |
| Swatches como enlaces | 50 | 0 | 50 | 0 |
| Sin swatches | 0 | 0 | 0 | 0 |
| Recs, recently viewed, 404, article, search | 50 | 0 | 50 | 0 |
| Lista, curated | 0 | 0 (sin cambios) | 0 | 0 (sin cambios) |
| Bento | 0 | 0 (sin cambios) | 50 | 50 (excluido a propósito) |

El caso de vendor mezclado (C3) mejora, pero no queda alineado: la línea de vendor (23,9 px) sigue variando entre tarjetas. En Shopify el vendor rara vez está vacío, así que basta con documentarlo como límite.

## 5. Theme Check y credenciales
- `npm ci` en el worktree terminó con exit 0 y 0 vulnerabilidades. `npx shopify version` devuelve 4.8.0, y `npx shopify theme check --output json` devolvió `[]` con exit 0.
- No hay credenciales en el diff: busqué token, secret, password, api key, shpat_, shpss_, bearer y URLs sin ninguna coincidencia. El trailer `Claude-Session` del mensaje del commit no es una credencial.
- No hice commits ni push, y el árbol quedó limpio.
