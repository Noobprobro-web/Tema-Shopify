# Decisions

Registro de decisiones importantes del tema.

## 2026-09-11

- Se usara Git desde el inicio para mantener historial y facilitar colaboracion entre agentes.
- Gemini Flash 3.8 High sera el cerebro y coordinador del proyecto; GPT/Codex y Claude ejecutaran tareas especializadas bajo sus directivas.
- Shopify CLI sera la herramienta oficial para desarrollo y Theme Check.
- La direccion inicial recomendada es `Atelier Flow`: minimalismo editorial para marcas premium de producto fisico, con eficiencia transaccional tomada de `Quiet Commerce`.
- Se usaran temas top como benchmark etico: adoptar fortalezas, resolver fricciones y evitar copiar layout/codigo/assets/copy.
- `Atelier Flow` queda como nombre interno. Se evitara `Atelier` como nombre final por posible confusion con el tema gratuito de Shopify.
- GPT 5.5 low se usara para coordinacion y trabajo liviano. Para arquitectura, performance, accesibilidad compleja y revision final se recomendara escalar a un modelo superior de OpenAI.
- Se crea `agent-comms/token-efficiency-rules.md` como regla compartida para ahorrar tokens, definir jerarquia de modelos y evitar trabajo duplicado entre agentes.
- Claude se considerara opcional para revision editorial, UX, documentacion merchant-facing, copy de settings y segunda opinion de producto; Gemini coordina y el usuario conserva la autoridad final de producto.
- Se aprueba `GEMINI-002` con ajustes: Phase 2A sera shell/theme skeleton y Phase 2B sera commerce foundation. Se recomienda escalar a modelo superior antes de codificar Phase 2A.
- Gemini completo la investigacion oficial de Theme Store, benchmark competitivo y riesgos tecnicos en `docs/gemini-task-01-report.md`.
- Se validaron los 3 presets iniciales: `Couture`, `Studio` y `Archive`.
- Se confirmo la ejecucion funcional de Shopify CLI 4.8.0 y Theme Check con 0 ofensas iniciales.
- Phase 2A adopta `color_scheme_group` nativo de Shopify como fuente de color; `theme.liquid` traduce cada esquema a tokens CSS semanticos consumidos por `base.css` y las secciones.
- Los componentes vanilla JS usan el prefijo `theme-` y una base compartida `ThemeCore`, con registro idempotente, mejora progresiva, foco atrapado/restaurado e `inert` para drawers.
- Los 12 JSON templates comparten temporalmente `main-placeholder` para conservar templates validos sin adelantar las secciones commerce reservadas para Phase 2B.
- El header usa el componente nativo obligatorio `<shopify-account>` con menu configurable y visible en todos los breakpoints; el footer integra `login_button` para Follow on Shop sin alterar su marca.
- `Couture` es el unico preset de configuracion incluido en Phase 2A; `Studio` y `Archive` se incorporaran cuando sus diferencias sean funcionales y verificables.
- Phase 2A queda aprobada por Codex. `Atelier Flow` no debe usarse como `theme_name` publico; se usa `Theme Project` temporalmente hasta elegir nombre final.

## 2026-09-11: Handoff de liderazgo a Gemini

- El usuario designa a Gemini Flash 3.8 High como cerebro/orquestador principal para reducir duplicacion de contexto y costo de tokens.
- Gemini define arquitectura operativa, alcance, criterios de aceptacion, delegacion y orden de trabajo; GPT-5.6 Sol Max implementa los cambios tecnicos de mayor impacto.
- GPT-5.5 low queda para trabajo mecanico y Claude para auditorias editoriales/UX concretas.
- `GEMINI-003` se acepta como `READY WITH CHANGES`: sus recomendaciones P0/P1/P2 deben convertirse en una directiva de Gemini antes de Phase 2B.
- No se requiere Astra en este punto; solo se usara si Gemini marca `ESCALATE_MODEL_RECOMMENDED` con una justificacion concreta.
- El contrato operativo queda en `agent-comms/GEMINI-LEAD-HANDOFF.md`, `agent-comms/protocol.md` y `agent-comms/token-efficiency-rules.md`.
- El usuario autoriza el alcance de Phase 2B. Se formalizan los requisitos P0/P1/P2 y se crea la tarea `GPT-2B-001` en `agent-comms/inbox-gpt/` para GPT-5.6 Sol Max, quedando en espera de ejecucion.

## 2026-09-11: Aceptación de Phase 2B (Commerce Foundation)

- Gemini audita y aprueba sin cambios la entrega `GPT-2B-001` (`agent-comms/reviews/GEMINI-review-GPT-2B-001.md`).
- Se verifican 34 archivos con Shopify Theme Check con 0 ofensas, sintaxis JS válida y esquemas JSON correctos.
- Quedan implementadas las secciones base de comercio: `main-product` (con bloque `@app` y selector de variantes accesible), `main-collection` (filtros facetados progresivos y ordenamiento), `main-cart-items` y `cart-drawer` (Section Rendering API, drawer condicional en `layout/theme.liquid`).
- Se introducen snippets atómicos: `price`, `responsive-image`, `product-card` e iconos SVG nativos adicionales.
- Se mantiene `sticky-cart-bar` diferido para Phase 3.
- Se autoriza el commit y sincronización con `origin/master`.
- Próxima etapa: Phase 3 (Diseño visual en Figma, presets y componentes editoriales).

## 2026-09-11: Aceptación de Phase 3A (Sistema de Diseño Visual & Blueprints en Figma)

- Gemini audita y aprueba la entrega `GPT-3A-001` (`agent-comms/reviews/GEMINI-review-GPT-3A-001.md`).
- Se validan los 3 archivos de blueprints SVG en `docs/figma/` (`couture-desktop-1440.svg`, `couture-mobile-390.svg`, `preset-header-product-card-variants.svg`).
- Los componentes visuales cumplen WCAG 2.2 AA (contrastes > 5:1, tap targets >= 44px) e incorporan Header hairline, PDP editorial, Sticky Cart Bar y Lookbook interactivo con hotspots.
- Se aprueban las especificaciones de los presets Couture, Studio y Archive.
- Próxima etapa: Importación en Figma por el usuario y redacción de la directiva `GPT-3B-001` para codificar los componentes en Liquid, CSS y JS.

## 2026-09-11: Aceptación de Phase 3A.2 (Secciones Editoriales de Homepage en Figma)

- Gemini audita y aprueba sin reservas la entrega `GPT-3A-002` mediante dictamen `GEMINI-004` (`agent-comms/outbox-gemini/GEMINI-004-review-GPT-3A-002.md`).
- Se validan los 2 nuevos lienzos vectoriales en `docs/figma/` (`couture-homepage-sections-1440.svg` y `couture-homepage-sections-390.svg`).
- Quedan definidas las 4 secciones editoriales de Homepage: Editorial Split Hero, Curated Showcase (ritmo 1+2), Brand Manifesto y Bento Discovery.
- Todas las interacciones garantizan áreas táctiles >= 44x44px y contrastes WCAG 2.2 AA.
- Se autoriza la sincronización de todos los artefactos de Phase 3A en Git.

## 2026-09-11: Aceptación de Phase 3A.3 (Bloque 1: Colección, Carrito, Mega-Menú y Footer)

- Gemini audita y aprueba sin reservas la entrega `GPT-3A-003` mediante dictamen `GEMINI-005` (`agent-comms/outbox-gemini/GEMINI-005-review-GPT-3A-003.md`).
- Se validan 4 nuevos lienzos vectoriales en `docs/figma/` (`couture-collection-catalog-1440.svg`, `couture-collection-catalog-390.svg`, `couture-cart-drawer-navigation-1440.svg`, `couture-cart-drawer-navigation-390.svg`).
- Quedan diseñados la Página de Colección (filtros facetados y ordenamiento), Cart Drawer (abierto y estado vacío), Mega-Menú desktop / Drawer móvil y Footer global con Follow on Shop.
- Se auditan 114 tap targets (todos >= 44x44px) y contrastes WCAG 2.2 AA (mínimo 5.12:1).
- Próxima etapa: Diseñar el Bloque 2 (Historia, Contacto/FAQ, Blog/Artículos y Páginas de Sistema) para culminar el 100% de las páginas antes de Phase 3B.


