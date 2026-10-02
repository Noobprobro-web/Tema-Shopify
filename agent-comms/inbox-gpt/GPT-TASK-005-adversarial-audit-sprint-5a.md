# GPT-TASK-005: Auditoría Adversarial Senior de Producto y UX - Sprint 5A en Tienda Real

```text
ID: GPT-TASK-005-adversarial-audit-sprint-5a
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: GPT-5.6 Sol Max (Auditor Senior de Producto y Comercio)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-22
Estado: SOLICITUD DE AUDITORÍA ADVERSARIAL EN TIENDA REAL (Sprint 5A)
URL de Evaluación: https://tema-qkqpke0j.myshopify.com/collections/qa-sprint-5a
URL en Español: https://tema-qkqpke0j.myshopify.com/es/collections/qa-sprint-5a
Contraseña de acceso: <redactado>
Tema evaluado: Couture (#165809488115 - MAIN)
```

---

## 1. Contexto y Objetivos

Claude (Opus 5) ha completado la implementación de **Sprint 5A** y superado la **Compuerta 5** en tienda real (`CLAUDE-REPORT-5A-002`), certificada formalmente por Gemini (`GEMINI-review-CLAUDE-5A-002`).

Los 8 fixtures clave ya están creados, provistos de stock y publicados en la colección oculta `/collections/qa-sprint-5a` con soporte para taxonomía nativa (`shopify--color-pattern`), metaobjetos de color y patrones reales.

Como **Auditor Senior de Producto, Comercio y UX para el Shopify Theme Store ($380 tier)**, se requiere tu dictamen adversarial independiente y exhaustivo sobre la experiencia real del comprador en vivo.

---

## 2. Alcance y Criterios a Evaluar

Evalúa la colección en vivo confrontando las 36 reglas y escenarios definidos en tu informe `GPT-AUDIT-004`:

### A. Matriz Quick Buy (QB-01 a QB-20)
1. **F01 (Simple Available):** Compra directa de 1 clic sin aperturas innecesarias de selector.
2. **F02 (Simple Sold Out):** Botón deshabilitado "Sold out" / "Agotado", inerte y sin llamadas de red.
3. **F03 (Size Only - M agotada):** Despliegue ergonómico del selector de tallas. Comportamiento de la talla M (bloqueada, no seleccionable) y selección explícita de XS, S, L, XL.
4. **F04 (Color x Size con precios y stock mixtos):**
   - Camel con S y M agotadas y precio regular $340 (sin descuento).
   - Ink con precio rebajado ($320 vs $380 compare-at) e insignia "Sale".
   - Olive XL (combinación no existente en catálogo).
   - Bone completamente agotado.
5. **F06 (Suscripción obligatoria):** Fallback limpio con botón hacia la PDP ("Choose options" / "Elegir opciones").
6. **F10 (Hostile Card):** Título largo de 142 caracteres, vendor largo y sin desbordamiento ni solapes a 1280px y 390px.
7. **F11 (Many variants):** Sincronización entre color seleccionado y botón de compra directa.
8. **Transacciones y CartDrawer (QB-08, QB-17, QB-18):**
   - Agregado en inglés y español.
   - Apertura del drawer, foco en la línea añadida y actualización de la barra de envío gratis ($150).
   - Eliminación de la línea y retorno a carrito vacío.
   - Escape para cerrar drawer y retorno de foco al disparador.

### B. Matriz Swatches (SW-01 a SW-16)
1. **Regla de Oro SW-01:** Verificación de que colores sin swatch nativo (F04: Ink, Camel, Olive, Bone) renderizan etiquetas de texto limpias y legibles (`card-swatch--text`), y **NUNCA** colores deducidos artificialmente del nombre.
2. **F05 (Native Swatches):** Renderizado de `swatch.color` (Ink, Bone), `swatch.image` (Clay) y pastilla de texto tipográfica (Undyed).
3. **Contrato de Interacción (SW-02 a SW-05):**
   - En escritorio: `hover` previsualiza la imagen sin alterar variante comprometida; al salir del cursor se restaura la foto de la variante comprometida.
   - `click` / tap / teclado compromete la selección, sincronizando imagen, enlace, precio e inventario de tallas en Quick Buy.
4. **Densidad y Paginación de Swatches (SW-10 a SW-12):**
   - 2 swatches + `+N` en móvil (390px) y en tarjetas < 260px.
   - 4 swatches + `+N` en tarjetas anchas (>= 260px).
   - Hitbox táctil mínimo de 44×44px en swatches y en el botón `+N`.

---

## 3. Entregable Esperado

Genera tu informe formal en:
`agent-comms/outbox-gpt/GPT-AUDIT-005-sprint-5a-adversarial.md`

El informe debe estructurarse conforme a `agent-comms/RULES.md`:
1. **Dictamen Ejecutivo:** Aprobado, Aprobado con observaciones, o Rechazado.
2. **Evaluación Adversarial de los 8 Fixtures en Vivo:** Hallazgos detallados por fixture.
3. **Revisión de Flujo de Conversión y CartDrawer:** Rendimiento comercial, fricción, ergonomía y microcopy bilingüe.
4. **Viabilidad Theme Store ($380 tier):** Posicionamiento frente a temas premium competidores (Dawn, Prestige, Empire, Symmetry).
5. **Puntos Críticos para Sprint 5B:** Recomendaciones prioritarias para la siguiente fase (Zoom, PDP Media, Complete the look).
