# Roadmap

## Phase 0: Workspace

Status: done

- Git local inicializado y remoto configurado.
- Documentacion de coordinacion creada.
- Flujo multiagente y reglas de eficiencia definidos.

Owner operativo: Gemini coordina; el usuario conserva la autoridad final.

## Phase 1: Concept and Validation

Status: done

Deliverables completados:

- Strategy brief.
- Benchmark competitivo etico.
- Matriz de riesgos de Shopify Theme Store.
- Alcance MVP y direccion de presets.
- Concepto interno `Atelier Flow`.

Owner: Gemini mantiene el contexto y valida riesgos; el usuario aprueba direccion de producto.

## Phase 2: Theme Architecture

Status: in progress

### Phase 2A: Theme Skeleton

Status: done and approved

- Estructura base Liquid/JSON/CSS/JS.
- Layout, settings, locales, section groups, header y footer.
- 12 templates JSON validos y `gift_card.liquid`.
- ThemeCore y fundamentos de accesibilidad/reduced motion.

### Phase 2B: Commerce Foundation

Status: ready with changes, not started

Antes de implementar, Gemini debe convertir `GEMINI-003` en una tarea cerrada para GPT-5.6 Sol Max y obtener autorizacion del usuario sobre el alcance.

Owner: Gemini coordina y revisa; GPT-5.6 Sol Max implementa.

Scope candidato:

- `main-product.liquid`, `main-collection.liquid`, `main-cart-items.liquid`.
- Cart drawer global y Section Rendering API.
- Product card, precio/unit price, imagen responsive e iconos.
- Variant picker con mejora progresiva.
- Filtros facetados nativos.
- Bloques `@app`, traducciones y estados accesibles.

Fuera de alcance: `sticky-cart-bar`, presets funcionalmente distintos y refinamientos editoriales no necesarios para la base commerce.

## Phase 3: MVP Build

Status: pending

- Homepage editorial.
- Secciones de coleccion y producto refinadas.
- Presets funcionales.
- Lookbook y diferenciadores previstos despues de estabilizar la base commerce.

Owner: Gemini define prioridades; GPT implementa; Claude puede revisar UX/copy.

## Phase 4: QA and Submission Prep

Status: pending

- Theme Check limpio.
- Lighthouse y performance movil.
- Auditoria de accesibilidad.
- Documentacion merchant-facing.
- Smoke test en tienda Shopify conectada.
- Paquete de submission.

Owner: Gemini coordina la auditoria; GPT resuelve hallazgos tecnicos; Claude revisa la capa editorial cuando aporte valor.
