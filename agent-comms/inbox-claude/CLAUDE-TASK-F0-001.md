# ORDEN CLAUDE-TASK-F0-001 para Claude Code

```text
ID: CLAUDE-TASK-F0-001
Redacta: Cerebro (sesión de Claude en claude.ai)
Autoriza: Johandry (2026-10-18)
Destinatario: Claude Code
Worktree: ../ts-claude, rama sprint/F0
```

## Objetivo
Que la CI de GitHub Actions use la versión de Node fijada en `.nvmrc` (Node 22.12.0) en lugar de Node 20.

## Instrucciones Operativas
1. Lee `AGENTS.md` y `agent-comms/RULES.md`.
2. Trabaja en `../ts-claude` sobre la rama `sprint/F0`. **Sin commit, sin push, sin git add.**
3. **Archivos permitidos:** `.github/workflows/ci.yml`.
4. **No toques:** Nada más. Si ves otro paso que fallará en CI, documéntalo en "Hallazgos extra" con su diff.

## Criterios de Aceptación
- El paso de setup de Node en `.github/workflows/ci.yml` lee `.nvmrc` (`node-version-file: .nvmrc`).
- Con Node 22.12 local: `npm ci` y `npm run gates:static` con salida pegada.
- Diff de una o dos líneas únicamente.

## Informe de Entrega
- Ubicación: `agent-comms/outbox-claude/CLAUDE-REPORT-F0-001.md` con cabecera de `RULES.md §1.4` y `.diff`.
- Termina con el bloque `PARTE` según `agent-comms/inbox-gemini/CEREBRO-PLAN-001.md §3c`.
