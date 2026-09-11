# Top Theme Benchmark

Benchmark etico para aprender de temas Shopify top sin copiar layout, codigo, assets ni copy. El objetivo es absorber fortalezas, detectar fricciones y convertirlas en principios para nuestro tema.

## Temas Analizados

Fuentes principales:

- Shopify Theme Store: Prestige, Palo Alto, Broadcast, Pipeline, Atelier.
- Reportes y benchmarks externos 2026 sobre temas Shopify premium para moda/ecommerce.
- Reporte de Gemini `docs/gemini-task-01-report.md`.

## Lectura General

Los temas top ya compiten con checklists muy parecidos: quick buy, slide-out cart, mega menu, product filtering, swatches, image hotspots, lookbooks, quick view, product videos, product recommendations, press, FAQ y promo banners. Por eso, la oportunidad real no esta en "tener mas features", sino en:

- Mejor composicion visual.
- Mejor mobile commerce.
- Menos fatiga de configuracion.
- Mejor accesibilidad en interacciones complejas.
- Mejor performance por defecto.
- Mejor utilidad para agencias que necesitan adaptar el tema sin rehacerlo.

## Matriz Comparativa

| Tema | Pros que nos interesan | Contras / fricciones posibles | Como lo superamos en Atelier |
| :--- | :--- | :--- | :--- |
| Prestige | Lujo probado, muy reconocido, 30+ secciones, lookbooks, hotspots, quick view, swatches, before/after, buen soporte y alta adopcion. | Voz visual reconocible; muchas tiendas Prestige se sienten emparentadas. El lujo puede depender demasiado de fotografia perfecta. Puede sentirse "premium esperado", no sorprendente. | Crear un sistema editorial mas flexible: ritmo de grid configurable, bloques narrativos mezclados con commerce, presets con ADN realmente distinto y settings de densidad visual. |
| Palo Alto | Muy fuerte en conversion: shop-the-look, upsells, quick buy, sticky cart, promos, countdowns, back-in-stock, buenos features nativos. | Riesgo de saturacion promocional. Puede empujar demasiado hacia "growth tools" y perder calma premium. | Separar modos: `Editorial`, `Conversion`, `Drop`. Que el merchant active intensidad comercial sin contaminar todo el sitio. |
| Broadcast | Mobile-first, feature rich, 30+ secciones, orientado a velocidad y conversion, buena reputacion de soporte. | Mucha flexibilidad puede producir tiendas visualmente genericas si el merchant no tiene criterio. Riesgo de paneles/settings abundantes. | Defaults mas opinionados, presets con layouts completos y guias de composicion. Menos opciones cosmeticas sueltas, mas controles de sistema. |
| Pipeline | Excelente reputacion, precio competitivo, nested blocks, lookbooks, free shipping bars, product cards utiles, buen equilibrio moda/conversion. | Algunos patrones pueden inclinarse a grillas comerciales convencionales. Los nested blocks pueden aumentar complejidad si no hay convenciones claras. | Arquitectura modular con bloques semanticos: editorial note, product moment, material proof, size guidance, campaign tile. Nombrar settings por intencion, no por implementacion. |
| Atelier by Shopify | Gratuito, elegante, editorial, galerias aireadas, integrado con Horizon/nested theme blocks, buen punto de referencia de "calma premium". | Al venir de Shopify/Horizon, no nos sirve como base si apuntamos a Theme Store con originalidad. Ademas, al ser gratuito puede volverse comun rapidamente. | No derivar de el. Usarlo solo como referencia de mercado: nuestro tema debe ser mas comercial, mas agency-ready y con identidad propia. |

## Pros que Debemos Adoptar

- Lookbooks y hotspots, pero con accesibilidad y mobile-first impecables.
- Slide-out cart enriquecido, pero sin exceso visual.
- Quick buy y sticky add-to-cart en mobile.
- Swatches, image rollover y product cards utiles.
- Product filtering and sorting nativo.
- Mega menu con promos, pero sobrio.
- Presets con layouts demo completos.
- Product storytelling: materiales, uso, medidas, origen, cuidados.
- Soporte de selling plans, unit pricing, pickup availability y dynamic checkout.

## Contras que Debemos Resolver

- Temas premium reconocibles entre si.
- Demos hermosas que dependen demasiado de fotografia perfecta.
- Feature creep que abruma al merchant.
- Configuracion granular sin intencion clara.
- Promociones que dañan percepcion premium.
- Animaciones repetitivas o decorativas.
- Interacciones complejas con accesibilidad irregular.
- Mobile PDPs que obligan demasiado scroll antes de comprar.

## Principios Para Atelier

1. **Opinionated by default, flexible by system.** El tema debe verse excelente recien instalado, pero permitir personalizacion profunda mediante sistemas: densidad, ritmo editorial, tono comercial y preset.
2. **Commerce inside storytelling.** La narrativa nunca debe alejar de la compra; cada seccion editorial debe poder conectar con producto, coleccion, variante o beneficio.
3. **Mobile buy path first.** PDP y PLP movil deben permitir comprar, cambiar variante, revisar precio y volver a descubrir productos con friccion minima.
4. **Premium without fragility.** El tema debe verse bien aun con fotografia imperfecta: ratios consistentes, placeholders elegantes, fondos adaptativos y composicion resistente.
5. **Agency-ready architecture.** Sections y snippets deben ser faciles de extender, con nombres claros, settings estables y patrones repetibles.
6. **Accessible interaction as a feature.** Hotspots, drawers, quick buy, filters y predictive search deben funcionar con teclado, foco, Escape y `aria-live`.
7. **Performance as taste.** La experiencia debe sentirse refinada porque carga rapido, no porque agrega efectos pesados.

## Feature Synthesis Para MVP

### Diferenciadores Primarios

- Editorial rhythm grid: mezcla controlada de producto, imagen editorial, texto y promo sin romper colecciones.
- Shoppable lookbook con hotspots accesibles.
- Dual-axis PDP con buy box sticky en desktop y sticky cart bar en mobile.
- Cart drawer con progreso de envio gratis, gift wrap via `cart.attributes` y recomendaciones complementarias.
- Metaobject-ready content blocks para size guides, specs, ingredients/materials y care instructions.

### Diferenciadores Secundarios

- Modo de intensidad comercial por preset o seccion: calm, balanced, campaign.
- Product card adaptable: minimal, swatch-first, quick-buy, editorial.
- Collection layout toggle: editorial view vs compact catalog.
- Predictive search accesible con resultados agrupados.
- Presets por industria y no solo por color.

## Riesgos de Benchmarking

- Copiar demasiados features puede volver el tema indistinguible de Prestige/Palo Alto/Broadcast.
- Usar el nombre `Atelier` podria confundirse con el tema gratuito de Shopify. Se recomienda mantener `Atelier Flow` solo como nombre interno y buscar un nombre final distinto antes de submission.
- Los hotspots/lookbooks ya existen en temas premium; nuestro diferencial debe estar en configuracion, accesibilidad, mobile UX y relacion con product cards.

## Decision

Mantener el concepto `Atelier Flow` como direccion interna, pero empezar exploracion de nombre final. Candidatos iniciales:

- Loom
- Aria
- Frame
- Relic
- Forma
- Thread
- Origin
- Maison
- Studio
- Vale

Evitar `Atelier` como nombre final por posible conflicto/confusion con el tema gratuito de Shopify.

