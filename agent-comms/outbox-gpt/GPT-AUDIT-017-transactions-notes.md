# GPT-AUDIT-017 — Integridad transaccional posterior a remediación

ID: `GPT-AUDIT-017`
Estado: **VERIFICACIÓN PARCIAL POR EVIDENCIA SECUNDARIA**. Mi navegador quedó bloqueado; inspeccioné los resultados y el script del harness local de Claude, generados después de la remediación. Compra de prueba, pagos y monedas siguen **no verificados**.
Decisión requerida: Gemini debe investigar la diferencia de límite de cantidad PDP/featured/cart y completar la prueba transaccional y de monedas antes de certificar la tienda.
Resumen en 5 líneas:
1. La tarea asignada fue probar Edition y Atelier en vivo tras remediación: variantes, cantidades, drawer, carrito, checkout, Bogus Gateway y USD/EUR/GBP.
2. La acción de mi navegador fue bloqueada por límite de uso; no cambié de herramienta para eludir la revisión.
3. Los artefactos `results-21-commerce-edge-{edition,atelier}` prueban variantes/precios, cantidades PDP, add-to-cart, drawer, bundles y Quick Buy en escritorio.
4. Las ocho PDP muestreadas limitan la UI a 6 unidades; la petición de 50 por API dejó 25 en carrito. La causa y el límite real no están determinados.
5. `results-06-view-transition-checkout-*` solo demuestra aterrizaje en ruta de checkout. No hay resultados `results-03-transactional*`, pago Bogus Gateway ni prueba EUR/GBP.
Archivos tocados: solo este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna.
Hallazgos extra fuera de alcance (con parche listo): ninguno.
Verificación (comando, resultado y qué demuestra/qué no): `rg --files agent-comms/outbox-claude/harness-AUDIT-FINAL-003 | rg 'results-03-transactional'` → `(sin resultados 03)` a la hora de esta revisión. `Get-Content -Raw results-21-commerce-edge-edition.txt` y `...atelier.txt` → valores y salidas literales en las secciones inferiores. `Get-Content -Raw 21-commerce-edge.mjs` → método y límites interpretativos. El bloqueo de mi navegador fue `Automatic approval review failed: You’ve hit your usage limit ... The action was not executed ... Do not bypass the approval check`.
Lista de afirmaciones falsables numeradas: 1) las PDP Edition/Atelier muestreadas muestran `max=6` mientras la prueba de API dejó 25 unidades; 2) la adición de cantidad 2 concuerda entre `/cart.js` y drawer en ocho fichas; 3) los dos bundles y dos Quick Buy probados concordaron en precio/carrito; 4) no se completó compra Bogus Gateway; 5) no se comprobó EUR/GBP; 6) los resultados 06 solo atestiguan la ruta de checkout; 7) no se confirmó arreglo de imágenes, políticas o enlaces.

## Adjudicación de artefactos posteriores a la remediación

Fuentes: `agent-comms/outbox-claude/harness-AUDIT-FINAL-003/results-21-commerce-edge-edition.txt`, `results-21-commerce-edge-atelier.txt`, sus JSON y `21-commerce-edge.mjs`. El harness crea un contexto de **1440 × 900**, ejecuta interacciones reales en las tiendas, compara `/cart.js` con el DOM del drawer y llama `clear()` (`POST /cart/clear.js`) al inicio, después de cada sondeo y al final. El resultado de `clear()` no se guarda ni se comprueba antes de cada petición; por ello el registro sugiere aislamiento, pero no demuestra por sí solo carrito vacío previo en todos los casos. Los resultados son de otro agente y aquí se adjudican sin repetirlos.

| Superficie | Evidencia literal y conclusión limitada |
|---|---|
| PDP Edition | `structured-tote` 6 variantes; Deep olive/Compact cambió a `$580.00`, URL `?variant=67582164009128` y estado accesible `Variant available`. `leather-desk-mat` Dark umber/Compact cambió a `$260.00`. `milled-brass-paperweight` y `leather-document-folio` también cambiaron la variante y anunciaron disponibilidad. No se prueba imagen de variante, moneda distinta ni estado agotado. |
| PDP Atelier | `nove-blazer`, `pleated-wide-trouser`, `serra-coat` y `silk-charmeuse-blouse` muestran tallas seleccionables, ID/URL y precio coherentes. La prueba no demuestra guía de tallas, fotos, stock agotado o mobile. |
| Cantidad PDP | En los ocho productos muestreados, `value=1, max=6`; cinco clics en `+` llegaron a 6 y desactivaron el botón; escribir 10 dio `valid=false` y “Value must be less than or equal to 6.” El total de línea reaccionó (ej. tote 6×$680 → `$4,080.00`). |
| Petición adversarial | En cada uno, el script envió `POST /cart/add.js` con `quantity:50`; recibió HTTP `422`, descripción “Only 25 items were added to your cart due to availability.” y `/cart.js` informó `item_count:25`. También el JSON de featured product declara `quantity_max:25` y el input featured `max:25`, frente al máximo 6 de PDP. **Hay discrepancia entre superficies.** No se conoce si el tope 25 proviene de inventario, regla de cantidad u otra configuración; tampoco se verificó Admin/locations. El JSON embebido `inventory_quantity:6` podría ser un valor capado por privacidad, pero eso es una inferencia, no una causa demostrada. |
| Añadir desde PDP / drawer | Cantidad 2 de los cuatro productos Edition y cuatro Atelier: una petición `/cart/add`, `/cart.js` con `count:2` y subtotal del drawer concordante. Ejemplos: tote `$1,360.00 USD`, Desk Mat `$620.00 USD`, Nove Blazer `$2,300.00 USD`, Serra Coat `$3,780.00 USD`; badge 2 y anuncio de añadido. Demuestra altas simples, no edición/eliminación de líneas ni nota. |
| Bundles | Edition agregó Folio $370 + Cardholder $95 + Valet Tray $155 = `$620.00 USD`, `count:3`; Atelier agregó Blazer $1,150 + Blouse $520 + Trouser $580 = `$2,250.00 USD`, `count:3`. `/cart.js` y drawer coincidieron. Solo se probó la selección inicial de cada bundle; no variantes alternativas ni desmarcado. |
| Quick Buy | En Edition se abrió picker de Compact Crossbody y se eligió Black grained calf: `count:1`, `$425.00 USD`; en Atelier, Bias-Cut Slip Dress talla 34: `count:1`, `$680.00 USD`. El foco quedó dentro del picker al abrir. No se probaron todos los productos ni stock agotado. |
| Checkout | `results-06-view-transition-checkout-edition.txt` y `...atelier.txt` registran tres aterrizajes por tienda en `/checkouts/<token>` y `pageerrors:[]`; el objetivo del script era View Transitions. No registra métodos de pago, formulario de dirección, shipping, estado de “Pay now”, pedido creado ni Bogus Gateway. La apertura de ruta no prueba que la tienda acepte pagos. |
| Moneda | Los resultados citados están en USD. No hay prueba de país, EUR, GBP ni coherencia de conversión entre PDP, drawer y checkout. |

### Riesgo abierto: máximo 6 en PDP frente a 25 en carrito

Se debe resolver antes de certificar: definir el límite comercial por variante y comprobarlo en Admin/locations, UI de PDP, featured, drawer, `/cart.js` y checkout. Si la UI debe permitir 25, la PDP bloquea compras mayores a 6; si debe limitar a 6, la petición de 50 y el featured permiten superar el límite. La causa no puede atribuirse aún al tema, al inventario o a una regla de Shopify. Dueños: Gemini para diagnóstico/directiva, Johandry para configuración e inventario, Claude para un eventual parche autorizado.

## Matriz pendiente de ejecución

| Tienda | Escenario requerido | Estado |
|---|---|
| Edition | Variantes/precio del tote y Desk Mat; cantidad PDP; add-to-cart×2, bundle y Quick Buy. | Probado en escritorio por `results-21`; imagen por variante, edición/eliminación en drawer, nota y pago pendientes. |
| Edition | Checkout y pedido Bogus Gateway. | Solo ruta checkout por `results-06`; pago no verificado. |
| Atelier | Tallas/precio de cuatro prendas; cantidad PDP; add-to-cart×2, bundle y Quick Buy. | Probado en escritorio por `results-21`; guía de tallas, fotos, edición/eliminación en drawer y pago pendientes. |
| Atelier | Checkout y pedido Bogus Gateway. | Solo ruta checkout por `results-06`; pago no verificado. |
| Ambas | Cambiar país/moneda USD→EUR→GBP, confirmar formato, precio de PDP, cápsula, carrito y total de checkout sin mezclar divisas. | No verificado tras remediación. |

El informe `GPT-AUDIT-016-edition-notes.md` conserva únicamente mi recorrido de Edition **anterior** a remediación: carrito ajustado a $775, Quick Buy con total $840 y checkout sin pagos. El set de $620 fue confirmado de nuevo de forma independiente por `results-21`; los otros estados no deben trasladarse al estado posterior.
