# GPT-TASK-R7-001: ronda R7, el tope de stock deja de recortar en silencio en /cart y en el cajón

```text
ID: GPT-TASK-R7-001
Fecha: 2026-11-26
De: Claude (líder técnico; revisa la entrega, la valida en tienda y la fusiona)
Para: GPT (ejecutor de la ronda R7, D88)
Decisiones que lo autorizan: D88 en docs/decisions.md (el usuario autorizó R7 el 2026-11-26; resuelve DP-026)
Base: master tras fusionar claude/clever-gauss-ddhyr2 (R6 integrada, D87 y D88; ZIP de 111 archivos).
      Los números de línea de este encargo están comprobados en esa rama; los archivos del tema no cambian al fusionarla.
Entrega: agent-comms/outbox-gpt/GPT-R7-001-ENTREGA.md + PR en borrador contra master
```

## 1. Objetivo

Cuando una línea del carrito ya tiene todo el stock vendible (por ejemplo 8 de 8) y el comprador escribe una cantidad mayor (20), hoy no pasa nada: el campo vuelve a 8 sin petición ni aviso. Queremos que la petición salga, que Shopify responda su 422 con el texto localizado y que el tema lo muestre:

- en `/cart`, junto a la línea, por el camino que dejó R6 (`[data-cart-line-error]`);
- en el cajón, en el aviso general `[data-cart-error]` (`showError`).

El botón «+» sigue deshabilitado en el tope de stock, como hoy. El tope de `quantity_rule` y la rejilla de incrementos no cambian.

## 2. Contexto y evidencia

- Observación 2 de la validación de R6 en la tienda de QA (D87): con la línea en el tope de stock (8), escribir 20 no envía petición ni muestra aviso. Es anterior a R6 y no es una regresión.
- El usuario autorizó corregirlo en R7 y ampliar el alcance al cajón (D88). Lo implementas tú; Claude revisa, valida en tienda y fusiona.
- Los tests actuales no lo ven porque el mock de carrito (`tests/support/r3-support.mjs:178` `cartPageMarkup`, `:62` `cartDrawerMarkup`) no emite el tope de stock: solo emite `max` si se le pasa en la línea, y el cajón nunca.

Lectura obligatoria, en este orden:
1. Este encargo (el análisis con `archivo:línea` está en §3).
2. `docs/decisions.md`: D35, D79, D85 a D88.
3. `agent-comms/inbox-gpt/GPT-TASK-R6-001.md` y `agent-comms/outbox-claude/CLAUDE-R6-INTEGRACION-001.md` (cómo quedó el aviso de línea en `/cart`).
4. Reglas permanentes: `AGENTS.md` (las 5 compuertas), `agent-comms/RULES.md`, `docs/requirements-ledger.md`.
5. Estilo de la ronda anterior: `tests/r6-cart-line-error.spec.mjs`.

## 3. Punto de partida y reglas de git

1. **Primero trae `master` y después comprueba.** Sin el `fetch`, la comprobación mira una copia local vieja y puede decirte que el encargo no existe:
   ```bash
   git fetch origin master
   git cat-file -e origin/master:agent-comms/inbox-gpt/GPT-TASK-R7-001.md && echo "encargo en master: puedes empezar"
   ```
   Si no imprime nada tras el `fetch`, no empieces y avisa.
2. Crea la rama `gpt/r7-cart-stock-cap` desde `origin/master`. Anota la base: `BASE=$(git rev-parse origin/master)`; la necesitas para los tests de §6.
3. Abre un **pull request en borrador** contra `master` en cuanto tengas el primer commit. **Si GitHub te deniega abrir el PR, dilo en la entrega y Claude lo abrirá.**
4. Commits pequeños, con el mensaje en español. El test va en el mismo commit que su cambio.
5. Nunca hagas force-push, nunca rebases ramas compartidas y nunca fusiones tú el PR. **Solo haces push a `gpt/r7-cart-stock-cap`**; a ninguna otra rama.
6. No toques `agent-comms/BOARD.md` ni `docs/decisions.md`. Si surge una decisión, escríbela en tu entrega como propuesta.
7. No pongas identificadores de modelo en ningún archivo ni commit.
8. Antes de editar, lee el archivo y comprueba los números de línea.
9. **Prohibido tocar la tienda:** no subas ni publiques temas y no ejecutes nada contra ninguna tienda. La subida del tema R7 sin publicar la hace Claude al revisar.

## 4. Análisis del código

### 4.1 Liquid: de dónde sale el `max` de stock

- `/cart`, `sections/main-cart-items.liquid`:
  - `:140-142`: `quantity_min`, `quantity_step` y `quantity_max` salen de `item.variant.quantity_rule`;
  - `:147-148`: si no hay `quantity_rule.max`, la variante tiene control de inventario (`inventory_management == 'shopify'`), política `deny` e `inventory_quantity <= item.quantity`, entonces `quantity_max = item.quantity`;
  - `:176`: `{% if quantity_max != blank %}max="{{ quantity_max }}"{% endif %}` en el campo;
  - `:188`: «+» con `disabled` cuando `item.quantity >= quantity_max`.
- Cajón, `sections/cart-drawer.liquid`: la misma regla en `:303-313` (condición en `:311-312`), el atributo en `:342` y el «+» deshabilitado en `:356`.
- El formulario de `/cart` es `novalidate` (`sections/main-cart-items.liquid:36`): sin JavaScript, `max` nunca bloqueó el envío. Quitarlo no cambia el camino sin JS (D87: «sin JavaScript, el comportamiento es correcto»), pero compruébalo.

### 4.2 JavaScript: dónde se pierde la petición (`assets/theme.js`)

- `readQuantityRules` (`:7169-7182`): lee `step`, `min` y `max` del atributo y calcula `maxOnGrid`. No distingue de dónde viene el `max`.
- `snapQuantityField` (`:7188-7201`): lleva el número escrito al paso válido más cercano dentro de `[min, maxOnGrid]`; con `max=8`, 20 pasa a 8. Se llama:
  - en el `change` de documento (`:7278`), que sirve a las dos superficies;
  - en el `change` de `/cart` (`:7431`), antes de `checkValidity` (`:7432`);
  - en el cajón, dentro de `handleDrawerChange` (`:3446`).
- `/cart`: `readCartPageUpdates` (`:7287-7300`) compara con `processed` o `defaultValue` (`:7293`) y solo encola si cambia y `checkValidity()` pasa (`:7295-7296`). Con el valor recortado a 8 no hay cambio y no se envía nada. Aunque no se recortara, con `max=8` el `checkValidity()` fallaría por `rangeOverflow`.
- Cajón: `handleDrawerChange` (`:3430`) recorta (`:3446`) y sale si el valor coincide con `defaultValue` (`:3447`). Si no saliera, `checkValidity()` (`:3452`) también bloquearía con `max=8`.
- Botones: `nextQuantity` (`:7207`) y `syncQuantityStepper` (`:7219`) usan `maxOnGrid` para decidir el salto y el `disabled`. `syncQuantityStepper` corre al iniciar (`:7284`) y en cada `input`/`change` (`:7275-7282`): si solo quitas el `max`, el «+» se reactivaría en el primer `input`.
- Lo que ya funciona cuando la petición sale:
  - `postCartUpdate` (`:253-269`) lanza `Error(result?.description || result?.message || errorMessage)` en un 422 (`:268`);
  - `/cart`: `initCartPage` (`:7302`) guarda el fallo (`:7361`) y R6 lo pinta en la línea (`:326-363`, `replaceCartPage` en `:365`);
  - cajón: `changeLine(...).catch((error) => this.showError(error.message))` (`:3465-3470`); `showError` (`:4635-4640`) escribe con `textContent` y quita `hidden`. El 422 de `changeLine` (`:4223`) acaba con una lectura fresca, así que la línea muestra la cantidad real.
- Ficha de producto: usa los mismos `readQuantityRules`, `snapQuantityField` y `syncQuantityStepper` (`sections/main-product.liquid:423`, `sections/featured-product.liquid:278`, `updateQuantityRules` en `assets/theme.js:1726`). Su `max` viene solo de `quantity_rule`; su comportamiento no debe cambiar.

## 5. Cambio pedido

1. **Liquid (`main-cart-items.liquid` y `cart-drawer.liquid`, la misma regla en los dos):** cuando el tope viene **solo** del stock (no hay `quantity_rule.max` y se cumple la condición de `:147` / `:311`), no emitas `max` nativo. Emite en su lugar `data-quantity-stock-max="{{ item.quantity }}"` y mantén el «+» deshabilitado por el servidor como hoy (`:188` / `:356`). Si hay `quantity_rule.max`, todo sigue igual: `max` nativo y sin `data-quantity-stock-max`. Usa una variable aparte (por ejemplo `stock_max`) en lugar de reutilizar `quantity_max`, para que el criterio de cada atributo se lea solo.
2. **`readQuantityRules`:** devuelve además `stockMax` (de `data-quantity-stock-max`; `Infinity` si falta o no es un número finito). `stockMax` se usa **solo para los botones**: `nextQuantity` y `syncQuantityStepper` toman como techo el menor entre el de la regla y el de stock, sobre la rejilla. Con el campo en 8 y `stockMax` 8, el «+» queda deshabilitado también tras cualquier `input` o `change`.
3. **`snapQuantityField`:** en `[data-cart-quantity]` no recorta por `stockMax`; sí sigue recortando por `min`, por `quantity_rule.max` (atributo `max`) y por la rejilla de `step`. Fuera del carrito (ficha, producto destacado) no hay `data-quantity-stock-max` y nada cambia.
4. **Resultado esperado:** escribir 20 con la línea en 8 deja el campo en 20, `checkValidity()` ya no bloquea, sale `/cart/change.js` con `quantity: 20`, Shopify responde 422 con su texto localizado y:
   - en `/cart`, el camino de R6 lo muestra en la línea y la línea vuelve a 8 tras repintar;
   - en el cajón, `showError` lo muestra en `[data-cart-error]` y la línea vuelve a 8 tras la lectura fresca.
5. **Comprueba `checkValidity`** en los tres sitios (`:3452`, `:7295`, `:7432`): con el cambio ya no debe bloquear 20 en una línea con solo tope de stock, y debe seguir bloqueando lo que hoy bloquea por `quantity_rule` (por ejemplo, un valor fuera de rejilla que el recorte no pudo corregir).
6. Actualiza los comentarios de Liquid y JS que hablen de la regla del «+» (`main-cart-items.liquid:143-146`, `cart-drawer.liquid:307-310`, el bloque de `:7156-7168`) para que digan lo que hace el código nuevo. Sin minificar, sin SCSS, sin dependencias nuevas.

## 6. Fuera de alcance

- **Copy nuevo: ninguno.** El texto visible lo da Shopify y el respaldo es `sections.cart.error`, que ya existe. No añadas claves de locale ni settings de editor.
- **No uses en cliente la clave `products.product.quantity_rules.max`** («Maximum {{ quantity }}», `locales/en.default.json:489`) ni ningún texto propio del tipo «Maximum 8»: exigiría aprobación de copy (D35).
- **Ficha de producto y producto destacado:** no los toques. Si cambias código que comparten (`readQuantityRules`, `nextQuantity`, `syncQuantityStepper`, `snapQuantityField`), su comportamiento no puede cambiar; lo protegen, entre otros, los tests de `tests/r3-search-filters-price.spec.mjs` (FO-05).
- No cambies cómo se pinta ni cuándo se borra el aviso de línea de R6 (D87, observación 1 aceptada).
- No cambies la lógica de `quantity_rule` (`min`, `max`, `increment`) en ninguna superficie.

## 7. Los cinco estados degenerados (compuerta 2) y casos límite de inventario

Recorre y deja constancia en la entrega, con test cuando sea posible:

- **Sin control de inventario** (`inventory_management` vacío): ni `max` ni `data-quantity-stock-max`; el «+» activo; 20 se envía como hoy.
- **Política `continue`** (se vende sin stock): igual que sin control de inventario.
- **`quantity_rule` con `max` y `increment`** (por ejemplo min 2, step 2, max 10): `max` nativo como hoy, recorte a la rejilla y al máximo de la regla como hoy, sin `data-quantity-stock-max` aunque el stock sea menor.
- **Una sola unidad en stock** (pieza única, línea en 1 de 1): «+» deshabilitado por el servidor y tras `input`/`change`; escribir 2 envía la petición y muestra el 422.
- **Línea por debajo del tope** (5 con 8 en stock): no hay tope en el campo, igual que hoy; escribir 20 sigue el camino de R6 sin cambios.
- *Vacío:* carrito vacío tras quitar la única línea, sin aviso residual ni error de consola.
- *Muchos:* 10+ líneas con una en el tope de stock; el aviso va a la fila correcta (por clave, no por posición).
- *Muy largo* y *faltante:* los cubre R6 (`tests/r6-cart-line-error.spec.mjs:195` y `:247`); no deben romperse.

## 8. Pruebas (sin tienda)

Añádelas a `tests/r6-cart-line-error.spec.mjs` o a un spec nuevo `tests/r7-*.spec.mjs`. **Simula el tope de stock en el mock** como lo emitirá el Liquid nuevo: amplía `cartPageMarkup` y `cartDrawerMarkup` (`tests/support/r3-support.mjs`) con un parámetro opcional por línea (por ejemplo `stockMax`) que emita `data-quantity-stock-max` y el «+» deshabilitado cuando `quantity >= stockMax`, sin cambiar lo que emiten hoy por defecto (otros specs dependen de ese markup). Para la ejecución con `BASE` (§9.1), el mismo test debe poder emitir el markup antiguo (`max` nativo), o documenta en la entrega cómo reprodujiste el fallo con `BASE`.

Casos mínimos:
1. **Página:** línea en 8 con tope de stock 8; escribir 20 → sale `/cart/change.js` con `quantity: 20`; aparece `[data-cart-line-error]` visible en esa fila con el texto del 422; el campo queda en 8 tras repintar.
2. **Cajón:** misma situación en el cajón abierto → sale la petición con 20; `[data-cart-error]` visible con el texto del 422; la línea queda en 8.
3. **«+» deshabilitado en 8 tras repintar**, en página y en cajón, y sigue deshabilitado tras un evento `input` en el campo.
4. **`quantity_rule` sin regresión:** con regla min 2, step 2 y max 10 y la línea en 4, escribir 20 sigue recortando a 10 en la página y en el cajón (sale la petición con 10), y el «+» se deshabilita en 10. Y con un valor fuera de rejilla (5 con step 2) sigue llevando al paso válido.
5. **Por debajo del tope:** línea en 5 sin tope en el campo; 20 sigue el camino de R6 (petición, aviso en línea, 8 tras el 422).
6. **Sin control de inventario / `continue`:** sin `data-quantity-stock-max` ni `max`; el «+» activo.

Los casos 1 a 3 deben **fallar con `BASE`** y pasar después. Los casos 4 a 6 pasan en los dos sentidos: indícalo en la entrega («guarda comportamiento existente»), no los presentes como fallo previo.

## 9. Verificación obligatoria

1. **Tests que fallan con `BASE` y pasan después**, con las variables del helper:
   ```bash
   git show "$BASE":assets/theme.js > /tmp/r7-base-theme.js
   git show "$BASE":assets/base.css > /tmp/r7-base-base.css
   R3_THEME_JS=/tmp/r7-base-theme.js R3_BASE_CSS=/tmp/r7-base-base.css npx playwright test <tu spec> --trace off   # los casos 1 a 3 deben FALLAR
   npx playwright test <tu spec> --trace off                                                                        # todos deben PASAR
   ```
   Pega en la entrega la salida de las dos ejecuciones.
2. **`npm run gates:static` en verde DESPUÉS de cada commit de código**, no antes: el empaquetador y parte de los gates leen de HEAD.
3. **Batería completa, sin `tests/pdp-line-total.spec.mjs`** (necesita un storefront local en `127.0.0.1:9292`), al final, **dos veces seguidas en verde**:
   ```bash
   npx playwright test --trace off $(ls tests/*.spec.mjs | grep -v pdp-line-total)
   ```
4. **ZIP y manifiesto UNA sola vez, al final**, con todo commiteado y los gates en verde sobre HEAD, con el procedimiento de `agent-comms/outbox-claude/CLAUDE-R3-IMPL-001.md` §12.7:
   - `node scripts/package-theme-zip.mjs --out Sartorial-1.0.0.zip --expect-count 111` (R7 no añade archivos al tema);
   - `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`: la cabecera de diez líneas, con «Validado en tienda: NO», y una línea `sha256  ruta` por archivo, en el orden de la ZIP;
   - comprueba «internal references: none», `unzip -t` y `node --check` de los JS extraídos;
   - el manifiesto va en su propio commit, el último.
5. **Las cinco compuertas de `AGENTS.md`:** 1 (filas del ledger con evidencia, §10), 2 (§7), 3 (una sola regla de tope compartida por las dos secciones y un solo `readQuantityRules`; no dupliques la condición de stock en JS ni textos), 4 (sin settings ni labels nuevos), 5 (la hace Claude en la tienda).

## 10. Filas del ledger afectadas

Actualiza en `docs/requirements-ledger.md`, con evidencia `archivo:línea` del resultado final o nombre de test; las que exigen tienda real se quedan en `código completo`:

- **Página de carrito y cajón sincronizados (AS-02 / FB-30)** (`docs/requirements-ledger.md:153`): añade R7, el tope de stock que ya no recorta en silencio en `/cart` y en el cajón, con las líneas de Liquid y JS y los tests nuevos.
- **Live Regions (`aria-live`)** (`docs/requirements-ledger.md:60`): solo si cambia algo de los anuncios; si no cambia, dilo en la entrega.
- **Reglas de cantidad visibles en ficha y producto destacado (FO-05)** (`docs/requirements-ledger.md:149`): sin cambio de estado; cita el test que demuestra que la ficha no cambió si tocaste código compartido.

## 11. Lecciones de rondas anteriores

- **Theme Check no detecta todo lo que Shopify rechaza al subir** (por ejemplo `"default": ""` en un schema, que ahora detecta `gates:json`). No añadas settings.
- **El empaquetador lee de HEAD**: lo no commiteado no entra en la ZIP y los gates de antes del commit no prueban nada.
- **No subas temas a la tienda.** Lo hace Claude al revisar, con D77 y el overlay D70.
- **Haz `git fetch origin master` antes de comprobar que el encargo existe** (§3.1).
- **El mock no es la tienda:** el defecto de R7 se escapó porque el mock no emitía el tope de stock. Haz que el markup simulado siga al Liquid nuevo atributo por atributo.
- Comprueba lo que dice este encargo contra el código antes de cambiarlo.

## 12. Formato de la entrega

Archivo `agent-comms/outbox-gpt/GPT-R7-001-ENTREGA.md`. Empieza con la cabecera de `agent-comms/RULES.md` §1.4 y después:

1. Rama, commits (hash y mensaje) y enlace al PR en borrador, o el aviso de que GitHub no te dejó abrirlo.
2. Archivos y líneas tocadas, con `archivo:línea` del resultado final.
3. Tests: cada caso con su salida **antes** (con `BASE`) y **después**, más la salida de `npm run gates:static` tras cada commit de código y las dos de la batería completa.
4. ZIP y manifiesto: sha256, número de archivos y las comprobaciones de §9.4.
5. Filas del ledger que modificas (§10), con estado propuesto y evidencia.
6. Copy nuevo: debe ser «ninguno».
7. Los estados de §7, uno por uno, con su test o la razón de no tenerlo.
8. Qué queda residual y lo que no pudiste hacer.
9. Desviaciones de este encargo, como Nivel 1 o Nivel 2 según `agent-comms/RULES.md`.
10. Si GitHub te denegó algo (abrir el PR, subir la rama), dilo con el texto del error.

Claude revisará el diff, las cinco compuertas, los tests en los dos sentidos, la ZIP y el manifiesto reproducidos y las filas del ledger, y comprobará en la tienda de QA el caso de 20 con 8 en stock en `/cart` y en el cajón, en escritorio y en móvil.

## 13. Mensaje corto para pegar a GPT

```text
Tienes un encargo nuevo: GPT-TASK-R7-001 (el tope de stock deja de recortar en silencio en /cart y en el cajón).
Antes de nada, trae la rama: git fetch origin master
Después comprueba: git cat-file -e origin/master:agent-comms/inbox-gpt/GPT-TASK-R7-001.md && echo OK
Si imprime OK, léelo entero (agent-comms/inbox-gpt/GPT-TASK-R7-001.md), crea la rama gpt/r7-cart-stock-cap desde origin/master, abre PR en borrador y entrega en agent-comms/outbox-gpt/GPT-R7-001-ENTREGA.md. No toques la tienda ni hagas push a otras ramas. Si no imprime nada tras el fetch, avísame y no empieces.
```
