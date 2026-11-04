ID: GPT-INVENTARIO-LOTE-0-HERRAMIENTAS-001
Fecha: 2026-11-02 (America/Caracas)
Estado: Inventario 0-05 local parcial; pendiente acreditación para cada herramienta, candidato y revisor. No cierra Lote 0.
Decisión requerida: Ninguna activación comercial adicional para preparar 0-05-P3; revisar y completar las precondiciones indicadas antes de editar o reutilizar esos arneses.
Resumen en 5 líneas:
1. Un explorador Terra realizó el inventario de solo lectura en la base aislada, sin red, instalación ni ejecución de arneses.
2. Se identificaron ejecutables locales, metadatos de dependencias y algunos arneses históricos; existencia no acredita funcionamiento ni acceso independiente de Claude.
3. El checkout no tiene node_modules; las versiones del lock no equivalen a instalaciones disponibles.
4. Los dos gate5 requieren saneamiento y revisión antes de reutilizarse; otro arnés acreditado es una alternativa y P3 conserva su prioridad.
5. Faltan ficha de build objetivo, dependencias funcionales, cobertura, seguridad y disponibilidad por revisor; no se cierra 0-05 ni Lote 0.
Archivos tocados: este documento nuevo en agent-comms/outbox-gpt/.
Desviaciones (Nivel 1 o Nivel 2): Ninguna; transcripción documental de resultados delegados.
Hallazgos extra fuera de alcance (con parche listo): Ninguno; no se preparó ni ejecutó parche.
Verificación (comando, resultado y qué demuestra/qué no): Informe delegado y categorías de comandos abajo; quien redacta esta ficha no repitió las búsquedas del explorador.
Lista de afirmaciones falsables numeradas:
1. Las versiones de runtime, rutas, inventarios y conteos se atribuyen al explorador Terra; reflejan su proceso y máquina en esta fecha.
2. La presencia de un wrapper, archivo, lock o término no acredita ejecución, seguridad, versión efectiva, cobertura ni disponibilidad para Claude.
3. El análisis textual de los gate5 no imprimió operandos ni acredita sintaxis o ausencia de secretos.
4. Los resultados de búsqueda legacy no acreditan ausencia fuera de la base aislada ni identifican arneses a partir de tokens genéricos.
5. 0-05-P3 sigue P3 y no se ejecutó en esta actuación; R-0 y Lote 0 permanecen pendientes.

# Método y base del informe delegado

El explorador Terra informó que trabajó en `C:\Users\Johan\Documents\Drive\Tema Shopify\isolated-sartorial-lote0-09f` con HEAD `09f834295074402d9b93aa8ead83a732d78e6608`. Según su informe, `git status --short --branch` antes y después mostró HEAD detached y exactamente las cuatro modificaciones esperadas: `assets/base.css`, `assets/theme.js`, `assets/product-zoom.js` y `listings/sartorial/templates/index.json`.

Su revisión fue local y de lectura: sin red, instalación, ejecución de arneses ni uso de credenciales. Usó `Get-Command`, `node --version`, `npm --version`, `git --version`, `Get-Content` de metadatos con `ConvertFrom-Json -AsHashtable`, `Test-Path`, conteos y categorías en memoria, `rg --files`, `rg -l` y `git status`. Una primera lectura del lock sin `-AsHashtable` falló por una clave vacía; el explorador corrigió el método con `-AsHashtable`. No se presenta ese intento fallido como resultado válido.

Esta ficha recoge el informe recibido; su autor no ejecutó de nuevo los comandos de inventario. Los resultados no demuestran instalación o disponibilidad en otro proceso o para otro revisor.

# Runtimes, dependencias y herramientas

| Elemento | Evidencia observada por el explorador | Límite |
| --- | --- | --- |
| Node | `node --version` → `v24.18.0`; ejecutable `C:\Program Files\nodejs\node.exe`. | No acredita acceso independiente de Claude. |
| npm | `npm --version` → `11.16.0`; wrapper `C:\Program Files\nodejs\npm.ps1`. | La presencia del wrapper no acredita dependencias del proyecto. |
| Git | `git --version` → `git version 2.55.0.windows.3`; ejecutable `C:\Program Files\Git\cmd\git.exe`. | Disponible en el proceso observado; no acredita acceso de otro revisor. |
| Shopify CLI | `Get-Command shopify` encontró `C:\Users\Johan\AppData\Roaming\npm\shopify.ps1`; metadatos locales de `@shopify/cli/package.json`: `@shopify/cli` `4.9.4`. El proyecto declara `^4.8.0` y su lock fija `4.8.0`. | El explorador no invocó la CLI; wrapper y metadatos no prueban que funcione. No hay instalación en el checkout. |
| Lock y directorios | `package-lock.json` existe, 43.638 bytes, `lockfileVersion` 3; `pnpm-lock.yaml` y `node_modules` del checkout ausentes. Hay un wrapper pnpm del Codex Runtime en PATH. | El lock no demuestra paquetes instalados. La presencia de pnpm en PATH no acredita instalación o configuración del proyecto. |
| Playwright | Lock: `@playwright/test`, `playwright` y `playwright-core` en `1.63.0`; existe `playwright.config.mjs`. No encontró ejecutable `playwright` en el PATH del proceso ni paquetes en `node_modules` local. | No verificó navegador instalado, ejecución, integración, instalación global alternativa ni acceso de Claude. |
| Lighthouse | Sin ejecutable `lighthouse` en el PATH del proceso y sin entrada correspondiente en lock. | No se descarta instalación alternativa ni se acredita ejecución o medición. |
| axe | `tests/vendor/axe.min.js` tiene cabecera `axe 4.10.2`; no hay entrada `axe-core` en el lock. | Una cabecera y un archivo no acreditan integración, versión efectiva de una ejecución o cobertura. |

# Arneses y compuertas

El explorador identificó `scripts/gate5-live-verify.mjs` (284 líneas), `scripts/gate5-complete-verification.mjs` (294 líneas) y `scripts/gate5-empirical.mjs`. Su extracción estática en memoria, sin mostrar literales, clasificó que los dos primeros mencionan Playwright, origen externo y variable de entorno; ambos contienen en línea 5 un operador de fallback cuyo operando no comienza con comilla, y referencias a origen, ID y preview. La búsqueda encontró **cero coincidencias textuales** de Lighthouse y de `axe-core` o `axe.run` en esos dos archivos. El empírico menciona Playwright y axe. Estas observaciones son textuales, no una prueba de sintaxis, seguridad, funcionamiento ni cobertura. No se ejecutó `node --check` antes del saneamiento ni se imprimieron operandos.

Se encontraron también estas rutas históricas:

- `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/run-lighthouse-audit.mjs`
- `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/run-axe-audit.mjs`
- `agent-comms/outbox-claude/harness-AUDIT-FINAL-003/08-lighthouse.mjs`
- `agent-comms/outbox-claude/harness-AUDIT-FINAL-003/02b-axe.mjs`

Las búsquedas detectaron términos pertinentes en esos archivos; no se revisaron su seguridad, versiones efectivas, cobertura, build objetivo, compatibilidad ni resultados actuales. No se atribuye a ellos una medición nueva.

En `package.json`, la secuencia declarada de `gates:static` es `gates:json`, `gates:hooks`, `gates:sanity`, `gates:locales`, `gates:ledger`, `gates:theme-check`, `gates:syntax` y `gates:package`; `test:visual` declara `playwright test`. El explorador solo leyó las definiciones: no ejecutó las compuertas. El empaquetado puede escribir archivos, por lo que su nombre no demuestra que la secuencia sea de solo lectura.

# Búsqueda acotada de arneses legacy

Según el explorador, `rg --files --hidden --no-ignore` sobre el checkout, con exclusión de `.git`, `node_modules`, archivos sensibles y ZIP, encontró cero nombres exactos `tt02.js`, `g20_g23.js`, `s2`, `p3` o `s8`, y cero nombres con tokens delimitados `s2`, `p3` o `s8`. Una búsqueda de archivos con `rg -l` en `scripts`, `tests`, `agent-comms` y `docs` encontró cero archivos para los nombres exactos `tt02` y `g20`; para `s2` y `s8` encontró uno cada uno, y para `p3` 34. Esos últimos son tokens genéricos y no identifican un arnés. El plan externo no entró en la búsqueda. Estos resultados no acreditan ausencia fuera del checkout ni en rutas excluidas.

# Pendientes y condiciones de uso

0-05 aún debe acreditar, por herramienta y revisor, ruta, versión efectiva, dependencias funcionales, acceso independiente, build objetivo, método, cobertura y límites. También falta identificar el entorno y asegurar que las pruebas elegidas corresponden al candidato real. No se presume una VM, sesión o ruta externa a partir de la evidencia anterior.

Si se desea reutilizar cualquiera de los dos gate5 como evidencia nueva, V4.1:170–171 y 175–177 exige saneamiento y revisión previos: R-D prospectivo y directiva cerrada; Antigravity aporta sin secretos la ficha de origen, preview y rutas del candidato; GPT delega la parametrización técnica a Sol, preservando la asignación prevista; se eliminan fallbacks y se valida configuración para fallar antes de red cuando falten datos obligatorios. Claude revisa independientemente, verifica sintaxis y el fallo previo a red ante variable ausente, y acredita las comprobaciones concretas para las que se use el arnés. No se atribuye Lighthouse a esos scripts por su nombre. Existe la opción de otro arnés identificado y acreditado; 0-05-P3 conserva prioridad P3 y no requiere una nueva activación comercial. Ver también V4.1:446,543.

Esta ficha no acredita prueba en tienda, identidad de despliegue, medición Lighthouse, accesibilidad, cierre de R-0 ni aceptación de Lote 0. El inventario de previews y catálogo se tramita por separado.
