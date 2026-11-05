ID: CLAUDE-REVIEW-B-04-001
Fecha: 2026-11-05
Autor: Claude (Opus), revisor independiente de contexto limpio (D11). No redactó la directiva, ni la R-D, ni el código.
Objeto: B-04 en `lote-b`, HEAD `9834bac` más cambios sin commit: `git diff HEAD -- assets/theme.js sections/cart-drawer.liquid`, `agent-comms/outbox-claude/harness-B-04-001/` y `agent-comms/outbox-claude/CLAUDE-REPORT-B-04-001.md`. Contrato: `CLAUDE-DIRECTIVA-B-04-001.md` + R-D `CLAUDE-REVIEW-B-04-RD-001.md` (C-1..C-5; PD-1 hook+id, PD-2 no renombrar, PD-3 FUERA, PD-4 código completo).
Estado: **ACEPTADO**. Sin P0, P1 ni P2. Cuatro P3 de exactitud documental (§4). Ninguno exige tocar código ni repetir pruebas. Estado máximo: «código completo» (D22).
Decisión requerida: ninguna de Johandry (PD-3 = FUERA). El coordinador puede hacer commit de los dos archivos de código, del arnés y de los informes (D12/D16). Corregir los P3 del informe es opcional y no bloquea.
Resumen en 5 líneas:
1. El diff es mínimo y literal a S-1/S-2/S-3: +1/-1 en `sections/cart-drawer.liquid:366` y +11/-2 en `assets/theme.js` (rama `:2527-2533` en `handleDrawerClick`, comentario `:3148-3150`). No toca ninguna región de B-01 ni de B-03.
2. El arnés del implementador, ejecutado por mí, da base en rojo y final en verde. Mis salidas son byte a byte iguales a las entregadas (`cmp`), dos ejecuciones finales son idénticas y no hay rutas absolutas.
3. Mi sonda (15 casos, servidor local propio y `<a>` de View cart extraído del Liquid real) da 0 fallos en el código final y 9 en la base. Cubre la nota sucia, limpia y oculta, el doble clic real, la edición en vuelo, los fallos 5xx y de red con el foco, el último artículo, el modo sin JS y el alta de B-03 en vuelo o con respuesta perdida.
4. Regresión: A-01/B-02 56/56, B-01 0 fallos y B-03 0 fallos. Compuertas estáticas en verde, con 93 archivos y 0 ofensas en Theme Check.
5. Los enlaces de línea (HX-1) siguen nativos, como manda PD-3. Checkout sigue con POST nativo (`note=` y `checkout=`).
Archivos tocados: solo este archivo nuevo. Fuera del repo, en `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rev-b04/`: `probe.mjs`, `probe-fix.txt`, `probe-base.txt`, `base.txt`, `fix1.txt`, `fix2.txt` y `count-rev.py`. Sin git de escritura, sin red externa, sin tiendas, sin `.secrets` y sin gate5.
Desviaciones (Nivel 1 o Nivel 2): ninguna. La entrega es Nivel 1: no toca settings, schema, locales, `id` de setting ni `default`.
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo en el código. Sigue vigente HX-1 (P2, parche en la directiva §7.2), igual que HX-2, HX-3, H-RD-1 y H-RD-2, que son preexistentes. Hay además un defecto de la directiva, no de la entrega: §1.2 exigía que cada ancla apareciera una sola vez, pero `this.contains(link)` y `data-cross-sell-add]');` ya aparecían 2 veces en `1fee9e2` (P3-1).
Verificación (comando, resultado y qué demuestra/qué no): §1-§3. Es SINTÉTICA (Chromium local) y ESTÁTICA. Demuestra el mecanismo con el `theme.js` real. No demuestra el eco real de Shopify, `keepalive` en tienda, mutaciones reales, Safari ni móvil, que quedan en §5.4 de la directiva como «pendiente de credenciales (D22)».
Lista de afirmaciones falsables numeradas:
1. `git diff --stat 9834bac -- . ':!agent-comms'` devuelve solo `assets/theme.js | 13` y `sections/cart-drawer.liquid | 2` («12 insertions(+), 3 deletions(-)»).
2. `rg -n "B-04. View cart|A drawer link that leaves" assets/theme.js` devuelve `2527` y `3148`.
3. `rg -n "data-cart-view-cart|CartDrawerViewCart|cartViewCart" . --glob '!node_modules' --glob '!agent-comms/**'` devuelve solo `assets/theme.js:2529` y `sections/cart-drawer.liquid:366`.
4. `node harness.mjs . base 9834bac` y `node harness.mjs . fix` (dos veces) reproducen `salida-base.txt` y `salida-final.txt` byte a byte (`cmp`, exit 0). Un `grep -nE "/(home|tmp|root)/"` sobre el directorio del arnés sale con exit 1.
5. `probe.mjs . fix` termina en `fallos=0` y `probe.mjs . base` deja 9 líneas `FAIL`.
6. `git show 1fee9e2:assets/theme.js | grep -c 'this.contains(link)'` devuelve 2, y lo mismo en `9834bac`.
7. La compuerta del literal da 0 en todos los archivos de B-04 y en esta revisión (§5). `ctx-check` da 0 fuera de axe.

---

# 1. Diff (estático)

- **S-1** `sections/cart-drawer.liquid:366`: solo la etiqueta de apertura del `<a>` gana `id="CartDrawerViewCart"` y `data-cart-view-cart`. La clase, el `href`, el texto (`sections.cart.view_cart`) y el cierre no cambian. El `id` es único en el repo; los otros `id` del cajón son `CartDrawerTitle` (`:67`) y `CartDrawerNote` (`:318`).
- **S-2** `assets/theme.js:2527-2533`: la rama está justo después de `viewLink` y antes de `crossSellButton`, y es idéntica al bloque de la directiva. No toca `handleDocumentClick` (`:2467`), que sigue saliendo con `this.contains(link)`. No toca `saveNoteAndNavigate`, `renderSection` ni `syncCart`.
- **S-3** `:3148-3150`: cambia solo el comentario, y `handleCrossSellView` conserva su nombre (PD-2).
- **B-01/B-03:** los dos hunks (`@@ -2526` y `@@ -3140`) quedan dentro de `CartDrawer`, fuera de `ThemeDrawer` y fuera de `addItem`, `addCrossSell`, `beginMutation`/`endMutation` y `syncCart`. Entre `1fee9e2` y `9834bac`, B-03 no cambió ninguna línea con `handleCrossSellView`, `saveNoteAndNavigate`, `data-cross-sell-view`, `cart-drawer__view-cart`, `noteVersion` ni `data-dirty` (el `grep` de `git diff 1fee9e2 9834bac` sale con exit 1).
- **Enlaces de línea (PD-3 FUERA):** no se tocan. P14 de la sonda lo confirma: el título de línea navega de forma nativa y hace 0 POST.
- **Checkout:** sigue siendo `type="submit" name="checkout"` sin interceptar (T14 del arnés, P15 de la sonda).

# 2. Arnés del implementador (sintético)

Ejecutado desde la raíz del repo, con la salida en el scratch:

```
base=0 fix1=0 fix2=0
det-OK      (cmp fix1 fix2)
final-eq    (cmp fix1 salida-final.txt)
base-eq     (cmp base salida-base.txt)
abs-rc=1    (grep de rutas absolutas en harness-B-04-001/: ninguna)
```

- Base `9834bac`: T01 da `updates:0` y `serverNote:""`, y T06 navega a `/cart` (pierde el primer destino). Final: T01 hace 1 POST `Gift wrap please`. T06 va a `/products/xsell`. T07 a T12 y T18 no navegan, dejan `dirty:"true"` y el error visible, y hacen `sections:2`. El foco queda en `CartDrawerViewCart`, salvo en T07, donde queda en `CartDrawerNote`.
- Modificadores en el final: Ctrl, Shift, Alt, botón central, Ctrl+Enter y Shift+Enter dan todos `updates:0` y eventos `click:false` o `auxclick:false`. Meta navega de forma nativa en la misma pestaña, igual que en la base (H-RD-1). Los 21 escenarios y H-15/H-17 cumplen el contrato de la directiva más la R-D.
- El control de deriva da `OK` en los dos modos, y en la base el hook y el `id` aparecen 0 veces. `/theme.js` es el archivo real, sin parche en memoria.

# 3. Sonda propia del revisor (sintética; `rev-b04/probe.mjs`)

La sonda usa un servidor HTTP propio en 127.0.0.1, distinto del `page.route` del implementador, y la navegación es real. La etiqueta `<a>` de View cart se extrae del `cart-drawer.liquid` en disco, no se escribe a mano. El HTML del cajón incluye además los enlaces de imagen y título de línea, el contenedor de checkouts acelerados y el formulario de producto para el alta de B-03. Cada caso comprueba que no haya `pageerror`.

| # | Caso | Final | Base |
| --- | --- | --- | --- |
| P01 | Nota sucia, eco tras 500 ms | OK: a los 250 ms aún no navega; 1 POST exacto; servidor `Gift`; `/cart` | FAIL |
| P02 | Nota del servidor no vacía, sin editar | OK: 0 POST, nativo | OK |
| P03 | `show_cart_note` desactivado | OK: 0 POST, nativo | OK |
| P04 | `dblclick` real con guardado pendiente | OK: 1 POST, una navegación | FAIL |
| P05 | Edición en vuelo | OK: se queda; `abcZ` sucio; error; foco en la textarea | FAIL |
| P06 | 5xx | OK: se queda; borrador sucio; error; 2.º GET; foco `CartDrawerViewCart`; servidor sin nota | FAIL |
| P07 | Red caída (socket cortado) | OK, igual que P06 (ver nota) | FAIL |
| P08 | Fallo por teclado (Enter) | OK: foco `CartDrawerViewCart` | FAIL |
| P09 | Eliminar el último artículo | OK: estado vacío, sin View cart, 0 POST (HX-2) | OK |
| P10 | Sin JS | OK: cajón `hidden`; la cabecera navega de forma nativa | OK |
| P11 | Alta de B-03 en vuelo (900 ms), nota sucia, View cart | OK: 1 POST de nota; 1 alta y qty 1 (sin duplicar); `/cart` | FAIL |
| P12 | Alta de B-03 con respuesta perdida, reconciliada, y después View cart | OK: borrador conservado tras reconciliar; View cart no añade altas | FAIL |
| P13 | Nota con 500 mientras un alta está en vuelo (`syncCart` diferido) | OK: se queda; borrador sucio tras el render del alta; 1 alta | FAIL |
| P14 | Enlace de título de línea (HX-1) | OK: nativo, 0 POST (sin tocar, PD-3) | OK |
| P15 | Checkout con nota sucia | OK: 0 `update.js`; POST nativo `note=co&checkout=` | OK |

Resultado: `MODO=fix ... fallos=0`, y en la base 9 líneas `FAIL`.

Nota de método (artefacto del arnés, ajeno a B-04): si el servidor corta el socket (`socket.destroy`), Chromium reintenta el POST una vez sobre una conexión keep-alive reutilizada. Por eso P07 registra 2 POST en el servidor, aunque el tema hizo un solo `fetch`. P12 registra `add=2`, pero ya antes del clic en View cart y también en la base. La comprobación de P12 compara las altas antes y después del clic: View cart no añade ninguna.

# 4. Hallazgos (P0-P3)

No hay P0, P1 ni P2.

- **P3-1. Atribución del informe y defecto de la directiva.** El informe (§1, línea 55) atribuye «a B-03» las dos coincidencias de `this.contains(link)` y de `data-cross-sell-add]');`. En realidad ya eran 2 en `1fee9e2` (afirmación 6): son `updateHeaderCount` y `panel.querySelector(...)`. La condición de la directiva §1.2 («una sola vez cada ancla») no se cumplía ya en su propia base, y la R-D no lo detectó. El implementador resolvió bien usando el ancla única de inserción. No bloquea.
- **P3-2. Transcripción literal incompleta en el informe §2.** La salida de Theme Check pegada son solo bordes de recuadro; la línea de resumen aparece aparte, en la línea 119. `$ rg -c CartDrawerViewCart` aparece sin la ruta y sin los `--glob` que produjeron `./sections/...`. Tampoco se pega la salida de `git merge-base --is-ancestor` ni la de `git log --oneline 1fee9e2..HEAD`, que solo se resumen en prosa en la línea 28. Los resultados coinciden con mi ejecución.
- **P3-3. Lista de la base en rojo incompleta (informe §3, línea 132).** Cita T04, T05, T07 y T19 como errores de Playwright por navegación prematura, pero `salida-base.txt` muestra también T16 (`TypeError ... setting 'value'`), por la misma causa.
- **P3-4. Arnés sin aserciones automáticas.** El arnés solo emite JSON, y el veredicto H-1..H-17 se hace a mano. `log.updates` guarda `keepalive: true` fijo, sin medirlo (no se imprime). X-T02b recoge `defaultPrevented` y no lo emite: H-2 queda cubierto solo de forma indirecta, por la navegación nativa. Mi sonda, con aserciones, cubre el hueco. Mejora opcional para próximas tareas, no para esta.

# 5. Compuertas

```
node --check assets/theme.js                         -> exit 0
npx --no-install shopify theme check --fail-level error -> 93 files inspected with no offenses found.
node scripts/theme-check-sanity.mjs                  -> [theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
node scripts/dataset-hooks.mjs                       -> Contratos rotos: 0 (exit 0)
node scripts/json-validate.mjs                       -> exit 0
node scripts/locale-key-inventory.mjs                -> Huerfanas en storefront: 0 / Huerfanas en schema: 0 / OK: todas las referencias estaticas resuelven contra los locales.
harness-A-01-B-02-001/harness.mjs . fix              -> MODO=fix total=56 pass=56 fail=0
harness-B-01-001/drawer-breakpoint.mjs . fix         -> resumen fallos=0
harness-B-03-001/cart-lost-response.mjs . fix        -> resumen fallos=0
git status --short (tras las pruebas)                -> solo los 2 archivos de B-04 y los 4 elementos sin seguimiento de agent-comms
```

Cinco compuertas:
- **1. Ledger:** sin filas cerradas ni modificadas, de acuerdo con la directiva §6.
- **2. Estados degenerados:** se cubrieron vacío (P09, T17), uno (T01), muchos (12 líneas, H-15), muy largo (2.000 y 70.000 caracteres, título de 120) y faltante (P03/T03).
- **3. Consistencia:** reutiliza el helper, el plazo y los mensajes existentes, sin duplicados.
- **4. Superficie del comerciante:** no hay settings ni locales nuevos.
- **5. Tienda real:** pendiente de credenciales (D22).

Exactitud del informe: las afirmaciones 1 a 7 del informe se verificaron como ciertas, con los matices P3-1 a P3-3.

Compuerta del literal: `count-rev.py` es una copia adaptada de `count-two.py` que solo imprime `ruta=N`. Recorre `assets/theme.js`, `sections/cart-drawer.liquid`, los tres archivos del arnés, el informe, la directiva, la R-D y esta revisión. El resultado está en la línea siguiente.

Resultado: `assets/theme.js=0`, `sections/cart-drawer.liquid=0`, `harness-B-04-001/harness.mjs=0`, `salida-base.txt=0`, `salida-final.txt=0`, `CLAUDE-REPORT-B-04-001.md=0`, `CLAUDE-DIRECTIVA-B-04-001.md=0`, `CLAUDE-REVIEW-B-04-RD-001.md=0`, `CLAUDE-REVIEW-B-04-001.md=0`. `ctx-check.py` (desde la raíz del repo): `fuera_de_tests_vendor_axe= 0`.
