# ORDEN GPT-TASK-F0-002 para Codex

```text
ID: GPT-TASK-F0-002
Redacta: Cerebro (sesión de Claude en claude.ai)
Autoriza: Johandry (2026-10-18)
Destinatario: Codex / GPT
Worktree: ts-codex (detached en master @ 19190b1)
```

## Objetivo
Construir la matriz de personalización de Sartorial para blindar el tema contra rechazos por falta de flexibilidad del comerciante (lección aprendida de Contour).

## Instrucciones Operativas
1. Lee `AGENTS.md`, `agent-comms/RULES.md §4` y `docs/contour-reference-plan.md` (`CONTOUR-04`).
2. **Base:** `master @ 19190b1` en `../ts-codex`. Solo lectura de esquemas en `sections/`, `blocks/` y `config/settings_schema.json`.
3. **Escribe solo en:** `agent-comms/outbox-gpt/GPT-REPORT-F0-002-matriz-personalizacion.md`.
4. **No toques:** Nada más del repositorio. **Sin commit ni push.**

## Criterios de Aceptación
- Análisis estructurado por tarea de comerciante: control (global, sección o bloque), propagación, herencia, móvil y persistencia.
- Indicación explícita de qué aspectos solo se pueden confirmar dentro del Theme Editor de Shopify.
- Propuesta de 2 o 3 ajustes candidatos con herencia que conserven la identidad estética actual bajo el criterio: *"dos composiciones originales en un preset sin necesidad de código"*.

## Informe de Entrega
- Ubicación: `agent-comms/outbox-gpt/GPT-REPORT-F0-002-matriz-personalizacion.md`.
- Termina con el bloque `PARTE` según `agent-comms/inbox-gemini/CEREBRO-PLAN-001.md §3c`.
