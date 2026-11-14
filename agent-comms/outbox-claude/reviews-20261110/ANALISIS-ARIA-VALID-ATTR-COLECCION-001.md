# ANALISIS-ARIA-VALID-ATTR-COLECCION-001

Solo lectura. Fuente: `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/results/RA-RB-read-only-20261114T144907417Z-ba5766e3-145f-45ea-a18f-d14ece579e92.json` (axe 4.10.2, 0 violaciones). No se tocó tienda ni código.

## Limite de la evidencia
El JSON esta sanitizado: por nodo solo trae `tag`, `sectionFamily`, `landmarkRegion`, `hasAriaLabel`. No hay selectores ni IDs. La atribucion a elementos concretos es por razonamiento con el codigo.

## 1. aria-valid-attr-value (incomplete)

Datos del JSON (todos `button`):
- Colecciones (Sartorial, Imprint y Archive; 390 y 1280): 10 nodos, `sectionFamily=main_collection`, `hasAriaLabel=false`.
- Home: 4 nodos en Sartorial y 3 en Archive, `sectionFamily=lookbook`, `hasAriaLabel=true`.
- Producto: 2 nodos, `other_or_none`, `hasAriaLabel=false`.

### Por que axe lo marca
Con axe-core 4.14 (copia local) la regla `aria-valid-attr-value` pasa a "needs review" (`controlsWithinPopup`) cualquier `aria-controls` si el mismo elemento tiene `aria-haspopup` distinto de `false`. Eso ocurre antes de comprobar el ID, y aunque `aria-expanded="false"` normalmente lo eximiria. Fuente: `ariaValidAttrValueEvaluate`, pre-check `aria-controls`, en `/root/.npm/_npx/ba16b138af87a83e/node_modules/axe-core/axe.js:31880-31890`. La version del harness es 4.10.2, no 4.14.0; asumo que el pre-check es el mismo (lo confirma la descripcion del encargo).

### Elementos de la coleccion (10 nodos)
Son los disparadores de quick add en `snippets/product-card.liquid`, modo `picker`. Los 10 nodos coinciden con 10 tarjetas y con `hasAriaLabel=false`: el nombre accesible sale del texto del boton.

| Atributo | Linea | ID referenciado | Existe en el DOM |
|---|---|---|---|
| `aria-haspopup="dialog"` | `product-card.liquid:391` | n/a | n/a |
| `aria-controls="{{ quick_buy_id }}"` | `product-card.liquid:392` | `QuickBuy-<section.id>-<product.id>[-sufijo]` (definido en `:37`) | Si: `<dialog id="{{ quick_buy_id }}">` en `:406`, mismo `{%- when 'picker' -%}`, hermano del boton |
| `aria-describedby="{{ card_title_id }}"` | `product-card.liquid:393` | `CardTitle-<card_key>` (`:36`) | Si: `<h3 id="{{ card_title_id }}">` en `:330`, siempre renderizado |
| `aria-expanded="false"` | `product-card.liquid:390` | n/a | La sincroniza `assets/theme.js` (`:341`, `:2575-2590`) |

El `<dialog>` cerrado sigue en el DOM (solo `display:none` del UA). `theme.js` (`bindQuickBuy`, `:2488`) lo usa sin moverlo ni destruirlo. Por tanto el ID existe tambien con el panel cerrado.

Dentro del propio dialog, `aria-labelledby` (`:407`, `:434`) apunta a `QuickBuyTitle-…` (`:414`) y `aria-describedby` (`:408`) apunta a `QuickBuyProduct-…` (`:424`). Ambos existen en el mismo dialog.

Unicidad de ID: `card_key = section.id + product.id`, mas `card_id_suffix` opcional (`:33-35`). Solo habria duplicados si el mismo producto se renderiza dos veces en la misma seccion sin sufijo. En la coleccion un producto aparece una sola vez por pagina.

Clasificacion: FALSO POSITIVO en los 10 nodos de coleccion. Defecto real: ninguno. Las rutas `when 'picker'` y `when 'direct'` (`:340-374`) no llevan `aria-controls`, asi que no hay nada que corregir.

### Elementos de home (lookbook, 3 o 4 nodos)
Son los hotspots de `sections/lookbook.liquid`, con `hasAriaLabel=true`. El boton declara `aria-controls` (`:95`), `aria-haspopup="dialog"` (`:96`) y `aria-expanded="false"` (`:97`).
- El ID referenciado es `LookbookPopover-<section.id>-<block.id>` (`:68`), y existe como `<div id="{{ popover_id }}" role="dialog" … hidden inert>` (`:104-111`), hermano del boton dentro de `.lookbook-hotspot`.
- El atributo `hidden` no quita el nodo del DOM, asi que el ID esta presente aunque el popover este cerrado.
- `aria-labelledby="{{ popover_title_id }}"` (`:108`) apunta a un titulo dentro del popover. Es el mismo componente.

Clasificacion: FALSO POSITIVO, por el mismo motivo (haspopup + controls).

### Elementos de producto (2 nodos)
Sin selectores, el candidato mas probable es el disparador de guia de tallas: `sections/main-product.liquid:305-312`, con `aria-haspopup="dialog"` y `aria-controls="{{ size_guide_id }}"`. El ID existe en `:326`. El otro candidato es `snippets/pickup-availability.liquid:49-54`. Ahi `aria-controls="{{ pickup_id }}-Drawer"` apunta al `<section id="{{ pickup_id }}-Drawer">` de `:68`, que existe. Los disparadores de zoom (`main-product.liquid:104-107`) llevan `aria-haspopup` pero no `aria-controls`, asi que no generan este incomplete.

Clasificacion: FALSO POSITIVO probable. No concluyente en cuanto a cual de los dos nodos es cual, hasta tener el HTML renderizado.

### Sobre quitar o mantener aria-controls
No se recomienda quitarlo. Es valido en ARIA 1.2 y los IDs son correctos. Quitarlo solo para silenciar el "needs review" empeoraria la semantica. Si Theme Store o Gemini exige 0 incompletes, hay una unica opcion: documentar la excepcion en el ledger como "needs review por diseno de axe, IDs verificados" con las lineas de arriba como evidencia.

## 2. color-contrast (incomplete)

### Desglose por nodo (JSON)
Imprint, colecciones:
- 1280 (26 nodos): header 6 (`span` 2, `a` 3, `select` 1); `main_collection` 20 (`span` 12, `p` 4, `a` 4).
- 390 (12 nodos): header 1 (`span`); `main_collection` 11 (`span` 6, `p` 2, `a` 2, `button` 1).

Comparacion con las otras presets en coleccion a 1280: Sartorial 6 y Archive 6, solo el header. Es decir, los 20 nodos de `main_collection` son especificos de Imprint.

### Header (6 nodos en las tres presets a 1280)
Es la causa comun a todas las presets. Cuando la cabecera tiene `data-header-scrolled` y `data-animations='full'`, `assets/base.css:9478-9490` deja su fondo en `transparent`. El fondo real pasa a un pseudo-elemento `::before` con `color-mix(... 88%, transparent)` y `backdrop-filter`. axe no puede calcular el fondo a traves de pseudo-elementos ni de `backdrop-filter`, por eso devuelve incomplete. Es un limite de axe, no un contraste bajo.

### main_collection de Imprint (20 nodos a 1280; 11 a 390)
El JSON no permite saber que elementos concretos son. Por tipo de etiqueta, los candidatos en `sections/main-collection.liquid` y `snippets/product-card.liquid` son:
- `span` (12): `facets__count` (`:61`), etiquetas y contadores de filtros (`:80`, `:142-143`, `:165-166`), `collection-grid-switcher__title` (`:258`), `badge` de venta o agotado (`price.liquid:105-108`), etiquetas de swatch.
- `p` (4): `collection-products__count` (`:250`), eyebrow (`:36`), `product-card__vendor` (`product-card.liquid:327`).
- `a` (4): `data-facet-clear-all` (`:411`), enlaces de titulo de tarjeta (`product-card.liquid:331`), paginacion (`:424-440`).

Hipotesis de causa, en orden de probabilidad:
1. Solapamiento con la cabecera pegajosa (`position: sticky`) y su pseudo-elemento translucido, cuando el harness hace scroll. Eso encaja con que el recuento a 1280 sea mayor que a 390.
2. Texto colocado sobre el fondo de imagen de las tarjetas (placeholders o imagenes aun no cargadas), que impide calcular el fondo.
3. `opacity` en `.badge[data-sold-out-badge]` (`base.css:1121-1126`) y en descripciones (`base.css:1095-1098`, `opacity: 0.76`).

No se puede asegurar cual es la causa real sin selectores.

### Contraste real con los tokens (formula WCAG 2.x, `config/settings_data.json`)
Todo con el esquema por defecto de la coleccion (`scheme-1`, `templates/collection.json:6`) y los tokens de `base.css:105-113`. El muted se calcula como mezcla 78/22 en sRGB.

| Preset | texto/fondo | muted/fondo | muted/surface | opacity .76 | opacity .70 |
|---|---|---|---|---|---|
| Sartorial scheme-1 | 15.52 | 7.91 | 7.04 | 7.39 | 6.04 |
| Imprint scheme-1 | 18.88 | 9.53 | 8.42 | 8.85 | 7.07 |
| Imprint scheme-3 | 16.87 | 8.91 | 7.88 | 8.30 | 6.71 |
| Archive scheme-1 | 12.27 | 6.49 | 5.82 | 6.11 | 5.11 |
| Archive scheme-3 | 10.78 | 5.98 | 5.38 | 5.66 | 4.78 |

En Imprint, el caso peor medido es 7.07:1 (texto con opacidad .70 sobre `scheme-1`), muy por encima de 4.5:1. Imprint es la preset con mas holgura: su texto sobre fondo es 18.88:1 y todos los textos muted superan 7:1.

Conclusion: no hay contraste real bajo en los tokens. Los incompletes de Imprint son por limitacion de calculo de fondo de axe, no por un contraste insuficiente. Clasificacion: FALSO POSITIVO probable en el header (causa identificada en CSS). NO CONCLUYENTE para los 20 nodos de `main_collection` de Imprint, porque falta el selector. Los tokens de esquema no son la causa.

## 3. Defectos reales
Ninguno encontrado. No hay diff propuesto.

## 4. Siguiente paso si se quiere cerrar lo no concluyente
Ejecutar un axe local o devtools sobre la coleccion de Imprint que imprima `node.target` y `node.any[0].data.messageKey` de cada incomplete. Con eso se asigna cada nodo a un componente y se confirma el contraste en vivo.
