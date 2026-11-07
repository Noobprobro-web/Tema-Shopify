ID: CLAUDE-REVIEW-B-04-RD-001
Fecha: 2026-11-05
Autor: Claude (Opus), revisor R-D independiente de contexto limpio (D11). No redactó la directiva ni implementará.
Objeto: `agent-comms/outbox-claude/CLAUDE-DIRECTIVA-B-04-001.md` (sin commit), rama `lote-b`, HEAD `1fee9e2`. `assets/theme.js` evaluado sobre `git show HEAD:assets/theme.js` (el árbol tiene cambios sin commit de B-01).
Estado: Dictamen R-D emitido. **APROBADA CON CAMBIOS** (lista cerrada en §2). Equivale a «apta con condiciones» de la condición §0.1 de la directiva.
Decisión requerida: ninguna de Johandry (D10) con las decisiones de §3 (PD-3 = FUERA). El coordinador incorpora C-1 a C-5 en la directiva, o el implementador los aplica mandando este dictamen.
Resumen en 5 líneas:
1. Defecto TT-103/RC-11/S-06 confirmado de forma independiente: `handleDocumentClick` sale con `this.contains(link)` (`theme.js:2374`) y `handleDrawerClick` (`:2395-2447`) no tiene rama para `a.cart-drawer__view-cart` (`cart-drawer.liquid:366`). Base: T01 0 POST y nota del servidor `""`; T06 pierde el primer destino.
2. S-1/S-2/S-3 aplicados literalmente a una copia del repo: los 21 escenarios cumplen el contrato del plan V4.1 §B-04; Checkout sigue con POST nativo (`note=` y `checkout=`), sin cambios.
3. Modificadores: Ctrl, Shift, Meta, Alt, botón central, Ctrl+Enter y Shift+Enter no se interceptan (0 POST, `defaultPrevented` falso). Matiz de documentación: Meta fuera de macOS navega en la misma pestaña y pierde el borrador (preexistente, conforme al plan; C-3).
4. PD-1 = hook + `id`; PD-2 = no renombrar; PD-3 = FUERA; PD-4 = sí, «código completo» con §5.4 pendiente (D22).
5. Cambios: preflight `rg` que nunca saldría vacío (C-1, bloquearía al implementador), H-8 ampliado a todos los modificadores (C-2), §4.3.2 corregido (C-3), foco en Safari a §5.4.6 (C-4), frase del ledger (C-5).
Archivos tocados: solo este archivo nuevo. Fuera del repo, en `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rd-b04/`: `repo/` (copia con S-1..S-3), `base/assets/theme.js` (HEAD), `theme-head.js`, `harness-rd.mjs`, `salida-rd-base.txt`, `salida-rd-final.txt`, `*.out`, `count-rd.py`. Sin git de escritura, sin red, sin tiendas, sin `.secrets`, sin gate5.
Desviaciones (Nivel 1 o Nivel 2): ninguna. La solución sigue siendo Nivel 1 (RULES §3.5: sin setting, schema, preset ni clave de locale).
Hallazgos extra fuera de alcance (con parche listo): HX-1 (enlaces de línea, parche de la directiva §7.2 verificado como de un selector) queda FUERA; HX-2 y HX-3 confirmados como preexistentes. Nuevo: H-RD-1 (Meta en Linux/Windows, §2 C-3) y H-RD-2 (foco tras fallo en Safari, §2 C-4), ambos sin parche y preexistentes en la venta cruzada.
Verificación (comando, resultado y qué demuestra/qué no): §1. SINTÉTICA y ESTÁTICA. Demuestra el mecanismo en Chromium con el `theme.js` real (HEAD y copia parcheada). No demuestra el eco real de Shopify, `keepalive` en tienda, mutaciones reales, Safari ni móvil.
Lista de afirmaciones falsables numeradas:
1. `git show HEAD:assets/theme.js | sha256sum` empieza por `518c04deeeb93a4a`; `sections/cart-drawer.liquid` por `2821c05d3bcf6bd2`.
2. En HEAD: `class ThemeDrawer` `:274`, `CART_NOTE_SAVE_TIMEOUT` `:2272`, `class CartDrawer` `:2274`, `handleDocumentClick` `:2368`, `this.contains(link)` `:2374`, `handleDrawerClick` `:2395`, `data-cross-sell-add]')` `:2428`, comentario `:2982`, `handleCrossSellView` `:2984`, `saveNoteAndNavigate` `:3001`, `syncCart()` en la rama de fallo `:3041`, `async syncCart({ reconcile = false } = {})` `:3302`, guarda del borrador `:3415`.
3. `git diff --stat` del árbol: solo `assets/theme.js | 19 +` con hunks `@@ -296` y `@@ -307` (dentro de `ThemeDrawer`, antes de `CartDrawer`).
4. `rg -n "data-cart-view-cart|CartDrawerViewCart|cartViewCart" . --glob '!node_modules'` en el árbol actual encuentra la propia directiva (y, tras este dictamen, también este archivo): la condición «sale vacío» del preflight §1.2 no puede cumplirse sin C-1.
5. Copia con S-1..S-3: `node --check` OK; Theme Check «93 files inspected with no offenses found.»; `grep -c data-cart-view-cart` = 1 en `cart-drawer.liquid` y 1 en `theme.js`; `CartDrawerViewCart` solo en `sections/cart-drawer.liquid` (1).
6. Harness RD, base: T01 `updates:0`, `serverNote:""`; T06 navega a `/cart`. Final: T01 1 POST exacto; T06 `/products/xsell`; T08-T12 foco `CartDrawerViewCart`; X-Meta `navs:/cart`, `updates:0`.
7. `rg -n -i "nota|note" docs/requirements-ledger.md` no devuelve ninguna línea.

---

# 1. Verificación

## 1.1 Defecto (estático, HEAD)

Confirmado en todos sus puntos con anclas y líneas de §1.1 de la directiva (afirmación 2). La rama `viewLink` (`:2419-2426`) es la única que envía enlaces al guardado; View cart cae al final (`:2438`, sin `[data-cart-remove]`) y navega de forma nativa. `updateHeaderCount` (`:3488`) también excluye enlaces del cajón por `this.contains(link)`, así que el `id`/hook no altera su `aria-label`. Checkout: `type="submit" name="checkout"` (`cart-drawer.liquid:351`) dentro del form de `:146` con la textarea `name="note"` (`:318`).

## 1.2 Corrección de la solución

- S-2 se inserta tras `viewLink` y antes de `crossSellButton`: no altera el orden ni la semántica de las ramas previas; View cart no está dentro de `[data-cross-sell-item]`, así que no lo captura `viewLink`.
- `handleCrossSellView` ya filtra `defaultPrevented`, botón ≠ 0, Ctrl/Meta/Shift/Alt, `_blank` y `download`, e intercepta solo con textarea sucia o guardado pendiente; con pendiente hace `preventDefault` y nada más (primer destino gana).
- Botón central dispara `auxclick`, no `click`: el listener no lo ve (medido: `auxclick:false`).
- Enter sobre el enlace genera `click` con `button 0`: mismo camino (T21).
- `id="CartDrawerViewCart"`: necesario para la restauración de foco por `id` de `renderSection` (`:3454-3455`); sin él cae en Close (`salida-prototipo-sin-id.txt`, T08-T12 y T19 con foco `Close`, verificado). El cajón se monta una vez (`layout/theme.liquid:140`); el `id` no existe en el repo fuera de la directiva.
- S-3 es solo comentario. El hook no se lee con `dataset`: `dataset-hooks` sigue en 0 contratos rotos.

## 1.3 Fidelidad del harness del redactor (`scratchpad/b04/harness.mjs`)

- Sirve `assets/theme.js` REAL del repo; el parche `FIX=1` es el bloque de S-2 sin sus dos líneas de comentario (equivalente en ejecución).
- El HTML traduce fielmente lo que importa a B-04: overlay `hidden`, panel `inert`, `data-cart-update-url`, `data-saving-note-message` y `data-note-unconfirmed-message` (`cart-drawer.liquid:47,50,51`), form, textarea `#CartDrawerNote name=note`, `noscript` de update, Checkout y View cart en el orden real del pie.
- Simplificaciones sin efecto en B-04: sin checkouts acelerados, sin descuentos ni recomendaciones reales, `<html class="js">` en lugar de `no-js`, el enlace de título de línea sin la clase `cart-drawer-item__title` en el `h3` y sin enlace de imagen (solo afectaría a HX-1, que queda fuera). No tiene control de deriva: lo exige ya §5.1 para el harness entregable.
- Repetido por este revisor sobre la copia con S-1..S-3 aplicados literalmente (no con el parche en memoria): resultados idénticos a `salida-prototipo.txt` en T01-T21.

## 1.4 Los 21 escenarios (sintético, Chromium; `salida-rd-base.txt` / `salida-rd-final.txt`)

| # | Base HEAD | Final (copia con S-1..S-3) | Contrato |
| --- | --- | --- | --- |
| T01 sucia + View cart | 0 POST; `/cart`; servidor `""` | 1 POST `Gift wrap please`; servidor igual; `/cart` | cumple |
| T02 limpia | nativo, 0 POST | nativo, 0 POST | cumple |
| T03 sin textarea | nativo, 0 POST | nativo, 0 POST | cumple |
| T04 doble clic | navega sin guardar | 1 POST, una navegación `/cart` | cumple |
| T05 pendiente VC + View product | navega sin guardar | 1 POST; `/cart` | cumple |
| T06 pendiente VP + View cart | 1 POST; `/cart` (pierde destino) | 1 POST; `/products/xsell` | cumple |
| T07 edición en vuelo | navega sin guardar | no navega; `abcX`, dirty; error; 2.º GET; foco textarea | cumple |
| T08-T12 500/JSON/eco/red/plazo | navegan sin guardar | no navegan; borrador y dirty; error; 2.º GET; foco `CartDrawerViewCart` | cumple |
| T13 Ctrl+clic | 0 POST; `defaultPrevented` false | igual | cumple |
| T14 Checkout sucia | 0 `update.js`; POST nativo `note=via+checkout&checkout=` | idéntico | cumple, sin cambios |
| T15 cantidad en vuelo | navega sin guardar | 1 POST; navega con `change.js` en vuelo | límite §4.3.1 |
| T16 re-render en pendiente | (navegó) | borrador conservado; servidor `kept`; navega | cumple |
| T17 último artículo | vacío, sin View cart, servidor `""` | idéntico | HX-2 preexistente |
| T18 70.000 car. | navega sin guardar | 0 peticiones; no navega; error; borrador intacto | HX-3 |
| T19 fallo + reintento | navega sin guardar | 1.º error y se queda; 2.º POST y navega | cumple |
| T20 sin JS | cajón `hidden`; cabecera → `/cart` | idéntico | cumple |
| T21 Enter | navega sin guardar | 1 POST; servidor `keyboard`; `/cart` | cumple |

Extras del revisor (final): Ctrl, Shift, botón central, Ctrl+Enter y Shift+Enter abren pestaña nueva (`newPages:1`), 0 POST, `defaultPrevented` false, borrador sucio en el cajón. Alt: 0 POST, sin navegación ni pestaña (Chromium descarga). Meta en Linux: 0 POST y navegación nativa en la misma pestaña a `/cart` (borrador perdido; idéntico en base). Nota de 2.000 caracteres con saltos, espacios finales y emoji con 12 líneas de título de 120: 1 POST con eco exacto. Nota del servidor no vacía sin editar: 0 POST. «View product» sucia: 1 POST, sin regresión. Checkout por Enter con nota sucia: POST nativo con `note=`.

## 1.5 Compuertas estáticas sobre la copia

`node --check` OK; Theme Check `93 files inspected with no offenses found.`; `theme-check-sanity` OK; `locale-key-inventory` «OK: todas las referencias estaticas resuelven contra los locales.» (0 huérfanas); `dataset-hooks` «Contratos rotos: 0»; `json-validate` 0 fallos.

## 1.6 Secuencia B-01 → B-03 → B-04

Confirmada. B-01 (sin commit) añade +19 líneas en `ThemeDrawer` (hunks `@@ -296`/`@@ -307`, `:274-363`), por encima de `CartDrawer` (`:2274`): todas las anclas de B-04 se desplazan +19 sin solape de texto. B-03 trabaja en otras regiones de `CartDrawer`; `syncCart` ya acepta `{ reconcile = false } = {}` y el helper la llama sin argumentos (`:3041`), así que solo un cambio de su semántica por defecto afectaría a T07-T12 (lo cubre R-6). El preflight por ancla de §1.2 es correcto, salvo C-1.

# 2. Cambios obligatorios (lista cerrada)

- **C-1 (bloqueante de ejecución).** §1.2: el último comando pasa a `rg -n "data-cart-view-cart|CartDrawerViewCart|cartViewCart" . --glob '!node_modules' --glob '!agent-comms/**'`. Sin la exclusión encuentra la propia directiva y este dictamen y la condición «sale vacío» no se cumple nunca.
- **C-2.** H-8 se amplía: Ctrl, Meta, Shift, Alt, botón central (`auxclick`), Ctrl+Enter y Shift+Enter sobre View cart con nota sucia → 0 POST a `update.js` y `defaultPrevented` falso en todos. El informe anota además destino o pestaña nueva de cada uno.
- **C-3.** §4.3.2 se corrige: «Los clics modificados no se interceptan y no guardan el borrador. Con Ctrl, Shift, botón central o Cmd en macOS se abre otra pestaña o ventana y el borrador sigue sucio en el cajón. Con Meta en Linux/Windows el navegador navega en la misma pestaña y el borrador se pierde; Alt+clic en Chromium descarga. Es el comportamiento preexistente de la venta cruzada y lo permite el plan («sin promesa de guardar la nota»).»
- **C-4.** §5.4.6 añade: «Safari/macOS no enfoca un enlace con clic de ratón: tras un fallo el foco cae en Close (respaldo de `renderSection`), no en View cart. Comprobar; no bloquea (el foco sigue en el cajón). H-7 aplica a Chromium y al teclado.»
- **C-5.** §6: sustituir «solo encuentra filas ajenas» por «no devuelve ninguna línea».

# 3. Decisiones

| PD | Decisión | Motivo |
| --- | --- | --- |
| PD-1 | Hook `data-cart-view-cart` + `id="CartDrawerViewCart"` (S-1). | El `id` es lo que devuelve el foco a View cart tras un fallo (medido); el hook desacopla JS de `base.css:3153`. Ambas superficies están en el plan. |
| PD-2 | No renombrar `handleCrossSellView`. | Refactor sin beneficio funcional (RULES §3.9); basta S-3. |
| PD-3 | **FUERA.** HX-1 se registra como hallazgo P2 para R-B o tarea posterior con el parche de §7.2. | El plan V4.1 limita B-04 a View cart (`cart-drawer.liquid:366-368`). AMPLIAR B-04 A LOS ENLACES DE LÍNEA ES UN CAMBIO FUERA DEL PLAN Y REQUIERE A JOHANDRY (D10). Con esta decisión no aplica. |
| PD-4 | Sí: evidencia sintética + estática basta para «código completo»; §5.4 queda «pendiente de credenciales (D22)». | D22; ninguna fila del ledger se cierra. |

Conflictos K-1 a K-5: de acuerdo con la directiva; ninguno requiere a Johandry con PD-3 = FUERA.

# 4. Compuerta del literal

`count-rd.py` (copia adaptada de `count-two.py`, solo `ruta=N`) sobre este archivo: resultado en la línea siguiente.

Resultado: `agent-comms/outbox-claude/CLAUDE-REVIEW-B-04-RD-001.md=0`
