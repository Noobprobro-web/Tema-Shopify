ID: GPT-CONTOUR-PRODUCT-001
Estado: propuesta de producto y superficie del comerciante; implementación y validación en tienda no ejecutadas.
Decisión requerida: Claude debe convertir el alcance recomendado en directivas; Johandry conserva decisiones comerciales. La recomposición propuesta de presets es provisional, no una nueva identidad aprobada.
Resumen en 5 líneas:
1. Adoptar de Contour la correspondencia entre necesidad comercial, composición, herramientas y documentación; conservar la moda editorial y el lenguaje visual propios de Sartorial.
2. La PDP ya se diferencia por bloques: Imprint incorpora technical_specs y Archive provenance; compartir main-product no significa identidad funcional idéntica.
3. Primero corregir documentación desactualizada y enseñar las capacidades existentes; luego ensayar recorridos diferenciados con las mismas secciones.
4. Completar el editor en español aporta una mejora concreta; otros idiomas y secciones nuevas quedan condicionados a demanda y validación.
5. La evolución se añade como mejora de producto, sin reabrir automáticamente presets certificados ni afirmar causas de rechazos de Shopify.
Archivos tocados: únicamente agent-comms/outbox-gpt/GPT-CONTOUR-PRODUCT-001.md.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación; futuros cambios de defaults, opciones o contratos requieren directiva explícita conforme a RULES.md.
Hallazgos extra fuera de alcance (con parche listo): sin parche, porque este encargo es de planificación. Se identifica inferencia de atributos materiales por handle en snippets/product-technical-specs.liquid:46-69 para que Claude decida una tarea separada.
Verificación (comando, resultado y qué demuestra/qué no): inspección directa mediante rg, nl y Python; extractos literales y comandos al final. Prueba existencia y configuración en disco; no prueba render, calidad de traducciones, conversión ni certificación actual.
Lista de afirmaciones falsables numeradas:
1. Los tres presets usan una base compartida, pero ya presentan diferencias de orden, hero y bloques PDP.
2. Sartorial dispone de herramientas de moda que deben aprovecharse antes de añadir equivalentes.
3. La documentación merchant usa Edition mientras settings_data y listings usan Imprint.
4. La documentación del envío no refleja la precisión del info ya presente en el editor.
5. Contour incluye idiomas de storefront y editor EN/ES/DE/FR/IT; Sartorial incluye storefront EN/ES y schema EN.
6. Contour conecta composiciones y herramientas especializadas con cada preset; esa es la referencia aplicable a Sartorial, sin trasladar el contenido de muebles, arte o cerámica.

## Alcance y autoridad

Referencia exclusiva: Contour, repositorio /tmp/shopify-comparison/atelier. Sartorial: /workspace/Tema-Shopify. No se usa Cucuyo para ninguna recomendación. El testimonio de Johandry sobre revisiones previas de Contour por Shopify orienta el interés del benchmark; no hay cartas de revisión ni resultados oficiales examinados aquí. No se infieren causas de rechazo, aprobación o requisitos normativos desde el código de Contour.

Trabajo efectuado como subagente Codex/GPT. No se simulan respuestas de Claude o Gemini. Según la autoridad vigente de AGENTS.md:7-11, Claude es líder técnico temporal e implementador; Gemini actúa como arquitecto consultor y prepara/contrasta directivas; GPT audita producto y evidencia. Johandry decide posición comercial, alcance y nombres. No se cambia BOARD, ledger, código, decisiones aprobadas ni las filas verdes del ledger.

## 1. Qué tomar de Contour y qué preservar

Contour explica por preset el tipo de tienda, orden de descubrimiento, densidad de catálogo y énfasis de PDP (docs/index.html:82-111). El código sostiene diferencias de herramientas: Annex usa wall-comparison y frame-preview (listings/annex/templates/index.json:118,146); Maison usa process-timeline y shop-the-set (listings/maison/templates/index.json:106,161); Contour incorpora spec-compare (listings/contour/templates/index.json:199). No se puntúa el producto por cantidad de secciones.

La transferencia útil es hacer evidente una tarea del comprador y una receta del comerciante para cada recorrido. En Sartorial ya existen hero split/cinematic, ratios y orden configurables (sections/hero-editorial.liquid:221-248), catálogo con densidad y compra rápida (sections/main-collection.liquid:484-505), notas editoriales intercaladas (sections/main-collection.liquid:511-545), historia/materiales (sections/brand-manifesto.liquid:18-61), lookbook y conjunto comprable (sections/lookbook.liquid:235-290; sections/complete-the-look.liquid:402-421). No hace falta una copia de frame-preview, glaze-library o kiln-log para conseguir una especialización de moda.

Preservar la dirección editorial, el núcleo nativo sin añadir bibliotecas, los tokens y patrones accesibles existentes. Los criterios visuales y funcionales del proyecto siguen siendo la base; Contour sirve para formular mejoras verificables, no para sustituirla.

### Corrección de lectura de la comparativa anterior

Es correcto que las PDP de listings comparten main-product, product-recommendations y recently-viewed. Esa coincidencia no prueba que sean funcionalmente iguales: Imprint añade technical_specs (listings/imprint/templates/product.json:72) y Archive añade provenance (listings/archive/templates/product.json:72). También hay diferencias vigentes de hero: Sartorial split 65/35, Imprint split 50/50 y Archive cinematic (listings/sartorial/templates/index.json:6-8; listings/imprint/templates/index.json:6-8; listings/archive/templates/index.json:6-8).

La recomendación es mejorar la legibilidad de la promesa y el recorrido completo, no declarar ausente una diferenciación ya implementada ni reabrir por defecto Presets Diferenciados, registrado cumplido en docs/requirements-ledger.md:109.

## 2. Plan mínimo recomendado, en orden

### PRD-01 — Conciliar documentación y ayuda con el producto real

Prioridad: primera iteración de producto, tras los bloqueantes técnicos que determine Claude. Dueño: Claude; contraste de contratos: Gemini; auditoría: GPT. Johandry confirma únicamente cualquier cambio comercial nuevo.

Evidencia Sartorial: docs/merchant/docs.html:204 aún presenta Edition; config/settings_data.json:159 y listings/imprint usan Imprint. docs/decisions.md:160-170 y docs/requirements-ledger.md:108-109 conservan la nomenclatura histórica. Esto es una desincronización entre superficies, no autorización para renombrar ningún preset.

Evidencia Contour: docs/index.html:83-111 explica las diferencias de presets con tareas y composiciones específicas. Sartorial tiene infraestructura propia de documentación y soporte; no requiere crear otro portal (sections/main-documentation.liquid:68-92; sections/main-support.liquid:114-128).

Entrega propuesta:

- Claude verifica primero la decisión vigente que llevó a Imprint. Alinear la documentación comercial con esa decisión y abrir una corrección documental trazable para las referencias históricas que sean operativas. Gemini es el único escritor de BOARD; GPT no modifica ledger ni decisiones.
- Cambiar la guía de presets de una descripción solo estética a una receta por recorrido: qué configurar primero, qué contenido necesita, qué bloque PDP aprovechar, qué omitir si no aplica. No afirmar que Imprint debe vender objetos porque una demo anterior los utilice.
- Añadir instrucciones de size guide, datos del modelo, technical_specs, provenance y planes de venta usando las funciones existentes. La lista PDP actual docs/merchant/docs.html:240-247 se centra en medios, swatches, total por cantidad, gift cards y pickup; no es una guía operativa de esas herramientas.
- Enlazar la receta desde info ya pertinente del editor, sin texto técnico innecesario. Documentar namespace/tipo del metafield que realmente consume el código y su precedencia, con valores de ejemplo identificados como demo. product-technical-specs lee custom.material, sartorial.material y custom.technical_specs (snippets/product-technical-specs.liquid:19-25); provenance consume custom.provenance_date/era/circa_year y condition_grade (snippets/product-provenance.liquid:22,37).
- Sustituir afirmaciones ambiguas por límites concretos: docs/merchant/docs.html:254 dice automatic threshold calculation; el info del editor ya aclara que el importe se debe hacer coincidir con tarifas/mercados y no crea una tarifa (locales/en.default.schema.json:814-820). La guía debe explicar esa dependencia y no prometer gratuidad en checkout.

Aceptación: un comerciante puede configurar un producto con talla, uno con ficha material y uno con procedencia sin editar Liquid ni atribuir datos ficticios. Nombres visibles coinciden con la decisión comercial vigente. Enlaces de ayuda apuntan a páginas públicas correctas. Se comprueba EN/ES, lectura móvil, navegación por teclado y encabezados; no se proclama validación actual de enlaces públicos sin ejecutarla.

### PRD-02 — Ensayar tres recorridos de moda con las piezas existentes

Prioridad: después de PRD-01 y con validación técnica disponible. Dueño: Claude; consulta de arquitectura: Gemini; auditoría de hipótesis: GPT; decisión comercial: Johandry.

Evidencia: los órdenes actuales constan en listings/sartorial/templates/index.json:143, listings/imprint/templates/index.json:179 y listings/archive/templates/index.json:137. Archive ya antepone manifesto; Imprint ya incorpora bento-discovery. Contour diferencia la navegación comercial de Annex y Maison con herramientas de su especialidad (fuentes de §1). Compartir secciones es aceptable si la tarea y la presentación son claras.

Propuesta predeterminada provisional: mantener nombres e identidades actuales y aumentar la utilidad por configuración, orden y contenido dentro de moda. No cambiar los defaults del tema base durante el prototipo; usar primero una copia de vista previa y luego una directiva acotada si el resultado justifica sustituirlos.

| Preset | Necesidad que se propone ensayar | Primera receta usando lo existente | Qué no duplicar |
|---|---|---|---|
| Sartorial | Descubrir una colección editorial y comprar un conjunto con confianza de talla | Hero editorial → cápsula/colecciones → lookbook → complete-the-look; size guide y detalles de ajuste cerca de la decisión de talla cuando el producto los tenga | Hotspots, compra de conjunto, zoom y talla ya existen |
| Imprint | Elegir prendas/accesorios contemporáneos por construcción, material y uso | Presentar antes selección de productos y ficha de construcción; usar bento-discovery con producto/editorial y technical_specs en PDP | No recrear una tabla de materiales que ya existe ni convertirlo por defecto en tienda de objetos |
| Archive | Entender época, estado y procedencia antes de comprar una pieza de archivo | Mantener relato inicial y acceso directo a catálogo; destacar procedencia verificada en PDP y notas editoriales de colección | No inventar certificado, unicidad, restauración ni grado de conservación |

Son hipótesis de recorrido, no nuevos posicionamientos aprobados. Alternativa si Johandry prefiere máxima continuidad: conservar todos los órdenes actuales y demostrar mejor las diferencias existentes mediante contenido, bloques pertinentes y documentación. Claude debe comparar ambas opciones en preview; la recomendación provisional es ensayar primero cambios de orden/configuración reversibles, sin nuevas secciones.

Aceptación: para cada preset, una persona distingue la tarea de compra y encuentra su información crítica en móvil y escritorio; se registra el recorrido con evidencia, sin convertir la opinión visual de GPT en garantía de conversión. La galería, compra, filtros y carrito mantienen sus contratos. Títulos, precio, CTA y orden de lectura permanecen visibles sin animación o JS cuando exista fallback. La recomposición no se cierra sin los cinco estados de §4.

### PRD-03 — Completar español en la experiencia del editor

Prioridad: siguiente mejora concreta de superficie; no bloquea resolver CI, compra o rendimiento. Dueño: Claude; revisión lingüística final: humano designado por Johandry; verificación de claves y contratos: Gemini/GPT.

Evidencia Sartorial: locales contiene en.default.json, en.default.schema.json y es.json; no existe es.schema.json. Los controles ya usan t:, por ejemplo sections/main-product.liquid:934-959. Contour aporta storefront y schema en EN, ES, DE, FR e IT; locales/es.schema.json:11-30 contiene traducciones reales de la interfaz, no solo un archivo vacío.

Predeterminado: añadir ES para el editor aprovechando las claves inglesas existentes y revisar terminología de talla, envío, material, estado y planes de venta. No traducir IDs ni cambiar defaults comerciales por accidente. Mantener sentence case y el inglés neutro de la fuente, conforme a RULES; la traducción se valida en el editor real. La presencia de claves no acredita por sí sola corrección lingüística.

DE/FR/IT quedan opcionales y posteriores a una decisión de mercados y capacidad de soporte de Johandry. No adoptar cinco idiomas solo para igualar un inventario de Contour.

Aceptación: mismas claves requeridas, cero t: visibles, etiquetas y info comprensibles, cambios de idioma sin pérdida de configuración, contenido largo sin recortes. Probar en el editor añadir/reordenar/duplicar/retirar y volver a insertar una sección. En storefront verificar idioma de enlaces y controles si se toca alguna clave compartida; no confundir idioma del editor con contenido traducido del catálogo o Markets.

## 3. Ampliaciones opcionales: solo tras demostrar una necesidad

| Opción | Referencia Contour | Alternativa actual de Sartorial | Condición para promoverla |
|---|---|---|---|
| Relato por etapas de confección/cuidado | process-timeline permite pasos con imagen opcional: sections/process-timeline.liquid:207,229-232; Maison lo usa en listings/maison/templates/index.json:106 | brand-manifesto aporta historia, material, detalle y CTA: sections/brand-manifesto.liquid:18-65; las pestañas PDP permiten cuidados | Un comerciante no consigue comunicar una secuencia necesaria con las piezas existentes y hay contenido real para ella. Prototipo de flujo editorial propio, sin copiar cerámica, estética, texto o código de Contour |
| Ayuda a comparar corte o tejido entre productos | spec-compare expone filas y valores por producto: sections/spec-compare.liquid:271-293 | Guía de tallas, technical_specs y filtros existentes resuelven parte de la elección | Evidencia de que el comprador necesita comparar productos, no tallas del mismo producto. Definir origen y ausencia de datos; evitar duplicar la PDP. Evaluar primero una tabla editorial simple, sin motor nuevo |
| Más variantes de composición en editor | Contour distribuye tareas de nicho por secciones y presets: docs/index.html:82-111 | Hero ya ofrece split/cinematic y ratios; collection tiene densidad y notas | Identificar una composición concreta imposible con los controles existentes; diseño de Gemini y directiva de Claude. Añadir opciones es Nivel 2, no cambio incidental |

No incluir por defecto frame-preview, wall-comparison, glaze-library, kiln-log, bibliotecas de animación o más paneles de settings. No hay necesidad de moda demostrada aquí que los justifique. Una nueva sección aporta costes de estados, traducción, documentación, rendimiento y mantenimiento; se aprueba por la tarea que resuelve.

## 4. Aceptación y dependencias comunes

Este plan no cierra ni modifica filas del ledger. Claude debe identificar por nombre las filas existentes afectadas y proponer a Gemini únicamente las nuevas exigencias que no estén cubiertas. No reimplementar ni refactorizar funciones certificadas solo para alinearlas con Contour. La falta de una medición actual significa no verificado para esta revisión; no borra evidencia histórica válida.

Toda sección/bloque modificado debe tener evidencia separada para:

| Estado | Fixture mínimo y expectativa |
|---|---|
| Vacío | Colección sin productos, conjunto sin selecciones, origen/material/talla sin datos: no CTA inválido ni afirmación inventada; salida vacía o alternativa explicada según contrato |
| Uno solo | Un producto, una variante o un hotspot: la disposición y compra siguen siendo claras; no navegación redundante o inaccesible |
| Muchos | Galería con más de 10 medios, producto con 40 variantes, colección paginada de 200 productos: compra, filtros y orden no se rompen; probar el límite de bloques realmente admitido por cada sección |
| Muy largo | Título de 120 caracteres, etiquetas traducidas largas, vendor extenso y precios largos: sin solape ni scroll horizontal a 360/375 px; nombre y estado accesibles siguen completos |
| Faltante | Imagen, descripción, foto secundaria o metadato ausentes: no atributo material ni procedencia inferidos como hechos, no control con destino roto; imágenes alternativas accesibles cuando corresponda |

Accesibilidad por cualquier recomposición o nueva interfaz: teclado, foco visible y restituido en overlays, Escape, orden de lectura coherente, nombres/estados y anuncios de precio/stock, contraste de textos y controles, targets táctiles, reduced motion y contenido visible sin depender de reveal. No duplicar IDs al repetir secciones. Comprobar reordenado/recarga de secciones en Theme Editor y ausencia de eventos duplicados. Medir CLS y carga si se cambia la composición; un inventario estático no certifica rendimiento.

Pruebas requeridas antes de cerrar código: gates:static del repositorio, verificación adversarial por GPT distinto del implementador y recorridos en tienda real con catálogo límite, móvil y editor. El cierre de funciones empíricas exige Gate 5. La implementación espera las directivas del líder; el plan no necesita cambiar roles ni tablero.

## 5. Evidencia reproducida en terminal

Comandos ejecutados, de lectura, sobre los archivos citados:

```sh
rg -n '"order"|"layout_mode"|"split_ratio"|"layout_split"' listings/*/templates/index.json
rg -n 'technical_specs|provenance' listings/*/templates/product.json
nl -ba docs/merchant/docs.html | sed -n '191,215p'
nl -ba docs/merchant/docs.html | sed -n '236,259p'
nl -ba locales/en.default.schema.json | sed -n '808,824p'
nl -ba snippets/product-technical-specs.liquid | sed -n '43,86p'
```

Salida literal relevante (revisión del 18 de octubre de 2026; rutas relativas a Sartorial salvo prefijo Contour):

```text
listings/sartorial/templates/index.json:6:        "layout_mode": "split",
listings/sartorial/templates/index.json:7:        "split_ratio": "65_35",
listings/sartorial/templates/index.json:143:  "order": ["hero", "marquee", "collections", "lookbook", "featured_product", "capsule", "manifesto", "newsletter"]
listings/imprint/templates/index.json:6:        "layout_mode": "split",
listings/imprint/templates/index.json:7:        "split_ratio": "50_50",
listings/imprint/templates/index.json:179:  "order": ["hero", "marquee", "discovery", "collections", "featured_product", "capsule", "manifesto", "newsletter"]
listings/archive/templates/index.json:6:        "layout_mode": "cinematic",
listings/archive/templates/index.json:137:  "order": ["hero", "manifesto", "marquee", "collections", "lookbook", "featured_product", "newsletter"]
listings/imprint/templates/product.json:72:          "type": "technical_specs",
listings/archive/templates/product.json:72:          "type": "provenance",
docs/merchant/docs.html:204: <h3 class="card-title">Edition</h3>
config/settings_data.json:159: "Imprint": {
docs/merchant/docs.html:254: <li>Supports Free Shipping Progress Bar with automatic threshold calculation.</li>
locales/en.default.schema.json:816:          "info": "Match your actual shipping rates and eligible markets in Settings > Shipping and delivery. This amount does not create a shipping rate, make express shipping free, or guarantee eligibility at checkout."
snippets/product-technical-specs.liquid:53:          assign material_val = 'Solid milled brass'
snippets/product-technical-specs.liquid:69:          assign hardware_val = 'Precision machined'
```

Para resolver JSON con comentarios de Contour, se ejecutó Python con `json.loads(re.sub(r'/\*.*?\*/','',f.read_text(),flags=re.S))`, iterando solo listings/*/templates/index.json, y se listaron solo nombres de archivos de locales. La primera lectura sin retirar el comentario generó JSONDecodeError y se corrigió el lector, sin modificar las fuentes. Salida literal útil:

```text
Sartorial locales: en.default.json, en.default.schema.json, es.json
listings/archive/templates/index.json: hero-editorial > brand-manifesto > marquee > curated-showcase > lookbook > featured-product > newsletter
listings/imprint/templates/index.json: hero-editorial > marquee > bento-discovery > curated-showcase > featured-product > complete-the-look > brand-manifesto > newsletter
listings/sartorial/templates/index.json: hero-editorial > marquee > curated-showcase > lookbook > featured-product > complete-the-look > brand-manifesto > newsletter
Contour locales: de.json, de.schema.json, en.default.json, en.default.schema.json, es.json, es.schema.json, fr.json, fr.schema.json, it.json, it.schema.json
listings/annex/templates/index.json: hero > horizontal-scroll > overlap-index > wall-comparison > frame-preview > faq-ledger > featured-product > maker-spotlight > editorial-statement > newsletter
listings/contour/templates/index.json: hero > collection-showcase > featured-collection > spec-compare > split-media > image-with-text > testimonials > faq-ledger > newsletter
listings/maison/templates/index.json: hero > marquee > tabs > process-timeline > shop-the-set > editorial-feature > glaze-library > full-bleed-image > kiln-log > newsletter
```

Se verificaron citas de Contour abriendo docs/index.html:76-157 y mediante rg sobre sus listings y schemas. Extractos literales:

```text
Contour/docs/index.html:83: <p>Contour includes three presets, each built for a different kind of shop:
Contour/docs/index.html:98: Homepage leads with the editions, then a statement, the work of the month,
Contour/docs/index.html:108: Homepage leads with the maker: a process marquee, the potter, then the
Contour/docs/index.html:144: <li><strong>Process timeline</strong> — Numbered steps, connected left to right
Contour/sections/spec-compare.liquid:271: "type": "textarea", "id": "row_labels",
Contour/sections/spec-compare.liquid:291: "type": "textarea", "id": "values",
Contour/sections/process-timeline.liquid:207: "type": "text", "id": "heading", "label": "t:sections.process-timeline.settings.heading.label", "default": "From clay to table" },
```

Los dos últimos extractos abrevían indentación y el último omite la llave inicial al presentar el contenido; la fuente completa permanece en disco y la referencia de línea es comprobable. No se ejecutó una nueva suite ni se accedió a Shopify durante este subanálisis de planificación.

## 6. Personalización: controles reales y tareas del comerciante

Ampliación del 18 de octubre de 2026 por información de Johandry: recuerda un rechazo de Contour por «falta de personalización o algo así». Sin el reporte original, el motivo y su alcance siguen **sin confirmar**. Puede referirse a libertad de configuración en el editor, a diferenciación comercial/originalidad, o a otra observación. No se elige una interpretación como hecho ni se convierte el conjunto de controles de Contour en una norma de Shopify.

La libertad del comerciante consiste en poder realizar una tarea de marca y catálogo sin editar código. La diferenciación comercial consiste en que el resultado conserve una propuesta propia y sea reconocible dentro de su mercado. Añadir opciones no demuestra ninguna de las dos por sí solo: un panel extenso puede ocultar las tareas y múltiples configuraciones pueden producir la misma experiencia. La evaluación debe observar ambas por separado, manteniendo la moda editorial de Sartorial.

### Matriz previa al ensayo

Los estados siguientes son diagnósticos para tareas, **no estados del ledger**: soportado = existe control y consumo identificable en código; parcial = solo una parte de la tarea se configura; brecha = la tarea acotada no dispone del control identificado en las superficies revisadas. Ninguno significa validación actual del editor; todos requieren el ensayo indicado. Las referencias con prefijo Contour corresponden a /tmp/shopify-comparison/atelier.

| Tarea real del comerciante | Sartorial: evidencia y estado | Contour: evidencia y alcance | Ensayo para decidir si hay una necesidad insatisfecha |
|---|---|---|---|
| Cambiar marca, tipografía y paleta sin perder legibilidad | **Soportado en código**: fuentes heading/body, escalas heading 90–130 y body 90–110; color schemes globales y color_scheme local. config/settings_schema.json:41-110,121-145; layout/theme.liquid:70-89; sections/main-product.liquid:874 | Fuentes/escalas globales, escalas H1/H2/H3, tracking y uppercase independientes; esquemas con body/muted/accent. Contour/config/settings_schema.json:19-177. Son más grados de control tipográfico, no prueba de mayor calidad | Reproducir dos marcas de moda con fuentes/paletas distintas usando controles existentes. Ver títulos de 120 caracteres, precios largos y contraste. No recomendar más sliders tipográficos hasta localizar una composición que no pueda resolverse |
| Cambiar composición y proporciones del hero | **Soportado en código**: split/cinematic, 60/40, 65/35, 50/50 y orden imagen/texto; posición XY, alineación y ancho de contenido. sections/hero-editorial.liquid:221-248,341-376; las proporciones se consumen también para sizes:10-17 | fullbleed/split, posición/alineación, tamaño y nivel de heading, estilo de CTA; Contour/sections/hero.liquid:321-402. No se encontró un selector de ratio equivalente en este schema | Guardar dos composiciones originales del mismo catálogo y cambiar la sección de lugar. No copiar los límites de Contour: Sartorial ya tiene controles útiles que su hero no expone de la misma manera |
| Adaptar portada al móvil sin cambiar la imagen de escritorio | **Soportado en código**: image_desktop/image_mobile, height_desktop/height_mobile, habilitación del vídeo en móvil; sections/hero-editorial.liquid:252-306 | image/image_mobile y Contour/sections/hero.liquid:330-331; el resultado responsive requiere comprobar su CSS/render | Configurar foto vertical y horizontal, ajustar el foco, comprobar CTA y textos a 360/375 px y reduced motion. No exigir composición totalmente independiente por dispositivo sin necesidad demostrada |
| Elegir presentación PDP y jerarquía de información | **Soportado en código** para stack/grid/thumbnails/split_screen, zoom, sticky cart y bloques ordenables con límites de singleton; sections/main-product.liquid:880-978. **Parcial** para ajustar libremente el ancho exacto de medios: no existe media_width en settings revisados | Contour permite media_width 40–65 y media_fit adapt/crop, además de bloques: Contour/sections/main-product.liquid:999-1020; usa --product-media-width en :15 | Ensayar las cuatro presentaciones existentes con prendas y accesorios; solo proponer ancho libre si una tarea falla con todas. No modificar a ciegas el carrusel móvil, que ya deriva su marco de la primera imagen con límites: Sartorial/sections/main-product.liquid:31-39 |
| Dar aire a una sección concreta sin modificar las demás | **Parcial**: page_width 1000–1600, gutter 16–40 y section_spacing global 32–120; config/settings_schema.json:158-180; layout/theme.liquid:75-77. **Brecha acotada** en main-product, main-collection y brand-manifesto para padding superior/inferior local; sus schemas no lo exponen. featured-product sí lo permite: sections/featured-product.liquid:595-610 | Espaciado global 40–200, y padding_top/bottom local en hero, colección y PDP: Contour/config/settings_schema.json:238-240; Contour/sections/main-collection.liquid:196-197 y :8-9; Contour/sections/main-product.liquid:1044-1059 y :436 | Conservar el espacio de una PDP y ajustar solo el hueco antes/después de una nota editorial o colección. Registrar si el global obliga a afectar otras secciones. No declarar que todo Sartorial carece de espaciado local |
| Elegir densidad móvil de colección independientemente del escritorio | **Parcial**: default_grid_columns 2/4, sections/main-collection.liquid:479-484; en móvil se traduce a 1/2 columnas por CSS, assets/base.css:5033-5038; las vistas del comprador 2/4/list se conservan en assets/theme.js:3690-3722. **Brecha acotada**: sin selector merchant de columnas móviles independiente en main-collection | columns_desktop 2/3/4 y columns_mobile 1/2 independientes; Contour/sections/main-collection.liquid:154-169, y consumo :10-11; Contour/assets/base.css:819,825 | Ensayar escritorio 4 + móvil 1 para resaltar siluetas, y escritorio 2 + móvil 2 para accesorios. Comprobar si la vista lista del comprador resuelve la necesidad o no; guardar la preferencia del visitante no sustituye la configuración inicial del comerciante |
| Configurar cards y evitar compras inseguras | **Soportado en código**: show_vendor, imagen secundaria y quick add locales en colección, sections/main-collection.liquid:490-505; la compra segura y los casos que llevan a PDP se documentan en snippets/product-card.liquid:10-20. La proporción base es 4/5 fija en assets/base.css:1853-1867 | Toggles globales de vendor, segunda imagen, quick add/buy y rating; Contour/config/settings_schema.json:286-318. El estilo de quick add hover/always es local en colección, Contour/sections/main-collection.liquid:177-182. Proporción base 3/4 fija: Contour/assets/base.css:115 y assets/base-components.css:80-84 | Ver coherencia entre colección, búsqueda y módulos de portada cuando se cambia un ajuste. No añadir una opción de ratio para «igualar Contour»: ninguno de estos controles inspeccionados la ofrece. Tampoco sustituir la selección segura de talla por un botón que omita opciones |
| Reordenar, repetir contenido y conectar datos de cada producto | **Soportado en código** para orden y bloques en JSON, talla, specs/provenance, @app y custom_liquid: listings/*/templates/index.json, sections/main-product.liquid:702-705,1106-1153. **Parcial para datos arbitrarios**: specs/provenance usan namespaces y claves identificados en snippets/product-technical-specs.liquid:19-25 y product-provenance.liquid:22,37; la conexión de dynamic sources compatibles debe probarse en editor | Bloques de contenido/app/Liquid; dimensiones permite namespace y claves configurables: Contour/sections/main-product.liquid:909-954,982-993, y resuelve product.metafields[block.settings.namespace] en :341. process-timeline limita a seis bloques: Contour/sections/process-timeline.liquid:194 | Dos productos con materiales/procedencias distintos usando la misma plantilla, sin que un fallback muestre datos del otro. Añadir, duplicar, ordenar, guardar y recargar. No imponer un nuevo sistema genérico de metafields si conectar/documentar las claves actuales resuelve la tarea |

### Dos candidatos concretos y una mejora de exposición

**Candidato A — Espaciado local, únicamente donde el ensayo lo justifique.** Hay un límite comprobable entre el espaciado global y la ausencia de padding local en las tres superficies citadas, frente a las opciones consumidas por Contour. Primero probar una nota de confección de moda con brand-manifesto, sin rediseñarla. Si se demuestra que necesita un ajuste propio, Claude prepara y coordina la directiva de Nivel 2; Gemini la autoriza por escrito antes de implementar, conforme a RULES.md. Johandry conserva la decisión de negocio y alcance. La directiva debe definir un control acotado y valor heredado por defecto, respetando tokens y CSS existente. Ampliar a PDP o colección solo por evidencia, no en bloque. Aceptar si el cambio local no mueve secciones vecinas, sigue funcionando con vacío/largo/faltante y no crea un espacio intransitable al usar teclado. La necesidad comercial sigue siendo hipótesis hasta el ensayo; la ausencia de ese control sí está comprobada.

**Candidato B — Densidad móvil independiente en PLP.** La relación actual 2→1 y 4→2 es explícita; no permite las dos combinaciones cruzadas del cuadro mediante settings del comerciante. Probarlas primero como prototipo aislado. Si mejoran una tarea de moda, añadir una opción móvil con default que conserve exactamente la correspondencia actual. Gemini debe diseñar cómo se combina con la vista 2/4/list persistida y el control visible del comprador, antes de que Claude implemente. No borrar preferencias, cambiar claves de almacenamiento ni convertir una preferencia existente en seguimiento adicional. Aceptación: guardar/recargar en editor, navegación de filtros y back/forward, JS deshabilitado donde proceda, vista lista y almacenamiento bloqueado; cero cambios inesperados de escritorio y cinco estados a 360/375 px. No proponer tres columnas de escritorio solo porque Contour las tenga.

**Mejora inmediata de exposición — Recetas de configuración y compatibilidad de datos.** Ya se puede enseñar tipografía/color/hero, layouts PDP y datos sin nuevos controles. Añadir a la prueba guiada una ficha de «global o solo esta sección», límites de bloques y precedencia de datos. Aclarar qué configuraciones se heredan y qué datos son por producto. Empezar con las claves existentes; si una tienda real usa otros metafields, evaluar dynamic sources compatibles antes de exponer namespaces arbitrarios o crear una migración. Esta mejora amplía PRD-01/PRD-03 y puede integrarse al CONTOUR-04 actual sin asumir nuevas funciones.

No se recomiendan en este pase más opciones de tracking/uppercase, cursor, textura, carga, ratings o formularios de email por el mero hecho de estar presentes en Contour. La personalización debe preservar los contratos de compra, privacidad y almacenamiento existentes, la ausencia de claims inventados y los requisitos de accesibilidad del proyecto.

### Incorporación sugerida a CONTOUR-04, sin editar el plan principal

1. Anteponer una **prueba guiada de personalización por tareas**, usando la matriz anterior y los tres presets; registrar tarea, controles usados, resultado soportado/parcial/brecha, captura y persistencia tras guardar/recargar. Obtener evidencia en editor real; los estados aquí son provisionales de código.
2. Añadir **A/B de espaciado local y densidad móvil** como candidatos de alcance cerrado. Solo promover cada uno si el límite bloquea la tarea de moda; conservar defaults y preferencias, y requerir autorización de Nivel 2. No incluirlos automáticamente como correcciones de un supuesto rechazo.
3. Ampliar las recetas ES/EN con **alcance global/local, límites y datos dinámicos** y comparar dos resultados editoriales propios, para que la libertad de configuración y la diferenciación de marca tengan evidencias distintas. No reabrir filas verdes del ledger por inferencia.

### Evidencia adicional de lectura

Se ejecutaron búsquedas rg de ids/rangos/opciones en config/settings_schema.json y schemas de hero, main-product y main-collection de ambos repositorios; nl abrió sus rangos citados, las variables del layout y los consumidores CSS/JS. No se ejecutó Shopify ni se midió la facilidad de uso del editor. Para las dos brechas, estos comandos reproducen las observaciones acotadas:

```sh
# En /workspace/Tema-Shopify:
rg -n 'padding_top|padding_bottom|"id"' sections/main-product.liquid sections/main-collection.liquid sections/brand-manifesto.liquid
nl -ba assets/base.css | sed -n '5028,5041p'
nl -ba assets/theme.js | sed -n '3690,3722p'
# En /tmp/shopify-comparison/atelier:
nl -ba sections/main-collection.liquid | sed -n '154,197p'
nl -ba sections/main-collection.liquid | sed -n '6,12p'
```

Extractos literales de la salida (indentación normalizada aquí):

```text
Sartorial/sections/main-collection.liquid:479: "id": "default_grid_columns",
Sartorial/sections/main-collection.liquid:483: { "value": "2", "label": "t:sections.main_collection.settings.default_grid_columns.options__1.label" },
Sartorial/sections/main-collection.liquid:484: { "value": "4", "label": "t:sections.main_collection.settings.default_grid_columns.options__2.label" }
Sartorial/assets/base.css:5033: .product-grid[data-grid-columns='2'] {
Sartorial/assets/base.css:5034: grid-template-columns: minmax(0, 1fr);
Sartorial/assets/base.css:5037: .product-grid[data-grid-columns='4'] {
Sartorial/assets/base.css:5038: grid-template-columns: repeat(2, minmax(0, 1fr));
Sartorial/assets/theme.js:3701: : this.dataset.defaultGridColumns;
Contour/sections/main-collection.liquid:165: "id": "columns_mobile",
Contour/sections/main-collection.liquid:168: { "value": "1", "label": "t:sections.main-collection.settings.columns_mobile.options__1.label" },
Contour/sections/main-collection.liquid:169: { "value": "2", "label": "t:sections.main-collection.settings.columns_mobile.options__2.label" }
Contour/sections/main-collection.liquid:11: --grid-columns-mobile: {{ section.settings.columns_mobile }};
Contour/sections/main-collection.liquid:196: { "type": "range", "id": "padding_top", "min": 0, "max": 160, "step": 4, "unit": "px", "label": "t:sections.main-collection.settings.padding_top.label", "default": 48 },
Contour/sections/main-collection.liquid:197: { "type": "range", "id": "padding_bottom", "min": 0, "max": 160, "step": 4, "unit": "px", "label": "t:sections.main-collection.settings.padding_bottom.label", "default": 96 }
```
