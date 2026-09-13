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
- Ultimo commit de producto aprobado: `93e9174`.

## Entregas recientes

- `GPT-3B-004` auditada y aprobada al 100% mediante dictamen `GEMINI-012`.
- Las 8 plantillas restantes (`page`, `page.contact`, `blog`, `article`, `search`, `404`, `password`, `list-collections`) quedan plenamente operativas con secciones Couture.
- `main-placeholder` queda **100% eliminado del tema** (0 referencias). 52 archivos en Theme Check con 0 ofensas.
- Se genera la directiva `GPT-3B-005` en `agent-comms/inbox-gpt/GPT-3B-005-theme-store-commercial-compliance.md` para el sprint final de Phase 3B.

## Tareas de Gemini

- Liderazgo y orquestación activa de Phase 3B.
- Dictamen `GEMINI-012` emitido y sincronizado.
- Directiva `GPT-3B-005` emitida para ejecución de Cumplimiento Comercial Theme Store.

## Tareas de GPT/Codex

- Ejecutar `GPT-3B-005` (Selling plans en PDP, Shop Pay Installments, Pickup availability, Swatches nativos, Destinatario Gift Card, Product recommendations, Collection image y datos estructurados JSON-LD).
- Validar `node --check assets/theme.js` y `npx shopify theme check` con 0 ofensas.
- Entregar reporte en `agent-comms/outbox-gpt/GPT-3B-005-theme-store-commercial-compliance.md`.

## Tareas de Claude

- Pendiente pase editorial / micro-copy de `locales/en.default.json` y schemas cuando Gemini lo solicite.

## Reglas vigentes

- Leer `AGENTS.md`, `agent-comms/GEMINI-LEAD-HANDOFF.md`, `agent-comms/protocol.md` y `agent-comms/token-efficiency-rules.md`.
- No iniciar Phase 2B por inferencia.
- No usar Astra por defecto; solo con `ESCALATE_MODEL_RECOMMENDED` justificado.
- No usar Claude para duplicar la implementacion tecnica.
