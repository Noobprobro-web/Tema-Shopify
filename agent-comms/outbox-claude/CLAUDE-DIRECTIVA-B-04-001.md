ID: CLAUDE-DIRECTIVA-B-04-001
Fecha: 2026-11-04
Autor: Claude (Opus), redactor de directivas. No implementa.
Destinatario: implementador Sonnet sin contexto previo (ejecuta). También el revisor Opus de contexto limpio (R-D de esta directiva y revisión de la tarea, D11) y el coordinador Claude (rama, commits y push, D12/D16).
Estado: Aprobada con cambios por CLAUDE-REVIEW-B-04-RD-001; donde difieran, manda la R-D.
Decisión requerida: R-D independiente de esta directiva por el revisor Opus de contexto limpio (D11). El R-D decide PD-1 a PD-4 (§9.1). Ninguno exige consulta a Johandry según D10, salvo que el R-D amplíe B-04 a los enlaces de línea (PD-3) y lo considere «cambio fuera del plan» (§9.2).
Resumen en 5 líneas:
1. Defecto confirmado (TT-103 / RC-11 / S-06): con nota del cajón editada y sin guardar, «View cart» navega de forma nativa y el borrador se pierde. `handleDocumentClick` excluye los enlaces del cajón y `handleDrawerClick` no tiene rama para ese enlace.
2. Harness Playwright sintético sobre el `assets/theme.js` real en `1fee9e2`: 0 POST a `/cart/update.js` y navegación a `/cart` con la nota del servidor vacía. Además, si hay un guardado pendiente iniciado desde «View product», «View cart» navega igualmente y se pierde el primer destino.
3. Solución: añadir a `handleDrawerClick` una rama que envíe el enlace View cart a `handleCrossSellView` (que ya llama a `saveNoteAndNavigate`), y dar al enlace un hook `data-cart-view-cart` y un `id` estable para devolverle el foco si el guardado falla. Checkout sigue con POST nativo.
4. Lista cerrada: `sections/cart-drawer.liquid` (solo el `<a>` de las líneas 366-368) y `assets/theme.js` (solo `handleDrawerClick` y el comentario de `handleCrossSellView`). Sin schema, settings, locales, CSS ni helper nuevo. Nivel 1.
5. Estado máximo sin tienda: «código completo» (D22). No cierra ninguna fila del ledger. Queda para tienda: eco real de Shopify, `keepalive`, mutaciones reales y móvil (§5.4).
Archivos tocados (por esta entrega de redacción): solo este archivo nuevo. Fuera del repositorio, en `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/b04/`: `harness.mjs`, `salida-base.txt`, `salida-prototipo.txt`, `salida-prototipo-sin-id.txt`. Sin git de escritura, sin red, sin tiendas, sin `.secrets`.
Desviaciones (Nivel 1 o Nivel 2): Ninguna en la redacción. La implementación propuesta es Nivel 1 (§4.4).
Hallazgos extra fuera de alcance (con parche listo): §7.2. HX-1: los enlaces de título e imagen de cada línea del cajón también salen sin guardar la nota (misma clase de defecto, parche de un selector listo). HX-2: al eliminar el último artículo se pierde el borrador. HX-3: una nota de más de unos 64 KiB no se puede guardar por `keepalive`.
Verificación (comando, resultado y qué demuestra/qué no): §1.3 y §2. Compuertas estáticas en verde en `1fee9e2`. El harness reproduce el defecto con el `theme.js` real y el prototipo en memoria lo corrige en los 21 escenarios. Demuestra el mecanismo en Chromium. No demuestra lo que responde Shopify a `/cart/update.js`, ni nada de tiendas.
Lista de afirmaciones falsables numeradas:
1. En `1fee9e2`, `handleDocumentClick` (`assets/theme.js:2368-2382`) sale con `this.contains(link)` (`:2374`) para todo enlace dentro del cajón. `handleDrawerClick` (`:2395-2447`) no tiene ninguna rama que corresponda a `a.cart-drawer__view-cart` (`sections/cart-drawer.liquid:366-368`).
2. Con el harness (§2.1) contra la base: «nota sucia + View cart» hace 0 POST a `/cart/update.js`, navega a `/cart` y la nota del servidor queda `""` (T01). Con «View product» pendiente, pulsar View cart navega a `/cart` (T06).
3. Con el prototipo de §4 en memoria: T01 hace 1 POST con la nota exacta y navega tras el eco. T04 y T05 hacen 1 POST y conservan el primer destino; T06 navega a `/products/xsell`. T07 a T12 y T18 no navegan, conservan el borrador con `data-dirty="true"` y muestran `note_save_unconfirmed`. T14 (Checkout) hace 0 POST a `update.js` y el POST nativo lleva `note=`.
4. Sin el `id` en el enlace, tras un fallo el foco cae en el botón Close (T08-T12, `salida-prototipo-sin-id.txt`). Con `id="CartDrawerViewCart"` vuelve a View cart.
5. `rg -n "data-cart-view-cart|CartDrawerViewCart"` no encuentra nada en el repositorio en `1fee9e2`: el hook y el id son nuevos y no se duplican.
6. En `1fee9e2`: `node --check assets/theme.js` OK; Theme Check «93 files inspected with no offenses found.»; `theme-check-sanity` OK; `locale-key-inventory` «OK: todas las referencias estaticas resuelven»; `dataset-hooks` y `json-validate` con exit 0.

---

# 0. Condiciones de entrada (bloqueantes)

El implementador NO empieza a editar si falta cualquiera de estas condiciones. Si falta alguna, se detiene y lo comunica al coordinador sin tocar archivos.

1. Existe un dictamen R-D del revisor Opus de contexto limpio sobre esta directiva (ID sugerido `CLAUDE-REVIEW-B-04-RD-001`) con resultado «apta para emitir» o «apta con condiciones». Donde el R-D difiera de esta directiva, manda el R-D. Si el R-D no decide un PD, se aplica la recomendación del redactor (§9.1), salvo PD-3, que sin decisión expresa queda FUERA.
2. La rama `lote-b` existe y está activa, preparada por el coordinador. Si no existe, no la crees: detente.
3. El preflight de §1.2 pasa completo.
4. Ningún otro agente escribe en el repositorio durante el turno (escritor único). B-01 y B-03 también editan `assets/theme.js` en turnos distintos, con commit del coordinador entre turnos (§1.4).

# 1. Base y preflight

## 1.1 Base

- Rama: `lote-b`. Cabeza de referencia de esta redacción: `1fee9e2e0fdd9c62f5b58550487e2236057ac73f` («Lote A: R-A estatica (aceptado con cambios), ledger y estado»).
- Las líneas del plan V4.1 para B-04 están desplazadas. Medido hoy por ancla: +11 respecto a las cifras del plan y +14 respecto a `91f6e9f` (el Lote A añadió 14 líneas en `theme.js`). `sections/cart-drawer.liquid` no se desplazó.

| Ancla (plan V4.1) | Plan | `1fee9e2` |
| --- | --- | --- |
| `const CART_NOTE_SAVE_TIMEOUT = 3000;` | — | `assets/theme.js:2272` |
| Listener `input` que marca `data-dirty` y sube `noteVersion` | 2322-2326 (auditoría) | `:2333-2337` |
| `handleDocumentClick(event)` / `this.contains(link)` | 2357-2371 / 2363 | `:2368-2382` / `:2374` |
| `handleDrawerClick(event)` | 2384-2436 | `:2395-2447` |
| Rama de venta cruzada (`viewLink`) dentro de `handleDrawerClick` | 2408-2415 | `:2419-2426` |
| `handleDrawerChange(event)` (opciones y cantidad, no guarda nota) | 2438-2457 | `:2449-2481` |
| Comentario de `handleCrossSellView` | 2971-2972 | `:2982-2983` |
| `handleCrossSellView(event, link)` | 2973-2984 | `:2984-2995` |
| `async saveNoteAndNavigate(href, textarea)` | 2990-3031 | `:3001-3042` |
| Guarda del borrador en `renderSection` | 3404-3408 | `:3415-3420` |
| `<a class="cart-drawer__view-cart" ...>` | 366-368 | `sections/cart-drawer.liquid:366-368` (sin cambio) |
| Form del cajón / `name="note"` / `name="checkout"` | 146-370 / 318 / 351 | sin cambio |
| Carrito completo: form / nota / checkout | 28-233 / 183 / 216 | `sections/main-cart-items.liquid` sin cambio |

Localiza siempre por el ancla textual (función, selector o atributo), nunca solo por el número de línea.

## 1.2 Preflight obligatorio (antes de editar)

Ejecuta y pega la salida literal en el informe (§8):

```
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 1fee9e2e0fdd9c62f5b58550487e2236057ac73f HEAD && echo "desciende de 1fee9e2"
git log --oneline 1fee9e2..HEAD
git diff --stat 1fee9e2 -- assets/theme.js sections/cart-drawer.liquid
node --check assets/theme.js
rg -n "handleDrawerClick\(event\) \{|handleCrossSellView\(event, link\) \{|async saveNoteAndNavigate|this\.contains\(link\)|data-cross-sell-add\]'\);" assets/theme.js
rg -n 'cart-drawer__view-cart' sections/cart-drawer.liquid assets/base.css
rg -n "data-cart-view-cart|CartDrawerViewCart|cartViewCart" . --glob '!node_modules'
```

Condiciones de paso:

- La rama es `lote-b`, desciende de `1fee9e2` y no hay cambios sin commit en los dos archivos de la lista.
- El último `rg` sale vacío: ni el hook ni el `id` existen todavía.
- `rg` encuentra una sola vez cada ancla de `theme.js`, incluida la línea `const crossSellButton = event.target.closest('[data-cross-sell-add]');` dentro de `handleDrawerClick`.
- Si `git log` muestra commits de B-01 o B-03, las líneas se habrán desplazado (B-01 añade unas +19 por encima de `CartDrawer`). Eso NO bloquea. Bloquea solo si un commit cambió el cuerpo de `handleDrawerClick`, `handleCrossSellView`, `saveNoteAndNavigate`, el listener `input` de la nota o el `<a>` de View cart. En ese caso, detente y avisa al coordinador: la directiva se revisa contra el código nuevo.
- Si B-03 cambió la firma o la semántica de `syncCart` (por ejemplo, la reconciliación), anótalo en el informe. `saveNoteAndNavigate` llama a `syncCart()` sin argumentos en su rama de fallo (`:3041`), y T07-T12 deben seguir pasando.

## 1.3 Estado base medido hoy (`1fee9e2`, referencia)

| Comando | Resultado literal (extracto) |
| --- | --- |
| `node --check assets/theme.js` | sin salida, exit 0 |
| `npx --no-install shopify theme check --fail-level error` | `93 files inspected with no offenses found.` |
| `node scripts/theme-check-sanity.mjs` | `[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.` |
| `node scripts/locale-key-inventory.mjs` | `OK: todas las referencias estaticas resuelven contra los locales.` |
| `node scripts/dataset-hooks.mjs`, `node scripts/json-validate.mjs` | exit 0 y exit 0 |
| `sha256sum` (prefijo de 16) | `assets/theme.js 518c04deeeb93a4a`, `sections/cart-drawer.liquid 2821c05d3bcf6bd2` |

## 1.4 Secuenciación con B-01, B-03 y B-05

| Tarea | Región que toca | Relación con B-04 |
| --- | --- | --- |
| B-01 | `class ThemeDrawer` (`assets/theme.js:274-363`) y `assets/base.css` | Sin solape de texto. Inserta líneas por encima de `CartDrawer`, que desplazan todo B-04. |
| B-03 | `class CartDrawer`: añadir y reconciliar (`addItem` `:2561-2635`, `addCrossSell` `:2660-2759`, `checkCart` `:2789`, `changeLine` `:3161`, `beginMutation`/`endMutation` `:3267-3298`, `syncCart` `:3302-3325` y lo que fije su directiva), más los locales que necesite | La misma clase, en regiones distintas. Solape posible solo si B-03 edita `handleDrawerClick`: entonces B-04 va después y localiza por ancla. |
| B-04 | `handleDrawerClick` `:2395-2447` (inserción entre `:2426` y `:2428`), comentario `:2982-2983` y `sections/cart-drawer.liquid:366` | — |
| B-05 | `snippets/localization-selectors.liquid` y locales | Ninguna. |

Orden recomendado: B-01 → B-03 → B-04, con commit del coordinador entre turnos. Cualquier orden vale si cada turno localiza por ancla. B-04 es el más pequeño y el que menos riesgo tiene de que lo invaliden los demás, por eso va al final.

# 2. Defecto y causa

## 2.1 Método

1. Análisis estático de `assets/theme.js`, `sections/cart-drawer.liquid`, `sections/main-cart-items.liquid`, `layout/theme.liquid:139-140` y `locales/en.default.json:79,103-104` en `1fee9e2`.
2. Harness sintético (Playwright 1.63 local, Chromium de `/opt/pw-browsers`): `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/b04/harness.mjs`.
   - Todo el tráfico se sirve con `page.route` sobre un origen ficticio `http://shop.test`, sin red ni tiendas. `/theme.js` es el `assets/theme.js` REAL leído del repositorio. `/cart?section_id=cd` devuelve el HTML del cajón con el estado del servidor simulado. `/cart/update.js` y `/cart/change.js` se controlan por escenario (eco, 500, JSON inválido, eco distinto, `route.abort`, retraso). Las navegaciones y el POST nativo a `/cart` se registran.
   - El HTML del cajón traduce a mano `cart-drawer.liquid:35-92` (atributos `data-*` y avisos), `:132-139` (vacío) y `:146-370` (form, línea, nota condicionada por `show_cart_note`, Checkout y View cart).
   - Modos: `node harness.mjs <repo>` (base); `FIX=1` (prototipo de §4 en memoria, sin tocar el repo); `FIX=1 NOID=1` (prototipo sin `id` en el enlace).
3. Límite: es sintético. El HTML no lo genera Shopify, y la respuesta de `/cart/update.js` es un eco simulado.

## 2.2 Causa (con evidencia)

- El input de la nota marca `data-dirty="true"` y sube `noteVersion` (`theme.js:2333-2337`). No hay autosave.
- El enlace View cart es un `<a href="{{ routes.cart_url }}">` sin hook (`cart-drawer.liquid:366-368`).
- `handleDocumentClick` sale con `this.contains(link)` (`:2374`), así que los enlaces del cajón nunca abren ni guardan nada desde ahí.
- `handleDrawerClick` (`:2395-2447`) solo envía al guardado los enlaces de venta cruzada (`:2419-2426` → `handleCrossSellView`). View cart cae al final (`:2438-2439`, sin `[data-cart-remove]`) y navega de forma nativa: el borrador nunca llega al servidor.
- Checkout no tiene ese problema: es `type="submit" name="checkout"` (`:351`) dentro del mismo form que la textarea `name="note"` (`:318`), y el POST nativo a `routes.cart_url` incluye la nota (T14).

## 2.3 Resultado por escenario (base frente a prototipo; sintético)

| # | Escenario | Base `1fee9e2` | Prototipo §4 | Contrato del plan (§4.2 B-04) |
| --- | --- | --- | --- | --- |
| T01 | Nota sucia + View cart | 0 POST; navega a `/cart`; nota del servidor `""` | 1 POST `{note:"Gift wrap please"}`; nota del servidor igual; navega a `/cart` | Guardar y navegar tras eco válido |
| T02 | Nota limpia + View cart | nativo, 0 POST | nativo, 0 POST | Sin interceptar |
| T03 | `show_cart_note` desactivado (sin textarea) | nativo, 0 POST | nativo, 0 POST | Sin interceptar |
| T04 | Doble clic con guardado pendiente | navega en el primer clic (sin guardar) | 1 POST, una navegación a `/cart` | Sin segundo POST |
| T05 | Pendiente desde View cart + clic en «View product» | (navegó en el primer clic) | 1 POST; destino `/cart` | El primer destino tiene precedencia |
| T06 | Pendiente desde «View product» + clic en View cart | 1 POST, pero navega a `/cart`: se pierde el primer destino | 1 POST; destino `/products/xsell` | El primer destino tiene precedencia |
| T07 | Edición en vuelo (tecla durante el POST) | (navegó sin guardar) | no navega; borrador `abcX`, `dirty=true`; error `note_save_unconfirmed`; `syncCart` (2.º GET de sección); foco en la textarea | Mantener página y borrador |
| T08 | HTTP 500 | navega sin guardar | no navega; borrador y `dirty` intactos; error; `syncCart`; foco en View cart | Igual |
| T09 | JSON inválido | navega sin guardar | igual que T08 | Igual |
| T10 | Eco distinto | navega sin guardar | igual que T08 | Igual |
| T11 | Red caída (`route.abort`) | navega sin guardar | igual que T08 | Igual |
| T12 | Respuesta en 4,5 s (plazo de 3.000 ms) | navega sin guardar | igual que T08 a los 3 s | Igual |
| T13 | Ctrl+clic | `defaultPrevented=false`, 0 POST | igual (nativo) | Los clics modificados quedan nativos, sin promesa de guardar |
| T14 | Checkout con nota sucia | 0 POST a `update.js`; POST nativo `updates[]=1&note=via+checkout&checkout=` | idéntico | Checkout nativo, sin helper |
| T15 | Cantidad en vuelo (`change.js` retrasado) + View cart | navega sin guardar | 1 POST de nota; navega con `change.js` aún en vuelo | Ver R-1: no se promete resolver carreras |
| T16 | Re-render por mutación durante el guardado pendiente | — (navegó) | se conserva el borrador; nota del servidor `kept`; navega | La guarda de `renderSection` conserva el borrador |
| T17 | Eliminar el último artículo con nota sucia | estado vacío; sin View cart; nota del servidor `""` | idéntico | Ver HX-2 (no es de B-04) |
| T18 | Nota de 70.000 caracteres | navega sin guardar | 0 peticiones (`fetch` con `keepalive` rechaza el cuerpo); no navega; error; borrador intacto | Ver HX-3 |
| T19 | Fallo y reintento manual | navega sin guardar | 1.er clic: error y se queda; 2.º clic: 2.º POST correcto y navega | Sin reintento automático |
| T20 | Sin JS | cajón nunca visible (`overlay.hidden`); el enlace de cabecera navega a `/cart` | idéntico | Sin JS, comportamiento nativo |
| T21 | Teclado: Enter sobre View cart | navega sin guardar | 1 POST; navega | Igual que el clic |

Salidas completas: `salida-base.txt`, `salida-prototipo.txt` y `salida-prototipo-sin-id.txt` en el scratch citado. Con `NOID=1`, T08-T12 y T19 terminan con el foco en `Close`.

Conclusión: el defecto TT-103/RC-11/S-06 queda confirmado en el navegador. El helper `saveNoteAndNavigate` ya cumple el contrato de R-B en todos los escenarios en cuanto se conecta. Basta con conectarlo localmente; no hace falta rediseñar carreras, así que no hay retorno a R-D por alcance (plan §4.2, B-04). No es un hallazgo nuevo (D10): figura en GPT-AUDIT-THREE-THEMES-MASTER-001:248 y CLAUDE-AUDIT-THREE-THEMES-MASTER-001:172,326.

# 3. Contrato que se conserva (no se modifica)

- `saveNoteAndNavigate` (`:3001-3042`): captura el texto y `noteVersion`; hace POST JSON `{note}` a `data-cart-update-url` con `keepalive` y plazo `CART_NOTE_SAVE_TIMEOUT` (3.000 ms). Navega solo con respuesta `ok`, objeto JSON, `note` idéntica y versión sin cambio. Limpia `dirty` solo si el texto actual sigue idéntico. En cualquier otro caso muestra `data-note-unconfirmed-message` y llama a `syncCart`. Sin reintento automático.
- `handleCrossSellView` (`:2984-2995`): solo clic primario sin modificadores, sin `_blank`, sin `download` y sin `defaultPrevented`. Intercepta solo si hay textarea sucia o guardado pendiente. Si hay guardado pendiente, `preventDefault` y no hace nada más: el primer destino gana.
- `renderSection` (`:3415-3420`): conserva el borrador sucio cuando existen ambas textareas.
- Checkout del cajón y de `/cart`: POST nativo con `name=note` y `name=checkout`. No se intercepta ni se conecta al helper.
- Checkouts acelerados (`cart-drawer.liquid:361-365`): fuera de la certificación de B-04.

# 4. Solución

## 4.1 Principio

View cart pasa por la misma puerta que los enlaces de venta cruzada: `handleDrawerClick` → `handleCrossSellView` → `saveNoteAndNavigate`. No se crea un helper nuevo, no se renombra nada y no se toca la lógica de guardado. El código es original: no copies de SebastianDev017/atelier (D17) ni de otros temas.

## 4.2 Cambios (lista cerrada; líneas de `1fee9e2`)

**S-1. `sections/cart-drawer.liquid`, enlace View cart (`:366`)**

Sustituye exactamente la línea de apertura del `<a>`:

```liquid
              <a class="cart-drawer__view-cart" href="{{ routes.cart_url }}">
```

por:

```liquid
              <a id="CartDrawerViewCart" class="cart-drawer__view-cart" href="{{ routes.cart_url }}" data-cart-view-cart>
```

- No cambies la clase (la usa `assets/base.css:3153`), el `href`, el texto (`sections.cart.view_cart`) ni el cierre `</a>` (`:367-368`).
- `data-cart-view-cart` es el hook de JS, con el mismo patrón que `data-cross-sell-view`.
- `id="CartDrawerViewCart"` existe para que `renderSection` devuelva el foco al enlace tras un guardado fallido. Lo hace con su respaldo por `id` (`theme.js:3454-3455`). Sin el `id`, el foco cae en Close (T08-T12 con `NOID=1`). El cajón se monta una sola vez (`layout/theme.liquid:139-140`), así que el `id` no se duplica. Sigue el patrón de `CartDrawerNote` y `CartDrawerTitle`.

**S-2. `assets/theme.js`, `handleDrawerClick` (`:2395-2447`)**

Inserta este bloque justo después del cierre de la rama `viewLink` (el `}` de `:2426`, tras `this.handleCrossSellView(event, viewLink); return;`) y justo antes de `const crossSellButton = event.target.closest('[data-cross-sell-add]');` (`:2428`), dejando una línea en blanco a cada lado:

```js
      // B-04. View cart leaves the drawer too: same guarded note save as the card links.
      // Checkout is not routed here; the cart form posts the note natively.
      const viewCartLink = event.target.closest('[data-cart-view-cart]');
      if (viewCartLink) {
        this.handleCrossSellView(event, viewCartLink);
        return;
      }
```

- No toques las demás ramas, ni su orden, ni `handleDocumentClick`.
- Esta es la única lógica nueva.

**S-3. `assets/theme.js`, comentario de `handleCrossSellView` (`:2982-2983`)**

Sustituye las dos líneas:

```js
    // View product with an unsaved note: save it first, and leave only once the server has
    // the exact draft. Modified clicks and new-tab links keep their native behaviour.
```

por:

```js
    // A drawer link that leaves the drawer (View product, the card links, View cart) with an
    // unsaved note: save it first, and leave only once the server has the exact draft.
    // Modified clicks and new-tab links keep their native behaviour.
```

El nombre del método no cambia (PD-2).

**Fuera de la lista (NO tocar):** `saveNoteAndNavigate`, `handleDocumentClick`, el listener `input`, `renderSection`, `syncCart`, `handleDrawerChange`, `sections/main-cart-items.liquid`, `snippets/cart-drawer-recommendations.liquid`, `assets/base.css`, `locales/*`, el schema de `cart-drawer.liquid` y `docs/requirements-ledger.md`. Si crees que hace falta tocar alguno, DETENTE y devuélvelo al coordinador: es Nivel 2 o retorno a R-D.

## 4.3 Límites reales que se documentan (no se resuelven en B-04)

1. Mutación en vuelo: si un cambio de cantidad, una eliminación o un añadido sigue en vuelo cuando se confirma la nota, la navegación cancela esa petición en el cliente (T15). `/cart` mostrará lo que el servidor haya aplicado. El helper no usa `beginMutation`/`endMutation`, y B-04 no promete resolver esas carreras (plan §4.2).
2. Los clics modificados (Ctrl, Meta, Shift, Alt, botón central) abren la página de forma nativa sin guardar el borrador. El borrador sigue sucio en el cajón (T13).
3. Sin JS, o con `theme.js` caído, el cajón no se abre: el enlace de cabecera lleva a `/cart` y la nota del carrito completo viaja con su form nativo (`main-cart-items.liquid:28,183,216`). Esto es así desde antes; B-04 no lo cambia (T20).
4. Notas de más de unos 64 KiB: `fetch` con `keepalive` las rechaza y View cart informa del fallo sin salir. Checkout sigue funcionando (HX-3).
5. Si Shopify normaliza la nota (saltos de línea, espacios finales, Unicode) y el eco no es idéntico, el helper lo trata como fallo y el comprador se queda en el cajón con el error. Lo mismo pasa hoy en los enlaces de venta cruzada. Se comprueba en tienda (§5.4.2).

## 4.4 Nivel de desviación: Nivel 1

- No toca ningún `id` de setting, `default`, schema, opción de select, preset ni clave de locale (RULES §3.5).
- Los dos archivos son superficies candidatas del plan para B-04 (`sections/cart-drawer.liquid:366-368`, `handleDrawerClick` en `assets/theme.js`).
- Se añaden un hook (`data-cart-view-cart`, leído con `closest`, no con `dataset`) y un `id` de elemento. Sin JS el comportamiento no cambia. Con JS, nota limpia o setting oculto, tampoco cambia (T02, T03).

## 4.5 Orden de implementación (un turno, unas 0,25 jornadas más regresión)

1. Preflight §1.2.
2. Harness en rojo (§5.1) contra la base: T01 y T06 deben fallar como en §2.3. Guarda la salida.
3. S-1, S-2 y S-3.
4. Compuertas estáticas §5.2 y harness en verde.
5. Informe §8.

# 5. Criterios de aceptación y pruebas

## 5.1 Harness local (sintético, sin tienda): obligatorio

Ubicación entregable: `agent-comms/outbox-claude/harness-B-04-001/` (`harness.mjs` y las salidas `salida-base.txt` / `salida-final.txt`). Puedes partir del harness del scratch citado en §2.1 si existe en tu entorno; si no, recréalo con el mismo diseño. Sin credenciales, sin URLs de tienda, sin red externa.

- `/theme.js` se sirve leyendo `assets/theme.js` del repositorio en el momento de la prueba, sin copiarlo ni parchearlo. El parche en memoria (`FIX=1`) solo se usa para reproducir la base en rojo, nunca en la ejecución final.
- El HTML del cajón traduce el Liquid DEFINITIVO, incluidos el `id` y el hook de S-1.
- Control de deriva: el harness comprueba con `rg` o `grep` que `data-cart-view-cart`, `id="CartDrawerViewCart"`, `name="note"`, `name="checkout"` y `data-cart-drawer-content` aparecen en `sections/cart-drawer.liquid` real tantas veces como en el HTML generado.
- Sin JS: contexto con `javaScriptEnabled: false`.

Criterios (todos sobre el código final):

| # | Caso | Criterio de aceptación |
| --- | --- | --- |
| H-1 | T01 nota sucia + View cart (clic y Enter, T21) | exactamente 1 POST a `/cart/update.js` con cuerpo `{"note":<borrador exacto>}`; navega a `/cart` solo después del eco |
| H-2 | T02 nota limpia | 0 POST; navegación nativa; `defaultPrevented` falso |
| H-3 | T03 `show_cart_note` desactivado | 0 POST; navegación nativa |
| H-4 | T04 doble clic con pendiente | 1 POST; una sola navegación |
| H-5 | T05 / T06 pendiente y otro destino (en los dos órdenes) | 1 POST; destino final = el del primer clic |
| H-6 | T07 edición en vuelo | no navega; textarea con el texto editado y `data-dirty="true"`; error visible con el texto de `data-note-unconfirmed-message`; un GET de sección más (`syncCart`) |
| H-7 | T08-T12 fallo HTTP, JSON, eco, red y plazo de 3.000 ms | no navega; borrador intacto y sucio; error visible; `syncCart`; foco en `#CartDrawerViewCart` |
| H-8 | T13 Ctrl+clic | 0 POST; `defaultPrevented` falso |
| H-9 | T14 Checkout con nota sucia | 0 POST a `update.js`; el POST nativo a `/cart` contiene `note=` con el borrador y `checkout=` |
| H-10 | T15 / T16 mutación en vuelo y re-render durante el pendiente | sin excepciones; T16 conserva el borrador y navega tras el eco; se informa de T15 como límite §4.3.1 |
| H-11 | T17 eliminar el último artículo | estado vacío sin View cart ni excepciones; se informa del borrador perdido como HX-2 (preexistente) |
| H-12 | T18 nota muy larga | no navega; error visible; borrador intacto; se informa como HX-3 |
| H-13 | T19 fallo y reintento manual | el 2.º clic hace el 2.º POST y navega; ningún POST sin clic |
| H-14 | T20 sin JS | cajón oculto e inerte; el enlace de cabecera navega a `/cart` |
| H-15 | Estados degenerados | 1 línea; 12 líneas (View cart sigue en el pie y H-1 pasa); nota con saltos de línea, emoji y 2.000 caracteres (H-1 pasa con eco idéntico); título de línea de 120 caracteres; nota del servidor no vacía y sin editar (H-2) |
| H-16 | Prueba de que el harness detecta el defecto | contra la base `1fee9e2` (o con S-2 revertido en memoria), H-1 y H-5 (orden T06) FALLAN como en §2.3 |
| H-17 | Sin regresión de la venta cruzada | «View product» con nota sucia, limpia y pendiente se comporta como antes (1 POST / 0 POST / sin segundo POST) |

## 5.2 Compuertas estáticas obligatorias

Pega la salida literal de cada una en el informe:

```
node --check assets/theme.js
npx --no-install shopify theme check --fail-level error   # esperado: 93 files inspected with no offenses found.
node scripts/theme-check-sanity.mjs
node scripts/locale-key-inventory.mjs                     # sin claves nuevas ni huérfanas
node scripts/dataset-hooks.mjs
node scripts/json-validate.mjs
rg -c 'data-cart-view-cart' sections/cart-drawer.liquid assets/theme.js       # 1 y 1
rg -c 'CartDrawerViewCart' . --glob '!node_modules' --glob '!agent-comms/**'   # solo sections/cart-drawer.liquid: 1
git diff --stat 1fee9e2 -- . ':!agent-comms'               # solo los dos archivos de §4.2 (más lo que hayan commiteado B-01/B-03)
git diff 1fee9e2 -- sections/cart-drawer.liquid           # una sola línea cambiada
```

El literal de contraseña no se busca ni se imprime. Su recuento antes del push lo hace el coordinador (D12).

## 5.3 Cinco compuertas (AGENTS.md / RULES §2)

| Compuerta | Exigencia para esta tarea |
| --- | --- |
| 1. Requisitos / ledger | Declarar que B-04 no cierra ni modifica ninguna fila (§6), con evidencia `archivo:línea` de S-1/S-2 y el ID de prueba del harness. No editar el ledger. |
| 2. Estados degenerados | Vacío: T17 (sin form ni enlace). Uno solo: 1 línea. Muchos: 12 líneas (H-15). Muy largo: nota de 2.000 caracteres y T18 de 70.000; título de 120. Faltante: textarea ausente (T03) y nota del servidor vacía (T01). |
| 3. Consistencia | Reutiliza `handleCrossSellView`/`saveNoteAndNavigate`, `CART_NOTE_SAVE_TIMEOUT` y los mensajes `data-saving-note-message`/`data-note-unconfirmed-message` (`cart-drawer.liquid:50-51`). Sin plazo, selector ni texto duplicados. Sin formateo de moneda. |
| 4. Superficie del comerciante | Sin settings, labels, schema ni locales nuevos. |
| 5. Tienda real | No ejecutable (D22). Pendiente de §5.4. Estado máximo: «código completo». |

## 5.4 Pendiente para R-B en tienda (credenciales, D22)

Marca cada punto en el informe como «pendiente de credenciales (D22)». Ninguno se declara cumplido con el harness.

1. Preview no publicada de Sartorial en `tema-qkqpke0j`: nota sucia + View cart → `/cart` muestra la nota guardada; nota limpia; setting `show_cart_note` desactivado.
2. Eco real de `/cart/update.js` con notas que contengan saltos de línea, espacios finales, emoji y unos 2.000 caracteres: comprobar que la nota devuelta es idéntica (§4.3.5). Si Shopify normaliza, devolver a R-D.
3. Fallos con red real limitada (DevTools offline o lenta) y edición en vuelo.
4. Mutaciones concurrentes (cantidad, eliminar, añadir, reconciliación de B-03) con View cart: solo con autorización de mutación del carrito de prueba; se informa sin prometer resolución (§4.3.1).
5. Checkout del cajón y de `/cart` con nota sucia, con y sin JS: la nota llega al checkout. Los acelerados no se certifican.
6. Móvil simulado con viewport verificado (390 px) y escritorio (1280 px): View cart accesible por teclado y lector de pantalla. El aviso de estado y el de error se anuncian.

# 6. Filas del ledger y estado máximo

`docs/requirements-ledger.md` no tiene una fila de nota de pedido ni de navegación del cajón (`rg -n -i "nota|note" docs/requirements-ledger.md` solo encuentra filas ajenas). B-04 no cierra ni modifica ninguna fila. Solo hay regresión en:

| Fila (línea) | Estado actual | Relación |
| --- | --- | --- |
| «Focus Trap y Gestión en Modales/Drawers» (`:50`) | `cumplido` | El foco vuelve a View cart tras un fallo (H-7). Sin cambio de estado. |
| «Live Regions (`aria-live`)» (`:54`) | `cumplido` | Reutiliza `[data-cart-status]` y `[data-cart-error]`. Sin cambio. |
| «Checkout Acelerado» (`:66`) | `cumplido` | Sin tocar (`cart-drawer.liquid:361-365`). Sin cambio. |

El implementador NO edita el ledger. Estado máximo de B-04 en este turno: «código completo» (en el plan, P2 «planificado» → código completo).

# 7. Riesgos y hallazgos extra

## 7.1 Riesgos de regresión (cada uno con su comprobación)

| ID | Riesgo | Mitigación / prueba |
| --- | --- | --- |
| R-1 | La navegación tras confirmar la nota cancela en el cliente una mutación en vuelo (T15). | Límite §4.3.1, documentado. Comprobar en tienda solo con autorización (§5.4.4). |
| R-2 | Eco no idéntico por normalización de Shopify: falso «no confirmado» que impide salir por View cart. | §5.4.2. Checkout nativo sigue disponible. Si ocurre, retorno a R-D (afecta también a la venta cruzada). |
| R-3 | Concurrencia en `assets/theme.js` con B-01/B-03. | Turnos secuenciales con commit del coordinador; anclas textuales; preflight §1.2. |
| R-4 | `id` duplicado. | `rg` de §5.2; el cajón se monta una vez (`layout/theme.liquid:139-140`). En `/cart`, `main-cart-items` usa `CartNote`, no este `id`. |
| R-5 | El aviso «Saving your cart note…» queda visible hasta que la página cambia. | Sin efecto: la navegación lo descarta. En fallo, `clearMessages` lo quita (`:3039`). |
| R-6 | B-03 cambia `syncCart` y la rama de fallo deja de repintar. | H-6/H-7 cuentan el GET de sección; el preflight anota cambios de firma. |
| R-7 | El enlace View cart en `/cart` (cajón abierto sobre la página de carrito). | Navega a la misma URL tras guardar; sin lógica especial. Se comprueba en tienda (§5.4.1). |

## 7.2 Hallazgos extra fuera de alcance (sin aplicar; no tocar)

- **HX-1 (misma clase que B-04, P2 propuesto).** Los enlaces de título (`cart-drawer.liquid:177`) y de imagen (`:163`) de cada línea también salen del cajón de forma nativa y pierden el borrador sucio: `handleDrawerClick` no los envía al guardado. Barrido RULES §4.3: `rg -n '<a ' sections/cart-drawer.liquid snippets/cart-drawer-recommendations.liquid`. Los demás enlaces son de venta cruzada (ya guardados), de propiedades `_blank` (nativo por contrato, `:202`) o del estado vacío (sin nota, `:135`). Parche preparado (PD-3), en `handleDrawerClick`:
  ```diff
  -      const viewCartLink = event.target.closest('[data-cart-view-cart]');
  +      const viewCartLink = event.target.closest(
  +        '[data-cart-view-cart], [data-cart-item-key] .cart-drawer-item__title a, [data-cart-item-key] a.cart-drawer-item__media',
  +      );
  ```
- **HX-2 (preexistente).** Al eliminar el último artículo con un borrador sucio, el estado vacío no tiene textarea y la guarda de `renderSection` (`:3415-3420`) no puede conservarlo: el borrador se pierde (T17). No hay View cart en ese estado. Sin parche: decidir el comportamiento (guardar antes de vaciar o aceptar la pérdida) excede B-04.
- **HX-3 (preexistente, también en la venta cruzada).** Una nota que supere el límite de cuerpo de `keepalive` (unos 64 KiB en Chromium) hace fallar `fetch` antes de enviar (T18). El límite real de longitud de la nota en Shopify no está verificado.

# 8. Informe del implementador

Ruta: `agent-comms/outbox-claude/CLAUDE-REPORT-B-04-001.md`.

Contenido obligatorio:

1. Cabecera completa RULES §1.4: ID, Estado, Decisión requerida, Resumen en 5 líneas, Archivos tocados, Desviaciones, Hallazgos extra, Verificación y Afirmaciones falsables.
2. Identidad: SHA de `HEAD` de `lote-b` antes de editar, `git log --oneline 1fee9e2..HEAD`, `git diff --stat` y lista cerrada permitida frente a la tocada, con líneas exactas finales.
3. Salida literal del preflight (§1.2), de las compuertas (§5.2) y del harness en rojo (base) y en verde (final). Etiqueta todo como «sintético» o «estático».
4. Tabla H-1 a H-17 con resultado, número de POST, destino, estado del borrador y foco.
5. Decisión aplicada de cada PD de §9.1, citando el dictamen R-D.
6. Ledger: «sin filas cerradas ni modificadas» y la regresión de §6.
7. Límites de §4.3 confirmados o corregidos, y lista de §5.4 marcada como «pendiente de credenciales (D22)».
8. Ninguna credencial, URL de tienda con token, cookie ni valor de entorno. No abras `.secrets`, no ejecutes gate5 y no crees metafields (D13, D17).
9. Sin commit ni push: los hace el coordinador tras la revisión (D11, D12, D16).

# 9. Decisiones para el R-D y conflictos

## 9.1 Puntos que decide el R-D (PD)

| ID | Pregunta | Recomendación del redactor |
| --- | --- | --- |
| PD-1 | ¿Hook e `id` en el Liquid (S-1), o solo un selector de clase `a.cart-drawer__view-cart` en JS con un único archivo? | Hook e `id`. El `id` es lo que devuelve el foco a View cart tras un fallo (T08-T12 frente a `NOID=1`); sin él, el foco salta a Close. El hook desacopla JS y estilos. Las dos rutas son superficies del plan. |
| PD-2 | ¿Renombrar `handleCrossSellView` a un nombre genérico? | No. Sería un refactor de lo que funciona (RULES §3.9); basta con actualizar el comentario (S-3). |
| PD-3 | ¿Se incluye HX-1 (enlaces de línea) en B-04? | No en esta tarea. El plan limita B-04 a View cart. Registrarlo como hallazgo P2 para R-B o una tarea posterior con el parche de §7.2. Si el R-D lo incluye, es el mismo archivo y Nivel 1, y H-1/H-5 se extienden a esos enlaces. |
| PD-4 | ¿Basta la evidencia sintética para entregar como «código completo», dejando §5.4 a R-B en tienda? | Sí (D22). El plan exige el contrato completo en R-B, y el harness lo cubre sin tienda salvo el eco real de Shopify y las mutaciones reales. |

## 9.2 Conflictos detectados (y si requieren a Johandry según D10)

| ID | Conflicto | ¿Johandry? |
| --- | --- | --- |
| K-1 | El plan V4.1 asigna B-04 a GPT/Antigravity; D9 y D11 lo asignan a Claude con revisor Opus de contexto limpio. | No (decidido en D9/D11). |
| K-2 | RULES §2.5 exige prueba en tienda; D22 limita a «código completo» sin credenciales. | No (D22). |
| K-3 | Localizadores del plan desplazados (+11). | No: corregidos en §1.1 por ancla. |
| K-4 | PD-3 ampliaría B-04 más allá de View cart. | No, si el R-D lo trata como parte del contrato «nota y navegación» de B-04. Sí, si lo considera «cambio fuera del plan» (D10). Con la recomendación (no incluir), no aplica. |
| K-5 | Concurrencia con B-01/B-03 en `assets/theme.js` (§1.4). | No: el coordinador lo resuelve con turnos. |
