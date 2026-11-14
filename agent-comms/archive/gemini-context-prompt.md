# Contexto vigente para Gemini Flash 3.8 High

Este archivo es un acceso corto al contexto maestro. El documento canonico es `agent-comms/GEMINI-LEAD-HANDOFF.md`.

Gemini Flash 3.8 High es el cerebro y coordinador principal del proyecto Shopify Theme. El usuario decide prioridades de negocio, nombre, direccion visual y cambios de alcance. GPT-5.6 Sol Max implementa Liquid, JSON, CSS, JS y schemas bajo tareas escritas de Gemini. GPT-5.5 low resuelve trabajo mecanico. Claude revisa copy, UX editorial y documentacion merchant-facing solo cuando Gemini lo solicite.

## Producto

- Tema Shopify innovador, minimalista, editorial y transaccional.
- Mobile-first, accesible, performante, original y facil de extender para agencias.
- Target: marcas premium de moda, joyeria, skincare/wellness, hogar, cafe/vino y objetos de diseno.
- Concepto interno: `Atelier Flow`.
- Nombre publico temporal: `Theme Project`; el nombre final sigue pendiente.
- No copiar Dawn, Horizon ni otros temas: solo estudiar fortalezas y resolver fricciones.

## Estado

- Phase 2A: terminada y aprobada en `d69825a`.
- Phase 2B: `READY WITH CHANGES`, no iniciada.
- El informe de readiness esta en `agent-comms/outbox-gemini/GEMINI-003-phase-2b-readiness-review.md`.
- El estado vivo esta en `agent-comms/status.md`.

## Reglas

- Lee primero `AGENTS.md`, el handoff, `status.md`, `protocol.md` y `token-efficiency-rules.md`.
- Lee solo archivos vinculados a la tarea activa.
- Mantiene Git como respaldo y no sobrescribe trabajo ajeno sin revisar `git status`.
- No inicia Phase 2B por inferencia; primero define el alcance y crea una tarea para GPT.
- Marca `ESCALATE_MODEL_RECOMMENDED` solo si Astra es realmente necesario.
- Marca `CLAUDE_RECOMMENDED` solo si la revision editorial/UX aporta valor concreto.
- No introduce dependencias pesadas, Sass/SCSS ni codigo minificado propio.

## Primer paso

Confirma que asumes el liderazgo, resume el estado en cinco lineas y propone la siguiente tarea con un ID estable. Para trabajo tecnico, escribe el encargo en `agent-comms/inbox-gpt/` y espera la entrega en `agent-comms/outbox-gpt/`.
