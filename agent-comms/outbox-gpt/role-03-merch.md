ID: GPT-018-ROLE-03
Estado: Auditoría parcial documentada; inventario Edition pendiente de evidencia compartida.
Decisión requerida: Johandry debe enriquecer fotografía/guía y decidir si los agotados representan archivo editorial o selección comprable.
Resumen en 5 líneas:
1. Se inspeccionan artefactos actuales del comprador sin abrir sesiones de tienda adicionales.
2. Structured Tote negro coincide hoy con Black box calf: el defecto histórico de foto marrón no continúa demostrado.
3. Serra Coat muestra espalda y no presenta guía de talla en el texto/captura; limita decidir una compra de $1,890.
4. Archive repite una pieza agotada en dos módulos de home; es una oportunidad editorial, no bloqueo de compra.
5. La procedencia prometida no tiene respaldo visible en la PDP muestreada; no se afirma que sea falsa.
Archivos tocados: agent-comms/outbox-gpt/role-03-merch.md; harness-GPT-018/role-03-merch/.
Desviaciones (Nivel 1 o Nivel 2): Ninguna; cero código/BOARD/datos de tienda modificados.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): Los comandos y salidas se detallan abajo. No se cierra fila alguna de requirements-ledger.
Lista de afirmaciones falsables numeradas:
1. edition-pdp.json URL structured-tote/status200/text muestra $680, Black box calf, Standard; captura edition-pdp-desktop.png muestra tote negro.
2. atelier-pdp.json URL serra-coat/status200/text muestra $1,890 y tallas36/38/40/42; captura muestra espalda.
3. archive-home.json/text incluye SOLD OUT en Spotlight y producto destacado para chaqueta1990.
4. archive-pdp.json/text no identifica maker, aunque archive-home.json promete Named and catalogued with every object.

## Plan y método
Leer brief/reglas y contexto, extraer texto compartido, inspeccionar capturas actuales, contrastar source permitido para distinguir configuración/código, redactar candidatos y refutaciones. No se navega para respetar reserva exclusiva del comprador. Evidencia de ejecución ajena: runtime-partial.md registra `node --loader ./agent-comms/outbox-gpt/harness-GPT-018/role-01-buyer/loader.mjs agent-comms/outbox-gpt/harness-GPT-018/role-01-buyer/probe.mjs` → exit0, viewports1440×1000/390×844.

## Candidatos actuales
| ID | Prioridad / clase / dueño | Observación y evidencia | Acción exacta / refutación |
|---|---|---|---|
| M03-01 | P2 contenido + configuración / Johandry | Serra Coat $1,890: foto principal vista posterior, sin frente/detalle visible ni control guía de talla en captura completa y text capturado. `role-01-buyer/atelier-pdp-desktop.png`, `atelier-pdp.json:4`, https://sartorial-atelier.myshopify.com/products/serra-coat | Admin > Products > Serra Coat > Media: incorporar frontal y detalle de tejido/cierre; en Online Store > Themes > Customize > Products > plantilla asignada > Product information > Add block > Size guide: publicar tabla de medidas real cm/in o página. Source ya admite bloque (`sections/main-product.liquid:272,923`); NO parche. Refutación: acordeones Composition/Shipping cerrados podrían contener medidas; no se inspeccionó contenido expandido, no se afirma ausencia absoluta en todo sitio. Confirmado solo que no existe una guía visible por nombre ni foto frontal en muestra. |
| M03-02 | P2 configuración editorial / Johandry | Chaqueta1990 SOLD OUT ocupa Spotlight y featured de Archive. `archive-home.json:4`; PDP agotada `archive-pdp.json:4`; https://sartorial-archive.myshopify.com/ | Customize > Home page > bloque Spotlight/Featured product: sustituir selección por 1999 Technical Cotton Trench u otra pieza disponible, después verificar disponibilidad. Si intención es archivo de vendidos, mantener pieza con CTA editorial hacia catálogo disponible y explicación. Refutación: vender pieza única y conservar vendidos es coherente con Archive; NO P0 ni defecto del tema ni obligación de ocultar agotados. |
| M03-03 | P2 contenido/confianza / Johandry | Home promete maker nombrado y certificado museum-grade; PDP chaqueta1990 solo record AR-1990-01, sin maker ni ejemplo de certificado visible en text/captura. `archive-home.json:4`, `archive-pdp.json:4` | Products > 1990… > Description: añadir ficha de atribución documentada, fecha/rango, condición/restauraciones y qué documento recibe cliente; usar metafields enlazados solo si ya aprobados. Si no hay respaldo, corregir promesa home en Customize. Refutación: documento físico/admin no inspeccionados; falta de respaldo visible NO demuestra falsedad ni falta de derechos. |

## Alt text: conclusiones limitadas
`rg -n 'alt|media-alt|responsive-image' snippets/product-media.liquid snippets/media-alt.liquid snippets/responsive-image.liquid` → product-media11 capture media_alt,21 alt:media_alt; media-alt12–17 utiliza alt proporcionado, o título y posición, o título para imagen única. `rg -n 'alt:' snippets/product-card.liquid sections/main-product.liquid` → card139 título,147 secondary_image.alt; product160 alt:'' en thumbnail dentro de botón con aria-label en149. No declarar imágenes de producto sin alternativa por ver un alt vacío en thumbnails: esos botones ya tienen nombre. `responsive-image.liquid:20` usa `alt | default: image.alt`, por lo que alt:'' no garantiza vacío si image.alt existe; eventual duplicación de anuncios corresponde a rol9 y requiere ejecución, no se parchea aquí. El título como fallback es utilizable pero menos descriptivo que material/color/ángulo; rellenar alt en Admin > Products > Media > imagen > Add alt text, por ejemplo “Structured calfskin tote, black, front three-quarter view”. No inventar color o procedencia.

## Refutaciones explícitas y límites
- Se descarta tote marrón con Black box calf de GPT016: captura actual negro.
- No replicar como vigente 10/13 fotos incongruentes o variantes sin imagen: falta aún inventario actual Edition. Informes históricos son hipótesis de retest.
- Bloques grises de recomendaciones en capturas no prueban imagen rota: probable lazyload fuera de viewport; se necesita scroll/decode.
- No afirmar desk-and-study404 vigente sin petición actual; GPT016 registró404, no esta sesión.
- No se verifica precio comercial de mercado ni atributos materiales verdaderos a partir de copy.
- No se asigna P0 a pieza única agotada.
- No se verificó catálogo completo/alt de todos los productos, colecciones o variantes, ni prueba de selección de acabado actual.

## Comandos de trazabilidad
`git status --short` → únicamente salidas GPT018 de otros agentes sin modificaciones del tema; advertencia permiso ignore. `rg -n 'size_guide|page_content|size_table' templates/product.json` → sin coincidencias (no prueba plantilla instalada). `rg -n 'assign image_alt|media.alt|product.title' snippets/media-alt.liquid snippets/responsive-image.liquid` → media-alt12,13,15,17; responsive-image20. `view_image` de atelier/edition PDP desktop inspeccionado directamente. Hallazgos en espera de verificación adversarial; cero parches de código justificables con esta muestra.

## Actualización: inventario completo actual (evidencia compartida)
Se procesaron los tres `role-01-buyer/*-products.json` sin tráfico adicional. Comando PowerShell: leer JSON con ConvertFrom-Json; para cada producto contar images, para cada variante featured_image/available, volcar handle/options/precios/media. Salida literal resumen:
```
atelier products=24 variants=87 variants_featured_image=0 single_image=24 no_available=0
edition products=13 variants=38 variants_featured_image=0 single_image=13 no_available=0
archive products=12 variants=12 variants_featured_image=0 single_image=12 no_available=1
```
Resultado completo en `harness-GPT-018/role-03-merch/catalog-inventory.txt`. Se verifican 49 productos con una sola imagen cada uno. Para Atelier/Archive, imagen por talla no es una necesidad comercial automática; para Edition sí existen acabados visualmente distintos.

**M03-04 — P1 contenido/configuración, dueño Johandry: Edition no acredita visualmente sus acabados.** Cada uno de los13 productos tiene1 imagen y todas las38 variantes featured_image:null. Todas las images.variant_ids son vacías. Por tanto no hay medios de variante registrados en este endpoint; no confundir con fallo de JS. Tote posee6 variantes (Black box calf/Saddle tan/Deep olive × Standard/Compact), $680Standard/$580Compact. No hay evidencia suficiente para declarar que la foto coincide con todos los colores/tamaños; foto negra inicial sí coincide. Refutación posible: cambio de color por mecanismo externo/custom JS no se ha probado; aun así catálogo tiene solo1 foto, por lo que no ofrece cobertura fotográfica distinta. Admin > Products > [cada handle en inventario] > Media: subir fotos correctas por acabado; Variants > seleccionar todas las variantes de mismo acabado > asignar la imagen coincidente (ambos tamaños cuando aplicable); guardar; comprobar cada chip desktop/móvil. Aplicar arte entregado por rol4, sin regenerar objeto diferente por color.

Mapa exacto Edition para rol4/admin (el inventario entrega también precios y filename):
- single-pen-sleeve, slim-bifold-wallet, leather-document-folio: Black box calf / Saddle tan.
- milled-brass-paperweight: Natural brass / Dark patina.
- folded-valet-tray, leather-key-loop: Black / Saddle tan / Deep olive.
- leather-desk-mat: Black / Dark umber × Large / Compact.
- four-slot-cardholder, east-west-shoulder-bag: Black box calf / Oxblood / Saddle tan.
- zip-travel-pouch: Black grained calf / Saddle tan / Deep olive.
- padded-laptop-sleeve: Black grained calf / Dark umber.
- compact-crossbody: Black grained calf / Stone / Deep olive.
- structured-tote: Black box calf / Saddle tan / Deep olive × Standard / Compact.

**M03-05 — P2 contenido, dueño Johandry: las tres demos no muestran galerías multiperspectiva.** Una imagen por49/49 productos demuestra ausencia de vistas adicionales en catálogo consultado. Es especialmente débil para Archive: condición/restauración de piezas de$450–$2,800 no se puede inspeccionar con detalle. Admin > Products > Media: añadir frente/espalda/detalle relevante y, para vintage, desgaste/restauración real. No exigir foto por talla ni afirmar defecto del componente gallery; código ya itera product.media.

**Refutaciones nuevas:** los filenames Edition actuales son nombres de producto propios a2000×2500 (muestra JSON Pen Sleeve), no los Unsplash incongruentes de GPT016. Los filenames Archive también son propios actuales, no nove-blazer reutilizado. El nombre de archivo NO demuestra correspondencia visual/derechos, pero invalida citar la URL antigua como prueba actual. No se inspeccionaron visualmente las49 imágenes; no afirmar que todas las fotos ya son correctas ni que10 sigan mal. Este endpoint omite alt en cada image; NO inferir alt vacío del JSON. Solo Archive chaqueta1990 está no disponible; las otras11 piezas sí tienen variante disponible. Esto sostiene refutación de P0 por agotado.

Estado final: auditoría de inventario completada con límites visuales/colecciones explícitos; candidatos pendientes adversarial. Cero parches: todos los confirmables de este rol se resuelven en catálogo/configuración/contenido. Ledger sin modificaciones/cierres.
