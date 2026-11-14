ID: CLAUDE-REVIEW-LOTE-0-ZIP-001
Estado: Revisión completada. Veredicto: ACEPTADO CON CAMBIOS MENORES (H1 y H2 obligatorios antes del commit; no alteran el hash canónico).
Decisión requerida: Johandry/coordinador: (1) aceptar f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585 como hash canónico de 8e1646e/91f6e9f; (2) autorizar las correcciones H1 y H2 antes del commit.
Resumen en 5 líneas:
1. Cuatro generaciones independientes (HEAD ×2, 91f6e9f, fbdf462) dan f001627e…, 287165 bytes, 93 archivos. Node 24.22.1 (zlib 1.3.2.1-motley-285e94b) también da f001627e….
2. Formato ZIP correcto: cabeceras locales iguales al directorio central, offsets, EOCD, CRC, tamaños, fecha DOS UTC 14:48:42 y sin ZIP64. Contenido 93/93 idéntico byte a byte a git y a la ficha.
3. La selección coincide con la de `shopify theme package` (CLI 4.8.0): mismos 93 archivos con bytes idénticos. La raíz no tiene carpeta envolvente e incluye listings/.
4. P1: en un clon superficial (p. ej., actions/checkout por defecto) el script emite otro hash en silencio (aa179b69…, exit 0). Arreglo de unas 8 líneas probado: conserva f001627e y falla en depth 1.
5. P2: la comprobación de CR rechaza cualquier binario (todo PNG tiene 0x0D en el byte 4). El informe atribuye a zlib una diferencia que en parte es de nivel de compresión (P3).
Archivos tocados: solo este archivo de revisión en el repo (escrito a petición del coordinador). Artefactos de verificación solo en el scratchpad (review-zip/, review-tools/verify.py).
Desviaciones (Nivel 1 o Nivel 2): Ninguna. Hice clones locales del repo en el scratchpad (file://) y ejecuté `shopify theme package` sobre un clon en el scratchpad para comparar con la herramienta oficial. No hubo otra escritura en el repo.
Hallazgos extra fuera de alcance (con parche listo): H4-bis: `package-reproducible-zip.py` (Antigravity) declara nivel 9 pero comprime a nivel 6, porque writestr(ZipInfo) ignora el compresslevel de ZipFile. Sin parche, porque el script es histórico.
Verificación (comando, resultado y qué demuestra/qué no): ver «Verificación». Demuestra determinismo, formato, contenido y equivalencia con el CLI oficial. No demuestra que se pueda instalar en la tienda (Compuerta 5, C-02) ni la reproducibilidad con Node 20 o 22.12.0.
Lista de afirmaciones falsables numeradas: al final.

Revisa: `scripts/package-theme-zip.mjs` (260 líneas, sin commit) y `agent-comms/outbox-claude/CLAUDE-REPORT-LOTE-0-ZIP-001.md` (115 líneas, sin commit), en la rama `lote0/base-09f8342`, HEAD `8e1646e`.

# Hallazgos

## H1 — P1. En un clon superficial el hash cambia en silencio

- **Dónde:** `scripts/package-theme-zip.mjs:229`. El comentario de `:7-8` («idéntica bit a bit en cualquier máquina») es falso en este caso.
- **Evidencia:** en un clon `--depth 1` de la rama, `git log -1 -- <rutas>` devuelve el commit frontera 8e1646e. Resultado: `fecha: 1793818604 (2026-11-04T18:56:44Z)`, `sha256: aa179b69026e627caa92b3d9c20084bb704fb54dd5394023112d93ae27a64eb8`, exit 0.
- **Por qué importa:** `.github/workflows/ci.yml` usa `actions/checkout@v4` sin `fetch-depth`, que por defecto es 1. Este mismo entorno también es superficial (59 commits, frontera 42e3b9e). Aquí el commit encontrado, 91f6e9f, no es frontera, así que f001627e es válido.
- **Corrección propuesta:** pedir `--format=%H %ct`. Si `git rev-parse --is-shallow-repository` es true y el commit encontrado figura en el archivo `git rev-parse --git-path shallow`, fallar con la indicación `git fetch --unshallow`.
- **Prueba del parche:** lo apliqué a una copia en el scratchpad (`review-zip/patched.mjs`). El clon de 59 commits da f001627e…; el clon depth 1 sale con `ERROR: clon superficial: el commit 8e1646e… es frontera del historial`, exit 1.

## H2 — P2. La comprobación de CR rechaza todo archivo binario

- **Dónde:** `:148`, `if (e.data.includes(0x0d)) fail(...)`.
- **Evidencia:** la firma de cualquier PNG es `89 50 4E 47 0D 0A 1A 0A`. JPG y WOFF2 también contienen 0x0D con alta probabilidad. Hoy `assets/` tiene 3 archivos de texto, así que el hash actual no se ve afectado. Pero el primer binario que entre en el tema bloqueará el empaquetado.
- **Corrección:** aplicar la comprobación de CR solo a extensiones de texto (`.liquid .json .css .js .svg .md .txt`), o tratar como binario cualquier blob con NUL. El hash actual no cambia.

## H3 — P3. Dependencia de zlib: el riesgo es aceptable, pero falta una forma de verificar que no dependa de zlib

- **Dónde:** el informe, líneas 35-37; el script, `:25-29`.
- **Evaluación respecto a D21:** «compresión fija» se cumple con parámetros fijos (método 8, nivel 9, memLevel 8, windowBits 15) más la versión de zlib impresa en la salida. El riesgo es aceptable.
- **Evidencia nueva:** Node 24.22.1 con zlib `1.3.2.1-motley-285e94b` reproduce f001627e…. La zlib 1.3 estándar de Python a nivel 9 no lo reproduce: 88 de 93 entradas tienen otro tamaño comprimido, con suma 275483 frente a 274765.
- **Lo que el informe no menciona:** `.nvmrc` fija 22.12.0 y CI usa Node 20. Ninguna de las dos se probó.
- **Dos objeciones a la propuesta de «re-fijar el hash»:** (a) no dice quién lo autoriza; (b) no existe ninguna herramienta para comparar contenido.
- **Corrección:** que el script imprima una huella de contenido independiente de zlib, el sha256 de las líneas ordenadas `ruta\0tamaño\0sha256`. El hash canónico se registraría como el par (sha256 del ZIP, zlib) más esa huella. Además, documentar las versiones de Node y zlib probadas. Cualquier re-fijación pasa por Johandry.

## H4 — P3. Atribución inexacta de la diferencia con Antigravity

- **Dónde:** el informe, líneas 37 y 43(b).
- **Evidencia:** el 277434 es Python a nivel 6, no zlib estándar a nivel 9. Python a nivel 6 suma 277434, igual que la suma de los tamaños comprimidos del ZIP de Antigravity. Python a nivel 9 suma 275483. Node suma 274765.
- **Causa:** `zf.writestr(zinfo, ...)` con un ZipInfo ignora el `compresslevel=9` de ZipFile (`package-reproducible-zip.py:105-112`).
- **Corrección:** cambiar el texto a «nivel efectivo 6 en Antigravity y, además, otra zlib». Avisar a Gemini/Antigravity de que la §4 de la ficha («Deflate nivel 9») no se corresponde con el script.

## H5 — P3. La fecha no refleja borrados ni exclusiones, y las rutas se interpretan como pathspec

- **Dónde:** `:229`. Se usan las rutas actuales, así que un commit que solo borra un archivo del tema no mueve la fecha. Además, las rutas sin `--literal-pathspecs` se interpretan con magia de pathspec (`:`, comodines).
- **Corrección:** usar `-c log.showSignature=false log -1 --format='%H %ct' <commit> -- assets config layout locales sections snippets templates listings blocks release-notes.md` más `':(exclude)<ruta>'` para cada entrada de EXCLUDED_PATHS.
- **Verificado:** con directorios el último commit también es 91f6e9f (1793803722), así que el hash no cambia.

## H6 — P3. Huecos en la protección de `--out`

- **Dónde:** `:214-216`.
- **Huecos encontrados:**
  - No protege las rutas de `INCLUDE_ROOT_FILES`: `--out release-notes.md` sobrescribiría ese archivo.
  - En sistemas de archivos que no distinguen mayúsculas (el checkout de Johandry está en Windows), `Assets\x.zip` no se detecta.
  - `--out layout` pasa la protección y termina con un `EISDIR` sin capturar (comprobado; no escribió nada).
- **Corrección:** comparar en minúsculas en win32/darwin, incluir los archivos de la raíz, exigir extensión `.zip` y rechazar directorios.

## H7 — P3. Falta `update_extension.json` respecto al CLI oficial

- **Evidencia:** la lista de inclusión de `node_modules/@shopify/cli/dist/chunk-N6RBRPGW.js` (CLI 4.8.0) es `assets/**, blocks/**, config/**, layout/**, listings/**/*, locales/**, sections/**, snippets/**, templates/**, templates/customers/**, release-notes.md, update_extension.json`. Hoy ese archivo no existe en el repo.
- **Corrección:** añadirlo a `INCLUDE_ROOT_FILES`, o documentar que se omite a propósito.

## H8 — P3. Compuerta de consistencia: conviven tres rutas de empaquetado

1. `npm run theme:package` / `gates:package` usan el CLI de Shopify sobre el árbol de trabajo. Con `core.autocrlf=true` en Windows empaquetan CRLF, añaden 14 entradas de directorio y no son deterministas. CI lo ejecuta solo como prueba de humo.
2. `agent-comms/outbox-gemini/package-reproducible-zip.py` sigue con la constante 79ff… y el conteo de 93 escrito a mano.
3. El nuevo script.

**Sin contradicción en la selección:** el CLI sobre el mismo commit genera exactamente los mismos 93 archivos con bytes idénticos (verificado). `.shopifyignore` (`*.md`, `agent-comms/`) no afecta a `theme package`, porque el CLI usa su propio patrón; solo afecta a push/dev.

**Corrección:** registrar en `docs/decisions.md` (implementación de D21) que la ruta canónica es `scripts/package-theme-zip.mjs` y marcar el script de Antigravity como histórico. Un script npm opcional requiere autorización para tocar `package.json`.

## H9 — P3. Forma del informe

- `Decisión requerida: Ninguna` contradice la frase siguiente, que pide aceptar el hash.
- La afirmación 11 («ningún comando git de escritura») no aporta salida de comando, contra RULES §1.3. El `git reflog` muestra que HEAD sigue en 8e1646e sin entradas nuevas, así que es coherente, pero el informe debe pegar esa salida.
- La afirmación 12 depende de `count-two.py` en el scratchpad, que no está versionado.
- El comentario de `:23` dice que el flag UTF-8 se activa «si alguna ruta no es ASCII», pero el código lo aplica por entrada (`:158`).
- La política de `listings/` que exige la condición (b) de la R0-002 (línea 159) está declarada pero sin justificar. Conviene citar que coincide con `listings/**/*` del CLI.

## R1 — Riesgo residual, no es defecto: el ZIP no tiene entradas de directorio

El CLI incluye 14 entradas de directorio; este ZIP ninguna. Que el panel de Shopify lo acepte en la subida no está demostrado (Compuerta 5, corresponde a C-02). Si se decide añadir entradas de directorio, el hash cambiaría. Conviene decidirlo junto con los recálculos de C-04-P y C-04-R.

## Lo que se verificó sin hallazgos

- **Estructura ZIP:** cabeceras locales iguales al directorio central en todos los campos; offsets encadenados; `cdoff+cdsize == EOCD`; 0 bytes al final; sin descriptor de datos.
- **Valores fijos:** version made by 0x0314 y version needed 20.
- **Fecha DOS:** `0x7615/0x5d64` corresponde a 14:48:42 (segundos pares).
- **CRC y tamaños:** comprobados descomprimiendo cada entrada.
- **Límites:** guarda de 0xFFFFFFFE para ZIP64; un offset o un conteo fuera de rango hace fallar `writeUInt*`, no se corrompe en silencio.
- **Robustez con git:**
  - `ls-tree -z` maneja espacios y unicode.
  - `--rev` con `--since=2020`, `--all`, `-h`, `HEAD:assets`, `^{tree}` o `nonexist` termina siempre en «revisión no resoluble», exit 1.
  - Symlinks y submódulos fallan de forma explícita.
  - `--expect-count abc` y la falta de `--out` dan exit 1.

# Verificación

```
$ node scripts/package-theme-zip.mjs --out .../review-zip/a/head.zip --expect-count 93 --expect-sha256 f001627e…  -> exit 0
$ … --out b/head2.zip ; --rev 91f6e9f --out a/r91.zip ; --rev fbdf462 --out a/rfb.zip
$ sha256sum  -> los 4: f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585
$ git log --format='%h %ct' -1 -- assets config layout locales sections snippets templates listings blocks release-notes.md
91f6e9f 1793803722
$ /opt/node24/bin/node scripts/package-theme-zip.mjs --out x/node24.zip --expect-sha256 f001627e…
tamano: 287165 bytes / sha256: f001627e… / zlib: 1.3.2.1-motley-285e94b (node 24.22.1) / exit 0
$ python3 -I review-tools/verify.py a/head.zip <repo> 8e1646e GEMINI-FICHA-LOTE-0-BASE-001.md
n 93 sorted_bytes True dirs []
dates {(2026, 11, 4, 14, 48, 42)}
attr {'0o100644'} low16 {0}
system {3} create_ver {20} extract_ver {20}
compress {8} flags {0} extra {0} comment {b''} zipcomment b''
testzip None
eocd at 287143 len 287165 trailing 0 … cdoff+size==eocd True
local stream ends at 280210 == cdoff True cd parsed end == eocd True raw errs []
git byte-compare mismatches [] | git theme paths 93 set equal True
manifest rows 93 missing_in_zip [] mismatch []
top-level ['assets','config','layout','listings','locales','sections','snippets','templates']
CR anywhere []
sum comp node 274765 sum comp python zlib 1.3 275483 entries differing size 88
$ unzip -t a/head.zip | tail -1  -> No errors detected in compressed data
$ (clon depth 1) node scripts/package-theme-zip.mjs …  -> fecha 1793818604, sha256 aa179b69…, exit 0   [H1]
$ (patched.mjs) clon 59 commits -> f001627e… ; clon depth 1 -> ERROR clon superficial, exit 1
$ shopify theme package (CLI 4.8.0, clon en el scratchpad) vs a/head.zip
cli entries 107 dirs 14 files 93 / same file set True / content equal True
$ python3 -I package-reproducible-zip.py --dest scratch  -> 289834 bytes, 3629d9d4…, exit 2; suma comprimida 277434 = Python nivel 6
$ node scripts/package-theme-zip.mjs --out layout/x.zip -> exit 1 ; --out listings/sartorial/x.zip -> exit 1 ; --expect-sha256 00 -> exit 1 ; node --check -> exit 0
$ count-two.py (salida filtrada a ruta=N) -> script=0, informe=0
```

Rutas de scratch: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/review-zip/` y `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/review-tools/verify.py`.

**Qué no demuestra:**

- Que Shopify instale el ZIP en una tienda (no se tocó ninguna tienda).
- La reproducibilidad con Node 20 o 22.12.0.
- El contenido de `count-two.py`: no lo abrí, para no exponer el literal, y solo usé su salida filtrada.

# Comprobación de las afirmaciones del informe

| Afirmaciones | Resultado |
| --- | --- |
| 1-8 y 10 | Ciertas |
| 9 | Cierta en cifras; su explicación es inexacta (H4) |
| 11 | Coherente con el reflog, pero sin la salida en el informe (H9) |
| 12 | Cierta según el helper de conteo |

El informe no declara más de lo demostrado sobre tiendas ni sobre zlib; dice expresamente «No se probó con otra versión de Node».

# Afirmaciones falsables de esta revisión

1. HEAD, 91f6e9f y fbdf462 producen `f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585` (287165 bytes) con Node 22.23.4 (zlib 1.3.1-e00f703) y con Node 24.22.1 (zlib 1.3.2.1-motley-285e94b).
2. Las 93 entradas: fecha (2026,11,4,14,48,42), create_system 3, external_attr 0o100644<<16, compress_type 8, flags 0, extra vacío, sin directorios, ordenadas por bytes.
3. Las 93 coinciden byte a byte con `git show 8e1646e:<ruta>` y con tamaño y SHA-256 de la ficha.
4. `shopify theme package` (CLI 4.8.0) sobre el mismo commit genera los mismos 93 archivos con contenido idéntico, más 14 entradas de directorio.
5. Un clon `--depth 1` produce `aa179b69…` con exit 0 usando el script tal como está.
6. Con el parche H1, el clon de 59 commits da f001627e… y el de depth 1 sale con exit 1.
7. Con Python, el nivel 6 suma 277434 y el nivel 9 suma 275483 bytes comprimidos para estos 93 archivos.
8. No se ejecutó gate5, no se contactó ninguna tienda, no se abrió `.secrets`, no se imprimió el literal y no se escribió en el repo salvo este archivo de revisión (a petición del coordinador). La única llamada de red posible fue el aviso de versión del CLI de Shopify.

# Re-verificación de correcciones

Objeto: `scripts/package-theme-zip.mjs` (319 líneas) y `CLAUDE-REPORT-LOTE-0-ZIP-001.md` (131 líneas), ambos sin commit. Las pruebas que escriben o hacen commits se hicieron en clones `file://` del scratchpad (`review-zip/c2`, de 59 commits, y `review-zip/d1`, depth 1), con la copia del script nuevo. En el repo solo se escribió esta sección.

**Veredicto final: ACEPTADO.** H1–H7 y H9 están corregidos en el script o el informe, y H8 y R1 están documentados. El hash canónico `f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585` y la huella `02bd3bc8d99c8c7ee1be8a87358139144bccbd0986d15525a43b49506ec9df34` se reproducen. Quedan tres observaciones P3 no bloqueantes (N1–N3), que no cambian el hash.

## Incidente `LAYOUT/x.zip`

No quedó nada en el repo. `ls -d LAYOUT` da «No such file or directory». `find . -iname "*.zip"` (excluido `node_modules`) no devuelve nada. `git status --short --ignored` no muestra `LAYOUT/` ni ningún `.zip`.

## Resultados por hallazgo

| Hallazgo | Resultado | Evidencia |
| --- | --- | --- |
| H1 (clon superficial) | Corregido | `d1` (depth 1): `ERROR: clon superficial: el commit 8e1646e… es frontera…`, exit 1, sin ZIP escrito. `c2` (59 commits): `f001627e…`, exit 0. Script `:58-60`, `:260-264`, `:277-279`. |
| H2 (CR en binarios) | Corregido | Commit de prueba con `assets/test.png` (firma PNG con 0x0D y NUL): exit 0 y bytes del ZIP iguales a git. `snippets/cr.liquid` con CRLF: `ERROR: el blob contiene CR`, exit 1. `assets/x.svg` con CR: exit 1. Script `:152-156`, `:175`. |
| H3 (huella sin zlib) | Corregido | Formato `ruta\0tamaño\0sha256\n` (`:52-56`, `:285-289`). Lo recalculé con Python desde `git show` y sale `02bd3bc8…df34` (93 líneas, LF final). `--expect-content-sha256 00` da `FALLO: huella de contenido esperada 00…`, exit 1. Con el valor correcto, exit 0. Node 24.22.1 (zlib 1.3.2.1-motley-285e94b): mismo SHA-256 y misma huella. |
| H4 (atribución de la diferencia) | Corregido en el informe | `CLAUDE-REPORT…:50` (nivel efectivo 6; sumas 277434 / 275483 / 274765) y `:12` (aviso para Antigravity). |
| H5 (fecha y pathspecs) | Corregido | HEAD, 91f6e9f y fbdf462 dan 1793803722. En `c2`: un commit solo de documentación (`README.md`) no mueve la fecha. Un commit que solo borra `assets/product-zoom.js` mueve la fecha a su commit (12:00:00Z). Con `EXCLUDED_PATHS=['templates/page.support.json']` (copia del script en el scratchpad), un commit que solo toca ese archivo no mueve la fecha (15:00:00Z frente a 16:00:00Z sin exclusión) y el archivo sale del ZIP (94 frente a 95 archivos). Pathspecs `:(literal)` y `:(literal,exclude)` en `:269-274`; `log.showSignature=false` en `:274`. |
| H6 (`--out`) | Corregido; ver N1 | exit 1: `layout/x.zip`, `listings/sartorial/x.zip`, `./assets/../layout/y.zip`, `update_extension.json`, `release-notes.md`, `noext`, `layout` (directorio), `dir.zip` (directorio existente). exit 0: `root-ok.zip`, `Layout/x.zip` y `LAYOUT/x.zip` en Linux. |
| H7 (`update_extension.json`) | Corregido | En el commit de prueba de `c2`, `update_extension.json` entra en la raíz del ZIP con bytes iguales a git (`:83`). |
| H8 (rutas de empaquetado) | Documentado | `CLAUDE-REPORT…:37`, y `docs/decisions.md` (sin commit, cambio ajeno a esta tarea) registra la ruta canónica e indica que el script de Antigravity queda como histórico. |
| H9 (forma del informe) | Corregido; ver N2 | «Decisión requerida» ya es coherente (`:3`). Reflog incluido (`:107`). Comentario del flag UTF-8 por entrada (`:33-34`). Una prueba con `assets/ñ x.css` marca 0x0800 solo en esa entrada. Política de `listings/` justificada con el CLI (`:21`). |
| R1 (entradas de directorio) | Documentado | `CLAUDE-REPORT…:44`. |

Otras comprobaciones:

- `node --check` da exit 0.
- Las seis generaciones dan el mismo SHA-256: HEAD ×2, 91f6e9f, fbdf462, Node 24 y el clon `c2`.
- La fecha DOS hace floor a 2 s: un commit a 10:00:01Z queda guardado como 10:00:00.
- `unzip -t` y `testzip` no dan errores en el ZIP con PNG y ruta unicode.
- El reflog no cambia (HEAD `8e1646e`).

## Afirmaciones del informe actualizado

- Las afirmaciones 1–13 son ciertas.
- La 11 incluye el incidente de `LAYOUT/x.zip`, declarado en `:105` y sin restos.
- La 13 está verificada con la compuerta del literal.

## Observaciones P3 no bloqueantes

**N1. Mayúsculas en Linux** (`scripts/package-theme-zip.mjs:244-245`). En Linux, `Layout/x.zip` y `LAYOUT/x.zip` no escriben dentro del tema: son directorios distintos que el CLI (`layout/**`) no empaqueta, y `*.zip` está en `.gitignore`. Aun así dejan directorios sueltos en la raíz del repo, que es justo el incidente ocurrido, y no tienen ningún uso legítimo. Recomiendo rechazar sin distinguir mayúsculas en todas las plataformas: quitar la condición `ci` y comparar siempre en minúsculas. No bloquea.

**N2. Erratas del informe:**
- `:13` dice «No demuestra reproducibilidad con otra versión de zlib», pero `:36` y `:42` sí la demuestran para Node 24.
- `:18` (sinopsis) no incluye `--expect-content-sha256`.
- `:69` cita el mensaje de error antiguo («directorio del tema»).
- La sección «## 7» va antes que la «## 6».
- `:111` remite a la «afirmación 12», pero la del literal es la 13.
- `:104` llama «clon completo» a un clon sin `--depth` que hereda la superficialidad del repo (59 commits).

**N3. Sinopsis USO del script** (`:44-45`): no incluye `--expect-content-sha256`, aunque está documentada en `:52-56`.
