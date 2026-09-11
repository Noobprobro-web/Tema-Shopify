# GEMINI-003: Phase 2B Readiness Review

## Objetivo

Revisar si el repositorio y la arquitectura aprobada en Phase 2A están listos para que GPT-5.6 Sol Max implemente Phase 2B, y proponer ajustes concretos al encargo antes de comenzar.

## Alcance

- Revisar la aprobación de Phase 2A y sus límites.
- Evaluar riesgos de arquitectura, Theme Store, accesibilidad, rendimiento, extensibilidad y experiencia merchant para Phase 2B.
- Detectar ambigüedades o decisiones faltantes en el próximo prompt de implementación.
- No implementar código, no cambiar archivos de producto y no iniciar Phase 2B.

## Archivos permitidos

Lee únicamente, salvo necesidad justificada:

1. `AGENTS.md`
2. `agent-comms/token-efficiency-rules.md`
3. `agent-comms/protocol.md`
4. `agent-comms/status.md`
5. `docs/phase-2-architecture-plan.md`
6. `agent-comms/reviews/CODEX-review-PHASE-2A.md`
7. `config/settings_schema.json`
8. `sections/main-placeholder.liquid`
9. `templates/index.json`

## Entrega

Escribe un informe en:

`agent-comms/outbox-gemini/GEMINI-003-phase-2b-readiness-review.md`

Incluye como máximo 10 recomendaciones, ordenadas por prioridad `P0`, `P1` o `P2`. Para cada una indica: evidencia, riesgo, recomendación y si debe entrar en el prompt de GPT-5.6 Sol Max. Añade una sección breve con riesgos residuales y otra con una decisión clara: `READY`, `READY WITH CHANGES` o `NOT READY`.

Si una revisión exige realmente GPT-6 Astra, marca `ESCALATE_MODEL_RECOMMENDED` y explica por qué. Marca `CLAUDE_RECOMMENDED` solo si Claude aporta valor concreto ahora en copy, UX editorial o documentación. No uses esas marcas por rutina.

No repitas el contexto completo del proyecto. No hagas cambios fuera del informe.
