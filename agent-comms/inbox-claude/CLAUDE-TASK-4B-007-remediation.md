# CLAUDE-TASK-4B-007: Remediación Post-Reverificación Adversarial (R01 a R04)

```text
ID: CLAUDE-TASK-4B-007
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5 - Implementador Principal de Código)
Autorizado por: Johandry / Ruiz Digital
Fecha: 2026-09-14
Estado: DISPATCHED
Tipo de cambio: Nivel 1 (Corrección local en assets/theme.js sin tocar schemas ni Liquid)
Prerrequisito: Master en bee742b limpio, 8 compuertas estáticas en verde.
```

## Contexto y evidencia obligatoria

Lee antes de editar:

- `AGENTS.md`
- `agent-comms/RULES.md`
- `agent-comms/BOARD.md`
- `agent-comms/outbox-gpt/GPT-AUDIT-4B-007-reverification.md`
- `agent-comms/outbox-gpt/GPT-AUDIT-4B-007-artifacts/README.md`
- Los parches propuestos: `agent-comms/outbox-gpt/GPT-AUDIT-4B-007-artifacts/patches/R01.patch` hasta `R04.patch`

La auditoria fue ejecutada sobre commit `bee742b`. El tema original no fue modificado. Las compuertas estaticas pasaron (`Theme Check: 74 files inspected with no offenses found`), pero la auditoria de comportamiento produjo un P1 reproducible. No apliques los parches a ciegas: revisa cada diff contra `assets/theme.js` actual y conserva la arquitectura `ThemeCore.ThemeElement`.

## Trabajo obligatorio

### R01 / P1: impedir que una sincronizacion atrasada revierta una mutacion del carrito

Archivo: `assets/theme.js`, `CartDrawer`.

Reproduccion exacta:

1. Abrir el drawer con una unidad en el carrito.
2. Retener la respuesta real de `GET /cart?section_id=cart-drawer` iniciada por `open()`.
3. Cambiar la cantidad a 2 y esperar el `POST /cart/change.js`.
4. Liberar la primera respuesta retenida.
5. En el commit actual, la UI vuelve a cantidad 1 aunque `/cart.js` tiene cantidad 2.

Implementa control de concurrencia para que una respuesta de `syncCart()` no pueda reemplazar el HTML producido por una mutacion posterior. Debe cubrir las cuatro rutas de mutacion:

- `addItem`
- `addCrossSell`
- `changeLine`
- `CompleteTheLook.addSelectedItems`

La solucion propuesta en `R01.patch` usa revision/in-flight mutation tracking, aborta o invalida la lectura vieja y vuelve a sincronizar al terminar si corresponde. Puedes mejorarla si encuentras una carrera mas segura, pero no elimines la sincronizacion en aperturas ni reintroduzcas la condicion por `item_count`.

### R02 / P2: completar la exclusion de dialogos

Archivo: `assets/theme.js`.

`closeOtherDialogs()` existe, pero no se invoca en todas las aperturas. Añade la coordinacion a:

- `PredictiveSearch.setOpen(true)`
- `PickupAvailability.open()`
- `PasswordModal.open()`

Conserva el target de retorno antes de cerrar el dialogo anterior. Verifica que el nuevo panel sea el unico abierto, que sus ancestros no queden `inert`, que Tab no caiga en BODY y que Escape cierre el dialogo visible. `R02.patch` contiene la correccion minima propuesta.

El flujo nativo menu -> carrito ya paso; no lo regreses.

### R03 / P2: errores de transporte sin texto tecnico

Archivo: `assets/theme.js`.

Los 500/502/503/429 con cuerpo HTML ya muestran el `dataset.errorMessage`. Falta la rama donde `fetch()` rechaza sin respuesta HTTP: actualmente los cuatro flujos muestran `Failed to fetch`.

Convierte los rechazos de transporte a los mensajes traducidos del componente, conservando `AbortError` como silencioso:

- CartDrawer: `data-error-message`
- CompleteTheLook: su `data-error-message`

No agregues reintentos automáticos ni expongas detalles de red al comprador. `R03.patch` propone un wrapper local.

### R04 / P2: no liberar el scroll lock de otro dialogo al desmontar una seccion

Archivo: `assets/theme.js`.

Reproduccion: abrir carrito, retirar del DOM un `theme-drawer` cerrado como en una descarga/recreacion del Theme Editor. En el commit actual se elimina `body[data-drawer-open]` y el body vuelve a tener scroll aunque el carrito sigue abierto.

Haz que los atributos globales `data-drawer-open` y `data-modal-open` reflejen los dialogos realmente abiertos, en lugar de quitarlos incondicionalmente desde `close()`/`disconnectedCallback()`. Conserva el foco y el inert del dialogo que permanece abierto. `R04.patch` contiene una propuesta minima.

## Validacion obligatoria

Ejecuta y conserva salida literal:

1. `node --check assets/theme.js`
2. `npx.cmd shopify theme check` con 0 ofensas
3. `npm.cmd run gates:static`
4. Los probes originales de `GPT-AUDIT-4B-007-artifacts` en una preview de desarrollo aislada.
5. La suite de candidato: `node .tmp/gpt-audit-4b-007/run-proposed.mjs`, adaptada si el parche final cambia la interfaz.
6. Nueva comprobacion de catalogo movil, teclado menu -> carrito, errores HTML y errores de transporte.

Acceptance criteria:

- R01: el caso retrasado termina con UI y `/cart.js` en cantidad 2; no existe respuesta vieja que reemplace el estado nuevo.
- R02: matriz de aperturas de dialogos sin dos superficies `data-open` activas ni panel nuevo inert.
- R03: 4/4 flujos muestran exactamente el mensaje traducido; HTML 500/502/503/429 permanece verde.
- R04: desmontar un dialogo cerrado no retira el lock de un dialogo abierto.
- Cero `pageerror` en las pruebas.
- No modificar plantillas, Liquid, configuracion o `BOARD.md` sin autorizacion adicional.
- No crear dependencias externas.

## Entrega

Deja el reporte en:

`agent-comms/outbox-claude/CLAUDE-IMPL-4B-007-remediation.md`

Incluye archivos y lineas, resultado de cada acceptance criterion, comandos con salida, limitaciones y cualquier desviacion. No hagas commit ni push todavía; Gemini debe revisar la entrega y GPT debe repetir la auditoria. Si detectas que un parche necesita cambiar contrato o alcance, detente y eleva la propuesta a Gemini en vez de implementarlo.
