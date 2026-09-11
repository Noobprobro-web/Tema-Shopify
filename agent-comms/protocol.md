# Agent Communication Protocol

## Roles

Codex:

- Lider tecnico y arquitecto principal.
- Define tareas, criterios de aceptacion y decisiones finales.
- Revisa entregas de Gemini antes de que entren al plan oficial.
- Implementa o aprueba la implementacion.

Gemini:

- Agente de investigacion, QA, comparacion y propuestas.
- Completa tareas delegadas sin cambiar la arquitectura final por su cuenta.
- Entrega hallazgos claros, verificables y accionables.

Usuario:

- Lleva mensajes entre agentes cuando sea necesario.
- Decide prioridades de producto junto con Codex.
- Aprueba direccion visual, nombre y decisiones comerciales grandes.

## Flujo

1. Codex crea una tarea en `agent-comms/inbox-gemini/`.
2. El usuario le dice a Gemini que revise su inbox.
3. Gemini crea una entrega en `agent-comms/outbox-gemini/` usando el mismo ID.
4. El usuario le dice a Codex que Gemini termino.
5. Codex revisa la entrega y crea una nota en `agent-comms/reviews/`.
6. Si se acepta, Codex actualiza docs oficiales como `docs/decisions.md`, `docs/roadmap.md` o documentos de arquitectura.

## Formato de Tarea

Cada tarea debe incluir:

- ID.
- Objetivo.
- Contexto.
- Archivos a leer.
- Entregable esperado.
- Criterios de aceptacion.
- Reglas y limites.

## Formato de Entrega

Cada entrega de Gemini debe incluir:

- ID de tarea.
- Resumen ejecutivo.
- Hallazgos.
- Recomendaciones.
- Riesgos.
- Archivos creados o modificados.
- Preguntas para Codex/usuario.

## Reglas

- No editar archivos fuera del alcance de la tarea.
- No borrar archivos.
- No cambiar decisiones aprobadas sin proponerlo primero.
- No introducir dependencias nuevas sin justificar impacto en performance y mantenimiento.
- No copiar codigo, layout, assets o copy de temas existentes.
- Citar fuentes para requisitos oficiales o datos que puedan cambiar.
- Marcar supuestos.
- Seguir `agent-comms/token-efficiency-rules.md`.

## Escalamiento de Modelo

El usuario tiene acceso a modelos superiores, pero Codex puede operar en GPT 5.5 low para coordinacion y trabajo liviano.

Usar o recomendar un modelo superior cuando:

- Se define arquitectura base del tema Shopify.
- Se toman decisiones transversales sobre Liquid, JSON templates, sections, snippets, assets o scripts.
- Se disena el sistema final de tokens, presets, schemas y patrones reutilizables.
- Se resuelven errores complejos de Shopify CLI, Theme Check, Liquid, accesibilidad o performance.
- Se prepara una auditoria completa de Theme Store acceptance.
- Se hace revision final antes de empaquetar o publicar.

Gemini debe indicar en sus reportes cualquier punto donde recomiende revision por Codex con modelo superior antes de implementar.
