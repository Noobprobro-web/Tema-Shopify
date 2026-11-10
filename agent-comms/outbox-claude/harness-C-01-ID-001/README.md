# C-01 · identidad de previews, despliegue antes/después y medición

Estado: preparado y probado en local (SINTÉTICO). Nada de esto se ha ejecutado contra la tienda.

Antes = `258ca4f` (base del lote, sin C-01). Después = `e8f17e5` (`lote-c-impl`, igual a `lote-e-claude`). Entre ambos, `assets/base.css` cambia el banner de colección a 21/8 en todos los anchos y reduce el `gap` de `.collection-main__body` a `--space-4` por debajo de 48rem; el resto del diff (L-3, L-6, B-02) no toca colección.

## Por qué hace falta

Las tres previews sirven `base.css` distintos entre sí y ninguno corresponde a un commit. La última sincronización (`GPT-RA-RB-SYNC-20261106-010.md`) subió cinco rutas con `--only` y `--nodelete`, y `lote-c-impl` nunca se subió. El SHA del asset servido no prueba identidad, porque Shopify puede transformarlo al servirlo. La identidad se acredita bajando el archivo almacenado con `shopify theme pull` y comparándolo con Git.

## Archivos

| Archivo | Qué hace |
|---|---|
| `lib.mjs` | Contenido esperado de (commit, preset): árbol del tema más el overlay de `listings/<preset>/templates/*.json` y `settings_data.json` con `"current": "<Preset>"`. Compara buffers: los binarios (todo lo que no sea `.liquid`, `.css`, `.js`, `.json`, `.svg` u otra extensión de texto) solo admiten `exact`; CRLF→LF solo en texto, sobre bytes; el valor JSON canónico solo en `.json`. |
| `build-export.mjs` | Escribe ese contenido en un directorio vacío, listo para un push completo, con manifiesto SHA-256. |
| `identity.mjs` | `theme list --role unpublished` y `theme pull --theme <id> --only …` (o `--full`), compara archivo por archivo con el commit y el preset. Estados: `exact`, `normalized`, `mismatch`, `missing-remote`, `extra-remote`. `--candidates` dice a qué commit corresponde lo bajado. |
| `measure.mjs` | Matriz preset × 390×844 / 1280×800 × antes/después. Ejecuta `capture.mjs` de GPT sin modificar (SHA fijado) y añade controles visibles y firma de layout. En tienda: construye la URL de preview, entra con `STOREFRONT_PASSWORD` si la tienda la pide, respeta los 429, exige identidad `--full` y comprueba `Shopify.theme.id` en cada fila. Admite medición en serie (`--stage before`, luego `--stage after --before …`). |
| `synthetic.mjs` | Fixture: marcado de `main-collection.liquid` a mano con los settings de cada listing y el `base.css` de un commit. |
| `cleanup-check.mjs` | Antes de borrar previews temporales: cruza `ledger.jsonl`, `list-0-<preset>.json` y `list-final.json` con la lista de exclusión. Solo lee archivos; no borra. |
| `selftest.mjs` | 48 comprobaciones locales de identidad (directorios simulados y un doble del CLI) y de medición, con casos para C1 a C5 de `REVIEW-C01-001`. |
| `results/` | Baseline SINTÉTICO (`C01-SINTETICO-hide.json`, `C01-SINTETICO-measure.json`) y `selftest-summary.json`. |

Credenciales solo por entorno: `SHOPIFY_FLAG_STORE` y `SHOPIFY_CLI_THEME_TOKEN` (Theme Access), que lee el propio CLI. `identity.mjs` sale con 2 sin invocar el CLI si falta alguna, no pasa credenciales por argv, descarta stderr del CLI y no imprime valores. `measure.mjs` no copia URL con parámetros de preview al resultado, solo la ruta.

## Criterios de la R-D que aplica `measure.mjs`

C01-1: exige un antes y un después por preset y viewport. El resultado es `conclusive` solo con los tres presets y todos los pares válidos. Un par es inválido si cambia la colección, el producto de la primera tarjeta o el tratamiento de la barra.
C01-2: a 390×844 `SUBE` aprueba, `IGUAL` exige una justificación en `plan.justifications[preset]` y `BAJA` falla. Si desaparece u oculta un `summary` de filtro, el orden o el botón Apply, el veredicto es `FALLA_CONTROLES`. A 1280×800 compara rectángulos de cabecera, banner, facetas, rejilla y primera tarjeta (±0,5 px), `grid-template-columns`, `row-gap` y `position` de facetas; cualquier diferencia es `CAMBIO_LAYOUT`.
C01-3: `previewBar: "hide"` oculta la barra por CSS y `capture.mjs` verifica altura 0. `"measure"` exige barra visible, registra su altura y calcula el viewport útil. Ambos estados usan el mismo tratamiento. El resultado registra el SHA-256 de `measure.mjs`, de `capture.mjs`, del plan y del informe de identidad.
C01-6: LCP y CLS se registran como observación, sin compuerta.
Fuera de modo sintético, `measure.mjs` no mide sin un informe de `identity.mjs` en modo tienda, generado con `--full` (`scope: "full"`), con `ok=true` para cada tema, commit y preset. Antes de medir cada fila comprueba que la página expone `Shopify.theme.id` y que es el `themeId` de la celda; si falta o es otro (Shopify ignoró `preview_theme_id` por cookie, redirección o contraseña), la fila es inválida. Antes y después tienen que tener el mismo `themeId` salvo `allowDistinctThemes: true`. En serie, el informe del después tiene que ser posterior a la medición del antes.
Barra de preview: `measure.mjs` usa los mismos selectores que `capture.mjs` (`#preview-bar-iframe, #ShopifyPreviewBar, shopify-preview-bar`), la altura sale solo de `capture.mjs` y en modo `measure` espera a que la barra sea visible (`previewBarTimeoutMs`, 15 s por defecto). Los selectores no se han comprobado contra una preview real: el primer paso en tienda es una captura de control (paso 6).
No cubre: aplicar/limpiar filtros, orden, vacío, estado tras AJAX ni GET sin JS (C01-4/C01-5). Eso sigue siendo manual o de otro arnés.

## Resultado sintético (local, no es tienda)

| Preset | 390×844 antes → después | 1280×800 |
|---|---|---|
| Sartorial (banner, 2 col.) | 967,09 → 895,55 px (−71,55, SUBE) | 841,28 = 841,28 (SIN_CAMBIOS) |
| Imprint (sin banner, 4 col.) | 770,22 → 762,22 px (−8, SUBE) | 368,91 = 368,91 (SIN_CAMBIOS) |
| Archive (banner, 2 col.) | 967,09 → 895,55 px (−71,55, SUBE) | 841,28 = 841,28 (SIN_CAMBIOS) |

Los −71,55 px salen de 63,55 px del banner (16/9 a 21/8 sobre 350 px) más 8 px de `gap`. Con banner, la primera tarjeta sigue por debajo del pliegue en móvil en los dos estados. Con barra simulada de 56 px medida, los deltas son los mismos. Controles negativos: antes contra antes da `IGUAL_SIN_JUSTIFICAR` (exit 1), una regla extra de escritorio da `CAMBIO_LAYOUT` en los tres presets (exit 1) y un CSS servido distinto del commit invalida el par (exit 2). Las tipografías son de sistema y la cabecera es un bloque de 72 px, así que las cifras absolutas no valen para la tienda; vale la dirección y el tamaño del delta del CSS.

## Procedimiento de despliegue (requiere autorización de Johandry)

Reglas: nunca `--publish`, `--live` ni `--allow-live`; nunca tocar un ID que no se haya creado para esto; CLI 4.8.0 tras `npm ci`; un comando de Shopify cada vez, nunca en paralelo. Todos los comandos se lanzan desde la raíz del repo y escriben fuera de él, en `$C01` (un directorio de trabajo en el scratchpad de la sesión), salvo los resultados finales, que se copian a `results/`.

Credenciales, solo en el entorno de la sesión y nunca en argv, planes, informes ni commits: `SHOPIFY_FLAG_STORE` (dominio `*.myshopify.com`), `SHOPIFY_CLI_THEME_TOKEN` (Theme Access) y, si la tienda tiene contraseña de storefront, `STOREFRONT_PASSWORD`. `measure.mjs` rechaza un plan con claves `password` o `token`, solo lee la contraseña de `STOREFRONT_PASSWORD`, la escribe en el formulario de `/password` y la tacha de cualquier error.

URL de preview: `https://<SHOPIFY_FLAG_STORE>/collections/<handle>?preview_theme_id=<themeId>`. En el plan basta `"path": "/collections/<handle>"`; `measure.mjs` pone el origen desde el entorno y `preview_theme_id` desde el `themeId` de la celda. Si se da `url`, su `preview_theme_id` tiene que coincidir o no se mide. El resultado solo guarda la ruta.

429: el CLI reintenta por su cuenta; si aun así un comando termina con 429 o "Too Many Requests", parar, esperar al menos 60 s (o lo que diga `Retry-After`) y repetir ese mismo comando, sin lanzar otros en paralelo. `measure.mjs` espera `Retry-After` (tope 120 s, 30 s si no viene) y reintenta hasta tres veces por fila; después la fila es inválida. Las filas se miden en serie.

### Procedimiento recomendado: una preview por preset, en serie

Cumple C01-1 y R-D §1.4 de forma literal: el antes y el después se miden sobre el mismo theme ID. Por preset (`Sartorial`, `Imprint`, `Archive`), uno detrás de otro:

1. Exportar los dos estados:
   `node <harness>/build-export.mjs --commit 258ca4f --preset Sartorial --out $C01/before-sartorial`
   `node <harness>/build-export.mjs --commit e8f17e5 --preset Sartorial --out $C01/after-sartorial`
2. Preflight de nombre: `shopify theme list --json --no-color > $C01/list-0-sartorial.json` (un archivo por preset, nunca se sobrescribe el de otro preset) y comprobar que ningún tema se llama ya `C01 serial Sartorial`. Si existe, parar: no se reutiliza ni se borra sin revisarlo.
3. Push completo del antes, creando el tema (sin `--only`, sin `--nodelete`):
   `shopify theme push --unpublished --theme "C01 serial Sartorial" --path $C01/before-sartorial --no-color`
4. `shopify theme list --role unpublished --json --no-color > $C01/list-1.json`, filtrar por nombre exacto: tiene que haber exactamente un tema con ese nombre, rol `unpublished` y un ID que no estuviera en `list-0-sartorial.json`. Añadir una línea a `$C01/ledger.jsonl` (acumulado, solo se añade): `{"preset":"Sartorial","name":"C01 serial Sartorial","id":"<id>"}`. Ese es `<id>` para el resto del preset.
5. Identidad completa del antes:
   `node <harness>/identity.mjs --full --candidates 258ca4f,e8f17e5 --target <id>:258ca4f:Sartorial --out $C01/id-sartorial-before.json`
   Debe salir con 0. Si `settings_data.json` sale `mismatch`, Shopify ha expandido el preset; revisarlo a mano antes de medir, no relajar el script.
6. Solo la primera vez: captura de control con `previewBar: "measure"` y `--screens`, para comprobar que los selectores de la barra encuentran la barra real. Si no la encuentran, parar y corregir antes de la tanda.
7. Medir el antes con el plan del preset (`synthetic: false`, `previewBar: "hide"`, `identityReport: { "before": "id-sartorial-before.json", "after": "id-sartorial-after.json" }`, celdas `before` y `after` con el mismo `themeId`):
   `node <harness>/measure.mjs --plan $C01/plan-sartorial.json --stage before --out $C01/before-sartorial-rows.json --screens $C01/shots`
8. Preflight antes de pisar el tema: `shopify theme list --role unpublished --json --no-color` y confirmar que `<id>` sigue ahí, como `unpublished` y con el nombre `C01 serial Sartorial`. Si no, parar.
9. Push completo del después al mismo ID (sin `--only`, sin `--nodelete`):
   `shopify theme push --theme <id> --path $C01/after-sartorial --no-color`
10. Identidad completa del después (tiene que ser posterior a la medición del antes; `measure.mjs` lo comprueba):
   `node <harness>/identity.mjs --full --candidates 258ca4f,e8f17e5 --target <id>:e8f17e5:Sartorial --out $C01/id-sartorial-after.json`
11. Medir el después y juzgar los pares:
   `node <harness>/measure.mjs --plan $C01/plan-sartorial.json --stage after --before $C01/before-sartorial-rows.json --out $C01/C01-TIENDA-sartorial.json --screens $C01/shots`
12. Repetir 1 a 11 para Imprint y Archive. Para `conclusive=true` hacen falta los tres presets en un plan: el plan final tiene las seis celdas, se mide en serie igual que arriba y cada `identityReport` (antes y después) es un solo `identity.mjs --full` con los tres `--target`, generado justo antes de su etapa. Copiar a `results/` solo los JSON de resultado, sin capturas que muestren el dominio.

Plan de ejemplo (`$C01/plan-sartorial.json`, IDs de muestra):

```json
{ "label": "C-01 tienda Sartorial en serie", "synthetic": false, "previewBar": "hide",
  "identityReport": { "before": "id-sartorial-before.json", "after": "id-sartorial-after.json" },
  "justifications": {},
  "cells": [
    { "preset": "Sartorial", "stage": "before", "themeId": "140000000001", "commit": "258ca4f", "path": "/collections/<handle-con-banner>" },
    { "preset": "Sartorial", "stage": "after",  "themeId": "140000000001", "commit": "e8f17e5", "path": "/collections/<handle-con-banner>" }
  ] }
```

### Limpieza de las previews temporales

Al terminar (o al abandonar la tanda), y solo con autorización, se borran los temas creados por este procedimiento y ningún otro.

Lista de exclusión fija (`DELETE_EXCLUDED_IDS` en `lib.mjs`): `190232297715`, `190232330483` y `190232363251`, las tres previews existentes, más cualquier tema con rol `main` o `live` en cualquiera de las listas. Ninguno de ellos se borra nunca, aunque esté en el ledger o su nombre empiece por `C01`.

1. `shopify theme list --json --no-color > $C01/list-final.json`.
2. Comprobación, que solo lee archivos y no invoca el CLI:
   `node <harness>/cleanup-check.mjs --dir $C01`
   Para cada línea de `ledger.jsonl` exige a la vez: que el ID no esté en la lista de exclusión ni tenga rol `main`/`live`; que el nombre del ledger sea uno de este procedimiento (`C01 serial <Preset>` o, en la alternativa, `C01 before 258ca4f <Preset>` / `C01 after e8f17e5 <Preset>`); que exista `list-0-<preset>.json` y que el ID no figure en ella, es decir, que no existía antes del push de ese preset y lo creó este procedimiento; y que en `list-final.json` figure una sola vez, con el mismo nombre y rol `unpublished`. Imprime `BORRABLE` o `NO_BORRAR` con el motivo y sale con 0 solo si todas las entradas son borrables. Si sale con otro código, no se borra nada hasta revisarlo.
3. Solo los IDs marcados `BORRABLE`, uno cada vez, nunca por nombre ni con patrones, y comprobando a ojo otra vez que el ID no es `190232297715`, `190232330483` ni `190232363251`:
   `shopify theme delete --theme <id> --force --no-color`
4. `shopify theme list --json --no-color` otra vez y confirmar que esos IDs ya no están y que el resto de la lista (main y las tres previews existentes) es igual que en `list-0-sartorial.json`.

### Alternativa documentada: dos previews por preset

Un tema temporal para el antes y otro para el después (`C01 before 258ca4f <Preset>`, `C01 after e8f17e5 <Preset>`), cada uno con push completo `--unpublished`, los dos en `ledger.jsonl` con la lista previa `list-0-<preset>.json` y un solo `identity.mjs --full` con los dos `--target`. Se mide sin `--stage` y con `allowDistinctThemes: true` en el plan; sin esa clave `measure.mjs` invalida los pares. Ventajas: un push por estado, se puede alternar antes y después en la misma sesión y repetir la medición sin volver a subir. Inconveniente: no es "el mismo tema" de C01-1 y R-D §1.4; la identidad por contenido (`--full`, 85 archivos) y el `Shopify.theme.id` de cada fila lo compensan, pero solo vale si la R-D lo acepta por escrito. Limpieza igual que arriba, con dos IDs por preset.

## Pendiente en tienda

Autorización de Johandry para crear tres temas temporales y borrarlos al final, elegir una colección con banner y otra sin banner con productos reales, comprobar los selectores de la barra con la captura de control, ejecutar los pasos 1 a 12 y la limpieza, revisar las capturas y repetir a mano filtros, orden, vacío, AJAX y GET sin JS. Revisión independiente del resultado.
