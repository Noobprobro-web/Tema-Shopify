# Agent Communication Protocol

## Autoridad vigente

1. **Usuario (Johandry / Ruiz Digital):** autoridad final sobre prioridades de negocio, nombre, direccion visual y cambios de alcance.
2. **Gemini Flash 3.8 High:** cerebro y coordinador principal. Define arquitectura operativa, scope, criterios de aceptacion, delegacion y orden de trabajo.
3. **Claude (Opus 5):** implementador técnico principal de código (Liquid, JSON, CSS, JS, schemas) desde el 2026-09-13, además de su función de auditoría senior UX/UI y disciplina técnica.
4. **GPT-5.6 Sol Max:** auditor senior de producto, UX, estrategia comercial y segunda opinión crítica.
5. **GPT-5.5 low:** tareas mecanicas puntuales, inventarios y mantenimiento ligero si se requiere.

Codex en este chat funciona como ejecutor o revisor cuando el usuario le trae una tarea. No sustituye a Gemini como cerebro salvo que el usuario cambie expresamente la autoridad.

## Responsabilidad de Gemini

Gemini debe mantener el contexto maestro y el estado real del proyecto. Es responsable de:

- Convertir prioridades del usuario en tareas acotadas.
- Definir arquitectura, alcance y criterios de aceptacion.
- Elegir el modelo adecuado para cada tarea.
- Delegar implementacion a GPT y revisiones especializadas a Claude.
- Revisar entregas, diffs, validaciones y riesgos.
- Aceptar, rechazar, pedir cambios o escalar.
- Actualizar el estado y registrar decisiones estables.

Gemini no debe implementar Phase 2B por inferencia. Debe recibir autorizacion del usuario sobre el alcance y crear una tarea explicita para GPT.

## Lectura obligatoria permanente

1. `AGENTS.md` (jerarquía, compuertas de DoD y reglas de colaboración).
2. `agent-comms/PROTOCOL-IMPLEMENTATION.md` (normativa vinculante de implementación: compuertas obligatorias, niveles de desviación 1 y 2, prohibición de ampliar scope sin autorización).
3. `agent-comms/PROTOCOL-VERIFICATION.md` (normativa vinculante de verificación: disciplina de falsificación en archivos, tabla de cierre por tipo de fila, prohibición de cerrar filas medibles sin prueba empírica).
4. `agent-comms/token-efficiency-rules.md` (reglas de ahorro de tokens y disciplina operativa).

## Flujo operativo

1. Gemini lee `AGENTS.md`, `agent-comms/PROTOCOL-VERIFICATION.md`, `agent-comms/GEMINI-LEAD-HANDOFF.md`, `agent-comms/status.md` y solo los archivos relevantes.
2. Gemini clasifica la necesidad: decision, investigacion, implementacion GPT, revision Claude, QA o pregunta al usuario.
3. Gemini crea una tarea con ID estable en `agent-comms/inbox-gpt/` o `agent-comms/inbox-claude/`.
4. El ejecutor lee la tarea y los archivos permitidos, y no amplia el alcance por su cuenta.
5. El ejecutor deja evidencia en `agent-comms/outbox-gpt/` o `agent-comms/outbox-claude/` con el mismo ID.
6. Gemini revisa diff, validaciones y riesgos. Puede pedir cambios antes de aceptar.
7. Gemini actualiza `agent-comms/status.md` y `docs/decisions.md` solo cuando el estado o la decision cambien.
8. Commit y push se realizan solo cuando la tarea o Gemini lo indique y las validaciones pasen.

## Estructura de comunicacion

- `agent-comms/GEMINI-LEAD-HANDOFF.md`: contexto maestro y contrato de liderazgo.
- `agent-comms/inbox-gemini/`: tareas historicas o solicitudes de revision para Gemini.
- `agent-comms/outbox-gemini/`: informes y decisiones de Gemini.
- `agent-comms/inbox-gpt/`: tareas de implementacion para GPT/Codex.
- `agent-comms/outbox-gpt/`: resultados y evidencia de GPT/Codex.
- `agent-comms/inbox-claude/`: tareas editoriales o UX para Claude.
- `agent-comms/outbox-claude/`: resultados de Claude.
- `agent-comms/reviews/`: revisiones, aceptaciones y cambios solicitados.
- `agent-comms/status.md`: estado corto y actual.
- `docs/decisions.md`: decisiones estables del proyecto.

## Formato de tarea

Toda tarea debe incluir:

```text
ID:
Owner:
Modelo:
Estado:
Decision requerida:
Objetivo:
Contexto minimo:
Archivos permitidos:
Archivos excluidos:
Criterios de aceptacion:
Validaciones obligatorias:
Entregable y ruta:
Reglas de escalamiento:
```

## Formato de entrega

Toda entrega debe comenzar con:

```text
ID:
Estado:
Decision requerida:
Resumen en 5 lineas:
```

Despues incluir solo hallazgos, archivos tocados, comandos y resultados, riesgos, preguntas y siguiente accion.

## Reglas de cambio

- Revisar `git status --short --branch` antes de editar.
- Preservar cambios de otros agentes despues de entenderlos.
- No modificar archivos fuera del alcance de la tarea.
- No copiar codigo, layout, assets o copy de otros temas.
- No introducir dependencias nuevas sin justificacion de peso, performance y mantenimiento.
- Mantener Liquid, CSS y JS vanilla cuando sea suficiente.
- No usar Sass/SCSS ni minificar fuentes propias.
- No afirmar validaciones que no se ejecutaron.
- No reescribir historia Git ni hacer force-push sin orden explicita del usuario.

## Escalamiento

Gemini debe escribir `ESCALATE_MODEL_RECOMMENDED` cuando haya una decision transversal, ambiguedad oficial de Shopify, riesgo real de Theme Store, conflicto entre objetivos o deuda tecnica dificil de revertir. Debe explicar el motivo en un maximo de cinco lineas.

Gemini debe escribir `CLAUDE_RECOMMENDED` solo cuando una revision concreta de copy, UX, tono, documentacion o segunda opinion aporte valor que no cubra el propio Gemini.

## Fuente de verdad

- Requisitos de Shopify: documentacion oficial actual, con fuente y fecha cuando aplique.
- Estado del repo: `agent-comms/status.md` y Git.
- Arquitectura aprobada: `docs/decisions.md` y documentos de arquitectura aceptados.
- Autoridad de coordinacion: este protocolo y `GEMINI-LEAD-HANDOFF.md`.
