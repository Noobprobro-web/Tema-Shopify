# GPT-REPORT-LOTE-C-IMPLEMENTACION-001

**ID:** GPT-REPORT-LOTE-C-IMPLEMENTACION-001

**Estado:** propuesta implementada para revisión independiente, aprobación de Johandry de la vía C-07 y Gate 5.

**Aclaración C-07 (2026-11-07):** Johandry corrigió expresamente la atribución de aprobación. La sustitución de `variant-state` por navegación al PDP para destacados con más de 250 variantes sigue sin aprobar.

**Decisiones requeridas:** aceptación de la propuesta de navegación C-07 y tratamiento C05-3 de documentación y soporte en ZIP. La verificación en tienda queda en Gate 5.

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
- C-07: `assets/theme.js`, `sections/{main-product,featured-product}.liquid`, `snippets/{variant-no-js-select,price}.liquid`; `harness-GPT-C07-VARIANTS-001/run.mjs`.
- Decisiones y evidencia: `docs/decisions.md`, informe 016 y este informe.
- La autorización de Nivel 2 para una sección nueva de estado del destacado se conserva como antecedente. El prototipo `variant-state.liquid` se retiró al quedar sin consumidores. El snippet de precio oculta el contenedor para una combinación sin variante. No introduce un precio cero visible. El contrato de JSON se comparte en el snippet D25 para preservar el límite de complejidad Liquid.
- Se corrigió el encabezado aritmético del ledger. La tabla y sus estados, las plantillas y los listings permanecen intactos.

## Gate 1 · Filas afectadas

Ninguna fila se cierra por este informe. Los estados existentes del ledger se conservan. La evidencia local queda disponible para la revisión y la regresión pendiente.

| Fila del ledger | Cambio y evidencia | Pendiente |
|---|---|---|
| 18 · 12 Plantillas JSON OS 2.0; 22 · Schemas Válidos y Settings | C-05: `main-page.liquid:88`, `main-documentation.liquid:186`, `main-support.liquid:275`, `main-about.liquid:174`, `main-policy.liquid:68`, `main-faq.liquid:150`, `main-contact.liquid:222`. Los guards de encabezado están en las líneas 13, 31, 47, 22, 24, 49 y 31 respectivamente. `git diff --exit-code HEAD -- templates listings` salió 0. | Editor e instalación en C-02; pull/diff de datos de comerciante; decisión C05-3. |
| 36 · Optimización LCP; 37 · Dimensiones Explícitas; 80 · Filtros Facetados Nativos; 81 · Ordenamiento; 110 · Presets Diferenciados | C-01: `assets/base.css:5604` y `:5615` compactan el banner y espacio móvil. `capture.mjs:37` valida tarjeta real y `:66` registra su posición. `main-collection.liquid:312` conserva la lista y `:385` renderiza la tarjeta. | Matriz antes/después para los tres presets y dos tamaños; LCP/CLS son observaciones. Mantener regresiones de teclado, filtros, vacío y barra lateral de escritorio. |
| 54 · Live Regions; 66 · Checkout Acelerado; 69 · Precio Unitario; 70 · Selector de Variantes y Swatches Nativos; 71 · Precios Comparativos; 72 · Planes de Venta | C-07: `theme.js:666` valida ID inicial, `:676` coteja el GET, `:690` resuelve el selector inline de PDP y `:1007` sincroniza el formulario. `featured-product.liquid:12` fija el producto propio, `:129` monta los enlaces y `:483` acota el estado inicial. `main-product.liquid:195` y `:734` conservan sección y cap de PDP. `variant-no-js-select.liquid:104` deshabilita ID nulo y `:139` genera GET ordenado. | Fixtures de 1, 250, 251+; navegación desde ambos contextos con/sin JS; PDP, inventario, cantidades, medios, foco, suscripción, red, sticky y FormData en tienda. |

## Verificación local

- `shopify theme check --path . --output json` → `[]`. Comprueba el código local y schemas, sin render de tienda.
- `node scripts/json-validate.mjs` → 562 JSON, 0 fallos de parseo. `node scripts/dataset-hooks.mjs` → 0 contratos rotos. `node scripts/locale-key-inventory.mjs` → 0 claves sin resolver. Una clave de storefront preexistente aparece huérfana.
- `node --check assets/theme.js`, `node --check` de los dos módulos del arnés y `git diff --check` → salida 0 sin mensajes.
- `node scripts/ledger-verify.mjs` → 61 filas, 46 cumplido, 15 código completo, 0 no verificado, 0 ausente y 0 incoherencias. El diff de `docs/requirements-ledger.md` cambia exclusivamente el conteo del encabezado.
- `node scripts/theme-check-sanity.mjs` requiere un CLI instalado en `node_modules` del worktree. Se comprobó que no existe y Windows negó la creación del enlace temporal a las dependencias existentes. No se instaló ningún paquete. El Theme Check anterior usó el CLI de la máquina.
- Pruebas sintéticas ejecutables con `node agent-comms/outbox-gpt/harness-GPT-C07-VARIANTS-001/run.mjs "<raíz con dependencias locales>"` y `PLAYWRIGHT_BROWSERS_PATH` apuntando a la instalación local de Chromium. El arnés carga `assets/theme.js` real y usa respuestas de LiquidJS sobre el snippet real, con filtros de dinero y JSON sustitutos de la plataforma. La red se intercepta en `https://theme.test`.

Salida literal del arnés:

```text
PASS Liquid sandbox: three ordered option IDs, independent links, capped initial stock and null ID guard
PASS Chromium: featured links navigate from home and unrelated PDP with and without JS; valid quantity 2 and null-safe form
PASS Chromium: PDP deep link, incomplete ID guard, capped instance GET and synchronized quantity
PASS Chromium: featured inline picker for 250 or fewer keeps its page and selected form ID
PASS Chromium: C01 measures first real card and rejects promotion-only grids
```

SHA-256:

- `harness-GPT-C07-VARIANTS-001/run.mjs`: `a63d11a3dd65ea1279150d265e3d39cff25a56cef8359715dd88bd68baa4042d`
- `harness-GPT-C01-COLLECTION-001/capture.mjs`: `ce2dab82057f939d5f49d9b386fc4ff244336f829808276ff29cf7bc52f9d1eb`

## Afirmaciones falsables y límites

1. Un enlace del destacado >250 lleva al PDP de `featured_product` desde home y desde la ficha de otro producto. Conserva los demás IDs en el orden de las opciones y funciona en ambos modos de JavaScript. En destacados de hasta 250 variantes, la compra inline conserva la página y el ID seleccionado. Ver `featured-product.liquid:129` y el arnés.
2. Shopify no acepta settings de sección en la consulta. En la ficha se pide la instancia de `main-product` por su ID, con cap de inventario `threshold + 1` o 1 sin bloque. El render inicial del destacado conserva el suyo y solo serializa la variante seleccionada para 251+. El prototipo de endpoint separado y el límite conservador a una unidad se retiraron. En el arnés, el PDP habilita compra de dos unidades al resolver una variante cuya regla exige mínimo e incremento de dos. [Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering)
3. Los enlaces emitidos llevan un ID por opción. Una combinación inexistente que Shopify resuelve a nulo deshabilita compra y deja FormData sin ID con o sin JavaScript. JavaScript también rechaza una URL incompleta que no coincide con la selección emitida. Para una URL editada a mano y sin JavaScript, el resultado de parámetros incompletos depende del servidor Shopify y queda pendiente de prueba real; los enlaces del tema no generan ese caso. [Enlaces de variantes](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants)
4. La captura C-01 falla en un grid con una promoción y cero productos. La matriz empírica y las pruebas de estados degenerados esperan datos de preview y catálogo. Los resultados de Chromium no sustituyen esa evidencia.
5. C-05 no tocó el empaquetador ni el contrato de C-04-P/D23. La instalación, guardado de editor y pull/diff quedan para C-02. [Esquema de sección](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema)

Gate 5 permanece abierto. No se realizaron escrituras en Shopify ni pruebas contra una tienda real.
