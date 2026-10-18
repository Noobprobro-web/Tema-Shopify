# ORDEN CLAUDE-TASK-F0-002 para Claude Code

```text
ID: CLAUDE-TASK-F0-002
Redacta: Cerebro (sesión de Claude en claude.ai)
Autoriza: Johandry (2026-10-18)
Destinatario: Claude Code
Worktree: worktree en sprint/7B
```

## Objetivo
Dejar listos los archivos nuevos Nivel 1 de Sprint 7B y la especificación del fixture compare-at.

## Instrucciones Operativas
1. Lee `AGENTS.md`, `agent-comms/RULES.md` y, en `agent-comms/outbox-claude/`:
   - `directivas-borrador-contour.md` (7B tareas 2.1, 2.2, 2.2b y 2.7).
   - `estructura-repo.md §3`.
2. Trabaja en un worktree de `sprint/7B`. **Sin commit, sin push, sin git add.**
3. **Archivos permitidos (todos nuevos):**
   - `scripts/package-theme.mjs`
   - `scripts/secrets-scan.mjs`
   - `.gitattributes`
   - `.shopifyignore`
4. **No toques:** `package.json`, `ci.yml`, `.gitignore` ni ningún archivo existente; no ejecutes renormalize.
5. **Subagentes:** Uno por archivo; Fable 5.1 revisa `package-theme` y `secrets-scan`.

## Criterios de Aceptación
- `package-theme.mjs` con `--verify` da "Manifest OK", genera manifest con sha256 por archivo y produce un ZIP sin `AGENTS.md` con el CLI del lockfile (y con 4.9.x si está instalado), con prueba negativa documentada.
- `secrets-scan.mjs` falla hoy en los 2 scripts `gate5` sin imprimir valores sensibles.
- `.shopifyignore` sin patrones de carpeta innecesarios.
- Informe incluye producto y variante exactos que necesita `tests/pdp-line-total.spec.mjs` para no saltarse el segundo test (fixture compare-at).

## Informe de Entrega
- Ubicación: `agent-comms/outbox-claude/CLAUDE-REPORT-F0-002.md` con cabecera de `RULES.md §1.4`.
- Termina con el bloque `PARTE` según `agent-comms/inbox-gemini/CEREBRO-PLAN-001.md §3c`.
