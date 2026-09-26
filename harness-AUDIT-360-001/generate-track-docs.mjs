import fs from 'fs';
import path from 'path';

const BASE = path.join(process.cwd(), '.agents', 'teamwork', 'audit360');

const TRACKS = [
  {
    dir: '01-requisitos-theme-store',
    briefing: `# BRIEFING: 01-requisitos-theme-store

## Objetivo
Revisar punto por punto las directrices oficiales de Shopify Theme Store obtenidas en vivo de shopify.dev hoy:
- \`https://shopify.dev/docs/storefronts/themes/store/requirements\`
- \`https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme\`
- \`https://shopify.dev/docs/storefronts/themes/store/review-process/listings\`

## Metodología
Verificación estática del paquete (\`npm run gates:package\`), inspección de schemas, validación de presets, chequeo de listings y evaluación de dependencias comerciales.
`,
    progress: `# PROGRESS: 01-requisitos-theme-store

- [x] Fetch en vivo de shopify.dev (requirements, submit-theme, listings).
- [x] Ejecución de gates:package sobre git archive HEAD (PASS).
- [x] Inspección de config/settings_schema.json (theme_info).
- [x] Análisis de presets y listings/.
- [x] Identificación de gaps comerciales (Fila 107 y 108).
`,
    handoff: `# HANDOFF: 01-requisitos-theme-store

## Hallazgos Clave
1. **[P0] Fila 107 - Documentación y Soporte Públicos Inexistentes:**
   - \`config/settings_schema.json:1-15\`: \`theme_documentation_url\` y \`theme_support_url\` apuntan a \`ruizdigital.com\`, dominio no activo públicamente.
   - El formulario de soporte en \`docs/merchant/support.html\` es un \`mailto:\` y carece de subida de archivos, campo de contraseña de storefront y auto-responder.
2. **[P0] Fila 108 - Tiendas Demo de Transferencia Inexistentes:**
   - Shopify exige 3 tiendas demo públicas (Client Transfer) con Bogus Gateway y sin contraseña. Actualmente solo existe 1 tienda dev protegida con password.
3. **[P1] gates:ledger en git archive HEAD (CRLF sensitivity):**
   - \`scripts/ledger-verify.mjs:58\`: Falla en checkout CRLF en Windows al procesar el archivo sin normalizar \\r\\n.

## Veredicto del Área
NO APTO (bloqueado por dependencias comerciales externas de submission: dominio público, formulario backend y 3 tiendas demo).
`
  },
  {
    dir: '02-liquid-arquitectura',
    briefing: `# BRIEFING: 02-liquid-arquitectura

## Objetivo
Auditar los 53 archivos Liquid (layouts, sections, snippets, templates) buscando bugs lógicos, estados degenerados (vacío, uno solo, muchos, muy largo, faltante), bloques requeridos (@app, custom_liquid), section groups y bucles sin límite.
`,
    progress: `# PROGRESS: 02-liquid-arquitectura

- [x] Escaneo automatizado de bucles for sin límite (\`harness-AUDIT-360-001/audit-02-liquid.mjs\`).
- [x] Verificación de bloques @app y custom_liquid en todas las secciones.
- [x] Chequeo de templates requeridos contra shopify.dev.
- [x] Validación de estados degenerados en producto y colección.
`,
    handoff: `# HANDOFF: 02-liquid-arquitectura

## Hallazgos Clave
1. **[P1] sections/main-product.liquid carece de bloque \`custom_liquid\`:**
   - Requisito Shopify Theme Store: "Introduce Custom Liquid blocks into certain sections. Add a Custom Liquid block anywhere you'd consider adding an app block...".
   - \`sections/featured-product.liquid\` tiene @app y custom_liquid (L441, 741). \`sections/main-product.liquid\` tiene @app (L1072) pero NO tiene bloque \`custom_liquid\`.
2. **[P2] sections/recently-viewed.liquid:34 bucle sin límite explícito:**
   - \`{%- for result in search.results -%}\` no tiene \`limit:\` ni paginación en la sección si es renderizada directamente por Section Rendering API.
3. **[P2] Ausencia de templates clásicos de clientes (\`templates/customers/*\`):**
   - El tema implementa exclusivamente Cuentas Nuevas mediante \`<shopify-account>\`. Si un comerciante usa Cuentas Clásicas, carece de plantillas estilizadas en el tema.

## Veredicto del Área
APTO CON OBSERVACIONES
`
  },
  {
    dir: '03-javascript',
    briefing: `# BRIEFING: 03-javascript

## Objetivo
Auditar los archivos JS en \`assets/\`: Custom Elements, ciclo de vida en el Theme Editor (\`shopify:section:load\` y \`shopify:section:unload\`), listeners duplicados, manejo de errores en fetch y fugas de memoria.
`,
    progress: `# PROGRESS: 03-javascript

- [x] Escaneo estático de \`assets/*.js\` con \`audit-03-javascript.mjs\`.
- [x] Inspección de Custom Elements (7 componentes registrados).
- [x] Verificación de ciclo de vida del Theme Editor.
- [x] Análisis de AbortController y excepciones en fetch.
`,
    handoff: `# HANDOFF: 03-javascript

## Hallazgos Clave
1. **[P2] assets/theme.js no implementa limpieza en \`shopify:section:unload\`:**
   - \`assets/theme.js\` escucha \`shopify:section:load\` (L4683, L4734) para re-inicializar componentes, pero no implementa ningún listener para \`shopify:section:unload\`.
   - En sesiones prolongadas de personalización en el Theme Editor, esto puede acumular referencias huérfanas en memoria.
2. **[Cumplimiento] 7 Custom Elements autónomos:**
   - \`editorial-lookbook\`, \`product-card\`, \`product-form\`, \`product-gallery\`, \`cart-drawer\`, \`predictive-search\`, \`facet-filters-form\` están bien desacoplados y encapsulados.

## Veredicto del Área
APTO CON OBSERVACIONES
`
  },
  {
    dir: '04-seguridad',
    briefing: `# BRIEFING: 04-seguridad

## Objetivo
Escanear exhaustivamente todo el código Liquid y JS para detectar vulnerabilidades XSS, inyección en objetos no sanitizados, fuga de datos sensibles y redirecciones abiertas.
`,
    progress: `# PROGRESS: 04-seguridad

- [x] Escaneo automatizado de filtros raw, search.terms, cart.note y propiedades de línea (\`audit-04-security.mjs\`).
- [x] Inspección de handlers inline y scripts JSON.
- [x] Chequeo de validación de orígenes en redirecciones de JS.
`,
    handoff: `# HANDOFF: 04-seguridad

## Hallazgos Clave
1. **[Excelente] Sanitización rigurosa de entradas de usuario:**
   - \`cart.note\` está estrictamente escapado con \`| escape\` en \`cart-drawer.liquid:458\` y \`main-cart-items.liquid:177\`.
   - Propiedades de línea de carrito verifican esquema HTTPS y ruta \`/uploads/\` en \`cart-drawer.liquid:184-186\`, mitigando ataques de enlaces maliciosos.
   - Redirecciones en \`theme.js\` comprueban explícitamente \`navigationUrl.origin === window.location.origin\`.
   - 0 usos de filtro \`raw\` en templates y snippets.
   - 0 dependencias externas no autorizadas en producción.

## Veredicto del Área
APTO (0 vulnerabilidades de seguridad detectadas).
`
  },
  {
    dir: '07-comercio-funcional',
    briefing: `# BRIEFING: 07-comercio-funcional

## Objetivo
Probar en vivo todas las funciones comerciales obligatorias de Shopify: variantes, agotado, selling plans, pickup availability, unit pricing, cuotas, gift card con destinatario, carrito/drawer, búsqueda y filtros, blog con comentarios, cuentas y localización.
`,
    progress: `# PROGRESS: 07-comercio-funcional

- [x] Ejecución del harness en vivo \`audit-07-commerce.mjs\` con Playwright contra la tienda real con bypass de cookies.
- [x] Validación de PDPs: variantes, precios, unit price, pickup availability, botón disabled en agotado.
- [x] Verificación de carrito vacío y drawer.
- [x] Verificación de búsqueda, facets y ordenamiento.
- [x] Verificación de blog, 404 y formularios de localización.
`,
    handoff: `# HANDOFF: 07-comercio-funcional

## Hallazgos Clave
1. **[Verificado en vivo] Funcionalidades comerciales operativas:**
   - PDP con variantes (\`qa5a-f04-colour-size\`): selectors funcionales, add-to-cart funcional, pickup availability activo, precio unitario activo.
   - Agotado (\`qa5a-f02-sold-out\`): botón disabled mostrando "SOLD OUT", badge visible.
   - Carrito y Drawer: apertura correcta, actualización de cantidades y subtotal.
   - Búsqueda y Facets: filtros por precio/color/disponibilidad y ordenamiento funcionales.
   - Blog y 404: respuesta 200, comentarios soportados en Liquid, enlace de retorno en 404.
2. **[Observación / Fixtures de Tienda Dev] Fila 35 y 72:**
   - Selling plans y Gift card recipient form están 100% implementados en Liquid, pero no se pueden disparar en vivo porque la tienda dev no tiene instalada una app de suscripción ni producto gift card en catálogo.

## Veredicto del Área
APTO CON OBSERVACIONES
`
  },
  {
    dir: '08-editor-y-comerciante',
    briefing: `# BRIEFING: 08-editor-y-comerciante

## Objetivo
Evaluar la experiencia del comerciante en el personalizador: etiquetas de configuración, atributos \`info\`, sentence case, claves \`t:\`, valores por defecto, esquemas de color y paridad inglés/español.
`,
    progress: `# PROGRESS: 08-editor-y-comerciante

- [x] Escaneo de schemas de 53 secciones y \`settings_schema.json\` con \`audit-08-merchant-editor.mjs\`.
- [x] Verificación de claves \`t:\` en etiquetas, descripciones y presets.
- [x] Comprobación de paridad entre \`en.default.json\`, \`es.json\`, \`en.default.schema.json\` y \`es.schema.json\`.
- [x] Búsqueda de términos internos prohibidos y análisis de Sentence Case.
`,
    handoff: `# HANDOFF: 08-editor-y-comerciante

## Hallazgos Clave
1. **[Excelente] 100% de labels gestionados por localización \`t:\`:**
   - 0 etiquetas sin \`t:\`, 0 presets sin \`t:\`.
   - Paridad total (0 claves huérfanas o faltantes entre EN y ES).
2. **[P2] 1 caso de Title Case en traducción EN de schema:**
   - \`locales/en.default.json\`: \`sections.cart.complimentary_additions\`: "Complimentary Additions" (debe ser sentence case: "Complimentary additions").
3. **[P3] Identificadores de schema con nombres técnicos:**
   - El id \`popover_position\` en \`sections/lookbook.liquid\` usa internamente "popover", aunque el texto al comerciante está correctamente rotulado como "Product card position". Se recomienda renombrar el id en una refactorización menor.

## Veredicto del Área
APTO CON OBSERVACIONES
`
  },
  {
    dir: '09-presets-y-demo',
    briefing: `# BRIEFING: 09-presets-y-demo

## Objetivo
Comparar las 4 configuraciones de tema (Couture, Sartorial, Edition, Archive) contra \`listings/\`, verificar autenticidad del contenido (cero lorem ipsum y cero onboarding placeholders), licencias de activos y definir los requerimientos para las 3 tiendas demo.
`,
    progress: `# PROGRESS: 09-presets-y-demo

- [x] Escaneo de templates en \`templates/\` y \`listings/\` con \`audit-09-presets-demo.mjs\`.
- [x] Búsqueda de lorem ipsum y placeholders de imágenes.
- [x] Inspección de presets en \`config/settings_data.json\`.
- [x] Definición de brechas para las tiendas demo según requisitos de Theme Store.
`,
    handoff: `# HANDOFF: 09-presets-y-demo

## Hallazgos Clave
1. **[Excelente] Cero contenido dummy:**
   - 0 ocurrencias de "lorem ipsum".
   - 0 referencias a imágenes de onboarding de Shopify (\`lifestyle-1\`, \`collection-1\`, etc.).
   - 4 presets con identidad visual propia (tipografías diferenciadas y paletas sobrias).
2. **[P0] Fila 108 - Tres Tiendas Demo Independientes Requeridas:**
   - Shopify exige URLs públicas de demo para cada preset listado. Actualmente no existen las tiendas demo públicas de Sartorial, Edition y Archive.

## Veredicto del Área
NO APTO (bloqueado por creación y hosting de las 3 tiendas demo).
`
  },
  {
    dir: '10-producto-y-diseno',
    briefing: `# BRIEFING: 10-producto-y-diseno

## Objetivo
Evaluar UX, jerarquía visual, conversión y calidad estética del tema en comparación con los temas líderes de moda de $380 en la Shopify Theme Store (Prestige, Impact, Be Yours, Symmetry, Stiletto).
`,
    progress: `# PROGRESS: 10-producto-y-diseno

- [x] Análisis comparativo contra \`docs/top-theme-benchmark.md\` y estándares de Theme Store 2026.
- [x] Evaluación de diferenciadores: ritmo editorial, shoppable lookbook con hotspots, drawer cart con progress bar.
- [x] Identificación de fortalezas y funciones faltantes para competir a nivel premium.
`,
    handoff: `# HANDOFF: 10-producto-y-diseno

## Hallazgos Clave
1. **Fortalezas de Sartorial:**
   - Estética editorial de lujo silencioso, minimalista y refinada.
   - Rendimiento excepcional (CLS 0, TTFB rápido, axe 0 violaciones).
   - Shoppable lookbook con interacción por teclado y mobile fallback.
2. **Propuestas de Mejora Competitiva (P3):**
   - *Quick View Modal:* Muy demandado en el nicho de moda de $380 para compras rápidas desde el grid.
   - *Sticky Add to Cart Bar en Mobile:* Mejora la conversión en PDPs con galerías largas o descripciones extensas.
   - *Countdown / Drop Mode:* Opción para colecciones de edición limitada o lanzamientos cápsula.

## Veredicto del Área
APTO (diseño y UX de nivel competitivo para $380).
`
  },
  {
    dir: '11-documentacion-y-soporte',
    briefing: `# BRIEFING: 11-documentacion-y-soporte

## Objetivo
Auditar la documentación (\`docs/merchant/docs.html\`), política de soporte (\`docs/merchant/support.html\`) y cumplimiento del formulario de soporte según los requisitos de Shopify Theme Store.
`,
    progress: `# PROGRESS: 11-documentacion-y-soporte

- [x] Ejecución de \`audit-11-docs-support.mjs\`.
- [x] Verificación de URLs en \`settings_schema.json\` (\`theme_info\`).
- [x] Auditoría de los 8 campos requeridos en el formulario de soporte de Shopify.
- [x] Cotejo de configuración documentada vs 220 labels reales del tema.
`,
    handoff: `# HANDOFF: 11-documentacion-y-soporte

## Hallazgos Clave
1. **[P0] URLs de soporte y documentación inaccesibles:**
   - \`theme_documentation_url\` y \`theme_support_url\` apuntan a \`ruizdigital.com\`, dominio no activo.
2. **[P0] Formulario de soporte incumple requisitos de Theme Store:**
   - Implementado como \`mailto:support@ruizdigital.com\`.
   - Carece de: subida de archivos adjuntos, campo de contraseña de storefront, y confirmación/auto-responder automático por backend.
3. **[P2] Cobertura de settings en docs.html:**
   - Solo 30 de los 220 labels del tema están explicados en \`docs.html\`.

## Veredicto del Área
NO APTO (requiere infraestructura web pública y formulario de soporte con backend).
`
  }
];

for (const t of TRACKS) {
  const dirPath = path.join(BASE, t.dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(path.join(dirPath, 'BRIEFING.md'), t.briefing, 'utf8');
  fs.writeFileSync(path.join(dirPath, 'progress.md'), t.progress, 'utf8');
  fs.writeFileSync(path.join(dirPath, 'handoff.md'), t.handoff, 'utf8');
}

console.log('Successfully generated briefings, progress, and handoffs for tracks 01-04, 07-11!');
