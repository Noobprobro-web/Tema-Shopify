ID: GPT-AUDIT-013
Estado: Auditoria comparativa en vivo completada para home y catalogo de seis demos; PDP propios no auditables por catalogos vacios.
Decision requerida: Gemini debe priorizar catalogos y fotografia diferenciados antes de presentar las tres tiendas como demos comerciales o medir conversion/PDP.
Resumen en 5 lineas:
1. Contour, Maison y Annex comparten estructura, pero cambian catalogo, relato y modulos de compra segun su sector.
2. Maison y Annex son las referencias mas utiles para Edition (objetos) y Archive (procedencia), respectivamente; Contour aporta comparacion tecnica.
3. Su debilidad comun es un pie de pagina generico, una promesa de envio transversal y ordenacion alfabetica que prioriza productos inadecuados.
4. Las tres tiendas propias publicadas muestran 0 productos; sus vitrinas carecen de tarjetas y dos capsulas exhiben copy del editor y total $0.00.
5. La diferenciacion propia es principalmente tipografia/copy/orden: imagenes esquematicas similares, tabs a all y marcas elididas en movil.
Archivos tocados: solo este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna; no se modifico el tema.
Hallazgos extra fuera de alcance (con parche listo): ninguno; las correcciones de merchandising requieren confirmar catalogos y assets por tienda.

## Alcance y metodo

Inspeccion manual en Chrome de las tres tiendas de referencia, incluyendo home, /collections/all y un PDP representativo por tienda. Se inspecciono ademas la portada y el catalogo de Annex a 390 px. Los otros dos catalogos se inspeccionaron en escritorio. Se abrieron con la clave facilitada por Johandry las tres tiendas propias y se inspeccionaron home y /collections/all en escritorio, mas la primera pantalla de cada home a 390 px. Se contrastaron los JSON locales de homepage. No se probaron pagos, tiempos de carga, Lighthouse ni conversion real. La barra de busqueda, el carrito y filtros no se auditaron de extremo a extremo en esta pasada. No hay PDP propios disponibles para la comparacion porque /collections/all publica 0 productos en las tres tiendas.

Referencias: [Contour](https://contour-ho5kbo9x.myshopify.com/), [Maison](https://maison-10oym9w0.myshopify.com/), [Annex](https://annex-r0zzjfjf.myshopify.com/).

Tiendas propias conocidas por BOARD.md e inspeccionadas con la clave de storefront proporcionada por Johandry: [Sartorial](https://sartorial-atelier.myshopify.com/), [Edition](https://sartorial-edition.myshopify.com/), [Archive](https://sartorial-archive.myshopify.com/). No se atribuye a las tiendas nuevas ningun defecto encontrado solo en los listings locales, salvo cuando el DOM publicado lo confirma.

## Comparacion de producto

| Referencia | Diferenciacion observada | Equivalente util nuestro | Brecha / oportunidad |
| --- | --- | --- | --- |
| Contour | Muebles organizados por habitacion, tabla comparativa de tres asientos, materiales, reparacion y entrega. | Edition para objetos; Sartorial solo en la logica de comparacion de materiales y medidas. | Ofrecer datos tecnicos propios de cada categoria, no trasladar una tabla de muebles a moda. Fotos y afirmaciones deben corresponder al articulo exacto. |
| Maison | Ceramica con proceso de taller, glazes, mesa comprable y registro de hornadas. PDP con cuidados y dimensiones utiles. | Edition. | Darle taxonomia real a objetos: material, medidas, acabado, cuidados, sets. Su pagina no debe parecer una coleccion de prendas renombrada. |
| Annex | Arte con escala en pared, previsualizacion de marco, numero de edicion y procedencia. | Archive por narrativa documental; la herramienta de pared solo tiene sentido en arte. | Archive necesita procedencia, estado, restauracion, dimensiones y numeracion verificables, no solo titulares de archivo. |

Las tres referencias prueban una estrategia comercial correcta: un solo sistema de secciones y patrones, tres tiendas con catalogos y mensajes realmente distintos. La separacion de tiendas que hizo Gemini va en esa direccion, pero las tres demos propias aun no materializan la estrategia: no tienen catalogo publicado ni PDP para demostrarla. La diferenciacion no se demuestra con una paleta distinta ni con cambiar el orden de bloques: se demuestra en filtros, fotografia, datos de producto, navegacion, PDP y postcompra.

## Hallazgos comprobados en las tres tiendas propias

1. **P0, demo comercial no presentable:** cada `/collections/all` informa `0 products` y `This collection is empty.`. Las tres vitrinas curatoriales de portada presentan articulos sin tarjetas comprables; en Sartorial y Edition la capsula muestra `Choose two to four products in the theme editor to build this look.`, `0 of 0 items selected` y `$0.00`. En este estado no se puede certificar PDP, quick buy, swatches, conversion ni venta cruzada. Esto es falta de configuracion/catalogo demo, no prueba de un defecto Liquid. Evidencia: DOM de las tres home y `/collections/all` el 2026-09-29.
2. **P1, primera impresion sin producto real:** Sartorial y Archive abren con la misma ilustracion esquematica oscura de accesorios; Edition usa la misma ilustracion en version clara. El discurso dice moda, objetos y procedencia, pero ninguna hero muestra un articulo inspeccionable o su contexto de uso. Frente a la fotografia sectorial de Contour, Maison y Annex, la diferencia visual entre nuestras tres tiendas queda reducida a tono y maquetacion. Evidencia: capturas de las tres home a 1536 px y 390 px.
3. **P1, navegacion sin destino editorial:** en Sartorial y Archive `Explore lookbook` lleva a `/collections`, y `Read our process` lleva a `/collections/all`; varias tarjetas `Explore the story` tambien conducen a `/collections/all`. En tiendas sin colecciones ni productos, los CTA prometen contenido que no se entrega. Evidencia: hrefs del DOM de las home.
4. **P1, afirmaciones no demostradas:** Archive anuncia `ESTABLISHED 1987 / CONTINUING WORKSHOP`, `EACH OBJECT NUMBERED AND RECORDED` y `Maker: Named with every object`, pero no hay objetos publicados donde comprobarlo. No afirmar historia o trazabilidad ficticia en una demo comercial sin ficha de soporte o aviso inequivoco de contenido ficticio. Evidencia: home Archive y catalogo vacio.
5. **P2, cabecera movil:** a 390 px, las marcas aparecen como `Sartorial Ateli...` y `Sartorial Arch...`; Edition cabe completa. Esto quita una senal de marca en el primer viewport. Evidencia: capturas moviles de Sartorial y Archive.
6. **P2, repeticion y acabado:** las tres comparten `Complimentary shipping on orders over $150`, footer `Private correspondence`/`Notes from the atelier`, navegacion principal Home/Catalog/Contact y `Powered by Shopify`; hay ademas formulario de newsletter en seccion y footer en cada home. La configuracion puede ser valida, pero no expresa tres contextos comerciales diferentes y el umbral de envio debe corresponder a tarifas reales. Evidencia: DOM de las tres home.

## Hallazgos adversariales en las referencias

1. **P1, confianza editorial:** los tres footers contienen `Share your store’s story, shipping, returns, or contact details here.`; Maison incluso conserva `Considered objects for the modern home, made to last.`. Una demo premium pierde credibilidad cuando el texto parece sin terminar. Evidencia: footer de las tres home y /collections/all en Chrome. Accion para nuestras demos: revisar pie, politicas y textos legales por tienda, sin copiar ese contenido.
2. **P1, coherencia de producto:** el PDP [Velvet Accent Chair](https://contour-ho5kbo9x.myshopify.com/products/velvet-accent-chair) muestra visualmente una silla de madera de varillas, mientras titulo y alt describen una silla tapizada de terciopelo. La foto no valida la oferta. Accion: auditoria de concordancia titulo/variante/foto/alt en el primer pliegue de cada PDP propio.
3. **P1, descubrimiento:** los tres catalogos `/collections/all` abren con orden alfabetico A-Z. En Annex esto mezcla arte, agotados y gift card; en Maison aparece una gift card en catalogo y tambien en una vitrina de tableware. Accion: configurar colecciones curatoriales y orden comercial por demo; reservar gift cards para una ruta o modulo contextual.
4. **P2, lenguaje de filtros:** Maison vende acabados `Glaze`, pero su filtro se llama `Color`; Annex vende marcos y ediciones, pero presenta tambien un filtro de color generico. Accion: filtros alineados con atributos que el cliente realmente compra, con nombres propios de categoria.
5. **P2, movil:** a 390 px Annex abre el catalogo mostrando primero titulo, toolbar y facetas extendidas; los productos quedan fuera del primer viewport. Su portada usa hero casi a pantalla completa y apenas deja asomar la siguiente seccion. Accion: comprobar el tiempo hasta el primer producto y el estado inicial de filtros en nuestras tres demos a 360 y 390 px.
6. **P2, disponibilidad frente a promocion:** la portada Annex destaca [Cascade Photograph](https://annex-r0zzjfjf.myshopify.com/products/cascade-photograph), cuyo PDP inspeccionado muestra opciones no disponibles y boton `Sold out`. Puede ser una eleccion curatorial, pero sin alternativa clara desperdicia un CTA principal. Accion: revisar que productos hero/capsule/cross-sell tengan una ruta comprable o una sustitucion explicita.

No se extrapola que estos defectos existan en Sartorial, Edition o Archive. Son lecciones comprobadas en las referencias y casos de prueba para las demos propias.

## Lo que si demuestra el repositorio propio

- Las secuencias de homepage son distintas: Sartorial combina lookbook + capsule; Edition vitrina + set; Archive manifesto + lookbook. Evidencia: `listings/{sartorial,edition,archive}/templates/index.json`, propiedades `order` y `sections.*.type`.
- La diferenciacion local es aun parcialmente nominal: las tres vitrinas usan `collection: all` en sus tabs. En Edition, `Daily objects`, `Workspace` y `Limited studies` apuntan a la misma coleccion; en Archive, `Current catalogue` y `Archive selection` tambien. Evidencia: `listings/edition/templates/index.json:33-35` y `listings/archive/templates/index.json:68-69`.
- Edition, planteada para objetos, incluye `fine-merino-turtleneck` y `cigarette-trouser` en su bento local. Evidencia: `listings/edition/templates/index.json:50-51`. Esto no demuestra que la tienda Edition ya desplegada exhiba esos productos; si demuestra que el preset instalable no cuenta todavia la misma historia que promete.
- Hay reutilizacion de assets entre sectores: Archive y Sartorial apuntan a `hero-campaign-01.jpg`; Edition usa `capsule-look-01.jpg` de Sartorial como hero; las tres usan `manifesto-01.jpg`. Evidencia: `listings/archive/templates/index.json:12`, `listings/sartorial/templates/index.json:12`, `listings/edition/templates/index.json:12`, y sus bloques manifesto. Hace falta comprobar si los archivos en cada tienda contienen fotografias distintas; la ruta por si sola no permite afirmarlo.

## Prioridades para Gemini y Claude

1. **P0, Gemini/Johandry:** cargar y publicar catalogos sectoriales reales en las tres tiendas (no el mismo catalogo duplicado), con colecciones por tab, imagenes, variantes e inventario. Hasta entonces retirar u ocultar vitrinas/capsulas vacias y el texto del editor en el storefront. No abrir submission ni usar las demos para prueba comercial.
2. **P1, Gemini/Claude:** alinear `/listings/` con las demos: colecciones independientes por tab, productos de Edition realmente de objetos, imagenes y mensajes exclusivos, y Archive con procedencia demostrable. Mantener instalacion inicial funcional aun si una tienda demo se personaliza despues.
3. **P1, Gemini:** definir el contrato de contenido por vertical. Sartorial = talla, fit, tejido y looks; Edition = dimensiones, materiales, variantes/acabados y sets; Archive = origen, estado, numero, historia y cuidado. Revisar filtros, PDP y nav contra ese contrato. Crear destinos reales para lookbook, proceso e historias o corregir CTA.
4. **P2, Claude tras directiva:** eliminar el truncamiento de marca a 390 px, revisar duplicacion de newsletter y auditar los primeros 5 PDP, 3 colecciones y footers de cada demo buscando copy placeholder, fotos incongruentes, CTA hacia agotados y promesas de envio no respaldadas por configuracion.

## Verificacion

- `git status --short --branch` -> `## master...origin/master` antes de redactar; sin cambios preexistentes.
- Parseo con PowerShell `Get-Content -Raw ... | ConvertFrom-Json` para cada `listings/{sartorial,edition,archive}/templates/index.json`: secuencias `hero/marquee/lookbook/collections/manifesto/capsule/discovery/newsletter`, `hero/collections/discovery/set/manifesto/newsletter`, y `hero/manifesto/marquee/collections/lookbook/discovery/newsletter` respectivamente. Demuestra la estructura local, no su render remoto.
- `rg -n` de `collection`, imagenes y productos en los tres JSON: Edition tiene `collection: all` en lineas 33-35 y prendas en 50-51; Archive `collection: all` en 68-69. Demuestra configuracion instalable, no estado de tiendas personalizadas.
- Chrome DOM + capturas de las tres referencias: home, catalogo y PDP representativo; Annex tambien a 390 px. Demuestra render observado en esta sesion, no cumplimiento WCAG ni rendimiento cuantitativo.
- Chrome DOM de las tres nuevas home y de `/collections/all` tras acceso: las tres colecciones muestran `0 products` y `This collection is empty.`; Sartorial/Edition muestran `0 of 0 items selected`, `$0.00` y texto del editor en la capsula. Demuestra el estado publicado en esta sesion, no por que Shopify no ha recibido productos.
- Capturas propias en 1536 px y a 390 px: las tres heroes usan motivos esquematicos muy parecidos; a 390 px Sartorial y Archive eliden el nombre en el header. No demuestra rendimiento ni contraste medido.

## Lista de afirmaciones falsables

1. Abrir los tres JSON locales y comprobar que cada tab `collection_tab` señalado arriba referencia `all`.
2. Abrir el bento de Edition local y comprobar que dos handles de producto son prendas.
3. Abrir el footer de cada referencia y buscar el texto `Share your store’s story`.
4. Abrir Contour Velvet Accent Chair y contrastar foto principal con titulo y alt.
5. Abrir Annex `/collections/all` a 390 px y verificar si los productos aparecen en el primer viewport sin desplazar.
6. Abrir los `/collections/all` de las tres tiendas nuevas y verificar el contador `0 products` y el estado vacio.
7. Abrir las home Sartorial y Edition y localizar el mensaje `Choose two to four products in the theme editor`, `0 of 0 items selected` y `$0.00`.
8. Abrir las tres home a 390 px y comprobar que solo Sartorial y Archive eliden el nombre.
9. Tras publicar el catalogo, repetir PDP y validar si los listings locales coinciden con la personalizacion instalada; esa paridad sigue no verificada.
