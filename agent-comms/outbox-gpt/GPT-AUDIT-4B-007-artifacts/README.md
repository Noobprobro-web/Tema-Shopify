# Evidencia GPT-AUDIT-4B-007

Ejecutar desde la raiz del repositorio, no desde esta carpeta. Requiere las dependencias existentes del proyecto, Chromium de Playwright y sesion Shopify CLI autorizada. No hay dependencias nuevas.

## Reproduccion del original

1. Ejecutar `node agent-comms/outbox-gpt/GPT-AUDIT-4B-007-artifacts/prepare.mjs`. Copia produccion a `.tmp/gpt-audit-4b-007/theme` y habilita configuraciones QA solo alli.
2. Iniciar `npx.cmd shopify theme dev --store tema-qkqpke0j.myshopify.com --path .tmp/gpt-audit-4b-007/theme --host 127.0.0.1 --port 9292 --live-reload off --no-color`. No usar `--theme` del tema publicado. Si el puerto esta ocupado, resolverlo antes; los probes usan 9292.
3. Ejecutar `node agent-comms/outbox-gpt/GPT-AUDIT-4B-007-artifacts/probe.mjs` para inventario y hash del JS servido.
4. Ejecutar `node agent-comms/outbox-gpt/GPT-AUDIT-4B-007-artifacts/browser-audit.mjs` y `node agent-comms/outbox-gpt/GPT-AUDIT-4B-007-artifacts/edge-audit.mjs` por separado. Un exit no cero es esperado mientras existan las reproducciones rojas. Cada JSON distingue `pass:false` de `harnessError`.
5. Ejecutar `node agent-comms/outbox-gpt/GPT-AUDIT-4B-007-artifacts/static-audit.mjs` para inventario URL/info.

Los probes usan carritos anonimos propios y limpian nota/items al terminar. Solo prueban tienda de desarrollo; no checkout. `browser-audit.mjs` admite como segundo argumento una expresion regular para seleccionar probes. Las salidas nuevas van a `.tmp/`, no sobrescriben los registros de esta carpeta.

## Parche propuesto, sin aplicarlo al tema

`node agent-comms/outbox-gpt/GPT-AUDIT-4B-007-artifacts/run-proposed.mjs`

Reconstruye un candidato temporal desde el JS original y los cuatro `.patch`; comprueba aplicacion, sintaxis y ejecuta las suites seleccionadas reemplazando el asset unicamente mediante routing de Playwright. `--validate-only` omite el navegador. Ningun `git apply` de escritura apunta a produccion. Los patches estan preparados contra bee742b y necesitan nueva revision si cambia la base.

Detener Shopify CLI al terminar. La vista previa temporal no es evidencia de la configuracion del Theme ID publicado.

## Lectura de evidencias

- `manifest.json`: commit, hashes, integridad de 69 archivos y diferencia entre ID solicitado y tema de prueba.
- `browser-results.json`: primer resultado crudo, con la asercion de titulo erronea preservada.
- `browser-results-focused.json`: repeticion correcta del caso de conteo igual con el titulo real.
- `browser-results-effective.json`: combina esa unica repeticion con los demas resultados originales; F01 y R01 siguen rojos.
- `edge-results.json`: rAF, desmontaje, desconexion, teclado, catalogo y cantidades del original.
- Archivos `*-proposed.json` y capturas `*-proposed.png`: corresponden exclusivamente a candidatos, no al original.
- `static-results.json`: trece URL totales, diez objetivo del parche, tres con info previa distinta.
- `gates-static.log`: salida literal completa de las ocho compuertas sobre bee742b.
- `source-evidence.txt`: lineas del codigo original utilizadas por el dictamen.
- `patches/`: propuestas de correccion; no autorizacion de implementacion ni publicacion.

La primera preparacion de la fixture uso por error `quantity` en featured-product; Shopify rechazo esa configuracion temporal. Se corrigio a su tipo real `quantity_selector` antes de obtener los resultados aqui conservados. No fue un defecto del tema. Los scripts adjuntos ya contienen ambas correcciones del harness.
