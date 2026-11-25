# CLAUDE-R3-PLAN-R4-001: plan para dejar el tema y las tiendas demo listos para el Theme Store

```text
ID: CLAUDE-R3-PLAN-R4-001
Fecha: 2026-11-24 (análisis) y 2026-11-25 (decisión de Johandry y corrección de la secuencia)
Base analizada: rama claude/clever-gauss-ddhyr2 @ 62ce5ab (PR #23), temas Sartorial R3 190695473456, Archive R3 190695506224 e Imprint R3 190695538992
Estado: APROBADO por Johandry (D63 a D75). Ejecución: GPT (GPT-TASK-R4-001). Revisión: Claude.
```

## Nota previa: decisión de Johandry (2026-11-25)

Johandry respondió a este plan, presentado con las doce recomendaciones de la sección E, literalmente: «dale con las recomendaciones, pero no lo harás tu, lo hará gpt, entonces dale las instrucciones a gpt pero lo que si haras tu antes de eso es fusionar el #23».

Consecuencias, registradas en `docs/decisions.md` como D63 a D75:

1. Las doce recomendaciones E1-E12 quedan aprobadas tal como están escritas en la sección E (D63 a D74).
2. **Todo el trabajo de R4 lo ejecuta GPT**: código del tema, presets, scripts de catálogo y regeneración de la ZIP y del manifiesto. Claude fusiona antes el PR #23 y después revisa lo que entregue GPT (D75). El encargo es `agent-comms/inbox-gpt/GPT-TASK-R4-001.md`.
3. Donde el texto de abajo dice «Claude puede hacerlos ya» o «ejecutor: Claude», el ejecutor pasa a ser GPT. La sección D está reescrita con ese reparto; el resto del informe se conserva tal como se entregó.
4. Sigue sin respuesta si `sartorial-theme-kvkzl39t` es una tienda de desarrollo o client transfer (DP-024). El encargo funciona en los dos casos.

Datos posteriores al análisis:
- Los tres temas R3 se subieron a Shopify sin errores el 2026-11-24 **desde el código de `62ce5ab`** con `agent-comms/outbox-claude/harness-C-01-ID-001/build-export.mjs`, **no desde la ZIP**. Con ese dato, la fila «Schemas Válidos» del ledger pasa a `cumplido` (el motivo está en la propia fila). Responde así la primera duda de la sección F.
- Copias de las dos auditorías manuales en `docs/audits/R3/R3-AUDITORIA-MANUAL-QA.md` y `docs/audits/R3/R3-AUDITORIA-MANUAL-GPT.md`.

---

# Plan R3 → envío al Theme Store (análisis de solo lectura sobre `62ce5ab`)

No toqué nada: ni ediciones, ni commits, ni cambios de rama, ni llamadas a la tienda. Solo hice `git fetch` y `git show`, leí el código y consulté la documentación de Shopify con la búsqueda de shopify.dev.
- **[código]** = lo comprobé leyendo el repositorio.
- **[informe]** = lo tomo de las auditorías.
- **[doc]** = está confirmado en shopify.dev.

## 0. Lo que cambia el plan

1. **[doc] Una tienda demo de desarrollo no sirve.** La página "Dev stores for themes" dice literalmente: *"For a Shopify Theme Store listing, build the demo store as a client transfer store instead. You can't use a dev store as a Theme Store demo store."*
   - Requisitos 20 y Listing: "For each preset, provide a link to a complete and fully functioning demo store that uses that preset".
   - Además: "Each demo store must match the primary industry and catalog size…" y "Bogus Gateway or Shopify Payments test mode enabled, and all other checkout options disabled".
   - Una tienda solo tiene un tema publicado. En la práctica hacen falta **3 tiendas de tipo *client transfer*, cada una con su preset publicado**.
   - No sé de qué tipo es `sartorial-theme-kvkzl39t`: `SETUP-TIENDA-NUEVA.md:31` habla de "tienda de desarrollo". Si lo es, solo vale para QA, y todas las mutaciones de catálogo hay que **escribirlas como scripts que se puedan repetir** sobre las tiendas nuevas.
   - Esto es DP-006 y es el bloqueante número uno.
2. **[doc] El contenido "de onboarding" está prohibido:** "All demo store pages must use authentic text content. Don't use Lorem Ipsum or onboarding text."
   - "Replace this text…" entra de lleno.
   - El CP-27 propuesto ("This store is used to preview the theme. The articles here are examples.") también es meta-texto y no lo resuelve.
3. **[doc] La ficha tiene dos requisitos explícitos:** "Variant images must be shown when the associated variant is selected" y "All product images must be displayed and viewable".
4. **[doc] Paridad de instalación:** "On install, the theme should match the demo store's look… Layout and color/typography settings must match the demo… Demo imagery doesn't transfer on install."
5. **[código] La fila 120 del ledger está obsoleta.** `docs/requirements-ledger.md:120`, "3 Tiendas Demo Auténticas", figura `cumplido` con IDs de tema antiguos, y lo contradicen las dos auditorías. Viola la compuerta 1.

## A. Inventario unificado

Fuentes:
- **G** = GPT-R3-MANUAL-BROWSER-AUDIT-001 (copia en `docs/audits/R3/R3-AUDITORIA-MANUAL-GPT.md`).
- **C#** = QA-MANUAL-R3, en `origin/qa/r3-manual-audit:agent-comms/outbox-claude/QA-MANUAL-R3.md` (copia en `docs/audits/R3/R3-AUDITORIA-MANUAL-QA.md`).
- **T** = `tests-r3-20261124/INFORME.md` y §13 de `CLAUDE-R3-IMPL-001.md`.

Presets: S = Sartorial, A = Archive, I = Imprint.

| ID | Hallazgo | Fuentes | Presets | Severidad (por qué) | Causa |
|---|---|---|---|---|---|
| M-01 | No hay una tienda demo por preset con ese preset publicado; la tienda actual quizá es de desarrollo | [doc], DP-006, D38 (prohíbe publicar) | 3/3 | **Bloqueante**: requisito explícito del envío | DECISIÓN PENDIENTE + TIENDA |
| M-02 | Texto de onboarding y de demo visible: "Replace this text…" en 20 productos, vendor "Studio Demo" en 31, artículos "Welcome to the demo store" y "A very long article title used to test…", autor "Demo store", etiqueta `test`, "This is a gift card for the store" | G fila 5, C5 | 3/3 | **Bloqueante**: requisito explícito, no Lorem/onboarding | CATÁLOGO |
| M-03 | Productos "Fixture …" visibles en colección, búsqueda predictiva y "recently viewed"; colecciones de prueba `empty-test` y `single-product-test` | C5 | 3/3 | **Bloqueante** (va con M-02): contenido no auténtico | CATÁLOGO |
| M-04 | Imprint promete objetos de escritorio y enseña prendas; Workspace enlaza a `/collections/all` | G fila 4, C2 | I | **Bloqueante para el listado de Imprint**: la demo debe coincidir con la industria etiquetada | PRESET + CATÁLOGO (faltan colecciones; 8 de 13 productos de Imprint en DRAFT según `created-products-imprint-archive.json`; colisión `structured-tote`) |
| M-05 | La imagen no sigue a la variante (Doppio Stone, Slip Black, Paperweight Dark patina, Serra Ink) | G filas 1-3, C6 | 3/3 | **Bloqueante**: requisito explícito y prueba estándar del checklist | CATÁLOGO (`featured_image: null` en todas las variantes) |
| M-06 | En escritorio (stack, grid, split_screen) el medio de la variante no se lleva a la vista: solo recibe un borde de 1 px | diagnóstico §3 | 3/3 (S usa split_screen; A e I usan grid) | **Bloqueante** una vez corregido M-05: el revisor elige Stone y arriba no cambia nada | CÓDIGO |
| M-07 | Placeholders SVG o bloques lisos en hero, lookbook, manifesto, promos del mega menú, teselas de I y portadas del blog | C4 | 3/3 | **Bloqueante**: la demo debe estar "complete" | TIENDA (imágenes "pending Johandry" en `docs/demo-import/*-photos.csv`) + PRESET u overlay |
| M-08 | Featured product y complete the look no se ven en ningún preset | C1 (corregido en la segunda pasada) | S, I; A solo featured | **Alta**: dos funciones vendibles invisibles en la portada | PRESET (`product: ""`) |
| M-09 | Las pestañas curadas muestran lo mismo: todas apuntan a `collection: "all"` | C2, G fila 4 | 3/3 | **Alta**: parece roto | PRESET (+ CATÁLOGO en I y A) |
| M-10 | N1: "Add to cart" queda fuera de pantalla en escritorio bajo (~<740 px de alto), aproximadamente a lo largo de 8.500 px de scroll | C N1 | 3/3 | **Alta**: compra no visible en portátiles de 1366×768 o con escala del 125 %; no lo pide literalmente ningún requisito | CÓDIGO |
| M-11 | Con Canadá (geolocalización) todo sale "Sold out" y los precios bajan un 5 % | C16 (no verificado en la 2.ª pasada) | 3/3 | **Alta, bloqueante si se confirma**: la sede de Shopify está en Canadá y el revisor podría ver la tienda agotada | TIENDA (mercados e inventario) |
| M-12 | Pasarela Bogus o Shopify Payments en modo test sin verificar (T: sin proveedores de pago; el cajón no pinta botones acelerados) | [doc], T §2 | 3/3 | **Bloqueante hasta verificarlo**: requisito explícito | TIENDA |
| M-13 | El chevron del selector de país pisa "Update preferences" | C3 | 3/3, todas las páginas | **Media**: visible en todas partes | CÓDIGO |
| M-14 | Title Case y jerga: "New Arrivals" y "Capsule Wardrobe" (`sections/header-group.json:33,37`, compartido por los 3 presets: Imprint muestra "autumn edit"), "Archive Entries", "Curated Archival Garments", "Studio Modular Systems", "MEMBRANE TELEMETRY", "BLUEPRINT ANALYSIS", "SYSTEM INVENTORY"; logo de texto "Sartorial Theme" (nombre de la tienda) en los 3 | C14 | 3/3 | **Media**: copy de la demo | PRESET (+ falta `listings/<p>/sections/header-group.json`) + TIENDA (nombre) |
| M-15 | Featured product oculta en escritorio las imágenes desde la 6.ª | T L5, decisión 1 | 3/3 | **Media**: choca con "all images viewable" si el revisor lo aplica a la sección | CÓDIGO + DECISIÓN |
| M-16 | N2: la búsqueda de la cabecera se abre con el término anterior y el cursor en 0 ("tailoringsize") | C N2 | 3/3 | **Baja**: molesto, no bloquea | CÓDIGO |
| M-17 | 404: placeholder cortado a 1440-1536 y rótulo "Popular pieces / Continue exploring" | C10, T L5 | 3/3 | **Baja** | CÓDIGO + copy |
| M-18 | La tarjeta regalo muestra el acordeón "Care" | C11 | 3/3 | **Baja**: lo vería un revisor que prueba la tarjeta regalo | PRESET (plantilla) + CATÁLOGO (asignar plantilla) |
| M-19 | Búsqueda predictiva: la etiqueta "COLLECTIONS" se repite en cada resultado | C7 | 3/3 | **Baja**: cosmético. El `role="presentation"` del h2 es correcto (hijos de un listbox), no es defecto | CÓDIGO |
| M-20 | El cajón vacío deja visible "Removed … 0 items" | C13 | 3/3 | **Baja** | CÓDIGO |
| M-21 | El cajón no tacha el compare-at | C12 | 3/3 | **Baja**: solo tacha descuentos del carrito, igual que Dawn; ningún requisito lo pide | CÓDIGO → residual |
| M-22 | `/cart`: el "+" no recalcula hasta "Update cart" | C8 | 3/3 | **Baja**: es un formulario, coherente con D55 | residual |
| M-23 | `/search?q=` sin `type` marca "Products" | C9 | S | **Baja / no es del tema**: desde la cabecera se envía `type=product,collection,page,article`. Solo pasa con una URL tecleada a mano | no reproducible como defecto |
| M-24 | El botón de la tarjeta está oculto hasta hover y deja 44 px en blanco | C15 | 3/3 | **Baja**: diseño deliberado sin CLS; en táctil se ve | CÓDIGO (por diseño) → residual |
| M-25 | M1: sin JS, el botón de compra sigue activo con una variante agotada | T M1 | 3/3 | **Baja**: sin JS no es un recorrido del revisor | DECISIÓN → aceptar |
| M-26 | La tarjeta regalo cuenta para la barra de envío gratis | T L5 | — | **Baja** | DECISIÓN → dejar |
| M-27 | L2: `/blogs/news?page=2` dice "No essays have been published yet." | T L2 | 3/3 | **Baja** | CÓDIGO (`sections/main-blog.liquid:184-185`; en el análisis se citó `:188`) |
| M-28 | L5: "0 suggestions available" y "No suggestions yet. Press enter…" | T L5 | 3/3 | **Baja**: copy | CÓDIGO / locale + aprobación D35 |
| M-29 | Fila 120 del ledger obsoleta; "Schemas Válidos" sigue en `código completo` aunque los 3 temas R3 subieron | [código], T §13.4 | — | **Media**: compuerta 1 | DOCUMENTACIÓN |
| M-30 | Pérdida del preset al navegar y carrito compartido; aviso de escritura en portapapeles | G (pendientes), C (entorno) | — | no es defecto | HERRAMIENTA (mismo perfil de Chrome; la previsualización va por navegador) |
| M-31 | Desborde de `/cart` en Archive | C (no reproducido) | A | no es defecto | HERRAMIENTA |
| M-32 | Cobertura pendiente: teclado completo en móvil, A e I; táctil real; lector de pantalla; reproducción de vídeo; ancho exacto de 1440 en Chrome | G, C §3, T §8 | 3/3 | condición de cierre de la compuerta 5 | AUDITORÍA FINAL |

## B. Verificación en el código

Los números de línea son de `62ce5ab`.

**N1 (M-10): CONFIRMADO.**
- Sticky en escritorio en `assets/base.css:5116-5119` (`.product-main__details {position: sticky; inset-block-start: var(--space-4)}` dentro de `@media (min-width: 62rem)` de `:5023`). El `top` lo sobrescriben `:9081-9084` (`calc(var(--header-offset) + var(--space-4))`) y `:10740-10743` (split_screen).
- No hay ni `max-height` ni comprobación de altura. Si la columna mide 880-900 px, más el top de unos 101 px, no cabe en menos de unos 1.000 px.
- Con `align-items: start` (`:5108`) la columna se queda pegada y su parte baja es inalcanzable hasta el final de la galería.
- Agravante comprobado: la barra fija de compra sí está activa en los 3 presets (`enable_sticky_cart: true`, `listings/*/templates/product.json:81/92`). Pero solo aparece cuando el botón principal sale **por arriba** (`assets/theme.js:1753-1757`: `!entry.isIntersecting && boundingClientRect.bottom <= 0`). Con la columna pegada, el botón queda **por debajo** de la ventana, así que la barra nunca sale. Fallan los dos mecanismos a la vez.
- El mismo patrón está en featured product (`base.css:1399-1401`, `:9083`).
- Temas de referencia: de memoria, Dawn usa `position: sticky; top: 3rem` detrás de un ajuste y no comprueba si cabe. No lo consulté, no lo cito como verificado.
- Arreglo mínimo propuesto: **sticky solo si cabe**.
  - El CSS aplica `position: sticky` únicamente con `[data-sticky-fits]`.
  - Un helper pequeño con `ResizeObserver` sobre la columna, más `resize`, pone el atributo cuando `offsetHeight + header-offset + 16 <= innerHeight`.
  - Sin JS, la columna va en flujo normal y el botón se alcanza haciendo scroll.
  - Cuando no cabe, el botón sale por arriba al bajar y la barra existente toma el relevo sin cambiar su lógica.
- Descarto:
  - `max-height` con `overflow-y: auto` (el patrón de `.facets` en `:9086-9093`): crea scroll anidado y el botón seguiría oculto al hacer scroll sobre la galería.
  - Una media query de altura: la altura depende del contenido.

**N2 (M-16): CONFIRMADO en el código; el comportamiento del cursor lo tomo del informe.**
- El valor sale de Liquid: `snippets/predictive-search.liquid:85` (`value="{{ search.terms | escape }}"`).
- Al abrir, `setOpen(true)` llama a `trapFocus(this.panel, this.input)` (`assets/theme.js:5981`), que hace `focus()` en un `requestAnimationFrame` (`:86-89`) sin tocar la selección. En Chrome el cursor queda en 0, que es lo que midió el auditor (`selectionStart = 0`).
- Además relanza la petición para el término anterior (`:5986`).
- Arreglo mínimo: tras abrir, `requestAnimationFrame(() => { if (this.isOpen && document.activeElement === this.input) this.input.select(); })` (el rAF se ejecuta en orden, después del foco). Así escribir sustituye el texto y las flechas lo conservan.
- Alternativa: quitar el `value` de la línea 85, aunque se pierde el contexto en `/search`.

**C1 (M-08): CONFIRMADO, causa de preset.**
- `listings/sartorial/templates/index.json:90` y `:100-102`, `listings/archive/templates/index.json:113` y `listings/imprint/templates/index.json:125,135-137` tienen `"product": ""`.
- Las condiciones de render solo dibujan sin producto dentro del editor:
  - `sections/featured-product.liquid:46`: `{%- if featured_product != blank or request.design_mode -%}`.
  - `sections/complete-the-look.liquid:75`: `rendered_item_count > 0 or request.design_mode`.
- Los handles (`serra-coat`, `nove-blazer`…) se quitaron a propósito en `d527a05` (2026-11-18, "demo product handles … removed") siguiendo la regla de `docs/demo-store/README.md:57-68`, "demo = instalación limpia".
- `README.md:26` (en el análisis cité `:30`) sigue diciendo que Sartorial usa `serra-coat` en `:90`: es documentación obsoleta (corregida en este commit).
- El código es coherente con D47 (los placeholders solo en el editor). No hay defecto de código.

**C15 (M-24): PARCIAL; el código es correcto por diseño.**
- `assets/base.css:2108-2124`: `opacity: 0` hasta `:hover` o `:focus-within`, solo bajo `@media (hover: hover) and (pointer: fine)`, y solo con `data-animations` subtle o full (los presets usan `full`).
- El espacio se reserva a propósito para no provocar CLS (comentario en `:2104-2107`). En táctil la regla no aplica y el botón se ve; con teclado, `:focus-within` lo muestra.
- El "solo una tarjeta con Choose options" de la primera pasada no encaja con el código, porque `snippets/product-card.liquid:377-378` lo pinta siempre que `show_quick_add` está activo. Lo atribuyo al panel integrado.
- Cumple en táctil a nivel de código; no se ha probado en un dispositivo real.

**Galería de escritorio con variante (M-06): CONFIRMADO.**
- `ProductGallery.connectedCallback` (`theme.js:551-557`): en cualquier layout distinto de thumbnails solo se monta el carrusel.
- `goToSlide` (`:748-749`) retorna si `carouselQuery` (`:627`, `max-width: 61.99rem`) no coincide.
- `VariantSelects.updateMedia` (`:1472-1482`) solo cambia `data-selected`, y el CSS lo pinta como borde de 1 px (`base.css:1198-1204`).
- El orden de Liquid es el del producto (`sections/main-product.liquid:84-88`). Por eso, incluso al cargar `?variant=` con medio asociado, la primera imagen es la del producto, también sin JS.
- Thumbnails sí funciona (`selectMedia`, `:771-786`). Móvil sí funciona (`:650-658`).
- Arreglo propuesto (patrón de Dawn):
  1. En Liquid, pintar primero `selected_variant.featured_media` en los layouts que no son thumbnails. Hay que tener cuidado con `zoom_position` (`:110-116`): debe seguir indexando `zoom_images` en el orden del producto, y con `forloop.first` y la regla de span de la primera imagen (`base.css:9162`).
  2. En JS, con `theme:variant-change` en escritorio, mover la figura seleccionada al inicio del track, recalcular `this.slides` y hacer `scrollIntoView` solo si la galería está fuera de la vista, respetando reduced motion.
- No uso `order: -1` (lo que hace featured-product en `base.css:10838-10840`), porque rompe la regla "focus order = DOM order".

**Otros hallazgos verificados en el código:**
- **C3 / M-13 CONFIRMADO:** el `::after` de `.localization-form__country-wrapper` (`base.css:7628-7639`, `inset-inline-end: .35rem`) se coloca al final de un wrapper que contiene el select **y** el botón (`snippets/localization-selectors.liquid:78-94`). Solo se anula sin JS (`:7673`).
- **C7 / M-19 CONFIRMADO:** `theme.js:6245-6253` (`createTextResult` repite `heading`).
- **C10 / M-17 CONFIRMADO:** `base.css:7364-7368` pone `.main-404__search-row` en `repeat(2, 1fr)`; el campo y el botón miden lo mismo. `.main-search__query-row` sí se corrige a `minmax(0,1fr) auto` en `:7396`. El rótulo viene de `locales/en.default.json:431`.
- **C11 / M-18 CONFIRMADO:** `templates/product.json:57-61` y los de los presets incluyen `composition_care`; no existe `product.gift-card.json`.
- **C12 / M-21 CONFIRMADO:** `sections/cart-drawer.liquid:283-288` solo compara `original_line_price` con `final_line_price`.
- **C13 / M-20 CONFIRMADO:** `announceRemoval` (`theme.js:3909-3918`) añade el contador a una región visible (`cart-drawer.liquid:121`).
- **C9 / M-23 NO REPRODUCIBLE desde la cabecera:** `theme.js:6268-6273` y `predictive-search.liquid:113` envían `type`.
- **M1 / M-25 CONFIRMADO:** `snippets/variant-no-js-select.liquid:192` no deshabilita la opción agotada.

## C. Paquetes de trabajo

Ejecutor: **GPT** (D75). El detalle operativo está en `agent-comms/inbox-gpt/GPT-TASK-R4-001.md`.

### Código: sin tocar la tienda

| Paquete | Archivos | Hallazgos | Enfoque | Tamaño / riesgo | Verificación |
|---|---|---|---|---|---|
| **C1 Ficha y featured product** (prioridad 1) | `assets/theme.js` (ProductGallery `:551-760`, helper sticky nuevo), `assets/base.css` (`:5116-5119`, `:9081-9084`, `:10739-10743`, `:1399-1401`, `:10787-10791`), `sections/main-product.liquid:84-125` | M-06, M-10, M-15 (D63) | Sticky solo si cabe; el medio de la variante va primero en Liquid y se mueve al principio en escritorio; quitar la regla que oculta desde la 6.ª imagen | **M** / medio: índices del carrusel, span de la primera imagen, LCP (`forloop.first`), mapeo del zoom | Playwright con `setContent` y CSS/JS reales (patrón de `tests/r3-layout.spec.mjs`): 1440×674 y 1536×674 sin sticky y la barra aparece al bajar; 1440×1100 con sticky; `theme:variant-change` con `featured_media_id` pone la figura primero en 1440 y mantiene el índice en 390; zoom con el índice correcto; sin JS, `?variant=` pinta su medio primero. `gates:static`. En los 3 temas: Doppio Stone, Slip Black y Paperweight Dark patina **una vez asociados los medios** |
| **C2 Cabecera, búsqueda y cajón** | `assets/theme.js` (PredictiveSearch `:5960-5990`, `:6245-6253`; cajón `:3909-3918`), `snippets/localization-selectors.liquid:78-94`, `assets/base.css:7621-7680` | M-16, M-13, M-19, M-20 | `select()` al abrir; el chevron va en un envoltorio propio del select; quitar la etiqueta repetida; contador visualmente oculto o sin "0 items" cuando el carrito queda vacío | **S** / bajo | Tests: el cursor y la selección al abrir con un valor; la caja del chevron no se solapa con el botón a 1440 y 1536; una sola etiqueta por grupo; región de estado con el carrito vacío. Comprobación visual en los 3 temas |
| **C3 Menores en Liquid, JSON y CSS** | `assets/base.css:7364-7368` (o una regla propia de la 404), `sections/main-404.liquid`, `locales/*.json` (rótulo de la 404, aprobado en D66, y L5 si se aprueba el copy), `templates/product.gift-card.json` (nuevo, sin `composition_care`), `sections/main-blog.liquid:184-185` | M-17, M-18 (plantilla), M-27, M-28 | Columnas `minmax(0,1fr) auto`; plantilla propia para la tarjeta regalo; mensaje de página fuera de rango | **S** / bajo | Test de ancho del campo a 1440; Theme Check; `gates:locales` |
| **C4 Copy de presets sin depender de la tienda** | `listings/*/templates/index.json` y `collection.json`, `listings/<p>/sections/header-group.json` (nuevos, para el mega menú de cada preset) | M-14 (parte del preset) | Sentence case y fuera la jerga (con aprobación D35) | **S** / bajo | `gates:json`; prueba de importación |
| **C5 Documentación** | `docs/requirements-ledger.md` (fila 120 y Schemas Válidos), `docs/demo-store/README.md:26,53,57-68`, `docs/decisions.md` y `decisions-pending.md` | M-29, registro de E | Bajar la fila 120 a `no verificado`; Schemas Válidos a `cumplido` | **S** | `gates:ledger`. **Hecho por Claude en el commit de este plan**, que entra en el PR #23 |

Paralelismo:
- C1 y C2 comparten `theme.js` y `base.css`. Se pueden hacer a la vez en ramas distintas porque tocan zonas separadas, pero es más seguro en serie, primero C1.
- C3 solo comparte `base.css` en una zona aparte.
- C4 no comparte archivos con ningún otro y se puede paralelizar del todo.

### Preset: depende de que haya datos en la tienda (P1)

Objetivo: dar productos a featured product y complete the look, colecciones a las pestañas e imágenes a hero, lookbook, manifesto y mega menú.
- S: `serra-coat`, el trío de complete the look, las colecciones `new-forms`, `permanent-collection` y `tailoring`.
- I: `daily-objects`, `desk-and-study` y `leather-goods` con objetos.
- A: `permanent-archive` y `restored-pieces`.

Dos vías (decisión E8):
- **(A, recomendada y aprobada en D70):** la ZIP no cambia (respeta README y D47). Se guarda un overlay por preset fuera de la ZIP (`docs/demo-store/overlays/<preset>/templates/index.json` y `sections/header-group.json`) y se aplica al tema de cada demo tras subirlo.
- **(B):** meter los handles en `listings/`. La ZIP sería igual a la demo, pero en una instalación ajena podría enlazar productos homónimos del comerciante.

Las dos dejan la misma instalación: featured product oculto fuera del editor. Ese riesgo de paridad lo acepto como residual.

### Catálogo y tienda (T1-T4)

Ejecutor de T1-T3: GPT, **con scripts repetibles en `docs/demo-store/scripts/`** (D68). Johandry hace a mano T4.

**T1, tienda actual (QA) y después cada tienda client transfer:**
1. Asociar medios a variantes. Los IDs ya están localizados:
   - doppio-trench: Stone→46295776985392, Black→46295776231728.
   - bias-cut-slip-dress: Black→46295764566320, Champagne→46295763222832.
   - milled-brass-paperweight: Natural brass→46297531056432, Dark patina→46297600819504.
   - Todavía hay que identificar los de Serra Coat (Ink/Camel) y los del resto de productos con color o acabado.
2. Reescribir las descripciones: quitar "Demo product… Replace this text…" (CP-24) y redactar texto auténtico.
3. Cambiar el vendor "Studio Demo" por una marca ficticia propia de cada preset en los 31 productos.
4. Renombrar los "Fixture …" con nombres auténticos que mantengan sus características (120 caracteres, 40 variantes, 3D/vídeo) (D74).
5. Blog:
   - Reescribir "Welcome to the demo store" y el de tallas con texto editorial real; CP-27 tal como está no basta.
   - Despublicar el artículo de título largo de prueba.
   - Autor real y etiquetas sin `test`.
6. Quitar del canal Online Store las colecciones `empty-test` y `single-product-test`.
7. Cambiar el texto de la tarjeta regalo y asignarle la plantilla `gift-card` (cuando exista C3).

**T2, Imprint (en su propia tienda):**
- Activar los 8 productos de Imprint que están en DRAFT, con inventario.
- Crear las colecciones `daily-objects`, `desk-and-study` y `leather-goods` según `docs/demo-import/data/imprint.json`.
- Resolver `structured-tote`: en la tienda actual ganó el bolso del kit (`skipped: "structured-tote (already existed)"`). En una tienda propia de Imprint, importar la versión de Imprint.
- No importar prendas en la tienda de Imprint.

**T3, Archive (en su propia tienda):**
- Activar los 8 productos en DRAFT.
- Crear `permanent-archive` y `restored-pieces`.

**T4, solo Johandry:**
- Crear 3 client transfer stores.
- Nombre de cada tienda, que es también el logo de texto.
- Bogus Gateway activado y el resto de métodos de pago desactivados.
- Mercado de Canadá: que venda, o retirarlo.
- Subir las imágenes de tema y de producto, con derechos acreditados (Burst o las de GPT, D37); la fuente queda pendiente en DP-025.
- Publicar un preset por tienda (autorizado en D69).

**Dependencia de DP-006 (decidida en D67) y DP-024:** si la tienda actual es de desarrollo, T1 sirve para validar los scripts y M-06 en QA. T2 a T4 tienen que esperar a las tiendas nuevas.

### Residuales propuestos (aceptados con E2, E3 y el resto del plan)

- M-21 (como Dawn; no es requisito).
- M-22 (formulario; D55).
- M-23 (no es del tema).
- M-24 (diseño sin CLS; en táctil se ve).
- M-25 (sin JS; D64).
- M-26 (D65).
- M-30 y M-31 (herramienta).
- Paridad de instalación de featured product y complete the look ocultos sin producto (coherente con D47).

## D. Secuencia hasta el envío (corregida el 2026-11-25: ejecuta GPT, revisa Claude)

1. **Hecho, 2026-11-25:** Johandry aprueba E1-E12 (D63 a D74) y asigna R4 a GPT (D75). **Pendiente de Johandry:** confirmar el tipo de `sartorial-theme-kvkzl39t` en el Dev Dashboard (DP-024) y elegir la fuente de imágenes (DP-025).
2. **Claude, PR #23:** añade solo documentación (C5, este plan, el encargo de GPT y las copias de las auditorías) en un commit de `claude/clever-gauss-ddhyr2` y fusiona el PR #23 en `master`. No entra código: los archivos del tema de `62ce5ab` son idénticos a los de `b6994d8`, de donde salió la ZIP `604be3d3…`, y la documentación no viaja en la ZIP.
3. **GPT, R4 (PR en borrador contra `master`, rama `gpt/r4-…`, creada después de la fusión del #23):**
   - Hace C1, luego C2 y C3, y C4 cuando quiera, porque no comparte archivos.
   - Ejecuta `gates:static` y Playwright después de cada paquete.
   - Escribe los scripts T1-T3 en modo de prueba en seco y los overlays P1.
   - Al final regenera **una sola vez** la ZIP y `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt` sobre su HEAD ya commiteado.
   - Sube 3 temas «R4» sin publicar a la tienda de QA desde esa revisión y comprueba que Shopify no rechaza nada.
   - Entrega en `agent-comms/outbox-gpt/`.
4. **GPT, en paralelo con el paso 3 y solo si tiene credenciales:** ejecuta T1 en la tienda de QA, empezando por un único producto y con lectura de verificación. Es entonces cuando M-06 se prueba de verdad, con medios ya asociados. Sin credenciales, deja los scripts probados en seco y se lo dice a Johandry.
5. **Claude revisa el PR de R4:**
   - Diff.
   - Las 5 compuertas.
   - Filas del ledger que GPT declare.
   - Tests que fallen sin el cambio (con `R3_THEME_JS` y `R3_BASE_CSS` apuntando al asset anterior) y pasen con él.
   - Reproducción de la ZIP y del manifiesto.
   - Pide correcciones si hace falta. Johandry aprueba el copy nuevo (D35). Después se fusiona.
6. **Tiendas client transfer (D67):** Johandry hace T4. GPT, o quien Johandry indique, ejecuta los scripts T1-T3 en cada tienda, sube la ZIP de R4, aplica el overlay de su preset y Johandry publica el preset (D69).
7. **Si la auditoría final obliga a tocar código:** otra ronda de GPT, nueva ZIP y manifiesto, y volver a subir a las 3 tiendas. La ZIP enviada debe ser exactamente la que esté publicada ("Use the latest version of your theme in your demo store").
8. **Auditoría final repetida:**
   - Las dos auditorías manuales completas, ahora sobre las URLs publicadas de cada tienda.
   - Escritorio a 1366×768, 1440×900 y 1536×674; móvil a 390 con un **dispositivo táctil real**.
   - Teclado completo, lector de pantalla, vídeo y 3D, variante e imagen, y país Canadá.
   - Sin compartir navegador: cada auditor con su propio perfil de Chrome o máquina (o ventana de invitado), **nunca a la vez** sobre la misma tienda, y comprobando `Shopify.theme.name` en cada página.
   - Después: capturas para el listado (escritorio 1000×1248 o 2000×2496, móvil 750×1334) y envío.

## E. Decisiones del usuario (recomendación; todas aprobadas el 2026-11-25)

1. Featured product muestra todas las imágenes en escritorio → **sí** (C1). → D63
2. M1: sin JS, el botón activo con una variante agotada → **aceptarlo** y documentarlo. → D64
3. La tarjeta regalo cuenta para el envío gratis → **dejarlo**. → D65
4. 404: placeholder cortado y rótulo → **corregir** el CSS y cambiar el rótulo a "Popular pieces" (copy D35). → D66
5. DP-006 → **3 client transfer stores, una por preset**; la actual queda como QA. → D67
6. Autorizar las mutaciones de catálogo T1-T3 → **sí, como scripts repetibles**. D38 ya las cubre en la tienda actual; hay que extenderlo a las tiendas nuevas. → D68
7. Autorizar la publicación de un tema por tienda demo, más el mercado de Canadá y el pago Bogus → **sí** (hoy D38 prohíbe publicar). → D69
8. Resource picks de la demo → **overlay fuera de la ZIP (vía A)**. → D70
9. Los arreglos de código, ¿en el PR #23 o en uno nuevo? → **PR nuevo (R4)**; #23 se fusiona con solo documentación. → D71
10. Copy (CP-24, CP-27, M-14 y L5) → aprobar **texto editorial auténtico**, no meta-texto. → D72
11. Fuente y derechos de las imágenes de tema → decidirlo ya, porque es la ruta crítica de M-07. → D73 (la elección concreta sigue abierta en DP-025)
12. Productos "Fixture" → **renombrarlos con nombres auténticos** (manteniendo los casos límite) mejor que ocultarlos. → D74

## F. Lo que no pude verificar

- Si `sartorial-theme-kvkzl39t` es de desarrollo o client transfer (DP-024).
- Si Bogus Gateway está activo.
- El comportamiento real de Canadá.
- ~~Si los 3 temas R3 se subieron desde la ZIP `604be3d3…`.~~ Resuelto el 2026-11-25: se subieron desde el código de `62ce5ab` con `build-export.mjs`, no desde la ZIP (ver la nota previa y la fila del ledger).
- Las medidas reales de N1 y la posición del cursor de N2: confirmo la causa en el código, los números son del informe.
- C15 en un dispositivo táctil real.
- El código de Dawn y Horizon sobre sticky: no lo consulté.
- Si un revisor acepta las URLs `preview_theme_id`: la documentación pide "demo store that uses that preset", así que asumo que no.
- Si Shopify desaconseja handles de recursos en `listings/`: no encontré documentación explícita.
- El tipo de búsqueda por defecto de Shopify sin `type`.
- No ejecuté tests ni gates durante el análisis: era de solo lectura.
