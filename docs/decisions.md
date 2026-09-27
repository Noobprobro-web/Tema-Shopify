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

## 2026-09-11: Aceptación de Phase 3A.4 (Bloque 2 Final: 100% de Plantillas en Figma)

- Gemini audita y aprueba sin reservas la entrega `GPT-3A-004` mediante dictamen `GEMINI-006` (`agent-comms/outbox-gemini/GEMINI-006-review-GPT-3A-004.md`).
- Se validan 4 nuevos lienzos vectoriales en `docs/figma/` (`couture-about-contact-1440.svg`, `couture-about-contact-390.svg`, `couture-blog-system-1440.svg`, `couture-blog-system-390.svg`).
- Quedan diseñadas: Historia/Marca, Contacto & FAQ, Portada de Blog, Lectura de Artículo, Búsqueda predictiva, Error 404 curatorial y Password/Próximamente.
- Con esta entrega se completa el 100% de las 12 plantillas oficiales requeridas por Shopify Theme Store en Figma.
- Próxima etapa: Handoff a Phase 3B (Codificación de componentes en Liquid, CSS y JS).

## 2026-09-11: Decisión Unificada Phase 3A.5 (Figma System Hardening & Módulos Comerciales Top-Tier)

- Gemini y Codex coinciden plenamente: no alterar la identidad editorial ni copiar la estética de Prestige, sino dotar a Atelier Flow de madurez de sistema y profundidad comercial.
- Se autoriza la fase `Phase 3A.5` bajo la directiva `GPT-3A-5` (`agent-comms/inbox-gpt/GPT-3A-5-figma-system-hardening-and-merchandising.md`).
- **P0 Figma System Hardening:** Unificar fuentes en Playfair Display (eliminando Georgia), estructurar las 3 páginas libres de Figma (`01 Foundations & Components`, `02 Couture Screens & Flows`, `03 Presets + QA`) y crear component sets con Auto Layout y variantes para los 10 componentes críticos.
- **P1 Módulos Comerciales:** Modal de Size Guide & Model Fit en PDP, In-Drawer 1-Click Cross-Sell en Cart Drawer, sección "Complete the Look", Grid Switcher (2 vs 4 cols) + Promotion Tile en colección, Announcement bar y Editorial Marquee.

## 2026-09-12: Aceptación de Phase 3A.5 (System Hardening & Cierre Definitivo de Diseño)

- Gemini audita y aprueba sin reservas la entrega `GPT-3A-5` mediante dictamen `GEMINI-007` (`agent-comms/outbox-gemini/GEMINI-007-review-GPT-3A-5.md`).
- Se valida la eliminación total de `Georgia` en los 16 SVG del repositorio, unificando tipografías en `Playfair Display Regular` y `Plus Jakarta Sans`.
- Se valida el plugin constructor local `docs/figma/atelier-flow-system-builder/` y la lámina de 10 component sets con 52 variantes (`atelier-flow-critical-component-sets.svg`).
- Se validan los blueprints de Merchandising P1 (`couture-top-tier-merchandising-1440.svg` y `390.svg`).
- Phase 3A queda concluida al 100% con grado de madurez comercial top-tier.

## 2026-09-12: Kickoff de Phase 3B (Implementación Técnica en Liquid, CSS y JS)

- El usuario autoriza formalmente el inicio de Phase 3B.
- Para evitar sobrecarga de contexto y garantizar código limpio y comprobable, Phase 3B se estructura en 4 sprints técnicos:
  - **Sprint 3B.1 (`GPT-3B-001`):** Tokens Semánticos CSS, Sticky Cart Bar, Size Guide & Model Fit Modal, Cart Drawer Merchandising (barra de envío/regalo escalonada y 1-click cross-sell) y Announcement Bar.
  - **Sprint 3B.2 (`GPT-3B-002`):** Secciones Editoriales de Homepage (Split Hero, Curated Showcase 1+2, Brand Manifesto, Bento Discovery y Editorial Marquee) y armado de `templates/index.json`.
  - **Sprint 3B.3 (`GPT-3B-003`):** Lookbook con Hotspots interactivos, Capsule Bundle "Complete the Look", y Conmutador de Grid (2 vs 4 cols) + Promotion Tile en `main-collection.liquid`.
  - **Sprint 3B.4 (`GPT-3B-004`):** Páginas de Contenido y Sistema (About, Contact & FAQ, Blog, Lectura de Artículo, Búsqueda Predictiva, 404 y Password), reemplazando `main-placeholder.liquid`.
- Se emite la directiva `GPT-3B-001` en `agent-comms/inbox-gpt/GPT-3B-001-core-conversion-components.md` asignada a GPT-5.6 Sol Max / Codex.
- Se mantiene el estándar inquebrantable de 0 ofensas en Theme Check, cero librerías pesadas externas y 100% WCAG 2.2 AA.

## 2026-09-12: Aceptación de Sprint 3B.1 (GPT-3B-001) y Kickoff de Sprint 3B.2

- Gemini audita y aprueba sin reservas la entrega `GPT-3B-001` mediante dictamen `GEMINI-008` (`agent-comms/outbox-gemini/GEMINI-008-review-GPT-3B-001.md`).
- Se validan 37 archivos en Shopify Theme Check con **0 ofensas**, `node --check assets/theme.js` (código 0) y parseo JSON válido en todo el tema.
- Quedan plenamente operativos: tokens semánticos CSS Couture, `<sticky-cart-bar>` con `IntersectionObserver`, modal `<size-guide-modal>` accesible con conmutador CM/INCHES y model fit, Cart Drawer con barra de progreso escalonada reactiva ($150 envío / $250 regalo) y 1-click cross-sell ("Complimentary Additions"), y `announcement-bar` global en `sections/header-group.json`.
- Se emite la directiva `GPT-3B-002` (`agent-comms/inbox-gpt/GPT-3B-002-homepage-editorial-sections.md`) para codificar las 5 secciones editoriales maestras de Homepage y armar `templates/index.json`.

## 2026-09-12: Aceptación de Sprint 3B.2 (GPT-3B-002) y Kickoff de Sprint 3B.3

- Gemini audita y aprueba sin reservas la entrega `GPT-3B-002` mediante dictamen `GEMINI-009` (`agent-comms/outbox-gemini/GEMINI-009-review-GPT-3B-002.md`).
- Se validan 42 archivos en Shopify Theme Check con **0 ofensas**, `node --check assets/theme.js` (código 0) y parseo JSON válido.
- Quedan plenamente operativas las 5 secciones editoriales maestras de la Homepage: `hero-editorial` (split asimétrico 55/45 y LCP optimizado con fetchpriority), `curated-showcase` (1+2 con pestañas de colección accesibles y roving tabindex), `brand-manifesto` (cita editorial y detalles en dl), `bento-discovery` (grilla Bento moderna) y `marquee` (ticker continuo con pausa y respeto a reduced motion).
- `templates/index.json` monta la secuencia editorial canónica sustituyendo el placeholder.
- Se autoriza commit y sincronización en Git.
- Se emite la directiva `GPT-3B-003` (`agent-comms/inbox-gpt/GPT-3B-003-lookbook-bundle-collection-merchandising.md`) para codificar Lookbook interactivo con hotspots, Capsule Bundle ("Complete the Look") y Conmutador de Grilla (2 vs 4 cols) + Promotion Tile en Colección.

## 2026-09-12: Aceptación de Sprint 3B.3 (GPT-3B-003), Auditoría CODEX-AUDIT-002 y Plan Sprint 3B.5

- Gemini audita y aprueba la entrega `GPT-3B-003` mediante dictamen `GEMINI-010` (`agent-comms/outbox-gemini/GEMINI-010-review-GPT-3B-003.md`).
- Se validan 44 archivos en Shopify Theme Check con **0 ofensas**, `node --check assets/theme.js` (código 0) y parseo JSON válido.
- Quedan plenamente operativos: Lookbook interactivo (`sections/lookbook.liquid`) con hotspots porcentuales y popovers flotantes accesibles; Capsule Bundle (`sections/complete-the-look.liquid`) con recálculo dinámico de total y compra combinada en 1-click al Cart Drawer; y Conmutador de Grilla (2 vs 4 cols) + Promotion Tile en `sections/main-collection.liquid`.
- Se revisa la auditoría proactiva de Codex (`CODEX-AUDIT-002-post-GPT-3B-003.md`), confirmando que no hubo truncamiento por límite de tokens.
- Se aprueba la emisión de un micro-hotfix `GPT-3B-003-HOTFIX` para resolver 4 puntos de borde: selling plans evaluados por variante, fallback para productos con >250 variantes, nombres accesibles semánticos en el grid switcher (neutrales para tablet), y fallback limpio sin JS en el bundle.
- Se aprueba formalmente la incorporación del **Sprint 3B.5 (Cumplimiento Comercial y Requisitos Oficiales de Shopify Theme Store)** en la hoja de ruta para ejecutarse tras el Sprint 3B.4. Cubrirá: selling plans en PDP, Shop Pay Installments, pickup availability, swatches nativos, destinatario de gift cards, collection.image y datos estructurados JSON-LD.
## 2026-09-13: Decisión de Nombre Comercial "Couture", Autor "Ruiz Digital" y Presets (Johandry D1/D2)

- Johandry (dueño del proyecto) adopta formalmente la **Opción A** para la identidad oficial del tema en Shopify Theme Store:
  - **Nombre oficial del tema:** `"Couture"` (sucede al nombre provisional `Theme Project` y al concepto de trabajo `Atelier Flow`).
  - **Autor comercial:** `"Ruiz Digital"`.
  - **Presets del tema (3 identidades):**
    1. `"Couture"` (Preset principal / default: alta costura, tipografía serif editorial, hairlines y paleta neutra). Cumple la regla de oro de Shopify: *One preset must share the parent theme's name*.
    2. `"Studio"` (Minimalismo contemporáneo: sans-serif, ratio 1:1, densidad y alto contraste).
    3. `"Archive"` (Heritage / sastrería patrimonial: tonos tierra/arcilla, reglas de 2px y catálogo enmarcado).
  - **URLs comerciales de soporte y documentación:** `https://ruizdigital.com/themes/couture/docs` y `https://ruizdigital.com/themes/couture/support`.
- Se actualiza `config/settings_schema.json` y se cierran formalmente las decisiones D1, D2 y D3 en `docs/phase-4-plan.md`, elevando el Ledger Vivo a **24 / 44 requisitos cumplidos con evidencia**.

## 2026-09-13: Presets Diferenciados (/listings/), 15 Esquemas de Color, Feature Titular y Sección Requerida (Johandry / Sprint 4B)

- Johandry (dueño del proyecto) aprueba por completo las recomendaciones conjuntas de Gemini y Claude para la arquitectura comercial y estética de Phase 4B:
  1. **Estructura de Presets Oficial (`/listings/`):** Confirmación del requisito mandatorio de Shopify Theme Store. Se incluirán tres juegos de plantillas diferenciadas en `/listings/couture/`, `/listings/studio/` y `/listings/archive/` (`index.json`, `collection.json` y `product.json`).
  2. **Feature Titular ($380 tier):** Adopción de la estrategia combinada. Se titula comercialmente con el beneficio medible de **Complete the Look** (*"vende el look completo en un solo add to cart"*, aumento real de AOV) y se impacta visualmente en la portada y primer screenshot con el **Shoppable Editorial Lookbook** a pantalla completa.
  3. **15 Esquemas de Color en `settings_data.json`:** 5 esquemas por preset (página, inverso, superficie, acento y suave) con 100% de contrastes calculados y conformes con WCAG 2.2 AA (>= 4.5:1 texto, >= 3:1 bordes e iconos).
  4. **Taglines Oficiales de Theme Store (<= 70 chars):**
     - Couture: *"Editorial fashion that sells the whole look, not one piece."* (59c)
     - Studio: *"Dense, square, quiet. For objects that speak for themselves."* (60c)
     - Archive: *"Heritage catalogue pages, with provenance on every line."* (56c)
  5. **Sección Obligatoria Shopify Faltante:** Desarrollo de `sections/featured-product.liquid` con bloque `@app` y selector de variantes, cumpliendo el requisito oficial explícito de soporte `@app` en secciones de producto destacado.
  6. **Coordenadas Móviles en Lookbook:** Soporte de posiciones independientes para hotspots en móvil (`horizontal_position_mobile`, `vertical_position_mobile`) en `sections/lookbook.liquid`.

## 2026-09-13: Resolución del Bloqueador P0 de Naming: Adopción de "Sartorial" y Presets "Sartorial", "Edition", "Archive" (Johandry)

- Johandry (dueño del proyecto) adopta formalmente la **Opción A** para resolver la colisión de nombres detectada por la auditoría comercial de GPT-5.6 (`GPT-OPINION-001`) contra el reglamento oficial de la Theme Store (Shopify Rule 1: No colisiones con temas o presets existentes):
  - **Antecedente:** "Couture" colisionaba con el preset oficial de *Prestige* (Maestrooo) y "Studio" colisionaba con el tema oficial gratuito de Shopify.
  - **Nuevo nombre oficial del tema:** `"Sartorial"`.
  - **Autor comercial:** `"Ruiz Digital"`.
  - **Nuevos presets del tema (3 identidades):**
    1. `"Sartorial"` (Preset principal / default: alta costura y sastrería editorial, tipografía serif, hairlines y paleta neutra). Cumple la regla de oro: *One preset must share the parent theme's name*.
    2. `"Edition"` (Minimalismo contemporáneo: sans-serif, ratio 1:1, densidad y alto contraste; sustituye al nombre "Studio").
    3. `"Archive"` (Heritage / sastrería patrimonial: tonos tierra/arcilla, reglas de 2px y catálogo enmarcado).
  - **URLs comerciales de soporte y documentación:** `https://ruizdigital.com/themes/sartorial/docs` y `https://ruizdigital.com/themes/sartorial/support`.
  - **Estructura en `/listings/`:** Migración completa de carpetas a `/listings/sartorial/`, `/listings/edition/` y `/listings/archive/`.
  - **Taglines actualizados (<= 70 chars):**
    - Sartorial: *"Editorial tailoring that sells the whole look, not one piece."* (62c)
    - Edition: *"Dense, square, quiet. For objects that speak for themselves."* (60c)
    - Archive: *"Heritage catalogue pages, with provenance on every line."* (56c)

## 2026-09-14: Resolución de DP-001: Alojamiento de Documentación y Soporte en la Tienda Shopify (Johandry)

- Johandry (dueño del proyecto) decide no utilizar el dominio externo `ruizdigital.com` en esta etapa y alojar las páginas de documentación y soporte directamente en la tienda Shopify (Online Store Pages).
- Se proporcionan los artefactos turnkey `docs/merchant/docs.html` y `docs/merchant/support.html` para ser cargados como páginas en Shopify.
- En cuanto las páginas estén creadas en la tienda, se actualizarán las URLs en `config/settings_schema.json` para que apunten a los endpoints de Shopify y devuelvan HTTP 200.

## 2026-09-23: Certificación y Cierre Operativo de Sprint 5B (Native Accessible Zoom & Luxury PDP Media)

- **Decisión conjunta (Johandry, Gemini Flash 3.8 High, GPT-6 Sol Max, Claude Opus 5.5 Extra):**
  - Se certifica formalmente el cierre operativo de **Sprint 5B** tras la subsanación y verificación empírica en tienda viva del hotfix F01 (gestión atómica de foco en `Reset zoom` y blindaje de las 6 rutas de transición de botones en `assets/product-zoom.js:155-166`).
  - **Dictamen oficial:** Aprobado y certificado por GPT-6 Sol Max en `agent-comms/outbox-gpt/GPT-AUDIT-008-sprint-5b-certification.md`.
  - **Componente:** `<product-zoom>` en `assets/product-zoom.js` (11.945 bytes, 3.850 bytes gzipped, cero dependencias).
  - **Compuertas estáticas:** 118 archivos inspeccionados por Theme Check con 0 ofensas, 394 claves con paridad total inglés/español, 54 filas de ledger con 0 incoherencias, y 25/25 pruebas automatizadas superadas en EN y ES (`harness-5B-001/`).
  - **Registro P2-01:** Registrado hallazgo no bloqueante sobre actualización de región viva en resize con zoom activo, programado para incorporación técnica en la siguiente directiva.
  - **Autorización de avance:** Se autoriza la transición formal al **Sprint 5C**.

## 2026-09-23: Integración de Sprint 5C (The Luxury Triple Crown: Mega Menú, Recently Viewed e Inventario)

- **Decisión conjunta (Gemini Flash 3.8 High, Johandry, Claude Opus 5.5 Extra, GPT-6 Sol Max):**
  - Integración exitosa de los dos tracks paralelos de Sprint 5C sin colisiones de archivos ni regresiones.
  - **Track 1 (Claude):** Mega Menú Editorial modularizado en `snippets/mega-menu.liquid` reduciendo la complejidad de `header.liquid` a 21. Cero JS adicional mediante reutilización del Web Component accesible `<theme-disclosure>`. Tarjetas promocionales con proporción 4:5 y `loading="lazy"`. Subsanación de P2-01 en `assets/product-zoom.js` (11.988 bytes).
  - **Track 2 (GPT):** Web Component `<recently-viewed>` en `assets/theme.js` con API `/search` Section Rendering nativa y límite de 8 IDs locales. Web Component `<product-inventory>` reactivo a variantes. Acordeones nativos `<details>` y anuncio sonoro en live region al añadir al carrito.
  - **Micro-parches de Gemini:** Exclusividad de paneles abiertos en navegación de escritorio y apertura reactiva ante `shopify:block:select` en el Theme Editor.
  - **Compuertas Estáticas:** 122 archivos inspeccionados por Theme Check con 0 ofensas, 404 claves con paridad absoluta EN/ES, 70 archivos JSON válidos, 22 contratos de dataset respetados, y 57 filas en `docs/requirements-ledger.md` con 0 inconsistencias.
  - **Dictamen:** Aprobado para commit, push y despliegue a tienda de desarrollo para verificación Gate 5.

## 2026-09-26: Resolución de Discrepancia Técnica A360-02 (RemoteAsset vs Protocol-Relative URLs en Shopify CDN)

- **Decisión arquitectónica (Gemini Flash 3.8 High tras revisión de GPT-AUDIT-012 y reporte de Claude):**
  - **Contexto:** GPT-6 Astra señaló que la documentación oficial de Theme Store pide que los enlaces a assets sean relativos al protocolo (`//cdn.shopify.com/...`). Sin embargo, aplicar `//` en `layout/theme.liquid` y `sections/featured-product.liquid` dispara 3 advertencias de `RemoteAsset` en `shopify theme check` ("Asset should be served by the Shopify CDN for better performance"), porque el parser estático del linter no reconoce el prefijo sin protocolo como dominio seguro de Shopify.
  - **Resolución:** Se mantiene `https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css`.
  - **Justificación técnica y precedentes oficiales:**
    1. **Precedente Oficial de Shopify:** El tema de referencia oficial de Shopify (**Dawn**, rama `main`), desarrollado por el equipo central de Shopify, utiliza exactamente `https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css` en `sections/main-product.liquid`.
    2. **Compuerta de Admisión de Theme Store:** La Theme Store exige cero errores y cero advertencias en Theme Check como compuerta automatizada de admisión. Mantener `https://` garantiza 0 ofensas en Theme Check sin necesidad de comentarios de supresión de linter.
    3. **Ausencia de Mixed Content:** El 100% de las tiendas Shopify operan bajo HTTPS obligatorio con HSTS, por lo que el uso explícito de `https://` en el CDN de Shopify jamás causa advertencias de contenido mixto ni fallos de seguridad.
  - **Dictamen:** Queda documentada la excepción formal en este registro de decisiones. El código preserva `https://` para garantizar el paso en verde de todas las compuertas automáticas.

