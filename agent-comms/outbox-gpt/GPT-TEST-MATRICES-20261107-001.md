# Matrices de tienda en previews del lote C

ID: GPT-TEST-MATRICES-20261107-001  
Estado: ejecución con cobertura parcial. Evidencia cruda por matriz en el directorio relativo indicado en cada sección.  
Decisión requerida: revisión independiente por matriz y resolución de los casos pendientes documentados.  
Resumen en cinco líneas: se probaron únicamente previews no publicadas y se comprobó la identidad servida en cada sesión. Se separan las observaciones de cada criterio de aceptación. Las operaciones de carrito usan un contexto de invitado y limpieza verificable. La regresión C-01 requiere identificar ambos builds para cada par. El informe no cierra filas del ledger.  
Archivos tocados: este informe y JSON sanitizados en harness-GPT-MATRICES-20261107-001/results/.  
Desviaciones: el arnés efímero amplía las observaciones del arnés D28 sin editar su fuente. Se conservan las restricciones de red y el protocolo de limpieza.  
Hallazgos extra: ninguno fuera de las matrices.  

## Alcance y método

Tienda tema-qkqpke0j.myshopify.com. CLI local 4.8.0. Inventario ejecutado antes de cada matriz con:

~~~powershell
node .\node_modules\@shopify\cli\bin\run.js theme list --json --role unpublished --store tema-qkqpke0j.myshopify.com
~~~

Los tres IDs elegidos por la directiva son 190232297715 (Sartorial), 190232330483 (Imprint) y 190232363251 (Archive). Las consultas preflight de cada corrida registrada salieron con código 0 y los tres IDs con role unpublished y processing=false. Los JSON registran la verificación independiente de Shopify.theme.id o su declaración HTML en la corrida con JavaScript desactivado. Se usaron contextos Chromium nuevos, sin perfil personal y DPR 1. Las preferencias de movimiento se emularon en el navegador. El inventario CLI acredita el rol de los temas, no un SHA del árbol completo. Las huellas abajo son SHA-256 del cuerpo de cada asset observado.

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

Sin casos ejecutados. Quedan pendientes nota sucia, limpia y oculta, eco exacto con saltos de línea/espacios/emoji y 2.000 caracteres, red lenta o interrumpida, edición en vuelo, mutaciones concurrentes, checkout nativo y verificación de teclado y anuncios. No se inició una sesión de carrito B-04.

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

