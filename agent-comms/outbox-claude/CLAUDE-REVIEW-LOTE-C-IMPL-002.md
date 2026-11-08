# CLAUDE-REVIEW-LOTE-C-IMPL-002

Fecha: 2026-11-07
Revisor: Claude Opus 5.5, contexto limpio, solo lectura.
Escritor revisado: GPT/Codex.
Snapshot: rama `lote-c-impl`, punta `6e3bbb0de1de5489c0bd1930a81896f96f0c0b4b` (coincide con `git ls-remote`). Rango revisado `a0f8b3f..6e3bbb0`: commits `f8574ea`, `5ee7f4b`, `6e3bbb0`, 15 archivos, +518/-130.
Clon nuevo: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/r002`. Git solo en lectura. Sin commit, sin push, sin tienda, sin credenciales; no se abrió `.secrets`.
Revisión anterior: `CLAUDE-REVIEW-LOTE-C-IMPL-001.md`, SHA-256 `4904ce8116584d846c829280b529d26383ec7bac44fd570a5d6da5a275bd773e` (verificado sobre la copia del scratchpad).

## 0. Veredicto

**ACEPTADO CON CONDICIONES.** Las seis condiciones L-1 a L-6 están resueltas en el código de `6e3bbb0` y lo he comprobado por mi cuenta (Theme Check, arnés en navegador, hashes y lectura del diff). El cambio del runner DP-005 es correcto y más estricto que el anterior: probé 42 casos adversariales y ninguno deja pasar un error del tema. La línea base de las 18 celdas coincide con los JSON históricos. No quedan condiciones técnicas bloqueantes. Queda una de proceso: el dictamen 001 no está en la rama publicada (L-8), más lo que ya estaba pendiente en tienda (L-7).

| ID | Estado | Evidencia |
|---|---|---|
| L-1 | **Cerrada** | Theme Check 4.8.0 → `[]`, exit 0 (§1.1) |
| L-2 | **Cerrada (registro)** | `docs/decisions.md`, entrada 2026-11-07 «APROBADO por Johandry» (§1.6) |
| L-3 | **Cerrada** | `base.css:1411-1412`; estilo comprobado en navegador (§2, Parte 7) |
| L-4 | **Cerrada** | Aviso visible enlazado con `aria-describedby`; descripción AX en 33/33 enlaces (§2, Parte 7) |
| L-5 | **Cerrada** | SHA del informe = archivo versionado, `0885fd57…5446` (§1.5) |
| L-6 | **Cerrada** | «Loading variant…» con `aria-busy`, sin `id` y sticky replicada; «Unavailable» solo tras una respuesta nula (§2, Parte 6) |
| L-7 | Pendiente en tienda | Sin cambios respecto de la 001, §3 |
| L-8 | **Nueva, de proceso** | `CLAUDE-REVIEW-LOTE-C-IMPL-001.md` debe entrar en la rama (§5) |

## 1. Condiciones L-1 a L-6

### 1.1 L-1: Theme Check

- `npm ci --ignore-scripts` en el clon: exit 0. `node_modules/@shopify/cli/package.json` → `4.8.0`, la versión del lockfile.
- `shopify theme check --path <export git archive de 6e3bbb0> --output json` → `[]`, exit 0. Repetido con `--path .` sobre el clon: `[]`, exit 0.
- `npm run gates:sanity` (`theme-check-sanity.mjs`): exit 0. En la 001 fallaba porque la línea base no estaba limpia.
- También dan exit 0 `gates:json`, `gates:hooks`, `gates:locales`, `gates:ledger` y `gates:syntax`.
- Corrección revisada: `variant-no-js-select.liquid:15-92`. El JSON de la variante se captura en `variant_json` y el `<div data-variant-state>` y su `<script>` se abren y cierran dentro de una sola rama `response`. El modo `state` emite `variant_json` en el `else`. El contrato del JSON no cambia: las Partes 1 y 2 del arnés, que consumen los dos modos, siguen en verde.

Salidas: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h2/out/theme-check-6e3bbb0.json` y `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h2/out/theme-check-repo.json`.

### 1.2 L-3: estilo de la opción seleccionada

Hay una regla nueva en `base.css:1411-1412`: `a.variant-picker__label[aria-current]` comparte declaración con `.variant-picker__input:checked + .variant-picker__label`. En Chromium, con el `base.css` real, el seleccionado se pinta con fondo y borde `--color-button` y texto `--color-button-label`. El no seleccionado queda transparente con borde `--color-border`. Lo comprobé con JS activado y desactivado.

### 1.3 L-4: aviso de navegación

- `featured-product.liquid:128-130` crea `notice_id = FeaturedVariantNotice-<section.id>-<block.id>` y se lo pasa al snippet.
- El snippet (`:125-127`) pinta un `<p id>` visible con `products.product.variant_navigation_notice`, y cada enlace (`:145`) lo referencia con `aria-describedby`.
- Locales: `en.default.json` («Choosing an option opens the product page.») y `es.json` («Al elegir una opción se abre la ficha del producto.»). Son los dos únicos locales de storefront del tema.
- En navegador: aviso visible (1280×25,6 px, `display:block`, sin `hidden`), fuera de los `fieldset` y con un id único (0 ids duplicados). El árbol de accesibilidad de Chromium (CDP `Accessibility.getFullAXTree`) da a los 33 enlaces la descripción del aviso.
- Observación menor, no bloqueante: el aviso se repite como descripción en cada uno de los 33 enlaces y resulta verboso con lector de pantalla. Una alternativa sería `aria-describedby` en cada `fieldset`. Se puede decidir en Gate 5 con lector real.

### 1.4 L-6: estado de carga

`theme.js:1007-1038`. `updateForms` admite ahora `{ resolvingVariant }`, que por defecto vale `Boolean(this.variantRequest)`. Mientras hay una resolución en curso:

- el botón queda deshabilitado y muestra `data-variant-loading-text`, añadido en `main-product.liquid:201`;
- el botón lleva `aria-busy="true"`;
- el input `id` está desactivado.

`applyVariant` fuerza `resolvingVariant: false` (`:864`), porque se ejecuta antes de que `finally` limpie `variantRequest`. «Unavailable» solo aparece cuando la respuesta es `null`. Una compra en curso (`cartAddPending`) mantiene el botón deshabilitado y con `aria-busy`. Solo el `featured-product` carece del atributo de texto de carga, y nunca entra en la resolución por servidor (no tiene `data-variant-state-url`), así que no puede mostrar `undefined`.

### 1.5 L-5: SHA del arnés de GPT

| Archivo en `6e3bbb0` | SHA-256 del archivo | SHA en el informe de GPT |
|---|---|---|
| `harness-GPT-C07-VARIANTS-001/run.mjs` | `0885fd57c0b55589f8fc934e8a9d29421a092e78179ceddf6183232c8ad15446` | igual |
| `harness-GPT-C01-COLLECTION-001/capture.mjs` | `ce2dab82057f939d5f49d9b386fc4ff244336f829808276ff29cf7bc52f9d1eb` | igual |
| `harness-GPT-RD-001/run.mjs` | `1aaab33bf3830b8f4e82228199ebf46deb2a6f663b468553c65f0bc51554e34c` | igual (informe DP-005) |
| `harness-GPT-RD-001/network-policy.test.mjs` | `736ff933a9e9fe7050429c30a85efadaec023af23588528344433d875359e84b` | igual |
| `harness-GPT-RD-001/run.mjs` en `a0f8b3f` | `62191316247eaf31bd7004b7dac3d8f449bbc29c56717e36ea95a3774621668c` | igual («blob anterior») |

### 1.6 L-2: aprobación de Johandry

`docs/decisions.md`, sección «2026-11-07: Decisión C-07 para producto destacado con más de 250 variantes»: «**APROBADO por Johandry el 2026-11-07:** sustituir `variant-state` por navegación al PDP con `option_values`», con la nota de que es posterior a su corrección de la atribución. El informe de implementación de GPT cambia su estado en el mismo sentido. La condición pedía un registro escrito en `decisions.md`, y está. No puedo verificar la comunicación original de Johandry; doy por bueno el registro, hecho con su cuenta (autor de los commits).

## 2. Arnés (revisión 002)

Ruta: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h2/run.mjs` (SHA-256 `907fca4dee7479528ac750303cc41d024ecd8a756cf715b60eca109b609cda05`). Es el arnés de la 001 (`c7h/run.mjs`, `178007b2…9a9d`, sin modificar) con tres cambios:

- `data-variant-loading-text` en el marcado de la ficha, como en `main-product.liquid:201`;
- `notice_id` en el destacado;
- dos partes nuevas, 6 (L-6) y 7 (L-3/L-4). La Parte 7 carga el `base.css` real de `6e3bbb0`.

Fuentes copiadas con `git show 6e3bbb0:`: `c7h2/src/branch/{theme.js,variant-no-js-select.liquid,base.css}` (SHA-256 `9500af6d…7fa7`, `e1b2fa3e…7f81`, `1394c9a9…e0bc`). La base sigue siendo `258ca4f` (`theme.js` `11675802…7cfe`, idéntico al de `git show 258ca4f:assets/theme.js`). Playwright y Chromium preinstalados; no se instaló nada.

Salidas: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h2/out/stdout.txt`, `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h2/out/log.txt` y `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h2/out/results.json`. Exit 0.

Resultados de la rama `6e3bbb0`, todos PASS:

| Parte | Casos | JS on | JS off |
|---|---|---|---|
| 1 Carga inicial (1, 250, 255 variantes; dentro y fuera de 250, inexistente, `null`) | 7 × 2 | 7/7 | 7/7 |
| 2 Interacción en PDP de 255 (pos 252, inexistente, cuatro cambios rápidos) | 3 | 3/3 | n/a |
| 3 Destacado >250, enlaces GET, desde `/` y desde otro PDP, y flujos de navegación | 4 auditorías + 8 flujos | 6/6 | 6/6 |
| 4 URL incompleta | 2 | 1/1 | 1/1 |
| 5 `requestSubmit()` forzado | 2 | 2/2 | n/a |
| 6 (L-6) Estado durante la resolución | 3 | 3/3 | n/a |
| 7 (L-3, L-4) Estilo y aviso con `base.css` real | 2 | 1/1 | 1/1 |

Detalle de la Parte 6 (respuesta de Section Rendering retrasada 600-900 ms):

- Combinación existente (C12/S15, pos 251). Durante la carga: botón «Loading variant…», deshabilitado, `aria-busy=true`, sin `id` y `[data-variant-picker]` con `aria-busy`. La sticky replica texto, `disabled` y `aria-busy`. En ningún muestreo se ve «Unavailable». Al final: «Add to cart», habilitado, `aria-busy=false` e `id` 300251.
- Combinación inexistente (C2/S0). La misma carga, y al final «Unavailable», deshabilitado, `aria-busy=false` y sin `id`.
- Compra en curso y cambio de opción a la vez. El botón sigue deshabilitado y con `aria-busy=true` tras resolver. Cuando termina la compra, `updateForms(currentVariant)` lo deja en «Add to cart», habilitado, con `id` 300251.

La base `258ca4f` mantiene como control los cinco FAIL documentados en la 001 (H7-1, `null` y H7-2). Con eso se confirma que el arnés sigue detectando el defecto.

## 3. Runner DP-005 / G2

### 3.1 Lectura del cambio

`harness-GPT-RD-001/run.mjs`:

- Clasificador único. `recordNetworkEvent` (`:161`) lo usan los eventos CDP (`:644`), `requestfailed` (`:726`) y HTTP (`:740`).
- Falla primero todo lo que esté redactado, no sea HTTPS, lleve puerto explícito, sea un 429, un código desconocido o un asset del tema. `isThemeAsset` (`:125`) cubre `/cdn/shop/t/<n>/` en cualquier host y `/s/files/…/t/<n>/` en el CDN, ya sin IDs fijos.
- En el host exacto de la tienda solo quedan como aviso tres casos: el 404 de `/favicon.ico`, `CHROMIUM_ERR_ABORTED` o CDP `Aborted` en `/services/login_with_shop/authorize`, y las rutas `/cdn/fonts/` y `/cdn/shop/files/`. Lo demás falla.
- Fuera de la tienda, las rutas de autenticación fallan. `cdn.shopify.com` y `*.shopifycdn.com` (expresión anclada, exige subdominio) quedan como aviso. Cualquier otro host falla. Esto es **más estricto** que antes, cuando todo error de un host ajeno era aviso.
- La clave registrada es `host:pathname:código`, sin query ni fragmento (`safeSource` toma `url.pathname`).
- Bloqueos: `classifyBlockedHost` (`:179`) marca `theme_asset_blocked`, y `executionOutcome` (`:193`) lo hace fatal. Un CDN conocido bloqueado en 443 es `known_external_warning`. Puerto, `http`, rutas de autenticación y hosts ajenos dan `unclassified_blocked_host`, que deja el resultado incompleto.
- `allowedRead` y `READ_HOSTS` no cambian. `main()` ya no se ejecuta al importar el módulo (`:817`).

### 3.2 Pruebas

- `node --test network-policy.test.mjs` (de GPT): 9/9 PASS.
- Pruebas adversariales propias, sin red ni navegador: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h2/policy/adversarial.mjs` (SHA-256 `822842f3…2dda`), salida en `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/c7h2/out/policy-adversarial.txt`. **42/42 PASS.**
  - Fallan, como deben: asset del tema en la tienda con otro ID; `compiled_assets`; asset del tema en `cdn.shopify.com` y en un subdominio CDN; HTML de portada y PDP; `/cart.js`; Section Rendering abortado; favicon con 500, con error de transporte, con sufijo, con puerto raro o en un host ajeno; Shop Login con 404, con otro código o en un host ajeno; `/password` en el CDN; `shopifycdn.com` sin subdominio; `cdn.shopify.com.evil.example`; `evilshopifycdn.com`; analítica; 429; enum CDP desconocido.
  - Quedan como aviso: favicon 404; Shop Login abortado (incluso con query, que no aparece en la clave); CDN de plataforma; fuentes; `shopify-assets.shopifycdn.com`; `/cdn/fonts/` y `/cdn/shop/files/` de la tienda.
  - Bloqueos: asset del tema en el CDN o por POST → `theme_asset_blocked` → `executionResult=failed`.
  - Ninguna clave contiene `?`, `#` ni valores de query.

Conclusión: el filtro no deja pasar errores del tema.

Observación no bloqueante: los 404 en `/cdn/shop/files/` de la tienda pasan de fallo a aviso. Ahí viven las imágenes que el comerciante sube y que los presets usan en settings, así que un hero roto ya no detiene una corrida, aunque sí puede alterar el LCP medido. Johandry lo aprobó así de forma expresa. Recomiendo que el informe de cada corrida futura cuente estos avisos aparte.

### 3.3 Informe GPT-REPORT-DP-005-G2-001 y línea base

Comparé las tres corridas finales de `results/` (las 013234, 013738 y 014011):

- Los SHA-256 de los blobs coinciden con la tabla del informe (`19142931…`, `446dc2ed…`, `7a65d816…`).
- `git diff --exit-code 258ca4f 6e3bbb0 -- …/results` → 0: los ocho JSON históricos no se tocaron.
- Las 18 celdas están en estado `measured` y con `identityVerified=true`. Las puntuaciones coinciden con el informe y con `decisions.md`:

| Preset | Móvil H/C/P | Escritorio H/C/P | A11y | BP | SEO H/C/P |
|---|---|---|---|---|---|
| Sartorial | 88 / 83 / 82 | 100 / 100 / 100 | 97 ×6 | 96 ×6 | 92 / 100 / 100 |
| Imprint | 88 / 79 / 82 | 100 / 100 / 100 | 97 ×6 | 96 ×6 | 92 / 100 / 100 |
| Archive | 91 / 80 / 85 | 100 / 100 / 100 | 97 ×6 | 96 ×6 | 92 / 100 / 100 |

- Ninguna celda tiene `mobilePerformanceRisk=true`.
- Cada corrida tiene `executionResult=failed` y `blockedHostAttention=true`, con cinco bloqueos `unclassified_blocked_host` de `shopify-assets.shopifycdn.com`. Coincide con el informe.

Matiz: el informe dice que «se desconoce la causa de los fallos históricos». En realidad, en las tres corridas `networkFailures` contiene exactamente dos claves: `/favicon.ico:HTTP_404` y `/services/login_with_shop/authorize:CHROMIUM_ERR_ABORTED`. Son justo los dos eventos que DP-005 pasa a aviso. Con el clasificador nuevo, esas corridas habrían salido `completed`, porque los cinco bloqueos de CDN pasarían a `known_external_warning`. Lo que se desconoce es la causa raíz de esos eventos en la plataforma, no qué los provocó en el runner. Conviene precisar la frase; no es bloqueante.

## 4. Alcance, credenciales y sintaxis

- Alcance: los 15 archivos corresponden a L-1 a L-6 (tema, locales y `decisions.md`) y a DP-005 (runner, fixture, README e informes). `templates/` y `listings/` sin cambios. Los hunks de `theme.js` están en `updateForms` y `applyVariant`.
- Credenciales, contando sin imprimir sobre las 518 líneas añadidas: 0 tokens Shopify (`shp*_`, `atkn_`), 0 de GitHub, 0 `sk-`, 0 AWS, 0 claves PEM, 0 `Bearer`, 0 asignaciones literales de `api_key`, `secret`, `password` o `token`, y 0 asignaciones de las variables de entorno de CLI o storefront. Las cadenas hex largas son SHA (10 de 64 y 4 de 40). Hay una URL con userinfo en el fixture (`network-policy.test.mjs`): es un marcador sintético para comprobar que `allowedRead` rechaza credenciales en la URL. Ningún archivo del diff tiene nombre de secreto ni de `.env`. No pude comparar con el literal real de contraseña de D12 porque no abrí `.secrets`; GPT declara 0 coincidencias.
- `node --check` en los 280 archivos `.js` y `.mjs` versionados (excluido `tests/vendor`): 0 fallos. `git diff --check a0f8b3f..6e3bbb0`: limpio. Los dos JSON de locales parsean.

## 5. Dictamen 001 fuera de la rama (L-8)

- `git ls-tree -r 6e3bbb0` no contiene `CLAUDE-REVIEW-LOTE-C-IMPL-001.md` (solo `CLAUDE-REVIEW-LOTE-C-PROPUESTAS-001.md`).
- El ref `codex/claude-review-copy` y el commit `49c76e28…` no existen en el remoto (`git ls-remote`; `git cat-file` no encuentra el objeto).
- GPT lo justifica con D12, pero D12 (`CLAUDE-DECISION-AUTONOMIA-001.md`) solo exige que el literal de contraseña cuente 0 antes del push. No impide publicar un dictamen.

**Condición L-8 (proceso, antes de cerrar el Lote C):** añadir el dictamen a la rama en `agent-comms/outbox-claude/CLAUDE-REVIEW-LOTE-C-IMPL-001.md` con su SHA `4904ce81…773e`, y este 002 junto a él. Si el escaneo de D12 detecta algo en el texto, hay que redactar solo esa aparición, registrar el SHA nuevo y explicar el motivo. El dictamen no puede quedar fuera del historial.

## 6. Condiciones restantes

| ID | Tipo | Condición |
|---|---|---|
| L-7 | Pendiente en tienda | Lo marcado en la 001 §3 (C01-1, C01-6, C05-3 a C05-5, C07-3, C07-4, C07-7, C07-8), con fixtures R-D §3.5, y el aviso L-4 con lector real. |
| L-8 | Proceso | Dictamen 001 (y 002) dentro de `lote-c-impl` (§5). |
| Obs. | Recomendada | Precisar en el informe DP-005 la causa de los fallos históricos (§3.3); contar aparte los avisos de `/cdn/shop/files/` en corridas futuras (§3.2); valorar `aria-describedby` por grupo (§1.3). |

## 7. Afirmaciones falsables

1. `shopify theme check` 4.8.0 sobre `6e3bbb0` devuelve `[]` con exit 0.
2. Con `6e3bbb0`, JS activado y una resolución por servidor en curso, el botón principal y la sticky muestran «Loading variant…», `aria-busy="true"` y `disabled`, y `FormData` no tiene `id`.
3. El SHA-256 de `agent-comms/outbox-gpt/harness-GPT-C07-VARIANTS-001/run.mjs` en `6e3bbb0` es `0885fd57c0b55589f8fc934e8a9d29421a092e78179ceddf6183232c8ad15446`.
4. `classifyNetworkSource` clasifica como `failure` un HTTP 404 en `https://cdn.shopify.com/s/files/1/0123/4567/t/12/assets/theme.js`.
5. En las tres corridas G2 finales, `networkFailures` contiene solo `/favicon.ico:HTTP_404` y `/services/login_with_shop/authorize:CHROMIUM_ERR_ABORTED` del host de la tienda.
6. `git ls-tree -r 6e3bbb0` no contiene `CLAUDE-REVIEW-LOTE-C-IMPL-001.md`.
