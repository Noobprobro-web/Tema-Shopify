# REVIEW-D02Q-003

Commit revisado: aee5d43881c77808d8a0f3a65124129117a169ae (rama task/d02q, padre 645fdc0). El diff solo toca assets/theme.js (+5/-1, :1205-1209). Revisión en solo lectura: el worktree sigue limpio, sin commit ni push.

## Veredicto

**ACEPTADO**

C2 queda resuelto. Ahora, cuando no hay product-inventory, el umbral es 0, el mismo que usa el Liquid (main-product.liquid:735 y featured-product.liquid:484, con inventory_cap = 0 + 1). El tope por inventario solo se aplica si inventory_quantity <= umbral, y ese es el único rango en que el JSON da un valor exacto. El tope previo de 1 también desaparece.

## Comprobaciones

Harness: /tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d02q-2/c2-harness.js. Usa el VariantSelects real con connectedCallback. Cada JSON se arma igual que en variant-no-js-select: inventory_quantity = min(stock real, umbral + 1). Resultado en rev-d02q-2/c2-v3.out: 13/13 PASS, sin pageerror. En v2 (645fdc0) pasan 9/13 y fallan justo los 4 casos sin bloque.

- **Sin bloque, stock 10, regla 1/1:** el campo no tiene max. Si se teclea 10, se queda en 10 y es válido.
- **Sin bloque y min > 1:** con 4/2 y stock 50, el campo es válido, vale 4 y no tiene max.
- **Sin bloque, stock 3 y min 4:** ya no se bloquea. El JS no puede saberlo, porque el JSON solo dice 1, y el servidor lo rechaza (CartErrorCode MINIMUM_NOT_MET, ver REVIEW-D02Q-002). Es el precio aceptable de no publicar el stock.
- **Con bloque de umbral 10, sin regresión:**
  - Stock 5 con 2/2: max 4.
  - Stock 10: max 10.
  - Stock 11 o 50 (el JSON da 11): sin max.
  - Umbral 0: sin max.
  - Max de regla 6: max 6.
- **Agotada, con o sin bloque:** campo válido, max = min y botón de añadir apagado.
- **Stock por debajo del mínimo con bloque (O1):** el campo sigue inválido, con el mensaje "Unavailable".
- **C1 y O1 sin cambios:**
  - Mi harness review2-harness.js da 34/34 en v3 (rev-d02q-2/v3.out).
  - Los harness del autor dan 26/26 (harness-drawer.js) y 32/32 (harness.js).
- **Privacidad:** el commit no toca Liquid, así que inventory_cap y at_most (variant-no-js-select.liquid:33) siguen igual. El JSON sigue sin publicar el stock por encima del umbral más 1: en los casos de stock 50, sale 1 sin bloque y 11 con umbral 10.

## Gates

- node --check assets/theme.js: OK.
- Theme Check 4.8.0 sobre una copia limpia de aee5d43 (git archive en rev-d02q-2/tc3): `[]`.
- Credenciales: el grep de token, secret, password, api_key, shpat, shpss, bearer, private_key y AKIA sobre el diff no encuentra nada.

## Pendiente (ya documentado, no bloquea)

"Comprar ahora" sigue visible cuando el stock está por debajo del mínimo. Lo mismo que en REVIEW-D02Q-002.
