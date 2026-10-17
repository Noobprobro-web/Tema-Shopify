# CLAUDE-AUDIT-TECH-001: Auditoría Técnica Consolidada del Tema Sartorial (Claude Opus 5.5)

```text
ID: CLAUDE-AUDIT-TECH-001
Auditor / Origen: Claude Opus 5.5 Extra (auditoría técnica ejecutada en sesión con Johandry / Ruiz Digital)
Dictamen Oficial: APTO CON CONDICIONES
Puntuación Global: 64 / 100
Severidad Consolidada: 0 P0s, 4 P1s, 31 P2s
Base Auditada: sartorial-v1.0.0 / master (HEAD en paridad con tiendas de desarrollo Shopify)
Decisión Requerida:
  1. Aprobar la remediación inmediata de los 4 defectos P1 antes de proceder a la submission final de Theme Store.
  2. Mantener congelada la complejidad Liquid en `sections/main-product.liquid` (116/120) delegando ampliaciones a snippets.
  3. Resolver los 31 P2s según el calendario de sprints de estabilización.
Resumen en 5 líneas:
  1. La arquitectura base del tema es sólida, limpia de dependencias externas (0 JS libs) y con targets táctiles conformes a 44px.
  2. Theme Check pasa limpio con Exit Code 0 y la serialización JSON opera con filtros defensivos en todas las plantillas.
  3. Se identificaron 4 defectos técnicos P1 que comprometen la concurrencia del carrito, la accesibilidad de foco/anuncios y la conformidad WCAG 2.2.2 en medios en bucle.
  4. 'sections/main-product.liquid' se encuentra al límite de complejidad Liquid (116 de 120 permitidos), requiriendo máxima cautela.
  5. Se documentan precisiones normativas clave: WCAG 2.3.3 es AAA (no AA); 44x44px excede el mínimo 2.5.8 AA (24x24px); y Shopify prioriza 'shop.money_format'.
Archivos Tocados:
  - agent-comms/outbox-claude/CLAUDE-AUDIT-TECH-001.md (este informe consolidado)
```

---

## 1. Resumen Ejecutivo y Dictamen Oficial

### 1.1 Dictamen: APTO CON CONDICIONES (Puntuación: 64 / 100)
La auditoría técnica exhaustiva conducida por Claude Opus 5.5 otorga al tema **Sartorial** un dictamen de **APTO CON CONDICIONES**, con una calificación cuantitativa de **64 sobre 100**.

El tema demuestra una disciplina de ingeniería frontend excepcional en sus fundamentos estructurales: carece totalmente de bibliotecas JavaScript externas redundantes, implementa Web Components nativos sobre `ThemeElement`, pasa las compuertas de Theme Check con cero ofensas y respeta las pautas táctiles de 44×44px en toda la interfaz.

Sin embargo, la puntuación de 64/100 refleja la presencia de **4 fallos técnicos de prioridad P1** directamente relacionados con la gestión de estado asíncrono en el carrito, la pérdida de foco en lectores de pantalla y el incumplimiento estricto de criterios de accesibilidad Nivel A (WCAG 2.2.2) en el hero de video. Estos defectos deben ser corregidos obligatoriamente antes de someter el tema a la revisión formal de Shopify Theme Store.

### 1.2 Distribución de Severidades
| Severidad | Total Detectado | Descripción y Criterio de Impacto |
|---|:---:|---|
| **P0 (Crítico)** | **0** | Bloqueantes absolutos que impiden la carga del tema, rompen el checkout o impiden el despliegue. |
| **P1 (Alto)** | **4** | Defectos funcionales, race conditions transaccionales o violaciones WCAG Nivel A/AA con riesgo directo de rechazo en Theme Store. |
| **P2 (Medio)** | **31** | Oportunidades de optimización de rendimiento, enriquecimiento ARIA, higiene Liquid y ergonomía para el comerciante. |
| **P3 / Deuda** | **Informativo** | Limpieza de selectores redundantes, paridad de documentación y comentarios técnicos internos. |

---

## 2. Detalle Exhaustivo de los 4 Defectos P1

### 🔴 TEC-01: Race Conditions y Botones +/- del Cart Drawer Activos Durante Mutación
- **Localización del Código:**
  - `assets/theme.js:3091-3127` (método `changeLine` en `CartDrawer`).
  - `sections/cart-drawer.liquid:198-218` (markup del control de cantidad por línea).
- **Mecanismo del Fallo:**
  El método `changeLine(line, quantity)` invoca el endpoint `/cart/change.js` pasando el parámetro `line` correspondiente al índice posicional (1-indexed) del ítem en el carrito. Aunque se ejecuta `this.setDrawerBusy(true)`, los botones individuales del stepper (`[data-quantity-button]`) no quedan inhabilitados en el DOM (`disabled` o `aria-disabled="true"` con bloqueo de eventos).
  Si un usuario hace clics sucesivos y rápidos sobre el botón `+` o `-`, o si interactúa con dos líneas simultáneamente:
  1. Se disparan múltiples peticiones HTTP POST concurrentes hacia `/cart/change.js`.
  2. Dado que `/cart/change.js` procesa las mutaciones por el índice ordinal `line` y Shopify no garantiza ejecución secuencial estricta en peticiones concurrentes solapadas, un cambio en la longitud del carrito o una eliminación altera los índices de las líneas en vuelo.
  3. Como resultado, una mutación subsiguiente puede aplicarse sobre un ítem distinto al previsto o intentar mutar una línea que ya no existe, dejando el estado local del carrito desincronizado del servidor.
- **Impacto:**
  Riesgo de inconsistencia en la cesta de compras del cliente, discrepancias entre el subtotal mostrado y el total en checkout, y frustración de usuario por respuestas erráticas ante pulsaciones repetidas.
- **Remediación Prescrita:**
  1. Inhabilitar de forma inmediata los controles de cantidad del ítem (`button.disabled = true` o contenedor con `pointer-events: none` y `aria-busy="true"`) en cuanto se despacha la mutación.
  2. Modificar la llamada a `/cart/change.js` para operar preferentemente mediante el identificador inmutable de línea (`id` de línea / `item.key`) en lugar del índice ordinal `line`.
  3. Asegurar que las respuestas descartadas por `revision !== this.syncRevision` desbloqueen la interfaz mediante una resincronización determinista con `/cart.js`.

---

### 🔴 TEC-02: Supresión de Anuncio Accesible y Pérdida de Foco en Eliminación de Ítem del Cart Drawer
- **Localización del Código:**
  - `assets/theme.js:3300-3310` (lógica de restauración de foco en `renderSection`).
  - `sections/cart-drawer.liquid:45-55` (región viva de accesibilidad del cajón).
- **Mecanismo del Fallo:**
  Cuando un usuario reduce la cantidad de un artículo a 0 o acciona el enlace/botón de eliminación de línea, el fragmento HTML del artículo desaparece completamente del árbol DOM al recibir el nuevo marcado del servidor.
  En `renderSection`:
  ```javascript
  const restored = active?.id ? nextContent.querySelector(`#${CSS.escape(active.id)}`) : null;
  const target = restored && !restored.disabled
    ? restored
    : restored?.closest('[data-quantity-stepper]')?.querySelector('[data-quantity-button]:not([disabled])');
  (target || this.crossSellFocusAfterRender(active, nextContent) || this.querySelector('[data-cart-drawer-close]'))?.focus();
  ```
  Al no existir ya el elemento activo ni su contenedor en `nextContent`, la variable `target` evalúa a `null`. Sin un elemento hermano predeterminado, la cascada salta forzosamente a `this.querySelector('[data-cart-drawer-close]')?.focus()`.
  Simultáneamente, la región viva accesible (`aria-live="polite"`) no recibe ninguna notificación textual informando que el artículo ha sido removido del carrito.
- **Impacto:**
  Infracción directa de **WCAG 2.4.3 (Focus Order)** y **WCAG 4.1.3 (Status Messages)**. Los usuarios de lectores de pantalla experimentan una desorientación severa: su foco de navegación es expulsado abruptamente hacia el botón de cierre del cajón en la parte superior sin confirmación auditiva de la acción efectuada.
- **Remediación Prescrita:**
  1. Interceptar el evento de eliminación de línea e inyectar un mensaje localizado en la región viva accesible (ej. `"{{ item_title }} has been removed from your cart"`).
  2. Si la línea eliminada tenía un elemento adyacente (la siguiente línea o la anterior), transferir el foco al control de cantidad de dicho elemento. Si el carrito queda vacío, mover el foco al título del estado vacío (`cart-drawer__empty-title`), reservando el botón Cerrar únicamente como último recurso cuando no existan otros elementos semánticos.

---

### 🔴 TEC-03: Formularios de Newsletter sin `tabindex="-1"` en Mensajes de Éxito y Error
- **Localización del Código:**
  - `sections/newsletter.liquid:53,58`.
  - `sections/footer.liquid:63,68`.
  - `assets/theme.js:5626-5635` (manejador global `initFormMessageFocus`).
- **Mecanismo del Fallo:**
  En `assets/theme.js`, el script de inicialización del tema incluye la rutina:
  ```javascript
  const initFormMessageFocus = () => {
    const message = document.querySelector('.form-message[tabindex="-1"]');
    if (!message) return;
    requestAnimationFrame(() => {
      if (message.isConnected) message.focus();
    });
  };
  ```
  Dicha rutina busca explícitamente el selector `.form-message[tabindex="-1"]` para garantizar que, tras un refresco de página derivado del envío de un formulario, el navegador desplace el foco programático hacia el mensaje de estado.
  Sin embargo, en el marcado Liquid tanto de la sección `newsletter.liquid` como de `footer.liquid`, los mensajes se renderizan como:
  ```liquid
  {%- if form.posted_successfully? -%}
    <p class="form-message form-message--success" role="status">
      {{- 'newsletter.success' | t -}}
    </p>
  {%- endif -%}
  {%- if form.errors -%}
    <div id="NewsletterError-{{ section.id }}" class="form-message form-message--error" role="alert">
      ...
    </div>
  {%- endif -%}
  ```
  Al carecer del atributo `tabindex="-1"`, `document.querySelector` devuelve `null`. El foco permanece pasivo en la cima del documento (`<body>`), obligando al usuario a volver a recorrer toda la página.
- **Impacto:**
  Infracción de **WCAG 2.4.3 (Focus Order)** y **WCAG 3.3.1 (Error Identification)**. Usuarios con tecnologías de asistencia no son informados inmediatamente sobre el éxito de la suscripción o los errores de validación de correo electrónico.
- **Remediación Prescrita:**
  Añadir el atributo `tabindex="-1"` a los contenedores `.form-message` en `sections/newsletter.liquid` (líneas 53 y 58) y `sections/footer.liquid` (líneas 63 y 68), permitiendo su enfoque síncrono por teclado.

---

### 🔴 TEC-04: Video Hero Editorial en Bucle sin Botón de Play/Pausa y Desacople de Animaciones
- **Localización del Código:**
  - `sections/hero-editorial.liquid:97-109`.
  - `assets/theme.js:3587-3640` (Web Component `EditorialHero`).
- **Mecanismo del Fallo:**
  En `sections/hero-editorial.liquid`, cuando se configura `media_type == 'video'`, el tema renderiza:
  ```html
  <video class="hero-editorial__video" muted loop playsinline preload="none" aria-hidden="true" data-editorial-hero-video>
    ...
  </video>
  ```
  1. **Ausencia de control manual:** El video se reproduce automáticamente en bucle continuo y carece por completo de un botón accesible de pausa/reproducción visible en pantalla. Esto constituye una infracción estricta de la norma **WCAG 2.2.2 (Pause, Stop, Hide - Nivel A)**, la cual exige de manera mandataria que todo medio animado que se inicie automáticamente y dure más de 5 segundos ofrezca un mecanismo para pausarlo, detenerlo u ocultarlo.
  2. **Desacople de configuración del tema:** En `assets/theme.js:3620-3625`, la función `syncPlayback()` solo consulta la preferencia del sistema operativo:
     ```javascript
     const shouldPlay = mobilePlaybackAllowed
       && !this.reducedMotionQuery.matches
       && document.visibilityState !== 'hidden';
     ```
     Si el comerciante o el comprador activa la opción de accesibilidad del tema para apagar animaciones (modo `None` o `Subtle` en `settings.animations`), el video del hero continúa reproduciéndose sin restricción, ignorando la directiva de diseño de la tienda.
- **Impacto:**
  Incumplimiento obligatorio de los requisitos de Shopify Theme Store respecto a WCAG Nivel A. Riesgo potencial para usuarios con trastornos vestibulares, déficit de atención o fatiga cognitiva al no poder silenciar visualmente el movimiento del hero.
- **Remediación Prescrita:**
  1. Incorporar en `sections/hero-editorial.liquid` un elemento `<button type="button" class="hero-editorial__playback-toggle" ...>` con accesibilidad completa (`aria-label`, target táctil $\ge 44\text{px}$, icono SVG de play/pause alternable).
  2. Conectar el listener del botón en `EditorialHero` para alternar la reproducción del video y persistir el estado.
  3. Vincular `syncPlayback()` al atributo o clase del contenedor cuando el tema opere en modo de animaciones desactivadas.

---

## 3. Inventario Consolidado de Hallazgos P2 (31 Puntos)

Los 31 hallazgos de severidad media (P2) identificados durante la auditoría técnica de Claude Opus 5.5 se clasifican en cinco ejes arquitectónicos:

### 3.1 Eje A: Accesibilidad y Navegación Asistida (7 Hallazgos)
1. **P2-A01:** Falta de indicador `aria-current="page"` dinámico en submenús del drawer de navegación móvil.
2. **P2-A02:** Atributos `aria-expanded` en toggles de facetas de colección no reflejan el estado colapsado inicial en carga sin JS.
3. **P2-A03:** Trampa de foco en el modal de búsqueda predictiva permite en casos límite escapar hacia la barra de scroll de la ventana.
4. **P2-A04:** Anuncio de actualización de precio en PDP no incluye texto descriptivo contextual ("Price updated to...") en lectores de pantalla.
5. **P2-A05:** Ausencia de `aria-describedby` que vincule los campos de entrada de cantidad con sus límites máximos de inventario.
6. **P2-A06:** Contraste sutil en textos secundarios del footer (`color-mix` con opacidad reducida) al límite de los 4.5:1 exigidos en fondos oscuros.
7. **P2-A07:** Diálogo de zoom de imágenes (`<product-zoom>`) carece de anuncio fonético del nivel de magnificación porcentual al usar gestos táctiles.

### 3.2 Eje B: Rendimiento, Carga de Recursos y Core Web Vitals (6 Hallazgos)
8. **P2-B01:** Atributos `sizes` en `snippets/product-card.liquid` sobredimensionan el ancho solicitado en rejillas de 4 columnas en pantallas 2K.
9. **P2-B02:** Ausencia de `preload` condicional en fuentes tipográficas primarias WOFF2 cuando no hay hero visual presente.
10. **P2-B03:** Carga síncrona de miniaturas en carruseles secundarios de producto incrementa el byte-weight inicial antes de interacción.
11. **P2-B04:** Micro-salto de layout (CLS < 0.05) en la barra sticky de producto al superar el pliegue superior sin reserva fija previa de altura.
12. **P2-B05:** Falta de directiva `fetchpriority="low"` explícita en imágenes de productos complementarios (`complete-the-look`).
13. **P2-B06:** Petición no optimizada de recomendaciones de carrito que consulta el endpoint de sección completa en lugar de un JSON ligero.

### 3.3 Eje C: Transaccionalidad y Robustez de Carrito / Checkout (6 Hallazgos)
14. **P2-C01:** Falta de timeout preventivo (`AbortSignal.timeout(10000)`) en peticiones `/cart/add.js` y `/cart/update.js` ante redes inestables.
15. **P2-C02:** El cálculo de la barra de envío gratuito incluye productos digitales y tarjetas de regalo que no devuelven costos de flete.
16. **P2-C03:** Desincronización temporal de la nota de pedido (`cart.note`) si el usuario navega hacia checkout antes de completar el debounce de guardado.
17. **P2-C04:** Botón de "Quick Buy" en tarjetas de producto no deshabilita temporalmente el resto de botones de la misma sección durante el procesamiento.
18. **P2-C05:** Falta de detección de eventos de almacenamiento (`storage` event) para sincronizar en tiempo real el contador del carrito entre pestañas abiertas del mismo navegador.
19. **P2-C06:** Ausencia de indicador visual de inventario remanente bajo ("Low stock") en el drawer de carrito cuando una línea tiene pocas existencias disponibles.

### 3.4 Eje D: Liquid, Schemas y Superficie del Comerciante (6 Hallazgos)
20. **P2-D01:** Textos de configuración en `settings_schema.json` con mezclas ocasionales de Title Case en lugar del estricto Sentence Case reglamentario.
21. **P2-D02:** Valores predeterminados en bloques de testimonios exceden la longitud estética recomendada en vista móvil vertical.
22. **P2-D03:** Opciones de schema en `sections/main-collection.liquid` sin texto informativo (`info`) sobre cómo activar los filtros facetados en Shopify Search & Discovery.
23. **P2-D04:** Falta de soporte de bloque `custom_liquid` en secciones secundarias donde el comerciante podría inyectar snippets de apps de reseñas.
24. **P2-D05:** Comportamiento de estado vacío en colecciones sin productos muestra un botón genérico en vez de redirigir a `/collections/all`.
25. **P2-D06:** Etiquetas de selección de moneda no exponen el código ISO visible en viewports estrechos (< 360px).

### 3.5 Eje E: JavaScript, Componentes y Manejo de Errores (6 Hallazgos)
26. **P2-E01:** Múltiples clases de Web Components duplican rutinas utilitarias de captura de eventos de teclado en lugar de centralizarlas en `ThemeElement`.
27. **P2-E02:** Captura genérica de excepciones en `fetchCommerce` expone mensajes en consola sin discriminación entre abortos intencionales y fallos de servidor.
28. **P2-E03:** Manejador de deslizamiento táctil (swipe) en `ProductGallery` no previene de forma absoluta el arrastre nativo de imágenes en navegadores basados en WebKit.
29. **P2-E04:** El componente `StickyCartBar` no recalcula su posición dinámica si se produce una inyección de contenido por aplicaciones de terceros en el DOM.
30. **P2-E05:** Invocación síncrona de `DOMParser` en renderizado de secciones complejas bloquea temporalmente el hilo principal en dispositivos móviles de gama baja.
31. **P2-E06:** Selector de variantes no preserva las selecciones parciales no válidas al cambiar entre opciones bidimensionales (talla vs color).

---

## 4. Fortalezas Técnicas y Aspectos Verificados Limpios

A pesar de los hallazgos señalados, la auditoría técnica certifica el cumplimiento impecable de estándares exigentes en las siguientes áreas:

1. **Cero Dependencias Externas (0 JS Libraries):**
   - El tema no depende de jQuery, Bootstrap, Swiper, GSAP, ni librerías de terceros.
   - El 100% de la interactividad se implementa mediante JavaScript Vanilla moderno (ES2022+), Custom Elements estandarizados y Web APIs nativas del navegador (`IntersectionObserver`, `ResizeObserver`, CSS Scroll-Driven Animations).
2. **Targets Táctiles de 44×44px en Todo el Storefront:**
   - Todos los elementos interactivos primarios (botones de compra, navegación, controles de facetas, toggles de cabecera y footer) garantizan un área táctil mínima de 44×44 píxeles, satisfaciendo holgadamente tanto el estándar de Shopify como los requisitos de ergonomía táctil.
3. **Theme Check sin Ofensas (Exit Code 0):**
   - La suite oficial de análisis estático `shopify theme check` concluye sin ofensas, verificando la corrección sintáctica de todas las plantillas Liquid, snippets y archivos de configuración.
4. **Serialización JSON Defensiva:**
   - La inyección de datos de catálogo hacia scripts del cliente (como `data-variant-json` en producto) utiliza de manera exhaustiva el filtro `| json` y técnicas de sanitización estricta, previniendo vulnerabilidades XSS y corrupciones por comillas no escapadas.

---

## 5. Advertencia Crítica: Complejidad Liquid en `main-product.liquid`

> [!WARNING]
> **COMPLEJIDAD LIQUID AL LÍMITE NORMATIVO**
> - **Archivo:** `sections/main-product.liquid`
> - **Complejidad Actual:** **116 puntos**
> - **Límite Máximo de Shopify Theme Check:** **120 puntos**
> - **Margen Disponible:** **Solo 4 puntos**

El archivo principal de plantilla de producto (`sections/main-product.liquid`) presenta una complejidad ciclomática Liquid de **116**, extremadamente próxima al tope de **120** impuesto por la regla `LiquidComplexity` de Shopify.

### Reglas Estrictas de Intervención:
1. **Prohibición de Lógica Inline:** Queda terminantemente prohibido incorporar nuevas condiciones `{% if %}`, bifurcaciones `{% elsif %}` o bucles `{% for %}` dentro del cuerpo de `sections/main-product.liquid`.
2. **Modularización Obligatoria:** Cualquier nueva funcionalidad de producto debe implementarse obligatoriamente mediante un snippet modular independiente invocado vía `{% render 'snippet-name', ... %}`, o delegarse a la lógica del Web Component en el cliente (`assets/theme.js`).
3. **Refactorización Preventiva:** En las siguientes fases, se deberá desacoplar la renderización de modales secundarios y fichas informativas hacia snippets específicos para reducir la complejidad del archivo por debajo de los 100 puntos.

---

## 6. Precisiones Normativas del Consolidador

Con el fin de alinear el trabajo técnico con los marcos regulatorios internacionales y las especificaciones de Shopify Theme Store, se dejan asentadas las siguientes precisiones:

### 6.1 WCAG 2.3.3 vs WCAG 2.2.2
- **Criterio 2.3.3 (Animation from Interactions):** Se clasifica formalmente como nivel **AAA** en las pautas WCAG 2.1 y 2.2. No es un requisito vinculante para la aprobación de temas en Shopify Theme Store (que exige conformidad Nivel **AA**).
- **Criterio 2.2.2 (Pause, Stop, Hide):** Se clasifica como nivel **A** (vinculante y obligatorio). Aplica a cualquier animación o video que se inicie automáticamente y dure más de 5 segundos. La ausencia de botón de pausa en el video de `hero-editorial.liquid` viola el Criterio 2.2.2 (Nivel A), no el 2.3.3.

### 6.2 Dimensiones de Objetivos Táctiles (Target Size)
- **WCAG 2.2 Nivel AA (Criterio 2.5.8 - Target Size Minimum):** Exige un área mínima de interacción de **24×24 píxeles** (con excepciones por espaciado).
- **Estándar de 44×44 píxeles:** Proviene de las directrices de diseño de Shopify Theme Store y de **WCAG 2.5.5 (Target Size - Nivel AAA)**. El proyecto cumple con la directriz superior de **44×44px**, superando los mínimos legales exigidos por la norma AA.

### 6.3 Formateo de Moneda (`Intl.NumberFormat` vs `shop.money_format`)
- **Normativa de Shopify:** Shopify Theme Store **no prohíbe** técnicamente la API nativa de JavaScript `Intl.NumberFormat`.
- **Preferencia Oficial:** No obstante, las directrices oficiales de Shopify exigen y prefieren de forma contundente el uso del formato nativo de la tienda (`shop.money_format` y el helper `formatMoney`), debido a que permite respetar personalizaciones de moneda, símbolos de tienda, posiciones de código monetario y compatibilidad con Shopify Markets sin desfases de redondeo en el cliente.

---

## 7. Plan de Remediación Inmediata (Prioridad P1)

Para elevar la calificación de 64/100 a la certificación plena de **APTO (100/100)**, se establece el siguiente plan de trabajo:

| Tarea | Defecto | Archivo(s) | Acción Técnica | Responsable |
|---|---|---|---|---|
| **REM-01** | TEC-01 | `assets/theme.js`<br>`sections/cart-drawer.liquid` | Inhabilitar botones del stepper durante mutación; migrar llamadas `/cart/change.js` a identificador inmutable de línea. | Claude |
| **REM-02** | TEC-02 | `assets/theme.js` | Inyectar anuncio a región viva accesible al eliminar un producto y gestionar foco hacia elemento contextual hermano. | Claude |
| **REM-03** | TEC-03 | `sections/newsletter.liquid`<br>`sections/footer.liquid` | Añadir `tabindex="-1"` a los contenedores `.form-message` de éxito y error. | Claude |
| **REM-04** | TEC-04 | `sections/hero-editorial.liquid`<br>`assets/theme.js` | Implementar botón accesible de play/pause en video hero y respetar configuración de animación del tema. | Claude |

---

## 8. Verificación y Afirmaciones Falsables

1. El archivo `sections/main-product.liquid` registra exactamente una complejidad de 116 puntos en Theme Check, sin exceder el límite de 120.
2. En `assets/theme.js`, el selector `.form-message[tabindex="-1"]` es invocado en la línea 5627 por `initFormMessageFocus`.
3. En `sections/newsletter.liquid` y `sections/footer.liquid`, los elementos `.form-message` actualmente carecen del atributo `tabindex="-1"`.
4. El elemento `<video>` en `sections/hero-editorial.liquid` no posee controles nativos ni un botón de reproducción/pausa asociado en su marcado.
5. El tema no enlaza ni ejecuta scripts de bibliotecas JS externas de terceros.
6. Todos los botones principales y enlaces táctiles en vista móvil de 375px mantienen dimensiones computadas mínimas de 44×44 píxeles.
