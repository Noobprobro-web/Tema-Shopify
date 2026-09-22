ID: GPT-AUDIT-005-sprint-5a-adversarial
Estado: ENTREGADO - RECHAZADO para cierre adversarial de Sprint 5A
Decisión requerida: Gemini debe bloquear la certificación de QB-11 y SW-06, asignar a Claude el fail-closed de selling plans y el estado agotado de Quick Buy, y encargar a Johandry/Gemini completar los fixtures y la configuración de filtro antes de repetir Gate 5. No autorizar submission por este dictamen.
Resumen en 5 líneas:
1. F06 mostró éxito en EN y ES sin agregar ninguna línea: la variante exige selling plan, pero el PDP no ofrece plan y mantiene Add/Buy it now activos.
2. Bone agotado en F04 conserva un Quick Buy activo que abre un selector con todas las tallas deshabilitadas.
3. El carrito sí pasó la prueba autorizada de borrado: 7 -> 0 artículos, estado vacío, progreso reiniciado y foco devuelto al disparador con Escape.
4. La colección demuestra buena parte del flujo de swatches y compra a 1280/390 px, pero F11 tiene 7 variantes, no 50, y no hay filtro Color ni fixtures F07/F08/F12.
5. La evidencia disponible no permite afirmar 36/36 criterios ni paridad de release; varias pruebas de red, hover, no-JS y promociones reales siguen abiertas.
Archivos tocados: solo este informe; ningún archivo del tema, scripts, BOARD o ledger.
Desviaciones (Nivel 1 o Nivel 2): ninguna; auditoría sin implementación.
Hallazgos extra fuera de alcance (con parche listo): H3 promesa de regalo/envío sin cotejo con checkout y H4 truncamiento de marca móvil; propuestas concretas abajo. H2 es un fallo de UX dentro del scope.
Verificación (comando, resultado y qué demuestra/qué no): ver sección 8. `git status --short --branch` antes de escribir: `## master...origin/master`. Navegador real EN/ES, 1280 px y 390 x 844 px. No se ejecutaron Theme Check, Lighthouse, interceptación de requests ni modo sin JS en esta auditoría.
Lista de afirmaciones falsables numeradas:
1. En F06, `requires_selling_plan=true`, no existe input `selling_plan`, los botones de compra están activos y el mensaje de éxito aparece sin una línea F06 en el carrito, en ambos idiomas.
2. El Quick Buy de F04/Bone se puede abrir, aunque todas las tallas están deshabilitadas.
3. El JSON de variantes de la card F11 contiene exactamente 7 variantes en la colección evaluada.
4. Al borrar todas las líneas de prueba, el carrito muestra 0, el mensaje vacío y $150 pendientes; Escape cierra y devuelve foco al control que abrió el drawer.
5. En la colección evaluada hay filtros Availability y Price, pero no Color.
6. A 390 px la marca visible se elide aunque el nombre accesible completo sea LINEA NOVE.

## 1. Dictamen ejecutivo

**RECHAZADO para cierre adversarial de Sprint 5A.** No es una predicción categórica del dictamen de Shopify; es una decisión de calidad interna. QB-11 (P0) falla en tienda real y SW-06 (P0) tiene un callejón sin salida. Además, faltan los datos y modos de prueba para certificar otros P0. El estado `cumplido` del selector/selling plans en `docs/requirements-ledger.md:66,68` debe ser reexaminado por Gemini: la evidencia nueva contradice al menos el caso hostil F06. GPT no modificó el ledger.

**Ámbito:** [colección EN](https://tema-qkqpke0j.myshopify.com/collections/qa-sprint-5a), [colección ES](https://tema-qkqpke0j.myshopify.com/es/collections/qa-sprint-5a), PDP F06 EN/ES, PDP F11 y CartDrawer. Tema activo Couture #165809488115. El storefront se probó como comprador; no se inspeccionó Theme Editor ni checkout final.

## 2. Hallazgos priorizados y parches

### H1 - P0: F06 confirma una compra que no existe (QB-11)

- **Reproducción:** abrir `/products/qa5a-f06-subscription` y `/es/products/qa5a-f06-subscription`. El JSON visible de variante declara `requires_selling_plan: true` y `selling_plan_allocations: []`; no hay control `name="selling_plan"`. Add to cart y Buy it now están activos. Pulsar Add abre el drawer con `Item added to your cart.` / `Artículo añadido a tu carrito.`, pero el contador no aumenta ni aparece F06. Se reprodujo una vez en cada idioma; no se repitió después de limpiar el carrito.
- **Impacto:** falsa confirmación de compra, pérdida de conversión y confianza. El fixture puede estar mal configurado en Shopify, pero el tema debe fallar cerrado ante ese dato; tampoco permite certificar la ruta con un plan válido.
- **Causa localizada:** `sections/main-product.liquid:425` solo dibuja opciones si hay grupos; `:550-571` habilita Add y pago dinámico según disponibilidad, no según plan exigido sin asignación. `assets/theme.js:733-737`, `VariantSelects.isPurchaseOptionValid`, devuelve `true` si no existe `this.sellingPlans`. `assets/theme.js:2174-2180`, `CartDrawer.addItem`, anuncia éxito después de una respuesta HTTP OK sin verificar que la línea solicitada figure en el carrito fresco.
- **Parche para Claude:** en Liquid, calcular `requires_plan_without_allocation` a partir de la variante activa y `selling_plan_allocations.size == 0`; deshabilitar Add y no renderizar pago dinámico en ese estado, con copy localizado y enlace/estado claro. En JS, cambiar la rama sin UI de planes a `return !variant.requires_selling_plan`; en modo suscripción exigir una asignación de la variante actual. Antes de `showStatus(added)`, verificar que la respuesta y el carrito fresco contienen la variante/plan solicitados; si no, mostrar error localizado y mantener carrito intacto. Crear además un fixture con grupo/plan **realmente activo** y repetir compra EN/ES, cambio de variante y pago dinámico.

### H2 - P1 de UX / SW-06 P0 en la matriz: color agotado conduce a selector sin salida

- **Reproducción:** card F04, seleccionar Bone; muestra `Sold out`, pero `Quick add` permanece activo. Abrir: S/M/L/XL están todos deshabilitados y no se puede completar la acción.
- **Impacto:** promesa de acción inútil, especialmente incómoda en móvil; no se observó alta indebida.
- **Causa localizada:** `assets/theme.js:1783-1812`, `ProductCardVariants.syncPicker`, deshabilita cada talla, pero no sincroniza el estado de `.quick-buy__trigger` de `snippets/product-card.liquid:343` cuando no queda ninguna variante comprable.
- **Parche para Claude:** computar `offered.some(v => v.available)` para el color comprometido; si es falso, deshabilitar el trigger, asignar etiqueta localizada `Sold out`/`Agotado` y comunicarlo al grupo. Al seleccionar otro color disponible, restaurar `Quick add`. Mantener la card/enlace al PDP accesibles.

### H3 - P1 de confianza, pendiente de verificación de negocio: recompensa prometida

- **Reproducción:** al superar $250, el drawer anuncia `Complimentary Shipping and Atelier Gift unlocked`; al quedar vacío, vuelve a `Add $150.00 for Complimentary Shipping`. `sections/cart-drawer.liquid:9-28,83-118` calcula hitos a partir de `cart.total_price`, pero esta auditoría no verificó tarifa real de envío, descuento, ni entrega del regalo en checkout. El carrito no mostró una línea de regalo; eso por sí solo no prueba que falte un mecanismo externo.
- **Impacto:** si checkout no cumple la promesa, el copy se convierte en reclamo engañoso. Si sí existe una automatización, falta evidencia de extremo a extremo.
- **Acción/parche:** Johandry confirma la regla real de envío y regalo en Shopify; Gemini exige prueba $0/$149/$150/$151/$250 y con descuento. Si no hay regalo automático verificable, desactivar/ocultar el hito y su promesa hasta configurarlo. No cambiar umbrales en JS.

### H4 - P2 visual: marca truncada en cabecera móvil

- **Reproducción:** viewport 390 x 844: `LINEA NOVE` aparece visualmente `LINEA N...`; `.site-header__brand-text` mide aprox. 118 px de ancho disponible frente a 138 px de contenido, con `overflow:hidden; text-overflow:ellipsis; white-space:nowrap` en `assets/base.css:655-663` y layout móvil en `:7995-8019`.
- **Impacto:** señal de marca principal incompleta en un preset de lujo. El nombre accesible del enlace sigue completo; es visual, no pérdida semántica.
- **Parche para Claude, previa decisión de Gemini:** reservar ancho intrínseco suficiente para la marca reduciendo el espacio de acciones o recolocando una acción en menú móvil; probar el nombre completo en 360 y 390 px, EN/ES, sin reducir tap targets ni provocar solape. No esconder el defecto solo con un font-size diminuto.

## 3. Ocho fixtures: evidencia observada

| Fixture | Resultado en storefront | Límite de la evidencia |
| --- | --- | --- |
| F01, simple disponible | Add directo, línea F01 $420 y foco sobre nueva línea. Doble clic rápido incrementó solo una unidad. | No se capturó número de requests ni payload. |
| F02, simple agotado | CTA `Sold out` deshabilitado. | No se inspeccionó tráfico para demostrar cero POST. |
| F03, talla | Selector XS/S/L/XL; M visible y deshabilitada; elegir L añadió L exacta ($890). En móvil el diálogo ocupó ancho 390 y Escape restauró foco. En ES se añadió S y los controles se localizaron. | No hubo throttling ni captura de dos requests concurrentes. |
| F04, color x talla | Ink sale $320 frente a $380; Camel $340; Olive/XL inexistente deshabilitada. Ink/L se añadió con opciones Color Ink, Size L y precio $320, también en ES. Los cuatro colores se renderizan como texto, no hex inventado. | Bone abre selector muerto (H2); no hay Blue del ejemplo original, se probó Ink/L. |
| F05, swatches nativos | Ink/Bone con color nativo, Clay con imagen, Undyed como pastilla textual. Click y flecha de teclado cambiaron selección e imagen; Undyed mantuvo imagen válida. | Hover/pointerleave no fue automatizable con la interfaz usada; no afirmar SW-02/03. |
| F06, plan obligatorio | Card enlaza a PDP con `Choose options`; PDP carece de plan seleccionable y da falso éxito EN/ES. | El fixture no contiene allocation real, por lo que tampoco valida un plan válido. |
| F10, card hostil | Título de 142 caracteres sin solapar precio/CTA en desktop ni en grid móvil de 2 columnas; CTA de 44 px. | `show_vendor=false`: vendor largo no llegó a superficie visible. Falta caso sin imagen. |
| F11, muchos colores | En card ancha: 4 swatches +3; en card estrecha: 2 +5. `+N` navega al PDP. Camel añadió variante exacta $690; después se eliminó. | JSON real de la card: `variantCount: 7`, no 50. No certifica alto número de variantes. |

## 4. Matriz Quick Buy (QB-01 a QB-20)

`Pasa` significa comprobación visual/interactiva suficiente para el aspecto indicado; `Parcial` significa que falta una condición expresa del criterio; `NV` significa no verificado. Ningún `Parcial` o `NV` cierra el P0 correspondiente.

| ID | Estado | Evidencia o bloqueo |
| --- | --- | --- |
| QB-01 | Parcial | F01 agregó 1 y confirmó línea; no se capturó que fuera exactamente 1 POST. |
| QB-02 | Parcial | F02 disabled; sin inspección de red para probar 0 POST. |
| QB-03 | Pasa | F03 exigió elegir talla en diálogo. |
| QB-04 | Pasa | M agotada visible, disabled y `aria-disabled`; no se envió. |
| QB-05 | Parcial | Ink/L correcto en carrito; fixture no tiene Blue/L y no se capturó payload. |
| QB-06 | NV | No se pudo retener una talla elegida sin enviarla: el botón de talla ejecuta Add; falta prueba específica de conservación/invalidez al cambiar color. |
| QB-07 | Parcial | Card Ink/Camel y carrito Ink/L muestran precios correctos; no se capturó respuesta servidor de compare-at. |
| QB-08 | Parcial | Doble clic F01 produjo una sola unidad adicional; falta conteo de POST bajo red lenta. |
| QB-09 | Parcial | S+L simultáneos en F03 terminó con una sola nueva línea S; no hubo throttle ni payload para probar todas las carreras. |
| QB-10 | NV | No se inyectaron 429/500/503 HTML. Código defensivo visible en `assets/theme.js:2169-2174`, no prueba del comportamiento. |
| QB-11 | **Falla** | F06: sin plan activo, PDP ofrece Add y anuncia éxito sin línea real (H1). |
| QB-12 | NV | F07 ausente de la colección. |
| QB-13 | NV | F08 ausente. |
| QB-14 | NV | F12 >250 ausente. |
| QB-15 | NV | F12 combined listing ausente. |
| QB-16 | NV | No se probó JavaScript desactivado. |
| QB-17 | Pasa | `/es/collections/qa-sprint-5a`, F03-S y F04-Ink/L, drawer y rutas en español. |
| QB-18 | Pasa | Escape cerró selector y retornó foco al trigger. |
| QB-19 | Parcial | Flechas, foco en drawer y Escape observados; faltan Enter/Space, lector de pantalla y recorrido completo. |
| QB-20 | Pasa en UI | F10 en 390 px/2 columnas: sin overflow ni solape; CTA 44 px. Vendor no visible. |

## 5. Matriz Swatches (SW-01 a SW-16)

| ID | Estado | Evidencia o bloqueo |
| --- | --- | --- |
| SW-01 | Pasa | F05 imagen/color/texto nativos y F04 texto limpio; no se infirió color del nombre. |
| SW-02 | NV | No hubo hover físico reproducible ni medición del ID durante preview. El JS contiene listeners `pointerenter`, pero eso no es Gate 5. |
| SW-03 | NV | No se probó `pointerleave` real ni CLS/flash. |
| SW-04 | Parcial | Click/tap cambió seleccionado, enlace, imagen/alt, precio y tallas; anuncio auditivo no verificado. |
| SW-05 | Parcial | Radiogroup Color, nombres, `aria-checked`, flecha de teclado; Enter/Space/lector de pantalla pendientes. |
| SW-06 | **Falla** | Bone agotado visible, pero Quick add sigue activo y abre diálogo sin talla accionable (H2). |
| SW-07 | Pasa | Camel S/M y Olive XL quedaron inactivos; Ink/L sí comprable. |
| SW-08 | Pasa en UI | Undyed sin imagen específica conservó imagen válida. |
| SW-09 | Parcial | Clicks rápidos Ink -> Bone -> Clay terminaron en Clay; no se forzó respuesta A/B tardía. |
| SW-10 | Pasa | 390 px, dos columnas: 2 swatches + `+N`, targets 44 x 44, sin scroll horizontal. |
| SW-11 | Pasa | Card >=260 px/una columna: 4 +N; F11 4+3 y 2+5 según ancho. |
| SW-12 | Pasa | `+N` abre el PDP con color/variante seleccionados. |
| SW-13 | NV | La colección solo ofrece Availability/Price; falta filtro Color con 12 valores. |
| SW-14 | NV | Sin Color filter no se puede seleccionar/limpiar y comprobar URL/conteos. |
| SW-15 | NV | Sin Color filter no se puede separar estado del filtro y swatch de card. |
| SW-16 | NV | Solo 8 cards en la colección; faltan 24 x 7 y medición de requests/media. |

## 6. Compra, CartDrawer y borrado autorizado

- **Add y foco:** F01/F03/F04/F11 abrieron drawer después de añadir y mostraron línea/variante esperada; el foco pasó a la línea añadida. Tab y Shift+Tab recorrieron 12 ciclos sin salir del drawer en desktop; Escape lo cerró. En móvil 390 px el checkout quedó dentro del viewport y su botón midió 44 px. No se midió latencia cuantitativa.
- **Borrado completo, autorizado por Johandry:** sesión de prueba con F01 x3, F03-S x2, F03-L x1 y F04-Ink/L x1 = 7 artículos. Eliminar F04 -> 6, F03-S -> 4, F03-L -> 3, F01 -> 0. Tras cada rerender, el foco quedó en `Close` dentro del drawer, nunca en BODY. En 0: `Your cart is currently empty.`, `Add $150.00 for Complimentary Shipping`, progreso `aria-valuenow=0`, `Continue shopping`. Al pulsar Escape, el drawer desapareció y el foco volvió al control que lo abrió: icono `Cart, 0 items` en esa ruta. Luego añadí y borré F11-Camel: volvió a 0; Escape devolvió foco al Add de F11, correcto para ese origen.
- **No se dejó mercancía de prueba en el carrito:** última inspección del DOM: `cartText: 'Cart, 0 items'`, `dialogOpen: false`, foco en botón Add de F11. No se hizo checkout ni pedido.
- **Notas/cross-sell:** `config/settings_data.json:77` tiene `show_cart_note: false`; no se evaluó conservación de borrador. No apareció sugerencia válida de cross-sell en este carrito, por lo que tampoco se certifica su flujo. No convertir su ausencia en fallo de código sin configuración de merchant.
- **Recompensas:** $0 y >$150 observados; faltan $149/$150/$151, descuento, Markets y verificación real en checkout. El regalo a $250 se anunció pero no se certificó la entrega.
- **Bilingüe:** mensajes de drawer y Quick Buy estaban localizados; títulos de fixtures y opciones de catálogo siguen en inglés porque son datos de producto sin traducción, no una prueba de ausencia de claves `t:` del tema.

## 7. Viabilidad comercial y prioridades Sprint 5B

La lista pública actual coloca [Dawn](https://themes.shopify.com/themes/dawn/presets/dawn) en **gratis**, [Empire](https://themes.shopify.com/themes/empire/presets/empire) en **$360**, [Prestige](https://themes.shopify.com/themes/prestige/presets/prestige) en **$400** y [Symmetry](https://themes.shopify.com/themes/symmetry/presets/symmetry) en **$420**. Las fichas oficiales ya anuncian Quick Buy, swatches y zoom de imagen en varios de ellos; estas funciones no justifican por sí solas $380. La defensa del precio debe ser una experiencia editorial coherente, soporte y demos de tres presets con compra inequívoca. Shopify exige una demo por preset, paridad entre demo e instalación y pruebas funcionales completas en [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements). Esto es posicionamiento y riesgo, no un veredicto oficial de rechazo.

**Antes de Sprint 5B (dueños):**

1. **Claude, P0:** corregir H1 y H2; Gemini audita diffs, plan real y regresión EN/ES antes de levantar bloqueo.
2. **Johandry/Gemini, P0 de evidencia:** publicar F07, F08, F12, corregir F11 a 50 variantes, configurar Search & Discovery Color con 12 valores y metaobjetos; repetir todos los P0 marcados Parcial/NV, incluida red degradada, no-JS y hover. No certificar por Theme Check.
3. **Johandry, P1 negocio:** demostrar tarifa/envío y regalo reales en checkout; si no, retirar promesa. Habilitar nota/cross-sell solo si se desea venderlos como ventaja y probarlos con configuración real.
4. **Claude/Gemini, P1 Sprint 5B:** zoom de tejido con imagen de alta resolución y salida accesible; PDP media con 10+ imágenes, video/modelo y alt/foco; Complete the Look con 2-4 piezas, variante/selling plan/stock, precio total y POST único confirmado. Medir INP/CLS y móvil 390, no priorizar morphing visual antes de compra confiable.
5. **Claude, P2 con autorización de Gemini:** corregir elipsis de marca móvil H4 sin comprometer targets ni navegación.

## 8. Verificación reproducible y límites

| Acción/comando | Salida observada | Demuestra | No demuestra |
| --- | --- | --- | --- |
| `git status --short --branch` antes del reporte | `## master...origin/master` | Worktree limpio al iniciar auditoría. | Calidad funcional. |
| Browser `domSnapshot()` EN tras borrado | `link "Cart, 0 items"`, `Your cart is currently empty.`, `Add $150.00 for Complimentary Shipping`, `progressbar "Cart rewards progress"`. | Carrito 0 y UI vacía en sesión real. | Tarifas/checkout; ausencia de errores en toda sesión. |
| Browser read-only `evaluate`: card F11, `JSON.parse([data-card-variants].textContent).variants.length` | `variantCount: 7` | El fixture F11 no cubre 50 variantes. | Rendimiento/estado de 50 variantes. |
| Browser read-only `evaluate` después de Escape | `cartText: 'Cart, 0 items'`, `dialogOpen: false`, foco en `button[data-quick-buy-direct]` de F11. | Foco restaurado al iniciador de esa apertura y drawer cerrado. | Lector de pantalla real. |
| `rg -n` en Liquid/JS | `main-product.liquid:425,550-571`; `theme.js:733-737,2174-2180`; `theme.js:1783-1812`. | Ramas que explican H1/H2; líneas verificadas en disco. | Que todo dato de Shopify tenga esta forma. |
| Consola del tab nuevo `dev.logs({levels:['error','warn'],limit:30})` | `[]` | Sin warnings/errors capturados en ese tab. | No certifica consola de la sesión anterior ni ausencia universal de errores. |

No se capturaron screenshots persistentes ni payloads HTTP; las inspecciones visuales y DOM fueron en navegador en vivo. Ninguna ausencia de evidencia se presenta como pase. Este informe no reemplaza los gates estáticos ni la auditoría de Gemini.
