# Entrega GPT-2B-001: Phase 2B Commerce Foundation

```text
ID: GPT-2B-001
Estado: completado; pendiente de revision de Gemini
Decision requerida: Revision y aceptacion de Phase 2B por Gemini.
Resumen en 5 lineas:
1. Se implementaron PDP, coleccion, carrito tradicional y cart drawer global con mejora progresiva.
2. Se crearon los snippets atomicos de precio, imagen responsive y product card; icon.liquid fue ampliado sin perder sus iconos existentes.
3. Variantes, drawer y filtros son custom elements basados en ThemeCore.ThemeElement y usan this.listen(...).
4. Product, collection y cart dejaron main-placeholder; las otras plantillas y main-placeholder permanecen intactas.
5. Node, JSON, whitespace y Shopify Theme Check pasan; no se realizo commit ni push.
```

## Archivos creados

- `sections/cart-drawer.liquid`
- `sections/main-product.liquid`
- `sections/main-collection.liquid`
- `sections/main-cart-items.liquid`
- `snippets/price.liquid`
- `snippets/responsive-image.liquid`
- `snippets/product-card.liquid`

## Archivos modificados

- `layout/theme.liquid`
- `assets/theme.js`
- `assets/base.css`
- `config/settings_schema.json`
- `locales/en.default.json`
- `snippets/icon.liquid`
- `templates/product.json`
- `templates/collection.json`
- `templates/cart.json`

## Implementacion relevante

- Cart drawer global renderizado antes de `</body>` cuando `cart_type` es `drawer`.
- Ajax locale-aware para `/cart.js`, `/cart/add.js` y `/cart/change.js`, con bundled Section Rendering y fallback a Section Rendering API.
- Focus trap, restauracion de foco, Escape, overlay, `inert`, estados de carga y regiones `aria-live`/`role="alert"`.
- PDP con galeria responsive, media nativa, bloques reordenables, `@app`, radios de variantes, quantity rules, buy button y dynamic checkout.
- Coleccion con formulario GET funcional sin JS, filtros `collection.filters`, sort, paginacion y refresco progresivo con historial.
- Product cards con imagen responsive, precio/compare-at/unit price, badges y quick add seguro para productos simples.
- Carrito de pagina y drawer con descuentos, propiedades, selling plan visible, unit price, notas opcionales y quantity rules.
- Todas las cadenas storefront nuevas usan `| t` y estan en `locales/en.default.json`.

## Validaciones

- `node --check assets/theme.js`: OK.
- Parseo JSON de `config/settings_schema.json`, `locales/en.default.json` y los tres templates modificados: OK.
- `git diff --check`: OK; solo avisos normales LF/CRLF de Windows.
- `shopify theme check` fuera del sandbox: 34 archivos inspeccionados, 0 ofensas.
- Control de alcance: sin `sticky-cart-bar`; `sections/main-placeholder.liquid` y las otras nueve plantillas JSON no fueron modificadas.

## Riesgos y siguiente accion

- Falta smoke test en una tienda Shopify conectada con productos reales, variantes agotadas, quantity rules, selling plans, filtros y descuentos.
- Verificar en runtime que el ID de la seccion estatica `cart-drawer` sea devuelto por bundled Section Rendering en la tienda de prueba.
- Probar dynamic checkout y un app block real dentro de `main-product`.
- Hacer QA visual/teclado en 375, 768, 1024 y 1440 px cuando exista preview de Shopify.
- Los labels nuevos de Theme Settings son literales porque `locales/en.default.schema.json` estaba fuera del alcance; Gemini puede autorizar una tarea pequena de localizacion de schema si desea uniformidad total.
- Siguiente accion: Gemini revisa el diff y este reporte; solicita cambios o autoriza commit/push.
