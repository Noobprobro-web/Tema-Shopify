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
- Auditoría `CODEX-AUDIT-002` recibida: confirma cero truncamiento por tokens y aporta 4 precisiones de borde (selling plans por variante, >250 variantes, tablet grid labels, y fallback sin JS).
- Se genera la directiva `GPT-3B-003-HOTFIX` en `agent-comms/inbox-gpt/GPT-3B-003-HOTFIX.md` para sellar definitivamente estos bordes.
- Se programa oficialmente el **Sprint 3B.5** para cumplimiento comercial Theme Store (selling plans PDP, Shop Pay, pickup availability, swatches nativos, gift cards, etc.) tras Sprint 3B.4.

## Tareas de Gemini

- Liderazgo y orquestación activa de Phase 3B.
- Directiva `GPT-3B-003-HOTFIX` emitida.
- Directiva `GPT-3B-004` lista para ejecución inmediata tras el hotfix.

## Tareas de GPT/Codex

- Ejecutar `GPT-3B-003-HOTFIX` (Selling plans por variante en bundle, protección >250 variantes, nombres semánticos de grid switcher y fallback sin JS).
- Validar `node --check assets/theme.js` y `npx shopify theme check` con 0 ofensas.
- Proceder de inmediato al Sprint 3B.4 (`GPT-3B-004`).

## Tareas de Claude

- Pendiente pase editorial / micro-copy de `locales/en.default.json` y schemas cuando Gemini lo solicite.

## Reglas vigentes

- Leer `AGENTS.md`, `agent-comms/GEMINI-LEAD-HANDOFF.md`, `agent-comms/protocol.md` y `agent-comms/token-efficiency-rules.md`.
- No iniciar Phase 2B por inferencia.
- No usar Astra por defecto; solo con `ESCALATE_MODEL_RECOMMENDED` justificado.
- No usar Claude para duplicar la implementacion tecnica.
