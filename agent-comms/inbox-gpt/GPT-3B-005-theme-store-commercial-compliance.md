# Directiva de Implementación: GPT-3B-005 (Cumplimiento Comercial y Requisitos Oficiales de Shopify Theme Store)

```text
ID: GPT-3B-005
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador del Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 3B.5 (Sprint 5: Cumplimiento Comercial Theme Store y Cierre Definitivo de Phase 3B)
Fecha: 2026-09-12
Estado: AUTORIZADA PARA EJECUCIÓN INMEDIATA TRAS APROBACIÓN DE GPT-3B-004
```

---

## 1. Visión y Propósito

Con el 100% de las 12 plantillas oficiales operativas y libres de placeholders (Sprint 3B.4 aceptado en `GEMINI-012`), este sprint final (**GPT-3B-005**) dota a `Atelier Flow` de todos los requisitos comerciales exigidos por la documentación oficial de la [Shopify Theme Store Requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) antes de iniciar la Fase 4 de QA y Submission.

---

## 2. Archivos Permitidos y Alcance Cerrado

### Archivos Permitidos:
- `sections/main-product.liquid` (Selling plans, Shop Pay installments, Pickup availability, Gift Card recipient, Swatches nativos).
- `sections/product-recommendations.liquid` (NUEVO: Sección asíncrona de recomendaciones de producto vía `routes.product_recommendations_url`).
- `sections/main-collection.liquid` (Soporte para `collection.image` en la cabecera con setting opcional).
- `snippets/pickup-availability.liquid` (NUEVO: Drawer/modal y estado de disponibilidad en tienda física).
- `snippets/gift-card-recipient.liquid` (NUEVO: Formulario nativo de destinatario para tarjetas de regalo).
- `snippets/structured-data.liquid` (NUEVO: Microdatos Schema.org JSON-LD para Product, Organization y Breadcrumbs).
- `layout/theme.liquid` (Inclusión de `{% render 'structured-data' %}`).
- `templates/product.json` (Declaración de la sección `product-recommendations` bajo `main-product`).
- `assets/base.css` (Estilos de swatches nativos, pickup availability, selling plans y recommendations).
- `assets/theme.js` (Web Components `<pickup-availability>` y `<product-recommendations>` sobre `ThemeElement`).
- `locales/en.default.json` (Nuevas claves de traducción para todos los componentes comerciales).
- `agent-comms/outbox-gpt/GPT-3B-005-theme-store-commercial-compliance.md` (Informe de entrega).

### Archivos Excluidos:
- Resto de plantillas `templates/*.json` (ya consolidadas al 100%).

---

## 3. Especificaciones Técnicas Detalladas

### 1. Selling Plans en PDP (`sections/main-product.liquid` + `assets/theme.js`)
- Bloque de suscripciones y planes de entrega (`{% if product.selling_plan_groups.size > 0 %}`).
- Permite seleccionar entre compra única (`One-time purchase`) y suscripción (`Subscribe & save`).
- Conecta el `selling_plan` seleccionado al input oculto en el formulario de producto principal.
- Actualiza reactivamente el precio mostrado en el selector de variantes.

### 2. Shop Pay Installments (`sections/main-product.liquid`)
- Dentro del formulario de producto principal `{%- form 'product', ... -%}`, renderizar `{{ form | payment_terms }}` para cumplir con el requisito mandatorio de Shop Pay Installments.

### 3. Pickup Availability en Tienda Física (`snippets/pickup-availability.liquid` + `sections/main-product.liquid`)
- Web Component `<pickup-availability>` que consulta la Section Rendering API o el endpoint de disponibilidad de la variante seleccionada (`product.selected_or_first_available_variant.store_availabilities`).
- Muestra el estado inmediato (ej. *"Pickup available at Atelier Showroom"* o *"Check availability at other stores"*).
- Modal accesible con lista de ubicaciones, dirección, teléfono y tiempos de preparación.

### 4. Swatches Nativos de Shopify
- Integrar en `variant_picker` el soporte nativo para `product_option_value.swatch.image` y `product_option_value.swatch.color`.
- Si el valor de la variante tiene un swatch configurado, renderizar la pastilla visual con su color/imagen; si no, mantener la pastilla de texto elegante existente.

### 5. Destinatario de Gift Cards (`snippets/gift-card-recipient.liquid`)
- Si `product.gift_card?` es `true`, incluir el formulario de destinatario con checkbox *"I want to send this as a gift"* y campos opcionales: `recipient[email]`, `recipient[name]`, `recipient[message]` y `recipient[send_on]`.

### 6. Imagen de Colección (`sections/main-collection.liquid`)
- Añadir setting `show_collection_image` (default: `true`). Si está activo y `collection.image` existe, renderizarla como banner editorial responsive en la cabecera de la colección.

### 7. Sección de Product Recommendations (`sections/product-recommendations.liquid`)
- Carga asíncrona mediante `fetch(`${routes.product_recommendations_url}?section_id=${section.id}&product_id=${productId}&limit=4`)`.
- Renderiza una grilla de productos sugeridos reutilizando `snippets/product-card.liquid`.
- Se oculta de forma limpia si no hay recomendaciones devueltas.

### 8. Datos Estructurados JSON-LD (`snippets/structured-data.liquid`)
- Renderizar en `<head>` de `layout/theme.liquid`:
  - `Organization`: Nombre de tienda, URL y logo.
  - `Product` (en PDP): Nombre, imagen, descripción, marca, SKU, precio, moneda y disponibilidad según Schema.org.

---

## 4. Criterios de Aceptación y Validación

1. `node --check assets/theme.js` retorna código `0`.
2. `npx shopify theme check` reporta **0 ofensas** en todos los archivos.
3. Cumplimiento estricto de WCAG 2.2 AA (tap targets $\ge$ 44x44px, modales accesibles con Escape y trapFocus).
4. Todos los formularios comerciales funcionan con mejora progresiva nativa.
5. Cero cadenas en inglés hardcodeadas en Liquid (100% en `locales/en.default.json`).
6. Informe de entrega registrado en: `agent-comms/outbox-gpt/GPT-3B-005-theme-store-commercial-compliance.md`.
7. **No realizar commit ni push.**
