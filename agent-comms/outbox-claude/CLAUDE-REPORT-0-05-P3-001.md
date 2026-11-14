ID: CLAUDE-REPORT-0-05-P3-001
Estado: Entregado. Pruebas P1 a P7 ejecutadas offline (sin red, sin tiendas); hallazgos y límites declarados abajo. NO declara apto el arnés para evidencia de tienda (C8).
Decisión requerida: Pedir R-0 independiente (CLAUDE-REVIEW-LOTE-0-R0-002)
Resumen en 5 líneas:
1. P1 pasa: `node --check` exit 0 y 0 líneas `SyntaxError` en ambos gate5.
2. Hook sin red construido fuera de la base y autoprobado: sus testigos SÍ se crean (chromium exit 97, fetch exit 98, http(s) exit 99).
3. P2/P3: 26 casos (2 scripts x 3 contraseña + 2 scripts x 10 de datos) fallan con `GATE5_CONFIG` específico, exit 1, sin testigos, sin eco de valores y sin SyntaxError/MODULE_NOT_FOUND. P4: ambos scripts con datos válidos ficticios crean `chromium-launch.witness` y salen con 97; ningún otro testigo.
4. P5/P6 pasan: greps en 0, marcadores 2 y 1, literal 46/28 base y 0 en los 5 archivos, 0 líneas literal+contexto fuera de axe.min.js; preflight pre y post idénticos; el único archivo no rastreado nuevo es este informe (más el registro de decisión del otro agente).
5. P7: cero tiendas por construcción y por testigos; no se definió contraseña real, no se leyó `.secrets`, ningún `shopify theme`. No se encontró ningún defecto en los scripts; no se editó nada existente.
Archivos tocados: solo este archivo nuevo, `agent-comms/outbox-claude/CLAUDE-REPORT-0-05-P3-001.md`. Hook, loader, stub, autopruebas y runner viven fuera de la base (scratchpad) y se copian textualmente en el Anexo A. No se editó ningún gate5 ni otro archivo existente; sin `git add`, commit ni push.
Desviaciones (Nivel 1 o Nivel 2):
- Nivel 1. Escribir en `agent-comms/outbox-claude/` está autorizado por Johandry el 2026-11-04 (`CLAUDE-DECISION-0-05-P3-001.md`, D2: Claude único escritor; D5: sin ejecutar gate5 contra tiendas). Aquí solo se añade el informe.
- Nivel 1. P6 se adapta: las 8 rutas ya están en el commit `91f6e9f` (HEAD `790354c`, rama `lote0/base-09f8342`), no son un worktree sin commit. En vez de "8 rutas modificadas", P6 compara los SHA-256 de esas 8 rutas y `git diff --name-only 09f8342..91f6e9f` antes y después, y exige `git status --porcelain` limpio salvo archivos nuevos de outbox-claude.
- Nivel 1. Los hashes documentados (R-D §3, handoff §3) están calculados sobre CRLF; la copia de trabajo está en LF. Se calcularon ambos (LF tal cual y CRLF en memoria) y los CRLF coinciden con los documentados.
- Nivel 1. Primera pasada de pruebas (descartada y repetida entera): el ID ficticio inicial coincidía por azar con el literal sensible, lo que hizo que el informe lo contuviera (conteo del árbol 50/29). Se cambió el ID ficticio a `900700500` (comprobado en memoria que no contiene el literal), se repitieron autopruebas y los 28 casos y se regeneró el informe. Lección para el revisor: elegir IDs ficticios y comprobar el conteo del árbol con el informe ya escrito.
- Nivel 1. Se añadió a P2/P3 el caso "origen ausente/THEME_ID ausente/colección ausente/PDP ausente" (los scripts los validan), y a P2 se rellenaron las demás variables con ficticios.
Hallazgos extra fuera de alcance (con parche listo):
1. `scripts/gate5-complete-verification.mjs:88` imprime "Acceso al storefront concedido" sin verificar el desbloqueo (el `if` de 81-87 no tiene `else` ni comprobación posterior). Es un defecto de veracidad del log: con contraseña errónea o sin campo de contraseña igual imprime éxito. No se parchó (prohibido editar). Parche sugerido para un turno autorizado: mover el `console.log` dentro del `if` tras la navegación y comprobar que `input[type="password"]` ya no existe; en caso contrario `throw`. Mientras tanto el arnés no debe usarse como evidencia de desbloqueo. (live-verify:82-85 sí distingue "concedido" de "no solicitó", pero tampoco verifica que el desbloqueo haya tenido éxito.)
2. El literal sigue en la historia publicada `09f8342` (origin/master y rama de fix): la redacción CMP-01 solo afecta a HEAD. La mitigación es únicamente la rotación M2 (verificada por Johandry el 2026-11-02). Conteo en 09f8342: 2 en el handoff y 1 en el context-brief; en HEAD: 0.
3. Hashes en LF vs CRLF: los SHA-256 de los documentos de la R-D y del handoff son de la versión CRLF; la copia de este entorno es LF. Los de LF son distintos y están en §4 (P6). Debe fijarse la política CRLF/LF (bloqueo ya abierto) para que revisores en Windows y Linux comparen lo mismo.
4. Los scripts capturan los errores en el `catch` final (live:319-321, complete:334-336) y salen con exit 1: todo fallo de configuración da el mismo exit 1 (se distingue solo por el mensaje). Informativo.
5. Las variables validadas se imprimen en claro en el banner de P4 (origen y theme ID, líneas live:50-51 y complete:49-50). No es la contraseña; informativo.
6. `scripts/capture-presets.mjs` sigue con tienda e ID fijos (ya registrado en la R-D §4.4).
Verificación (comando, resultado y qué demuestra/qué no): ver §3 a §9 (comandos y salidas literales). Demuestran, offline: sintaxis, orden de validación respecto de la primera red, mensajes específicos y sin eco, que la ruta válida llega a `chromium.launch`, ausencia de fallback y de constantes fijas, conteos del literal y diff acotado. No demuestran: el comportamiento del arnés contra una tienda real, la corrección de los selectores/aserciones, que los nombres de variable coincidan con la ficha del candidato (C3, campos PENDIENTE), ni que el desbloqueo funcione.
Lista de afirmaciones falsables numeradas:
1. `node --check` sale con 0 en `scripts/gate5-live-verify.mjs` y `scripts/gate5-complete-verification.mjs`, con 0 líneas `SyntaxError`.
2. Con el hook activo y `env -i`, la autoprueba de `chromium.launch` crea `chromium-launch.witness` y sale 97; la de `fetch` crea `fetch.witness` y sale 98; la de `https.request` crea `http-request.witness` y sale 99.
3. Los 26 casos P2/P3 (13 por script) salen con exit 1, `ls -A $WITNESS_DIR` vacío, un único mensaje `GATE5_CONFIG: ...` y 0 coincidencias de SyntaxError/ERR_MODULE_NOT_FOUND.
4. En los 12 casos con un valor malo marcado (6 por script), ningún valor ficticio malo (`badmarker-*`) aparece en la salida.
5. P4: ambos scripts, con datos válidos ficticios, crean `chromium-launch.witness`, salen con 97 y no crean otro testigo.
6. En cada gate5, `page.goto(` aparece 3 veces y las 3 llevan `preview_theme_id=${THEME_ID}`.
7. En ambos gate5: `STOREFRONT_PASSWORD *||` = 0, `REDACTED` = 0, `tema-qkqpke0j|166186909939|cashmere-rib-crew|https://` = 0.
8. Marcadores CMP-01: handoff 2, context-brief 1.
9. Literal: total de la base 46 en 28 archivos; 0 en los 5 archivos de la R-D §3 en disco y en HEAD; 0 líneas literal+contexto de contraseña fuera de `tests/vendor/axe.min.js` (1 línea dentro).
10. Los SHA-256 y la lista de `git diff --name-only 09f8342..91f6e9f` son idénticos antes y después; `git status --porcelain` solo muestra archivos nuevos de `agent-comms/outbox-claude/`.
11. El `fetch` de los scripts (live:201,269,276; complete:186,287,293) se ejecuta dentro de `page.evaluate`, es decir en el navegador y no en Node.
12. Este informe no contiene ninguna contraseña real, cookie, token ni el literal sensible.

# 1. Documentos usados

`agent-comms/RULES.md` §1.3-1.4; `agent-comms/outbox-claude/CLAUDE-HANDOFF-CLOUD-001.md`; `agent-comms/outbox-claude/CLAUDE-REVIEW-0-05-P3-RD-001.md` (C1-C8, P1-P7, §3, §5); `agent-comms/outbox-claude/CLAUDE-DECISION-0-05-P3-001.md` (autorización D1-D5, no tocado); `scripts/gate5-live-verify.mjs` y `scripts/gate5-complete-verification.mjs` (leídos, sin editar). Entorno: Node v22.23.4; HEAD `790354c`, rama `lote0/base-09f8342`.

Preflight de entorno (solo nombres): `env | cut -d= -f1 | grep -E '^(STOREFRONT_|SHOPIFY_)'` no devolvió ningún nombre (0 variables). Todas las ejecuciones de gate5 usaron `env -i PATH="$PATH" HOME="$HOME" WITNESS_DIR=<dir nuevo vacío> <solo variables ficticias> node --import <hook> <script>`.

# 2. Tabla C1 a C8 (estado según esta ejecución)

| Cond. | Estado | Evidencia |
|---|---|---|
| C1 línea 5 sin `||` ni fallback | Cumple | `scripts/gate5-live-verify.mjs:5` y `scripts/gate5-complete-verification.mjs:5`: `const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD;`. `grep -c 'STOREFRONT_PASSWORD *||'` = 0 en ambos; `grep -c REDACTED` = 0. |
| C2 validación antes de `chromium.launch`/`goto`/`fetch`; vacío y espacios = ausente; sin eco; import dinámico después | Cumple | `validateConfiguration()` en live:9-43 y complete:9-43; llamada en live:46 y complete:46, antes de `await import('playwright')` (live:47, complete:47), `chromium.launch` (live:54, complete:53) y el primer `page.goto` (live:74, complete:79). `STORE_PASSWORD?.trim()` en línea 11 (ausente/""/espacios = ausente). Mensajes sin interpolar valores (líneas 10-41 solo interpolan el nombre de variable y el prefijo). P2/P3 lo demuestran por testigos. |
| C3 nombres y reglas fijados por directiva; concordancia con ficha sin archivos nuevos | Parcial | Nombres: líneas 3-7 de ambos (`STOREFRONT_ORIGIN`, `_THEME_ID`, `_PASSWORD`, `_COLLECTION_PATH`, `_PRODUCT_PATH`); reglas: líneas 14-42. No existe directiva previa que los fije; `CLAUDE-DECISION-0-05-P3-001.md` D1 los cubre solo por interpretación PENDIENTE de confirmación de Johandry. Sin archivos nuevos en la base. La concordancia con la ficha no se comprobó (campos PENDIENTE). |
| C4 sin add/commit/push/filtro/refs | Cumple en esta ejecución | `git status --porcelain` final solo muestra archivos nuevos de outbox-claude; HEAD `790354c` antes y después. (D4 autoriza commit/push posterior; no se hizo.) |
| C5 solo los dos gate5; docs CMP-01 congelados | Cumple | `git diff --name-only 09f8342..91f6e9f` = 8 rutas, sin cambios nuevos; SHA-256 CRLF `d21c0771…` (handoff) y `2b9ce244…` (context-brief) idénticos a la R-D §3. Esta ejecución no editó ningún archivo existente. |
| C6 un solo escritor; preflight inicio/fin | Cumple | `preflight-pre.txt` y `preflight-post.txt` idénticos (`diff` sin salida; ver §4). |
| C7 M2 sin probar claves | Cumple | Ninguna contraseña real definida; solo `dummy-not-a-password`; `.secrets` no abierto (el contador de literal lo excluye del recorrido). |
| C8 incluye P1-P7 y no declara apto el arnés | Cumple | Este informe. NO se declara apto para evidencia de tienda: falta ficha completa de Antigravity, revisión independiente y resolver el hallazgo 1. |

# 3. P0 Preflight (inicio) y P6 comparación final

Comando: `git rev-parse --short HEAD`; `git status --porcelain`; `git diff --name-only 09f8342..91f6e9f`; SHA-256 de cada ruta (LF tal cual y CRLF en memoria: `data.replace(b"\r\n",b"\n").replace(b"\n",b"\r\n")`).

Salida literal (inicio):
```
HEAD=790354c branch=lote0/base-09f8342
--- status --porcelain
?? agent-comms/outbox-claude/CLAUDE-DECISION-0-05-P3-001.md
--- diff --name-only 09f8342..91f6e9f
agent-comms/outbox-claude/CLAUDE-HANDOFF-SESSION-002.md
agent-comms/outbox-gpt/harness-GPT-018/context-brief.md
assets/base.css
assets/product-zoom.js
assets/theme.js
listings/sartorial/templates/index.json
scripts/gate5-complete-verification.mjs
scripts/gate5-live-verify.mjs
--- sha256 LF-as-is | CRLF-in-memory
agent-comms/outbox-claude/CLAUDE-HANDOFF-SESSION-002.md LF=d1146ccae25f59e98ac4b30f5d8e1aebffb14b569b086cc58d3041ab85d6815b CRLF=d21c0771b713de707d2afb4cab477270a76ec1c949e6226ce5067870f38afe3f
agent-comms/outbox-gpt/harness-GPT-018/context-brief.md LF=b27fd1c97a0958a2a5b1dbd306d8cba321a38f342428acd0e88e262b5c901722 CRLF=2b9ce24406b0cc4b3950e6b39b7b9956ba6dfdbed4e71a978f4265f5d0c376ef
assets/base.css LF=ffd6944877841c8d59a3a29ea388f345675e0d7774eee5db8cf5321e0220eb02 CRLF=5d9ed6b2981f115d9fca06406a47a6ff784e63023883ea1e88f49ec84429af43
assets/product-zoom.js LF=b4d71ef3a262bdd791ec76b95c5bb68a49b8d8a5ac65d11ec1c2eacae2b23d9b CRLF=4828d5a15471330e4d82f52bd16016c3ef1e71e2f53d275e9dc3cab28aa6c246
assets/theme.js LF=024ba08f31f4d20c9b918ba6eab8580c520d44279d7da10e92f251c95d4f5853 CRLF=db2f2a6efd27f45b4a0bf68a1368f2598adceedddd207784c26e6632eac56a9c
listings/sartorial/templates/index.json LF=bbb31533960ed0ded1c3fac0750a7c558abc0ee3d723567ea477d9cb0adb534b CRLF=9e50aea4a4896438b66191d7044e0eb1dae68083d5563c45b910ac3c3aac1768
scripts/gate5-complete-verification.mjs LF=f0ed53f9e9e03edaaa491446b44c705f0021ca3fbcdb02973c6d4a0b986a9793 CRLF=288f9ae11c6edb5a2362d7e80be00ee120406676ac3bd631e0239413eeed99dc
scripts/gate5-live-verify.mjs LF=cf21ac580af08a3fdd8219420cf3c3de4dd8125177c23e283c61d552e180e009 CRLF=25724afe84778a9da44c74d4267b10b4374a9915ba54966bc6a4de9d63cfeb4a
```

Final: `diff preflight-pre.txt preflight-post.txt` -> sin diferencias ("PRE==POST identicos"). Salida final de `git status --porcelain` tras escribir este informe:
```
?? agent-comms/outbox-claude/CLAUDE-DECISION-0-05-P3-001.md
?? agent-comms/outbox-claude/CLAUDE-REPORT-0-05-P3-001.md
```
`git diff --numstat 09f8342..91f6e9f -- scripts/`: `51 8 scripts/gate5-complete-verification.mjs`, `48 10 scripts/gate5-live-verify.mjs` (coincide con D1). Los hashes CRLF de los 4 archivos de producto (`5d9ed6b2…`, `db2f2a6e…`, `4828d5a1…`, `9e50aea4…`) y de los 2 documentos CMP-01 coinciden con la R-D §3; los de los 2 scripts coinciden con el handoff (`25724afe…`, `288f9ae1…`). Los hashes LF son los que aparecen en la columna `LF=` y son los efectivos en este entorno.

# 4. P1 Sintaxis

Comando: `node --check <script> > out 2>&1; echo exit=$?; grep -c SyntaxError out`
```
scripts/gate5-live-verify.mjs exit=0 SyntaxError_lines=0
scripts/gate5-complete-verification.mjs exit=0 SyntaxError_lines=0
```
Demuestra: ambos compilan. No demuestra comportamiento.

# 5. Hook sin red y autoprueba de testigos

Hook, loader, stub y autopruebas: Anexo A (copia textual). Comando de autoprueba, por caso y con `WITNESS_DIR` nuevo y vacío: `env -i PATH="$PATH" HOME="$HOME" WITNESS_DIR=$W node --import no-net-hook.mjs selftest-<t>.mjs`.
```
selftest=chromium exit=97 salida=[NO_NET_STUB: chromium.launch bloqueado] testigos=[chromium-launch.witness ]
selftest=fetch exit=98 salida=[NO_NET_STUB: fetch bloqueado] testigos=[fetch.witness ]
selftest=http exit=99 salida=[NO_NET_STUB: https.request bloqueado] testigos=[http-request.witness ]
```
Demuestra que los testigos funcionan (se crean) y que los códigos son 97/98/99. Sin esto, la ausencia de testigos en P2/P3 no probaría nada.

# 6. P2, P3 y P4: tabla por script y caso

Convención de cada comando: `env -i PATH="$PATH" HOME="$HOME" WITNESS_DIR=<dir nuevo vacío> <variables> node --import <hook> scripts/<script>`. Valores ficticios: `STOREFRONT_ORIGIN=https://example-dummy.invalid`, `STOREFRONT_THEME_ID=900700500`, `STOREFRONT_COLLECTION_PATH=/collections/dummy`, `STOREFRONT_PRODUCT_PATH=/products/dummy`, `STOREFRONT_PASSWORD=dummy-not-a-password`. Valores malos con marca `badmarker-*` para detectar eco. Comando completo y salida íntegra de cada caso: `runner-out.txt` generado por `runner.sh` (Anexo A).

| Script | Caso | Exit | Testigos | Eco del valor | SyntaxError/MODULE_NOT_FOUND | Última línea de salida literal |
|---|---|---:|---|---|---:|---|
| live-verify.mjs | P2a password ausente | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_PASSWORD is required.` |
| live-verify.mjs | P2b password vacia | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_PASSWORD is required.` |
| live-verify.mjs | P2c password solo espacios | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_PASSWORD is required.` |
| live-verify.mjs | P3a origen ausente | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_ORIGIN is required.` |
| live-verify.mjs | P3b origen http:// | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.` |
| live-verify.mjs | P3c origen con ruta | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.` |
| live-verify.mjs | P3d origen con query | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.` |
| live-verify.mjs | P3e THEME_ID no numerico | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_THEME_ID must be a positive decimal ID.` |
| live-verify.mjs | P3f THEME_ID ausente | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_THEME_ID is required.` |
| live-verify.mjs | P3g coleccion sin /collections/ | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_COLLECTION_PATH must be a canonical /collections/ path without query or fragment.` |
| live-verify.mjs | P3h coleccion ausente | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_COLLECTION_PATH is required.` |
| live-verify.mjs | P3i PDP sin /products/ | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_PRODUCT_PATH must be a canonical /products/ path without query or fragment.` |
| live-verify.mjs | P3j PDP ausente | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_PRODUCT_PATH is required.` |
| live-verify.mjs | P4 todo valido ficticio | 97 | chromium-launch.witness | NA | 0 | `NO_NET_STUB: chromium.launch bloqueado` |
| complete-verification.mjs | P2a password ausente | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_PASSWORD is required.` |
| complete-verification.mjs | P2b password vacia | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_PASSWORD is required.` |
| complete-verification.mjs | P2c password solo espacios | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_PASSWORD is required.` |
| complete-verification.mjs | P3a origen ausente | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_ORIGIN is required.` |
| complete-verification.mjs | P3b origen http:// | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.` |
| complete-verification.mjs | P3c origen con ruta | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.` |
| complete-verification.mjs | P3d origen con query | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.` |
| complete-verification.mjs | P3e THEME_ID no numerico | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_THEME_ID must be a positive decimal ID.` |
| complete-verification.mjs | P3f THEME_ID ausente | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_THEME_ID is required.` |
| complete-verification.mjs | P3g coleccion sin /collections/ | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_COLLECTION_PATH must be a canonical /collections/ path without query or fragment.` |
| complete-verification.mjs | P3h coleccion ausente | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_COLLECTION_PATH is required.` |
| complete-verification.mjs | P3i PDP sin /products/ | 1 | (ninguno) | no-eco | 0 | `GATE5_CONFIG: STOREFRONT_PRODUCT_PATH must be a canonical /products/ path without query or fragment.` |
| complete-verification.mjs | P3j PDP ausente | 1 | (ninguno) | NA | 0 | `GATE5_CONFIG: STOREFRONT_PRODUCT_PATH is required.` |
| complete-verification.mjs | P4 todo valido ficticio | 97 | chromium-launch.witness | NA | 0 | `NO_NET_STUB: chromium.launch bloqueado` |

Salidas literales completas de P2 (script live-verify; complete-verification idéntico):
```
--- live-verify.mjs P2a password ausente (exit 1):
GATE5_CONFIG: STOREFRONT_PASSWORD is required.
--- live-verify.mjs P2b password vacia (exit 1):
GATE5_CONFIG: STOREFRONT_PASSWORD is required.
--- live-verify.mjs P2c password solo espacios (exit 1):
GATE5_CONFIG: STOREFRONT_PASSWORD is required.
--- complete-verification.mjs P2a password ausente (exit 1):
GATE5_CONFIG: STOREFRONT_PASSWORD is required.
--- complete-verification.mjs P2b password vacia (exit 1):
GATE5_CONFIG: STOREFRONT_PASSWORD is required.
--- complete-verification.mjs P2c password solo espacios (exit 1):
GATE5_CONFIG: STOREFRONT_PASSWORD is required.
```
Salidas literales completas de P4:
```
--- live-verify.mjs P4 (exit 97):
======================================================================
GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO
Tienda: https://example-dummy.invalid
Tema ID: 900700500 (Sartorial)
======================================================================
NO_NET_STUB: chromium.launch bloqueado
--- complete-verification.mjs P4 (exit 97):
===========================================================================
COMPROBACIÓN INTEGRAL GATE 5: https://example-dummy.invalid
Theme ID: 900700500 (Sartorial)
===========================================================================
NO_NET_STUB: chromium.launch bloqueado
```
Verificación estática de P4: `grep -c 'page\.goto('` = 3 y `grep 'page\.goto(' | grep -c 'preview_theme_id=${THEME_ID}'` = 3 en ambos scripts (live:74,99,142; complete:79,92,126; la ruta de PDP viene de `PRODUCT_PATH`: live:139, complete:126).

Demuestra: la validación corre antes de cualquier navegador; los mensajes son específicos; la ruta válida llega a `chromium.launch` (no bloquea siempre); ningún valor ficticio malo se repite. No demuestra: que `playwright` real se resuelva (el stub lo sustituye; el import dinámico está después de validar), ni comportamiento posterior al launch.

# 7. P5 Conteos

Comandos y salidas (por script, en `scripts/`):
```
live-verify:      'STOREFRONT_PASSWORD *||'=0  REDACTED=0  'tema-qkqpke0j|166186909939|cashmere-rib-crew|https://'=0
complete-verif.:  'STOREFRONT_PASSWORD *||'=0  REDACTED=0  'tema-qkqpke0j|166186909939|cashmere-rib-crew|https://'=0
marcadores: CLAUDE-HANDOFF-SESSION-002.md:2  context-brief.md:1
```
`python3 -I .../count-literal.py` (desde la raíz de la base):
```
candidatos_distintos= 1
scripts/gate5-live-verify.mjs disco= 0 09f8342= 0 HEAD= 0
scripts/gate5-complete-verification.mjs disco= 0 09f8342= 0 HEAD= 0
agent-comms/outbox-claude/CLAUDE-HANDOFF-SESSION-002.md disco= 0 09f8342= 2 HEAD= 0
agent-comms/reviews/GEMINI-REVIEW-V1.1.0-PHASE2.md disco= 0 09f8342= 0 HEAD= 0
agent-comms/outbox-gpt/harness-GPT-018/context-brief.md disco= 0 09f8342= 1 HEAD= 0
total_arbol= 46 archivos= 28
```
Conteo adicional (script propio `count-ctx.py`, Anexo A; deriva el literal en memoria y solo imprime números): líneas con el literal y contexto de contraseña (`pass|password|pwd|contrase|clave|secret|credential|STORE_PASSWORD|STOREFRONT_PASSWORD`, sin distinguir mayúsculas) fuera de `tests/vendor/axe.min.js`:
```
lineas_literal_con_contexto_fuera_axe= 0 archivos= 0 | en_axe.min.js= 1
```
Demuestra: 0 exposición como contraseña en los 5 archivos de la tabla R-D §3, sin aumento del total legítimo (46/28). El recorrido excluye `.git`, `.secrets` y `node_modules`. No demuestra nada sobre la historia publicada (`09f8342` conserva el literal, ver hallazgo 2).

# 8. P7 Declaración de cero tiendas

1. No se definió ningún `STOREFRONT_PASSWORD` real: los únicos valores usados son los ficticios de §6 (evidencia: el comando de cada caso en `runner-out.txt`, hecho con `env -i`, que impide heredar variables; y el preflight de entorno: 0 nombres `STOREFRONT_*`/`SHOPIFY_*`).
2. No se leyó ni listó `.secrets`; el contador de literal lo excluye explícitamente del recorrido.
3. Todas las ejecuciones de los gate5 (28 casos P2-P4) se hicieron con el hook activo (`node --import no-net-hook.mjs`) y `env -i`. Ningún gate5 se ejecutó sin hook.
4. No se ejecutó `shopify theme` ni ningún conector de tienda; no hubo red hacia tiendas.
5. Evidencia: los testigos de P2-P4. En 26 casos de configuración (P2/P3) no se creó ningún testigo; en los 2 casos P4 solo se creó `chromium-launch.witness`; el único `chromium.launch` fue el stub (exit 97).

Nota obligatoria sobre `fetch`: los `fetch` de los scripts (live:201,269,276; complete:186,287,293) están dentro de `page.evaluate`, es decir se ejecutan en el navegador, no en Node. El testigo de `fetch` de Node (y el de `net.connect`/`http(s).request`) es defensivo: demuestra que el proceso Node de los scripts no hizo `fetch` ni conexión directa; no demuestra nada sobre las llamadas del navegador. La garantía real de "sin red" es que el stub aborta en `chromium.launch` antes de crear página y que los 26 casos de configuración salen antes de importar playwright. Ninguna de las dos garantías cubre el tráfico de un navegador real si el stub se retirara.

# 9. Limitaciones

Revisión offline. No demuestra: apto para evidencia de tienda (C8), que los nombres de variable coincidan con la ficha del candidato (C3), que el selector/aserciones del arnés sean correctos, ni el desbloqueo real. D1 es de proceso, no de calidad técnica; la R-0 independiente debe repetir P1-P5 y confirmar con Johandry la interpretación de D1 sobre C3.

# Anexo A. Hook, loader, stub, autopruebas, runner y contador (copia textual; no se añaden al repo)

Directorio de trabajo usado: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/p3` (loader y stub se resuelven relativos al hook).

## A.1 `no-net-hook.mjs`
```js
import { register, createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import net from 'node:net';
import http from 'node:http';
import https from 'node:https';
register('./no-net-loader.mjs', import.meta.url);

function trip(name, code, msg) {
  try { writeFileSync(`${process.env.WITNESS_DIR}/${name}.witness`, `${name} called\n`); } catch {}
  console.error(msg);
  process.exit(code);
}
globalThis.fetch = function () { trip('fetch', 98, 'NO_NET_STUB: fetch bloqueado'); };
// defensivo: sockets y http(s) via CJS-shared module objects
net.connect = net.createConnection = function () { trip('net-connect', 99, 'NO_NET_STUB: net.connect bloqueado'); };
http.request = http.get = function () { trip('http-request', 99, 'NO_NET_STUB: http.request bloqueado'); };
https.request = https.get = function () { trip('http-request', 99, 'NO_NET_STUB: https.request bloqueado'); };
```
## A.2 `no-net-loader.mjs`
```js
import { pathToFileURL } from 'node:url';
const STUB = pathToFileURL(new URL('./stub-playwright.mjs', import.meta.url).pathname).href;
const BLOCKED = new Set(['playwright', 'playwright-core', '@playwright/test']);
export async function resolve(specifier, context, nextResolve) {
  if (BLOCKED.has(specifier)) return { url: STUB, shortCircuit: true };
  return nextResolve(specifier, context);
}
```
## A.3 `stub-playwright.mjs`
```js
import { writeFileSync } from 'node:fs';
function launch() {
  const dir = process.env.WITNESS_DIR;
  writeFileSync(`${dir}/chromium-launch.witness`, 'chromium.launch called\n');
  console.error('NO_NET_STUB: chromium.launch bloqueado');
  process.exit(97);
}
export const chromium = { launch };
export default { chromium };
```
## A.4 Autopruebas
`selftest-chromium.mjs`
```js
const { chromium } = await import('playwright');
await chromium.launch({ headless: true });
console.log('NO DEBERIA LLEGAR');
```
`selftest-fetch.mjs`
```js
await fetch('https://example-dummy.invalid/');
console.log('NO DEBERIA LLEGAR');
```
`selftest-http.mjs`
```js
import https from 'node:https';
https.request('https://example-dummy.invalid/');
console.log('NO DEBERIA LLEGAR');
```
## A.5 `runner.sh`
```bash
#!/bin/bash
# Runner de P2-P4. Todos los valores son ficticios. Uso: runner.sh <outfile>
SCR=/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/p3
cd /home/user/Tema-Shopify
OUT=$1; : > "$OUT"
SCRIPTS="scripts/gate5-live-verify.mjs scripts/gate5-complete-verification.mjs"
D_ORIGIN='https://example-dummy.invalid'; D_ID='900700500'; D_COL='/collections/dummy'; D_PRD='/products/dummy'; D_PW='dummy-not-a-password'
# run_case <script> <case> <echo-marker or -> VAR=VAL...   (solo las VAR=VAL listadas se pasan al proceso)
run_case() {
  local s=$1 name=$2 marker=$3; shift 3
  local W; W=$(mktemp -d "$SCR/w-XXXXXX")
  local cmd="env -i PATH=\$PATH HOME=\$HOME WITNESS_DIR=<new-empty-dir> $* node --import $SCR/no-net-hook.mjs $s"
  local o; o=$(env -i PATH="$PATH" HOME="$HOME" WITNESS_DIR="$W" "$@" node --import "$SCR/no-net-hook.mjs" "$s" 2>&1); local rc=$?
  local wit; wit=$(ls -A "$W" | tr '\n' ' ')
  local echoed=NA
  if [ "$marker" != "-" ]; then echo "$o" | grep -qF -- "$marker" && echoed=SI-ECO || echoed=no-eco; fi
  local bad=$(echo "$o" | grep -cE 'SyntaxError|ERR_MODULE_NOT_FOUND')
  {
    echo "=== script=$s | caso=$name"
    echo "cmd: $cmd"
    echo "exit=$rc | testigos=[${wit}] | eco_valor=$echoed | SyntaxError/ERR_MODULE_NOT_FOUND=$bad"
    echo "salida:"; echo "$o" | sed 's/^/  | /'
    echo
  } >> "$OUT"
}
for s in $SCRIPTS; do
  # P2: password ausente / "" / espacios (resto valido)
  V="STOREFRONT_ORIGIN=$D_ORIGIN STOREFRONT_THEME_ID=$D_ID STOREFRONT_COLLECTION_PATH=$D_COL STOREFRONT_PRODUCT_PATH=$D_PRD"
  run_case $s "P2a password ausente" - $V
  run_case $s "P2b password vacia" - $V STOREFRONT_PASSWORD=
  run_case $s "P2c password solo espacios" - $V "STOREFRONT_PASSWORD=   "
  # P3: password ficticia + un campo malo
  P="STOREFRONT_PASSWORD=$D_PW"
  run_case $s "P3a origen ausente" - $P STOREFRONT_THEME_ID=$D_ID STOREFRONT_COLLECTION_PATH=$D_COL STOREFRONT_PRODUCT_PATH=$D_PRD
  run_case $s "P3b origen http://" badmarker-http STOREFRONT_ORIGIN=http://badmarker-http.invalid $P STOREFRONT_THEME_ID=$D_ID STOREFRONT_COLLECTION_PATH=$D_COL STOREFRONT_PRODUCT_PATH=$D_PRD
  run_case $s "P3c origen con ruta" badmarker-path STOREFRONT_ORIGIN=https://example-dummy.invalid/badmarker-path $P STOREFRONT_THEME_ID=$D_ID STOREFRONT_COLLECTION_PATH=$D_COL STOREFRONT_PRODUCT_PATH=$D_PRD
  run_case $s "P3d origen con query" badmarker-query STOREFRONT_ORIGIN='https://example-dummy.invalid?badmarker-query=1' $P STOREFRONT_THEME_ID=$D_ID STOREFRONT_COLLECTION_PATH=$D_COL STOREFRONT_PRODUCT_PATH=$D_PRD
  run_case $s "P3e THEME_ID no numerico" badmarker-id STOREFRONT_ORIGIN=$D_ORIGIN $P STOREFRONT_THEME_ID=badmarker-id STOREFRONT_COLLECTION_PATH=$D_COL STOREFRONT_PRODUCT_PATH=$D_PRD
  run_case $s "P3f THEME_ID ausente" - STOREFRONT_ORIGIN=$D_ORIGIN $P STOREFRONT_COLLECTION_PATH=$D_COL STOREFRONT_PRODUCT_PATH=$D_PRD
  run_case $s "P3g coleccion sin /collections/" badmarker-col STOREFRONT_ORIGIN=$D_ORIGIN $P STOREFRONT_THEME_ID=$D_ID STOREFRONT_COLLECTION_PATH=/badmarker-col/dummy STOREFRONT_PRODUCT_PATH=$D_PRD
  run_case $s "P3h coleccion ausente" - STOREFRONT_ORIGIN=$D_ORIGIN $P STOREFRONT_THEME_ID=$D_ID STOREFRONT_PRODUCT_PATH=$D_PRD
  run_case $s "P3i PDP sin /products/" badmarker-prd STOREFRONT_ORIGIN=$D_ORIGIN $P STOREFRONT_THEME_ID=$D_ID STOREFRONT_COLLECTION_PATH=$D_COL STOREFRONT_PRODUCT_PATH=/badmarker-prd/dummy
  run_case $s "P3j PDP ausente" - STOREFRONT_ORIGIN=$D_ORIGIN $P STOREFRONT_THEME_ID=$D_ID STOREFRONT_COLLECTION_PATH=$D_COL
  # P4: todo valido ficticio
  run_case $s "P4 todo valido ficticio" - STOREFRONT_ORIGIN=$D_ORIGIN $P STOREFRONT_THEME_ID=$D_ID STOREFRONT_COLLECTION_PATH=$D_COL STOREFRONT_PRODUCT_PATH=$D_PRD
done
```
## A.6 `preflight.sh`
```bash
#!/bin/bash
cd /home/user/Tema-Shopify
echo "HEAD=$(git rev-parse --short HEAD) branch=$(git branch --show-current)"
echo "--- status --porcelain"; git status --porcelain
echo "--- diff --name-only 09f8342..91f6e9f"; git diff --name-only 09f8342..91f6e9f
echo "--- sha256 LF-as-is | CRLF-in-memory"
for f in $(git diff --name-only 09f8342..91f6e9f); do
  lf=$(sha256sum "$f" | cut -d' ' -f1)
  crlf=$(python3 -I -c "import sys,hashlib;d=open(sys.argv[1],'rb').read().replace(b'\r\n',b'\n').replace(b'\n',b'\r\n');print(hashlib.sha256(d).hexdigest())" "$f")
  echo "$f LF=$lf CRLF=$crlf"
done
```
## A.7 `count-ctx.py` (extiende `count-literal.py`; solo imprime números)
```python
# Uso: cd /home/user/Tema-Shopify && python3 -I <ruta>/count-literal.py
# Deriva el literal SOLO en memoria (09f8342 vs HEAD, junto al marcador CMP-01) y solo imprime conteos.
import subprocess, os
M = b'[REDACTED_STOREFRONT_PASSWORD]'
def blob(rev, p): return subprocess.run(['git', 'show', f'{rev}:{p}'], capture_output=True, check=True).stdout
cands = set()
for p in ['agent-comms/outbox-claude/CLAUDE-HANDOFF-SESSION-002.md', 'agent-comms/outbox-gpt/harness-GPT-018/context-brief.md']:
    old = blob('09f8342', p).split(b'\n'); new = blob('HEAD', p).split(b'\n')
    assert len(old) == len(new)
    for o, n in zip(old, new):
        if o != n:
            i = n.index(M); pre = n[:i]; suf = n[i + len(M):]
            assert o.startswith(pre) and o.endswith(suf)
            cands.add(o[len(pre):len(o) - len(suf)] if suf else o[len(pre):])
assert len(cands) == 1
lit = cands.pop()
import re
ctx = re.compile(rb'(?i)pass(word|wd)?|pwd|contrase|clave|secret|credential|STORE_PASSWORD|STOREFRONT_PASSWORD')
n_ctx = 0; n_ctx_axe = 0; n_ctx_files = set()
for root, dirs, fs in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in ('.git', '.secrets', 'node_modules')]
    for fn in fs:
        p = os.path.join(root, fn)
        if os.path.islink(p): continue
        for line in open(p, 'rb').read().split(b'\n'):
            if lit in line and ctx.search(line):
                if p.endswith('tests/vendor/axe.min.js'): n_ctx_axe += 1
                else: n_ctx += 1; n_ctx_files.add(p)
print('lineas_literal_con_contexto_fuera_axe=', n_ctx, 'archivos=', len(n_ctx_files), '| en_axe.min.js=', n_ctx_axe)
```
