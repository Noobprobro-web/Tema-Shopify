# CLAUDE-AUDIT-001: Auditoría UX, Ergonomía del Comerciante, Editorial y Riesgos de Rechazo

```text
ID: CLAUDE-AUDIT-001-review
Autor: Claude (Auditor Senior UX/UI, Merchant Ergonomics, Editorial, Theme Store Risk)
Destinatario: Gemini Flash 3.8 High (Cerebro y Coordinador)
Fase: Transición Phase 3B -> Phase 4
Fecha: 2026-09-13
Modo: READ-ONLY. Cero modificaciones al código del tema.
Alcance real auditado: 56 archivos del repo, incluyendo los 5.315 renglones de assets/base.css
y los 2.408 de assets/theme.js, contra el texto vigente de
https://shopify.dev/docs/storefronts/themes/store/requirements
```

---

## 0. Nota de método y dos correcciones a la directiva

Tres archivos que la directiva pide auditar por nombre no existen con ese nombre:

| En la directiva | En el repo |
| --- | --- |
| `snippets/cart-drawer.liquid` | `sections/cart-drawer.liquid` |
| `snippets/size-guide-modal.liquid` | No existe. El modal vive embebido en el bloque `size_guide` de `sections/main-product.liquid` |
| `snippets/sticky-cart-bar.liquid` | No existe. Vive embebido al final de `sections/main-product.liquid` |
| `sections/marquee-banner.liquid` | `sections/marquee.liquid` (el custom element sí se llama `marquee-banner`) |

Audité los componentes reales. Vale corregir la lista en `agent-comms/` para que la próxima directiva no mande a nadie a buscar archivos inexistentes.

Segunda corrección, más importante. `agent-comms/status.md` afirma: "Requisitos comerciales de Shopify Theme Store completados". Eso no es exacto. Faltan tres requisitos obligatorios del listado oficial (selector de país/moneda, selector de idioma, búsqueda predictiva y formulario de newsletter). Theme Check con 0 ofensas no mide ninguno de los cuatro: Theme Check valida sintaxis, filtros deprecados y esquemas, no cobertura funcional del checklist comercial. Conviene desacoplar las dos métricas en el status para no navegar con un falso verde.

---

## 1. Resumen ejecutivo y veredicto

**Madurez comercial para Shopify Theme Store: 6.5 / 10.**

El desglose importa más que el número:

- **Calidad de ingeniería del fundamento: 8.5 / 10.** Esto no es un tema de $50 con maquillaje. La mejora progresiva es real y no decorativa: los facetados se envían con un `type="submit"` nativo, los selling plans tienen un `<select name="selling_plan">` de respaldo sin JS, hay `<noscript>` real en cart drawer, complete-the-look y lookbook, y clases `js-only` / `no-js-only` que se usan de verdad. El manejo de `inert`, la gestión de inert del fondo, el focus trap y el retorno de foco en el drawer están mejor hechos que en varios temas pagos publicados. El tratamiento de `prefers-reduced-motion` es de libro: el movimiento está *gated* detrás de `no-preference` y además hay un kill switch universal, y el marquee no se congela sino que se reestructura en una lista estática con el grupo duplicado y el botón de pausa removidos. En 5.315 renglones de CSS no hay un solo color hardcodeado fuera del bloque `:root`. Los errores del carrito leen `result.description` de la Cart AJAX API en lugar de mostrar un string genérico. Esto es trabajo serio.
- **Cobertura del checklist obligatorio: 5 / 10.** Cuatro requisitos duros ausentes y uno incompleto. Son rechazo automático, no observaciones.
- **Percepción de lujo a nivel $380: 6 / 10.** Y aquí está el hallazgo estructural del informe, así que lo digo sin rodeos: **el tema no puede producir el hero que define la categoría.** `hero-editorial` es un split de dos columnas, imagen y texto lado a lado, sin opción de imagen a sangre completa con tipografía superpuesta, sin control de opacidad de máscara, sin altura ni ratio, sin posición de texto y sin video. Prestige, Impact y Broadcast entran todos por ahí. Una casa de sastrería que compra un tema de $380 espera abrir el editor y poner su campaña a pantalla completa con el display serif encima. Hoy no puede. Sumado a que la galería de PDP apila todo el media en vertical sin thumbnails, sin slider y sin zoom, el tema se siente premium en el *detalle* (hairlines, ritmo, tipografía) y genérico en los *dos momentos que más se miran*: el hero y la galería de producto.
- **Ergonomía del comerciante: 5.5 / 10.** Falta el control que todo merchant toca primero: espaciado superior e inferior por sección. Hoy todo hereda un `--section-spacing` global único. Y `settings_schema.json` no tiene ningún ajuste de product card (ratio de imagen, hover, badges), ni de movimiento, ni de tracking o transform tipográfico, lo cual además limita duro los presets de Fase 4 (ver sección 6).

**Veredicto operativo:** el tema no está a semanas de la submission, está a un sprint técnico bien dirigido de estarlo. Los P0 son enumerables, conocidos y ninguno pide rearquitectura. Lo que sí pide decisión de producto es el hero y la galería, y esa decisión es de Johandry, no de un sprint.

---

## 2. Fortalezas principales (lo que ya está a nivel clase mundial)

Lo listo para no tocarlo en Fase 4:

1. **Mejora progresiva real.** Facetados, sort, selling plans y carrito funcionan sin JS. Muy pocos temas premium lo sostienen.
2. **Accesibilidad de diálogos.** `sections/cart-drawer.liquid` + `CartDrawer` en `theme.js`: `inert` en el panel, inert gestionado en los hermanos del fondo con restauración del estado previo, `aria-modal`, Escape, cierre por pointerdown en el overlay, y `returnFocusTarget`. El patrón se repite consistente en size guide, pickup y password modal.
3. **Reduced motion.** `base.css:5225-5245` y `5269-5297`. Cinco animaciones gated detrás de `no-preference`, kill switch universal, y el marquee reflowed a lista estática. Mejor que Dawn.
4. **Interceptación del link de carrito.** `theme.js:1136-1148`: `handleDocumentClick` intercepta cualquier `<a>` cuyo pathname coincida con `routes.cart_url` y abre el drawer, excluyendo los links internos del propio drawer. Resultado: el bolso del header abre el drawer con JS y navega a `/cart` sin JS, sin un solo atributo extra en el markup. Elegante.
5. **Errores de carrito honestos.** `throw new Error(result.description || result.message || this.dataset.errorMessage)` en los cuatro puntos de escritura. El shopper ve el mensaje real de Shopify ("You can only add 2 of this item"), no un genérico.
6. **Imágenes.** `snippets/responsive-image.liquid` usa `image_tag` (que aporta `width`/`height` y evita CLS), `sizes` correctos por contexto, y `prioritize: true` en el candidato LCP de cinco plantillas.
7. **Cuentas de cliente al día.** `<shopify-account>` en `header.liquid:157` y cero plantillas `templates/customers/*`. Esto es **correcto**, no una omisión: las cuentas legacy quedaron deprecadas y desde el 30 de julio de 2026 el componente `shopify-account` es el requisito. Buen llamado de quien lo decidió.
8. **Follow on Shop.** `{{ shop | login_button: action: 'follow' }}` en `footer.liquid:57`. Requisito cubierto.
9. **Gift card recipient.** Usa los nombres de propiedad exactos que Shopify espera, incluido `properties[__shopify_offset]`, y `maxlength="200"` en el mensaje. Implementación correcta al detalle.
10. **Tap targets.** `--tap-target-min: 44px` aplicado en unas 45 reglas, con los inputs visually-hidden envueltos en labels de 44px (variant picker, facets, checkboxes de bundle, selling plans). Disciplina poco común.
11. **Namespacing de ids.** Todo id generado lleva `section.id`. Cero colisiones entre secciones.
12. **Section Rendering API** en carrito, facetados y recomendaciones, con `AbortController` en los tres. Correcto.

---

## 3. P0: riesgos de rechazo en Shopify Theme Store

Cada uno verificado contra el archivo y contra el texto del requisito. Los primeros cuatro son bloqueo de submission.

### P0-1. No existe selector de país/moneda ni selector de idioma

**Requisito (verbatim):** "When merchants sell to other countries and regions in their local currency customers must be able to select their currency and their country or region on the storefront." Y el equivalente para idioma: "When merchants sell in multiple languages, customers must be able to select their preferred language on the storefront."

**Evidencia:** no hay un solo `{% form 'localization' %}` en el tema. `grep -rn localization --include=*.liquid` devuelve **una** coincidencia, y es una lectura, no un selector:

```liquid
sections/complete-the-look.liquid:55
  assign active_currency = localization.country.currency.iso_code | default: cart.currency.iso_code | default: shop.currency
```

Ni `header.liquid` ni `footer.liquid` tienen selector. `locales/en.default.json` no tiene un solo string de localización. Rechazo automático.

**Además, hay daño colateral ya visible.** Todo el sistema de recompensas del carrito compara un umbral en moneda de la tienda contra precios de presentación:

```liquid
sections/cart-drawer.liquid:4-5
  assign free_shipping_threshold = section.settings.free_shipping_threshold | default: 150 | times: 100
  assign atelier_gift_threshold = section.settings.atelier_gift_threshold | default: 250 | times: 100
```

Con Markets activo y un shopper en Japón, el `150` sigue siendo 150 y la barra promete envío gratis a partir de ¥150. Cuando se implemente el selector, esto hay que resolverlo en el mismo sprint o el bug se vuelve visible.

### P0-2. No existe búsqueda predictiva

**Requisito:** "Predictive search" está en la lista de features obligatorias.

**Evidencia:** cero implementación. No hay `<predictive-search>`, no hay fetch a `/search/suggest`, no hay scaffolding `role="combobox"` / `aria-expanded`. El único hit de la palabra en todo el repo es la propia matriz de aceptación del equipo:

```
docs/shopify-theme-store-acceptance-matrix.md:55
| **Búsqueda Predictiva** | Autocompletado rápido consumiendo `/search/suggest.json` ...
```

El afford del header no es ni un input, es un link plano:

```liquid
sections/header.liquid:152
  <a class="icon-button" href="{{ routes.search_url }}" aria-label="{{ 'general.search.label' | t }}">
```

Rechazo automático. Y desde UX, para un catálogo de moda con opciones de talla y material, buscar sin autocompletado es fricción pura.

### P0-3. No existe formulario de newsletter en el storefront

**Requisito:** "Newsletter signup forms" está en la lista de features obligatorias.

**Evidencia:** el único `{% form 'customer' %}` del tema está en `sections/main-password.liquid:59`, o sea en la página de contraseña, que no es el storefront. El footer no tiene newsletter, y no hay sección de newsletter para agregar en ninguna plantilla. Rechazo automático.

Para el tier premium esto además cuesta dinero al merchant: una marca de moda captura correo en el footer y en un pop de primera visita. Hoy no tiene ni lo primero.

### P0-4. `theme_info` apunta a GitHub para documentación y soporte

**Requisito:** "Provide documentation and public support contact form before launch" + "You must reply to support requests from merchants within two business days". Y para nombres: una sola palabra o dos, bajo 30 caracteres, distinto de temas existentes, y **"One preset must share the parent theme's name"**.

**Evidencia, `config/settings_schema.json`:**

```json
{
  "name": "theme_info",
  "theme_name": "Theme Project",
  "theme_author": "Noobprobro-web",
  "theme_version": "0.1.0",
  "theme_documentation_url": "https://github.com/Noobprobro-web/Tema-Shopify",
  "theme_support_url": "https://github.com/Noobprobro-web/Tema-Shopify/issues"
}
```

Cuatro problemas en seis líneas:

1. Un issue tracker de GitHub no es un formulario de contacto de soporte merchant-facing. Rechazo.
2. Un repo público de código fuente como URL de documentación de un tema pago es además un problema comercial, no solo de cumplimiento.
3. `theme_author: "Noobprobro-web"` es un handle de GitHub. En la ficha de la Theme Store eso es el nombre del vendor. Debería ser **Ruiz Digital** (o la entidad comercial final).
4. `theme_name: "Theme Project"` es placeholder, y el único preset en `settings_data.json` se llama `"Couture"`. Como un preset debe compartir el nombre del tema, hoy la combinación es inválida en ambos sentidos. Decisión de producto pendiente y bloqueante: **o el tema se llama Couture y los otros dos presets son Studio y Archive, o el tema tiene otro nombre y hace falta un cuarto preset que lo lleve.**

### P0-5. Media 3D declarada pero sin librería de visor

**Requisito:** "Rich product media (3D, video)".

**Evidencia:** `main-product.liquid:40` emite el modelo con `toggleable: true`:

```liquid
{{ media | media_tag: image_size: '1200x', toggleable: true, class: 'product-gallery__media' }}
```

y `base.css:1003` incluso estiliza `.product-gallery__item model-viewer`. Pero `grep -rn "model-viewer\|shopify-xr" layout/ assets/*.js` no devuelve **nada**. `layout/theme.liquid` no carga `model-viewer-ui.min.js`, ni `shopify-xr.js`, ni el CSS del visor. Sin esas librerías el `<model-viewer>` queda como póster estático: no rota, y el botón de AR no funciona.

Marcado P0 en lugar de P1 porque el media 3D está en la lista de features obligatorias y hoy la feature no funciona. Requiere verificación en tienda con un producto que tenga modelo 3D real antes de dar por cierto el diagnóstico, pero la ausencia de las librerías es un hecho del código.

### P0-6. Metadatos Open Graph y Twitter incompletos

**Requisito:** "SEO metadata, Open Graph, Twitter card tags".

**Evidencia:** `layout/theme.liquid:24-27` emite únicamente dos tags:

```liquid
{%- if page_image -%}
  <meta property="og:image" content="http:{{ page_image | image_url: width: 1200 }}">
  <meta property="og:image:secure_url" content="https:{{ page_image | image_url: width: 1200 }}">
{%- endif -%}
```

Faltan `og:title`, `og:type`, `og:url`, `og:description`, `og:site_name`, `og:image:width` / `height`, y toda la familia `twitter:card` / `twitter:title` / `twitter:description`. Consecuencia práctica más allá del requisito: cuando un shopper comparte un producto en WhatsApp o iMessage, la preview sale sin título ni descripción. Para moda, que vive de compartir, eso es pérdida directa.

### P0-7. El facetado de precio se rompe en locales con coma decimal, y bloquea el envío sin JS

**Evidencia,** cuatro call sites idénticos (`main-collection.liquid:114,115,130,131` y `main-search.liquid:143,144,157,158`):

```liquid
max="{{ filter.range_max | money_without_currency | replace: ',', '' }}"
{% if filter.min_value.value != nil %}value="{{ filter.min_value.value | money_without_currency | replace: ',', '' }}"{% endif %}
```

En una tienda con formato `{{amount_with_comma_separator}}` (de, es, it, nl, pt-BR), `123456` centavos renderiza `1.234,56`. Quitar solo la coma da **`1.23456`**. Tres consecuencias que se acumulan:

1. `max="1.23456"` hace que el navegador rechace cualquier valor sobre ~1.23 en una colección cuyo techo real es 1 234,56.
2. `value="1.23456"` reescribe silenciosamente el filtro del shopper tres órdenes de magnitud al paginar o recargar.
3. **No hay atributo `step` en ninguno de los cuatro inputs.** `type="number"` asume `step="1"`, así que `1.23456` no es un valor válido: el input queda `:invalid` y la validación nativa **bloquea por completo el submit sin JS.**

Los revisores prueban en más de una moneda. Y el propio requisito exige filtrado por precio funcional.

Detalle a favor: en moneda de cero decimales (JPY, KRW) esto **no** se rompe, porque `100000` renderiza `1,000` y queda `1000`, que es el valor mayor correcto. Lo aclaro para no inflar el hallazgo.

### P0-8. HTML inválido por atributos sin escapar, en tres lugares con datos del merchant

**Requisito:** "Valid HTML required".

**(a) El `value` del checkbox de facetado.** `main-collection.liquid:90` y `main-search.liquid:122`:

```liquid
name="{{ value.param_name }}"
value="{{ value.value }}"
```

mientras el label hermano, cuatro líneas abajo, **sí** escapa (`{{ value.label | escape }}`). O sea, es una inconsistencia dentro del mismo elemento, no una política. `value.value` es dato del merchant: un product type `6" Stovetop`, un vendor `Bob's "Best"`, una talla `12" x 18"`. Cualquier `"` cierra el atributo antes de tiempo. Esto no rompe solo el markup, **rompe el filtrado.**

**(b) El `aria-label` de remover del carrito,** en las dos vistas:

```liquid
sections/cart-drawer.liquid:214
  aria-label="{{ 'sections.cart.remove_item' | t: title: item.title }}"
sections/main-cart-items.liquid:121
  <a href="{{ item.url_to_remove }}" aria-label="{{ 'sections.cart.remove_item' | t: title: item.title }}">
```

Sin `| escape`. Un producto llamado `Anillo 5" Oro` rompe el atributo en la página de carrito, que es exactamente donde un revisor mira.

**(c) URL del merchant sin escapar en `href`.** `main-collection.liquid:255`: `href="{{ block.settings.link_url }}"`. Es la única de las URLs sin escapar que el merchant tipea a mano (las demás son generadas por Shopify). Nótese que `main-search.liquid:44,47,50,53,180` sí escapan sus hrefs.

Adicional de menor riesgo pero mismo origen: diez `aria-label` y `placeholder` que interpolan `| t` sin `| escape` (listados en la sección 4.6). Seguros en `en.default.json`, pero la primera traducción a español o francés con un apóstrofo tipográfico los rompe.

### P0-9. Riesgo sobre el mínimo de 90 en accesibilidad de Lighthouse

**Requisito:** "Accessibility: Minimum average score of 90" promediado en home, producto y colección.

Cuatro fallos de contraste sobre contenido **activo**, no deshabilitado, medidos contra la paleta por defecto (`#1c1917` sobre `#faf8f5`):

| Ubicación | Regla | Ratio | Nota |
| --- | --- | --- | --- |
| `base.css:3447-3451` `.complete-the-look__item:not([data-selected])` a `opacity: 0.55` | 1.4.3 | **3.84:1** | Atenúa `__item-details` (que contiene un `<a>` real al producto) y `__item-price`. El shopper **necesita leer nombre y precio para decidir si lo marca**. No marcado no es deshabilitado, así que no aplica la exención. El branch `[data-product-page-fallback]` en 3464-3468 restaura `opacity: 1`, lo que confirma que el dim es un estado visual deliberado. |
| `base.css:908-910` y `3509-3511` `.button[aria-busy='true'] [data-add-to-cart-text]` a `opacity: 0.55` | 1.4.3 | **2.74:1** | Blanco sobre `--color-button`. Es la etiqueta del add-to-cart primario durante el submit. |
| `base.css:1942-1944` `.cart-cross-sell__button[aria-busy='true']` a `opacity: 0.45` | 1.4.3 | **2.86:1** | `aria-busy` no es `aria-disabled`. |
| `--color-border: #e5dfd5` como único límite de controles | 1.4.11 (no-text, pide 3:1) | **1.25:1** | Afecta `input, select, textarea` (`base.css:803-813`), `.variant-picker__label` (1067-1081), `.selling-plans__choice`, `.collection-grid-switcher__button`. Un campo de texto con fill igual al fondo y borde a 1.25:1 no tiene borde visible. `--color-border-hairline` a 1.16:1 es peor: un swatch crema se vuelve invisible. |

**Agravante de composición:** los dos de `aria-busy` empeoran con el reduced motion. `base.css:916-918` `.icon--spinner` es la única de las seis animaciones que **no** está gated detrás de `no-preference`, así que depende del kill switch universal y se congela. Con el spinner congelado, ese dim a 2.74:1 queda como **única** señal de "estoy procesando". Un usuario con reduced motion presiona Añadir y no recibe feedback perceptible.

Y un multiplicador latente: `--color-foreground-muted` ya es una mezcla al 72% dentro de los wrappers de scheme (`base.css:64`). Aplicar `opacity: 0.76` encima da alfa efectivo 0.547, o sea **3.81:1**. Hoy no hay defecto confirmado porque los sitios que combinan ambos heredan `--color-foreground`, pero la trampa está armada. Peor aún: cualquiera de estos ratios es un **default**. Un merchant que elija un foreground gris medio empuja el dim de 0.55 hacia 2:1 y tumba `--color-foreground-muted` (hoy 6.42:1, aplicado a unas 30 reglas de texto de 11 a 13px) por debajo de 4.5:1. No hay piso de protección en ninguna parte.

---

## 4. P1: fricciones de UX y de comerciante

### 4.1 PDP

**P1-1. La galería es un apilado vertical sin navegación.** `main-product.liquid:20-45` recorre `product.media` y emite un `<figure>` por pieza. No hay thumbnails, ni slider, ni zoom, ni lightbox, ni contador. En un producto de moda con 10 imágenes, el móvil se convierte en scroll infinito antes de llegar al precio. Es la brecha más visible contra Prestige e Impact, y es un juicio de $380 que el revisor hace en tres segundos.

**P1-2. El variant picker deshabilita valores y crea callejones sin salida.** `main-product.liquid:118-125`:

```liquid
aria-disabled="{% if value.available %}false{% else %}true{% endif %}"
{% unless value.available %}disabled{% endunless %}
```

`option.values[].available` es true si **algún** variant con ese valor está disponible. Al poner `disabled`, el valor sale del orden de tabulación y no se puede seleccionar. El comportamiento estándar de Shopify (y de Dawn) es mantenerlos seleccionables con tratamiento visual de no disponible, precisamente para que el shopper pueda navegar combinaciones. Además `disabled` más `aria-disabled` es redundante: `disabled` ya lo saca del árbol de accesibilidad.

**P1-3. Los bloques del PDP son pocos para el tier.** Hay `vendor, title, price, variant_picker, size_guide, quantity, buy_buttons, description, @app`. Faltan, y el requisito dice "blocks for all or most elements on the main section of the product page": **bloque colapsable (materiales, cuidado, envío y devoluciones)**, que en moda no es opcional, más share, text, image, icon-with-text, rating, inventory status y **custom liquid block** (el requisito menciona explícitamente "Include Custom Liquid blocks as app insertion points"; existe la sección `custom-liquid.liquid`, que cubre el requisito de sección, pero no el bloque).

**P1-4. La guía de tallas no permite hacer una tabla.** Los dos campos de medidas son `richtext`:

```json
{ "type": "richtext", "id": "size_table_cm", "label": "Measurements in centimeters",
  "default": "<p>XS: 84 cm / S: 88 cm / M: 92 cm / L: 96 cm</p>" }
```

`richtext` en Shopify admite `p`, `strong`, `em`, `a`, `ul`, `ol`. **No admite `table`.** O sea: el merchant de moda literalmente no puede construir una tabla de medidas en el campo diseñado para tablas de medidas, y el default le enseña a poner todo en un párrafo con slashes. Mientras tanto el CSS **sí** estiliza tablas y les pone `min-width: 32rem` (`base.css:1234-1237`), o sea 512px, dentro de un pozo de ~328px en móvil, con `overflow-x: auto` y **cero** afford de scroll: no hay `scrollbar-width`, no hay `::-webkit-scrollbar`, no hay fade de borde, no hay `scroll-snap`. El 36% de la tabla queda detrás de un scroll invisible, y es justo el dato por el que el shopper abrió el modal. La salida es un `page` picker (que ya existe) o un bloque repetible fila por fila.

**P1-5. El template de producto por defecto no incluye la guía de tallas.** `templates/product.json` tiene `block_order: [vendor, title, price, variant_picker, quantity, buy_buttons, description]`. Sin `size_guide` y sin `@app`. La feature diferenciadora del tema para moda está apagada de fábrica y el merchant tiene que descubrir que existe.

**P1-6. `pickup_hours_note` está en el lugar equivocado.** Es un `textarea` en los settings de `main-product`, o sea un texto global que solo se edita entrando a la plantilla de producto. Pertenece a theme settings.

**P1-7. `price.liquid`: el branch de precio variable nunca muestra comparativo ni badge de oferta.** Líneas 48-50: si `price_varies`, solo emite "From $X". Un producto con precios distintos por variante y algunas en oferta no muestra ni tachado ni badge. El requisito pide "comparison pricing" y "Discount display support".

**P1-8. El `<picture>` del hero puede generar CLS en móvil.** `hero-editorial.liquid:35-45` emite un `<source media="(max-width: 47.99rem)">` con `srcset` y `sizes` pero **sin `width` ni `height`**. El `<img>` de respaldo sí los trae vía `image_tag`, pero con las dimensiones de la imagen *desktop*. Si el merchant sube un desktop 16:9 y un móvil 4:5, el espacio reservado es el equivocado y hay salto. Impacta el mínimo de 60 en performance.

### 4.2 Carrito y conversión

**P1-9. El cross-sell del drawer añade la primera variante disponible con un clic.** `cart-drawer.liquid` emite `data-variant-id="{{ recommendation_variant.id }}"` y `theme.js:1264-1281` postea `{ id: variantId, quantity: 1 }`. Si el merchant elige una prenda con tallas, el shopper recibe silenciosamente "XS / Negro". Ironía: `complete-the-look` **sí** maneja variantes y tiene estado `requires_plan_option`. La lógica existe en el tema, solo no está en el drawer. Para moda esto genera devoluciones y tickets.

**P1-10. La barra de recompensas promete dos cosas que el tema no puede entregar, y no se lo dice al merchant.** El schema es esto y nada más:

```json
{ "type": "number", "id": "free_shipping_threshold", "label": "Free shipping threshold", "default": 150 },
{ "type": "number", "id": "atelier_gift_threshold",  "label": "Atelier gift threshold",  "default": 250 }
```

Sin un solo `info`. El merchant activa el toggle (que viene en `true` por defecto), ve la barra prometiendo "Complimentary Shipping" y "Atelier Gift", y no tiene forma de saber que debe configurar aparte una tarifa de envío a $150 y un descuento automático de regalo a $250. Si no lo hace, la vitrina promete lo que el checkout no cumple. Eso es exactamente el tipo de cosa que un revisor marca como engañoso, y el tipo de cosa por la que un merchant pide reembolso. Mínimo: `info` explícito en ambos settings más una nota en la documentación.

**P1-11. El `150` vive hardcodeado en tres lugares sin fuente única de verdad.**

```
sections/announcement-bar.liquid   "default": "Complimentary shipping on orders over $150"
sections/header-group.json          "text": "Complimentary shipping on orders over $150"
sections/cart-drawer.liquid         free_shipping_threshold default 150
```

Más el `250` del regalo. El merchant cambia el umbral en el drawer y el announcement bar sigue diciendo $150 para siempre. Y ese `$` hardcodeado se muestra igual en Alemania.

**P1-12. La barra de recompensas se renderiza sobre el carrito vacío.** En `cart-drawer.liquid` el bloque `enable_tiered_progress` está **antes** del `{%- if cart.empty? -%}`. Con el carrito vacío el shopper ve "Add $150.00 for Complimentary Shipping" encima de "Your cart is currently empty." Los revisores abren el carrito vacío. Caso borde adicional: si el merchant pone los dos umbrales en 0, `rewards_progress` queda en 100 y el drawer vacío anuncia "Complimentary Shipping and Atelier Gift unlocked".

**P1-13. `response.json()` se espera antes de chequear `response.ok`.** En los cuatro puntos de escritura, por ejemplo `theme.js:1272-1274`:

```js
const result = await response.json();
if (!response.ok) throw new Error(result.description || result.message || this.dataset.errorMessage);
```

Si el servidor devuelve algo que no es JSON (un 429 con HTML, un 5xx, una página de Cloudflare), `response.json()` lanza un SyntaxError y el catch muestra al shopper `"Unexpected token '<' ..."`. Y en caída de red, `fetch` rechaza con `TypeError: Failed to fetch`, y `showError(error.message)` imprime **"Failed to fetch"** en inglés, sin traducir, en el carrito. Es el escenario exacto que un revisor produce poniendo el navegador en Offline y presionando Añadir. Arreglo: envolver el parseo en try/catch y tener un string propio de error de red.

**P1-14. `complete-the-look` formatea el total del bundle con `Intl.NumberFormat` y no con el formato de moneda del merchant.** `theme.js:1879-1888`:

```js
return new Intl.NumberFormat(document.documentElement.lang || undefined, {
  style: 'currency', currency: this.dataset.currencyCode,
}).format(cents / 100);
```

El resto del tema usa el filtro `money` de Liquid, que respeta `shop.money_format`. Un merchant con formato `1.250,00 €` sin decimales verá el total del capsule como `€1,250.00` mientras el precio de cada pieza al lado dice otra cosa. Hay que pasar `shop.money_format` al JS y formatear con eso.

**P1-15. `sections.cart.added` dice "Item added to your cart." también cuando se añade un bundle de tres piezas.** `theme.js` usa `this.dataset.addedMessage` para los tres flujos de escritura del drawer.

### 4.3 Colección y búsqueda

**P1-16. El estado vacío es uno solo para dos situaciones distintas.** `main-collection.liquid:284-289`:

```liquid
{%- if collection.products.size == 0 -%}
  <div class="collection-products__empty flow">
    <p>{{ 'collections.general.no_products' | t }}</p>
    <a href="{{ collection.url }}">{{ 'collections.filters.clear_all' | t }}</a>
  </div>
{%- endif -%}
```

No consulta `active_filter_count`. Entonces en una colección genuinamente vacía (que es lo primero que ve un revisor en una tienda de prueba) el shopper lee "No products match your selection.", que le atribuye una selección que nunca hizo, y recibe un link "Clear all" que **apunta a la página donde ya está**. Además la toolbar y el grid switcher quedan **fuera** del guard de `size > 0` (están dentro de `{% paginate %}` en la línea 161), así que una colección de cero productos muestra "0 products" y dos botones de densidad que controlan una grilla inexistente.

**P1-17. El tile de promoción se repite en cada página paginada.** El cálculo vive dentro del `{% paginate %}` y no hay ningún guard tipo `paginate.current_page == 1`. Una colección de 200 productos a 24 por página muestra la misma unidad editorial nueve veces.

**P1-18. Dos tiles de promoción colisionan en el mismo slot de fábrica.** Ambos bloques del schema traen `"position_in_grid": 4` por default y el loop interno (`main-collection.liquid:212-264`) no arbitra un tile por slot. Un merchant que agregue dos tiles sin tocar la posición obtiene los dos `<li>` en la misma iteración, y como `promotion_rendered` queda en true, esa iteración no emite producto. Nada se pierde (el slot extra lo absorbe) pero la fila queda desalineada y los tiles apilados.

**P1-19. Sin swatches de color en los facetados.** No hay un solo `swatch` ni `filter.presentation` en las dos secciones. El código de swatch **existe** en `main-product.liquid:102-127` con `value.swatch.image` y `value.swatch.color`, pero el facetado no lo alcanza. Para moda, filtrar color por lista de texto en lugar de por muestra es de tema barato. Tampoco hay `filter.operator` (AND/OR) ni `value.image`.

**P1-20. Sin chips de filtro activo removibles.** Lo único que hay es un badge numérico (`main-collection.liquid:51-55`) y un "Clear all". Para quitar **un** filtro el shopper tiene que destildarlo y volver a presionar Apply. Y como el badge y el link están dentro del `<form>`, no hay otra vía. Detalle extra: el count por opción es `aria-hidden="true"` (línea 95), así que un usuario de lector de pantalla no oye cuántos resultados tiene cada opción.

**P1-21. La búsqueda pierde el sort y el botón Apply cuando no hay filtros.** `main-search.liquid:80`:

```liquid
{%- if search.performed and search.filters.size > 0 -%}
```

abre un wrapper que cierra en 184 y que **contiene** el bloque de sort (164-175) y las acciones (177-182). O sea: ordenar resultados es imposible en las pestañas Journal y Pages por construcción, y también en cualquier tienda que no haya configurado filtros de búsqueda. Además, cambiar de pestaña descarta todo el estado de facetado y sort, porque los hrefs se reconstruyen solo con `q` + `type` + `options[prefix]` (líneas 22-26).

**P1-22. El switcher de densidad es JS-only sin fallback.** Dos `<button type="button">` con `aria-pressed`, manejados solo por `setGridView`. No hay `<noscript>` y no hay regla `.no-js` que los oculte (el CSS sí tiene reglas `.no-js` para header, lookbook, complete-the-look, pickup y password modal, pero no para este). Sin JS quedan dos toggles muertos anunciando un estado presionado que nunca cambia.

**P1-23. Los dos `case` fallan en abierto.** El de `filter.type` (`main-collection.liquid:76-136`) no tiene `else`, y el `<details>` se emite **antes** del `case`: un tipo de filtro futuro produciría un acordeón vacío, clickeable y enfocable. El de `item.object_type` (`main-search.liquid:198-248`) igual: un `?type=collection` a mano produce un `<li>` fantasma.

**P1-24. Cero line-clamp en todo el tema.** `-webkit-line-clamp` aparece **0 veces** en `base.css`. Ni `collection.title` ni `.product-card__title` están truncados ni clampeados, y `.product-grid` no tiene alineación de filas (es un `repeat(2, minmax(0,1fr))` plano). Con un título de 100+ caracteres al lado de uno de tres palabras, los precios y los botones de quick add quedan desalineados a lo largo de toda la fila. No hay overflow horizontal (lo salva `body { overflow-wrap: anywhere }` en `base.css:86`), pero sí hay desorden visual, y el revisor prueba justamente con títulos largos.

### 4.4 Merchandising editorial

**P1-25. El lookbook tiene dos imágenes y un solo juego de coordenadas.** El schema ofrece `image_desktop` e `image_mobile`, y los hotspots se posicionan con `horizontal_position` / `vertical_position` en porcentaje, **una sola vez**. Si el merchant sube un desktop panorámico y un móvil vertical (que es lo natural), los mismos porcentajes caen en lugares distintos de cada encuadre y los hotspots del móvil apuntan al aire. O se agregan posiciones móviles por bloque, o el `info` debe advertir que ambas imágenes necesitan la misma composición y encuadre.

**P1-26. `.lookbook-popover` pinta por encima del drawer de navegación móvil,** y es `position: fixed` sin inset en CSS. `base.css:3205-3221`: z-index 120 contra los 100 de `.drawer-overlay` (665-670). Si el popover está abierto y el shopper abre el menú, el popover queda encima del menú. Es la única inversión de toda la pila (que por lo demás está bien ordenada: skip-link 1000, pickup 230, size guide 220, cart 200, popover 120, nav 100, password 90, sticky bar 40, announcement 21, header 20). Y como declara `position: fixed` sin `top`/`left`/`inset`, su colocación depende por completo de estilos inline del JS: si el JS carga pero falla, el elemento aterriza en su posición estática, potencialmente fuera de pantalla. La ruta sin JS sí está cubierta (`base.css:3519` oculta `.lookbook__hotspots` en `.no-js`), la ruta "JS cargado y con error" no.

**P1-27. El homepage por defecto no muestra ninguna de las dos secciones estrella, y trae tres huecos.** `templates/index.json` es `[hero_editorial, marquee, curated_showcase, brand_manifesto, bento_discovery]`. Sin lookbook. Sin complete-the-look. Y de lo que sí trae:

- `curated_showcase`: solo el primer tab tiene `"collection": "all"`. Los tabs 2 y 3 ("Permanent collection", "Objects") **no tienen colección asignada**.
- `bento_discovery`: el bloque `bento_product` tiene `"settings": {}`, o sea card de producto sin producto.
- `hero_editorial.button_secondary_url` y `brand_manifesto.button_url` apuntan a `"/"`.

Traducción: la primera pantalla que ve un revisor tiene dos pestañas vacías, una tarjeta vacía y dos botones que van a ninguna parte, y nunca ve el lookbook interactivo ni el capsule bundle. Esto se arregla en el mismo movimiento que la demo store de Fase 4, pero hay que arreglarlo.

**P1-28. `hero-editorial` emite `<h1>` y se puede agregar en cualquier plantilla.** Línea 22, y el schema solo declara `disabled_on: { groups: [header, footer] }`. Si el merchant lo pone en una plantilla de producto, colección o página, hay dos `<h1>`. Necesita o un setting de nivel de encabezado, o `enabled_on` limitado a `index`, o bajar a `<h2>` con clase de display.

**P1-29. No hay sección de producto destacado ni de colección destacada.** El requisito nombra explícitamente la "featured product section" como punto donde deben soportarse bloques `@app`. Hoy `@app` existe solo en `main-product`. Y para un merchant, no poder poner un producto destacado en el home es una ausencia notoria a este precio.

### 4.5 Ergonomía del Theme Editor

**P1-30. No existe espaciado por sección.** Ninguna sección tiene padding superior/inferior propio. Todo hereda `--section-spacing` global. Es el primer control que todo merchant busca, y Dawn, Prestige e Impact lo tienen. Es, de lejos, el setting faltante de mayor impacto.

**P1-31. El hero no tiene los controles que el brief pedía revisar.** La directiva pregunta por alineaciones, opacidad de máscaras y ratios de aspecto. Respuesta concreta: `hero-editorial` **no tiene ninguno de los tres**. No hay opacidad de overlay, no hay altura ni ratio, no hay posición ni alineación de texto, no hay video, no hay superposición. Solo `layout_split` con dos valores. Ver el veredicto de la sección 1.

**P1-32. `settings_schema.json` no tiene ningún ajuste de product card.** Ratio de imagen (hoy `aspect-ratio: 4/5` hardcodeado en `base.css:1456`), comportamiento de hover, alineación de texto, badges, densidad. El product card es el componente más repetido del storefront y su apariencia solo se cambia editando CSS. Tampoco hay ajustes de movimiento (reveal on scroll), ni de tracking o `text-transform` tipográfico, ni `currency_code_enabled`.

**P1-33. Solo dos color schemes.** El `color_scheme_group` está bien definido (ocho colores por scheme, con `role` completo), pero `settings_data.json` solo trae `scheme-1` y `scheme-2`. Dawn trae cinco. Con dos, un merchant no puede diferenciar hero, manifesto y footer sin repetir.

**P1-34. Los labels de schema están traducidos a medias.** `settings_schema.json`, `header.liquid`, `footer.liquid` y `custom-liquid.liquid` usan claves `t:sections.*`. **Todas** las demás secciones hardcodean inglés. Y dentro del propio `settings_schema.json` convive lo uno con lo otro:

```json
{ "type": "checkbox", "id": "show_cart_count", "label": "t:settings_schema.cart.settings.show_cart_count.label" },
{ "type": "select",   "id": "cart_type",       "label": "Cart type", "options": [ { "label": "Drawer" }, ... ] },
{ "type": "checkbox", "id": "show_cart_note",  "label": "Show cart note" }
```

Existe `locales/en.default.schema.json`. O se completa o se elimina, pero medio camino es lo peor de las dos opciones.

**P1-35. Vocabulario de developer en la UI del comerciante.** El requisito pide terminología de Shopify y lenguaje merchant-friendly. Casos concretos:

| Actual | Problema | Propuesta |
| --- | --- | --- |
| "Atelier gift threshold" | "Atelier" es vocabulario interno del tema. Un sastre en Múnich no sabe qué es | "Gift threshold" con `info` explicando que requiere un descuento automático |
| "Cross-sell heading" | Jerga de industria | "Complementary products heading" |
| "Preferred popover position" | "Popover" es término de developer | "Product card position" |
| "Recommendation intent" | Nombre de parámetro de API | "Recommendation type" |
| "Fewer columns" / "More columns" | Vago | "Two per row" / "Four per row" |
| "Loop duration" en marquee | Menor número igual más rápido, sin explicación | Agregar `info`: "Lower values scroll faster" |

**P1-36. `intent: complementary` no muestra nada y no avisa por qué.** `product-recommendations.liquid` con `intent: complementary` renderiza vacío a menos que la app Search & Discovery esté instalada y con productos complementarios configurados. Sin `info`, el merchant lo activa, no ve nada y abre un ticket. Lo mismo aplica a "Show quick add", que solo aparece en productos de variante única (`product-card.liquid:54`): en una tienda de moda con tallas, prácticamente nunca.

**P1-37. Defaults en MAYÚSCULAS con numeración acoplada al orden de secciones.**

```
hero-editorial    "THE EDIT / COUTURE 01"
curated-showcase  "CURATED EDIT / 02"
brand-manifesto   "THE HAND AND THE MATERIAL / 03"   y   "MACRO STUDY / MATERIAL 07"
bento-discovery   "DISCOVER BY FORM / 04"   +   "[01] FEATURED COLLECTION"   "[02] MATERIAL STUDY"
marquee           "FORM / MATERIAL / MOVEMENT"
```

Dos problemas. Uno: `.eyebrow` ya aplica `text-transform: uppercase` en `base.css:308`, así que el texto se pone en mayúsculas **dos veces**, es redundante, y el merchant que quiera sentence case no puede (el CSS lo fuerza). Dos: los números `/ 01` a `/ 04` están acoplados al orden de las secciones. El merchant reordena o borra una, y la numeración queda mintiendo, sin que ningún `info` le avise que esos números los mantiene él a mano.

**P1-38. Los blocks del bento no tienen `limit` por tipo.** `max_blocks: 4` global, pero `card_featured`, `card_editorial` y `card_product` no tienen límite propio. Un merchant puede poner cuatro `card_featured` y el bento pierde toda su jerarquía visual.

**P1-39. El footer no tiene bloques.** Un `link_list`, la marca, y links sociales. No hay columnas de links, no hay texto, no hay imagen, y sobre todo **no hay iconos de método de pago** (`shop.enabled_payment_types` / `payment_type_svg_tag` no aparecen en el tema). Para una tienda de lujo, mostrar los métodos de pago en el footer es señal de confianza básica. Todos los temas premium los tienen.

**P1-40. El header no tiene opciones de layout.** Sin sticky (confirmado: `.site-header` es `position: relative`, no existe header sticky en el tema), sin posición de logo, sin transparente sobre el hero, sin buscador inline, sin mega menu con imágenes. La navegación de tres niveles funciona y cumple el requisito, pero un mega menu visual es lo que se espera en moda a este precio.

### 4.6 CSS, móvil y accesibilidad no bloqueante

**P1-41. `gap-inline` no es una propiedad CSS.** `base.css:2958` y `5169`. Ambas declaraciones las descarta el parser en silencio. La intención era `column-gap`. Efecto real: `.product-grid` mantiene su gap móvil de 12px en tablet en lugar de 16px, y `.search-results-grid` mantiene 16px en lugar de 32px.

**P1-42. El botón sticky de add-to-cart puede quedar cortado fuera de pantalla a 360px.** `base.css:1270-1277` y `1319-1325`: `grid-template-columns: 3rem minmax(0, 1fr) minmax(7.5rem, auto)` con `.sticky-cart-bar__submit { min-width: 7.5rem; white-space: nowrap; }` más uppercase y `letter-spacing: 0.06em`. La aritmética a 360px deja 248px para el track `1fr` y el track `auto`, y el `auto` no baja de su min-content. Una etiqueta localizada tipo `AÑADIR AL CARRITO · 189,00 €` excede eso y el botón se corta. Mismo patrón, menor alcance, en `.cart-cross-sell__button` (1929-1940).

**P1-43. `.site-main:focus { outline: 0 }` le gana a `:focus-visible`.** `base.css:384-386` contra `239-242`. Gana por especificidad (0,1,1 contra 0,1,0) **y** por orden en el archivo. Un usuario de teclado que activa el skip link no recibe ninguna confirmación visual de que el foco entró a `<main>`. Es el único `outline: 0` del archivo y no tiene reemplazo.

**P1-44. El anillo de foco se recorta en contenedores de scroll.** `outline-offset: 3px` más `outline-width: 2px` extiende el anillo 5px más allá del border-box. `base.css:2102-2108` `.curated-showcase__tabs` tiene `overflow-x: auto`, así que el primer y el último tab (que son botones enfocables) pierden parte del anillo. Es un defecto en vivo, en el homepage. Y hay cinco paneles más con el mismo riesgo: por spec, `overflow-y: auto` con `overflow-x: visible` computa `overflow-x` a `auto`, así que `.drawer-panel`, `.size-guide-modal__panel`, `.cart-drawer__panel`, `.pickup-availability__drawer` y `.password-modal__panel` scrollean silenciosamente en **los dos** ejes.

Relacionado y más frágil de lo que parece: el anillo usa `var(--color-foreground)` y no `currentColor`. Sobrevive en los chips seleccionados (`.variant-picker__input:checked + label`, `.collection-grid-switcher__button[aria-pressed=true]`, `.main-blog__tag[aria-current]`), que se pintan **con** `--color-foreground`, **únicamente** porque el `outline-offset: 3px` lo empuja fuera del border-box. Quitar o poner en 0 ese offset deja sin indicador de foco a todos esos controles. Es load-bearing y no está documentado.

**P1-45. `[data-reduced-motion]` es un hook muerto.** `theme.js:2320-2330` escribe `<html data-reduced-motion="true">` en cada visitante con reduced motion, y `base.css` lo consume **cero** veces. O el atributo es vestigial y se remueve, o faltaba una regla. Dejarlo vivo invita a que una regla futura dependa accidentalmente de que el JS haya cargado.

**P1-46. Texto por debajo de 14px en 48 declaraciones,** incluyendo lugares donde duele:

- `base.css:3899` `.form-field__error` a 13px. Los mensajes de error de formulario son el texto que el usuario más necesita leer.
- `base.css:3247-3251` `.lookbook-popover__content .eyebrow` a **10px**, heredando de `.eyebrow`: mayúsculas, `letter-spacing: 0.12em`, `line-height: 1.2`, color muted a 6.42:1, dentro de un popover **sobre fotografía**, en el lookbook móvil. Los cuatro factores de riesgo a la vez.
- `base.css:4233-4240` `.main-page__caption` a 12px mayúsculas con 0.12em de tracking y **peso 400**. Todos los demás bloques uppercase con 0.12em compensan con `font-weight: 700`; este no.
- `base.css:958-968` `.badge` a 11.2px uppercase con `line-height: 1` dentro de `min-height: 1.75rem`. Riesgo de recorte de ascendentes y descendentes.

Agravante: `body` usa `calc(1rem * var(--font-body-scale))` y el merchant puede bajar `body_scale` a 90%. Ese eyebrow de 10px pasa a 9px. No hay piso.

**P1-47. Tap targets bajo 44px en tres lugares.** `.desktop-nav__submenu a` a 36px (`base.css:3042-3049`, aunque los equivalentes móviles sí están en 44, o sea es inconsistencia y no política), `.gift-card-recipient__toggle` sin ninguna dimensión declarada (`base.css:3878-3880`, computa a ~25.6px, el único control interactivo del archivo sin tamaño), y un `gap: 6px` entre chips de 44px en `.variant-picker__values` (1061-1065), que en el selector de talla, el control de mayor consecuencia del PDP, invita a errores de toque.

**P1-48. Cero `@supports` en todo el CSS,** mientras `color-mix()` define cuatro tokens **core** (`--color-surface`, `--color-surface-subtle`, `--color-foreground-muted`, `--color-border-hairline` en `base.css:62-67`) y los scrims de los cinco modales. En un navegador sin soporte, los tokens de texto fallan hacia `inherit`, que es legible y por tanto la dirección correcta, pero los scrims fallan hacia **transparente**, y eso elimina la única separación visual entre el modal y la página. Tampoco hay `@media (forced-colors: active)`: el Modo de Alto Contraste de Windows descarta `background`, `box-shadow` y `color-mix()`, o sea los cinco overlays.

**P1-49. `product-card` descarta el alt text del merchant.** Línea 25: `alt: card_product.title`, ignorando `card_image.alt`. Y la imagen secundaria, once líneas después, **sí** usa `secondary_image.alt`. Un merchant que escribe alt text apropiado en sus imágenes de producto lo pierde en las tarjetas.

**P1-50. `collection.image` como guard, `collection.featured_image` al renderizar.** `main-collection.liquid:7` contra `:34`. No son el mismo objeto: `featured_image` cae a la imagen del primer producto. El efecto neto es conservador (no se rompe nada) pero cualquier edición futura a una de las dos líneas va a sorprender.

**P1-51. Código muerto.** `sections/main-placeholder.liquid` (4.287 bytes) no está referenciado por ninguna plantilla, y todo el namespace `templates.*` de `en.default.json` (44 renglones) existe solo para él. Además `--color-sale-badge-bg`, `--color-sale-badge-text`, `--radius-card` y `--space-none` están declarados en `:root` y nunca consumidos. Es el 1 de los 56 archivos que no hace nada.

**P1-52. Estilos de impresión solo para la gift card.** `base.css:5299-5315`. Imprimir un producto, un carrito o un artículo deja en su lugar el sticky cart bar (`position: fixed`), el announcement bar, el marquee con su grupo `aria-hidden` duplicado, el skip link, los facetados y las recomendaciones. Y ningún `<details>` se expande, así que FAQs y grupos de filtro se imprimen cerrados.

**P1-53. Ids `quick-add-` duplicables.** `product-card.liquid:15` construye el id con `section.id` + `card_product.id`. En colección y búsqueda un producto no puede repetirse, pero el snippet lo comparten `curated-showcase`, `bento-discovery`, `product-recommendations`, `main-article` y `main-404`, donde el merchant **sí** puede elegir el mismo producto en dos bloques de una misma sección. Eso produce dos `<form>` con el mismo id, o sea HTML inválido.

**P1-54. Doble escape en el copyright del footer.** `footer.liquid:4` hace `assign shop_name = shop.name | escape`, y la línea 55 lo pasa a `| t:`, que vuelve a escapar los valores interpolados. Una tienda llamada "Ruiz & Co" renderiza `Ruiz &amp;amp; Co`.

**P1-55. `brand-manifesto` pierde los saltos de línea del statement.** Línea 21: `<h2>{{ section.settings.quote | escape }}</h2>` sobre un `textarea`. El merchant escribe dos líneas y obtiene una sola corrida. Falta `newline_to_br`. Y de paso: meter un párrafo completo dentro de un `<h2>` es pobre semánticamente, y la sección no tiene encabezado real.

**P1-56. Encabezados estilizados como etiqueta.** `main-404.liquid:36` y `main-article.liquid:75` usan `<h2 class="eyebrow">`. El requisito dice literalmente "Headings h1-h6 must be visually different from each other"; un h2 que se ve como un label de 12px no lo cumple.

---

## 5. P2: micro-copy, tono editorial y pulido

### 5.1 Los tres hallazgos de copy que importan de verdad

**P2-1. Hay copy merchant-facing filtrado al storefront.** `sections.complete_the_look.empty`:

> "Choose two to four products in the theme editor to build this look."

Ese string se le muestra al **shopper** si el merchant no configuró la sección. Un cliente en el sitio de una casa de moda leyendo instrucciones sobre el theme editor es un fallo de producto, no de redacción. La sección debería no renderizar nada cuando está vacía, y el aviso ir al editor con `info`. Mismo criterio para `collections.general.no_products` cuando la colección está simplemente vacía.

**P2-2. El tema dice "bag" en dos lugares y "cart" en todos los demás.**

```
products.product.add_to_cart              "Add to cart"
sections.cart.title                       "Your cart"
sections.cart.view_cart                   "View cart"
complete_the_look.add_selected.other      "Add {{ count }} pieces to bag | {{ total }}"
complete_the_look (schema description)    "...before adding it to your bag."
```

Para una casa de moda, "bag" es la palabra correcta y "cart" la genérica. Mi recomendación es la contraria a la obvia: **unificar en "cart"**, porque es la terminología de Shopify que el requisito pide y porque el drawer, el header y el checkout ya son "cart". Si se prefiere "bag", hay que cambiarlo en los 14 strings, no en dos. Lo que no puede quedar es la mezcla.

Aparte, ese `|` como separador (`"Add {{ count }} pieces to bag | {{ total }}"`) parece un artefacto de plantilla más que una decisión tipográfica. Propuesta: `"Add {{ count }} pieces · {{ total }}"`.

**P2-3. La voz editorial del tema está horneada en strings que el merchant no puede cambiar.** "essays", "Journal", "the atelier", "objects", "pieces" aparecen en claves de locale, no en settings:

```
blogs.blog.empty          "No essays have been published yet."
blogs.blog.article_count  "{{ count }} essays"
blogs.article.by_author   "Words by {{ author }}"
search.tabs.articles      "Journal"
not_found.title           "Object not found in the atelier."
list_collections.product_count  "{{ count }} pieces"
contact.form.eyebrow      "Write to the atelier"
```

Esto es un acierto de posicionamiento y a la vez una trampa. Un merchant de alta joyería lo va a amar. Un merchant de calzado que publica guías de cuidado va a odiar que sus artículos sean "essays" y su tienda "the atelier", y su única salida será editar el archivo de locale, que es exactamente lo que un merchant no técnico no hace. Recomendación concreta: subir a settings los cuatro términos de más fricción (el nombre del blog, el sustantivo de artículo, el sustantivo de producto y el nombre de la casa) y dejar el resto de la voz en los locales. La personalidad se mantiene, la trampa desaparece.

### 5.2 Propuestas de reescritura concretas

| Clave | Actual | Propuesta | Por qué |
| --- | --- | --- | --- |
| `sections.cart.shipping_remaining` | "Add {{ amount }} for Complimentary Shipping" | "{{ amount }} away from complimentary shipping" | Title Case a mitad de frase lee como nombre propio. Y el imperativo "Add" empuja; la distancia informa, que es más elegante y convierte igual |
| `sections.cart.shipping_unlocked_gift_remaining` | "Complimentary Shipping unlocked. Add {{ amount }} for an Atelier Gift" | "Complimentary shipping unlocked. {{ amount }} away from your gift." | Igual, más corto |
| `sections.cart.rewards_unlocked` | "Complimentary Shipping and Atelier Gift unlocked" | "Complimentary shipping and your gift are unlocked." | Frase completa, sentence case |
| `sections.cart.added` | "Item added to your cart." | Dos claves: `added` para uno, `added_count` pluralizada para el bundle | Hoy dice "Item added" al añadir tres piezas |
| `not_found.eyebrow` | "Error / Archive index" | "Archive index" | El slash lee como dos opciones sin resolver, o sea copy sin terminar |
| `not_found.recommendations` | "Popular pieces / Continue exploring" | "Continue exploring" | Igual |
| `collections.general.no_products` | "No products match your selection." | Partir en dos: `collections.general.empty` "This collection is being prepared." y `collections.general.no_results` "No products match these filters." | Ver P1-16 |
| `products.product.size_guide` | "Size Guide and Measurements" | "Size guide and measurements" | Y unificar con el default del bloque, que dice "Size Guide & Measurements". Dos strings para la misma cosa |
| `collections.grid.*` | `view_compact`, `view_dense`, `one_column`, `two_columns`, `four_columns` | "Two per row" / "Four per row", y borrar las otras tres | Metáforas mezcladas (compact/dense contra número de columnas), y tres claves huérfanas: el switcher solo ofrece 2 y 4 |
| `complete_the_look.selling_plan_required` | "Available from the product page with a purchase plan." | "This piece is sold by subscription. Choose your plan on its product page." | El actual no dice qué hacer |

### 5.3 Claves faltantes (las necesitará el sprint de P0)

`localization.country_label`, `localization.language_label`, `localization.update_country`, `localization.update_language` (P0-1). `newsletter.label`, `newsletter.submit`, `newsletter.success`, `newsletter.error` (P0-3). Todo el namespace `predictive_search.*` incluido `results_label`, `no_results`, `view_all` (P0-2). `sections.cart.network_error` (P1-13). `general.accessibility.error`, `loading`, `refresh_page`. `onboarding.product_title` para los placeholders.

Y a borrar: el namespace `templates.*` completo, huérfano junto con `main-placeholder.liquid`.

### 5.4 Lo que ya está bien de tono

Para que no se pierda en la lista: `"Complimentary Additions"`, `"Curated for this order"`, `"You may also consider"`, `"Complete the composition"`, `"Words by {{ author }}"`, `"Response standard: two business days"` y `"Private notes only. Unsubscribe at any time."` están en el punto exacto. Elevados sin ser incomprensibles, que es la línea difícil. El registro del tema es su mejor activo editorial y hay que protegerlo, no diluirlo.

---

## 6. Recomendaciones para los presets de Fase 4

### 6.1 Dos restricciones técnicas que hay que aceptar antes de diseñar

**Primera.** Un preset en `settings_data.json` solo puede variar settings de `settings_schema.json`. **No puede cambiar contenido de secciones ni el orden del homepage.** Eso vive en `templates/*.json` y en la demo store, no en el preset. O sea: "que cada preset se sienta como una tienda completamente distinta" se logra en dos piezas, el preset (tipografía, color, ritmo, forma) y la demo store (contenido, fotografía, catálogo), y la segunda pesa más que la primera.

**Segunda, y es la que condiciona todo.** Hoy la superficie total de diferenciación son doce perillas más los colores: `logo_width`, `default_color_scheme`, `type_heading_font`, `heading_scale`, `type_body_font`, `body_scale`, `page_width`, `page_gutter`, `section_spacing`, `button_radius`, `show_cart_count`, `cart_type`, `show_cart_note`. Con eso, tres presets van a leerse como "el mismo tema con otra fuente". Lo digo directo porque es la conclusión operativa del Pilar 5: **antes de construir los presets hay que ampliar `settings_schema.json`.**

### 6.2 Settings a agregar antes de los presets (orden de impacto)

1. **`section_padding_top` / `section_padding_bottom` por sección.** Es el P1-30 y también el mayor multiplicador de diferenciación entre presets: el ritmo vertical es lo que más separa un editorial de un catálogo.
2. **`type_heading_letter_spacing`** (range -4 a 12, paso 1, en centésimas de em) y **`type_heading_transform`** (none / uppercase). Sin esto, Studio no puede tener su tracking negativo.
3. **`type_eyebrow_transform`** y **`type_eyebrow_letter_spacing`.** Hoy `.eyebrow` es uppercase con 0.12em hardcodeado en el CSS. Studio necesita eyebrows en minúsculas con tracking 0, y eso no se puede expresar.
4. **`product_card_image_ratio`** (portrait 4:5 / square 1:1 / natural). Hoy `aspect-ratio: 4/5` está hardcodeado. Es la diferencia visual más grande entre Couture y Studio.
5. **`border_thickness`** (1 a 3px) y **`border_strength`** (que además resuelve el P0-9: hoy `--color-border` está a 1.25:1 contra el 3:1 requerido). Archive vive de reglas visibles, Couture de hairlines.
6. **`image_border_radius`** y **`card_border_radius`.** Hoy solo existe `button_radius`.
7. **`button_style`** (solid / outline / underline). Couture con outline hairline y Studio con solid near-black son dos tiendas distintas con el mismo HTML.
8. **`animation_reveal`** (none / fade / fade-up), respetando el `no-preference` que ya existe.
9. **`product_grid_gap`.** Un grid apretado lee como catálogo, uno amplio como galería.
10. **`show_vendor` global** para product cards, hoy solo por sección.

### 6.3 Los tres presets

Nota previa sobre nombres: `theme_name` es hoy `"Theme Project"` y el único preset es `"Couture"`. Como un preset debe compartir el nombre del tema, hay que resolver antes de empaquetar. Lo más limpio es que el tema se llame **Couture** y que Studio y Archive sean los otros dos, con lo que quedan tres presets, tres demo stores y el requisito de nombre cumplido con las mismas piezas. "Couture" además cumple el formato: una palabra, ocho caracteres.

#### Couture (editorial, alta costura)

El preset ancla. Debe verse como un catálogo de temporada impreso en papel grueso.

- **Tipografía:** heading `baskerville_n4` (o Playfair Display) a `heading_scale: 110`, `letter_spacing: 0`. Body `assistant_n4` a `body_scale: 100`. El contraste serif display sobre sans neutro es la firma.
- **Eyebrow:** uppercase, tracking 0.12em, peso 700. Como está hoy.
- **Layout:** `page_width: 1300`, `page_gutter: 24`, `section_spacing: 96`. Aire generoso, que es lo que comunica precio.
- **Forma:** `button_radius: 0`, `button_style: outline`, `border_thickness: 1`, `image_border_radius: 0`, ratio de card `4:5` portrait, grid gap amplio.
- **Color:** `scheme-1` crema cálido `#F7F3EA` con tinta `#1D1B18` y borde `#CAC2B5` (subir a algo como `#B8AE9E` para llegar a 3:1). `scheme-2` tinta con acento latón `#D8A85D`.
- **Detalle de firma:** el hairline. Cada divisor en 1px, el ritmo en 96px, y el scale de media a 260ms con easing lento. La quietud es el lujo.
- **Demo store:** apparel de mujer, catálogo chico (18 a 30 productos), fotografía de campaña en 4:5, un lookbook con 4 hotspots, un capsule bundle de 3 piezas.

#### Studio (minimalismo contemporáneo, sans-serif)

La tienda de diseño de producto. Debe verse como el sitio de un estudio, no de una casa de moda.

- **Tipografía:** **la misma sans para heading y body** (Assistant o Archivo), `heading_scale: 95`, `letter_spacing: -2` (o sea -0.02em, tracking negativo, que es la firma del minimalismo contemporáneo). `body_scale: 100`.
- **Eyebrow:** **minúsculas, tracking 0, peso 500.** Aquí es donde se necesita el setting nuevo; sin él Studio no se distingue de Couture.
- **Layout:** `page_width: 1600`, `page_gutter: 32`, `section_spacing: 56`. Más ancho y más apretado: densidad en lugar de aire.
- **Forma:** `button_radius: 0`, `button_style: solid` en near-black de alto contraste, `border_thickness: 1`, ratio de card `1:1` cuadrado, grid gap chico, densidad por defecto 4 columnas.
- **Color:** `scheme-1` blanco puro `#FFFFFF` sobre `#111111`, borde `#D4D4D4`, un solo acento frío. `scheme-2` negro sobre blanco, invertido literal. Cero calidez, cero grises cálidos.
- **Detalle de firma:** cero serifas en todo el sitio, encuadres cuadrados, y `font-variant-numeric: tabular-nums` en precios para que la grilla alinee columna por columna. Ese detalle tipográfico, que casi nadie hace, es lo que grita "estudio de diseño".
- **Demo store:** objetos y accesorios, catálogo mediano (40 a 60 productos), fotografía de producto sobre fondo neutro, bento discovery como sección protagonista, sin lookbook.

#### Archive (heritage, tonos tierra)

El catálogo de archivo. Debe verse como un impreso encuadernado, no como un sitio web.

- **Tipografía:** heading serif transicional o slab con más peso, `heading_scale: 115`. Body serif o sans humanista a `body_scale: 105` (un punto más grande: lo heritage se lee, no se ojea).
- **Eyebrow:** uppercase, tracking 0.08em, con numeral de índice. Es el vocabulario de catálogo.
- **Layout:** `page_width: 1200` (más angosto, como un libro), `page_gutter: 24`, `section_spacing: 72`.
- **Forma:** `button_radius: 2`, `button_style: solid`, **`border_thickness: 2`**, ratio de card `3:4` o natural (para no recortar fotografía de archivo), `image_border_radius: 0`, card enmarcada con regla visible y vendor mostrado.
- **Color:** `scheme-1` arcilla cálida `#EFE6D9` sobre marrón profundo `#2E241C`, borde `#C4B29A`, acento óxido `#8A5A3B`. `scheme-2` **oliva oscuro y no near-black**: es lo que separa heritage de minimalismo.
- **Detalle de firma:** la regla de 2px y la tarjeta enmarcada. Cada producto se ve como una entrada de catálogo, con vendor, número y regla debajo. Y `show_vendor: true` por defecto, que ningún otro preset usa.
- **Demo store:** denim, cuero o textil de herencia, catálogo chico a mediano, fotografía con grano, brand manifesto como sección protagonista, un marquee con la fecha de fundación.

### 6.4 El costo real de Fase 4 que conviene presupuestar ahora

El requisito dice "All theme presets must include at least one demo store", "Each demo store must match the primary industry and catalog size", "All demo store pages must use authentic text content. Don't use Lorem Ipsum" y "Obtain proper rights/permissions for all assets".

Tres presets significan **tres demo stores completas**, cada una con su propio catálogo, su copy auténtico y su fotografía con derechos. Eso es habitualmente lo que más se subestima en un proyecto de Theme Store, y es trabajo de contenido y licenciamiento, no de código. Vale ponerlo en el roadmap con nombre propio antes de que aparezca como sorpresa.

---

## 7. Checklist de verificación sugerido para Fase 4

Lo que un revisor va a hacer, en orden, y que conviene hacer primero en la tienda conectada:

1. Abrir la home con la demo instalada. Los tabs vacíos del curated showcase y la card sin producto del bento aparecen aquí (P1-27).
2. Abrir el carrito vacío. La barra de recompensas sobre "Your cart is currently empty" aparece aquí (P1-12).
3. Poner el navegador en Offline y presionar Añadir al carrito. "Failed to fetch" aparece aquí (P1-13).
4. Crear un producto con título de 120 caracteres y ponerlo en una colección de 6. La desalineación de precios aparece aquí (P1-24).
5. Crear un producto sin imagen, otro con imagen panorámica 21:9 y otro ultra vertical 2:5.
6. Crear una colección con 1 producto y un tile de promoción. Y otra vacía.
7. Crear un producto con un vendor que contenga `"` y filtrar por vendor. El facetado roto aparece aquí (P0-8a).
8. Cambiar la tienda a EUR con formato `1.234,56` y usar el filtro de precio. El bug de escala aparece aquí (P0-7).
9. Activar un segundo mercado y buscar el selector de moneda (P0-1).
10. Producto con 3 opciones y 40 variantes, con una combinación agotada. El callejón sin salida del variant picker aparece aquí (P1-2).
11. Producto con modelo 3D. La galería sin visor aparece aquí (P0-5).
12. Desactivar JavaScript y recorrer colección, PDP y carrito.
13. Activar reduced motion en el sistema y presionar Añadir al carrito. La falta de feedback aparece aquí (P0-9, agravante).
14. Lighthouse móvil en home, producto y colección. Los mínimos son 60 en performance y **90 en accesibilidad**.
15. axe DevTools en las mismas tres páginas.
16. Emular 360px de ancho y recorrer PDP con sticky bar, size guide y lookbook.
17. Windows High Contrast Mode: abrir el cart drawer y el size guide (P1-48).
18. Recorrer el theme editor pestaña por pestaña como si fuera la primera vez, y anotar cada label que no se entienda sin leer el código.

---

## 8. Cierre

Lo que hay acá es un tema bien construido con tres agujeros de requisito y dos decisiones de producto pendientes. Esa es una posición mucho mejor que la inversa, que es lo común: temas que cumplen todo el checklist y están mal hechos por dentro. La mejora progresiva, el manejo de foco, el tratamiento de reduced motion y la disciplina de tokens en CSS son de un nivel que no se improvisa, y no las toquen.

Lo que hay que decidir, y no es técnico: el hero y la galería de PDP. Si el objetivo es competir con Prestige en moda de lujo a $380, el hero de imagen a sangre completa con tipografía superpuesta y una galería con thumbnails y zoom no son features, son la puerta de entrada. Todo lo demás de este informe es un sprint bien dirigido.

Tres cosas antes que cualquier otra, en este orden:

1. **Localización, búsqueda predictiva y newsletter.** Sin los tres, no hay submission. Son las tres ausencias que ningún Theme Check detecta.
2. **`theme_info`.** Nombre final, autor comercial, documentación merchant-facing real y formulario de soporte. Y resolver que un preset comparta el nombre del tema.
3. **Ampliar `settings_schema.json`** (espaciado por sección, tracking y transform tipográfico, ratio de card, grosor de borde) **antes** de construir los presets. Si los presets se arman sobre la superficie actual, los tres se van a ver igual y el trabajo hay que repetirlo.

Quedo a disposición para una segunda pasada sobre cualquier hallazgo, o para auditar el sprint de corrección cuando Gemini lo defina.

Claude, Auditor UX/UI y Editorial
CLAUDE-AUDIT-001, modo READ-ONLY, 2026-09-13
