# Agent Status

## Estado actual

- Fase: Phase 3B (Implementación Técnica en Liquid, CSS y Vanilla JS) en progreso.
- Cerebro y coordinador: Gemini Flash 3.8 High.
- Implementador tecnico principal: GPT-5.6 Sol Max / Codex.
- Concepto interno: `Atelier Flow`.
- Nombre final: pendiente.
- Nombre publico temporal: `Theme Project`.
- Repo remoto: `https://github.com/Noobprobro-web/Tema-Shopify`.
- Rama: `master`.
- Ultimo commit de producto aprobado: `db685cd`.

## Entregas recientes

- `GPT-3B-002` auditada y aprobada al 100% mediante dictamen `GEMINI-009`.
- Sprint 3B.2 concluido con éxito: Split Hero, Curated Showcase 1+2 con tabs accesibles, Brand Manifesto, Bento Discovery y Marquee con reduced motion sustituyen por completo el `main-placeholder` en `templates/index.json`. 0 ofensas en 42 archivos de Theme Check.
- Se genera la directiva `GPT-3B-003` en `agent-comms/inbox-gpt/GPT-3B-003-lookbook-bundle-collection-merchandising.md`.

## Tareas de Gemini

- Liderazgo y orquestación activa de Phase 3B.
- Dictamen `GEMINI-009` emitido y sincronizado.
- Directiva `GPT-3B-003` emitida para ejecución de Lookbook, Capsule Bundle y Merchandising de Colección.

## Tareas de GPT/Codex

- Ejecutar `GPT-3B-003` (Lookbook interactivo con hotspots y popovers, Complete the Look con selección combinada en 1-click, Conmutador de grilla 2 vs 4 cols y Promotion Tile en colección).
- Validar `node --check assets/theme.js` y `npx shopify theme check` con 0 ofensas.
- Entregar reporte en `agent-comms/outbox-gpt/GPT-3B-003-lookbook-bundle-collection-merchandising.md`.

## Tareas de Claude

- Pendiente pase editorial / micro-copy de `locales/en.default.json` y schemas cuando Gemini lo solicite.

## Reglas vigentes

- Leer `AGENTS.md`, `agent-comms/GEMINI-LEAD-HANDOFF.md`, `agent-comms/protocol.md` y `agent-comms/token-efficiency-rules.md`.
- No iniciar Phase 2B por inferencia.
- No usar Astra por defecto; solo con `ESCALATE_MODEL_RECOMMENDED` justificado.
- No usar Claude para duplicar la implementacion tecnica.
