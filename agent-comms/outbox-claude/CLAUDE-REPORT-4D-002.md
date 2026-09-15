# CLAUDE-REPORT-4D-002 — Stepper de cantidad en el carrito

**Sprint:** 4D-002 (micro-sprint) · **Directiva:** `agent-comms/inbox-claude/CLAUDE-DIRECTIVE-4D-002-stepper-botones-carrito.md`
**Implementador:** Claude · **Fecha:** 2026-09-15
**Estado:** entregado en árbol local, **sin `git commit` ni `git push`**.
**Base:** el árbol tal como quedó tras 4D-001 (aprobado en `GEMINI-review-CLAUDE-4D-001.md`).

---

## 0. Resumen

| Compuerta | Exigido | Resultado |
| :--- | :--- | :--- |
| `shopify theme check` | 0 errores, 0 advertencias | **0 ofensas** (`--output json` → `[]`) |
| `npm run gates:static` | 8/8 verde | **verde**, exit 0 |
| Harness Playwright | verde | **41/41** (34 de 4D-001 + 7 nuevas), 2 ejecuciones seguidas |
| Área táctil de los botones | ≥ 44 × 44 px | **44 × 44 px exactos**, medido en el navegador a 390 px |
| Strings en inglés quemados en Liquid | cero | **cero** (5 coincidencias, todas entidades HTML) |
| Claves de locale sin usar | — | **0 de 322** |
| Ficheros tocados | — | 6 |

Un fallo real encontrado y corregido durante las pruebas (§4), y una decisión de arquitectura que conviene que Gemini valide explícitamente (§2.1).

---

## 1. Ficheros y líneas

| Fichero | Qué | Líneas |
| :--- | :--- | :--- |
| `locales/en.default.json` | `sections.cart.decrease_quantity` y `increase_quantity` | 59–60 |
| `snippets/icon.liquid` | iconos `minus` y `plus` (mismo lenguaje: 24×24, stroke 1.5) + doc del snippet | 6, 50–57 |
| `sections/cart-drawer.liquid` | stepper de la línea del cajón | 207–258 |
| `sections/main-cart-items.liquid` | stepper de la página de carrito | 111–157 |
| `assets/base.css` | componente `.quantity-stepper` y ajustes de las dos superficies | 1904–1991, 1993–2000, 2204–2208 |
| `assets/theme.js` | motor del stepper + guarda de foco en `renderSection` | 3330–3423, 3427, 1709–1717 |

---

## 2. Implementación

### 2.1 JavaScript: el botón no llama a `changeLine`, emite `change` sobre el campo

La directiva pide invocar `changeLine(line, newQuantity)`. Lo hace, pero **a través de `handleDrawerChange`**, no llamándolo desde el botón. El botón escribe el valor y emite un `change` sobre el campo, que es exactamente lo que ocurre cuando alguien teclea un número.

Motivo, y es el punto que pido revisar:

- Una sola implementación sirve a las dos superficies. En el cajón el `change` lo recoge `handleDrawerChange` (`theme.js:1394`), que ya valida, llama a `changeLine` con la revisión por mutación de 4D-001 y muestra el error localizado silenciando `AbortError`. En la página de carrito, que es un **formulario sin JavaScript** (`main-cart-items.liquid:23`, botón `name="update"`), nadie escucha ese `change` y el campo simplemente queda editado a la espera de "Update cart" — el mismo contrato que tecleando.
- Llamar a `changeLine` desde el botón obligaría a duplicar el manejo de errores y a ramificar por superficie, y dejaría dos caminos que mantener en paralelo. El camino endurecido en 4B-006, 4B-007 y 4D-001 es `handleDrawerChange`; hacerlo pasar por ahí es lo que garantiza que el stepper herede esa dureza en lugar de estrenar la suya.

Delegación en `document` y no por botón (`theme.js:3387`): el cajón reemplaza su contenido entero en cada mutación, así que no existe un nodo al que atar un listener que sobreviva al re-render.

**Los botones no se deshabilitan mientras hay una petición en vuelo.** Es deliberado: `setDrawerBusy` sí deshabilita el campo, y si también apagara los botones, seis clics rápidos contarían uno solo — el defecto clásico del stepper barato. Como la concurrencia es libre de carreras desde 4D-001 (gana el último clic, las respuestas superadas se descartan), dejar pasar los clics es seguro. La prueba 12 lo fija: 6 clics antes de que vuelva ninguna respuesta producen `[3,4,5,6,7,8]` y el DOM termina en 8.

**Rejilla de cantidades** (`nextQuantity`, `theme.js:3361`): Shopify no acepta cualquier entero, los valores válidos son `min + n × incremento`. Un campo con min 2 e incremento 2 no puede pasar por 5. El botón se mueve por esa rejilla con `floor` al subir y `ceil` al bajar, de modo que un valor tecleado fuera de rejilla cae al escalón correcto (5 → 6 al subir, 5 → 4 al bajar). La prueba 9 lo recorre entero.

**Estado `disabled`** (`syncQuantityStepper`, `theme.js:3373`): un botón se apaga exactamente cuando pulsarlo no cambiaría nada — se compara contra el salto real, no contra `min` o `max` sueltos. Así el estado sigue siendo coherente con un valor fuera de rejilla, donde comparar contra `max` daría un botón apagado teniendo un escalón válido por delante.

### 2.2 Liquid: el servidor decide el estado inicial, el JS solo lo mantiene

Los dos botones llevan su `disabled` calculado en Liquid (`cart-drawer.liquid:227` y `:254`, `main-cart-items.liquid:131` y `:154`), no solo en JavaScript. Así la línea llega correcta desde el primer pintado y **tras cada re-render del cajón**, sin depender de que el cliente vuelva a sincronizar. El JS solo cubre lo que el servidor todavía no ve: el número que alguien está escribiendo a mano.

Contrato de atributos: `data-quantity-stepper` en el envoltorio, `data-quantity-button="decrease|increase"` en los botones, `data-quantity-input` en el campo. Este último ya existía en el tema (`main-product.liquid:311`, `featured-product.liquid:166`, lo lee `VariantSelects`); se reutiliza el mismo nombre porque significa lo mismo, y no colisiona porque cada búsqueda está acotada a su contenedor.

`aria-label` localizado con el título de la línea (`… | t: title: item.title | escape`), igual que el botón de eliminar, y `aria-controls` apuntando al campo.

### 2.3 CSS: una pieza, no tres cajas

`.quantity-stepper` (`base.css:1904`) es un `inline-grid` de `44px minmax(2.25rem, 1fr) 44px` con un hilo exterior de 1 px en `--color-control-border` y dos hilos internos en `--color-border` (el suave). Sin radio ni relleno de color, en la línea editorial del tema. Números con `font-variant-numeric: tabular-nums` para que el ancho no baile al pasar de 9 a 10.

Tres detalles que merecen comentario porque no son obvios:

- **El selector del campo va doblado**: `.quantity-stepper .quantity-stepper__input` (`base.css:1943`). La regla global de campos es `input:not([type='checkbox'], [type='radio'])`, y `:not()` suma la especificidad de su argumento: **(0,1,1) contra los (0,1,0) de una clase suelta**. Con la clase sola, el campo se quedaba con el borde y el relleno de un input normal y el stepper se leía como tres cajas apiladas. Medido en el navegador antes y después: `border-top` 1px → 0px, caja del conjunto 156×54 → 140×46.
- **El anillo de foco se dibuja hacia dentro** (`outline-offset: -3px`, `base.css:1933`): con el offset global de +3px el anillo quedaría por fuera y pisaría el borde del stepper.
- **El campo no se apaga mientras espera** (`base.css:1971`): `setDrawerBusy` lo deshabilita durante la petición, pero eso es una espera, no un control muerto, así que mantiene opacidad 1 y `cursor: progress`. Es el mismo criterio que el tema ya aplica a `.button[aria-busy='true']:disabled` (`base.css:953`).

Flechas nativas retiradas con `appearance: textfield` y los dos pseudo-elementos `-webkit-*-spin-button` (`base.css:1961`): duplicarían el control y son objetivos táctiles de unos 10 px que arruinarían la retícula de 44.

**Sin JavaScript** (`base.css:1979–1991`) los botones se retiran en lugar de quedarse como controles muertos, y la rejilla vuelve a `minmax(5rem, 7rem)`, que es el ancho que tenía el campo antes de este sprint. En la página de carrito el formulario sigue funcionando con "Update cart"; en el cajón la cuestión no se plantea, porque sin JS no hay cajón.

### 2.4 Área táctil

`min-width` y `min-height` de `var(--tap-target-min)` en cada botón. Medido en el navegador a 390 px: **44 × 44 px exactos**, sin solapamiento (la prueba 8 lo afirma y fallaría si alguien redujera el token o el padding).

---

## 3. Pruebas nuevas (`stress.spec.mjs`, viewport 390 px)

| # | Prueba | Cubre |
| :---: | :--- | :--- |
| 8 | Área táctil 44 × 44 de los dos botones y `appearance: textfield` en el campo | WCAG 2.5.8 y spinners |
| 9 | Rejilla min 2 / incremento 2 / máximo 10 desde un valor fuera de rejilla (5): `+` → 6, `−` → 4, tope y mínimo apagan su botón, y el clic sobre un botón apagado no mueve nada | `nextQuantity`, `syncQuantityStepper` |
| 10 | El stepper de la página de carrito edita el campo **sin una sola petición de red** | contrato del formulario sin JS |
| 11 | Un clic en `+` en el cajón: un solo POST con la cantidad nueva, DOM y servidor en 3, `pendingMutations` 0, sin error | camino feliz |
| 12 | **6 clics rápidos** en `+` antes de que vuelva ninguna respuesta: POSTs `[3,4,5,6,7,8]`, servidor 8, DOM 8, **0 GET de resincronización**, sin error | el caso que rompe a los steppers que se deshabilitan al esperar |
| 13 | Sin JavaScript los botones se retiran y el campo conserva un ancho usable | cero controles muertos |
| 14 | Al tocar el mínimo con el teclado: el servidor devuelve el `−` apagado, **el foco pasa al `+`** y no cae al body ni al botón de cerrar; un clic más no genera tráfico | accesibilidad de teclado |

El mock del servidor se endureció para emitir también el `disabled` en cada render, igual que hace el Liquid (`stress.spec.mjs:17–24`). Sin eso, la prueba 14 nunca habría visto el límite real.

---

## 4. Fallo encontrado y corregido durante las pruebas

**El foco se perdía al llegar al límite.** El manejador comprobaba `document.activeElement === button` **después** de apagar el botón, y al deshabilitar un elemento enfocado el navegador lo desenfoca en el acto: la comprobación siempre resultaba falsa y el foco caía al `body`. Un usuario de teclado bajando la cantidad hasta 1 se quedaba sin punto de partida para el siguiente `Tab`.

Corregido anotando el estado **antes** de sincronizar (`theme.js:3403`). Lo encontró la prueba 14, no la lectura del código; la primera ejecución dio 12 de 13 con `Expected "DrawerQuantityPlus-1", Received ""`.

**Guarda añadida en `renderSection`** (`theme.js:1709–1717`), que es el mismo problema por el otro lado: el control puede volver **deshabilitado desde el servidor** — el `+` se apaga cuando la línea toca el tope de inventario, que el cliente no conoce porque no está en `quantity_rule`. Un `focus()` sobre un control deshabilitado no hace nada y el foco caería al body, así que ahora se busca primero el hermano utilizable del mismo stepper antes de recurrir al botón de cerrar.

---

## 5. Verificación

```
shopify theme check --output json   → []           (0 errores, 0 advertencias)
npm run gates:static                → 8/8 verde, exit 0
npx playwright test                 → 41 passed    (verify 10, r007 7, motion 10, stress 14)
grep -rn "shopify://"               → 0 resultados
claves de locale sin referencia     → 0 de 322
```

Capturas de los cuatro estados (reposo, hover, foco, mínimo) y del fallback sin JS, renderizadas con el `base.css` real: `harness-4D-002/`.

---

## 6. Recomendación fuera de alcance

El componente está listo para una tercera superficie: **el campo de cantidad de la PDP** (`main-product.liquid:311` y `featured-product.liquid:166`) ya lleva `data-quantity-input` y hoy sigue siendo un input pelado. Envolverlo en el mismo stepper son seis líneas de Liquid por sección y cero JavaScript nuevo, y cerraría la incoherencia de que el carrito tenga stepper y la ficha de producto no. No lo he hecho porque la directiva 4D-002 acota el alcance al carrito y esto precede al commit definitivo. Queda como decisión de Johandry.

Sigue abierto de 4D-001, sin cambios: publicar los 24 productos y 6 colecciones al canal Online Store, el paso 6 de Gemini, `/pages/documentation` y `/pages/support`, y la re-medición de Gate 5 con `animations: none` frente a `subtle`.
