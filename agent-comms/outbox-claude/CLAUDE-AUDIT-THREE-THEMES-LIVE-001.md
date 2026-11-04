# CLAUDE-AUDIT-THREE-THEMES-LIVE-001

Anexo de evidencia en tienda de la auditoría de Claude sobre Sartorial y Atelier de Sebas (Contour). Johandry lo pidió como anexo separado: CLAUDE-AUDIT-THREE-THEMES-INITIAL-001 y CLAUDE-AUDIT-THREE-THEMES-MASTER-001 no se modifican. Los IDs TT-NN y G-NN, y la escala de prioridades, son los de MASTER-001.

## 0. Encabezado

| Campo | Valor |
|---|---|
| ID | CLAUDE-AUDIT-THREE-THEMES-LIVE-001 |
| Fecha | 2026-10-28 |
| Estado | Versión final tras la revisión independiente R3. La entrega de este anexo la hace el coordinador. |
| Referencias | MASTER-001 (sha256 `bb30a9717d7f5686209c4d6e03a7a25ab8f7e97e4456ab32fa6063b76549739e`) para los TT, las compuertas G1 a G4 y la escala. MASTER-001 ya está entregado en agent-comms/outbox-claude del equipo de Johandry, por device_bash, con ese sha256 verificado en el dispositivo |
| Insumos | scratchpad/live/L1-sartorial-visual.md, L2-atelier-visual.md, L3-sartorial-visual-rerun.md. Informes del lado del dispositivo, en la VM Linux del equipo de Johandry: `$HOME/livetest/out` (tema publicado) y `$HOME/livetest/out-submission` (tema de envío) |
| Modelos por tarea | opus: auditorías visuales L1, L2 y L3, y redacción. sonnet: Lighthouse, axe y teclado en vivo sobre main y submission, normalización de identidad de assets, y entrega por partes de MASTER-001. haiku: sondeos, creación del archivo de entorno y preparación de archivos. fable (esfuerzo high): revisión independiente R3. |
| Revisión independiente R3 | fable high (scratchpad/audit/R3-revision-fable-live.md). Veredicto: requiere cambios menores. Aplicados los 11 cambios requeridos y las mejoras opcionales O1 a O8. El borrador se conserva sin cambios en CLAUDE-AUDIT-THREE-THEMES-LIVE-001.draft.md |
| Alcance | Tiendas tema-qkqpke0j, sartorial-atelier y sartorial-edition (Sartorial); contour-ho5kbo9x, annex-r0zzjfjf y maison-10oym9w0 (Atelier de Sebas, Contour 4.1.0). Cucuyo fuera de alcance |

### 0.1 Tipos de evidencia de este anexo

| Etiqueta | Tipo | Qué incluye |
|---|---|---|
| TR | Tienda real | Observación en el Chrome real del usuario con Claude in Chrome sobre las tiendas publicadas o en preview (L1, L2, L3): DOM, estilos computados, capturas, consola |
| TR-SIN | Sintético en tienda | Herramientas automáticas contra la tienda real desde la VM del equipo: Lighthouse 13.6.0, axe-core 4.14.0, recorridos de teclado en Chrome 156 sin interfaz a 390 y 1280 px, y comparación normalizada de assets servidos |
| EMU | Emulado | Móvil emulado con un iframe `srcdoc` de 390x664 que carga el HTML real de la tienda (ancho útil 375 px). No es un dispositivo |
| EST | Estático | Referencias a código del ZIP o del repo, ya en MASTER-001 |

Todo lo que dice "observado en tienda" es TR salvo que se indique otra etiqueta. Nada de este anexo es una certificación WCAG ni una garantía de aprobación de Shopify.

### 0.2 Notas de proceso (transparencia)

- En L1 la ventana de Chrome estaba minimizada y `resize_window` no tenía efecto: L1 solo vio las tiendas a 767 px. L2 y L3 trabajaron con la ventana maximizada a **1536x674 CSS px, DPR 1.25**, no a 1440. Ninguna captura es a 1440 exactos.
- El móvil de L2 y L3 es EMU. En Sartorial, `about:srcdoc` hace fallar `new URL()` en la búsqueda predictiva y en el clic del carrito ("Invalid base URL"): es un **artefacto del emulado**, no un defecto del tema. En desktop real ambas funciones van bien.
- Las mediciones de Lighthouse, axe y teclado sí se hicieron a anchos reales (390 y 1280) en Chrome sin interfaz.
- L1 cambió de forma temporal la cookie de preview de tema-qkqpke0j al tema publicado y la restauró al terminar. L3 dejó la preview como estaba, así que **lo que L3 vio en tema-qkqpke0j es el tema de envío**. L2 cambió de forma local el rail colapsado y la vista lista de Atelier y los revirtió; también escribió "a/b" en el campo de email del footer de Maison para probar el atajo "/" (lo borró el JS, no se envió). L3 abrió el drawer de carrito móvil con `cartDrawer.open()` dentro del emulado para ver su layout.
- No se hicieron compras, no se enviaron formularios y no se cambió ningún ajuste.
- Lighthouse y axe no se ejecutaron sobre las demos de Atelier ni sobre sartorial-atelier y sartorial-edition: el Chrome sin interfaz no tenía contraseñas de storefront. Esas tiendas solo tienen evidencia visual de Chrome.
- Seguridad: en esta fase no se imprimió ninguna contraseña (búsqueda en las salidas sin coincidencias). Los dos incidentes anteriores ya están declarados en MASTER-001 §10.

---

## 1. Identidad de temas y tiendas

### 1.1 Mapa de tiendas

| Tienda | Tema mostrado | ID | role | Preset visible | Fuente |
|---|---|---|---|---|---|
| tema-qkqpke0j | "Sartorial v1.0.0 integrado" | 189832593651 | main (publicado), theme_store_id null | Sartorial | TR (L1 con `?preview_theme_id`), TR-SIN |
| tema-qkqpke0j (cookie de preview) | "Sartorial 09f8342 submission" | 189707452659 | unpublished | Sartorial | TR (L3), TR-SIN |
| sartorial-atelier | "Sartorial" | 188743188704 | main | Sartorial | TR (L1, L3) |
| sartorial-edition | "Edition" (schema Sartorial 1.0.0) | 188655599784 | main | Sartorial, con contenido técnico y de piel | TR (L1, L3) |
| contour-ho5kbo9x | "contour/main" (Contour 4.1.0) | 159799967844 | main, theme_store_id null | Contour | TR (L2) |
| annex-r0zzjfjf | "atelier/annex" (Contour 4.1.0) | 192380338468 | main, theme_store_id null | Annex | TR (L2) |
| maison-10oym9w0 | "atelier/maison" (Contour 4.1.0) | 189395697969 | main, theme_store_id null | Maison | TR (L2) |

**Un solo preset de Sartorial está desplegado.** Las tres tiendas de Sartorial tienen las mismas 76 custom properties computadas en `:root` (hash idéntico; las 165 de §1.2 son el total declarado en toda la hoja base.css), `data-motion-style=atelier`, Libre Baskerville y Assistant, fondo #faf8f5 y radio de botón 0. sartorial-edition cambia contenido y orden de secciones, pero no es el preset Imprint (`motion_style` sigue en `atelier`, no `technical`). **Imprint y Archive no están desplegados en ninguna tienda** y no se pudieron evaluar en vivo.

Los tres presets de Atelier están desplegados, cada uno en su demo, y se confirman por paleta, fuentes, estilo de botón y nombre del tema.

La home de tema-qkqpke0j y de sartorial-atelier muestra la composición de la **plantilla raíz** (hero-editorial, marquee, lookbook, curated-showcase, brand-manifesto, complete-the-look, bento-discovery, newsletter), no la del listing Sartorial (que lleva featured-product y no lleva bento-discovery). Comprobado contra templates/index.json y listings/sartorial/templates/index.json del ZIP. Ver TT-13 en §5.

### 1.2 Identidad del tema publicado frente al ZIP (TR-SIN)

| Asset | Tamaño servido / ZIP | Resultado tras normalizar con esbuild y lightningcss, mismos ajustes |
|---|---|---|
| base.css | 173.912 / 259.143 B (minificado por Shopify) | Equivalente: 13 operaciones sobre unos 39.700 tokens, todas ruido del minificador (prefijos -webkit, translate frente a translateX, paradas implícitas de gradiente); mismos 1.546 bloques y 165 custom properties |
| theme.js | 149.111 / 248.554 B | Equivalente: los 1.405 literales de cadena son idénticos; la diferencia residual es de renombrado de variables |
| product-zoom.js | 9.642 / 13.488 B | Equivalente: 8 operaciones, todas renombrados |

Marcadores HTML de Sartorial presentes: 48 de 84 clases y 49 de 77 atributos data. Los que faltan incluyen el paginador de galería, probablemente condicional; no se comprobó.

Conclusión: el tema publicado 189832593651 es **equivalente al ZIP auditado** en sus tres assets, pero **no idéntico byte a byte** (Shopify los sirve minificados). Esto actualiza G-05 de MASTER-001, que era "no verificable por Claude", a parcialmente confirmado. Alcance: la evidencia de GPT en G-05 era MD5 por la API de Admin sobre archivos sin minificar (84 rutas); la de Claude es el CDN minificado en 3 assets. "No idéntico byte a byte" no confirma ni contradice el MD5 de GPT, y la cobertura de Claude es 3 de 84 rutas.

### 1.3 Tema de envío frente al ZIP (TR-SIN)

El tema "Sartorial 09f8342 submission" **no tiene** tres cambios locales sin commit que sí están en el ZIP y en el tema publicado. Son exactamente las diferencias entre submission y main:

| Archivo | Cambio presente en ZIP y main, ausente en submission |
|---|---|
| base.css | Regla `.site-footer__newsletter .newsletter-form__field input::placeholder { color: inherit; opacity: 1 }` |
| theme.js | Gestión de foco de la galería de producto (`items` como slides, `currentIndex = -1`, `pagerHasFocus`, `focusedStep`) |
| product-zoom.js | Manejo de `pointerup` en el pellizco con un dedo |

Lectura: es coherente con que el ZIP sea el HEAD 09f8342 del checkout codex más esos tres cambios locales sin commit. Es una inferencia por los nombres y las diferencias; el HEAD del checkout sigue sin verificar por Claude. Johandry indica que el tema de envío es, en teoría, el que se mandaría a Shopify. Ver §6.

---

## 2. Lighthouse frente a la compuerta G2

### 2.1 Método

Lighthouse 13.6.0, Chrome 156 sin interfaz, una sola máquina y una sola red, `?pb=0` (sin barra de preview), 3 ejecuciones por página y mediana. Páginas: home, PDP y /collections/all. Tipo: TR-SIN. **No es el método de Shopify**, que usa su propio conjunto de datos de referencia ("Tests are run using a benchmark dataset").

### 2.2 Resultados

**Tema publicado (main, 189832593651), preset Sartorial**

| Página | Móvil: rendimiento / LCP ms / CLS / TBT ms | Escritorio: rendimiento / LCP ms / CLS / TBT ms |
|---|---|---|
| Home | 77 / 1329 / 0 / 975 | 100 / 448 / 0,035 / 17 |
| PDP | 73 / 2392 / 0 / 981 | 96 / 728 / 0,011 / 134 |
| /collections/all | 74 / 2054 / 0 / 1200 | 99 / 748 / 0,002 / 31 |
| Promedio estilo Shopify | Rendimiento 74,7 · Accesibilidad 100 | Rendimiento 98,3 · Accesibilidad 100 |

Rango por ejecución en móvil: rendimiento de 61 a 81.

**Tema de envío (189707452659, sin publicar, vía `?preview_theme_id`), preset Sartorial**

| Página | Móvil: rendimiento (ejecuciones) / LCP ms / TBT ms | Escritorio: rendimiento |
|---|---|---|
| Home | 78 (77, 80, 78) / 1323 / 923 | 99 |
| PDP | 80 / 1870 / 768 | 99 |
| /collections/all | 84 / 1875 / 592 | 99 |
| Promedio | Rendimiento 80,7 · Accesibilidad 100 | Rendimiento 99 · Accesibilidad 100 |

Las diferencias entre main y submission se atribuyen a variación del entorno: los tres cambios de §1.3 no tocan la carga, y no hay base para decir que el tema de envío sea más rápido.

### 2.3 Estado de G2

| Umbral (requirements §6) | Main | Submission | Estado |
|---|---|---|---|
| Rendimiento promedio 60 o más | Móvil 74,7, escritorio 98,3 | Móvil 80,7, escritorio 99 | Superado en esta medición, solo para el preset Sartorial |
| Accesibilidad promedio 90 o más | 100 y 100 | 100 y 100 | Superado en esta medición, solo para el preset Sartorial |

**G2 queda parcialmente cumplida**: el preset Sartorial supera los dos umbrales en main y en submission con nuestro método. Imprint y Archive no se midieron (no están desplegados) y las demos de Atelier tampoco. Riesgos que siguen abiertos: el peor resultado móvil por ejecución fue 61, muy cerca del umbral; el TBT móvil está entre 592 y 1200 ms, coherente con el JS global de TT-12; y el método de Shopify puede dar cifras distintas.

---

## 3. axe y teclado

### 3.1 axe (TR-SIN)

axe-core 4.14.0 con las etiquetas wcag2a, wcag2aa, wcag21a, wcag21aa y wcag22aa, a 390 y 1280 px, en home, PDP y colección, más el drawer de carrito abierto y vacío y el menú móvil abierto. Main y submission dan las mismas violaciones; los resultados de revisión manual (incomplete) difieren en número de nodos.

| Resultado | Detalle |
|---|---|
| Violación (un solo tipo en todas las páginas) | `label-content-name-mismatch` (impacto serious, WCAG 2.5.3): los botones de idioma muestran "ES" pero su `aria-label` es "Update preferences: Español". En `#LocalizationForm-footer` a 390 px y también en el header a 1280 px. Ver LV-01 |
| Drawer de carrito abierto | Sin violaciones detectadas por axe |
| Menú móvil abierto | El informe del dispositivo reporta un único tipo de violación en todos los estados auditados (la de LV-01) y no desglosa el menú móvil por separado; no se registra ninguna otra violación para ese estado |
| Revisión manual pendiente (incomplete) | `color-contrast` en el hero (8 a 9 nodos en main; 15 a 1280 en submission), texto sobre imagen o placeholder que axe no puede decidir; `aria-valid-attr-value` en product-card-variants de la colección |

Lighthouse accesibilidad 100 y una violación de axe no se contradicen: Lighthouse usa un subconjunto de reglas de axe; no se comprobó si incluye esta. **No es una certificación**: axe detecta una parte de los problemas y no hubo tecnología asistiva.

### 3.2 Teclado (TR-SIN; main y submission idénticos)

| Prueba | Resultado |
|---|---|
| Skip link | El primer Tab lo enfoca y lleva a `#MainContent` |
| Drawer de carrito, menú móvil, mega menú | Atrapan el foco; Escape cierra y devuelve el foco al disparador |
| Anillo de foco (preset Sartorial) | 2 px CSS sólido, offset 3 px (base.css:100 `--focus-width: 2px`, :283-285 `outline-offset: 3px`), contraste 15,5 a 15,7:1 |
| G-20 / TT-104 | **Reproducido en tienda** en main y en submission: con el menú abierto a 390 px y la ventana llevada a 1280 px quedan `overflow: hidden`, main y header con `inert` y el foco en BODY; el Tab no alcanza nada hasta pulsar Escape |

Medición en Chrome real (L1 y L2, DPR 1,25): las dos hojas declaran el mismo anillo, 2 px CSS con offset 3 px (Sartorial base.css:100 y :283-285; Atelier base.css:209-211 `outline: 2px solid var(--color-text); outline-offset: 3px`). En el Chrome real los dos se midieron como 1,6 px con offset 2,4 px. Hipótesis, no comprobada: redondeo a píxel de dispositivo (2 × 1,25 = 2,5, que queda en 2 px de dispositivo, es decir 1,6 CSS; 3 × 1,25 = 3,75, que queda en 3, es decir 2,4 CSS). L1 midió contrastes de 13,95 a 15,65:1 en el footer, la newsletter de la home y el header de Sartorial; coinciden con los del Chrome sin interfaz.

Atelier (L2, TR y EMU, sin herramienta automática): skip link a `#main-content` correcto; anillo de foco de 2 px CSS con offset 3 px (medido 1,6 y 2,4 px en el Chrome real, igual que Sartorial) en #2c1810 sobre #faf7f2, 15,78:1 en Contour; el modal de Notify me es un `<dialog>` que atrapa el foco y lo devuelve al cerrar; el panel móvil atrapa el Tab pero al pulsar Escape **el foco cae en BODY** (LV-09).

---

## 4. Evaluación visual por tienda y preset

Escala compartida por L2 y L3 (cualitativa, sin números): Muy alto, Alto, Medio, Medio-bajo. Desktop a 1536 px, móvil EMU. No se dan notas numéricas.

### 4.1 Sartorial

| Tienda | Diseño | Móvil (EMU) | Qué es contenido y qué es tema |
|---|---|---|---|
| A tema-qkqpke0j (L1 vio main; L3 vio submission; sin diferencias registradas por L1 y L3, aunque los tres cambios de §1.3 no se compararon de forma específica) | **Medio** | **Medio** | Contenido: hero y 3 a 4 secciones con placeholders SVG, productos QA públicos (F01 a F11), PDP del vestido en español y sin tallas. Tema: sistema tipográfico sólido (Libre Baskerville grande, eyebrows, mucho aire), curated showcase bueno, marquee con botón de pausa, doble newsletter por defecto, hero desalineado, salto de 15 px al bloquear el scroll |
| C sartorial-atelier | **Medio** (algo mejor que A) | **Medio** | Contenido: placeholders en 5 secciones incluido el hero; sin QA, con tallas, todo en inglés, filas alineadas |
| B sartorial-edition | **Medio** | **Medio** | Contenido: la mejor fotografía del lote (piel y latón), card promo en la grilla, 4 placeholders. Tema: el dato mal mapeado "Material composition: Desk Objects", que es el product_type mostrado como material (TT-03) |

En móvil Sartorial hace bien lo básico: header sticky con logo visible, targets de 44x44, sticky ATC que espera a que el ATC principal salga de la vista, menú `role=dialog` con `aria-modal` y foco que vuelve a la hamburguesa, sin desbordamiento horizontal. Le restan las cajas placeholder de casi una pantalla, la grilla de colección debajo del pliegue (primera card en y=735 con un viewport de 664) y el menú de 3 enlaces por defecto. CLS medido en desktop entre 0,000 y 0,023. Consola sin errores en las tres tiendas fuera del emulado.

### 4.2 Atelier de Sebas

| Preset | Diseño | Móvil (EMU) | Qué es contenido y qué es tema |
|---|---|---|---|
| Contour (muebles y hogar) | **Alto** | **Medio-bajo** | Tema: sidebar editorial y tabla comparativa fuertes; reveal de tarjetas que deja columnas vacías cerca de 1 s, contadores de sección casi invisibles, doble newsletter por defecto, pill "Recently viewed" que tapa controles. Contenido: texto de fábrica en el "About" del footer. Móvil: sin logo arriba, header flotante, filtros abiertos encima de la grilla, botones de cantidad de 40x42, sticky ATC desde la carga |
| Annex (arte y láminas) | **Muy alto**, el más cercano a "lujo" | **Medio** | Tema: H1 del PDP partido a mitad de palabra; announcement bar marrón heredada de Contour. Móvil: galería horizontal bien resuelta como slider; mismos problemas de header y filtros |
| Maison (cerámica) | **Alto** en su vertical, medio para moda | **Medio** | Contenido: fotos de producto inconsistentes y una card en blanco en "Pairs well with" (causa no determinada). Móvil: tabs con scroll horizontal correcto; mismos problemas de header y filtros |

Los tres presets comparten header, drawer, search palette, footer y el esqueleto de la PDP; las homes son distintas de verdad, con fotografía real en casi todas las secciones. Consola sin errores. CLS de 0 en home y colección de Contour.

### 4.3 Comparación lado a lado

| Aspecto | Sartorial (un preset desplegado) | Atelier (tres presets desplegados) |
|---|---|---|
| Diseño desktop | Medio en las tres tiendas | Alto, Muy alto y Alto |
| Causa principal | Contenido de demo: placeholders, QA públicos, idioma. La arquitectura visual no es la causa: con fotografía real subiría, según L3, a Alto | Pulido del tema (reveal, H1 partido, announcement) más que contenido |
| Diferenciación entre presets visible en tienda | No evaluable: solo hay un preset desplegado | Alta en la home; header, tarjeta y esqueleto de PDP iguales |
| Móvil | Medio: logo visible, header sticky, targets de 44, sticky ATC correcto, foco que vuelve | Medio-bajo a Medio: sin logo arriba, filtros abiertos, cantidad de 40 px, sticky ATC prematuro, foco perdido al cerrar el panel |
| PDP | Zoom, sticky ATC correcto, recomendaciones con foto real | Sin zoom (TT-24), trust row, complementarios, sticky ATC |
| Carrito vacío | Sin recomendaciones | Sin recomendaciones |

En desktop Atelier está claramente por delante; en móvil la relación se invierte y Sartorial es igual o mejor. La comparación de diseño de Sartorial está muy condicionada por el contenido de demo y por tener un solo preset en vivo.

---

## 5. Estado de los hallazgos tras la evidencia en tienda

### 5.1 Hallazgos de MASTER-001 tocados en vivo

| ID | Estado en MASTER-001 | Estado nuevo | Evidencia en tienda |
|---|---|---|---|
| G-05 | No verificable por Claude | **Parcialmente confirmado por Claude**: equivalente tras normalización, no idéntico byte a byte; cobertura de 3 de 84 rutas, sobre el CDN minificado; no confirma ni contradice el MD5 por API de Admin de GPT | §1.2 (TR-SIN) |
| G1 (compuerta) | No verificado | **Preset Sartorial:** existen tiendas con el preset (tema-qkqpke0j, sartorial-atelier, sartorial-edition); no se sabe si son client transfer stores ni si comparten contraseña. **Imprint y Archive:** no hay ninguna tienda con esos presets entre las revisadas. G1 sigue sin cumplirse para esos dos | §1.1 (TR) |
| G2 (compuerta) | No medido | **Parcialmente cumplida** para el preset Sartorial en main y submission | §2 (TR-SIN) |
| G-20 / TT-104 (P2) | Confirmado en código y en Chromium con fixture | **Confirmado en tienda** en main y submission | §3.2 (TR-SIN) |
| TT-02 (P1) | Confirmado (EST, SIN, SIM) para Imprint y Archive | **No reproducible en el preset Sartorial**, como se esperaba: contraste del anillo 13,95 a 15,7:1. Para Imprint y Archive sigue siendo estático y simulado porque no están desplegados | §3.2 (TR, TR-SIN) |
| TT-03 (P1) | Confirmado en código | **Confirmado en tienda en el caso condicional que preveía MASTER-001 para el preset Sartorial** ("si se añade el bloque"): sartorial-edition usa el preset Sartorial con el bloque añadido. `leather-desk-mat` y `folded-valet-tray` muestran "Technical specifications → Material composition: Desk Objects": no es una cadena inventada, sino el product_type mostrado como material, un dato mal mapeado. La evidencia en tienda **añade** una rama que MASTER-001 no citaba (`elsif product.type != blank`, product-technical-specs.liquid:55-56; MASTER-001 citaba :47-49, :53-54, :69-70 y :80-84). En `milled-brass-paperweight` sale "Solid milled brass / Precision machined", que ahí es cierto por casualidad. A y C no muestran specs | L1, L3 (TR) |
| TT-13 (P2) | Confirmado en código; efecto no verificado | **Confirmado que las demos muestran la raíz**: tema-qkqpke0j y sartorial-atelier muestran la home de la plantilla raíz, no la del listing Sartorial. El efecto en la instalación sigue sin verificar: si la instalación desde la Theme Store usa el listing, la demo no reflejaría la instalación | §1.1 (TR, EST) |
| TT-100 (P1) | Confirmado en fixture (caso C) | Sin cambio: no se pudo reproducir en tienda. sartorial-atelier no tiene `selling_plan_groups` en sus 24 productos; el QA F06 de tema-qkqpke0j exige plan pero no muestra ninguna UI de planes (ver LV-04) | L1 (TR) |
| TT-106 (P3) | Confirmado en arnés | Relacionado en tienda: F06 muestra "THIS PURCHASE OPTION IS UNAVAILABLE" en el botón junto a "In stock, ready to ship" (LV-04). Es la misma familia de mensajes de estado (los dos nacen de `isPurchaseOptionValid` gobernando los mensajes), pero no se funden: LV-04 añade la contradicción con "In stock" y la cantidad activa, que TT-106 no describe | L1, L3 (TR) |
| TT-12 (P2) | Tamaños confirmados; tiempos sin medir | **Medido**: no impide superar G2 en el preset Sartorial, pero el TBT móvil de 592 a 1200 ms y el peor resultado de 61 lo mantienen como riesgo | §2 (TR-SIN) |
| TT-18 (P2) | Afirmaciones sin medición | **Parcialmente respaldadas** en el preset Sartorial (Lighthouse accesibilidad 100, una violación de axe); "WCAG 2.2 AA" sigue sin poder afirmarse y Imprint y Archive no se midieron | §2, §3 |
| TT-04 (P2) | Docs con "Edition" | Se suma que la tienda sartorial-edition y su tema "Edition" conservan el nombre antiguo del preset (LV-27) | §1.1 (TR) |
| TT-06 (P2) | Confirmado en código | No evaluable en vivo: TT-06 trata de header y tarjeta iguales entre presets, y solo hay un preset de Sartorial desplegado (igual que TT-17). Las tres tiendas muestran el mismo header y la misma tarjeta, lo que es esperable con un solo preset | L1, L3 (TR) |
| TT-17 (P2) | Confirmado en código | No evaluable en vivo: Imprint y Archive no están desplegados | §1.1 |
| TT-19 (P2) | Hipótesis | Sin cambio: `<shopify-account>` se renderiza y se ve un anillo de foco interno, pero no se comprobó el menú | L1 (TR) |
| TT-21 (P2) | Confirmado en código | **Confirmado en tienda**: 0 `[name=selling_plan]` y ninguna UI de suscripción en las tres demos | L2 (TR) |
| TT-23 (P2) | Confirmado en código | **Confirmado en tienda**: `input[name=quantity]` con min=1 en las tres demos | L2 (TR) |
| TT-24 (P2) | Confirmado en código | **Confirmado en tienda**: clic en la imagen principal sin efecto, 0 elementos de zoom o lightbox en las tres demos | L2 (TR) |
| TT-25 (P2) | Confirmado en código | Parcial en tienda: la barra no se renderiza con el carrito vacío (no verificable sin añadir productos); el umbral de 150 aparece además como texto fijo del contenido de demo (LV-30) | L2 (TR) |
| TT-26 (P2) | Confirmado en código | **Confirmado en emulado**: en móvil `details.collection__facets` llega abierto y la primera card empieza en 1057, 920 y 1056 px. El código ya declaraba el `details` abierto por defecto (INITIAL-001, TT-26), así que lo que queda es verificar en un teléfono, no si existe | L2 (EMU) |
| TT-28 (P2) | Confirmado en dirección | **Latente, no observado**: la regla de hover existe (3,33:1 calculado), pero en el estilo outlined de Contour la pisa otra regla y los hovers medidos dan 15,78:1; no se vio ningún `.btn--primary` en Contour | L2 (TR) |
| TT-29 (P2) | Confirmado en código | **Confirmado en tienda**: borde del campo de Notify me 1,26:1 en Contour (#e5ddd0 sobre #faf7f2) y 1,28:1 en Annex | L2 (TR) |
| TT-32 (P2) | Medido 40x42 en fixture | **Confirmado en tienda (EMU)**: botones de cantidad de 40x42 en móvil, frente a 44x44 en Sartorial | L2, L3 (EMU) |
| TT-78 (P3) | Confirmado en código | **Confirmado en emulado**: el panel móvil es el mismo `header-component` con `role=banner`, sin `role=dialog`, sin `aria-modal` y sin `inert`. Se añade LV-09 por el foco al cerrar | L2 (EMU) |
| TT-79 (P3) | Confirmado en código | **Riesgo no observado**: "/" no interfiere al escribir en campos. Se añade LV-18 por la pérdida de caracteres | L2 (TR) |
| TT-30 (P2) | Confirmado en código (Atelier) | Sin cambio en Atelier. En Sartorial el marquee tiene botón de pausa, como decía INITIAL-001 §7 (sections/marquee.liquid:17, :53-56; theme.js:4285-4286, según R3). TT-30 es solo de Atelier | L3 (TR) |

No se tocaron en vivo: TT-05, TT-07, TT-08, TT-09, TT-31, TT-101, TT-102, TT-103, TT-107 y el resto. Hacen falta compras, envío de formularios o comparación visual que esta fase no hizo.

### 5.2 Hallazgos nuevos en tienda (LV-NN)

Escala de MASTER-001 §9.1. Los defectos del tema se separan del contenido de la demo. Criterio para el contenido de demo: prioridad según lo que vería un revisor de Shopify en la demo (compuerta G1). P1 para lo que hace que la demo parezca sin terminar o falsa en la primera vista; P2 para lo que se nota al recorrerla; P3 para el resto.

**Resultado: 0 P0. Defectos del tema: 0 P1, 6 P2, 16 P3. Contenido de demo: 2 P1, 4 P2, 2 P3. Total 30.**

**Aviso de cobertura.** Por tema, los defectos quedan 5 en Sartorial frente a 15 en Atelier (más 2 compartidos). Esa diferencia no significa que Atelier tenga tres veces más defectos: en parte es de método. L1 solo vio Sartorial a 767 px. Sartorial tiene un solo preset en vivo frente a tres homes completas de Atelier. Y L2 sondeó más interacciones (Flip, "/", Notify me) porque MASTER-001 tenía más hallazgos de Atelier por verificar en tienda. Los recuentos no son comparables como medida de calidad.

#### Defectos del tema: Sartorial

| ID | Prioridad | Presets o tiendas | Hallazgo | Evidencia | Tipo | Estado | Recomendación |
|---|---|---|---|---|---|---|---|
| LV-01 | P2 | Preset Sartorial, main y submission | Botones de idioma con texto visible "ES" y `aria-label` "Update preferences: Español" (WCAG 2.5.3, Label in Name; axe serious). Un usuario de control por voz que diga "ES" no lo activa | axe en footer (390) y header (1280) | TR-SIN | Confirmado | Que el nombre accesible empiece por el texto visible (por ejemplo "ES, Update preferences: Español") |
| LV-02 | P3 | A y C, home a 1536 | El texto del hero empieza en x=32 y el resto de la página en x=110 (contenedor de 1300); desalineado respecto del header | L3 | TR | Observado; no se sabe si es intencional | Alinear con el contenedor o documentar el modo |
| LV-03 | P3 | A a 1536 (L3) y las tres tiendas a 767 (L1); en un teléfono no aplica | Al abrir el drawer o el menú, `overflow: hidden` quita la scrollbar y el contenido se corre 15 px (el logo centrado se mueve 8 px); `scrollbar-gutter: auto` sin compensación. En un teléfono no aplica | L1, L3 | TR | Confirmado | `scrollbar-gutter: stable` o compensación de padding |
| LV-04 | P3 | A, producto QA F06 con plan obligatorio | Mensajes contradictorios: "In stock, ready to ship" junto al botón deshabilitado "THIS PURCHASE OPTION IS UNAVAILABLE", el texto de que requiere un plan y un selector de cantidad activo; no se muestra ninguna UI de planes. Relacionado con TT-106 | L1, L3 | TR | Confirmado; el producto QA puede estar mal configurado (plan obligatorio sin grupos) | Si no hay planes disponibles, un único estado coherente y la cantidad deshabilitada |
| LV-05 | P3 | A, colección (desktop y móvil) | La fila de swatches va encima del título, así que cuando unos productos tienen swatches y otros no, o los títulos tienen largos distintos, los títulos no comparten línea base (50 px de diferencia) | L1, L3 | TR, EMU | Confirmado; visible con los productos QA | Reservar la altura de la fila de swatches o ponerla debajo del título |

#### Defectos del tema: Atelier

| ID | Prioridad | Presets | Hallazgo | Evidencia | Tipo | Estado | Recomendación |
|---|---|---|---|---|---|---|---|
| LV-06 | P2 | Annex, PDP desktop | H1 "CASCADE - PHOTOGRAPH" partido a mitad de palabra ("PHOTOGRA / PH"): mayúsculas con letter-spacing de 4,15 px y 51,84 px en una columna de 407 px con `overflow-wrap: break-word`. En el emulado móvil no ocurre | L2 | TR | Confirmado a 1536 | Escala tipográfica o `overflow-wrap: normal` con `hyphens` en el H1 |
| LV-07 | P2 | Contour (los otros presets no observados) | El reveal de tarjetas desde una línea vertical deja columnas vacías cerca de 1 s a velocidad normal de scroll ("New this season" y "From the same collection"); se lee como contenido que no cargó | L2 | TR | Confirmado en Contour | Revelar antes o no ocultar lo que ya está en el viewport |
| LV-08 | P2 | Los tres, móvil | Sin logo visible arriba: `.header__logo` fuera de pantalla (left -347, `visibility: hidden`) hasta abrir el panel; el header son 3 cajas flotantes (menú, cuenta, carrito) que tapan imágenes, badges y el título del PDP. Respaldo en código (según R3): en sections/header.liquid:927-1048, con `max-width: 768px` el logo vive dentro de `.sidebar__panel` con `translateX(-100%)` y `visibility: hidden` y solo quedan los toggles fijos; es una decisión de diseño, no un artefacto del srcdoc | L2, EST | EMU | Observado en emulado y respaldado en código; confirmar la percepción en un teléfono | Mostrar la marca en el header móvil |
| LV-09 | P2 | Los tres, móvil | Al cerrar el panel de menú con Escape, el foco cae en BODY en lugar de volver al botón hamburguesa (WCAG 2.4.3). Causa distinta de TT-78. Respaldo en código (según R3): la ruta de Escape (atelier-main/assets/theme.js:471) llama a `closeAll()` (:516-523), que llama a `Atelier.removeTrapFocus()` sin elemento, mientras la ruta del botón (`setState`, :503) sí pasa `this.menuToggle` | L2, EST | EMU | Observado en emulado y confirmado en código | Devolver el foco al disparador al cerrar |
| LV-10 | P2 | Los tres | La search palette muestra precios sin símbolo de moneda ("55.00") | L2 | TR | Confirmado | Formatear con el formato de moneda de la tienda |
| LV-11 | P3 | Observado en una tienda de Atelier (la de la clave `atelier-collection-view`); no comprobado en las otras | Transición Flip de grid a lista: durante cerca de 1 s la paginación y el overlay "Choose options" se montan sobre las cards y la página salta hacia arriba; la vista lista final deja "Choose options" huérfano y mucho vacío | L2 | TR | Confirmado | Revisar el estado intermedio y el layout de lista |
| LV-12 | P3 | Los tres | El botón back-to-top oscuro desaparece sobre secciones oscuras (newsletter de Annex, proceso de Maison) | L2 | TR | Confirmado | Contraste adaptado al fondo |
| LV-13 | P3 | Annex y Maison | La announcement bar usa #2c1810 (el marrón de Contour) con texto #faf7f2; en Annex rompe la paleta negra y blanca | L2 | TR | Confirmado | Asignar a la barra un esquema propio en cada preset |
| LV-14 | P3 | Atelier, móvil (descrito en general por L2; no desglosado por tienda) | Sticky ATC visible desde la carga, tapando contenido mientras el CTA principal sigue en pantalla (Sartorial, en cambio, espera a que salga de la vista, según L3) | L2 | EMU | Observado en emulado | Mostrarlo solo al pasar el CTA principal |
| LV-15 | P3 | Atelier, colección (L2 no indica en qué tienda; no comprobado en las tres) | Breadcrumb duplicado: "HOME · PRODUCTS · PRODUCTS" | L2 | TR | Confirmado | Evitar repetir el título |
| LV-16 | P3 | Contour y Maison (estilo outlined) | Jerarquía de CTA invertida: "Add to cart" con borde y "Buy it now" relleno y más pesado | L2 | TR | Confirmado | Revisar la jerarquía en el estilo outlined |
| LV-17 | P3 | Contour | La pill flotante "Recently viewed" tapa el selector de moneda del footer y el botón "Shop collection" en algunas posiciones | L2 | TR | Confirmado | Reubicar o apartar de controles |
| LV-18 | P3 | Annex (observado) | Si se escribe justo después de pulsar "/", los caracteres se pierden ("tide" no llegó al input) | L2 | TR | Observado una vez | Enfocar el input antes de capturar teclas |
| LV-19 | P3 | Contour | El badge SALE se estira al ancho de "ONLY 2 LEFT" cuando van apilados | L2 | TR | Confirmado | Ancho propio por badge |
| LV-20 | P3 | Contour | Contadores de sección ("002", "005") casi invisibles arriba a la derecha | L2 | TR | Observado; contraste no medido | Medir y ajustar el contraste o retirarlos |

#### Defectos del tema: ambos

| ID | Prioridad | Alcance | Hallazgo | Evidencia | Tipo | Estado | Recomendación |
|---|---|---|---|---|---|---|---|
| LV-21 | P3 | Sartorial (A, B, C) y Contour | Dos newsletters seguidas por defecto: la sección de la home y la columna del footer, con el mismo copy en A y C ("Notes from the atelier" y "Notes from the studio"); en B la primera es la mostaza "Engineering telemetry & field updates" | L1, L2, L3 | TR | Confirmado | Quitar una de la composición por defecto |
| LV-22 | P3 | Sartorial (A, B, C) y las tres demos de Atelier | Drawer de carrito vacío (y /cart en Atelier) sin recomendaciones ni colecciones sugeridas | L1, L2, L3 | TR | Confirmado | Ofrecer colecciones o productos en el estado vacío |

#### Contenido de demo (no son defectos del código)

| ID | Prioridad (para G1) | Tienda | Hallazgo | Evidencia | Tipo | Estado |
|---|---|---|---|---|---|---|
| LV-23 | P1 | A, B y C | Placeholders SVG en el hero y en 4 o 5 secciones de la home (lookbook, brand manifesto, complete the look, bento); en A, "Complete the look" muestra una caja gris vacía. Los placeholders de objetos EDC no encajan con una tienda de moda. En móvil ocupan casi una pantalla cada uno | L1, L3 | TR, EMU | Confirmado |
| LV-24 | P1 | A | Productos QA públicos en /collections/all (F01 a F11, 32 productos; por ejemplo "F06 Subscription Only Care Kit") | L1, L3 | TR | Confirmado |
| LV-25 | P2 | A | PDP de bias-cut-slip-dress con la descripción en español ("Seda cortada al sesgo…") con UI y `lang` en inglés, y sin selector de talla (en C el mismo producto tiene tallas 34 a 40, texto en inglés y otro precio) | L1, L3 | TR | Confirmado |
| LV-26 | P2 | A, B y C | Menú con solo 3 enlaces por defecto (Home, Catalog, Contact): navegación pobre para una demo premium | L1, L3 | TR | Confirmado |
| LV-27 | P2 | sartorial-edition, sartorial-atelier | Tiendas y temas con nombres de presets antiguos ("Edition", "Atelier"), que no corresponden a los presets del ZIP (Sartorial, Imprint, Archive); se suma a TT-04 y al riesgo de confusión de MASTER-001 §1 | L1 | TR | Confirmado |
| LV-28 | P2 | Contour | El bloque "About" del footer conserva el texto de fábrica ("Share your store's story, shipping, returns, or contact details here.") | L2 | TR | Confirmado |
| LV-29 | P3 | Maison | Fotos de producto inconsistentes (recortes en blanco puro junto a lifestyle sobre rojo) y una card en blanco total en "Pairs well with" (causa no determinada: puede ser contenido o tema) | L2 | TR | Observado |
| LV-30 | P3 | Demos de Atelier (L2 no atribuye el texto a una tienda concreta) | El umbral de 150 aparece como texto fijo en la announcement, el hero, la PDP y la trust row ("Complimentary shipping on orders over $150"), además del ajuste de TT-25 | L2 | TR | Confirmado |

Observaciones que **no** se registran como defecto del tema: la barra de preview de Shopify tapa el sticky ATC (no la ve un cliente); la insignia de hCaptcha se superpone al back-to-top en el PDP de Contour (es de Shopify); los resultados poco relevantes de la palette al buscar "vase" (dependen de la búsqueda de Shopify y del catálogo); los errores "Invalid base URL" del emulado (artefacto).

---

## 6. Preparación del envío: qué build mandar

| Hecho | Evidencia |
|---|---|
| El tema publicado (main) es equivalente al ZIP auditado en sus tres assets | §1.2 |
| El tema de envío "Sartorial 09f8342 submission" **no tiene** tres cambios que sí están en el ZIP y en main: la regla del placeholder de la newsletter del footer, la gestión de foco de la galería de producto y el manejo del pellizco con un dedo en el zoom | §1.3 |
| Johandry indica que, en teoría, el tema de envío es el que se manda a Shopify | Nota del coordinador |
| Lighthouse, axe y teclado dan resultados equivalentes en los dos | §2, §3 |

Lectura: si se envía el tema de envío tal como está, se envía sin esas tres correcciones, que tocan accesibilidad (foco en la galería), visual (placeholder del footer) y táctil (zoom). Sobre el placeholder (hipótesis, no medida): sin la regla de base.css:7035-7038, el placeholder del campo de la newsletter del footer oscuro usa el gris por defecto del navegador, con un contraste probablemente bajo en el tema de envío. L1 y L3 no compararon de forma específica los tres cambios entre main y submission. Si se envía un build que las incluya, conviene repetir Lighthouse, axe y teclado sobre ese build antes de enviarlo.

**Recomendación:** decidir de forma explícita qué build se envía. Una opción es consolidar los tres cambios en el control de versiones y regenerar el tema de envío; otra, enviar el build que ya los tiene. **La decisión es de Johandry.** Esta recomendación no autoriza ninguna implementación ni ningún cambio en las tiendas. Recordatorio: el envío sigue condicionado por las compuertas G1 (demos de Imprint y Archive), G2 (parcialmente cumplida: medida solo para el preset Sartorial; Imprint y Archive sin medir), G3 (material del listing, documentación y soporte) y G4 (notas de versión), además de los P1 de MASTER-001 §13.

---

## 7. Actualización de la matriz

El estado oficial numérico sigue en **NE** en todas las celdas: la evidencia en tienda de esta fase es cualitativa (visual) o cubre solo el preset Sartorial (Lighthouse, axe, teclado). Lo que cambia es que varias celdas ya tienen evidencia en tienda.

| Tema · preset | Diseño | Compra | Móvil y accesibilidad | Configuración | Rendimiento |
|---|---|---|---|---|---|
| Sartorial · Sartorial | NE. En tienda: **Medio** en las tres tiendas, condicionado por el contenido de demo (TR) | NE. Sin evidencia en tienda nueva (no hubo compras) | NE. En tienda: móvil **Medio** (EMU); Lighthouse accesibilidad 100; axe con un tipo de violación (LV-01); teclado correcto salvo G-20 (TR-SIN) | NE. Sin evidencia en tienda (no se abrió el editor) | NE. En tienda: Lighthouse móvil 74,7 y escritorio 98,3 en main, 80,7 y 99 en submission (TR-SIN) |
| Sartorial · Imprint | NE. Sin evidencia en tienda (no desplegado) | NE | NE. Sin evidencia en tienda | NE | NE. Sin medir |
| Sartorial · Archive | NE. Sin evidencia en tienda (no desplegado) | NE | NE. Sin evidencia en tienda | NE | NE. Sin medir |
| Atelier · Contour | NE. En tienda: **Alto** (TR) | NE | NE. En tienda: móvil **Medio-bajo** (EMU); sin axe ni Lighthouse | NE | NE. Sin medir |
| Atelier · Annex | NE. En tienda: **Muy alto** (TR) | NE | NE. En tienda: móvil **Medio** (EMU) | NE | NE. Sin medir |
| Atelier · Maison | NE. En tienda: **Alto** (TR) | NE | NE. En tienda: móvil **Medio** (EMU) | NE | NE. Sin medir |

Las lecturas estáticas provisionales de MASTER-001 §6 (Compra y Configuración) no cambian con este anexo. **Sigue sin haber total**: ninguna categoría tiene evidencia en tienda completa para todos los presets, y Diseño y Móvil son cualitativos.

---

## 8. No evaluado

| Elemento | Motivo |
|---|---|
| Presets Imprint y Archive en vivo (TT-02, TT-17, diferencias entre presets de Sartorial) | No están desplegados en ninguna tienda revisada |
| Lighthouse y axe en las demos de Atelier y en sartorial-atelier y sartorial-edition | El Chrome sin interfaz no tenía contraseñas de storefront |
| Compras y formularios: TT-07, TT-100, TT-101, TT-102, TT-103, TT-107, barra de envío gratis de TT-25 | No se añadió nada al carrito ni se envió ningún formulario, por decisión de método |
| Editor de Shopify (TT-15, TT-19 completo, configuración) | No se abrió |
| Dispositivos reales | El móvil fue emulado (EMU) o sin interfaz a 390 px; LV-08, LV-09, LV-14 y TT-26 deben confirmarse en un teléfono |
| Desktop a 1440 exactos | Solo se vio a 1536 (y a 767 en L1) |
| Búsqueda predictiva móvil de Sartorial | Artefacto del emulado |
| Tecnología asistiva (NVDA, VoiceOver) | No se usó; axe no la sustituye |
| Método de Shopify para Lighthouse | Se usó una sola máquina y red; Shopify usa su conjunto de datos de referencia |
| Si las tiendas son client transfer stores y comparten contraseña (G1) | No visible desde el storefront |
| TT-05, TT-08, TT-09, TT-31 | No dependen de la tienda o requieren otra comparación |
| Cucuyo | Fuera de alcance de este anexo |

Notas obligatorias: este anexo no modifica INITIAL-001 ni MASTER-001; las recomendaciones no autorizan implementación; las siete definiciones de metafields propuestas para Sartorial siguen sin aprobar; no se copia ni se propone copiar código de Atelier ni de Cucuyo; ninguna conclusión garantiza la aprobación de Shopify.
