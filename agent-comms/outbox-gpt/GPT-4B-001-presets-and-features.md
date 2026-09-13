# Entrega GPT-4B-001: presets y producto destacado

```text
ID: GPT-4B-001
Implementador: GPT-5.6 Sol Max / Codex
Coordinador: Gemini Flash 3.8 High
Fecha: 2026-09-13
Estado: READY_FOR_GEMINI_REVIEW
Commit/push: NO realizados
```

## Resumen

1. `settings_data.json` contiene Couture, Studio y Archive con cinco esquemas WCAG 2.2 AA por preset; `current` coincide exactamente con Couture.
2. Se creó `featured-product.liquid` con media enriquecida, `@app`, Custom Liquid, swatches, variantes, cantidad, selling plans, Shop Pay, gift cards, pickup y checkout dinámico.
3. Lookbook admite coordenadas móviles independientes y el valor `0` hereda cada coordenada de escritorio.
4. `/listings/` contiene nueve templates diferenciados y válidos: `index`, `collection` y `product` para los tres presets.
5. Shopify CLI inspeccionó 72 archivos sin ofensas y generó `Couture-1.0.0.zip` incluyendo `/listings/`.

## Implementación

### Presets y color

- Couture/current: cinco esquemas exactos crema, tinta y latón.
- Studio: tipografía Assistant, espaciado 56 y cinco esquemas neutros/fríos.
- Archive: Libre Baskerville + Assistant, espaciado 72 y cinco esquemas arcilla/oliva/óxido.
- Contrastes mínimos calculados:
  - Couture/current: texto `7.92:1`; controles `3.03:1`.
  - Studio: texto `11.14:1`; controles `3.00:1`.
  - Archive: texto `5.17:1`; controles `3.31:1`.

### Producto destacado

- Estado de onboarding localizado con placeholder nativo, título y precio de muestra.
- Media de imagen, video, video externo y modelo 3D mediante `product-media`; registro condicional de Shopify XR para modelos del producto destacado.
- Bloques: `title`, `price`, `variant_picker`, `quantity_selector`, `buy_buttons`, `description`, `custom_liquid` y `@app`.
- El formulario nativo incluye reglas de cantidad, planes de venta, `payment_terms`, checkout dinámico, destinatario de gift card y pickup availability.
- Todos los nombres, labels e info del schema usan claves `t:`; el storefront no contiene copy inglesa literal.

### Contratos habilitados para los listings

- `hero-editorial` ahora implementa los settings ya aprobados para modos split/cinematic, proporción, video diferido, poster, alturas, overlays, posición/alineación y nivel de heading.
- El video no se descarga en móvil cuando está desactivado y no se reproduce con `prefers-reduced-motion`.
- `main-product` incorpora `media_layout: thumbnails` con botones de 44 px o más, estado `aria-pressed`, live region y fallback sin JS.

### Estructura `/listings/`

- Couture: 8 secciones de homepage; colección a 2 columnas con promotion tile en posición 4; PDP grid con size guide.
- Studio: 6 secciones, sin lookbook/marquee; colección a 4 columnas sin promotion tile; PDP grid sin size guide.
- Archive: 7 secciones, sin bundle; colección a 2 columnas con promotion tile en posición 3 y vendor; PDP con thumbnails.
- Los tres PDP usan `main-product`, cuyo schema declara y renderiza `@app`. No se serializó un bloque genérico `"type": "@app"` en JSON: Shopify solo permite persistir una instancia cuando existe su identificador real `shopify://apps/...`; fabricar una referencia sin app produciría un template inválido.

## Archivos

### Creados

- `sections/featured-product.liquid`
- `listings/couture/templates/index.json`
- `listings/couture/templates/collection.json`
- `listings/couture/templates/product.json`
- `listings/studio/templates/index.json`
- `listings/studio/templates/collection.json`
- `listings/studio/templates/product.json`
- `listings/archive/templates/index.json`
- `listings/archive/templates/collection.json`
- `listings/archive/templates/product.json`
- `agent-comms/outbox-gpt/GPT-4B-001-presets-and-features.md`

### Modificados

- `config/settings_data.json`
- `sections/lookbook.liquid`
- `sections/hero-editorial.liquid`
- `sections/main-product.liquid`
- `assets/base.css`
- `assets/theme.js`
- `locales/en.default.json`
- `locales/en.default.schema.json`
- `docs/requirements-ledger.md`

### Artefacto generado

- `Couture-1.0.0.zip` (ignorado por Git mediante la regla existente para ZIP).

## Validaciones

| Validación | Resultado |
| --- | --- |
| `node --check assets/theme.js` | PASS, código 0 |
| JSON estricto en `config/`, `templates/`, `listings/` y `locales/` | PASS, 25 archivos |
| Contrato custom listing/schema | PASS, 9 templates; cero sections, settings, blocks u opciones desconocidas |
| Contrato de presets | PASS, `current = Couture`; 3 presets; 5 esquemas por preset |
| Contraste calculado WCAG 2.2 AA | PASS, texto >= 4.5:1 y controles >= 3:1 |
| `cmd.exe /c "npx shopify theme check"` | PASS, 72 archivos, 0 ofensas |
| `cmd.exe /c "npx shopify theme package"` | PASS, `Couture-1.0.0.zip` |
| Inspección del ZIP | PASS, 83 entradas; 9 JSON de `/listings/`; `featured-product.liquid` incluido |
| `git diff --check` | PASS; solo avisos informativos LF/CRLF de Windows |

Shopify CLI se ejecutó fuera del sandbox porque dentro de este entorno Windows reproduce el error conocido `uv_os_get_passwd returned ENOMEM`.

## Compuertas DoD

1. **Ledger:** PASS. Se actualizaron las filas de app blocks y presets diferenciados con evidencia concreta; conteo vivo ajustado a `36 / 45` según la métrica vigente del proyecto.
2. **Estados degenerados:** PASS por revisión estática. Producto vacío, media ausente, una/múltiples medias, una/múltiples variantes, bloque de título ausente, video ausente/reduced motion, un/múltiples thumbnails y coordenada móvil `0` tienen fallback definido.
3. **Consistencia cross-file:** PASS. Los nueve listings fueron contrastados automáticamente con los schemas Liquid y sus órdenes de sections/blocks.
4. **Superficie merchant:** PASS. Schema nuevo 100% `t:`, labels sentence case e info contextual en controles de video, heading, checkout y herencia móvil.
5. **Tienda real:** PENDIENTE. La validación estática y el ZIP no sustituyen instalación/smoke test de Couture, Studio y Archive con productos, video, modelo 3D y una app block real.

## Riesgos y siguiente acción

- Instalar el ZIP en las tres demo stores y comprobar que cada listing sustituye los templates base esperados.
- Probar el producto destacado con producto vacío, producto multivariante, suscripción, gift card, video/modelo 3D y app block real.
- Ejecutar Lighthouse/axe en homepage, colección y producto para desktop/móvil; validar autoplay, reduced motion, miniaturas y hotspots contra contenido real.
- Asignar productos, colecciones y media con handles reales en cada demo. Los bloques de recursos del paquete se dejaron sin referencias inventadas para evitar enlaces rotos.

Fuentes oficiales consultadas: [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements), [theme package](https://shopify.dev/docs/api/shopify-cli/theme/theme-package) y [theme preset ZIP structure](https://shopify.dev/docs/storefronts/themes/store/success/updates#best-practices-on-structuring-your-theme-zip).
