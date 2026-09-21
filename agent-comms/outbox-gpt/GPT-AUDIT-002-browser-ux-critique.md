# GPT-AUDIT-002: Auditoria de tienda real y UX comercial

ID: GPT-AUDIT-002
Estado: ENTREGADO PARA REVISION. NO APTO PARA SUBMISSION EN EL ESTADO OBSERVADO.
Destinatarios: Johandry, Gemini y Claude.
Fecha: recorrido iniciado el 2026-09-20; comprobaciones finales el 2026-09-21.
Decision requerida: priorizar los P0 y P1, confirmar el despliegue y repetir la verificacion en tienda.
Tienda: https://tema-qkqpke0j.myshopify.com
Tema objetivo segun directiva: Couture / Sartorial, ID 165809488115. Se navego la tienda publicada, sin parametro de preview; no se inspecciono el administrador para certificar el ID o commit desplegado.

Resumen en 5 lineas:
1. Nota comercial de la experiencia publicada: 5/10; mi dictamen previo a submission es RECHAZADO.
2. Cuatro rutas solicitadas muestran 404; documentacion y soporte alternativos no corresponden a la experiencia nativa descrita en el encargo.
3. La documentacion altera visualmente el header y deja el anuncio con contraste de aproximadamente 1.13:1.
4. Checkout parcialmente fuera del viewport, cantidad oculta en Sticky ATC y carrito tradicional desactualizado son fricciones reproducidas.
5. Tabs, busqueda, calculo de cantidades y bundle funcionan en los casos probados; eso no compensa los defectos ni acredita superioridad comercial.

Archivos tocados: exclusivamente este informe.
Desviaciones: ninguna implementacion; se amplio la observacion al carrito tradicional porque el drawer enlaza directamente a el.
Hallazgos extra: contradiccion y overflow en /cart, documentados en UX-06 con propuesta funcional; no se inventa un diff sin revisar codigo.
Ledger: ninguna fila cerrada ni requisito certificado por esta auditoria parcial de navegador.

## 1. Calificacion global y veredicto

**5/10 para competir a $380-$400. RECHAZADO en mi evaluacion de preparacion para submission.** No es una decision emitida por Shopify ni una prediccion garantizada de su revision.

La portada tiene una direccion editorial reconocible, pero la experiencia pierde consistencia al entrar en documentacion, soporte y compra. No pagaria $390 por la demo tal como se presenta hoy: las funciones prometidas no siempre se pueden explorar, hay informacion de compra insuficiente y el soporte inspira dudas operativas.

La conclusion no es que falte reescribir todo el tema. Hay una discrepancia importante entre el encargo, que describe cinco paginas nativas terminadas, y las paginas realmente publicadas. Antes de programar, Claude y Gemini deben separar **despliegue, asignacion de plantillas, contenido del administrador y defectos del tema**. La navegacion por si sola no determina esa causa.

### Alcance y evidencia

- Navegador real mediante CUA: escritorio 1440 x 1000 y viewport movil 390 x 844. Esto no equivale a una prueba en Safari/iPhone fisico ni reproduce su teclado virtual.
- Se usaron clics, teclado, scroll, captura visual y lectura del DOM renderizado para dimensiones, nombres accesibles y colores computados. No se leyeron Liquid, CSS ni JavaScript de produccion.
- Se anadieron y retiraron articulos exclusivamente en la sesion de prueba. No se finalizo ninguna compra ni se envio una consulta, newsletter o correo.
- Las capturas visuales se emitieron en la conversacion. Este informe conserva URLs, pasos y mediciones; no se afirma que exista una carpeta local de PNG ni una suite automatizada nueva.
- No se ejecuto Lighthouse, Theme Check, throttling de red, lector de pantalla, simulacion de fallos HTTP ni prueba sin JavaScript. No se certifican rendimiento, accesibilidad completa, recepcion de emails, checkout final ni cumplimiento integral de Theme Store.
- No se midio la suavidad del hover en FPS. Las transiciones breves de carga no se contabilizaron como defectos persistentes.

**Cambio de estado durante el recorrido:** inicialmente /collections/all mostraba 41 productos y fichas QA publicas, incluidas imagenes con dimensiones impresas. En la revalidacion final, tanto escritorio como movil mostraron 24 prendas sin esas 17 fichas. La contaminacion del catalogo se registra como observacion historica corregida, NO como bloqueador vigente. No hice ese cambio.

### Cobertura del recorrido

| Superficie | Escritorio | Movil | Resultado comprobado / limite |
| --- | --- | --- | --- |
| Portada y header | Recorridos, tabs, hotspot, enlaces y footer | Menu, cierre, pausa de marquee, hotspot, tabs y bundle | Flat navigation sin submenus configurados; no se puede certificar un mega-menu ausente. Header reaparece al navegar por scroll. |
| /collections/all | Precio, vacio, limpiar, orden ascendente, Quick Add | Disponibilidad, precio, vacio, limpiar y densidad 1/2 | Conteos reactivos; configuracion final solo presenta disponibilidad y precio, no talla/color. |
| PDP editorial | Cocoon Cardigan-Coat | Cashmere Rib Crew | Una foto por ficha inspeccionada; sin selector de talla ni guia visible. Recomendaciones cargan. |
| Variantes | Fixture publico de 24 variantes, antes de retirarse | No habia opciones en las prendas editoriales inspeccionadas | Bone / M / Regular se selecciono correctamente; 2 x $420 = $840. No certificar 50 variantes ni cobertura movil por extrapolacion. |
| Sticky ATC | Aparicion al final de PDP | Aparicion, precio visible y compra real | Con cantidad 2, muestra precio unitario sin cantidad y anade 2 unidades. |
| Cart drawer | Quick Add, cantidades, umbrales, foco, Escape, eliminar | Bundle, cantidades, eliminar, scroll y Checkout | Abre y permite comprar; footer mal encuadrado. Cross-sells y notas no visibles en los carritos inspeccionados. |
| Predictive search | coat, flecha abajo, Escape y termino inexistente | coat, miniaturas, stock, termino inexistente y Escape | 8 sugerencias para coat; estado vacio recuperable. No se probaron todos los tipos de resultado. |
| /pages/documentation | 404 | 404 | No fue posible probar la pagina nativa solicitada. |
| /pages/documentacion | Indice por anclas y presets | Indice, presets y lectura | Ruta del header; dos h1 y dos main; sin botones de copiar codigo; no se ve indice lateral fijo. |
| /pages/support | Formulario principal vacio y estructura | Formulario nativo vacio y acordeon de devoluciones | Dos formularios y dos discursos mezclados; no aparece la banda superior descrita en la directiva. |
| /pages/faq | 404 | 404 | No se puede verificar su buscador instantaneo ni sus acordeones. |
| /pages/about | 404 | 404 | No se puede evaluar narrativa, pilares o galeria. |
| /pages/policy | 404 | 404 | Tampoco resolvio la alternativa /pages/terms-of-service probada en movil. |

## 2. Los grandes PROS

1. **La secuencia editorial puede desembocar en compra real.** El lookbook abre un producto; el bundle permite seleccionar prendas y el boton abre el drawer. Al dejar solo Cocoon Cardigan-Coat, el total paso de $1,880 a $980 y se anadio esa prenda. Al deseleccionar todo, el total fue $0 y el CTA quedo deshabilitado. Es una base util para vender conjuntos, no una prueba de aumento de AOV.
2. **La vitrina curatorial ofrece jerarquia comercial.** El producto grande y las tarjetas secundarias distinguen una seleccion de un catalogo uniforme. Las pestañas cambiaron de contenido; en movil la lista horizontal permitio llegar a la tercera coleccion.
3. **El comprador recibe feedback en operaciones clave.** Cantidad 2 produjo un total de linea correcto en PDP; las variantes del fixture reflejaron la seleccion; el carrito actualizo importes; el buscador mostro precios, stock, miniaturas y una salida hacia resultados completos.
4. **Hay mecanismos de recuperacion verificables.** El rango $1-$10 dio cero resultados y Clear all restauro el catalogo. Escape cerro buscador y drawer. En la muestra de escritorio, Shift+Tab desde Close del drawer volvio a View cart, dentro del dialogo. La marquesina tiene pausa explicita operativa.

Estas ventajas necesitan una demostracion mejor configurada. No son por si solas exclusivas: [Prestige](https://themes.shopify.com/themes/prestige/presets/prestige) anuncia lookbooks, hotspots, zoom, guia de tallas y swatches; [Impact](https://themes.shopify.com/themes/impact/presets/impact) comercializa Quick Buy, Sticky ATC y productos complementarios. La comparacion aqui es con sus fichas oficiales, no con un benchmark de velocidad o una auditoria de sus demos.

## 3. Los CONTRAS y puntos de friccion

Los IDs siguientes son las afirmaciones falsables de esta entrega. P0 significa bloquear nuestra submission hasta resolver o demostrar cumplimiento; no significa que Shopify haya emitido ya un rechazo.

### UX-01 [P0] El recorrido de paginas nativas no esta publicado como se describe

- **Reproduccion:** abrir /pages/documentation, /pages/faq, /pages/about y /pages/policy en ambos viewports. Todas presentan el estado visual 404. /pages/terms-of-service tampoco resuelve. La documentacion enlazada por el header esta en /pages/documentacion.
- **Impacto:** no es posible auditar ni mostrar al comerciante cuatro de las cinco paginas prometidas. La busqueda FAQ, lectura legal, historia editorial y copiado de codigo no estan demostrados en esas rutas.
- **Propuesta:** confirmar tema publicado, paginas existentes y plantilla asignada. Publicar las superficies correctas y normalizar rutas/redirecciones. No crear implementaciones duplicadas sin revisar antes el estado del administrador.
- **Cierre:** las cinco URLs acordadas muestran su pagina real en ambos anchos; los controles pedidos se pueden accionar y dejan resultados verificables. Shopify no exige estos handles literales: el fallo es la discrepancia del recorrido publicado, no el nombre de la URL.

### UX-02 [P0] Documentacion y soporte degradan el sistema visual y el contraste

- **Reproduccion:** navegar desde la portada a /pages/documentacion. El header pasa a un contenedor estrecho; en escritorio Support baja a otra fila. En movil el buscador invade visualmente la marca y Documentation se parte dejando la ultima letra en otra linea. /pages/support reproduce la deformacion del header.
- **Medicion:** en /pages/documentacion el enlace del anuncio tiene color computado rgb(41,37,36), sobre fondo rgb(29,27,24). Su contraste incluso a opacidad completa es **1.1327:1**. La opacidad observada en su padre lo reduce, no lo corrige. Es texto de 12px.
- **Semantica observada:** documentacion tiene dos h1 y dos main anidados. Soporte presenta tambien dos titulos principales. Los nombres de presets saltan de h2 a h4 en la documentacion.
- **Impacto:** una pagina auxiliar cambia la identidad y legibilidad de la tienda. La ausencia de overflow horizontal no convierte una palabra partida o un icono superpuesto en un resultado aceptable.
- **Propuesta:** corregir el montaje/aislamiento del contenido publicado y restaurar el header compartido. Conservar un main y un h1 principal, y una jerarquia razonada. Confirmar causa antes de atribuirla al CSS base.
- **Cierre:** misma geometria de header al cambiar de pagina; marca e iconos separados a 390px; anuncio >=4.5:1; titulos sin cortes de una sola letra.

### UX-03 [P0] Soporte comercial ambiguo y formulario principal dependiente de correo local

- **Reproduccion:** /pages/support mezcla Sartorial Theme Support con pedidos, materiales, citas privadas y showroom de Milan. Hay Send Support Ticket y, mucho mas abajo, Your inquiry / Send inquiry. La promesa superior es menos de 24 horas laborables; otra inferior dice dos dias laborables.
- **Evidencia de interfaz:** el formulario superior declara action="mailto:support@ruizdigital.com"; el segundo declara /contact. Se verifico el bloqueo de formularios vacios, no su entrega. El enlace Theme Documentation apunta a /pages/docs.html, cuyo acceso directo devuelve 404. /pages/support.html SI resolvio soporte; no debe reportarse como enlace roto.
- **Impacto:** un comerciante no sabe cual formulario corresponde a soporte de su tema ni que SLA rige. mailto no acredita recepcion del ticket ni confirmacion en el navegador.
- **Propuesta:** unificar el soporte del tema en un formulario web real con destino verificado, store URL, problema y confirmacion de recepcion. Separar la consulta de compradores; corregir enlaces y publicar un unico compromiso de respuesta.
- **Cierre:** prueba autorizada de envio y recepcion en el canal correcto, con estados de error/exito; sin dependencia de un cliente local de correo. No se realizo ese envio durante esta auditoria.

### UX-04 [P1] Checkout fuera de cuadro y aviso de exito encima del area de accion

- **Reproduccion movil:** anadir Cocoon Cardigan-Coat desde el bundle, abrir drawer y aumentar cantidad. En 390 x 844, Checkout quedo en y=819.5, alto=44, bottom=863.5: **19.5px fuera del viewport**. Justo despues de anadir, el aviso inferior de exito cubria parte del area visible del boton.
- **Escritorio:** se observo el mismo patron; Checkout y=975.5 con alto 44 en viewport de 1000px. Era necesario desplazar el propio drawer para verlo completo.
- **Impacto:** la accion principal se esconde aunque el centro del drawer contiene mucho espacio vacio. Es friccion reproducida, no un checkout totalmente inaccesible: el scroll lo recupera.
- **Propuesta:** mantener acciones y subtotal dentro del alto util; limitar el scroll a la zona de contenido y reservar espacio real para avisos. No superponer el live status al CTA.
- **Cierre:** CTA entero visible en 390 x 667, 390 x 844 y escritorio, con 1 y varios items, antes y despues de mensajes/mutaciones.

### UX-05 [P1] Sticky ATC oculta la cantidad que va a comprar

- **Reproduccion:** /products/cashmere-rib-crew, cantidad 2. La PDP muestra correctamente Total for 2 / $960. Al ir al final, la barra fija muestra Cashmere Rib Crew / $480 y Add to cart, sin cantidad. Su clic anadio **2 items / $960** al drawer.
- **Impacto:** no hay un error aritmetico de carrito, sino una confirmacion comercial incompleta. Fuera de vista del formulario, el comprador no puede saber que comprara dos unidades.
- **Propuesta:** mostrar cantidad y total de linea en la barra, o distinguir explicitamente precio unitario y total. Conservar la seleccion del formulario, no resetearla silenciosamente.
- **Cierre:** probar cantidades 1, 2 y 3 y cambios de variante: lo confirmado por la barra coincide con lo que entra en carrito.

### UX-06 [P1] El carrito tradicional contradice al drawer y desborda en escritorio

- **Reproduccion final controlada:** anadir 1 Cashmere Rib Crew, abrir View cart, esperar /cart con 1 item / $480. Abrir el drawer desde esa pagina, eliminar la prenda, esperar Your cart is currently empty y cerrar con Escape. La pagina sigue mostrando 1 item / $480 y Checkout. Solo recargar la pagina muestra el vacio real.
- **Medicion adicional:** en /cart con esa linea visible, viewport=1440 y document.scrollWidth=1490. El boton de incrementar termina en x=1463.2; Remove termina en x=1489.2. Ambos exceden el borde derecho y aparece scroll horizontal.
- **Impacto:** dos representaciones contradictorias de una misma compra y controles esenciales fuera de cuadro.
- **Propuesta:** actualizar tambien la superficie /cart tras cambios desde drawer; contener el stepper y remove en el layout de linea. Revisar productos de titulo corto/largo y ambos anchos.
- **Cierre:** drawer, pagina y subtotal coinciden sin recarga manual; ningun control sale del viewport. La ultima recarga en esta auditoria confirmo carrito vacio.

### UX-07 [P1] El hero sacrifica producto y legibilidad por espacio atmosferico

- **Reproduccion:** primer viewport de portada en escritorio y movil. Una gran parte de la fotografia corresponde a paredes/techo; las prendas aparecen relativamente pequenas. La descripcion clara sobre pared clara pierde legibilidad, especialmente en movil.
- **Impacto:** se comunica ambiente antes que categoria, producto y motivo de compra. La descripcion no puede depender de que el visitante fuerce la vista.
- **Propuesta:** reencuadrar con la imagen/foco movil adecuados, priorizar prendas identificables y separar el texto del fondo de luminancia similar. Medir contraste sobre la composicion final de la imagen; no basta con aprobar una pareja de tokens.
- **Limite:** no se asigna un ratio numerico al hero fotografico sin medir sus pixeles finales. El contraste 1.13:1 de UX-02 es una medicion distinta y si esta verificado.

### UX-08 [P1] Enlaces editoriales y hotspots incumplen su promesa

- **Reproduccion:** Explore lookbook navega a /collections, el directorio de colecciones. Read our process apunta a /collections/all. Explore Sculptural layers y Explore Carried close tambien llevan a /collections/all, aunque el segundo promete una historia.
- **Hotspots:** el punto 2 abre Fine Merino Turtleneck estando colocado sobre el pantalon/rodilla; el punto 4, Leather Belt, aparece junto al banco o zona inferior de la composicion, no sobre un cinturon identificable. Se observaron desajustes en ambos encuadres.
- **Impacto:** el comprador pierde confianza en la navegacion editorial y no relaciona lo que toca con lo que puede comprar.
- **Propuesta:** mapear cada CTA a su destino semantico real; ajustar coordenadas desktop/mobile sobre la fotografia definitiva. Si una pieza no aparece, retirarla de ese hotspot.
- **Cierre:** cada etiqueta, imagen y destino coinciden; los puntos senalan la pieza asociada y no invaden controles vecinos.

### UX-09 [P1] La demo de moda no resuelve talla, detalle de prenda y devoluciones

- **Reproduccion:** las fichas Cocoon Cardigan-Coat y Cashmere Rib Crew inspeccionadas ofrecen una foto, cantidad, ATC y compra acelerada. No presentan talla, guia/model fit ni acordeones de envio/materiales/devoluciones. Al pulsar la imagen no se abrio ampliacion. La descripcion esta en espanol dentro de una interfaz inglesa.
- **Composicion:** con una sola imagen, la PDP de escritorio deja una franja central muy amplia entre foto e informacion. En el bundle se pide seleccionar talla, pero las prendas mostradas no ofrecen ese selector.
- **Impacto:** faltan respuestas basicas antes de comprar ropa de $480-$980. No demuestra las capacidades de galeria, variantes y guias prometidas a un comerciante de moda.
- **Propuesta:** configurar productos editoriales reales con tallas/colores, varias vistas, detalle de tejido, fit y politicas, y conectarlos a los componentes existentes. Corregir el layout de una sola imagen como estado legitimo. Unificar idioma de contenido e interfaz.
- **Limite:** ausencia en estas fichas NO prueba ausencia del componente en el codigo. No encargar una reconstruccion de variantes o guia sin comprobar configuracion.

### UX-10 [P1] Venta cruzada y recompensas no sostienen la promesa de AOV

- **Reproduccion:** en los carritos con prendas editoriales no aparecieron productos complementarios ni notas. Se anuncia Atelier Gift unlocked a partir de $250, pero no se explica que regalo es ni como se recibe. Las prendas probadas desbloquean envio ($150) y regalo ($250) con una sola unidad.
- **Impacto:** el centro del drawer queda desaprovechado; la barra pierde su papel de incentivo incremental para estas prendas y la promesa del regalo carece de detalles.
- **Propuesta:** configurar complementarios relevantes y comprar uno desde el drawer; explicar el beneficio y su mecanica real. Johandry debe aprobar umbrales segun margen/ticket, no el agente por intuicion. Ocultar promesas que no tengan cumplimiento definido.
- **Limite:** el calculo visual de umbrales SI funciono: $60 -> faltan $90; $120 -> faltan $30; $180 -> faltan $70 para regalo; $300 -> ambos desbloqueados. No se comprobo la tarifa de envio ni el regalo en un pedido final, y no se exige que el regalo sea obligatoriamente otra linea de carrito.

### UX-11 [P1] Cierre del menu visualmente oculto al abrir desde arriba

- **Reproduccion:** en portada movil, arriba del todo, abrir Menu. El anuncio superior permanece delante de la zona del titulo/cierre y la X no se distingue en la captura. El boton Close existe: rectangulo x=286.55, y=15.6, 44 x 44.
- **Impacto:** el usuario tactil debe descubrir que puede tocar una zona que no identifica claramente como cierre. El clic automatizado en Close funciono; no se afirma que Escape o la accion esten rotos.
- **Propuesta:** corregir el orden visual/espaciado entre anuncio, header y dialogos. Verificar tambien Search abierto desde el inicio, no solo despues de scroll.
- **Cierre:** titulo y X visibles, con contraste y foco perceptible, en todos los estados del anuncio y del sticky header.

### UX-12 [P2] Navegacion, footer y catalogo tienen friccion evitable

- Dos newsletters consecutivas con el mismo titulo y copy cierran la portada. El footer no ofrece acceso visible a FAQ, historia, envio o devoluciones; solo Search y Your Privacy Choices en su menu.
- La marca visible es Tema, el vendor es LINEA NOVE y la documentacion habla de Sartorial/Ruiz Digital. Separar claramente marca de la tienda demo, nombre del tema y autor, sin mezclarlos como identidades equivalentes.
- Documentation y Support ocupan dos de los cinco destinos principales de compra. No hay categorias de moda ni submenus que demuestren descubrimiento de catalogo.
- En 390 x 844 la barra completa de filtros y ordenacion empuja las primeras imagenes hasta aproximadamente y=670. Un control compacto de filtros/ordenacion dejaria ver producto antes, conservando todas las funciones.
- Solo se muestran disponibilidad y precio; las facetas por talla/color no estan configuradas. El singular del bundle produce "1 of 3 item selected".
- **Propuesta:** una sola captacion de newsletter, enlaces de confianza en footer, navegacion por categorias, identidad coherente, toolbar movil compacta y revision de copy. Mantener facetas y targets comodos; no ocultar funciones para simular minimalismo.

## 4. Riesgos de rechazo ante Shopify

La fuente normativa consultada es [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements), apartados de experiencia de compra, accesibilidad, demo y documentacion/soporte.

- **Accesibilidad:** UX-02 tiene un contraste medido incompatible con el minimo de 4.5:1 para texto normal. El hero y los cierres requieren medicion adicional sobre su composicion visible.
- **Compra:** UX-04 a UX-06 hacen menos clara la confirmacion de cantidades y la modificacion/continuacion de carrito. Son riesgos funcionales independientes del gusto visual.
- **Soporte/documentacion:** deben estar preparados, ser accesibles y corresponder a lo que ofrece el tema. Las rutas fallidas, el soporte ambiguo y el formulario mailto no acreditan ese resultado.
- **Demo:** se espera una tienda realista y coherente. La contaminacion QA inicialmente observada ya se corrigio; siguen pendientes contenido y navegacion intencionales.

**No inflar la norma:** Shopify actualmente establece 24 x 24 CSS px para targets, con excepciones; 44 x 44 es el objetivo mas exigente del proyecto. Los steppers y Sticky ATC medidos tienen 44px de alto. Tampoco se afirma que zoom, una FAQ con un handle concreto, cross-selling o un hero determinado sean por si solos requisitos mandatorios de aprobacion.

Ni una captura ni esta navegacion certifican el resto del paquete: no se revisaron originalidad de codigo, schemas, aplicaciones, traducciones completas, Markets, selling plans o pagos. La puntuacion es de la experiencia visitada.

## 5. Punch-list priorizada para Claude

1. **P0 | Publicacion de paginas y rutas (UX-01).** Confirmar tema/plantillas asignadas en Shopify con Gemini; publicar las cinco paginas previstas y reparar alias. No empezar reescribiendo componentes que podrian estar sin asignar. Aceptacion: recorrer todas las URLs, sin 404, desktop y movil.
2. **P0 | Aislar documentacion/soporte (UX-02).** Eliminar interferencias del contenido con header/estilos globales, duplicaciones semanticas y cortes de titulos. Aceptacion: header consistente, anuncio >=4.5:1 y lectura correcta a 390px.
3. **P0 | Soporte operativo (UX-03).** Sustituir el flujo principal mailto por el formulario web apropiado, unificar destinatario/SLA, separar consultas del comprador y reparar docs.html. Aceptacion: envio de prueba autorizado, recibido y confirmado, con errores controlados.
4. **P1 | Footer del drawer (UX-04).** Acomodar subtotal, Checkout y avisos dentro del viewport; contenido interior desplazable. Aceptacion: CTA completamente visible con contenido corto/largo y despues de mutaciones, en alturas 667/844/1000.
5. **P1 | Confirmacion de Sticky ATC (UX-05).** Mostrar la cantidad y el total que realmente se agregaran, manteniendo precio unitario diferenciado. Aceptacion: casos 1/2/3 unidades y cambio de variante sin discrepancias.
6. **P1 | Sincronizacion y ancho de /cart (UX-06).** Refrescar la pagina tras editar desde drawer y contener stepper/remove. Aceptacion: ninguna linea fantasma, importes iguales y cero scroll horizontal con titulos cortos/largos.
7. **P1 | Legibilidad del hero y cierre del menu (UX-07, UX-11).** Corregir encuadre/texto y composicion de capas del anuncio con dialogos. Aceptacion: producto legible, contraste medido y X visible al abrir desde arriba y tras scroll.
8. **P1 | Destinos editoriales y hotspots (UX-08).** Vincular proceso, lookbook y descubrimiento a contenido real; corregir coordenadas de los puntos sobre prendas. Aceptacion: todos los CTAs cumplen lo anunciado en ambos encuadres.
9. **P1 | Demo de PDP completa (UX-09).** Configurar tallas, swatches, guia/fit, varias fotos y politicas con el idioma elegido; verificar controles ya implementados antes de crear otros. Aceptacion: compra de una variante concreta y recorrido completo de galeria/informacion en desktop y movil.
10. **P1 | Complementarios y recompensa real (UX-10).** Configurar recomendaciones comprables en drawer y aclarar regalo/envio, con umbrales aprobados por negocio. Aceptacion: un cross-sell anadido, total correcto y condiciones del beneficio verificadas.
11. **P2 | Navegacion y footer (UX-12).** Separar ayuda para comerciantes de categorias de compra, publicar enlaces de confianza y conservar un solo newsletter. Aceptacion: encontrar categorias, historia y politicas sin conocer URLs de memoria.
12. **P2 | Catalogo movil y copy (UX-12).** Compactar filtros, activar facetas utiles, corregir el plural del bundle y normalizar la identidad de la demo. Aceptacion: productos visibles antes, filtros completos recuperables y copy consistente.

**Orden de trabajo recomendado:** primero reconciliar lo publicado con lo ya construido; despues reparar UI reproducida; por ultimo pulir merchandising. No ampliar el roadmap con nuevas secciones para esconder estos problemas.

### Verificacion y cierre del encargo

- `git status --short --branch`: master sincronizada y limpia antes de crear el informe. No se realizaron commit, push ni cambios de tema.
- Navegacion CUA con `goto`, locators, teclado y scroll: evidencia de los estados enumerados; no sustituye pruebas de navegadores/moviles adicionales.
- `getBoundingClientRect` y `document.documentElement.scrollWidth` sobre DOM visible: mediciones de UX-04, UX-06 y UX-11; no lectura de fuentes del tema.
- Colores computados de anuncio y fondo + formula de luminancia relativa sRGB: contraste 1.1327:1 a opacidad completa, UX-02.
- Carrito restaurado al vacio y confirmado por recarga de /cart. Ningun pedido completado ni formulario valido enviado.
- Se conserva el alcance de auditoria: Gemini decide el sprint de correccion y Johandry conserva la aprobacion de politica comercial, contenido y publicacion.
