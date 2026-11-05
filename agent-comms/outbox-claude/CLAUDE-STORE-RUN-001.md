# CLAUDE-STORE-RUN-001 - Primera ejecucion en tienda (gate5 y auditorias de previews)

Fecha: 2026-11-05. Rama lote-b. Solo lectura en tienda salvo el carrito efimero de gate5 (PD-8/D28). Sin valores secretos. Salidas completas en el scratchpad (no en el repo).
Previews (no publicadas): Sartorial 190232297715, Imprint 190232330483, Archive 190232363251 (se accede con `?preview_theme_id=<ID>`, sin contrasena en la URL).

## Confirmaciones gate5
1. Cookie `storefront_digest`: NO. Tras introducir la contrasena el acceso queda concedido (de /password a `/`, `/products.json` pasa de redirigir a /password a responder 200), pero las cookies presentes son `_shopify_essential`, `localization`, `cart_currency`, `_shopify_analytics`, `_shopify_marketing`; no existe ninguna llamada `storefront_digest`. El estado de acceso parece vivir en `_shopify_essential` (httpOnly). Hay que actualizar el criterio de la compuerta (no exigir ese nombre).
2. Redireccion de /password: SI. Anonimo en `/products.json` termina en `/password`; con la contrasena acepta y navega a `/`.
3. Modal de contrasena: NO verificable. `/password?preview_theme_id=...` sirve la pagina de contrasena del tema publicado de la tienda (titulo de tienda, `form action=/password`, 0 elementos `password-modal`, 0 `[data-password-open]`), no la plantilla de la preview; el campo de contrasena esta visible directamente. El modal de `sections/main-password.liquid` no se ha podido abrir en tienda. Para verificarlo hay que tener la plantilla activa en el tema publicado (accion fuera de alcance) o usar el editor/otra via.
4. Rutas /collections/password y /products/challenge: SI. `GATE5_CONFIG: STOREFRONT_COLLECTION_PATH must not end in password or challenge.` y analogo para PRODUCT_PATH; exit 1 sin navegar.

## Resultado de gate5 (Sartorial, /collections/the-permanent-collection, /products/wool-waistcoat)
Una sola ejecucion (script sin flags; entrada por STOREFRONT_ORIGIN, STOREFRONT_THEME_ID, STOREFRONT_PASSWORD, STOREFRONT_COLLECTION_PATH, STOREFRONT_PRODUCT_PATH). Pasos 1-4 en verde: switcher lista/2/4 columnas, subtotal reactivo (3 uds = $1,380.00), chips 54.8x44 y 75.9x44, nota persistida en /cart.js. Global FALLO solo por el contador de errores de consola: 44 "Failed to load resource: net::ERR_TUNNEL_CONNECTION_FAILED" (hosts de terceros bloqueados por el proxy del sandbox), bugsnag de la barra de previsualizacion y metricas de wallets (Failed to fetch). Son artefactos del entorno, no del tema; no se repite (criterio de parada). Sugerencia: filtrar `ERR_TUNNEL_CONNECTION_FAILED` y `shopifycloud` del contador o ejecutar fuera del sandbox. La pasada del script es de escritorio (1280x900); el script no tiene modo movil.
Carrito: gate5 anade 1 unidad y una nota en un contexto de navegador desechable; el contexto se descarta al terminar y nunca se llego a checkout. No se pudo vaciar de forma explicita (el token vive solo en esa sesion); queda abandonado, sin pedido. El resto de pasadas no uso el carrito.

## Lighthouse movil (performance / accesibilidad) y axe WCAG 2.1 AA (movil 390x844)
| Preview | Pagina | Perf | A11y | LCP | axe |
|---|---|---|---|---|---|
| Sartorial | home | 62 | 97 | 3.3 s | 1 |
| Sartorial | coleccion | 80 | 97 | 2.2 s | 1 |
| Sartorial | producto | 80 | 97 | 2.1 s | 1 |
| Imprint | home | 77 | 97 | 2.0 s | 1 |
| Imprint | coleccion | 78 | 97 | 1.3 s | 1 |
| Imprint | producto | 79 | 97 | 1.7 s | 1 |
| Archive | home | 79 | 97 | 2.0 s | 1 |
| Archive | coleccion | 77 | 97 | 1.8 s | 1 |
| Archive | producto | 80 | 97 | 1.4 s | 1 |
CLS 0 en todas. La unica violacion en las 9 paginas es `frame-title` (serious) en `#PBarNextFrame`, el iframe de la barra de previsualizacion de Shopify (plataforma, no tema; no aparece fuera de previews). Violaciones atribuibles al tema: 0. Nota: la home de Sartorial es la mas lenta (62, LCP 3.3 s); Lighthouse corre en sandbox con proxy, tomar como orientativo y repetir fuera de el para submission.

## Teclado (movil, Tab/Enter/Escape)
Menu movil y cajon de carrito (carrito vacio) en las 3 previews: el disparador se alcanza con Tab (menu 3 pulsaciones, carrito 7), Enter abre y mueve el foco al panel, 14/14 Tab consecutivos quedan dentro del panel, Escape cierra y devuelve el foco al disparador. Fallos: 0. (El enlace de carrito no expone aria-expanded; es un enlace, no boton.)

## Parada
No hubo P0/P1 nuevo, ni gate5 repetido, ni escritura fuera de lo permitido.
