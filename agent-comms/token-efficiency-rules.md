# Token Efficiency Rules

Reglas obligatorias para ahorrar tokens sin sacrificar calidad tecnica, producto ni aceptacion futura en Shopify Theme Store.

## Objetivo

Reducir repeticion, contexto innecesario y trabajo duplicado entre agentes. Cada agente debe leer solo lo necesario, producir entregables accionables y escalar de modelo solo cuando aporte valor real.

## Lectura Minima Por Agente

Antes de trabajar, cualquier agente debe leer:

1. `AGENTS.md`
2. `agent-comms/protocol.md`
3. `agent-comms/status.md`
4. Su tarea especifica en `agent-comms/inbox-*` o el archivo que el usuario indique.

Luego solo debe leer los archivos referenciados por esa tarea.

No leer todo el repo "por si acaso". Si falta contexto, pedir o buscar el archivo especifico.

## Jerarquia de Modelos

### Nivel 1: Coordinacion Economica

Usar GPT 5.5 low, Gemini Flash o equivalente para:

- Crear/resumir tareas.
- Actualizar estado.
- Redactar prompts.
- Revisar documentos cortos.
- Hacer commits/push.
- Crear checklists.
- QA exploratorio simple.
- Investigar referencias y resumir hallazgos.

### Nivel 2: Trabajo Tecnico Moderado

Usar modelo medio/alto cuando:

- Se modifica codigo Liquid/CSS/JS en varias piezas.
- Se disenan schemas de secciones.
- Se revisan bugs no triviales.
- Se integran varias recomendaciones de agentes.
- Se decide scope de MVP.

### Nivel 3: Decision Critica

Usar modelo superior de OpenAI, preferiblemente en high/xhigh/max, cuando:

- Se define arquitectura base del tema.
- Se crea o cambia estructura de templates/sections/snippets/assets.
- Se define el sistema final de tokens, presets o patrones reutilizables.
- Se hace auditoria seria de performance/accesibilidad.
- Se prepara el paquete o revision final de Theme Store.
- Hay conflicto entre recomendaciones de agentes.
- Una decision incorrecta podria generar deuda tecnica grande.

## Jerarquia de Roles

1. Usuario: prioridad de negocio, gusto, aprobaciones grandes.
2. Codex: arquitecto principal, decision tecnica final e implementacion principal.
3. Gemini: investigacion, matrices, QA, propuestas y soporte de bajo costo.
4. Claude u otros modelos: revision editorial, UX, segunda opinion o auditorias puntuales.

Si hay conflicto, Codex sintetiza y propone una decision al usuario.

## Reglas Para Delegar

Codex debe delegar a Gemini cuando la tarea sea:

- Investigacion extensa.
- Comparacion de alternativas.
- Checklist o matriz.
- Revision de copy/settings.
- QA de accesibilidad/performance basado en criterios.
- Deteccion de edge cases.

Codex no debe delegar completamente:

- Arquitectura final.
- Cambios sensibles de codigo.
- Decisiones de performance.
- Decisiones de accesibilidad compleja.
- Preparacion final para Theme Store.

## Formato Eficiente de Entregas

Toda entrega debe empezar con:

```text
ID:
Estado:
Decision requerida:
Resumen en 5 lineas:
```

Luego incluir solo secciones utiles para actuar:

- Hallazgos.
- Recomendaciones.
- Riesgos.
- Archivos tocados.
- Siguiente accion propuesta.

Evitar:

- Repetir todo el contexto del proyecto.
- Pegar documentos completos ya existentes.
- Listas largas sin prioridad.
- Copy motivacional.
- Explicar obviedades.

## Reglas de Archivos

- Guardar entregas de Gemini en `agent-comms/outbox-gemini/`.
- Guardar revisiones de Codex en `agent-comms/reviews/`.
- Actualizar `agent-comms/status.md` solo cuando cambie el estado real.
- Actualizar `docs/decisions.md` solo con decisiones aprobadas o estables.
- No duplicar el mismo contenido en muchos archivos.

## Reglas de Contexto

- Referenciar archivos por ruta en vez de copiar su contenido completo.
- Resumir documentos largos antes de pedir una decision.
- Para una tarea nueva, incluir solo:
  - objetivo,
  - archivos a leer,
  - entregable esperado,
  - criterios de aceptacion.
- Si una entrega depende de datos externos actuales, citar fuente y fecha.

## Reglas de Git

- Antes de trabajar: `git status --short --branch`.
- Commit despues de cambios coherentes, no por cada microedicion.
- Mensajes de commit cortos y claros.
- Push al terminar una fase o entrega relevante.
- No reescribir historia sin orden explicita del usuario.

## Reglas de Implementacion

- Cambios pequenos y verificables.
- Preferir patrones del repo.
- No introducir dependencias sin justificar:
  - peso,
  - impacto performance,
  - mantenimiento,
  - alternativa sin dependencia.
- Priorizar vanilla JS, CSS y Liquid nativo.
- Evitar abstracciones prematuras.
- Crear tests/QA proporcional al riesgo.

## Reglas de Shopify Theme Store

Ahorrar tokens nunca justifica saltarse:

- Requisitos oficiales.
- Accesibilidad.
- Performance.
- Mobile-first.
- Originalidad.
- Theme Check.
- Documentacion merchant-facing.

## Cuando Pedir Escalamiento

Un agente debe escribir `ESCALATE_MODEL_RECOMMENDED` si detecta:

- Decision arquitectonica transversal.
- Ambiguedad en requisitos Shopify.
- Riesgo de rejection en Theme Store.
- Riesgo de performance o accesibilidad.
- Cambio que afecte muchos templates/sections.
- Conflicto entre objetivos: belleza, conversion, performance o personalizacion.

Debe explicar en maximo 5 lineas por que recomienda escalar.

