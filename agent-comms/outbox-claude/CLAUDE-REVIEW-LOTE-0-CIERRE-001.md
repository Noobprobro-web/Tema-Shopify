ID: CLAUDE-REVIEW-LOTE-0-CIERRE-001
Fecha: 2026-11-06
Revisor: subagente Claude Opus 5.5, contexto limpio, distinto del escritor (GPT/Codex). Exigido por D19 (b).
Rama revisada: `origin/lote-d`, punta `d9f76c21f338dd5c5b55870cc3f53370afe26253` (clon nuevo en contenedor, solo lectura).
Estado: Revisión completada.
Veredicto: **APROBADO CON CONDICIONES TRASLADABLES.**
Decisión requerida: Johandry, sobre las condiciones trasladables de §8 (fixture C-R0-4 y disposición del carrito Gate 5 `T231955117Z`).

Resumen en 5 líneas:
1. C-R0-1 cumplida: la ficha `GEMINI-FICHA-LOTE-0-BASE-001.md` está en el repo y sus 93 SHA-256 coinciden 93/93 con el ZIP regenerado aquí desde `fbdf462`.
2. C-R0-2 cumplida: `scripts/package-theme-zip.mjs` regenera dos veces aquí el hash canónico D21 `f001627e…e585` (93 archivos, 287165 bytes), con otra zlib (1.3.1) distinta de la de la revisión ZIP.
3. C-R0-3 cumplida: Imprint `190232330483` y Archive `190232363251` registradas como no publicadas con nombre e ID; identidad de preview verificada en los JSON. Condición trasladable: reconfirmarlas por CLI antes de la próxima prueba en tienda, porque el último preflight (015) falló.
4. C-R0-4 pendiente de Johandry, permitido por D19 (c) y D28. Solo bloquea A-01.
5. Seguridad y git: 0 líneas con el literal en contexto de credencial fuera de `tests/vendor/axe.min.js`; master en `09f8342`; cadena lote0 → lote-a → lote-b → lote-c → lote-d lineal y sin merges; sin archivos de credenciales.

Archivos tocados: solo este informe. Sin commit, sin push, sin tienda, sin `.secrets`, sin ejecutar gate5.
Desviaciones: ninguna. Escribí ZIPs y scripts de conteo solo en el scratchpad del contenedor.
Hallazgos extra fuera de alcance: P3-1 (`.secrets` no está en `.gitignore`) y P3-2 (trazabilidad del snapshot actual del runner). Ver §7.

---

# 1. Alcance y método

D19 (b) limita esta revisión a C-R0-1 a C-R0-4 de `GEMINI-REVIEW-LOTE-0-R0-002` §7 (a = C-R0-1 ficha, b = C-R0-2 ZIP, d = C-R0-3 previews, c = C-R0-4 fixture). El coordinador pidió además revisar Gate 5, R-A/R-B, seguridad y coherencia de git. Esos puntos los trato como información que acompaña al cierre. No son condiciones de D19.

Hice todo con lectura: `git clone`, `fetch`, `log`, `show`, `diff` y `ls-remote`. Ejecuté el empaquetador con `--rev`, que lee blobs de git y escribe el ZIP fuera del repo. Los conteos del literal se hicieron en memoria y solo imprimieron números.

Fuentes leídas: `CLAUDE-CLOUD-STATUS.md`, `GPT-LOTE-C-PREPARACION-20261106-016.md`, `docs/decisions.md` (D19 a D28 y addenda), `CLAUDE-DECISION-LOTE-0-CIERRE-001.md`, `CLAUDE-DECISION-SESION-003.md`, `GEMINI-REVIEW-LOTE-0-R0-002.md`, `GEMINI-FICHA-LOTE-0-BASE-001.md`, el plan V4.1 (§3 Lote 0 y §5.2 R-0/R-A/R-B), `CLAUDE-REVIEW-LOTE-0-ZIP-001.md`, `GPT-LOTE-0-CLOSE-REVIEW-001.md`, los informes 014 y 015, los 9 JSON `GATE5-DIAGNOSTIC-*` y los 17 JSON de `harness-GPT-RA-RB-001/results/`.

# 2. Condiciones de D19

| Condición | Estado | Evidencia |
|---|---|---|
| C-R0-1 ficha | **CUMPLIDA** | Ficha en `agent-comms/outbox-gemini/` desde `1c7aec0`, que es ancestro de todas las ramas lote-*. Su manifiesto tiene 93 filas. Comparé ruta, bytes LF y SHA-256 de cada una con el ZIP de `fbdf462`: 0 discrepancias y 0 archivos fuera del manifiesto. Su hash `79ff3961…` queda como histórico no reproducible según D21. La política LF se cumple, porque el empaquetador lee blobs y falla si un texto tiene CR. |
| C-R0-2 ZIP regenerable con hash canónico | **CUMPLIDA** | Ver §3. D19 citaba `79ff3961…`, pero Johandry lo sustituyó en D21 por el hash del empaquetador propio, `f001627e…`. |
| C-R0-3 previews Imprint/Archive no publicadas | **CUMPLIDA, con condición trasladable** | Registro en `9da76aa` (STATUS): "Preview imprint 2026-11-05" `190232330483` y "Preview archive 2026-11-05" `190232363251`, subidas con `--unpublished --listing`. Sartorial es `190232297715`. URL sin credenciales: `?preview_theme_id=<ID>` (`CLAUDE-STORE-RUN-001`). En `T112604093Z` y `T112804500Z`, `storefront_access` dio `previewIdVerified=true` en los tres presets; en `T153117264Z`, en Archive. El coordinador confirmó por CLI (exit 0) que estaban no publicadas antes de `T112604093Z` y de `T153117264Z`. Límite: el preflight del informe 015 falló dos veces (exit 1). Eso no prueba que se hayan publicado, pero el estado actual no está reconfirmado. |
| C-R0-4 fixture de suscripción | **PENDIENTE DE JOHANDRY** | No existe. D19 (c) y D28 permiten cerrar con este punto pendiente. Los JSON lo declaran (`C_R0_4_SUBSCRIPTION_FIXTURE_PENDING_JOHANDRY`). Solo A-01 queda en espera. |

Relación de las previews con el build. No está registrada de forma explícita, así que la inferí. El padre de `9da76aa` es `f55d32c`, y su árbol de tema es idéntico al de `origin/lote-b` (0 rutas distintas, ZIP `eecf2f22…`). Después, el informe 010 sincronizó 5 rutas: `sections/main-product.liquid`, `assets/theme.js`, `sections/bento-discovery.liquid`, `locales/en.default.json` y `locales/es.json`. La punta solo difiere de `f55d32c` en esas 5 rutas más `assets/base.css`, que corresponde a H-1 del Lote C y no se sincronizó. Por tanto, las previews no reflejan H-1.

# 3. ZIP (C-R0-2), regenerado aquí

Entorno: Node 22.23.4, zlib `1.3.1-e00f703`. La revisión ZIP original usó zlib `1.3.2.1-motley`. Clon completo, no superficial.

| Revisión | Generaciones | SHA-256 | Huella de contenido | Archivos | Bytes |
|---|---|---|---|---|---|
| `fbdf462` (ficha) | 2, idénticas | `f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585` | `02bd3bc8d99c8c7ee1be8a87358139144bccbd0986d15525a43b49506ec9df34` | 93 | 287165 |
| `origin/lote0/base-09f8342` (`eb7cca7`), con `--expect-count 93 --expect-sha256 --expect-content-sha256` | 1 | igual, exit 0 | igual | 93 | 287165 |
| `origin/lote-b` (`a8ac15c`) | 2, idénticas | `eecf2f225b1dc7a3719d8efe7d65b212c9808ffe9522d5bbae76746d93b6d96c` (coincide con R-B) | `c20015b4…0cc02` | 94 | 287063 |
| punta `d9f76c2` | 2, idénticas | `c25adb4c9744f4151154b8ebfa6212c8eb3239c147a943b3cbd129ea7f9433fe` | `eb90b2cb0f9ef349dcf82fe9a7750bda9c19a4914bea9998c24c25d52f29b963` | 94 | 287404 |

El hash canónico D21 se reproduce también con otra zlib, lo que refuerza su reproducibilidad. El hash de la punta es solo informativo. No es el del candidato de envío: C-04-P todavía no ha retirado `templates/page.documentation.json` ni `templates/page.support.json`, y C-04-R no ha añadido versión ni notas. Frente a la base, la punta añade un solo archivo, `snippets/variant-no-js-select.liquid` (D25). En los tres ZIP el literal da 0.

# 4. Gate 5 y carrito

| Preset | Última corrida con JSON | Resultado | Carrito |
|---|---|---|---|
| Sartorial `190232297715` | Gate 5 `GATE5-DIAGNOSTIC-20261105T233916860Z-d5d1ed33…` | `passed`: 24 passed, 4 observed (`NO_ASSERTION_DEFINED`), 0 failed | `touched`, `cleanupAttempted`, `emptyVerified` y `noteEmptyVerified` en true |
| Imprint `190232330483` | Harness R-A/R-B `RA-RB-cart-20261106T112804500Z` (Gate 5 no se ejecutó en Imprint) | sesión Imprint pasada: alta, drawer, nota y limpieza | clear/update/read 200, `itemCount=0`, vacío y nota vacía verificados |
| Archive `190232363251` | Harness `RA-RB-cart-20261106T153117264Z` (Gate 5 no se ejecutó en Archive) | `completed/completed_with_limits`, 6/6 | clear/update/read 200, `itemCount=0`, vacío y nota vacía verificados; `interventionRequired=false` |

Gate 5 (`scripts/gate5-complete-verification.mjs`) solo estaba autorizado sobre Sartorial. Para Imprint y Archive, la verificación de carrito vacío viene del harness R-A/R-B. Las tres últimas sesiones de cada preset tienen JSON con resultado y carrito vacío verificado.

Incidentes de carrito huérfano:

| Incidente | Disposición registrada |
|---|---|
| Archive `RA-RB-cart-20261106T112804500Z` (429, estado final desconocido) | **LEAVE_TO_EXPIRE**, no bloqueante para Lote 0. Registrado por Johandry en el addendum D28, en `historicalIncidents` del JSON `T153117264Z` (`blocksLote0=false`), en STATUS y en los informes 014, 015 y 016. Correcto. |
| D28-I1, primera corrida gate5 del 2026-11-05, anterior a los JSON | "Se deja caducar; no se toca" (Johandry, `CLAUDE-DECISION-SESION-003.md`). Equivale a LEAVE_TO_EXPIRE, aunque no usa ese código. |
| Gate 5 Sartorial `T231955117Z` (`CART_CLEANUP_FAILED`, 429 en `/cart/update.js`, `emptyVerified=null`) | **Sin disposición explícita.** STATUS e informe 002 solo lo tratan como "antecedente superado" y dicen que el estado no se certifica. No consta como LEAVE_TO_EXPIRE ni como no bloqueante. Brecha documental: condición trasladable T-2. |

Filtro y allowlist (D28):
- El filtro de ruido de consola está documentado como lista exacta en `CLAUDE-DECISION-SESION-003.md` (ERR_TUNNEL fuera de la tienda y de cdn.shopify.com, y la barra de previews). Después lo sustituyó la clasificación por fuente (STATUS, líneas 85 a 91), donde una fuente positiva del tema siempre es `failure`.
- La allowlist está en el addendum D28: GET/HEAD solo a `tema-qkqpke0j.myshopify.com`, `cdn.shopify.com` y `fonts.shopifycdn.com`, revalidando cada redirección. POST solo a `/password` y a `/cart/add.js`, `/cart/update.js` y `/cart/clear.js` en `--cart`. Sin `/cart/change.js`.
- Contrasté el código de `harness-GPT-RA-RB-001/run.mjs` (SHA-256 `06b4e98e…a030f6`, 1052 líneas). `READ_HOSTS` contiene exactamente los tres hosts. Exige `https`, sin puerto ni credenciales. GET/HEAD se permiten solo en esos hosts. Los POST están limitados como dice D28. La excepción `PLAYWRIGHT_TIMEOUT` aplica solo a `https://cdn.shopify.com/shopifycloud/shop-js/`, y la barra de preview solo a `/shopifycloud/(storefront-)preview-bar`. `INVENTORY_HOSTS` solo clasifica muestras de inventario y no autoriza nada.
- Revisión: el addendum D28 registra `ACEPTADO` para el snapshot `8C07DC42…`. Los addenda posteriores (axe, drawer y 429) y el snapshot vigente `06B4E98E…` constan como revisados en STATUS y en los informes 014 y 015, pero no hay un documento de revisión que cite ese hash (P3-2).

# 5. R-A y R-B: hecho en tienda y brechas

Hecho en tienda, en previews no publicadas:
- R-A lectura `T112604093Z`: 132 checks = 96 passed, 0 failed, 36 observed, 0 not_run. Pasaron 18 `axe_smoke`, 18 `page_access`, 18 `keyboard_tab_smoke`, 18 `horizontal_overflow`, 9 `menu_viewport_cross`, 6 `language_visible_name_match` y 6 `empty_cart_drawer_keyboard_state`. Hubo 0 eventos fatales de routing. Los incompletos de axe (`color-contrast`, `aria-valid-attr-value`) no están confirmados.
- R-B smoke de carrito: en Sartorial e Imprint (`T112804500Z`) y Archive (`T153117264Z`) pasaron alta de una línea, drawer poblado a 390 y 1280, eco exacto de nota y limpieza verificada.
- Gate 5 Sartorial `passed`. Los 4 `observed` (toggles y subtotal) no tienen aserción y no cuentan como funcionalidad certificada.

Brechas, según la tabla del informe 016, que coincide con lo que muestran los JSON:
- R-A/A-03 y H-1: contraste por esquema, fondo, estado y reduce-motion. H-1 no está en las previews (base.css sin sincronizar).
- R-A/A-02: `circa_year` y `gsm` en producto textil y no textil, con dato respaldado y vacío. Depende de que Johandry apruebe los datos.
- R-A/C-08: claims, ausencias y destinos con fuentes aprobadas.
- R-A/A-01: depende de C-R0-4.
- R-B/B-01: matriz de editor y menú, y carrito desde el menú.
- R-B/B-02: sin JS, A→B, disponibilidad y URL.
- R-B/B-03: respuesta perdida y reconciliación en todas las superficies. `cart/change` no está autorizado.
- R-B/B-04: matriz completa de nota (limpia, sucia, oculta, pending, fallos, concurrencia, último artículo).
- R-B/B-05: cambio real de idioma, que necesita una decisión de Johandry sobre el POST de localización.
- Lighthouse R-D/G2: las decisiones de repeticiones y dimensiones las toma Johandry.

¿Bloquean el cierre del Lote 0? **No.** D19 limita el cierre a C-R0-1 a C-R0-4, y estas brechas son del alcance de R-A/R-B, no de la base. El plan V4.1 §5.2 dice que una dependencia abierta de preview o app "bloquea el cierre de A correspondiente, no se borra". D22 ya dejó las partes de tienda como "código completo" hasta la sesión con credenciales. Pasan como R-A/R-B abiertas (§8, T-5). Deben cerrarse antes de R-C/R-G y no se dan por aceptadas con el smoke.

# 6. Seguridad y git

Literal. Usé el método de los barridos previos (`CLAUDE-HANDOFF-CLOUD-002` §5 y `CLAUDE-REVIEW-LOTE-B-RB-001` §8): el literal se deriva en memoria comparando `09f8342` con la punta en los dos documentos CMP-01, en la posición de `[REDACTED_STOREFRONT_PASSWORD]`. Salió un solo candidato. "Contexto" significa que la misma línea contiene `pass|password|pwd|contrase|clave|secret|credential|STORE_PASSWORD|STOREFRONT_PASSWORD`.

| Ámbito | Resultado |
|---|---|
| Punta `origin/lote-d`, coincidencias en bruto | 46 en 28 archivos, igual que la base aceptada. Son falsos positivos ya aceptados (SVG y fixtures). |
| Punta: líneas con literal y contexto fuera de `tests/vendor/axe.min.js` | **0** (1 dentro de axe) |
| Lo mismo en `lote0/base-09f8342`, `lote-a`, `lote-b` y `lote-c` | 0 en todas |
| Líneas añadidas en `git diff 09f8342..origin/lote-d` y en `origin/lote-c..origin/lote-d` | 0 y 0 |
| ZIP de `fbdf462`, `lote-b` y punta | 0, 0 y 0 |
| Patrones de token o clave (`shpat_`, `shpca_`, `ghp_`, claves privadas, AKIA) en la punta y en el diff master..lote-d | 0 |

Ramas, según `git ls-remote`:
- `master` = `09f834295074402d9b93aa8ead83a732d78e6608`, sin cambios.
- `lote0/base-09f8342` = `eb7cca7`, `lote-a` = `1fee9e2`, `lote-b` = `a8ac15c`, `lote-c` = `8092028`, `lote-d` = `d9f76c2`.
- Cadena: `merge-base --is-ancestor` da éxito en master → lote0, lote0 → lote-a, lote-a → lote-b, lote-b → lote-c y lote-c → lote-d. Hay 0 merges en `master..lote-d` (51 commits). Es lineal.

Force-push. No encontré indicios. Todos los SHA que citan los documentos siguen siendo ancestros de su rama: `91f6e9f`, `bd779a0`, `fbdf462`, `ba97b5e`, `1c7aec0`, `8e1646e`, `fe736f7`, `3c9f701`, `1c2ddbb`, `47bea25`, `5f6e875`, `9fc1394`, `7ae23e8`, `748aad1`, `5888e96`, `c74a5b9` y `792742c`. Un clon anterior con `lote-d` en `9fc1394` avanzó a la punta por fast-forward. Límite: la API de actividad de GitHub (registro de force-push) no está disponible en esta sesión, así que la conclusión es indirecta.

Credenciales: ninguna rama lote-* contiene `.secrets`, `.env*`, `*.pem`, `*.key`, `*.p12`, `id_rsa`, `.npmrc`, `shopify.theme.toml` ni `.shopify/`. Tampoco se añadió ninguno en la historia `master..lote-d`.

# 7. Hallazgos menores (P3, no bloqueantes)

- **P3-1.** `.gitignore` ignora `.env`, `.env.*`, `*.local.json`, `*.cookies.json` y `temp-*`, pero no `.secrets`. Hoy no está rastreado y puede que lo cubra un exclude local de Johandry. Conviene añadir `.secrets/` para evitar un `git add -A` accidental.
- **P3-2.** El snapshot vigente del runner (`06B4E98E…`) y los addenda D28 de drawer y 429 no tienen un documento de revisión que cite el hash, como sí lo tiene el snapshot `8C07DC42…` en el addendum de hosts. Ahora solo constan en STATUS y en los informes 014 y 015.
- **P3-3.** STATUS sigue diciendo que el estado es 2026-11-05 y que "Lote 0 no cerrado". Hay que actualizarlo tras este dictamen.
- **P3-4.** Los informes GPT 009 a 016 dicen "revisión documental independiente pendiente". Esta revisión cubre su uso como evidencia del cierre del Lote 0. No los acepta en lo demás.

# 8. Veredicto

**APROBADO CON CONDICIONES TRASLADABLES.** El Lote 0 queda cerrado en el alcance de D19: C-R0-1, C-R0-2 y C-R0-3 cumplidas, y C-R0-4 pendiente de Johandry según D19 (c). No hay bloqueos.

Condiciones que se trasladan:

| # | Condición | Pasa a | Responsable |
|---|---|---|---|
| T-1 | Fixture de suscripción (C-R0-4). Solo bloquea A-01, su prueba en tienda y la parte A-01 de R-A. | Lote A (A-01 en tienda y R-A) | Johandry |
| T-2 | Registrar la disposición del carrito Gate 5 Sartorial `T231955117Z` (LEAVE_TO_EXPIRE u otra) y si bloquea, igual que se hizo con Archive. | Antes de la primera prueba en tienda del Lote C | Johandry (registro: Codex) |
| T-3 | Reconfirmar por Shopify CLI que `190232297715`, `190232330483` y `190232363251` siguen no publicadas antes de cualquier prueba en tienda (el preflight 015 falló). Registrar el build de las previews: árbol `f55d32c` (= lote-b) más las 5 rutas sincronizadas, sin H-1 de `assets/base.css`. Sincronizar o volver a subir antes de medir H-1 y A-03. | Precondición del Lote C y de las pruebas R-A/R-B | Codex y coordinador |
| T-4 | Hash del candidato final, regenerado dos veces tras C-04-P (retirar las plantillas de documentación) y C-04-R (versión y notas). `c25adb4c…` es solo de referencia de la punta actual. | Lote C (C-04-P y C-04-R), informe de cierre final | Codex; Johandry aprueba C-04-R |
| T-5 | Matrices de tienda R-A (A-02, A-03/H-1, C-08, A-01) y R-B (B-01 a B-05), con aceptación independiente. Deben cerrarse antes de R-C/R-G. | R-A/R-B abiertas, en sesión de tienda del Lote C y antes de R-G | Codex; revisor distinto; decisiones de Johandry en A-02, C-08 y B-05 |
| T-6 | Decisiones de Lighthouse R-D/G2 (repeticiones, dimensiones y umbral). | Lote C (C-03/G2) | Johandry |
| T-7 | P3-1 a P3-4 de §7. | Lote C, documental | Codex |

# 9. Afirmaciones falsables

1. `git ls-remote` da `refs/heads/lote-d` = `d9f76c21f338dd5c5b55870cc3f53370afe26253` y `refs/heads/master` = `09f834295074402d9b93aa8ead83a732d78e6608`.
2. `node scripts/package-theme-zip.mjs --rev fbdf462` da SHA-256 `f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585` y 93 archivos con zlib 1.3.1-e00f703, igual en dos ejecuciones.
3. El mismo script sobre `d9f76c2` da `c25adb4c9744f4151154b8ebfa6212c8eb3239c147a943b3cbd129ea7f9433fe` y 94 archivos, y sobre `origin/lote-b` da `eecf2f225b1dc7a3719d8efe7d65b212c9808ffe9522d5bbae76746d93b6d96c`.
4. Las 93 filas del manifiesto de `GEMINI-FICHA-LOTE-0-BASE-001.md` coinciden en bytes y SHA-256 con el ZIP de `fbdf462`.
5. En `RA-RB-cart-20261106T153117264Z…json`, la sesión Archive tiene `itemCount=0`, `emptyVerified=true`, `noteEmptyVerified=true` y `historicalIncidents[0].disposition=LEAVE_TO_EXPIRE`, con `blocksLote0=false`.
6. `GATE5-DIAGNOSTIC-20261105T231955117Z…json` tiene `cart.emptyVerified=null`, y ningún documento le asigna LEAVE_TO_EXPIRE.
7. `READ_HOSTS` en `run.mjs:23` contiene exactamente `tema-qkqpke0j.myshopify.com`, `cdn.shopify.com` y `fonts.shopifycdn.com`.
8. Hay 0 líneas con literal y contexto de credencial fuera de `tests/vendor/axe.min.js` en las cinco ramas lote-*, y 0 líneas añadidas con el literal en `09f8342..origin/lote-d`.
9. `git rev-list --merges --count origin/master..origin/lote-d` = 0, y cada rama de la cadena es ancestro de la siguiente.
10. Este informe no contiene el literal, ni contraseñas, ni tokens.
