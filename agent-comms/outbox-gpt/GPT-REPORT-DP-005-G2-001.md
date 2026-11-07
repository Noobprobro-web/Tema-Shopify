# GPT-REPORT-DP-005-G2-001

**ID:** GPT-REPORT-DP-005-G2-001

**Estado:** puntuaciones históricas aprobadas como línea base. Clasificación CDN según la aclaración expresa de Johandry, verificada offline. G2 no se volvió a ejecutar.

**Validación pendiente:** repetir G2 solo cuando se autorice. La clasificación nueva no modifica los resultados históricos ni acredita una ejecución posterior.

**Worktree:** `C:\Users\Johan\.codex\worktrees\lote-c-impl\Tema Shopify`

**Rama:** `lote-c-impl`

**Base de la rama reconstruida:** `origin/lote-c-impl` en `a0f8b3f3f3b7dd56167078f6bad3edb1c3f59783`, verificada con fetch. Conserva el commit de correcciones `f8574eafeda6827d4907b4399cc961837c035635` y el diff final DP-005 sin importar la historia intermedia local.

**Dictamen local:** por decisión de Johandry, `CLAUDE-REVIEW-LOTE-C-IMPL-001.md` se preserva sin seguimiento en el worktree y en el ref local `codex/claude-review-copy` (commit `49c76e2866c53695a8c0a099dc889125457e1c7c`). El SHA-256 sigue siendo `4904ce8116584d846c829280b529d26383ec7bac44fd570a5d6da5a275bd773e`. Se excluye de la rama publicable por D12. La historia previa se conserva localmente en `codex/lote-c-impl-with-review-local`.

## Resumen

1. Las 18 celdas medidas se registran como línea base según la decisión de Johandry del 2026-11-07. Sus tres JSON siguen con `executionResult=failed`.
2. Solo HTTP 404 de `/favicon.ico` y el aborto Chromium de `/services/login_with_shop/authorize` en el host HTTPS exacto de tienda pasan a aviso.
3. CDP, requestfailed y HTTP comparten el clasificador. Los CDN conocidos pasan a aviso y los assets reales del tema conservan fallo. Los hosts ajenos no heredan la regla.
4. Los eventos de red retienen host y pathname con códigos seguros. No incluyen query, fragmento, credenciales ni errores crudos.
5. Nueve pruebas sintéticas pasaron. Los ocho blobs Git de los JSON históricos son idénticos entre `258ca4f` y `HEAD`. Las cinco entradas de bloqueo históricas se conservan como estaban y la clasificación nueva se aplica solo a corridas futuras.

## Archivos y alcance

- Runner y fixture: `harness-GPT-RD-001/run.mjs`, `harness-GPT-RD-001/network-policy.test.mjs`.
- Documentación: README del arnés, `docs/decisions.md`, informe 016 y este informe.
- La severidad de eventos CDN cambia por decisión de Johandry. Se mantienen allowlist, autenticación, límite 429, cierre, limpieza y acceso de tienda. Las ocho fuentes JSON históricas se conservan.
- No se cierran filas del ledger por esta lectura. Las filas de rendimiento y accesibilidad conservan su estado previo.

## Línea base medida

| Preset | Performance móvil H/C/P | Performance escritorio H/C/P | Accesibilidad | Best Practices | SEO H/C/P |
|---|---|---|---|---|---|
| Sartorial | 88 / 83 / 82 | 100 / 100 / 100 | 97 en seis | 96 en seis | 92 / 100 / 100 |
| Imprint | 88 / 79 / 82 | 100 / 100 / 100 | 97 en seis | 96 en seis | 92 / 100 / 100 |
| Archive | 91 / 80 / 85 | 100 / 100 / 100 | 97 en seis | 96 en seis | 92 / 100 / 100 |

H/C/P significa home, colección y producto. SEO es igual en móvil y escritorio. Lighthouse 13.4.1, una muestra por celda. El umbral móvil <70 no se activó.

| Fuente en `harness-GPT-RD-001/results/` | SHA-256 del blob Git |
|---|---|
| `lighthouse-20261107T013234.775Z-9a9d2760-fbeb-491f-9ddb-2281abdf3312.json` | `1914293182bd4a72880d641c8c60307b566d96d630525eb261d3091b7b1dcc4f` |
| `lighthouse-20261107T013738.441Z-01f87a97-a048-4fbb-a9b5-22dfe513fb0e.json` | `446dc2ed0af1dc40831a83de24b25d4ee1cbf038043e16bb6db7b71109e2e7b8` |
| `lighthouse-20261107T014011.347Z-aa3310c1-4b23-4e91-9f49-989e478743c5.json` | `7a65d8165954acf9b3548c4b9ff327fe93e3c239423a20ad6ee91b0bb60d889a` |

El informe 016 registra `ca483d17166bd02ff05b7fc88ba35624cb5ffa161b98851bfdeb882e669dbcbf` como SHA del runner usado en las mediciones. El blob de `run.mjs` inmediatamente anterior a esta corrección tiene SHA-256 `62191316247eaf31bd7004b7dac3d8f449bbc29c56717e36ea95a3774621668c`.

La aceptación corresponde a las puntuaciones. No cambia `executionResult=failed`, `blockedHostAttention=true`, la contradicción histórica de los campos de autenticación ni los avisos de trace processor documentados en 016. Las cinco entradas de bloqueo sin clasificar de cada corrida final apuntan a `shopify-assets.shopifycdn.com`. Se desconoce su necesidad. Se observaron 18 / 18 / 17 eventos de fuentes de plataforma en CDN para Sartorial / Imprint / Archive. El criterio previo se limitaba a cuatro rutas de fuentes. Johandry lo sustituyó por avisos para `cdn.shopify.com`, subdominios `*.shopifycdn.com` y las rutas de tienda `/cdn/fonts/` y `/cdn/shop/files/`, manteniendo fatales los assets reales del tema. Así, las cinco entradas ordinarias de ese CDN se registrarían como avisos si vuelven a aparecer en HTTPS con puerto estándar, sin dar acceso al host. Un bloqueo en `/password` o `/services/login_with_shop/authorize`, o por puerto/protocolo no permitido, conserva el resultado incompleto. La excepción de Shop Login se limita al aborto exacto del host de tienda y no aplica a bloqueos. Se desconoce la causa de los fallos históricos.

## Verificación

- `node --test agent-comms/outbox-gpt/harness-GPT-RD-001/network-policy.test.mjs` → `tests 9`, `pass 9`, `fail 0`. Importa el runner sin iniciar `main()`, sin navegador, red ni escritura de resultados.
- `node --check` de runner y fixture y `git diff --check` → salida 0. Shopify CLI local `4.8.0`, `theme check --path . --output json` → exit 0 y literal `[]`.
- Verificación de los ocho JSON del directorio `results/`: blobs Git idénticos entre `258ca4f` y `HEAD`. El checkout usa CRLF y los blobs LF. El contenido del checkout coincide al normalizar CRLF a LF. `git diff --exit-code 258ca4f HEAD -- agent-comms/outbox-gpt/harness-GPT-RD-001/results` → 0.
- SHA-256 del runner corregido: `1aaab33bf3830b8f4e82228199ebf46deb2a6f663b468553c65f0bc51554e34c`. SHA-256 del fixture sintético: `736ff933a9e9fe7050429c30a85efadaec023af23588528344433d875359e84b`. Archivos LF, verificados contra los blobs de Git al preparar el commit. El fixture marcado por D12 se reemplazó por datos sintéticos distintos. El escaneo local de esa ruta devolvió 0 coincidencias con los candidatos locales. La comprobación independiente del diff completo sigue separada. El dictamen copiado se preserva byte por byte.

## Afirmaciones falsables

1. `run.mjs:644`, `:726` y `:740` llaman al mismo `recordNetworkEvent`. Los casos casi iguales siguen siendo fallos. Los avisos de red por sí solos no cambian una ejecución medida a fallo.
2. `run.mjs:75` reduce la URL a host y pathname. `:116` reconoce las familias CDN y `:134` conserva los fallos de activos del tema y hosts ajenos. La allowlist de solicitudes no se amplía. [CDN de Shopify](https://shopify.dev/docs/storefronts/themes/best-practices/performance/platform)
3. `run.mjs:170` obtiene el motivo de bloqueo de la URL analizada antes de perder el puerto en la forma de log. Conserva `PORT_BLOCKED_BY_POLICY` o `HTTPS_REQUIRED_BY_POLICY`, sin guardar la URL. `:179` evita el aviso para esos bloqueos y rutas de autenticación. El CDN ordinario bloqueado en 443 sigue como aviso y un asset del tema bloqueado permanece fatal. `:193` deja incompleto para bloqueos no clasificados y mantiene fallo para navegador, contexto o limpieza. Las pruebas cubren autenticación fallida y 429 agotado como estados de entrada. No sustituyen una ejecución real del flujo.

No se repitió Lighthouse ni se realizaron escrituras en Shopify.
