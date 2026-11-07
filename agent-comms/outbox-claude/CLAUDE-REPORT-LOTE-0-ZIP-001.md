ID: CLAUDE-REPORT-LOTE-0-ZIP-001
Estado: Entregado, sin commit (pendiente de autorización de commit)
Decisión requerida: Johandry / coordinador: aceptar el hash canónico propuesto (sección «Hash canónico propuesto»). Cualquier re-fijación posterior del hash la autoriza Johandry.
Resumen en 5 líneas:
1. Se publica `scripts/package-theme-zip.mjs` (319 líneas, solo módulos built-in de Node): empaquetador determinista desde blobs de git (D21).
2. SHA-256 canónico propuesto, de HEAD `8e1646e`: `f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585`, 287165 bytes, 93 archivos, zlib `1.3.1-e00f703` (Node 22.23.4).
3. Dos generaciones en rutas distintas y las revisiones `91f6e9f` y `fbdf462` dan el mismo SHA-256: los commits documentales no alteran el hash.
4. El ZIP extraído coincide 93/93 con el manifiesto LF de la ficha de Antigravity; `unzip -t` y `zipfile` de Python sin errores.
5. `79ff3961…` queda como referencia histórica no reproducible; el script de Antigravity sigue dando `3629d9d4…` (289834 bytes) y no se modificó.
Archivos tocados: `scripts/package-theme-zip.mjs` (nuevo, 319 líneas tras la revisión CLAUDE-REVIEW-LOTE-0-ZIP-001) y este archivo (nuevo). No se tocó `package.json`, `BOARD.md` ni `scripts/gate5-complete-verification.mjs`.
Desviaciones (Nivel 1 o Nivel 2): Ninguna. No se añadió el script npm `package:zip` (opcional; evita tocar `package.json` y hay `theme:package`/`gates:package` ya con otro significado).
Hallazgos extra fuera de alcance (con parche listo): (1) La salida depende de la zlib (ver «Límite de reproducibilidad»). (2) Para Antigravity: `package-reproducible-zip.py:105-112` comprime en realidad a nivel 6 aunque declare `compresslevel=9`, y la §4 de `GEMINI-FICHA-LOTE-0-BASE-001.md` dice nivel 9; no se modifica su script.
Verificación (comando, resultado y qué demuestra/qué no): Ver «Verificación». Demuestra determinismo en este entorno (misma máquina, mismo Node/zlib), contenido y metadatos del ZIP. Demuestra también que otra zlib (Node 24.22.1, zlib 1.3.2.1-motley-285e94b) da el mismo ZIP. No demuestra reproducibilidad con `.nvmrc` 22.12.0 ni con el Node 20 de CI, ni nada sobre tiendas; no se ejecutó gate5.
Lista de afirmaciones falsables numeradas: ver al final.

# Contrato del empaquetador

Archivo: `scripts/package-theme-zip.mjs`. Uso: `node scripts/package-theme-zip.mjs [--rev <rev>] --out <ruta.zip> [--expect-count N] [--expect-sha256 HEX] [--expect-content-sha256 HEX]`.

- Fuente: `git ls-tree -r -z --full-tree <commit>` y `git cat-file blob`; nunca el árbol de trabajo. Si un blob de texto incluido contiene CR (0x0D) el script falla; regla de texto: extensión `.liquid .json .css .js .svg .md .txt` y sin bytes NUL (los demás blobs, p. ej. PNG, se tratan como binarios y no se inspeccionan). Entradas que no sean blob 100644/100755 fallan.
- Inclusión: `assets/ config/ layout/ locales/ sections/ snippets/ templates/ listings/`, y `blocks/`, `release-notes.md` y `update_extension.json` (raíz, este último lo incluye el CLI 4.8.0) si existen en la revisión (hoy no existen). `listings/` (9 archivos en HEAD) coincide con `listings/**/*` del CLI 4.8.0 (condición (b) de la R0-002). Constante `EXCLUDED_PATHS` explícita y vacía (uso previsto en C-04-P para `templates/page.documentation.json` y `templates/page.support.json`).
- Orden: bytes UTF-8 de la ruta, ascendente. Sin entradas de directorio.
- Fecha: `git -c log.showSignature=false log -1 --format="%H %ct" <commit> -- <directorios incluidos y archivos de raíz>` con pathspecs `:(literal)` y `:(literal,exclude)` por cada `EXCLUDED_PATHS` (borrados y exclusiones cuentan) (committer UTC), a fecha/hora DOS UTC; los segundos impares se redondean hacia abajo al par. Sin extra fields.
- Metadatos: version made by 0x0314 (Unix, 2.0), version needed 20, external_attr `0o100644 << 16`, flags 0 (0x0800 por entrada solo en rutas no ASCII), sin comentario.
- Compresión: método 8, `deflateRawSync` con level 9, memLevel 8, windowBits 15, estrategia por defecto. CRC-32 con `zlib.crc32` (o tabla propia si no existe).
- `--out` es obligatorio; debe terminar en `.zip`; se rechaza una ruta dentro de los directorios del tema o igual a un archivo de raíz incluido (comparación en minúsculas en win32/darwin) y un directorio existente. Con `--expect-count`, `--expect-sha256` o `--expect-content-sha256` distinto sale con exit 1.
- Clon superficial: si `git rev-parse --is-shallow-repository` es true y el commit de la fecha figura en el archivo `git rev-parse --git-path shallow`, falla con exit 1 indicando `git fetch --unshallow`.
- Huella de contenido (independiente de zlib y de la fecha): SHA-256 del texto de una línea por archivo, en el orden del ZIP, `ruta\0tamaño_decimal\0sha256_hex_del_contenido\n` (NUL real entre campos, LF tras cada línea, incluida la última).

# Hash canónico propuesto

- Revisión: HEAD `8e1646e467794ab5c0d0b1ba71e224d02e11ea72` (idéntico para `91f6e9f` y `fbdf462`).
- Par canónico (SHA-256 del ZIP, versión de zlib): (`f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585`, `1.3.1-e00f703`).
- Huella de contenido: `02bd3bc8d99c8c7ee1be8a87358139144bccbd0986d15525a43b49506ec9df34`.
- Tamaño: 287165 bytes. Archivos: 93. Fecha fija: 1793803722 = 2026-11-04T14:48:42Z.
- Versiones probadas: Node 22.23.4 / zlib `1.3.1-e00f703` y Node 24.22.1 / zlib `1.3.2.1-motley-285e94b` (`/opt/node24/bin/node`, repetido aquí y verificado antes por el revisor): ambas dan el mismo SHA-256 del ZIP y la misma huella de contenido. No se probaron `.nvmrc` 22.12.0 ni el Node 20 de CI.
- Ruta canónica de empaquetado: `scripts/package-theme-zip.mjs`. El script de Antigravity queda como histórico. `npm run theme:package` es humo de CI no determinista, no produce el hash canónico.
- Cualquier re-fijación del hash (otra zlib, C-04-P, C-04-R) la autoriza Johandry.

# Límite de reproducibilidad

El flujo deflate depende de la implementación de zlib; por eso el script imprime `process.versions.zlib` y la huella de contenido. Node 22.23.4 (zlib 1.3.1-e00f703) y Node 24.22.1 (zlib 1.3.2.1-motley-285e94b) dieron el mismo ZIP. Una zlib distinta (p. ej. la de Python) emite otros bytes con el mismo contenido; en ese caso se compara la huella de contenido y la re-fijación del hash la autoriza Johandry. `.nvmrc` 22.12.0 y Node 20 de CI no se probaron.

Riesgo residual R1: el ZIP no incluye las 14 entradas de directorio que genera el CLI; su aceptación por Shopify se valida en C-02.

# Relación con `79ff3961` y con el script de Antigravity

- `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f` (288969 bytes) es referencia histórica no reproducible (D21). No se intentó reproducir.
- `agent-comms/outbox-gemini/package-reproducible-zip.py`, sin modificar, contra HEAD con `--dest` en scratch: 289834 bytes, SHA-256 `3629d9d4217caa0c49d07935fc642aa101a8a8a17b7ce66e4346a84e316fc44e`, exit 2 (no coincide con su constante).
- Por qué difiere de este empaquetador: (a) fecha: Antigravity fija 15:42:07 (fecha del commit documental `fbdf462`; `zipfile` la guarda como 15:42:06) y D21 usa 14:48:42, la del último commit que toca el tema; (b) deflate: el nivel efectivo del script de Antigravity es 6, no 9, porque `writestr` con un `ZipInfo` ignora `compresslevel=9` (`package-reproducible-zip.py:105-112`), y además Python usa zlib 1.3 y Node otra; 88 de 93 entradas tienen distinto tamaño comprimido. Sumas de tamaños comprimidos: Python nivel 6 = 277434, Python nivel 9 = 275483, Node = 274765; (c) mismas rutas, mismo orden, create_system 3, external_attr `0o100644<<16`, compress_type 8 (iguales). No se persiguió igualarlo.

# Verificación

Scratch: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/zip/`.

## 1. Determinismo y revisiones documentales

Comandos: `node scripts/package-theme-zip.mjs --out .../zip/a/t.zip --expect-count 93`; `... --out .../zip/b/t2.zip`; `... --rev 91f6e9f --out .../zip/a/t91.zip`; `... --rev fbdf462 --out .../zip/a/tfb.zip`. Salida de la primera (las otras tres imprimen los mismos fecha, archivos, tamaño, SHA y zlib):

```
rev:      HEAD -> 8e1646e467794ab5c0d0b1ba71e224d02e11ea72
fecha:    1793803722 (2026-11-04T14:48:42.000Z), DOS UTC con floor a 2 s
archivos: 93
tamano:   287165 bytes
sha256:   f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585
zlib:     1.3.1-e00f703 (node 22.23.4)
```

`sha256sum` de los cuatro ZIP (a/t.zip, a/t91.zip, a/tfb.zip, b/t2.zip): los cuatro `f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585`. Además, `--expect-sha256 00` dio exit 1 y `--out layout/x.zip` dio exit 1 («--out cae dentro de un directorio o archivo del tema»).

## 2. unzip y manifiesto

```
$ unzip -l zip/a/t.zip | tail -3
---------                     -------
  1232296                     93 files
$ unzip -t zip/a/t.zip | tail -1
No errors detected in compressed data of .../zip/a/t.zip.
```

Extracción y comparación contra las 93 filas (ruta, bytes, SHA-256 LF) de la sección 3 de `GEMINI-FICHA-LOTE-0-BASE-001.md`: `manifest filas 93`, `coinciden 93 / 93 discrepancias []`.

## 3. Metadatos con `python3 -I` y `zipfile`

```
n 93 sorted True dirs []
fechas {(2026, 11, 4, 14, 48, 42)}
attr {'0o100644'} {0}
system {3} compress {8} flags {0} extra {0} create_version {20}
testzip None
```

## 4. Script de Antigravity (sin modificar)

`python3 agent-comms/outbox-gemini/package-reproducible-zip.py --dest .../zip/ag/Sartorial.zip` -> `Tamano: 289834 bytes`, `SHA-256: 3629d9d4217caa0c49d07935fc642aa101a8a8a17b7ce66e4346a84e316fc44e`, `[FAIL] HASH NO COINCIDE`, exit 2. Diferencias en la sección anterior.

## 5. Sintaxis

`node --check scripts/package-theme-zip.mjs` -> `CHECK_OK` (exit 0).

## 6. Compuerta del literal

`python3 -I .../scratchpad/count-two.py scripts/package-theme-zip.mjs` -> `scripts/package-theme-zip.mjs=0`. Para este informe: ver afirmación 13.

## 7. Correcciones de la revisión CLAUDE-REVIEW-LOTE-0-ZIP-001 (H1 a H7, H9)

- Tras los cambios, HEAD, `91f6e9f` y `fbdf462` dan SHA-256 `f001627e…e585` y huella `02bd3bc8…df34` (exit 0 con `--expect-sha256` y `--expect-content-sha256`); Node 24.22.1 da los mismos valores.
- Clon `file://` con `--depth 1` en scratch: `[package-theme-zip] ERROR: clon superficial: el commit 8e1646e… es frontera y la fecha seria incorrecta; ejecutar `git fetch --unshallow``, exit 1. Clon de 59 commits (hereda la superficialidad del repo) en `8e1646e`: `f001627e…e585`, exit 0.
- Casos de `--out` (todos exit 1): `layout/x.zip` (dentro del tema), `Layout/x.zip` y `LAYOUT/x.zip` (siempre en minúsculas, también en Linux; N1), `update_extension.json` (archivo de raíz), `.../noext` (sin `.zip`), `.../dir.zip` existente como directorio. Corrección de un caso mío: `LAYOUT/x.zip` en Linux (sensible a mayúsculas) escribió un `LAYOUT/x.zip` en la raíz del repo; lo eliminé y quité el directorio; en win32/darwin se rechaza.
- Regla de CR (H2): solo `.liquid .json .css .js .svg .md .txt` sin NUL; los 93 blobs actuales son de texto y ninguno tiene CR.
- No escritura git: `git reflog -3` (HEAD@{0} `8e1646e` commit, HEAD@{1} merge fast-forward, HEAD@{2} `121d50f` commit; sin entradas nuevas) y `git status --porcelain` muestran solo archivos modificados o sin seguimiento, ningún commit nuevo; `BOARD.md` y `gate5-*.mjs` figuran modificados por otros agentes.

# Ledger / condición que cierra

Ninguna fila de `docs/requirements-ledger.md` se modifica o cierra. Cierra, en cuanto a empaquetador versionado y hash fijado, la parte de la condición C-R0-2 de `GEMINI-REVIEW-LOTE-0-R0-002` («ZIP regenerable desde el empaquetador versionado», `CLAUDE-CLOUD-STATUS.md:35`), con hash canónico nuevo según D21. Queda pendiente la aceptación de Gemini/Johandry del hash, y recomputarlo tras C-04-P (exclusión de las dos plantillas) y C-04-R (si se añade `release-notes.md`), porque cambiará el contenido.

# Afirmaciones falsables

1. `scripts/package-theme-zip.mjs` existe, tiene 319 líneas y `node --check` devuelve exit 0.
2. El script solo importa `node:child_process`, `node:crypto`, `node:fs`, `node:path`, `node:process`, `node:url` y `node:zlib`; no se tocó `package.json`.
3. `node scripts/package-theme-zip.mjs --out <ruta>` en HEAD `8e1646e` produce 287165 bytes y SHA-256 `f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585` con zlib `1.3.1-e00f703`.
4. Dos generaciones en rutas distintas dan el mismo SHA-256.
5. `--rev 91f6e9f` y `--rev fbdf462` dan el mismo SHA-256 que HEAD, con fecha 1793803722.
6. El ZIP tiene 93 entradas, sin directorios, ordenadas por bytes UTF-8, todas con fecha 2026-11-04 14:48:42, create_system 3, external_attr `0o100644 << 16`, compress_type 8, flags 0 y extra vacío.
7. `unzip -t` y `zipfile.testzip()` no reportan errores.
8. Los 93 archivos extraídos coinciden en tamaño y SHA-256 con el manifiesto LF de `GEMINI-FICHA-LOTE-0-BASE-001.md`.
9. El script de Antigravity sin modificar da 289834 bytes y `3629d9d4217caa0c49d07935fc642aa101a8a8a17b7ce66e4346a84e316fc44e` desde HEAD, con Python 3.13.18 y zlib 1.3; 88 de 93 entradas difieren en tamaño comprimido del ZIP de este empaquetador.
10. `--expect-sha256` incorrecto y `--out` dentro de un directorio del tema terminan con exit 1.
11. No se ejecutó gate5, no se contactó ninguna tienda, no se abrió `.secrets`, no se ejecutó ningún comando git de escritura y los únicos archivos creados por esta tarea son `scripts/package-theme-zip.mjs` y este informe (las modificaciones de `scripts/gate5-*.mjs` en `git status` son de otros agentes).
12. Con clon `--depth 1` el script sale con exit 1; con Node 24.22.1 (zlib 1.3.2.1-motley-285e94b) el SHA-256 del ZIP y la huella de contenido son los mismos que con Node 22.23.4.
13. Este informe y `scripts/package-theme-zip.mjs` contienen 0 coincidencias del literal sensible de contraseña.
