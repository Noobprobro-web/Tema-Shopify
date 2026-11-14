# GPT-REPORT-LOTE-C-IMPLEMENTACION-001

**ID:** GPT-REPORT-LOTE-C-IMPLEMENTACION-001

**Estado:** vía C-07 aprobada por Johandry. Correcciones locales de revisión implementadas. Gate 5 sigue pendiente. El dictamen de implementación se conserva solo en local.

**C-07 APROBADO por Johandry (2026-11-07):** sustituir `variant-state` por navegación al PDP con `option_values` al seleccionar una opción en un destacado con más de 250 variantes. La aprobación expresa es posterior a la corrección de la atribución previa.

**Decisión requerida:** tratamiento C05-3 de documentación y soporte en ZIP. La verificación en tienda queda en Gate 5.

**Worktree:** `C:\Users\Johan\.codex\worktrees\lote-c-impl\Tema Shopify`

**Rama:** `lote-c-impl`

**Base:** `origin/lote-d` en `258ca4f59910ebf3c024901a25f0010d69b13856`, verificada con fetch. Se preserva el commit dedicado de la copia exacta de la R-D, `e41fe340595e021f001061c5cd2beaa1c5f783b6`.

## Resumen

1. El dictamen de Claude tiene el SHA-256 autorizado `5a2088ec38d0c57a145cdb42028770a6e8f469b4501cd35e65569eaaa750122a`. Sustituye las tres R-D en el informe 016. El texto histórico identifica el contrato sin JS como decidido el 2026-11-06.
2. C-01 compacta la colección en móvil. El arnés usa el primer `article.product-card[data-product-id]`, registra su ID y falla si la cuadrícula carece de tarjetas de producto.
3. C-05 restringe las siete secciones de página a `page`, a una instancia de cada tipo por plantilla, y evita H1 vacío fuera de contexto. El límite por tipo no impide dos tipos de sección con H1 en la misma plantilla.
4. C-07 conserva el ID inicial verificado y falla cerrado ante variante nula o identidad incoherente. Por encima de 250 variantes, elegir una opción en un destacado navega al PDP de su propio producto con el mismo GET con o sin JavaScript. Para 250 o menos, conserva el selector inline.
5. AF-07 limita inventario en Liquid a `threshold + 1` en el render inicial y la PDP dinámica. El PDP resuelve la variante, disponibilidad y reglas de cantidad de su instancia. El endpoint de estado del destacado dejó de ser necesario.

## Archivos y alcance

- C-01: `assets/base.css`; `harness-GPT-C01-COLLECTION-001/{README.md,capture.mjs}`.
- C-05: `sections/main-{page,documentation,support,about,policy,faq,contact}.liquid`.
- C-07: `assets/{base.css,theme.js}`, `sections/{main-product,featured-product}.liquid`, `snippets/{variant-no-js-select,price}.liquid`, `locales/{en.default,es}.json`; `harness-GPT-C07-VARIANTS-001/run.mjs`.
- Decisiones y evidencia: `docs/decisions.md`, informe 016 y este informe.
- La autorización de Nivel 2 para una sección nueva de estado del destacado se conserva como antecedente. El prototipo `variant-state.liquid` se retiró al quedar sin consumidores. El snippet de precio oculta el contenedor para una combinación sin variante. No introduce un precio cero visible. El contrato de JSON se comparte en el snippet D25 para preservar el límite de complejidad Liquid.
- Se corrigió el encabezado aritmético del ledger. La tabla y sus estados, las plantillas y los listings permanecen intactos.
- Seguimiento de revisión: L1 captura el JSON antes de emitir `div` y `script` completos en una rama Liquid. L3 da estilo visible al enlace con `aria-current`. L4 muestra un aviso localizado enlazado por `aria-describedby`. L6 mantiene el botón deshabilitado, sin ID y con el texto de carga y `aria-busy` durante la petición. L5 verifica el hash del arnés final sobre bytes LF. Por decisión de Johandry, `CLAUDE-REVIEW-LOTE-C-IMPL-001.md` se conserva byte por byte en el worktree como archivo sin seguimiento y en el ref local `codex/claude-review-copy` (commit `49c76e2866c53695a8c0a099dc889125457e1c7c`). SHA-256 `4904ce8116584d846c829280b529d26383ec7bac44fd570a5d6da5a275bd773e`. Se excluye del historial de `lote-c-impl` y del push por D12.

## Gate 1 · Filas afectadas

Ninguna fila se cierra por este informe. Los estados existentes del ledger se conservan. La evidencia local queda disponible para la revisión y la regresión pendiente.

| Fila del ledger | Cambio y evidencia | Pendiente |
|---|---|---|
| 18 · 12 Plantillas JSON OS 2.0; 22 · Schemas Válidos y Settings | C-05: `main-page.liquid:88`, `main-documentation.liquid:186`, `main-support.liquid:275`, `main-about.liquid:174`, `main-policy.liquid:68`, `main-faq.liquid:150`, `main-contact.liquid:222`. Los guards de encabezado están en las líneas 13, 31, 47, 22, 24, 49 y 31 respectivamente. `git diff --exit-code HEAD -- templates listings` salió 0. | Editor e instalación en C-02; pull/diff de datos de comerciante; decisión C05-3. |
| 36 · Optimización LCP; 37 · Dimensiones Explícitas; 80 · Filtros Facetados Nativos; 81 · Ordenamiento; 110 · Presets Diferenciados | C-01: `assets/base.css:5605` y `:5616` compactan el banner y espacio móvil. `capture.mjs:37` valida tarjeta real y `:66` registra su posición. `main-collection.liquid:312` conserva la lista y `:385` renderiza la tarjeta. | Matriz antes/después para los tres presets y dos tamaños; LCP/CLS son observaciones. Mantener regresiones de teclado, filtros, vacío y barra lateral de escritorio. |
| 54 · Live Regions; 66 · Checkout Acelerado; 69 · Precio Unitario; 70 · Selector de Variantes y Swatches Nativos; 71 · Precios Comparativos; 72 · Planes de Venta | C-07: `theme.js:666` valida ID inicial, `:676` coteja el GET, `:690` resuelve el selector inline de PDP y `:1007` sincroniza el formulario. `featured-product.liquid:12` fija el producto propio, `:130` monta los enlaces y `:484` acota el estado inicial. `main-product.liquid:195` y `:735` conservan sección y cap de PDP. `variant-no-js-select.liquid:106` deshabilita ID nulo y `:144` genera GET ordenado. `:126` y `:145` vinculan el aviso, `base.css:1412` destaca la opción y `theme.js:1028` anuncia la carga en el botón. | Fixtures de 1, 250, 251+; navegación desde ambos contextos con/sin JS; PDP, inventario, cantidades, medios, foco, suscripción, red, sticky y FormData en tienda. |

## Verificación local

- `npm ci` instaló 52 paquetes del lockfile. `node .\node_modules\@shopify\cli\bin\run.js version` → `4.8.0`. `node .\node_modules\@shopify\cli\bin\run.js theme check --path . --output json` → exit 0, JSON literal `[]`. Comprueba código y schemas, sin render de tienda.
- `node scripts/json-validate.mjs` → 562 JSON, 0 fallos de parseo. `node scripts/dataset-hooks.mjs` → 0 contratos rotos. `node scripts/locale-key-inventory.mjs` → 0 claves sin resolver. Una clave de storefront preexistente aparece huérfana.
- `node --check assets/theme.js`, `node --check` de los dos módulos del arnés y `git diff --check` → salida 0 sin mensajes.
- `node scripts/ledger-verify.mjs` → 61 filas, 46 cumplido, 15 código completo, 0 no verificado, 0 ausente y 0 incoherencias. El diff de `docs/requirements-ledger.md` cambia exclusivamente el conteo del encabezado.
- `node scripts/theme-check-sanity.mjs` → `OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.` Usó el CLI 4.8.0 instalado en este worktree.
- Pruebas sintéticas ejecutables con `node agent-comms/outbox-gpt/harness-GPT-C07-VARIANTS-001/run.mjs "<raíz con dependencias locales>"` y `PLAYWRIGHT_BROWSERS_PATH` apuntando a la instalación local de Chromium. El arnés carga `assets/theme.js` real y usa respuestas de LiquidJS sobre el snippet real, con filtros de dinero y JSON sustitutos de la plataforma. La red se intercepta en `https://theme.test`.

Salida literal del arnés:

```text
PASS Liquid sandbox: three ordered option IDs, independent links, capped initial stock and null ID guard
PASS Chromium: featured selected style and linked notice; full navigation with/without JS, quantity 2 and null-safe form
PASS Chromium: PDP deep link, loading with no ID, resolved purchase and Unavailable only after rejected response
PASS Chromium: featured inline picker for 250 or fewer keeps its page and selected form ID
PASS Chromium: C01 measures first real card and rejects promotion-only grids
```

SHA-256:

- `harness-GPT-C07-VARIANTS-001/run.mjs`: `0885fd57c0b55589f8fc934e8a9d29421a092e78179ceddf6183232c8ad15446`
- `harness-GPT-C01-COLLECTION-001/capture.mjs`: `ce2dab82057f939d5f49d9b386fc4ff244336f829808276ff29cf7bc52f9d1eb`

## Afirmaciones falsables y límites

1. Un enlace del destacado >250 lleva al PDP de `featured_product` desde home y desde la ficha de otro producto. Conserva los demás IDs en el orden de las opciones y funciona en ambos modos de JavaScript. En destacados de hasta 250 variantes, la compra inline conserva la página y el ID seleccionado. Ver `featured-product.liquid:129` y el arnés.
2. Shopify no acepta settings de sección en la consulta. En la ficha se pide la instancia de `main-product` por su ID, con cap de inventario `threshold + 1` o 1 sin bloque. El render inicial del destacado conserva el suyo y solo serializa la variante seleccionada para 251+. El prototipo de endpoint separado y el límite conservador a una unidad se retiraron. En el arnés, el PDP habilita compra de dos unidades al resolver una variante cuya regla exige mínimo e incremento de dos. [Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering)
3. Los enlaces emitidos llevan un ID por opción. Una combinación inexistente que Shopify resuelve a nulo deshabilita compra y deja FormData sin ID con o sin JavaScript. JavaScript también rechaza una URL incompleta que no coincide con la selección emitida. Para una URL editada a mano y sin JavaScript, el resultado de parámetros incompletos depende del servidor Shopify y queda pendiente de prueba real; los enlaces del tema no generan ese caso. [Enlaces de variantes](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants)
4. La captura C-01 falla en un grid con una promoción y cero productos. La matriz empírica y las pruebas de estados degenerados esperan datos de preview y catálogo. Los resultados de Chromium no sustituyen esa evidencia.
5. C-05 no tocó el empaquetador ni el contrato de C-04-P/D23. La instalación, guardado de editor y pull/diff quedan para C-02. [Esquema de sección](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema)

Gate 5 permanece abierto. No se realizaron escrituras en Shopify ni pruebas contra una tienda real.
