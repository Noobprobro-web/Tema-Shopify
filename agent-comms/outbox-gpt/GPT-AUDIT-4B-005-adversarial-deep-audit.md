# GPT-AUDIT-4B-005: Auditoría adversarial de Sartorial 1.0.0

```text
ID: GPT-AUDIT-4B-005
Estado: NO APTO PARA SUBMISSION. 10 hallazgos: 1 P0, 5 P1 y 4 P2.
Decisión requerida: Gemini debe asignar correcciones y pruebas de regresión; Johandry conserva la aprobación de submission.
Resumen en 5 líneas:
1. Dos diálogos simultáneos pueden dejar el carrito inaccesible por inert.
2. Cambiar variantes durante una compra permite enviar dos altas de la misma variante.
3. El drawer pierde notas, conserva artículos obsoletos y convierte cantidades vacías en eliminaciones.
4. Hay defectos de formato monetario, normalización de filtros, doble escape y mensajes de error.
5. El catálogo disponible no demuestra los extremos de 50 variantes, 20 imágenes y títulos de 150 caracteres.
Archivos tocados: este informe y GPT-AUDIT-4B-005-artifacts/; herramientas y copias ignoradas en .tmp/gpt-audit-4b-005/.
Desviaciones (Nivel 1 o Nivel 2): ninguna aplicada al tema. Los parches son propuestas, no implementaciones autorizadas.
Hallazgos extra fuera de alcance: no se abren correcciones adicionales. URLs comerciales siguen bajo el bloqueo ya registrado por Gemini.
Verificación: análisis estático, Chromium contra Shopify de desarrollo, fallos de red controlados y comprobación estática de los diffs.
Lista de afirmaciones falsables numeradas: F01-F10 y matriz de cobertura al final.
```

**Base auditada:** `master`, `df6f381`. Fecha de ejecución local: 2026-09-13, America/Caracas. La directiva lleva fecha 2026-09-14; no se ha utilizado esa fecha como evidencia de ejecución.

**Integridad:** SHA-256 original de `assets/theme.js`: `84605901182b15742dd20735d6d9ce1acb15cc601e4c7d6593e3f3939eee815b`. Los 69 archivos de producción incluidos en la instantánea conservan su hash. No se hicieron commit, push ni publicación del tema activo. No se editaron `scripts/`, `BOARD.md` ni el ledger. El informe simultáneo de Claude se dejó intacto y no se utilizó como evidencia de esta auditoría.

**Severidad:** P0 significa un incumplimiento obligatorio documentado que debe bloquear nuestra submission. No implica que pueda garantizar una decisión individual del revisor de Shopify. Los 44px son un criterio interno más exigente: WCAG 2.2 AA y la lista actual de Shopify contemplan 24px y excepciones. No convierto cualquier objetivo inferior a 44px ni cualquier salto de heading en un rechazo automático. [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [requisitos oficiales](https://shopify.dev/docs/storefronts/themes/store/requirements#12-accessibility).

## Hallazgos

### F01 [P0 Bloqueante Theme Store] El carrito abre dentro de un árbol inert

- **Archivo y línea:** [assets/theme.js:L1337-L1351, CartDrawer.open](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/assets/theme.js:1337>); interacción con `ThemeDrawer.setOpen` L188-L206 y `SizeGuideModal.open` L850-L861.
- **Compuerta violada:** 2 y 5. Incumple la accesibilidad por teclado exigida por Shopify, no una preferencia estética.
- **Escenario de reproducción:** en móvil, añadir un enlace `/cart` al menú principal, abrir el menú y pulsar ese enlace. La fixture añadió únicamente el enlace al DOM de la navegación real. Segunda reproducción sin ese enlace: retrasar la respuesta de Add to cart, abrir la guía de tallas y esperar a que llegue la respuesta.
- **Evidencia:** `nested-nav-cart` devuelve `cartOpen:true`, `cartInert:true`, `menuOpen:true`. `add-response-over-size-guide` devuelve `cartOpen:true`, `sizeOpen:true`, `cartInert:true`; después de Tab el foco sigue en `BODY`. Ambos gestores han vuelto inert al ancestro del otro. La captura [nested-modal-mobile.png](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/nested-modal-mobile.png>) muestra la guía superpuesta al carrito.
- **Impacto real:** controles de compra visibles pero no operables; el primer Escape puede cerrar el diálogo equivocado. No cumple el requisito de que toda la página sea accesible mediante teclado. [Shopify, accesibilidad](https://shopify.dev/docs/storefronts/themes/store/requirements#12-accessibility).
- **Parche exacto propuesto:** [F01.patch](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/F01.patch>). Cierra los otros diálogos antes de adquirir inert/foco; cuando el origen es un enlace del menú, devuelve el foco al disparador visible del menú. Impide abrir un drawer desconectado.
- **Cierre exigido:** reproducir ambos caminos; un solo diálogo activo, carrito sin ancestro inert, ciclo Tab y Escape con retorno al control correcto. Dueño propuesto: Claude; revisión de Gemini.

### F02 [P1 Fallo Funcional Grave] Una variante reactiva desbloquea una compra pendiente

- **Archivo y línea:** [assets/theme.js:L558-L560, updateForms](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/assets/theme.js:558>); `CartDrawer.addItem` L1396-L1421.
- **Compuerta violada:** 2, 3 y 5.
- **Escenario de reproducción:** `/products/qa-09-price-varies`, carrito inicialmente vacío con sesión inicializada. Retrasar `/cart/add.js` 1000ms; pulsar Add to cart en Small; cambiar a Medium y volver a Small antes de recibir la respuesta; pulsar Add to cart otra vez.
- **Evidencia:** `final-probes.concurrent`: `enabled:true`, `busy:"true"`; dos respuestas `200` para ID `51271417037043`; el carrito termina con Small, `quantity:2`. El doble clic simple sin cambiar opciones produjo una sola petición: ese caso no es el defecto.
- **Impacto real:** unidades adicionales no protegidas por el estado de carga; respuestas concurrentes también pueden competir al reemplazar el drawer. Deshabilitar un botón no es un bloqueo de la operación cuando otro componente vuelve a habilitarlo.
- **Parche exacto propuesto:** [F02.patch](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/F02.patch>). Bloqueo por formulario con `data-cart-add-pending`, respeto del bloqueo en `updateForms` y resincronización de disponibilidad al finalizar.
- **Cierre exigido:** una sola alta en el escenario anterior; probar también variante agotada y cambio de plan durante una petición. No se presenta este parche como una cola global entre PDP, bundle y cross-sell. Dueño: Claude.

### F03 [P1 Fallo Funcional Grave] Igual cantidad no significa igual carrito

- **Archivo y línea:** [assets/theme.js:L1496-L1506, syncCart](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/assets/theme.js:1496>).
- **Compuerta violada:** 2, 3 y 5.
- **Escenario de reproducción:** agregar A, cerrar el drawer, sustituir A por No image at all manteniendo una unidad desde otra pestaña del mismo navegador y reabrir el drawer. La prueba realizó la sustitución con la API oficial y las mismas cookies de la sesión aislada.
- **Evidencia:** `same-count-stale-cart`: `drawer:["A"]`, `server:["No image at all"]`, `count:1`.
- **Impacto real:** el comprador ve producto, precio y subtotal obsoletos. Como las mutaciones utilizan el índice `line`, puede quitar un producto distinto del que cree estar quitando.
- **Parche exacto propuesto:** [F03.patch](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/F03.patch>). Solicita la sección actual al abrir, sin decidir frescura por `item_count`. Debe integrarse con F04 para conservar borradores locales.
- **Cierre exigido:** mismo recuento con distinto producto, variante, precio o propiedades; comparar contenido y subtotal con la API. Dueño: Claude.

### F04 [P1 Fallo Funcional Grave] El reemplazo del drawer destruye la nota y el foco

- **Archivo y línea:** [assets/theme.js:L1530-L1548, renderSection](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/assets/theme.js:1530>); campo en [sections/cart-drawer.liquid:L386-L389](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/sections/cart-drawer.liquid:386>).
- **Compuerta violada:** 2 y 5.
- **Escenario de reproducción:** activar `show_cart_note`, agregar A, escribir `AUDIT gift note`, cambiar cantidad de 1 a 2 y salir del input con Tab.
- **Evidencia:** `note-loss-and-focus`: `note:""`, `serverNote:""`; inmediatamente después del reemplazo, `tag:"BODY"`, `insideCart:false`, `cartOpen:true`.
- **Impacto real:** se pierden instrucciones del pedido sin advertencia. La reconstrucción del DOM también elimina el nodo que tenía foco.
- **Parche exacto propuesto:** [F04.patch](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/F04.patch>). Identifica notas editadas, conserva su valor durante el reemplazo y restaura el foco al control equivalente o al cierre del drawer.
- **Límite del parche:** preserva el borrador dentro de esta página; el formulario nativo lo envía al continuar a checkout. No implementa ni promete autoguardado de notas entre páginas.
- **Cierre exigido:** cantidad, remove, cross-sell y reapertura; conservar exactamente el texto y una posición de foco válida. Dueño: Claude.

### F05 [P1 Fallo Funcional Grave] Vaciar cantidad equivale a eliminar el artículo

- **Archivo y línea:** [assets/theme.js:L1327-L1333, handleDrawerChange](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/assets/theme.js:1327>); [sections/main-product.liquid:L300-L311](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/sections/main-product.liquid:300>) y [sections/featured-product.liquid:L155-L165](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/sections/featured-product.liquid:155>).
- **Compuerta violada:** 2 y 5.
- **Escenario de reproducción:** en un carrito con un artículo, borrar la cantidad y pulsar Tab. `parseInt('') || 0` acaba llamando a `changeLine(..., 0)`. En PDP, borrar cantidad o asignar letras, que el input number convierte en vacío, deja `form.checkValidity() === true` porque falta `required`.
- **Evidencia:** `empty-quantity-removes-item` termina con `itemCount:0`. `pdp-quantity-and-money.values` registra vacío/`abc` como válidos; `0`, `-2` y `1.5` sí resultaron inválidos en PDP.
- **Impacto real:** pérdida involuntaria de la línea al editar. La validación del formulario de compra tampoco cubre el estado vacío.
- **Parche exacto propuesto:** [F05.patch](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/F05.patch>). Añade `required`, valida antes de mutar y mantiene la eliminación mediante cero explícito en el drawer.
- **Cierre exigido:** vacío, negativo, letras, fracción, cero explícito y reglas min/max/increment; ninguna petición para una entrada inválida. Dueño: Claude.

### F06 [P1 Fallo Funcional Grave] El filtro interpreta 1 250,50 como 125050

- **Archivo y línea:** [sections/main-collection.liquid:L9-L12 y L114-L125](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/sections/main-collection.liquid:114>); [sections/main-search.liquid:L12-L15 y L145-L156](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/sections/main-search.liquid:145>).
- **Compuerta violada:** 2 y 3; cierre de 5 pendiente en un mercado/configuración adecuados.
- **Escenario de reproducción:** configurar `{{ amount_with_space_separator }}` y aplicar precio 1250,50. `money_without_currency` entrega `1 250,50`; el código elimina el espacio, no reconoce ese token como coma decimal y elimina la coma: `125050`. Otra vía: formato sin moneda con punto decimal y formato con moneda con coma; el `or` selecciona el parser equivocado para el valor realmente usado.
- **Evidencia:** derivación estática determinista de esas líneas; el formato con espacio y coma está documentado por Shopify. No se ha cambiado la configuración monetaria de la tienda para presentar esto como una prueba real de EUR. [Formatos admitidos](https://help.shopify.com/en/manual/international/pricing/currency-formatting).
- **Impacto real:** límites y valores activos del filtro se multiplican por 100 o se reinterpretan; al reenviar el formulario se descartan productos válidos o se amplía indebidamente el rango.
- **Parche exacto propuesto:** [F06.patch](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/F06.patch>). Usa el número monetario original dividido por `100.0`, no una representación visual con separadores; elimina el detector muerto. Shopify también representa JPY con centésimas añadidas en los valores Liquid. [Valores monetarios de variante](https://shopify.dev/docs/api/liquid/objects/variant#variant-price).
- **Cierre exigido:** misma selección antes/después de submit en colección y búsqueda para formatos con coma, espacio y punto. Dueño: Claude; fixture de mercado: Johandry/Gemini.

### F07 [P2 Pulido de Borde] formatMoney no cubre todo su contrato

- **Archivo y línea:** [assets/theme.js:L57-L87, formatMoney](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/assets/theme.js:57>); coerción adicional en `updateLineTotal`, L624-L630.
- **Compuerta violada:** 2 y 3.
- **Escenario de reproducción:** usar `amount_with_period_and_space_separator`; inyectar un formato con `&nbsp;&euro;` en el componente real; o entregar `price_cents:null` a `updateLineTotal`. Son pruebas de contrato del componente, no cambios del catálogo ni de Markets.
- **Evidencia:** con 12500,00 por unidad y cantidad 2, el octavo token devuelve `25,000.00 EUR` en lugar de `25 000.00 EUR`. El formato con entidades devuelve `2.501,00&nbsp;&euro;` como texto literal. Un precio nulo termina mostrando `$0.00`. La tabla oficial contiene ocho tokens, no los siete indicados en el comentario. [Shopify, formatos](https://help.shopify.com/en/manual/international/pricing/currency-formatting).
- **Impacto real:** incoherencia entre Liquid y totales JS; basura visible en formatos HTML válidos; datos faltantes se presentan como si el precio fuera cero. No se observó `NaN`/`undefined` visible con las entradas probadas.
- **Parche exacto propuesto:** [F07.patch](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/F07.patch>). Añade el octavo patrón, comprueba datos antes de coerción, valida el formato y decodifica entidades sin insertar el resultado como HTML activo. Un formato no reconocido queda vacío en vez de inventar moneda.
- **Cierre exigido:** los ocho formatos, precio cero legítimo, negativo, fraccionario, nulo, vacío y formato inválido. La actualización no resuelve por sí sola la selección del formato de un mercado extranjero. Dueño: Claude.

### F08 [P2 Pulido de Borde] El cliente ve entidades HTML en búsquedas y traducciones

- **Archivo y línea:** [snippets/predictive-search.liquid:L29](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/snippets/predictive-search.liquid:29>); [sections/main-search.liquid:L47 y L288](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/sections/main-search.liquid:47>); clase repetida `| t ... | escape` en secciones/snippets.
- **Compuerta violada:** 3, 4 y 5.
- **Escenario de reproducción:** buscar `sale` en el modal o abrir `/search?q=THIS_PRODUCT_DOES_NOT_EXIST_976&type=product`. No necesita catálogo extraño ni una traducción personalizada.
- **Evidencia:** búsqueda real: `View all results for &quot;sale&quot;`. Página de búsqueda: `Results for &quot;THIS_PRODUCT_DOES_NOT_EXIST_976&quot;`. Las comillas ya escapadas por la traducción vuelven a escaparse antes del HTML/dataset.
- **Impacto real:** texto y nombres accesibles defectuosos; el problema reaparece con títulos, autores o traducciones que contengan caracteres especiales. No es falta de una clave `t:`: es uso incorrecto de la salida de traducción.
- **Parche exacto propuesto:** [F08.patch](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/F08.patch>). Sustitución acotada de `escape` por `escape_once` en salidas de `t`; incluye las ocurrencias de la clase, no solo los tres ejemplos. No elimina el escape de atributos. [Semántica oficial de escape_once](https://shopify.dev/docs/api/liquid/filters/escape_once).
- **Cierre exigido:** comillas, ampersand, texto que parezca HTML y autor/título con caracteres especiales; nombres legibles y contenido sin ejecutar. Dueño: Claude.

### F09 [P2 Pulido de Borde] Diez settings URL incumplen la compuerta interna de info

- **Archivo y línea:** [config/settings_schema.json:L236-L259](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/config/settings_schema.json:236>); [sections/announcement-bar.liquid:L126-L128](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/sections/announcement-bar.liquid:126>); [sections/bento-discovery.liquid:L215-L218 y L260-L262](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/sections/bento-discovery.liquid:215>); [sections/main-collection.liquid:L467-L469](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/sections/main-collection.liquid:467>); [sections/main-contact.liquid:L308-L310](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/sections/main-contact.liquid:308>).
- **Compuerta violada:** 4 de RULES.md. No he encontrado una regla oficial que convierta automáticamente todo setting URL sin `info` en rechazo; por eso no lo etiqueto P0.
- **Escenario de reproducción:** abrir cualquiera de los cinco enlaces sociales o los cinco enlaces de secciones indicados; no hay `info` sobre el destino externo. El inventario estructural detectó los diez objetos sin ese atributo.
- **Impacto real:** la entrega no satisface su propio criterio de aceptación merchant-facing; los enlaces externos quedan sin la explicación exigida por el proyecto.
- **Parche exacto propuesto:** [F09.patch](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/F09.patch>). Añade una clave explicativa compartida y traducida a esos diez settings. No se alteran IDs ni defaults.
- **Cierre exigido:** inspección del schema y visualización de la ayuda en Theme Editor. Dueño: Claude; Gemini debe decidir si mantiene esta regla uniforme.

### F10 [P2 Pulido de Borde] Un error HTML del servidor expone el mensaje del parser

- **Archivo y línea:** [assets/theme.js:L1405-L1415, addItem](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/assets/theme.js:1405>); mismo parseo en L1450, L1486 y L2124.
- **Compuerta violada:** 2 y 4.
- **Escenario de reproducción:** devolver `500`, `Content-Type:text/html` y `<h1>Temporary server error</h1>` desde `/cart/add.js`; pulsar el botón de compra.
- **Evidencia:** `cart-500-error`: `Unexpected token '<', "<h1>Tempor"... is not valid JSON`. El botón volvió a estar habilitado, por lo que no se afirma un bloqueo persistente.
- **Impacto real:** error técnico en inglés presentado al comprador; no consume la traducción prevista para fallo del carrito. Puede ocurrir ante una respuesta intermedia de servidor/proxy que no sea JSON.
- **Parche exacto propuesto:** [F10.patch](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/F10.patch>). Usa `data-error-message` cuando falla el parseo en las cuatro mutaciones. Conserva la descripción específica de los errores JSON válidos de Shopify.
- **Cierre exigido:** error 422 JSON, 500 HTML y reintento satisfactorio; probar PDP, change, cross-sell y bundle. Dueño: Claude.

## Cobertura y límites

La tienda se sirvió mediante Shopify CLI desde una instantánea en `.tmp/`, en `http://127.0.0.1:9292`, con el tema de desarrollo `165815288051`. No se trabajó contra el tema publicado. Chromium usó contextos propios; se limpiaron sus carritos, sin checkout ni creación de pedidos. Para las pruebas dirigidas se activaron únicamente en la copia: notas de carrito, bloque size guide con sus defaults válidos y un bundle con dos productos existentes.

| Frente | Evidencia obtenida | Lo que no queda certificado |
|---|---|---|
| Schemas/locales | 0 referencias sin resolver; 10 URL sin info; F08 demuestra texto defectuoso aunque las claves existen. | No se certifica toda la copy de todos los idiomas. |
| Listings | Sartorial/Edition/Archive tienen tres templates cada uno, sin sobrescrituras globales dentro de sus JSON. Sus homepages tienen secuencias distintas; PDP varía galería/size guide y colección varía densidad/promoción. | No se ha importado cada preset en una tienda limpia ni comparado su demo. La aceptación de originalidad no se deduce de estos JSON. |
| Código muerto | `main-placeholder` existe pero no aparece en templates/listings JSON. Hay claves huérfanas; no son automáticamente defectos funcionales. | No se propone eliminar fallbacks sin demostrar que su rama sea inalcanzable. |
| Vacío/uno | Carrito vacío; colección filtrada hasta 0; búsqueda con 0 y con 1 resultado; producto de una variante. | No se probó una colección originalmente vacía/de un producto, blog vacío ni artículo con un tag. |
| Catálogo hostil | 17 productos disponibles; máximo 24 variantes, 4 imágenes y título de 124 caracteres. Siete PDP a 390px no tuvieron overflow horizontal y tuvieron un h1. | No se alcanzaron 50 variantes, 20 imágenes ni título de 150 caracteres; tampoco tablas complejas de descripción. Los nombres de las fixtures no sustituyen los datos reales. |
| Faltantes | Producto sin imagen, sin descripción y sin compare-at; precio cero y precio 12500. | No se certifican todos los medios, catálogos B2B ni planes de venta. |
| Concurrencia | Doble clic simple: 1 POST. Variante durante carga: 2 POST y 2 unidades. Predictive slow/fast/borrado: 2 peticiones canceladas y sin resultados obsoletos. | Las respuestas demoradas de predictive fueron controladas; también se hizo una búsqueda real separada. No hay prueba de carga ni de todas las combinaciones entre componentes. |
| Bundle | Deseleccionar los 2 productos deja botón disabled y `Select at least one piece`; seleccionar ambos manda 1 POST con 2 items. | No certifica un bundle de suscripciones o productos de más de 250 variantes. |
| Teclado/tamaño | F01 reproducido; ciclo de guía de tallas y búsqueda, y retorno con Escape probados aisladamente. Botones/inputs/summary visibles medidos en esos siete PDP no quedaron bajo 44px. | No es un barrido exhaustivo de enlaces, swatches, paginación, shadow DOM o lectores de pantalla. No se ejecutó axe ni Lighthouse ni se midieron los 15 esquemas. |
| Lifecycle | Inspección de `this.listen`/AbortController, disconnect y observadores; las suscripciones al documento de los componentes revisados usan el mecanismo base. | No se tomó un heap profile. No se demuestra ausencia de fugas; tampoco se convierte cada fetch sin signal en una fuga confirmada. |
| Moneda | JPY `¥{{ amount_no_decimals }}`: `¥2,500`; EUR con coma: `2.501,00 €`; EUR con espacios: `2 501,00 €`, todos para cantidad 2 con los datos de prueba documentados. F07 cubre los contraejemplos. | Son formatos inyectados en el componente real; la tienda seguía en `${{amount}}`. No es una prueba de Markets, tipo de cambio ni checkout japonés/europeo. |

Shopify pide templates propios para cada preset y correspondencia con sus demos; no exige que los presets de un mismo tema tengan código completamente independiente. No traslado la regla de originalidad entre temas distintos a una supuesta obligación de reescribir cada preset. [Requisitos de presets](https://shopify.dev/docs/storefronts/themes/store/requirements#18-naming-themes-and-theme-presets).

Se ensayó también una nota con delimitadores HTML y una marca inocua: no se observó ejecución. No se reporta XSS basándose solo en que una interpolación carezca de `escape`, ni se declara seguridad global por ese único ensayo. Una primera fixture con una tabla dentro de un setting `richtext` fue rechazada por Shopify; se corrigió la fixture a los defaults permitidos y se repitieron las pruebas. Ese error de preparación no cuenta como defecto del tema.

## Evidencia y validación

Evidencia persistente: [evidence.json](<C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/agent-comms/outbox-gpt/GPT-AUDIT-4B-005-artifacts/evidence.json>). Conserva resultados, catálogo, manifest de parches y hashes. Los scripts usados están archivados en la misma carpeta; se ejecutaron desde la raíz del repositorio con rutas de trabajo bajo `.tmp/gpt-audit-4b-005/`. Son herramientas de auditoría, no nuevas dependencias ni una suite aprobada de producción. El inventario estático ubica el primer `id` coincidente cuando el ID se repite; las dos líneas de `bento-discovery` se verificaron aparte con `rg` y arriba se citan L215 y L260, no dos veces L215.

Comandos ejecutados y salidas relevantes literales:

```text
git rev-parse --short HEAD
df6f381

node --check assets/theme.js
[sin salida, código 0]

npx.cmd shopify theme check --no-color
72 files inspected with no offenses found.
[código 0]

node scripts/locale-key-inventory.mjs
Archivos escaneados:            65 (incluye /listings, fuera de Theme Check)
Referencias estaticas | t:      322 claves distintas
Referencias de schema t::       327 claves distintas
Sin resolver en storefront:     0
Sin resolver en schema:         0
Huerfanas en storefront:        1
Huerfanas en schema:            62
OK: todas las referencias estaticas resuelven contra los locales.

rg -n 'main-placeholder' templates listings -g '*.json'
[sin coincidencias, código 1]

node .tmp/gpt-audit-4b-005/probe.mjs
node .tmp/gpt-audit-4b-005/browser-audit.mjs
node .tmp/gpt-audit-4b-005/browser-targeted.mjs
node .tmp/gpt-audit-4b-005/browser-final-probes.mjs
[resultados JSON en evidence.json; código 0 no implica que todos los ensayos hayan sido satisfactorios]

node .tmp/gpt-audit-4b-005/validate-proposals.mjs
{"proposedPatches":10,"combinedApply":"PASS in ignored copy only","nodeCheck":0,"jsonAndSchemasParsed":54,"productionFilesChangedSinceSnapshot":[]}

npx.cmd shopify theme check --path .tmp/gpt-audit-4b-005/proposals/combined --no-color
67 files inspected with no offenses found.
[código 0]
```

Cada diff pasó `git apply --check` contra la base original. Los diez también se aplicaron juntos, exclusivamente en una segunda copia ignorada, y pasaron sintaxis JS y parseo de 54 JSON/schemas. El recuento de Theme Check de esa copia no debe confundirse con el de la raíz: son rutas de inspección distintas. **Ningún parche se ha validado todavía en navegador después de aplicarlo.** Su estado es propuesta aplicable con validación estática, no arreglo aceptado.

## Decisión operativa

No cierro ni modifico filas del ledger. Deben permanecer pendientes de evidencia las filas de teclado, filtros facetados y moneda; F01/F06 refutan cualquier cierre basado solo en presencia de código. El cierre comercial de URLs y nombres sigue siendo de Johandry/Gemini; esta auditoría no sustituye esa verificación.

1. Gemini: autorizar un hotfix para F01-F05 y definir la regresión cruzada del carrito.
2. Claude: implementar los parches aceptados, revisando especialmente el alcance transversal de F08. Preservar los cambios concurrentes ajenos.
3. Johandry/Gemini: preparar fixtures reales de 50 variantes, 20 imágenes, 150 caracteres, tablas, colección/blog vacíos y Markets JPY/EUR.
4. Revisor distinto del implementador: repetir los casos F01-F10 y completar las mediciones pendientes. Hasta entonces, mantener bloqueada la submission.

No hay aprobación global del tema ni porcentaje de cumplimiento en este dictamen.
