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


## 2026-10-18: Referencia única Contour para plan de mejoras de Sartorial (Johandry)

- Por instrucción expresa de Johandry, la ampliación de GPT-AUDIT-COMPARATIVA-001 toma únicamente Contour (`SebastianDev017/atelier`) como referencia externa. La comparación anterior de tres temas queda como histórico, fuera del plan activo.
- Se mantiene Sartorial, su línea editorial de moda y los presets vigentes Sartorial/Imprint/Archive. La referencia aporta prácticas a evaluar; no supone adoptar su código, identidad, dependencias o decisiones sin contraste.
- Johandry recuerda «falta de personalización o algo así» entre los motivos de rechazo del referente y no dispone del reporte completo. Se registra como pista no confirmada: el plan investiga configuración efectiva del comerciante y diferenciación/originalidad por separado.
- Se solicita y se documenta planificación multiagente. Tres subagentes Codex aportan técnica, producto y QA, con revisión independiente; no se simulan aprobaciones de Claude o Gemini.
- El plan es `docs/contour-reference-plan.md` (GPT-PLAN-CONTOUR-001). Claude conserva el liderazgo técnico temporal, Gemini la arquitectura consultora/directivas, GPT la auditoría y Johandry la autoridad comercial. BOARD.md conserva su escritor exclusivo.
- Esta decisión autoriza el enfoque y la documentación solicitados; no registra como implementados los paquetes ni modifica estados del ledger. Las directivas concretas conservarán las cinco compuertas y el alcance por archivo.


## 2026-10-22: Saneamiento de Seguridad, Rotación y Reescritura Forense de Historial (D1, D2, D10)

- **Autorización:** Autorizado formalmente por Johandry (dueño del proyecto) con aprobación expresa por escrito en chat.
- **Decisión D1 (Rotación de Contraseñas de Storefront):**
  - Rotación manual y completa de las contraseñas de storefront en las cuatro tiendas demo asociadas (`tema-qkqpke0j.myshopify.com` y tiendas asociadas a los presets Sartorial, Imprint y Archive), invalidando permanentemente todas las credenciales de storefront empleadas en etapas previas de desarrollo y pruebas.
- **Decisión D2 (Erradicación de Credenciales Hardcodeadas en Favor de Variables de Entorno):**
  - Política de tolerancia cero contra credenciales y tokens en el código fuente. Se elimina todo fallback hardcodeado en scripts de automatización, verificación y pruebas (`scripts/`, `scratch/`, harnesses de auditoría).
  - La autenticación en navegadores headless exige estrictamente `process.env.STOREFRONT_PASSWORD`, operando en modalidad *fail-closed* con salida de error controlada y sin imprimir secretos en pantalla o logs.
- **Decisión D10 (Reescritura de Historial Git con `git-filter-repo` en Todas las Ramas y Tags):**
  - Respaldo mirror bare íntegro y validado creado previamente en `C:\Users\Johan\backups\tema-shopify-backup-original.git` (159 commits).
  - Ejecución de `git-filter-repo` v2.47.0 mediante 10 reglas contextuales precisas (`filter-repo-rules.txt`): 1 sustitución literal para token único y 9 reglas regex contextuales para proteger números genéricos e inocentes en archivos del tema (`tests/vendor/axe.min.js`, reportes JSON, coordenadas SVG y configuración).
  - Verificación exhaustiva: conteo final de credenciales en ramas reescritas (`master`, `sprint/7B`, `sprint/F0`, `fix/argon-recently-viewed-edition`) y tags es estrictamente cero (0).
  - Publicación mediante force push a `origin` en todas las ramas y tags, sincronización del árbol local de trabajo y emisión de avisos de resincronización obligatoria para Claude y GPT.


## 2026-11-04: Cierre del Lote 0, empaquetado canónico y BOARD (D19 a D24, Johandry)

Registro completo en `agent-comms/outbox-claude/CLAUDE-DECISION-LOTE-0-CIERRE-001.md` (D19) y `agent-comms/outbox-claude/CLAUDE-DECISION-LOTE-0-002.md` (D20 a D24). D1 a D18 están en `CLAUDE-DECISION-0-05-P3-001.md`, `CLAUDE-DECISION-0-05-P3-002.md` y `CLAUDE-DECISION-AUTONOMIA-001.md`; D19 a D24, en los dos citados. Esa numeración es distinta de la D1/D2/D10 de octubre de arriba.

- **D19:** la R-0 vigente es `GEMINI-REVIEW-LOTE-0-R0-002` (aceptado condicional, no se repite). El cierre del Lote 0 lo verifica un subagente Opus nuevo (`CLAUDE-REVIEW-LOTE-0-CIERRE-001`) sobre las condiciones C-R0-1 a C-R0-4.
- **D20:** se usan la R-0, la ficha y el script de Antigravity subidos en `1c7aec0`.
- **D21:** Johandry ordenó publicar en `scripts/` un empaquetador determinista, generar el ZIP dos veces y fijar ese SHA-256 como canónico; `79ff3961…` queda como referencia histórica no reproducible. Implementado en `scripts/package-theme-zip.mjs`; hash fijado `f001627e…e585` tras doble generación y revisión CLAUDE-REVIEW-LOTE-0-ZIP-001 (ACEPTADO). `agent-comms/outbox-gemini/package-reproducible-zip.py` es la referencia de método de D20; su hash difiere (fecha y nivel de compresión).
- **D22:** sin credenciales, solo trabajo que no necesita tienda; Lote A en la rama `lote-a`.
- **D23:** D-01, D-01-N y D-01-L son entregables en el repo con parada para importación por Johandry; C-02 la crea Johandry; C-04-R es borrador pendiente de su aprobación; C-04-P retira las plantillas de documentación del paquete sin borrarlas del repo.
- **D24:** `agent-comms/BOARD.md` lo escribe Claude como único escritor, con revisión de un subagente Opus de contexto limpio. Modifica `AGENTS.md:84` y `AGENTS.md:96` sin editarlos.

## 2026-11-04: Autorizaciones de Nivel 2 del Lote A (D25 y D26, Johandry)

Registro completo en `agent-comms/outbox-claude/CLAUDE-DECISION-A-01-B-02-001.md` (D25) y `agent-comms/outbox-claude/CLAUDE-DECISION-C-08-001.md` (D26). La numeración es la del registro de decisiones de Claude, distinta de la D1/D2/D10 de octubre.

- **D25:** Johandry autoriza, como Nivel 2, el archivo nuevo `snippets/variant-no-js-select.liquid` de A-01/B-02, que no estaba en la lista cerrada de la R-D. La autorización cubre solo ese snippet. Sin él, `sections/main-product.liquid` pasaría de 120 a 128 en LiquidComplexity; con él queda en 120.
- **D26:** Johandry autoriza los tres cambios de Nivel 2 de C-08b tal como los propone `CLAUDE-REVIEW-C-08-RD-001`: (1) los bloques de entrega y devoluciones de la PDP vacíos se ocultan; (2) 24 valores por defecto del schema pasan a textos neutros; (3) se quita la opción «Private appointment» del formulario de contacto. Solo esos tres cambios; D26 no amplía D11 a otras tareas.

## 2026-11-05: Protocolo de sesión y validación Gate 5 (D28, Johandry)

- Fuente: `agent-comms/outbox-claude/CLAUDE-DECISION-SESION-003.md`.
- Añadir H-1 al Lote C con directiva, revisión de directiva, implementación y revisión independiente.
- Mantener PD-3 de B-04 como limitación; no ampliar el alcance.
- Autorizar PD-8 únicamente en previews no publicadas de `tema-qkqpke0j`, usando solo el carrito de la sesión de prueba; vaciarlo antes de cerrar y no modificar productos, apps o configuración.
- Mantener pendiente de Johandry el fixture C-R0-4; permitir el cierre del Lote 0 dejando ese fixture expresamente pendiente.
- En Gate 5, verificar acceso por comportamiento y aplicar únicamente la lista exhaustiva de filtros de ruido de consola de D28, dentro de sus límites. Dejar caducar el carrito de la sesión anterior sin tocarlo; limpiar el carrito de la nueva sesión de prueba en esa misma sesión antes de cerrarla. Si queda cualquier artículo o nota o no se logra limpiar, fallar con `GATE5_CART_NOT_EMPTY`.
- Nunca llegar a pagar. La autorización de prueba no permite escribir productos, apps ni configuración.

### Addendum D28 — política de hosts y carrito del harness R-A/R-B (Johandry, 2026-11-05)

- Fuente: decisión expresa de Johandry en el chat del 2026-11-05. Para el harness `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/`, esta política sustituye las restricciones anteriores de rutas estáticas externas: GET/HEAD se permiten sin restricción de pathname únicamente a los hosts HTTPS exactos `tema-qkqpke0j.myshopify.com`, `cdn.shopify.com` y `fonts.shopifycdn.com`. No se permiten otros hosts, wildcards, credenciales en URL ni puertos no estándar. Cada salto de redirección vuelve a comprobar el host; ningún POST se reenvía por redirección.
- Todo host restante se bloquea y registra como aviso con host y pathname sin query/fragmento, sujetos a guard de secretos y redacción segura; no se guardan URL completa, headers, cookies, body, tokens ni valores de formularios. Un host bloqueado necesario debe constar en el resultado para revisión, sin autorizarlo automáticamente. Los avisos de host/analytics no producen por sí solos un fallo de compuerta; un fallo funcional real se evalúa por su aserción y evidencia.
- Lista conocida de analytics/pixels bloqueada como aviso: `monorail-edge.shopifysvc.com`, `www.google-analytics.com`, `region1.google-analytics.com`, `analytics.google.com`, `www.googletagmanager.com`, `stats.g.doubleclick.net`, `connect.facebook.net`, `www.facebook.com`, `analytics.tiktok.com`. El ruido de plataforma/previews de D28 también sigue como aviso bloqueado: `bugsnag.com` y sus subdominios, `notify.bugsnag.com`, `sessions.bugsnag.com`, `shop.app`, `www.shop.app`, `pay.shopify.com`, `checkout.shopify.com`, `accounts.shopify.com`. Esta enumeración clasifica avisos y no amplía los tres hosts permitidos.
- Otros hosts externos observados, registrados únicamente como aviso bloqueado: `error-analytics-sessions-production.shopifysvc.com`, `otlp-http-production.shopifysvc.com` y `js.hcaptcha.com`. Su inclusión no afirma que sean necesarios ni modifica los hosts o métodos autorizados.
- POST autorizado solo a `/password` del host de la tienda, una vez por sesión y mediante el cliente API del contexto sin seguir redirecciones, y a `/cart/add.js`, `/cart/update.js`, `/cart/clear.js` del mismo host exclusivamente en modo `--cart`. Los endpoints POST son exactos, sin query/fragmento. Todo otro POST/PUT/PATCH/DELETE/OPTIONS u otro método se bloquea; no se habilita `/cart/change.js`.
- `--cart` solo usa los tres IDs autorizados de previews (`190232297715`, `190232330483`, `190232363251`). Antes de cada ejecución, el coordinador confirma mediante inventario de temas que los seleccionados siguen no publicados; el harness no ejecuta Shopify CLI ni consulta Admin con el token. El script exige `Shopify.theme.id` exacto y carrito inicialmente vacío y sin nota antes de autorizar mutaciones. Nunca limpia un carrito inicial ajeno/no vacío.
- La prueba usa únicamente el carrito del mismo BrowserContext desechable. En su cierre envía clear y actualización de nota vacía, y lee `/cart.js`; solo acepta la limpieza con cero artículos/líneas y nota vacía verificados en esa sesión. Si la lectura o limpieza falla o queda desconocida, el resultado falla y no se declara carrito vacío. Nunca se ejecuta checkout ni pago, ni se escriben productos, apps, metafields o configuración. El cierre de Lote 0 y la aceptación R-A/R-B siguen requiriendo revisión independiente y conservan C-R0-4 pendiente de Johandry.
- Revisión independiente del cambio de allowlist/harness (2026-11-06): dictamen `ACEPTADO` por un agente distinto del escritor. Snapshots SHA-256 revisados: `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs` = `8C07DC4274E0A8D330EB6780C8016500ABA1D807E01E85CB59ADEDD23FF916DC`; `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/README.md` = `148AA36DDD69B7B9888705EA27DE479108421E5DA0BE96C6787D625DCCE67DD5`; snapshot previo de `docs/decisions.md` = `7037565F869A634E6AFB08AB0752071B1212DDEB28A8A9D537BBF38001E00C92`. Este último hash corresponde al documento anterior a esta anotación.
- Evidencia estática registrada para esos snapshots: `node --check` y `git diff --check` pasaron. La revisión y este registro no ejecutaron tienda ni Gate; la aceptación del cambio no cierra Lote 0 ni certifica R-A/R-B. Esta anotación posterior queda sujeta a revisión documental independiente.

### Addendum D28 — clasificación axe de la barra de preview (2026-11-06)

- Base empírica: `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T055258474Z-433b57c5-56bd-4eb6-9f4a-404ca912a5a7.json`. Los 18 escaneos registran una ocurrencia de `frame-title` sobre un nodo `iframe` de familia fija `shopify_preview_bar`, fuera de las secciones del tema. La misma corrida identifica seis ocurrencias de `label-content-name-mismatch` en `sticky_add_button` y cuatro en `bento_discovery_link`, sin otros controles afectados por esa regla. Son ocurrencias por escaneo, no cantidades de nodos únicos.
- Aplicando la separación de ruido de plataforma de D28, el harness recorre todos los frames y retira de los fallos axe exclusivamente los nodos cuya clasificación segura sea `iframeSourceFamily=shopify_preview_bar`: HTTPS, host exacto `cdn.shopify.com`, sin credenciales ni puerto no estándar, y ruta bajo `/shopifycloud/preview-bar` o `/shopifycloud/storefront-preview-bar` con límite de segmento. Las direcciones solo se comparan en memoria. Cada ocurrencia retirada queda contada en el JSON como `previewBarWarningOnlyNodeCount` y como observación `SHOPIFY_PREVIEW_BAR_WARNING_ONLY`. Se elimina la exclusión anterior basada únicamente en el ID del iframe.
- Todos los demás frames, nodos y reglas conservan su evaluación. Una regla con nodos de preview y del tema mantiene estos últimos como fallos; los nodos sin clasificación positiva permanecen evaluables. Los resultados `incomplete`, incluido contraste, siguen registrados para revisión. Esta clasificación no cambia los hosts, métodos ni redirecciones de la política de red de arriba.
- Los controles del tema confirmados reciben una corrección localizada: el nombre del sticky empieza por su acción visible actual y conserva producto/cantidad, y los enlaces Bento usan el nombre derivado de su contenido visible con fallback localizado solo cuando falta ese texto. El cambio y esta anotación requieren revisión independiente antes de la verificación en tienda; no declaran cerrados R-A/R-B ni el Lote 0.

### Addendum D28 — sincronización del drawer y timeout de runtime Shopify (2026-11-06)

- Base observada: `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T063316265Z-e1af05a5-ec5e-4d24-8bb2-f7aa9fbb0c88.json` registra cero comprobaciones funcionales fallidas, tres excepciones genéricas GET de `/cart` de la tienda (una por preview) y dos `PLAYWRIGHT_TIMEOUT` al descargar el módulo de validadores bajo `/shopifycloud/shop-js/` de `cdn.shopify.com`. Los errores genéricos de carrito no identifican su causa; no se reclasifican retroactivamente como cancelaciones ni se modifican los JSON históricos.
- La prueba de drawer registra, antes de abrirlo, una espera para su respuesta GET de Section Rendering: origen exacto de la tienda, pathname exacto `/cart` y `section_id` igual al de ese drawer. Los parámetros se comparan exclusivamente en memoria. Espera respuesta HTTP satisfactoria y transferencia terminada antes de comprobar/cerrar el drawer y de terminar el contexto. La espera también se resuelve en la salida de error. Una lectura real fallida o incompleta, un timeout o una navegación a `/cart` cuando existe drawer siguen fallando; no se filtran errores de la tienda.
- Solo se reclasifica como aviso una excepción emitida durante la llamada fetch del router que cumpla todos estos predicados: código seguro `PLAYWRIGHT_TIMEOUT`, método GET o HEAD, origen HTTPS exacto `https://cdn.shopify.com` (sin credenciales ni puerto no estándar) y pathname con prefijo exacto `/shopifycloud/shop-js/`. Es runtime de Shopify, fuera de los assets del tema, y la corrida citada pasó las aserciones funcionales pese a esos dos timeouts. Un timeout al crear el cliente o en validación de redirección/fulfill no cumple la excepción.
- Estos avisos se guardan por separado en `routeWarningEvents`, con límite de 50 por sesión, contador de omitidos, razón fija `SHOPIFY_RUNTIME_FETCH_TIMEOUT_WARNING_ONLY`, código seguro, etapa/página/método de vocabulario fijo y host/pathname sometidos al guard de secretos y sin query/fragmento. No alimentan `routeFailureEvents` ni el fallo global. Todos los demás errores de hosts permitidos, tienda, assets del tema o causa desconocida conservan su carácter fatal. No se habilitan hosts, métodos, redirecciones ni escrituras adicionales. Este ajuste requiere revisión independiente antes de la siguiente verificación en tienda.

### Addendum D28 — incidente Archive, HTTP 429 y limpieza antes del cierre (Johandry, 2026-11-06)

- Johandry clasifica el carrito de Archive de `RA-RB-cart-20261106T112804500Z-605bdcd0-07ef-43aa-a9f5-6e0d5038b634.json` como incidente huérfano: el carrito inicial se verificó vacío; el intento de alta y la limpieza quedaron afectados por HTTP 429; clear, actualización y lectura final registraron 429, con contenido final desconocido, y el contexto ya se cerró. Se deja caducar esa sesión sin intentar recuperarla ni reutilizarla. Este incidente histórico no bloquea el Lote 0 y no equivale a una prueba de limpieza exitosa. El harness conserva un registro fijo de este incidente histórico sin identificadores de sesión, cookies ni credenciales.
- Toda respuesta HTTP 429 del harness, tanto en API como en el router del navegador, admite como máximo tres reintentos después del primer intento. Cada reintento respeta el mayor plazo entre backoff exponencial de 1/2/4 segundos y `Retry-After`, interpretado como delta de segundos o fecha HTTP; un plazo válido no se acorta. Una respuesta 429 también retrasa solicitudes siguientes al mismo host. Un valor ausente o inválido usa backoff; un delta no representable falla con código seguro. Se conserva `maxRetries: 0` del transporte: los únicos reenvíos los controla este protocolo y no hay reintento por otro tipo de error. Esta decisión permite repetir la misma operación POST `/password` únicamente tras 429, en el mismo endpoint/host y sin seguir redirects, y prevalece sobre la limitación anterior de un único envío físico de autenticación.
- Todas las peticiones de carrito de la tienda (`/cart`, `/cart.js` y sus subrutas autorizadas), API y navegador, pasan por una cola global serial con separación mínima de un segundo entre inicios; incluye reintentos, comprobaciones y cleanup. La cola no habilita ningún método o endpoint. Los hosts, la validación de cada salto y el filtro acotado de barra de preview de los addenda anteriores siguen vigentes.
- Un POST `/cart/add.js` con 429 se reconcilia mediante lectura del mismo carrito, con el mismo protocolo de reintentos y antes de considerar otro add. La variante y el plan esperados se comparan solo en memoria: se exige exactamente una línea y una unidad coincidentes. Si ya está, el alta se considera confirmada y no se repite. Se preserva la respuesta HTTP real de Shopify y el check registra `reconciledAfter429`; no se fabrica una respuesta exitosa. El add solo se reintenta si la lectura confirma carrito todavía vacío y sin nota. Una lectura desconocida o contenido inesperado detiene el flujo y lleva a cleanup. Agotar reintentos sin confirmación sigue siendo un fallo; nunca se duplica un add a ciegas.
- El `finally` espera la operación de add iniciada y ejecuta clear, actualización de nota vacía y lectura antes de cerrar el contexto. Cada operación tiene hasta tres reintentos solo ante 429. La limpieza exige lectura válida con cero artículos/líneas y nota vacía; el harness bloquea nuevas altas durante cleanup y comprueba esa condición también antes de cerrar contexto/browser. Los diagnósticos de rate limit son acotados y contienen códigos/números, fase y host/pathname sanitizados sin query, headers ni valores de formularios.
- Si un carrito tocado no queda verificado vacío después de ese protocolo, el harness guarda `CART_CLEANUP_UNVERIFIED`, mantiene vivo el proceso junto con contexto/browser y espera intervención, sin timeout de salida ni cierre automático. El operador puede enviar exclusivamente el comando `retry-cleanup` por stdin para iniciar una nueva limpieza manual del mismo contexto; no se imprimen ni conservan otros textos de entrada. Cada intervención vuelve a usar el límite y backoff anteriores. Solo una lectura vacía y sin nota permite cerrar; la corrida conserva el fallo/incidente original y termina después de esa recuperación, sin avanzar automáticamente a otra preview. El navegador sigue headless: la vía de intervención es el proceso abierto, no un archivo de sesión ni una exportación de cookies. Este cambio requiere revisión independiente antes de ejecutarse; aquí no se repite ninguna prueba en tienda.

## 2026-11-06: Cierre del Lote 0 en alcance D19 y traslado de T-2/T-7

- `CLAUDE-REVIEW-LOTE-0-CIERRE-001.md` se copió íntegramente al worktree `lote-d` (SHA-256 `01F2E3B316B8C063EDF4FF086F0F89D2692D4EB489EC2D0DB8BF21E03400F7A1`). Un agente distinto verificó la copia y dictaminó `ACCEPT WITH CONDITIONS` para el alcance D19. C-R0-1/2 quedan acreditadas por la ficha y el ZIP canónico reproducible; C-R0-3 se reconfirma en el preflight elevado de esta sesión. C-R0-4 sigue pendiente de Johandry según D19(c).
- **Lote 0 queda cerrado solo en el alcance D19.** Este cierre no acepta ni certifica las matrices completas R-A/R-B, R-D/G2, R-Demo ni el Lote C/D. La sesión de lectura `T181805513Z` terminó con 132 checks (96 passed, 36 observed, 0 failed) y `scopeResult=failed` por un evento de routing `HARNESS_OPERATION_FAILED` para un GET del runtime Shopify en `/cdn/shopifycloud/checkout-web/assets/c1/4509beb0.XKqHDYZw.js`. El carrito no se tocó y los tres contextos se cerraron; el evento no se clasifica como defecto de tema ni se amplía el filtro D28 sin diagnóstico aprobado.
- Preflight elevado `shopify theme list --json --no-input --role unpublished --store tema-qkqpke0j.myshopify.com`: exit 0, stderr vacío; `190232297715`, `190232330483` y `190232363251` aparecen como `unpublished`. Las credenciales solo se verificaron como presentes; sus valores no se mostraron.
- **T-2** (`T231955117Z`) se registra como `UNKNOWN`: el carrito fue tocado, la limpieza falló y no se verificó vacío ni nota vacía. No se vuelve a usar ni se limpia ese contexto. La disposición queda pendiente de Johandry; no bloquea el cierre D19, pero se mantiene señalada antes de pruebas de tienda específicas del Lote C.
- Los P3 de T-7 se trasladan como sigue: P3-1 añade `.secrets/` al `.gitignore`; P3-2 requiere revisión independiente fechada del snapshot vigente del runner/D28; P3-3 se resuelve actualizando el estado vivo; P3-4 registra que los informes GPT 009–016 fueron aceptados solo como evidencia de cierre, sin aceptación funcional integral.

### Addendum D28 — criterio de errores de red en mediciones (Johandry, 2026-11-06)

- Solo falla una comprobación de red cuando el origen es el dominio exacto de la tienda o el pathname es un asset del tema bajo `/cdn/shop/t/<theme_id>/` (solo los tres IDs autorizados) o `/cdn/shop/files/`. Los errores de otros hosts —incluidos previews, CDN/fonts, analytics, pixels, Shop Pay y monorail— quedan como avisos con host/ruta sin query; no hacen fallar el scope por sí solos. La lista conocida de analytics/pixels/previews es la enumerada en el addendum D28 anterior; los hosts externos permitidos son `cdn.shopify.com` y `fonts.shopifycdn.com`.
- La lectura `T185332883Z` completó 132 checks (96 passed, 36 observed, 0 failed) y cerró los tres contextos sin tocar carritos, pero el scope falló por `PLAYWRIGHT_TIMEOUT` en GET `cdn.shopify.com/storefront/standard-actions.js` y `HARNESS_OPERATION_FAILED` en GET al dominio de la tienda, ruta `/cdn/shopifycloud/checkout-web/assets/c1/164ad2e3.BxPAiJzQ.js`. El primero se reclasifica como aviso externo según este criterio; el segundo permanece fallo por dominio de tienda y causa incierta, sin atribuirlo al tema ni ampliar otra excepción. El código de error seguro solo toma valores de una lista fija; nunca guarda mensajes o rutas adicionales.
- `harness-GPT-RA-RB-001/run.mjs` actualiza la clasificación de errores externos y errores de red concretos. El snapshot `0F936942D2056AD4F48C16F2144300A9A066DB0C4309DC6DEF09330C1F5DCB84` recibió `ACCEPTED` independiente el 2026-11-06; la revisión confirmó que errores `CheckError` del protocolo 429 siguen fatales y que los avisos externos se limitan a errores durante fetch GET/HEAD. `node --check` y `git diff --check` dieron exit 0. La aceptación estática no acredita un test dinámico ni acepta R-A/R-B completas.
- La lectura posterior `T190050695Z` pasó como `completed_with_limits`: 132 checks (96 passed, 36 observed, 0 failed), 18 rutas/viewport visitadas, cero errores de routing y cero carritos tocados; se cerraron los tres contextos. Los timeouts repetidos de `cdn.shopify.com/shopifycloud/shop-js/` quedaron como avisos externos. Es un smoke de lectura; no cierra las matrices completas R-A/R-B ni mide Lighthouse.

## 2026-11-05: Migración de worktree y autorización diagnóstica de Gate 5 (Johandry)

- Diagnosticar y reparar el registro de worktrees desde el repo principal; respaldar por separado D28, `CLAUDE-CLOUD-STATUS.md` y la corrección de Gate 5, crear `C:\dev\TS-lote-d` desde `origin/lote-d` en `9fc1394`, aplicar los tres cambios, verificar que `git status` funciona y publicar solo en `lote-d` sin force. Retirar el worktree de Drive después de comprobar el nuevo.
- Antes de la siguiente ejecución de Gate 5, producir en `agent-comms/outbox-gpt/` un JSON único por corrida con nombre de cada comprobación, resultado y motivo seguro de fallo; no almacenar credenciales, cookies ni mensajes crudos. Informar si el carrito quedó vacío; si no se puede verificar, registrar estado desconocido.
- Johandry autoriza exactamente un intento diagnóstico adicional en la preview Sartorial `190232297715`, solo tras revisión independiente del cambio. Si falla, no repetir y entregar su JSON.
- Antes de cualquier prueba de tienda, comprobar solo la presencia de `SHOPIFY_CLI_THEME_TOKEN` y `STOREFRONT_PASSWORD`; si falta cualquiera, detenerse sin abrir navegador ni iniciar solicitudes a la tienda.
- Si Gate 5 pasa, continuar paso 5 de R-A/R-B y previews; luego cerrar el Lote 0 con revisión independiente y avanzar al Lote C. Se mantienen las reglas previas de una tienda, ramas `lote-*`, sin force, sin `master` ni merge del PR, sin metafields, sin copiar código de Sebas y con revisión distinta del escritor.

## 2026-11-06: Decisiones de Johandry sobre C-01, C-05 y C-07

- El dictamen de [Claude](../agent-comms/outbox-claude/CLAUDE-REVIEW-LOTE-C-PROPUESTAS-001.md) sustituye las tres R-D de C-01, C-05 y C-07 del informe 016. SHA-256 del original y de la copia: `5a2088ec38d0c57a145cdb42028770a6e8f469b4501cd35e65569eaaa750122a`.
- C-07: corregir primero el P1 de `getInitialVariant` con enlaces profundos `?variant=` a variantes fuera de las primeras 250. Se autoriza como Nivel 2 la sección mínima de estado de variante para producto destacado.
- C-07 sin JavaScript: con más de 250 variantes, usar enlaces GET con `option_values` en el snippet autorizado por D25. Si Shopify devuelve una variante nula, deshabilitar el envío y omitir el campo `id`. Para 250 o menos se conserva el select nativo.
- Implementar C-01, C-05 y C-07 conforme a las condiciones del dictamen, con revisión de un agente distinto. Las pruebas de editor e instalación de C-05 esperan a la tienda limpia de C-02. Se mantienen las reglas vigentes de autonomía.

## 2026-11-07: Decisión C-07 para producto destacado con más de 250 variantes

- **APROBADO por Johandry el 2026-11-07:** sustituir `variant-state` por navegación al PDP con `option_values`. La aprobación explícita es posterior a su corrección de la atribución previa. Alcance C-07: en un destacado con más de 250 variantes, elegir una opción navega a la ficha de `featured_product` con un GET `option_values`. Los enlaces son los mismos con y sin JavaScript y conservan, en su orden original, los IDs de las demás opciones seleccionadas. En destacados de hasta 250 variantes, la selección sigue en la sección actual.
- Shopify aplica los settings de una sección si esa instancia está en la plantilla solicitada. La API no permite aportar los settings de una instancia de la portada o de otro producto a la URL del destacado. Resolver en la ficha mantiene las reglas de cantidad y el cap AF-07 de su propia sección. El HTML inicial del destacado conserva su cap local. La implementación retira el prototipo de sección `variant-state`.
- La ficha bloquea el envío cuando Shopify devuelve variante nula. El código JavaScript también comprueba que un `option_values` de entrada coincida con la selección que devolvió Shopify. Los enlaces del tema siempre usan un ID por opción. [Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering) · [Enlaces de variantes](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants)

## 2026-11-07: DP-005 · Línea base G2 y clasificación de eventos de red (Johandry)

- Johandry aprobó las puntuaciones medidas en las 18 celdas como línea base G2. Rendimiento móvil (home / colección / producto): Sartorial 88 / 83 / 82, Imprint 88 / 79 / 82, Archive 91 / 80 / 85. Rendimiento de escritorio: 100 en las nueve celdas. Accesibilidad: 97 y Best Practices: 96 en las 18. SEO: 92 en home y 100 en colección y producto, en ambos tamaños. Ninguna celda móvil quedó por debajo de 70.
- El runner trata como avisos solo HTTP 404 en `/favicon.ico` y `CHROMIUM_ERR_ABORTED` en `/services/login_with_shop/authorize` del host HTTPS exacto de tienda. El enum CDP `Aborted` equivale a ese aborto de Chromium para la misma ruta. Otras rutas, estados HTTP y códigos conservan su clasificación de fallo.
- Johandry precisó la política de avisos CDN: aplica a `cdn.shopify.com`, subdominios `*.shopifycdn.com` y las rutas `/cdn/fonts/` y `/cdn/shop/files/` de la tienda exacta. Se registra host y pathname, sin query ni fragmento. Los assets reales del tema, entre ellos `/cdn/shop/t/<id>/assets/`, y los errores de hosts ajenos conservan fallo. Los bloqueos de CDN conocidos quedan como aviso salvo asset de tema bloqueado, que sigue siendo fatal. No cambian allowlist, autenticación, reintentos 429 ni limpieza.
- Los JSON históricos siguen con `executionResult=failed` y las mismas flags y bytes. Cada corrida final contiene cinco entradas de bloqueo sin clasificar para `shopify-assets.shopifycdn.com`, cuya necesidad no se verificó. Esas rutas de CDN conocido se clasificarán como avisos en corridas futuras. Un host bloqueado ajeno a la política mantiene el resultado incompleto. No se volvió a ejecutar Lighthouse. Evidencia, SHA-256 y límites en [GPT-REPORT-DP-005-G2-001](../agent-comms/outbox-gpt/GPT-REPORT-DP-005-G2-001.md).

## 2026-11-08: Enmienda D12 para el escaneo antes del push (Johandry)

- Antes del push, escanear los blobs nuevos alcanzables del rango exacto que se va a publicar. Comparar en memoria contra los valores vigentes de `STOREFRONT_PASSWORD` y `SHOPIFY_CLI_THEME_TOKEN` del entorno, sin imprimir ni registrar los valores. El conteo de coincidencias exactas debe ser cero para cada variable.
- Una coincidencia del literal histórico se permite únicamente si se clasifica como contenido ajeno a una credencial y un agente independiente confirma la clasificación. La rotación fue confirmada por Johandry. La excepción histórica no sustituye el escaneo de los valores vigentes.

## 2026-11-10: Claude como único escritor (Johandry)

- Desde 2026-11-10, Claude es el único escritor del repositorio. Codex queda autorizado únicamente a registrar esta decisión en `docs/decisions.md`, ejecutar el escaneo D12 vigente y hacer push sin force de `lote-c-impl`, con `24032e8a437c9a9b02f4ae5616b9300e38f9cb78` como último commit de trabajo. El commit que contiene este registro también formará parte de ese push.
- Después de ese push, Codex no hará más escrituras en el repositorio hasta que Johandry lo indique.

## 2026-11-10: Integración en lote-e-claude (Claude)

- Claude integra en `lote-e-claude` D-02-Q, el fix de C2 (umbral de inventario), el harness de B-02 y la neutralización C-08 de D-01, cada uno con revisión independiente aceptada. Informes en `agent-comms/outbox-claude/reviews-20261110/`.
- Claude integra LV-05 (alineación de títulos en tarjetas de producto) con el arreglo NF-01 y las condiciones CN-1 a CN-6 cerradas; CN-7 y R01 quedan pendientes y registrados en `docs/requirements-ledger.md`. Revisión independiente aceptada (REVIEW-LV05-006).
- Claude integra B-01: el foco nunca cae en BODY al cerrar el menú móvil. El caso "carrito desde el menú" no aplica a este arreglo. Revisión independiente aceptada (REVIEW-B01-001).
- Claude integra D-02-A: la barra sticky muestra el precio del plan al cargar. Revisión independiente aceptada (REVIEW-D02A-001).
- Claude integra el harness de C-01 (identidad de preview, procedimiento de despliegue y medición). Revisión independiente aceptada (REVIEW-C01-003).
