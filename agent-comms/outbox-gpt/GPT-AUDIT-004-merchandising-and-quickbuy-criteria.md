# GPT-AUDIT-004: Estrategia de demos, merchandising y criterios Quick Buy

ID: GPT-AUDIT-004-merchandising-and-quickbuy-criteria
Estado: ENTREGADO PARA DECISION DE GEMINI Y EJECUCION POSTERIOR.
Decision requerida: aprobar la topologia de tres Client transfer stores mas una dev store de QA, los segmentos comerciales de Edition/Archive y esta matriz como Gate de producto del Sprint 5A.
Resumen en 5 lineas:
1. Las demos oficiales deben vivir en tres Client transfer stores independientes; una cuarta dev store debe conservar el catalogo hostil de pruebas.
2. El mismo commit y ZIP son la base de las tres demos, mientras `/listings/<preset>/` y un manifiesto de paridad controlan estructura, color, tipografia y comportamiento inicial.
3. Edition se posiciona en Home con 24 objetos contemporaneos sin modelos humanos; Archive en Bags con 24 piezas de cuero numeradas y lenguaje documental.
4. Quick Buy solo puede ser realmente rapido cuando no adivina opciones: una variante se agrega; talla/color requieren eleccion explicita; planes, gift cards y catalogos complejos tienen fallback seguro.
5. El CartDrawer debe confirmar variante/precio/cantidad, recalcular el umbral de $150 y preservar notas; el cross-sell nunca puede desplazar el checkout ni sugerir una variante invalida.

Archivos tocados: exclusivamente este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementacion. Se corrige una premisa operativa: Shopify pide Client transfer stores para las demos oficiales, no dev stores ordinarias.
Hallazgos extra fuera de alcance (con parche listo): ninguno de codigo. La accion externa pendiente es crear las tiendas y el registro de activos/licencias.
Verificacion: se leyeron la directiva GPT-TASK-004, `BOARD.md` y `RULES.md`; se contrasto la estrategia con documentacion oficial vigente de Shopify. No se audito el codigo aun en ejecucion de Claude.
Ledger: este documento no cierra filas. `Presets Diferenciados` y Sprint 5A siguen en `codigo completo` o estado abierto hasta Gate 5.

## 1. Dictamen

Apruebo la estrategia de tres presets con una condicion no negociable: **cada preset debe funcionar como una empresa creible, no como la misma tienda recoloreada**. La diferenciacion debe aparecer en catalogo, fotografia, taxonomia, PDP, coleccion y microcopy, no solo en home.

Para Quick Buy y swatches, la regla comercial central es esta:

> La imagen que el comprador ve puede ser una previsualizacion; la variante que se agrega solo puede ser la seleccion comprometida y anunciada.

Si la implementacion no puede garantizar esa identidad bajo clic rapido, hover, cambio de talla y respuesta lenta, no pasa Sprint 5A.

## 2. Arquitectura oficial de demos

### 2.1 Topologia recomendada

| Entorno | Tipo de tienda | Funcion | Preset/catalogo |
| --- | --- | --- | --- |
| Demo 1 | Client transfer store | URL oficial de listing | Sartorial / Clothing / 24 productos |
| Demo 2 | Client transfer store | URL oficial de listing | Edition / Home / 24 productos |
| Demo 3 | Client transfer store | URL oficial de listing | Archive / Bags / 24 productos |
| QA hostil | Development store | Automatizacion, red, variantes y estados degenerados | Fixtures F01-F12 de este informe |

Shopify indica que las demos de presets se creen como **Client transfer stores** desde Partner/Dev Dashboard. La development store sigue siendo correcta para probar el ZIP, pero no debe sustituir las tres demos enlazadas en la submission. Cada preset genera su propia ficha de Theme Store y necesita una demo completa.

### 2.2 Flujo de release y paridad

1. Congelar un commit candidato y etiquetarlo internamente, por ejemplo `sartorial-v1.0.0-rc1`.
2. Ejecutar las compuertas, crear **una sola vez** `Sartorial-1.0.0.zip` con Shopify CLI y registrar SHA-256, commit, fecha e inventario.
3. Subir ese mismo artefacto base a las tres Client transfer stores. No editar Liquid/CSS/JS desde el editor de codigo de Shopify.
4. Materializar en cada demo su preset y las plantillas equivalentes a `listings/sartorial`, `listings/edition` o `listings/archive`.
5. Bloquear como fuente de verdad los valores de layout, tipografia, color, orden de secciones, grid, media layout y toggles comerciales.
6. Permitir diferencias solo de contenido merchant: imagenes, handles de productos/colecciones, menus, textos editoriales, politicas y datos de tienda.
7. Descargar/exportar el tema de cada demo y comparar un manifiesto normalizado contra el preset del ZIP. Cero diferencias no autorizadas en los campos bloqueados.
8. En la dev store hostil, hacer tres instalaciones limpias y secuenciales; cada una debe reproducir el preset sin copiar ajustes desde una demo ya curada.
9. Ejecutar Gate 5 a 1440 px y 390 px sobre home, coleccion, PDP, carrito, busqueda y checkout de prueba.
10. Solo entonces capturar los screenshots de listing y congelar las demos hasta que termine la revision.

La materializacion reproducible puede automatizarse despues por Claude, pero el contrato es simple: `/listings/<preset>/templates` es la fuente estructural; `settings_data.json.presets.<Preset>` es la fuente visual; los datos de Shopify son contenido reemplazable.

### 2.3 Manifiesto de paridad por demo

Cada demo debe tener un registro versionado con:

| Campo | Criterio |
| --- | --- |
| Release | commit, tag, nombre del ZIP y SHA-256 |
| Tienda | URL, store ID, theme ID y preset |
| Listing | industria primaria, catalog size y tagline |
| Plantillas | hash/estructura normalizada de index, collection y product |
| Sistema visual | fuentes, escalas, cinco esquemas, page width, gutter, spacing y radios |
| Features | toggles del header, cart, cards, media y quick buy |
| Contenido permitido | imagenes, copy, menus y referencias a recursos de la tienda |
| Localizacion | EN y ES completos si ambos aparecen en la demo |
| Activos | origen, licencia, autor y permiso comercial de cada imagen/video |
| QA | fecha, navegador, viewport, Lighthouse/axe y resultado de checkout de prueba |

No usar apps para simular funciones del tema. Bogus Gateway o Shopify Payments en test mode debe ser el unico camino de pago habilitado durante la revision. El demo debe usar texto autentico, sin Lorem Ipsum, onboarding copy ni botones incrustados dentro de imagenes.

### 2.4 Material para la ficha de Theme Store

Shopify solicita una captura desktop y una movil por preset. Preparar para cada demo:

- Desktop: `2000 x 2496 px` recomendado; `1000 x 1248 px` tambien es valido.
- Mobile: `750 x 1334 px`.
- Sin navegador, fondos de escritorio, overlays de anotacion ni texto agregado fuera del storefront.
- Alt text especifico para cada captura.
- Tres highlights distintos por preset y un video de menos de dos minutos solo cuando muestre interaccion real.

Taglines propuestas, verificadas por debajo de 70 caracteres:

| Preset | Tagline | Caracteres |
| --- | --- | ---: |
| Sartorial | Editorial tailoring designed to sell the complete look. | 55 |
| Edition | A precise gallery for contemporary objects and accessories. | 59 |
| Archive | A documentary storefront for numbered leather goods. | 52 |

## 3. Estrategia de merchandising por preset

### 3.1 Fronteras que no deben cruzarse

| Dimension | Sartorial | Edition | Archive |
| --- | --- | --- | --- |
| Industria | Clothing | Home | Bags |
| Hero | Cuerpo, movimiento, silueta | Un objeto aislado y su geometria | Pieza catalogada, taller y procedencia |
| Personas | Modelos editoriales completos | Ninguna persona ni mano | Manos del artesano permitidas; sin pasarela |
| Luz | Suave, arquitectonica, calida-neutral | Neutra/fria, precisa, sombras definidas | Luz norte calida, grano y textura documental |
| Copy | Proporcion, tactilidad, forma de vestir | Funcion, medida, acabado, sistema | Entrada, lote, ano, origen, fabricante |
| Venta agrupada | Complete the look | Build the working set | Assemble the field set |
| Card/PDP | Moda y fit | Objeto, dimensiones, finish | Miniaturas, vendor/maker, provenance |

### 3.2 Edition: catalogo y taxonomia

**Objetivo comercial:** demostrar que Sartorial sirve a un estudio de diseno contemporaneo sin apoyarse en moda, rostros o storytelling de pasarela.

| Coleccion | Productos | Ejemplos |
| --- | ---: | --- |
| Desk forms | 5 | Arc Pen, Fold Tray 02, Column Lamp, Grid Ruler, Counterweight Stand |
| Carry systems | 4 | Modular Tech Folio, Cable Sleeve, Transit Pouch, Laptop Envelope |
| Ceramic studies | 4 | Vessel 04, Pouring Cup, Low Bowl, Stack Carafe |
| Optical objects | 3 | Frame 01, Frame 02, Folding Case |
| Small leather | 5 | Card Case, Key Fold, Passport Folio, Phone Sleeve, Coin Form |
| Limited studies | 3 | Numbered metal/ceramic collaborations |
| **Total** | **24** | Catalog size `Some (11-100+)` |

Cobertura comercial obligatoria dentro de esos 24 productos:

- Un producto de variante unica y otro completamente agotado.
- Un producto en oferta con compare-at price.
- Un producto Color x Size/Dimension con combinaciones no disponibles.
- Un producto con 7 finishes para probar swatches y `+N`.
- Un objeto con video y modelo 3D real.
- Un producto con 10 imagenes y otro sin imagen secundaria.
- Una gift card y un producto con unit price si la categoria lo admite.

**Direccion fotografica Edition**

- Fondo blanco, gris frio, aluminio o concreto claro; no beige editorial de moda.
- Temperatura coherente aproximada de 5200-5600 K y color calibrado para que los swatches correspondan al producto.
- Planos cenitales de 90 grados, vistas frontales/ortograficas, perfil y macro de uniones.
- Sombras limpias y deliberadas; 25-35% de espacio negativo.
- Cards en 4:5 o 1:1 por coleccion, sin mezclar ratios arbitrariamente.
- Cero modelos, manos, flores decorativas o lifestyle domestico generico.
- Cada finish necesita una imagen de variante equivalente en angulo y escala.
- Alt text factual: objeto, material, acabado y vista; nunca repetir el titulo sin contexto.

**Tono Edition**

- Titulos: `Fold Tray 02`, `Column Lamp`, `Vessel 04`; cortos y sistematicos.
- Eyebrows: `OBJECT / 04`, `MATERIAL / BRUSHED ALUMINIUM`, `STUDY / 02`.
- Descripcion en tres bloques: proposito, material/proceso, dimensiones/cuidado.
- Frases breves, voz precisa y sin superlativos. Evitar `timeless`, `luxurious`, `elevated` y cualquier lenguaje de moda.
- Microcopy ejemplo: `A shallow tray folded from a single sheet of aluminium. Bead-blasted, anodised and assembled without visible fasteners.`

Highlights de listing: object-first merchandising; finish-aware swatches; dimension-led product pages.

### 3.3 Archive: catalogo y taxonomia

**Objetivo comercial:** vender una casa de cuero y objetos patrimoniales documentados, no una segunda boutique de sastreria calida.

| Coleccion | Productos | Ejemplos |
| --- | ---: | --- |
| Numbered bags | 6 | Field Satchel 1987, Document Case 017, Weekender 04, Tool Bag 12 |
| Small leather | 5 | Ledger Wallet, Archive Card Case, Key Bell, Passport Case, Coin Fold |
| Straps and rolls | 4 | Bridle Belt, Watch Roll, Camera Strap, Luggage Strap |
| Workshop objects | 3 | Leather Desk Mat, Tool Wrap, Correspondence Box |
| Garment studies | 3 | Makers Apron 03, Archive Coat, Workshop Vest |
| One-of-N releases | 3 | Series of 25/40/60 numbered pieces |
| **Total** | **24** | Catalog size `Some (11-100+)` |

Cada producto debe exponer de forma autentica cuando aplique:

- Archive reference y numero de serie, por ejemplo `017 / 060`.
- Ano de introduccion o manufactura; no inventar antiguedad si es una pieza nueva.
- Taller/maker y lugar de fabricacion.
- Origen del cuero o tejido, tipo de curtido y hardware.
- Construccion, numero de puntadas o tecnica relevante.
- Dimensiones, peso, cuidado, reparabilidad y comportamiento de la patina.
- Lote, disponibilidad y certificado, sin crear una falsa promesa de inversion o rareza.

**Direccion fotografica Archive**

- Luz norte difusa, aproximadamente 4200-4800 K; sombras suaves pero textura visible.
- Superficies de madera, lino crudo, papel de archivo, metal de taller y oliva mate.
- Contact sheets, etiquetas fisicas, herramientas, cantos, costuras y pletinas como evidencia visual.
- Manos del artesano y proceso son validos; evitar modelos de pasarela, poses de moda o fondos arquitectonicos de Sartorial.
- Hero 3:2 documental; cards 4:5 consistentes; PDP con miniaturas y series de detalle.
- El numero puede aparecer si esta fisicamente grabado en el producto. No incrustar labels o CTA en la fotografia.
- Mostrar el mismo cuero nuevo y con patina solo si la comparacion es honesta y esta identificada.

**Tono Archive**

- Titulos: `Document Case 017`, `Field Satchel 1987`, `Makers Apron 03`.
- Eyebrows: `CATALOGUE ENTRY / 017`, `WORKSHOP RECORD / 06`, `SERIES / 25`.
- Copy con fecha, lugar, maker y material antes de la promesa emocional.
- Evitar nostalgia generica: `heritage`, `timeless craft` o `made to last` sin datos que lo sostengan.
- Microcopy ejemplo: `Entry 017. Cut in the Porto workshop from vegetable-tanned hide, then saddle stitched with linen thread. The surface darkens through handling.`

Highlights de listing: provenance-led catalog; numbered series; documentary material galleries.

## 4. Fixtures obligatorios para Sprint 5A

La auditoria de Claude debe ejecutarse sobre datos reales en la dev store, no mocks aislados.

| ID | Producto fixture | Configuracion minima |
| --- | --- | --- |
| F01 | Simple available | 1 variante, disponible, una imagen |
| F02 | Simple sold out | 1 variante, `available=false` |
| F03 | Size only | S/M/L/XL; M agotada |
| F04 | Color x Size | 6 colores x 4 tallas, imagen por color, precios mixtos y combinaciones inexistentes |
| F05 | Native swatches | 7 valores: `swatch.image`, `swatch.color` y un valor sin swatch |
| F06 | Required plan | Variante que exige selling plan |
| F07 | Optional plan | Compra unica mas suscripcion |
| F08 | Gift card | Recipient fields activos en PDP |
| F09 | Sale and unit price | Compare-at, descuento y unit price |
| F10 | Hostile card | Titulo 150 caracteres, vendor largo, sin imagen secundaria y precio largo |
| F11 | Many variants | 50 variantes y cambios rapidos de opcion |
| F12 | High variant/combined | Mas de 250 variantes o `product_option_value.product_url`; fallback verificable |

## 5. Matriz de aceptacion Quick Buy

`P0` bloquea Sprint 5A. `P1` debe corregirse antes del release candidate. `P2` es pulido que puede entrar en el siguiente sprint si no degrada el flujo.

| ID | Sev. | Escenario y accion | Resultado aceptable y evidencia |
| --- | --- | --- | --- |
| QB-01 | P0 | F01, activar Quick Buy | Una sola peticion agrega cantidad 1; no abre selector inutil; drawer confirma titulo, imagen, precio y cantidad. |
| QB-02 | P0 | F02 | CTA muestra agotado, no es accionable y no se emite `/cart/add`. |
| QB-03 | P0 | F03 | Abre selector y exige talla explicita; nunca adivina la primera talla disponible. |
| QB-04 | P0 | Elegir M agotada en F03 | M permanece visible como no disponible, se anuncia y no puede enviarse. |
| QB-05 | P0 | F04, elegir Blue + L | ID, imagen, precio y opciones de la linea en carrito corresponden exactamente a Blue/L. |
| QB-06 | P0 | F04, cambiar color despues de elegir talla | Conserva talla si la combinacion existe; si deja de existir, invalida la seleccion y bloquea Add. |
| QB-07 | P0 | Variante con precio/compare-at distinto | Card/selector actualizan precio y sale state antes de habilitar Add; carrito coincide con respuesta del servidor. |
| QB-08 | P0 | Doble clic/tap rapido en Add | Un gesto logico produce una sola alta; boton queda pending y no duplica cantidad. |
| QB-09 | P0 | Cambiar swatch/talla durante request | No se envia una segunda alta ni cambia silenciosamente la variante pendiente; el feedback nombra la agregada. |
| QB-10 | P0 | Respuesta 429/500/503 con HTML | Mensaje localizado, sin `SyntaxError`, sin falso exito, estado previo del carrito intacto y CTA recuperable. |
| QB-11 | P0 | F06 selling plan requerido | No agrega sin `selling_plan`; abre selector completo si existe o enlaza al PDP con copy claro. |
| QB-12 | P1 | F07 plan opcional | Compra unica solo es valida si se identifica como tal; de otro modo debe abrir opciones/PDP. |
| QB-13 | P0 | F08 gift card | Fallback al PDP para completar recipient; Quick Buy no omite datos del regalo. |
| QB-14 | P0 | F12 >250 variantes | No serializa un mapa truncado; muestra `View options`/PDP y conserva rendimiento. |
| QB-15 | P0 | F12 combined listing | Un `product_url` navega o carga el producto asociado; nunca trata otro producto como variante del actual. |
| QB-16 | P1 | JavaScript desactivado | El control se degrada a enlace/PDP o formulario nativo valido; no queda un boton muerto. |
| QB-17 | P0 | Ruta `/es/collections/all` | Add y enlaces conservan locale mediante rutas de Shopify; mensajes aparecen en espanol. |
| QB-18 | P0 | Cerrar selector con Escape | Se cierra el dialogo correcto y el foco vuelve al Quick Buy que lo abrio. |
| QB-19 | P0 | Navegacion solo teclado | Orden logico, foco visible, opciones operables, Enter/Space correctos y sin salida del focus trap. |
| QB-20 | P1 | F10 a 390 px, grid de 2 columnas | Sin overflow, titulo no tapa precio/CTA y todos los controles interactivos alcanzan 44 x 44 px. |

## 6. Matriz de aceptacion Swatches

### Contrato de interaccion

- `hover` en escritorio **previsualiza** la imagen, pero no cambia la variante comprometida ni el ID del formulario.
- `pointerleave` restaura la imagen de la seleccion comprometida.
- `click`, tap o activacion por teclado **confirma** el color; entonces cambian selected state, imagen, precio y disponibilidad.
- En movil no existe hover: un tap confirma el color; Add sigue siendo una accion separada.
- La seleccion comprometida debe tener una marca visual distinta del preview y un nombre textual accesible.

| ID | Sev. | Escenario y accion | Resultado aceptable y evidencia |
| --- | --- | --- | --- |
| SW-01 | P0 | F05 con imagen/color/nil | Usa datos nativos de Shopify; `nil` cae a label textual, nunca inventa un hex desde el nombre. |
| SW-02 | P0 | Hover sobre color no seleccionado | Solo cambia preview; precio, `aria-checked` e ID de variante no cambian. |
| SW-03 | P0 | Salir del hover | Restaura imagen seleccionada sin flash, CLS ni estado residual. |
| SW-04 | P0 | Click/tap en otro color | Confirma una unica seleccion, actualiza imagen/alt/precio/disponibilidad y anuncia el color. |
| SW-05 | P0 | Teclado sobre swatches | Grupo con nombre, valor completo, selected/unavailable perceptibles y activacion estandar. |
| SW-06 | P0 | Color totalmente agotado | Sigue identificable, aparece no disponible y no conduce a Add valido. |
| SW-07 | P0 | Color con algunas tallas agotadas | Al confirmarlo se recalculan las tallas disponibles sin habilitar combinaciones inexistentes. |
| SW-08 | P1 | Imagen de variante ausente | Mantiene imagen valida anterior o featured image; nunca muestra bloque roto. |
| SW-09 | P1 | Carga rapida A -> B -> C | La respuesta tardia de A/B no reemplaza la imagen final C. |
| SW-10 | P0 | Card movil 2 columnas a 390 px | 2 swatches visibles + `+N`; cada control 44 x 44 px y sin overflow. |
| SW-11 | P1 | Card >=260 px o movil 1 columna | 4 swatches visibles + `+N`; el contador refleja exactamente los ocultos. |
| SW-12 | P0 | Activar `+N` | Abre el selector completo de Quick Buy/PDP; no es texto muerto ni expande el grid de forma impredecible. |
| SW-13 | P0 | Filtro de color con 12 valores | Wrap o Show more/less accesible, 44 px, conteos correctos y sin scroll horizontal de pagina. |
| SW-14 | P0 | Seleccionar/limpiar filtro swatch | URL/resultados/count se actualizan; el valor seleccionado persiste tras rerender y Clear all lo elimina. |
| SW-15 | P0 | Filtro vs card swatch | Filtrar no confirma una variante de card; ambos estados permanecen semanticamente separados. |
| SW-16 | P1 | Rendimiento con 24 cards x 7 colores | No precarga todas las imagenes a resolucion completa ni genera una peticion por swatch antes de interaccion. |

El limite `2 +N` en grid movil de dos columnas es deliberado: tres swatches mas el contador no caben honestamente si cada objetivo tactil mide 44 px. En filtros no se usa un `+N` opaco; se usa `Show more/less` porque cada valor debe poder descubrirse.

## 7. CartDrawer: confianza y conversion post-Quick Buy

### 7.1 Secuencia de feedback

Tras un Add exitoso, el drawer debe:

1. Abrirse solo despues de confirmacion del servidor.
2. Anunciar `Producto, variante y cantidad añadidos` en live region.
3. Mostrar la nueva linea con imagen de variante, Color/Talla, precio unitario, cantidad y final line price.
4. Actualizar cart count, subtotal, descuentos y progreso de envio desde el carrito fresco.
5. Mantener checkout completo dentro del viewport y foco dentro del drawer.
6. Restaurar foco al disparador al cerrar.

No mostrar toast de exito y drawer compitiendo por foco. El drawer es la confirmacion principal.

### 7.2 Umbral de envio gratis de $150

La barra es util si representa una politica real; es destructiva si promete envio que Shopify luego cobra.

| Estado de prueba USD | Mensaje esperado |
| --- | --- |
| Carrito $0 | `Add $150.00 for complimentary shipping` |
| Carrito $149 | `Add $1.00 for complimentary shipping` |
| Carrito $150 | Estado completo, nunca `$0 away` |
| Carrito $151+ | Sigue completo; barra limitada a 100% |
| Descuento baja $160 a $140 | Revierte a `$10 away` usando total fresco |
| Quitar/cambiar linea | Recalcula una vez, sin parpadeo ni valor negativo |

Criterios adicionales:

- El umbral debe venir de un setting documentado, no de un segundo `15000` oculto en JS.
- Calculo en minor units y formato con `shop.money_format`; cero `Intl.NumberFormat` manual.
- En Markets, el mensaje y umbral deben corresponder a la moneda/politica aplicable. Si no se puede garantizar conversion, ocultar la promesa fuera del mercado configurado.
- Aclarar si se calcula antes de shipping/tax y sobre total despues de descuentos.
- No contar gift cards o productos no enviables como garantia de una tarifa real sin una regla merchant explicita.

### 7.3 Notas de pedido

Las notas aportan confianza para regalo/instrucciones, pero son secundarias:

- Colapsadas por defecto o debajo de las lineas; nunca por encima del checkout.
- Label visible y copy neutral, no placeholder como unica etiqueta.
- El borrador `data-dirty` sobrevive a Quick Buy, cambio de cantidad, cross-sell y rerender.
- Guardado con estado claro; error de red no borra el texto.
- Cerrar/reabrir el drawer conserva la nota confirmada por servidor.
- La nota vacia no bloquea checkout.

### 7.4 Cross-sell

Para un tema de lujo, menos es mas:

- Mostrar 1-2 sugerencias realmente complementarias, preferiblemente relaciones nativas configuradas por merchant.
- Excluir el producto actual, productos ya en carrito, agotados y variantes que exijan plan no soportado.
- Mostrar imagen, titulo, precio, disponibilidad y opcion necesaria antes de agregar.
- No preseleccionar ni agregar automaticamente.
- Despues del add, actualizar linea, subtotal, cart count y barra de $150 desde respuesta fresca.
- En 390 px, las sugerencias viven en el area scrollable; subtotal y checkout permanecen visibles.
- Si no hay recomendacion valida, eliminar por completo el modulo, sin encabezado vacio.
- El cross-sell puede ayudar a cerrar la brecha de envio, pero no debe afirmar que la cubre hasta que el servidor confirme el nuevo total.

## 8. Gate de salida para la auditoria de GPT

Sprint 5A solo recibe `APTO` cuando:

1. Pasan todos los P0 de QB y SW en storefront real y theme editor.
2. No quedan errores de consola, requests duplicadas ni promesas rechazadas.
3. F01-F12 se prueban en 1440 px y los casos moviles indicados en 390 x 844.
4. Se repite al menos F03, F04, F05 y F10 en `/es`.
5. Se prueba teclado completo, Escape, restauracion de foco y reduced motion.
6. Se captura el request payload y la linea resultante para QB-01, QB-05, QB-08, QB-09 y QB-11.
7. Se prueba red 429/500/503 con cuerpo JSON y HTML.
8. Se prueba sin JavaScript el fallback de un producto simple y uno con opciones.
9. `node --check`, Theme Check y las compuertas estaticas quedan verdes, sin usarlas como sustituto de Gate 5.
10. El informe de Claude enumera filas del ledger afectadas; GPT intenta falsificarlas una por una.

Evidencia minima por caso: URL, fixture, viewport, pasos, resultado, request/response relevante, cart line final y captura cuando el criterio sea visual.

## 9. Verificacion y fuentes

| Fuente/evidencia | Resultado | Demuestra | No demuestra |
| --- | --- | --- | --- |
| `Get-Content` de tarea, BOARD y RULES | Directiva y estado leidos | Scope, autoridad y compuertas | Implementacion de Claude |
| `git status --short --branch` | `master...origin/master`, limpio al iniciar | No habia cambios locales previos | Calidad del tema |
| [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) | Demo por preset, Client transfer store, listings y paridad | Obligaciones de submission | Que las demos ya existan |
| [Theme Store listing page](https://shopify.dev/docs/storefronts/themes/store/review-process/listings) | Ficha por preset, screenshots e industria/catalog size | Formato de listing | Aprobacion futura |
| [product_option_value](https://shopify.dev/docs/api/liquid/objects/product_option_value) | `available`, `selected`, `swatch`, `variant`, `product_url` | Modelo nativo para la matriz | Implementacion correcta |
| [Theme test checklist](https://shopify.dev/docs/storefronts/themes/store/test-theme/checklist) | Pruebas en editor/storefront y selling plans | Base oficial de QA | Cobertura exhaustiva propia |

No se ejecuto Theme Check, Lighthouse, Playwright ni prueba de tienda: esta entrega define estrategia y criterios previos a la implementacion terminada.

## 10. Afirmaciones falsables

1. Shopify exige al menos una demo completa por preset y recomienda crearla como Client transfer store.
2. Cada preset genera una ficha separada y necesita una captura desktop y otra movil con las dimensiones documentadas.
3. Los taglines propuestos miden 55, 59 y 52 caracteres respectivamente.
4. Edition queda definido como Home/24 productos sin modelos humanos; Archive como Bags/24 productos documentales.
5. El hover de swatch no debe modificar la variante enviada; click/tap/teclado si deben comprometerla.
6. En grid movil de dos columnas, el limite propuesto es 2 swatches visibles mas un control `+N` de 44 px.
7. Un producto que exige selling plan no puede agregarse sin `selling_plan`.
8. Gift cards y productos de mas de 250 variantes tienen fallback a PDP salvo soporte completo y verificable.
9. La barra de $150 usa total fresco despues de descuentos y nunca muestra progreso negativo o superior a 100%.
10. Una nota dirty debe sobrevivir cualquier rerender causado por Quick Buy, cantidad o cross-sell.
11. El cross-sell no puede proponer un producto agotado, ya presente o incompatible con el flujo de compra disponible.
12. Ninguna aceptacion de Sprint 5A puede basarse solo en Theme Check o analisis estatico.

## Conclusion

La ventaja comercial no sera tener tres paletas ni un boton mas rapido. Sera demostrar tres negocios completos con el mismo motor y, al comprar, no permitir ninguna ambiguedad entre lo visto, lo seleccionado y lo que entra al carrito.

Con Edition como estudio de objetos, Archive como catalogo de cuero numerado y Sartorial como sastreria editorial, los tres presets pueden ocupar segmentos distintos. Con esta matriz, Quick Buy deja de ser una animacion de conveniencia y se convierte en una funcion defendible para un tema de $380.
