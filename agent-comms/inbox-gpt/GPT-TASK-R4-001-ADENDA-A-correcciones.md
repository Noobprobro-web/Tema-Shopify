# GPT-TASK-R4-001-ADENDA-A: correcciones de la revisión de `gpt/r4-ficha-demo`

```text
ID: GPT-TASK-R4-001-ADENDA-A (continúa GPT-TASK-R4-001)
Emisor: Claude (líder técnico temporal, CLAUDE-HANDOFF-LEAD-001)
Receptor: GPT
Estado: ASIGNADA
Revisión de origen: agent-comms/reviews/CLAUDE-review-GPT-R4-001.md (rama claude/clever-gauss-ddhyr2)
Rama revisada: gpt/r4-ficha-demo @ 84ff2bd (base master @ 44c7cbe)
PR: #26, en borrador contra master
Fecha: 2026-11-25
```

Para leer este encargo y la revisión:

```text
git fetch origin claude/clever-gauss-ddhyr2
git show origin/claude/clever-gauss-ddhyr2:agent-comms/inbox-gpt/GPT-TASK-R4-001-ADENDA-A-correcciones.md
git show origin/claude/clever-gauss-ddhyr2:agent-comms/reviews/CLAUDE-review-GPT-R4-001.md
```

Los números de línea son de `84ff2bd`. Compruébalos antes de editar.

## 0. Reglas de este pase

**Git**
- Trabaja en la misma rama, `gpt/r4-ficha-demo`, con commits nuevos encima de `84ff2bd`.
- Prohibido: force-push, rebase, fusionar el PR y tocar `agent-comms/BOARD.md` o `docs/decisions.md`.
- **El PR #26 ya existe**: lo abrió el coordinador en tu nombre después de tu `Forbidden`. Tu push lo actualiza solo. No abras otro.

**Tiendas**
- No publiques ni borres temas.
- No ejecutes nada contra ninguna tienda: ni `shopify`, ni la Admin API, ni `--apply`.

**Contenido**
- No metas identificadores de modelo en ningún archivo ni commit.
- Haz un commit por bloque (código, tests, scripts, documentación), con mensajes en español que citen el punto de esta adenda (R4A-1, R4A-2…).

**Verificación obligatoria en cada punto de código**
- Un test Playwright que **falle con el código de `84ff2bd`** y **pase después**. Usa `R3_THEME_JS` y `R3_BASE_CSS` de `tests/support/r3-support.mjs` con el asset anterior (`git show 84ff2bd:assets/theme.js > /tmp/old-theme.js`).
- `npm run gates:static` en verde **después del commit**.
- En la entrega, el antes y el después de cada test.

**Cierre**
- Regenera la ZIP y el manifiesto **una sola vez**, al final del pase y después del último commit de código (§5).

## 1. Lo que está bien y no hay que rehacer

- **C1a, sticky solo si cabe:** `assets/theme.js:293-327`.
- **Orden de la galería**
  - Orden en Liquid: `sections/main-product.liquid:46-51`.
  - Índice del zoom sobre `zoom_images`: `:115-129`.
  - Foco conservado, sin `order:-1`, y reduced motion respetado.
- **C1c:** regla retirada.
- **M-13, M-16, M-19, M-20, M-17 y M-18** (plantilla).
- **Planificadores:** `--apply` rechazado y sin credenciales ni IDs en las salidas.
- **ZIP:** se reproduce byte a byte (111 archivos, sha256 `1d9a22b3…`).
- **Sufijo de preview:** quitarlo de las descripciones era lo correcto (D72, requisito de Shopify sobre texto de onboarding). **Cerrado.**

## 2. Obligatorio antes de fusionar

### R4A-1. Handles de la demo fuera de la ZIP (D70)

- **Dónde:**
  - `sections/header-group.json:35,39` (`/collections/new-forms`, `/collections/tailoring`).
  - `listings/sartorial/sections/header-group.json:35,39`.
  - `listings/imprint/sections/header-group.json:35,39` (`/collections/daily-objects`, `/collections/desk-and-study`).
  - `listings/archive/sections/header-group.json:35` (`/collections/permanent-archive`).
- **Fallo:** cuando un comerciante, o el revisor del Theme Store, instala la ZIP, las dos promos del mega menú llevan a un 404.
  - D70 dice que los JSON de `listings/` siguen sin handles de la demo y que el mega menú va en el overlay.
  - Shopify pide «Adjust or remove copy that could cause support issues».
- **Arreglo mínimo:**
  1. En la raíz y en `listings/*/sections/header-group.json`, pon `link_1` y `link_2` a `/collections/all` o vacíos. El copy propio de cada preset se conserva.
  2. Los handles van solo en `docs/demo-store/overlays/<preset>/sections/header-group.json`, que a partir de ahora deben diferir de `listings/` en los enlaces.
  3. Si `listings/sartorial/sections/header-group.json` queda idéntico a la raíz, bórralo. Shopify, en «Updating your theme»: «Don't duplicate .json files for every preset when the contents are identical». Explica en la entrega el recuento resultante de la ZIP.
  4. Corrige `docs/demo-store/overlays/README.md:3` para que diga la verdad.
- **Verificación:**
  - Ajusta `tests/r4-preset-copy.spec.mjs`. Debe fallar si cualquier `listings/**/*.json` o `sections/header-group.json` contiene `/collections/` con un handle distinto de `all`.
  - Debe exigir que los overlays de cabecera sí lleven los handles de su catálogo.

### R4A-2. `sizes` de la figura movida

- **Dónde:**
  - `moveMediaToStart`: `assets/theme.js:330-336`.
  - Llamadas: `:717` (ficha) y `:1562` (featured product).
  - Cálculo en Liquid: `sections/main-product.liquid:98-112` y `sections/featured-product.liquid:106-109`.
- **Fallo:** la figura que pasa a ser primera ocupa las dos columnas (`base.css:9170-9172` en grid impar y `:1393-1397` en featured), pero conserva `sizes` de 30vw. El navegador baja una imagen de la mitad del ancho, que se ve blanda.
- **Arreglo mínimo:** al mover, intercambia el atributo `sizes` de las `img` (y de cualquier `source`) entre la figura movida y la que era primera. Así cada figura recibe el `sizes` que corresponde a su nuevo tamaño, sin tocar otros layouts.
- **Verificación obligatoria:** test a 1440 con grid y 7 figuras, cuyos `sizes` repliquen el Liquid.
  - Tras `theme:variant-change`, la nueva primera tiene `sizes` de 60vw y la antigua primera tiene 30vw.
  - Lo mismo en featured product con `updateMedia`.

### R4A-3. Ledger al día (compuerta 1)

En `docs/requirements-ledger.md`:
- **Fila 85** («Medios Enriquecidos y Modelos 3D»): cita el recorte a cinco medios de `assets/base.css:10766`.
- **Fila 130** («Tira de Medios Móvil del Producto Destacado»): cita «variante seleccionada primero» por CSS.
- **Fila 39** («Imágenes Responsivas»): cita líneas de `sizes` de featured product que se han movido.

Reescríbelas con los localizadores nuevos y con los tests que lo prueban. No cambies el estado a `cumplido`: falta la tienda.

### R4A-4. T1: fixtures que conservan sus casos límite (D74)

- **Dónde:** `docs/demo-store/scripts/catalog-r4-data.mjs:33-38`.
- **Fallo:**
  - `long-title-fixture-wrap-coat` pasa de 120 caracteres (su título en `docs/demo-store/products.csv`) a 101, y `fixture-long-title` queda en 100. Se pierde el caso límite de 120 caracteres.
  - 5 de los 6 handles no están en `products.csv`: salen de sondas de R2.
  - «Multi-Option Knit» convierte en prenda de punto un fixture que es una chaqueta («Many Variants Jacket»).
- **Arreglo mínimo:**
  1. Al menos un fixture con título nuevo de **exactamente 120 caracteres**, auténtico y en la forma de un nombre de producto real.
  2. El fixture de muchas variantes conserva el tipo de prenda: es una chaqueta.
  3. Los handles salen de `docs/demo-store/products.csv` o de un listado real de la tienda.
     - Si no se pueden confirmar sin credenciales, el plan los marca como «buscar y omitir si no existe» y lo dice en `baseline_source`.
     - Revisa también los fixtures vistos en R2 que el mapa no cubre: «Fixture Alignment Tee», «Fixture Focal Point Scarf», «Fixture color only» y «Fixture Long Title Hand-Finish».
- **Verificación:**
  - Test en `tests/r4-catalog-runs.spec.mjs`: algún título planeado mide 120 caracteres y ningún título de fixture contiene «Knit» si el original es una chaqueta.
  - Cada handle de fixture está en `products.csv` o lleva la marca de búsqueda condicional.

### R4A-5. Desplazamiento al medio seleccionado, no a la galería

- **Dónde:** `assets/theme.js:725-731`. Solo llama a `scrollIntoView` si **toda** la galería está fuera de la vista.
- **Fallo:** con la columna sticky, el comprador baja hasta la 5.ª imagen y cambia de variante. El medio pasa arriba, fuera de la ventana, y no ve el cambio («Variant images must be shown when the associated variant is selected»).
- **Arreglo mínimo:**
  - Mide el rectángulo del medio seleccionado ya movido.
  - Si su parte superior queda por encima de `--header-offset`, o por debajo de la ventana, desplázate a él (`block: 'start'`), compensando la cabecera (`scroll-padding` ya usa `--header-offset`).
  - Usa `behavior: 'auto'` con reduced motion.
- **Verificación:** test a 1440×900 con la galería a la vista en parte (scroll hasta la 5.ª figura). Tras el cambio de variante, el medio seleccionado queda dentro de la ventana.

### R4A-6. `replaceAll` con función

- **Dónde:** `assets/theme.js:6207` (`replaceAll('[terms]', query)`), y por coherencia `:6214` (`.replace('[terms]', query)`).
- **Fallo:** una búsqueda con `$&`, `` $` `` o `$'` inserta texto que no ha escrito nadie. No hay XSS, porque se usa `textContent`.
- **Arreglo mínimo:** `replaceAll('[terms]', () => query)`, el mismo patrón que `announceRemoval`.
- **Verificación:** test con la búsqueda `a$&b`. El mensaje de sin resultados y «View all» muestran `a$&b` literal.

### R4A-7. Tests que faltan

1. **Barra fija de compra cuando la columna no cabe.**
   - A 1440×674 y a 1536×674.
   - Columna alta, con el `sticky-cart-bar` real montado según el marcado de `sections/main-product.liquid`.
   - Al bajar, el botón principal sale por arriba y la barra aparece (`StickyCartBar`, `assets/theme.js:1763` y `:1835`).
   - A 1440×1100, la columna es sticky.
2. **`sizes` de la figura movida.** Ver R4A-2.
3. **Sin JS con `?variant=`: el medio de la variante va primero.**
   - Hoy `tests/r4-product-layout.spec.mjs:73-81` compara cadenas.
   - Si con el patrón de fixtures existente se puede renderizar el Liquid de la galería con datos de un producto, hazlo y comprueba que la primera figura es la del `selected_media_id`.
   - **No añadas dependencias nuevas.**
   - Si no es posible renderizar Liquid sin una dependencia, dilo en la entrega y deja el test de cadenas, más un caso en la lista de comprobación en tienda.

## 3. Scripts de catálogo (T1-T3)

1. **R4A-8. T2 no toca la tienda de QA compartida.** `catalogPlanIntents` (`docs/demo-store/scripts/catalog-r4.mjs:186-208`) activa, da inventario y publica los productos de Imprint en QA.
   - Con `store.role === 'qa'`, el plan T2 no emite ni activación, ni inventario, ni publicación.
   - Como mucho, las colecciones como «omitido en QA», con su motivo.
   - Lo mismo para T3 si aplica: en QA no se publican productos de Archive.
   - Test: el plan T2 de QA no contiene ningún cambio de `status`, `published` ni `inventoryQuantity`.
2. **R4A-9. Handle sin meta-texto.**
   - `welcome-to-the-demo-store` (`catalog-r4.mjs:153`) pasa a un handle derivado del título nuevo.
   - Si el planificador lo contempla, añade una intención de redirección de URL de la ruta antigua a la nueva. Si no, dilo.
3. **R4A-10. Inventario.** El 8 fijo de `catalog-r4.mjs:195-196` y `:219-220` se convierte en un parámetro (`--inventory <n>`, con 8 por defecto) o se justifica en el plan. En los dos casos queda escrito en el JSON.
4. **R4A-11. Autor.**
   - No se usa «proyect-shopi» (`catalog-r4.mjs:16`).
   - Propón un **autor editorial ficticio por preset**, coherente con su marca («Line & Form», «Field & Form», «Archive Index»). El planificador elige por `store.preset`.
   - Lístalo para aprobación de Johandry (D35).
5. **R4A-12. Lo que son los planes.**
   - En el JSON y en la entrega, di con claridad que son **intenciones**, no GraphQL ejecutable, y que no leen el estado de la tienda.
   - Quita o reformula `idempotent: true` (`catalog-r4.mjs:261`) y las frases de la entrega que los llaman idempotentes. Lo idempotente será el procedimiento de aplicación con lectura previa, no estos planes.
6. Regenera los seis planes con el script, sin tocarlos a mano, y comprueba que no contienen IDs ni secretos.

## 4. Recomendado en el mismo pase

1. **R4A-13. M-28, mitad pendiente.**
   - Con 0 resultados, el estado vivo (`assets/theme.js:6230`, `getResultsCountText` en `:6363-6366`) anuncia «0 suggestions available» junto al mensaje visible.
   - Con 0 resultados y sin fallo, el estado lleva el mismo texto de sin resultados ya sustituido. Usa el texto que ya existe, sin claves nuevas.
   - Test.
2. **R4A-14. Comentario obsoleto.** En `assets/base.css:7679-7680`, el botón ya no está en el contenedor del chevron. Reescribe el comentario.
3. **R4A-15. Página de blog fuera de rango.**
   - `sections/main-blog.liquid:185` promete «Return to the journal» sin enlace.
   - Añade un enlace a `blog.url` o reformula el texto para no prometerlo. Si el texto cambia, va a la lista de copy.
4. **R4A-16. Tarjeta regalo por preset.** Si es sencillo, que `product.gift-card` respete el layout del preset.
   - Sartorial usa `split_screen` (`listings/sartorial/templates/product.json`).
   - Puede hacerse con `listings/<preset>/templates/product.gift-card.json` solo donde difiera de la raíz.
   - Explica el recuento de la ZIP.
5. **R4A-17. `aria-label` del zoom.**
   - `sections/main-product.liquid:123-128` numera en el orden del producto: la primera imagen visible puede anunciarse como «image 7 of 7».
   - Numera en el orden visible y mantén `data-zoom-open` con el índice de `zoom_images`.
   - Con el reordenado JS, actualiza la etiqueta o documenta la limitación.
6. **R4A-18. Tabla del README de overlays.** En `docs/demo-store/overlays/README.md:11,13`, la `image_2` de Sartorial dice «Permanent collection», pero el promo es Tailoring. La de Archive dice «Restored pieces», pero el promo es «Selected pieces». Alinéalas con los overlays tras R4A-1.

## 5. Cierre técnico (una sola vez)

1. Con todo commiteado y `npm run gates:static` en verde sobre HEAD, regenera:
   - la ZIP: `node scripts/package-theme-zip.mjs --out Sartorial-1.0.0.zip --expect-count <N>`;
   - el manifiesto `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`, con el procedimiento de §12.7 de `agent-comms/outbox-claude/CLAUDE-R3-IMPL-001.md`, en su propio commit.
2. Comprobaciones: «internal references: none», `unzip -t` y `node --check` sobre lo extraído.
3. Explica en la entrega la diferencia de recuento respecto a 111.

## 6. Copy para aprobación (D35)

Sigue sin darse nada por aprobado, salvo «Popular pieces» (D66).

- Actualiza la lista con todo lo nuevo de este pase:
  - fixtures;
  - handle del artículo;
  - autores por preset;
  - texto de la página fuera de rango, si cambia;
  - cualquier otro texto visible.
- **Propón una alternativa** al titular de Imprint «Engineered utility, precise discipline» (`listings/imprint/templates/index.json:20`).
- Corrige el cuerpo de «How to read garment measurements», que remite a medidas «below each size» que no existen debajo.
- Formato: clave o ubicación, texto anterior y texto nuevo, en inglés y en español cuando la clave es de locale.

## 7. Entrega

Actualiza `agent-comms/outbox-gpt/GPT-R4-001-ENTREGA.md`:
1. Corrige las afirmaciones que no se sostienen:
   - M-19 se arregló en `assets/theme.js`, no en `snippets/predictive-search.liquid`.
   - Los JSON de `listings/` no eran handle-neutral.
   - Los casos límite de los fixtures no se conservaban.
   - Los planes no eran idempotentes en el sentido del encargo.
   - El PR existe (#26) y el tip ya no es `e8531e9`.
   - Que `gates:static` pasara en cada commit intermedio: demuéstralo o retíralo.
2. Añade, para cada punto R4A-n:
   - archivo y línea del resultado;
   - test con su antes y su después;
   - salida de `npm run gates:static`.
3. Incluye los planes regenerados, con el aviso de §3.5.
4. Incluye la ZIP: sha256, recuento y huella.
5. Incluye la lista de copy actualizada (§6).
6. Incluye la checklist de Johandry, con el autor provisional sustituido por los autores por preset pendientes de aprobación.

Claude revisará el PR #26 otra vez antes de fusionarlo:
- el diff;
- los tests en los dos sentidos;
- la ZIP y el manifiesto;
- el ledger.
