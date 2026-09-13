# Agent Collaboration Guide

Este proyecto usa multiples agentes de IA. Desde el handoff de `GEMINI-003`, Gemini Flash 3.8 High es el cerebro del proyecto: coordina, decide la arquitectura tecnica, mantiene el scope, prioriza riesgos y valida las entregas. GPT/Codex y Claude son fuerzas de ejecucion especializadas bajo sus directrices. El usuario conserva la autoridad final sobre prioridades, nombre, direccion comercial y cambios de alcance.

## Autoridad vigente

1. **Usuario (Johandry / Ruiz Digital):** dueño del proyecto, prioridades de negocio, aprobaciones grandes y cambios de alcance.
2. **Gemini Flash 3.8 High:** cerebro/orquestador; define arquitectura, criterios de aceptacion, orden de trabajo, delegacion y decision tecnica operativa.
3. **Claude (Opus 5):** implementador principal de Liquid, JSON, CSS, JS, schemas y correcciones técnicas complejas (reasignado por Johandry el 2026-09-13 para asumir las tareas de código). Mantiene además su rol de auditoría senior UX/UI y disciplina técnica.
4. **GPT-5.6 Sol Max:** auditor senior de producto, UX, estrategia comercial, segunda opinión y detección de riesgos en Theme Store (reasignado por Johandry para optimizar su cuota restante sin escribir código).
5. **GPT-5.5 low:** tareas mecánicas puntuales, inventarios, parseos y QA simple si fuera requerido.

Si un agente ejecutor aparece como Codex, actua como implementador/revisor operativo y no sustituye la autoridad vigente de Gemini. Las decisiones que afecten producto o alcance mas alla de lo aprobado vuelven al usuario.

## Reglas de colaboracion

- No sobrescribir trabajo existente sin revisar `git status`.
- Antes de editar, entender la estructura y los patrones actuales.
- Mantener cambios pequenos, explicables y faciles de revisar.
- Usar requisitos oficiales de Shopify como fuente de verdad.
- Priorizar performance, accesibilidad y originalidad.
- Evitar dependencias externas salvo que aporten valor claro y Gemini apruebe su uso.
- No minificar archivos fuente propios.
- No introducir SCSS/Sass.
- Documentar decisiones importantes en `docs/decisions.md` o `agent-comms/reviews/`.
- Usar `agent-comms/` para comunicacion formal entre agentes.
- Leer y seguir `agent-comms/token-efficiency-rules.md` para ahorrar tokens sin degradar calidad.
- Lectura obligatoria permanente: `agent-comms/PROTOCOL-IMPLEMENTATION.md` (normativa vinculante para cualquier agente que implemente código) y `agent-comms/PROTOCOL-VERIFICATION.md` (normativa vinculante para Gemini y cualquier agente auditor al verificar entregas).
- No iniciar Phase 2B por inferencia: requiere directiva de Gemini y autorizacion de alcance del usuario.

## Definition of Done (Las 5 Compuertas Obligatorias)

Ninguna entrega de código o sprint técnico se da por aceptada si falla una sola de estas cinco compuertas. Aplican tanto a GPT al implementar como a Gemini al auditar y autorizar commits:

1. **Compuerta de Requisitos (Ledger Vivo):**
   - Cada entrega debe declarar explícitamente qué filas de `docs/requirements-ledger.md` cierra o modifica.
   - Cada fila cerrada debe acompañarse de evidencia concreta verificable (`archivo:línea` o nombre de prueba en tienda real). "Theme Check pasa" o "Lo implementó el modelo" NO es evidencia.
2. **Compuerta de Estados Degenerados:**
   - Todo componente o sección nueva/modificada debe recorrerse en cinco estados límite antes de cerrar:
     - *Vacío:* Colección sin productos, carrito vacío, recomendaciones sin resultados, blog sin artículos.
     - *Uno solo:* Colección de 1 producto, 1 variante, 1 artículo.
     - *Muchos:* 10+ imágenes de galería, 40 variantes, 200 productos paginados.
     - *Muy largo:* Título de producto de 120 caracteres, vendor extenso, precios con decimales y símbolos largos.
     - *Faltante:* Producto sin imagen, producto sin descripción, imagen secundaria ausente.
3. **Compuerta de Consistencia entre Archivos:**
   - Obligatorio auditar antes de cerrar: ¿Este valor numérico, formato de moneda, token CSS o variable ya existe en otro archivo del tema? Evitar duplicaciones hardcodeadas (ej. umbrales de envío, clases redundantes, formatos manuales con `Intl` en vez de `shop.money_format`).
4. **Compuerta de Superficie del Comerciante:**
   - Todos los labels de configuración deben estar en sentence case y redactados en inglés neutro comprensible.
   - Prohibido el vocabulario interno de desarrollo ("popover", "intent", "bento") o de marca no configurable ("atelier gift").
   - Es obligatorio incluir el atributo `info` explicativo en cualquier setting que dependa de una configuración externa (tarifas de envío, apps de suscripción, descuentos automáticos, metafields).
   - 100% de los labels de schema deben gestionarse mediante claves de localización `t:`.
5. **Compuerta de Verificación en Tienda Real:**
   - Ninguna funcionalidad crítica para Theme Store se declara `cumplida` únicamente con análisis estático.
   - Es obligatoria la prueba en la tienda de desarrollo de Shopify con catálogo demo y en móvil simulado antes de la submission final.

## Tareas ideales para Gemini

- Mantener el contexto maestro y el estado vivo.
- Revisar informes de investigacion, QA y producto.
- Definir arquitectura final de Liquid, JSON, sections, snippets, assets y componentes.
- Convertir recomendaciones en prompts cerrados para GPT/Claude.
- Priorizar requisitos Shopify, riesgos de Theme Store, performance y accesibilidad.
- Resolver conflictos entre propuestas y documentar decisiones.
- Revisar diffs y evidencia de validacion antes de aceptar una entrega.
- Decidir cuando escalar a otro modelo o pedir una revision editorial.

## Tareas de GPT/Codex

- Implementar exactamente el alcance escrito por Gemini.
- Revisar `git status` y los archivos referenciados antes de editar.
- Ejecutar Theme Check, parseos, checks de sintaxis y QA proporcional.
- Mantener cambios pequenos, originales y sin dependencias nuevas.
- Reportar archivos tocados, comandos, resultados, riesgos y bloqueos en `agent-comms/outbox-gpt/`.
- No cambiar arquitectura, scope o decisiones aprobadas sin devolver una propuesta a Gemini.
- Crear commit/push solo cuando la directiva de Gemini lo incluya y la validacion pase.

## Tareas ideales para Claude

- Revision editorial de documentacion merchant-facing.
- Revision de copy, labels, empty states y mensajes de error.
- Segunda opinion UX/producto.
- Auditoria de claridad, tono premium y conversion.
- Auditorias tecnicas puntuales solo cuando Gemini las asigne con criterios concretos.

## Protocolo de comunicacion

- El punto de entrada vigente para Gemini es `agent-comms/GEMINI-LEAD-HANDOFF.md`.
- Gemini puede recibir tareas en `agent-comms/inbox-gemini/` y dejar decisiones o sintesis en `agent-comms/outbox-gemini/`.
- Gemini delega implementacion a GPT en `agent-comms/inbox-gpt/`; GPT entrega resultados en `agent-comms/outbox-gpt/`.
- Gemini puede delegar revisiones a Claude en `agent-comms/inbox-claude/`; Claude entrega en `agent-comms/outbox-claude/`.
- Las revisiones y aceptaciones quedan en `agent-comms/reviews/`.
- El estado vivo esta en `agent-comms/status.md` y las decisiones estables en `docs/decisions.md`.
- Cada tarea y entrega mantiene un ID estable (`GEMINI-003`, `GPT-2B-001`, `CLAUDE-2B-001`, etc.).
- Si un agente no puede escribir en una carpeta de comunicacion, entrega el texto al usuario sin inventar que el archivo fue creado.

## Modelo y escalamiento

- Gemini Flash 3.8 High toma las decisiones de arquitectura y coordina las fases.
- GPT-5.6 Sol Max se reserva para implementacion transversal, Liquid/CSS/JS no trivial, schemas y bugs complejos.
- GPT-5.5 low se usa para trabajo corto, documentacion, prompts, commits y QA simple.
- Claude se usa para claridad editorial, UX y segunda opinion cuando aporte una mirada distinta.
- Gemini debe marcar `ESCALATE_MODEL_RECOMMENDED` cuando exista riesgo transversal, ambiguedad de Shopify, posible rechazo en Theme Store o conflicto no resoluble con la evidencia disponible.
