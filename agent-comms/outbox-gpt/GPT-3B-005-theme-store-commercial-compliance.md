# Entrega GPT-3B-005: Cumplimiento Comercial Shopify Theme Store

```text
ID: GPT-3B-005
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: revisar la implementacion y autorizar commit/push antes de Phase 4.
```

## Resumen en 5 lineas

1. El PDP ahora admite compra unica y selling plans por variante, actualiza precio/URL/formulario y muestra Shop Pay Installments dentro del formulario nativo.
2. Pickup Availability reacciona a la variante activa mediante Section Rendering API y ofrece un drawer accesible con ubicacion, direccion, telefono y tiempo de preparacion.
3. Los selectores de variante soportan swatches nativos de color o imagen y las Gift Cards incorporan el formulario oficial de destinatario.
4. Colecciones pueden mostrar su imagen editorial y el PDP carga recomendaciones related/complementary de forma asincrona reutilizando `product-card`.
5. Organization, Product y BreadcrumbList quedan publicados como JSON-LD; toda la entrega pasa sintaxis, traducciones, smoke responsive y Theme Check con 0 ofensas.

## Archivos creados

- `sections/product-recommendations.liquid`
- `snippets/gift-card-recipient.liquid`
- `snippets/pickup-availability.liquid`
- `snippets/structured-data.liquid`
- `agent-comms/outbox-gpt/GPT-3B-005-theme-store-commercial-compliance.md`

## Archivos modificados

- `sections/main-product.liquid`
- `sections/main-collection.liquid`
- `templates/product.json`
- `layout/theme.liquid`
- `assets/base.css`
- `assets/theme.js`
- `locales/en.default.json`

## Implementacion

### Selling plans y Shop Pay

- El formulario principal incluye `form | payment_terms` y un unico input efectivo `name="selling_plan"` para la ruta JavaScript.
- La compra unica se desactiva en variantes con `variant.requires_selling_plan`; planes incompatibles se ocultan y desactivan al cambiar de variante.
- Precio, compare-at, precio unitario, precio por entrega, disponibilidad, sticky cart bar y URL se sincronizan con la asignacion activa.
- Sin JavaScript se conserva un selector nativo `name="selling_plan"` con los planes validos de la variante inicial.

### Pickup Availability

- `pickup-availability` hereda de `ThemeCore.ThemeElement`, usa listeners limpiables y cancela solicitudes obsoletas con `AbortController`.
- Cada cambio de variante vuelve a renderizar `main-product` mediante `section_id`, extrae solo el nuevo componente y evita mostrar datos de una variante anterior.
- El drawer controla trap de foco, Escape, click exterior, restauracion de foco, `inert`, `aria-modal` y bloqueo del body.
- Shopify Liquid no expone horarios por ubicacion. Se agrego `pickup_hours_note` como nota opcional compartida y editable, sin inventar datos operativos.

### Gift Cards y swatches

- El formulario usa las propiedades nativas `properties[Recipient email]`, `properties[Recipient name]`, `properties[Message]`, `properties[Send on]`, `properties[__shopify_offset]` y `properties[__shopify_send_gift_card_to_recipient]="true"`.
- Se usan `form.email`, `form.name`, `form.message` y `form.send_on`; limites de nombre, mensaje y fecha siguen los limites oficiales de 255, 200 y 90 dias.
- Con JavaScript, los campos se habilitan solo al activar el regalo; sin JavaScript permanecen visibles para una ruta de envio nativa.
- Cada `product_option_value` mantiene texto legible y anade, cuando existe, `swatch.image` o `swatch.color` sin perder estados unavailable.

### Recomendaciones, coleccion y datos estructurados

- `product-recommendations` carga bajo demanda desde `routes.product_recommendations_url`, cancela la solicitud al desconectarse y se oculta si no recibe productos.
- La seccion admite intents `related` y `complementary`; `templates/product.json` instala por defecto la variante related.
- `main-collection` incorpora `show_collection_image`, activado por defecto, y render responsive de `collection.featured_image` cuando `collection.image` existe.
- El `<head>` incluye Organization global, Product mediante el filtro nativo `structured_data` y BreadcrumbList contextual.

## Decisiones de compatibilidad oficial

- La directiva abreviaba los campos Gift Card como `recipient[...]`. Se implementaron line-item properties `properties[...]` porque son los nombres que Shopify valida y procesa actualmente.
- Pickup se mantiene como snippet, segun el archivo autorizado, y usa Section Rendering sobre la seccion `main-product`; no se creo una seccion adicional fuera del alcance.
- El Product JSON-LD usa `product | structured_data` para conservar el schema vigente de Shopify, incluidas variantes/ofertas, en vez de duplicarlo manualmente.
- No se agregaron dependencias, Sass/SCSS ni cambios en otras plantillas.

## Validaciones

```text
node --check assets/theme.js
PASS (exit 0)

npx shopify theme check
PASS: 56 archivos inspeccionados, 0 ofensas

Auditoria JSON global
PASS: 22 archivos JSON parseados

Auditoria de schemas Liquid
PASS: 25 bloques {% schema %} parseados

Auditoria de traducciones Liquid
PASS: 381 referencias estaticas, 287 claves unicas, 0 ausentes

git diff --check
PASS; solo avisos informativos LF -> CRLF de Windows

Smoke comercial con navegador
PASS: 390 y 1440 px, mas ruta sin JavaScript
Selling plan enviado por el formulario; variante obligatoria fuerza suscripcion
Precio principal, precio por entrega y sticky cart sincronizados
Pickup cambia de ubicacion, modal restaura foco y fondo usa inert
Gift Card habilita/deshabilita campos y calcula timezone/contador
Recommendations carga bajo demanda; 0 overflow y 0 targets auditados bajo 44px

Suites de regresion Phase 3B.2, 3B.3, HOTFIX y 3B.4
PASS (exit 0): homepage, merchandising, contenido/sistema y no-JS
```

## Riesgos y siguiente accion

- Ejecutar en Phase 4 un smoke real con una app de suscripciones, una variante subscription-only, Shop Pay elegible, varias ubicaciones pickup y un producto Gift Card.
- Verificar recomendaciones con historico real de pedidos/productos; Shopify puede devolver una lista vacia en catalogos nuevos y la seccion se ocultara correctamente.
- Medir en storefront real la respuesta de pickup, ya que vuelve a renderizar `main-product` para respetar el alcance de archivos del sprint.
- Validar JSON-LD con una URL publica mediante Rich Results Test despues del despliegue de preview.
- `agent-comms/inbox-claude/CLAUDE-AUDIT-001-theme-review-and-ux-audit.md` aparecio como archivo concurrente no rastreado; no pertenece a esta entrega y se dejo intacto.
- Gemini debe revisar el diff y esta evidencia antes de autorizar commit/push.
- No se realizo commit ni push.
