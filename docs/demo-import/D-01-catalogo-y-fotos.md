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
| `docs/demo-import/<preset>-photos.csv` | Fotos que faltan, una fila por hueco de imagen: setting del editor, ancho mínimo y encuadre. Además, las vistas mínimas de cada producto |
| `docs/demo-import/data/<preset>.json` | Fuente de los CSV: productos, colecciones, páginas, menús y fotos |
| `scripts/demo-import.mjs` | `build` regenera los CSV y `check` los valida (sin red) |

Formato: CSV de productos de Shopify con las columnas clásicas (`Handle`, `Title`, `Body (HTML)`, `Option1 Name`, `Variant Price`, `Status`…). No lleva columnas de imagen: las fotos se suben aparte. Shopify indica que, en general, los campos omitidos conservan sus valores; hay excepciones cuando las columnas incluidas dependen de columnas omitidas. No asumas que todas las imágenes y asociaciones sobrevivirán a cualquier sobrescritura. Antes de importar, compara la cabecera con la plantilla de ejemplo que descargas en Productos > Importar. Si Shopify rechaza una columna, avísame y adapto el generador.

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
   - La imagen de colección se pone en cada colección.
5. Mantén los tres catálogos en `draft` hasta que Johandry confirme la aprobación factual y comercial. Imprint y Archive requieren además resolver las verificaciones de afirmaciones enumeradas abajo. Solo Johandry decide si luego se activan.
6. Productos de QA (LV-24) en `tema-qkqpke0j`: `qa5a-f01-single`, `qa5a-f02-sold-out`, `qa5a-f03-size-only`, `qa5a-f04-colour-size`, `qa5a-f05-native-swatches`, `qa5a-f06-subscription`, `qa5a-f10-hostile`, `qa5a-f11-many-swatches` y la colección `qa-sprint-5a` (`agent-comms/outbox-claude/harness-5A-002/fixtures-5a.json`). Si esa tienda va a ser una demo, retíralos del canal Tienda online (no hace falta borrarlos). Antes, coordínalo: A-01 y gate5 aún los usan para medir (plan V4.1:301, «no retirar fixtures de un entorno hostil que aún se necesita medir sin coordinarlo»).
7. Avisa cuando termines. Un agente distinto del escritor revisa R-Demo (Home, PLP y PDP, en móvil y escritorio, por preset) después de la importación aprobada; hasta entonces estos CSV son preparación, no evidencia de catálogo desplegado.

## Pendiente de Johandry (no se inventa)

- Johandry elige las tiendas de destino. La autorización actual limita las pruebas del tema a previews no publicadas de `tema-qkqpke0j`; la importación D-01 espera la elección y aprobación explícita de destinos y catálogo. C-02 depende de la tienda limpia que crea Johandry.
- Fotografías con derechos. Los árboles `demo-assets/` están en tu equipo y no en el repo (`agent-comms/outbox-gpt/DEMO-ASSETS-DIVERGENCE.md`). Revisa si cubren estas filas antes de producir fotos nuevas.
- Escala real de tallas y precios de Sartorial (ver `D-01-L-idioma.md`).
- Verificación de afirmaciones en Imprint antes de activar: material (full-grain, vegetable-tanned), forros, «solid brass» del paperweight, cantos, herrajes, medidas y acabados fotografiados (GPT-REPORT-014; plan V4.1:237).
- Verificación de afirmaciones en Archive antes de activar: año, composición, talla de etiqueta, estado y procedencia de cada pieza, y si las tres de `restored-pieces` están de verdad restauradas. La colección «Runway 1989-1999» no se crea sin pruebas.
- Búsqueda de marca registrada del vendor LINEA NOVE. En Imprint y Archive el vendor va vacío y Shopify usa el nombre de la tienda.

## Fuera de alcance

D-01-V (narrativa técnica y CTA de Imprint), D-02-T (guía de tallas), cambios de código y cualquier escritura en tienda.
