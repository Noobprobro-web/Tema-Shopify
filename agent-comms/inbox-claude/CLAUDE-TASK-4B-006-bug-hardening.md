# CLAUDE-TASK-4B-006: Hardening y Eliminación de Bugs (12 Hallazgos Adversarios)

```text
ID: CLAUDE-TASK-4B-006
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5 - Implementador Principal)
Autorizado por: Johandry / Ruiz Digital
Fecha: 2026-09-14
Estado: DISPATCHED
Tipo de cambio: Nivel 1 (Corrección local equivalente, robustez y pulido sin alteración de IDs ni defaults)
Prerrequisito: Master en df6f381 limpio, 8 compuertas estáticas en verde.
```

---

## 1. Contexto y Justificación

Las auditorías independientes y adversarias de GPT-5.6 Sol Max (`GPT-AUDIT-4B-005`) y Claude (`CLAUDE-AUDIT-4B-005`) convergieron en **12 defectos técnicos concretos** (1 P0, 5 P1 y 6 P2).
Ningún tema de $390 USD puede someterse a la Shopify Theme Store con trampas de foco `inert`, duplicación de compras por concurrencia, pérdida de notas de pedido, errores HTML sin capturar o números de filtro distorsionados.

Este sprint cierra la totalidad de los 12 hallazgos en una única pasada quirúrgica.

---

## 2. Los 12 Objetivos de Implementación Quirúrgica

### Objetivo 1 [P0] F01: Diálogos concurrentes y carrito inaccesible por `inert`
- **Archivos:** `assets/theme.js`
- **Ubicación:** Método `open(trigger = null)` en `CartDrawer` (~L1337-L1351).
- **Problema:** Si el usuario abre el carrito desde el menú móvil o tras demorarse una respuesta mientras la guía de tallas está abierta, ambos diálogos capturan foco y vuelven `inert` a los ancestros del otro. El carrito queda con botones inoperables y `Escape` cierra el diálogo incorrecto.
- **Acción:**
  1. Al inicio de `open()` en `CartDrawer`:
     ```javascript
     if (this.isOpen || !this.isConnected) return;

     let returnTarget = trigger || document.activeElement;
     const sourceMenu = returnTarget?.closest('theme-drawer[data-open]');
     if (sourceMenu) returnTarget = sourceMenu.querySelector('[data-drawer-trigger]');

     document.querySelectorAll('theme-drawer[data-open], predictive-search[data-open]')
       .forEach((dialog) => dialog.setOpen(false));
     document.querySelectorAll('size-guide-modal[data-open], pickup-availability[data-open], password-modal[data-open]')
       .forEach((dialog) => dialog.close(false));

     this.returnFocusTarget = returnTarget;
     ```
  2. En `ThemeDrawer.setOpen(open)` y `SizeGuideModal.open()`: cuando se abran (`open === true`), cerrar cualquier `cart-drawer[data-open]` activo para impedir superposiciones bidireccionales.

---

### Objetivo 2 [P1] F10 / Claude P1: Fallo de red HTML en llamadas al carrito
- **Archivos:** `assets/theme.js`
- **Ubicación:** `addItem` (~L1413), `addCrossSell` (~L1450), `changeLine` (~L1486), `addSelectedItems` (~L2124).
- **Problema:** `const result = await response.json()` se ejecuta antes de comprobar `response.ok`. Ante respuestas 500/502/503 o 429 HTML de Shopify o proxies, lanza `SyntaxError: Unexpected token '<'` visible al comprador en lugar del mensaje localizado `this.dataset.errorMessage`.
- **Acción:** En los 4 métodos, capturar el fallo de parseo JSON:
  ```javascript
  const result = await response.json().catch(() => {
    throw new Error(this.dataset.errorMessage);
  });
  if (!response.ok) {
    throw new Error(result.description || result.message || this.dataset.errorMessage);
  }
  ```

---

### Objetivo 3 [P1] F02: Compras concurrentes al alternar variantes durante carga
- **Archivos:** `assets/theme.js`
- **Ubicación:** `VariantSelects.updateForms` (~L558-L560) y `CartDrawer.addItem` (~L1396-L1421).
- **Problema:** Al pulsar "Add to cart", si la respuesta tarda y el usuario cambia de variante en la PDP, `updateForms` restaura `button.disabled = false`, permitiendo clics duplicados y compras concurrentes no deseadas.
- **Acción:**
  1. En `addItem(form, submitter)`:
     ```javascript
     if (form.dataset.cartAddPending === 'true') return;
     form.dataset.cartAddPending = 'true';
     this.clearMessages(form);
     this.setFormBusy(form, submitter, true);
     try {
       // ... fetch ...
     } finally {
       delete form.dataset.cartAddPending;
       this.setFormBusy(form, submitter, false);
       const variants = form.closest('variant-selects');
       if (variants?.isConnected) variants.updateForms(variants.currentVariant);
     }
     ```
  2. En `updateForms(variant)`:
     ```javascript
     this.querySelectorAll('[data-add-to-cart]').forEach((button) => {
       button.disabled = !purchaseOptionValid || button.form?.dataset.cartAddPending === 'true';
       // ...
     });
     ```

---

### Objetivo 4 [P1] F04: Pérdida de notas del carrito y foco tras mutación
- **Archivos:** `assets/theme.js`
- **Ubicación:** Event listeners del constructor de `CartDrawer` (~L1244) y `renderSection` (~L1530-L1548).
- **Problema:** Al cambiar cantidades o añadir cross-sells en el drawer, `renderSection` sustituye todo `[data-cart-drawer-content]`. Si el comprador había escrito una nota de pedido que aún no se enviaba a checkout, el texto se destruye silenciosamente y el foco cae a `document.body`.
- **Acción:**
  1. En `connectedCallback` de `CartDrawer`: registrar listener de input para marcar notas modificadas:
     ```javascript
     this.listen(this, 'input', (event) => {
       if (event.target.matches('textarea[name="note"]')) event.target.dataset.dirty = 'true';
     });
     ```
  2. En `renderSection(sectionHtml)`:
     ```javascript
     const previousNote = currentContent.querySelector('textarea[name="note"][data-dirty="true"]');
     const nextNote = nextContent.querySelector('textarea[name="note"]');
     if (previousNote && nextNote) {
       nextNote.value = previousNote.value;
       nextNote.dataset.dirty = 'true';
     }
     const active = document.activeElement;
     const restoreFocus = this.isOpen && (currentContent.contains(active) || active === document.body);
     
     currentContent.replaceWith(nextContent);

     if (restoreFocus) {
       const target = active?.id ? nextContent.querySelector('#' + CSS.escape(active.id)) : null;
       (target || this.querySelector('[data-cart-drawer-close]'))?.focus();
     }
     ```

---

### Objetivo 5 [P1] F03: Carrito desactualizado en `syncCart`
- **Archivos:** `assets/theme.js`
- **Ubicación:** `syncCart()` (~L1496-L1506).
- **Problema:** `syncCart` solo refrescaba si `item_count` variaba. Si un producto se intercambiaba por otro de igual cantidad o variaba el precio/propiedades en otra pestaña, el drawer mostraba datos obsoletos.
- **Acción:**
  En `syncCart()`: solicitar directamente la sección del carrito al abrir el drawer sin discriminar solo por recuento numérico:
  ```javascript
  async syncCart() {
    const sectionHtml = await this.requestSection();
    this.renderSection(sectionHtml);
  }
  ```

---

### Objetivo 6 [P1] F06: Filtros de colección y búsqueda distorsionan cifras con espacio y coma
- **Archivos:** `sections/main-collection.liquid` (~L9-12, ~L114-125) y `sections/main-search.liquid` (~L12-15, ~L145-156).
- **Problema:** La lógica basada en sustitución de cadenas de texto `money_without_currency` fallaba al encontrarse con separadores de espacio (`amount_with_space_separator`, ej. `1 250,50`), eliminando la coma decimal y multiplicando el precio x100 (`125050`).
- **Acción:** Sustituir la lógica de reemplazo de cadenas por la división matemática directa del valor monetario en centavos entre 100.0 (Shopify entrega `filter.range_max` y `filter.min_value.value` en centavos estandarizados para todas las monedas):
  ```liquid
  {%- when 'price_range' -%}
    {%- liquid
      assign range_max_value = filter.range_max | divided_by: 100.0
      assign minimum_filter_value = filter.min_value.value | divided_by: 100.0
      assign maximum_filter_value = filter.max_value.value | divided_by: 100.0
    -%}
  ```
  Eliminar el bloque `money_uses_comma_decimal` obsoleto en ambos archivos.

---

### Objetivo 7 [P2] F05 / Claude P2: Selector de cantidad sin `required` y borrado involuntario
- **Archivos:** `sections/main-product.liquid` (~L300-311), `sections/featured-product.liquid` (~L155-165), `sections/cart-drawer.liquid` (~L210), `assets/theme.js` (~L1328-1335).
- **Problema:** Inputs de cantidad sin `required` permiten enviar strings vacíos o letras (`abc`) que Shopify interpreta como cantidad 1. En el drawer, vaciar el campo para tipear una nueva cantidad disparaba `parseInt('') || 0`, borrando el producto.
- **Acción:**
  1. Añadir el atributo `required` a los inputs de cantidad en `main-product.liquid`, `featured-product.liquid` y `cart-drawer.liquid`.
  2. En `assets/theme.js` `handleDrawerChange`:
     ```javascript
     const quantityInput = event.target.closest('[data-cart-quantity]');
     if (!quantityInput) return;

     if (!quantityInput.checkValidity() && quantityInput.value !== '0') {
       quantityInput.reportValidity();
       return;
     }
     const quantity = Number(quantityInput.value);
     this.changeLine(Number(quantityInput.dataset.line), quantity).catch((error) => {
       this.showError(error.message);
     });
     ```

---

### Objetivo 8 [P2] F08: Doble escape de entidades HTML en búsqueda y traducciones
- **Archivos:** `snippets/predictive-search.liquid` (~L29), `sections/main-search.liquid` (~L47, ~L288) y demás ocurrencias de `| t ... | escape`.
- **Problema:** La traducción `results_for` o `none_title` contiene comillas tipográficas o caracteres especiales que, al recibir un segundo filtro `| escape`, se convierten en `&quot;term&quot;` visible en pantalla o atributos.
- **Acción:** Sustituir `| escape` por `| escape_once` en las salidas de traducción `| t`:
  - `snippets/predictive-search.liquid:29`: `data-view-all-template="{{ 'predictive_search.view_all' | t: terms: '[terms]' | escape_once }}"`
  - `sections/main-search.liquid:47`: `{{- 'search.header.results_for' | t: terms: search.terms | escape_once -}}`
  - `sections/main-search.liquid:288`: `<h2>{{ 'search.results.none_title' | t: terms: search.terms | escape_once }}</h2>`
  - Aplicar `escape_once` en las etiquetas de attributes donde se use salida de traducción directa con parámetros.

---

### Objetivo 9 [P2] Claude P2: Tokens de badge de oferta inactivos en CSS
- **Archivos:** `assets/base.css` (~L967-977).
- **Problema:** `--color-sale-badge-bg` y `--color-sale-badge-text` están definidos en los 15 esquemas de color pero `.badge` los ignora, pintando `currentColor` idéntico a "Sold out".
- **Acción:**
  Inmediatamente después de la regla `.badge` en `assets/base.css`:
  ```css
  .badge[data-sale-badge] {
    border-color: var(--color-sale-badge-bg);
    background-color: var(--color-sale-badge-bg);
    color: var(--color-sale-badge-text);
  }

  .badge[data-sold-out-badge] {
    border-color: currentColor;
    background-color: transparent;
    color: currentColor;
    opacity: 0.8;
  }
  ```

---

### Objetivo 10 [P2] F07 / Claude P2: Endurecimiento riguroso de `formatMoney`
- **Archivos:** `assets/theme.js` (~L58-L88, y ~L625-L630).
- **Problema:** Falta el 8vo patrón oficial de Shopify (`amount_with_period_and_space_separator`), coerción permisiva ante strings vacíos/nulos mostrando `$0.00`, y reemplazo de un único token.
- **Acción:**
  1. En `MONEY_PATTERNS`:
     ```javascript
     amount_with_period_and_space_separator: { precision: 2, thousands: ' ', decimal: '.' },
     ```
  2. En `formatMoney`:
     ```javascript
     const formatMoney = (cents, format) => {
       if (typeof cents !== 'number' && (typeof cents !== 'string' || cents.trim() === '')) return '';
       const amount = Math.round(Number(cents));
       if (!Number.isFinite(amount)) return '';

       const template = [format, window.theme?.moneyFormat, document.documentElement.dataset.moneyFormat]
         .find((candidate) => typeof candidate === 'string'
           && Object.hasOwn(MONEY_PATTERNS, candidate.match(MONEY_TOKEN)?.[1]));
       if (!template) return '';
       const token = template.match(MONEY_TOKEN)[1];
       const pattern = MONEY_PATTERNS[token];
       const decoder = document.createElement('textarea');
       decoder.innerHTML = template.replace(/</g, '&lt;');
       const textTemplate = decoder.value;
       const fixed = (amount / 100).toFixed(pattern.precision);
       const [whole, fraction] = fixed.split('.');
       const grouped = whole.replace(/(\d)(?=(\d{3})+$)/g, `$1${pattern.thousands}`);
       const value = fraction ? `${grouped}${pattern.decimal}${fraction}` : grouped;

       return textTemplate.replace(new RegExp(MONEY_TOKEN.source, 'g'), value);
     };
     ```
  3. En `updateLineTotal` (~L628):
     ```javascript
     const showTotal = priceSource?.price_cents != null
       && priceSource.price_cents !== ''
       && Number.isFinite(quantity)
       && quantity > 1
       && Number.isFinite(unitCents);
     ```

---

### Objetivo 11 [P2] F09: Atributo `info` en settings de tipo `url`
- **Archivos:** `config/settings_schema.json`, `sections/announcement-bar.liquid`, `sections/bento-discovery.liquid`, `sections/main-collection.liquid`, `sections/main-contact.liquid`, `locales/en.default.schema.json`.
- **Problema:** 10 settings de tipo URL carecen del atributo `info` exigido por la Compuerta 4 de `RULES.md` para enlaces externos.
- **Acción:**
  1. En `locales/en.default.schema.json` bajo `"sections" > "all"`:
     ```json
     "link_destination_info": "Choose a store page or paste the full HTTPS address. External pages must stay publicly accessible."
     ```
  2. Añadir `"info": "t:sections.all.link_destination_info"` a los 10 settings URL identificados:
     - `config/settings_schema.json`: `social_instagram_link`, `social_facebook_link`, `social_pinterest_link`, `social_tiktok_link`, `social_youtube_link`.
     - `sections/announcement-bar.liquid:125`: block `link`.
     - `sections/bento-discovery.liquid:214`: block `card_featured` setting `link`.
     - `sections/bento-discovery.liquid:259`: block `card_editorial` setting `link`.
     - `sections/main-collection.liquid:466`: block `promotion_tile` setting `link_url`.
     - `sections/main-contact.liquid:307`: block `service_detail` setting `link`.

---

### Objetivo 12 [P2] Claude P2: rAF huérfanos en Theme Editor
- **Archivos:** `assets/theme.js` (~L2312-2316, ~L2359, ~L2434).
- **Problema:** Timers y rAF sobrevivían al desmontaje de sección en el editor de temas, dejando timeouts en bucle o el atributo `data-modal-open` colgado en `body`.
- **Acción:**
  1. En `AnnouncementBar` (`focusout` ~L2312):
     ```javascript
     requestAnimationFrame(() => {
       if (!this.isConnected || this.contains(document.activeElement)) return;
       this.interactionPaused = false;
       this.schedule();
     });
     ```
  2. En `AnnouncementBar.schedule()` (~L2359):
     ```javascript
     schedule() {
       if (!this.isConnected) return;
       // ... resto intacto
     }
     ```
  3. En `PasswordModal.connectedCallback` (~L2434):
     ```javascript
     requestAnimationFrame(() => {
       if (this.isConnected) this.open(this.passwordInput);
     });
     ```

---

## 3. Protocolo de Verificación Obligatorio

Claude debe ejecutar y pegar en su entrega la salida limpia de:
1. `npm run gates:static`: Los 8 checks deben pasar con código 0.
   - `gates:json` (0 errores)
   - `gates:hooks` (0 contratos rotos)
   - `gates:sanity` (sandbox OK)
   - `gates:locales` (0 sin resolver en storefront y schema)
   - `gates:ledger` (53 filas coherentes)
   - `gates:theme-check` (74 archivos inspeccionados, 0 ofensas)
   - `gates:syntax` (node --check assets/theme.js código 0)
   - `gates:package` (empaque limpio de Sartorial-1.0.0.zip)
2. `npx playwright test tests/pdp-line-total.spec.mjs`: Tests existentes sin regresión.

---

## 4. Formato de Entrega Requerido

Entrega en `agent-comms/outbox-claude/CLAUDE-IMPL-4B-006-bug-hardening.md` cumpliendo el encabezado estricto de `agent-comms/RULES.md`:
- ID: `CLAUDE-IMPL-4B-006`
- Estado: `ENTREGADO`
- Decisión requerida: Autorización de commit/push por parte de Gemini y Johandry.
- Lista de archivos tocados con líneas exactas.
- Resultados de verificación con outputs de terminal pegados.
- NO hacer commit ni push hasta la revisión formal de Gemini.
