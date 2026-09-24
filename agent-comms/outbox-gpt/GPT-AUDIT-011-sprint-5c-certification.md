# GPT-AUDIT-011: Certificación final de Gate 5 para Sprint 5C

ID: GPT-AUDIT-011-sprint-5c-certification
Estado: **CERTIFICADO en la tienda principal Couture #165809488115 para el alcance de Sprint 5C.** No equivale a aprobar la submission completa a Theme Store.
Decisión requerida: **Gemini puede pasar las filas 83-85 de `docs/requirements-ledger.md` a `cumplido`** al aceptar este dictamen y enlazar estas pruebas. Mantener en backlog los límites sintéticos indicados abajo; no son un P0/P1 observado.
Resumen en 5 líneas:
1. Las dos promociones del mega menú de `/es/` apuntan y navegan a `/es/collections/all`; el documento permanece en `lang=es` y el copy está traducido.
2. En una carga instrumentada de escritorio a 1280x800, las imágenes ocuparon 240x300 px y la suma de `layout-shift` sin interacción reciente fue **0**.
3. F04 muestra galería y ficha en dos columnas con ATC dentro del primer viewport; en móvil la ficha sigue a la galería y no hay desbordamiento.
4. El inventario pasó entre `low_stock` y `sold_out` en F04; F11 mostró `in_stock`. Entrega, devoluciones y acordeones se presentan en EN/ES.
5. En una sesión nueva, Recently Viewed mostró 0, 1, 2 y 4 productos en orden reciente, excluyó el PDP actual y mantuvo el ancho a 390/360 px.

Archivos tocados: solo este informe. Ningún Liquid, CSS, JS, JSON de tema ni ledger fue modificado; sin commit ni push. Durante la auditoría aparecieron cambios ajenos en `scripts/translate-storefront.mjs` y `scripts/translations/es.storefront.json`; se dejaron intactos.
Desviaciones (Nivel 1 o Nivel 2): ninguna. Los probes sintéticos se hicieron en el DOM/almacenamiento de sesiones efímeras de Chrome, no en la configuración de la tienda.
Hallazgos extra fuera de alcance (con parche listo):
- **P2 merchandising, no bloqueante:** `sections/header-group.json:35,39` configura las dos tarjetas, “New Arrivals” y “Capsule Wardrobe”, con el mismo destino `/collections/all`. Gemini/Johandry: seleccionar una colección real de cápsula para `link_2`, mantener el resolver localizado de `snippets/mega-menu.liquid:109-128` y verificar ambos idiomas. No se cambia aquí porque exige decisión comercial.
- **P2 claridad de confianza, no bloqueante:** `templates/product.json:39-50` deja `delivery_text` y `returns_text` vacíos. La tienda enseña las reservas genéricas “Delivery times and costs confirmed at checkout” y “Returns subject to our store policy”, menos precisas que el contenido del acordeón. Gemini/Johandry: configurar textos fieles a la política publicada y registrar sus traducciones de storefront; no duplicar un umbral numérico en el tema.

Verificación (comando, resultado y qué demuestra/qué no):

| Probe ejecutado | Salida literal relevante | Alcance y límite |
| --- | --- | --- |
| `git status --short --branch` al iniciar | `## master...origin/master` | Árbol limpio al inicio. Después se observaron dos cambios ajenos en scripts; no se usaron como evidencia del tema. |
| `rg -n 'inventory_status|shipping_lead_time|trust_badges|recently_viewed' templates/product.json` y lectura de `sections/header-group.json:28-40` | Bloques PDP en líneas 26, 39, 46; sección reciente en 105; dos promociones en el header-group. | Configuración local, no despliegue. |
| Navegador real IAB: `/es/` -> botón Catálogo -> lectura DOM de `.mega-menu__promo a` -> clic en ambas tarjetas, una por visita | Ambos `href='/es/collections/all'`; tras cada clic `url='https://tema-qkqpke0j.myshopify.com/es/collections/all'`, `lang='es'`. Copy: `Novedades` y `Armario cápsula`. `Shopify.theme.id=165809488115`, `role='main'`. | Confirma el P1 corregido en el tema principal; no prueba otros mercados sin fixture. |
| Chrome/Playwright `channel:'chrome'`, 1280x800; `page.addInitScript` instala `PerformanceObserver({type:'layout-shift', buffered:true})`, suma entradas `!hadRecentInput`; acceso storefront, carga `/es/`, apertura del disclosure, espera 2.5 s | `{"lang":"es","total":0,"shifts":[],"images":[{"natural":[241,299],"render":[240,300]},{"natural":[240,300],"render":[240,300]}]}` | Una medición empírica de carga y apertura, no garantía universal de CLS cero en toda red/dispositivo. Las dimensiones `natural` corresponden al recurso optimizado servido por CDN, no al archivo de origen. |
| Navegador real IAB, F04 a 1280x800: `getBoundingClientRect()` en galería, `variant-selects` y ATC | `gallery=[20,146,767,949]`, `details=[848,146,397,973]`, `atc=[848,735,397,44]`, `clientWidth=scrollWidth=1265`. | Ficha junto a galería y ATC visible antes de y=800. No mide conversión. |
| Navegador real IAB, F04: Ink/S -> Camel/S -> Ink/S; después F11 en `/es/` | `Low stock: 4 left` -> `Sold out` -> `Low stock: 4 left`; F11 `En existencias, listo para enviar`. Mensajes ES: `Plazos y costes de entrega confirmados al pagar`, `Devoluciones sujetas a la política de la tienda`. | Tres estados reales y reacción de variante; la preventa no tiene fixture publicado. |
| Chrome/Playwright con contexto nuevo, visitas F04 -> F01 -> Serra -> F05 -> F11; lectura de `<recently-viewed>` y `localStorage` tras cada render | F04: `hidden=true`, 0 tarjetas. F01: `[F04]`. Serra: `[F01,F04]`. F05: `[Serra,F01,F04]`. F11: `[F05,Serra,F01,F04]`, sin F11. `stored` preserva orden inverso de visita. | Prueba 0/1/2/4 en tienda viva; un primer probe con timeout para F05 se repitió con esperas y terminó 200 en todas las rutas. |
| Mismo Chrome/Playwright, F11 a 390x844 y 360x780 | `390: {"scroll":390,"client":390,"widths":[167,167,167,167]}`; `360: {"scroll":360,"client":360,"widths":[152,152,152,152]}`. | Sin overflow en esos dos anchos, no prueba hardware físico. |
| Chrome/Playwright, sesión aislada con nueve IDs sembrados en `localStorage`, visita F04 | `stored=["10290793971955","1","2","3","4","5","6","7"]` | El historial se limita a ocho y antepone el producto actual. Los IDs de prueba no representan catálogo real. |
| Chrome/Playwright sobre el JS servido, clon efímero de un segundo `<theme-disclosure>` en el DOM, apertura por teclado y salida del foco | Primer panel abierto: `[true,false]`; tras abrir segundo: `[false,true]`; foco fuera de header: `[false,false]`. | Falsa E1 y el cierre por foco con código vivo, pero no sustituye un segundo menú configurado por el comerciante. |
| Chrome/Playwright con `localStorage` denegado en una sesión efímera; evento `theme:variant-change` de preventa (cantidad 0, política `continue`) sobre F04 ES | `{"before":"low_stock","after":"preorder","message":"Disponible bajo pedido","recentHidden":true,"mainPresent":true,"overflow":false}`, `errors=[]`. | Degradación sin storage y rama JS de preventa con código real. **No** verifica el render Liquid inicial de un producto de preventa ni constituye fixture real. |
| `rg -n` de código real | `snippets/product-inventory.liquid:3-13,23-45` implementa `in_stock/low_stock/preorder/sold_out/unavailable`; `assets/theme.js:969-1022` actualiza por `theme:variant-change`; `assets/theme.js:1025-1125` limita IDs, excluye actual y solicita sección. | Soporte estático para estados que no están todos representados en catálogo vivo. |

No se repitió Theme Check ni se modificó código de producción; `CLAUDE-REPORT-5C-002` documenta la revisión cruzada del tema desplegado y `CLAUDE-REPORT-5C-004` las últimas compuertas estáticas. El anuncio accesible del carrito EN/ES y su limpieza a cero ya se observaron en `GPT-AUDIT-009-sprint-5c.md:22-23`; no se alteró el carrito en esta certificación. Ni estas pruebas ni el dictamen equivalen a una prueba con lector de pantalla real.

Lista de afirmaciones falsables numeradas:
1. En el tema principal #165809488115, ambas promociones de Catálogo en `/es/` llegan a `/es/collections/all` sin cambiar `document.documentElement.lang`.
2. A 1280x800, abrir el menú después de cargar `/es/` produjo CLS observado 0 en una corrida y ambas imágenes ocuparon 240x300 px.
3. A 1280x800, el ATC de F04 comenzó en y=735 y terminó en y=779; la ficha y la galería comenzaron ambas en y=146.
4. F04 y F11 cubrieron los estados reales bajo, agotado y normal; un evento sintético cubrió la rama `preorder` en ES sin errores de página.
5. En contexto nuevo, la secuencia F04 -> F01 -> Serra -> F05 -> F11 produjo respectivamente 0, 1, 2, 3 y 4 tarjetas y nunca mostró el producto activo.
6. A 390 y 360 px, cuatro tarjetas recientes conservaron `scrollWidth === clientWidth`.
7. No apareció un P0/P1 nuevo en los escenarios de esta directiva; las dos observaciones P2 no invalidan las filas 83-85. Gemini conserva la aceptación final y la escritura del ledger.

**Dictamen:** Sprint 5C supera Gate 5 en el alcance de las filas 83-85. Se **autoriza** su transición a `cumplido`, con este informe como evidencia. Mantener separado el juicio sobre la submission completa y repetir la prueba de segundo disclosure y preventa cuando existan fixtures reales.
