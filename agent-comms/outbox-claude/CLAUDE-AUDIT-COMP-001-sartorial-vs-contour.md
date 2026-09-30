# CLAUDE-AUDIT-COMP-001: Auditoría comparativa en vivo, Sartorial 1.0.0 frente a Contour 4.1.0

```text
ID: CLAUDE-AUDIT-COMP-001 (pedido directo de Johandry, 2026-09-29)
Estado: ENTREGADO. Solo diagnóstico: ningún archivo del tema cambió, sin commit ni push, sin cambios en
        ninguna tienda. Los carritos de sesión de Contour y Maison recibieron 1 artículo de prueba cada uno
        y se vaciaron con /cart/clear.js en la misma prueba.
Base auditada:
  Competencia (tema de Sebas): Contour 4.1.0, un solo tema publicado en 3 tiendas desde ramas git.
    contour-ho5kbo9x.myshopify.com  rama contour/main    #159799967844  contexto: muebles y hogar
    maison-10oym9w0.myshopify.com   rama atelier/maison  #189395697969  contexto: cerámica artesanal
    annex-r0zzjfjf.myshopify.com    rama atelier/annex   #192380338468  contexto: galería de arte
  Propio: Sartorial 1.0.0 (master 49a257f) en las 3 tiendas demo del BOARD.
    sartorial-atelier  #188743188704 · sartorial-edition  #188655599784 · sartorial-archive  #191153275192
Decisión requerida (Johandry y Gemini):
  1. Poblar las 3 tiendas demo antes de cualquier otra cosa (§4, ola 0). Hoy no tienen ni un producto.
  2. Autorizar la ola 1 (§4): 4 defectos visibles del tema, todos pequeños y localizados.
  3. Decidir cuánto diferenciar los presets (§4, ola 2): tipografía y composición por contexto.
Resumen en 5 líneas:
  1. Contour gana en lo que ve un comprador o un revisor: sus 3 demos tienen 25 productos, 3 colecciones,
     fotografía real y secciones hechas para cada contexto. Las 3 demos de Sartorial tienen 0 productos,
     la colección sale vacía y el inicio es todo placeholders.
  2. Sartorial gana en ingeniería: 2 archivos de tema frente a 27, sin librerías, la mitad de bloqueo del
     hilo principal en móvil (TBT 1,4 a 1,5 s frente a 2,2 a 3,3 s) y mejor gestión del foco.
  3. Contour tiene 5 defectos verificados: menú móvil con aria-modal sin trampa de foco, foco perdido al
     cerrar el carrito, la página de Maison se desplaza sola al cargar, CLS de hasta 0,47 en la PDP móvil
     y la miga de pan de Annex repetida.
  4. Sartorial tiene 4 defectos visibles en las demos: la cápsula enseña al comprador una instrucción del
     editor, el nombre de la tienda se parte a mitad de palabra en el footer, el header móvil lo corta
     con "…" y la palabra "atelier" se cuela en 12 textos de cada idioma de los otros estilos.
  5. Con las demos pobladas y la ola 1 hecha, Sartorial compite de igual a igual y conserva su ventaja
     técnica. Sin eso, al lado de Contour se ve como un tema sin terminar.
Archivos tocados: este informe y harness-COMP-001/ (4 scripts de sondeo, métricas JSON y 41 capturas).
Desviaciones: no pude entrar en Couture (tema-qkqpke0j, con contraseña). La PDP y el carrito de Sartorial
              con catálogo real no se re-verificaron hoy; cito CLAUDE-REPORT-AUDIT-FINAL-001 (§6).
Verificación: §6. Afirmaciones falsables: §7.
```

---

## 1. Qué se comparó y cómo se emparejan los estilos

Los dos sistemas usan la misma estrategia: un único tema y una tienda por contexto, cada una con su preset. Contour lo hace con ramas git (`contour/main`, `atelier/maison`, `atelier/annex`) y versión semántica 4.1.0. Sartorial lo hace con `listings/{sartorial,edition,archive}` y versión 1.0.0.

| Par | Competencia | Sartorial | Por qué se emparejan |
|---|---|---|---|
| A | **Contour**: muebles y hogar, cálido, serif editorial | **Atelier**: moda y objetos, oscuro y dorado, serif | Estilo insignia de cada tema |
| B | **Maison**: cerámica, tono arena, Playfair | **Edition**: objetos útiles, blanco y negro, sans | Producto cotidiano de catálogo |
| C | **Annex**: galería de arte, mayúsculas, Baskerville | **Archive**: procedencia y catálogo, oscuro, serif | Curaduría y colección |

---

## 2. Marcador por dimensión

| Dimensión | Gana | Evidencia principal |
|---|---|---|
| Demo y catálogo | **Contour** (amplio) | 25 productos y 3 colecciones por tienda frente a 0 y una colección `frontpage` vacía (§5.1) |
| Diferenciación por contexto | **Contour** | Tipos de producto, textos, fotos y secciones propias en cada tienda. Sartorial solo varía la composición del hero y la paleta (§5.2) |
| Funciones de compra | **Contour** (ligero) | Aviso de vuelta de stock, tabla comparativa, bundle, paleta de búsqueda y vista de lista. En el carrito hay paridad (§5.3) |
| Rendimiento (JS) | **Sartorial** | TBT móvil de la mitad; 2 archivos de tema frente a 27; 0 librerías frente a GSAP, ScrollTrigger, Flip, Lenis y SplitText (§5.4) |
| Accesibilidad | **Sartorial** | axe da 0 violaciones en los dos. Sartorial gestiona bien el foco en el menú móvil y al cerrar diálogos; Contour no (§5.5) |
| Defectos visibles | **Empate con matices** | Contour: 5, en páginas internas y en móvil. Sartorial: 4, pero en el inicio de cada demo, que es lo primero que se ve |
| Preparación Theme Store | **Sartorial** | Gates estáticos documentados, Theme Check con 0 ofensas, en/es con locales de schema. Contour no se pudo auditar en código |

---

## 3. Inventario de hallazgos

Severidad: **P0** = bloquea la comparación o la revisión de Theme Store; **P1** = defecto visible o de accesibilidad WCAG; **P2** = UX o rendimiento con impacto medible; **P3** = deuda. Los hallazgos **S-** son de Sartorial (tu tema); los **C-** son de Contour (la competencia, como referencia).

### S-01 · P0 · Las 3 tiendas demo de Sartorial no tienen catálogo
- **Medido:** `/products.json` devuelve 0 productos en atelier, edition y archive. `/collections.json` solo lista `frontpage` con 0 productos. `/search?q=a` da 0 resultados. `/collections/all` dice "This collection is empty". El inicio no tiene ni un `<img>`: todos los medios son el SVG placeholder de Shopify.
- **Contraste:** Contour, Maison y Annex tienen 25 productos cada una, con 3 colecciones de 8 o 9 productos y tipos propios del contexto: *Sofas, Rugs, Bedding…*; *Teaware, Bowls, Vases…*; *Photography, Original Artwork, Art Print*.
- **Arrastra:** el menú principal solo tiene Home, Catalog y Contact; el footer solo tiene Search y Your Privacy Choices; la cápsula está vacía (S-02); el bento y el lookbook muestran placeholders.
- **Impacto:** la ficha de Theme Store enlaza a estas demos. Un revisor o un comerciante no puede ver la PDP, las colecciones, los filtros ni el carrito de Sartorial. Es el mayor desnivel frente a Contour y no es un problema de código.
- **Estado en BOARD:** "Preparación de importación de catálogos temáticos" está pendiente para Gemini.

### S-02 · P1 · La cápsula enseña al comprador una instrucción del editor
- **Clase del defecto:** `sections/complete-the-look.liquid:280` imprime `sections.complete_the_look.empty` ("Choose two to four products in the theme editor to build this look.") sin comprobar `request.design_mode`. Debajo sigue el resumen con "$0.00", "0 of 0 items selected" y el botón gris "Select at least one piece".
- **Dónde se ve:** inicio de Atelier (captura `harness-COMP-001/shots/sec-atelier-capsule.jpg`).
- **Propuesta (Nivel 1):** en el storefront, si no hay productos, no renderizar la sección (o como mínimo el panel y el resumen). El mensaje queda solo cuando `request.design_mode` es verdadero.

### S-03 · P1 · El nombre de la tienda se parte a mitad de palabra en el footer
- **Clase del defecto:** `body { overflow-wrap: anywhere; }` en `assets/base.css:109` lo hereda `.site-footer__title` (`assets/base.css:837`), que tiene tamaño h2 (75,6 px) en una columna de 304 px. "Sartorial" no cabe y se rompe como "Sartori / al / Atelier".
- **Dónde se ve:** footer de Atelier (`sec-atelier-footer.jpg`). En Edition cabe por la fuente sans; con cualquier nombre largo pasará igual.
- **Propuesta (Nivel 1):** `.site-footer__title { overflow-wrap: normal; }` y un tamaño fluido acotado a la columna (`clamp()` con un tope en `cqi` o `vw`). Así corta entre palabras y nunca dentro de una.

### S-04 · P1 · El header móvil corta el nombre con "…"
- **Clase del defecto:** `.site-header__brand-text` (`assets/base.css:674-683`) usa `white-space: nowrap` y `text-overflow: ellipsis`. A 390 px se lee "Sartorial Ateli…" (`shot-atelier-m-home.jpg`).
- **Relación:** es la misma familia que H-05 de CLAUDE-AUDIT-OPUS-001 ("LINEA NOVE" cortado). Aquel arreglo cubrió ese nombre, no el caso general.
- **Propuesta (Nivel 1):** reducir el tamaño con `clamp()` según el hueco real y permitir 2 líneas (`-webkit-line-clamp: 2`) antes de recurrir a la elipsis.

### S-05 · P2 · La voz "atelier" se cuela en los otros estilos y en cualquier comerciante
- **Medido:** `atelier` aparece en 12 textos de storefront por idioma (`locales/en.default.json` y `es.json`). Por ejemplo: `:350` "Object not found in the atelier.", `:352` y `:590` "Search the atelier", `:371-372` contraseña, `:579` "Notes from the atelier", y contacto y FAQ en `:190`, `:192` y `:224`.
- **Efecto:** Edition y Archive muestran "Object not found in the atelier." en el 404 y "Notes from the atelier" en el footer. Cualquier tienda que instale el tema hablaría de un "atelier" que no existe.
- **Propuesta (Nivel 2, toca locales):** textos neutros por defecto ("Search the store", "Page not found") y la voz de marca solo en los ajustes de cada preset.

### S-06 · P2 · La tipografía apenas distingue los 3 estilos
- **Medido:**

  | Estilo | Titulares | Cuerpo |
  |---|---|---|
  | Atelier | Libre Baskerville | Assistant |
  | Archive | Libre Baskerville | Assistant (misma pareja que Atelier) |
  | Edition | Assistant | Assistant |
  | Contour | EB Garamond | Lora |
  | Maison | Playfair Display | Jost |
  | Annex | Libre Baskerville en mayúsculas | DM Sans |

- **Efecto:** Atelier y Archive se leen como el mismo tema con otro color. En Contour cada tienda tiene su pareja de fuentes.
- **Propuesta:** una pareja propia por preset en `listings/*/config/settings_data.json`. Solo cambian datos.

### S-07 · P2 · CLS intermitente en el inicio de Edition (móvil)
- **Medido:** con perfil móvil lento, una de 2 cargas dio CLS 0,363 y la otra 0,032. La fuente del cambio es `DIV.hero-editorial__media` y `.hero-editorial__actions`, que bajan 41 px al cambiar la fuente del titular.
- **Propuesta:** `size-adjust`/`ascent-override` en la fuente de respaldo, o reservar la altura del bloque de texto del hero dividido. Hay que reproducirlo antes de tocar nada.

### S-08 · P3 · Un único CSS de 150 KB bloquea el renderizado en todas las páginas
- **Medido:** `base.css` pesa 150 KB decodificado en cada página, frente a 54 KB de CSS de Contour (`base.css` 40 KB y `base-components.css` 14 KB). Con caché compartida no pesa mucho, pero es lo único que bloquea el primer pintado.
- **Propuesta:** a medio plazo, sacar el CSS de secciones pesadas (lookbook, cápsula, bento, documentación) a archivos de sección con `{{ 'x.css' | asset_url | stylesheet_tag }}`.

### C-01 · P1 (competencia) · Menú móvil con `aria-modal` pero sin gestión de foco
- **Medido en las 3 tiendas:** al abrir el menú, el foco se queda en el logo. En 20 pulsaciones de Tab, las 20 se salen del panel. Escape deja el foco en `BODY`. El panel se declara modal, así que un lector de pantalla "encierra" al usuario en un panel donde el foco no está. Incumple WCAG 2.4.3.
- **Sartorial en la misma prueba:** el foco entra al botón Cerrar, 0 de 20 salidas y Escape devuelve el foco al botón Menú.

### C-02 · P1 (competencia) · El foco se pierde al cerrar el carrito
- **Medido en Contour y Maison:** después de añadir al carrito, el foco entra al cajón (bien) y la trampa aguanta 25 Tab (bien). Pero Escape deja el foco en `BODY` y no en el botón que abrió el cajón.
- **Sartorial:** este caso se corrigió en A360-04 y A360-11.

### C-03 · P1 (competencia) · La página de Maison se desplaza sola al cargar
- **Causa:** el componente de pestañas (`tabs.js`, sección "shelves") llama a `scrollIntoView()` sobre la pestaña activa al iniciarse, y eso mueve toda la página. Medido: 70 px en escritorio y 125 a 358 px en móvil según la carga. En otra carga llegó a 988 px.
- **Efecto:** el comprador aterriza a mitad del hero. En móvil, los botones flotantes de menú y carrito tapan el H1 (`maison-m-top.jpg`).
- **Arreglo típico:** `scrollIntoView({block: 'nearest', inline: 'center'})` o mover `scrollLeft` del contenedor.

### C-04 · P2 (competencia) · CLS alto en la PDP móvil
- **Medido:** Contour 0,227, reproducido en 2 pasadas. En Maison y Annex dio 0,47 en una pasada y 0 en otra.
- **Causa verificada en Contour:** todo `DIV.site-main` baja 191 px cuando se inicia el JS de la barra lateral. Supera el umbral de 0,25 ("pobre") en el peor caso.

### C-05 · P2 (competencia) · JS pesado y sin carga por ruta
- **Medido:** entre 26 y 28 archivos de tema en cada página. Incluyen GSAP (71 KB), ScrollTrigger (43 KB), Flip (24 KB), Lenis (14 KB) y SplitText (7 KB), unos 159 KB solo de librerías. `compare-slider.js` y `collection-showcase.js` se cargan también en la PDP.
- **Efecto:** en móvil lento, el TBT va de 2,2 a 3,3 s, y el LCP del inicio de Contour es de 4,2 s.

### C-06 · P3 (competencia) · La miga de pan de Annex se repite
"HOME · LIMITED EDITIONS · LIMITED EDITIONS" en `/collections/limited-editions` (`shot-annex-d-coll.jpg`).

**Sin confirmar (no cuenta como hallazgo):** los enlaces de esmalte de Maison ("Glaze: …") muestran `outline-style: none` con `:focus-visible`. En la captura se ve un aro, pero puede ser el estado de selección y no el de foco.

---

## 4. Plan de acción priorizado para Sartorial

**Ola 0: demo (sin código, la que más impacto tiene)**

1. Importar en cada tienda entre 20 y 25 productos con fotografía real, 3 colecciones y variantes de color y talla, coherentes con su contexto:
   - Atelier: sastrería.
   - Edition: objetos y escritorio.
   - Archive: piezas con procedencia.

   El proyecto `Creacion de productos` ya tiene las herramientas para generarlos.
2. Menú principal con las colecciones y un submenú. Menú de footer con About, FAQ, Contact y las políticas.
3. Asignar los productos de la cápsula y del bento. Poner la meta descripción de la tienda.
4. Volver a correr esta sonda (`harness-COMP-001/collect.js`) y comprobar que hay productos en `/collections/all`, en la búsqueda y en la PDP.

**Ola 1: código, cambios pequeños (S-02, S-03, S-04 y S-05)**

| ID | Archivo | Cambio | Nivel |
|---|---|---|---|
| S-02 | `sections/complete-the-look.liquid:280` | Ocultar la sección en el storefront cuando está vacía; mostrar el mensaje solo en `design_mode` | 1 |
| S-03 | `assets/base.css:837` | `overflow-wrap: normal` y tamaño fluido acotado a la columna | 1 |
| S-04 | `assets/base.css:674-683` | `clamp()` y hasta 2 líneas antes de la elipsis | 1 |
| S-05 | `locales/*.json` (12 claves por idioma) | Textos neutros; la voz de marca pasa a los presets | 2 |

**Ola 2: diferenciación por contexto (S-06, y aprender de Contour)**

- Una pareja tipográfica propia por preset. Propuesta:
  - Atelier: serif clásica.
  - Edition: sans geométrica en titulares.
  - Archive: serif de catálogo con cuerpo mono o serif.
- Composiciones de inicio más distintas por preset, reutilizando secciones existentes con otros bloques y otro orden. Contour lo consigue con secciones hechas para cada contexto: "kiln log" y "glaze library" en Maison, "framing" y "see it on the wall" en Annex.
- Funciones a valorar, una por una:
  - aviso de "avísame cuando vuelva" en agotados (formulario de cliente con etiqueta, sin app);
  - tabla comparativa;
  - vista de lista en la colección.

**Qué no copiar:** GSAP, Lenis y los 27 archivos por página. La ventaja de Sartorial en TBT y en accesibilidad es real, y la Theme Store la mide.

---

## 5. Evidencia por dimensión

### 5.1 Demo y catálogo

| | Contour | Maison | Annex | Atelier | Edition | Archive |
|---|---|---|---|---|---|---|
| Productos (`/products.json`) | 25 | 25 | 25 | **0** | **0** | **0** |
| Colecciones con productos | 3 | 3 | 3 | **0** | **0** | **0** |
| `<img>` en el inicio | 19 | 27 | 25 | **0** | **0** | **0** |
| Resultados de `/search?q=a` | 16 | 16 | 16 | **0** | **0** | **0** |
| Secciones en el inicio | 13 | 14 | 14 | 12 | 10 | 11 |

### 5.2 Diferenciación

- **Contour:** las 3 tiendas comparten el mismo esqueleto (barra lateral izquierda fija, hero a sangre, botones, píldora "Recently viewed") y se distinguen por fuente, color, fotografía, textos y secciones de inicio exclusivas. Annex carga además 2 scripts propios del contexto (`frame-preview.js`, `overlap-index.js`).
- **Sartorial:** las 3 comparten header centrado, footer y fuente de cuerpo. El hero sí cambia de composición: superpuesto a la izquierda, dividido y centrado. Eso es más variación de maquetación de la que tiene Contour, pero sin fotos ni catálogo no se aprecia.

### 5.3 Funciones de compra

| Función | Contour | Sartorial |
|---|---|---|
| Compra rápida en tarjeta | Sí (14 a 19 botones por colección) | Sí (`main-collection.liquid:371`, ajuste `show_quick_add`) |
| Muestras de color en tarjeta | Sí | Sí (`product-card-variants`) |
| Filtros y orden | Sí, con disponibilidad, precio y color | Sí (`facet-filters-form`); en la demo no se ven porque no hay productos |
| Vista de lista | Sí | No (solo densidad de rejilla) |
| Carrito: barra de envío gratis | Sí | Sí, con un nivel extra de regalo (`cart-drawer.liquid:9-20`) |
| Carrito: venta cruzada | Sí ("Pairs well with" con +) | Sí (bloques `cross_sell`, `cart-drawer.liquid:291`) |
| Nota del pedido | Sí | Sí (`cart-drawer.liquid:455`) |
| Avísame cuando vuelva | Sí | No |
| Tabla comparativa y bundle | Sí | No |
| Cápsula comprable (look completo) | No | Sí (`complete-the-look`) |
| Lookbook con puntos | No | Sí (`editorial-lookbook`) |
| Barra fija de añadir al carrito | No se detectó | Sí (`sticky-cart-bar`) |
| Guía de tallas, zoom, destinatario de gift card | Zoom no detectado | Sí, las tres |
| Búsqueda | Paleta modal con combobox y listbox | Búsqueda predictiva (`predictive-search`) |
| Páginas extra | About y Contact | About, FAQ, Support, Documentation, Contact y Policy |
| Idiomas | Selector con EN visible | en y es, más los locales de schema |

### 5.4 Rendimiento

**Escritorio sin limitación (1440 × 900), inicio:**

| | Contour | Maison | Annex | Atelier | Edition | Archive |
|---|---|---|---|---|---|---|
| Archivos del tema | 26 | 26 | 28 | **2** | **2** | **2** |
| CSS del tema (decodificado) | 54 KB | 54 KB | 54 KB | 150 KB | 150 KB | 150 KB |
| JS del tema (decodificado) | ~224 KB | ~224 KB | ~227 KB | 121 KB | 121 KB | 121 KB |
| Nodos DOM | 1077 | 1132 | 1031 | 871 | 796 | 737 |
| JS bloqueante en `<head>` | 0 | 0 | 0 | 0 | 0 | 0 |
| Hosts de terceros | 0 | 0 | 0 | 0 | 0 | 0 |

**Móvil 390 × 844 con CPU 4x más lenta, 150 ms de latencia y 1,6 Mbps (perfil tipo Lighthouse). Mejor de 2 cargas; en CLS, el peor:**

| Página | LCP | FCP | TBT | CLS | Peso | Peticiones |
|---|---|---|---|---|---|---|
| Contour · inicio | 4216 ms | 904 | 2856 | 0,024 | 1006 KB | 140 |
| Contour · PDP | 2632 | 1032 | 2175 | **0,227** | 721 | 149 |
| Maison · inicio | 1556 | 864 | 3325 | 0,001 | 854 | 140 |
| Maison · PDP | 1416 | 1084 | 2154 | **0,473** | 869 | 161 |
| Annex · inicio | 2376 | 1000 | 2917 | 0,018 | 1572 | 174 |
| Annex · PDP | 1972 | 872 | 2971 | **0,474** | 1078 | 154 |
| Atelier · inicio | 1220 | 1040 | **1407** | 0,051 | 601 | 109 |
| Edition · inicio | 1180 | 996 | **1477** | **0,363** | 567 | 108 |
| Archive · inicio | 1264 | 1020 | **1497** | 0,009 | 600 | 111 |

**Límites de la comparación:**
- El LCP y el peso de Sartorial salen favorecidos porque sus demos no tienen imágenes. No sirven como comparación directa.
- El TBT sí es comparable: mide trabajo de JS, no imágenes, y los dos temas cargan la misma base de scripts de la plataforma Shopify. Aquí el TBT es la suma de la parte de cada tarea larga que pasa de 50 ms, desde el inicio hasta 3 s después de `load`.
- Sartorial no tiene PDP medible hoy (S-01).

### 5.5 Accesibilidad

| Prueba | Contour | Maison | Annex | Sartorial (x3) |
|---|---|---|---|---|
| axe 4.10.2 (WCAG 2.0 a 2.2 AA), inicio | 0 | 0 | 0 | 0 |
| axe, PDP | 0 | 0 | 0 | No medible hoy (0 violaciones en 36 pasadas, AUDIT-FINAL-001) |
| Primer Tab lleva al enlace para saltar al contenido | Sí | No (C-03 desplaza la página) | Sí | Sí |
| Menú móvil: el foco entra, queda atrapado y vuelve | No, No, No | No, No, No | No, No, No | Sí, Sí, Sí |
| Carrito: el foco entra y queda atrapado | Sí, Sí | Sí, Sí | No probado (producto agotado) | Verificado en A360 |
| Carrito: el foco vuelve con Escape | **No** | **No** | No probado | Sí (A360-04 y A360-11) |
| Búsqueda: combobox, listbox y foco al cerrar | Sí | Sí | Sí | Verificado en AUDIT-FINAL-001 |
| Botones sin nombre, ids duplicados, campos sin etiqueta | 0 | 0 | 0 | 0 |
| Scroll horizontal a 390 px | 0 | 0 | 0 | 0 |

---

## 6. Verificación

**Herramientas:**
- Playwright MCP con Chromium 1243, con ventana visible.
- La sesión con contraseña la abrió Johandry a mano en esa ventana; no se leyó ni se guardó ninguna contraseña.
- axe-core 4.10.2 desde cdnjs.
- `PerformanceObserver` para LCP, CLS, paint y longtask.
- Limitación de red y CPU por CDP (`Network.emulateNetworkConditions`, `Emulation.setCPUThrottlingRate`).

**Qué se ejecutó:**
- **`collect.js`:** inicio, colección, PDP, búsqueda y 404 de las 6 tiendas, más métricas de DOM, accesibilidad, peso y fuentes. El resultado está en `metrics-desktop.json`.
- **`interact.js`:** axe, orden de Tab, búsqueda, añadir al carrito, trampa de foco y Escape en la competencia.
- **`shots.js`:** capturas, axe y teclado en las demos propias, y el menú móvil de las 6 tiendas.
- **`perf.js`:** el perfil móvil limitado.
- **Sondas sueltas:** origen del desplazamiento de Maison (interceptando `scrollIntoView`), fuentes del CLS, cálculo del título del footer y posición del enlace para saltar al contenido.

**Qué no demuestra:**
- **No es Lighthouse:** no da la puntuación de Theme Store.
- **CLS variable:** CLS y TBT cambian entre cargas y solo se hicieron 2 por página.
- **Sin PDP ni carrito propios:** no se probaron la PDP ni el carrito de Sartorial porque las demos no tienen productos y Couture siguió con contraseña. Esa parte se apoya en CLAUDE-REPORT-AUDIT-FINAL-001 y CLAUDE-REPORT-A360-001.
- **Sin código de Contour:** no se auditó el código de Contour, solo su tienda en vivo.

**Descartado durante la auditoría:**
- **Enlace para saltar al contenido:** parecía visible sin foco, pero era un efecto de la captura recortada. Medido: `position: fixed`, `y = -90`.
- **Manifiesto de Atelier:** parecía vacío en la captura completa, pero tiene texto; la animación de aparición no se había disparado.

---

## 7. Afirmaciones falsables

1. `/products.json` devuelve 0 productos en sartorial-atelier, sartorial-edition y sartorial-archive, y 25 en contour, maison y annex.
2. `/collections.json` de las 3 demos propias solo lista `frontpage` con `products_count: 0`.
3. Contour, Maison y Annex publican el tema con `schema_name` "Contour" y `schema_version` "4.1.0", con los nombres `contour/main`, `atelier/maison` y `atelier/annex`.
4. El inicio de Atelier muestra el texto "Choose two to four products in the theme editor to build this look.", que sale de `sections/complete-the-look.liquid:280` sin comprobar `design_mode`.
5. A 1440 px, el título del footer de Atelier ("Sartorial Atelier", 75,6 px) se divide en 3 líneas con "Sartori" y "al" separados, por el `overflow-wrap: anywhere` de `assets/base.css:109`.
6. A 390 px, el header de Atelier muestra "Sartorial Ateli…".
7. `grep -c -i atelier` da 12 líneas en `locales/en.default.json` y 12 en `locales/es.json`.
8. En Maison, al cargar el inicio se llama a `scrollIntoView` sobre `BUTTON.tabs__tab` y `scrollY` deja de ser 0 sin interacción. En Contour, Annex y Atelier queda en 0.
9. En las 3 tiendas de la competencia, a 390 px, tras abrir el menú, 20 de 20 Tab dejan el foco fuera del panel `aria-modal`. En las 3 demos propias, 0 de 20.
10. En Contour y Maison, tras añadir al carrito y pulsar Escape, `document.activeElement` es `BODY`.
11. Con el perfil móvil limitado, el TBT del inicio es de 1407 a 1497 ms en las demos propias y de 2856 a 3325 ms en la competencia.
12. El inicio de la competencia carga entre 26 y 28 archivos de `/cdn/shop/t/*/assets/`, entre ellos `gsap.min.js` y `scrolltrigger.min.js`. El de Sartorial carga 2: `base.css` y `theme.js`.
