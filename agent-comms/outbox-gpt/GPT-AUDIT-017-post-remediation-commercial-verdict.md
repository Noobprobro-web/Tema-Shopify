# GPT-AUDIT-017 — Dictamen comercial multiagente tras remediación

ID: GPT-AUDIT-017  
Estado: **NO APTO PARA ENVÍO A SHOPIFY THEME STORE**, verificación del 30 de septiembre de 2026.  
Decisión requerida: Johandry y Gemini deben mantener bloqueada la submission, publicar documentación y soporte accesibles sin contraseña, corregir catálogo y enlaces, y repetir los recorridos de pago/instalación antes de cambiar este dictamen.  
Resumen en 5 líneas:
1. Atelier corrigió las tallas y el inglés en 24/24 PDP; las cápsulas y variantes probadas suman correctamente.
2. Test Payment Gateway aparece en los tres checkouts y `Pay now` está habilitado, pero esta revisión no completó un pedido final.
3. Las nuevas URL de documentación y soporte redirigen a `/password` para una sesión sin cookies; ambas páginas enlazan a rutas 404 y el formulario depende de `mailto:`.
4. Edition mantiene un enlace de Bento a una colección 404 y 10 fotos claramente incongruentes; Archive mantiene 12 fotos con nombres de productos contemporáneos de Atelier.
5. Archive aún muestra total de dos unidades para una pieza `1 of 1` al escribir cantidad 2; la prueba de EUR/GBP y paridad de instalación continúa abierta.
Archivos tocados: solo este informe por el auditor principal. Otros agentes son propietarios de sus notas `GPT-AUDIT-017-{policy,merchandising,transactions,brand}-notes.md`; no se modificó tema, `BOARD.md` ni ledger.  
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación.  
Hallazgos extra fuera de alcance (con parche listo): ningún parche de código; los problemas de contenido/Admin y las decisiones de arquitectura corresponden a Johandry y Gemini.  
Verificación (comando, resultado y qué demuestra/qué no): navegación real de Chrome e in-app browser sin cookies; pruebas de interacción de los agentes; lectura crítica de artefactos `harness-AUDIT-FINAL-003`; `rg` de ZIP y ledger. La matriz siguiente separa observación propia, agente especializado, evidencia técnica secundaria e inferencia.  
Lista de afirmaciones falsables numeradas: H1–H8 en la sección 3 y R1–R10 en la sección 6; cada fila indica la prueba de cierre.

## 1. Veredicto comercial ejecutivo

**NO APTO hoy.** La remediación produjo mejoras reales: las 24 PDP de Atelier ya tienen descripciones inglesas y 87 valores de talla/medida; Nove talla 38 se añade al drawer como talla 38; la cápsula selecciona tres tallas y añade exactamente $2,250; Edition conserva una cápsula de $620 y variantes de precio reactivas. En los checkouts muestreados aparece `Test Payment Gateway`, con el botón final habilitado. Son avances observables, pero no equivalen a un pedido de prueba completado.

Quedan **dos bloqueos comerciales directos**: la documentación y el soporte no son públicos, y el catálogo aún presenta imágenes que contradicen nombres/descripciones en Edition y Archive. Un tercer bloqueo funcional es el 404 de `Objects for the desk` en Edition. Shopify exige una demo realista, navegación sin fricción, derechos de uso de recursos, pasarela de prueba y documentación con formulario público de soporte. Estas exigencias son explícitas en [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements). El veredicto describe el estado visto en las demos, no anticipa con certeza la decisión de un revisor oficial.

La dirección visual de las tres portadas puede competir en el segmento propuesto de **$380 USD**. A ese precio, la compra de moda requiere además talla comprensible, fotografías suficientes, información posventa visible y asistencia accesible. El progreso de Atelier acerca el producto a ese nivel; los riesgos de contenido y soporte impiden certificar el conjunto.

## 2. Método, roles y alcance

Cuatro frentes especializados trabajaron sobre la misma fecha de remediación indicada en `BOARD.md`:

| Frente | Evidencia principal | Alcance real |
|---|---|---|
| Políticas/Theme Store | [Notas especializadas](GPT-AUDIT-017-policy-notes.md): navegación live de checkout, docs, soporte, catálogo Edition y Archive; sesión limpia sin cookies para acceso público | Llegada a pantalla de pago y contenido, sin orden final ni prueba de derechos contractuales. |
| Merchandising/UX | [Notas especializadas](GPT-AUDIT-017-merchandising-notes.md), Chrome desktop 1536 y móvil 390 × 844 | Barrido 24/24 PDP Atelier; Nove, cápsula y Archive stock 1 con interacción real. |
| Transacción/moneda | [Adjudicación especializada](GPT-AUDIT-017-transactions-notes.md) de artefactos de Claude `harness-AUDIT-FINAL-003` | Variante/precio/add/cart/bundles/Quick Buy en escritorio; no orden final ni EUR/GBP. El navegador propio del agente fue bloqueado por revisión automática, sin eludirla. |
| Marca/benchmarks | [Notas de marca](GPT-AUDIT-017-brand-notes.md), seis portadas y menús en Chrome | Comparación cualitativa y clic real al enlace roto Edition; sin puntuación cuantitativa de marca. |

Se observaron portadas, colecciones, PDP, drawer, carrito y pantallas de checkout en los recorridos indicados. El uso concurrente de la misma tienda creó líneas de carrito de otro agente; las notas identifican esa concurrencia y usan diferencias de subtotal o `/cart.js` de contextos aislados en vez de atribuirla al tema. No se emitieron pedidos reales ni mensajes de soporte. La política de confirmación de Computer Use exige dejar al usuario la acción financiera final del navegador; se comprobó la pasarela y el botón, y se detuvo antes de `Pay now`. `Password protected` apareció en la Shopify Preview Bar del Chrome autenticado; una **sesión independiente sin cookies** se usó para probar acceso público a docs/soporte.

Shopify pide promedios Lighthouse de al menos 60 en rendimiento y 90 en accesibilidad para home, colección y producto en escritorio y móvil con dataset benchmark; la inspección comercial no certifica esos promedios. [Requisitos de Shopify](https://shopify.dev/docs/storefronts/themes/store/requirements). El harness de Claude registra `axe` con 0 violaciones automáticas en rutas muestreadas, pero también resultados `incomplete`; esto no reemplaza teclado, contraste manual ni la medición oficial. Un Lighthouse puntual de home Atelier da 64 rendimiento móvil y 97 escritorio, sin cubrir el promedio requerido.

## 3. Seguimiento de hallazgos anteriores

`Resuelto` requiere corrección visible en el alcance probado; `Parcial` registra avance con una condición aún abierta; `Pendiente` conserva un defecto reproducible. Los identificadores H remiten a `GPT-AUDIT-015`.

| Hallazgo | Estado post sprint | Evidencia actual | Condición de cierre / dueño |
|---|---|---|---|
| **H1 Pagos de prueba** | **Parcial** | Los tres checkouts muestran `Test Payment Gateway`, instrucciones de tarjeta de prueba y `Pay now` activo. Archive mostró $1,500. No hubo orden final en esta auditoría. | Johandry: guardar número/estado de una orden de prueba por demo y verificar otras opciones de pago deshabilitadas desde Admin. Gemini valida. |
| **H2 Documentación/soporte** | **Pendiente, P0** | `config/settings_schema.json:7-8` apunta a `/pages/theme-documentation` y `/pages/theme-support`. En navegador sin cookies **ambas URL redirigen a `/password`**. En sesión autenticada, Docs enlaza dos veces a `/pages/support.html` (404) y Support enlaza dos veces a `/pages/docs.html` (404); el formulario tiene `action="mailto:support@ruizdigital.com"`. | Johandry: alojar docs y formulario que envíe solicitudes en URL pública y funcional; Gemini/Claude actualizan `theme_info` y ZIP. Probar sin cookies y recepción de ticket. |
| **H3 Edition: fotos/logo** | **Parcial, no cerrado** | No se identificó el logo anterior en la retícula actual; 10/13 imágenes siguen mostrando otro objeto, una undécima comparte foto de otro bolso y dos son plausibles. Ejemplos: paperweight con montacargas/palés, key loop con candado sobre teclado y pouch con mochila. | Johandry: revisar 13/13 productos y variantes con imágenes fieles y permisos documentados. Un logo no visible en muestra no demuestra limpieza total. |
| **H4 Archive: fotografías históricas** | **Pendiente, P0** | Las 12 tarjetas actuales conservan nombres base de fotografía iguales a productos Atelier. 1990 jacket usa `nove-blazer-01.jpg`; 1994 portfolio, `structured-tote-01.jpg`; 1991 leather skirt, `wrap-wool-skirt-01.jpg`. Tres conflictos se comprobaron además visualmente, y la PDP 1990 sigue usando el mismo nombre de recurso. | Johandry: medios individuales que correspondan a cada pieza o corregir ficha y narrativa; acreditar procedencia/uso. Gemini verifica 12/12. |
| **H5 Atelier: tallas/copy** | **Resuelto en el alcance probado** | 24/24 PDP tienen descripción inglesa y valores de opción; 87 valores sumados. Nove 34–42, su talla 38 llegó correcta al drawer; la cápsula añadió 38/40/42 con delta $2,250. | Mantener prueba de regresión. Guía de tallas y galería quedan como mejoras separadas. |
| **H6 Archive: cantidad 1 de 1** | **Parcial, P1** | El botón `+` se topa en 1, pero escribir `2` en el input deja `Total for 2 $3,000.00` junto a `Low stock: 1 left`, en escritorio y móvil. El harness registra input inválido y sin petición de carrito cuando se intenta añadir 2. | Gemini/Claude: impedir que valor imposible sobreviva en UI o muestre total erróneo; comprobar 12 piezas, teclado y actualización de stock. |
| **H7 Idioma/footer** | **Parcial** | Inglés corregido en 24/24 PDP Atelier. Header de las tres: Home/Catalog/Contact; footer: Search y Your Privacy Choices, sin enlaces visibles a devoluciones/envíos/colecciones/relato. | Johandry: menú de footer, políticas y contenido localizados; Gemini revalida. |
| **H8 Archive: ciudades** | **Pendiente, P2** | Home: `PRIVATE APPOINTMENTS IN KYOTO & PARIS`; Contact: `Showroom: By appointment / Milan`. | Johandry: confirmar operación y unificar ambos textos. |
| **Accesibilidad/CLS/LCP añadidos por sprint** | **Parcialmente verificado** | Harness secundario registra foco doble tono visible en controles muestreados, CLS de scroll muy bajo en pruebas realizadas y hero eager/high; Lighthouse home Atelier móvil 64/100 y desktop 97/100 en una corrida. `axe` marcó 0 violaciones automáticas con casos `incomplete`. | Gemini/Claude: adjuntar resultados completos home/colección/PDP, desktop/móvil y contrastes/teclado manuales. |

No cierro ni edito `docs/requirements-ledger.md`. Su fila 107 figura `cumplido` por HTTP 200 de las nuevas URL, pero la sesión pública contradice el requisito de acceso público; Gemini debe reabrirla. La fila 108 también requiere nueva revisión por las imágenes y el 404 comercial. `BOARD.md` es de escritura exclusiva de Gemini.

## 4. Evaluación detallada por tienda

### Sartorial Atelier

**Fortalezas.** El hero fotográfico, serif y ritmo editorial construyen una marca de sastrería reconocible. Hotspots, selección curada y `Complete the look` facilitan descubrir y combinar prendas. En la prueba móvil a 390 px, la cápsula permitió elegir Nove talla 38, blusa 40 y pantalón 42; añadió tres variantes exactas. Nove talla 38 actualizó URL/estado y drawer correctamente. El conjunto $1,150 + $520 + $580 = **$2,250**; el subtotal del drawer subió esa cantidad. El catálogo actual contiene 24 PDP con descripciones inglesas y 87 valores de opción. [Evidencia detallada](GPT-AUDIT-017-merchandising-notes.md).

**Debilidades.** Las **24/24 PDP** siguen con una sola imagen y sin guía de tallas visible. Eso dificulta evaluar caída, reverso, acabados y equivalencias para prendas de $520–$1,890. `Explore lookbook` conduce a Permanent Collection en vez de la sección de lookbook. La navegación informativa en header/footer sigue escasa. La promesa de despacho de Serra en 24 horas en home contrasta con el acordeón/FAQ de tres días hábiles que se observó antes; ese texto debe revalidarse y unificarse antes de prometer SLA. El checkout muestra pasarela de prueba, pero no consta orden final de esta revisión.

**Oportunidad de conversión.** Publicar una guía de medidas por producto/estilo y fotografías de espalda, detalle y sobre cuerpo. Mostrar composición exacta y plazos coherentes. Mantener la cápsula como activo principal de AOV; su utilidad está demostrada por selección y suma, no por una medición causal de incremento de ticket.

### Sartorial Edition

**Fortalezas.** Hero dividido, retícula de descubrimiento y tipografía sobria diferencian objetos de diseño de Atelier. Variantes del tote y Desk Mat reaccionan en precio: Deep olive / Compact $580 y Dark umber / Compact $260 en el harness posterior. El set de Folio $370, Cardholder $95 y Valet Tray $155 añadió tres líneas por **$620**; `/cart.js` y drawer coincidieron. Quick Buy de Compact Crossbody añadió una variante por $425. [Evidencia transaccional delimitada](GPT-AUDIT-017-transactions-notes.md).

**Debilidades.** La tarjeta Bento `Objects for the desk` aún lleva a [`/collections/desk-and-study`](https://sartorial-edition.myshopify.com/collections/desk-and-study), donde se ve **404 / Object not found**. En la matriz actual, **10/13 imágenes** contradicen claramente el objeto anunciado: paperweight con escena de almacén, key loop con candado, travel pouch con mochila, entre otros; Compact Crossbody adicionalmente comparte la imagen naranja de East-West. En PDP East-West, la variante seleccionada dice `Black box calf` y la imagen muestra un bolso naranja tejido. Esto puede anular la credibilidad de la ficha aunque el precio y el botón funcionen. No se verificó licencia de cada recurso; tampoco se concluye que el logo de tercero permanezca tras la remediación. [Matriz completa](GPT-AUDIT-017-policy-notes.md).

**Oportunidad de conversión.** El recorrido Bento y Quick Buy puede reducir pasos de descubrimiento si cada tarjeta llega a la colección correcta y cada variante está respaldada por una foto fiel. Hay que rehacer la revisión visual de 13/13 productos y comprobar imágenes por acabado.

### Sartorial Archive

**Fortalezas.** El lenguaje de inventario, paleta y fotografía ambiental producen la personalidad más distinta. La cápsula no aparece y no deja hueco de sección; esa decisión respeta el catálogo 1 de 1. Las PDP muestran condición, talla y `Low stock: 1 left`; servidor/carrito no aceptan dos unidades en la prueba técnica secundaria. La home móvil mantiene jerarquía sin overflow horizontal en páginas muestreadas.

**Debilidades.** Las 12 tarjetas de colección conservan nombres de recurso de producto de Atelier; la PDP 1990 también. Ese caso es especialmente visible: la ficha describe chaqueta rayada de doble botonadura, pero la foto remite al Nove Blazer contemporáneo. El catálogo afirma procedencia, maker nombrado y certificado numerado, sin que la matriz de 12 PDP anterior mostrara una ficha de procedencia o certificado individual; es una afirmación comercial pendiente de sustento, no una acusación de falsedad. El input de cantidad permite escribir 2 y anuncia total **$3,000** aunque queda una unidad. Home promete citas en Kyoto y París; contacto solo da Milán. [Matriz completa](GPT-AUDIT-017-policy-notes.md).

**Oportunidad de conversión.** Sustituir o documentar medios de cada pieza, mostrar historia de conservación y medidas únicas, y hacer que selector y total respeten el único ejemplar desde cualquier forma de entrada.

## 5. Comparativa contra Contour, Maison y Annex

Evaluación cualitativa de portadas, navegación y rutas de producto observadas. Ninguna fila equivale a certificación de Theme Store o puntuación Lighthouse del benchmark.

| Storefront | Originalidad e identidad | Pulido visual actual | Conversión demostrada / fricción | Navegación y confianza |
|---|---|---|---|---|
| **Atelier** | Alta: campaña de sastrería, lookbook y cápsula | Portada fuerte; PDP con una foto y sin guía | Talla y cápsula funcionan; pago final no ejecutado | Tres links arriba; footer limitado, relato y políticas poco visibles. |
| **Edition** | Alta: retícula y sistema de objetos | Hero sólido; fotos de producto incongruentes | Bundle/Quick Buy suman bien; Bento lleva a 404 | Tres links arriba; taxonomía de objetos no accesible directamente. |
| **Archive** | Alta: gramática de museo y pieza única | Portada distintiva; imagen/PDP contradicen procedencia | Stock se impone en carrito, pero PDP muestra total imposible | Tres links arriba; ciudades y relato inconsistentes. |
| [Contour](https://contour-ho5kbo9x.myshopify.com/) | Hogar editorial | Fotografía y ficha con materiales/medidas | Swatches y contenido de PDP facilitan decisión | Living, New season, Studio objects, About us, Contact. |
| [Maison](https://maison-10oym9w0.myshopify.com/) | Cerámica de taller | Hero y copy de proceso coherentes | Categorías, variantes y gift card visibles | Serving & Tea, Tableware, Vases & Vessels, About us, Contact. |
| [Annex](https://annex-r0zzjfjf.myshopify.com/) | Arte y ediciones | Hero y ritmo editorial fuertes | Rutas por edición/original/fotografía | Limited Editions, Originals, Photography, About us, Contact. |

Sartorial tiene la amplitud estética para el tier anunciado; los benchmarks orientan mejor al comprador hacia subcolecciones y contexto. No se idealizan: la auditoría previa observó copy de placeholder en footer de Contour y Annex, y una categoría incorrecta en una PDP de Annex. Se usan para comparar arquitectura comercial, no para excusar fallos de Sartorial.

## 6. Bloqueadores, acciones y prueba de cierre

| ID · prioridad / dueño | Hallazgo observable | Acción concreta | Evidencia mínima para cierre |
|---|---|---|---|
| **R1 · P0 · Johandry + Gemini** | Docs y soporte llevan a `/password` sin cookies; links internos 404 y `mailto:`. | Publicar documentación y formulario de soporte que reciba tickets en dominio público; corregir links; actualizar `theme_info` y ZIP. | Abrir ambas URL desde sesión sin cookies, navegar cada CTA, enviar ticket de prueba y comprobar recepción/autorespuesta. |
| **R2 · P0 · Johandry** | Edition mantiene fotos cruzadas con títulos y variantes; logo ajeno previo ya no se pudo confirmar en muestra actual. | Sustituir/verificar fotografía de 13 productos y cada variante; documentar permisos. | Matriz 13/13 y variantes con captura, nombre, color, fuente/licencia; ningún logo ajeno sin permiso. |
| **R3 · P0 · Johandry** | Archive conserva 12 nombres de imagen emparejados con Atelier en tarjetas y varias contradicciones visuales. | Fotografiar o licenciar objetos que correspondan a títulos/época/condición, y aportar procedencia prometida o corregir copy. | Revisión 12/12 PDP con foto propia fiel, detalles y expediente de derechos/procedencia. |
| **R4 · P1 · Johandry + Gemini** | Bento `Objects for the desk` abre 404. | Crear `desk-and-study` real o dirigir la tarjeta a una colección válida con nombre congruente. | Clic desde portada Edition termina en colección esperada, con productos y filtros. |
| **R5 · P1 · Gemini + Claude** | Archive input 2 produce $3,000 con stock 1; el servidor no lo agrega. | Sincronizar validación/normalización y total con límite de inventario, teclado y cambio de variante. | Repetir entrada 2, `+`, pegar y teclado a 390 y escritorio en todas las piezas 1 de 1; nunca mostrar total vendible de 2. |
| **R6 · P1 · Johandry + Gemini** | Pasarela visible; pedido completo no certificado aquí. | Verificar flujo Bogus Gateway en las tres demos y dejar constancia de pedido final, impuestos/envío y pasarelas activas. | Tres IDs de pedido de prueba, total por línea y método de pago de prueba; sin captura de datos sensibles. |
| **R7 · P1 · Gemini + Johandry** | Cambio USD→EUR/GBP no probado; no se observó selector de comprador en menús/footer inspeccionados. | Definir Markets activos y probar localización de país/moneda en portada/PDP/cápsula/cart/checkout; distinguir Shopify Preview Bar del control público. | Grabación o matriz de USD/EUR/GBP, importes y formato coherentes en tres demos si esos mercados se ofrecen. |
| **R8 · P1 · Gemini + Claude** | PDP Edition/Atelier muestreadas topan en 6; petición de 50 produjo 25 en carrito y featured muestra max25. | Diagnosticar inventario/reglas en Admin y alinear cantidad comprable entre PDP, featured y servidor. | Escenario aislado con stock conocido y mismo máximo en todas las superficies. |
| **R9 · P1 · Gemini + Claude** | ZIP contiene 12 referencias `shopify://shop_images/` en templates de los tres presets. | Instalar ZIP en tienda limpia y cotejar layout/medios/configuración con cada demo; eliminar recursos específicos de demo si no viajan. | Capturas y checklist de instalación limpia por preset. La presencia de rutas es riesgo, no prueba de imagen rota. |
| **R10 · P2 · Johandry** | Atelier 24/24 PDP con una foto y sin guía; footer escaso; Archive ciudades inconsistentes. | Añadir guía/fotos, políticas/enlaces visibles y unificar hechos de marca/logística. | PDP y navegación comprobadas en móvil y escritorio, con copy y destino coherentes. |

Los ajustes de guía, fotografía adicional, navegación y copy serían incrementos comerciales relevantes para el precio propuesto. El enlace 404, soporte privado y representación errónea del catálogo deben resolverse **antes** de enviar.

## 7. Evidencia reproducible y límites

- **Acceso público:** en in-app browser sin cookies, abrir `https://sartorial-atelier.myshopify.com/pages/theme-documentation` y `/pages/theme-support` terminó en `https://sartorial-atelier.myshopify.com/password` con `This store is password protected`. La visita autenticada da contenido, por lo que un HTTP 200 en preview no prueba disponibilidad pública. Shopify exige documentación y **formulario público** antes de lanzamiento. [Fuente primaria](https://shopify.dev/docs/storefronts/themes/store/requirements).
- **Enlaces y contenido:** clic en `Explore Objects for the desk` desde home Edition abrió `/collections/desk-and-study`, con `404 / Object not found`; portada Archive y Contact muestran Kyoto/Paris y Milan respectivamente. [Notas de marca](GPT-AUDIT-017-brand-notes.md).
- **Comercio:** [notas de merchandising](GPT-AUDIT-017-merchandising-notes.md) prueban 24/24 PDP, 87 opciones, Nove 38 y cápsula $2,250; [notas de transacción](GPT-AUDIT-017-transactions-notes.md) adjudican `/cart.js`/drawer del harness de Claude. Los resultados técnicos secundarios están en `agent-comms/outbox-claude/harness-AUDIT-FINAL-003/results-21-commerce-edge-{atelier,edition}.txt`.
- **Paquete:** `rg -n 'shopify://' listings/sartorial/templates/index.json listings/edition/templates/index.json listings/archive/templates/index.json | Measure-Object` → `Count: 12` en el árbol actual; no se instaló el ZIP en tienda limpia en esta auditoría. [Shopify explica la paridad requerida y que las imágenes de demo no se transfieren](https://shopify.dev/docs/storefronts/themes/store/requirements).
- **Accesibilidad y rendimiento:** `results-25-two-tone-ring-atelier.txt` registra foco visible y contraste contra banda; `results-04-cls-scroll-*` registra CLS bajo en velocidades muestreadas; `results-02b-axe-*` marca 0 violaciones automáticas con comprobaciones `incomplete`; `results-08-lighthouse-atelier.txt` registra home 64 móvil/97 desktop en una corrida. No hay certificación completa de promedio oficial en este dictamen.
- **No verificado:** pedido Bogus completado en este recorrido, entrega de email del formulario `mailto:`, licencia de cada imagen, provincia/tributos/envíos de checkout, EUR/GBP, todos los estados degenerados, accesibilidad manual completa, instalación limpia, derechos de marca/nombre, estado de Client Transfer de las tiendas. La revisión automática bloqueó el navegador del agente transaccional antes de ejecutar su nueva prueba; su conclusión se basa exclusivamente en artefactos locales de otro agente y no se presenta como observación propia en vivo.

**Regla de cambio de veredicto:** un pedido de prueba funcional por tienda y la resolución con prueba pública de todos los P0; además, el enlace 404, cantidad 1 de 1, coherencia de moneda y paridad de preset deben pasar sus pruebas de cierre. Hasta entonces la etiqueta `CERTIFICACIÓN COMPLETADA Y LISTO PARA SUBMISSION` de `BOARD.md` no refleja la evidencia comercial observada y Gemini debe revisarla.
