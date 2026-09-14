# GPT-AUDIT-4B-007: Reverification adversarial

ID: GPT-AUDIT-4B-007
Estado: **NO APTO para avanzar a la medicion FINAL de Gate 5 sobre bee742b.**
Decision requerida: Gemini debe autorizar la correccion de R01 y priorizar R02-R04; Claude aplica los cambios y GPT los reverifica. Se pueden continuar mediciones exploratorias, pero no cerrar la compuerta con esta version.

Resumen en 5 lineas:
1. Las ocho compuertas estaticas pasan; Theme Check inspecciona 74 archivos con 0 ofensas.
2. Una respuesta antigua de sincronizacion puede revertir visualmente una cantidad ya actualizada en Shopify: R01, P1.
3. F01 sigue incompleto en aperturas programaticas de busqueda; el flujo nativo menu -> carrito si pasa.
4. Los otros diez objetivos pasan dentro del alcance probado; aparecen dos defectos adicionales de desconexion y desmontaje.
5. Ningun archivo de produccion fue modificado. Se adjuntan cuatro parches propuestos, reproducciones y evidencia antes/despues.

Archivos tocados: este informe y `agent-comms/outbox-gpt/GPT-AUDIT-4B-007-artifacts/`. Preparacion, fixtures y candidatos exclusivamente en `.tmp/gpt-audit-4b-007/`, ignorado por Git.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementacion en produccion. Las propuestas no equivalen a autorizacion de cambio de arquitectura ni aceptacion del sprint.
Hallazgos extra fuera de alcance (con parche listo): R03 y R04 son adicionales a los doce objetivos originales, dentro de la busqueda adversarial autorizada. Parches adjuntos; no aplicados al tema.
Verificacion (comando, resultado y scope): seccion de comandos y tabla siguientes; resultados crudos en los artefactos.
Lista de afirmaciones falsables numeradas:
1. `manifest.json` compara 69 archivos de produccion y registra `productionFilesChanged: []`.
2. `F03-stale-open-response-after-mutation` registra cantidad visible 1 frente a cantidad real 2.
3. `F10-sixteen-HTML-mutation-errors` contiene 16 mensajes exactamente iguales al `dataset.errorMessage` correspondiente.
4. `F02-pending-variant-duplicate-submit` registra un solo POST y una sola unidad comprada, pese al cambio de variante y segundo intento de envio.
5. Los resultados `*-proposed.json` prueban candidatos servidos solo al navegador; no describen el tema desplegado como corregido.

## Base y metodo

- Fecha: 2026-09-14. Auditor: GPT/Codex, independiente del implementador de 4B-006.
- Commit real: `bee742bc1592677c0861fcb1db0fcfb61ac0afce`; `master...origin/master`, limpio al inicio.
- Tienda real: `tema-qkqpke0j.myshopify.com`. La consulta anonima al preview solicitado, ID `165809488115`, redirigio a `/password`. **No certifico que su configuracion desplegada coincida con esta fixture.**
- Las pruebas activas usaron Shopify CLI y el tema de desarrollo `165815288051`, mediante `http://127.0.0.1:9292`. No se publico ni se sobrescribio el tema solicitado.
- SHA-256 de `assets/theme.js` original y del archivo efectivamente servido: `ec5f81a2d967f7d25bc84d57c8d299e199aa817b201619ef0448c58fc848f9d2`.
- Snapshot de las ocho carpetas de produccion. Se habilitaron mediante JSON temporal notas, cross-sell, guia de tallas, bundle y featured product para ejercitar sus ramas. Ningun Liquid/CSS/JS del snapshot base fue parcheado.
- Chromium/Playwright, viewports 390x900 y 1440x900. Carritos anonimos propios; limpieza de notas y productos al terminar cada caso. Sin checkout, compras ni cambios de catalogo.
- Las mutaciones de cantidad y cross-sell se probaron contra Shopify. Para R01 se retuvo una respuesta HTML **obtenida de Shopify**, no se invento un carrito. Los errores HTTP y de transporte se inyectaron con routing de Playwright.
- F01 incluye una matriz de APIs de componentes, expresamente distinguida de los clics nativos. Los desmontajes usan los callbacks reales con DOM clonado o retirado, no una sesion del administrador Theme Editor.
- `formatMoney` se ejecuto dentro de su cierre original mediante un breakpoint CDP. No se copio ni se reimplemento el helper para probarlo.

## Tabla de los doce objetivos

Las lineas corresponden al archivo original del commit, no al candidato. `source-evidence.txt` conserva extractos numerados. Los nombres de probes permiten localizar la evidencia en los JSON.

| Objetivo | Resultado | Codigo y evidencia empirica |
|---|---|---|
| 1. F01: dialogos concurrentes | **PARCIAL; R02** | `assets/theme.js:L64-L73`, `L225-L244`, `L894-L905`, `L1395-L1419`, `L2721-L2744`. Menu -> carrito con clics nativos: un dialogo activo, no inert, 20 Tab + 20 Shift+Tab sin escape del foco y retorno al trigger al pulsar Escape. Matriz de APIs: 9/12 direcciones pasan; las tres que abren predictive search en segundo lugar dejan dos paneles inert y foco en BODY. |
| 2. F10: HTML 500/502/503/429 | **PASA el alcance HTML** | `assets/theme.js:L1490-L1495`, `L1539-L1544`, `L1582-L1588`, `L2237-L2247`. Probe `F10-sixteen-HTML-mutation-errors`: 4 rutas x 4 estados, 16/16 mensajes traducidos del dataset, sin SyntaxError ni `pageerror`. Desconexion sin respuesta HTTP: defecto separado R03. |
| 3. F02: variante durante alta pendiente | **PASA** | `assets/theme.js:L599-L601`, `L1464-L1472`, `L1500-L1508`. Se retuvo el POST, se selecciono Medium tras enviar Small y se intento `requestSubmit` otra vez. Boton deshabilitado, flag `true`, un POST y `item_count=1`. Se compro la variante original, no una segunda variante accidental. |
| 4. F04: nota y foco tras mutacion | **PASA los dos flujos probados** | `assets/theme.js:L1292-L1294`, `L1636-L1651`. Probe `F04-native-note-and-focus-mutations`: cambio de cantidad y cross-sell reales preservan `Keep this unsaved draft: gift for Ada` y `data-dirty=true`; foco dentro del drawer en ambos casos, no BODY. No se certifica aqui la persistencia al eliminar la ultima linea ni envio de nota al checkout. |
| 5. F03: sincronizar cada apertura | **FALLA por regresion R01** | `assets/theme.js:L1419`, `L1597-L1620`. El reemplazo entre pestañas con igual conteo si actualiza producto y precio al reabrir. Pero un GET de apertura atrasado reemplaza el resultado de un POST mas reciente: UI=1, Shopify=2. No hay revision ni exclusion entre lectura y mutacion. |
| 6. F06: filtros de precio | **PASA codigo y render numerico probado** | `sections/main-collection.liquid:L108-L153`, `sections/main-search.liquid:L139-L175`. Ambas usan las tres divisiones por `100.0`. Shopify renderizo `value="1250.5"`, `max="12500.0"`, `step="any"`; inputs validos en coleccion y busqueda. Al operar sobre numeros, no se interpretan espacios ni comas de un string monetario. No se cambio la moneda base/Markets de la tienda para este probe. |
| 7. F05: cantidad requerida | **PASA** | `sections/main-product.liquid:L299-L311`, `sections/featured-product.liquid:L151-L166`, `sections/cart-drawer.liquid:L198-L213`, `assets/theme.js:L1377-L1392`. Inputs externos asociados al formulario correcto, `required=true`, sin `novalidate`. Clic nativo en ATC con campo vacio en PDP y featured: cero POST. Vaciar cantidad en drawer: cero `/cart/change.js`, linea conservada. La excepcion literal `0` sigue siendo borrado intencional. |
| 8. F08: doble escape | **PASA** | `snippets/predictive-search.liquid:L29`, `sections/main-search.liquid:L43`, `L279`. Busqueda real `Silk "Ink" & dye`: comillas y ampersand legibles; sin entidades `&quot;`/`&amp;` visibles. Predictive search muestra el enlace de todos los resultados con comillas normales. |
| 9. Badges de oferta | **PASA el esquema probado** | `assets/base.css:L70-L71`, `L982-L995`. En coleccion real, Sale computa fondo `rgb(29, 27, 24)` y texto `rgb(247, 243, 234)`, conforme a los tokens; Sold out conserva fondo transparente. No sustituye medicion de contraste de los quince esquemas. |
| 10. F07: dinero | **PASA el contrato probado** | `assets/theme.js:L75-L124`. Los ocho tokens producen el resultado esperado. `100000` -> `JPY 1,000`; `125050` -> `1.250,50 EUR`; `&pound;` -> `£`. Trece entradas invalidas devuelven vacio; string entero valido aceptado; formato desconocido y fallbacks invalidos -> `$120.00`. Sin uso de Intl. Ver resultados del helper real, no stub. |
| 11. F09: URL con info | **PASA** | `static-results.json`: 13 URL en total; las 10 objetivo usan y resuelven `t:sections.all.link_destination_info`, definido en `locales/en.default.schema.json:L302`. Las otras tres ya tenian info propia traducida. No hay 13 defectos ni faltan tres correcciones. El inventario incluye archivo, linea e ID de cada setting. |
| 12. rAF tras desmontaje | **PASA las dos guardas** | `assets/theme.js:L2429-L2434`, `L2476-L2480`, `L2550-L2557`. Announcement: timer inicialmente activo, un rAF pendiente, retirada del nodo y ejecucion del callback -> timer `null`. Password: marcador de error, un rAF pendiente y retirada -> `open=false`, sin `body[data-modal-open]`. Esto no es un perfil exhaustivo de memoria. R04 es otra clase de problema de desmontaje. |

## Hallazgos vigentes y parches

**Balance: 1 P1 y 3 P2. No se demostro un nuevo P0 mediante un flujo nativo de comprador en esta muestra.** La regresion R01 basta para el dictamen NO APTO. Una prueba positiva parcial no certifica ausencia de otros defectos.

### R01 [P1 Fallo Funcional Grave]: sincronizacion atrasada revierte el carrito

- Archivo/lineas: `assets/theme.js:L1597-L1600` (`syncCart`), `L1617-L1620` (`renderCartResponse`), `L1559-L1593` (`changeLine`); apertura en `L1419`.
- Origen: regresion de 4B-006. Antes, el conteo igual evitaba esta lectura; ahora la lectura existe siempre pero no participa en el control de concurrencia de las mutaciones.
- Reproduccion: tener una unidad de `qa-16-single-char`; abrir el drawer; retener la respuesta real de `/cart?section_id=cart-drawer`; cambiar cantidad a 2 y esperar el POST; liberar despues el HTML de la primera lectura.
- Resultado observado: `fresh.count="2"`, `late.count="1"`, `/cart.js.item_count=2`, `/cart.js.total_price=12000`. Evidencia: `browser-results-effective.json`, probe `F03-stale-open-response-after-mutation`; `stale-cart-mobile.png`.
- Impacto: cantidad, subtotal, contador y recompensas visibles dejan de representar el carrito que recibe checkout. Un comprador puede volver a ajustar una cantidad a partir de un estado falso.
- Parche listo: `GPT-AUDIT-4B-007-artifacts/patches/R01.patch`. Introduce revision de sincronizacion y contador de mutaciones, invalida la lectura previa en las cuatro rutas y aplaza la sincronizacion de apertura hasta terminar la mutacion. No suprime la actualizacion con conteo igual y no reintenta compras automaticamente.
- Prueba del candidato: el mismo probe termina con UI=2 y Shopify=2. Tambien pasan cambio de variante durante alta, notas/cross-sell y las 16 respuestas HTML.
- Limite: el parche coordina lecturas de apertura frente a mutaciones; no pretende serializar arbitrariamente todos los POST emitidos por apps externas o por otras pestañas.

### R02 [P2 Pulido de Borde]: la exclusion de dialogos no es universal

- Archivo/lineas: `assets/theme.js:L2721-L2744` (`PredictiveSearch.setOpen`); mismo patron ausente en `PickupAvailability.open`, `L1106-L1119`, y `PasswordModal.open`, `L2579-L2594`. La funcion comun existe en `L64-L73`.
- Origen: F01 corregido parcialmente, no un fallo nuevo en el flujo nativo menu -> carrito.
- Reproduccion de contrato en la pagina real: ejecutar `document.querySelector('cart-drawer').open()` y luego `document.querySelector('predictive-search').setOpen(true)`; repetir desde menu y guia de tallas.
- Resultado: ambos paneles y sus ancestros quedan inert; Tab mantiene BODY; el primer Escape cierra el dialogo anterior, no la busqueda recien solicitada. Evidencia: matriz de 12 direcciones y `dialog-cart-to-search-mobile.png`.
- Impacto: una integracion que abra componentes programaticamente puede bloquear sus controles. **No afirmo que un comprador pueda clicar el trigger de busqueda bajo inert ni lo califico como rechazo P0 demostrado.** El flujo nativo accesible probado pasa.
- Parche listo: `GPT-AUDIT-4B-007-artifacts/patches/R02.patch`; llamar a `closeOtherDialogs(this)` antes de alterar estado/inert en las tres aperturas omitidas, conservando el target de retorno antes de cerrar el origen cuando corresponda.
- Prueba del candidato: la matriz pasa 12/12 para exclusion, ausencia de inert en el panel nuevo y cierre con Escape. Esto no certifica todos los posibles targets de retorno de foco de una integracion programatica. Pickup y Password reciben la misma correccion por barrido de codigo; no se simulo una ubicacion de recogida configurada.

### R03 [P2 Pulido de Borde]: desconexion muestra la excepcion del navegador

- Archivo/lineas: `assets/theme.js:L1478-L1485`, `L1521-L1534`, `L1564-L1577`, `L2225-L2234` (los cuatro `fetch` de compra). Los catches JSON posteriores no capturan un rechazo previo de `fetch`.
- Origen: preexistente; el parche F10 resuelve HTML HTTP pero no esta rama distinta de transporte.
- Reproduccion: usar los controles reales de PDP, cross-sell, cantidad y bundle con la ruta correspondiente abortada por Playwright (`route.abort('failed')`). Equivale a una peticion sin respuesta HTTP, no a un HTML 500.
- Resultado: los cuatro mensajes visibles son `Failed to fetch`, en vez del dataset localizado. Los controles vuelven a estar utilizables; no se demostro duplicacion ni alta en este probe.
- Impacto: se filtra jerga tecnica en ingles y se pierde la instruccion traducida de recuperacion justo durante una compra. Evidencia: `edge-results.json`, `network-disconnection-four-flows`.
- Parche listo: `GPT-AUDIT-4B-007-artifacts/patches/R03.patch`. Wrapper `fetchCommerce` que conserva `AbortError` y convierte fallos de transporte en el mensaje del componente, sin reintentos automaticos.
- Prueba del candidato: cuatro rutas con mensaje exacto esperado; las 16 combinaciones HTML siguen pasando.

### R04 [P2 Pulido de Borde]: desmontar un dialogo cerrado quita el scroll lock ajeno

- Archivo/lineas: `assets/theme.js:L216-L218`, `L237` (`ThemeDrawer`); misma propiedad global sin comprobacion de propietario en `L917`, `L1127`, `L1428`, `L2603` y `L2729`.
- Origen: preexistente, distinto del rAF tardio reparado en 4B-006.
- Reproduccion: abrir el carrito y retirar del DOM el `theme-drawer` cerrado, modelando la descarga/recreacion del header en Theme Editor. No hace falta abrir el menu.
- Resultado: carrito sigue `data-open`; `body[data-drawer-open]` pasa de presente a ausente y overflow de `hidden` a `visible`. Evidencia: `edge-results.json`, `closed-header-unmount-while-cart-open`.
- Impacto: el editor puede dejar un modal abierto con scroll de pagina habilitado. No se demostro que este caso por si solo deje inert colgado ni una fuga de memoria.
- Parche listo: `GPT-AUDIT-4B-007-artifacts/patches/R04.patch`. Recalcular los dos scroll locks segun los dialogos realmente abiertos en el documento al cerrar/desmontar, en lugar de borrar el atributo compartido incondicionalmente.
- Prueba del candidato: retirar el menu cerrado mantiene carrito abierto y overflow `hidden`; los dos probes rAF y el recorrido de teclado siguen pasando. No sustituye una sesion completa del Theme Editor real.

## Comandos y resultados

Evidencia conservada en `GPT-AUDIT-4B-007-artifacts/`. Comandos ejecutados desde la raiz del repositorio; `.cmd` evita el wrapper PowerShell de npm en Windows.

| Comando | Resultado observado | Alcance |
|---|---|---|
| `npm.cmd run gates:static` | Exit 0; 34 JSON, hooks sin contratos rotos, sanity detecta las tres mutaciones, locales sin claves irresueltas, ledger sin incoherencias, `74 files inspected with no offenses found.`, ZIP `Sartorial-1.0.0.zip` | Registro completo en `gates-static.log`. No detecta las carreras demostradas. |
| `node --check assets/theme.js` | Exit 0, ejecutado por `gates:syntax` | Sintaxis, no comportamiento. |
| `node .tmp/gpt-audit-4b-007/browser-audit.mjs` | 12 probes; fallos de F01/F03 y una asercion de titulo corregida despues; sin errores del harness | Resultado crudo conservado, no ocultado. |
| `node .tmp/gpt-audit-4b-007/browser-audit.mjs same-count` | `checks:1, failed:[], harnessErrors:[]` | La asercion original buscaba el titulo supuesto `Sale item`; se sustituyo por el titulo real del catalogo. `browser-results-effective.json` combina solo esta correccion con el resto de resultados originales. |
| `node .tmp/gpt-audit-4b-007/edge-audit.mjs` | 7 probes; fallan R03 y R04; sin errores del harness | Incluye rAF, teclado, catalogo y formularios nativos. |
| `node .tmp/gpt-audit-4b-007/static-audit.mjs` | `urlSettings:13, targetedByF09:10, alreadyHadOtherInfo:3, pass:true` | Conteo real y resolucion de info; no disponibilidad de las URLs. |
| `git apply --check --whitespace=error <R01..R04.patch>` | Exit 0 para cada parche | Comprobacion sin escritura sobre produccion. |
| `node .tmp/gpt-audit-4b-007/run-proposed.mjs` | Suite seleccionada: 6 probes sin fallos; suite de bordes: 7 sin fallos; ambos procesos exit 0 | Parches combinados, solo como respuesta de `theme.js` en el navegador. No se reemplazo el asset del tema de desarrollo ni del publicado. |
| `node .tmp/gpt-audit-4b-007/run-proposed.mjs --validate-only` | Los cuatro patches aplican en copia temporal; sintaxis combinada exit 0 | Runner reproducible desde artefactos. |
| Comparacion SHA-256 de produccion | `productionFilesCompared:69, productionFilesChanged:[]` | `manifest.json` y `baseline-hashes.json`. No commit ni push. |

Los parches individuales y el combinado pasaron `node --check`. **No se afirma que los parches hayan pasado las ocho compuertas como entrega de produccion**: eso corresponde a su futura implementacion autorizada. La corrida de ocho compuertas de este informe evalua bee742b.

Al cerrar la auditoria se detuvo el servidor de preview. `git diff --check` paso; el estado de Git solo muestra como nuevos este informe y su carpeta de evidencias. `delivery-verification.json` registra la comprobacion final de integridad y sintaxis de los scripts entregados.

## Limites y siguiente compuerta

- El catalogo real tiene 17 productos, maximo 24 variantes, 4 imagenes y titulo maximo de 124 caracteres. Se recorrieron vacio por filtro, una variante, 24 variantes, titulo largo, sin imagen y sin descripcion; en esos seis casos hubo un H1 y ancho movil de 390 sin overflow horizontal. **No** se certifican 50/250 variantes, 10+ imagenes ni catalogo paginado de 200 productos.
- No se midieron Lighthouse, axe, CLS, los quince esquemas, lectores de pantalla, Safari/iOS ni funcionalidades de apps. Gate 5 sigue pendiente.
- Las reglas de [Shopify Theme Store](https://shopify.dev/docs/storefronts/themes/store/requirements) incluyen operacion por teclado y accesibilidad; Theme Check verde no valida esos comportamientos. Los `info` aqui verificados son tambien parte del protocolo interno; no se infiere rechazo automatico de Shopify por cada P2.
- [Shopify documenta los ocho formatos monetarios](https://help.shopify.com/en/manual/international/pricing/currency-formatting) y advierte que la configuracion de formato base no gobierna todas las monedas de Markets. El resultado JPY/EUR verifica el formatter, no una compra multimoneda completa. [Liquid devuelve subunidades tambien para JPY](https://shopify.dev/docs/api/liquid/objects/variant), por lo que dividir el importe crudo por 100 es correcto para esa representacion.
- Ledger: ninguna fila cerrada ni archivo modificado. Gemini debe reconsiderar la evidencia de la fila **Focus Trap y Gestion en Modales/Drawers** (`docs/requirements-ledger.md:L49`), limitandola a los flujos demostrados, y asociar R01 al contrato de carrito antes del cierre de Gate 5. No se amplia su estado `cumplido` por esta auditoria.
- Responsable de priorizar y emitir directiva: Gemini. Responsable propuesto de implementar: Claude. Reverificacion independiente: GPT. Aprobacion final y eventuales excepciones: Johandry.

**Conclusion:** no dar por blindado bee742b. Corregir R01, resolver o aceptar explicitamente los P2 con sus limites, repetir las reproducciones sobre el commit resultante y entonces ejecutar la medicion final de Gate 5.
