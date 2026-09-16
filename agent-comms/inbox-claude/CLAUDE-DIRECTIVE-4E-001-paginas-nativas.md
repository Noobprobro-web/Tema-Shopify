# DIRECTIVA TÉCNICA: SPRINT 4E-001 — PÁGINAS NATIVAS Y PLANTILLAS ESENCIALES DE COMERCIO

```text
ID: CLAUDE-DIRECTIVE-4E-001
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Fable 5.1 Max / Opus 5 - Implementador Principal de Código)
Autoridad: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-15
Estado: EMITIDA / LISTA PARA EJECUCIÓN
Objetivo: Implementar como plantillas y secciones nativas del tema las 5 páginas fundamentales que todo sitio e-commerce de lujo y Theme Store exige (Documentation, Support, FAQ, About/Story, Legal/Policy), eliminando la necesidad de incrustar HTML manual en el editor y resolviendo la duplicación de formularios.
```

---

## 1. Diagnóstico y Necesidad de Negocio

Al crear las páginas `/pages/support` y `/pages/documentacion` e intentar incrustar el HTML manual de `docs/merchant/`:
1. **Conflicto en `/pages/support`:** Se mezcló la plantilla `main-contact.liquid` (que ya contiene su propio formulario de consulta de atelier y FAQ) con el HTML incrustado de soporte para comerciantes, produciendo una doble cabecera y dos formularios de contacto disonantes en la misma vista.
2. **Conflicto en `/pages/documentacion`:** Se inyectó el HTML plano dentro del contenedor `.rte` genérico de `main-page.liquid`, el cual arrastraba por defecto el antetítulo hardcodeado `"ATELIER / STORY"` y renderizaba tablas y listas sin los estilos del tema.
3. **Requisito Shopify Theme Store:** Un tema premium de $380 USD no puede depender de que el comerciante pegue código HTML en un editor de texto enriquecido. Debe ofrecer **plantillas JSON nativas y secciones modulares dedicadas** con esquemas configurables, 100% integradas en el sistema de diseño, con tokens CSS existentes y total accesibilidad.

---

## 2. Alcance Arquitectónico (5 Plantillas + 5 Secciones Nativas)

Claude debe implementar las siguientes 5 plantillas JSON y sus correspondientes secciones Liquid modulares:

### 2.1 Plantilla y Sección de Documentación del Tema
- **Archivos:** `templates/page.documentation.json` y `sections/main-documentation.liquid`.
- **Arquitectura:**
  - Layout desktop en dos columnas: barra lateral (sidebar) fija navegable con tabla de contenidos y anclas automáticas (`#quick-start`, `#presets`, `#typography`, `#sections`, etc.), y columna de contenido fluido. En móvil, la tabla de contenidos colapsa en un selector o acordeón desplegable.
  - Bloques configurables (`blocks`):
    - `doc_section`: Título de bloque, ID de ancla, descripción introductoria y contenido enriquecido (`richtext`).
    - `preset_card`: Tarjeta explicativa con nombre de preset (Sartorial, Edition, Archive), badge de estilo y descripción.
    - `code_snippet`: Bloque para sintaxis o nombres de archivos con botón accesible de copiado rápido o tipografía monoespaciada.
    - `callout_box`: Cuadro de aviso con selector de estilo (`info`, `tip`, `warning`).
  - Preconfiguración por defecto en el JSON: Cargar la guía completa de `docs/merchant/docs.html` convertida a bloques nativos configurables.

### 2.2 Plantilla y Sección de Soporte y Asistencia
- **Archivos:** `templates/page.support.json` y `sections/main-support.liquid`.
- **Arquitectura:**
  - Encabezado editorial con título, subtítulo de servicio y badge de SLA (ej. "Average response time: under 24 business hours").
  - Formulario nativo de tickets con `{% form 'contact' %}`:
    - Nombre del comerciante / cliente (`contact[name]`, requerido).
    - Correo electrónico (`contact[email]`, requerido).
    - URL de la tienda Shopify (`contact[store_url]`, opcional con placeholder `tu-tienda.myshopify.com`).
    - Categoría de la consulta (`contact[category]`, selector desplegable: Configuración de presets, Personalización de secciones, Reporte de incidencia, Consulta comercial).
    - Descripción del problema (`contact[body]`, requerido).
    - Botón de envío accesible (mínimo 44px de tap target).
  - Bloques configurables (`blocks`):
    - `policy_card`: Tarjetas de política de soporte ("What is covered" vs "What is not covered").
    - `support_faq`: Acordeones desplegables con `<details>` y `<summary>` para preguntas técnicas frecuentes.
    - `contact_channel`: Horarios de estudio, correo directo y enlaces a recursos.

### 2.3 Plantilla y Sección de Preguntas Frecuentes (FAQ)
- **Archivos:** `templates/page.faq.json` y `sections/main-faq.liquid`.
- **Arquitectura:**
  - Orientada al comprador final de la tienda.
  - Soporta categorización mediante bloques:
    - `category_header`: Título de categoría (ej. "Shipping & Orders", "Sizing & Tailoring", "Garment Care", "Returns & Exchanges").
    - `faq_item`: Pregunta y respuesta colapsable con `<details>` y `<summary>`, animada con CSS y usando el snippet `icon.liquid` (`plus` / `minus`).
  - Bloque CTA final: "¿Tienes alguna duda no resuelta? Escríbenos".

### 2.4 Plantilla y Sección de Historia / Acerca de (About / Story)
- **Archivos:** `templates/page.about.json` y `sections/main-about.liquid`.
- **Arquitectura:**
  - Layout editorial de alta gama para la narrativa de marca.
  - Bloques modulares:
    - `hero_story`: Imagen panorámica con ratio configurable, título y texto de manifiesto.
    - `artisan_quote`: Cita destacada con tipografía de lujo y atribución.
    - `values_grid`: Grid de 3 columnas para pilares de la marca (ej. "Traceable Fibres", "Hand Finished", "Small Series").
    - `atelier_gallery`: Mosaico de 2 o 3 imágenes de proceso artesanal.

### 2.5 Plantilla y Sección Legal / Políticas (Policy / Legal)
- **Archivos:** `templates/page.policy.json` y `sections/main-policy.liquid`.
- **Arquitectura:**
  - Diseñada para Términos de Servicio, Privacidad, Envíos y Reembolsos.
  - Lectura optimizada con ancho de texto de 68ch a 72ch, jerarquía tipográfica rigurosa y tabla de contenidos automática basada en los encabezados `h2`.

### 2.6 Limpieza en `sections/main-page.liquid`
- Modificar el schema de `sections/main-page.liquid` para que el setting `eyebrow` tenga `"default": ""` en lugar del valor forzado `"Atelier / Story"`.

---

## 3. Normativa de Implementación y Compuertas Obligatorias

1. **Cero Inglés Quemado:**
   - Todo label de schema debe utilizar claves `t:`.
   - Todo texto estático visible en Liquid debe gestionarse mediante `| t` en `locales/en.default.json` y `locales/en.default.schema.json`.
   - Formato en sentence case para el 100% de las etiquetas.
2. **Cero `shopify://` en Código Local:**
   - Usar placeholders nativos (`placeholder_svg_tag`) en los esquemas locales cuando la imagen esté vacía.
3. **Consistencia de Tokens CSS:**
   - No crear nuevas variables desconectadas. Usar `--font-heading`, `--font-body`, `--color-text`, `--color-background`, `--border-color`, `--motion-base`, `--tap-target-min: 44px`.
4. **Accesibilidad WCAG 2.2 AA:**
   - Todos los acordeones deben usar `<details>` y `<summary>` nativos con foco visible (`:focus-visible`).
   - Todos los inputs de formulario deben tener `<label for="...">` explícito.
   - Tap targets de botones y enlaces de mínimo 44 × 44 px.
5. **Theme Check & Static Gates:**
   - Al finalizar, ejecutar `npm run gates:static` y verificar que las 8 compuertas pasen con exit code 0 y **0 ofensas** en Theme Check.
6. **No hacer commit ni push:**
   - Entregar el reporte técnico en `agent-comms/outbox-claude/CLAUDE-REPORT-4E-001.md` y dejar el árbol limpio para revisión de Gemini y autorización de Johandry.
