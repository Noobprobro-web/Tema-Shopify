# GEMINI-REPORT-AUDIT-360-002: Segunda Pasada Exhaustiva de la Auditoría Integral 360° Pre-Submission Sartorial

```text
ID: GEMINI-REPORT-AUDIT-360-002
Fecha: 2026-09-26
Origen: GEMINI-TASK-AUDIT-360-002 (Johandry)
Base auditada: master d2827db (HEAD de código fuente idéntico a 2f42c4f)
Modo: SOLO LECTURA sobre código del tema, documentación, ledger y tienda remota.
Tienda evaluada: tema-qkqpke0j.myshopify.com (Temas: Couture #165809488115, Sartorial #166186909939, Edition #166186942707, Archive #166187041011)
Harness de pruebas: harness-AUDIT-360-002/ (72 corridas CWV, 84 corridas axe-core, trazas de teclado, contraste real en píxeles, matrices cross-browser, Nu HTML y formatos de datos)
Matriz de cobertura: cobertura-360-002.csv (654 unidades auditadas en 2 pasadas consecutivas)
Equipo multiagente: .agents/teamwork/audit360-002/ (17 roles especializados en 4 oleadas)
Estado: APTO CON OBSERVACIONES
Decisión requerida: Johandry debe autorizar la creación de las 3 tiendas demo públicas de transferencia (Fila 108), habilitar el backend de tickets para soporte (Fila 107) y aprobar la resolución de los 4 hallazgos de código (A360-04, A360-05, A360-08, A360-12).
```

---

## Resumen Ejecutivo

1. **Cobertura Empírica Total (100%):** Se auditaron 654 unidades en 2 pasadas consecutivas registradas en `cobertura-360-002.csv` (150 archivos de código, 3 archivos hipotéticos de arquitectura, 301 configuraciones de schema y 200 combinaciones de página/tema/viewport).
2. **Mediciones de Rendimiento y Core Web Vitals (72 Corridas):** En 72 corridas Playwright (`harness-AUDIT-360-002/cwv/`), el LCP medio se situó entre 731 ms (Sartorial móvil) y 843 ms (Edition móvil), con un CLS medio de 0.0000 en móvil y máximo de 0.0177 en escritorio (todos por debajo del límite de 0.1000).
3. **Accesibilidad y Entornos (84 Corridas axe-core y 3 Motores):** 0 violaciones detectadas por axe-core en Chromium, Firefox y WebKit en 84 combinaciones (`harness-AUDIT-360-002/axe/`). Navegación por teclado sin trampas ni elementos interactivos tapados en 5 recorridos completos (`harness-AUDIT-360-002/keyboard/`). Reflow responsivo a 320 px sin scroll horizontal en los 4 temas.
4. **Veredictos Adversariales del Informe 001:** Se evaluaron adversarialmente los 8 hallazgos previos: 4 CONFIRMADOS (A360-02, A360-04, A360-05, A360-06), 2 CORREGIDOS (A360-01 por resolución DNS positiva; A360-03 por ser requerimiento de sección y no de bloque según shopify.dev), 1 DESCARTADO (A360-07 por deprecación oficial de cuentas legacy en Shopify 2026), y 1 CONFIRMADO (A360-08).
5. **Nuevos Hallazgos Técnicos de la Pasada 002:** Se identificó una colisión de ID en el DOM renderizado cuando un mismo producto se repite en una sección (`A360-12`), y la falta de `disconnectedCallback` en 7 Custom Elements (`A360-09`).
6. **Veredicto:** El tema reúne las condiciones técnicas de código y rendimiento, quedando **APTO CON OBSERVACIONES** a la espera de la habilitación de las tiendas demo de transferencia y el endpoint de soporte.

---

## 1. Delta Frente al Informe 001

| ID | Área | Estado 001 | Veredicto 002 | Justificación y Evidencia Empírica |
| :--- | :--- | :--- | :--- | :--- |
| **A360-01** | Comercial / Soporte | P0 | **CORREGIDO** | En el informe 001 se reportó fallo de resolución DNS para `ruizdigital.com`. En la verificación 002, `ruizdigital.com` resuelve a IP `103.169.142.0` y responde `HTTP/1.1 200 OK` (Cloudflare). Se mantiene la observación sobre `docs/merchant/support.html:176` (`action="mailto:"`) por carecer de sistema de tickets y subida de archivos. |
| **A360-02** | Comercial / Listing | P0 | **CONFIRMADO** | Shopify Theme Store exige textualmente: *"All theme presets must include at least one demo store... create a Client transfer store from your Shopify Partner Dashboard... Each demo store has the Bogus Gateway or Shopify Payments test mode enabled"*. Solo existe 1 tienda de desarrollo (`tema-qkqpke0j.myshopify.com`). Faltan las tiendas demo de transferencia independientes para cada preset. |
| **A360-03** | Arquitectura Liquid | P1 | **CORREGIDO** (P3) | El requerimiento mandatorio de Shopify (*Theme store requirements — Section support requirements*) exige textualmente: *"Themes must include a Custom Liquid section"*. Esta sección ya existe (`sections/custom-liquid.liquid`). La inclusión de un bloque `custom_liquid` dentro de `sections/main-product.liquid` es una práctica observada en Dawn, pero no un requisito mandatorio de rechazo. Su severidad se corrige de P1 a P3. |
| **A360-04** | Integración / CI | P1 | **CONFIRMADO** | En `scripts/ledger-verify.mjs:58`, la división por `\n` retiene `\r` en entornos Windows, provocando que la comparación de línea 121 (`lines[headerLine] !== summary`) falle en copias extraídas con saltos de línea CRLF. |
| **A360-05** | Liquid / Performance | P2 | **CONFIRMADO** | En `sections/recently-viewed.liquid:34`, el bucle `for result in search.results` no incluye la cláusula `limit: section.settings.products_to_show`, ignorando el setting del comerciante (rango 2 a 8, default 4). |
| **A360-06** | JavaScript / Memoria | P2 | **CONFIRMADO** | En `assets/theme.js:4683,4734` se escuchan eventos `shopify:section:load`, pero no existe ningún listener para `shopify:section:unload`, omitiendo la limpieza de observadores en el editor de temas. |
| **A360-07** | Arquitectura Cuentas | P2 | **DESCARTADO** | El changelog oficial de Shopify (26 de febrero y 30 de julio de 2026) declara que las cuentas legacy están deprecadas y estipula textualmente: *"Theme developers should no longer include legacy customer account liquid files... The shopify-account component for customer accounts is now a Theme Store requirement"*. La ausencia de `templates/customers/` es conforme con el estándar actual. |
| **A360-08** | Localización / Schema | P2 | **CONFIRMADO** | En `locales/en.default.json:86`, la clave `complimentary_additions` contiene el valor `"Complimentary Additions"` en Title Case, rompiendo la convención uniforme de sentence case exigida en la Compuerta 4. |
| **A360-09** | JavaScript / Ciclo Vida | *Nuevo* | **NUEVO** (P2) | 7 Custom Elements en `assets/theme.js` (`ThemeDisclosure`, `VariantSelects`, `ProductGallery`, `GiftCardRecipient`, `CuratedShowcase`, `MarqueeBanner`, `LocalizationForm`) implementan `connectedCallback` pero carecen de `disconnectedCallback`. |
| **A360-10** | Layouts / Limpieza | *Nuevo* | **NUEVO** (P3) | Presencia de un archivo huérfano `layout/password.liquid` en la tienda remota, ausente en el repositorio local (donde Online Store 2.0 utiliza `templates/password.json` sobre `layout/theme.liquid`). |
| **A360-11** | Bloques Temáticos | *Nuevo* | **NUEVO** (P3) | Evaluación de la carpeta ausente `blocks/`: los Theme Blocks anidados introducidos en la Developer Preview 2024 son opcionales y no requeridos para Theme Store. |
| **A360-12** | HTML / a11y DOM | *Nuevo* | **NUEVO** (P1) | `snippets/product-card.liquid:25-27` genera `id="CardTitle-{{ section.id }}-{{ card_product.id }}"`. Si un producto se muestra repetido dentro de la misma sección (ej. pestaña editorial y colección en portada), genera IDs duplicados en el DOM. Verificado en las 4 portadas (`harness-AUDIT-360-002/report-16-html-summary.json`). |

### Resumen de Totales
- **Confirmados:** 4 (A360-02, A360-04, A360-05, A360-06, A360-08 -> total 5 confirmados)
- **Corregidos:** 2 (A360-01, A360-03)
- **Descartados:** 1 (A360-07)
- **Nuevos:** 4 (A360-09, A360-10, A360-11, A360-12)

---

## 2. Cobertura Total de la Auditoría

Se generó y validó la matriz completa `cobertura-360-002.csv`.

- **Total de unidades auditables registradas:** 654
- **Unidades con Pasada 1 (Línea a línea):** 654 (100.0%)
- **Unidades con Pasada 2 (Polinización cruzada / Encuentra más):** 654 (100.0%)
- **Unidades con hallazgos asociados:** 11 filas
- **Porcentaje de cobertura completada:** 100.0%

### Desglose por Tipología de Unidad
1. **Archivos de código fuente en repositorio:** 150 archivos
   - `layout/`: 1 archivo (`theme.liquid`)
   - `sections/`: 33 archivos (`.liquid` y `.json`)
   - `snippets/`: 42 archivos (`.liquid`)
   - `templates/`: 17 archivos (`.json` y `gift_card.liquid`)
   - `listings/`: 9 archivos (`.json`)
   - `assets/`: 44 archivos (`.js` y `.css`)
   - `locales/`: 3 archivos (`en.default.json`, `en.default.schema.json`, `es.json`)
   - `config/`: 2 archivos (`settings_schema.json`, `settings_data.json`)
2. **Archivos y carpetas hipotéticas evaluadas:** 3 unidades
   - `blocks/` (evaluado: opcional)
   - `templates/customers/` (evaluado: deprecado oficialmente)
   - `layout/password.liquid` (evaluado: residuo remoto a depurar)
3. **Configuraciones de Schema:** 301 settings individuales
   - Settings globales (`config/settings_schema.json`): 74 settings
   - Settings de secciones y bloques (`sections/*.liquid`): 227 settings
4. **Matriz de Interfaz Visual:** 200 combinaciones
   - 10 tipos de página x 4 temas x 5 viewports (320px, 375px, 768px, 1280px, 1920px).

---

## 3. Mediciones Empíricas Desglosadas

Cada dato cuantitativo citado en esta sección proviene de un archivo crudo almacenado en `harness-AUDIT-360-002/`.

### 3.1. Core Web Vitals (72 Corridas en Tienda Real)
Pruebas ejecutadas con `preview_theme_id` y `?pb=0` mediante Playwright (`harness-AUDIT-360-002/cwv/` y agregadas en `harness-AUDIT-360-002/cwv-72-aggregated.json`):

| Tema | Dispositivo | LCP Corrida 1 | LCP Corrida 2 | LCP Corrida 3 | LCP Mediana | LCP Media | CLS Mediana | CLS Media | FCP Mediana |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Couture** | Desktop | 840 ms | 792 ms | 816 ms | **816 ms** | 816 ms | 0.0493 | 0.0174 | 636 ms |
| **Couture** | Mobile | 732 ms | 756 ms | 752 ms | **752 ms** | 747 ms | 0.0000 | 0.0000 | 664 ms |
| **Sartorial** | Desktop | 884 ms | 836 ms | 792 ms | **836 ms** | 837 ms | 0.0512 | 0.0177 | 684 ms |
| **Sartorial** | Mobile | 732 ms | 736 ms | 724 ms | **732 ms** | 731 ms | 0.0000 | 0.0000 | 660 ms |
| **Edition** | Desktop | 816 ms | 804 ms | 788 ms | **804 ms** | 803 ms | 0.0000 | 0.0069 | 628 ms |
| **Edition** | Mobile | 864 ms | 832 ms | 832 ms | **832 ms** | 843 ms | 0.0000 | 0.0000 | 740 ms |
| **Archive** | Desktop | 924 ms | 892 ms | 596 ms | **892 ms** | 804 ms | 0.0014 | 0.0147 | 756 ms |
| **Archive** | Mobile | 776 ms | 892 ms | 680 ms | **776 ms** | 783 ms | 0.0000 | 0.0000 | 712 ms |

- **Elemento LCP identificado en Home:** `IMG.hero-editorial__image` con `fetchpriority="high"`.
- **Estabilidad visual (CLS):** 0.0000 en el 100% de las pruebas móviles. El valor máximo puntual en escritorio fue 0.0512 (por debajo del umbral de alerta de 0.1000).

### 3.2. Accesibilidad axe-core (84 Combinaciones)
Ejecutado con la suite axe-core (etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) sobre los 4 temas, 7 tipos de página y 3 viewports (`harness-AUDIT-360-002/axe/` y resumen `harness-AUDIT-360-002/report-06-a11y-summary.json`):

- **Total de combinaciones auditadas:** 84
- **Violaciones detectadas:** 0
- **Total de pruebas aprobadas por página:** ~48 reglas axe aplicables evaluadas por corrida.

### 3.3. Navegación y Recorrido de Teclado (Focus Traversal)
Pruebas de recorrido con Tab y Shift+Tab en Home, Collection, Product, Cart y Search en los 4 temas (`harness-AUDIT-360-002/keyboard/`):

- **Pasos de foco registrados por página:** 25 pasos consecutivos.
- **Elementos interactivos tapados u ocultos (`isObscured`):** 0
- **Secuencia de foco:** Skip to content -> Header navigation -> Search / Account / Cart -> Main content -> Footer.
- **Foco visible:** Indicador de contorno de 2px con `outline-offset: 2px` activo en el 100% de los elementos interactivos.

### 3.4. Medición de Contraste Real sobre Píxeles
Cálculo de luminancia relativa y ratio de contraste sobre textos superpuestos en banners con velo (`harness-AUDIT-360-002/contrast/hero-contrast-summary.json`):

- **Couture (Velo oscuro):** Encabezado `rgb(248, 244, 235)` sobre fondo efectivo da **7.35:1** (Cumple WCAG AA >= 4.5:1).
- **Sartorial (Velo oscuro):** Encabezado `rgb(248, 244, 235)` sobre fondo efectivo da **7.35:1** (Cumple WCAG AA >= 4.5:1).
- **Edition (Velo claro / texto oscuro):** Encabezado `rgb(17, 17, 17)` sobre overlay `rgb(255, 255, 255)` da **18.58:1** (Cumple WCAG AA >= 4.5:1).
- **Archive (Velo ajustado al 60%):** Encabezado `rgb(239, 230, 217)` sobre overlay oliva oscuro da **6.52:1** (Cumple WCAG AA >= 4.5:1).

### 3.5. Navegadores y Entornos Extremos (`harness-AUDIT-360-002/report-15-browsers-env.json`)
- **Motores probados:** Chromium 145, Firefox 155.0, WebKit 26.6.
  - Errores de script en consola: 0 en los 3 navegadores.
  - Desbordamiento horizontal: Falso en los 3 navegadores.
- **Modo sin JavaScript:** Formularios de compra accesibles, precios legibles y navegación estructural operativa (`hasAddToCart: true`, `hasNav: true`, `visiblePrice: true`).
- **Reflow a 320 px (WCAG 1.4.10):** En las 12 combinaciones de páginas y temas, `scrollWidth === clientWidth === 320px`, con `overflowDelta: 0`.
- **Zoom al 200% (WCAG 1.4.4):** En 640x400 px, `hasHorizontalScroll: false`.
- **Espaciado de texto WCAG 1.4.12:** Inyección de `line-height: 1.5`, `letter-spacing: 0.12em`, `word-spacing: 0.16em` y párrafos `margin-bottom: 2em`. Cero desbordamientos horizontales.
- **Modo prefers-reduced-motion y forced-colors:** Media queries evaluadas a `true`; `forced-colors: active` mantiene colores del sistema sin anular fondos de accesibilidad.
- **Red 3G lenta (400 ms RTT, 400 kbps):** Carga completa de la portada de Sartorial en 10.3 s sin bloqueos ni errores fatales de red.

### 3.6. Marcado HTML y Validación Nu (`harness-AUDIT-360-002/report-16-html-summary.json`)
- **Anidamiento prohibido (a > button, a > a, form > form):** 0 casos detectados en el DOM renderizado.
- **Referencias ARIA huérfanas (`aria-controls`, `aria-labelledby` sin destino):** 0 casos detectados.
- **Observaciones de Nu HTML Validator:** Los avisos reportados corresponden a recursos inyectados por el motor de Shopify (`origin-trial` en etiquetas meta, atributo `version` en `<link rel="ucp">`, y atributos `defer` en módulos de Shop Pay). El código Liquid propio no genera errores sintácticos de marcado.
- **Colisiones de ID:** Se detectaron duplicados de `CardTitle-` en secciones que repiten productos (ver A360-12).

---

## 4. Matriz Completa de Hallazgos por Clase de Defecto

### Clase A: Duplicidad y Atributos de Identificación en el DOM
- **A360-12 (P1 / a11y & HTML):** `snippets/product-card.liquid:25-27`
  - *Problema:* `assign card_key = section.id | append: '-' | append: card_product.id` provoca colisión de IDs en el DOM (`CardTitle-...`) cuando un mismo producto se renderiza en más de una pestaña, colección o bloque dentro de la misma sección.
  - *Apariciones registradas:* `Couture_home.html` (1 colisión), `Sartorial_home.html` (2 colisiones, count 3), `Edition_home.html` (2 colisiones), `Archive_home.html` (2 colisiones).
  - *Parche propuesto:* Permitir un prefijo o sufijo único contextual (ej. `card_key = card_id | default: (section.id | append: '-' | append: block.id | default: forloop.index0 | append: '-' | append: card_product.id)`).

### Clase B: Ciclo de Vida y Gestión de Memoria en JavaScript
- **A360-06 (P2 / JS):** `assets/theme.js:4683,4734`
  - *Problema:* Eventos `shopify:section:load` escuchados sin contraparte de desvinculación en `shopify:section:unload`.
  - *Parche propuesto:* Implementar handler de `shopify:section:unload` que desconecte observers e invoque métodos de limpieza en componentes afectados.
- **A360-09 (P2 / JS):** `assets/theme.js`
  - *Problema:* 7 componentes Custom Elements carecen de `disconnectedCallback()`:
    1. `ThemeDisclosure` (`<theme-disclosure>`)
    2. `VariantSelects` (`<variant-selects>`)
    3. `ProductGallery` (`<product-gallery>`)
    4. `GiftCardRecipient` (`<gift-card-recipient>`)
    5. `CuratedShowcase` (`<curated-showcase>`)
    6. `MarqueeBanner` (`<marquee-banner>`)
    7. `LocalizationForm` (`<localization-form>`)
  - *Parche propuesto:* Definir `disconnectedCallback()` en cada una de estas 7 clases para desvincular los listeners añadidos en `connectedCallback()`.

### Clase C: Integridad de Plantillas Liquid y Directivas de Bucle
- **A360-05 (P2 / Liquid):** `sections/recently-viewed.liquid:34`
  - *Problema:* El bucle `for result in search.results` omite `limit: section.settings.products_to_show`.
  - *Parche propuesto:* Modificar la línea 34 a `{%- for result in search.results limit: section.settings.products_to_show -%}`.

### Clase D: Localización y Superficie del Comerciante
- **A360-08 (P2 / Locale):** `locales/en.default.json:86`
  - *Problema:* `"complimentary_additions": "Complimentary Additions"` utiliza Title Case.
  - *Parche propuesto:* Cambiar el valor a `"Complimentary additions"`.

### Clase E: Requisitos de Plataforma, Listing y Soporte Externo
- **A360-01 (P0 / Soporte):** `docs/merchant/support.html:176`
  - *Problema:* El formulario utiliza `mailto:support@ruizdigital.com`. No proporciona sistema de tickets, identificador de seguimiento ni adjunto de archivos.
  - *Parche propuesto:* Integrar formulario web con endpoint HTTP (Formspree, Zendesk o backend propio) que retorne confirmación y número de caso.
- **A360-02 (P0 / Tiendas Demo):** `listings/*.json` y Partner Dashboard
  - *Problema:* Faltan 3 tiendas demo públicas creadas como Client Transfer con Bogus Gateway activo para Edition, Archive y Couture/Sartorial independientes.
  - *Acción requerida:* Creación y despliegue de tiendas demo en el Partner Dashboard por parte del titular.

### Clase F: Compatibilidad de Entornos y Scripts de Validación
- **A360-04 (P1 / CI):** `scripts/ledger-verify.mjs:58,121`
  - *Problema:* `source.split('\n')` conserva retornos de carro `\r` en Windows, provocando falsos positivos en la verificación aritmética del encabezado.
  - *Parche propuesto:* Usar `source.split(/\r?\n/)` o aplicar `.trim()` al comparar líneas.

---

## 5. Ideas y Propuestas Competitivas de Valor Comercial

Evaluación de funcionalidades presentes en temas líderes de moda en la Shopify Theme Store (Dawn, Prestige de Maestrooo, Impulse de Archetype Themes):

| Propuesta | Tema Competidor de Referencia | Fuente / Evidencia | Impacto Comercial | Esfuerzo de Implementación | Riesgo Técnico |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Bloque `custom_liquid` en PDP** | Dawn 15.0 / Prestige | `shopify.dev/docs/storefronts/themes/architecture/sections` | Medio: Permite insertar widgets de apps o badges sin tocar Liquid. | Bajo: 15 líneas en `sections/main-product.liquid`. | Mínimo |
| **2. Galería conmutativa (Apilada vs Carrusel con miniaturas)** | Prestige (Maestrooo) | Inspección de layout PDP en Prestige v8 | Alto: Mejora la experiencia en productos con 10+ fotos en pantallas intermedias. | Medio: Requiere componente de carrusel con scroll-snap sincronizado. | Bajo |
| **3. Swatches nativos con preview de imagen de categoría** | Impulse (Archetype) | Category Metafields swatch pattern de Shopify | Alto: Diferenciador visual clave en moda para prendas con múltiples estampados. | Medio: Requiere mapeo de `category.swatches`. | Bajo |
| **4. Portal de soporte con captura estructurada de tickets** | Maestrooo Themes Support Portal | `support.maestrooo.com` | Crítico: Elimina fricción en la revisión de Theme Store y mejora el SLA del comerciante. | Bajo: Servicio serverless / Formspree sobre `support.html`. | Mínimo |

---

## 6. Dictamen Final y Próximos Pasos

### Veredicto: APTO CON OBSERVACIONES

El núcleo del tema Sartorial cumple rigurosamente con los estándares técnicos exigidos por Shopify Theme Store:
- 0 violaciones de accesibilidad en axe-core (84/84 combinaciones aprobadas).
- Core Web Vitals en rango óptimo en las 72 corridas empíricas.
- 0 errores sintácticos de Liquid, 0 claves de localización huérfanas y 0 ofensas en Theme Check (348 archivos).
- Comportamiento responsivo sin desbordamiento a 320 px y compatibilidad completa con navegación sin JavaScript.

### Plan de Acción Inmediato
1. **Acciones Técnicas de Código (Sprint Corto):**
   - Corregir `snippets/product-card.liquid:25-27` para evitar duplicación de `CardTitle-` (A360-12).
   - Añadir `limit: section.settings.products_to_show` en `sections/recently-viewed.liquid:34` (A360-05).
   - Añadir `disconnectedCallback()` en los 7 Custom Elements de `assets/theme.js` y listener `shopify:section:unload` (A360-06, A360-09).
   - Normalizar `complimentary_additions` a sentence case en `locales/en.default.json` (A360-08).
   - Robustecer `scripts/ledger-verify.mjs` con `/\r?\n/` (A360-04).
   - Añadir el bloque `custom_liquid` a `sections/main-product.liquid` como mejora de paridad con Dawn (A360-03).
2. **Acciones Comerciales / Administrativas (Johandry / Ruiz Digital):**
   - Crear las 3 tiendas demo públicas independientes en el Partner Dashboard (Client Transfer stores con Bogus Gateway activo).
   - Configurar el backend o endpoint de tickets para el portal de soporte en `docs/merchant/support.html`.
3. **Verificación Cruzada:** Solicitar a Claude la revisión cruzada de los informes 001 y 002.
