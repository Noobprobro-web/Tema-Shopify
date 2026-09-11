# Entrega GPT-3A-001: Figma Visual System

```text
ID: GPT-3A-001
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: Aceptar Phase 3A o solicitar ajustes antes de autorizar Phase 3B.
Resumen en 5 lineas:
1. Se crearon blueprints Couture de alta fidelidad para Desktop 1440 y Mobile 390.
2. Ambos incluyen header editorial, PDP, variantes, bloque @app, Sticky Cart Bar y Lookbook con dos hotspots.
3. Se creo una lamina visual con variantes reales de Header y Product Card para Studio y Archive.
4. Los SVG son autocontenidos, editables, sin dependencias externas y respetan los tokens de color y forma.
5. No se modifico Liquid, JavaScript, CSS de produccion ni ninguna plantilla Shopify.
```

## 1. Archivos entregados

| Archivo | Contenido | SHA-256 |
| --- | --- | --- |
| `docs/figma/couture-desktop-1440.svg` | Frame PDP 1440x1024 + frame Lookbook 1440x1024 | `C65AEF014D4599E9E1C04C69113288CA24EA8C2474ECB1153408C06F068595AB` |
| `docs/figma/couture-mobile-390.svg` | Frame PDP 390x844 + frame Lookbook 390x844 | `0561F11D5865E0D711C43D16ADFDEF515AA1013E60ED7CB61B445BCB394594F4` |
| `docs/figma/preset-header-product-card-variants.svg` | Header + Product Card para Studio y Archive | `0E6861E30CBB32BCACBA84FE5227A63407509F5AC328CCEC3EC5DF803C6D19F7` |

Los tres archivos `.svg` son el codigo fuente canonico. No se duplica su contenido completo en este informe para evitar dos fuentes de verdad.

## 2. Arquitectura visual Couture

### Desktop 1440

- Header de 72 px, gutter de 32 px, borde hairline y navegacion con targets invisibles de 44 px.
- `<shopify-account>` simulado mediante el grupo `Shopify-Account-Simulated-PDP`.
- PDP de doble eje: galeria 2x2 de 844 px y columna de compra de 464 px.
- Galeria con cuatro encuadres hairline, contador lineal y arte vectorial reemplazable por media Shopify.
- Selector de color con tres swatches y selector de talla con estados default/selected, todos de 44 px de alto.
- Bloque `App-Block-Product-Reviews` reservado para un bloque `@app` real.
- Sticky Cart Bar de 88 px fijada visualmente al borde inferior del viewport PDP.
- Lookbook en un segundo frame 1440x1024 con dos hotspots de 48 px, estado activo y popover de producto.

### Mobile 390

- Header de 64 px con menu, cuenta y bolsa, cada accion dentro de un area de 44x44 px.
- Galeria de 358x378 px, contador `1 / 4` y progreso horizontal.
- Titulo, precio, tallas y reviews conservan prioridad antes del primer scroll largo.
- Sticky Cart Bar de 84 px con thumbnail, titulo, precio/variante y CTA de 104x52 px.
- Lookbook separado en un frame 390x844, con hotspots tactiles de 48 px y popover contenido en viewport.
- Caption inferior y CTA mantienen distancia con el borde y no dependen de hover.

### Capas y nombres

Los grupos SVG llevan IDs deterministas para conservar una jerarquia util al importar:

```text
Frame-Couture-{Desktop|Mobile}-{PDP|Lookbook}
Header-Editorial-*
Shopify-Account-Simulated-*
PDP-Gallery-*
Variant-Selector-*
App-Block-Product-Reviews-*
Sticky-Cart-Bar-*
Hotspot-*-{Idle|Active}
Lookbook-Product-Popover-*
```

## 3. Presets alternativos

### Studio

| Aspecto | Especificacion |
| --- | --- |
| Intencion | Galeria de moda contemporanea, blanca, precisa y rapida de escanear. |
| Header | 80 px, gutter 32 px, regla de 1 px, logo grotesk de peso 600. |
| Product Card | Radio 4 px, media 356x294, wishlist 44x44 y Quick Add 132x44. |
| Tipografia | Syne/General Sans para heading; Inter/system sans para body. |
| Color | Background `#FFFFFF`, surface `#F4F4F5`, foreground `#09090B`, accent `#18181B`. |
| Interaccion | Quick Add aparece por foco/hover en desktop y permanece visible en tactil. |
| Motion | 160-200 ms, opacidad y desplazamiento maximo de 8 px; sin escalado decorativo. |

### Archive

| Aspecto | Especificacion |
| --- | --- |
| Intencion | Catalogo tecnico y curatorial con lenguaje indexado y estructura expuesta. |
| Header | 80 px, gutter 32 px, borde de 1.5 px y etiquetas entre corchetes. |
| Product Card | Radio 0, reticula visible, indice de objeto 44x44 y CTA 144x44. |
| Tipografia | Space Grotesk 500; Courier New como fallback tecnico. |
| Color | Background `#F4F3EE`, surface `#EAE8DF`, foreground `#121212`, accent `#212529`. |
| Interaccion | Estados se comunican con texto, numero y borde, nunca solo mediante color. |
| Motion | 120-180 ms, cambio directo de regla/fondo; sin parallax ni desplazamientos amplios. |

## 4. Componentes Figma recomendados

Para convertir los blueprints en sistema reusable durante Phase 3B:

| Componente | Propiedades / variantes |
| --- | --- |
| `Header` | `Preset=Couture|Studio|Archive`, `Device=Desktop|Mobile`, `Menu=Closed|Open` |
| `ShopifyAccount` | `Device=Desktop|Mobile`, `State=SignedOut|SignedIn` |
| `ProductCard` | `Preset=Couture|Studio|Archive`, `State=Default|Hover|SoldOut` |
| `VariantChip` | `State=Default|Selected|Disabled`, `Available=True|False` |
| `StickyCartBar` | `Device=Desktop|Mobile`, `State=Default|Loading|Added|Error` |
| `Hotspot` | `State=Idle|Hover|Active`, target fijo de 48x48 px |
| `LookbookPopover` | `Device=Desktop|Mobile`, `State=Open|Closed` |
| `AppBlockPlaceholder` | `Device=Desktop|Mobile`, `Content=Reviews|Generic` |

Auto Layout recomendado:

- `Header`: horizontal, align center, space-between; padding 32 desktop y 16 mobile.
- `VariantChipGroup`: horizontal, gap 8, wrap activo.
- `AppBlockPlaceholder`: horizontal, align center, space-between.
- `StickyCartBar`: horizontal, align center, padding 16/32 y gap 16.
- `LookbookPopover`: horizontal, gap 16; posicion absoluta dentro del frame de media.
- `Hotspot`: posicion absoluta; no debe entrar en el flujo del Auto Layout del lookbook.

## 5. Interacciones de prototipo

### Hotspots

1. `Idle -> Active`: `On click`, Smart Animate, 180 ms, ease-out.
2. El estado `Active` muestra dos anillos concentricos y abre `LookbookPopover`.
3. Solo un hotspot puede permanecer activo; activar el segundo cierra el primero.
4. En implementacion web: `Enter`/`Space` abre, `Escape` cierra y devuelve el foco al hotspot.
5. Con `prefers-reduced-motion`, eliminar pulso y usar un cambio inmediato de borde/opacidad.

### Sticky Cart Bar

1. Aparece cuando el formulario de compra principal deja el viewport y existe una variante disponible.
2. Se oculta cuando el formulario vuelve a ser visible o al abrir cart drawer.
3. Estado `Loading`: CTA deshabilitado con etiqueta de progreso anunciable.
4. Estado `Added`: confirmacion textual breve; no depender solo de color.
5. Mobile debe incluir `env(safe-area-inset-bottom)` en Phase 3B.

## 6. Mapeo tokens Figma -> Shopify CSS

| Token de `docs/design-tokens.json` | Nombre Figma recomendado | Variable CSS existente / accion Phase 3B |
| --- | --- | --- |
| `presets.*.color.background` | `color/{preset}/background` | `--color-background` y `--gradient-background` con color solido |
| `presets.*.color.foreground` | `color/{preset}/foreground` | `--color-foreground`, `--color-link`, `--color-shadow` |
| `presets.*.color.border` | `color/{preset}/border` | `--color-border` |
| `presets.*.color.accent` | `color/{preset}/accent` | `--color-button` |
| `presets.*.color.accent_contrast` | `color/{preset}/on-accent` | `--color-button-label` |
| `presets.*.color.surface` | `color/{preset}/surface` | No existe; proponer `--color-surface` |
| `presets.*.color.surface_subtle` | `color/{preset}/surface-subtle` | No existe; proponer `--color-surface-subtle` |
| `presets.*.color.border_hairline` | `color/{preset}/border-hairline` | No existe; proponer `--color-border-hairline` |
| `presets.*.color.sale_badge_bg` | `color/{preset}/sale-bg` | Puede derivar de `--color-foreground`; variable dedicada si el merchant debe editarla |
| `presets.*.color.sale_badge_text` | `color/{preset}/sale-text` | Puede derivar de `--color-background`; variable dedicada si el merchant debe editarla |
| `presets.*.typography.font_family_heading` | `type/{preset}/heading-family` | `--font-heading-family` |
| `presets.*.typography.font_family_body` | `type/{preset}/body-family` | `--font-body-family` |
| `presets.*.typography.font_weight_heading` | `type/{preset}/heading-weight` | `--font-heading-weight` |
| `presets.*.typography.letter_spacing_heading` | `type/{preset}/heading-tracking` | No existe; proponer `--font-heading-letter-spacing` |
| `presets.*.typography.letter_spacing_eyebrow` | `type/{preset}/eyebrow-tracking` | No existe; proponer `--font-eyebrow-letter-spacing` |
| `presets.*.shape.border_radius_button` | `shape/{preset}/button-radius` | `--button-radius` |
| `presets.*.shape.border_radius_card` | `shape/{preset}/card-radius` | No existe; proponer `--card-radius` |
| `presets.*.shape.border_radius_input` | `shape/{preset}/input-radius` | No existe; proponer `--input-radius` |
| `presets.*.shape.border_width` | `shape/{preset}/border-width` | Actualmente hardcodeado; proponer `--border-width` |
| `global.grid.container_max_width` | `grid/container-max-width` | `--page-width` |
| `global.grid.gutter_mobile` | `grid/gutter-mobile` | `--page-gutter` en base |
| `global.grid.gutter_desktop` | `grid/gutter-desktop` | `--page-gutter` en breakpoint desktop |
| `global.grid.tap_target_min` | `size/tap-target-min` | No existe; proponer `--tap-target-min` |
| `global.spacing.sm` a `2xl` | `spacing/sm` a `spacing/2xl` | `--space-2` a `--space-6` ya coinciden: 12, 16, 24, 32, 48 px |
| `global.spacing.3xs`, `2xs`, `xs`, `3xl`, `4xl` | mismo path Figma | Sin equivalencia; ampliar escala CSS en Phase 3B |

### Contrato CSS objetivo para Phase 3B

Este bloque es especificacion, no fue aplicado al tema:

```css
/* Couture */
--color-background: #faf8f5;
--color-foreground: #1c1917;
--color-button: #786c5e;
--color-button-label: #ffffff;
--color-border: #e5dfd5;
--font-heading-family: "Playfair Display", Georgia, "Times New Roman", serif;
--font-body-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
--font-heading-weight: 400;
--button-radius: 2px;

/* Studio */
--color-background: #ffffff;
--color-foreground: #09090b;
--color-button: #18181b;
--color-button-label: #ffffff;
--color-border: #e4e4e7;
--font-heading-family: "Syne", "General Sans", -apple-system, sans-serif;
--font-body-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
--font-heading-weight: 600;
--button-radius: 4px;

/* Archive */
--color-background: #f4f3ee;
--color-foreground: #121212;
--color-button: #212529;
--color-button-label: #f4f3ee;
--color-border: #cbc6b4;
--font-heading-family: "Space Grotesk", "Courier New", monospace;
--font-body-family: "Space Grotesk", -apple-system, sans-serif;
--font-heading-weight: 500;
--button-radius: 0;
```

### Diferencias detectadas con `assets/base.css`

- Token `container_max_width` es 1440 px; el fallback CSS actual es 1300 px.
- Gutter tokenizado es 16 px mobile / 32 px desktop; el fallback actual es 20 px unico.
- `--space-1` actual vale 6 px, valor que no existe en la escala W3C del proyecto.
- Faltan variables semanticas para surface, surface-subtle, hairline, card radius, input radius y border width.
- Estas diferencias se documentan para Phase 3B y no se corrigieron aqui por la restriccion de no tocar codigo Shopify.

## 7. Importacion en Figma Starter

### SVG mediante copiar y pegar

Para cada archivo:

1. Abrir el `.svg` como codigo, seleccionar desde `<svg` hasta `</svg>` y copiar.
2. Hacer clic en una zona vacia del lienzo de Figma y pulsar `Ctrl+V`.
3. Si el editor pega el XML como texto, arrastrar el archivo `.svg` directamente al lienzo. Es el fallback oficial y conserva los vectores.

Despues de importar:

1. Seleccionar cada grupo `Frame-Couture-*` y usar `Ctrl+Alt+G` para convertir la seleccion en Frame.
2. Aplicar `Shift+A` solamente a los grupos enumerados en la seccion 4.
3. Mantener galeria, hotspots y popovers como capas de posicion absoluta.
4. Crear componentes con `Ctrl+Alt+K` y combinar sus estados como variantes.

Limitacion tecnica importante: SVG conserva vectores, texto y grupos, pero el estandar SVG no transporta Auto Layout, componentes, variables ni conexiones de prototipo de Figma. Esas propiedades deben aplicarse despues del pegado o crearse mediante Figma MCP cuando exista un `fileKey` objetivo. Figma confirma que Auto Layout esta disponible en Starter y se aplica con `Shift+A`.

### Tokens Studio gratuito

La cuenta Starter no necesita Dev Mode para variables locales. Flujo recomendado:

1. Abrir Tokens Studio y crear cuatro Token Sets: `global`, `couture`, `studio`, `archive`.
2. Elegir formato W3C DTCG en el plugin y normalizar `value/type/description` a `$value/$type/$description` antes de pegar. El archivo actual declara schema DTCG, pero conserva claves legacy.
3. Pegar cada subtree en la vista JSON de su Token Set y guardar.
4. Ir a `Styles & Variables -> Export Styles & Variables -> Token Sets`.
5. Exportar color, string y number como variables. En la licencia gratuita cada Token Set se convierte en una coleccion separada; los modes agrupados requieren plan/licencia superior.

Alternativa sin plugin: crear cuatro colecciones locales de Figma con los mismos nombres. Figma Starter permite crear y usar variables locales, aunque no ofrece multiples modes por coleccion ni publicar una library compartida.

Referencias operativas verificadas:

- Figma, copiar/importar SVG: <https://help.figma.com/hc/en-us/articles/360040030374-Copy-assets-between-design-tools>
- Figma, Auto Layout: <https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout>
- Figma, variables en Starter: <https://help.figma.com/hc/en-us/articles/39723547036055-Components-collection-Library-fundamentals>
- Tokens Studio, exportar Token Sets gratuitos: <https://docs.tokens.studio/figma/export/>
- Tokens Studio, formato DTCG/legacy: <https://docs.tokens.studio/manage-settings/token-format>

## 8. Accesibilidad y QA

### Contraste calculado

| Par | Ratio |
| --- | ---: |
| Couture foreground / background | 16.50:1 |
| Couture muted / background | 6.42:1 |
| Couture accent / white | 5.12:1 |
| Studio foreground / background | 19.90:1 |
| Studio muted / background | 7.73:1 |
| Studio accent / white | 17.72:1 |
| Archive foreground / background | 16.86:1 |
| Archive muted / background | 7.36:1 |
| Archive accent / contrast | 13.88:1 |

Todos los pares usados para texto body o UI superan WCAG 2.2 AA. Los targets interactivos visibles o documentados miden al menos 44x44 px; los hotspots miden 48x48 px.

### Validaciones ejecutadas

| Validacion | Resultado |
| --- | --- |
| Parse XML de los tres SVG | PASS |
| Dimensiones raiz y frames internos | PASS: 1440 / 390 contractuales |
| IDs duplicados | PASS: 0 en los tres archivos |
| Recursos externos, scripts, `foreignObject`, patterns o markers | PASS: 0 |
| Render raster 2x con Sharp | PASS: 2880x4288, 780x3528 y 2880x2240 |
| QA visual de texto, solapamientos y clipping | PASS |
| `git diff --check` | PASS |
| Archivos Liquid/JSON/CSS/JS modificados | 0 |

## 9. Riesgos y siguiente accion

### P0

- Ninguno en el artefacto SVG.

### P1

- El JSON de tokens mezcla un `$schema` DTCG con claves legacy `value/type`. Gemini debe autorizar una tarea corta de normalizacion antes de usar importacion automatica en Tokens Studio.
- El CSS actual no expone todas las variables semanticas y sus fallbacks de page width/gutter difieren del contrato visual. Resolver en Phase 3B, no en este cambio.
- Sin un `fileKey`/URL de Figma no se pueden crear Auto Layout, variables y prototipos mediante MCP ni validar su estructura nativa.

### P2

- Las figuras y productos son placeholders vectoriales originales para definir composicion. Deben sustituirse por media merchant real conservando aspect ratios.

Siguiente accion recomendada para Gemini: revisar los tres SVG y este mapeo; si acepta Phase 3A, emitir una tarea Phase 3B separada para (1) normalizar tokens, (2) crear variables/componentes nativos en el archivo Figma objetivo y (3) traducir Sticky Cart Bar + Lookbook a Liquid/CSS/JS.

## 10. Git

No se realizo commit ni push. La directiva no los autorizaba antes de la revision de Gemini.
