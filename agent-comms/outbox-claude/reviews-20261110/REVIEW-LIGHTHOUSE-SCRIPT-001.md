```text
ID: REVIEW-LIGHTHOUSE-SCRIPT-001
Estado: revisión completa (estática + selftest local sintético + pruebas de señal locales; sin tienda)
Decisión requerida: Gemini/Johandry. Aceptar el veredicto COMMITEAR CON CAMBIOS (C1-C4 abajo).
Resumen en 5 líneas:
  1. La contraseña solo sale del entorno (mjs:142), no va a argv, logs ni JSON, y el POST va solo a `${origin}/password` sin seguir redirecciones (mjs:117-121). npx/lighthouse la recibe vacía (mjs:107).
  2. La allowlist de origen está cerrada (mjs:51 y devuelve u.origin). --theme exige /^\d+$/ (mjs:137) y los handles exigen /^[a-z0-9][a-z0-9_-]*$/ (mjs:22). Probé //host, \, %2f, %2e%2e, .., puerto, userinfo y http: todos se rechazan con exit 2.
  3. FALLO C1: con SIGINT el perfil temporal (con su base de datos Cookies) queda en /tmp: exit 130 y /tmp/lh-mobile-* sigue ahí. Con SIGTERM y con error sí se limpia. No quedan Chromium huérfanos.
  4. Selftest: 12/12 ok, SELFTEST OK, EXIT=0, 1m46s. lighthouse@13.6.0 se descargó por el proxy sin problemas. Al terminar no queda /tmp/lh-*. package.json no cambia.
  5. La cadena de suministro está fijada solo en el paquete de primer nivel: las dependencias transitivas usan rangos ^ y el riesgo no está documentado (C4).
Archivos tocados: solo este informe. No edité código, no hice commit ni push y no hice peticiones a ninguna tienda.
Desviaciones (Nivel 1 o Nivel 2): ninguna.
Hallazgos extra fuera de alcance: ninguno.
Verificación: ver §Evidencia.
```

## Veredicto: COMMITEAR CON CAMBIOS

Lista mínima exacta. Todos los cambios están en `scripts/lighthouse-mobile.mjs` y `scripts/lighthouse-mobile.README.md`.

- **C1 (seguridad): limpiar también con SIGINT.** Playwright tiene `handleSIGINT` activado por defecto: cierra el navegador y sale con 130 sin pasar por el `finally` (mjs:249-252). Lo comprobé: tras SIGINT queda `/tmp/lh-mobile-XXXX/profile/Default/Cookies`. Arreglo: pasar `handleSIGINT:false, handleSIGTERM:false` a `launchPersistentContext` (mjs:152) y registrar `process.once('SIGINT'|'SIGTERM')`, que haga `await context?.close()` y `rmSync(tmp,{recursive:true,force:true})` y luego salga con 130/143. Hay que corregir también README:125 ("tambien si hay error" debe cubrir las interrupciones).
- **C2 (seguridad/UX): rechazar claves de argv desconocidas.** mjs:37-39 acepta cualquier `--clave=valor`. `--password=SECRETO` se guarda en `out.password` sin aviso (lo comprobé: el error sale después por la falta de la variable de entorno). Arreglo: lista cerrada `origin|theme|pages|runs|out` y exit 2 con `(oculto)` para cualquier otra clave.
- **C3 (corrección): exigir el mismo origen.** El preflight (mjs:173-182) solo detecta Location hacia `/password`. Un 301/302 a otro host (por ejemplo, un dominio principal) pasa, y Lighthouse mediría la página de un tercero: mjs:189 solo mira `pathname`. La cookie no se filtra, porque el navegador limita las cookies por host, pero la medición sería falsa. Arreglo: tratar cualquier 3xx del preflight como inválido salvo que su Location sea del mismo origen, y descartar la ejecución si `new URL(lhr.finalDisplayedUrl).origin !== origin`.
- **C4 (documentación): añadir al README una sección de riesgos.** Debe decir lo siguiente.
  - `npx --yes` descarga y ejecuta código. Solo el primer nivel está fijado (13.6.0, publicado el 2026-10-27T21:34Z, integridad `sha512-2/HUPUpQ…qCfLmg==` según `npm view`). Las transitivas (`puppeteer-core ^25.16.0`, `@sentry/node ^11.8.0`, `yargs ^18.2.0`, …) no están fijadas.
  - Ese código se ejecuta con el entorno del padre, menos la contraseña, y tiene acceso por CDP a la cookie.
  - Mientras dura la ejecución, cualquier proceso local puede conectarse al puerto CDP de 127.0.0.1 y leer la cookie. Por eso solo debe usarse en un contenedor de un único usuario.

Mejoras que no bloquean el commit:
- mjs:107: borrar la variable con `delete` en vez de dejarla vacía (`''`).
- mjs:152: Playwright pasa `process.env` a Chromium por defecto, así que Chromium hereda STOREFRONT_PASSWORD. No lo verifiqué en /proc. Se arregla pasando `env` sin esa variable.
- mjs:203-207: comprobar que `numericValue` es finito. Si falta un audit, da TypeError y exit 1; si viene NaN, sale `null` en el JSON.
- Poner un timeout al proceso hijo de Lighthouse.
- mjs:60: `collection:x:../../y` se acepta y descarta el resto en silencio. Es inocuo porque la ruta solo usa `x`, pero conviene rechazarlo.
- mjs:116: hay hasta 4 POST, pero solo ante 429; sin 429 el POST es único. El README podría decirlo.

## Evidencia

| # | Punto | Resultado | Evidencia |
|---|---|---|---|
| 1 | Contraseña | OK | Se lee solo de `process.env` (mjs:142). Solo se usa en el form del POST (mjs:118) y en `scrub` (mjs:144, 193, 247). No se escribe en el JSON (mjs:233-240). El hijo de npx la recibe vacía (mjs:107). Selftest: "los logs no contienen la contrasena ni la cookie ficticias" ok. POST a `${origin}/password` con `maxRedirects:0` (mjs:117-119). Observación C2. |
| 2 | Orígenes y rutas | OK + C3 | mjs:17 y mjs:51 (https, host en lista, sin puerto, ruta, query ni usuario; devuelve `u.origin`). Probé `:8443`, `evil.com@…/x`, `http:`, `….myshopify.com.evil.com`, `user@…`: todos exit 2. `--theme=1e3` da exit 2. `--pages` con `collection://evil.com`, `product:..%2f`, `product:a\b`, `product:..`, `product:%2e%2e` y `home:x` se rechazan. El bypass `--selftest` (mjs:47-48) solo admite http://127.0.0.1. |
| 3 | Perfil, CDP y procesos | C1 | El perfil se crea con `mkdtemp` (mjs:147) y se borra en `finally` (mjs:251). Prueba local: con SIGINT, exit 130 y el directorio se queda; con SIGTERM, exit 1 y se limpia. Durante la ejecución, /proc/net/tcp muestra el CDP en `0100007F:97F1` = 127.0.0.1:38897, un puerto efímero de `freePort` (mjs:69-75). La carrera TOCTOU entre elegir el puerto y usarlo es menor. Después de cada prueba no quedaba ningún proceso chrome-headless-shell ni lighthouse. |
| 4 | npx | C4 | Versión fijada (mjs:16 y mjs:105). Sin lockfile para las transitivas y sin comprobación propia de integridad. Fecha y hash comprobados con `npm view` (registro npm, no la tienda). |
| 5 | Medición | OK | No se pasan flags de preset (mjs:105-106). Si el informe no es `formFactor=mobile` y `throttlingMethod=simulate`, se descarta con exit 4 (mjs:196-197). Se exigen 3 ejecuciones válidas o más (mjs:18, 140, 213). Mediana correcta para n par e impar (mjs:77-81). Promedio de medianas del preset (mjs:232, 239). 429 con Retry-After en segundos o fecha HTTP, máximo 120 s (mjs:84-92, 122, 175-179). Exit codes 0/2/3 comprobados en el selftest; el 4 no se ejercita. El JSON no contiene contraseña, cookie, URLs, `preview_theme_id` ni 127.0.0.1 (aserciones del selftest:72-73). |
| 6 | AGENTS.md y README | OK + C4 | `git diff -- package.json` vacío (md5 `da394d32…` antes y después). No hay dependencias nuevas: `playwright` 1.63.0 ya viene con `@playwright/test`, y `scripts/capture-presets.mjs` y `gate5-empirical.mjs` lo importan igual. Fuentes sin minificar. El README es honesto sobre que la medición es aproximada (README:7) y sobre los umbrales 70/60 (README:52-58). "Tambien si hay error" (README:39) es falso con SIGINT (C1). |
| 7 | Ejecución | OK | `node --check` de los dos .mjs: CHECK_OK. Selftest: 9 aserciones del caso bueno, más exit 3 con contraseña errónea y exit 2 con origen fuera de la lista, termina en "SELFTEST OK", `real 1m45.970s`, EXIT=0. Se ejercitó el 429 (`[collection:x] 429, esperando 1s`). Al terminar `ls -d /tmp/lh-*` no devuelve nada. Mi prueba de SIGINT dejó `/tmp/lh-mobile-fuDnDZ`; lo inspeccioné y lo borré yo mismo. |

## Afirmaciones falsables

1. `node scripts/lighthouse-mobile.selftest.mjs` termina con exit 0 y "SELFTEST OK" en unos 106 s con lighthouse 13.6.0.
2. Enviar SIGINT al proceso del script después de "Autenticacion OK" deja un `/tmp/lh-mobile-*/profile/Default/Cookies`.
3. `--password=X` no produce un error de argumento.
4. Un preflight 302 a otro host no invalida la ejecución, porque mjs:181-182 solo comprueban `/password` y status ≥ 400.
5. `git diff -- package.json` está vacío.
