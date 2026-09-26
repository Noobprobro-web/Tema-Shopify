# GEMINI-REPORT-AUDIT-360-001: Auditoría Integral Multiagente 360° Pre-Submission Sartorial

```text
ID: GEMINI-REPORT-AUDIT-360-001
Fecha: 2026-09-26
Origen: GEMINI-TASK-AUDIT-360-001 (Johandry)
Base auditada: master 2f42c4f (HEAD limpio de código fuente)
Modo: SOLO LECTURA sobre código del tema, documentación, ledger y tienda remota.
Tienda evaluada: tema-qkqpke0j.myshopify.com (Temas: Couture #165809488115, Sartorial #166186909939, Edition #166186942707, Archive #166187041011)
Harness de pruebas: harness-AUDIT-360-001/
Áreas multiagente: .agents/teamwork/audit360/ (Tracks 01 al 13)
Estado: NO APTO
Decisión requerida: Johandry debe definir la estrategia de hosting/dominio para soporte y documentación (Fila 107), autorizar la creación de las 3 tiendas demo públicas (Fila 108) y aprobar el sprint técnico correctivo (custom_liquid en main-product, normalización CRLF en ledger-verify y bucle recently-viewed).
```

## Resumen Ejecutivo (5 líneas)
1. **Frontend y Calidad Técnica Sobresalientes:** 0 violaciones WCAG 2.2 AA en axe-core en los 4 temas y 3 viewports, CLS = 0.0000 en móvil, rendimiento Lighthouse de 84/100 y 0 ofensas de Theme Check en los 150 archivos.
2. **Bloqueadores Comerciales Críticos (P0):** La sumisión a Shopify Theme Store sería rechazada de inmediato porque las URLs de documentación y soporte apuntan a un dominio público inexistente (`ruizdigital.com`), el formulario de contacto es un `mailto:` no conforme, y no existen las 3 tiendas demo públicas independientes (Filas 107 y 108 abiertas).
3. **Brechas Técnicas de Requisitos Shopify (P1):** `sections/main-product.liquid` omite el bloque `custom_liquid` expresamente exigido por Shopify, y el script de verificación `scripts/ledger-verify.mjs` falla en copias de archivo limpio bajo Windows por sensibilidad a saltos de línea CRLF.
4. **Deuda Técnica y Resiliencia (P2):** `sections/recently-viewed.liquid` contiene un bucle sin límite explícito de productos, `assets/theme.js` no limpia listeners en `shopify:section:unload`, y el tema depende exclusivamente de Nuevas Cuentas de Cliente sin plantillas para Cuentas Clásicas.
5. **Veredicto Realista:** El tema es técnicamente de clase mundial pero administrativamente **NO APTO** hasta subsanar las 2 dependencias comerciales externas y los 2 hallazgos técnicos P1.

---

## 1. Dictamen y Motivo

### Veredicto: NO APTO

**Motivo:**
Shopify Theme Store aplica una revisión estricta en dos fases: verificación administrativa/comercial y revisión funcional/técnica. Aunque el código Liquid, CSS, JavaScript y la accesibilidad superan con holgura los umbrales de aceptación técnica, la revisión sería rechazada en el primer filtro humano por:
1. **Falta de soporte y documentación funcionales (Fila 107 / P0):** Los enlaces de `theme_info` (`https://ruizdigital.com/themes/sartorial/docs` y `support`) devuelven error de resolución de nombre (dominio no registrado/activo). El formulario actual en `docs/merchant/support.html` usa el protocolo `mailto:`, no permite adjuntar capturas/vídeos y carece de confirmación automática de recepción de ticket.
2. **Falta de tiendas demo públicas (Fila 108 / P0):** No existen 3 tiendas de desarrollo independientes de tipo Client Transfer con pasarela de prueba activa y sin contraseña para Sartorial, Edition y Archive.
3. **Incumplimiento de Bloques en PDP (P1):** `sections/main-product.liquid` carece de bloque `custom_liquid`, violando la regla de Shopify que exige añadir Custom Liquid donde se admita un app block.
4. **Fallo de Gate Estático en Entorno Limpio (P1):** `npm run gates:static` ejecutado sobre una extracción de `git archive HEAD` falla en `scripts/ledger-verify.mjs` debido al manejo de finales de línea CRLF en Windows.

---

## 2. Matriz de Hallazgos P0 a P2

| ID | Severidad y Área | `archivo:línea` | Qué pasa y cómo se reproduce | Parche propuesto | Dueño | Esfuerzo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A360-01** | **P0** / Comercial | `config/settings_schema.json:7,12`<br>`docs/merchant/support.html:176` | `theme_documentation_url` y `theme_support_url` apuntan a `ruizdigital.com` (dominio inexistente). El formulario es `mailto:`, sin subida de archivos ni auto-responder. **Prueba:** Petición HTTP a la URL da fallo de conexión; inspección de `support.html` muestra `action="mailto:"`. | Registrar/activar el dominio o alojar temporalmente en un servicio público (ej. GitHub Pages / Vercel con dominio propio). Conectar el formulario a un webhook / servicio de soporte real (Zendesk / Formspree / HelpScout) con subida de adjuntos y campo de contraseña. | Johandry | Medio (Comercial / Infra) |
| **A360-02** | **P0** / Comercial | `config/settings_data.json:presets`<br>`listings/` | Faltan las 3 tiendas demo públicas independientes requeridas por Shopify (Sartorial, Edition, Archive). Solo existe 1 tienda dev (`tema-qkqpke0j.myshopify.com`) protegida con password. **Prueba:** Inspección del Partner Dashboard y ausencia de URLs demo públicas. | Crear 3 tiendas de desarrollo con Client Transfer habilitado, importar los catálogos y plantillas de `listings/`, activar Bogus Gateway y deshabilitar contraseña. | Johandry | Medio (Gestión Shopify) |
| **A360-03** | **P1** / Liquid | `sections/main-product.liquid:1072` | `main-product.liquid` soporta `@app` pero **NO** incluye el bloque `custom_liquid`. Shopify Theme Store exige explícitamente: *"Add a Custom Liquid block anywhere you'd consider adding an app block"*. `featured-product.liquid` sí lo tiene (L741). **Prueba:** `node harness-AUDIT-360-001/audit-02-liquid.mjs`. | Añadir bloque `custom_liquid` al schema de `main-product.liquid` y su respectivo renderizado `{{ block.settings.custom_liquid }}` idéntico a `featured-product.liquid`. | Claude | 30 min |
| **A360-04** | **P1** / CI & Gates | `scripts/ledger-verify.mjs:58` | Al correr `gates:static` sobre una extracción limpia de `git archive HEAD` en Windows, `source.split('\n')` preserva retornos de carro `\r`, provocando que la comparación de cabeceras (`lines[headerLine] !== summary`) falle. **Prueba:** `node harness-AUDIT-360-001/run-archive-gates-breakdown.mjs`. | Normalizar saltos de línea al leer el archivo: `source.replace(/\r\n/g, '\n').split('\n')` o recortar `trimEnd()`. | Claude | 15 min |
| **A360-05** | **P2** / Liquid & Perf | `sections/recently-viewed.liquid:34` | `{%- for result in search.results -%}` itera sin atributo `limit:` ni paginación Liquid en la sección. Si se solicita directamente vía Section Rendering API con muchos IDs, genera renderizado masivo. **Prueba:** `node harness-AUDIT-360-001/audit-02-liquid.mjs`. | Añadir `limit: section.settings.products_to_show | default: 4` al bucle `for`. | Claude | 15 min |
| **A360-06** | **P2** / JS Lifecycle | `assets/theme.js:4683,4734` | `theme.js` escucha `shopify:section:load` para re-instanciar componentes pero carece de manejadores para `shopify:section:unload`. En sesiones largas del editor se retienen elementos en memoria. **Prueba:** `node harness-AUDIT-360-001/audit-03-javascript.mjs`. | Implementar evento `shopify:section:unload` para llamar al método `disconnectedCallback()` o limpiar observadores/listeners del elemento desmontado. | Claude | 45 min |
| **A360-07** | **P2** / Arquitectura | `templates/customers/` | El tema no incluye plantillas clásicas de clientes (`customers/login.liquid`, `customers/register.liquid`, `customers/account.liquid`), confiando únicamente en Nuevas Cuentas (`<shopify-account>`). Si un comerciante usa Cuentas Clásicas, se renderiza sin estilizar. **Prueba:** `Test-Path templates/customers` devuelve falso. | Evaluar si se añaden plantillas mínimas JSON/Liquid para Cuentas Clásicas o se documenta como requisito exclusivo de "New Customer Accounts". | Gemini / Johandry | 1 hora |
| **A360-08** | **P2** / Editor UX | `locales/en.default.json:sections.cart.complimentary_additions` | La clave `sections.cart.complimentary_additions` está traducida en Title Case: `"Complimentary Additions"`. Directriz de Shopify exige Sentence Case estricto. **Prueba:** `node harness-AUDIT-360-001/audit-08-merchant-editor.mjs`. | Cambiar traducción a `"Complimentary additions"`. | Claude | 5 min |

---

## 3. Matriz Completa de Requisitos Oficiales de Shopify Theme Store

*Fuente de verdad: `https://shopify.dev/docs/storefronts/themes/store/requirements` leída el 26/09/2026.*

| Requisito Oficial de Shopify | Estado | Evidencia y Comprobación |
| :--- | :--- | :--- |
| **Estructura del paquete .zip** (sin mercados, sin archivos de OS, estructura estándar) | **CUMPLE** | `gates:package` exit 0. `zip-list` verificado: 0 archivos ocultos, 0 carpetas prohibidas. |
| **Presets requeridos** (uno con el mismo nombre del tema, máximo 4, nombres 1-2 palabras) | **CUMPLE** | Tema: Sartorial. Presets: Sartorial, Edition, Archive (+ Couture en current). Nombres concisos y conformes. |
| **Carpeta `listings/` con plantillas únicas para cada preset** | **CUMPLE** | `listings/sartorial/templates`, `listings/edition/templates`, `listings/archive/templates` presentes con `index.json`, `collection.json`, `product.json`. |
| **Cero dependencias externas y scripts alojados en Shopify** | **CUMPLE** | `audit-04-security.mjs`: 0 CDNs externos en Liquid y JS. Todos los scripts e iconos son nativos. |
| **Soporte de Bloques `@app` en secciones de producto** | **CUMPLE** | `sections/main-product.liquid:1072` y `featured-product.liquid:441` tienen bloques `@app`. |
| **Soporte de Bloques `custom_liquid` donde haya `@app`** | **NO CUMPLE** | `sections/main-product.liquid` omite `custom_liquid` (**A360-03**). `featured-product.liquid` sí lo incluye. |
| **Compatibilidad con Online Store 2.0 y Section Groups** | **CUMPLE** | `sections/header-group.json` y `footer-group.json` operativos. 100% plantillas JSON. |
| **Precios unitarios (`variant.unit_price`) en Collection, PDP y Carrito** | **CUMPLE** | Verificado en vivo en PDP (`qa5a-f04-colour-size`), en tarjeta de producto y en `cart-drawer.liquid:211-221`. |
| **Pickup availability (`pickup-availability`) en PDP** | **CUMPLE** | Verificado en vivo en `audit-07-commerce.mjs` con componente `pickup-availability` funcional. |
| **Selling plans (Suscripciones) en PDP y Carrito** | **CUMPLE** (en Liquid) | Implementado en `sections/main-product.liquid:477-585` y `sections/cart-drawer.liquid:175`. Falta app fixture en dev store. |
| **Gift Card con formulario de destinatario (`recipient-form`)** | **CUMPLE** (en Liquid) | Implementado en `snippets/recipient-form.liquid` y `templates/gift_card.liquid`. Cumple Apple Wallet y QR code (L383 requirements). |
| **Carrito con soporte de notas, cuotas Shop Pay y descuentos** | **CUMPLE** | `cart.note` sanitizado, cuotas y descuentos a nivel de línea y carrito totalmente operativos. |
| **Búsqueda predictiva con filtros nativos y tipos de objeto** | **CUMPLE** | `main-search.liquid` soporta productos, artículos y páginas. Filtros facetados con ordenamiento y paginación. |
| **Blog con artículos, extracto y comentarios paginados** | **CUMPLE** | `templates/article.json` y `templates/blog.json` verificados. Paginación y formulario de comentarios presentes. |
| **Plantilla 404 con mensaje claro y enlace/búsqueda de navegación** | **CUMPLE** | Verificado en vivo en `https://tema-qkqpke0j.myshopify.com/404` (L51 `report-07-commerce.json`). |
| **Plantilla Password con formulario de acceso de Shopify** | **CUMPLE** | `templates/password.json` y `sections/main-password.liquid` operativos. |
| **Selectores de localización (País/Moneda e Idioma)** | **CUMPLE** | `localization-form__form` con 2 formularios y selectores activos en header y footer. |
| **Accesibilidad WCAG 2.2 Nivel AA** (Contraste 4.5:1 / 3:1, Foco visible, Teclado, Targets >= 24x24) | **CUMPLE** | 0 violaciones de axe-core en los 4 temas. Targets táctiles verificados >= 44x44px. Contraste de velo Archive >= 4.85:1. |
| **Rendimiento Core Web Vitals** (CLS < 0.1, Lighthouse >= 60) | **CUMPLE** | CLS móvil = 0.0000, CLS desktop <= 0.0493. Lighthouse Performance = 84 / A11y = 100. |
| **Superficie del Comerciante** (100% claves `t:`, Sentence Case, sin términos internos) | **APTO CON OBS.** | 100% claves `t:`, 0 etiquetas huérfanas, 100% paridad EN/ES. 1 caso de Title Case en EN (**A360-08**). |
| **Sin contenido falso ni tácticas engañosas de escasez/urgencia** | **CUMPLE** | 0 contadores falsos de stock, 0 temporizadores artificiales, 0 claims no verificables. |
| **Derechos de autor e imágenes auténticas** (sin lorem ipsum) | **CUMPLE** | 0 cadenas "lorem ipsum", 0 imágenes de placeholder de Shopify. Fotografía editorial propia. |
| **Páginas públicas de Documentación y Soporte** | **NO CUMPLE** | URLs apuntan a dominio inactivo `ruizdigital.com` (**A360-01**). |
| **Formulario de soporte con los 8 campos obligatorios** | **NO CUMPLE** | Formulario `mailto:` carece de adjuntos, campo de contraseña y auto-responder (**A360-01**). |
| **3 Tiendas Demo de Transferencia independientes y públicas** | **NO CUMPLE** | No existen en el Shopify Partner Dashboard (**A360-02**). |

---

## 4. Rendimiento Lighthouse y Core Web Vitals (Medición Empírica)

Medición realizada con Google Chrome v140.0.7339.186 y Lighthouse v13.5.0 conectando a sesión autenticada con cookies en `tema-qkqpke0j.myshopify.com`.

### 4.1. Auditoría Lighthouse (Couture - Home)
- **Rendimiento General:** **84 / 100** *(Requisito Theme Store: >= 60)*
- **Accesibilidad:** **100 / 100** *(Requisito Theme Store: >= 90)*
- **Cumulative Layout Shift (CLS):** **0.000** *(Requisito: < 0.1)*
- **Total Blocking Time (TBT):** **250 ms**
- **First Contentful Paint (FCP):** **2.1 s** *(con emulación de red 4G lenta de Lighthouse)*

### 4.2. Matriz de Core Web Vitals Reales en Navegador (72 Corridas, Mediana Estadística)

*Datos extraídos mediante `PerformanceObserver` nativo W3C (`LargestContentfulPaint`, `layout-shift`, `navigation`). Medición sobre 3 corridas consecutivas con caché normal de navegador.*

| Tema | Página | Dispositivo | LCP Corridas (ms) | **LCP Mediana** | CLS Corridas | **CLS Mediana** | FCP Mediana | TTFB Mediana |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Couture** | Home | Mobile (375px) | 752, 496, 528 | **528 ms** | 0, 0, 0 | **0.0000** | 524 ms | 204 ms |
| Couture | Home | Desktop (1280px) | 856, 588, 572 | **588 ms** | 0.0493, 0.0493, 0.0484 | **0.0493** | 504 ms | 191 ms |
| Couture | Colección | Mobile (375px) | 660, 676, 600 | **660 ms** | 0, 0, 0 | **0.0000** | 660 ms | 329 ms |
| Couture | Colección | Desktop (1280px) | 1232, 1160, 1052 | **1160 ms** | 0.0012, 0.0014, 0.0014 | **0.0014** | 632 ms | 291 ms |
| Couture | Producto | Mobile (375px) | 768, 508, 1228 | **768 ms** | 0, 0, 0 | **0.0000** | 684 ms | 346 ms |
| Couture | Producto | Desktop (1280px) | 688, 388, 684 | **684 ms** | 0.0024, 0, 0.0025 | **0.0024** | 652 ms | 318 ms |
| **Sartorial**| Home | Mobile (375px) | 692, 1340, 636 | **692 ms** | 0, 0, 0 | **0.0000** | 620 ms | 309 ms |
| Sartorial | Home | Desktop (1280px) | 536, 620, 492 | **536 ms** | 0.0493, 0.0501, 0.0493 | **0.0493** | 488 ms | 186 ms |
| Sartorial | Colección | Mobile (375px) | 644, 632, 568 | **632 ms** | 0, 0, 0 | **0.0000** | 600 ms | 312 ms |
| Sartorial | Colección | Desktop (1280px) | 1204, 1164, 1144 | **1164 ms** | 0.0014, 0.0012, 0.0014 | **0.0014** | 576 ms | 285 ms |
| Sartorial | Producto | Mobile (375px) | 632, 200, 576 | **576 ms** | 0, 0, 0 | **0.0000** | 540 ms | 245 ms |
| Sartorial | Producto | Desktop (1280px) | 216, 572, 1716 | **572 ms** | 0, 0.0014, 0.0025 | **0.0014** | 528 ms | 256 ms |
| **Edition**  | Home | Mobile (375px) | 2600, 492, 664 | **664 ms** | 0, 0, 0 | **0.0000** | 652 ms | 358 ms |
| Edition   | Home | Desktop (1280px) | 228, 240, 216 | **228 ms** | 0, 0, 0 | **0.0000** | 228 ms | 40 ms |
| Edition   | Colección | Mobile (375px) | 688, 704, 660 | **688 ms** | 0, 0, 0 | **0.0000** | 672 ms | 321 ms |
| Edition   | Colección | Desktop (1280px) | 1152, 1180, 1120 | **1152 ms** | 0.0014, 0.0012, 0.0014 | **0.0014** | 612 ms | 282 ms |
| Edition   | Producto | Mobile (375px) | 628, 640, 608 | **628 ms** | 0, 0, 0 | **0.0000** | 584 ms | 256 ms |
| Edition   | Producto | Desktop (1280px) | 592, 616, 580 | **592 ms** | 0.0014, 0.0014, 0.0020 | **0.0014** | 540 ms | 260 ms |
| **Archive**  | Home | Mobile (375px) | 680, 712, 644 | **680 ms** | 0, 0, 0 | **0.0000** | 640 ms | 315 ms |
| Archive   | Home | Desktop (1280px) | 548, 560, 520 | **548 ms** | 0.0493, 0.0493, 0.0488 | **0.0493** | 496 ms | 195 ms |
| Archive   | Colección | Mobile (375px) | 644, 668, 620 | **644 ms** | 0, 0, 0 | **0.0000** | 610 ms | 318 ms |
| Archive   | Colección | Desktop (1280px) | 1172, 1192, 1140 | **1172 ms** | 0.0014, 0.0014, 0.0012 | **0.0014** | 580 ms | 288 ms |
| Archive   | Producto | Mobile (375px) | 612, 636, 592 | **612 ms** | 0, 0, 0 | **0.0000** | 560 ms | 250 ms |
| Archive   | Producto | Desktop (1280px) | 580, 604, 568 | **580 ms** | 0.0014, 0.0014, 0.0022 | **0.0014** | 532 ms | 255 ms |

**Diagnóstico de Rendimiento:**
- **CLS móvil:** 0.0000 en el 100% de las páginas y temas. Estabilidad visual perfecta.
- **CLS desktop:** Máximo de 0.0493 en Home (debido a la carga de la fuente tipográfica en el hero editorial), muy por debajo del umbral crítico de 0.1.
- **LCP:** Mediana máxima de 1172 ms en Colección Desktop (renderizado de grilla con múltiples imágenes responsive con `srcset`). Todas las páginas cargan por debajo de 1.2 segundos reales.
- **Imágenes:** Las imágenes principales de cabecera implementan `loading="eager"`, `fetchpriority="high"`, `srcset` y `sizes="100vw"`.

---

## 5. Ideas y Propuestas de Producto (P3) para Competir a 380 USD

Basado en el benchmark de temas premium de moda en la Shopify Theme Store (*Prestige, Impact, Be Yours, Symmetry, Stiletto*):

| ID | Propuesta de Funcionalidad | Justificación Competitiva | Impacto | Esfuerzo |
| :--- | :--- | :--- | :--- | :--- |
| **A360-P3-01** | **Modal de Quick View Accesible** | Los compradores de moda de alta gama en desktop prefieren explorar detalles de tallas y añadir al carrito sin abandonar el grid de colección. Debe construirse con `<dialog>` nativo y trampeo de foco. | Alto | 4 horas |
| **A360-P3-02** | **Sticky Add-to-Cart Bar en Mobile** | En PDPs extensas con muchas fotos o bloques narrativos de materiales, el botón de compra desaparece del viewport. Una barra fija inferior al hacer scroll acelera la conversión móvil. | Alto | 2.5 horas |
| **A360-P3-03** | **Modo de Lanzamiento / Drop Countdown** | Marcas de moda de autor utilizan lanzamientos limitados (cápsulas). Un bloque de cuenta regresiva sobrio con aviso de lanzamiento fortalece el posicionamiento editorial. | Medio | 2 horas |
| **A360-P3-04** | **Selector de Vista de Colección (1 vs 2 columnas en mobile)** | Permite al usuario alternar entre una vista de catálogo denso (2 columnas) o una vista editorial de gran formato (1 columna). Estándar en temas modernos de moda. | Medio | 1.5 horas |
| **A360-P3-05** | **Renombrar identificadores de schema técnicos** | El setting id `popover_position` en `sections/lookbook.liquid` utiliza internamente jerga técnica. Aunque el label visible es "Product card position", renombrar a `card_position` unifica la coherencia del código. | Bajo | 15 min |

---

## 6. Estado Real frente al BOARD y al Ledger

### Declaraciones del BOARD que no se sostienen con evidencia empírica:
1. **Afirmación en BOARD:** *"Estado del Tema: 100% CERTIFICADO Y LISTO PARA THEME STORE"*.
   - **Realidad:** **FALSA**. El tema no puede estar 100% listo cuando las Filas 107 y 108 de `docs/requirements-ledger.md` permanecen abiertas por falta de dominio público para soporte/documentación y ausencia de las 3 tiendas demo públicas independientes. Si se enviara hoy a Shopify, sería rechazado.
2. **Afirmación en BOARD:** *"gates:static exit 0"*.
   - **Realidad:** **PARCIALMENTE FALSA en empaquetado de producción**. Corre con éxito en el workspace sucio, pero en una extracción limpia desde `git archive HEAD` bajo Windows, `scripts/ledger-verify.mjs` falla por incompatibilidad CRLF.
3. **Afirmación en BOARD:** *"Requisitos de PDP cubiertos"*.
   - **Realidad:** **INCUMPLIMIENTO P1**. Se omitió el bloque `custom_liquid` en `sections/main-product.liquid`.

---

## 7. Plan Propuesto: Siguiente Sprint Técnico

### Fase 1: Correcciones Técnicas Inmediatas (Claude - 1.5 horas)
1. **P1 - A360-03:** Añadir bloque `custom_liquid` a `sections/main-product.liquid` (schema y renderizado).
2. **P1 - A360-04:** Corregir `scripts/ledger-verify.mjs` normalizando `\r\n` a `\n` antes de comparar cabeceras.
3. **P2 - A360-05:** Añadir `limit:` al bucle `for` en `sections/recently-viewed.liquid:34`.
4. **P2 - A360-08:** Corregir `"Complimentary Additions"` a `"Complimentary additions"` en `locales/en.default.json`.
5. **P2 - A360-06:** Añadir limpieza de observadores/listeners para `shopify:section:unload` en `assets/theme.js`.

### Fase 2: Infraestructura Comercial y Soporte (Johandry - 1 día)
1. **P0 - A360-01:** Definir y activar el dominio público para soporte y documentación (ej. `ruizdigital.com` o subdominio en hosting estable).
2. **P0 - A360-01:** Implementar backend funcional para el formulario de soporte con subida de capturas, campo de password de storefront y respuesta automática.
3. **P0 - A360-02:** Crear las 3 tiendas demo de desarrollo en el Partner Dashboard (Client Transfer habilitado), cargar los templates de `listings/` y habilitar Bogus Gateway sin contraseña.

### Fase 3: Certificación y Submission Final
1. Correr `npm run gates:static` sobre `git archive HEAD` limpio.
2. Prueba funcional de extremo a extremo en las 3 tiendas demo públicas.
3. Generación del paquete final `Sartorial-1.0.0.zip` y envío al proceso de revisión de Shopify.

---

## 8. Anexo de Descartados y No Verificados

### Hallazgos Candidatos Falsificados (Descartados)
1. **Candidato: Checkboxes en `complete-the-look` violan tamaño mínimo táctil de 24x24px (WCAG 2.2 SC 2.5.8):**
   - *Motivo del descarte:* El input nativo mide 20x20px, pero está envuelto en `<label class="complete-the-look__check">` cuyo bounding box medido en vivo es de **44x44px**. El criterio WCAG 2.2 exime explícitamente a los elementos donde el área clicable combinada del control y su etiqueta asociada cumple la dimensión requerida.
2. **Candidato: Inseguridad o falta de escape en `cart.note` y propiedades de línea:**
   - *Motivo del descarte:* La inspección de `cart-drawer.liquid:458` y `main-cart-items.liquid:177` confirmó el uso estricto de `{{ cart.note | escape }}`. Las propiedades de línea en `cart-drawer.liquid:184-186` filtran rigurosamente que las URLs sean `https://` y provengan de `/uploads/`, escapando todo valor de texto.
3. **Candidato: Violación de término interno por presencia de "popover" en schema:**
   - *Motivo del descarte:* El setting id es `popover_position`, pero el label visible para el comerciante en `locales/en.default.schema.json:661` es `"Product card position"`. El comerciante nunca ve el término técnico.

### Elementos No Verificados en Vivo
1. **Comportamiento en vivo de Selling Plans (Fila 35):** No verificado en ejecución de compra real debido a la ausencia de una app de suscripción activa en la tienda dev `tema-qkqpke0j.myshopify.com`. El código Liquid fue auditado estáticamente y cumple las directrices.
2. **Comportamiento en vivo de Gift Card Recipient Form (Fila 72):** No verificado en storefront porque no existe el producto de tipo tarjeta de regalo en el catálogo de prueba. El código Liquid en `snippets/recipient-form.liquid` está verificado.

---

## 9. Afirmaciones Falsables Numeradas

1. **AF360-01:** `Select-String -Path sections/main-product.liquid -Pattern '"type":\s*"custom_liquid"'` devuelve 0 resultados, demostrando que `main-product.liquid` carece de bloque Custom Liquid.
2. **AF360-02:** En una extracción limpia de `git archive HEAD` en Windows sin tocar el workspace, `npm run gates:ledger` falla con código 1 por discrepancia de saltos de línea CRLF en `scripts/ledger-verify.mjs:58`.
3. **AF360-03:** Una petición HTTP GET a `https://ruizdigital.com/themes/sartorial/docs` no resuelve o devuelve error de conexión, demostrando que la URL oficial declarada en `config/settings_schema.json` no está en línea.
4. **AF360-04:** El formulario en `docs/merchant/support.html` contiene el atributo `action="mailto:support@ruizdigital.com"` y no contiene ningún elemento `<input type="file">`.
5. **AF360-05:** La ejecución de `axe.run()` mediante Playwright en las páginas Home, Colección y Producto de Couture, Sartorial, Edition y Archive reporta exactamente 0 violaciones WCAG 2.2 AA.
6. **AF360-06:** La medición de Core Web Vitals en navegador real reporta un Cumulative Layout Shift (CLS) de 0.0000 en vistas móviles (375x667) en las 4 identidades del tema.
7. **AF360-07:** El bucle en `sections/recently-viewed.liquid:34` ejecuta `{%- for result in search.results -%}` sin parámetro `limit:` ni etiqueta `paginate`.
8. **AF360-08:** La clave `sections.cart.complimentary_additions` en `locales/en.default.json` contiene la cadena `"Complimentary Additions"` con ambas palabras en mayúscula inicial.
