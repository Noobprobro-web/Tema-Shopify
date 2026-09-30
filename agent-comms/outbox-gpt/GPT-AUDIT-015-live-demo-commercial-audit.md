# GPT-AUDIT-015 — Auditoría comercial de las tres demos en vivo

ID: GPT-AUDIT-015
Estado: NO APTO para submission al 30 de septiembre de 2026
Decisión requerida: Johandry debe habilitar pagos de prueba en las tres demos y publicar documentación y soporte. Gemini debe coordinar la corrección del contenido comercial observado y revalidar antes de autorizar el envío.
Resumen en 5 líneas:
1. Los tres presets tienen dirección de arte distinguible y se ven bien en escritorio y a 390 px.
2. Los tres checkouts muestran `This store can’t accept payments right now` y `Pay now` deshabilitado.
3. Las URL de documentación y soporte configuradas en el tema devuelven 404.
4. Edition presenta fotos que no corresponden a productos; Archive reutiliza imágenes de Atelier para piezas históricas únicas.
5. Las interacciones de carrito, bundle, variante y Quick Buy probadas funcionan, pero no compensan los bloqueos de demo y contenido.
Archivos tocados: solo este informe. No se editó `GPT-AUDIT-014-final-presets-certification.md`, que estaba vacío en disco y había producido un conflicto de guardado en VS Code.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación.
Hallazgos extra fuera de alcance (con parche listo): no se preparó parche de código; los problemas principales requieren configuración de Shopify, contenido y derechos de imagen.
Verificación (comando, resultado y qué demuestra/qué no): ver sección 5. Se inspeccionaron storefronts reales en Chrome a 1520 px y 390 px. No se completó una compra ni se midió Lighthouse.
Lista de afirmaciones falsables numeradas: ver hallazgos H1–H8.

## 1. Resumen ejecutivo y veredicto comercial

**NO APTO para publicación hoy.** La dirección de arte supera el umbral de una demo genérica: Atelier construye una campaña de sastrería, Edition usa una composición de objetos y Archive usa una gramática de catálogo y procedencia. Las tres se distinguen al primer vistazo. Sin embargo, la experiencia de compra se detiene en checkout en las tres tiendas. Shopify exige que cada demo tenga Bogus Gateway o Shopify Payments en modo de prueba y que las páginas usen contenido realista con imágenes profesionales, texto auténtico y derechos de uso. También exige documentación del tema y un formulario público de soporte listos antes del lanzamiento. [Requisitos oficiales de Shopify](https://shopify.dev/docs/storefronts/themes/store/requirements), [rechazos comunes](https://shopify.dev/docs/storefronts/themes/store/review-process/common-theme-rejections).

Esto es un dictamen comercial y de storefront sobre las rutas probadas, no una certificación técnica de todo el paquete. No se comprobaron el tipo de tienda Client Transfer, licencias, instalabilidad del preset, Lighthouse, accesibilidad formal ni métodos de pago desde Admin. Ningún requisito del ledger se cierra con este informe. La fila 107 continúa `no verificado`; la evidencia en vivo de pagos y contenido cuestiona el cierre de la fila 108 y debe revisarla Gemini.

## 2. Evaluación por tienda

### Sartorial Atelier

**Fortalezas.** Hero fotográfico y tipografía con buena escala; el lookbook con puntos de descubrimiento y la cápsula `Complete the look` dan una ruta clara desde inspiración a compra. El bundle de Nove Blazer ($1,150), Silk Charmeuse Blouse ($520) y Pleated Wide Trouser ($580) añadió tres líneas y mostró subtotal **$2,250 USD** tanto en drawer como en carrito. El diseño móvil de inicio y PDP mantiene la jerarquía sin desbordamiento horizontal visible a 390 px.

**Debilidades.** Las PDP muestreadas de [Nove Blazer](https://sartorial-atelier.myshopify.com/products/nove-blazer) y [Pleated Wide Trouser](https://sartorial-atelier.myshopify.com/products/pleated-wide-trouser) no ofrecen talla ni guía de tallas, aunque la cápsula promete seleccionar el tamaño de cada pieza. En ambas hay una sola imagen. El storefront está en inglés, pero las descripciones de estas prendas y del Serra Coat están en español. El CTA `Explore lookbook` del hero lleva a una colección, no a la sección de lookbook. El pie solo ofrece `Search` como navegación, sin acceso visible a políticas, contacto ni historia de la marca.

**Oportunidad.** Dar a la ropa tallas reales y una guía de medidas, añadir vistas de espalda/detalle y traducir el copy de producto al idioma activo. Conservar la cápsula, que ya demuestra valor comercial.

En la colección New Forms, las tarjetas permiten `Add to cart`. En el carrito completo probado no apareció campo de nota de pedido; confirmar si el ajuste está desactivado intencionalmente para estas demos.

### Sartorial Edition

**Fortalezas.** El split hero, la retícula Bento y la tipografía sans diferencian bien el concepto de objetos. En [Structured Tote](https://sartorial-edition.myshopify.com/products/structured-tote), pasar de Standard a Compact actualizó el precio de **$680 a $580** y anunció la variante. Quick Buy de Milled Brass Paperweight abrió selección de acabado y añadió una unidad al drawer. El set de tres objetos añadió **$620**; junto al paperweight previo, el subtotal observado fue **$730 USD**, correcto. `Buy it now` llegó a checkout con la variante Black box calf / Standard y total $680.

**Debilidades.** La página [Daily Objects](https://sartorial-edition.myshopify.com/collections/daily-objects) muestra discrepancias directas entre etiqueta y fotografía: Milled Brass Paperweight aparece con una pintura de retrato, Folded Valet Tray con una persona sosteniendo una carpeta naranja, Leather Key Loop con un vestido plateado y Four-Slot Cardholder con un portátil. Más abajo, Compact Crossbody muestra un bolso con un logotipo de Gucci visible. No se comprobó si existe permiso de uso; debe retirarse o documentarse antes de submission. La PDP del tote muestra un bolso marrón mientras `Black box calf` está seleccionado. La cápsula sí vende productos reales, pero esa falta de correspondencia visual erosiona la confianza antes de llegar al carrito.

**Oportunidad.** Sustituir las fotografías incorrectas por imágenes propias o con licencia comprobada, asociar imágenes de variante fieles a cada acabado y volver a probar las tarjetas y el checkout.

En Daily Objects, `Quick add` abrió un selector de acabado antes de añadir el producto. El carrito conservó la variante elegida; el flujo transaccional es correcto hasta checkout.

### Sartorial Archive

**Fortalezas.** La puesta en escena de museo, la paleta oscura y el lenguaje de inventario forman la personalidad más singular. La cápsula comercial está oculta y la home no deja un hueco vacío. La PDP de [1990 Pinstripe Double-Breasted Jacket](https://sartorial-archive.myshopify.com/products/1990-pinstripe-double-breasted-jacket) presenta condición, talla e indicador `Low stock: 1 left`; Shopify limitó a una unidad real en carrito y el subtotal fue **$1,500 USD**.

**Debilidades.** La foto de esa chaqueta tiene el mismo recurso `nove-blazer-01.jpg` que el Nove Blazer contemporáneo de Atelier. También se observó `doppio-trench-01.jpg` para el trench de 1999, `bias-cut-slip-dress-01.jpg` para el slip de 1998 y `cropped-tailored-jacket-01.jpg` para la chaqueta de 1996. Esta reutilización contradice el relato de piezas históricas 1 de 1, aunque no prueba por sí sola una infracción de derechos. La PDP permitió subir la cantidad a 2 y mostró total **$3,000** pese al mensaje `1 left`; al añadir, el servidor redujo el pedido a una unidad y mostró un aviso. Es una fricción evitable. La home menciona citas privadas en Kyoto y París; la página de contacto muestra showroom en Milán. El footer repite el copy genérico de las otras demos.

**Oportunidad.** Fotografiar o licenciar imágenes que representen cada pieza archivada, mantener coherente su historia y bloquear en la PDP la cantidad superior al inventario disponible.

En Permanent Archive, las tarjetas ofrecen `Choose options` en vez de agregar ciegamente piezas 1 de 1. Esa decisión de interacción es adecuada para el concepto.

## 3. Comparación con Contour, Maison y Annex

Comparación cualitativa de las páginas de inicio renderizadas en escritorio y móvil y sus estructuras de navegación. No son puntuaciones Lighthouse ni una evaluación de calidad legal de las demos competidoras.

| Demo | Originalidad | Pulido visual observado | Conversión observada | Navegación observada |
|---|---|---|---|---|
| **Sartorial Atelier** | Alta: campaña, lookbook y cápsula | Alta en home; baja por descripciones mixtas y PDP de una imagen | Bundle probado y correcto; falta talla en ropa | Home/Catalog/Contact; footer solo Search |
| **Sartorial Edition** | Alta: retícula Bento y lenguaje industrial | Alta en hero; baja en tarjetas con fotos erróneas | Variante, Quick Buy y set funcionan; imágenes frenan confianza | Misma estructura corta que Atelier |
| **Sartorial Archive** | Alta: relato museístico y colección acotada | Alta en hero; baja en consistencia de piezas 1 de 1 | Indicador de stock y carrito funcionan; cantidad 2 crea expectativa falsa | Misma estructura corta; datos de citas inconsistentes |
| [Contour](https://contour-ho5kbo9x.myshopify.com/) | Media-alta: hogar editorial | Fotografía, tipografía y espaciamiento sólidos | Descubrimiento por ambientes y productos visibles | Menú lateral con colecciones, About us y Contact; políticas en footer |
| [Maison](https://maison-10oym9w0.myshopify.com/) | Media-alta: cerámica de taller | Escena y copy de proceso coherentes | Categorías claras y producto destacado | Menú lateral con subcolecciones, About us y Contact |
| [Annex](https://annex-r0zzjfjf.myshopify.com/) | Alta: arte y ediciones | Hero y ritmo editorial fuertes | Rutas por ediciones, originales y fotografía | Menú lateral profundo y About us/Contact |

Sartorial compite en identidad visual de portada. Los benchmarks ofrecen rutas de información más claras, en particular About us, subcolecciones y políticas. La ventaja visual de Sartorial no compensa sus fotografías de catálogo y los bloqueos de checkout. Contour también mostró copy genérico en el footer; se usa como referencia de estructura, no como prueba de perfección.

## 4. Riesgos y ajustes prioritarios

| ID | Prioridad | Evidencia en vivo | Acción antes de enviar |
|---|---|---|---|
| H1 | **P0 — bloqueo formal** | Checkout de las tres demos: `This store can’t accept payments right now`; `Pay now` deshabilitado. Totales vistos: Atelier $2,250, Edition $680, Archive $1,500. | Activar Bogus Gateway o Shopify Payments test mode en cada tienda, desactivar otras opciones y probar un pedido de prueba completo en cada una. |
| H2 | **P0 — bloqueo formal** | `config/settings_schema.json:7-8` declara `https://ruizdigital.com/themes/sartorial/docs` y `/support`; ambos renderizan `No encontrada (404)`. | Publicar documentación real y formulario público de soporte y verificar ambas URL desde fuera del equipo. |
| H3 | **P0 — demo incompleta** | Cuatro tarjetas de Daily Objects tienen foto y nombre incongruentes; una imagen incluye un logotipo de otra marca. | Corregir las imágenes de todo el catálogo Edition y registrar autorización de uso de cada recurso. |
| H4 | **P0 — credibilidad de demo** | Archive utiliza ficheros de imagen de productos contemporáneos de Atelier para objetos fechados entre 1990 y 1999. | Sustituir por imágenes individualizadas y revisar nombres, fecha, procedencia y derechos de uso. |
| H5 | **P1 — conversión** | Nove Blazer y Pleated Wide Trouser carecen de talla y guía; la cápsula promete selección de tamaño. | Crear variantes/tallas realistas o corregir la promesa de la cápsula y mostrar guía de medidas. |
| H6 | **P1 — coherencia transaccional** | Archive permite cantidad 2 con `Low stock: 1 left`; Shopify solo añade una unidad. | Limitar selector y total mostrado al stock vendible; comprobar agotado y 1 de 1. |
| H7 | **P1 — confianza y localización** | Descripciones de Atelier en español dentro de storefront inglés; footer de las tres demos solo enlaza Search. | Traducir producto al idioma activo y configurar menú de footer con contacto, políticas y marca. |
| H8 | **P2 — consistencia de relato** | Home Archive menciona citas en Kyoto y París; contacto ofrece showroom en Milán. | Alinear ubicaciones, horarios y promesas de servicio con la operación real. |

## 5. Evidencia y límites de verificación

- **Navegador real:** Chrome con storefronts en escritorio (viewport observado 1520 px) y simulación de 390 × 844 px. Se revisaron home, colecciones, tres PDP, carrito y checkout. A 390 px, el DOM informó `innerWidth: 390` y `document.documentElement.scrollWidth: 375` en las tres PDP probadas; eso descarta desbordamiento horizontal en esas páginas, no en todo el sitio.
- **Interacciones probadas:** cambio Standard → Compact del tote ($680 → $580); Quick Buy de paperweight; cápsula Atelier (tres líneas, $2,250); set Edition ($620 añadido al paperweight de $110, subtotal $730); pieza Archive (cantidad solicitada 2, una agregada); `Buy it now` Edition hasta checkout. No se pagó ni se enviaron formularios.
- **Salida literal de checkout (las tres):** `This store can’t accept payments right now.` y `Pay now [disabled]`.
- **Salida literal de soporte:** ambas páginas `https://ruizdigital.com/themes/sartorial/docs` y `/support`: `No encontrada (404)`.
- **Comando local:** `rg -n 'theme_documentation_url|theme_support_url' config/settings_schema.json` → líneas 7 y 8 con las dos URL anteriores. `rg -n -i 'documentation|support' docs/requirements-ledger.md` → línea 107: fila `theme_info Comercial y Soporte Real`, estado `no verificado`.
- **No verificado:** cobertura de todos los enlaces, licencias y propiedad de imágenes, catálogo completo producto por producto, stock real desde Admin, métodos de pago configurados desde Admin, responsive en otros navegadores, accesibilidad formal, Lighthouse y paridad entre instalación de preset y demo. La revisión oficial podría identificar otros defectos.

