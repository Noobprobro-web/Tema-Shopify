# Compuerta 5 de R3: pruebas en tienda real (2026-11-24)

Revisión probada: `52b254c` (HEAD integrado de R3; el HEAD actual `12db869` solo añade la entrada D62 en `docs/decisions.md`).
Tienda: `sartorial-theme-kvkzl39t.myshopify.com`. Autorización: D59.
Resultado en una línea: **la revisión integrada NO se puede subir a Shopify tal cual** (defecto S1). Con ese defecto sorteado en una copia, el resto de R3 funciona en tienda real en lo que el catálogo permite probar.

## 1. Entorno y método

- Conexión: `npx shopify theme dev` (CLI 4.8.0) desde una copia (`git worktree`) del HEAD, con `SHOPIFY_CLI_THEME_TOKEN` y `SHOPIFY_FLAG_STORE_PASSWORD` (copiada de `STOREFRONT_PASSWORD`) solo por variable de entorno. Ningún valor aparece en la salida, en los scripts ni en este informe (comprobado con `grep -F` sobre la carpeta).
- Tema de desarrollo creado: **`Development (476aa2-vm)`, ID `190692557104`, rol `development`**. No se ha borrado. Contiene, además del código de R3: tres plantillas de prueba (`templates/page.g5a|g5b|g5c.json`, `templates/product.g5|g6|g7.json`) y ajustes de prueba (drawer con umbrales 3000/5000 y barra activada, nota de carrito activada), más el workaround de S1. Es un artefacto de prueba, no un candidato.
- Tema publicado: lo pude leer, nunca lo toqué (solo `theme list`, `theme dev` y lecturas). Al empezar, el publicado era `Sartorial pkg (e5fd4b2)` #190453285168 y había 20 temas. Durante la sesión la lista cambió a 4 temas con `Archive rc5 (e5fd4b2)` #190453383472 publicado. Esa limpieza y esa publicación no las hizo esta sesión de pruebas: coinciden con la decisión D62 (commit `12db869`) registrada por la sesión principal.
- Dos rutas de acceso, con la misma copia sincronizada:
  - `http://127.0.0.1:9292` (proxy de `theme dev`): suite A y la mayoría de pruebas interactivas.
  - `https://<tienda>/?preview_theme_id=190692557104` con la contraseña del storefront (como en R2b): lote 1 (renderizado) y búsqueda predictiva.
- Limitación de `theme dev` (herramienta, no tema): el proxy responde 401 a las peticiones con `Accept: application/json` a `/products.json`, `/search/suggest.json` y `/products/<h>.js` (con `Accept: text/html` responde 200). Por eso la búsqueda predictiva solo se pudo probar por la ruta `preview_theme_id`. Las rutas `/cart/*.js` sí funcionan en el proxy.
- La tienda limita (429) las ráfagas de navegación y de mutaciones de carrito desde esta IP. Las pruebas se espaciaron y reintentan; un primer intento de los modos de la barra de recompensas dio datos inválidos por 429 y se repitió completo.
- Chromium de Playwright (escritorio 1440x900, móvil 390x844 con `isMobile` y `hasTouch`, `deviceScaleFactor: 2`). Lighthouse 13.6.0 con el método de `scripts/lighthouse-mobile.mjs` (copia en el scratchpad que además acepta rol `development`, porque el script del repo solo acepta `unpublished`).
- Sin tocar: catálogo, clientes, pedidos, ajustes, mercados, idiomas, moneda. Solo carritos de comprador (`/cart/add.js`, `change.js`, `clear.js`), nunca checkout.

### Workaround aplicado SOLO en la copia (para poder subir el tema)

`scripts/workaround-defaults.diff`: quitar `"default": ""` de tres ajustes de schema (ver S1). Sin eso `theme dev` no sirve la portada ni la FAQ.

## 2. Inventario del catálogo (solo lectura)

- Tienda: moneda USD, `money_format` real **`${{amount}}`**, `ships_to_countries: ["US"]`; selector con 2 países (Canadá USD y Estados Unidos USD, etiquetas cortas). Un solo idioma: **inglés** (`/es` y `/fr` dan 404). Sin retiro local (el panel de pickup sale vacío). Sin proveedores de pago (`shopify_pay_enabled_card_brands: []`): el cajón no pinta botones de pago acelerado.
- 39 productos, 11 colecciones (`empty-test` con 0, `single-product-test` con 1, `new-forms` 9, etc.).
- Útiles: `serra-coat` (15 variantes, `Camel / M` agotada), `doppio-trench` (12 imágenes, compare-at en las 10 variantes), `fixture-media-3d-video` (vídeo y 3D, pocos medios), `fixture-many-variants` (40 variantes), `fixture-long-title`, `leather-belt` (sin imagen), `silk-twill-square` (sin descripción), `gift-card` (4 denominaciones y destinatario), `cashmere-scarf` (1 variante).
- **No hay**: reglas de cantidad (todas min 1, incremento 1, máx sin límite en las 39 fichas), planes de venta, imagen asignada a variante (`featured_image` nula en todas), producto con más de 6 medios que incluya vídeo/3D, unit price, mercados con etiqueta larga, idioma español.
- Un blog (`news`) con **3 artículos** (`welcome-to-the-demo-store`, `how-to-read-the-size-chart`, `long-title-article-test`) y etiquetas `guide`, `news`, `test`. Páginas: faq, contact, about (no existen `support` ni `documentation`).

## 3. Prueba A: batería automática

`npx playwright test --trace off` contra el tema de desarrollo (`raw/playwright-45-tests.log`): **45 passed (29,9 s), 0 fallos, 0 saltados.** Incluye los 2 tests de `tests/pdp-line-total.spec.mjs` (primera vez contra tienda real: pasan) y los 43 de R3/slideshow. Las pruebas de B recorren después lo que esos tests simulan con servidor falso.

## 4. Resultados por prueba

PASA = comprobado en tienda con evidencia. NO EJECUTABLE = el catálogo o el entorno no lo permite sin mutar la tienda o sin dispositivo real.

| # | Prueba | Resultado | Evidencia (`raw/` y `shots/`) |
| --- | --- | --- | --- |
| B1 | 21 plantillas x 2 anchos en inglés, sin "Liquid error", "Translation missing", claves `t:` ni desbordes horizontales | **PASA** (con S1 sorteado) | `raw/b1.json`: 0 hallazgos de texto en 42 cargas + 2 de contraseña; consola: solo ruido de plataforma (telemetría `otlp`/`bugsnag` bloqueada por el proxy, `shopify-xr.js` 404 y una fuente de Shopify 404 en la página de contraseña). Ningún error JS propio |
| B1-es | Mismo recorrido en español | **NO EJECUTABLE**: la tienda no publica `/es`; registrar traducciones está prohibido |
| B2 | Blog: 3 artículos | **PASA con N1 confirmado** | `/blogs/news`: destacado + 2 tarjetas, rótulo "3 essays" (el destacado se cuenta) |
| B2 | Blog: uno solo (por etiqueta `guide`, `test`, `news`) | **PASA** | destacado solo, sin rejilla ni aviso de vacío (`raw/blog-tags.json`) |
| B2 | Blog: etiqueta inexistente | **PASA** (404 con el texto nuevo) | `shots/d-404.jpg` |
| B2 | Blog: vacío, varias páginas, página 2 real | **NO EJECUTABLE**: `articles_per_page` mínimo 4 (Shopify rechaza menos: «can't be less than 4») y hay 3 artículos; vaciar el blog muta la tienda |
| B2 | `?page=2` fuera de rango | Observación L2 | muestra "No essays have been published yet." con 3 artículos publicados |
| B2 | 404 y textos nuevos | **PASA** | `shots/d-404.jpg`, `m-404.jpg` (hay recorte del placeholder, ver L5) |
| B3 | Ficha: cambio de variante (precio, disponibilidad, URL `?variant`) | **PASA** | `raw/pdp1.json` (en `serra-coat`: Camel/M muestra «Sold out» y el botón desactivado; Camel/L vuelve a «Add to cart»); 1440 y 390 |
| B3 | Medio priorizado al cambiar de variante | **NO EJECUTABLE**: ninguna variante tiene imagen asignada |
| B3 | Reglas de cantidad (en/es, "De N en N" tras cargar JS) | **NO EJECUTABLE** en tienda: ninguna ficha tiene reglas; lo cubren solo los tests con servidor falso (A) |
| B3 | Guía de tallas: solo cm, solo in, ambas; foco al cerrar; clic/tap en el fondo | **PASA** (táctil emulado) | `raw/sg.json`, `shots/mg7-sizeguide.jpg`: contenido y pestañas correctos, objetivos 44x44, el fondo cierra y el foco vuelve al botón |
| B3 | Guía de tallas "ninguna tabla" | No probada (el bloque no se pinta fuera del editor) |
| B3 | Panel de pickup | **NO EJECUTABLE**: la tienda no tiene retiro local |
| B3 | Sin JS: selector de variantes | **PASA** | radios + `select` sin JS, envío del formulario lleva a `/cart` con la línea correcta (`raw/nojs.json`) |
| B3 | Sin JS: variante agotada | **FALLA parcial (M1)** | `raw/nojs.json`, `shots/nojs-serra-soldout.jpg`, `nojs-soldout-submit.jpg` |
| B4 | Cajón: anuncio del cambio de cantidad, una sola vez | **PASA** | `raw/drawer1.json`: 1 mutación de la región `[data-cart-status]` con el texto completo (1440 y 390). Lector de pantalla real: no probado |
| B4 | Foco en Checkout tras repintar | **PASA** | `drawer1.json`: foco en `data-focus-key=checkout` antes y después del repintado |
| B4 | Pago acelerado: adónde va el foco | **NO EJECUTABLE**: el cajón no renderiza botones (`.cart__dynamic-checkout` ausente; sin proveedores de pago) |
| B4 | `/cart`: cantidad 0 | **PASA** | `raw/zero.json`: el campo tiene `min=1`, la cantidad 0 se aplica con «Update cart» y el carrito queda vacío; no hay actualización automática al tabular (es un formulario) |
| B4 | `/cart`: nota sin enviar al abrir el cajón; cambio en el cajón repinta y conserva la nota | **PASA** | `drawer1.json` (1440 y 390): la nota «gift please» sobrevive y la cantidad de la página pasa a 2 |
| B4 | Tarjeta regalo: propiedades en el cajón | **PASA** | `raw/gc.json`: «Recipient email:…» «Recipient name:…» |
| B4 | Barra de recompensas, 4 modos (+ desactivada) | **PASA** | `raw/modes.json` (1,2 y 3 unidades de 1.890 USD; umbrales 3.000/5.000): ambos, solo envío, solo regalo; sin umbrales y desactivada no pintan barra. Mensajes, `aria-valuenow`, hitos e importes (`$1,110.00`…) correctos; `shots/drawer-both-q2.jpg` |
| B5 | `suggest.json` real | **Respondido** | ver sección 6 |
| B5 | Tachado coherente | **PASA** | `Doppio Trench` $945.50 con $1,190.00 tachado (todas sus variantes comparten precio y compare-at); un producto con rango ($89–$109,75) no tacha; `raw/b5b.json`, `shots/d-predictive-trench.jpg` |
| B5 | Cerrar durante la petición (red +3 s) y reabrir | **PASA** | `busy` true → false; reabrir relanza y pinta «Serra Coat»; foco en el campo (`raw/b5b.json`, 1440 y 390) |
| B5 | Petición abortada: mensaje de error | **PASA** | «We could not load suggestions…»; reabrir tras el fallo reintenta y pinta resultados (`raw/b5c.json`) |
| B6 | Filtros con red lenta (+3 s): foco | **PASA** | `raw/filt1.json`: si el foco pasó a `sort_by` se queda ahí; si no se movió, vuelve al control (`filter.v.availability`) |
| B6 | Precio fuera de rango | **PASA** | `lte=99999` se corrige a 2800; `gte=5000` se corrige a 2800 y devuelve 1 producto |
| B6 | Featured product con más de 6 medios en escritorio | **PASA parcial** | `doppio-trench` (12 imágenes): 12 nodos, escritorio muestra 5 (`base.css:10766`), móvil 12 en la tira; vídeo/3D no se pudo combinar con >6 medios. Con vídeo y 3D (`fixture-media-3d-video`) ambos se pintan (`shots/d-fp-12media.jpg`) |
| B6 | Bento con 1, 2, 3 y 4 bloques; los tres presets | **PASA** | `raw/g5.json`, `raw/presets.json`, `shots/d-bento-4blocks.jpg`, `preset-Imprint-d-bento.jpg`; sin errores ni desbordes con Sartorial, Imprint y Archive en 1440 y 390. «Producto vacío» no probado |
| B6 | Tarjeta única: ancho frente a `currentSrc` | **PASA** | featured collection: 448 px → imagen 960w en 1440; 350 px → 800w en 390. Collection list (1 bloque): 446 px → 1000w, 348 px → 800w; 4 tarjetas: 307 px → 800w; `raw/g5.json` |
| B6 | Collection list con una colección vacía | **PASA** (sin imagen ni tarjeta, sin error) |
| B6 | Marquee | **PASA** | el botón alterna «Pause/Play editorial highlights», sin `aria-pressed` estático (`raw/home1.json`) |
| B6 | Complete the look | **PASA** | `raw/ctl2.json`: «3 of 3 items selected», «Add 1 item…» frente a «Add 3 items…» (D4), total y botón con `$` correcto (185+520+98 = $803,00), 0 seleccionadas desactiva el botón, variante agotada deshabilitada en el `select`; con compare-at suma $2.835,50 |
| B6 | Lookbook | **PASA parcial** | renderiza con 3 hotspots por producto; sin imagen (el catálogo de archivos no se tocó); popover no recorrido |
| B6 | Slideshow | **NO PROBADO en tienda** (necesita imágenes); solo test A |
| B7 | Selector de país | **PASA parcial** | 2 mercados USD; es un `select` + botón «Update preferences» (no cambia al elegir, a propósito); etiqueta larga no probable (`raw/loc.json`) |
| B7 | forced-colors | **FALLA parcial (L3)** | `raw/fc.json`, `shots/fc-collection.jpg`: foco con contorno de 2 px; swatches con contorno `Highlight`; el selector de rejilla pierde sus iconos |
| B7 | Objetivos táctiles de overlays (emulación) | **PASA parcial** | búsqueda predictiva: todos ≥44 px; guía de tallas: 44x44 y pestañas 88x44; cajón: un enlace de 73x21 (L4). La contraseña no tiene fallos (`raw/misc.json`). Dispositivo táctil real: no ejecutable aquí |
| B8 | `money_format` real y dinero pintado por JS | **PASA** con el formato real | `${{amount}}`: precio al cambiar de variante, total de línea ($5.670,00 y 3x$945,50 = $2.836,50), barra de recompensas, complete the look y tachado de la predictiva sin entidades ni etiquetas (`raw/money.json`). Los casos con entidades (`&pound;`) o HTML no se pueden probar sin cambiar el formato de la tienda |
| B9 | axe (wcag2a/aa/21aa/22aa + best-practice) 14 plantillas x 2 anchos | **PASA** | `raw/axe.json`: 0 violaciones en home, colección, ficha (2), carrito, búsqueda, blog, artículo, 404, FAQ, about. `contact`: `landmark-complementary-is-top-level` (moderate, `sections/main-contact.liquid:158`). Páginas de prueba g5b/g5c: `landmark-unique` al repetir secciones del mismo tipo |
| B9 | Lighthouse móvil (sobre el tema de desarrollo, no minificado, desde contenedor, throttling simulado) | **PASA el umbral** | medianas: home 85, colección 86, ficha 81 (media 84, mínimo 81); LCP 1,8/2,1/2,8 s; CLS 0; TBT 291/404/424 ms (`raw/lh-summary.json`). Medición aproximada, no certificación |

## 5. Defectos encontrados (por gravedad)

### S1. BLOQUEANTE. Shopify rechaza la subida de tres secciones por `"default": ""`

- Reproducir: `npx shopify theme dev --path <copia del HEAD>` (o `theme push --unpublished`, o subir la ZIP). La subida falla antes de servir nada:
  - `sections/main-faq.liquid`: «Invalid block 'unresolved_cta': setting with id="button_label" default can't be blank»
  - `sections/complete-the-look.liquid`: «Invalid schema: setting with id="caption" default can't be blank»
  - `sections/lookbook.liquid`: igual con `caption`
  - cascada: `templates/index.json` («Section type 'complete-the-look' does not refer to an existing section file») y `templates/page.faq.json`. Mientras dura, el proxy devuelve 500 en todas las páginas.
- Dónde: `sections/complete-the-look.liquid:414`, `sections/lookbook.liquid:241`, `sections/main-faq.liquid:250`. Son las únicas ocurrencias de `"default": ""` en config, sections, snippets, layout y templates.
- Origen: commits `cf7213e` y `03cddcb` (rama de GPT, corrección D6). En `e5fd4b2` esos defaults tenían texto («Contact us», etc.).
- Por qué no se vio antes: Theme Check, `gates:static` y el empaquetado no validan los defaults vacíos; solo el servidor de Shopify.
- Efecto: la ZIP 1.0.0 integrada (sha256 `1306eaf9…10db8`) no es subible. Es el defecto más importante de esta compuerta.
- Arreglo probable (no aplicado): borrar la línea `default` en las tres (diff probado en `scripts/workaround-defaults.diff`; con él, todo lo demás de este informe se ejecutó). Hay que regenerar la ZIP y el manifiesto.

### M1. MEDIO. Sin JS, el botón nativo de envío sale habilitado con la variante agotada seleccionada

- Reproducir: con JS desactivado, abrir `/products/serra-coat?variant=68442277151024` (Camel / M, agotada). El `select` la deja preseleccionada y el botón `no-js-only` «Add to cart» está visible y habilitado; el de JS queda `disabled` y oculto. Enviar lleva a `/cart` con «Serra Coat / Camel / M» añadida (esta tienda lo admitió).
- Dónde: `snippets/product-submit-button.liquid:40-51` (`no_js_submit`) frente a `:53-58`. El `select` marca «Sold out» en el texto de la opción pero no la deshabilita (`snippets/variant-no-js-select.liquid:192`).
- Nota: es un diseño deliberado (el visitante puede elegir otra opción del `select`), pero contradice la expectativa del plan («no debe salir el botón nativo habilitado») y permite pulsar sobre una variante agotada. Decisión de Gemini o Johandry: deshabilitar la opción agotada (`disabled`) o aceptar el diseño y documentarlo.

### B1. BAJO. N1 confirmado: el rótulo cuenta el destacado

- Reproducir: `/blogs/news` con 3 artículos: se ven el destacado y 2 tarjetas bajo «LATEST ESSAYS | 3 essays».
- Dónde: `sections/main-blog.liquid:121` (`featured_article.blog.id` es siempre vacío en Liquid).

### L2. BAJO. Página fuera de rango del blog dice que no hay artículos

- Reproducir: `/blogs/news?page=2`: «No essays have been published yet.» con 3 artículos publicados. `sections/main-blog.liquid:188` (`paginate.current_page > 1`). Shopify no devuelve 404 en ese caso.

### L3. BAJO. Colores forzados: el selector de rejilla se queda sin iconos

- Reproducir: emular `forced-colors: active` en `/collections/all`: los tres botones «Grid» son cuadrados vacíos y no se distingue el activo (`aria-pressed`).
- Dónde: `assets/base.css:5629-5635` (`.collection-grid-switcher__icon i { background: currentColor }`); el bloque `@media (forced-colors: active)` de `:3614-3640` no lo cubre. Arreglo probable: `forced-color-adjust: none` con `background: CanvasText` y `Highlight` para el activo.

### L4. BAJO. Objetivo táctil de 73x21 px en el cajón

- Reproducir: en móvil, con un producto en el carrito, abrir el cajón: el enlace del título de línea mide 73x21. `sections/cart-drawer.liquid:223` (`.cart-drawer-item__title`). WCAG 2.2 AA 2.5.8 pide 24 px salvo excepción por espaciado.

### L5. BAJO (copy y detalles)

- Búsqueda predictiva sin coincidencias dice «0 suggestions available» y «No suggestions yet. Press enter…» (el texto sugiere que aún no se buscó). `predictive_search.no_results`.
- Un producto con rango de precio se pinta con el precio mínimo sin «From» (p. ej. $89.00 para $89–$109,75).
- El placeholder de la búsqueda de la 404 se recorta en 1440 («Search products anc…»).
- Una tarjeta regalo de $10 cuenta para la barra de envío gratis ($2.990 restantes), aunque no se envía. Decisión de producto.
- El `featured-product` oculta en escritorio las imágenes a partir de la 6.ª (`base.css:10766`) sin enlace para verlas todas: es el diseño de FB-05, pero conviene documentarlo.
- `contact`: `<aside>` no es de primer nivel (`landmark-complementary-is-top-level`, `main-contact.liquid:158`).

## 6. Respuestas a las incógnitas

- **Payload de `/search/suggest.json`** (`raw/b5-suggest.json`): cada producto trae `available`, `price`, `price_min`, `price_max`, `compare_at_price_min`, `compare_at_price_max`, `featured_image`, `image`, `tags`, `type`, `vendor`, `url`, `body` y **`variants`, pero siempre como array vacío**. Los importes llegan como cadenas con decimales. Sin compare-at, `compare_at_price_min` y `_max` valen `"0.00"`. Con ese payload `comparablePrice` (`assets/theme.js:6218-6240`) solo tacha cuando `price_min == price_max` y `compare_at_price_min == compare_at_price_max`: correcto en `doppio-trench`, sin tachado en productos con rango.
- **Foco en pago acelerado**: no ejecutable aquí; el cajón no renderiza botones por falta de proveedores de pago. Lo que sí se probó: con foco en Checkout, el repintado lo conserva.
- **N1**: confirmado (B1). Con el destacado de la propia etiqueta, un artículo por etiqueta se pinta como destacado único sin aviso.
- **Texto de reglas de cantidad en español**: no ejecutable (ni reglas ni `/es`). Pasó solo en los tests con servidor falso.
- **`money_format`**: `${{amount}}`. Los importes pintados por JS son correctos con ese formato; los casos con entidades y HTML no se pueden verificar sin cambiar el formato de la tienda (prohibido).

## 7. Filas del ledger que podrían cambiar (propuesta; NO se ha editado el ledger)

Con la evidencia de este informe, **tras corregir S1**, podrían pasar a `cumplido`:

- Barra de recompensas del cajón con etapas configurables (FB-10): los cuatro modos, 3 cantidades, importes y `aria`. Falta repetir los modos en móvil (solo se abrió el cajón en 390).
- Página de carrito y cajón sincronizados sin perder ediciones (AS-02/FB-30): `drawer1.json`, `zero.json`.
- Filtros Facetados (AS-05, FB-33): foco con red lenta y rango de precio, en 1440 y 390.
- Tarjeta única en featured collection y collection list (FB-08): ancho frente a `currentSrc` a 390 y 1440.
- Guía de tallas con una o ninguna tabla (FB-15): solo cm, solo in y ambas; falta «ninguna».
- Búsqueda Predictiva, parte AS-03/FB-34/AS-10: payload real, cierre en vuelo, error y reabrir. La fila entera sigue abierta por FB-04 (táctil real) y lector de pantalla.
- Live Regions (FB-02), parte del cajón: anuncio único. Pendiente lector de pantalla real.
- Bento discovery: 1 a 4 bloques y tres presets; falta «producto vacío».
- Disponibilidad de Retiro Local (AS-01), Precio Unitario (AS-09), Selector de País (FB-14): se mantienen, no se pudo probar.

**No pasan** (sin evidencia aquí): Reglas de cantidad visibles (FO-05), Variantes sin JS con reglas o planes distintos (AS-04, no hay datos), Planes de venta, Importes con entidades o HTML (AS-09/FB-01), Medios Enriquecidos y Tira de Medios con >6 medios y vídeo/3D juntos, Selector de variantes con medio priorizado, Swatches en colores forzados (FB-25, **falla L3**), Foco y nombres accesibles (lector de pantalla), Textos nuevos (D35; aprobación de Johandry), FB-04 con táctil real. **Schemas Válidos queda en riesgo por S1**: la fila `cumplido` de la ZIP no resiste la subida real; recomiendo bajarla a `código completo` hasta corregir y volver a subir.

## 8. Qué queda sin verificar y qué haría falta

- Español: idioma `es` publicado y traducciones registradas (mutación, prohibida): reglas de cantidad, `/es` completo.
- Reglas de cantidad, planes de venta, unit price, imagen por variante, retiro local, proveedores de pago (Shop Pay y acelerados), un mercado con etiqueta larga: datos o configuración de tienda que no existen.
- Blog con ≥5 artículos para probar página 2 y destacado no duplicado entre páginas; blog vacío.
- Lector de pantalla (NVDA/VoiceOver) y táctil en dispositivo real.
- `money_format` con entidades (cambio de ajuste de tienda).
- Slideshow con imágenes, hotspots de lookbook (popover) y «producto vacío» del bento.
- Tras corregir S1, repetir el empaquetado y volver a subir para confirmar que `theme push --unpublished` pasa limpio.

## 9. Contenido de la carpeta

- `INFORME.md` (este archivo).
- `shots/`: 25 capturas JPEG comprimidas (sin credenciales ni datos personales; el correo del formulario de tarjeta regalo es `buyer@example.com`).
- `raw/`: resultados JSON y salida de Playwright.
- `scripts/`: los scripts de prueba (leen `STOREFRONT_PASSWORD` solo del entorno; contienen rutas del scratchpad sustituidas por `<scratchpad>`).
- Resultado de `npm run gates:package` tras estas pruebas: 107 archivos, sha256 `1306eaf959d7007b7930e368a6489917090428c093541c913713a573eb810db8` (sin cambios: no se tocó ningún archivo del tema).
