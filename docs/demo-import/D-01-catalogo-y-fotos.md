# D-01: catálogo y fotografías de las demos (importación manual)

Plan: `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md:301` (D-01: V-01, LV-23, LV-24, V-07). Alcance según D23 (`docs/decisions.md:242`): entregables en el repo, sin escribir en tiendas; Johandry importa.

## Directiva

Cada preset (Sartorial, Imprint y Archive) necesita un catálogo propio, sin productos de QA en las rutas comerciales y sin placeholders SVG en Home, PLP y PDP. Este paquete da el CSV de productos, la definición de colecciones y la lista cerrada de fotos por superficie. No toca el tema. Las plantillas ya apuntan a estos handles, y `node scripts/demo-import.mjs check` comprueba que todos existen.

## Entregables

| Archivo | Contenido |
|---|---|
| `docs/demo-import/sartorial-products.csv` | 24 productos y 253 variantes (Color × Size). Estado `draft` hasta aprobación de Johandry |
| `docs/demo-import/imprint-products.csv` | 13 productos y 38 variantes (Finish, más Size en tote y desk mat). Estado `draft` |
| `docs/demo-import/archive-products.csv` | 12 piezas únicas, una variante cada una, inventario 1, sin sobreventa. Estado `draft` |
| `docs/demo-import/<preset>-photos.csv` | Fotos que faltan, una fila por hueco de imagen: setting del editor, ancho mínimo y encuadre. Incluye Home, PLP, encabezado, la página About (`main-about`: imagen de `hero_story` y `image_1` a `image_3` de `atelier_gallery`) y las vistas mínimas de cada producto |
| `docs/demo-import/data/<preset>.json` | Fuente de los CSV: productos, colecciones, páginas, menús y fotos |
| `scripts/demo-import.mjs` | `build` regenera los CSV y `check` los valida (sin red) |

Formato: CSV de productos de Shopify con las columnas clásicas (`Handle`, `Title`, `Body (HTML)`, `Option1 Name`, `Variant Price`, `Status`…). No lleva columnas de imagen: las fotos se suben aparte. Shopify indica que, en general, los campos omitidos conservan sus valores; hay excepciones cuando las columnas incluidas dependen de columnas omitidas. No asumas que todas las imágenes y asociaciones sobrevivirán a cualquier sobrescritura. Antes de importar, compara la cabecera con la plantilla de ejemplo que descargas en Productos > Importar. Si Shopify rechaza una columna, avísame y adapto el generador.

`Status` y SKU: `Status` va solo en la primera fila de cada producto y queda vacío en las filas de variante; la columna SKU no se incluye. Está bien así. La plantilla oficial de Shopify (`product_template.csv`, enlazada desde https://help.shopify.com/en/manual/products/import-export/using-csv, consultada el 2026-11-10) deja `Status` vacío en las filas de variante del mismo producto, y la página dice que el SKU solo «can't be blank if you use a custom fulfillment service»; aquí el fulfillment es `manual`. La importación de prueba del paso 2 lo confirma igualmente.

Moneda: los precios están en **USD** (fuente CLAUDE-DEMO-001 para Sartorial y GPT-REPORT-014 para Imprint y Archive). El CSV lleva solo el número, sin símbolo, como pide Shopify. Antes de importar, comprueba que la moneda de la tienda es USD (Configuración > Tienda > Moneda de la tienda). Si la tienda usa otra moneda, Shopify toma las cifras en esa moneda sin convertirlas: avísame y no importes.

Inventario: Archive lleva `Variant Inventory Tracker = shopify` y `Variant Inventory Qty = 1`. Shopify solo aplica esa cantidad en tiendas con **una única ubicación**; con varias, la columna no sirve y la cantidad se fija a mano por ubicación en Productos > Inventario después de importar. Sartorial e Imprint no rastrean inventario: todas sus variantes salen siempre disponibles y la demo no muestra estados de agotado. Johandry decide si eso vale para la demo o si se rastrea inventario.

Handle repetido: `structured-tote` existe en Sartorial (Structured Tote) y en Imprint (Structured Tote in Calfskin). Si cada preset va a su propia tienda, no pasa nada. Si dos presets comparten tienda, la segunda importación sobrescribiría o rechazaría el producto de la primera. En ese caso se cambia el de Sartorial a `structured-leather-tote`, porque ninguna plantilla de Sartorial lo usa y `listings/imprint/templates/index.json` sí usa `structured-tote`. El cambio es una línea en `data/sartorial.json` más `build` y `check`; no se hace mientras Johandry no confirme que comparten tienda.

Las colecciones no se importan por CSV. Todas son automáticas, con la condición «la etiqueta del producto es igual a X»:

| Preset | Handle | Título | Etiqueta | Orden |
|---|---|---|---|---|
| Sartorial | `new-forms` | New forms | `autumn-series` | Manual o «más vendidos» |
| Sartorial | `the-autumn-series` | The Autumn Series | `autumn-series` | Solo si la tienda usa `templates/index.json` (plantilla raíz) |
| Sartorial | `permanent-collection` | Permanent collection | `permanent` | Escribe a mano el handle `permanent-collection` |
| Sartorial | `tailoring` | Tailoring | `tailoring` | |
| Sartorial | `knitwear` / `outerwear` / `accessories` | Knitwear / Outerwear / Accessories | igual que el handle | Para el menú (D-01-N) |
| Imprint | `leather-goods` | Leather goods | `leather-goods` | Manual: el orden de `data/imprint.json` |
| Imprint | `daily-objects` | Daily objects | `daily-objects` | Manual: el orden de `data/imprint.json` |
| Imprint | `desk-and-study` | Desk and study | `desk-and-study` | Manual. En la tienda sartorial-edition el handle era `desk-study` y no coincide con las plantillas |
| Archive | `permanent-archive` | Permanent archive | `permanent-archive` | Manual: el orden de `data/archive.json` |
| Archive | `restored-pieces` | Restored pieces | `restored-pieces` | Manual |

## Pasos de importación (Johandry)

1. Elige la tienda de demo de cada preset (pendiente: ver más abajo). En una tienda que ya tiene productos, exporta antes todo el catálogo (Productos > Exportar) como copia de seguridad.
2. **No importes todavía:** primero Johandry aprueba el catálogo, los precios, las tallas, las afirmaciones y el destino de cada preset. Los tres CSV se generan con estado `draft`; no cambies a `active` ni los publiques antes de esa aprobación. Después de aprobar, prueba primero un subconjunto en una tienda de desarrollo y verifica imágenes, asociaciones de imágenes y dependencias. Productos > Importar > sube `<preset>-products.csv`. Marca «Sobrescribir productos con el mismo handle» solo si la tienda ya tiene esos handles. Cambiar los valores de opciones puede borrar los IDs de variantes existentes y crear IDs nuevos; confirma si eso afecta referencias externas antes de importar el catálogo completo.
3. Crea las colecciones de la tabla: Productos > Colecciones > Crear, tipo automático, condición de etiqueta y handle exacto en «Editar SEO del sitio web». Publícalas en Tienda online.
4. Sube las fotos de `<preset>-photos.csv`:
   - Las filas «product image» van en cada producto, con el texto alternativo de la columna `Alt text hint`, revisado.
   - Las filas de Home, Collection y Header van en Tienda online > Personalizar, en la sección y el setting indicados.
   - Las filas About van en Personalizar > Páginas > About (plantilla `page.about`), bloques «hero_story» y «atelier_gallery». Sin ellas la página muestra placeholders: ver N-1 en `D-01-N-navegacion.md`.
   - La imagen de colección se pone en cada colección.
5. Mantén los tres catálogos en `draft` hasta que Johandry confirme la aprobación factual y comercial. Los tres presets requieren además resolver las verificaciones de afirmaciones enumeradas abajo. Solo Johandry decide si luego se activan.
6. Productos de QA (LV-24) en `tema-qkqpke0j`: `qa5a-f01-single`, `qa5a-f02-sold-out`, `qa5a-f03-size-only`, `qa5a-f04-colour-size`, `qa5a-f05-native-swatches`, `qa5a-f06-subscription`, `qa5a-f10-hostile`, `qa5a-f11-many-swatches` y la colección `qa-sprint-5a` (`agent-comms/outbox-claude/harness-5A-002/fixtures-5a.json`). Si esa tienda va a ser una demo, retíralos del canal Tienda online (no hace falta borrarlos). Antes, coordínalo: A-01 y gate5 aún los usan para medir (plan V4.1:301, «no retirar fixtures de un entorno hostil que aún se necesita medir sin coordinarlo»).
7. Avisa cuando termines. Un agente distinto del escritor revisa R-Demo (Home, PLP y PDP, en móvil y escritorio, por preset) después de la importación aprobada; hasta entonces estos CSV son preparación, no evidencia de catálogo desplegado.

## Pendiente de Johandry (no se inventa)

- Johandry elige las tiendas de destino. La autorización actual limita las pruebas del tema a previews no publicadas de `tema-qkqpke0j`; la importación D-01 espera la elección y aprobación explícita de destinos y catálogo. C-02 depende de la tienda limpia que crea Johandry.
- Fotografías con derechos. Los árboles `demo-assets/` están en tu equipo y no en el repo (`agent-comms/outbox-gpt/DEMO-ASSETS-DIVERGENCE.md`). Revisa si cubren estas filas antes de producir fotos nuevas.
- Escala real de tallas y precios de Sartorial (ver `D-01-L-idioma.md`).
- Verificación de afirmaciones antes de activar, en los tres presets. Por C-08 (Johandry, 2026-11-02: retirar o sustituir por contenido neutro las promesas sin respaldo, sin excepciones) las descripciones ya no declaran origen geográfico, denominaciones de origen o de calidad, sostenibilidad, trabajo a mano, historia de la marca ni promesas de ajuste o rendimiento. Se sustituyeron por texto descriptivo neutro, sin datos nuevos. En una segunda pasada (revisión de `19bba45`) se quitaron también las frases que dicen lo que la prenda hace por el cliente (caída, movimiento, ajuste, uso, protección, comodidad): las descripciones solo enumeran material, construcción y medidas. Lo que queda (material genérico, construcción visible y cifras de la fuente) también se verifica:
  - **Sartorial** (18 descripciones y un título cambiados). Retirado: «woven in Biella» (`serra-coat`), «Egyptian cotton» (`doppio-trench`), «spun in Arequipa» (`cocoon-cardigan-coat`), «recycled down» y el abotonado dentro del Serra Coat (`quilted-silk-liner`), la fábrica familiar de Umbria «since the first collection» (`cashmere-rib-crew`), «the cut that gives the house its name», «virgin wool» y el entretelado cosido a mano (`nove-blazer`), «Cool wool» y la promesa de que el pliegue aguanta (`pleated-wide-trouser`), «long-staple», la máquina manual y la recuperación al lavar (`hand-framed-cotton-polo`, cuyo título pasa a Knitted Cotton Polo), «vegetable-tanned» y el cambio de color (`leather-belt`), «Fits a thirteen-inch laptop» y las asas cosidas a mano (`structured-tote`), el «archive studio» y el dobladillo a mano (`silk-twill-square`), el flecado a mano (`cashmere-scarf`), «heat-set» (`pleated-midi-skirt`), «combed» (`striped-cotton-shirt`), «travels well» (`column-knit-dress`), «does not open when walking» (`wrap-wool-skirt`), «one size generous» (`silk-charmeuse-blouse`) y «without bulk at the shoulder» (`fine-merino-turtleneck`). Queda por verificar: composición (lana, cachemira, seda, alpaca, plumón, cupro, corozo, piel, latón), cifras (4 cm, 4 % de elastano, 19 micras, 120 hilos, 180 × 45 cm, 90 cm) y acabados fotografiados.
  - **Imprint** (8 descripciones y un título cambiados). Retirado: «full-grain» (cuatro productos), «vegetable-tanned» (dos), «solid brass» y la pátina con el uso (`milled-brass-paperweight`, cuyo título pasa a Brass Paperweight), los cantos acabados a mano (`structured-tote`), «burnished» (`slim-bifold-wallet`) y «protects» en `padded-laptop-sleeve`. Queda por verificar: material, forros, herrajes, cierres, todas las medidas, el ajuste de dispositivos y el acabado fotografiado de cada variante (GPT-REPORT-014; plan V4.1:237).
  - **Archive** (3 descripciones cambiadas y la línea de talla retirada de 10). Retirado: botones de asta (`1989-structured-wool-waistcoat`), «early-nineties» (`1992-silk-twill-blouse`), botones montados a mano (`1996-satin-evening-jacket`) y «Single piece. Label size: …» (ver D-01-L). Las medidas de `1994-leather-document-portfolio` (34 × 25 × 3 cm) y `1997-printed-silk-square` (90 × 90 cm) se retiraron porque no tienen respaldo ni son imprescindibles; si Johandry mide las piezas, se vuelven a añadir con `build`. Queda por verificar: el año del título y del handle, la composición, la talla de etiqueta, el estado y la procedencia de cada pieza, y si las tres de `restored-pieces` están de verdad restauradas. La colección «Runway 1989-1999» no se crea sin pruebas.
  - Los handles `hand-framed-cotton-polo` y `milled-brass-paperweight` conservan las palabras retiradas porque las usan colecciones o referencias; se ven en la URL. Johandry decide si se renombran antes de importar.
- Búsqueda de marca registrada del vendor LINEA NOVE. En Imprint y Archive el vendor va vacío y Shopify usa el nombre de la tienda.

## Fuera de alcance

D-01-V (narrativa técnica y CTA de Imprint), D-02-T (guía de tallas), cambios de código y cualquier escritura en tienda.
