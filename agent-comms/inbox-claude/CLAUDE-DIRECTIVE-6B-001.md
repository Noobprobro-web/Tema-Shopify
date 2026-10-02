# CLAUDE-DIRECTIVE-6B-001: Certificación Final de Storefront — Filtros Facetados, Accesibilidad, Medios y Zoom PDP (Filas 76, 35, 46, 47, 53, 72, 73)

```text
Ruta: agent-comms/inbox-claude/CLAUDE-DIRECTIVE-6B-001.md
Autoridad: Johandry / Ruiz Digital (Dueño) · Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Destinatario: Claude (Opus 5.5 Extra - Implementador Principal y Auditor Senior UX/UI)
Referencia directa: Orden de Johandry ("dale todo a claude")
Insumos: CLAUDE-REPORT-6A-001.md, CLAUDE-REPORT-CURRENCY-001.md, commits 11390d0, 820b595, 68a102d, 20c86e5
Estado: AUTORIZADO PARA EJECUCIÓN INMEDIATA
Fecha: 2026-09-24
```

---

## 1. Contexto y Objetivo Estratégico

1. **Sprint 6A 100% Cerrado y Certificado:**
   - Filas 63 (Checkout Acelerado), 78 (Búsqueda Predictiva), 79 (Moneda/País minimalista `USD$/EUR€`), 80 (Idioma EN/ES), 81 (Newsletter) y 82 (Iconos de Pago en Footer) están en **`cumplido`** en `docs/requirements-ledger.md`.
   - Las compuertas estáticas (`npm run gates:static`) pasan con **0 ofensas** (149 archivos inspeccionados), 0 claves faltantes y empaquetado exitoso de `Sartorial-1.0.0.zip`.
   - El ledger se ubica en **48 cumplido (84.2%)**.
2. **Meta de esta Directiva (Cierre Técnico Total):**
   - Certificar y promover a **`cumplido`** las últimas **7 filas técnicas** que actualmente se encuentran en `código completo`:
     - **Fila 76:** Filtros Facetados Nativos en Colección y Búsqueda (con barra de píldoras de filtros activos `url_to_remove`).
     - **Fila 35:** Punto Focal Nativo (`focal_point`).
     - **Fila 46:** Contraste de Texto >= 4.5:1 (WCAG 2.2 AA).
     - **Fila 47:** Contraste de Interfaz No-Texto >= 3:1 (WCAG 2.2 AA).
     - **Fila 53:** Live Regions (`aria-live`).
     - **Fila 72:** Medios Enriquecidos y Modelos 3D.
     - **Fila 73:** Zoom de Imagen Nativo y Accesible en PDP.
   - Con la culminación de esta directiva, el ledger alcanzará **55 cumplido (96.5%)**, restando únicamente las 2 dependencias comerciales externas de Johandry (Filas 107 y 108).
3. **Sartorial Intacto:** La identidad visual, tipografía editorial, paleta de colores y espaciados de Sartorial deben preservarse estrictamente sin alteraciones.

---

## 2. Tiendas y Entornos de Prueba

- **Tienda Principal (Couture):** `#165809488115` (`https://tema-qkqpke0j.myshopify.com`)
- **Preset Favorito (Sartorial):** `#166186909939` (`https://tema-qkqpke0j.myshopify.com?preview_theme_id=166186909939`)
- **Password Storefront:** `<redactado>`
- **Resoluciones obligatorias de auditoría:**
  - Desktop: 1280x800
  - Mobile: 375x812 y 360x780

---

## 3. Pistas de Implementación y Certificación (Tracks)

### Track 1: Fila 76 — Filtros Facetados Nativos en Colección y Búsqueda
- **Archivos de referencia:**
  - `sections/main-collection.liquid:10-241`
  - `sections/main-search.liquid:10-252`
  - `assets/theme.js:2804-2935` (`FacetFiltersForm`)
  - `assets/base.css:6030-6220`
- **Trabajo técnico requerido (Mejora de UX y Conformidad Shopify Theme Store):**
  1. **Barra de Píldoras de Filtros Activos (`active_filters` / `url_to_remove`):**
     - Tanto en `main-collection.liquid` como en `main-search.liquid`, agregar un contenedor de filtros activos (`.facets__active-filters`) que se renderice cuando `active_filter_count > 0`.
     - Para cada filtro activo (valores de lista/booleano/swatch), generar un chip accesible:
       `<a href="{{ filter_value.url_to_remove }}" class="facet__pill" data-facet-remove aria-label="{{ 'collections.filters.remove_filter' | t: filter: filter.label, value: filter_value.label }}">{{ filter_value.label }} <span aria-hidden="true">&times;</span></a>`
     - Para filtros de rango de precio con valores aplicados (`min_value.value != nil` o `max_value.value != nil`):
       `<a href="{{ filter.url_to_remove }}" class="facet__pill" data-facet-remove>{{ min_price }} - {{ max_price }} <span aria-hidden="true">&times;</span></a>`
     - Conservar o integrar el enlace "Clear all" (`collections.filters.clear_all`).
  2. **Intercepción AJAX en `FacetFiltersForm` (`assets/theme.js`):**
     - Añadir listener de clic para `[data-facet-remove]` y `[data-facet-clear-all]` que invoque `event.preventDefault(); this.renderUrl(link.href, true);`, manteniendo navegación fluida sin recarga y con fallback nativo en `no-js`.
  3. **Estilos de Píldoras en `assets/base.css`:**
     - Botones tipo píldora/chip minimalistas, altura mínima accesible (touch target >= 44x44px o padding accesible con foco visible), contraste adecuado y estilo editorial acorde a la marca.
  4. **Certificación en Tienda Real:**
     - Aplicar filtros en `/collections/all` y `/search?q=dress`:
       - Filtro por color (swatch visual).
       - Filtro por disponibilidad o tipo.
       - Filtro por rango de precio (verificar conversión de céntimos a divisa activa USD/EUR).
     - Verificar que la URL se actualiza (`history.pushState`), que el resultado se refresca vía AJAX, que el recuento se anuncia en `[data-facet-live-region]`, que las píldoras activas aparecen, y que al hacer clic en una píldora se elimina ese filtro específico.

---

### Track 2: Fila 35 — Punto Focal Nativo (`focal_point`)
- **Archivos de referencia:**
  - `sections/hero-editorial.liquid:47,58` (`--hero-focal-point: {{ hero_focal_point }}`)
  - `assets/base.css:2237` (`object-position: var(--hero-focal-point, center)`)
  - `snippets/product-card.liquid`
- **Requisitos a certificar en tienda viva:**
  1. Verificar que una imagen con punto focal asignado en el Admin (o por metafield/settings) inyecta la variable CSS `--hero-focal-point` con las coordenadas correctas (ej. `25% 40%`).
  2. Comprobar que en el navegador la regla `object-position` computa dicho valor en el elemento `<img>` y no causa distorsión ni recorte indebido en diferentes resoluciones (1280px y 375px).

---

### Track 3: Filas 46 y 47 — Contrastes WCAG 2.2 AA (Texto >= 4.5:1 y No-Texto >= 3:1)
- **Archivos de referencia:**
  - `assets/base.css` (tokens de color, `--color-control-border: 5224-5250`, `.button[aria-busy]: 5215`, `.complete-the-look: 3447`)
- **Requisitos a certificar en tienda viva:**
  1. **Contraste de Texto (Fila 46):**
     - Evaluar con axe-core o mediante cálculo computado (`getComputedStyle`) los ratios de contraste de los textos principales, subtítulos, precios, badges, botones primarios/secundarios y footer en temas Couture y Sartorial.
     - Garantizar ratio >= 4.5:1 para texto normal y >= 3:1 para texto grande (18pt / 24px o 14pt bold).
  2. **Contraste de Interfaz No-Texto (Fila 47):**
     - Verificar que los bordes de inputs (`--color-control-border`), bordes de chips de variantes, selectores de moneda/idioma, checkboxes y outlines de foco (`:focus-visible`) alcanzan un ratio de contraste >= 3:1 contra los fondos adyacentes en esquemas claros y oscuros.

---

### Track 4: Fila 53 — Regiones Vivas (`aria-live`)
- **Archivos de referencia:**
  - `sections/cart-drawer.liquid:17` (`id="CartDrawer-LiveRegion"`, `role="status"`, `aria-live="polite"`)
  - `sections/main-product.liquid:52` (`id="Product-LiveRegion-{{ section.id }}"`)
  - `snippets/pickup-availability.liquid:31`
  - `snippets/predictive-search.liquid:83`
  - `sections/main-collection.liquid:26` y `sections/main-search.liquid:37` (`[data-facet-live-region]`)
  - `assets/theme.js:2896-2902` (`announceResultCount()`) y `theme.js:2375-2387` (anuncios de carrito)
- **Requisitos a certificar en tienda viva:**
  1. Comprobar en el DOM real que al:
     - Cambiar una variante en PDP: el precio o estado se refleja en la región viva.
     - Añadir un producto al carrito: se inyecta el anuncio accesible de adición confirmada.
     - Filtrar una colección: `[data-facet-live-region]` recibe el texto de resultado (ej. "Showing 12 products").
     - Buscar en predictive search: el live region anuncia los resultados disponibles.

---

### Track 5: Fila 72 — Medios Enriquecidos y Modelos 3D
- **Archivos de referencia:**
  - `snippets/product-media.liquid:1-45`
  - `layout/theme.liquid:122` (`shopify-xr.js`)
  - `assets/base.css:5490-5510` (`.product-gallery__view-in-space`)
  - `assets/theme.js:81-94,459-461,498` (`pauseAllMedia`)
- **Requisitos a certificar en tienda viva:**
  1. Verificar que `snippets/product-media.liquid` maneja adecuadamente los tipos `video`, `external_video` (YouTube/Vimeo) y `model` (3D/AR).
  2. Confirmar que el script `shopify-xr.js` se carga únicamente cuando el producto contiene medios 3D o en PDP.
  3. Comprobar que al cambiar de slide en la galería de producto, cualquier video en reproducción se pausa automáticamente (`pauseAllMedia`), evitando audio superpuesto.

---

### Track 6: Fila 73 — Zoom de Imagen Nativo y Accesible en PDP
- **Archivos de referencia:**
  - Web Component `<product-zoom>`: `assets/product-zoom.js:1-290`
  - Modal accesible: `snippets/product-zoom.liquid:1-116`
  - Integración en ficha: `sections/main-product.liquid:44-55,76-100,169-171`
  - Estilos: `assets/base.css:7774-7960`
- **Requisitos a certificar en tienda viva:**
  1. **Disparo y apertura modal:** Pulsar el botón de zoom en PDP. Comprobar apertura del diálogo accesible, captura de foco dentro del modal e `inert` en hermanos.
  2. **Navegación e interacción:** Comprobar desplazamiento de imagen/pan con ratón y soporte de gestos táctiles (touch) en viewport móvil (375px).
  3. **Cierre y Restauración de Foco (Hotfix F01):** Cerrar el zoom mediante botón de cierre o tecla `Escape`. Comprobar que el foco retorna de forma exacta e inequívoca al botón disparador original.

---

## 4. Reglas de Ejecución y Entregables (DoD)

1. **Eficiencia y Disciplina:**
   - Si se requiere ajustar código para las píldoras de filtros (Track 1) o alguna sutileza de CSS/Liquid, mantener los cambios pequeños, limpios y estrictamente alineados con los patrones existentes.
   - Ejecutar `npm run gates:static` antes de entregar para garantizar 0 ofensas en Theme Check y 0 claves de localización rotas.
2. **Evidencias Empíricas con Mediciones Reales:**
   - Proporcionar selectores DOM, mediciones numéricas, respuestas AJAX y comprobaciones de contraste concretas.
3. **Informe de Entrega:**
   - Ubicación: `agent-comms/outbox-claude/CLAUDE-REPORT-6B-001.md`.
   - Incluir la cabecera estándar de 9 líneas de `RULES.md §1.4`.
   - Dictamen explícito sobre cada una de las 7 filas evaluadas (Filas 76, 35, 46, 47, 53, 72, 73): ¿Apta para pasar a `cumplido`?
