ID: GPT-R5-001
Estado: Listo para revisión independiente de Claude; PR abierto en borrador
Decisión requerida: Ninguna para este alcance. Gate 5 y fusión quedan para Claude/Johandry.
Resumen en 5 líneas:
- Implementados A–E en una rama nueva desde `origin/master` = `6b19e82fa03ad3253b63b3aec5ad5024096703a6`.
- F verificado sin cambio: los textos ya estaban en sentence case y cubiertos por el test R4 C4.
- Los tests nuevos fallaron con la base y pasaron con los cambios; suite final: 135/135.
- `npm run gates:static` pasó después de cada commit de código; ZIP final: 111 archivos, validación de tienda: NO.
- PR #31 está abierto en borrador contra `master`; no se subió el tema ni se ejecutó ningún flujo de compra.
Archivos tocados: `assets/theme.js`, `sections/main-cart-items.liquid`, `assets/base.css`, `tests/r3-cart.spec.mjs`, `tests/support/r3-support.mjs`, `tests/r5-cart-page.spec.mjs`, `tests/r5-sticky-bar.spec.mjs`, `tests/r5-404-search.spec.mjs`, `tests/r5-gallery-media.spec.mjs`, `tests/r5-mobile-localization.spec.mjs`, `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`.
Desviaciones (Nivel 1 o Nivel 2): Ningún cambio de contrato/setting (Nivel 2). A y B requirieron commits correctivos adicionales después de que los primeros commits ya estaban publicados; D requirió un seguimiento tras la revisión de la rejilla mixta. No se reescribió ni forzó historial.
Hallazgos extra fuera de alcance (con parche listo): D80 (precio de comparación en cajón y /cart) permanece como residual aceptado. Los overlays de featured product a 0 px siguen siendo configuración demo (D70). La miniatura de la barra fija no sigue a la variante (QA 9), fuera de esta ronda. No se preparó parche para esos temas.
Verificación (comando, resultado y qué demuestra/qué no): Ver §3–§6. Playwright local demuestra regresión de diseño y lógica con red simulada; no certifica Shopify Markets, inventario real, tecnologías de medios de Shopify ni Gate 5.
Lista de afirmaciones falsables numeradas:
1. Base del trabajo: `6b19e82fa03ad3253b63b3aec5ad5024096703a6`; rama `codex/r5-001-six-fixes`.
2. El head de código empaquetado fue `db5b1b772610b06ebcab22c053da053104a15703`.
3. La batería completa exceptuó únicamente `tests/pdp-line-total.spec.mjs` por requerir storefront local en `127.0.0.1:9292`.
4. La ZIP dice expresamente `Validado en tienda: NO`.

# GPT-R5-001 — Entrega R5

## 1. Rama, commits y PR

Rama: `codex/r5-001-six-fixes`, creada desde `origin/master` en `6b19e82fa03ad3253b63b3aec5ad5024096703a6`.

PR en borrador: [#31 — R5: seis arreglos de producto y UX](https://github.com/Noobprobro-web/Tema-Shopify/pull/31), contra `master`. Está abierto y no fusionado.

Commits de los arreglos (por orden de alcance; los seguimientos reflejan hallazgos adversariales después de publicar el commit anterior):

| Arreglo | Commit | Mensaje |
|---|---|---|
| A1 | `1cb4eca59424f3b1162abe0bff095622f5100f7d` | Actualiza cantidades y subtotal en el carrito (QA 1) |
| A2 | `b6683b4bf98ed55c215ebdf25b07a4c8b133080e` | Valida existencias y sincroniza el envío del carrito (QA 1) |
| B1 | `832cbfcdeb93874598baa364e169ef1444ef0586` | Corrige el tramo oculto de la barra fija de compra (QA 5) |
| B2 | `49c961ed9aaab1cc3c3e4bab265d8792132b9819` | Corrige saltos y foco de la barra fija de compra (QA 5) |
| B3 | `71eaaa9a3bcb044a3343a09a3a41c8da31199dd0` | Ajusta la reserva inferior al redimensionar la barra fija (QA 5) |
| C | `973eaaa192d2379f73721fbd4cafc0119d7eb1fb` | Evita que se corte la búsqueda de la 404 (QA 3) |
| D1 | `584771e0ff9a0bf5d134803e38b9e3e86bd68957` | Elimina los huecos de vídeo y 3D en la galería (QA 6) |
| D2 | `db5b1b772610b06ebcab22c053da053104a15703` | Ajusta los medios a filas con fotos verticales (QA 6) |
| E | `b9d9b8779df8b3fdb55aa855baab6dc139ed851b` | Ajusta el selector de país al menú móvil (QA 7) |

A quedó en dos commits porque, tras publicar A1, la revisión encontró que `/cart/update.js` no valida inventario de variantes ya presentes, que Checkout podía adelantarse a una mutación del cajón y que una clave de línea rotada podía anunciar una eliminación falsa. A2 cambió las mutaciones a `/cart/change.js` en serie por clave, espera ambas colas antes del submit nativo y evita anunciar una eliminación sin orden de cantidad cero.

B quedó en tres commits porque, después de publicar B1 y B2, la revisión detectó respectivamente saltos de scroll que no generan muestra de `IntersectionObserver` y un offset inferior obsoleto tras redimensionar. B3 mide el alto real de la barra al resize y evita escrituras redundantes.

D quedó en dos commits porque D2 corrige la rejilla mixta con foto vertical vecina, donde la revisión detectó un hueco mayor bajo medios ricos. No se usó force-push ni rebase.

## 2. Archivos y líneas finales por arreglo

- **A — carrito:** `sections/main-cart-items.liquid:7,12,30,39,179,193`; controlador, mutación, lectura sin caché, cola de cajón/página, foco y región viva en `assets/theme.js:287,372,378,4184,4202,7198-7208,7309-7316`. Tests en `tests/r5-cart-page.spec.mjs:62,98,118,127,142,156,167,180`, con ajustes de fixture/regresión en `tests/support/r3-support.mjs` y `tests/r3-cart.spec.mjs`.
- **B — barra fija:** `assets/theme.js:2005,2009,2012,2016,2026,2052,2059,2083`; regresiones de umbral, resize, foco y limpieza en `tests/r5-sticky-bar.spec.mjs:56,84,103,107,119,139`.
- **C — 404:** `assets/base.css:7367`; `tests/r5-404-search.spec.mjs:69,86`.
- **D — medios:** `assets/base.css:9184,9201,9214`; `tests/r5-gallery-media.spec.mjs:50,64,81,102,116`.
- **E — localización móvil:** `assets/base.css:7646`; `tests/r5-mobile-localization.spec.mjs:68,79,95`.
- **F — mega menú:** sin archivos cambiados ni commit. Verificación en §7.

## 3. Playwright: ejecuciones con BASE y arreglo

Los specs usan las variables `R3_THEME_JS` y/o `R3_BASE_CSS` con blobs de la base `6b19e82`, y luego los archivos de HEAD. Las líneas de resumen y logs son:

| Arreglo/commit | BASE (esperado rojo) | HEAD/arreglo (verde) |
|---|---|---|
| A1 `1cb4eca` | `9 failed, 1 passed (40.3s)`; `codex-r5-a-base.log` | `17 passed (10.7s)`; `codex-r5-a-fixed.log` |
| A2 `b6683b4` | `11 failed, 1 passed (40.7s)`; `codex-r5-a2-base.log` | `19 passed (12.1s)`; `codex-r5-a2-fixed.log` |
| B1 `832cbfc` | `4 failed, 2 passed`; `codex-r5-b-base.log` | `6 passed`; B junto con R4, `20 passed`; `codex-r5-b-head.log`, `codex-r5-b-fixed.log` |
| B2 `49c961e` | `8 failed, 2 passed`; adicionalmente los cuatro nuevos casos fallaron en B1; `codex-r5-b2-base.log`, `codex-r5-b2-intermediate.log` | `24 passed (7.8s)`; `codex-r5-b2-head.log` |
| B3 `71eaaa9` | BASE y B2: ambos `2 failed` con 65 px recibidos frente a 81 px esperados; `codex-r5-b3-base.log`, `codex-r5-b3-intermediate.log` | `26 passed (8.2s)`; `codex-r5-b3-head.log` |
| C `973eaaa` | `3 failed`, incluida medición de 90 px útiles frente a placeholder inglés de 200 px a 1024 px; `.tmp/r5-c-red.log` | `9 passed (4.3s)`, incluidos 6 tests R4; `.tmp/r5-c-green.log` |
| D1 `584771e` | `4 failed, 4 passed`; `codex-r5-d-base.log` | `8 passed`; junto con R4, `22 passed`; `codex-r5-d-head.log`, `codex-r5-d-fixed.log` |
| D2 `db5b1b7` | Test nuevo rojo en BASE y D1; con D1 faltaban ~401 px en el caso mixto; `codex-r5-d2-base.log`, `codex-r5-d2-intermediate.log` | `9 passed`; junto con R4, `23 passed`; `codex-r5-d2-head.log`, `codex-r5-d2-fixed.log` |
| E `b9d9b87` | `5 failed`; nombre largo a 360 px producía margen derecho de -320.36 px; `.tmp/r5-e-red.log` | `9 passed`, incluyendo 4 de R4; `.tmp/r5-e-green.log` |

**Batería final** sobre HEAD `db5b1b772610b06ebcab22c053da053104a15703`:
`npx playwright test --trace off <17 specs excepto tests/pdp-line-total.spec.mjs>` → `135 passed (1.1m)`, exit 0. Log: `C:\Users\Johan\AppData\Local\Temp\codex-r5-final-independent.log`. El spec excluido requiere un storefront local en `127.0.0.1:9292`; no se levantó ese servidor.

Los estados límite se cubrieron en los componentes modificados: carrito vacío/una/muchas líneas, título de 120 caracteres, sin imagen y respuesta de error; barra con acción/formulario faltante, una opción, 40 opciones, título largo, precio/CTA faltante; 404 con cero/uno/cuatro recomendaciones, título largo y sin imagen; galería vacía, única y 11 medios, 3D primero, proporción ausente, medios mixtos/verticales, AR; localización con un o dos países, país largo y opciones nativas. `npm run gates:static` aprobó después de cada commit de código (§4).

## 4. Gates estáticos

Después de cada commit de código (A1, A2, B1, B2, B3, C, D1, D2 y E), `npm run gates:static` terminó con exit 0. En cada caso: Theme Check inspeccionó 111 archivos sin infracciones, referencias internas ninguna y sintaxis/JSON/hooks/locales/ledger sin errores. Logs por commit:

- A1: `C:\Users\Johan\AppData\Local\Temp\codex-r5-a-gates.log`
- A2: `C:\Users\Johan\AppData\Local\Temp\codex-r5-a2-gates.log`
- B1: `C:\Users\Johan\AppData\Local\Temp\codex-r5-b-gates.log`
- B2: `C:\Users\Johan\AppData\Local\Temp\codex-r5-b2-gates.log`
- B3: `C:\Users\Johan\AppData\Local\Temp\codex-r5-b3-gates.log`
- C: `C:\Users\Johan\AppData\Local\Temp\codex-r5-001\.tmp\r5-c-gates.log`
- D1: `C:\Users\Johan\AppData\Local\Temp\codex-r5-d-gates.log`
- D2: `C:\Users\Johan\AppData\Local\Temp\codex-r5-d2-gates.log`
- E: `C:\Users\Johan\AppData\Local\Temp\codex-r5-001\.tmp\r5-e-gates.log`

## 5. ZIP y manifiesto

Generados una sola vez desde HEAD de código `db5b1b772610b06ebcab22c053da053104a15703), tras todos los fixes, gates y suite completa:

- ZIP: `Sartorial-1.0.0.zip`, 111 archivos, 338402 bytes, SHA-256 `a1c01543fc02e027d810e6eb320b462b03416b3fe005bb391c28d40cf3f158d7`.
- Huella de contenido (archivos extraídos en orden ZIP): `6ceb4706319d0ca867d9e88db775e0e01f3b1f30897cd2fec2a1f6a2f495b1bc`.
- Generación UTC: `2026-11-26T03:21:36Z`; Node `24.18.0`, zlib `1.3.1-e00f703`.
- `internal references: none`; `unzip -t` sin errores; orden de `unzip -Z1` cotejado con el índice de ZIP; `node --check` pasó en los tres JS extraídos (`theme.js`, `product-zoom.js`, `section-standard-b.js`).
- Manifiesto `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`: 10 líneas de cabecera + 111 entradas en orden de ZIP, incluido `Validado en tienda: NO`. SHA-256 normalizado LF: `44557f84fc883e7872b70e795480156213af0293a48fe3716e769f885f175d05`.

ZIP ignorada por Git y queda en el worktree local; manifiesto pendiente de su commit final separado. Registro: `C:\Users\Johan\AppData\Local\Temp\codex-r5-final-verify\verification-summary.log`.

## 6. Ledger de requisitos

No se editó `docs/requirements-ledger.md`; estados propuestos para revisión:

| Fila | Estado propuesto | Evidencia |
|---|---|---|
| Página de carrito y cajón sincronizados sin perder ediciones (AS-02/FB-30), `docs/requirements-ledger.md:152` | `código completo` | `tests/r5-cart-page.spec.mjs`; `assets/theme.js:7198-7208,7309-7316`; AS-02/FB-30 pasan. |
| Live Regions (`aria-live`), `docs/requirements-ledger.md:59` | `código completo` | `sections/main-cart-items.liquid:7`; `assets/theme.js:372,378`; error/cambio/eliminación/key rotation cubiertos. Falta prueba de lector de pantalla en tienda. |
| Medios Enriquecidos y Modelos 3D, `docs/requirements-ledger.md:85` | `código completo` | `assets/base.css:9184,9201,9214`; `tests/r5-gallery-media.spec.mjs` con galería normal, impar, mixta y AR. Falta visor AR/model-viewer real de Shopify. |
| Selector de País / Moneda, `docs/requirements-ledger.md:92` | `código completo` | `assets/base.css:7646`; `tests/r5-mobile-localization.spec.mjs`; falta Markets real con dos países/idiomas. |

Proponer dos filas nuevas como `código completo`: (1) disponibilidad de la barra fija al quedar el botón bajo la cabecera (QA 5/D81), con `assets/theme.js:2005-2083` y `tests/r5-sticky-bar.spec.mjs`; (2) placeholder completo del formulario de búsqueda 404 (QA 3/M-17), con `assets/base.css:7367` y `tests/r5-404-search.spec.mjs`. Gate 5 pendiente en ambas.

## 7. Copy y defectos R4

Copy nuevo: ninguno.

- **QA 1 cerrado a nivel de código:** cantidad, líneas y subtotal se actualizan; notas sin enviar/foco/Checkout y cajón sincronizados. La validación real del inventario y las interacciones de carrito quedan para tienda.
- **QA 3 cerrado a nivel de código:** campo 404 conserva placeholder y botón en los viewports probados.
- **QA 5 cerrado a nivel de código:** sin tramo ciego bajo cabecera, salto directo ni offset obsoleto al resize.
- **QA 6 cerrado a nivel de código:** video/3D llenan la fila incluso con foto vertical vecina.
- **QA 7 cerrado a nivel de código:** botón de preferencias queda dentro del panel móvil.
- **QA 8 confirmado sin cambio:** textos por defecto ya están en sentence case; test R4 existente cubre presets. «Explore Catalog» procede del título configurable del menú.

## 8. Lo no probado y límites

No se publicó ningún tema en la tienda. Queda Gate 5 para Claude: endpoint e inventario real, estado y nota en carrito sobre preview de tema, editor dentro de iframe, barra de preview Shopify oculta/compensada, Shopify model-viewer/XR real y dispositivo AR, vídeo real/reproducción/pantalla completa, mercados con más de un país/idioma, lector de pantalla y teclado real en preview.

El selector E se probó con el texto largo previsto, LTR/RTL, 360/392/414 px y selector nativo sin JS. Una revisión adicional halló casos extremos fuera de esa matriz: texto al doble del tamaño puede desbordar; ocho opciones de idioma pueden hacer salir el grupo. En R5 no se amplió el alcance a esos casos.

`tests/pdp-line-total.spec.mjs` no se ejecutó por requerir storefront local en `127.0.0.1:9292`. No se completó checkout ni se introdujeron datos personales o de pago reales.

## 9. Desviaciones

Nivel 1: sin expansión de contratos/settings y sin cambios de copy. Los seguimientos A2, B2/B3 y D2 fueron necesarios tras la revisión adversarial cuando el commit precedente ya estaba publicado; se conservaron todos los commits y se avanzó por fast-forward. No hubo force-push, rebase, merge ni publicación de tema.

Nivel 2: ninguno.

