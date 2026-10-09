ID: GPT-AUDIT-020-LUXURY-DATA-AND-UX-AUDIT
Estado: Dictamen documental senior / Recomendaciones curatoriales y comerciales
Decisión requerida: Decisiones abiertas para Johandry y Claude sobre datos verificables, escasez, subtotal, recomendaciones y aceptación en tienda real.
Resumen en 5 líneas:
1. El tier propuesto de 380 USD exige procedencia, construcción y curaduría verificables; las prestaciones adicionales no certifican excelencia comercial.
2. Archive debe separar conservación, restauración y aptitud de uso; el badge de unicidad requiere evidencia documental y una política de inventario conservadora.
3. Edition y Atelier deben ocultar datos ausentes y evitar materiales, fabricantes, fechas y referencias de desfile predeterminados que aparenten hechos.
4. PLP, subtotal y recomendaciones necesitan criterios explícitos para móvil, estados límite, variantes, fiscalidad, deduplicación y errores de red.
5. El análisis documental no cierra compuertas de tienda real ni certifica aceptación de Shopify; la implementación de Fase 1 conserva bloqueantes de datos y selectores.
Archivos tocados: solo este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna; no se modificó código fuente.
Hallazgos extra fuera de alcance (con parche listo): no se produjo ni aplicó parche; se registran recomendaciones y correcciones propuestas para Claude.
Verificación (comando, resultado y qué demuestra/qué no): revisión documental delegada de directiva, código, schema, locales y fuentes oficiales; los comandos observados y sus límites se documentan al final. No se reejecutaron compuertas estáticas ni se probaron tiendas en esta entrega.
Lista de afirmaciones falsables numeradas:
1. La directiva de Fase 1 propone valores comerciales predeterminados que pueden publicarse sin evidencia del producto, incluidos unicidad, conservación, fecha y materiales.
2. La propuesta de selector CSS de lista debe reconciliarse con el selector real product-grid antes de implementar.
3. El drawer actual deduplica frente a productos del carrito, pero eso no garantiza deduplicación entre bloques de recomendaciones.
4. La selección automática de la primera variante y cantidad 1 no sustituye una selección explícita cuando el producto tiene opciones relevantes.
5. El inventario visible en el tema no acredita por sí solo autenticidad, producción única ni todas las existencias y ubicaciones del comerciante.
6. Esta entrega formula condiciones de aceptación; no certifica comportamiento móvil, autenticidad, derechos de imágenes, cumplimiento universal ni aprobación de Shopify.

# Dictamen y alcance — 7 de octubre de 2026

**Dictamen: favorable condicionado al modelado de datos y a la verificación funcional pendiente.** Sartorial puede construir una propuesta premium creíble alrededor de tres necesidades distintas: Atelier explica cómo está hecha una prenda; Edition permite comparar atributos técnicos; Archive informa sobre una pieza concreta y su historia documentada. El precio de 380 USD es una decisión comercial del proyecto, no una certificación de Shopify ni una excepción a sus requisitos.

La revisión se limita a recomendaciones documentales, investigación de fuentes y lectura delegada de los archivos relevantes. Las tres demos activas y las compuertas estáticas al 100% son contexto comunicado por el usuario; esta entrega no vuelve a certificar esos resultados ni presume que una función propuesta ya está desplegada. No cierra filas del ledger, no modifica BOARD.md y no autoriza publicación o cambios en Admin.

## Decisiones críticas antes de implementación

- **P1 — Claims predeterminados:** retirar los defaults `is_unique=true`, `Excellent archival`, `Circa 1998` y afirmaciones sobre Italia, materiales o Raccagni cuando no procedan de evidencia real. Un ejemplo de demo debe estar identificado como ejemplo y no convertirse en una afirmación automática para cada producto.
- **P1 — Unicidad:** una unidad disponible no significa una pieza fabricada una sola vez. El tema debe distinguir una pieza de archivo identificada de una afirmación de exclusividad de producción. Con datos incompletos o contradictorios se omite el badge fuerte.
- **P1 — Integración de lista:** la directiva menciona `collection-products__grid`; la revisión del código encuentra `product-grid`. Claude debe alinear la propuesta con el DOM real y comprobar filtros, paginación y persistencia de vista antes de aceptar la función.
- **P1 — Total estimado:** la cifra de PDP debe sincronizar cantidad, variante y plan de compra sin anticipar descuentos que Shopify aún no haya calculado. El copy fiscal debe respetar si los impuestos ya están incluidos.
- **P2 — Recomendaciones:** conservar la deduplicación frente al carrito y ampliarla entre bloques; ofrecer elección de variante cuando exista una decisión de talla, color o acabado.

Los siguientes tracks especifican contratos de datos, criterios de UX y condiciones reproducibles de aceptación. Se distinguen requisitos oficiales, reglas internas del proyecto y recomendaciones comerciales para evitar atribuir a Shopify obligaciones inventadas.

# Track 1 — Datos y curaduría por preset

## Contrato transversal y hallazgos de la directiva

La directiva `agent-comms/inbox-claude/CLAUDE-TASK-V1.1.0-PHASE1.md:110` propone “480 GSM heavy loopback organic cotton”, “Raccagni matte black zippers” y “Crafted in Northern Italy”; `127` propone `is_unique` con default verdadero; `128` condición “Excellent archival”; `132` “Circa 1998” y badge activo. **T1-01/P1:** estos son hechos comerciales y no valores decorativos. Un producto que herede la plantilla puede mostrar claims no comprobados. Prescripción: unicidad apagada, condición `not_assessed`, fechas/materiales/fabricantes/origen vacíos; omitir información ausente. Las demos solo muestran valores propios de cada producto respaldado. Una imagen generada o un producto sintético no prueba procedencia histórica, composición o desfile.

**T1-02/P2:** la ruta `listings/atelier/templates/product.json` no existe en el snapshot leído; la directiva usa `listings/sartorial/templates/product.json` para Atelier (`138`). Confirmar esa asociación antes de cambiar rutas. La búsqueda de `provenance|technical_specs|split_screen|is_unique|metafields` en `main-product.liquid` y templates de Archive/Edition/Sartorial no produjo coincidencias; el informe `CLAUDE-REPORT-V1.1.0-RECON-001.md:32,49,66,76` coincide en la ausencia y reconciliación de ruta. Eso describe esos archivos y momento, no todos los remotos.

Contrato propuesto: namespace `sartorial`, metafields propiedad del comerciante con owner PRODUCT; PRODUCTVARIANT cuando la medida, composición o componente cambia por variante. Crear definiciones con tipos/validaciones antes de valores; completar expedientes; leer `.value` en Liquid o conectar una fuente dinámica compatible. No exigir app ni exponer credenciales Admin. Son propuestas de contrato sujetas a Johandry y Claude, no claves ya implementadas ni un estándar de Shopify.

Reglas comunes:

1. `null` significa desconocido; no cero, “Mint”, “Italy” ni “handmade”.
2. Separar declaración del proveedor, inspección del comerciante, informe externo y falta de evidencia; no etiquetar todo “Verified”.
3. Cada claim debe enlazar SKU/registro → evidencia → responsable → fecha de revisión. Los cambios de lote, proveedor, talla o restauración invalidan la revisión pertinente.
4. Datos privados de adquisición, consignadores, facturas, licencias y contratos permanecen en expediente privado. Una URL de Shopify Files no debe suponerse privada.
5. Un dato de variante solo se muestra para su selección correspondiente; el fallback de producto requiere confirmar aplicabilidad a todas las variantes.
6. No inferir fabricación, masa, proceso, metal, autenticidad o fecha de fotografías. Los textos del producto traducidos por el comerciante son distintos de las locales del schema/storefront.

## Archive: conservación, intervención y uso

Propuesta de cinco grados, publicados como escala propia del comerciante. No es un estándar museístico universal. El estado `not_assessed` expresa ausencia de evaluación y no es un sexto grado; no genera badge favorable.

| Código y label público | Definición operativa | Evidencia mínima y limitación |
|---|---|---|
| `grade_1` — Grade I · Minimal visible wear | Inspección actual sin manchas, pérdidas, roturas, deformaciones ni fallos relevantes. | Fotos generales y zonas de esfuerzo, cierres, forro, costuras/etiqueta. No permite afirmar “unworn” o “Mint” sin historia adicional. |
| `grade_2` — Grade II · Light wear | Señales superficiales localizadas sin pérdida estructural; uniones y cierres funcionales. | Ubicación/alcance de roce, decoloración/pátina y fotografías de cada señal. |
| `grade_3` — Grade III · Visible wear | Varias señales visibles, manchas persistentes, pequeños daños o reparaciones estables. | Defecto, tamaño, ubicación e impacto; aptitud de uso evaluada por separado. |
| `grade_4` — Grade IV · Significant wear | Pérdidas, deformación o fragilidad significativa; función/uso limitado. | Restricciones concretas junto a condición y antes de compra; no prometer uso normal. |
| `grade_5` — Grade V · Fragile / study piece | Integridad insuficiente para uso ordinario; estudio/display cuando esté documentado. | Fragilidad y manejo completos; no legitima omitir limitaciones de venta. |

Un defecto estructural relevante domina sobre el buen aspecto general; no promediar daños. Antigüedad o “museum state” no prueban grado ni procedencia. Conservar fotografías y revisión actual.

Restauración es otro eje: `unknown`, `none_documented`, `documented_repair`, `documented_restoration`, `altered`. `none_documented` no significa certeza de que nunca hubo intervención. Registrar quién/cuándo/zona, materiales sustituidos, reversibilidad solo si está documentada y fotos. Una pieza restaurada puede ser grado I o III; la disclosure no desaparece porque su aspecto mejore.

Aptitud de uso: `not_assessed`, `wearable_with_care`, `limited_use`, `display_only`. No inferirla del grado. El Canadian Conservation Institute advierte sobre vulnerabilidad de textiles históricos y daños de vestirlos; sustenta cautela, no certifica esta escala.

### Archive: contrato de metadatos

| Key bajo `sartorial` | Tipo Shopify propuesto | Validación, representación y vacío |
|---|---|---|
| `circa_year` | `number_integer` | Año central estimado; no fecha de adquisición ni cadena “1990s”. Sin respaldo, omitir. |
| `circa_start_year`, `circa_end_year` | `number_integer` | Intervalo inclusivo inicio ≤ fin, históricamente plausible y no futuro. |
| `date_precision` | `single_line_text_field` | `exact_year`, `approximate_year`, `decade`, `range`, `unknown`; formato determinado por precisión y años compatibles. |
| `origin_house` | `single_line_text_field` | Casa/fabricante/taller atribuido; distinguir diseñador, fabricante y vendedor. |
| `attribution_status` | `single_line_text_field` | `documented`, `attributed`, `unconfirmed`; atribución incierta se presenta “Attributed to …”, no “By …”. |
| `archive_record_id` | `single_line_text_field` | ID estable y único del expediente dentro del archivo; no certificado de autenticidad. |
| `sourcing_notes` | `rich_text_field` | Cadena de adquisición pública redactada; separar hechos del relato del consignador. |
| `provenance_status` | `single_line_text_field` | `documented`, `partially_documented`, `unconfirmed`; no claim de certificación automático. |
| `condition_grade` | `single_line_text_field` | `not_assessed`, `grade_1`…`grade_5`; sin evaluación, omitir badge. |
| `condition_notes` | `rich_text_field` | Defectos actuales; obligatorias operacionalmente en grados II–V. |
| `condition_photos` | `list.file_reference` | Fotos públicas aprobadas de inspección, con alt; no documentos privados. |
| `condition_assessed_on` | `date` | Fecha real; sin ella no afirmar “recently inspected”. |
| `restoration_status` | `single_line_text_field` | Enum de intervención anterior. |
| `restoration_notes` | `rich_text_field` | Sustituciones/modificaciones; exigidas operacionalmente si se declara intervención. |
| `wearability` | `single_line_text_field` | Enum anterior; disclosure pública de uso limitado/display. |
| `uniqueness_status` | `single_line_text_field` | `not_assessed`, `single_resale_item`, `documented_one_of_one`. |
| `unique_piece_id` | `single_line_text_field` | Identidad de unidad física distinta de product/variant ID; sin ella no emitir claim fuerte. |

Ejemplos de representación, sin afirmar hechos de las demos: año inequívoco → “1995”; década → “1990s”, con intervalo 1990–1999 y precisión decade, sin inventar 1995; estimación fundada → “Circa 1995” con nota de base; casa incierta → “Attributed to [house]”. “Archive record AR-0042” identifica expediente; “Certificate AR-0042” exige certificado real con emisor/alcance.

## Archive: protocolo de unicidad conservador

**“Single archive item”** significa una unidad concreta de reventa del comerciante; ese diseño pudo fabricarse miles de veces. **“1-of-1 archival piece”** exige singularidad documentada del ejemplar en el sentido anunciado: prototipo, pieza personalizada o intervención irrepetible, por ejemplo. Tener una unidad vendible no demuestra una sola unidad producida. Un registro interno no autentica una casa.

Compuerta mercantil antes de publicar, responsabilidad del propietario de producto:

- Identificar unidad física, expediente, atribución y qué singularidad se afirma.
- Reconciliar todas las ubicaciones, duplicados del expediente, canales y sistemas gestionados. Contar unidades físicas distintas, sin contar dos veces una misma unidad expuesta en dos canales.
- Distinguir `on_hand` (total físico por location) de `available`, comprometido, reservado, entrante y no disponible. **No sumar available/reserved/committed a on_hand:** son categorías/subconjuntos, no unidades adicionales. Una segunda unidad física no disponible invalida “única unidad”.
- Una location, transferencia o sistema externo desconocido bloquea la publicación del badge. Cambios de stock/variante/expediente invalidan la revisión correspondiente.

Guardas de render recomendadas para lanzamiento:

1. Opt-in apagado por defecto, estado de unicidad y expediente presentes.
2. Exactamente una variante total, con talla física como dato medido. Varias tallas → ocultar badge y reconciliar, aunque solo una parezca tener stock. Los arreglos de esa unidad pueden manejarse como propiedades si el negocio lo permite.
3. Inventario rastreado, `inventory_policy=deny`, variante disponible y cantidad visible exactamente uno.
4. Sin pre-order, fabricación adicional, entradas anunciadas ni oversell.
5. Revisión de unidades/locations vigente según proceso real del comerciante.
6. Dato desconocido o contradictorio → ocultar claim; editor/docs explican elegibilidad. No mostrar al comprador una acusación contra el comerciante.
7. Al agotarse, disponibilidad “Sold out”; puede conservar historia documentada pero no llamada de escasez comprable. Cantidad/carrito siguen los límites reales.

**Límite crítico:** `variant.inventory_quantity` devuelve el número vendido cuando no se rastrea inventario, según Liquid; comparar solo `==1` puede generar falso positivo. [Variant Liquid](https://shopify.dev/docs/api/liquid/objects/variant). Liquid tampoco entrega todo el expediente privado ni todos los estados por location de Admin. La guarda local y una casilla no certifican el inventario global; no introducir API Admin en navegador ni una app obligatoria como falsa solución. Si el proceso humano no puede sostenerse, omitir badge fuerte.

| Caso falsable | Resultado prescrito |
|---|---|
| Variante tracked/deny qty 1, vintage de serie | Sin 1-of-1; posible “Single archive item” tras revisión física. |
| Variante tracked/deny qty 1, prototipo único documentado y revisión vigente | Badge fuerte posible. |
| S/M con qty 1 cada una | Ocultar claims de unidad única. |
| Disponible 1, otra unidad física no disponible en otra location | Ocultar claim de unidad única. |
| Inventario no rastreado quantity 1 | Ocultar. |
| Qty 1 con continue/fabricación adicional | Ocultar. |
| Dos productos comprables comparten `unique_piece_id` | Ocultar hasta reconciliar. |
| Locations/inventario externo desconocidos | Ocultar. |
| Unidad reservada/vendida, qty 0 | Disponibilidad real; sin urgencia comprable. |

Estas son salvaguardas de Sartorial; Shopify prohíbe engaño, pero no prescribe literalmente este algoritmo.

## Edition: precisión técnica sin claims de superioridad automática

Los rangos 380–520 GSM y 1,2–1,8 mm son ejemplos solicitados, no límites universales de lujo ni defaults. Un tejido ligero puede ser excelente. GSM expresa masa por superficie, no densidad volumétrica. Peso/espesor no prueban durabilidad, sostenibilidad o calidad por sí solos.

| Key bajo `sartorial` | Tipo propuesto | Unidad y contrato |
|---|---|---|
| `material_composition` | `single_line_text_field` | Composición real, porcentajes coherentes por capa/componente; exterior y forro separados. |
| `fabric_weight_gsm` | `number_decimal` | >0; presentar g/m². |
| `fabric_weight_tolerance_gsm` | `number_decimal` | Desviación absoluta ≥0 solo documentada. |
| `leather_thickness_min_mm`, `leather_thickness_max_mm` | `number_decimal` | >0, min ≤ max; mm, rango real. |
| `fabric_structure` | `single_line_text_field` | Sarga/plain weave/knit/loopback; no llamar weave a todo punto. |
| `yarn_description` | `single_line_text_field` | Hilo/proceso; “combed” no es ligamento. |
| `dye_process` | `single_line_text_field` | Distinguir yarn-dyed, piece-dyed y garment-dyed. |
| `fabric_origin` | `single_line_text_field` | Origen del material documentado. |
| `manufacturing_origin` | `single_line_text_field` | Lugar de confección, separado de tejido/herrajes. |
| `hardware_manufacturer` | `single_line_text_field` | Fabricante exacto respaldado. |
| `hardware_series`, `hardware_size_code` | `single_line_text_field` | Serie/código nominal; “8” no se convierte en 8 mm sin ficha dimensional. |
| `hardware_base_material` | `single_line_text_field` | Material de pieza concreta; dientes/cursor/tirador pueden diferir. |
| `hardware_finish_appearance` | `single_line_text_field` | Negro mate, cepillado, envejecido: apariencia. |
| `hardware_coating_process` | `single_line_text_field` | PVD/electroplating/etc solo documentados; no agrupar PVD automáticamente como proceso galvánico. |
| `item_weight` | `weight` | Masa neta del producto, unidad g; distinta de shipping weight. |
| `item_weight_tolerance` | `weight` | Desviación absoluta validada en g; omitir sin respaldo. |
| `measurement_basis` | `single_line_text_field` | Talla/variante, seco/acondicionado, accesorios incluidos/excluidos. |
| `dimensions_notes` | `multi_line_text_field` | Método y puntos de medición; no sustituye tabla de tallas. |
| `dimension_length`, `dimension_width`, `dimension_depth` | `dimension` | Dimensiones pertinentes; conservar unidad y convertir explícitamente si se muestra mm. |
| `dimension_tolerance` | `dimension` | Tolerancia vinculada a medida concreta; no universalizarla. |

**Nomenclatura:** EXCELLA es de YKK; su catálogo muestra códigos 8SGY/8SGW. Raccagni muestra T8. No escribir “Raccagni/Excella calibre 8” como si fueran la misma marca ni asumir tamaños físicos/intercambiabilidad equivalentes. Los catálogos prueban existencia de líneas, no componentes de una prenda Sartorial. [YKK EXCELLA](https://www.ykkfastening.com/products/search/detail.html?pdid1=EXCELLA%28R%29) · [Raccagni](https://www.raccagnigroup.com/en/zippers/).

Conservar método, talla, instrumento, fecha y origen para masa/tolerancia. Un rango de proveedor no se convierte sin base en tolerancia simétrica. Ejemplo únicamente ilustrativo: “760 g ±20 g, size M, dry garment, packaging excluded”. No publicar “precision weight” con instrumento desconocido. Las referencias ISO sobre masa superficial de tejido y espesor de cuero describen métodos; esta auditoría no leyó normas completas, no hizo ensayos y no habilita afirmar “ISO tested”. “Organic”, origen italiano o PVD son claims independientes que necesitan evidencia.

Diseño: tres grupos “Material”, “Construction”, “Dimensions”; dos a cuatro hechos decisivos visibles y resto en detalle accesible. Usar `<dl>` para pares y tabla solo para comparación útil de dimensiones/tallas. Unidades junto al número; tipografía legible, sin columnas que trunquen materiales. Explicar siglas; evitar sellos de certificación inexistente y veinte líneas de componentes irrelevantes. El relato sensorial y la ficha se complementan; los datos técnicos no reemplazan imagen, cuidado y fit.

## Atelier: desfile, derechos y relación con la pieza

| Key bajo `sartorial` | Tipo propuesto | Regla |
|---|---|---|
| `runway_collection` | `single_line_text_field` | Colección/temporada real; vacío sin fuente. |
| `runway_look_number` | `single_line_text_field` | Admite 12A; no numerar arbitrariamente imágenes editoriales. |
| `runway_event_date` | `date` | Fecha respaldada. |
| `runway_relationship` | `single_line_text_field` | `documented_show_piece`, `collection_style`, `editorial_styling`, `unconfirmed`. |
| `runway_source_url` | `url` | Fuente pública estable aprobada. |
| `runway_notes` | `rich_text_field` | Distingue ejemplar de desfile, estilo de colección y recreación editorial. |
| `runway_media` | `list.file_reference` | Uso comercial PDP/demo autorizado. |
| `runway_media_credit` | `single_line_text_field` | Crédito exigido; no sustituye licencia. |

“Worn on the runway” para esta unidad requiere trazabilidad de esa unidad. “Runway look · [season] · Look [n]” exige correspondencia real con el look. Si solo existe una composición propia, usar “Collection look” o “Styled with” sin inventar evento. Identificar una casa factualmente cuando proceda, evitando logos/endorsement/patrocinio/afiliación inexistente. “Haute couture”, “bespoke” y “handmade” no son defaults seguros para cualquier producto.

Mantener en expediente privado licencia/cesión/releases, emisor, duración, territorios, usos, transformaciones y revocación. Un link de prensa, una imagen oficial o un crédito no transmiten derechos de fotografía/video. WIPO distingue marcas, copyright y derechos de diseño; autorización fotográfica no despeja automáticamente imagen de modelos ni todas las obras representadas. Johandry debe resolver permisos con asesoría pertinente por mercado. Este contrato reduce riesgo y no garantiza ausencia de infracción. [WIPO copyright FAQ](https://www.wipo.int/en/web/copyright/faq-copyright) · [WIPO fashion](https://www.wipo.int/en/web/fashion).

### Atelier: bloque sastre

| Key bajo `sartorial` | Tipo | Contenido y publicación |
|---|---|---|
| `canvas_construction` | `single_line_text_field` | `full_canvas`, `half_canvas`, `fused`, `unstructured`, `not_confirmed`; ningún default positivo. |
| `canvas_material` | `single_line_text_field` | Composición documentada de entretela, fibras/mezclas animales cuando corresponda. |
| `lapel_construction` | `single_line_text_field` | Mano/máquina/mixto; hand-padded requiere dato del taller. |
| `lining_composition` | `single_line_text_field` | Cupro/mezcla/porcentaje; Bemberg solo si marca/fabricante respaldados. |
| `buttonhole_construction` | `single_line_text_field` | Mano/máquina y técnica Milanese cuando esté documentada. |
| `tailoring_notes` | `rich_text_field` | Proceso de esa prenda, sin garantía universal de fit/durabilidad. |

Full canvas describe construcción/extensión de la entretela, no demuestra crin de caballo ni todo el trabajo manual. Solapa picada a mano es un proceso, no una inferencia por apariencia. Cupro es fibra; Bemberg es marca de cupro de Asahi Kasei. La información de fabricante sobre humedad no certifica rendimiento medido de este SKU, compostabilidad de toda la prenda o sello ambiental. Un ojal milanés es una técnica/acabado específico; no todo ojal manual es milanés. Los ejemplos de Huntsman y Bhambi ilustran construcción de sus productos, no prueban Sartorial.

## Atelier: galería split-screen y cinco estados

La propuesta debe ocupar 50% del **contenedor útil**, no sumar dos `50vw` más padding/gap y exceder viewport. `62rem` de la directiva (`151`) es punto inicial, no garantía. Mantener split solo mientras galería, selector, precio, cantidad, leyendas y CTA caben con título/idioma hostiles.

Una página con scroll natural; evitar dos paneles con scroll propio que atrapen rueda/touchpad. Información sticky solo si su altura permite leerla; con altura superior a viewport menos header vuelve al flujo normal. No recortar formulario/descripción con `height:100vh` y `overflow:hidden`. DOM lógico, formulario único y foco coherente. Sticky no tapa selector, error, subtotal o pago. Zoom admite teclado/Escape y retorno de foco. Crop editorial opcional con acceso a imagen completa; `contain` cuando detalles técnicos o condición lo exijan. Imagen de variante sincronizada.

En móvil 320–375, stack/carrusel existente sin split, dimensiones reservadas, controles sin hover y vídeo sin autoplay audible. Aceptación propuesta:

| Estado | Conducta esperada | Prueba pendiente |
|---|---|---|
| Vacío: 0 medios | Placeholder proporcional; sin zoom/flechas fantasma. | 320/375/desktop, foco y nombre accesible. |
| Uno | Sin paginación inútil; fotografía completa accesible. | Zoom, cierre y retorno de foco. |
| Muchos: 10+ medios | Lazy loading excepto principal; detalles accesibles, vídeo pausado; no pared obligatoria de scroll. | Red, navegación por teclado, selección de variante. |
| Muy largo: título 120, precio/40 variantes | Sticky degrada a flujo normal; formulario/CTA íntegros. | 200% texto/400% reflow y reduced motion. |
| Faltante: secundaria/descripción/dato | Sin huecos o afirmaciones de relleno. | Ausencias combinadas y navegación completa de compra. |

Criterio interno de rechazo: si cambiar talla o alcanzar CTA exige descubrir qué panel debe desplazarse, la composición falló. Ninguna recomendación aquí prueba el split en vivo, los materiales, la autenticidad, la condición ni las licencias del catálogo.

# Track 2 — Experiencia, comercio y estados degenerados

## Hallazgos del árbol local y separación de propuesta/implementación

La lectura delegada identifica `HEAD 60599ab`. En este snapshot el selector PLP implementado admite dos y cuatro columnas: `sections/main-collection.liquid:264,280` y `assets/theme.js:2999,3007` mantienen la lista permitida `['2','4']`. No hay evidencia de una vista lista ya implementada. La clase/controlador real es `FacetFiltersForm` (`theme.js:2871`); la propuesta no debe asumirse existente bajo otro nombre.

La directiva Fase 1, línea 68, propone `.collection-products__grid`, mientras `main-collection.liquid:298` declara `.product-grid.unstyled-list` con `data-product-list` en línea 299. **P1:** integrar sobre el DOM existente; no añadir un selector que nunca alcanza el listado. El cambio de vista debe volver a aplicarse tras el reemplazo AJAX (`theme.js:2955–2956`), extender ambos conjuntos de valores permitidos y conservar el fallback cuando localStorage no esté disponible (`2993–2997,3018–3021`).

El subtotal **ya existe**: `updateLineTotal` (`theme.js:896–949`) oculta cantidad menor o igual a uno y variantes agotadas, usa precio numérico válido y `formatMoney` (`941`). Obtiene el precio de `currentAllocation || currentVariant` (`903`). La locale actual dice `Total for {{ quantity }}` (`locales/en.default.json:401`) y `main-product.liquid:448–461` no aporta el aviso fiscal/preventivo junto al bloque. La propuesta debe mejorar el contrato y el copy, no presentar toda la función como una novedad ausente.

No se reprodujo un defecto de precio cero: las comprobaciones de nulidad y finitud admiten cero (`theme.js:913,919`), y los campos de precio numérico aparecen en `main-product.liquid:721–722,739–740`. Hay que conservar esta propiedad sin usar un fallback basado en veracidad que convierta cero en “sin precio”. `base.css:5019–5022` usa `visibility: hidden`, lo que conserva espacio; esto no demuestra CLS cero.

## PLP: jerarquía y comportamiento

En desktop, organizar imagen, contenido y precio/acción en una fila legible. Prioridad: título completo y acceso a PDP; precio contextual y disponibilidad; vendor si aporta información; un atributo verificado que distinga la pieza; opciones pertinentes. Edition puede priorizar material o construcción; Archive fecha/condición documentada; Atelier corte. El extracto debe ser curado, no la primera cadena HTML de una descripción larga.

En 320–375 px, usar una miniatura propuesta de 88–96 px con proporción 4:5 y columna de texto `minmax(0, 1fr)`. Ejemplo de diseño a 320 px: 32 px de padding total + 88 px de imagen + 12 px de separación dejan 188 px para texto. Es una recomendación de Sartorial, no un requisito de Shopify. Título y precio deben apilarse y la acción puede ir debajo. Con ampliación de texto que vuelva inviable la fila, pasar a imagen sobre texto en vez de comprimir la foto hasta perder información.

Permitir salto de títulos de 120 caracteres, vendors extensos y tokens sin espacios; mantener moneda, precio y estado completos. El precio comparativo puede pasar a otra línea. No reducir la tipografía para disimular overflow. No hacer de toda la fila un botón de añadir, no anidar links y botones y no duplicar el DOM de tarjetas con IDs repetidos. El orden de lectura y foco debe seguir la jerarquía visual: actualmente los swatches (`snippets/product-card.liquid:158`) preceden al título (`293`), lo que merece revisión al reorganizar la tarjeta.

El límite actual de swatches es cuatro (`product-card.liquid:40`); la presentación estrecha de dos más `+N` (`163–171,275–282`) es preferible a seis objetivos comprimidos. El selector de vista utiliza botones, nombre accesible, `aria-pressed` y foco conservado. Cambiar presentación no debe volver a descargar el catálogo, reiniciar filtros ni alterar paginación. Sin JS queda una rejilla nativa utilizable. Johandry/Claude deben decidir si la preferencia persiste globalmente entre colecciones o por colección y explicarlo de forma coherente.

### Matriz PLP — condiciones propuestas, no ejecutadas

| Estado | Conducta exigida | Verificación y aceptación pendiente |
|---|---|---|
| Vacío: cero productos | Distinguir colección vacía, filtros sin resultados y contenido promocional sin productos; ofrecer catálogo o limpiar filtros según contexto; selector oculto/deshabilitado sin pérdida de foco. | Capturas 320/375/desktop de los tres casos, árbol accesible, acción limpiar filtros y anuncio de resultados. Referencia actual: vacío `main-collection:393–403`; promoción aislada `296`. |
| Uno solo | Anchura e imagen coherentes; sin `+0`, paginador falso ni atributos inventados. | Alternar vistas, abrir PDP y añadir la variante correcta; cero overflow. |
| Muchos: 50+ y caso general de 200 | Procesar página visible; conservar filtros, orden, historial y preferencia; promociones no cuentan como producto ni deforman columnas. | Primera→segunda→última→atrás, recuentos y red sin descargar todo el catálogo; teclado. `paginate` actual `248`, paginador `407–410`. |
| Muy largo | Título 120, vendor largo, moneda/símbolos y decimales extensos, swatches múltiples: salto completo y acciones independientes. | 320/375, texto 200%, reflow equivalente a 400% desktop; `scrollWidth <= clientWidth` de raíz y contenedores; moneda del Market activo; foco visible. |
| Faltante | Placeholder estable y neutro con acceso nombrado; omitir extracto/vendor/especificación ausentes y sus separadores. | Capturas sin imagen/extracto/vendor/secundaria; nombres accesibles y enlaces correctos. Placeholder actual `product-card:152–154`, vendor `289`. |

## Subtotal estimado: psicología y contrato monetario

**Recomendación:** ocultarlo en `qty == 1` para prendas y piezas únicas, revelarlo con cantidad válida mayor que uno y mantener el precio unitario visible. Para productos técnicos que se compren por lote, el comerciante puede necesitar mostrarlo siempre; debe ser una opción explicada y no un comportamiento impuesto a todo catálogo. No anunciar cada pulsación ni provocar saltos de layout evitables.

Copy exacto propuesto, traducible y en sentence case:

- Label: `Estimated item subtotal for {{ quantity }} units: {{ total }}`.
- Cuando `cart.taxes_included` es verdadero: `Taxes included. Shipping calculated at checkout.`
- Cuando es falso: `Taxes and shipping calculated at checkout.`
- Aviso adicional cuando se necesite distinguir descuentos: `Discounts and the final amount are confirmed at checkout.`

Para una variante sin envío físico, omitir la promesa sobre gastos de envío. Si la tienda muestra duties, añadir únicamente copy acorde al contexto fiscal real. No afirmar universalmente “antes de impuestos” cuando el precio ya los incluye. El tema ya tiene copy condicional en `snippets/price.liquid:106–107` y `sections/cart-drawer.liquid:485–488`; reutilizar la misma lógica y claves, evitando textos contradictorios. Un cambio de Market puede cambiar moneda y tratamiento fiscal. [Cart Liquid](https://shopify.dev/docs/api/liquid/objects/cart).

La cifra es una estimación del precio seleccionado multiplicado por cantidad; no una simulación completa del motor de descuentos. La revisión no encontró `quantity_price_breaks` en sections/snippets/assets, por lo que no se promete soporte certificado de escalas de volumen. Un precio comparativo no es un descuento automático. El carrito usa `final_line_price` (`cart-drawer:206–209`, `main-cart-items:95–100`) y debe reconciliar la cifra real tras la respuesta de Shopify.

El guard actual del subtotal considera `variant.available` (`theme.js:918`), pero debe acompañar la validez real de la opción de compra. `isPurchaseOptionValid` (`775–782`) rechaza planes requeridos sin allocation válida y se usa en añadir al carrito (`807–819`) y checkout acelerado (`825–826`). No mostrar una estimación accionable para una combinación que no puede comprarse.

### Matriz subtotal — condiciones propuestas, no ejecutadas

| Estado | Conducta exigida | Verificación y aceptación pendiente |
|---|---|---|
| Vacío | Sin variante/precio/plan válido: ocultar estimación y conservar precio/estado apropiado; sin NaN. | Producto con datos incompletos o allocation inválida; ATC y pago acelerado coherentes. |
| Uno solo | Cantidad 1: precio unitario suficiente, subtotal oculto por defecto; pieza única no ofrece incrementar sin posibilidad real. | Única variante y quantity rule mínimo válido; foco y altura estable. |
| Muchos | Cantidad grande, múltiples variantes/planes: usar precio y reglas de la selección actual. | Cambio rápido de cantidad/variante/plan, reglas min/step/max y respuesta real del carrito. |
| Muy largo | Total/moneda/nombre del plan extensos: salto de línea, sin cifras recortadas ni importe comunicado solo visualmente. | 320/375, ampliación de texto, lector de pantalla y Market activo. |
| Faltante | Precio desconocido no se convierte en cero; cero válido sí permanece cero. | Datos numéricos ausentes frente a precio legítimo cero; formateo compartido. |

`updateRules` (`theme.js:952–1002`) cambia min/step/max y emite eventos; no se ha certificado que toda cantidad inválida por step se normalice tras cambiar variante. Hay hooks de cantidad (`541–544`), actualización interna de variante (`654–658`), sticky (`1233–1239`) y live region (`main-product:452–453`); comprobar que todas las superficies comparten una selección única.

Casos adicionales obligatorios: variante agotada (sin acción comprable, subtotal oculto), precio cero válido, descuento automático, plan obligatorio sin allocation, plan recurrente con precio por entrega distinto del cobro inicial, preventa y error de red. Los datos JSON de allocation (`main-product:739–744`) contienen precio/precio por entrega, pero no `checkout_charge_amount`; no etiquetar ese importe como “pay today” ni como depósito sin contrato adicional. `inventory_policy=continue` con cantidad menor o igual a cero (`theme.js:1063–1064`) permite inferir una disponibilidad continuada, pero no prueba una preventa auténtica ni su fecha de despacho. La preventa necesita opción de compra y condiciones respaldadas por el comerciante.

## Cart drawer: curaduría y elección táctil

La recomendación debe partir de complementariedad funcional, afinidad de materiales/color/ocasión y disponibilidad real. Para un traje, un pañuelo, una corbata o un tarjetero pueden ser razonables; para una corbata, no usar un abrigo de 2.500 USD como propuesta automática dominante. No imponer un multiplicador universal de precio: los tickets relativos dependen de la marca y el surtido. Proponer una selección manual prioritaria y un fallback conservador; cuando no existan complementos pertinentes, ocultar el bloque.

La deduplicación debe excluir productos que ya están en el carrito y mantener un conjunto común de productos mostrados entre todos los bloques. No excluir solo el variant ID: una segunda talla del mismo producto no es un complemento. Reevaluar la lista tras cada mutación del carrito y no mostrar un resultado desactualizado mientras se procesa una solicitud.

Para una variante única disponible, añadir directamente puede ser correcto. Con talla/color/acabado relevantes, mostrar selección explícita y el precio/estado actual antes de añadir. No seleccionar silenciosamente la primera variante disponible como si fuera una decisión del comprador. En móvil, opciones táctiles legibles, disponibilidad nombrada, objetivo de 44×44 px del proyecto, botón con progreso y recuperación de error; ninguna acción debe cerrar el cajón o perder foco inesperadamente.

### Matriz drawer — condiciones propuestas, no ejecutadas

| Estado | Conducta exigida | Verificación y aceptación pendiente |
|---|---|---|
| Vacío | Carrito vacío conserva estado vacío; cero recomendaciones oculta el bloque sin huecos ni placeholders de venta. | Carrito vacío, servicio sin resultados y fallo HTTP. |
| Uno solo | Un complemento pertinente: selección y acción completas sin carrusel artificial. | Variante única y producto con opciones; producto exacto añadido. |
| Muchos | Curar un conjunto pequeño, deduplicado entre bloques y carrito; cargar bajo demanda. | Múltiples fuentes y actualización rápida del carrito; ninguna duplicación ni peticiones excesivas. |
| Muy largo | Título, precio, opciones y copy largos se reordenan sin truncar la decisión de compra. | 320/375, 200% texto, teclado y lector de pantalla. |
| Faltante | Sin imagen usa placeholder; sin disponibilidad/opciones válidas no ofrece añadir; datos curatoriales ausentes no se inventan. | Imagen ausente, variante agotada y datos de recomendación incompletos. |

En accesibilidad, 44×44 px es la norma interna más exigente de Sartorial y coincide con el criterio WCAG 2.5.5 de nivel AAA; WCAG 2.2 AA 2.5.8 contempla 24×24 px con excepciones de espaciado. La recomendación de 44/48 px táctiles no debe atribuirse como una obligación universal AA. El foco debe permanecer visible y no quedar tapado por sticky/cajón; WCAG AA 2.4.11 exige que no esté enteramente oculto.

### Precisiones adicionales de aceptación del subtotal y drawer

Una cantidad temporalmente vacía durante escritura no debe producir `NaN`, `undefined` ni anuncios repetidos por cada tecla. Cantidad cero es inválida, aunque el precio unitario pueda ser legítimamente cero. Si la regla mínima exige más de una unidad, el subtotal debe mostrarse desde el primer render válido. En el cambio variante A qty 3 → variante B min 2/step 2, decidir entre normalización explícitamente anunciada o validación que bloquee compra; no comprar silenciosamente una cantidad inválida.

La región viva debe ser `polite`, atómica y anunciar la última selección válida. No redondear el precio unitario antes de multiplicar; aplicar el formatter compartido al resultado. Comprobar USD, EUR y una moneda sin subunidades cuando haya fixture pertinente. La altura reservada actual debe admitir el copy multilínea sin desplazar el CTA; la aceptación exige observarlo, no deducir CLS cero del CSS.

**Evidencia específica del drawer:** `cart-drawer.liquid:307–315,381–389` ya excluye recomendaciones cuyo `product_id` aparece en cualquier línea del carrito. El problema pendiente es deduplicar también entre los dos bloques posibles (`limit: 2`, línea 571). `selected_or_first_available_variant` se asigna en `305,379`, y `theme.js:2532` envía `items: [{ id: variantId, quantity: 1 }]`. Esto puede añadir sin una elección de talla y fallar para mínimo superior a uno. La respuesta de secciones se procesa en `2533–2549`, y el foco tras añadir se dirige a la línea (`2552–2556`); son hechos del código, no una certificación en tienda.

La directiva de Fase 1 deja el “Complete the Outfit” contextual para Fase 2. Estas recomendaciones no autorizan implementar un motor paralelo ahora. Propuesta de Fase 2: uno o dos complementos curados como máximo, anclados a la prenda principal y reevaluados al quitarla, sin recomendar recursivamente desde el último accesorio barato. Shopify Search & Discovery permite configurar complementarios; resultados “related” no deben reemplazarlos silenciosamente. Una heurística de presupuesto, si se experimenta, requiere aprobación comercial, moneda de presentación común y precio de la variante elegida; no comparar EUR contra USD ni un precio mínimo “from” contra otro producto seleccionado.

El conjunto de exclusión debe sumar `product_id` de todas las líneas, independientemente de variante, plan y propiedades, más IDs ya mostrados entre fuentes/bloques. Añadir solo productos publicados, válidos en el Market, disponibles y con opción de compra válida. Descartar respuestas antiguas tras mutaciones para no resucitar recomendaciones ya añadidas. Ante HTTP 422/429 o red caída, conservar selección y acceso a checkout; revalidar disponibilidad/precio antes de añadir y aceptar que Shopify decide el resultado final.

La elección de opciones se puede resolver dentro del área de scroll del cajón con “Choose options”; evitar un modal anidado con otra trampa de foco. Una elección de color no equivale a elegir talla. Opciones complejas, planes, personalización o gift cards pueden llevar a “View product” en PDP. La selección no añade automáticamente. El footer de checkout permanece alcanzable y visible; cierre devuelve foco al activador; éxito/error tienen destino de foco predecible y no pierden selección.

# Track 3 — Merchant surface y conformidad Theme Store

## Qué es requisito oficial y qué es compuerta interna

La prohibición vigente de claims engañosos está en **§8, “Consistency and functionality”**, con ejemplos de countdowns, stock y viewer counts ficticios; **§20 es “Demo stores”**. La referencia de la tarea a §20 debe corregirse citando también el título para soportar reorganizaciones. [Requisitos oficiales](https://shopify.dev/docs/storefronts/themes/store/requirements).

§14 pide settings claros, labels y lenguaje comprensible para comerciantes; American English, sentence case en nombres de sección/preset/categoría, voz activa, acciones iniciadas con verbo y ausencia de ampersands. La compuerta interna amplía sentence case a todos los labels/headings y exige 100% `t:`. GSM/PVD y nombres propios mantienen capitalización correcta; no convertir siglas en “Gsm”. “Hardware & trims” → “Hardware and trims”; “Origin & crafting” → “Origin and craftsmanship”.

Los atributos de schema label/info/opciones deben ser traducibles mediante schema locales. Exigir `info` a todo setting dependiente de datos/configuración externa es regla estricta del proyecto; no se encontró una obligación universal de Shopify de incluir `info` en cada setting. §16 exige defaults útiles sin reutilizar contenido de demos como placeholders: un heading neutro enseña estructura; “Circa 1998”, condición favorable y fabricante/origen universal pueden simular hechos. [Shopify requirements, §16](https://shopify.dev/docs/storefronts/themes/store/requirements).

No se encontró umbral de aceptación específico por precio de 380 USD. El precio premium no dispensa accesibilidad, performance ni funcionalidad. Las escalas, guardas de unicidad, límites de curaduría y pruebas 320/375 son decisiones propuestas de Sartorial, no reglas textuales de Shopify.

## Contrato de labels e info — propuestas para aprobación

Claves siguientes **nuevas/propuestas**, no verificadas como presentes ni cerradas por el inventario actual. Prefijo sugerido `sections.main_product.settings` para PDP, `sections.main_collection.settings` para PLP y `sections.cart_drawer.settings` para drawer; Claude debe adaptar al patrón existente evitando claves duplicadas.

| Setting propuesto | Label sentence case / key `t:` sugerida | `info` explicativo requerido por el proyecto |
|---|---|---|
| Mostrar bloque técnico | “Show technical specifications” / `t:sections.main_product.settings.show_technical_specs.label` | `…show_technical_specs.info`: “Uses product or variant data added by the merchant. Empty fields are hidden.” |
| Fuente de masa textil | “Fabric weight (GSM)” / `t:sections.main_product.settings.fabric_weight.label` | `…fabric_weight.info`: “Enter a documented fabric mass per square meter. This is not the garment or shipping weight.” |
| Herrajes | “Hardware and trims” / `t:sections.main_product.settings.hardware.label` | `…hardware.info`: “Add the actual manufacturer, series and finish for this product. Leave unknown details blank.” |
| Origen | “Origin and craftsmanship” / `t:sections.main_product.settings.origin.label` | `…origin.info`: “Use documented product data. Fabric origin and manufacturing location can differ.” |
| Procedencia | “Show provenance details” / `t:sections.main_product.settings.show_provenance.label` | `…show_provenance.info`: “Uses the product archive record. Do not upload private acquisition or identity documents as public files.” |
| Condición | “Condition grade” / `t:sections.main_product.settings.condition_grade.label` | `…condition_grade.info`: “Select a grade only after inspection. Disclose damage, repairs and use restrictions separately.” |
| Unicidad | “Show unique piece label” / `t:sections.main_product.settings.show_unique_piece.label` | `…show_unique_piece.info`: “Requires documented uniqueness and a reviewed single physical item. Size variants, untracked inventory or overselling make the item ineligible.” Default false; no booleano certifica hechos. |
| Referencia de desfile | “Show runway reference” / `t:sections.main_product.settings.show_runway_reference.label` | `…show_runway_reference.info`: “Use a documented collection or show reference and media licensed for the intended use.” |
| Galería | “Use split product layout” / `t:sections.main_product.settings.split_layout.label` | `…split_layout.info`: “Uses a side-by-side layout on wide screens. Product information returns to normal scrolling when it does not fit.” |
| Subtotal | “Show estimated item subtotal” / `t:sections.main_product.settings.show_line_total.label` | `…show_line_total.info`: “Shows an estimate for the selected variant and valid quantity. Discounts and the final amount are confirmed at checkout.” |
| Sticky | “Enable sticky add-to-cart bar” / `t:sections.main_product.settings.enable_sticky_cart.label` | `…enable_sticky_cart.info` si depende de opciones/planes: “Uses the selected product options. Products with required purchase plans must have a valid plan selected.” |
| Vista PLP | “Enable collection view options” / `t:sections.main_collection.settings.enable_view_options.label` | Explicar persistencia y fallback si configurable; opciones “Editorial grid”, “Compact grid”, “Product list” bajo respectivas keys `…options.*`. |
| Complementos | “Show complementary products” / `t:sections.cart_drawer.settings.show_complementary_products.label` | `…show_complementary_products.info`: “Configure complementary products in Shopify Search & Discovery. Products already in the cart are excluded.” Especificar dependencia real aprobada. |
| Umbral envío | “Free shipping threshold” / `t:sections.cart_drawer.settings.free_shipping_threshold.label` | `…free_shipping_threshold.info`: “Set this to match your shipping rates and eligible markets. This setting does not create a shipping discount.” |
| Mensaje express | “Shipping message” / `t:sections.cart_drawer.settings.shipping_message.label` | `…shipping_message.info`: “Use delivery claims supported by your shipping service, destination coverage and dispatch times.” |

Nunca mostrar al comerciante “bento”, “popover”, “payload”, “intent” o una marca no configurable como nombre del control. IDs internos pueden ser técnicos; la superficie visible debe ser neutra. No traducir metadatos del producto sustituyéndolos por labels de schema: son capas distintas. Los placeholders educativos no deben parecer hechos del producto. Localizar también nombres, headings, opción desconocida, avisos y texto de ayuda, no solo labels. Los ejemplos de `info` son propuestas de copy y deben concordar con el comportamiento realmente implementado.

## Matriz de los diez riesgos prioritarios

Esta matriz define métodos de verificación **pendientes**, no diez defectos reproducidos ni estadísticas de rechazo. Severidad refleja impacto del riesgo; aceptación corresponde a evidencia necesaria.

| # | Riesgo / severidad | Base oficial y evidencia a recopilar | Solución y condición de aceptación | Responsable |
|---|---|---|---|---|
| 1 | Presets indistintos o diferentes del estado instalado — Alta | §2 originalidad; §18 templates/paridad. Comparar fresh install, demos y estructuras home/PLP/PDP. | Identidad funcional y composición sustancialmente distintas; instalar cada preset reproduce su demo. Color/fuente por sí solos no bastan. | Claude implementación; Johandry dirección; QA por demo. |
| 2 | Unicidad/escasez/urgencia falsas — Crítica | §8; expediente, variantes, unidades físicas en todas locations, tracking y política oversell. | Default off, hechos documentados y guardas del Track 1. Una unidad disponible no acredita producción única ni todas las existencias. | Johandry hechos/revisión; Claude render. |
| 3 | Precio/subtotal engañoso o moneda incorrecta — Alta | §7 y currency formatting; variante, compare-at, cantidad, planes, impuestos incluidos y presentment currency. | Formatter compartido/contrato `shop.money_format`; estimación clara, cero válido y total real del carrito reconciliado. No simular descuentos finales. | Claude; QA monetario en tienda. |
| 4 | Media/precio/estado obsoletos al seleccionar variante — Alta | §7; variantes con imagen, agotadas, URL y back/forward. | Media, precio, disponibilidad y controles siguen la selección actual; ninguna cifra/foto vieja. | Claude; QA en tienda. |
| 5 | Lista PLP desborda o pierde información — Alta | §7/§9; fixtures 0/1/50+ paginados/largo/faltante. | 320/375 sin overflow, título completo, imagen útil, filtros/paginación conservados. Anchos son criterios del proyecto. | Claude; QA móvil/navegadores. |
| 6 | Selector/acciones no accesibles — Alta | §12; teclado, lector, foco, `aria-pressed`, targets y estados no basados solo en color. | Botones semánticos, estado anunciado, foco visible; mínimo oficial 24×24 con excepciones y mínimo interno 44 px cuando aplica. | Claude; QA accesibilidad manual. |
| 7 | Pago acelerado contradice agotado/preventa — Alta | §7; controles nativos enabled por defecto, variantes mixtas, planes y métodos configurados. | Sin compra accionable de selección agotada; coherencia de pago/ATC; preventa respaldada y sin fake fechas. | Claude; QA tienda con pagos reales configurados. |
| 8 | Contraste insuficiente en lujo sobrio — Alta | §12; todos color schemes, overlays, badges, tablas y foco. | Body ≥4,5:1; texto grande/no textual ≥3:1; sin metadata/controles ilegibles en una variante de fondo. | Claude; medición y revisión visual. |
| 9 | Performance/assets/scripts incumplen — Alta | §6 benchmark poblado home/PDP/PLP desktop+mobile; §8 scripts hospedados Shopify salvo bibliotecas permitidas; §10 formatos. | Promedio Lighthouse performance ≥60 y accessibility ≥90 según cobertura oficial; contenido esencial servidor y mejoras condicionales. Sin Sass ni minificación de fuente propia conforme reglas del proyecto. Gates no prueban benchmark. | Claude; QA benchmark por preset. |
| 10 | Docs/soporte ausentes o desactualizados — Alta | §21 docs/contact form público/listing; §22 respuesta en dos días hábiles. | URLs públicas, configuración y documentación consistentes, recepción real de formulario y proceso capaz de responder en plazo. | Johandry publicación/soporte; Claude copy técnico. |

No atribuir un error de UX a un competidor ni prometer conversión sin recorrido/medición reproducible. Esta entrega no es benchmark live y no expande el alcance a los competidores.

# Evidencia, confianza y verificación

## Estado observado y límites

Los auditores documentaron `HEAD 60599ab`, `master...origin/master [behind 3]` y un checkout con modificaciones y archivos sin seguimiento. No se actualizó Git ni se alteró ese trabajo. Las conclusiones de código se aplican a ese snapshot; la implementación concurrente de Claude puede cambiarlo. Las funciones propuestas de datos/galería/lista no se encontraron en los archivos examinados. La ausencia en esa búsqueda no acredita ausencia absoluta en otras ramas, remotos o stores.

Confianza alta en los hallazgos de código y semántica oficial citada; recomendaciones comerciales/de datos son propuestas que requieren decisión. Confianza no evaluable sobre verdad material/histórica del catálogo, permisos, inventario global, demos en producción y cumplimiento de las compuertas reales. No se ejecutaron Theme Check, `npm run gates:static`, pruebas de navegador ni mutaciones de carrito/Admin en esta auditoría. La verificación de locales sí se ejecutó por el auditor de Track 3; es una lectura de resolución estática y no un test del storefront.

### Comandos observados por los agentes y resultados

| Comando/lectura | Resultado observado | Qué demuestra y límite |
|---|---|---|
| `git rev-parse --short HEAD` | `60599ab` | Snapshot local; no versión publicada. |
| Lectura de `git status` | `master...origin/master [behind 3]`, dirty | Trabajo previo/concurrente; no atribuye cambios a esta auditoría. |
| `rg -n 'data-grid-view|data-product-list|class="product-grid' sections/main-collection.liquid` | `main-collection:264` vista 2; `280` vista 4; `298` product-grid; `299` data-product-list | Opciones y DOM actuales; no prueba nueva vista lista. |
| `rg -n 'line_total|taxes_included' locales/en.default.json` | Locale 401: `Total for {{ quantity }}`; 406: `Taxes included.` | Copy actual; no comportamiento real. |
| `rg -n 'quantity_price_breaks' sections snippets assets --glob '*.liquid' --glob '*.js'` | 0 coincidencias, exit 1 | Sin referencia en ese scope; no certifica soporte de descuento volumen. |
| `rg -n 'tap-target-min' assets/base.css` con `Select-Object -First 4` | Línea 42: `--tap-target-min: 44px` | Token interno; no mide cada objetivo en el navegador. |
| `rg -n 'provenance|technical_specs|split_screen|is_unique|metafields' sections/main-product.liquid listings/archive/templates/product.json listings/edition/templates/product.json listings/sartorial/templates/product.json` | Sin coincidencias | Ausencia en esos archivos/momento; no cierre de features propuestas. |
| `node scripts/locale-key-inventory.mjs` | 83 archivos; 396 referencias storefront distintas; 452 schema; 406 hojas storefront; 452 schema; 0 sin resolver, 0 runtime, 0 huérfanas; OK | Resolución de referencias estáticas existentes, incluyendo listings fuera de Theme Check. No cubre strings futuras Fase 1 ni la traducción de datos del comerciante. |

Extractos numerados observados: `theme.js:913–923` para validación de precio/cantidad y `941` para formateo. Comando de reproducción propuesto, no reejecutado en esta síntesis:

```powershell
$i=0; Get-Content -LiteralPath 'assets/theme.js' | ForEach-Object { $i++; if($i -ge 913 -and $i -le 923) { '{0}:{1}: {2}' -f 'assets/theme.js',$i,$_ } }
```

Resultado relevante: `913` convierte `price_cents` con `Number`; `915` usa validez del input; `918` controla variante disponible; `919–920` rechaza null/cadena vacía; `921–923` cantidad finita >1 y precio finito; `941` `formatMoney(unitCents * quantity, this.moneyFormat)`.

La misma lectura numerada por archivo/rangos mostró `.product-grid` en `main-collection:298`, `data-product-list:299`, whitelist 2/4 en `theme.js:2999,3007`, selección automática de variante en `cart-drawer:305,379`, deduplicación por product ID en `308,382`, cantidad 1 fija en `theme.js:2532` y render de respuesta en `2549`.

```powershell
$auditDataLines = Get-Content -LiteralPath 'agent-comms/inbox-claude/CLAUDE-TASK-V1.1.0-PHASE1.md'
for ($auditDataIndex = 98; $auditDataIndex -lt 157; $auditDataIndex++) { '{0}: {1}' -f ($auditDataIndex + 1), $auditDataLines[$auditDataIndex] }
```

Resultado: `110` claims de material/herraje/Italia; `127` unicidad default true; `128` condición favorable; `132` Circa 1998/badge; `138` ruta Sartorial; `151` min-width 62rem/galería 50vw. Demuestra el contrato escrito, no que ya se aplique a las demos.

### Salida literal del inventario de locales

```text
--------------------------------------------------------------------------
INVENTARIO DE CLAVES DE TRADUCCION
--------------------------------------------------------------------------
Archivos escaneados:            83 (incluye /listings, fuera de Theme Check)
Referencias estaticas | t:      396 claves distintas
Referencias de schema t::       452 claves distintas
Claves en en.default.json:        406 hojas
Claves en en.default.schema.json: 452 hojas

Sin resolver en storefront:     0
Sin resolver en schema:         0
Construidas en runtime:         0  <- no verificables por ningun linter
Huerfanas en storefront:        0
Huerfanas en schema:            0
--------------------------------------------------------------------------
OK: todas las referencias estaticas resuelven contra los locales.
```

## Decisiones y orden de aplicación propuestos

1. **Johandry + Claude, antes de Fase 1:** retirar defaults factuales, confirmar `listings/sartorial` como Atelier, aprobar owner/keys/tipos y la distinción “Single archive item” frente a unicidad documentada.
2. **Johandry:** asignar responsable real de expediente/condición/licencias/revisión de locations; decidir qué datos se publican. Sin proceso sostenible, no badge fuerte.
3. **Claude:** reconciliar selector real de colección, `t:`/sentence case/info y contrato subtotal–plan–cantidad–impuestos. Priorizar coherencia sobre nuevas superficies.
4. **Claude + QA independiente:** probar matrices hostiles y los casos de unicidad/stock/planes antes de cerrar filas. Declarar fixtures, Market, preset, viewport y pasos exactos.
5. **Fase 2:** decidir curaduría del drawer, variantes explícitas y deduplicación entre bloques; no construir un motor paralelo durante la Fase 1 por este informe.
6. **Johandry + Claude:** resolver planes/deposit/B2B/volumen admitidos y documentar límites; no prometer soporte que no se haya verificado.
7. **Antes de submission:** fresh install/paridad de demos, teclado/lector/Safari móvil, moneda/impuestos/checkout nativo, performance poblada y recepción real de soporte. Static gates/locale inventory no sustituyen estos pasos.

**Ledger:** esta entrega no cierra ni modifica filas de `docs/requirements-ledger.md`. Las recomendaciones deberán vincularse a filas por el responsable técnico cuando se implemente y adjunte evidencia por archivo:línea y tienda real. No se produjo parche listo ni se modificó código fuente.

# Fuentes consultadas por los auditores

Fuentes normativas/técnicas oficiales, consultadas para esta entrega; respaldan las distinciones y obligaciones descritas, no certifican Sartorial:

- [Shopify Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements): originalidad, performance, PDP, claims, accesibilidad, settings, defaults, presets, demos, docs y soporte. Referenciar títulos además de números.
- [Theme settings](https://shopify.dev/docs/storefronts/themes/architecture/settings) y [theme locales](https://shopify.dev/docs/storefronts/themes/architecture/locales): schema y traducción de atributos.
- [Crear definiciones de metafields](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions/creating-custom-metafield-definitions), [tipos de datos](https://shopify.dev/docs/apps/build/metafields/list-of-data-types) y [metafield Liquid](https://shopify.dev/docs/api/liquid/objects/metafield): contrato de definición/tipo/lectura. No justifican una app obligatoria.
- [InventoryLevel Admin](https://shopify.dev/docs/api/admin-graphql/latest/objects/InventoryLevel) y [variant Liquid](https://shopify.dev/docs/api/liquid/objects/variant): estados de inventario por location y límites del dato expuesto por tema.
- [Cart Liquid](https://shopify.dev/docs/api/liquid/objects/cart), [quantity_rule](https://shopify.dev/docs/api/liquid/objects/quantity_rule), [descuentos en temas](https://shopify.dev/docs/storefronts/themes/pricing-payments/discounts), [selling_plan_allocation](https://shopify.dev/docs/api/liquid/objects/selling_plan_allocation) y [pre-orders](https://help.shopify.com/en/manual/products/purchase-options/pre-orders): precio, fiscalidad, reglas y opciones de compra.
- [Currency formatting](https://shopify.dev/docs/storefronts/themes/pricing-payments/currency-formatting): contrato de formato monetario y presentación de moneda.
- [Product recommendations](https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations), [API de recomendaciones](https://shopify.dev/docs/api/ajax/reference/product-recommendations) y [Cart Ajax](https://shopify.dev/docs/api/ajax/reference/cart): recomendaciones related/complementary, IDs y respuesta del carrito; no constituyen un curador integral de todo el carrito.
- [Shopify accessibility](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility), [tap targets](https://shopify.dev/docs/storefronts/themes/best-practices/performance/increase-tap-target-size) y [WCAG 2.2](https://www.w3.org/TR/WCAG22/): contraste, foco y distinción 24 px AA/44 px AAA/recomendaciones táctiles.

Fuentes de conservación, fabricantes y propiedad intelectual; no acreditan los productos demo:

- [Canadian Conservation Institute — textiles and costumes](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/textiles-costumes.html): vulnerabilidad y manejo de textiles históricos; no define la escala Sartorial.
- [YKK EXCELLA](https://www.ykkfastening.com/products/search/detail.html?pdid1=EXCELLA%28R%29) y [Raccagni zippers](https://www.raccagnigroup.com/en/zippers/): nomenclatura de líneas/códigos; no composición de un SKU Sartorial.
- [ISO, masa por unidad de superficie de tejido](https://www.iso.org/standard/9335.html) y [ISO, espesor de cuero](https://www.iso.org/standard/68859.html): existencia/alcance de métodos; sin reproducción de normas ni ensayos.
- [Asahi Kasei — Bemberg](https://www.asahi-kasei.com/news/2015-2021/2021/e211214): marca/fibra y afirmaciones del fabricante; no rendimiento o certificación de una prenda demo.
- [Huntsman cream hopsack blazer](https://www.huntsmansavilerow.com/products/cream-hopsack-blazer) y [Bhambi, anatomy of a bespoke suit](https://www.bhambis.com/the-anatomy-of-a-bespoke-suit-an-interactive-guide-to-true-custom-tailoring/): ejemplos primarios de construcción, pertenecientes a sus prendas.
- [WIPO fashion](https://www.wipo.int/en/web/fashion), [copyright FAQ](https://www.wipo.int/en/web/copyright/faq-copyright) y [fotografías de obras/marcas](https://www.wipo.int/en/web/wipo-magazine/articles/ip-and-business-using-photographs-of-copyrighted-works-and-trademarks-35208): capas de derechos y límites de licencias; no dictamen legal por mercado.

**Precisión de tipos/unidades:** `weight` admite unidades nativas g/kg/oz/lb; `dimension` admite cm/m/in. Para publicar mm, convertir explícitamente desde una unidad admitida o usar `number_decimal` con contrato de mm aprobado; no proponer mm como unidad nativa JSON. Guardar tolerancia como magnitud no negativa y representar ± solo cuando el método respalde una tolerancia simétrica.

# Afirmaciones falsables adicionales para la aceptación futura

7. Ningún producto nuevo sin datos hereda fecha, material, fabricante, condición o unicidad positivos de la plantilla.
8. Una pieza vintage serializada con stock uno no muestra 1-of-1; una location/variante/unidad desconocida suprime el claim de unicidad.
9. El grado de conservación no elimina disclosure de restauración ni determina aptitud para vestir.
10. Vista lista conserva título, moneda, estado, filtros y paginación en las cinco matrices a 320/375 y desktop.
11. El subtotal sigue variante, cantidad y plan válidos; impuestos incluidos no se vuelven a describir como futuros; importe recurrente/por entrega no se anuncia como cobro inicial.
12. Los bloques del drawer excluyen productos del carrito y entre sí, y no añaden una talla sin decisión explícita.
13. Toda nueva referencia `t:` y `info` se resuelve tras la implementación; el inventario actual no certifica esas futuras claves.
14. Las demos y el fresh install tienen paridad verificable; ninguna de estas afirmaciones se considera aprobada sin evidencias de su ejecución.



