# GPT-TASK-R6-001: ronda R6, mensaje visible cuando Shopify recorta la cantidad en /cart

```text
ID: GPT-TASK-R6-001
Fecha: 2026-11-26
De: Claude (líder técnico; revisa la entrega antes de fusionarla)
Para: GPT (ejecutor de la ronda R6, D86)
Decisiones que lo autorizan: D86 en docs/decisions.md (Johandry, 2026-11-26, «sí, arréglalo y que lo haga gpt»)
Base verificada: master 8724f64 (R5 integrada; ZIP de 111 archivos)
Entrega: agent-comms/outbox-gpt/GPT-R6-001-ENTREGA.md + PR en borrador contra master
```

## 1. Contexto y evidencia

- Defecto comprobado el 2026-11-26 en la tienda de QA, con el tema "Sartorial R5 (626cca6)" (el código de `/cart` es el de `master`).
- En `/cart`, si el comprador pide más unidades de las disponibles (por ejemplo 20 con 8 en stock), `/cart/change.js` responde 422:
  `{"status":422,"message":"Only 8 items were added to your cart due to availability.","description":"…"}`
  y Shopify recorta la cantidad en silencio: el carrito queda con 8.
- El tema repinta bien la línea con 8 y el subtotal correcto. Pero el mensaje solo se anuncia en la región `role="status"` visualmente oculta: quien mira la pantalla ve cambiar la cantidad sin explicación. El foco queda en el campo de cantidad. El botón «+» queda deshabilitado en el máximo.
- No es una regresión: el formulario nativo anterior tampoco avisaba. D85 lo aceptó como residual; Johandry decidió arreglarlo (D86) y que lo haga GPT.
- Un solo arreglo, de alcance pequeño. No amplíes el alcance: no toques el cajón salvo la prueba de §3.4.

Lectura obligatoria, en este orden:
1. Este encargo (el análisis con `archivo:línea` de `master` está en §3).
2. `docs/decisions.md`: D79, D82 a D86.
3. `agent-comms/outbox-claude/CLAUDE-R5-INTEGRACION-001.md` (cómo quedó `initCartPage`, M1 y M3).
4. Reglas permanentes: `AGENTS.md` (las 5 compuertas), `agent-comms/RULES.md`, `docs/requirements-ledger.md`.
5. Estilo de la ronda anterior: `agent-comms/inbox-gpt/GPT-TASK-R5-001.md` y `tests/r5-cart-page.spec.mjs`.

## 2. Punto de partida y reglas de git

1. **Primero trae `master` y después comprueba.** Sin el `fetch`, la comprobación mira una copia local vieja y puede decirte que el encargo no existe:
   ```bash
   git fetch origin master
   git cat-file -e origin/master:agent-comms/inbox-gpt/GPT-TASK-R6-001.md && echo "encargo en master: puedes empezar"
   ```
   Si no imprime nada tras el `fetch`, no empieces y avisa.
2. Crea una rama nueva desde `origin/master`, por ejemplo `gpt/r6-cart-line-error`. Anota la base: `BASE=$(git rev-parse origin/master)`; la necesitas para los tests de §4.
3. Abre un **pull request en borrador** contra `master` en cuanto tengas el primer commit. **Si GitHub te deniega abrir el PR, dilo en la entrega y Claude lo abrirá.**
4. Commits pequeños, con el mensaje en español. El test va en el mismo commit que su cambio.
5. Nunca hagas force-push, nunca rebases ramas compartidas y nunca fusiones tú el PR.
6. No toques `agent-comms/BOARD.md` ni `docs/decisions.md`. Si surge una decisión, escríbela en tu entrega como propuesta.
7. No pongas identificadores de modelo en ningún archivo ni commit.
8. Antes de editar, lee el archivo y comprueba los números de línea: los de este encargo son de `master` `8724f64`.
9. No subas temas a ninguna tienda ni ejecutes nada contra tiendas. La subida del tema R6 sin publicar la hace Claude al revisar.

## 3. Análisis del código y diseño

### 3.1 Cómo maneja hoy `/cart` el error (`master`, `assets/theme.js`)

- `postCartUpdate` (`:253-269`): si `!response.ok` lanza `Error(result?.description || result?.message || errorMessage)` (`:268`). Un 422 con cuerpo JSON llega así al `catch` de `initCartPage`.
- `initCartPage` (`:7234` en adelante), función `update`:
  - una petición `change.js` por línea editada (`:7275`); en el `catch` guarda `failures.set(key, error.message || errorMessage)` (`:7292`) y pone `result = null`;
  - tras el bucle repinta: con cajón `drawer.renderCartResponse(result || {}, revision, options)` (`:7304`), sin cajón `replaceCartPage(html, options)` (justo después); `options` es `{ sent, focusSource }` (`:7298`);
  - el único sitio donde sale el mensaje es el anuncio: `announceCartPage(sectionId, message)` con `message = [...errors, ...announcements.values()].join(' ')` (`:7321-7322`). Nada se escribe en la página.
- `announceCartPage` (`:388-391`) y `writeCartStatus` (`:382-386`) escriben en `[data-cart-page-status]`.
- `replaceCartPage` (`:326-357`): sustituye toda la sección `[data-cart-page]` por la del servidor (`:355`), conserva escrituras pendientes (`:337`) y devuelve el foco al mismo control con `cartPageFocusTarget` (`:294`) → `focus?.focus({ preventScroll: true })` (`:356`). El foco queda en el campo de cantidad, ya repintado.
- Markup (`sections/main-cart-items.liquid`):
  - región de estado: `:7`, `<p class="visually-hidden" role="status" data-cart-page-status>`, fuera de la sección para que sobreviva al repintado;
  - línea: `:39`, `.cart-item[data-cart-item-key][data-cart-item-title]`; detalles `.cart-item__details` (`:52`); controles `.cart-item__controls` (`:138`); campo `#CartQuantity-{{ forloop.index }}` (`:169`); «+» con `disabled` en el máximo (`:184-188`).
  - El `id` del campo cambia con la posición de la línea (`forloop.index`): no uses ese `id` como clave; usa `data-cart-item-key`.
- Locales existentes: `sections.cart.error` = «We could not update your cart. Please try again.» (`locales/en.default.json:91`, `locales/es.json:91`). Se pasa como `data-error-message` (`main-cart-items.liquid:16`) y es el respaldo de `postCartUpdate`. No hay clave específica de stock y no hace falta: el texto útil lo devuelve Shopify.
- Texto del servidor: Shopify lo devuelve ya localizado en el idioma de la tienda. Se pinta **siempre con `textContent`, nunca como HTML**. Conserva la precedencia actual `description || message` (`:272`) para que lo visible y lo anunciado coincidan; en tu test simula el 422 con los dos campos y una variante con solo `message`.

### 3.2 Cómo muestra hoy el cajón los errores de línea

El cajón **ya muestra el error a la vista**; no está en el alcance del cambio:

- Contenedor general bajo la cabecera, fuera del área con scroll: `<p class="cart-drawer__message" role="alert" data-cart-error hidden>` (`sections/cart-drawer.liquid:122`). CSS: `.cart-drawer__message` (`assets/base.css:3739` y `:9546`).
- Quien lo escribe: `handleDrawerChange` llama `changeLine(...).catch((error) => this.showError(error.message))` (`assets/theme.js:3397-3402`); `showError` pone el texto con `textContent` y quita `hidden` (`:4567-4572`).
- `changeLine` (`:4155`) hace `clearMessages()` al empezar (`:4171`), así que el mensaje desaparece en el siguiente cambio. `postCartUpdate` lanza antes de `renderCartResponse`, y `endMutation` fuerza una lectura fresca (`:4255-4273`), de modo que la línea del cajón muestra la cantidad recortada.
- Límite aceptable: es un aviso general del cajón, no por línea. Como es `role="alert"` se anuncia solo; no hay duplicado con la región de estado.
- En el encargo solo se añade una **prueba de protección** del cajón (§3.4).

### 3.3 Diseño mínimo para `/cart`

1. **Un mensaje por línea, dentro de la línea.** Un `<p class="form-message form-message--error" data-cart-line-error>` como último hijo de `.cart-item__details`, justo tras `.cart-item__controls`. Reutiliza `.form-message` y `.form-message--error` (`assets/base.css:1112` y `:6306-6331`), que ya existen; solo añade CSS nuevo si el diseño lo exige (por ejemplo el margen), en `assets/base.css`, sin SCSS.
2. **Texto:** el de Shopify (`failures.get(key)`, ya es `description || message` o, si no hay, `errorMessage`), con `textContent`.
3. **Asociación para lectores de pantalla:** el mensaje lleva un `id` estable derivado de la clave (por ejemplo `CartLineError-` + un identificador sin caracteres inválidos; la clave tiene `:`, escápala o usa un contador) y el campo de cantidad recibe `aria-describedby` con ese `id` (añadiendo, sin pisar, un valor previo). Así, al quedar el foco en el campo tras el repintado, se lee el mensaje con el campo.
4. **Sin duplicar el anuncio:** el mensaje visible **no** es `role="status"` ni `role="alert"` ni `aria-live`. El anuncio de `[data-cart-page-status]` se queda como está (`:7321-7322`).
5. **Dónde se inserta:** en `replaceCartPage` (`:326`), sobre el `next` ya parseado, **antes** de `current.replaceWith(next)` (`:355`) y del `focus()` (`:356`), para que el campo ya tenga `aria-describedby` cuando recibe el foco. Pasa los errores en `options` (por ejemplo `errors: failures`), que ya viaja por `drawer.renderCartResponse → renderCartPage (:4353) → replaceCartPage (:4372)`. Si no hay repintado (`painted` nulo), inserta el mismo mensaje en la línea de la página actual, para no perder el aviso.
6. **Cuándo desaparece:**
   - al repintar la sección: el servidor devuelve la sección sin mensaje, así que cualquier repintado posterior lo quita sin código extra (compruébalo);
   - en el siguiente cambio correcto de esa línea: al empezar `update`, o al registrar un éxito para esa clave (`:7283`), borra el mensaje y el `aria-describedby` de esa línea en el DOM actual. Un fallo en otra línea no borra el de esta.
7. **Cajón:** no se cambia. Si GPT cree que algo del cajón debe cambiar, que lo proponga como desviación (§6.9); no lo haga.
8. **Copy nuevo: ninguno.** El texto viene de Shopify y el respaldo es `sections.cart.error`, que ya existe. Si aun así necesitas una clave nueva, escríbela en `locales/en.default.json` y `locales/es.json` y **lístala en la entrega para aprobación (D35); no la des por aprobada.** No añadas settings de editor.

### 3.4 Pruebas (sin tienda)

Un spec nuevo, por ejemplo `tests/r6-cart-line-error.spec.mjs`, con los helpers de `tests/support/r3-support.mjs` y el patrón de `tests/r5-cart-page.spec.mjs` (`mountCart`, la opción `error`, que hace `route.fulfill`). Simula el 422 con `page.route`/`route.fulfill({ status: 422, json: {...} })`, y que la respuesta recorte la cantidad en el estado del servidor simulado (la línea queda en 8).

Casos mínimos en `/cart`:
1. **Visible:** tras pedir 20 con 8 en stock, aparece `[data-cart-line-error]` dentro de la fila afectada, `toBeVisible()`, con el texto del servidor exacto y sin HTML interpretado (prueba con un `message` que contenga `<b>x</b>` y comprueba que el texto lo muestra literal).
2. **Asociado:** el campo de cantidad de esa fila tiene `aria-describedby` apuntando al `id` del mensaje; el mensaje no tiene `role` ni `aria-live`; el foco sigue en el campo; el campo muestra 8.
3. **No duplicado:** hay un único mensaje (`count() === 1`) y el texto aparece una vez en `[data-cart-page-status]` y una vez en la línea, no más; ningún `role="alert"` nuevo en la página.
4. **Desaparece:** tras un cambio correcto de esa línea (por ejemplo a 3) el mensaje y el `aria-describedby` ya no están. Y un fallo en otra línea no borra el de esta (dos líneas).
5. **Con cajón en la página** (`drawer: true`): el mismo resultado con el cajón presente (es la ruta `drawer.renderCartResponse`).
6. **Sin repintado** (la lectura de la sección falla): el mensaje sigue apareciendo en la línea.
7. **Cajón, protección:** abre el cajón, pide más de lo disponible con el mismo 422; comprueba que `[data-cart-error]` es visible con el texto del servidor y que se limpia en el siguiente cambio correcto. Este caso **ya pasa con `master`**; indícalo en la entrega («guarda comportamiento existente»), no lo presentes como fallo previo.

Los casos 1 a 6 deben **fallar con `master`** y pasar después (§4.1).

### 3.5 Los cinco estados degenerados (compuerta 2)

- *Vacío:* carrito vacío tras quitar la única línea, sin mensaje residual ni error de consola.
- *Uno solo:* una línea con 422; mensaje y descripción asociados a la única fila.
- *Muchos:* 10+ líneas, 422 en una; el mensaje va en la fila correcta (por clave, no por posición) y las demás no cambian.
- *Muy largo:* mensaje de 300 caracteres y título de producto de 120; el mensaje se parte en líneas, sin desbordar a 375 px.
- *Faltante:* respuesta 422 sin `description` ni `message` (o sin JSON): se muestra `sections.cart.error`.

## 4. Verificación obligatoria

1. **Tests que fallan con `BASE` y pasan después**, con las variables del helper:
   ```bash
   git show "$BASE":assets/theme.js > /tmp/r6-base-theme.js
   git show "$BASE":assets/base.css > /tmp/r6-base-base.css
   R3_THEME_JS=/tmp/r6-base-theme.js R3_BASE_CSS=/tmp/r6-base-base.css npx playwright test tests/r6-cart-line-error.spec.mjs --trace off   # los casos 1 a 6 deben FALLAR
   npx playwright test tests/r6-cart-line-error.spec.mjs --trace off                                                                          # todos deben PASAR
   ```
   Pega en la entrega la salida de las dos ejecuciones.
2. **`npm run gates:static` en verde DESPUÉS de cada commit de código**, no antes: el empaquetador y parte de los gates leen de HEAD.
3. **Batería completa, sin `tests/pdp-line-total.spec.mjs`** (necesita un storefront local en `127.0.0.1:9292`), al final y en verde:
   ```bash
   npx playwright test --trace off $(ls tests/*.spec.mjs | grep -v pdp-line-total)
   ```
4. **ZIP y manifiesto UNA sola vez, al final**, con todo commiteado y los gates en verde sobre HEAD, con el procedimiento de `agent-comms/outbox-claude/CLAUDE-R3-IMPL-001.md` §12.7:
   - `node scripts/package-theme-zip.mjs --out Sartorial-1.0.0.zip --expect-count 111` (R6 no debería añadir archivos al tema);
   - `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`: la cabecera de diez líneas, con «Validado en tienda: NO», y una línea `sha256  ruta` por archivo, en el orden de la ZIP;
   - comprueba «internal references: none», `unzip -t` y `node --check` de los JS extraídos;
   - el manifiesto va en su propio commit, el último.
5. **Las cinco compuertas de `AGENTS.md`:** 1 (filas del ledger con evidencia `archivo:línea` o nombre de test), 2 (§3.5), 3 (reutiliza `.form-message`, `errorMessage` y `failures`; no dupliques textos), 4 (sin settings ni labels nuevos), 5 (la hace Claude en la tienda).

## 5. Lecciones de rondas anteriores

- **Theme Check no detecta todo lo que Shopify rechaza al subir** (por ejemplo `"default": ""` en un schema, que ahora detecta `gates:json`). No añadas `"default"` vacíos ni settings nuevos.
- **El empaquetador lee de HEAD**: lo no commiteado no entra en la ZIP y los gates de antes del commit no prueban nada.
- **No subas temas a la tienda.** Lo hace Claude al revisar.
- **La subida de presets sigue D77** (la ZIP descomprimida, con solo los cuatro archivos del preset sustituidos, y después el overlay D70); no la hagas tú.
- **Haz `git fetch origin master` antes de comprobar que el encargo existe** (§2.1).
- Comprueba lo que dice este encargo contra el código antes de cambiarlo: los números de línea son de `8724f64`.

## 6. Formato de la entrega

Archivo `agent-comms/outbox-gpt/GPT-R6-001-ENTREGA.md`. Empieza con la cabecera de `agent-comms/RULES.md` §1.4 y después:

1. Rama, commits (hash y mensaje) y enlace al PR en borrador, o el aviso de que GitHub no te dejó abrirlo.
2. Archivos y líneas tocadas, con `archivo:línea` del resultado final.
3. Tests: cada caso con su salida **antes** (con `BASE`, falla) y **después** (pasa), más la salida de `npm run gates:static` tras cada commit de código y la de la batería completa.
4. ZIP y manifiesto: sha256, número de archivos y las comprobaciones de §4.4.
5. Filas de `docs/requirements-ledger.md` que cierras o modificas, con estado propuesto y evidencia. Como mínimo la de la página de carrito y cajón sincronizados (AS-02 / FB-30) y la de Live Regions; las que exigen tienda real se quedan en `código completo`.
6. Copy nuevo para aprobación, o «ninguno».
7. Qué queda residual (quitado el recorte silencioso de D85) y lo que no pudiste hacer.
8. Desviaciones de este encargo, como Nivel 1 o Nivel 2 según `agent-comms/RULES.md`.
9. Si GitHub te denegó algo (abrir el PR, subir la rama), dilo con el texto del error.

Claude revisará el diff, las cinco compuertas, los tests en los dos sentidos, la ZIP y el manifiesto reproducidos y las filas del ledger, y comprobará en la tienda de QA el caso de 20 con 8 en stock.

## 7. Mensaje corto para pegar a GPT

```text
Tienes un encargo nuevo: GPT-TASK-R6-001 (mensaje visible cuando Shopify recorta la cantidad en /cart).
Antes de nada, trae la rama: git fetch origin master
Después comprueba: git cat-file -e origin/master:agent-comms/inbox-gpt/GPT-TASK-R6-001.md && echo OK
Si imprime OK, léelo entero (agent-comms/inbox-gpt/GPT-TASK-R6-001.md), crea rama desde origin/master, abre PR en borrador y entrega en agent-comms/outbox-gpt/GPT-R6-001-ENTREGA.md. Si no imprime nada tras el fetch, avísame y no empieces.
```
