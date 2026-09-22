# CLAUDE-AUDIT-OPUS-001: Auditoría técnica del repositorio, deuda consolidada y diseño de Sprint 5B

```text
ID: CLAUDE-AUDIT-OPUS-001 (responde a CLAUDE-DIRECTIVE-OPUS-AUDIT-001)
Estado: ENTREGADO. Solo diagnóstico: ningún archivo del tema cambió, ningún parche aplicado, sin
        commit ni push. Me detengo aquí hasta la directiva unificada de Gemini (con GPT-AUDIT-005).
Base auditada: master 3429015 (HEAD actual d0dfc3f solo toca AGENTS.md, BOARD.md y esta
        directiva; el código del tema es el mismo). Copia en la nube verificada byte a byte contra la carpeta de
        Johandry (82 archivos rastreados, MD5 sin CRLF, 0 diferencias). Los archivos de código del
        tema publicado (Couture #165809488115) tienen el mismo MD5 que HEAD (§8.1).
Decisión requerida (Gemini y Johandry):
  1. Autorizar la ola 1 (§7): 5 defectos P1 de corrección y cumplimiento de Theme Store, todos con
     cambio pequeño y localizado. Tres son de Nivel 2 porque tocan un default o un schema.
  2. Elegir la solución del nombre cortado en móvil (H-05): mis 4 ajustes de CSS sin quitar nada, o
     además llevar la cuenta al menú lateral.
  3. Aprobar la arquitectura de Sprint 5B (§6): visor de zoom en <dialog> con pellizco y arrastre,
     sin lupa flotante por defecto. Johandry: las fotos demo de 928 px de ancho no admiten zoom
     (§6.7).
  4. Autorizar en la tienda una colección de QA para 5B, activando los borradores qa-03, qa-04 y
     qa-18 y añadiendo un vídeo y un modelo 3D (§6.8).
Resumen en 5 líneas:
  1. La arquitectura está sana: 25 Web Components sobre ThemeElement con AbortController, todos los diálogos con trampa de foco, Escape y restauración, 0 innerHTML con datos no fiables, 0 `include`, 0 clases CSS muertas y el 90 % del espaciado en tokens.
  2. P1 (corrección y cumplimiento): 40 traducciones con interpolación pasan dos veces por el escape (7 son texto visible; comprobado en vivo que `t` ya escapa); el ajuste "Logo width" no hace nada; `secondary_menu` no tiene el default que exige la Theme Store; el cajón promete "Atelier Gift" de serie; y "LINEA NOVE" se corta a 390 px en la tienda (faltan 5 px).
  3. P2 (rendimiento y UX): el JSON de variantes por tarjeta pesa unos 200 B por variante más 500 a 900 B por foto; la PDP en rejilla descarga imágenes de 1,7 a 2 veces el ancho necesario; los filtros están duplicados (148 de 150 líneas iguales); la colección vacía dice "sin coincidencias"; ningún fetch tiene timeout.
  4. P3 (deuda): 6 copias de la lógica de inert, 22 bloques CSS redefinidos por capas de sprint, dos escalas de espaciado paralelas y citas del ledger que apuntan a otras clases de theme.js.
  5. 5B: el tema no tiene zoom. Propongo un visor modal nativo (dialog + Pointer Events, alta resolución solo al abrir, zoom máximo limitado por la resolución real de la foto), un asset aparte cargado solo en la PDP y 12 criterios de aceptación.
Archivos tocados: solo este informe (nuevo). Ningún archivo del tema.
Desviaciones (Nivel 1 o Nivel 2): ninguna. Los parches se describen en §2 y §7, sin prepararlos
                                  como archivo, para respetar el freno de mano.
Hallazgos extra fuera de alcance (con parche listo): no aplica en una auditoría de solo lectura;
                                  cada hallazgo trae su propuesta y su nivel.
Verificación (comando, resultado y qué demuestra/qué no): §8.
Lista de afirmaciones falsables numeradas: §9.
```

---

## 1. Estado del código y la arquitectura

| Área | Medida | Veredicto |
|---|---|---|
| Web Components | 25 `customElements.define`, 25 con guarda `customElements.get` | Sano |
| Listeners | `ThemeElement.listen` con `AbortController` (`assets/theme.js:137-160`); todos los `disconnectedCallback` llaman a `super`. Fuera de componentes, solo 6 listeners globales de módulo, instalados una vez | Sano |
| Timers y observers | 4 `setTimeout`, todos con su `clearTimeout`; los `MutationObserver`, `IntersectionObserver` y `ResizeObserver` de componente se desconectan | Sano |
| Peticiones | `AbortController` en carrito, filtros, recomendaciones, pickup, búsqueda y complete-the-look; ninguna con timeout (H-11) | Casi sano |
| HTML inyectado | `innerHTML` solo con HTML de Section Rendering del propio tema (`assets/theme.js:1410,1511,2621`); los errores del servidor van por `textContent` | Sano |
| Foco y diálogos | 8 superficies con `trapFocus`, Escape y devolución del foco; 5A usa `<dialog>` nativo | Sano; lógica de inert copiada 6 veces (H-14) |
| Liquid | 0 `include`, 0 filtros de imagen obsoletos, `structured_data` nativo en la PDP | Sano; duplicación y payload (H-06, H-08) |
| CSS | 760 clases, 0 sin referencia (20 son modificadores dinámicos); 37 `!important`, todos justificados ([hidden], visually-hidden, no-js, reduced motion, botón de pago); breakpoints coherentes (48 y 62rem, más un 75rem) | Sano; capas de parche (H-17) |
| Peso | `theme.js` 171 KB (37 KB gzip), `base.css` 184 KB (34 KB gzip). Unos 20 y 22 KB de cada uno son comentarios, y Shopify minifica al servir | Aceptable |
| Gates estáticos | Theme Check 0 ofensas, `node --check` OK, inventario 0 sin resolver, 0 huérfanas en storefront (61 en schema, preexistentes), ledger 53 filas y 0 incoherencias, literales 0 | Verde |

---

## 2. Inventario de hallazgos

Severidad: **P1** = defecto visible o riesgo de rechazo en Theme Store; **P2** = rendimiento o UX con impacto medible; **P3** = deuda sin efecto visible hoy. El nivel es el de RULES §3.5.

### H-01 · P1 · Doble escape en 40 traducciones con interpolación
- **Clase del defecto:** `{{ 'clave' | t: var: valor | escape }}`. Shopify ya escapa la salida de `t` en claves que no terminan en `_html`, así que `| escape` vuelve a escapar el `&` de las entidades. Un título "Niño & Compañía" sale como "Niño &amp;amp; Compañía", y el comprador ve o escucha "&amp;".
- **Prueba en vivo:** buscar el texto literal `&amp;` en `/search`. La fuente trae `Results for &quot;&amp;amp;&quot;` y el texto visible es `"&amp;"`. Si `t` no escapara, el `escape_once` de `sections/main-search.liquid:45` habría mostrado "&". Coincide con la documentación: "Translated content is escaped by default".
- **Alcance:** `rg -n "\| *t: [^}]*\| *escape\b"` da 40 ocurrencias. 7 son texto visible:
  - `sections/main-article.liquid:33` y `sections/main-blog.liquid:85`: el autor "O'Brien" se lee "O&#39;Brien".
  - `sections/complete-the-look.liquid:183,223`.
  - `sections/curated-showcase.liquid:146`.
  - `sections/main-placeholder.liquid:5,35`.
  - Las otras 33 están en `aria-label` y plantillas `data-*`: el lector dice "amp", por ejemplo en `sections/cart-drawer.liquid:239,266,279` y `sections/main-product.liquid:363,388,681,726`.
- **Propuesta:** quitar `| escape` detrás de `t` con interpolación, o cambiarlo por `| escape_once` como ya hace la búsqueda. Añadir el patrón a `liquid-literals.py` para que no vuelva. **Nivel 1.**
- **Latente:** 48 `| t | escape` sin interpolación. Hoy no fallan porque ningún texto de `en` o `es` lleva `& < > " '`, pero fallarán con la primera traducción que los lleve.

### H-02 · P1 · El ajuste "Logo width" no hace nada
- `sections/header.liquid:182` pasa `width: settings.logo_width` al `<img>`, pero `.site-header__logo-image { width: auto; max-height: 3rem }` (`assets/base.css:650-653`) anula el atributo. `logo_width` no aparece en ningún otro sitio (`rg logo_width` da 1 resultado).
- **Medido** (Chromium, logos de 960×240, 400×400 y 240×480): con 80, 140 y 240 px el ancho pintado es idéntico (192, 48 y 24 px a 1280; 146, 48 y 24 px a 390).
- **Riesgo:** control muerto en el editor. La Theme Store exige que los cambios del editor se vean en la vista previa.
- **Propuesta:** `--logo-width` desde el ajuste y `width: min(var(--logo-width), 100%)` con `height: auto`. En móvil, un tope proporcional. **Nivel 1.**
- **Relacionado:** por debajo de 48rem, `.site-header__brand { min-width: 0 }` (`assets/base.css:8005`) deja un logo vertical en 24 px de ancho: cumple el mínimo de 24 px de la Theme Store y no el de 44 del proyecto.

### H-03 · P1 · `secondary_menu` sin default (requisito de Theme Store)
- `sections/header.liquid:249-254`: `link_list` sin `default`. El requisito dice: "All settings of type link_list in the Header or Footer must have a default value of main-menu or footer".
- **Propuesta (Nivel 2, cambia un contrato):**
  - (a) `"default": "main-menu"` y no pintar el menú secundario si es el mismo menú que el principal; o
  - (b) quitar el ajuste y llevar esos enlaces a un bloque.
- Recomiendo (a) porque no rompe tiendas instaladas.
- `customer_account_menu` usa `customer-account-main-menu`, igual que los temas de Shopify. No lo toco.

### H-04 · P1 · El cajón promete un obsequio de marca que el comerciante no ha configurado
- `sections/cart-drawer.liquid:528`: `enable_tiered_progress` viene activado por defecto. Muestra "Gift at $250" y, al pasar el umbral, "Complimentary Shipping and **Atelier Gift** unlocked" (`locales/en.default.json:78`; en `es.json:78` "obsequio del atelier").
- RULES, Compuerta 4, prohíbe expresamente "atelier gift". Además, una instalación nueva promete un regalo que no existe hasta crear un descuento automático; el `info` lo advierte, pero el default lo contradice.
- **Propuesta (Nivel 2):**
  - default `false`;
  - clave neutra "Free shipping and gift unlocked", o sin mención al regalo si el nivel está apagado;
  - renombrar la etiqueta visible del ajuste sin tocar su `id`.
- También queda la marca en textos de serie: "Write to the atelier", "Search the atelier", "Enter the atelier" y el bloque "Atelier gallery". Es voz de LINEA NOVE metida en el tema; decisión de Johandry.

### H-05 · P1 · "LINEA NOVE" se corta a 390 px en la tienda
- **Medido en vivo** a 390 x 844, sin barra de desplazamiento (`innerWidth - clientWidth = 0`) y con Libre Baskerville cargada:
  - el texto necesita 138 px y tiene 133 (`truncated: true`);
  - reparto: 350,4 de ancho útil = menú 44 + marca + acciones 149 + 2 × 12 de hueco;
  - acciones = búsqueda 44 + `shopify-account` 50,2 (el componente de Shopify pinta más de 44) + carrito 54,8 (el contador "0" va en flujo: icono 20 + hueco 6 + contador 18 + relleno 10,4).
- **Fórmula:** ancho de marca = ancho de ventana − 257 px. "LINEA NOVE" a 18,4 px se corta por debajo de 395 px: 390 → 133 px, 375 → 118, 360 → 103, 320 → 63.
- **Corrección de 5A-002:** allí lo atribuí a una emulación dudosa; la medida de hoy lo descarta. En el arnés local las acciones miden 136 px (sin la cuenta real de Shopify) y el umbral baja a 382 px, por eso no se veía.
- **Propuesta (Nivel 1 salvo E, suman lo que ganan):**
  - A. Contador del carrito fuera de flujo, sobre la esquina del icono, y oculto con 0 artículos: +10,8 px.
  - B. Fijar `shopify-account` a 44 px con `::part()`: +6,2 px.
  - C. Margen móvil de la cabecera con `--page-gutter-mobile` (16 px): +8 px.
  - D. `font-size: clamp(1rem, 4.6vw, 1.6rem)` para la marca en texto: a 360 px necesita unos 124 px.
  - Con A a D, "LINEA NOVE" cabe desde unos 350 px.
  - E. Llevar la cuenta al menú lateral por debajo de 48rem (+62 px, como Dawn y Prestige). Es decisión de Johandry.
- **En cualquier caso:** los nombres largos ("Maison Aurelienne Paris" necesita 246 px) deben pasar a dos líneas antes que a puntos suspensivos, o pedir un logo en imagen. Hoy truncan.

### H-06 · P2 · JSON de variantes por tarjeta en colecciones grandes
- `snippets/product-card.liquid:449-500` imprime por variante el id, las opciones, el precio y la comparación ya formateados, más un `srcset` de 6 anchos por foto.
- **En vivo** (`/collections/qa-sprint-5a`): 192 a 212 B por variante sin fotos y 376 a 644 B con fotos; 16,4 KB en 5 tarjetas.
- **Proyección con 48 productos por página** (máximo del ajuste): 48 × 60 variantes × 200 B + 48 × 8 fotos × 700 B ≈ 850 KB de HTML sin comprimir. Con 250 variantes por tarjeta, unos 2,4 MB.
- **Complejidad:** 4 bucles sobre `card_product.variants` por tarjeta (`:187,391,454,476`). El de `:391` recorre tallas × variantes.
- **Propuesta (Nivel 1, cambia solo el formato interno):**
  - tuplas numéricas (id, índices de opción, céntimos, disponibilidad, índice de foto);
  - precio con `formatMoney` y `shop.money_format`, como exige RULES en la Compuerta 3;
  - `srcset` construido en JS desde una sola URL base con `&width=`.
- **Alternativa (Nivel 2):** cargar los datos al primer contacto con la tarjeta.

### H-07 · P2 · La PDP en rejilla descarga el doble de ancho del necesario
- `snippets/product-media.liquid:16` declara `sizes: '(min-width: 990px) 60vw, 100vw'` para todos los diseños. En `grid`, cada foto ocupa una de dos columnas.
- **En vivo** (`/products/qa5a-f04-colour-size`, 1280 px, DPR 1,25): ancho pintado 377 px, necesarios 472 px de dispositivo, descargados 800 y 960 px (1,7 a 2 veces el ancho, unas 3 a 4 veces los píxeles). La primera es candidata a LCP.
- **Propuesta (Nivel 1):**
  - `sizes` según el diseño: `grid` → `(min-width: 62rem) 30vw`, y 60vw para la primera si ocupa dos columnas;
  - `stack` y `thumbnails` → 60vw;
  - y el breakpoint 990px pasa a 62rem (992 px), el del CSS.

### H-08 · P2 · Filtros duplicados entre colección y búsqueda
- `sections/main-collection.liquid:67-222` frente a `sections/main-search.liquid:100-249`: 148 de 150 líneas iguales después de normalizar el prefijo de id. También se repite el conteo de filtros activos (`:12-20` en las dos).
- Cada arreglo, como el swatch de 5A, se hace dos veces.
- **Propuesta (Nivel 1, sin cambio visible):** `snippets/facet-filters.liquid` con `filters`, `id_prefix` y `section`.

### H-09 · P2 · Colección vacía con texto de "sin coincidencias"
- `sections/main-collection.liquid:377-382`: con 0 productos muestra "No products match your selection." y "Clear all", aunque no haya ningún filtro puesto. Renderizado con el Liquid real sobre una colección vacía.
- **Propuesta (Nivel 1):**
  - si hay filtros activos, dejar el texto actual;
  - si no, "This collection is empty" con enlace a todos los productos (`routes.all_products_collection_url`);
  - y conservar `sort_by` en "Clear all", como ya hace `:238`.

### H-10 · P2 · Listas de filtros sin límite
No hay "Mostrar más" ni límite en los valores de un filtro. Un filtro de vendor o de talla con 60 valores alarga la barra lateral sin fin. GPT SW-13 pide "wrap o Show more/less accesible". Propuesta: `<details>` con los 8 primeros visibles y "Show {{ count }} more" como botón con `aria-expanded`.

### H-11 · P2 · Ninguna petición tiene timeout
`fetchCommerce` (`assets/theme.js:132-135`) y los `fetch` de filtros, recomendaciones y búsqueda dependen del timeout del navegador. Con una red colgada, el botón de compra se queda con `aria-busy` y `cartAddPending` durante minutos. Propuesta: `AbortSignal.any([controller.signal, AbortSignal.timeout(15000)])` y el mensaje localizado de siempre. **Nivel 1.**

### H-12 · P2 · En la PDP, un color agotado no se puede elegir
`sections/main-product.liquid:197` y `sections/featured-product.liquid:128` ponen `disabled` si `value.available` es falso.
- **En vivo** (F04): Bone (agotado entero) sale `disabled` y el comprador no puede ver su foto ni su estado.
- Al elegir Olive con XL (combinación que no existe), la interfaz muestra Olive y XL marcados y "Unavailable", pero la URL sigue en la variante Ink/XL: al compartirla se abre otro producto.
- Dawn y Prestige tachan sin deshabilitar.
- **Propuesta (Nivel 2, cambia el comportamiento de la PDP):** `aria-disabled` con tachado y botón "Sold out"; sin `disabled`.

### H-13 · P2 · El carrusel móvil no pausa el vídeo al deslizar
`applySlide` (`assets/theme.js:441`) actualiza el contador y los botones pero no pausa `<video>` ni iframes externos. Solo el modo `thumbnails` pausa (`selectMedia`). Un vídeo sigue sonando fuera de pantalla. Propuesta: pausar las diapositivas no activas. **Nivel 1.**

### H-14 · P3 · Seis copias de la lógica de fondo inerte
`applyBackgroundInert` está en `assets/theme.js:305,1204,1426,2114,3697,4123`, con 4 variantes que solo cambian la raíz (`this` o `this.overlay`). `restoreBackgroundInert` está en `:326,1225,1447,2135,3718,4142`, 6 copias idénticas. Propuesta: una función de módulo `inertOutside(root)` que devuelva `restore()`. **Nivel 1.**

### H-15 · P3 · `trapFocus` enfoca en un requestAnimationFrame sin comprobar
`assets/theme.js:49-52`: si el diálogo se cierra antes del siguiente frame, el foco entra en un contenedor cerrado. Es la carrera de P5 en 5A. Propuesta: comprobar `container.isConnected` y que siga abierto antes de enfocar. **Nivel 1.**

### H-16 · P3 · Un listener en document por tarjeta
Cada tarjeta con panel añade `pointerdown` en `document` (`assets/theme.js:1861`) y un `matchMedia` (`:1548`). Con 48 tarjetas son 48 manejadores por clic, baratos pero lineales. Propuesta: añadir el listener al abrir y quitarlo al cerrar. **Nivel 1.**

### H-17 · P3 · CSS en capas de parche
- 22 selectores se redefinen en el mismo contexto. Ejemplos:
  - `.cart-drawer__panel` en 2469 y 7804;
  - `.site-header` en 566 y 8099;
  - `:root` en 1 y 7580;
  - `.product-card__content` en 1744 y 1994 (este lo dejé yo en 5A);
  - la regla universal de reduced motion en 6722 y 8168.
- Los bloques "T1 a T8" de 4F (`:7545-7960`) corrigen reglas anteriores en lugar de editarlas.
- Hay dos escalas de espaciado paralelas: `--space-1..6` (130 usos) repite valores de `--space-sm..2xl` (384 usos).
- **Propuesta:** fusionar por componente cuando haya directiva. RULES §3.9 prohíbe tocarlo sin ella.

### H-18 · P3 · `| default:` muerto en ajustes que siempre tienen valor
`sections/hero-editorial.liquid:4` (select), `sections/main-collection.liquid:6` (select) y `:306` (range). Los dos `number` de `cart-drawer.liquid:9-10` sí pueden quedar vacíos y su guarda es correcta.

### H-19 · P3 · Texto alternativo repetido en la galería
`snippets/product-media.liquid:10` usa `media.alt | default: product.title`. Sin alt en el catálogo, las 10 imágenes se anuncian con el mismo título. Propuesta: "{{ title }}, imagen {{ n }} de {{ total }}" con una clave traducible. **Nivel 1.**

### H-20 · P3 · Objetivos de toque por debajo de los 44 px del proyecto
Todos cumplen los 24 px de WCAG y de la Theme Store.
- Enlace de título en la página de carrito: 155 × 21 px (`sections/main-cart-items.liquid:49`).
- "Home" en la navegación de escritorio: 37 × 44 px (`assets/base.css:3904`).
- Medido en el render local a 390 y 1280.

### H-21 · P3 · Citas del ledger que apuntan a otras clases
- Fila 32: `theme.js:1-2408` (el archivo tiene 4540 líneas).
- Fila 49: `theme.js:1010-1080` y `2780-2810`, que hoy son `StickyCartBar` y `EditorialLookbook`; `trapFocus` está en `:24-55`.
- Fila 77: búsqueda predictiva en `2415-2820`, hoy en `:3753-4151`.
- Filas 78 y 79: `localization-form` en `2390-2410`, hoy en `:3726`.
- `ledger-verify` no lo detecta porque solo valida el formato.

### H-22 · Informativo · Cifras que no cuadran en los informes
- **"Theme Check 116 archivos"** (BOARD y revisiones de Gemini): es correcto en la carpeta de trabajo, pero cuenta archivos que no son del tema. En una copia con solo las carpetas del tema y `listings/`, Theme Check inspecciona **79**. Mis "87" de 5A-001 y 5A-002 venían de una copia en la nube con dos carpetas `listings/couture` y `listings/studio` que no existen en el repositorio. Lo corrijo aquí.
- **BOARD §3, "Transacción en vivo… Móvil: Idem":** en 5A-002 abrí y cerré la hoja móvil y cambié de color, pero no compré desde móvil.
- **BOARD §3, "1.07 s" en español:** el tiempo lo medí en inglés; en español no lo cronometré.

### H-23 · Informativo · Contraseña de la tienda en documentos del repositorio
`GPT-TASK-005` y `CLAUDE-DIRECTIVE-5A-002` contienen la contraseña del storefront. Es una tienda de desarrollo y el riesgo es bajo, pero conviene sacarla de los archivos versionados.

---

## 3. Estados degenerados

| Estado | Dónde | Resultado |
|---|---|---|
| Título de 142 caracteres | F10 en vivo, 1280 y 390 | Sin desborde ni solapes (5A-002). Ocupa 6 líneas y descuadra la altura de la fila; recortar a 3 líneas es decisión de diseño (P3) |
| Sin imagen | H1 del arnés 5A; `pdp-none` local | Marcador y compra rápida funcionan; PDP sin galería rota, 0 violaciones axe |
| Sin variantes | F01 en vivo | Compra en 1 clic |
| Colección vacía | Render real con 0 productos | Texto equivocado (H-09) |
| Catálogo grande | Análisis de Liquid | Paginación de 8 a 48 correcta; payload (H-06) y filtros sin límite (H-10) |
| Carrito con títulos largos | `cart-long` local, 390 y 1280 | Sin desborde, 0 violaciones axe; enlace de título de 21 px (H-20) |
| Recomendaciones vacías | `product-recommendations.liquid:20` | Sección oculta con `hidden` |
| Blog vacío, búsqueda sin resultados | `main-blog.liquid:158`, `main-search.liquid:344` | Estado vacío presente |
| Logo en proporciones extremas | Prueba local (H-02) | Sin desborde; el ajuste de ancho no funciona |
| Nombre de tienda largo | En vivo y local (H-05) | Trunca por debajo de 395 px |
| 10 o más fotos en la PDP | No verificado | Hay un borrador `qa-18` ("Ten images in the gallery"); necesita activarse (§6.8) |

**Barrido del render local** del árbol HEAD a 390 y 1280 px en 9 páginas (home, 4 PDP, carrito, carrito largo, bundle, documentación): 0 px de desborde, 0 violaciones axe WCAG A/AA y 0 errores de JS. **En vivo:** home a 331 px, PDP a 1280 y la colección QA a 1280 con best-practice incluido, todas con 0 violaciones.

---

## 4. Pendientes y deuda consolidados

| # | Origen | Pendiente | Tipo | Dueño | Prioridad |
|---|---|---|---|---|---|
| 1 | Este informe | H-01 doble escape (40) | Técnico | Claude | P1 |
| 2 | Este informe | H-02 ancho de logo muerto | Técnico / Theme Store | Claude | P1 |
| 3 | Este informe | H-03 default de `secondary_menu` | Theme Store | Gemini decide, Claude | P1 |
| 4 | Este informe, RULES C4 | H-04 promesa y texto "Atelier Gift" | Comercial | Johandry decide | P1 |
| 5 | 5A-002 §5.3, este informe | H-05 nombre cortado en móvil | Técnico / UX | Johandry decide, Claude | P1 |
| 6 | 5A-001 §9.3, GPT-004 §7.1 | La región viva del cajón no nombra producto, variante ni cantidad | A11y / UX | Claude | P2 |
| 7 | GPT-004 §7.2 | El umbral de envío cuenta gift cards y productos sin envío (`cart.total_price`) | Comercial | Gemini decide | P2 |
| 8 | 5A-002 §4.1 | Swatches de filtro sin verificar en vivo | Operativo | Johandry (filtro Color) | P2 |
| 9 | 5A-002 §4.2 | Fixture F08 (gift card) | Operativo | Johandry (activar tarjetas de regalo) | P3 |
| 10 | 5A-001 §6 SW-14 | Filtro swatch: persistencia tras re-render y "Borrar todo" sin reprobar | QA | Claude o GPT | P3 |
| 11 | GPT-004 §8 | Teclado completo en vivo (la herramienta no activa con Enter/Espacio), editor de temas, sin JS en vivo, 429 en vivo | QA | GPT (auditoría 005) | P2 |
| 12 | Este informe | H-06 a H-13 (rendimiento y UX) | Técnico | Claude | P2 |
| 13 | Este informe | H-14 a H-21 (deuda) | Técnico | Claude | P3 |
| 14 | GPT-003 §4 | Zoom y galería inmersiva | Producto | Sprint 5B | P1 |
| 15 | GPT-003 §4 | Mega menú editorial (hoy solo desplegables) | Producto | Futuro | P1 |
| 16 | GPT-003 §4 B | Vistos recientemente: ausente (`rg recently` sin resultados) | Producto | Futuro | P1 |
| 17 | GPT-003 §4 A | Capa de confianza junto al CTA (stock bajo, entrega, devoluciones): no hay indicador de stock (`rg inventory_quantity` sin resultados en la PDP) | Producto | Futuro | P2 |
| 18 | GPT-003 §4 | Morph tarjeta → PDP. Ya existe `@view-transition { navigation: auto }` (`base.css:8029`); falta `view-transition-name` | Producto | Después del gate final | P3 |
| 19 | GPT-003 §5, GPT-004 §2 | 3 demos en Client transfer stores, instalación limpia por preset, manifiesto de paridad, capturas | Comercial | Johandry y Gemini | P0 para enviar |
| 20 | Ledger (no verificado) | `theme_info` con URLs públicas de soporte y documentación (DP-001) | Comercial | Johandry | P0 para enviar |
| 21 | Ledger (no verificado) | 3 demos auténticas sin texto de relleno | Comercial | Johandry | P0 para enviar |
| 22 | LOCALE-AUDIT-001 | Títulos de producto y alt en español (Translate & Adapt); 4 traducciones que dependían del despliegue | Contenido | Johandry | P2 |
| 23 | Ledger (código completo) | 13 filas esperan medición en tienda real. Algunas ya medibles hoy: contraste, live regions, checkout acelerado, búsqueda predictiva, selectores de idioma y país | QA | Claude o GPT | P2 |
| 24 | Este informe | H-21: citas del ledger desfasadas | Proceso | Gemini | P3 |
| 25 | Este informe | H-23: contraseña en documentos | Proceso | Gemini | P3 |

---

## 5. Diagnóstico de la galería actual (punto de partida de 5B)

- **Diseños:** `media_layout` = `stack`, `grid` (por defecto) o `thumbnails`.
  - Por debajo de 62rem, `stack` y `grid` pasan a carrusel con scroll-snap, contador y botones (`ProductGallery.initCarousel`, `assets/theme.js:367`).
  - `thumbnails` muestra una foto y una tira de miniaturas de 72 px.
- **Imágenes:** `responsive-image` sirve `srcset` de 320 a 2400 w, recortado a `image.width`. Hoy no se pide nada por encima de 2400 px.
- **Sincronía con la variante:** el evento `theme:variant-change` lleva `featured_media_id`. En el carrusel mueve la diapositiva y en `thumbnails` cambia la foto. En `grid` y `stack` de escritorio solo cambia el recuadro `data-selected` (medido en vivo con Camel en F04); no desplaza ni reordena.
- **Vídeo y 3D:** `media_tag`, `model-viewer` de Shopify con `toggleable` y botón AR (`snippets/product-media.liquid`). No hay pausa al deslizar (H-13).
- **Zoom:** no existe (`rg -i "zoom|lightbox|fullscreen|pinch"` sin resultados en tema y locales).

---

## 6. Propuesta técnica para Sprint 5B (zoom y medios en la PDP)

### 6.1 Modal o lupa
| | Visor modal (recomendado) | Lupa flotante al pasar el cursor |
|---|---|---|
| Táctil | Pellizco, doble toque y arrastre | No funciona |
| Teclado y lector de pantalla | `<dialog>` con foco, Escape y anuncios | Sin equivalente de teclado; contenido solo con el cursor (WCAG 1.4.13 exige que se pueda descartar y mantener) |
| Resolución | Pide alta resolución solo al abrir | La pide al pasar el cursor, también sin intención |
| Referentes | Prestige, Focal e Impulse | Algunos temas lo ofrecen como extra |

**Decisión propuesta:** visor modal por defecto. La lupa, en todo caso, como opción de escritorio (`hover: hover` y `pointer: fine`) en una fase posterior, nunca como único camino.

### 6.2 Componentes y archivos
- **`<product-zoom>`**, nuevo, en `assets/product-zoom.js`. Es un asset aparte cargado con `defer` solo desde `main-product.liquid` cuando el ajuste está activo, para no sumar peso a `theme.js` en el resto de páginas. Extiende el mismo `ThemeElement`: exponerlo en `window.Theme` o duplicar la clase base de 25 líneas; lo primero es mejor.
- **Marcado** (en `main-product.liquid`, no en un snippet compartido):
  - un `<dialog class="product-zoom" aria-label="…">` por sección;
  - una pista con scroll-snap de diapositivas de imagen: solo `media_type == 'image'` (vídeo y 3D no se amplían);
  - cada `<img>` con `data-srcset` de 1600 a 4096 w recortado a `image.width`, `sizes="100vw"`, `alt` real y `decoding="async"`.
- **Disparador:** un `<button class="product-gallery__zoom">` superpuesto a cada foto, con `aria-label` "Ampliar imagen {{ n }} de {{ total }}" y `aria-haspopup="dialog"`. En el carrusel móvil el `click` no se dispara tras un gesto de desplazamiento, así que no choca con el swipe.
- **CSS:** en `base.css`, bloque "5B" con tokens: `--motion-*`, `--ease-*` y el velo del cajón (`color-mix` con `--color-shadow`, el mismo patrón que la hoja de 5A).

### 6.3 Interacción
- **Abrir:** `showModal()`, que da capa superior, inert nativo y Escape (evento `cancel`). Se abre en la foto pulsada o en la de la variante activa, y bloquea el scroll del documento con `data-modal-open`, como 5A.
- **Escala:** 1× es "ajustada a la ventana". Zoom máximo = `min(3, anchoNatural / anchoPintado)`, para no ampliar más allá de los píxeles reales. Si el máximo es menor que 1,25, no hay zoom y el visor solo sirve para ver en grande.
- **Ratón:** clic alterna 1× ↔ máximo centrado en el punto; con zoom, el movimiento del puntero desplaza la imagen (modo "seguir cursor").
- **Táctil (Pointer Events):**
  - dos punteros → escala por la razón de distancias, anclada en el punto medio;
  - uno con zoom → arrastre;
  - doble toque (< 300 ms y < 24 px) → alterna;
  - `touch-action: pan-x` sin zoom (deja deslizar entre fotos) y `none` con zoom.
- **Teclado:** `+` y `-` escalan, `0` restaura, flechas desplazan con zoom o cambian de foto sin él, Home y End van al principio y al final, Tab queda dentro (Cerrar, anterior, siguiente, acercar y alejar, todos de 44 px).
- **Anuncios:** región viva con "Imagen 3 de 8" y "Zoom 250 %", con claves traducibles.
- **Cerrar:** Escape, botón y clic en el fondo sin zoom. El foco vuelve al disparador y, en el carrusel, la galería se sitúa en la última foto vista.
- **Movimiento reducido:** sin transiciones de escala ni de apertura; el zoom es instantáneo.

### 6.4 Rendimiento
- Nada en alta resolución hasta abrir: el `data-srcset` pasa a `srcset` para la foto actual y sus vecinas.
- La foto actual primero con `fetchpriority="high"`; durante la carga se ve la versión ya descargada de la galería, sin salto.
- `will-change: transform` solo mientras hay gesto; transformaciones con `translate3d` y `scale`, sin tocar el layout.
- Sin CLS: el diálogo está fuera del flujo.
- **Presupuesto:** `product-zoom.js` ≤ 12 KB sin comprimir; 0 peticiones antes del primer clic.

### 6.5 Ajustes del comerciante y locales
- `main-product` → `enable_media_zoom`: checkbox, default `true`, etiqueta "Enable image zoom" con `info` sobre la resolución recomendada. Nivel 2, porque es un ajuste nuevo.
- **Locales, en y es** (8 claves): abrir el zoom, cerrar, acercar, alejar, restaurar, foto anterior, foto siguiente, estado.

### 6.6 Arreglos de galería que conviene hacer en el mismo sprint
H-07 (`sizes`), H-13 (pausar vídeo), H-19 (alt repetido) y, opcionalmente, en escritorio `grid` y `stack`, desplazar a la foto de la variante cuando queda fuera de la ventana.

### 6.7 Dependencia de fotografía (Johandry)
- De los 20 productos activos consultados por Admin API, 12 tienen fotos de 1856 × 2304 y 8 de 928 × 1152: el cuello alto, el punto de alpaca, la camisa de popelina, la blusa de charmeuse, el vestido lencero, el vestido de punto, la falda cruzada y la falda plisada midi.
- En una ventana de 1440 × 900 con DPR 2, "ajustar a la ventana" ya pide unos 1450 px de ancho. Con 928 px la foto se ve blanda sin zoom, y con 1856 el zoom útil es de 1,3×.
- **Para vender "zoom de tejido" hacen falta originales de al menos 3000 a 4000 px de ancho.** Sin ellos, el tope de §6.3 dejará el zoom casi apagado en la demo.

### 6.8 Fixtures de QA para 5B (con autorización de Johandry)
Una colección `qa-sprint-5b` con:
- 10 o más fotos (activar `qa-18-many-images`);
- una foto panorámica 21:9 (`qa-03-panoramic`) y una muy alta 2:5 (`qa-04-ultra-tall`);
- una foto pequeña (600 px);
- un vídeo, un vídeo externo y un modelo 3D;
- un producto sin fotos y uno con una sola.

### 6.9 Criterios de aceptación (propuesta para fusionar con GPT)
1. 0 peticiones de alta resolución antes del primer clic en el disparador.
2. El zoom nunca supera `anchoNatural / anchoPintado`, ni 3×.
3. Escape, botón Cerrar y fondo cierran; el foco vuelve al disparador exacto.
4. Tab no sale del visor; todos los controles miden 44 × 44 px o más.
5. Pellizco, doble toque y arrastre en 390 × 844 táctil; deslizar sin zoom cambia de foto.
6. Teclado completo (`+`, `-`, `0`, flechas, Home, End).
7. Movimiento reducido: sin animación.
8. Vídeo y 3D no abren el visor; el vídeo se pausa al salir del carrusel (H-13).
9. 0 violaciones axe con el visor abierto, a 1280 y a 390.
10. CLS 0 al abrir y cerrar; LCP de la PDP sin empeorar respecto a hoy (Lighthouse en tienda real).
11. En y es con paridad de claves; 0 literales.
12. Estados de §6.8, cada uno medido en tienda real (Compuerta 5).

### 6.10 Estimación
- Visor y galería: unas 450 líneas de JS, 150 de CSS y 60 de Liquid, más un arnés local de unas 30 pruebas y la pasada en vivo.
- Riesgos: gestos en Safari iOS (se necesita un iPhone real o probar en BrowserStack; Chromium no reproduce el pellizco de iOS) y la escasa resolución de la demo.

---

## 7. Plan de acción priorizado (para fusionar con GPT-AUDIT-005)

**Ola 1: corrección y cumplimiento (antes de 5B, unas 150 líneas)**
- H-01, H-02 y H-05 (A a D), Nivel 1.
- H-03 y H-04, Nivel 2, a la espera de decisión.
- Añadir a `liquid-literals.py` la detección de `t:` con interpolación seguida de `| escape`.
- **Pruebas:** arnés 5A, heredado (106) y un caso nuevo con "O'Brien & Co" en autor, título y aria.

**Ola 2: Sprint 5B**
§6 completo, más H-07, H-13 y H-19.

**Ola 3: rendimiento y robustez**
- H-06 (formato compacto del JSON), H-08 (snippet de filtros), H-09, H-10, H-11 y H-12 (si Gemini la aprueba).
- Pendientes 6 y 7 de §4 (región viva con variante y umbral sin gift cards).

**Ola 4: deuda, solo con directiva**
H-14 a H-18, H-20 y H-21, y una pasada que reconcilie las 22 redefiniciones de CSS con el arnés como red.

**Fuera del código (Johandry)**
Filtro Color, gift cards, fotografía de 3000 px o más, demos en Client transfer stores, URLs de soporte y documentación, decisiones de H-04 y H-05 E.

---

## 8. Verificación

### 8.1 Base auditada
```text
$ git log --oneline -1 (carpeta de Johandry)
3429015 feat(commerce): certify Sprint 5A in live store and apply header/footer a11y patches
$ (82 archivos rastreados: tema, scripts, ledger) MD5 sin CRLF, carpeta frente a copia en la nube
diffs: 0
Admin API, tema Couture MAIN: base.css feb631f8…, header.liquid 7c15bf43…, footer.liquid 09e7f369…,
  product-card.liquid 82229c9e…, main-collection.liquid 734edd2f…, main-product.liquid ef19d03e…
  = HEAD. theme.js 1eca1d47… = HEAD con CRLF (sin CRLF: ba8ba0ba…, igual que HEAD).
```

### 8.2 Gates estáticos
```text
$ shopify theme check (solo carpetas del tema + listings)   79 files inspected with no offenses found.
$ shopify theme check (carpeta de trabajo completa)         116 files inspected with no offenses found.
$ node --check assets/theme.js                             OK
$ node scripts/locale-key-inventory.mjs                    380 claves; 0 sin resolver; 0 huérfanas storefront; 61 schema
$ node scripts/ledger-verify.mjs                           Filas de requisito: 53 · Incoherencias: 0
$ python3 .../liquid-literals.py .                         46 archivos Liquid, 0 hallazgos
```
**Qué demuestra:** no hay errores de sintaxis ni de claves. **Qué no demuestra:** que los textos se muestren bien. H-01 pasa los cinco gates.

### 8.3 Barridos
```text
$ rg -n "\| *t: [^}]*\| *escape\b" sections snippets layout | wc -l          40
$ rg -n "\| *t *\| *escape\b" sections snippets layout | wc -l              48
$ rg -n "logo_width" -g '*.liquid' -g '*.css' -g '*.js' .                   1 (header.liquid:182)
$ node css-audit.mjs   → UNDEFINED: --cluster-gap (con respaldo) · RAW COLORS: 4 · !important: 37
                         DUPLICATE selector blocks: 22 · BREAKPOINTS: 48rem×9 62rem×12 75rem×1 (+max)
$ node dead-classes.mjs → 760 clases · 20 sin literal (todas modificadores dinámicos o de Shopify)
$ python3 (difflib) → main-collection:67-222 vs main-search:100-249 → 148 líneas idénticas
```

### 8.4 En vivo (navegador integrado, sesión del storefront ya abierta, sin cambios en la tienda)
```text
/search?q=&amp;            fuente: Results for &quot;&amp;amp;&quot; · visible: Results for "&amp;"
/ a 390×844 (móvil)        brand need 138 / shown 133 · truncated true · actions 149
                           (search 44, account 50.2, cart 54.8) · scrollbar 0 · Libre Baskerville cargada
/products/qa5a-f04 1280    imgs rendered 377 · need 472 (DPR 1.25) · chosen 960/800/800/960 · axe 0
/products/qa5a-f04         Bone(disabled)(aria-dis) · tras XL + Olive: UI Olive/XL, URL ?variant=…918707
/collections/qa-sprint-5a  axe WCAG + best-practice: [] · header/footer bajo DIV · idioma inactivo sin opacidad
/collections/qa-sprint-5a  JSON: 5 tarjetas, 16 419 B; 192–212 B/variante sin fotos, 376–644 con fotos
```
**Qué demuestra:** el comportamiento real con el tema desplegado. **Qué no demuestra:** Safari ni iOS, y la navegación por teclado activada con Enter o Espacio (límite de la herramienta).

### 8.5 Local (Chromium, Liquid real de HEAD con liquidjs)
```text
Barrido 9 páginas × {390,1280}: overflow 0, axe WCAG 0, JS errors 0 · objetivos <44: cart title 155×21, nav "Home" 37×44
Logo 80/140/240 → ancho pintado idéntico en 3 proporciones y 2 anchos
Colección vacía → "No products match your selection." + "Clear all"
Marca local a 320/360/375/390/414: shown 76/116/131/138/138 de 138 (acciones 136)
```

---

## 9. Afirmaciones falsables

1. `rg -n "\| *t: [^}]*\| *escape\b" sections snippets layout | wc -l` devuelve 40.
2. En la tienda, `/search?q=%26amp%3B` contiene en la fuente `&amp;amp;` dentro del texto "Results for".
3. Con un autor "O'Brien" en un artículo, `main-article.liquid:33` muestra "O&#39;Brien" en pantalla.
4. `rg -n logo_width` en `.liquid`, `.css` y `.js` devuelve una sola línea (`sections/header.liquid:182`), y cambiar el ajuste de 80 a 240 no cambia el ancho pintado del logo.
5. En el schema de `sections/header.liquid`, el ajuste `secondary_menu` (`link_list`) no tiene `default`.
6. En el schema de `sections/cart-drawer.liquid`, `enable_tiered_progress` tiene `"default": true`, y `locales/en.default.json:78` contiene "Atelier Gift".
7. En la tienda, a 390 × 844 y sin barra de desplazamiento, `.site-header__brand-text` tiene `scrollWidth` 138 y `clientWidth` 133.
8. En la tienda, `.site-header__cart` mide 54,8 px de ancho con el contador "0" en flujo.
9. En `/products/qa5a-f04-colour-size` a 1280 px, las 4 fotos se pintan a 377 px y se descargan con `width=800` o `width=960`.
10. `sections/main-collection.liquid:67-222` y `sections/main-search.liquid:100-249` coinciden en 148 líneas tras normalizar el prefijo de id.
11. Una colección con 0 productos y sin filtros activos muestra "No products match your selection.".
12. `assets/theme.js` no contiene `AbortSignal.timeout` ni ningún otro timeout de `fetch`.
13. En la PDP de F04, el radio "Bone" tiene `disabled`.
14. `applyBackgroundInert` aparece 6 veces en `assets/theme.js` y `restoreBackgroundInert` 6 veces con el mismo cuerpo.
15. Theme Check sobre las carpetas del tema más `listings/` inspecciona 79 archivos; sobre la carpeta de trabajo completa, 116.
16. `rg -i "zoom|lightbox|pinch"` no encuentra nada en `sections/`, `snippets/`, `assets/` ni `locales/`.
17. De los 20 primeros productos activos de la tienda, 8 tienen la foto principal de 928 px de ancho.
18. Ningún archivo del tema cambió en esta tarea: `git status` en la carpeta de Johandry solo muestra este informe como nuevo, además de lo que ya estaba modificado antes.
