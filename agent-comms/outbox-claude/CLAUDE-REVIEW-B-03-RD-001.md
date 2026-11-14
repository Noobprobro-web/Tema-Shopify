# CLAUDE-REVIEW-B-03-RD-001: R-D de la directiva B-03 (alta al carrito con respuesta perdida)

```text
ID: CLAUDE-REVIEW-B-03-RD-001
Fecha: 2026-11-05
Autor: Claude (Opus), revisor R-D independiente de contexto limpio (D11). No redactó la directiva ni la implementará.
Objeto: agent-comms/outbox-claude/CLAUDE-DIRECTIVA-B-03-001.md (sin commit; base declarada a0274ce), rama lote-b, HEAD 4e5c6d6.
Estado: Dictamen R-D emitido. APROBADA CON CAMBIOS (lista cerrada en §2: C-1 a C-3 obligatorios; O-1 a O-3 opcionales).
  Equivale a «apta con cambios» de la condición §1.1.1 de la directiva. Donde difiera, manda este dictamen.
Decisión requerida: la implementación NO requiere a Johandry. La prueba real de R-B SÍ (PD-8, §3): REQUIERE AUTORIZACIÓN
  EXPRESA DE JOHANDRY. No bloquea la implementación ni el arnés.
Resumen en 5 líneas:
  1. Defecto confirmado: addItem (theme.js:2580-2652) y addSelectedItems (:4145-4212) usan fetchCommerce sin plazo y dicen
     «try again» sin leer el carrito. Arnés repetido sobre HEAD: D1/D2 2 uds., D3 4, D5 2/2, D4 botón bloqueado a 12 s.
  2. E1-E11 aplicadas por mí desde el texto de la directiva sobre git show 4e5c6d6:assets/theme.js: 11/11 anclas de cuenta 1,
     resultado byte a byte igual al prototipo del redactor (theme-d-newhead.js), +242/−55, node --check OK, gates estáticos OK.
  3. Hallazgo de la R-D (no es P0/P1 nuevo; residuo del mismo P2): con un error de red el POST puede aplicarse DESPUÉS de la
     lectura; el diseño dice «try again» y el reintento duplica (escenario R5: 101=2). Lo mismo con E8. C-1 lo elimina.
  4. C-1: «puede aterrizar después» = plazo, sin respuesta o 5xx. «try again» queda solo para HTML 4xx (429): R5 y E8 sin
     duplicado, diff sigue +242/−55. C-2: corrige un valor esperado del preflight. C-3: actualiza textos, tabla y criterio 6.
  5. PD-1 cajón, PD-2 ampliado (C-1), PD-3 claves existentes, PD-4 renombrar, PD-5 y PD-6 fuera, PD-7 fila nueva, PD-8 Johandry.
Archivos tocados: solo este archivo nuevo. Fuera del repo, en
  /tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rd-b03/: head.js, apply.py, mine.js,
  mkc.py, mine-c.js, mine-c2.js, mine-c1only.js, harness.mjs (copia del redactor), harness-rd.mjs, rd-*.txt, wt/ (copia del
  árbol de 4e5c6d6 con node_modules enlazado), count-rd.py. Sin git de escritura, sin red externa, sin tiendas, sin .secrets,
  sin gate5, sin variables de entorno.
Desviaciones (Nivel 1 o Nivel 2): ninguna. Con C-1 la solución sigue siendo Nivel 1 (sin id, name, setting, schema ni clave t:).
Hallazgos extra fuera de alcance (con parche listo): ninguno con parche. H-RD-1 (carrito en página + sin red: navega a /cart y
  el navegador muestra su página sin conexión; seguro, no invita a reintentar; P3). H-1 a H-6 de la directiva confirmados.
Verificación (comando, resultado y qué demuestra/qué no): §1. ESTÁTICA y SINTÉTICA (Chromium local, servidor simulado, sin
  tienda). No demuestra el servidor real de Shopify, el orden real de aplicación, apps, Safari, móvil real ni lectores de pantalla.
Lista de afirmaciones falsables numeradas: §5.
```

---

## 1. Verificación

### 1.1 Base y anclas (ESTÁTICO)

- `git diff --quiet a0274ce 4e5c6d6 -- assets/theme.js sections locales layout` → sin diferencias. 4e5c6d6 (B-05) solo cambia `snippets/localization-selectors.liquid`, `docs/requirements-ledger.md` y `agent-comms/`. `git show 4e5c6d6:assets/theme.js` es idéntico a `theme-newhead.js` del redactor (`cmp`).
- Anclas de §1.3 comprobadas en HEAD: `CartDrawer` `:2293`, `addItem` `:2580`, `addCrossSell` `:2679`, `checkCart` `:2808`, `syncCart` `:3321`, `CompleteTheLook` `:4018`, `addSelectedItems` `:4145`, `CART_CROSS_SELL_ADD_TIMEOUT` `:2290,2696`; cajón `:38,39,49,86,87`; look `:65,66`; locales `:80,101,102,142`; `layout/theme.liquid:139`. Las anclas de E1-E11 (`:2286`, `:2325`, `:2362`, `:2580`, `:2639`, `:2649`, `:2696`, `:3494`, `:4149`, `:4166`, `:4205`) caen donde dice la directiva. `git status --short --untracked-files=no` vacío.
- Error del preflight (C-2): `grep -n "fetchCommerce(" assets/theme.js` devuelve 3 líneas (`:2595`, `:3199`, `:4167`), no 4. La definición `:147` es `const fetchCommerce = (url, ...`, que no contiene `fetchCommerce(`.

### 1.2 Fidelidad del prototipo (ESTÁTICO)

- `apply.py` (mío) extrae los bloques `old_string`/`new_string` de E1-E11 del Markdown y los aplica en orden sobre HEAD: cuenta 1 en las 11; `cmp mine.js ../b03/theme-d-newhead.js` → idénticos. `git diff --no-index --stat` → `242 insertions(+), 55 deletions(-)`; `node --check` OK.
- Hunks (`-U0`): solo en `:2287-2291` (constantes), `:2326` y `:2364` (`connectedCallback`), `:2579-2653` (`cartBaseline`/`addItem`/`showUnconfirmedAdd`), `:2696`, `:3494` y `:4152-4208`. Cuerpos de `handleDrawerClick`, `handleCrossSellView` + `saveNoteAndNavigate`, `syncCart` y `endMutation` idénticos byte a byte antes y después (`diff` vacío). B-04 se desplaza +79 (`handleDrawerClick` `:2493`) y +138 (`handleCrossSellView` `:3141`, `saveNoteAndNavigate` `:3158`), como dice §1.4.
- Criterio 3 sobre `mine.js`: `CART_CROSS_SELL_ADD_TIMEOUT`=0, `CART_ADD_TIMEOUT`=4, `fetchCommerce(`=1, `readCartQuantities(`=4, `showUnconfirmedAdd`=4, `cartSnapshotStale`=5, `cartBaseline`=5, `classifyAdd`=3. Criterio 5: `cartAddUrl` en 3 líneas, las tres `await fetch(this.dataset.cartAddUrl, {` (`:2705`, `:2842`, `:4330`).
- Gates sobre `wt/` (árbol de 4e5c6d6 con `mine.js`): Theme Check «93 files inspected with no offenses found.», `theme-check-sanity`, `dataset-hooks` y `json-validate` con exit 0.

### 1.3 Arnés del redactor, repetido (SINTÉTICO)

El `harness.mjs` del redactor no parchea en memoria cuando se le pasa `THEMEJS` (el parche `fix.mjs` solo se usa con `FIX=1`, que no usé). Lo ejecuté sobre `head.js` (HEAD) y sobre `mine.js`, sin `pageerror` ni excepciones:

- Base: D1 y D2 101=2 tras reintento, D3 4, D4 a 12 s cajón cerrado y botón sin liberar, D5 2/2, E6 POST add=2, E12 final 2. Reproduce §2.3.
- Directiva: coincide con `salida-dir-final.txt` del redactor salvo D6 (el mensaje intermedio de `changeLine` depende del ritmo; cantidad final 3 en ambos, como declara §2.3).

### 1.4 Escenarios propios de la R-D (`harness-rd.mjs`, SINTÉTICO)

| Esc. | Situación | Directiva (`mine.js`) | Con C-1 (`mine-c1only.js`) |
| --- | --- | --- | --- |
| R1 | 429 HTML sin aplicar | «try again», 1 GET, 101=0 | igual (rama `not_applied` sigue viva) |
| R2 | 502 HTML sin aplicar | «try again» | Check cart, 1 GET |
| R3 | `pageshow` persistido tras quitar la línea en otra pestaña + `lost` | «try again» y reintento: **101=2** | Check cart, 101=1 |
| R4 | `data-item-count` que no cuadra con las filas + quitar + `lost` | «try again» | Check cart, 101=1 |
| R5 | La conexión se corta y el servidor aplica 400 ms después | «try again» y reintento: **101=2** | Check cart, 101=1 |
| R6 | Alta normal | 0 GET, éxito | igual |

Con C-1 sobre el arnés completo del redactor (`mine-c2.js` incluye además O-1/O-2; `mine-c1only.js` solo C-1): cambian E1, E9, E14, E16 (pasan a Check cart, o a navegar a `/cart` sin cajón) y E8 (Check cart, 101=1, sin duplicado). El resto, idéntico. `git diff --stat` de C-1: `+242/−55`, sin cambio. Qué no demuestra: el tiempo real entre el corte y la confirmación en Shopify; el harness lee `/cart.js` sin coste de conexión nueva, que en real estrecha la ventana de R5, pero no la cierra.

### 1.5 Casos límite pedidos

- **Cantidades máximas, carrito lleno y 422 de stock:** Shopify responde JSON 422; camino actual sin GET (E3). Si hubiera alta parcial, el delta queda entre 0 y lo pedido → `unknown`, nunca «try again».
- **Misma variante en varias líneas (propiedades, plan de venta):** suma por variante en el cajón y en `/cart.js` (E18: 101 en 2 líneas, 40 líneas, 1 GET). Las filas `[data-cart-item-key]` solo existen en el cajón y en `main-cart-items.liquid`, fuera de `<cart-drawer>`; `item.url` lleva `?variant=`.
- **A-01 / `selling_plan`:** `FormData(form)` sigue enviando el control único de variante y de plan de A-01; el control 5A-003 de `{}` se conserva en el camino JSON (E11, 0 GET). No rompe A-01.
- **Dos pestañas:** E7 y E8b correctos. E8 (otra ventana visible quita la línea) y R3 duplican con la directiva y dejan de hacerlo con C-1. El único residuo con C-1 es un «añadido» falso si otra pestaña añade la misma variante mientras se pierde la respuesta: el carrito tiene la variante y no hay duplicado.
- **B-04 y `syncCart`/revisiones:** `showUnconfirmedAdd` abre el cajón dentro de la mutación; el `syncCart()` de `open()` se difiere (`pendingMutations`) y `endMutation` resincroniza con `reconcile` porque `renderedRevision !== syncRevision`. Los avisos viven fuera de `[data-cart-drawer-content]` (`cart-drawer.liquid:84-90`), así que `renderSection` no los borra y el foco en Check cart se conserva (E2, E10). `renderSection` solo gana `cartSnapshotStale = false`. R-6 de B-04 se cumple.

---

## 2. Cambios exigidos (lista cerrada)

**C-1 (obligatorio). Una respuesta ausente o 5xx no prueba que el alta no entre después (PD-2 ampliado).**

- En E4 (`addItem`) y E10 (`addSelectedItems`), sustituir en el `new_string`:
  `const mayStillLand = timedOut || response?.status === 504;` →
  `const mayStillLand = timedOut || !response || response.status >= 500;`
- En E1, el comentario de `classifyAdd` pasa a:
  ```js
  // - not_applied: none moved, and the POST could not still land later. Without any
  //   response (network error, our own deadline) or with a 5xx page from Shopify or a
  //   gateway, the request may still be applied after the read.
  ```
- En E4, la frase `so the "try again" message only appears when nothing was added.` pasa a `so "try again" only appears when the server answered, nothing was added and the request cannot land later.`
- Motivo: Shopify no cancela un POST cuando el cliente pierde la conexión, y con un 502/500 de pasarela tampoco se sabe si el origen lo aplicó. Con la directiva, R5 y E8 dicen «try again» con el alta ya aplicada y el reintento duplica. Con C-1, todo caso que no sea un HTML 4xx (429, reto anti-bot) cae en Check cart, que nunca invita a reintentar y muestra el carrito real. Coste: tras un corte de red el comprador ve «We could not confirm the update.» + Check cart en lugar de «try again». Ningún escenario duplica.
- El diff sigue en `+242/−55` y las cuentas del criterio 3 no cambian.

**C-2 (obligatorio). Preflight §1.3:** el valor esperado de `grep -n "fetchCommerce("` en HEAD son 3 líneas (`:2595`, `:3199`, `:4167`). Hay que quitar «`:147` (definición)». Si no, el implementador puede detenerse por una discrepancia que no existe.

**C-3 (obligatorio). Textos y arnés coherentes con C-1:**

- §2.1 y §3.1.3: `not_applied` = ninguna variante se movió y el servidor respondió con algo que no es JSON y no es 5xx (HTML 4xx). En los demás casos, `unknown`.
- Tabla de §4.2. **E1** (`drop`): cajón abierto con «We could not confirm the update.», Check cart visible y enfocado, 1 GET, 101=0, sin error de formulario; tras Check cart, una nueva alta deja 101=1. **E8**: deja de ser informativo; espera Check cart, 101=1 y que no haya «try again». **E9**: cajón con el aviso, 201/202=0/0, sin error del look. **E14** (502): Check cart, 1 GET. **E16** (`nodrawer` + `drop`): navega a `/cart`, 201/202=0/0. Se añaden **R1** (`429noapply`, HTML 429 sin aplicar: «try again», 1 GET, 101=0) y **R5** (`race`: `route.abort('connectionreset')` y el servidor aplica 400 ms después: Check cart, 101=1, ningún POST extra).
- §3.5, ramas alcanzables: `not_applied` (R1); `unknown` por red (E1, R5), por 5xx (E13, E14), por plazo (E12) y por carrito ilegible (E2, E10).
- Criterio 6: en `fix`, `resumen fallos=0` en todos, también E8, R1 y R5. En `base` deben pasar D0, D6, E3, E4 y E11; el resto se informa con su total, sin lista fija.
- §6.1: se sustituye el «Riesgo residual E8» por el residuo real tras C-1 («añadido» falso si otra pestaña añade la misma variante durante una respuesta perdida, sin duplicado). H-3 queda cerrado.

**Opcionales (no bloquean; el implementador NO los aplica salvo que el coordinador los incorpore a la directiva):**

- O-1. `cartSnapshotStale` inicial a `performance.getEntriesByType?.('navigation')?.[0]?.type === 'back_forward'` y `pageshow` con `event.persisted` → `true`. Cubre las páginas restauradas desde la caché HTTP o desde la bfcache sin `visibilitychange`. Con C-1 solo mejora el mensaje (R3: éxito en lugar de Check cart).
- O-2. `drawerQuantities` devuelve `null` si la suma no es igual a `Number(drawer.dataset.itemCount)`. Protege contra un cajón que no pinte todas las líneas. Mismo efecto que O-1 (R4).
- O-3. Arrancar el plazo de 10 s después de `await baseline`. Hoy, con la línea base por `/cart.js` (≤ 5 s), el POST puede quedarse con 5 s. Es seguro, porque acaba en `unknown`.

---

## 3. Decisiones PD-1 a PD-8

- **PD-1. Cajón cuando está al día y `/cart.js` si no (propuesto): SÍ.** Con C-1, una línea base desfasada ya no puede producir un «try again» falso, salvo con HTML 4xx, donde el alta no entró de todos modos. El GET por alta no se justifica. O-1/O-2 son opcionales.
- **PD-2. 504: AMPLIADO por C-1.** «Puede aterrizar después» = plazo propio, sin respuesta o cualquier 5xx.
- **PD-3. Se reutilizan `update_unconfirmed` y `check_cart`: SÍ.** Existen en `en.default.json:101-102` y en `es.json`, los dos únicos locales del storefront. Sin claves nuevas.
- **PD-4. Renombrar a `CART_ADD_TIMEOUT`: SÍ.** Un solo plazo para las tres altas (criterio 3 = 4 usos).
- **PD-5. `addCrossSell`: FUERA.** Ya cumple: no invita a reintentar y reconcilia.
- **PD-6. `changeLine`: FUERA.** La cantidad es absoluta y repetirla no suma (D6); H-1 queda P3.
- **PD-7. Ledger: FILA NUEVA** «Resiliencia del alta al carrito ante respuesta perdida (sin duplicar líneas)», con estado máximo `código completo` sin tienda. La propone el implementador y la escribe el coordinador; después `node scripts/ledger-verify.mjs` (hoy 60 filas, 47 `cumplido`). En `:71` va solo una nota.
- **PD-8. LA PRUEBA DE R-B QUE AÑADE AL CARRITO EN UN PREVIEW NO PUBLICADO REQUIERE AUTORIZACIÓN EXPRESA DE JOHANDRY.** Técnicamente es un uso normal del storefront. El carrito es de sesión: no es un producto, una app ni configuración, y D13 no lo nombra. Aun así, D10 detiene «cualquier escritura en tiendas distinta de subir temas no publicados», y la fila R-B del plan (`:377`) dice literalmente «Mutación real requiere autorización». Alcance propuesto para pedirla: solo `/cart/add.js`, `/cart/change.js` y `/cart/clear.js` en previews no publicados de `tema-qkqpke0j`, en la sesión propia de la prueba; sin checkout, pedidos, códigos de descuento ni cuentas de cliente; el carrito queda vacío al terminar. No bloquea la implementación, el arnés ni el estado `código completo`.

---

## 4. Veredicto

**APROBADA CON CAMBIOS: C-1, C-2 y C-3** (§2). O-1 a O-3 son opcionales. No hay P0/P1 nuevo: el residuo de R5/E8 es el mismo defecto P2 en una ventana más estrecha, y C-1 lo cierra. La implementación puede empezar cuando el coordinador incorpore C-1 a C-3 a la directiva o la entregue junto con este dictamen. Estado máximo sin tienda: `código completo`.

---

## 5. Afirmaciones falsables

1. `git diff --quiet a0274ce 4e5c6d6 -- assets/theme.js sections locales layout` termina con exit 0.
2. E1-E11, extraídas del Markdown y aplicadas sobre `git show 4e5c6d6:assets/theme.js`, cuentan 1 cada una, y el resultado es idéntico a `scratchpad/b03/theme-d-newhead.js`, con `+242/−55`.
3. En HEAD, `grep -n "fetchCommerce(" assets/theme.js` devuelve exactamente `:2595`, `:3199` y `:4167`.
4. Con la directiva tal cual, el escenario R5 (corte de conexión y aplicación 400 ms después) acaba en «try again» y, tras reintentar, 101=2. E8 acaba en 101=2.
5. Con solo C-1, R5, E8 y R3 acaban con Check cart y 101=1; R1 (429 HTML) sigue en «try again» con 1 GET; E4 hace 0 GET; `git diff --stat` sigue en `+242/−55`.
6. Los cuerpos de `handleDrawerClick`, `handleCrossSellView`/`saveNoteAndNavigate`, `syncCart` y `endMutation` no cambian con E1-E11.
7. Con E1-E11 aplicadas, Theme Check da «93 files inspected with no offenses found.», y `theme-check-sanity`, `dataset-hooks` y `json-validate` terminan con exit 0.
