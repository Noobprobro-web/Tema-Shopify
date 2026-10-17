ID: GPT-STRATEGY-RECIPROCAL-001
Estado: DICTAMEN EMITIDO — REQUIERE REMEDIACIÓN Y VERIFICACIÓN ANTES DE SUBMISSION
Decisión requerida: Claude, como líder temporal, convierte los contratos recomendados en una directiva técnica; Johandry valida claims y prioridades comerciales. No autorizar submission con los riesgos de compra pendientes.
Resumen en 5 líneas:
1. La integridad del carrito es la primera promesa comercial: una respuesta visual correcta no compensa una mutación aplicada a la línea equivocada.
2. Borrado, newsletter y vídeo requieren resultados perceptibles y control del usuario; el código existente contiene mitigaciones parciales, no una certificación actual.
3. Una sola fotografía debe permanecer visible; recomiendo base estática, retirar marquee-drift y conservar scroll nativo como configuración inicial.
4. La localización necesita representar país/mercado e idioma: el selector actual oculta países al agrupar por moneda.
5. Archive puede vender procedencia con fuerza mediante expedientes por pieza; stock, estética de museo y defaults de plantilla no acreditan los claims.
Archivos tocados: únicamente agent-comms/outbox-gpt/GPT-STRATEGY-RECIPROCAL-001.md.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación; los cambios de contratos propuestos requieren directiva del liderazgo antes de ejecutar.
Hallazgos extra fuera de alcance (con parche listo): ninguno; no se preparó parche de código.
Verificación (comando, resultado y qué demuestra/qué no): inspección estática y fuentes primarias actuales; comandos y salidas en §9. No se ejecutó tienda, checkout, lector de pantalla ni medición de conversión.
Lista de afirmaciones falsables numeradas: F1–F8 en §8; criterios de aceptación A1–A8 en cada eje.

# Dictamen estratégico recíproco de Sartorial

Fecha: 2026-10-16, America/Caracas (UTC−04:00). Directiva de referencia: GPT-STRATEGY-MASTER-001, recibida como encargo humano en la conversación. Ejecutor delegado: GPT-6.1 Sol, razonamiento xhigh (muy alto), sin Astra ni delegación adicional. Base: commit `510259799cf78bd56c220d58d7e2e2499c0a7a4f` y árbol local inspeccionado. Alcance: auditoría de producto, confianza, conversión potencial y riesgo de revisión para un tema del tier de licencia de $380; ese precio no se atribuye a todos los productos de sus comerciantes.

## 1. Dictamen y calidad de la evidencia

**Recomiendo detener la submission hasta corregir y verificar la compra, los resultados accesibles y el control del movimiento.** La propuesta editorial puede sostener un posicionamiento de $380 cuando la compra transmite precisión y el comerciante recibe datos y controles fiables. El movimiento añade carácter después de cumplir esa promesa.

El **64/100 y los cuatro P1 pertenecen a Claude**, cuyo informe `agent-comms/outbox-claude/CLAUDE-AUDIT-TECH-001.md` fue facilitado posteriormente por Johandry. Durante esta actualización se observaron **dos versiones distintas en esa misma ruta**, ambas leídas íntegramente y delimitadas en §1.1/V9. La última lectura completa, de 275 líneas, declara **APTO CON CONDICIONES**, 64/100, 0 P0, 4 P1 y 31 P2 (`CLAUDE-AUDIT-TECH-001.md:4–13,35–41`). Se incorpora como fuente actual de esta entrega; no se adopta su nota como calificación comercial propia ni se recertifican sus 31 P2. El dictamen previo `GPT-AUDIT-COMMERCIAL-380-20261016.md`, especialmente H01/H06, sigue contrastado contra fuente actual. MASTER conserva su referencia como encargo humano; no se atribuye lectura de una directiva local no localizada.

Clasificación usada:

| Clase | Qué permite afirmar aquí |
|---|---|
| Reportado y contrastado | Síntomas de Johandry y cuatro P1 del informe completo de Claude, con contraste estático de las rutas pertinentes; conservan su autoría. |
| Inspección estática actual | Ramas, selectores, datos y contratos presentes en el commit y árbol indicados. |
| Reproducción actual | Ninguna prueba de navegador/storefront ejecutada por este auditor. La primera versión de Claude se declara estática; la última afirma paridad con tiendas sin adjuntar SHA/deploy ni artefactos de reproducción. No se presenta esa afirmación como una prueba en tienda revisada. |
| Inferencia comercial | Consecuencias plausibles sobre control, confianza, leads o devoluciones; sin causalidad ni magnitudes medidas. |

Orden recomendado: **P1 de integridad y acceso** (TEC-01, TEC-02, foto invisible, país/mercado y TEC-04 cuando se activa la condición normativa); **P1 comercial de recuperación de leads** (TEC-03); **P2 de acabado** (marquee-drift y jerarquía). Los claims se bloquean para publicación cuando el expediente no los respalda. No se demuestra aquí que los productos reales carezcan de expediente, ni se eleva ese supuesto a una infracción consumada. La decisión formal de aceptación corresponde a Shopify.

### 1.1. Reconciliación con el informe técnico incorporado

**Captura A, inicial:** 525 líneas, SHA256 `6244505447F8FD1D6441651497437D63652980E66B00BEBD4FD73FD3FCE31D6C`. Declaraba repo `/home/claude/noobprobro-web/tema-shopify`, commit `3e2a732`, árbol limpio/solo lectura (líneas 3–4), rúbrica `100 − 0×25 − 4×5 − 31×0,5 = 64,5 → 64` (14–18) y análisis estático sin laboratorio/campo (487). Se comprobó esa aritmética y sus 35 encabezados/4 P1/31 P2. `3e2a732` no resuelve como objeto local; no fue posible comparar commits.

**Captura B, última lectura completa y fuente actual acotada:** 275 líneas, SHA256 `DE62F8EC9E86DC3A9F5ADDBB3FC0D736C02EEAC89D0FDA7CFF5EF11B62033180`. La misma ruta cambió durante la revisión sin una escritura de este auditor en ella. B conserva 64/100 y los cuatro TEC, pero cambia el inventario P2 y omite la rúbrica y el SHA Linux de A. Declara `sartorial-v1.0.0 / master (HEAD en paridad con tiendas de desarrollo Shopify)` (línea 9), sin SHA, URL/ID de tema remoto, fecha de auditoría ni artefactos que acrediten esa paridad. Este workspace sigue en `510259799cf78bd56c220d58d7e2e2499c0a7a4f`; coincidencia de patrones no acredita identidad de snapshots ni deploy.

B promete llegar a APTO (100/100) al resolver los cuatro P1 (257–264). Esa promesa no se armoniza con A: bajo la fórmula de A, conservando 31 P2, el resultado sería `100 − 31×0,5 = 84,5`, redondeado a 84. Es una discrepancia entre versiones de la fuente, **no una nueva nota de este auditor**. No se avalan el 100/100 ni el inventario P2 cambiado; el liderazgo debe aclarar la versión/rúbrica vigente antes de usar la nota en documentación comercial.

| Punto de Claude | Contraste y decisión estratégica |
|---|---|
| TEC-01, B `:47–62` | Coinciden índice y botones fuera del busy selector. Corregir “identificador inmutable” de B `:61` (y “estable” de A `:58`): las keys pueden cambiar. `pointer-events:none` propuesto en B `:60` no bloquea por sí solo teclado ni eventos programáticos; A1 exige todas las entradas y escrituras coordinadas. La coalescencia/300 ms de A era propuesta técnica, no requisito. |
| TEC-02, B `:66–86` | Coinciden falta de anuncio y fallback Cerrar. Se conserva además la precisión de A `:521`, corroborada por IDs locales posicionales: un +/- de B puede restaurarse sobre otro producto al borrar A. A2 comprueba identidad, no solo foco dentro del drawer. El diagnóstico normativo genérico de B no sustituye prueba real de secuencia/anuncio. |
| TEC-03, B `:90–124` | Coinciden mensajes existentes y falta de tabindex. Añadirlo puede resolver esa ruta nativa, pero el selector global no garantiza elegir el formulario enviado; se conserva la prueba de dos formularios advertida en A `:122`. Ausencia de tabindex no demuestra por sí sola incumplimiento universal de 2.4.3/3.3.1 ni pérdida del lead. |
| TEC-04, B `:128–152` | Coinciden loop, arranque programático, ausencia de pausa y ninguna consulta de `data-animations`. B agrupa None/Subtle como apagado (`:146`), pero schema/locales distinguen none de subtle con revelados/transiciones (`settings_schema.json:203–220`, `en.default.schema.json:8–13`); no exigir que Subtle suprima todo movimiento. 2.2.2 mantiene sus condiciones completas, concurrencia y excepción esencial incluidas; no hay medición de exposición adjunta. |
| Estado y citas | B exige cerrar los cuatro P1 (`:11,33`), compatible con retener submission. Sus citas Liquid de control `:198–218` y región viva `:45–55` están desplazadas respecto del árbol local: aquí son control `cart-drawer.liquid:255–303` y región `:83`. Se usan las citas locales verificadas; no se fuerza paridad por coincidencia parcial. |

Las recomendaciones de ambas capturas son propuestas pendientes, no código aplicado ni aceptado por autoridad. Se mantienen A1–A8 y el alcance documental. Ni las fortalezas globales ni los P2 de B se convierten en mediciones de esta entrega; no se amplió la auditoría a ese inventario cambiado. Las dos capturas se identifican por hash, sin intentar estabilizar el archivo compartido.

## 2. Encuadre normativo corregido

La numeración actual de [requisitos de Theme Store](https://shopify.dev/docs/storefronts/themes/store/requirements) sitúa **Font picker en §15**. Para este dictamen son pertinentes §3 (UX), §4 (funciones, newsletter/localización/checkout acelerado), §7 (carrito: cantidades, total, actualización y vacío), §8 (funcionalidad consistente y datos/claims veraces) y §12 (accesibilidad). No debe citarse §15 como norma de carrito. Un defecto reproducible de compra implica riesgo alto de revisión; este documento no predice una descalificación automática.

[WCAG 2.2, 2.2.2](https://www.w3.org/TR/WCAG22/#pause-stop-hide) es **nivel A**. [4.1.3, Status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) es **AA** y contempla avisos programáticamente perceptibles sin recibir foco. [2.3.3, Animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) es **AAA**, no AA. La mención AA/2.3.3 del ledger (`docs/requirements-ledger.md:56`) necesita reconciliación documental por su dueño; no se editó aquí.

## 3. Carrito y recuperación de intención

### TEC-01 — Pulsaciones rápidas y mutación por índice

**P1 crítico para la compra; dueño de solución: Claude.** El comprador quiere cambiar una pieza o una cantidad concreta. Si recibe otra cantidad o altera otra línea, pasa de evaluar el producto a auditar al comercio. En alto ticket, el temor a pagar un importe o pieza no deseados puede frenar checkout y generar contactos de soporte. Si la discrepancia llega a un pedido, puede originar cancelación, devolución y costes operativos; no se ha observado ni cuantificado ninguno de esos resultados aquí. Es una inferencia de riesgo, no una tasa de abandono demostrada. La relación entre feedback predecible y confianza tiene apoyo en las [heurísticas originales de Nielsen](https://www.nngroup.com/articles/ten-usability-heuristics/); su aplicación a esta tienda es juicio de auditoría.

**Qué sostiene el código:** `handleDrawerClick` y `handleDrawerChange` pasan `dataset.line` a `changeLine` (`assets/theme.js:2380–2414`); el POST serializa `{ line, quantity }` (`:3091–3109`). El DOM ya expone `item.key` (`sections/cart-drawer.liquid:158`), pero esa identidad no se usa en este POST. `setDrawerBusy` deshabilita input/remove/cross-sell, sin incluir `[data-quantity-button]` (`theme.js:3367–3381`). El listener global de los steppers cambia el input y emite `change` (`:5564–5591`); no comprueba allí `input.disabled` ni el estado pendiente del carrito. Existe, por tanto, una vía estática compatible con eventos repetidos durante una mutación. No demuestra que toda ráfaga altere otra línea: el riesgo de índice equivocado aparece al cambiar el orden/conjunto de líneas antes de aplicar un índice viejo.

Ya existen revisiones, descarte de respuestas y reconciliación (`:3131–3188`, `:3211–3220`). **Esas protecciones ordenan qué se pinta; no deshacen una escritura equivocada aceptada por el servidor.** Shopify define `line` como posición desde 1 y admite identidad por key; también advierte que las keys pueden cambiar con propiedades o descuentos. Véase [Cart Ajax API](https://shopify.dev/docs/api/ajax/reference/cart). Sustituir índice por key aislada no constituye un arreglo completo.

**Contrato recomendado al liderazgo:** cada intención se asocia a la identidad de la línea en un estado autoritativo; se coordinan las escrituras concurrentes y la última cantidad solicitada; después de cada mutación se reconcilian identidad, cantidades, descuentos y DOM. Una key caducada o respuesta ambigua obliga a releer y resolver la intención, sin reintentar ciegamente un add ni reinterpretar el índice viejo. Claude decide cola/serialización y coalescencia apropiadas; este dictamen exige el resultado, no introduce arquitectura.

**A1 — Aceptación:** carrito A/B/C, dos líneas de la misma variante con propiedades distintas y otra con selling plan; ráfagas de +/- por ratón, touch, Enter y Space, alternancia entre líneas, eliminación de A mientras se cambia B, respuesta lenta y orden invertido. La cantidad final debe coincidir con la intención aceptada, solo en la línea pretendida. Comparar DOM, `/cart.js` y checkout antes de pago; cero unidades añadidas sin intención, cero resurrecciones, total y descuentos coherentes. Probar 422, 429, fallo de red y resultado incierto; mostrar estado de espera/recuperación y permitir continuar cuando se resuelva. Cualquier bloqueo temporal debe conservar foco y comunicarlo. Adjuntar solicitudes, estado anterior/final y vídeo de la secuencia.

### TEC-02 — Eliminación silenciosa y foco en Cerrar

**P1 de acceso y confianza; Claude implementa, auditor distinto valida.** Una persona que compra con lector de pantalla necesita saber qué desapareció, qué queda y dónde continúa. Saltar a Cerrar puede interpretarse como final de la operación sin confirmar el resultado y obliga a reconstruir el carrito. Esa carga es especialmente impropia de una experiencia premium; no presume menor capacidad ni menor valor del comprador asistivo.

`changeLine` renderiza y finaliza sin llamar a `showStatus` (`theme.js:3091–3126`). La región ya existe (`cart-drawer.liquid:83`), y `showStatus` está implementado (`theme.js:3419–3428`); falta un resultado específico en esta ruta. Al desaparecer el control, la restauración termina en Cerrar si no encuentra un objetivo anterior o de cross-sell (`:3286–3309`). Los IDs actuales se construyen con `forloop.index` (`cart-drawer.liquid:249,262,269,289`): como precisaba la captura A de Claude (línea 521), un +/- aún enfocado durante la eliminación de una línea anterior puede restaurarse sobre otro producto. Este segundo caso no debe confundirse con el botón de quitar que se deshabilita. El vacío sí tiene texto visual y enlace (`cart-drawer.liquid:131–137`), pero eso no prueba anuncio después del reemplazo.

**Contrato:** tras confirmación del servidor, anunciar una vez una frase localizada como “Se eliminó [producto, variante]. Quedan [n] artículos”, o “Tu carrito está vacío”. Conservar foco en el siguiente control lógico de línea, el anterior si era la última, o un objetivo significativo del estado vacío. Cerrar sigue disponible y Escape mantiene su contrato, pero no es el destino único de toda eliminación. No introducir una confirmación modal en cada borrado ni anunciar éxito antes del servidor. El foco debe conservar una secuencia comprensible, conforme a [WAI sobre orden de foco](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html).

**A2:** eliminar primera, intermedia, última y única línea con teclado y NVDA/Chrome; repetir VoiceOver/Safari móvil. Comprobar anuncio completo una sola vez, foco visible dentro del drawer, ausencia de foco en body o elemento eliminado, total actualizado y siguiente acción comprensible. Mantener foco en un +/- de B mientras se elimina A: la restauración debe seguir a B o al siguiente objetivo intencional, nunca al producto que herede su índice. Al fallar la petición, la línea permanece o se reconcilia y el error explica el resultado real. Eliminar sucesivamente hasta vacío debe narrar el estado final sin una cascada de mensajes obsoletos.

### TEC-03 — Newsletter sin resultado perceptible tras el envío

**P1 comercial de recuperación de leads; Claude/Johandry.** Una newsletter de lujo sostiene relación, acceso editorial y retorno, aunque no haya compra en esa sesión. Si el resultado parece ausente, la persona puede reenviar, abandonar o desconfiar del servicio prometido. No se conoce aquí cuántos leads se han perdido.

**Corrección del encuadre:** hay éxito visual con `role="status"` y error con `role="alert"` en `sections/newsletter.liquid:52–60` y `sections/footer.liquid:62–70`. No es correcto afirmar que falta todo feedback. Son formularios nativos `customer`; sus mensajes carecen de `tabindex="-1"`, mientras `initFormMessageFocus` solo selecciona `.form-message[tabindex="-1"]` (`theme.js:5626–5633`). Es una incompatibilidad estática con ese helper, compatible con el síntoma al volver de una navegación, no prueba de fallo de alta en backend.

La captura B confirma que TEC-03 trata específicamente del resultado después de recarga y propone tabindex en los cuatro mensajes (`CLAUDE-AUDIT-TECH-001.md:90–124`); A advertía además probar dos formularios simultáneos (línea 122). La recomendación es razonable para esa ruta nativa si enfoca el resultado correcto; no se interpreta como ausencia de marcado status ni como demostración empírica de silencio en todas las combinaciones de lector/navegador. La frase de Shopify sobre foco invocada en A aparece en el apartado de errores de formulario; no exige secuestrar foco indiscriminadamente en todo éxito dinámico.

**Contrato:** éxito persistente, visible junto al formulario enviado, con copy que corresponda a la respuesta real. Si la suscripción exige confirmación por email, explicar ese paso sin declarar el alta definitiva. En actualización asincrónica, un status/live feedback apropiado permite informar sin mover foco. Tras navegación completa, validar si se necesita dirigir de forma acotada al resultado del formulario concreto o restaurar contexto. **No exigir foco forzado en todo éxito:** 4.1.3 permite anunciar sin foco; la recarga de página es un cambio de contexto y no se clasifica automáticamente como incumplimiento de ese criterio. Evitar que un selector global enfoque el mensaje de otro formulario. Los errores deben asociarse al campo y quedar visibles. Las [prácticas de accesibilidad de Shopify](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility) respaldan feedback anunciado y controles de formulario comprensibles.

**A3:** enviar desde sección y footer, cada uno y ambos presentes, a desktop/móvil; cubrir éxito real, email inválido, error de servidor y challenge de Shopify. Johandry aporta un email de QA y comprueba registro/estado real autorizado; no se envió ninguno en este encargo. Tras POST/navegación, la persona vidente y el lector identifican resultado y siguiente paso sin buscar la página entera. El error referencia el campo correcto; el éxito no desaparece por un temporizador arbitrario. Medir después inicio→envío→alta aceptada→confirmación si corresponde; no contar clics como leads.

## 4. Movimiento, imagen y sensación de lujo

### TEC-04 — Vídeo en loop sin control del visitante

**P1 condicionado al uso automático concurrente; Claude.** El hero declara `muted`, `loop`, `playsinline`, `aria-hidden` y ningún control de pausa en su markup (`hero-editorial.liquid:97–109`). Aunque no trae atributo autoplay, `syncPlayback` invoca `video.play()` al inicializar cuando sus guardas lo permiten (`theme.js:3587–3598`, `:3617–3635`). Pausa por reduced-motion, móvil no habilitado o pestaña oculta; no hay preferencia de pausa manual en esa clase. Como señala Claude y confirma la relectura local, `shouldPlay` no consulta `data-animations` (`:3620–3624`): none no aporta una guarda de reproducción en esta ruta. Esto precisa un límite de configuración; no equivale a observar el vídeo desplegado.

[WAI, explicación de 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) exige mecanismo de pausa, parada u ocultación si el movimiento **empieza automáticamente, dura más de cinco segundos y se presenta junto a otro contenido**, salvo que sea esencial. Un loop puede superar cinco segundos aunque cada clip sea corto. No se midieron aquí duración ni exposición del vídeo desplegado: la conclusión normativa es condicional. `muted`, `aria-hidden` y reduced-motion no sustituyen el control de los demás visitantes. Una preferencia del sistema que evita la reproducción a parte del público no demuestra que todos puedan pararla.

**A4:** si se conserva ese autoplay, control nativo o botón visible localizado Pause/Play, nombre/estado accesibles, Enter/Space, foco visible y contraste sobre el peor fotograma; al pausar, nada lo reinicia al cambiar viewport o volver de otra pestaña. Probar >5 s junto a título/CTA en desktop y móvil habilitado; con reduce, poster estable desde el inicio y contenido completo. Incluir la opción none del comerciante: debe respetarse el contrato aprobado de ausencia de movimiento, sin autoplay decorativo que lo contradiga. Si el vídeo comunica información esencial de producto, no tratarlo como mera decoración: revisar sus alternativas y medios por separado. Opción de menor riesgo: poster y reproducción deliberada. El riesgo formal se apoya también en las [prácticas oficiales sobre medios](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility#media), sin declarar rechazo automático por una prueba que no se ejecutó.

### Una sola foto que desaparece en hover

**P1 funcional visible, por delante del embellecimiento.** El Liquid solo emite secundaria si existe y está habilitada (`snippets/product-card.liquid:144–151`), pero CSS hace `opacity:0` a la primaria en hover/focus sin exigir secundaria (`base.css:1872–1875`). Hay una excepción al escoger media de variante (`:1971–1973`), que no protege todas las tarjetas de una imagen. La combinación explica estáticamente el síntoma; no se renderizó una tarjeta actual en este encargo.

| Alternativa | Evaluación comercial |
|---|---|
| Suprimir transición de la única foto | **Base recomendada.** Identidad y textura permanecen estables; reduce sorpresas y funciona sin capacidad hover. |
| `scale(1.02)` | Mejora opcional en desktop con puntero fino si respeta encuadre. Debe conservar opacidad 1 y quedar desactivada con reduce. La escala actual es 1.025 (`:1886`); cambiar ese número solo no corrige el defecto. |
| Cambiar contraste de la foto | Desaconsejado como feedback general: puede alterar la lectura de color/material. El contraste del contorno/foco puede señalar interacción sin modificar el producto. |

**Decisión para Claude:** base estable sin fade/swap cuando no hay segunda imagen válida. Escala 1.02 solo como mejora aprobada y verificada; no como condición para llamar lujo al componente. El swap de dos imágenes puede conservarse si la secundaria está disponible y no cambia indebidamente la variante mostrada.

**A5:** cero, una y varias imágenes; secundaria desactivada, secundaria que falla al cargar y selección de color con imagen propia. Hover y foco nunca dejan la tarjeta vacía, no ocultan información necesaria, no cambian dimensiones y mantienen encuadre útil; touch y reduce funcionan con base estática. El foco visible no depende de animación ni de recolorear la fotografía.

### Marquesina de dos velocidades y scroll con inercia

**P2 de acabado; retirar la capa marquee-drift.** En modo Full se suman `editorial-marquee` temporal y `marquee-drift` ligado al scroll mediante `animation-composition: replace, add` (`base.css:9327–9335`, `:9416–9422`). El botón existente detiene la primera y mantiene la segunda en running (`:3991–3998`); existe control accesible en `sections/marquee.liquid:50–60` y JS `theme.js:4070–4088`. Por ello no se declara que falte toda pausa de marquesina. Sí hay dos fuentes de desplazamiento sobre el mismo texto, compatibles con la sensación de tirón reportada. Su percepción exacta queda por medir en navegador.

**Recomiendo eliminar marquee-drift y su composición aditiva**, conservar a lo sumo el loop continuo con pausa completa y alternativa estática. Una sola velocidad facilita leer y comprender la relación entre gesto y respuesta; el segundo movimiento no aporta contenido ni una decisión comercial. Al reducirlo se refuerza el ritmo sobrio y se simplifica el contrato de pausa. La marquesina debe aportar mensaje editorial útil y veraz, no ser un reclamo de lujo por sí sola. Aceptación A6: paso lento/rápido por la sección, reversión de scroll, pausa/reanudación y reduce; el texto no salta, la pausa detiene el movimiento previsto, las copias `aria-hidden` no duplican lectura y la lista estática admite texto largo.

**Scroll inercial con buffer en escritorio:** puede dar continuidad y peso sensorial al recorrido editorial; es una hipótesis estética. No existe evidencia aquí de que eleve conversión, valor medio o disposición a pagar. `scroll-behavior:smooth` (`base.css:125`) no prueba un motor que interpole la rueda. **Recomendación: scroll nativo por defecto.** Si Johandry quiere explorar la inercia, Claude puede proponer un experimento optativo y acotado a desktop, sujeto a aprobación del contrato/dependencias. No se incorpora ni se prescribe una librería en esta auditoría.

El experimento solo merece adoptarse si conserva teclado (Page Up/Down, Home/End, Space), anclas, find-in-page, historial y retorno de navegación, foco/scroll-into-view, zoom y lectura asistida; no captura scroll del drawer ni listas internas, ni añade demora a compra. Reduce y una salida explícita deben recuperar comportamiento nativo. Comparar las mismas rutas y dispositivos antes/después: latencia percibida, errores de navegación, tareas, frames y métricas de respuesta/rendimiento, sin regresión de compra. El candidato se descarta si necesita trucos de foco, rompe scroll anidado o añade coste sin mejora observada. El detalle de duración/amortiguación se decide con prueba de usuarios, no con una cifra presentada como estándar de lujo.

## 5. Idioma, país/moneda y jerarquía internacional

**P1 semántico y P2 visual; Claude con configuración de Markets validada por Johandry.** La duda sobre destino y precio debe resolverse antes de comprometer la compra. El país puede afectar catálogo, impuestos, entrega y moneda; idioma es locale. No deben prometerse monedas o idiomas que la configuración real no ofrece. La guía [Shopify sobre múltiples monedas e idiomas](https://shopify.dev/docs/storefronts/themes/markets/multiple-currencies-languages) explica `country_code`, `language_code` y el posible cambio de idioma al elegir un país que no lo admite.

El header renderiza los selectores en desktop y menú móvil (`sections/header.liquid:124,188`). El snippet usa formulario localization, pero deduplica países por moneda, muestra solo código/símbolo y, para otra moneda, toma el primer país que la usa (`localization-selectors.liquid:54–73`). Si dos destinos habilitados comparten EUR, esa lista no permite elegir ambos. El problema no se resuelve aumentando tamaño o contraste: un comprador puede cambiar de destino sin que la etiqueta lo explique. El footer actual no renderiza el snippet (`footer.liquid:111–133`); el CSS de footer existente (`base.css:6918–6920`) no demuestra presencia funcional.

**Contrato A7:** país/mercado comprensible con nombre completo + código/símbolo de moneda, e idioma por nombre propio en su lista; grupos próximos y jerarquía de utilidad, junto a cuenta/carrito sin competir con comprar. Shopify pide ambos juntos y especifica formato de país/moneda en sus [guías UX de localización](https://shopify.dev/docs/storefronts/themes/markets/country-language-ux). Propongo acceso discreto en header, utilidades al pie del menú móvil y repetición de ambos en subfooter para recorridos largos. Repetirlos en dos zonas es recomendación comercial; la ausencia de footer por sí sola no demuestra infracción.

Los controles actuales tienen mínimos CSS de 44×44 (`base.css:6783–6789`, `:6857–6860`); verificar dimensiones reales y contraste sin hacerlos diminutos para parecer exclusivos. Un estado compacto puede abrir la lista completa; no debe esconder destinos compartidos ni representar una moneda independiente cuando el formulario cambia país.

Prueba A7: dos países con una moneda, países con monedas distintas, un solo país, un solo idioma y un idioma no compatible con el nuevo país; 320/375/390 px y desktop, teclado/lector, JS activado/desactivado. Nombres largos no causan overflow; IDs de header/móvil/footer son únicos. Precio, moneda, disponibilidad y ruta localizadas se reconcilian, conservando carrito y contexto cuando sea soportado; cualquier cambio inevitable se explica. No prometer retener una variante que el mercado de destino no vende.

## 6. Archive y H01/H06: atractivo con expediente

**La salida comercial es narrar hechos documentados por pieza y mostrar límites honestos.** El objetivo de “100% legales” se traduce aquí en controles verificables de publicación y trazabilidad. Ningún dictamen de tema garantiza legalidad universal para todos los productos, mercados o expedientes. Este límite no impide entregar copy, campos y criterios seguros para revisión.

**H01 revalidado:** `listings/archive/templates/product.json:75–78` asigna 1994, unicidad activada, grade_1 y una nota de museo/autenticación a nivel de plantilla. Featured product asigna 1992 y otro registro (`index.json:111–114`). Home/marquee/colección incluyen “MUSEUM GRADE”, “CERTIFIED 1-OF-1” y certificado para cada lote (`index.json:34–37,55–57`; `collection.json:11–12`). La condición de badge del snippet exige una variante, inventario gestionado y política deny, pero no expediente ni cantidad uno (`product-provenance.liquid:13–19`). El texto real del badge localizado es “Single archival piece”, no literalmente “1-of-1” (`locales/en.default.json:427`); las promesas 1-of-1 están en los listings citados. Los defaults de schema ya son `show_unique_piece=false` y `condition_grade=not_assessed` (`main-product.liquid:1133–1147`): el riesgo actual está también en las instancias de preset, no solo en defaults.

**H06 revalidado y delimitado:** en el dictamen previo cubre claims de Imprint/Sartorial, no un segundo defecto independiente de Archive: aerospace/weatherproof (`listings/imprint/templates/index.json:22,34,52,76`), Biellese/Mulberry/origen (`listings/sartorial/templates/collection.json:12`, `index.json:33,121`). Se aplica el mismo control documental; no duplicar severidad por repetir la clase de problema. No se inspeccionaron expedientes externos, por lo que no se declara falsedad demostrada.

Contrato de publicación propuesto a Claude/Johandry, sin imponer IDs técnicos:

| Dato de negocio | Evidencia mínima y presentación | Default seguro |
|---|---|---|
| Identidad de pieza | ID de producto y, cuando cambie condición/procedencia, variante física; referencia de expediente interno y responsable. | Sin expediente: sin sello. |
| Unicidad | Alcance explícito: pieza individual documentada, edición de una unidad o unidad disponible. Prueba de edición/autor/procedencia según claim. | false/desconocido; ocultar “1-of-1”. Stock 1 solo acredita cantidad vendible registrada, no unicidad mundial ni autenticidad. |
| Fecha/circa | Fuente fechada o intervalo estimado, método y responsable. “Circa” expresa aproximación y necesita base; evitar precisión inventada. | Vacío; ocultar fecha. |
| Condición | Evaluación fechada de esa pieza, escala explicada y defectos/fotos verificables. | not_assessed; ocultar grado positivo. |
| Autenticación/procedencia | Quién examinó, qué concluyó, alcance, fecha y documento consultable con datos sensibles redactados. | Sin certificación implícita. |
| Conservación/museum grade | Tratamiento/material realmente documentado y criterio definido. No sugerir aval de museo por estética o una escala propia; no recomendar desacidificación universal para cualquier material. | Vacío; describir cuidados comprobados. |
| Material/origen/rendimiento | Ficha de proveedor, composición, fabricante y ensayo pertinente si se promete desempeño. | Descripción neutral sin garantía técnica no acreditada. |
| Vigencia y permiso | Revisor, fecha, estado aprobado, documento vigente y derechos de texto/imagen/publicación. | No publicado hasta revisión. |

Los campos específicos de pieza no deben contaminar productos que comparten template. Si un metafield o fuente se configura mediante editor, exigir ayuda localizada sobre dependencia externa; el liderazgo decide almacenamiento y conexión dinámica. Si los datos de producto/variante son contradictorios, faltan o están caducados, **ocultar el claim positivo** y conservar la ficha esencial de compra. Una colección solo puede decir “cada lote” si todos los productos servidos cumplen; en otro caso usar alcance explícito, por ejemplo “Consulta la procedencia y condición documentadas de cada pieza en su ficha”. Publicar ese ejemplo solo cuando existan esas fichas.

Copy atractivo a partir de un expediente válido: “[Diseñador] · [colección o periodo acreditado]”; “Circa [intervalo respaldado]”; “Condición [grado de escala publicada], con [desgaste documentado]”; “Procedencia documentada: [origen acreditado]. Ver ficha de la pieza”. Evitar “Museum certified”, “Museum grade” o “Authenticated” como ornamento universal. Una escala propia puede presentarse como “Evaluación de condición del archivo” y explicar método, autor y límites; no equivale por sí sola a certificación externa.

**A8:** dos productos en la misma plantilla con años, grados y procedencias diferentes; uno sin expediente; variantes con condición distinta; expediente retirado/caducado; stock 0/1/2 y políticas continue/deny. Cada ficha y cada bloque featured/card/colección expresa solo lo acreditado para su ámbito. Ningún desconocido hereda año, grado, número de registro o badge del preset. Johandry aprueba la matriz claim→SKU/variante→documento→copy y un auditor distinto intenta falsificarla. La documentación aprobada, capturas de las ramas desconocidas y comprobación de demo real son evidencia de cierre; un gate que solo comprueba presencia de markup no valida autenticidad.

## 7. Cierre por estados y orden de entrega

| Estado obligatorio | Riesgo que debe cubrir la remediación |
|---|---|
| Vacío | Carrito anuncia vacío y conserva una salida útil; newsletter vacío rechaza de forma comprensible; claim desconocido se oculta; ausencia de países/idiomas alternativos no deja control decorativo. |
| Uno | Borrado de única línea; foto única estable; un país/idioma sin selector redundante; pieza única sin inferir autenticidad del stock. |
| Muchos | 10+ líneas con operaciones cruzadas; productos/variantes con propiedades/planes; 10+ fotos y 40 variantes; muchos destinos de moneda compartida y muchos idiomas sin tapar compra. |
| Muy largo | Producto de 120 caracteres, variante/vendor extensos, importe con símbolo/código largo, mensaje de error y país largo; wrapping sin ocultar CTA, resultado o foco. |
| Faltante | Foto/secundaria/poster ausentes o fallidos, expediente/metafield vacío y respuesta de red desconocida; sin invisibilidad ni éxito/claim inventado. |

Secuencia de entrega propuesta:

1. **Claude:** corregir integridad de escritura del carrito y resultado/foco de borrado; verificar la fotografía única y control de vídeo. **Johandry:** bloquear claims no acreditados y entregar expedientes reales. **Claude:** devolver país/mercado elegible completo; estos frentes condicionan submission.
2. **Claude + Johandry:** cerrar newsletter con envío real autorizado y lector; después jerarquía internacional y eliminación de marquee-drift. El aspecto sensorial se revisa con la compra ya fiable.
3. **Auditor distinto del implementador:** Gate 5 en tres presets, desktop y móvil, teclado/AT, variantes hostiles, latencia y fallos; reconciliar commit, ZIP y deploy. **Gemini/Claude:** registrar decisiones de contrato autorizadas y reconciliar ledger/BOARD mediante sus escritores habilitados.

Matriz base de aceptación: 1280/1440 px y 320/375/390 px; zoom 200% y reflow; Chrome/Edge, Safari y Firefox en versiones exigidas por Shopify, además de móvil real o simulado según la prueba. Las comprobaciones de lector requieren AT real, no solo axe. Guardar commit/deploy, ruta, catálogo, estado previo/final, dispositivo, secuencia, resultado y artefacto. Pasar sintaxis/Theme Check no sustituye estas rutas. La certificación final se apoya en [accesibilidad oficial Shopify](https://shopify.dev/docs/storefronts/themes/best-practices/accessibility), que también advierte que seguir una lista parcial no garantiza accesibilidad completa.

**Filas del ledger cerradas o modificadas por este documento: ninguna.** Candidatas a reconciliación por su dueño, sin cambiarles estado: Live Regions (`requirements-ledger.md:54`), movimiento reducido (`:56`), motor CSS (`:38`), País/Moneda (`:82`), Idioma (`:83`), Newsletter (`:84`) y confianza/inventario (`:88`). Sus certificaciones históricas no prueban estos casos nuevos ni autorizan regresiones; la nueva prueba debe señalar exactamente qué contrato cubre.

## 8. Afirmaciones falsables

F1. El POST de cambio usa `line`; el busy selector no contiene botones de stepper. Las guardas de render no equivalen a serializar escrituras.

F2. `changeLine` no llama a `showStatus`; su render puede terminar enfocando Cerrar si el control desaparece.

F3. Los dos formularios newsletter sí emiten éxito/status; el helper de foco requiere un tabindex ausente en esos mensajes.

F4. El hero puede iniciar vídeo programáticamente, declara loop y su clase no ofrece pausa manual; reduced-motion ya lo frena en su rama.

F5. CSS desvanece la primaria sin exigir secundaria, mientras Liquid condiciona la existencia de secundaria.

F6. Full compone dos desplazamientos de marquesina; la regla de pausa mantiene running el segundo. La sensación de tirón sigue atribuida al reporte humano.

F7. El selector actual agrupa por moneda y omite nombre de país; footer no renderiza el snippet. Eso no certifica su comportamiento remoto.

F8. Los listings contienen los claims detallados en §6; el snippet de unicidad no comprueba expediente. No se verificó si existen documentos externos que acrediten cada producto.

## 9. Comandos, resultados y límites de verificación

Los siguientes son extractos literales de terminal ejecutados en el workspace. Los rangos de código se leyeron con `Get-Content` numerado; las líneas citadas pertenecen a este árbol, no a memoria histórica. Las búsquedas fallidas por glob de PowerShell y los nombres inexistentes `sections/video.liquid`/`snippets/localization-form.liquid` se corrigieron buscando en los directorios reales; no se usaron como prueba de ausencia funcional.

V1. `git status --short` inicial y `git rev-parse HEAD`:

```text
?? SARTORIAL-SOURCE-BUNDLE-PARA-ARGON.md
?? agent-comms/outbox-gpt/GPT-AUDIT-COMMERCIAL-380-20261016.md
?? scripts/build-argon-bundle.mjs
510259799cf78bd56c220d58d7e2e2499c0a7a4f
```

Git emitió avisos de permiso sobre el ignore global; los comandos completaron. Los tres archivos ajenos se preservaron.

V2. Registro histórico de la primera versión: `rg -l -i 'TEC-01|TEC-02|TEC-03|TEC-04|64/100|GPT-STRATEGY-MASTER-001' agent-comms docs -g '*.md'`, antes de crear este documento y de recibir la ruta de Claude:

```text
agent-comms\outbox-gpt\GPT-AUDIT-017-post-remediation-commercial-verdict.md
```

La coincidencia inicial era el Lighthouse histórico 64/100. Esa búsqueda no localizó entonces el informe completo. **El límite de acceso a Claude queda resuelto en esta actualización:** Johandry aportó su ruta y se leyó íntegro; véanse §1.1 y V9. Se conserva esta salida como registro de lo ejecutado inicialmente, no como descripción del acceso actual. Se leyeron AGENTS, BOARD en solo lectura, RULES, dictamen comercial previo y archivos pertinentes. BOARD conserva fechas históricas; no se convirtió su narrativa de certificación en observación actual.

V3. Lectura numerada de `assets/theme.js`, rangos 3091–3142, 3286–3309, 3367–3381, 5564–5591; extractos:

```text
3091:     async changeLine(line, quantity) {
3104:           body: JSON.stringify({
3105:             line,
3106:             quantity,
3122:         await this.renderCartResponse(result, revision);
3309:         (target || this.crossSellFocusAfterRender(active, nextContent) || this.querySelector('[data-cart-drawer-close]'))?.focus();
3369:       this.querySelectorAll('[data-cart-quantity], [data-cart-remove], [data-cross-sell-add], [data-cross-sell-expand], [data-cross-sell-cancel]').forEach((control) => {
5591:       input.dispatchEvent(new Event('change', { bubbles: true }));
```

Prueba contratos estáticos F1/F2; no número de peticiones, orden real ni resultado de checkout.

V4. `rg -n 'initFormMessageFocus|grade_1|single_piece|newsletter.success' assets/theme.js locales/en.default.json` y lectura numerada de newsletter/footer/helper:

```text
assets/theme.js:5626:  const initFormMessageFocus = () => {
assets/theme.js:5650:  initFormMessageFocus();
locales/en.default.json:427:        "single_piece": "Single archival piece",
locales/en.default.json:430:        "grade_1": "Grade I · Minimal visible wear",
sections/newsletter.liquid:53:         <p class="form-message form-message--success" role="status">
sections/footer.liquid:63:             <p class="form-message form-message--success" role="status">
5627:     const message = document.querySelector('.form-message[tabindex="-1"]');
```

Prueba F3 y el texto localizado del badge; no recepción/consentimiento del lead ni anuncio real de AT.

V5. Lecturas numeradas y `rg -n` de hero, product-card, marquesina y CSS:

```text
sections/hero-editorial.liquid:100:             loop
3634:         await this.video.play();
assets/base.css:1872:.product-card__media:hover .product-card__image--primary,
1874:   opacity: 0;
snippets/product-card.liquid:144:         {%- if show_secondary_image and secondary_image != blank -%}
9328:       animation-name: editorial-marquee, marquee-drift;
9333:       animation-composition: replace, add;
3998:   animation-play-state: paused, running;
```

Prueba F4–F6 a nivel de fuente. No se midieron duración, fotogramas, CLS, rendimiento ni percepción de tirón.

V6. Lectura numerada de `snippets/localization-selectors.liquid` y `rg -n -i 'localization|locale|country|currency|language' sections/header.liquid sections/footer.liquid`:

```text
55:           <select id="{{ localization_form_id }}-country" class="localization-form__country" name="country_code" data-localization-select>
65:               {%- unless listed_currencies contains currency_key -%}
68:                   <option value="{{ localization.country.iso_code }}" selected>{{ currency_code }}{{ country.currency.symbol }}</option>
70:                   <option value="{{ country.iso_code }}">{{ currency_code }}{{ country.currency.symbol }}</option>
sections/header.liquid:124:            {% render 'localization-selectors', context: 'header-mobile' %}
sections/header.liquid:188:      {% render 'localization-selectors', context: 'header' %}
```

La búsqueda no devolvió render en footer y se comprobó su markup completo pertinente. Prueba F7; no configuración de Markets ni precio/despacho real.

V7. `rg -n -i 'show_unique_piece|condition_grade|museum|conservator|circa|aerospace|weatherproof|Biell|Mulberry|authenticated|authentication|1-of-1' listings -g '*.json'`; extractos:

```text
listings\archive\templates\index.json:57:        "accession": { "type": "item", "settings": { "text": "CERTIFIED 1-OF-1 ACCESSION REGISTRATION" } },
listings\archive\templates\product.json:76:            "show_unique_piece": true,
listings\archive\templates\product.json:77:            "condition_grade": "grade_1",
listings\imprint\templates\index.json:52:            "heading": "Aerospace grade EDC systems",
listings\sartorial\templates\collection.json:12:            "text": "<p>Follow a material study from raw Biellese fleece to finished bespoke silhouette.</p>",
```

Se leyó además `product-provenance.liquid:12–49` y schemas de main/featured product. Prueba F8; no autenticidad material ni inexistencia de expedientes externos.

V8. Fuentes web primarias abiertas y contrastadas el 2026-10-16: enlaces próximos a cada afirmación en §§2–6; Shopify requirements, Cart Ajax, Markets y sus guías UX/accesibilidad; W3C/WAI 2.2.2/4.1.3/2.3.3/2.4.3; Nielsen heurísticas originales. La investigación es documental actual, no aprobación oficial.

V9. Actualización por ruta aportada por Johandry: lectura íntegra de la captura A de 525 líneas de `agent-comms/outbox-claude/CLAUDE-AUDIT-TECH-001.md` mediante `Get-Content` y tramos numerados para recuperar toda salida truncada. Sobre A, `rg -c '^#### TEC-'`, `rg -c '^#### TEC-0[1-4] · P1'` y `rg -c '^#### TEC-.* · P2'` devolvieron:

```text
35
4
31
```

Se leyeron encabezado, rúbrica, cuatro P1, los 31 P2, conclusiones, propuestas y notas de límites; el conteo no constituye auditoría de los P2. Relectura actual de `theme.js:2380–2415,3091–3127,3300–3310,3367–3381,3617–3639,5626–5634`, y `rg -n` de IDs/data-line y mensajes en drawer/newsletter/footer, confirmó los patrones reconciliados en §1.1. No se repitió una auditoría integral ni se aceptaron los P2 como certificados por este contraste.

`git rev-parse HEAD`, `git cat-file -t 3e2a732` y `git diff --stat 3e2a732 HEAD -- assets/theme.js sections/cart-drawer.liquid sections/newsletter.liquid sections/footer.liquid sections/hero-editorial.liquid`:

```text
510259799cf78bd56c220d58d7e2e2499c0a7a4f
fatal: Not a valid object name 3e2a732
fatal: bad revision '3e2a732'
```

La comparación entre commits no pudo realizarse porque el objeto no está disponible localmente; no se presupone ascendencia ni igualdad. El control final detectó que la ruta Claude había cambiado sin escritura de este auditor. Se leyó íntegra B (275 líneas), cuyo hash fue estable durante esa lectura. Salidas literales de `Get-FileHash`, recuento de `Get-Content` y comparación de hash antes/después de leer B:

```text
Captura A SHA256: 6244505447F8FD1D6441651497437D63652980E66B00BEBD4FD73FD3FCE31D6C
CURRENT_SHA256: DE62F8EC9E86DC3A9F5ADDBB3FC0D736C02EEAC89D0FDA7CFF5EF11B62033180
LINES: 275
HASH_STABLE_DURING_READ: True
```

El primer hash se etiqueta aquí como captura A; la salida inicial de PowerShell lo mostraba en la columna Hash. `rg -n -A 22 -B 5 '"id": "animations"' config/settings_schema.json` y lectura de su ayuda localizada confirmaron none/subtle/full y default subtle; se comprobaron también control/region local en `cart-drawer.liquid:83,255,280,302`. Esto resuelve las discrepancias materiales de B sin reauditar sus P2. El estado inicial de esta actualización ya incluía el informe Claude como no rastreado. La única escritura de este auditor fue al presente dictamen; **no se afirma que el archivo externo permaneció inalterado durante toda la sesión**. No se abrieron nuevas rondas de fuentes ni se consultó memoria adicional. Cualquier cambio posterior de la ruta queda fuera de las dos capturas identificadas.

No se ejecutaron tests de implementación, `gates:static` (que puede regenerar paquete), deploy, commit/push, compra ni envío de newsletter. No se accedió a credenciales ni se modificaron BOARD, ledger, código, catálogo o ZIP. La única escritura autorizada es este dictamen. La tarea documental queda completada; A1–A8 describen trabajo de remediación/verificación pendiente, no resultados aprobados.
