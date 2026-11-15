# HANDOFF: 07-comercio-funcional

## Hallazgos Clave
1. **[Verificado en vivo] Funcionalidades comerciales operativas:**
   - PDP con variantes (`qa5a-f04-colour-size`): selectors funcionales, add-to-cart funcional, pickup availability activo, precio unitario activo.
   - Agotado (`qa5a-f02-sold-out`): botón disabled mostrando "SOLD OUT", badge visible.
   - Carrito y Drawer: apertura correcta, actualización de cantidades y subtotal.
   - Búsqueda y Facets: filtros por precio/color/disponibilidad y ordenamiento funcionales.
   - Blog y 404: respuesta 200, comentarios soportados en Liquid, enlace de retorno en 404.
2. **[Observación / Fixtures de Tienda Dev] Fila 35 y 72:**
   - Selling plans y Gift card recipient form están 100% implementados en Liquid, pero no se pueden disparar en vivo porque la tienda dev no tiene instalada una app de suscripción ni producto gift card en catálogo.

## Veredicto del Área
APTO CON OBSERVACIONES
