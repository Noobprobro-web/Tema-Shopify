# REVIEW-C01-001 · Revisión independiente del harness C-01 (commit dabd19f, rama task/c01)

Revisor: Claude (subagente, solo lectura). Fecha: 2026-11-10. Worktree revisado: `wt-c01`, HEAD `dabd19f`, árbol limpio antes y después (git status vacío). No se ejecutó nada contra Shopify. Rutas relativas a `agent-comms/outbox-claude/harness-C-01-ID-001/` salvo que se indique otra cosa.

## Veredicto

**ACEPTADO CON CONDICIONES.** El harness es seguro frente a la tienda (no publica, no sube, no borra, falla cerrado sin credenciales) y la medición sintética es correcta y reproducible. Antes de usarlo en tienda hay que corregir cuatro puntos (C1 a C4), y el procedimiento recomendado del README necesita aceptación expresa de la R-D en un punto (C5).

## 1. Seguridad de los comandos de Shopify CLI

Los scripts solo invocan dos comandos del CLI: `theme list --role unpublished --json` (identity.mjs:91) y `theme pull --theme <id> --path <tmp> [--only …]` (identity.mjs:107-108). No hay `push`, `publish`, `delete`, `--live`, `--allow-live` ni `--nodelete` en ningún `.mjs` (comprobado con grep). build-export.mjs y measure.mjs no tocan el CLI ni la red de la tienda (build-export.mjs:126-159 solo escribe en disco).

Publicación y borrado: imposibles desde los scripts. En el README, los pushes son manuales: el recomendado crea temas nuevos con `--unpublished` (README.md:213), sin `--only` ni `--nodelete`, como pide la tarea. El borrado (README.md:222) solo afecta a los temas temporales, con autorización y por ID verificado. Correcto.

Subir a un tema publicado: los scripts no suben. La alternativa del README hace push a `--theme <id>` (README.md:224) sin ningún paso previo que verifique que ese ID es unpublished. El CLI exige `--allow-live` para el tema live, pero conviene no depender de eso (condición C4).

Pull de temas no previstos: el preflight exige que cada `--target` figure como `unpublished` en `theme list` y se detiene antes de cualquier pull (identity.mjs:99-101). Los IDs se validan como numéricos (identity.mjs:47). Selftest lo confirma: un target con rol live sale con 2 y no hay pull en el log del doble.

Credenciales: solo de entorno (`SHOPIFY_FLAG_STORE`, `SHOPIFY_CLI_THEME_TOKEN`), que lee el propio CLI. Si falta alguna o está vacía, sale con 2 antes de invocar el CLI (identity.mjs:157-160). No se pasan por argv. El stderr del CLI se descarta (identity.mjs:78-87). El informe solo guarda los IDs de destino (identity.mjs:103). measure.mjs guarda la ruta y no la URL completa (measure.mjs:142-143) y quita URLs de los errores (measure.mjs:159). En `results/` no hay dominio, token ni `preview_theme_id` (grep: la única coincidencia de "token" es el nombre de una comprobación en selftest-summary.json:62). Selftest verifica con un centinela que el token no aparece en argv, salida ni informe.

Menor: si el pull falla, `fail()` llama a `process.exit` dentro del `try` (identity.mjs:110 y 175-192) y el `finally` no borra el directorio temporal con lo bajado. No contiene credenciales, pero deja copias del tema en `os.tmpdir()`.

## 2. Corrección de la identidad

Cobertura: con `--full` compara la unión de lo esperado y lo bajado dentro de `THEME_DIRS` (identity.mjs:124-125), con estados `missing-remote` y `extra-remote`. El árbol de 258ca4f tiene 85 archivos en esos directorios y selftest compara los 85. Cubre todo el tema. Sin `--full` solo compara las 8 rutas de `C01_PATHS` (lib.mjs:17-26, identity.mjs:162), lo que no basta para acreditar identidad (condición C2).

Overlay de preset: `listings/<preset>/templates/*.json` sobre `templates/` y `settings_data.json` con `current` = preset (lib.mjs:64-87). Los listings solo contienen `templates/`, así que el overlay es completo para el repo actual.

Transformaciones de Shopify: el comentario `/* … */` de cabecera y el reformateo de JSON se aceptan como `normalized` comparando valor canónico con claves ordenadas (lib.mjs:91-117). Es correcto para templates, locales y settings_data. Si Shopify expande `"current": "Sartorial"` a objeto, sale `mismatch` y el README pide revisión manual sin relajar el script (README.md:218): falla cerrado, bien.

Falso positivo encontrado (condición C1): la normalización de saltos de línea decodifica cualquier archivo como UTF-8 (lib.mjs:107-108). Dos binarios distintos con bytes no UTF-8 en la misma posición se decodifican a U+FFFD y se declaran `normalized`. Probado: `compareBytes('assets/logo.png', <…0x80…>, <…0xff…>)` y un caso `.woff2` devuelven `normalized`. Hoy el tema no tiene binarios en `assets/` (solo css, js, svg y liquid), así que el riesgo es latente, pero el método es incorrecto. Hay que limitar la normalización LF a extensiones de texto y comparar buffers, no cadenas.

Candidatos: `--candidates` compara con el mismo alcance que el objetivo (identity.mjs:184-187). En modo rutas, dos commits iguales en esas 8 rutas darían ambos `matches`. Con `--full` no pasa.

## 3. Corrección de la medición

Viewports: 390x844 y 1280x800 con DPR 1, `scrollY=0` y fuentes cargadas (measure.mjs:34, 134, 149; capture.mjs:9, 28). capture.mjs se ejecuta sin cambios y con el SHA fijado; coincide: `ce2dab82…f9d1eb` (measure.mjs:33, verificado con sha256sum).

Barra de preview: `hide` oculta por CSS cuatro selectores y capture.mjs verifica altura 0 (measure.mjs:146-148; capture.mjs:33-36). `measure` exige barra visible y registra altura y viewport útil. El par se invalida si cambia el tratamiento o la altura (measure.mjs:181). Dos defectos: capture.mjs no incluye `#PBarNextFrameWrapper` y measure.mjs sí (capture.mjs:33 frente a measure.mjs:36), así que en modo `measure` la altura de capture y la de `probe` pueden salir de elementos distintos; y en modo `measure` no hay espera a que la barra se inyecte, que en Shopify llega de forma asíncrona (falla cerrado como INVALIDO, pero puede hacer el modo inutilizable). Ninguno de los selectores se ha comprobado contra una preview real (condición C3). La barra es un overlay fijo abajo, así que no altera `firstCardTop`; por eso los deltas son iguales con y sin barra.

Identidad del tema servido (condición C3): en modo tienda measure.mjs comprueba el informe de identidad (measure.mjs:70-82), pero no comprueba que la página medida la sirva ese tema. Registra `servedBaseCssSha256` y no lo usa fuera de sintético (measure.mjs:153, 219). Si Shopify ignora `preview_theme_id` (cookie, redirección, contraseña de tienda), se mediría el tema live sin aviso. Hay que exigir `Shopify.theme.id === cell.themeId` en cada fila. Tampoco exige `identity.scope === 'full'` (measure.mjs:81).

Criterio de aceptación: a 390 `SUBE` si delta < -0,5 px, `IGUAL` con justificación, `BAJA` falla y cualquier control de filtro, orden o Apply perdido u oculto da `FALLA_CONTROLES` (measure.mjs:184-197). A 1280 cualquier diferencia de rectángulos (±0,5 px), columnas, gap o `position` da `CAMBIO_LAYOUT` (measure.mjs:198-207). Se ajusta a C01-2. Los selectores de `probe` existen en el marcado real (sections/main-collection.liquid:57, 78-79, 226, 236, 312; snippets/product-card.liquid:123). La primera tarjeta se toma como primer `article.product-card`, no como primer hijo de la lista; con los listings actuales la promoción va en las posiciones 3 o 4, así que da igual.

Por qué Imprint solo sube 8 px: Imprint tiene `show_collection_image: false` (listings/imprint/templates/collection.json:23), así que no hay banner y el único cambio de C-01 que le afecta en móvil es el `gap` de `.collection-main__body`, que pasa de `--space-5` (2rem = 32 px, assets/base.css:1683-1686) a `--space-4` (1,5rem = 24 px, assets/base.css:5616-5620) por debajo de 48rem: 8 px. En Sartorial y Archive se suma el banner: 350 px de ancho a 16/9 = 196,88 px y a 21/8 = 133,33 px, 63,55 px menos, más los 8 px, total 71,55 px. Cumple la R-D: C01-2 no fija umbral y pide que la tarjeta suba o quede igual con justificación; -8 px es `SUBE` con margen sobre la tolerancia de 0,5 px. La R-D no exige que la tarjeta quede sobre el pliegue: con banner sigue por debajo en ambos estados (useful 796 px frente a top 895,55 px); en Imprint ya estaba visible antes.

Sin cubrir, y así lo declara (README.md:191, measure.mjs:261): C01-4 y C01-5 (filtros, orden, vacío, AJAX, GET sin JS).

## 4. Ejecuciones propias

`node --check` en los 7 `.mjs`: sin errores. `node selftest.mjs` (sin variables de Shopify, TMPDIR en scratchpad): 22/22, exit 0, mismos deltas que `results/`. `node synthetic.mjs` directo: exit 0 sin salida (es una librería). Además medí con un plan propio sobre el fixture con barra simulada de 48 px en modo `measure`: Sartorial y Archive -71,55 px `SUBE`, Imprint -8 px `SUBE`, 1280 `SIN_CAMBIOS` en los tres, `conclusive=true pass=true`. Coincide con README.md:197-199. El árbol del worktree quedó sin cambios.

## 5. README como procedimiento

Es ordenado y conservador (README.md:203-224), pero no es ejecutable de principio a fin sin decisiones no escritas. Falta: cómo construir la URL de preview de cada celda y cómo tratar la contraseña de la tienda en Playwright; un plan de ejemplo para tienda; verificar unicidad del nombre en el paso 3 (si se repite un push con el mismo nombre habrá dos temas); preflight de rol antes del push de la alternativa; y el directorio de trabajo de los comandos (`--out identity-sartorial.json` cae en el harness, dentro del repo). El paso 6 dice juntar seis celdas en un plan, pero exige también un informe de identidad que cubra los seis IDs, o sea, un solo `identity.mjs` con seis `--target`.

## Condiciones

C1. lib.mjs:105-117: aplicar la normalización LF solo a extensiones de texto y sobre buffers; los binarios solo `exact`. Añadir un caso binario a selftest.
C2. measure.mjs:74-81: en modo tienda exigir `identity.scope === 'full'`; recomendado, que el informe sea posterior al último push (fecha) o se regenere justo antes de medir.
C3. measure.mjs: en modo tienda, verificar en cada fila que `window.Shopify.theme.id` coincide con `cell.themeId` e invalidar si no; unificar los selectores de barra con capture.mjs (o usar solo la altura de capture) y esperar a la barra en modo `measure`; comprobar los selectores con una captura real antes de la tanda.
C4. README.md:213-224: añadir URL de preview, manejo de contraseña, plan de ejemplo, comprobación de nombre único, `theme list` previo a cualquier push con `--theme <id>`, y rutas de salida fuera del repo o en `results/`.
C5. README.md:207 recomienda temas distintos para antes y después, mientras que C01-1 y R-D §1.4 piden "mismo tema" y "misma preview y tema ID". La identidad por contenido lo compensa, pero es una desviación que la R-D debe aceptar por escrito; si no, usar la alternativa en serie (README.md:224). measure.mjs no comprueba que antes y después compartan `themeId`.

Menor, sin bloquear: limpiar el temporal de pull también en la ruta de error (identity.mjs:110).
