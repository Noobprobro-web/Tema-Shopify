# QA manual R4: Sartorial, Archive e Imprint (0b4d517)

> Copia de `agent-comms/outbox-claude/QA-MANUAL-R4.md` de la rama `qa/r4-manual-audit` (commit `f5d00e5`), guardada en `docs/audits/R4/` para la ronda R5. Cambios respecto al original: se eliminó el párrafo del carrito personal del usuario (§5, «Carrito») y se quitó el nombre del sitio de otra pestaña del usuario (§5, «Interferencia»). Lo demás es literal. El análisis de cada hallazgo contra el código de `master` está en `agent-comms/inbox-gpt/GPT-TASK-R5-001.md` §3. Nota de esa verificación: el defecto 8 (Title Case en `sections/header-group.json:33`) no se reproduce en `master`, donde los textos ya son «New forms» y «Tailoring» desde `585359c`.

Fecha: 2026-11-25, 12:44 a 13:11 (hora del equipo). Auditor: Claude (sesión QA R4).
Temas revisados: "Sartorial R4 (0b4d517)", "Archive R4 (0b4d517)", "Imprint R4 (0b4d517)". Confirmado con `Shopify.theme.name` antes de cada anotación (rol `unpublished`).

Leyenda de capturas: "CU" = captura real de pantalla con uso del ordenador (lo que ve el comprador, ventana emergente propia). "CX" = captura de la pestaña con la extensión Claude in Chrome. "JS" = medición en la página con javascript_tool. Visto = observado en pantalla o medido; supuesto = deducido.

## 1. Tabla de defectos

| # | Severidad | Preset | Página / URL | Viewport real | Pasos | Esperado | Observado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| 1 | Media | Los tres (código común) | Carrito `/cart` | 1536x730 | Añadir 2 productos, ir a `/cart`, pulsar "+" con teclado en Doppio Trench | El subtotal y el precio de línea se actualizan al cambiar la cantidad (o el cambio se aplica al momento) | Visto: el campo pasa a 2 pero el subtotal sigue en $970.50 y `/cart.js` no cambia tras 7 s; solo se aplica con "Update cart". `sections/main-cart-items.liquid` es un formulario sin componente JS. Persiste de R3 | JS 12:58 (`inputs ["1","2"]`, subtotal $970.50, total servidor 97050) |
| 2 | Media | Archive e Imprint | Portada `/` | 1522x675 | Abrir la portada del preset | La sección "Featured product" muestra el producto y sus imágenes | Visto: la sección `featured_product` mide 0 px y su HTML está vacío en Archive e Imprint (en Imprint también `capsule`/complete the look mide 0 px; en Sartorial `complete_the_look` mide 0 px). Supuesto: no hay producto elegido en la configuración de esos temas en la tienda, y `sections/featured-product.liquid:51` solo pinta el marcador en el editor. El revisor ve una portada sin la sección. Persiste de R3 | JS 13:07 (Archive y Imprint, `featured_product` 0 px) |
| 3 | Baja | Sartorial (Archive e Imprint no medidos) | 404 `/zz-404-test` | 1522x675 | Abrir una URL inexistente | El placeholder del buscador se lee entero | Visto: el campo mide 143 px y el placeholder se corta en "Search products and". A 392 px se ve entero. Persiste de R3 | CU 13:03 404 escritorio, zoom del campo |
| 4 | Baja | Los tres (código común) | Cajón y página de carrito | 1536x730 | Añadir Doppio Trench (en oferta, $945.50, antes $1,190.00) y abrir el cajón o `/cart` | Mostrar el precio tachado igual que en la ficha | Visto: cajón y `/cart` muestran solo $945.50 / $1,891.00, sin `<s>` ni compare-at. Persiste de R3 | JS 12:55 (precios del cajón), JS 12:57 (`/cart`) |
| 5 | Baja | Sartorial (los tres medidos con el mismo resultado en 0 px) | Ficha `/products/serra-coat` y `/products/doppio-trench` | 1442x688, 1368x688, 1522x675 | Cargar la ficha y bajar despacio | "Add to cart" siempre al alcance | Visto: el problema grave de R3 está arreglado (ver §2). Quedan dos huecos cortos: (a) al cargar, a 1442x688 y 1368x688 el botón queda debajo del pliegue (top 730 px) y la barra fija aún no sale; supuesto: a 1366x768 real también queda fuera por 6 px (bottom 774); (b) entre ~650 y ~800 px de scroll el botón queda tapado por la cabecera fija (77 px) y la barra fija todavía no aparece | JS 12:47-12:49 (`gaps`), CU 12:47 serra-coat 1442x688 scroll 1400 con barra |
| 6 | Baja | Sartorial (mismo snippet en los tres) | Ficha `/products/fixture-media-3d-video` | 1522x675 | Abrir la ficha con 3D y vídeo | Las dos piezas de la galería con proporciones coherentes | Visto: el `model-viewer` mide 401x768 (muy vertical) y obliga a la fila a 768 px; el vídeo es cuadrado (401x401) y deja 367 px vacíos debajo dentro de su celda | CU 12:50 ficha 3D+vídeo, JS 12:50 (tamaños) |
| 7 | Baja | Sartorial (menú móvil común) | Menú móvil, cualquier página | 392x675 | Abrir el menú (hamburguesa) | Margen interior simétrico en la fila de país | Visto: "Update preferences" acaba a 2,6 px del borde derecho del panel (izquierda 20 px) | CU 13:06 menú móvil y zoom, JS 13:06 |
| 8 | Baja | Los tres (archivo del tema) | Mega menú por defecto (`sections/header-group.json`) | n/a (código) | Instalar el tema sin configurar | Títulos en sentence case | Visto en el repo: los promos por defecto del mega menú son "New Arrivals" y "Capsule Wardrobe" (Title Case). En la tienda no salen porque el menú está configurado con otros textos. Supuesto: un comerciante nuevo los vería | `sections/header-group.json:33` y siguiente |
| 9 | Baja | Sartorial | Ficha, barra fija | 1442x688 / 392x675 | Bajar en Serra Coat (variante Ink) o Doppio Trench (Stone) | La miniatura de la barra coincide con la variante elegida o es neutra | Visto: muestra la imagen destacada (abrigo camel o negro) con el texto "Ink / XS" o "Stone / XS". Supuesto: es la imagen destacada porque las variantes no tienen imagen (conocido), así que es solo cosmético | CU 12:47 y CU 12:49 |

Sin defectos bloqueantes ni altos.

## 2. Lo que funciona bien

- Ficha, "Add to cart" al alcance (bloqueante de R3): **arreglado**. La ficha mide ahora unos 3.500-4.700 px (antes ~8.500 px de scroll) y aparece una barra fija de compra (`sticky-cart-bar`) al pasar el botón. Medido cada 50 px en Serra Coat a 1442x688, 1368x688 y 1522x675, y en Doppio Trench (12 imágenes) a 1522x675 en los tres presets: solo los huecos cortos del defecto 5. CU 12:49 Doppio Trench 1522x675 scroll 2500 con la barra y "Add to cart" visibles. En móvil (392x675) la barra se ve desde el inicio (CU 13:06).
- Selector de país (chevron sobre "Update preferences"): **arreglado**. Con zoom no se solapan (CX 12:52).
- Buscador con búsqueda anterior ("tailoringsize"): **arreglado**. Tras buscar "tailoring", cerrar con Escape y reabrir, al escribir "zzqx" el campo queda "zzqx".
- Predictiva, "COLLECTIONS" repetido: **arreglado**. Una sola etiqueta por grupo (Products, Collections). "From $89.00" en el producto con varios precios. Mensaje sin resultados correcto y visible una vez (la copia doble es una región `visually-hidden aria-live`).
- Mensaje "Removed… 0 items" sobre el estado vacío del cajón: **arreglado**. El anuncio queda `visually-hidden`; en pantalla solo "Your cart is currently empty." y "Continue shopping" (CX 12:56).
- `/cart` sin actualizar subtotal: **persiste** (defecto 1). Precio tachado en el cajón: **persiste** (defecto 4). Placeholder del 404 cortado: **persiste** (defecto 3). Featured product a 0 px: **persiste** en Archive e Imprint (defecto 2).
- Textos: **arreglado** lo de R3. No hay "Membrane telemetry", "Blueprint analysis" ni "System inventory" en Imprint. Las cabeceras de los tres presets están en sentence case ("Archive pieces", "Desk objects for daily use", "Selected forms for the season"). En pantalla solo queda en Title Case "Explore Catalog" del mega menú, que sale de `Explore {{ title }}` con el título del menú de la tienda.
- Teclado: mega menú (Enter abre, Tab entra, Escape cierra y devuelve el foco a "Catalog"), búsqueda (Tab no sale del panel, Escape devuelve el foco al disparador), zoom de imagen (foco inicial en "Close zoom", flechas cambian de imagen, Tab queda dentro del `dialog` modal, Escape devuelve el foco al disparador), cajón (foco inicial en "Close", Tab no sale, Escape devuelve el foco a "Cart"). En el cajón el foco no se pierde al cambiar la cantidad (queda en el botón) ni al eliminar (pasa al siguiente producto y, al vaciar, al texto del estado vacío). Foco visible (`:focus-visible`) en todos los casos.
- Filtros de colección: aplicar "In stock" deja el foco en el checkbox; un precio por encima del máximo (9000) se ajusta a $2,800.00 y sale la etiqueta "To $2,800.00"; quitar la etiqueta deja el foco en la siguiente.
- Blog: rejilla correcta, destacado sin duplicar, etiquetas. El artículo de título largo hace bien el salto de línea. FAQ con buscador y acordeones.
- Render: sin "Liquid error" ni "Translation missing" en ninguna página revisada de los tres presets. Sin desborde horizontal (`scrollWidth == clientWidth`) a 392 px en portada, colección, fichas (normal, título largo, 3D+vídeo), carrito, búsqueda, blog, artículo, FAQ y 404.
- Consola: el único error es de Shopify (`event_observer_reporter_origin_attribution… Failed to fetch`), no del tema.

## 3. Lo que no pude probar y por qué

- Página de contraseña: el navegador ya tenía la sesión del escaparate abierta y `/password` redirige a la portada. No cerré sesión para no tocar la cookie que comparte el usuario.
- Nota del pedido: `show_cart_note` está en `false` en los tres presets (`config/settings_data.json`), así que no aparece ni en el cajón ni en `/cart`.
- Tarjeta regalo: añadir, cambiar cantidad y eliminar en el cajón funcionan. No probé el campo de destinatario ni el canje (sería entrar en el checkout).
- Cambio de variante con imagen propia: ningún producto del catálogo tiene imagen por variante (`/products.json`: `featured_image` vacío en todas), así que no se puede comprobar el salto de la galería.
- Guía de tallas: el bloque existe en `sections/main-product.liquid:295`, pero ninguna ficha de la tienda lo tiene configurado y no sale.
- Viewports exactos 1440x900 y 1366x768: la pantalla es 1536x864 CSS (1920x1080 al 125 %). Lo más parecido que conseguí fue 1442x688, 1368x688 y 1522x675 (este último cubre 1536x674). El alto de 768/900 no cabe; lo de 1366x768 en el defecto 5 es supuesto, por cálculo.
- Teclado en móvil (menú móvil con Tab/Escape): la ventana emergente se controló solo por script y capturas; el teclado se probó en la pestaña propia a 1536x730.
- 404, cajón, búsqueda y teclado no se repitieron en Archive e Imprint (fuera del alcance pedido para esos presets).
- Consola de la ventana emergente: `read_console_messages` solo lee la pestaña del grupo. La consola se revisó en la pestaña propia, que recorrió portada, colección, ficha, carrito y blog.

## 4. Veredicto

Dejando aparte el contenido de la tienda, el tema **pasaría probablemente la revisión del Theme Store** en cuanto a comportamiento: el bloqueante de R3 (compra fuera de alcance en la ficha) está resuelto, el teclado y el foco cumplen en todos los diálogos probados y no hay errores de render ni de JavaScript del tema.

Antes de enviar recomiendo:
1. Que `/cart` actualice el subtotal al cambiar la cantidad (defecto 1). Un revisor lo nota enseguida.
2. Elegir un producto en "Featured product" de Archive e Imprint en la tienda de demostración, porque el revisor ve una sección vacía (defecto 2). Es configuración, no código.
3. Los defectos de baja (placeholder del 404, tachado en el carrito, huecos cortos de la barra fija, celda del 3D/vídeo, padding del menú móvil, Title Case en `header-group.json`) no deberían bloquear, pero son fáciles de corregir.

## 5. Entorno e incidencias

- Aislamiento: no hubo ventana ni perfil aislado. La extensión vive en el perfil del usuario y el uso del ordenador solo tiene permiso de lectura sobre Chrome. Trabajé en una pestaña propia (grupo nuevo de la extensión) y en una ventana emergente abierta desde ella con un botón temporal inyectado (sin tocar el tema). Las capturas CU son de esa ventana.
- Interferencia: la pestaña de la tienda quedaba detrás de otra pestaña del usuario, así que para las capturas CU usé la emergente, que sí quedaba delante. Las capturas de la pestaña con la extensión fallaron varias veces por tiempo de espera. El dispositivo se desconectó del puente unos segundos a las 12:45. Una `fetch` a `/password?preview_theme_id=<Sartorial>` redirigió a `/` y la cookie de vista previa se quedó en Imprint; la restablecí a Sartorial y lo comprobé con `Shopify.theme.name` antes de seguir. No detecté cambios de otra sesión.
- Viewports reales (innerWidth x innerHeight): pestaña propia 1536x730; emergente 1442x688, 1368x688, 1522x675 y 392x675 (móvil; `clientWidth` 377 por la barra de scroll de escritorio). La barra de vista previa de Shopify tapaba la barra fija de compra, así que la oculté por script solo en la emergente.
- Carrito: *[párrafo eliminado en esta copia: describía el contenido y los importes del carrito personal del usuario al empezar y al terminar la sesión]*.
- Cierre: cerré la emergente y mi pestaña. No toqué pestañas del usuario. Liberé el control del ordenador.
