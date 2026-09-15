# CLAUDE-REPORT-4D-003 — Stepper de cantidad en la ficha de producto

**Sprint:** 4D-003 (cierre de fase 4D) · **Origen:** recomendación fuera de alcance de `CLAUDE-REPORT-4D-002` §6, aceptada por Gemini y Johandry.
**Implementador:** Claude · **Fecha:** 2026-09-15
**Estado:** entregado en árbol local, **sin `git commit` ni `git push`**. Listo para el commit unificado de toda la fase 4D.

---

## 0. Resumen

Los dos campos de cantidad de la ficha de producto usan ya el mismo componente `.quantity-stepper` del carrito. Cero JavaScript nuevo en el motor del stepper: la extensión necesitó **una** pieza de fontanería y ahí apareció **un bug real, anterior a este sprint y de cara al comprador** (§3).

| Compuerta | Exigido | Resultado |
| :--- | :--- | :--- |
| `shopify theme check` | 0 errores, 0 advertencias | **0 ofensas** (`--output json` → `[]`) |
| `npm run gates:static` | 8/8 verde | **verde**, exit 0 |
| Harness Playwright | verde | **45/45** (41 de 4D-002 + 4 nuevas), 2 ejecuciones seguidas |
| Área táctil | ≥ 44 × 44 px | **44 × 44 px**, medido a 420 px |
| `shopify://` en el repo | cero | **cero** |
| Strings en inglés quemados en Liquid | cero | **cero** (7 coincidencias: entidades HTML y bloques `{% style %}`) |
| Claves de locale sin usar | — | **0 de 324** |

---

## 1. Ficheros y líneas

| Fichero | Qué | Líneas |
| :--- | :--- | :--- |
| `locales/en.default.json` | `products.product.decrease_quantity` / `increase_quantity`, con `{{ product }}` como `sticky_add_to_cart` | 317–318 |
| `sections/main-product.liquid` | stepper del bloque `quantity` | 298–347 |
| `sections/featured-product.liquid` | stepper del bloque `quantity_selector` | 153–197 |
| `assets/theme.js` | `updateQuantityRules` avisa cuando cambia la rejilla; la delegación sincroniza también en `change` | 713–748, 3438–3448 |
| `assets/base.css` | `.product-form__quantity` sin tope de ancho y etiqueta en su línea | 1327–1339 |

Diff contra la entrega de 4D-002: 32 líneas en `theme.js`, 11 en `base.css`, 2 en el locale, más el markup de las dos secciones. El componente CSS no se tocó.

---

## 2. Implementación

### 2.1 La pieza que faltaba: la rejilla cambia al cambiar de variante

En el carrito las reglas de cantidad de una línea son fijas. En la ficha **no**: cada variante trae su `quantity_rule`, y `updateQuantityRules` (`theme.js:713`) reescribe `min`, `step` y `max` del campo y de paso ajusta la cantidad para que siga siendo válida. Lo hacía en silencio, sin emitir nada.

Ahora compara el estado del campo antes y después y, **solo si algo cambió**, emite un `change` sobre el campo (`theme.js:747`). Ese `change` es el mismo camino que usa el visitante al teclear, así que llega a los dos interesados sin cableado nuevo: el `recalculate` que `VariantSelects` ya tenía atado al campo, y la delegación del stepper, que ahora escucha `input` y `change` (`theme.js:3438–3448`).

No hay recursión: el manejador de `change` de `VariantSelects` filtra por `[data-option-position]`, `[data-purchase-option]` y `[data-selling-plan-select]`, y el campo de cantidad no es ninguno de los tres.

### 2.2 Liquid

Mismo contrato que el carrito: `data-quantity-stepper`, `data-quantity-button="decrease|increase"`, `data-quantity-input` (que ya estaba, lo lee `VariantSelects`). El valor inicial del campo es el mínimo de la variante seleccionada, así que **el botón de restar nace apagado** sin necesidad de condición; el de sumar se apaga si ese mínimo ya es el máximo. `aria-label` localizado con el título del producto.

### 2.3 CSS

Ningún cambio en `.quantity-stepper`: el componente entró tal cual. Dos ajustes en su nuevo hueco:

- `.product-form__quantity` pierde el `max-width: 8rem` (`base.css:1327`). Existía para que un campo suelto no se estirase a todo el ancho; el stepper es `inline-grid` y ya se mide solo. De regalo, el total de línea deja de partirse en una columna de 128 px.
- `.product-form__quantity label` pasa a `display: block` (`base.css:1337`). La etiqueta global es `inline-block` porque acompañaba a un campo de ancho completo; junto a un stepper `inline-grid` se le ponía al lado, con el margen inferior sin efecto. Detectado en la captura, no en el código.

---

## 3. Bug real encontrado: el total de línea se quedaba mudo al cambiar de variante

**Qué pasaba.** `updateVariant()` llama a `updatePrice(variant)` en la línea 462 y a `updateQuantityRules(variant)` en la 463. `updatePrice` termina calculando el total de línea (`theme.js:665`), y `updateQuantityRules` **mueve la cantidad después**. El total se calculaba con la cantidad vieja y nadie lo volvía a calcular.

**Medido en el fixture, con el código anterior a este sprint:**

```
variante Camel (min 1)      valor 1    total: (oculto)
-> variante Ink (min 4)     valor 4    total: (oculto)        <-- el fallo
-> boton +                  valor 6    total: Total for 6 $11,340.00
-> variante Bone (max 6)    valor 6    plus disabled: false   <-- el segundo fallo
```

Al elegir Ink la cantidad subía sola de 1 a 4 —correcto, es el mínimo de esa variante— pero el comprador **no veía los $7.560 que iba a pagar**. No es cosmético: es una cifra de precio que desaparece justo cuando cambia. Solo reaparecía si tocaba la cantidad a mano.

El segundo fallo es del stepper y lo habría estrenado este sprint si no se arregla lo anterior: con la cantidad ya en el máximo de la variante nueva, el botón de sumar seguía activo.

**Con el código entregado, el mismo recorrido:**

```
variante Camel (min 1)      valor 1    total: (oculto, cantidad 1)
-> variante Ink (min 4)     valor 4    total: Total for 4 $7,560.00
-> boton +                  valor 6    total: Total for 6 $11,340.00   (incremento 2, no 1)
-> variante Bone (max 6)    valor 6    plus disabled: true
```

Fijado por la prueba 2 de `pdp.spec.mjs`, que falla contra el código anterior.

---

## 4. Pruebas nuevas: `pdp.spec.mjs` + `pdp.html`

Fixture con un `variant-selects` real: JSON de tres variantes con reglas de cantidad distintas (Camel 1/1/∞, Ink 4/2/10, Bone 1/1/6), radios de opción, campo, stepper y total de línea.

| # | Prueba | Cubre |
| :---: | :--- | :--- |
| 1 | El estado inicial lo decide el Liquid: con el valor en el mínimo, el menos nace apagado y el total no se muestra con cantidad 1 | render servidor |
| 2 | Al cambiar de variante el stepper adopta `min`/`step`/`max` nuevos, la cantidad se ajusta **y el total de línea la sigue**; el `+` respeta el incremento 2 | §3, `updateQuantityRules` |
| 3 | Una variante con máximo más bajo apaga el `+` en vez de dejar pulsar de más, y pulsarlo no mueve nada | límites por variante |
| 4 | Los botones conservan 44 × 44 px, el stepper no desborda su bloque y la página no scrollea en horizontal | WCAG 2.5.8 y layout |

---

## 5. Verificación

```
shopify theme check --output json   → []      (0 errores, 0 advertencias)
npm run gates:static                → 8/8 verde, exit 0
npx playwright test                 → 45 passed  (verify 10, r007 7, motion 10, stress 14, pdp 4)
grep -rn "shopify://"               → 0 resultados
claves de locale sin referencia     → 0 de 324
```

Captura del stepper de la ficha con el total de línea en `harness-4D-003/stepper-pdp.png`.

---

## 6. Estado de la fase 4D

Con esto, las **tres** superficies de cantidad del tema (cajón, página de carrito y ficha de producto) comparten un solo componente, un solo motor y un solo contrato de atributos. Por mi parte la fase 4D está cerrada y el árbol listo para el commit unificado.

Sigue abierto, y no es mío: publicar los 24 productos y 6 colecciones al canal Online Store, el paso 6 de Gemini, `/pages/documentation` y `/pages/support` (único bloqueante de rechazo automático), la re-medición de Gate 5 con `animations: none` frente a `subtle`, y la decisión sobre el overlay de quick-add (B4).
