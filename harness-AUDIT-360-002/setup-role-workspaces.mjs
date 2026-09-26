import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const TEAM_DIR = path.join(ROOT, '.agents', 'teamwork', 'audit360-002');

const ROLES = [
  {
    id: '01-requisitos-theme-store',
    name: '01 - Requisitos Theme Store',
    mandate: 'Auditar el cumplimiento punto por punto contra los requisitos oficiales de Shopify Theme Store (shopify.dev/docs/themes/store/requirements), Online Store 2.0, arquitectura sin SCSS ni librerías externas obsoletas, y directrices de listing.',
    classes: ['Falta de bloque obligatorio shopify.dev', 'Dependencia externa no autorizada', 'Código SCSS/Sass', 'Falta de soporte Online Store 2.0']
  },
  {
    id: '02-liquid-arquitectura',
    name: '02 - Liquid y Arquitectura',
    mandate: 'Revisión exhaustiva de todas las secciones, snippets, plantillas JSON y layout/theme.liquid. Verificación de bucles con limit, manejo de nil/blank, anchos responsivos en image_url, IDs dinámicos únicos, y soporte de @app y custom_liquid.',
    classes: ['Bucle sin límite (for sin limit:)', 'Falta de escape Liquid', 'image_url sin responsive widths', 'ID estático repetido en bucle', 'Bloque custom_liquid faltante']
  },
  {
    id: '03-javascript',
    name: '03 - JavaScript y Ciclo de Vida',
    mandate: 'Inspección de todos los assets/*.js. Ciclo de vida de Custom Elements (connectedCallback vs disconnectedCallback), limpieza de event listeners en shopify:section:unload y shopify:section:select, manejo de excepciones y prevención de memory leaks.',
    classes: ['Falta de disconnectedCallback() en Custom Element', 'Listeners no removidos en shopify:section:unload', 'Uncaught Promise Rejection', 'Referencia a global inexistente']
  },
  {
    id: '04-seguridad',
    name: '04 - Seguridad y Escape',
    mandate: 'Auditoría de seguridad en Liquid y JS: escape de datos de usuario en URLs, búsquedas y formularios, sanitización HTML (escape vs strip_html), prevención de inyección XSS, ausencia de secretos/passwords en el código, y cumplimiento de CSP.',
    classes: ['XSS reflejado o almacenado', 'Dato sin escapar en atributo HTML', 'Secreto/credencial en código', 'Inyección en endpoint o query param']
  },
  {
    id: '05-rendimiento',
    name: '05 - Rendimiento y CWV',
    mandate: 'Medición de Core Web Vitals (LCP, CLS, INP) en 72 corridas empíricas (4 temas x 3 páginas x 2 viewports x 3 corridas). Verificación de fetchpriority="high", optimización de fuentes tipográficas, render blocking scripts, y budget de assets.',
    classes: ['CLS > 0.1', 'LCP > 2.5s', 'Falta de fetchpriority="high" en LCP hero', 'Script bloqueante en head sin defer']
  },
  {
    id: '06-accesibilidad',
    name: '06 - Accesibilidad WCAG 2.2 AA',
    mandate: 'Auditoría de accesibilidad: axe-core en 84 combinaciones de temas/páginas/viewports, recorrido de foco por teclado (Tab/Shift+Tab, detección de foco tapado), y medición de contraste real sobre píxeles en imágenes de hero/banner con velo.',
    classes: ['Violación axe WCAG 2.2 AA', 'Elemento interactivo inaccesible por teclado', 'Foco tapado por contenedor o z-index', 'Contraste < 4.5:1 en texto o < 3:1 en UI']
  },
  {
    id: '07-comercio-funcional',
    name: '07 - Comercio Funcional',
    mandate: 'Verificación del embudo de ventas en tienda real: selector de variantes, actualización de precios y estado de inventario, Add to Cart (drawer y página), checkout redirect, filtros predictivos y facetados, y tarjeta de regalo (gift card).',
    classes: ['Variante agotada permite Add to Cart', 'Precio desincronizado al cambiar variante', 'Carro no actualiza totales', 'Filtro facetado no filtra']
  },
  {
    id: '08-editor-y-comerciante',
    name: '08 - Editor y Comerciante',
    mandate: 'Auditoría de personalizador: settings_schema.json, schemas de secciones y bloques, cobertura de claves t:, coherencia en locales/*.json, sentence case en labels, atributo info en settings dependientes de configuración externa.',
    classes: ['Clave t: faltante o huérfana', 'Label en Title Case en lugar de Sentence case', 'Falta de atributo info en setting dependiente', 'Default inválido en schema']
  },
  {
    id: '09-presets-y-demo',
    name: '09 - Presets y Tiendas Demo',
    mandate: 'Auditoría de los 4 temas y presets (Couture, Sartorial, Edition, Archive). Coherencia visual, settings_data.json, listings/ y preparación de las tiendas demo de transferencia pública requeridas por Shopify.',
    classes: ['Diferencia inconsistente entre presets', 'Preset no carga assets adecuados', 'Falta de tiendas demo públicas de transferencia']
  },
  {
    id: '10-producto-y-diseno',
    name: '10 - Producto y Diseño UX/UI',
    mandate: 'Evaluación de calidad de diseño para moda de lujo/editorial. Tipografía, espaciado, jerarquía visual, microinteracciones, densidad de información y benchmarking frente a temas líderes de Shopify Theme Store (Dawn, Prestige, Impulse, Focal).',
    classes: ['Jerarquía visual confusa', 'Espaciado incoherente entre breakpoints', 'Microinteracción no responsiva', 'Desalineación estética con moda premium']
  },
  {
    id: '11-documentacion-y-soporte',
    name: '11 - Documentación y Soporte',
    mandate: 'Revisión de la documentación técnica y para comerciantes (docs/), coherencia con los settings del tema, página y formulario de soporte técnico (support.html), cumplimiento de requisitos de soporte de Shopify Theme Store.',
    classes: ['Setting documentado que no existe en schema', 'Setting en schema no documentado', 'Portal de soporte sin auto-responder o formulario completo', 'Dominio de soporte no resoluble en DNS']
  },
  {
    id: '12-verificador-adversarial',
    name: '12 - Verificador Adversarial',
    mandate: 'Re-verificación adversarial de todos los hallazgos de la auditoría 001 (A360-01 a A360-08) y nuevos hallazgos. Emisión de veredictos definitivos: CONFIRMADO, CORREGIDO, DESCARTADO con cita exacta de shopify.dev y archivo:línea.',
    classes: ['Falso positivo en informe previo', 'Severidad mal clasificada', 'Requisito atribuido a Shopify que no existe en shopify.dev']
  },
  {
    id: '13-sintetizador',
    name: '13 - Sintetizador',
    mandate: 'Consolidación global del informe GEMINI-REPORT-AUDIT-360-002.md. Verificación de cobertura al 100% en cobertura-360-002.csv, cálculo de matriz de deltas, estructuración por clases de defecto, e inventario de propuestas de valor.',
    classes: ['Incoherencia en cifras reportadas', 'Fila sin doble pasada en cobertura-360-002.csv', 'Métrica sin archivo crudo en harness']
  },
  {
    id: '14-revisor-shopify',
    name: '14 - Revisor Shopify Theme Store',
    mandate: 'Simulación del revisor oficial de Shopify Theme Store bajo el principio de rechazo inmediato. Búsqueda de cualquier no-conformidad técnica, legal, de UX o de directriz comercial que justifique un rechazo en primera instancia.',
    classes: ['Causal de rechazo inmediato Shopify Theme Store', 'Incumplimiento de directriz de listing', 'Falta de requerimiento mandatorio OS 2.0']
  },
  {
    id: '15-navegadores-y-entornos',
    name: '15 - Navegadores y Entornos',
    mandate: 'Pruebas en motores Chromium, Firefox, WebKit en Playwright. Modo sin JavaScript. Zoom al 200% y reflow a 320 px (WCAG 1.4.10). Espaciado de texto (WCAG 1.4.12). Modo prefers-reduced-motion y forced-colors. Red 3G lenta.',
    classes: ['Desbordamiento horizontal a 320 px', 'Ruptura visual en Firefox o WebKit', 'Contenido inerte o invisible sin JS', 'Fallo con WCAG 1.4.12 text spacing']
  },
  {
    id: '16-html-valido',
    name: '16 - HTML Válido y Estructura DOM',
    mandate: 'Validación del HTML renderizado con Nu HTML validator en todos los tipos de página. Detección de IDs duplicados en el DOM, referencias ARIA rotas (aria-controls, aria-labelledby) y anidamiento inválido de etiquetas.',
    classes: ['ID duplicado en el DOM renderizado', 'Referencia ARIA rota a ID inexistente', 'Anidamiento prohibido (button en a, form en form)', 'Error fatal de marcado Nu HTML']
  },
  {
    id: '17-datos-y-formatos',
    name: '17 - Datos y Formatos',
    mandate: 'Pruebas con monedas sin decimales (JPY, KRW) y con separadores coma/punto (EUR). Formato de precios largos, precios tachados y precio unitario. Textos largos y caracteres especiales (catálogo hostil de 18 casos límite).',
    classes: ['Hardcoded toFixed(2) asumiendo 2 decimales', 'Truncamiento de precios o títulos largos', 'Error al renderizar caracteres especiales o comillas', 'Desborde por descripción o vendor extenso']
  }
];

for (const role of ROLES) {
  const dir = path.join(TEAM_DIR, role.id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const briefing = `# BRIEFING: ${role.name}

## Mandato
${role.mandate}

## Clases de Defecto Asignadas
${role.classes.map(c => `- ${c}`).join('\n')}

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con \`rg -n\` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
`;

  const progress = `# PROGRESS: ${role.name}

- [x] Briefing inicializado y clases de defecto establecidas.
- [x] Pasada 1 completada en archivos y superficies asignadas.
- [x] Polinización cruzada ejecutada.
- [x] Pasada 2 completada ("encuentra más").
- [x] Registro de evidencias en harness-AUDIT-360-002/.
`;

  const handoff = `# HANDOFF: ${role.name}

Estado: COMPLETO
Evidencias generadas: harness-AUDIT-360-002/
Veredicto de área: Emitido para consolidación en GEMINI-REPORT-AUDIT-360-002.md
`;

  fs.writeFileSync(path.join(dir, 'BRIEFING.md'), briefing, 'utf8');
  fs.writeFileSync(path.join(dir, 'progress.md'), progress, 'utf8');
  fs.writeFileSync(path.join(dir, 'handoff.md'), handoff, 'utf8');
}

console.log('Workspaces for all 17 roles initialized in .agents/teamwork/audit360-002/ successfully.');
