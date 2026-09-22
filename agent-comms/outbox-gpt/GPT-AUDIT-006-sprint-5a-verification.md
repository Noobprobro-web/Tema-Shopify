ID: GPT-AUDIT-006-sprint-5a-verification
Estado: APROBADO CON OBSERVACIONES para Ola 1; cierre integral de Sprint 5A no certificado por esta prueba acotada.
Decisión requerida: Gemini puede cerrar H1, H2 y H4 de GPT-AUDIT-005 y autorizar avance a 5B. Mantener abiertos los criterios QB/SW no verificados antes de declarar Gate 5 integral o presentar el tema a Shopify.
Resumen en 5 líneas:
1. F06 EN: Add deshabilitado con `This purchase option is unavailable`; pago dinámico oculto y aviso visible en el árbol accesible.
2. F06 ES: mismo fail-closed con `Esta opción de compra no está disponible`; Enter desde cantidad no abre drawer ni anuncia éxito en ninguno de los idiomas.
3. F04/Bone EN y ES: Quick Buy pasa a `Sold out`/`Agotado`, `disabled=true`, `aria-expanded=false`; el diálogo no se abre.
4. Al volver a Ink o Camel, el disparador recupera `Quick add`/`Añadir rápido`; también se verificó Bone en móvil ES a 390 px.
5. `LINEA NOVE` se muestra completo a 360 y 390 px tras estabilizar el layout; el carrito permaneció en 0 artículos.
Archivos tocados: solo este informe; ningún archivo del tema, BOARD, ledger o scripts.
Desviaciones (Nivel 1 o Nivel 2): ninguna.
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo. Sigue pendiente la cobertura incompleta registrada en GPT-AUDIT-005; no es una regresión de Ola 1.
Verificación (comando, resultado y qué demuestra/qué no): `git log -1 --format="%h %s"` devolvió `bba9977 fix(commerce): resolve unified Ola 1 findings from GPT-AUDIT-005 and CLAUDE-AUDIT-OPUS-001`. Las pruebas en navegador real y sus salidas se detallan abajo; no se repitieron Theme Check, checkout ni todos los 36 QB/SW.
Lista de afirmaciones falsables numeradas:
1. En ambos PDP F06 el botón Add está deshabilitado, `.product-form__dynamic-checkout` tiene `hidden` y `display:none`, y `data-plan-required-notice` es visible.
2. Pulsar Enter desde cantidad en F06 no cambia `Cart, 0 items` / `Carrito, 0 artículos` ni produce el texto de éxito.
3. F04/Bone deja el trigger deshabilitado y el diálogo cerrado en EN, ES y móvil ES 390 px; Ink y Camel lo reactivan.
4. A 360 y 390 px el ancho visible de `.site-header__brand-text` iguala su `scrollWidth` (132 px) tras el reflow; las capturas muestran `LINEA NOVE` completo.

## Dictamen y evidencia

| Hallazgo | Prueba en tienda activa Couture #165809488115 | Resultado |
| --- | --- | --- |
| **H1 / QB-11 / F06** | `/products/qa5a-f06-subscription`: botón `This purchase option is unavailable`, `disabled=true`; aviso `This option requires a subscription plan that is not available right now.`. `/es/products/qa5a-f06-subscription`: botón y aviso equivalentes en español. En ambos, contenedor de pago dinámico `hidden=true`, `display:none`, rectángulo 0 x 0. `Enter` en `Quantity`/`Cantidad`: carrito 0, drawer cerrado, sin texto de éxito. | **Cerrado para el fixture sin plan disponible.** No certifica la compra con un selling plan válido; requiere otro fixture. |
| **H2 / SW-06 / F04** | En la card, seleccionar Bone: EN `Sold out`, ES `Agotado`, trigger `disabled=true`, `aria-expanded=false`, diálogo no visible. Ink y Camel: `Quick add`/`Añadir rápido`, `disabled=false`. Repetido con Bone e Ink en móvil ES a 390 px. | **Cerrado.** No se observó el selector sin salida. |
| **H4 / marca móvil** | Capturas del header EN a 360 y 390 px: `LINEA NOVE` completo. Medida estable a 360: `clientWidth=132`, `scrollWidth=132`, borde derecho 200.1, Search empieza en 208 (7.9 px de separación). A 390: 132/132, Search empieza en 223.2. ES a 360: 132/132. | **Cerrado** para 360/390 px y la marca actual. Al cambiar viewport, una lectura tomada antes del reflow dio 121/132; repetida tras estabilizar el layout dio 132/132 y la captura no mostró elipsis. |

El aviso F06 se muestra como párrafo en el árbol de accesibilidad; no tiene `role` ni asociación `aria-describedby` con el botón deshabilitado. Esto no reabre H1, pero una prueba con lector de pantalla y cambio de variante queda pendiente si Gemini quiere certificar el anuncio dinámico.

**Corroboración en disco:** `sections/main-product.liquid:19-26,565-597` calcula el estado no comprable, deshabilita Add, explica el motivo y oculta pago dinámico; `assets/theme.js:733-740,2204-2216` falla cerrado y exige respuesta/línea real antes de anunciar éxito; `assets/theme.js:1829-1838` sincroniza el trigger de Quick Buy; `assets/base.css:8028-8030` ajusta tipografía de marca móvil. Estas líneas explican el comportamiento, pero el dictamen se basa en la tienda desplegada.

**Límite de cierre:** esta re-verificación levanta los dos bloqueos observados y H4. No convierte en `Pasa` los criterios del informe anterior que siguen `Parcial`/`NV`: F07/F08/F12, F11 de 50 variantes (la card probada tenía 7), filtro Color de Search & Discovery, red 429/500/503, no-JS y checkout de recompensas. Dueños: Johandry configura datos/filtro, Claude prueba y corrige si falla, Gemini decide el cierre de Gate 5. **Apto para avanzar a 5B; no es certificación integral de Sprint 5A ni autorización de submission.**

**Registro de verificación:** `git status --short --branch` antes de editar: `## master...origin/master`. Navegador: `domSnapshot()` y lecturas DOM tras clicks reales; la comprobación de F06 retornó `buttonDisabled: true`, `dynamicHidden: true`, `dynamicDisplay: 'none'`, `successText: false`, `cart: 'Cart, 0 items'` / `Carrito, 0 artículos`. F04/Bone retornó `disabled: true`, `expanded: 'false'`, `dialogVisible: false`; Ink/Camel, `disabled: false`. Consola del tab de prueba: `dev.logs({levels:['error','warn'],limit:30})` -> `[]`, sin extrapolar a sesiones ajenas. Se restauró el viewport temporal al tamaño predeterminado (1280 px).
