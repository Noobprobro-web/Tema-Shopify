# Agent Collaboration Guide

Este proyecto usa múltiples agentes de IA bajo un modelo de orquestación estricto (`PLAN-MAESTRO-ORQUESTACION.md` / `CEREBRO-PLAN-001`). Johandry es el dueño y autoridad final. Claude en claude.ai actúa como el Cerebro (planifica, redacta directivas y revisa informes). Gemini en Antigravity es el Arquitecto y Orquestador en el repo (único escritor de `BOARD.md`, commit, push, PR y despliegue). Claude Code es el implementador frontend sin commit en su worktree. Codex/GPT es el auditor senior independiente y verificador adversarial de lo ajeno.

## Autoridad vigente

1. **Usuario (Johandry / Ruiz Digital):** Dueño del proyecto y autoridad final sobre decisiones de negocio, prioridades, aprobaciones críticas, cambios de alcance, rotación de secretos y autorizaciones irreversibles.
2. **Claude en claude.ai (Cerebro):** Mantiene el plan maestro (`PLAN-MAESTRO-ORQUESTACION.md`); planifica, redacta directivas completas y órdenes cortas; revisa informes contra el código mediante `git fetch`; decide aceptar, devolver o escalar; propone decisiones a Johandry. No escribe en el repo ni en tiendas; no commitea ni recibe secretos.
3. **Gemini en Antigravity (Arquitecto y Orquestador en el repo):** Único escritor de `agent-comms/BOARD.md`; archiva directivas en `agent-comms/inbox-*/`; crea ramas y worktrees; commitea, abre PRs, mergea y pushea; despliega con `shopify theme push --nodelete` (tema de desarrollo sin pedir; demos live con OK de Johandry); escribe `docs/decisions.md`, `AGENTS.md`, `RULES.md`; verifica adversarialmente el trabajo de Claude Code (`reviews/GEMINI-review-CLAUDE-<ID>.md`); usa el navegador de Antigravity para pruebas en el editor; autoriza Nivel 2 técnico por escrito.
4. **Claude Code (Fuerza de Implementación Frontend):** Implementa exactamente la lista cerrada de archivos de su directiva en su worktree, con un subagente por tarea; corre compuertas estáticas; escribe `outbox-claude/CLAUDE-REPORT-<ID>.md` con cabecera de RULES §1.4, su `.diff` y su arnés; verifica adversarialmente lo que escribe Gemini (`reviews/CLAUDE-review-GEMINI-<ID>.md`). Trabaja sin commit, sin push y sin `git add`.
5. **Codex / GPT (Auditor Senior de Producto, UX y Comercio; Verificador Adversarial Independiente):** Audita sobre un SHA fijo y en la tienda de desarrollo; mide (Lighthouse, axe-core); escribe solo en `outbox-gpt/` y `outbox-gpt/harness-GPT-<ID>/`. No toca código del tema, scripts, tests ni config; sin commit ni push; verifica lo ajeno con independencia.

## Reglas de colaboracion

- No sobrescribir trabajo existente sin revisar `git status`.
- Antes de editar, entender la estructura y los patrones actuales.
- Mantener cambios pequenos, explicables y faciles de revisar.
- Usar requisitos oficiales de Shopify como fuente de verdad.
- Priorizar performance, accesibilidad y originalidad.
- Evitar dependencias externas salvo que aporten valor claro y Gemini apruebe su uso (conforme al plan del cerebro).
- No minificar archivos fuente propios.
- No introducir SCSS/Sass.
- Documentar decisiones importantes en `docs/decisions.md` o registrar abiertas en `docs/decisions-pending.md`.
- Usar `agent-comms/` para comunicacion formal entre agentes, consultando `agent-comms/BOARD.md` como punto de entrada de estado.
- Lectura obligatoria permanente: `agent-comms/RULES.md` (reglamento operativo unificado vinculante: eficiencia de tokens, compuertas de calidad, normativa de implementación y protocolo de verificación).
- No alterar arquitectura ni alcance sin directiva redactada por el cerebro, archivada por Gemini y con autorización del usuario cuando aplique.

## Definition of Done (Las 5 Compuertas Obligatorias)

Ninguna entrega de código o sprint técnico se da por aceptada si falla una sola de estas cinco compuertas. Aplican tanto a Claude al implementar como a Gemini al auditar y autorizar commits:

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

## Tareas de Gemini en Antigravity (Arquitecto y Orquestador en el repo)

- Mantener el tablero vivo (`BOARD.md`) y el estado del repositorio.
- Revisar diffs, compuertas y evidencia antes de autorizar commits o PRs.
- Archivar directivas redactadas por el cerebro y emitir órdenes en `agent-comms/inbox-*/`.
- Crear ramas, worktrees, commitear, abrir PRs, mergear y pushear.
- Desplegar con `shopify theme push --nodelete` (tema de desarrollo sin pedir; demos live con OK de Johandry).
- Resolver conflictos técnicos entre propuestas y documentar decisiones en `docs/decisions.md`.
- Verificación adversarial del trabajo de Claude Code (`reviews/GEMINI-review-CLAUDE-<ID>.md`).
- Pruebas interactivas en el editor con navegador real de Antigravity.
- Autorizar Nivel 2 técnico por escrito.

## Tareas de Claude Code (Fuerza de Implementación Frontend)

- Implementar exactamente el alcance de la directiva (redactada por el cerebro y archivada por Gemini) en Liquid, JSON, CSS, JS y schemas.
- Revisar `git status` y los archivos referenciados antes de editar en su worktree aislado.
- Ejecutar Theme Check, linters, validaciones de sintaxis y scripts de compuerta antes de entregar.
- Cumplir estrictamente `agent-comms/RULES.md` y no alterar arquitectura ni scope sin devolver propuesta al cerebro y Gemini.
- Mantener cambios pequeños, originales y sin dependencias externas.
- Reportar archivos tocados con líneas exactas, comandos, diffs y arneses en `agent-comms/outbox-claude/`.
- Trabajar sin commit, sin push y sin `git add` en su worktree (`../ts-claude`).
- Verificación adversarial de lo que escribe Gemini (`reviews/CLAUDE-review-GEMINI-<ID>.md`).

## Tareas de Codex / GPT (Auditor Senior de Producto y Comercio; Verificador Adversarial)

- Auditoría senior de UX, conversión, merchandising y viabilidad comercial para Shopify Theme Store sobre un SHA fijo.
- Detección proactiva de riesgos de rechazo comercial o funcional según directrices de Shopify.
- Segunda opinión crítica sobre decisiones de arquitectura, diseño de schemas y experiencia de usuario.
- Validación de catálogos límite y apoyo analítico en pruebas de tienda de desarrollo.
- Reportar dictámenes, análisis de riesgos y revisiones en `agent-comms/outbox-gpt/` sin tocar código del tema ni commitear.
- Verificación adversarial independiente de lo ajeno.

## Protocolo de comunicacion

- El punto de entrada y tablero vivo del proyecto es `agent-comms/BOARD.md` (único escritor: Gemini).
- El reglamento operativo único es `agent-comms/RULES.md`.
- Gemini recibe tareas en `agent-comms/inbox-gemini/` y deja decisiones o síntesis en `agent-comms/outbox-gemini/`.
- Gemini archiva la directiva técnica redactada por el cerebro para Claude en `agent-comms/inbox-claude/`; Claude Code entrega resultados en `agent-comms/outbox-claude/`.
- Gemini delega auditorías comerciales y de producto a GPT en `agent-comms/inbox-gpt/`; GPT entrega en `agent-comms/outbox-gpt/`.
- Las revisiones y aceptaciones quedan en `agent-comms/reviews/`.
- Las decisiones acordadas quedan en `docs/decisions.md` y las abiertas en `docs/decisions-pending.md`.
- Cada tarea y entrega mantiene un ID estable (`GEMINI-003`, `CLAUDE-4B-002`, `GPT-OPINION-PROCESO-001`, etc.).
- Si un agente no puede escribir en una carpeta de comunicación, entrega el texto al usuario sin inventar que el archivo fue creado.

## Modelo y escalamiento

- Claude en claude.ai actúa como el Cerebro (planifica, redacta directivas completas y órdenes cortas, y revisa entregas).
- Gemini en Antigravity es el Arquitecto y Orquestador en el repo (mantiene `BOARD.md`, ramas, PRs, compuertas y despliegue).
- Claude Code es la fuerza de implementación frontend (Liquid, JSON, CSS, JS, schemas) en worktree aislado sin commit.
- Codex / GPT es el auditor senior independiente de producto, UX comercial, viabilidad de Theme Store y verificador adversarial sobre SHA fijo.
- Modelos ligeros (Flash / GPT-5.5) se usan para tareas mecánicas puntuales, inventarios, parseos y QA simple si fuera requerido.
- Gemini debe marcar `ESCALATE_MODEL_RECOMMENDED` cuando exista riesgo transversal, ambiguedad de Shopify, posible rechazo en Theme Store o conflicto no resoluble con la evidencia disponible.
