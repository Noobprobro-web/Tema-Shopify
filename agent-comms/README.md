# Agent Comms

Carpeta oficial de comunicacion y handoff entre el cerebro del proyecto y los agentes ejecutores.

## Punto de entrada actual

Gemini Flash 3.8 High es el cerebro/orquestador vigente. Debe empezar por leer `agent-comms/GEMINI-LEAD-HANDOFF.md`, luego `status.md` y solo los archivos que el handoff o la tarea referencien.

## Flujo

1. Gemini recibe la prioridad del usuario y define una directiva acotada.
2. Gemini deja la directiva en `inbox-gpt/` o `inbox-claude/` con un ID estable.
3. El agente ejecutor implementa solo ese alcance y entrega evidencia en la carpeta `outbox-*` correspondiente.
4. Gemini revisa el resultado, registra decisiones/feedback en `reviews/` y actualiza `status.md` cuando el estado real cambie.
5. El ejecutor hace commit/push unicamente si la directiva lo autoriza y las validaciones pasan.

## Estructura

- `GEMINI-LEAD-HANDOFF.md`: contexto maestro para asumir el rol de cerebro.
- `inbox-gemini/`: tareas que Gemini debe revisar o completar.
- `outbox-gemini/`: informes y sintesis que Gemini entrega.
- `inbox-gpt/` y `outbox-gpt/`: encargos y resultados de implementacion GPT/Codex.
- `inbox-claude/` y `outbox-claude/`: encargos y revisiones de Claude.
- `reviews/`: aceptaciones, cambios pedidos y decisiones operativas.
- `status.md`: tablero corto del estado actual.
- `protocol.md`: autoridad, flujo y formatos.
- `token-efficiency-rules.md`: lectura minima, jerarquia y reglas de ahorro.

## Regla de oro

No repetir contexto ya documentado. Referenciar rutas, entregar decisiones accionables y mantener cada tarea vinculada a un ID estable.
