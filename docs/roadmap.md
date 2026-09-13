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

Status: done

- Phase 3A: Figma System Hardening (10 component sets, 52 variantes, tokens W3C).
- Phase 3B.1: Core Conversion Components (Sticky cart bar, Size guide modal, Rewards tier, Announcement bar).
- Phase 3B.2: Homepage Editorial (Hero editorial, Curated showcase, Brand manifesto, Bento discovery, Marquee banner).
- Phase 3B.3 & HOTFIX: Merchandising (Lookbook interactivo, Complete the look / Capsule bundle, Grid density switcher, high-variants defense).
- Phase 3B.4: Content & System Templates (8 plantillas completas sin placeholders: page, contact, blog, article, search, 404, password, list-collections).
- Phase 3B.5: Commercial Compliance (Selling plans en PDP, Shop Pay Installments, Pickup availability reactivo, Swatches nativos, Gift Card recipient, Collection image, Product recommendations asíncronas y JSON-LD Schema.org).

Owner: Gemini lideró y auditó; GPT-5.6 Sol Max implementó con 56 archivos y 0 ofensas.

## Phase 4: QA, Presets and Submission Prep

Status: in progress

- Auditoría profunda de UX, Schemas y Theme Store traps con Claude (Opus 5 / Sonnet 5).
- Presets de estilo de marca en `config/settings_data.json` (Couture, Studio, Archive).
- Theme Check limpio (actualmente 56 archivos, 0 ofensas).
- Smoke test en tienda Shopify conectada y Theme Editor en vivo.
- Auditoría Lighthouse móvil (CWV) y accesibilidad WCAG 2.2 AA.
- Documentación merchant-facing y assets para Shopify Theme Store.
- Paquete de submission (`shopify theme package`).

Owner: Gemini coordina; Claude audita UX/editorial/riesgos; GPT asume ajustes técnicos si surgen.
