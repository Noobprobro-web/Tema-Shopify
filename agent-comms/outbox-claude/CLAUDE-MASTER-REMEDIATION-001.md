# CLAUDE-MASTER-REMEDIATION-001: integración de la directiva CLAUDE-REMEDIATION-MASTER-001

```text
ID: CLAUDE-MASTER-REMEDIATION-001
De: Claude (Opus 5.5, líder técnico)
Para: Gemini Flash 3.8 High (arquitecto). Copia: Johandry.
Fecha: 2026-10-16
Directiva: CLAUDE-REMEDIATION-MASTER-001
Base: 3e2a732 (origen sin modificar). Árbol integrado en la nube de Claude, sin commit ni push.
Estado: código completo en 11 de 12 puntos; 1.3 no implementado por recomendación técnica; Gate 5 en tienda pendiente.
Decisión requerida: sí, seis puntos (sección 5).
Resumen en 5 líneas: sección 1.
Archivos tocados: assets/base.css, assets/theme.js, listings/archive/templates/index.json,
  listings/imprint/templates/index.json, listings/sartorial/templates/index.json,
  locales/en.default.json, locales/es.json, locales/en.default.schema.json,
  sections/cart-drawer.liquid, sections/footer.liquid, sections/header.liquid,
  sections/hero-editorial.liquid, sections/main-cart-items.liquid, sections/main-faq.liquid,
  sections/newsletter.liquid, snippets/cart-drawer-recommendations.liquid,
  snippets/localization-selectors.liquid, snippets/product-card.liquid,
  snippets/product-provenance.liquid (19 archivos, +527/-118)
Desviaciones (Nivel 1 o Nivel 2):
  Nivel 2 (implementado, pendiente de ratificación):
    7 ids nuevos de settings: enable_country_selector y enable_language_selector en
    header y footer (4, activos por defecto); cross_sell_price_band, price_band_min y
    price_band_max en cart-drawer (3, banda apagada por defecto).
  Nivel 1: los dos enlaces del mega menú comparten la clave info
    mega_menu_promo.settings.link_info; main-faq reutiliza sections.all.button_url.info;
    se eliminan 12 claves image "" de listings en vez de añadir placeholders.
Hallazgos extra fuera de alcance (con parche listo): sección 7 y extra-H01-archive-preset.diff.
Verificación (comando, resultado y qué demuestra/qué no): sección 6.
Lista de afirmaciones falsables numeradas: sección 8.
```

## 1. Resumen en 5 líneas

1. Los cuatro parches se aplicaron en orden sobre 3e2a732 con `git apply --3way`: A (TEC-01, TEC-02), B (1.1, 1.2, 1.3, TEC-04), C (TEC-03, 1.4, H03) y D (1.5, H01, H02). Los 19 archivos aplicaron limpio, sin conflictos, también en los seis archivos compartidos.
2. Theme Check da 0 ofensas (80 archivos del tema, 89 con listings). node --check, json-validate, dataset-hooks, locale-key-inventory, theme-check-sanity y ledger-verify en verde. Paridad en/es 438/438 sin diferencias de interpolación, 0 claves duplicadas y 0 `shopify://`.
3. Playwright sobre los assets integrados: tec.spec 9/9. La suite completa da 37 pasan y 3 fallan, los mismos 3 de la línea base; uno de ellos contradice TEC-01 por diseño. El arnés del hero reproduce las 22 mediciones con 0 errores JS.
4. El scroll inercial (1.3) no se implementa: rompe el teclado, el foco programático, el scroll-padding y los timelines CSS del motor. Se recomienda descartarlo.
5. Falta Gate 5 en tema-qkqpke0j.myshopify.com y falta ratificar 7 ids nuevos de Nivel 2.

## 2. Estado por punto de la directiva

| Punto | Estado |
|---|---|
| 1.1 Hover sin imagen secundaria | hecho (código completo) |
| 1.2 Doble animación de marquesina | hecho; retirar marquee-drift pendiente de decisión visual |
| 1.3 Scroll inercial | no implementado (motivo en 3.3); pendiente de decisión |
| 1.4 Selectores de localización | hecho; 4 settings nuevos pendientes de decisión (Nivel 2) |
| 1.5 Imágenes de listings | hecho (premisa corregida: ya había placeholder) |
| TEC-01 Congelar +/- y usar key en vez de line | hecho; test 4D-002 pendiente de decisión |
| TEC-02 Anuncio y foco al quitar | hecho |
| TEC-03 tabindex en .form-message | hecho |
| TEC-04 Pausa del video del hero | hecho |
| H01 Procedencia | hecho en el snippet; los claims falsos están en los presets, pendiente de decisión |
| H02 Banda de precio | hecho como ajuste opcional apagado; 3 settings pendientes (Nivel 2) |
| H03 info en settings url | hecho |

## 3. Detalle por punto

Líneas "antes" de 3e2a732; líneas "después" del árbol integrado (las del diff anexo).

### 3.1 Hover de tarjeta (1.1)
Diagnóstico verificado: base.css:1872-1875 ponía la primaria a opacity 0 hubiera o no secundaria; product-card.liquid:144 solo emite la secundaria si existe. Faltaba en la directiva: el zoom scale(1.025) (base.css:1884-1887) no respetaba reduce ni animations "none".
Cambio: product-card.liquid:26-28 calcula `card_has_secondary` una vez, :138 emite `data-has-secondary` en `.product-card__media` y :149 usa la misma variable en la rama de la secundaria. base.css:1872-1876 el opacity 0 exige `[data-has-secondary]`; :1889 y :1895-1896 el zoom queda dentro de `prefers-reduced-motion: no-preference` y `html:not([data-animations='none'])`, 1.02 sin secundaria y 1.025 con ella. theme.js:1165: recently-viewed retira la marca cuando retira la secundaria. Atributo en lugar de `:has()`.
Validación: arnés (apartado E): con anim subtle, tarjeta sin secundaria en opacity 1 y scale 1.0198; con none y reduce, transform none. `[data-variant-media]` sigue mandando. LiquidComplexity de product-card 105 a 108.

### 3.2 Marquesina (1.2)
Diagnóstico verificado: composición en base.css:9323-9336 (la directiva cita 9311-9336), keyframe marquee-drift en :9416-9424 y token --marquee-drift en :84. Uso no citado: `animation-play-state: paused, running` (:3991-3998) existía solo para mantener el drift con la banda pausada, por eso la banda seguía moviéndose con el scroll aunque estuviera pausada.
Cambio: se eliminan token, regla de composición y keyframe. La pausa pasa a `animation-play-state: paused` (base.css:4052-4056); comentario de retirada en :9388-9391. Queda una sola animación, `editorial-marquee` (:4289, :7319).
Validación: en modo full, una sola animación sobre DocumentTimeline; pausada, el transform no cambia tras 300 px de rueda.

### 3.3 Scroll inercial (1.3): no implementado
- Dependencias: AGENTS.md:20 y :70 y docs/decisions.md:103 prohíben dependencias externas; MOTION-002 ya retiró GSAP. Un lerp propio es el mismo mecanismo.
- Accesibilidad: espacio, AvPág, flechas, Inicio y Fin quedan desfasados del foco; el foco programático de diálogos y mensajes se retrasa; se ignora el scroll-padding-block (base.css:8233-8235) del que depende WCAG 2.4.11; Ctrl+F y `#:~:text=` se desincronizan; se duplica la inercia nativa del trackpad; cajón, modales, galería con snap, zoom y búsqueda tendrían que excluirse uno a uno.
- Rendimiento: un rAF por cuadro compite con los handlers (deudas TEC-33 y TEC-15) y desincroniza `animation-timeline: view()` del motor CSS, o mueve el contenido con transform y rompe la cabecera pegada.
- Theme Store revisa teclado, rendimiento y funciones del navegador.

No se puede garantizar penalización 0 en Core Web Vitals. La alternativa nativa ya existe: `scroll-behavior: smooth` en base.css:125 para anclas, anulado con reduce y con "none". La sensación premium la dan las animaciones ligadas al scroll, que no lo secuestran.

### 3.4 Selectores de moneda e idioma (1.4)
Diagnóstico verificado: localization-selectors.liquid:13-19 exige más de un idioma o país, y es correcto (un selector de un solo valor es un control muerto). footer.liquid no incluía el snippet. Corrección: en móvil `.localization-form--header` se oculta bajo 48rem (base.css:6748-6758 en la base), pero la instancia `header-mobile` dentro del cajón del menú (header.liquid:123-125) sí se ve.
Cambio:
- Snippet: parámetros `enable_language`, `enable_country` y `editor_notice` (líneas 5-7, 22, 30, 38-41). Solo `false` apaga; sin parámetro, comportamiento anterior. Con ajuste activo y un solo valor, en `request.design_mode`, aviso `.localization-form__notice` (:109). CSS en base.css:6946-6961, solo visible en el editor.
- Footer: captura en footer.liquid:15-23 y pintado en `.site-footer__utilities` (:125-128), id LocalizationForm-footer.
- Header: header.liquid:124 y :188 pasan los ajustes.
- Schema: header.liquid:243-261 y footer.liquid:203-221 (encabezado y dos checkboxes activos por defecto, con info).
Validación: Theme Check 0 ofensas, locale-key-inventory sin claves sin resolver. Gate 5 pendiente.

### 3.5 Imágenes de listings (1.5)
Diagnóstico verificado: 12 propiedades image "" (3 Archive, 5 Imprint, 4 Sartorial), introducidas por 080402c. Corrección: las cinco secciones ya pintan placeholder SVG de Shopify sin imagen (hero-editorial.liquid:134-137, brand-manifesto.liquid:55-58, lookbook.liquid:59-62, complete-the-look.liquid:125-128, bento-discovery.liquid:49-60 y :83-90).
Cambio: se eliminan las 12 claves "" de listings/*/templates/index.json y las comas colgantes de imprint. Las "" de listings/archive/templates/product.json:42 y :49 son textos con fallback y se quedan. Un preset no puede referenciar fotos de una tienda (scripts/json-validate.mjs:38-43): las fotos reales solo llegan por la tienda demo y la galería del listing.
Validación: Theme Check con listings 89 archivos 0 ofensas; json-validate sin fallos y 0 shop_images; `rg shopify://` vacío.

### 3.6 TEC-01
Diagnóstico verificado: theme.js:3369 (setDrawerBusy) no incluía `[data-quantity-button]`; el stepper (:5565-5592) lanzaba change sin mirar busy; :3104-3106 enviaba `line` desde `data-line="{{ forloop.index }}"` (cart-drawer.liquid:281 y :303).
Cambio: theme.js:2237-2240 estado drawerBusyDepth, busyFocus y pendingRemoval; :2392 y :2424 la clave sale de `closest('[data-cart-item-key]')`; :3108 y :3135 `changeLine(key, quantity)` envía `{ id: key }`; :3165 lineControlAfterRender devuelve el foco al mismo control; :3383-3393 si el foco cayó al body se usa busyFocus; :3466-3494 setDrawerBusy reentrante que incluye los +/- y restaura `wasDisabled` (:3478-3487). cart-drawer.liquid:159 `data-cart-item-key="{{ item.key | escape }}"` y se retira data-line; main-cart-items.liquid:31 añade la misma clave.
Validación: tec.spec 9/9 (POST con id, una ráfaga produce un solo POST, extremos del servidor preservados con repintado y con 422).

### 3.7 TEC-02
Diagnóstico verificado: changeLine no anunciaba y theme.js:3309 mandaba el foco a Cerrar como respaldo. Región viva persistente: `[data-cart-status]` (cart-drawer.liquid:83).
Cambio: item_removed en en.default.json:70 ("Removed {{ title }} from your cart.") y es.json:70 ("Se eliminó {{ title }} de tu carrito."). cart-drawer.liquid:45 `data-removed-template`, :160 `data-cart-item-title`, :67 título con tabindex -1, :134 mensaje de vacío con tabindex -1. theme.js:3178 announceRemoval; :3193 removalFocusTarget: línea siguiente, anterior, mensaje de vacío y por último el título. Nunca Cerrar.
Validación: tec.spec comprueba el anuncio "Removed Beta from your cart. 2 items", los cuatro destinos del foco y que un fallo al quitar no anuncie nada.

### 3.8 TEC-03
Diagnóstico verificado: newsletter.liquid:53 y :58 y footer.liquid:63 y :68 sin tabindex; initFormMessageFocus (theme.js:5787, llamada en :5811) solo enfoca `.form-message[tabindex="-1"]`. Corrección: el tema no tiene templates/customers, login ni registro; usa `<shopify-account>` (header.liquid:191).
Cambio: tabindex="-1" en newsletter.liquid:53 y :58 y footer.liquid:77 y :82.

### 3.9 TEC-04
Diagnóstico verificado: hero-editorial.liquid:97-109 y theme.js:3617-3639. Correcciones: icon.liquid no tiene `pause` ni `play`; la clave real es `sections.homepage.hero.*`.
Cambio: hero-editorial.liquid etiquetas en :61-62, clase hero-editorial--has-video en :65, botón `data-hero-video-toggle` en :115-126. Locales en en.default.json:173-174 y es.json:173-174 ("Pause/Play background video", "Pausar/Reproducir el video de fondo"). base.css:3262-3296 botón 44x44, sobre el velo, foco con halo, y reserva de espacio en cinematic (:3282). theme.js:3710-3793 EditorialHero: autoplayAllowed (:3735) exige no reduce y animations distinto de "none"; userChoice manda sobre el autoplay; syncToggle (:3740). Con reduce o "none" no se cargan fuentes y queda el poster; el botón carga y reproduce.
Validación: arnés del hero: autoplay, pausa, visibilitychange, none y reduce, teclado y sin solapes a 375 y 1280 en las 9 combinaciones x/y, 0 errores JS.

### 3.10 H01 procedencia
Diagnóstico corregido: el snippet ya ocultaba filas vacías y el bloque entero sin filas (:14-22, :30, :33, :45). Los claims falsos vienen de los presets:
- listings/archive/templates/product.json:71-80: pieza única, circa 1994, grade_1 y "museum accession ... Authenticated by master conservator", fijos para todos los productos.
- listings/imprint/templates/product.json:71-80: CORDURA®, YKK® AquaGuard® y "Engineered in Milan" (marcas de terceros), fijos para todos los productos.
Cambio: product-provenance.liquid:51-57 rama `elsif request.design_mode` con aviso al comerciante (products.product.provenance.editor_empty, en.default.json:440 y es.json:440). En tienda, sin datos, no se pinta nada. Parche de Archive en extra-H01-archive-preset.diff, no aplicado.

### 3.11 H02 banda de precio
No hay fuente publicada para 15 a 35 % (Baymard solo pide proporcionalidad). Un filtro duro puede vaciar el cross-sell. Cambio: cart-drawer.liquid:440-466 añade 3 ajustes (banda apagada, 15 y 35 por defecto). Snippet: :52-55 activa la banda solo con ajuste y ancla mayor que 0, :70 recorre 6 fuentes, :127 descarta fuera de banda en las fuentes automáticas y rellena con el resto. El metafield y los bloques del editor no se filtran. Nunca hay menos tarjetas que sin el ajuste.
Validación: render liquidjs 11/11; LiquidComplexity 55 a 69.

### 3.12 H03
Faltaba info en header.liquid:279 y :304 y main-faq.liquid:254. Cambio: header.liquid:299 y :325 (clave link_info en en.default.schema.json:315) y main-faq.liquid:256 (reutiliza sections.all.button_url.info).

## 4. Correcciones a la directiva

1. No hay CRLF: los 19 archivos son LF antes y después.
2. El tema no tiene login ni registro; usa `<shopify-account>` (header.liquid:191).
3. El selector móvil vive en el cajón del menú (header.liquid:123-125); solo la instancia de escritorio se oculta bajo 48rem.
4. Las imágenes de listings ya tenían placeholder en las cinco secciones.
5. Provenance ya ocultaba filas vacías; los claims falsos vienen de listings/archive y listings/imprint product.json:71-80.
6. No hay fuente para 15 a 35 %; se entrega como ajuste opcional apagado.
7. El scroll inercial no se implementa (3.3).
8. icon.liquid no tiene pause ni play; la clave real es sections.homepage.hero.*.
9. La regla de la marquesina está en base.css:9323-9336, no en 9311.

## 5. Decisiones pendientes para Johandry y Gemini

1. Ratificar los 4 ajustes de localización (Nivel 2, activos por defecto; con varios mercados el selector aparece en header y pie).
2. Ratificar los 3 ajustes de banda de precio (Nivel 2, apagados por defecto).
3. Aceptar la retirada de marquee-drift (cambio visual en Full).
4. Aceptar que no se use scroll inercial.
5. Aplicar extra-H01-archive-preset.diff y encargar el equivalente para Imprint, que hoy incluye marcas de terceros.
6. Actualizar o retirar el test 4D-002 "6 clics rapidos en mas cuentan los 6" (harness-4E-002/stress.spec.mjs:306), que contradice TEC-01 y la directiva 4D-002:47.

## 6. Compuertas (resultados reales)

| Compuerta | Resultado |
|---|---|
| node --check assets/*.js | theme.js OK, product-zoom.js OK |
| JSON y claves duplicadas | 33 archivos, 0 inválidos, 0 duplicados |
| Theme Check CLI 4.8.0, copia limpia con .theme-check.yml | 80 archivos, 0 ofensas |
| Theme Check con listings | 89 archivos, 0 ofensas |
| LiquidComplexity (antes entre paréntesis) | main-product 116 (116), product-card 108 (105), cart-drawer-recommendations 69 (55), hero-editorial 33 (32), cart-drawer 41 (41), localization-selectors 22 (13), footer 28 (25), provenance 23 (22). Máximo 116 |
| Paridad en/es | 438/438 claves, 0 diferencias de interpolación |
| json-validate | 0 fallos, 0 shop_images |
| dataset-hooks | 0 contratos rotos |
| locale-key-inventory | 428 claves t: y 500 de schema; 0 sin resolver, 0 huérfanas |
| theme-check-sanity | OK |
| ledger-verify | 0 incoherencias |
| rg shopify:// en el tema y listings | 0 coincidencias |
| Playwright carrito | tec.spec 9/9. Suite: 37 pasan, 3 fallan (R01 "Cart is unavailable", ráfaga de 12 con un GET extra, "6 clics"), los mismos que en la línea base |
| Arnés del hero y tarjetas | 22/22 mediciones, sin solapes, 0 errores JS |

No se corrieron gates:static ni theme package. Lo que esto no demuestra: los arneses usan marcado hecho a mano y endpoints simulados; nada de esto mide lectores de pantalla, CLS ni INP reales.

### 6.1 Pendiente de Gate 5 (tema-qkqpke0j.myshopify.com)
1. Cajón con red lenta: +/- y quitar, POST con id, quitar la línea intermedia, la última y la única, con VoiceOver y NVDA.
2. Página de carrito: data-cart-item-key y updates[] sin regresión.
3. Hero con video real: iOS Safari, reduce motion, animations none, móvil sin video móvil, cinematic a 375 px.
4. Tarjetas con 1 y 2 imágenes en hover y teclado, en subtle, full y none.
5. Marquesina en Full: un solo movimiento y pausa estable.
6. Localización con 1 mercado (aviso solo en el editor) y con 2 o más (header, cajón móvil y pie a 375 px y 62rem), y con los ajustes apagados.
7. Newsletter de sección y pie: foco y anuncio en éxito y error, incluido el caso de dos formularios.
8. Presets Archive, Imprint y Sartorial instalados con placeholders visibles.
9. Procedencia vacía: nada en tienda, aviso en el editor.
10. Banda de precio activa con recomendaciones reales y con la ruta JS.

## 7. Higiene del repo fuera de alcance (no editado)

1. agent-comms/BOARD.md:198 nombra marquee-drift.
2. docs/requirements-ledger.md:38 cita marquee-drift; :54 puede sumar la eliminación anunciada en el cajón como `código completo`. Fila nueva propuesta para WCAG 2.2.2 del video del hero.
3. requirements-ledger.md filas 82 y 83 citan header:127,191 (real 124 y 188); fila 84 cita footer:38-73 (ahora 52-87).
4. agent-comms/outbox-claude/harness-MOTION-002/01-motion-check.mjs:63: quitar 'marquee-drift' de EXPECTED_KEYFRAMES.
5. harness-4D-003, 4E-001 y 4E-002 usan data-line y changeLine(1, ...); adaptarlos a data-cart-item-key.
6. base.css:2481-2482 atribuye los 44x44 a WCAG 2.5.8, que pide 24x24; los 44 vienen de la guía de Shopify.
7. main-placeholder.liquid:76-78 tiene `<div role="alert">` sin tabindex. Parche: `<div class="form-message form-message--error" role="alert" tabindex="-1">`.

## 8. Afirmaciones falsables

1. El origen tiene `git status` vacío con HEAD en 3e2a732.
2. El diff combinado da 19 archivos, +527/-118.
3. Theme Check da 80 archivos con 0 ofensas, y 89 con 0 incluyendo listings.
4. en.default.json y es.json tienen las mismas 438 claves hoja.
5. `rg -n marquee-drift assets/base.css` solo devuelve el comentario de la línea 9388.
6. `rg data-line sections/cart-drawer.liquid` no devuelve nada y theme.js:3135 envía `id: key`.
7. newsletter.liquid:53 y :58 y footer.liquid:77 y :82 tienen tabindex="-1".
8. Ningún setting url de sections/*.liquid queda sin info.
9. La LiquidComplexity máxima es 116.

## Anexo: diff combinado

Aplicar sobre 3e2a732 con `git apply --3way`.

```diff
diff --git a/assets/base.css b/assets/base.css
index 881a74a..4b8354d 100644
--- a/assets/base.css
+++ b/assets/base.css
@@ -81,7 +81,6 @@
   --scroll-unveil-settle: 52vh;
   --unveil-scale: 1.18;
   --parallax-scale: 1.06;
-  --marquee-drift: 16vw;
   --space-3xs: 2px;
   --space-2xs: 4px;
   --space-xs: 8px;
@@ -1869,8 +1868,12 @@ body[data-sticky-cart-visible] {
   transition: opacity var(--motion-base) var(--ease-exit), transform var(--motion-slow) var(--ease-move);
 }
 
-.product-card__media:hover .product-card__image--primary,
-.product-card__media:focus-visible .product-card__image--primary {
+/* La primaria solo se retira si hay una secundaria que la sustituya. La marca
+   data-has-secondary la pone snippets/product-card.liquid (y recently-viewed la retira si
+   quita la secundaria), asi que no depende de :has(). Sin ella, la foto se queda y solo se
+   acerca: un hueco con el fondo de .product-card__media no es un estado de hover. */
+.product-card__media[data-has-secondary]:hover .product-card__image--primary,
+.product-card__media[data-has-secondary]:focus-visible .product-card__image--primary {
   opacity: 0;
   transition: opacity var(--motion-base) var(--ease-exit), transform var(--motion-slow) var(--ease-move);
 }
@@ -1881,9 +1884,18 @@ body[data-sticky-cart-visible] {
   transition: opacity var(--motion-base) var(--ease-enter), transform var(--motion-slow) var(--ease-move);
 }
 
-.product-card__media:hover .product-card__image,
-.product-card__media:focus-visible .product-card__image {
-  transform: scale(1.025);
+/* El acercamiento es movimiento: solo con no-preference y fuera de "none". Con
+   secundaria se conserva el 1.025 del cruce; sin ella, 1.02 sobre la primaria. */
+@media (prefers-reduced-motion: no-preference) {
+  html:not([data-animations='none']) .product-card__media:hover .product-card__image,
+  html:not([data-animations='none']) .product-card__media:focus-visible .product-card__image {
+    transform: scale(1.02);
+  }
+
+  html:not([data-animations='none']) .product-card__media[data-has-secondary]:hover .product-card__image,
+  html:not([data-animations='none']) .product-card__media[data-has-secondary]:focus-visible .product-card__image {
+    transform: scale(1.025);
+  }
 }
 
 .product-card__media-placeholder {
@@ -3243,6 +3255,48 @@ product-card-variants[data-variant-media] .product-card__media:focus-visible .pr
   opacity: 1;
 }
 
+/* TEC-04 (WCAG 2.2.2). Control del video de fondo: 44x44 (--tap-target-min), por encima del
+   velo (.hero-editorial__overlay, z-index 2) y del bloque de texto (z-index 3), en la esquina
+   superior final del medio. En cinematic el texto se superpone al medio y a 375 px mide 18rem:
+   centrado o al final, y con un titular largo, alcanzaria esa esquina. Por eso, solo cuando
+   hay video (hero-editorial--has-video, puesta desde Liquid), el bloque de texto reserva arriba
+   la altura del control y nunca lo pisa. El anillo de foco es el global (:focus-visible) con
+   un halo del fondo del esquema debajo, para que se lea tambien sobre un fotograma oscuro. */
+.hero-editorial__video-toggle {
+  position: absolute;
+  z-index: 4;
+  display: grid;
+  width: var(--tap-target-min);
+  height: var(--tap-target-min);
+  padding: 0;
+  border: var(--border-width) solid var(--color-border-hairline);
+  border-radius: var(--button-radius);
+  inset-block-start: var(--space-md);
+  inset-inline-end: var(--space-md);
+  place-items: center;
+  background: var(--color-background);
+  color: var(--color-foreground);
+  cursor: pointer;
+}
+
+.hero-editorial--cinematic.hero-editorial--has-video .hero-editorial__content {
+  margin-block-start: calc(var(--space-md) + var(--tap-target-min) + var(--space-sm));
+}
+
+.hero-editorial__video-toggle:hover {
+  background: var(--color-surface);
+}
+
+.hero-editorial__video-toggle:focus-visible {
+  outline-offset: 2px;
+  box-shadow: 0 0 0 2px var(--color-background);
+}
+
+.hero-editorial__video-toggle[data-playing] .hero-editorial__play-icon,
+.hero-editorial__video-toggle:not([data-playing]) .hero-editorial__pause-icon {
+  display: none;
+}
+
 .hero-editorial__overlay {
   position: absolute;
   z-index: 2;
@@ -3949,7 +4003,9 @@ marquee-banner {
 }
 
 .marquee-banner__pause-icon,
-.marquee-banner__play-icon {
+.marquee-banner__play-icon,
+.hero-editorial__pause-icon,
+.hero-editorial__play-icon {
   position: relative;
   display: block;
   width: 1rem;
@@ -3958,7 +4014,9 @@ marquee-banner {
 }
 
 .marquee-banner__pause-icon::before,
-.marquee-banner__pause-icon::after {
+.marquee-banner__pause-icon::after,
+.hero-editorial__pause-icon::before,
+.hero-editorial__pause-icon::after {
   position: absolute;
   width: 2px;
   height: 0.75rem;
@@ -3967,15 +4025,18 @@ marquee-banner {
   content: '';
 }
 
-.marquee-banner__pause-icon::before {
+.marquee-banner__pause-icon::before,
+.hero-editorial__pause-icon::before {
   inset-inline-start: 0.25rem;
 }
 
-.marquee-banner__pause-icon::after {
+.marquee-banner__pause-icon::after,
+.hero-editorial__pause-icon::after {
   inset-inline-end: 0.25rem;
 }
 
-.marquee-banner__play-icon::before {
+.marquee-banner__play-icon::before,
+.hero-editorial__play-icon::before {
   position: absolute;
   inset: 0.125rem 0.1875rem;
   border-block: 0.375rem solid transparent;
@@ -3991,11 +4052,8 @@ marquee-banner {
 .marquee-banner:hover .marquee-banner__track,
 .marquee-banner:focus-within .marquee-banner__track,
 .marquee-banner[data-paused] .marquee-banner__track {
-  /* Dos valores para las dos animaciones que el modo full monta sobre el track (B8.2e): se
-     detiene la banda y el desplazamiento ligado al scroll sigue. Pausar el segundo lo
-     congelaria en el punto de scroll de la pausa y al reanudar saltaria de golpe al valor
-     que le toca. Donde solo hay una animacion el segundo valor sobra sin efecto. */
-  animation-play-state: paused, running;
+  /* El track lleva una sola animacion de tiempo (editorial-marquee) en todos los modos. */
+  animation-play-state: paused;
 }
 
 .marquee-banner__toggle:hover,
@@ -6883,6 +6941,25 @@ copy-text {
   appearance: auto;
 }
 
+/* Solo en el editor de temas: explica por que el pie no muestra selectores cuando la tienda
+   tiene un solo idioma o un solo mercado. El comprador nunca lo ve. */
+.localization-form__notice {
+  max-width: 34rem;
+  padding: var(--space-sm) var(--space-md);
+  border: 1px dashed var(--color-border);
+  color: var(--color-foreground-muted);
+  font-size: 0.8125rem;
+  line-height: 1.5;
+}
+
+.localization-form__notice p {
+  margin: 0;
+}
+
+.localization-form__notice p + p {
+  margin-block-start: var(--space-xs);
+}
+
 .site-footer__newsletter {
   max-width: 34rem;
 }
@@ -9308,32 +9385,10 @@ html[data-animations][data-reveal-ready] [data-reveal][data-revealed]:focus-with
       animation-range-end: exit 100%;
     }
 
-    /* e) Banda editorial. Dos animaciones sobre el mismo track y compuestas, no una que
-       sustituya a la otra: el bucle infinito sigue siendo tiempo (es un desfile, no un
-       indicador de progreso) y encima se le suma un desplazamiento ligado al scroll que da
-       profundidad al cruzar la seccion. animation-composition: add en la segunda hace que
-       los dos translateX se sumen en vez de ganar el ultimo declarado.
-
-       El timeline se declara en el __viewport y NO en el __track: el track vive dentro del
-       overflow: hidden del viewport, asi que un view() suyo mediria contra ese recorte.
-
-       var(--marquee-duration, 32s) es el MISMO token y el mismo fallback que usa la regla
-       base de .marquee-banner__track, no un numero duplicado: animation-duration necesita un
-       valor por animacion de la lista y aqui solo se repite la referencia. */
-    html[data-animations='full'] .marquee-banner__viewport {
-      view-timeline-name: --marquee;
-    }
-
-    html[data-animations='full'] .marquee-banner__track {
-      animation-name: editorial-marquee, marquee-drift;
-      animation-duration: var(--marquee-duration, 32s), auto;
-      animation-timing-function: linear, linear;
-      animation-iteration-count: infinite, 1;
-      animation-fill-mode: none, both;
-      animation-composition: replace, add;
-      animation-timeline: auto, --marquee;
-      animation-range: normal, cover 0% cover 100%;
-    }
+    /* e) Banda editorial: sin capa ligada al scroll. El modo full ya no suma marquee-drift
+       (translateX aditivo sobre el bucle): dos movimientos horizontales simultaneos sobre
+       el mismo texto dificultaban la lectura y el bucle pausado seguia moviendose con el
+       scroll. La banda usa en todos los modos la regla base de .marquee-banner__track. */
   }
 }
 
@@ -9413,16 +9468,6 @@ html[data-animations][data-reveal-ready] [data-reveal][data-revealed]:focus-with
   }
 }
 
-@keyframes marquee-drift {
-  from {
-    transform: translateX(0);
-  }
-
-  to {
-    transform: translateX(calc(-1 * var(--marquee-drift)));
-  }
-}
-
 /* ---------- Llave 1: el comerciante apaga el movimiento ---------- */
 html[data-animations='none'] *,
 html[data-animations='none'] *::before,
diff --git a/assets/theme.js b/assets/theme.js
index 1272847..6845c26 100644
--- a/assets/theme.js
+++ b/assets/theme.js
@@ -1162,6 +1162,7 @@
         selected.forEach((card) => {
           if (this.dataset.showSecondaryImage !== 'true') {
             card.querySelectorAll('.product-card__image--secondary').forEach((image) => image.remove());
+            card.querySelectorAll('[data-has-secondary]').forEach((media) => media.removeAttribute('data-has-secondary'));
           }
           if (this.dataset.showVendor !== 'true') {
             card.querySelectorAll('.product-card__vendor').forEach((vendor) => vendor.remove());
@@ -2231,6 +2232,12 @@
       this.requestController = null;
       this.crossSellController = null;
       this.pendingMutations = 0;
+      // TEC-01. Profundidad de setDrawerBusy y control que tenia el foco al entrar en busy:
+      // deshabilitarlo lo desenfoca, y el re-render o la liberacion lo necesitan para volver.
+      this.drawerBusyDepth = 0;
+      this.busyFocus = null;
+      // TEC-02. Destino de foco de una eliminacion en curso (clave quitada y sus vecinas).
+      this.pendingRemoval = null;
       this.syncRevision = 0;
       this.renderedRevision = 0;
       this.syncAfterMutation = false;
@@ -2379,8 +2386,10 @@
 
       const removeButton = event.target.closest('[data-cart-remove]');
       if (!removeButton) return;
+      const removeKey = removeButton.closest('[data-cart-item-key]')?.dataset.cartItemKey;
+      if (!removeKey) return;
 
-      this.changeLine(Number(removeButton.dataset.line), 0).catch((error) => {
+      this.changeLine(removeKey, 0).catch((error) => {
         if (error.name === 'AbortError') return;
         this.showError(error.message);
       });
@@ -2396,7 +2405,8 @@
       }
 
       const quantityInput = event.target.closest('[data-cart-quantity]');
-      if (!quantityInput) return;
+      // TEC-01. Un campo retenido por una mutacion en vuelo no puede lanzar otra.
+      if (!quantityInput || quantityInput.disabled) return;
 
       // An empty or malformed field used to fall through parseInt('') || 0 and silently
       // delete the line. Let the browser report it instead, and keep 0 as the one value
@@ -2406,8 +2416,12 @@
         return;
       }
 
+      // TEC-01. La linea se identifica por su clave, no por su posicion: un indice cambia
+      // en cuanto otra linea desaparece y el POST modificaria un producto distinto.
+      const lineKey = quantityInput.closest('[data-cart-item-key]')?.dataset.cartItemKey;
+      if (!lineKey) return;
       const quantity = Number(quantityInput.value);
-      this.changeLine(Number(quantityInput.dataset.line), quantity).catch((error) => {
+      this.changeLine(lineKey, quantity).catch((error) => {
         // beginMutation() aborts an in-flight section read, so a superseded request must
         // stay silent instead of showing the browser's own English abort text.
         if (error.name === 'AbortError') return;
@@ -3088,8 +3102,24 @@
       }, { signal: controller.signal });
     }
 
-    async changeLine(line, quantity) {
+    // TEC-01. /cart/change.js recibe la clave de la linea (id: item.key), estable aunque
+    // cambie el orden. TEC-02. Con cantidad 0 la eliminacion se anuncia en la region viva y
+    // el foco pasa a la linea siguiente, la anterior, el aviso de carrito vacio o el titulo.
+    async changeLine(key, quantity) {
+      const lineRows = Array.from(this.querySelectorAll('[data-cart-item-key]'));
+      const lineIndex = lineRows.findIndex((row) => row.dataset.cartItemKey === key);
+      const removedRow = lineIndex === -1 ? null : lineRows[lineIndex];
       const revision = this.beginMutation();
+      const removal = quantity === 0 && removedRow
+        ? {
+          key,
+          title: removedRow.dataset.cartItemTitle || '',
+          nextKey: lineRows[lineIndex + 1]?.dataset.cartItemKey || null,
+          previousKey: lineRows[lineIndex - 1]?.dataset.cartItemKey || null,
+        }
+        : null;
+      if (removal) this.pendingRemoval = removal;
+      let applied = false;
       this.clearMessages();
       this.setDrawerBusy(true);
 
@@ -3102,7 +3132,7 @@
             'X-Requested-With': 'XMLHttpRequest',
           },
           body: JSON.stringify({
-            line,
+            id: key,
             quantity,
             sections: this.renderSectionIds(),
             sections_url: `${window.location.pathname}${window.location.search}`,
@@ -3119,13 +3149,64 @@
 
         if (!response.ok) throw new Error(result?.description || result?.message || this.dataset.errorMessage);
 
+        applied = true;
         await this.renderCartResponse(result, revision);
+        if (removal) this.announceRemoval(removal, this.renderedRevision === revision);
       } finally {
+        // Si la eliminacion fallo, nadie consumira su destino de foco. Si se aplico pero su
+        // respuesta quedo adelantada, el destino espera al render que la refleje.
+        if (!applied && this.pendingRemoval === removal) this.pendingRemoval = null;
         this.setDrawerBusy(false);
         this.endMutation();
       }
     }
 
+    // TEC-01. El mismo control (campo, mas, menos o quitar) de la misma linea, por su clave.
+    lineControlAfterRender(control, nextContent) {
+      const key = control?.closest?.('[data-cart-item-key]')?.dataset.cartItemKey;
+      if (!key) return null;
+      const row = Array.from(nextContent.querySelectorAll('[data-cart-item-key]'))
+        .find((candidate) => candidate.dataset.cartItemKey === key);
+      if (!row) return null;
+      const selector = ['[data-cart-quantity]', '[data-cart-remove]'].find((candidate) => control.matches(candidate))
+        || (control.dataset.quantityButton ? `[data-quantity-button="${control.dataset.quantityButton}"]` : null);
+      return selector ? row.querySelector(selector) : null;
+    }
+
+    // TEC-02. La region persistente [data-cart-status] anuncia la linea quitada y el
+    // recuento nuevo. El texto sale de una clave de locale con [title] como marcador.
+    announceRemoval(removal, rendered) {
+      const template = this.dataset.removedTemplate || '';
+      if (!template) return;
+      // El recuento solo es fiable si fue esta respuesta la que se pinto.
+      const count = rendered
+        ? this.querySelector('[data-cart-drawer-count]')?.textContent.trim() || ''
+        : '';
+      const message = template.replace('[title]', removal.title).trim();
+      this.showStatus([message, count].filter(Boolean).join(' '));
+    }
+
+    // TEC-02. Destino del foco tras quitar una linea, buscado en el contenido recien pintado:
+    // la linea siguiente, si no la anterior, si no el aviso de carrito vacio y, en ultimo
+    // caso, el titulo del cajon (los dos con tabindex="-1"). Nunca el boton Cerrar.
+    // Solo actua cuando el HTML nuevo ya no trae la linea quitada, y se consume al usarse.
+    removalFocusTarget(nextContent) {
+      const removal = this.pendingRemoval;
+      if (!removal) return null;
+      const rows = Array.from(nextContent.querySelectorAll('[data-cart-item-key]'));
+      if (rows.some((row) => row.dataset.cartItemKey === removal.key)) return null;
+      this.pendingRemoval = null;
+      const usable = (element) => element && !element.disabled && !element.closest('[hidden]');
+      for (const key of [removal.nextKey, removal.previousKey]) {
+        const row = key ? rows.find((candidate) => candidate.dataset.cartItemKey === key) : null;
+        if (!row) continue;
+        const control = [row.querySelector('.cart-drawer-item__title a[href]'), row.querySelector('[data-cart-remove]')]
+          .find(usable);
+        if (control) return control;
+      }
+      return nextContent.querySelector('[data-cart-empty-message]') || this.querySelector('#CartDrawerTitle');
+    }
+
     // Returns the revision this mutation belongs to. Callers hand it back to
     // renderCartResponse so that a response overtaken by a newer mutation is dropped.
     beginMutation() {
@@ -3297,8 +3378,20 @@
       const nextScroll = nextContent.querySelector('[data-cart-scroll]');
       if (nextScroll && previousScroll) nextScroll.scrollTop = previousScroll;
 
-      if (restoreFocus) {
-        const restored = active?.id ? nextContent.querySelector(`#${CSS.escape(active.id)}`) : null;
+      // TEC-01. El control pulsado se deshabilita mientras dura la mutacion y el navegador
+      // manda el foco al body; el que tenia el foco al entrar en busy es el que se restaura.
+      const focusSource = active === document.body && this.busyFocus && currentContent.contains(this.busyFocus)
+        ? this.busyFocus
+        : active;
+      const removalTarget = restoreFocus ? this.removalFocusTarget(nextContent) : null;
+
+      if (removalTarget) {
+        removalTarget.focus();
+      } else if (restoreFocus) {
+        // Los ids de las lineas son posicionales: se busca primero el mismo control dentro de
+        // la misma linea (por su clave) y el id queda como respaldo.
+        const restored = this.lineControlAfterRender(focusSource, nextContent)
+          || (focusSource?.id ? nextContent.querySelector(`#${CSS.escape(focusSource.id)}`) : null);
         // El control puede volver deshabilitado desde el servidor: el boton mas se apaga
         // cuando la linea toca el tope de inventario, que el cliente no conoce. Un focus()
         // sobre un control deshabilitado no hace nada y el foco caeria al body, asi que se
@@ -3306,7 +3399,7 @@
         const target = restored && !restored.disabled
           ? restored
           : restored?.closest('[data-quantity-stepper]')?.querySelector('[data-quantity-button]:not([disabled])');
-        (target || this.crossSellFocusAfterRender(active, nextContent) || this.querySelector('[data-cart-drawer-close]'))?.focus();
+        (target || this.crossSellFocusAfterRender(focusSource, nextContent) || this.querySelector('[data-cart-drawer-close]'))?.focus();
       }
       this.dataset.itemCount = nextDrawer.dataset.itemCount;
       this.dataset.cartCountLabel = nextDrawer.dataset.cartCountLabel;
@@ -3364,9 +3457,23 @@
       if (!busy) delete button.dataset.wasDisabled;
     }
 
+    // TEC-01. Los +/- y el campo de cantidad quedan inactivos mientras dura la mutacion: un
+    // segundo clic ya no lanza un POST en paralelo que Shopify podria aplicar en otro orden.
+    // Al liberar, cada control recupera su estado previo (wasDisabled) y no se fuerza a
+    // activo, asi el disabled de los extremos que puso el servidor no se pierde. Si la
+    // respuesta ya repinto las lineas, los controles nuevos llegan con el estado del
+    // servidor y no tienen nada que restaurar. Es reentrante: solo la ultima salida libera.
     setDrawerBusy(busy) {
+      this.drawerBusyDepth = Math.max(0, this.drawerBusyDepth + (busy ? 1 : -1));
+      if (!busy && this.drawerBusyDepth > 0) return;
+
       this.panel.setAttribute('aria-busy', String(busy));
-      this.querySelectorAll('[data-cart-quantity], [data-cart-remove], [data-cross-sell-add], [data-cross-sell-expand], [data-cross-sell-cancel]').forEach((control) => {
+      if (busy) {
+        // Una mutacion anidada tambien deshabilita los controles que pinto la anterior.
+        const active = document.activeElement;
+        if (active && active !== document.body && this.panel.contains(active)) this.busyFocus = active;
+      }
+      this.querySelectorAll('[data-cart-quantity], [data-quantity-button], [data-cart-remove], [data-cross-sell-add], [data-cross-sell-expand], [data-cross-sell-cancel]').forEach((control) => {
         if (busy) {
           if (control.dataset.wasDisabled === undefined) {
             control.dataset.wasDisabled = String(control.disabled);
@@ -3379,6 +3486,18 @@
         control.disabled = control.dataset.wasDisabled === 'true';
         delete control.dataset.wasDisabled;
       });
+      if (busy) return;
+
+      // Sin re-render (error o respuesta adelantada) el control sigue en el DOM pero perdio
+      // el foco al deshabilitarse: vuelve a el, o a su hermano utilizable del stepper.
+      const previousFocus = this.busyFocus;
+      this.busyFocus = null;
+      const current = document.activeElement;
+      if (!this.isOpen || !previousFocus?.isConnected || (current && current !== document.body)) return;
+      const target = previousFocus.disabled
+        ? previousFocus.closest('[data-quantity-stepper]')?.querySelector('[data-quantity-button]:not([disabled])')
+        : previousFocus;
+      target?.focus();
     }
 
     setCrossSellBusy(button, busy) {
@@ -3584,20 +3703,48 @@
     }
   }
 
+  // TEC-04 (WCAG 2.2.2). El video solo arranca solo si el visitante no pidio reducir
+  // movimiento y el comerciante no apago las animaciones (data-animations="none"). En los dos
+  // casos se queda el poster y el boton permite reproducirlo a mano. userChoice guarda la
+  // ultima orden explicita ('play' o 'pause'), que manda sobre el arranque automatico.
   class EditorialHero extends ThemeElement {
     connectedCallback() {
       this.startListening();
       this.video = this.querySelector('[data-editorial-hero-video]');
       if (!this.video) return;
 
+      this.toggle = this.querySelector('[data-hero-video-toggle]');
+      this.userChoice = null;
       this.mobileQuery = window.matchMedia('(max-width: 47.99rem)');
       this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
       this.listen(this.mobileQuery, 'change', () => this.syncPlayback());
       this.listen(this.reducedMotionQuery, 'change', () => this.syncPlayback());
       this.listen(document, 'visibilitychange', () => this.syncPlayback());
+      this.listen(this.video, 'play', () => this.syncToggle());
+      this.listen(this.video, 'pause', () => this.syncToggle());
+      if (this.toggle) {
+        this.listen(this.toggle, 'click', () => {
+          this.userChoice = this.video.paused ? 'play' : 'pause';
+          this.syncPlayback();
+        });
+      }
+      this.syncToggle();
       this.syncPlayback();
     }
 
+    get autoplayAllowed() {
+      return !this.reducedMotionQuery.matches
+        && document.documentElement.dataset.animations !== 'none';
+    }
+
+    syncToggle() {
+      if (!this.toggle) return;
+      const playing = !this.video.paused;
+      const label = playing ? this.dataset.pauseLabel : this.dataset.playLabel;
+      this.toggle.toggleAttribute('data-playing', playing);
+      if (label) this.toggle.setAttribute('aria-label', label);
+    }
+
     disconnectedCallback() {
       this.video?.pause();
       this.removeAttribute('data-video-active');
@@ -3619,13 +3766,19 @@
 
       const mobilePlaybackAllowed = !this.mobileQuery.matches
         || this.dataset.enableVideoMobile === 'true';
+      const wantsPlay = this.userChoice === 'play'
+        || (this.userChoice === null && this.autoplayAllowed);
       const shouldPlay = mobilePlaybackAllowed
-        && !this.reducedMotionQuery.matches
+        && wantsPlay
         && document.visibilityState !== 'hidden';
 
+      // Sin video posible en este ancho no hay nada que controlar.
+      if (this.toggle) this.toggle.hidden = !mobilePlaybackAllowed;
+
       if (!shouldPlay) {
         this.video.pause();
-        this.removeAttribute('data-video-active');
+        // Pausado conserva el fotograma ya visto; sin video en este ancho vuelve el poster.
+        if (!mobilePlaybackAllowed) this.removeAttribute('data-video-active');
         return;
       }
 
@@ -5557,7 +5710,15 @@
 
     stepper.querySelectorAll('[data-quantity-button]').forEach((button) => {
       const direction = button.dataset.quantityButton === 'increase' ? 1 : -1;
-      button.disabled = nextQuantity(input, direction) === value;
+      const atLimit = nextQuantity(input, direction) === value;
+      // TEC-01. Mientras el cajon retiene el boton por una mutacion (wasDisabled), el limite
+      // se guarda para cuando lo libere y el boton sigue inactivo: el 'change' que lanza la
+      // propia mutacion no puede reactivarlo a mitad de vuelo.
+      if (button.dataset.wasDisabled !== undefined) {
+        button.dataset.wasDisabled = String(atLimit);
+        return;
+      }
+      button.disabled = atLimit;
     });
   };
 
diff --git a/listings/archive/templates/index.json b/listings/archive/templates/index.json
index 4e099af..8ad0d11 100644
--- a/listings/archive/templates/index.json
+++ b/listings/archive/templates/index.json
@@ -9,7 +9,6 @@
         "height_desktop": 85,
         "height_mobile": 75,
         "media_type": "image",
-        "image_desktop": "",
         "enable_video_mobile": false,
         "overlay_style": "scrim",
         "overlay_opacity": 70,
@@ -44,7 +43,6 @@
         "button_label": "Read curatorial notes",
         "button_url": "/collections/permanent-archive",
         "media_label": "PLATE II / CONSERVATION LAB",
-        "image": "",
         "use_surface_background": true,
         "color_scheme": "scheme-3"
       }
@@ -92,7 +90,6 @@
         "heading": "Three objects from the archive record",
         "description": "<p>Each piece is examined under raking light, stabilized by our conservationist, and released in small curated entries.</p>",
         "caption": "Garment study room photographed under raking light.",
-        "image_desktop": "",
         "color_scheme": "scheme-1"
       }
     },
diff --git a/listings/imprint/templates/index.json b/listings/imprint/templates/index.json
index 6a23a5b..56ac845 100644
--- a/listings/imprint/templates/index.json
+++ b/listings/imprint/templates/index.json
@@ -9,7 +9,6 @@
         "height_desktop": 80,
         "height_mobile": 65,
         "media_type": "image",
-        "image_desktop": "",
         "overlay_style": "none",
         "overlay_opacity": 0,
         "content_position_x": "start",
@@ -50,8 +49,7 @@
             "collection": "desk-and-study",
             "eyebrow": "[01] MEMBRANE TELEMETRY",
             "heading": "Aerospace grade EDC systems",
-            "link": "/collections/desk-and-study",
-            "image": ""
+            "link": "/collections/desk-and-study"
           }
         },
         "product1": {
@@ -73,8 +71,7 @@
             "link": "/collections/leather-goods",
             "eyebrow": "[04] BLUEPRINT ANALYSIS",
             "heading": "Calibrated for extreme endurance",
-            "body": "<p>Stress-tested 500D CORDURA nylon, weatherproof YKK AquaGuard closures, and laser-machined anodized hardware.</p>",
-            "image": ""
+            "body": "<p>Stress-tested 500D CORDURA nylon, weatherproof YKK AquaGuard closures, and laser-machined anodized hardware.</p>"
           }
         }
       },
@@ -146,7 +143,6 @@
         "heading": "The Complete Utility Rig",
         "description": "<p>A modular rig for daily carry, field telemetry and technical desk deployment.</p>",
         "caption": "A modular arrangement for daily work.",
-        "image_desktop": "",
         "color_scheme": "scheme-1"
       }
     },
@@ -166,7 +162,6 @@
         "button_label": "Inspect collection",
         "button_url": "/collections/daily-objects",
         "media_label": "TECHNICAL REPORT / 01",
-        "image": "",
         "use_surface_background": false,
         "color_scheme": "scheme-3"
       }
diff --git a/listings/sartorial/templates/index.json b/listings/sartorial/templates/index.json
index e2be159..6ec5513 100644
--- a/listings/sartorial/templates/index.json
+++ b/listings/sartorial/templates/index.json
@@ -9,7 +9,6 @@
         "height_desktop": 85,
         "height_mobile": 70,
         "media_type": "image",
-        "image_desktop": "",
         "overlay_style": "gradient_content",
         "overlay_opacity": 40,
         "content_position_x": "start",
@@ -71,7 +70,6 @@
         "heading": "Silhouettes in Haute Couture Motion",
         "description": "<p>Observe the architectural drape, proportion and movement from the runway presentation.</p>",
         "caption": "Haute couture silhouettes photographed in natural salon light.",
-        "image_desktop": "",
         "color_scheme": "scheme-1"
       }
     },
@@ -109,7 +107,6 @@
         "heading": "Complete the Haute Couture Ensemble",
         "description": "<p>Select the full tailored composition: the double-breasted jacket, the silk blouse, and the pleated trouser.</p>",
         "caption": "Bespoke tailoring composition photographed in salon light.",
-        "image_desktop": "",
         "color_scheme": "scheme-1"
       }
     },
@@ -129,7 +126,6 @@
         "button_label": "Explore tailoring",
         "button_url": "/collections/tailoring",
         "media_label": "ATELIER ARCHIVE / STUDY 07",
-        "image": "",
         "use_surface_background": true,
         "color_scheme": "scheme-3"
       }
diff --git a/locales/en.default.json b/locales/en.default.json
index e2732cd..8bed036 100644
--- a/locales/en.default.json
+++ b/locales/en.default.json
@@ -34,7 +34,9 @@
       "currency": "Currency",
       "current_language": "Current language: {{ language }}",
       "language": "Language",
-      "update": "Update preferences"
+      "update": "Update preferences",
+      "editor_notice_language": "Theme editor only: the language selector is hidden because the store has one published language. Publish another language to show it.",
+      "editor_notice_country": "Theme editor only: the currency selector is hidden because the store sells to one country or region. Add a market in Shopify Markets to show it."
     }
   },
   "sections": {
@@ -65,6 +67,7 @@
       "increase_quantity": "Increase quantity for {{ title }}",
       "remove": "Remove",
       "remove_item": "Remove {{ title }}",
+      "item_removed": "Removed {{ title }} from your cart.",
       "discount": "Discount",
       "subtotal": "Subtotal",
       "taxes_included": "Taxes included.",
@@ -166,7 +169,9 @@
     },
     "homepage": {
       "hero": {
-        "region_label": "Featured editorial campaign"
+        "region_label": "Featured editorial campaign",
+        "pause_video": "Pause background video",
+        "play_video": "Play background video"
       },
       "curated": {
         "region_label": "Curated collections",
@@ -431,7 +436,8 @@
         "grade_2": "Grade II · Light wear",
         "grade_3": "Grade III · Visible wear",
         "grade_4": "Grade IV · Significant wear",
-        "grade_5": "Grade V · Fragile / study piece"
+        "grade_5": "Grade V · Fragile / study piece",
+        "editor_empty": "Add a circa year, condition grade or provenance notes to show this block. It stays hidden in the store until then."
       },
       "media_gallery": "Product media gallery",
       "media_thumbnails": "Product media thumbnails",
diff --git a/locales/en.default.schema.json b/locales/en.default.schema.json
index 02f4d92..2a628d9 100644
--- a/locales/en.default.schema.json
+++ b/locales/en.default.schema.json
@@ -242,6 +242,17 @@
         "options__3": {
           "label": "Four per row"
         }
+      },
+      "localization": {
+        "content": "Country and language selectors"
+      },
+      "enable_country_selector": {
+        "label": "Show country/region selector",
+        "info": "Lets customers switch currency. Appears only when the store sells to two or more countries or regions in Shopify Markets."
+      },
+      "enable_language_selector": {
+        "label": "Show language selector",
+        "info": "Appears only when the store has two or more published languages."
       }
     },
     "header": {
@@ -300,7 +311,8 @@
             },
             "link_2": {
               "label": "Link"
-            }
+            },
+            "link_info": "Choose a store page or paste the full HTTPS address. Without a link, the card still shows but cannot be clicked."
           }
         }
       }
@@ -825,6 +837,16 @@
         "cross_sell_collection": {
           "label": "Collection to suggest from",
           "info": "Fills remaining spaces after eligible product-specific selections, Shopify recommendations, and products selected below. Only available products outside the cart are shown."
+        },
+        "cross_sell_price_band": {
+          "label": "Prefer suggestions in a price range",
+          "info": "Applies to Shopify recommendations and the collection. Suggestions priced within the range below, as a share of the most expensive item in the cart, are shown first. Others still fill remaining spaces. Product-specific selections and products selected below are not filtered."
+        },
+        "price_band_min": {
+          "label": "Minimum price share"
+        },
+        "price_band_max": {
+          "label": "Maximum price share"
         }
       },
       "blocks": {
diff --git a/locales/es.json b/locales/es.json
index 3af54cd..2ec4875 100644
--- a/locales/es.json
+++ b/locales/es.json
@@ -34,7 +34,9 @@
       "currency": "Moneda",
       "current_language": "Idioma actual: {{ language }}",
       "language": "Idioma",
-      "update": "Actualizar preferencias"
+      "update": "Actualizar preferencias",
+      "editor_notice_language": "Solo en el editor de temas: el selector de idioma está oculto porque la tienda tiene un único idioma publicado. Publica otro idioma para mostrarlo.",
+      "editor_notice_country": "Solo en el editor de temas: el selector de moneda está oculto porque la tienda vende a un único país o región. Añade un mercado en Shopify Markets para mostrarlo."
     }
   },
   "sections": {
@@ -65,6 +67,7 @@
       "increase_quantity": "Aumentar la cantidad de {{ title }}",
       "remove": "Eliminar",
       "remove_item": "Eliminar {{ title }}",
+      "item_removed": "Se eliminó {{ title }} de tu carrito.",
       "discount": "Descuento",
       "subtotal": "Subtotal",
       "taxes_included": "Impuestos incluidos.",
@@ -166,7 +169,9 @@
     },
     "homepage": {
       "hero": {
-        "region_label": "Campaña editorial destacada"
+        "region_label": "Campaña editorial destacada",
+        "pause_video": "Pausar el video de fondo",
+        "play_video": "Reproducir el video de fondo"
       },
       "curated": {
         "region_label": "Colecciones seleccionadas",
@@ -431,7 +436,8 @@
         "grade_2": "Grado II · Desgaste leve",
         "grade_3": "Grado III · Desgaste visible",
         "grade_4": "Grado IV · Desgaste significativo",
-        "grade_5": "Grado V · Frágil / pieza de estudio"
+        "grade_5": "Grado V · Frágil / pieza de estudio",
+        "editor_empty": "Añade un año aproximado, un grado de estado o notas de procedencia para mostrar este bloque. Hasta entonces no aparece en la tienda."
       },
       "media_gallery": "Galería de imágenes del producto",
       "media_thumbnails": "Miniaturas del producto",
diff --git a/sections/cart-drawer.liquid b/sections/cart-drawer.liquid
index 9539954..1ed53ba 100644
--- a/sections/cart-drawer.liquid
+++ b/sections/cart-drawer.liquid
@@ -42,6 +42,7 @@
   data-cart-count-label="{{ 'sections.header.cart_count' | t: count: cart.item_count | escape_once }}"
   data-error-message="{{ 'sections.cart.error' | t | escape }}"
   data-added-message="{{ 'sections.cart.added' | t | escape }}"
+  data-removed-template="{{ 'sections.cart.item_removed' | t: title: '[title]' | escape_once }}"
   data-add-failed-message="{{ 'sections.cart.add_failed' | t | escape_once }}"
   data-cart-update-url="{{ routes.cart_update_url }}.js"
   data-recommendations-url="{{ routes.product_recommendations_url }}"
@@ -63,7 +64,7 @@
       <header class="cart-drawer__header">
         <div>
           <p class="eyebrow" data-cart-drawer-count>{{ 'sections.cart.item_count' | t: count: cart.item_count }}</p>
-          <h2 id="CartDrawerTitle" class="cart-drawer__title">{{ 'sections.cart.title' | t }}</h2>
+          <h2 id="CartDrawerTitle" class="cart-drawer__title" tabindex="-1">{{ 'sections.cart.title' | t }}</h2>
         </div>
         <button
           class="icon-button"
@@ -130,7 +131,7 @@
 
         {%- if cart.empty? -%}
           <div class="cart-drawer__empty flow">
-            <p>{{ 'sections.cart.empty' | t }}</p>
+            <p tabindex="-1" data-cart-empty-message>{{ 'sections.cart.empty' | t }}</p>
             <a class="button" href="{{ routes.all_products_collection_url }}">
               {{- 'sections.cart.continue_shopping' | t -}}
             </a>
@@ -155,7 +156,8 @@
                 <div
                   class="cart-drawer-item"
                   role="listitem"
-                  data-cart-item-key="{{ item.key }}"
+                  data-cart-item-key="{{ item.key | escape }}"
+                  data-cart-item-title="{{ item.title | escape }}"
                   style="--item-index: {{ forloop.index0 }};"
                 >
                   <a class="cart-drawer-item__media" href="{{ item.url }}" tabindex="-1" aria-hidden="true">
@@ -278,7 +280,6 @@
                         required
                         data-quantity-input
                         data-cart-quantity
-                        data-line="{{ forloop.index }}"
                       >
                       <button
                         id="DrawerQuantityPlus-{{ forloop.index }}"
@@ -300,7 +301,6 @@
                     type="button"
                     aria-label="{{ 'sections.cart.remove_item' | t: title: item.title | escape_once }}"
                     data-cart-remove
-                    data-line="{{ forloop.index }}"
                   >
                     {% render 'icon', name: 'close', size: 18 %}
                   </button>
@@ -436,6 +436,33 @@
       "id": "cross_sell_collection",
       "label": "t:sections.cart_drawer.settings.cross_sell_collection.label",
       "info": "t:sections.cart_drawer.settings.cross_sell_collection.info"
+    },
+    {
+      "type": "checkbox",
+      "id": "cross_sell_price_band",
+      "label": "t:sections.cart_drawer.settings.cross_sell_price_band.label",
+      "info": "t:sections.cart_drawer.settings.cross_sell_price_band.info",
+      "default": false
+    },
+    {
+      "type": "range",
+      "id": "price_band_min",
+      "min": 0,
+      "max": 100,
+      "step": 5,
+      "unit": "%",
+      "label": "t:sections.cart_drawer.settings.price_band_min.label",
+      "default": 15
+    },
+    {
+      "type": "range",
+      "id": "price_band_max",
+      "min": 5,
+      "max": 150,
+      "step": 5,
+      "unit": "%",
+      "label": "t:sections.cart_drawer.settings.price_band_max.label",
+      "default": 35
     }
   ],
   "blocks": [
diff --git a/sections/footer.liquid b/sections/footer.liquid
index c545377..d771461 100644
--- a/sections/footer.liquid
+++ b/sections/footer.liquid
@@ -8,6 +8,20 @@
   endif
 -%}
 
+{%- comment -%}
+  Selectores de idioma y moneda al pie, alcanzables en cualquier ancho. Solo se pintan con
+  2 o mas valores; en el editor, sin mercados o idiomas, queda el aviso para el comerciante.
+{%- endcomment -%}
+{%- capture footer_localization -%}
+  {%- render 'localization-selectors',
+    context: 'footer',
+    enable_country: section.settings.enable_country_selector,
+    enable_language: section.settings.enable_language_selector,
+    editor_notice: true
+  -%}
+{%- endcapture -%}
+{%- assign footer_localization = footer_localization | strip -%}
+
 <footer class="site-footer color-{{ color_scheme_id }}" data-section-id="{{ section.id }}">
   <div class="container site-footer__grid">
     <div class="site-footer__brand flow">
@@ -60,12 +74,12 @@
           </div>
 
           {%- if form.posted_successfully? -%}
-            <p class="form-message form-message--success" role="status">
+            <p class="form-message form-message--success" role="status" tabindex="-1">
               {{- 'newsletter.success' | t -}}
             </p>
           {%- endif -%}
           {%- if form.errors -%}
-            <div id="FooterNewsletterError" class="form-message form-message--error" role="alert">
+            <div id="FooterNewsletterError" class="form-message form-message--error" role="alert" tabindex="-1">
               <p>{{ 'newsletter.error_heading' | t }}</p>
               {{ form.errors | default_errors }}
             </div>
@@ -108,16 +122,21 @@
     {%- endif -%}
   </div>
 
-  {%- if shop.enabled_payment_types.size > 0 -%}
+  {%- if footer_localization != blank or shop.enabled_payment_types.size > 0 -%}
     <div class="container site-footer__utilities">
-      <div class="site-footer__payments">
-        <span class="visually-hidden">{{ 'sections.footer.payment_methods' | t }}</span>
-        <ul class="site-footer__payment-list unstyled-list" role="list">
-          {%- for type in shop.enabled_payment_types -%}
-            <li class="site-footer__payment-item">{{ type | payment_type_svg_tag }}</li>
-          {%- endfor -%}
-        </ul>
-      </div>
+      {%- if footer_localization != blank -%}
+        <div class="site-footer__localization">{{ footer_localization }}</div>
+      {%- endif -%}
+      {%- if shop.enabled_payment_types.size > 0 -%}
+        <div class="site-footer__payments">
+          <span class="visually-hidden">{{ 'sections.footer.payment_methods' | t }}</span>
+          <ul class="site-footer__payment-list unstyled-list" role="list">
+            {%- for type in shop.enabled_payment_types -%}
+              <li class="site-footer__payment-item">{{ type | payment_type_svg_tag }}</li>
+            {%- endfor -%}
+          </ul>
+        </div>
+      {%- endif -%}
     </div>
   {%- endif -%}
 
@@ -181,6 +200,24 @@
       "type": "textarea",
       "id": "newsletter_text",
       "label": "t:sections.footer.settings.newsletter_text.label"
+    },
+    {
+      "type": "header",
+      "content": "t:sections.all.localization.content"
+    },
+    {
+      "type": "checkbox",
+      "id": "enable_country_selector",
+      "label": "t:sections.all.enable_country_selector.label",
+      "info": "t:sections.all.enable_country_selector.info",
+      "default": true
+    },
+    {
+      "type": "checkbox",
+      "id": "enable_language_selector",
+      "label": "t:sections.all.enable_language_selector.label",
+      "info": "t:sections.all.enable_language_selector.info",
+      "default": true
     }
   ]
 }
diff --git a/sections/header.liquid b/sections/header.liquid
index fa8b528..8344011 100644
--- a/sections/header.liquid
+++ b/sections/header.liquid
@@ -121,7 +121,7 @@
           {%- endif -%}
 
           <div class="mobile-nav__localization">
-            {% render 'localization-selectors', context: 'header-mobile' %}
+            {% render 'localization-selectors', context: 'header-mobile', enable_country: section.settings.enable_country_selector, enable_language: section.settings.enable_language_selector %}
           </div>
          </div>
       </div>
@@ -185,7 +185,7 @@
 
       {% render 'predictive-search', section: section %}
 
-      {% render 'localization-selectors', context: 'header' %}
+      {% render 'localization-selectors', context: 'header', enable_country: section.settings.enable_country_selector, enable_language: section.settings.enable_language_selector %}
 
       {%- if shop.customer_accounts_enabled -%}
         <shopify-account class="site-header__account" menu="{{ section.settings.customer_account_menu }}"></shopify-account>
@@ -240,6 +240,24 @@
       "id": "customer_account_menu",
       "label": "t:sections.header.settings.customer_account_menu.label",
       "default": "customer-account-main-menu"
+    },
+    {
+      "type": "header",
+      "content": "t:sections.all.localization.content"
+    },
+    {
+      "type": "checkbox",
+      "id": "enable_country_selector",
+      "label": "t:sections.all.enable_country_selector.label",
+      "info": "t:sections.all.enable_country_selector.info",
+      "default": true
+    },
+    {
+      "type": "checkbox",
+      "id": "enable_language_selector",
+      "label": "t:sections.all.enable_language_selector.label",
+      "info": "t:sections.all.enable_language_selector.info",
+      "default": true
     }
   ],
   "blocks": [
@@ -277,7 +295,8 @@
         {
           "type": "url",
           "id": "link_1",
-          "label": "t:sections.header.blocks.mega_menu_promo.settings.link_1.label"
+          "label": "t:sections.header.blocks.mega_menu_promo.settings.link_1.label",
+          "info": "t:sections.header.blocks.mega_menu_promo.settings.link_info"
         },
         {
           "type": "header",
@@ -302,7 +321,8 @@
         {
           "type": "url",
           "id": "link_2",
-          "label": "t:sections.header.blocks.mega_menu_promo.settings.link_2.label"
+          "label": "t:sections.header.blocks.mega_menu_promo.settings.link_2.label",
+          "info": "t:sections.header.blocks.mega_menu_promo.settings.link_info"
         }
       ]
     }
diff --git a/sections/hero-editorial.liquid b/sections/hero-editorial.liquid
index 4321d1c..4b7ce13 100644
--- a/sections/hero-editorial.liquid
+++ b/sections/hero-editorial.liquid
@@ -58,9 +58,11 @@
 <editorial-hero
   class="editorial-hero"
   data-enable-video-mobile="{{ section.settings.enable_video_mobile }}"
+  data-pause-label="{{ 'sections.homepage.hero.pause_video' | t | escape }}"
+  data-play-label="{{ 'sections.homepage.hero.play_video' | t | escape }}"
 >
   <section
-    class="section hero-editorial hero-editorial--{{ layout_mode }} hero-editorial--{{ section.settings.layout_split }} hero-editorial--split-{{ section.settings.split_ratio }} hero-editorial--x-{{ section.settings.content_position_x }} hero-editorial--y-{{ section.settings.content_position_y }} hero-editorial--align-{{ section.settings.text_alignment }} hero-editorial--overlay-{{ section.settings.overlay_style }} color-{{ section_scheme }}"
+    class="section hero-editorial hero-editorial--{{ layout_mode }} hero-editorial--{{ section.settings.layout_split }} hero-editorial--split-{{ section.settings.split_ratio }} hero-editorial--x-{{ section.settings.content_position_x }} hero-editorial--y-{{ section.settings.content_position_y }} hero-editorial--align-{{ section.settings.text_alignment }} hero-editorial--overlay-{{ section.settings.overlay_style }}{% if uses_video %} hero-editorial--has-video{% endif %} color-{{ section_scheme }}"
     style="--hero-height-desktop: {{ section.settings.height_desktop }}svh; --hero-height-mobile: {{ section.settings.height_mobile }}svh; --hero-content-width: {{ section.settings.content_width }}%; --hero-overlay-opacity: {{ section.settings.overlay_opacity | divided_by: 100.0 }};"
     {% if section.settings.heading != blank %}
       aria-labelledby="HeroEditorialTitle-{{ section.id }}"
@@ -107,6 +109,21 @@
               <source data-src="{{ source.url | escape }}" type="{{ source.mime_type | escape }}">
             {%- endfor -%}
           </video>
+          {%- comment -%}
+            TEC-04 (WCAG 2.2.2). Oculto hasta que EditorialHero confirma que hay video que
+            controlar; sin JS el video no carga fuentes y no hace falta. La etiqueta la cambia
+            el JS (pausar / reproducir) con data-pause-label y data-play-label.
+          {%- endcomment -%}
+          <button
+            class="hero-editorial__video-toggle"
+            type="button"
+            aria-label="{{ 'sections.homepage.hero.play_video' | t | escape }}"
+            data-hero-video-toggle
+            hidden
+          >
+            <span class="hero-editorial__pause-icon" aria-hidden="true"></span>
+            <span class="hero-editorial__play-icon" aria-hidden="true"></span>
+          </button>
         {%- elsif hero_image != blank -%}
           <picture>
             {%- if section.settings.image_mobile != blank -%}
diff --git a/sections/main-cart-items.liquid b/sections/main-cart-items.liquid
index f8502fa..0a6e838 100644
--- a/sections/main-cart-items.liquid
+++ b/sections/main-cart-items.liquid
@@ -28,7 +28,7 @@
       <form class="cart-form" action="{{ routes.cart_url }}" method="post" novalidate>
         <div class="cart-items" role="list">
           {%- for item in cart.items -%}
-            <div class="cart-item" role="listitem">
+            <div class="cart-item" role="listitem" data-cart-item-key="{{ item.key | escape }}">
               <a class="cart-item__media" href="{{ item.url }}" tabindex="-1" aria-hidden="true">
                 {%- if item.image != blank -%}
                   {% render 'responsive-image',
diff --git a/sections/main-faq.liquid b/sections/main-faq.liquid
index 4d068d6..7a7376e 100644
--- a/sections/main-faq.liquid
+++ b/sections/main-faq.liquid
@@ -252,7 +252,8 @@
         {
           "type": "url",
           "id": "button_url",
-          "label": "t:sections.all.button_url.label"
+          "label": "t:sections.all.button_url.label",
+          "info": "t:sections.all.button_url.info"
         }
       ]
     }
diff --git a/sections/newsletter.liquid b/sections/newsletter.liquid
index ffff501..e18ff15 100644
--- a/sections/newsletter.liquid
+++ b/sections/newsletter.liquid
@@ -50,12 +50,12 @@
       </div>
 
       {%- if form.posted_successfully? -%}
-        <p class="form-message form-message--success" role="status">
+        <p class="form-message form-message--success" role="status" tabindex="-1">
           {{- 'newsletter.success' | t -}}
         </p>
       {%- endif -%}
       {%- if form.errors -%}
-        <div id="NewsletterError-{{ section.id }}" class="form-message form-message--error" role="alert">
+        <div id="NewsletterError-{{ section.id }}" class="form-message form-message--error" role="alert" tabindex="-1">
           <p>{{ 'newsletter.error_heading' | t }}</p>
           {{ form.errors | default_errors }}
         </div>
diff --git a/snippets/cart-drawer-recommendations.liquid b/snippets/cart-drawer-recommendations.liquid
index ca5ca62..291f43f 100644
--- a/snippets/cart-drawer-recommendations.liquid
+++ b/snippets/cart-drawer-recommendations.liquid
@@ -13,6 +13,12 @@
   solo rellena los huecos que quedan, hasta 2 productos unicos, disponibles y fuera del
   carrito. El marcado de la tarjeta existe una sola vez, dentro del bucle de candidatos.
   Sin candidatos no se pinta nada: ni encabezado ni contenedor.
+
+  Banda de precio (opcional, cross_sell_price_band): las fuentes automaticas (2 y 4) solo
+  aceptan productos cuyo precio quede entre price_band_min y price_band_max por ciento del
+  precio unitario del ancla. Las pasadas 5 y 6 repiten esas dos fuentes sin filtro, asi que
+  la banda solo reordena: nunca deja la lista mas corta que sin ella. El metafield (1) y los
+  bloques (3) son eleccion explicita del comerciante y no se filtran.
 {%- endcomment -%}
 {%- if section.settings.show_complementary_products and cart.item_count > 0 -%}
   {%- liquid
@@ -43,6 +49,11 @@
     endfor
     assign anchor_product = anchor_item.product
 
+    assign price_band = false
+    if section.settings.cross_sell_price_band and anchor_price > 0
+      assign price_band = true
+    endif
+
     assign seen_ids = ','
     assign cross_sell_count = 0
   -%}
@@ -56,7 +67,7 @@
   {%- endcapture -%}
 
   {%- capture cross_sell_cards -%}
-    {%- for source in (1..4) -%}
+    {%- for source in (1..6) -%}
       {%- liquid
         if cross_sell_count >= 2
           break
@@ -80,6 +91,16 @@
           when 4
             assign pool = section.settings.cross_sell_collection.products
             assign budget = 50
+          when 5
+            if price_band and section.settings.use_search_discovery and anchor_product and recommendations.performed?
+              assign pool = recommendations.products
+              assign budget = 10
+            endif
+          when 6
+            if price_band
+              assign pool = section.settings.cross_sell_collection.products
+              assign budget = 50
+            endif
         endcase
       -%}
       {%- for entry in pool limit: budget -%}
@@ -100,6 +121,14 @@
           if in_cart_ids contains candidate_token or seen_ids contains candidate_token
             continue
           endif
+          if price_band
+            if source == 2 or source == 4
+              assign price_ratio = candidate.price | times: 100 | divided_by: anchor_price
+              if price_ratio < section.settings.price_band_min or price_ratio > section.settings.price_band_max
+                continue
+              endif
+            endif
+          endif
           assign seen_ids = seen_ids | append: candidate.id | append: ','
           assign cross_sell_count = cross_sell_count | plus: 1
 
diff --git a/snippets/localization-selectors.liquid b/snippets/localization-selectors.liquid
index d0df6c3..d4f694a 100644
--- a/snippets/localization-selectors.liquid
+++ b/snippets/localization-selectors.liquid
@@ -1,7 +1,14 @@
 {%- comment -%}
   Renders Shopify's native localization form with an ultra-clean, minimal language toggle.
   Accepts:
-  - context: 'header', 'header-mobile', etc.
+  - context: 'header', 'header-mobile', 'footer', etc.
+  - enable_language: false hides the language toggle. Default: shown.
+  - enable_country: false hides the currency selector. Default: shown.
+  - editor_notice: true lets this instance show the theme editor notice.
+
+  Un selector con un solo valor seria un control muerto: aunque el ajuste este activo,
+  cada uno se pinta solo con 2 o mas idiomas o paises. En el editor, la instancia con
+  editor_notice explica al comerciante por que no aparece.
 {%- endcomment -%}
 
 {%- liquid
@@ -9,13 +16,30 @@
   assign localization_form_id = 'LocalizationForm-' | append: localization_context
   assign show_language_selector = false
   assign show_country_selector = false
+  assign language_needs_setup = false
+  assign country_needs_setup = false
 
-  if localization.available_languages.size > 1
-    assign show_language_selector = true
-  endif
+  unless enable_language == false
+    if localization.available_languages.size > 1
+      assign show_language_selector = true
+    else
+      assign language_needs_setup = true
+    endif
+  endunless
+
+  unless enable_country == false
+    if localization.available_countries.size > 1
+      assign show_country_selector = true
+    else
+      assign country_needs_setup = true
+    endif
+  endunless
 
-  if localization.available_countries.size > 1
-    assign show_country_selector = true
+  assign show_editor_notice = false
+  if editor_notice and request.design_mode
+    if language_needs_setup or country_needs_setup
+      assign show_editor_notice = true
+    endif
   endif
 -%}
 
@@ -81,3 +105,14 @@
     {%- endform -%}
   </localization-form>
 {%- endif -%}
+
+{%- if show_editor_notice -%}
+  <div class="localization-form__notice">
+    {%- if language_needs_setup -%}
+      <p>{{ 'general.localization.editor_notice_language' | t }}</p>
+    {%- endif -%}
+    {%- if country_needs_setup -%}
+      <p>{{ 'general.localization.editor_notice_country' | t }}</p>
+    {%- endif -%}
+  </div>
+{%- endif -%}
diff --git a/snippets/product-card.liquid b/snippets/product-card.liquid
index 38503cd..98bb732 100644
--- a/snippets/product-card.liquid
+++ b/snippets/product-card.liquid
@@ -23,6 +23,10 @@
 {%- liquid
   assign card_image = card_product.featured_media.preview_image
   assign secondary_image = card_product.images[1]
+  assign card_has_secondary = false
+  if show_secondary_image and secondary_image != blank and card_image != blank
+    assign card_has_secondary = true
+  endif
   assign card_sizes = '(min-width: 990px) 25vw, 50vw'
   assign card_key = section.id | append: '-' | append: card_product.id
   if card_id_suffix != blank
@@ -131,6 +135,7 @@
       href="{{ card_product.url }}"
       aria-label="{{ card_product.title | escape }}"
       data-card-link
+      {% if card_has_secondary %}data-has-secondary{% endif %}
     >
       {%- if card_image != blank -%}
         {% render 'responsive-image',
@@ -141,7 +146,7 @@
           alt: card_product.title
         %}
 
-        {%- if show_secondary_image and secondary_image != blank -%}
+        {%- if card_has_secondary -%}
           {% render 'responsive-image',
             image: secondary_image,
             sizes: card_sizes,
diff --git a/snippets/product-provenance.liquid b/snippets/product-provenance.liquid
index ad58a49..4f37680 100644
--- a/snippets/product-provenance.liquid
+++ b/snippets/product-provenance.liquid
@@ -1,5 +1,7 @@
 {%- comment -%}
   Renders product provenance block for vintage/archive pieces.
+  Each row renders only when its setting has a value; with no rows the block renders
+  nothing in the storefront and a notice in the theme editor.
   Accepts:
   - block: {Object} Block object with settings and shopify_attributes.
   - product: {Object} Product Liquid object.
@@ -46,4 +48,12 @@
       <div class="product-provenance__notes rte">{{- block.settings.provenance_notes -}}</div>
     {%- endif -%}
   </div>
+{%- elsif request.design_mode -%}
+  {%- comment -%}
+    Sin datos documentados no se afirma nada en la tienda. Solo en el editor queda un aviso
+    seleccionable para que el comerciante sepa que el bloque existe y que le falta.
+  {%- endcomment -%}
+  <div class="product-provenance" {{ block.shopify_attributes }}>
+    <p class="product-provenance__notes">{{ 'products.product.provenance.editor_empty' | t }}</p>
+  </div>
 {%- endif -%}
```
