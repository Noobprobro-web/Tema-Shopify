# GPT-R7-001: entrega

```text
ID: GPT-R7-001
Estado: Implementado, validado en local; pendiente PR y validación de Claude en tienda QA.
Decisión requerida: Claude debe abrir el PR en borrador; GitHub rechazó su creación desde este entorno.
Resumen en 5 líneas:
- R7 separa el máximo de inventario de quantity_rule.max en /cart y en el cajón.
- Una cantidad escrita por encima del stock sale a Shopify, cuyo 422 alimenta los avisos existentes.
- «+» sigue deshabilitado cuando la línea llega al tope vendible.
- Los 12 tests R7 pasan; las dos baterías completas dieron 164/164.
- ZIP final: Sartorial-1.0.0.zip, 111 archivos, SHA-256 933f09e348cfa62a90b4df16b8813bd8db5bbaa7994f98944f28a3aeee21d3cf.
Archivos tocados: assets/theme.js; sections/main-cart-items.liquid; sections/cart-drawer.liquid; tests/support/r3-support.mjs; tests/r7-cart-stock-cap.spec.mjs; docs/requirements-ledger.md; agent-comms/outbox-gpt/GPT-R7-001-ENTREGA.md; docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt.
Desviaciones (Nivel 1 o Nivel 2): Nivel 1: los tests Playwright se ejecutaron con Chromium del sistema y un config temporal no versionado porque el navegador cacheado no estaba disponible y la descarga del navegador devolvió HTTP 403. No cambia el producto ni sus contratos.
Hallazgos extra fuera de alcance (con parche listo): ninguno.
Verificación (comando, resultado y qué demuestra/qué no): `npm run gates:static` verde tras d466b59; test R7 contra BASE: 5 fallos/7 aprobados; después: 12 aprobados; batería completa repetida: 164 aprobados en ambas pasadas. `unzip -t`, comprobación de referencias y `node --check` sobre los JS extraídos pasaron. Ninguna de estas pruebas valida el tema en una tienda real.
Lista de afirmaciones falsables numeradas:
1. `origin/master` contenía el encargo al ejecutar `git cat-file -e origin/master:agent-comms/inbox-gpt/GPT-TASK-R7-001.md`.
2. La rama parte de `06700b6146bc97cb99f7ee8ac72748577f9b1f9a`; el commit de implementación es `d466b595d834b458148fca51f899a2732da2cb3c`.
3. Se subió solo `gpt/r7-cart-stock-cap`; no hay PR porque GitHub respondió `Post "https://api.github.com/graphql": Forbidden`.
4. La ZIP se generó desde el commit de implementación y su SHA-256 es `933f09e348cfa62a90b4df16b8813bd8db5bbaa7994f98944f28a3aeee21d3cf`.
```

## Rama y PR

- Base: `origin/master` en `06700b6146bc97cb99f7ee8ac72748577f9b1f9a`.
- Rama nueva: `gpt/r7-cart-stock-cap`.
- Commit de código y ledger: `d466b595d834b458148fca51f899a2732da2cb3c` — `R7: permitir que Shopify avise del tope de stock`.
- Push: aceptado por `origin` solo para `gpt/r7-cart-stock-cap`.
- PR en borrador: no creado. `gh pr create --draft --base master --head gpt/r7-cart-stock-cap ...` respondió literalmente `Post "https://api.github.com/graphql": Forbidden`. Claude puede abrirlo.
- No se usó force-push, rebase, tienda ni tema publicado. `agent-comms/BOARD.md` y `docs/decisions.md` no cambiaron.

## Cambio

- `sections/main-cart-items.liquid:143-152,179,191`: separa `stock_max` de `quantity_max`; cuando solo hay tope de stock, el input recibe `data-quantity-stock-max`, no `max`. El botón conserva el máximo de ambos orígenes.
- `sections/cart-drawer.liquid:307-316,345,359`: aplica la misma condición y salida que la página.
- `assets/theme.js:7170-7186,7190-7205,7213-7220`: lee el tope de stock en una función común, no lo usa para recortar escritura y sí lo usa junto a la regla de cantidad para los botones. La ficha no emite ese atributo.
- `tests/support/r3-support.mjs:62-139,184-226`: los mocks opcionales reproducen los dos atributos de Liquid; `legacyStockCap` sirve para ejecutar la regresión contra BASE sin cambiar el markup por defecto de otros specs.
- `tests/r7-cart-stock-cap.spec.mjs:63-229`: 12 escenarios de `/cart`, cajón, cantidades, botones, regla de cantidad, inventario, formulario sin JS y consistencia Liquid.
- `docs/requirements-ledger.md:149,153`: FO-05 conserva estado y cita las pruebas compartidas; AS-02/FB-30 añade evidencia R7 sin cerrar la validación real.
- Copy y claves de locale nuevos: ninguno. No cambió la lógica de anuncios; la fila Live Regions queda intacta.

## Pruebas

Para el entorno se usó temporalmente `playwright.system.config.mjs` (eliminado y no versionado), apuntando a `/usr/bin/chromium`, porque el browser cacheado no estaba disponible y la descarga de Playwright devolvió HTTP 403. `--config=playwright.system.config.mjs` se añadió al comando indicado; la batería excluyó `pdp-line-total.spec.mjs`, que necesita un storefront local.

Prueba contra BASE (`BASE=06700b6146bc97cb99f7ee8ac72748577f9b1f9a`; assets recuperados con `git show "$BASE":assets/theme.js` y `git show "$BASE":assets/base.css`; helper ejecutado con `R7_LEGACY_STOCK_CAP=1`):

```text
$ R7_LEGACY_STOCK_CAP=1 R3_THEME_JS=/tmp/r7-base-theme.js R3_BASE_CSS=/tmp/r7-base-base.css npx playwright test --config=playwright.system.config.mjs tests/r7-cart-stock-cap.spec.mjs --trace off
5 failed
  a stock-capped cart line sends 20, shows Shopify error, and repaints to 8
  an open stock-capped drawer sends 20 and shows Shopify error after the line returns to 8
  the plus button stays disabled at and above the stock cap after input on both surfaces
  a stock-capped error in an eleven-line cart stays with its line key
  single-unit stock is still editable for the 422 but keeps plus disabled
7 passed (1.1m)
```

Los casos obligatorios 1–3 reproducen el defecto previo; los fallos extra son el caso de muchas líneas y el de una unidad, que requieren también que el stock no imponga `max` nativo. Los casos de quantity_rule, línea bajo el tope, stock sin gestión, política `continue`, envío sin JS y comprobación de Liquid pasan también en BASE.

Después del cambio:

```text
$ npx playwright test --config=playwright.system.config.mjs tests/r7-cart-stock-cap.spec.mjs --trace off
12 passed (13.4s)
```

Las reglas de cantidad compartidas también pasaron FO-05 en ambos templates durante la suite: `tests/r3-search-filters-price.spec.mjs:377,407`.

`npm run gates:static` se ejecutó después del commit `d466b59`:

```text
JSON VALIDATE: Archivos .json comprobados: 898; Fallos de parseo: 0
DATASET HOOKS: Contratos rotos: 0
theme-check-sanity: OK; sandbox restaurado a 0 ofensas
INVENTARIO DE CLAVES: OK; todas las referencias estáticas resuelven
LEDGER VERIFY: Filas de requisito: 105; Incoherencias: 0
Theme Check Summary: 111 files inspected with no offenses found.
gates:syntax: node --check assets/theme.js && node --check assets/product-zoom.js (exit 0)
gates:package: internal references: none; rev HEAD -> d466b595d834b458148fca51f899a2732da2cb3c; archivos: 111
```

Batería completa dos veces seguidas, excluyendo `tests/pdp-line-total.spec.mjs`:

```text
$ npx playwright test --config=playwright.system.config.mjs --trace off $(ls tests/*.spec.mjs | grep -v pdp-line-total)
164 passed (1.7m)

$ npx playwright test --config=playwright.system.config.mjs --trace off $(ls tests/*.spec.mjs | grep -v pdp-line-total)
164 passed (1.7m)
```

## ZIP y manifiesto

La ZIP se generó una sola vez desde el commit de implementación, después de los gates y las dos baterías:

```text
$ node scripts/package-theme-zip.mjs --out Sartorial-1.0.0.zip --expect-count 111
internal references: none
rev:      HEAD -> d466b595d834b458148fca51f899a2732da2cb3c
archivos: 111
tamano:   339691 bytes
sha256:   933f09e348cfa62a90b4df16b8813bd8db5bbaa7994f98944f28a3aeee21d3cf
contenido: 0851b02eb20634bade356eba202b01cde3d04d63659d286f931700809437faee
```

- `unzip -t Sartorial-1.0.0.zip`: `No errors detected in compressed data`.
- `node --check` pasó para los tres JS extraídos: `assets/product-zoom.js`, `assets/section-standard-b.js` y `assets/theme.js`.
- El manifiesto conserva diez líneas de cabecera, `Validado en tienda: NO`, seguidas por `sha256  ruta` en el orden de la ZIP. Su commit se crea por separado y es el último.
- La entrega y el manifiesto se añaden después de empaquetar; son documentos fuera de la ZIP. No se vuelve a generar el archivo del tema.

## Ledger y estados límite

- AS-02 / FB-30: permanece `código completo`; evidencia R7 añadida en `docs/requirements-ledger.md:153`. Sigue pendiente la validación de inventario en tienda por la compuerta 5.
- FO-05: mantiene `código completo`, con tests de ficha en `docs/requirements-ledger.md:149`.
- Live Regions: sin cambio de código ni de estado.
- Vacío: quitar la única línea no deja error residual, ya cubierto por `tests/r6-cart-line-error.spec.mjs:164`.
- Una unidad: `tests/r7-cart-stock-cap.spec.mjs:193` verifica «+» apagado y envío de `2` para obtener 422.
- Muchos: 11 líneas, error ligado por clave a la fila correcta, `tests/r7-cart-stock-cap.spec.mjs:152`.
- Muy largo y faltante: los mensajes largos en móvil/escritorio y el texto de respaldo existente siguen cubiertos por `tests/r6-cart-line-error.spec.mjs:195,247`.
- Sin control de inventario y `continue`: `tests/r7-cart-stock-cap.spec.mjs:172`.
- quantity_rule con máximo e incremento, en página y cajón: `tests/r7-cart-stock-cap.spec.mjs:115`.
- Bajo el tope: la ruta 422 de R6 sigue en `tests/r7-cart-stock-cap.spec.mjs:139`.
- Sin JavaScript: el formulario `novalidate` envía el valor escrito, `tests/r7-cart-stock-cap.spec.mjs:211`.
- No se probaron Markets ni inventario en una tienda real; Claude debe probar la interfaz, ambos avisos y sus cantidades antes de fusionar.

## Residual y desviaciones

- Residual: revisión del PR y validación en tienda QA están pendientes. GitHub no permitió crear el PR; el error literal aparece arriba. La rama está publicada y lista para que Claude abra el PR.
- Desviación Nivel 1: configuración temporal de Playwright para el Chromium del sistema, no versionada y eliminada al terminar.
- Desviaciones Nivel 2: ninguna. No se cambiaron settings, labels, locale, decisiones ni el contrato de la ficha.
