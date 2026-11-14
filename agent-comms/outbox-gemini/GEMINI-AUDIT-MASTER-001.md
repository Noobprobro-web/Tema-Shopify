# GEMINI-AUDIT-MASTER-001: Auditoría Maestra Independiente del Tema Sartorial

```text
ID de Documento: GEMINI-AUDIT-MASTER-001
Tipo: Auditoría Maestra Independiente / Dictamen Técnico de Calidad
Emisor: Gemini 3.8 Flash (Orquestador Antigravity)
Destinatarios: Johandry (Dueño del Proyecto / Autoridad Final), Cerebro (claude.ai), Claude Code, Codex/GPT
Fecha: 2026-10-30
SHA Auditado: 09f834295074402d9b93aa8ead83a732d78e6608
Estado de Inspección: COMPLETADO
Veredicto Formal: NO APTO PARA SUBMISSION (Presencia de 2 bloqueantes P0 y 7 bloqueantes P1)
```

---

## 1. Encabezado y Estado de Verificación Estática

### 1.1 Metadatos de la Auditoría
- **SHA auditado:** `09f834295074402d9b93aa8ead83a732d78e6608`
- **Fecha de ejecución:** 2026-10-30
- **Modelo evaluador:** Gemini 3.8 Flash (Orquestador Antigravity)
- **Ámbito:** Inspección exhaustiva de código Liquid, JavaScript vanilla, estilos CSS, esquemas de configuración JSON, arneses de prueba Playwright, workflows de CI/CD, documentación de soporte al comerciante e higiene de seguridad.

### 1.2 Resultados de Compuertas Automatizadas
- **Comando `npm run gates:static`:** Exit code 0.
  - Sub-compuertas ejecutadas y aprobadas:
    1. `gates:json` (`node scripts/json-validate.mjs`): Pasa (todos los esquemas y plantillas validados).
    2. `gates:hooks` (`node scripts/dataset-hooks.mjs`): Pasa (integridad de ganchos de datos verificada).
    3. `gates:sanity` (`node scripts/sanity-check.mjs`): Pasa (integridad estructural validada).
    4. `gates:locales` (`node scripts/locales-validate.mjs`): Pasa (cobertura de claves de traducción verificada).
    5. `gates:ledger` (`node scripts/ledger-validate.mjs`): Pasa (consistencia de requisitos comprobada).
    6. `gates:theme-check` (`shopify theme check`): Pasa (cero errores sintácticos de Liquid).
    7. `gates:syntax` (`node --check assets/theme.js && node --check assets/product-zoom.js`): Pasa (análisis sintáctico JS sin errores).
    8. `gates:package` (`shopify theme package`): Pasa (empaquetado oficial completado).
- **Comando `npm run gates:package`:** Exit code 0.
  - Artefacto generado: `Sartorial-1.0.0.zip`.
  - Confirmación de contenido del paquete ZIP: el archivo empaquetado incluye íntegramente los directorios de los tres presets oficiales:
    - `listings/sartorial`
    - `listings/imprint`
    - `listings/archive`

---

## 2. Resumen Ejecutivo por Área (A a H)

### Área A: Requisitos de la Theme Store
La estructura general del tema respeta la arquitectura requerida por Shopify Theme Store (Online Store 2.0, JSON templates, bloques configurables, esquemas internacionalizados). No obstante, se identifican incoherencias en la serialización de configuraciones globales en `config/settings_data.json` donde se mantienen definiciones de esquemas con valores redundantes o divergentes entre presets (GEM-A-001, P2), así como parámetros de paginación que requieren alineación estricta con las recomendaciones de rendimiento de colecciones extensas (GEM-A-002, P3).

### Área B: JavaScript (`assets/theme.js` y `assets/product-zoom.js`)
El componente `product-zoom.js` presenta un fallo crítico de robustez (P0) al asumir la presencia de un elemento `<img>` en cada slide dentro de `layout()` sin comprobación de nulidad (GEM-B-001). Si la galería incluye un medio alternativo (video o modelo 3D) o la imagen no está disponible en el DOM, el script lanza un error fatal de ejecución `TypeError`. Asimismo, existen bloqueantes P1 relacionados con la gestión de foco y eventos: el selector de foco provoca recalculo sincrónico forzado (layout thrashing) en cada pulsación de Tabulación (GEM-B-002); falta de coordinación entre el diálogo modal nativo de zoom y el gestor global de diálogos (GEM-B-003); referencias sin comprobación a botones de control del modal (GEM-B-004); y manipulación de propiedades en elementos nulos durante transiciones de estado (GEM-B-005).

### Área C: Liquid y CSS
Se detectó una transgresión de arquitectura limpia en `snippets/product-technical-specs.liquid` (GEM-C-001, P2), donde se infieren especificaciones técnicas mediante cadenas fijas vinculadas al identificador del producto (`product_handle contains 'brass'`). Las reglas de Shopify exigen que las especificaciones provengan de la configuración nativa del comerciante o de metafields estándar, sin acoplamientos hardcodeados. En CSS, la cascada modular y el uso de variables personalizadas se encuentran bien articulados, registrándose observaciones menores sobre selectores de tamaño de imagen en `sections/main-about.liquid` (GEM-C-002, P2) y `sections/main-page.liquid` (GEM-C-003, P3).

### Área D: Accesibilidad
En las pruebas estáticas y dinámicas sobre la línea base se registraron cero violaciones detectadas en las reglas estándar de accesibilidad para navegación secuencial. No obstante, se observa la necesidad de reforzar el contraste del indicador `:focus-visible` en fondos alternativos de esquemas oscuros (`assets/base.css:283-286`, GEM-D-001, P3) para asegurar que el anillo de enfoque conserve una relación de contraste mínima en la totalidad de las superficies del tema.

### Área E: Internacionalización
La totalidad de las cadenas orientadas al comprador en Liquid y esquemas JSON utilizan claves de localización `t:`. Sin embargo, la documentación estática destinada al comerciante (`docs/merchant/docs.html` y `docs/merchant/support.html`) contiene menciones obsoletas a la denominación provisional "Edition" en lugar de "Imprint" (GEM-E-001, P1). Asimismo, comentarios en `assets/base.css` arrastran referencias desfasadas a presets históricos (GEM-E-002, P3).

### Área F: Contenido Demo y Presets
En el preset Imprint (`listings/imprint/templates/index.json`), se hallan declaraciones de especificaciones extremas no fundamentadas ("500D TECHNICAL BALLISTIC NYLON", "Aerospace grade EDC systems", "CNC-machined anodized 6061 aluminium & titanium", "0.2mm laser cut edge bonding") (GEM-F-001, P1). Los lineamientos de revisión de Shopify desaprueban declaraciones técnicas sin respaldo empírico en tiendas demo. Adicionalmente, se detectan referencias de productos cruzados que deben homogeneizarse en los tres presets (GEM-F-002, P2).

### Área G: Herramientas y CI
Se identificó una vulnerabilidad crítica de seguridad y proceso en los scripts de validación en vivo `scripts/gate5-live-verify.mjs` y `scripts/gate5-complete-verification.mjs` (GEM-G-001, P0), los cuales contienen un valor fallback codificado de contraseña para acceder a la tienda de desarrollo. En integración continua, existe una disparidad de versiones de entorno entre `.github/workflows/ci.yml` (Node 20) y `.nvmrc` (Node 22.12.0) (GEM-G-002, P2). Además, se identifica el uso de prefijo de rango flotante `^4.8.0` para `@shopify/cli` en `package.json` (GEM-G-003, P2) y afirmaciones categóricas no permitidas en `docs/requirements-ledger.md` (GEM-G-004, P2).

### Área H: Seguridad e Higiene de Secretos
Aunque los archivos `.env` y los volcados de sesión activos se encuentran ignorados en el control de versiones, el patrón en `.gitignore:35` presenta inconsistencias de alcance (GEM-H-001, P1). Por otro lado, la persistencia de fallbacks de credenciales en scripts utilitarios (GEM-H-002, P3) expone datos de configuración interna si dichos scripts son ejecutados en entornos no aislados.

---

## 3. Tabla Maestra Consolidada de Hallazgos

| ID | Área | Sev. | Ubicación Exacta | Estado | Impacto | Resumen del Hallazgo | Corrección Recomendada | Criterio de Aceptación |
|---|---|---|---|---|---|---|---|---|
| **GEM-B-001** | B | **P0** | `assets/product-zoom.js:80-87` | VERIFICADO | Submission | `slide.querySelector('img')` asume existencia incondicional de etiqueta `img`. Si un slide contiene video/modelo 3D o carga diferida, `img.dataset` arroja `TypeError` fatal que aborta el modal. | Añadir guarda de nulidad `if (!img) return null;` y filtrar slides sin imagen o gestionar medios mixtos. | Ejecución de zoom sobre PDP con video o modelo 3D sin errores en consola JS. |
| **GEM-G-001** | G | **P0** | `scripts/gate5-live-verify.mjs:5` y `scripts/gate5-complete-verification.mjs:5` | VERIFICADO | Calidad/Herramientas | Literal de contraseña de tienda hardcodeado como fallback en el código fuente de scripts de prueba. | Eliminar el literal de contraseña por defecto; requerir estrictamente la variable de entorno `STOREFRONT_PASSWORD`. Si no existe, detener la ejecución con mensaje informativo. | Cero literales de credenciales en scripts; terminación controlada con error explicativo si la variable de entorno no está definida. |
| **GEM-B-002** | B | **P1** | `assets/theme.js:18-44` | VERIFICADO | Submission | `getFocusableElements` ejecuta `querySelectorAll` y `getClientRects()` en cada evento `keydown` de Tabulación, provocando reflujo sincrónico forzado (layout thrashing) continuo durante la navegación por teclado. | Cachear la lista de elementos enfocables al abrir el contenedor y refrescar únicamente tras mutaciones del DOM. | Navegación secuencial por teclado a través del modal sin recalculos sincrónicos detectados en el perfil de rendimiento. |
| **GEM-B-003** | B | **P1** | `assets/theme.js:61-74` y `assets/product-zoom.js:51-61` | VERIFICADO | Submission | Falta de interoperabilidad entre `product-zoom` y `closeOtherDialogs`: abrir zoom no cierra cajones o modales activos, generando colisiones de foco e inconsistencia de atributos `inert`. | Registrar `product-zoom[open]` en `DIALOGS_WITH_CLOSE` e invocar `closeOtherDialogs(this)` al abrir el visor. | Apertura de zoom cierra automáticamente el cajón de carrito o menú sin superposición de capas inertes. |
| **GEM-B-004** | B | **P1** | `assets/product-zoom.js:10-25` | VERIFICADO | Submission | Destructuración fija de elementos interactivos (`[this.dialog, this.track...]`) asume presencia total. Si falta un selector, `this.listen` falla con `Cannot read properties of null`. | Validar que cada nodo exista antes de registrar escuchadores de eventos o aplicar comprobación opcional (`this.closeButton && on(...)`). | El componente inicializa sin fallas incluso si se suprimen controles opcionales en la plantilla. |
| **GEM-B-005** | B | **P1** | `assets/product-zoom.js:170-180` | VERIFICADO | Submission | El método `set()` manipula propiedades directas (`button.disabled`) sobre referencias que pueden resultar nulas si no todos los controles están presentes en el DOM. | Filtrar referencias nulas antes de mutar propiedades: `if (!button) return;`. | Ausencia de excepciones al actualizar estados de habilitación con botones parciales. |
| **GEM-F-001** | F | **P1** | `listings/imprint/templates/index.json:32-35, 51, 74, 152-154` | VERIFICADO | Submission | Copy demo incluye declaraciones técnicas y de ingeniería extrema no comprobadas ("500D TECHNICAL BALLISTIC NYLON", "Aerospace grade EDC systems", "Grade 5 Titanium"). | Sustituir por redacción editorial de diseño minimalista y contemporáneo sin aseveraciones técnicas no demostrables. | Contenido de plantilla libre de declaraciones de rendimiento industrial o aeroespacial. |
| **GEM-E-001** | F / E | **P1** | `docs/merchant/docs.html:204` y `docs/merchant/support.html:254` | VERIFICADO | Calidad/Herramientas | Documentación de cara al comerciante hace referencia al preset provisional "Edition" en lugar de "Imprint". | Reemplazar todas las menciones de "Edition" por "Imprint" en la documentación HTML. | Búsqueda global de la cadena "Edition" en `docs/merchant/` arroja 0 coincidencias. |
| **GEM-H-001** | H | **P1** | `.gitignore:35` | VERIFICADO | Calidad/Herramientas | Regla `*.cookies.json` duplicada y ausencia de exclusión explícita para subcarpetas de arneses con capturas de cabeceras (`harness-*/`). | Consolidar reglas de exclusión y asegurar que `*headers.json` y artefactos de sesión queden cubiertos universalmente. | `.gitignore` consistente y validación de `git status` sin rastros de archivos de sesión en subcarpetas. |
| **GEM-A-001** | A | **P2** | `config/settings_data.json:82-150` | VERIFICADO | Calidad/Herramientas | Esquemas de color y variables de preset arrastran redundancias y valores de bordes divergentes no alineados con los esquemas de listings. | Armonizar valores de color y bordes entre `config/settings_data.json` y los directorios de `listings/`. | Paridad comprobada entre los presets de desarrollo y los listings de distribución. |
| **GEM-B-006** | B | **P2** | `assets/product-zoom.js:39, 78-97` | VERIFICADO | Calidad/Herramientas | Escuchador del evento `resize` en ventana invoca `layout()` sin temporizador ni estrangulamiento (throttling/debounce). | Implementar debounce o envolver en `requestAnimationFrame` para limitar ejecuciones durante el redimensionamiento. | Comportamiento fluido durante cambio de dimensiones de pantalla sin picos excesivos de cálculo en el hilo principal. |
| **GEM-B-007** | B | **P2** | `assets/product-zoom.js:205-248` | VERIFICADO | Calidad/Herramientas | El método `follow(event)` calcula coordenadas de desplazamiento en puntero de ratón sin sincronización con el ciclo de repintado del navegador. | Delegar la actualización de la transformación geométrica a `requestAnimationFrame`. | Movimiento de paneo fluido en puntero a 60 cuadros por segundo sin ejecuciones redundantes. |
| **GEM-B-008** | B | **P2** | `assets/theme.js:3833-3837` | VERIFICADO | Calidad/Herramientas | Escuchadores de `window.scroll` y `resize` para el popover de lookbook se ejecutan activamente incluso cuando el elemento interactivo está cerrado. | Activar los escuchadores de reposicionamiento únicamente mientras el popover esté desplegado en pantalla. | Cero invocaciones de cálculo geométrico cuando el lookbook no se encuentra visible. |
| **GEM-B-009** | B | **P2** | `assets/theme.js:5573-5596` | VERIFICADO | Calidad/Herramientas | Escuchador global de `focusin` recorre nodos pendientes invocando `getBoundingClientRect()` de forma iterativa, induciendo reflujo de diseño. | Reemplazar lectura geométrica manual por el uso de `IntersectionObserver` o limitar comprobaciones a elementos inmediatamente visibles. | Ausencia de recalculos de renderizado bloqueantes durante la navegación rápida con teclado. |
| **GEM-B-010** | B | **P2** | `assets/product-zoom.js:297-301` | VERIFICADO | Calidad/Herramientas | El método `announce()` asume la existencia estricta de `this.output` y del atributo `data-status-template`. | Incorporar guarda de comprobación antes de manipular `textContent` y reemplazar marcadores. | Ejecución sin fallos aun si el elemento de estado para lectores de pantalla no estuviera instanciado. |
| **GEM-B-011** | B | **P2** | `assets/product-zoom.js:137-140` | VERIFICADO | Calidad/Herramientas | Función `upgrade()` asigna `srcset` directamente desde `dataset.srcset` sin validar si el atributo contiene una cadena válida. | Validar que `dataset.srcset` esté presente antes de asignar la propiedad al elemento DOM. | Asignación segura de fuentes responsivas evitando cadenas indefinidas en atributos HTML. |
| **GEM-B-012** | B | **P2** | `assets/theme.js:764-768` | VERIFICADO | Calidad/Herramientas | Modificación de `textContent` en `perDeliveryPrice` presupone que `dataset.perDeliveryTemplate` está siempre definido. | Añadir verificación de existencia previa o cadena de sustitución por defecto. | Actualización de precio por entrega sin riesgo de excepción por plantilla indefinida. |
| **GEM-B-013** | B | **P2** | `assets/theme.js:5745-5796` | VERIFICADO | Calidad/Herramientas | `initQuantitySteppers` registra múltiples escuchadores directos en el documento; la lógica de reubicación de foco ante botones deshabilitados puede transferir el cursor a elementos ocultos. | Comprobar visibilidad y estado real de los botones adyacentes antes de solicitar el foco. | Foco preservado en un elemento interactivo visible cuando el contador alcanza el límite establecido. |
| **GEM-C-001** | C | **P2** | `snippets/product-technical-specs.liquid:54, 68` | VERIFICADO | Submission | Inferencia condicional artificial de materiales y manufactura en Liquid basada en subcadenas del identificador de producto (`product_handle contains 'brass'`). | Eliminar inferencias rígidas en código Liquid; recurrir exclusivamente a los campos de bloque o a metafields estandarizados. | El componente solo muestra datos asignados por el comerciante o se oculta si no existen datos configurados. |
| **GEM-C-002** | C | **P2** | `sections/main-about.liquid:42` | VERIFICADO | Calidad/Herramientas | Descriptor de tamaños `sizes` en `responsive-image` no contempla adaptabilidad a columnas fluidas en pantallas intermedias. | Ajustar la consulta de medios en `sizes` para reflejar con precisión el ancho del contenedor en rejillas móviles y de escritorio. | Selección adecuada de recurso de imagen según el ancho real de despliegue en ventana. |
| **GEM-F-002** | F | **P2** | `listings/*/templates/index.json` | VERIFICADO | Calidad/Herramientas | Asignación heterogénea de productos destacados entre presets, requiriendo catálogos con handles idénticos para visualización consistente. | Utilizar una lista homogénea de identificadores de producto en los datos de demostración de los tres presets. | Importación de presets en tienda de prueba sin bloques vacíos por falta de correspondencia en el catálogo. |
| **GEM-G-002** | G | **P2** | `.github/workflows/ci.yml:27` vs `.nvmrc:1` | VERIFICADO | Calidad/Herramientas | Discrepancia entre la versión de Node.js en CI (`node-version: 20`) y el entorno de desarrollo local fijado en `.nvmrc` (`22.12.0`). | Homogeneizar la versión en CI y local estableciendo Node.js 22 (o la versión LTS requerida por el equipo) en ambos archivos. | Ejecución idéntica del motor de JavaScript en entornos locales y pipelines de integración continua. |
| **GEM-G-003** | G | **P2** | `package.json:20` / `package.json:24` | VERIFICADO | Calidad/Herramientas | Uso del especificador con caret `^4.8.0` para `@shopify/cli`, lo que permite variaciones menores imprevistas durante instalaciones limpias (`npm ci`). | Fijar versión exacta de la herramienta CLI o asegurar el bloqueo estricto mediante `package-lock.json`. | Instalación reproducible e inmutable del entorno de comandos de Shopify. |
| **GEM-G-004** | G | **P2** | `docs/requirements-ledger.md:37` | VERIFICADO | Calidad/Herramientas | Redacción en el registro de requisitos incluye términos prohibidos ("certificada") en la declaración de cumplimiento de métricas. | Reformular la redacción a descripción objetiva: "Medición empírica en tienda real: CLS 0.022...". | Cero ocurrencias de vocabulario no permitido en la documentación interna y técnica. |
| **GEM-A-002** | A | **P3** | `sections/main-collection.liquid:450` | VERIFICADO | Calidad/Herramientas | Cierre de bloque de formulario de facetas inmediatamente contiguo a la paginación sin espaciador semántico. | Reorganizar la estructura de cierre de etiquetas para mejorar la claridad del árbol de elementos. | Estructura de marcado limpia y sin anidamientos innecesarios en la plantilla de colección. |
| **GEM-B-014** | B | **P3** | `assets/product-zoom.js:29-33` | VERIFICADO | Calidad/Herramientas | Manejo del evento `scroll` del carrusel usa cálculo manual de índice vía desplazamiento en lugar de aprovechar el evento nativo `scrollend` donde esté soportado. | Añadir detección progresiva de `scrollend` manteniendo el cálculo por `requestAnimationFrame` como alternativa. | Detección limpia de finalización de desplazamiento sin sobrecarga de cálculos intermedios. |
| **GEM-B-015** | B | **P3** | `assets/theme.js:420-424` | VERIFICADO | Calidad/Herramientas | Mecanismo de sincronización de diapositiva en carrusel principal reevalúa la posición de desplazamiento en cada frame pasivo. | Implementar desconexión de frame acumulado mediante cancelación explícita en desmonte del componente. | Ausencia de solicitudes de frame huérfanas tras el desmontaje de la sección. |
| **GEM-C-003** | C | **P3** | `sections/main-page.liquid:37` | VERIFICADO | Calidad/Herramientas | Invocación de `responsive-image` dentro de `main-page` repite especificaciones de anchos comunes en lugar de utilizar un preset estandarizado. | Unificar los valores de anchos de imagen mediante un parámetro compartido de configuración. | Simplificación de parámetros en el renderizado de imágenes de páginas de contenido. |
| **GEM-D-001** | D | **P3** | `assets/base.css:283-286` | VERIFICADO | Calidad/Herramientas | La regla `:focus-visible` emplea `var(--color-foreground)` directamente; en componentes con inversiones de esquema locales puede reducirse la visibilidad del contorno. | Utilizar una variable dedicada de enfoque con garantía de contraste adaptativo (`--focus-outline-color`). | Contorno de enfoque visible en todos los estados y combinaciones de fondo del tema. |
| **GEM-E-002** | E | **P3** | `assets/base.css:4145, 9945` | VERIFICADO | Calidad/Herramientas | Comentarios en la hoja de estilos hacen referencia a nombres de presets históricos desfasados ("Edition", "Couture"). | Actualizar los comentarios de código para referenciar únicamente los nombres vigentes: Sartorial, Imprint y Archive. | Consistencia semántica total en el código fuente del tema. |
| **GEM-H-002** | H | **P3** | `scripts/gate5-live-verify.mjs:5` | VERIFICADO | Calidad/Herramientas | Definición de constante de URL de prueba apunta de manera fija al subdominio de desarrollo en lugar de admitir parametrización por entorno. | Parametrizar `BASE_URL` y `THEME_ID` a través de variables de entorno con valores por defecto documentados. | Scripts de prueba reutilizables en múltiples entornos de prueba sin alteración del código fuente. |

---

## 4. Estado de Cada Punto Conocido

| Punto Evaluado | Ubicación | Estado | Evidencia y Justificación Técnica |
|---|---|---|---|
| Fallback de credenciales en scripts de prueba de Gate 5 | `scripts/gate5-live-verify.mjs:5` y `scripts/gate5-complete-verification.mjs:5` | **SIGUE** | Ambos archivos mantienen asignaciones de respaldo con un literal de contraseña hardcodeado en caso de ausencia de la variable de entorno. Requiere saneamiento inmediato (P0). |
| Disparidad de versiones de Node.js en CI vs Local | `.github/workflows/ci.yml:27` vs `.nvmrc:1` | **SIGUE** | El flujo de trabajo en GitHub Actions define `node-version: 20`, mientras que la configuración local en `.nvmrc` estipula la versión `22.12.0`. |
| Especificación flotante de versión de CLI | `package.json:20` / `package.json:24` | **SIGUE** | La dependencia de desarrollo `@shopify/cli` se encuentra declarada con operador caret (`^4.8.0`), permitiendo actualizaciones automáticas no controladas. |
| Vocabulario prohibitivo en registro de requisitos | `docs/requirements-ledger.md:37` | **SIGUE** | Se identifica la inclusión del término "certificada" en la descripción de mediciones empíricas de rendimiento en tienda real. |
| Inferencia forzada de especificaciones técnicas por handle | `snippets/product-technical-specs.liquid:54, 68` | **SIGUE** | Las ramas condicionales aplican valores estáticos de material y acabado cuando `product_handle` contiene las cadenas 'brass' o 'paperweight'. |
| Declaraciones de ingeniería no respaldadas en preset Imprint | `listings/imprint/templates/index.json:32-35, 51, 74, 152-154` | **SIGUE** | Se mantienen textos de demostración que afirman el uso de nylon balístico 500D, titanio de grado 5 y estándares aeroespaciales en productos genéricos. |
| Literales de contraseña en README de arnés y JSON de entorno | Archivos `harness-*/README.md` y volcados `raw-env` | **RESUELTO** | Se comprobó la eliminación de archivos residuales del índice; los volcados sensibles no se encuentran bajo seguimiento en git. |
| Dispersión de archivos en paquetes de demostración | `listings/` (~28 de 84 archivos distintos) | **RESUELTO / NO REPRODUCIBLE EN LOCAL** | La compilación oficial mediante `npm run gates:package` genera `Sartorial-1.0.0.zip` incorporando de forma homogénea las plantillas y secciones de los 3 presets requeridos. |

---

## 5. Medición en Vivo del Storefront Preview

### 5.1 Parámetros de la Inspección
- **ID de Tema de Previsualización Evaluado:** `189707452659`
- **Entorno de Red:** Conexión emulada 4G rápida / Dispositivo móvil de gama media simulado (anchura de visor 390px) y escritorio (1440px).
- **Vistas Inspeccionadas:** Portada principal (Home), Cuadrícula de Colección (`/collections/all`), Ficha Detallada de Producto (`/products/structured-tote`).

### 5.2 Resultados de la Evaluación
1. **Accesibilidad Semántica y Nombres de Controles:**
   - Cero botones sin nombre accesible en la totalidad de las vistas analizadas.
   - Estructura de encabezados semánticos ordenada jerárquicamente, con presencia estricta de un único elemento `<h1>` en cada vista examinada.
   - Todos los campos de entrada de formularios cuentan con etiquetas explícitas o atributos `aria-label` vinculados mediante identificadores únicos.
2. **Navegación Secuencial:**
   - La trampa de foco en los cajones modulares restringe la navegación con tecla Tabulación al interior del elemento activo sin pérdida de cursor en el cuerpo principal.
   - Se registraron cero violaciones detectadas en las reglas estándar de accesibilidad de navegación estática.
3. **Observación sobre Rendimiento LCP (Largest Contentful Paint):**
   - Se advierte la presencia de distorsión en la captura automática de métricas LCP provocada por la inyección asincrónica del banner de consentimiento de cookies de la plataforma Shopify.
   - En mediciones sintéticas sin supresión del banner, el elemento representativo LCP es computado erróneamente sobre el contenedor del aviso de privacidad en lugar de la imagen principal del hero o de la galería de producto. Se recomienda aislar el parámetro de previsualización excluyendo scripts de cookies en auditorías de rendimiento puras.

---

## 6. Lista de Decisiones Requeridas para Johandry

Para avanzar hacia la fase final de saneamiento y preparación del tema, se somete a la consideración de Johandry (Autoridad Final del Proyecto) la resolución formal de las siguientes 5 decisiones técnicas y comerciales:

1. **Aprobación de Política de Contenido Editorial para Preset Imprint:**
   - *Contexto:* El archivo `listings/imprint/templates/index.json` incluye afirmaciones de características técnicas e industriales avanzadas (ej. "Nylon balístico 500D", "Titanio Grado 5", "Estándares aeroespaciales").
   - *Opciones:*
     - *Opción A:* Autorizar la sustitución integral de dichas cadenas por prosa editorial contemporánea orientada al diseño y funcionalidad urbana sin reclamos materiales técnicos.
     - *Opción B:* Mantener la terminología técnica restringiéndola a nombres ficticios conceptuales que no aludan a normativas industriales o aeroespaciales reales.

2. **Estrategia para Bloque de Especificaciones Técnicas en Ficha de Producto:**
   - *Contexto:* `snippets/product-technical-specs.liquid` contiene reglas condicionales rígidas para inyectar datos ficticios basados en el handle del producto.
   - *Opciones:*
     - *Opción A:* Eliminar por completo las inferencias basadas en handles; si el comerciante no define valores en los ajustes del bloque ni en metafields oficiales, el bloque se oculta automáticamente.
     - *Opción B:* Configurar una estructura estándar de metafields (`custom.material`, `custom.dimensions`) e incluir instrucciones detalladas en la guía del comerciante para su configuración en el administrador.

3. **Política de Versiones y Dependencias de Shopify CLI en el Repositorio:**
   - *Contexto:* `package.json` declara `@shopify/cli` con el prefijo `^4.8.0`, lo cual puede provocar discrepancias entre compilaciones locales y de integración continua.
   - *Opciones:*
     - *Opción A:* Fijar la dependencia de forma estricta (versión exacta sin caret ni tilde) para garantizar reproducibilidad absoluta en `npm ci`.
     - *Opción B:* Mantener el rango flotante actual delegando la inmutabilidad exclusivamente al archivo de bloqueo `package-lock.json`.

4. **Estandarización de la Versión de Node.js en Integración Continua:**
   - *Contexto:* Existe discrepancia entre el flujo de trabajo de GitHub Actions (Node 20) y el archivo de definición de entorno local `.nvmrc` (Node 22.12.0).
   - *Opciones:*
     - *Opción A:* Actualizar el pipeline de CI en `.github/workflows/ci.yml` a Node.js 22 para alinearlo con el entorno de trabajo activo.
     - *Opción B:* Ajustar `.nvmrc` para fijar Node.js 20 LTS como la versión de referencia transversal en todos los entornos.

5. **Consolidación de Nombres Oficiales de Presets en Documentación:**
   - *Contexto:* La documentación para comerciantes (`docs/merchant/docs.html` y `support.html`) y diversos comentarios internos en CSS aún contienen los términos provisionales "Edition" y "Couture".
   - *Opciones:*
     - *Opción A:* Ratificar formalmente la tríada de nombres comerciales definitivos como `Sartorial`, `Imprint` y `Archive`, ordenando la sustitución exhaustiva de cualquier referencia residual en documentación y código fuente.
     - *Opción B:* Evaluar si "Edition" debe preservarse como nombre de preset secundario antes de proceder con el reemplazo definitivo.

---

## 7. Veredicto Final

```text
================================================================================
                    DICTAMEN TÉCNICO FORMAL DE AUDITORÍA
================================================================================
VEREDICTO: NO APTO PARA SUBMISSION A LA SHOPIFY THEME STORE
================================================================================
```

### 7.1 Justificación Técnica del Veredicto
El repositorio auditado bajo el SHA `09f834295074402d9b93aa8ead83a732d78e6608` evidencia un alto nivel de madurez técnica en su base Liquid y una infraestructura sólida de compuertas estáticas (8 de 8 sub-compuertas aprobadas). No obstante, el estado actual presenta impedimentos técnicos no negociables que conllevan rechazo automático o riesgo de falla funcional severa en producción.

### 7.2 Lista de Hallazgos Bloqueantes
Para alcanzar la condición de elegibilidad técnica para envío, es mandatorio corregir la totalidad de los siguientes puntos:

1. **Bloqueantes Críticos (P0):**
   - **GEM-B-001 (`assets/product-zoom.js:80-87`):** Excepción fatal no controlada `TypeError` al inicializar la vista de zoom si la galería de producto incluye diapositivas sin imagen (videos o modelos tridimensionales) o recursos pendientes de carga.
   - **GEM-G-001 (`scripts/gate5-live-verify.mjs:5` y `scripts/gate5-complete-verification.mjs:5`):** Presencia de literales de credenciales fijas en el código de scripts de automatización.

2. **Bloqueantes Mayores (P1):**
   - **GEM-B-002 (`assets/theme.js:18-44`):** Sobrecarga de rendimiento por cálculo forzado de geometría en cada evento Tab durante el atrapamiento de foco.
   - **GEM-B-003 (`assets/theme.js:61-74` y `assets/product-zoom.js:51-61`):** Falta de coordinación entre el visor modal de zoom y los diálogos modales/cajones del tema.
   - **GEM-B-004 (`assets/product-zoom.js:10-25`):** Destructuración insegura de elementos de interfaz sin comprobación de nulidad previa a la asignación de eventos.
   - **GEM-B-005 (`assets/product-zoom.js:170-180`):** Asignación de propiedades sobre referencias indefinidas en la función de sincronización de controles.
   - **GEM-F-001 (`listings/imprint/templates/index.json`):** Reclamos técnicos e industriales desproporcionados en el contenido demostrativo del preset Imprint que transgreden los lineamientos de Shopify Theme Store.
   - **GEM-E-001 (`docs/merchant/docs.html` y `docs/merchant/support.html`):** Incoherencia en la nomenclatura comercial de los presets ofrecidos al comerciante.
   - **GEM-H-001 (`.gitignore:35`):** Cobertura incompleta de exclusión para directorios de pruebas con volcados de cabeceras de red.

Una vez implementadas las correcciones de los puntos P0 y P1 y aprobadas las decisiones de negocio por Johandry, se procederá con la re-evaluación adversarial de las áreas afectadas.
