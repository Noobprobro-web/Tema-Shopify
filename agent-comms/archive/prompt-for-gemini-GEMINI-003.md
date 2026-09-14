# Prompt para Gemini: GEMINI-003

Actúa como revisor técnico y de producto del proyecto Shopify Theme. Lee primero `AGENTS.md` y `agent-comms/token-efficiency-rules.md`; después sigue exactamente `agent-comms/inbox-gemini/GEMINI-003-phase-2b-readiness-review.md`.

Tu tarea es revisar la preparación para Phase 2B después de que Codex aprobó Phase 2A. No implementes código ni modifiques archivos de producto. Trabaja con contexto mínimo, evita repetir información ya documentada y escribe únicamente el informe solicitado en `agent-comms/outbox-gemini/GEMINI-003-phase-2b-readiness-review.md`.

Cuando termines, actualiza `agent-comms/status.md` solo si el protocolo del repositorio lo permite, indicando que `GEMINI-003` está entregada y pendiente de revisión de Codex. Si no puedes actualizarlo sin riesgo, deja esa nota al final del informe.

La salida debe ser práctica para convertirla después en un prompt de implementación para GPT-5.6 Sol Max. No empieces Phase 2B.
