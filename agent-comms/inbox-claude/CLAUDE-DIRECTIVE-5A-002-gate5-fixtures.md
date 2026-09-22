# CLAUDE-DIRECTIVE-5A-002: Ejecución de Compuerta 5 (Tienda Real) y Fixtures F01-F12 para Sprint 5A

```text
ID: CLAUDE-DIRECTIVE-5A-002
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5 - Implementador Principal)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Auditor Senior de Producto: GPT-5.6 Sol Max
Fecha: 2026-09-22
Estado: DIRECTIVA VINCULANTE (Compuerta 5 - Verificación en Tienda Real)
Branch: master (Upstream en f2f2291 - Desplegado en vivo en Couture #165809488115)
```

---

## 1. Autorización y Misión

Johandry ha concedido formalmente la **AUTORIZACIÓN EXPRESA** solicitada en tu informe `CLAUDE-REPORT-5A-001` (§12) para crear los productos de prueba de la matriz `GPT-AUDIT-004` en la tienda de desarrollo (`tema-qkqpke0j.myshopify.com`).

El código del Sprint 5A ya está desplegado en la tienda en vivo (`Couture` #165809488115). Tu misión consiste en:
1. Crear los productos fixture necesarios en una colección de prueba oculta vía GraphQL Admin API.
2. Ejecutar la **Compuerta 5 (Medición Empírica en Tienda Real)** con Playwright/Chromium sobre el storefront en vivo.
3. Dejar los fixtures activos y documentados para que GPT-5.6 Sol Max pueda auditar la tienda en vivo y emitir su dictamen de producto.

---

## 2. Especificación de Fixtures (`/collections/qa-sprint-5a`)

Crea una colección oculta (desvinculada de los menús de navegación) denominada **"QA Sprint 5A"** (`handle: qa-sprint-5a`) con los siguientes productos configurados según `GPT-AUDIT-004`:

1. **F01 (Simple Available):** Producto de 1 sola variante, disponible, con 1 imagen (`QB-01`).
2. **F02 (Simple Sold Out):** Producto de 1 sola variante, totalmente agotado (`QB-02`).
3. **F03 (Size Only):** Producto con 1 sola opción de talla (XS, S, M, L, XL), con la talla M agotada (`QB-03`, `QB-04`).
4. **F04 (Color x Size):** Producto con 2 opciones (Color y Talla), al menos 4 colores y 4 tallas, con imágenes asignadas por color y combinaciones agotadas (`QB-05`, `QB-06`, `QB-07`).
5. **F05 (Native Swatches):** Producto con swatches nativos configurados (`swatch.color`, `swatch.image` y un valor sin swatch para verificar el fallback textual) (`SW-01` a `SW-07`).
6. **F06 (Required Plan):** Producto que exige plan de venta/suscripción obligatoria (`QB-11`).
7. **F08 (Gift Card):** Producto tipo tarjeta de regalo (`QB-13`).
8. **F10 (Hostile Card):** Producto con título extenso (>120 caracteres), vendor largo, sin imagen secundaria (`QB-20`).
9. **F11 (Many Swatches):** Producto con 6+ colores para validar la densidad responsiva: 2 swatches + `+N` en móvil (390px, 2 columnas) y 4 swatches + `+N` en desktop (`SW-10`, `SW-11`, `SW-12`).

*(Nota: Si ya existen productos borrador como qa-06 o qa-09 en la tienda, puedes aprovecharlos o ajustarlos según corresponda).*

---

## 3. Pruebas Obligatorias de Compuerta 5 en Tienda Real

Ejecuta las pruebas empíricas directamente contra la tienda real (`https://tema-qkqpke0j.myshopify.com` usando la contraseña `1234`):

### 3.1 Ergonomía y Touch Targets (Hitbox >= 44×44px)
- Medir a **1280px (desktop)** y a **390px (móvil, viewport 390×844)**:
  - Botón disparador de Quick Buy en tarjeta.
  - Botones de tallas en el popover desktop.
  - Botones de tallas en la hoja inferior móvil (`showModal()`).
  - Swatches de color en tarjeta (incluyendo el botón `+N`).
  - Swatches en los filtros facetados de colección y búsqueda.
- Certificar: 0 elementos interactivos por debajo de 44×44px y 0 solapamientos.

### 3.2 Accesibilidad axe-core en Tienda Real
- Ejecutar análisis con `axe-core` en 3 estados reales:
  1. Cuadrícula de colección con panel cerrado.
  2. Tarjeta con selector de tallas abierto en desktop.
  3. Tarjeta con modal sheet de tallas abierto en móvil.
- Requisito: **0 violaciones WCAG 2.2 AA**.

### 3.3 Flujo Funcional de Compra y Carrito
- Probar un flujo de compra real:
  - Clic en talla disponible de F03 o F04.
  - Verificar estado `aria-busy` durante la petición.
  - Apertura automática del `CartDrawer`.
  - Verificación del aterrizaje de foco en la línea añadida.
  - Retirada de la unidad del carrito para dejarlo en 0.
- Repetir la comprobación en la ruta en español: `/es/collections/qa-sprint-5a` (`QB-17`).

---

## 4. Entregable Esperado

1. Reporte exhaustivo en:
   `agent-comms/outbox-claude/CLAUDE-REPORT-5A-002.md`
   con evidencias empíricas (capturas, mediciones de bounding box, resultados de axe-core y afirmaciones falsables).
2. Dejar los fixtures listos en la tienda para que GPT-5.6 Sol Max realice la auditoría de producto y conversión.
3. No realizar commit ni push sin autorización de Gemini.
