ID: GPT-PLAN-IMPLEMENTACION-SARTORIAL-001
Versión: 4
Estado: Planificación V4; implementación pendiente de aprobación explícita de Johandry a esta V4 y de las precondiciones y autorizaciones aplicables.
Decisión requerida: Johandry confirmó por chat el 2026-10-30 el retiro de las lecturas A-02 y el copy C-04-N `SARTORIAL` / `SARTORIAL / 02`. Esta decisión empresarial no es orden de implementación ni autorización técnica de Nivel 2. Se requiere su aprobación explícita a la V4, sus decisiones pendientes y, para A-02, autorización técnica previa y explícita de Gemini conforme a RULES §3.5 en su R-D futura. RC-07 conserva P1 condicionado según la fuente maestra citada.
Resumen en 5 líneas:
1. GPT será el implementador principal y delegará cada tarea a subagentes; Antigravity coordinará, integrará y atenderá tareas sencillas; Claude revisará de forma independiente.
2. El Lote 0 exige una base reproducible que ya contenga los tres arreglos de footer, foco de galería y liberación del gesto de zoom.
3. El plan adelanta previews y preparación de suscripciones, ejecuta B-02 y C-08/RC-07 como P1 condicionados en A y asigna trabajo concreto a los ocho P2 omitidos y los tres P3 añadidos.
4. Las entregas pasan por siete checkpoints, con mediciones independientes de Claude y nueva evidencia por preset y build final.
5. Esta V4 conserva V1–V3 y revisiones; integra las resoluciones M, K, CMP y TT-56 sin iniciar implementación ni autorizar commits, pushes, tiendas, compras de prueba o publicaciones.
Archivos tocados: agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.md (único archivo nuevo de esta entrega).
Desviaciones (Nivel 1 o Nivel 2): El reparto de funciones responde a la orden explícita más reciente de Johandry y prevalece para este encargo. Esta revisión documental no modifica AGENTS.md, RULES.md ni BOARD.md; Antigravity registrará la distribución antes de la implementación.
Hallazgos extra fuera de alcance (sin parche): No se prepara ni ejecuta parche de código; los hallazgos documentados se asignan a trabajo futuro acotado.
Verificación (comando, resultado y qué demuestra/qué no): Se leyó la V3 completa y la instrucción V4; se identificaron las revisiones y sus hashes según contraste delegado. El destino se creó mediante FileMode.CreateNew equivalente (`open` modo exclusivo `x`); los ajustes se hicieron solo en V4. No se ejecutaron pruebas del tema ni se verificó una tienda; la comprobación independiente de integridad se efectúa por separado.
Lista de afirmaciones falsables numeradas:
1. V1, V2 y las revisiones permanecen como fuentes separadas y no han sido sobrescritas por esta entrega.
2. Los diez cambios obligatorios de Claude001, los ajustes de GPT, las seis sugerencias opcionales, las correcciones de Claude002 y los tres P3 reciben una decisión explícita en las matrices de esta V4.
3. Cada trabajo planificado tiene responsable, dependencia, esfuerzo orientativo y criterio de aceptación; los ocho P2 omitidos no quedan como lista flotante.
4. El plan exige los tres arreglos en la base y su regresión en el candidato final, sin congelar para siempre hashes de assets históricos.
5. Ninguna fila del ledger queda cerrada por este documento y ninguna observación histórica se convierte aquí en una comprobación actual de tienda.

# Plan de implementación de mejoras de Sartorial — V4 documental

Fecha: 2026-10-30. Destinatarios: Johandry, GPT implementador, Antigravity y Claude revisor. ID estable: `GPT-PLAN-IMPLEMENTACION-SARTORIAL-001`.

## 1. Alcance, fuentes y límites

Este es el documento definitivo de planificación, completo y legible sin consultar V1 o V2. Organiza trabajo futuro sobre Sartorial, Imprint y Archive. Definitivo describe la consolidación documental de las decisiones aquí fijadas; no garantiza resultados futuros ni equivale a aprobación técnica de entregas aún inexistentes. La implementación comenzará únicamente tras la aprobación explícita de Johandry a esta V4, directivas de alcance cerrado y satisfacción de precondiciones y autorizaciones aplicables. Este documento no es una directiva de implementación ni una aceptación técnica.

Quedan fuera los hallazgos de Atelier/Contour y Cucuyo: no se trasladan sus defectos a Sartorial. Atelier sirve como referencia de producto; no se copiará su código ni el de Cucuyo. La vigencia de la instantánea de Cucuyo sigue sin confirmarse. No se asume que Archive carezca de PDP diferenciada: las propuestas del Lote E deben partir de las diferencias efectivamente observadas y de tareas del comerciante.

Fuentes conservadas:

| Fuente | Uso y límite |
| --- | --- |
| `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001.md`, 177 líneas, 18.806 bytes | Plan V1; antecedente conservado, sustituido documentalmente por V3 y esta V4. |
| `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v2.md`, 422 líneas mediante Get-Content, 66.762 bytes | Base íntegra de esta consolidación; V2 permanece conservada. Claude002 contó 423 líneas en su copia/renderizador; no es un cambio de contenido acreditado. |
| `C:\Users\Johan\.codex\attachments\9f6b713c-e2b8-4129-9dd7-caeedf94f10b\Texto pegado.txt`, 95 líneas, 7.065 bytes | Devolución GPT: prioridades, suscripciones, foco, demos, promesas, delegación y alcance E. |
| `agent-comms/outbox-claude/CLAUDE-REVIEW-PLAN-SARTORIAL-001.md`, 190 líneas, 25.971 bytes | Diez correcciones obligatorias C1–C10 y seis opcionales O1–O6 como localizadores principales; líneas 166–175 y 179–184 secundarias, sujetas al renderizador. |
| `agent-comms/outbox-claude/CLAUDE-REVIEW-PLAN-SARTORIAL-002.md`, 14.367 bytes | Segunda revisión: tres correcciones C002-1/2/3 y tres opcionales O1/O2/O3, resueltas en §11.4. Su propuesta de P2 para RC-07 se reemplaza expresamente por P1 condicionado según la maestra GPT y la decisión de esta V3. |
| `agent-comms/outbox-claude/CLAUDE-REVIEW-ANTIGRAVITY-AUDIT-001.md`, pasajes pertinentes | Fuente de los tres P3 añadidos por Johandry; evidencia saneada y localizadores en §11.5. No se reproducen valores sensibles ni se reaudita su contenido completo. |
| `agent-comms/outbox-gemini/GEMINI-AUDIT-MASTER-001.md`, pasajes pertinentes | Contraste de origen de los tres P3 junto a la revisión de Claude; se usa solo su evidencia acotada recibida del explorador, no como aprobación general del tema. |
| `GPT-AUDIT-THREE-THEMES-MASTER-001.md` y `GPT-AUDIT-THREE-THEMES-VISUAL-001.md`, en `agent-comms/outbox-gpt/` | Auditoría y anexo visual de origen, incluidas sus erratas; no se reauditan en esta entrega. |
| `CLAUDE-AUDIT-THREE-THEMES-MASTER-001.md` y `CLAUDE-AUDIT-THREE-THEMES-LIVE-001.md`, en `agent-comms/outbox-claude/` | Auditoría y anexo en vivo de origen; sus observaciones siguen fechadas, no son una nueva prueba de tienda. |
| `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v3.md` | Base completa de V4, conservada como antecedente. |
| `agent-comms/outbox-claude/CLAUDE-INSTRUCCIONES-GPT-PLAN-V4-001.md` | Instrucciones obligatorias de integración V4. |
| `agent-comms/outbox-claude/CLAUDE-REVIEW-PLAN-SARTORIAL-003.md` | Revisión de V3; M1–M5 y K1–K6 se aplican por instrucción posterior. |
| `agent-comms/outbox-claude/CLAUDE-REVIEW-ANTIGRAVITY-COMPARATIVA-001.md` | Clasificación y reverificación independiente; fuente de CMP-01, CMP-02 y TT-56. |
| `agent-comms/outbox-gemini/GEMINI-AUDIT-COMPARATIVA-001.md` | Identificación y trazabilidad únicamente: sin hallazgos nuevos de Sartorial; matriz 71/71 y veredicto «no apto» no son insumos del plan. |
| `AGENTS.md`, `agent-comms/BOARD.md` y `agent-comms/RULES.md` | Gobierno, estado comunicado y formato de entregas. BOARD conserva antecedentes que deben reconciliarse, no sustituye una medición actual. |
| Contrastes técnicos delegados recibidos el 29 y 30-oct | Acotan rutas, mecanismos, checkout, inventario A-02 y tres P3, citados en §3–§5 y §11. No equivalen a ejecutar los futuros arneses o abrir las tiendas. Las referencias del ZIP integrado y las del checkout de coordinación se distinguen expresamente. |

Los anexos y erratas prevalecen sobre formulaciones antiguas de las maestras cuando corrigen la evidencia. La consolidación no confirmó P0. Los P1 condicionados siguen condicionados a reproducir el mecanismo y evaluar su impacto en el build elegido; no se convierten en fallos comerciales probados.

Las siete definiciones de metafields pendientes no se crearán ni se utilizarán, aunque una definición o valor exista actualmente. Su lista histórica en F0/10A no acredita que coincidan con las claves que leen los snippets actuales. A-02 retira expresamente catorce fuentes automáticas (diez claves `custom.*` y cuatro aliases `sartorial.*`) y sus consumos/fallbacks, además de las heurísticas, sin nuevos lectores, bindings, namespaces o defaults sustitutos. Johandry autorizó por chat el 2026-10-30 este retiro y el copy C-04-N `SARTORIAL` / `SARTORIAL / 02`; el retiro no depende de esperar datos nuevos. Es un cambio de contrato de Nivel 2: RULES §3.5 exige autorización técnica previa y explícita de Gemini en la futura R-D de A-02. La decisión empresarial no sustituye esa autorización ni aprueba implementación. Se conservan settings manuales existentes: un valor no vacío requiere dato factual aprobado para todos los productos/contextos en los que aparece; vacío oculta fila y, sin contenido, bloque y encabezado. La existencia de un metafield no acredita aprobación. No se crean, rellenan, borran ni modifican definiciones o datos en Shopify por A-02.

### 1.1 Trazabilidad de fuentes

Hashes SHA-256 obtenidos con `Get-FileHash -Algorithm SHA256`, sin alterar las fuentes:

| Fuente | SHA-256 |
| --- | --- |
| V3 | `ff08f71d318ea7d07d0ecb9c75d7d184fde5ceb0e257b4ba9d120cd0ad85d7fc` |
| Instrucción V4 | `9ffd13879619abc9064336a726c09bcd25ffcb47a54211579f21a17fdfc4cbe6` |
| Claude revisión 003 | `23a1b990238f9301834fbb0159a5b26fde4f5f85e14019402c879d0959500345` |
| Claude revisión comparativa | `e7a9a4571a39b1af13b775ecaace7a53bba643e3db57cc1512e4121c761104dc` |
| Gemini auditoría comparativa | `7e2184f2d521e1514b10135c0eea34d9799ac3db59027c7b042a6cf15dbe25a0` |
| V1 | `d6942f9a5d5513a334e6a688bf3625da83c5a99330097e971be316995cedcb66` |
| Revisión GPT adjunta | `211be070fc2690717b7356a665e009743366e5ee9d8b03ab090239d0dd536d15` |
| Revisión Claude | `09ca73fe38d4fc992e75f05dcaec833b4f54485102200cf31f4c2339bb3e63e4` |
| V2 | `3f89faf18494aea3dea1cc06ef4ce2da4cccc2d5f162e24a8f83ab043176499b` |
| Revisión Claude002 | `027180c0857456869aef1ab0f27b1a8fff42a8ea7364256f0199284f7e9b9d4f` |
| Revisión Claude de auditoría Antigravity, 111 líneas | `edb36c723ab566b904fe4f47e1c887822e84254568df4b60e1027ec4704be1f9` |
| Maestra Gemini, 211 líneas | `7c4eeabac482f29bc2db8fb1006ba4f55dd644bb4531fff1a6dd69bcb914d48a` |

La identificación y hashes de V3 y fuentes nuevas se recibieron del contraste delegado; V2 fue verificada en la entrega histórica V3; la identificación de Claude002 y de los demás documentos históricos se recibió del contraste delegado y se conserva con ese alcance. Estos hashes identifican documentos, no el tema publicado. Las referencias de código siguientes son localizadores contrastados para esta revisión; cada directiva volverá a comprobarlas en su propia base con función/selector además del número de línea.

### 1.2 Orden ejecutivo y decisiones ya fijadas

La primera orden deberá preparar una base reproducible con los tres arreglos ya incorporados y resolver identidad, accesos, previews, fixtures y fuentes de contenido. A ejecutará suscripciones, retiro seguro de datos automáticos, foco, variantes sin JS y promesas RC-07; B atenderá navegación y carrito; C instalación, documentos y superficie del comerciante; D consolidará demos y contratos funcionales; R-G revisará el candidato final con G1–G4. E seguirá diferido salvo decisión expresa o evidencia de requisito obligatorio.

Por chat del 2026-10-30 Johandry autorizó el retiro A-02 y el copy C-04-N; la R-D de A-02 deberá obtener además la autorización técnica previa y explícita de Gemini, RULES §3.5. Esa decisión empresarial no ordena implementación. No quedan a decisión del implementador la prioridad de RC-07 (P1 condicionado, ID C-08 conservado en A), el retiro de las catorce fuentes de A-02, el copy completo `SARTORIAL` / `SARTORIAL / 02`, la conservación de los siete checkpoints o la prioridad P3 de los tres añadidos. Las decisiones abiertas de §9 son de build, datos factuales, contenido, accesos, permisos y alcance técnico concreto; no reabren automáticamente estas resoluciones.

## 2. Responsabilidades y disciplina de ejecución

| Participante | Responsabilidad |
| --- | --- |
| Johandry | Decide alcance, políticas, datos, contenido, activos, versión y candidato de envío. Autoriza explícitamente las escrituras en tiendas, apps/fixtures, compras o mutaciones de carrito de prueba, commits, pushes y publicaciones cuando correspondan. |
| GPT | Implementador principal y coordinador de sus subagentes. Delega cada tarea principal; identifica causa, acota archivos, integra las entregas y responde por informe, diff y verificación técnica. Atiende adaptaciones no triviales y cambios transversales. |
| Antigravity | Coordina tablero, directivas, identidad, turnos, dependencias, ramas/worktrees e integraciones. Ejecuta cambios sencillos y configuración con alcance cerrado. Coordina entornos, catálogo, previews y paquete con las autorizaciones correspondientes. |
| Claude | Revisor independiente de GPT y Antigravity. Abre el código y paquete del build identificado, ejecuta verificaciones y mediciones independientes, intenta falsar cada afirmación y emite aceptar/devolver/escalar. No acepta una entrega solo releyendo el informe del autor. |

La orden de Johandry ya decide estos roles. Su registro posterior en la gobernanza es una acción de coordinación de Antigravity; no exige volver a pedir a Johandry que los elija. Esta V4 no cambia físicamente los documentos de gobierno.

Cada asignación a subagente indicará modelo disponible, objetivo verificable, alcance, archivos de propiedad exclusiva, dependencias, criterios de entrega y límites. Para esta V4 el escritor asignado es GPT-6.1 Terra con esfuerzo ultra, conforme a la instrucción vigente de Johandry. En futuras asignaciones se respetará la instrucción de modelos vigente de Johandry y se indicará el modelo disponible en cada delegación. Si no está disponible, se comunicará la limitación sin simular su uso.

Reglas de concurrencia:

- Un solo agente escribe en el proyecto a la vez, incluidos los subagentes, aunque tengan archivos disjuntos. Antigravity registra responsable, lista cerrada y turno; GPT integra antes de devolver su turno.
- Los archivos disjuntos fijan propiedad y evitan pisar cambios; no autorizan escrituras simultáneas. La falta de puestos no omite tareas: se organizan tandas.
- Las lecturas, inventarios y revisiones realmente independientes pueden ejecutarse en paralelo. No se duplica una investigación salvo comprobación independiente asignada.
- La preparación de contenido y activos puede avanzar temprano. Las escrituras autorizadas en una tienda separada pueden programarse mientras se trabaja localmente, si no alteran el entorno que otra persona mide; no eluden el escritor único del proyecto. Se congelará cada entorno durante su prueba.
- Ningún autor acepta su propia entrega. No se revierte trabajo ajeno. Si el estado base cambia, se detiene el turno dependiente y se reconcilia.
- La corrección local equivalente se documenta como Nivel 1. Un cambio de contrato, settings, defaults, IDs, arquitectura o archivos fuera de lista requiere la autorización de Nivel 2 y de Johandry cuando afecte su autoridad.
- BOARD tiene un único escritor, Antigravity. La implementación futura no incluye commit, push, publicación o escritura de tienda por efecto de este plan.

## 3. Lote 0 — Base reproducible y dependencias tempranas

No se abre un lote de implementación sobre una base que carezca de cualquiera de los tres arreglos. El primer trabajo de integración que se autorice deberá consolidarlos si aún faltan; no se deja esa integración para el final.

### 3.1 Identidades disponibles y límites

El preflight histórico documentado en V2 devolvió lo siguiente; V4 lo conserva como antecedente, sin presentarlo como nueva verificación de HEAD:

    git status --short --branch
    ## sprint/F0
    [archivos de informes y arneses previos sin seguimiento; sin entradas de cambios rastreados]

    git rev-parse HEAD
    b45e913111e333b9a0e82938266189fc76c87057

El checkout de coordinación es `C:\Users\Johan\Documents\Drive\Tema Shopify`. No debe sustituirse silenciosamente por el worktree histórico de auditoría `Tema-Shopify-codex`, asociado en informes a `09f834295074402d9b93aa8ead83a732d78e6608` y no revalidado ahora. La referencia `fc849d5` de la revisión de Gemini corresponde a otro contexto; no prueba que ninguno de estos árboles sea el mismo.

Según la reverificación Claude comparativa, el checkout local `b45e913` en `sprint/F0` es anterior a la reescritura de historial del 2026-10-22 y no desciende de `origin/sprint/F0` (`c4dca23`) ni de `origin/master` (`09f8342`). Ver CMP-01 y las precondiciones 0-01/R-0. No se verifica ese linaje ahora.

El ZIP integrado revalidado en el contraste delegado tiene:

| Campo | Evidencia |
| --- | --- |
| Ruta relativa | `agent-comms/outbox-gpt/harness-GPT-PACKAGE-INTEGRATED-001-v4/isolated-theme/Sartorial-1.0.0.zip` |
| Tamaño / entradas | 347.818 bytes / 107 entradas (93 archivos y 14 directorios; no confundir archivos con entradas) |
| SHA-256 | `092242fba56513b7f491821f5fbd86c5933a8550c33ae541f0ffb5df801410e3` |
| Alcance | Identidad y contenido estático del paquete; no prueba cuál es la tienda actual ni su comportamiento. |

Johandry decide el build de trabajo y el de envío. Antes de cualquier commit, la base debe proceder del linaje reescrito o estar reconciliada con él y cumplir CMP-01/R-0. Puede partirse de un árbol que incorpore los arreglos o de una reconstrucción reproducible del ZIP aprobado, conservando su procedencia y cumpliendo esa condición de linaje. No se fija obligatoriamente el tip `09f8342` ni se mezclan assets de árboles distintos sin diff y manifest. Si se requiere commit para consolidar, Antigravity lo realizará únicamente con autorización explícita de Johandry; no se considera autorizado por aceptar este plan.

#### CMP-01 — Linaje y riesgo de repositorio (P1; fuera del ZIP)

Fuente: reverificación independiente de `GEM-G-001` en `CLAUDE-REVIEW-ANTIGRAVITY-COMPARATIVA-001.md` §2.2, no un hallazgo nuevo de la comparativa Gemini. Según esa revisión, `b45e913` difiere de su gemelo reescrito `c4dca23` solo en estos cuatro archivos: `scripts/gate5-live-verify.mjs:5`, `scripts/gate5-complete-verification.mjs:5`, `agent-comms/outbox-claude/CLAUDE-HANDOFF-SESSION-002.md` y `agent-comms/reviews/GEMINI-REVIEW-V1.1.0-PHASE2.md`. En `b45e913` los dos gate5 conservan un literal sensible; no se reproduce aquí. Las ocho refs locales `sprint/F0`, `master`, `sprint/7B`, `codex/argon-001-integrate-7b`, `backup/ee235e8-preservado`, `fix/argon-recently-viewed-edition`, `worktree-claude` y `worktree-codex` contienen el commit `44a8948` previo a la reescritura. No publicar refs anteriores a la reescritura. Quitar un literal de un archivo no sanea el historial local.

En 0-01, Johandry decide la base; Antigravity usa el linaje reescrito o una base reconciliada con él antes de cualquier commit y reconcilia BOARD local línea 16 con BOARD de `09f8342` §15.2. Johandry confirma la rotación D1 o la repite según §9. En R-0, Claude resuelve los identificadores completos `09f8342` y `c4dca23` en la base actual, comprueba con `git merge-base --is-ancestor` que la base desciende de uno de ellos, y comprueba ausencia del literal en los cuatro archivos por conteo, sin imprimirlo. Son comprobaciones futuras: no se editó historia ni se rotó nada en esta entrega.

#### CMP-02 — Sintaxis del arnés reescrito (P3)

La misma reverificación Claude de `GEM-G-001` documenta que, en `09f8342`, `c4dca23`, `f46ee38` y `35b952c`, la línea 5 de ambos `scripts/gate5-live-verify.mjs` y `scripts/gate5-complete-verification.mjs` contiene un marcador de redacción sin comillas y causa `SyntaxError` en `node --check`, en contradicción con el fail-closed declarado en D2. No se atribuye ese error a `b45e913`. En 0-05-P3 se corrigen ambos scripts en una sola edición futura de su respectiva línea sobre la base elegida por 0-01, tras la confirmación de Johandry sobre M2. Parametrizar origen, ID y rutas; contraseña solo por entorno, sin fallback anterior. En la base elegida Claude verifica `node --check` para ambos y que cada uno falla antes de red si falta `STOREFRONT_PASSWORD`, sin ejecutar contra tiendas. Se mantiene P3 y es dependencia solo del uso de esos arneses: otro acreditado es alternativa. No se ejecutan ahora comprobaciones ni se duplica la causa en otra tarea.

### 3.2 Tres arreglos obligatorios de la base

| Arreglo | Localizador contrastado | Prueba exigida antes de lotes y en el candidato final |
| --- | --- | --- |
| Placeholder de newsletter del footer | `assets/base.css:7035–7037`: regla de placeholder con `color: inherit` y `opacity: 1`. | Estilo computado y contraste en fondos reales del footer. Es el placeholder de newsletter; no confundir con `powered_by_link`. |
| Conservación de foco de galería | `ProductGallery` en `assets/theme.js`: `syncCarouselMode`, líneas 444–484, y `applySlide`, 508–521. | Cambio de modo responsive y de diapositiva con foco en paginador/paso; conservar o restaurar foco al control lógico, sin perderlo en body. |
| Liberación de pinch | `assets/product-zoom.js:249–269`, liberación de puntero del gesto. | Soltar uno de dos dedos, continuar con uno y cerrar/reabrir; no quedar atrapado en el estado de pellizco ni bloquear desplazamiento/gestos posteriores. |

Si solo falta una integración pequeña y equivalente, Antigravity coordina y la ejecuta en su turno. Cualquier adaptación no trivial la delega GPT. Claude comprueba su presencia funcional en R-0, y repite la regresión en R-G sobre el build final. Los hashes viejos acreditan procedencia: después de cambios autorizados se generan hashes nuevos; no se exige que los assets finales conserven el hash histórico.

### 3.3 Tareas de preparación

| ID / estado de planificación | Dueño | Trabajo / dependencia | Esfuerzo orientativo | Salida y aceptación |
| --- | --- | --- | --- | --- |
| 0-01 / planificado, bloquea A | Antigravity; GPT si integración no trivial; Claude revisa | Reconciliar checkout, BOARD, directivas y trabajos abiertos; elegir con Johandry base; consolidar los tres arreglos; fijar SHA completo, árbol, manifest/hashes, diff y paquete reproducibles. | 0,5–1 d de identidad y reconciliación; adaptación no trivial se reestima tras inspección. | Ficha única con rama/HEAD, estado rastreado y no rastreado, origen de cada cambio, comandos de reconstrucción, hashes, diff y relación árbol–ZIP. R-0 acepta o bloquea. No se presupone que el ZIP sea regenerable hasta demostrarlo. CMP-01: elección de Johandry, linaje reescrito o base reconciliada antes de cualquier commit, prohibición de publicar refs anteriores y reconciliación BOARD local:16 con `09f8342` §15.2; R-0 comprueba ancestro y conteos de los cuatro archivos. Dependencia: confirmación de M2. |
| 0-02 / planificado, bloquea R-A, G1 y G2 por preset | Antigravity | Inventariar primero los previews existentes y acreditar o preparar previews reales de Imprint y Archive. Cualquier creación, carga o cambio en tienda requiere autorización explícita. | 0,5–1 d de preparación técnica si hay acceso; espera de autorización/acceso externa sin fecha inventada. | Ficha por tienda/preset con URL sin credenciales, ID de tema, nombre visible, configuración/plantillas y relación con el build. Fondos y controles reales disponibles para A-03 y evaluación empírica de TT-06/TT-17. No asumir ausencia actual porque un informe antiguo no los acreditara. |
| 0-03 / planificado, bloquea cierre A-01 | Antigravity prepara; GPT define matriz; Johandry autoriza app/fixtures | Inventariar estado actual del catálogo y app de suscripción. Preparar compra única, plan opcional y plan obligatorio solo tras autorización. | Inventario y configuración estimados dentro del 0,5 d de entorno de A-01; no sumarlos dos veces. App, acceso y aprobación son dependencias externas. | Producto con grupos de planes y variante `requires_selling_plan` realmente acreditados, además de producto de compra única/opcional. Los informes históricos no prueban inexistencia actual. Sin app/fixtures adecuados, el cierre en tienda queda bloqueado, aunque se pueda hacer prueba sintética etiquetada. |
| 0-04 / planificado, preparación previa a directivas afectadas | Johandry decide datos/contenido; Antigravity obtiene y registra; GPT acota impacto | Registrar decisión de Johandry por chat 2026-10-30 sobre A-02 y C-04-N; solicitar su decisión sobre conservar «Haute Couture» en `listings/sartorial/templates/index.json:19,53,70,107` como copy demo, denominación protegida en Francia; preparar respaldo factual de settings manuales; preparar inventario RC-07/C-08 para A, versión, nomenclatura y contenido/activos. No vuelve a preguntar si conservar inactivas las lecturas retiradas. | 0,25–0,5 d de preparación de otras decisiones; el inventario RC-07 se carga una sola vez a C-08 (0,5–1 d), sin duplicación en 0-04. Aprobación/producción externas por confirmar. | Fuentes aprobadas por producto/contexto, tratamiento de ausencias y destinos; A-02 puede retirar lectores sin esperar datos. Si falta respaldo para contenido no vacío, ocultarlo/vaciarlo conforme a A-02. No convertir ausencia en promesa. |
| 0-05 / planificado | GPT inventaría; Antigravity facilita entornos; Claude valida uso independiente | Inventariar acceso, runtimes y arneses antes de prometer reutilización: `tt02.js`, `g20_g23.js`, `s2`, `p3`, `s8`, Lighthouse y axe. | 0,25–0,5 d; se reestima si hay que reconstruir una herramienta autorizada. | Ruta real, versión, dependencias, build objetivo, límites y disponibilidad por revisor. No presumir VM, `$HOME/livetest`, sesiones ni artefactos. Un arnés ausente se sustituye solo con alcance/tiempo explícitos. |
| 0-05-P3 / GEM-H-002 y GEM-G-001 / P3, saneamiento de arneses / planificado | GPT delega parte técnica a Sol; Antigravity proporciona ficha/configuración del build; Claude revisa independientemente | `scripts/gate5-live-verify.mjs:3–5` y `scripts/gate5-complete-verification.mjs:3–5`: una causa raíz, BASE_URL fija, THEME_ID antiguo `166186909939` y fallback literal de credencial. Ambos ya leen `process.env.STOREFRONT_PASSWORD`; eliminar fallbacks literales y conservar únicamente el entorno y exigir la variable en ambos scripts. | 1–2 h de parametrización provisional, reestimable en R-D; ejecución real y medición se estiman aparte, sin duplicar 0-05. | Parametrizar origen, ID preview y rutas/URLs aprobadas de colección/PDP; validar esquema/origen/rutas/ID y concordancia con candidato antes de red. Sin fallback histórico de origen/ID/producto; propagar `preview_theme_id` a navegaciones pertinentes. Contraseña solo `STOREFRONT_PASSWORD`, sin valores en código, argumentos, archivos, informes ni logs. Para reutilizar cualquiera como evidencia nueva de comprobaciones que realmente realiza (compuerta 5/R-G u otras aplicables), saneamiento y revisión previos son precondición de uso; conserva P3 y admite otro arnés identificado/válido. CMP-02: una sola edición futura de ambos scripts sobre la base 0-01 y tras confirmación M2; `node --check` de ambos y prueba en ambos scripts de ausencia de `STOREFRONT_PASSWORD` con fallo antes de red, sin ejecutar contra tiendas. Retirar el literal del archivo no sanea la historia local. |

Los nombres e IDs de preview históricos sugeridos por Claude —189832593651 main, 189707452659 submission, 188743188704 y 188655599784— son pistas para inventario, no identidades actuales confirmadas. Un nombre de LINEA NOVE que incluya `09f8342` no acredita el SHA desplegado. No se retiran contraseñas ni se cambian publicaciones para probar.

En 0-05-P3, el origen configurado es `BASE_URL` y el tema preview se selecciona con `THEME_ID`/`preview_theme_id`; ambos serán explícitos y concordantes con la ficha del candidato. El script principal conserva rutas de colección en línea 59, PDP en 104 y selección del primer producto con fallback fijo en 101; el hermano conserva rutas fijas en 52 y 86. La parametrización incluye esos destinos, no solo las primeras tres constantes. El inventario identificará cuál o cuáles se reutilizarán y no declarará limpio otro arnés sin revisarlo. Falla antes de red si faltan datos obligatorios o no concuerdan. Esta entrega describe la corrección futura y no ejecuta los scripts ni reproduce el literal sensible.

La configuración validada y la propagación de preview son condiciones necesarias, pero no sustituyen comprobar la identidad real observada del tema/candidato. El nombre gate5 no acredita que el script genere Lighthouse ni cualquier otra medición: solo se reutilizará para las comprobaciones concretas que el inventario demuestre que realiza. G2 mantiene su ejecución independiente específica de Lighthouse, axe y teclado y sus herramientas acreditadas.

## 4. Lotes y criterios de aceptación

Los esfuerzos son jornadas de una persona, salvo minutos/horas indicados, orientativos y revisables tras R-D. No representan un calendario comprometido. Cada directiva fijará lista cerrada de archivos y filas reales del ledger, sin inventar números de fila. Se separan tiempo técnico, pruebas, configuración y esperas externas. Los trabajos añadidos en V2/V3 no se absorben gratuitamente en estimaciones antiguas.

Los estados de esta planificación son `planificado`, `condicionado`, `bloqueado por dependencia` o `diferido con motivo`; no son estados del ledger. El ledger solo admite `cumplido`, `código completo`, `no verificado` y `ausente`. Ninguna fila cambia hoy.

### 4.1 Lote A — Compra, datos y foco

Depende de 0-01 y R-0 aceptados y R-D por directiva. A-02 tiene retiro seguro ya decidido; solo el contenido manual no vacío requiere respaldo previo. C-08 prepara inventario en 0-04 y se ejecuta en A. Los previews de 0-02 y el entorno de 0-03 deben estar listos antes de R-A. GPT delega las tareas técnicas; Claude revisa; Antigravity coordina.

| ID / hallazgos / prioridad / estado | Dueño y superficies candidatas | Dependencia / esfuerzo | Criterio de aceptación |
| --- | --- | --- | --- |
| A-01 / RC-02, TT-100 / P1 condicionado / planificado | GPT. `sections/main-product.liquid`, `sections/featured-product.liquid` y `assets/theme.js`. | Base y entorno 0-03 autorizados. Código pequeño: reestimar en R-D en lugar de mantener 1–2 d indiferenciados; más 0,5 d configuración y 0,5 d pruebas de app autorizada. | Ambas superficies, JS/no-JS, transiciones y payload completo según matriz A-01 siguiente. Controles exitosos sin valores residuales o contradictorios. El caso C confirmado en fixture es evidencia acotada, no fallo actual de tienda. |
| A-02 / RC-03, TT-03, S-03 y raíz de V-05 / P1 / planificado, cambio de contrato Nivel 2 y retiro autorizado por Johandry el 2026-10-30 | GPT. `snippets/product-technical-specs.liquid`, `snippets/product-provenance.liquid`; configuración Archive y bloques manuales solo según lista cerrada R-D. | R-D declara Nivel 2 y requiere autorización técnica previa y explícita de Gemini según RULES §3.5; la decisión empresarial de Johandry por chat 2026-10-30 no sustituye esa autorización ni la aprobación V4. Retiro no depende de esperar datos ni nueva decisión de conservar/inactivar lectores; ~1 d para alcance descrito, reestimable en R-D. Contenido manual no vacío exige respaldo previo para todos sus productos/contextos. | Retirar lecturas, consumos y fallbacks de las catorce fuentes enumeradas, además de heurísticas de título/handle/`product.type`; ningún lector/binding/default sustituto. Settings manuales existentes con dato factual aprobado o vacíos; ocultación de fila y del bloque/heading sin contenido. No modificar datos/definiciones Shopify ni crear/usar las siete pendientes. |
| A-03 / RC-04, TT-02 / Imprint P1 condicionado, Archive P2 / planificado juntos | GPT. `assets/base.css`; el disparador es `motion_style`, no un cambio de schemas. | Previews reales 0-02 antes de cierre; 0,5–1 d. | Matriz de foco por estilo/control/estado/fondo/esquema y preferencia de movimiento, según detalle siguiente. Sartorial conserva funcionamiento; Imprint y Archive mantienen prioridades distintas aunque se ejecuten juntos. |
| B-02 / RC-01, TT-101, S-01 / P1 condicionado / planificado en A | GPT. Formularios de PDP y featured product; `assets/theme.js` si procede tras preflight. | Misma base y turno coordinado con A-01; 0,5–1 d. | JS desactivado o fallido: cargar variante A, elegir B y comprobar que el payload envía ID de B; también URL de variante, disponibles y agotadas en ambas superficies. No mostrar B y enviar A. Línea real de carrito únicamente con autorización. R-B repetirá regresión, sin duplicar la tarea. |
| C-08 / RC-07 (TT-63) / P1 condicionado / planificado en A | GPT inventaría código/configuración y delega tratamiento; Antigravity recopila políticas/contenido; Johandry acredita datos y decisiones comerciales. | Preparación en 0-04, respaldos/ausencias/destinos antes de cambios de copy; 0,5–1 d inventario/reconciliación, remedio reestimable en R-D. Se contabiliza aquí una vez. | Inventario de cada promesa de devoluciones, fabricación y servicio: código/config/contenido, fuente y respaldo, contexto, valor ausente/vacío y destino instalado. Sin respaldo no se inventan promesas. Defaults y fallbacks no prueban que las políticas actuales sean falsas. R-A verifica tratamiento; R-C, G3 y R-G regresan instalación/contenido. Conserva ID C-08, no pertenece a los ocho P2. |

#### A-01 — Matriz mínima de suscripciones

En PDP y producto destacado se cubrirán compra única, plan opcional y plan obligatorio; carga con y sin `?selling_plan=`; cambios de variante; y recorridos con JS y sin JS. En cada transición se inspeccionará `new FormData(form).getAll('selling_plan')` completo, no solo el primer valor ni la apariencia del selector.

| Condición | Resultado exigido |
| --- | --- |
| Compra única válida en producto/variante que la admite | Cero valores serializados de `selling_plan`, sin plan residual. |
| Plan A → plan B → compra única válida | Un único plan válido para la elección A; luego un único B válido; al volver a compra única, cero valores. Repetir al cambiar variante y en ambas superficies. |
| Caso C: entrada por URL con plan previo y posterior compra única válida | La elección actual vence al plan previo de URL; payload sin `selling_plan`. No basta ocultar el control no-JS si sigue siendo exitoso. |
| Producto/variante `requires_selling_plan` sin plan válido | Envío bloqueado con mensaje coherente. No exigir ni forzar una compra única inválida; esta restricción corrige la formulación demasiado amplia de la revisión Claude. |
| Plan seleccionado y cambio a variante distinta | Un único plan que corresponda a la variante actual o bloqueo/selección explícita válidos; nunca un plan obsoleto de otra variante. |
| Sin JS | El formulario nativo representa exactamente la selección y evita controles duplicados exitosos; documentar sus límites reales. |

La evidencia incluirá HTML/control exitoso, lista completa de FormData y, cuando se autorice, payload de red y línea resultante del carrito con variante, plan y cantidad. La interpretación de Shopify no se deduce solo del código. La creación/modificación de fixtures y toda mutación real de carrito requieren la autorización correspondiente; sin ella no se declara verificado en tienda.

#### A-02 — Retiro cerrado de catorce fuentes y conservación manual segura

La decisión operativa es retirar del código las siguientes fuentes automáticas de los dos snippets, incluidos sus consumos y fallbacks; no conservarlas inactivas esperando valores. Acceder mediante `.value` o al objeto de una misma clave cuenta como una fuente, no como dos. El inventario contrastado en el ZIP integrado es:

| Snippet / localizador | Claves a retirar | Número de fuentes |
| --- | --- | --- |
| `snippets/product-technical-specs.liquid:20` | `custom.material`, `sartorial.material` | 2 |
| `snippets/product-technical-specs.liquid:21` | `custom.gsm`, `sartorial.gsm` | 2 |
| `snippets/product-technical-specs.liquid:22` | `custom.hardware`, `sartorial.hardware` | 2 |
| `snippets/product-technical-specs.liquid:23` | `custom.origin`, `sartorial.origin` | 2 |
| `snippets/product-technical-specs.liquid:26–38` | `custom.technical_specs` y su consumo | 1 |
| `snippets/product-provenance.liquid:27` | `custom.provenance_date`, `custom.era`, `custom.circa_year` | 3 |
| `snippets/product-provenance.liquid:42` | `custom.condition_grade` | 1 |
| `snippets/product-provenance.liquid:49` | `custom.provenance_notes` | 1 |

Son diez claves `custom.*` y cuatro aliases `sartorial.*`, catorce en total. Se retiran además las heurísticas de título, handle y `product.type` en estos dos snippets. La rama de `product.type` antes localizada en `product-technical-specs.liquid:55–56` no queda fuera por ser un fallback. No se añade otro namespace, lector, binding dinámico, default o texto neutro sustituto. A-02 no crea, rellena, borra ni modifica definiciones ni datos de Shopify.

Este inventario no identifica las siete definiciones pendientes del plan histórico: las fuentes comparativas no proporcionan una lista acreditada que permita igualarlas. La lista histórica de siete en F0/10A tampoco prueba esa identidad. Su prohibición general se mantiene separada, aunque una definición o dato exista hoy.

Se conservan los settings manuales existentes solo cuando su contenido factual esté aprobado para todos los productos y contextos donde aparece. Al compartirse por plantilla, un valor no acredita automáticamente cada producto. Valor vacío oculta su fila; sin contenido se ocultan bloque y encabezado (`product-technical-specs.liquid:88–120`, `product-provenance.liquid:52–78`). Una ayuda vacía del editor puede mantenerse. No se conserva un claim sin respaldo ni se rellena con una frase genérica inventada.

El contraste ya encontró los cuatro settings técnicos sin `default` en schema (`sections/main-product.liquid:1121–1124`, `sections/featured-product.liquid:773–776`), y los valores de Imprint vacíos en PDP `listings/imprint/templates/product.json:75–78` y home `listings/imprint/templates/index.json:114–117`. No se presenta su vaciado como trabajo aún pendiente sin comprobar la base. Archive PDP empaqueta `circa_year: ''`, `show_unique_piece: false`, `condition_grade: not_assessed` y `provenance_notes: ''` (`listings/archive/templates/product.json:75–78`); home usa esas mismas claves en `listings/archive/templates/index.json:108–111`. Archive home conserva en `:111` el claim `Curated period selection with documented archival provenance`: la directiva A-02 dejará `provenance_notes` vacío si no existe respaldo aprobado; no inventará texto neutro. Los localizadores son de la referencia integrada y se revalidan antes de editar.

Ambas superficies consumen los snippets: `sections/main-product.liquid:700/703` y `sections/featured-product.liquid:451/456`. Se prueban PDP y featured, settings manuales completos/parciales/vacíos, nombres ambiguos y datos faltantes. El badge por `unique_piece`/inventario de `product-provenance.liquid:20–24` no es un lector de metafields y queda fuera del retiro; se preserva el setting empaquetado `show_unique_piece: false`, distinto de la lógica interna del badge `unique_piece`. Los lectores `custom.complementary_products` de `snippets/cart-drawer-recommendations.liquid:80` y los nativos related/complementary de `sections/product-recommendations.liquid:6–12,68–71` quedan fuera de A-02. No se ejecuta un reemplazo global de `custom.*`.

`leather-desk-mat`, `folded-valet-tray` y `milled-brass-paperweight` son candidatos históricos a revalidar en el entorno elegido, no productos actuales garantizados. No deben mostrar el tipo como material, “Solid milled brass” o una época sin respaldo factual aprobado. El retiro seguro se puede implementar sin esperar datos nuevos; mantener o añadir contenido manual no vacío requiere ese respaldo. A-02 y D-01-V resuelven partes de una misma raíz V-05, sin contabilizar dos defectos.

Al retirar la heurística de título de `product-provenance.liquid:30–38`, el `circa_year` manual del bloque pasa a aplicarse a todos los productos de la plantilla; exige respaldo aprobado para cada contexto o permanecer vacío. Al retirar `is_non_textile` de `product-technical-specs.liquid:46–49`, `gsm` manual también puede mostrarse en objetos; exige aprobación para esos contextos, nunca se inventa. R-A prueba expresamente ambos efectos con un producto textil y otro no textil, además de vacíos y ocultación.

#### A-03 — Causa y matriz de foco

El atributo `data-motion-style` se emite en `layout/theme.liquid:3`. Los presets informados usan Sartorial `atelier`, Imprint `technical` y Archive `heritage` en `config/settings_data.json:157,234,311`. La regla base `:focus-visible` de `assets/base.css:283–285` usa foreground. Dentro del bloque `prefers-reduced-motion: no-preference` que comienza en la línea 9058, technical fija `#2b2b2b` (9102–9107) y heritage `#b5885c` (9126–9131). Esa es la familia causal que se corrige, con una solución CSS propia basada en los tokens efectivos o un anillo verificable; no se cambia schema para resolverla.

La prueba conserva una fila por preset/`motion_style`, control y estado, esquema efectivo, fondo sólido o imagen efectiva, `reduce`/`no-preference`, método, criterio aplicable, medida y captura. Recorre teclado y controles de header, contenido y footer; incluye expresamente footer `scheme-2`. No atribuir al header el esquema de announcement bar. Se usa `tt02.js` solo si 0-05 acredita el arnés y siempre como evidencia sintética previa; cierre con controles reales y medición independiente de Claude en previews acreditados. Un cálculo de contraste o cero avisos de axe no son certificación integral de accesibilidad.

### 4.2 Lote B — Navegación y resiliencia de compra

Depende de R-A aceptado y directivas R-D. B-02 se ejecutó en A por su P1 condicionado; aquí solo se regresa.

| ID / hallazgos / prioridad / estado | Dueño / archivos candidatos | Dependencia / esfuerzo | Criterio de aceptación |
| --- | --- | --- | --- |
| B-01 / RC-10, TT-104, G-20 / P2 / planificado | GPT. `ThemeDrawer` en `assets/theme.js` y responsive de `assets/base.css`. | A estabilizado; 0,5–1 d. | Abrir a 390 px, cruzar a 1280 px y volver; orientación; restaurar scroll, `inert`, foco y estados sin depender de Escape. Usar una fuente coherente del breakpoint, preferiblemente contrato data/CSS existente verificado, sin duplicar 62rem a ciegas. Probar `g20_g23.js` si está disponible y resize real. |
| B-03 / RC-12, TT-102, S-07 / P2 / planificado | GPT. Comercio/reconciliación en `assets/theme.js` y locales realmente afectados. | Inventario de flujo existente; 1–2 d. | POST aceptado con respuesta perdida: reconciliar carrito antes de invitar a reintentar, conservar cantidades y no duplicar adición. Arnés de red etiquetado sintético, más prueba autorizada del flujo real. El riesgo es duplicar artículos, no un doble cobro demostrado. |
| B-04 / RC-11, TT-103, S-06 / P2 / planificado | GPT; Antigravity puede ejecutar si R-D confirma parche local equivalente. `sections/cart-drawer.liquid:366–368`; `CartDrawer`/`handleDrawerClick` en `assets/theme.js:2384–2436`; patrón `handleCrossSellView:2973–2984` y helper `saveNoteAndNavigate:2990–3031`. | Lógica de notas/mutaciones inventariada; ~0,25 d de conexión local del helper más regresión según alcance. Si requiere rediseñar carreras, devolver a R-D y reestimar. | Conectar View cart a `saveNoteAndNavigate`, que ya utiliza venta cruzada, preservando contrato detallado siguiente. Checkout ordinario conserva form POST nativo con `name=note` y `name=checkout`, JS/no-JS; no se intercepta ni se atribuye al helper. Probar sucia/limpia/oculta, pendiente, errores, edición en vuelo y mutaciones; sin refactor general del carrito ni promesa de resolver todas las carreras. |
| B-05 / LV-01 / P2 / planificado | Antigravity si es local; GPT si aparece alcance transversal. `snippets/localization-selectors.liquid` y claves locales permitidas. | R-D de alcance cerrado; 0,25–0,5 d. | Nombre accesible que incluya el texto visible “ES”; comprobar header a 1280 y footer a 390, teclado y axe `label-content-name-mismatch` ejecutado por Claude. |

#### B-04 — Contrato de nota y navegación

El enlace View cart está en `sections/cart-drawer.liquid:366–368`. `handleDocumentClick` (`assets/theme.js:2357–2371`) excluye mediante `this.contains(link)` (2363) los enlaces del drawer: la conexión se hace en `handleDrawerClick:2384–2436`, comprobando su rama de venta cruzada (2408–2415), y reutiliza el patrón de `handleCrossSellView:2973–2984` y `saveNoteAndNavigate:2990–3031`. El rango 2438–2457 corresponde a `handleDrawerChange` (opciones/cantidad), no a guardado. El comentario de `handleCrossSellView` está en `assets/theme.js:2971–2972`. Los nombres de función acompañan los localizadores para revalidarlos en R-D.

El helper actual identifica borrador sucio con `textarea[data-dirty=true]`. Para un clic primario normal, sin modificadores, `_blank`, `download` ni `defaultPrevented`, solo intercepta si hay nota sucia o navegación de nota pendiente. Sin ambas condiciones deja navegar de forma nativa. Si ya está pendiente no lanza un segundo POST; el primer destino conserva precedencia frente a doble clic u otro enlace. Clics modificados conservan comportamiento nativo sin promesa de guardar la nota.

`saveNoteAndNavigate` captura texto y `noteVersion`, hace POST JSON `{note}` a la URL ya existente, usa `keepalive` y el plazo existente de 3.000 ms. Solo navega tras respuesta válida, eco exactamente igual y versión sin cambio. Limpia dirty únicamente si el texto actual sigue idéntico. Error HTTP/JSON/eco/red, timeout o edición posterior mantienen la página y el borrador, presentan el mensaje existente y llaman a `syncCart`; no se añade retry automático de POST. El input marca dirty y aumenta versión, sin autosave. `renderSection:3404–3408` conserva borrador cuando ambas textareas existen; esa guarda no acredita todos los casos de ausencia. El helper no usa `beginMutation`/`endMutation`: no se afirma que resuelva todas las carreras con mutaciones del carrito.

Checkout ordinario envía la nota de forma nativa en el mismo form POST a `routes.cart_url`: drawer `sections/cart-drawer.liquid:146–370`, textarea `name=note` en 318, submit `name=checkout` en 351; carrito completo `sections/main-cart-items.liquid:28–233`, nota 183 y checkout 216. No se le conecta el helper ni se intercepta su envío como parte de B-04. Probar con y sin JS y con setting de nota visible/oculto según contrato existente; los checkouts acelerados no se certifican por estas pruebas.

R-B comprobará nota limpia, sucia y setting oculto; doble clic y otro destino mientras pending (se conserva el primero); edición en vuelo; respuesta inválida y fallos HTTP/JSON/eco/red/timeout; cantidad, eliminar, add y reconciliación concurrentes. Incluir eliminación del último artículo y textarea ausente. Si garantizar esos resultados exige más que conectar el helper, se devuelve el diseño a R-D y se reestima el alcance antes de escribir; ~0,25 d no presupone un refactor de carrito. R-B incluye además regresión sin JS de B-02 en PDP y featured, payload y stock; línea de carrito solo si se autorizó esa mutación.

### 4.3 Lote C — Colecciones, instalación, documentación y superficie del comerciante

Depende de compra/navegación estabilizadas. Las investigaciones de solo lectura pueden adelantarse, manteniendo directivas y turnos. C-08 conserva su ID, pero su única ejecución/fila está en A por P1 condicionado; aquí se regresa su efecto en instalación, copy y destinos.

| ID / hallazgos / prioridad / estado | Dueño / alcance | Dependencia / esfuerzo | Criterio de aceptación |
| --- | --- | --- | --- |
| C-01 / V-02 / P2 / planificado | GPT. Jerarquía de sección y controles de colección móvil; rutas cerradas en R-D. | Baseline de viewport útil; 1–2 d. | Aplicar/limpiar filtros, teclado y vacío como regresión del cambio de jerarquía; comparar posición de primera tarjeta con el mismo viewport útil, sin atribuir conversión no medida. TT-26 pertenece a Atelier/Contour y queda fuera del alcance Sartorial; no se introduce un defecto AJAX de Sartorial sin evidencia propia. |
| C-02 / TT-13, D-01 de auditoría GPT / P2 / planificado | Antigravity coordina configuración e instalación; GPT corrige código/packaging no trivial. `templates/` y `listings/*/templates/` según lista cerrada. | Decidir resultado canónico por preset; 1–2 d más instalación y comprobación. | Subir el ZIP a una tienda de desarrollo limpia autorizada; comprobar qué instala Shopify antes de existir una instalación desde Theme Store. Comparar raíz/listing por Sartorial, Imprint y Archive y documentar diferencias deseadas sin trasladar contenido de vendedor indebido. |
| C-03 / TT-12, G-40 / P2 condicionado / condicionado | GPT. Perfilado y, solo si se activa, carga/partición de CSS/JS según diagnóstico. | G2 por preset o remedición del build final falla el umbral acordado y vigente; diagnóstico causal; 2–4 d solo para intervención activada, reestimables por alcance. | Comparación reproducible antes/después, regresión por superficie/preset y sin tocar módulos aprobados ajenos. Si G2 cumple, diferir documentadamente a después del envío. No se atribuye carga de `theme.js` a gift-card: esa atribución fue corregida. |
| C-04 / TT-05, TT-18 y documentación pública / P1 condicionado de soporte o P2 según raíz / planificado | Antigravity, con apoyo GPT si se requiere código/packaging; Claude revisa. Docs internas y web/soporte que Johandry autorice. | Titularidad, URLs, instrucciones y claims aprobados; 1–2 d internos; web pública y soporte externo por estimar. | Canales reales, documentación accesible/veraz, claims sustentados y destinos correctos. No asumir control de buzón/dominio ni enviar mensajes de prueba sin autorización. |
| C-04-P3 / GEM-G-004 / documentación interna / P3 / planificado | Antigravity, tarea documental en turno exclusivo; Claude revisa. `docs/requirements-ledger.md:37`. | Artefacto histórico `docs/gate5-reports/gate5-empirical-report.md` y contexto contrastados; 15–30 min provisional, aparte de web/soporte. | Reexpresar “Medición certificada en tienda real” como “Medición registrada…” con metodología y limitaciones. Añadir fecha/tema/versión solo si el artefacto los acredita. Conservar cifras CLS, referencias, evidencia histórica y estados de filas; no convertir el registro en medición actual ni certificación. No cierra requisitos por cambiar redacción. |
| C-04-P / TT-14 parte ZIP / P2 / planificado | Antigravity propone retener/corregir/retirar; GPT ejecuta cambios no triviales del paquete. `templates/page.documentation.json`, `templates/page.support.json` y equivalentes reales incluidos. | Decisión explícita de destino del contenido vendedor antes de escribir; 0,5–1 d de inventario/decisión técnica, más cambio si su alcance lo exige. | Inspección del ZIP final: decidir si cada plantilla es utilizable por el comerciante o debe retirarse. Corregir o retirar el claim “Each preset changes theme settings only” con comportamiento probado. No cerrar esto solo corrigiendo la web pública. |
| C-04-N / LV-27 + TT-04 / P2 / planificado | Antigravity, GPT si hay impacto técnico transversal. Temas/tiendas/previews, docs públicas y configuración/copy actuales. | Nomenclatura y dos cambios de copy autorizados por Johandry por chat el 2026-10-30; permisos y nombres adicionales a confirmar; 0,5–1 d interno más dependencias web/tienda por estimar. | Identidad Sartorial/Imprint/Archive coherente. `docs/merchant/docs.html:204` y `docs/merchant/support.html:254` contienen Edition en el contraste delegado; los cuatro paths de docs inspeccionados dentro del ZIP no tenían Edition/Atelier. Sustituir los valores completos de `listings/sartorial/templates/index.json:35` (`settings.text`) y 52 (`eyebrow`) según contrato siguiente. No renombrar identificadores técnicos, dominios ni menciones históricas por barrido masivo. |
| C-04-N-P3 / GEM-E-002 / comentarios CSS / P3 / planificado | Antigravity, mecánico en turno exclusivo; GPT coordina alcance y Claude revisa. `assets/base.css` comentarios de Couture/Edition. | Base y lista cerrada acreditadas; 15–30 min provisional adicional, sin duplicar el P2 de nomenclatura. | Limpiar únicamente los comentarios obsoletos: ZIP integrado v4 líneas 4145 y 9950; checkout de coordinación `b45e913`, 4145 y 9945. Etiquetar qué referencia se modifica. Diff solo de comentarios, sin renombrar selectores, tokens, IDs ni `motion_style`, sin alterar CSS ejecutable. |
| C-04-R / G4 / bloqueo de envío / planificado | Antigravity redacta notas y configura versión; GPT adapta packaging si hace falta; Claude revisa el ZIP. | Johandry decide número de versión y política de notas; 0,25–0,5 d de contenido/configuración, packaging adicional reestimable. | `release-notes.md` en raíz del ZIP final: advertir que especificaciones y procedencia dejan de leer metafields `custom.*` y `sartorial.*`, que sus valores existentes ya no se muestran y que el dato se carga en los settings del bloque. Versión coherente en metadata/paquete/notas y cambios reales trazables. Verificar presencia dentro del ZIP, no solo en el repo. |
| C-05 / TT-15 / P2 / planificado | GPT. Siete secciones `main-page`, `main-documentation`, `main-support`, `main-about`, `main-policy`, `main-faq` y `main-contact`. | Inspeccionar schemas/usos válidos y contratos antes de proponer restricción; 0,5–1 d adicional V2. | Revisar presets sin `enabled_on` y H1; permitir solo contextos válidos sin romper plantillas legítimas. Probar editor e instalación: no generar duplicación accidental de H1 por sección principal añadida en contexto indebido. No aplicar mecánicamente una restricción sin comprobar usos. |
| C-06 / TT-19 / P2 de verificación / planificado | Antigravity reproduce `<shopify-account>` en `sections/header.liquid`; GPT interviene si el cambio no es sencillo. | Entorno/cuentas acreditados; 0,25–0,5 d de verificación, arreglo solo tras diagnóstico y nueva estimación. | Verificar si el objeto `link_list` sin `.handle` causa fallo real. Documentar reproducido/no reproducible y límites, con contrato real del componente. No presentar la hipótesis como fallo probado ni cerrar sin prueba. |
| C-07 / TT-51 / P2 parcial / planificado | GPT. `sections/main-product.liquid:722–779`, loop 724; `sections/featured-product.liquid:482–484`; consumidor en `assets/theme.js:614–690`. | Fixtures autorizados y estrategia oficial vigente comprobada antes de solución; 0,5–1 d investigación/prueba, implementación se reestima en R-D. | Probar 1, 250 y 251+ variantes en PDP y featured. Determinar límites y una estrategia completa; no truncar arbitrariamente JSON o selección. Conservar guards de cards `>250`; en complete-the-look, `>250` cuando existe `variants_count` y fallback conservador `>=250` solo cuando falta ese conteo; recommendations `>100`. No introducir regresión con exactamente 250 variantes; bundle/cross-sell no pierden sus guardas. |

RC-07 se resolvió en V3 y se conserva en V4 como P1 condicionado, conforme a `GPT-AUDIT-THREE-THEMES-MASTER-001.md:189,244` (TT-63/RC-07, ambos temas en su comparación). La maestra Claude lo trató históricamente como TT-63 P3 para Sartorial; V2 propuso P2. Se conserva ese desacuerdo como trazabilidad, pero no queda una ratificación P2 pendiente ni se atribuye al GPT una falta de prioridad. C-08 tiene una sola fila de ejecución en A, prepara inventario mediante 0-04 y se regresa aquí y en G3/R-G. Defaults o fallbacks no acreditan por sí mismos políticas falsas.

El copy de C-04-N autorizado por Johandry por chat el 2026-10-30 sustituye el valor completo `INDIVIDUALLY NUMBERED ATELIER EDITIONS` por `SARTORIAL` en `listings/sartorial/templates/index.json:35` (`settings.text`) y el valor completo `ATELIER EDITIONS / 02` por `SARTORIAL / 02` en 52 (`eyebrow`). No es una sustitución de subcadena que conserve un claim de numeración o una frase incompleta. Antigravity puede ejecutarlo como tarea sencilla en su turno. Se conservan identificadores como `motion_style: atelier`, `atelier_gallery` y `atelier_gift_threshold`; “atelier” como oficio, historia documentada, dominios y referencias a SebastianDev017 no se renombran. Se conservan expresamente las cadenas de `listings/sartorial/templates/index.json:19,53,70,107,128`, `listings/sartorial/templates/collection.json:10` y `templates/index.json:90`. Las menciones «Haute Couture» de `index.json:19,53,70,107` se conservan provisionalmente como copy demo, sujetas a decisión de Johandry en 0-04/§9 por su condición de denominación protegida en Francia; R-C no reabre el diseño técnico. C-04-N-P3 se limita por separado a los dos comentarios CSS señalados. C-04-P3 corrige lenguaje no certificante en un pasaje del ledger sin alterar el registro histórico.

C-03 no es un refactor preventivo obligatorio. Los resultados históricos de Sartorial no bastan para aprobar G2 de los otros presets o del futuro candidato consolidado. Tampoco justifican abrir por sí solos una partición global.

### 4.4 Lote D — Demos, coherencia de producto y pulido

D-01 se prepara temprano, con aprobación de catálogo/activos y permisos; su verificación final requiere el build estabilizado. Antigravity coordina y ejecuta configuración autorizada; GPT atiende cambios técnicos; Claude verifica independientemente.

| ID / hallazgos / prioridad / estado | Dueño / alcance | Dependencia / esfuerzo | Criterio de aceptación |
| --- | --- | --- | --- |
| D-01 / V-01, LV-23, LV-24, V-07 / P1 demo y P2 según subhallazgo / planificado | Antigravity. Home/PLP/PDP y catálogo/imágenes aprobados por preset. | Activos, catálogo y escrituras aprobadas; 2–4 d configuración. Producción de fotografías, derechos y aprobación de activos se estiman aparte con fecha externa de Johandry. | Sin placeholders ni fixtures de QA en rutas comerciales; fotos pertinentes y catálogo aprobado, verificaciones móviles/escritorio y nueva evidencia completa. No retirar fixtures de un entorno hostil que aún se necesita medir sin coordinarlo. |
| D-01-N / LV-26 / P2 / planificado | Antigravity. Navegación demo Home/Catalog/Contact y destinos. | Menú/arquitectura de contenido aprobados y autorización de tienda; 0,25–0,5 d adicional V2. | Navegación útil por preset, enlaces y páginas reales; no limitarse a cambiar rótulos ni inventar destinos. |
| D-01-L / LV-25 / P2 / planificado | Antigravity; Johandry valida idioma y datos. PDP histórica del vestido y equivalentes actuales. | Producto/idioma UI/contenido y tallas reales verificados; 0,25–0,5 d de configuración, obtención de datos externa. | UI y contenido coherentes para el mercado definido; tallas con datos reales. No traducir o inventar medidas para cerrar el ítem. |
| D-01-V / V-05 parte contenido, vinculada con A-02 / P2 / planificado | Antigravity para copy/destinos; GPT si cambia lógica. Narrativa técnica, CTA “VIEW TECHNICAL SPECS”, tarjeta instructiva y material por tipo. | Política de A-02 y copy/destinos aprobados; 0,5–1 d adicional V2 de contenido/configuración. | CTA lleva al destino que promete y la tarjeta no expone instrucciones internas como copy de venta; material respaldado. A-02 cubre el código de `product.type`. Una raíz V-05 con dos entregables, sin contarla dos veces. |
| D-02-Q / RC-08, TT-105 / P2 / planificado | GPT. Cantidad/incremento y superficies afectadas, lista cerrada tras R-D. | Reproducir reglas de cantidad reales; 0,5–1 d provisional independiente de D-02-A/T. | Caso mínimo 2, paso 2, actual 4, máximo 5: resultado respeta simultáneamente máximo y secuencia válida de incremento; probar límites y estados de bloqueo. No normalizar a una cantidad inválida. |
| D-02-A / RC-13, TT-106 / P2 / planificado | GPT. Variante, botón, mensaje visual y anuncio accesible. | Matriz de stock y planes de A-01/B-02; 0,5–1 d provisional. | Disponibilidad coherente entre selección, botón y anuncio: distinguir agotado de plan requerido ausente/no válido; cambios de variante y ambas superficies según alcance. |
| D-02-T / RC-14, TT-108 / P3 / planificado | Antigravity si es contenido local; GPT si hay lógica compartida. Guía de tallas. | Medidas reales/aprobación o etiquetado de ejemplo; 0,25–0,5 d más espera de datos externa. | Distinguir inequívocamente medidas de ejemplo de datos reales; no presentar una tabla genérica como medidas verificadas del producto. |
| D-03 / LV-02, LV-03, LV-05, LV-21, LV-22, V-08 / P3 / planificado | Antigravity si es local; GPT si es transversal. Alineación, scrollbar, tarjetas/swatches, newsletter duplicada y salida del carrito vacío. | Intención de hero confirmada y entorno estable; 1–3 d tras acotar lista cerrada. | Títulos largos, con/sin swatches, estados vacíos y viewport estable; navegación clara, sin cambiar alineación del hero por suposición. |

La sugerencia opcional de Claude de dejar TT-105/TT-106/TT-108 en P3 se acepta solo para TT-108. Para cantidad e información de disponibilidad se conserva P2, conforme a la devolución GPT y al riesgo funcional. No se rebajan silenciosamente: un triage posterior deberá justificar cualquier cambio sobre el build elegido.

#### Evidencia de todo el Lote D exigida en R-Demo

Por Sartorial, Imprint y Archive: Home, PLP y PDP, cada una en escritorio y móvil. Cada registro incluirá URL/ruta sin credenciales, fecha, viewport efectivo comprobado, nombre e ID del tema/preset acreditados, build/SHA o relación aún pendiente, configuración/catálogo aprobado, idioma de interfaz y contenido, y capturas nuevas antes/después conservadas en la entrega autorizada.

R-Demo cierra expresamente D-01 y sus subítems, D-02-Q/A/T y D-03. Claude comprueba de forma independiente los criterios funcionales de sus filas: cantidad mínimo 2/paso 2/actual 4/máximo 5, coherencia entre variante/botón/anuncio distinguiendo agotado de plan requerido, tallas de ejemplo frente a reales y UI/pulido con sus estados límite. Las capturas comerciales por sí solas no aceptan D-02 ni D-03.

Como D-02 puede modificar compra después de R-A/R-B, antes de R-G se exige regresión funcional independiente de A-01 y B-02 en ambas superficies, y de los contratos de carrito que esos cambios puedan afectar, sobre el mismo candidato identificado que llegue a R-G. R-Demo conserva esta evidencia y bloquea el avance si falta o falla; toda mutación real sigue requiriendo autorización. No basta repetir métricas y los tres arreglos de base.

Antigravity puede dividir R-Demo en dos subentregas, contenido y funcional, conservando el mismo ID de checkpoint, el mismo candidato identificado y un dictamen agregado de cierre. Ninguna subentrega aislada acepta todo D. Si cambia el candidato entre ambas, se reconcilia y se repite la evidencia afectada antes del cierre agregado. No se crea un octavo checkpoint.

La captura nueva prueba el estado nuevo observado; no reconstruye las capturas históricas que no quedaron archivadas. Se distingue producto comercial de fixture de prueba. Una etiqueta de preview o el nombre de la tienda no prueban identidad técnica por sí solos. Toda publicación, cambio de protección o mutación de datos de tienda tiene autorización separada.

### 4.5 Lote E — Diferenciación del editor

| ID / hallazgos / estado | Dueño | Dependencia / esfuerzo | Criterio |
| --- | --- | --- | --- |
| E-01 / TT-06, TT-16, TT-17 / diferido con motivo, fuera del camino de envío | Antigravity coordina propuesta; GPT delega análisis e implementación aprobada; Claude revisa. | Demos acreditadas, evaluación empírica de diferencias y tareas concretas del comerciante, diseño/compatibilidad y alcance aprobados. 5–10 d solo después de diseño aprobado; reestimar alcance. | Capacidades útiles comprobadas por preset en instalación, editor, móvil y estados límite. Sin número obligatorio de headers/tarjetas/settings ni copia de código ajeno. |

TT-56 / P3 diferido: según `CLAUDE-REVIEW-ANTIGRAVITY-COMPARATIVA-001.md` §1.4 y Claude MASTER §9.5, el ZIP contiene `locales/es.json` y `locales/en.default.schema.json`, pero no `locales/es.schema.json`. La localización del schema al español no se presenta como requisito de Shopify ni como condición del envío. La decisión es opcional e independiente de activar E: si Johandry la solicita, se crea una tarea propia en Lote C con R-D, lista cerrada y verificación de paridad de claves entre `en.default.schema.json` y `es.schema.json` mediante `scripts/locale-key-inventory.mjs` solo si 0-05 acredita ese arnés, además de revisión del editor en español. Sin decisión, permanece diferida y fuera del camino de envío.

Motivo del diferimiento: ampliar capacidades no debe desplazar la corrección y comprobación de defectos demostrados. Solo evidencia nueva de incumplimiento de un requisito obligatorio o una decisión expresa de Johandry puede devolver E al camino de envío, mediante directiva y revisión. No se presume ausencia de diferenciación de Archive.

## 5. Checkpoints de revisión de Claude

Existen siete tipos de checkpoint reales. R-D es prospectivo y se repite antes de emitir cada directiva, incluidas las del Lote 0, integración de base, entornos, lotes y toda corrección con nuevo alcance. Los otros seis son revisiones retrospectivas de cierre con evidencia ya producida según su alcance. El revisor dispone de un turno independiente: puede leer en paralelo cuando sea seguro; si necesita escribir su informe en el proyecto, recibe un turno de escritura.

### 5.1 Contratos de revisión obligatorios

Entradas prospectivas de R-D, antes de emitir cada directiva:

1. ID y borrador de directiva, SHA/base identificada y preflight actual disponible; identidad de checkout/entorno y conflictos pendientes.
2. Objetivo, alcance propuesto, dueño/turnos, lista cerrada de archivos permitidos y cambios de contrato o Nivel 2 previstos; ramas alcanzables, names/IDs/formularios y aria que deben preservarse.
3. Criterios falsables y pruebas propuestas, herramientas disponibles, dependencias de datos/tienda, autorizaciones aplicables o pendientes y esfuerzo actualizado.
4. Filas reales y estado actual del ledger, estados que se propondría alcanzar y evidencia que deberá producirse; URLs/identidades de entornos ya disponibles sin inventar las aún pendientes.

R-D no exige diff final, lista efectivamente tocada, árbol entregado, informe de implementación ni resultados finales todavía inexistentes. Su salida evalúa la viabilidad y suficiencia de la directiva propuesta; las dependencias sin resolver bloquean su trabajo correspondiente.

Entradas retrospectivas de R-0, R-A, R-B, R-C, R-Demo y R-G, según aplicabilidad:

1. ID de directiva y autorizaciones aplicables; objetivo, alcance, desviaciones y criterios falsables.
2. SHA base completo y SHA o hash del árbol entregado; manifest de archivos y relación con ZIP/build de tienda cuando corresponda.
3. Lista cerrada permitida y lista efectivamente tocada, diff contra la base y explicación de toda diferencia.
4. Informe del autor con cabecera completa RULES §1.4; comandos y salidas literales, fecha, entorno y artefactos. Etiquetar sintético, estático o tienda; no mezclarlos.
5. URLs de preview sin credenciales, nombre/ID/preset y evidencia de su relación con el build; inventario de arneses/herramientas disponibles.
6. Filas reales del ledger que se pretende mover, estado actual, estado propuesto y evidencia por afirmación; bloqueos y decisiones de Johandry.

En R-0, si no hubo cambios porque los arreglos ya estaban presentes, se declara ese hecho y se entrega evidencia de identidad/presencia/reproducibilidad; no se inventa un diff o informe de implementación. Si hubo integración autorizada, se adjuntan su diff, archivos tocados y resultados como en los demás cierres.

Salidas de cada revisión:

1. Dictamen `aceptar`, `devolver` o `escalar`, con razón y alcance exacto.
2. Lista numerada de afirmaciones que Claude intentó falsar, método independiente, archivo/línea o prueba y evidencia reproducible. En R-D son premisas y suficiencia del diseño/alcance propuesto, verificadas con la evidencia disponible; no resultados de una implementación futura.
3. Hallazgos dentro de alcance y reproducción; extras fuera de alcance registrados sin parche en esa revisión. Toda expansión vuelve a directiva.
4. Propuesta de estado por fila del ledger, límites y dependencias todavía abiertas; en R-D se fija la transición pretendida y su evidencia futura sin mover la fila. La aceptación de código no se presenta como medición de tienda.
5. Identidad de lo realmente revisado y condición de bloqueo del siguiente paso.

Ninguna entrada o salida contendrá contraseñas, cookies de preview, tokens, valores de STOREFRONT_PASSWORD u otros secretos. Los informes y arneses se revisarán también para evitar capturas de esos datos. No se presupone acceso a una VM ni se reutiliza `$HOME/livetest` sin inventario.

### 5.2 Secuencia y bloqueos

| Checkpoint / momento | Responsable / entradas específicas además del contrato prospectivo o retrospectivo correspondiente | Salida y bloqueo |
| --- | --- | --- |
| R-0 / cierre de base, antes de A | Claude. Ficha 0-01: base reproducible, árbol/hashes, tres arreglos y pruebas dirigidas, vínculo ZIP; inventario de previews y dependencias con dueño. Si hubo integración, diff y entrega; si no hubo cambios, evidencia de identidad/presencia sin inventar entrega de implementación. | Aceptar base o devolver/escalar. Sin los tres arreglos identificados y reproducibles no se abre A. Una dependencia de preview/app aún abierta bloquea el cierre de A correspondiente, no se borra de la ficha. CMP-01: tras decisión de base y confirmación M2, Claude resuelve SHAs completos y usa `git merge-base --is-ancestor` para verificar descendencia de `09f8342` o `c4dca23`; cuenta la ausencia del literal en los cuatro archivos sin mostrarlo. BOARD local:16 se reconcilia con `09f8342` §15.2. Sin estas condiciones no acepta la base. |
| R-D / antes de cada directiva, incluido Lote 0 | Claude. Contrato prospectivo: base/preflight, borrador de alcance y archivos permitidos, criterios y pruebas propuestos, dependencias/autorizaciones, ledger actual y esfuerzo. Revisar ramas, names/IDs/formularios, aria y Nivel 2. | Directiva apta para emitir, devolución o escalamiento; no exige artefactos finales futuros. No comienza escritura dependiente si faltan decisiones, permisos o contratos necesarios. La R-D futura de A-02 declara cambio de contrato Nivel 2 y exige autorización técnica previa y explícita de Gemini, RULES §3.5; el chat del 2026-10-30 y la aprobación de V4 no la sustituyen. |
| R-A / después de A, incluidos B-02 y C-08 | Claude ejecuta pruebas independientes de FormData/payload y transiciones, variantes sin JS y foco en previews acreditados. Verifica retiro de catorce fuentes/heurísticas A-02, ausencia de sustitutos y ocultación, preservación de lectores externos al alcance y settings manuales solo respaldados. Para C-08 contrasta inventario/respaldo, ausencias y destinos. | Aceptar solo lo probado; compra/foco/datos/promesas devueltos bloquean su avance. Sin app/fixtures o demos reales, los requisitos empíricos permanecen pendientes; no cerrar por fixture o cálculo. A-02 no espera nuevos datos para retirar lectores; dato manual sin respaldo no se muestra. Prueba explícitamente `circa_year` y `gsm` en producto textil y no textil, con dato respaldado y vacío, verificando sus efectos por plantilla y ocultación. |
| R-B / después de B | Claude. Resize real y arnés de menú disponible, red/respuesta perdida; contrato B-04 completo (sucia/limpia/oculta, pendiente/destino, edición en vuelo, fallos y mutaciones, último artículo/textarea ausente, Checkout nativo JS/no-JS); label accesible/axe a 390 y 1280, regresión no-JS B-02. | Aceptar/devolver/escalar con evidencia nueva; compra y navegación no estabilizadas bloquean consolidación de C. Si B-04 requiere más que conexión local del helper, devolver a R-D/reestimar. Mutación real requiere autorización; acelerados no se certifican. |
| R-C / después de C y paquete de instalación | Claude. ZIP instalado en tienda limpia autorizada por preset, raíz/listings, docs públicas y dentro del ZIP, copy C-04-N, comentarios C-04-N-P3, lenguaje C-04-P3, versión/notas y C-05/C-06/C-07. Regresa C-08 ejecutado en A: respaldo/ausencias/destinos tras instalación. C-03 solo si activado. | Aceptar instalación/paquete o devolver/escalar. Docs de vendedor o versión/notas incoherentes bloquean paquete; C-08 conserva P1 condicionado y no se reabre como P2. Fallo G2 no resuelto activa diagnóstico, no partición automática. Verifica que las notas describen el retiro de lectura y sus efectos para comerciantes; conserva las cadenas enumeradas en C-04-N y no reabre el diseño técnico. «Haute Couture» queda sujeto a la decisión empresarial 0-04. |
| R-Demo / cierre de todo D: D-01 y subítems, D-02-Q/A/T y D-03 | Claude. Matriz nueva Home/PLP/PDP × móvil/escritorio por preset e identidad/capturas; pruebas independientes de cantidad min2/paso2/actual4/max5, mensajes stock/plan/anuncio, tallas ejemplo/reales y UI/pulido. Regresión posterior a D de A-01/B-02 y contratos de carrito afectados, mismo candidato de R-G. Puede recibir dos subentregas contenido/funcional bajo el mismo checkpoint y cierre agregado. | Aceptar todo D probado o devolver/escalar; ambas subentregas deben completar su evidencia sobre el mismo candidato antes del cierre agregado. Defectos/regresión pendiente o fallida bloquean R-G; contenido/identidad/activos pendientes bloquean G1. No aceptar D-02/D-03 con capturas solamente ni crear un octavo checkpoint. |
| R-G / candidato congelado, antes de envío | Claude mide independientemente Lighthouse, axe y teclado por preset; comprueba regresión posterior a D sobre ese candidato, C-08 en contenido/destinos y G1–G4. Antigravity entrega hashes/ZIP y regresión de los tres arreglos; GPT apoya diagnóstico. Si se reutilizan los dos gate5 o uno de ellos, debe constar 0-05-P3 corregido y revisado para el arnés utilizado, sin credenciales en evidencia. | Dictamen de preparación sin garantía Shopify. Regresión funcional pendiente impide cierre. 0-05-P3 conserva P3: puede utilizarse otro arnés acreditado/válido, sin afirmar limpio uno no revisado. Cambio posterior exige regresión/medición pertinente. Johandry decide el envío; sin su autorización no se publica ni envía. |

Claude ejecutará personalmente la medición independiente de foco/teclado/axe pertinente de R-A y R-B y la matriz Lighthouse/axe/teclado de R-G. No basta adjuntar resultados de GPT. Si el entorno o herramientas no están disponibles, el checkpoint registra el bloqueo, responsable y solución; no finge ejecución.

## 6. Entrega, ledger y cinco compuertas de calidad

Por tarea: Antigravity registra dueño/turno y directiva revisada en R-D; GPT asigna subagente con modelo/objetivo/archivos/criterio; el autor hace preflight, reproduce y clasifica vigente/ya corregido/no verificable; implementa solo el alcance autorizado; entrega informe RULES, diff, arnés y salidas; Claude revisa independientemente; los hallazgos devueltos se corrigen en un nuevo turno y se revisan de nuevo. Antigravity conserva trazabilidad y propone avances; Johandry conserva las decisiones finales.

| Compuerta obligatoria | Evidencia para cada entrega |
| --- | --- |
| Requisitos / ledger vivo | Filas reales afectadas, afirmación por fila, archivo/línea comprobado o artefacto de prueba real. No se cierra con “Theme Check pasa” o “el modelo lo implementó”. |
| Estados degenerados | Vacío, uno, muchos, muy largo y faltante en las superficies modificadas; justificar no aplicables. Incluir límites específicos de planes, variantes y cantidades, además de las muestras ordinarias. |
| Consistencia entre archivos | Barrido de la causa, valores/contratos relacionados, sin duplicaciones hardcodeadas. Moneda desde `shop.money_format` mediante el mecanismo del tema; sin formateo paralelo con Intl. |
| Superficie del comerciante | Labels en sentence case e inglés neutro, claves `t:`, `info` en dependencias externas; sin jerga interna ni claims no verificables. |
| Tienda real | Build acreditado, catálogo/fixtures autorizados y móvil real/simulado con viewport verificado. Una prueba sintética o estática conserva su etiqueta y no sustituye el cierre empírico. |

Las directivas incluirán las compuertas existentes pertinentes, Theme Check, sintaxis y resolución de locales, entre ellas `node scripts/theme-check-sanity.mjs` y `node scripts/locale-key-inventory.mjs` cuando correspondan, una vez inventariadas. Esta entrega no ejecuta pruebas de tema. Si un requisito espera prueba empírica tras implementación se propone `código completo`; una decisión/acción externa pendiente se registra como `no verificado`. Claude propone, y la actualización autorizada del ledger la realiza su responsable.

## 7. Compuertas de envío G1–G4

No se confunden con prioridades de defectos ni con las cinco compuertas de calidad. Todas se evalúan sobre el candidato final identificado; primero debe mantenerse la precondición de los tres arreglos.

| Gate / tarea | Dueño y dependencias | Evidencia y aceptación |
| --- | --- | --- |
| G1 / demos e identidad por preset | Antigravity prepara; Claude verifica en R-Demo; Johandry aprueba datos/activos/escrituras. Depende de 0-02, C-02 y D-01 con subítems. | Sartorial, Imprint y Archive acreditados individualmente, Home/PLP/PDP móvil y desktop, idiomas/catálogo/nombres/nav coherentes, sin QA ni placeholders. Plazo de activos/acceso es externo. |
| G2 / medición por preset y build final | Claude es dueño de medición independiente; Antigravity estabiliza entornos; GPT apoya diagnóstico. Depende de previews reales, build consolidado y herramientas 0-05 acreditadas para cada medición. Los gate5 solo pueden aportar comprobaciones que realmente realicen y tras 0-05-P3; no se les atribuye generación de Lighthouse. Esfuerzo de medición aparte tras inventario; no se oculta dentro de C-03. | Lighthouse Home/PDP/PLP × móvil/escritorio × preset, con repeticiones/metodología, versiones, fecha, URLs/ID e identidad real observada y relación con candidato; axe y teclado/foco/controles. Configuración/preview correctos no sustituyen verificar esa identidad. Acordar en R-D umbrales y requisitos oficiales vigentes antes de medir. Conservar resultados nuevos tras consolidación. Fallo requiere diagnóstico/propuesta C-03; cumplimiento deja C-03 diferido. |
| G3 / listing, documentación y soporte | Antigravity, con Claude revisor; Johandry confirma canales, claims y titularidad. Depende de C-04, C-04-P/N y activos reales; regresa C-08/RC-07 ejecutado en A. | Capturas del build real, contenido utilizable/veraz dentro y fuera del ZIP, promesas respaldadas, ausencias seguras y destinos correctos; soporte confirmado. C-04-P3 conserva evidencia histórica sin lenguaje certificante. Web pública y buzón son dependencias externas, sin fecha inventada ni mensajes enviados por este plan. |
| G4 / versión, notas y paquete | Antigravity; GPT si se requiere packaging; Claude inspecciona ZIP. Johandry decide versión y candidato. Depende de C-04-R y resto de gates. | `release-notes.md` en raíz del ZIP, versión coherente, manifest/hash final, relación árbol–paquete–entornos probada y regresión final de los tres arreglos. No exigir los hashes antiguos tras cambios legítimos; registrar nuevos y diff. |

La medición final vuelve a ejecutarse después de consolidar todas las correcciones, aunque existan resultados anteriores. Una descarga o captura de hoy demuestra solo el estado observado hoy, no recompone despliegues históricos. Ninguna puntuación garantiza aprobación de Shopify; cero violaciones de axe no certifica WCAG.

## 8. Orden operativo y esfuerzo

Secuencia prevista:

1. Recibir aprobación explícita de Johandry a la V4 y su orden de implementación; resolver decisiones que desbloquean la primera directiva y registrar roles ya ordenados. Esta planificación no equivale a dicha orden.
2. R-D prospectivo de cada directiva de preparación, incluido Lote 0, con base/preflight y trabajo/pruebas propuestos → emitir directiva apta → Lote 0/base reproducible con tres arreglos → R-0 retrospectivo. Inventariar entornos/arneses y preparar previews/app/activos temprano con sus autorizaciones; no exigir en R-D entregas finales aún inexistentes.
3. R-D de A → A-01, A-02, A-03, B-02 y C-08/RC-07 P1 condicionado en turnos secuenciales → R-A. C-08 prepara su inventario en 0-04, contabilizado una vez en su fila. A-02 retira las catorce fuentes sin esperar datos nuevos; solo settings manuales no vacíos necesitan respaldo. Imprint/Archive y planes deben acreditarse antes de cerrar pruebas dependientes.
4. R-D de B → B-01/B-03/B-04/B-05 → R-B, incluida regresión de B-02.
5. R-D de cada tarea C → C con instalación, docs, ocho P2 según su entrega y dos P3 internos de copy documental/comentarios → R-C, incluida regresión C-08 ya ejecutado en A. Medir G2 temprano por preset y de nuevo al final; usar arnés acreditado y, si se reutilizan los gate5 afectados, completar previamente 0-05-P3. Activar C-03 solo por fallo y diagnóstico.
6. D puede preparar contenido/activos desde el inicio, con R-D previo, escrituras autorizadas y entornos congelados. Completar D-01 y subítems, D-02-Q/A/T y D-03; congelar candidato → R-Demo funcional y de contenido, con regresión independiente posterior a D de A-01/B-02 y contratos de carrito afectados. Puede organizarse en dos subentregas sobre el mismo candidato, con un cierre agregado y sin nuevo checkpoint.
7. Mantener ese mismo candidato congelado → R-G con G1–G4, evidencia de la regresión funcional posterior a D, métricas nuevas y tres arreglos → decisión de Johandry sobre envío. E permanece diferido salvo evidencia o decisión expresa.

Las estimaciones revisadas conservan A-02 ~1 d con retiro decidido; A-03/B-01 0,5–1 d; B-02 0,5–1 d; C-08 0,5–1 d inventario más remedio reestimable, sin duplicarlo con 0-04; B-03 1–2 d; B-04 ~0,25 d de conexión local más regresión, y retorno a R-D si exige más; B-05 0,25–0,5 d; C-01/C-02 1–2 d y C-02 instalación aparte; C-03 2–4 d solo activado; docs 1–2 d internos más web/soporte por estimar; D-01 2–4 d configuración más producción/aprobación de activos; E 5–10 d tras diseño aprobado. Los tres P3 tienen bandas propias: C-04-N-P3 comentarios 15–30 min, C-04-P3 lenguaje documental 15–30 min, 0-05-P3 ambos gate5 1–2 h de parametrización; ejecución/medición reales aparte.

No se suman estas bandas en un total aparente: faltan decisiones, costos externos y reestimaciones de investigación, y algunas actividades se solapan. Los ocho P2 añadidos tienen esfuerzo propio en sus filas; no se dan por incluidos gratis. La medición independiente de Claude y las regresiones se planifican tras inventariar herramientas y alcance. Las fechas de app, activos, soporte, acceso y aprobaciones las confirman sus responsables externos.

## 9. Decisiones pendientes y bloqueos

| Decisión / acción pendiente | Autoridad / responsable de preparar | Bloquea |
| --- | --- | --- |
| Aprobación explícita de esta V4 y orden de implementación | Johandry | Toda implementación; además exige las precondiciones, directivas y autorizaciones aplicables. |
| Confirmación de rotación D1 del 2026-10-22 | Johandry | Confirmar que D1 registrada en BOARD de `09f8342` §15.2 cubrió `tema-qkqpke0j` y las tres demos, o repetir la rotación. Ningún agente prueba credenciales antiguas contra tiendas; dependencias de 0-01/R-0 y 0-05-P3. |
| Autorizar técnicamente A-02 Nivel 2 | Gemini en R-D, conforme a RULES §3.5 | Previa y explícita; la decisión empresarial del chat 2026-10-30 sobre retirar lecturas no la sustituye y no reabre el diseño aprobado. |
| Conservar «Haute Couture» como copy demo | Johandry / Antigravity prepara | `listings/sartorial/templates/index.json:19,53,70,107`; provisionalmente conservado hasta decisión 0-04. Denominación protegida en Francia. |
| Solicitar localización opcional de schema al español TT-56 | Johandry | Independiente de E y fuera del camino de envío; si se solicita, tarea propia C con R-D, paridad de claves y editor en español. |
| Alcance de implementación y build de base/envío; forma de consolidar los tres arreglos | Johandry / Antigravity, GPT si integración compleja | 0-01, R-0 y apertura de A. No se presume autorización de commit. |
| Autorización de crear/cargar/cambiar previews Imprint/Archive y acceso seguro | Johandry / Antigravity | Cierre A-03, evaluación empírica E, G1/G2. Inventario actual primero. |
| App/fixtures de compra única/opcional/obligatoria y alcance de pruebas con mutaciones de carrito | Johandry / Antigravity con matriz GPT | Cierre real A-01 y pruebas comerciales de A/B. No se asume que hoy no existan. |
| Respaldo factual de contenido manual no vacío por producto/contexto; datos comerciales de V-05 | Johandry acredita; GPT prepara, Antigravity registra | Bloquea conservar o publicar contenido manual no vacío sin respaldo. Retiro de catorce fuentes/heurísticas A-02 autorizado por Johandry por chat el 2026-10-30 y no espera datos nuevos; requiere autorización técnica previa y explícita de Gemini en R-D conforme a RULES §3.5. Sin fuente aprobada se vacía/oculta, sin neutro inventado. Las siete definiciones siguen excluidas como prohibición separada. |
| Promesas de devoluciones/fabricación/servicio: respaldo, tratamiento de vacíos y destinos | Johandry acredita/decide negocio; GPT y Antigravity preparan inventario | Remedio/copy C-08 en A. Prioridad P1 condicionado ya adoptada; no hay P2 a ratificar. El inventario no presupone que una política actual sea falsa. |
| Catálogo, idiomas, tallas, navegación, CTA, fotografías y fechas de producción/aprobación | Johandry / Antigravity | D-01 y subítems, G1/G3. |
| Retener/corregir/retirar plantillas de documentación/soporte vendedor dentro del ZIP | Johandry sobre alcance; Antigravity prepara y GPT evalúa impacto | C-04-P y R-C. |
| Nombres adicionales actuales y permisos; control de web/dominio/buzón | Johandry / Antigravity | C-04/C-04-N y G3 según superficie. Copy `SARTORIAL` y `SARTORIAL / 02` autorizado por Johandry por chat el 2026-10-30; no se reabren identificadores técnicos, oficio, historia o dominios por renombre general. C-04-P3 solo reexpresa metodología/limitaciones y conserva estados/evidencia del ledger. |
| Número de versión, notas y candidato final | Johandry / Antigravity | C-04-R y G4. |
| Requisitos y umbrales vigentes, metodología/repeticiones y disponibilidad de medición independiente | Antigravity coordina; Claude define/verifica; Johandry resuelve alcance | G2, activación C-03 y R-G. |
| Ficha/configuración de origen, preview ID y rutas de colección/PDP del candidato; elección del arnés | Antigravity entrega ficha sin secretos; GPT parametriza; Claude revisa | Uso de gate5-live-verify/gate5-complete-verification para nueva evidencia requiere antes 0-05-P3. Otro arnés identificado/válido es una alternativa legítima; no se eleva P3 ni se usa configuración histórica silenciosa. |
| Diseño/compatibilidad y retorno de E al camino de envío, solo si procede | Johandry / propuesta Antigravity–GPT revisada por Claude | E; no bloquea los defectos ni envío por defecto. |

## 10. Historia y relación de cambios V1 → V2 → V3

### 10.1 Cambios conservados de V1 a V2

Este apartado identifica decisiones históricas de V2. Las resoluciones históricas de V3 en §10.2, actualizadas en V4 y §11.6, prevalecen sobre sus dos formulaciones corregidas: A-02 ya tiene retiro cerrado y RC-07 ya no conserva la propuesta P2.

- Se mantiene el ID y la V1; se añade versión y estado solicitado sin ejecutar implementación.
- Preparación pasa a Lote 0 con los tres arreglos como precondición dura, identidad reproducible y nueva regresión/medición sobre el candidato final.
- Se adelantan previews Imprint/Archive, inventario/app de planes y dependencias de activos; las ausencias históricas no se presentan como estado actual.
- B-02 conserva ID, sube a ejecución en A con P1 condicionado y se regresa en R-B. D-02 se divide en cantidad P2, disponibilidad P2 y tallas P3.
- A-01 explicita caso C válido, transiciones y todos los valores de FormData; no obliga a compra única inválida en productos que requieren plan.
- A-02 exige política previa y fuentes aprobadas/verificadas; A-03 corrige causa `motion_style` y matriz real de foco.
- Se incorporan los ocho P2 omitidos como tareas con dueño, dependencia, esfuerzo y aceptación; RC-07 tiene tarea propia y P2 propuesto por planificación.
- Se precisa ruta y reutilización del guardado de B-04, y se crea tarea explícita de versión/`release-notes.md` dentro del ZIP.
- C-03 queda condicionado al fallo de G2 y diagnóstico; E queda fuera del camino de envío salvo decisión/evidencia expresa.
- Se hacen obligatorias delegación y escritura secuencial incluso con subagentes disjuntos; se formalizan siete checkpoints y medición independiente de Claude.
- Se separan esfuerzo técnico y dependencias externas; se corrigen límites de evidencia, nombres históricos y carga de gift-card.
- QA documental: se retira TT-26 de C-01 por pertenecer a Atelier/Contour; se precisa el umbral de complete-the-look; se distingue R-D prospectivo de los cierres retrospectivos y se amplía R-Demo a todo D con regresión funcional posterior antes de R-G.

### 10.2 Cambios definitivos de V2 a V3

- Se conserva todo el alcance válido de V2: diez C1–C10, seis O1–O6, ocho P2 con trabajo verificable, siete tipos de checkpoint, cinco compuertas, G1–G4, tres arreglos de base y regresión final, roles, escritor único y límites de autorización.
- A-02 cierra la ambigüedad: retira catorce fuentes automáticas (diez `custom.*` y cuatro aliases `sartorial.*`), consumos/fallbacks y heurísticas en dos snippets; conserva settings manuales con respaldo o vacíos/ocultos. No crea lectores/defaults sustitutos ni modifica datos/definiciones Shopify; las siete pendientes no se equiparan al inventario. No espera datos nuevos para retirar.
- B-04 corrige localizadores al patrón `handleCrossSellView` y helper `saveNoteAndNavigate`, y describe su contrato real. Checkout ordinario mantiene envío nativo JS/no-JS; no se le atribuye guardado del helper ni se refactoriza el carrito bajo una banda de parche pequeño.
- C-08/RC-07 adopta P1 condicionado y se ejecuta en A, con inventario temprano 0-04, esfuerzo único, revisión R-A y regresiones R-C/G3/R-G. El desacuerdo histórico P3/P1 y propuesta V2 P2 queda documentado; no hay ratificación de P2 pendiente.
- C-04-N sustituye dos valores completos por `SARTORIAL` / `SARTORIAL / 02`; conserva identificadores técnicos, usos de oficio, historia, dominios y referencia SebastianDev017. No deja un claim de numeración residual.
- R-Demo admite subentregas contenido/funcional bajo un mismo checkpoint/candidato y cierre agregado, manteniendo siete IDs. Claude001 se localiza prioritariamente por C1–C10/O1–O6.
- Se incorporan tres P3 con dueños, dependencias, esfuerzo y aceptación: C-04-N-P3 comentarios CSS, C-04-P3 lenguaje no certificante del ledger y 0-05-P3 ambos gate5 con identidad/rutas parametrizadas y eliminación de fallback literal de contraseña. No se ejecutan ahora ni cambian de prioridad. El saneamiento del arnés es precondición si se reutiliza para evidencia nueva, sin impedir usar otro válido/acreditado.
- V3 es definitiva como documento de planificación; implementación, tiendas, mutaciones, commits/pushes y publicación continúan pendientes de orden, precondiciones y autorización aplicable. La entrega V3 no generó evidencia de funcionamiento ni movió el ledger; V4 actualiza su gobierno y alcance conforme a §11.6.

## 11. Matrices de resolución de revisiones

“Integrado” significa incorporado al plan, no implementado ni cerrado en ledger.

### 11.1 Diez correcciones obligatorias de Claude

| Cambio Claude001 / líneas secundarias | Decisión consolidada V4 | Localización / justificación |
| --- | --- | --- |
| C1 / 166 | Integrado con autorización separada de Git | §3, 0-01, R-0 y R-G. Los tres arreglos preceden a lotes; árbol/ZIP reproducibles y remedición final. El plan no ordena un commit sin permiso. |
| C2 / 167 | Integrado con corrección de dominio válido | A-01, 0-03 y R-A. Caso C URL → compra única solo si válida; requires_selling_plan sin plan bloquea. App/fixtures y payload completo; no asumir ausencia actual. |
| C3 / 168 | Integrado: retiro autorizado por Johandry por chat 2026-10-30; Nivel 2 requiere autorización técnica previa y explícita de Gemini en R-D | A-02, §1 y 0-04. Catorce fuentes de dos snippets más heurísticas retiradas, sin sustitutos; manual factual aprobado o vacío/oculto, no espera datos para retirar. Schemas técnicos ya sin defaults; Archive `provenance_notes` sin respaldo se vacía. Catorce fuentes no se igualan a siete pendientes, cuya prohibición se conserva; lectores complementarios quedan fuera. |
| C4 / 169 | Integrado | 0-02 y A-03. Causa motion_style/solo CSS; previews temprano y antes de R-A; dependencias TT-06/TT-17/G1/G2 explícitas. |
| C5 / 170 | Integrado | C-05, C-06, C-07, C-04-P/N, D-01-N/L/V; §1 excluye Atelier/Cucuyo. Los ocho mantienen P2 y trabajo propio. |
| C6 / 171 | Integrado | C-04-R, G2 y G4. Antigravity versión/notas, GPT packaging necesario, Claude inspección de ZIP; Johandry decide versión. Medición por preset con dueño/dependencias. |
| C7 / 172 | Integrado con escritor único estricto | §2. Archivos disjuntos y partición registrada; subagentes escriben por turnos secuenciales, GPT integra antes de devolver. No se admite paralelismo de escritura por tener paths distintos. |
| C8 / 173 | Integrado | §5. Siete checkpoints, entradas/salidas/bloqueos y mediciones independientes de Claude, sin presumir su VM o herramientas. |
| C9 / 174 | Integrado y localizador corregido por Claude002 | B-04. Ruta sections/cart-drawer y exclusión global; View cart reutiliza `saveNoteAndNavigate`/patrón `handleCrossSellView`, contrato completo de errores/versión/pending y regresión. `handleDrawerChange` no guarda nota. Checkout ordinario nativo, no helper ni interceptación; acelerados fuera de certificación. |
| C10 / 175 | Integrado | C-03, G2 y §8. Solo fallo por preset o build final y diagnóstico activa partición; cumplimiento lleva a diferimiento documentado. |

### 11.2 Ajustes de la devolución GPT

| Sección del adjunto | Decisión consolidada V4 | Resolución |
| --- | --- | --- |
| 1 / conservar precondiciones | Integrado | §1–§3 y §6 preservan gobierno, identidad, cinco compuertas y límites sin autorizar acciones. |
| 2 / RC-01 | Integrado | B-02 P1 condicionado se ejecuta en A; PDP/featured, A→B sin JS, URL, payload/stock y regresión R-B. |
| 2 / RC-08, RC-13, RC-14 | Integrado | D-02-Q P2, D-02-A P2, D-02-T P3, con caso cantidad min2/step2/actual4/max5 y mensajes de plan frente a agotado. |
| 3 / RC-07 | Integrado con P1 condicionado adoptado | C-08 fila única en A, inventario temprano 0-04 y esfuerzo único 0,5–1 d más remedio reestimable. GPT MASTER sí asignó prioridad P1 condicionada; R-A contrasta respaldo/ausencias/destinos, R-C/G3/R-G regresan, sin afirmar políticas falsas. No integra los ocho P2. |
| 4 / selling_plan | Integrado | A-01 transiciones A→B→compra única, cambios variante, FormData.getAll completo y línea real de carrito solo autorizada. |
| 5 / foco | Integrado | A-03 matriz estilo/control/estado/esquema/fondo/método, footer scheme-2 y separación header/announcement, teclado y evidencia. |
| 6 / demos | Integrado | 0-02 y R-Demo: URL, fecha, viewport efectivo, identidad/build, capturas nuevas, idiomas y catálogo aprobado; límites de evidencia histórica. |
| 7 / delegación | Integrado | §2 y §6: cada tarea delegada con modelo, objetivo, alcance, propiedad y entrega; un escritor por turno. |
| 8 / E | Integrado | E-01 diferido y separado; tareas del comerciante/diseño antes de opciones, sin negar PDP diferenciada de Archive ni imponer cantidades de componentes. |
| Entrega / preservar y trazar | Integrado | V1/V2/V3 y revisiones conservadas, §10 historia con prevalencia V4, §11 correspondencias y §9 decisiones operativas legítimas pendientes. |

### 11.3 Seis sugerencias opcionales de Claude

| Nº / línea | Decisión | Justificación y aplicación |
| --- | --- | --- |
| O1 / 179 | Aceptada | A-01 separa código pequeño, 0,5 d configuración y 0,5 d pruebas; B-02 0,5–1 d; B-04 ~0,25 d más regresión; D-01 separa activos y C-04 la web/soporte externos. Nuevos P2 se estiman aparte. |
| O2 / 180 | Aceptada solo para TT-108 | TT-105 y TT-106 conservan P2 por devolución GPT y riesgo funcional; TT-108 P3. Conflicto documentado en §4.4, sin rebaja tácita. |
| O3 / 181 | Aceptada condicionalmente | 0-05 inventaría tt02.js, g20_g23.js, s2, p3, s8, axe y Lighthouse. Reutilizar solo disponibles/compatibles, etiquetando sintético/tienda; no presumir VM o $HOME/livetest. |
| O4 / 182 | Aceptada como criterio de diseño | B-01 usa fuente coherente de breakpoint y evalúa atributo data/contrato existente en R-D; evita duplicación hardcodeada sin imponer una arquitectura no inspeccionada. |
| O5 / 183 | Aceptada como ficha, IDs históricos a revalidar | §3 incorpora nombre e ID de tema por tienda, preview y relación al build. Los IDs sugeridos no se presentan como inventario actual. |
| O6 / 184 | Aceptada | E-01 queda fuera del camino de envío; solo evidencia o decisión expresa cambia ese estado. |

### 11.4 Resolución de la segunda revisión Claude002

| ID / localizador principal en Claude002 | Decisión V4 | Resolución y evidencia de planificación |
| --- | --- | --- |
| C002-1 / §6 cambio requerido 1; §1 C9 | Integrado, corrige también error heredado de Claude001 | B-04/fila/contrato, R-B y matriz C9 usan `saveNoteAndNavigate:2990–3031` y patrón `handleCrossSellView:2973–2984`. `handleDrawerChange:2438–2457` se identifica como cambio de opciones/cantidad. Checkout nativo form POST, no helper; pruebas sucia/limpia/oculta, pending/destino, edición/fallos y mutaciones, último artículo/textarea ausente, con retorno R-D si excede conexión local. |
| C002-2 / §6 cambio requerido 2; §3 RC-07 | Integrado con resolución P1 condicionado de V3 | Se corrige la afirmación de ausencia de prioridad: GPT MASTER:189,244 sí asigna P1 condicionado; Claude MASTER conserva antecedente P3. V3 adopta P1 condicionado y mueve fila única C-08 a A; no adopta la propuesta P2 ni deja ratificación pendiente. Propagado a resumen, 0-04, dependencias, R-A/R-C/G3/R-G, secuencia, esfuerzo y matrices. |
| C002-3 / §6 cambio requerido 3; §3 metafields | Retiro autorizado por Johandry por chat 2026-10-30; Nivel 2 requiere autorización técnica previa y explícita de Gemini en R-D | No se dejan lectores inactivos: retirar catorce fuentes/consumos/fallbacks y heurísticas de dos snippets, inventario A-02 completo. Manual factual aprobado para todo contexto o vacío/oculto; no nuevos lectores/defaults ni datos/definiciones Shopify. Las siete pendientes son prohibición separada. Retiro no depende de esperar datos nuevos. |
| O1 / §6 opcional C-04-N | Aceptada con copy completo decidido | `listings/sartorial/templates/index.json:35` `settings.text`: `INDIVIDUALLY NUMBERED ATELIER EDITIONS` → `SARTORIAL`; 52 `eyebrow`: `ATELIER EDITIONS / 02` → `SARTORIAL / 02`. Antigravity tarea sencilla. No sustitución parcial ni renombre de motion_style, oficio, historia, dominios o SebastianDev017. |
| O2 / §6 opcional R-Demo; §4 observación | Aceptada | Dos subentregas contenido/funcional admisibles bajo mismo checkpoint y candidato; cierre agregado tras ambas, evidencia afectada repetida si cambia build. Siguen siete tipos de checkpoint. |
| O3 / §6 opcional referencias Claude001 | Aceptada | §1 y §11.1/11.3 citan por C1–C10 y O1–O6 como localizador principal, líneas solo secundarias. No se impone un conteo del renderizador como identidad de contenido. |

### 11.5 Trazabilidad de los tres P3 añadidos por Johandry

Se conservan P3. Las tareas siguientes se incorporan al plan y no se ejecutan en esta entrega. El explorador contrastó documentos y referencias de código sin red; entregó evidencia saneada, sin valores sensibles. La revisión pertinente de Claude es `CLAUDE-REVIEW-ANTIGRAVITY-AUDIT-001.md`; su maestra de origen es `GEMINI-AUDIT-MASTER-001.md`.

| Hallazgo P3 / fuente pertinente | Tarea / dueño / dependencia y esfuerzo | Criterio y revisión |
| --- | --- | --- |
| GEM-E-002, comentarios de marca obsoletos CSS. Claude:53,98; Gemini:105 | C-04-N-P3. Antigravity mecánico, GPT coordina alcance, Claude revisa. Base identificada y turno exclusivo; 15–30 min. ZIP v4 `assets/base.css:4145,9950`; checkout coordinación b45e913 `4145,9945`. | Diff únicamente de comentarios Couture/Edition; sin selector/token/ID/motion_style alterado. R-C contrasta referencia del build, copy C-04-N separado y límites de renombre. |
| GEM-G-004, lenguaje “Medición certificada en tienda real” en `docs/requirements-ledger.md:37`, asociado a cifras CLS y `docs/gate5-reports/gate5-empirical-report.md`. Claude:47,99; Gemini:117 | C-04-P3. Antigravity docs, Claude revisa. Inspeccionar artefacto/contexto histórico antes de reexpresar; 15–30 min. | “Medición registrada…” con metodología y limitaciones; fecha/tema/versión solo acreditados. Preservar cifras, evidencia, referencia y estados de filas; no llamarlo medición actual/certificación ni cerrar ledger. R-C/G3 comprueban redacción. |
| GEM-H-002 y GEM-G-001, identidad/destinos históricos y fallback literal sensible en ambos gate5. Claude:54,100; Gemini:106,200 | 0-05-P3. GPT técnico delegado a Sol, Antigravity ficha/config y Claude revisión. `scripts/gate5-live-verify.mjs:3–5,59,101,104`; `scripts/gate5-complete-verification.mjs:3–5,52,86`. 1–2 h parametrización; ejecución/medición real aparte. | Origen/preview ID/rutas colección-PDP explícitos y concordantes con candidato, validación antes de red, propagación preview, sin fallback histórico ni primer producto/fallback fijo como destino silencioso. Ambos scripts exigen `STOREFRONT_PASSWORD` por entorno y fallan antes de red si falta, sin fallback literal ni secreto en args/logs/archivos. Una causa raíz/ítem para ambos. Definir cuáles se reutilizan y para qué comprobaciones acreditadas; limpieza/revisión previas si producen nueva evidencia de compuerta 5/R-G u otras aplicables. No atribuir Lighthouse ni sustituir identidad real observada por configuración. Otro arnés válido evita elevar P3. |

### 11.6 Resolución individual de la instrucción V4

| Punto | Resolución y localización |
| --- | --- |
| M1 | Decisión de Johandry por chat 2026-10-30 para A-02 y C-04-N, fuente y fecha propagadas; no es orden ni autorización técnica: cabecera, §1, §1.2, §9, C3, C002-3 y copy. RC-07 procede de GPT MASTER. |
| M2 | Confirmación o repetición de D1 por Johandry, sin probar credenciales antiguas; CMP-01 y 0-01/R-0 resuelven linaje; 0-05-P3 posterior a confirmación y base. |
| M3 | Ruta `sections/product-recommendations.liquid` corregida en A-02. |
| M4 | A-02 Nivel 2, R-D y autorización técnica previa de Gemini; C-04-R y R-C exigen notas sobre retiro y carga manual. |
| M5 | GEM-H-002/GEM-G-001, GEM-G-004 y GEM-E-002 trazados a sus tres tareas y §11.5. |
| K1 | C-04-N usa `docs/merchant/support.html:254`. |
| K2 | Cuatro claves reales de Archive, PDP y home, claim `provenance_notes`. |
| K3 | Efectos de `circa_year` y `gsm` en A-02; R-A exige textil y no textil. |
| K4 | Cadenas conservadas enumeradas y Haute Couture provisional pendiente de Johandry en 0-04/§9; R-C no reabre diseño. |
| K5 | Cabecera: hallazgos extra sin parche. |
| K6 | Rangos exactos de funciones y comentario B-04, con revalidación por nombre. |
| CMP-01 | P1 de repositorio fuera ZIP: cuatro archivos, ocho refs, base reescrita/reconciliada, BOARD y comprobaciones seguras R-0. |
| CMP-02 | P3: cuatro SHAs reescritos y ambos scripts; una edición futura 0-05-P3, sintaxis y fail-closed antes de red; alternativa de arnés válido. |
| TT-56 | P3 diferido y opcional, independiente de E; si se pide, tarea C, R-D, paridad y editor ES, arnés condicionado a 0-05. |

Las exclusiones permanecen: GEM-B-001/GEM-B-002 refutados; el kit `listing.json`/`preview.png` no es requisito; TT-07, TT-08, TT-09, TT-20, TT-25, TT-31 y TT-107 pertenecen a Atelier; SUP-001–003 están cubiertos por G2 o no son verificables. No se trasladan a tareas nuevas ni se cambian las once filas existentes: TT-100, TT-02, TT-03, TT-04, TT-101, TT-104, TT-102, TT-103, TT-12, TT-17 y residuo GEM-G-001. TT-03 conserva P1, TT-04 P2 y TT-02 las prioridades de A-03. La matriz 71/71 y el veredicto «no apto» de Gemini no se usan como insumo.

## 12. Alcance de la verificación de esta V4

Esta entrega es exclusivamente documental. Se leyó completa V3 y la instrucción V4, junto con las revisiones Claude 003 y comparativa; sus datos de identificación y hashes provienen del contraste delegado y se conservan como tales. La auditoría comparativa Gemini se identifica y hashea sin incorporar su matriz ni su veredicto. Los hechos históricos y localizadores no se presentan como una auditoría nueva de código o tiendas.

El destino nuevo se creó exclusivamente con modo `x` (CreateNew); se editaron solo sus contenidos. No se ejecutaron arneses ni pruebas del tema, no se realizaron operaciones de red, tiendas, Git, rotación ni cambios de historia. V1, V2, V3 y revisiones son fuentes separadas que no se sobrescribieron. Una comprobación independiente posterior debe evaluar integridad y contradicciones; el tamaño y hash final se informan fuera de este archivo, evitando un hash circular.

La implementación requiere aprobación explícita de Johandry a V4 y cumplimiento de precondiciones, directivas y autorizaciones aplicables; A-02 además requiere autorización técnica previa y explícita de Gemini en su R-D conforme a RULES §3.5. Ninguna fila del ledger queda cerrada, ninguna aceptación técnica se presume y no se garantiza la aprobación futura de Shopify.
