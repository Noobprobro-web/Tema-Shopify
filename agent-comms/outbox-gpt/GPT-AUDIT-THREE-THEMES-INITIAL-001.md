# GPT-AUDIT-THREE-THEMES-INITIAL-001

ID: GPT-AUDIT-THREE-THEMES-INITIAL-001
Estado: auditoría inicial independiente, parcial; no constituye certificación ni dictamen de envío.
Decisión requerida: proporcionar acceso o ZIP de Cucuyo y facilitar demos y entorno de prueba para completar la comparación; decidir después sobre prioridades.
Resumen en 5 líneas:
1. Sartorial ofrece una base editorial y comercial con tres composiciones de listing diferenciadas; su funcionamiento y presentación real no quedan probados aquí.
2. La referencia llamada Atelier corresponde al repositorio Contour 4.1.0 con tres presets; sus demos no pudieron evaluarse visualmente.
3. Cucuyo no fue accesible: no es posible puntuarlo ni inferir su inexistencia.
4. Las diferencias de contenido, promesas y configuración requieren comprobaciones en editor y tienda antes de actuar.
5. La propuesta de valor a 380 USD y la diferenciación exigida por Shopify permanecen sin validar.
Archivos tocados: únicamente este informe; ninguna fila del ledger se cierra o modifica.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación; cobertura reducida por acceso y ausencia de pruebas en tienda.
Hallazgos extra fuera de alcance (con parche listo): ninguno; no se prepararon parches.
Verificación (comando, resultado y qué demuestra/qué no): véase método y trazabilidad; no se ejecutaron Lighthouse, axe, recorridos comerciales, edición de tienda ni cambios de código.
Lista de afirmaciones falsables numeradas: al final.

## Alcance, identidad y método

Fecha de consulta de fuentes oficiales: 27 octubre 2026. Informe elaborado a partir de evidencias originales indicadas por los agentes de investigación y comprobaciones limitadas de texto local; no se revisaron informes iniciales o maestros de Claude. Las referencias de líneas del checkout son puntos de localización para revisión, no garantías de equivalencia completa con el ZIP. El análisis es estático y no prueba la experiencia en pantalla, conversiones, accesibilidad, velocidad, ni despliegue histórico.

Sartorial: checkout reportado en HEAD `09f834295074402d9b93aa8ead83a732d78e6608`. Los agentes informaron coincidencia SHA-256 entre checkout y ZIP para `assets/base.css` (`5d9ed6b2981f115d9fca06406a47a6ff784e63023883ea1e88f49ec84429af43`), `assets/theme.js` (`861fe0d606dbaa790f827e3d01cf89b431bdb630064a612608f50accc03aa8f7`) y `assets/product-zoom.js` (`4828d5a15471330e4d82f52bd16016c3ef1e71e2f53d275e9dc3cab28aa6c246`); SHA-256 ZIP `092242fba56513b7f491821f5fbd86c5933a8550c33ae541f0ffb5df801410e3`. La comprobación de estado/diff de ese checkout falló con exit 128: no se garantiza ausencia de otros cambios. En Admin de solo lectura se identificó MAIN `189832593651`, nombre `Sartorial v1.0.0 integrado`. La revisión reportó 84 rutas de ejecución coincidentes, 83 MD5 de Shopify iguales a los del ZIP, `settings_data` distinto y 24 JSON equivalentes semánticamente tras retirar JSONC y comparar objetos/arrays; dos cuerpos servidos por URL no se descargaron y nueve entradas `listings` se excluyeron. Estos resultados no demuestran igualdad de todos los bytes, identidad visual de demo ni despliegue histórico.

El ZIP registra presets Sartorial, Imprint y Archive (`config/settings_data.json:82,159,236`). `Atelier` aparece como `motion_style`; no se demostró que sea alias de preset. Las composiciones documentadas en `listings/{sartorial,imprint,archive}/templates/{index,product,collection}.json` son archivos separados; su aplicación por el editor requiere prueba.

Atelier, comparación principal: repositorio [SebastianDev017/atelier](https://github.com/SebastianDev017/atelier/tree/1576d06b336abb6827084b7734faebbcb4d8f32f), revisión `1576d06b336abb6827084b7734faebbcb4d8f32f`, identificado como Contour 4.1.0. Presets Contour, Annex y Maison en [settings_data.json](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/config/settings_data.json#L131), con composiciones en `listings/contour`, `listings/annex` y `listings/maison`. Las demos documentadas de Contour, Annex y Maison no fueron accesibles para evaluación visual; no se atribuye causa de ningún rechazo.

Cucuyo, comparación adicional: conector devolvió 404 tanto para `main` como para `727c0d4f9f68b6141694080cce365cd120d6c028`. Esto no distingue falta de acceso de inexistencia. Solicitar acceso o ZIP; no evaluado.

Comprobaciones directas en este turno: `git status --short --branch` devolvió `## sprint/F0` y archivos no rastreados preexistentes; `Test-Path -LiteralPath 'agent-comms/outbox-gpt/GPT-AUDIT-THREE-THEMES-INITIAL-001.md'` devolvió `False` antes de crear el informe. `rg -n 'aerospace|500D|titanium|weatherproof|stress.tested|leather-desk-mat|milled-brass-paperweight' listings/imprint/templates/index.json` encontró afirmaciones en líneas 21, 32, 74 y 153 y referencias a productos en 58 y 64. `rg` sobre documentación y `complete-the-look` confirmó las referencias de los hallazgos S2–S4. Son comprobaciones de texto, no validación de los productos o de la tienda. Los resultados de hashes y Admin son reportes de otros agentes; los crudos no se incluyen en este informe y deben reproducirse antes de considerarlos prueba independiente final.

## Marco oficial y criterios

[Requisitos oficiales Shopify](https://shopify.dev/docs/storefronts/themes/store/requirements): la identidad debe ser fundamentalmente distinta en experiencia y capacidades, no solamente cosmética; también hay exigencias de personalización, demos, documentación, accesibilidad y funcionalidad. Shopify pide promedio Lighthouse mínimo 60 en rendimiento y 90 en accesibilidad para inicio, producto y colección en móvil y escritorio, con su dataset de referencia y contenido real. Ninguna cifra de este informe es una medición Lighthouse. [Proceso de envío](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme), [rechazos frecuentes](https://shopify.dev/docs/storefronts/themes/store/review-process/common-theme-rejections) y [pruebas oficiales](https://shopify.dev/docs/storefronts/themes/store/test-theme) distinguen requisitos de pruebas e inspección de la revisión final de Shopify.

Cinco categorías originales, escala máxima 20 cada una: identidad y diseño; comercio y conversión; personalización y editor; accesibilidad y móvil; rendimiento y robustez. 0–5 sería evidencia suficiente de carencia grave, 6–10 desempeño limitado, 11–15 competente con reservas, 16–20 destacado respaldado por pruebas comparables. No asignamos puntuaciones cuando falta evidencia suficiente: los indicios de código no permiten determinar calidad real. No se calcula total ni ranking.

Cobertura: E = evidencia estática parcial, V = observación visual, F = prueba funcional; aquí solo se dispone de E salvo Cucuyo, sin cobertura. Confianza: baja para inferencias de experiencia a partir de código; no evaluado si no hay evidencia suficiente para puntuar. Las filas incluyen cinco categorías /20 en orden de la lista anterior.

| Tema o preset | Identidad /20 | Comercio /20 | Editor /20 | Accesibilidad y móvil /20 | Rendimiento /20 | Cobertura y confianza |
|---|---|---|---|---|---|---|
| Sartorial, tema | No evaluado | No evaluado | No evaluado | No evaluado | No evaluado | E parcial; baja |
| Sartorial, preset Sartorial | No evaluado | No evaluado | No evaluado | No evaluado | No evaluado | E de composición; baja |
| Sartorial, preset Imprint | No evaluado | No evaluado | No evaluado | No evaluado | No evaluado | E de composición; baja |
| Sartorial, preset Archive | No evaluado | No evaluado | No evaluado | No evaluado | No evaluado | E de composición; baja |
| Atelier/Contour, tema | No evaluado | No evaluado | No evaluado | No evaluado | No evaluado | E parcial; baja |
| Atelier, Contour | No evaluado | No evaluado | No evaluado | No evaluado | No evaluado | E de composición; baja |
| Atelier, Annex | No evaluado | No evaluado | No evaluado | No evaluado | No evaluado | E de composición; baja |
| Atelier, Maison | No evaluado | No evaluado | No evaluado | No evaluado | No evaluado | E de composición; baja |
| Cucuyo y presets desconocidos | No evaluado | No evaluado | No evaluado | No evaluado | No evaluado | Sin acceso; no evaluado |

Prioridades propias: P0 bloqueo confirmado para operación o envío, con evidencia directa; P1 riesgo probable de perjuicio importante o incumplimiento que exige comprobación prioritaria; P2 riesgo condicionado o brecha de claridad con impacto moderado; P3 mejora o dato menor. Pueden cambiar tras pruebas; ausencia de acceso no es por sí sola un defecto del producto.

## Ventajas, debilidades y comparación

Sartorial: en los archivos de listing, Sartorial combina split 65/35, lookbook y complete-the-look; Imprint usa 50/50, bento y technical specs; Archive combina hero cinemático, manifiesto y provenance sin complete-the-look en inicio. Esto apunta a direcciones de merchandising distintas, no demuestra diferencia visual efectiva ni aplicación automática. Hay estructuras para producto, colección y carrito en `sections/main-product.liquid:215,270,395,470,483–546`, `sections/main-collection.liquid:4–16,67–90`, `sections/main-cart-items.liquid:20–22,86–89,118–166,188–190` y `sections/cart-drawer.liquid:1–29,93,146,213–216,322–335`; el umbral de envío figura desactivado por defecto en `:389–405`. Sus límites y comportamiento real siguen pendientes.

Como indicios de accesibilidad y adaptación existen skip link (`layout/theme.liquid:114`), estilos de foco y movimiento reducido parcial (`assets/base.css:283,1417,1898`), drawer móvil (`sections/header.liquid:36–54,69–83`) y opciones de imagen móvil y vídeo (`sections/hero-editorial.liquid:77–87,99–121`). Existen opciones editoriales en `sections/hero-editorial.liquid:19–35,60–66`, `sections/main-product.liquid:1023–1055`, `config/settings_schema.json:13–26,37–53`; y decisiones de carga en `layout/theme.liquid:54,95`, `sections/hero-editorial.liquid:99–109`, `assets/theme.js:1768–1785,1795–1800`. La mera presencia no certifica funcionamiento, teclado, contraste, móvil o rendimiento.

Atelier/Contour: el código reportado presenta contenido de producto y medios en [main-product](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/sections/main-product.liquid#L197), [product-media](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/snippets/product-media.liquid#L102), y configuración de animaciones en [anim-settings.js](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/assets/anim-settings.js#L20). Los listings reportan Contour con hero, colección, split, testimonios y comparador; Annex con desplazamiento horizontal y maker; Maison con proceso, hotspots y cerámica. Son diferencias de estructura, no una comparación visual ni funcional. Sartorial muestra un repertorio editorial propio en archivos; no hay evidencia suficiente para concluir superioridad ni diferencia fundamental frente a Atelier o Theme Store.

Precio de referencia 380 USD: la variedad de composiciones y herramientas comerciales puede contribuir a una propuesta premium, pero no demuestra disposición a pagar, calidad visual, soporte, cumplimiento ni resultados. Antes de defender ese precio se requieren pruebas comparables por plantilla y preset, evaluación de calidad percibida por comerciantes, documentación y soporte reales, además de un análisis competitivo con precios observados; aquí el precio no es puntuación ni valoración de mercado.

## Hallazgos y próximos pasos no ejecutados

| ID | Prioridad | Evidencia y riesgo | Impacto condicionado | Paso propuesto y responsable | Estado |
|---|---|---|---|---|---|
| S1 | P2 | `listings/imprint/templates/index.json:21,32,58,64,74,153`: discurso de materiales técnicos junto a referencias a desk mat y paperweight. No se comprobó falsedad. | Una demo con afirmaciones no correspondientes a los productos puede crear expectativas erróneas. | Johandry/Gemini: revisar catálogo y claims visibles y ajustar solo con evidencia de producto. | Pendiente de prueba en demo |
| S2 | P2 | `templates/page.documentation.json:26,58` y `templates/page.support.json:23–24` describen cambios de ajustes; las composiciones de listing están en archivos separados. | El comerciante podría esperar reproducir una demo al cambiar preset. | Gemini: probar paso a paso en editor limpio y documentar lo realmente reproducible. | Hipótesis; no probado |
| S3 | P2 | `templates/page.support.json:78` promete promedio de dos días; `templates/page.documentation.json:66` afirma contraste 4.5:1 y 3:1. | Promesas de soporte o accesibilidad podrían carecer de respaldo actual. | Johandry: verificar capacidad real; GPT: medir esquemas y estados en tienda. | No verificado |
| S4 | P2 | `sections/complete-the-look.liquid:20–33,145–158,178,212,265–268` limita compra directa para variantes numerosas o plan obligatorio; `templates/page.documentation.json:75` no explica límite. Cuando `variants_count` falta, el umbral de fallback es >=250; con contador presente es >250. | Posible fricción para catálogos afectados; fallback y efecto comercial requieren prueba. | Gemini/GPT: probar casos y explicar límites al comerciante. | Condicionado; no probado |
| A1 | P2 | [product.json](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/templates/product.json#L39) presenta promesas de 30 días y made to order; [trust-badges](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/snippets/trust-badges.liquid#L27) usa default. | Riesgo si la política real difiere o al vaciar texto se restaura una promesa. | Responsable de Atelier: comprobar editor y política de tienda. | Condicionado; sin prueba funcional |
| A2 | P2 | [settings_data](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/config/settings_data.json#L150) activa umbral 150; [free-shipping-claim](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/snippets/free-shipping-claim.liquid#L25) y [cart-shipping-bar](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/snippets/cart-shipping-bar.liquid#L8) usan configuración local. | Mensaje potencialmente inconsistente con tarifas y mercados reales. | Responsable de Atelier: contrastar tarifas, mercados y mensajes en carrito. | Condicionado; no probado |
| A3 | P2 | [notify-me](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/snippets/notify-me.liquid#L50) contiene formulario de contacto y aceptación de marketing; el fragmento no demuestra automatización de aviso. | El comprador podría esperar una notificación que depende de un proceso adicional. | Responsable de Atelier: probar captura, consentimiento y envío real antes de concluir. | No verificado |
| C1 | P2 | Respuesta 404 del conector para ambas referencias solicitadas. | Comparación adicional incompleta. | Johandry: facilitar acceso o ZIP identificable. | Bloqueado por acceso; no es defecto confirmado |

No se afirma ningún P0 confirmado a partir de esta evidencia parcial. No se propone implementar, publicar ni modificar tiendas en esta fase.

## Afirmaciones falsables

1. El archivo de listado Imprint contiene los textos y referencias a productos citados en S1; el comando `rg` anterior permite comprobarlo sin inferir su veracidad comercial.
2. La documentación local promete que los presets cambian ajustes y el texto de soporte indica dos días; ambas afirmaciones se encuentran en las líneas indicadas y no se validó su cumplimiento.
3. La lógica de complete-the-look distingue el contador de variantes disponible del fallback y contempla requisito de plan; las líneas citadas permiten revisar las condiciones.
4. Shopify publica los umbrales promedio Lighthouse 60/90 para las páginas y dispositivos descritos; no se ha medido ninguno de los temas aquí.
5. La inaccesibilidad de Cucuyo impide concluir sus características o existencia. La demostración de acceso o un ZIP identificado puede modificar esta conclusión.
## Anexo de erratas y método — 27 octubre 2026

Este anexo prevalece sobre cualquier formulación incompatible en las secciones «Marco oficial y criterios», «Ventajas, debilidades y comparación» y «Hallazgos y próximos pasos no ejecutados». Conserva las observaciones originales y no cambia el alcance de la auditoría.

### Cobertura de la matriz

«No evaluado» en las celdas significa que no se ha asignado puntuación y que las pruebas de ejecución necesarias no se han realizado. No significa ausencia de revisión estática. Para cada fila Sartorial y sus tres presets y Atelier/Contour y sus tres presets, la cobertura por categoría es la siguiente: identidad: revisión estática parcial de composiciones, confianza baja sobre la experiencia; comercio: revisión estática parcial de componentes y contenidos, confianza baja sobre funcionamiento e impacto; editor: revisión estática parcial de ajustes y documentación, confianza baja sobre reproducibilidad; accesibilidad y móvil: indicios estáticos parciales, confianza baja sobre comportamiento y conformidad; rendimiento: indicios estáticos parciales, confianza baja sobre resultados medidos. Las revisiones no cubren exhaustivamente todos los archivos ni todos los presets en cada categoría. En Cucuyo, las cinco categorías tienen cobertura nula y confianza no evaluable.

Las cuatro URLs abiertas en navegador redirigieron a `/password`; no se observó contenido de storefront ni se hicieron pruebas visuales o móviles. Una petición HTTP aislada a Sartorial falló antes de recibir respuesta. No se transmitió ninguna contraseña en esa petición. Johandry confirmó que Cucuyo no está disponible por ahora; C1 es un bloqueo de cobertura y no tiene prioridad de defecto de producto.

En Sartorial, la barra o progreso de envío está desactivada por defecto; el umbral numérico conserva el valor 150. No se debe interpretar «desactivado» como ausencia de umbral.

### Desglose y protocolo propuesto para cada hallazgo

Los pasos siguientes son propuestas, no se ejecutaron. Confianza sobre código indica solo la lectura reportada o comprobación textual de los puntos citados en el informe; confianza sobre impacto indica la fuerza de la inferencia, no una medición de usuarios.

**S1 — P2, contenido de Imprint.** Condición: que los textos técnicos se muestren junto a productos cuyos atributos no los respalden. Pasos: 1) abrir el preset y registrar la sección y productos realmente visibles; 2) cotejar cada promesa con especificaciones confirmadas; 3) revisar el contenido final con el responsable del catálogo. Esperado: cada afirmación visible corresponda al producto o contexto al que se refiere. Estado: pendiente. Confianza en texto local: alta para las coincidencias de `rg` citadas; confianza en impacto: baja, condicionado y no se afirma falsedad.

**S2 — P2, reproducción de presets.** Condición: que el comerciante interprete el cambio de ajustes como reproducción de composiciones separadas. Pasos: 1) instalar el paquete en tema de prueba limpio; 2) cambiar cada preset desde el editor y registrar ajustes y secciones; 3) contrastar con los archivos de listing y la documentación. Esperado: instrucciones claras y reproducibles, coherentes con el resultado del editor. Estado: hipótesis pendiente. Confianza en textos locales: alta; confianza en comportamiento e impacto: baja.

**S3a — P2, compromiso de soporte.** Condición: que el tiempo promedio prometido se publique sin capacidad operativa que lo respalde. Pasos: 1) identificar dónde se publica la promesa de dos días; 2) contrastarla con registros de soporte representativos y política vigente; 3) corregir el texto si la capacidad no está respaldada. Esperado: compromiso verificable y mantenible. Estado: no verificado; responsable Johandry. Confianza en texto local: alta; confianza en incumplimiento e impacto: baja, condicionado.

**S3b — P2, afirmación de contraste.** Condición: que alguna combinación publicada no cumpla los ratios afirmados en documentación. Pasos: 1) inventariar esquemas y estados visibles con contenido real; 2) medir contraste de texto y componentes, incluidos estados y fondos variables; 3) cotejar resultados con lo prometido y documentar excepciones. Esperado: evidencia que respalde cada afirmación o texto ajustado al alcance medido. Estado: no verificado; responsable GPT/Gemini. Confianza en texto local: alta; confianza en fallo de contraste e impacto: baja.

**S4 — P2, complete-the-look.** Condición: productos con contador superior a 250, fallback de contador ausente con colección de variantes de tamaño al menos 250, o requisito de plan de venta. Pasos: 1) preparar productos representativos alrededor de los límites y con plan obligatorio; 2) observar el componente y sus opciones de compra en tienda; 3) comparar el recorrido con la documentación. Esperado: restricciones claras y vía de compra adecuada para cada caso. La condición de >=250 corresponde solo al camino donde falta `variants_count`; cuando existe, la comparación es >250. El fallback a página de producto se marca para la condición de muchas variantes; no se ha demostrado que la suscripción obligatoria presente el mismo fallback. Estado: hipótesis pendiente. Confianza en condiciones de código local: alta; confianza en el efecto para compradores: baja.

**A1 — P2, promesas de producto en Atelier.** Condición: que se conserven textos predeterminados o restaurados por `default` cuando la política real difiere. Pasos: 1) configurar un producto con política diferente; 2) vaciar o cambiar las opciones relevantes en editor; 3) comprobar el texto publicado y cotejarlo con la política real. Esperado: ninguna promesa no autorizada o contraria a la política. Estado: no verificado. Confianza en código: media, basada en lectura reportada de la revisión fijada; confianza en impacto: baja.

**A2 — P2, envío gratuito en Atelier.** Condición: que un umbral local activo no corresponda a tarifas, países o condiciones efectivas. Pasos: 1) configurar mercados y tarifas reales de prueba; 2) probar carrito por debajo y encima del umbral en distintos destinos; 3) comparar el mensaje con el coste calculado en checkout. Esperado: la promesa coincide con las tarifas aplicables. Estado: no verificado. Confianza en código: media, basada en lectura reportada; confianza en discrepancia e impacto: baja.

**A3 — P2, notify-me en Atelier.** Condición: que se prometa aviso sin proceso operativo de envío o sin consentimiento adecuado. Pasos: 1) enviar solicitud de prueba con consentimiento documentado; 2) reponer el producto y observar el flujo real y la notificación; 3) revisar información al usuario y configuración del procesamiento. Esperado: aviso y consentimiento coherentes con lo prometido. Estado: no verificado. Confianza en formulario de código: media, basada en lectura reportada; confianza en fallo e impacto: baja.

**C1 — bloqueo de cobertura, sin prioridad de producto.** Condición: Cucuyo permanece no disponible, según confirmación de Johandry. Pasos: 1) si vuelve a estar disponible, obtener acceso autorizado o ZIP identificado; 2) registrar revisión, presets y origen; 3) repetir las cinco categorías con evidencia comparable. Esperado: acceso verificable o mantenimiento explícito del estado no evaluado. Estado: no disponible por ahora. Confianza en hallazgo de código e impacto de producto: no evaluable; la respuesta 404 no demuestra inexistencia ni defecto.
