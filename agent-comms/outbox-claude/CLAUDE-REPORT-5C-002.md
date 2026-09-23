# CLAUDE-REPORT-5C-002: Auditoría en vivo del mega menú, la ficha de producto y los presets

```text
ID: CLAUDE-REPORT-5C-002 (responde a CLAUDE-TASK-5C-002-live-audit)
Estado: ENTREGADO. Sin commit ni push. Ningún archivo del tema modificado en la carpeta de
  Johandry: los tres parches van como diff (harness-5C-002/5C-002-theme.diff) para que Gemini
  decida. Tienda: sin cambios en el admin.
Base: tienda tema-qkqpke0j, código d5a7d62 (HEAD local 2b18ed5, mismo código del tema).
  Temas medidos: Couture #165809488115 (main), Sartorial #166186909939, Edition #166186942707,
  Archive #166187041011. Navegador integrado (Chromium) a 1280 x 800, DPR 1,25; ficha también a
  390 x 844. Laboratorio: arneses 5B y 5C con el Liquid, theme.js y base.css desplegados.
Dictamen: el mega menú CUMPLE en teclado (Tab, Escape, ArrowDown), CLS 0 y render en los 4
  temas. El cierre del sprint queda BLOQUEADO por dos P1, los dos con parche probado:
  P1-A (mío, de 5B-001): en los 4 temas la ficha de producto cae debajo de la galería en
  escritorio; "Add to cart" baja a y≈1764.
  P1-B: con el mega menú abierto, el foco por teclado entra en la página y queda tapado por el
  panel (WCAG 2.2 SC 2.4.11).
Decisión requerida:
  1. Gemini: autorizar el diff 5C-002-theme.diff (3 archivos, +29 -7) o pedirme que lo aplique.
     P1-A es una línea movida; P1-B, 9 líneas en ThemeDisclosure; P2-A, sizes de la tarjeta.
  2. Johandry: sustituir la foto de la tarjeta 1 (hero-campaign-01 es apaisada, 1376 x 768, no
     4:5) por una vertical propia y rellenar los textos de envío y devoluciones en los presets
     (§5, P2-A y P2-B). Es contenido: se hace en el editor, sin código.
  3. Gemini: decidir qué hacer con shopify://shop_images en sections/header-group.json antes
     de empaquetar (regla "cero shopify:// en Git" de 4E-002) (§5, P3-C).
  4. GPT-6 (GPT-TASK-010): repetir la certificación de la ficha después de P1-A; con d5a7d62 el
     diseño de dos columnas no existe en ningún tema.
Resumen en 5 líneas:
  1. Teclado en los 4 temas: 10 paradas en orden de lectura, sin trampa; Escape cierra con
     aria-expanded="false" y devuelve el foco; ArrowDown abre y entra; Home, End y ArrowUp bien.
  2. CLS 0 al abrir y en la carga; tarjetas 240 x 300 (0,800) en los 4; 0 fotos pedidas antes
     de abrir; contraste del panel 12,27 a 18,88; axe 4.10.2: 0 violaciones en la cabecera.
  3. E1 no se puede ver en la tienda (solo Catalog tiene hijos); en laboratorio con el theme.js
     desplegado cierra el hermano por Enter, ArrowDown, ratón y editor de temas.
  4. P1-A: <product-zoom> quedó dentro de la rejilla de la ficha desde a946c3b (5B-001, mío) y
     ocupa la segunda columna. Parche: sacarlo de la rejilla; prueba Z0 nueva falla antes y pasa
     después; 5B 27/27, 5C 13/13 en y es, 5C-002 5/5.
  5. Disciplina UX: la tarjeta 1 se pinta 2,1 veces más grande que la copia elegida (borrosa),
     repite la foto del hero de Sartorial, y las líneas de envío muestran el texto de reserva que
     contradice el acordeón ("costs confirmed at checkout" frente a envío gratis desde $150).
Archivos tocados en la carpeta: ninguno del tema. Nuevos o cambiados en agent-comms:
  este informe; harness-5C-002/ (5C-002-theme.diff, live-probes.js);
  harness-5B-001/zoom5b.spec.mjs (prueba Z0); harness-5C-001/live5c2.spec.mjs (nuevo),
  render5c.mjs (fixtures promo-l y classic sin bloques) y pw.config.mjs (SPEC).
Desviaciones: ninguna. Hallazgos: P1-A, P1-B, P2-A, P2-B, P3-A a P3-C, I-1, I-2 (§5).
Verificación: §7. Lo que no se midió: §8. Afirmaciones falsables: §9.
```

---

## 1. Qué se verificó y dónde

| Comprobación pedida | Dónde | Resultado |
|---|---|---|
| Teclado (Tab, Escape, ArrowDown) | Tienda, 4 temas | Cumple |
| E1 cierra paneles hermanos | Tienda: no observable (un solo desplegable). Laboratorio con theme.js de d5a7d62 | Cumple en laboratorio |
| CLS 0 en tarjetas 4:5 | Tienda, 4 temas | Cumple (0 al abrir y 0 en la carga) |
| Render en los 3 presets (y Couture) | Tienda, 4 temas | Cumple en el menú. La ficha de producto falla en los 4 (P1-A) |
| Bloques nuevos de la ficha | Tienda, 4 temas | Se pintan; textos de reserva (P2-B) |

---

## 2. Medición en vivo por tema (1280 x 800, DPR 1,25)

| | Sartorial | Edition | Archive | Couture (main) |
|---|---|---|---|---|
| Orden de Tab en el panel | 10 paradas, correcto | igual | igual | igual |
| Escape / ArrowDown | OK / OK | OK / OK | OK / OK | OK / OK |
| CLS al abrir / en la carga | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Panel (px) | 0-1265 x 121-562 | igual | igual | igual |
| Tarjetas | 240 x 300 (0,800) | igual | igual | igual |
| Enlaces del panel bajo 44 px | 0 | 0 | 0 | 0 |
| Scroll horizontal | no | no | no | no |
| Fondo / texto del panel | rgb(247,243,234) / rgb(29,27,24) | #fff / #111 | rgb(239,230,217) / rgb(46,36,28) | rgb(247,243,234) / rgb(29,27,24) |
| Contraste | 15,52 | 18,88 | 12,27 | 15,52 |
| Títulos de columna y tarjeta | Libre Baskerville | Assistant | Libre Baskerville | Libre Baskerville |
| Ficha: detalles (x, y) | 20, 1175 | 20, 1175 | 20, 1175 | 20, 1175 |
| Ficha: "Add to cart" (y de página) | 1764 | 1759 | 1769 | 1764 |

Orden de Tab medido (igual en los 4): Catalog → View all Catalog → Outerwear → Knitwear → Tailoring → Accessories → The Autumn Series → The Permanent Collection → New Arrivals → Capsule Wardrobe → Contact. Shift+Tab desde Contact vuelve a Capsule Wardrobe. End va a la última tarjeta; Home y luego ArrowUp vuelven al disparador (medido en Sartorial).

axe-core 4.10.2 sobre `.site-header` con el mega menú abierto (Couture): 0 violaciones, 18 reglas superadas.

Fotos de tarjeta antes de abrir: en Sartorial con caché fría, las dos `<img>` seguían sin cargar (`complete` false, `naturalWidth` 0) y no había petición. En los temas siguientes llegaron de la caché de memoria (`transferSize` 0), así que ahí la ausencia de petición no demuestra nada; la demuestra el primer tema y M2 en laboratorio.

---

## 3. Ficha de producto (qa5a-f04-colour-size)

Bloques nuevos, iguales en los 4 temas:

| Bloque | Lo que se ve | Nota |
|---|---|---|
| inventory_status | "Low stock: 4 left", `aria-live="polite"`, estado low_stock | Correcto |
| shipping_lead_time | "Delivery times and costs confirmed at checkout" | Texto de reserva: `delivery_text` vacío (P2-B) |
| trust_badges | "Returns subject to our store policy" | Texto de reserva: `returns_text` vacío (P2-B) |
| Acordeones | "Composition & care", "Shipping & complimentary returns", resumen de 56 px | Correcto |
| recently_viewed | Oculto, 1 id en `theme:recently-viewed` | Correcto: excluye el producto actual; con uno visto no hay nada que enseñar (I-2) |
| CLS de la ficha | 0 (Sartorial) | |

Rejilla (P1-A), medida en los 4 temas: `grid-template-columns: 766.888px 396.675px` con cuatro hijos: `product-gallery` (949 px), `product-zoom` (0 px), `script` y `variant-selects`. El `<product-zoom>` toma la segunda columna de la primera fila con alto 0 y la ficha pasa a la fila 2, columna 1: x 20, y 1175, debajo de la galería (termina en y 1095). A 390 px (Couture) la rejilla tiene filas `490.975px 0px 949.825px` y el hueco entre galería y ficha es 64 px en vez de 32.

---

## 4. Laboratorio: E1, foco tapado y tarjeta apaisada

`harness-5C-001/live5c2.spec.mjs`, sobre el Liquid y theme.js de d5a7d62 (`site-live`) y con los parches (`site-patch`):

| Prueba | site-live | site-patch |
|---|---|---|
| E1: Enter en Catalog, luego Enter en Journal; ArrowDown en Atelier; ratón; `shopify:block:select` y `deselect` | pasa | pasa |
| 2.4.11: Catalog abierto, Tab hasta el enlace del contenido | falla: Catalog sigue abierto | pasa: panel cerrado, 0 % tapado, el centro del enlace es el enlace |
| 2.4.11: dentro de la cabecera no cambia nada (Tab a Journal deja Catalog abierto, Shift+Tab vuelve al panel) | pasa | pasa |
| Tarjeta apaisada, DPR 1,25 | falla: elige 320 w, necesita 672 | pasa: elige 800 |
| Tarjeta apaisada, DPR 2 | falla: elige 560 w, necesita 1075 | pasa: elige 1100 |

E1 queda verificado solo en laboratorio: en la tienda el main-menu tiene un único enlace con hijos.

---

## 5. Hallazgos

### P1-A. La ficha de producto cae debajo de la galería en escritorio (regresión mía, 5B-001)
- Qué pasa: en los 4 temas, a 1280 px, título, precio, variantes y "Add to cart" aparecen debajo de todas las fotos. El comprador ve 949 px de galería y tiene que bajar hasta y≈1764 para comprar.
- Causa: `sections/main-product.liquid` pinta `{% render 'product-zoom' %}` dentro de `.product-main__layout` (líneas 169-171). `<product-zoom>` es un elemento con `display` distinto de `none`, así que la rejilla le da una celda. Entró en a946c3b ("complete Sprint 5B native accessible zoom"). Mis pruebas 5B medían el visor, no dónde quedaba la ficha, y por eso no lo vieron; las auditorías posteriores tampoco.
- Prueba de que es esto: en laboratorio, antes de 5B (b1125bd) la ficha está en x 858, y 146; con 5B y el zoom activo, en x 20; con el zoom apagado (`pdp-zoom-off.html`), vuelve a su sitio.
- Parche (hunks 1 y 2 del diff): el render sale de la rejilla y va justo después de su `</div>`, dentro de la misma `<section data-section-id>`. `product-zoom.js` busca la sección con `closest('[data-section-id]')`, así que no cambia nada más. Complejidad de main-product: 119 antes y después (máximo 120).
- Prueba nueva Z0 (`harness-5B-001/zoom5b.spec.mjs`): a 1280 px, `<product-zoom>` no es hijo de la rejilla, la ficha empieza a la derecha de la galería y a su misma altura (±1 px), con zoom y sin él; a 390 px, el hueco galería-ficha es el mismo con zoom y sin él. Con d5a7d62 falla (`["product-gallery", "product-zoom", "script", "variant-selects"]`); con el parche, 27/27.

### P1-B. Con el mega menú abierto, el foco queda tapado por el panel (WCAG 2.2 SC 2.4.11)
- Qué pasa: el panel es absoluto dentro de la cabecera fija y cubre de y 121 a y 562 de la ventana. Si quien usa teclado lo abre y sigue con Tab, el foco sale de la cabecera y entra en la página con el panel abierto. Medido en vivo:
  - Sartorial: "Discover the collection" 100 % tapado, "Explore lookbook" 77 %, "[01] New forms" 100 %, "Open Bias-Cut Slip Dress" 53 %.
  - Couture (main): "Silk Twill Square" 100 % tapado; el punto central del enlace devuelve el panel, no el enlace.
- Parche (hunk 3, `assets/theme.js`, ThemeDisclosure): solo en el menú de escritorio, un `focusin` en `document` cierra el desplegable cuando el foco llega a algo fuera de `.site-header`. Dentro de la cabecera no cambia nada: el panel no tapa la cabecera, Tab al siguiente disparador lo deja abierto y Shift+Tab sigue volviendo a él. Por eso M3 de 5C-001 sigue pasando sin tocarla. El cajón móvil no se ve afectado: allí no hay `.desktop-nav`. El listener se registra con el `AbortController` de ThemeElement, así que se retira si la sección se vuelve a pintar en el editor.
- Alternativa descartada: cerrar en `focusout` del propio desplegable, como el ejemplo de la APG. También resuelve 2.4.11, pero cambia el comportamiento aceptado en 5C-001: Tab a Journal cerraría Catalog y Shift+Tab ya no volvería al panel. Si Gemini la prefiere, son 3 líneas y hay que reescribir M3.

### P2-A. Tarjeta 1: foto apaisada en una caja 4:5, borrosa
- Qué pasa: `hero-campaign-01.jpg` mide 1376 x 768 (1,79:1). La caja es 4:5 y la foto la cubre, así que se pinta a 537 x 300 px CSS. Pero `sizes` dice 15rem (240 px): el navegador elige la copia de 320 w y la estira 2,1 veces a DPR 1,25, o la de 560 w, 1,9 veces, a DPR 2. En pantalla se ve blanda. El recorte centrado deja a las dos modelos pequeñas en el centro.
- La tarea afirma "2 imágenes reales de campaña en 4:5": solo la segunda (`capsule-look-01.jpg`, 1856 x 2304) lo es.
- Arreglo de contenido (recomendado): una foto vertical propia para la tarjeta 1. Con 800 px de ancho basta hasta DPR 3.
- Red de seguridad en código (hunks 4 y 5, `snippets/mega-menu.liquid`): si la foto es más ancha que 4:5, `sizes` declara el ancho pintado (`aspect_ratio x 18.75rem`: 33,59rem para esta foto) y `widths` añade 1100. Una foto vertical sigue pidiendo 15rem, igual que antes. Complejidad del snippet: 28 → 29.

### P2-B. Envío y devoluciones: texto de reserva que contradice el acordeón
- En los 4 temas, `shipping_lead_time` y `trust_badges` tienen el texto vacío y muestran la reserva: "Delivery times and costs confirmed at checkout" y "Returns subject to our store policy". Justo debajo, el acordeón dice "Shipping is complimentary on orders over $150" y devoluciones gratuitas. Junto al botón de compra, el mensaje más prudente tapa al más atractivo, y los dos no dicen lo mismo.
- Arreglo: rellenar `delivery_text` y `returns_text` en los tres presets con la misma política del acordeón. Es contenido; el código funciona.

### P3-A. Imágenes repetidas entre el menú y la portada
La tarjeta 1 es la misma foto que el hero de Sartorial, y la tarjeta 2 es el hero de Edition. En Sartorial, que es el preset preferido, el comprador abre Catalog y ve la foto que acaba de ver a pantalla completa. Recomiendo fotos de campaña distintas para el menú en cada preset.

### P3-B. Menú de dos niveles pintado como mega menú
Con el bloque, Catalog abre el mega menú aunque sus 6 enlaces no tengan hijos: salen como 6 títulos de columna en tipografía editorial, en dos filas de tres, sin nada debajo. Funciona y es accesible, pero parece un índice de títulos. Hay dos opciones: dar un tercer nivel al menú de la demo (por ejemplo, Mujer y Hombre con sus colecciones), o que, en un mega menú sin tercer nivel, los hijos salgan como una lista simple. La segunda es un cambio de diseño y la dejo a Gemini.

### P3-C. `shopify://shop_images` en `sections/header-group.json`
d5a7d62 guarda en Git `image_1` y `image_2` como `shopify://shop_images/hero-campaign-01.jpg` y `capsule-look-01.jpg`. Es el único `shopify://` en sections, templates y config, y va contra "Cero shopify:// en Git" (CLAUDE-DIRECTIVE-4E-002, §4). Instalado en otra tienda, el bloque saldría con tarjetas sin foto (el snippet lo tolera: solo título). Ninguna compuerta lo detecta hoy: `grep` en `scripts/` no encuentra `shopify://`. Decide Gemini: quitar el bloque del JSON del repositorio y dejarlo solo en la tienda, o añadir una comprobación al empaquetado.

### I-1. E1 no se puede observar en la tienda
El main-menu tiene un solo enlace con hijos. Queda verificado en laboratorio (§4). Si se quiere ver en vivo, hace falta un segundo enlace con hijos en el menú de la demo.

### I-2. "Recently viewed" oculto
Es el comportamiento esperado: con un solo producto visto no hay nada que enseñar. Para revisarlo, hay que visitar antes otra ficha.

---

## 6. Parches propuestos (no aplicados)

`agent-comms/outbox-claude/harness-5C-002/5C-002-theme.diff`, contra d5a7d62, con finales de línea LF (los tres archivos de la carpeta usan LF):

| Archivo | +/- | md5 antes (d5a7d62) | md5 después | Hallazgo |
|---|---|---|---|---|
| sections/main-product.liquid | +8 -4 | fb7af634fe04… | 7d851c0f418d… | P1-A |
| assets/theme.js | +9 -0 | 9c9023dc6a96… | 7907facd8808… | P1-B |
| snippets/mega-menu.liquid | +12 -3 | 59f31bfae1a4… | 5a24689ff9d0… | P2-A |

Para aplicarlo desde la raíz del repositorio: `git apply --check agent-comms/outbox-claude/harness-5C-002/5C-002-theme.diff` y, si pasa, `git apply` con la misma ruta. Lo comprobé sobre una copia de los tres archivos de d5a7d62: se aplica limpio y el resultado es idéntico byte a byte al árbol que probé. `product-zoom.js` no cambia (11.988 bytes).

---

## 7. Verificación

### 7.1 Tienda viva
- Sondas: `harness-5C-002/live-probes.js` (CLS con `buffered: true`, geometría del panel y de las tarjetas, foco tapado y rejilla de la ficha). Solo leen el DOM.
- Teclado: teclas reales en el navegador integrado; el foco se leyó tras cada tecla.
- Foco tapado: con la pestaña en segundo plano el scroll suave no avanza. Por eso, antes de pulsar Tab, puse `scroll-behavior: auto` en esa página y medí el rectángulo del elemento enfocado ya desplazado contra el del panel. Solo cambia cuándo llega el scroll, no adónde.
- Ficha: `probePDP()` en los 4 temas a 1280 y en Couture a 390.
- Contraste: fórmula de luminancia relativa de WCAG sobre los colores computados.
- Al terminar restauré la emulación de ventana del navegador.

### 7.2 Laboratorio (`agent-comms/outbox-claude/`, Chromium de Playwright)
```text
harness-5B-001  SITE=site-live   zoom5b.spec.mjs    26 passed, 1 failed (Z0)
harness-5B-001  SITE=site-fix    zoom5b.spec.mjs    27 passed      (solo P1-A)
harness-5B-001  SITE=site-patch  zoom5b.spec.mjs    27 passed      (los tres parches)
harness-5C-001  SITE=site-live   mega5c.spec.mjs    13 passed
harness-5C-001  SITE=site-patch  mega5c.spec.mjs    13 passed
harness-5C-001  SITE=site-patch-es mega5c.spec.mjs  13 passed
harness-5C-001  SITE=site-live   SPEC=live5c2.spec.mjs   2 passed, 3 failed (2.4.11 y tarjeta x2)
harness-5C-001  SITE=site-patch  SPEC=live5c2.spec.mjs   5 passed
```
Un cambio en el fixture del arnés 5C: `classic.html` pintaba el `header-group.json` del repositorio y, desde d5a7d62, ese archivo trae el bloque de Catalog, así que M10 fallaba por el fixture y no por el código. Ahora `classic.html` vacía los bloques de forma explícita. `mega-landscape.html` es nuevo: una tarjeta con una foto de 1376 x 768.

Comandos:
```text
cd harness-5B-001
OUT_DIR=site-live  THEME_ROOT=<árbol d5a7d62>          node render5b.mjs
OUT_DIR=site-patch THEME_ROOT=<árbol d5a7d62 + diff>   node render5b.mjs
SITE=site-live CHROMIUM_PATH=... node node_modules/@playwright/test/cli.js test -c pw.config.mjs
cd ../harness-5C-001
OUT_DIR=site-live  THEME_ROOT=<árbol d5a7d62>          node render5c.mjs
OUT_DIR=site-patch THEME_ROOT=<árbol d5a7d62 + diff>   node render5c.mjs
SITE=site-patch SPEC=live5c2.spec.mjs CHROMIUM_PATH=... node node_modules/@playwright/test/cli.js test -c pw.config.mjs
```
El `webServer` de los dos `pw.config.mjs` espera a `site/`: si no existe, hay que arrancar antes `python3 -m http.server 8112` (u 8113) en la carpeta del arnés, o crear `site/`.

### 7.3 Estático, sobre el árbol d5a7d62 con el diff
```text
shopify theme check --path .                          78 files inspected with no offenses found.
node --check assets/theme.js && node --check assets/product-zoom.js   ok
LiquidComplexity (maxComplexity: 1 en una copia)      main-product 119 → 119 | mega-menu 28 → 29 | header 21 → 21
git apply --check 5C-002-theme.diff                   ok; resultado idéntico al árbol probado
```
No ejecuté `gates:sanity` ni `gates:package` en la carpeta de Johandry, por la restricción vigente.

---

## 8. Lo que no se midió
- Safari y Firefox. Todo lo anterior es Chromium.
- El cajón móvil del menú en vivo a 390 px. Lo cubre M6 en laboratorio, y el parche no lo toca.
- La ficha en Sartorial, Edition y Archive a 390 px: medí Couture. El código es el mismo en los cuatro.
- El editor de temas real: E2 se probó con eventos `shopify:block:select` sintéticos.
- El comportamiento de `widths: ..., 1100` en el CDN de Shopify: en laboratorio el filtro `image_tag` es una emulación. Hay que comprobar en la tienda, tras aplicar, que el `srcset` incluye 1100 w para hero-campaign-01, que mide 1376 de ancho.
- axe en Sartorial, Edition y Archive: solo lo pasé en Couture. Los colores de los cuatro están medidos en §2.

---

## 9. Afirmaciones falsables
1. En Couture, Sartorial, Edition y Archive, con d5a7d62, a 1280 x 800, `.product-main__details` de /products/qa5a-f04-colour-size empieza en x 20, y 1175, y `.product-main__layout` tiene como hijos `product-gallery`, `product-zoom`, `script` y `variant-selects`.
2. A 390 px en Couture, `.product-main__layout` tiene filas `490.975px 0px 949.825px` y 64 px entre galería y ficha, con `row-gap` de 32 px.
3. Con el diff aplicado, `<product-zoom>` deja de ser hijo de `.product-main__layout` y Z0 pasa; sin el diff, Z0 falla en su primera aserción.
4. En los 4 temas, el orden de Tab con Catalog abierto es el de §2, Escape deja `aria-expanded="false"` con el foco en Catalog, y ArrowDown desde Catalog enfoca "View all Catalog".
5. En los 4 temas, abrir Catalog no genera entradas `layout-shift` (CLS 0) y las tarjetas miden 240 x 300.
6. En Couture, con Catalog abierto y Tab hasta "Silk Twill Square", el enlace queda 100 % bajo el panel y `elementFromPoint` en su centro devuelve un nodo del panel.
7. Con el diff, `live5c2.spec.mjs` pasa 5/5; sin él, fallan la prueba de 2.4.11 y las dos de la tarjeta apaisada.
8. hero-campaign-01.jpg mide 1376 x 768. Con d5a7d62, a DPR 1,25, la tarjeta 1 elige la copia de 320 w para un ancho pintado de 537 px CSS.
9. `sections/header-group.json` es el único archivo en sections, templates y config que contiene `shopify://`.
10. `shopify theme check` sobre d5a7d62 con el diff: 78 archivos sin ofensas. main-product.liquid sigue en complejidad 119.

---

## 10. Aplicación del diff (2026-09-23, aprobado por Gemini y Johandry)

`git apply agent-comms/outbox-claude/harness-5C-002/5C-002-theme.diff` en la carpeta de Johandry, sin commit ni push. Los tres archivos quedan modificados en el árbol de trabajo:

```text
sections/main-product.liquid   +8 -4   md5 7d851c0f418d…   P1-A
assets/theme.js                +9 -0   md5 7907facd8808…   P1-B
snippets/mega-menu.liquid      +12 -3  md5 5a24689ff9d0…   P2-A
```

Los 79 archivos del tema de la carpeta, comparados por md5 sin CR, son idénticos al árbol del laboratorio. Verificación tras aplicar:

```text
harness-5B-001  zoom5b.spec.mjs   en 27/27 y es 27/27 (Z0 incluida)
harness-5C-001  mega5c.spec.mjs   en 13/13 y es 13/13
harness-5C-001  live5c2.spec.mjs  5/5
node --check assets/theme.js y assets/product-zoom.js      OK (product-zoom.js 11.988 bytes)
shopify theme check (carpeta completa)                     122 files inspected with no offenses found
npm run gates:json | hooks | locales | ledger | syntax     exit 0 los cinco
```

No se ejecutaron `gates:sanity` ni `gates:package` en la carpeta. `sections/main-search.liquid` aparece modificado en `git status` desde antes de esta tarea: solo cambian los finales de línea (CRLF), sin cambios de contenido. No es parte de este diff.
