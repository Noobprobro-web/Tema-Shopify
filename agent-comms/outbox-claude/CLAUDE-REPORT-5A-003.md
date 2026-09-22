# CLAUDE-REPORT-5A-003: Ola 1 unificada (GPT-AUDIT-005 + CLAUDE-AUDIT-OPUS-001)

```text
ID: CLAUDE-REPORT-5A-003 (responde a CLAUDE-DIRECTIVE-5A-003)
Estado: ENTREGADO. Sin commit ni push. Working tree listo para la auditoría de Gemini.
Base: master da4b4b5 (el código del tema es el de 3429015; da4b4b5 y d0dfc3f solo tocan docs).
Decisión requerida:
  1. Gemini: auditar el diff (23 archivos del tema, +222 -79) y autorizar commit y despliegue.
  2. Gemini: aceptar o revertir las desviaciones de Nivel 1 D1 a D9 (§3). Ninguna cambia un id.
     Los dos cambios de default (secondary_menu y enable_tiered_progress) son Nivel 2 y los
     autoriza la directiva.
  3. Johandry y Gemini: logo cuadrado o vertical en escritorio (§5, E4). Con max-height: none,
     como pide la directiva, un logo vertical con el ajuste en 140 deja la cabecera fija en 281 px.
     En móvil lo acoté (D5); en escritorio queda a decisión.
  4. Johandry: tras desplegar, el cajón deja de mostrar la barra de envío y obsequio salvo que
     se encienda a mano. Encenderla solo si el envío gratuito y el obsequio existen en checkout
     (GPT-AUDIT-005 H3).
Resumen en 5 líneas:
  1. H1 (P0): la ficha falla cerrada con plan exigido y sin asignación, desde el servidor y
     desde VariantSelects; el cajón ya no anuncia éxito si la respuesta de Shopify no trae la
     variante o el carrito fresco no tiene su línea. Medí en la tienda la respuesta de F06: 200 con {}.
  2. H2 (P0/P1): con un color agotado entero, Quick add pasa a "Agotado", queda inactivo y no
     abre el selector; con otro color vuelve.
  3. H-01: las 41 traducciones con interpolación que se escapaban dos veces usan escape_once
     (40 del audit más templates/gift_card.liquid:21), más 3 variables de t en cart-drawer.
  4. H-02, H-03, H-04, H-09: el ajuste "Logo width" funciona; secondary_menu trae main-menu y no
     se duplica; el cajón viene sin niveles y sin "Atelier Gift"; la colección vacía lo dice.
  5. H-05: "LINEA NOVE" entra a 360 y 390 px (medido en la tienda con el CSS final inyectado:
     columna de 136 y 166 px para 132 px de texto). A, B y D no bastaban a 360 px: añadí un
     hueco móvil de 4 px en la rejilla (D8).
Archivos tocados: 23 del tema (§2), este informe, agent-comms/outbox-claude/harness-5A-003/
  (nuevo) y harness-5A-001/quickbuy5a.spec.mjs (prueba B2 actualizada al nuevo comportamiento).
Desviaciones (Nivel 1 o Nivel 2): D1 a D9 de Nivel 1 (§3). Nivel 2 autorizadas por la directiva:
  default de secondary_menu y default de enable_tiered_progress.
Hallazgos extra fuera de alcance (con parche listo): E1 featured-product con el mismo estado
  inicial que H1; E2 el contador del carrito aparece aunque "Show cart count" esté apagado;
  E3 48 "| t | escape" latentes y 5 variables de t; E4 logo vertical en escritorio; E5 a 320 px
  la marca se sigue cortando; E6 prueba heredada de escala tipográfica desfasada (§5).
Verificación (comando, resultado y qué demuestra/qué no): §6. gates:static exit 0 (82 archivos,
  0 ofensas en la copia; 116 archivos, 0 ofensas con Theme Check en la carpeta de Johandry);
  384 claves en y es con paridad; arnés 5A-003 28/28 en y es (19 fallan en el árbol previo);
  arnés 5A 36/36 en y es; heredado 101/106 con los mismos 5 fallos que el árbol previo.
Lista de afirmaciones falsables numeradas: §7.
```

---

## 1. Qué cambia para el comprador y el comerciante

| Tarea | Antes | Ahora |
|---|---|---|
| T1 plan sin asignación (F06) | "Add to cart" y "Buy it now" activos; al pulsar, el cajón decía "Item added to your cart." sin línea | Botón inactivo con "This purchase option is unavailable", aviso "This option requires a subscription plan that is not available right now.", sin pago acelerado ni barra fija activa. Sin JS, igual |
| T1 respuesta 200 sin línea | Éxito anunciado | Error "This item could not be added to your cart." en el formulario, cajón cerrado |
| T2 color agotado entero | Quick add abría un selector con todas las tallas inactivas | "Sold out" / "Agotado", inactivo; con otro color vuelve "Quick add" |
| T3 doble escape | "O'Brien & Co" se leía "O&#39;Brien &amp;amp; Co" en aria-label y en 7 textos visibles | Texto real |
| T4 Logo width | 80, 140 o 240 pintaban igual (192×48 un logo ancho) | 80 → 80 px, 240 → 240 px en escritorio; en móvil hasta 3rem de alto |
| T5 secondary_menu | Sin default (requisito de Theme Store) | Default main-menu; si es el mismo que el principal o no tiene enlaces, no se pinta |
| T6 cajón | Niveles encendidos de serie; "Atelier Gift" | Apagados de serie; "Free shipping and gift unlocked" / "Envío gratuito y obsequio desbloqueados" |
| T7 cabecera móvil | "LINEA N…" a 390 px y peor a 360 | Nombre entero a 360 y 390 px; contador sobre el icono y oculto con 0 |
| T8 colección vacía | "No products match your selection." + "Clear all" sin filtros | "This collection is empty." + "Browse all products"; con filtros sigue "sin coincidencias" + "Clear all" conservando el orden |

## 2. Archivos tocados (árbol final, líneas exactas)

Diff completo: `agent-comms/outbox-claude/harness-5A-003/5A-003-theme.diff` (LF). `git diff --ignore-cr-at-eol --stat` en la carpeta de Johandry: `23 files changed, 222 insertions(+), 79 deletions(-)`.

| Archivo | +/- | Tarea | Líneas (árbol final) |
|---|---|---|---|
| `assets/theme.js` | +49 -4 | T1, T2 | `isPurchaseOptionValid` 733-742; `updateForms` aviso 788-796; `syncPicker` 1801; `syncTrigger` 1829-1838; `open` 1926; `CartDrawer.addItem` 2203-2217; `responseHasVariant` 2232-2237 |
| `sections/main-product.liquid` | +46 -19 | T1, T3 | lógica 13-26; botón 570-580; aviso 586-592; pago acelerado 595-597; barra fija 753-761; escape_once 81, 113, 148, 150, 378, 403, 704-706, 751 |
| `sections/cart-drawer.liquid` | +9 -8 | T1, T3, T6 | `data-add-failed-message` 47; escape_once 44, 240, 267, 280 y variables 100, 346, 419; default 531 |
| `snippets/product-card.liquid` | +2 -0 | T2 | `data-label-quick-add` y `data-label-sold-out` 350-351 |
| `sections/header.liquid` | +24 -5 | T4, T5, T7 | `show_secondary_menu` 5-12; menú móvil 114; `--logo-width` y `--logo-ratio` 183-192; barra de escritorio 213; contador oculto con 0 238; default 272 |
| `assets/base.css` | +32 -3 | T4, T7 | logo 650-659; cuenta 679-681; carrito y contador 694-707; bloque móvil 8013-8042 |
| `sections/main-collection.liquid` | +14 -2 | T8 | 377-393 |
| `locales/en.default.json` | +9 -5 | T1, T6, T8 | `sections.cart.add_failed` 76; recompensas 77-79; `purchase_options.plan_required` 406; `collections.general.empty` y `browse_all` 448-449 |
| `locales/es.json` | +9 -5 | igual | mismas líneas |
| `locales/en.default.schema.json` | +1 -1 | T5 | info de `secondary_menu` 371 |
| 13 archivos Liquid más | mecánico | T3 | `bento-discovery` 46, 85; `complete-the-look` 62-65, 183, 223; `curated-showcase` 92, 146; `featured-product` 63, 165, 190; `lookbook` 94; `main-article` 33; `main-blog` 57, 85, 123; `main-cart-items` 133, 156, 164; `main-faq` 70; `main-list-collections` 32; `main-placeholder` 5, 35; `snippets/gift-card-recipient` 25; `templates/gift_card` 21 |

`sections/main-search.liquid` sale como `M` en `git status` solo por CRLF, igual que antes de este sprint (`git diff --ignore-cr-at-eol` vacío). No lo toqué. `assets/theme.js` y `sections/cart-drawer.liquid` también tenían solo CRLF; al entregarlos en LF su diff contra HEAD queda en mis cambios.

### 2.1 T1: diff de theme.js (CartDrawer y VariantSelects)
```diff
     isPurchaseOptionValid(variant) {
       if (!variant?.available) return false;
-      if (!this.sellingPlans) return true;
+      // 5A-003, GPT-AUDIT-005 H1. Sin bloque de planes en la ficha (...) Falla cerrado, igual que el Liquid.
+      if (!this.sellingPlans) return !variant.requires_selling_plan;
       if (this.getPurchaseMode() === 'subscription') return Boolean(this.currentAllocation);
       return !variant.requires_selling_plan;
@@ updateForms
+      const planMissing = Boolean(
+        variant?.available
+        && variant.requires_selling_plan
+        && !(variant.selling_plan_allocations || []).length,
+      );
+      this.querySelectorAll('[data-plan-required-notice]').forEach((notice) => {
+        notice.hidden = !planMissing;
+      });
@@ CartDrawer.addItem
         await this.renderCartResponse(result, revision);
+        const requestedId = String(formData.get('id') || '');
+        const addedLine = this.findLineFor({ variant_id: requestedId });
+        const renderedHere = this.renderedRevision === revision;
+        if (!this.responseHasVariant(result, requestedId) || (renderedHere && !addedLine)) {
+          throw new Error(this.dataset.addFailedMessage || this.dataset.errorMessage);
+        }
         this.showStatus(this.dataset.addedMessage);
-        const addedLine = form.hasAttribute('data-quick-buy-form') ? this.findLineFor(result) : null;
-        this.open(submitter, addedLine);
+        this.open(submitter, form.hasAttribute('data-quick-buy-form') ? addedLine : null);
+    responseHasVariant(result, variantId) {
+      if (!variantId) return false;
+      const items = Array.isArray(result?.items) ? result.items : [result];
+      return items.some((item) => String(item?.variant_id ?? '') === variantId);
+    }
```
Por qué dos comprobaciones: la respuesta de F06 no trae `variant_id` (medido, §6.3), y el carrito fresco es la prueba de que la línea existe. Si otra mutación adelantó a esta respuesta (`renderedRevision !== revision`), el cajón no se pintó con ella y solo se exige la respuesta; así una carrera legítima no se convierte en un error falso. El error sale por el camino que ya existía (`handleAddSubmit` → `showError(message, form)`), el `finally` libera el botón y el cajón no se abre.

### 2.2 T1: main-product.liquid (estado del servidor)
```liquid
  assign plan_required_unavailable = false
  if selected_variant.requires_selling_plan and selected_variant.selling_plan_allocations.size == 0
    assign plan_required_unavailable = true
  endif
  assign can_add_to_cart = selected_variant.available
  if plan_required_unavailable
    assign can_add_to_cart = false
  endif
```
Botón y barra fija: `{% unless can_add_to_cart %}disabled{% endunless %}` y etiqueta "Sold out", "This purchase option is unavailable" o "Add to cart", las mismas que ya ponía VariantSelects. Aviso: `<p class="form-message" data-plan-required-notice>` visible solo con variante disponible y sin plan. Pago acelerado: `<div class="product-form__dynamic-checkout" hidden>` cuando no se puede comprar (D1).

### 2.3 T2: product-card y ProductCardVariants
```diff
+      this.syncTrigger(offered.some((variant) => variant.available));
+    syncTrigger(hasAvailable) {
+      if (!this.trigger) return;
+      this.trigger.disabled = !hasAvailable;
+      const label = hasAvailable ? this.trigger.dataset.labelQuickAdd : this.trigger.dataset.labelSoldOut;
+      if (label) this.trigger.textContent = label;
+    }
-      if (this.isOpen || !this.dialog) return;
+      if (this.isOpen || !this.dialog || this.trigger?.disabled) return;
```
```liquid
                data-quick-buy-trigger
+               data-label-quick-add="{{ 'products.product.quick_add' | t }}"
+               data-label-sold-out="{{ 'products.product.sold_out' | t }}"
```
El estado inicial del servidor ya era correcto: el swatch marcado es el de `selected_or_first_available_variant`, que tiene existencias cuando el modo es `picker`.

### 2.4 T4, T5 y T7: header.liquid y base.css
```liquid
  assign show_secondary_menu = false
  if section.settings.secondary_menu.links.size > 0 and section.settings.secondary_menu.handle != section.settings.menu.handle
    assign show_secondary_menu = true
  endif
  ...
  {% if settings.logo != blank %}style="--logo-width: {{ settings.logo_width }}px; --logo-ratio: {{ settings.logo.aspect_ratio | default: 1 }};"{% endif %}
  ...
  <span class="site-header__cart-count" aria-hidden="true"{% if cart.item_count == 0 %} hidden{% endif %}>{{ cart.item_count }}</span>
  ...
      "id": "secondary_menu", ... "default": "main-menu"
```
```css
.site-header__logo-image { width: var(--logo-width, 140px); max-width: 100%; height: auto; }
.site-header__account { --shopify-account-avatar-size: var(--tap-target-min); /* resto igual */ }
.site-header__cart { position: relative; }               /* fuera: padding-inline-end: 0 */
.site-header__cart-count { position: absolute; inset-block-start: var(--space-3xs); inset-inline-end: var(--space-3xs); /* resto igual */ }
@media (max-width: 47.99rem) {
  .site-header__inner { grid-template-columns: auto minmax(0, 1fr) auto; column-gap: var(--space-2xs); }
  .site-header__brand-text { font-size: clamp(1.1rem, 4.5vw, 1.5rem); }
  .site-header__logo-image { width: min(var(--logo-width, 140px), calc(3rem * var(--logo-ratio, 1))); }
}
```

### 2.5 T6 y T8
`sections/cart-drawer.liquid:531` `"default": false`. Textos:

| Clave | en | es |
|---|---|---|
| `sections.cart.shipping_remaining` | Add {{ amount }} for free shipping | Añade {{ amount }} para el envío gratuito |
| `sections.cart.shipping_unlocked_gift_remaining` | Free shipping unlocked. Add {{ amount }} for a gift | Envío gratuito desbloqueado. Añade {{ amount }} para recibir un obsequio |
| `sections.cart.rewards_unlocked` | Free shipping and gift unlocked | Envío gratuito y obsequio desbloqueados |
| `sections.cart.add_failed` (nueva) | This item could not be added to your cart. | No se pudo añadir este artículo al carrito. |
| `products.product.purchase_options.plan_required` (nueva) | This option requires a subscription plan that is not available right now. | Esta opción requiere un plan de suscripción que ahora no está disponible. |
| `collections.general.empty` (nueva) | This collection is empty. | Esta colección está vacía. |
| `collections.general.browse_all` (nueva) | Browse all products | Ver todos los productos |

```liquid
{%- if collection.products.size == 0 -%}
  <div class="collection-products__empty flow">
    {%- if active_filter_count > 0 or collection.all_products_count > 0 -%}
      <p>{{ 'collections.general.no_products' | t }}</p>
      <a href="{{ collection.url }}?sort_by={{ sort_by | url_encode }}">{{ 'collections.filters.clear_all' | t }}</a>
    {%- else -%}
      <p>{{ 'collections.general.empty' | t }}</p>
      {%- if collection.handle != 'all' -%}
        <a href="{{ routes.all_products_collection_url }}">{{ 'collections.general.browse_all' | t }}</a>
      {%- endif -%}
    {%- endif -%}
  </div>
{%- endif -%}
```

## 3. Desviaciones de Nivel 1 (reversibles, sin tocar ids)

- **D1 (T1):** el pago acelerado se pinta con `hidden` en vez de omitirse, para que VariantSelects pueda mostrarlo al pasar a una variante comprable. Queda oculto también en variantes agotadas antes de hidratar, que es lo que VariantSelects ya hacía después. La etiqueta del botón reutiliza `purchase_options.unavailable`, la misma que ya ponía el JS.
- **D2 (T1):** el error usa una clave nueva, `sections.cart.add_failed`. La genérica ("We could not update your cart. Please try again.") invita a reintentar algo que volverá a fallar.
- **D3 (T2):** `theme.strings` no existe en el tema. Las etiquetas viajan en `data-label-quick-add` y `data-label-sold-out`, como `data-label-add` y `data-label-sold-out` del modo `direct`. `open()` también se niega con el disparador inactivo.
- **D4 (T3):** `escape_once` en las 41 (la directiva lo admite). Shopify documenta que la salida de `t` ya va escapada; `escape_once` no la vuelve a escapar y sigue protegiendo el atributo si una traducción trae comillas. Son 41 y no 40 porque el barrido del audit no incluyó `templates/` (`rg` en sections, snippets y layout da 40; `templates/gift_card.liquid:21` es la 41). Apliqué lo mismo a 3 variables asignadas desde `t` con interpolación en `cart-drawer.liquid` (100, 346, 419), el mismo defecto por otro camino en un archivo de la directiva.
- **D5 (T4):**
  - La directiva pedía `section.settings.logo_width | default: settings.logo_width | default: 140`. La cabecera no tiene `logo_width` y el global ya trae default 140 (rango 80 a 240): son dos `| default:` muertos (RULES 3.4). Usé `settings.logo_width`.
  - `width: var(--logo-width); max-width: 100%` en vez de `width: min(var(--logo-width), 100%)`. Con el porcentaje dentro de `width`, la columna de la marca se mide con el tamaño natural de la foto: un PNG de 50 px con el ajuste en 240 pintó 133 px en el arnés portátil. Con `max-width` el ancho es el del ajuste.
  - `max-height: none` no se escribe porque, quitado el `max-height: 3rem`, es el valor inicial.
  - Añadí un tope solo en móvil: el ancho es el menor entre el ajuste y el que deja el logo en 3rem de alto (`--logo-ratio`). Sin él, un logo vertical con el ajuste en 140 llevaba la cabecera fija del móvil a 280 px. Con él, la cabecera móvil mide 77 px como antes y la proporción no se deforma.
- **D6 (T5):** la comparación es por `.handle` del menú. Al `info` del ajuste le añadí "Hidden when it is the same menu as the main menu." (solo texto).
- **D7 (T6):**
  - Neutralicé también `shipping_unlocked_gift_remaining` ("an Atelier Gift").
  - Alineé `shipping_remaining` ("Complimentary Shipping" pasa a "free shipping"). Si no, la misma barra diría "Complimentary Shipping" y luego "Free shipping".
- **D8 (T7):**
  - Medí en la tienda que A, B y D no bastan a 360 px: el texto necesita 132,07 px y la columna quedaba en 120. Añadí `column-gap: var(--space-2xs)` en la rejilla móvil (+16 px): la columna pasa a 136 y sobran 3,9 px.
  - B va por la variable del componente, `--shopify-account-avatar-size`: el `::part()` con `width: 44px` ya existía, pero el componente fija internamente `min-width: 50.24px` a partir de esa variable.
  - El `clamp` de la marca va dentro del bloque de menos de 48rem ("en móvil"). En escritorio se queda en 1.6rem, porque 4.5vw con tope de 1.5rem la bajaba a 24 px.
  - El contador se oculta con 0 con `hidden` desde el Liquid. CartDrawer ya lo alternaba.
- **D9 (T8):**
  - Claves en `collections.general` (`empty`, `browse_all`), donde viven las de colección. `sections.collection_template` no existe en los locales del storefront.
  - La condición usa `active_filter_count`, ya calculado arriba, y `collection.all_products_count`, que según la documentación de Shopify cuenta también lo filtrado. Así una página fuera de rango de una colección con productos no dice "vacía".
  - Sin enlace cuando la colección ya es `all`. "Clear all" conserva `sort_by`, como en `:238`.

## 4. Compuertas de RULES

1. **Requisitos (ledger):**
   - La fila 68 (planes de venta) y la fila 66 (selector y swatches) tienen hoy `cumplido`, y GPT-AUDIT-005 las contradijo. Propongo `código completo` para las dos hasta repetir F06 y F04 en la tienda con este tema desplegado. Evidencia: `main-product.liquid:13-26,570-597` y `theme.js:733-742,1801,1829-1838,2203-2217`.
   - La fila 63 cita `main-product.liquid:570` para `payment_button`; ahora es `:596`.
   - No edité el ledger (no está en la directiva).
2. **Estados degenerados:**

   | Componente | Vacío | Uno | Muchos | Largo | Faltante |
   |---|---|---|---|---|---|
   | Ficha con plan (T1) | sin grupos ni asignación: falla cerrado | 1 variante (F06): probado | 3 variantes S / M con plan / L agotada: probado | título con `'`, `&` y `"`: aria-label exacto | sin JS: servidor ya cerrado |
   | Alta (T1) | respuesta `{}` o solo `sections`: error | variante única: probado | mutaciones solapadas: solo se exige la respuesta | n/a | sin línea en carrito fresco: error |
   | Quick add (T2) | color sin tallas: inactivo | producto sin color (solo talla): no cambia | 5 colores × 6 tallas (arnés 5A): 36/36 | n/a | combinación inexistente: "Option unavailable", como antes |
   | Logo (T4) | sin logo: texto, sin variables | 3 proporciones × 2 anchos × 2 viewports | n/a | n/a | sin `aspect_ratio`: `default: 1` |
   | Menú secundario (T5) | sin enlaces: no se pinta | igual al principal: no se pinta | 3 enlaces: se pinta en escritorio y en el menú móvil | n/a | n/a |
   | Cabecera móvil (T7) | carrito 0: sin contador | 3 artículos: contador dentro de los 44 px | n/a | nombre más largo: puntos suspensivos como último recurso (E5) | cuenta de Shopify ausente: los tres iconos miden 44 |
   | Colección (T8) | sin productos: probado | n/a | filtros activos: probado | n/a | colección `all` vacía: sin enlace |
3. **Consistencia:** tokens del tema (`--space-3xs`, `--space-2xs`, `--tap-target-min`); ningún umbral nuevo. El `140px` de `var(--logo-width, 140px)` repite el default del esquema como respaldo, tal como lo escribió la directiva. Las etiquetas reutilizan claves existentes salvo las 4 nuevas.
4. **Superficie del comerciante:** en el cajón ya no hay "atelier" (prueba T6). El `info` de `secondary_menu` dice cuándo se oculta. Siguen textos de marca fuera del cajón ("Write to the atelier", "Search the atelier"): H-04 del audit, decisión de Johandry.
5. **Tienda real:** el tema no está desplegado. Medí en la tienda lo que se puede medir sin desplegar (§6.3). Tras el despliegue hay que repetir F06 y F04 en y y es, y la cabecera a 360 y 390 px.

## 5. Hallazgos extra fuera de alcance (no aplicados)

- **E1 · featured-product:** misma sección de compra que la ficha. VariantSelects ya la cierra al hidratar, pero el HTML del servidor deja el botón activo y sin aviso. Parche listo: `harness-5A-003/extra-E1-featured-product-plan.diff` (misma lógica que §2.2).
- **E2 · contador del carrito:** `CartDrawer.updateHeaderCount` crea el contador en la primera alta aunque "Show cart count" esté apagado. Parche: `extra-E2-cart-count-setting.diff` (atributo `data-cart-count-enabled` en el enlace y comprobación en el JS).
- **E3 · escapes latentes:** 48 `| t | escape` sin interpolación y 5 variables asignadas desde `t` con respaldo de texto del comerciante (`curated-showcase:56`, `main-article:29`, `main-blog:73,138`, `product-recommendations:29`). Hoy no fallan porque ningún texto de en o es lleva `& < > " '`. Parche: `extra-E3-latent-escape.diff` (53 líneas, `escape_once`).
- **E4 · logo en escritorio** (decisión, medido en el arnés):

  | Logo, ajuste 240 | Escritorio 1280 px | Móvil 390 px |
  |---|---|---|
  | Ancho | 240×60, cabecera 77 px | 166×42 |
  | Cuadrado | 240×240, cabecera 241 px | 48×48, cabecera 77 px |
  | Vertical | 240×480, cabecera 481 px | 24×48, cabecera 77 px |

  - Con el ajuste en 140 de serie, un logo vertical deja la cabecera fija de escritorio en 281 px.
  - Dawn se comporta igual, pero tiene la cabecera fija solo al subir.
  - Opciones: aplicar en escritorio el mismo tope con un alto mayor (por ejemplo, 6rem), o convertir el ajuste en "alto del logo".
- **E5 · 320 px:** el nombre se sigue cortando (necesita 132 px y hay 96; medido en la tienda). Solo lo resuelve la propuesta E del audit (llevar la cuenta al menú lateral), que es decisión de Johandry.
- **E6 · arnés heredado:** los 5 fallos de `typescale.spec.mjs` T1 ya estaban en el árbol previo. La prueba exige 64 px como máximo, y con `heading_scale: 105` el título mide 4rem × 1.05 = 67,2 px. Es un umbral de la prueba anterior al parche de escala, no del tema.

## 6. Verificación

### 6.1 Compuertas (copia en la nube, árbol final)
```text
$ npm run gates:static                                                    exit 0
  Fallos de parseo: 0 | Contratos rotos: 0
  [theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
  Claves en en.default.json: 384 hojas | Sin resolver en storefront: 0 | Sin resolver en schema: 0 | Huerfanas en storefront: 0
  Incoherencias: 0
  82 files inspected with no offenses found.
  Your local theme was packaged in Sartorial-1.0.0.zip
$ node agent-comms/outbox-claude/harness-ML-001/locale-parity.mjs .       es.json: 384 claves, 0 problemas
$ python3 agent-comms/outbox-claude/harness-LOCALE-001/liquid-literals.py .   46 archivos Liquid, 0 hallazgos
$ node --check assets/theme.js                                            ok
$ rg -n "\| *t: [^}]*\| *escape\b" --glob '*.liquid' sections snippets layout templates | wc -l    0   (antes: 41)
```
Antes del sprint, las mismas compuertas daban 380 claves y 82 archivos sin ofensas. Las 4 claves nuevas están en en y es.

### 6.2 En la carpeta de Johandry (después de entregar)
```text
md5sum -c (23 archivos, LF)                          23/23 ok
./node_modules/.bin/shopify theme check              116 files inspected with no offenses found.   exit 0
locale-parity.mjs / liquid-literals.py / node --check   384 claves 0 problemas / 0 hallazgos / ok
grep "| t: ... | escape" en sections snippets layout templates   0
git status --short (tema)                            los 23 archivos + main-search.liquid (solo CRLF, previo)
```
`npm run gates:sanity` en la carpeta de Johandry detectó las 3 clases, pero al terminar no pudo borrar su sandbox `.tmp/theme-check-sanity-65` (EPERM del puente). Pedí permiso de borrado y eliminé solo esa carpeta, que git ignora (`.gitignore:4 .tmp/`). No corrí `gates:package` allí para no sobrescribir `Sartorial-1.0.0.zip`.

### 6.3 Medido en la tienda (tema publicado sin cambios, sesión de comprador)
- **Respuesta de F06** (`qa5a-f06-subscription`, variante 51572144505075, `requires_selling_plan: true`, 0 asignaciones, 0 grupos):
  ```text
  POST /cart/add.js (FormData id, quantity)            status 200, body "{}"                     cart.js: 0 líneas
  POST /cart/add.js (+ sections=cart-drawer)            status 200, keys ["sections"]              cart.js: 0 líneas
  ```
  Demuestra la forma exacta del éxito falso. El carrito quedó en 0.
- **Cabecera con el CSS final de T7 inyectado** en `/es/collections/qa-sprint-5a`, Libre Baskerville cargada:

  | Viewport | Tamaño de letra | Texto | Columna | Resultado |
  |---|---|---|---|---|
  | 360 | 17,6 px | 132,07 px | 136 px | sin corte |
  | 390 | | 132 px | 166,4 px | sin corte |
  | 320 | | 132 px | 96 px | cortado (E5) |

  Cuenta de Shopify 44×44 (antes 50,2), carrito 44×44 (antes 54,8) y contador en (23,6; 2) dentro de la caja del carrito. Antes, a 390 px: 138 px de texto a 18,4 px en 133 de columna, cortado.

### 6.4 Arnés 5A-003 (`harness-5A-003/`, Liquid real con liquidjs, `theme.js` y `base.css` reales)
```text
SITE=site     28 passed        SITE=site-es  28 passed
SITE=site-before (árbol previo)  19 failed, 9 passed
```
En el árbol previo fallan T1a a T1e, T3a, T3b, T4 × 3, T6, T7 × 5, T8a a T8c. Pasan en los dos árboles: T1f (alta real), T4 en móvil (antes el logo era siempre de 48 px), T5 (antes el menú secundario sin default venía vacío) y los 5 axe (WCAG 2.2 AA, 0 violaciones en ficha con plan, ficha a 390 px, colección vacía, cabecera a 390 px y cajón con niveles).

La versión portátil (fotos de marcador de 1/8, sin fuentes) da 28/28 en en y es desde la carpeta entregada. Esa ejecución encontró el defecto del `min()` con porcentaje que corrige D5.

### 6.5 Arneses anteriores (renders regenerados desde el árbol final, assets enlazados al árbol probado)
```text
Arnés 5A (colección, 36 pruebas)      en 36/36   es 36/36
Arnés heredado 4B a 4F (106 pruebas)  101/106; los 5 fallos son typescale T1, idénticos en el árbol previo (E6)
```
- **Prueba B2 del arnés 5A:** documentaba el callejón sin salida que GPT marcó (abría el selector con todo inactivo). Ahora comprueba "Sold out", el disparador inactivo, que `open()` no abre y que "Quick add" vuelve con Ink. Cambio en `harness-5A-001/quickbuy5a.spec.mjs`, diff en `harness-5A-003/harness-5A-001-B2.diff`. En el árbol previo, la B2 nueva falla ("Expected: disabled, Received: enabled").
- **Prueba R01 del arnés heredado:** simulaba el alta con `{ sections }` sin `variant_id`, exactamente la forma de F06. Ahora responde como Shopify en un alta real: con `variant_id` y la línea en el cajón. Diff en `harness-5A-003/legacy-r007-fixture.diff`.
- **Corrección de método:** en la primera ejecución los renders de 5A y 4F cargaban `theme.js` y `base.css` de copias viejas (`site-en/assets` copiado el 22/09 a las 03:49 y `r4f*/assets` enlazado a otra copia de trabajo). Repetí la línea base y el árbol final con `assets/` enlazado al árbol que se prueba. Las cifras de arriba son de esa segunda pasada.

### 6.6 Comandos del arnés 5A-003 (desde `agent-comms/outbox-claude/harness-5A-003/`, con liquidjs y @playwright/test)
```text
OUT_DIR=site node render5a3.mjs
OUT_DIR=site-es LOCALE_FILE=locales/es.json LOCALE_ISO=es node render5a3.mjs
SITE=site npx playwright test -c pw.config.mjs        (CHROMIUM_PATH opcional)
SITE=site-es npx playwright test -c pw.config.mjs
```
Los `site*` generados no se entregan. Su JSON sube el conteo de Theme Check de 82 a 86 si se dejan en la carpeta.

**Qué no demuestra lo anterior:**
- liquidjs no es Shopify.
- No hubo despliegue, así que no hay Gate 5 de las 8 tareas con el tema nuevo.
- No probé un plan de venta real con asignación: no existe fixture (GPT lo pide).
- Solo Chromium.

## 7. Afirmaciones falsables

1. En la tienda, `POST /cart/add.js` con la variante 51572144505075 devuelve 200 con `{}` (o solo `sections`) y el carrito queda en 0 líneas.
2. Con este árbol, la ficha de un producto cuya variante exige plan sin asignación pinta el botón `disabled`, el texto "This purchase option is unavailable", el aviso `[data-plan-required-notice]` visible y `.product-form__dynamic-checkout[hidden]`, también sin JavaScript.
3. Al cambiar a una variante con plan exigido y sin asignación, el botón y la barra fija se desactivan y el aviso aparece; al volver a una variante normal se restauran.
4. Una respuesta 200 sin `variant_id`, o con `variant_id` pero sin la línea en el cajón pintado, muestra "This item could not be added to your cart." en el formulario y no abre el cajón ni escribe "Item added to your cart.".
5. En la tarjeta Serra Coat del arnés 5A, elegir Olive deja `[data-quick-buy-trigger]` `disabled` con el texto "Sold out" y `open()` no abre el panel; elegir Ink lo devuelve a "Quick add".
6. `rg -n "\| *t: [^}]*\| *escape\b"` sobre sections, snippets, layout y templates devuelve 0 líneas; en el árbol previo, 41.
7. Con el título `O'Brien & Co "Care" kit`, el aria-label del botón de restar cantidad es exactamente `Decrease quantity for O'Brien & Co "Care" kit`.
8. A 1280 px, un logo de proporción 4:1, 1:1 o 1:2 se pinta con 80 px de ancho con el ajuste en 80 y con 240 px con el ajuste en 240; en el árbol previo el ancho no cambiaba con el ajuste.
9. A 390 px, un logo vertical o cuadrado con el ajuste en 240 mide 48 px de alto y la cabecera no pasa de 80 px.
10. Con `secondary_menu` sin valor guardado, la cabecera no pinta `.site-header__secondary` ni `.drawer-panel__secondary`; con el menú `footer` pinta sus 3 enlaces en los dos sitios.
11. `sections/cart-drawer.liquid` declara `enable_tiered_progress` con `"default": false` y el cajón renderizado con valores de serie no contiene `.cart-rewards`; encendido y por encima del umbral, el mensaje y `aria-valuetext` son "Free shipping and gift unlocked".
12. A 360 y 390 px, en el arnés y en la tienda con el CSS inyectado, `.site-header__brand-text` no desborda (scrollWidth ≤ clientWidth), el carrito mide 44 px de ancho y, con 0 artículos, no hay contador visible.
13. A 1280 px, `.site-header__brand-text` sigue en 25,6 px.
14. Una colección sin productos y sin filtros muestra "This collection is empty." con enlace a `/collections/all`; con un filtro activo muestra "No products match your selection." y "Clear all" con `?sort_by=`; la colección `all` vacía no enlaza a sí misma.
15. `npm run gates:static` sale con 0 y Theme Check no reporta ofensas en la copia (82 archivos) ni en la carpeta de Johandry (116 archivos).
16. `es.json` tiene 384 claves y 0 problemas de paridad con `en.default.json`.
17. El arnés heredado da 101/106 tanto en el árbol previo como en el final, con los mismos 5 fallos de `typescale.spec.mjs` T1.
