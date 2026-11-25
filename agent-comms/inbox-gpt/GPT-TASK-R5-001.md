# GPT-TASK-R5-001: ronda R5, seis arreglos tras las auditorías manuales de R4

```text
ID: GPT-TASK-R5-001
Fecha: 2026-11-25
De: Claude (líder técnico; revisa la entrega antes de fusionarla)
Para: GPT (ejecutor de la ronda R5, D79)
Decisiones que lo autorizan: D79 a D81 en docs/decisions.md (Johandry, 2026-11-25, «que lo haga gpt»)
Base verificada: master 4877716 (R4 integrada; ZIP de 111 archivos, sha256 30f2ba2b…608d17)
Entrega: agent-comms/outbox-gpt/GPT-R5-001-ENTREGA.md + PR en borrador contra master
```

## 1. Contexto

- `master` contiene la versión R4 del tema. La ZIP canónica tiene 111 archivos y su manifiesto está en `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`.
- El 2026-11-25, dos auditorías manuales en navegador real revisaron los tres temas R4 sin publicar de la tienda de QA:
  - "Sartorial R4 (0b4d517)" `190695473456`;
  - "Archive R4 (0b4d517)" `190695506224`;
  - "Imprint R4 (0b4d517)" `190695538992`.
- **Auditoría de QA (Claude):** probablemente pasaría la revisión. No hay defectos bloqueantes ni altos; hay dos medios y siete bajos.
- **Tu auditoría:** un defecto alto en la barra de compra. Se descartó como artefacto de la barra de vista previa de Shopify (D81). Su parte real coincide con el defecto 5 de QA y entra en R5 como arreglo B.
- Johandry decidió que R5 la haces tú y la revisa Claude (D79). Son seis arreglos de código, A a F.
- Quedan fuera de R5:
  - el precio tachado en el cajón y en /cart, que queda como residual de 1.0 (D80);
  - las secciones de producto destacado a 0 px de los presets, que son configuración de los overlays (D70).

Lectura obligatoria, en este orden:
1. Este encargo. La §3 trae la verificación de cada arreglo contra el código, con `archivo:línea` de `4877716`.
2. `docs/decisions.md`, D79 a D81. También D55 (compromiso de AS-02), D70 y D77.
3. Auditorías:
   - `docs/audits/R4/R4-AUDITORIA-MANUAL-QA.md`: los defectos 1 a 9 de QA. Es una copia del original de la rama `qa/r4-manual-audit`, sin el carrito personal del usuario.
   - `docs/audits/R4/R4-AUDITORIA-MANUAL-GPT.md`: tu resumen y el diagnóstico de tu defecto alto.
4. Reglas permanentes:
   - `AGENTS.md` (las 5 compuertas de la Definition of Done);
   - `agent-comms/RULES.md`;
   - `docs/requirements-ledger.md`.
5. La ronda anterior, como referencia de estilo y de tests: `agent-comms/inbox-gpt/GPT-TASK-R4-001.md` y `tests/r4-*.spec.mjs`.

## 2. Punto de partida y reglas de git

1. **Espera a que esté fusionado el PR que trae este encargo.** Compruébalo así:
   ```bash
   git fetch origin
   git cat-file -e origin/master:agent-comms/inbox-gpt/GPT-TASK-R5-001.md && echo "encargo en master: puedes empezar"
   ```
   Si no imprime nada, no empieces.
2. Crea una rama nueva desde `origin/master`, por ejemplo `gpt/r5-carrito-barra`. Anota la base: `BASE=$(git rev-parse origin/master)`; la necesitas para los tests de §4.
3. Abre **un pull request en borrador** contra `master` en cuanto tengas el primer commit. **Si GitHub te deniega abrir el PR, dilo en la entrega y Claude lo abrirá.**
4. **Un commit pequeño por arreglo** (A, B, C…), con el mensaje en español y el defecto de QA que cierra. El test va en el mismo commit que su arreglo.
5. Nunca hagas force-push, nunca rebases ramas compartidas y nunca fusiones tú el PR.
6. No toques `agent-comms/BOARD.md` ni `docs/decisions.md`. Si surge una decisión, escríbela en tu entrega como propuesta.
7. No pongas identificadores de modelo en ningún archivo ni commit.
8. Antes de editar, lee el archivo y comprueba los números de línea: los de este encargo son de `4877716`.
9. No subas temas a ninguna tienda ni ejecutes nada contra tiendas. La subida de los temas R5 sin publicar la hace Claude al revisar.

## 3. Arreglos, por orden de prioridad

Cada arreglo exige:
- test Playwright sin tienda que falle con `BASE` y pase después (§4);
- `npm run gates:static` en verde después de su commit;
- los cinco estados degenerados de la compuerta 2.

### A. /cart: subtotal y líneas al cambiar la cantidad (defecto 1 de QA, media)

**Estado: CONFIRMADO leyendo el código.**

**Causa:**
- `/cart` es un formulario sin JavaScript a propósito.
  - `sections/main-cart-items.liquid:28`: `<form ... method="post" novalidate>`.
  - Los campos son `updates[]` posicionales (`:166`).
  - El comentario de `:144-149` dice «This page works without JavaScript».
- Los botones «+» y «−» solo escriben el campo y emiten `change` (`assets/theme.js:7039-7083`; comentario de diseño en `:6954-6965`, «On the cart page, which is a form without JavaScript, the field is left edited awaiting "Update cart"»).
- Nadie escucha ese `change` en la página. `CartDrawer.handleDrawerChange` (`:3157-3198`) solo escucha dentro del cajón (`this.listen(this, 'change', …)`, `:2997`).
- El subtotal (`sections/main-cart-items.liquid:214-216`) y el precio de línea (`:109-114`) solo cambian al recargar con «Update cart» (`:228-233`).

**Lo que ya existe y hay que respetar:**
- **El cajón actualiza la página.** `CartDrawer.changeLine` (`assets/theme.js:3950-4010`):
  - hace POST a `/cart/change.js` con la clave de línea;
  - pide en la misma llamada la sección del cajón y la de /cart (`renderSectionIds`, `:4170-4175`);
  - repinta el cajón y después la página con `renderCartPage` (`:4179-4211`).
- **AS-02 y D55:**
  - `renderCartPage` no sustituye la página al abrir el cajón si hay cantidades o nota sin enviar (`cartPageHasEdits`, `:4213-4216`; la condición, `:4186`).
  - Tras una mutación, conserva la nota escrita (`:4205-4208`).
  - Tests «AS-02 …» de `tests/r3-cart.spec.mjs`.
  - D55 acepta que, con ediciones sin enviar, un cambio desde otra pestaña deja /cart desactualizada hasta la siguiente mutación.
- **FB-30:** en /cart un 0 se respeta como orden de eliminar (`snapQuantityField`, `:6986-6989`). Test «FB-30 …».
- **El cajón no siempre existe.** Solo se pinta si `settings.cart_type == 'drawer'` (`layout/theme.liquid:147-149`). Con «page» no hay `CartDrawer` en /cart, así que la página no puede depender solo de él.
- **`renderCartPage` no restaura el foco** (`currentPage.replaceWith(nextPage)`, `:4209`). Hoy da igual, porque el foco está en el cajón abierto; en la página, el «+» pulsado desaparecería.
- **El cajón ya tiene la lógica de foco y de anuncios:**
  - `lineControlAfterRender` (`:4012-4023`) busca el mismo control de la misma línea por su clave;
  - `showStatus` (`:4447-4464`) vacía la región y escribe el texto 100 ms después (NVDA y JAWS);
  - `updateHeaderCount` (`:4316-4342`).

**Diseño mínimo propuesto (mejora progresiva):**
1. **Sin JavaScript, nada cambia:** el formulario, «Update cart», «Checkout» y `updates[]` funcionan como hoy. El fallback de `layout/theme.liquid:104-118` devuelve `no-js` si `theme.js` no arranca.
2. **Un controlador delegado en `document`** (por ejemplo, `initCartPage()`, como `initQuantitySteppers`), no un listener en nodos. La página se sustituye entera en cada repintado y un listener en un nodo no sobreviviría.
   - Escucha `change` en `[data-cart-page] input[name="updates[]"]`.
   - Llama a `snapQuantityField`, que es idempotente, para no depender del orden de los listeners.
   - Valida como el cajón (`:3173-3183`): el 0 se acepta; un valor inválido llama a `reportValidity()` y no se envía.
3. **Debounce de unos 400 ms** desde el último `change`. Dos o tres pulsaciones rápidas de «+» acaban en **una sola** petición con la cantidad final.
4. **Una petición por lote, por clave y no por posición.** POST a `/cart/update.js` con:
   - `updates: { [clave de línea]: cantidad }`, con todas las líneas cuyo `value` difiere de `defaultValue`;
   - `sections`: la de la página, más la del cajón si existe;
   - `sections_url`.

   Así se evita el problema posicional de `updates[]`. Las filas ya llevan `data-cart-item-key` (`sections/main-cart-items.liquid:31`). Si prefieres `/cart/change.js` por línea, como el cajón, justifícalo en la entrega.
5. **Un solo responsable de las revisiones.** Si hay cajón, el resultado entra por él, para que una respuesta vieja del cajón no pise la nueva. Por ejemplo, un método pequeño de `CartDrawer` que haga `beginMutation()` → `renderCartResponse(result, revision)` → `endMutation()`. Ese camino ya repinta la página con `renderCartPage`. Sin cajón, el controlador repinta la página él mismo.
   - **Reutiliza, no copies:** saca a funciones de módulo la petición con el tratamiento de errores (`:3969-3992`), la sustitución de la página conservando la nota (`:4202-4209`) y la búsqueda del control por clave (`:4012-4023`).
   - Mientras hay una petición en vuelo, la siguiente edición espera a su respuesta. Solo se pinta la última.
6. **Foco:**
   - Tras repintar, el foco vuelve al mismo control (campo, «+», «−» o «Remove») de la misma línea.
   - Si la línea desaparece (cantidad 0), va al campo de la línea siguiente; si no la hay, a la anterior; y, con el carrito vacío, al texto del estado vacío.
   - Nunca a `body`.
7. **Estado vivo accesible:**
   - Una región `role="status"` visualmente oculta **fuera** de `[data-cart-page]`, en la misma sección, para que sobreviva al `replaceWith`.
   - Se escribe con el patrón de `showStatus`.
   - Textos: reutiliza las claves aprobadas `sections.cart.quantity_updated` y `sections.cart.item_removed` (`locales/en.default.json:74-75`) y `sections.cart.error` (`:91`).
   - Para el título de la línea, añade `data-cart-item-title` a la fila, como en `sections/cart-drawer.liquid:207`.
   - **No inventes copy.** Si necesitas una frase nueva (por ejemplo, anunciar el subtotal), proponla en la entrega para aprobación (D35) y no la des por aprobada.
8. **Errores** (422 por existencias, 5xx, red): muestra el mensaje en la región, vuelve a leer la sección y repinta, para que el campo enseñe la cantidad real. No añadas plazos con `abort`: FB-36 sigue como residual (D54).
9. **«Update cart» y «Checkout» siguen siendo envíos nativos.** Si se pulsan con un debounce pendiente o una petición en vuelo:
   - `preventDefault`;
   - se vacía la cola y se espera la respuesta;
   - después `requestSubmit` del botón equivalente del formulario nuevo.

   Así el envío nativo nunca manda `updates[]` posicionales contra un carrito que ya cambió. Decide si «Update cart» sigue visible con JS (recomendado: visible, para no tocar copy ni el flujo sin JS) y explícalo.
10. **Cabecera:** con cajón, el recuento ya lo actualiza `renderSection`. Sin cajón, actualiza `.site-header__cart-count` y el `aria-label` del enlace con la misma lógica que `updateHeaderCount`, sacada a función. Usa la clave `sections.header.cart_count` (`sections/cart-drawer.liquid:78`) en un `data-` de la página.
11. Actualiza los comentarios que dicen que /cart no tiene JavaScript: `sections/main-cart-items.liquid:144-149` y `assets/theme.js:6954-6965`.

**Riesgos:**
- Romper AS-02 y D55.
  - Los dos tests «AS-02 …» y el de «FB-30 …» de `tests/r3-cart.spec.mjs` deben seguir pasando, igual que el resto del archivo.
  - El de FB-30 escribe 0 y emite `change`: ahora disparará una petición. Rútala en el test, sin quitar la comprobación de que el campo enseña 0.
- Que una mutación del cajón llegue durante el debounce de la página. `renderCartPage` sustituye la página aunque haya cantidades sin enviar. Decide si se envía primero lo pendiente o se descarta, y cúbrelo con un test.
- La carrera entre la respuesta de la página y la del cajón: un solo contador de revisión (punto 5).
- La nota sin enviar: se conserva siempre, en el repintado propio y en el del cajón. No se envía sola; se envía con «Update cart» o «Checkout», como hoy.
- Reglas de cantidad: mínimo, incremento, máximo y el `max` por existencias (`sections/main-cart-items.liquid:131-141`).
- La tarjeta regalo y las líneas con propiedades o planes: varias líneas de la misma variante. Por eso se usa la clave y no el ID de variante.
- El editor del tema: `shopify:section:load` sobre la sección de /cart.

**Verificación exigida** (tests nuevos, por ejemplo `tests/r5-cart-page.spec.mjs`, con `cartPageMarkup` de `tests/support/r3-support.mjs` ampliado si cambias hooks en la Liquid):
1. Con cajón: pulsar «+» en la página hace **una** petición tras el debounce.
   - Se repintan el subtotal y la línea.
   - El foco sigue en el «+» de esa línea.
   - La región anuncia la cantidad.
   - El cajón refleja la misma cantidad.
2. Sin cajón (sin `<cart-drawer>` en el DOM): lo mismo, más el recuento de la cabecera.
3. Tres pulsaciones rápidas: una sola petición con la cantidad final.
4. Nota escrita y sin enviar: sobrevive al repintado (AS-02).
5. Cantidad 0: la línea desaparece y el foco va a la línea siguiente. Con la última línea, va al estado vacío.
6. Respuesta 422: aparece el mensaje y el campo vuelve a la cantidad del servidor.
7. «Checkout» con el debounce pendiente: espera la respuesta y después envía. Comprueba que no sale ningún POST nativo con el DOM viejo.
8. Sin `theme.js` (o con `no-js`): el formulario sigue teniendo `action`, `updates[]`, «Update cart» y «Checkout». Es un test de marcado.
9. Estados degenerados: una línea, 10 o más líneas, un título de 120 caracteres, una línea sin imagen y el carrito vacío tras eliminar.

### B. Barra fija de compra sin tramo ciego (defecto 5 de QA, baja; parte real del defecto de GPT, D81)

**Estado: CONFIRMADO leyendo el código** para el tramo bajo la cabecera. **Al cargar: comportamiento por diseño**, ver la decisión de abajo.

**Causa:**
- El observador de `StickyCartBar` usa la ventana entera como raíz y solo muestra la barra cuando el botón ha salido **por arriba del todo** (`assets/theme.js:1866-1869`): `this.setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0)`.
- El respaldo sin `IntersectionObserver` hace lo mismo (`:1871-1876`, `bounds.bottom <= 0`).
- La cabecera es fija y publica su altura en `--header-offset` (`initHeaderScrollState`, `:6910-6929`). Esa altura cambia al condensarse con `scrollY > 40`.
- Mientras el botón está entre `0` y `--header-offset` (unos 77 px en la auditoría), la cabecera lo tapa y la barra sigue oculta. Es el tramo de ~650 a ~800 px de scroll del defecto 5.

**Arreglo mínimo:**
1. Crea el observador con `rootMargin: '-<offset>px 0px 0px 0px'`, donde `<offset>` es el valor numérico de `--header-offset`. La condición pasa a `!entry.isIntersecting && entry.boundingClientRect.bottom <= entry.rootBounds.top`, con `offset` como respaldo si `rootBounds` es `null`.
2. Usa `root: document` si el navegador lo admite. Con la raíz implícita, `rootMargin` no se aplica dentro de un iframe de otro origen, y el editor del tema es ese caso.
3. Recrea el observador cuando cambie `--header-offset`: un `MutationObserver` sobre el atributo `style` de `documentElement`, como `observeStickyFit` (`:318-319`).
   - **Compara el valor antes de recrear.** `setVisible` escribe `--sticky-cart-offset` en ese mismo atributo (`:1901`), así que, si no comparas, entras en un bucle.
4. El respaldo sin `IntersectionObserver` usa `bounds.bottom <= offset`.
5. Limpia los observadores en `disconnectedCallback` (`:1884-1890`).
6. Con la cabecera no fija, `offset` es 0 y todo queda como hoy.

**Decisión sobre la carga** (recomendación de Claude, que sigues salvo que Claude o Johandry digan otra cosa):
- **Comportamiento actual.** Cuando la columna no cabe (R4 C1a), el botón puede quedar bajo el borde inferior al cargar: a 1442×688 y 1368×688, unos 42 px; a 1366×768, unos 6 px. La barra no sale porque el botón no ha pasado.
- **Recomendación: se acepta y no se cambia.**
  1. Lo primero que ve el comprador es el título, el precio y las opciones. Mostrar la barra al cargar invitaría a añadir una talla o un color que no ha elegido: la barra envía la variante preseleccionada sin enseñar los selectores.
  2. Basta con desplazarse un poco para llegar al botón.
  3. Shopify no exige el botón por encima del pliegue, y Dawn no tiene barra fija.
  4. En móvil, la barra aparecería al cargar en todas las fichas.
- **Descartado:** mostrar la barra también cuando el botón está por debajo de la ventana.
- **Consecuencia:** el test existente «R4A-7 sticky cart bar appears below the primary button» (`tests/r4-product-layout.spec.mjs:114-138`) sigue comprobando que la barra **no** está visible al cargar. No cambies esa aserción.

**Riesgos:**
- El bucle del `MutationObserver` (punto 3).
- La cabecera condensada: el offset cambia al bajar de 40 px.
- El foco: `handOffFocus` (`:1906-1914`) no debe ejecutarse de más al recrear el observador.
- La barra de vista previa de Shopify tapa la barra fija en las previsualizaciones (D81). No la tomes como fallo en ninguna comprobación visual.

**Verificación exigida** (amplía `tests/r4-product-layout.spec.mjs` o crea `tests/r5-sticky-bar.spec.mjs`):
1. A 1536×674 y 1440×674, con `--header-offset: 77px` y una cabecera fija de 77 px:
   - con el botón entre `top < 0 < bottom <= 77`, la barra está visible (falla con `BASE`);
   - con `bottom > 77`, está oculta.
2. Cambiar `--header-offset` a 60 px en caliente mueve el umbral.
3. Con `--header-offset: 0px`, el comportamiento es el de hoy.
4. A 390×844, sin cambios.
5. La aserción «no visible al cargar» de R4A-7 sigue pasando.

### C. 404: el campo de búsqueda se corta en escritorio (defecto 3 de QA, baja; resto de M-17 de R4)

**Estado: CONFIRMADO.** Lo medí con el `assets/base.css` real en Chromium, con el placeholder «Search products and stories», de unos 199 px de texto:

| Viewport | Ancho de la columna | Campo | Hueco para el texto |
|---|---|---|---|
| 1024 | 288 px | 116 px | 66 px |
| 1280 | 324 px | 152 px | 102 px |
| 1440 a 1536 | 340 px | 168 px | 118 px |

**Por qué el arreglo de R4 no lo cerró:**
- `minmax(0, 1fr) auto` (`assets/base.css:7367-7369`) solo reparte bien la fila.
- El problema es el ancho de la propia columna. A partir de 62rem, `.main-404__layout` la limita a `minmax(18rem, 0.38fr)` (`:7489-7492`): unos 340 px con `page_width` 1300.
- El botón tiene `min-width: 10rem` (`:7413-7416`), y el campo tiene 25 px de padding a cada lado.
- Incluso con `page_width` 1600, el hueco para el texto se queda en unos 172 px.
- El test de R4 (`tests/r4-minor-template.spec.mjs:5-22`) no lo detectó por dos motivos:
  - montaba la fila en un contenedor a todo el ancho, sin `.main-404__layout`;
  - el botón no tenía la clase `.button`, así que no recibía el `min-width`;

  y solo comparaba que el campo fuera más ancho que el botón.

**Arreglo mínimo:**
- La fila pasa a `display: flex; flex-wrap: wrap`.
- El campo recibe `flex: 1 1 16rem; min-width: 0` y el botón `flex: 0 0 auto`.
- Con esas reglas en el CSS real, el campo ocupa toda la columna, de 288 a 340 px, con 238 a 290 px para el texto, y el botón baja a la línea siguiente cuando no caben los dos. Por encima de esa anchura siguen en una fila.
- Sustituye la regla de `:7367-7369`. Revisa el `gap` y que el `options[prefix]` oculto no ocupe sitio.

**Riesgos:**
- El texto en español, «Busca productos e historias» (`locales/es.json:429`).
- RTL.
- Que el botón deje de tener 44 px de alto.

**Verificación exigida:**
- Test con el marcado de `sections/main-404.liquid:12-31` completo (`.main-404__layout`, `.main-404__message`, el `<input type="hidden">`, `.button`) y una columna de recomendaciones.
- Viewports: 1024, 1280, 1440 y 1536; y `--page-width` a 1000 y a 1600 px.
- Comprueba que el ancho útil del campo (`clientWidth` menos padding) es mayor o igual que el ancho del placeholder medido con `canvas.measureText` y la fuente calculada del campo, en inglés y en español. Debe fallar con `BASE`.
- A 390 y a 800: sin regresión.

### D. Galería: el vídeo y el visor 3D dejan huecos (defecto 6 de QA, baja)

**Estado: CONFIRMADO.** Lo reproduje con el CSS real. En la rejilla de dos columnas, a 1522 px, la celda del 3D mide 401×768 y la del vídeo 401×768 con el vídeo a 401×401: quedan 367 px vacíos. Es exactamente lo que midió QA.

**Causa:**
- `.product-gallery__item model-viewer { min-height: clamp(24rem, 62vw, 48rem); }` (`assets/base.css:8023-8025`).
  - El mínimo depende del ancho de la ventana, no del de la celda: a 1522 px vale 768 px aunque la celda solo tenga 401.
  - La fila de la rejilla (`.product-main__layout--grid .product-gallery`, `:5112-5114`) toma esa altura.
- El vídeo nativo (`media_tag` en `snippets/product-media.liquid:23-24`) solo tiene `width: 100%` (`:1206-1211`) y conserva su proporción propia.
- Los vídeos externos (`iframe`) no tienen ninguna regla de altura en la galería.
- Las imágenes del carrusel móvil sí comparten un marco, `--gallery-ratio`, desde `sections/main-product.liquid:58` y `:84` (`assets/base.css:9248-9253`). En la rejilla de escritorio no hay nada equivalente para vídeo ni para 3D.
- En `split_screen` y `stack`, el 3D va solo en su fila y no deja hueco. Medido: 634×768 y 814×768.

**Arreglo mínimo:**
- En `@media (min-width: 62rem)`, solo para `.product-main__layout--grid`:
  - `model-viewer`, `video` e `iframe` de `.product-gallery__item` reciben `aspect-ratio: var(--gallery-ratio, 0.8); min-height: 0; height: auto`;
  - el vídeo, además, `object-fit: contain`.
- Con esas reglas, las dos celdas miden 401×401 y no hay hueco.
- Hay un precedente en el producto destacado: `aspect-ratio: 4 / 5` en `assets/base.css:1331-1334`.
- **Opcional:** en el carrusel móvil la diapositiva 3D mide 384 px y la de vídeo 350, por el mismo `min-height`. Si lo igualas con el marco del carrusel, que sea en un commit aparte y con su propio test.

**Riesgos:**
- El `:first-child:nth-last-child(odd)` de `assets/base.css:9169-9171`: con un número impar de medios, el primero ocupa las dos columnas, y un 3D en primera posición quedaría muy alto o muy bajo. Pruébalo.
- El foco visible del visor (`:8028-8033`).
- El botón «View in your space».
- Que `--gallery-ratio` sale del **primer medio** (`sections/main-product.liquid:58`), que puede ser el propio 3D.

**Verificación exigida:**
- Test con el CSS real.
- Rejilla a 1440 y 1536 con 3D y vídeo de 1:1 en la misma fila: las dos celdas tienen la misma altura y el medio llena su celda con una tolerancia de 1 px. Debe fallar con `BASE`.
- Con un número impar de medios y el 3D primero.
- `split_screen` y `stack` sin cambios.
- 390 sin cambios, salvo que hagas la parte opcional.
- El fixture de la tienda es `fixture-media-3d-video` (3D y vídeo).

### E. Menú móvil: «Update preferences» pegado al borde derecho (defecto 7 de QA, baja)

**Estado: CONFIRMADO.** En Chromium, con el CSS real, a 360, 392 y 414 px y dos países, el botón **se sale** del panel entre 19 y 67 px. QA midió 2,6 px del borde con las fuentes reales.

**Causa:**
- `.localization-form__country-wrapper` es `inline-flex`, sin `flex-wrap` (`assets/base.css:7624-7628`).
- `.localization-form__country-select-wrapper` no tiene `min-width: 0` (`:7630-7634`). El `select` no puede encogerse por debajo de su ancho intrínseco, y su `max-width: min(100%, 16rem)` (`:7657-7661`) se resuelve contra un padre que se ajusta a su contenido. Por eso la elipsis que promete el comentario de `:7658-7659` nunca llega.
- El botón tiene `white-space: nowrap` y `margin-inline-start` (`:10761-10767`).
- El panel mide `min(90vw, 25rem)` (`:808-817`) con el padding de `.mobile-nav__localization` (`:7530-7533`).
- Marcado: `snippets/localization-selectors.liquid:77-97`, que se pinta desde `sections/header.liquid:118-120` con `context: 'header-mobile'`.

**Arreglo mínimo**, limitado a `.localization-form--header-mobile`:
- El wrapper del país recibe `flex-wrap: wrap; max-width: 100%; gap: var(--space-xs)`, y quita el `margin-inline-start` del botón en ese contexto.
- El wrapper del `select` recibe `min-width: 0; max-width: 100%`.
- Con esas reglas, en mi medición, el botón pasa a la línea siguiente y queda dentro del padding.
- Alternativa también medida: una sola línea con el `select` encogido y con elipsis, con 20 px a cada lado. Deja el país en unos 80 px a 360, así que la recomendada es la del salto de línea.
- No toques el selector de escritorio: el test de R4 M-13 (`tests/r4-header-search-cart.spec.mjs:50-80`) debe seguir pasando.

**Riesgos:**
- El chevron (`:7636-7647`) y su versión sin JavaScript (`:7680-7688`).
- El separador del selector de idioma (`:7649-7655`).
- RTL.
- Un nombre de país largo.

**Verificación exigida:**
- Test con el CSS real a 360, 392 y 414 px, con y sin selector de idioma, con un país largo, en LTR y en RTL.
- El margen derecho entre el botón y el borde del panel debe ser mayor o igual que el izquierdo menos 1 px. Debe fallar con `BASE`.

### F. Mega menú: valores por defecto en Title Case (defecto 8 de QA, baja)

**Estado: NO REPRODUCIBLE en `master`.**
- `sections/header-group.json:33` y `:37` ya dicen «New forms» y «Tailoring», con subtítulos en sentence case. Lo cambió `585359c` (R4 C4).
- Los grupos de los presets también están en sentence case:
  - `listings/imprint/sections/header-group.json:33,37`: «Daily objects» y «Desk and study»;
  - `listings/archive/sections/header-group.json:33,37`: «Permanent archive» y «Selected pieces».
- Sartorial usa el grupo raíz.
- El bloque `mega_menu_promo` de `sections/header.liquid:259-323` no tiene ningún `"default"` de texto.
- QA citó una versión anterior del archivo.
- Lo único en Title Case en pantalla es «Explore Catalog». Sale de `general.navigation.view_all` («Explore {{ title }}», `locales/en.default.json:14`) con el título del menú que pone el comerciante: no es un valor por defecto del tema.

**Qué hacer:** no cambies código. En la entrega, confirma la lectura con:

```bash
rg -n '"heading_|"subheading_' sections/header-group.json listings/*/sections/header-group.json
rg -n '"default"' sections/header.liquid
```

El test «R4 C4 each preset has a full header group…» (`tests/r4-preset-copy.spec.mjs:22`) ya fija esos textos.

**Fuera de alcance** (no lo toques; lo anota Claude): `scripts/translations/es.storefront.json:726-745` conserva los textos de origen antiguos, «New Arrivals» y «Capsule Wardrobe», del diccionario de traducción de la tienda. No forma parte de la ZIP.

## 4. Verificación obligatoria

1. **Tests que fallan con `BASE` y pasan después**, con el helper `tests/support/r3-support.mjs` y sus variables:
   ```bash
   git show "$BASE":assets/theme.js > /tmp/r5-base-theme.js
   git show "$BASE":assets/base.css > /tmp/r5-base-base.css
   R3_THEME_JS=/tmp/r5-base-theme.js R3_BASE_CSS=/tmp/r5-base-base.css npx playwright test tests/r5-<arreglo>.spec.mjs --trace off   # debe FALLAR
   npx playwright test tests/r5-<arreglo>.spec.mjs --trace off                                                                        # debe PASAR
   ```
   - Pega en la entrega la salida de las dos ejecuciones de cada arreglo.
   - Un test que lee Liquid con `readFileSync` no se puede cambiar con esas variables. Para ese, muestra el fallo con un `git worktree add /tmp/r5-base "$BASE"`, copia en él solo el spec y ejecútalo allí.
   - El patrón con `setContent` y CSS real está en `tests/r3-layout.spec.mjs` y `tests/r4-product-layout.spec.mjs`.
2. **`npm run gates:static` en verde DESPUÉS de cada commit de código**, no antes: el empaquetador y parte de los gates leen de HEAD.
3. **La batería completa, sin `tests/pdp-line-total.spec.mjs`** (necesita un storefront local en `127.0.0.1:9292`), al final y en verde:
   ```bash
   npx playwright test --trace off $(ls tests/*.spec.mjs | grep -v pdp-line-total)
   ```
4. **La ZIP y el manifiesto se regeneran UNA sola vez, al final**, con todos los arreglos commiteados y los gates en verde sobre HEAD. Procedimiento de `agent-comms/outbox-claude/CLAUDE-R3-IMPL-001.md` §12.7:
   - `node scripts/package-theme-zip.mjs --out Sartorial-1.0.0.zip --expect-count 111`. R5 no debería añadir archivos al tema; si cambia el recuento, explica por qué.
   - `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`: la cabecera de diez líneas, con «Validado en tienda: NO», y una línea `sha256  ruta` por archivo, en el orden de la ZIP.
   - Comprueba «internal references: none», `unzip -t` y `node --check` de los JS extraídos.
   - El manifiesto va en su propio commit, el último.
5. **Las cinco compuertas de `AGENTS.md`**:
   - Compuerta 1: filas del ledger con evidencia `archivo:línea` o nombre de test.
   - Compuerta 2: los cinco estados degenerados.
   - Compuerta 3: sin valores duplicados; reutiliza `--header-offset`, las claves de locales y las funciones del cajón.
   - Compuerta 4: si tocas algún label del editor, en sentence case y con `t:`.
   - Compuerta 5: queda para la revisión de Claude en la tienda.

## 5. Lecciones de rondas anteriores

- **Theme Check no detecta todo lo que Shopify rechaza al subir.** En R3 fueron los `"default": ""` de tres schemas, que ahora detecta `gates:json`. Puede haber más casos: no añadas `"default"` vacíos ni settings nuevos sin necesidad.
- **El empaquetador lee de HEAD** (los blobs de git), no del árbol de trabajo. Lo que no está commiteado no entra en la ZIP, y los gates de antes del commit no prueban nada.
- **La subida de presets sigue D77:** la ZIP descomprimida, con solo cuatro archivos sustituidos por los del preset, y después el overlay (D70). No uses `agent-comms/outbox-claude/harness-C-01-ID-001/build-export.mjs`. Procedimiento en `docs/demo-store/README.md`, «How to upload a preset».
- **No se suben temas a la tienda en R5.** Lo hace Claude al revisar.
- **La barra de vista previa de Shopify** (`#PBarNextFrame`, unos 64 px abajo, solo con `preview_theme_id`) tapa los elementos fijos de la parte inferior en las previsualizaciones. Si compruebas la barra de compra en un navegador real, oculta esa barra con «Hide bar» o descuéntala (D81).
- **Comprueba lo que te dicen las auditorías antes de arreglarlo.** El defecto 8 de QA citaba una versión anterior del archivo (§3 F).

## 6. Formato de la entrega

Archivo `agent-comms/outbox-gpt/GPT-R5-001-ENTREGA.md`. Empieza con la cabecera de `agent-comms/RULES.md` §1.4 y después:

1. Rama, commits (hash y mensaje) y enlace al PR en borrador, o el aviso de que GitHub no te dejó abrirlo.
2. **Archivos y líneas tocadas** por arreglo, con `archivo:línea` del resultado final.
3. **Tests**: cada uno con su salida **antes** (con `BASE`, falla) y **después** (pasa). La salida de `npm run gates:static` tras cada commit de código y la de la batería completa.
4. **ZIP y manifiesto**: sha256, número de archivos, huella de contenido y las comprobaciones de §4.4.
5. **Filas de `docs/requirements-ledger.md` que cierras o modificas**, con estado propuesto y evidencia. Como mínimo:
   - «Página de carrito y cajón sincronizados sin perder ediciones (AS-02 / FB-30)» (`:152`);
   - «Live Regions (`aria-live`)» (`:59`);
   - «Medios Enriquecidos y Modelos 3D» (`:85`);
   - «Selector de País / Moneda» (`:92`).

   Propón filas nuevas si hacen falta, por ejemplo para la barra fija de compra o la búsqueda de la 404. Las que exigen tienda real se quedan como `código completo`: Claude las verifica.
6. **Copy nuevo para aprobación** (D35), con su ubicación, o «ninguno». No lo des por aprobado.
7. Defectos de QA cerrados (1, 3, 5, 6 y 7), el 8 confirmado sin cambio, y lo que queda residual.
8. Lo que no pudiste hacer y por qué.
9. Desviaciones de este encargo, como Nivel 1 o Nivel 2 según `agent-comms/RULES.md`.

Claude revisará el PR antes de fusionarlo. Revisará el diff, las cinco compuertas, los tests en los dos sentidos, la ZIP y el manifiesto reproducidos y las filas del ledger. Después subirá los tres presets como temas sin publicar a la tienda de QA para la compuerta 5.
