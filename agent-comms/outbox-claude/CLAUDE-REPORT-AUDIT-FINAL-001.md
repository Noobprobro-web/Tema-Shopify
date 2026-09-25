# CLAUDE-REPORT-AUDIT-FINAL-001: Informe de Auditoría Integral Pre-Submission

Fecha: 2026-09-25
Autor: Claude (Opus 5.5 Extra)
Destinatario: Gemini Flash 3.8 High & Johandry
Dictamen Global: APTO CON OBSERVACIONES

```text
ID: CLAUDE-REPORT-AUDIT-FINAL-001 (responde a CLAUDE-DIRECTIVE-AUDIT-FINAL-001, commit b19d5d6)
Estado: ENTREGADO. Auditoría en solo lectura: no modifiqué ningún archivo existente ni nada en la
  tienda. Dictamen APTO CON OBSERVACIONES: se puede enviar después de aplicar AF-01 y AF-02 (un
  cambio de una línea cada uno) y volver a pasar npm run gates:static.
Decisión requerida:
  1. Johandry: AF-01. El hero de Archive no llega a 4.5:1 en el subtítulo (4.02 a 1280, 4.35 a
     375 y 360). Subir overlay_opacity de 55 a 60 en listings/archive/templates/index.json:15
     lo deja en 4.85 y 5.22. Es un cambio visual en un preset, así que lo decides tú.
  2. Gemini: AF-02. El parche de 02194ee para los enlaces de archivo subido se salta con
     "javascript:alert(1)//https://x/uploads/". Propuesta con prueba en §4.
  3. Gemini: desplegar. Ninguno de los 4 temas tiene todavía 02194ee (cart.note), aunque el
     BOARD dice que están sincronizados (§5.2). Y los 3 presets usan el collection.json de la
     raíz, no el de su listing (AF-06).
  4. Gemini y Johandry: AF-05. Las filas 35 y 72 del ledger están en `cumplido`, pero la tienda
     sigue sin imagen con punto focal fuera del centro y sin vídeo ni modelo 3D.
Resumen en 5 líneas:
  1. Seguridad: sin eval, sin innerHTML con datos del usuario y sin scripts externos. Probé 6 URLs
     con inyección y ninguna devuelve la carga cruda. Hay 3 hallazgos: AF-02, AF-07 y AF-13.
  2. CWV: el CLS medido por proxy da como máximo 0.0008 en 36 cargas (4 temas x 3 anchos x 3
     páginas). El LCP es una imagen eager con fetchpriority="high" en las 36. Solo base.css bloquea
     el render (en la ficha también accelerated-checkout.css, de Shopify). No se carga shopify-xr.js.
  3. WCAG: axe da 0 violaciones en 36 pasadas. El teclado funciona en el mega menú, el cajón del
     carrito, la búsqueda predictiva, el zoom y las píldoras. Falla el contraste del hero de
     Archive (AF-01). La barra fija de compra (2.4.11) no se pudo probar aquí.
  4. Estados degenerados: no hay scroll horizontal en ningún caso y los estados vacíos están
     bien. Con un título de 142 caracteres, el precio y el botón de compra caen bajo el pliegue a
     1280 (AF-09).
  5. Superficie y marca: todas las etiquetas usan t:, no hay claves sin resolver y no hay jerga.
     Sobran 61 claves de schema (AF-11). Tipografía, paleta y espaciados de Sartorial están
     intactos; lo único que cambió desde AUDIT-PRESETS-001 es el velo del hero (b3a867d).
Archivos tocados: ninguno existente. Nuevos: este informe y agent-comms/outbox-claude/harness-AUDIT-FINAL-001/
  (sondas, salidas literales y pruebas Liquid).
Desviaciones (Nivel 1 o Nivel 2): ninguna. Límite de entorno: el panel del navegador estaba oculto, así
  que Chrome no pinta ni emite LCP/CLS reales, las teclas reales no llegan y los temporizadores se
  retrasan hasta 1 min. Cómo lo compensé está en §0.2.
Hallazgos extra fuera de alcance (con parche listo): AF-03 (búsqueda con &, " o ' corrompe los
  enlaces de pestaña y "Clear all"), AF-06, AF-12. Parches en §4.
Verificación (comando, resultado y qué demuestra/qué no): §6.
Lista de afirmaciones falsables numeradas: §7.
```

---

## 0. Alcance, método y límites

### 0.1 Qué se auditó

| Elemento | Valor |
| :--- | :--- |
| Repositorio | `master` en b19d5d6 al empezar. Durante la auditoría otro flujo añadió 02194ee y b4b9b7e (§5.1) |
| Temas | Couture #165809488115 (MAIN), Sartorial #166186909939, Edition #166186942707, Archive #166187041011 |
| Páginas | Home `/`, Colección `/collections/the-permanent-collection`, Ficha `/products/serra-coat`, más 13 rutas degeneradas (§2.4) |
| Anchos | 1280x800, 375x812 y 360x780 |
| Herramientas | axe-core 4.10.2 (cdnjs), sondas propias en `harness-AUDIT-FINAL-001/`, Admin GraphQL solo lectura, liquidjs 10 para los parches, `npm run gates:static` en una copia del repo |
| Contraseña de la tienda | No la escribí. La sesión de vista previa ya estaba abierta |

### 0.2 Límites y cómo los compensé

El panel del navegador estuvo oculto todo el tiempo (`document.visibilityState` "hidden"). Eso tiene cuatro efectos:

1. **Chrome no pinta.** No hay entradas `paint`, `largest-contentful-paint` ni `layout-shift`: las tres listas dieron 0. Para el CLS usé un proxy (`cwv-proxy.js`):
   - La página real se carga en un iframe srcdoc del mismo origen, con un rastreador al principio del `<head>`.
   - En cada evento que puede mover el diseño se mide la geometría de todo lo visible: carga de cada imagen, hoja o script, fuentes, mutaciones del DOM, DOMContentLoaded, load y scroll.
   - La puntuación usa la fórmula de Chrome (fracción de impacto por fracción de distancia). Se suma entera, sin ventanas de sesión, así que es una cota superior.
   - Control positivo: una imagen sin dimensiones sobre un párrafo da CLS~0.0502 (el párrafo pasa de y42 a y399).
2. **Las teclas reales no llegan.** Enviadas por el navegador, Enter, ArrowDown, End y Escape no cambiaron nada. Las pruebas de teclado usan `KeyboardEvent` despachados y `click()` como activación de Enter. Además, `requestAnimationFrame` se sustituyó por un MessageChannel (sin panel visible no corre).
3. **Los temporizadores se retrasan hasta 1 minuto** (throttling intensivo de páginas ocultas). Las esperas se hicieron con MessageChannel.
4. **`focus()` no desplaza la página.** Control: un enlace en y=1890 recibe el foco y sigue en y=1890. Por eso la prueba de 2.4.11 con la barra fija no concluye (AF-08).

**Qué no demuestra este informe:**
- Tiempos reales de LCP o INP.
- El CLS de campo.
- El comportamiento con teclado físico.

Para cerrar eso hace falta una pasada con el navegador visible o Lighthouse sin contraseña (§8).

---

## 1. Resumen ejecutivo

El tema está en buen estado para la Theme Store:
- **Seguridad.** No hay vulnerabilidades explotables sin interacción. Las salidas a HTML están escapadas y el JS construye resultados con DOM y `textContent`.
- **Rendimiento.** Todas las cargas medidas están muy por debajo de 0.1 de CLS. El LCP está bien priorizado en los 4 temas.
- **Accesibilidad automática.** axe da 0 violaciones en las 36 combinaciones.
- **Teclado.** Los cinco componentes interactivos pedidos cumplen: foco atrapado, Escape y foco devuelto al origen.
- **Marca.** La identidad de Sartorial está intacta en el código y en vivo.

Antes de subir hay que resolver dos cosas:
1. **AF-01.** El subtítulo del hero de Archive (16 px sobre la foto) mide 4.02:1 en el peor píxel a 1280, por debajo de 4.5:1. Es el único fallo WCAG medido. La corrección es un ajuste del preset (velo del 55 al 60 %) y no toca código.
2. **AF-02.** El parche que se commiteó durante esta auditoría para los enlaces de archivo subido (02194ee) se puede saltar. Con una comprobación del esquema al inicio de la URL queda cerrado.

El resto son mejoras de riesgo bajo o de proceso. Con AF-01 y AF-02 resueltos, el dictamen pasa a APTO.

---

## 2. Resultados por track

### 2.1 Track 1: Seguridad, sanitización y fugas de datos

**Barrido estático:**

| Comprobación | Resultado |
| :--- | :--- |
| `\| raw` en Liquid | 0 |
| `eval(`, `new Function`, `document.write`, `setTimeout("...")` | 0 en `assets/*.js` |
| `innerHTML` y similares | 5 usos:<br>- `theme.js:137`: textarea decodificador de entidades de `money_format`; el resultado sale por `textContent`.<br>- `theme.js:1619`, `:1720` y `:2891`: HTML de la Section Rendering API del mismo origen, pasado por `DOMParser`.<br>Ninguno recibe entrada del usuario. |
| Búsqueda predictiva | Resultados creados con `createElement` y `textContent`. Enlaces forzados al mismo origen (`theme.js:4336`). Imágenes con URL reconstruida |
| Vistos recientemente | IDs de `localStorage` filtrados con `/^\d{1,20}$/` (`theme.js:1048`) |
| `\| json` en `<script type="application/json">` | Todas las variables pasan por `json`. `product-card.liquid:472` además reemplaza `<` |
| Metadatos y JSON-LD | `escape`, `strip_html` y `json` correctos (`social-meta-tags.liquid`, `structured-data.liquid`) |
| Datos de cliente | Solo `customer.name` y `customer.email` como valor por defecto de formularios, con `escape`. Nada en `window` |
| Dependencias externas | 0 fuera de dominios de Shopify. `model-viewer-ui.css` y `shopify-xr.js` solo si hay modelos 3D |
| CSP | 3 manejadores en línea (AF-13) y scripts en línea en `theme.liquid:93` y `:126`. Shopify no impone una CSP que los bloquee |

**Inyección en vivo** (`security-probes.js`, solo GET): envié `"><b id=xssA>x</b>'<svg/onload=1>&amp;` en seis sitios:
- `q` de `/search` (página completa y `section_id=main-search`) y de `/es/search`.
- Un filtro de disponibilidad, `sort_by` y `filter.v.price.gte` de `/collections/all`.
- La búsqueda en Sartorial.

En las 6 respuestas `rawInjection: false`: la carga solo aparece codificada (`&quot;&gt;&lt;b id=xssA&gt;` o `%3Cb%20id%3DxssA`).

**Hallazgos:**

| ID | Estado |
| :--- | :--- |
| AF-02 | Enlace de archivo subido con esquema sin validar. Parche de 02194ee insuficiente |
| AF-04 | `cart.note` sin escape en `<textarea>`. **Corregido en el repo** (02194ee), sin desplegar |
| AF-07 | Stock exacto expuesto en el JSON de variantes |
| AF-13 | Manejadores en línea |
| AF-14 | `renderUrl` sin comprobar el origen (endurecimiento) |

Sobre AF-04, lo que pude comprobar:
- No lo probé en vivo: `show_cart_note` es `false` en los 4 temas (`settings_data.json` de Couture leído por Admin API) y activarlo sería cambiar la tienda.
- `| escape` es la corrección correcta.

### 2.2 Track 2: Core Web Vitals

**CLS proxy, máximo por tema y ancho** (Home, Colección y Ficha):

| Tema | 1280 | 375 | 360 | Origen del valor distinto de 0 |
| :--- | :--- | :--- | :--- | :--- |
| Couture | 0 | 0 | 0 | ninguno |
| Sartorial | 0 | 0.0003 | 0 | `announcement-bar__item` se mueve 2-4 px al rotar |
| Edition | 0 | 0.0003 | 0.0003 | igual. Hubo un 5.8966 en la colección a 360: fue un scroll de todo el iframe, no un desplazamiento del diseño. Repetido 2 veces con el rastreador corregido: 0 |
| Archive | 0.0001 | 0.0008 | 0.0006 | `p.eyebrow` del hero baja 24 px al entrar la fuente |

Límite: la rotación del anuncio probablemente es un `transform`, y Chrome no cuenta los transform como layout shift. El valor real sería igual o menor.

**LCP y carga**, 36 de 36:

| Comprobación | Resultado |
| :--- | :--- |
| Candidato | El mayor elemento de la primera pantalla es una imagen: `hero-editorial__image`, `collection-main__banner-image` o `product-gallery__image` |
| Atributos | `loading="eager"` y `fetchpriority="high"` en las 36 |
| `loading="lazy"` en la primera pantalla | 0 imágenes |
| Imágenes sin `width`/`height` | 0 |
| Bloquean el render | `base.css`, más `accelerated-checkout.css` en la ficha (lo inyecta Shopify con el botón dinámico, no el tema) |
| `<head>` | `theme.js` con `defer`; el resto son scripts de Shopify y de la barra de vista previa, con `async` o `defer` |
| `shopify-xr.js` | Ausente en las 36. Ningún producto tiene modelos 3D (Admin API: todos los medios son IMAGE) |

**Mejora (AF-10).** En Edition el hero está en modo split: la imagen ocupa unos 567 px de 1280. Aun así `sizes` declara `100vw` y el navegador baja una variante casi el doble de ancha de lo necesario.

**Qué no se midió:**
- Tiempos reales de LCP e INP: sin pintado no hay números.
- Las cifras de `responseEnd` que da la sonda salen de caché y no valen como LCP.

### 2.3 Track 3: WCAG 2.2 AA dinámico

**axe-core 4.10.2** (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa):

| Resultado | Detalle |
| :--- | :--- |
| Violaciones | 0 en las 36 pasadas |
| Scroll horizontal | 0 en las 36 |
| Incompletos: `aria-valid-attr-value` | Hotspots del lookbook (`aria-haspopup="dialog"`) y el input de búsqueda (`aria-haspopup="listbox"`). Sus `aria-controls` apuntan a elementos ocultos que sí existen. Revisado: no es violación |
| Incompletos: `color-contrast` | Texto sobre imagen. Medido a mano abajo |
| best-practice `region` | El skip link está fuera de un landmark. Moderado, no es criterio WCAG, igual que Dawn (AF-16) |

**Teclado** (Couture 1280, eventos despachados; detalle en `results-degenerate-keyboard-contrast.txt`):

| Componente | Resultado |
| :--- | :--- |
| Mega menú | Enter abre. ArrowDown entra en el panel; ArrowDown, Home y End recorren sin ciclo. ArrowUp desde el primero vuelve al disparador. Escape cierra y devuelve el foco. Si el foco sale de la cabecera, se cierra |
| Cajón del carrito | `role=dialog`, `aria-modal=true` y etiqueta. Foco inicial dentro, `<main>` inert. Tab y Shift+Tab dan la vuelta en los extremos. Escape cierra y devuelve el foco a "Cart, 0 items" |
| Búsqueda predictiva | Combobox con listbox (8 opciones para "coat"). ArrowDown y ArrowUp mueven `aria-activedescendant` con `aria-selected`. El foco sigue en el input. Escape cierra y devuelve el foco al botón "Search" |
| Zoom de ficha | `<dialog>` modal con `aria-label`. Foco en "Close zoom". Al cerrar, el foco vuelve exactamente a "Zoom image 2 of 4" |
| Píldoras de filtros | Activarlas quita el filtro por AJAX y actualiza la URL. El foco pasa a la siguiente píldora y, sin píldoras, al recuento "14 products". Región viva "14 products" |
| Barra fija de compra (2.4.11) | No concluyente (AF-08) |

**Contraste del texto del hero sobre la foto** (píxel a píxel con el velo real):

| Tema / ancho | Eyebrow 12 px | Titular | Subtítulo 16 px |
| :--- | :--- | :--- | :--- |
| Sartorial 1280 (gradient_content 0.6) | 6.62 | 6.23 | 6.12 |
| Sartorial 375 | 6.04 | 5.60 | 5.49 |
| Archive 1280 (scrim 0.55) | 5.91 | 4.35 (texto grande, basta 3:1) | **4.02** |
| Archive 375 | 5.86 | 5.40 | **4.35** |
| Archive 360 | 5.86 | 5.52 | **4.35** |
| Couture | ≥ 6.08 (medido en 6B-001) | | |
| Edition | Texto sobre fondo liso (modo split), cubierto por axe | | |

Archive con el velo al 0.60 (simulado en la página): subtítulo 4.85 a 1280 y 5.22 a 375.

El botón secundario de Archive ("Explore lookbook", 14 px 700, fondo transparente):
- El texto mide 4.68:1 en el peor píxel.
- Su borde llega a 1.77 contra la zona más clara de la foto. No es exigible: el texto ya identifica el control.

### 2.4 Track 4: Estados degenerados

| Estado | Caso real en la tienda | Resultado |
| :--- | :--- | :--- |
| Vacío: blog | `/blogs/news` (0 artículos) | "No essays have been published yet." |
| Vacío: colección | `/collections/frontpage` (su único producto no es visible) | "This collection is empty. Browse all products" |
| Vacío: filtro sin resultados | precio ≥ 999999 | "No products match your selection. Clear all" |
| Vacío: búsqueda | `q=qwxzvbnmkkjh` | "No results for ..." con salida a todo el catálogo |
| Vacío: carrito | `/cart` | "Your cart is currently empty. Continue shopping" |
| Vacío: recomendaciones | sin caso en la tienda | Por código: `hidden` si `products_count == 0` (`product-recommendations.liquid:20`) |
| Uno solo | F01 (1 variante) | Sin selector, h1 en 3 líneas, hs 0 |
| Muchos: paginación | `/collections/all` (32 visibles) | 24 + 8, "1 2 Next" / "Previous 1 2" |
| Muchos: variantes | F04 (15), F11 (7 colores) | 8 y 7 controles, hs 0 |
| Muy largo: título y vendor | F10: 142 caracteres; vendor de 56 | hs 0 en los 4 temas a 360. **Título de 13 líneas a 1280: el precio empieza en y=910 y el botón en y=1209, bajo el pliegue de 800 (AF-09)**. En tarjeta de 154 px (Archive 360), 8 líneas frente a 1-2 del resto (AF-15) |
| Faltante: sin imagen | `product-card.liquid:145` y `main-product.liquid:104` pintan un marcador | `qa-02-no-image` es borrador y no se ve en la tienda: comprobado solo por código |
| Faltante: sin descripción | `qa-15-no-description` es borrador | Sin comprobar en vivo |
| Faltante: imagen secundaria | `product-card.liquid:136` exige `secondary_image != blank` | Correcto por código |

La tienda no tiene fixtures para 10+ medios, 40+ variantes ni 200 productos. La ficha con más medios tiene 4 y el producto con más variantes activo tiene 15.

### 2.5 Track 5: Superficie del comerciante y localización

Salida de `npm run gates:static` (exit 0) en una copia del repo en b19d5d6:
- Theme Check: 150 archivos sin ofensas.
- JSON: 0 fallos.
- Hooks: OK.
- Sanity: 3 de 3 clases detectadas.
- Ledger: 0 incoherencias.
- Paquete: `Sartorial-1.0.0.zip` con 103 archivos, 0 `.scss` y solo carpetas de tema.

| Compuerta | Resultado |
| :--- | :--- |
| Etiquetas con `t:` | 100 %. Solo `unit` lleva literales (`px`, `%`, `vh`, `s`), igual que Dawn |
| Claves sin resolver | 0 en storefront y 0 en schema |
| Claves huérfanas | 0 en storefront, **61 en schema** (AF-11) |
| Jerga ("popover", "bento", "intent", etc.) | 0 en `en.default.schema.json`. Un `info` menciona "JavaScript" (`sections.main_faq.settings.show_search.info`), aceptable |
| Sentence case | 1 posible caso, que en realidad es una URL ("HTTPS") |
| `info` en ajustes con dependencia externa | Presente en filtros, mercados, inventario y notas de carrito. Sin `info`: `footer.show_newsletter` (depende de Shopify Email/marketing), opcional |

### 2.6 Preservación de Sartorial y de los presets

- **Presets.** Los de `config/settings_data.json` (Sartorial, Edition y Archive) son idénticos a los que tiene desplegados Sartorial #166186909939. Coinciden fuentes, escala, ancho, espaciado, radio y los 5 esquemas de color.
- **Sartorial:**
  - Titulares en `libre_baskerville_n4` y cuerpo en `assistant_n4`.
  - `heading_scale` 105, `page_width` 1300, `section_spacing` 72, `button_radius` 0.
  - scheme-1 `#F7F3EA` / `#1D1B18`.
- **En vivo (Sartorial 1280):**
  - Fondo `rgb(247, 243, 234)`, texto `rgb(29, 27, 24)`.
  - Titular del hero en Libre Baskerville a 75.6 px; h2 en Libre Baskerville de 48 a 59 px; cuerpo en Assistant.
  - `--font-heading-scale` 1.05, `--page-width` 1300px, `--section-spacing` 72px, radio 0.
  - Eyebrow en mayúsculas con 1.44 px de tracking.
- **Cambios desde AUDIT-PRESETS-001 (af6ee6d).** `git diff --ignore-cr-at-eol af6ee6d HEAD -- config listings` da un solo cambio: `listings/sartorial/templates/index.json:14-15`, que pasa de `gradient_bottom` 40 a `gradient_content` 60 (b3a867d, propuesta H-1 del 6B). Es el que llevó el hero a 5.49-6.62:1. Las 141 líneas nuevas de `base.css` son componentes nuevos (píldoras y moneda) con tokens existentes. No cambia ningún token, fuente ni escala.
- **Pendiente de entorno (AF-06).** En la vista previa, la colección de los 3 presets no muestra su listing (en Sartorial falta el mosaico editorial y las 2 columnas). El paquete sí lo lleva.

---

## 3. Matriz de los 4 temas

| Tema | Ancho | axe (H/C/F) | CLS proxy máx. | Scroll horiz. | Hero peor contraste | Teclado | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Couture | 1280 | 0/0/0 | 0 | 0 | ≥6.08 (6B) | 5 de 5 OK | tema publicado |
| Couture | 375 | 0/0/0 | 0 | 0 | ≥6.08 (6B) | | |
| Couture | 360 | 0/0/0 | 0 | 0 | | | 13 rutas degeneradas sin desborde |
| Sartorial | 1280 | 0/0/0 | 0 | 0 | 6.12 | | identidad intacta (§2.6) |
| Sartorial | 375 | 0/0/0 | 0.0003 | 0 | 5.49 | | |
| Sartorial | 360 | 0/0/0 | 0 | 0 | | | |
| Edition | 1280 | 0/0/0 | 0 | 0 | fondo liso | | AF-10 (sizes del split) |
| Edition | 375 | 0/0/0 | 0.0003 | 0 | fondo liso | | |
| Edition | 360 | 0/0/0 | 0.0003 | 0 | fondo liso | | F10: h1 9 líneas, hs 0 |
| Archive | 1280 | 0/0/0 | 0.0001 | 0 | **4.02** | | **AF-01** |
| Archive | 375 | 0/0/0 | 0.0008 | 0 | **4.35** | | **AF-01** |
| Archive | 360 | 0/0/0 | 0.0006 | 0 | **4.35** | | AF-15 (tarjeta de 8 líneas) |

Couture no tiene preset propio: usa la configuración actual de la tienda. Los 4 temas comparten el mismo código (§5.1). Por eso las pruebas de teclado se hicieron solo en Couture: el comportamiento no depende del preset.

---

## 4. Hallazgos con parche (sin aplicar)

Severidad:
- **P1:** corregir antes de subir.
- **P2:** corregir antes de subir si es posible, o en 1.0.1.
- **P3:** mejora.
- **P4:** informativo.

### AF-01 · P1 · WCAG 1.4.3 · Hero de Archive por debajo de 4.5:1

- **Dónde:** `listings/archive/templates/index.json:14-15` (`"overlay_style": "scrim"`, `"overlay_opacity": 55`).
- **Impacto:** el subtítulo de 16 px mide 4.02:1 en el peor píxel a 1280 (p95 4.12, mediana 4.87) y 4.35:1 a 375 y 360. Es el preset que ve el revisor al instalar Archive.
- **Parche:**

```diff
-        "overlay_opacity": 55,
+        "overlay_opacity": 60,
```

- **Verificación:** simulado en la tienda, deja 4.85 a 1280 y 5.22 a 375. El titular y el eyebrow también suben. Es un cambio visual (velo un 5 % más oscuro): lo decide Johandry. Hay que desplegarlo al tema Archive y volver a medir con `__heroScrim()`.

### AF-02 · P1 · Seguridad · Enlace de archivo subido con esquema sin validar (parche de 02194ee insuficiente)

- **Dónde:** `sections/cart-drawer.liquid:184` y `sections/main-cart-items.liquid:73` en HEAD 02194ee.
- **Impacto:** en una propiedad de línea, `javascript:alert(1)//https://cdn.shopify.com/uploads/x` contiene `/uploads/` y `https://`, así que el parche actual lo pinta como `<a href="javascript:...">`. Hace falta que un atacante meta la propiedad (el propio comprador, o un CSRF a `/cart/add`) y un clic. Además, `HTTPS://` en mayúsculas deja de enlazarse.
- **Parche** (en los dos archivos):

```liquid
{%- assign property_scheme = property.last | slice: 0, 8 | downcase -%}
{%- if property.last contains '/uploads/' and property_scheme == 'https://' -%}
```

- **Verificación** (`harness-AUDIT-FINAL-001/liquid/upload-test.mjs`):

```text
https://cdn.shopify.com/s/files/1/0/uploads/foto.png    | HEAD 02194ee: LINK   | propuesta: LINK
javascript:alert(1)//https://cdn.shopify.com/uploads/x  | HEAD 02194ee: LINK   | propuesta: TEXTO
JavaScript:alert(1)//https://x/uploads/                 | HEAD 02194ee: LINK   | propuesta: TEXTO
HTTPS://cdn.shopify.com/uploads/a.png                   | HEAD 02194ee: TEXTO  | propuesta: LINK
data:text/html,<b>x</b>//https://x/uploads/             | HEAD 02194ee: LINK   | propuesta: TEXTO
```

### AF-03 · P2 · Funcional · Los términos de búsqueda con `&`, `"`, `'`, `<` o `>` se corrompen al cambiar de pestaña o al pulsar "Clear all"

- **Dónde:** `sections/main-search.liquid:20` (`assign encoded_terms = search.terms | url_encode`). Lo usan las líneas 24-28: las 4 pestañas (Todo, Productos, Artículos, Páginas) y `clear_search_url`, que va a la píldora "Clear all" de `facets-active-filters.liquid:64`.
- **Impacto:** Shopify entrega `search.terms` ya escapado en HTML. Comprobado en vivo:

```text
"Tom & Jerry" -> pestaña /search?q=Tom+%26amp%3B+Jerry  -> la página busca "Tom &amp; Jerry"
'12" frame'   -> /search?q=12%26quot%3B+frame           -> busca '12&quot; frame'
"O'Neil"      -> /search?q=O%26%2339%3BNeil             -> busca "O&#39;Neil"
```

  Cada clic lo empeora.
- **Parche:**

```liquid
  assign plain_terms = search.terms | replace: '&quot;', '"' | replace: '&#39;', "'" | replace: '&lt;', '<' | replace: '&gt;', '>' | replace: '&amp;', '&'
  assign encoded_terms = plain_terms | url_encode
```

- **Verificación** (liquidjs, `liquid/patch-test.mjs`): los 6 casos vuelven al término original, incluido el literal "a &amp; b". La salida sigue pasando por `| escape` en el `href`.

### AF-04 · Cerrado en el repo, sin desplegar · `cart.note` sin escape

- **Dónde:** `sections/cart-drawer.liquid:457` y `sections/main-cart-items.liquid:176`.
- **Estado:** 02194ee ya añade `| escape`, y es correcto.
- **Pendiente:** los 4 temas remotos siguen con la versión anterior (checksums `d23974b…` y `ba77b82…` a las 07:05 UTC, §5.2). Es latente porque `show_cart_note` está en `false` en los 4.

### AF-05 · P2 · Trazabilidad del ledger · Filas 35 y 72 en `cumplido` sin la prueba que exigen

- **Dónde:** `docs/requirements-ledger.md:35` y `:72`.
- **Impacto:** las dos filas citan CLAUDE-REPORT-6B-001 como evidencia, pero ese informe dictaminó que ninguna de las dos era apta, porque la tienda no tenía:
  - para la fila 35, ninguna imagen con punto focal fuera del centro;
  - para la fila 72, ni vídeo, ni enlace de YouTube, ni modelo 3D.

  Hoy sigue igual: Admin API devuelve solo medios `IMAGE` en los 32 productos activos. RULES §2.5 dice que el código no cierra una fila que exige prueba en tienda.
- **Propuesta:** dos opciones.
  - Volver las dos filas a `código completo` hasta tener fixtures.
  - O que Johandry fije un punto focal fuera del centro en `hero-campaign-01.jpg` y suba a un producto un vídeo, un enlace de YouTube y un `.glb`. Con eso las mido en 20 minutos con las sondas de 6B.

### AF-06 · P2 · Entorno · Los 3 presets desplegados usan el `collection.json` de la raíz

- **Dónde:** `templates/collection.json` en Sartorial, Edition y Archive tiene el checksum `d56657ce…` (el de la raíz) desde 2026-09-23 23:28 UTC. El repo tiene en cada listing una versión propia:
  - Sartorial: mosaico editorial en la posición 4, 2 columnas e imagen de colección.
  - Edition: 32 por página, 4 columnas y sin imagen secundaria.
  - Archive: mosaico, 2 columnas y vendor.
- **Impacto:** lo que se ve en vista previa no es lo que instala el paquete. También afecta a la tienda demo del listing.
- **Parche** (despliegue, sin tocar código):

```text
shopify theme push --theme 166186909939 --only templates/collection.json --path <copia con listings/sartorial/templates/collection.json en templates/>
(igual con 166186942707 y listings/edition, y con 166187041011 y listings/archive)
```

### AF-07 · P3 · Datos sensibles · Stock exacto expuesto en todas las fichas

- **Dónde:** `sections/main-product.liquid:704` y `sections/featured-product.liquid:463` emiten `"inventory_quantity"` en el JSON de variantes aunque la sección no tenga bloque de inventario.
- **Impacto:** cualquiera ve las unidades exactas en el código fuente. Shopify quitó ese campo de `/products/*.js` por lo mismo.
- **Parche:** limitarlo al umbral del bloque, antes del `<script type="application/json" data-variant-json>`:

```liquid
{%- liquid
  assign inventory_cap = 1
  for block in section.blocks
    if block.type == 'inventory_status'
      assign inventory_cap = block.settings.threshold | plus: 1
    endif
  endfor
-%}
...
"inventory_quantity": {{ variant.inventory_quantity | at_most: inventory_cap | json }},
```

- **Verificación** (`liquid/inventory-test.mjs`): con umbral 5, "57 unidades" pasa a 6 (sigue `inStock`), 3 sigue en 3 (`lowStock(3)`) y -2 sigue en -2 (preventa). `ProductInventory.update()` (`theme.js:1018-1031`) da el mismo estado en todos los casos.

### AF-08 · P2 (riesgo, sin verificar) · WCAG 2.4.11 · La barra fija de compra puede tapar el foco

- **Dónde:** `assets/base.css:1508-1527` (`.sticky-cart-bar`, fija abajo, 65 px a 375) y `assets/theme.js:1241-1246` (`setVisible`). La cabecera tiene `scroll-padding-block-start: var(--header-offset)` (`base.css:7754`); la barra de abajo no tiene nada equivalente.
- **Impacto:** si el siguiente elemento enfocable está en los últimos 65 px de la ventana, el navegador no desplaza la página (lo considera visible) y la barra lo tapa entero. Casos: tarjetas relacionadas, botones de compra rápida, muestras de color, enlaces del pie.
- **Por qué no se pudo probar:** con el panel oculto, `focus()` no desplaza nada (control en §0.2).
- **Parche:**

```js
// theme.js, StickyCartBar.setVisible(visible)
document.documentElement.style.setProperty('--sticky-cart-offset', visible ? `${this.offsetHeight}px` : '0px');
```
```css
/* base.css, junto a la regla de :7753 */
html { scroll-padding-block-end: var(--sticky-cart-offset, 0px); }
```

- **Verificación pendiente:** con el navegador visible y teclado físico en `/products/qa5a-f04-colour-size` a 375, tabular desde "Add to cart" hasta el pie. Ningún foco debe quedar debajo de la barra.

### AF-09 · P3 · Estado degenerado · Un título muy largo deja el botón de compra bajo el pliegue en escritorio

- **Dónde:** `assets/base.css:1274-1277` (`max-width: 18ch`) y `:3950-3952` (`3rem * 1.05` = 50.4 px desde 62rem). El h1 está en `sections/main-product.liquid:201`.
- **Impacto:** con F10 (142 caracteres) a 1280x800 el título ocupa 13 líneas y 688 px. El precio empieza en y=910 y el botón en y=1209. No hay desborde; es un problema de uso.
- **Parche:**

```liquid
<h1 class="product-main__title{% if product.title.size > 60 %} product-main__title--long{% endif %}">
```
```css
.product-main__title--long { max-width: 28ch; font-size: calc(1.75rem * var(--font-heading-scale)); }
@media (min-width: 62rem) { .product-main__title--long { font-size: calc(2.1rem * var(--font-heading-scale)); } }
```

### AF-10 · P3 · Rendimiento · `sizes` del hero ignora el modo split

- **Dónde:** `sections/hero-editorial.liquid:76` y `:113` (`100vw` en todos los modos). El grid split usa unos 60/65/50 % del ancho desde 62rem (`base.css:3687-3718`).
- **Parche** (tras la línea 4):

```liquid
  assign hero_sizes = '100vw'
  if layout_mode == 'split'
    case section.settings.split_ratio
      when '65_35'
        assign hero_sizes = '(min-width: 62rem) 65vw, 100vw'
      when '50_50'
        assign hero_sizes = '(min-width: 62rem) 50vw, 100vw'
      else
        assign hero_sizes = '(min-width: 62rem) 60vw, 100vw'
    endcase
  endif
```

  Y usar `sizes: hero_sizes` en las líneas 76 y 113.

### AF-11 · P3 · Superficie · 61 claves de schema sin uso

- **Dónde:** `locales/en.default.schema.json`. Salen de ajustes que ya no existen: `settings_schema.layout.settings.corner_style.*`, `grid_density.*`, `product_cards.*`, `typography.settings.heading_letter_spacing.*`, `eyebrow_style.*`, las opciones de `hero_editorial.settings.height_*` y otras (lista completa en `gates-static.log`, sección "HUERFANAS EN SCHEMA").
- **Parche:** borrarlas y volver a pasar `gates:locales`, que debe dar 0 huérfanas en schema.

### AF-12 · P3 · Entorno · `layout/password.liquid` sobrante en los 4 temas

- **Dónde:** los 4 temas remotos tienen `layout/password.liquid` (48 bytes: `{{ content_for_header }}{{ content_for_layout }}`) con el checksum `072edb66…`. No está en el repo ni en el paquete.
- **Impacto:** si la tienda lo usa, la página de contraseña sale sin `<head>` ni estilos. No afecta a la subida.
- **Parche:** borrarlo desde el editor de código de cada tema (lo decide Johandry).

### AF-13 · P4 · CSP · Manejadores en línea

- **Dónde:** `layout/theme.liquid:33` y `sections/featured-product.liquid:505` (`onload="this.media='all'"`, el patrón de Dawn), y `templates/gift_card.liquid:114` (`onclick="window.print()"`).
- **Impacto:** solo importa con una CSP sin `'unsafe-inline'`, que Shopify no aplica.
- **Parche opcional para la tarjeta regalo:** `data-print` y un listener en el `<script>` de la línea 130.

### AF-14 · P4 · Endurecimiento · `renderUrl` sin comprobar el origen

- **Dónde:** `assets/theme.js:2868-2869` y `:2904` (`window.location.assign(navigationUrl)` si falla la petición).
- **Parche:**

```js
if (navigationUrl.origin !== window.location.origin) return;
```

  Las fuentes actuales (acción del formulario, `url_to_remove` y `location`) son de confianza. Es defensa en profundidad.

### AF-15 · P4 · Visual · Títulos de tarjeta sin límite de líneas

- **Dónde:** `assets/base.css:1834` (`.product-card__title`).
- **Impacto:** F10 ocupa 8 líneas en una tarjeta de 154 px a 360 y descuadra la fila.
- **Opcional:** `display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;`. El título completo sigue en la ficha y en el nombre accesible del enlace.

### AF-16 · P4 · best-practice · Skip link fuera de un landmark

- **Dónde:** `layout/theme.liquid:110`.
- **Impacto:** axe lo marca como `region` (moderate). No es criterio WCAG. Se deja como está.

---

## 5. Integridad

### 5.1 Solo lectura

1. Al empezar (06:25:59 UTC) guardé el sha256 de los 89 archivos de `assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates` y `listings`.
2. Al terminar (07:04:05 UTC), 87 eran idénticos. Cambiaron 2: `sections/cart-drawer.liquid` y `sections/main-cart-items.liquid`.
3. Ese cambio lo hizo el commit 02194ee ("fix(security): escape cart.note and enforce https on line-item upload links", 06:55:47 UTC, autor Noobprobro-web). Salió del flujo paralelo de `.agents/teamwork`, no de mí. `git diff --ignore-cr-at-eol HEAD` sobre las carpetas del tema da 0 líneas: el árbol de trabajo no tiene cambios propios.
4. Lo único que escribí fue este informe y `agent-comms/outbox-claude/harness-AUDIT-FINAL-001/`. Los archivos temporales quedaron fuera del repo.
5. En la tienda solo hice GET de páginas y consultas de solo lectura por Admin GraphQL. No hubo carrito, formularios, subidas, cambios de ajustes ni despliegues.

### 5.2 Repositorio frente a tienda

**Checksums MD5 por Admin API al empezar:**

| Resultado | Detalle |
| :--- | :--- |
| Coinciden | 78 de los 79 archivos comunes, idénticos en los 4 temas y en el repo (con o sin CRLF). Incluye todo lo de 6B y la moneda |
| Solo en remoto | `layout/password.liquid` (AF-12) |
| Distintos por tema | `config/settings_data.json` (datos del comerciante) y `templates/index.json`. Sartorial, Edition y Archive coinciden con su listing. Couture difiere del repo por ediciones del editor, lo normal en el tema publicado |
| `templates/collection.json` | Igual a la raíz en los 3 presets (AF-06) |

**A las 07:05 UTC**, después de b4b9b7e:
- Los 4 temas siguen con `sections/cart-drawer.liquid` `d23974b75c42777c1d2876d34e37af86` y `sections/main-cart-items.liquid` `ba77b820c0b23c38f96250984fe2f915`, que son las versiones anteriores a 02194ee.
- La última actualización de Couture, Edition y Archive es de las 03:20 UTC; la de Sartorial, de las 05:56 UTC.
- Por eso la línea del BOARD "paquete `Sartorial-1.0.0.zip` regenerado y sincronizado a los 4 temas remotos" no se corresponde con la tienda.

### 5.3 Comparación con la auditoría paralela (`.agents/teamwork/orchestrator_1/AUDIT_REPORT.md`)

- **Coincidencias.** Las dos auditorías detectaron el riesgo de `cart.note` y el de los enlaces de archivo.
- **Discrepancia.** Su corrección del enlace (`contains 'https://'`) se puede saltar (AF-02).
- **No verificable aquí.** Sus tiempos de LCP (512-1856 ms) con el panel oculto.
- **No detectado por ellos.** No señalan el contraste de Archive (AF-01) ni la corrupción de términos de búsqueda (AF-03).

---

## 6. Verificación

| Comando o sonda | Resultado | Qué demuestra / qué no |
| :--- | :--- | :--- |
| `npm run gates:static` en copia de b19d5d6 | exit 0 · 150 archivos sin ofensas · locales 0/0 sin resolver, 0 huérfanas storefront, 61 schema · ledger 0 incoherencias · paquete 103 archivos | Compuertas estáticas en verde. No cubre 02194ee, aunque es un cambio de 4 líneas sin claves nuevas |
| Admin GraphQL `theme.files` en los 4 temas, 2 veces | §5.2 | Qué hay desplegado. No demuestra el render |
| `security-probes.js` | 6/6 sin inyección cruda; términos corrompidos en 4 casos | Escape correcto de entradas reflejadas; AF-03 en vivo |
| `cwv-proxy.js`, 36 cargas + 6 repeticiones | CLS~ ≤ 0.0008; LCP eager/high en 36/36 | Estabilidad de diseño y prioridad del LCP. No da tiempos reales |
| `axe-degenerate-probes.js` (axe), 36 pasadas | 0 violaciones | Reglas automáticas WCAG 2.2 AA. No sustituye revisión manual |
| Pruebas de teclado (eventos despachados) | 5/5 componentes OK | Lógica de foco, atrapado y Escape. No es teclado físico |
| `__heroPixels2` / `__heroScrim` / `__heroEl` | Tabla de §2.3 | Contraste sobre foto en el peor píxel. Modela el velo con los valores computados |
| `liquid/*.mjs` (liquidjs 10) | 3 parches probados | Lógica de los parches. No es el render de Shopify |
| sha256 de 89 archivos al empezar y al terminar | 87 iguales, 2 cambiados por 02194ee | Que yo no modifiqué nada |

Salidas literales: `harness-AUDIT-FINAL-001/results-cwv-axe.txt`, `results-degenerate-keyboard-contrast.txt` y `gates-static.log`.

---

## 7. Afirmaciones falsables

1. Con `overlay_opacity` 55, el subtítulo del hero de Archive mide menos de 4.5:1 en su peor píxel a 1280 (4.02) y a 375 (4.35).
2. Con 60, el mismo subtítulo pasa de 4.5:1 a 1280 (4.85) y a 375 (5.22).
3. Con el HEAD actual, una propiedad de línea `javascript:alert(1)//https://cdn.shopify.com/uploads/x` se pinta como enlace en el cajón y en `/cart`.
4. Buscar "Tom & Jerry" y pulsar la pestaña "All" o "Products" lleva a una búsqueda de "Tom &amp; Jerry".
5. Ninguno de los 4 temas remotos tiene 02194ee a las 07:05 UTC del 2026-09-25.
6. Sartorial, Edition y Archive sirven `templates/collection.json` con MD5 `d56657ce70c77eebe4b0072ecb46b2ce`, distinto del de su listing.
7. axe-core 4.10.2 da 0 violaciones WCAG 2.2 AA en Home, Colección y Ficha de los 4 temas a 1280, 375 y 360.
8. En esas 36 cargas no hay imágenes sin `width`/`height` ni imágenes `lazy` en la primera pantalla. El candidato a LCP tiene `fetchpriority="high"`.
9. `shopify-xr.js` no se carga en ninguna de las 36 páginas.
10. Los presets de `config/settings_data.json` son idénticos a los desplegados en Sartorial #166186909939.
11. Desde af6ee6d, lo único que cambió en `config/` y `listings/` es el velo del hero de Sartorial.
12. `locales/en.default.schema.json` tiene 61 claves que ningún archivo referencia.
13. La ficha de F10 a 1280x800 en Sartorial pone el botón de compra en y=1209.
14. Ningún archivo de producción cambió por mi parte entre las 06:25:59 y las 07:04:05 UTC.

---

## 8. Veredicto final para la Theme Store

**APTO CON OBSERVACIONES.**

- **Seguridad:** sin vulnerabilidades críticas. AF-02 es de severidad media y se cierra con una línea.
- **CLS:** muy por debajo de 0.1 en todas las combinaciones medidas.
- **LCP:** bien priorizado.
- **axe:** 0 violaciones.
- **Teclado:** correcto en los 5 componentes.
- **Paquete:** limpio.
- **Sartorial:** intacto.

Orden para cerrar:
1. Aplicar AF-01 (decisión de Johandry) y el parche de AF-02.
2. Volver a pasar `npm run gates:static`.
3. Desplegar a los 4 temas: 02194ee, AF-01, AF-02 y los `collection.json` de AF-06.
4. Hacer una pasada con el navegador visible para:
   - LCP e INP reales;
   - AF-08 con teclado físico;
   - repetir `__heroScrim()` en Archive.
5. Corregir las filas 35 y 72 del ledger (AF-05).
6. Opcional antes de subir: AF-03, AF-07, AF-09, AF-10 y AF-11.

Con los pasos 1 a 3 hechos y sin regresiones, el dictamen pasa a **APTO**.
