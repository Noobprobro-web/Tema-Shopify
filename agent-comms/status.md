# Agent Status

## Estado actual

- Fase: Phase 2B autorizada por el usuario; tarea `GPT-2B-001` lista en `agent-comms/inbox-gpt/`. Implementación en espera de tokens de Codex/GPT.
- Cerebro y coordinador: Gemini Flash 3.8 High.
- Implementador tecnico previsto: GPT-5.6 Sol Max bajo directiva de Gemini.
- Concepto interno: `Atelier Flow`.
- Nombre final: pendiente.
- Nombre publico temporal: `Theme Project`.
- Repo remoto: `https://github.com/Noobprobro-web/Tema-Shopify`.
- Rama: `master`.
- Ultimo commit de producto aprobado: `d69825a`.

## Entregas recientes

- `GEMINI-003` entregada en `agent-comms/outbox-gemini/GEMINI-003-phase-2b-readiness-review.md`.
- Revision de Codex: `agent-comms/reviews/CODEX-review-GEMINI-003.md`.
- Handoff maestro: `agent-comms/GEMINI-LEAD-HANDOFF.md`.
- Tarea `GPT-2B-001` creada en `agent-comms/inbox-gpt/GPT-2B-001-phase-2b-core.md`.

## Tareas de Gemini

- Liderazgo asumido formalmente según `agent-comms/GEMINI-LEAD-HANDOFF.md`.
- Criterios P0/P1/P2 de `GEMINI-003` aprobados y formalizados en `GPT-2B-001`.
- Alcance autorizado por el usuario; repositorio sincronizado con remoto.
- Esperando que Codex/GPT disponga de tokens para ejecutar `GPT-2B-001`.

## Tareas de GPT/Codex

- Ejecutar la tarea `agent-comms/inbox-gpt/GPT-2B-001-phase-2b-core.md` cuando se disponga de tokens.
- Implementar solo el alcance escrito y entregar evidencia en `agent-comms/outbox-gpt/`.

## Tareas de Claude

- Ninguna activa.
- Posible auditoria editorial/UX despues de Phase 2B, solo si Gemini la solicita.

## Reglas vigentes

- Leer `AGENTS.md`, `agent-comms/GEMINI-LEAD-HANDOFF.md`, `agent-comms/protocol.md` y `agent-comms/token-efficiency-rules.md`.
- No iniciar Phase 2B por inferencia.
- No usar Astra por defecto; solo con `ESCALATE_MODEL_RECOMMENDED` justificado.
- No usar Claude para duplicar la implementacion tecnica.
