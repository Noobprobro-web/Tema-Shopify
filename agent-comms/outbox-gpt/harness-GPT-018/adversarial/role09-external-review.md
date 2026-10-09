ID: GPT-018-ADV-ROLE09-001
Estado: Revisión adversarial independiente completada; evidencia acotada a los artefactos adjuntos.
Decisión requerida: Ninguna para el dictamen; mantener NVDA/lector real y comportamiento de animación como no verificados.
Resumen en 5 líneas:
- Confirmado: en móvil 390×844, resultados JSON registran selección de variante con foco visible; ArrowRight cambia Atelier 36→38 y Edition Black box calf→Saddle tan; Archive conserva Restored, la única opción.
- Confirmado: Tab hasta Add to cart y Enter produce respuesta HTTP 200 de /cart/add.js en los tres presets, con movimiento Full y Reduced registrado por separado.
- Confirmado: Atelier y Edition permiten aumentar cantidad con respuesta /cart/change.js HTTP 200; Archive no expone control de aumento habilitado en el producto elegido, coherente con la variante agotada/unidad archivística del flujo.
- Confirmado: Enter sobre Remove produce /cart/change.js HTTP 200 y el muestreo del texto visible contiene “cart is currently empty” en ambas preferencias de movimiento; pageErrors está vacío en los seis recorridos.
- No verificado: NVDA u otro lector real, equivalencia de anuncios ARIA, resultados en una ruta/error page y que reduced motion suprima/reduzca todas las animaciones; el script alterna `emulateMedia` y repite flujos, pero no mide una aserción de movimiento.
Archivos tocados: `agent-comms/outbox-gpt/harness-GPT-018/adversarial/role09-external-review.md`.
Desviaciones (Nivel 1 o Nivel 2): Revisión de evidencia ya capturada, sin reabrir ninguna tienda.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): PowerShell `foreach($s in 'atelier','edition','archive'){...Get-Content ...*-pdp-cart-results.json | ConvertFrom-Json...}` → 2 recorridos por tienda, `pageErrors=0`; ambos modos devuelven Add 200 y Remove 200/estado vacío en los tres; Quantity 200 en Atelier y Edition, sin control enabled alcanzable en Archive. `Get-Content keyboard-pdp-cart.mjs` confirma el uso de Playwright `keyboard.press`, `emulateMedia` y espera de endpoints cart. No prueba lector de pantalla físico ni resultados en lector real. Capturas: `role-09-a11y/{atelier,edition,archive}-{full,reduced}-{variant-focused,add-focused,after-add,quantity-focused,after-quantity,remove-focused,after-remove}.png`.
Lista de afirmaciones falsables numeradas:
1. Atelier: `atelier-pdp-cart-results.json` muestra en Full/Reduced `variantBefore.name=36`, `variantAfter.name=38`, foco `solid 2px`, `addResponse.status=200`, `changeResponse.status=200`, `removeResponse.status=200` y texto final de carrito vacío.
2. Edition: `edition-pdp-cart-results.json` muestra transición Black box calf→Saddle tan, mismos estados HTTP y foco sólido visible en ambos modos.
3. Archive: `archive-pdp-cart-results.json` muestra `Restored→Restored` (opción única); no se alcanza cantidad habilitada, mientras Add/Remove devuelven 200 y el carrito termina vacío. La cantidad deshabilitada no se clasifica como defecto.
4. Los tres archivos `*-pdp-cart-results.json` contienen dos recorridos y `pageErrors: []`; el script `keyboard-pdp-cart.mjs` captura los estados Full/Reduced a 390×844 y hace acciones por teclado.
5. Las 39 evidencias de `run-a11y.mjs` anteriores no bastan para afirmar recorrido teclado integral de PDP/carrito: el script PDP/carrito separado es el que ejercita estas interacciones; ninguno ejecuta NVDA/AT real ni una aserción sobre las animaciones reducidas.

Firma de revisión adversarial independiente: GPT-018 Rol 04, revisor distinto de quien ejecutó Rol 09; 2026-10-01 (America/Caracas). Dictamen limitado a la evidencia local referenciada arriba.
