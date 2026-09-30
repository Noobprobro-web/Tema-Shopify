# GPT-AUDIT-016 — Sartorial Edition, auditoría comercial en vivo anterior a remediación

ID: `GPT-AUDIT-016`
Estado: **NO APTO en el estado observado el 30 de septiembre de 2026**. Esta evidencia es anterior a cualquier remediación posterior y no certifica el estado actual.
Decisión requerida: Gemini y Johandry deben corregir catálogo, navegación, contenido legal/comercial y pasarela de prueba; después solicitar verificación cruzada en vivo.
Resumen en 5 líneas:
1. La portada y la propuesta industrial tienen una dirección visual reconocible; el recorrido móvil de 390 px no mostró desbordamiento horizontal en ocho rutas.
2. La foto de 11 de 13 productos contradice de forma clara el nombre o la especificación visible; otra (Structured Tote) muestra un color distinto al seleccionado.
3. `/collections/desk-and-study` devuelve HTTP 404 pese a estar enlazada desde el Bento principal.
4. La cápsula agrega tres variantes por $620 y el carrito recalcula bien al actualizar cantidades; Quick Buy agregó una pieza individual.
5. El checkout indica “This store can’t accept payments right now” y deshabilita “Pay now”.
Archivos tocados: solo este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna; auditoría sin cambios de tema ni configuración.
Hallazgos extra fuera de alcance (con parche listo): ninguno; los cambios de catálogo/configuración necesitan directiva de Gemini.
Verificación (comando, resultado y qué demuestra/qué no): ver las pruebas reproducibles abajo. No se probó una compra completa ni pasarela Bogus Gateway.
Lista de afirmaciones falsables numeradas: 1) Desk and Study responde 404; 2) 13 fichas tienen una sola imagen; 3) el set agrega $620; 4) el carrito recalcula a $775 al duplicar Valet Tray; 5) Quick Buy suma Key Loop y llega a $840; 6) checkout bloquea pago; 7) a 390 px no hubo scroll horizontal en ocho rutas.

## Metodología y alcance

- Tienda: <https://sartorial-edition.myshopify.com>, sesión pública con acceso de demo proporcionado por el usuario. Se usó una pestaña nueva de Playwright; no se editó la tienda.
- Inspección de portada, las colecciones `/collections/all`, `/collections/daily-objects`, `/collections/desk-and-study`, `/collections/leather-goods`; las 13 PDP; contacto; carrito; checkout hasta antes del pago. Se inspeccionó el JSON público `/products/{handle}.js` de cada producto para verificar variantes, precios e imágenes.
- Captura visual del catálogo completo: `.playwright-mcp/page-2026-09-30T16-19-50-348Z.png`, tras desplazar cada tarjeta y decodificar las imágenes. Capturas móviles: `.playwright-mcp/page-2026-09-30T16-25-42-745Z.png` (hero), `.playwright-mcp/page-2026-09-30T16-26-04-099Z.png` (Bento) y `.playwright-mcp/page-2026-09-30T16-26-25-086Z.png` (colección). Son artefactos locales no versionados y pueden desaparecer; las URL y nombres CDN abajo son la evidencia estable.
- Tamaños: escritorio 1020 px para el catálogo y 1440 px para Maison; móvil simulado 390 × 844 px. Se inspeccionó Maison en portada a 1440 px. No se terminó la PDP de Maison por límite de uso del navegador; no se extrapola su checkout ni rendimiento.
- Cada observación visual distingue el objeto visible del derecho de imagen. Un monograma de otra marca es visible; la titularidad/licencia no fue verificada.

## Matriz de los 13 productos

Todas las URL empiezan por `https://sartorial-edition.myshopify.com/products/`. La imagen indicada es la única del producto en `/products/{handle}.js`; **ninguna variante tiene `featured_image` propia**. Todos los productos figuraban `available: true` y mostraban “In stock, ready to ship” en la PDP observada. Las descripciones contienen medidas y materiales, pero una foto ajena a la pieza impide validarlos visualmente.

| Producto y handle | Precio y variantes verificadas | Foto observada frente al título | Archivo CDN principal |
|---|---|---|---|
| [Compact Crossbody](https://sartorial-edition.myshopify.com/products/compact-crossbody) | $425; 3 acabados | Bolso negro con monograma **GG** dorado. No acredita ser un bolso propio de Sartorial; marca de tercero visible. | `photo-1548036328-c9fa89d128fa.jpg` |
| [East-West Shoulder Bag](https://sartorial-edition.myshopify.com/products/east-west-shoulder-bag) | $590; 3 acabados | Bolso naranja con cuerpo trenzado y asa rígida; no se corresponde con el ejemplar liso “Black box calf” seleccionado. | `photo-1590874103328-eac38a683ce7.jpg` |
| [Folded Valet Tray](https://sartorial-edition.myshopify.com/products/folded-valet-tray) | $155; 3 acabados | Mujer sosteniendo carpeta naranja, no una bandeja de cuero. | `photo-1544717305-2782549b5136.jpg` |
| [Four-Slot Cardholder](https://sartorial-edition.myshopify.com/products/four-slot-cardholder) | $95; 3 acabados | Mano con tarjeta de pago ante una laptop; no se ve el tarjetero anunciado. | `photo-1563013544-824ae1b704d3.jpg` |
| [Leather Desk Mat](https://sartorial-edition.myshopify.com/products/leather-desk-mat) | $260 Compact / $310 Large; 4 variantes | Mano dibujando sobre papel; no se ve la alfombrilla de cuero. | `photo-1581291518857-4e27b48ff24e.jpg` |
| [Leather Document Folio](https://sartorial-edition.myshopify.com/products/leather-document-folio) | $370; 2 acabados | Mochila rosada, no folio A4 de cuero. | `photo-1622560480605-d83c853bc5c3.jpg` |
| [Leather Key Loop](https://sartorial-edition.myshopify.com/products/leather-key-loop) | $65; 3 acabados | Modelo con vestido plateado; no se ve el llavero. | `photo-1582533561751-ef6f6ab93a2e.jpg` |
| [Milled Brass Paperweight](https://sartorial-edition.myshopify.com/products/milled-brass-paperweight) | $110; 2 acabados | Pintura de una persona escribiendo; no se ve el disco de latón. | `photo-1584727638096-042c45049ebe.jpg` |
| [Padded Laptop Sleeve](https://sartorial-edition.myshopify.com/products/padded-laptop-sleeve) | $345; 2 acabados | Bolsa tote de papel/canvas marrón, no funda acolchada para laptop. | `photo-1544816155-12df9643f363.jpg` |
| [Single Pen Sleeve](https://sartorial-edition.myshopify.com/products/single-pen-sleeve) | $85; 2 acabados | Bolígrafo aislado; no se ve una funda de cuero. | `photo-1583485088034-697b5bc54ccd.jpg` |
| [Slim Bifold Wallet](https://sartorial-edition.myshopify.com/products/slim-bifold-wallet) | $165; 2 acabados | Cartera de cuero: tipo de objeto compatible. No se verificó que tenga seis ranuras. | `photo-1627123424574-724758594e93.jpg` |
| [Structured Tote in Calfskin](https://sartorial-edition.myshopify.com/products/structured-tote) | $580 Compact / $680 Standard; 6 variantes | Tote marrón, aunque la selección inicial dice “Black box calf”; al seleccionar “Deep olive / Compact” ($580), la imagen permanece idéntica. | `structured-tote-01.jpg` |
| [Zip Travel Pouch](https://sartorial-edition.myshopify.com/products/zip-travel-pouch) | $245; 3 acabados | Mochila azul, no neceser/pouch de cuero. | `photo-1553062407-98eeb64c6a62.jpg` |

La matriz no afirma que las fotos estén rotas: tras cargarlas, `naturalWidth` fue positivo para todas las del catálogo. El problema es **correspondencia producto–imagen** y, en el primer caso, la presencia visible de un monograma ajeno. La licencia y origen de cada imagen requieren comprobación documental de Johandry.

## Hallazgos priorizados

### P0 — bloqueo comercial o de recorrido

1. **Catálogo visualmente engañoso.** La mayoría de fotografías representan otra clase de artículo, mientras el texto declara material, dimensiones y variantes de un producto distinto. Afecta portada Bento, listado, PDP, Quick Buy, cápsula y miniaturas de carrito/checkout. Dueño: Johandry para activos/licencias y Gemini para coordinar sustitución y prueba. Prioridad previa al envío.
2. **Colección anunciada inexistente.** `GET /collections/desk-and-study` respondió `404`; el enlace “Objects for the desk” en portada apunta allí. El JSON de varios productos lleva tag `desk-and-study`, pero no hay colección publicada en esa ruta. Dueño: Johandry/Gemini.
3. **Checkout sin pago de prueba.** El checkout mostró “This store can’t accept payments right now”; `Pay now` tenía `disabled: true`. No se completó pedido. Dueño: Johandry, configuración de tienda/pasarela.

### P1 — confianza, navegación y promesas

4. **Contenido de confección reutilizado en objetos.** En la PDP del tote y del pisapapeles, `Composition & care` dice “Follow the care label sewn into each piece”, “Store knitwear folded; hang tailoring and outerwear...”. `Shipping & complimentary returns` se refiere a “unworn pieces with their tags in place”. Es incoherente con latón y objetos de escritorio. Dueño: Gemini/Claude si es contenido de preset; Johandry si es configuración de la demo. Confirmar origen antes del parche.
5. **Políticas insuficientes.** En la inspección directa, `/policies/refund-policy`, `/policies/shipping-policy` y `/policies/terms-of-service` respondieron 404; `/policies/privacy-policy` sí respondió 200. El footer visible solo enlaza “Search” y “Powered by Shopify”. El contacto existe en `/pages/contact`, pero no aparece como enlace de pie. La PDP promete devoluciones y remite a “our store policy” sin ruta verificable. Dueño: Johandry para políticas, Gemini para exposición en navegación.
6. **Promesas de despacho incompatibles.** Featured Product en home dice “Worldwide express courier | Dispatch in 24 hours”; contacto FAQ dice “Available pieces leave the atelier within three business days”; acordeón PDP dice “Pieces in stock leave within three business days”. Resolver una promesa comprobable. Dueño: Johandry.
7. **Navegación de catálogo poco explícita.** Menú principal: Home, Catalog, Contact; footer: Search. La pestaña de selección “Workspace” en home enlaza `/collections/all`, no a `desk-and-study`; “Limited studies” enlaza `/collections/leather-goods`, una taxonomía distinta. En Edition la selección comunica categorías que no tienen rutas equivalentes. Dueño: Gemini/Johandry.
8. **Las variantes carecen de evidencia visual.** Cada ficha tiene solo una imagen y ninguna variante un media asignado. La reactividad de precio sí funciona: en el tote, seleccionar Deep olive/Compact actualizó URL a `?variant=67582164009128` y precio de $680 a $580, pero no cambió la foto. Dueño: Johandry para media de variantes.

### P2 — pulido y conversión

9. **Una sola imagen por PDP** limita inspección de material, escala, interior, reverso, cierres y color. Zoom está disponible, pero amplía la misma fotografía. No hay guía de materiales específica de producto. Las recomendaciones no aparecieron como bloque curado en el DOM inicial de las 13 PDP; después de navegar varias páginas apareció “Recently viewed” con cuatro piezas. No atribuir a la tienda una recomendación semántica que no se observó.
10. **Portada y móvil tienen fortalezas reales.** Hero dividido con tipografía clara, Bento de escritorio, set de $620, featured tote y nota de materiales; a 390 px se apilan en secuencia legible. No se detectó desbordamiento horizontal en `/`, `/collections/all`, `/collections/daily-objects`, `/collections/leather-goods`, `/products/structured-tote`, `/products/leather-desk-mat`, `/cart`, `/pages/contact` (`innerWidth:390`, `documentElement.scrollWidth:375`). No se midieron Core Web Vitals, contraste o accesibilidad con axe.

## Pruebas funcionales observadas

| Prueba | Acción y salida literal relevante | Alcance |
|---|---|---|
| Colecciones | `page.goto('/collections/all')` → `status:200`, “13 products”; `daily-objects` → `200`, “8 products”; `desk-and-study` → `404`, “Object not found.”; `leather-goods` → `200`, “10 products”. | Rutas live en esta sesión. |
| Filtro/sort móvil | A 390 px, ordenar precio ascendente dio `?sort_by=price-ascending` y empezó por Key Loop $65. Filtro To $100 dio `?filter.v.price.lte=100&sort_by=price-ascending`, “3 products”: Key Loop $65, Pen Sleeve $85, Cardholder $95. | Filtro de precio y ordenación probados; disponibilidad no se manipuló. |
| Cápsula | Carrito inicialmente vacío (`/cart.js`: `items:[]`, `total:0`). Clic en “Add 3 pieces to bag | $620.00” → Valet Tray Black $155, Cardholder Black box calf $95, Document Folio Black box calf $370; `total:62000`. | Set por suma de tres productos, no descuento; miniaturas erróneas persisten. |
| Cantidad | En `/cart`, clic “Increase quantity for Folded Valet Tray”, luego “Update cart” → cantidad 2 y `total:77500`, visible `$775.00 USD`. | Sin pulsar Update, el input mostraba 2 pero `/cart.js` seguía en $620; comportamiento de formulario, no fallo. |
| Quick Buy | En `/collections/all?filter.v.price.lte=100&sort_by=price-ascending`, Quick add abrió diálogo con Black/Saddle tan/Deep olive; clic Black → Key Loop agregado, carrito 5 unidades y `total:84000`, drawer `$840.00 USD`. | Mobile 390 px. |
| Checkout | Desde carrito, checkout cargó pedido de 4 unidades con subtotal `$775.00`; mensaje exacto “This store can’t accept payments right now”; botón “Pay now” deshabilitado. | Hasta antes de pagar. No se probó dirección ni shipping rate. |
| Nota de pedido | Drawer y `/cart` observados no mostraron input de nota. | No se afirmó ausencia en otras configuraciones. |
| Imágenes rotas | Tras desplazar y decodificar las 13 tarjetas de `/collections/all`: `loaded:[]` para imágenes con `naturalWidth===0`. | No equivale a auditoría de todos los recursos de red. |

## Comparación acotada con Maison

En <https://maison-10oym9w0.myshopify.com/> a 1440 px se observó un hero de cerámica fotografiada coherente con “Made by hand, fired in small batches”, un menú lateral con Catalog, tres colecciones, About us y Contact, y contenido de proceso concreto (“Throwing”, “Trimming”, “Glazing”, “Firing”, “Six glazes, mixed here”). Edition tiene un lenguaje gráfico original y un set comercial funcional, pero Maison comunica con más precisión **qué es el producto, cómo se hace y por dónde navegar**. Esta comparación se limita a portada/navegación; la PDP y checkout de Maison quedaron sin verificar.

## Límites y pendientes

- El bloqueo posterior del navegador fue: “You’ve hit your usage limit… The action was not executed because automatic approval review could not be completed. Do not bypass the approval check”. No se continuaron pruebas live por otra vía.
- No se verificó el Tote de Atelier ni su relación fotográfica con el Tote de Edition; comparar similitud/diferenciación entre demos queda pendiente.
- No se verificaron legalmente las licencias de fotografías, la identidad del artículo físico, inventario real, tarifas de envío ni compra completa.
- Este informe no cierra ni modifica filas del ledger. Solo informa a Gemini de condiciones observadas para una nueva verificación tras remediación.
