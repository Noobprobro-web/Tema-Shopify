# CLAUDE-REPORT-FIXES-AUDIT-FINAL-001: Corrección de los hallazgos abiertos de AUDIT-FINAL-001

```text
ID: CLAUDE-REPORT-FIXES-AUDIT-FINAL-001 (pedido de Johandry en el chat: "arregla lo que encontraste")
Estado: CORREGIDO EN LOCAL sobre master 9b0b126. Sin commit ni despliegue.
  npm run gates:static sale con exit 0 sobre una copia idéntica al árbol de trabajo.
Decisión requerida:
  1. Gemini: hacer commit de los 7 archivos y desplegar a los 4 temas. Instrucción en
     agent-comms/inbox-gemini/GEMINI-TASK-DEPLOY-AUDIT-FINAL-001.md.
  2. Gemini: corregir el BOARD. Tres afirmaciones de 9b0b126 no se cumplen en la tienda (§3).
  3. Johandry: borrar layout/password.liquid (48 bytes, no está en el repo) de los 4 temas,
     desde el editor de código (AF-12). Es un borrado en la tienda y no lo hago yo.
Resumen en 5 líneas:
  1. AF-01, AF-02, AF-03 y AF-05 ya estaban en 9b0b126 (Gemini). Los revisé: coinciden con mis parches.
  2. Nuevos: AF-07 (stock), AF-08 (barra fija y foco), AF-09 (título largo), AF-10 (sizes del
     hero), AF-11 (61 claves huérfanas), AF-13 (onclick) y AF-14 (origen en renderUrl).
  3. Theme Check: 150 archivos sin ofensas. Las huérfanas de schema bajan de 61 a 0. Los 3 cambios
     de Liquid se probaron con liquidjs (§2).
  4. No toqué AF-15 ni AF-16, que son informativos y cambiarían el diseño sin necesidad.
  5. En la tienda, todavía ningún tema tiene 02194ee ni 9b0b126. Solo Sartorial tiene su
     collection.json del listing.
Archivos tocados: assets/base.css, assets/theme.js, locales/en.default.schema.json,
  sections/featured-product.liquid, sections/hero-editorial.liquid, sections/main-product.liquid,
  templates/gift_card.liquid. Evidencia en agent-comms/outbox-claude/harness-FIXES-AUDIT-FINAL-001/.
Desviaciones (Nivel 1 o Nivel 2): Nivel 2 (Liquid, CSS, JS y locales), pedido por Johandry en el chat.
  Sin commit, que lo hace Gemini. Se respetaron los CRLF de base.css y theme.js.
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo.
Verificación (comando, resultado y qué demuestra/qué no): §2.
Lista de afirmaciones falsables numeradas: §4.
```

## 1. Qué cambió

| ID | Archivo:línea | Cambio |
| :--- | :--- | :--- |
| AF-07 | `sections/main-product.liquid:696-713`, `sections/featured-product.liquid:455-472` | `inventory_quantity` pasa por `at_most: inventory_cap`. El tope es el umbral del bloque `inventory_status` más 1, o 1 si no hay bloque. Se calcula con `where` y `first`, sin `for` ni `if`, porque main-product estaba en el límite de LiquidComplexity: con un bucle subía a 122 y Theme Check lo rechazaba |
| AF-08 | `assets/theme.js:1246-1248`, `assets/base.css:7766-7767` | `StickyCartBar.setVisible()` publica `--sticky-cart-offset` con la altura de la barra (0px si está oculta), y `html` tiene `scroll-padding-block-end: var(--sticky-cart-offset, 0px)`. Es el mismo mecanismo que ya usa la cabecera arriba |
| AF-09 | `sections/main-product.liquid:201`, `assets/base.css:1280-1285` y `3961-3963` | `data-long-title` vale 1 a partir de 61 caracteres (`divided_by: 61 \| floor \| at_most: 1`, sin `if` por el mismo motivo). Con 1: 28ch, 1.6rem en móvil y 1.75rem desde 48rem. Misma tipografía; la identidad de Sartorial no cambia en títulos normales |
| AF-10 | `sections/hero-editorial.liquid:6-18`, `:90`, `:127` | `hero_sizes` depende del modo. Cinematic: `100vw`. Split: `(min-width: 62rem) 60vw / 65vw / 50vw, 100vw` según `split_ratio` |
| AF-11 | `locales/en.default.schema.json` | Salen las 61 claves que no referencia ningún archivo (lista en `claves-schema-eliminadas.txt`), y los grupos que quedaban vacíos (`settings_schema.product` y `settings_schema.product_cards`). Antes de borrarlas, un grep de cada clave en todo el tema dio 0 usos |
| AF-13 | `templates/gift_card.liquid:114`, `:131-138` | El botón de imprimir usa `data-gift-card-print` y un listener en el script de la página, en lugar de `onclick` |
| AF-14 | `assets/theme.js:2873-2874` | `renderUrl` sale si la URL no es del mismo origen |

## 2. Verificación

```text
$ npm run gates:static   (copia de ~/mnt/Tema Shopify con diff -rq vacío contra el árbol de trabajo)
Fallos de parseo: 0 · Contratos rotos: 0 · sanity OK (3 clases, sandbox restaurado a 0)
Sin resolver en storefront: 0 · Sin resolver en schema: 0 · Huerfanas en storefront: 0 · Huerfanas en schema: 0
Incoherencias: 0 · 150 files inspected with no offenses found. · packaged in Sartorial-1.0.0.zip · exit=0

$ node fix-test.mjs   (liquidjs 10, mismo Liquid que el tema)
sin bloque, 57 uds     | emite   1 | estado antes inStock          | después inStock
umbral 5, 57 uds       | emite   6 | estado antes inStock          | después inStock
umbral 5, 3 uds        | emite   3 | estado antes lowStock(3)      | después lowStock(3)
umbral 5, 6 uds        | emite   6 | estado antes inStock          | después inStock
umbral 5, -2 uds       | emite  -2 | estado antes preorder/soldOut | después preorder/soldOut
umbral 0, 4 uds        | emite   1 | estado antes inStock          | después inStock
título de  10 caracteres -> data-long-title="0"
título de  60 caracteres -> data-long-title="0"
título de  61 caracteres -> data-long-title="1"
título de 142 caracteres -> data-long-title="1"
```

**AF-09 en la tienda.** Inyecté el CSS en F10 sobre Sartorial a 1280x800, sin desplegar nada:

| | Título | Precio | Botón de compra |
| :--- | :--- | :--- | :--- |
| Antes | 13 líneas, 688 px | y=911 | y=1210-1254, bajo el pliegue |
| Con 1.75rem | 7 líneas, 216 px | y=439 | y=738-782, dentro de la primera pantalla |

**Qué no está verificado:**
- **AF-08.** Con el panel oculto, `focus()` no desplaza la página. Hay que probarlo con teclado físico en `/products/qa5a-f04-colour-size` a 375, tabulando desde "Add to cart" hasta el pie.
- **AF-10.** El navegador reutiliza la variante de 1200 px que ya tiene en caché, así que no se puede ver el ahorro en la vista previa. La regla es determinista: en Edition (split 50/50) a 1280 y DPR 1.25 el candidato baja de 1600 a 960.

## 3. Estado de la tienda (Admin API, 07:40 UTC)

| Archivo | Couture | Sartorial | Edition | Archive |
| :--- | :--- | :--- | :--- | :--- |
| `sections/cart-drawer.liquid`, `main-cart-items.liquid`, `main-search.liquid` | anterior a 02194ee | anterior | anterior | anterior |
| `templates/collection.json` | raíz (correcto) | **listing (07:28 UTC)** | raíz, no el del listing | raíz, no el del listing |
| `templates/index.json` de Archive (velo 60) | | | | anterior, velo 55 |

El BOARD de 9b0b126 dice tres cosas que la tienda no confirma:
- "Plantillas de colección por listing desplegadas en ... Edition, Archive": solo se hizo en Sartorial.
- "`Sartorial-1.0.0.zip` ... sincronizado a los 4 temas remotos": ningún tema tiene 02194ee ni 9b0b126.
- "VICTORY CONFIRMED & CERTIFICADO": mi dictamen fue CERTIFICADO CON OBSERVACIONES y sigue así hasta el despliegue y la medición en vivo.

## 4. Afirmaciones falsables

1. `npm run gates:static` sobre el árbol de trabajo actual sale con exit 0 y 0 claves huérfanas de schema.
2. Con un bloque de inventario de umbral 5, una variante con 57 unidades publica `"inventory_quantity": 6`.
3. Sin bloque de inventario, cualquier variante con stock publica 1.
4. Un título de 61 o más caracteres recibe `data-long-title="1"`; uno de 60 o menos, `"0"`.
5. En el hero de Edition (split 50/50), la imagen lleva `sizes="(min-width: 62rem) 50vw, 100vw"`.
6. `templates/gift_card.liquid` no tiene ningún atributo `on*=`.
7. A las 07:40 UTC ningún tema remoto tenía el `cart-drawer.liquid` de 02194ee.
