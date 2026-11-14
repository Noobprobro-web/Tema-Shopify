# Pruebas en tienda real, temas rc3 (2026-11-14)

Tienda de desarrollo, temas NO PUBLICADOS: Sartorial 190317920560, Imprint 190317953328, Archive 190317986096. Las pruebas 01 a 13 corrieron sobre el build 51fda7c; las `14-*` corrieron sobre el código desplegado después (commit b90e35c: `assets/base.css` subido con `themeFilesUpsert` desde la URL al SHA). Resultados crudos (JSON sin secretos) en esta carpeta; scripts en `scripts/`. `run.mjs` SHA 103c1551fc1d639e93a882900885ba9283d8c260d49c938543d6299ac1a4292f antes y después. Sin 429. Ninguna fila del ledger se cerró.

## Cambios de código aplicados en esta tanda
- 3D en la ficha: `assets/base.css:1169-1175` da ancho al wrapper `div.shopify-model-viewer-ui` (antes `model-viewer` medía 0 px; causa en `03-3d-focus.json` y `03c-3d-proposed-fix.json`).
- 3D en featured-product: `assets/base.css:1285-1290` (`aspect-ratio: 4 / 5` y `min-height: 20rem`; sin proporción el visor colapsaba a 0 o 150 px dentro de `.featured-product__media`, que recorta con `overflow: hidden`) y `:1294-1299` (contorno interior de 2 px, desplazamiento -4 px).
- Hallazgo propio: `model-viewer` delega el foco a su shadow DOM, así que el host nunca cumple `:focus-visible`; `model-viewer-ui` le pone la clase `.focus-visible`. Se añadió ese selector en featured-product (`:1295`) y en la ficha (`:7779`); sin él el contorno no se pintaba (medido: `outline-style: none` antes, `solid 2px` después).
- Corte a una columna de la ficha y del cajón del menú: 62rem, en la línea actual `assets/base.css:4820` y `assets/theme.js:5087`.
- Las citas `base.css:N` del ledger se desplazaron (+14, y +2/+3 más adelante); `gates:ledger` pasa con 0 incoherencias.

## Regresión sobre el código desplegado (`14-*`)
| Área | Resultado | Evidencia (`archivo:check`) |
|---|---|---|
| Despliegue | `assets/base.css` y `assets/theme.js` idénticos al repo (SHA-256) en los 3 temas | `14-deployed-sha256.json` |
| `settings_data.json` | Sin pérdida de ajustes: 160 claves hoja idénticas en los 3 temas frente al export 51fda7c; solo cambia la cabecera autogenerada de Shopify (+363 bytes). Los 4157 bytes citados no se reproducen (hoy 7231-7233) | `14-settings-data-diff.json` |
| 01 (`--read-only`) | 90 passed, 36 observed, 6 not_run; axe sin violaciones; teclado 18/18 | `14-01-ro-regression.json` |
| 02 (`--cart`) | 18/18; carrito final vacío y nota vacía en los 3 presets | `14-02-cart-regression.json:sessions[].finalCartCleanup` |
| 13 (3D en la ficha) | 30/30 sin fallos de foco; `model-viewer` 350x384 (390 px) y 382-604x768 (1280 px) | `14-13-3d-pdp.json` |
| featured-product con 3D | `model-viewer` 348x435 (390 px) y 793x991 (1280 px, primer medio), proporción 0,8; contorno 2 px solid, desplazamiento -4 px; 0 fallos de foco y 0 desborde horizontal | `14-featured-3d.json` |
| Contraste | 190 nodos únicos, 214 elementos medidos, 0 bajo umbral con el percentil 5; peor ratio 5,53:1 | `14-contrast-reconcile.json` |

Estados de featured-product (plantilla alterna `templates/index.c14fp.json`): 3D más vídeo (`fixture-media-3d-video`) probado en 3 presets a 390 y 1280 px (el 3D ocupa la fila completa en escritorio, el vídeo media columna); imagen sola, producto sin medios y sin producto sin cambios (marcador 350x450 y 795x795). No probados: solo 3D, 3D más imagen y 3D como segundo medio (no hay fixture).

## Contraste, reconciliación con el arnés
- `color-contrast` `incomplete`: el arnés da 161 nodos (no ≈170); el mismo flujo reproducido (domcontentloaded, 32 Tab, axe inmediato) da 153; el script 05 dio 61. Unión: 190 únicos (24 en ambos, 129 solo del flujo del arnés, 37 solo de 05). El flujo cambia el conteo porque axe corre sin esperar a `load` y tras tabular; 8 nodos de la ficha a 390 px no se reprodujeron.
- Limitaciones de 05 corregidas: nodos marcados con `data-cc-n` en la misma instancia que axe (se miden los nodos exactos); pseudo-elementos con `content` medidos aparte y ocultos al muestrear el fondo (resultado: 0 con texto; los 95 `pseudoContent` son fondos); `scrollIntoView` centrado y elementos `fixed`/`sticky` ajenos ocultos antes de la captura.
- Ningún nodo bajo umbral (4,5 normal, 3 grande) con el percentil 5. Peores: 5,53:1 Archive «Apply» (`.facets__actions .button[type=submit]`) y «Add to cart» (`.product-form__submit`); 6,48:1 `#CuratedTab-…decade90 > span[aria-hidden]`.
- 13 filas con píxel mínimo bajo 4,5 (percentil 5 entre 10,46 y 18,88) son `#LocalizationForm-header-country` y `#LocalizationForm-footer-country`: el nodo mide el texto del primer ítem oculto de la lista y el texto visible es otro botón. No se tratan como defectos; imágenes en `contrast-evidence/v2-*.png`.

## Pruebas del build 51fda7c (01 a 13)

| Área | Resultado | Evidencia (`archivo:check`) |
|---|---|---|
| Regresión axe/teclado/carrito | Pasa | `01-ro-base.json` (90 passed, axe 18/18 sin violaciones, teclado 18/18); `02-cart.json` 18/18 |
| 3D / foco (WCAG 2.4.7) | Falló el 3D invisible; corregido (ver arriba) | `03-3d-focus.json` 30/30 sin foco en elemento invisible; causa raíz: wrapper `div.shopify-model-viewer-ui` sin ancho, `model-viewer` en 0 px; arreglo en `assets/base.css:1169-1175`; tras el arreglo `13-3d-after-fix.json` y `14-13-3d-pdp.json` |
| «Choose options» a 320 px / 150 % | Pasa | `04-choose-options-320.json`: desborde 0, botón 131/131, desfase títulos ≤0,5 px |
| Contraste (nodos `incomplete` de axe) | 61 medidos, sin nodos bajo umbral; superado por la reconciliación de `14-contrast-reconcile.json` (190 nodos) | `05-contrast-incomplete.json` |
| V01 con vendor real (Sartorial rc3, `templates/collection.json` show_vendor=true) | Pasa | `06-v01-real-vendor.json` desfase ≤0,1 px a 320/390 y 100/125/150 %; vendor máximo 30 caracteres, el caso de 70 no existe en la tienda |
| CN7 (fila solo de color) | No cubierto | `07-cn7-color-only.json`: la rama `data-swatch-fit-px` no es alcanzable por API (swatch.color no llega al storefront) |
| B-01 cajón del menú | Pasa x3 presets (no cubre `cart-drawer` ni búsqueda predictiva) | `08-b01-drawer.json` (corte 62rem, `assets/base.css:4820`) |
| B-03 respuesta perdida | Pasa x3 presets | `09-b03-b04-cart.json:b03` (abort, aplicado+perdido, fulfill tardío 11,5 s, doble envío: sin duplicados) |
| B-04 nota de carrito | Pasa solo en Sartorial | `10-b04-notes-sartorial.json`; Imprint/Archive no cubiertos (`show_cart_note` false) |
| B-05 selector de idioma | No ejecutable | `11-shoplocales.json`: la tienda solo tiene `en` |
| C-08 bloques de confianza | Pasa en la ficha (no cubre `featured-product`) | `12-c08-trust-blocks.json` (plantillas alternas con texto corto y largo; con textos vacíos, 0 bloques por diseño) |

## Limitaciones declaradas
- «Móvil simulado» significa solo viewport 390 px, sin `isMobile` ni `hasTouch`.
- El teclado 18/18 es un smoke (32 Tab más Shift+Tab por página); no recorre cajón, búsqueda predictiva ni menú móvil.
- B-03 no cubre el reintento sin recargar la página.
- B-01 no cubre `cart-drawer` ni la búsqueda predictiva.
- C-08 no cubre `featured-product`.
- El `frame-title` serio de axe en `12-c08-trust-blocks.json` (1 nodo, fuera de los bloques de confianza) no está atribuido a la barra de preview.
- El foco de `model-viewer` se midió por estilo computado, sin captura visual ni lector de pantalla.
- No cubierto: Firefox (G4), motion en Imprint/Archive, `data-swatch-fit-px`, B-04 en Imprint/Archive (`show_cart_note` false), B-05 con segundo idioma, AR móvil, 3D solo / 3D más imagen en featured-product.

## Residuos en la tienda
- Plantillas de prueba `templates/product.c08short.json`, `templates/product.c08long.json` y `templates/index.c14fp.json` en los 3 rc3; `themeFilesDelete` está bloqueado por el conector, borrarlas desde el Admin.
- Fixture `fixture-color-only` (producto 15428972380464), definición `shopify--color-pattern` y 8 metaobjetos `fx-*`.
- Carrito: todas las corridas citadas terminaron con `itemCount` 0, nota vacía y contexto cerrado. El carrito de un script anterior que murió antes de su `finally` (como mucho 1 unidad, sin checkout) sigue sin verificar.
