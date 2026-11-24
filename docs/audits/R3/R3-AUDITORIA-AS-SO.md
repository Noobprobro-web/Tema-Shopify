# Informe final reconciliado R3 — Auditoría Shopify Theme Store

## 1. Integridad y capacidad

- SHA-256 comprobado: `fed126f030cb626f6210337ee24e45b9a356965f07cd2e2fee6de2fa88acd69f` (coincide). Tamaño: 320 052 bytes. Entradas: 105 archivos, sin entradas de directorio; tamaño descomprimido: 1 382 432 bytes.
- Las 105 rutas y tamaños coinciden con el Anexo A. No hay faltantes, extras, rutas inseguras ni discrepancias de CRC.
- Modo A: Astra 6.2 y Sol 6.2 trabajaron en paralelo; la fusión fue estática. Astra alcanzó su límite de uso antes de entregar su informe completo. Sol contraauditó las citas de Astra de severidad media o mayor; la auditoría cruzada no fue simétrica.
- Herramientas: Python 3 (`zipfile`, scripts de inventario y conteo), `nl -ba`, `rg -n` y lectura por tramos. No se ejecutó ni renderizó el tema y no se accedió a tiendas ni a internet. Fuentes: únicamente la ZIP y el prompt de auditoría.

| Auditor | Archivos leídos enteros | Leídos en parte | No leídos |
|---|---|---|---|
| Astra | Los 105; el registro de cobertura contiene tramos de todos los archivos. | Revisión directa por tramos de `assets/theme.js` y `assets/base.css`, además de lectura textual completa por script. | Ninguno declarado. |
| Sol | Los 105 por script; revisión estructural de JSON, schemas, plantillas y presets. | Revisión directa por tramos de assets largos. | Ninguno declarado. |

Sol parseó 31 JSON y 37 schemas Liquid y contrastó 26 composiciones. Se comprobaron las 20 citas de ambos informes por texto y línea.

## 2. Resumen ejecutivo

Veredicto de submission: CONDICIONAL

- Hay defectos de interacción y compra en escenarios específicos (R3-AS-01, R3-AS-04, R3-AS-03, R3-AS-05).
- Hay presets con contenido de muestra o instrucciones que no corresponden a la composición (R3-SO-01, R3-SO-02, R3-SO-09).
- La ZIP permite escenarios de compra y merchandising confusos (R3-SO-03, R3-SO-04, R3-SO-06, R3-AS-10).
- Lighthouse móvil 86–93 parece plausible, pero no se midió con esta ZIP en tienda. Imágenes, vídeo, catálogo y apps pueden alterar el resultado.
- Cero violaciones axe es plausible para los estados probados, pero axe no demuestra buen foco ni anuncios dinámicos. Los resultados descritos y el registro interno de 77 filas no se pueden verificar desde la ZIP.

## 3. Hallazgos

| ID | Severidad | Certeza | Área | Archivo:línea | Cita literal | Problema y requisito incumplido | Cómo reproducirlo o verificarlo | Arreglo propuesto | Visto por | Ref. ronda previa |
|---|---|---|---|---|---|---|---|---|---|---|
| R3-AS-01 | alto | inferido | Accesibilidad | `assets/theme.js:2123` | `this.innerHTML = nextPickup.innerHTML;` | Al abrir pickup mientras se actualiza la variante, la respuesta reemplaza el panel y ejecuta `setClosedState` sin liberar el focus trap, `inert` del fondo ni bloqueo de scroll. Si la nueva variante no tiene ubicaciones, Escape puede no cerrar ese estado. Riesgo para teclado y orden de foco; WCAG 2.2, 2.1.1 y 2.4.3. | En una ficha con variante A disponible para pickup y B sin ubicaciones, ralentizar la solicitud, elegir B, abrir el panel anterior antes de la respuesta y comprobar Tab, Escape, scroll e `inert`. | Cerrar por la ruta completa antes de sustituir u ocultar el panel y no permitir abrir contenido obsoleto. | ambos | — |
| R3-AS-02 | medio | inferido | Merchandising/UX | `assets/theme.js:3998` | `if (nextPage && currentPage?.isConnected) currentPage.replaceWith(nextPage);` | Abrir el cajón desde `/cart` resincroniza y reemplaza el formulario de página. La conservación de campos sucios solo se aplica en el cajón, por lo que una nota o cantidad aún no enviada puede perderse. Conservación de cambios pendientes, requisito sin verificar. | En `/cart`, editar una nota sin enviarla y abrir el cajón; comparar el campo tras la sincronización. | No reemplazar la página al abrir el cajón si no hubo mutación; conservar los campos editados. | Astra | — |
| R3-AS-03 | medio | verificado | Accesibilidad | `assets/theme.js:5769` | `window.clearTimeout(this.searchTimer);` | Cerrar predictive search durante el debounce cancela la consulta, pero conserva el término y el estado de carga. Al reabrir no se repite hasta que cambie el texto. Función de búsqueda y mensajes de estado; WCAG 2.2, 4.1.3. | Escribir dos letras y pulsar Escape antes de 200 ms; reabrir y esperar. Comparar con cerrar tras recibir resultados. | Repetir la consulta al reabrir si los resultados no corresponden al término y limpiar la carga al cancelar. | ambos | G-A11Y-07 |
| R3-AS-04 | medio | verificado | Liquid/JSON/schema | `sections/main-product.liquid:620` | `{%- for allocation in selected_variant.selling_plan_allocations -%}` | Sin JS, cambiar variante cambia el ID de compra pero `min`, `step`, `max` y selling plans quedan asociados a la variante inicial. Se fusiona con R3-SO-05. | Desactivar JS y elegir variantes con reglas de cantidad o planes distintos; inspeccionar el formulario. | Volver a renderizar o navegar al cambiar de variante cuando difieran las reglas de compra. | ambos | G-LIQ-02 |
| R3-AS-05 | medio | verificado | Accesibilidad | `assets/theme.js:4416` | `const origin = options.origin || activeEl;` | La respuesta de filtros restaura el foco al checkbox que inició la petición aunque la persona ya haya tabulado a otro filtro. WCAG 2.2, 2.4.3. | Con red lenta, activar un checkbox y tabular al siguiente antes de que termine la solicitud; observar el foco al finalizar. | Respetar el foco actual si la persona avanzó; restaurar el origen solo si el reemplazo lo perdió. | ambos | F-A11Y-01, G-A11Y-01 |
| R3-AS-06 | bajo | verificado | Rendimiento | `sections/main-product.liquid:100` | `{% render 'product-media', media: media, product: product, prioritize: forloop.first, sizes: media_sizes %}` | En thumbnails, `?variant=` puede seleccionar un medio distinto del primero: el oculto recibe `eager/high` y el visible `lazy/auto`. Efecto LCP no medido. | Abrir una variante cuya imagen sea la segunda; comparar atributos y medir LCP con caché fría. | Priorizar el medio seleccionado en thumbnails y definir aparte la prioridad de galerías con varias imágenes visibles. | Astra | — |
| R3-AS-07 | bajo | verificado | Higiene ZIP | `sections/main-product.liquid:18` | `Una variante que exige plan de venta y no tiene ninguno` | Quedan comentarios de implementación en español en cuatro bloques de la ficha. Fusionado con R3-SO-07; requisito de higiene del prompt, no rechazo oficial verificado. | Leer bloques de comentario en líneas 17–22, 32–35, 48–50 y 59–61. | Traducir o retirar comentarios internos. | ambos | F-MANT-01, F-MANT-02, F-MANT-03, G-MANT-02, G-DOC-02 |
| R3-AS-08 | medio | inferido | Merchandising/UX | `assets/theme.js:1019` | `const variant = this.variantData.find(` | La tarjeta enlaza opciones de productos hermanos, pero la ficha busca variantes solo en el producto actual; la ruta servidor también rechaza otro `productId`. Una opción de Combined Listings podría no conducir al hermano. Requisito de compatibilidad sin verificar desde la ZIP. | En tienda con Combined Listings, elegir opción de producto hermano desde una tarjeta y desde ficha; comparar URL, imagen y variante. | Pasar la URL del destino al selector y navegar o cargar la ficha del producto hermano. | ambos | — |
| R3-AS-09 | medio | inferido | Localización | `snippets/variant-no-js-select.liquid:36` | `"price": {{ variant.price \| money \| json }},` | `money` se serializa como texto y luego se inserta con `textContent`. Si el formato monetario contiene markup permitido, ese markup podría mostrarse literalmente. Depende de la configuración de la tienda. | Probar un formato con elemento de presentación y comparar el precio antes/después de hidratar y cambiar variante. | Serializar texto sin markup o usar el formato monetario común manteniendo `textContent`. | ambos | — |
| R3-AS-10 | medio | inferido | Merchandising/UX | `assets/theme.js:5947` | `const compareAtPrice = Number.parseFloat(product.compare_at_price_min || product.compare_at_price_max || 0);` | Predictive search puede combinar el precio de una variante con un compare-at agregado de otra, tachando un importe que no corresponde a esa oferta. Depende de la respuesta real del endpoint. | Usar un producto con una variante sin rebaja y otra rebajada; inspeccionar payload y tarjeta de búsqueda. | Omitir compare-at si los importes no pertenecen a la misma variante; mostrar “Desde” cuando aplique. | ambos | G-LIQ-03 |
| R3-AS-11 | medio | inferido | Rendimiento | `sections/main-list-collections.liquid:41` | `sizes: '(min-width: 62rem) 33vw, (min-width: 48rem) 50vw, 100vw'` | Para 2 columnas a 1024 px, `sizes` declara 338 px frente a un track estimado de 484 px; el navegador podría elegir una imagen menor. | Comparar `sizes` con tracks CSS a 1024 px y revisar el `srcset` seleccionado a DPR 1. | Calcular `sizes` a partir de columnas y breakpoints reales. | ambos | — |
| R3-SO-01 | medio | verificado | Merchandising/UX | `listings/archive/templates/index.json:84` | `"description": "<p>Explore each piece through the points placed across the composition.</p>",` | Archive invita a recorrer marcadores aunque sus bloques no tienen productos y el storefront oculta marcadores. El texto reaparece al añadir el preset sin editar. Coherencia del contenido inicial, requisito oficial sin verificar. | Instalar Archive sin productos y revisar home y preset de lookbook. | Usar copy neutral con cero productos; mostrar instrucciones solo con marcadores utilizables. | Sol | F-UX-13 |
| R3-SO-02 | medio | verificado | Estados degenerados | `sections/bento-discovery.liquid:157` | `<div class="bento-discovery__product-placeholder" aria-hidden="true">` | Mixed content grid muestra ilustraciones y barras de muestra sin producto. Imprint trae dos bloques vacíos por defecto; el cliente ve tarjetas sin ficha ni precio. | Abrir Imprint recién instalado; sus bloques `card_product` vienen sin producto en `listings/imprint/templates/index.json:54–64`. | Ocultar placeholders en storefront y conservarlos solo en design mode. | Sol | F-UX-C1 |
| R3-SO-03 | medio | inferido | Accesibilidad | `sections/bento-discovery.liquid:129` | `<div class="bento-card__body rte">{{ block.settings.body }}</div>` | Story card permite un enlace de tarjeta y rich text con otro enlace; esa combinación puede producir enlaces anidados y un orden de foco inesperado. | Configurar ambos enlaces en editor y revisar DOM y teclado. | Usar contenedor y enlaces separados para título, CTA y cuerpo. | Sol | — |
| R3-SO-04 | medio | verificado | Merchandising/UX | `snippets/product-card.liquid:128` | `assign quick_add_quantity = current_variant.quantity_rule.min \| default: 1` | Con mínimo mayor que uno, quick add envía esa cantidad oculta mientras la tarjeta muestra precio unitario y CTA genérico; no informa el total antes de añadir. | Producto de una variante, precio 40 y mínimo 6; comparar precio mostrado e input de cantidad. | Mostrar mínimo y subtotal o dirigir a ficha si el mínimo supera uno. | Sol | G-LIQ-01 |
| R3-SO-06 | medio | verificado | Consistencia | `snippets/product-provenance.liquid:23` | `product.variants.size == 1 and current_variant.inventory_management != blank and current_variant.inventory_policy == 'deny'` | “Show unique piece label” puede anunciar “Single archival piece” para una variante con varias unidades de inventario, contra el significado indicado en el editor. | Activar la etiqueta en producto Archive de una variante y 40 unidades. | Validar cantidad real o usar un ajuste explícito de unicidad por producto. | Sol | — |
| R3-SO-08 | bajo | verificado | Localización | `sections/cart-drawer.liquid:203` | `<span>{{ property.first \| escape }}:</span>` | Propiedades nativas de gift card permanecen en inglés en carrito y drawer con locale español, aunque el formulario las traduzca. | Comprar gift card con destinatario en español y revisar drawer y página de carrito. | Traducir las etiquetas nativas en la vista de carrito; preservar propiedades arbitrarias. | Sol | — |
| R3-SO-09 | bajo | verificado | Merchandising/UX | `listings/imprint/templates/collection.json:12` | `"text": "<p>Toggle between compact 4-column matrix and detailed 2-column inspection view.</p>",` | El copy promete cuatro y dos columnas, pero móvil muestra dos y una; sin JS el selector no aparece. | Abrir colección Imprint a 390 px con cuatro productos y comparar copy con layout responsive. | Sustituir por copy sin promesa fija de columnas. | Sol | F-UX-02 |

## 4. Verificado y correcto

- **F-TSR-C1** corregido: `snippets/social-links.liquid:44`, `{%- render 'icon', name: network, size: 22 -%}`.
- **F-TSR-C2, F-N3** corregidos en Featured product: `sections/featured-product.liquid:80,88`; recorre los medios y prioriza el seleccionado.
- **G-LIQ-02** corregido para variante disponible con mismas reglas: `snippets/product-submit-button.liquid:24`. Las reglas distintas quedan en R3-AS-04.
- **G-LIQ-01** cantidad enviada corregida: `snippets/quick-add-mode.liquid:17`, `snippets/product-card.liquid:384`. La claridad del subtotal queda en R3-SO-04.
- **G-LIQ-03** precio comparado por variante corregido en `snippets/price.liquid:70`; la regresión de predictive search queda en R3-AS-10.
- **G-LIQ-07** prioridad de recomendaciones corregida en `snippets/cart-drawer-recommendations.liquid:84,299`.
- **G-LIQ-06** precio unitario de línea en `sections/cart-drawer.liquid:236` y `sections/main-cart-items.liquid:105`.
- **F-LIQ-04** doble escape eliminado en `sections/main-article.liquid:125`; sanitización real de Shopify no probada.
- **F-LIQ-02, F-LIQ-03, F-SEC-05** `escape_once` en `sections/slideshow.liquid:187` y `sections/video.liquid:94`.
- **G-UX-08** modo de movimiento “None” conserva carril estático en `assets/base.css:9750`.
- **F-UX-C1, G-UX-02, F-N1, G-UX-05** Curated showcase conserva paneles sin JS y condiciona tarjetas secundarias al editor; R3-SO-02 es un caso distinto.
- **F-UX-02, F-UX-13, G-UX-03, F-I18N-C1** correcciones parciales de copy en presets; persisten los casos R3-SO-01 y R3-SO-09.
- **F-TSR-02** selling plans presentes en `sections/main-product.liquid:518`.
- G-A11Y-03, F-A11Y-03/05, F-A11Y-06 y G-A11Y-05 se marcaron como corregidos en la auditoría previa; no se incluyen como defectos nuevos. Sus citas no estuvieron todas disponibles para verificación independiente en la fusión.

### Residuales vistos

- **G-I18N-01:** CTA `/collections/all`, por ejemplo `listings/sartorial/templates/index.json:22`.
- **G-SEC-01:** Recently viewed usa `localStorage`, `assets/theme.js:1513`.
- **G-TSR-01:** estimado ignora `quantity_price_breaks`, `assets/theme.js:1333`; condición del Theme Store sin verificar.
- **G-SEC-04:** Vimeo sin `dnt=1`, `sections/video.liquid:129`.
- **G-SEC-03:** tratamiento de URL `/uploads/` en `sections/main-cart-items.liquid:74`.
- **G-I18N-06:** “Subscribe and save”, `locales/en.default.json:498`.
- **G-I18N-04:** “Atelier” en estilo de movimiento, `locales/en.default.schema.json:23`.
- **G-I18N-05:** texto español “Ver imagen” para medios, `locales/es.json:464`.
- **G-MANT-01:** lógica `inert` repetida, por ejemplo `sections/header.liquid:53` y `sections/cart-drawer.liquid:62`.
- **G-PERF-06:** CSS/JS globales, `layout/theme.liquid:58,101`.
- **G-UX-01:** pestañas de listings apuntan a `all`, por ejemplo `listings/imprint/templates/index.json:88`.

## 5. Riesgos de rechazo en el Theme Store

1. **Medio — presets y contenido inicial:** R3-SO-01, R3-SO-02, R3-SO-09. La demo inicial muestra ejemplos incompletos o copy que no coincide con el layout. Requisito oficial específico sin verificar.
2. **Medio — interacción y compra:** R3-AS-01, R3-AS-03, R3-AS-04, R3-AS-05 y R3-SO-03. Hay escenarios de teclado, red lenta y variantes que requieren pruebas funcionales.
3. **Medio — claridad comercial:** R3-SO-04, R3-SO-06 y R3-AS-10 afectan expectativa de cantidad, unicidad o rebaja.
4. **Bajo — idioma y prioridad de imagen:** R3-AS-06, R3-AS-07, R3-SO-08.

## 6. Veredicto de submission

**CONDICIONAL.** Resolver o probar con evidencia los hallazgos R3-AS-01, R3-AS-03, R3-AS-04, R3-AS-05, R3-AS-08, R3-AS-09, R3-AS-10, R3-SO-01, R3-SO-02, R3-SO-03, R3-SO-04, R3-SO-06 y R3-SO-09. Después repetir pruebas de accesibilidad y funcionales en tienda. No se confirmó un incumplimiento explícito de requisito obligatorio del Theme Store solo con esta revisión estática.

## 7. Preguntas abiertas

- Probar los nueve listings en tienda con cero, uno y muchos productos; home, colección y ficha en móvil/escritorio, con título de 120 caracteres, vendor largo, medios ausentes y 40 variantes.
- Probar pickup, filtros, predictive search, cajones y foco con red lenta en Chromium y Safari; repetir con VoiceOver/Safari iOS y NVDA/Firefox.
- Validar checkout con selling plans, cantidad, gift cards, pickup, precios unitarios, notas, accelerated checkout, app blocks y customer accounts.
- Probar Combined Listings y formatos monetarios de comerciantes; comparar el payload de predictive search con los precios mostrados.
- Repetir axe y Lighthouse para la ZIP final y las nueve combinaciones preset/página. No se validaron aquí las mediciones citadas.
- Confirmar los requisitos vigentes sobre volume pricing y comportamiento del contenido de muestra. Comprobar URLs de documentación, idiomas, pagos, apps y markets desde tienda; no se accedió a ellos.

## 8. Reconciliación entre auditores

### 8.1 Coincidencias

- **R3-AS-04 / R3-SO-05:** misma causa raíz en selector de variantes sin JS; se conserva R3-AS-04.
- **R3-AS-07 / R3-SO-07:** mismos comentarios en español de `sections/main-product.liquid`; se conserva R3-AS-07.
- Sol confirmó las citas de Astra medias o mayores y no propuso retiradas. Las citas de ambos informes se cotejaron por texto y línea. Los hallazgos que dependen de una tienda o navegador permanecen inferidos.

### 8.2 Discrepancias

| Tema | Astra | Sol | Cómo se resolvió |
|---|---|---|---|
| R3-AS-01 pickup | Alto, inferido | Confirmó que si la variante nueva no tiene pickup, Escape retorna antes de liberar el modal. | Se mantiene alto, inferido; revisé las rutas de `updateForVariant`, `setClosedState` y `close`. |
| R3-AS-02 carrito | Medio, inferido | Confirmó el escenario de edición sin enviar. | Se conserva como inferencia; requiere reproducción en tienda. |
| R3-AS-03 búsqueda | Medio, verificado | Confirmó que difiere de reabrir resultados que ya llegaron. | Confirmado; la cancelación antes de la respuesta deja búsqueda pendiente sin relanzar. |
| R3-AS-04 / R3-SO-05 | Medio | Misma falla de reglas y planes por variante sin JS. | Fusionados en R3-AS-04. |
| R3-AS-05 filtros | Medio, verificado | Confirmó el caso de checkboxes que siguen disponibles. | Se mantiene medio; no se generaliza al caso distinto de checkbox desaparecido. |
| R3-AS-06 prioridad de imagen | Bajo | Fuera del foco de Sol. | Se conserva como bajo; impacto LCP no medido. |
| R3-AS-08 Combined Listings | Medio, inferido | Confirmó dependencia de tienda con Combined Listings. | Se mantiene inferido; no se marca como obligación oficial verificada. |
| R3-AS-09 formato monetario | Medio, inferido | Confirmó que depende del formato configurado. | Se mantiene inferido; falta prueba con ese formato. |
| R3-AS-10 precio predictivo | Medio, inferido | Confirmó dependencia del payload real. | Se mantiene inferido; falta inspección del endpoint en tienda. |
| R3-AS-11 `sizes` | Medio, inferido | Confirmó el cálculo. | Se mantiene inferido; falta comprobar `srcset` en navegador. |
| R3-SO-03 Story card | Medio, inferido | Confirmó por código/schema. | Se mantiene inferido; falta inspección del DOM renderizado. |
| R3-SO-04 quick add | Medio, verificado | Confirmó la diferencia entre cantidad enviada y claridad del costo. | Se conserva como problema de claridad, separado de G-LIQ-01. |
| R3-SO-06 etiqueta de pieza única | Medio, verificado | Confirmó que el ajuste está desactivado de fábrica. | Se mantiene medio: el ajuste puede activarse y no coteja stock con unicidad. |

### 8.3 Hallazgos retirados

| ID | Afirmación | Motivo de la retirada |
|---|---|---|
| — | — | No se retiraron hallazgos. Los dos duplicados se fusionaron en 8.1. |

FIN DEL INFORME
