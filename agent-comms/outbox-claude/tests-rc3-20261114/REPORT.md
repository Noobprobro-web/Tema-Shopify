# Pruebas en tienda real, temas rc3 (2026-11-14)

Tienda de desarrollo, temas NO PUBLICADOS: Sartorial 190317920560, Imprint 190317953328, Archive 190317986096 (build de 51fda7c). Resultados crudos (JSON, sin secretos) en esta carpeta; scripts en `scripts/`. `run.mjs` SHA 103c1551fc1d639e93a882900885ba9283d8c260d49c938543d6299ac1a4292f antes y después. Sin 429. Ledger no modificado por esta tanda.

| Área | Resultado | Evidencia (`archivo:check`) |
|---|---|---|
| Regresión axe/teclado/carrito | Pasa | `01-ro-base.json` (90 passed, axe 18/18 sin violaciones, teclado 18/18); `02-cart.json` 18/18 |
| 3D / foco (WCAG 2.4.7) | Sin foco en elemento invisible, pero el 3D no se ve | `03-3d-focus.json` 30/30; causa raíz: wrapper `div.shopify-model-viewer-ui` (inline-block sin ancho) deja `model-viewer` en 0 px; `assets/base.css:1163-1166` y `:1269`; arreglo probado por inyección en `03c-3d-proposed-fix.json` |
| «Choose options» a 320 px / 150 % | Pasa | `04-choose-options-320.json`: desborde 0, botón 131/131, desfase títulos ≤0,5 px |
| Contraste (nodos `incomplete` de axe) | Sin nodos bajo umbral (61 medidos, peor ratio 5,53) | `05-contrast-incomplete.json`; el conteo difiere del arnés (4-26 por página, 29 reglas): salvedad abierta |
| V01 con vendor real (Sartorial rc3, `templates/collection.json` show_vendor=true) | Pasa | `06-v01-real-vendor.json` desfase ≤0,1 px a 320/390 y 100/125/150 %; vendor máximo 30 caracteres, el caso de 70 no existe en la tienda |
| CN7 (fila solo de color) | No cubierto | `07-cn7-color-only.json`: la rama `data-swatch-fit-px` no es alcanzable por API (swatch.color no llega al storefront) |
| B-01 drawer / focus trap | Pasa x3 presets | `08-b01-drawer.json` (corte 62rem, `base.css:4795`) |
| B-03 respuesta perdida | Pasa x3 presets | `09-b03-b04-cart.json:b03` (abort, aplicado+perdido, fulfill tardío 11,5 s, doble envío: sin duplicados) |
| B-04 nota de carrito | Pasa solo en Sartorial | `10-b04-notes-sartorial.json`; Imprint/Archive no cubiertos (`show_cart_note` false) |
| B-05 selector de idioma | No ejecutable | `11-shoplocales.json`: la tienda solo tiene `en` |
| C-08 bloques de confianza | Pasa | `12-c08-trust-blocks.json` (plantillas alternas con texto corto y largo; con textos vacíos, 0 bloques por diseño) |

## Pendientes y observaciones
- Fallo real: 3D invisible (ver arriba); corrección pendiente de aplicar al código.
- Fixture `fixture-color-only` creado (producto 15428972380464); residuos de la prueba: definición `shopify--color-pattern`, 8 metaobjetos `fx-*`.
- Plantillas de prueba `templates/product.c08short.json` y `product.c08long.json` quedaron en los 3 rc3; `themeFilesDelete` está bloqueado por el conector, borrarlas desde el Admin.
- Incidente: una versión previa de un script murió antes de su `finally`; ese carrito (como mucho 1 unidad, sin checkout) quedó sin verificar. Las corridas citadas son las posteriores, con limpieza verificada (`itemCount` 0, nota vacía, contexto cerrado).
- No cubierto: Firefox (G4), motion en Imprint/Archive, `data-swatch-fit-px`, B-04 en Imprint/Archive, B-05 con segundo idioma.
