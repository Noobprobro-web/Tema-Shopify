ID: CLAUDE-REPORT-0-05-P3-002
Estado: Entregado offline (v2, tras CLAUDE-REVIEW-0-05-P3-002 ACEPTADO CON CAMBIOS MENORES). Hallazgos 1 a 6 del revisor aplicados; P1-P5 y navegador falso ampliado ejecutados sin red. NO declara apto el arnés para evidencia de tienda.
Decisión requerida: Ninguna de Johandry. Revisión D11: CLAUDE-REVIEW-0-05-P3-002 (subagente Opus) + re-verificación. Si se acepta, commit de Claude en lote0/base-09f8342 (D7/D12). El arnés sigue NO apto como evidencia de tienda hasta ejecutarlo en tienda.
Resumen en 5 líneas:
1. Tras enviar la contraseña (y tras cada `page.goto` posterior) ambos scripts comprueban que la ruta no sea de bloqueo (`/(^|\/)(password|challenge)\/?$/`: cubre `/es/password`, `/password/` y `/challenge`) y que no quede `input[type="password"]`; si no, `GATE5_ACCESS: storefront password was not accepted.` y exit 1.
2. Si el campo de contraseña no es visible (modal de Sartorial), se pulsa el primer `[data-password-open], details:has(input[type="password"]) > summary` y se espera a que sea visible antes de `fill`.
3. El cuerpo posterior a `chromium.launch` va en `try/finally` con `browser.close().catch(() => {})`, sin cambiar mensajes ni códigos (testigo `browser-close` en las 20 ejecuciones falsas).
4. P1-P5 repetidos con hook y autoprueba: mismos resultados (26 casos exit 1 sin testigos; P4 exit 97 con solo `chromium-launch.witness`); conteos 0/0/0, literal 0 y ctx-check 0 fuera de axe.
5. Navegador falso con 10 modos x 2 scripts: locale-stuck, challenge, trailing, rejected, stuck y late-lock salen 1 con `GATE5_ACCESS`; modal-hidden concede y continúa; los originales de HEAD fallan en esos casos. No demuestra el comportamiento real de Shopify; la cookie `storefront_digest` queda pendiente (hallazgo extra 1).
Archivos tocados: `scripts/gate5-complete-verification.mjs` y `scripts/gate5-live-verify.mjs` (`git diff --numstat` frente a HEAD: `32 3` y `32 5`) y este informe (nuevo). Líneas exactas en §2. Hook, loader, stubs y runners en el scratchpad `.../scratchpad/p3b/`. Sin `git add`, commit, stash, checkout, reset ni push; no se tocó `BOARD.md`, `package-theme-zip.mjs` ni otros informes.
Desviaciones (Nivel 1):
- Nivel 1. Se editó también `gate5-live-verify.mjs`: tiene el mismo defecto (el original imprimía "Acceso concedido exitosamente." tras el submit sin verificar).
- Nivel 1. `.catch` de ambos: `/^GATE5_(CONFIG|ACCESS): /.test(err.message)` (mensaje fijo sin eco).
- Nivel 1. Para el `try/finally` sin re-indentar ~250 líneas, el cuerpo posterior al `launch` se movió a una función `runChecks(browser)` (los `browser.close()` finales existentes se mantienen; cerrar dos veces es inocuo por el `.catch`).
- Nivel 1. El stub del revisor (`review-gate5/stub-fake-review.mjs`) se copió a `p3b/stub-fake-v2.mjs` y se amplió (no se modificó el original): modos `modal-hidden` y `late-lock`; la navegación posterior lanza `FAKE_STUB_STOP` en vez de `process.exit(96)` para que corra el `finally`.
Hallazgos extra fuera de alcance (con parche listo):
1. Cookie `storefront_digest`: NO se añadió (no verificada). Pendiente de confirmar en la primera ejecución real si, tras un desbloqueo correcto, el contexto contiene esa cookie. Parche listo (no aplicado): tras `assertUnlocked(page)`, solo si `wasPrompted`, `if (!(await context.cookies()).some(c => c.name === 'storefront_digest')) throw new Error(ACCESS_DENIED);` (requiere pasar `context` o leerlo de `page.context()`).
2. El abridor `[data-password-open]` está verificado en el tema (§2); `details:has(...) > summary` es una alternativa genérica no presente en Sartorial. Si ninguno existe, el script llama a `fill` y falla por tiempo de espera (cierra el navegador y sale 1 con mensaje genérico), no concede acceso.
3. `nonav` (el submit no navega y `waitForNavigation` expira): sale 1 con el mensaje genérico `Gate 5 verification failed.`, no con `GATE5_ACCESS`. Es fail-closed; informativo.
4. Siguen vigentes los hallazgos de 001 (`scripts/capture-presets.mjs` con tienda fija, literal en la historia `09f8342`, política CRLF/LF).
Verificación: §3 a §8 (comandos y salidas literales). Demuestran, sin red: sintaxis; validación antes de cualquier navegador; la lógica de decisión y de apertura del modal; `browser.close()` en todas las salidas posteriores al launch; control negativo de HEAD. No demuestran: el comportamiento real de Shopify (URL y cookies tras contraseña correcta/incorrecta, página de challenge, visibilidad real del modal), los selectores del resto del arnés, ni los nombres de variable (C3).
Lista de afirmaciones falsables numeradas:
1. `node --check` sale 0 con 0 líneas `SyntaxError` en ambos scripts.
2. `git diff --numstat` frente a HEAD: `32 3` (complete) y `32 5` (live).
3. Autoprueba: chromium 97 (`chromium-launch.witness`), fetch 98 (`fetch.witness`), https 99 (`http-request.witness`).
4. 26 casos P2/P3: exit 1, sin testigos, un único `GATE5_CONFIG`, sin eco `badmarker-*`; 2 casos P4: exit 97 con solo `chromium-launch.witness`.
5. Navegador falso, ambos scripts: `rejected`, `stuck`, `locale-stuck`, `challenge`, `trailing` y `late-lock` imprimen `GATE5_ACCESS: storefront password was not accepted.`, salen 1 y, salvo `late-lock`, 0 líneas "concedido" y sin `post-access-goto.witness`; `late-lock` imprime "concedido" una vez (se desbloqueó en el submit) y lanza `GATE5_ACCESS` en la primera navegación posterior.
6. `modal-hidden`: crea `opener-click.witness` y `fill.witness`, no crea `fill-on-hidden.witness`, imprime "concedido" y continúa (`post-access-goto.witness`).
7. `unlocked` y `noprompt` continúan (`post-access-goto.witness`); `noprompt` imprime el mensaje de "no solicitó contraseña" y 0 "concedido".
8. `browser-close.witness` existe en las 20 ejecuciones falsas (éxito del acceso y `GATE5_ACCESS`).
9. Control negativo con los scripts de HEAD (`git show HEAD:...`): en `locale-stuck`, `challenge`, `trailing` y `late-lock` imprimen "concedido" y continúan (0 `GATE5_ACCESS`); en `modal-hidden` no llegan a conceder (fill sobre campo oculto).
10. `STOREFRONT_PASSWORD *||` = 0, `REDACTED` = 0, `tema-qkqpke0j|166186909939|cashmere-rib-crew|https://` = 0 en ambos; línea 5 de ambos intacta; `page.goto(` = 3 con `preview_theme_id=${THEME_ID}` = 3 en ambos.
11. Literal: 0 en los dos scripts, en 001 y en este informe (§7); `ctx-check.py`: 0 fuera de `tests/vendor/axe.min.js`.
12. Ninguna contraseña real definida o usada, `.secrets` no leído, ninguna tienda contactada.

# 1. Documentos usados

`CLAUDE-REVIEW-0-05-P3-002` (hallazgos 1-6, indicaciones del coordinador); `sections/main-password.liquid:101-141`, `assets/base.css:6572-6574`, `assets/theme.js:4711-4730`; informe 001 (Anexo A); stub del revisor `scratchpad/review-gate5/stub-fake-review.mjs` (copiado, no modificado). HEAD `8e1646e`, rama `lote0/base-09f8342`. Todas las ejecuciones de gate5: `env -i PATH="$PATH" HOME="$HOME" WITNESS_DIR=<nuevo> <variables ficticias> node --import <hook> <script>`.

# 2. Cambios con líneas exactas

Modal en el tema: `sections/main-password.liquid:101-141` pone el `input type="password"` dentro de `[data-password-panel]` del overlay; `assets/base.css:6572-6574` define `.js password-modal:not([data-open]) .password-modal__overlay { display: none; }`; `assets/theme.js:4711-4730` (`PasswordModal`) abre con `click` en `[data-password-open]`. Por eso el campo existe en el DOM (`count() > 0`) pero no es visible hasta pulsar el abridor, y `fill()` agotaría el tiempo. Tras un envío rechazado el campo sigue en el DOM, lo que detecta la comprobación `count()`.

| Cambio | `complete-verification.mjs` | `live-verify.mjs` |
|---|---|---|
| Patrón y helper de ruta de bloqueo (`LOCKED_PATH`, `ACCESS_DENIED`, `assertUnlocked`) | 45-49 | 45-49 |
| `try { return await runChecks(browser); } finally { await browser.close().catch(() => {}); }` y `async function runChecks(browser)` | 60-67 | 61-68 |
| Abridor del modal antes de `fill` | 97-105 | 92-100 |
| Comprobación tras el submit (`assertUnlocked` + `count()`) | 111-112 | 106-107 |
| Mensaje de éxito veraz (`wasPrompted`) | 113-115 | 108-110 |
| `assertUnlocked(page)` tras el `goto` de colección y de producto | 120 y 155 | 125 y 169 |
| `.catch` acepta `GATE5_CONFIG` y `GATE5_ACCESS` | 364 | 347 |

Hallazgo 2: ruta de bloqueo en el submit y en los gotos posteriores. Hallazgo 3: `try/finally`. Hallazgo 4: abridor del modal. La línea 5 de ambos sigue siendo `const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD;` y el primer `page.goto` sigue después de `validateConfiguration()` y de `import('playwright')`: C1 y C2 se mantienen. La cookie `storefront_digest` no se comprobó (hallazgo extra 1).

# 3. P1 Sintaxis
```
scripts/gate5-live-verify.mjs exit=0 SyntaxError_lines=0
scripts/gate5-complete-verification.mjs exit=0 SyntaxError_lines=0
```

# 4. Autoprueba del hook
```
selftest=chromium exit=97 salida=[NO_NET_STUB: chromium.launch bloqueado] testigos=[chromium-launch.witness ]
selftest=fetch exit=98 salida=[NO_NET_STUB: fetch bloqueado] testigos=[fetch.witness ]
selftest=http exit=99 salida=[NO_NET_STUB: https.request bloqueado] testigos=[http-request.witness ]
```

# 5. P2, P3 y P4 (28 casos, `runner.sh`, hook activo)

Resultado agregado (`uniq -c` de las 28 ejecuciones: exit | testigos | eco | SyntaxError/MODULE_NOT_FOUND):
```
     14  exit=1 | [] | NA | bad=0
     12  exit=1 | [] | no-eco | bad=0
      2  exit=97 | [chromium-launch.witness ] | NA | bad=0
```
Salidas únicas (`uniq -c`):
```
      1   | ======================================================================
      1   | ===========================================================================
      2   | GATE5_CONFIG: STOREFRONT_COLLECTION_PATH is required.
      2   | GATE5_CONFIG: STOREFRONT_COLLECTION_PATH must be a canonical /collections/ path without query or fragment.
      2   | GATE5_CONFIG: STOREFRONT_ORIGIN is required.
      6   | GATE5_CONFIG: STOREFRONT_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.
      6   | GATE5_CONFIG: STOREFRONT_PASSWORD is required.
      2   | GATE5_CONFIG: STOREFRONT_PRODUCT_PATH is required.
      2   | GATE5_CONFIG: STOREFRONT_PRODUCT_PATH must be a canonical /products/ path without query or fragment.
      2   | GATE5_CONFIG: STOREFRONT_THEME_ID is required.
      2   | GATE5_CONFIG: STOREFRONT_THEME_ID must be a positive decimal ID.
```
Idéntico a 001. Salida íntegra por caso: `.../p3b/runner-out2.txt`.

# 6. Navegador falso v2 (sin red; salida literal íntegra)

Comando: `bash .../p3b/fake-run2.sh .../p3b/fake2-out.txt` (hook no-net activo; `STUB_FILE=./stub-fake-v2.mjs`; `FAKE_MODE=<modo>`; variables ficticias; `WITNESS_DIR` nuevo por ejecución). Modos: `unlocked`, `rejected`, `noprompt`, `stuck`, `locale-stuck` (`/es/password` sin formulario), `challenge` (`/challenge`), `trailing` (`/password/`), `nonav` (el submit no navega), `modal-hidden` (campo oculto hasta pulsar `[data-password-open]`), `late-lock` (se desbloquea en el submit y la primera navegación posterior cae en `/es/password`). `browser-close.witness` lo crea `browser.close()`.

Tabla (ambos scripts dan el mismo resultado):

| Modo | Exit | `GATE5_ACCESS` | "concedido" | Continúa (`post-access-goto`) | `browser-close` | Esperado |
|---|---:|---:|---:|---|---|---|
| unlocked | 1 (stub detiene) | 0 | 1 | sí | sí | concede y continúa |
| rejected | 1 | 1 | 0 | no | sí | falla cerrado |
| noprompt | 1 (stub detiene) | 0 | 0 (mensaje de "no solicitó") | sí | sí | continúa |
| stuck | 1 | 1 | 0 | no | sí | falla cerrado |
| locale-stuck | 1 | 1 | 0 | no | sí | falla cerrado |
| challenge | 1 | 1 | 0 | no | sí | falla cerrado |
| trailing | 1 | 1 | 0 | no | sí | falla cerrado |
| nonav | 1 | 0 (mensaje genérico) | 0 | no | sí | fail-closed genérico |
| modal-hidden | 1 (stub detiene) | 0 | 1 | sí (`opener-click`, sin `fill-on-hidden`) | sí | concede y continúa |
| late-lock | 1 | 1 | 1 | sí (1ª navegación) | sí | `GATE5_ACCESS` en el goto posterior |

El exit 1 de los modos que continúan es el `FAKE_STUB_STOP` del stub tras la primera navegación posterior (salida genérica `Gate 5 verification failed.`), no un fallo del script; `post-access-goto.witness` prueba que se llegó. Salida literal íntegra (`fake2-out.txt`, 194 líneas, no vacío):
```
scripts/gate5-complete-verification.mjs | modo=unlocked | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
  | ===========================================================================
  | COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
  | Theme ID: 900700500 (Sartorial)
  | ===========================================================================
  | 
  | [1/4] Autenticación Storefront (/password)...
  |   ✓ Acceso al storefront concedido
  | 
  | [2/4] Verificación PLP (Main Collection): Grid/List Switcher...
  | Gate 5 verification failed.
scripts/gate5-complete-verification.mjs | modo=rejected | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ===========================================================================
  | COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
  | Theme ID: 900700500 (Sartorial)
  | ===========================================================================
  | 
  | [1/4] Autenticación Storefront (/password)...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-complete-verification.mjs | modo=noprompt | exit=1 | testigos=[browser-close.witness fake-launch.witness post-access-goto.witness ] | concedido=0 | no_solicito=1 | GATE5_ACCESS=0 | eco_password=0
  | ===========================================================================
  | COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
  | Theme ID: 900700500 (Sartorial)
  | ===========================================================================
  | 
  | [1/4] Autenticación Storefront (/password)...
  |   ✓ La tienda no solicitó contraseña; acceso sin bloqueo
  | 
  | [2/4] Verificación PLP (Main Collection): Grid/List Switcher...
  | Gate 5 verification failed.
scripts/gate5-complete-verification.mjs | modo=stuck | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ===========================================================================
  | COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
  | Theme ID: 900700500 (Sartorial)
  | ===========================================================================
  | 
  | [1/4] Autenticación Storefront (/password)...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-complete-verification.mjs | modo=locale-stuck | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ===========================================================================
  | COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
  | Theme ID: 900700500 (Sartorial)
  | ===========================================================================
  | 
  | [1/4] Autenticación Storefront (/password)...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-complete-verification.mjs | modo=challenge | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ===========================================================================
  | COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
  | Theme ID: 900700500 (Sartorial)
  | ===========================================================================
  | 
  | [1/4] Autenticación Storefront (/password)...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-complete-verification.mjs | modo=trailing | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ===========================================================================
  | COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
  | Theme ID: 900700500 (Sartorial)
  | ===========================================================================
  | 
  | [1/4] Autenticación Storefront (/password)...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-complete-verification.mjs | modo=nonav | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
  | ===========================================================================
  | COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
  | Theme ID: 900700500 (Sartorial)
  | ===========================================================================
  | 
  | [1/4] Autenticación Storefront (/password)...
  | Gate 5 verification failed.
scripts/gate5-complete-verification.mjs | modo=modal-hidden | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness opener-click.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
  | ===========================================================================
  | COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
  | Theme ID: 900700500 (Sartorial)
  | ===========================================================================
  | 
  | [1/4] Autenticación Storefront (/password)...
  |   ✓ Acceso al storefront concedido
  | 
  | [2/4] Verificación PLP (Main Collection): Grid/List Switcher...
  | Gate 5 verification failed.
scripts/gate5-complete-verification.mjs | modo=late-lock | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness late-lock-landed.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ===========================================================================
  | COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
  | Theme ID: 900700500 (Sartorial)
  | ===========================================================================
  | 
  | [1/4] Autenticación Storefront (/password)...
  |   ✓ Acceso al storefront concedido
  | 
  | [2/4] Verificación PLP (Main Collection): Grid/List Switcher...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-live-verify.mjs | modo=unlocked | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
  | ======================================================================
  | GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
  | Tienda: https://example-dummy.invalid
  | Tema ID: 900700500 (Sartorial)
  | ======================================================================
  | 
  | [Paso 1] Desbloqueando tienda mediante /password...
  |   -> Acceso concedido exitosamente.
  | 
  | [Paso 2] Verificando PLP (Main Collection): Switch List View / Grid View...
  | Gate 5 verification failed.
scripts/gate5-live-verify.mjs | modo=rejected | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ======================================================================
  | GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
  | Tienda: https://example-dummy.invalid
  | Tema ID: 900700500 (Sartorial)
  | ======================================================================
  | 
  | [Paso 1] Desbloqueando tienda mediante /password...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-live-verify.mjs | modo=noprompt | exit=1 | testigos=[browser-close.witness fake-launch.witness post-access-goto.witness ] | concedido=0 | no_solicito=1 | GATE5_ACCESS=0 | eco_password=0
  | ======================================================================
  | GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
  | Tienda: https://example-dummy.invalid
  | Tema ID: 900700500 (Sartorial)
  | ======================================================================
  | 
  | [Paso 1] Desbloqueando tienda mediante /password...
  |   -> La tienda no solicitó contraseña o ya estaba desbloqueada.
  | 
  | [Paso 2] Verificando PLP (Main Collection): Switch List View / Grid View...
  | Gate 5 verification failed.
scripts/gate5-live-verify.mjs | modo=stuck | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ======================================================================
  | GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
  | Tienda: https://example-dummy.invalid
  | Tema ID: 900700500 (Sartorial)
  | ======================================================================
  | 
  | [Paso 1] Desbloqueando tienda mediante /password...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-live-verify.mjs | modo=locale-stuck | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ======================================================================
  | GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
  | Tienda: https://example-dummy.invalid
  | Tema ID: 900700500 (Sartorial)
  | ======================================================================
  | 
  | [Paso 1] Desbloqueando tienda mediante /password...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-live-verify.mjs | modo=challenge | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ======================================================================
  | GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
  | Tienda: https://example-dummy.invalid
  | Tema ID: 900700500 (Sartorial)
  | ======================================================================
  | 
  | [Paso 1] Desbloqueando tienda mediante /password...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-live-verify.mjs | modo=trailing | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ======================================================================
  | GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
  | Tienda: https://example-dummy.invalid
  | Tema ID: 900700500 (Sartorial)
  | ======================================================================
  | 
  | [Paso 1] Desbloqueando tienda mediante /password...
  | GATE5_ACCESS: storefront password was not accepted.
scripts/gate5-live-verify.mjs | modo=nonav | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
  | ======================================================================
  | GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
  | Tienda: https://example-dummy.invalid
  | Tema ID: 900700500 (Sartorial)
  | ======================================================================
  | 
  | [Paso 1] Desbloqueando tienda mediante /password...
  | Gate 5 verification failed.
scripts/gate5-live-verify.mjs | modo=modal-hidden | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness opener-click.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
  | ======================================================================
  | GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
  | Tienda: https://example-dummy.invalid
  | Tema ID: 900700500 (Sartorial)
  | ======================================================================
  | 
  | [Paso 1] Desbloqueando tienda mediante /password...
  |   -> Acceso concedido exitosamente.
  | 
  | [Paso 2] Verificando PLP (Main Collection): Switch List View / Grid View...
  | Gate 5 verification failed.
scripts/gate5-live-verify.mjs | modo=late-lock | exit=1 | testigos=[browser-close.witness fake-launch.witness fill.witness late-lock-landed.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=1 | eco_password=0
  | ======================================================================
  | GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
  | Tienda: https://example-dummy.invalid
  | Tema ID: 900700500 (Sartorial)
  | ======================================================================
  | 
  | [Paso 1] Desbloqueando tienda mediante /password...
  |   -> Acceso concedido exitosamente.
  | 
  | [Paso 2] Verificando PLP (Main Collection): Switch List View / Grid View...
  | GATE5_ACCESS: storefront password was not accepted.
```

Control negativo (scripts de HEAD con el mismo stub; cabeceras de `fake2-orig.txt`):
```
.../p3b/orig-gate5-complete-verification.mjs | modo=unlocked | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-complete-verification.mjs | modo=rejected | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-complete-verification.mjs | modo=noprompt | exit=1 | testigos=[fake-launch.witness post-access-goto.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-complete-verification.mjs | modo=stuck | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-complete-verification.mjs | modo=locale-stuck | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-complete-verification.mjs | modo=challenge | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-complete-verification.mjs | modo=trailing | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-complete-verification.mjs | modo=nonav | exit=1 | testigos=[fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-complete-verification.mjs | modo=modal-hidden | exit=1 | testigos=[fake-launch.witness fill-on-hidden.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-complete-verification.mjs | modo=late-lock | exit=1 | testigos=[fake-launch.witness fill.witness late-lock-landed.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-live-verify.mjs | modo=unlocked | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-live-verify.mjs | modo=rejected | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-live-verify.mjs | modo=noprompt | exit=1 | testigos=[fake-launch.witness post-access-goto.witness ] | concedido=0 | no_solicito=1 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-live-verify.mjs | modo=stuck | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-live-verify.mjs | modo=locale-stuck | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-live-verify.mjs | modo=challenge | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-live-verify.mjs | modo=trailing | exit=1 | testigos=[fake-launch.witness fill.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-live-verify.mjs | modo=nonav | exit=1 | testigos=[fake-launch.witness fill.witness submit.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-live-verify.mjs | modo=modal-hidden | exit=1 | testigos=[fake-launch.witness fill-on-hidden.witness ] | concedido=0 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
.../p3b/orig-gate5-live-verify.mjs | modo=late-lock | exit=1 | testigos=[fake-launch.witness fill.witness late-lock-landed.witness post-access-goto.witness submit.witness ] | concedido=1 | no_solicito=0 | GATE5_ACCESS=0 | eco_password=0
```
Los originales conceden en `locale-stuck`, `challenge`, `trailing` y `late-lock` (`concedido=1`, `GATE5_ACCESS=0`) y en `modal-hidden` no llegan a conceder (`fill` sobre campo oculto).

Demuestra: la lógica de decisión (patrón de ruta y formulario), la apertura del modal, el cierre del navegador y la ausencia de eco de la contraseña ficticia (`eco_password=0` en las 20). No demuestra: Shopify real (URL, cookies, redirecciones, challenge, visibilidad real), ni nada posterior a la primera navegación.

# 7. P5 conteos y compuertas
```
live:     'STOREFRONT_PASSWORD *||'=0 REDACTED=0 'tema-qkqpke0j|166186909939|cashmere-rib-crew|https://'=0 goto=3 goto_preview=3 L5=const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD;
complete: 'STOREFRONT_PASSWORD *||'=0 REDACTED=0 'tema-qkqpke0j|166186909939|cashmere-rib-crew|https://'=0 goto=3 goto_preview=3 L5=const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD;
```
Literal (`count-two.py`, copia nueva, solo `ruta=N`, ejecutado sobre este informe ya escrito):
```
agent-comms/outbox-claude/CLAUDE-REPORT-0-05-P3-002.md=0
scripts/gate5-live-verify.mjs=0
scripts/gate5-complete-verification.mjs=0
agent-comms/outbox-claude/CLAUDE-REPORT-0-05-P3-001.md=0
```
`ctx-check.py`: `total_lineas_literal_contexto= 1`, `fuera_de_tests_vendor_axe= 0`. `git diff --numstat -- scripts/`: `32 3 scripts/gate5-complete-verification.mjs`, `32 5 scripts/gate5-live-verify.mjs`.

# 8. Cero tiendas y limitaciones

No se definió ningún `STOREFRONT_PASSWORD` real, no se leyó `.secrets`, no se ejecutó `shopify theme`; ningún gate5 corrió sin hook ni sin `env -i`; el navegador es un objeto en memoria. El `fetch` de los scripts va dentro de `page.evaluate` (navegador); el testigo de `fetch` solo cubre Node. El arnés NO se declara apto para evidencia de tienda: falta ejecutarlo en la tienda de desarrollo con catálogo demo y confirmar la cookie `storefront_digest`, la redirección de `/password` y el comportamiento real del modal.

# Anexo A. Archivos del scratchpad `.../scratchpad/p3b/`

`no-net-hook.mjs`, `selftest-*.mjs`, `stub-playwright.mjs` y `runner.sh`: copia de A.1, A.3, A.4 y A.5 de `CLAUDE-REPORT-0-05-P3-001.md` (runner con `SCR=.../p3b`). Nuevos o cambiados:

## A.1 `no-net-loader.mjs`
```js
import { pathToFileURL } from 'node:url';
// STUB_FILE (opcional) elige el stub; por defecto el stub que aborta en chromium.launch.
const STUB = pathToFileURL(new URL(process.env.STUB_FILE || './stub-playwright.mjs', import.meta.url).pathname).href;
const BLOCKED = new Set(['playwright', 'playwright-core', '@playwright/test']);
export async function resolve(specifier, context, nextResolve) {
  if (BLOCKED.has(specifier)) return { url: STUB, shortCircuit: true };
  return nextResolve(specifier, context);
}
```
## A.2 `stub-fake-v2.mjs` (copia ampliada de `review-gate5/stub-fake-review.mjs`)
```js
// Navegador falso del revisor (sin red). FAKE_MODE:
// unlocked | rejected | noprompt | stuck | locale-stuck | challenge | trailing | nonav
// + v2: modal-hidden (campo oculto hasta pulsar [data-password-open]) | late-lock (desbloquea y la 1a navegacion posterior cae en /es/password)
// v2: la navegacion posterior ya no hace process.exit: lanza FAKE_STUB_STOP para que se ejecute el finally (testigo browser-close)
import { writeFileSync } from 'node:fs';
const MODE = process.env.FAKE_MODE;
const ORIGIN = process.env.STOREFRONT_ORIGIN;
const mark = (n, t) => { try { writeFileSync(`${process.env.WITNESS_DIR}/${n}.witness`, t + '\n'); } catch {} };
function launch() {
  mark('fake-launch', 'launch');
  let url = 'about:blank', hasInput = false, navResolve = null, visible = true;
  const after = {
    unlocked: ['/', false], rejected: ['/password', true], stuck: ['/password', false],
    'locale-stuck': ['/es/password', false], challenge: ['/challenge', false],
    trailing: ['/password/', false],
    'modal-hidden': ['/', false], 'late-lock': ['/', false]
  };
  const page = {
    on() {},
    url: () => url,
    async goto(u) {
      const p = new URL(u).pathname;
      if (p === '/password') {
        if (MODE === 'noprompt') { url = ORIGIN + '/'; hasInput = false; }
        else { url = u; hasInput = true; visible = MODE !== 'modal-hidden'; }
      } else {
        mark('post-access-goto', 'goto');
        if (MODE === 'late-lock') { url = ORIGIN + '/es/password'; mark('late-lock-landed', 'x'); return; }
        throw new Error('FAKE_STUB_STOP');
      }
    },
    locator(sel) {
      const isPwd = sel === 'input[type="password"]';
      const isOpener = sel.includes('data-password-open');
      const loc = {
        async count() { return isPwd ? (hasInput ? 1 : 0) : isOpener ? (MODE === 'modal-hidden' ? 1 : 0) : 0; },
        async fill() {
          if (!visible) { mark('fill-on-hidden', 'x'); throw new Error('FAKE_STUB: fill timeout on hidden field'); }
          mark('fill', 'fill');
        },
        first() { return loc; },
        async isVisible() { return isPwd ? (hasInput && visible) : false; },
        async click() { if (isOpener) { visible = true; mark('opener-click', 'click'); } },
        async waitFor() { if (isPwd && !visible) throw new Error('FAKE_STUB: waitFor timeout'); }
      };
      return loc;
    },
    keyboard: { async press() {
      mark('submit', 'enter');
      if (MODE === 'nonav') return; // no navigation: waitForNavigation must time out
      const [p, inp] = after[MODE]; url = ORIGIN + p; hasInput = inp;
      if (navResolve) navResolve();
    } },
    waitForNavigation() {
      if (MODE === 'nonav') return new Promise((_, rej) => setTimeout(() => rej(new Error('page.waitForNavigation: Timeout 30000ms exceeded.')), 50));
      return new Promise(res => { navResolve = res; });
    },
    async waitForTimeout() {}
  };
  return Promise.resolve({
    newContext: async () => ({ newPage: async () => page }),
    close: async () => { mark('browser-close', 'close'); }
  });
}
export const chromium = { launch };
export default { chromium };
```
## A.3 `fake-run2.sh`
```bash
#!/bin/bash
# Navegador falso v2 (sin red). Uso: fake-run2.sh <outfile> [dir-scripts-prefix]
SCR=/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/p3b
cd /home/user/Tema-Shopify
OUT=$1; shift; SCRIPTS=${@:-"scripts/gate5-complete-verification.mjs scripts/gate5-live-verify.mjs"}
: > "$OUT"
for s in $SCRIPTS; do
  for mode in unlocked rejected noprompt stuck locale-stuck challenge trailing nonav modal-hidden late-lock; do
    W=$(mktemp -d "$SCR/w-XXXXXX")
    o=$(env -i PATH="$PATH" HOME="$HOME" WITNESS_DIR="$W" STUB_FILE=./stub-fake-v2.mjs FAKE_MODE=$mode \
      STOREFRONT_ORIGIN=https://example-dummy.invalid STOREFRONT_THEME_ID=900700500 STOREFRONT_COLLECTION_PATH=/collections/dummy \
      STOREFRONT_PRODUCT_PATH=/products/dummy STOREFRONT_PASSWORD=dummy-not-a-password \
      node --import "$SCR/no-net-hook.mjs" "$s" 2>&1); rc=$?
    wit=$(ls -A "$W" | tr '\n' ' ')
    conc=$(echo "$o" | grep -c -E 'Acceso al storefront concedido|Acceso concedido exitosamente')
    nopr=$(echo "$o" | grep -c -E 'no solicit')
    acc=$(echo "$o" | grep -c 'GATE5_ACCESS: storefront password was not accepted.')
    eco=$(echo "$o" | grep -cF -- dummy-not-a-password)
    echo "$s | modo=$mode | exit=$rc | testigos=[$wit] | concedido=$conc | no_solicito=$nopr | GATE5_ACCESS=$acc | eco_password=$eco"
    echo "$o" | sed 's/^/  | /'
  done
done >> "$OUT"
```
