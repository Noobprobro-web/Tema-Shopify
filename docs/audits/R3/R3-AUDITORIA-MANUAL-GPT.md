# GPT-R3-MANUAL-BROWSER-AUDIT-001

**ID:** GPT-R3-MANUAL-BROWSER-AUDIT-001  
**Estado:** Revisión manual parcial; no certifica preparación para Theme Store.  
**Decisión requerida:** Johandry debe decidir si se corrige el catálogo de demostración/media y cuándo se autoriza una pasada completa de teclado y móvil.  
**Resumen en 5 líneas:**
1. Se observaron y confirmaron los tres previews: Sartorial, Archive e Imprint R3 (62ce5ab).
2. En cada preset, la variante elegida no coincidió con la primera imagen del producto probado.
3. Imprint presenta productos de moda bajo una portada que promete objetos de escritorio y equipo modular.
4. Los tres presets exponen texto de demo o instrucciones para reemplazar contenido.
5. Hay interacciones correctas, pero la cobertura visual integral móvil y algunos recorridos de teclado quedaron pendientes.

**Archivos tocados:** solo este informe. No se modificó código, tema, catálogo ni tienda.  
**Desviaciones (Nivel 1 o Nivel 2):** ninguna; auditoría de solo lectura.  
**Hallazgos extra fuera de alcance (con parche listo):** ninguno; no se preparó parche.  
**Verificación (comando, resultado y qué demuestra/qué no):** Navegador Chrome real mediante Computer Use; navegación directa con `preview_theme_id` y comprobación del rótulo de la barra de Shopify, árbol accesible y capturas visuales. Las capturas S1, S2, A1, I1 e I2 se mostraron en la conversación, pero la herramienta no proporcionó rutas locales para adjuntarlas a este archivo. Esto demuestra el estado visible de esas páginas en el instante capturado; no demuestra la causa en el tema, configuración de medios del producto ni el resultado de una revisión oficial de Shopify. No se ejecutaron pruebas automatizadas, Lighthouse ni axe.

## Defectos observados

| Severidad | Preset | Página y URL | Viewport e idioma | Pasos | Esperado | Observado | Captura |
|---|---|---|---|---|---|---|---|
| Alta | Sartorial R3 | Ficha Doppio Trench — `https://sartorial-theme-kvkzl39t.myshopify.com/products/doppio-trench?preview_theme_id=190695473456` | 1440×900, inglés | Abrir la ficha con Stone seleccionado; comparar la etiqueta con la primera imagen. | La imagen principal corresponde al color elegido cuando hay medios asociados a esa variante. | Selector «Color: Stone»; primera imagen y su descripción son del trench negro. El árbol de medios sitúa las imágenes Stone como 7–10 de 12. No se determinó si falta asociación de medios o si es otro problema de datos. | S1, inline en la conversación; sin archivo exportable. |
| Alta | Archive R3 | Ficha Bias-Cut Slip Dress — `https://sartorial-theme-kvkzl39t.myshopify.com/products/bias-cut-slip-dress?variant=68442282328368&preview_theme_id=190695506224` | 1440×900 y 390×844, inglés | Abrir con Black/XS seleccionado desde colección. | La primera imagen corresponde al color Black seleccionado. | La primera imagen es Champagne; una imagen posterior de la galería muestra Black. La barra confirmó Archive en las vistas informadas. No se verificó la asociación de medios del catálogo. | A1, inline en la conversación; sin archivo exportable. |
| Alta | Imprint R3 | Ficha Brass Paperweight — `https://sartorial-theme-kvkzl39t.myshopify.com/products/milled-brass-paperweight?preview_theme_id=190695538992` | 1440×900 y 390×844, inglés | Cambiar Finish de Natural brass a Dark patina. | La imagen principal cambia al acabado seleccionado cuando la variante tiene un medio asociado. | El control muestra Dark patina, pero la primera imagen sigue siendo natural brass. La barra confirmó Imprint en la captura desktop; la observación móvil fue principalmente por árbol accesible. Causa no determinada. | I1, inline en la conversación; sin archivo exportable. |
| Alta | Imprint R3 | Portada — `https://sartorial-theme-kvkzl39t.myshopify.com/?preview_theme_id=190695538992` | 1440×900, inglés | Comparar promesa de portada, categorías de la rejilla y productos de los tabs Daily objects/Workspace. | El contenido de escritorio corresponde a «Modular gear and desk objects for daily carry». | La portada categoriza con «Daily objects» y «Workspace», pero los tabs muestran prendas (chaqueta, abrigo y vestido); Workspace enlaza a `/collections/all`. La causa de la composición no se verificó. El nombre Imprint apareció en el árbol de la barra, aunque no en la captura visual de esta página. | I2, captura inline; barra confirmada por árbol accesible, no visible en la imagen. |
| Media | Sartorial, Archive e Imprint (3/3) | Producto y blog. Ejemplos: `https://sartorial-theme-kvkzl39t.myshopify.com/products/doppio-trench?preview_theme_id=190695473456`, `https://sartorial-theme-kvkzl39t.myshopify.com/products/bias-cut-slip-dress?preview_theme_id=190695506224`, `https://sartorial-theme-kvkzl39t.myshopify.com/blogs/news/welcome-to-the-demo-store?preview_theme_id=190695473456` | 1440×900, inglés | Abrir fichas y el artículo destacado «Welcome to the demo store». | El texto visible parece contenido final para compradores. | Se muestra «STUDIO DEMO» en fichas y copy como «Demo product for theme preview. Replace this text with your own description.»; el artículo dice «This store is used to preview the theme. Replace this article with your own news.» El artículo de guía añade «Sizes in this demo… Replace this text…». Es contenido de catálogo/demo visible; no se atribuye a un defecto de código. | S1, S2, A1 e I1 inline; sin archivo exportable. |

## Lo que funcionó

- Sartorial: filtro de agotados redujo 39 productos a 1; se pudo quitar. Un máximo de precio de $200 redujo la colección a 16. En móvil, el filtro de agotados mantuvo el foco en el checkbox.
- Búsqueda predictiva mostró 8 resultados para «trench» en móvil; la oferta $945.50 frente a $1,190.00 fue coherente. Escape cerró y devolvió el foco; al reabrir se conservaron consulta/resultados.
- Cajón de carrito: cambios de cantidad actualizaron subtotales; el foco volvió al control `+`. Shift+Tab/Tab recorrieron los extremos del cajón y Escape lo cerró y devolvió el foco al carrito. La ficha agotada dejó deshabilitada la compra y anunció «Sold out».
- Blog en Sartorial y Archive: destacado sin duplicarse en las tarjetas; el filtro `guide` funcionó. Con tres artículos no apareció paginación. No se considera defecto el total de artículos que incluye el destacado.
- El botón marquee alternó entre «Pause editorial highlights» y «Play editorial highlights».
- La página 404 ofreció búsqueda y retorno. No se observaron «Liquid error» ni «Translation missing» en las páginas muestreadas.
- La tarjeta regalo mostró valores de $10/$25/$50/$100 y campos de destinatario; no se introdujeron datos. El newsletter estuvo presente y no se envió.

## Pendiente o no probado

- Español: la tienda solo ofrece inglés, según el alcance confirmado por Johandry.
- Video en ficha: no se comprobó reproducción. Un producto fixture con 3D estuvo presente, pero su modelo se percibió mínimo. Doppio tenía 12 imágenes; no se recorrieron todas mediante teclado.
- No se encontró una guía de tallas ni producto con reglas de cantidad en la configuración examinada; no se puede inferir soporte general.
- No aparecieron nota de pedido, barra de envío gratis ni regalo promocional en el carrito observado. No se comprobó su comportamiento si otra configuración los activa.
- No se enviaron newsletter, tarjeta regalo ni checkout. No se introdujeron datos personales ni de pago.
- La contraseña se vio en una sesión limpia previa, pero no se recorrió específicamente bajo cada preview R3.
- No se completó la inspección de foco visible y contención Tab en todos los diálogos, búsqueda, filtros y header. Una pasada final se detuvo cuando Chrome indicó que Claude estaba depurando el navegador y la pestaña cambió a otra ruta.
- No se certificó visualmente ausencia de overflow/cortes en todas las páginas móviles. Las capturas se mostraron en la herramienta, pero no hay archivo persistente. No se midieron Lighthouse/axe.
- Los enlaces normales de algunas páginas perdieron el preset compartido. Las vistas atribuidas se limitaron a páginas cuya barra coincidía; en Imprint se estabilizó la selección navegando directamente a cada ruta con `preview_theme_id` explícito.
- El carrito compartido mostró artículos durante la sesión y hubo cambios no atribuibles de forma segura a una sola pasada; no se completó pago ni se limpió el estado final para no retirar artículos cuya procedencia no estaba clara.

## Veredicto

**No recomendaría presentar estos previews como listos para Theme Store en su estado visible.** Esta es una inferencia de producto a partir de las discrepancias de color entre variante e imagen, la incoherencia de catálogo/preset de Imprint y los textos de demo expuestos. No es una predicción de un rechazo oficial de Shopify ni demuestra que la causa esté en código: parte de los hallazgos puede estar en el catálogo o la configuración. La pasada quedó incompleta en teclado y responsive, por lo que tampoco constituye una certificación completa de R3.

## Afirmaciones falsables

1. En la captura Sartorial S1, «Color: Stone» coincide con una primera imagen descrita como trench negro.
2. En la captura Archive A1, Black/XS está seleccionado mientras la primera imagen representa Champagne.
3. En la captura Imprint I1, Dark patina está seleccionado y la imagen principal sigue representando natural brass.
4. En Imprint, el copy de portada promete equipo/objetos de escritorio mientras la rejilla comprobada muestra prendas.
5. Las páginas examinadas exponen instrucciones de reemplazo y etiquetas de demo en los tres presets.
6. La ausencia de paginación observada en el blog solo se refiere al catálogo de tres artículos de esta tienda.
7. La auditoría no verificó la causa técnica de las discrepancias, ni realizó checkout, ni completó la cobertura de accesibilidad o mobile.
