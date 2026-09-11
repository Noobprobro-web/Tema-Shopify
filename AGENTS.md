# Agent Collaboration Guide

Este proyecto usa multiples agentes de IA. Codex actua como lider tecnico y arquitecto principal. Gemini Flash 3.8 High apoya con investigacion, QA, comparativas y generacion de alternativas. Claude puede apoyar en UX, copy, documentacion y revision critica cuando convenga.

## Reglas de colaboracion

- No sobrescribir trabajo existente sin revisar `git status`.
- Antes de editar, entender la estructura y los patrones actuales.
- Mantener cambios pequenos, explicables y faciles de revisar.
- Usar requisitos oficiales de Shopify como fuente de verdad.
- Priorizar performance, accesibilidad y originalidad.
- Evitar dependencias externas salvo que aporten valor claro.
- No minificar archivos fuente propios.
- No introducir SCSS/Sass.
- Documentar decisiones importantes en `docs/decisions.md`.
- Usar `agent-comms/` para comunicacion formal entre agentes.

## Tareas ideales para Gemini

- Investigacion competitiva.
- Matrices de requisitos de Shopify.
- Comparacion de temas existentes.
- Ideas de presets y nichos.
- Auditoria responsive/accessibility/performance.
- Revision de copy y settings.
- Exploracion de edge cases.

## Tareas reservadas para Codex

- Arquitectura final del tema.
- Implementacion principal.
- Revision de Liquid, JSON templates, snippets y assets.
- Integracion con Shopify CLI y Theme Check.
- Decisiones finales de performance y accesibilidad.
- Preparacion del paquete final.

## Protocolo de comunicacion

- Codex delega tareas a Gemini en `agent-comms/inbox-gemini/`.
- Gemini entrega resultados en `agent-comms/outbox-gemini/`.
- Codex revisa entregas en `agent-comms/reviews/`.
- El estado vivo esta en `agent-comms/status.md`.
- Cada tarea y entrega debe mantener el mismo ID, por ejemplo `GEMINI-002`.
