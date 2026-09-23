ID: GPT-AUDIT-008-sprint-5b-certification
Estado: CERTIFICADO el cierre operativo de F01 y Sprint 5B; P2 no bloqueante registrado. No es certificacion de submission a Theme Store.
Decisión requerida: Gemini puede cerrar Sprint 5B y avanzar a 5C. Claude debe incorporar el P2 de anuncio tras resize a su siguiente directiva acotada; Gemini mantiene la fila 73 del ledger en `código completo` hasta verificar gestos tactiles reales y los casos de medios sin fixture.
Resumen en 5 líneas:
1. F01 no se reprodujo en la tienda viva: Reset por clic, Enter y Space conservo el foco en Zoom in/Acercar, sin paso a BODY.
2. El tope de zoom, el retorno a 1x y ambos extremos de la galeria trasladaron el foco a un control habilitado dentro del dialogo.
3. Se probaron EN y ES a 1280 x 800, 390 x 844 y 360 x 800; Escape devolvio el foco al disparador exacto probado.
4. Al pasar de 390 a 1280 px con una foto ampliada, el porcentaje anunciado quedo desactualizado aunque la escala visual se limito: P2.
5. La prueba de viewport no emula dedos; pinch, doble toque, video y alt faltante siguen fuera de esta certificacion.
Archivos tocados: solo `agent-comms/outbox-gpt/GPT-AUDIT-008-sprint-5b-certification.md`. Sin cambios de tema, BOARD o ledger; sin commit ni push.
Desviaciones (Nivel 1 o Nivel 2): ninguna.
Hallazgos extra fuera de alcance (con parche listo): P2-01, region viva desactualizada al reducirse el zoom maximo por resize. Detalle y parche abajo.
Verificación (comando, resultado y qué demuestra/qué no): `node --check assets/product-zoom.js` -> `{exit_code:0,output:""}`; solo demuestra sintaxis. `git status --short --branch` antes de escribir -> `## master...origin/master`. Pruebas de clic, teclado, DOM y capturas de viewport en tienda viva detalladas abajo; no equivalen a pruebas en hardware tactil ni a auditoria de toda Theme Store.
Lista de afirmaciones falsables numeradas:
1. En las seis combinaciones EN/ES x 1280/390/360, `Reset zoom` por clic, Enter y Space dejo `dialog.open=true`, `dialog.contains(document.activeElement)=true`, `document.activeElement !== document.body` y foco en Zoom in/Acercar.
2. Al llegar al maximo de la primera imagen (300%), el foco paso a Zoom out/Alejar antes de deshabilitar Zoom in/Acercar; al volver a 100%, regreso a Zoom in/Acercar.
3. Al llegar a la imagen 4/4 con Next/Siguiente, el foco paso a Previous/Anterior; al volver a 1/4 con Previous/Anterior, paso a Next/Siguiente.
4. Escape cerro el modal y enfoco exactamente el boton de apertura usado, incluido `Zoom image 4 of 4` en EN/390 y `Ampliar imagen 2 de 4` en ES/360.
5. En EN/390, cambiar de 225% en la segunda imagen a viewport 1280 limito `transform` a `scale(1.67442)` y conservo el foco en Zoom out, pero la region viva siguio diciendo `Image 2 of 4, zoom 225%` 500 ms despues.

## Dictamen y alcance

**APTO para cerrar F01 y el Sprint 5B como entrega de implementacion; autorizo avanzar al siguiente sprint.** No observe un P0/P1 nuevo en las rutas del visor probadas. La certificacion no afirma que todo el tema este listo para submission ni que los subcasos sin fixture hayan pasado Gate 5. En particular, `docs/requirements-ledger.md:73` puede registrar esta evidencia de foco, pero no debe marcarse `cumplido` solo con viewport simulado mientras el contrato incluya gestos tactiles reales. La fila 72 (video/AR) sigue teniendo sus propias pruebas pendientes.

## Matriz de foco en vivo

| Ruta | EN 1280 | ES 1280 | EN 390 | ES 390 | EN 360 | ES 360 | Evidencia representativa |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Reset por clic / Enter / Space | Pasa | Pasa | Pasa | Pasa | Pasa | Pasa | EN/1280 y ES/360: `{focus:'BUTTON',focusLabel:'Zoom in'/'Acercar',inside:true,body:false,open:true,live:'...100%'}`. |
| Acercar hasta tope | Pasa | Pasa | Pasa | Pasa | Pasa | Pasa | 150% -> 225% -> 300%; en 300% `inDisabled:true`, foco `Zoom out`/`Alejar`, `inside:true`. |
| Alejar hasta 1x | Pasa | Pasa | Pasa | Pasa | Pasa | Pasa | 300% -> 200% -> 133% -> 100%; `outDisabled:true`, foco `Zoom in`/`Acercar`. |
| Next a 4/4 | Pasa | Pasa | Pasa | Pasa | Pasa | Pasa | `nextDisabled:true`, foco `Previous image`/`Imagen anterior`, `inside:true`. EN/390 tambien se abrio directamente la foto 4/4. |
| Previous a 1/4 | Pasa | Pasa | Pasa | Pasa | Pasa | Pasa | `prevDisabled:true`, foco `Next image`/`Imagen siguiente`, `inside:true`. |
| Salvaguarda y tabulacion | Pasa | No recorrido Tab completo | Pasa en controles cambiantes | Pasa en controles cambiantes | Pasa en controles cambiantes | Pasa | EN/1280: 9 Tab adicionales alternaron Close, galeria, Zoom in y Next, siempre `inside:true`; ES/360: Tab y dos Shift+Tab tras Reset permanecieron dentro. No se forzo blur externo por script. |

El ciclo completo de Tab no se repitio en cada combinacion; la ultima fila distingue esa cobertura de las seis transiciones verificadas en todas. En EN/390, Enter tras alcanzar 300% activo Zoom out y llevo a 200% sin cerrar el dialogo. Al abrir la foto 4/4 y regresar a 1/4, Escape devolvio foco a `Zoom image 4 of 4`, el disparador original, no al boton correspondiente a la foto visible al cerrar.

### Evidencia de interaccion y visual

- Metodologia: navegador de tienda real, `getByRole(...).click()/press('Enter'|'Space'|'Escape')` y consultas DOM de solo lectura a `product-zoom dialog`, `document.activeElement`, `data-zoom-status`, estados `hidden`/`disabled` y `:modal`. Se inspecciono el estado tras cada accion; `inside:true` corresponde a `dialog.contains(document.activeElement)`.
- En ES/360, tras Reset -> Tab -> Shift+Tab -> Shift+Tab, focos sucesivos: `Acercar`, `Imagen siguiente`, `Acercar`, `Galería de imágenes del producto`; todos dentro del dialogo. Escape cerro (`open:false`) y restauro `Ampliar imagen 2 de 4`.
- Capturas en memoria EN/390 y ES/390/360: controles visibles y sin solapamiento evidente. Medicion EN/390 con zoom activo: Reset 102 x 44 px y los otros cinco botones visibles 44 x 44 px. No se guardaron capturas persistentes ni se ejecuto axe/lector de pantalla.
- `tab.dev.logs({levels:['error','warn'],limit:20}) -> []` en la pestaña probada; no demuestra ausencia de errores de red o de otras sesiones. El override de viewport se restablecio; el modal quedo cerrado y el carrito en 0 articulos.

## Hallazgo no bloqueante

**P2-01 - porcentaje de zoom anunciado obsoleto tras cambio de viewport.** En EN/390, foto 2 de 4 (`data-width='928'`), ampliar a 225% con foco en Zoom in; cambiar el viewport a 1280 x 800. Resultado observado: `transform='translate3d(0px, 0px, 0px) scale(1.67442)'`, `inDisabled:true`, foco transferido correctamente a Zoom out y `inside:true`, pero la region viva permanecio `Image 2 of 4, zoom 225%` aun tras 500 ms. El 167% visual y el 225% anunciado divergen hasta otra accion. No es regresion introducida por F01: `layout()` no llamaba `announce()` antes del hotfix.

- **Archivo/linea:** `assets/product-zoom.js:71-86` (`layout()` limita `this.scale` y llama `apply()`); `:279-284` (`announce()`).
- **Impacto:** dato inaccesible/inexacto al girar dispositivo o cambiar tamaño con zoom activo; no se pierde el foco ni la capacidad de cerrar o comprar. Severidad P2, no bloquea el cierre operativo de F01.
- **Parche propuesto para Claude, en nueva directiva de Gemini:** en `layout()`, guardar la escala anterior antes del clamp; tras `apply()`, si el dialogo sigue abierto y la escala cambio, llamar a `announce()`. Mantener el retorno inicial cuando `index < 0` y agregar prueba de resize 390 -> 1280 en la foto de 928 px verificando que el live region anuncie 167% junto al foco en Zoom out.

## Limites y responsables

- **Johandry/Gemini:** suministrar/coordinar fixture de video HTML5 y externo, imagen sin alt manual y foto de resolucion baja para cerrar H-13/H-19 y la proteccion frente a pixelacion en vivo. La presente re-verificacion no repite esos escenarios del informe GPT-AUDIT-007.
- **Gemini:** registrar F01 como verificado en tienda y decidir cuando mover la fila 73 de `código completo` a `cumplido` una vez documentada la prueba tactil real y el P2; no adelantar la afirmacion por las 25/25 pruebas del arnes.
- **Claude:** implementar P2-01 solo bajo nueva directiva. No se requiere reabrir Sprint 5B para aceptar el hotfix de foco.
