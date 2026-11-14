ID: GPT-AUDIT-THREE-THEMES-VISUAL-001
Estado: Complemento visual realizado sobre las superficies y estados de navegador indicados; no certifica Theme Store ni paridad entre Git y despliegue.
Decisión requerida: Johandry debe priorizar las correcciones de contenido y decidir qué identidad de LINEA NOVE constituye la demo canónica antes de comparar presets o presentar una demo final.
Resumen en 5 líneas:
1. Se observaron seis URLs en Chrome, con Home, una colección y un PDP por URL, en escritorio y disposición móvil.
2. Edition y Atelier muestran placeholders SVG confirmados en el DOM; LINEA NOVE también los muestra en el estado final, cuya identidad de preview cambió durante la sesión.
3. Contour, Maison y Annex muestran propuestas sectoriales diferenciadas; comparten una estructura editorial reconocible y presentan ambigüedades de contenido concretas.
4. Las seis colecciones móviles muestreadas retrasan la entrada al producto con filtros extensos y cabeceras; no se midió abandono ni conversión.
5. Este complemento incorpora la observación visual que faltaba en el maestro anterior, preserva ese archivo y mantiene pendientes las categorías no probadas.
Archivos tocados: Solo agent-comms/outbox-gpt/GPT-AUDIT-THREE-THEMES-VISUAL-001.md, archivo nuevo.
Desviaciones (Nivel 1 o Nivel 2): Ninguna modificación de implementación; auditoría documental solicitada por el usuario.
Hallazgos extra fuera de alcance (con parche listo): No se prepararon parches. La causa en código y la configuración del comerciante no se inspeccionaron.
Verificación (comando, resultado y qué demuestra/qué no): Preflight local con git status --short, git rev-parse HEAD, git branch --show-current y Test-Path del destino. Lecturas de AGENTS.md, BOARD.md y RULES.md. Las observaciones de storefront proceden de los informes de dos subagentes que usaron DOM y capturas de sesión en Chrome; no hay capturas archivadas, hashes de assets, pull remoto ni vínculo commit-despliegue.
Lista de afirmaciones falsables numeradas:
1. En Edition se observaron cuatro SVG homepage-placeholder; en Atelier, cinco; en LINEA NOVE, cuatro en el preview final.
2. En las seis colecciones muestreadas, el contenido anterior al producto y los filtros extensos retrasaron la aparición de productos en móvil.
3. Contour publicó dos juegos distintos de medidas/plazos para Cloud Linen Sofa entre Home y PDP.
4. Maison mostró SOLD OUT en un enlace editorial a Iron Black Ramen Bowl y Add to cart habilitado en su PDP; no se comprobó el inventario real.
5. LINEA NOVE mostró dos nombres distintos de preview durante la auditoría; ninguno demuestra un SHA de despliegue.
6. No se probaron carrito, checkout, rendimiento, conformidad WCAG, editor ni los cinco estados límite.

# Alcance y rectificación del componente visual

Este documento complementa GPT-AUDIT-THREE-THEMES-MASTER-001.md. Según el alcance comunicado por la coordinación, el maestro anterior no incluía observación visual de estos storefronts. Esa ausencia de evidencia no podía describir la calidad visual de las seis URLs. Ahora se dispone de una muestra visual real en Chrome para Home, colección y PDP, en los tamaños documentados.

La corrección metodológica es concreta: esas superficies pasan de no observadas a observadas en las sesiones indicadas. Esto no convierte las categorías de accesibilidad, rendimiento, comportamiento comercial, editor o identidad del despliegue en verificadas. Tampoco se sustituye el maestro anterior ni se emite una nueva puntuación global. El maestro de Claude no fue abierto ni utilizado en esta redacción.

Se mantienen separados tres niveles:
- Observado en tienda: texto, imágenes, composición, controles visibles y estados muestreados de Chrome.
- Interpretación de UX/comercio: posible efecto sobre claridad, confianza o descubrimiento, sin medición de conversión.
- No verificado: causa técnica, dato comercial correcto, disponibilidad de backend, configuración del editor y commit realmente desplegado.

# Método, agentes, fechas y evidencia

| Frente | Modelo reportado por coordinación | Herramienta | Ventana de observación registrada |
|---|---|---|---|
| Contour / Maison / Annex | GPT-6.1 Sol, razonamiento high | Chrome del usuario mediante extensión, DOM y capturas de sesión | 28-10-2026, 18:27–18:34 UTC; 14:27–14:34 Caracas |
| Edition / Atelier / LINEA NOVE | GPT-6 Astra, razonamiento high | Chrome del usuario mediante extensión, DOM y capturas de sesión | Última comprobación: 29-10-2026, 01:12:26–01:14:08 UTC; 28-10-2026, 21:12:26–21:14:08 Caracas. Las primeras observaciones no tienen hora individual recuperada. |
| Revalidación puntual de LINEA NOVE | GPT-6.1 Terra, verificación independiente reportada por coordinación | Chrome del usuario | 29-10-2026, 01:16 UTC; 28-10-2026, 21:16 Caracas. URL raíz sin parámetros: título LINEA NOVE y Preview Bar Sartorial 09f8342 submission, Draft. |

La redacción integra los informes remitidos por esos observadores. El redactor no repitió la navegación ni atribuye a una revisión de código los hallazgos visuales. La separación de los dos frentes evita duplicar la inspección principal; esta síntesis no constituye una tercera verificación independiente.

Tamaños:
- Escritorio: 1427 × 732 CSS px en el frente Contour/Maison/Annex; DPR 1,25 reportado en ese frente.
- Escritorio: 1427 × 732 CSS px en Edition, Atelier y las primeras páginas de LINEA NOVE. En las comprobaciones finales de Home y colección de LINEA NOVE: 1536 × 674 CSS px.
- Móvil simulado: 390 × 844 CSS px. innerWidth/innerHeight se comprobaron en Annex y en el frente Edition/Atelier/LINEA NOVE. En Contour y Maison la captura y el árbol mostraron disposición móvil, pero no se conserva una comprobación DOM individual de esas dimensiones.
- Los primeros intentos fallidos de cambiar viewport en el segundo frente se descartaron; las conclusiones móviles proceden del tamaño finalmente confirmado. No se utilizó un teléfono físico. Se restableció el viewport al terminar.
- La barra de preview de Shopify ocupaba parte del área visible en el frente Sartorial; debe tenerse en cuenta al comparar la primera pantalla.

Evidencia conservada: narración de observaciones, URLs, rutas, pasos y valores trasladados desde las sesiones. Los agentes vieron capturas y DOM, pero no guardaron capturas, HTML, video, trazas de red ni hashes en disco. Por tanto, las reproducciones permiten contrastar el estado futuro; no reconstruyen de forma independiente todos los píxeles del momento observado. No se fabrican anexos ni certificaciones a partir de esta limitación.

# Seis URLs e identidad observada

| URL de entrada | Identidad visible y alcance de la atribución |
|---|---|
| https://sartorial-edition.myshopify.com/ | Edition; preview Edition, Password protected; enlace de editor con tema 188655599784. La sesión Chrome permitía ver la tienda; no se abrió el editor ni se introdujeron secretos en el informe. |
| https://sartorial-atelier.myshopify.com/ | Atelier como propuesta comercial; preview Sartorial, Password protected; enlace de editor con tema 188743188704. El nombre visible no demuestra un commit. |
| https://tema-qkqpke0j.myshopify.com/ | LINEA NOVE visible. Preview inicial de escritorio: Sartorial v1.0.0 integrado. Preview móvil y escritorio final: Sartorial 09f8342 submission, Draft. El cambio no fue provocado por una acción del agente; su causa no se confirmó. No se identifica como Archive. |
| https://contour-ho5kbo9x.myshopify.com/ | Contour, propuesta de mobiliario visible. No se verificó el vínculo con SHA, ZIP o repositorio. |
| https://maison-10oym9w0.myshopify.com/ | Maison, propuesta de cerámica y mesa visible. No se verificó el vínculo con SHA, ZIP o repositorio. |
| https://annex-r0zzjfjf.myshopify.com/ | Annex, propuesta de arte y ediciones visible. No se verificó el vínculo con SHA, ZIP o repositorio. |

La revalidación independiente de las 01:16 UTC confirmó LINEA NOVE y el preview Sartorial 09f8342 submission, Draft al abrir la raíz sin parámetros. Esto refuerza el estado final observado; una URL sin query no identifica por sí sola el tema MAIN, un ID ni un SHA. No explica el cambio desde el preview inicial.

No es válido afirmar que las tres primeras URLs demuestran tres presets Sartorial distintos y estables. La tercera URL presenta una identidad de preview cambiante y un catálogo distinto. Tampoco un nombre que contiene 09f8342 demuestra que ese SHA esté desplegado.

Preflight local del redactor: rama sprint/F0; HEAD b45e913111e333b9a0e82938266189fc76c87057. Es la identidad del checkout documental, no de ninguna de las seis tiendas.

# Matriz de cobertura por página y viewport

En cada fila se visitaron Home, la colección especificada y el PDP especificado. Se observaron las tres en escritorio y disposición móvil, sin afirmar prueba funcional completa.

| Identidad | Home | Colección muestreada | PDP muestreado | Escritorio / móvil | Particularidad de cobertura |
|---|---|---|---|---|---|
| Edition | https://sartorial-edition.myshopify.com/ | https://sartorial-edition.myshopify.com/collections/daily-objects | https://sartorial-edition.myshopify.com/products/leather-desk-mat | 1427×732 / 390×844 | DOM y capturas de sesión; barra preview visible. |
| Atelier | https://sartorial-atelier.myshopify.com/ | https://sartorial-atelier.myshopify.com/collections/all | https://sartorial-atelier.myshopify.com/products/bias-cut-slip-dress | 1427×732 / 390×844 | DOM y capturas; vestido con una imagen observada. |
| LINEA NOVE | https://tema-qkqpke0j.myshopify.com/ | https://tema-qkqpke0j.myshopify.com/collections/all | https://tema-qkqpke0j.myshopify.com/products/bias-cut-slip-dress | 1427×732 inicial; 1536×674 Home/colección final / 390×844 | Identidad de preview variable. La colección final mostró 32 productos y fixtures de QA. No unir los dos previews como una misma versión estable. |
| Contour | https://contour-ho5kbo9x.myshopify.com/ | https://contour-ho5kbo9x.myshopify.com/collections/all | https://contour-ho5kbo9x.myshopify.com/products/cloud-linen-sofa-3-seater | 1427×732 / disposición móvil reportada como 390×844 | 25 productos en la colección observada; dimensiones móviles no verificadas individualmente en DOM. |
| Maison | https://maison-10oym9w0.myshopify.com/ | https://maison-10oym9w0.myshopify.com/collections/tableware | https://maison-10oym9w0.myshopify.com/products/iron-black-ramen-bowl | 1427×732 / disposición móvil reportada como 390×844 | 9 productos; dimensiones móviles no verificadas individualmente en DOM. |
| Annex | https://annex-r0zzjfjf.myshopify.com/ | https://annex-r0zzjfjf.myshopify.com/collections/limited-editions | https://annex-r0zzjfjf.myshopify.com/products/over-the-shoulder-line-drawing | 1427×732 / 390×844 confirmado en DOM | 8 productos; se observó la colección también después de plegar filtros. |

Esta es una muestra de 18 páginas en dos disposiciones, con cambios de ancho de escritorio indicados. No equivale a 36 pruebas automatizadas, estados completos por página o cobertura de todos los presets. No se inventa un conteo de tests aprobados.

# Fortalezas observadas y diferenciación

| Identidad | Fortaleza visual/comercial de la muestra | Límite |
|---|---|---|
| Edition | Hero dividido ordenado, fotografía de catálogo coherente y acabados de PDP bien presentados. El sistema tipográfico y de espaciado comunica precisión. | Parte de la narrativa técnica de Home no conecta claramente con los objetos seleccionados; cuatro módulos conservan placeholders. |
| Atelier | Fotografía de catálogo armónica y redacción de vestimenta alineada con la propuesta. Home y CTA se adaptan visualmente al móvil; contraste aparente favorable. | No se midió contraste WCAG; cinco SVG de Home y la escasez de vistas del vestido limitan la demostración comercial. |
| LINEA NOVE | Tipografía, ritmo y CTA móviles coherentes en los estados observados. En la muestra móvil, botones de PDP de 335×44 CSS px y sin overflow visible. | No certifica WCAG ni el sitio completo; preview variable, mezcla de QA y contenido de Home similar a Atelier impiden presentarlo como preset comercial independiente verificado. |
| Contour | Comparación de asientos, información de medidas, reparabilidad y narrativa de mobiliario ayudan a imaginar el producto en un espacio. PDP visual con fotografía y contenido de decisión. | Dos juegos de medidas/plazos del sofá reducen la utilidad de esa información hasta reconciliarlos. |
| Maison | Glazes, composición de sets e historia del proceso dan una lógica de compra de cerámica. El kiln log aporta un relato propio de taller. | La relación entre estado de hornada y disponibilidad del producto necesita una explicación inequívoca. |
| Annex | Presentación de galería, visualización de marcos y pared, referencias de escala y presupuesto aportan herramientas pertinentes para comprar arte. | No se validó el funcionamiento completo de los configuradores; el título largo y el alcance editorial de la reimpresión requieren revisión. |

Contour, Maison y Annex comparten sidebar, tipografía serif, protagonismo fotográfico y microtipografía. La diferencia observada excede un cambio de paleta: cada uno incorpora contenido y módulos propios de mobiliario, cerámica o arte. Esto respalda diferenciación sectorial en las páginas observadas, sin probar originalidad de código o exclusividad del diseño.

Edition, Atelier y LINEA NOVE comparten una gramática visual coherente. En los estados finales de LINEA NOVE, Home se parece a Atelier en redacción, módulos y placeholders. Esa semejanza se registra como observación del storefront; la identidad variable impide atribuirla definitivamente a un tercer preset.

# Hallazgos priorizados

Prioridad editorial: P1 = atender antes de presentar la URL como demo comercial terminada; P2 = claridad o fricción de compra que merece corrección; P3 = pulido. Estas prioridades no son una clasificación de vulnerabilidades ni un dictamen normativo Shopify. No se asigna P0 en esta muestra limitada.

## V-01 — Placeholders de Home en el frente Sartorial

- Prioridad/severidad: P1, alta para la preparación comercial de la demo.
- Estado: observado en DOM y captura de sesión; causa/configuración no verificadas.
- Superficies/condición: Home de Edition, Atelier y estado final de LINEA NOVE; se observaron SVG homepage-placeholder, no simples imágenes esperando cargar.
- Evidencia: Edition, cuatro, asociados a Engineered utility, precise discipline; Collection, product, process; The Complete Utility Rig; Form follows engineering tolerance. Atelier, cinco, en hero, lookbook, artesanía, Complete the look y A wardrobe, a room, a way of living. LINEA NOVE final, cuatro; no se recupera un mapeo individual que permita nombrar los cuatro módulos.
- Impacto: interrumpe la narrativa fotográfica y presenta la demo como incompleta. En Atelier, la imagen de artesanía con cámaras/mapas genéricos tampoco respalda claramente el relato de confección.
- Reproducción: abrir cada Home de la matriz, recorrer esos módulos y contrastar la imagen con su DOM SVG homepage-placeholder; en LINEA NOVE registrar primero el nombre del preview.
- Límite: no se confirma qué setting o asset debe corregirse ni se afirma que los ZIP originales contengan esos mismos SVG.
- Dueño propuesto: Johandry valida assets/contenido; Gemini identifica el despliegue; implementador autorizado aplica la corrección.

## V-02 — Descubrimiento de producto retrasado en las colecciones móviles

- Prioridad/severidad: P2, media; patrón transversal de UX.
- Estado: observado en las seis colecciones muestreadas; sin medición de conversión.
- Condición: abrir la colección en disposición móvil y mantener el estado inicial de filtros.
- Evidencia: Contour, Maison y Annex mostraron filtros inicialmente expandidos y cabecera espaciada, con productos debajo del primer viewport reportado de 390×844. Edition, Atelier y LINEA NOVE mostraron filtros extensos antes de los productos. En Annex, plegar los filtros no hizo aparecer los productos en el primer pantallazo; no se atribuye la altura residual a una causa no medida.
- Impacto: aumenta el desplazamiento necesario antes de evaluar el catálogo. En el frente Sartorial, la barra de preview reduce adicionalmente el espacio disponible.
- Reproducción: abrir cada URL de colección de la matriz en móvil desde el inicio, registrar cabecera/filtros y primera tarjeta; en Annex comparar también el estado plegado.
- Recomendación: estudiar una presentación de filtros y cabecera más compacta en móvil conservando acceso claro a ambos.
- Límite: no se aplicaron filtros ni se probó persistencia, foco o backend; no se declara que los productos sean inaccesibles.
- Dueño propuesto: Gemini y el implementador autorizado; Johandry valida la densidad comercial.

## V-03 — Medidas y plazo de Cloud Linen Sofa no coinciden entre Home y PDP

- Prioridad/severidad: P2, media con impacto en decisión de mobiliario.
- Estado: discrepancia textual observada; dato correcto no determinado.
- URL/superficies: Home de Contour, módulo Three ways to sit; PDP cloud-linen-sofa-3-seater, descripción y acordeón Dimensions & assembly.
- Evidencia: Home presenta 232×96 cm y entrega en 6 semanas. PDP presenta W220×D98×H82 cm y plazo de 6–8 semanas.
- Impacto: el comprador no dispone de una única referencia para encaje espacial y planificación de entrega.
- Reproducción: comparar el mismo sofá en Three ways to sit con su descripción y acordeón del PDP de la matriz.
- Límite: no se verificaron SKU, variante, ficha de fabricante ni lead time real; no se elige un dato como verdadero ni se atribuye un defecto técnico.
- Dueño propuesto: Johandry confirma medidas/plazo y su alcance por variante; implementador autorizado sincroniza las superficies.

## V-04 — Estado de hornada y compra de Iron Black Ramen Bowl ambiguos

- Prioridad/severidad: P2, media de claridad comercial.
- Estado: señales visibles distintas; disponibilidad real no comprobada.
- URL/superficies: Home de Maison, kiln log; PDP iron-black-ramen-bowl; colección tableware.
- Evidencia: el enlace editorial al producto muestra SOLD OUT; el PDP del mismo nombre muestra Add to cart habilitado; Tableware presenta 9 in stock y 0 out.
- Impacto: puede ser difícil distinguir una hornada histórica agotada de un producto actualmente comprable.
- Reproducción: localizar Iron Black Ramen Bowl en kiln log, seguir el enlace al PDP y comparar el estado; revisar la colección de la matriz.
- Límite: la indicación puede referirse a una hornada anterior. No se pulsó Add to cart, no se validó stock backend ni se concluye un fallo de inventario.
- Dueño propuesto: Johandry aclara el significado editorial; implementador autorizado explicita la relación hornada/producto.

## V-05 — Narrativa técnica y destinos de CTA poco conectados al catálogo Edition

- Prioridad/severidad: P2, media de relevancia y expectativa.
- Estado: texto, enlace y catálogo observados; autenticidad de características no auditada.
- URL/superficies: Edition Home, colección daily-objects y PDP leather-desk-mat.
- Evidencia: Home menciona aerospace hardware, weatherproof, 500D nylon, grade 5 titanium y MOLLE frente a objetos observados como desk mat, cardholder y brass paperweight. VIEW TECHNICAL SPECS enlaza a /collections/desk-and-study, una colección. La tarjeta naranja de daily-objects dice Toggle between compact 4-column matrix and detailed 2-column inspection view. Material composition del desk mat muestra Desk Objects, una categoría; su descripción habla de cuero y base de ante.
- Impacto: los claims generales carecen de una conexión clara con los objetos mostrados; el CTA prepara para especificaciones y conduce a un listado. La tarjeta naranja expone instrucciones de interfaz como contenido comercial y la composición del PDP no explica el material.
- Reproducción: recorrer las secciones técnicas de Home; comprobar el destino del CTA; abrir daily-objects y leather-desk-mat y leer sus textos.
- Límite: no se afirma que las características sean falsas ni se verificó su aplicabilidad SKU por SKU. No se atribuye la composición a una causa Liquid/metafield sin revisar código/configuración.
- Dueño propuesto: Johandry define narrativa y materiales; implementador autorizado alinea textos y destino.

## V-06 — LINEA NOVE no tiene una identidad de demo estable acreditada

- Prioridad/severidad: P1 de trazabilidad antes de presentar comparativa final; P2 de contenido de demo.
- Estado: dos nombres de preview y catálogo final observados; causa del cambio no confirmada.
- URL/superficies: tema-qkqpke0j.myshopify.com, Home/colección/PDP de la matriz.
- Evidencia: Sartorial v1.0.0 integrado en escritorio inicial; Sartorial 09f8342 submission, Draft en móvil y escritorio final. /collections/all final muestra 32 productos, incluidos fixtures F01–F06, F10 y F11. El vestido observado combina descripción en español con UI y lang=en.
- Impacto: no hay una base estable para atribuir toda la visita a un preset o paquete. Los fixtures y la mezcla de idioma no constituyen una demo comercial curada consistente.
- Reproducción: abrir la URL, registrar preview y estado Draft antes de cada página; recorrer /collections/all y el PDP del vestido.
- Límite: no se abrió editor ni se cambió tema. El nombre 09f8342 no prueba el commit; no se identifica LINEA NOVE como Archive. Las observaciones iniciales y finales deben conservar su contexto.
- Dueño propuesto: Gemini identifica el tema/estado canónico y verifica despliegue; Johandry selecciona catálogo e idioma de demo.

## V-07 — Cobertura fotográfica limitada del vestido en la muestra

- Prioridad/severidad: P2, media comercial de catálogo.
- Estado: una imagen observada en ambos PDP; no defecto general del componente.
- URL/superficies: bias-cut-slip-dress de Atelier y LINEA NOVE.
- Evidencia: vista posterior y Zoom image 1 of 1. En Atelier, $680 y tallas 34/36/38/40. En LINEA NOVE, $780 y sin selector de talla visible.
- Impacto: una sola vista posterior dificulta evaluar frente, caída y detalles de una prenda de ese precio.
- Reproducción: abrir cada PDP de la matriz y recorrer las imágenes disponibles/contador de zoom.
- Límite: los precios y los selectores pertenecen a catálogos distintos. La diferencia $680/$780 no demuestra un error; la ausencia del selector de talla en LINEA NOVE puede responder a configuración del producto. No se probó compra ni lógica de variantes.
- Dueño propuesto: Johandry aporta fotografía y define opciones del producto; implementador autorizado configura la presentación.

## V-08 — Footer genérico y densidad editorial secundaria

- Prioridad/severidad: P3, baja.
- Estado: observado visualmente en la muestra.
- URL/superficies: footer de Contour, Maison y Annex; PLP de ese frente; Home de Atelier.
- Evidencia: los tres footers mantienen Share your store’s story... y texto genérico. Se observó breadcrumb duplicado y cabecera muy amplia en el frente de esas PLP, sin registro suficiente para atribuir cada duplicado a las tres URLs individualmente. Atelier repite newsletter en Home y footer.
- Impacto: el contenido genérico reduce la sensación de marca terminada; cabecera/breadcrumb y newsletter pueden consumir espacio o repetir información.
- Reproducción: recorrer los footers y encabezados de colección indicados; comparar las dos invitaciones a newsletter de Atelier.
- Límite: duplicar newsletter puede ser intencional. No se midieron suscripciones ni se enviaron formularios.
- Dueño propuesto: Johandry valida contenido y repetición; implementador autorizado ajusta.

# Observaciones parciales que requieren revalidación

Estas observaciones no se elevan a fallos inequívocos:

| ID | Observación de sesión | Interpretación acotada / siguiente comprobación | Dueño propuesto |
|---|---|---|---|
| O-01 | En Annex, Home/tabs prometen no reimprimir en otro tamaño, mientras FAQ refiere no reimprimir a ese tamaño. | Hay una diferencia aparente de alcance editorial. Recuperar literalmente ambos textos y confirmar la política antes de concluir contradicción o incumplimiento. | Johandry y GPT al revalidar |
| O-02 | Alt de Maison describe white table, mientras la foto observada presenta fondo geométrico. | Revisar texto alternativo e intención de esa imagen; no constituye una auditoría de accesibilidad ni demuestra por sí solo incumplimiento. | Implementador autorizado y GPT |
| O-03 | Annex: título de PDP en cuatro líneas en escritorio y tres en móvil; opciones más abajo. | Revisar jerarquía y distancia al control de compra; el salto de línea no es un defecto por sí mismo. | Johandry / implementador |
| O-04 | En las Homes/PDP del frente Contour/Maison/Annex, no se vio wordmark en cabecera móvil; sí hamburguesa, cuenta y carrito. | Confirmar si la marca dispone de otra presencia suficiente y si la omisión es intencional; no declarar navegación accesible sin teclado/lector. | Johandry / implementador |
| O-05 | Lookbook de Atelier invita a explorar piezas; el snapshot no expuso piezas seleccionables. | Probar interacción explícitamente antes de denunciar hotspots rotos o contenido no enlazado. | GPT |
| O-06 | Tercer tab de colecciones de Atelier parcialmente visible en móvil, con indicio de desplazamiento. | Comprobar desplazamiento y foco; no se afirma inaccesibilidad por la visibilidad parcial. | GPT |

Los estados grises transitorios de imágenes en el frente Contour/Maison/Annex se resolvieron durante la sesión. No se presentan como imágenes rotas.

# Comparación comercial con control de contexto

No se asigna un ganador global: los catálogos no son equivalentes y no se han controlado activos, número de productos, longitud del copy, precio, variantes ni versión desplegada.

- Contour necesita medidas, escalas, materiales y entrega; el comparador y la reparabilidad responden a esas decisiones. La discrepancia del sofá afecta esa fortaleza.
- Maison necesita acabado, combinación de piezas y comprensión de producción por hornadas; glazes, sets y kiln log son pertinentes. La disponibilidad debe distinguir pasado editorial de compra presente.
- Annex necesita escala de obra, acabado de marco, edición y política de reproducción; las previsualizaciones son pertinentes. Conviene aclarar el alcance de la promesa editorial.
- Edition muestra un catálogo fotográfico coherente, pero debe adaptar su discurso técnico a los objetos efectivamente mostrados.
- Atelier conecta mejor copy de vestimenta y catálogo observado, aunque necesita terminar activos de Home y ampliar información visual del vestido.
- LINEA NOVE requiere primero una identidad estable y un catálogo de demo curado. No se puede utilizar su mezcla de QA como prueba de que un tercer preset comercial sea inferior o igual a Atelier.

El patrón móvil de V-02 permite una comparación de comportamiento limitada porque se repite en las seis colecciones. No permite comparar la cantidad exacta de desplazamiento entre ellas: existen diferencias de viewport confirmado, barra preview, altura de títulos y filtros.

# Qué cambia frente al maestro anterior

| Tema | Cambio que permite este complemento | Lo que sigue pendiente |
|---|---|---|
| Calidad visual de las seis URLs | Ahora existe observación directa de una muestra Home/PLP/PDP en Chrome. | Todos los demás tamaños, estados, navegadores y versiones. |
| Presets y diferenciación | Contour/Maison/Annex muestran diferenciación sectorial visible. Edition y Atelier se describen por sus estados observados. | Identidad estable del tercer storefront Sartorial y vínculo con su paquete/commit; todos los presets no visitados. |
| Hallazgos de contenido | Se agregan placeholders confirmados, discrepancias de datos y ambigüedades con URL y reproducción. | Causa técnica, dato verdadero, cambios y verificación posterior. |
| Preparación comercial | Hay una base concreta para corregir demos antes de presentarlas como terminadas. | Aprobación final de Johandry y requisitos de submission completos. |
| Funcionalidad/accesibilidad/rendimiento | Se acota la apariencia de controles y páginas observadas. | No se heredan métricas ni certificaciones técnicas de otro informe o versión. |

Actualización recomendada del maestro: enlazar este complemento en su dimensión visual y sustituir exclusivamente la afirmación de ausencia de observación por la cobertura aquí definida. Mantener las reservas sobre versión, editor, funcionalidad, accesibilidad, rendimiento y estados límite. Este documento no realiza esa edición ni cruza el maestro de Claude.

# Límites, compuertas y siguientes verificaciones

No se hicieron add to cart, compras, checkout, cambios de cantidad, consentimientos, cambios de país/idioma, pagos, envíos de formulario, búsquedas ni aplicación de filtros. No se abrió Theme Editor. No se probaron teclado, lector de pantalla, focos, zoom táctil físico, axe-core, Lighthouse, CWV, red/CPU limitadas ni otros navegadores. No se recorrieron de forma controlada los cinco estados límite.

Las apariencias de sticky CTA, opciones, recomendaciones, glazes, marcos o pared no certifican su funcionamiento. Una medición de botones de 44 px y la ausencia de overflow en una muestra no acreditan conformidad WCAG. Una sesión con acceso a tienda protegida no prueba que un revisor externo pueda entrar.

Compuertas:
- Ledger: no se cierra ni modifica ninguna fila; no se leyó ni editó el ledger para este complemento.
- Estados degenerados: no verificados sistemáticamente.
- Consistencia entre archivos: no auditada en código; solo se compararon superficies visibles descritas.
- Superficie del comerciante: no auditada; editor no abierto.
- Tienda real: se observó una muestra de storefront en escritorio y móvil simulado; esa cobertura parcial no cierra la compuerta completa de submission.

Prioridad propuesta, sin autorización de cambios implícita:
1. Gemini identifica el preview canónico de LINEA NOVE y confirma qué versión se debe evaluar; Johandry selecciona la demo y catálogo finales.
2. Johandry valida activos y datos para V-01, V-03, V-04, V-05 y V-07. Solo después se prepara una lista cerrada de cambios para el implementador autorizado.
3. Revisar V-02 en móvil con la misma altura útil, sin barra preview cuando sea posible, midiendo posición de primera tarjeta y preservando acceso a filtros.
4. Un auditor distinto de quien implemente repite los pasos de cada hallazgo, archiva capturas de antes/después y registra URL, hora, viewport e identidad del despliegue.
5. Ejecutar por separado pruebas comerciales y de accesibilidad/rendimiento en la versión final. No trasladar los resultados visuales de este complemento a esas categorías.

# Registro local de entrega y control de alcance

Resultados literales relevantes del preflight del redactor:

    git branch --show-current
    sprint/F0

    git rev-parse HEAD
    b45e913111e333b9a0e82938266189fc76c87057

    Test-Path -LiteralPath agent-comms/outbox-gpt/GPT-AUDIT-THREE-THEMES-VISUAL-001.md
    False

git status --short mostró artefactos no rastreados preexistentes en outbox-claude, outbox-gemini y outbox-gpt. Entre las líneas observadas:

    ?? agent-comms/outbox-claude/CLAUDE-AUDIT-THREE-THEMES-MASTER-001.md
    ?? agent-comms/outbox-gpt/GPT-AUDIT-THREE-THEMES-MASTER-001.md

El estado no se confundió con un árbol limpio. Se revisaron las instrucciones sin abrir ninguno de esos maestros para esta redacción. Se crea un único archivo nuevo mediante FileMode.CreateNew; no se modifican BOARD, theme, scripts, tests, configuración, Git ni tiendas. No se hace commit, push ni despliegue.


# Anexo de erratas de revisión adversarial — prevalece sobre el cuerpo anterior

Este anexo corrige y precisa las afirmaciones señaladas por dos revisores. Prevalece expresamente sobre cualquier formulación incompatible del cuerpo anterior. El texto anterior se conserva íntegro para mantener la trazabilidad; las siguientes precisiones forman parte del dictamen final de este complemento.

| Referencia del cuerpo revisado | Corrección que prevalece | Consecuencia para el dictamen |
|---|---|---|
| V-01, línea 108: mapeo de los cuatro placeholders del preview final de LINEA NOVE | Los cuatro SVG sí quedaron asociados por DOM a «Form in quiet movement», «Objects in quiet conversation», «Objects gain meaning through the hands that make them.» y «Complete the look». Se retira la afirmación de que no se recuperó su mapeo individual. | El hallazgo de placeholders se mantiene con localización más precisa; la identidad corresponde al preview final observado. |
| Identidad de LINEA NOVE, línea 58: causa de nombres de preview distintos | El agente no cambió explícitamente tema/preview ni abrió el editor. No se conoce la causa de las identidades diferentes. No se afirma que ninguna acción de navegación o de sesión pudiera haber influido. | Se mantiene la incertidumbre sobre la identidad estable y la causa del cambio; no se atribuye ni excluye causalidad sin evidencia. |
| V-05, línea 154: CTA VIEW TECHNICAL SPECS | El atributo href observado apunta a /collections/desk-and-study. El destino no fue visitado. Se retira cualquier afirmación de que la visita confirmó un listado o el contenido de esa ruta. | La observación válida es el destino declarado por el enlace. La adecuación entre promesa del CTA y contenido de destino queda pendiente de visita y comprobación. |
| V-08, línea 186: breadcrumbs de las tres colecciones del frente Contour/Maison/Annex | Los tres breadcrumbs quedaron confirmados: Contour, «Home · Products · Products»; Maison, «Home · Tableware · Tableware»; Annex, «Home · Limited Editions · Limited Editions». Se retira la reserva de que faltaba atribución individual. | La repetición de etiqueta queda localizada en cada colección muestreada de la matriz, sin inferir una causa en código. |
| V-04, línea 142: selección y disponibilidad visible de Iron Black Ramen Bowl | Iron Black estaba seleccionado cuando Add to cart se veía habilitado. No se comprobó inventario backend, adición al carrito ni compra. | La discrepancia editorial observada queda contextualizada a esa selección visible. No demuestra stock real ni fallo del inventario. |

Las referencias de línea identifican el cuerpo que revisaron los agentes; los títulos e IDs permiten ubicar cada afirmación si el renderizador altera la numeración. Este anexo no amplía la cobertura de navegación, no cambia la identidad no verificada del despliegue y no modifica los límites funcionales, normativos o de rendimiento.
