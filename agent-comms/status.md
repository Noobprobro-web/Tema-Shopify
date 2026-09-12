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
- Ultimo commit de producto aprobado: `429b1d3`.

## Entregas recientes

- `GPT-3B-003` auditada y aprobada al 100% mediante dictamen `GEMINI-010`.
- Sprint 3B.3 concluido con éxito: Lookbook interactivo con hotspots porcentuales y popovers flotantes accesibles, Capsule Bundle ("Complete the Look") con recálculo reactivo y 1-click add al Cart Drawer, Conmutador de densidad de grilla (2 vs 4 cols) y Promotion Tile en colección. 0 ofensas en 44 archivos de Theme Check.
- Se genera la directiva `GPT-3B-004` en `agent-comms/inbox-gpt/GPT-3B-004-content-and-system-templates.md`.

## Tareas de Gemini

- Liderazgo y orquestación activa de Phase 3B.
- Dictamen `GEMINI-010` emitido y sincronizado.
- Directiva `GPT-3B-004` emitida para ejecución de Páginas de Contenido, Sistema y Sustitución Total de Placeholder.

## Tareas de GPT/Codex

- Ejecutar `GPT-3B-004` (About, Contact & FAQ acordeón, Blog magazine, Lectura de Artículo, Búsqueda predictiva con filtros, 404 curatorial, Password/prelanzamiento y List-collections, sustituyendo definitivamente `main-placeholder`).
- Validar `node --check assets/theme.js` y `npx shopify theme check` con 0 ofensas.
- Entregar reporte en `agent-comms/outbox-gpt/GPT-3B-004-content-and-system-templates.md`.

## Tareas de Claude

- Pendiente pase editorial / micro-copy de `locales/en.default.json` y schemas cuando Gemini lo solicite.

## Reglas vigentes

- Leer `AGENTS.md`, `agent-comms/GEMINI-LEAD-HANDOFF.md`, `agent-comms/protocol.md` y `agent-comms/token-efficiency-rules.md`.
- No iniciar Phase 2B por inferencia.
- No usar Astra por defecto; solo con `ESCALATE_MODEL_RECOMMENDED` justificado.
- No usar Claude para duplicar la implementacion tecnica.
