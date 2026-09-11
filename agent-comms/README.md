# Agent Comms

Carpeta oficial de comunicacion entre Codex, Gemini y otros agentes.

## Como usarla

El usuario puede decirle a Gemini:

> Revisa `agent-comms/inbox-gemini/` y completa las tareas delegadas por Codex. Cuando termines, deja tu respuesta en `agent-comms/outbox-gemini/`.

Luego puede decirle a Codex:

> Gemini termino. Revisa `agent-comms/outbox-gemini/`.

## Estructura

- `inbox-gemini/`: tareas que Codex delega a Gemini.
- `outbox-gemini/`: entregas que Gemini deja para revision de Codex.
- `reviews/`: revisiones, aceptaciones, cambios pedidos o sintesis finales de Codex.
- `archive/`: tareas cerradas o historicas.
- `status.md`: tablero corto del estado actual.
- `protocol.md`: reglas de comunicacion.

## Regla de oro

Cada tarea debe tener un ID estable, por ejemplo `GEMINI-002`. La entrega de Gemini debe usar el mismo ID para que Codex pueda revisarla rapido.

