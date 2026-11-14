ID: REVIEW-SYNC-PREVIEWS-001
Estado: APROBADO CON CONDICIONES (técnicamente correcto; bloqueado hasta autorización expresa de Johandry, condición C1). Sin C1, RECHAZADO.
Decisión requerida: Johandry. Autorizar por escrito que se sobrescriban con push completo (sin `--only`, sin `--nodelete`) las tres previews existentes 190232297715, 190232330483 y 190232363251. Eso borra los archivos que solo están en remoto y reemplaza `config/settings_data.json` y las plantillas.
Resumen en 5 líneas:
1. Los tres exports son exactamente cb20d86 más el overlay de preset: 86/86 archivos por preset coinciden con Git y con el manifiesto. Recalculado sin usar lib.mjs ni verify.mjs.
2. Secretos: 0 coincidencias de STOREFRONT_PASSWORD y 0 de SHOPIFY_CLI_THEME_TOKEN en 261 archivos (3×86 más 3 manifiestos), contados sin imprimirlos. 0 patrones de token y 0 dotfiles.
3. El comando no puede publicar ni escribir en el tema live: no lleva `--publish`, `--live` ni `--allow-live`. Con `--theme <id>`, el CLI 4.8.0 solo acepta un ID o un nombre exacto, sin crear tema, y pide confirmación ante el live. Los tres IDs figuran como `unpublished`.
4. Normas: D10 permite "subir temas no publicados", pero el README de C-01 y PLAN-DIA dejan este push completo en manos de Johandry. Además, el README prohíbe tocar IDs que no se crearon para el procedimiento.
5. El push completo es el procedimiento correcto para tener identidad (`--only` es lo que desincronizó las previews), pero borra en remoto y pisa settings_data. Antes hace falta respaldo y revisar la diferencia (condiciones C2 a C4).
Archivos tocados: solo este informe (nuevo). Sin commit.
Desviaciones (Nivel 1 o Nivel 2): ninguna. Revisión de solo lectura. No se ejecutó nada contra la tienda y no se abrió `.secrets`.
Hallazgos extra fuera de alcance (con parche listo): H1 (P3). `identity.mjs --keep-pull` deja la copia en `os.tmpdir()/c01-pull-*` (identity.mjs:177) sin imprimir la ruta. Para usarla como respaldo hay que localizarla a mano. No hay parche: no se toca un harness aceptado.
Verificación (comando, resultado y qué demuestra/qué no): ver §1 a §4. Demuestra la identidad del export, la ausencia de secretos y la semántica de flags del CLI local. NO demuestra el estado actual remoto de las previews, ni si tienen personalizaciones del editor, ni cómo almacena Shopify el settings_data tras el push.
Lista de afirmaciones falsables numeradas:
1. HEAD = cb20d863b24c5b3a3256548d495adbc90367b5cc, rama lote-e-claude, `git status --porcelain` vacío.
2. Sartorial, Imprint y Archive: files=86, expected=86, gitMatch=86, bad=[], missing=[], manifest.commit = cb20d86 completo, manEntries=86, manBad=[], ningún archivo fuera de las 8 carpetas del tema.
3. `listings/` en cb20d86 solo contiene `listings/<preset>/templates/*` (3 por preset). El overlay de lib.mjs no omite ningún otro tipo de archivo.
4. El settings_data.json de Git tiene `current` como objeto y presets Sartorial/Imprint/Archive. El export lo reemplaza por `"current": "<Preset>"`.
5. Barrido del export: pwHits=0, tokHits=0, shopifyToken=0, ghToken=0, awsKey=0, privKey=0, previewQuery=0, nombres de variables secretas=0.
6. theme-list.json (15:49) lista 9 temas, todos `unpublished`, entre ellos 190232297715 "Preview sartorial 2026-11-05", 190232330483 "Preview imprint 2026-11-05" y 190232363251 "Preview archive 2026-11-05".
7. CLI local 4.8.0. Las únicas variables SHOPIFY* del entorno son SHOPIFY_FLAG_STORE (= tema-qkqpke0j.myshopify.com) y SHOPIFY_CLI_THEME_TOKEN. No hay `shopify.theme.toml` ni `.shopifyignore` en el repo raíz ni en los exports que añadan flags.
8. Entre e8f17e5 y cb20d86 cambian 9 archivos del tema (630 inserciones y 102 borrados). Tras el sync, las previews no sirven como "después" de C-01 (e8f17e5).

## 1. Identidad del export y secretos

Método independiente: `node -e` en línea con `git ls-tree -r -z cb20d86 -- assets blocks config layout locales sections snippets templates` y `git show`. El overlay se reimplementa aparte: `listings/<preset>/templates/` sobre `templates/`, y `settings_data.json` con `current=<Preset>`, `JSON.stringify(...,null,2)+"\n"`. Se compara el SHA-256 contra cada archivo del export y contra `<Preset>.manifest.json`. Salida literal:

```
Sartorial files 86 exp 86 gitMatch 86 bad [] missing [] manifestCommit true manPreset Sartorial manEntries 86 manBad [] manOnly [] presets Sartorial/Imprint/Archive repoCurrent (object)
  outside theme dirs: []
Imprint files 86 exp 86 gitMatch 86 bad [] missing [] manifestCommit true manPreset Imprint manEntries 86 manBad [] manOnly [] presets Sartorial/Imprint/Archive repoCurrent (object)
  outside theme dirs: []
Archive files 86 exp 86 gitMatch 86 bad [] missing [] manifestCommit true manPreset Archive manEntries 86 manBad [] manOnly [] presets Sartorial/Imprint/Archive repoCurrent (object)
  outside theme dirs: []
```

Secretos: se compararon los valores de entorno en memoria contra los bytes de cada archivo, sin imprimirlos. Las dos variables estaban `SET`.

```
{"files":261,"pwHits":0,"tokHits":0,"shopifyToken":0,"ghToken":0,"awsKey":0,"privKey":0,"previewQuery":0,"envName":0}
{}
```

Los manifiestos quedan junto a los directorios, no dentro, así que no se suben.

## 2. El comando no puede tocar el live ni publicar

- `node_modules/@shopify/cli/dist/chunk-ZH44BDUR.js` (función `Z`/`ee`). Sin `--unpublished`, el tema se busca con `filter:{live, theme}`. Si el resultado es el live sin `--allow-live`, el CLI pide confirmación interactiva o, en multi-entorno, rechaza. El comando propuesto no lleva `--publish`, `--live` ni `--allow-live`.
- `chunk-E55KS3GZ.js` (`T`). `--theme` solo casa con un `id` exacto o con un nombre exacto sin distinguir mayúsculas. Si no hay coincidencia, lanza "No themes on the store … match the ID or name". Con filtro no crea tema (`chunk-ZYX7UHCQ.js`, la rama `create` solo aplica sin filtro). Ningún nombre de tema es numérico.
- Los tres IDs están en `theme-list.json` como `unpublished` y con el nombre esperado. Ese listado se hizo con filtro de rol (9 de 9 son unpublished), así que no muestra el live. Basta como preflight, pero tiene horas: ver C5.
- Los mismos IDs son los de STATUS (`CLAUDE-CLOUD-STATUS.md:274` y `:60`) y los de `DELETE_EXCLUDED_IDS` (`lib.mjs:142`).

## 3. Normas: ¿se permite sobrescribir las previews existentes?

Citas literales:

- D10 (`CLAUDE-DECISION-AUTONOMIA-001.md:48-56`): "Claude se detiene y pregunta solo si ocurre alguno de estos casos: … un cambio fuera del plan o de las decisiones registradas; … cualquier escritura en tiendas distinta de subir temas no publicados; cualquier duda sobre credenciales."
- Reglas vigentes (`CLAUDE-CLOUD-STATUS.md:255`): "Nunca publicar ni borrar temas; solo subir temas no publicados." Y en `:254`: "el literal de contraseña cuenta 0 … antes de cada push, sin imprimirlo." Y en `:260`: "Detenerse y preguntar solo en los casos de D10."
- README C-01 (`harness-C-01-ID-001/README.md:46`): "## Procedimiento de despliegue (requiere autorización de Johandry)". En `:48`: "Reglas: nunca `--publish`, `--live` ni `--allow-live`; nunca tocar un ID que no se haya creado para esto; CLI 4.8.0 tras `npm ci`; un comando de Shopify cada vez, nunca en paralelo." En `:114`: "Autorización de Johandry para crear tres temas temporales …".
- `lib.mjs:140-142`: "Temas que nunca se borran: las tres previews existentes del proyecto."
- PLAN-DIA (`reviews-20261110/PLAN-DIA-20261110.md:23`): "C-01 | b | Subir a las previews los builds "antes" y "después" identificados (escritura de tienda, credenciales)". En `:87`: "Tienda: Johandry autoriza subir "antes" y "después" a una preview, en serie, con push completo (no `--only`)". En `:95`: "Las previews desincronizadas invalidan cualquier prueba en tienda hasta que se haga un push completo e identificado." En `:107`: "Para Johandry: … push completo de los builds "antes" y "después" para C-01".
- Sección 2026-11-10 de STATUS (`:3-54`): no contiene ninguna autorización de push. Lista "C-01 con `harness-C-01-ID-001`" en "Pruebas en tienda pendientes".
- Precedente (`CLAUDE-CLOUD-STATUS.md:139`): la última escritura en estas previews fue una "Sincronización autorizada", limitada a cinco `--only` con `--nodelete`.

Lectura: la letra de D10 ("subir temas no publicados") podría cubrir un push a una preview no publicada. Pero este push (a) borra archivos remotos que no están en el export, algo que va más allá de "subir"; (b) reemplaza settings_data y plantillas de previews que usan otras matrices (GPT R-A/R-B, Gate 5); y (c) los documentos específicos de la tarea (README C-01 y PLAN-DIA) lo ponen expresamente bajo autorización de Johandry. El README además prohíbe "tocar un ID que no se haya creado para esto", y estos tres IDs no se crearon para C-01. Es un "cambio fuera del plan o de las decisiones registradas" y, por D10, toca parar y preguntar. No encontré en el repositorio ninguna autorización de Johandry para esta sincronización (grep de "autoriz" en `reviews-20261110/` y en `docs/decisions*.md`). Si el coordinador la tiene en la sesión, debe citarla en el informe del push.

## 4. Riesgo para settings_data.json y elección entre push completo y `--only`

- Un push sin `--nodelete` deja el remoto igual al export. Se pierden en remoto: (a) todo `config/settings_data.json` actual, incluidas las personalizaciones del editor (logo e imágenes `shopify://shop_images/…`, menús, colecciones elegidas) que no estén en Git; (b) las plantillas JSON y section groups editados en el editor; (c) los archivos solo remotos, como plantillas alternativas creadas en el editor, que se borran. El settings_data de Git no tiene ninguna referencia `shopify://`, así que cualquier imagen asignada en el editor desaparecería.
- El método de las previews del 2026-11-05 (`--unpublished --listing`, STATUS:274) no es el de build-export (`current` como string con el nombre del preset). Lo más probable es que el settings_data remoto difiera aunque nadie lo haya tocado, y Shopify puede expandir el preset al guardarlo. Por eso identity.mjs puede marcar `mismatch` en settings_data después del push (README:69).
- `--only` con `--nodelete` es justo lo que causó la desincronización actual (README:9, PLAN-DIA:85) y no da identidad de árbol completo. Para la identidad que exigen C-01 y la verificación en tienda, el push completo es el procedimiento correcto. Una variante que conserve el settings_data remoto (`--ignore config/settings_data.json`) rompe la identidad del preset y no es aceptable salvo que Johandry lo decida.
- Diferencia de objetivo: cb20d86 ≠ e8f17e5. Tras el sync, estas previews no sirven como antes ni como después de C-01. El README recomienda temas temporales nuevos para C-01, y esa sigue siendo la vía para C-01.

## Veredicto

APROBADO CON CONDICIONES. Sin C1, RECHAZADO.

- C1. Autorización expresa de Johandry, citada literalmente en el informe del push, para sobrescribir con push completo (borrado de archivos solo remotos y reemplazo de settings_data y plantillas) los IDs 190232297715, 190232330483 y 190232363251, y para hacerlo con cb20d86.
- C2. Respaldo: ejecutar `identity.mjs --full --keep-pull` con los tres targets antes de cualquier push. Debe salir con 0 o con 1, nunca con 2. Un 1 es lo esperado por la desincronización. Localizar el directorio `c01-pull-*` en `os.tmpdir()` y comprobar que tiene las tres subcarpetas con `config/settings_data.json` antes de seguir (H1).
- C3. Revisar a mano, por preset, el informe previo. Hay que listar los `extra-remote`, que se borrarán, y comparar el settings_data y las plantillas remotos con el export. Si aparecen referencias que solo existen en remoto (`shopify://shop_images`, menús o colecciones fuera de Git) o plantillas alternativas del editor, parar y consultar a Johandry antes de pisar.
- C4. Repetir el conteo del literal sobre los exports justo antes de cada push (STATUS:254). Debe dar 0.
- C5. Justo antes de cada push, un `theme list --role unpublished --json` nuevo, no el de las 15:49. El ID debe seguir ahí con su nombre y rol `unpublished`. Si no, parar.
- C6. El comando debe ser exactamente `node node_modules/@shopify/cli/bin/run.js theme push --theme <id> --path <scratchpad>/sync/<Preset> --store tema-qkqpke0j.myshopify.com --no-color`, uno a la vez, con la correspondencia 190232297715→Sartorial, 190232330483→Imprint y 190232363251→Archive verificada dos veces. Nada de `--publish`, `--live`, `--allow-live`, `--unpublished`, `--only`, `--nodelete` ni `--force` de git. Si aparece cualquier prompt de confirmación, cancelar: significa que el destino no es el esperado. Ante un 429, aplicar README:54.
- C7. Ejecutar `identity.mjs --full` después de los tres pushes con `<id>:cb20d86:<Preset>`. Se exige `ok=true`. Si el único fallo es settings_data `mismatch`, revisarlo a mano (README:69) sin volver a subir ni relajar el script. Cualquier otro fallo detiene la tanda.
- C8. No borrar ni restaurar nada sin una nueva autorización. Si hace falta revertir, la restauración desde la copia de C2 también es una escritura y necesita la autorización de C1. Registrar en STATUS que estas previews ya no sirven como antes ni como después de C-01 y que la evidencia previa (GPT R-A/R-B, Gate 5) corresponde al estado anterior al sync.
