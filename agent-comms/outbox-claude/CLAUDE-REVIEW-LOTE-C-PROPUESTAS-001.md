# CLAUDE-REVIEW-LOTE-C-PROPUESTAS-001

Fecha: 2026-11-06
Revisor: Claude Opus 5.5, contexto limpio, solo lectura (R-D prospectiva según V4.1 §5).
Escritor revisado: GPT/Codex.
Snapshot: rama `lote-d`, `258ca4f59910ebf3c024901a25f0010d69b13856` (clon temporal, fast-forward desde `9fc1394`, sin cambios locales).
Alcance: propuestas C-01, C-05 y C-07 del informe `GPT-LOTE-C-PREPARACION-20261106-016.md` (sección «Propuestas locales» y addenda), contrastadas con V4.1 §4.3, `docs/decisions.md`, `GPT-INFORME-CIERRE-20261106-001.md`, `GPT-PENDIENTES-JOHANDRY-001.md` y el código del tema. Nota breve sobre C-06 y el resto de C-*.
Límites: no se ejecutó tienda, editor, Theme Check ni navegador; no se abrió `.secrets`; no hubo commit ni push. Todo hallazgo de código es estático, con archivo:línea del snapshot. El repo principal de la carpeta conectada está en `sprint/F0` (`b45e913`); este informe se escribe ahí sin commit, pero revisa `lote-d`.

## 0. Veredictos

| Propuesta | Veredicto | Motivo principal |
|---|---|---|
| C-01 | APROBADA CON CONDICIONES | Alcance y baseline correctos; faltan presets, control de la barra de preview, criterio verificable sin umbral, persistencia de estado tras el re-render AJAX y precisión sobre Escape/foco. |
| C-05 | APROBADA CON CONDICIONES | Matriz correcta y prudente; omite el H1 vacío fuera de `page`, el `limit` de sección, las secciones huérfanas del ZIP y la autorización de escritura que exige la instalación. |
| C-07 | APROBADA CON CONDICIONES | Estrategia alineada con Shopify; omite un defecto vigente de variante equivocada, el caso `null`, consumidores del cambio de variante, la truncación del JSON y la vía concreta para `featured-product`, que implica un archivo nuevo (Nivel 2). |

Ninguna se rechaza: las tres son propuestas de directiva, no implementaciones, y sus carencias se pueden cerrar en la directiva sin rehacer el enfoque. Ninguna autoriza escritura. Las condiciones de C-07 marcadas como bloqueantes deben estar en la directiva antes de que GPT escriba código.

Trazabilidad: los tres `ACCEPT` «R-D independiente» del informe 016 (commit `c8e095f`) no identifican revisor, modelo ni hash del snapshot revisado, y no existe archivo de revisión propio. V4.1 §5 asigna la R-D a Claude. Este informe sustituye esos dictámenes como R-D de Claude para C-01/C-05/C-07; se recomienda registrar esa sustitución en STATUS.

## 1. C-01: jerarquía de colección móvil

### 1.1 Ajuste al plan y decisiones

Coincide con V4.1:276: baseline de viewport útil, posición de primera tarjeta con el mismo viewport, regresión de filtros/teclado/vacío, sin atribuir conversión y sin TT-26. Separar 390×844 y 1280×800 como pares independientes es correcto. Cerrar archivos en R-D (`sections/main-collection.liquid`, `assets/base.css`) y devolver si hace falta AJAX también lo es.

Falta: (a) los tres presets. `listings/*/templates/collection.json` existe para Sartorial, Imprint y Archive y la jerarquía puede variar por preset; V4.1 §6 exige regresión por preset. (b) Un criterio verificable aunque no haya umbral: sin umbral aprobado, la propuesta no dice qué resultado acepta la regresión. (c) Escritorio como invariante: el par 1280×800 debe demostrar que el layout de barra lateral sticky (`assets/base.css:4483-4492`, `8374`) no cambia.

Sobra: la exigencia de «Escape y devolución de foco» como regresión general. Hoy no hay drawer de filtros en colección: el formulario `.facets` va en línea (`sections/main-collection.liquid:57`) con `<details class="facet">` por filtro (`:78`), y `<details>` no cierra con Escape de forma nativa. Ese criterio solo aplica si la intervención introduce un disclosure o drawer nuevo.

### 1.2 Corrección técnica

`FacetFiltersForm` (`assets/theme.js:3794`) reemplaza todo el contenido del componente en cada filtrado (`this.innerHTML = nextElement.innerHTML`, `:3882`) y restaura el foco por `id`, después por `name` y después por un selector de reserva (`:3887-3897`). Consecuencias para cualquier cambio de jerarquía:

1. Un contenedor plegable nuevo para móvil («Filtrar» que agrupe `.facets`) volvería a su estado inicial tras cada filtro aplicado, porque el servidor lo pinta cerrado. O el estado abierto se deriva del servidor (como hace hoy `filter_is_open`, `:69-76`) o hay que tocar `theme.js`, y eso es AJAX: devolver a R-D según la propia propuesta.
2. Los controles nuevos necesitan `id` estables y únicos por sección, para que la restauración de foco siga funcionando.
3. La región viva `data-facet-live-region` está fuera del componente reemplazado (`:22-27`) y debe seguir ahí.

Rendimiento: el banner de colección es prioritario (`:44-52`, `prioritize: true`) y probablemente es el LCP móvil. Reordenarlo respecto a los controles puede cambiar el elemento LCP y el CLS. Las cifras móviles de colección (79-83) son diagnósticas, no baseline (informe 016, addendum Lighthouse); hay que registrar elemento LCP y CLS antes y después como observación, sin convertirlos en compuerta.

### 1.3 Riesgos

PDP: ninguno directo. Accesibilidad: orden DOM frente a orden visual (no reordenar solo con CSS `order` si cambia el orden de lectura o de tabulación), `aria-expanded`/`aria-controls` en cualquier botón nuevo, foco visible en los tres `motion_style` (A-03). Editor: un setting nuevo de sección requiere etiquetas `t:` y no debe alterar valores guardados. Sin JS: el botón de envío (`:236`) debe seguir visible y operativo.

### 1.4 Pruebas

Bastan en estructura, pero no son reproducibles todavía. Condiciones de reproducibilidad: misma preview y tema ID, colección y handle concretos, mismo preset, DPR fijo, `scrollY=0`, fuentes cargadas, y la barra de preview de Shopify ocultada o medida en ambos estados (en un tema no publicado ocupa altura del viewport y altera la «posición de la primera tarjeta»). Medir con `getBoundingClientRect().top` del primer hijo de `[data-product-list]` y `visualViewport.height`, con el script versionado en el harness. El estado vacío necesita una combinación de filtros sin resultados en el catálogo existente; si no existe, queda pendiente (la propuesta ya lo prevé).

### 1.5 Condiciones

C01-1. Matriz por preset (3) × viewport (390×844, 1280×800) × antes/después, mismo tema y colección.
C01-2. Criterio de aceptación sin umbral numérico: a 390×844 la primera tarjeta sube o queda igual con justificación; no desaparece ni se oculta ningún control de filtro u orden; a 1280×800 no hay diferencia de layout.
C01-3. Barra de preview controlada y script de medición versionado con su SHA-256.
C01-4. Escape y foco solo si se introduce un disclosure; en ese caso, reutilizar el contrato de `ThemeDrawer` (B-01) o devolver a R-D.
C01-5. Persistencia del estado abierto/cerrado tras el re-render de `FacetFiltersForm`, sin tocar `theme.js`; si no es posible, devolver a R-D.
C01-6. Elemento LCP y CLS registrados antes y después como observación.

## 2. C-05: tipos de página y contrato de H1

### 2.1 Ajuste al plan y decisiones

Coincide con V4.1:285: inspeccionar antes de restringir, probar editor e instalación y no aplicar mecánicamente. El inventario es correcto: las siete secciones tienen H1 (`main-page.liquid:13`, `main-documentation.liquid:31`, `main-support.liquid:47`, `main-about.liquid:22`, `main-policy.liquid:24`, `main-faq.liquid:49`, `main-contact.liquid:31`), preset (`:174`, `:307`, `:380`, `:368`, `:97`, `:261`, `:312`) y ningún `enabled_on`/`disabled_on`. Cada plantilla `templates/page*.json` contiene exactamente una sección `main-*`. Separar la restricción de tipo del contrato de H1 es la lectura correcta; la tabla repo frente a ZIP respeta D23 y C-04-P (`scripts/package-theme-zip.mjs:88`).

Falta:
1. El defecto concreto fuera de contexto. Las siete pintan `{{ page.title }}`. En home, producto o colección `page` es nil, así que la sección añadida genera un `<h1>` vacío además del H1 propio de la plantilla (por ejemplo `main-product.liquid:211`, `main-collection.liquid:37`). La propuesta lo presenta como hipótesis a observar; es comprobable en estático y debe figurar como hallazgo.
2. El atributo `limit` de sección. Shopify permite `"limit": 1` a nivel de sección para impedir añadirla dos veces a una misma plantilla ([Section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema)). Resuelve el caso «misma sección dos veces», no el de dos secciones distintas. Los `"limit": 1` existentes (`main-page.liquid:147`, `main-faq.liquid:232`) son de bloque, no de sección.
3. Secciones huérfanas en el ZIP. El empaquetador excluye solo las plantillas; `main-documentation` y `main-support` viajan con preset y sin plantilla, así que el comerciante las ve en «Añadir sección» de cualquier plantilla. Hay que decidir si C-05 les quita el preset, las restringe o si el caso vuelve a C-04-P.
4. La autorización de escritura. Subir el ZIP o guardar en el editor es escritura en tienda. La matriz depende de C-02 (tienda limpia, pendiente de Johandry) o de una autorización expresa sobre las previews; la propuesta no lo dice.

### 2.2 Corrección técnica

`enabled_on.templates` acepta tipos de página (o `["*"]`) y es excluyente con `disabled_on` (fuente citada). `["page"]` cubre todas las plantillas alternativas `page.*`, como dice la propuesta. La documentación no aclara si una referencia existente en una plantilla JSON de otro tipo sigue siendo válida tras restringir; por eso la prueba de instalación y de preservación es necesaria y está bien planteada. Alternativas que la directiva debe comparar: `enabled_on: {templates: ["page"]}` más `limit: 1` por sección (mínimo, conserva usos legítimos); quitar presets (impide crear plantillas alternativas de FAQ o contacto desde el editor, lo que rompe un uso legítimo, así que no se recomienda para las cinco incluidas); y un contrato de H1 único entre secciones distintas, que Liquid no puede coordinar entre secciones de forma fiable y que debería quedar documentado como limitación o resolverse con un setting de nivel de encabezado.

### 2.3 Riesgos

Bajos en PDP. Editor: perder la sección en contextos donde algún comerciante ya la usa (preservación, ya cubierta). Accesibilidad: `aria-labelledby` apunta a un H1 vacío fuera de contexto, lo que hoy produce una región sin nombre útil.

### 2.4 Pruebas

La matriz cubre lo necesario. Para que sea reproducible: exportar con `shopify theme pull` (lectura) las plantillas antes y después de cada guardado y comparar el JSON; capturar el selector «Añadir sección» por tipo de plantilla; registrar el número de `h1` y su texto con un selector DOM fijo. Añadir el caso «misma sección dos veces» separado de «dos secciones distintas».

### 2.5 Condiciones

C05-1. Registrar como hallazgo estático el H1 vacío fuera de `page`.
C05-2. Evaluar `limit: 1` de sección junto a `enabled_on`.
C05-3. Decidir el tratamiento de `main-documentation`/`main-support` en el ZIP, coordinado con C-04-P/D23.
C05-4. La instalación y el guardado en editor requieren tienda C-02 o autorización expresa de Johandry; sin ella, la matriz queda pendiente.
C05-5. Evidencia de preservación mediante diff JSON por lectura, no solo por inspección visual.

## 3. C-07: productos con muchas variantes

### 3.1 Datos de plataforma verificados

| Dato | Verificación | Fuente |
|---|---|---|
| `product.variants` devuelve 250 como máximo sin paginar | Confirmado | [Liquid product](https://shopify.dev/docs/api/liquid/objects/product), [high-variant](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products) |
| `variants_count` es el total | Confirmado | Liquid product |
| `/products/{handle}.js` incluye 250 variantes como máximo | Confirmado | [Ajax Product](https://shopify.dev/docs/api/ajax/reference/product) |
| Límite de 2048 variantes por producto para todos los comerciantes (15-10-2025) | Confirmado; la fuente más directa es el changelog, no el objeto Admin `ProductVariant` que cita el informe | [Changelog 2048](https://shopify.dev/changelog/the-product-variant-limit-is-now-2048-for-all-merchants) |
| Parámetro `option_values` con IDs de `product_option_value` separados por comas | Confirmado | high-variant |
| `product_option_value` expone `id`, `available` (descendente, según opciones previas), `selected`, `variant`, `product_url` | Confirmado | high-variant |
| Combinación sin variante: `selected_variant` y `selected_or_first_available_variant` devuelven `null` | Confirmado | high-variant |
| Section Rendering: `section_id` es el ID de plantilla o el nombre de archivo; los settings no se pasan; secciones estáticas o no encontradas usan valores por defecto; 404 si falta en petición simple; contexto Liquid del URL pedido | Confirmado | [Section Rendering](https://shopify.dev/docs/api/ajax/section-rendering) |
| «Themes are no longer required to support users that have disabled JavaScript» | Confirmado; el informe 016 no lo cita | high-variant |

### 3.2 Ajuste al plan y decisiones

Coincide con V4.1:287: fixtures 1/250/251+ en PDP y featured, estrategia oficial antes de la solución, guards de cards y complete-the-look intactos (excluir esos archivos es coherente). Respeta D25 al incluir `snippets/variant-no-js-select.liquid` y no introduce token Admin. Las referencias de línea se actualizaron correctamente respecto a V4.1 (bucle PDP en `main-product.liquid:727`, featured en `featured-product.liquid:477`, `VariantSelects` en `theme.js:585`).

Falta: la regresión explícita de las guardas que V4.1 enumera (`snippets/product-card.liquid:46,94,113`, `sections/complete-the-look.liquid:20-27,146-153`, recomendaciones `>100` en `snippets/cart-drawer-recommendations.liquid:141`). Aunque esos archivos queden fuera, la matriz debe comprobarlas con los fixtures de 250 y 251+. Choca con el plan: V4.1 prohíbe «truncar arbitrariamente JSON o selección», y la propuesta conserva sin decir nada el JSON de 250 (`main-product.liquid:725-778`, `featured-product.liquid:476+`) y el select sin JS de 250 (`variant-no-js-select.liquid:24`) para productos de más de 250.

### 3.3 Corrección técnica contra el código

Hallazgos que la propuesta no recoge:

H7-1 (bloqueante, defecto vigente de variante equivocada). `getInitialVariant()` (`assets/theme.js:642-645`) busca la variante del input oculto en el JSON y, si no la encuentra, usa `this.variantData[0]`. `connectedCallback` llama después a `updateForms(this.currentVariant)` (`:626`), que reescribe el `id` oculto (`:869-874`). Con más de 250 variantes y un enlace `?variant=` a una variante fuera de las primeras 250, el servidor pinta el selector visual con esa variante (`value.selected`, `main-product.liquid:257`) pero el formulario envía la variante 1. Es exactamente «mostrar B y enviar A», que B-02 y C-07 prohíben. La directiva debe nombrarlo y probarlo.

H7-2 (bloqueante). Con más de 250, `updateOptionAvailability()` (`theme.js:695-713`) desactiva los valores que solo aparecen en variantes fuera del JSON (`input.disabled = inStock.length === 0`), y `updateVariant()` (`:715-738`) devuelve `undefined` para combinaciones válidas fuera del JSON, mostradas como «Unavailable». No compra mal, pero hace inalcanzables combinaciones en stock. Con más de 250 el JSON no puede ser fuente de verdad parcial: o no se emite, o se marca como incompleto y la resolución pasa entera al servidor. Mezclar las dos fuentes produce estados inconsistentes.

H7-3 (bloqueante). El caso `null`. Para una combinación inexistente pedida por `option_values`, `selected_or_first_available_variant` es `null` (fuente high-variant). Hoy `main-product.liquid:2` y `featured-product.liquid:13` lo suponen no nulo: el input oculto sale con `value=""` (`:489`), y `variant-no-js-select.liquid:46-56` añade una opción `selected` con valor vacío. Además consumen la variante `snippets/price.liquid:22,37`, `snippets/product-inventory.liquid:2`, `snippets/product-provenance.liquid:21` y `snippets/pickup-availability` (`main-product.liquid:662`). La lista cerrada debe incluir los que necesiten protección contra nil o justificar que no la necesitan; `price.liquid` deja de ser opcional si la respuesta de servidor pinta precio para una combinación nula.

H7-4 (bloqueante). Consumidores de `theme:variant-change` (`theme.js:732`): `ProductGallery` (`:403`, `:449`), `ProductInventory` (`:1119`), `StickyCartBar` (`:1304`) y `PickupAvailability` (`:1647`). La barra sticky tiene su propio botón de compra: debe quedar deshabilitada mientras se resuelve y recibir la misma variante verificada. La directiva debe fijar la forma del `detail.variant` que emitirá la vía de servidor (mismos campos que el JSON actual) o enumerar qué consumidor cambia.

H7-5 (bloqueante, alcance). `featured-product`. La propuesta identifica bien el riesgo (los settings no viajan; un ID de sección de la home no existe en la URL del producto y da 404; por nombre de archivo se pinta con valores por defecto y `section.settings.product` queda vacío, `featured-product.liquid:2`), pero no da una vía que funcione. Además `<variant-selects>` de featured no tiene `data-product-url` (`featured-product.liquid:77-86`, frente a `main-product.liquid:187`). Vía recomendada: una sección mínima de estado de variante (por ejemplo `sections/variant-state.liquid`, sin preset) que se pide por nombre de archivo sobre `{{ product.url }}?option_values=…&section_id=variant-state`, usa el `product` global del URL (identidad correcta en las dos superficies), devuelve solo el estado necesario (id, disponibilidad, precios ya formateados con `money`, cantidades, medios, planes y el marcado del selector) e incluye `data-product-id` y `data-variant-id` para la verificación de identidad que la propia propuesta exige. Así se evita volver a pintar toda la sección del PDP en cada cambio, lo que también mejora rendimiento. Es un archivo nuevo fuera de la lista: Nivel 2, con autorización expresa de Johandry como en D25. La alternativa `?view=` con una plantilla alternativa también añade un archivo. Si se rechaza el archivo nuevo, la directiva debe demostrar otra vía dentro de la lista cerrada antes de escribir.

H7-6. Disponibilidad descendente frente a A360-05. El marcado del servidor desactiva los valores con `value.available` falso (`main-product.liquid:258-259`), que en Shopify es disponibilidad descendente según las opciones previas. El JS vigente corrige eso a propósito (comentario A360-05, `theme.js:692-694`) para no dejar inalcanzables combinaciones en stock. Si la vía de más de 250 sustituye el selector por HTML del servidor, reintroduce ese problema. El HTML devuelto no debe usar `disabled` por `value.available`; debe marcar «no disponible» con etiqueta y `aria-disabled` dejando el valor seleccionable, o la directiva debe justificar el cambio de contrato.

Puntos correctos de la propuesta: GET con `option_values` y Section Rendering es la vía oficial; mantener el ATC deshabilitado mientras se resuelve y tras un fallo; verificar identidad de producto y variante antes de aplicar; `AbortController` más número de secuencia contra respuestas fuera de orden; conservar sin cambios la ruta de 250 o menos; no meter token Admin.

### 3.4 Riesgos

PDP: H7-1 es una regresión latente ya presente; cualquier cambio en `getInitialVariant`/`updateForms` debe probarse también con 250 o menos para no romper B-02/A-01 (FormData `id` y `selling_plan` completos, V4.1 §4.1). Accesibilidad: no sustituir el nodo enfocado; si se reemplaza el grupo de radios, restaurar el foco por `id` (los IDs `option-<sección>-<posición>-<índice>` de `main-product.liquid:239` son estables), marcar `aria-busy` en el selector durante la petición, anunciar una sola vez en la región `data-variant-status` existente (`main-product.liquid:713`, `featured-product.liquid:462`) tras la respuesta válida y evitar que el ATC pierda el foco al deshabilitarse. Rendimiento: limitar la frecuencia de cambios rápidos, cachear por clave `option_values` y no emitir el JSON truncado con más de 250 (el JSON actual incluye planes por variante y puede pesar mucho). Editor: la sección de estado no debe aparecer en «Añadir sección» (sin preset y con `enabled_on` restringido si procede); comprobar `shopify:section:load` y el cambio del producto de featured en el editor; no llamar a `history.replaceState` en featured (hoy se salta por falta de `data-product-url`, debe seguir así).

### 3.5 Pruebas y fixtures

La matriz es amplia y bien orientada (inexistente, agotada, URL, 404/null, concurrencia, featured en home y en otro PDP). Para que baste y sea reproducible:

1. Fixture «1»: separar producto con solo variante por defecto (sin selector, `has_only_default_variant`) y producto con una variante real con opción.
2. Fixture «250»: producto cartesiano exacto, por ejemplo 10×5×5, con algún valor agotado.
3. Fixture «251+»: 251 es primo, así que no hay rejilla cartesiana de 251 con varias opciones; usar una matriz incompleta (por ejemplo 13×20 = 260 menos 9 combinaciones) que además genera combinaciones inexistentes. Incluir: una variante en posición mayor de 250 que sea la única disponible, un valor de opción que solo exista más allá de la posición 250 y un enlace `?variant=` a una variante en posición 300 (prueba de H7-1).
4. Opcional de rendimiento: un producto cercano a 2048.
5. Cada fixture con handle, número de variantes, posición de las variantes de prueba y planes de venta registrados; publicados en el canal Tienda online de la tienda autorizada. Los crea Johandry (pendiente ya listado en `GPT-PENDIENTES-JOHANDRY-001.md`).
6. Cada celda con FormData completo (`getAll('id')`, `getAll('selling_plan')`), estado del ATC principal y del sticky, y, solo si se autoriza, payload y línea de carrito bajo las reglas D28.
7. Regresión estática y empírica de las guardas de cards, complete-the-look y recomendaciones con los fixtures de 250 y 251+.
8. Respuestas 404, `null`, producto equivocado y desorden generadas con un arnés de red sintético etiquetado como tal, además de la prueba real.

### 3.6 Condiciones

C07-1 (bloqueante). Nombrar y corregir H7-1 en la directiva, con prueba de enlace profundo.
C07-2 (bloqueante). Fuente única de resolución con más de 250 (H7-2): JSON no emitido o marcado como incompleto y no usado para resolver.
C07-3 (bloqueante). Manejo de `null` en servidor y cliente, y barrido de consumidores Liquid (H7-3).
C07-4 (bloqueante). Contrato de `theme:variant-change` y de la barra sticky (H7-4).
C07-5 (bloqueante). Vía concreta para featured con identidad verificable; si implica archivo nuevo, autorización Nivel 2 de Johandry antes de escribir (H7-5).
C07-6. Preservar la semántica A360-05 en el HTML del servidor (H7-6).
C07-7. Fixtures según §3.5 y regresión de guardas.
C07-8. Foco, `aria-busy`, anuncio único y ATC deshabilitado sin pérdida de foco.
C07-9. Corregir la cita del límite de 2048 al changelog oficial.
C07-10. Decisión sin JS según §4, registrada en `docs/decisions.md` antes de implementar.

## 4. Recomendación sobre más de 250 variantes sin JavaScript

Hoy, sin JS y con más de 250 variantes, `variant-no-js-select.liquid` lista las primeras 250 más la seleccionada (`:24-56`). Nunca envía una variante distinta de la mostrada en el select, pero deja inalcanzables las demás sin JS y es exactamente la truncación arbitraria que V4.1:287 prohíbe.

Recomendación: adoptar como contrato la **navegación GET por `option_values` sin JS** para productos con `variants_count > 250`, y mantener sin cambios el select nativo de B-02 para 250 o menos.

Contrato propuesto:
1. Con más de 250, el snippet ya autorizado por D25 deja de pintar el select de 250 y pinta, por opción, los valores como enlaces (o un formulario GET por opción) a `{{ product.url }}?option_values=<IDs>`, sustituyendo en la lista de valores seleccionados solo el ID de esa opción y usando `product_option_value.id`.
2. El servidor resuelve la variante con `selected_or_first_available_variant`. Si es `null`, el envío queda deshabilitado con el texto «Unavailable» y ningún `id` vacío se envía.
3. El input `id` del formulario sin JS es siempre la variante resuelta y mostrada, de modo que nunca se compra otra.
4. Los planes de venta siguen el contrato no-JS vigente (`main-product.liquid:589`) sobre la variante resuelta.
5. Si JS está activo, toma el control como hoy (`takeOverNativeControls`, `theme.js:651-659`).

Justificación: cubre hasta 2048 variantes sin listar variantes; reutiliza la misma resolución del servidor que necesita la vía con JS (una sola fuente de verdad); cumple la prohibición de truncar de V4.1; queda dentro de un archivo ya autorizado; y alivia el riesgo de LiquidComplexity que motivó D25 al sacar del bucle de 250 la rama de más de 250. Shopify ya no exige soporte sin JS, así que el coste debe ser acotado: si la R-D estima que supera 0,5 d o que el snippet rebasa el límite de complejidad, la alternativa aceptable es la mínima: con más de 250 y sin JS, mostrar solo la variante resuelta del URL con su estado, un aviso localizado de que se necesita JavaScript para cambiar de opción y el `id` correcto, sin listar las 250 primeras. En ningún caso conservar la lista truncada de 250. Johandry decide entre la vía principal y la mínima; la decisión se registra en `docs/decisions.md` antes de implementar.

## 5. Otras tareas C-*

C-06: la hipótesis sobre `menu="{{ section.settings.customer_account_menu }}"` (`sections/header.liquid:191`, setting `link_list` en `:239-241`) está bien planteada como no verificada y coincide con V4.1:286; sin propuesta de cambio no hay veredicto. C-02, C-03, C-04-* y C-08 no tienen propuesta nueva en el snapshot: C-02 depende de la tienda limpia; C-03 sigue sin G2 aceptado (18 celdas con `executionResult=failed`, ninguna móvil por debajo de 70, así que no se activa); C-04-P/R ya tienen aceptación independiente limitada al ZIP candidato. No se revisan aquí.

## 6. Dependencias de Johandry derivadas de esta revisión

1. Fixtures C-07 según §3.5.
2. Decisión sin JS de §4 (vía principal o mínima).
3. Autorización Nivel 2 del archivo de estado de variante (H7-5), o rechazo para que la directiva proponga otra vía.
4. Tienda C-02 o autorización expresa de escritura para la matriz C-05.
5. Tratamiento de `main-documentation`/`main-support` en el ZIP (C05-3).

## 7. Afirmaciones falsables

1. `assets/theme.js:642-645` devuelve `variantData[0]` cuando el `id` inicial no está en el JSON, y `:626` lo aplica al formulario.
2. `sections/featured-product.liquid:77-86` no define `data-product-url`.
3. Las siete secciones `main-*` del C-05 tienen preset y pintan `page.title` en su H1.
4. `scripts/package-theme-zip.mjs:88` excluye solo las dos plantillas, no sus secciones.
5. `snippets/variant-no-js-select.liquid:24` recorre `product.variants` sin rama para `variants_count > 250`.
6. La página oficial de high-variant declara que los temas ya no tienen que dar soporte sin JavaScript y que `selected_or_first_available_variant` es `null` cuando la combinación no tiene variante.
