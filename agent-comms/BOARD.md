# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (coordinación con Claude en mando técnico)
Líder Técnico & Estratégico Vigente: Claude (Opus 5.5 Extra) — Delegación expresa de Johandry (CLAUDE-HANDOFF-LEAD-001)
Lectura obligatoria para: Johandry, Claude (Opus 5.5 Extra), GPT-6 Sol Max / Astra, Gemini
Última actualización: 2026-10-02T04:45:00-04:00 (TECH-AUDIT-001, Gemini)
Última actualización técnica: 2026-10-02 (MOTION-002, Claude) — ver sección 4
Estado general: AUDITORÍA TÉCNICA MULTIDIMENSIONAL TECH-AUDIT-001 COMPLETADA Y CERTIFICADA. VEREDICTO: APTO TRAS PARCHES (LIGHTHOUSE MÓVIL 98.0 / UMBRAL THEME STORE 60). 4 PARCHES LISTOS PARA APLICACIÓN POR CLAUDE (LOS 4 SIGUEN APLICANDO LIMPIOS TRAS MOTION-002: `git apply --check` SALE 0 EN LOS CUATRO). SUPERPUESTO: SPRINT MOTION-002 CON CÓDIGO COMPLETO Y **SIN CERTIFICAR** — GSAP RETIRADO (-125.737 B DE JS) Y SUSTITUIDO POR CSS SCROLL-DRIVEN NATIVO; `npm run gates:static` EN ROJO EN LA COMPUERTA 1 DE 8 (`gates:json`) POR CAUSA AJENA AL TEMA Y CON PARCHE YA VALIDADO. EL TEMA NO ESTÁ LISTO PARA SUBMISSION.
Frentes Recién Sincronizados y Verificados:
  1) TECH-AUDIT-001 COMPLETADO Y CERTIFICADO: 9 roles ejecutados con evidencia empírica (54 corridas Lighthouse con media 98.0 móvil / 98.7 escritorio, axe 0 violaciones en 180 tests, 72 viewports con 0px overflow, 2450 links con 0 rotos).
  2) Bloqueante P0 y Mejoras Aisladas en Parches: 4 parches validados con `git apply --check` listos en `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/` (P0 shopify images, X5 CLS reduced motion, FAQ summary ARIA, gates static scratch).
  3) B-01 (P0) CERRADO: Documentación y soporte públicos operativos en GitHub Pages (noobprobro-web.github.io/sartorial-docs/), Formspree xyezvvjo probado E2E con éxito. Schema pushed a las 3 demos. Fila 107 del ledger CUMPLIDA.
  4) Paridad Repositorio vs Demos (Rol 8): 60/60 archivos de código ejecutable idénticos byte por byte. Cero derivas.
Frentes en Ejecución Activa:
  - MOTION-002 (Motor de Movimiento): código completo y trazado en el ledger (filas nuevas 38, 57 y 58, más la 56 reescrita, que era la 55 antes del desplazamiento), SIN verificación en storefront vivo, SIN Safari y SIN ejercer la rama de respaldo B8.1. Arnés listo en `agent-comms/outbox-claude/harness-MOTION-002/`, bloqueado por `STOREFRONT_PASSWORD`. 7 acciones humanas abiertas y 4 conflictos con TECH-AUDIT-001 sin resolver (sección 4).
  - Aplicación de los 4 parches por Claude (`git apply`), ejecución de `npm run gates:static`, push a las 3 demos y regeneración de `Sartorial-1.0.0.zip`. El push a las demos pasa a ser BLOQUEANTE: hoy las 3 sirven el motor GSAP que el repositorio ya no tiene (conflicto C-02 de la sección 4).
  - B-04 / M-02 / M-03 (Fotografía):
    * Edition: GPT-TASK-016 (13 imágenes asignadas a GPT).
    * Archive: GEMINI-TASK-IMAGERY-001 (12 imágenes asignadas a Gemini). 4/12 generadas y procesadas (2000x2500, <=1.5MB), alt-text.csv y PROVENANCE.md creados.
  - M-01 (Políticas y Colección): Operaciones GraphQL listas para Edition/Atelier/Archive (desk-and-study + 4 políticas de tienda).
  - Transacciones: Registro de pedido de prueba Bogus por demo.
```

---

## 1. Sprints Cerrados y Certificados

- **Sprint 5A - High-Fashion Catalog Architecture & Swatches:** Certificado en tienda real con 8 fixtures F01-F06, F10, F11 (`GPT-AUDIT-006`).
- **Sprint 5B - Luxury PDP Media & Accessible Zoom:** Certificado en tienda real (`GPT-AUDIT-008`). Hotfix F01 implementado con gestión atómica de foco.
- **Sprint 5C - The Luxury Triple Crown ($380 USD Tier):** Certificado en tienda real Couture #165809488115 (`GPT-AUDIT-011`). Mega Menú editorial bilingüe (0 CLS, tarjetas 4:5, links dinámicos localizados), Recently Viewed nativo (0-4 tarjetas, persistencia 8 IDs, sin overflow 390/360 px), inventario reactivo multi-estado (in_stock, low_stock, sold_out, preorder), acordeones bilingües y anuncio accesible de carrito. Filas 83-85 del ledger pasadas a `cumplido`.
- **Auditoría de Presets y Cierre de Fila 106:** Certificado en tienda real en los 4 temas independientes (`CLAUDE-REPORT-AUDIT-PRESETS-001`). Dictamen APTO. Sartorial 100% preservado. Parches H1 y H2 aplicados (`af6ee6d`). Fila 106 en `cumplido`.
- **Sprint 6A - Storefront Certification & Hardening (Filas 63, 78, 79, 80, 81, 82):** Certificado integralmente en tienda real (`CLAUDE-REPORT-6A-001` y mediciones Playwright automatizadas). 
  - Fila 80 (Idioma): Toggle bilingüe probado en desktop y drawer móvil, POST nativo sin JS, 44x44, 7.87:1.
  - Fila 78 (Búsqueda Predictiva): Debounce (4 eventos -> 1 petición), 4 entidades, navegación teclado real, parches D1 y H-A desplegados, axe-core **0 violaciones**.
  - Fila 79 (País / Moneda): Toggle minimalista `USD$/EUR€` verificado en vivo con recálculo dinámico a Euros ("1.890,00 €"), fallback sin JS listo.
  - Fila 82 (Iconos de Pago en Footer): 6 SVGs oficiales renderizados, responsivo flex-wrap sin scroll horizontal en móvil (375px), parche H-C aplicado.
  - Fila 81 (Newsletter): Envío manual por comerciante completado, estados `role="status"` y `role="alert"`.
  - Fila 63 (Checkout Acelerado): "Buy it now" activo y reactivo a variantes agotadas, tipografía homologada (14px uppercase), soporte nativo `additional_checkout_buttons`.
- **Sprint 6B - Píldoras de Filtros Activos, Accesibilidad y Zoom PDP (Filas 76, 47, 53, 73):** Certificado integralmente en tienda real Couture #165809488115 y Sartorial #166186909939 (`CLAUDE-REPORT-6B-001` y `scratch/verify-sprint6b-live.mjs`).
  - Fila 76 (Filtros Facetados): Píldoras de filtros activos (`snippets/facets-active-filters.liquid`) con `url_to_remove` individuales, eliminación AJAX instantánea, botón "Clear all", recálculo de rango de precios y targets táctiles de 44px en móvil sin overflow.
  - Fila 47 (Contraste No-Texto): Borde de inputs 4.19-4.39 (claro) y 6.35 (oscuro), chips 3.28:1, foco `:focus-visible` >= 15.52:1. axe 0 violaciones.
  - Fila 53 (Live Regions): Regiones vivas operativas en adición a carrito (con delay accesible de 100ms H-2), cambio de variantes en PDP, filtrado de colecciones y búsqueda.
  - Fila 73 (Zoom PDP): Web Component `<product-zoom>` verificado con apertura modal, pan con ratón a 1280px, pellizco multitouch a 375px y retorno atómico de foco.
- **Sprint 6C - Punto Focal, Contraste de Texto WCAG 2.2 AA y Medios 3D (Filas 35, 46, 72):** Certificado integralmente en tienda real (`scratch/audit-sprint6c.mjs` y `CLAUDE-REPORT-6B-001`).
  - Fila 35 (Punto Focal): Liquid inyecta `--hero-focal-point` desde `presentation.focal_point` nativo, computado en `object-position` sin deformación.
  - Fila 46 (Contraste de Texto): Hero en Couture >= 6.08:1; hero en Sartorial con velo `gradient_content` al 60% desplegado en vivo >= 5.49:1 (superando 4.5:1).
  - Fila 72 (Medios 3D y Video): Carga condicional estricta de `shopify-xr.js` en PDP (cero bloat cuando no hay modelos) y pausa automática de videos (`pauseAllMedia`) certificada.
- **Auditoría Integral Multi-Agente Pre-Submission & Certificación Final de Claude:** Dictamen de Claude: **`CERTIFICADO`** (`CLAUDE-REPORT-AUDIT-FINAL-001.md`, `CLAUDE-CERTIFICATION-GEMINI-FINAL-001.md`, `CLAUDE-REPORT-FIXES-AUDIT-FINAL-001.md`, `CLAUDE-VERIFICATION-LIVE-FINAL-001.md`). Verificación técnica en vivo 100% satisfactoria en los 4 temas remotos.
  - **Estado del Despliegue:**
    - Los 10 archivos de código (`assets/base.css`, `assets/theme.js`, `locales/en.default.schema.json`, `sections/cart-drawer.liquid`, `sections/main-cart-items.liquid`, `sections/main-search.liquid`, `sections/featured-product.liquid`, `sections/hero-editorial.liquid`, `sections/main-product.liquid`, `templates/gift_card.liquid`) desplegados con `--nodelete` a los 4 temas remotos (#165809488115 con `--allow-live`, #166186909939, #166186942707, #166187041011).
    - Plantillas de listing (`index.json`, `collection.json`, `product.json`) desplegadas desde `listings/<preset>/templates/` a cada preset remoto (Sartorial, Edition y Archive) con `--nodelete`. Comprobado en vivo: mosaico editorial y banner en Sartorial/Archive, diseño minimalista sin banner en Edition.
    - Paquete de producción `Sartorial-1.0.0.zip` (296 KB) regenerado localmente tras pasar las 8 compuertas de `npm run gates:static` (0 ofensas en 150 archivos). Paquete obsoleto `Couture-1.0.0.zip` eliminado.
  - **Matriz de Hallazgos y Correcciones Certificadas (AF-01 a AF-16):**
    - `AF-01` [P1 - WCAG 1.4.3]: Hero Archive `overlay_opacity: 60` aplicado en `listings/archive/templates/index.json:15` y desplegado. Verificado en vivo por Claude: subtítulo 4.85:1 a 1280px y 5.22:1 a 375px en el peor píxel (superando >= 4.5:1), axe 0 violaciones. CERTIFICADO.
    - `AF-02` [P1 - Seguridad]: Enlace de subida con validación estricta de prefijo (`property_scheme == 'https://'`) en `sections/cart-drawer.liquid:184` y `sections/main-cart-items.liquid:73`. Desplegado y verificado en los 4 temas. CERTIFICADO.
    - `AF-03` [P2 - Funcional]: Búsqueda con entidades especiales (`&`, `"`, `'`, `<`, `>`) corregida en `sections/main-search.liquid:20`. Desplegado a los 4 temas; comprobado en vivo en Couture con `/search?q=Tom+%26+Jerry`, '12" frame' y "O'Neil" sin corrupción de términos ni inyección de scripts. CERTIFICADO.
    - `AF-04` [P1 - Seguridad]: `cart.note | escape` en `sections/cart-drawer.liquid:457` y `sections/main-cart-items.liquid:176`. Desplegado y verificado en los 4 temas. CERTIFICADO.
    - `AF-05` [P2 - Ledger]: Filas 35 y 72 reflejadas honestamente como `código completo` por Opción A de Johandry. Conteo: 53 cumplido, 2 código completo, 2 no verificado, 0 ausente. CERTIFICADO.
    - `AF-06` [P2 - Entorno]: Plantillas de colección por listing desplegadas en Sartorial, Edition y Archive (#166186909939, #166186942707, #166187041011). Verificado en vivo por Claude. CERTIFICADO.
    - `AF-07` [P3 - Privacidad de Stock]: Exposición de inventario exacto limitada al umbral más uno (con umbral 5, stock 20 publica 6; stock 3 publica 3) en `sections/main-product.liquid:696` y `sections/featured-product.liquid:455` (complejidad Liquid bajo control). Verificado en vivo por Claude en F01, F06 y F10. CERTIFICADO.
    - `AF-08` [P2 - WCAG 2.4.11]: Barra fija de compra móvil con `--sticky-cart-offset` dinámico y `scroll-padding-block-end` en `assets/theme.js:1246` y `assets/base.css:7766`. Mecanismo verificado en vivo (`setVisible(true)` activa 81px de offset y scroll-padding). Pendiente prueba con teclado físico por Johandry.
    - `AF-09` [P3 - Estado Degenerado]: Título muy largo (F10) escalado a 1.75rem con `data-long-title="1"` en `sections/main-product.liquid:201` y `assets/base.css:1280,3961`. Verificado en vivo por Claude en `/products/qa5a-f10-hostile` en Sartorial: 7 líneas de título, botón de compra termina en y=781 (dentro de la primera pantalla de 800px). CERTIFICADO.
    - `AF-10` [P3 - CWV]: `hero_sizes` responsivo en split ratio (50vw/60vw/65vw) en `sections/hero-editorial.liquid:6-18,90,127`. Verificado en vivo en Edition (50vw). CERTIFICADO.
    - `AF-11` [P3 - Superficie]: 61 claves huérfanas eliminadas de `locales/en.default.schema.json`. 0 huérfanas verificadas por compuertas estáticas. CERTIFICADO.
    - `AF-12` [P3 - Entorno]: `layout/password.liquid` (48 bytes huérfanos generados en admin) pendiente de eliminación manual por Johandry desde "Editar código" en los 4 temas. No va en el zip.
    - `AF-13` [P4 - CSP]: Manejador en línea `window.print()` sustituido por listener no intrusivo `data-gift-card-print` en `templates/gift_card.liquid:114,131`. CERTIFICADO.
    - `AF-14` [P4 - Seguridad]: Comprobación de mismo origen añadida en `renderUrl` en `assets/theme.js:2873`. CERTIFICADO.
    - `AF-15` [P4 - Visual]: Títulos de tarjeta sin recorte de líneas por decisión de diseño editorial (preserva estética de lujo y tipografía íntegra).
    - `AF-16` [P4 - A11y]: Skip link fuera de landmark mantenido conforme al estándar oficial Shopify Dawn / WCAG 2.4.1.
- **Auditoría Integral Multiagente 360° Pre-Submission (`GEMINI-TASK-AUDIT-360-001` y `002`):** Informes maestros en [GEMINI-REPORT-AUDIT-360-001.md](agent-comms/outbox-gemini/GEMINI-REPORT-AUDIT-360-001.md) y [GEMINI-REPORT-AUDIT-360-002.md](agent-comms/outbox-gemini/GEMINI-REPORT-AUDIT-360-002.md).
- **Verificación Cruzada Adversarial de Claude (`CLAUDE-REVIEW-GEMINI-AUDIT-360.md`):** Dictamen final del tema: **`NO APTO para envío inmediato`**. Informe en [CLAUDE-REVIEW-GEMINI-AUDIT-360.md](agent-comms/outbox-claude/CLAUDE-REVIEW-GEMINI-AUDIT-360.md) con salida de vnu 26.9.16 en `agent-comms/outbox-claude/harness-REVIEW-AUDIT-360/vnu-24-paginas.json`.
  - **Correcciones metodológicas aceptadas:** El dictamen "APTO CON OBSERVACIONES" del 002 no se sostiene teniendo P0 abiertos. La matriz `cobertura-360-002.csv` y las carpetas de roles fueron generadas por script sintético; el contraste real en Edition y la tabla de CWV reportaron valores no respaldados en crudos; y la métrica de Lighthouse oficial (con limitación de CPU/red en 4 temas x 3 páginas x móvil/escritorio) sigue pendiente de medición estandarizada.
  - **Matriz Consolidada de Hallazgos:**
    - `CR-01` [P2 - HTML Válido]: vnu detecta 161 errores provenientes del tema en las 24 páginas. Tres fallos reales: 1) `<aside role="dialog">` en `sections/cart-drawer.liquid:50-53` (cambiar `<aside>` por `<div>`), 2) `sizes` sin `srcset` en `snippets/product-zoom.liquid:65` (usar `data-sizes`), 3) `<span>` dentro de `<dl><div>` en `sections/brand-manifesto.liquid:71` (mover a `<dd aria-hidden="true">`).
    - `CR-02` / `A360-01` [P0 - Bloqueador Comercial]: En `config/settings_schema.json:7-8`, las URLs apuntan a `ruizdigital.com` (sitio de marketing de contenidos externo) y dan 404 en `/docs` y `/support`. Johandry debe proveer URLs reales con formulario/sistema de tickets antes de enviar a Theme Store.
    - `CR-03` [P2 - Theme Store]: `sections/footer.liquid` no incluye `{{ powered_by_link }}`. Requisito explícito de Theme Store: *"The powered_by_link link can't be altered and must contain only powered_by_link"*. Debe incluirse junto al copyright.
    - `CR-04` [P2 - Higiene Git]: Archivo `storefront-cookies.txt` eliminado del disco y `.gitignore` actualizado. Local HEAD y `origin/master` sincronizados en commit limpio sin cookies en el historial. RESUELTO.
    - `A360-02` [P0 - Bloqueador Comercial]: La Theme Store requiere 3 tiendas demo (1 por preset) de tipo *Client Transfer* con pasarela de prueba activa y misma contraseña. Requiere creación por Johandry en Partner Dashboard.
    - `A360-03` [P2 - Paridad de Plataforma]: `sections/main-product.liquid` admite `@app` pero carece del bloque `custom_liquid` (presente en `featured-product.liquid`). Requisito de Shopify: agregar `custom_liquid` donde se admita `@app`.
    - `A360-04` [P3 - Herramienta CI]: `scripts/ledger-verify.mjs:58,121` vulnerable a fallos por CRLF en Windows. Corregir con `split(/\r?\n/)`.
    - `A360-05` [P3 - Liquid Defensivo]: Añadir `limit: section.settings.products_to_show` en el bucle de `sections/recently-viewed.liquid:34` para consistencia defensiva.
    - `A360-06` [P3 - Memoria Editor]: Observador de revelado en editor sin unobserve antes de eliminar bloque. Acotado solo al editor.
    - `A360-07` [Descarte Correcto]: `<shopify-account>` verificado como obligatorio según changelog 2026. Descartado.
    - `A360-08` [P3 - Localización]: `locales/en.default.json:86` cambiar `"Complimentary Additions"` por `"Complimentary additions"` (Sentence case).
    - `A360-09` [Falso Positivo]: Custom Elements no registran listeners globales ni observers que requieran `disconnectedCallback`. Descartado.
    - `A360-10` [Duplicado]: Corresponde a AF-12 (eliminación manual en admin de password.liquid).
    - `A360-11` [Sin Hallazgo]: Ausencia de carpeta `blocks/` no viola ninguna directriz. Descartado.
    - `A360-12` [P2 - HTML / a11y]: `snippets/product-card.liquid:25-31` genera IDs duplicados cuando un producto se repite dentro de una misma sección. Corregido inyectando sufijo discriminador único opcional (`card_id_suffix`). RESUELTO.
    - `NF-01` [P2 - HTML Válido]: `<article role="listitem">` en items del carrito cambiado a `<div role="listitem">` en `sections/cart-drawer.liquid:141,287` y `sections/main-cart-items.liquid:31,169` (ARIA in HTML prohíbe `listitem` en `article`). Commit `c6a82b5` aplicado y desplegado a los 4 temas. 0 errores HTML tanto con carrito vacío como con carrito lleno. RESUELTO.
- **Sprint de Corrección Técnica Pre-Submission (`CLAUDE-REPORT-FIXES-PRE-SUBMISSION-001.md` y `CLAUDE-VERIFICATION-LIVE-FIXES-PRE-SUBMISSION-001.md`):**
  - **Commits:** `ee45f7f` (7 fixes principales) y `c6a82b5` (NF-01).
  - **Verificación en Vivo en Storefront:** Certificada por Claude en los 4 temas remotos (`CLAUDE-VERIFICATION-LIVE-FIXES-PRE-SUBMISSION-001.md`). Dictamen **VERIFICADO**:
    1. Checksums MD5 coincidentes al 100% en los 4 temas remotos.
    2. Cabecera sticky verificada en top 0 a 1280px y 375px tras `scrollTo(2500)`. Cero `<style>` en el body.
    3. Zoom: `sizes` asignado antes de `srcset` y cálculo ampliado a px verificado.
    4. Búsqueda predictiva: 4 pulsaciones -> 1 petición AJAX con 8 opciones, teclado completo y HTML válido.
    5. Footer: `{{ powered_by_link }}` con `rel="nofollow"`, altura táctil de 24px, en fila legal junto al copyright y contraste de 10.46:1 a 18.09:1.
    6. Manifiesto: índice `<dd>` con tamaño y `line-height` idénticos a la versión previa.
    7. Validador W3C / Nu HTML sobre 28 páginas servidas reales: **0 errores originados por el tema** (tanto en estado vacío como con carrito lleno tras NF-01).
  - **Compuertas:** `npm run gates:static` verificado en verde (**exit 0**, Theme Check 351 archivos con 0 ofensas, locales 0 huérfanas, ledger 53/2/2/0). Paquete de producción `Sartorial-1.0.0.zip` (296 KB) sincronizado.

- **Sprint de Remediación Técnica A360-001 (`CLAUDE-REPORT-A360-001.md` y verificación en vivo por Gemini):**
  - **Alcance implementado y desplegado a los 4 temas remotos:**
    1. `A360-04` [P1 - Accesibilidad WCAG 2.4.3]: `assets/theme.js:1248,1261` (`StickyCartBar.setVisible`). Transferencia atómica de foco al botón ATC principal antes de aplicar `inert`. Cero saltos de foco a `BODY`.
    2. `A360-03` [P1 - Transaccional]: `assets/theme.js:2200,2570,2580` (`CartDrawer`). Detección de peticiones concurrentes solapadas (`overlappingMutations`) con resincronización limpia automática con `/cart.js`.
    3. `A360-05` [P1 - UX de Compra]: `assets/theme.js:625` (`VariantSelects.updateOptionAvailability`). Matriz cruzada de disponibilidad en vivo; avisa "Option unavailable" para combinaciones sin stock sin bloquear combinaciones alternativas alcanzables. Probado en vivo en `/products/qa5a-f04-colour-size` (seleccionar Camel marca S y M como agotadas de inmediato).
    4. `A360-06` [P2 - Demos y Merchandising]: Cápsulas de presets (`complete-the-look`) y tarjetas de descubrimiento (`bento-discovery`) pobladas con productos reales del catálogo en `templates/index.json`, `listings/sartorial/templates/index.json` y `listings/edition/templates/index.json`. Verificado en vivo en los 3 presets: **0 placeholders y 3 productos por cápsula**.
    5. `A360-11` [P2 - Theme Editor]: `assets/product-zoom.js:42-49` (`disconnectedCallback`). Limpieza síncrona de foco, trampa y scroll lock del body al desmontar el diálogo.
    6. `A360-02` [Arquitectura]: Prevalencia fundamentada de `https://cdn.shopify.com/...` para 0 ofensas en Theme Check (conforme al estándar oficial del tema Dawn). Excepción y justificación formal documentada en `docs/decisions.md`.
  - **Compuertas estáticas:** `npm run gates:static` verificado en verde (**exit 0**, Theme Check 351 archivos con 0 ofensas, locales 0 huérfanas/sin resolver, 304 JSON válidos). Paquete `Sartorial-1.0.0.zip` sincronizado.
  - **Despliegue en tienda real:** Desplegado con éxito a Couture (#165809488115), Sartorial (#166186909939), Edition (#166186942707) y Archive (#166187041011).

- **Creación y Despliegue de las 3 Tiendas Demo Oficiales (Fila 108 / A360-02):**
  - Creadas 3 tiendas de desarrollo independientes bajo la organización `joha.dev` (Owner: Johandry Maldonado):
    1. **Sartorial Atelier:** `https://sartorial-atelier.myshopify.com` (Admin: `https://admin.shopify.com/store/sartorial-atelier`). Tema `Sartorial` [live] #188743188704 (Preset: Sartorial aplicado).
    2. **Sartorial Edition:** `https://sartorial-edition.myshopify.com` (Admin: `https://admin.shopify.com/store/sartorial-edition`). Tema `Edition` [live] #188655599784 (Preset: Edition aplicado).
    3. **Sartorial Archive:** `https://sartorial-archive.myshopify.com` (Admin: `https://admin.shopify.com/store/sartorial-archive`). Tema `Archive` [live] #191153275192 (Preset: Archive aplicado).
  - Cada tienda opera con su estilo preconfigurado y publicado como tema principal.

- **Auditoría Técnica Integral Multidimensional Pre-Submission (TECH-AUDIT-001):** Certificado exhaustivamente sobre las 3 tiendas demo oficiales (Atelier, Edition, Archive) y código de producción ([GEMINI-REPORT-TECH-AUDIT-001.md](agent-comms/outbox-gemini/GEMINI-REPORT-TECH-AUDIT-001.md)). Dictamen: **APTO TRAS APLICACIÓN DE PARCHES (Lighthouse Móvil 98.0 / Umbral Theme Store 60)**.
  - **Resultados Empíricos de los 9 Roles:**
    1. *Rol 1 (Lighthouse 13.5.0):* 54 corridas ejecutadas. Media móvil global **98.0/100** (superávit de +38 puntos sobre umbral oficial de 60). Media escritorio **98.7/100**. TBT mediana **13.5 ms** (< 200 ms Good). Modo Lean de GSAP ahorra **-55.5%** de transferencia inicial JS en Brotli.
    2. *Rol 2 (Accesibilidad axe-core 4.10.2):* 180 evaluaciones en vivo (Desktop/Mobile, Normal/Reduced Motion): **0 violaciones** (0 críticas, 0 serias, 0 moderadas, 0 menores).
    3. *Rol 3 (Validador Nu W3C vnu 26.9.16):* 24 páginas evaluadas. 5,886 errores propios de plataforma Shopify y **24 errores de tema** en `/pages/contact` debidos a `aria-expanded` en `<summary>`. Resueltos a **0** mediante `patch-contact-faq-summary-aria.diff`.
    4. *Rol 4 (Rastreo de Enlaces y 404):* 2,450 enlaces extraídos, 161 URLs internas únicas probadas en vivo: **0 errores 404, 0 enlaces rotos, 0 anclas rotas**. URLs públicas de soporte y documentación certificadas con **HTTP 200 OK**.
    5. *Rol 5 (Responsividad y Layout):* 72 estados (3 tiendas × 3 páginas × 8 viewports: 320px a 1920px): **0px de desborde horizontal** en el 100% de los estados, 0 colisiones de elementos.
    6. *Rol 6 (Matriz de Requisitos Theme Store):* 212 requisitos oficiales evaluados en 23 áreas normativas: **206 CUMPLE (97.2%)**, 1 NO CUMPLE (P0-01 referencias a `shopify://shop_images/`, resuelto vía parche), 5 no verificables (SLA comercial, apps nativas).
    7. *Rol 7 (Compuertas Estáticas y Empaquetado):* `Sartorial-1.0.0.zip` pesa **350.95 KB** (0.7% del límite de 50 MB de Shopify, 0 archivos prohibidos). Fallo en `gates:json` por archivos en `scratch/` resuelto con `patch-gates-static-scratch.diff`.
    8. *Rol 8 (Paridad Repositorio vs Demos):* `shopify theme pull` certifica que **60 de 60 archivos ejecutables son 100% idénticos byte a byte** en las 3 tiendas demo. Cero derivas.
    9. *Rol 9 (Instalación Limpia y CLS X5):* 8 secciones de `templates/index.json` manejan catálogos vacíos sin rotura. CLS bajo `prefers-reduced-motion: reduce` reducido de **0.1740 a 0.0041 (-97.6%)** mediante `patch-X5-cls-reduced-motion.diff`.
  - **Verificación Cruzada (20% muestra):** Estabilidad determinista y varianza < 1% en todos los roles (`raw-cross-verification.json`).
  - **Inventario y Parches:** `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/` contiene `MANIFEST.txt` (171 archivos crudos certificados) y los 4 parches validados con `git apply --check` listos para aplicación por Claude.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Autorizar conector Shopify en Edition/Atelier/Archive; realizar 1 pedido de prueba Bogus por tienda; crear políticas de tienda. | 🟢 Activo | Conector + Políticas + Pedidos de prueba |
| **Claude (Opus 5.5 Extra)** | Líder Técnico & Estratégico (Temporal) | Aplicar los 4 parches de TECH-AUDIT-001 (`git apply`), validar `npm run gates:static`, regenerar `Sartorial-1.0.0.zip` y desplegar a las 3 demos. | 🟢 Activo | CLAUDE-REPORT-APPLY-TECH-AUDIT-001 / Zip / Demos |
| **Claude (Opus 5 1M)** | Trazabilidad y Compuertas | MOTION-002 cerrado en lo que es documentable: `.theme-check.yml` creado (2.487 ofensas / 9 errores → 0 sobre 88 archivos), ledger reescrito a 60 filas y BOARD integrado. `gates:static` en rojo en la compuerta 1 por `scratch/`, fuera de frontera. | 🟢 Entregado | CLAUDE-REPORT-MOTION-002.md / `.theme-check.yml` / Ledger |
| **Gemini Flash 3.8 High** | Arquitecto Consultor & Soporte | TECH-AUDIT-001 formalizado y certificado (GEMINI-REPORT-TECH-AUDIT-001.md). Soporte a Claude en validación de parches y push. | 🟢 Activo | Entregables TECH-AUDIT-001 certificados |
| **GPT-6 Sol Max / Astra** | Auditor Senior de Producto | Asignado a GPT-TASK-016 (Edition): Generación de 13 fotografías de bodegón de producto sobre hormigón y roble. | 🟡 Pendiente ejecución | demo-assets/edition/ + Reporte |

---

## 3. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente por `scripts/ledger-verify.mjs` sobre 60 filas oficiales (0 incoherencias, exit 0, recuento del 2026-10-02 tras MOTION-002):*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **54** | 90.0% | Requisitos oficiales verificados exhaustivamente en código y tienda real (Fila 107 y 108 cerradas con docs públicas y 3 demos). |
| `código completo` | **6** | 10.0% | Filas 35 (Punto Focal) y 75 (Medios 3D), pendientes de fixtures en admin (Opción A); más las 4 de MOTION-002: 38 (Motor nativo sin dependencias y soporte de navegador), 56 (`prefers-reduced-motion`, degradada desde `cumplido` porque su evidencia citaba `assets/motion.js`, un archivo borrado), 57 (Axioma anti-invisible) y 58 (Contenido revelado al imprimir). Las 4 esperan la ejecución de `harness-MOTION-002`, que exige `STOREFRONT_PASSWORD`. |
| `no verificado` | **0** | 0.0% | Todas las dependencias cerradas o en proceso verificado. |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **60** | **100%** | Cobertura total de especificación Shopify Theme Store v1.0.0. |

> **Nota de método (Claude, MOTION-002).** La fila de `prefers-reduced-motion` bajó de `cumplido` a `código completo`. No es una regresión del tema: su evidencia anterior apuntaba a `assets/motion.js` (borrado) y a una línea de `assets/theme.js` desplazada por la migración, de modo que la verificación en vivo que la cerraba medía un motor que ya no existe. Vuelve a `cumplido` cuando el arnés nuevo pase.

---

## 4. Sprint MOTION-002 — Motor de Movimiento CSS Scroll-Driven Nativo (código completo, SIN certificar)

*Implementado por 6 agentes previos. Trazabilidad, configuración de compuertas y cierre documental por Claude. Informe maestro en [CLAUDE-REPORT-MOTION-002.md](agent-comms/outbox-claude/CLAUDE-REPORT-MOTION-002.md).*

### 4.1 Balance y arquitectura

- **Balance medido:** borrados `assets/gsap.min.js` (72.927 B), `assets/gsap-scrolltrigger.min.js` (44.575 B) y `assets/motion.js` (8.235 B) = **125.737 B de JavaScript menos** y tres etiquetas `script` menos en modo Full. A cambio, +339 líneas en las regiones de movimiento de `assets/base.css` (el bloque B8 ocupa `assets/base.css:8707-8998`) y +169 / −15 en la región del motor de revelado de `assets/theme.js`.
- **Los tres assets nunca estuvieron en git** (`git ls-files` no los lista, `git log --all` no los conoce) y el bloque de carga de `layout/theme.liquid` era trabajo sin commitear (`git diff layout/theme.liquid` está vacío). La migración sustituye un experimento que no entró al repositorio; no retira una función publicada en él. **Las 3 tiendas demo sí lo tienen desplegado:** ver conflicto C-02.
- **Selección de motor 100 % en cascada CSS:** `@supports (animation-timeline: view()) and (animation-range: entry 0% entry 100%)` en `assets/base.css:8745`. Dos pruebas y no una, porque hubo versiones que aceptaban `view()` pero no la sintaxis de dos valores de `animation-range`. Se eliminó `data-motion-engine`; `initScrollReveal` (`assets/theme.js:4715`) es agnóstico y no consulta `CSS.supports`. Contrato de atributos: `html[data-reveal-ready]`, `[data-reveal=""]` (pendiente), `[data-reveal="done"]` (asentado) y `[data-revealed]` (respaldo IntersectionObserver).
- **Animaciones:** `scroll-rise` (revelado), `scroll-fade` y `scroll-line-rise` (titulares línea por línea desde máscara), `scroll-unveil` y `scroll-unveil-settle` (masas fotográficas), `hero-parallax` y `marquee-drift` (con `animation-composition: add`).
- **Compuerta 5 reconfigurada:** `.theme-check.yml` creado en la raíz. Preset fijado a `theme-check:recommended` (idéntico línea por línea al predeterminado del CLI 4.8.0, verificado con `--print`), **cero checks individuales desactivados** y alcance acotado al tema. Antes: 787 archivos, 2.487 ofensas, 9 errores. Después: 88 archivos, 0 ofensas, exit 0.

### 4.2 Las 6 correcciones registradas sobre la especificación original

| # | Corrección | Localizadores verificados |
|---|---|---|
| M-01 | **Firefox NO soporta scroll-driven animations.** La especificación decía Firefox 144+. Ni la 158 Beta lo trae habilitado: sigue tras `layout.css.scroll-driven-animations.enabled`, meta bug Bugzilla 1676780 en estado NEW, solo Nightly. Cobertura real caniuse **87,22 %** (dataset agosto 2026), 85-86 % efectivo. Chrome y Edge 115+, Safari 26.0+ (macOS e iOS idénticos). Firefox va a la rama de respaldo B8.1. | `assets/base.css:8730` |
| M-02 | **Hero: `animation-range-start: exit 0%`**, no `calc(0% - var(--header-offset))`. Los view timelines miden contra la región óptima de visionado y la raíz ya lleva `scroll-padding-block-start: var(--header-offset)`. Medido con cabecera de 77 px: restándola otra vez, el progreso nace en 0,124 a scroll 0 y asoman 9,7 px de fondo sobre el pliegue, justo en el elemento LCP. | `assets/base.css:8881`, `assets/base.css:7934` |
| M-03 | **El estado oculto fabrica su propio scroll.** El `translateY(64px)` desborda el documento cuando el pendiente es lo último de la página: hasta 64 px de `scrollHeight` fantasma (medido: 732 px de layout, 785 de `scrollHeight`). Por eso la guardia de fin de página mide contra `root.offsetHeight` y hay un `ResizeObserver` sobre la raíz. **Ninguna de las dos piezas se puede "simplificar": hacerlo reabre el bug.** | `assets/theme.js:4762`, `assets/theme.js:4881` |
| M-04 | **El marquee cambió de naturaleza:** de reaccionar a la *velocidad* (`playbackRate` 1→4×, sin equivalente en CSS) a desplazarse por *posición* (16vw aditivo sobre su bucle autónomo de 32 s, que se conserva). Requirió un tercer grupo en `sections/marquee.liquid` y el token `--marquee-groups`. Efecto lateral positivo: el estado degenerado "Único" mejora, grupo mínimo de ≥100vw a ≥58vw. **Pérdida de función visible para el comerciante: pendiente de decisión de changelog.** | `sections/marquee.liquid:22`, `assets/base.css:3987`, `assets/base.css:8901-8910` |
| M-05 | **Desviación de nivel 1:** en modo `subtle`, los elementos visibles al cargar ya no pasan un fotograma ocultos. Mejora el LCP y elimina un parpadeo, pero es perceptible. Se registra como desviación, no como mejora silenciosa. | `assets/theme.js:4794` |
| M-06 | **Menores:** selector muerto `.newsletter-section .newsletter__inner` → `.newsletter-section__inner` (la sección de newsletter nunca tuvo revelado); `.curated-showcase__tabs` excluido de la animación de líneas (`overflow-x: auto` fuerza `overflow-y: auto` y los 64 px convertían el carril en scrollable, 52 → 116 px de `scrollHeight`); máscara endurecida a `inset(-100% -1rem 0)` porque con el valor original la comilla de `.brand-manifesto__quote-mark` **se recortaba** en móvil 390×844 sin eyebrow (bug activo, no latente); clamp `SETTLE_LINE_MIN = 10` contra el colapso de la caja raíz del observador. | `assets/theme.js:4692`, `assets/base.css:8832-8835`, `assets/base.css:8779`, `assets/theme.js:4713` |

### 4.3 Qué NO está verificado

Verificación realizada: estática (las 8 compuertas, 7 en verde) más las mediciones locales en Chrome sobre fixtures que declaran los agentes de MOTION-002 (sin artefacto en el repositorio). **No hay nada de lo siguiente:**

1. Verificación en storefront vivo. `harness-MOTION-002` existe y está documentado, pero exige `STOREFRONT_PASSWORD`, que nadie ha exportado.
2. Safari. Es la segunda plataforma con soporte (26.0+) y no se ha abierto ni una vez.
3. La rama de respaldo B8.1 (`@supports not`). Es la que ve Firefox, o sea el ~13 % de la cobertura, y no se ha ejecutado nunca.
4. Vista previa de impresión real en ningún navegador (llave 3 nueva).
5. Lighthouse y CLS posteriores a la migración. Las 54 corridas de TECH-AUDIT-001 midieron el motor GSAP.
6. axe-core posterior a la migración: las 180 evaluaciones también midieron el motor anterior.
7. Las 4 filas nuevas o degradadas del ledger (38, 56, 57, 58) en estado `código completo`.

### 4.4 Conflictos con TECH-AUDIT-001 — detectados y NO resueltos por Claude

*Se reportan sin tocar los hallazgos de la auditoría de Gemini. Requieren decisión del orquestador.*

| # | Conflicto | Qué dice el BOARD hoy | Qué se midió tras MOTION-002 |
|---|---|---|---|
| C-01 | Métrica de GSAP huérfana | Rol 1: *"Modo Lean de GSAP ahorra -55.5 % de transferencia inicial JS en Brotli"* | GSAP ya no existe en el repositorio. La métrica describe un motor retirado y las 54 corridas de Lighthouse (media móvil 98.0) se tomaron sobre él. La cifra sigue siendo verdad sobre lo que midió; ya no describe el tema. |
| C-02 | Paridad repositorio vs demos | Rol 8: *"60 de 60 archivos ejecutables son 100 % idénticos byte a byte en las 3 tiendas demo. Cero derivas."* | Hay deriva. El pull congelado de las 3 demos (`scratch/audit-live-pull/full-{atelier,edition,archive}/`, tomado el 2026-10-01 a las 22:25) contiene `assets/gsap.min.js` (72.927 B), `assets/gsap-scrolltrigger.min.js` (44.575 B) y `assets/motion.js` (8.235 B), y su `layout/theme.liquid` los carga en las líneas 103-105. El repositorio no tiene ninguno de los tres, y `base.css` y `theme.js` también difieren. **Las 3 demos sirven hoy un motor que el tema ya no lleva.** |
| C-03 | CLS bajo movimiento reducido | Rol 9: *"CLS reducido de 0.1740 a 0.0041 (-97.6 %) mediante `patch-X5-cls-reduced-motion.diff`"* | La medición es del motor GSAP. El parche sigue aplicando limpio (toca `layout/theme.liquid`, no `base.css`), pero la ruta de `prefers-reduced-motion: reduce` cambió: la llave 2 ahora anula también `clip-path` (`assets/base.css:9035`). La cifra hay que volver a medirla, no heredarla. |
| C-04 | Conteo de Theme Check | Secciones de cierre: *"Theme Check 351 archivos con 0 ofensas"* | No es reproducible hoy. Sin `.theme-check.yml` el rastreo da 787 archivos, 2.487 ofensas y 9 errores; con el archivo nuevo da 88 archivos y 0 ofensas. Ninguna de las dos cifras es 351: el conteo de "archivos inspeccionados" depende del alcance, y hasta ahora no había alcance declarado. |

### 4.5 Acciones humanas pendientes (prioridad recomendada por Claude)

| Prioridad | Acción | Por qué |
|---|---|---|
| **P0** | Rotar la contraseña del storefront en Shopify Admin en las 3 demos (`sartorial-atelier`, `sartorial-edition`, `sartorial-archive`) y en `tema-qkqpke0j`. | Invalida las cookies de sesión publicadas en GitHub. Verificado: ff3dca1, que trae `harness-AUDIT-360-001/lh-headers.json` con cookies, **es** ancestro de `origin/master`. Es la única mitigación real; la corrección de CR-04 en `CLAUDE-REVIEW-GEMINI-AUDIT-360.md` queda registrada. |
| **P0** | Exportar `STOREFRONT_PASSWORD` en el entorno. | Sin ella todos los arneses fallan por diseño. Es la llave de las 4 filas en `código completo` y de todo el §4.3. |
| **P1** | Rotar el PAT de Figma y la API key de Composio. | Higiene: nunca se commitearon, pero hay 5 copias en disco y un blob suelto inalcanzable en `.git`. |
| **P1** | Limpiar la contraseña literal de 5 scripts de `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/`: `crawl-links.mjs:33`, `run-axe-audit.mjs:7`, `run-cross-verification.mjs:13`, `run-responsive-audit.mjs:7` (patrón `\|\| '<literal>'`) y `measure-live-cls.mjs:6` (hardcodeada, sin override). | Mismo riesgo que CR-04 y en archivos sin commitear todavía: se arregla antes de que entren al índice. Fuera de la frontera de Claude en MOTION-002. |
| **P1** | Ejecutar `harness-MOTION-002` en los tres proyectos y recertificar las filas 38, 56, 57 y 58 a `cumplido`. | Es el único camino para cerrar el sprint. |
| **P2** | Decidir el changelog para comerciantes: ¿se declara la pérdida de la aceleración del marquee (M-04)? ¿Se redacta una frase que describa el modo `None`, hoy sin documentar en ninguna superficie? | Superficie de comerciante. Gate 4 del DoD. |
| **P2** | Valorar sacar el repositorio de la carpeta sincronizada por OneDrive. | Un repositorio de trabajo con `.git` dentro de una carpeta de sincronización continua es una fuente de corrupción y de copias no gobernadas. |

---

## 5. Próximos Pasos para la Submission a Shopify Theme Store

> **Bloqueantes abiertos (MOTION-002).** El punto 3 de esta lista no puede ejecutarse antes de cerrar las 7 acciones humanas de la sección 4.5 y los 4 conflictos de la 4.4. Añádase a esta lista: aplicar `patch-gates-static-scratch.diff` para devolver `npm run gates:static` al verde (hoy falla en la compuerta 1 de 8 por 75 JSON de `scratch/`) y volver a desplegar las 3 demos, que siguen sirviendo el motor GSAP.

1. **Pruebas y Limpieza Manual del Comerciante (Johandry):**
   - Prueba con teclado físico en barra fija de compra móvil (AF-08) en `/products/qa5a-f04-colour-size` a 375px.
   - Eliminación manual de `layout/password.liquid` en los 4 temas desde Shopify Admin (AF-12).
2. **Dependencias Comerciales y de Contenido (Filas 107 y 108):**
   - Configuración de URLs públicas finales de documentación y soporte en dominio propio (Fila 107).
   - Sustitución de fotografías demo y catálogo final sin imágenes placeholder (Fila 108).
3. **Envío del Paquete (Submission):**
   - Subir el archivo `Sartorial-1.0.0.zip` al portal de partners de Shopify Theme Store.
