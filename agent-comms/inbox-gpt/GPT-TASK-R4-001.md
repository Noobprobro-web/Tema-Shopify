# GPT-TASK-R4-001: ronda R4, del R3 auditado al envío al Theme Store

```text
ID: GPT-TASK-R4-001
Fecha: 2026-11-25
De: Claude (líder técnico; revisa la entrega antes de fusionarla)
Para: GPT (ejecutor de toda la ronda R4, D75)
Decisiones que lo autorizan: D63 a D75 en docs/decisions.md (Johandry, 2026-11-25)
Entrega: agent-comms/outbox-gpt/GPT-R4-001-ENTREGA.md + PR en borrador contra master
```

## 1. Contexto

- El tema Sartorial (presets Sartorial, Imprint y Archive) está a punto de enviarse al Shopify Theme Store. La ronda R3 quedó integrada en `master` con el PR #23.
- Dos auditorías manuales en navegador real revisaron los tres temas sin publicar de la revisión `62ce5ab` en la tienda `sartorial-theme-kvkzl39t.myshopify.com`. Sus conclusiones:
  - El código funciona bien en teclado, foco y responsive.
  - La demo no es presentable: texto de onboarding, placeholders, la imagen no sigue a la variante, Imprint enseña prendas.
  - Hay defectos de código concretos: el «Add to cart» queda fuera de pantalla en escritorio bajo, y la galería de escritorio no enseña el medio de la variante.
- Claude unificó todo en un plan con 32 hallazgos (M-01 a M-32), paquetes de trabajo y doce decisiones. Johandry lo aprobó el 2026-11-25 y asignó a GPT toda la ejecución.

Lectura obligatoria, en este orden:
1. Plan: `agent-comms/outbox-claude/CLAUDE-R3-PLAN-R4-001.md`. Secciones 0, A (inventario M-xx), B (verificación en el código con `archivo:línea`), C (paquetes) y D (secuencia).
2. Decisiones nuevas: `docs/decisions.md`, D63 a D75 (al final del archivo). Pendientes nuevas en `docs/decisions-pending.md`: DP-024 (tipo de tienda) y DP-025 (fuente de imágenes).
3. Auditorías:
   - `docs/audits/R3/R3-AUDITORIA-MANUAL-QA.md`: auditoría de QA, 16 defectos numerados más N1 y N2. El original está en la rama `qa/r3-manual-audit`, `agent-comms/outbox-claude/QA-MANUAL-R3.md`.
   - `docs/audits/R3/R3-AUDITORIA-MANUAL-GPT.md`: la auditoría manual previa de GPT.
4. Pruebas en tienda real de R3: `agent-comms/outbox-claude/tests-r3-20261124/INFORME.md` y la sección 13 de `agent-comms/outbox-claude/CLAUDE-R3-IMPL-001.md`.
5. Reglas permanentes:
   - `AGENTS.md` (las 5 compuertas de la Definition of Done).
   - `agent-comms/RULES.md`.
   - `docs/requirements-ledger.md`.

Lo que conviene saber de entrada:
- **Requisitos de Shopify (shopify.dev, Theme Store requirements y Listings):**
  - Una tienda demo por preset que use ese preset.
  - **Debe ser de tipo client transfer; Shopify no admite una tienda de desarrollo como demo.**
  - Texto auténtico, sin Lorem ni onboarding.
  - Pasarela Bogus o Shopify Payments en modo de prueba.
  - «Variant images must be shown when the associated variant is selected».
  - «All product images must be displayed and viewable».
- **Tipo de la tienda actual:** no se sabe todavía si `sartorial-theme-kvkzl39t` es de desarrollo o client transfer (DP-024). Este encargo funciona en los dos casos: esa tienda es la tienda de QA (D67) y las tres tiendas demo las crea Johandry (T4).

## 2. Punto de partida y reglas de git

1. **Espera a que el PR #23 esté fusionado.** Compruébalo así:
   ```bash
   git fetch origin
   git cat-file -e origin/master:agent-comms/inbox-gpt/GPT-TASK-R4-001.md && echo "PR #23 fusionado: puedes empezar"
   ```
   Si el comando no imprime nada, `master` todavía no contiene este encargo: no empieces.
2. Crea una rama nueva desde `origin/master`, por ejemplo `gpt/r4-ficha-demo`, y abre **un pull request en borrador** contra `master` en cuanto tengas el primer commit.
3. Haz **commits pequeños, uno por paquete o subpaquete** (C1a, C1b, C2…), con mensajes en español que digan qué hallazgos M-xx cierran.
4. Nunca hagas force-push, nunca rebases ramas compartidas y nunca fusiones tú el PR. Claude lo revisa y decide.
5. No toques `agent-comms/BOARD.md`. Tampoco `docs/decisions.md`: si surge una decisión nueva, anótala en tu entrega como propuesta.
6. No metas identificadores de modelo en ningún archivo ni commit.
7. Antes de editar, lee el archivo y comprueba los números de línea. Los de este encargo son de `62ce5ab` y pueden haberse movido.

## 3. Paquetes, en este orden

Cada paquete exige:
- **Tests Playwright nuevos, sin tienda**, que **fallen antes y pasen después**. El soporte está en `tests/support/r3-support.mjs`, que carga los assets reales y permite sustituirlos con `R3_THEME_JS`, `R3_BASE_CSS` y `R3_STANDARD_A_CSS`. Así demuestras que el test falla con el asset anterior (`git show <base>:assets/theme.js > /tmp/old-theme.js`, después `R3_THEME_JS=/tmp/old-theme.js npx playwright test …`). El patrón con `setContent` y CSS real está en `tests/r3-layout.spec.mjs`.
- `npm run gates:static` en verde **después del commit**: el empaquetador y parte de los gates leen de HEAD.
- Las cinco compuertas de `AGENTS.md`, incluidos los cinco estados degenerados: vacío, uno solo, muchos, muy largo y faltante.

### C1. Ficha de producto y featured product (prioridad 1). Cierra M-10, M-06 y M-15

**C1a. «Add to cart» fuera de pantalla en escritorio bajo (N1, M-10).**
- **Causa (verificada):**
  - `assets/base.css:5116-5119` pone `.product-main__details` en `position: sticky`, sin ninguna comprobación de altura. El `top` lo fijan `:9081-9084` y, en split_screen, `:10739-10743`.
  - Con 880-900 px de columna y un top de unos 101 px, la columna no cabe en ventanas de menos de unos 1.000 px de alto, y el botón queda por debajo de la ventana durante toda la galería.
  - La barra fija de compra (`StickyCartBar`, `assets/theme.js:1680-1800`) solo aparece cuando el botón sale **por arriba** (`:1753-1757`). Por eso nunca aparece.
  - Featured product tiene el mismo patrón: `assets/base.css:1399-1401` y `:9083`.
- **Enfoque, «sticky solo si cabe»:**
  - El CSS aplica `position: sticky` solo cuando la columna tiene `[data-sticky-fits]`, tanto en `.product-main__details` como en `.featured-product__details`.
  - Un helper JS pequeño (por ejemplo, un método reutilizable o un custom element ligero) observa la columna con `ResizeObserver` y escucha `resize`. Pone el atributo cuando `offsetHeight + --header-offset + var(--space-4) <= window.innerHeight`.
  - Sin JS, la columna va en flujo normal: el botón se alcanza bajando.
  - **No cambies la lógica de `StickyCartBar`**: cuando la columna no es sticky, el botón sale por arriba y la barra ya toma el relevo.
- **Descartado:** `max-height` con `overflow-y: auto` (crea scroll anidado y el botón sigue oculto) y las media queries de altura (la altura depende del contenido).
- **Riesgos:**
  - `--header-offset` cambia cuando se muestra u oculta la cabecera: recalcula también entonces.
  - Bucles de `ResizeObserver`.
  - Layout thumbnails.
  - El editor del tema (`shopify:section:load` y `unload`): limpia los observers en `disconnectedCallback`.
- **Verificación:**
  - Test a 1440×674 y 1536×674 con una columna alta: sin sticky, el botón sale por arriba al bajar y la barra fija aparece.
  - Test a 1440×1100: sticky activo.
  - Test a 390: sin cambios.
  - Sin JS: la columna no es sticky.

**C1b. La galería de escritorio enseña el medio de la variante (M-06).**
- **Causa (verificada):**
  - `ProductGallery` (`assets/theme.js:551-557`) solo monta el carrusel en los layouts que no son thumbnails.
  - `goToSlide` (`:748-749`) no hace nada si `carouselQuery` (`:627`, `max-width: 61.99rem`) no coincide.
  - `VariantSelects.updateMedia` (`:1472-1482`) solo cambia `data-selected`, que se pinta como un borde de 1 px (`assets/base.css:1198-1204`).
  - El Liquid pinta los medios en el orden del producto (`sections/main-product.liquid:84-88`; `selected_media_id` en `:45`), así que con `?variant=` la primera imagen tampoco es la de la variante.
- **Enfoque (el que siguen los temas de referencia):**
  1. **Liquid:** en los layouts que no son thumbnails, pinta primero `selected_media_id` y después el resto en el orden del producto.
  2. **JS:** con `theme:variant-change` en escritorio (sin carrusel) y un `featured_media_id` presente:
     - Mueve la figura seleccionada al principio del track (`[data-gallery-track]`).
     - Vuelve a leer `this.slides` en el orden del DOM.
     - Si la galería no está a la vista, hazle `scrollIntoView({ block: 'start' })`, con `behavior: 'auto'` cuando haya `prefers-reduced-motion`.
     - En móvil se mantiene el `goToSlide` actual (`:650-658`).
  3. No uses `order: -1` en CSS: rompe «el orden del foco = el orden del DOM», que es un requisito de accesibilidad del Theme Store.
- **Riesgos a cubrir con tests:**
  - **Índices del carrusel:** `this.slides`, `currentSlide`, `initialSlidePending` (`:629-633`) y el contador, sobre todo al pasar de escritorio a móvil después de reordenar.
  - **Span de la primera imagen:** la regla `:first-child:nth-last-child(odd)` de `assets/base.css:9162` y los `sizes` de `sections/main-product.liquid:101-105` (`forloop.first` con un número impar de medios). La imagen que pasa a ser primera debe recibir el span y el `sizes` correctos.
  - **LCP:** `media_priority = forloop.first` (`:95`) debe seguir marcando como prioritario el primer medio pintado.
  - **Zoom:** `zoom_position` (`:109-116`) y `data-zoom-open` indexan `zoom_images` en el orden del producto. Con el nuevo orden, el índice tiene que salir de la posición del medio en `zoom_images`, no de un contador del bucle. El lightbox (`assets/product-zoom.js`) debe abrir la imagen pulsada.
  - **Foco:** si el foco está dentro de una figura que se mueve, debe conservarse.
  - Vídeo, 3D y el layout thumbnails (`selectMedia`, `:771-786`) no deben cambiar.
- **Verificación:**
  - Test a 1440 que dispara `theme:variant-change` con un `featured_media_id` de la 7.ª figura y comprueba que pasa a ser `firstElementChild` y queda dentro de la ventana.
  - Test a 390: el índice del carrusel apunta a la figura correcta.
  - Test de zoom: el botón de la figura movida abre su imagen.
  - Test sin JS con el marcado de una variante seleccionada: el medio va primero.
  - En la tienda solo se puede verificar después de T1, cuando las variantes tengan medios asociados (ver §4).

**C1c. Todas las imágenes visibles en featured product (D63, M-15).**
- Retira la regla `assets/base.css:10783-10791` (el comentario y `.featured-product__media[data-media-type='image']:nth-child(n + 6):not([data-selected]) { display: none; }`).
- Revisa que con 12 imágenes la rejilla de escritorio no se rompa. El fixture es `doppio-trench`. La primera imagen ocupa las dos columnas (`assets/base.css:1393-1397`).
- Actualiza la fila del ledger que cita esa regla, si la hay.
- Test: con 12 figuras, todas tienen `display` distinto de `none` a 1440.

### C2. Cabecera, búsqueda y cajón. Cierra M-16, M-13, M-19 y M-20

- **M-16 (N2), búsqueda con el término anterior y el cursor en 0:**
  - `snippets/predictive-search.liquid:85` rellena el campo con `search.terms`.
  - `setOpen(true)` (`assets/theme.js:5981`) enfoca con `trapFocus` (`:86-89`) dentro de un `requestAnimationFrame`, sin tocar la selección.
  - Enfoque: justo después de `trapFocus`, `requestAnimationFrame(() => { if (this.isOpen && document.activeElement === this.input) this.input.select(); })`.
  - Test: abrir con un valor previo deja `selectionStart = 0` y `selectionEnd = value.length`; escribir sustituye el texto.
- **M-13, el chevron del selector de país pisa el botón:**
  - El `::after` de `.localization-form__country-wrapper` (`assets/base.css:7628-7639`) se coloca al final de un wrapper que contiene el `select` **y** el botón «Update preferences» (`snippets/localization-selectors.liquid:78-94`).
  - Enfoque: envolver solo el `select` en un elemento propio y pintar el chevron en él. Revisar la regla sin JS (`assets/base.css:7673-7679`).
  - Test: la caja del chevron no se cruza con la del botón a 1440 y 1536, en LTR y RTL.
- **M-19, la etiqueta «COLLECTIONS» se repite en cada resultado:**
  - `createTextResult` (`assets/theme.js:6245-6253`) repite el título del grupo en cada resultado. Quítala (el grupo ya lo nombra con `aria-labelledby`).
  - El `role="presentation"` del `h2` (`:6091`) es correcto: no lo toques.
- **M-20, el cajón vacío deja «Removed … 0 items» visible:**
  - `announceRemoval` (`assets/theme.js:3909-3918`) añade el contador a la región visible `[data-cart-status]` (`sections/cart-drawer.liquid:121`).
  - Enfoque: cuando el carrito queda vacío, no añadir el contador o dejar el aviso visualmente oculto, manteniendo el anuncio (ver `showStatus`, `:4330-4345`).
  - El foco sigue yendo al mensaje de vacío.

### C3. Menores. Cierra M-17, M-18, M-27 y M-28

- **M-17, la 404 (D66):**
  - `.main-404__search-row` usa `repeat(2, minmax(0, 1fr))` a partir de la media query de `assets/base.css:7364-7368`, así que el campo mide lo mismo que el botón y su placeholder se corta.
  - Usa `minmax(0, 1fr) auto`, como `.main-search__query-row` en `:7396`.
  - El rótulo `not_found.recommendations` (`locales/en.default.json:431`) pasa a «Popular pieces» (aprobado en D66). Propón el equivalente en `locales/es.json:431`, que hoy dice «Piezas destacadas / Sigue explorando», y lístalo para aprobación.
- **M-18, la tarjeta regalo enseña el acordeón «Care»:**
  - Crea `templates/product.gift-card.json` a partir de `templates/product.json` sin el bloque `composition_care` (`templates/product.json:57-61`).
  - Los presets solo sobrescriben `product.json`, así que la plantilla raíz sirve a los tres. Compruébalo con la exportación por preset.
  - La asignación de la plantilla al producto `gift-card` es una mutación de catálogo (T1).
- **M-27 (L2):** `/blogs/news?page=2` dice «No essays have been published yet.» habiendo artículos (`sections/main-blog.liquid:184-185`). Distingue una página fuera de rango de un blog vacío.
- **M-28 (L5):** «0 suggestions available» y «No suggestions yet. Press enter…» en la predictiva (claves de `predictive_search`). Propón un texto nuevo y lístalo para aprobación. No lo des por aprobado.

### C4. Copy de presets y mega menú por preset. Cierra la parte de preset de M-14

- Textos con Title Case o jerga:
  - `listings/imprint/templates/index.json:49` («MEMBRANE TELEMETRY»), `:71` («BLUEPRINT ANALYSIS»), `:94-95` («SYSTEM INVENTORY», «Studio Modular Systems»).
  - `listings/archive/templates/index.json:67` («Archive Entries»).
  - `listings/archive/templates/collection.json:11` («Curated Archival Garments»).
  - `sections/header-group.json:33,37` («New Arrivals», «Capsule Wardrobe»).
- Hoy el mega menú es el mismo en los tres presets: Imprint enseña la promo de la colección de otoño.
  - Crea `listings/sartorial/sections/header-group.json`, `listings/imprint/sections/header-group.json` y `listings/archive/sections/header-group.json`. La estructura de carpetas está documentada por Shopify en «Updating your theme»; el empaquetador ya incluye `listings/**`.
  - Cada uno debe ser una **copia completa** del grupo raíz, porque sobrescribe el archivo base, con el copy propio del preset.
  - Corrige también la raíz.
- **Riesgo:** si añades archivos, cambia el recuento de la ZIP (hoy 107). Actualiza `--expect-count` y explica la diferencia en tu entrega.

### T1-T3. Scripts de catálogo repetibles (D68)

Dónde: `docs/demo-store/scripts/`, por ejemplo `catalog-r4.mjs`, con un módulo de datos aparte.

Requisitos:
- **Modo de prueba en seco por defecto.** Sin `--apply`, el script lee el estado actual y escribe en un JSON el plan de mutaciones: qué cambia, en qué recurso y con qué valor anterior y nuevo. No envía ninguna mutación.
- **Idempotente.** Lee primero, compara y muta solo lo que difiere. Ejecutarlo dos veces seguidas no cambia nada la segunda vez.
- **Por tienda y por plan.** Por ejemplo `--store <dominio> --plan t1|t2|t3`. Lista cerrada de tiendas permitidas en un archivo de configuración: la tienda de QA hoy; las tiendas demo cuando Johandry las cree.
- **Credenciales solo por variable de entorno**, nunca en archivos, salidas ni commits. Comprueba con `grep -F` que ninguna salida las contiene. Si no hay credenciales de Admin API, el script puede emitir las operaciones GraphQL a un archivo para que las ejecute quien tenga acceso.
- **Lectura de verificación** después de cada mutación aplicada.
- **Sin IDs fijos.** No confíes en los IDs de medios de la tienda de QA para las tiendas nuevas: localiza el medio por producto, valor de opción y nombre de archivo o texto alternativo. Los IDs de QA solo sirven como comprobación:
  - doppio-trench: Stone→46295776985392, Black→46295776231728.
  - bias-cut-slip-dress: Black→46295764566320, Champagne→46295763222832.
  - milled-brass-paperweight: Natural brass→46297531056432, Dark patina→46297600819504.

Contenido:
- **T1, común:**
  1. Asociar un medio a cada variante con color o acabado. Los de arriba, más los de `serra-coat` (Ink y Camel) y el resto de productos con opción de color o acabado.
  2. Reescribir las descripciones con el sufijo «Demo product for theme preview. Replace this text with your own description.» (20 productos; origen en `docs/demo-store/scripts/build-products-csv.mjs:9,14` y `docs/demo-store/products.csv`), con texto editorial auténtico (§5).
  3. Cambiar el vendor «Studio Demo» (31 productos) por una marca ficticia propia de cada preset.
  4. Renombrar los productos «Fixture …» con nombres auténticos, conservando sus casos límite (D74).
  5. Blog `news`: reescribir «Welcome to the demo store» y «How to read the size chart» (`docs/demo-store/blog.md:9-10`), despublicar el artículo de título largo de prueba, poner un autor real y quitar la etiqueta `test`. El CP-27 de `docs/demo-store/COPY-PROPUESTA-20261114.md` no basta: es meta-texto.
  6. Texto de la tarjeta regalo («This is a gift card for the store») y plantilla `gift-card` (cuando exista C3).
  7. Quitar del canal Online Store las colecciones de prueba `empty-test` y `single-product-test`.
- **T2, Imprint:**
  - Activar con inventario los 8 productos de Imprint en DRAFT (`docs/demo-store/created-products-imprint-archive.json`).
  - Crear `daily-objects`, `desk-and-study` y `leather-goods` según `docs/demo-import/data/imprint.json`.
  - `structured-tote`: en la tienda de QA ya existe el bolso del kit de Sartorial con ese handle; no lo sobrescribas allí. En la tienda demo de Imprint se importa la versión de Imprint. Ninguna prenda en la tienda de Imprint.
- **T3, Archive:**
  - Activar con inventario los 8 productos de Archive en DRAFT.
  - Crear `permanent-archive` y `restored-pieces` según `docs/demo-import/data/archive.json`.

Ejecución:
- Escribe los scripts y pruébalos **en seco**.
- Ejecútalos con `--apply` contra la tienda de QA **solo si tienes credenciales y acceso**:
  1. Empieza con **un único producto** (`doppio-trench`, la asociación de un medio).
  2. Haz una lectura de verificación.
  3. Repite la ejecución para demostrar que es idempotente.
  4. Solo después, el resto.
- Prohibido:
  - Publicar o borrar temas.
  - Tocar el tema publicado de la tienda de QA (hoy `Archive rc5 (e5fd4b2)`).
  - Instalar o configurar apps.
  - Crear o modificar metafields.
  - Cambiar ajustes de la tienda, mercados o pagos.
- Sin credenciales: deja los planes en seco en tu entrega y dilo.

### P1. Overlays de la demo por preset (D70)

- Dónde: `docs/demo-store/overlays/<preset>/templates/index.json` y `sections/header-group.json`. Fuera de la ZIP: los JSON de `listings/` siguen sin handles de la demo.
- Contenido:
  - S: featured product `serra-coat`; complete the look `nove-blazer`, `silk-charmeuse-blouse` y `pleated-wide-trouser`; pestañas `new-forms`, `permanent-collection` y `tailoring`; hotspots del lookbook.
  - I: objetos y las colecciones de T2.
  - A: piezas y las colecciones de T3.
  - Los handles tienen que existir en la tienda de destino.
- Las imágenes de tema dependen de DP-025: deja esos ajustes vacíos y documenta qué ajuste espera cada imagen. La fuente es `docs/demo-import/*-photos.csv`.
- Incluye el procedimiento de aplicación: el overlay se sube al tema **sin publicar** de la tienda demo antes de que Johandry lo publique, nunca a un tema publicado.

### Cierre técnico (una sola vez, al final)

1. Con todos los paquetes en commits y `npm run gates:static` en verde sobre HEAD, regenera **una sola vez** la ZIP y el manifiesto con el procedimiento de §12.7 de `agent-comms/outbox-claude/CLAUDE-R3-IMPL-001.md`:
   - `node scripts/package-theme-zip.mjs --out Sartorial-1.0.0.zip --expect-count <N>` sobre HEAD ya commiteado (el empaquetador lee los blobs de git).
   - Manifiesto `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt` con la cabecera de diez líneas y una línea `sha256  ruta` por archivo, en el orden del ZIP.
   - Comprobaciones: «internal references: none», `unzip -t` y `node --check assets/theme.js` sobre lo extraído.
   - El manifiesto va en su propio commit, después del commit del código.
2. **Lo aprendido en R3:** Theme Check y los gates no detectan todo lo que Shopify rechaza al subir. En R3 fueron los `"default": ""` de tres schemas, que ahora detecta `gates:json`, pero puede haber más. Por eso la verificación final incluye **subir los tres presets como temas sin publicar** a la tienda de QA y comprobar que no hay errores:
   - Por preset con `agent-comms/outbox-claude/harness-C-01-ID-001/build-export.mjs` y `shopify theme push --unpublished`.
   - Y, si puedes, una vez **desde la propia ZIP**: los temas R3 se subieron desde el código, nunca desde la ZIP.
   - Nombres: «Sartorial R4 (<sha7>)», «Imprint R4 (<sha7>)», «Archive R4 (<sha7>)».
   - No borres temas antiguos. Si falta sitio, avisa.
   - Sin credenciales: dilo, y Claude o Johandry hacen la subida.
3. En los temas R4 de la tienda de QA, comprueba en pantalla:
   - Doppio Stone, Bias-cut slip dress Black y Milled brass paperweight Dark patina: la imagen principal cambia, una vez hecho T1.
   - «Add to cart» o la barra fija visibles a 1536×674.
   - La búsqueda de la cabecera con el término anterior.
   - El chevron del selector de país.
   - La 404 y la tarjeta regalo.

## 4. Si repites alguna auditoría en navegador

- Cada auditor usa **su propio perfil de navegador** (o máquina, o ventana de invitado) y **nunca a la vez** que otro sobre la misma tienda. La vista previa de Shopify y el carrito van por navegador: compartir perfil cambió el preset y el carrito en R3.
- En cada página, comprueba `Shopify.theme.name` y añade `preview_theme_id` a cada URL.

## 5. Reglas de copy (D72 y D35)

- Texto editorial auténtico, como el de una tienda real del sector de cada preset: sastrería en Sartorial, objetos de escritorio y uso diario en Imprint, piezas de archivo en Archive.
- Sentence case en títulos, rótulos y botones.
- Sin jerga interna («telemetry», «system inventory», «blueprint») ni meta-texto sobre la propia tienda («this store is used to preview the theme», «demo», «replace this text»).
- Sin afirmaciones de material, origen o ajuste que no se puedan sostener (criterio C-08 del kit).
- Lista en tu entrega **todos los textos nuevos visibles** (storefront, presets, catálogo y blog) con su ubicación. **No se dan por aprobados**: los aprueba Johandry (D35). La única excepción ya aprobada es «Popular pieces» (D66).
- Labels del editor, si tocas alguno: inglés neutro, sentence case y claves `t:` (compuerta 4).

## 6. T4: checklist para Johandry (no lo ejecuta GPT)

Cópialo en tu entrega con el estado que veas:

- [ ] Confirmar en el Dev Dashboard si `sartorial-theme-kvkzl39t` es de desarrollo o client transfer (DP-024).
- [ ] Crear tres tiendas client transfer, una por preset (D67).
- [ ] Dar a cada tienda su nombre, que es también el logo de texto: hoy los tres presets enseñan «Sartorial Theme».
- [ ] En cada tienda demo, activar Bogus Gateway o Shopify Payments en modo de prueba y desactivar los demás métodos de pago (D69).
- [ ] En cada tienda demo, conseguir que el mercado de Canadá venda (inventario y envío) o retirarlo: hoy, en la tienda de QA, todo sale «Sold out» con Canadá (D69).
- [ ] Elegir la fuente y acreditar los derechos de las imágenes de tema (DP-025) y subirlas.
- [ ] Facilitar las credenciales para ejecutar los scripts T1-T3 en cada tienda demo, o ejecutarlos.
- [ ] Tras aplicar el overlay, publicar el preset de cada tienda (D69).
- [ ] Aprobar el copy nuevo que liste GPT (D35).

## 7. Formato de la entrega

Archivo `agent-comms/outbox-gpt/GPT-R4-001-ENTREGA.md`, con:

1. Rama, commits (hash y mensaje) y enlace al PR en borrador.
2. **Archivos y líneas tocadas** por paquete, con `archivo:línea` del resultado final.
3. **Filas de `docs/requirements-ledger.md` que propones cerrar o modificar.** Indica fila, estado propuesto y evidencia concreta (`archivo:línea` o el nombre del test). No las cierres tú si exigen tienda real: Claude las verifica.
4. **Tests añadidos**, cada uno con su resultado **antes** (asset anterior, falla) y **después** (pasa), y la salida de `npm run gates:static`.
5. Los planes en seco de T1-T3 y, si se ejecutaron, lo aplicado con las lecturas de verificación.
6. ZIP final: sha256, número de archivos y huella. Resultado de la subida de los tres temas R4 (IDs, errores o ninguno).
7. **Copy nuevo para aprobación** (§5).
8. Hallazgos M-xx cerrados, abiertos y residuales.
9. Lo que no pudiste hacer y por qué.
10. Riesgos o desviaciones del plan: Nivel 1 o Nivel 2 según `agent-comms/RULES.md`.

Claude revisará el PR antes de fusionarlo: diff, las cinco compuertas, la reproducción de los tests en los dos sentidos, la reproducción de la ZIP y del manifiesto, y las filas del ledger.
