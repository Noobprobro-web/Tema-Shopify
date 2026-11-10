# C-01 · identidad de previews, despliegue antes/después y medición

Estado: preparado y probado en local (SINTÉTICO). Nada de esto se ha ejecutado contra la tienda.

Antes = `258ca4f` (base del lote, sin C-01). Después = `e8f17e5` (`lote-c-impl`, igual a `lote-e-claude`). Entre ambos, `assets/base.css` cambia el banner de colección a 21/8 en todos los anchos y reduce el `gap` de `.collection-main__body` a `--space-4` por debajo de 48rem; el resto del diff (L-3, L-6, B-02) no toca colección.

## Por qué hace falta

Las tres previews sirven `base.css` distintos entre sí y ninguno corresponde a un commit. La última sincronización (`GPT-RA-RB-SYNC-20261106-010.md`) subió cinco rutas con `--only` y `--nodelete`, y `lote-c-impl` nunca se subió. El SHA del asset servido no prueba identidad, porque Shopify puede transformarlo al servirlo. La identidad se acredita bajando el archivo almacenado con `shopify theme pull` y comparándolo con Git.

## Archivos

| Archivo | Qué hace |
|---|---|
| `lib.mjs` | Contenido esperado de (commit, preset): árbol del tema más el overlay de `listings/<preset>/templates/*.json` y `settings_data.json` con `"current": "<Preset>"`. Normaliza JSON (comentario de cabecera de Shopify y formato). |
| `build-export.mjs` | Escribe ese contenido en un directorio vacío, listo para un push completo, con manifiesto SHA-256. |
| `identity.mjs` | `theme list --role unpublished` y `theme pull --theme <id> --only …` (o `--full`), compara archivo por archivo con el commit y el preset. Estados: `exact`, `normalized`, `mismatch`, `missing-remote`, `extra-remote`. `--candidates` dice a qué commit corresponde lo bajado. |
| `measure.mjs` | Matriz preset × 390×844 / 1280×800 × antes/después. Ejecuta `capture.mjs` de GPT sin modificar (SHA fijado) y añade controles visibles y firma de layout. |
| `synthetic.mjs` | Fixture: marcado de `main-collection.liquid` a mano con los settings de cada listing y el `base.css` de un commit. |
| `selftest.mjs` | 22 comprobaciones locales de identidad (directorios simulados y un doble del CLI) y de medición. |
| `results/` | Baseline SINTÉTICO (`C01-SINTETICO-hide.json`, `C01-SINTETICO-measure.json`) y `selftest-summary.json`. |

Credenciales solo por entorno: `SHOPIFY_FLAG_STORE` y `SHOPIFY_CLI_THEME_TOKEN` (Theme Access), que lee el propio CLI. `identity.mjs` sale con 2 sin invocar el CLI si falta alguna, no pasa credenciales por argv, descarta stderr del CLI y no imprime valores. `measure.mjs` no copia URL con parámetros de preview al resultado, solo la ruta.

## Criterios de la R-D que aplica `measure.mjs`

C01-1: exige un antes y un después por preset y viewport. El resultado es `conclusive` solo con los tres presets y todos los pares válidos. Un par es inválido si cambia la colección, el producto de la primera tarjeta o el tratamiento de la barra.
C01-2: a 390×844 `SUBE` aprueba, `IGUAL` exige una justificación en `plan.justifications[preset]` y `BAJA` falla. Si desaparece u oculta un `summary` de filtro, el orden o el botón Apply, el veredicto es `FALLA_CONTROLES`. A 1280×800 compara rectángulos de cabecera, banner, facetas, rejilla y primera tarjeta (±0,5 px), `grid-template-columns`, `row-gap` y `position` de facetas; cualquier diferencia es `CAMBIO_LAYOUT`.
C01-3: `previewBar: "hide"` oculta la barra por CSS y `capture.mjs` verifica altura 0. `"measure"` exige barra visible, registra su altura y calcula el viewport útil. Ambos estados usan el mismo tratamiento. El resultado registra el SHA-256 de `measure.mjs`, de `capture.mjs`, del plan y del informe de identidad.
C01-6: LCP y CLS se registran como observación, sin compuerta.
Fuera de modo sintético, `measure.mjs` no mide sin un informe de `identity.mjs` en modo tienda con `ok=true` para cada tema, commit y preset.
No cubre: aplicar/limpiar filtros, orden, vacío, estado tras AJAX ni GET sin JS (C01-4/C01-5). Eso sigue siendo manual o de otro arnés.

## Resultado sintético (local, no es tienda)

| Preset | 390×844 antes → después | 1280×800 |
|---|---|---|
| Sartorial (banner, 2 col.) | 967,09 → 895,55 px (−71,55, SUBE) | 841,28 = 841,28 (SIN_CAMBIOS) |
| Imprint (sin banner, 4 col.) | 770,22 → 762,22 px (−8, SUBE) | 368,91 = 368,91 (SIN_CAMBIOS) |
| Archive (banner, 2 col.) | 967,09 → 895,55 px (−71,55, SUBE) | 841,28 = 841,28 (SIN_CAMBIOS) |

Los −71,55 px salen de 63,55 px del banner (16/9 a 21/8 sobre 350 px) más 8 px de `gap`. Con banner, la primera tarjeta sigue por debajo del pliegue en móvil en los dos estados. Con barra simulada de 56 px medida, los deltas son los mismos. Controles negativos: antes contra antes da `IGUAL_SIN_JUSTIFICAR` (exit 1), una regla extra de escritorio da `CAMBIO_LAYOUT` en los tres presets (exit 1) y un CSS servido distinto del commit invalida el par (exit 2). Las tipografías son de sistema y la cabecera es un bloque de 72 px, así que las cifras absolutas no valen para la tienda; vale la dirección y el tamaño del delta del CSS.

## Procedimiento de despliegue (requiere autorización de Johandry)

Reglas: nunca `--publish`, `--live` ni `--allow-live`; nunca tocar un ID que no se haya creado o designado para esto; CLI 4.8.0 tras `npm ci`; credenciales solo en el entorno de la sesión.

Opción recomendada: dos previews temporales por preset, creadas desde exports limpios. No pisa las tres previews existentes, permite alternar antes/después en la misma sesión y la identidad se acredita por contenido.

1. Exportar, por preset (`Sartorial`, `Imprint`, `Archive`):
   `node build-export.mjs --commit 258ca4f --preset Sartorial --out <scratch>/c01-before-sartorial`
   `node build-export.mjs --commit e8f17e5 --preset Sartorial --out <scratch>/c01-after-sartorial`
2. Crear cada tema temporal con push completo, sin `--only` ni `--nodelete`:
   `shopify theme push --unpublished --theme "C01 before 258ca4f Sartorial" --path <scratch>/c01-before-sartorial --no-color`
   y lo mismo para `after`.
3. Obtener los IDs con `shopify theme list --role unpublished --json` y filtrar por nombre exacto.
4. Identidad completa de cada tema:
   `node identity.mjs --full --candidates 258ca4f,e8f17e5 --target <idB>:258ca4f:Sartorial --target <idA>:e8f17e5:Sartorial --out identity-sartorial.json`
   Debe salir con 0. Si `settings_data.json` sale `mismatch`, Shopify ha expandido el preset; hay que revisarlo a mano antes de medir, no relajar el script.
5. Medir con un plan de tienda (`synthetic: false`, `identityReport`, `previewBar: "hide"`, misma colección con banner y una sin banner si el catálogo la tiene):
   `node measure.mjs --plan plan-sartorial.json --out C01-TIENDA-sartorial.json --screens <scratch>/c01-shots`
6. Repetir 1 a 5 para Imprint y Archive. Juntar las seis celdas en un plan para obtener `conclusive=true`.
7. Borrar los temas temporales solo con autorización y por ID verificado (`shopify theme delete --theme <id>`), o dejarlos a Johandry.

Alternativa: una sola preview por preset, en serie. Push completo de `c01-before-<preset>` a la preview designada con `--theme <id>` (sin `--only`, sin `--nodelete`), `identity.mjs --full`, medir el antes; luego push completo de `c01-after-<preset>` al mismo ID, identidad y medir el después. Cumple "mismo tema" literal de C01-1, pero sobrescribe plantillas y `settings_data.json` de esa preview y obliga a dos pushes por preset.

## Pendiente en tienda

Autorización de Johandry para crear temas temporales (o sobrescribir una preview), elegir una colección con banner y otra sin banner con productos reales, ejecutar los pasos 1 a 6, revisar las capturas y repetir a mano filtros, orden, vacío, AJAX y GET sin JS. Revisión independiente del resultado.
