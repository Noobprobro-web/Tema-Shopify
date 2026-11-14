ID: CLAUDE-REPORT-B-04-001
Fecha: 2026-11-05
Autor: Claude (Sonnet), implementador. Sin commit ni push.
Estado: Codigo completo (D22). No cierra filas del ledger. Pendiente de credenciales (D22): tienda real.
Decision requerida: revision del coordinador/R-B y commit. Ninguna de Johandry (PD-3 = FUERA).
Resumen en 5 lineas:
1. View cart del cajon pasa por la misma puerta que los enlaces de venta cruzada: rama nueva en `handleDrawerClick` (`assets/theme.js:2527`) hacia `handleCrossSellView` -> `saveNoteAndNavigate`.
2. `<a>` de View cart con `id="CartDrawerViewCart"` y `data-cart-view-cart` (`sections/cart-drawer.liquid:366`); el id devuelve el foco tras un fallo.
3. Comentario de `handleCrossSellView` actualizado (`assets/theme.js:3148`); sin renombrar (PD-2).
4. Aplicados C-1..C-5 de la R-D; PD-1 hook+id, PD-2 no renombrar, PD-3 FUERA (HX-1 no tocado), PD-4 codigo completo.
5. Harness sintetico: base en rojo (T01 0 POST, T06 pierde destino), final en verde en los 21 escenarios + modificadores.
Archivos tocados: `sections/cart-drawer.liquid` (1 linea), `assets/theme.js` (+11/-2 lineas), `agent-comms/outbox-claude/harness-B-04-001/{harness.mjs,salida-base.txt,salida-final.txt}`, este informe. Lista cerrada respetada; ledger sin tocar.
Desviaciones (Nivel 1 o Nivel 2): ninguna (Nivel 1).
Hallazgos extra fuera de alcance: HX-1 (enlaces de titulo/imagen de linea, FUERA por R-D PD-3), HX-2 (borrador perdido al vaciar el carrito, T17), HX-3 (nota > ~64 KiB, T18), H-RD-1 (Meta en Linux/Windows navega en la misma pestana), H-RD-2 (Safari: foco a Close). Todos preexistentes.
Verificacion: SINTETICA (Chromium local, sin tienda) y ESTATICA; secciones 2-5. No demuestra eco real de Shopify, keepalive en tienda, mutaciones reales, Safari ni movil.
Afirmaciones falsables:
1. `sections/cart-drawer.liquid:366` contiene `id="CartDrawerViewCart"` y `data-cart-view-cart`; `rg -c` = 1 y 1 (liquid, theme.js); `CartDrawerViewCart` solo en cart-drawer.liquid (1).
2. `git diff --stat 9834bac -- . ':!agent-comms'` = solo `assets/theme.js` y `sections/cart-drawer.liquid`.
3. Base 9834bac (harness): T01 `updates:0`, `serverNote:""`, navega a `/cart`; T06 navega a `/cart`. Final: T01 1 POST `Gift wrap please`, T06 `/products/xsell`.
4. Final: T08-T12 y T18 no navegan, borrador `dirty=true`, error visible, foco `CartDrawerViewCart`, `sections:2`.
5. Final: Ctrl, Meta, Shift, Alt, boton central, Ctrl+Enter y Shift+Enter: `updates:0`; `click/auxclick:false` (defaultPrevented falso).
6. Final: T14 y Checkout por Enter: `updates:0` a update.js y POST nativo con `note=` y `checkout=`.
7. Regresion: A-01/B-02 56/56, B-01 fallos=0, B-03 fallos=0. Theme Check 93 archivos, 0 ofensas.

---

# 1. Identidad y preflight (estatico)
HEAD antes de editar: 9834bacbf81be52304723ae7b326ea6f76b84706. `git log --oneline 1fee9e2..HEAD`: 9834bac B-03, 4e5c6d6 B-05, a0274ce B-01. Base fijada del harness: 9834bac. B-03 no cambio el cuerpo de `handleDrawerClick`, `handleCrossSellView` ni `saveNoteAndNavigate` (`git diff 1fee9e2 9834bac` sin coincidencias de esas anclas); `syncCart({ reconcile = false } = {})` se llama sin argumentos en la rama de fallo y T07-T12 pasan.
Preflight literal (rg del hook con C-1 de la R-D, excluye agent-comms):
```
$ git status --short --branch
## lote-b...origin/lote-b
?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-B-04-001.md
?? agent-comms/outbox-claude/CLAUDE-REVIEW-B-04-RD-001.md
$ git rev-parse HEAD
9834bacbf81be52304723ae7b326ea6f76b84706
$ git merge-base --is-ancestor 1fee9e2 HEAD; echo "exit=$?"
exit=0
$ git log --oneline -3
9834bac Lote B: B-03 el alta al carrito con respuesta perdida no duplica lineas
4e5c6d6 Lote B: B-05 el nombre accesible del selector de idioma empieza por el codigo visible
a0274ce Lote B: B-01 el menu movil se cierra al cruzar el corte de escritorio
$ git diff --stat 1fee9e2 -- assets/theme.js sections/cart-drawer.liquid
 assets/theme.js | 317 +++++++++++++++++++++++++++++++++++++++++++++++----------
 1 file changed, 262 insertions(+), 55 deletions(-)
$ node --check assets/theme.js          -> sin salida, exit 0
$ rg -n "handleDrawerClick\(event\) \{|handleCrossSellView\(event, link\) \{|async saveNoteAndNavigate|this\.contains\(link\)|data-cross-sell-add\]'\);" assets/theme.js
2473:      if (!link || this.contains(link) || link.target === '_blank' || link.hasAttribute('download')) return;
2494:    handleDrawerClick(event) {
2527:      const crossSellButton = event.target.closest('[data-cross-sell-add]');
3068:      const addButton = panel.querySelector('[data-cross-sell-add]');
3142:    handleCrossSellView(event, link) {
3159:    async saveNoteAndNavigate(href, textarea) {
3648:        if (this.contains(link)) return;
$ rg -n 'cart-drawer__view-cart' sections/cart-drawer.liquid assets/base.css
sections/cart-drawer.liquid:366:              <a class="cart-drawer__view-cart" href="{{ routes.cart_url }}">
assets/base.css:3153:.cart-drawer__view-cart { ...
$ rg -n "data-cart-view-cart|CartDrawerViewCart|cartViewCart" . --glob '!node_modules' --glob '!agent-comms/**'
(vacio, exit 1)
```
Nota (corregida por P3-1 de CLAUDE-REVIEW-B-04-001): las anclas `this.contains(link)` y `data-cross-sell-add]');` ya aparecian dos veces en 1fee9e2 (otras funciones, :3068 y :3648 hoy), no por B-03; la condicion de la directiva §1.2 (una sola vez cada ancla) ya fallaba en su propia base. La ancla de insercion (`const crossSellButton` dentro de `handleDrawerClick`) es unica (:2527 antes de editar). No bloquea.

# 2. Compuertas estaticas (literal)
```
$ node --check assets/theme.js
exit=0
$ npx --no-install shopify theme check --fail-level error
╭─ success ────────────────────────────────────────────────────────────────────╮
│                                                                              │
│  Theme Check Summary.                                                        │
│                                                                              │
│  93 files inspected with no offenses found.                                  │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯

$ theme-check-sanity
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
[theme-check-sanity] ALCANCE DE ESTA PRUEBA: demuestra que esos tres checks estan activos y que disparan sobre archivos de tema. No demuestra cobertura exhaustiva de todas las referencias de traduccion. Para eso corre scripts/locale-key-inventory.mjs.
$ locale-key-inventory
--------------------------------------------------------------------------
OK: todas las referencias estaticas resuelven contra los locales.
$ dataset-hooks
No comprueba que esté dentro de la etiqueta de apertura ni que su valor
sea válido en runtime.
exit=0
$ json-validate
sea semanticamente valido para Shopify: eso lo cubre Theme Check
en las carpetas de tema, y nadie en /listings/.
exit=0
$ rg -c data-cart-view-cart sections/cart-drawer.liquid assets/theme.js
sections/cart-drawer.liquid:1
assets/theme.js:1
$ rg -c CartDrawerViewCart . --glob '!node_modules' --glob '!agent-comms/**'
./sections/cart-drawer.liquid:1
$ git diff --stat 9834bac -- . :!agent-comms
 assets/theme.js             | 13 +++++++++++--
 sections/cart-drawer.liquid |  2 +-
 2 files changed, 12 insertions(+), 3 deletions(-)
$ git diff 9834bac -- sections/cart-drawer.liquid
@@ -363,7 +363,7 @@
                   {{ content_for_additional_checkout_buttons }}
                 </div>
               {%- endif -%}
-              <a class="cart-drawer__view-cart" href="{{ routes.cart_url }}">
+              <a id="CartDrawerViewCart" class="cart-drawer__view-cart" href="{{ routes.cart_url }}" data-cart-view-cart>
                 {{- 'sections.cart.view_cart' | t -}}
               </a>
             </footer>
$ git diff -U0 9834bac -- assets/theme.js
diff --git a/assets/theme.js b/assets/theme.js
index 4ee4f79..058c20b 100644
--- a/assets/theme.js
+++ b/assets/theme.js
@@ -2526,0 +2527,8 @@
+      // B-04. View cart leaves the drawer too: same guarded note save as the card links.
+      // Checkout is not routed here; the cart form posts the note natively.
+      const viewCartLink = event.target.closest('[data-cart-view-cart]');
+      if (viewCartLink) {
+        this.handleCrossSellView(event, viewCartLink);
+        return;
+      }
+
@@ -3140,2 +3148,3 @@
-    // View product with an unsaved note: save it first, and leave only once the server has
-    // the exact draft. Modified clicks and new-tab links keep their native behaviour.
+    // A drawer link that leaves the drawer (View product, the card links, View cart) with an
+    // unsaved note: save it first, and leave only once the server has the exact draft.
+    // Modified clicks and new-tab links keep their native behaviour.
$ npx --no-install shopify theme check --fail-level error (linea resumen)
93 files inspected with no offenses found.
locale-key-inventory: Huerfanas en storefront: 0 / Huerfanas en schema: 0
dataset-hooks: Contratos rotos: 0
```
Diff de theme.js (3 ramas): ver bloque `git diff -U0` arriba: insercion en `:2527-2534` y comentario `:3148-3150`. Estatico.

# 3. Harness (sintetico)
Comandos:
```
node agent-comms/outbox-claude/harness-B-04-001/harness.mjs . base 9834bac > .../salida-base.txt
node agent-comms/outbox-claude/harness-B-04-001/harness.mjs . fix  > .../salida-final.txt
```
Sin rutas absolutas, servidor ficticio via page.route, theme.js real sin parches en memoria, dos ejecuciones de fix identicas (`cmp` OK, determinista). Control de deriva: `DERIVA [...] OK` (5 tokens: liquid = html; en base hook/id = 0, en final 1). Salidas completas: `harness-B-04-001/salida-base.txt` y `salida-final.txt`.
Base en rojo (H-16): T01 `updates:0 serverNote:"" navs:/cart`; T06 `navs:/cart` (pierde el primer destino); T07-T12/T18 navegan sin guardar; T04/T05/T07/T16/T19 fallan por navegacion prematura (error de Playwright en el segundo clic).

| H | Caso | Final (resultado) |
| --- | --- | --- |
| H-1 | T01 clic / T21 Enter | 1 POST `Gift wrap please` / `keyboard`; servidor igual; navega a /cart tras el eco |
| H-2 | T02 y nota del servidor sin editar | 0 POST; nativo |
| H-3 | T03 sin textarea | 0 POST; nativo |
| H-4 | T04 doble clic | 1 POST; una navegacion /cart |
| H-5 | T05 / T06 | 1 POST; destino /cart y /products/xsell (gana el primero) |
| H-6 | T07 edicion en vuelo | no navega; `abcX`, dirty=true; error; sections:2; foco textarea |
| H-7 | T08-T12 | no navega; borrador y dirty; error; sections:2; foco `CartDrawerViewCart` |
| H-8 | T13 + Ctrl/Meta/Shift/Alt/medio/Ctrl+Enter/Shift+Enter | 0 POST, defaultPrevented falso en todos. Ctrl, Shift, medio, Ctrl+Enter, Shift+Enter: pestana nueva, borrador sucio en el cajon. Alt: ni navegacion ni pestana (Chromium descarga). Meta en Linux: navega en la misma pestana a /cart y el borrador se pierde (igual en base; C-3) |
| H-9 | T14 + Enter | 0 POST a update.js; POST nativo `note=...&checkout=` |
| H-10 | T15 / T16 | sin excepciones; T16 servidor `kept` y navega; T15 navega con change.js en vuelo (limite 4.3.1) |
| H-11 | T17 | estado vacio sin View cart; servidor `""`; HX-2 preexistente |
| H-12 | T18 70.000 car. | 0 POST, no navega, error, borrador intacto; HX-3 |
| H-13 | T19 | 1.er clic error y se queda; 2.o clic: 2 POST totales y navega |
| H-14 | T20 sin JS | cajon `hidden`; cabecera navega a /cart |
| H-15 | 12 lineas de 120 car. + nota 2.000 car. con saltos, emoji y espacios | 1 POST, eco exacto (`exact:true`), navega |
| H-16 | base en rojo | ver arriba |
| H-17 | View product sucia | 1 POST, `/products/xsell`; sin regresion |

# 4. Regresion (sintetico)
```
$ node harness-A-01-B-02-001/harness.mjs . fix

MODO=fix total=56 pass=56 fail=0
FALLAN: []
$ node harness-B-01-001/drawer-breakpoint.mjs . fix

resumen fallos=0
$ node harness-B-03-001/cart-lost-response.mjs . fix
resultados D0=OK D1=OK D2=OK D3=OK D4=OK D5=OK D6=OK E1=OK E2=OK E3=OK E4=OK E5=OK E6=OK E7=OK E8=OK E8b=OK E9=OK E10=OK E11=OK E12=OK E13=OK E14=OK E15=OK E16=OK E17=OK E18=OK R1=OK R5=OK
resumen fallos=0
```

# 5. Decisiones, ledger, limites, pendientes
- PD-1 hook+id; PD-2 no renombrar; PD-3 FUERA (HX-1 sin tocar); PD-4 codigo completo (CLAUDE-REVIEW-B-04-RD-001 §3). C-1 aplicado en el preflight; C-2 en H-8; C-3/C-5 recogidos en este informe.
- Ledger: sin filas cerradas ni modificadas; no se edito. Regresion de filas Focus Trap, Live Regions y Checkout Acelerado: sin cambio (H-7, estados reutilizados, Checkout intacto).
- Limites 4.3.1-4.3.5 confirmados; 4.3.2 con la correccion C-3 (Meta Linux/Windows pierde el borrador; Alt descarga en Chromium).
- Pendiente de credenciales (D22), todo: (1) preview Sartorial: nota sucia/limpia/setting oculto; (2) eco real de /cart/update.js con saltos, espacios finales, emoji y ~2.000 car.; (3) fallos con red real; (4) mutaciones concurrentes (solo con autorizacion); (5) Checkout con nota sucia con y sin JS; (6) movil 390 px y escritorio 1280 px, teclado y lector; C-4: Safari/macOS no enfoca un enlace con clic, tras un fallo el foco cae en Close (respaldo de renderSection); comprobar, no bloquea.
- Sin credenciales, sin .secrets, sin gate5, sin tiendas, sin metafields.

# Mejoras pendientes del arnes (P3-4 de CLAUDE-REVIEW-B-04-001)
El arnes solo emite JSON y el veredicto H-1..H-17 se hace a mano; `log.updates` guarda `keepalive: true` fijo sin medirlo, y X-T02b recoge `defaultPrevented` sin emitirlo (H-2 queda cubierto solo de forma indirecta). Mejora pendiente para proximas tareas: aserciones automaticas con veredicto, medir `keepalive` y emitir `defaultPrevented`. No bloquea B-04.
