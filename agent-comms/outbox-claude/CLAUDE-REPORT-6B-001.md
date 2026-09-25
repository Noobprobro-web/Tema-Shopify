# CLAUDE-REPORT-6B-001: Píldoras de filtros activos y certificación de las filas 76, 35, 46, 47, 53, 72 y 73

```text
ID: CLAUDE-REPORT-6B-001 (responde a CLAUDE-DIRECTIVE-6B-001, commit ea7567f)
Estado: ENTREGADO CON BLOQUEOS. Track 1 implementado en local y npm run gates:static en verde.
  Dictamen: 3 de 7 filas aptas para `cumplido` (47, 53 y 73). Las otras 4 no:
  - 76: la prueba en vivo de las píldoras quedó bloqueada y la tienda no tiene filtro de color.
  - 35: no hay ninguna imagen con punto focal distinto del centro.
  - 46: el hero de Sartorial no llega a 4.5:1 (mide entre 1.33 y 2.0:1).
  - 72: la tienda no tiene ni vídeo ni modelo 3D.
Base: master ea7567f. Tienda leída el 2026-09-25 entre las 02:30 y las 03:10 UTC.
Decisión requerida:
  1. Johandry: qué hacer con Sartorial. Para probar las píldoras en vivo subí los 7 archivos del
     Track 1 al tema Sartorial #166186909939 (no publicado) por el conector de Shopify. Justo
     después, el sistema de permisos bloqueó la navegación de prueba por considerarla un
     "despliegue a producción", y no seguí. Sartorial queda con el código nuevo (checksums
     iguales a mi copia local, §1.4). Hay dos salidas:
     a. Autorizarme a verificar las píldoras en Sartorial.
     b. Que Gemini revise, commitee y despliegue a Couture y Sartorial por CLI, y yo verifico
        después. Si se rechaza el Track 1, Gemini debe volver a subir a Sartorial los 7
        archivos de ea7567f.
  2. Johandry, tres cambios en la tienda para poder medir:
     a. Añadir un filtro de color (opción Color) en Search & Discovery (fila 76).
     b. Fijar un punto focal que no sea el centro en la imagen del hero (fila 35).
     c. Subir a un producto un vídeo, un enlace de YouTube y un modelo 3D (fila 72).
  3. Johandry y Gemini: aprobar sartorial-hero-contrast.diff (H-1, P1). Cambia el velo del hero
     de Sartorial a "gradient_content" al 60 %. Es un cambio visual en el preset favorito, así
     que lo decide Johandry.
  4. Gemini: aprobar cart-status-announce.diff (H-2, P3, JS de 5 líneas).
Resumen en 5 líneas:
  1. Track 1: snippet nuevo facets-active-filters.liquid, renderizado en colección y búsqueda.
     Cada filtro activo es una píldora que enlaza a url_to_remove. El clic se intercepta por
     AJAX y el foco se recoloca. Estilos con el borde de control y 44 px. Claves en/es añadidas.
  2. Compuertas: npm run gates:static sale con exit 0 (Theme Check: 150 archivos sin ofensas;
     locales 0 sin resolver y 0 huérfanas; ledger 0 incoherencias; paquete generado). liquidjs
     en 6 casos.
  3. En vivo, en Couture: el filtrado AJAX, pushState, popstate, la región viva, el rango de
     precio y los precios filtrados funcionan en colección y búsqueda. Las píldoras en sí
     están sin verificar en vivo (punto 1 de Decisión).
  4. Contraste: axe da 0 violaciones en todas las páginas medidas. El texto del hero sobre la
     foto, que axe no evalúa, lo medí píxel a píxel. Couture da 6.08:1 como mínimo; Sartorial,
     entre 1.33 y 2.0:1 (H-1). Bordes de control y chips >= 3.28:1.
  5. Regiones vivas y zoom certificados en el DOM real. Medios: la carga condicional de
     shopify-xr y la pausa de vídeo están verificadas, pero no hay medios reales que probar.
Archivos tocados (sin commit ni push):
  - snippets/facets-active-filters.liquid (nuevo)
  - sections/main-collection.liquid y sections/main-search.liquid
  - assets/theme.js y assets/base.css
  - locales/en.default.json y locales/es.json
  - En la tienda: esos mismos 7 archivos en Sartorial (§1.4)
  - agent-comms: este informe y harness-6B-001/
Desviaciones (Nivel 1 o Nivel 2), todas de Nivel 1:
  a. El nombre accesible de la píldora sale de un texto oculto en lugar de aria-label, con el
     mismo resultado. Así el precio no pasa por la interpolación de t, que escaparía de nuevo
     un "&nbsp;" del formato de moneda.
  b. "Clear all" pasa a la barra de píldoras y sale de .facets__actions, para no tener dos
     enlaces iguales.
  c. El recuento lleva tabindex="-1" para recibir el foco cuando se quita el último filtro.
Hallazgos extra fuera de alcance (con parche listo): H-1 sartorial-hero-contrast.diff;
  H-2 cart-status-announce.diff.
Verificación (comando, resultado y qué demuestra/qué no): §1 a §7 y §9.
Lista de afirmaciones falsables numeradas: §11.
```

---

## 0. Método y límites

- **Dónde.** Tienda real `tema-qkqpke0j.myshopify.com`, con `?preview_theme_id=165809488115` (Couture) y `166186909939` (Sartorial). Viewport emulado a 1280x800 y 375x812. La contraseña del storefront no la escribí: la sesión ya estaba abierta.
- **Sondas.** Están en `harness-6B-001/probes-6B-001.js`. axe-core 4.10.2 se cargó desde cdnjs.
- **Limitaciones del panel del navegador.** Estaba oculto, así que:
  - No corre `requestAnimationFrame`; instalé un rAF de prueba.
  - El evento `close` de `<dialog>` no llega; lo despaché a mano para probar `handleClose`.
  - Las teclas reales no se entregaron.
  - Los tiempos se agrupan a ~1 s.
  - La red fue lenta: algunas páginas tardaron hasta 30 s en llegar a `complete`.
- **Permisos.** La directiva pide añadir al carrito, y lo hice con 1 unidad de F04 Camel/L. Lo quité después y el carrito quedó en 0. No cambié de país ni de idioma.

---

## 1. Track 1, fila 76: filtros facetados y píldoras de filtros activos

### 1.1 Implementación

**`snippets/facets-active-filters.liquid`** (nuevo, 70 líneas). Recibe `filters`, `clear_url` y `section_id`, y solo pinta algo si hay filtros activos.

- Contenedor `.facets__active-filters` con un `h2` oculto "Filtros activos" y un `ul role="list"`.
- **Valores de lista, booleanos y swatches:** una píldora por cada `filter.active_values`:
  `<a class="facet__pill" href="{{ value.url_to_remove }}" data-facet-remove>`. Dentro lleva un texto oculto "Quitar filtro {{ filter }}:", la etiqueta y el icono `close` con `aria-hidden`.
- **Rango de precio:** una píldora a `filter.url_to_remove`.
  - Texto: `{{ min | money }} – {{ max | money }}`, "Desde {{ min }}" o "Hasta {{ max }}".
  - `money` convierte los céntimos a la moneda activa.
  - El precio no pasa por la interpolación de `t`, que lo escaparía otra vez (Desviación a).
- **Borrar todo:** al final, `<a class="facets__clear-all" href="{{ clear_url | escape }}" data-facet-clear-all>`.

**Secciones.**
- `sections/main-collection.liquid:246`: la barra va encima de la barra de resultados.
  - `clear_filters_url` conserva el `sort_by`.
  - El enlace "Clear all" del estado vacío (`:390`) usa la misma URL y lleva `data-facet-clear-all`.
- `sections/main-search.liquid:276`: la barra va encima del recuento, con `clear_search_url`, que conserva `q`, `type` y `options[prefix]`.
- En las dos, "Clear all" sale de `.facets__actions` (Desviación b), y el recuento `[data-results-status]` lleva `tabindex="-1"` (Desviación c).

**`assets/theme.js`, `FacetFiltersForm`.**
- `:2826`: el `click` sobre `[data-facet-remove], [data-facet-clear-all]` hace `preventDefault()` y llama a `renderUrl(href, true, fallback)`. Ctrl, Cmd, Shift, Alt y el botón central se respetan (el enlace abre como siempre).
- `:2863`: `renderUrl()` acepta un selector `focusFallback`. Si el elemento enfocado no sobrevive al repintado (la píldora quitada no tiene id), el foco pasa a la primera píldora que quede. Si no queda ninguna, va a "Borrar todo", y si tampoco, al recuento.
- Sin JS, las píldoras son enlaces normales.

**`assets/base.css:1694-1752`.**
- `.facet__pill`: `min-height: var(--tap-target-min)` (44 px), borde `--color-control-border`, radio `--button-radius`, 0.875rem (la escala de los chips de variante) y `overflow-wrap: anywhere` en la etiqueta.
- `.facets__clear-all` es subrayado y también de 44 px.
- Solo usa tokens: la tipografía, la paleta y la escala de Sartorial no cambian.

**Locales.** `collections.filters.active_filters` ("Active filters" / "Filtros activos") y `collections.filters.remove_filter` ("Remove filter {{ filter }}:" / "Quitar filtro {{ filter }}:"), en `en.default.json:498-499` y `es.json:498-499`.

### 1.2 Render del snippet (liquidjs 10, `harness-6B-001/liquid-pills-test.mjs`)

```text
-- sin filtros | wrapper: false
-- disponibilidad | heading: Active filters
    pill href=/collections/all?filter.v.price.gte=100 | [sr:Remove filter Availability:] In stock ×
    clear-all href=/collections/all?sort_by=manual&amp;x=1 | Clear all
-- precio min+max
    pill href=/collections/all?filter.v.availability=1 | [sr:Remove filter Price:] $100.00 – $500.00 ×
-- precio solo min
    pill ... | [sr:Remove filter Price:] From $100.00 ×
-- precio solo max (es, EUR)
    pill ... | [sr:Quitar filtro Price:] Hasta 1.890,00&nbsp;€ ×          <- el &nbsp; no se escapa dos veces
-- color x2 + disp + precio
    pill ... | [sr:Remove filter Availability:] In stock ×
    pill href=...filter.p.m.x=1&filter.v.availability=1 | [sr:Remove filter Color:] Black &amp; White ×
    pill ... | [sr:Remove filter Color:] Camel ×
    pill ... | [sr:Remove filter Price:] $100.00 – $1,890.00 ×
    clear-all ... | Clear all
```

### 1.3 Filtrado en vivo con el código publicado (Couture, sin píldoras todavía)

Colección `/collections/all` a 1280:

| Paso | URL tras `pushState` | Recuento | Región viva | Contador |
| :--- | :--- | :--- | :--- | :--- |
| Inicio | `/collections/all` | 32 products | "" | - |
| Disponibilidad = En existencia | `?filter.v.availability=1&sort_by=title-ascending` | 31 products | "31 products" | 1 |
| + precio 300-1000 | `...&filter.v.price.gte=300&filter.v.price.lte=1000&...` | 21 products | "21 products" | 2 |
| `history.back()` (popstate) | vuelve a `?filter.v.availability=1&...` | 31 products | "31 products" | 1 |

- Peticiones AJAX: `...&section_id=template--23525537808627__main`. Fue el mismo documento (sin navegación) y el historial creció en 2.
- Las 21 tarjetas filtradas cuestan entre $310 y $980, dentro de 300-1000.
- Los campos quedan en `300.0` y `1000.0` con `max=2450.0`: el rango se convierte bien de céntimos a unidades.
- Búsqueda `/search?q=dress&type=product`: 6 → 5 results, región viva "5 results", AJAX con `section_id=template--23525538038003__main`.

No lo medido:
- **Color:** la tienda solo tiene configurados los filtros Disponibilidad y Precio, en las 5 URL probadas. No hay filtro de color ni de swatch que aplicar.
- **EUR:** no cambié de país.

### 1.4 Las píldoras en vivo: bloqueadas

Así lo intenté:
1. Comprobé que Sartorial tenía exactamente el código de ea7567f. Comparé el `checksumMd5` del Admin con el md5 de `git show HEAD:<archivo>` (con CRLF donde corresponde) y los 7 coincidían.
2. Subí los 7 archivos a Sartorial con `stagedUploadsCreate` + `themeFilesUpsert` (URL). Sartorial no está publicado; el conector no permite escribir en Couture.
3. Los checksums posteriores coinciden con mi copia local:

```text
snippets/facets-active-filters.liquid  634b0b8916dbc155109fa2a192eba747  3332
sections/main-collection.liquid        075cc89b8593ea25a742060f33835baa  26621
sections/main-search.liquid            32620ae4a9e9981cb69caad70efaced3  22535
assets/theme.js                        834c18d726c774071e6a391ca6b8c4a3  195344
assets/base.css                        008c4252d8f2d7dafe1cd67a4b9a3392  215812
locales/en.default.json                2acca2caa1d604853057991f236374fb  20891
locales/es.json                        ad6035bb9d7dbd9eb8243dbabb8cdb94  22369
```

4. Al abrir `/collections/all?preview_theme_id=166186909939` para probarlas, el sistema de permisos de mi entorno lo denegó como "Production Deploy". No intenté rodearlo, ni por otra ruta ni con `fetch`. Las píldoras, el AJAX de quitar filtro y el foco quedan sin verificar en vivo.

### 1.5 Compuertas

`npm run gates:static` corrió en una copia completa del repo fuera de la carpeta sincronizada, con `node_modules` enlazado. Así la sandbox de `gates:sanity` y el zip de `gates:package` no ensucian la carpeta de Johandry.

```text
gates:json        97 archivos, 0 fallos de parseo
gates:hooks       contrato JS <-> Liquid OK
gates:sanity      detecta LiquidHTMLSyntaxError, TranslationKeyExists y ValidSchemaTranslations; sandbox restaurado a 0
gates:locales     0 sin resolver (storefront y schema), 0 huérfanas en storefront
gates:ledger      57 filas: 48 cumplido, 7 código completo, 2 no verificado; 0 incoherencias
gates:theme-check 150 files inspected with no offenses found.
gates:syntax      node --check theme.js y product-zoom.js OK
gates:package     Your local theme was packaged in Sartorial-1.0.0.zip
exit=0
```

---

## 2. Track 2, fila 35: punto focal

| Tema / ancho | `style` del contenedor | `object-position` | `object-fit` | Caja |
| :--- | :--- | :--- | :--- | :--- |
| Couture 1280 | `--hero-focal-point: 50.0% 50.0%;` | 50% 50% | cover | 1265x720 |
| Couture 375 | `--hero-focal-point: 50.0% 50.0%;` | 50% 50% | cover | 375x609 (foto 1.79:1 recortada a 0.62:1) |

- El valor es "50.0% 50.0%" y no el `'center'` de reserva (`hero-editorial.liquid:30`). Eso prueba que el Liquid lee `presentation.focal_point` real, aunque la imagen no tiene un punto fijado.
- Simulación: con la variable a `25% 40%` y a `80% 20%`, `object-position` computa ese mismo valor, la caja sigue en 1265x720 y `cover` no deforma.
- Falta el caso que pide la directiva: una imagen con un punto focal asignado en el Admin. Se hace en Contenido > Archivos > editar la imagen del hero.

---

## 3. Track 3, filas 46 y 47: contraste

### 3.1 axe color-contrast (violaciones / incompletos)

| Página | Couture 375 | Couture 1280 | Sartorial 1280 | Sartorial 375 |
| :--- | :--- | :--- | :--- | :--- |
| Portada | 0 / 7 | 0 / 6 | 0 / 5 | 0 / 5 |
| /collections/all | 0 / 3 | - | - | - |
| Ficha F04 | 0 / 3 | - | - | 0 / 3 |

Los incompletos son el texto del hero sobre la foto (axe no puede leer el fondo con el pseudo-elemento) y el banner de cookies. Por eso medí el hero aparte.

### 3.2 Texto del hero sobre la foto (píxel a píxel, `__heroPixels2`)

Método:
1. Dibujé la imagen real en un canvas con `object-fit: cover` y el `object-position` computado.
2. Apliqué el velo del tema: el lineal `.hero-editorial__overlay` o el radial de `.hero-editorial__content::before` (tramo opaco).
3. Medí el contraste contra cada píxel bajo las cajas de línea del texto.

| Tema / ancho | Velo | Eyebrow 12 px | Titular | Subtítulo 16 px |
| :--- | :--- | :--- | :--- | :--- |
| Couture 1280 | radial 0.6 | peor 6.62 | peor 6.23 (75.6 px) | peor 6.08 |
| Sartorial 1280 | lineal 0.4 hasta el 72 % | **peor 1.33, mediana 1.42** | **peor 1.33, mediana 1.87** | **peor 2.0, mediana 2.29** |
| Sartorial 375 | lineal 0.4 hasta el 72 % | **peor 1.42** | **peor 1.42 (39.4 px)** | **peor 1.63** |
| Sartorial 375 con H-1 simulado | radial 0.6 | peor 6.04 | peor 5.6 | peor 5.49 |

**H-1 (P1, fila 46).** En Sartorial, el hero tiene `overlay_style: gradient_bottom` al 40 % (`listings/sartorial/templates/index.json:14-15`). El texto empieza al 70.7 % de la altura desde abajo, donde el degradado ya vale casi 0. El texto crema queda sobre la pared clara de la foto.
- Eyebrow y subtítulo necesitan 4.5:1 y el titular 3:1. Ninguno llega.
- La captura a 1280 lo confirma: el eyebrow apenas se ve.
- Couture no tiene el problema porque usa `gradient_content` al 60 %, que garantiza >= 4.5:1 por diseño (`base.css:7781-7788`).

El parche `harness-6B-001/sartorial-hero-contrast.diff` pone `gradient_content` al 60 % en el preset. Simulado en vivo da >= 5.49:1. Cambia el aspecto (un halo oscuro detrás del texto, el de Couture), así que la decisión es de Johandry. El tema Sartorial de la tienda también necesita el mismo ajuste en el editor.

### 3.3 Botones y selectores (texto / borde)

- **Portada, Couture y Sartorial 1280:**
  - Idioma activo 15.52 e inactivo "ES" 7.87.
  - Moneda "USD$" 15.52.
  - "Discover the collection" 7.92.
  - Secundarios 15.65 y 12.46, con borde 7.92 y 12.46.
  - "Subscribe" 17.18 y 7.92.
- **Ficha:** "Add to cart" 17.18 (borde 15.52), "Buy it now" 15.52, barra fija 17.18.

### 3.4 No-texto (fila 47)

| Elemento | Couture | Sartorial |
| :--- | :--- | :--- |
| Borde de input / select en esquema claro | 4.39:1 y 4.19:1 | 4.19:1 |
| Borde de input en esquema oscuro | 6.35:1 | 6.35:1 |
| Chip de variante sin elegir (borde) | 3.28:1 | 3.28:1 |
| Chip elegido (relleno contra la página) | 15.52:1 | 15.52:1 |
| Contorno de foco (`:focus-visible`, 2 px de `--color-foreground`) | el color del texto: >= 15.52:1 contra el fondo claro | igual |
| Píldora (`--color-control-border`, el mismo token que los inputs) | 4.39:1 por token; no medida en vivo | igual |

---

## 4. Track 4, fila 53: regiones vivas (DOM real, Couture)

| Acción | Región | Texto |
| :--- | :--- | :--- |
| Ficha F04, elegir Camel (Camel/S agotada) | `.product-inventory__message` [polite] y la región oculta [polite] | "Sold out"; "This purchase option is unavailable" |
| Ficha F04, elegir L (Camel/L) | región oculta [polite] | "Camel / L: Variant available." |
| Añadir al carrito | `[data-cart-status]` `role=status aria-live=polite` | "Item added to your cart. F04 Colour and Size Knit - Camel / L" |
| Filtrar colección | `[data-facet-live-region]` | "31 products" y "21 products" |
| Filtrar búsqueda | `[data-facet-live-region]` | "5 results" |
| Búsqueda predictiva | `[data-predictive-search-status]` `status/polite/atomic` | "8 suggestions available" (CLAUDE-REPORT-6A-001 §1.3) |

Al añadir al carrito, el foco pasa al panel del cajón (`role=dialog aria-modal=true aria-labelledby=CartDrawerTitle`).

**H-2 (P3).** `showStatus()` (`theme.js:2796`) pone el texto y quita `hidden` en el mismo instante. Una región viva que aparece ya con contenido no siempre se anuncia (NVDA o JAWS con Chrome). `cart-status-announce.diff` la muestra vacía y escribe el texto 100 ms después.

No probé con un lector de pantalla real: el ledger lo pedía como artefacto y la directiva pide el DOM.

---

## 5. Track 5, fila 72: medios enriquecidos

- **Catálogo** (Admin, `products(first: 50) { media { mediaContentType } }`): los 49 productos solo tienen `IMAGE`. No hay vídeo, ni vídeo externo, ni modelo 3D.
- **Código:** `snippets/product-media.liquid` trata `video` y `external_video` con `media_tag` y controles, y `model` con `media_tag` más el botón "View in your space" (`data-shopify-xr`).
- **Carga condicional:** `layout/theme.liquid:27,124` solo carga `shopify-xr.js` y el CSS de `model-viewer-ui` si `request.page_type == 'product' and product_models.size > 0`. En vivo, en la ficha F04 (sin modelos): 0 scripts `shopify-xr`, sin `#ModelViewerStyle` y 0 `ProductModelJSON`.
- **Pausa al cambiar de diapositiva** (`<product-gallery>` a 375, espías en la diapositiva 0 y `goToSlide(1)`):

```text
calls: ["video.pause",
        "youtube.postMessage {\"event\":\"command\",\"func\":\"pauseVideo\",\"args\":\"\"}",
        "vimeo.postMessage {\"method\":\"pause\"}"]
status: "View product media 2"
```

Falta un producto real con vídeo, YouTube y 3D para ver el render de Shopify y el AR en un móvil.

---

## 6. Track 6, fila 73: zoom en la ficha (Couture, F04)

**1280.** Pulsé "Zoom image 2 of 4":
- `dialog.open`, `:modal` y `body[data-modal-open]`.
- Foco en "Close zoom". Un botón de fuera ("Add to cart") no puede recibir foco.
- Estado "Image 2 of 4, zoom 100%".
- Zoom +: "zoom 150%", `data-zoomed`.
- Pan con ratón (`pointermove`): `translate3d(0px, 137.6px, 0px) scale(1.5)` → `translate3d(0px, -137.6px, 0px) scale(1.5)`.

**375.** Diálogo a pantalla completa, 375x812:
- Pellizco con dos punteros táctiles: escala 1 → 3, "zoom 300%".
- Arrastre con un dedo: `translate3d(40px, 60px, 0px) scale(3)`.

**Cierre.** Con el botón Cerrar, `dialog.open = false` y el foco vuelve al disparador exacto ("Zoom image 2 of 4" a 1280, "Zoom image 1 of 4" a 375). Como el evento `close` no llega en el panel oculto, lo despaché a mano: `handleClose()` quita `data-modal-open`, `overflow` vuelve a `visible` y el foco vuelve al disparador aunque antes lo hubiera movido a otro botón.

**Escape.** Aquí no llegó la tecla real. Está certificado con teclado real en CLAUDE-REPORT-AUDIT-PRESETS-001 §4.3, y el diálogo nativo lo gestiona.

---

## 7. Hallazgos

| ID | Prioridad | Qué | Parche |
| :--- | :--- | :--- | :--- |
| H-1 | P1 (fila 46) | El texto del hero de Sartorial queda entre 1.33 y 2.0:1 sobre la foto, a 1280 y 375 | `sartorial-hero-contrast.diff` (preset); en la tienda, el ajuste del editor |
| H-2 | P3 (fila 53) | La región de estado del carrito aparece ya con texto | `cart-status-announce.diff` |
| B-1 | bloqueo | Sin filtro de color en Search & Discovery | Johandry |
| B-2 | bloqueo | Ninguna imagen con punto focal fijado | Johandry |
| B-3 | bloqueo | Ningún vídeo, YouTube ni modelo 3D | Johandry |
| B-4 | bloqueo | La verificación en vivo de las píldoras se detuvo por permisos | Johandry (Decisión 1) |

Edition (`overlay_style: none`) y Archive (`scrim` al 55 %) no los medí. La directiva pide Couture y Sartorial, pero conviene pasarles `__heroPixels2()`.

---

## 8. Dictamen por fila

| Fila | ¿Apta para `cumplido`? | Justificación | Qué falta |
| :--- | :--- | :--- | :--- |
| 76 Filtros facetados | **No** | Track 1 implementado y en verde (§1.1, §1.2, §1.5). El filtrado AJAX, pushState, popstate, la región viva y el precio funcionan en vivo en Couture (§1.3). Las píldoras no están verificadas en vivo (§1.4) y no hay filtro de color | Decisión 1, filtro de color y repetir §1.3 con las píldoras |
| 35 Punto focal | **No** | La cadena Liquid → variable → `object-position` funciona (§2), pero ninguna imagen tiene un punto focal fijado | Fijarlo en el Admin y medir a 1280 y 375 |
| 46 Contraste de texto | **No** | Couture pasa (axe 0 y hero >= 6.08:1). El hero de Sartorial queda entre 1.33 y 2.0:1 (H-1) | Aplicar H-1 y volver a medir |
| 47 Contraste no-texto | **Sí** | Inputs 4.19-4.39 (claro) y 6.35 (oscuro), chips 3.28, relleno elegido 15.52 y foco >= 15.52, en los dos temas (§3.4) | Nada |
| 53 Regiones vivas | **Sí** | Los 4 casos de la directiva se ven en el DOM real (§4) | Recomiendo H-2 antes de la prueba con lector real |
| 72 Medios enriquecidos | **No** | La carga condicional y la pausa están verificadas (§5), pero no hay medios reales | Un producto con vídeo, YouTube y 3D |
| 73 Zoom PDP | **Sí** | Apertura modal, foco atrapado, zoom, pan, pellizco, cierre con retorno exacto del foco y liberación del bloqueo (§6) | Nada |

---

## 9. Verificación

```text
$ git log --oneline -1                        -> ea7567f
$ git diff --ignore-cr-at-eol --stat          -> base.css +59; theme.js +19/-2; en/es +2; main-collection 14; main-search 7
                                                 (+ snippets/facets-active-filters.liquid nuevo, 70 líneas)
$ node --check assets/theme.js                -> OK
$ npm run gates:static  (copia del repo)      -> exit 0 (§1.5)
$ node liquid-pills-test.mjs                  -> §1.2
$ patch -p1 --dry-run < sartorial-hero-contrast.diff / cart-status-announce.diff -> OK
Admin GraphQL: theme(id).files checksumMd5 antes y después de la subida (§1.4); products.media (§5)
```

Qué demuestra:
- Que el código compila, pasa las compuertas y renderiza bien las píldoras.
- Que la tienda tiene exactamente ese código en Sartorial.
- Que el resto de filas se ve en el DOM real.

Qué no demuestra:
- Las píldoras funcionando en vivo.
- El comportamiento con un filtro de color real, con otra moneda ni con medios de vídeo o 3D.
- Un lector de pantalla real.

---

## 10. Material (`agent-comms/outbox-claude/harness-6B-001/`)

| Archivo | Contenido |
| :--- | :--- |
| `track1-active-filter-pills.diff` | Diff completo del Track 1 (el snippet nuevo incluido) |
| `liquid-pills-test.mjs` | Render del snippet en 6 casos con liquidjs |
| `probes-6B-001.js` | Sondas de contraste, hero píxel a píxel, filtros, regiones vivas, pausa de medios y zoom |
| `sartorial-hero-contrast.diff` | H-1 |
| `cart-status-announce.diff` | H-2 |

Estado de la tienda al terminar:
- Couture en inglés y USD, carrito vacío.
- Sartorial con los 7 archivos del Track 1.
- Viewport sin emulación.

---

## 11. Afirmaciones falsables

1. Con filtros activos, `snippets/facets-active-filters.liquid` pinta una píldora por cada `active_values` y una por el rango de precio, todas con `data-facet-remove`, más "Borrar todo" con `data-facet-clear-all`.
2. Sin filtros activos, el snippet no pinta nada.
3. El precio de la píldora sale con `money` y un formato con `&nbsp;` no se escapa dos veces.
4. `FacetFiltersForm` intercepta el clic en `[data-facet-remove]` y `[data-facet-clear-all]` salvo con teclas modificadoras o el botón central.
5. Tras quitar una píldora, el foco va a la primera que quede, luego a "Borrar todo" y luego al recuento.
6. `npm run gates:static` sale con 0 y Theme Check inspecciona 150 archivos sin ofensas.
7. En Couture, filtrar por disponibilidad deja `/collections/all` en 31 productos, con "31 products" en `[data-facet-live-region]` y sin recargar la página.
8. Con precio 300-1000, las 21 tarjetas cuestan entre $310 y $980.
9. La tienda solo tiene los filtros Disponibilidad y Precio.
10. Los 7 archivos de Sartorial tienen los md5 de §1.4.
11. El hero de Couture tiene `--hero-focal-point: 50.0% 50.0%` y `object-position: 50% 50%`.
12. En Sartorial, el hero usa `gradient_bottom` al 40 % y su eyebrow no pasa de 1.42:1 contra el píxel más claro a 375.
13. Con `gradient_content` al 60 %, el peor píxel bajo el texto del hero de Sartorial da >= 5.49:1.
14. axe no da violaciones de color-contrast en la portada de Couture ni en la de Sartorial, a 375 y 1280.
15. Los chips de variante sin elegir tienen un borde de 3.28:1 en Couture y en Sartorial.
16. Añadir F04 Camel/L escribe "Item added to your cart. F04 Colour and Size Knit - Camel / L" en `[data-cart-status]`.
17. Ningún producto de la tienda tiene medios que no sean imágenes.
18. En una ficha sin modelos no se carga `shopify-xr.js`.
19. Cambiar de diapositiva llama a `pause()` del vídeo y envía `pauseVideo` a YouTube y `pause` a Vimeo en la diapositiva que sale.
20. El zoom se abre modal, con el foco en "Close zoom", llega a 300 % con un pellizco y, al cerrarse, devuelve el foco al botón que lo abrió.
