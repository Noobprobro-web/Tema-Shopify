ID: GPT-CONTOUR-QA-001
Estado: propuesta de QA y preparación Theme Store; documentación local, sin ejecución en tienda.
Decisión requerida: Claude debe incorporar paquetes cerrados al plan; Johandry resuelve prioridades comerciales y disponibilidad de tiendas; Gemini asesora contratos y actualiza el tablero cuando corresponda.
Resumen en 5 líneas:
1. Contour aporta aprendizajes de instalación, contenido por preset y revisión adversarial, sin constituir una certificación Shopify.
2. Priorizar reproducibilidad del CI y evidencia de compra antes de ampliar secciones.
3. Mantener las cinco compuertas actuales y las fortalezas comerciales propias de Sartorial.
4. Separar requisitos oficiales por revalidar, relatos del autor, hipótesis y el comentario del usuario sobre rechazos.
5. Ninguna fila del ledger se cierra, reabre o cambia con este informe; los artefactos históricos requieren trazabilidad antes de reutilizarse.
Archivos tocados: únicamente agent-comms/outbox-gpt/GPT-CONTOUR-QA-001.md.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación; cambios de settings/defaults/IDs futuros necesitan directiva explícita conforme a RULES.md.
Hallazgos extra fuera de alcance (con parche listo): sin parche de código; discrepancia documental Edition/Imprint y procedencia de artefactos MOTION-002 para reconciliación posterior.
Verificación (comando, resultado y qué demuestra/qué no): lecturas y búsquedas locales, inventario del ledger y `playwright test --list`; evidencia abajo. No se ejecutaron pruebas funcionales, HTML, axe ni Lighthouse en este pase.
Lista de afirmaciones falsables numeradas: A1–A7 al final.

## Alcance y autoridad

Solicitud: plan multiagente para mejorar Sartorial con Contour como único referente, conservando la línea editorial, la estructura de trabajo y las cinco compuertas. Este subinforme fue elaborado por un subagente Codex del equipo de auditoría; no representa una intervención real de Claude ni Gemini. Los responsables nominales del trabajo futuro permanecen: Claude líder técnico e implementador, Gemini arquitecto consultor y escritor del BOARD, GPT auditor independiente, Johandry dueño de negocio y tiendas. No se modifica BOARD ni se emite autorización de implementación por cuenta de otro agente.

Revisiones locales: Sartorial `b400cdc5acc345e9e9d6c0c99e3132a3bc6a5e44`; Contour `1576d06b336abb6827084b7734faebbcb4d8f32f`. Las observaciones históricas del repositorio no se presentan como mediciones actuales. La auditoría previa `GPT-AUDIT-COMPARATIVA-001` aporta contexto y resultados de su ejecución; no sustituye la inspección presente ni revalida una tienda.

## Clasificación de evidencia: qué podemos aprender

| Clase | Evidencia y límite | Consecuencia para el plan |
| --- | --- | --- |
| Fuente oficial | El ledger enlaza `https://shopify.dev/docs/storefronts/themes/store/requirements`; el agente coordinador informó que intentó `curl` a esa URL y obtuvo rechazo 403 del proxy (salida 000). La norma vigente y el proceso actual de submission no quedaron revalidados. | Crear paquete de revalidación oficial con fecha, URL, extracto y alcance por requisito antes de submission. Los umbrales del ledger sirven provisionalmente para planificación; no etiquetarlos como confirmados hoy. No cambiar allowlist ni pedir credenciales por esta tarea documental. |
| Aprendizaje documentado por el autor | `atelier/DEVELOPMENT.md:43` narra restricciones de sync de schemas; `:66–77` explica cómo preservar configuración/medios propios de cada demo; `:149` alerta de referencias a imágenes de otra tienda; `:153–159` recomienda revisión adversarial y comprobación live. | Adoptar objetivos de QA: instalación real, aislamiento de contenido, verificación del recurso servido y revisión cruzada. No trasladar sus comandos de merge ni su arquitectura de ramas automáticamente a Sartorial. |
| Relato de correcciones, sin prueba adjunta en este pase | `atelier/RELEASE-NOTES.md:18–38` describe variantes, medios, movimiento, CLS, overflow y labels. | Convertir cada aprendizaje relevante en escenario falsable de Sartorial; no asumir que todas las afirmaciones describen comportamiento hoy verificado de Contour. |
| Hipótesis técnica del autor | `atelier/DEVELOPMENT.md:51` afirma que un minificador elimina `:is()`. Sartorial lo usa en `assets/base.css:9327` y `:9589`, entre otras reglas. No se descargó CSS servido ni se reprodujo ese fenómeno. | Prueba dirigida fuente → asset servido → estilo computado en un tema de desarrollo antes de proponer un parche. No reemplazar selectores preventivamente ni presentar la hipótesis como prohibición oficial. |
| Comentario del usuario | Johandry informa que Contour ha sido rebotado varias veces por Shopify. | Es contexto válido del encargo, pero no tenemos las cartas, motivos, fechas ni dictámenes. Buscar feedback documental si se incorpora luego; no inventar una lista de rechazos ni inferir que Contour está aprobado. |
| Evidencia de límites de la documentación | `DEVELOPMENT.md:144–146` describe la fila de fotos del timeline como dependiente de que todos los pasos tengan imagen; `sections/process-timeline.liquid:18–23` activa `has_media` al encontrar una imagen y `:57` usa esa variable. | Reafirma por qué se debe verificar el código y el estado mixto. Es una discrepancia localizada entre descripción y condición, no un fallo storefront demostrado. |

Las búsquedas en Markdown de Contour encontraron cero menciones de `rejection`, `rechaz`, `rebot`, `feedback` o `reviewer`. Los dos matches de `reject` en DEVELOPMENT se refieren al parser/importación (`:44`, `:54`), no a feedback de Theme Store. Esta búsqueda acotada no demuestra que no existan rechazos, comunicaciones privadas u otros documentos fuera del alcance revisado.

No convertir en reglas de Sartorial las afirmaciones de Contour sobre skeleton como única base, licencias, presupuestos JS, formas de publicación o restricciones de selectores sin fuente oficial y verificación pertinente. Su layout actual aún carga GSAP/Lenis (`layout/theme.liquid:178–192`), aunque DEVELOPMENT contiene una frase de retirada: otro motivo para contrastar código, fecha y alcance.

## Paquetes de trabajo propuestos, en orden

| Paquete | Trabajo, dueño y dependencia | Criterio de salida |
| --- | --- | --- |
| QA-0 · Fuente y baseline | Claude coordina; GPT contrasta requisitos oficiales vigentes y los mapea con Gemini al ledger. Registrar SHA, preset real, tienda/tema de desarrollo, configuración y versión de herramientas. Johandry confirma el ámbito comercial de los presets. | Matriz fuente/requisito/artefacto/fecha sin afirmaciones de rechazo inventadas. Baseline de cada preset disponible; lo que falta queda identificado. |
| QA-1 · CI reproducible | Claude alinea `actions/setup-node` con `.nvmrc` y separa suite estática, local y conectada. Gemini revisa el contrato; GPT audita que un run verde realmente ejecute tests. | Instalación congelada en Node 22.12+ compatible con lockfile; ocho controles estáticos pasan; job conectado produce ejecución y reporte, no solo descubrimiento. Un fixture requerido ausente no produce verde por skip. |
| QA-2 · Fixtures y compra | Claude prepara manifest/arnés sobre superficies reales; Johandry habilita catálogo y dependencias de tienda existentes. GPT recorre variantes, cantidades, suscripciones y carrito con datos hostiles. | Matriz por los tres presets, PDP principal/producto destacado/quick add donde existan, EN/ES, desktop/móvil. Carrito confirma variante, cantidad, plan y precio correctos. |
| QA-3 · Presets/editor y estados | Claude aplica el contrato de contenido que apruebe el liderazgo; GPT verifica estados degenerados y persistencia; Gemini comprueba IDs/tokens/locales. | Instalar cada preset desde el ZIP, editar/guardar/recargar/reordenar/duplicar secciones sin pérdidas ni imágenes rotas. Contenido específico conserva su sentido y la identidad Sartorial. |
| QA-4 · Rendimiento/accesibilidad | Claude mide baseline antes de optimizar; Gemini acota los componentes a modularizar; GPT repite medición independiente comparable después. | HTML, axe, teclado y Lighthouse con evidencia por preset/ruta. Menos CSS servido donde se optimice, sin incremento material de otras cargas ni regresiones comerciales/editor. |
| QA-5 · Candidato de submission | Claude arma paquete candidato; GPT intenta falsificar checklist y Gemini revisa trazabilidad; Johandry completa acciones de negocio. | Cinco compuertas satisfechas para el alcance afectado, ZIP instalado y verificado, versiones/presets/listings/docs/soporte alineados, pendientes externos explícitos. La aprobación de Shopify sigue siendo un resultado externo. |

QA-0 y QA-1 pueden avanzar sin tienda. QA-2/QA-3/QA-4 empíricos dependen de una tienda de desarrollo accesible y del candidato realmente servido. Este plan no solicita secretos ni opera las tiendas de Sebastián. No se debe hacer QA destructivo en una demo comercial: se usa un tema no publicado y datos de prueba preparados para ese fin.

## Mapeo al ledger vigente, sin cambiar estados

El ledger no tiene IDs estables por fila; usar el nombre exacto como identificador y añadir la línea solo para esta revisión. Hoy contiene 60 filas: 54 `cumplido`, 6 `código completo`. Las filas verdes conservan su evidencia histórica; el QA de regresión de cambios futuros no equivale a reabrirlas.

| Paquete | Filas existentes que consume o debe preservar | Naturaleza del trabajo |
| --- | --- | --- |
| QA-0 | Todas las fuentes; “Validación de Nombre contra Reglamento y Marcas” (`:108`); “Presets Diferenciados (1 a 4)” (`:109`); “3 Tiendas Demo Auténticas (Sin Lorem Ipsum)” (`:111`). | Reconciliación documental y de procedencia. El código usa Sartorial/Imprint/Archive, mientras esas filas conservan Edition y nombres/IDs históricos. No declarar inválidas las demos ni renombrar presets desde esta auditoría. |
| QA-1 | Ninguna fila específica cubre Node/ejecución real de CI. Apoya todas las compuertas y “Schemas Válidos y Settings (100% t: Localizados)” (`:22`). | Mejora de proceso nueva, sin inventar requisito oficial ni cerrar una fila verde. |
| QA-2 | “Planes de Venta / Suscripciones” (`:71`), “Selector de Variantes y Swatches Nativos” (`:69`), “Precios Comparativos y Descuentos” (`:70`), “Checkout Acelerado” (`:66`), “Bloques de Aplicación” (`:21`), filtros/sorting (`:79–80`). | Cobertura de regresión preservando capacidades propias. Reglas de cantidad y total por cantidad requieren caso explícito; no tienen fila propia identificada en este ledger. Proponer cobertura de proceso o futura fila con fuente, sin añadirla ahora. |
| QA-3 | “Presets Diferenciados”, “Schemas Válidos y Settings”, “Punto Focal Nativo” (`:35`, `código completo`) y “Medios Enriquecidos y Modelos 3D” (`:75`, `código completo`). | Las dos últimas solo podrán proponerse para cierre después de su prueba específica real y artefacto trazable. |
| QA-4 | Performance (`:31`), CLS (`:37`), accesibilidad (`:46–55`), “Motor de Movimiento Nativo sin Dependencias” (`:38`), reduced-motion (`:56`), axioma anti-invisible (`:57`), impresión (`:58`). | Las cuatro filas de movimiento siguen `código completo` hoy. Existen directorios históricos `harness-MOTION-002/run-2026-10-02-print-live/`; inventariar sus SHA/tiendas/resultado/cobertura antes de atribuir vigencia o repetir lo ya cubierto. Su mera existencia no cierra filas. |
| QA-5 | Nombre/presets/docs/soporte/demos (`:107–111`), exclusión de markets (`:23`), originalidad (`:17`). | Regresión del candidato y preparación comercial; aclarar cualquier contradicción de evidencia con el dueño antes de submission. |

El conteo es del archivo actual; no valida semánticamente que cada “cumplido” continúe satisfecho ni que las referencias históricas señalen el mismo candidato.

## Matriz de aceptación y fixtures

Por cada preset real (Sartorial, Imprint, Archive), preparar manifest con `fixture_id`, ruta, ID/handle de prueba, características esperadas, dependencia externa, locale, versión, estado de datos y limpieza. Reutilizar los fixtures históricos F01–F11 solo tras comprobar qué datos existen; no asumir que sus URLs siguen vivas. Nuevos fixtures deben tener IDs estables propios y no colisionar con los anteriores.

| Estado obligatorio | Datos mínimos | Fallo que se intenta detectar |
| --- | --- | --- |
| Vacío | Colección/carrito vacíos, búsqueda sin resultados, recomendaciones vacías, secciones sin bloques/referencias. | Acciones imposibles, errores JS, spinner infinito, espacio huérfano o contenido fingido. |
| Uno solo | Un producto, una variante, una imagen, un bloque/artículo. | Controles de galería innecesarios o defectuosos, grids rotos, recuentos incorrectos. |
| Muchos | 10+ medios, 40 variantes, colección de 200 productos con paginación, múltiples secciones repetidas. | IDs duplicados, listeners duplicados, paginación/filtros incompletos, degradación móvil. |
| Muy largo | Título de 120 caracteres, vendor extenso, labels y moneda largos, precio con decimales, EN/ES y traducciones ampliadas si se añaden. | Overflow de documento, texto cortado sin acceso, botones fuera de vista, formato monetario incoherente. |
| Faltante | Sin imagen/descripción/imagen secundaria, metafield ausente, recurso no disponible en la tienda destino, datos parcialmente configurados. | Imagen rota, Liquid vacío mal resuelto, claims inventados, placeholders de onboarding publicados como contenido final. |

Todos los componentes tocados cruzan los cinco estados; los recorridos de compra usan fixture explícito, no selección oportunista del primer producto. No es obligatorio probar las 200 páginas de un catálogo: comprobar extremos de paginación, transiciones de filtro y resultados representativos con expectativas verificables. Añadir estado mixto de medios presentes/ausentes para las secciones editoriales.

Móvil obligatorio a 360 y 375/390 px, desktop a 1280 px; añadir 768/1024 para composiciones afectadas. Chromium sirve para regresión automatizada, Firefox para la rama real sin scroll-driven cuando corresponda, WebKit/iOS para los comportamientos táctiles y medios críticos. Un navegador que no mide CLS no devuelve un aprobado de CLS. Simulación móvil y dispositivo físico se documentan por separado; AR requiere dispositivo/plataforma compatible y modelo real.

## Cobertura funcional que debe sobrevivir a la referencia Contour

1. **Variantes/cantidades:** cambiar imagen/precio/inventario, variante inexistente/agotada/preorder, URL directa y atrás/adelante. Probar min/increment/max reales (incluyendo min distinto de 1, saltos y límite), entrada vacía/0/negativa/no numérica, subtotal de línea sin alterar precio unitario, compare-at y money format de la tienda. Confirmar en carrito, no solo en DOM de PDP.
2. **Suscripciones:** producto con compra única opcional, plan obligatorio, asignaciones por variante y variante sin asignación; cambiar variante y verificar plan/precio/errores. La adición debe incluir el `selling_plan` correcto y producir una línea válida; sin asignaciones válidas debe impedir una compra inválida. No eliminar esta fortaleza por paridad con Contour: Sartorial usa `quantity_rule` y planes en `main-product.liquid:397–399,483–591`; Contour inicializa cantidad 1/min 1 en `main-product.liquid:221`.
3. **Carrito/filtros:** agregar, actualizar y eliminar, fallos/latencia de red controlados, estado vacío, subtotal/descuentos coherentes, foco/escape/restauración en drawer, teclado, URL de filtros/sorting y navegación histórica. Checkout de prueba según capacidades de la tienda; no realizar pedidos/cargos reales para validar UI.
4. **Apps y Custom Liquid:** insertar un bloque de app real disponible en la tienda de desarrollo y un bloque Custom Liquid seguro en PDP y producto destacado; guardar, mover, duplicar, recargar y confirmar render, foco y ausencia de IDs propios duplicados. Sartorial declara ambos tipos en `main-product.liquid:694–705,1106–1153`; Contour también en main/featured product. Sin app instalada, la comprobación estática prueba el contrato, no la integración: marcar el escenario conectado pendiente con dueño.
5. **Sin JavaScript:** navegación, formulario nativo de producto/variante, cantidades y plan donde aplique, filtros/sorting con submit, carrito y localización. Capturar request/respuesta y resultado; no limitarse a comprobar que la página se ve. No exigir efecto AJAX en no-JS. Contenido de movimiento siempre visible y accesible.
6. **Editor/persistencia:** instalación desde ZIP limpio en cada demo/tema de desarrollo, cambio de estilo, ajustes de fuente/color/ranges en extremos válidos, add/remove/reorder/duplicate de secciones y bloques, guardar y recargar editor/storefront. Probar `shopify:section:load/unload` y selección de bloques, sin inicialización duplicada. Verificar que contenido, imágenes, umbral de envío y metafields dependen de la tienda correcta; no hacer merge/copia ciega de `current` entre demos.
7. **Honestidad editorial:** claims, materiales, origen, cantidades y plazos de demo deben corresponder a datos suministrados. Faltantes se omiten o muestran ayuda de configuración apropiada; no inventar certificaciones, antes/después o procesos fotográficos.

## HTML, accesibilidad y rendimiento comparables

- **HTML renderizado:** guardar HTML de rutas representativas y validar con Nu u otra herramienta acordada sobre salida real de Shopify. Distinguir errores del tema de inyecciones de plataforma/apps; cero errores atribuibles al cambio, IDs únicos y relaciones `for`/ARIA válidas en secciones repetidas. JSON/Liquid válido no prueba HTML final válido.
- **axe y manual:** versión fija, reglas/perfil registrados, resultados JSON sin filtrar silenciosamente. Cero violaciones nuevas atribuibles al tema en rutas y estados afectados; resolver fallos conocidos bloqueantes del alcance. Teclado completo, foco visible/no oculto, orden/tab trap/escape, etiquetas, live regions, zoom y reduced motion con prueba manual. Un scan axe vacío no certifica WCAG ni sustituye lector de pantalla.
- **Objetivos provisionales de proyecto:** conservar Performance ≥60 y Accessibility ≥90 que constan en el ledger, CLS <0.1 y objetivos internos de controles 44×44 px; verificar fuente oficial vigente antes de afirmar que todos esos umbrales son obligaciones Theme Store. WCAG 2.2 AA 2.5.8 tiene matices/excepciones y no debe resumirse como obligación universal de 44×44. El umbral de 24 px que aparece en Contour no reemplaza la regla interna de Sartorial.
- **Lighthouse:** registrar navegador/Lighthouse/axe, dispositivo/viewport/throttling, conexión, región si se conoce, locale/moneda, estado de caché, consentimiento, apps, password/preview y catálogo. Tres corridas en frío por ruta `/`, colección y PDP por preset; conservar todas, mediana y dispersión. Contrastar antes/después con mismo protocolo, mismos contenidos y aplicaciones. Si las demos difieren de catálogo no atribuir diferencias entre presets exclusivamente al código. No comparar puntuaciones históricas de Sartorial con actuales de Contour.
- **Presupuesto de modularización:** capturar bytes transferidos y recursos realmente usados por plantilla/estado, CSS Coverage y coste de ejecución. Mejoría aceptada solo si se reduce carga del componente en rutas ajenas, se conserva primera interacción y no aparecen FOUC/CLS ni ruptura del editor. No adoptar carga tras primer paint de Contour sin comprobar latencia al clic temprano. No fijar como meta absoluta sus kB gzip locales: no son medición de red ni requisito oficial.

## Cinco compuertas y veredicto de cada entrega

1. Ledger: declarar filas afectadas o “mejora de proceso, ninguna fila modificada”; cada eventual cierre lleva artefacto con SHA/tema/preset/ruta y expectativa probada.
2. Estados degenerados: manifest y ejecución de cinco estados por componente afectado y por preset cuando su configuración/composición cambie el comportamiento.
3. Consistencia: inventario de ocurrencias de tokens, moneda, umbrales y selectores; conservar `shop.money_format`, sin duplicar formatos ni datos de tienda.
4. Comerciante: labels `t:` sentence case/inglés neutro, traducciones completas y revisadas, `info` en dependencias externas; validar uso en editor, no solo existencia de claves.
5. Tienda real: candidato servido correcto, ruta real, catálogo pertinente, móvil y artefactos. Los controles estáticos no cierran esta compuerta.

Usar `APTO` / `NO_APTO` / `INCOMPLETO` para el **reporte de ejecución**, siguiendo el contrato del arnés existente, no como nuevos estados del ledger. APTO exige todas las verificaciones obligatorias aplicables medidas y sin fallos. Fallo crítico funcional, inaccesibilidad bloqueante o pérdida de configuración produce NO_APTO. Falta de tienda/app/dato/navegador produce INCOMPLETO con dueño y condición para resolver. N/A requiere justificación de inaplicabilidad real; un dato de prueba que falta o un skip del comparativo de precios no convierte el escenario obligatorio en N/A. La taxonomía `NO_ALCANZABLE` del arnés histórico no debe ocultar una brecha requerida en el alcance del nuevo cambio.

Claude entrega implementación + manifest + resultados; GPT audita intentando reproducir fallos, Gemini contrasta arquitectura/consistencia y liderazgo acepta o devuelve. No se abre refactor de módulos verdes por parecido con Contour. Cada paquete necesita lista cerrada de archivos y contrato de compatibilidad; ampliaciones Nivel 2 siguen autorización explícita del liderazgo conforme al protocolo vigente.

## Paquete de evidencia reutilizable

Ubicación propuesta para una implementación posterior: `agent-comms/outbox-claude/harness-CONTOUR-<paquete>/run-<fecha>-<sha>/` (sin crearla en este informe). Incluir:

- `manifest.json`: commit, ZIP SHA-256, archivos/configuración relevantes, herramientas, preset/tema/tienda de desarrollo sin secretos, rutas/fixtures, locale/moneda y protocolo.
- `cases.json` y reporte humano: expected/actual, PASA/FALLA/NO_MEDIBLE/N/A justificado, duración, dueño de pendiente y relación con fila/compuerta.
- Playwright JSON/HTML y traces de fallos, console/pageerror, peticiones fallidas, capturas comparables; redactar cookies, tokens y datos personales en HAR o logs.
- axe JSON, HTML de validación y resultados Nu, Lighthouse HTML/JSON completos, mediciones de red/Coverage y evidencia de teclado/editor/no-JS/medios.
- Tabla de decisión separando cambios de código, resultado estático, resultado real y requisitos externos. Enlaces a artefactos históricos solo si su commit y cobertura coinciden o el uso histórico queda explícito.

Dependencias externas: acceso de desarrollo existente, catálogo de casos requeridos, app/planes reales de prueba, Shopify Markets/locales, fuentes/media/modelo 3D compatibles, capacidades de retiro/envío y métodos de pago de prueba si se validan. Johandry es dueño de la configuración de tienda; Claude documenta las precondiciones y GPT verifica el resultado. Revisar presencia/estado de bindings existentes cuando se vaya a ejecutar; nunca copiar secretos ni valores desde documentación al plan.

## Evidencia de esta revisión

Comandos ejecutados localmente, sin mutaciones de código:

```sh
git -C /workspace/Tema-Shopify rev-parse HEAD
git -C /tmp/shopify-comparison/atelier rev-parse HEAD
```

Salida literal:

```text
b400cdc5acc345e9e9d6c0c99e3132a3bc6a5e44
1576d06b336abb6827084b7734faebbcb4d8f32f
```

```sh
rg -n 'node-version|playwright test' /workspace/Tema-Shopify/.github/workflows/ci.yml
rg -n '"version": "4.8.0"|"node": ">=22.12.0"' /workspace/Tema-Shopify/package-lock.json
cat /workspace/Tema-Shopify/.nvmrc
```

Salida literal de las lecturas correspondientes:

```text
27:          node-version: 20
58:        run: npx playwright test --list
660:      "version": "4.8.0",
680:        "node": ">=22.12.0"
22.12.0
```

La incompatibilidad declarada existe; no se ejecutó GitHub Actions ni se reprodujo un crash con Node 20. `.github/workflows/ci.yml:57` denomina el paso “Verify Playwright Test Discovery”. `tests/pdp-line-total.spec.mjs:144` omite el caso comparativo si no halla catálogo adecuado. La configuración actual contiene solo el proyecto Chromium desktop (`playwright.config.mjs:17–24`).

```sh
source /workspace/.cloud-setup/activate.sh
npx playwright test --list
```

Salida literal (directorio Sartorial):

```text
Listing tests:
  [chromium] › pdp-line-total.spec.mjs:105:3 › PDP line total › keeps unit price immutable and handles valid and hostile quantities
  [chromium] › pdp-line-total.spec.mjs:142:3 › PDP line total › renders and clears the compare-at line total when catalog data permits
Total: 2 tests in 1 file
```

Esto descubre tests; no ejecuta compra ni comprueba acceso a la tienda.

Script ejecutado: se recorrieron solo filas `| **` de `docs/requirements-ledger.md`, se extrajo la expresión `` `(cumplido|código completo|no verificado|ausente)` `` y se agregaron estados; `json.loads(config/settings_data.json)['presets']` dio los nombres actuales. Salida literal:

```text
Ledger: {'cumplido': 54, 'código completo': 6}
35: **Punto Focal Nativo (`focal_point`)**
38: **Motor de Movimiento Nativo sin Dependencias (CSS Scroll-Driven)**
56: **Soporte de `prefers-reduced-motion`**
57: **Axioma Anti-Invisible del Motor de Revelado**
58: **Contenido Revelado Disponible al Imprimir**
75: **Medios Enriquecidos y Modelos 3D**
Current preset names: Sartorial, Imprint, Archive
```

Búsqueda ejecutada con Python sobre `atelier/**/*.md`, excluyendo `node_modules`, contando matches case-insensitive; salida literal:

```text
Contour markdown matches reject: 2
Contour markdown matches rejection: 0
Contour markdown matches rechaz: 0
Contour markdown matches rebot: 0
Contour markdown matches feedback: 0
Contour markdown matches reviewer: 0
```

Se comprobó `process-timeline` mediante búsqueda de `has_media`/`b.settings.image` y lectura de archivo; salida literal:

```text
18:  assign has_media = false
20:    if b.settings.image != blank
21:      assign has_media = true
57:            {%- if has_media -%}
```

`rg --files .../harness-MOTION-002 .../docs/gate5-reports` confirmó artefactos históricos como `run-2026-10-02-print-live/atelier-chromium-full/results-01-motion-check.json` y `docs/gate5-reports/lh-home.json`; no se auditó su contenido como resultado actual. El contrato de veredicto se leyó en `harness-MOTION-002/README.md:135–171` y distingue explícitamente APTO, NO_APTO e INCOMPLETO y controles positivos de carga/medición.

Estado inicial Sartorial: solo `?? agent-comms/outbox-gpt/GPT-AUDIT-COMPARATIVA-001.md`. Contour devolvió status vacío. El resto del equipo puede producir nuevos documentos en paralelo; este subagente solo escribe su propio archivo.

## Afirmaciones falsables

- A1. El workflow fija Node 20 y el lockfile declara ≥22.12.0 para CLI 4.8.0; es incompatibilidad de requisito declarado, sin crash reproducido en ese runtime.
- A2. CI descubre pruebas y no las ejecuta en su paso Playwright; el descubrimiento local devuelve dos tests en un archivo.
- A3. El ledger tiene 60 filas, 54 cumplidas y 6 en código completo, y este informe no cambia ninguna.
- A4. Los presets actuales son Sartorial/Imprint/Archive; hay nombres Edition en evidencia histórica del ledger que requieren reconciliación de trazabilidad.
- A5. La búsqueda Markdown especificada no localizó feedback de revisores; no prueba ausencia de rechazos ni valida sus motivos.
- A6. `process-timeline` usa una condición “hay al menos una imagen” para `has_media`; el relato documental “todas” no basta para predecir ese estado mixto.
- A7. Sartorial contiene reglas de cantidades, planes de venta y contratos de apps/Custom Liquid que el plan debe preservar; su presencia estática no prueba que todas las integraciones funcionen hoy en Shopify.
