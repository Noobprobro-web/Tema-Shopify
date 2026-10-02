ID: GPT-018-FIXES-READY
Estado: Preparación local verificada; aplicación pendiente.
Decisión requerida: Claude aplicar el parche; Johandry validar activos y decisiones comerciales.
Resumen en 5 líneas:
1. El parche de dos URLs sigue siendo aplicable al source actual.
2. Los heroes y las 33 propuestas de acabado Edition están entregados con procedencia.
3. Existe un mapeo de 38 variantes y una guía de asociación en Admin.
4. Copy EN/ES y ficha Theme Store están disponibles como borradores condicionados.
5. No se aplicaron cambios al tema ni a tiendas; no se cierra ninguna fila del ledger.
Archivos tocados: agent-comms/outbox-gpt/GPT-018-fixes-ready.md.
Desviaciones (Nivel 1 o Nivel 2): ninguna.
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo.
Verificación (comando, resultado y qué demuestra/qué no): ver evidencia abajo; aplicabilidad estática, no aceptación en tienda.
Lista de afirmaciones falsables numeradas:

## 1. Parche listo para Claude

Archivo: `agent-comms/outbox-gpt/harness-GPT-018/role-06-merchant/public-support-urls.diff`.
Corrige `config/settings_schema.json:7` y `:8` hacia los destinos públicos `https://noobprobro-web.github.io/sartorial-docs/docs.html` y `https://noobprobro-web.github.io/sartorial-docs/support.html`.

Comando ejecutado en esta revisión:
```powershell
git apply --check agent-comms/outbox-gpt/harness-GPT-018/role-06-merchant/public-support-urls.diff
```
Salida: sin errores; `PATCH_CHECK_EXIT=0` (registrado con `Write-Output "PATCH_CHECK_EXIT=$LASTEXITCODE"`).
`rg -n 'theme_documentation_url|theme_support_url' config/settings_schema.json` todavía devuelve las URLs `sartorial-atelier.myshopify.com/pages/theme-documentation` y `/pages/theme-support` en líneas 7–8: el parche no está aplicado.

Comando para Claude, desde la raíz del repo, tras revisar su working tree:
```powershell
git apply agent-comms/outbox-gpt/harness-GPT-018/role-06-merchant/public-support-urls.diff
```
Aplicación diferida por la restricción expresa de esta auditoría: no editar archivos del tema. Este comando no se ejecutó. Tras aplicación, Claude debe revisar diff, compuertas y ZIP; esta entrega no demuestra que el ZIP tenga URLs corregidas ni que un formulario de soporte envíe tickets.

## 2. Imágenes y guía de aplicación

Raíz de todos los archivos citados: `C:/Users/Johan/.codex/worktrees/2482/Tema Shopify/`.

- Heroes: `demo-assets/atelier/hero.png`, `demo-assets/edition/hero.png`, `demo-assets/archive/hero.png` (3200×1800, ampliaciones autorizadas; originales preservados).
- Fotos de acabados: `demo-assets/edition/`; 33 archivos de entrega 2000×2500. El manifest identifica exactamente cada ruta, producto, acabado e IDs.
- Procedencia: `demo-assets/PROVENANCE.md` y `demo-assets/{atelier,edition,archive}/PROVENANCE.md`.
- Mapeo: `agent-comms/outbox-gpt/harness-GPT-018/role-04-art/edition-variant-asset-manifest.json` y `.csv`.
- Instrucciones de Admin: `agent-comms/outbox-gpt/harness-GPT-018/role-04-art/admin-association-instructions.md`.

Evidencia existente leída, sin repetir validación de imágenes: `agent-comms/outbox-gpt/harness-GPT-018/role-04-art/validation-output.txt` contiene literalmente:
```json
{"manifestPairs":33,"uniqueAssetPaths":33,"uniqueVariantIds":38,"catalogVariantIds":38,"variantSetDiff":0,"mappingErrors":0,"physicalDimensionErrors":0}
```
El script registrado es `agent-comms/outbox-gpt/harness-GPT-018/role-04-art/validate-manifest.ps1`. Demuestra la correspondencia con el snapshot auditado; no acredita el catálogo vigente, derechos ni fidelidad física de los acabados. `rg --files demo-assets` confirma los tres `hero.png` y los cuatro documentos de procedencia. Johandry debe aprobar las propuestas, sustituir heroes y subir/asociar imágenes en Admin siguiendo la tabla; no se modificaron tiendas.

## 3. Contenido listo para revisión

- `agent-comms/outbox-gpt/harness-GPT-018/role-05-copy/copy-corrections-en-es.md`: propuestas EN/ES con condiciones de uso. Confirmar políticas de devolución, envío y trazabilidad antes de publicar claims.
- `agent-comms/outbox-gpt/GPT-018-theme-store-listing.md`: descripción, posicionamiento por preset y plan de capturas; borrador, sujeto a nombre/precio, DP-003 y catálogo final.
- `agent-comms/outbox-gpt/GPT-REPORT-018-multiagent-commercial-audit.md`: detalle de hallazgos confirmados y evidencia por rol.

## 4. Pendientes externos y límites

Johandry: aprobar naming/precio y derechos/fidelidad; asociar activos; revisar destacados agotados, galerías y claims; preparar capturas finales con contenido aprobado. Claude: aplicar el parche, revisar defaults de portada y coherencia de documentación siguiendo el informe y su alcance autorizado. No se inventaron parches adicionales.

La auditoría registra cero órdenes Bogus y checkout incompleto; la autorización de pedidos de prueba ya existe, pero no se ejecutaron en esta revisión local. Continúan pendientes lector de pantalla real, instalación vacía y aceptación del ZIP final. No se afirma que el tema esté listo para submission.

`git status --short` previo mostró únicamente entregables GPT-018 sin seguimiento bajo `agent-comms/outbox-gpt/`; emitió avisos de permisos al leer el ignore global de Git. No mostró modificaciones de archivos del tema. Esta entrega agrega solo este documento; no ejecutó push ni publicación.
