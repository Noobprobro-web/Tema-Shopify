ID: GPT-PLAN-IMPLEMENTACION-SARTORIAL-001
Estado: Propuesta para revisión; implementación no iniciada.
Decisión requerida: Johandry aprueba el alcance y el build objetivo antes de emitir órdenes de implementación.
Resumen en 5 líneas:
1. GPT será el implementador principal, según la instrucción más reciente de Johandry.
2. Antigravity coordinará el proyecto e implementará tareas sencillas con alcance cerrado.
3. Claude revisará de forma independiente cada entrega de GPT y Antigravity.
4. El trabajo se divide en preparación, lotes P1/P2/P3 y compuertas de envío.
5. Este documento organiza el trabajo futuro; no autoriza cambios de código ni acciones en tiendas.
Archivos tocados: agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001.md (nuevo).
Desviaciones (Nivel 1 o Nivel 2): Reparto de roles solicitado expresamente por Johandry en el chat; no se modifica AGENTS.md, RULES.md ni BOARD.md con esta entrega.
Hallazgos extra fuera de alcance (con parche listo): Ninguno; no se prepararon parches de código.
Verificación (comando, resultado y qué demuestra/qué no): Test-Path -LiteralPath 'agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001.md' devolvió False antes de crear el documento; demuestra que el destino no existía en esa comprobación. No se ejecutaron pruebas de código ni de tienda.
Lista de afirmaciones falsables numeradas:
1. El único archivo creado por esta entrega es este plan.
2. El reparto propuesto asigna implementación principal a GPT, tareas sencillas y coordinación a Antigravity, y revisión independiente a Claude.
3. Cada tarea tiene responsable, dependencia y criterio de verificación previstos.
4. Las observaciones históricas de las auditorías deberán revalidarse en el build elegido.

# Plan de implementación de mejoras de Sartorial

Fecha: 2026-10-29.
Destinatarios: Johandry, Claude, el chat de GPT implementador y Antigravity.

## 1. Alcance y fuentes

Este plan recoge las mejoras acordadas a partir de las dos auditorías maestras y sus anexos. Organiza responsabilidades y entregas; la implementación comienza únicamente con la orden correspondiente de Johandry y una directiva de alcance cerrado.

Fuentes del plan:

- `agent-comms/outbox-gpt/GPT-AUDIT-THREE-THEMES-MASTER-001.md`.
- `agent-comms/outbox-gpt/GPT-AUDIT-THREE-THEMES-VISUAL-001.md`.
- `agent-comms/outbox-claude/CLAUDE-AUDIT-THREE-THEMES-MASTER-001.md`.
- `agent-comms/outbox-claude/CLAUDE-AUDIT-THREE-THEMES-LIVE-001.md`.

Las fuentes documentan observaciones históricas. El plan no presenta esas observaciones como una comprobación actual de la tienda. Sus anexos en vivo prevalecen sobre las maestras al determinar el estado documentado de un hallazgo. La consolidación previa no confirmó P0; las compuertas de envío se mantienen aparte de los defectos.

No se copiará código de Atelier ni Cucuyo. Cucuyo permanece como una instantánea de vigencia no confirmada, fuera de la comparación principal. No se crearán ni utilizarán las siete definiciones de metafields pendientes de aprobación.

## 2. Reparto de responsabilidades

| Participante | Responsabilidad y entregable |
| --- | --- |
| Johandry | Autoridad final sobre alcance, contenido y activos de demos, decisiones de negocio, build de envío, escrituras en tiendas, commits, pushes y publicaciones. |
| GPT | Implementador principal de Liquid, JavaScript, CSS, JSON y schemas. Investiga la causa en el código real, implementa la lista cerrada de su directiva, ejecuta las verificaciones autorizadas y entrega informe, diff y arnés. Delega subtareas a subagentes con archivos asignados cuando corresponda. |
| Antigravity | Fija identidad del build, coordina tablero, directivas, ramas/worktrees y turnos de escritura. Implementa tareas pequeñas y localizadas expresamente asignadas. Coordina catálogo, configuración de demos, pruebas en tienda y preparación de envío con las autorizaciones necesarias. |
| Claude | Revisor independiente de los cambios de GPT y Antigravity. Abre el código del build identificado, intenta falsificar las afirmaciones del implementador y emite dictamen: aceptar, devolver con hallazgos o escalar a Johandry. |

Este reparto sigue la instrucción explícita más reciente de Johandry: GPT implementa principalmente, Antigravity atiende tareas sencillas y Claude revisa. Antes de la primera implementación, Antigravity debe registrar la distribución aprobada en los documentos de gobierno que le corresponde mantener; este plan no los edita.

Reglas de coordinación:

- Un solo agente modifica código del proyecto a la vez. Antigravity mantiene el turno y la lista de archivos en vuelo.
- Las lecturas y revisiones independientes pueden hacerse en paralelo si no comparten una tarea ya asignada.
- Cada directiva debe fijar ID, build/SHA base, archivos permitidos, requisitos del ledger, comportamiento esperado, pruebas y límites.
- Ningún implementador acepta su propia entrega. Claude revisa tanto a GPT como a Antigravity.
- Las desviaciones locales equivalentes se documentan. Los cambios de contrato o ampliaciones de alcance requieren autorización explícita antes de ejecutarse.
- No hay commit, push, publicación ni escritura en tiendas autorizados por este documento.

## 3. Preparación obligatoria: fijar la versión

Responsable: Antigravity. Revisor: Claude. Dependencia: ninguna implementación puede comenzar antes de resolver esta fase.

El contexto de esta conversación informa dos identidades distintas: el checkout `Tema Shopify` en `b45e913` y el worktree de las auditorías `Tema-Shopify-codex` en `09f8342`. El primero no debe sustituir silenciosamente al segundo. Estos identificadores son antecedentes de planificación y deben comprobarse de nuevo al iniciar el trabajo.

Antigravity deberá:

1. Comprobar rama, HEAD, estado rastreado y archivos sin seguimiento del checkout elegido; resolver cualquier error que impida conocer su estado.
2. Registrar SHA completo, hashes de los archivos locales relevantes, ZIP/hash y relación con el tema observado en tienda.
3. Contrastar los hallazgos con el código real de ese build y localizar todas las ocurrencias de cada causa raíz.
4. Reconciliar el plan con el tablero y el plan maestro vigentes para evitar duplicar sprints ya abiertos o corregidos.
5. Proponer a Johandry el build objetivo. El submission `09f8342` no contiene los tres arreglos que los informes atribuyen al ZIP integrado: footer, foco de galería y liberación del gesto de zoom. Johandry decide qué build enviar.
6. Emitir la primera directiva con archivos cerrados y filas del ledger verificadas. No se inventarán números de fila.

Salida: ficha de identidad del build, decisiones pendientes y primera directiva. Criterio de cierre: todos los agentes pueden identificar la misma versión y distinguir código, configuración y contenido de demo.

## 4. Lotes de implementación

Las estimaciones son orientativas, en jornadas de una persona; incluyen verificación dirigida. Se recalibran después de fijar el build. Las rutas son candidatas procedentes del plan auditado: cada directiva debe confirmar las rutas exactas antes de escribir.

### Lote A — P1: compra, datos y foco

Implementador: GPT. Revisor: Claude. Coordinación: Antigravity. Dependencia: preparación completada.

| ID | Trabajo | Áreas candidatas | Esfuerzo | Criterio de verificación |
| --- | --- | --- | --- | --- |
| A-01 | Garantizar un único `selling_plan` efectivo y coherente con la elección actual. | `sections/main-product.liquid`, `sections/featured-product.liquid`, `assets/theme.js`. | 1–2 d | Probar compra única, plan opcional y obligatorio; carga con/sin parámetro de URL y cambios de plan/variante en ambas superficies. El payload debe expresar exactamente la selección actual. La reproducción histórica en fixture no sustituye la prueba en tienda. |
| A-02 | Retirar inferencias de materiales, procedencia o época a partir de handle, título o tipo de producto. | `snippets/product-technical-specs.liquid`, `snippets/product-provenance.liquid` y bloques relacionados. | 1–2 d | Mostrar únicamente datos de mecanismos ya aprobados; ocultar atributos ausentes. Probar tipos genéricos, datos faltantes y nombres ambiguos. Sin las siete definiciones pendientes. |
| A-03 | Mejorar foco visible en los esquemas de Imprint y Archive. | `assets/base.css` y configuración de esquemas correspondiente. | 0,5–1 d | Teclado sobre los fondos reales de ambos presets, incluidos fondos con imagen, y con movimiento reducido. Revalidar el contraste en tienda; la evidencia histórica de estos presets fue estática/simulada. |

El foco de Archive mantiene prioridad P2 en la evaluación previa, pero puede agruparse con Imprint para corregir la misma familia de estilos sin duplicar trabajo.

### Lote B — P2: navegación y resiliencia de compra

Implementador principal: GPT. Revisor: Claude. Coordinación: Antigravity. Dependencia: Lote A revisado; la directiva puede adelantar lecturas sin escritura.

| ID | Trabajo | Áreas candidatas | Esfuerzo | Criterio de verificación |
| --- | --- | --- | --- | --- |
| B-01 | Reconciliar el menú abierto al cruzar un breakpoint. | `ThemeDrawer` en `assets/theme.js` y reglas responsive de `assets/base.css`. | 0,5–1 d | Abrir a 390 px, pasar a 1280 px y volver; probar orientación. Restaurar scroll, `inert`, foco y estado sin depender de Escape. |
| B-02 | Enviar la variante elegida si JavaScript está desactivado o falla. | Formularios de producto y producto destacado, `assets/theme.js`. | 1–2 d | Probar URL con variante, disponibles y agotadas, y envío nativo en ambas superficies. El formulario no puede mostrar una variante y enviar otra. |
| B-03 | Reconciliar un add-to-cart cuyo resultado sea incierto. | `assets/theme.js` y mensajes de locales. | 1–2 d | Simular POST aceptado con respuesta perdida; consultar el carrito antes de invitar a reintentar y comprobar cantidades. No describir este riesgo como doble cobro. |
| B-04 | Guardar la nota antes de navegar desde el drawer. | Lógica de carrito y snippet/sección del drawer, ruta exacta por confirmar. | 0,5–1 d | Editar nota y seguir a carrito o checkout; comprobar persistencia y ausencia de carreras con otras acciones del drawer. |
| B-05 | Hacer que el nombre accesible del idioma incluya el texto visible. | Snippet/formulario de localización y locales, rutas por localizar. | 0,25–0,5 d | Revisar “ES” en header de escritorio y footer móvil con teclado y nombre accesible. |

Antigravity puede ejecutar B-05 si el preflight confirma un cambio pequeño y localizado. Se le asignará un turno y una lista cerrada de archivos; no lo hará mientras GPT esté escribiendo en ellos.

### Lote C — P2: colecciones, instalación y rendimiento

Implementador de cambios estructurales: GPT. Coordinación y tareas sencillas: Antigravity. Revisor: Claude. Dependencia: compra y navegación estabilizadas.

| ID | Dueño | Trabajo | Esfuerzo | Criterio de verificación |
| --- | --- | --- | --- | --- |
| C-01 | GPT | Compactar filtros y controles de colección móvil sin perder funciones. | 1–2 d | Aplicar y limpiar filtros, navegar con teclado y probar resultados vacíos. Comparar posición de primera tarjeta con el mismo viewport útil, sin atribuir una mejora de conversión no medida. |
| C-02 | Antigravity coordina; GPT cambia código si procede | Alinear plantillas raíz, instalación y demos canónicas por preset. | 1–2 d más instalación | Instalación limpia y comparación por preset. Confirmar qué instala Shopify; no trasladar contenido de demo indebido al paquete. |
| C-03 | GPT | Perfilar antes de reducir trabajo global o dividir CSS/JS. | 2–4 d después del perfilado | Medir la misma matriz antes/después y conservar resultados. Solo separar carga o trabajo de componentes cuando el perfilado lo justifique; respetar módulos ya aprobados fuera de alcance. |
| C-04 | Antigravity | Completar documentación, nombres y soporte público con datos confirmados. | 1–2 d | Sartorial/Imprint/Archive coherentes; instrucciones reales y claims respaldados. Johandry confirma buzón/dominio; cualquier envío de prueba requiere autorización. |

Áreas candidatas: sección/filtros de colección; `templates/` y `listings/*/templates/`; `assets/theme.js`, `assets/base.css` y carga en layouts; documentación y plantillas públicas de soporte. Las rutas concretas se cierran en cada directiva.

### Lote D — P1 de demos y P3 de producto/pulido

Responsables según tabla. Revisor: Claude. Dependencia: contenido aprobado y build fijado; puede planificarse en paralelo, con turnos de escritura coordinados.

| ID | Prioridad / dueño | Trabajo | Esfuerzo | Criterio de verificación |
| --- | --- | --- | --- | --- |
| D-01 | P1 demo / Antigravity | Sustituir placeholders, retirar fixtures de QA y completar catálogo/imágenes aprobados. | 2–4 d de configuración más producción de activos | Johandry aprueba contenido y las escrituras correspondientes. Recorrer Home/PLP/PDP móvil y escritorio por preset; sin fixtures ni placeholders en rutas públicas. |
| D-02 | P3 / GPT | Alinear inventario, disponibilidad de planes, cantidad y guía de tallas. | 1–2 d | Probar agotado, plan obligatorio no disponible, límites de cantidad y medidas de ejemplo. Evitar mensajes contradictorios y presentar ejemplos como ejemplos. |
| D-03 | P3 / Antigravity si es local; GPT si es transversal | Pulir alineaciones, salto de scrollbar, tarjetas con/sin swatches, newsletter duplicada y salida comercial del carrito vacío. | 1–3 d | Viewport estable; títulos largos y distintas variantes; navegación clara. Johandry confirma la intención del hero antes de cambiar su alineación. |

### Lote E — Diferenciación del editor, sujeto a aprobación

Antigravity coordina la propuesta; GPT estima e implementa el alcance aprobado; Claude revisa. No se abre este lote por asumir que más opciones equivalen a mejor producto.

La propuesta debe definir tareas concretas de comerciantes y la función de cada preset antes de elegir nuevas variantes de header/tarjeta, espaciado por sección o footer por bloques. Estimación preliminar: 5–10 días después de aprobar el diseño y la compatibilidad de settings. Cierre: capacidades útiles comprobadas en instalación, móvil y estados límite, sin copiar código de los temas de referencia.

## 5. Procedimiento de entrega por lote

1. Antigravity registra dueño y turno; emite una directiva con ID, build, alcance cerrado, dependencias y criterios de aceptación.
2. El implementador hace preflight de Git y código, reproduce la causa y documenta si el hallazgo ya está corregido, sigue vigente o no puede verificarse.
3. El implementador realiza los cambios autorizados y las verificaciones de la directiva; entrega informe con cabecera de RULES §1.4, diff, arnés, comandos/salidas y límites.
4. Claude abre el código de la misma versión y revisa tanto alcance como comportamiento. Un informe del implementador no basta como verificación.
5. El implementador corrige los hallazgos devueltos dentro de alcance; cualquier ampliación se escala antes de escribir.
6. Antigravity comprueba las cinco compuertas, actualiza el tablero y propone la siguiente acción. Ningún commit, push, publicación o envío se ejecuta por efecto de este plan.

Cada entrega identifica las filas reales del ledger que pretende cerrar o modificar. Los únicos estados del ledger serán `cumplido`, `código completo`, `no verificado` y `ausente`. Una función que necesita prueba empírica permanece en `código completo` hasta aportar esa evidencia.

## 6. Las cinco compuertas obligatorias

| Compuerta | Evidencia requerida para cada entrega |
| --- | --- |
| Requisitos / ledger vivo | Filas afectadas y evidencia concreta por requisito, con archivo/línea comprobados o artefacto de prueba en tienda. |
| Estados degenerados | Recorrido de vacío, uno, muchos, muy largo y faltante en cada superficie modificada; cualquier estado no aplicable se justifica. |
| Consistencia entre archivos | Búsqueda de duplicaciones, valores y contratos relacionados. Precios mediante el formato de moneda de la tienda; sin formatos paralelos hardcodeados. |
| Superficie del comerciante | Labels en sentence case e inglés neutro, claves `t:`, `info` en dependencias externas y sin jerga interna. |
| Tienda real | Prueba sobre el build identificado en la tienda de desarrollo, con catálogo demo/hostil y móvil. Lo estático no prueba por sí solo comportamiento comercial. |

Cuando correspondan al alcance, las directivas incluirán las compuertas estáticas existentes, Theme Check, resolución de locales, sintaxis y verificaciones del código real. Los arneses sintéticos deben etiquetarse como tales. Este documento no ejecuta ninguna de esas pruebas.

## 7. Compuertas de envío separadas de los defectos

Antigravity coordina y conserva la evidencia; Claude revisa; Johandry decide el envío.

- **Build:** candidato inequívoco, hashes y paquete reconciliados con la versión probada. Decisión expresa sobre los tres arreglos del ZIP integrado frente al submission `09f8342`.
- **Demos por preset:** Sartorial, Imprint y Archive instalados y observados de forma individual. No atribuir una tienda a un preset solo por el nombre; en la muestra histórica no quedaron acreditados Imprint y Archive desplegados.
- **Rendimiento y accesibilidad:** Lighthouse en Home/PDP/PLP, móvil/escritorio y por preset con metodología reproducible; axe más revisión manual de teclado, foco y controles. Verificar los criterios oficiales vigentes al preparar el envío.
- **Listing y soporte:** capturas del build real, documentación accesible y veraz, canales cuya titularidad esté confirmada y claims sustentados.
- **Versión y notas:** versión coherente del paquete y `release-notes.md` conforme a los requisitos aplicables.

Ninguna medición garantiza aprobación de Shopify. Cero violaciones detectadas por axe no constituye una certificación WCAG. No se guardarán contraseñas, cookies, tokens ni datos sensibles en informes o arneses.

## 8. Orden recomendado

Preparación de identidad → Lote A → revisión de Claude → Lote B → revisión de Claude → Lote C → Lote D → compuertas de envío.

El contenido del Lote D puede prepararse mientras avanzan lecturas de otros lotes, pero las escrituras siguen siendo secuenciales. El Lote E requiere una decisión de alcance independiente y no bloquea la corrección de defectos demostrados.

Primer paso para cada destinatario al recibir este documento: revisar la distribución y señalar conflictos de versión, alcance o dependencias. Esperar la orden de Johandry y la directiva del lote antes de implementar.
