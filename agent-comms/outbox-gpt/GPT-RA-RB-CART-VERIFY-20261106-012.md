# GPT-RA-RB-CART-VERIFY-20261106-012

ID: GPT-RA-RB-CART-VERIFY-20261106-012

Estado: lectura post-route-fix aprobada con límites; prueba de carrito condicional fallida en Archive. **Estado del carrito de la sesión Archive en tienda no resuelto.** R-A/R-B y Lote 0 abiertos; Lote C no iniciado. Revisión documental independiente pendiente.

Decisión requerida: conservar la incertidumbre de Archive y revisar los fallos sin declarar limpieza ni aceptación R-B. No hubo autorización de reintento en estas corridas y no se reintentó.

Resumen en 5 líneas:
1. Lectura pasó: 132 checks = 96 `passed`, cero `failed`, 36 `observed`, cero `not_run`; 18 axe aprobados y cero eventos fatales de routing.
2. Solo después de ese pase se repitió preflight y se ejecutó una única corrida `--cart`: 15 checks = 13 aprobados y dos fallidos.
3. Sartorial/Imprint pasaron el smoke de alta/drawer/nota y verificaron carrito vacío/sin nota tras limpieza HTTP 200.
4. Archive falló el alta y la limpieza: clear/update/read devolvieron 429; cantidad, vacío y nota quedaron `null`, desconocidos.
5. Los tres carritos estaban inicialmente vacíos verificados y se tocaron; los contextos cerraron, sin reintentos ni posibilidad de afirmar que Archive quedó vacío.

Archivos tocados: este informe y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`. Desviaciones: ninguna. No se cambia código, D28, JSON, commits, push ni filas del ledger.

Verificación: se documentan las dos ejecuciones ya realizadas, autorizadas en secuencia condicional, y su lectura local posterior. Esta tarea documental no repitió pruebas, comprobó credenciales ni accedió a tienda. No se guardan secretos, valores de nota/formularios o URLs completas.

## Preflight y orden autorizado

Antes de **cada** modo se verificaron solo `STOREFRONT_PASSWORD=SET` y `SHOPIFY_CLI_THEME_TOKEN=SET`, sin valores; Shopify CLI exit 0 confirmó `190232297715`, `190232330483`, `190232363251` no publicados. El harness fue el mismo snapshot `D02242436ECF1C12A7D2863A161EB7F6787C70A4B9711A34745DB1C74D48D2B8`.

1. [JSON lectura](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T112604093Z-a8ac9698-96cd-466d-8dcf-27ad12989302.json), `11:26:04.094Z`–`11:27:10.216Z`: exit 0, `executionResult=completed`, `scopeResult=completed_with_limits`.
2. Solo al comprobar ambos resultados positivos, se repitió el preflight y se ejecutó el [JSON carrito](./harness-GPT-RA-RB-001/results/RA-RB-cart-20261106T112804500Z-605bdcd0-07ef-43aa-a9f5-6e0d5038b634.json), `11:28:04.501Z`–`11:28:26.331Z`: exit 1, `executionResult=failed`, `scopeResult=failed`.

Ambas corridas fueron el `2026-11-06`; una por modo, sin reintentos.

## Lectura: pase con límites

| Resultado | Cantidad |
|---|---|
| `passed` | 96 |
| `failed` | 0 |
| `observed` | 36 |
| `not_run` | 0 |
| Total | 132 |

Pasaron acceso/identidad (3), páginas (18), teclado (18), overflow (18), menú (9), drawer vacío (6), idioma visible (6) y los 18 axe smoke. Cero violations; permanecen 18 avisos exactos de preview-bar y 18 resúmenes observados. Los incompletos `aria-valid-attr-value/critical` (dos scans, ocho apariciones) y `color-contrast/serious` (18 scans, 144 apariciones) no son violaciones confirmadas ni certificación de contraste/lector de pantalla.

| Preview | Fatal routing / bandera | Avisos routing / omitidos | Contexto cerrado | Carrito tocado |
|---|---|---|---|---|
| Sartorial | 0 / `false` | 8 / 0 | `true` | `false` |
| Imprint | 0 / `false` | 15 / 0 | `true` | `false` |
| Archive | 0 / `false` | 2 / 0 | `true` | `false` |

Los 25 avisos son timeouts de fetch GET a CDN Shopify dentro del filtro acotado aceptado; no eventos fatales. La corrida registró 673 solicitudes bloqueadas. El pase `completed_with_limits` no acepta toda R-A/R-B ni cierra Lote 0.

## Carrito: resultados y limpieza

Los 15 checks se distribuyen en 13 `passed` y dos `failed`. El modo carrito no ejecutó axe. Los tres contextos verificaron inicialmente carrito vacío/sin nota, autorizaron las mutaciones de prueba y registran `cartTouched=true`.

| Preview / ID | Alta PDP | Drawer 390/1280 | Echo API nota | Limpieza final | Contexto cerrado |
|---|---|---|---|---|---|
| Sartorial / `190232297715` | Una línea/un artículo verificado | Ambos aprobados | Exacto, aprobado | Aprobada | `true` |
| Imprint / `190232330483` | Una línea/un artículo verificado | Ambos aprobados | Exacto, aprobado | Aprobada | `true` |
| Archive / `190232363251` | `CART_ADD_NOT_EXACTLY_ONE_LINE` | No alcanzado tras fallo de alta | No alcanzado tras fallo de alta | `CART_CLEANUP_NOT_VERIFIED` | `true` |

| Preview | Clear HTTP | Update nota HTTP | Lectura HTTP | `itemCount` | `emptyVerified` | `noteEmptyVerified` |
|---|---|---|---|---|---|---|
| Sartorial | 200 | 200 | 200 | 0 | `true` | `true` |
| Imprint | 200 | 200 | 200 | 0 | `true` | `true` |
| Archive | 429 | 429 | 429 | `null` | `null` | `null` |

Las dos fallas exactas son Archive `cart_pdp_add_one_line/CART_ADD_NOT_EXACTLY_ONE_LINE` y `final_same_session_cart_cleanup/CART_CLEANUP_NOT_VERIFIED`. Los 429 están acreditados en la limpieza/lectura final; no se infiere a partir de ellos la causa concreta del fallo de alta.

**No se puede declarar que el carrito de la sesión Archive quedó vacío o sin nota.** Tampoco se acredita que contenga productos: la lectura final falló y su estado es desconocido. El vacío inicial, el cierre del contexto y la limpieza correcta de Sartorial/Imprint no resuelven esa incertidumbre. No se abrió otra sesión ni se reintentó después de los 429.

En carrito hubo cero eventos fatales de routing y banderas `false` en los tres; dos avisos acotados en Sartorial, cero en los demás, sin omitidos. Se bloquearon 152 solicitudes. El resultado global falló por los dos checks de Archive, no por los avisos; las banderas de routing no prueban limpieza.

## Estado pendiente

El estado de carrito en tienda queda **no resuelto para la sesión Archive**. No hay aceptación completa R-B/R-A ni cierre del Lote 0; las matrices completas B-03/B-04 no quedan certificadas por este smoke y C-R0-4 sigue pendiente de Johandry. Lote C no iniciado. Mantener preflight sin valores, solo previews no publicadas, revisión independiente por cambio y las reglas vigentes. No declarar Archive limpio ni convertir el pase de lectura o de otros presets en evidencia de su limpieza.
