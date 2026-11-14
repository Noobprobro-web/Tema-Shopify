ID: GPT-PLAN-IMPLEMENTACION-SARTORIAL-001
Versión: 2
Estado: Plan ajustado, pendiente de revisión y aprobación. Implementación no iniciada.
Decisión requerida: Johandry decide el alcance, el build y las dependencias de negocio pendientes; los roles ya fueron decididos por su instrucción. No se requiere volver a autorizarlos.
Resumen en 5 líneas:
1. GPT será el implementador principal y delegará cada tarea a subagentes; Antigravity coordinará, integrará y atenderá tareas sencillas; Claude revisará de forma independiente.
2. El Lote 0 exige una base reproducible que ya contenga los tres arreglos de footer, foco de galería y liberación del gesto de zoom.
3. El plan adelanta previews y preparación de suscripciones, mantiene B-02 como P1 condicionado y asigna trabajo concreto a los ocho P2 omitidos.
4. Las entregas pasan por siete checkpoints, con mediciones independientes de Claude y nueva evidencia por preset y build final.
5. Esta V2 sustituye al plan para revisión y conserva la V1; no inicia implementación ni autoriza commits, pushes, tiendas, compras de prueba o publicaciones.
Archivos tocados: agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v2.md (único archivo nuevo de esta entrega).
Desviaciones (Nivel 1 o Nivel 2): El reparto de funciones responde a la orden explícita más reciente de Johandry y prevalece para este encargo. Esta revisión documental no modifica AGENTS.md, RULES.md ni BOARD.md; Antigravity registrará la distribución antes de la implementación.
Hallazgos extra fuera de alcance (con parche listo): Ninguno. No se han generado hallazgos ni parches de código nuevos.
Verificación (comando, resultado y qué demuestra/qué no): Test-Path del destino devolvió False antes de crearlo; la escritura utiliza FileMode.CreateNew. Se leyeron completos V1 y las dos revisiones, se calcularon sus hashes y se hizo preflight Git de solo lectura. Esto demuestra trazabilidad documental y estado del checkout de coordinación; no demuestra funcionamiento, despliegue, cumplimiento de Shopify ni cierre de requisitos.
Lista de afirmaciones falsables numeradas:
1. La V1 y las revisiones permanecen como fuentes separadas y no han sido sobrescritas por esta entrega.
2. Los diez cambios obligatorios de Claude, los ajustes de GPT y las seis sugerencias opcionales reciben una decisión explícita en las matrices de esta V2.
3. Cada trabajo planificado tiene responsable, dependencia, esfuerzo orientativo y criterio de aceptación; los ocho P2 omitidos no quedan como lista flotante.
4. El plan exige los tres arreglos en la base y su regresión en el candidato final, sin congelar para siempre hashes de assets históricos.
5. Ninguna fila del ledger queda cerrada por este documento y ninguna observación histórica se convierte aquí en una comprobación actual de tienda.

# Plan de implementación de mejoras de Sartorial — V2

Fecha: 2026-10-29. Destinatarios: Johandry, GPT implementador, Antigravity y Claude revisor. ID estable: `GPT-PLAN-IMPLEMENTACION-SARTORIAL-001`.

## 1. Alcance, fuentes y límites

Este es un reemplazo completo de planificación, legible sin consultar la V1. Organiza trabajo futuro sobre Sartorial, Imprint y Archive. La implementación comenzará con la orden de Johandry y directivas de alcance cerrado, después de satisfacer sus dependencias. Este documento no es una directiva de implementación ni una aceptación técnica.

Quedan fuera los hallazgos de Atelier/Contour y Cucuyo: no se trasladan sus defectos a Sartorial. Atelier sirve como referencia de producto; no se copiará su código ni el de Cucuyo. La vigencia de la instantánea de Cucuyo sigue sin confirmarse. No se asume que Archive carezca de PDP diferenciada: las propuestas del Lote E deben partir de las diferencias efectivamente observadas y de tareas del comerciante.

Fuentes conservadas:

| Fuente | Uso y límite |
| --- | --- |
| `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001.md`, 177 líneas, 18.806 bytes | Plan V1; antecedente conservado, sustituido para revisión por esta V2. |
| `C:\Users\Johan\.codex\attachments\9f6b713c-e2b8-4129-9dd7-caeedf94f10b\Texto pegado.txt`, 95 líneas, 7.065 bytes | Devolución GPT: prioridades, suscripciones, foco, demos, promesas, delegación y alcance E. |
| `agent-comms/outbox-claude/CLAUDE-REVIEW-PLAN-SARTORIAL-001.md`, 190 líneas, 25.971 bytes | Diez correcciones obligatorias (líneas 166–175), seis opcionales (179–184), causas y estimaciones contrastadas por el revisor. |
| `GPT-AUDIT-THREE-THEMES-MASTER-001.md` y `GPT-AUDIT-THREE-THEMES-VISUAL-001.md`, en `agent-comms/outbox-gpt/` | Auditoría y anexo visual de origen, incluidas sus erratas; no se reauditan en esta entrega. |
| `CLAUDE-AUDIT-THREE-THEMES-MASTER-001.md` y `CLAUDE-AUDIT-THREE-THEMES-LIVE-001.md`, en `agent-comms/outbox-claude/` | Auditoría y anexo en vivo de origen; sus observaciones siguen fechadas, no son una nueva prueba de tienda. |
| `AGENTS.md`, `agent-comms/BOARD.md` y `agent-comms/RULES.md` | Gobierno, estado comunicado y formato de entregas. BOARD conserva antecedentes que deben reconciliarse, no sustituye una medición actual. |
| Contrastes técnicos delegados de esta revisión documental, recibidos el 29-oct | Acotan rutas, mecanismos, checkout y ZIP citados en §3–§5. No equivalen a ejecutar los futuros arneses o abrir las tiendas. |

Los anexos y erratas prevalecen sobre formulaciones antiguas de las maestras cuando corrigen la evidencia. La consolidación no confirmó P0. Los P1 condicionados siguen condicionados a reproducir el mecanismo y evaluar su impacto en el build elegido; no se convierten en fallos comerciales probados.

Las siete definiciones de metafields pendientes no se crearán ni se utilizarán, aunque una definición o valor exista actualmente. La existencia de un metafield no acredita aprobación. Solo podrán emplearse fuentes de datos ya aprobadas por Johandry y verificadas para el producto y contexto correspondientes.

### 1.1 Trazabilidad de fuentes

Hashes SHA-256 obtenidos con `Get-FileHash -Algorithm SHA256`, sin alterar las fuentes:

| Fuente | SHA-256 |
| --- | --- |
| V1 | `d6942f9a5d5513a334e6a688bf3625da83c5a99330097e971be316995cedcb66` |
| Revisión GPT adjunta | `211be070fc2690717b7356a665e009743366e5ee9d8b03ab090239d0dd536d15` |
| Revisión Claude | `09ca73fe38d4fc992e75f05dcaec833b4f54485102200cf31f4c2339bb3e63e4` |

Estos hashes identifican documentos, no el tema publicado. Las referencias de código siguientes son localizadores contrastados para esta revisión; cada directiva volverá a comprobarlas en su propia base con función/selector además del número de línea.

## 2. Responsabilidades y disciplina de ejecución

| Participante | Responsabilidad |
| --- | --- |
| Johandry | Decide alcance, políticas, datos, contenido, activos, versión y candidato de envío. Autoriza explícitamente las escrituras en tiendas, apps/fixtures, compras o mutaciones de carrito de prueba, commits, pushes y publicaciones cuando correspondan. |
| GPT | Implementador principal y coordinador de sus subagentes. Delega cada tarea principal; identifica causa, acota archivos, integra las entregas y responde por informe, diff y verificación técnica. Atiende adaptaciones no triviales y cambios transversales. |
| Antigravity | Coordina tablero, directivas, identidad, turnos, dependencias, ramas/worktrees e integraciones. Ejecuta cambios sencillos y configuración con alcance cerrado. Coordina entornos, catálogo, previews y paquete con las autorizaciones correspondientes. |
| Claude | Revisor independiente de GPT y Antigravity. Abre el código y paquete del build identificado, ejecuta verificaciones y mediciones independientes, intenta falsar cada afirmación y emite aceptar/devolver/escalar. No acepta una entrega solo releyendo el informe del autor. |

La orden de Johandry ya decide estos roles. Su registro posterior en la gobernanza es una acción de coordinación de Antigravity; no exige volver a pedir a Johandry que los elija. Esta V2 no cambia físicamente los documentos de gobierno.

Cada asignación a subagente indicará modelo disponible, objetivo verificable, alcance, archivos de propiedad exclusiva, dependencias, criterios de entrega y límites. Para este encargo documental se usa exclusivamente GPT-6.1 Sol con esfuerzo ultra. En las futuras asignaciones se respetará la instrucción de modelos vigente de Johandry; mientras no la cambie, GPT mantendrá GPT-6.1 Sol ultra donde el entorno permita seleccionarlo. Si no está disponible, se comunicará la limitación sin simular su uso.

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

El preflight de solo lectura de esta revisión documental devolvió:

    git status --short --branch
    ## sprint/F0
    [archivos de informes y arneses previos sin seguimiento; sin entradas de cambios rastreados]

    git rev-parse HEAD
    b45e913111e333b9a0e82938266189fc76c87057

El checkout de coordinación es `C:\Users\Johan\Documents\Drive\Tema Shopify`. No debe sustituirse silenciosamente por el worktree histórico de auditoría `Tema-Shopify-codex`, asociado en informes a `09f834295074402d9b93aa8ead83a732d78e6608` y no revalidado ahora. La referencia `fc849d5` de la revisión de Gemini corresponde a otro contexto; no prueba que ninguno de estos árboles sea el mismo.

El ZIP integrado revalidado en el contraste delegado tiene:

| Campo | Evidencia |
| --- | --- |
| Ruta relativa | `agent-comms/outbox-gpt/harness-GPT-PACKAGE-INTEGRATED-001-v4/isolated-theme/Sartorial-1.0.0.zip` |
| Tamaño / entradas | 347.818 bytes / 107 entradas |
| SHA-256 | `092242fba56513b7f491821f5fbd86c5933a8550c33ae541f0ffb5df801410e3` |
| Alcance | Identidad y contenido estático del paquete; no prueba cuál es la tienda actual ni su comportamiento. |

Johandry decide el build de trabajo y el de envío. Puede partirse de un árbol que incorpore los arreglos o de una reconstrucción reproducible del ZIP aprobado, conservando su procedencia. No se fija obligatoriamente `09f8342` ni se mezclan assets de árboles distintos sin diff y manifest. Si se requiere commit para consolidar, Antigravity lo realizará únicamente con autorización explícita de Johandry; no se considera autorizado por aceptar este plan.

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
| 0-01 / planificado, bloquea A | Antigravity; GPT si integración no trivial; Claude revisa | Reconciliar checkout, BOARD, directivas y trabajos abiertos; elegir con Johandry base; consolidar los tres arreglos; fijar SHA completo, árbol, manifest/hashes, diff y paquete reproducibles. | 0,5–1 d de identidad y reconciliación; adaptación no trivial se reestima tras inspección. | Ficha única con rama/HEAD, estado rastreado y no rastreado, origen de cada cambio, comandos de reconstrucción, hashes, diff y relación árbol–ZIP. R-0 acepta o bloquea. No se presupone que el ZIP sea regenerable hasta demostrarlo. |
| 0-02 / planificado, bloquea R-A, G1 y G2 por preset | Antigravity | Inventariar primero los previews existentes y acreditar o preparar previews reales de Imprint y Archive. Cualquier creación, carga o cambio en tienda requiere autorización explícita. | 0,5–1 d de preparación técnica si hay acceso; espera de autorización/acceso externa sin fecha inventada. | Ficha por tienda/preset con URL sin credenciales, ID de tema, nombre visible, configuración/plantillas y relación con el build. Fondos y controles reales disponibles para A-03 y evaluación empírica de TT-06/TT-17. No asumir ausencia actual porque un informe antiguo no los acreditara. |
| 0-03 / planificado, bloquea cierre A-01 | Antigravity prepara; GPT define matriz; Johandry autoriza app/fixtures | Inventariar estado actual del catálogo y app de suscripción. Preparar compra única, plan opcional y plan obligatorio solo tras autorización. | Inventario y configuración estimados dentro del 0,5 d de entorno de A-01; no sumarlos dos veces. App, acceso y aprobación son dependencias externas. | Producto con grupos de planes y variante `requires_selling_plan` realmente acreditados, además de producto de compra única/opcional. Los informes históricos no prueban inexistencia actual. Sin app/fixtures adecuados, el cierre en tienda queda bloqueado, aunque se pueda hacer prueba sintética etiquetada. |
| 0-04 / planificado, decisión previa a directivas afectadas | Johandry decide; Antigravity obtiene y registra; GPT acota impacto | Política de datos A-02, promesas RC-07, versión, nomenclatura y contenido/activos. | 0,25–0,5 d de inventario y preparación de decisiones; plazos de aprobación/producción externos por confirmar. | Decisiones verificables con fuente aprobada, contexto de uso, tratamiento de ausencias y destinos. No convertir un dato ausente en una afirmación comercial. |
| 0-05 / planificado | GPT inventaría; Antigravity facilita entornos; Claude valida uso independiente | Inventariar acceso, runtimes y arneses antes de prometer reutilización: `tt02.js`, `g20_g23.js`, `s2`, `p3`, `s8`, Lighthouse y axe. | 0,25–0,5 d; se reestima si hay que reconstruir una herramienta autorizada. | Ruta real, versión, dependencias, build objetivo, límites y disponibilidad por revisor. No presumir VM, `$HOME/livetest`, sesiones ni artefactos. Un arnés ausente se sustituye solo con alcance/tiempo explícitos. |

Los nombres e IDs de preview históricos sugeridos por Claude —189832593651 main, 189707452659 submission, 188743188704 y 188655599784— son pistas para inventario, no identidades actuales confirmadas. Un nombre de LINEA NOVE que incluya `09f8342` no acredita el SHA desplegado. No se retiran contraseñas ni se cambian publicaciones para probar.

## 4. Lotes y criterios de aceptación

Los esfuerzos son jornadas de una persona, orientativos y revisables tras R-D. No representan un calendario comprometido. Cada directiva fijará lista cerrada de archivos y filas reales del ledger, sin inventar números de fila. Se separan tiempo técnico, pruebas, configuración y esperas externas. Los trabajos nuevos de la V2 no se absorben gratuitamente en estimaciones antiguas.

Los estados de esta planificación son `planificado`, `condicionado`, `bloqueado por dependencia` o `diferido con motivo`; no son estados del ledger. El ledger solo admite `cumplido`, `código completo`, `no verificado` y `ausente`. Ninguna fila cambia hoy.

### 4.1 Lote A — Compra, datos y foco

Depende de 0-01 y R-0 aceptados, R-D por directiva y decisiones de datos antes de A-02. Los previews de 0-02 y el entorno de 0-03 deben estar listos antes de R-A. GPT delega las tareas técnicas; Claude revisa; Antigravity coordina.

| ID / hallazgos / prioridad / estado | Dueño y superficies candidatas | Dependencia / esfuerzo | Criterio de aceptación |
| --- | --- | --- | --- |
| A-01 / RC-02, TT-100 / P1 condicionado / planificado | GPT. `sections/main-product.liquid`, `sections/featured-product.liquid` y `assets/theme.js`. | Base y entorno 0-03 autorizados. Código pequeño: reestimar en R-D en lugar de mantener 1–2 d indiferenciados; más 0,5 d configuración y 0,5 d pruebas de app autorizada. | Ambas superficies, JS/no-JS, transiciones y payload completo según matriz A-01 siguiente. Controles exitosos sin valores residuales o contradictorios. El caso C confirmado en fixture es evidencia acotada, no fallo actual de tienda. |
| A-02 / RC-03, TT-03, S-03 y raíz de V-05 / P1 / planificado | GPT. `snippets/product-technical-specs.liquid`, `snippets/product-provenance.liquid`, bloques/configuración relacionados solo si la directiva los permite. | Política de datos de Johandry resuelta antes de emitir directiva; ~1 d si lo está. | Eliminar inferencias de handle, título y `product.type`; no presentar tipo de producto como material. Cada dato mostrado tiene fuente ya aprobada y producto/contexto verificados; ausencia produce ocultación o texto neutro aprobado. Sin uso ni creación de las siete definiciones pendientes, incluso si existen. |
| A-03 / RC-04, TT-02 / Imprint P1 condicionado, Archive P2 / planificado juntos | GPT. `assets/base.css`; el disparador es `motion_style`, no un cambio de schemas. | Previews reales 0-02 antes de cierre; 0,5–1 d. | Matriz de foco por estilo/control/estado/fondo/esquema y preferencia de movimiento, según detalle siguiente. Sartorial conserva funcionamiento; Imprint y Archive mantienen prioridades distintas aunque se ejecuten juntos. |
| B-02 / RC-01, TT-101, S-01 / P1 condicionado / planificado en A | GPT. Formularios de PDP y featured product; `assets/theme.js` si procede tras preflight. | Misma base y turno coordinado con A-01; 0,5–1 d. | JS desactivado o fallido: cargar variante A, elegir B y comprobar que el payload envía ID de B; también URL de variante, disponibles y agotadas en ambas superficies. No mostrar B y enviar A. Línea real de carrito únicamente con autorización. R-B repetirá regresión, sin duplicar la tarea. |

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

#### A-02 — Política y productos de prueba

Johandry decidirá si los defaults de bloque `material`, `gsm`, `hardware` y `origin` se vacían, se mantienen para un contexto comercial concreto verificado o se presentan como ejemplo claramente identificado fuera del dato de producto. Por ser compartidos por plantilla, no acreditan una propiedad de cada producto. Propuesta de seguridad editorial para su decisión: ocultar el atributo sin fuente específica aprobada, o emplear únicamente un texto neutro aprobado; no implementar esa elección antes de resolver la política.

Las lecturas existentes de `custom.*` no son permiso para crear definiciones ni para usar datos pendientes. Se conserva solo el mecanismo y la fuente ya aprobados y verificados. La rama `product.type` de `product-technical-specs.liquid:55–56` pertenece al alcance explícito. También se revisan inferencias de material/hardware por handle y época por título en procedencia.

`leather-desk-mat`, `folded-valet-tray` y `milled-brass-paperweight` son candidatos históricos a revalidar en el entorno elegido, no productos actuales garantizados. No deben mostrar el tipo como material, “Solid milled brass” o una época salvo respaldo del dato aprobado correspondiente. Se prueban nombres ambiguos, datos faltantes y productos genéricos. A-02 y D-01-V resuelven partes de una misma raíz V-05, sin contabilizar dos defectos.

#### A-03 — Causa y matriz de foco

El atributo `data-motion-style` se emite en `layout/theme.liquid:3`. Los presets informados usan Sartorial `atelier`, Imprint `technical` y Archive `heritage` en `config/settings_data.json:157,234,311`. La regla base `:focus-visible` de `assets/base.css:283–285` usa foreground. Dentro del bloque `prefers-reduced-motion: no-preference` que comienza en la línea 9058, technical fija `#2b2b2b` (9102–9107) y heritage `#b5885c` (9126–9131). Esa es la familia causal que se corrige, con una solución CSS propia basada en los tokens efectivos o un anillo verificable; no se cambia schema para resolverla.

La prueba conserva una fila por preset/`motion_style`, control y estado, esquema efectivo, fondo sólido o imagen efectiva, `reduce`/`no-preference`, método, criterio aplicable, medida y captura. Recorre teclado y controles de header, contenido y footer; incluye expresamente footer `scheme-2`. No atribuir al header el esquema de announcement bar. Se usa `tt02.js` solo si 0-05 acredita el arnés y siempre como evidencia sintética previa; cierre con controles reales y medición independiente de Claude en previews acreditados. Un cálculo de contraste o cero avisos de axe no son certificación integral de accesibilidad.

### 4.2 Lote B — Navegación y resiliencia de compra

Depende de R-A aceptado y directivas R-D. B-02 se ejecutó en A por su P1 condicionado; aquí solo se regresa.

| ID / hallazgos / prioridad / estado | Dueño / archivos candidatos | Dependencia / esfuerzo | Criterio de aceptación |
| --- | --- | --- | --- |
| B-01 / RC-10, TT-104, G-20 / P2 / planificado | GPT. `ThemeDrawer` en `assets/theme.js` y responsive de `assets/base.css`. | A estabilizado; 0,5–1 d. | Abrir a 390 px, cruzar a 1280 px y volver; orientación; restaurar scroll, `inert`, foco y estados sin depender de Escape. Usar una fuente coherente del breakpoint, preferiblemente contrato data/CSS existente verificado, sin duplicar 62rem a ciegas. Probar `g20_g23.js` si está disponible y resize real. |
| B-03 / RC-12, TT-102, S-07 / P2 / planificado | GPT. Comercio/reconciliación en `assets/theme.js` y locales realmente afectados. | Inventario de flujo existente; 1–2 d. | POST aceptado con respuesta perdida: reconciliar carrito antes de invitar a reintentar, conservar cantidades y no duplicar adición. Arnés de red etiquetado sintético, más prueba autorizada del flujo real. El riesgo es duplicar artículos, no un doble cobro demostrado. |
| B-04 / RC-11, TT-103, S-06 / P2 / planificado | GPT; Antigravity puede ejecutar si R-D confirma parche local equivalente. `sections/cart-drawer.liquid:366–368` y `CartDrawer` en `assets/theme.js:2358–2368,2438–2457`. | Lógica de notas/mutaciones inventariada; ~0,25 d de parche más regresión ajustada al alcance. | Guardar nota antes de View cart y Checkout, reutilizando la ruta de guardado de Checkout y su tratamiento de error. Probar nota sucia, navegación y carreras con cantidad/eliminar/add/reconciliación; no perder la última edición ni abandonar con una promesa de guardado falsa. |
| B-05 / LV-01 / P2 / planificado | Antigravity si es local; GPT si aparece alcance transversal. `snippets/localization-selectors.liquid` y claves locales permitidas. | R-D de alcance cerrado; 0,25–0,5 d. | Nombre accesible que incluya el texto visible “ES”; comprobar header a 1280 y footer a 390, teclado y axe `label-content-name-mismatch` ejecutado por Claude. |

En B-04 el enlace está en la sección, no en `snippets/cart-drawer.liquid`: esa ruta antigua era errónea. El manejador global `handleDocumentClick` excluye enlaces contenidos en el drawer; el cambio se ubica en la ruta interna adecuada y reutiliza el guardado existente en lugar de añadir una segunda política. R-B incluye regresión sin JS de B-02 en PDP y featured, payload y stock; línea de carrito solo si se autorizó esa mutación.

### 4.3 Lote C — Colecciones, instalación, documentación y superficie del comerciante

Depende de compra/navegación estabilizadas. Las investigaciones de solo lectura pueden adelantarse, manteniendo directivas y turnos.

| ID / hallazgos / prioridad / estado | Dueño / alcance | Dependencia / esfuerzo | Criterio de aceptación |
| --- | --- | --- | --- |
| C-01 / V-02 / P2 / planificado | GPT. Jerarquía de sección y controles de colección móvil; rutas cerradas en R-D. | Baseline de viewport útil; 1–2 d. | Aplicar/limpiar filtros, teclado y vacío como regresión del cambio de jerarquía; comparar posición de primera tarjeta con el mismo viewport útil, sin atribuir conversión no medida. TT-26 pertenece a Atelier/Contour y queda fuera del alcance Sartorial; no se introduce un defecto AJAX de Sartorial sin evidencia propia. |
| C-02 / TT-13, D-01 de auditoría GPT / P2 / planificado | Antigravity coordina configuración e instalación; GPT corrige código/packaging no trivial. `templates/` y `listings/*/templates/` según lista cerrada. | Decidir resultado canónico por preset; 1–2 d más instalación y comprobación. | Subir el ZIP a una tienda de desarrollo limpia autorizada; comprobar qué instala Shopify antes de existir una instalación desde Theme Store. Comparar raíz/listing por Sartorial, Imprint y Archive y documentar diferencias deseadas sin trasladar contenido de vendedor indebido. |
| C-03 / TT-12, G-40 / P2 condicionado / condicionado | GPT. Perfilado y, solo si se activa, carga/partición de CSS/JS según diagnóstico. | G2 por preset o remedición del build final falla el umbral acordado y vigente; diagnóstico causal; 2–4 d solo para intervención activada, reestimables por alcance. | Comparación reproducible antes/después, regresión por superficie/preset y sin tocar módulos aprobados ajenos. Si G2 cumple, diferir documentadamente a después del envío. No se atribuye carga de `theme.js` a gift-card: esa atribución fue corregida. |
| C-04 / TT-05, TT-18 y documentación pública / P1 condicionado de soporte o P2 según raíz / planificado | Antigravity, con apoyo GPT si se requiere código/packaging; Claude revisa. Docs internas y web/soporte que Johandry autorice. | Titularidad, URLs, instrucciones y claims aprobados; 1–2 d internos; web pública y soporte externo por estimar. | Canales reales, documentación accesible/veraz, claims sustentados y destinos correctos. No asumir control de buzón/dominio ni enviar mensajes de prueba sin autorización. |
| C-04-P / TT-14 parte ZIP / P2 / planificado | Antigravity propone retener/corregir/retirar; GPT ejecuta cambios no triviales del paquete. `templates/page.documentation.json`, `templates/page.support.json` y equivalentes reales incluidos. | Decisión explícita de destino del contenido vendedor antes de escribir; 0,5–1 d de inventario/decisión técnica, más cambio si su alcance lo exige. | Inspección del ZIP final: decidir si cada plantilla es utilizable por el comerciante o debe retirarse. Corregir o retirar el claim “Each preset changes theme settings only” con comportamiento probado. No cerrar esto solo corrigiendo la web pública. |
| C-04-N / LV-27 + TT-04 / P2 / planificado | Antigravity, GPT si hay impacto técnico transversal. Temas/tiendas/previews, docs públicas y configuración actual. | Johandry confirma nomenclatura y permisos; 0,5–1 d interno más dependencias web/tienda por estimar. | Identidad comercial Sartorial/Imprint/Archive coherente en las superficies actuales aprobadas. `docs/merchant/docs.html:204` y `docs/merchant/support.html:254–255` contienen Edition en el contraste delegado; los cuatro paths de docs inspeccionados dentro del ZIP no tenían Edition/Atelier. No sustituir masivamente menciones históricas en decisions/ledger, ni renombrar dominios como efecto secundario. |
| C-04-R / G4 / bloqueo de envío / planificado | Antigravity redacta notas y configura versión; GPT adapta packaging si hace falta; Claude revisa el ZIP. | Johandry decide número de versión y política de notas; 0,25–0,5 d de contenido/configuración, packaging adicional reestimable. | `release-notes.md` en raíz del ZIP final; versión coherente en metadata/paquete/notas y cambios reales trazables. Verificar presencia dentro del ZIP, no solo en el repo. |
| C-05 / TT-15 / P2 / planificado | GPT. Siete secciones `main-page`, `main-documentation`, `main-support`, `main-about`, `main-policy`, `main-faq` y `main-contact`. | Inspeccionar schemas/usos válidos y contratos antes de proponer restricción; 0,5–1 d adicional V2. | Revisar presets sin `enabled_on` y H1; permitir solo contextos válidos sin romper plantillas legítimas. Probar editor e instalación: no generar duplicación accidental de H1 por sección principal añadida en contexto indebido. No aplicar mecánicamente una restricción sin comprobar usos. |
| C-06 / TT-19 / P2 de verificación / planificado | Antigravity reproduce `<shopify-account>` en `sections/header.liquid`; GPT interviene si el cambio no es sencillo. | Entorno/cuentas acreditados; 0,25–0,5 d de verificación, arreglo solo tras diagnóstico y nueva estimación. | Verificar si el objeto `link_list` sin `.handle` causa fallo real. Documentar reproducido/no reproducible y límites, con contrato real del componente. No presentar la hipótesis como fallo probado ni cerrar sin prueba. |
| C-07 / TT-51 / P2 parcial / planificado | GPT. `sections/main-product.liquid:722–779`, loop 724; `sections/featured-product.liquid:482–484`; consumidor en `assets/theme.js:614–690`. | Fixtures autorizados y estrategia oficial vigente comprobada antes de solución; 0,5–1 d investigación/prueba, implementación se reestima en R-D. | Probar 1, 250 y 251+ variantes en PDP y featured. Determinar límites y una estrategia completa; no truncar arbitrariamente JSON o selección. Conservar guards de cards `>250`; en complete-the-look, `>250` cuando existe `variants_count` y fallback conservador `>=250` solo cuando falta ese conteo; recommendations `>100`. No introducir regresión con exactamente 250 variantes; bundle/cross-sell no pierden sus guardas. |
| C-08 / RC-07 / P2 propuesto por planificación / planificado, pendiente de ratificar triage | GPT inventaría código/configuración y propone tratamiento; Antigravity recopila políticas/contenido; Johandry decide. | Políticas y promesas aprobadas antes de directiva; 0,5–1 d inventario/reconciliación, cambio reestimable. | Inventario de cada promesa de devoluciones, fabricación y servicio: procedencia código/config/contenido, respaldo de Johandry, valor ausente/vacío y destino instalado. Resolver fallbacks y textos sin inventar políticas. No se ha probado que las políticas actuales de tienda sean falsas. |

La revisión GPT no asigna prioridad a RC-07. Esta V2 propone P2 por el impacto comercial potencial y porque requiere reconciliación explícita sin fallo actual de política demostrado. Johandry y el triage técnico deberán ratificarla antes de la directiva; no se atribuye ese P2 al auditor.

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

La captura nueva prueba el estado nuevo observado; no reconstruye las capturas históricas que no quedaron archivadas. Se distingue producto comercial de fixture de prueba. Una etiqueta de preview o el nombre de la tienda no prueban identidad técnica por sí solos. Toda publicación, cambio de protección o mutación de datos de tienda tiene autorización separada.

### 4.5 Lote E — Diferenciación del editor

| ID / hallazgos / estado | Dueño | Dependencia / esfuerzo | Criterio |
| --- | --- | --- | --- |
| E-01 / TT-06, TT-16, TT-17 / diferido con motivo, fuera del camino de envío | Antigravity coordina propuesta; GPT delega análisis e implementación aprobada; Claude revisa. | Demos acreditadas, evaluación empírica de diferencias y tareas concretas del comerciante, diseño/compatibilidad y alcance aprobados. 5–10 d solo después de diseño aprobado; reestimar alcance. | Capacidades útiles comprobadas por preset en instalación, editor, móvil y estados límite. Sin número obligatorio de headers/tarjetas/settings ni copia de código ajeno. |

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
| R-0 / cierre de base, antes de A | Claude. Ficha 0-01: base reproducible, árbol/hashes, tres arreglos y pruebas dirigidas, vínculo ZIP; inventario de previews y dependencias con dueño. Si hubo integración, diff y entrega; si no hubo cambios, evidencia de identidad/presencia sin inventar entrega de implementación. | Aceptar base o devolver/escalar. Sin los tres arreglos identificados y reproducibles no se abre A. Una dependencia de preview/app aún abierta bloquea el cierre de A correspondiente, no se borra de la ficha. |
| R-D / antes de cada directiva, incluido Lote 0 | Claude. Contrato prospectivo: base/preflight, borrador de alcance y archivos permitidos, criterios y pruebas propuestos, dependencias/autorizaciones, ledger actual y esfuerzo. Revisar ramas, names/IDs/formularios, aria y Nivel 2. | Directiva apta para emitir, devolución o escalamiento; no exige artefactos finales futuros. No comienza escritura dependiente si faltan decisiones, permisos o contratos necesarios. |
| R-A / después de A, incluido B-02 | Claude ejecuta pruebas independientes de FormData/payload y transiciones de planes, datos y fuentes, variantes sin JS y foco en previews acreditados. Usa arneses inventariados como apoyo y Theme Check según alcance. | Aceptar solo lo probado; no pasar a B con defectos devueltos en compra/foco/datos. Sin app/fixtures o demos reales, los requisitos empíricos permanecen pendientes; no cerrar por fixture o cálculo. |
| R-B / después de B | Claude. Resize real y arnés de menú disponible, red/respuesta perdida, nota y carreras, label accesible/axe a 390 y 1280, regresión no-JS de B-02. | Aceptar/devolver/escalar con evidencia nueva; compra y navegación no estabilizadas bloquean consolidación de C. Mutación real de carrito requiere autorización. |
| R-C / después de C y paquete de instalación | Claude. ZIP instalado en tienda limpia autorizada por preset, raíz/listings, docs públicas y dentro del ZIP, versión/notas, resultados C-05/C-06/C-07/C-08; C-03 solo si activado. | Aceptar instalación/paquete o devolver/escalar. Docs de vendedor o versión/notes incoherentes bloquean paquete; fallo G2 no resuelto activa diagnóstico, no partición automática. |
| R-Demo / cierre de todo D: D-01 y subítems, D-02-Q/A/T y D-03 | Claude. Matriz nueva Home/PLP/PDP × móvil/escritorio por preset e identidad/capturas; además, pruebas independientes de cantidad min2/paso2/actual4/max5, mensajes stock/plan y anuncio, tallas ejemplo/reales y UI/pulido. Regresión posterior a D de A-01/B-02 y contratos de carrito afectados, sobre el mismo candidato de R-G. | Aceptar todo el alcance D probado o devolver/escalar; defectos funcionales o regresión pendiente/fallida bloquean R-G, y contenido/identidad/activos pendientes bloquean G1. No aceptar D-02/D-03 con capturas solamente ni reutilizar captura vieja como prueba nueva. |
| R-G / candidato congelado, antes de envío | Claude mide independientemente Lighthouse, axe y teclado por preset sobre build final; comprueba la regresión funcional independiente posterior a D exigida en R-Demo sobre ese mismo candidato. Antigravity entrega hashes/ZIP congelados, G1–G4 y regresión de los tres arreglos; GPT apoya diagnóstico. | Dictamen de preparación, sin garantizar aceptación Shopify. Sin regresión funcional posterior a D no se acepta el cierre. Cualquier cambio posterior invalida la evidencia de su superficie y exige regresión/medición pertinente. Johandry decide el envío; sin su acción autorizada no se publica ni envía. |

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
| G2 / medición por preset y build final | Claude es dueño de medición independiente; Antigravity estabiliza entornos; GPT apoya diagnóstico. Depende de previews reales y build consolidado. Esfuerzo: estimar tras 0-05 según matriz y herramientas; no se oculta dentro de C-03. | Lighthouse Home/PDP/PLP × móvil/escritorio × preset, con repeticiones/metodología, versiones, fecha, URLs e identidad; axe y recorrido manual de teclado/foco/controles. Acordar en R-D umbrales y requisitos oficiales vigentes antes de medir. Conservar resultados nuevos tras consolidación. Si falla, diagnóstico y propuesta C-03; si cumple, C-03 diferido. |
| G3 / listing, documentación y soporte | Antigravity, con Claude revisor; Johandry confirma canales, claims y titularidad. Depende de C-04, C-04-P/N y activos reales. | Capturas del build real, contenido utilizable/veraz dentro y fuera del ZIP, destinos correctos y soporte confirmado. Web pública y buzón son dependencias externas, sin fecha inventada ni mensajes enviados por este plan. |
| G4 / versión, notas y paquete | Antigravity; GPT si se requiere packaging; Claude inspecciona ZIP. Johandry decide versión y candidato. Depende de C-04-R y resto de gates. | `release-notes.md` en raíz del ZIP, versión coherente, manifest/hash final, relación árbol–paquete–entornos probada y regresión final de los tres arreglos. No exigir los hashes antiguos tras cambios legítimos; registrar nuevos y diff. |

La medición final vuelve a ejecutarse después de consolidar todas las correcciones, aunque existan resultados anteriores. Una descarga o captura de hoy demuestra solo el estado observado hoy, no recompone despliegues históricos. Ninguna puntuación garantiza aprobación de Shopify; cero violaciones de axe no certifica WCAG.

## 8. Orden operativo y esfuerzo

Secuencia prevista:

1. Aprobar planificación y resolver decisiones que desbloquean la primera directiva; registrar roles ya ordenados.
2. R-D prospectivo de cada directiva de preparación, incluido Lote 0, con base/preflight y trabajo/pruebas propuestos → emitir directiva apta → Lote 0/base reproducible con tres arreglos → R-0 retrospectivo. Inventariar entornos/arneses y preparar previews/app/activos temprano con sus autorizaciones; no exigir en R-D entregas finales aún inexistentes.
3. R-D de A → A-01, A-02, A-03 y B-02 en turnos secuenciales → R-A. Imprint/Archive y planes deben existir/acreditarse antes de cerrar las pruebas que dependen de ellos.
4. R-D de B → B-01/B-03/B-04/B-05 → R-B, incluida regresión de B-02.
5. R-D de cada tarea C → C con instalación, docs, ocho P2 según su entrega y promesas → R-C. Medir G2 temprano por preset y de nuevo al final; activar C-03 solo por fallo y diagnóstico.
6. D puede preparar contenido/activos desde el inicio, con R-D previo a sus directivas, escrituras autorizadas y entornos de prueba congelados. Completar D-01 y subítems, D-02-Q/A/T y D-03; identificar y congelar candidato → R-Demo funcional y de demos, con regresión independiente posterior a D de A-01/B-02 y contratos de carrito afectados.
7. Mantener ese mismo candidato congelado → R-G con G1–G4, evidencia de la regresión funcional posterior a D, métricas nuevas y tres arreglos → decisión de Johandry sobre envío. E permanece diferido salvo evidencia o decisión expresa.

Las estimaciones revisadas conservan A-02 ~1 d con política resuelta; A-03/B-01 0,5–1 d; B-02 0,5–1 d; B-03 1–2 d; B-04 ~0,25 d de parche más regresión; B-05 0,25–0,5 d; C-01/C-02 1–2 d y C-02 instalación aparte; C-03 2–4 d solo activado; docs 1–2 d internos más web/soporte por estimar; D-01 2–4 d configuración más producción/aprobación de activos; E 5–10 d tras diseño aprobado.

No se suman estas bandas en un total aparente: faltan decisiones, costos externos y reestimaciones de investigación, y algunas actividades se solapan. Los ocho P2 añadidos tienen esfuerzo propio en sus filas; no se dan por incluidos gratis. La medición independiente de Claude y las regresiones se planifican tras inventariar herramientas y alcance. Las fechas de app, activos, soporte, acceso y aprobaciones las confirman sus responsables externos.

## 9. Decisiones pendientes y bloqueos

| Decisión / acción pendiente | Autoridad / responsable de preparar | Bloquea |
| --- | --- | --- |
| Alcance de implementación y build de base/envío; forma de consolidar los tres arreglos | Johandry / Antigravity, GPT si integración compleja | 0-01, R-0 y apertura de A. No se presume autorización de commit. |
| Autorización de crear/cargar/cambiar previews Imprint/Archive y acceso seguro | Johandry / Antigravity | Cierre A-03, evaluación empírica E, G1/G2. Inventario actual primero. |
| App/fixtures de compra única/opcional/obligatoria y alcance de pruebas con mutaciones de carrito | Johandry / Antigravity con matriz GPT | Cierre real A-01 y pruebas comerciales de A/B. No se asume que hoy no existan. |
| Política de datos: fuentes aprobadas, defaults material/gsm/hardware/origin y ausencia/neutro | Johandry / GPT prepara, Antigravity registra | Directiva A-02 y contenido V-05. Las siete definiciones siguen excluidas sin otra decisión explícita. |
| Promesas de devoluciones/fabricación/servicio, respaldo, vacíos y destinos; ratificar P2 propuesto de RC-07 | Johandry / GPT y Antigravity | Directiva C-08 y copy comercial afectado. |
| Catálogo, idiomas, tallas, navegación, CTA, fotografías y fechas de producción/aprobación | Johandry / Antigravity | D-01 y subítems, G1/G3. |
| Retener/corregir/retirar plantillas de documentación/soporte vendedor dentro del ZIP | Johandry sobre alcance; Antigravity prepara y GPT evalúa impacto | C-04-P y R-C. |
| Nomenclatura actual y límites de renombre; control de web/dominio/buzón | Johandry / Antigravity | C-04/C-04-N y G3. No afecta por defecto a historia, decisiones, ledger o dominios. |
| Número de versión, notas y candidato final | Johandry / Antigravity | C-04-R y G4. |
| Requisitos y umbrales vigentes, metodología/repeticiones y disponibilidad de medición independiente | Antigravity coordina; Claude define/verifica; Johandry resuelve alcance | G2, activación C-03 y R-G. |
| Diseño/compatibilidad y retorno de E al camino de envío, solo si procede | Johandry / propuesta Antigravity–GPT revisada por Claude | E; no bloquea los defectos ni envío por defecto. |

## 10. Cambios V1 → V2

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

## 11. Matrices de resolución de revisiones

“Integrado” significa incorporado al plan, no implementado ni cerrado en ledger.

### 11.1 Diez correcciones obligatorias de Claude

| Nº / revisión líneas | Decisión V2 | Localización / justificación |
| --- | --- | --- |
| C1 / 166 | Integrado con autorización separada de Git | §3, 0-01, R-0 y R-G. Los tres arreglos preceden a lotes; árbol/ZIP reproducibles y remedición final. El plan no ordena un commit sin permiso. |
| C2 / 167 | Integrado con corrección de dominio válido | A-01, 0-03 y R-A. Caso C URL → compra única solo si válida; requires_selling_plan sin plan bloquea. App/fixtures y payload completo; no asumir ausencia actual. |
| C3 / 168 | Integrado con límite más estricto de Johandry | A-02. Política defaults antes de directiva, rama product.type y productos históricos a revalidar. Leer “si existe” no basta: requiere fuente ya aprobada/verificada y excluye las siete pendientes aunque existan. |
| C4 / 169 | Integrado | 0-02 y A-03. Causa motion_style/solo CSS; previews temprano y antes de R-A; dependencias TT-06/TT-17/G1/G2 explícitas. |
| C5 / 170 | Integrado | C-05, C-06, C-07, C-04-P/N, D-01-N/L/V; §1 excluye Atelier/Cucuyo. Los ocho mantienen P2 y trabajo propio. |
| C6 / 171 | Integrado | C-04-R, G2 y G4. Antigravity versión/notas, GPT packaging necesario, Claude inspección de ZIP; Johandry decide versión. Medición por preset con dueño/dependencias. |
| C7 / 172 | Integrado con escritor único estricto | §2. Archivos disjuntos y partición registrada; subagentes escriben por turnos secuenciales, GPT integra antes de devolver. No se admite paralelismo de escritura por tener paths distintos. |
| C8 / 173 | Integrado | §5. Siete checkpoints, entradas/salidas/bloqueos y mediciones independientes de Claude, sin presumir su VM o herramientas. |
| C9 / 174 | Integrado | B-04. Ruta sections/cart-drawer, exclusión del manejador global y reutilización de guardado Checkout, con carreras/regresión. |
| C10 / 175 | Integrado | C-03, G2 y §8. Solo fallo por preset o build final y diagnóstico activa partición; cumplimiento lleva a diferimiento documentado. |

### 11.2 Ajustes de la devolución GPT

| Sección del adjunto | Decisión V2 | Resolución |
| --- | --- | --- |
| 1 / conservar precondiciones | Integrado | §1–§3 y §6 preservan gobierno, identidad, cinco compuertas y límites sin autorizar acciones. |
| 2 / RC-01 | Integrado | B-02 P1 condicionado se ejecuta en A; PDP/featured, A→B sin JS, URL, payload/stock y regresión R-B. |
| 2 / RC-08, RC-13, RC-14 | Integrado | D-02-Q P2, D-02-A P2, D-02-T P3, con caso cantidad min2/step2/actual4/max5 y mensajes de plan frente a agotado. |
| 3 / RC-07 | Integrado con prioridad propuesta identificada | C-08 inventaría promesas/procedencia/política/vacíos/destinos; P2 es decisión propuesta de esta planificación, sin afirmar políticas falsas. |
| 4 / selling_plan | Integrado | A-01 transiciones A→B→compra única, cambios variante, FormData.getAll completo y línea real de carrito solo autorizada. |
| 5 / foco | Integrado | A-03 matriz estilo/control/estado/esquema/fondo/método, footer scheme-2 y separación header/announcement, teclado y evidencia. |
| 6 / demos | Integrado | 0-02 y R-Demo: URL, fecha, viewport efectivo, identidad/build, capturas nuevas, idiomas y catálogo aprobado; límites de evidencia histórica. |
| 7 / delegación | Integrado | §2 y §6: cada tarea delegada con modelo, objetivo, alcance, propiedad y entrega; un escritor por turno. |
| 8 / E | Integrado | E-01 diferido y separado; tareas del comerciante/diseño antes de opciones, sin negar PDP diferenciada de Archive ni imponer cantidades de componentes. |
| Entrega / preservar y trazar | Integrado | V1 conservada, §10 cambios, §11 correspondencias y §9 decisiones pendientes. |

### 11.3 Seis sugerencias opcionales de Claude

| Nº / línea | Decisión | Justificación y aplicación |
| --- | --- | --- |
| O1 / 179 | Aceptada | A-01 separa código pequeño, 0,5 d configuración y 0,5 d pruebas; B-02 0,5–1 d; B-04 ~0,25 d más regresión; D-01 separa activos y C-04 la web/soporte externos. Nuevos P2 se estiman aparte. |
| O2 / 180 | Aceptada solo para TT-108 | TT-105 y TT-106 conservan P2 por devolución GPT y riesgo funcional; TT-108 P3. Conflicto documentado en §4.4, sin rebaja tácita. |
| O3 / 181 | Aceptada condicionalmente | 0-05 inventaría tt02.js, g20_g23.js, s2, p3, s8, axe y Lighthouse. Reutilizar solo disponibles/compatibles, etiquetando sintético/tienda; no presumir VM o $HOME/livetest. |
| O4 / 182 | Aceptada como criterio de diseño | B-01 usa fuente coherente de breakpoint y evalúa atributo data/contrato existente en R-D; evita duplicación hardcodeada sin imponer una arquitectura no inspeccionada. |
| O5 / 183 | Aceptada como ficha, IDs históricos a revalidar | §3 incorpora nombre e ID de tema por tienda, preview y relación al build. Los IDs sugeridos no se presentan como inventario actual. |
| O6 / 184 | Aceptada | E-01 queda fuera del camino de envío; solo evidencia o decisión expresa cambia ese estado. |

## 12. Alcance de la verificación de esta V2

Esta entrega es exclusivamente documental. Se comprobaron existencia del destino antes de crear, lectura completa de las tres fuentes de revisión, hashes de esas fuentes y preflight Git de solo lectura. Los mecanismos y referencias técnicas adicionales se incorporan como contraste delegado acotado; no se volvió a auditar código ni se abrió una tienda en esta redacción.

No se ejecutaron Theme Check, Lighthouse, axe, arneses de compra, instalaciones, compras ni mutaciones de carrito. No se modificaron código, tests, configuración, BOARD, ledger o tiendas. El estado permanece: **Plan ajustado, pendiente de revisión y aprobación. Implementación no iniciada.**
