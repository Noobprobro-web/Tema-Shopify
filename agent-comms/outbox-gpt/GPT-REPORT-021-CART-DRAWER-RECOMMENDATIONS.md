ID: GPT-REPORT-021-CART-DRAWER-RECOMMENDATIONS

Estado: Documento de diseño y auditoría de producto para Fase 2; propuesta pendiente de decisión e implementación. Fecha: 2026-10-08, America/Caracas. No certifica funcionalidad en tienda.

Decisión requerida: Johandry decide la política comercial y la experiencia por preset. Claude, líder técnico temporal, prioriza la implementación y sus bloqueantes. Gemini evalúa el contrato técnico y autoriza expresamente las desviaciones de Nivel 2 antes de editar IDs, defaults, límites o nuevas opciones.

Resumen en 5 líneas:
1. El complemento debe aportar una razón de uso verificable a la compra principal; se recomiendan como máximo dos productos.
2. La adición directa se reserva a productos simples; las variantes requieren elección explícita y los productos complejos se derivan a su PDP.
3. La cascada propuesta es metafield, recomendaciones complementarias nativas, bloques manuales y colección, completando huecos después de filtrar y deduplicar.
4. Las fuentes dinámicas son opt-in; la curaduría manual debe funcionar sin instalar una app y el checkout conserva prioridad.
5. El contrato, el JSON y las pruebas siguientes son propuestas revisables: no se ha implementado código ni validado Gate 5.

Archivos tocados: Únicamente este informe, `agent-comms/outbox-gpt/GPT-REPORT-021-CART-DRAWER-RECOMMENDATIONS.md`. No se modifican fuentes, locales reales, ZIP, tablero ni ledger. Ninguna fila de `docs/requirements-ledger.md` queda cerrada o modificada.

Desviaciones (Nivel 1 o Nivel 2): No hay desviación de código ejecutada. Añadir settings, cambiar el default del encabezado o ampliar el escaneo de colección de 6 a 50 productos constituye una propuesta de Nivel 2 y exige autorización explícita de Gemini. El alcance documental permite describirla, no aplicarla.

Hallazgos extra fuera de alcance (con parche listo): No se entrega ni se afirma tener un parche listo. Los riesgos de compra ciega de variantes, fallback bloqueado por la existencia de bloques y semántica de “Complimentary additions” forman parte de esta tarea y se desarrollan en los tracks siguientes.

Verificación (comando, resultado y qué demuestra/qué no): Este documento integra los informes directos de tres agentes especializados y distingue hallazgos de disco, fuentes oficiales y propuestas. Las evidencias concretas recibidas se reproducen en sus apartados; no se inventan comandos ni salidas. No se han vuelto a ejecutar compuertas de código, empaquetado ni pruebas en tienda para esta entrega documental. La declaración de Fase 1 incluida en la tarea se conserva como contexto de su emisor, no como certificación independiente de GPT. La verificación visual diferida sigue pendiente.

Lista de afirmaciones falsables numeradas:
1. El contrato propuesto nunca añade una talla o color sin elección explícita del comprador cuando el producto presenta opciones.
2. La selección final contiene como máximo dos `product_id` distintos y excluye todos los productos ya presentes en el carrito.
3. Desactivar ambos orígenes dinámicos conserva una ruta manual y una colección de respaldo; una respuesta nativa vacía no debe romper el drawer.
4. El schema propuesto conserva los seis IDs y tipos existentes y el máximo de dos bloques, incorporando tres controles sin aplicarlos al tema.
5. Ningún resultado estático de este informe demuestra comportamiento móvil, accesibilidad o conformidad completa de Theme Store en una tienda real.

# GPT-REPORT-021 — Dictamen de recomendaciones en Cart Drawer

## Alcance, método y lectura del dictamen

La solicitud GPT-TASK-021 pide un dictamen maestro para Sartorial v1.1.0, Fase 2, centrado en producto, curaduría, interacción, datos y superficie del comerciante. Los tres tracks mantienen su detalle para que Claude pueda convertir decisiones aprobadas en una directiva cerrada. Los wireframes son conceptuales y los ejemplos de catálogo son condicionales: no acreditan materiales, origen, certificaciones ni atributos de un producto real.

La tarea identifica §15 como carrito y checkout; la referencia oficial vigente sitúa §15 en selección de fuentes tipográficas (Font picker). Este informe corrige esa atribución: carrito corresponde a §7 y los botones acelerados a §4; §8, §14 y §20 cubren los riesgos transversales y las demos. La finalidad es evaluar requisitos concretos con fuentes primarias, no usar números de sección como prueba de cumplimiento.

Las afirmaciones de conversión se expresan como hipótesis. El rango de precio de complemento del 15–35 % es una regla editorial experimental con una única base de precio unitario declarada; no es un estándar universal de lujo ni promete aumento de AOV. Los tiempos objetivo de interacción y de espera también son propuestas pendientes de medición.

## Track 1 — Curaduría comercial y elección de variantes

### Dictamen comercial y servicio por preset

Dictamen favorable condicionado: “Complete the Outfit” aporta valor al tier propuesto de 380 USD cuando reduce incertidumbre sobre cómo completar, usar o cuidar una compra. El precio del tema no demuestra aumento de conversión. La jerarquía es compra existente, complemento opcional y acceso al checkout. Una recomendación ausente es un resultado correcto cuando no hay relación justificable. Mostrar como máximo dos productos con imagen útil, título completo, precio y acción inequívoca. Evitar carruseles, descuentos sugeridos sin configuración real, urgencia ficticia y mensajes que impliquen gratuidad para productos con precio.

| Preset | Servicio y heading sugerido | Ejemplos condicionados a datos reales | Límites de veracidad |
|---|---|---|---|
| Atelier | Ocasión, paleta y proporción de sastrería; “Complete the ensemble”. | Pañuelo coordinado, corbata, cinturón o accesorio compatible. | No asumir seda, artesanía, napa italiana o desfile por la imagen; no trasladar automáticamente una talla entre prendas. |
| Edition | Compatibilidad funcional, transporte y cuidado; “Considered companions”. | Funda del tamaño correcto, tarjetero acorde con el uso o accesorio modular con conexión documentada. | No fabricar claims Raccagni, PVD, impermeabilidad o compatibilidad; un mosquetón decorativo no es un elemento de seguridad. |
| Archive | Afinidad histórica documentada o cuidado apropiado; “Care and companions”. | Accesorio de época documentado o almacenaje adecuado al material, estado y construcción. | Perchas, cedro, cepillos y tratamientos no son soluciones universales; algodón orgánico o cremalleras no prueban seguridad archivística. |

El [Canadian Conservation Institute](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/textiles-costumes.html) documenta que soporte y conservación dependen del material y la estructura. Archive exige revisión de la pieza concreta y no certifica los complementos de la demo. Los headings anteriores son alternativas editoriales configurables, pendientes de decisión.

### Precio: hipótesis comercial del 15–35 %

La banda 15–35 % es un experimento Sartorial, no un estándar de lujo ni un requisito Shopify. La relación editorial domina sobre el precio. La definición de ratio es precio unitario de la variante complementaria elegida antes del descuento prospectivo dividido por original_price unitario de la variante ancla, ambos anteriores a descuentos de carrito y en la misma moneda y contexto comprador. No se usa subtotal de carrito ni precio multiplicado por cantidad. El criterio de elección del ancla utiliza `original_price`, según el contrato de Track 2; esa prioridad de selección no convierte el ratio comercial en una comparación con subtotal o precio descontado de línea.

Ancla 800 y complemento 120 producen 15 %; 280 producen 35 %. Los extremos del ejemplo 80–180 frente a 600–1.200 de la directiva permiten aproximadamente 6,7–30 %, no exclusivamente 15–30 %.

1. Priorizar curaduría explícita, disponibilidad y compatibilidad.
2. Mantener desactivado inicialmente el filtro duro por ratio.
3. Si se experimenta, ordenar candidatos equivalentes; no excluir automáticamente un complemento pertinente más barato.
4. Evitar que un complemento más caro domine un ticket pequeño, salvo decisión editorial deliberada.
5. Si falta precio, el ancla vale cero o los contextos monetarios difieren, omitir el cálculo.
6. Para precios variables mostrar rango o “From” antes de seleccionar; confirmar precio y ratio con la variante elegida. No sustituir silenciosamente un producto al cambiar una opción.
7. Evaluar aceptación, finalización de checkout, errores de variante y devoluciones cuando existan datos reales; AOV aislado no basta.

[Shopify: objeto product](https://shopify.dev/docs/api/liquid/objects/product) distingue el precio mínimo del producto del precio de una variante. Un mínimo no elegido no representa necesariamente la compra del usuario.

### Interacción A, B y C

**A — Add directo condicionado.** Solo si `has_only_default_variant` es verdadero, hay variante disponible y vendible en el contexto comprador, no existe decisión de plan, personalización requerida, destinatario de gift card ni otros datos obligatorios, y cantidad 1 cumple mínimo, máximo e incremento. Si faltan datos de clasificación, usar PDP. Una única variante “M” no equivale a ausencia de opciones: su talla sigue siendo significativa y debe mostrarse y confirmarse. Véanse [product](https://shopify.dev/docs/api/liquid/objects/product) y [quantity_rule](https://shopify.dev/docs/api/liquid/objects/quantity_rule).

**B — Choose options inline.** Para hasta dos opciones simples con mapping completo de variantes. La expansión ocurre dentro de la tarjeta y de `cart-drawer__scroll`. No preseleccionar talla, color o acabado. Usar fieldset, legend y radios nativos con labels de chip de al menos 44 × 44 CSS px. Tab entra y sale; las flechas siguen el comportamiento nativo de radio; Espacio selecciona sin añadir. El color tiene nombre textual y disponibilidad nunca depende únicamente de color o tachado. Las combinaciones incompatibles se identifican y no son comprables; cambiar una opción invalida explícitamente la selección incompatible de la otra. Add solo se habilita con una combinación completa, existente, disponible y apta para cantidad 1. Precio, imagen y nombre corresponden a esa variante.

Muchos valores o labels extensos requieren select nativo con placeholder sin selección y altura mínima de 44 px; no imprimir 40 tarjetas. Mapping incompleto deriva a PDP. No crear formularios anidados dentro del formulario de carrito; botones inline llevan `type="button"`. Los 44 px son norma interna y coinciden con [WCAG 2.5.5 AAA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html), sin atribuirlos como obligación universal AA. El patrón [Radio Group de WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) fundamenta nombres y selección accesibles.

**C — View product.** Para más de dos opciones independientes, planes incluso opcionales, personalización, gift cards, reglas de cantidad complejas o información insuficiente. Es una decisión conservadora del proyecto. Shopify mantiene el carrito guardado al navegar; una nota sin guardar, selección temporal o reapertura al volver requieren mecanismo y pruebas explícitos. Si se implementa restauración, registrar producto, opciones, foco y scroll bajo revisión de carrito, y revalidar contra el estado vigente. No guardar automáticamente datos personales de personalización.

### Wireframes conceptuales y continuidad accesible

Los tamaños siguientes son objetivos de diseño, no mediciones de una implementación. Los nombres y materiales de los ejemplos requieren datos reales del catálogo.

```text
DESKTOP — una tarjeta expandida
┌────────────────────────────────────────┐
│ Your cart (2)                     [×]  │
├────────────────────────────────────────┤
│ [Photo] Tailored jacket          800    │
│         Navy / 48       [−] 1 [+]       │
│ Complete the ensemble                  │
│ [Photo] Pocket square            120    │
│         [Add]                          │
│ [Photo] Gloves                   160    │
│         [Choose options ▾]              │
│ Color: ( ) Black  ( ) Brown             │
│ Size:  ( ) 7 ( ) 8 ( ) 9 unavailable   │
│ Select a color and size                │
│ [Add — disabled] [Cancel]               │ ← Scroll
├────────────────────────────────────────┤
│ Subtotal                        800 USD│
│ Tax/shipping copy from cart context    │
│ [Checkout]                             │
│ [Native accelerated checkout]          │
│ View cart                              │ ← Footer
└────────────────────────────────────────┘
```

Solo una tarjeta expandida a la vez. Abrir otra conserva la selección válida de la primera si siguen siendo compatibles la revisión del carrito y el producto. Expandir aumenta el contenido desplazable, no la altura asignada al footer.

```text
MÓVIL — 320/375 CSS px
┌──────────────────────────────┐
│ Your cart               [×]  │
├──────────────────────────────┤
│ [Photo] Jacket               │
│ Navy / 48             800    │
│ [−] 1 [+]                    │
│ Complete the ensemble        │
│ [Photo] Long product title   │
│         wraps naturally      │
│ 160 USD                      │
│ [Choose options ▾]           │
│ Color                        │
│ ( ) Black                    │
│ ( ) Extended color name      │
│ Size: ( ) 7 ( ) 8             │
│ ( ) 9 unavailable            │
│ Black / 8 — 160 USD          │
│ [Add] [Cancel]               │ ← Scroll
├──────────────────────────────┤
│ Subtotal            800 USD  │
│ Tax/shipping copy wraps      │
│ [Checkout]                   │
│ [Native express controls]    │
│ View cart                    │
└──────────────────────────────┘
```

No comprimir CTA junto a un precio largo. Títulos y opciones completos reflow naturalmente, sin carrusel horizontal ni truncar información necesaria para decidir.

```text
CARGA: Black / 8 — 160 USD | [Adding… ◌] aria-busy=true
ÉXITO CONFIRMADO: nueva línea Gloves / Black / 8; foco en título;
                 anuncio de adición; tarjeta retirada; subtotal real.
422: Black / 8 — unavailable
     This option is no longer available.
     Choose another option or view the product.
     [Size choices] [View product] [Add — disabled]
RED / RESULTADO INCIERTO:
     We could not confirm the update.
     [Check cart] [View cart]
     Reconciliar antes de otro POST; no anunciar éxito ni reintentar Add.
```

Con altura suficiente, subtotal y checkout permanecen visibles. Con teclado, zoom, paisaje o ventana muy baja, footer y contenido pueden compartir un recorrido vertical alcanzable por scroll y Tab. No prometer visibilidad física permanente de un footer que puede ser más alto que el viewport. No reducir controles a ilegibilidad ni retirar pagos acelerados para lograr una captura. Revelar el foco: [WCAG 2.4.11 AA](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) requiere que contenido del autor no oculte enteramente el componente enfocado; el objetivo interno es verlo completo cuando el espacio lo permita.

| Evento | Destino y continuidad propuestos |
|---|---|
| Abrir drawer | Cierre o primer destino válido según patrón actual; background inert y una sola trampa. |
| Expandir | Foco permanece en Choose options; aria-expanded y asociación actualizados; siguiente Tab entra. |
| Elegir | Foco en radio/select; anunciar estado relevante, no el carrito entero por cada cambio. |
| Cancelar | Activador de esa tarjeta; no cerrar drawer. |
| Escape | Cerrar drawer y restaurar activador válido; sin modal interno adicional. |
| Add correcto | Reconciliar respuesta vigente; foco en título/enlace de línea real y scroll mínimo. |
| 422 | Conservar selección, error asociado y foco en control pertinente o CTA habilitado; nunca botón disabled. |
| Respuesta antigua | No cambiar DOM, selección ni foco. |
| Rerender ajeno | Restaurar solo selección válida y producto presente; si desaparece, destino lógico o cierre, nunca body. |
| PDP | Link localizado; carrito confirmado y nota pendiente resuelta si se promete preservarla. |
| Cierre | Activador conectado o fallback lógico definido. |

Evitar modal anidado es decisión Sartorial, no prohibición de W3C; [APG Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) admite capas modales. Aquí otra capa no aporta valor y puede interferir con `closeOtherDialogs`.

## Track 2 — Contrato de datos, API, concurrencia y estados

### Diagnóstico recibido y límites

El track de datos identifica `sections/cart-drawer.liquid:299,371`: la rama `if section.blocks.size > 0 / elsif collection` bloquea la colección cuando hay bloques vacíos, agotados o ya presentes. La exclusión frente a todas las líneas existe en `:307–315,381–389`; falta un conjunto común de productos vistos entre fuentes. `:305,379` toma `selected_or_first_available_variant` y `assets/theme.js:2533` usa cantidad 1; esto no acredita elección de talla ni validez de reglas. El límite de bloque 2 en `:571` debe convertirse en límite final común. El track identifica reconciliación y `syncRevision` en JS `2605–2669` y restauración general de foco/scroll `2735–2767`; conservar estos mecanismos, sin afirmar que conservan un selector reemplazado. Son referencias del agente investigador, no una nueva lectura de código realizada por el redactor.

### Cascada, metafield y ancla

Preservar seis settings existentes y el tipo `cross_sell_product`. Propuesta: `show_complementary_products=true`, `use_product_metafield=false`, `use_search_discovery=false`. Orden de fuentes habilitadas: metafield del ancla → nativas complementarias → bloques en orden del editor → colección curada en orden configurado. Cada fuente completa huecos después de filtrar y deduplicar, hasta 0, 1 o 2 productos únicos. No exigir dos ni duplicar uno. `blocks.size` no determina elegibilidad. Ambos opt-ins apagados conservan manual → colección. No instalar apps automáticamente, exigirlas ni recurrir a all/bestsellers/related. Las recomendaciones complementary son manuales, frente a related automáticas: [Shopify recommendations](https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations).

Metafield propuesto merchant-owned de producto: `custom.complementary_products`, tipo `list.product_reference`, orden editorial. Crear definición, asignar referencias y leer `.value` en Liquid. Hasta 10 referencias es presupuesto propio, no límite Shopify. Ausente, tipo erróneo, vacío o referencias irresolubles equivalen a fuente vacía. No adivinar namespace interno Search & Discovery ni duplicarlo. No necesita credenciales Admin. [.value y .value.count](https://shopify.dev/docs/api/liquid/objects/metafield) permiten trabajar con referencias; [access.storefront](https://shopify.dev/docs/apps/build/metafields) controla Storefront API y no impone PUBLIC_READ para esta lectura Liquid.

Ancla propuesta: mayor `line_item.original_price` unitario contextual, anterior a descuentos del carrito, dentro del snapshot autorizado. Agrupar por `product_id`; excluir gift cards, moneda desconocida y precio original no finito o ≤ 0. Representante de producto: línea elegible de mayor original_price; empate intraproducto por variant_id ascendente; empate entre productos por product_id ascendente. No usar cantidad, line_total, posición de array ni line.key permanente. `cart.items.first` no demuestra último añadido. No priorizar product_type libre sin contrato. Al retirar ancla o cambiar variante, recalcular desde snapshot; añadir un accesorio reciente no desplaza automáticamente a la prenda principal. [line_item](https://shopify.dev/docs/api/liquid/objects/line_item) distingue original_price y final_price. Sin ancla positiva conocida, omitir fuentes contextuales y evaluar manual. Producto originalmente gratuito no es ancla; original positivo con final cero puede mantenerla editorialmente, pero omite ratio: propuesta comercial.

**Base canónica del ratio para evitar contradicciones:** numerador = precio unitario actual de la variante complementaria seleccionada antes del descuento prospectivo al añadir; denominador = original_price unitario del representante ancla, anterior a descuentos de carrito. Misma moneda, Market y contexto de comprador. No mezclar numerador predescuento con final_price del ancla. Si el ancla final es cero, precios desconocidos, planes o modelos de cobro incomparables, omitir ratio. No usar price_min/From, subtotal, cantidad inflada ni EUR frente a USD. Recalcular al elegir variante sin reemplazar tarjeta activa; no predecir descuentos, impuestos, envío o suscripciones futuras. Shopify aconseja menor coste o equivalente en [Search & Discovery](https://help.shopify.com/en/manual/online-store/storefront-search/search-and-discovery-recommendations); la banda 15–35 % sigue siendo hipótesis propia.

### Endpoint, elegibilidad y representación

`routes.product_recommendations_url` es una ruta HTML localizada. GET propuesto: ruta + `product_id=<ancla>&intent=complementary&limit=10&section_id=<ID real de la sección cart-drawer existente>`. El margen 10 sirve para filtrar, no mostrar 10 tarjetas; la API admite limit 1–10. `.json` devuelve productos JSON; section_id permite Liquid HTML. Usar una representación: no hacer JSON → petición por candidato → HTML. Extraer solo fragmento de candidatos de la sección existente; nunca reemplazar drawer o footer entero desde ese GET, cuyo carrito puede ser viejo. `recommendations.products` solo se acepta con `performed?` verdadero y contexto correcto. Datos JSON insuficientes para opciones, planes, personalización o reglas derivan a PDP. No inventar sección adicional fuera de alcance. Fuentes: [Product recommendations API](https://shopify.dev/docs/api/ajax/reference/product-recommendations), [routes](https://shopify.dev/docs/api/liquid/objects/routes), [recommendations](https://shopify.dev/docs/api/liquid/objects/recommendations).

La fuente complementaria nativa filtra productos agotados, gratuitos, gift cards y presentes en carrito; el tema mantiene sus propias garantías y dedupe: [Complementary products](https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations/complementary-products). Construir inCart desde todos los product_id de todas las líneas, independientemente de variante, plan y properties; incorporar componentes de bundles con IDs resolubles cuando existan, sin prometer dedupe de componentes desconocidos. Normalizar IDs a strings decimales; en Liquid, tokens delimitados completos, nunca coincidencia substring. `seen` es común a las cuatro fuentes y se actualiza solo al aceptar candidato. Un candidato inválido no consume hueco.

Elegibilidad: producto resoluble y visible/publicado en contexto actual, ausente de inCart/seen, alguna opción de compra disponible, precio real/formateable y CTA adecuado a variantes, planes, personalización y cantidad. available no prueba stock físico porque puede permitirse continuar vendiendo. Mínimo/incremento/máximo complejos o volume pricing necesitan PDP o interacción explícita; nunca convertir silenciosamente cantidad 1 en 5. [quantity_rule](https://shopify.dev/docs/api/liquid/objects/quantity_rule) y [variant](https://shopify.dev/docs/api/liquid/objects/variant) sustentan la clasificación; View product conserva tarjetas comprables que no permiten Add simple.

### Contrato asíncrono y mutaciones

Clave de validez: `cartRevision + recommendationGeneration + anchorProductId + locale + Market/country + currency + buyerPricingContext + configSignature`. Cero GET si carrito vacío, módulo apagado, fuente nativa apagada o metafield ya aporta dos elegibles. Como máximo un GET nativo por snapshot autorizado, únicamente para huecos: nunca por línea, variante o candidato. Single-flight por clave; coalescer cambios rápidos y comenzar tras carrito autorizado y reconciliación final de mutaciones.

Separar controller de lectura del controller POST. `beginMutation` invalida generaciones y lecturas anteriores. El POST usa la cola/protocolo vigente CartDrawer: abortarlo no revierte lo que pudo ocurrir en servidor. No asumir fracaso, no reintentar Add automáticamente; un resultado incierto requiere GET de reconciliación. Una respuesta vieja no toca DOM, anuncios ni foco. Commit solo idle. Desde focus, pointerdown o cambio de selector se congela tarjeta/selección; una respuesta tardía se descarta hasta finalizar interacción, reabrir o nueva mutación.

Metafield inmediato; fallbacks preparados e inertes durante espera; completar huecos una vez al responder o llegar al deadline. Sin JavaScript, renderizar fuentes locales y links útiles. Deadline inicial 2.000 ms es propuesta pendiente de medición, no SLA ni garantía. Checkout y subtotal no esperan. Sin localStorage; caché opcional solo memoria acotada por snapshot/contexto e invalidada con carrito, porque el filtrado nativo puede ocultar un producto después eliminado.

| Resultado | Conducta exigida en propuesta |
|---|---|
| 200 vacío o todos filtrados | Resultado válido vacío y fallback; sin retry. |
| 404 / 422 de recomendaciones | Fallback sin bucle. |
| 429 / 5xx / red / HTML inválido / timeout | Fallback; como máximo nuevo intento en próxima reapertura o snapshot estable, respetando Retry-After. |
| Abort por invalidación | Silencioso. |
| Section null o fragmento ausente | Fuente indisponible; no vaciar carrito ni repetir POST. |
| Add 422 | Conservar selección, error localizado y actualizar disponibilidad. |
| Add correcto con section null | GET para reconciliar sección/carrito; jamás repetir Add. |

[Section rendering](https://shopify.dev/docs/api/ajax/section-rendering) puede devolver null bajo HTTP 200 y usa settings persistentes; no parametrizar arbitrariamente su configuración. [Cart Ajax API](https://shopify.dev/docs/api/ajax/reference/cart) documenta moneda de presentación y bundled sections.

```text
PSEUDOCÓDIGO DOCUMENTAL — no implementado
onAuthoritativeCart(snapshot):
  invalidate previous recommendation generation
  if disabled or empty: hide whole module; return
  inCart = all product IDs from snapshot lines
  anchor = highest original contextual unit price
           (stable product/representative variant ID ties)
  seen = empty; final = empty
  takeEligible(enabled anchor metafield)
  if native enabled and anchor and final.size < 2:
    await at most one complementary GET for snapshot
    validate snapshot/generation/context
    if interactionFrozen: discard late update; return
    else takeEligible(native)
  takeEligible(manual blocks)
  takeEligible(curated collection)
  if current snapshot and !interactionFrozen and no pending mutation:
    commit final[0..1]; hide heading/divider when empty

takeEligible(source):
  scan editorial order with bounded budget
  for candidate:
    if final.size == 2: stop
    if invalid or inCart or seen: continue
    resolve CTA + contextual price
    append; seen.add(product_id)
```

Escanear primeras 50 referencias de colección es propuesta de Nivel 2 frente a limit: 6 actual; no descargar ni paginar 200 productos en drawer. El comerciante coloca candidatos relevantes primero; el candidato 51 no está prometido. El presupuesto debe aprobarse y medirse.

### Aclaración vinculante de idle y congelación de interacción

En el contrato futuro, idle significa simultáneamente snapshot vigente, `!interactionFrozen` y ninguna mutación pendiente. Si focus, pointerdown o cambio de selector inicia interacción mientras se espera el GET nativo, descartar la respuesta y retornar inmediatamente: no continuar hacia manual/colección ni hacer commit de fallback. Toda escritura de tarjetas —respuesta nativa, fuentes manuales/server-rendered o restauración tras rerender— se somete a ese mismo gate. No basta con descartar solo la parte nativa y luego sustituir la selección con un fallback.

Liberar interactionFrozen únicamente al terminar explícitamente/cerrar la selección o tras una mutación reconciliada que revalide producto, selección, foco y estado preservado. Una respuesta de red, timeout o cambio de fuente no libera por sí sola la congelación. Si una mutación legítima exige rerender, capturar y restaurar estado válido sin dejar que la carga de recomendaciones compita con esa restauración.

### Contrato futuro concreto de cart.note

Cuando `show_cart_note` esté habilitado y exista textarea, capturar el borrador exacto, incluido string vacío para borrar una nota. Incrementar una versión monotónica del borrador en cada input y mantener dirty separado de la nota confirmada por servidor. Antes de rerender conservar el borrador, y después restaurarlo mediante `textarea.value`, sin interpolarlo en HTML. Conservar selección de texto, foco y caret cuando textarea y contexto sigan válidos. No usar localStorage ni registrar texto de nota en logs, porque puede contener información personal.

Antes de navegar a View product con nota dirty, serializar su guardado por el protocolo existente de mutaciones de carrito mediante POST a la ruta localizada `cart/update.js` con `note`; no usar `add.js` para guardarla. Estado accesible `saving_note` durante guardado. Reconocer como limpio solo el borrador cuya versión enviada coincide con la versión actual y cuya escritura confirma el servidor. Una edición más nueva durante POST sigue dirty y nunca es sobrescrita por el texto enviado anteriormente.

Ante fallo o escritura de resultado ambiguo, reconciliar primero con GET de carrito, mantener el borrador local y anunciar `note_save_unconfirmed` cuando no se confirme. Permitir permanecer en drawer o continuar explícitamente a PDP tras la advertencia, usando View product; Check cart realiza reconciliación. No inventar garantía de guardado ni reintentar automáticamente Add. Una confirmación de la nota anterior no confirma el borrador más reciente.

El formulario de checkout nativo debe incluir el último borrador. No interceptar ni retirar pagos acelerados nativos, ni afirmar que preservan la nota sin verificar su flujo real de plataforma. La vía de checkout restante sigue utilizable; cargar recomendaciones jamás bloquea checkout. Si el contrato propuesto no puede demostrarse en un flujo acelerado concreto, documentar esa limitación en lugar de prometer persistencia universal.

Pruebas futuras adicionales: nota escrita, nota borrada a string vacío, edición durante POST y respuesta de versión anterior, fallo/timeout y reconciliación antes de PDP, elección explícita de continuar pese a nota no confirmada, master apagado con nota activa, formulario nativo con último borrador y pago express real. Para congelación: abrir selector durante GET lento y después recibir éxito vacío, error o timeout; ni API ni fallback manual pueden reemplazar selección/foco. Tras cierre explícito o mutación validada, nueva selección se actualiza respetando la revisión vigente.
### Matriz de aceptación pendiente: cinco estados y adversariales

| Estado | Fixture reproducible y criterio falsable |
|---|---|
| Vacío | 0 líneas con fuentes configuradas: empty puro, Continue shopping, 0 GET y sin heading/divider. |
| Uno | Ancla con 0/1/2 referencias, dos bloques vacíos, todos agotados, primer candidato ya en carrito: 0–2 complementos y fallback tras inválidos. |
| Muchos | 10+ líneas, 20+ candidatos, mismo producto en cuatro fuentes, variantes/planes múltiples, colección 200: ≤ 2 únicos y ≤ 1 GET por snapshot, presupuesto documentado. |
| Muy largo | Título 120 caracteres, opciones/precios largos, 320/375 px, texto 200 %, teclado: reflow legible, footer alcanzable y scrollWidth ≤ clientWidth en panel, track y tarjeta. |
| Faltante | Sin imagen/descripción, referencia rota, precio desconocido, default agotada con otra disponible: placeholder proporcional, elección explícita y ningún Add ciego. |

Pruebas adicionales: traje 1.200 × 1 frente a corbata 150 × 10 y perfume 95 mantiene traje como ancla; reordenar empate mantiene selección; dos líneas del mismo producto con variantes/precios distintos usan representante definido. Retirar ancla durante GET descarta respuesta vieja. Añadir accesorio retira todas sus tarjetas por product_id y enfoca línea confirmada, usando result key/variant/plan/properties cuando haga falta. Descuento por línea/carrito y ancla final cero no mezclan bases del ratio. USD/EUR/JPY o contexto incomparable omiten ratio. Cambio de variante actualiza precio/disponibilidad. Mínimo 5, incremento 5, máximo, reglas ausentes y planes no pasan al POST simple. Selector abierto ante respuesta tardía conserva foco/selección. Cubrir 200 vacío, 404, 422, 429, 500, HTML inválido, timeout y section null. Doble clic o abort de POST posiblemente aplicado nunca generan reintento automático. Payload incompleto deriva a PDP.

Viewport hostil: escritorio/móvil, paisaje, teclado abierto, zoom/reflow y pagos acelerados multilínea. Sin JS: PDP/cart/checkout nativos y ningún botón simulado que no funciona. Ejecutar las tres demos con consola/red, navegación móvil, errores y foco. Responsables: Claude implementación; GPT revisión adversarial independiente; Gemini decisiones y ledger; Johandry curaduría y prioridades. No cerrar compuertas con estos fixtures propuestos.

## Evidencia estática reproducida de los tracks

Los comandos y extractos siguientes fueron ejecutados por los agentes investigadores en su snapshot. El redactor los integra por informe; no los presenta como reejecución propia. Los extractos no equivalen a salida completa.

```powershell
rg -n 'section.blocks.size > 0|elsif section.settings.cross_sell_collection|limit: 6|cross_sell_count >= 2|"limit": 2' sections\cart-drawer.liquid
```
```text
299:              {%- if section.blocks.size > 0 -%}
371:              {%- elsif section.settings.cross_sell_collection != blank -%}
372:                {%- for recommendation in section.settings.cross_sell_collection.products limit: 6 -%}
373:                  {%- if cross_sell_count >= 2 -%}
571:      "limit": 2,
```
```powershell
rg -n 'recommendation_in_cart or recommendation_variant.available|cart_item.product_id == recommendation.id|selected_or_first_available_variant' sections\cart-drawer.liquid
```
```text
305:                  {%- assign recommendation_variant = recommendation.selected_or_first_available_variant -%}
308:                    {%- if cart_item.product_id == recommendation.id -%}
314:                  {%- if recommendation_in_cart or recommendation_variant.available == false -%}
379:                  {%- assign recommendation_variant = recommendation.selected_or_first_available_variant -%}
382:                    {%- if cart_item.product_id == recommendation.id -%}
388:                  {%- if recommendation_in_cart or recommendation_variant.available == false -%}
```
```powershell
rg -n 'items: \[\{ id: variantId, quantity: 1 \}\]|beginMutation\(|renderCartResponse\(|renderedRevision = this.syncRevision|crossSellController\?\.abort' assets\theme.js
```
```text
2259:      this.crossSellController?.abort();
2517:      const revision = this.beginMutation();
2521:      this.crossSellController?.abort();
2533:            items: [{ id: variantId, quantity: 1 }],
2550:        await this.renderCartResponse(result, revision);
2605:    beginMutation() {
2663:    async renderCartResponse(result, revision = this.syncRevision) {
2767:      this.renderedRevision = this.syncRevision;
```

Track UX reporta `git status --short`, exit 0, con modificaciones preexistentes preservadas, entre otras:
```text
 M assets/base.css
 M assets/theme.js
 M sections/cart-drawer.liquid
?? agent-comms/inbox-gpt/GPT-TASK-021-CART-DRAWER-COMPLETE-THE-OUTFIT.md
?? agent-comms/outbox-gpt/GPT-AUDIT-020-LUXURY-DATA-AND-UX-AUDIT.md
```
```powershell
rg -n 'selected_or_first_available_variant|requires_selling_plan|data-variant-id|cross_sell_collection|cross_sell_heading|cart-drawer__footer|cart-summary__subtotal|additional_checkout_buttons|data-cart-scroll' sections/cart-drawer.liquid
```
```text
138:            <div class="cart-drawer__scroll" data-cart-scroll>
302:                  {%- if recommendation == blank or recommendation.requires_selling_plan -%}
305:                  {%- assign recommendation_variant = recommendation.selected_or_first_available_variant -%}
355:                      data-variant-id="{{ recommendation_variant.id }}"
371:              {%- elsif section.settings.cross_sell_collection != blank -%}
376:                  {%- if recommendation.requires_selling_plan -%}
379:                  {%- assign recommendation_variant = recommendation.selected_or_first_available_variant -%}
428:                      data-variant-id="{{ recommendation_variant.id }}"
460:            <footer class="cart-drawer__footer flow">
479:              <div class="cart-summary__subtotal">
507:              {%- if additional_checkout_buttons -%}
509:                  {{ content_for_additional_checkout_buttons }}
```
```powershell
rg -n -A 28 '^    findLineFor' assets/theme.js
```
```text
2504:    findLineFor(result) {
2505-      const variantId = String(result?.variant_id ?? result?.items?.[0]?.variant_id ?? '');
2506-      if (!variantId) return null;
2507-      return Array.from(this.querySelectorAll('.cart-drawer-item__title a[href]')).find((link) => {
2508-        const url = new URL(link.getAttribute('href'), window.location.origin);
2509-        return url.searchParams.get('variant') === variantId;
2510-      }) || null;
2511-    }
```
```powershell
rg -n 'quantity: 1|preventScroll: true|findLineFor\(|currentContent.replaceWith|previousScroll|closeOtherDialogs\(this\)' assets/theme.js
```
```text
2364:      closeOtherDialogs(this);
2533:            items: [{ id: variantId, quantity: 1 }],
2557:        (focusTarget || this.findLineFor({ variant_id: variantId }))?.focus({ preventScroll: true });
2739:      const previousScroll = currentContent.querySelector('[data-cart-scroll]')?.scrollTop || 0;
2741:      currentContent.replaceWith(nextContent);
2744:      if (nextScroll && previousScroll) nextScroll.scrollTop = previousScroll;
```

Estos extractos prueban selección técnica y cantidad fija; no qué talla recibió un comprador en tienda. findLineFor busca un enlace enfocable, no un div. `preventScroll:true` y restauración del scroll crean un riesgo de foco fuera de pista que debe falsificarse; no se afirma un fallo visual observado. Exclusión de requires_selling_plan no demuestra cobertura de planes opcionales, personalización o reglas de cantidad. Footer y pagos acelerados existen estructuralmente; no se certifica responsive.

Lectura contextual CSS realizada por Track UX:
```powershell
$cssLines=Get-Content assets/base.css
foreach($cssRange in @(@(8385,8442))){
  for($cssIndex=$cssRange[0]-1;$cssIndex -lt $cssRange[1];$cssIndex++){
    '{0}: {1}' -f ($cssIndex+1),$cssLines[$cssIndex]
  }
}
```
```text
8386: /* El panel ya no se desplaza entero: cabecera, avisos y pie quedan fijos y solo se
8387:    mueve la pista de lineas y recomendaciones. Si la ventana es tan baja que ni la pista
8388:    minima cabe, el contenido entero pasa a desplazarse como ultimo recurso. */
8399: .cart-drawer__content {
8400:   min-height: 0;
8401:   overflow-y: auto;
8402:   overscroll-behavior: contain;
8403: }
8409: .cart-drawer__scroll {
8410:   flex: 1 1 auto;
8411:   min-height: 7rem;
8412:   overflow-y: auto;
8413:   overscroll-behavior: contain;
8414: }
8416: .cart-drawer__footer {
8417:   flex-shrink: 0;
8418: }
```

El CSS contempla scroll total de respaldo; faltan pruebas con teclado/zoom. La referencia de cantidad fija del informe anterior a JS:2532 se actualiza a 2533 para este snapshot. Cada línea es frágil ante cambios posteriores y debe reconfirmarse al implementar.


## Track 3 — Merchant surface, schema, locales y Theme Store

### Diagnóstico y separación normativa

La [referencia oficial de requisitos](https://shopify.dev/docs/storefronts/themes/store/requirements) titula §8 Consistency and functionality, §14 Settings, §15 Font picker y §20 Demo stores. Carrito está bajo §7 Pages > Cart page requirements, y pagos acelerados también bajo §4 Features. Configuración comprensible, información comercial verdadera, ausencia de dependencia obligatoria de apps y coherencia de demos son obligaciones pertinentes. §12 contempla objetivos táctiles de 24 × 24 con excepciones; los 44 px, 100 % t:, info en toda dependencia, límite de dos y estructura del footer son reglas del proyecto o propuestas de contrato, no mínimos universales atribuidos a Shopify.

Schema actual identificado en `sections/cart-drawer.liquid:524–583`: seis settings — color_scheme/color_scheme/default scheme-1; enable_tiered_progress/checkbox/default false; free_shipping_threshold/number/default 150; atelier_gift_threshold/number/default 250; cross_sell_heading/text/default literal “Complimentary Additions” en :558; cross_sell_collection/collection sin default. Un block cross_sell_product, límite 2 en :571, setting product/product sin default. No max_blocks ni presets. Los siete labels, cuatro info y nombres de sección/bloque ya usan t:. El defecto no es ausencia general de localización: es default literal y semántica de gratuidad. “Complementary” expresa complemento; “Complimentary” puede expresar gratuito.

Storefront actual usa `sections.cart` (`locales/en.default.json:55–92`) y schema usa `sections.cart_drawer` (`en.default.schema.json:787–819`). No trasladar settings de schema al árbol storefront. Corregir default solo afecta configuraciones futuras: no migra heading guardado; no reescribir contenido del comerciante a ciegas.

### Schema completo propuesto — no implementado

Conservar los seis IDs y tipos y defaults excepto heading; incorporar tres controles acordados. Son cambios de Nivel 2 pendientes de autorización explícita en futura directiva. No añadir select de fuente, controles de namespace, precio o ancla. Las info describen el comportamiento que deberá existir tras implementar, no una capacidad ya disponible.

```json
{
  "name": "t:sections.cart_drawer.name",
  "settings": [
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "t:sections.all.color_scheme.label",
      "default": "scheme-1"
    },
    {
      "type": "checkbox",
      "id": "enable_tiered_progress",
      "label": "t:sections.cart_drawer.settings.enable_tiered_progress.label",
      "default": false
    },
    {
      "type": "number",
      "id": "free_shipping_threshold",
      "label": "t:sections.cart_drawer.settings.free_shipping_threshold.label",
      "info": "t:sections.cart_drawer.settings.free_shipping_threshold.info",
      "default": 150
    },
    {
      "type": "number",
      "id": "atelier_gift_threshold",
      "label": "t:sections.cart_drawer.settings.atelier_gift_threshold.label",
      "info": "t:sections.cart_drawer.settings.atelier_gift_threshold.info",
      "default": 250
    },
    {
      "type": "checkbox",
      "id": "show_complementary_products",
      "label": "t:sections.cart_drawer.settings.show_complementary_products.label",
      "info": "t:sections.cart_drawer.settings.show_complementary_products.info",
      "default": true
    },
    {
      "type": "text",
      "id": "cross_sell_heading",
      "label": "t:sections.cart_drawer.settings.cross_sell_heading.label",
      "default": "t:sections.cart_drawer.settings.cross_sell_heading.default"
    },
    {
      "type": "checkbox",
      "id": "use_product_metafield",
      "label": "t:sections.cart_drawer.settings.use_product_metafield.label",
      "info": "t:sections.cart_drawer.settings.use_product_metafield.info",
      "default": false
    },
    {
      "type": "checkbox",
      "id": "use_search_discovery",
      "label": "t:sections.cart_drawer.settings.use_search_discovery.label",
      "info": "t:sections.cart_drawer.settings.use_search_discovery.info",
      "default": false
    },
    {
      "type": "collection",
      "id": "cross_sell_collection",
      "label": "t:sections.cart_drawer.settings.cross_sell_collection.label",
      "info": "t:sections.cart_drawer.settings.cross_sell_collection.info"
    }
  ],
  "blocks": [
    {
      "type": "cross_sell_product",
      "name": "t:sections.cart_drawer.blocks.cross_sell_product.name",
      "limit": 2,
      "settings": [
        {
          "type": "product",
          "id": "product",
          "label": "t:sections.all.product.label",
          "info": "t:sections.cart_drawer.blocks.cross_sell_product.settings.product.info"
        }
      ]
    }
  ]
}
```

### Merge de en.default.schema.json — no sustituir archivo completo

Merge recursivo exclusivamente de estas entradas, conservando el resto de árboles y claves actuales. [Input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings) fundamenta tipos/defaults y ausencia de default en product/collection; [schema locales](https://shopify.dev/docs/storefronts/themes/architecture/locales/schema-locale-files) admite t: en default de text.

```json
{
  "sections": {
    "cart_drawer": {
      "name": "Cart drawer",
      "settings": {
        "enable_tiered_progress": {
          "label": "Show free shipping and gift progress"
        },
        "free_shipping_threshold": {
          "label": "Free shipping amount",
          "info": "Match your actual shipping rates and eligible markets in Settings > Shipping and delivery. This amount does not create a shipping rate, make express shipping free, or guarantee eligibility at checkout."
        },
        "atelier_gift_threshold": {
          "label": "Gift amount",
          "info": "Match an actual gift offer and its eligibility conditions. Configure any required products and discounts in Shopify. This amount does not add a gift or create a discount."
        },
        "show_complementary_products": {
          "label": "Show complementary products",
          "info": "Shows up to two eligible products when the cart has items. Products already in the cart are excluded. Choose products below to use this feature without an app."
        },
        "cross_sell_heading": {
          "label": "Complementary products heading",
          "default": "Complementary products"
        },
        "use_product_metafield": {
          "label": "Use product-specific selections",
          "info": "In Settings > Custom data > Products, define custom.complementary_products as a list of product references, then choose products on each product page in the admin. Eligible selections for the main product in the cart take priority over the sources below."
        },
        "use_search_discovery": {
          "label": "Use Shopify complementary recommendations",
          "info": "Optional. Uses complementary products configured in Shopify Search and Discovery after eligible product-specific selections. Products selected below are used when results are unavailable. No app installation is required for manual selections."
        },
        "cross_sell_collection": {
          "label": "Collection to suggest from",
          "info": "Fills remaining spaces after eligible product-specific selections, Shopify recommendations, and products selected below. Only available products outside the cart are shown."
        }
      },
      "blocks": {
        "cross_sell_product": {
          "name": "Suggested product",
          "settings": {
            "product": {
              "info": "Products without customer-selectable options can be added directly. Other products require an option selection or a visit to the product page. Duplicate products and products already in the cart are excluded."
            }
          }
        }
      }
    }
  }
}
```

### Merge de en.default.json — conservar sections.cart y claves actuales

La clave legacy `complimentary_additions` se conserva y su valor público se corrige. Reutilizar solo claves existentes verificadas: `add_complementary`, `add_complementary_product`, `added`, `add_failed` bajo sections.cart, y `products.product.sold_out`. `add_failed` sirve para fallo confirmado, nunca para resultado incierto de un POST. Las nuevas entradas de estado se especifican a continuación. [Storefront locales](https://shopify.dev/docs/storefronts/themes/architecture/locales/storefront-locale-files) documenta t e interpolaciones. Los nombres de opciones son datos del comerciante, no labels de schema. Traducir a todos los idiomas soportados al implementar; estos fragmentos ingleses no constituyen traducción completa del tema.

```json
{
  "sections": {
    "cart": {
      "complimentary_additions": "Complementary products",
      "choose_options": "Choose options",
      "choose_options_product": "Choose options for {{ product }}",
      "select_option": "Select {{ option }}",
      "view_product": "View product",
      "view_product_for": "View {{ product }}",
      "options_unavailable": "This combination is unavailable.",
      "adding": "Adding…",
      "cancel_options": "Cancel",
      "update_unconfirmed": "We could not confirm the update.",
      "check_cart": "Check cart",
      "saving_note": "Saving your cart note…",
      "note_save_unconfirmed": "We could not confirm that your cart note was saved."
    }
  }
}
```

Las últimas seis entradas son propuestas complementarias del contrato de estados: no se afirma que sus nombres ya existan ni que se hayan escrito en locales. Cancel cierra opciones inline; no cierra drawer. Check cart inicia reconciliación, no otro Add. La implementación debe asociar el error y aria-busy a controles adecuados y confirmar las referencias de interpolación en todo idioma.


### Evidencia de Track 3 y validación documental

Comandos reales recibidos:
```powershell
rg -n 'cross_sell|schema|checkout|note|tax|ship|additional|recommend|settings' sections/cart-drawer.liquid
rg -n 'cross_sell|cart_drawer|recommendations' locales/en.default.schema.json locales/en.default.json config/settings_schema.json
```
```text
33:  assign default_cross_sell_heading = 'sections.cart.complimentary_additions' | t
34:  assign cross_sell_heading = section.settings.cross_sell_heading | default: default_cross_sell_heading
299:              {%- if section.blocks.size > 0 -%}
305:                  {%- assign recommendation_variant = recommendation.selected_or_first_available_variant -%}
371:              {%- elsif section.settings.cross_sell_collection != blank -%}
372:                {%- for recommendation in section.settings.cross_sell_collection.products limit: 6 -%}
373:                  {%- if cross_sell_count >= 2 -%}
461:              {%- if settings.show_cart_note -%}
481:                <strong>{{ cart.total_price | money_with_currency }}</strong>
485:                {%- if cart.taxes_included -%}
497:              <button class="button button--full" type="submit" name="checkout">
507:              {%- if additional_checkout_buttons -%}
509:                  {{ content_for_additional_checkout_buttons }}
558:      "default": "Complimentary Additions"
571:      "limit": 2,
```

Recuento actual extraído por Track 3 con regex del schema y ConvertFrom-Json:
```text
Current schema: settings=6, block types=1, block limit=2, labels=7, labels t:=7, info=4, info t:=4, literal text defaults=1
```

Validación en memoria: combinar los tres bloques en `$taskPayload`; `ConvertFrom-Json -Depth 40`; revisar unicidad, booleanos/números, ausencia de defaults en product/collection, comparación con schema actual salvo heading; merge recursivo schema locale propuesto + actual y resolución de cada t:. Salida literal recibida:
```text
JSON parse PASS: schema settings=9; blocks=1; block_limit=2; new checkbox defaults=True/False/False
IDs unique PASS; booleans/numbers correct PASS; product/collection no default PASS; no files written.
PASS 20 schema translation references resolved against existing locale plus proposal; PASS all 6 existing setting IDs/types preserved; only heading default changed; block type/id/limit preserved.
```

Ampliación final de storefront validada por Track 3 sin escrituras:
```powershell
rg -n '"cancel"|"adding"|"check_cart"|"update_unconfirmed"|Adding|Check cart|confirm the update' locales/en.default.json
```
Resultado: exit 1, sin coincidencias. Los nombres nuevos son propuestas; no se inventa que ya existían.
```text
Storefront locale JSON parse PASS: 11 leaf keys; new Cancel/Adding/update_unconfirmed/Check cart present; schema 20 refs unchanged; no files written.
```

Skills shopify-liquid y shopify-custom-data leídas por investigadores. Búsqueda local de documentación:
```powershell
node 'C:\Users\Johan\.codex\plugins\cache\openai-curated-remote\shopify\4.1.1\skills\shopify-liquid\scripts\search_docs.mjs' 'theme section schema checkbox select text collection product settings default translation keys'
```
Resultado exit 1: `Search failed: fetch failed`. Sustituida por herramientas oficiales Shopify y fuentes primarias. Helper intentado sobre código JSON propuesto:
```powershell
node 'C:\Users\Johan\.codex\plugins\cache\openai-curated-remote\shopify\4.1.1\skills\shopify-liquid\scripts\validate.mjs' --filename cart-drawer.liquid --filetype sections --context theme --code $taskCode
```
Salida literal, exit 1:
```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@shopify/theme-check-common' imported from C:\Users\Johan\.codex\plugins\cache\openai-curated-remote\shopify\4.1.1\skills\shopify-liquid\scripts\validate.mjs
code: 'ERR_MODULE_NOT_FOUND'
```

JSON syntax y referencias verificadas en memoria; validación Shopify/Theme Check incompleta. El helper remoto exige archivos reales y no se crearon por alcance de solo lectura. No instalar dependencias, crear preview ni emitir Cart POST, pagos o Admin para este dictamen. No afirmar que pasó el validador Shopify.

Preflight scoped preservado:
```powershell
git status --short -- sections/cart-drawer.liquid assets/theme.js locales/en.default.json locales/en.default.schema.json
```
```text
 M assets/theme.js
 M locales/en.default.json
 M locales/en.default.schema.json
 M sections/cart-drawer.liquid
```

### Matriz de riesgos y mitigación verificable

| Riesgo / severidad | Ámbito normativo | Evidencia actual / límite | Aceptación futura y dueño |
|---|---|---|---|
| Talla involuntaria — Alta | §8 funcionalidad, §7 carrito | Primera variante disponible y quantity 1; no prueba de elección. | S/M/L: cero POST sin elección; talla única nombrada confirmada; planes/personalización PDP. Claude implementa, GPT valida. |
| Dependencia de app — Alta | §8 / §14 | Manual actual; fuente nueva no implementada. | Instalación sin Search & Discovery: manual/colección funcionan; opt-ins false generan cero GET nativo. Gemini contrato, Claude ejecución. |
| Fallback vacío — Alta | §8 / §14 | if blocks/elsif collection bloquea fallback por existencia. | Dos bloques agotados/en carrito dan paso a colección; todos inválidos ocultan heading/separador. Claude. |
| Gratuidad implícita — Media | §8 veracidad / §14 defaults | Literal Complimentary Additions. | Precio real y heading neutral; pertenecer al módulo no implica gratis. Claude y Johandry demos. |
| Oferta de envío/regalo falsa — Alta | §8 / §14 | Progreso false por defecto; texto gift actual insuficiente según Track 3. | Threshold no crea tarifa, envío express gratuito, regalo ni descuento. Reglas y Markets reales; Johandry configura, Claude copy. |
| Checkout inaccesible — Alta | §7 / §4, accesibilidad | Footer/scroll separados; sin ensayo empírico Fase 2. | 320/375, altura baja, teclado/error mantienen acceso y foco, sin overflow; fallback scroll cuando no cabe. Claude/GPT QA. |
| Precio/moneda/impuestos — Alta | §8 / §7 | money, money_with_currency y cart.taxes_included existentes. | Variantes, quantity y Market usan precio seleccionado y cart real; formatter compartido shop.money_format, sin nuevo Intl. Claude. |
| Nota y pagos acelerados — Alta | §7 / §4 | Markup presente; persistencia bajo mutación no demostrada. | Nota no guardada se preserva/envía según contrato; pagos tras rerender; checkout form nativo funcional. Claude. |
| Carreras y POST incierto — Alta | §8 / §7 | Protocolo existente; motor nuevo pendiente. | Doble clic, respuesta lenta y ancla retirada: revisión coherente, descarte viejo, foco confirmado; timeout no usa add_failed ni autoretry; Check cart reconcilia. Claude. |
| Editor/copy públicos — Media | §14 | Labels/info ya t:, default literal. | Toggles y preview funcionales; 20 referencias resueltas; sin jerga payload/intent/cross_sell pública; info solo anuncia conducta implementada. Claude/GPT. |
| Demos y paridad — Alta | §20 / §8 | Fase 2 sin verificación real. | Tres demos, manual sin app, cinco estados, Market y móvil; instalación coherente y pagos de prueba. Johandry/Claude/Gemini. |

No exigir “cero 422” absoluto: en recorrido ordinario no se esperan 404/422/excepciones; en fixture adversarial de variante agotada, 422 puede ser legítimo y debe manejarse con error útil, selección preservada y checkout accesible. Lo mismo distingue error de recomendaciones de error confirmado de Add.

Filas del ledger identificadas por Track 3 para reevaluación posterior: 22 Schemas válidos y settings, 54 Live regions, 66 Checkout acelerado, 82 País/moneda, 111 Tres demos. Su estado histórico no acredita el nuevo motor. No se cierran ni editan. Gemini debe establecer filas nuevas, con dueño nominal, para selección explícita, cascada, dedupe y Gate 5 de Fase 2 si el ledger no contiene esas obligaciones.

## Decisiones abiertas y ruta de implementación

| Decisión | Responsable | Resultado que debe quedar escrito antes de implementar |
|---|---|---|
| Curaduría, headings y banda experimental | Johandry | Contenido verificable por preset, ausencia de promesa de AOV y política de ratio sin filtro duro inicial. |
| A+B+C y footer en viewport bajo | Claude, Gemini | Clasificación comprable íntegra, sin formulario/modal anidado; acceso por scroll cuando no cabe. |
| IDs/defaults nuevos y heading | Gemini, con dirección de Johandry | Autorización expresa Nivel 2 de tres controles y default localizado; no migración ciega de valores guardados. |
| Presupuesto de colección 6 → 50 | Gemini | Autorización Nivel 2, límites de cobertura y medición de coste Liquid. |
| Namespace y fuente opcional | Gemini | custom.complementary_products; ambos opt-ins false, manual funcional sin app. |
| Integración de lectura/mutación/foco | Claude | Reusar revisión/cola vigente; un GET condicionado; fragmento aislado; POST incierto reconciliado. |
| Validación y cierre | GPT independiente, Gemini | Comandos de fuentes reales tras implementación, prueba hostil y demos; ledger solo con evidencia concreta. |

La directiva de implementación debe transformar estas propuestas en alcance escrito, archivos permitidos, IDs estables y compuertas. El contexto de Fase 1 comunicada como completada permite planificar Fase 2; no sustituye su validación visual diferida. La presente entrega es un dictamen completo de diseño y riesgos, no autorización autónoma para alterar arquitectura, aplicar schema o declarar cumplida la tienda.

## Catálogo de fuentes primarias

Cada enlace aparece junto al contrato que respalda; los algoritmos y límites Sartorial son propuestas propias.

- [Shopify Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements): títulos oficiales y alcance de requisitos.
- [Input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings), [schema locale files](https://shopify.dev/docs/storefronts/themes/architecture/locales/schema-locale-files), [storefront locale files](https://shopify.dev/docs/storefronts/themes/architecture/locales/storefront-locale-files): settings, traducciones e interpolaciones.
- [Product recommendations](https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations), [complementary products](https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations/complementary-products), [Search & Discovery help](https://help.shopify.com/en/manual/online-store/storefront-search/search-and-discovery-recommendations): configuración y elegibilidad nativas.
- [Recommendations Ajax API](https://shopify.dev/docs/api/ajax/reference/product-recommendations), [Cart Ajax API](https://shopify.dev/docs/api/ajax/reference/cart), [section rendering](https://shopify.dev/docs/api/ajax/section-rendering): transportes y respuestas.
- [product](https://shopify.dev/docs/api/liquid/objects/product), [variant](https://shopify.dev/docs/api/liquid/objects/variant), [line_item](https://shopify.dev/docs/api/liquid/objects/line_item), [quantity_rule](https://shopify.dev/docs/api/liquid/objects/quantity_rule), [routes](https://shopify.dev/docs/api/liquid/objects/routes), [recommendations](https://shopify.dev/docs/api/liquid/objects/recommendations), [metafield](https://shopify.dev/docs/api/liquid/objects/metafield), [metafields access](https://shopify.dev/docs/apps/build/metafields): objetos y contexto.
- [WAI radio](https://www.w3.org/WAI/ARIA/apg/patterns/radio/), [WAI dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [WCAG target size enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html), [WCAG focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): interacción y objetivos accesibles.
- [Canadian Conservation Institute: textiles and costumes](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/textiles-costumes.html): límite de generalización de cuidado en Archive.

### Comprobación del artefacto final por el redactor

Tras integrar los tracks, se leyó exclusivamente este informe y se extrajeron sus tres bloques JSON delimitados mediante regex y se ejecutó `ConvertFrom-Json -Depth 40`. La comprobación del documento confirmó schema de 9 settings, 1 tipo de bloque y límite 2, tres bloques JSON parseables y, antes de la revisión independiente, 11 claves leaf de storefront. La ampliación posterior de notas eleva el bloque final a 13 claves, incluyendo update_unconfirmed, cancel_options, saving_note y note_save_unconfirmed. Es una comprobación del artefacto documental; no valida Liquid, Theme Check, resolución de claves en todos los idiomas ni tienda real. La revisión documental independiente, realizada por audit021_ux con GPT-6.1 Sol después de las correcciones de congelación/commit y cart.note, concluyó PASS documental sin hallazgos materiales pendientes. Estado final: tres bloques JSON, nueve settings, un tipo de bloque con límite dos, 20 referencias t: de schema y 13 claves storefront. Este PASS acredita la revisión del informe; no acredita implementación, Theme Check ni certificación en tienda real.




Comprobación documental tras las dos correcciones de revisión independiente (únicamente lectura de los fences JSON del informe y ConvertFrom-Json):
```text
JSON report blocks PASS: 3; schema settings=9; blocks=1; limit=2; storefront leaves=13
Note keys mapping PASS: saving_note=Saving your cart note…; note_save_unconfirmed=We could not confirm that your cart note was saved.
```
Los 20 t: de schema permanecen iguales; esta revisión no modifica schema ni schema locales. Los nuevos contratos son futuros y no acreditan persistencia de nota o congelación implementadas.

