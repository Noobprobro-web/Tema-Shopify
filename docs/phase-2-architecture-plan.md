# Phase 2 Architecture Plan

## Objetivo

Crear el esqueleto tecnico del tema Shopify con arquitectura original, limpia y preparada para Theme Store acceptance.

## Coordinacion vigente

Gemini Flash 3.8 High es el cerebro del proyecto y decide el alcance operativo. GPT-5.6 Sol Max implementa las tareas tecnicas no triviales bajo una directiva de Gemini. Astra no es necesario por defecto; Gemini debe marcar `ESCALATE_MODEL_RECOMMENDED` si aparece un riesgo transversal que justifique su costo.

## Recomendacion historica de modelo

La siguiente recomendacion aplicaba antes de implementar Phase 2A, que ya fue completada y aprobada. No representa una solicitud pendiente:

`Phase 2A: ESCALATE_MODEL_RECOMMENDED`.

Antes de implementar Phase 2A, se recomendaba usar un modelo superior de OpenAI porque se definian decisiones transversales:

- estructura de carpetas,
- `layout/theme.liquid`,
- JSON templates,
- section groups,
- `settings_schema.json`,
- tokens CSS,
- snippets base,
- convenciones de vanilla JS components.

## Phase 2A: Theme Skeleton

Entregables:

- Carpetas base:
  - `assets/`
  - `config/`
  - `layout/`
  - `locales/`
  - `sections/`
  - `snippets/`
  - `templates/`
- `layout/theme.liquid` con:
  - skip link,
  - `content_for_header`,
  - `content_for_layout`,
  - landmarks semanticos,
  - carga CSS/JS base,
  - soporte reduced motion.
- `config/settings_schema.json` con:
  - theme info,
  - colors/base color schemes,
  - typography,
  - layout,
  - cart,
  - social/media basics.
- `assets/base.css` con:
  - reset contenido,
  - variables semanticas,
  - typography scale,
  - layout primitives,
  - focus states,
  - utility classes minimas.
- `assets/theme.js` con:
  - base custom element helpers,
  - focus trap helper,
  - disclosure/drawer foundations,
  - no dependencias externas.
- `sections/header-group.json` y `sections/footer-group.json`.
- `sections/header.liquid` y `sections/footer.liquid` funcionales pero simples.
- Templates JSON vacios/placeholder validos para:
  - `index.json`
  - `product.json`
  - `collection.json`
  - `list-collections.json`
  - `cart.json`
  - `search.json`
  - `404.json`
  - `page.json`
  - `page.contact.json`
  - `blog.json`
  - `article.json`
  - `password.json`
- `templates/gift_card.liquid` placeholder compatible.
- `locales/en.default.schema.json` y `locales/en.default.json`.

## Phase 2B: Commerce Foundation

Entregables:

- `sections/main-product.liquid`
- `sections/main-collection.liquid`
- `sections/main-cart-items.liquid`
- `sections/cart-drawer.liquid` as the global drawer section rendered from `layout/theme.liquid`.
- predictive search foundation as snippet/component decision.
- product card snippet.
- price/unit price snippet.
- media/image snippet.
- variant picker component.

La preparacion de Phase 2B fue revisada en `agent-comms/outbox-gemini/GEMINI-003-phase-2b-readiness-review.md` y aceptada como `READY WITH CHANGES`. Gemini debe validar las recomendaciones y crear la tarea de implementacion antes de comenzar.

## Architecture Guardrails Before Phase 2B

1. `color_scheme_group` remains the source of truth and `theme.liquid` maps it to semantic CSS variables.
2. The cart drawer uses `/cart.js` and the Section Rendering API, with progressive enhancement.
3. New custom elements use the `theme-` prefix and inherit from `ThemeCore.ThemeElement`.
4. Keep explicit boundaries for product cards, responsive images, price/unit price and icons.
5. `sticky-cart-bar` is excluded from Phase 2B and reserved for a later phase.

## Constraints

- No SCSS/Sass.
- No minified first-party source.
- No jQuery or SPA framework.
- No external app dependencies for core features.
- Mobile-first.
- Accessible keyboard interactions from first implementation.
- Theme Check should be runnable once Shopify CLI environment is fixed.
