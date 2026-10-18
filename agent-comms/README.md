# Agent Comms

Carpeta oficial de comunicación y handoff entre el Cerebro del proyecto (Claude en claude.ai), el Orquestador/Arquitecto en el repo (Gemini en Antigravity) y las fuerzas especializadas (Claude Code y Codex/GPT).

## Punto de entrada y tablero vivo

El punto de entrada y tablero maestro de coordinación técnica en tiempo real es `agent-comms/BOARD.md` (único escritor autorizado: Gemini en Antigravity).

El plan maestro del proyecto lo mantiene vivo el Cerebro (Claude en claude.ai) en el Project; en el repositorio se archiva la copia canónica en `agent-comms/inbox-gemini/CEREBRO-PLAN-001.md`.
El reglamento operativo es `agent-comms/RULES.md`.

## Flujo de Trabajo

1. Johandry autoriza el alcance y decisiones de negocio.
2. Claude en claude.ai (Cerebro) planifica, redacta directivas completas y órdenes cortas.
3. Gemini en Antigravity archiva directivas en `agent-comms/inbox-*/`, crea ramas/worktrees, gestiona `BOARD.md`, commitea, abre PRs y despliega.
4. Claude Code implementa en su worktree aislado (`../ts-claude`), corre compuertas estáticas y entrega reporte en `agent-comms/outbox-claude/` sin commit.
5. Codex/GPT audita independientemente y mide sobre el tema desplegado en desarrollo, entregando en `agent-comms/outbox-gpt/`.
6. Verificación adversarial cruzada: Claude Code verifica el trabajo de Gemini, Gemini verifica a Claude Code y Codex audita independientemente sobre SHA fijo antes de que el Cerebro revise y Gemini autorice/mergee.

## Estructura

- `BOARD.md`: Tablero maestro de estado, archivos en vuelo y seguimiento en tiempo real.
- `inbox-gemini/`: Briefs, directivas y planes emitidos para Gemini.
- `outbox-gemini/`: Informes, inventarios y síntesis emitidos por Gemini.
- `inbox-claude/`: Directivas de implementación para Claude Code.
- `outbox-claude/`: Informes de implementación, diffs y arneses de Claude Code.
- `inbox-gpt/`: Encargos de auditoría y medición para Codex/GPT.
- `outbox-gpt/`: Informes de auditoría y mediciones de Codex/GPT.
- `reviews/`: Dictámenes de verificación adversarial cruzada (`GEMINI-review-*`, `CLAUDE-review-*`).
- `RULES.md`: Reglamento operativo obligatorio.

## Regla de Oro

Nunca incluir contraseñas, tokens, cookies ni secretos en archivos, informes o chats (solo variables de entorno como `STOREFRONT_PASSWORD`). No repetir contexto ya documentado: referenciar rutas, mantener IDs estables y respetar la propiedad de archivos según `AGENTS.md`.
