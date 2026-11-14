ID: REVIEW-SYNC-RESULT-001
Estado: ACEPTADO CON CONDICIONES (contenido de las previews = cb20d86 + overlay de preset; condiciones C1 a C3 sobre lo que no es verificable localmente).
Decisión requerida: ninguna para aceptar el sync. Johandry/Gemini deben saber que el respaldo no tiene huella previa (C2) y que la procedencia remota de post-sync/ es inferida (C1).
Resumen en 5 líneas:
1. post-sync/<id> tiene 86 archivos en los tres temas, el mismo conjunto de rutas que sync/<Preset>, con 0 rutas solo en uno de los dos lados. 63 son idénticos byte a byte, 22 JSON difieren solo por el comentario autogenerado de Shopify y 1 (templates/index.json) tiene diferencias semánticas.
2. Las diferencias de templates/index.json son exactamente las declaradas: 5 `settings: {}` añadidos en los bloques de featured_product y `manifesto.blocks = {}` / `manifesto.block_order = []` omitidos. Las 7 están vacías y no hay ninguna otra.
3. Cada export coincide con `git show cb20d86` más el overlay reimplementado (listings/<preset>/templates y settings_data `current=<Preset>`): expected=86, bad=[], extra=[]. Manifiesto: commit completo cb20d86, 86 entradas, manBad=[]. En remoto, `current` es "Sartorial", "Imprint" y "Archive".
4. Secretos en post-sync/: STOREFRONT_PASSWORD=0 y SHOPIFY_CLI_THEME_TOKEN=0 en los tres temas, con las dos variables definidas en el entorno. 0 dotfiles. Los logs de pull del scratchpad también dan 0/0.
5. backup-pre-sync: 85 archivos por tema, 0 vacíos, 0 JSON sin parsear y la ctime máxima (15:58:47 a 15:59:19) es anterior al primer archivo de post-sync (16:03:43). No existe ningún hash previo con el que demostrar que los bytes no cambiaron.
Archivos tocados: solo este informe (nuevo). El script propio está en el scratchpad, en /tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/rev2/r2.mjs (fuera del repo). Sin commit.
Desviaciones (Nivel 1 o Nivel 2): ninguna. No se ejecutó ningún comando de Shopify, no se abrió `.secrets` y no se imprimió ningún valor secreto. No se reutilizaron chk.mjs, post.mjs, norm.mjs ni lib.mjs: lib.mjs/build-export.mjs solo se leyeron como especificación del overlay.
Hallazgos extra fuera de alcance (con parche listo): H1 (P3, sin parche). scratchpad/id-pre.log contiene "identity: theme pull del tema 190232297715 devolvio 1": un pull de identity.mjs falló antes del respaldo. El respaldo se hizo después con pull1.log, que terminó con éxito (bloque "Next steps"). No afecta a este veredicto.
Verificación (comando, resultado y qué demuestra/qué no): `node rev2/r2.mjs`, más tres `node -e`/`find` en línea (salidas en §1 a §4). Demuestra la equivalencia local post-sync ↔ export ↔ Git y la ausencia de los dos secretos. NO demuestra que post-sync/ salió de un pull posterior al push (C1), ni que los bytes del respaldo sean los que había en remoto (C2), ni cómo se renderiza el tema en la tienda (C3).
Lista de afirmaciones falsables numeradas:
1. HEAD = cb20d86 ("Record third integration batch..."). El único archivo sin rastrear antes de este informe era REVIEW-SYNC-PREVIEWS-001.md.
2. Para 190232297715/Sartorial, 190232330483/Imprint y 190232363251/Archive: export=86, remote=86, onlyExport=[], onlyRemote=[], exact=63, commentOnly=22, jsonFormatOnly=0, semanticFiles=1, nonJsonMismatch=[].
3. Ningún export tiene comentario inicial. Los 69 comentarios iniciales del remoto (3×23) son de solo dos textos, "...updated by the Shopify admin theme editor..." (60) y "...admin language editor..." (9). Al quitarlos, el resto del archivo es idéntico byte a byte.
4. templates/index.json: las únicas rutas que difieren son las 7 declaradas, todas con valor `{}` o `[]`.
5. Git + overlay: expected=86, hasPreset=true, bad=[], extraInExport=[], manCommit=cb20d863b24c5b3a3256548d495adbc90367b5cc, manEntries=86, manBad=[] en los tres presets.
6. Secretos en post-sync: 0/0/0 de STOREFRONT_PASSWORD y 0/0/0 de SHOPIFY_CLI_THEME_TOKEN, y dotfiles=[].
7. Backup: 85/85/85 archivos. Respecto a post-sync, la única ruta que falta es snippets/card-swatch-fit.liquid. diff -rq da 19/18/18 entradas distintas, así que el respaldo no es una copia del estado posterior.

## 1. Método

He escrito un script nuevo (`rev2/r2.mjs`) que hace lo siguiente:
- Recorre los tres árboles (sync/<Preset>, post-sync/<id> y backup-pre-sync/<id>).
- Compara primero byte a byte. En los .json quita solo un comentario `/* ... */` inicial y compara el texto restante. Si aún difiere, parsea y compara la forma canónica (claves ordenadas). Si eso también difiere, hace un diff estructural ruta a ruta.
- Reconstruye el tema esperado con `git ls-tree -r cb20d86 -- assets blocks config layout locales sections snippets templates` + `git show`. Encima aplica `listings/<preset>/templates/*` sobre `templates/` y `settings_data.json` con `current=<Preset>`, serializado con `JSON.stringify(d,null,2)+"\n"`, igual que build-export.mjs/lib.mjs `expectedTheme`.
- Cuenta los secretos con `split(valor).length-1` sobre el contenido latin1, leyendo `process.env` sin imprimir el valor.

## 2. Salida literal (r2.mjs)

```
env PW set true len>0 true TK set true

== Sartorial 190232297715: export=86 remote=86 backup=85 onlyExport=[] onlyRemote=[]
 exact=63 commentOnly=22 jsonFormatOnly=0 semanticFiles=1 nonJsonMismatch=[]
 remoteLeadingComments=["/* * ------------------------------------------------------"]
 SEM templates/index.json
    extra-in-remote .sections.featured_product.blocks.title.settings exp= undefined rem= {}
    extra-in-remote .sections.featured_product.blocks.price.settings exp= undefined rem= {}
    extra-in-remote .sections.featured_product.blocks.variant_picker.settings exp= undefined rem= {}
    extra-in-remote .sections.featured_product.blocks.quantity.settings exp= undefined rem= {}
    extra-in-remote .sections.featured_product.blocks.description.settings exp= undefined rem= {}
    missing-in-remote .sections.manifesto.blocks exp= {} rem= undefined
    missing-in-remote .sections.manifesto.block_order exp= [] rem= undefined
 git: expected=86 hasPreset=true bad=[] extraInExport=[] manCommit=cb20d863b24c5b3a3256548d495adbc90367b5cc manPreset=Sartorial manEntries=86 manBad=[]
 secrets in post-sync: STOREFRONT_PASSWORD=0 SHOPIFY_CLI_THEME_TOKEN=0 dotfiles=[]
 backup: files=85 newestMtime=2026-11-10T15:58:47.776Z onlyBackupVsRemote=[] onlyRemoteVsBackup=["snippets/card-swatch-fit.liquid"]

== Imprint 190232330483: export=86 remote=86 backup=85 onlyExport=[] onlyRemote=[]
 exact=63 commentOnly=22 jsonFormatOnly=0 semanticFiles=1 nonJsonMismatch=[]
 SEM templates/index.json   (mismas 7 rutas y valores que Sartorial)
 git: expected=86 hasPreset=true bad=[] extraInExport=[] manCommit=cb20d863b24c5b3a3256548d495adbc90367b5cc manPreset=Imprint manEntries=86 manBad=[]
 secrets in post-sync: STOREFRONT_PASSWORD=0 SHOPIFY_CLI_THEME_TOKEN=0 dotfiles=[]
 backup: files=85 newestMtime=2026-11-10T15:58:56.571Z onlyBackupVsRemote=[] onlyRemoteVsBackup=["snippets/card-swatch-fit.liquid"]

== Archive 190232363251: export=86 remote=86 backup=85 onlyExport=[] onlyRemote=[]
 exact=63 commentOnly=22 jsonFormatOnly=0 semanticFiles=1 nonJsonMismatch=[]
 SEM templates/index.json   (mismas 7 rutas y valores, en otro orden)
 git: expected=86 hasPreset=true bad=[] extraInExport=[] manCommit=cb20d863b24c5b3a3256548d495adbc90367b5cc manPreset=Archive manEntries=86 manBad=[]
 secrets in post-sync: STOREFRONT_PASSWORD=0 SHOPIFY_CLI_THEME_TOKEN=0 dotfiles=[]
 backup: files=85 newestMtime=2026-11-10T15:59:19.429Z onlyBackupVsRemote=[] onlyRemoteVsBackup=["snippets/card-swatch-fit.liquid"]
```

En las salidas de Imprint y Archive he resumido las líneas SEM repetidas. La salida completa tenía las 7 líneas literales en cada uno de los dos.

## 3. Comentarios autogenerados y `current`

```
190232297715 remote current= "Sartorial"
190232330483 remote current= "Imprint"
190232363251 remote current= "Archive"
export files with leading comment: 0
distinct remote comments: 2
60x  /* ... IMPORTANT: The contents of this file are auto-generated. ... Shopify admin theme editor ... */
9x   /* ... IMPORTANT: The contents of this file are auto-generated. ... Shopify admin language editor ... */
```

Qué significan las diferencias semánticas: en el remoto, `settings: {}` en un bloque equivale a no tener settings (se usan los valores por defecto del schema). `blocks: {}` + `block_order: []` en el export equivale a que la sección no tenga bloques, y eso es lo que ocurre al omitirlos. Ninguna lleva contenido.

## 4. Respaldo

```
190232297715 files=85 maxCtime=15:58:47.776 zeroSize=0 differFromPost=19
190232330483 files=85 maxCtime=15:58:56.571 zeroSize=0 differFromPost=18
190232363251 files=85 maxCtime=15:59:19.429 zeroSize=0 differFromPost=18
backup json unparsable: [] (los tres)
post-sync: primer archivo 16:03:43.62, último 16:04:44.79
```

Que la ctime máxima sea anterior al sync indica que no se ha escrito ni cambiado ningún permiso en el respaldo desde el pull. Con un usuario root eso no es una prueba criptográfica.

## 5. Condiciones (lo no verificable desde aquí)

- C1. La procedencia de post-sync/ se infiere, no se ha verificado. No hay en el scratchpad ningún log de los pulls post-sync (los *.log son de 15:58 a 15:59, del respaldo). Los indicios de que viene de Shopify y no es una copia del export son tres: los 69 comentarios autogenerados que el export no tiene, el reordenado/`settings: {}` que añade el servidor y las mtimes de 16:03 a 16:04. Para cerrarlo, Gemini o Johandry pueden repetir un `theme pull` a un directorio nuevo y volver a ejecutar r2.mjs. No lo he hecho porque está fuera de mi alcance.
- C2. Integridad del respaldo: se verifica el recuento (85), la legibilidad y las marcas de tiempo. No hay un manifiesto SHA-256 tomado en el momento del pull, así que "intacto" queda en `no verificado` a nivel de bytes. Recomendación: generar ahora un manifiesto del respaldo y conservarlo.
- C3. Esto no es Gate 5. La identidad de archivos no demuestra el render en la tienda ni en móvil.

## 6. Estado (vocabulario del ledger)

- Identidad de las previews con cb20d86 + preset: `cumplido` (evidencia en §2 y §3).
- Ausencia de secretos en post-sync: `cumplido` (§2).
- Integridad del respaldo previo: `no verificado` a nivel de bytes (C2). El recuento sí es correcto.
- Verificación en tienda real (render): `no verificado` (C3).

No cierro ninguna fila de docs/requirements-ledger.md. Esta revisión es de proceso.
