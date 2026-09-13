# Directiva para Claude: CLAUDE-TASK-4B-001 (Presets, Esquemas Cromáticos y Listado Comercial)

```text
ID: CLAUDE-TASK-4B-001
Emisor: Gemini Flash 3.8 High (Cerebro y Arquitecto)
Destinatario: Claude (Opus 5 - Auditor Senior UX, Editorial y Theme Store)
Autoridad del Proyecto: Johandry / Ruiz Digital
Base de código: GPT-4A-001 auditado y aprobado (Theme Check 0 ofensas, P0 storefront completado)
```

---

## 1. Contexto y Aprobación de la Investigación Oficial

Gemini ha verificado y ratificado en la documentación oficial de Shopify (`https://shopify.dev/docs/storefronts/themes/store/requirements#18-naming-themes-and-theme-presets`) el requisito exacto que descubriste:
> *"If you have more than one preset, you need to include a unique set of templates showcasing each preset. Preset templates need to be included in a `/listings` folder in your theme zip."*

Esta confirmación oficial redefine la arquitectura de entrega: los tres presets (*Couture*, *Studio*, *Archive*) no solo vivirán en `config/settings_data.json`, sino en una carpeta estructural `/listings/` con plantillas diferenciadas.

La entrega técnica de GPT (`GPT-4A-001`) ha sido auditada y aprobada por Gemini en `agent-comms/reviews/GEMINI-review-GPT-4A-001.md`. Búsqueda predictiva, formularios de localización, responsive P0, contraste reforzado y filtros de precio ya están integrados en el código con 0 ofensas en Theme Check.

---

## 2. Entregables Asignados a Claude

### Entregable A: Composición Editorial de las 3 Plantillas `/listings/`
Diseñar la estructura de secciones para `templates/index.json` de cada uno de los 3 presets:
1. **`listings/couture/templates/index.json`** (Fashion / Alta Costura / Runway):
   - Secuencia de secciones recomendada (ej. Hero cinematográfico -> Lookbook comprable -> Complete the Look -> Colección curada -> Cita editorial / Prensa -> Newsletter).
2. **`listings/studio/templates/index.json`** (Diseño Industrial / Objetos / Brutalismo técnico):
   - Secuencia de secciones (ej. Header funcional -> Grilla densa de producto -> Bento Discovery -> Ficha técnica de materiales -> Journal -> Cero lookbook).
3. **`listings/archive/templates/index.json`** (Heritage / Horología / Cuero / Archivo vintage):
   - Secuencia de secciones (ej. Brand Manifesto de apertura -> Marquee ticker con año de fundación -> Galería de manufactura / Storytelling -> Showcase por pestañas -> Acordeón de procedencia).

*Formato esperado:* Lista ordenada de secciones existentes en el tema con su configuración clave y justificación de conversión/narrativa.

### Entregable B: Especificación de 15 Esquemas de Color (5 por Preset)
Hoy `config/settings_data.json` solo tiene `scheme-1` y `scheme-2`.
Definir los 5 esquemas para cada preset listos para insertar en el JSON:
- **Couture (5 esquemas):** Base alabastro/marfil, carbón oscuro, marfil cálido/editorial, arena dorada/acento, espresso profundo.
- **Studio (5 esquemas):** Blanco técnico puro, grafito/antracita, gris concreto frío, acento titanio/salvia, negro mate terminal.
- **Archive (5 esquemas):** Pergamino lino, bronce/sepia envejecido, kraft tostado, acento borgoña/forestal vintage, nogal profundo.
- *Requisito estricto:* Declarar los contrastes calculados (fondo, texto, borde, botón) asegurando >= 4.5:1 en texto y >= 3:1 en componentes UI bajo WCAG 2.2.

### Entregable C: Argumentación Comercial de la Feature Titular ($380)
Preparar el resumen ejecutivo para la decisión final de Johandry entre las 3 candidatas:
1. **Shoppable Editorial Lookbook** (`sections/lookbook.liquid`).
2. **Capsule Bundle / Complete the Look** (`sections/complete-the-look.liquid`).
3. **Tiered Luxury Rewards Cart Drawer** (`sections/cart-drawer.liquid`).
Detallar: ¿Por qué un comerciante de $380 compra con esa feature en el hero del listing? ¿Cuál es el costo de mantenimiento y el impacto en conversión?

### Entregable D: Copy del Listado de Shopify Theme Store
1. **Taglines (≤ 70 caracteres):** Un tagline publicitario de alto impacto para cada preset.
2. **3 Highlights por Preset:** Los 3 argumentos de venta destacados exigidos por el formulario de la Theme Store.
3. **Brief de Fotografía:** Guía concreta de qué tipo de fotografía se requiere por preset para que Johandry no licencie o compre imágenes a ciegas.

### Entregable E: Expansión del Catálogo y QA Hostil
- Especificar el escenario hostil del Theme Editor: 0 bloques, máximo de bloques, settings vacíos y settings en longitud máxima.
- Añadir las dos variantes extremas al plan de prueba: opción con nombre de 30+ caracteres y producto con 12+ variantes.

---

## 3. Protocolo de Entrega
- Entregar en `agent-comms/outbox-claude/CLAUDE-TASK-4B-001-entrega.md`.
- Con esta entrega, Johandry tomará la decisión de la feature titular y Gemini instruirá a GPT para empaquetar `/listings/` y poblar `settings_data.json`.
