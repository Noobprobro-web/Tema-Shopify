# C-01 · Baseline y regresión de colección

Script de lectura: `capture.mjs`. SHA-256: `ce2dab82057f939d5f49d9b386fc4ff244336f829808276ff29cf7bc52f9d1eb`.

Cada par usa el mismo tema y preset, colección, catálogo, locale, DPR 1, viewport y tratamiento de la barra Shopify. Anotar el SHA del tema antes/después. Mantener `scrollY = 0`. Cargar desde una pestaña nueva y esperar al evento de carga. Desde Playwright, importar el módulo y ejecutar `page.evaluate(capture, { preset, stage, themeId, width, height, dpr: 1, previewBar: 'hidden' })` con `capture` como exportación por defecto y `stage` igual a `before` o `after`. Confirmar visualmente que la barra está oculta. Si se mantiene visible, usar `previewBar: 'measure'` en ambos estados. El script rechaza una barra detectable en modo oculto o una barra no detectable en modo medición.

Guardar salida JSON, captura del primer viewport y los resultados manuales de cada celda. El script identifica la primera tarjeta real por su ID de producto y falla si solo hay promociones o no hay tarjetas. LCP/CLS son observaciones al momento de la captura y pueden quedar nulos si la API o el elemento no están disponibles. No usar una navegación con entrada del usuario como baseline de LCP. Registrar si la barra se superpone en vez de consumir altura, y aplicar el mismo criterio en cada par.

| Preset | Viewport | Antes | Después |
|---|---|---|---|
| Sartorial | 390×844 | Pendiente | Pendiente |
| Sartorial | 1280×800 | Pendiente | Pendiente |
| Imprint | 390×844 | Pendiente | Pendiente |
| Imprint | 1280×800 | Pendiente | Pendiente |
| Archive | 390×844 | Pendiente | Pendiente |
| Archive | 1280×800 | Pendiente | Pendiente |

- Móvil: la primera tarjeta sube o permanece a la misma altura con justificación. Todos los filtros y el orden siguen visibles y operables. Confirmar la lectura y el foco en orden DOM.
- Escritorio: verificar el mismo layout y la barra lateral sticky. Comparar las capturas y el estilo computado.
- En ambos: aplicar y limpiar filtros, probar orden y estado sin resultados con datos existentes, y verificar foco y estado de los filtros activos tras el render AJAX. Probar también el botón nativo sin JS. Escape y devolución de foco se añaden a la matriz si cambia el contrato de un disclosure. Cualquier estado sin datos queda pendiente.
- Repetir con banner presente y sin banner cuando los datos existentes lo permitan. Registrar los elementos LCP y el CLS antes y después. No derivar conversión de estas mediciones.
