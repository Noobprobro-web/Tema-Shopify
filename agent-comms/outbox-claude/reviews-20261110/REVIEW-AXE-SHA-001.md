```text
ID: REVIEW-AXE-SHA-001
Estado: código completo (revisión estática + test local sin tienda; sin corrida en tienda)
Decisión requerida: Gemini/Johandry. (1) Re-aceptar run.mjs con SHA-256 9682dc26…1324 en lugar del snapshot 0F936942… de docs/decisions.md:309. (2) Decidir cómo normalizar fin de línea para Windows (C3).
Resumen en 5 líneas:
  1. git diff tiene exactamente 2 líneas cambiadas: run.mjs:19 (AXE_SHA256) y run-b02.mjs:29 (D28_RUNNER_SHA256).
  2. b511cd9d… es el SHA-256 de tests/vendor/axe.min.js (axe v4.10.2) en HEAD, en el working tree y en 42e3b9e. El blob aebfb0c1 no ha cambiado.
  3. Hallazgo nuevo: el pin antiguo 3e34029d… SÍ es el SHA de ese mismo axe con CRLF. Va en contra de CLAUDE-SESION-20261110-TIENDA-001.md:29, que dice "No es CRLF".
  4. La guardia sigue siendo igual de estricta: un literal fijo frente a un archivo versionado en una ruta fija. No se calcula en tiempo de ejecución.
  5. node --check pasa en los dos archivos. conditions-test.mjs da 49/49 PASS, exit 0 y 0 POST.
Archivos tocados: solo este informe. No edité, no hice commit ni push y no hice peticiones a la tienda.
Desviaciones (Nivel 1 o Nivel 2): ninguna.
Hallazgos extra fuera de alcance (con parche listo): C3 (EOL en Windows) y C2 (corrección documental). Parche propuesto abajo, NO aplicado.
Verificación: ver §Evidencia.
Lista de afirmaciones falsables numeradas: ver §Afirmaciones.
```

## Veredicto: COMMITEAR, con condiciones

El cambio es correcto y mínimo. Fija la guardia de axe a los bytes del archivo versionado, que es lo que hay en cualquier checkout LF (Linux, la nube y CI). Ajusta en el mismo commit el pin de run-b02.mjs, que depende de esa guardia. Ninguna condición bloquea el commit, pero C1 tiene que quedar registrada antes de usar run.mjs o run-b02.mjs en una corrida de evidencia.

- **C1 (re-aceptación obligatoria).** `docs/decisions.md:309` registra como `ACCEPTED` el snapshot de run.mjs `0F936942…CB84`. Con este cambio, run.mjs pasa a `9682dc26…1324` y necesita su propia aceptación independiente, que debe anotarse en decisions.md (Gemini/Johandry). El delta es de una sola línea (run.mjs:19) y AXE_SHA256 no forma parte de los exports que inyecta `loadD28Policy` (run-b02.mjs:99). Por eso la política D28 que usa B-02 queda byte a byte igual, salvo esa constante. `REVIEW-B02H-002.md:39` («El SHA-256 coincide con el actual de run.mjs: 0f9369…cb84») pasa a ser histórico, y la aceptación de B-02 quedaba ligada a ese valor.
- **C2 (corrección documental).** `agent-comms/outbox-claude/CLAUDE-SESION-20261110-TIENDA-001.md:29` dice «No es CRLF y ese hash no existe en el historial». Es falso: el pin antiguo 3e34029d… es exactamente `sha256(axe.min.js con \n→\r\n)`. Hay que anotar la corrección en el commit o en ese informe. `REVIEW-PRECOMMIT-001.md:15` (H3) queda resuelto por este cambio.
- **C3 (riesgo para el operador Windows; no bloquea este commit).** Las pruebas apuntan a que el pin antiguo se calculó en el checkout Windows de GPT con CRLF:
  - la lectura `RA-RB-read-only-20261106T190050695Z` tiene 18 `axe_smoke` en `passed` (axe 4.10.2) con el pin 3e34…;
  - `GPT-TEST-MATRICES-20261107-001.md:93` registra run.mjs = `dfb30247…`, que es el SHA CRLF del run.mjs de HEAD;
  - GPT trabaja en PowerShell (`GPT-DECISION-LOTE-0-M2-003.md:65`).

  El repo no tiene `.gitattributes` y `git ls-files --eol` da `attr/` vacío. Así, en un clon con `core.autocrlf=true`, el pin nuevo fallaría con `AXE_SOURCE_DIGEST_NOT_EXPECTED`, y el pin de run-b02.mjs con `D28_SOURCE_DIGEST_NOT_EXPECTED`. Parche propuesto, NO aplicado, que necesita revisión propia: un `.gitattributes` con `tests/vendor/axe.min.js -text` y `agent-comms/**/harness-*/*.mjs text eol=lf`. Otra opción es avisar al operador Windows de que debe usar un checkout LF. No propongo normalizar el EOL antes de calcular el hash, porque eso relajaría la guardia.

## Respuestas (a)-(g)

**(a) Diff exacto: cumplido.** `git diff --stat` muestra 2 archivos, 2 inserciones y 2 borrados. Las líneas son run.mjs:19 (`3e34029d…4d7481` → `b511cd9d…7b75e3`) y run-b02.mjs:29 (`0f936942…cb84` → `9682dc26…1324`). `git status --short` solo muestra esos dos archivos con `M`.

**(b) axe: cumplido.**
- `sha256sum` del working tree, `git show HEAD:` y `git show 42e3b9e:` dan `b511cd9dec01c76f4b2ad1723b66b6db37d4c2eb4ed199076e1829d9ee7b75e3` en los tres casos.
- El blob id es `aebfb0c135a8aca8be3dff8b9a10dd1a07fb4b63` en HEAD y en 42e3b9e.
- `git log -- tests/vendor/axe.min.js` solo devuelve 42e3b9e, que es ancestro de HEAD.
- La cabecera es `/*! axe v4.10.2`.
- El archivo ocupa 553290 B, sin BOM y sin CRLF.
- Calculado como lo hace run.mjs:972-973 (`readFile` en utf8 y `createHash().update(string)`), da el mismo b511cd9d…. El fichero es UTF-8 válido, así que la ida y vuelta por string no altera los bytes.

**(c) run.mjs: cumplido.**
- `sha256sum` del run.mjs actual da `9682dc26e682e88a86bb07e91869959b6f9cfe1c7c60afc95268fd7a4c2d1324`.
- El de HEAD da `0f936942…cb84`, el valor aceptado en decisions.md:309.
- `loadD28Policy` (run-b02.mjs:92-94) lee `D28_RUNNER_PATH` (run-b02.mjs:27, ruta fija relativa al módulo) en utf8 y exige `sha256 === D28_RUNNER_SHA256`. Si no coincide, lanza `D28_SOURCE_DIGEST_NOT_EXPECTED`.
- `expectedSha256` es un parámetro con valor por defecto. Solo lo usa el test C1, que le pasa un `runnerPath` alterado (conditions-test.mjs:120-123). La ruta de producción (run-b02.mjs:276) lo llama sin argumentos.

**(d) Otras comprobaciones obsoletas.** Busqué en todo el repo, sin node_modules ni .git. No hay ningún otro pin ejecutable de axe ni de run.mjs:
- `harness-AUDIT-360-002`, `harness-TECH-AUDIT-001` y `harness-5A-001` leen o copian axe.min.js sin comprobar el hash;
- `harness-COMP-001` usa la CDN 4.10.2 sin pin;
- `harness-GPT-RD-001` importa su propio run.mjs;
- `.github`, `scripts` y `tests` no tienen hashes de 64 caracteres aplicables.

Referencias documentales que quedan obsoletas o históricas, sin efecto en el código:
- decisions.md:309 (0F93…): ver C1;
- decisions.md:271 (8C07…, snapshot más antiguo, ya histórico);
- CLAUDE-CLOUD-STATUS.md:88 (6219…, histórico);
- CLAUDE-CLOUD-STATUS.md:60 (fallo de AXE, queda resuelto);
- REVIEW-B02H-002.md:39;
- GPT-TEST-MATRICES-20261107-001.md:93 (dfb3…, variante CRLF);
- CLAUDE-SESION-20261110-TIENDA-001.md:29 y :73-74 (ver C2).

`salida-condiciones.txt` no contiene hashes. BOARD.md y RULES.md no fijan el SHA de run.mjs.

**(e) Guardia relajada lo justo: cumplido.**
- Los dos pins siguen siendo literales de 64 hex comparados con `===` contra el SHA-256 del contenido leído de una ruta fija (`ROOT/tests/vendor/axe.min.js` y `D28_RUNNER_PATH`).
- No se calculan en tiempo de ejecución, no se leen del entorno ni de argumentos y no tienen bypass.
- La comprobación de axe se ejecuta antes de `chromium.launch`, y el source que se inyecta es la misma string que se ha hasheado. Un axe distinto solo pasaría con una colisión de SHA-256.
- `AXE_VERSION='4.10.2'` y la verificación de la instancia controlada (run.mjs:677-679) no cambian.
- Lo único que se "relaja" es que el pin ahora coincide con el blob versionado, cuando antes coincidía con una variante CRLF que no está en git. Es la elección canónica, con el riesgo de C3.

**(f) Sintaxis y test local: cumplido.**
- `node --check` da exit 0 en run-b02.mjs y en run.mjs.
- `conditions-test.mjs` usa un servidor local en 127.0.0.1 y no lee credenciales. Lo ejecuté con `STOREFRONT_PASSWORD` y `SHOPIFY_CLI_THEME_TOKEN` eliminados del entorno, `PLAYWRIGHT_MODULE` local y timeout de 500 s. Resultado: exit 0 y «RESUMEN 49/49 comprobaciones correctas; POST recibidos por el servidor: 0».
- Incluye `PASS C1 run.mjs alterado no se carga` y los casos que cargan `loadD28Policy()` real con el pin nuevo. Coincide con las 49 PASS de `salida-condiciones.txt`.
- Después del test, `git status` sigue mostrando solo los dos `M`.

**(g) Re-aceptación: sí, hace falta.**
- docs/decisions.md:309 acepta run.mjs `0F936942D2056AD4F48C16F2144300A9A066DB0C4309DC6DEF09330C1F5DCB84`, que es el valor que deja de valer.
- REVIEW-B02H-002.md:39 basa la aceptación de B-02 en ese mismo valor.
- CLAUDE-SESION-20261110-TIENDA-001.md:29 ya preveía «hay que recalcular y reaceptar. Decisión de Gemini/Johandry».
- RULES.md y BOARD.md no fijan el SHA de run.mjs.

## Evidencia (comandos)

- `git diff --stat` → `2 files changed, 2 insertions(+), 2 deletions(-)`.
- `sha256sum tests/vendor/axe.min.js`, `git show HEAD:… | sha256sum` y `git show 42e3b9e:… | sha256sum` → `b511cd9d…7b75e3` las tres veces.
- `git rev-parse HEAD:tests/vendor/axe.min.js 42e3b9e:tests/vendor/axe.min.js` → `aebfb0c1…` dos veces.
- Node: `sha256(readFileSync(axe,'utf8').replace(/\n/g,'\r\n'))` → `3e34029d5a3db40742dde7ea7445e5101eb5073860f8698b2a92f091af4d7481` (el pin antiguo).
- Node, run.mjs: HEAD LF `0f936942…`, HEAD CRLF `dfb30247…`, working tree LF `9682dc26…`, working tree CRLF `ab917d70…`.
- `git ls-files --eol` → `i/lf w/lf attr/` en axe.min.js, run.mjs y run-b02.mjs. No hay `.gitattributes`.
- `git log -S3e34029d… -- run.mjs` → `bfddf79 2026-11-05`.
- Resultado `…T190050695Z…json`: 18 `axe_smoke` en `passed`, axeVersion 4.10.2.

## Afirmaciones

1. El diff contiene solo run.mjs:19 y run-b02.mjs:29.
2. axe.min.js tiene SHA b511cd9d… en HEAD, en el working tree y en 42e3b9e. El blob aebfb0c1 no ha cambiado y la cabecera es v4.10.2.
3. 3e34029d… = SHA de ese axe con CRLF.
4. El run.mjs del working tree tiene SHA 9682dc26…, y run-b02.mjs:94 lo exige mediante `loadD28Policy`.
5. No hay otros pins ejecutables de axe ni de run.mjs en el repo.
6. conditions-test.mjs da 49/49 PASS y 0 POST, sin tienda.
7. El snapshot aceptado en decisions.md:309 (0F93…) queda sustituido y necesita re-aceptación.
8. Sin `.gitattributes`, un checkout Windows con autocrlf haría fallar los dos pins nuevos.
