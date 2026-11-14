# Matrices de tienda en previews del lote C

ID: GPT-TEST-MATRICES-20261107-001  
Estado: ejecución con cobertura parcial. Evidencia cruda por matriz en el directorio relativo indicado en cada sección.  
Decisión requerida: revisión independiente por matriz y resolución de los casos pendientes documentados.  
Resumen en cinco líneas: se probaron únicamente previews no publicadas. La identidad se verificó en las corridas previas de A-03, B-01 y B-03. Quedó sin verificar en los accesos de B-04. Se separan las observaciones de cada criterio de aceptación. Las operaciones de carrito usan un contexto de invitado y limpieza verificable. La regresión C-01 requiere identificar ambos builds para cada par. El informe no cierra filas del ledger.\
Archivos tocados: este informe y JSON sanitizados en harness-GPT-MATRICES-20261107-001/results/.  
Desviaciones: el arnés efímero amplía las observaciones del arnés D28 sin editar su fuente. Se conservan las restricciones de red y el protocolo de limpieza.  
Hallazgos extra: ninguno fuera de las matrices.  

## Alcance y método

Tienda tema-qkqpke0j.myshopify.com. CLI local 4.8.0. Inventario ejecutado antes de cada matriz con:

~~~powershell
node .\node_modules\@shopify\cli\bin\run.js theme list --json --role unpublished --store tema-qkqpke0j.myshopify.com
~~~

Los tres IDs elegidos por la directiva son 190232297715 (Sartorial), 190232330483 (Imprint) y 190232363251 (Archive). Las consultas preflight de cada corrida registrada salieron con código 0 y los tres IDs con role unpublished y processing=false. Los JSON de las matrices previas A-03, B-01 y B-03 registran la identidad de las sesiones que accedieron al preview mediante Shopify.theme.id. Los intentos de acceso de B-04 quedaron sin identidad verificada. Se usaron contextos Chromium nuevos, sin perfil personal y DPR 1. Las preferencias de movimiento se emularon en el navegador. El inventario CLI acredita el rol de los temas, no un SHA del árbol completo. Las huellas abajo son SHA-256 del cuerpo de cada asset observado.

| Preset | base.css servido | theme.js servido |
|---|---|---|
| Sartorial | d30648c182a7929bcf88ac5d05781543be0a0d7771d7c21d6a742b1cc8f84a63 | 89baa75dd5389767787aa351dcd256d57344d09d683b4686ef0abf7bf3e7cd13 |
| Imprint | 0adc02af370db91ef7219587c0fa216069205b78fce3b9823b9588523261dde2 | 0532b78515106c88461e465a58fb794389e33d9b6eb7f9fd7ef4834a0e1dfeab |
| Archive | cabe253ee8805f9b80aa5171647a048d3489e68e2b441610d1e8df2f3ebf2480 | f29ebf55a139e0815372b0b054b87ab98f98d521349b4d60221b5668400e76df |

## A-03 · Parcial, con focos para revisión visual

[JSON A-03](harness-GPT-MATRICES-20261107-001/results/matrix-A-03-20261108T072012205Z-f399d2b5-386d-4a07-aaad-4d7c8cd31310.json)

36/36 combinaciones de preset, 390×844/1280×800, reduce/no-preference y home/colección/PDP obtuvieron muestras de Tab y Shift+Tab. El campo passed de cada fila acredita la toma de muestras. La estimación de contraste usa el color del outline computado y el primer fondo ancestro opaco. Los fondos con imagen o transparencia, sombras sin outline y variantes de hover requieren otra medición. Los eventos incluyen repeticiones al recorrer rutas, tamaños y movimiento.

| Preset | Eventos de foco | No visibles o inertes | Estimaciones <3:1 | Mínimo global estimado | Eventos footer scheme-2 | Mínimo computable footer scheme-2 |
|---|---:|---:|---:|---:|---:|---:|
| Sartorial | 633 | 0 | 12 | 1,22:1 | 168 | 15,65:1 |
| Imprint | 598 | 0 | 12 | 1,11:1 | 168 | 18,09:1 |
| Archive | 586 | 0 | 8 | 1,38:1 | 168 | 10,46:1 |

Los valores bajos se registraron en el contenido principal y requieren atribución al control y fondo reales antes de cerrar un defecto. El JSON conserva zona, esquema CSS, tipo de control, outline y sombra. Pendientes los píxeles sobre hero, foco con hover, estados deshabilitados, capturas de confirmación y la cobertura específica de stepper/checkout en drawer. No se usó el carrito.

## B-01 · Parcial

[JSON B-01](harness-GPT-MATRICES-20261107-001/results/matrix-B-01-20261108T072307840Z-09c61102-b653-4e65-b8d3-5f433649c7b0.json)

En cada preset se registraron 4 secuencias. Con 390×844 → 1280×800 → 390×844 el menú cerró al pasar al escritorio, liberó el bloqueo de scroll y el inert de main. Al volver a móvil siguió cerrado y la muestra de foco quedó en BODY. Con 820×1180 → 1180×820 se observó el cierre y liberación. El inicio inverso a 1180 px no ofreció disparador móvil. Ambas orientaciones de 390×844 ↔ 844×390 mantuvieron abierto el menú hasta Escape. Las 12 comprobaciones de axe después de los cruces devolvieron cero violaciones bajo las reglas seleccionadas de axe-core 4.10.2. Se verificó apertura/cierre del carrito vacío desde el encabezado en los tres presets sin mutar el carrito.

El caso de abrir carrito desde el menú quedó pendiente en 3/3 por ausencia de un enlace de carrito en el panel buscado. Quedan pendientes editor, dispositivo físico y un cruce con scroll inicial distinto de cero. El foco en BODY al volver al viewport estrecho queda señalado para valoración de continuidad del teclado.


## B-03 · Parcial. Limpieza sin verificar

[JSON B-03](harness-GPT-MATRICES-20261107-001/results/matrix-B-03-20261108T072412209Z-8b45f271-e4e3-40c6-93ce-34111b6e782d.json)

Se llegó solo a Sartorial 190232297715 en 390×844. La identidad de preview y el carrito de invitado inicialmente vacío y sin nota se verificaron antes de autorizar POST de carrito. Se usó una unidad y una variante de compra única por escenario.

| Superficie | Pérdida de respuesta | Solicitud descartada y reintento |
|---|---|---|
| PDP | Shopify respondió 200 a la petición reenviada. Chromium recibió connection reset y la lectura de la sesión verificó una línea de la variante esperada con cantidad 1. | La petición descartada dejó 0 artículos. Check cart recibió foco y el mensaje tenía role alert. El reintento verificó la línea esperada con cantidad 1. |
| Destacado | No se pudo verificar. El arnés registró HARNESS_OPERATION_FAILED. | No se pudo verificar una única línea tras el reintento. El arnés registró RETRY_DID_NOT_ADD_ONE_EXPECTED_LINE. |
| Compra rápida, barra fija, complete the look | Pendiente por interrupción. | Pendiente por interrupción. |

Los fallos del destacado coincidieron con respuestas HTTP 429 y lecturas no concluyentes. El resultado no distingue un defecto del tema de una restricción de la prueba. Las celdas de escritorio, Imprint y Archive, las reglas de cantidad, múltiples líneas y comprobaciones con lector de pantalla siguen pendientes. No se intentaron los casos de suscripción.

La limpieza intermedia de B-03 falló. El bloque finally agotó el reintento D28 de las tres operaciones en la misma sesión. POST /cart/clear.js, POST /cart/update.js y GET /cart.js terminaron con HTTP 429. La cantidad final y la nota quedaron sin verificar. El JSON registra scopeResult=awaiting_intervention, cleanupIncident=CART_CLEANUP_UNVERIFIED, contextPreserved=true, browserPreserved=true y contextClosed=false. No hay confirmación de carrito limpio.

En el momento del incidente, la sesión de ejecución 63167 quedó retenida. Una consulta de procesos de solo lectura confirmó el proceso Node PID 15328 y su hijo Chromium PID 40576. Se intentó enviar el único comando documentado, retry-cleanup, y la herramienta respondió que stdin estaba cerrado porque el comando no se inició con TTY. El contador de intentos del runner sigue en cero porque la orden no llegó. El Chromium original usa un contexto no persistente y el arnés no documenta reanexión fuera de ese canal. No se cerró ni mató ningún proceso ni se creó un contexto alternativo. Se bloqueó el arranque de las matrices restantes en la instrumentación temporal.

### Seguimiento del incidente · 2026-11-08 10:54 (Caracas)

Estado del carrito y de la nota: **sin verificar**. Disposición autorizada: `LEAVE_TO_EXPIRE`. La sesión de ejecución 63167 ya no existe. El sondeo sin entrada devolvió `write_stdin failed: Unknown process id 63167`. Una consulta de procesos de solo lectura devolvió `OriginalNodePresent=false`, `OriginalBrowserPresent=false`, `MatchingRunnerCount=0`, `MatchingBrowserChildCount=0` y confirmó que los PID originales 15328 y 40576 ya no estaban ocupados.

No había contexto original para reanexar o cerrar. La espera de Retry-After y los reintentos de limpieza no se pudieron ejecutar en esa sesión. No se creó otro contexto, no se hicieron peticiones adicionales a Shopify y no se reanudaron las matrices. Se desconoce cuándo o por qué terminó el proceso. LEAVE_TO_EXPIRE deja el carrito a la expiración de la sesión y no acredita que Shopify lo haya vaciado ni que ya haya expirado. El JSON original se conserva como snapshot del incidente.

## B-04 · Bloqueada por cleanup B-03

Sin casos ejecutados. Quedan pendientes nota sucia, limpia y oculta, eco exacto con saltos de línea/espacios/emoji y 2.000 caracteres, red lenta o interrumpida, edición en vuelo, mutaciones concurrentes, checkout nativo y verificación de teclado y anuncios. No se ejecutó B-04. Sí hubo contextos temporales solo para comprobar el acceso y realizar el sondeo GET, sin tocar el carrito.

## B-02 · Bloqueada por cleanup B-03

Sin casos ejecutados. Quedan pendientes cambio A→B sin JS en PDP y destacado, URLs de variante disponible y agotada, combinación multiopción y comprobación del ID del formulario.

## C-01 · Bloqueada por cleanup B-03

Sin casos ejecutados. Se identificaron las huellas CSS/JS de las previews durante A-03. Eso no acredita los seis pares de builds antes/después y no sirve como baseline C-01. Quedan pendientes la matriz de posición de la primera tarjeta, interacción de filtros, orden, vacío y AJAX, sticky, y observaciones LCP/CLS.

## Evidencia y límites de revisión

| Archivo | SHA-256 |
|---|---|
| matrix-A-03-20261108T072012205Z-f399d2b5-386d-4a07-aaad-4d7c8cd31310.json | db9aba967bd5b712b992a141c55c2ecdbcd3b13e1c2d6e25ec86dd86b55f29c1 |
| matrix-B-01-20261108T072307840Z-09c61102-b653-4e65-b8d3-5f433649c7b0.json | 564719f00ad78c0b6d44aaa7ef30b4e4ef8af6cbbcc562b661f23f65c7d58d5d |
| matrix-B-03-20261108T072412209Z-8b45f271-e4e3-40c6-93ce-34111b6e782d.json | 5c72794b450a8a9e5cb1e1426e7e7a6cd64bc18b16286b98dbf8927068910fa5 |
| Arnes base D28, run.mjs | dfb30247570c666e2b0846cd7bd1cfb499c250cdf50fd5f40306e51c991cd6fa |

No se capturaron pantallas ni se fijó una huella contemporánea del wrapper efectivo de A-03. Las copias temporales están en scratch/ y se ajustaron entre matrices, por lo que su hash actual no acredita el script exacto de esa corrida. El JSON de B-03 es el snapshot de intervención y carece de finishedAt. Los estados blocked se asignan aquí porque el cleanup de B-03 interrumpió la secuencia.

Verificación en terminal. El inventario de B-01 y B-03 devolvió respectivamente:

~~~text
B-01 cli=4.8.0 preflight=0 unpublished=190232297715,190232330483,190232363251
B-03 cli=4.8.0 preflight=0 unpublished=190232297715,190232330483,190232363251
~~~

El inventario de A-03 devolvió versión 4.8.0 y exit 0, con los mismos tres IDs en role unpublished y processing=false. El runner de A-03 y B-01 emitió scope_result=completed_with_limits. La salida literal de la sesión B-03 fue:

~~~text
intervention_required=CART_CLEANUP_UNVERIFIED report=matrix-B-03-20261108T072412209Z-8b45f271-e4e3-40c6-93ce-34111b6e782d.json manual_command=retry-cleanup
~~~

Afirmaciones falsables.

1. Los JSON de A-03 y B-01 contienen tres accesos con previewIdVerified=true y los contextos terminaron cerrados sin mutaciones de carrito.
2. B-03 documenta dos casos PDP con una línea exacta y dos comprobaciones de destacado sin evidencia suficiente.
3. El snapshot original de B-03 contiene tres HTTP 429, cantidad desconocida y un contexto retenido al guardar. La comprobación posterior confirma que el contexto original ya no está disponible. B-04, B-02 y C-01 carecen de evidencia de ejecución.
4. La ejecución no cambia el ledger. Los resultados son pruebas empíricas parciales de las previews indicadas.


## Reanudación del 2026-11-08 · Bloqueada por acceso a storefront

El cierre LEAVE_TO_EXPIRE permitió planificar una sesión nueva. El inventario Shopify CLI 4.8.0 devolvió exit 0 a las 11:23 y de nuevo a las 11:25 (Caracas). Los IDs 190232297715, 190232330483 y 190232363251 seguían unpublished con processing=false. Ese resultado acredita el estado administrativo de los previews.

La matriz B-04 quedó sin ejecutar. Se abrió un contexto aislado en Sartorial con canal TTY para comprobar el acceso y, después, tres contextos de invitado para el sondeo GET. Ninguno tocó el carrito. El único POST /password de la sesión falló con AUTH_RESPONSE_NOT_ACCEPTED. El JSON no conserva el código HTTP de ese POST, por lo que la causa concreta queda indeterminada. No hubo eventos de reintento por 429, cartTouched=false y contextClosed=true. No se verificó ni autorizó un carrito de prueba y no hubo limpieza que ejecutar en ese contexto.

Se comprobó el acceso sin repetir el POST. Playwright, en tres contextos de invitado y solo GET, no consiguió abrir el contenido ni verificar Shopify.theme.id. Para distinguir la causa de ese fallo genérico, un sondeo HTTP sin cookies, con redirects manuales limitados al origen de tienda y sin leer cuerpos, observó 302 hacia home y 302 hacia password para los tres IDs. El sondeo solo registra el código y la categoría del destino, sin valores de query, cookies ni secretos.

| Evidencia | Resultado | SHA-256 |
|---|---|---|
| [B-04, intento de acceso](harness-GPT-MATRICES-20261107-001/results/matrix-B-04-20261108T152347800Z-74fd6a9e-00d7-4d0b-90a4-43ec8a8b2918.json) | AUTH_RESPONSE_NOT_ACCEPTED, sin carrito | dbd42c743031906fcff7471ed03b37b79beea8294cd7c74fd7a21a409be4f76e |
| [Playwright, acceso GET](harness-GPT-MATRICES-20261107-001/results/matrix-B-04-20261108T152529531Z-9259a93c-838f-4a0b-8d2c-b57522bc9528.json) | 3/3 sin acceso, sin carrito | 6353ed89e2395c661bfe3296eb3d3d390bbc2dababfd0ec24f0c0ccead84004 |
| [Sondeo HTTP GET sin cookies](harness-GPT-MATRICES-20261107-001/results/storefront-get-only-barrier-20261108.json) | 3/3 redirigidos a password | 51f9e3c9d480df93c5ec8bb838078f7a0380d594cd926142dd48582e1126212c |

D28 limita la autenticación a una operación por contexto, con reenvíos solo tras HTTP 429. Se detuvo la secuencia de acuerdo con D10 ante la incertidumbre de acceso. B-04 quedó bloqueada antes del carrito. B-02, C-01 y las coberturas faltantes de A-03/B-01 quedaron sin iniciar por la misma barrera en los tres previews. Los resultados parciales anteriores conservan su alcance. Los casos que requieren fixtures o datos de Johandry conservan sus bloqueos independientes.


## Sondeo de autenticación tras la actualización · 2026-11-08

El intento autorizado de las 11:52 (Caracas) devolvió HTTP 302, sin HTTP 429, con destino en el mismo origen y ruta /. Se usó un contexto aislado nuevo y se desactivó el seguimiento de redirects. El GET fijo de comprobación, también sin seguir redirects, dejó Shopify.theme.id sin verificar. El contexto se cerró con cartTouched=false.

[JSON del sondeo](harness-GPT-MATRICES-20261107-001/results/storefront-auth-probe-20261108.json). SHA-256 b439faf870c072486353a2175923a8af1491b8ab89a913c6bfbe48fc0da2be09.


## B-04 · Corrida posterior al sondeo, Sartorial · Parcial

Se despachó la corrida tras el HTTP 302 del sondeo y antes de que llegara la instrucción de detenerla. El preflight de las 11:54 (Caracas) confirmó CLI 4.8.0, exit 0 y los tres IDs unpublished con processing=false. Se dejó completar únicamente este runner ya iniciado para proteger el finally. Sartorial 190232297715 acreditó Shopify.theme.id y un carrito de invitado inicialmente vacío y sin nota.

La evidencia registra un POST de autenticación en el sondeo y uno en el contexto aislado de B-04. Ninguno recibió HTTP 429. El contexto del sondeo se había cerrado antes de que se indicara conservarlo, y el de B-04 se cerró automáticamente al verificar la limpieza. No quedó una sesión autenticada para reutilizar.

| Caso | 390×844 | 1280×800 |
|---|---|---|
| Preparar una línea de carrito | Una línea verificada | Una línea verificada |
| Nota sucia y View cart | No ejecutado, textarea no visible | No ejecutado, textarea no visible |
| Nota limpia y View cart | PLAYWRIGHT_TIMEOUT | PLAYWRIGHT_TIMEOUT |
| Solicitud interrumpida | PLAYWRIGHT_TIMEOUT | No ejecutado, textarea no visible |
| Edición en vuelo | CHROMIUM_ERR_FAILED | No ejecutado, textarea no visible |

El runner terminó con exit 1. Registró fallos de lectura GET durante la navegación. La ausencia de un textarea visible y los errores del arnés dejan la matriz incompleta. Quedan pendientes el eco de la nota, la edición concurrente, las comprobaciones de teclado y anuncios, y el checkout nativo.

La limpieza final de la misma sesión devolvió HTTP 200 en /cart/clear.js, /cart/update.js y /cart.js. Se verificaron cero artículos, cero líneas y nota vacía. cartTouched=true, contextClosed=true y sin incidente pendiente. No hubo eventos HTTP 429. B-02, C-01 y las coberturas restantes de A-03/B-01 no se iniciaron en este tramo.

[JSON B-04 Sartorial](harness-GPT-MATRICES-20261107-001/results/matrix-B-04-20261108T155404698Z-ae8c6a9d-b7e9-4237-bf8c-011051686e29.json). SHA-256 e71d73b9ffd6b5ea6936d12f791bf266fa814fc97f954a4a75369cd4327686a4. SHA-256 del runner efectivo ce429552508b69da0ce0fba012551de56028df98ff117609127036038a2def1c.


## Sesión persistente de reanudación · 2026-11-08

Se usó un BrowserContext de invitado con TTY durante B-04 y B-02. El registro contiene un único POST de autenticación y cero HTTP 429. CLI 4.8.0 confirmó los tres IDs unpublished con processing=false en los preflight de B-04 y B-02. La sesión verificó la identidad Sartorial antes del carrito y las tres identidades en B-02. Para B-02 se desactivó la ejecución de JavaScript por CDP en la misma página y se comprobó la identidad desde la declaración HTML de Shopify. Las huellas CSS/JS coinciden con las registradas en este informe para los tres presets.

| Matriz | Resultado del tramo | Casos pendientes |
|---|---|---|
| B-04 · Sartorial | Parcial. Se preparó una línea de prueba y se verificó que View cart se podía activar por teclado en 390×844 y 1280×800. El textarea de nota estuvo ausente tanto en el drawer como en /cart en las dos celdas. | Nota limpia o sucia con control habilitado, eco de nota, red lenta/offline, edición en vuelo, concurrencia y anuncios. Checkout fuera del alcance de esta corrida. |
| B-02 · tres presets | Parcial. Cinco de seis lecturas de enlace profundo a una variante disponible confirmaron un único ID del formulario y control de añadir habilitado. Archive a 1280×800 falló con CHROMIUM_ERR_FAILED. De doce intentos A→B, diez no encontraron un select nativo visible, uno no encontró el formulario destacado y uno expiró. | Cambio A→B y payload de red siguen sin verificar. Las cinco lecturas que encontraron fixture tenían una sola opción y ninguna variante agotada disponible para probar. |
| C-01 | Bloqueada antes de cargar una colección. El preflight de CLI falló con CLI_PREFLIGHT_EXECUTION_FAILED y no produjo inventario usable. El runner no conserva la causa interna. | Seis pares antes/después y todas las comprobaciones de regresión. |
| A-03 / B-01 | Sin nuevas pruebas en este tramo. La secuencia se detuvo en C-01. | Se mantienen los casos pendientes de la ejecución parcial previa. |

La limpieza al salir de B-04 obtuvo HTTP 200 en clear, update y lectura, con cero artículos, cero líneas y nota vacía. El contexto permaneció abierto para B-02. Al terminar la secuencia, la primera lectura final del carrito no fue interpretable. Se ejecutó el bloque de limpieza en el mismo contexto. El resultado registró clear=200, update sin status verificable y read=200, con cero artículos, cero líneas y nota vacía. El resultado de las tres operaciones queda parcial por el update sin status. La lectura final permitió cerrar el contexto con carrito y nota verificados. El JSON no registra un incidente pendiente.

El proceso terminó con executionResult=failed por el preflight incompleto y los fallos de lectura de B-02. El artefacto conserva los resultados por caso y las dos confirmaciones administrativas previas.

[JSON de la sesión persistente](harness-GPT-MATRICES-20261107-001/results/matrix-persistent-cart-20261108T160650851Z-3d841abf-bebc-48fa-bb9d-8e1015077fab.json). SHA-256 ba409c7999084fd75cc53576b2bc7a1c37ea91eaec733057e0b2495f7fb4365a. SHA-256 del runner efectivo 0e9f8c8fda8822bb4d148fb53a067cf75496ecc68d3f61c2afe9252df571e000.


## Sesión persistente de solo lectura · C-01, A-03 y B-01 · 2026-11-08

El reintento administrativo de C-01 a las 16:54 (Caracas) devolvió exit 0. Shopify CLI 4.8.0 confirmó los tres temas unpublished con processing=false. Ese inventario habilitó un único contexto nuevo con TTY. Se verificó la identidad servida en los tres presets en cada matriz. Antes de A-03 y B-01 se repitió el inventario con el mismo resultado. El contexto tuvo un POST de autenticación, cero eventos HTTP 429 y cartTouched=false. Las lecturas del carrito de la misma sesión, antes y después de las matrices, devolvieron HTTP 200 con cero artículos, cero líneas y nota vacía. Después de la verificación final se cerró el contexto, sin incidente pendiente.

### C-01 · Observaciones parciales, 0 pares antes/después acreditados

Las huellas de base.css servidas que figuran en este informe no coinciden con la huella de base.css esperada para antes ni después en ninguno de los tres presets. El timeout de Sartorial móvil dejó 5/6 observaciones iniciales. Las cinco conservaron DPR 1, scroll inicial 0, locale en y altura de barra detectada de 0. El orden actualizó la URL y dejó foco usable en 6/6. En las tres celdas de escritorio se observó position sticky en facetas.

| Preset | Viewport | Primera tarjeta, px desde el inicio del viewport | Banner, px | LCP observado, ms | CLS observado |
|---|---|---:|---:|---:|---:|
| Sartorial | 390×844 | Timeout | — | — | — |
| Sartorial | 1280×800 | 916,88 | 472,38 | 1296 | 0,00122 |
| Imprint | 390×844 | 805,34 | Sin banner | 1088 | 0,00170 |
| Imprint | 1280×800 | 425,97 | Sin banner | 1148 | 0,00151 |
| Archive | 390×844 | 1083,70 | 196,88 | 1088 | 0,04312 |
| Archive | 1280×800 | 919,38 | 472,38 | 1368 | 0,00121 |

Son lecturas sin par y no se agregan a una baseline C-01. Quedan pendientes builds acreditados antes/después, filtro activo, limpiar, vacío, verificación específica de AJAX y formulario GET sin JavaScript. No se desplegó ni publicó ningún tema para obtener el par.

### A-03 · Seguimiento parcial de foco con hover

Las 12 combinaciones de preset, viewport y preferencia de movimiento registraron controles de newsletter del footer, enlace de hero y búsqueda del header. Los 36 controles localizados conservaron :focus-visible y :hover. Se calcularon 34 contrastes CSS y ninguno fue menor de 3:1 en este subconjunto. La búsqueda del selector de país en el footer no encontró un control visible. Quedan pendientes los fondos por píxel, los estados deshabilitados y la comprobación visual de las estimaciones bajas de la primera corrida. El subconjunto no cierra esos hallazgos.

### B-01 · Seguimiento parcial con scroll previo

En los tres presets se partió de scrollY=240 antes de abrir el menú en 390×844. Después de cruzar a 1280×800 se observó scrollY=0 y se liberaron el bloqueo y el inert de main. No se tomó una lectura entre el clic y el resize, por lo que el momento en que el scroll pasó a 0 queda indeterminado. Las tres comprobaciones axe-core 4.10.2 devolvieron cero violaciones con la selección de reglas y entradas incompletas que requieren revisión manual. En el panel móvil no se encontró un enlace visible con destino /cart en ninguno de los tres presets. Siguen pendientes carrito abierto desde el menú, editor y dispositivo físico.

El runner terminó exit 1 por el timeout de la medición C-01. Se conservan los resultados parciales de A-03, B-01, B-02, B-03 y B-04 sin cierre de ledger. Los casos que dependen de fixtures o datos de Johandry siguen pendientes.

[JSON de la sesión de solo lectura](harness-GPT-MATRICES-20261107-001/results/matrix-persistent-read-only-20261108T205655091Z-6cd1c1e0-94f4-4426-a0f7-eb66aaf3a0dd.json). SHA-256 155440014a4e60a4c82c3e262fd55c4a98b186da7c077e3cf5677757d2b9f657. SHA-256 del runner efectivo d189bf9e830b0f6ea4b4e67c4bd3200b0d50c07dde86a69678b4e876d4d67662.

