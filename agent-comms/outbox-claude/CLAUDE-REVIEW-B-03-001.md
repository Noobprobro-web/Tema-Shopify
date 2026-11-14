# CLAUDE-REVIEW-B-03-001: revisión D11 de B-03 (alta al carrito con respuesta perdida)

```text
ID: CLAUDE-REVIEW-B-03-001
Fecha: 2026-11-05
Autor: Claude (Opus), revisor independiente de contexto limpio (D11). No redactó la directiva, ni la R-D, ni el código.
Objeto: `git diff HEAD -- assets/theme.js` (+243/−55, sin commit) en la rama lote-b (HEAD 4e5c6d6), harness-B-03-001/ y
  CLAUDE-REPORT-B-03-001.md. Contrato: CLAUDE-DIRECTIVA-B-03-001 + CLAUDE-REVIEW-B-03-RD-001 (C-1..C-3, PD-1..PD-8).
Estado: Revisión emitida. ACEPTADO CON CAMBIOS MENORES. El código se acepta tal cual. Los dos cambios son de texto y
  solo afectan al informe (§4). Estado máximo sin tienda: `código completo`.
Decisión requerida: ninguna para el código. El coordinador corrige el informe (§4) y hace el commit (D12). PD-8 (mutar
  un carrito en R-B) sigue pendiente de Johandry y no bloquea.
Resumen en 5 líneas:
  1. El diff es exactamente E1-E11 + C-1 (código y comentarios) sobre 4e5c6d6. Solo cambia el prototipo de la R-D en dos
     comentarios reflujados. Los 21 hunks caen en las 7 regiones. Nada de B-04. 15 métodos de solo lectura idénticos.
  2. Arnés: fix 28/28 OK (fallos=0), base 32 fallos (pasan D0, D6, E3, E4, E11). Fix es idéntico byte a byte a
     salida-fix.txt. En base solo cambia el contador intermedio de D6.
  3. Sonda propia (20 escenarios nuevos): 0 fallos. Cubre fila sin ?variant= o sin cantidad, JSON tardío tras el plazo,
     colgada sin aplicar, dos altas rápidas, doble clic, selling_plan, look de 3 con alta parcial y temporizadores.
  4. Regresión: A-01/B-02 56/56, B-01 fallos=0 (escritorio y MOBILE=1). Gates: node --check, Theme Check 0 ofensas,
     sanity, dataset-hooks, json-validate y locale-key-inventory con exit 0. Literal = 0. ctx-check: 0 fuera de axe.
  5. Ningún P0, P1 ni P2. Hay 2 P3 de exactitud del informe (§4) y 2 P3 de observación sin cambio (§3).
Archivos tocados: solo este archivo. Fuera del repo, en /tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rev-b03/:
  mkprobe.py, scen.mjs, probe.mjs (sonda generada a partir del arnés entregado), count-rev.py (copia de count-two.py)
  y las salidas fix1/fix2/base1/base2/probe-fix/a01/b01/b01m y los gates *.txt. No hubo git de escritura, red externa,
  tiendas, gate5, .secrets ni variables de entorno.
Desviaciones (Nivel 1 o Nivel 2): ninguna del revisor. La implementación es de Nivel 1, como declara. La línea de más
  (+243 frente a +242) es el comentario de C-1 reflujado y queda dentro del margen de ±3.
Hallazgos extra fuera de alcance (con parche listo): ninguno con parche. H-REV-1 y H-REV-2 (§3) son P3 de observación.
Verificación (comando, resultado y qué demuestra/qué no): §1 y §2. Es ESTÁTICA y SINTÉTICA (Chromium local, servidor
  de carrito simulado, sin tienda). No demuestra el servidor real de Shopify, el orden de aplicación, las apps, Safari,
  un móvil real ni los lectores de pantalla.
Lista de afirmaciones falsables numeradas: §6.
```

---

## 1. Lectura del diff (ESTÁTICO)

- **Fidelidad.** `assets/theme.js` se comparó con `rd-b03/mine-c1only.js` (directiva + código de C-1, prototipo de la R-D). Solo cambian dos comentarios: el de `classifyAdd` y la frase de `addItem`. Los dos llevan el texto que pide C-1. `grep -c "mayStillLand = timedOut || !response || response.status >= 500"` da 2.
- **Regiones.** Hay 21 hunks (`git diff -U0`), en `:2287-2291` (constantes), `:2326` y `:2364` (`connectedCallback`), `:2579-2653` (`cartBaseline`/`addItem`/`showUnconfirmedAdd`), `:2696` (`addCrossSell`), `:3494` (`renderSection`) y `:4152-4208` (`addSelectedItems`). Un script comparó 15 cuerpos de HEAD con los de la copia de trabajo y todos son idénticos (`True`): `handleDrawerClick`, `handleCrossSellView`, `saveNoteAndNavigate`, `syncCart`, `endMutation`, `beginMutation`, `changeLine`, `checkCart`, `responseHasVariant`, `findLineFor`, `renderCartResponse`, `requestSection`, `fetchCommerce`, `handleAddSubmit` y `open`. B-04 solo se desplaza: `handleDrawerClick` pasa de `:2414` a `:2494`, `handleCrossSellView` de `:3003` a `:3142` y `saveNoteAndNavigate` de `:3020` a `:3159`. `syncCart({ reconcile = false } = {})` conserva firma y semántica (R-6 de B-04).
- **Criterio 3.** `CART_CROSS_SELL_ADD_TIMEOUT`=0, `CART_ADD_TIMEOUT`=4, `fetchCommerce(`=1, `readCartQuantities(`=4, `showUnconfirmedAdd`=4, `cartSnapshotStale`=5, `cartBaseline`=5, `classifyAdd`=3.
- **Criterio 5.** `cartAddUrl` aparece en 3 líneas (`:2706`, `:2843`, `:4331`), las tres `await fetch(this.dataset.cartAddUrl, {`. Ninguna está en un bucle ni en un `catch`: **no hay reintento automático**.
- **Mensajes.** Todos son existentes: `dataset.errorMessage` (try again o el error del look), `dataset.updateUnconfirmedMessage` con `[data-cart-uncertain]`/`[data-cart-check]` (los mismos que `addCrossSell`), `addFailedMessage` y `addedMessage`. No hay claves, `data-*` ni `aria-*` nuevos.
- **Temporizadores y AbortController.**
  - `addItem` crea el plazo después de `setFormBusy` y entra en `try` de inmediato. Lo limpia tras el `fetch` y otra vez en el `finally`, así que todo `return` o `throw` lo cubre.
  - `addSelectedItems` hace lo mismo: la limpieza está en el `finally`. Un abort deliberado (`disconnectedCallback`, `!timedOut`) se relanza y el `click` handler lo silencia.
  - `readCartQuantities` limpia su plazo de 5 s en `finally` y nunca lanza. Como `cartBaseline()` tampoco lanza, la promesa `baseline` que se espera dentro de `try` no puede quedar rechazada sin manejar.
- **El botón nunca queda deshabilitado.** El `finally` de `addItem` ejecuta `delete cartAddPending`, `setFormBusy(false)` y `endMutation()` en todos los caminos, también `unknown` con `return`. El de `addSelectedItems` ejecuta `setBusy(false)` y `endMutation`. Lo confirman D4, P4, P6 y P12 (§2.2).
- **Revisiones.** `cartBaseline()` evalúa la frescura de forma síncrona antes de `beginMutation()`. `showUnconfirmedAdd` activa `reconcileAfterMutation`, y `endMutation` resincroniza con `reconcile` porque `renderedRevision !== syncRevision`. `renderSection` solo gana `cartSnapshotStale = false`.

## 2. Ejecución (SINTÉTICO, Chromium local, sin tienda)

### 2.1 Arnés entregado y regresión

```text
$ node agent-comms/outbox-claude/harness-B-03-001/cart-lost-response.mjs . fix     (x2)
resultados D0..D6, E1..E18, E8b, R1, R5 = OK (28)      resumen fallos=0   rc=0
diff fix1 salida-fix.txt -> sin diferencias; diff fix1 fix2 -> sin diferencias
$ ... . base     (x2, SHA 4e5c6d6)
resultados D0=OK D6=OK E3=OK E4=OK E11=OK, el resto FAIL   resumen fallos=32   rc=1
diff base1 base2 -> sin diferencias; diff base1 salida-base.txt -> solo línea 45: "101=3 POSTchange=3" frente a "POSTchange=2" (D6)
$ node agent-comms/outbox-claude/harness-A-01-B-02-001/harness.mjs . fix  -> MODO=fix total=56 pass=56 fail=0
$ node agent-comms/outbox-claude/harness-B-01-001/drawer-breakpoint.mjs . fix  -> resumen fallos=0 ; MOBILE=1 -> resumen fallos=0
$ grep -n "/tmp/\|/home/" agent-comms/outbox-claude/harness-B-03-001/*  -> sin salida (rc=1)
```

### 2.2 Sonda del revisor (`rev-b03/probe.mjs`: el arnés entregado con los escenarios sustituidos)

La sonda añade al arnés entregado varias opciones. Las filas del cajón pueden quedarse sin `?variant=` o sin campo de cantidad. Hay una variante 203 (look de 3), un segundo formulario de producto y un `selling_plan` que el servidor separa por línea. Hay tres modos de ruta nuevos: `partial` (aplica solo el primer ítem y corta), `slowok` (aplica y responde JSON a los 10,5 s) y la colgada sin aplicar. También hay instrumentación de `setTimeout`/`clearTimeout` para los plazos de 5 s o más.

| Esc. | Situación | Resultado (fix) |
| --- | --- | --- |
| P1 | Fila sin `?variant=` + `lost` (101 previo ×1) | OK: la línea base sale de `/cart.js` (2 GET), 101=2, 1 POST, éxito |
| P2 | Fila sin campo `[data-cart-quantity]` + `lost` | OK: igual que P1 |
| P2b | Cajón vacío legible, alta normal | OK: 0 GET |
| P3 | JSON aplicado que llega a 10,5 s (después del plazo) | OK: el plazo dispara y se reconcilia como `applied`, 101=1, 1 POST, 1 GET, botón libre, sin `pageerror`. La respuesta tardía se ignora |
| P4 | Colgada sin aplicar, 12 s | OK: Check cart con foco (el plazo cuenta como «puede aterrizar»), nunca «try again», 101=0, botón libre |
| P5 | Dos formularios casi a la vez: 1.ª `lost`, 2.ª ok | OK: 101=2, 2 POST, ningún «try again», botones libres |
| P5b | 1.ª ok, 2.ª `lost` | OK: 101=2, 2 POST, ningún «try again» |
| P6 | Doble y triple envío del mismo formulario con el POST en vuelo | OK: 1 POST, 101=1, botón libre al final |
| P7 | A-01: `selling_plan=77` en el formulario, 101 previo sin plan + `lost` | OK: el POST lleva `selling_plan`, 2 líneas de 101 (1+1), base del cajón (0 GET) + 1 GET de reconciliación, éxito |
| P8 | Look de 3 variantes, solo 201 aplicada + `lost` | OK: `unknown`, el cajón muestra Check cart con foco, no hay error del look, 201/202/203=1/0/0 |
| P9 | Look de 3, todas aplicadas + `lost` | OK: 1/1/1 y «Look added.» en el cajón y en el bloque |
| P10 | Sin cajón, look parcial + `lost` | OK: navega a `/cart`, 1 POST |
| P11 | Cajón ya abierto + `lost` + `/cart.js` caído | OK: sigue abierto, aviso y foco en Check cart (rama `else checkButton?.focus()`) |
| P12 ×7 | Temporizadores en ok, 429, `lost`, `unknown`, look `lost`, look `drop`, look `unknown` | OK: 0 vivos y 0 disparados tras 11,5 s, en todos |

`resumen fallos=0`, rc=0. Qué no demuestra: la carrera real en Shopify, ni el orden en que un 5xx real llega a aplicar el alta.

### 2.3 Gates estáticos (ESTÁTICO)

```text
$ node --check assets/theme.js && echo CHECK_OK                 -> CHECK_OK
$ npx --no-install shopify theme check --fail-level error        -> "93 files inspected with no offenses found." rc=0
$ node scripts/theme-check-sanity.mjs   -> rc=0  ("OK. Las 3 clases se detectaron por separado ...")
$ node scripts/dataset-hooks.mjs        -> rc=0
$ node scripts/json-validate.mjs        -> rc=0
$ node scripts/locale-key-inventory.mjs -> rc=0  ("OK: todas las referencias estaticas resuelven contra los locales.")
$ python3 -I rev-b03/count-rev.py <archivos B-03 + esta revisión>  -> todos =0 (§5)
$ python3 -I ctx-check.py  -> fuera_de_tests_vendor_axe= 0
```

Ninguno de estos gates prueba el comportamiento (RULES §3.1).

## 3. Hallazgos

Nada de nivel P0, P1 ni P2.

- **P3-1 (informe, exactitud).** El §2 del informe dice «`saveNoteAndNavigate` :3013 a :3152». Los valores reales son `:3020` en HEAD y `:3159` tras el cambio (`grep -n "async saveNoteAndNavigate"`). `handleCrossSellView` (`:3003` a `:3142`) y `handleDrawerClick` (`:2414` a `:2494`) están bien.
- **P3-2 (informe, exactitud).** El §5 del informe dice «dos ejecuciones consecutivas de cada modo: idénticas byte a byte». Es cierto para `fix`. En `base`, mi ejecución difiere de `salida-base.txt` en el contador intermedio de D6 (`POSTchange=3` frente a `2`). Es el control de `changeLine`, que depende del ritmo, como ya declara la directiva en §2.3. El total (32) y el veredicto por escenario no cambian.
- **H-REV-1 (P3, observación, sin cambio).** Puede aparecer un «Item added» falso, sin duplicado, en tres casos: dos altas solapadas de la misma variante con la 2.ª perdida (P5b), un alta de otra pestaña durante la pérdida o un POST que aterriza después de la resincronización de un `unknown`. En los tres, la línea base no ve la otra alta y el delta la cuenta. Es el residuo que la R-D ya acepta (§1.5, «añadido falso»), con la misma variante en el carrito. Nunca invita a reintentar.
- **H-REV-2 (P3, observación, sin cambio).** Con el carrito en página (sin `<cart-drawer>`), cada alta de «Completa el look» hace 1 GET `/cart.js` previo para la línea base (E15/E16: `GETcart=2`). El «coste cero en el camino feliz» de la directiva (§3.3) solo vale con cajón. El diseño lo acepta, pero el informe no lo menciona.
- **Compuerta de estados degenerados.** El caso «faltante» de la directiva (§4.3), una fila sin `?variant=` o sin campo de cantidad, ya tiene escenario: P1 y P2 de esta sonda. El informe (§6) lo declara sin escenario. No hace falta cambiarlo, pero puede citarse.

## 4. Veredicto

**ACEPTADO CON CAMBIOS MENORES.** El código de `assets/theme.js` y el arnés se aceptan tal cual. Lista cerrada de cambios, solo en `CLAUDE-REPORT-B-03-001.md`:

1. §2: «`saveNoteAndNavigate` :3013 a :3152» pasa a «`saveNoteAndNavigate` :3020 a :3159».
2. §5: «dos ejecuciones consecutivas de cada modo: identicas byte a byte» pasa a «fix: idénticas byte a byte; base: idénticas salvo el contador intermedio `POSTchange` de D6 (control de `changeLine`, dependiente del ritmo), sin cambio de veredicto ni de total».

Los dos cambios pueden hacerse al integrar el commit y no requieren nueva revisión. Estado máximo sin tienda: `código completo`. La fila nueva del ledger (PD-7) la escribe el coordinador. R-B sigue pendiente de PD-8 (Johandry).

## 5. Compuerta del literal y del contexto

```text
$ python3 -I rev-b03/count-rev.py assets/theme.js agent-comms/outbox-claude/harness-B-03-001/cart-lost-response.mjs \
    agent-comms/outbox-claude/harness-B-03-001/salida-fix.txt agent-comms/outbox-claude/harness-B-03-001/salida-base.txt \
    agent-comms/outbox-claude/CLAUDE-REPORT-B-03-001.md agent-comms/outbox-claude/CLAUDE-REVIEW-B-03-001.md
assets/theme.js=0
agent-comms/outbox-claude/harness-B-03-001/cart-lost-response.mjs=0
agent-comms/outbox-claude/harness-B-03-001/salida-fix.txt=0
agent-comms/outbox-claude/harness-B-03-001/salida-base.txt=0
agent-comms/outbox-claude/CLAUDE-REPORT-B-03-001.md=0
agent-comms/outbox-claude/CLAUDE-REVIEW-B-03-001.md=0
$ python3 -I ctx-check.py | grep fuera_de_tests_vendor_axe=
fuera_de_tests_vendor_axe= 0
```

## 6. Afirmaciones falsables

1. `git diff --stat HEAD -- . ':!agent-comms'` lista solo `assets/theme.js`, con `243 insertions(+), 55 deletions(-)`.
2. `diff rd-b03/mine-c1only.js assets/theme.js` solo muestra los dos comentarios de C-1: `classifyAdd` (2 líneas → 3) y la frase de `addItem` (3 → 3).
3. `git diff -U0 HEAD -- assets/theme.js | grep -c "^@@"` = 21, todos en las 7 regiones de §1.4 de la directiva.
4. Los cuerpos de `handleDrawerClick`, `handleCrossSellView`, `saveNoteAndNavigate`, `syncCart`, `endMutation`, `beginMutation`, `changeLine` y `checkCart` son idénticos en HEAD y en la copia de trabajo.
5. `grep -n cartAddUrl assets/theme.js` devuelve exactamente `:2706`, `:2843` y `:4331`.
6. El arnés entregado da en `fix` `resumen fallos=0` (28 escenarios) y en `base` `resumen fallos=32`, con D0, D6, E3, E4 y E11 en OK.
7. La sonda `rev-b03/probe.mjs . fix` da `resumen fallos=0`. En P1 y P2 la línea base sale de `/cart.js` (`GETcart=2`). En P8 queda Check cart con 201/202/203=1/0/0. En P12 hay 0 temporizadores vivos y 0 disparados en los 7 caminos.
8. A-01/B-02 da 56/56. B-01 da `resumen fallos=0` con y sin `MOBILE=1`. Theme Check da «93 files inspected with no offenses found.».
9. `grep -n "async saveNoteAndNavigate" assets/theme.js` devuelve `:3159`, y en HEAD `:3020`.
