ID: GPT-HANDOFF-LOTE-0-RD-R0-001
Fecha: 2026-11-02 (America/Caracas)
Estado: BORRADOR DE REVISIÓN para Claude y coordinación de Antigravity. No es directiva emitida ni archivada, ni aceptación R-D o R-0.
Decisión requerida: Claude revisa prospectivamente el borrador de 0-05-P3 conforme a R-D; Antigravity coordina los insumos. Johandry decidirá la apertura de Lote A después de R-0 aceptado.
Resumen en 5 líneas:
1. 0-05-P3 propone sanear únicamente dos arneses gate5 sobre la base seleccionada; no se autoriza su edición con este documento.
2. La ficha de destino final debe identificar el candidato y concordar antes del uso real; puede estar pendiente al revisar prospectivamente este borrador.
3. 0-01 aún necesita identidad y reconstrucción demostrables, reconciliación BOARD y pruebas dirigidas; la comparación documental por sí sola no cierra la base.
4. R-0 incluye inventario y responsables de dependencias; un preview o app pendiente bloquea el cierre de la tarea A correspondiente, no necesariamente la aceptación de la base.
5. El criterio C-08 aprobado es retirar o sustituir por contenido neutro las promesas no respaldadas en la propia tienda, sin excepciones ni residuos ocultos.
Archivos tocados: este documento nuevo de `agent-comms/outbox-gpt/`.
Desviaciones (Nivel 1 o Nivel 2): Ninguna implementación ni cambio de contrato en este borrador.
Hallazgos extra fuera de alcance (con parche listo): Ninguno; no se preparó parche.
Verificación (comando, resultado y qué demuestra/qué no): Insumos y verificaciones previas atribuidos en §1; no se ejecutaron pruebas nuevas al crear este documento.
Lista de afirmaciones falsables numeradas:
1. Los dos archivos de implementación propuestos para 0-05-P3 son los únicos indicados en §2.2; este documento no los modifica.
2. La revisión R-D es prospectiva; Claude puede revisar el contrato antes de que exista evidencia final o ficha completa para uso real.
3. Los recursos de preview y app pueden constar como dependencias abiertas con dueño en R-0, sin presumir cerrado el trabajo A dependiente.
4. Este borrador no demuestra que R-D o R-0 estén aprobados, que el candidato esté desplegado, ni que herramientas o arneses estén acreditados.

# 1. Contexto, identidad y fuentes

Base seleccionada: `C:\Users\Johan\Documents\Drive\Tema Shopify\isolated-sartorial-lote0-09f`, HEAD detached `09f834295074402d9b93aa8ead83a732d78e6608`. La ficha y la comprobación independiente reportan cuatro modificaciones existentes:

| Ruta | SHA-256 físico documentado |
| --- | --- |
| `assets/base.css` | `5d9ed6b2981f115d9fca06406a47a6ff784e63023883ea1e88f49ec84429af43` |
| `assets/theme.js` | `db2f2a6efd27f45b4a0bf68a1368f2598adceedddd207784c26e6632eac56a9c` |
| `assets/product-zoom.js` | `4828d5a15471330e4d82f52bd16016c3ef1e71e2f53d275e9dc3cab28aa6c246` |
| `listings/sartorial/templates/index.json` | `9e50aea4a4896438b66191d7044e0eb1dae68083d5563c45b910ac3c3aac1768` |

El explorador independiente informó verificación de hashes del plan V4.1 y de AVANCE-002, BASE-002 y HERRAMIENTAS-001, así como de las cuatro modificaciones. `GPT-FICHA-LOTE-0-BASE-002.md` documenta su preflight, comparación de 93 archivos del ZIP fuente y manifiesto; `GPT-REPORT-LOTE-0-AVANCE-002.md` reúne evidencia delegada y límites. La creación de esta ficha no repitió pruebas ni los presenta como una aceptación técnica.

Plan rector `GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md`: 0-01 en líneas 160 y 166; 0-05/0-05-P3 en 170–171 y 175–177; R-0/R-D en 374–375; secuencia en 416; ficha y responsabilidades en 446 y 543. `GPT-INVENTARIO-LOTE-0-HERRAMIENTAS-001.md:62–68` y `GPT-REPORT-LOTE-0-AVANCE-002.md:103–106` distinguen existencia de herramientas de aptitud efectiva.

M2: la decisión original fue del 2026-10-31 y la confirmación humana de actualización local del 2026-11-02 se registró en `GPT-DECISION-LOTE-0-M2-003.md`; esto no demuestra autenticación ni estado de un proceso futuro. La decisión posterior `GPT-DECISION-LOTE-0-04-C08-001.md` resuelve el criterio de contenido C-08 sin excepciones y no autoriza su implementación.

# 2. Borrador R-D prospectivo — 0-05-P3

## 2.1 Encargo para revisión, no directiva

Se propone a Claude revisar prospectivamente la tarea 0-05-P3 antes de su eventual directiva: contrato, base y preflight vigentes, límites, archivos, pruebas, dependencia de la ficha y riesgos. Esfuerzo provisional del plan: **1–2 horas**, sujeto a revisión R-D; no incluye ejecución real ni medición en tienda. Ninguna fila del ledger se modifica o cierra por este borrador. La aprobación de R-D no se presume y este documento no activa edición ni constituye directiva del Cerebro o archivo de Antigravity.

## 2.2 Alcance y responsables propuestos

Únicos archivos de implementación propuestos:

1. `scripts/gate5-live-verify.mjs`.
2. `scripts/gate5-complete-verification.mjs`.

Tras R-D apto, directiva de alcance cerrado y precondiciones correspondientes, GPT delega la parte técnica a **Sol** en turno exclusivo de escritura; Antigravity coordina y facilita la ficha; Claude revisa de forma independiente. No añadir dependencias ni otros archivos de código sin aprobación del alcance correspondiente. Una directiva futura debe comprobar nuevamente HEAD, estado, cuatro hashes, preservación de cambios ajenos y cualquier desviación antes de editar. Las decisiones ya tomadas de base, M2 y copy no se reabren.

## 2.3 Insumos de Antigravity sin secretos

Ficha propuesta, con campos sin acreditar marcados **PENDIENTE**:

| Campo | Estado para este borrador | Criterio antes de uso real o configuración dependiente |
| --- | --- | --- |
| Origen HTTPS autorizado | PENDIENTE | Origen explícito y autorizado de la ficha del candidato. |
| ID de tema preview | PENDIENTE | ID acreditado para el candidato; no deducirlo de nombres o IDs históricos. |
| Rutas de colección y PDP | PENDIENTE | Destinos explícitos, aprobados y correspondientes al catálogo aplicable. |
| Identidad observada del tema | PENDIENTE | Evidencia real de identidad, independiente del nombre y de la configuración declarada. |
| Relación con el candidato | PENDIENTE | Explicar cómo se vincula la identidad observada con el árbol/build candidato. |
| Alcance de cada guion | PENDIENTE | Identificar las comprobaciones concretas que realmente ejecuta cada arnés y para qué se pretende usar. |

La ficha final es necesaria para el uso real y la configuración que dependa de esos campos; no se exige completarla antes de la revisión prospectiva R-D. La identidad configurada no sustituye comprobar la identidad real observada. No se incluyen contraseñas, cookies, tokens ni otros secretos.

## 2.4 Resultado técnico futuro propuesto

Para **ambos** arneses: origen, ID de preview y rutas de colección/PDP explícitos; validación de esquema, origen, ID, rutas y concordancia con la ficha del candidato antes de cualquier red; propagación de `preview_theme_id` en las navegaciones pertinentes. Retirar los fallbacks históricos de origen, ID, destino de producto y credencial, incluida la selección silenciosa de producto o URL; no sustituirlos por otros valores históricos implícitos. La credencial se suministra solo por entorno, sin valores en argumentos, logs, archivos o informes. La entrega futura incluye diff cerrado, comandos de comprobación, límites y trazabilidad al candidato; no atribuir Lighthouse a un arnés solo por su nombre.

## 2.5 Pruebas futuras offline que Claude debe revisar en R-D

Después del saneamiento y en el momento apropiado de revisión, no antes:

- Ejecutar `node --check` para ambos scripts, capturando errores de manera que no revelen valores sensibles.
- Demostrar en ambos el fallo con la variable requerida ausente **antes de cualquier red**.
- Demostrar fallo sin red para datos obligatorios ausentes o inválidos y definir cómo se comprueba la concordancia con la ficha del candidato.
- Comprobar la propagación del preview a navegaciones pertinentes con el método seguro que R-D determine, sin atribuir una prueba real de tienda a una verificación offline.
- Revisar el diff y los límites de las pruebas independientemente; la preparación de R-D debe especificar método y salidas esperadas sin ejecutar los arneses ahora.

No se ejecutaron esas pruebas al redactar esta ficha. Los arneses afectados no son aptos para nueva evidencia sin el saneamiento y la revisión requeridos. Un arnés alternativo identificado y acreditado para la comprobación concreta es válido; 0-05-P3 sigue P3, sin elevación de prioridad ni activación comercial adicional.

## 2.6 Estado de 0-05

El inventario identifica rutas, wrappers, lock y algunos metadatos; todavía faltan disponibilidad efectiva para cada revisor, dependencias operativas, compatibilidad, cobertura y build objetivo. Una versión en lock o la existencia de un archivo no acredita aptitud de ejecución. No se exige instalar dependencias para revisar prospectivamente R-D; una instalación local rutinaria posterior no requiere por sí sola una autorización comercial nueva. Sus consecuencias y alcance se revisarán conforme a la tarea concreta.

# 3. Checklist de 0-01 y R-0

La comparación documental por sí sola no cierra 0-01. `GPT-FICHA-LOTE-0-BASE-002.md:91–96` y `GPT-REPORT-LOTE-0-AVANCE-002.md:51–53,99` indican límites y trabajo pendiente. Los responsables siguientes son los del plan, no se reasignan por este borrador.

| Entrada / trabajo | Responsable | Evidencia disponible y faltante | Criterio de salida |
| --- | --- | --- | --- |
| Base e identidad | Antigravity prepara; Claude revisa R-0. | HEAD y cuatro hashes documentados en §1; falta ficha final de árbol/candidato y distinción trabajo/envío si corresponde. | Ficha con SHA/árbol, estado rastreado y no rastreado, origen de cambios y trazabilidad verificable. |
| ZIP, manifest y diff | Antigravity prepara; GPT apoya si integración no trivial; Claude revisa. | ZIP fuente identificado y 93 miembros comparados en BASE-002; contiene listings. No se ha demostrado regeneración del paquete de candidato. | Relación árbol–ZIP y diff, manifest, comandos de reconstrucción/empaquetado y resultado reproducible demostrados; no atribuir aptitud de envío solo al ZIP fuente. |
| Tres arreglos y copy/caption | Antigravity organiza; Claude revisa evidencia independiente. | Evidencia estática e histórica de portado y cinco valores; caption sin observación medida en navegador. | Pruebas dirigidas pertinentes de newsletter, foco y zoom; revisión del copy y observación de caption con identidad y límites registrados. |
| CMP-01 y linaje | Claude en R-0. | Igualdad canónica documentada para cuatro rutas; conteos acotados no prueban ausencia de literal específico. | Resolver SHA autorizado completo, comprobar descendencia y ejecutar conteo específico seguro requerido en las cuatro rutas sin imprimir secretos; documentar alcance y resultado. |
| BOARD | Antigravity, único escritor autorizado. | Hay comparación histórica en BASE-002; no está reconciliado formalmente. | Reconciliar conforme a V4.1:146,166,374 y dejar constancia; GPT no modifica BOARD. |
| Preview y app | Antigravity inventaría y asigna dueño; Claude revisa dependencia en R-0. | Hay metadatos parciales de temas y catálogo en AVANCE-002; identidad de candidato y planes utilizables no acreditados. | Ficha de inventario, responsable y dependencia abierta si aún falta; previews y app pendientes bloquean el cierre de las tareas A correspondientes, sin exigir su terminación universal antes de aceptar la base R-0. No presumir autorización de escritura. |
| Herramientas | GPT inventaría; Antigravity facilita entorno; Claude valida uso independiente. | HERRAMIENTAS-001 registra metadatos; aptitud efectiva y acceso por revisor pendientes. | Acreditar herramienta para la comprobación y build concretos antes de usarla como evidencia; documentar limitaciones y dependencias. |
| R-0 y apertura de A | Claude emite revisión R-0; Johandry decide apertura de Lote A. | Sin revisión formal R-0 ni autorización de apertura de A en este documento. | Claude acepta base o devuelve o escala con evidencia; tras aceptación, Johandry aprueba Lote A antes de iniciarlo. |

Una dependencia de preview o app abierta y con dueño no desaparece por registrarse: impide cerrar la tarea A que la necesita. No se solicita una autorización genérica de escritura por su mera existencia.

# 4. Contenido y lectura en curso

La futura preparación C-08 debe preservar la decisión de `GPT-DECISION-LOTE-0-04-C08-001.md`: conservar solo promesas con respaldo aplicable y verificable en la propia tienda y contenido neutro; retirar o sustituir las demás, sin excepciones y sin dejar promesas residuales en bloques ocultos, defaults, fallbacks, páginas asociadas, CTA o destinos engañosos. Ocultar un bloque realmente vacío no equivale a conservar una promesa oculta. No fabricar nuevas afirmaciones sin respaldo; no declarar falsedad solo por falta de evidencia. Los informes históricos se preservan aunque contengan promesas antiguas. Soporte al comerciante sigue aparte en C-04-P/G3.

A-02 no se ejecuta aquí; además de los requisitos de Lote A, exige autorización técnica previa y explícita de Antigravity para Nivel 2. R-0 es una revisión formal de Claude, no una deducción de GPT. Un agente separado está contrastando políticas y planes: **resultado PENDIENTE** para incorporar con atribución en un siguiente informe de avance; este documento no lo anticipa ni duplica.

No se realizaron pruebas nuevas, red, cambios de código o scripts, escritura en tiendas, staging, commit o push para elaborar este borrador.
