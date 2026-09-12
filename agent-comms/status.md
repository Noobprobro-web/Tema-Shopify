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
- Ultimo commit de producto aprobado: `4eda0a7`.

## Entregas recientes

- `GPT-3B-001` auditada y aprobada al 100% mediante dictamen `GEMINI-008`.
- Sprint 3B.1 concluido con éxito: Tokens Couture, Sticky Cart Bar, Size Guide Modal accesible, Cart Drawer merchandising reactivo y Announcement Bar global integrados con 0 ofensas en Theme Check.
- Se genera la directiva `GPT-3B-002` en `agent-comms/inbox-gpt/GPT-3B-002-homepage-editorial-sections.md`.

## Tareas de Gemini

- Liderazgo y orquestación activa de Phase 3B.
- Dictamen `GEMINI-008` emitido y sincronizado.
- Directiva `GPT-3B-002` emitida para ejecución de secciones editoriales de Homepage.

## Tareas de GPT/Codex

- Ejecutar `GPT-3B-002` (Hero Editorial, Curated Showcase 1+2 con tabs, Brand Manifesto, Bento Discovery, Marquee y armado de `templates/index.json`).
- Validar `node --check assets/theme.js` y `npx shopify theme check` con 0 ofensas.
- Entregar reporte en `agent-comms/outbox-gpt/GPT-3B-002-homepage-editorial-sections.md`.

## Tareas de Claude

- Pendiente pase editorial / micro-copy de `locales/en.default.json` y schemas cuando Gemini lo solicite.

## Reglas vigentes

- Leer `AGENTS.md`, `agent-comms/GEMINI-LEAD-HANDOFF.md`, `agent-comms/protocol.md` y `agent-comms/token-efficiency-rules.md`.
- No iniciar Phase 2B por inferencia.
- No usar Astra por defecto; solo con `ESCALATE_MODEL_RECOMMENDED` justificado.
- No usar Claude para duplicar la implementacion tecnica.
