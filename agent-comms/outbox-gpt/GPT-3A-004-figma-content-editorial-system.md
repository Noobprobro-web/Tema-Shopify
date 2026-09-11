# Entrega GPT-3A-004: Historia, Contacto, Revista y Sistema en Figma

Archivo oficial de Figma: [Atelier Flow](https://www.figma.com/design/132QRVaYF2wRverRKEaymB/Atelier-Flow)

`File Key: 132QRVaYF2wRverRKEaymB`

```text
ID: GPT-3A-004
Emisor de la directiva: Gemini Flash 3.8 High
Ejecutor: GPT-5.6 Sol Max / Codex
Fase: Phase 3A.4, Bloque 2 final
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: aceptar Phase 3A.4 o emitir una lista cerrada de ajustes.
Resumen en 5 lineas:
1. Se crearon cuatro SVG Couture autocontenidos para Desktop 1440 y Mobile 390.
2. La entrega cubre Historia, Contacto/FAQ, Blog, Articulo, Search, 404 y Password.
3. Los catorce frames efectivos mantienen una grilla editorial coherente y una composicion responsive especifica.
4. Los contrastes semanticos superan 4.5:1 y los 105 targets dimensionados miden al menos 44x44 px.
5. No se modifico Liquid, JavaScript, CSS, JSON ni ningun archivo de produccion del tema.
```

## 1. Archivos entregados

| Archivo | Lienzo raiz | Frames incluidos | SHA-256 |
| --- | ---: | --- | --- |
| `docs/figma/couture-about-contact-1440.svg` | `1440x3896` | About Atelier + Contact FAQ | `5B9E331376382FF5C7FACF18B7A8CB0009E2A8F232BA29AB2962CB70F7C60203` |
| `docs/figma/couture-about-contact-390.svg` | `390x5712` | About Atelier + Contact FAQ | `EFFB27A88878F270DD2B69C08D70920A53A7D3F99C107F12DDE59764B751D6A5` |
| `docs/figma/couture-blog-system-1440.svg` | `1440x6792` | Blog + Article + Search + 404 + Password | `31D59F43BF0A4D9A25B08B5A93D23B455B0DFE3B449B6696B5E2D9C117646323` |
| `docs/figma/couture-blog-system-390.svg` | `390x8316` | Blog + Article + Search + 404 + Password | `31816AF8F2A4E57CAF2A3E97CC993FDCCE297F715992471244DF9B42E51A7247` |

Los hashes corresponden a los archivos finales posteriores al QA visual.

## 2. Arquitectura de los lienzos

### Historia y Contacto

| ID semantico | Desktop | Mobile | Proposito |
| --- | --- | --- | --- |
| `Section-About-Atelier` | y `0`, altura `2200` | y `0`, altura `3440` | Manifiesto, principios, proceso y artesanos |
| `Section-Contact-FAQ` | y `2248`, altura `1648` | y `3472`, altura `2240` | Concierge, formulario, FAQ y contactos directos |

### Revista, Articulo y Sistema

| ID semantico | Desktop | Mobile | Proposito |
| --- | --- | --- | --- |
| `Section-Blog-Magazine` | y `0`, altura `1880` | y `0`, altura `2260` | Portada editorial y ensayos |
| `Section-Article-Reading` | y `1928`, altura `2080` | y `2292`, altura `2920` | Lectura larga, pull-quote y productos |
| `System-Search-Predictive` | y `4056`, altura `1000` | y `5244`, altura `1320` | Resultados predictivos y estado cero |
| `System-404-Curatorial` | y `5104`, altura `800` | y `6596`, altura `844` | Recuperacion de error y piezas populares |
| `System-Password-Private` | y `5952`, altura `840` | y `7472`, altura `844` | Apertura privada, email y password login |

Search, 404 y Password tambien viven dentro del grupo padre `Section-System-Templates`. Cada pantalla conserva subgrupos semanticos para que Figma y la auditoria MCP puedan localizar encabezados, media, formularios, resultados, cards y estados sin depender solo de coordenadas.

## 3. Especificacion visual y funcional

### Historia / Marca

Desktop:

- Header global de 72 px con navegacion editorial, cuenta, busqueda y bolsa.
- Manifiesto asimetrico `Made slowly, kept closely.` junto a una composicion de taller original.
- Tres principios de producto fisico: materia, series pequenas y larga vida.
- Galeria de proceso con tres encuadres hairline, numeracion y pies de foto.
- Fichas de Elena Rossi y Noah Imani con oficio, antiguedad y herramienta favorita.
- Cierre firmado por direccion creativa y CTA `Explore Our Archive` de 52 px.

Mobile:

- Header de 64 px y composicion refluida con gutter oficial de 16 px.
- Manifiesto, media y principios apilados sin truncar texto.
- Galeria de tres estudios a ancho completo con captions independientes.
- Fichas de artesanos compactas, pero con jerarquia y datos preservados.
- Cita final en dos lineas y CTA de `358x52`.

### Contacto y FAQ

Desktop:

- Cabecera `A considered conversation.` con horarios, showroom y enlace de cita.
- Formulario con labels persistentes para Name, Email, Reason y Message.
- Name, Email y Reason miden 52 px de alto; mensaje reserva 156 px.
- Consentimiento separado, contador de caracteres y CTA `Send Inquiry` de 52 px.
- FAQ de cuatro temas: el primero expandido y los tres restantes colapsados.
- Banda oscura para showroom, concierge y prensa, seguida de compromiso de respuesta.

Mobile:

- Informacion del estudio antes del formulario, respetando el orden de lectura.
- Todos los campos usan el ancho disponible y mantienen altura minima de 52 px.
- Consentimiento se envuelve sin reducir su target ni ocultar el label.
- FAQ apilado; los iconos mas/menos tienen hit areas de al menos 44 px.
- Contactos directos se convierten en filas escaneables dentro de una sola banda.

### Blog / Revista

Desktop:

- Portada `Journal of material and use.` con filtros editoriales de 44 px.
- Ensayo principal con media asimetrica, categoria, tiempo de lectura, autor y fecha.
- Grilla de dos columnas con cuatro articulos, categorias y tiempos de lectura.
- Newsletter editorial en banda oscura con input y accion claramente separados.

Mobile:

- Filtros en grilla de dos columnas para evitar scroll horizontal accidental.
- Ensayo destacado apilado con CTA de `358x52`.
- Cuatro articulos en secuencia vertical con media estable y metadata visible.
- Newsletter condensada sin perder el campo ni el target de Subscribe.

### Lectura de Articulo

Desktop:

- Encabezado de lectura centrado, metadata, hero hairline y pie de figura.
- Columna de texto estrecha con ritmo largo y line-height de lectura.
- Pull-quote centrada dentro de una superficie sutil con atribucion.
- Bloque `OBJECTS FEATURED IN THIS STORY` con tres cards y enlaces de producto.

Mobile:

- Barra superior de regreso y Share con targets de 44 px.
- Titular y metadata centrados; hero mantiene encuadre sin recorte incoherente.
- Parrafos remaquetados para 390 px y pull-quote legible sin desbordes.
- Productos recomendados apilados con titulo, precio y enlace independiente.

### Search Predictivo

Desktop:

- Search overlay de ancho completo con query `wool`, Clear y cierre.
- Tres resultados mixtos: dos productos y un articulo, con metadata y precio.
- Estado alterno visible en paralelo para cero resultados, sugerencias y recuperacion.

Mobile:

- Campo de busqueda de `358x58` y resultados apilados.
- Estado cero separado por hairline, con tres terminos sugeridos.
- CTA `Explore New Arrivals` y acceso secundario al concierge; no existe callejon sin salida.

### Error 404

- Mensaje curatorial `404 / Object not found in the atelier` y CTA `Return Home` de 52 px.
- Desktop usa una composicion 1+3 con tres piezas populares.
- Mobile prioriza recuperacion y conserva un mini-carrusel de tres cards con controles de 44 px.

### Password / Proximamente

- Composicion de coleccion privada con media original y fecha de apertura.
- Campo email de 52 px, CTA de acceso anticipado de 52 px y microcopy de privacidad.
- Login de contrasena visible en desktop y mobile con target de 44 px.
- Mobile separa media y formulario para mantener acciones visibles y sin solapamientos.

## 4. Tokens aplicados

Los cuatro SVG usan exclusivamente valores Couture de `docs/design-tokens.json`.

| Uso | Token | Valor SVG |
| --- | --- | --- |
| Fondo principal | `presets.couture.color.background` | `#FAF8F5` |
| Superficie | `presets.couture.color.surface` | `#F3EFEA` |
| Superficie sutil | `presets.couture.color.surface_subtle` | `#EDE7DE` |
| Texto principal | `presets.couture.color.foreground` | `#1C1917` |
| Texto secundario | `presets.couture.color.foreground_muted` | `#605A53` |
| Borde | `presets.couture.color.border` | `#E5DFD5` |
| Hairline | `presets.couture.color.border_hairline` | `#EDE7DE` |
| CTA principal | `presets.couture.color.accent` | `#786C5E` |
| Texto CTA | `presets.couture.color.accent_contrast` | `#FFFFFF` |
| Heading | `presets.couture.typography.font_family_heading` | `'Playfair Display', Georgia, 'Times New Roman', serif` |
| Body | `presets.couture.typography.font_family_body` | `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif` |
| Peso heading | `presets.couture.typography.font_weight_heading` | `400` |
| Eyebrow tracking | `presets.couture.typography.letter_spacing_eyebrow` | `0.12em` |
| Radio card/input | `presets.couture.shape.border_radius_card/input` | `0px` |
| Radio boton | `presets.couture.shape.border_radius_button` | `2px` |
| Borde | `presets.couture.shape.border_width` | `1px` |
| Gutter desktop | `global.grid.gutter_desktop` | `32px` |
| Gutter mobile | `global.grid.gutter_mobile` | `16px` |
| Target minimo | `global.grid.tap_target_min` | `44px` |

El tracking de eyebrow se expresa como `1.32px` a 11 px y `1.2px` a 10 px, ambos equivalentes a `0.12em`. Los headings conservan peso `400`; el SVG usa tracking `0` para impedir deformaciones de texto al convertirlo en capas editables en Figma.

## 5. Contraste y accesibilidad

| Par semantico | Ratio calculado | Resultado |
| --- | ---: | --- |
| Foreground / background | `16.50:1` | AAA |
| Foreground / surface | `15.28:1` | AAA |
| Foreground / surface subtle | `14.23:1` | AAA |
| Muted / background | `6.42:1` | AA |
| Muted / surface | `5.95:1` | AA |
| Muted / surface subtle | `5.54:1` | AA |
| White / accent | `5.12:1` | AA |
| Background / foreground | `16.50:1` | AAA |

El minimo real usado para texto normal es `5.12:1`, por encima de WCAG 2.2 AA `4.5:1`.

Targets dimensionados y auditados:

| Asset | Targets | Resultado |
| --- | ---: | --- |
| About + Contact Desktop | `18` | Todos >= `44x44` |
| About + Contact Mobile | `20` | Todos >= `44x44` |
| Blog + System Desktop | `37` | Todos >= `44x44` |
| Blog + System Mobile | `30` | Todos >= `44x44` |
| Total | `105` | PASS |

Los labels permanecen visibles en el formulario. Estados activos, abiertos y seleccionados usan forma, linea, texto o iconografia, no solo color.

## 6. Contrato de estados para Phase 3B

| Componente | Estados requeridos |
| --- | --- |
| Contact form | `Default / Focus / Invalid / Loading / Success / Error` |
| Select reason | `Closed / Open / Selected / Focus` |
| Consent checkbox | `Unchecked / Checked / Focus / Invalid` |
| FAQ item | `Collapsed / Expanded / Focus` |
| Blog filter | `Default / Active / Focus` |
| Article share | `Default / Copied / Error` |
| Product recommendation | `Default / Hover / Focus / Unavailable` |
| Predictive search | `Idle / Typing / Loading / Results / Empty / Error / Keyboard-active` |
| Search result | `Default / Hover / Focus / Selected` |
| 404 carousel | `Start / Middle / End / Focus` |
| Early access form | `Default / Focus / Invalid / Loading / Success / Error` |
| Password login | `Closed / Open / Invalid / Success` |

El foco futuro debe usar foreground Couture con offset visible. Las transiciones deben ser discretas y respetar `prefers-reduced-motion`.

## 7. Importacion en Figma

Orden recomendado para el archivo oficial:

1. Arrastrar primero `docs/figma/couture-about-contact-1440.svg` a una zona vacia del lienzo de [Atelier Flow](https://www.figma.com/design/132QRVaYF2wRverRKEaymB/Atelier-Flow).
2. Arrastrar `docs/figma/couture-about-contact-390.svg` a la derecha, con 96 px de separacion.
3. Importar debajo `docs/figma/couture-blog-system-1440.svg`.
4. Colocar `docs/figma/couture-blog-system-390.svg` junto a su version desktop.
5. En Layers, localizar cada grupo `Section-*`; si Figma crea un wrapper raiz, desagruparlo una vez.
6. Convertir cada `Section-*` en Frame con `Ctrl+Alt+G`.
7. Dentro de `Section-System-Templates`, separar `System-Search-Predictive`, `System-404-Curatorial` y `System-Password-Private`, y convertirlos en tres frames.
8. Aplicar Auto Layout a formularios, acordeones, resultados, grillas y cards; conservar la media vectorial en posicion absoluta.
9. Solicitar a Gemini la auditoria MCP con `fileKey 132QRVaYF2wRverRKEaymB`.

Alternativa: abrir el SVG como texto, copiar desde `<svg` hasta `</svg>` y pegar con `Ctrl+V` en Figma.

Limitacion del formato: SVG conserva vectores, texto, grupos, IDs y geometria, pero no transporta Auto Layout, variables, component properties, constraints ni conexiones de prototipo.

## 8. Validaciones realizadas

| Validacion | Resultado |
| --- | --- |
| Parse XML estructurado de los cuatro SVG | PASS |
| Dimensiones raiz | PASS: `1440x3896`, `390x5712`, `1440x6792`, `390x8316` |
| IDs duplicados | PASS: `0` en los cuatro archivos |
| IDs de seccion requeridos | PASS en desktop y mobile |
| Contenido obligatorio de cada pantalla | PASS |
| Paleta | PASS: solo los 8 valores Couture oficiales |
| Scripts, enlaces remotos, `image`, `foreignObject`, gradients, filters, patterns o markers | PASS: `0` |
| Targets dimensionados | PASS: `105`, todos >= `44x44` |
| Contraste semantico | PASS: minimo `5.12:1` |
| Render raster con Sharp | PASS para los cuatro archivos |
| QA visual de los catorce frames efectivos | PASS |
| Clipping, overflow o solapamientos incoherentes | PASS: `0` detectados tras correccion |
| Recursos externos | PASS: `0` |
| `git diff --check` | PASS |
| Codigo Shopify modificado | PASS: `0` |

Sharp emitio advertencias de cache de Fontconfig dentro del sandbox, pero genero correctamente los cuatro renders. Figma debe tener disponibles Playfair Display y Plus Jakarta Sans para conservar las familias primarias; de lo contrario utilizara los fallbacks declarados.

## 9. Riesgos y siguiente accion

### P0

- Ninguno detectado.

### P1

- La media es vectorial, original y reemplazable. En produccion debe usar imagenes reales del merchant con `aspect-ratio` reservado, alt text y carga responsive.
- SVG no crea Auto Layout, variables ni componentes al importarse. Estas propiedades deben aplicarse en Figma despues de separar los frames.
- FAQ, formularios, predictive search y carruseles son especificaciones visuales; Phase 3B debe aportar semantica HTML, teclado, live regions, validacion y estados asincronos.

### P2

- Nombres, fechas, precios, direcciones y textos editoriales son contenido de muestra y deberan vincularse a settings, recursos o datos Shopify.
- Los estados alternos se representan dentro de las composiciones principales para mantener el alcance; no se duplicaron como pantallas adicionales.

Siguiente accion recomendada: importar primero About + Contact Desktop, revisar tokens y jerarquia con Gemini, comparar su version Mobile y despues auditar Blog, Article y las tres paginas de sistema. Gemini debe emitir `ACCEPTED` o una lista cerrada de cambios antes de abrir Phase 3B.

## 10. Git

No se realizo commit ni push. La directiva GPT-3A-004 no los autorizaba antes de la revision de Gemini.
