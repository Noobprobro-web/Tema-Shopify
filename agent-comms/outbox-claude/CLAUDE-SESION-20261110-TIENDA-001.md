ID: CLAUDE-SESION-20261110-TIENDA-001
Estado: ENTREGADO CON BLOQUEOS. Previews sincronizadas con cb20d86 (aceptado con condiciones); ninguna prueba en tienda concluyente (dos corridas diagnósticas fallaron antes de medir). Ninguna fila del ledger cerrada.
Decisión requerida: Johandry y Gemini deben decidir los puntos (a) a (e) de la sección "Decisiones requeridas" (más abajo). Sin (a) y (b) no se puede repetir ninguna corrida en tienda.

Resumen en 5 líneas:
1. Entorno: rama `lote-e-claude` en cb20d86; credenciales presentes (SHOPIFY_CLI_THEME_TOKEN, STOREFRONT_PASSWORD, SHOPIFY_FLAG_STORE); STOREFRONT_ORIGIN, THEME_ID, COLLECTION_PATH y PRODUCT_PATH no definidas; `npm ci` OK; Chromium compatible con Playwright 1.63.0.
2. Las tres previews (190232297715 Sartorial, 190232330483 Imprint, 190232363251 Archive) se sincronizaron con los exports de cb20d86 (86 archivos): pull de verificación 86/86, sin extra ni faltantes en remoto; solo normalización de Shopify en `templates/index.json`. REVIEW-SYNC-RESULT-001: ACEPTADO CON CONDICIONES.
3. Se corrigió `identity.mjs` (el pull fallaba con EXIT 1 porque no se creaba el directorio de destino; CLI 4.8.0 rechaza `--path` inexistente). REVIEW-PRECOMMIT-001: COMMITEAR. El SHA-256 del script cambió (0d75bd4a a 67912f75): requiere aceptación.
4. Corrida 1 (`run.mjs --read-only`) falló antes del navegador con AXE_SOURCE_DIGEST_NOT_EXPECTED: la constante AXE_SHA256 de run.mjs línea 19 nunca coincidió con `tests/vendor/axe.min.js`. No se editó run.mjs (aceptado por SHA).
5. Corrida 2 (`run.mjs --cart --theme=190232297715`) falló en storefront_access con AUTH_RESPONSE_NOT_ACCEPTED tras un único POST /password, sin 429 y sin tocar el carrito. No se repitió (regla D10). No se probó C-01, A-03, B-01, B-04 ni R-A en tienda.

Archivos tocados:
- agent-comms/outbox-claude/harness-C-01-ID-001/identity.mjs (modificado: mkdirSync del destino del pull y 200 caracteres de stderr en el error de runCli; 11 inserciones, 6 borrados)
- agent-comms/outbox-gpt/harness-GPT-RA-RB-001/results/RA-RB-read-only-20261110T161150849Z-4ab6cf14-64aa-4290-a995-45f909260397.json (nuevo, resultado fallido)
- agent-comms/outbox-gpt/harness-GPT-RA-RB-001/results/RA-RB-cart-20261110T161239208Z-6a940aea-246f-422d-bc66-cfdeac40bfe5.json (nuevo, resultado fallido)
- agent-comms/outbox-claude/reviews-20261110/REVIEW-SYNC-PREVIEWS-001.md (nuevo)
- agent-comms/outbox-claude/reviews-20261110/REVIEW-SYNC-RESULT-001.md (nuevo)
- agent-comms/outbox-claude/reviews-20261110/REVIEW-PRECOMMIT-001.md (nuevo)
- agent-comms/outbox-claude/CLAUDE-SESION-20261110-TIENDA-001.md (este informe)
- agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md (bloque añadido en "Sesión Claude 2026-11-10")
No se creó ni borró ningún tema. Sin cambios en código del tema, run.mjs, run-b02.mjs ni docs/requirements-ledger.md.

Desviaciones (Nivel 1 o Nivel 2):
- Nivel 2: REVIEW-SYNC-PREVIEWS-001 (APROBADO CON CONDICIONES) exigía autorización de Johandry para sincronizar las previews. Se tomó como autorización la instrucción expresa del usuario en esta sesión de sincronizar las previews. Johandry debe confirmarlo.
- Nivel 1: modificación de identity.mjs, un harness ya aceptado, para corregir un fallo real (directorio de destino ausente). Pendiente de aceptación de Gemini/Johandry.
- Consecuencia: con cb20d86 en las tres previews, ya no sirven como "antes/después" de C-01 (cb20d86 no es e8f17e5 ni 258ca4f). La evidencia R-A/R-B/Gate 5 anterior corresponde al estado previo de las previews.

Hallazgos extra fuera de alcance (con parche listo):
- AXE_SHA256 (run.mjs línea 19, introducida en bfddf79 el 2026-11-05) = 3e34029d...4d7481 no coincide con tests/vendor/axe.min.js (b511cd9d...7b75e3, axe 4.10.2, único commit 42e3b9e). No es CRLF y ese hash no existe en el historial. Parche propuesto (NO aplicado): sustituir la constante por b511cd9dec01c76f4b2ad1723b66b6db37d4c2eb4ed199076e1829d9ee7b75e3. run-b02.mjs exige el SHA de run.mjs (0f936942...), así que hay que recalcular y reaceptar. Decisión de Gemini/Johandry.
- REVIEW-PRECOMMIT-001, P3: H1 el selftest no tiene caso de fallo de pull; H2 redactar los valores de STOREFRONT_PASSWORD y SHOPIFY_CLI_THEME_TOKEN en el detalle de stderr; H4 tres directorios vacíos /tmp/c01-pull-*. P2 H3 fuera de este commit.
- Copia temporal `/axe_head.js` (fuera del repo) dejada por un subagente; su `rm` fue bloqueado por la comprobación de seguridad y no se esquivó. Borrar a mano: `rm /axe_head.js`. `/home/user/axe_head_tmp.js` no existe.
- C-01: el harness solo admite par antes/después con e8f17e5 como "después". Con una única preview por preset solo hay observación de estado único (`--stage before`, no concluyente y con etiqueta engañosa). No hay capture.mjs ni plan en harness-C-01-ID-001; capture.mjs está en harness-GPT-C01-COLLECTION-001 (SHA ce2dab82...). "6 celdas" = 3 presets x 2 viewports por colección; hay que escribir el plan. Colección conocida: /collections/the-permanent-collection; Imprint nunca muestra banner. Un par real exige subir 258ca4f a las previews (autorización de Johandry, README:48).
- A-03/B-01/B-04: `run.mjs --read-only` cubre solo humo parcial (foco, axe color-contrast, desbordamiento, cruces del menú); la matriz completa no tiene runner versionado. B-04 solo cubre eco de nota por API en `--cart`, y `show_cart_note` vale false por defecto, así que el textarea no se pinta (activarlo es configuración de Johandry). B-02 NO se ejecutó: no hay evidencia de producto con selector nativo visible (fixture de Johandry, STATUS:47).

Decisiones requeridas (Johandry):
(a) Verificar o rotar STOREFRONT_PASSWORD (la actual fue rechazada; causa probable, no verificable: rotada/incorrecta o flujo cambiado).
(b) Decidir la corrección de AXE_SHA256 (propuesta arriba) o restaurar tests/vendor/axe.min.js.
(c) Aceptar el cambio de identity.mjs.
(d) Autorizar subir 258ca4f/e8f17e5 a previews si se quiere C-01 conclusivo.
(e) Aportar los fixtures pendientes.
Orden sugerido tras (a) y (b): preflight, R-A `--read-only`, R-B `--cart` en una preview con FIFO, C-01 estado único.

Verificación (comando, resultado y qué demuestra/qué no):
Salida literal copiada de la terminal de esta sesión.

1. Comando: `git diff --stat`
   Salida:
   ```
    .../outbox-claude/harness-C-01-ID-001/identity.mjs | 17 +++++++++++------
    1 file changed, 11 insertions(+), 6 deletions(-)
   ```
   Demuestra: el único archivo rastreado modificado antes del commit es identity.mjs. No demuestra que el pull real funcione ahora.
2. Comando: `git rev-parse origin/lote-e-claude` (antes del push)
   Salida: `cb20d863b24c5b3a3256548d495adbc90367b5cc`
   Demuestra: el remoto estaba en cb20d86 al iniciar el cierre.
3. Comando: `sha256sum identity.mjs | cut -c1-8`
   Salida: `67912f75`
   Demuestra: el SHA nuevo del harness modificado.
4. Comando: `ls /axe_head.js /home/user/axe_head_tmp.js`
   Salida: `ls: cannot access '/home/user/axe_head_tmp.js': No such file or directory` y `/axe_head.js`
   Demuestra: /axe_head.js sigue existiendo fuera del repo; el otro no existe.
5. Selftest de identity.mjs: 48/48 antes y después del arreglo (reportado por el subagente verificador). Es un stub, no prueba el CLI real.
6. Los resultados de las corridas 1 y 2 están en los dos JSON listados en "Archivos tocados"; no se pega más salida aquí.
No demuestra: ningún comportamiento de tienda, móvil ni Gate 5. Las previews no se renderizaron.

Lista de afirmaciones falsables numeradas:
1. HEAD era cb20d86 en `lote-e-claude` al iniciar y origin/lote-e-claude también era cb20d86.
2. Las tres previews eran unpublished con processing=false antes de la sincronización; no hubo 429.
3. El push de los exports (86 archivos) a los tres IDs terminó con exit 0 en cada uno; el pull posterior dio 86/86, 0 extra-remote, 0 missing-remote.
4. Las únicas diferencias tras el pull están en templates/index.json: `settings:{}` vacíos en 5 bloques de featured_product y blocks/block_order del manifesto omitidos.
5. El respaldo previo (85 archivos por tema) está en el scratchpad y no se le tomó SHA-256 en su momento (no verificado).
6. identity.mjs falla sin el arreglo porque el CLI 4.8.0 rechaza `--path` inexistente; el arreglo es mkdirSync más 200 caracteres de stderr.
7. AXE_SHA256 en run.mjs línea 19 no coincide con el SHA-256 de tests/vendor/axe.min.js (b511cd9d...7b75e3).
8. La corrida `--read-only` terminó con AXE_SOURCE_DIGEST_NOT_EXPECTED, con sessions vacío y sin peticiones a la tienda.
9. La corrida `--cart --theme=190232297715` terminó con AUTH_RESPONSE_NOT_ACCEPTED tras exactamente un POST /password, con cartTouched=false.
10. Se consumieron 2 de las 5 corridas diagnósticas autorizadas.
11. Ninguna fila de docs/requirements-ledger.md cambia de estado; A-03, B-01, B-04 y C-01 no tienen fila propia. Estados: C-01 código completo (harness), A-03/B-01/B-04 código completo, R-A/R-B/Gate 5 no verificado, B-02 en tienda no verificado, `show_cart_note` desactivado = ausente en tienda. Ninguno pasa a cumplido.
12. Ningún comando de Shopify distinto de los descritos se ejecutó y ningún tema fue creado o borrado.
