# Entrega GPT-3A-002: Figma Editorial Homepage Sections

Archivo oficial de Figma: [Atelier Flow](https://www.figma.com/design/132QRVaYF2wRverRKEaymB/Atelier-Flow)

`File Key: 132QRVaYF2wRverRKEaymB`

```text
ID: GPT-3A-002
Emisor de la directiva: Gemini Flash 3.8 High
Ejecutor: GPT-5.6 Sol Max / Codex
Fase: Phase 3A.2
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: aceptar Phase 3A.2 o solicitar ajustes antes de traducir estas secciones a Shopify.
Resumen en 5 lineas:
1. Se crearon cuatro blueprints editoriales Couture para Desktop 1440 y Mobile 390.
2. Hero, Showcase, Manifesto y Bento mantienen composiciones distintas y una sola gramatica visual.
3. Los SVG son autocontenidos, editables y usan grupos e IDs semanticos para Figma.
4. Todos los controles y enlaces auditados miden al menos 44x44 px y los contrastes superan 4.5:1.
5. No se modifico Liquid, JavaScript, CSS, JSON ni ningun archivo de produccion del tema.
```

## 1. Archivos entregados

| Archivo | Lienzo | Contenido | SHA-256 |
| --- | ---: | --- | --- |
| `docs/figma/couture-homepage-sections-1440.svg` | `1440x3864` | Cuatro secciones desktop separadas por 48 px | `2B1D72A5E789E55D04F708BA4814555AFE546B2F1450D3E5ACA6EF71C3204CF8` |
| `docs/figma/couture-homepage-sections-390.svg` | `390x4210` | Cuatro secciones mobile separadas por 32 px | `6A0021C2BF62FBFF19048CE2AF7BFB69C28406EC253DBC709A4FCA63EC1D88A7` |

Los hashes corresponden a los archivos finales posteriores al QA visual.

## 2. Arquitectura de los lienzos

| ID semantico | Desktop | Mobile | Proposito |
| --- | --- | --- | --- |
| `Section-Hero-Editorial` | y `0`, altura `880` | y `0`, altura `844` | Entrada de campana con media asimetrica, temporada y dos CTA |
| `Section-Curated-Showcase` | y `928`, altura `1080` | y `876`, altura `1300` | Coleccion curada con tabs, spotlight y dos productos secundarios |
| `Section-Brand-Manifesto` | y `2056`, altura `800` | y `2208`, altura `920` | Cita de marca, macro de material y ficha tecnica |
| `Section-Bento-Discovery` | y `2904`, altura `960` | y `3160`, altura `1050` | Descubrimiento visual de Apparel, Accessories y Living Objects |

Cada seccion es un grupo superior independiente. Las galerias y medios usan `clipPath`; los controles, enlaces y media de producto contienen hit areas transparentes identificables.

## 3. Especificacion visual

### Editorial Split Hero

Desktop:

- Media editorial `824x816` a la izquierda y columna tipografica de 488 px a la derecha.
- Eyebrow `ATELIER FLOW / COUTURE 01`, titulo serif `Autumn / Winter 26` y detalle de temporada.
- CTA principal `248x52` con accent Couture y CTA secundario `224x52` con borde hairline.
- Bloque inferior de Season, Edition y Origin para conectar narrativa con trazabilidad.

Mobile:

- El contenido se reordena como copy, media `358x356`, CTA principal y CTA secundario.
- Ambos CTA ocupan todo el ancho util y conservan altura de 52 px.
- La bajada se divide en lineas estables para evitar clipping a 390 px.

### Curated Showcase

Desktop:

- Tabs superiores completos: `[01] New Arrivals`, `[02] Permanent Collection`, `[03] Objects`.
- Spotlight `736x640` con ficha comercial debajo.
- Dos tarjetas horizontales a la derecha, cada una con media `292x300`, precio, disponibilidad y Quick Add.
- El ritmo 1+2 evita una cuadricula repetitiva y mantiene escaneo comercial.

Mobile:

- Los tres tabs conservan sus nombres y usan dos lineas cuando es necesario.
- Spotlight vertical primero; las tarjetas secundarias pasan a filas de media + detalles.
- Disponibilidad y Quick Add permanecen visibles sin depender de hover.

### Brand Manifesto

Desktop:

- Cita editorial de tres lineas con columna de lectura amplia.
- Macro de lana en paleta de media fria y ficha indexada para Materials, Origin, Artisanal Finish y Edition.
- CTA de proceso y CTA de material separados por jerarquia.

Mobile:

- La cita se compone en cuatro lineas controladas.
- Narrativa, CTA, macro y ficha tecnica se apilan en ese orden.
- Las etiquetas sobre textura usan respaldo opaco `#1C1917` para garantizar contraste.

### Bento Discovery

Desktop:

- Apparel ocupa el bloque vertical protagonista.
- Accessories y Living Objects forman dos bloques apilados a la derecha.
- Cada categoria usa banda opaca de alto contraste, indice, conteo y flecha.

Mobile:

- Los tres bloques se apilan sin scroll horizontal.
- Apparel conserva mayor altura; Accessories y Living Objects usan formato panoramico.
- Cada bloque completo funciona como hit area, no solo su etiqueta.

## 4. Tokens aplicados

Todos los valores de interfaz proceden de `docs/design-tokens.json`. Los colores adicionales se limitan al arte vectorial que representa fotografia reemplazable; no definen superficies, texto, bordes ni estados de UI.

| Uso | Token | Valor |
| --- | --- | --- |
| Fondo principal | `presets.couture.color.background` | `#FAF8F5` |
| Superficie narrativa | `presets.couture.color.surface` | `#F3EFEA` |
| Separacion de lienzos | `presets.couture.color.surface_subtle` | `#EDE7DE` |
| Texto principal | `presets.couture.color.foreground` | `#1C1917` |
| Texto secundario | `presets.couture.color.foreground_muted` | `#605A53` |
| Bordes | `presets.couture.color.border` | `#E5DFD5` |
| Hairlines | `presets.couture.color.border_hairline` | `#EDE7DE` |
| CTA principal | `presets.couture.color.accent` | `#786C5E` |
| Texto sobre CTA | `presets.couture.color.accent_contrast` | `#FFFFFF` |
| Heading | `presets.couture.typography.font_family_heading` | `'Playfair Display', Georgia, 'Times New Roman', serif` |
| Body | `presets.couture.typography.font_family_body` | `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif` |
| Peso heading | `presets.couture.typography.font_weight_heading` | `400` |
| Tracking eyebrow | `presets.couture.typography.letter_spacing_eyebrow` | `0.12em` |
| Radio de boton | `presets.couture.shape.border_radius_button` | `2px` |
| Radio de card | `presets.couture.shape.border_radius_card` | `0px` |
| Borde estructural | `presets.couture.shape.border_width` | `1px` |
| Gutter desktop | `global.grid.gutter_desktop` | `32px` |
| Gutter mobile | `global.grid.gutter_mobile` | `16px` |
| Target minimo | `global.grid.tap_target_min` | `44px` |
| Separacion desktop | `global.spacing.2xl` | `48px` |
| Separacion mobile | `global.spacing.xl` | `32px` |

### Contraste calculado

| Par semantico | Ratio |
| --- | ---: |
| Foreground / background | `16.50:1` |
| Muted / background | `6.42:1` |
| Foreground / surface | `15.28:1` |
| Muted / surface | `5.95:1` |
| Accent contrast / accent | `5.12:1` |
| Sale text / sale background | `16.50:1` |

Los ratios se calcularon desde los valores hex oficiales y todos superan WCAG 2.2 AA para texto normal.

## 5. Contrato de interaccion

- Desktop: 17 nodos interactivos auditados con dimensiones minimas de `44x44`.
- Mobile: 16 nodos interactivos auditados con dimensiones minimas de `44x44`.
- Tabs: target completo, no solo el texto.
- Productos: la media contiene un `Product-Link-Hit` de gran formato.
- Quick Add: target de 44 px de altura en todos los casos.
- Bento: toda la superficie de cada categoria es interactiva.
- Disponibilidad: estado informativo, no depende exclusivamente del color.

Estados recomendados para Phase 3B:

| Componente | Estados |
| --- | --- |
| Tabs | `Default / Hover / Focus / Active` |
| Product media | `Default / Hover / Focus` |
| Quick Add | `Default / Loading / Added / Error / Disabled` |
| CTA | `Default / Hover / Focus / Pressed` |
| Bento category | `Default / Hover / Focus` |

El foco debe usar foreground Couture con offset visible. Con `prefers-reduced-motion`, cualquier reveal futuro debe resolverse sin desplazamiento ni parallax.

## 6. Importacion en Figma

Orden recomendado:

1. Arrastrar primero `docs/figma/couture-homepage-sections-1440.svg` al lienzo de [Atelier Flow](https://www.figma.com/design/132QRVaYF2wRverRKEaymB/Atelier-Flow).
2. Colocar `docs/figma/couture-homepage-sections-390.svg` a su derecha, dejando al menos 96 px entre ambos lienzos.
3. En Layers, comprobar los cuatro grupos `Section-*`.
4. Convertir cada grupo superior en Frame con `Ctrl+Alt+G`.
5. Aplicar Auto Layout solo a copy columns, tabs, fichas de producto y filas tecnicas. Mantener el arte de media en posicion absoluta.
6. Pedir a Gemini que audite el archivo con el `fileKey 132QRVaYF2wRverRKEaymB`.

Alternativa: abrir cada SVG como codigo, copiar desde `<svg` hasta `</svg>` y pegar con `Ctrl+V` en una zona vacia del lienzo.

Limitacion del formato: SVG conserva vectores, texto, grupos, IDs y geometria, pero no transporta Auto Layout, componentes, variables ni conexiones de prototipo de Figma.

## 7. Validaciones

| Validacion | Resultado |
| --- | --- |
| Parse XML de ambos SVG | PASS |
| IDs duplicados | PASS: 0 |
| Cuatro IDs de seccion requeridos | PASS en ambos archivos |
| Scripts, enlaces externos, gradients, filters, `foreignObject`, patterns o markers | PASS: 0 |
| Dimensiones raiz | PASS: `1440x3864` y `390x4210` |
| Targets interactivos | PASS: 17 desktop, 16 mobile, todos >= `44x44` |
| Contraste semantico | PASS: minimo `5.12:1` |
| Render raster con Sharp | PASS: `1440x3864` y `390x4210` |
| QA visual individual de las 8 secciones | PASS |
| Clipping, texto fuera de viewport o solapamientos incoherentes | PASS: 0 detectados |
| Recursos externos | PASS: 0 |
| Codigo de produccion Shopify modificado | PASS: 0 |

Sharp emitio advertencias de cache de Fontconfig en el sandbox, pero produjo correctamente ambos renders. Figma debe tener disponibles Playfair Display y Plus Jakarta Sans para conservar la tipografia primaria; de lo contrario aplicara los fallbacks declarados.

## 8. Riesgos y siguiente accion

### P0

- Ninguno detectado en los SVG.

### P1

- El arte de producto es vectorial, original y deliberadamente reemplazable. En implementacion debe usar media real del merchant con aspect ratio reservado.
- Auto Layout y variantes deben crearse despues de importar, porque no forman parte del estandar SVG.
- Gemini debe confirmar el orden de estas cuatro secciones dentro del homepage completo antes de Phase 3B.

### P2

- Los estados de hover, focus y loading estan especificados, pero no se representan como frames adicionales para mantener esta entrega enfocada.

Siguiente accion recomendada: Gemini importa o audita primero Desktop, compara Mobile, y emite aceptacion o una lista cerrada de ajustes. Solo despues debe abrir una tarea independiente para traducir las secciones a Liquid, CSS y JavaScript.

## 9. Git

No se realizo commit ni push. La directiva no los autorizaba antes de la revision de Gemini.
