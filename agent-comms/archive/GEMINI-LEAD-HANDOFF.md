# Gemini Lead Handoff

## Estado del handoff

- Estado: activo.
- Fecha: 2026-09-11.
- Cerebro y coordinador: Gemini Flash 3.8 High.
- Autoridad final de negocio: usuario.
- Implementacion tecnica principal: GPT-5.6 Sol Max, bajo directivas de Gemini.
- Revision editorial/UX: Claude, solo cuando Gemini la asigne.

Este archivo es el punto de entrada para Gemini. Su objetivo es que pueda asumir el proyecto con el minimo contexto repetido y mantener una memoria operativa compartida con los demas agentes.

## Lectura inicial obligatoria

Leer en este orden:

1. `AGENTS.md`
2. `agent-comms/status.md`
3. `agent-comms/protocol.md`
4. `agent-comms/token-efficiency-rules.md`
5. Este archivo.

Despues leer solo los documentos vinculados a la tarea activa. No leer todo el repositorio por defecto.

## Autoridad y responsabilidades

### Usuario

- Decide prioridades de negocio, nombre final, direccion visual y cambios de alcance.
- Autoriza el inicio de una fase cuando la decision afecte producto o calendario.
- Puede aceptar o rechazar una propuesta de cualquier agente.

### Gemini Flash 3.8 High

Es el cerebro del proyecto y el coordinador operativo. Debe:

- Mantener el contexto maestro y el estado vivo.
- Definir arquitectura, alcance, criterios de aceptacion y orden de trabajo.
- Convertir analisis en tareas cerradas para GPT o Claude.
- Revisar entregas, diffs y evidencia de validacion.
- Resolver conflictos entre propuestas con evidencia.
- Marcar `ESCALATE_MODEL_RECOMMENDED` o `CLAUDE_RECOMMENDED` solo cuando exista una razon concreta.
- Actualizar `status.md`, `docs/decisions.md` y los informes de coordinacion cuando una decision quede estable.

Gemini coordina y decide la operacion tecnica, pero no reemplaza la autoridad del usuario en producto o alcance.

### GPT-5.6 Sol Max

Es la fuerza principal de implementacion para tareas tecnicas de alto impacto:

- Liquid, JSON templates, sections, snippets, CSS, JS y schemas.
- Cambios transversales de Phase 2B o posteriores.
- Bugs complejos de Shopify, Theme Check, accesibilidad o performance.

Debe implementar el alcance escrito por Gemini, reportar evidencia y devolver cualquier cambio de arquitectura a Gemini.

### GPT-5.5 low

Se reserva para trabajo mecanico y economico:

- Redaccion de prompts y documentos cortos.
- Actualizacion de estados.
- QA simple y parseos.
- Formateo, inventarios y commits cuando la directiva lo autorice.

### Claude

Es un especialista opcional, no un segundo cerebro:

- Copy de settings, labels, empty states y mensajes.
- Documentacion merchant-facing.
- Critica UX/editorial, tono premium y claridad.
- Segunda opinion cuando Gemini indique la pregunta exacta.

No se usa para duplicar implementacion tecnica ni investigacion ya cubierta.

### Codex en este chat

Cuando el usuario traiga una tarea a Codex, Codex actua como ejecutor, revisor o secretario tecnico segun lo escrito por Gemini. No cambia por cuenta propia la arquitectura o el alcance ya decidido. Si detecta un problema, lo documenta y lo devuelve a Gemini o al usuario.

## Identidad del proyecto

- Repositorio: `https://github.com/Noobprobro-web/Tema-Shopify`
- Rama de trabajo: `master`.
- Concepto interno: `Atelier Flow`.
- Nombre publico temporal: `Theme Project`.
- Nombre final: pendiente. No usar `Atelier` como nombre final por posible confusion con el tema gratuito de Shopify.
- Producto: tema Shopify premium, minimalista editorial, mobile-first, accesible, performante y preparado para agencias.
- Marcas objetivo: moda, joyeria, skincare/wellness, home decor, cafe/vino/especialidad y objetos de diseno.
- Diferenciadores previstos: ritmo editorial asimetrico, lookbook comprable accesible, PDP de doble eje, cart drawer enriquecido, product cards adaptables, bloques preparados para metaobjects y presets funcionales.

## Estado tecnico actual

- Phase 2A esta aprobada.
- Ultimo commit de producto aprobado: `d69825a` (`Approve Phase 2A skeleton`).
- El esqueleto incluye layout, config, locales, section groups, header, footer, base CSS, base JS y 12 templates JSON validos.
- Los templates usan temporalmente `sections/main-placeholder.liquid`.
- Phase 2B aun no esta implementada.
- No iniciar Phase 2B por inferencia. Gemini debe definir el encargo y el usuario debe autorizar el alcance.
- `Theme Check` fue verificado por Gemini fuera de la restriccion del sandbox con 0 ofensas; el problema local conocido es `uv_os_get_passwd returned ENOMEM`.

## Resultado de GEMINI-003

El informe esta en `agent-comms/outbox-gemini/GEMINI-003-phase-2b-readiness-review.md` y su decision es `READY WITH CHANGES`.

Recomendaciones candidatas para el encargo de Phase 2B:

- P0: `sections/cart-drawer.liquid` como seccion global renderizada desde `layout/theme.liquid`, con `/cart.js` y Section Rendering API.
- P0: bloques `@app` y renderizado correcto en `main-product.liquid`.
- P0: contratos claros para `price.liquid`, `responsive-image.liquid`, `product-card.liquid` e `icon.liquid`.
- P0: componentes nuevos basados en `ThemeCore.ThemeElement` y listeners limpiables.
- P1: settings de carrito para drawer/page, nota y umbral de envio gratis.
- P1: excluir `sticky-cart-bar` de Phase 2B; queda para una fase posterior.
- P1: filtros facetados nativos con mejora progresiva y Section Rendering API.
- P1: actualizar `product.json`, `collection.json` y `cart.json` para montar secciones reales.
- P2: estados accesibles del selector de variantes y `aria-live`.
- P2: centralizar textos visibles en locales y usar `| t`.

Gemini debe validar estas recomendaciones antes de convertirlas en una tarea de implementacion. No tratarlas como codigo ya aprobado.

## Flujo operativo

1. Recibir del usuario una prioridad o una pregunta.
2. Leer `status.md`, este handoff y solo las rutas relevantes.
3. Decidir si se necesita investigacion, implementacion GPT, revision Claude o una decision del usuario.
4. Crear una tarea con ID estable en `agent-comms/inbox-gpt/` o `agent-comms/inbox-claude/`.
5. Indicar archivos permitidos, archivos excluidos, criterios de aceptacion, validaciones y formato de entrega.
6. Esperar la entrega en la carpeta `outbox-*` correspondiente.
7. Revisar evidencia y diff. Aceptar, pedir cambios o escalar.
8. Actualizar `status.md` y `docs/decisions.md` solo cuando el estado o la decision cambien.
9. Autorizar commit/push solo despues de validacion. Nunca reescribir historia sin orden explicita.

## Formato minimo de tarea

Cada tarea debe comenzar con:

```text
ID:
Owner:
Modelo:
Estado:
Decision requerida:
Objetivo:
Archivos permitidos:
Archivos excluidos:
Criterios de aceptacion:
Validaciones:
Entregable:
```

El entregable debe empezar con:

```text
ID:
Estado:
Decision requerida:
Resumen en 5 lineas:
```

## Reglas de seguridad y calidad

- No copiar codigo, layout, assets o copy de otros temas.
- Shopify oficial es la fuente de verdad para requisitos actuales.
- Mantener vanilla JS, Liquid y CSS salvo justificacion aprobada.
- No introducir dependencias, Sass/SCSS ni codigo minificado propio.
- No modificar archivos fuera del alcance de una tarea.
- No afirmar que algo fue validado si no existe evidencia.
- Preservar cambios de otros agentes despues de revisar `git status`.
- Si un agente no puede escribir en una carpeta, devolver el texto al usuario sin fingir que el archivo existe.

## Primer encargo recomendado para Gemini

Tras leer este handoff, Gemini debe:

1. Confirmar que asume el rol de cerebro del proyecto.
2. Revisar `GEMINI-003` y decidir cuales recomendaciones son requisitos P0/P1/P2.
3. Actualizar `status.md` con la nueva autoridad y la decision `READY WITH CHANGES`.
4. Si el usuario autoriza Phase 2B, crear `GPT-2B-001` para GPT-5.6 Sol Max. Si no existe autorizacion, preparar la tarea sin iniciar implementacion.

