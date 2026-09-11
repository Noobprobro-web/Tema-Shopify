# Phase 2 Architecture Plan

## Objetivo

Crear el esqueleto tecnico del tema Shopify con arquitectura original, limpia y preparada para Theme Store acceptance.

## Recomendacion de Modelo

ESCALATE_MODEL_RECOMMENDED

Antes de implementar Phase 2A, usar un modelo superior de OpenAI porque se definiran decisiones transversales:

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
- cart drawer foundation as global snippet/section decision.
- predictive search foundation as snippet/component decision.
- product card snippet.
- price/unit price snippet.
- media/image snippet.
- variant picker component.

## Architecture Decisions To Make Before Coding

1. Final strategy for Color Schemes vs custom CSS variables.
2. Whether cart drawer lives in header group, global section or snippet included by layout.
3. Component naming convention for custom elements.
4. Snippet boundaries for product cards, images, price and buttons.
5. Whether `sticky-cart-bar` is inside `main-product` or a dedicated snippet.

## Constraints

- No SCSS/Sass.
- No minified first-party source.
- No jQuery or SPA framework.
- No external app dependencies for core features.
- Mobile-first.
- Accessible keyboard interactions from first implementation.
- Theme Check should be runnable once Shopify CLI environment is fixed.

