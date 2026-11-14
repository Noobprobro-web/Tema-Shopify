ID: REVIEW-PRECOMMIT-001
Estado: los tres grupos se pueden COMMITEAR. (a) identity.mjs: COMMITEAR, con dos recomendaciones P3 que no bloquean. (b) results JSON: COMMITEAR. (c) informes de revisión: COMMITEAR.
Decisión requerida: ninguna para el commit. Coordinador: registrar que se ha modificado un harness ya aceptado (C-01-ID). El hash de identity.mjs cambia de 0d75bd4a… a 67912f75…, y los informes nuevos lo reflejarán en `script.sha256`.
Resumen en 5 líneas:
1. identity.mjs es correcto. `mkdirSync(dest)` crea un subdirectorio dentro del `mkdtemp` propio, el pull sigue exigiendo status 0 y la comparación, los estados aceptados y la salida a --out no cambian. measure.mjs/lib.mjs no leen nada que cambie.
2. El extracto de stderr (200 caracteres como máximo) solo sale por el stderr del proceso. En caso de fallo, `fail()` sale antes de `writeFileSync(opts.out)`, así que no llega a --out (probado con un stub). No se redacta: si el CLI escribiera un valor en stderr, aparecería en la terminal y en los logs que se copien a mano (riesgo P3).
3. Los dos results nuevos solo usan claves que ya existen en los results commiteados (0 claves nuevas) y no contienen ningún string con `/`, `=` ni `?`. El único dominio es `target.host`, que es una constante de run.mjs:56 y ya figura en 21 apariciones commiteadas. cartTouched=false y el incidente histórico es la constante de run.mjs:68.
4. Los motivos de fallo son coherentes. axe en HEAD tiene sha256 b511cd9d…, pero run.mjs:19 espera 3e34029d…, de modo que run.mjs:973 da AXE_SOURCE_DIGEST_NOT_EXPECTED antes de lanzar el navegador (sessions=[]). En el cart solo hay un POST password_auth permitido y run.mjs:232/414 exigen 302/303, de modo que da AUTH_RESPONSE_NOT_ACCEPTED.
5. Literal de STOREFRONT_PASSWORD = 0 y de SHOPIFY_CLI_THEME_TOKEN = 0 en los 5 archivos modificados o sin seguimiento y en el diff (variables definidas y no vacías). Ningún archivo ni ruta del árbol apunta a /axe_head.js, ningún archivo del scratchpad está en el árbol y los ignorados son solo `node_modules/`.
Archivos tocados: solo este informe (nuevo). Fuera del repo, un stub de prueba en /tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/stubfail/stub.mjs y el log del selftest en /tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/selftest.log. Sin commit ni push.
Desviaciones (Nivel 1 o Nivel 2): ninguna. No se ejecutó ningún comando de Shopify ni ninguna petición a la tienda, no se abrió `.secrets` y no se imprimió ningún valor secreto. La prueba del stub usó valores ficticios (`SHOPIFY_FLAG_STORE=dummy.example`, `SHOPIFY_CLI_THEME_TOKEN=DUMMYTOKEN123`, sin STOREFRONT_PASSWORD) y un `SHOPIFY_CLI_BIN` local que no usa la red.
Hallazgos extra fuera de alcance (con parche listo):
- H1 (P3). Ninguna prueba de selftest.mjs recorre la rama nueva de error de pull con stderr. Solo la cubre la prueba manual con stub de §1.3. Parche sugerido: añadir a selftest un caso con un stub que salga con 1 y escriba en stderr, y comprobar que el código es 1, que el texto se trunca a 200 y que no existe --out.
- H2 (P3, defensa en profundidad). Redactar en `detail` los valores de entorno sensibles antes de truncar. Parche sugerido en identity.mjs:115, sin imprimir nada: `let detail = stderr; for (const n of ['SHOPIFY_CLI_THEME_TOKEN','STOREFRONT_PASSWORD']) { const v = process.env[n]; if (v) detail = detail.split(v).join('[redacted]'); } detail = detail.replace(/\s+/g, ' ').trim().slice(0, 200);`.
- H3 (P2, fuera del alcance de este commit). La constante `AXE_SHA256` de run.mjs:19 (3e34029d…) no coincide con `tests/vendor/axe.min.js` de HEAD (b511cd9d…, sin cambios desde 42e3b9e). El modo read-only del harness GPT R-A/R-B falla siempre hasta que alguien decida cuál de los dos es el correcto. Fuera del repo hay un /axe_head.js, idéntico byte a byte al axe de HEAD.
- H4 (P3). Quedan tres directorios vacíos /tmp/c01-pull-* de 15:56 a 15:58, anteriores a esta revisión y fuera del repo. Mi prueba no dejó ninguno nuevo.
Verificación (comando, resultado y qué demuestra/qué no): ver §1 a §5. Demuestra la corrección local del cambio, la sintaxis, 48/48 en el selftest, la forma y el contenido de los results y la ausencia de los dos literales. NO demuestra el comportamiento real del CLI 4.8.0 contra la tienda (no verificado), ni qué texto concreto escribe Shopify en stderr ante un fallo real.
Lista de afirmaciones falsables numeradas:
1. Rama lote-e-claude, HEAD cb20d86. `git status`: 1 modificado (identity.mjs) y 4 sin seguimiento (2 .md y 2 .json). El diff es de 11 inserciones y 6 borrados, solo en identity.mjs.
2. `node --check` sale OK en los 7 .mjs del harness C-01. `node selftest.mjs` termina con "48/48 comprobaciones" y exit 0, y el árbol queda igual que antes.
3. Con el stub, el directorio --path existe en el momento del pull (`exists=true`), el exit es 1, el mensaje tiene 200 caracteres de detalle y no se crea out.json.
4. Los results nuevos tienen 0 claves fuera del conjunto de claves de los 21 results commiteados (68 claves en el cart y 29 en el read-only) y 0 strings con `/`, `=` o `?`.
5. STOREFRONT_PASSWORD=0 y SHOPIFY_CLI_THEME_TOKEN=0 en los 5 archivos y en `git diff`.
6. `grep axe_head` da 0 en los 5 archivos. El único `/tmp` es una mención en texto de la ruta del scratchpad (REVIEW-SYNC-RESULT-001.md:10), y 49 archivos commiteados ya tienen menciones equivalentes.

## 1. (a) identity.mjs

### 1.1 Diff

`git diff` (resumen): se importa `mkdirSync`. `runCli` devuelve además `stderr`. `pullTheme` hace `mkdirSync(dest, { recursive: true })` antes de `runCli(args)` y, si `status !== 0`, lanza `PullError` con `stderr.replace(/\s+/g,' ').trim().slice(0,200)`. Se actualiza el comentario de cabecera de runCli.

### 1.2 Corrección y semántica

- `dest` es `path.join(tmpRoot, target.themeId)` y `tmpRoot` sale de `mkdtempSync(os.tmpdir()/c01-pull-)` (identity.mjs:182-187). El directorio que se crea es propio y está vacío, y `rmSync(tmpRoot)` lo limpia en `finally` salvo con `--keep-pull`. En modo simulado no se llama a `pullTheme`.
- No se relaja ninguna comprobación. Sigue siendo `status !== 0` ⇒ `PullError` ⇒ `fail(1, …)`. Un pull con 0 que no descargue nada acaba en estados de fallo en `compareTarget`, igual que antes. Los estados aceptados (`exact`, `normalized`, `absent-both`) no cambian. El preflight (`theme list --role unpublished`) sigue antes del pull y sigue descartando stderr: solo se desestructura `{ status, stdout }`.
- Que `stdout` siga siendo `''` cuando falta mantiene igual el parseo de `preflight`.
- measure.mjs lee del informe de identidad solo `mode`, `scope`, `startedAt` y `targets[].{themeId,preset,expectedCommit,ok}`, y calcula `sha256File` del informe (measure.mjs:137-156). Nada de eso cambia. No hay spawn de identity.mjs ni lectura de su stderr (`grep spawn|stderr` en measure.mjs/lib.mjs solo da `die()`). Lo único que cambia es `report.script.sha256`, que ningún consumidor valida.
- El stub de selftest crea `--path` con `mkdirSync(…, { recursive: true })` (selftest.mjs:57), así que tolera un directorio que ya exista.

### 1.3 Riesgo de filtración en stderr

```
$ env -u STOREFRONT_PASSWORD SHOPIFY_CLI_BIN=<scratch>/stub.mjs SHOPIFY_FLAG_STORE=dummy.example SHOPIFY_CLI_THEME_TOKEN=DUMMYTOKEN123 node identity.mjs --target 222:HEAD:Sartorial --out <scratch>/out.json
identity: theme pull del tema 222 devolvio 1: exists=true Error: token DUMMYTOKEN123 store dummy.example xxxx…(hasta 200)
exit 1
$ ls <scratch>   ->  stub.mjs        (sin out.json)
```

Qué demuestra la prueba:
- El extracto nunca llega a `--out`. `fail()` hace `process.exit` (identity.mjs:205) antes de `writeFileSync` (identity.mjs:210).
- El extracto no se redacta. Lo que el CLI escriba en stderr (por ejemplo el dominio de la tienda, que ya está en 172 archivos commiteados, nombres de tema o identificadores de petición) llega a la terminal. Un valor secreto solo podría acabar commiteado si alguien copia a mano un log o una salida a un informe, como pasó con `scratchpad/id-pre.log`, que se citó en REVIEW-SYNC-RESULT-001 H1. No he comprobado si el CLI 4.8.0 llega a escribir el token en stderr (no verificado). Por eso H2 queda como mejora P3 y no bloquea.

### 1.4 Selftest

```
$ for f in *.mjs; do node --check $f && echo "ok $f"; done
ok build-export.mjs / ok cleanup-check.mjs / ok identity.mjs / ok lib.mjs / ok measure.mjs / ok selftest.mjs / ok synthetic.mjs
$ timeout 580 node selftest.mjs   (node v22.23.4)
… ok   C4 login con STOREFRONT_PASSWORD del entorno y sin rastro en el resultado
48/48 comprobaciones
exit 0
```

Veredicto (a): COMMITEAR. Estado del cambio: `código completo`. El comportamiento contra la tienda real queda `no verificado` desde aquí.

## 2. (b) results JSON de GPT R-A/R-B

- Archivos: `RA-RB-read-only-20261110T161150849Z-4ab6cf14-….json` (1323 B) y `RA-RB-cart-20261110T161239208Z-6a940aea-….json` (2618 B).
- Lista blanca: todas las rutas de clave ya existen en los results commiteados (`newKeysVsCommitted []` en ambos). No hay ningún string con `/`, `=` ni `?`, así que tampoco URLs, rutas ni querys. `grep` de cookie, `_secure_session`, `storefront_digest`, `cart=`, `password=`, `shp*_`, `ghp_`, `AKIA` y `PRIVATE KEY` da 0 en ambos.
- Dominio: solo `target.host = tema-qkqpke0j.myshopify.com`. Viene de la constante de run.mjs:56 y ya está en 21 apariciones de los results commiteados. Lo acepto como campo de la lista blanca del esquema, no como un dato nuevo expuesto.
- Read-only: `checks[0] = harness_preflight_or_runtime / AXE_SOURCE_DIGEST_NOT_EXPECTED`, `sessions: []` y una duración de 0,33 s. Es coherente con run.mjs:972-973, que comprueba el digest antes de `chromium.launch`. Digests: `sha256sum tests/vendor/axe.min.js` = b511cd9d… (igual a `git show HEAD:` y sin cambios en el árbol), frente a un esperado 3e34029d… (run.mjs:19). Ver H3.
- Cart: `storefront_access / AUTH_RESPONSE_NOT_ACCEPTED`. `requestDecisions` tiene un único `POST api store password_auth allowed AUTH_POST_ALLOWED`. Es coherente con run.mjs:232 y :414, que exigen 302/303. `cartTouched=false`, `cartInitiallyEmptyVerified=null`, `finalCartCleanup=null`, `contextClosed=true`, 0 bloqueos y 0 eventos de ruta o rate limit. La única sesión es la de esta ejecución, que no tocó el carrito.
- `historicalIncidents` solo contiene `ARCHIVE_ORPHANED_CART_20261106`, igual a la constante de run.mjs:68. No hay incidentes nuevos. `interventionRequired=false`.
- run.mjs no tiene cambios en el árbol (`git status` del directorio solo muestra los dos results).

Veredicto (b): COMMITEAR. Son evidencia de dos ejecuciones fallidas en preflight y autenticación. No acreditan ninguna fila: el estado R-A/R-B sigue `no verificado`.

## 3. (c) Informes REVIEW-SYNC-PREVIEWS-001.md y REVIEW-SYNC-RESULT-001.md

- STOREFRONT_PASSWORD=0 y SHOPIFY_CLI_THEME_TOKEN=0 en ambos (§4). 0 patrones de token y 0 URLs `http(s)://`.
- Solo contienen menciones, nunca valores: los nombres de las variables, `.secrets` (para decir que no se abrió), el dominio de la tienda (PREVIEWS:21 y :83, ya presente en 172 archivos commiteados), IDs de tema y la ruta absoluta del scratchpad en RESULT:10 (texto informativo, con precedente en 49 archivos commiteados).
- Ambos llevan la cabecera de RULES §1.4.

Veredicto (c): COMMITEAR.

## 4. Conteo de literales (sin imprimirlos)

```
STOREFRONT_PASSWORD set (no vacío) · SHOPIFY_CLI_THEME_TOKEN set (no vacío)
archivos: identity.mjs, REVIEW-SYNC-PREVIEWS-001.md, REVIEW-SYNC-RESULT-001.md, RA-RB-cart-…json, RA-RB-read-only-…json
STOREFRONT_PASSWORD literal count: 0
SHOPIFY_CLI_THEME_TOKEN literal count: 0
git diff | grep -cF <valor>: 0 y 0
```

Método: `grep -cF -- "${!v}"` por archivo, con la suma impresa. tests/vendor/axe.min.js no está modificado y no entra en el conjunto.

## 5. Rutas externas y scratchpad

- `grep -n axe_head` en los 5 archivos da 0. En las líneas añadidas del diff no hay `/tmp`, `/home`, `/root` ni `axe`.
- `git ls-files --others --ignored --exclude-standard --directory` solo da `node_modules/`. En el árbol no hay archivos del scratchpad.
- /axe_head.js existe fuera del repo (16:13, 553290 B, sha256 b511cd9d…). No lo referencia ningún archivo modificado o sin seguimiento.

## Estado (vocabulario del ledger)

- Cambio de identity.mjs: `código completo`. Comportamiento contra la tienda: `no verificado`.
- Ausencia de secretos en los archivos que se van a commitear: `cumplido` (§4).
- Results R-A/R-B dentro de la lista blanca: `cumplido` (§2). Certificación R-A/R-B: `no verificado`.

No cierro ninguna fila de docs/requirements-ledger.md. Es una revisión previa al commit.
