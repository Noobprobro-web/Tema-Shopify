# GEMINI-003: Phase 2B Readiness Review

```text
ID: GEMINI-003
Estado: completado
Decisión de preparación: READY WITH CHANGES
Resumen en 5 líneas:
1. Phase 2A dejó un skeleton sólido, validado y con base accesible (ThemeElement, ThemeDrawer, skip link, color schemes).
2. El repositorio está técnicamente listo para Phase 2B, pero el encargo para GPT-5.6 Sol Max requiere límites estrictos para evitar ambigüedades.
3. Se formulan 10 recomendaciones priorizadas (P0: Cart Drawer, @app blocks, snippets atómicos y Custom Elements).
4. No se requiere escalar a GPT-6 Astra para Phase 2B si Sol Max recibe este checklist cerrado.
5. Se recomienda pase editorial con Claude únicamente al cerrar Phase 2B para auditar locales y labels merchant-facing.
```

---

## 1. Evaluación de Phase 2A y Límites de Entrada a Phase 2B

### Estado del Skeleton (Aprobado por Codex)
- **Base HTML/Liquid:** `layout/theme.liquid` incluye landmarks semánticos, `content_for_header`, `content_for_layout`, skip link accesible, inyección de fuentes con `font_face` (swap) y soporte integrado para `.color-{{ scheme.id }}` con variables CSS.
- **Base CSS:** `assets/base.css` establece tipografía fluida, layout primitives, estados de foco visibles (`:focus-visible`) y soporte nativo para `@media (prefers-reduced-motion: reduce)`.
- **Base JS:** `assets/theme.js` proporciona `ThemeElement` (con ciclo de vida y limpieza de eventos vía `AbortController`), `trapFocus` y `ThemeDrawer` con gestión de atributo `inert`.
- **Config & Locales:** `config/settings_schema.json` y `locales/en.default.json` son funcionales y parsean sin errores.
- **Transición:** Las plantillas JSON montan `sections/main-placeholder.liquid`, aislando el esqueleto sin adelantar lógica de Phase 2B.

---

## 2. Matriz de Recomendaciones para el Prompt de GPT-5.6 Sol Max

A continuación, las 10 recomendaciones prioritarias estructuradas para convertirse directamente en requisitos del prompt de implementación.

### Prioridad P0: Críticas / Bloqueantes de Arquitectura

#### 1. Delimitación y Ubicación del Cart Drawer (`P0`)
- **Evidencia:** En `docs/phase-2-architecture-plan.md` quedó abierta la duda sobre si el Cart Drawer vive en el header group, en una sección global o en un snippet. En `layout/theme.liquid` no hay punto de render para el carrito.
- **Riesgo:** Si el prompt no lo especifica, Sol Max podría incrustar el HTML del drawer dentro de `sections/header.liquid` (sobrecargando el header y complicando updates asíncronos) o quemarlo en `layout/theme.liquid`.
- **Recomendación:** Especificar que el Cart Drawer sea una sección global dedicada: `sections/cart-drawer.liquid`, invocada desde `layout/theme.liquid` justo antes de `</body>`. Debe sincronizarse con el endpoint oficial `/cart.js` y admitir la actualización de líneas vía Section Rendering API.
- **¿Entra al prompt de Sol Max?** **SÍ (Obligatorio)**.

#### 2. Soporte Mandatorio de Bloques `@app` en `main-product.liquid` (`P0`)
- **Evidencia:** Requisito obligatorio oficial de Shopify Theme Store (Capítulo 5). `sections/main-placeholder.liquid` no tiene bloques definidos.
- **Riesgo:** Si Sol Max omite el bloque `@app` en el schema y en el loop de renderizado (`{% when '@app' %}{% render block %}`), el tema será rechazado automáticamente en Theme Store y fallará en Theme Check.
- **Recomendación:** Mandatar en el schema de `main-product.liquid` la inclusión de `"blocks": [ ..., { "type": "@app" } ]` y su renderizado condicional en la columna de detalles de producto.
- **¿Entra al prompt de Sol Max?** **SÍ (Obligatorio)**.

#### 3. Interfaz Estricta de Snippets Atómicos de Comercio (`P0`)
- **Evidencia:** `docs/phase-2-architecture-plan.md` (decisión 4) exige definir los límites entre product card, imágenes y precios.
- **Riesgo:** Lógica de precios, badges e imágenes duplicada entre PLP, PDP y Carrito, aumentando el tamaño de Liquid y arriesgando inconsistencias en `unit_price` (requisito legal en la UE).
- **Recomendación:** Definir interfaces exactas para 4 snippets:
  1. `snippets/price.liquid`: Recibe `product` o `variant`, flags `use_variant`, `show_badges`, `price_class`. Maneja precio regular, comparativo, desglose unitario (`unit_price`) e IVA (`cart.taxes_included`).
  2. `snippets/responsive-image.liquid`: Recibe `image`, `sizes`, `prioritize: boolean`. Genera `image_tag` con `srcset`, dimensiones explícitas, `loading="lazy"` o `fetchpriority="high"`.
  3. `snippets/product-card.liquid`: Recibe `card_product`, `show_secondary_image`, `show_vendor`, `show_quick_add`. Invoca `price.liquid` y `responsive-image.liquid`.
  4. `snippets/icon.liquid`: Catálogo SVG limpio (close, arrow, chevron, cart, check, warning).
- **¿Entra al prompt de Sol Max?** **SÍ (Obligatorio)**.

#### 4. Herencia Obligatoria de `ThemeCore.ThemeElement` en Componentes JS (`P0`)
- **Evidencia:** Phase 2A implementó `window.ThemeCore.ThemeElement` en `assets/theme.js` para gestionar listeners con `AbortController`.
- **Riesgo:** Que Sol Max cree custom elements aislados con event listeners globales sin limpiar en `disconnectedCallback`, provocando fugas de memoria (*memory leaks*) o colisiones en el Theme Editor de Shopify.
- **Recomendación:** Exigir que `<variant-selects>`, `<cart-drawer>` y `<facet-filters-form>` extiendan formalmente de `ThemeCore.ThemeElement` y utilicen `this.listen(...)`.
- **¿Entra al prompt de Sol Max?** **SÍ (Obligatorio)**.

---

### Prioridad P1: Experiencia Merchant & Robustez Técnica

#### 5. Ampliación de Settings de Carrito en `settings_schema.json` (`P1`)
- **Evidencia:** `config/settings_schema.json` actualmente solo tiene `"show_cart_count": true`. No hay control de tipo de carrito ni notas de pedido.
- **Riesgo:** Falta de control para merchants: si el merchant prefiere redirigir a `/cart` o requiere notas de pedido, el tema no ofrecerá settings.
- **Recomendación:** Añadir en `settings_schema.json` (categoría `cart`):
  - `cart_type`: select con opciones `"drawer"` (default) y `"page"`.
  - `show_cart_note`: checkbox (default `false`).
  - `show_free_shipping_threshold`: checkbox o range.
- **¿Entra al prompt de Sol Max?** **SÍ**.

#### 6. Desacople de `sticky-cart-bar` de Phase 2B (`P1`)
- **Evidencia:** `docs/phase-2-architecture-plan.md` pregunta si `sticky-cart-bar` va dentro de `main-product` o como snippet. En `mvp-scope.md`, pertenece a diferenciadores de Fase 3.
- **Riesgo:** Sobrecargar a Sol Max intentando resolver la barra móvil adhesiva al mismo tiempo que la galería PDP, variantes y carrito Ajax, comprometiendo la estabilidad de Phase 2B.
- **Recomendación:** Excluir explícitamente `sticky-cart-bar` del encargo de Phase 2B. El foco debe ser `main-product.liquid` robusto, accesible y con selector de variantes nativo sin bugs.
- **¿Entra al prompt de Sol Max?** **SÍ (Clarificación de alcance)**.

#### 7. Filtros Facetados con Mejora Progresiva en `main-collection.liquid` (`P1`)
- **Evidencia:** Requisito oficial: filtrado nativo mediante el objeto `collection.filters`.
- **Riesgo:** Implementar filtrado puramente JS que rompa la navegación sin JavaScript, o que degrade SEO al no sincronizar la URL canónica con `URLSearchParams`.
- **Recomendación:** Construir los filtros como un formulario HTML estándar (`<form action="{{ collection.url }}">`) que funciona de manera nativa sin JS. El custom element `<facet-filters-form>` intercepta el submit para refrescar la cuadrícula vía Section Rendering API y `history.pushState`.
- **¿Entra al prompt de Sol Max?** **SÍ**.

#### 8. Actualización de Plantillas JSON (`product`, `collection`, `cart`) (`P1`)
- **Evidencia:** `templates/product.json`, `templates/collection.json` y `templates/cart.json` apuntan a `main-placeholder`.
- **Riesgo:** Crear las nuevas secciones pero olvidar actualizar el JSON de las plantillas, dejando el tema en estado inconsistente.
- **Recomendación:** El entregable de Sol Max debe incluir la actualización de los 3 archivos JSON montando las secciones reales con sus bloques predeterminados recomendados.
- **¿Entra al prompt de Sol Max?** **SÍ**.

---

### Prioridad P2: Refinamiento y Accesibilidad

#### 9. Accesibilidad y Estados en Selector de Variantes (`P2`)
- **Evidencia:** Las directrices WCAG 2.2 exigen que los cambios de estado (precio, stock) se anuncien y no dependan solo del color.
- **Riesgo:** Variantes agotadas que no informen a lectores de pantalla o generen errores 422 al intentar añadirse.
- **Recomendación:** Usar `role="radiogroup"` para opciones de variantes, marcar las no disponibles con `aria-disabled="true"`, actualizar el estado de disponibilidad en un elemento con `aria-live="polite"`, y sincronizar la URL con `?variant=ID` vía `history.replaceState`.
- **¿Entra al prompt de Sol Max?** **SÍ**.

#### 10. Centralización de Textos en `locales/en.default.json` (`P2`)
- **Evidencia:** Phase 2A dejó un diccionario mínimo en `locales/en.default.json`.
- **Riesgo:** Hardcodear cadenas en inglés dentro del Liquid de productos o carrito, violando la regla de Theme Check `TranslationKeyExists`.
- **Recomendación:** Exigir que todo texto visible (ej. `"Add to cart"`, `"Sold out"`, `"Sale"`, `"Taxes included"`, `"Quantity"`) use el filtro `| t` y quede agregado formalmente en `locales/en.default.json`.
- **¿Entra al prompt de Sol Max?** **SÍ**.

---

## 3. Riesgos Residuales

1. **Entorno local de Shopify CLI:** Sigue presente la incompatibilidad de `uv_os_get_passwd` en Windows con Node 24 dentro de subshells restringidas. Sol Max debe asegurarse de que los archivos generados sean sintácticamente puros para que `shopify theme check` corra limpio una vez montado en Node 22 LTS.
2. **Nombre comercial final pendiente:** El tema usa internamente `Atelier Flow` y públicamente `Theme Project`. No afecta el código Liquid de Phase 2B, pero debe mantenerse la convención sin hardcodear marcas no definitivas.

---

## 4. Evaluaciones de Modelo y Colaboración

- **Escalamiento a Modelo Superior (`ESCALATE_MODEL_RECOMMENDED`):** **NO REQUERIDO.**
  *Justificación:* GPT-5.6 Sol Max cuenta con suficiente capacidad técnica y ventana de contexto para ejecutar Phase 2B de manera excelente, siempre que el prompt contenga las restricciones y límites de snippets detallados en este informe. Escalar a GPT-6 Astra en este punto sería un gasto innecesario de tokens.
- **Recomendación de Claude (`CLAUDE_RECOMMENDED`):** **CONDICIONAL POST-FASE 2B.**
  *Justificación:* Durante la codificación técnica no se requiere Claude. Una vez que Sol Max entregue Phase 2B, se recomienda encargar a Claude una auditoría editorial sobre `locales/en.default.json`, labels de configuración y micro-copy de empty states del carrito.

---

## 5. Decisión Final

### **READY WITH CHANGES**

El repositorio y la base de Phase 2A están en condiciones óptimas para avanzar a Phase 2B. Sin embargo, Codex debe incorporar las recomendaciones **P0** (Cart Drawer como sección global, `@app` blocks, límites de snippets y herencia de `ThemeElement`) y clarificar el alcance en el prompt de GPT-5.6 Sol Max antes de autorizar la codificación.
