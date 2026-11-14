```text
ID: REVIEW-STORE-STATE-001
Estado: entregado (revisión independiente, solo lectura)
Decisión requerida: Johandry/lead: aprobar las correcciones C1-C3 (tienda) y C4 (imágenes) antes de usar la tienda como demo.
Resumen en 5 líneas:
  1. Tienda verificada: get-shop-info.domain = sartorial-theme-kvkzl39t.myshopify.com (PASO 0 OK).
  2. Catálogo del kit: 24/24 handles, 21 ACTIVE + 3 DRAFT, nº de variantes, precios, compare-at, peso, impuestos, envío e inventario coinciden con products.csv.
  3. 11/11 colecciones smart con handle, regla TAG y recuento esperados; test-fixtures sin publicar; páginas, menús y blog coinciden con el kit.
  4. Fallos: solo existe la política de privacidad (el footer enlaza 3 políticas que no existen); 3 colecciones de ejemplo siguen publicadas (una mezcla 12 productos del kit con snowboards archivados).
  5. Veredicto: ACEPTADO CON CONDICIONES (C1-C4 abajo). Las afirmaciones de created-products.json y created-content.json son correctas.
Archivos tocados: solo este informe (creado). Repo y tienda sin cambios.
Desviaciones (Nivel 1 o Nivel 2): ninguna. Solo se usaron get-shop-info y graphql_query/graphql_schema de lectura.
Hallazgos extra fuera de alcance (con parche listo): el gift card de ejemplo tiene vendor "Snowboard Vendor" e inventario con seguimiento a 0 y política DENY (ver O1). No hay parche: es un cambio de datos en la tienda.
Verificación (comando, resultado y qué demuestra/qué no): ver §0-§6. Demuestra el estado de los datos del Admin a 2026-11-14. No demuestra el render en la tienda online (no se usó theme_* ni el storefront) ni la Compuerta 5.
Lista de afirmaciones falsables numeradas: §7.
```

Revisor: Claude (subagente verificador, independiente de los agentes que escribieron en la tienda). Fecha: 2026-11-14. Fuente esperada: `docs/demo-store/products.csv` (691 filas de variante; lo parseé con un script de Python en el scratchpad), `collections.md`, `pages.md`, `menus.md`, `blog.md`, `README.md`. Fuente real: Admin GraphQL 2026-10 con `mcp__Shopify__graphql_query`.

## 0. Identidad de la tienda
`get-shop-info` → `"domain":"sartorial-theme-kvkzl39t.myshopify.com"`, currency `USD`, plan `Basic App Development`. Coincide.
Ubicaciones (`locations(includeInactive:true)`): `Shop location` (activa) y `My Custom Location` (activa). Ambas tienen `fulfillsOnlineOrders: true`.
Publicaciones: Online Store `Publication/316919710000`, Shop y Point of Sale.

## 1. Productos

### 1.1 Recuento por estado (`productsCount` = 41)
| Estado | Real | Esperado | Detalle |
|---|---|---|---|
| ACTIVE | 22 | 21 del kit + `gift-card` | OK |
| DRAFT | 3 | 3 `[TEST]` | OK, `resourcePublicationsCount` 0 y `publishedOnPublication(OS)` false |
| ARCHIVED | 16 | ejemplos (15 snowboards y `selling-plans-ski-wax`) | OK, ninguno ACTIVE ni DRAFT |
| Total de variantes (`productVariantsCount`) | 717 | 691 kit + 4 gift card + 22 archivados = 717 | OK. No hay variantes de más ni productos duplicados |

No hay handles con sufijo `-1` ni títulos duplicados entre los 41 productos.

### 1.2 Kit: variantes, precio y fixtures (real vs CSV)
Todos los productos del kit: vendor `Studio Demo`. Las 188 variantes activas del kit y las 503 de prueba se revisaron una a una (activas) o con conteos más una muestra (pruebas).

| Handle | Estado | Var. real/CSV | Precio real/CSV | Compare-at | Inventario (Shop location) | Media |
|---|---|---|---|---|---|---|
| serra-coat | ACTIVE | 15/15 | 1890.00/1890.00 | — | 14×8; **Camel / M = 0** (DENY) | 0 |
| doppio-trench | ACTIVE | **10/10** | 945.50/945.50 | 1190.00/1190.00 (las 10) | 10×8 | 0 |
| cocoon-cardigan-coat | ACTIVE | 6/6 | 1275.00 | — | 6×8 | 0 |
| nove-blazer | ACTIVE | 10/10 | 745.00 | — | 10×8 | 0 |
| cropped-tailored-jacket | ACTIVE | 20/20 (Size 5 × Color 2 × Material 2) | 612.75 | — | 20×8 | 0 |
| pleated-wide-trouser | ACTIVE | 12/12 | 318.00 | — | 12×8 | 0 |
| cigarette-trouser | ACTIVE | 12/12 | 289.95 | — | 12×8 | 0 |
| cashmere-rib-crew | ACTIVE | 15/15 | 395.00 | — | 15×8 | 0 |
| fine-merino-turtleneck | ACTIVE | 10/10 | 228.00 | — | 10×8 | 0 |
| oversized-alpaca-knit | ACTIVE | 6/6 | 342.50 | — | 6×8 | 0 |
| poplin-column-shirt | ACTIVE | 10/10 | 164.00 | — | 10×8 | 0 |
| silk-charmeuse-blouse | ACTIVE | 10/10 | 278.00 | — | 10×8 | 0 |
| striped-cotton-shirt | ACTIVE | 10/10 | 149.00 | — | 10×8 | 0 |
| bias-cut-slip-dress | ACTIVE | 8/8 | 365.00 | — | 8×8 | 0 |
| wrap-wool-skirt | ACTIVE | 4/4 | 259.00 | — | 4×8 | 0 |
| pleated-midi-skirt | ACTIVE | 10/10 | 224.00 | — | 10×8 | 0 |
| leather-belt | ACTIVE | 8/8 | 98.00 | — | 8×8 | **0 (correcto: fixture sin imagen)** |
| cashmere-scarf | ACTIVE | 1/1 | 185.00 | — | 1×8 | 0 |
| silk-twill-square | ACTIVE | 3/3 | 135.00 | — | 3×8; `descriptionHtml: ""` (correcto) | 0 |
| structured-tote | ACTIVE | 2/2 | 520.00 | — | 2×8 | 0 |
| long-title-fixture-wrap-coat | ACTIVE | 6/6 | 1499.99 | — | 6×8; título de 120 caracteres (`len()` = 120, igual al CSV); SEO title de 70 caracteres, igual al CSV | 0 |
| test-1-variant | DRAFT | 1/1 (Default Title) | 10.00 | — | sin seguimiento (`tracked:false`) | 0 |
| test-250-variants | DRAFT | **250/250** (Size 10 × Color 5 × Material 5) | 10.00 | — | `tracksInventory:false` | 0 |
| test-252-variants | DRAFT | **252/252** (Size 7 × Color 6 × Material 6) | 10.00 | — | `tracksInventory:false` | 0 |

- **doppio-trench**: el CSV tiene 10 variantes (Stone/Black × XS-XL) y la tienda también. Lo que reporta el agente es correcto. El "10+" del README se refiere a imágenes (12), no a variantes.
- **Precios y compare-at**: revisé las 188 variantes activas del kit (21 productos, más de los 8 de la muestra pedida). En el CSV solo `doppio-trench` tiene compare-at, y en la tienda también. El resto tiene `compareAtPrice:null`.
- **Peso, impuestos y envío**: todas las variantes activas del kit tienen `0.5 KILOGRAMS` (CSV: 500 g), `taxable:true` y `requiresShipping:true`. En `test-1-variant` el peso es 0 kg (CSV: 0), con `taxable` y `requiresShipping` en true.
- **Inventario por ubicación**: todas las variantes activas del kit tienen un único `inventoryLevel` en **Shop location**. **My Custom Location no tiene niveles** (las variantes no están dadas de alta allí, así que tienen 0 o no aparecen). El encargo pedía mirar las dos ubicaciones: el stock vive solo en una. Es coherente con el "Single location only" del README, pero la tienda sigue teniendo dos ubicaciones activas (O2).
- **Variante en 0 por error**: ninguna. La única variante activa del kit con `available` 0 es `DEM-SERRA-COAT-008` Camel / M, con política `DENY`. Los `totalInventory` cuadran: serra 112 = 14×8 y el resto son n×8.
- **SKU**: 691 SKU únicos en el CSV. En la tienda, la búsqueda por SKU exacto devuelve 1 resultado del producto correcto (`DEM-SERRA-COAT-008`, `DEM-CASHMERE-SCARF-001`, `TST-TEST-1-VARIANT-001`, `TST-TEST-252-VARIANTS-001`, `-250-VARIANTS-250`, `-252-VARIANTS-252`). Los archivados usan `sku-untracked-1`, `sku-hosted-1`, `sku-managed-1` o null, así que no chocan con el prefijo DEM-/TST-. Límite: no comprobé uno a uno los 503 SKU de prueba en la tienda. Revisé los primeros 100 (secuenciales `TST-TEST-250-VARIANTS-001..099`), los extremos y los conteos totales.

## 2. Archivados
Ningún producto de ejemplo queda ACTIVE salvo `gift-card` (vendor `Snowboard Vendor`, 4 variantes, publicado solo en Online Store). Hay 16 ARCHIVED, todos `publishedAt:null`. Content > Files contiene solo los 20 archivos del sample data (snowboards, wax, gift card y theme cover). No hay imágenes del kit subidas.

## 3. Colecciones

| Handle | Título | Regla real | Publicada OS | productsCount real | Esperado | Coincide |
|---|---|---|---|---|---|---|
| the-autumn-series | The Autumn Series | TAGGED_WITH `autumn-series` | sí | 9 (MANUAL, `serra-coat` 1.º) | 9 | sí |
| new-forms | New forms | TAGGED_WITH `autumn-series` | sí | 9 | 9 | sí |
| permanent-collection | Permanent collection | TAGGED_WITH `permanent` | sí | 12 | 12 | sí |
| tailoring | Tailoring | TAGGED_WITH `tailoring` | sí | 4 | 4 | sí |
| knitwear | Knitwear | TAGGED_WITH `knitwear` | sí | 4 | 4 | sí |
| outerwear | Outerwear | TAGGED_WITH `outerwear` | sí | 4 | 4 | sí |
| accessories | Accessories | TAGGED_WITH `accessories` | sí | 4 | 4 | sí |
| new-arrivals | New arrivals | TAGGED_WITH `new-arrival` | sí | 3 | 3 | sí |
| empty-test | Empty collection (test) | TAGGED_WITH `tag-that-no-product-has` | sí | 0 | 0 | sí |
| single-product-test | Single product (test) | TAGGED_WITH `single-product-test` | sí | 1 (`cashmere-scarf`) | 1 | sí |
| test-fixtures | Test fixtures | TAGGED_WITH `test-fixture` | **no** (0 publicaciones) | 3 (los 3 DRAFT) | 3 | sí |

- Las 10 colecciones publicadas del kit contienen solo productos ACTIVE publicados en Online Store. Revisé los miembros uno a uno y coinciden con los tags del CSV. `productsCount` cuenta también los archivados y borradores (ver test-fixtures = 3 DRAFT, o hydrogen más abajo), pero en las colecciones del kit no hay ninguno, así que el recuento de cliente es igual al de admin.
- Orden: `the-autumn-series` MANUAL con serra-coat primero (lo pide collections.md). El resto usa BEST_SELLING (permitido).
- **Colecciones de ejemplo que siguen ahí y publicadas en Online Store:**

| Handle | Tipo/regla | productsCount | Miembros | Problema |
|---|---|---|---|---|
| frontpage ("Home page") | manual | 1 | `the-inventory-not-tracked-snowboard` (ARCHIVED) | publicada y vacía para el cliente; no pertenece al kit |
| automated-collection ("Automated Collection") | smart, precio de variante > 200 y < 800 | 20 | 12 del kit ACTIVE (structured-tote, pleated-midi-skirt, wrap-wool-skirt, bias-cut-slip-dress, silk-charmeuse-blouse, oversized-alpaca-knit, fine-merino-turtleneck, cashmere-rib-crew, cigarette-trouser, pleated-wide-trouser, cropped-tailored-jacket, nove-blazer) + 8 snowboards ARCHIVED | huérfana del sample data, publicada, aparece en `/collections` mezclando el demo |
| hydrogen ("Hydrogen") | manual | 3 | 3 snowboards ARCHIVED | publicada y vacía para el cliente |

## 4. Páginas, menús, blog y políticas

### 4.1 Páginas (`pagesCount` = 4)
| Handle | templateSuffix | Publicada | Cuerpo vs pages.md |
|---|---|---|---|
| about | `about` (existe `templates/page.about.json`) | sí | idéntico (2 párrafos) |
| contact | `contact` (`templates/page.contact.json`) | sí | idéntico. Creada a las 04:44, junto con la tienda: cuadra con "updated existing" |
| faq | `faq` (`templates/page.faq.json`) | sí | idéntico |
| data-sharing-opt-out | — | sí | página de sistema de Shopify (Your Privacy Choices). Es esperable y no hay que borrarla |

### 4.2 Menús
- `main-menu`: Catalog (tipo CATALOG, `/collections/all`) con 6 hijos COLLECTION (new-forms, permanent-collection, tailoring, knitwear, outerwear, accessories), luego Tailoring (COLLECTION), About (PAGE `164079108400`) y Contact (PAGE `164078453040`). Coincide exactamente con menus.md, con el anidado correcto. Todos los `resourceId` apuntan a recursos existentes.
- `footer`: FAQ (PAGE), Contact (PAGE), luego Shipping policy, Refund policy, Privacy policy y Terms of service, de tipo HTTP a `/policies/*`. Estructura igual a menus.md, pero **3 de los 4 destinos no existen** (§4.4).
- `customer-account-main-menu`: lo crea Shopify.

### 4.3 Blog
`blogsCount` = 1: `news` ("News"). 3 artículos publicados (`isPublished:true`, 2026-11-14T05:20:14Z), con handles, títulos, tags y cuerpos idénticos a blog.md. Sin imagen destacada (correcto). Autor "Demo store". El blog opcional `empty-news` no se creó (blog.md lo deja opcional).

### 4.4 Políticas (`shop.shopPolicies`)
Solo existe `PRIVACY_POLICY`, con título **"Política de privacidad"** (en español, en una demo inglesa). **No existen REFUND_POLICY, SHIPPING_POLICY ni TERMS_OF_SERVICE**, que pages.md pide crear "from template". En consecuencia, 3 enlaces del footer (`/policies/shipping-policy`, `/policies/refund-policy`, `/policies/terms-of-service`) no resuelven a ningún recurso.

## 5. Lo que sobra y lo que falta
Sobra:
- 3 colecciones de ejemplo publicadas (§3).
- Gift card de ejemplo ACTIVE con vendor `Snowboard Vendor` (O1).
- `My Custom Location` activa sin stock (O2).

No hay productos duplicados, handles `-1`, SKU repetidos (dentro de los límites de §1.2) ni páginas extra salvo la de sistema.

Falta respecto al kit:
- Políticas refund, shipping y terms.
- Imágenes de producto: 0 media en los 21 activos. README paso 4 pide 1-3 por producto y 12 en `doppio-trench`. Solo `leather-belt` debe quedarse sin imagen.
- Imágenes de las plantillas About y otras, que el kit sube a mano. No lo verifiqué porque no se usó theme_*.

## 6. Seguridad de datos
Los datos creados por los agentes (cuerpos de producto, páginas, artículos, vendor "Studio Demo", autor "Demo store", SKU, tags y metafields `global.title_tag`) no contienen datos personales, claves ni URLs externas.

Hay un dato personal que no creó el kit pero está en la tienda: la política de privacidad generada por Shopify contiene, en la sección Contact, el **email personal del propietario** en texto plano. Si la demo va a ser pública hay que sustituirlo por un contacto neutro (C3). En este informe no se reproduce el valor. La tienda (`get-shop-info.email`) expone el mismo email como dato de cuenta, lo cual es normal y no visible en el storefront.

## Veredicto: ACEPTADO CON CONDICIONES

Los productos, colecciones, páginas, menús y blog que crearon los agentes coinciden con el kit y con `created-products.json` / `created-content.json`. Ninguna afirmación de esos JSON es falsa: 24+1 IDs, estados y nº de variantes; 11 colecciones con reglas, publicación y `productsAtCreation`; 3 páginas con plantillas; menús y blog. Faltan pasos del kit y hay restos del sample data que afectan a lo que ve el cliente.

Correcciones mínimas exactas:
- **C1 (bloqueante para el footer):** Settings > Policies: crear desde plantilla, en inglés, **Refund policy**, **Shipping policy** y **Terms of service**. Así resuelven `/policies/refund-policy`, `/policies/shipping-policy` y `/policies/terms-of-service` del menú `footer`.
- **C2:** Products > Collections: borrar, o al menos quitar del canal Online Store, `automated-collection` (`Collection/515551985968`), `frontpage` (`Collection/515551953200`) y `hydrogen` (`Collection/515552018736`). No son del kit. El tema no los referencia: `rg` sobre templates/sections/listings no devuelve nada.
- **C3:** Settings > Policies > Privacy policy: cambiar el título a "Privacy policy" y sustituir el email personal de la sección Contact por un contacto de demo neutro (o quitarlo).
- **C4 (paso pendiente del kit, no es error de creación):** subir imágenes de producto según el README (todos los activos salvo `leather-belt`; 12 en `doppio-trench`). Hasta entonces la tienda no sirve como demo visual ni para los estados "muchas imágenes" y "imagen secundaria ausente".

Observaciones que no bloquean:
- **O1:** `gift-card` ACTIVE con vendor "Snowboard Vendor" y variantes `tracked:true`, `available 0` y `inventoryPolicy DENY`. Conviene revisar en el storefront que se puede comprar, quitarle el seguimiento de inventario o archivarlo, y cambiar el vendor.
- **O2:** `My Custom Location` está activa y con `fulfillsOnlineOrders:true`, pero no tiene stock dado de alta. No rompe nada, pero el README asume una sola ubicación. Se puede desactivar o dejar así; si se usan las dos ubicaciones, documentarlo.

Ledger (no se cierra ni modifica ninguna fila): la fila "3 Tiendas Demo Auténticas" (`docs/requirements-ledger.md:116`) no recibe evidencia de esta tienda. Para esta tienda su estado es **no verificado**: sin imágenes, faltan políticas y no se probó el storefront ni la Compuerta 5.

## 7. Afirmaciones falsables
1. `get-shop-info.domain` = `sartorial-theme-kvkzl39t.myshopify.com`.
2. `productsCount` = 41: 22 ACTIVE, 3 DRAFT y 16 ARCHIVED. El único ACTIVE fuera del kit es `gift-card`.
3. `productVariantsCount` = 717.
4. Nº de variantes: `test-1-variant` 1, `test-250-variants` 250, `test-252-variants` 252, `serra-coat` 15, `cropped-tailored-jacket` 20, `doppio-trench` 10, todo igual al CSV.
5. La única variante activa del kit con `available` 0 es `DEM-SERRA-COAT-008` (Camel / M, DENY). Las demás tienen 8 en Shop location y ningún nivel en My Custom Location.
6. Los 3 `[TEST]` tienen `tracksInventory:false` y 0 publicaciones.
7. Solo `doppio-trench` tiene compare-at (1190.00) y su precio es 945.50.
8. Las 21 activas del kit tienen `mediaCount` 0. `silk-twill-square` tiene `descriptionHtml` vacío. El título de `long-title-fixture-wrap-coat` mide 120 caracteres.
9. Las 11 colecciones del kit tienen regla `TAGGED_WITH` con el valor de collections.md y los recuentos de §3. `test-fixtures` tiene `resourcePublicationsCount` 0.
10. `frontpage`, `automated-collection` e `hydrogen` están publicadas en Online Store. `automated-collection` contiene 12 productos ACTIVE del kit.
11. `shop.shopPolicies` devuelve solo `PRIVACY_POLICY`.
12. `main-menu` y `footer` tienen exactamente los items de menus.md, y los `resourceId` de los items COLLECTION y PAGE existen.
13. El blog `news` tiene 3 artículos publicados con los handles de blog.md.
