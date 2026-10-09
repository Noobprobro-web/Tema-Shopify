ID: GPT-UX-LUXURY-001
Estado: Dictamen documental de segunda opinión; no se modificó código.
Decisión requerida: Confirmar si $380 es precio objetivo o publicado, y reconciliar esa decisión con el estado actual de la versión antes de aprobar el alcance de v1.1.0.

Resumen en 5 líneas:
1. La propuesta no parte de cero: el sticky cart sigue variante, cantidad, plan de compra y total de línea; el cajón ya incluye progreso de envío y venta complementaria.
2. La diferencia comercial debe provenir de experiencias editoriales completas y creíbles, no de añadir controles visibles.
3. Maison y Contour no coinciden con el posicionamiento descrito: Maison es un preset de Gain para hogar; Contour es un preset de Responsive.
4. Sus fichas oficiales consultadas indican $100 para Maison y $220 para Contour; $380 requiere justificar el valor del paquete, no sólo contar funciones.
5. No atribuyo errores de UX a competidores sin recorridos reproducibles en demos. Las fichas muestran oferta anunciada, no conversión ni calidad de uso.

Archivos tocados: Ninguno. Se revisaron en modo de solo lectura el estado de Git, AGENTS.md, agent-comms/RULES.md, agent-comms/BOARD.md, los archivos de código señalados abajo y los informes GPT-018/GPT-019.

Desviaciones (Nivel 1 o Nivel 2): No aplica; no hubo implementación. Las recomendaciones de alcance requieren decisión del dueño/arquitectura antes de convertirse en cambios.

Hallazgos extra fuera de alcance (con parche listo): No se preparó parche. El repositorio ya contiene implementaciones que se solapan con la propuesta; verificar su estado en tienda real antes de presupuestarlas como funciones nuevas.

Dictamen de producto y benchmark:

- Contour: la ficha oficial lo presenta como preset de Responsive por $220 USD, con énfasis en imágenes de producto, zoom, videos, banners, filtrado y ordenación, productos recomendados y cabecera sticky. La ficha muestra 96% de reseñas positivas sobre 341 reseñas del conjunto Responsive y presets, no de Contour por separado. Fuente: https://themes.shopify.com/themes/responsive/presets/contour
- Maison: la ficha oficial lo presenta como preset de Gain por $100 USD, dentro de un conjunto de cinco presets, con discurso dirigido a muebles, decoración y hogar. Anuncia lookbooks, galerías, hotspots, animación, recomendaciones y filtrado. Muestra 91% positivo sobre 81 reseñas del conjunto Gain, no Maison de forma aislada. La etiqueta “alta costura” no coincide con su posicionamiento público actual. Fuente: https://themes.shopify.com/themes/gain/presets/maison
- Annex: esta revisión no encontró una ficha oficial inequívoca con ese nombre. No completar la comparación con inferencias; hace falta la URL exacta o evidencia del investigador que identificó el tema.
- No hay evidencia pública comparable de conversión ni de errores de usabilidad en las páginas de fichas. Las reseñas y listas de funciones no prueban esas métricas. Comparar las demos con las mismas tareas: encontrar una variante, entender entrega y devoluciones, comprar un look y completar el flujo desde el cajón.

Contradicción de versión y precio:
`agent-comms/BOARD.md:30` denomina al Sprint 5C “The Luxury Triple Crown ($380 USD Tier)” y dice que está certificado. El informe `agent-comms/outbox-gpt/GPT-REPORT-018-multiagent-commercial-audit.md:31,63` dice que $380 es un segmento propuesto y que el precio propio no está publicado/certificado. Además, `config/settings_schema.json:3-8` declara `theme_version` 1.0.0. Hay que separar el estado implementado/certificado del objetivo comercial v1.1.0 y confirmar cuál es el precio final.

Estado de la propuesta frente al código actual:

1. PDP dynamic subtotal: existe mecanismo de total de línea sincronizado, no sólo una idea. `assets/theme.js:1185-1245` obtiene la cantidad del formulario, observa el total de línea actualizado por VariantSelects y reacciona a cambios de variante y plan de compra. Las claves de UI incluyen cantidad × precio en `locales/en.default.json:432-433`. La recomendación es certificarlo y corregir sólo fallos encontrados. No presentar `precio × qty` como importe final descontado: descuentos automáticos, descuentos de carrito y apps pueden cambiar el total. Preferir el total real de línea renderizado; informar que envío e impuestos se calculan aparte.
2. Presets: existen listings y plantillas por preset (`listings/sartorial`, `listings/edition`, `listings/archive`), pero no se verificó en esta revisión que todas las nuevas estructuras propuestas estén implementadas como experiencias completas. Las notas de sastrería, especificaciones de Edition y procedencia/estado de Archive requieren datos y contenido del comerciante, idealmente estructurados por producto/variante.
3. Cart drawer: ya implementa hitos/mensajes de envío en `sections/cart-drawer.liquid:9-35` y recomendaciones complementarias en `:297-447`; las recomendaciones por colección se limitan a dos productos. “Complete the Outfit” parece un encuadre editorial para capacidad existente, no una función enteramente nueva. No prometer “express” salvo que tarifa, cobertura y plazo correspondan a una configuración real.
4. PLP View Switcher: el barrido acotado de referencias a `view-switch`/`collection-view` no localizó una implementación. En este dictamen queda como función propuesta/no confirmada. Es la prioridad más baja: incluirla sólo si resuelve el uso de una colección densa y preserva filtros, orden y contexto en móvil.
5. Sticky Quick-Buy Bar: ya existe `<sticky-cart-bar>` en `assets/theme.js:1185-1285`, incluida sincronización de variante, cantidad y total de línea. No tratar como nueva capacidad. Confirmar recorrido de teclado/móvil y casos de inventario antes de ampliar el componente.

Psicología de lujo y conversión:

- Mantener la cantidad inicial en 1. Mostrar el total de línea con discreción o a partir de qty > 1; en moda de lujo, la unidad extra suele ser menos importante que el complemento coordinado.
- Evitar una calculadora de precio dominante, múltiples badges promocionales y un CTA sticky que compita con el hero o el contenido editorial.
- Atelier: split editorial y lookbook deben ganar por dirección de arte, no densidad. “Worn on the Runway” es una afirmación factual; usarla sólo con respaldo y derechos para la historia y las imágenes.
- Edition: GSM, hardware y tinte deben proceder de datos que el comerciante pueda mantener por producto/variante; evitar una tabla vacía o copiada entre productos.
- Archive: “Circa 1995”, procedencia, pieza única y escala de conservación necesitan fuente, criterios comprensibles y fotos del estado. “1-of-1” debe corresponder a inventario realmente único y no a variantes/reposiciones.
- El cross-sell debe ser contextual, no repetido ni ya presente en el carrito. Preservar subtotal y checkout visibles en el cajón.

Merchant Surface y localización:

- Cumplir la compuerta del proyecto: labels en inglés neutro, sentence case y sin jerga interna como “Bento” o “popover”. Los labels, names, option text e info deben usar claves `t:` y tener entradas resueltas en locale schema.
- Añadir `info` en settings dependientes de integraciones/datos externos: metafields de materiales o procedencia, tarifas de envío y descuentos automáticos. Para texto como “Worn on the Runway”, proporcionar guía que exija verificar el claim.
- Shopify documenta localización de atributos de schema y Theme Check para claves de traducción válidas: https://shopify.dev/docs/storefronts/themes/architecture/settings y https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks/valid-schema-translations. Sentence case e info obligatorio en estos casos son reglas del proyecto.

Priorización recomendada:
1. Resolver versión, precio, naming y contenido exacto de v1.1.0; actualizar la discrepancia entre BOARD y GPT-018.
2. Priorizar confianza y datos por preset: especificaciones de Edition, procedencia/condición de Archive, y claims/fotos de Atelier. Completar fotos y su asociación a variantes antes de añadir módulos decorativos. GPT-018:37 reporta evidencia anterior de 38 variantes Edition sin asociaciones de imagen por acabado; comprobar el estado actual antes de dar ese hallazgo por vigente.
3. Certificar el total de línea y sticky bar existentes con variante, qty, plan de compra, descuentos, inventario único, accesibilidad, moneda y móvil. Implementar sólo los fallos que aparezcan.
4. Validar reglas de envío y pulir cross-sell existente; no prometer envío express sin plazo/cobertura verificables.
5. Prototipar PLP view switcher sólo si una prueba con colección densa muestra ventaja clara frente a la rejilla en desktop y móvil.

Verificación (comando, resultado y qué demuestra/qué no):
- `git status --short`: mostró numerosos cambios locales previos; se conservaron y no se tocaron.
- `rg -n ... assets/theme.js sections/cart-drawer.liquid locales/en.default.json config/settings_schema.json`: localizó las referencias indicadas arriba. Demuestra presencia de código/claves en el checkout, no comportamiento completo en tienda real.
- Búsqueda web a fichas oficiales Theme Store de Responsive/Contour y Gain/Maison, y docs Shopify de settings/traducciones: confirma oferta/precio anunciado en páginas consultadas y reglas documentadas; no prueba UX de las demos ni conversiones.
- No se recorrieron demos ni se verificó Annex. Sin pruebas de rendimiento, conversión, checkout, lector de pantalla ni tienda real en este encargo.

Lista de afirmaciones falsables numeradas:
1. El esquema local declara versión 1.0.0 en `config/settings_schema.json:3-8`.
2. `assets/theme.js:1185-1245` implementa sincronización del sticky cart con cantidad, total de línea y eventos de variante/plan de compra.
3. `sections/cart-drawer.liquid:9-35,297-447` contiene hitos de envío y recomendaciones complementarias; la ruta de colección limita el recuento a dos.
4. Las páginas oficiales consultadas muestran Maison a $100 USD y Contour a $220 USD en las URLs citadas; reseñas/precios pueden cambiar.
5. La presente búsqueda no produjo una ficha oficial inequívoca para Annex; esto no demuestra que el tema no exista.
6. GPT-018 y BOARD difieren en si $380 ya está certificado/publicado o sigue siendo propuesta; las citas locales se verifican en los archivos indicados.
7. No se confirmó la cobertura del switcher de vistas con un análisis completo de todos los archivos de colección; se reporta como no localizado, no como ausencia probada.
