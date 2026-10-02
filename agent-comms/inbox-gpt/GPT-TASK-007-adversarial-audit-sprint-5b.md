# GPT-TASK-007: Auditoría Adversarial Senior de Producto, UX y Lujo - Sprint 5B en Tienda Real

```text
ID: GPT-TASK-007-adversarial-audit-sprint-5b
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: GPT-6 Sol Max (Auditor Senior de Producto y Comercio)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-22
Estado: SOLICITUD DE AUDITORÍA ADVERSARIAL EN TIENDA REAL (Sprint 5B)
URL de Evaluación (PDP): https://tema-qkqpke0j.myshopify.com/products/qa5a-f04-colour-size
URL de Evaluación (PDP Serra Coat): https://tema-qkqpke0j.myshopify.com/products/serra-coat
URL en Español: https://tema-qkqpke0j.myshopify.com/es/products/qa5a-f04-colour-size
Contraseña de acceso: <redactado>
Tema evaluado: Couture (#165809488115 - MAIN LIVE)
Commit desplegado: a946c3b ("feat(pdp): complete Sprint 5B native accessible zoom and media optimizations")
```

---

## 1. Contexto Ejecutivo

Claude (Opus 5.5 Extra) ha implementado el **Sprint 5B: Luxury PDP Media & Native Accessible Zoom** conforme a `CLAUDE-DIRECTIVE-5B-001`. Gemini Flash 3.8 High ha completado la auditoría arquitectónica, validado las compuertas estáticas (0 ofensas en Theme Check, 394 claves con paridad total EN/ES, sintaxis limpia y empaquetado exitoso) y desplegado la versión a la tienda real en vivo (`GEMINI-review-CLAUDE-5B-001`).

Como **Auditor Senior de Producto, Comercio, UX y Viabilidad para Shopify Theme Store ($380 tier)**, se requiere tu evaluación adversarial exhaustiva en navegador real para certificar si la experiencia cumple con las expectativas de una boutique de alta gama y las directrices oficiales de Shopify.

---

## 2. Alcance y Criterios a Evaluar

Evalúa la tienda real en escritorio (1280×800 px) y móvil (390×844 px y 360 px), en inglés y en español:

### A. Experiencia de Zoom y Visor de Medios PDP (`<product-zoom>`)
1. **Apertura y Cero Penalización de Rendimiento (LCP):**
   - Verificar que antes de abrir el zoom NO se descargan imágenes de resolución superior a la requerida por la galería regular (`data-srcset` inerte con marcador transparente).
   - Clic o toque en el disparador accesible `[data-zoom-open]` (o en la imagen de la galería) abre el `<dialog>` nativo en pantalla completa con la foto seleccionada (`showModal()`).
   - Carga inmediata de la imagen activa con `fetchpriority="high"` y precarga perezosa de sus diapositivas vecinas.
2. **Interacción en Escritorio (1280 px):**
   - Alternancia entre escala 1x y escala ampliada mediante clic sobre la fotografía.
   - Modo de exploración de tejido: al hacer zoom, comprobar si la imagen acompaña suavemente la posición del cursor ("follow cursor") sin tirones (jank) ni pérdidas de referencia.
   - Clic fuera de la fotografía o en el botón de cerrar restaura la vista y cierra el diálogo.
   - Atajo `Escape` cierra el diálogo y devuelve el foco al botón exacto que originó la apertura (`[data-zoom-open]`).
3. **Interacción Táctil y Gestual en Móvil (390 px / 360 px):**
   - **Doble toque (Double-tap):** Alterna instantáneamente entre escala 1x y escala máxima enfocada en las coordenadas del toque.
   - **Pellizco con dos dedos (Pinch-to-zoom):** Escala natural anclada en el punto medio exacto de los dedos, sin derivas ni saltos bruscos.
   - **Arrastre con un dedo (Pan):** Al estar ampliado, permite desplazar la imagen para inspeccionar los bordes y costuras.
   - **Navegación horizontal a 1x:** Deslizar con un dedo navega limpiamente a la diapositiva anterior/siguiente mediante scroll-snap nativo.
   - **Botón "Reset zoom":** Visible cuando la escala supera 1.0x; permite volver a 1x en un solo toque.
   - Toque fuera de la imagen a 1x cierra el diálogo.
4. **Respeto a la Resolución Natural (Anti-Pixelación):**
   - Comprobar que imágenes con resolución de 928 px o 600 px NO se amplíen artificialmente más allá de su tamaño real (`min(3, naturalWidth / renderedWidth)`), deshabilitando el botón de acercar cuando se alcanza el tope.
5. **Navegación por Teclado y Accesibilidad (WCAG 2.2 AA):**
   - Atrapamiento de foco estricto (`trapFocus`): el tabulador no se escapa al fondo de la página.
   - Teclas funcionales: `+` (acercar), `-` (alejar), `0` (restablecer a 1x), flechas de dirección (desplazan la imagen si está ampliada; cambian de diapositiva si está a 1x), Home (primera imagen), End (última imagen).
   - Anuncio atómico en lector de pantalla (`aria-live="polite"`): `"Image X of Y, zoom Z%"` / `"Imagen X de Y, zoom Z %"`.
   - Dimensiones de botones interactivos: todos >= 44×44 px en móvil y escritorio.
   - Auditoría axe-core: 0 violaciones en el visor abierto.
   - Respeto a `prefers-reduced-motion`: transiciones instantáneas sin mareos.

### B. Optimizaciones de Galería PDP
1. **H-07 (Sizes en Rejilla):**
   - En escritorio (>= 62rem), cuando la galería está en modo rejilla de 2 columnas (`grid`), las imágenes deben solicitar `sizes="(min-width: 62rem) 30vw, 100vw"` (excepto la primera foto si el total es impar, que ocupa 60vw).
2. **H-13 (Pausa Automática de Video):**
   - Si un producto contiene video HTML5 o iframe de YouTube/Vimeo en la galería, verificar que al deslizar el carrusel o cambiar de diapositiva el video se pause automáticamente y no siga reproduciendo audio de fondo.
3. **H-19 (Texto Alternativo Secuencial):**
   - En productos cuyas fotos carecen de alt manual en Shopify Admin, verificar que se anuncie `"Título – Image n of N"` / `"Título – Imagen n de N"`. Con 1 sola foto, solo el título.

### C. Configuración del Merchant y Estados Degenerados
1. Probar la sección con `enable_media_zoom` desactivado en schema: verificar que NO se inyecten disparadores, ni `<product-zoom>`, ni se cargue `assets/product-zoom.js`.
2. Verificar que en la página de colección y en la Home el script `product-zoom.js` tenga **0 descargas**.
3. Producto de 1 sola foto: controles de diapositiva anterior/siguiente deshabilitados o ausentes, zoom funcional.
4. Producto hostile (títulos largos, precios con descuento): ningún desbordamiento en la barra de control del zoom.

---

## 3. Entregable Esperado

Genera tu informe de auditoría en:
`agent-comms/outbox-gpt/GPT-AUDIT-007-sprint-5b.md`

El informe debe incluir:
1. **Dictamen Ejecutivo:** Aprobado / Rechazado / Aprobado con Observaciones para cerrar Sprint 5B.
2. **Matriz de Criterios (Evaluación uno a uno):** Tabla detallada con estado (Pasa / Falla), viewport probado, evidencia y notas.
3. **Hallazgos Críticos (P0/P1) y UX (P2/P3):** Con archivo, línea y propuesta de solución si existieran defectos.
4. **Análisis Comercial de Lujo:** ¿Se siente la experiencia a la altura de un tema de $380 USD en la Theme Store? ¿Qué sensaciones transmite la inspección de fotos?
5. **Recomendación para Johandry:** Visto bueno para avanzar a la siguiente fase o directrices de ajuste.
