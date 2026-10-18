# Plan de mejoras de Sartorial con Contour como referencia

ID: GPT-PLAN-CONTOUR-001
Fecha: 2026-10-18
Estado: plan multiagente documentado; implementación y validación de cambios pendientes.
Origen: instrucción de Johandry de ampliar GPT-AUDIT-COMPARATIVA-001, usar únicamente Contour y conservar la línea de Sartorial y su estructura de trabajo.

## Objetivo y criterio de adopción

Elevar la madurez de Sartorial como tema de moda editorial mediante prácticas verificables de Contour: especialización útil de presets, organización del código, configuración comprensible, datos de producto fiables y validación de una instalación real. El referente es Contour en `SebastianDev017/atelier`, SHA `1576d06b336abb6827084b7734faebbcb4d8f32f`; la base de Sartorial es `b400cdc5acc345e9e9d6c0c99e3132a3bc6a5e44`.

Se conservan el nombre Sartorial, los presets Sartorial/Imprint/Archive, el lenguaje visual editorial, los tokens, Liquid/JSON/CSS/JS nativo y las capacidades comerciales existentes. Las identidades concretas se evalúan desde la configuración actual. Las propuestas de recorrido no cambian por sí mismas un posicionamiento comercial ya decidido.

Cada mejora deberá declarar: práctica observable en Contour → problema real en Sartorial → adaptación original → prueba de mejora → compatibilidad y reversión. El número de secciones o el historial de revisiones del referente no sustituyen esa cadena.

Johandry recuerda un rechazo de Contour por «falta de personalización o algo así», sin disponer del reporte completo. Se registra como pista aportada por el usuario, no como causa confirmada. Personalización puede referirse a libertad de configuración del comerciante o a diferenciación/originalidad comercial; se investigan ambas lecturas. Los rechazos de Contour mencionados por Johandry se registran como contexto aportado por el usuario. No se localizaron dictámenes de revisión en la documentación examinada. Si se aportan observaciones concretas se incorporarán al registro de aprendizaje; esta ausencia no bloquea el plan verificable. No se infiere que Contour esté aprobado ni que cada decisión suya sea un requisito Shopify.

## Equipo y continuidad del protocolo

| Función | Responsable nominal del proyecto | Entrega |
|---|---|---|
| Prioridad comercial, identidad y recursos de tienda | Johandry | Objetivo y catálogo representativo, acceso y decisiones de negocio |
| Liderazgo técnico temporal y coordinación de implementación | Claude | Secuencia final, alcance cerrado, ejecución y evidencia por sprint |
| Arquitectura consultora y contratos técnicos | Gemini | Diseño, validación de dependencias y directivas conforme a AGENTS.md |
| Auditoría de producto y verificación independiente | GPT/Codex | Contraste de fuentes, riesgos y revisión adversarial |

Los tres análisis preparatorios y la revisión independiente de este plan son trabajo real de subagentes Codex. Los roles nominales de Claude/Gemini describen el flujo vigente; no indican que se haya ejecutado otro proveedor o que estos hayan aprobado el plan.

Se mantienen `agent-comms/inbox-*`, `outbox-*`, `reviews/`, los IDs estables y las cinco compuertas de RULES.md. BOARD.md conserva su escritor exclusivo. Cada archivo de implementación tendrá un solo escritor por paquete; si dos tareas comparten `theme.js`, se ejecutarán en secuencia. Este encargo no cambia estados del ledger, no modifica código, no despliega y no crea commits.

## Lectura conjunta de los agentes

- Técnico: [GPT-CONTOUR-TECH-001](../agent-comms/outbox-gpt/GPT-CONTOUR-TECH-001.md). Separación contextual de recursos, preservando ThemeElement/ThemeCore, eventos del editor y formularios nativos.
- Producto: [GPT-CONTOUR-PRODUCT-001](../agent-comms/outbox-gpt/GPT-CONTOUR-PRODUCT-001.md). Datos y ayuda fiables; recorridos distintos con piezas existentes; español del editor antes de expandir idiomas.
- Calidad: [GPT-CONTOUR-QA-001](../agent-comms/outbox-gpt/GPT-CONTOUR-QA-001.md). Procedencia de evidencias, cobertura por preset y conciliación con el ledger.
- Revisión independiente del conjunto: [GPT-REVIEW-CONTOUR-PLAN-001](../agent-comms/reviews/GPT-REVIEW-CONTOUR-PLAN-001.md).

Los IDs CONTOUR-00 a CONTOUR-06 siguientes identifican los paquetes de la síntesis. Los IDs CT-* y PRD-* de los informes de apoyo son propuestas de sus autores, no directivas de implementación paralelas.

## Mejoras recomendadas y límites

| Aprendizaje de Contour | Mejora concreta para Sartorial | Evidencia de partida y aceptación |
|---|---|---|
| Cada preset resuelve un caso de compra y posee contenido de demostración coherente | Hacer visible la diferencia existente de Imprint y Archive; ensayar orden/composición por tarea de moda | Imprint ya usa `technical_specs` y Archive `provenance` en sus product.json:72. Comparar recorridos, no inferir igualdad de PDP por compartir main-product |
| Datos de medidas ausentes se mantienen sin publicar, según DEVELOPMENT.md:130-135 | Revisar inferencias de material/fabricación y defaults de demostración | product-technical-specs.liquid:46-69 publica texto a partir de handle brass/paperweight. La corrección futura debe exigir datos explícitos y un caso negativo verificable |
| Módulos funcionales y dependencias explícitas | Extraer CSS de un componente opcional y, después, evaluar su JS | Contour/layout/theme.liquid:173-200 sigue cargando varios módulos globales. Reducir solicitudes/bytes reales en páginas sin componente, conservando editor |
| Localización del editor y ayuda para configurar un producto complejo | Completar schema ES, recetas de tallas/materiales/procedencia y ayuda de envío/mercados | Sartorial dispone de storefront ES y labels t:, pero un solo schema EN; docs.html:204 conserva Edition y :254 promete cálculo automático de umbral |
| Separación entre código del tema y contenido propio de las tiendas | Verificar actualización, importación limpia y conservación del editor por preset | Contour/DEVELOPMENT.md:69-77 describe aislamiento del contenido. Adaptar el principio, sin adoptar automáticamente sus ramas, comandos de merge o despliegue |
| Preparación explícita de revisión y resolución de fricciones | Dossier con SHA, fixtures, pruebas de compra, editor, accesibilidad y rendimiento | RELEASE-NOTES.md y DEVELOPMENT.md son registros del autor; las afirmaciones y umbrales requieren verificación independiente |

Sartorial ya contiene guía de tallas, lookbook comprable, conjuntos, inventario, zoom, filtros, planes de venta, destinatario de gift card, moneda nativa, @app y Liquid personalizado. Las tareas de regresión protegen esas capacidades; no se presentan como nuevas implementaciones por tomar Contour de referencia.

## Paquetes, orden y aceptación

### CONTOUR-00 — Fijar la evidencia y los contratos de trabajo

Prioridad: preparación. Dueños: Claude coordina, Gemini encuadra, GPT contrasta; Johandry aporta contexto comercial.

Alcance: manifiesto nuevo de evaluación y notas de revisión; lectura de fuentes y configuración actual. Registrar SHA, versión de herramientas, preset, theme ID/URL, datos de catálogo, viewport y fecha. Contrastar requisitos oficiales actuales y clasificar cada aprendizaje como norma vigente, decisión del autor, observación reproducida o hipótesis. La consulta actual de requisitos oficiales fue rechazada por el proxy (403); no se presenta como norma revalidada.

Conciliar nombres históricos Edition/Studio frente al estado Imprint y revisar evidencias del ledger por identidad de requisito y fecha. Las seis filas en código completo y las evidencias antiguas se inspeccionarán sin cerrarlas ni reabrir filas verdes de forma automática. No cambiar contratos, IDs o branding como parte de esa conciliación.

Salida: matriz de trazabilidad y lista cerrada de archivos por paquete. Se puede hacer sin tienda. La historia completa de rechazos no es requisito para avanzar con mejoras observables.

### CONTOUR-01 — Corregir reproducibilidad y veracidad documental

Prioridad: alta. Dueño: Claude; contrato y alcance: Gemini; auditoría: GPT.

Dos pistas independientes preparables en paralelo:

A. CI: `.github/workflows/ci.yml` debe usar la versión de `.nvmrc` (22.12.0), compatible con el engine del lockfile:680. Separar explícitamente descubrimiento de tests y ejecución real. Conservar instalación con lockfile. Alcance adicional de configuración/fixtures se fija antes de implementarlo.

B. Producto y ayuda: corregir inferencias no sustentadas de material/fabricación en `snippets/product-technical-specs.liquid` mediante datos explícitos o ausencia definida; revisar únicamente defaults y copy relacionados, sin reescribir módulos aprobados ajenos. Conciliar `docs/merchant/docs.html` con Imprint, sus funciones vigentes y el umbral de envío configurado manualmente; revisar texto que promete rendimiento o conversión sin medición. No reinterpretar la tarifa configurada como tarifa creada por el tema. Cualquier cambio de default/schema es Nivel 2 y debe describirse en la directiva técnica.

Aceptación: las ocho compuertas estáticas pasan; un producto sin metafields y con handle `brass`/`paperweight` no recibe afirmaciones de material o fabricación por esa coincidencia; un producto con datos explícitos los conserva. Añadir un caso de regresión que distinga ambas ramas al implementar esa corrección. La guía coincide con controles reales, tipos y dependencias externas. La ejecución conectada del CI queda pendiente hasta disponer del servicio; `--list` nunca equivale a tests pasados.

Reversión: cambio de CI y corrección de copy/datos en entregas separables. Preservar configuración del comerciante; no restaurar ciegamente settings_data ni el tema remoto.

### CONTOUR-02 — Línea base funcional y de recursos en tienda

Prioridad: alta; antes de extraer recursos o cambiar composiciones. Dueños: Claude ejecuta, GPT revisa comparabilidad, Gemini fija el contrato; Johandry dispone de las tiendas/credenciales por el flujo seguro existente.

Alcance futuro: arnés existente o nuevos fixtures/pruebas enumerados; no reescritura de la aplicación. Manifestar qué presets comparten tienda y cuáles tienen catálogo propio. Conservar las diferencias deliberadas de contenido.

Matriz mínima: Sartorial, Imprint y Archive × home, colección, PDP, carrito y búsqueda × móvil 375 px y escritorio 1280 px = 30 combinaciones de navegación. Añadir 360 px para títulos/traducciones largos y 768 px donde cambie la disposición. En cada flujo aplicar los cinco estados de RULES.md de forma pertinente.

Compra: variante disponible/agotada, cantidades válidas e inválidas, regla min/step/max, total por cantidad, compare-at-price, carrito vacío/alta/cambio/eliminación, selling_plan, apps/Liquid personalizado y regresión sin JS cuando corresponda. Ejecutar los dos tests existentes de PDP con catálogo que permita ambos: resultado esperado 2 passed, 0 skipped; si no hay fixture de compare-at, se declara cobertura incompleta.

Rendimiento: home/colección/PDP de cada preset en móvil y escritorio, tres ejecuciones comparables por URL/perfil (54 informes si se completa esa matriz). Registrar mediana, entorno, peticiones, bytes transferidos, LCP/CLS/TBT y observaciones de interacción; Lighthouse de laboratorio no sustituye INP de campo. Identificar imágenes, fuentes y apps para aislar su contribución. No repetir 54 auditorías por cada commit: tras un piloto, repetir perfiles afectados; ampliar solo si aparece regresión.

Accesibilidad/HTML: axe y validador de HTML sobre renders actuales, más foco, Escape, teclado, zoom, reduced motion y anuncios. Una salida sin errores de una herramienta no acredita accesibilidad completa. Se mantienen los objetivos internos documentados en el ledger y el contrato de cada sprint, incluido el objetivo de controles de 44 px (ledger:51); no se rebajan al mínimo mencionado por el referente. Las cinco compuertas siguen procediendo de RULES.md.

Salida: evidencia de ejecución real con resultados pasados/fallidos/omitidos separados y rutas a crudos. No avanzar a una optimización de rendimiento certificada sin línea base; sí continuar documentación y catálogo si falta acceso.

### CONTOUR-03 — Piloto de CSS y, después, JS contextual

Prioridad: media. Depende de CONTOUR-02 y de una directiva técnica acotada. Dueños: Claude implementa; Gemini valida cascada/grafo; GPT verifica red, editor y regresión.

Primer candidato: estilos propios del lookbook, condicionado a que el inventario de dependencias confirme aislamiento y ahorro útil. Archivos candidatos: `assets/base.css`, `sections/lookbook.liquid` y un asset nuevo cuyo nombre se cierre en la directiva. No extraer estilos compartidos por intuición ni borrar CSS por una única cobertura de navegador.

Aceptación del piloto: en página sin lookbook no se pide su asset y los bytes CSS bajan; con dos instancias hay una descarga compartida y ambas funcionan. Sin diferencias visuales no deseadas, overflow nuevo, degradación de foco o contenido oculto. Fijar antes del cambio la tolerancia de medición: propuesta interna inicial de diagnóstico, CLS sin aumento >0.01 y medianas LCP/TBT sin regresión >10% bajo el mismo protocolo; ruido exige diagnóstico, no aprobación por selección del mejor run. Estas tolerancias son adicionales a los presupuestos absolutos internos documentados y a los requisitos vigentes tras revalidación; una línea base que ya incumple un presupuesto no se acepta solo por permanecer igual. No son umbrales oficiales Shopify ni resultados actuales.

Solo si el piloto es útil, evaluar extraer el JS del mismo componente. Conservar `ThemeElement`, `ThemeCore`, utilidades y formularios críticos. Si aumenta el inventario de assets JS, incluir todos los nuevos archivos en gates:syntax dentro del alcance. No basta con mover código si el núcleo crece hasta consumir el ahorro.

La carga debe depender de la presencia real de la sección, también cuando el comerciante la inserta en otra plantilla. Probar diez ciclos de añadir, duplicar, reordenar y eliminar en Theme Editor sin doble registro/acciones ni escuchas residuales. Conservar selección de bloques, limpieza, interacción temprana y ausencia de componente. No adoptar el cargador pospintado global, GSAP/Lenis, cursores o transiciones de Contour como receta automática.

Reversión: piloto autocontenido que restablece reglas y carga anteriores; no modifica IDs, defaults ni datos guardados. La expansión a otro componente se decide con la evidencia del primero.

### CONTOUR-04 — Personalización comprobable y diferenciación con piezas existentes

Prioridad: alta por la pista aportada sobre personalización; se analiza desde CONTOUR-00 en paralelo. Prototipos de contenido y revisión de lenguaje pueden prepararse durante el diagnóstico; cambios de configuración/composición esperan alcance cerrado y línea base. Se prioriza este paquete antes de ampliar el piloto de recursos.

Antes de añadir opciones, construir una matriz de tareas de personalización para ambos temas: tarea de comerciante → control actual global/sección/bloque → propagación al render → herencia/alcance → comportamiento móvil → persistencia → evidencia. Clasificar por separado soporte observado en código, validación en editor pendiente, límite deliberado y brecha demostrada. Una opción declarada en schema no acredita que se aplique correctamente; una mayor cantidad de controles tampoco demuestra libertad útil.

La comparación de Contour se limita al código y documentación disponibles. Las pruebas de editor/Gate 5 de este plan corresponden a Sartorial; no requieren acceso ni cambios a tiendas ajenas. Probar Contour en ejecución sería un estudio separado en una copia/tienda propia autorizada, no una dependencia de este plan.

Tareas representativas: cambiar color de una sola sección sin alterar las demás; variar composición/proporción del hero; adaptar densidad y proporción de tarjetas de colección; reordenar bloques de PDP y añadir app/Liquid; crear dos instancias de una sección con configuraciones diferentes; conservar ajustes tras duplicar, reordenar, guardar y recargar; comprobar móvil y selector de preset. No se exige ofrecer cualquier cambio en cada componente: registrar los límites actuales y el beneficio antes de expandir su contrato.

Aceptación de personalización: un comerciante puede realizar las tareas soportadas sin editar código; cada control actúa sobre su superficie anunciada, la ausencia de un control se explica y los valores persisten. Si se confirma una brecha, priorizar solo dos o tres ajustes con utilidad para moda, sin duplicar variantes que ya existan. La aceptación exige además dos composiciones visuales y recorridos originales dentro de un mismo preset con controles existentes, sin CSS/JS personalizado; cambiar solo fotos o textos no demuestra esa libertad. Se documentan límites concretos, narrativa y activos propios. La diferenciación comercial se revisa con catálogos y recorridos propios, no por una cuota de settings ni de secciones.

Dos candidatos contrastados para el ensayo, sin tratarlos como fallos de Shopify:

- Espaciado local: Contour ofrece padding superior/inferior en secciones como main-collection (settings:196-197 y aplicación:8-9); Sartorial depende del espaciado global en varias superficies, sin esos ajustes locales en main-collection/main-product/brand-manifesto. Empezar, si se demuestra la necesidad, por brand-manifesto; estado inicial de herencia conserva el aspecto actual y permite ajustar una instancia sin afectar otras. No extender todos los schemas a la vez.
- Columnas móviles de colección: Contour ofrece columns_mobile independiente (main-collection:165-171, aplicado:11); Sartorial combina default_grid_columns y mapeo responsive de 2/4/list con preferencia guardada del comprador. Si el ensayo justifica control móvil independiente, documentar precedencia respecto a esa preferencia, mantener el comportamiento actual como valor inicial y probarlo sin generar nuevos almacenamientos ni perder la vista elegida por el visitante.

La tercera entrega inmediata es la receta ES/EN de alcance global/local, herencia, límites y datos dinámicos. No se propone un nuevo ratio de tarjetas o controles tipográficos genéricos solo para aumentar opciones: esa necesidad no quedó demostrada en esta comparación.

1. Español del editor: nueva locale `es.schema.json` con paridad de claves/tipos y revisión humana, sin renombrar IDs. Comparar explícitamente EN/ES por rutas de claves, tipos y placeholders/interpolaciones; `gates:locales` actual solo carga los archivos base EN, por lo que su resultado verde no valida ES. Puede usarse un comparador de revisión acotado o un script incluido expresamente en la directiva, con un caso negativo de clave/placeholder ausente. Probar cadenas largas y textos de ayuda de dependencias externas. DE/FR/IT son una opción de mercado posterior, no una obligación por igualar Contour.
2. Recetas originales: Sartorial destaca descubrimiento editorial y compra de conjunto con confianza de talla; Imprint, construcción/materiales de prendas o accesorios cuando haya datos; Archive, contexto y procedencia verificables. Son propuestas de recorrido dentro de la línea existente, no posicionamientos nuevos aprobados.
3. Demostrar primero los recorridos mediante orden, bloques y datos existentes. Mantener `technical_specs` en Imprint y `provenance` en Archive. La igualdad de tipos de sección no demuestra falta de diferenciación; evaluar la experiencia en catálogo real.
4. Probar añadir y configurar una sección en ES, conectar producto/datos, duplicarla, guardar, recargar y mantener ajustes. Documentar tallas, materiales, procedencia, suscripciones, envío y dependencias externas sin claims inventados.

Aceptación: mismas capacidades comerciales, paridad y resolución de claves sin nuevas huérfanas; configuración comprensible en prueba guiada con comerciante; cinco estados y accesibilidad/Gate 5 en superficies afectadas. No tocar plantillas guardadas de una tienda ajena como consecuencia del cambio de preset. Reversión por paquete de locale/composición, preservando datos actuales.

### CONTOUR-05 — Una ampliación original solo si resuelve una carencia demostrada

Prioridad: opcional, fuera del primer ciclo. Depende de la evaluación de CONTOUR-04 y decisión de producto de Johandry.

Candidatos para investigar: relato por etapas de confección/cuidado inspirado en el propósito de process-timeline; comparación sencilla de corte/tejido si guía de tallas, technical_specs y filtros no resuelven una decisión real. No se adoptan simuladores de marcos o bibliotecas de cerámica ni se crea otra guía de tallas, lookbook o comparador por mera paridad de funciones.

Promoción a implementación: tarea de usuario observada, alternativa existente evaluada, contenido real disponible, beneficio concreto, presupuesto de recursos y alcance cerrados. Si no hay esa evidencia, se conserva el producto sin añadir la sección. Preservar el catálogo útil, no perseguir sesenta secciones.

### CONTOUR-06 — Instalación limpia, actualización y dossier de revisión

Prioridad: salida del ciclo; no equivale a autorización de publicación.

Probar paquete nuevo en destino de desarrollo, con manifest de archivos y checksum, sin borrar datos del comerciante. Verificar por preset las configuraciones, imágenes, placeholders de onboarding, enlaces de documentación/soporte y restauración de ajustes tras un cambio de código. Preparar una política de promoción código/contenido; no trasladar los comandos de ramas de Contour sin adaptar su semántica.

Cada hallazgo debe tener antes/después, SHA/theme ID, prueba y revisión independiente. Mapear la evidencia por nombre de requisito del ledger y validar su fila actual; no usar números de línea históricos como identificadores duraderos. Las herramientas estáticas y los resultados históricos no bastan para cerrar una fila empírica. Si una prueba no se pudo ejecutar, permanece explícitamente pendiente.

El dossier separa requisitos oficiales revalidados, objetivos internos y aprendizaje del autor. Revisión técnica de Claude, consultoría/contrato de Gemini y auditoría GPT según protocolo; Johandry conserva decisiones de negocio y publicación. Este documento no certifica aceptación Shopify.

## Dependencias, trabajo paralelo y primer paquete concreto

Ruta ajustada a la pista de personalización: CONTOUR-00 → CONTOUR-01 → CONTOUR-02 → CONTOUR-04 → CONTOUR-03 → CONTOUR-06. La matriz de CONTOUR-04 empieza en paralelo a CONTOUR-00 y se valida sobre la base estable; CONTOUR-05 solo se incorpora si se justifica. CONTOUR-06 verifica todos los cambios que finalmente entren, no presupone ejecutar cada opción.

Se puede paralelizar la corrección de CI con inventario de datos/copy y preparación de fixtures, siempre con archivos distintos. No se paralelizan escritores de `theme.js`, schemas compartidos o templates. La revisión independiente recibe un paquete con alcance y crudos, sin aprobar sus propias afirmaciones.

Primer paquete propuesto a Claude/Gemini: fijar Node de CI, separar descubrimiento/ejecución de tests, especificar fixture para ambos casos PDP, registrar el contrato de datos explícitos/ayuda de envío y completar la matriz de personalización actual para seleccionar sus brechas reales. Ninguna extracción masiva ni nueva sección entra en ese primer paquete.

El plan está listo para el flujo de directivas vigente. No necesita una nueva elección del usuario para documentar lo autorizado; las opciones comerciales futuras se resuelven cuando exista un prototipo y evidencia concretos.
