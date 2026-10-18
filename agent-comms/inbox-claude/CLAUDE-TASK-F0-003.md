# ORDEN CLAUDE-TASK-F0-003 para Claude Code

```text
ID: CLAUDE-TASK-F0-003
Redacta: Cerebro (sesión de Claude en claude.ai)
Autoriza: Johandry (2026-10-18)
Destinatario: Claude Code
Modo: Solo lectura sobre origin/sprint/F0
```

## Objetivo
Verificación adversarial independiente de GEMINI-TASK-F0-001 (commit 57b9ebf y su corrección). Excluye expresamente `.github/workflows/ci.yml` (parche de CI implementado por Claude Code en CLAUDE-TASK-F0-001 y verificado por Gemini).

## Instrucciones Operativas
1. Lee `agent-comms/RULES.md §4` y `agent-comms/outbox-gemini/GEMINI-REPORT-F0-001-arranque.md` en `origin/sprint/F0`.
2. Trabaja en **solo lectura** sobre `origin/sprint/F0`.
3. **Escribe solo en:** `agent-comms/reviews/CLAUDE-review-GEMINI-F0-001.md`.

## Criterios de Aceptación
- Cada afirmación de Gemini comprobada con comando y salida verificable.
- `AGENTS.md` coincide con `agent-comms/inbox-gemini/CEREBRO-PLAN-001.md §3a` (versión actualizada).
- `BOARD.md` sin cambios fuera de la sección nueva, la fecha y la corrección de la línea 595.
- `docs/inventario-herramientas.md` sin rutas omitidas.
- Veredicto formal explícito: `ACEPTAR` o `DEVOLVER`.

## Informe de Entrega
- Ubicación: `agent-comms/reviews/CLAUDE-review-GEMINI-F0-001.md`.
- Termina con el bloque `PARTE` según `agent-comms/inbox-gemini/CEREBRO-PLAN-001.md §3c`.
