# Pruebas en tienda real rc2 (2026-11-14)

Tienda `sartorial-theme-kvkzl39t.myshopify.com`. Temas: Sartorial rc2 190316839216, Imprint rc2 190316871984, Archive rc2 190316904752.
Ejecucion en serie, un navegador a la vez. Sin 429 en ninguna corrida (`rateLimitEvents` = 0). No se cambio ningun estado del ledger.
Sin secretos en los archivos: el escaneo de la contrasena y del token sobre esta carpeta dio 0 coincidencias.

## Precondiciones

- `run.mjs` SHA-256 = `103c1551fc1d639e93a882900885ba9283d8c260d49c938543d6299ac1a4292f`, comprobado antes y despues. Sin modificar.
- `00-theme-list-unpublished.txt`: `shopify theme list --role unpublished` lista los tres IDs rc2 como `[unpublished]` (Sartorial rc2 (bb9fc8a), Imprint rc2 (bb9fc8a), Archive rc2 (bb9fc8a)).
- El arnes verifica en navegador `Shopify.theme.id` y `role === 'unpublished'` antes de cada prueba. `previewIdVerified: true` en todas las sesiones.
- `stores.json`: sustituidos los 3 IDs antiguos de la tienda nueva por los 3 rc2. `selftest.mjs`: aserciones actualizadas a los IDs rc2. Resultado: `RESUMEN 96/96 comprobaciones correctas`.
- Rutas de fixtures: el esquema de `stores.json` solo admite las claves `collection` y `product` (`STORES_FILE_INVALID` con otra clave), asi que no se pueden anadir rutas nuevas sin tocar `run.mjs`. Se ejecuto una pasada `--read-only` por fixture reasignando temporalmente `collection`/`product`, y `stores.json` se restauro al final (en el diff solo quedan los IDs).
- Existencia de los fixtures (`01-fixtures-exist.txt`, GET autenticado con la preview rc2): las seis rutas dan 200.

## Tabla fila a resultado

| Fila | Resultado | Evidencia |
| --- | --- | --- |
| A-03 axe (violaciones) | PASA | `node scripts/summarize-harness-report.mjs 02-read-only-base.json` -> `viol=[]` en las 36 combinaciones preset x pagina x ancho (home/coleccion/producto, 390 y 1280). Tambien 0 violaciones en las 5 fixtures de producto y en `/collections/fixtures` salvo el foco de abajo (`04-ro-fixture-*.summary.txt`). |
| A-03 contraste de texto | NO CONCLUYENTE (0 violaciones, quedan `incomplete`) | axe 4.10.2 deja `color-contrast` en `incomplete` (4 a 26 nodos por pagina, p. ej. Imprint coleccion 1280 = 26). Sin medicion de contraste manual de esos nodos; el arnes ya advierte `AUTOMATED_SCAN_REQUIRES_SOURCE_REVIEW`. Tambien `aria-valid-attr-value` en `incomplete` (2 a 10 nodos; seccion lookbook en home Sartorial). |
| Teclado / 2.4.7 (fixtures normales) | PASA | `keyboard_tab_smoke` pasa en home, coleccion, producto de las 3 presets a 390 y 1280, y en fixture-many-variants, long-swatches, long-title, with-vendor y `/collections/fixtures` (32 tabs, 0 foco oculto). |
| Teclado / 2.4.7 `/products/fixture-media-3d-video` | FALLA (Imprint y Archive) | `keyboard_tab_smoke FAILED TAB_FOCUS_HIDDEN_OR_INERT` en imprint y archive, 390 y 1280 (`04-ro-fixture-media-3d-video.summary.txt`). Sartorial paso en esa corrida. Diagnostico propio (`scripts/probe-model-viewer-focus.mjs`): en el tab 11 el foco cae en `model-viewer.product-gallery__media` con ancho 0 y alto 768, tanto en Imprint como en Sartorial, asi que es intermitente segun la carga. |
| Indicador de foco / scroll horizontal | PASA | `horizontal_overflow` pasa en las 3 presets, todas las rutas y fixtures. |
| `--inventory` | PASA (carga completa) | `06-inventory.summary.txt`: `inventory_only`, `completed`, `routeOperationFailed=false`, 0 de 429. No certifica nada por diseno del arnes. |
| `--cart` (PDP anadir 1 linea, drawer poblado 390/1280, nota con eco exacto, limpieza) | PASA | `07-cart.summary.txt`: 18/18 `passed`, `final_same_session_cart_cleanup passed` en las 3 presets, carrito inicial vacio verificado. |
| Limpieza de carrito | VERIFICADA | Las 3 sesiones: `finalCartCleanup {clearHttpStatus:200, updateHttpStatus:200, readHttpStatus:200, itemCount:0, emptyVerified:true, noteEmptyVerified:true}` y `contextClosed:true`, sin `CART_CLEANUP_UNVERIFIED`. |
| B-01 (focus trap y cierre del drawer al cruzar el corte) | NO CUBIERTO | El README del arnes lo lista como pendiente. Solo se comprueba apertura y cierre del drawer vacio y poblado. |
| B-03 (respuesta perdida) | NO CUBIERTO | Pendiente en el README; requiere simular fallo de red en `/cart/add.js`. |
| B-04 (nota de carrito: lento, sin red, en curso) | NO CUBIERTO (solo humo) | Solo cubre el eco exacto de una nota multilinea con emoji (pasa). Faltan los casos lento, sin red y en curso. |
| B-05 (selector de idioma, axe con regla de nombre) | NO EJECUTABLE | `language_visible_name_match NOT_RUN LANGUAGE_CONTROL_NOT_RENDERED` en todas las presets y anchos: la tienda tiene un solo idioma y el selector no se renderiza. La regla de nombre forzada del arnes si esta disponible (`labelNameRuleAvailable: true`). |
| C-08 (bloques de entrega/devolucion en PDP) | NO CUBIERTO | El arnes no tiene matriz C-08 (README: pendiente). |
| MOTION chromium-full | PASA | `08-motion.log`: 3 rutas `PASA`, 0 pendientes, 0 ocultos, `scrollAnim` 15/5/0, CLS max 0,0208, 0 focos invisibles; 6 estados degenerados `PASA`; 6 capturas a mitad de gesto. |
| MOTION chromium-reduce | PASA | `reveal=0 scrollAnim=0 ready=false` en las 3 rutas. |
| MOTION firefox-no-scroll-driven | NO CUBIERTO | Firefox no esta instalado en Playwright (`Executable doesn't exist at /opt/pw-browsers/firefox-1543`). G4 `NO_MEDIBLE`. |
| MOTION veredicto | INCOMPLETO | `VEREDICTO: INCOMPLETO (filas 13/13 medidas, 0 con fallo)`. G0, G4 y G8 `NO_MEDIBLE` (Firefox ausente; la ruta corta `/collections/single-product-test` mide 993 px, no es corta). Solo se ejecuto sobre Sartorial rc2. |
| LV05-V01 (alineacion de titulos con vendor) | PASA con una salvedad | `05b-lv05-collection-V01-CN7.json`, rejilla de 2 columnas, 390 y 320 px, letra 100/125/150 %, 3 presets. Desfase de titulos en la misma fila: 0 a 0,3 px en todo, con vendor corto, vendor largo de 70 caracteres, vendor solo en algunas tarjetas y sin vendor. Excepcion: Archive 320 px / 150 % = 29,8 px (ver fallo 2; no es del vendor, aparece igual sin vendor). |
| LV05-V01 limites del metodo | ATENCION | `show_vendor` esta en `false` en las plantillas de Sartorial e Imprint, y es de seccion (no se cambia sin editar el tema), asi que en esas dos el vendor se inyecto en el DOM con el texto real de `products.json` (la regla CSS `:has(.product-card__vendor)` si se evalua, el Liquid no). Archive renderiza el vendor de verdad. |
| LV05-CN7 (swatches en fixture-long-swatches) | PARCIAL | La tarjeta muestra 1 de 4 swatches visibles en rejilla de 2 columnas, igual a 320 y 390 px y a 100/125/150 %, sin desbordar el grupo (`groupOverflow=0`). Es una fila de texto (`data-swatch-fit`); ningun fixture tiene una fila solo de color, asi que la rama `data-swatch-fit-px` (la que corrige CN7) no se ejercito. |
| LV05-R01 (scroll horizontal en home) | PASA | `05a-lv05-home-R01-and-invalid-first-attempt.json`: `scrollWidth - clientWidth = 0` en home a 320 y 390 px con letra 100/125/150 %, en las 3 presets. Bento solo existe en Imprint (2 tarjetas de producto) y curated showcase en las 3 (4 a 6 tarjetas). En ese archivo la parte de coleccion es invalida (rejilla de 1 columna); vale la de `05b`. |

## Fallos reales

1. `model-viewer` de la galeria recibe foco con ancho 0 en `/products/fixture-media-3d-video` (WCAG 2.4.7). Probable: `snippets/product-media.liquid:25-31` (media tipo `model`) junto con el manejo de foco de la galeria en `assets/theme.js:610-625`. Intermitente: fallo en Imprint y Archive, paso en Sartorial en la misma corrida, pero se reprodujo en Sartorial con el sondeo propio.
2. Boton "Choose options" de la tarjeta desborda su celda a 320 px con letra 150 % en la rejilla de 2 columnas, en las 3 presets. `.product-card__media`, `.product-card__content` y el boton miden 155 px frente a una tarjeta de 131 px (24 px de desborde), solo en la tarjeta de la columna izquierda con acciones. Quitar `.product-card__action` devuelve 131 px (`scripts/probe-card-action-overflow.mjs`). En Archive eso descuadra los titulos (29,8 px). Probable: `.button` con `padding: 0.7rem 1.25rem` en `assets/base.css:383-388` (el padding en rem crece con la letra) dentro de `.product-card__action` (`assets/base.css:1962`); la celda de la rejilla `minmax(0, 1fr)` no limita el min-content de la tarjeta.

## Archivos

- Crudos: `02-read-only-base.json`, `04-ro-fixture-*.json`, `06-inventory.json`, `07-cart.json`, `05a/05b`, `motion/results-01-motion-check.json` y `motion/evidence/*.png`.
- Resumenes: `*.summary.txt`. Logs: `*.log`. Scripts propios en `scripts/` (sin credenciales, leen `STOREFRONT_PASSWORD` del entorno).
