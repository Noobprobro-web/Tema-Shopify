# Entrega GPT-3A-003: Coleccion, Carrito, Navegacion y Footer en Figma

Archivo oficial de Figma: [Atelier Flow](https://www.figma.com/design/132QRVaYF2wRverRKEaymB/Atelier-Flow)

`File Key: 132QRVaYF2wRverRKEaymB`

```text
ID: GPT-3A-003
Emisor de la directiva: Gemini Flash 3.8 High
Ejecutor: GPT-5.6 Sol Max / Codex
Fase: Phase 3A.3, Bloque 1
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: aceptar Phase 3A.3 Bloque 1 o emitir una lista cerrada de ajustes.
Resumen en 5 lineas:
1. Se crearon cuatro SVG Couture autocontenidos para Desktop 1440 y Mobile 390.
2. La entrega cubre catalogo filtrado, carrito abierto, carrito vacio, navegacion expandida y footer global.
3. Los diez frames efectivos comparten tokens, jerarquia editorial y una arquitectura responsive consistente.
4. Los contrastes semanticos superan 4.5:1 y los 114 targets dimensionados miden al menos 44x44 px.
5. No se modifico Liquid, JavaScript, CSS, JSON ni ningun archivo de produccion del tema.
```

## 1. Archivos entregados

| Archivo | Lienzo raiz | Frames incluidos | SHA-256 |
| --- | ---: | --- | --- |
| `docs/figma/couture-collection-catalog-1440.svg` | `1440x3104` | Collection Catalog + Footer Global | `6AF9C00AC4F8CFA2E0F1F86939EEEE379B1614E8795FF020BF341D71BCF6B9F5` |
| `docs/figma/couture-collection-catalog-390.svg` | `390x4216` | Collection Catalog + Footer Global | `168D11519B94AC4F5374CECC3EE0ECC2F89CC406FB44CD8407835EF6CB5F8B4B` |
| `docs/figma/couture-cart-drawer-navigation-1440.svg` | `1440x2864` | Cart Open + Cart Empty + Navigation Expanded | `932E6E45387236A75FC0BB43B8C2C9C13AB73EC24B82E44ED496C0F18222D59B` |
| `docs/figma/couture-cart-drawer-navigation-390.svg` | `390x2392` | Cart Open + Cart Empty + Navigation Expanded | `B41F4519EA03B7809725A91ED5C2D4F647BDFEED8E124D3022CC7879B4C7C7A3` |

Los hashes corresponden a los archivos finales posteriores al QA visual.

## 2. Arquitectura de los lienzos

### Collection y Footer

| ID semantico | Desktop | Mobile | Proposito |
| --- | --- | --- | --- |
| `Section-Collection-Catalog` | y `0`, altura `2160` | y `0`, altura `2848` | Encabezado editorial, filtros, grilla y paginacion |
| `Section-Footer-Global` | y `2208`, altura `896` | y `2880`, altura `1336` | Newsletter, navegacion, Shop, Markets y pagos |

### Cart y Navegacion

| ID semantico | Desktop | Mobile | Proposito |
| --- | --- | --- | --- |
| `Section-Cart-Drawer-Open` | y `0`, altura `1024` | y `0`, altura `844` | Carrito con dos line items y resumen transaccional |
| `Section-Cart-Drawer-Empty` | y `1056`, altura `704` | y `876`, altura `640` | Estado vacio compacto con recuperacion clara |
| `Section-Navigation-Expanded` | y `1792`, altura `1072` | y `1548`, altura `844` | Mega-menu desktop y drawer mobile a pantalla completa |

Cada seccion es un grupo superior independiente. Los subgrupos nombran controles, items, facets, columnas, utilidades y estados para que la auditoria MCP pueda encontrarlos sin depender de coordenadas.

## 3. Especificacion visual y funcional

### Collection Catalog

Desktop:

- Header global compacto de 72 px con navegacion primaria, busqueda, `shopify-account` y bolsa.
- Encabezado editorial con titulo Playfair Display, descripcion de dos lineas y contador `[24 PIECES]`.
- Toolbar horizontal con Availability, Price, Size y Color; sorting separado a la derecha.
- Panel de facets desplegado en cuatro columnas con checkboxes, inputs de rango etiquetados, tallas y colores.
- Estado aplicado visible por texto, contorno y cierre: `Size: S`, `Color: Ink`, contador y `Clear all`.
- Grilla de cuatro columnas y ocho cards con precio, swatches, Sale, Sold Out y Quick Add.
- Paginacion con `PAGE 1 OF 3`, progreso y CTA `Load More Pieces` de 52 px.

Mobile:

- Header de 64 px y encabezado refluido sin truncar copy.
- Toolbar de dos columnas: `Filters (2)` y `Featured`.
- Drawer de filtros abierto con Availability, Price, Size y Color, seguido por Clear y `Show 24 pieces`.
- Grilla de dos columnas con ocho cards; Quick Add conserva 44 px de altura.
- Estados seleccionados no dependen solo del color: usan borde, relleno, check o texto.

### Cart Drawer Open

Desktop:

- Drawer lateral de 520 px sobre overlay `#1C1917` al 68 por ciento.
- Header `Your Selection (2)` y cierre con target `44x44`.
- Barra de envio gratis con copy, porcentaje y progreso lineal.
- Dos line items con media `112x140`, variante, precio, stepper de cantidad y Remove.
- Gift note desplegado con contador de caracteres.
- Resumen fijo en la zona inferior, CTA `Checkout • $420.00` de `472x52`, link al carrito y sello de seguridad.

Mobile:

- Drawer a pantalla completa de `390x844`, sin panel lateral estrecho.
- Line items condensados con media `92x116`; stepper y Remove siguen siendo targets independientes.
- Gift note, subtotal y checkout caben dentro del viewport sin ocultar el CTA.
- El CTA principal mide `358x52` y mantiene texto blanco sobre accent Couture.

### Cart Empty

- Variante separada y compacta, no un estado escondido dentro del frame lleno.
- Icono lineal de bolsa, mensaje `Your bag is quiet.` y CTA `Explore Collection` de 52 px.
- Accion secundaria `Continue browsing`, recordatorio de envio gratis y politica de devoluciones.
- Desktop conserva overlay y panel lateral; mobile usa el ancho completo disponible.

### Navigation Expanded

Desktop:

- Header con siete o menos destinos primarios y estado Shop subrayado.
- Mega-menu de tres columnas curadas: Apparel, Objects y Atelier Stories.
- Cada columna evita convertirse en sitemap y termina en un enlace de categoria global.
- Cuarta columna editorial con media original, temporada, titulo y acceso a la capsula.
- Nota de contrato para teclado: Tab mueve el foco y Escape cierra.

Mobile:

- Drawer a pantalla completa con cierre y busqueda en el encabezado.
- Tipografia serif grande y cuatro filas de acordeon; Shop aparece expandido.
- Submenu con Apparel, Objects y Seasonal capsule, cada uno con conteo.
- Acceso a `shopify-account`, pais, moneda y una pieza editorial al final.
- Todos los renglones interactivos ocupan al menos 44 px de alto.

### Footer Global

Desktop:

- Banda de newsletter con copy, email y Subscribe; campo de 52 px y CTA interno de 44 px.
- Cuatro columnas: Collections, About us, Customer care y Legal.
- Hit areas transparentes de 44 px para todos los enlaces densos.
- Shopify Markets presenta selectores independientes de pais y moneda.
- Fila de metodos de pago y cierre editorial con copyright.

Mobile:

- Newsletter apilado, cuatro columnas convertidas en acordeones de 64 px.
- Follow on Shop separado de los menus y con espacio de seguridad.
- Selectores de Markets a ancho completo y pagos en una fila estable.
- Legal y marca cierran el frame sin contenido fuera del viewport.

## 4. Tokens aplicados

La interfaz usa exclusivamente los valores Couture de `docs/design-tokens.json`, salvo la excepcion de marca obligatoria de Shop descrita debajo.

| Uso | Token | Valor |
| --- | --- | --- |
| Fondo principal | `presets.couture.color.background` | `#FAF8F5` |
| Superficie | `presets.couture.color.surface` | `#F3EFEA` |
| Superficie sutil | `presets.couture.color.surface_subtle` | `#EDE7DE` |
| Texto principal | `presets.couture.color.foreground` | `#1C1917` |
| Texto secundario | `presets.couture.color.foreground_muted` | `#605A53` |
| Borde | `presets.couture.color.border` | `#E5DFD5` |
| Hairline | `presets.couture.color.border_hairline` | `#EDE7DE` |
| CTA principal | `presets.couture.color.accent` | `#786C5E` |
| Texto de CTA | `presets.couture.color.accent_contrast` | `#FFFFFF` |
| Sale background | `presets.couture.color.sale_badge_bg` | `#1C1917` |
| Sale text | `presets.couture.color.sale_badge_text` | `#FAF8F5` |
| Heading | `presets.couture.typography.font_family_heading` | `'Playfair Display', Georgia, 'Times New Roman', serif` |
| Body | `presets.couture.typography.font_family_body` | `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif` |
| Eyebrow tracking | `presets.couture.typography.letter_spacing_eyebrow` | `0.12em` |
| Radio de boton | `presets.couture.shape.border_radius_button` | `2px` |
| Radio de card | `presets.couture.shape.border_radius_card` | `0px` |
| Gutter desktop | `global.grid.gutter_desktop` | `32px` |
| Gutter mobile | `global.grid.gutter_mobile` | `16px` |
| Target minimo | `global.grid.tap_target_min` | `44px` |

Los headings conservan peso `400`. El SVG declara tracking `0` en headings para evitar distorsion al importar; el eyebrow usa exactamente `1.32px` a 11 px y `1.2px` a 10 px, equivalentes a `0.12em`.

### Excepcion de marca Shop

`#5433EB` aparece unicamente en el proxy visual de `Follow on Shop` y en su marca de pago. No es un token tematico. Shopify exige que los colores del boton generado no se modifiquen.

En Phase 3B debe renderizarse mediante:

```liquid
{{ shop | login_button: action: 'follow' }}
```

No debe aplicarse CSS que cambie sus colores, tipografia o logo. Referencia oficial: [Shopify Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements).

## 5. Contraste y accesibilidad

| Par semantico | Ratio calculado |
| --- | ---: |
| Foreground / background | `16.50:1` |
| Foreground / surface | `15.28:1` |
| Foreground / surface subtle | `14.23:1` |
| Muted / background | `6.42:1` |
| Muted / surface | `5.95:1` |
| Muted / surface subtle | `5.54:1` |
| White / accent | `5.12:1` |
| White / Shop purple | `6.88:1` |

El minimo real usado para texto normal es `5.12:1`, por encima de WCAG 2.2 AA `4.5:1`.

Targets dimensionados y auditados:

| Asset | Targets | Resultado |
| --- | ---: | --- |
| Collection + Footer Desktop | `32` | Todos >= `44x44` |
| Collection + Footer Mobile | `36` | Todos >= `44x44` |
| Cart + Navigation Desktop | `22` | Todos >= `44x44` |
| Cart + Navigation Mobile | `24` | Todos >= `44x44` |
| Total | `114` | PASS |

Los badges y swatches informativos no se contabilizan como controles. Los estados Sale, Sold Out, selected y active incluyen texto, borde o check, por lo que no dependen solo del color.

## 6. Contrato de estados para Phase 3B

| Componente | Estados requeridos |
| --- | --- |
| Facet disclosure | `Collapsed / Expanded / Focus` |
| Checkbox facet | `Default / Checked / Disabled / Zero-results` |
| Price range | `Default / Focus / Invalid` |
| Sort selector | `Closed / Open / Selected / Focus` |
| Product card | `Default / Hover / Focus / Sold-out` |
| Quick Add | `Default / Loading / Added / Error / Disabled` |
| Cart drawer | `Closed / Opening / Open / Closing / Empty / Error` |
| Quantity stepper | `Default / Updating / Minimum / Error` |
| Gift note | `Collapsed / Expanded / Saving / Saved` |
| Mega-menu | `Closed / Open / Keyboard-active` |
| Mobile accordion | `Collapsed / Expanded / Focus` |
| Newsletter | `Default / Focus / Loading / Success / Error` |

El foco futuro debe usar foreground Couture con offset visible. Las transiciones deben ser discretas y respetar `prefers-reduced-motion`.

## 7. Importacion en Figma

Orden recomendado para el archivo oficial:

1. Arrastrar primero `docs/figma/couture-collection-catalog-1440.svg` a una zona vacia del lienzo de [Atelier Flow](https://www.figma.com/design/132QRVaYF2wRverRKEaymB/Atelier-Flow).
2. Arrastrar `docs/figma/couture-collection-catalog-390.svg` a su derecha y dejar 96 px de separacion.
3. Importar debajo `docs/figma/couture-cart-drawer-navigation-1440.svg`.
4. Colocar `docs/figma/couture-cart-drawer-navigation-390.svg` junto a su version desktop.
5. En Layers, localizar los grupos `Section-*`; si Figma envuelve el SVG en un grupo raiz, desagrupar solo una vez.
6. Seleccionar cada `Section-*` y usar `Ctrl+Alt+G` para convertirlo en Frame.
7. Aplicar Auto Layout a toolbars, facets, line items, columnas y filas; mantener media vectorial y overlays en posicion absoluta.
8. Solicitar a Gemini la auditoria MCP con `fileKey 132QRVaYF2wRverRKEaymB`.

Alternativa: abrir el SVG como texto, copiar desde `<svg` hasta `</svg>` y pegar con `Ctrl+V` en Figma.

Limitacion del formato: SVG conserva vectores, texto, grupos, IDs y geometria, pero no transporta Auto Layout, variables, component properties ni conexiones de prototipo.

## 8. Validaciones realizadas

| Validacion | Resultado |
| --- | --- |
| Parse XML de los cuatro SVG | PASS |
| Dimensiones raiz | PASS: `1440x3104`, `390x4216`, `1440x2864`, `390x2392` |
| IDs duplicados | PASS: `0` en los cuatro archivos |
| IDs de seccion requeridos | PASS en desktop y mobile |
| Paleta de interfaz | PASS: solo tokens Couture |
| Excepcion de marca | PASS: Shop purple aislado al proxy nativo |
| Scripts, enlaces remotos, `image`, `foreignObject`, gradients, filters, patterns o markers | PASS: `0` |
| Targets dimensionados | PASS: `114`, todos >= `44x44` |
| Contraste semantico | PASS: minimo `5.12:1` |
| Render raster con Sharp | PASS para los cuatro archivos |
| QA visual de los diez frames efectivos | PASS |
| Clipping, overflow o solapamientos incoherentes | PASS: `0` detectados |
| Recursos externos | PASS: `0` |
| Codigo Shopify modificado | PASS: `0` |

Sharp emitio advertencias de cache de Fontconfig dentro del sandbox, pero genero correctamente los cuatro renders. Figma debe tener disponibles Playfair Display y Plus Jakarta Sans para conservar las familias primarias; de lo contrario usara los fallbacks declarados.

## 9. Riesgos y siguiente accion

### P0

- Ninguno detectado.

### P1

- Los dibujos de producto son media vectorial original y reemplazable. En produccion deben usar imagenes reales del merchant con `aspect-ratio` reservado.
- El proxy de Follow on Shop sirve solo para composicion. La implementacion debe confiar en el HTML generado por `login_button` y no reconstruir la marca.
- Figma no crea Auto Layout o componentes desde SVG; esos comportamientos deben aplicarse despues de importar.

### P2

- Los estados hover, focus, loading y error estan documentados, pero no se duplicaron como frames adicionales para mantener el alcance del bloque.
- La etiqueta `Page 1 of 3` es un ejemplo de densidad editorial; Phase 3B debe derivar el estado real desde `paginate`.

Siguiente accion recomendada: importar primero Collection Desktop, auditar su jerarquia y tokens con Gemini, comparar Collection Mobile y despues revisar las superficies de Cart y Navigation. Gemini debe emitir `ACCEPTED` o una lista cerrada de cambios antes de abrir Phase 3B.

## 10. Git

No se realizo commit ni push. La directiva GPT-3A-003 no los autorizaba antes de la revision de Gemini.
