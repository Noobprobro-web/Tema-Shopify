# Token Efficiency Rules

Objetivo: reducir contexto repetido y trabajo duplicado sin omitir requisitos de Shopify, accesibilidad, performance ni validacion.

## Lectura minima

En cada tarea, el agente debe leer solo:

1. `AGENTS.md`.
2. `agent-comms/PROTOCOL-IMPLEMENTATION.md` (si la tarea involucra implementación de código o schema).
3. `agent-comms/PROTOCOL-VERIFICATION.md` (si la tarea involucra revisión, auditoría o cierre en el ledger).
4. `agent-comms/GEMINI-LEAD-HANDOFF.md` si coordina o necesita contexto maestro.
5. `agent-comms/status.md`.
6. `agent-comms/protocol.md`.
7. Su tarea activa.
8. Los archivos que la tarea enumere.

No leer el repo completo por defecto. No pegar contenido de archivos ya conocidos; citar rutas y lineas o nombres de seccion cuando baste.

## Jerarquia de modelos

### Gemini Flash 3.8 High: cerebro
Usarlo para coordinacion, arquitectura operativa, priorizacion, criterios de aceptacion, verificacion en codigo, sintesis de informes, conflictos y delegacion. Gemini conserva el contexto maestro y decide el siguiente trabajo.

### Claude (Opus 5): implementador principal y auditor senior UX
Usarlo para Liquid/CSS/JS/JSON, schemas, componentes, adaptaciones responsive, controles de accesibilidad y cierre de código del ledger (reasignado como implementador principal el 2026-09-13). Mantiene además su rol senior de tono premium, claridad UX y ergonomía del comerciante.

### GPT-5.6 Sol Max: auditor senior de producto y estrategia comercial
Usarlo para análisis de posicionamiento comercial, segunda opinión crítica, auditoría de precios y detección de riesgos sutiles de rechazo en Theme Store (optimizando su 14% de cuota restante sin generar código).

### GPT-5.5 low: trabajo mecanico
Usarlo para inventarios, parseos y QA simple si se requiere.

### GPT-6 Astra u otro modelo superior

No es el modelo por defecto. Gemini debe marcar `ESCALATE_MODEL_RECOMMENDED` solo si hay riesgo transversal, conflicto no resoluble, ambiguedad oficial, posible rechazo de Theme Store o deuda tecnica grande.

## Regla de delegacion

Un solo agente debe ser responsable de cada entregable. Gemini coordina; GPT implementa; Claude critica o mejora la capa editorial; el usuario decide cambios de producto. No pedir la misma tarea a varios modelos salvo que se trate de una comparacion deliberada.

## Prompts eficientes

Cada tarea debe incluir objetivo, archivos permitidos, archivos excluidos, criterios de aceptacion, validaciones y ruta de entrega. Evitar historia larga, adjetivos, instrucciones repetidas y listas no accionables.

Preferir:

```text
Lee A, B y C. Implementa X en D. No toques E. Valida F y entrega el resumen en G.
```

Evitar pegar el contenido de A, B y C dentro del prompt.

## Entregas compactas

Toda entrega comienza con:

```text
ID:
Estado:
Decision requerida:
Resumen en 5 lineas:
```

Limites recomendados:

- Resumen ejecutivo: 5 lineas.
- Recomendaciones: maximo 10 y priorizadas P0/P1/P2.
- Riesgos: solo los que cambien una decision.
- Validaciones: comando y resultado, sin logs completos salvo fallo.
- Código: solo diffs o rutas; no pegar archivos enteros.

## Memoria compartida

- `status.md` solo contiene estado actual y proximos pasos.
- `docs/decisions.md` contiene decisiones estables, no conversaciones.
- `agent-comms/reviews/` contiene aceptaciones o cambios solicitados.
- `outbox-*` contiene una entrega por ID.
- Cuando una tarea termina, el agente debe apuntar a los archivos relevantes y no recontar el contexto.

## Escalamiento economico

Escalar por complejidad, no por costumbre. Antes de pedir Astra o Claude, Gemini debe responder en maximo tres lineas: que decision esta en juego, por que el modelo actual no basta y que artefacto concreto se espera.

## Calidad no negociable

Ahorrar tokens nunca justifica saltarse:

- requisitos oficiales de Shopify,
- accesibilidad,
- performance,
- mobile-first,
- originalidad,
- Theme Check,
- parseo JSON/Liquid,
- documentacion merchant-facing cuando sea necesaria.

## Git

- Revisar estado antes de editar.
- Agrupar cambios coherentes en un commit.
- Usar mensajes cortos y descriptivos.
- Hacer push al terminar una entrega relevante cuando la conectividad lo permita.
- No reescribir historia sin orden explicita.
