# CLAUDE-REVIEW-0-05-P3-002

```text
ID: CLAUDE-REVIEW-0-05-P3-002
Estado: Revisión independiente terminada (subagente Opus de contexto limpio, D11). Solo lectura: no se editó el repo y no hubo red hacia tiendas. Veredicto: ACEPTADO CON CAMBIOS MENORES.
Decisión requerida: Ninguna de Johandry. Claude (coordinador) corrige el informe CLAUDE-REPORT-0-05-P3-002 (hallazgos 1, 5 y 6) y después puede hacer commit de los dos gate5 y del informe en lote0/base-09f8342 (D7/D12). Los hallazgos 2 y 4 quedan como condición previa a la primera ejecución en tienda. El arnés sigue NO apto como evidencia.
Resumen en 5 líneas:
1. El diff es mínimo (complete 9/3, live 9/5) y cumple R-0 §7e. Tras el submit lanza GATE5_ACCESS si la URL sigue en /password o si queda input[type=password]. Ya no anuncia "concedido" sin comprobarlo.
2. Se mantienen C1, C2, C5, C7 y C8. GATE5_ACCESS es un texto fijo sin eco, y el .catch solo deja pasar mensajes que empiezan por GATE5_CONFIG o GATE5_ACCESS.
3. P1–P4 repetidos con el hook: mismos resultados que el informe. Con el navegador falso (8 modos × 2 scripts), más el control con HEAD, se confirman las afirmaciones 5–9.
4. Queda un caso residual que no falla cerrado: si la URL final es una variante como /es/password, /password/ o /challenge y no hay campo de contraseña, el script imprime "concedido" (P3). Además hay un defecto anterior al diff: la plantilla de contraseña de Sartorial oculta el campo en un modal, así que fill() agotaría el tiempo (P2, fuera de alcance).
5. Informe: el archivo de evidencia fake-out.txt está vacío (0 bytes) y un bloque de §6 también. "Decisión requerida" no sigue D11/D19. Falta "(con parche listo)".
Archivos tocados: ninguno en el repo. Scratchpad: .../scratchpad/review-gate5/ (hook copiado de p3b, stub-fake-review.mjs propio, fake-review.sh, runner.sh, count-review.py, salidas *.txt/*.out).
Desviaciones (Nivel 1 o Nivel 2): Ninguna del revisor. Reutilicé el hook, el loader, los selftests y el runner de p3b (cambié SCR y la carpeta de testigos). El navegador falso y su runner son míos.
Hallazgos extra fuera de alcance (con parche listo): hallazgo 4 (parche propuesto abajo).
Verificación (comando, resultado y qué demuestra/qué no): §2–§6 de esta revisión.
Lista de afirmaciones falsables numeradas: §8.
```

## 1. Qué revisé

- **Rama y HEAD:** `lote0/base-09f8342`, HEAD `8e1646e`.
- **Diff:** `git diff HEAD -- scripts/gate5-complete-verification.mjs scripts/gate5-live-verify.mjs`, completo y leído entero.
- **SHA-256 de lo revisado:**
  - complete: `32be3161…8e42d`
  - live: `73b49430…f555`
  - informe: `b1c55f67…477c`
- **Referencias:**
  - R-0 §7e (`GEMINI-REVIEW-LOTE-0-R0-002.md:169-170`).
  - R-D §6 C1–C8 (`CLAUDE-REVIEW-0-05-P3-RD-001.md`).
  - Informe 001, hallazgo 1.
  - RULES §1.3–1.4, §3.5–3.6.
  - D11 (`CLAUDE-DECISION-AUTONOMIA-001.md:58-63`) y D19 (`CLAUDE-DECISION-LOTE-0-CIERRE-001.md:40-43`).

**Diff mínimo:** sí. Los dos scripts reciben el mismo cambio:
- `wasPrompted` antes del `if`.
- La comprobación y el `throw` después del submit.
- El mensaje de éxito, que ahora depende de `wasPrompted`.
- Ampliación del `.catch`.

Sin cambios en otras partes.

**C1:** la línea 5 sigue siendo `const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD;` en ambos.

**C2:** el código nuevo está después del primer `goto`. `validateConfiguration()` sigue en la primera línea de `verifyGate5()`/`run()`, antes de `import('playwright')` (complete:46-47, live:46-47). Los testigos de P2–P4 lo confirman.

**Sin eco:** `GATE5_ACCESS: storefront password was not accepted.` es un literal sin interpolar. El `.catch` (complete:341, live:324) usa `/^GATE5_(CONFIG|ACCESS): /.test(err.message)`. El ancla `^` va sin la bandera `m`, así que solo cuenta el inicio del texto. Por eso ningún error de Playwright (`page.evaluate: …`, `page.goto: …`) puede pasar el filtro con su texto. Todos esos errores salen como "Gate 5 verification failed.".

**Robustez de la detección:**
- **URL final:** `waitForNavigation({waitUntil:'domcontentloaded'})` se resuelve con el documento final después de las redirecciones 302. Así que `page.url()` y `count()` ven el DOM servido.
- **Carrera:** `Promise.all` registra la espera antes de pulsar Enter, y Shopify no hace redirecciones por JS después de DOMContentLoaded en el POST de contraseña. No veo carrera.
- **Sin navegación:** si no hay navegación (modo `nonav`), el script falla cerrado con el mensaje genérico.
- **Tienda sin contraseña:** se apoya en que Shopify redirija `/password` a otra ruta. Si no redirige, el script falla cerrado (falso negativo, no falso positivo).
- **Locale y variantes:** la comparación es exacta (`=== '/password'`). Si queda `/es/password`, `/password/` o `/challenge` sin campo de contraseña, lo da por desbloqueado. Ver hallazgo 2.

## 2. P1 y autoprueba del hook

```
scripts/gate5-complete-verification.mjs exit=0 SyntaxError_lines=0
scripts/gate5-live-verify.mjs exit=0 SyntaxError_lines=0
selftest=chromium exit=97 out=[NO_NET_STUB: chromium.launch bloqueado ] witnesses=[chromium-launch.witness ]
selftest=fetch exit=98 out=[NO_NET_STUB: fetch bloqueado ] witnesses=[fetch.witness ]
selftest=http exit=99 out=[NO_NET_STUB: https.request bloqueado ] witnesses=[http-request.witness ]
```

## 3. P2–P4 (runner con `env -i PATH HOME`, hook activo, valores ficticios, ID `900700500`)

```
28   (casos)
     26 exit=1 | testigos=[] | SyntaxError/ERR_MODULE_NOT_FOUND=0
      2 exit=97 | testigos=[chromium-launch.witness ] | SyntaxError/ERR_MODULE_NOT_FOUND=0
     16 eco_valor=NA
     12 eco_valor=no-eco
mensajes: PASSWORD is required ×6; ORIGIN is required ×2; ORIGIN must be… ×6; THEME_ID is required ×2;
THEME_ID must be… ×2; COLLECTION_PATH is required/must be… ×2/×2; PRODUCT_PATH is required/must be… ×2/×2
```

La contraseña ficticia aparece 22 veces en `runner-out.txt`, pero todas en las líneas `cmd:` que escribe el propio runner. Hay 0 apariciones en la salida de los scripts.

## 4. Navegador falso del revisor y control negativo

El stub vive en memoria y el hook sigue activo. Los modos son:
- **`unlocked`:** URL final `/`.
- **`rejected`:** URL `/password` con el formulario.
- **`noprompt`:** `/password` redirige a `/`.
- **`stuck`:** `/password` sin formulario.
- **`locale-stuck`:** `/es/password` sin formulario.
- **`challenge`:** `/challenge` sin formulario.
- **`trailing`:** `/password/` sin formulario.
- **`nonav`:** `waitForNavigation` agota el tiempo.

Exit 96 significa que el script siguió adelante después de dar acceso. El testigo `browser-close` se crea si se llama a `browser.close()`.

Copia de trabajo (resultados iguales en complete y live):

```
mode=unlocked     exit=96 concedido=1 no_solicito=0 GATE5_ACCESS=0 generic=0 eco=0 [fake-launch fill post-access-goto submit]
mode=rejected     exit=1  concedido=0 no_solicito=0 GATE5_ACCESS=1 generic=0 eco=0 [fake-launch fill submit]
mode=noprompt     exit=96 concedido=0 no_solicito=1 GATE5_ACCESS=0 generic=0 eco=0 [fake-launch post-access-goto]
mode=stuck        exit=1  concedido=0 no_solicito=0 GATE5_ACCESS=1 generic=0 eco=0 [fake-launch fill submit]
mode=locale-stuck exit=96 concedido=1 …  [fake-launch fill post-access-goto submit]
mode=challenge    exit=96 concedido=1 …  [fake-launch fill post-access-goto submit]
mode=trailing     exit=96 concedido=1 …  [fake-launch fill post-access-goto submit]
mode=nonav        exit=1  concedido=0 GATE5_ACCESS=0 generic=1 eco=0 [fake-launch fill submit]
```

Control negativo con `git show HEAD:scripts/<s>`: en `rejected` y `stuck`, ambos scripts dan `exit=96 concedido=1`. En `noprompt`, complete da `concedido=1` y live da `no_solicito=1`. La prueba distingue la versión corregida de la anterior.

En ningún modo aparece el testigo `browser-close`.

## 5. P5

```
gate5-live-verify.mjs:  '||'=0 REDACTED=0 fixed=0 L5=[const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD;]
gate5-complete-verification.mjs: '||'=0 REDACTED=0 fixed=0 L5=[ídem]
ctx-check: ./tests/vendor/axe.min.js lineas_literal_contexto= 1 | total= 1 | fuera_de_tests_vendor_axe= 0
count-literal: candidatos_distintos= 1; gate5 live/complete disco=0 09f8342=0 HEAD=0;
  handoff disco=0 09f8342=2 HEAD=0; GEMINI-REVIEW-V1.1.0-PHASE2 0/0/0; context-brief disco=0 09f8342=1 HEAD=0;
  total_arbol= 46 archivos= 28
count-review: informe P3-002 = 0; informe P3-001 = 0; archivos del revisor = 0; 117 testigos = 0
```

## 6. Hallazgos

**1. P2 (informe, evidencia ausente).**
- **Dónde:** `CLAUDE-REPORT-0-05-P3-002.md:90-93`, `:104` y Anexo A.3.
- **Qué pasa:**
  - El bloque "Cabeceras literales" está vacío.
  - La "salida íntegra de las 8 ejecuciones" remite a `.../p3b/fake-out.txt`, que mide 0 bytes (`ls -la` → `0 Nov 4 18:59`).
  - La causa está en `fake-run.sh`: vacía `$OUT` con `: > "$OUT"` y luego escribe con `echo` a la salida estándar, sin redirigir al archivo.
  - Las afirmaciones 5–9 quedan sin salida literal (RULES §1.3). Su contenido es cierto: lo reproduje en §4.
- **Corrección:**
  - Quitar el bloque vacío.
  - Pegar en §6 las 8 líneas de resumen (o la tabla de §4 de esta revisión).
  - En A.3, terminar el bucle con `done >> "$OUT"`, o cambiar cada `echo` por `>> "$OUT"`.

**2. P3 (código, robustez; no bloquea R-0 §7e).**
- **Dónde:** complete:89, live:84.
- **Qué pasa:** la comprobación negativa (`pathname === '/password'`) no falla cerrada si la URL final es `/es/password`, `/password/` o `/challenge` (captcha) y no queda campo de contraseña. En ese caso imprime "concedido" y sigue (modos `locale-stuck`, `trailing` y `challenge` de §4).
- **Probabilidad:** que Shopify se comporte así no está verificado contra una tienda. Es poco probable, pero posible con un navegador headless.
- **Corrección propuesta**, igual en los dos scripts:

```js
const LOCK_PATH = /(^|\/)password\/?$/;
if (LOCK_PATH.test(new URL(page.url()).pathname) || await pwdInput.count() > 0 ||
    (wasPrompted && !(await context.cookies()).some(c => c.name === 'storefront_digest'))) {
  throw new Error('GATE5_ACCESS: storefront password was not accepted.');
}
```

  La cookie `storefront_digest` como señal positiva no está verificada. Hay que confirmarla en la primera ejecución real. Otra opción es comprobar después de cada `goto` posterior que la ruta final no coincide con `LOCK_PATH`.

**3. P3 (informativo; no lo introduce el diff).** No se llama a `browser.close()` en la rama `GATE5_ACCESS`.
- **Alcance:** pasa igual en cualquier error desde HEAD. El testigo `browser-close` no aparece en ningún modo de §4.
- **Impacto esperado: ninguno.**
  - `process.exit(1)` es síncrono, así que no hay cuelgue.
  - Playwright 1.63 instala un manejador de `exit` que mata los navegadores que lanzó: `node_modules/playwright-core/lib/coreBundle.js:9370` (`addProcessHandlerIfNeeded("exit")`), `:9271-9274` (`exitHandler` recorre `killSet`) y `:9378` (`killSet.add(killProcessAndCleanup)`).
  - No hay navegador huérfano, salvo un `SIGKILL` externo, que tampoco cubriría un `finally`.
- **No probado:** con Chromium real, porque no hay navegadores instalados en `~/.cache/ms-playwright`.
- **Endurecimiento opcional:** envolver el cuerpo después de `launch` en `try { … } finally { await browser.close().catch(() => {}); }`.

**4. P2 (fuera de alcance, anterior al diff; bloquea el uso real del arnés y no esta aceptación).**
- **Dónde:** `sections/main-password.liquid:101-141`, `assets/base.css:6572-6574` y `assets/theme.js:4711-4730`.
- **Qué pasa:**
  - Sartorial pone el campo de contraseña dentro de `password-modal`.
  - Con JS, `.js password-modal:not([data-open]) .password-modal__overlay { display:none }` lo oculta. El modal solo se abre al hacer clic en `[data-password-open]`, o solo si hay error.
  - `count()` lo encuentra (por eso `wasPrompted` es true), pero `fill()` espera a que sea visible y agota los 30 s. El script sale con "Gate 5 verification failed.": falla cerrado, sin falso positivo.
  - No sé si con `preview_theme_id` la página `/password` la pinta el tema en vista previa o el publicado. Dawn tiene un patrón parecido (modal `<details>`).
- **Parche** (antes de `fill`, en ambos scripts):

```js
if (wasPrompted && !(await pwdInput.first().isVisible())) {
  const opener = page.locator('[data-password-open], details:has(input[type="password"]) > summary').first();
  if (await opener.count() > 0) await opener.click();
}
await pwdInput.first().fill(STORE_PASSWORD);
```

**5. P3 (informe, autoridad).**
- **Dónde:** `CLAUDE-REPORT-0-05-P3-002.md:3`.
- **Qué pasa:** pide que Gemini/Antigravity revise y decida el commit. Según D11 (`AUTONOMIA-001.md:58-63`), la revisión de una tarea de código la hace un subagente Opus de contexto limpio (esta revisión). D19 (`LOTE-0-CIERRE-001.md:40-43`) resolvió la nota (a) sobre D8/D11, y D7/D12 dan el commit a Claude en `lote0/base-09f8342`.
- **Texto propuesto:** "Ninguna de Johandry. Revisión D11: CLAUDE-REVIEW-0-05-P3-002 (subagente Opus). Si se acepta, commit de Claude en lote0/base-09f8342 (D7/D12). El arnés sigue NO apto hasta ejecutarlo en tienda."

**6. P3 (informe, formato RULES §1.4 y §3.6).**
- **Dónde:** `:16`.
- **Qué pasa:** la cabecera dice "Hallazgos extra fuera de alcance:" sin "(con parche listo)", y el hallazgo 1 (browser.close) no trae parche.
- **Corrección:** añadir el parche `try/finally` del hallazgo 3, o marcarlo "informativo, sin parche".

**7. P3 (coherencia, nota).** `agent-comms/BOARD.md:74` y `:90` siguen citando solo `complete:88`. Al hacer commit, la fila de R-0 §7e debería pasar a "corregido en ambos gate5; no apto hasta ejecución real" (D24, escritor Claude). No lo reviso: BOARD tiene cambios sin commit de otro agente.

## 7. Clasificación de la desviación en `gate5-live-verify.mjs`

**Nivel 1, justificada.**
- **Archivo en alcance:** está dentro de la lista permitida de 0-05-P3 (C5: "solo los dos gate5"). Por eso no cae en el criterio de Nivel 2 de RULES §3.5 ("archivos fuera de la lista permitida"), ni en §3.6 ("fuera de tu tarea").
- **Contrato:** no toca ningún `id`, `default` ni contrato con el comerciante, y el cambio es reversible.
- **Mismo defecto:** el control con HEAD lo prueba: live en `rejected`/`stuck` da `concedido=1, exit=96`. El informe 001 (hallazgo 1) ya lo había anotado, y RULES §4.3 pide tratar la clase del defecto.
- **`.catch`:** su ampliación también es Nivel 1 y es necesaria. Sin ella el mensaje fijo quedaría tapado por el genérico. No introduce eco.

## 8. Afirmaciones del informe y afirmaciones de esta revisión

Contraste de las afirmaciones del informe:

| Afirmación | Resultado |
| --- | --- |
| 1 | Cierta (§2) |
| 2 | Cierta: numstat `9 3` y `9 5`. El `scripts/package-theme-zip.mjs` sin rastrear es de otro informe (ZIP-001). |
| 3 | Cierta (§2) |
| 4 | Cierta (§3) |
| 5–9 | Ciertas en sustancia (§4). La evidencia citada está vacía (hallazgo 1). |
| 10 | Cierta (§5) |
| 11 | Cierta: informe 001 = 0, informe 002 = 0, ctx-check 0 fuera de axe |
| 12 | Literal = 0 verificado. No hay ninguna otra contraseña. El resto no lo puede falsar el revisor. |
| "Archivos tocados" | Líneas exactas: complete 81-94 y 341, live 76-89 y 324 |

Afirmaciones de esta revisión:

1. `git status --short` del repo es igual antes y después de esta revisión: 3 rutas M y 4 sin rastrear. El revisor no escribió nada.
2. P1: exit 0 y 0 `SyntaxError` en ambos scripts. La autoprueba da 97/98/99, cada código con su testigo.
3. P2–P4: 26 casos dan exit 1 sin testigos, 12 de 12 sin eco, y P4 da exit 97 solo con `chromium-launch.witness`.
4. Navegador falso: `rejected` y `stuck` dan exit 1 con `GATE5_ACCESS` y 0 "concedido". `unlocked` y `noprompt` continúan. `locale-stuck`, `challenge` y `trailing` imprimen "concedido" (hallazgo 2). La contraseña ficticia no aparece en ninguna de las 32 salidas.
5. HEAD con `rejected`: los dos scripts dan `exit=96 concedido=1`.
6. `.../scratchpad/p3b/fake-out.txt` mide 0 bytes.
7. P5:
   - Los greps dan 0/0/0 en ambos scripts.
   - ctx-check: 0 fuera de `tests/vendor/axe.min.js`.
   - count-literal: 46 en 28 archivos.
   - El literal cuenta 0 en el informe P3-002 y en todos los archivos de `review-gate5/`.
8. Nadie definió ni usó una `STOREFRONT_PASSWORD` real, nadie leyó `.secrets` y ningún gate5 se ejecutó sin hook o sin `env -i`. No se mostró el diff de `CLAUDE-HANDOFF-SESSION-002.md` ni el de `context-brief.md`.

**Qué no demuestra esta revisión:** cómo se comporta Shopify de verdad (redirecciones, página de error, captcha, cookie `storefront_digest`, qué tema pinta `/password` con `preview_theme_id`). Tampoco la limpieza real de Chromium al salir, ni que el resto del arnés sea correcto.

## Veredicto: ACEPTADO CON CAMBIOS MENORES

- **Código:** los dos gate5 se aceptan tal como están.
- **Antes del commit:** corregir el informe según los hallazgos 1, 5 y 6.
- **Antes de la primera ejecución en tienda:** resolver los hallazgos 2 y 4 y registrarlos en BOARD (hallazgo 7). El arnés sigue NO apto como evidencia de tienda (C8).

Archivos útiles de la revisión:
- Navegador falso: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/review-gate5/stub-fake-review.mjs`
- Resultados de la copia de trabajo: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/review-gate5/fake-out.txt`
- Control con HEAD: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/review-gate5/fake-orig.txt`
- Salida de P2–P4: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/review-gate5/runner-out.txt`

---

# Re-verificación de correcciones

```text
ID: CLAUDE-REVIEW-0-05-P3-002 (adenda: re-verificación)
Estado: Re-verificación independiente terminada. Solo lectura salvo esta adenda; hook no-net y env -i en todas las ejecuciones; sin tiendas; sin .secrets; contraseña solo ficticia; ID 900700500.
Decisión requerida: Ninguna de Johandry. VEREDICTO FINAL: ACEPTADO. Claude puede hacer commit de los dos gate5, del informe y de esta revisión en lote0/base-09f8342 (D7/D12). El arnés sigue NO apto como evidencia de tienda (C8) hasta ejecutarlo en la tienda de desarrollo.
Resumen en 5 líneas:
1. Diff frente a HEAD: complete 32/3, live 32/5. Los cambios nuevos responden solo a los hallazgos 2, 3 y 4. C1 y C2 intactos. GATE5_ACCESS sigue siendo una constante sin eco.
2. P1–P4 repetidos: mismos resultados que en la revisión inicial (26 casos exit 1 sin testigos; P4 exit 97 solo con chromium-launch).
3. Navegador falso v2 propio (12 modos × 2 scripts): todos los modos de bloqueo salen 1 con GATE5_ACCESS. modal-hidden abre el modal y continúa. late-lock se detecta en el goto posterior.
4. browser.close se ejecuta en todas las salidas de error y en el éxito completo (modo full). El refactor a runChecks no cambia el resultado del éxito: exit 0 y resumen final en HEAD y en la copia de trabajo.
5. Informe: los hallazgos 1, 5 y 6 están corregidos y sus afirmaciones son ciertas, salvo los rangos de líneas del bloque del modal (se corrigen aquí, §R5).
Archivos tocados: solo esta adenda, al final de agent-comms/outbox-claude/CLAUDE-REVIEW-0-05-P3-002.md. Scratchpad: review-gate5/stub-fake-review2.mjs, fake-review2.sh, count-one.py, fake2-out.txt, fake2-orig.txt, runner-out2.txt.
Desviaciones (Nivel 1 o Nivel 2): Ninguna del revisor.
Hallazgos extra fuera de alcance (con parche listo): R-N1 a R-N3 (P3, opcionales, con parche en §R4).
Verificación (comando, resultado y qué demuestra/qué no): §R1–§R6.
Lista de afirmaciones falsables numeradas: §R7.
```

## R1. Diff

Lo revisado (SHA-256, primeros 12 caracteres):
- complete: `fd77b1ac5976`
- live: `d03bd5090fc8`
- informe: `0218e7b0eb5b` (463 líneas)

**Mínimo dentro de lo pedido:** sí. Además de lo de la revisión inicial, cada script añade cuatro cosas:
- **Hallazgo 2:** `LOCKED_PATH = /(^|\/)(password|challenge)\/?$/`, `ACCESS_DENIED` y `assertUnlocked(page)` (complete y live 45-49). La llamada va después del submit (complete 111, live 106) y después de cada `goto` posterior (complete 120 y 155, live 125 y 169). Hay 3 `page.goto(` y 3 `assertUnlocked(page);` por script, y los 3 `goto` llevan `preview_theme_id=${THEME_ID}`.
- **Hallazgo 4:** apertura del modal antes de `fill`: complete 97-104, live 92-99.
- **Hallazgo 3:** `try { return await runChecks(browser); } finally { await browser.close().catch(() => {}); }` (complete 60-65, live 61-66) y `async function runChecks(browser)` (complete 67, live 68).
- **Cookie `storefront_digest`:** no se aplicó y queda documentada como hallazgo extra 1 del informe, con parche. Es aceptable porque la señal no está verificada.

**C1:** la línea 5 de ambos es `const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD;`.

**C2:** `verifyGate5()`/`run()` (líneas 51-53) siguen empezando por `validateConfiguration()` y después `import('playwright')`. Las constantes nuevas de nivel de módulo son un literal de regex y una cadena, sin efectos.

**Sin eco:** `ACCESS_DENIED` es un literal fijo. El `.catch` (complete 364, live 347) no cambia respecto a la revisión inicial.

**Refactor:** `runChecks` recibe `browser` como parámetro. Después del `launch` no usa ninguna variable de `verifyGate5`/`run` salvo `browser`. Mantiene el `await browser.close()` final que ya existía y devuelve lo mismo (`success` / `results`). Ver R-N1.

**Modal:**
- La clase `.js` se añade con un script inline del `<head>` (`layout/password.liquid:82-83`) y `theme.js` se carga con `defer` (`:79`). Así, en `domcontentloaded` el modal ya está cerrado y `isVisible()` es fiable.
- Solo el `<button … data-password-open>` (`sections/main-password.liquid:33-40`) cumple el selector; el `<a class="no-js-only">` no lo cumple. Por eso `.first()` es el botón correcto.
- Si no hay abridor, `fill` agota el tiempo y el script falla cerrado con el mensaje genérico.

## R2. P1–P4

```
scripts/gate5-complete-verification.mjs exit=0 SyntaxError_lines=0
scripts/gate5-live-verify.mjs exit=0 SyntaxError_lines=0
selftest=chromium exit=97 witnesses=[chromium-launch.witness ]
selftest=fetch exit=98 witnesses=[fetch.witness ]
selftest=http exit=99 witnesses=[http-request.witness ]
28
     26 exit=1 | testigos=[] | SyntaxError/ERR_MODULE_NOT_FOUND=0
      2 exit=97 | testigos=[chromium-launch.witness ] | SyntaxError/ERR_MODULE_NOT_FOUND=0
     16 eco_valor=NA
     12 eco_valor=no-eco
GATE5_CONFIG: PASSWORD is required ×6; ORIGIN is required ×2; ORIGIN must be… ×6; THEME_ID is required ×2;
THEME_ID must be… ×2; COLLECTION_PATH ×2/×2; PRODUCT_PATH ×2/×2
contraseña ficticia fuera de las líneas cmd: = 0
```

## R3. Navegador falso v2 del revisor

El stub es `review-gate5/stub-fake-review2.mjs` y es independiente del `stub-fake-v2.mjs` del implementador. Respecto al anterior, cambia esto:
- **`browser-close`:** cuenta las llamadas, una línea por cada `close()`.
- **`modal-hidden`:** el campo está oculto; `[data-password-open]` lo muestra; `fill` y `waitFor` fallan si el campo sigue oculto.
- **`modal-noopener`:** el campo está oculto y no hay abridor.
- **`late-lock`:** el desbloqueo funciona, pero el `goto` posterior cae en `/password`.
- **`full`:** recorre el script entero con valores falsos (`evaluate` devuelve un proxy) para probar la salida con éxito.

Con exit 96, el stub detiene el proceso en el primer `goto` posterior, en los modos que no son `late-lock` ni `full`.

Copia de trabajo (resultados idénticos en complete y live):

```
unlocked       exit=96 concedido=1 GATE5_ACCESS=0 generic=0 fin=0 [fake-launch:1 fill:1 post-access-goto:1 submit:1]
rejected       exit=1  concedido=0 GATE5_ACCESS=1 generic=0 fin=0 [browser-close:1 fake-launch:1 fill:1 submit:1]
noprompt       exit=96 concedido=0 no_solicito=1 GATE5_ACCESS=0 [fake-launch:1 post-access-goto:1]
stuck          exit=1  concedido=0 GATE5_ACCESS=1 [browser-close:1 …]
locale-stuck   exit=1  concedido=0 GATE5_ACCESS=1 [browser-close:1 …]
challenge      exit=1  concedido=0 GATE5_ACCESS=1 [browser-close:1 …]
trailing       exit=1  concedido=0 GATE5_ACCESS=1 [browser-close:1 …]
nonav          exit=1  concedido=0 GATE5_ACCESS=0 generic=1 [browser-close:1 fake-launch:1 fill:1 submit:1]
modal-hidden   exit=96 concedido=1 GATE5_ACCESS=0 [fake-launch:1 fill:1 opener-click:1 post-access-goto:1 submit:1]
modal-noopener exit=1  concedido=0 GATE5_ACCESS=0 generic=1 [browser-close:1 fake-launch:1]
late-lock      exit=1  concedido=1 GATE5_ACCESS=1 [browser-close:1 fake-launch:1 fill:1 post-access-goto:1 submit:1]
full           exit=0  concedido=1 GATE5_ACCESS=0 fin=1 [browser-close:2 fake-launch:1 fill:1 post-access-goto:2 submit:1]
eco (contraseña ficticia en la salida) = 0 en las 24
```

Control negativo con HEAD (`git show HEAD:<script>`):

```
rejected/stuck/locale-stuck/challenge/trailing: exit=96 concedido=1 (ambos scripts; continúan)
noprompt: complete concedido=1 (log falso); live no_solicito=1
modal-hidden: exit=1 generic=1, sin opener-click ni fill (no puede desbloquear Sartorial)
late-lock: complete exit=1 generic=1 tras concedido=1; live exit=0 fin=1 (termina "con éxito" sobre /password)
full: exit=0 fin=1 en ambos, browser-close:1
browser-close en rutas de error: 0 en HEAD
```

**Qué demuestra:**
- La decisión de bloqueo cubre `/password`, `/es/password`, `/password/` y `/challenge`, y detecta un rebloqueo posterior. El caso que HEAD de live daba por bueno con exit 0 ahora sale 1.
- El modal se abre antes de `fill`.
- `browser.close()` se ejecuta en todos los errores posteriores al `launch` y también en el éxito.
- El éxito completo conserva exit 0 y el resumen final igual que HEAD.

**Qué no demuestra:** Shopify real (URL tras un submit correcto o incorrecto, existencia de `/challenge`, cookie), la visibilidad real del modal en Chromium, ni la limpieza real del proceso de Chromium.

## R4. Hallazgos nuevos (todos P3, opcionales, no bloquean)

**R-N1. Cierre doble en el éxito.**
- **Dónde:** complete `runChecks` (el `await browser.close()` que ya existía, antes del cálculo de `success`) y su equivalente en live, más el `finally`.
- **Evidencia:** en `full`, `browser-close:2`.
- **Impacto:** inocuo por el `.catch(() => {})`. El informe lo declara.
- **Parche opcional:** borrar el `await browser.close();` interno de `runChecks` en ambos scripts.

**R-N2. El `finally` espera a `browser.close()` antes del `process.exit(1)` del `.catch`.**
- **Qué pasa:** si Chromium dejara de responder, el proceso esperaría en lugar de salir. Antes salía de inmediato y el manejador `exit` de Playwright mataba el navegador.
- **Riesgo:** bajo, no probado con Chromium real.
- **Parche opcional:** `await Promise.race([browser.close().catch(() => {}), new Promise(r => setTimeout(r, 10000))]);`

**R-N3. `LOCKED_PATH` también coincide con rutas de colección o producto cuyo último segmento sea `password` o `challenge`.**
- **Ejemplo:** `/products/password`.
- **Efecto:** el script falla cerrado (falso negativo, nunca falso positivo).
- **Parche opcional:** en `validateConfiguration`, rechazar esas rutas con `if (LOCKED_PATH.test(value)) fail(\`${name} must not be a storefront lock path.\`);`. Habría que mover `LOCKED_PATH` antes de la función.

**Nota (no es defecto).** En `late-lock` el log muestra primero "concedido" y luego `GATE5_ACCESS`. Es veraz: el desbloqueo inicial sí ocurrió.

## R5. Exactitud del informe CLAUDE-REPORT-0-05-P3-002 (v2)

**Hallazgos de la revisión inicial:**
- **Hallazgo 1:** corregido. `p3b/fake2-out.txt` tiene 194 líneas, 20 cabeceras, y las 20 contienen `browser-close.witness`. `fake2-orig.txt` tiene 223 líneas y 20 cabeceras. La salida literal está pegada en §6.
- **Hallazgo 5:** corregido en el campo "Decisión requerida".
- **Hallazgo 6:** corregido con "(con parche listo)" y parches en los hallazgos extra 1 a 3.

**Afirmaciones:**
- **1 a 4:** ciertas (R2).
- **5 a 9:** ciertas con el stub del implementador y reproducidas con el mío (R3). El exit 1 de los modos que continúan se debe a su `FAKE_STUB_STOP`, como explica su §6.
- **10:** cierta (R6).
- **11:** cierta: literal 0 en el informe v2 y en los dos scripts.
- **12:** no la puede falsar el revisor. No hay indicios en contra.

**Tabla de líneas de §2. Correcciones del revisor:**

| Fila | Informe | Real |
|---|---|---|
| Abridor del modal, complete | 97-105 | **97-104** (105 es el `fill` que ya existía) |
| Abridor del modal, live | 92-100 | **92-99** (100 es el `fill` que ya existía) |
| `try/finally` + `runChecks`, complete | 60-67 | 60-65 (`try/finally`) + 67 (`runChecks`); el rango del informe los incluye |
| `try/finally` + `runChecks`, live | 61-68 | 61-66 + 68; ídem |
| Omisión | — | La tabla no lista `const wasPrompted` + `if (wasPrompted)`: complete 95-96, live 90-91 |

Las demás filas son exactas:
- `LOCKED_PATH` y compañía: 45-49 en ambos.
- Comprobación tras el submit: 111-112 / 106-107.
- Mensaje: 113-115 / 108-110.
- `assertUnlocked` tras los `goto`: 120 y 155 / 125 y 169.
- `.catch`: 364 / 347.

La desviación de los rangos es de una línea de más, no de menos. No afecta a ninguna conclusión.

## R6. P5

```
live:     '||'=0 REDACTED=0 fixed=0 goto=3 goto_preview=3 assertUnlocked_calls=3 L5=[const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD;]
complete: '||'=0 REDACTED=0 fixed=0 goto=3 goto_preview=3 assertUnlocked_calls=3 L5=[ídem]
ctx-check: total_lineas_literal_contexto= 1 | fuera_de_tests_vendor_axe= 0
count-literal: total_arbol= 46 archivos= 28
count-one (ruta=N): CLAUDE-REPORT-0-05-P3-002.md=0; gate5-live-verify.mjs=0; gate5-complete-verification.mjs=0;
  review-gate5/stub-fake-review2.mjs=0; fake-review2.sh=0; fake2-out.txt=0; fake2-orig.txt=0; runner-out2.txt=0
```

## R7. Afirmaciones falsables de la re-verificación

1. `git diff --numstat HEAD -- scripts/` da `32 3` (complete) y `32 5` (live).
2. P1 da exit 0 con 0 `SyntaxError` en ambos. La autoprueba da 97/98/99, cada código con su testigo.
3. P2–P4: 26 casos exit 1 sin testigos, 12 sin eco, 2 casos P4 con exit 97 solo con `chromium-launch.witness`.
4. Con `stub-fake-review2.mjs`, los modos `rejected`, `stuck`, `locale-stuck`, `challenge`, `trailing` y `late-lock` salen con exit 1 y `GATE5_ACCESS=1` en ambos scripts. Todos tienen `browser-close:1`.
5. `modal-hidden` crea `opener-click` y continúa. `modal-noopener` y `nonav` salen 1 con el mensaje genérico y `browser-close:1`.
6. `full` sale 0 con el resumen final y `browser-close:2` en ambos scripts. HEAD sale 0 con `browser-close:1`.
7. HEAD con `late-lock`: live sale 0 y llega al resumen. Complete imprime "concedido" y sale 1 con el mensaje genérico.
8. Hay 3 `page.goto(` por script, los 3 con `preview_theme_id=${THEME_ID}`, y 3 `assertUnlocked(page);` por script.
9. El literal cuenta 0 en esta revisión, en el informe v2, en ambos scripts y en los archivos nuevos de `review-gate5/`. Total del árbol: 46 en 28 archivos.
10. El revisor no definió ninguna contraseña real, no leyó `.secrets`, no contactó ninguna tienda y no ejecutó ningún gate5 sin hook o sin `env -i`.

## Veredicto final: ACEPTADO

- **Código:** los dos gate5 cumplen R-0 §7e y los hallazgos 2 a 4, con C1, C2, C5, C7 y C8 intactos.
- **Informe:** cumple RULES §1.4. La única inexactitud son los rangos del bloque del modal, corregidos en R5.
- **R-N1 a R-N3:** opcionales.
- **Antes de usar el arnés como evidencia de tienda** sigue haciendo falta:
  - ejecutarlo en la tienda de desarrollo;
  - confirmar la cookie `storefront_digest`, la redirección de `/password` y la apertura real del modal;
  - actualizar la fila R-0 §7e de BOARD (hallazgo 7).
