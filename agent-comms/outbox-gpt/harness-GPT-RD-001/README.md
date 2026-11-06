# R-D/G2: Lighthouse en previews no publicadas

Arnés de solo lectura para medir una vez cada celda de Home, colección y producto, en móvil y escritorio, sobre Sartorial, Imprint y Archive. Lighthouse recibe la misma página Puppeteer que autenticó y verificó por `Shopify.theme.id`; no crea otro target de navegador. Esta revisión es una muestra por celda, no una aceptación de R-D/G2 ni certificación de accesibilidad.

## Precondiciones

Antes de cada ejecución, confirma con Shopify CLI que el tema elegido sigue `unpublished` en la única tienda autorizada `tema-qkqpke0j`. Comprueba que `SHOPIFY_CLI_THEME_TOKEN` y `STOREFRONT_PASSWORD` existen sin mostrar valores; si falta una, no ejecutes. El token se comprueba y protege el guard de redacción en memoria; este runner no lo envía a Shopify.

Se requieren seis variables locales para autenticación/configuración, cinco de ellas conocidas por Gate 5:

| Variable | Secreta | Uso |
|---|---:|---|
| `SHOPIFY_CLI_THEME_TOKEN` | Sí | Presencia y guard de redacción; no se envía. |
| `STOREFRONT_PASSWORD` | Sí | Una operación POST de autenticación, solo a `/password`. |
| `STOREFRONT_ORIGIN` | No | `https://tema-qkqpke0j.myshopify.com`, sin `/` final. |
| `STOREFRONT_THEME_ID` | No | Un ID de preview por corrida: `190232297715`, `190232330483` o `190232363251`. |
| `STOREFRONT_COLLECTION_PATH` | No | Ruta de colección autorizada, sin query ni fragmento. |
| `STOREFRONT_PRODUCT_PATH` | No | Ruta de producto autorizada, sin query ni fragmento. |

`LIGHTHOUSE_ROOT` apunta al directorio local que contiene `node_modules/lighthouse` y `node_modules/puppeteer-core`. Se instala fuera del repo; no modifica `package.json` ni `package-lock.json`.

Ejemplo de preparación de una corrida en PowerShell (los valores secretos no se asignan ni muestran):

```powershell
$env:STOREFRONT_ORIGIN = 'https://tema-qkqpke0j.myshopify.com'
$env:STOREFRONT_THEME_ID = '190232297715'
$env:STOREFRONT_COLLECTION_PATH = '/collections/the-permanent-collection'
$env:STOREFRONT_PRODUCT_PATH = '/products/wool-waistcoat'
$env:LIGHTHOUSE_ROOT = 'C:\Users\Johan\AppData\Local\Temp\codex-lighthouse-13.4.1'
node agent-comms/outbox-gpt/harness-GPT-RD-001/run.mjs --theme=190232297715
```

Repite con el ID y valor correspondiente de cada preview, tras un preflight CLI nuevo por tienda. Cada ejecución mide las seis páginas de un preset y produce un JSON nuevo en `results/`.

## Política de solicitudes

- Solo GET/HEAD a los hosts HTTPS exactos `tema-qkqpke0j.myshopify.com`, `cdn.shopify.com` y `fonts.shopifycdn.com`; sin credenciales en URL ni puerto no estándar. Cada salto de red se valida antes de continuar.
- El POST de autenticación se envía con un cliente API separado, sin redirects automáticos, exclusivamente a `https://tema-qkqpke0j.myshopify.com/password`. Se acepta 302/303 solo si el destino queda en la tienda y `/`; se descarta su query/fragmento y luego el navegador navega a una URL del preset construida por el runner. Se respetan hasta tres reintentos por HTTP 429 y el mayor plazo entre backoff 1/2/4 segundos y `Retry-After`; un plazo no representable falla con código fijo.
- Los GET/HEAD externos usan cabeceras constantes y no reciben Cookie, Authorization, Referer, Origin ni Set-Cookie del storefront. Service Workers se bypass y WebSockets quedan bloqueados. Checkout y cualquier método distinto de GET/HEAD en el navegador se bloquean. No se mutan carritos, productos, apps, metafields ni configuración y no se envía checkout.
- Errores HTTP/de transporte del dominio de tienda o assets `/cdn/shop/t/<theme_id>/` y `/cdn/shop/files/` fallan. Errores de otros hosts se registran como aviso con host/ruta sin query; analítica, pixels, monorail, Shop Pay y la barra de previews siguen bloqueados/avisados según la lista D28 de `docs/decisions.md`. Hosts bloqueados no clasificados quedan marcados para revisión; no se infiere que sean necesarios.
- El JSON omite URLs completas, query strings, hashes, cookies, cabeceras, cuerpos, mensajes de error crudos, texto DOM y datos de formularios. Guarda códigos fijos, host/ruta con guard de secretos, ID de preview, resultados y métricas numéricas. No emite informes Lighthouse brutos.

## Resultado e interpretación

- `measured`: Lighthouse devuelve categorías y métricas finitas, la ruta final coincide y el target auditado conserva la identidad exacta del tema.
- `incomplete`: score/métrica ausente, runtime error o se agotaron reintentos 429. `failed`: identidad/ruta/solicitud del dominio de tienda o asset de tema fallida.
- Mobile perf <70 se marca `mobilePerformanceRisk=true` y requiere propuesta de mejora dentro del plan. No se cambia código de rendimiento sin diagnóstico causal y R-D.
- El JSON incluye Lighthouse/Chrome, configuración efectiva, una repetición por celda, scores, métricas, IDs de auditorías fallidas y avisos. `axe`/teclado se registran aparte en el arnés R-A/R-B y no se reinterpretan desde este resultado.
- Sin aprobación de R-D, métodos de aceptación y repeticiones siguen pendientes. No transformar un resultado único en cierre de C-03, R-D/G2 o R-G.
