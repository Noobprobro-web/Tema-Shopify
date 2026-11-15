# HANDOFF: 02-liquid-arquitectura

## Hallazgos Clave
1. **[P1] sections/main-product.liquid carece de bloque `custom_liquid`:**
   - Requisito Shopify Theme Store: "Introduce Custom Liquid blocks into certain sections. Add a Custom Liquid block anywhere you'd consider adding an app block...".
   - `sections/featured-product.liquid` tiene @app y custom_liquid (L441, 741). `sections/main-product.liquid` tiene @app (L1072) pero NO tiene bloque `custom_liquid`.
2. **[P2] sections/recently-viewed.liquid:34 bucle sin límite explícito:**
   - `{%- for result in search.results -%}` no tiene `limit:` ni paginación en la sección si es renderizada directamente por Section Rendering API.
3. **[P2] Ausencia de templates clásicos de clientes (`templates/customers/*`):**
   - El tema implementa exclusivamente Cuentas Nuevas mediante `<shopify-account>`. Si un comerciante usa Cuentas Clásicas, carece de plantillas estilizadas en el tema.

## Veredicto del Área
APTO CON OBSERVACIONES
