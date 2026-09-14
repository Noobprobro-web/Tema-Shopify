# CLAUDE-IMPL-4B-006: Hardening y Eliminación de Bugs (12 Hallazgos Adversarios)

```text
ID: CLAUDE-IMPL-4B-006
Emisor: Claude (Opus 5 - Implementador Principal de Código)
Destinatario: Gemini Flash 3.8 High (Arquitecto Líder) / Johandry (Ruiz Digital)
Responde a: CLAUDE-TASK-4B-006
Fecha: 2026-09-14
Estado: ENTREGADO
Decisión requerida: Autorización de commit/push por parte de Gemini y Johandry.
Commit/push realizado: NO. Los archivos quedan modificados y sin commitear en el árbol de trabajo.
Tipo de cambio: Nivel 1 en los 12 objetivos. 4 desviaciones de Nivel 1 documentadas en §4.
```

---

## 1. Resumen

Los 12 objetivos están implementados. Las 8 compuertas estáticas pasan con código 0.

La suite `tests/pdp-line-total.spec.mjs` **no se pudo ejecutar** en mi entorno: exige una
vitrina viva en `127.0.0.1:9292` (`shopify theme dev`, con autenticación de tienda) que este
contenedor no puede levantar. Adjunto la salida real del intento, que falla con
`ERR_CONNECTION_REFUSED` antes de tocar el tema, y no la presento como verde. Para no entregar
12 correcciones sin evidencia dinámica, construí un banco de pruebas independiente que ejercita
el `assets/theme.js` **real** en Chromium sin vitrina, y que **falla 9 de 10 contra el build
previo a este sprint**. Detalle en §5.

Antes de tocar código contrasté la directiva con el árbol real. Tres puntos de la especificación
no eran ejecutables tal cual; están resueltos y declarados en §4, uno de ellos porque habría
introducido un precio en blanco en producción.

---

## 2. Archivos tocados

| Archivo | Líneas (post-cambio) | Objetivo |
|---|---|---|
| `assets/theme.js` | 60-78, 84-85, 91-97, 99-127 | F01 (helper), F07 |
| `assets/theme.js` | 230 | F01 (`ThemeDrawer.setOpen`) |
| `assets/theme.js` | 602 | F02 (`updateForms`) |
| `assets/theme.js` | 670-674 | F07 (`updateLineTotal`) |
| `assets/theme.js` | 898 | F01 (`SizeGuideModal.open`) |
| `assets/theme.js` | 1293-1296 | F04 (listener de nota) |
| `assets/theme.js` | 1381-1392 | F05 (`handleDrawerChange`) |
| `assets/theme.js` | 1396-1410 | F01 (`CartDrawer.open`) |
| `assets/theme.js` | 1468-1471, 1500-1506 | F02 (`addItem`) |
| `assets/theme.js` | 1486-1496, 1535-1545, 1578-1588, 2233-2244 | F10 (4 rutas de carrito) |
| `assets/theme.js` | 1595-1600 | F03 (`syncCart`) |
| `assets/theme.js` | 1632-1652 | F04 (`renderSection`) |
| `assets/theme.js` | 2429-2433, 2479 | F09-rAF (`AnnouncementBar`) |
| `assets/theme.js` | 2553-2558 | F09-rAF (`PasswordModal`) |
| `assets/base.css` | 979-993 | Badge de oferta |
| `sections/main-collection.liquid` | 9 (bloque eliminado), 109-116, 468 | F06, F09-url |
| `sections/main-search.liquid` | 12 (bloque eliminado), 43, 140-147, 276 | F06, F08, F09-url |
| `sections/main-product.liquid` | 306 | F05 (`required`) |
| `sections/featured-product.liquid` | 161 | F05 (`required`) |
| `sections/cart-drawer.liquid` | 41 (eliminada), 213 | F03, F05 |
| `sections/announcement-bar.liquid` | 129 | F09-url |
| `sections/bento-discovery.liquid` | 218, 264 | F09-url |
| `sections/main-contact.liquid` | 312 | F09-url |
| `snippets/predictive-search.liquid` | 20-31, 82, 136 | F08 |
| `config/settings_schema.json` | 239, 244, 249, 254, 259 | F09-url |
| `locales/en.default.schema.json` | 302 | F09-url |

Ningún ID de setting, default de setting, ni nombre de bloque cambió. Ningún archivo nuevo entra
al tema.

---

## 3. Los 12 objetivos

1. **F01 [P0] Diálogos concurrentes.** Un solo helper `closeOtherDialogs(except)`
   (`theme.js:60-78`) que cierra el resto de diálogos, invocado desde `CartDrawer.open`
   (`:1406`), `ThemeDrawer.setOpen(true)` (`:230`) y `SizeGuideModal.open` (`:898`).
   `CartDrawer.open` gana además la guarda `!this.isConnected` y la redirección de foco al
   disparador del menú de origen.
2. **F10 [P1] Respuesta HTML en llamadas de carrito.** Las 4 rutas (`addItem`, `addCrossSell`,
   `changeLine`, `addSelectedItems`) capturan el fallo de parseo y lo convierten en
   `dataset.errorMessage`.
3. **F02 [P1] Compras concurrentes.** `form.dataset.cartAddPending` bloquea el segundo envío;
   `updateForms` lo consulta antes de reactivar el botón; el `finally` reaplica el estado del
   variante vigente.
4. **F04 [P1] Nota y foco tras mutación.** Listener `input` marca la nota como sucia; `renderSection`
   la traslada al nodo nuevo y devuelve el foco al mismo `id` o al botón de cierre.
5. **F03 [P1] Carrito desactualizado.** `syncCart` pide la sección siempre que se abre el drawer.
6. **F06 [P1] Filtros de precio.** `divided_by: 100.0` en ambas secciones; bloque
   `money_uses_comma_decimal` eliminado en los dos archivos.
7. **F05 [P2] Cantidad.** `required` en los 3 inputs; `handleDrawerChange` valida antes de mutar y
   conserva `0` como borrado deliberado.
8. **F08 [P2] Doble escape.** `escape_once` en las 18 salidas de traducción de los 2 archivos.
9. **Badge de oferta.** `.badge[data-sale-badge]` y `.badge[data-sold-out-badge]` en `base.css:982`.
   Los atributos ya existían en `snippets/price.liquid:92,95`; faltaba solo el CSS.
10. **F07 [P2] `formatMoney`.** Octavo token añadido, cadena de candidatos validada contra
    `MONEY_PATTERNS`, decodificación de entidades, reemplazo global de token, y guarda de
    `price_cents` en `updateLineTotal`.
11. **F09 [P2] `info` en settings `url`.** Clave `sections.all.link_destination_info` + los 10
    settings. Verifiqué que los otros 3 settings `url` del tema
    (`hero-editorial` ×2, `brand-manifesto` ×1) **ya tenían `info`**: el recuento de 10 es exacto.
12. **rAF huérfanos.** Guardas `isConnected` en el `focusout` y en `schedule()` de
    `AnnouncementBar`, y en el rAF de `PasswordModal`.

---

## 4. Desviaciones (todas Nivel 1) y correcciones a la especificación

**D1 — Objetivo 10: la versión propuesta de `formatMoney` habría dejado precios en blanco.**
El snippet termina en `if (!template) return '';` y elimina el respaldo `'${{amount}}'` que existe
hoy. Con un `money_format` que el tema no reconozca, el comprador no vería un precio con símbolo
equivocado: vería **nada**, con la etiqueta "Total for 2:" colgando vacía. Añadí
`DEFAULT_MONEY_FORMAT` como último candidato de la cadena (`theme.js:92`), conservando toda la
validación estricta que pedía la directiva. El `if (!template)` queda como guarda muerta pero
inofensiva. El test 10 del §5 fija este comportamiento.

**D2 — Objetivo 10: el peligro de `"12.34"` que reporté en `CLAUDE-AUDIT-4B-005` seguía abierto.**
La guarda propuesta acepta cualquier string no vacío, así que `"12.34"` seguiría rindiendo
`$0.12`. Endurecí a `isCentsLike` (`theme.js:96`): number, o string de dígitos. **Advertencia
honesta:** ningún llamador actual pasa string —`CompleteTheLook` hace `Number(...) || 0` antes—,
así que esta guarda es defensiva y **no está cubierta por ninguna prueba mía**. No la presento
como verificada.

**D3 — Objetivo 1: trampa de orden en `ThemeDrawer.setOpen`.** `ThemeDrawer.setOpen` escribe
`body[data-drawer-open]` y `CartDrawer.close()` lo **borra**. Cerrar el carrito después de esa
línea habría dejado la página sin bloqueo de scroll con el menú abierto: un bug nuevo introducido
por la propia corrección. El cierre va en la primera línea del método (`:230`). El test 2 del §5
falla si se mueve.

**D4 — Objetivo 8: alcance reducido con motivo.** Mi primer pase con expresión regular cruzó saltos
de línea y tocó `filter.label | escape` y `item.title | escape`, dos salidas que **no** son
traducciones y estaban fuera de alcance. Lo detecté al revisar el diff contra el árbol limpio y
**lo revertí**; el diff final solo contiene salidas `| t`. Lo declaro porque el error llegó a
estar en disco.

**Además, fuera de los 12 puntos:** al quitar la llamada a `cart.js` de `syncCart`, el atributo
`data-cart-json-url` de `cart-drawer.liquid:41` quedó sin ningún lector. Lo eliminé. Es la única
línea que borré sin que la directiva lo pidiera; si Gemini prefiere conservarla, revertirla es de
una línea.

---

## 5. Verificación

### 5.1 `npm run gates:static` — 8/8, código de salida 0

```text
> gates:json
Archivos .json comprobados: 32
  de ellos en /listings/:    15
Fallos de parseo:           0

> gates:hooks
Componentes con data-* de contrato: 14
Exentas por escritura en runtime: cartAddPending, cartCountLabel, dirty, gridColumns,
  itemCount, reducedMotion, sourcesLoaded, variantId, wasDisabled
Contratos rotos: 0

> gates:sanity
[theme-check-sanity] sandbox en .tmp/theme-check-sanity-1366 con 7 carpetas de tema
[theme-check-sanity] detectado LiquidHTMLSyntaxError en sections/main-page.liquid
[theme-check-sanity] detectado TranslationKeyExists en sections/main-blog.liquid
[theme-check-sanity] detectado ValidSchemaTranslations en sections/main-placeholder.liquid
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado
                    volvio a 0 ofensas.

> gates:locales
OK: todas las referencias estaticas resuelven contra los locales.

> gates:ledger
Filas de requisito: 53
   31  cumplido
   18  código completo
    4  no verificado
    0  ausente
Incoherencias: 0

> gates:theme-check
72 files inspected with no offenses found.

> gates:syntax
(node --check assets/theme.js, sin salida, código 0)

> gates:package
Your local theme was packaged in Sartorial-1.0.0.zip

EXIT=0
```

**Discrepancia con la directiva:** §3 esperaba **74** archivos inspeccionados; el número real es
**72**, igual que antes de este sprint. Este sprint no añade ni quita archivos de tema, así que
72 es el número correcto y el 74 de la directiva es el dato a corregir, no el tema.

### 5.2 `npx playwright test tests/pdp-line-total.spec.mjs` — NO EJECUTABLE AQUÍ

```text
Running 2 tests using 1 worker
  1) tests/pdp-line-total.spec.mjs:105:3 › keeps unit price immutable and handles valid and hostile quantities
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:9292/collections/all
        at productCandidates (tests/pdp-line-total.spec.mjs:31:14)
  2) tests/pdp-line-total.spec.mjs:142:3 › renders and clears the compare-at line total when catalog data permits
    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:9292/collections/all
  2 failed
```

El fallo es de conexión, no de aserción: la suite nunca llega a cargar el tema. Requiere
`shopify theme dev` autenticado contra la tienda de desarrollo. **Johandry o Gemini deben correrla**
antes de autorizar el push. (Nota operativa: el `channel: 'chromium'` del `playwright.config.mjs`
también exige `npx playwright install`; en una máquina sin ese binario la suite falla por una razón
distinta y más confusa que la real.)

### 5.3 Banco de pruebas propio — 10/10 verde, 9/10 rojo contra el build anterior

Monta el `assets/theme.js` **real** (sin copiar ni extraer funciones) en una página estática
servida en `127.0.0.1:8099`, con `window.fetch` interceptado. No necesita vitrina Shopify.

```text
Running 10 tests using 1 worker
  ✓  1 F01: opening the cart from the menu closes the menu and keeps the drawer state
  ✓  2 F01: opening the menu while the cart is open keeps body[data-drawer-open]
  ✓  3 F01: the size guide and the cart never hold the trap at the same time
  ✓  4 F01: a cart opened from the menu returns focus to the menu trigger
  ✓  5 F03: the drawer re-renders on every open, not only when item_count moves
  ✓  6 F04: an unsaved order note and focus survive a re-render
  ✓  7 F05: an emptied quantity field does not delete the line
  ✓  8 F10: an HTML error page surfaces the localized message, not a SyntaxError
  ✓  9 F07: formatMoney covers all eight Shopify tokens through a real consumer
  ✓ 10 F07 (regression guard, passes on both builds): no usable format still renders a price
  10 passed (5.0s)
```

**Control negativo** — el mismo banco contra `assets/theme.js` anterior al sprint:

```text
  ✘ 1  ✘ 2  ✘ 3  ✘ 4  ✘ 5  ✘ 6  ✘ 7  ✘ 8  ✘ 9  ✓ 10
  9 failed, 1 passed
```

El test 10 pasa en ambos builds: **no discrimina**, y lo dejo etiquetado como tal. Su valor es de
guarda de regresión sobre D1 — fija que un `money_format` inservible sigue rindiendo un precio.
Los otros 9 fallan sin las correcciones, así que sí prueban lo que dicen probar.

Los valores exactos que fija el test 9 (precio 129900):

| token | salida |
|---|---|
| `amount` | `$1,299.00` |
| `amount_no_decimals` | `$1,299` |
| `amount_with_comma_separator` | `1.299,00 €` |
| `amount_no_decimals_with_comma_separator` | `1.299 kr` |
| `amount_with_apostrophe_separator` | `CHF 1'299.00` |
| `amount_no_decimals_with_space_separator` | `1 299 Ft` |
| `amount_with_space_separator` | `1 299,00 €` |
| `amount_with_period_and_space_separator` | `1 299.00 CHF` |
| `&pound;{{amount}}` | `£1,299.00` |
| `{{amount}} ({{amount}})` | `1,299.00 (1,299.00)` |

Los archivos del banco quedan en `agent-comms/outbox-claude/harness-4B-006/`. **No están
conectados a `npm test` ni a las compuertas**: adoptarlos es decisión de Gemini.

---

## 6. Afirmaciones falsables

1. `npm run gates:static` termina con código 0 y las 8 compuertas en verde.
2. `gates:theme-check` inspecciona **72** archivos, no 74, con 0 ofensas.
3. `node --check assets/theme.js` sale con código 0.
4. `rg "Intl\.NumberFormat" assets/theme.js` sigue devolviendo 0 resultados.
5. `MONEY_PATTERNS` contiene exactamente los 8 tokens oficiales de Shopify.
6. `formatMoney` nunca devuelve cadena vacía por falta de formato: la cadena de candidatos
   termina en `DEFAULT_MONEY_FORMAT`.
7. `data-cart-json-url` no aparece en ningún archivo del tema.
8. `grep -c "json().catch" assets/theme.js` devuelve 4.
9. Los 13 settings de tipo `url` del tema tienen atributo `info`; 10 lo ganaron en este sprint.
10. `money_uses_comma_decimal` no aparece en ningún archivo.
11. El banco de §5.3 falla en 9 de sus 10 pruebas contra el `assets/theme.js` anterior al sprint.
12. `tests/pdp-line-total.spec.mjs` **no fue ejecutada con éxito**; su único resultado obtenido es
    `ERR_CONNECTION_REFUSED`.
13. No se ejecutó `git commit` ni `git push` en ningún momento de este sprint.

---

## 7. Lo que queda fuera de mi alcance

- **Ejecutar `tests/pdp-line-total.spec.mjs`** contra la tienda de desarrollo (§5.2). Es el único
  requisito del protocolo de verificación que no pude cumplir.
- **Objetivo 3 (F03), coste aceptado:** `syncCart` ahora pide la sección en **cada** apertura del
  drawer. Es lo que la directiva pide y cierra la staleness real, pero añade un viaje de red y un
  reemplazo de DOM por apertura. Con conexión lenta el comprador verá el contenido y luego un
  reemplazo. La nota y el foco ya están protegidos (F04). Lo señalo como decisión de arquitectura
  de Gemini, no como desviación.
- **Objetivo 6, nota de render:** `divided_by: 100.0` rinde `1299.0` donde antes se veía `1299.00`.
  Es correcto en valor y válido con `step="any"`; es lo que hace Dawn. Si la estética importa,
  necesita otra decisión, no otro parche.
- **Adopción del banco de pruebas** como compuerta permanente.
- El dominio de documentación y las dos URLs en 404 siguen siendo el único bloqueo que provoca
  rechazo automático en Theme Store, y no se toca en este sprint.
