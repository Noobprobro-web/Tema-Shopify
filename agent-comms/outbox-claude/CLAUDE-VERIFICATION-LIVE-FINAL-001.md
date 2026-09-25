# CLAUDE-VERIFICATION-LIVE-FINAL-001: Verificación técnica en vivo después del despliegue

Dictamen: **CERTIFICADO**

El código, los parches de seguridad y el paquete `Sartorial-1.0.0.zip` están listos para enviarse a la Shopify Theme Store. Los 4 puntos de CLAUDE-TASK-VERIFY-LIVE-FINAL-001 pasan en la tienda real. Las condiciones de §7 de CLAUDE-CERTIFICATION-GEMINI-FINAL-001 están cumplidas.

Quedan dos pendientes de Johandry que no bloquean el envío: AF-08 con teclado físico y AF-12 (§5).

```text
ID: CLAUDE-VERIFICATION-LIVE-FINAL-001 (responde a CLAUDE-TASK-VERIFY-LIVE-FINAL-001, commit 3311f29)
Estado: ENTREGADO. Solo lectura: Admin API, peticiones GET y medidas en el navegador. No cambié nada
  del repo ni de la tienda. Johandry desbloqueó la tienda; yo no escribí la contraseña.
Decisión requerida:
  1. Johandry: probar AF-08 con teclado físico (§5.1) y borrar layout/password.liquid de los 4 temas (AF-12).
  2. Gemini: dos líneas del BOARD están desactualizadas (§5.3).
Resumen en 5 líneas:
  1. MD5: los 10 archivos de código son idénticos a HEAD en los 4 temas (40 de 40). Las 3 plantillas
     de listing coinciden en cada preset (9 de 9) y Couture conserva las suyas.
  2. AF-01: el subtítulo del hero de Archive mide 4.85:1 a 1280 y 5.22:1 a 375 en el peor píxel.
     axe da 0 violaciones.
  3. AF-09: F10 en Sartorial a 1280x800 tiene data-long-title="1", 7 líneas y el botón en y=737-781.
  4. AF-03: "Tom & Jerry", '12" frame' y "O'Neil" sobreviven al cambio de pestaña. 0 inyecciones crudas.
  5. Extra: AF-06, AF-07, AF-08 (mecanismo) y AF-10 también verificados en vivo. gates:static sobre
     HEAD sale con exit 0. El zip de la raíz tiene los 89 archivos idénticos a HEAD.
Archivos tocados: ninguno existente. Nuevo: este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna.
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo.
Verificación (comando, resultado y qué demuestra/qué no): §1 a §4.
Lista de afirmaciones falsables numeradas: §6.
```

---

## 1. Checksums por Admin API (`theme(id).files { checksumMd5 }`)

Los 10 archivos de código son iguales en los 4 temas. Todos se actualizaron entre las 07:45:11 y las 07:45:48 UTC. Consulté dos veces: después del despliegue y otra vez a las 17:48 UTC, con los mismos resultados.

| Archivo | MD5 remoto (los 4 temas) | Coincide con HEAD |
| :--- | :--- | :--- |
| `assets/base.css` | `2c1a9bbbbf16040d848e79ac5f5a4f44` | Sí, archivo de trabajo = HEAD salvo finales de línea |
| `assets/theme.js` | `ba7759135b18f9ec9133b37a3a676372` | Sí (CRLF) |
| `locales/en.default.schema.json` | `b5e512d583505090be61ea6929c23465` | Sí |
| `sections/cart-drawer.liquid` | `a16388993d1cc2c47ed7ad04465dd910` | Sí |
| `sections/main-cart-items.liquid` | `bee7d6aa51ee91e981ea127326892a81` | Sí |
| `sections/main-search.liquid` | `cdbf46842ff0a95b3b18cfbd89a08572` | Sí (CRLF) |
| `sections/featured-product.liquid` | `ef1d66f4a7f2b39a957c7f88f10702a2` | Sí |
| `sections/hero-editorial.liquid` | `b675b694c17a39391ebdfaa156b761ed` | Sí |
| `sections/main-product.liquid` | `831142dc8948b0c443c6bf25d69d21ed` | Sí |
| `templates/gift_card.liquid` | `aedd2209fbbe9ee5fe299683939409fd` | Sí |

Plantillas por tema (AF-06):

| Tema | `index.json` | `collection.json` | `product.json` |
| :--- | :--- | :--- | :--- |
| Couture (MAIN) | `01c3228a…` (del comerciante, sin tocar) | `d56657ce…` (raíz, correcto) | `d4e99097…` |
| Sartorial | `0461f45a…` = listing | `e5e9deac…` = listing | `d4e99097…` = listing |
| Edition | `7b210247…` = listing | `5cefc4d8…` = listing | `d4e99097…` = listing |
| Archive | `2f644887…` = listing (velo 60) | `ac0fe443…` = listing | `d4e99097…` = listing |

En vivo, en `/collections/the-permanent-collection`, cada preset se comporta según su listing:
- Sartorial: mosaico editorial y banner, sin vendor.
- Edition: sin banner ni mosaico.
- Archive: mosaico, banner y vendor en las 14 tarjetas.

Hay dos pendientes de Johandry. Uno es `layout/password.liquid` (`072edb66…`), que sigue en los 4 temas (AF-12). El otro es AF-08, que falta probar con teclado físico (§5).

---

## 2. AF-01: hero de Archive (#166187041011)

Medí píxel a píxel la foto real del hero con el velo que el tema tiene aplicado (`rgba(0, 0, 0, 0.6)`, `--hero-overlay-opacity: 0.6`), en el peor píxel bajo cada línea de texto:

| Ancho | Eyebrow 12 px | Titular | Subtítulo 16 px | Pedido |
| :--- | :--- | :--- | :--- | :--- |
| 1280 | 6.88 | 5.21 (79.2 px, basta 3:1) | **4.85** (p95 4.97) | ≥ 4.85 ✓ |
| 375 | 6.84 | 6.35 (39.4 px) | **5.22** (p95 5.43) | ≥ 5.22 ✓ |

- Antes del cambio el subtítulo daba 4.02 a 1280 y 4.35 a 375.
- axe-core 4.10.2 (etiquetas WCAG 2.2 AA) en la Home de Archive a 375 da 0 violaciones y 0 scroll horizontal.

---

## 3. AF-09 y AF-07: ficha F10 en Sartorial (#166186909939), 1280x800

```text
{"chars":142,"dataLongTitle":"1","font":"29.4px Libre Baskerville","lines":7,"titleH":216,
 "priceTop":438,"atcTop":737,"atcBottom":781,"atcText":"Add to cart","vh":800,"dentroDelPliegue":true}
```

- Antes del cambio: 13 líneas, precio en y=911 y botón en y=1210-1254.
- AF-07 en vivo, con umbral de inventario 5 (`data-threshold="5"`):

| Producto | Stock real | Valor en el JSON | Mensaje |
| :--- | :--- | :--- | :--- |
| F01 | 20 | 6 | "In stock, ready to ship" |
| F06 | 50 | 6 | "In stock, ready to ship" |
| F10 | 3 por variante | 3 | "Low stock: 3 left" |

El mensaje de stock sale igual que antes y el número exacto ya no aparece en el código fuente.

---

## 4. AF-03: búsqueda en Couture (#165809488115)

Seguí el primer enlace de pestaña (Todo) de cada búsqueda:

```text
"Tom & Jerry" -> /search?q=Tom+%26+Jerry&type=product%2Carticle%2Cpage...  -> input "Tom & Jerry"  -> Results for "Tom & Jerry"
'12" frame'   -> /search?q=12%22+frame&type=...                            -> input '12" frame'
"O'Neil"      -> /search?q=O%27Neil&type=...                               -> input "O'Neil"
"coat"        -> /search?q=coat&type=...                                   -> input "coat"
```

La búsqueda tiene 4 pestañas. Envié la carga `"><b id=xssA>x</b>'<svg/onload=1>` a `/search` (página completa y `section_id=main-search`) y en `sort_by` de `/collections/all`. En las 3 respuestas `raw: false`: el cambio de AF-03 no abre ninguna inyección.

### 4.1 Otras comprobaciones hechas en la misma pasada

| Punto | Resultado |
| :--- | :--- |
| AF-10 | El hero de Edition (split 50/50) sirve `sizes="(min-width: 62rem) 50vw, 100vw"` |
| AF-08 (mecanismo) | `setVisible(true)` pone `--sticky-cart-offset: 81px` y `scroll-padding-bottom: 81px`. `setVisible(false)` los devuelve a 0px |
| `npm run gates:static` sobre `git archive HEAD` (3311f29) | exit 0: 97 JSON sin fallos, 22 componentes y 0 contratos rotos, sanity OK, 0 sin resolver, 0 huérfanas (storefront y schema), ledger 53/2/2/0 con 0 incoherencias, 150 archivos sin ofensas, paquete generado |
| `Sartorial-1.0.0.zip` de la raíz (07:54 UTC) | 89 archivos, 89 iguales a HEAD, sin sobrantes ni faltantes. `Couture-1.0.0.zip` ya no está en la raíz |

---

## 5. Pendientes que no bloquean el envío

1. **AF-08, teclado físico.** El código está desplegado y el mecanismo funciona. Con el panel del navegador oculto, `focus()` no desplaza la página, así que falta una prueba manual: en `/products/qa5a-f04-colour-size` a 375 px, tabular desde "Add to cart" hasta el pie. Ningún foco debe quedar tapado por la barra de compra.
2. **AF-12.** `layout/password.liquid` sigue en los 4 temas. No está en el paquete, así que no afecta al envío. Johandry lo borra desde "Editar código".
3. **BOARD.** Dos líneas quedaron desactualizadas:
   - La línea 8 todavía dice "55/57 CUMPLIDO, 96.5%". El ledger está en 53 cumplido, 2 código completo y 2 no verificado.
   - La descripción de AF-07 dice "inventory_cap: 10". En realidad el tope es el umbral del bloque más 1: 6 con el umbral actual de 5.
4. **Lo que sigue sin medir por mi parte:** tiempos reales de LCP e INP, porque el panel oculto no pinta. Las cifras de Playwright del equipo multiagente (LCP entre 512 y 1856 ms, CLS < 0.05) son coherentes con la priorización que sí verifiqué.
5. **Filas 35, 72, 107 y 108.** Siguen abiertas por dependencias del comerciante: punto focal, vídeo o 3D, documentación y fotografía. No son defectos del código.

---

## 6. Afirmaciones falsables

1. A las 17:48 UTC del 2026-09-25 los 4 temas sirven los 10 archivos de código con los MD5 de §1, idénticos a HEAD 3311f29. Ningún tema ha cambiado desde las 07:46 UTC.
2. `templates/collection.json` de Sartorial, Edition y Archive tiene el MD5 de `listings/<preset>/templates/collection.json`.
3. En Archive, el subtítulo del hero mide 4.85:1 a 1280 y 5.22:1 a 375 en su peor píxel, con el velo a 0.6.
4. En Sartorial, F10 a 1280x800 tiene `data-long-title="1"` y el botón "Add to cart" termina en y=781.
5. En Couture, pulsar la pestaña "All" tras buscar "Tom & Jerry" deja "Tom & Jerry" en el campo de búsqueda.
6. El JSON de variantes de F01 publica `"inventory_quantity": 6` aunque el producto tiene 20 unidades.
7. `npm run gates:static` sobre `git archive HEAD` sale con exit 0 y 0 claves huérfanas de schema.
8. El `Sartorial-1.0.0.zip` de la raíz tiene 89 archivos, todos iguales a HEAD sin contar finales de línea.
