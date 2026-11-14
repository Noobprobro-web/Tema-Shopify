# REVIEW-D02Q-001

Commit revisado: ac57c28fcb39a44832a67a8acb7267287b4ac5eb (rama task/d02q), padre e8f17e5 = lote-e-claude. Solo cambia assets/theme.js (+47/-17). Revision en solo lectura; nada modificado en el repo ni en el worktree.

## Veredicto

**ACEPTADO CON CONDICIONES**

El defecto D-02-Q queda corregido en las tres rutas pedidas y el caso sin reglas no cambia. Hay una condicion antes de cerrar: en el cajon del carrito el ajuste nuevo deja en pantalla un valor que nunca se envia (C1). Hay ademas una observacion menor (O1).

## 1. Las tres rutas y el caso sin reglas

Todo lo que sigue sale de mi harness (seccion 4); los resultados con los que comparo son los de la base lote-e-claude.

- Botones: nextQuantity limita ahora a maxOnGrid (assets/theme.js:6158-6165, con readQuantityRules en :6139-6152). Con 2/2/max 5, al pulsar + tres veces la base llega a 5 (invalido) y el fix se queda en 4 con el + apagado. Con 3/3/max 10 la base llega a 10 y el fix a 9.
- Input manual: el handler change (:6228-6241) ajusta con snapQuantity (:162-166). Con 2/2/10, si se teclea 5 el campo queda en 4, 3 queda en 2, 7 queda en 6, 7.01 queda en 8 y 11 queda en 10. La base dejaba 5, 3 y 7 como invalidos.
- updateQuantityRules (:1186-1234): el max del campo pasa a ser el techo de la rejilla (:1217-1223) y el valor se ajusta a la rejilla (:1225-1226). Con 2/2, inventario 5 y umbral 10, la base deja v=5 y max=5 (invalido); el fix deja v=4 y max=4. Una variante 2/2/10 con el valor previo en 5 se queda en 5 en la base y baja a 4 en el fix.
- Sin reglas (1/1/sin max): con + se suma de 1 en 1, el 7 tecleado se respeta y con 0, -3 o el campo vacio el valor sube a 1. Base y fix dan lo mismo. Los unicos cambios en este caso: los decimales se redondean (2.4 da 2, 2.5 da 2 por empate hacia abajo, 2.6 da 3) y 1e2 se normaliza a 100. Antes el decimal se quedaba como invalido. Es coherente con Shopify, que exige enteros.

## 2. Casos limite

| Caso | Resultado (fix) | Evidencia |
|---|---|---|
| max < min en el markup (4/2/3) | valor 4 y los dos botones apagados; el campo sigue invalido porque el atributo max=3 se queda | :6150 (maxOnGrid >= min), :162 |
| max < min por inventario en la ficha (min 4, stock 3) | max=min=4, valid=true, botones apagados | :1219-1221; ver O1 |
| increment 0, negativo o no numerico | se trata como 1 en la variante (Math.abs, con 1 si falla) y en el atributo; con step=-2 se recorre 2,4,6,8 | :1197, :6140 |
| max null, Infinity o "Infinity" | sin techo; con Infinity en la variante se quita el atributo max (antes quedaba max="Infinity") | :155-157, :1222 |
| Decimales | se ajustan al escalon mas cercano y el empate baja | :164 |
| Campo vacio | sube a min si min > 0; sin atributo min se queda vacio, como antes | :6235-6236 |
| Variante null | min=max=1 y los botones apagados; igual que la base | :1214 |
| Cajon y pagina de carrito | usan el mismo codigo (data-quantity-input), ver C1 | sections/cart-drawer.liquid:257-295, sections/main-cart-items.liquid:135-170 |

Un detalle sin impacto: snapQuantity y nextQuantity trabajan con coma flotante. Con un step decimal habria errores de redondeo, pero en Shopify el step siempre es entero.

### C1 (condicion): en el cajon se ve una cantidad que no se envia

CartDrawer escucha change sobre el propio elemento (assets/theme.js:2587). En fase de burbuja ese listener corre antes que el de document (:6228), asi que handleDrawerChange (:2733-2765) ve el valor tecleado sin ajustar, falla checkValidity (:2749), llama a reportValidity y no envia nada. Despues el handler de document cambia el valor por el escalon valido sin emitir otro change.

Prueba con el handler real de CartDrawer, linea en 6 con 2/2/10:

- Tecleado 5: la base deja el campo en 5 (invalido) y no envia nada. El fix muestra 4 (valido) y tampoco envia nada.
- Tecleado 3: la base deja 3 (invalido) y el fix muestra 2, con el - apagado. En los dos casos se envia `[]`.

En el fix el campo muestra un valor valido que no coincide con el carrito, y el total de linea no cambia. Con la base al menos se veia un campo invalido. El mismo patron ya existia en la base para valores por encima de max (12 se recorta a 10 sin enviarse); este commit lo extiende a los valores fuera de rejilla, que son el caso que corrige.

Arreglo sugerido, elegir uno:
1. Hacer el ajuste en fase de captura o antes de handleDrawerChange, para que el cajon envie el valor ya ajustado.
2. No ajustar los `[data-cart-quantity]` y dejar que reportValidity mantenga el campo invalido.

En la pagina de carrito (formulario sin JS) el ajuste antes de "Update cart" es correcto.

### O1 (menor, no bloquea)

Variante disponible con stock por debajo de min (min 4, inventario 3, dentro del umbral): la base dejaba el campo invalido (max=3), asi que el navegador bloqueaba el submit. Con el fix el campo queda valido en 4 y el submit llega a /cart/add. Shopify respondera 422 o anadira lo que haya disponible. Los botones estan apagados, pero el boton de anadir no lo esta (:1217-1221). Es un caso raro y anterior a este commit; queda como seguimiento.

## 3. Coherencia con Shopify

- Objeto QuantityRule en Admin GraphQL, https://shopify.dev/docs/api/admin-graphql/latest/objects/QuantityRule: "Only quantities divisible by this value will be considered valid", "The minimum must be a multiple of the quantity rule's increment" y "both minimum and maximum must be divisible by this value".
- Liquid, https://shopify.dev/docs/api/liquid/objects/quantity_rule: "The default quantity rule is min=1,max=null,increment=1".
- Ajax Cart API, https://shopify.dev/docs/api/ajax/reference/cart: si /cart/add.js pide mas de lo disponible, "the cart will instead add the maximum available quantity" o devuelve 422 "You can't add more...". /cart/change.js solo exige un entero. La pagina no detalla como se aplican las reglas de cantidad en esos endpoints.

Como min es multiplo del incremento, la rejilla min + k·increment equivale a "divisible por increment", asi que la regla del fix coincide con la de Shopify. Un max de regla siempre es multiplo del incremento, de modo que quantityGridMax no lo cambia. El techo solo baja cuando el limite viene del inventario (:1203-1209) o del LEAD-001 del carrito, y ese era justo el origen del defecto. Que el empate redondee hacia abajo es razonable porque nunca pide mas de lo tecleado. Los ejemplos del autor del tipo 1/3/10 no pueden configurarse en Shopify, aunque no hacen dano.

## 4. Harness propio

- Script: /tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d02q/review-harness.js (Playwright Chromium, una pagina nueva por caso).
- Salidas: /tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d02q/base.out y /tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d02q/fix.out, con 57 casos (R1-R7) cada una y 0 pageerror.
- Que cubre: los botones (R1, R2), el caso sin reglas y los decimales (R3), la entrada manual (R4), los atributos raros (R5), updateQuantityRules con inventario, agotado, null e Infinity (R6) y el cajon con el handler real de CartDrawer (R7).
- El harness del autor (/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/harness-d02q/harness.js) lo lei y no lo reutilice. No prueba el cajon, por eso no detecta C1.

## 5. Accesibilidad, gates y seguridad

- Atributos: en la ficha, min, step y max describen ahora la misma rejilla y el campo queda valido para la validacion nativa. En el cajon y el carrito el Liquid emite el max crudo, que en la practica ya esta en la rejilla (una regla de Shopify o item.quantity).
- Foco y anuncios: los botones apagados y el paso del foco no cambian (:6205-6216). La linea de total con aria-live (sections/main-product.liquid:470-476) se actualiza con el change que emite updateQuantityRules. No hay anuncio propio cuando el valor se ajusta solo; antes tampoco lo habia.
- node --check assets/theme.js: OK.
- Theme Check 4.8.0 tras npm ci, en una copia limpia del commit (git archive): `[]`.
- Sin credenciales en el diff: grep de token, secret, password, api_key, shpat y Bearer sin resultados.
