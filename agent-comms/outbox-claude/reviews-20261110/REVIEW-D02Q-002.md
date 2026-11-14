# REVIEW-D02Q-002

Commit revisado: 645fdc061a3d6c19072a64db37aec038f125a1de (rama task/d02q, padre ac57c28). Solo cambia assets/theme.js (+33/-13). Revision en solo lectura: el worktree sigue limpio, sin commit ni push.

## Veredicto

**ACEPTADO CON CONDICIONES**

C1 queda resuelto: en el cajon la cantidad que se ve es la que se envia, no hay doble envio y el 0 quita la linea. O1 funciona y se limpia bien, salvo un caso en que bloquea el formulario sin motivo real (C2). Es un arreglo de una linea. "Comprar ahora" puede quedar como pendiente documentado: no es bloqueante.

## 1. C1 en el cajon

Codigo: snapQuantityField (assets/theme.js:6171) lo llaman handleDrawerChange (:2756) y el change de document (:6261). El listener del cajon (:2594) corre primero, ajusta y decide. Cuando llega el de document, el valor ya esta en la rejilla y el helper es idempotente, asi que no cambia nada.

Comprobado con el CartDrawer real, changeLine real y /cart/change.js interceptado con route:

- Visto = enviado. Hay 14 casos de tecleo real (fill + Tab, con un unico change nativo), con 2/2/10 y la linea en 6: 5 envia 4, 3 envia 2, 11 envia 10, -4 envia 2, 1e1 envia 10, 00 envia 2, 0.4 envia 2, 9 envia 8. Con 7 queda en 6 y no envia nada. Con 3/3 sin max, 10 envia 9. Con 1/1, 12 envia 12. Con max 4 o 5, 6 y 5 quedan en 4 sin envio. Un listener en window (corre despues de document) confirma que el valor final coincide con el enviado en todos.
- Sin doble envio. Enter (keydown, blur, change) hace un solo POST. Dos change sincronos seguidos tambien hacen un solo POST, igual que un segundo change con la mutacion en vuelo (respuesta de 400 ms): el campo esta deshabilitado por setDrawerBusy y handleDrawerChange sale por TEC-01.
- defaultValue. Con un re-render real (el servidor devuelve la seccion), 6 pasa a 4 y defaultValue a 4. Despues, 6 se envia. Con un 422 hay un POST, sin reintento, y el campo se rehabilita. Como no hay re-render, defaultValue sigue siendo la cantidad del servidor, asi que la comparacion es correcta.
- 0. Se respeta, POST 0, y la linea desaparece tras el re-render. En la pagina de carrito (sin cajon) 5 queda en 4 sin POST y 0 se mantiene para "Update cart".
- Botones: + desde 5 (fuera de rejilla) envia 6.

Nota sin impacto: la comparacion con defaultValue supone que cada mutacion aplicada re-renderiza. Con el harness anterior (changeLine falso, sin re-render) un - de vuelta a la cantidad original no se envia. En el flujo real endMutation/syncCart re-renderizan cuando la respuesta se descarta, y no encontre ninguna ruta real que deje defaultValue viejo.

## 2. O1

Codigo: :1228-1230. setCustomValidity se ejecuta en cada updateQuantityRules, con '' cuando no hay bloqueo, asi que se limpia en cada cambio de variante. Se llama al iniciar (:661) y en applyVariant (:879). El stock no cambia en vivo, solo con la variante o al recargar.

Comprobado con VariantSelects real (connectedCallback, radios de opcion y JSON de variantes):

- Bloqueo correcto (variante disponible, min 4, stock 3, dentro del umbral): el campo es invalido desde la carga, con el mensaje "Unavailable". El clic en Add y requestSubmit (la ruta de la barra fija, :1471) no llegan a /cart/add. Teclear 8 lo deja en 4 y sigue invalido.
- Limpieza correcta: Low a Ok (2/2, stock 5) queda valido con max 4. Ida y vuelta Low, Ok, Low, Plain funciona bien. Agotada da campo valido y Add deshabilitado. La variante null tambien limpia. Con continue, sin seguimiento, max de regla presente o stock por encima del umbral no hay bloqueo.

### C2 (condicion): bloqueo sin motivo cuando la seccion no tiene el bloque inventory_status

Sin bloque de inventario, el Liquid limita inventory_quantity a 1 en el JSON (main-product.liquid:735, featured-product.liquid:484: threshold 0 + 1). El JS, sin product-inventory, usa threshold 1 (:1205). Entonces 1 <= 1 y effectiveMax = 1 aunque el stock real sea 50. Con quantity_min > 1, O1 marca el campo invalido y bloquea el alta de un producto que si tiene stock. Lo comprobe con /tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d02q-2/noblock.js: en v1 da 4/4 valido y en v2 da 4/4 invalido.

La causa es anterior. La base ya bloqueaba (max 1 < min), v1 lo destapo y v2 lo vuelve a cerrar. Ademas, con min 1 el campo queda limitado a max 1 en cualquier producto con seguimiento y deny, que es un defecto previo aparte. El product.json por defecto si trae el bloque. El preset de Featured product no lo trae, pero tampoco trae quantity_selector, asi que solo pasa si el comerciante anade la cantidad sin el estado de inventario.

Arreglo sugerido: en :1205, sin product-inventory, usar threshold 0 en vez de 1. Arregla C2 y el tope de 1.

### "Comprar ahora"

El contenedor del pago dinamico sigue visible en el caso bloqueado (P11), porque updateForms solo lo oculta por isPurchaseOptionValid. El boton de Shopify es un script externo y no pude verificar sin red si respeta checkValidity. Que se lo salte es posible.

Riesgo bajo, no bloqueante:

- Shopify valida las reglas en el servidor. Storefront API, CartErrorCode (https://shopify.dev/docs/api/storefront/latest/enums/CartErrorCode) define "MINIMUM_NOT_MET: The quantity must be above the specified minimum for the item.", "INVALID_INCREMENT: The quantity must be a multiple of the specified increment." y "MAXIMUM_EXCEEDED: The quantity must be below the specified maximum for the item."
- QuantityRule (https://shopify.dev/docs/api/admin-graphql/latest/objects/QuantityRule) dice "Only quantities divisible by this value will be considered valid".
- Con stock por debajo del minimo, el servidor no puede cumplir el minimo con deny. Lo peor es un error en el checkout, no un pedido invalido.

Las paginas oficiales que consulte no dicen literalmente que el checkout aplique las reglas: lo infiero de los codigos de error del carrito. Queda como pendiente documentado: ocultar .product-form__dynamic-checkout cuando belowMinimum.

## 3. Harness

- Propio: /tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d02q-2/review2-harness.js, con 34 casos (R1-R9 cajon, P1-P11 PDP). Salida en rev-d02q-2/v2.out: 34/34 PASS, 0 pageerror. En v1 el harness se corta en P2 porque el formulario se envia y navega, que es el O1 sin corregir.
- Del autor: harness-drawer.js da 20/20 en v2 y 10/20 en v1. harness.js da 32/32 en v2.
- De la revision 001 sobre v2: solo cambian R6 (ahora valid=false, es O1) y R7 cajon. Ahora se envian 4, 2 y 10 donde antes no se enviaba nada (C1 resuelto) y el 0 se muestra como 0.

## 4. Gates

- node --check assets/theme.js: OK.
- Theme Check 4.8.0 sobre una copia limpia de 645fdc0 (git archive en rev-d02q-2/tc): `[]`.
- Credenciales: grep de token, secret, password, api_key, shpat, shpss, bearer, private_key y AKIA sobre el diff, sin resultados.
