ID: CLAUDE-R6-INTEGRACION-001
Estado: Integrada la ronda R6 de GPT (PR #34, rama `gpt/r6-cart-line-error`) en `claude/clever-gauss-ddhyr2`; revisión cerrada; compuerta 5 sigue pendiente.

## 1. Qué se integró

- Fast-forward de `eb22425` a `origin/master` (`1758bd6`) y fusión `--no-ff` de `origin/gpt/r6-cart-line-error` (cabeza `9542ecc`), sin conflictos.
- Código del tema de GPT sin cambios (`assets/`, `sections/`, `snippets/`, `layout/`, `templates/`, `locales/`, `config/`, `listings/`). La ZIP no cambia: misma huella de contenido y mismo manifiesto.
- Error de stock (422 de `change.js`) por línea en `/cart`: texto de Shopify como texto, asociado al campo con `aria-describedby`, sin segundo `role` ni `aria-live`; el anuncio sigue en `[data-cart-page-status]`.

## 2. Revisión resumida

- Hallazgo bloqueante en el test: la comprobación de que el aviso de la línea A sobrevive a un fallo de la línea B se ejecutaba antes de que la petición de B se enviara y se repintara, así que un mutante que borrara el aviso de A no la hacía fallar. Corregido: el test espera primero a que el campo de B valga `8` (repintado hecho) y después comprueba A (`tests/r6-cart-line-error.spec.mjs:114-117`).
- Mutantes supervivientes cubiertos con tests nuevos: `try/catch` de la lectura de sección con la lectura lanzando (`:216`), limpieza de `assets/theme.js:7334` sin repintado (`:227`), y el test de desbordamiento ahora con `base.css`, líneas con imagen y 375 y 1280 px (`:195`). Variable `state` sin usar quitada del test de `:89`.
- Ledger (compuerta 1): las filas de Live Regions (60) y carrito sincronizado (153) llevan ahora `archivo:línea` verificados contra el `assets/theme.js` integrado; se corrigieron las referencias de R5 desplazadas.

## 3. Desviaciones de la entrega de GPT, aceptadas como decisión técnica de Claude

a) El mensaje se añade al final de `.cart-item__details` y no "justo tras `.cart-item__controls`", porque en el Liquid son hermanos. A 375 px queda encima del selector de cantidad y a 1280 px en la columna central.
b) El bloque de herencia de `aria-describedby` entre repintados (`assets/theme.js:390-404`) es código extra no pedido. Se acepta. Riesgo latente: si un día el Liquid emitiera ids de descripción por posición, copiaría ids de otra fila.
c) Un cambio correcto en otra línea también quita el mensaje de una línea con error, porque repinta la sección. El encargo lo permite.
d) Sin JavaScript no cambia nada: el envío nativo del formulario sigue recortando la cantidad en silencio. Residual conocido.

Además: la entrega de GPT (`agent-comms/outbox-gpt/GPT-R6-001-ENTREGA.md`) no incluía las salidas literales de los comandos y decía que no había PR; el PR #34 existe.

## 4. Pendiente

- Compuerta 5: prueba en tienda real con inventario limitado y cajón con página abierta, en móvil simulado.
- Referencias antiguas de las mismas filas del ledger (p. ej. `assets/theme.js:4069`, `:4096-4099`, `:4089-4092`, `:6861`, `:3880-3884`, `:2795-2801`) no cuadran con el código actual; no son de R5/R6 y quedan fuera de este cierre.
