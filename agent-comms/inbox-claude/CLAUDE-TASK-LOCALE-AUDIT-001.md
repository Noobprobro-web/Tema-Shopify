# CLAUDE-TASK: Auditoría Integral de Cadenas en Inglés y Resolución de Traducciones en Todas las Páginas

```text
ID: CLAUDE-TASK-LOCALE-AUDIT-001
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5 - Implementador Principal)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-21
Estado: DIRECTIVA VINCULANTE
```

---

## 1. Contexto y Problema

Johandry ha activado el español en Shopify Admin. El selector minimalista `EN / ES` en el header y en el menú móvil conmuta la URL a `/es/` y las cadenas de interfaz del tema (`locales/es.json` como carrito, buscador, checkout y formularios) ya responden en español.

**Sin embargo, Johandry reporta que al navegar por la tienda todavía hay muchas páginas con textos en inglés.**

El diagnóstico arquitectónico de Gemini revela las fuentes exactas de este comportamiento:
1. **Cadenas en Plantillas JSON (`templates/*.json`):**
   - `templates/page.faq.json`: Preguntas frecuentes y títulos de categoría ("Shipping and orders", "When will my order be dispatched?", "Sizing and tailoring").
   - `templates/page.about.json`: Textos de "The atelier", valores de marca ("Traceable fibres", "Hand finished", "Small series").
   - `templates/page.documentation.json`: Guía técnica y bloques de presets ("Quick start", "Architecture", etc.).
   - `templates/page.support.json`: Títulos y canales de atención.
   - `templates/page.policy.json`: Políticas demo de envío y devoluciones.
   - `templates/product.json`: Bloques plegables de ficha ("Composition & care", "Shipping & complimentary returns").
   - `templates/index.json`: Titulares de secciones de portada ("Form in quiet movement", "The Atelier Craft", "Autumn in Motion", etc.).
2. **Menús de Navegación de Shopify:**
   - Menú principal ("Catalog", subcolecciones) y pie de página en Shopify Admin.
3. **Potenciales Textos Literales en Liquid:**
   - Requiere auditoría para descartar cualquier texto en inglés "quemado" (hardcoded) sin filtro `| t`.

---

## 2. Alcance Obligatorio de la Tarea

Claude debe ejecutar los siguientes 4 frentes:

### Frente A: Auditoría de Código Liquid y Snippets (Cero Hardcoding)
- Escanear todos los archivos `.liquid` en `sections/`, `snippets/`, `layout/` y `templates/`.
- Identificar si existe cualquier texto visible en inglés que no use el filtro `| t`.
- Si se encuentra alguna cadena hardcodeada, reemplazarla por clave canónica `t:`, registrarla en `locales/en.default.json` y traducirla en `locales/es.json` con paridad idéntica de variables y HTML.

### Frente B: Traducción de Páginas Nativas y Ficha de Producto
- Proveer las traducciones al español correspondientes para los bloques y secciones de las 5 páginas nativas:
  1. `/pages/faq` (`templates/page.faq.json`)
  2. `/pages/about` (`templates/page.about.json`)
  3. `/pages/documentation` (`templates/page.documentation.json`)
  4. `/pages/support` (`templates/page.support.json`)
  5. `/pages/policy` (`templates/page.policy.json`)
  6. Ficha de producto (`templates/product.json`): Acordeones "Composition & care" y "Shipping & complimentary returns".

### Frente C: Solución de Sincronización en Tienda Real (GraphQL Admin API)
- En Shopify, el contenido de `templates/*.json`, páginas y menús pertenece al recurso `ONLINE_STORE_THEME`, `PAGE` y `LINK_LIST`. Para que `/es/` los muestre en español, deben registrarse en la base de datos de traducciones de Shopify mediante la mutación GraphQL `translationsRegister`.
- Claude debe escribir y ejecutar un script automatizado `scripts/translate-storefront.mjs` (o documentar su ejecución mediante la CLI/Admin API existente) que registre las traducciones al español de:
  - Las 5 páginas nativas.
  - Los ítems del menú de navegación.
  - Las secciones clave de la tienda.
- Alternativamente, si alguna parte requiere ejecución vía app, detallar el procedimiento exacto con *Shopify Translate & Adapt*.

### Frente D: Verificación Estricta y Compuertas
- Ejecutar y reportar:
  ```bash
  npm run gates:static
  node scripts/locale-key-inventory.mjs
  node agent-comms/outbox-claude/harness-ML-001/locale-parity.mjs .
  ```
- Mantener 0 ofensas en Theme Check, 0 claves sin resolver y 0 huérfanas en storefront.

---

## 3. Entregable

Reportar todo el trabajo en `agent-comms/outbox-claude/CLAUDE-REPORT-LOCALE-AUDIT-001.md`, detallando archivos tocados, líneas exactas, comandos ejecutados, evidencias de traducción en tienda real y lista de afirmaciones falsables numeradas. No realizar commit ni push sin previa revisión.
