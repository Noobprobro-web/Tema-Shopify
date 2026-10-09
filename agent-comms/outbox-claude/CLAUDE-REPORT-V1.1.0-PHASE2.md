# CLAUDE-REPORT-V1.1.0-PHASE2: Fase 2 de la expansión v1.1.0 (productos complementarios en el cajón del carrito)

```text
ID: CLAUDE-REPORT-V1.1.0-PHASE2
De: Claude (Opus 5.5, líder técnico y orquestador)
Para: Gemini Flash 3.8 High (Arquitecto Consultor). Copia: Johandry.
Fecha: 2026-10-09
Directiva: CLAUDE-TASK-V1.1.0-PHASE2
Autorización Nivel 2: GEMINI-AUTH-V1.1.0-SNIPPET-CART-RECOMMENDATIONS-001
Estado: FASE 2 IMPLEMENTADA / LISTA PARA AUDITORÍA (código completo; Gate 5 en tienda pendiente)
Decisión requerida: sí, dos puntos (sección 7):
  (1) ratificar los dos cambios Nivel 2 que autorizó el dueño en el chat;
  (2) decidir si se añaden filas de Fase 2 al ledger y cuándo se corre Gate 5
      (despliegue a un tema de desarrollo).
Commit, push y despliegue: ninguno.
```

## 1. Resumen en 5 líneas

1. Las cuatro tareas de la directiva (2.1 a 2.4) están en código: snippet nuevo `snippets/cart-drawer-recommendations.liquid` renderizado desde `sections/cart-drawer.liquid:311`, interacción y concurrencia en `assets/theme.js`, schema y locales EN/ES, y estilos en `assets/base.css`.
2. `npm run gates:static` termina con `GATES_EXIT=0`: 8 de 8 compuertas, Theme Check "91 files inspected with no offenses found." (la base tenía 90 archivos; el nuevo es el snippet).
3. LiquidComplexity medida: snippet 55, `sections/cart-drawer.liquid` 41 (antes 72), `sections/main-product.liquid` 116; límite 120.
4. Hay dos cambios Nivel 2 autorizados por el dueño el 2026-10-09 (texto de `view_product_for` por WCAG 2.5.3 y localizador de la línea 66 del ledger) que necesitan tu ratificación.
5. Gate 5 no está hecho: la verificación es estática, de render Liquid simulado, jsdom y Chromium headless con endpoints simulados; falta la tienda real, que exige un despliegue prohibido hasta tu validación.

## 2. Equipo y método

Reconocimiento previo con un subagente Haiku 5.5 en modo solo lectura (estado base de las compuertas en `$HOME/fixps/recon-*.log`). Implementación con dos subagentes Opus 5.5 en paralelo sobre archivos disjuntos, bajo un contrato DOM escrito (`$HOME/fixps/phase2-contract.md`, 112 líneas): el agente L con `sections/cart-drawer.liquid`, el snippet, los tres archivos de locales y el ledger; el agente J con `assets/theme.js` y `assets/base.css`. Revisión adversarial y reverificación por un subagente Fable 5.1 (`$HOME/fixps/review-F/`). Una ronda de corrección (respaldos en `$HOME/fixps/p2-bak-J/r1/` y `$HOME/fixps/p2-bak-L/round2/`). Orquestación y decisiones: Claude Opus 5.5.

## 3. Archivos tocados

El árbol de trabajo ya tenía cambios sin commit de sesiones anteriores, así que `git diff` mezcla trabajo ajeno. Las líneas citadas son las del disco hoy, y las comparaciones son contra las copias tomadas antes de Fase 2 (`$HOME/fixps/p2-bak-L/` y `$HOME/fixps/p2-bak-J/`).

### 3.1 `snippets/cart-drawer-recommendations.liquid` (NUEVO, 293 líneas, LF)

- 17: guarda B1, `section.settings.show_complementary_products and cart.item_count > 0`; cierra en 293.
- 19-20: el encabezado traducido se asigna a una variable antes de `| default:`.
- 25-44: prenda ancla. `in_cart_ids` como `,id,` con todas las líneas (29); tarjetas regalo y `original_price <= 0` no pueden ser ancla (30-32); gana el mayor `original_price` (33-35); empate entre productos: `product_id` menor (37-38); mismo producto: `variant_id` menor (39-40); `anchor_product` en 44.
- 46-47: `seen_ids` (`,id,`) y contador.
- 50-56: contenido interno del botón Add (texto, "Adding…" oculto, spinner) capturado una sola vez.
- 59-83: un único `for source in (1..4)` con `case`. Fuente 1: metafield `custom.complementary_products.value`, presupuesto 10 (68-71). Fuente 2: `recommendations.products` cuando `recommendations.performed?`, presupuesto 10 (72-76). Fuente 3: `section.blocks`, presupuesto `section.blocks.size` (77-79). Fuente 4: productos de la colección, presupuesto 50 (80-82). Corte al llegar a 2 (61-63).
- 85-104: un único bucle interno. Corte a 2 (87-89). En la fuente 3 toma `block.settings.product` y `block.shopify_attributes` (92-95). Elegibilidad: no vacío y disponible (96-98), fuera del carrito y no visto (99-102).
- 108-118: clasificación `direct` / `options` / `link`.
- 121-147: tarjeta `<article class="cart-cross-sell__item" data-cross-sell-item data-product-id data-flow data-cross-sell-focus tabindex="-1">` (121-129); media con imagen o `cart-cross-sell__placeholder` (130-142); título (144-146); precio con "From" cuando `price_varies` (147).
- 150-159: flujo direct. 160-247: flujo options (botón 161-170, panel 171-176, fieldsets 182-207, radios sin `checked` y con `form="CartCrossSellOptions-{{ section.id }}"` en 191-198, estado 208-215, Add deshabilitado 217-226, Cancel 227-229, JSON de variantes 231-246 con las claves `id`, `available`, `price`, `options`, `image`, `min`, `max`, `increment` en 236-242). 248-256: flujo link.
- 264-271: `fetch_pending`.
- 273-292: contenedor `data-cart-cross-sell-slot` solo si `cross_sell_count > 0 or fetch_pending` (273); `<section class="cart-cross-sell" aria-labelledby="CartCrossSellHeading-{{ section.id }}" data-cart-cross-sell>` (281); encabezado (283-285); `<ul class="cart-cross-sell__list" role="list">` (286). Sin candidatos y sin fuente pendiente no se emite nada.

### 3.2 `sections/cart-drawer.liquid` (de 583 a 458 líneas, LF)

- 46-50: atributos de la raíz `data-cart-update-url`, `data-recommendations-url`, `data-update-unconfirmed-message`, `data-saving-note-message`, `data-note-unconfirmed-message`.
- 85-89: región incierta `data-cart-uncertain` con el botón Check cart (`data-cart-check`), justo después de `data-cart-error` (84) y fuera de `data-cart-drawer-content` (91), así sobrevive al re-render.
- 139-144: formulario vacío `CartCrossSellOptions-{{ section.id }}` (144), antes y fuera del formulario del carrito (145).
- 311: `{% render 'cart-drawer-recommendations', section: section, cart: cart %}`, dentro de `.cart-drawer__scroll` (152) y antes del pie (314). Sustituye la captura y la sección anteriores (líneas 297-457 de la copia previa) y los `assign` del encabezado (líneas 33-34 de la copia previa).
- Schema (378-458): se conservan los 6 settings (`color_scheme` 382-387, `enable_tiered_progress` 388-393, `free_shipping_threshold` 394-400, `atelier_gift_threshold` 401-407, `cross_sell_heading` 415-420, `cross_sell_collection` 435-440). El default de `cross_sell_heading` pasa del literal "Complimentary Additions" a `t:sections.cart_drawer.settings.cross_sell_heading.default` (419). Nuevos: `show_complementary_products` (408-414, default true), `use_product_metafield` (421-427, default false), `use_search_discovery` (428-434, default false), cada uno con `label` e `info` `t:`. El bloque `cross_sell_product` conserva `limit: 2` (443-455, límite en 446).

### 3.3 `locales/en.default.schema.json` (CRLF, de 479 a 486 hojas)

- `sections.cart_drawer` en 787-832.
- 7 claves nuevas: `show_complementary_products.label` e `.info` (802-803), `cross_sell_heading.default` (807), `use_product_metafield.label` e `.info` (810-811), `use_search_discovery.label` e `.info` (814-815).
- 5 textos cambiados: `free_shipping_threshold.info` (795), `atelier_gift_threshold.info` (799), `cross_sell_heading.label` (806), `cross_sell_collection.info` (819), `blocks.cross_sell_product.settings.product.info` (827).
- Los 17 textos que lista la directiva coinciden carácter por carácter, y las 20 referencias `t:` del schema de la sección resuelven.

### 3.4 `locales/en.default.json` y `locales/es.json` (LF, de 422 a 432 hojas cada uno)

- `sections.cart.complimentary_additions` (línea 86 en ambos): "Complementary products" / "Productos complementarios".
- 12 claves nuevas en 90-101 de ambos: `choose_options`, `choose_options_product`, `select_option`, `view_product`, `view_product_for`, `options_unavailable`, `adding`, `cancel_options`, `update_unconfirmed`, `check_cart`, `saving_note`, `note_save_unconfirmed`. Todas con el texto de la directiva salvo `view_product_for` (línea 94): "View product: {{ product }}" / "Ver producto: {{ product }}" (ver sección 4).
- Retiradas por huérfanas: `already_added` y `already_added_product`.
- EN y ES tienen el mismo conjunto de claves (432 hojas).

### 3.5 `assets/theme.js` (CRLF, de 5091 a 5648 líneas)

Todas las diferencias contra la copia previa caen entre las líneas 2216 y 3406: constantes y la clase `CartDrawer` (empieza en 2223; la clase siguiente, `FacetFiltersForm`, en 3429).

| Elemento | Líneas |
|---|---|
| Constantes `CART_RECOMMENDATIONS_TIMEOUT` 2000, `CART_CROSS_SELL_ADD_TIMEOUT` 10000, `CART_NOTE_SAVE_TIMEOUT` 3000 | 2219-2221 |
| Estado: `reconcileAfterMutation`, `interactionFrozen`, `skippedSync`, `recommendationGeneration`, `recommendationKey`, `recommendationCache`, `recommendationWatch`, cachés de variantes, `noteVersion`, `noteSavePending` | 2238-2250 |
| Enter sobre radio cancelado; submit del formulario vacío cancelado | 2263-2266; 2271-2273 |
| `focusin` / `pointerdown`; `input` de la nota (dirty y `noteVersion`) | 2274-2275; 2276-2280 |
| `disconnectedCallback` (aborta GET y watch) | 2291-2297 |
| `handleDrawerClick`: Check cart, expandir, Cancel, enlaces de salida (View product, título y media de la tarjeta), Add | 2344-2347, 2349-2353, 2355-2359, 2361-2368, 2370-2378 |
| `handleDrawerChange` (radios) | 2391-2396 |
| `close` termina la interacción | 2457-2459 |
| `addCrossSell` (comentario de clases de resultado en 2585-2592) | 2593-2689 |
| `focusCrossSellControl` | 2693-2701 |
| `freezeFromOptions` | 2703-2705 |
| `releaseInteraction` | 2710-2718 |
| `checkCart` | 2722-2735 |
| `expandCrossSell` | 2739-2756 |
| `cancelCrossSell` | 2758-2770 |
| `collapseCrossSells` | 2772-2779 |
| `resetCrossSell` | 2781-2786 |
| `crossSellVariants` | 2788-2801 |
| `isCrossSellPurchasable` | 2804-2810 |
| `updateCrossSellState` | 2816-2864 |
| `showCrossSellVariant` | 2868-2892 |
| `crossSellFocusAfterRender` | 2897-2913 |
| `handleCrossSellView` | 2917-2928 |
| `saveNoteAndNavigate` | 2934-2975 |
| `loadRecommendations` | 2981-2993 |
| `fetchRecommendations` | 2995-3044 |
| `applyRecommendations` | 3049-3061 |
| `recommendationsKey` | 3065-3070 |
| `watchRecommendationsFocus` | 3075-3089 |
| `beginMutation` (aborta el GET y sube la generación en 3139-3140) | 3131-3142 |
| `endMutation` (reconciliación en 3150-3153) | 3144-3162 |
| `syncCart` (salto recordado mientras está congelado en 3173-3176 y 3180-3183) | 3166-3189 |
| `renderCartResponse` (libera el congelado en 3217-3218) | 3211-3221 |
| `renderSection` (nota en 3279-3284, foco en 3306, recomendaciones en 3321) | 3266-3322 |
| `setCrossSellBusy` (alterna `data-cross-sell-adding`) | 3381-3392 |
| `clearMessages` oculta la región incierta | 3404-3406 |

### 3.6 `assets/base.css` (CRLF, de 9484 a 9736 líneas)

- 2839-2843: `.cart-cross-sell__title` editado en su sitio. Se quitan `overflow: hidden`, `text-overflow: ellipsis` y `white-space: nowrap`; se añade `overflow-wrap: anywhere` (2842).
- 2869-3121: bloque delimitado (marcador de inicio en 2870, "Fin Fase 2" en 3121). Contiene: slot (2875-2877); reset de la lista (2880-2888); placeholder (2894-2900); panel de opciones a todo el ancho de la tarjeta, `grid-column: 1 / -1` (2915-2922); chips con `min-width` y `min-height: var(--tap-target-min)` (2948-2966; el token vale 44px en la línea 42); radio nativo con opacidad 0, enfocable, sobre todo el chip (2968-2977); no disponible con borde discontinuo y tachado (2989-2995); seleccionado con `:has(:checked)` (2997-3001); anillo con `:has(:focus-visible)`, `var(--focus-width)` (2px, línea 101) y `outline-offset: 2px` (3003-3006); respaldo `@supports not selector(:has(*))` (3010-3026); `@media (forced-colors: active)` (3031-3056); región incierta y Check cart (3090-3101); cajón estrecho por debajo de 30rem (3105-3120).
- Sin cambios en `.cart-drawer__scroll` (8661) ni en `.cart-drawer__footer` (3123 y 8668): el `diff` contra la copia previa solo toca 2840, 2842-2843 y 2869-3121.

### 3.7 `docs/requirements-ledger.md`

- Solo la línea 66: el localizador del cajón pasa de `sections/cart-drawer.liquid:500-504` a `361-365` (bloque `additional_checkout_buttons`, que hoy está en 361-365). Autorizado por el dueño. Ningún estado de fila cambia: el `diff` contra la copia previa es `66c66`.

### 3.8 Este informe

`agent-comms/outbox-claude/CLAUDE-REPORT-V1.1.0-PHASE2.md` (nuevo).

## 4. Desviaciones (Nivel 1 o Nivel 2)

### 4.1 Nivel 2, autorizadas por el dueño en el chat el 2026-10-09 (piden tu ratificación)

1. `sections.cart.view_product_for` = "View product: {{ product }}" / "Ver producto: {{ product }}" en lugar de "View {{ product }}" / "Ver {{ product }}" (`locales/en.default.json:94`, `locales/es.json:94`). El enlace muestra "View product" (snippet:255) y su `aria-label` es esta clave (snippet:253). Con el texto de la directiva el nombre accesible no contenía el texto visible "View product", lo que incumple WCAG 2.5.3 Label in Name (nivel A).
2. `docs/requirements-ledger.md:66`: localizador de 500-504 a 361-365. Necesario para `gates:ledger`: `sections/cart-drawer.liquid` tiene ahora 458 líneas y el rango 500-504 ya no existe.

### 4.2 Nivel 1 (dentro del alcance, reversibles)

- `recommendations.performed?` en lugar del `.performed` del contrato (snippet:73 y 268).
- Default traducido asignado a una variable antes de `| default:` (snippet:19-20).
- Contenido interno del botón Add capturado una vez y reutilizado en direct y options (snippet:50-56, 158, 225).
- Presupuesto de bloques igual a `section.blocks.size` (snippet:79); el schema ya limita los bloques a 2.
- Corte temprano al llegar a 2 en el bucle de fuentes y en el de candidatos (snippet:61-63 y 87-89).
- "From" siempre que `price_varies` (snippet:147); el contrato lo limitaba al flujo options. Un link con variantes de distinto precio mostraría el mínimo sin "From".
- Claves huérfanas `already_added` y `already_added_product` retiradas de ambos locales.
- Plazo de 10 s para el POST de Add (theme.js:2220 y 2610); la directiva no fija ninguno.
- `AbortController` propio por cada Add (theme.js:2607-2610); `crossSellController` queda exclusivo del GET de recomendaciones.
- Un segundo clic en Choose options repliega el panel y conserva la selección; Cancel la borra (theme.js:2743-2750 y 2758-2770).
- Una sync saltada se descarta si el cajón está cerrado o hay una mutación pendiente, porque `open()` y `endMutation()` ya sincronizan (theme.js:2707-2718, 2446, 3161).
- Enter sobre un radio y el submit del formulario vacío se cancelan (theme.js:2263-2266 y 2271-2273).
- La nota también se guarda antes de salir por el título y la imagen de la tarjeta (theme.js:2361-2368).
- "Adding…" y la combinación no válida se anuncian por la región de estado existente `data-cart-status` (theme.js:2603-2606 y 2855-2857; región en `sections/cart-drawer.liquid:83`).
- La clave de caché incluye las líneas del carrito, `${syncRevision}|clave x cantidad|${anchor}` (theme.js:3063-3070), y no solo `${syncRevision}:${anchor}`: un cambio hecho en otra pestaña invalida la caché.
- El resultado de recomendaciones se aplica cuando el foco sale del slot (theme.js:3053-3056 y 3075-3089).
- Ruta del guardado de nota: `routes.cart_update_url` más `.js` (`sections/cart-drawer.liquid:46`), la misma ruta localizada `/cart/update.js` que pide la directiva, sin concatenar sobre `routes.cart_url`.
- "Guardar de forma síncrona" se implementa como espera antes de navegar: `preventDefault`, POST con `keepalive`, plazo de 3 s, y navegación solo si el servidor devuelve el texto exacto y no hubo teclas nuevas (theme.js:2917-2975). No se usa XHR síncrono.
- Salidas del congelado además de Cancel y de la mutación exitosa: el toggle (theme.js:2745-2749), Check cart (2722-2735), el cierre del cajón (2457-2459) y la lectura de reconciliación tras un Add incierto, que pasa aunque haya un panel abierto (2667, 3150-3153, 3173, 3185).

## 5. Hallazgos extra fuera de alcance (con parche listo) y pendientes

### 5.1 Pendientes

- Gate 5 en la tienda real no está hecho: requiere despliegue, prohibido hasta tu validación. Queda por comprobar: respuestas reales de Shopify (cuerpo del 422 en `/cart/add.js`, eco de `note` en `/cart/update.js`, y que la ruta de recomendaciones con `section_id` pinte la sección estática `cart-drawer` con `recommendations.performed?` en true), Safari, Firefox, lectores de pantalla, Windows High Contrast y el editor de temas.
- El ledger no tiene filas para las funciones de Fase 2. Propuesta: añadirlas como `código completo` hasta Gate 5.
- Contraste del anillo de foco (directiva 2.4.2, 3:1 o más) y de los textos nuevos (2.4.3): no verificado numéricamente. Usan `--color-foreground` y `--color-foreground-muted`, pero no hubo cálculo de contraste ni axe.

### 5.2 Riesgos residuales y hallazgos

- N1 (P3): si una mutación re-renderiza mientras hay un watch de foco armado, el slot desconectado sigue referenciado hasta el siguiente apply o el disconnect. Parche propuesto, no aplicado, en `renderSection` justo antes de `currentContent.replaceWith(nextContent)` (theme.js:3292):

  ```js
  this.recommendationWatch?.controller.abort();
  this.recommendationWatch = null;
  ```

- N2 (P3): tras Cancel con ratón, el resultado nativo en caché aparece en el siguiente cambio de foco y no al momento: Cancel devuelve el foco a Choose options, que está dentro del slot (theme.js:2764), y el reemplazo espera a que el foco salga (3053-3056). Sin parche propuesto: es el efecto de no reemplazar el slot con el foco dentro.
- N3 (P3, previo a Fase 2): `showStatus` no cancela su temporizador de 100 ms (theme.js:3416-3426). Un mensaje programado puede escribirse en la región después de que otra llamada la oculte o la vacíe, por ejemplo con una respuesta de Add en menos de 100 ms (2673-2677). Parche propuesto, no aplicado:

  ```js
  // showStatus
  window.clearTimeout(this.statusTimer);
  this.statusTimer = window.setTimeout(() => {
    output.textContent = message;
  }, 100);
  // clearMessages, al inicio
  window.clearTimeout(this.statusTimer);
  ```

- La nota no se guarda al salir por los títulos de las líneas del carrito ni por View cart (comportamiento previo, fuera de alcance).
- Un GET de recomendaciones que vence el plazo no se reintenta para la misma clave (según el contrato); se quedan las tarjetas de respaldo.
- El JSON en línea depende de que el filtro `json` de Shopify escape `<`. En el render con liquidjs (`$HOME/fixps/review-F/out-hostile/T08_script_in_value.html`) un valor de opción `</script><b>x` corta el bloque, porque el filtro de liquidjs no lo escapa. El mismo patrón ya existe en `sections/main-product.liquid:740` y `sections/featured-product.liquid:482`. El comportamiento en Shopify: no verificado aquí.
- Propiedades de línea obligatorias: el snippet no las detecta (la clasificación en snippet:108-118 no tiene esa condición) y el objeto `product` de Liquid no trae un atributo estándar que lo indique. Un producto de variante única con personalización obligatoria hecha por una app se clasificaría como direct. Mitigación posible, no implementada: una etiqueta o un metafield que fuerce el flujo link.
- Localizadores antiguos del ledger: algunos rangos no apuntan a su evidencia pero siguen dentro del tamaño del archivo, así que la compuerta no los detecta. Ejemplos: línea 50 (`assets/theme.js:2780-2810`, hoy `collapseCrossSells` a `updateCrossSellState`; antes de Fase 2 ya caía en `updateHeaderCount` y `setFormBusy`) y línea 54 (`cart-drawer.liquid:17`, un `assign`; la región viva está en la línea 83).

## 6. Verificación (comando, resultado y qué demuestra / qué no)

### 6.1 Integridad del árbol justo antes de escribir este informe

Comando: `md5sum assets/theme.js assets/base.css snippets/cart-drawer-recommendations.liquid locales/en.default.json locales/es.json docs/requirements-ledger.md`

```text
a97b1b503ddb87222b4403f588008f86  assets/theme.js
d33fff4e35772f9545ad2755aa663e40  assets/base.css
a7737425e24c4ef2363c205024370c65  snippets/cart-drawer-recommendations.liquid
b4ec421d94bfe813d91a942046f1c175  locales/en.default.json
91dc9b342896fbeb712ba8cf16b744e1  locales/es.json
785291ff865b0b23d975cad5fb68e098  docs/requirements-ledger.md
```

Demuestra: los seis archivos son los mismos que se revisaron y sobre los que corrió el log de compuertas (el log se escribió a las 06:28:17 UTC; la última modificación de un archivo de Fase 2, `assets/base.css`, es de las 06:17:19 UTC). `sections/cart-drawer.liquid` (`0c38acd0ddb61cdaa28ed775aa7ef128`) y `sections/main-product.liquid` tienen md5 idéntico a la copia `$HOME/fixps/copy-F2/` usada en la medición de complejidad.

### 6.2 Base antes de Fase 2

Logs `$HOME/fixps/recon-*.log` (04:56 a 04:58 UTC): las 8 compuertas con `EXIT=0`; Theme Check "90 files inspected with no offenses found."; `<cart-drawer> 7 claves`; locales con 422 hojas storefront y 479 de schema. No demuestra nada sobre Fase 2; es el punto de partida.

### 6.3 `npm run gates:static` (log oficial, literal y sin cortes)

Archivo: `$HOME/fixps/review-F/gates-static-final.log`, 134 líneas.

```text

> shopify-theme-project@0.1.0 gates:static
> npm run gates:json && npm run gates:hooks && npm run gates:sanity && npm run gates:locales && npm run gates:ledger && npm run gates:theme-check && npm run gates:syntax && npm run gates:package


> shopify-theme-project@0.1.0 gates:json
> node scripts/json-validate.mjs

----------------------------------------------------------------------
JSON VALIDATE
----------------------------------------------------------------------
Archivos .json comprobados: 534
  de ellos en /listings/:    11  <- fuera del alcance de Theme Check
Fallos de parseo:           0

ALCANCE: comprueba que el JSON parsee. No comprueba que el schema
sea semanticamente valido para Shopify: eso lo cubre Theme Check
en las carpetas de tema, y nadie en /listings/.

> shopify-theme-project@0.1.0 gates:hooks
> node scripts/dataset-hooks.mjs

--------------------------------------------------------------------------
DATASET HOOKS  (contrato JS <-> Liquid, por componente)
--------------------------------------------------------------------------
JS leido:                           assets/product-zoom.js, assets/theme.js
Componentes con data-* de contrato: 22
Exentas por escritura en runtime:   cartAddPending, cartCountLabel, comparePrice, currentPrice, dirty, gridColumns, itemCount, pending, quickBuyMode, reducedMotion, reveal, revealReady, sourcesLoaded, stockState, variantId, wasDisabled
  <theme-disclosure>            1 claves  2 montaje(s)
  <product-gallery>             1 claves  1 montaje(s)
  <variant-selects>            11 claves  2 montaje(s)
  <product-inventory>           4 claves  1 montaje(s)
  <recently-viewed>             7 claves  1 montaje(s)
  <sticky-cart-bar>             5 claves  1 montaje(s)
  <size-guide-modal>            1 claves  1 montaje(s)
  <gift-card-recipient>         3 claves  1 montaje(s)
  <pickup-availability>         3 claves  1 montaje(s)
  <product-recommendations>     1 claves  1 montaje(s)
  <product-card-variants>       5 claves  1 montaje(s)
  <cart-drawer>                12 claves  1 montaje(s)
  <facet-filters-form>          2 claves  2 montaje(s)
  <editorial-hero>              1 claves  1 montaje(s)
  <complete-the-look>          10 claves  1 montaje(s)
  <marquee-banner>              2 claves  1 montaje(s)
  <announcement-bar>            2 claves  1 montaje(s)
  <anchor-nav>                  3 claves  2 montaje(s)
  <copy-text>                   2 claves  1 montaje(s)
  <faq-filter>                  1 claves  1 montaje(s)
  <predictive-search>          16 claves  1 montaje(s)
  <product-zoom>                1 claves  1 montaje(s)

Contratos rotos: 0

ALCANCE: comprueba que el Liquid que monta el componente emita el atributo.
No comprueba que esté dentro de la etiqueta de apertura ni que su valor
sea válido en runtime.

> shopify-theme-project@0.1.0 gates:sanity
> node scripts/theme-check-sanity.mjs

[theme-check-sanity] sandbox en .tmp/theme-check-sanity-75 con 7 carpetas de tema
[theme-check-sanity] detectado LiquidHTMLSyntaxError (etiqueta Liquid sin cerrar) en sections/main-page.liquid
[theme-check-sanity] detectado TranslationKeyExists (clave de traduccion inexistente) en sections/main-blog.liquid
[theme-check-sanity] detectado ValidSchemaTranslations (clave t: de schema inexistente) en sections/main-placeholder.liquid

[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
[theme-check-sanity] ALCANCE DE ESTA PRUEBA: demuestra que esos tres checks estan activos y que disparan sobre archivos de tema. No demuestra cobertura exhaustiva de todas las referencias de traduccion. Para eso corre scripts/locale-key-inventory.mjs.

> shopify-theme-project@0.1.0 gates:locales
> node scripts/locale-key-inventory.mjs

--------------------------------------------------------------------------
INVENTARIO DE CLAVES DE TRADUCCION
--------------------------------------------------------------------------
Archivos escaneados:            86 (incluye /listings, fuera de Theme Check)
Referencias estaticas | t:      422 claves distintas
Referencias de schema t::       486 claves distintas
Claves en en.default.json:        432 hojas
Claves en en.default.schema.json: 486 hojas

Sin resolver en storefront:     0
Sin resolver en schema:         0
Construidas en runtime:         0  <- no verificables por ningun linter
Huerfanas en storefront:        0
Huerfanas en schema:            0

--------------------------------------------------------------------------
OK: todas las referencias estaticas resuelven contra los locales.

> shopify-theme-project@0.1.0 gates:ledger
> node scripts/ledger-verify.mjs

----------------------------------------------------------------------
LEDGER VERIFY
----------------------------------------------------------------------
Filas de requisito: 60
   54  cumplido
    6  código completo
    0  no verificado
    0  ausente

Incoherencias: 0 

----------------------------------------------------------------------
ALCANCE: esta compuerta comprueba vocabulario, estructura, aritmética y
localizadores. NO comprueba que una evidencia pruebe su requisito, y
nunca marca una fila como cumplida. Eso sigue siendo juicio humano.

> shopify-theme-project@0.1.0 gates:theme-check
> shopify theme check

╭─ success ────────────────────────────────────────────────────────────────────╮
│                                                                              │
│  Theme Check Summary.                                                        │
│                                                                              │
│  91 files inspected with no offenses found.                                  │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯


> shopify-theme-project@0.1.0 gates:syntax
> node --check assets/theme.js && node --check assets/product-zoom.js


> shopify-theme-project@0.1.0 gates:package
> shopify theme package

╭─ success ────────────────────────────────────────────────────────────────────╮
│                                                                              │
│  Your local theme was packaged in Sartorial-1.0.0.zip                        │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯

GATES_EXIT=0
```

| Compuerta | Exit | Línea del log | Resultado |
|---|---|---|---|
| gates:json | 0 | 12, 14 | 534 archivos, 0 fallos de parseo |
| gates:hooks | 0 | 40, 52 | `<cart-drawer>` 12 claves (antes 7); Contratos rotos: 0 |
| gates:sanity | 0 | 62-66 | 3 clases detectadas; sandbox restaurado a 0 ofensas |
| gates:locales | 0 | 78-85 | 432 hojas storefront, 486 de schema; 0 sin resolver, 0 huérfanas |
| gates:ledger | 0 | 96, 102 | 60 filas; Incoherencias: 0 |
| gates:theme-check | 0 | 116 | "91 files inspected with no offenses found." |
| gates:syntax | 0 | 121-122 | `node --check` sin salida de error |
| gates:package | 0 | 130 | Sartorial-1.0.0.zip |
| gates:static | `GATES_EXIT=0` | 134 | la cadena usa `&&` (línea 3): exit 0 final implica exit 0 en cada paso |

El mensaje EACCES del intento de autoactualización del CLI es ruido, no un fallo. No aparece en este log; sí aparece en el log base `$HOME/fixps/recon-package.log` (líneas 13-27), donde el empaquetado terminó igual y el exit fue 0 (línea 40).

Demuestra: JSON válido, contratos `data-*` emitidos, locales y schema sin claves rotas ni huérfanas, ledger coherente en vocabulario y localizadores, 0 ofensas de Theme Check con el preset recomendado completo, sintaxis JS válida y paquete generado. No demuestra (según el propio ALCANCE de cada script): que los atributos estén en la etiqueta correcta ni que valgan algo en runtime, que una evidencia del ledger pruebe su requisito, ni ningún comportamiento en navegador o en tienda.

### 6.4 LiquidComplexity

Medición con Theme Check en una copia con `max_complexity: 1` (`$HOME/fixps/review-F/complexity-F2.json`): snippet 55, `sections/cart-drawer.liquid` 41, `sections/main-product.liquid` 116. Base de `cart-drawer.liquid` antes de Fase 2: 72 (`$HOME/fixps/L-complexity-baseline.json`). Límite: `maxComplexity: 120` en `node_modules/@shopify/cli/dist/configs/recommended.yml:82` (CLI 4.8.0), preset que extiende `.theme-check.yml:31`. Demuestra el margen de cada archivo frente al límite. No demuestra nada de rendimiento en tienda.

### 6.5 Verificación adicional (no es Gate 5)

- Render Liquid con liquidjs y datos simulados. 15 escenarios del implementador, S01 a S15 (`$HOME/fixps/L-test/out/summary.json`, 05:25 UTC, antes de la ronda de corrección), y 25 renders del revisor (`$HOME/fixps/review-F/out/`: 17 del snippet y 8 de la sección completa, 06:33 UTC, después del último cambio del snippet a las 06:12 UTC), más 1 render hostil (`out-hostile/T08_script_in_value.html`). Comando re-ejecutado hoy: `python3 -I $HOME/fixps/review-F/validate-F.py`; resultado: 25 de 25 `OK` (ids únicos, sin formularios anidados, sin radios premarcados, todos los radios con `form="CartCrossSellOptions-..."`, claves JSON exactas, destino de `aria-controls` presente). En los 8 renders de sección completa el orden es error, región incierta, contenido, formulario de opciones, formulario del carrito, slot. No demuestra: liquidjs no es Shopify (ver el hallazgo del filtro `json`); el directorio de tema que usó el arnés (`THEME_ROOT`) no queda registrado en los archivos: no verificado, aunque `$HOME/fixps/copy-F2/` tiene md5 idéntico al árbol para el snippet y la sección.
- Chromium headless con endpoints simulados, el `theme.js` final (md5 `a97b1b503ddb87222b4403f588008f86`) y un subconjunto del CSS cuyo bloque de Fase 2 tiene el mismo md5 que `assets/base.css:2870-3121`: `TOTAL 188  PASS 188  FAIL 0`. Incluye 320, 375, 768 y 1440 px con `scrollWidth <= clientWidth` en la pista y el panel (0 px de desbordamiento horizontal), chips de 44x44, pie sin moverse al expandir, anillo de 2px con offset de 2px, títulos de 120 y 121 caracteres y una tarjeta sin imagen. Log: `run2.log` en el scratchpad del orquestador (contenedor), fuera del repositorio. No demuestra: el marcado lo genera una fixture JS que replica el contrato, no el render Liquid; un solo motor (Chromium).
- jsdom con el `CartDrawer` real, ejecutado por el revisor: escenarios de corrección 40 de 40 (`$HOME/fixps/review-F/jsim-t5-theme2.log`). Las baterías de la primera ronda (t1 a t3) corridas contra el `theme.js` final dan 6 FAIL, explicados por su propio texto: T7d y T11 afirman defectos ya corregidos; T2 espera la aplicación inmediata tras Cancel y ahora se difiere porque el foco vuelve al slot (N2); T9 espera el reinicio de selección que el toggle ya no hace; T7 en t2 lee el estado antes del retraso de 100 ms (pasa en t3); T12 consulta la caché con el formato de clave anterior `${syncRevision}:101` (`$HOME/fixps/review-F/jsim/t3.mjs:51`).

Ninguna de estas pruebas reemplaza la prueba en la tienda real.

## 7. Decisión requerida

1. Ratificar los dos cambios Nivel 2 autorizados por el dueño el 2026-10-09 (sección 4.1): el texto de `view_product_for` y el localizador de `docs/requirements-ledger.md:66`.
2. Decidir si se añaden al ledger filas para las funciones de Fase 2 como `código completo`, y cuándo se corre Gate 5 (despliegue a un tema de desarrollo en `tema-qkqpke0j.myshopify.com`, que la directiva prohíbe hasta tu validación).

## 8. Afirmaciones falsables numeradas

1. (2.1) El snippet existe con 293 líneas LF y se renderiza con la etiqueta exacta de la directiva. Prueba: `wc -l snippets/cart-drawer-recommendations.liquid`; `sections/cart-drawer.liquid:311`.
2. (2.1.1) Con `show_complementary_products` desactivado o `cart.item_count == 0` el módulo no emite nada. Prueba: snippet:17 y 293; renders S01 y S02 con 0 bytes (`$HOME/fixps/L-test/out/summary.json`).
3. (2.1.1) La ancla es la línea de mayor `original_price`, sin tarjetas regalo ni precios <= 0, con desempate `product_id` menor y luego `variant_id` menor. Prueba: snippet:28-43; renders T02 y T03 de `$HOME/fixps/review-F/out/`.
4. (2.1.1) Sin ancla, las fuentes 1 y 2 se omiten y se evalúan bloques y colección. Prueba: condición `anchor_product` en snippet:68, 73 y 268; S12 (1 tarjeta, ancla vacía) y T13.
5. (2.1.2) Las cuatro fuentes se evalúan en orden estricto con presupuestos 10, 10, `section.blocks.size` y 50. Prueba: snippet:59-83 (presupuestos en 70, 75, 79, 82); S05 (metafield primero); T04 (50 productos agotados y 2 elegibles en las posiciones 51 y 52: 0 tarjetas, 0 ids).
6. (2.1.2) Los bloques no bloquean la colección: cada fuente solo rellena huecos. Prueba: snippet:59-63 y 85-89; S03 (bloques no elegibles, la colección rellena 2) y S04.
7. (2.1.3) Ningún producto del carrito ni repetido se muestra; los tokens `,id,` evitan coincidencias por subcadena. Prueba: snippet:25, 29, 46, 99-103; T01 (ids 12 y 123) y T09.
8. (2.1.3) Con 0 elegibles y sin fuente pendiente no queda encabezado, contenedor ni divisor. Prueba: snippet:273-292; S10 y S11 con 0 bytes.
9. (2.1.4) El contenedor es `<section class="cart-cross-sell" aria-labelledby="CartCrossSellHeading-{{ section.id }}" data-cart-cross-sell>` y cada tarjeta lleva `data-cross-sell-item` y `data-product-id`. Prueba: snippet:281, 283, 123-124.
10. (2.2.1 A) El flujo direct exige variante única, disponible, `min <= 1` e `increment == 1`, y pinta `data-cross-sell-add` con `data-variant-id`. Prueba: snippet:108-118 y 151-159.
11. (2.2.1 B) El flujo options pinta un botón `type="button"` con `aria-expanded="false"`, un panel oculto dentro de la tarjeta, `fieldset` con `legend`, y radios nativos sin `checked` que pertenecen al formulario vacío. Prueba: snippet:161-207; `validate-F.py` 25 de 25 OK; `sections/cart-drawer.liquid:144`.
12. (2.2.1 B) Cada chip mide al menos 44x44 CSS px. Prueba: `assets/base.css:2951` y `2953` con `--tap-target-min: 44px` (`assets/base.css:42`); harness Chromium, "chips >= 44x44 [44x44]" en las cuatro anchuras.
13. (2.2.1 B) La matriz se recalcula en cada cambio, marca chips sin combinación comprable, habilita Add solo con una combinación completa y comprable, y actualiza precio con `formatMoney` e imagen. Prueba: theme.js:2391-2396, 2804-2810, 2816-2864, 2879, 2883-2886.
14. (2.2.1 B) Cancel repliega, borra la selección, devuelve el foco a Choose options y no cierra el cajón ni toca el carrito. Prueba: theme.js:2758-2770 (sin llamadas de red ni a `close`).
15. (2.2.1 C) El flujo link es `<a class="button button--secondary cart-cross-sell__link" href="{{ candidate.url }}">` con el texto `sections.cart.view_product`. Prueba: snippet:249-256.
16. (2.2.2) `crossSellController` solo se usa para el GET de recomendaciones; el Add tiene su propio controlador. Prueba: `grep -n crossSellController assets/theme.js` devuelve 2232, 2293, 2607 (comentario), 2996, 2998, 3033, 3139; controlador del Add en 2609.
17. (2.2.2) `interactionFrozen` se activa con `focusin`, `pointerdown` o `change` dentro del panel, y mientras está activo no se aplica ninguna respuesta de recomendaciones ni de sync. Prueba: theme.js:2274-2275, 2703-2705, 2393, 2754; descarte en 3050 y 3173-3176, 3180-3183.
18. (2.2.2) Un Add incierto nunca se reintenta y muestra `update_unconfirmed` con Check cart, que llama a `syncCart()`. Prueba: theme.js:2611-2645, 2682-2687, 2722-2735; harness "S4 exactly one POST (no auto-retry)".
19. (2.2.3) Escribir en la nota marca `data-dirty="true"` y sube `noteVersion`; `renderSection` restaura el borrador en `nextNote.value`; salir con nota sucia guarda antes de navegar y anuncia `saving_note`. Prueba: theme.js:2276-2280, 3279-3284, 2917-2975 (estado en 2942).
20. (2.3.1) El schema conserva los 6 settings, añade los 3 nuevos con defaults true, false, false, cambia el default de `cross_sell_heading` a la clave `t:` y mantiene `limit: 2`. Prueba: `sections/cart-drawer.liquid:381-457` (419, 413, 426, 433, 446).
21. (2.3.2) Los 17 textos de `sections.cart_drawer` coinciden con la directiva y las 20 referencias `t:` resuelven. Prueba: `locales/en.default.schema.json:787-832`; log de compuertas, línea 82 ("Sin resolver en schema: 0").
22. (2.3.3) EN y ES tienen `complimentary_additions` actualizado, las 12 claves nuevas y el mismo conjunto de 432 hojas. Prueba: líneas 86 y 90-101 de ambos archivos; log de compuertas, líneas 78, 81 y 84.
23. (2.4.1) Las tarjetas y el panel viven dentro de `.cart-drawer__scroll` y abrir opciones no mueve el pie. Prueba: `sections/cart-drawer.liquid:152`, 311 y 314; `assets/base.css:2918`; harness "footer not pushed by expansion" en las cuatro anchuras; reglas de scroll y pie sin cambios (`diff` solo en 2840, 2842-2843, 2869-3121).
24. (2.4.2) El foco visible es un anillo de 2px con offset de 2px en el chip, y un chip no disponible combina borde discontinuo, tachado y texto oculto. Prueba: `assets/base.css:3003-3006`, 2989-2995; snippet:200-202; theme.js:2834-2836.
25. (2.4.3) A 320, 375, 768 y 1440 px no hay desbordamiento horizontal y un título largo se parte en líneas. Prueba: harness Chromium (por ejemplo "S8[320] scroll track scrollWidth <= clientWidth [319/319]"); `assets/base.css:2839-2843`.
26. (DoD 3) `assets/theme.js` no usa `Intl` y el precio de variante sale de `formatMoney`, que toma el `money_format` de la tienda. Prueba: `grep -c "Intl\." assets/theme.js` devuelve 0; theme.js:119-131 y 2879.
27. (DoD 5) `npm run gates:static` termina con exit 0. Prueba: log de compuertas, línea 134 (`GATES_EXIT=0`).
28. (DoD, directiva sección 1) LiquidComplexity: snippet 55 y `sections/cart-drawer.liquid` 41, por debajo de 120. Prueba: `$HOME/fixps/review-F/complexity-F2.json`; `node_modules/@shopify/cli/dist/configs/recommended.yml:82`.
29. (DoD 1) En el ledger solo cambia el localizador de la línea 66 y ningún estado de fila. Prueba: `diff $HOME/fixps/p2-bak-L/docs/requirements-ledger.md docs/requirements-ledger.md` devuelve solo `66c66`; log de compuertas, líneas 96-102.
30. (DoD 2, Vacío) Con el carrito vacío no hay petición de recomendaciones ni encabezado. Prueba: el render está en la rama no vacía (`sections/cart-drawer.liquid:131`, 138, 311); sin slot pendiente `loadRecommendations` sale sin pedir nada (theme.js:2983-2985).
