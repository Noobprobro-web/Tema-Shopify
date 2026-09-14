# CLAUDE-IMPL-4B-007: Remediación Post-Reverificación Adversarial (R01 a R04)

```text
ID: CLAUDE-IMPL-4B-007
Emisor: Claude (Opus 5 - Implementador Principal de Código)
Destinatario: Gemini Flash 3.8 High (Arquitecto Líder) / Johandry (Ruiz Digital)
Responde a: CLAUDE-TASK-4B-007
Fecha: 2026-09-14
Estado: ENTREGADO
Decisión requerida: Autorización de commit/push por Gemini, y repetición de la auditoría por GPT.
Commit/push realizado: NO.
Archivo tocado: assets/theme.js, únicamente. Sin Liquid, sin CSS, sin schemas, sin JSON, sin BOARD.md.
Tipo de cambio: Nivel 1. 3 desviaciones documentadas en §4.
```

---

## 0. Corrección de una afirmación falsa que hice en CLAUDE-IMPL-4B-006

En §6 de mi informe anterior afirmé, como afirmación falsable número 2:

> `gates:theme-check` inspecciona **72** archivos, no 74 [...] el 74 de la directiva es el dato
> a corregir, no el tema.

**Es falsa. El número correcto es 74 y el dato a corregir era el mío.** Mi árbol de trabajo se
armó copiando archivos por extensión y no incluía `sections/header-group.json` ni
`sections/footer-group.json`. Theme Check inspeccionaba 72 archivos porque yo solo le había dado
72. Con el árbol completo:

```text
│  74 files inspected with no offenses found.                                  │
```

Consecuencia real, y es la parte que importa más que el número: **las 8 compuertas del Sprint
4B-006 nunca se ejecutaron sobre esos dos archivos.** Los volví a correr ahora con el árbol
completo y siguen en verde, así que el resultado de 4B-006 se sostiene; pero lo que entregué
entonces como evidencia cubría menos de lo que dije. Ya corregí el procedimiento: este sprint
parte de un árbol verificado archivo por archivo contra el dispositivo.

Es la segunda vez en este engagement que me equivoco contando archivos y la segunda vez que el
error va en la dirección de contradecir a otro agente. Lo anoto para que quede en el historial.

---

## 1. Resumen

Los cuatro parches R01 a R04 están aplicados. `node --check` pasa, las 8 compuertas estáticas
terminan en código 0 y Theme Check reporta 0 ofensas sobre 74 archivos.

No apliqué los parches a ciegas. Tres puntos necesitaron trabajo adicional, uno de ellos porque
`R01.patch` tal cual deja en pie un viaje de red redundante en **cada** añadir-al-carrito. Detalle
en §4.

Los probes originales de GPT (`run-proposed.mjs`, `browser-audit.mjs`) **no los pude ejecutar**:
requieren una preview de desarrollo autenticada que este contenedor no puede levantar. En su lugar
extendí el banco de pruebas del sprint anterior con 7 pruebas nuevas que ejercitan el
`assets/theme.js` real en Chromium sin vitrina. **5 de las 7 fallan contra `bee742b`**; las otras
2 son guardas de regresión y las etiqueto como tales. Detalle en §5.

---

## 2. Archivos y líneas

Único archivo: `assets/theme.js` (115.624 → 118.295 bytes).

| Líneas | Qué | Origen |
|---|---|---|
| 132-136 | helper `fetchCommerce` | R03.patch |
| 76-79 | helper `syncDialogScrollLocks` | R04.patch |
| 240, 247 | `ThemeDrawer.setOpen`: exclusión + lock sincronizado | 4B-006 / R04.patch |
| 908, 927 | `SizeGuideModal`: exclusión + lock sincronizado | 4B-006 / R04.patch |
| 1120, 1139 | `PickupAvailability.open` / `close` | **R02.patch** / R04.patch |
| 1181, 1280 | guardas `AbortError` preexistentes | 4B-006 |
| 1300 | `this.renderedRevision = 0` | **desviación D1** |
| 1378-1389 | `handleDrawerClick`: guarda `AbortError` en `changeLine(…, 0)` | **desviación D2** |
| 1408-1410 | `handleDrawerChange`: guarda `AbortError` | **desviación D2** |
| 1426, 1448 | `CartDrawer.open` / `close` | 4B-006 / R04.patch |
| 1490, 1528 | `addItem`: `beginMutation` / `endMutation` | R01.patch |
| 1536, 1579 | `addCrossSell`: `beginMutation` / `endMutation` | R01.patch |
| 1584, 1617 | `changeLine`: `beginMutation` / `endMutation` | R01.patch |
| 1499, 1544, 1589, 2280 | las 4 llamadas de compra vía `fetchCommerce` | R03.patch |
| 1621-1625 | `beginMutation()` | R01.patch |
| 1627-1637 | `endMutation()` + corte por revisión renderizada | R01.patch + **D1** |
| 1639-1650 | `syncCart()` con aplazamiento y verificación de revisión | R01.patch |
| 1708-1711 | `renderSection()` registra `renderedRevision` | **desviación D1** |
| 2269, 2323 | `CompleteTheLook.addSelectedItems` coordina con el drawer | R01.patch |
| 2639, 2661 | `PasswordModal.open` / `close` | **R02.patch** / R04.patch |
| 2782, 2788 | `PredictiveSearch.setOpen` | **R02.patch** / R04.patch |

Los cuatro parches aplicaron con `patch -p1 --forward` sin conflictos (dry-run limpio antes).

---

## 3. Acceptance criteria

| Criterio | Resultado | Evidencia |
|---|---|---|
| R01: la lectura atrasada no revierte la mutación | **Cumple** | §5.2 test 1 |
| R02: sin dos superficies `data-open` ni panel nuevo `inert` | **Cumple** | §5.2 test 4 |
| R03: 4/4 flujos con mensaje traducido; HTML 5xx sigue verde | **Cumple** | §5.2 test 5 + regresión 4B-006 test 15 |
| R04: desmontar un diálogo cerrado no suelta el lock del abierto | **Cumple** | §5.2 tests 6 y 7 |
| Cero `pageerror` | **Cumple** | 17/17 sin errores de página |
| Sin tocar plantillas, Liquid, configuración ni `BOARD.md` | **Cumple** | §2 |
| Sin dependencias externas | **Cumple** | 0 imports nuevos |

Los criterios se verifican contra mi banco, no contra los probes de GPT. Ver §6.

---

## 4. Desviaciones

**D1 — `R01.patch` deja un viaje de red redundante en cada añadir-al-carrito.**

Esto **no lo introduce R01**: ya estaba en `bee742b`, heredado de mi propio Sprint 4B-006, cuando
hice que `syncCart()` se ejecutara en toda apertura del drawer. `R01.patch` lo conserva. La
secuencia es:

```text
addItem → renderCartResponse() renderiza HTML fresco de result.sections
        → open(submitter) → syncCart() ve pendingMutations = 1 → aplaza
        → finally → endMutation() → dispara el sync aplazado
        → GET /cart?section_id=… y segundo reemplazo completo del DOM
```

El comprador ve el drawer abrirse con su producto y, un viaje de red después, el contenido
reemplazarse otra vez por lo mismo.

Corrección: llevo `renderedRevision` junto al `syncRevision` que el propio parche introduce.
`renderSection()` anota de qué revisión viene el HTML visible (`:1711`) y `endMutation()` solo
dispara el sync aplazado si queda alguna revisión sin renderizar (`:1634`). Una mutación que
falló o fue abortada no renderiza, así que su sync sí se ejecuta. Los tests 2 y 3 de §5.2 fijan
ambos lados.

Descarté antes una versión con bandera booleana: con dos mutaciones solapadas donde la primera
renderiza y la segunda falla, la bandera se saltaba un resync que sí hacía falta. El contador de
revisión distingue ese caso; la bandera no.

**D2 — `beginMutation()` puede abortar una lectura en vuelo, y dos llamadores mostraban el texto
del aborto al comprador.**

`beginMutation()` hace `this.requestController?.abort()`. Ese controlador lo crea
`requestSection()`, que además de `syncCart()` usa `renderCartResponse()` cuando Shopify responde
sin `sections`. En ese camino, una segunda mutación aborta la lectura de la primera, el
`AbortError` sube por `changeLine` y los dos `.catch` que lo reciben —el de cantidad y el de
eliminar línea— hacían `showError(error.message)`. El comprador vería *"The user aborted a
request."* en inglés: exactamente la clase de fuga que R03 viene a cerrar. Añadí la guarda
`AbortError` que `handleDrawerClick` ya tenía para el cross-sell (`:1389`, `:1410`).

**D3 — Alcance: no ejecuté los probes originales de GPT.**

Ver §6. No es una desviación de código, pero sí del protocolo de validación de la directiva, y
prefiero declararla como tal.

---

## 5. Verificación

### 5.1 Compuertas

```text
$ node --check assets/theme.js
(sin salida, código 0)

$ npm run gates:static
Fallos de parseo:           0
Contratos rotos: 0
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado
                    volvio a 0 ofensas.
OK: todas las referencias estaticas resuelven contra los locales.
Filas de requisito: 53
Incoherencias: 0
│  74 files inspected with no offenses found.                                  │
│  Your local theme was packaged in Sartorial-1.0.0.zip                        │
GATES EXIT=0
```

### 5.2 Banco de pruebas

Monta el `assets/theme.js` real en una página estática servida en `127.0.0.1:8099`, con `fetch`
interceptado y respuestas de sección que se pueden **retener** para reproducir la carrera del P1.

```text
Running 17 tests using 1 worker
  ✓ 1 R01: a held syncCart response cannot revert a later mutation
  ✓ 2 R01: an add-to-cart does not trigger a second, redundant section request
  ✓ 3 R01: a mutation that fails to render still leaves a deferred sync to run
  ✓ 4 R02: opening predictive search closes the cart drawer
  ✓ 5 R03: a transport failure shows the localized message, not "Failed to fetch"
  ✓ 6 R04: removing a closed drawer does not release the open cart scroll lock
  ✓ 7 R04: closing the last dialog does release the lock
  ✓ 8-17 (las 10 pruebas del Sprint 4B-006, sin regresión)
  17 passed (7.2s)
```

**Control negativo contra `bee742b`:**

```text
  ✘ 1  ✘ 2  ✓ 3  ✘ 4  ✘ 5  ✘ 6  ✓ 7
  5 failed, 2 passed
```

Los tests 3 y 7 pasan en ambos builds: **no discriminan**, y no los presento como prueba de nada
más que ausencia de regresión. El test 1 reproduce exactamente el P1 de la directiva: retener la
respuesta de `GET /cart?section_id=cart-drawer` abierta por `open()`, cambiar la cantidad a 2,
liberar la respuesta retenida. En `bee742b` la UI vuelve a 1; con R01 se queda en 2 y `/cart.js`
también.

---

## 6. Limitaciones

- **No ejecuté `node .tmp/gpt-audit-4b-007/run-proposed.mjs` ni `browser-audit.mjs`.** Necesitan
  una preview de desarrollo autenticada contra la tienda; este contenedor no puede levantarla.
  Los puntos 4, 5 y 6 de la validación obligatoria de la directiva quedan **sin cumplir por mi
  parte**. Mi banco los sustituye parcialmente, no del todo: no cubre catálogo móvil real,
  teclado sobre el header real, ni `pageerror` en páginas reales del tema.
- **`tests/pdp-line-total.spec.mjs` sigue sin poder ejecutarse aquí** por la misma razón, igual
  que en 4B-006.
- **R02 verificado solo para `PredictiveSearch`.** `PickupAvailability.open()` y
  `PasswordModal.open()` recibieron el mismo `closeOtherDialogs(this)` y lo revisé leyendo el
  código —el target de retorno se captura antes de cerrar, y el cierre precede a `applyBackgroundInert`
  y a `syncDialogScrollLocks`—, pero no monté fixtures para esos dos componentes. La matriz
  completa de aperturas que pide el acceptance criterion de R02 **no está probada**.
- **Prioridad de arquitectura para Gemini:** con D1 resuelto, `syncCart()` en cada apertura ya no
  cuesta un viaje extra tras un add-to-cart, pero sí sigue costando uno en cada apertura manual
  del drawer. Es el coste que acepté en 4B-006 y sigue vigente.
- El dominio de documentación y las dos URLs en 404 siguen siendo el único bloqueo que provoca
  rechazo automático en Theme Store.

---

## 7. Afirmaciones falsables

1. `node --check assets/theme.js` termina con código 0.
2. `npm run gates:static` termina con código 0 y las 8 compuertas en verde.
3. `gates:theme-check` inspecciona **74** archivos con 0 ofensas.
4. `assets/theme.js` es el único archivo modificado en este sprint.
5. Los 4 parches aplicaron sin conflicto con `patch -p1 --forward`.
6. `beginMutation` y `endMutation` se invocan en las 4 rutas de mutación.
7. `closeOtherDialogs(this)` se invoca en 6 aperturas de diálogo: `ThemeDrawer.setOpen`,
   `SizeGuideModal.open`, `CartDrawer.open`, `PickupAvailability.open`, `PasswordModal.open`,
   `PredictiveSearch.setOpen`.
8. `document.body.removeAttribute('data-drawer-open')` y `removeAttribute('data-modal-open')` ya
   no aparecen en el archivo: los 6 puntos pasan por `syncDialogScrollLocks()`.
9. Las 4 llamadas `fetch` de compra pasan por `fetchCommerce`.
10. El banco falla 5 de sus 7 pruebas nuevas contra `bee742b`; los tests 3 y 7 no discriminan.
11. Las 10 pruebas del Sprint 4B-006 siguen en verde.
12. Los probes originales de GPT **no fueron ejecutados**.
13. La afirmación 2 de `CLAUDE-IMPL-4B-006` era falsa; el número correcto es 74.
14. No se ejecutó `git commit` ni `git push`.
