# Entrega GPT-3A-5: Figma System Hardening & Top-Tier Merchandising

```text
ID: GPT-3A-5
Autor: GPT-5.6 Sol Max / Codex
Destinatario: Gemini Flash 3.8 High y usuario
Fecha: 2026-09-12
Estado: LISTO PARA REVISION DE GEMINI
Figma: 132QRVaYF2wRverRKEaymB
Alcance: arquitectura visual y activos Figma; sin cambios Liquid ni produccion Shopify.
```

## 1. Resumen ejecutivo

- Se sustituyo Georgia por Playfair Display Regular en el archivo oficial de Figma y se elimino Georgia de los 16 SVG del repositorio.
- El archivo oficial usa exactamente tres paginas: Foundations, Couture Screens y Presets + QA.
- Se entrego una biblioteca reproducible de 10 component sets, 52 variantes, Auto Layout, variables y siete estilos tipograficos.
- Se generaron los blueprints desktop/mobile de Size Guide, cart cross-sell, Complete the Look, collection merchandising, announcement y marquee.
- Todos los activos nuevos usan la paleta Couture, targets de al menos 44 px y no tienen recursos externos; no se hizo commit ni push.

## 2. Estado del archivo oficial de Figma

Archivo: [Atelier Flow](https://www.figma.com/design/132QRVaYF2wRverRKEaymB/Atelier-Flow)

| Pagina | Estado verificado | Contenido previsto |
| --- | --- | --- |
| `01 Foundations & Components` | Creada, nombrada y limpia | Variables, estilos, componentes, estados y deprecados |
| `02 Couture Screens & Flows` | 12 blueprints Couture existentes | Pantallas, nuevos modulos P1 y cinco recorridos prototipados |
| `03 Presets (Studio & Archive) + QA` | Referencia Studio/Archive aislada | Presets funcionales, tablet/320, localizacion y QA |

El dialogo de fuente faltante identificaba 25 capas con Georgia. Se ejecuto el reemplazo global por Playfair Display Regular y el dialogo ya no aparece al reabrir el archivo.

La pagina 1 se dejo vacia de forma deliberada para que el constructor local cree alli la biblioteca nativa sin mezclarla con imports historicos. La pagina 2 conserva solo Couture y la pagina 3 conserva la referencia de Studio/Archive.

## 3. Activos entregados

| Archivo | Dimension | Proposito |
| --- | ---: | --- |
| `docs/figma/couture-top-tier-merchandising-1440.svg` | 1440 x 4704 | Los cinco modulos P1 en desktop |
| `docs/figma/couture-top-tier-merchandising-390.svg` | 390 x 5384 | Los cinco modulos P1 y quick-buy sheet en mobile |
| `docs/figma/atelier-flow-critical-component-sets.svg` | 1440 x 4760 | Lamina auditable de los 10 component sets y sus estados |
| `docs/figma/atelier-flow-system-builder/manifest.json` | N/A | Manifest del plugin local reproducible |
| `docs/figma/atelier-flow-system-builder/code.js` | N/A | Constructor de variables, estilos y componentes nativos |

Tambien se endurecieron estos 12 SVG existentes:

```text
couture-about-contact-1440.svg
couture-about-contact-390.svg
couture-blog-system-1440.svg
couture-blog-system-390.svg
couture-cart-drawer-navigation-1440.svg
couture-cart-drawer-navigation-390.svg
couture-collection-catalog-1440.svg
couture-collection-catalog-390.svg
couture-desktop-1440.svg
couture-homepage-sections-1440.svg
couture-homepage-sections-390.svg
couture-mobile-390.svg
```

Cambios comunes: Playfair Display Regular para headings, Plus Jakarta Sans para body y controles, y `Micro` elevado a 12 px donde existia. `preset-header-product-card-variants.svg` ya estaba libre de Georgia y no requirio cambios.

## 4. Orden recomendado dentro de Figma

### 01 Foundations & Components

Orden vertical sugerido:

1. `00 Cover / Version / Ownership`
2. `01 Color Variables / Couture`
3. `02 Spacing, Grid & Shape`
4. `03 Typography Styles`
5. `04 Core Component Sets`
6. `05 Interaction Contracts`
7. `90 Deprecated`

El constructor genera `Foundations / Overview`, dos colecciones locales de un modo y los diez conjuntos nativos. Las colecciones de un modo evitan depender de funciones de planes superiores; Studio y Archive se mantienen como presets documentados hasta su materializacion funcional.

### 02 Couture Screens & Flows

Orden por recorrido, no por fecha de importacion:

1. `00 Global / Announcement / Header / Navigation / Footer`
2. `10 Homepage / Editorial Discovery`
3. `20 Collection / Search / Quick Buy`
4. `30 PDP / Size Guide / Sticky ATC / Bundle`
5. `40 Cart Drawer / Cross-sell / Checkout Handoff`
6. `50 Story / Contact / Blog / Article / System`
7. `80 Mobile States`
8. `90 Prototype Map`

Nomenclatura objetivo: `Area/Preset/Viewport/State`, por ejemplo `PDP/Couture/390/SizeGuideOpen`. Al ordenar, retirar el sufijo automatico `1` de los imports.

### 03 Presets (Studio & Archive) + QA

Usar Figma Sections para `Studio`, `Archive`, `Tablet 768`, `Mobile 320`, `Long Copy`, `RTL`, `Reduced Motion` y `Deprecated`. Un preset no debe declararse listo hasta tener al menos Homepage, PDP y Collection en desktop/mobile con diferencias funcionales, no solo cromaticas.

## 5. Escala tipografica

| Estilo local | Familia | Tamano / linea | Uso |
| --- | --- | ---: | --- |
| `Couture/Display` | Playfair Display Regular | 64 / 72 | Titulares editoriales principales |
| `Couture/Heading` | Playfair Display Regular | 48 / 56 | Encabezados de pagina y seccion |
| `Couture/Subheading` | Playfair Display Regular | 28 / 36 | Titulos de modulo y producto |
| `Couture/Body` | Plus Jakarta Sans Regular | 16 / 26 | Lectura y contenido transaccional |
| `Couture/Label` | Plus Jakarta Sans Medium | 14 / 20 | Controles, precio y labels |
| `Couture/Eyebrow` | Plus Jakarta Sans Medium | 12 / 16, 0.12em | Metadata editorial |
| `Couture/Micro` | Plus Jakarta Sans Medium | 12 / 16, 0.12em | Metadata secundaria accesible |

Regla responsive: Display puede bajar a 48/56, Heading a 36/44 y Subheading a 24/32 en 390/320. Body transaccional no baja de 14/22 y Micro nunca baja de 12/16. Los vectores no introducen tracking negativo para evitar variaciones de render entre importadores.

## 6. Variables y correspondencia CSS

El constructor crea `Atelier Flow / Couture` y `Atelier Flow / Global`, ambas con modo unico `Value`. Los nombres Figma usan kebab-case, pero conservan una correspondencia directa con las rutas W3C de `docs/design-tokens.json`.

### Colores Couture

| Token W3C | Valor | Variable Figma | CSS objetivo Phase 3B |
| --- | --- | --- | --- |
| `color.background` | `#FAF8F5` | `color/background` | `--color-background` |
| `color.surface` | `#F3EFEA` | `color/surface` | `--color-surface` |
| `color.surface_subtle` | `#EDE7DE` | `color/surface-subtle` | `--color-surface-subtle` |
| `color.foreground` | `#1C1917` | `color/foreground` | `--color-foreground` |
| `color.foreground_muted` | `#605A53` | `color/foreground-muted` | `--color-foreground-muted` |
| `color.border` | `#E5DFD5` | `color/border` | `--color-border` |
| `color.border_hairline` | `#EDE7DE` | `color/border-hairline` | `--color-border-hairline` |
| `color.accent` | `#786C5E` | `color/accent` | `--color-accent`, alias de `--color-button` |
| `color.accent_contrast` | `#FFFFFF` | `color/accent-contrast` | `--color-accent-contrast`, alias de `--color-button-label` |
| `color.sale_badge_bg` | `#1C1917` | `color/sale-badge-bg` | `--color-sale-badge-bg` |
| `color.sale_badge_text` | `#FAF8F5` | `color/sale-badge-text` | `--color-sale-badge-text` |

### Espaciado, grid y shape

| Grupo | Valores oficiales | Variables Figma | CSS objetivo Phase 3B |
| --- | --- | --- | --- |
| Spacing | `0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96` | `spacing/none` a `spacing/4xl` | `--space-none` a `--space-4xl` |
| Container | `1440px` | `grid/container-max-width` | `--page-width` |
| Gutters | `16px / 32px` | `grid/gutter-mobile`, `grid/gutter-desktop` | `--page-gutter-mobile`, `--page-gutter-desktop` |
| Tap target | `44px` | `grid/tap-target-min` | `--tap-target-min` |
| Card radius | `0px` | `shape/border-radius-card` | `--radius-card` |
| Button radius | `2px` | `shape/border-radius-button` | `--radius-button` |
| Input radius | `0px` | `shape/border-radius-input` | `--radius-input` |
| Border width | `1px` | `shape/border-width` | `--border-width` |

`layout/theme.liquid` ya expone `--font-body-family`, `--font-heading-family`, `--page-width`, `--page-gutter` y los colores base del scheme. `assets/base.css` conserva por ahora los aliases historicos `--space-1` a `--space-6`; Phase 3B debe introducir los nombres semanticos anteriores y migrar de forma controlada. No se modifico CSS de produccion en esta entrega.

## 7. Component sets nativos

| Set | Ejes / estados | Variantes | Contrato de Auto Layout |
| --- | --- | ---: | --- |
| `Button` | Primary, Secondary, Text x Default, Hover, Focus, Loading, Disabled | 15 | Horizontal, alto 52, ancho hug/fill segun instancia, padding 24 |
| `Product Card` | Default/Hover x swatch Oat/Ink | 4 | Vertical, media estable, copy hug; hover usa segunda imagen y swatch cambia media |
| `Variant Chip` | Size/Color x Default, Selected, Disabled | 6 | Horizontal, objetivo minimo 44, estado no disponible no depende solo del color |
| `Accordion` | Collapsed, Expanded, Focus | 3 | Vertical, ancho fill, contenido hug, trigger minimo 44 |
| `Sticky Cart Bar` | Hidden, Visible, Loading, Success | 4 | Horizontal desktop y stack adaptable; media y CTA no desplazan el shell |
| `Cart Item` | Default, Updating, Error | 3 | Horizontal, thumbnail fijo, contenido fill, stepper con controles 44 |
| `Drawer Shell` | Open, Empty, Error | 3 | Vertical, header/footer fijos, region central fill + scroll, backdrop blur |
| `Hotspot` | Idle, Hover, Focus, Active | 4 | Caja fija 44 x 44; el pulso visual no cambia el layout |
| `Predictive Result Card` | Product/Article/Suggestion x Default/Active | 6 | Horizontal, media opcional fija y contenido fill; navegacion por teclado |
| `Form Input` | Default, Focus, Error, Disabled | 4 | Vertical, input de 52 y mensaje hug; error no altera el ancho |
| **Total** |  | **52** | Todos los sets se crean con Auto Layout |

Contratos comunes:

- Focus visible de al menos 2 px y sin depender solo del color.
- Loading conserva dimensiones y expone estado live al implementarse.
- Disabled no elimina labels ni cambia la geometria.
- Drawer y modal requieren focus trap, Escape, contenido de fondo inert y restauracion del foco.
- Errores permanecen junto al control afectado y deben anunciarse sin borrar el estado previo.

## 8. Modulos P1 incluidos

| Modulo | Desktop | Mobile | Contrato principal |
| --- | --- | --- | --- |
| Announcement + marquee | Barra 44 px, controles previo/siguiente y ticker | Barra 44 px y ticker compacto | Pausa en hover/focus/touch; `prefers-reduced-motion` lo vuelve estatico |
| Size Guide & Model Fit | Modal 1040 x 760 | Bottom sheet | CM/INCHES, tabla, `Model is 178cm / 5'10" wearing size S`, foco accesible |
| Cart cross-sell | Drawer lateral 520 px | Drawer full-width | Dos additions de un clic, envio a $150, regalo a $250, error localizado |
| Complete the Look | Look + tres line items | Stack con tres line items | Checkboxes, variante por pieza, total vivo y CTA unico |
| Collection merchandising | Toggle 2/4, promotion tile y quick add | Toggle 1/2, promotion tile y quick-buy sheet | Preferencia de grid, fallback de producto y retorno de foco |

Decisiones de conversion preservadas:

- `+ Add` solo usa la variante predeterminada disponible; un producto multivarianza abre selector.
- El bundle es opcional y cada pieza sigue siendo comprable individualmente.
- La Promotion Tile ocupa una celda editorial sin alterar el orden accesible de los productos.
- El quick-buy mobile muestra disponibilidad, size guide, estado unavailable y feedback de agregado.
- Marquee y announcement son configurables; no bloquean navegacion ni fuerzan autoplay agresivo.

## 9. Instrucciones de materializacion en Figma

### Ruta recomendada: componentes nativos

1. Abrir el archivo oficial en Figma Desktop con la misma cuenta.
2. Ir a `Plugins > Development > Import plugin from manifest...`.
3. Seleccionar `docs/figma/atelier-flow-system-builder/manifest.json`.
4. Ejecutar `Plugins > Development > Atelier Flow System Builder` una vez.
5. Confirmar en `01 Foundations & Components` las dos colecciones, siete text styles y diez component sets.
6. Arrastrar `atelier-flow-critical-component-sets.svg` a esa pagina como lamina de comparacion y QA.
7. Arrastrar los SVG `couture-top-tier-merchandising-*` a `02 Couture Screens & Flows` y colocarlos en desktop/mobile bajo `30 PDP`, `40 Cart` y `20 Collection`.

El constructor reutiliza variables y estilos por nombre y omite component sets ya existentes, por lo que volver a ejecutarlo no debe duplicar la biblioteca. Si Figma Desktop no esta disponible, los tres SVG pueden importarse en web como referencias editables; crear componentes manualmente desde esa lamina conserva la especificacion, pero no ofrece la misma reproducibilidad.

### Recorridos a conectar despues de importar

1. Header -> mega-menu -> Collection.
2. Product Card -> Choose options -> Quick Buy -> Cart Drawer.
3. PDP -> Size Guide -> Variant -> Sticky Cart Bar -> Success/Error.
4. Collection -> Grid toggle -> Promotion Tile -> Product.
5. Cart -> Cross-sell -> Reward thresholds -> Checkout.

## 10. Validaciones ejecutadas

| Validacion | Resultado |
| --- | --- |
| Parse XML de todos los SVG | `16/16 OK` |
| Busqueda de `Georgia` en `docs/figma/*.svg` | `0 coincidencias` |
| `node --check docs/figma/atelier-flow-system-builder/code.js` | OK |
| IDs duplicados en los tres SVG nuevos | `0` |
| Colores fuera de la paleta Couture en los tres SVG nuevos | `0` |
| Referencias de imagen, URL o data externa | `0` |
| Targets interactivos especificados por debajo de 44 px | `0` |
| Contraste foreground/background | `16.50:1` |
| Contraste muted/background | `6.42:1` |
| Contraste white/accent | `5.12:1` |
| Render raster y revision visual | Componentes, desktop y mobile OK |
| `git diff --check` | OK; solo avisos esperados LF/CRLF |
| Archivos Liquid/JSON/CSS/JS de produccion modificados | `0` |

Los avisos de fontconfig del render local indican que Sharp no pudo escribir su cache, no un fallo del SVG. Las fuentes declaradas se verificaron en Figma, donde Playfair Display esta disponible.

## 11. Riesgos y siguiente accion

La sesion de Codex no expuso una operacion MCP de escritura Figma capaz de ejecutar JavaScript dentro del archivo. Por eso se completo directamente en el archivo oficial el reemplazo de fuentes y la organizacion de paginas, mientras que variables, estilos y componentes nativos se entregan como constructor local reproducible. La pagina 1 permanecera vacia hasta ejecutar una vez ese constructor.

La validacion actual cubre sintaxis, estructura, contraste y render. La ejecucion del plugin dentro de Figma y la inspeccion de cada propiedad de variante siguen siendo el ultimo control P0. Despues corresponde importar los dos blueprints P1, conectar los cinco recorridos y probar 1440, 768, 390 y 320 antes de autorizar Phase 3B.

No se realizo commit ni push, conforme a la directiva.
