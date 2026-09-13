# Directiva de Implementación: GPT-4B-001 (Presets /listings/, 15 Esquemas de Color y Featured Product)

```text
ID: GPT-4B-001
Emisor: Gemini Flash 3.8 High (Cerebro y Arquitecto)
Destinatario: GPT-5.6 Sol Max / Codex (Implementador Técnico)
Autoridad del Proyecto: Johandry / Ruiz Digital (Aprobación Total)
Base de código: commit c2e1153 en master (Theme Check 62 archivos, 0 ofensas, tienda remota activa)
Entrega esperada: código implementado + validaciones estáticas + reporte en agent-comms/outbox-gpt/
NO hacer commit ni push hasta la auditoría de Gemini.
```

---

## 1. Objetivo del Sprint

1. Implementar los **15 esquemas de color** en `config/settings_data.json` validados bajo WCAG 2.2 AA (5 por preset para Couture, Studio y Archive).
2. Crear la sección oficial obligatoria de Shopify Theme Store: **`sections/featured-product.liquid`** con soporte de bloques `@app` y bloques de producto estándar (Requisito mandatorio de Theme Store, spec 212).
3. Añadir coordenadas móviles independientes para los hotspots de **`sections/lookbook.liquid`**.
4. Crear la estructura oficial de presets en **`/listings/`** con las plantillas diferenciadas (`index.json`, `collection.json` y `product.json`) para Couture, Studio y Archive según la especificación editorial de Claude (`CLAUDE-PRESETS-001`).
5. Actualizar locales correspondientes en `locales/en.default.json` y `locales/en.default.schema.json`.

---

## 2. Especificación Técnica Detallada

### Tarea 1: 15 Esquemas de Color en `config/settings_data.json`

Poblar los objetos de esquemas cromáticos en `current` y en cada uno de los 3 presets de `config/settings_data.json`.
Todos los valores hex han sido verificados contra WCAG 2.2 AA (ratios >= 4.5:1 texto, >= 3:1 bordes).

#### A. Couture (Preset 1 & Current)
```json
"color_schemes": {
  "scheme-1": {
    "settings": {
      "background": "#F7F3EA",
      "background_gradient": "",
      "text": "#1D1B18",
      "button": "#1D1B18",
      "button_label": "#FFFFFF",
      "secondary_button_label": "#1D1B18",
      "border": "#8F8574",
      "shadow": "#1D1B18"
    }
  },
  "scheme-2": {
    "settings": {
      "background": "#1D1B18",
      "background_gradient": "",
      "text": "#F8F4EB",
      "button": "#D8A85D",
      "button_label": "#1D1B18",
      "secondary_button_label": "#F8F4EB",
      "border": "#7A7061",
      "shadow": "#000000"
    }
  },
  "scheme-3": {
    "settings": {
      "background": "#EDE7DA",
      "background_gradient": "",
      "text": "#1D1B18",
      "button": "#1D1B18",
      "button_label": "#FFFFFF",
      "secondary_button_label": "#1D1B18",
      "border": "#8A8070",
      "shadow": "#1D1B18"
    }
  },
  "scheme-4": {
    "settings": {
      "background": "#D8A85D",
      "background_gradient": "",
      "text": "#1D1B18",
      "button": "#1D1B18",
      "button_label": "#F7F3EA",
      "secondary_button_label": "#1D1B18",
      "border": "#6E5325",
      "shadow": "#1D1B18"
    }
  },
  "scheme-5": {
    "settings": {
      "background": "#FBF9F4",
      "background_gradient": "",
      "text": "#2A2621",
      "button": "#1D1B18",
      "button_label": "#FFFFFF",
      "secondary_button_label": "#2A2621",
      "border": "#9A8F7C",
      "shadow": "#1D1B18"
    }
  }
}
```

#### B. Studio (Preset 2)
Configuración de preset:
- `type_heading_font`: `"assistant_n4"`
- `heading_scale`: 100
- `type_body_font`: `"assistant_n4"`
- `body_scale`: 100
- `section_spacing`: 56
- `page_width`: 1300
- `button_radius`: 0
- `color_schemes`:
  - `scheme-1` (Página): bg `#FFFFFF`, text `#111111`, button `#111111`, button_label `#FFFFFF`, secondary `#111111`, border `#949494`, shadow `#111111`
  - `scheme-2` (Inverso negativo): bg `#111111`, text `#FAFAFA`, button `#FAFAFA`, button_label `#111111`, secondary `#FAFAFA`, border `#666666`, shadow `#000000`
  - `scheme-3` (Superficie fría): bg `#F2F2F2`, text `#111111`, button `#111111`, button_label `#FFFFFF`, secondary `#111111`, border `#8C8C8C`, shadow `#111111`
  - `scheme-4` (Acento pizarra): bg `#2E3440`, text `#F0F2F5`, button `#F0F2F5`, button_label `#2E3440`, secondary `#F0F2F5`, border `#79808C`, shadow `#000000`
  - `scheme-5` (Suave): bg `#FAFAFA`, text `#1A1A1A`, button `#111111`, button_label `#FFFFFF`, secondary `#1A1A1A`, border `#919191`, shadow `#111111`

#### C. Archive (Preset 3)
Configuración de preset:
- `type_heading_font`: `"libre_baskerville_n4"`
- `heading_scale`: 110
- `type_body_font`: `"assistant_n4"`
- `body_scale`: 100
- `section_spacing`: 72
- `page_width`: 1300
- `button_radius`: 0
- `color_schemes`:
  - `scheme-1` (Página arcilla): bg `#EFE6D9`, text `#2E241C`, button `#8A5A3B`, button_label `#FFF8F0`, secondary `#2E241C`, border `#8A7860`, shadow `#2E241C`
  - `scheme-2` (Inverso oliva): bg `#2F3327`, text `#EFE6D9`, button `#B5885C`, button_label `#241F19`, secondary `#EFE6D9`, border `#838972`, shadow `#1A1D16`
  - `scheme-3` (Superficie kraft): bg `#E4D8C6`, text `#2E241C`, button `#8A5A3B`, button_label `#FFF8F0`, secondary `#2E241C`, border `#7E6A54`, shadow `#2E241C`
  - `scheme-4` (Acento óxido): bg `#8A5A3B`, text `#FFF8F0`, button `#FFF8F0`, button_label `#8A5A3B`, secondary `#FFF8F0`, border `#D8BFA6`, shadow `#2E241C`
  - `scheme-5` (Suave lino): bg `#F5EFE5`, text `#2E241C`, button `#8A5A3B`, button_label `#FFF8F0`, secondary `#2E241C`, border `#8D7C64`, shadow `#2E241C`

---

### Tarea 2: Sección Obligatoria `sections/featured-product.liquid`

Crear `sections/featured-product.liquid` cumpliendo con la directiva oficial de Shopify ([requirements line 212](https://shopify.dev/docs/storefronts/themes/store/requirements#block-and-app-block-support-requirements)):
> *"Themes must support app blocks (blocks of type `@app`) in the main product section and featured product section."*

**Requisitos de la sección:**
1. **Setting de producto:** `type: "product"`, `id: "product"`.
2. **Settings de diseño:** `color_scheme`, `color_scheme_group` o `color_scheme: "scheme-1"`, `secondary_background: false`, `padding_top`, `padding_bottom`.
3. **Manejo de estado vacío:** Si `section.settings.product == blank`, renderizar placeholder o estado de onboarding elegante con título demo ("Featured luxury product"), precio simulado y placeholder SVG nativo (`'product-1' | placeholder_svg_tag`).
4. **Bloques soportados:**
   - `@app` (obligatorio para apps)
   - `custom_liquid`
   - `title`
   - `price` (reutilizando snippet `price.liquid`)
   - `variant_picker` (soportando variantes y swatches)
   - `quantity_selector`
   - `buy_buttons` (con `form 'product'` estándar, botón Add to Cart y botones dinámicos acelerados)
   - `description`
5. **Schema:** 100% localizado con claves `t:`.
6. **Presets de schema:** Definir un preset por defecto en `{% schema %}` con los bloques básicos (`title`, `price`, `variant_picker`, `buy_buttons`).

---

### Tarea 3: Coordenadas Móviles en `sections/lookbook.liquid`

En `sections/lookbook.liquid`:
1. Agregar en el schema del bloque `hotspot`:
   - `horizontal_position_mobile`: `type: "range"`, `id: "horizontal_position_mobile"`, `min: 0`, `max: 100`, `step: 1`, `unit: "%"`, `default: 0`, `label: "t:sections.lookbook.blocks.hotspot.settings.horizontal_position_mobile.label"`, `info: "t:sections.lookbook.blocks.hotspot.settings.horizontal_position_mobile.info"` (explicando que 0 hereda la coordenada de escritorio).
   - `vertical_position_mobile`: `type: "range"`, `id: "vertical_position_mobile"`, `min: 0`, `max: 100`, `step: 1`, `unit: "%"`, `default: 0`, `label: "t:sections.lookbook.blocks.hotspot.settings.vertical_position_mobile.label"`, `info: "t:sections.lookbook.blocks.hotspot.settings.vertical_position_mobile.info"`.
2. En el Liquid del bloque:
   - Calcular:
     ```liquid
     {%- assign hp_mobile = block.settings.horizontal_position_mobile -%}
     {%- if hp_mobile == 0 -%}{%- assign hp_mobile = block.settings.horizontal_position -%}{%- endif -%}
     {%- assign vp_mobile = block.settings.vertical_position_mobile -%}
     {%- if vp_mobile == 0 -%}{%- assign vp_mobile = block.settings.vertical_position -%}{%- endif -%}
     ```
   - Exponer en el inline style del hotspot:
     `--hotspot-x-mobile: {{ hp_mobile }}%; --hotspot-y-mobile: {{ vp_mobile }}%;`
3. En CSS (`assets/base.css` o dentro de la sección):
   ```css
   @media (max-width: 47.99rem) {
     .lookbook__hotspot {
       left: var(--hotspot-x-mobile, var(--hotspot-x));
       top: var(--hotspot-y-mobile, var(--hotspot-y));
     }
   }
   ```

---

### Tarea 4: Plantillas Diferenciadas en `/listings/`

Crear la carpeta `/listings/` en la raíz del tema con tres subcarpetas:
```text
listings/
├── couture/
│   └── templates/
│       ├── index.json
│       ├── collection.json
│       └── product.json
├── studio/
│   └── templates/
│       ├── index.json
│       ├── collection.json
│       └── product.json
└── archive/
    └── templates/
        ├── index.json
        ├── collection.json
        └── product.json
```

#### A. `listings/couture/templates/index.json` (8 secciones de cuerpo)
Secuencia editorial:
1. `hero-editorial` (cinematic, video, overlay gradient_bottom 40%, content bottom-left, color_scheme: scheme-2)
2. `marquee` (4 bloques de procedencia, speed: 38, color_scheme: scheme-2)
3. `lookbook` (4 marcadores, color_scheme: scheme-1)
4. `curated-showcase` (3 tabs, show_secondary_image: true, color_scheme: scheme-1)
5. `brand-manifesto` (4 bloques, use_surface_background: true, color_scheme: scheme-3)
6. `complete-the-look` (3 productos, color_scheme: scheme-1)
7. `bento-discovery` (3 tarjetas: colección, historia, producto, color_scheme: scheme-1)
8. `newsletter` (color_scheme: scheme-3)

`collection.json`: `default_grid_columns: 2`, promotion tile activado en pos 4.
`product.json`: `media_layout: grid`, bloque `size_guide` y bloque `@app` presentes.

#### B. `listings/studio/templates/index.json` (6 secciones de cuerpo)
Secuencia minimalista/técnica:
1. `hero-editorial` (split 50_50, image_first, color_scheme: scheme-1)
2. `curated-showcase` (3 tabs, show_secondary_image: false, color_scheme: scheme-1)
3. `bento-discovery` (4 tarjetas: colección, 2 de producto, 1 de historia, color_scheme: scheme-3)
4. `complete-the-look` (3 objetos de estudio, color_scheme: scheme-1)
5. `brand-manifesto` (2 bloques, use_surface_background: false, media_label vacío, color_scheme: scheme-4)
6. `newsletter` (color_scheme: scheme-3)
*Omitir `lookbook` y `marquee`.*

`collection.json`: `default_grid_columns: 4`, sin promotion tile.
`product.json`: `media_layout: grid`, bloque `@app` presente, sin `size_guide`.

#### C. `listings/archive/templates/index.json` (7 secciones de cuerpo)
Secuencia patrimonial/archivo:
1. `hero-editorial` (cinematic, imagen fija, overlay scrim 55%, content center-center, color_scheme: scheme-2)
2. `brand-manifesto` (4 bloques, use_surface_background: true, media_label con numeral romano/índice, color_scheme: scheme-3)
3. `marquee` (3 bloques con año de fundación, speed: 46, color_scheme: scheme-4)
4. `curated-showcase` (2 tabs, show_vendor: true, color_scheme: scheme-1)
5. `lookbook` (3 marcadores de archivo, color_scheme: scheme-5)
6. `bento-discovery` (3 tarjetas: 2 de historia, 1 de colección, color_scheme: scheme-1)
7. `newsletter` (color_scheme: scheme-3)
*Omitir `complete-the-look`.*

`collection.json`: `default_grid_columns: 2`, promotion tile en pos 3, `show_vendor: true`.
`product.json`: `media_layout: thumbnails`, bloque `@app` presente, sin `size_guide`.

---

## 3. Criterios de Aceptación y Definition of Done (DoD)

1. **Theme Check:** `cmd.exe /c "npx shopify theme check"` debe reportar **0 ofensas** sobre todos los archivos del tema.
2. **Sintaxis JS:** `node --check assets/theme.js` debe terminar con código 0.
3. **Parseo JSON:** Todos los archivos JSON en `config/` y `listings/` deben ser JSON válido (`JSON.parse` estricto).
4. **Packaging:** `cmd.exe /c "shopify theme package"` debe empacar exitosamente incluyendo la carpeta `listings/`.
5. **Superficie del comerciante:** 100% de settings y labels deben usar claves `t:` en sentence case.

---

## 4. Reporte de Entrega
Al terminar, documentar en `agent-comms/outbox-gpt/GPT-4B-001-presets-and-features.md`:
- Lista de archivos modificados y creados.
- Resultados de los comandos de validación ejecutados.
- Confirmación de las 5 compuertas del DoD.
- No hacer `git commit` ni `git push`.
