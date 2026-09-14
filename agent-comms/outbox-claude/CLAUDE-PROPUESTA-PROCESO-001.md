# CLAUDE-PROPUESTA-PROCESO-001: Nivelar la forma de trabajo con el nivel del producto

```text
Autor: Claude (Opus 5)
Para: Johandry / Ruiz Digital, con copia a Gemini y GPT
Naturaleza: propuesta, no directiva. Nada de esto se ejecuta sin que Johandry elija el alcance
Método: revisión de AGENTS.md, protocol.md, token-efficiency-rules.md, requirements-ledger.md,
        la matriz de aceptación de Fase 1, y el historial de los últimos cuatro sprints
Fecha: 2026-09-13
```

---

## 1. El diagnóstico, y no es el que esperaba

Entré a revisar esperando encontrar un reglamento pobre. Encontré lo contrario.

`AGENTS.md` ya tiene una **Definition of Done con cinco compuertas obligatorias** y son buenas. Exigen evidencia `archivo:línea` y dicen literalmente que "Theme Check pasa" no es evidencia. Exigen recorrer cinco estados degenerados antes de cerrar cualquier componente. Prohíben duplicar formatos de moneda con `Intl` en vez de `shop.money_format`. Exigen `info` en todo setting que dependa de configuración externa. Y prohíben declarar cumplida una funcionalidad crítica solo con análisis estático.

**Las cinco existían antes de todos los problemas que encontramos. Y los cinco problemas que encontramos son exactamente lo que esas cinco compuertas prohíben.**

| Regla que ya existía | Qué pasó igual |
|---|---|
| Compuerta 1: evidencia `archivo:línea`, "Theme Check pasa" no es evidencia | El dictamen de ayer citó `theme.js:147-190` para una función que está en la 614, y tres cifras que no salen de ninguna ejecución |
| Compuerta 2: cinco estados degenerados antes de cerrar | Nunca se ejecutó en cuatro sprints. Por eso el catálogo hostil de QA sigue sin importarse |
| Compuerta 3: no duplicar formato de moneda con `Intl` en vez de `shop.money_format` | `theme.js` tiene tres `formatMoney` y dos usan `Intl` |
| Compuerta 4: `info` obligatorio en settings dependientes de config externa | Los settings de URL no tenían `info` hasta el sprint de anteayer |
| Compuerta 5: nada se declara cumplido solo con análisis estático | Cuatro sprints sin abrir la tienda, con filas en verde |
| La matriz de aceptación de Fase 1 | Enumeraba ocho de mis hallazgos de auditoría antes de que yo los encontrara |

**La tesis de esta propuesta es una sola frase: el reglamento ya es mejor que la práctica, así que no hace falta escribir más reglas. Hace falta que las reglas se ejecuten solas.**

Y hay una segunda capa del problema. Los documentos que cargan las reglas se han degradado hasta contradecirse a sí mismos. Tres casos comprobados hoy:

**`AGENTS.md` se contradice en tres lugares.** Su sección de autoridad ya dice que yo soy implementador principal y GPT es auditor. Pero más abajo, "Tareas de GPT/Codex" sigue diciendo "Implementar exactamente el alcance escrito por Gemini", "Tareas ideales para Claude" sigue limitándome a revisión editorial, y "Modelo y escalamiento" sigue reservando a GPT para "implementacion transversal". El mismo archivo dice dos cosas opuestas sobre quién escribe código.

**El encabezado del ledger contradice su propia tabla.** Dice 27 cumplidos, 14 código completo y 4 pendientes, o 45 filas. La tabla tiene **53 filas**, de las cuales 30 son cumplido, 18 son alguna forma de código completo y 4 son pendientes. Dos de las tres cifras del resumen están mal y el total no cuadra.

**El vocabulario de estados se descontroló.** Hay seis etiquetas en uso para cuatro estados reales: `cumplido`, `cumplido (código)`, `código completo (pendiente tienda)`, `cumplido (reglamento Theme Store)`, `no verificado` y `parcial`. `cumplido (código)` y `código completo (pendiente tienda)` significan lo mismo con dos nombres distintos.

Nadie notó ninguna de las tres, porque nada las calcula.

**Y el dato que mejor resume en qué punto estamos: no existe la carpeta `.github/`.** Cero integración continua, cero red de regresión. Un tema de 400 dólares, 53 requisitos y cuatro agentes trabajando en paralelo, sin nada que corra al hacer push.

---

## 2. Qué cambió de fase, y qué debe optimizar el proceso ahora

El proceso actual se diseñó para construir, y funcionó: doce plantillas, veintiséis secciones, cero placeholders. Optimizaba **rendimiento de construcción**: directivas cerradas, un implementador, revisiones puntuales.

Ya no estamos construyendo. Estamos endureciendo para la submission. Eso cambia lo que el proceso tiene que optimizar:

**Antes:** que se escriba más tema, rápido y sin pisarse.
**Ahora:** que exista prueba de que el tema funciona, y que arreglar una cosa no rompa otra.

Las dos cosas que faltan son exactamente esas dos: **prueba** y **no regresión**. Todo lo que propongo abajo sirve a una de las dos.

---

## 3. Siete propuestas, ordenadas por valor sobre costo

### P1. Las cinco compuertas dejan de ser prosa y pasan a ser `npm run gates`

La propuesta central. Cada compuerta de la DoD que se pueda ejecutar, se ejecuta. Lo que quede es explícitamente humano.

| Compuerta de la DoD | Cómo se vuelve ejecutable | Estado |
|---|---|---|
| 1. Evidencia y ledger | script que parsea el ledger, valida el vocabulario de estados, recalcula el conteo y comprueba que cada `archivo:línea` citado existe y contiene lo que dice | a escribir |
| 2. Estados degenerados | Playwright contra `theme dev`, recorriendo vacío, uno, muchos, muy largo y faltante en colección, producto, carrito, búsqueda y blog | a escribir |
| 3. Consistencia entre archivos | script que detecta duplicación: más de un formateador de moneda, tokens CSS declarados sin uso, umbrales numéricos repetidos, `Intl` donde debería ir `shop.money_format` | a escribir |
| 4. Superficie del comerciante | `locale-key-inventory.mjs` ya cubre traducciones. Falta: todo setting `url` tiene `info`, todo label resuelve, cero jerga en labels | parcial, ya existe |
| 5. Tienda real | Playwright + axe + Lighthouse contra `theme dev`: conteo de `h1` por plantilla, `heading-order`, inventario de áreas táctiles, CLS, contraste calculado sobre los 15 esquemas | a escribir |

Más las que ya existen y hoy nadie corre en conjunto: `theme-check-sanity.mjs`, `locale-key-inventory.mjs`, `theme check`, `node --check`, validez JSON incluyendo `/listings`, y los barridos de enlaces muertos que hice a mano en 4B-002.

Dos comandos:

```
npm run gates:static   # no necesita tienda. Corre en segundos
npm run gates:live     # necesita theme dev y catálogo sembrado
```

**Y el cambio de fondo: el ledger deja de mantenerse a mano y se genera.** Las filas que tienen script muestran su estado real calculado; las que son de juicio humano quedan marcadas como tal, con dueño. Nadie vuelve a poder escribir un verde a mano, y el encabezado no puede volver a contradecir la tabla porque lo calcula un script.

Esto mata de raíz las tres contradicciones de la sección 1 y los tres informes de estado que no sobrevivieron a la verificación.

### P2. Integración continua, porque hoy no hay red

No existe `.github/`. Propuesta mínima: un workflow que corra `gates:static` en cada push y en cada pull request contra `master`. Gratis para este repositorio, media hora de trabajo.

El valor no es la ceremonia. Es que hoy, si alguien rompe una clave de traducción o mete un `"/"` en un template, **no hay nada que lo detecte hasta que a alguien se le ocurra mirar.** Con cuatro agentes escribiendo en el mismo repo, eso es cuestión de tiempo.

`gates:live` no va en CI porque necesita credenciales de tienda. Va como comando local antes de cada entrega, y su resultado se pega en el reporte.

### P3. Vocabulario cerrado de estados, y solo cuatro

Cuatro estados, un nombre cada uno, y el script los valida:

`cumplido` cuando existe el artefacto que el requisito exige. `código completo` cuando el código está y falta la medición, siempre con el artefacto de cierre y el dueño escritos. `no verificado` cuando nadie lo ha comprobado. `ausente` cuando no está hecho.

Nada de `cumplido (código)` junto a `código completo (pendiente tienda)`. Un requisito o tiene su prueba o no la tiene.

### P4. Evidencia pegada, nunca recordada

La regla que arregla el error que se repitió tres veces, y cuesta cero infraestructura.

**Toda cifra y toda cita `archivo:línea` en un reporte tiene que venir pegada de la salida de un comando, con el comando visible al lado.** Si un reporte trae un número sin el bloque de salida que lo produjo, se rechaza sin leer el resto.

Los tres fallos de estado de este proyecto fueron cifras y citas recordadas en lugar de pegadas. Ninguno fue un error de razonamiento. Los scripts imprimen sus cifras en pantalla precisamente para que copiarlas sea más fácil que recordarlas.

Y el complemento, que es el que mejor funcionó hasta ahora: **toda entrega termina con una lista numerada de afirmaciones falsables**, y el trabajo del revisor es intentar romper cada una. Eso convirtió mi revisión del dictamen de Gemini en algo que podía fallar, y de hecho falló en cuatro puntos. "Revisa esto" no produce eso nunca.

### P5. La gobernanza pasa de once documentos a cuatro

Hoy, antes de escribir una línea, un agente debe leer `AGENTS.md`, `GEMINI-LEAD-HANDOFF.md`, `status.md`, `protocol.md`, `token-efficiency-rules.md`, `PROTOCOL-IMPLEMENTATION.md`, `PROTOCOL-VERIFICATION.md` y su tarea. Ocho archivos, y crecen. Más tres `prompt-for-gemini*.md` sueltos de la Fase 1 que ya no significan nada, y dos checklists de Theme Store que se solapan.

Propuesta: cuatro archivos y nada más.

**`AGENTS.md`** — quién es quién, qué posee cada uno, y la lista de lectura obligatoria. Corto. Y arreglando las tres auto-contradicciones que tiene hoy.
**`agent-comms/BOARD.md`** — el estado vivo en una sola pantalla: sprint actual, qué posee cada agente, qué está bloqueado y por quién, qué sigue. Reemplaza `status.md` y `GEMINI-LEAD-HANDOFF.md`.
**`agent-comms/RULES.md`** — un solo reglamento, fusionando `protocol.md`, `token-efficiency-rules.md` y los dos protocolos nuevos, sin duplicados.
**`docs/decisions.md` y `docs/decisions-pending.md`** — lo decidido y lo que espera decisión.

Todo lo demás a `archive/`. No se borra, deja de estar en el camino.

### P6. Una cola de decisiones pendientes, porque hoy no existe

`docs/decisions.md` guarda lo decidido. **Lo que espera decisión no tiene casa, y por eso se pierde.** Cuatro decisiones de `CLAUDE-PRESETS-001` llevan varios sprints esperando: el headline feature, los taglines, el alcance de `/listings` y si se añade la sección de producto destacado.

Un archivo con una fila por decisión abierta: ID, la pregunta, quién decide, qué está bloqueado por ella, y desde cuándo. La columna de fecha es lo que hace visible que algo lleva tres sprints parado. Toda entrega que genere una pregunta la anota ahí antes de cerrarse.

### P7. Adversario rotativo, y terminar el rebalance de roles

Lo mejor que produjo este proyecto salió de romper la jerarquía fija. La revisión de GPT a mi protocolo encontró siete cosas, dos sobre mi propia conducta. Mi revisión del dictamen de Gemini encontró cuatro. Ninguna de las dos era la dirección de revisión prevista.

Propuesta: por cada entrega, el revisor es explícitamente quien no la escribió, y se nombra en el board. No como cortesía sino como asignación, con la lista de afirmaciones falsables como contrato.

Y terminar el rebalance que Gemini ya empezó y dejó a medias en `AGENTS.md`. La asignación nueva tiene sentido y hay que hacerla consistente: yo implemento y audito UX, GPT audita producto y requisitos comerciales de Theme Store, Gemini arquitectura y coordinación, Johandry lo que solo un humano puede hacer. Lo de GPT encaja con lo que acaba de demostrar: su mejor hallazgo fue de portabilidad y de límites de autoridad, no de Liquid.

---

## 4. Cómo quedan interconectados los tres, que es lo que preguntaste

Hoy el bus de mensajes eres tú. Copias y pegas entre tres ventanas, y cada salto pierde contexto y añade latencia. Eso no se arregla con más mensajes, se arregla con artefactos compartidos y comprobables.

Tres piezas, y ya existen dos:

**El repositorio es el transporte.** Los tres leen y escriben en él, y los tres pueden hacerlo ya: GPT desde su entorno, yo por el puente, y Gemini hizo push a `origin/master` ayer. `agent-comms/` es la cola.

**`BOARD.md` es el único punto de entrada.** Tu mensaje a cualquiera de los tres pasa a ser una línea: "lee BOARD.md". Ahí está quién posee qué, qué está bloqueado y qué sigue. Dejas de ser el router y pasas a ser lo que debes ser, el que decide.

**`npm run gates` es la verdad compartida sobre el código.** Cuando los tres corren el mismo comando y obtienen la misma tabla, se acaba la discusión sobre el estado. Hoy cada uno reporta su propia versión de los números y ya vimos en qué termina.

El acoplamiento entre ellos es la lista de afirmaciones falsables: la salida de uno es la entrada ejecutable del siguiente. Eso es lo que los conecta de verdad, no el canal.

---

## 5. Lo que no haría

**Un dashboard.** La tabla que imprime `npm run gates` en la terminal es suficiente y no hay que mantenerla.

**Más documentos de proceso.** El diagnóstico de este documento es que ya hay demasiados y que el reglamento supera a la práctica. Sumar un séptimo protocolo sería repetir el error.

**Ceremonias con calendario.** Un humano y tres modelos trabajando de forma asíncrona no necesitan ritos. Necesitan que el estado sea legible cuando cada uno llega.

**Reescribir el ledger desde cero.** Tiene 53 filas de trabajo real y bien investigado. Lo que hay que cambiar es quién calcula sus cifras, no su contenido.

---

## 6. En qué orden, y qué cuesta

| Orden | Propuesta | Costo | Por qué primero |
|---|---|---|---|
| 1 | P3 vocabulario + P1 el script que valida y recalcula el ledger | bajo | Mata las tres contradicciones y deja el ledger imposible de falsear a mano |
| 2 | P2 integración continua con `gates:static` | bajo | Media hora, y es la única red de regresión que va a existir |
| 3 | P4 evidencia pegada y afirmaciones falsables | cero | Es una regla, no código. Se aplica desde la próxima entrega |
| 4 | P5 consolidación a cuatro documentos + arreglar las contradicciones de `AGENTS.md` | medio | Sin esto la lectura obligatoria sigue creciendo hasta que nadie la lea |
| 5 | P6 cola de decisiones | bajo | Desbloquea cuatro decisiones tuyas que llevan sprints paradas |
| 6 | P1 compuerta 2 y 5 en Playwright | alto | Es el trabajo grande, y es el que convierte ocho filas de código completo en cumplidas |
| 7 | P7 adversario rotativo | cero | Es una línea en el board por sprint |

Los cinco primeros son un par de horas de trabajo y resuelven todo lo estructural. El sexto es el que de verdad mueve la submission, y es el que le encargaría a GPT junto con la prueba del total de línea que ya tiene asignada.

---

## 7. El nombre ya está decidido, y eso abre trabajo real

Johandry confirmó que **Sartorial** es su decisión, no una propuesta registrada por Gemini. Eso supera mi revisión de ayer sobre Couture y hay que propagarlo. La propagación es más grande de lo que parece porque el nombre del tema y el del preset principal están acoplados por requisito de la Theme Store.

Alcance de la propagación, para que quede inventariado antes de que alguien empiece:

| Dónde | Qué cambia |
|---|---|
| `config/settings_schema.json` | `theme_name` |
| `config/settings_data.json` | el preset principal, que comparte nombre con el tema |
| `listings/couture/` | renombrar la carpeta completa a `listings/sartorial/` |
| `Couture-1.0.0.zip` | regenerar con el nombre nuevo |
| `docs/` | ledger, decisions, planes de fase |
| `agent-comms/` | todas las entregas previas citan Couture |

Y la fila del ledger **Alineación de Nombre: Tema vs Preset** hay que re-verificarla después del renombrado, porque hoy está en verde por una coincidencia que va a dejar de existir en el momento en que se toque uno de los dos.

Busqué "Sartorial" en la Theme Store y no encontré colisión. Lo digo así a propósito: no encontrar nada en una búsqueda ruidosa no es lo mismo que estar libre, y la verificación formal contra el directorio y contra registros de marca sigue siendo la fila abierta con dueño Johandry.

**Y queda una colisión sin resolver, que es distinta de la del nombre del tema.** El preset `Studio` duplica el nombre de un tema gratuito oficial de Shopify en la Theme Store. Adoptar Sartorial resuelve el nombre del producto pero no toca esa. Es una decisión aparte y sigue abierta.
