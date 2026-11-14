# CLAUDE-REPORT-B-03-001: alta al carrito con respuesta perdida (RC-12 / TT-102)

```text
ID: CLAUDE-REPORT-B-03-001
Fecha: 2026-11-05
Autor: Claude (Sonnet), implementador. Directiva CLAUDE-DIRECTIVA-B-03-001 + R-D CLAUDE-REVIEW-B-03-RD-001 (C-1 a C-3).
Estado: Implementado en la copia de trabajo, SIN commit. Estado maximo sin tienda: codigo completo (D22). No cumplido.
Decision requerida: revision D11 (subagente Opus de contexto limpio). PD-8 (autorizar a Johandry la mutacion del carrito en R-B) no bloquea.
Resumen en 5 lineas:
  1. E1-E11 aplicadas desde el Markdown con anclas de cuenta 1 sobre 4e5c6d6; mandan C-1 (mayStillLand = plazo, sin respuesta o 5xx), C-2 y C-3.
  2. «try again» solo sale con HTML 4xx (429) sin aplicar; el resto sin JSON se lee en /cart.js: aplicado = exito, dudoso = Check cart.
  3. Plazo unico CART_ADD_TIMEOUT (10 s) en las tres altas; el boton ya no queda bloqueado (D4).
  4. Arnes harness-B-03-001: fix 28 escenarios, resumen fallos=0; base 4e5c6d6 resumen fallos=32 (pasan D0, D6, E3, E4, E11). Salidas deterministas.
  5. Regresion: A-01/B-02 56/56 y B-01 (escritorio y movil) fallos=0. Theme Check 0 ofensas. Opcionales O-1 a O-3 NO aplicados (la R-D los deja al coordinador).
Archivos tocados: assets/theme.js (+243/-55; ver §2), agent-comms/outbox-claude/harness-B-03-001/{cart-lost-response.mjs,salida-base.txt,salida-fix.txt}, este informe.
Desviaciones: Nivel 1. Una linea de comentario reflujada (+1 respecto al +242 de la directiva, dentro del margen de 3).
Hallazgos extra: ninguno nuevo; H-1 a H-6 de la directiva y H-RD-1 siguen como estan (sin parche).
Verificacion: ESTATICA + SINTETICA (Chromium local, servidor de carrito simulado). No demuestra el servidor real de Shopify, apps, Safari, movil real ni lectores de pantalla. Prueba de R-B pendiente de credenciales y de autorizacion expresa de Johandry para mutar el carrito (PD-8).
Afirmaciones falsables: §8.
```

## 1. Base y preflight

HEAD_INICIO = `4e5c6d6` (rama `lote-b`). La directiva se redacto sobre `a0274ce`; la R-D comprobo que `assets/theme.js`, `sections`, `locales` y `layout` son identicos entre ambos. El preflight se ejecuto sobre `git show 4e5c6d6:assets/theme.js` guardado fuera del repo (el archivo ya estaba editado cuando se pego la salida; el arbol del tema estaba limpio al empezar). Valores de C-2: `fetchCommerce(` = 3 lineas (:2595, :3199, :4167).

```text
$ git rev-parse HEAD
4e5c6d635128d3fe0ab2d7225de690e7f3f11ab6
$ git merge-base --is-ancestor 4e5c6d6 HEAD && echo DESCIENDE
DESCIENDE
$ git log --oneline 4e5c6d6..HEAD (vacio)
$ git diff --stat 4e5c6d6 HEAD -- assets/theme.js sections locales layout (vacio = base intacta)
$ git show 4e5c6d6:assets/theme.js > base-theme.js; node --check base-theme.js && echo CHECK_OK
CHECK_OK
$ grep -n "class CartDrawer ...|addItem|..." base-theme.js
2293:  class CartDrawer extends ThemeElement {
2580:    async addItem(form, submitter) {
2679:    async addCrossSell(button) {
2808:    checkCart() {
3321:    async syncCart({ reconcile = false } = {}) {
4018:  class CompleteTheLook extends ThemeElement {
4145:    async addSelectedItems() {
$ grep -n "CART_CROSS_SELL_ADD_TIMEOUT|CART_ADD_TIMEOUT|CART_RECONCILE_TIMEOUT|cartBaseline|showUnconfirmedAdd|readCartQuantities|cartSnapshotStale|classifyAdd" base-theme.js
2290:  const CART_CROSS_SELL_ADD_TIMEOUT = 10000;
2696:      const deadline = window.setTimeout(() => controller.abort(), CART_CROSS_SELL_ADD_TIMEOUT);
$ grep -n "fetchCommerce(" base-theme.js
2595:        const response = await fetchCommerce(this.dataset.cartAddUrl, {
3199:        const response = await fetchCommerce(this.dataset.cartChangeUrl, {
4167:        const response = await fetchCommerce(this.dataset.cartAddUrl, {
$ grep -n data-cart-url|... sections/cart-drawer.liquid sections/complete-the-look.liquid
sections/cart-drawer.liquid:38:  data-cart-url="{{ routes.cart_url }}"
sections/cart-drawer.liquid:39:  data-cart-add-url="{{ routes.cart_add_url }}.js"
sections/cart-drawer.liquid:49:  data-update-unconfirmed-message="{{ 'sections.cart.update_unconfirmed' | t | escape }}"
sections/cart-drawer.liquid:86:      <div class="cart-drawer__uncertain" data-cart-uncertain hidden>
sections/cart-drawer.liquid:87:        <button type="button" class="button button--secondary cart-drawer__check" data-cart-check>
sections/complete-the-look.liquid:65:  data-cart-add-url="{{ routes.cart_add_url }}.js"
sections/complete-the-look.liquid:66:  data-cart-url="{{ routes.cart_url }}"
$ grep -n update_unconfirmed|check_cart locales/en.default.json
80:      "error": "We could not update your cart. Please try again.",
101:      "update_unconfirmed": "We could not confirm the update.",
102:      "check_cart": "Check cart",
142:      "error": "We could not add this look. Review the selected options and try again."
139:    {%- if settings.cart_type == 'drawer' -%}
```

## 2. Archivos tocados con lineas exactas (tras la edicion)

```text
2291:  const CART_ADD_TIMEOUT = 10000;
2307:  const drawerQuantities = (drawer) => {
2325:  const readCartQuantities = async (cartUrl) => {
2352:  const classifyAdd = (requested, before, after, mayStillLand) => {
2402:      this.cartSnapshotStale = false;
2664:    async cartBaseline() {
2672:    async addItem(form, submitter) {
2782:    showUnconfirmedAdd(trigger = null) {
3635:      this.cartSnapshotStale = false;
4286:    async addSelectedItems() {
```

Hunks (`git diff -U0 HEAD -- assets/theme.js`): 21, todos en las 7 regiones de la directiva (constantes :2287-2362, `connectedCallback` :2401/:2441, `cartBaseline`/`addItem`/`showUnconfirmedAdd` :2660-2792, `addCrossSell` :2835, `renderSection` :3634, `addSelectedItems` :4293-4396). B-04 solo se desplaza: `handleDrawerClick` :2414 a :2494, `handleCrossSellView` :3003 a :3142, `saveNoteAndNavigate` :3020 a :3159; sin hunk dentro de ellos, de `changeLine`, `beginMutation`, `endMutation`, `syncCart` ni `checkCart` (los cuerpos de `syncCart`, `changeLine` y `handleCrossSellView` a `saveNoteAndNavigate` comparados byte a byte con la base: iguales).

## 3. Cambios de la R-D incorporados

- C-1: `const mayStillLand = timedOut || !response || response.status >= 500;` en `addItem` y `addSelectedItems`; comentario de `classifyAdd` y frase de `addItem` como indica la R-D.
- C-2: preflight con `fetchCommerce(` = 3 (arriba).
- C-3: tabla del arnes alineada (E1, E8, E9, E14, E16 con Check cart; R1 y R5 nuevos); criterio 6 con `fix` fallos=0 y `base` con total sin lista fija.
- PD-1 a PD-7 aplicados tal cual; PD-8 pendiente de Johandry. O-1, O-2 y O-3: no aplicados.

## 4. Criterios de aceptacion (§4.1 de la directiva)

| # | Resultado | Etiqueta |
| --- | --- | --- |
| 1 | `git diff --stat HEAD -- . ':!agent-comms'`: `assets/theme.js | 298`, `1 file changed, 243 insertions(+), 55 deletions(-)` | ESTATICO |
| 2 | 21 hunks, todos en las regiones de §2; ninguno en B-04, `changeLine`, `beginMutation`, `endMutation`, `syncCart`, `checkCart` | ESTATICO |
| 3 | `CART_CROSS_SELL_ADD_TIMEOUT`=0, `CART_ADD_TIMEOUT`=4, `fetchCommerce(`=1, `readCartQuantities(`=4, `showUnconfirmedAdd`=4, `cartSnapshotStale`=5, `cartBaseline`=5, `classifyAdd`=3 | ESTATICO |
| 4 | `node --check assets/theme.js` exit 0 | ESTATICO |
| 5 | `grep -n cartAddUrl assets/theme.js`: :2706, :2843, :4331, las tres `await fetch(this.dataset.cartAddUrl, {`, sin bucle ni reintento | ESTATICO |
| 6 | `fix`: `resumen fallos=0`; `base 4e5c6d6`: `resumen fallos=32` (pasan D0, D6, E3, E4, E11) | SINTETICO |
| 7 | E3 y E4 y E11: 0 GET; mensaje 422 intacto; `{}` da «This item could not be added to your cart.» | SINTETICO |
| 8 | Ver §5 | ESTATICO |

Que demuestran: el mecanismo con el `theme.js` real y las formas de respuesta de Shopify. Que no: el servidor real, el orden de aplicacion, apps, editor de temas, movil real, lectores de pantalla.

## 5. Comandos y salidas literales

```text
$ node --check assets/theme.js && echo CHECK_OK
CHECK_OK
$ npx --no-install shopify theme check --fail-level error
│  93 files inspected with no offenses found.                                  │
$ node scripts/theme-check-sanity.mjs   -> exit=0  ([theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.)
$ node scripts/dataset-hooks.mjs        -> exit=0
$ node scripts/json-validate.mjs        -> exit=0
$ node scripts/locale-key-inventory.mjs -> exit=0  (OK: todas las referencias estaticas resuelven contra los locales.)
$ node agent-comms/outbox-claude/harness-A-01-B-02-001/harness.mjs . fix
MODO=fix total=56 pass=56 fail=0
FALLAN: []
$ node agent-comms/outbox-claude/harness-B-01-001/drawer-breakpoint.mjs . fix a0274ce        -> resumen fallos=0 (exit 0)
$ MOBILE=1 node agent-comms/outbox-claude/harness-B-01-001/drawer-breakpoint.mjs . fix a0274ce -> resumen fallos=0 (exit 0)
$ node agent-comms/outbox-claude/harness-B-03-001/cart-lost-response.mjs . fix            -> exit 0
resultados D0=OK D1=OK D2=OK D3=OK D4=OK D5=OK D6=OK E1=OK E2=OK E3=OK E4=OK E5=OK E6=OK E7=OK E8=OK E8b=OK E9=OK E10=OK E11=OK E12=OK E13=OK E14=OK E15=OK E16=OK E17=OK E18=OK R1=OK R5=OK
resumen fallos=0
$ node agent-comms/outbox-claude/harness-B-03-001/cart-lost-response.mjs . base 4e5c6d6   -> exit 1 (esperado: reproduce el defecto)
resultados D0=OK D1=FAIL D2=FAIL D3=FAIL D4=FAIL D5=FAIL D6=OK E1=FAIL E2=FAIL E3=OK E4=OK E5=FAIL E6=FAIL E7=FAIL E8=FAIL E8b=FAIL E9=FAIL E10=FAIL E11=OK E12=FAIL E13=FAIL E14=FAIL E15=FAIL E16=FAIL E17=FAIL E18=FAIL R1=FAIL R5=FAIL
resumen fallos=32
$ node scripts/ ... ; python3 -I count-two.py (copia adaptada, solo ruta=N)
assets/theme.js=0
agent-comms/outbox-claude/harness-B-03-001/cart-lost-response.mjs=0
agent-comms/outbox-claude/harness-B-03-001/salida-fix.txt=0
agent-comms/outbox-claude/harness-B-03-001/salida-base.txt=0
```

Salidas completas del arnes: `agent-comms/outbox-claude/harness-B-03-001/salida-fix.txt` y `salida-base.txt` (dos ejecuciones consecutivas de cada modo; en `fix` identicas byte a byte; en `base` el contador intermedio de D6 depende del ritmo del control de `changeLine`, y el total (32) y el veredicto por escenario no cambian). Rutas absolutas en el arnes: `grep -n "/tmp/\|/home/"` sin salida. IDs ficticios (101, 201, 202) comprobados con el contador: 0.

## 6. Compuertas (RULES §2)

- Requisitos: ver §7 (fila propuesta, sin editar el ledger).
- Estados degenerados: vacio (D1, E1: carrito vacio), uno (D3), muchos (E18: 40 lineas, variante en 2 lineas), muy largo (la clasificacion usa ids y cantidades, no titulos; el titulo del estado sale de `/cart.js` como antes), faltante (E15/E16 sin cajon, E2/E10 con `/cart.js` ilegible). El caso «fila sin enlace ?variant= o sin campo de cantidad: `drawerQuantities` devuelve null y se usa `/cart.js`» NO tiene escenario propio; se declara por lectura del codigo.
- Consistencia: un solo plazo (`CART_ADD_TIMEOUT`); mensajes y Check cart reutilizados; misma convencion de variante que `findLineFor`. Sin Intl, moneda ni textos nuevos.
- Superficie del comerciante: no aplica (sin schema, labels, `t:` ni `info`).
- Tienda real: pendiente (§9).

## 7. Propuesta de ledger (no editado)

Fila nueva «Resiliencia del alta al carrito ante respuesta perdida (sin duplicar lineas)», fuente plan V4.1 B-03 (RC-12/TT-102/S-07), evidencia `assets/theme.js` (`classifyAdd`, `CartDrawer.addItem`, `CompleteTheLook.addSelectedItems`) y arnes `harness-B-03-001`, dueño Claude, estado maximo `codigo completo`. Nota en «Planes de Venta / Suscripciones» (`:71`): el control de `{}` (5A-003) se conserva (E11). Tras escribirla, `node scripts/ledger-verify.mjs` (hoy 60 filas, 47 cumplido).

## 8. Afirmaciones falsables

1. `git diff --stat HEAD -- . ':!agent-comms'` lista solo `assets/theme.js`, 243 insertions, 55 deletions.
2. `grep -c "mayStillLand = timedOut || !response || response.status >= 500" assets/theme.js` = 2.
3. `node agent-comms/outbox-claude/harness-B-03-001/cart-lost-response.mjs . fix` termina con `resumen fallos=0` y exit 0, en 28 escenarios incluidos E8, R1 y R5.
4. El mismo arnes con `base 4e5c6d6` termina con `resumen fallos=32` y pasan exactamente D0, D6, E3, E4 y E11.
5. Con `fix`, R5 (corte y aplicacion 400 ms despues) acaba en Check cart, 101=1 y un solo POST; R1 (429 HTML) sigue en «try again» con 1 GET y 101=0.
6. Ninguna ruta de `/cart/add.js` se reintenta sola (criterio 5); el arnes de A-01/B-02 sigue en 56/56 y el de B-01 en fallos=0.
7. Theme Check: «93 files inspected with no offenses found.»; `theme-check-sanity`, `dataset-hooks`, `json-validate` y `locale-key-inventory` terminan con exit 0.
8. El contador del literal da 0 en `assets/theme.js`, el arnes y sus dos salidas.

## 9. Pendiente de credenciales y autorizacion (R-B, no ejecutado)

Matriz de la directiva §4.4 (Sartorial, Imprint, Archive; escritorio y movil simulado; respuesta perdida real con `route.fetch()` + `abort`, planes de venta F06, reglas min/paso, producto en dos lineas, carrito con muchas lineas, carrito en pagina, teclado y lector de pantalla en el aviso, apps de transformacion). Requiere credenciales y autorizacion expresa de Johandry (PD-8) para mutar el carrito en previews no publicados. Sin resultados: no se ha probado en tienda.

## 10. Declaracion

No se abrio `.secrets`, no se usaron tiendas ni gate5, no se imprimieron variables de entorno ni el literal de contrasena, no se copio codigo de SebastianDev017/atelier, no se tocaron metafields, no se hizo git add/commit/stash/checkout/reset/push. No se toco el ledger ni B-04.

## 11. Diff completo de assets/theme.js (codigo completo)

```diff
diff --git a/assets/theme.js b/assets/theme.js
index b5dc3b8..4ee4f79 100644
--- a/assets/theme.js
+++ b/assets/theme.js
@@ -2284,11 +2284,85 @@
   }
 
   // Phase 2 (GPT-021). Cart drawer deadlines. The recommendations read is a complement:
-  // when it is late, the cards the server already rendered stay. The cross-sell add and
-  // the note save are never retried: a missed deadline leaves their result uncertain.
+  // when it is late, the cards the server already rendered stay. The adds (product form,
+  // cross-sell, complete the look) and the note save are never retried: a missed deadline
+  // leaves their result uncertain.
   const CART_RECOMMENDATIONS_TIMEOUT = 2000;
-  const CART_CROSS_SELL_ADD_TIMEOUT = 10000;
+  const CART_ADD_TIMEOUT = 10000;
   const CART_NOTE_SAVE_TIMEOUT = 3000;
+  // B-03 (RC-12, TT-102). Deadline of the /cart.js read that settles a lost add response.
+  const CART_RECONCILE_TIMEOUT = 5000;
+
+  // B-03. Quantity per variant id, summed over lines: one variant can sit on several lines
+  // (selling plans, line item properties).
+  const quantitiesByVariant = (items) => items.reduce((map, item) => {
+    const id = String(item?.variant_id ?? '');
+    if (id) map.set(id, (map.get(id) || 0) + (Number(item.quantity) || 0));
+    return map;
+  }, new Map());
+
+  // B-03. The same convention as CartDrawer.findLineFor: each line's title link carries
+  // ?variant=, and the quantity field's defaultValue is what the server rendered (a typed,
+  // unsent value does not count). null when the drawer cannot be read.
+  const drawerQuantities = (drawer) => {
+    if (!drawer?.querySelector?.('[data-cart-drawer-content]')) return null;
+    const items = [];
+    try {
+      for (const row of drawer.querySelectorAll('[data-cart-item-key]')) {
+        const href = row.querySelector('.cart-drawer-item__title a[href]')?.getAttribute('href');
+        const variantId = href ? new URL(href, window.location.origin).searchParams.get('variant') : null;
+        const quantity = Number(row.querySelector('[data-cart-quantity]')?.defaultValue);
+        if (!variantId || !Number.isInteger(quantity)) return null;
+        items.push({ variant_id: variantId, quantity });
+      }
+    } catch {
+      return null;
+    }
+    return quantitiesByVariant(items);
+  };
+
+  // B-03. GET {cart_url}.js. Never throws: null means the cart could not be read.
+  const readCartQuantities = async (cartUrl) => {
+    const controller = new AbortController();
+    const deadline = window.setTimeout(() => controller.abort(), CART_RECONCILE_TIMEOUT);
+    try {
+      const url = new URL(`${String(cartUrl || '/cart').replace(/\/$/, '')}.js`, window.location.origin);
+      const response = await fetch(url, {
+        headers: { Accept: 'application/json' },
+        cache: 'no-store',
+        signal: controller.signal,
+      });
+      if (!response.ok) return null;
+      const cart = await response.json();
+      if (!cart || !Array.isArray(cart.items)) return null;
+      return { items: cart.items, quantities: quantitiesByVariant(cart.items) };
+    } catch {
+      return null;
+    } finally {
+      window.clearTimeout(deadline);
+    }
+  };
+
+  // B-03. Settles an add whose response was lost by comparing the cart before and after.
+  // - applied: every requested variant grew by at least the requested quantity.
+  // - not_applied: none moved, and the POST could not still land later. Without any
+  //   response (network error, our own deadline) or with a 5xx page from Shopify or a
+  //   gateway, the request may still be applied after the read.
+  // - unknown: anything else, including a cart that could not be read. Never a retry prompt.
+  const classifyAdd = (requested, before, after, mayStillLand) => {
+    if (!before || !after || requested.size === 0) return 'unknown';
+    let applied = 0;
+    let untouched = 0;
+    requested.forEach((quantity, id) => {
+      if (!id) return;
+      const delta = (after.get(id) || 0) - (before.get(id) || 0);
+      if (delta >= quantity) applied += 1;
+      else if (delta === 0) untouched += 1;
+    });
+    if (applied === requested.size) return 'applied';
+    if (untouched === requested.size && !mayStillLand) return 'not_applied';
+    return 'unknown';
+  };
 
   class CartDrawer extends ThemeElement {
     connectedCallback() {
@@ -2324,6 +2398,8 @@
       this.crossSellOriginals = new WeakMap();
       this.noteVersion = 0;
       this.noteSavePending = false;
+      // B-03. The drawer HTML may no longer mirror the server (another tab, an unsettled add).
+      this.cartSnapshotStale = false;
 
       if (!this.overlay || !this.panel) return;
 
@@ -2362,6 +2438,10 @@
         event.preventDefault();
         this.close(true);
       });
+      // B-03. While the page is hidden another tab can change the cart.
+      this.listen(document, 'visibilitychange', () => {
+        if (document.visibilityState === 'hidden') this.cartSnapshotStale = true;
+      });
     }
 
     disconnectedCallback() {
@@ -2577,57 +2657,100 @@
       this.managedInertElements = [];
     }
 
+    // B-03. Cart quantities before an add. The drawer HTML is used when it is the last
+    // thing the server rendered and nothing can have moved since; otherwise /cart.js is
+    // read. The freshness test runs synchronously, so callers invoke this before
+    // beginMutation() and await the promise just before their POST.
+    async cartBaseline() {
+      const fresh = !this.cartSnapshotStale && !this.pendingMutations
+        && this.renderedRevision === this.syncRevision;
+      const fromDrawer = fresh ? drawerQuantities(this) : null;
+      if (fromDrawer) return fromDrawer;
+      return (await readCartQuantities(this.dataset.cartUrl))?.quantities || null;
+    }
+
     async addItem(form, submitter) {
       // Blocks a second submit while the first is in flight, which otherwise buys the
       // item twice. Switching variant mid-request used to re-enable the button through
       // updateForms; that path now reads this flag and leaves it disabled.
       if (form.dataset.cartAddPending === 'true') return;
       form.dataset.cartAddPending = 'true';
+      const baseline = this.cartBaseline();
       const revision = this.beginMutation();
       this.clearMessages(form);
       this.setFormBusy(form, submitter, true);
+      // B-03. Without a deadline a hung request kept the button disabled for good.
+      const controller = new AbortController();
+      let timedOut = false;
+      const deadline = window.setTimeout(() => {
+        timedOut = true;
+        controller.abort();
+      }, CART_ADD_TIMEOUT);
 
       try {
         const formData = new FormData(form);
         formData.set('sections', this.renderSectionIds().join(','));
         formData.set('sections_url', `${window.location.pathname}${window.location.search}`);
-
-        const response = await fetchCommerce(this.dataset.cartAddUrl, {
-          method: 'POST',
-          headers: {
-            Accept: 'application/json',
-            'X-Requested-With': 'XMLHttpRequest',
-          },
-          body: formData,
-        }, this.dataset.errorMessage);
-        // Shopify and upstream proxies answer 429/5xx with an HTML error page. Parsing it
-        // as JSON throws "Unexpected token '<'" straight at the shopper, so the parse
-        // failure is turned into the localized message instead. A deliberate abort keeps
-        // its own name, because callers use it to stay silent.
-        const result = await response.json().catch((error) => {
-          if (error.name === 'AbortError') throw error;
-          throw new Error(this.dataset.errorMessage);
-        });
-
-        if (!response.ok) throw new Error(result?.description || result?.message || this.dataset.errorMessage);
-
-        await this.renderCartResponse(result, revision);
-
-        // 5A-003, GPT-AUDIT-005 H1. Un 200 no prueba que la linea exista: con una variante
-        // que exige plan de venta Shopify devuelve {} (medido en la tienda con F06) y el
-        // cajon anunciaba un exito falso. El exito solo se anuncia si la respuesta trae la
-        // variante pedida y, cuando fue esta respuesta la que se pinto, si el carrito fresco
-        // tiene su linea. Si otra mutacion la adelanto, basta con la respuesta.
         const requestedId = String(formData.get('id') || '');
-        const addedLine = this.findLineFor({ variant_id: requestedId });
-        const renderedHere = this.renderedRevision === revision;
-        if (!this.responseHasVariant(result, requestedId) || (renderedHere && !addedLine)) {
-          throw new Error(this.dataset.addFailedMessage || this.dataset.errorMessage);
+        const requested = new Map([[requestedId, Math.max(1, Number(formData.get('quantity')) || 1)]]);
+        const before = await baseline;
+
+        // B-03 (RC-12, TT-102). A lost response (network error, deadline, or a body that is
+        // not JSON, such as an HTML 429/5xx page) does not prove the add failed: Shopify may
+        // have applied it. The cart is read before the shopper is told anything, so "try again"
+        // only appears when the server answered, nothing was added and the request cannot
+        // land later. A JSON answer, error or not, keeps the path below.
+        let response = null;
+        let result = null;
+        try {
+          response = await fetch(this.dataset.cartAddUrl, {
+            method: 'POST',
+            headers: {
+              Accept: 'application/json',
+              'X-Requested-With': 'XMLHttpRequest',
+            },
+            body: formData,
+            signal: controller.signal,
+          });
+          result = await response.json();
+        } catch {
+          result = null;
+        }
+        window.clearTimeout(deadline);
+
+        let reconciledItems = null;
+        if (!response || result === null || typeof result !== 'object') {
+          const after = await readCartQuantities(this.dataset.cartUrl);
+          const mayStillLand = timedOut || !response || response.status >= 500;
+          const outcome = classifyAdd(requested, before, after?.quantities, mayStillLand);
+          if (outcome === 'not_applied') throw new Error(this.dataset.errorMessage);
+          if (outcome === 'unknown') {
+            this.showUnconfirmedAdd(submitter);
+            return;
+          }
+          reconciledItems = after.items;
+          // The cart already confirms the add. A render that fails only leaves the drawer
+          // stale, and endMutation() then fetches fresh HTML.
+          await this.renderCartResponse({}, revision).catch(() => {});
+        } else {
+          if (!response.ok) throw new Error(result?.description || result?.message || this.dataset.errorMessage);
+
+          await this.renderCartResponse(result, revision);
+
+          // 5A-003, GPT-AUDIT-005 H1. Un 200 no prueba que la linea exista: con una variante
+          // que exige plan de venta Shopify devuelve {} (medido en la tienda con F06) y el
+          // cajon anunciaba un exito falso. El exito solo se anuncia si la respuesta trae la
+          // variante pedida y, cuando fue esta respuesta la que se pinto, si el carrito fresco
+          // tiene su linea. Si otra mutacion la adelanto, basta con la respuesta.
+          const renderedLine = this.findLineFor({ variant_id: requestedId });
+          const renderedHere = this.renderedRevision === revision;
+          if (!this.responseHasVariant(result, requestedId) || (renderedHere && !renderedLine)) {
+            throw new Error(this.dataset.addFailedMessage || this.dataset.errorMessage);
+          }
         }
 
-        const addedItem = Array.isArray(result.items)
-          ? result.items.find((item) => String(item.variant_id || item.id) === requestedId)
-          : result;
+        const addedItems = reconciledItems || (Array.isArray(result.items) ? result.items : [result]);
+        const addedItem = addedItems.find((item) => String(item?.variant_id ?? item?.id ?? '') === requestedId);
         const productTitle = addedItem?.product_title || addedItem?.title || '';
         const variantTitle = addedItem?.variant_title === 'Default Title'
           ? ''
@@ -2637,8 +2760,10 @@
           ? `${this.dataset.addedMessage} ${itemDescription}`
           : this.dataset.addedMessage);
         // Desde una tarjeta, el foco aterriza en la linea que se acaba de anadir.
+        const addedLine = this.findLineFor({ variant_id: requestedId });
         this.open(submitter, form.hasAttribute('data-quick-buy-form') ? addedLine : null);
       } finally {
+        window.clearTimeout(deadline);
         delete form.dataset.cartAddPending;
         this.setFormBusy(form, submitter, false);
         // Re-applies the availability state of whatever variant is selected now, which
@@ -2651,6 +2776,20 @@
       }
     }
 
+    // B-03. An add whose outcome the cart could not settle: nothing invites a retry. The
+    // drawer opens on the same notice and Check cart as an uncertain cross-sell add, and
+    // endMutation() re-reads the cart even while an option panel is in use.
+    showUnconfirmedAdd(trigger = null) {
+      this.reconcileAfterMutation = true;
+      this.cartSnapshotStale = true;
+      this.showError(this.dataset.updateUnconfirmedMessage || this.dataset.errorMessage);
+      const uncertain = this.querySelector('[data-cart-uncertain]');
+      if (uncertain) uncertain.hidden = false;
+      const checkButton = uncertain?.querySelector('[data-cart-check]') || null;
+      if (!this.isOpen) this.open(trigger, checkButton);
+      else checkButton?.focus();
+    }
+
     // /cart/add.js devuelve la linea anadida ({ variant_id }) o, con items[], { items: [...] }.
     responseHasVariant(result, variantId) {
       if (!variantId) return false;
@@ -2693,7 +2832,7 @@
       // Its own controller: crossSellController belongs to the recommendations read and
       // beginMutation() aborts it, which must never cut an add short.
       const controller = new AbortController();
-      const deadline = window.setTimeout(() => controller.abort(), CART_CROSS_SELL_ADD_TIMEOUT);
+      const deadline = window.setTimeout(() => controller.abort(), CART_ADD_TIMEOUT);
       let outcome = 'uncertain';
       let failureMessage = '';
 
@@ -3492,6 +3631,8 @@
       // against syncRevision to decide whether a deferred sync still has anything to
       // fetch: if every mutation since the sync was requested has rendered, it does not.
       this.renderedRevision = this.syncRevision;
+      // B-03. The drawer mirrors the server again: cartBaseline() may read it.
+      this.cartSnapshotStale = false;
 
       this.updateHeaderCount();
       this.loadRecommendations();
@@ -4149,12 +4290,29 @@
       this.clearMessages();
       this.setBusy(true);
       this.requestController?.abort();
-      this.requestController = new AbortController();
+      const controller = new AbortController();
+      this.requestController = controller;
+      // B-03. The drawer adds' deadline. Only this timeout, not a deliberate abort, is
+      // settled by reading the cart.
+      let timedOut = false;
+      const deadline = window.setTimeout(() => {
+        timedOut = true;
+        controller.abort();
+      }, CART_ADD_TIMEOUT);
       const drawer = document.querySelector('cart-drawer');
+      // B-03. Taken before beginMutation(). Without a drawer (cart type "page") /cart.js is read.
+      const baseline = typeof drawer?.cartBaseline === 'function'
+        ? drawer.cartBaseline()
+        : readCartQuantities(this.dataset.cartUrl).then((cart) => cart?.quantities || null);
       const revision = drawer?.beginMutation?.();
       const requestBody = {
         items: selectedItems.map(({ id, quantity }) => ({ id, quantity })),
       };
+      const requested = new Map();
+      selectedItems.forEach(({ id, quantity }) => {
+        const key = String(id);
+        requested.set(key, (requested.get(key) || 0) + (Number(quantity) || 1));
+      });
 
       if (drawer?.dataset.sectionId) {
         requestBody.sections = typeof drawer.renderSectionIds === 'function'
@@ -4164,22 +4322,51 @@
       }
 
       try {
-        const response = await fetchCommerce(this.dataset.cartAddUrl, {
-          method: 'POST',
-          headers: {
-            Accept: 'application/json',
-            'Content-Type': 'application/json',
-            'X-Requested-With': 'XMLHttpRequest',
-          },
-          body: JSON.stringify(requestBody),
-          signal: this.requestController.signal,
-        }, this.dataset.errorMessage);
-        // See addItem: an HTML error page must surface as the localized message, not as
-        // a JSON SyntaxError, and an abort must stay an abort.
-        const result = await response.json().catch((error) => {
-          if (error.name === 'AbortError') throw error;
-          throw new Error(this.dataset.errorMessage);
-        });
+        const before = await baseline;
+        // B-03. See addItem: a lost response (network error, deadline, an HTML error page)
+        // is settled by reading the cart before the shopper is invited to try again.
+        let response = null;
+        let result = null;
+        try {
+          response = await fetch(this.dataset.cartAddUrl, {
+            method: 'POST',
+            headers: {
+              Accept: 'application/json',
+              'Content-Type': 'application/json',
+              'X-Requested-With': 'XMLHttpRequest',
+            },
+            body: JSON.stringify(requestBody),
+            signal: controller.signal,
+          });
+          result = await response.json();
+        } catch (error) {
+          if (error.name === 'AbortError' && !timedOut) throw error;
+          result = null;
+        }
+        window.clearTimeout(deadline);
+
+        if (!response || result === null || typeof result !== 'object') {
+          const after = await readCartQuantities(this.dataset.cartUrl);
+          const mayStillLand = timedOut || !response || response.status >= 500;
+          const outcome = classifyAdd(requested, before, after?.quantities, mayStillLand);
+          if (outcome === 'not_applied') throw new Error(this.dataset.errorMessage);
+          if (outcome === 'unknown' && typeof drawer?.showUnconfirmedAdd === 'function') {
+            drawer.showUnconfirmedAdd(this.submitButton);
+            return;
+          }
+          const canOpenDrawer = typeof drawer?.renderCartResponse === 'function'
+            && typeof drawer.open === 'function';
+          if (outcome === 'unknown' || !canOpenDrawer) {
+            // The cart page shows what the server holds.
+            window.location.assign(this.dataset.cartUrl);
+            return;
+          }
+          await drawer.renderCartResponse({}, revision).catch(() => {});
+          drawer.showStatus?.(this.dataset.addedMessage);
+          drawer.open(this.submitButton);
+          this.showStatus(this.dataset.addedMessage);
+          return;
+        }
 
         if (!response.ok) {
           throw new Error(result?.description || result?.message || this.dataset.errorMessage);
@@ -4206,6 +4393,7 @@
         drawer.open(this.submitButton);
         this.showStatus(this.dataset.addedMessage);
       } finally {
+        window.clearTimeout(deadline);
         this.setBusy(false);
         drawer?.endMutation?.();
       }
```

## 12. Riesgos residuales (P3 de observacion de CLAUDE-REVIEW-B-03-001)

- **H-REV-1 (P3).** Puede aparecer un «Item added» falso, sin duplicado, en tres casos: dos altas solapadas de la misma variante con la 2.ª perdida, un alta de otra pestaña durante la pérdida, o un POST que aterriza después de la resincronización de un `unknown`. La línea base no ve la otra alta y el delta la cuenta. Es el residuo ya aceptado en la R-D (§1.5); nunca invita a reintentar.
- **H-REV-2 (P3).** Con el carrito en página (sin `<cart-drawer>`), cada alta de «Completa el look» hace 1 GET `/cart.js` previo para la línea base (E15/E16: `GETcart=2`). El «coste cero en el camino feliz» solo vale con cajón; el diseño lo acepta.
