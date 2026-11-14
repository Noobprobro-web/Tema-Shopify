# Medicion Lighthouse movil (`scripts/lighthouse-mobile.mjs`)

Mide el rendimiento movil de Home, una coleccion y un producto de una tienda de desarrollo protegida por contrasena, desde el contenedor. El Theme Store exige una media de rendimiento movil >= 60 en esas tres paginas.

## Aviso importante

Es una **medicion aproximada**. La CPU y la red del contenedor no son las de Shopify ni las del laboratorio de Lighthouse de Google (PageSpeed). Lighthouse usa throttling *simulado*, que normaliza parte de la diferencia, pero los valores pueden variar varios puntos. No es una certificacion; sirve para detectar riesgo y comparar antes/despues.

## Requisitos

- Node 22, Playwright 1.63.0 instalado (`node_modules`) y Chromium en `/opt/pw-browsers` (se usa por defecto si `PLAYWRIGHT_BROWSERS_PATH` no esta definida).
- Lighthouse se invoca con `npx --yes lighthouse@13.6.0` (fijado; no se anade a `package.json`). Necesita salida a npm la primera vez.
- Variable de entorno `STOREFRONT_PASSWORD` (solo entorno; el script no la acepta por argumentos y no la imprime).

## Uso

```bash
STOREFRONT_PASSWORD=... node scripts/lighthouse-mobile.mjs \
  --origin=https://tema-qkqpke0j.myshopify.com \
  --theme=123456789012 \
  --pages=home,collection:<handle>,product:<handle> \
  --runs=3 \
  --out=/tmp/lh-mobile-summary.json
```

| Argumento | Descripcion |
|---|---|
| `--origin` | `https://<dominio>`; solo `tema-qkqpke0j.myshopify.com` o `sartorial-theme-kvkzl39t.myshopify.com`. |
| `--theme` | ID numerico del tema; se mide `?preview_theme_id=<id>`. |
| `--pages` | `home`, `collection:<handle>`, `product:<handle>` separados por coma. |
| `--runs` | Ejecuciones por pagina (3 a 10, por defecto 3). |
| `--out` | Ruta del JSON resumido. |
| `--selftest` | Solo para `lighthouse-mobile.selftest.mjs`: sustituye la allowlist por `http://127.0.0.1:<puerto>`. |

Solo se aceptan esas claves (y `--selftest`); cualquier otra, por ejemplo `--password=...`, termina con codigo 2 sin repetir su valor. `--pages` rechaza entradas con mas de un `:` (p. ej. `collection:x:resto`).

Codigos de salida: `0` OK; `2` argumentos o entorno invalidos; `3` fallo de autenticacion o sesion no valida; `4` medicion invalida (menos de 3 ejecuciones validas por pagina, perfil no movil, o redireccion a otro origen); `1` otro error; `130`/`143` interrumpido con SIGINT/SIGTERM (tras limpiar).

## Como funciona y por que

1. Crea un directorio temporal (`mkdtemp`) con un perfil de Chromium y lo borra al terminar, tambien si hay un error o si se interrumpe con SIGINT (Ctrl+C) o SIGTERM: el script instala sus propios handlers de esas senales (Playwright se lanza con `handleSIGINT/handleSIGTERM` desactivados), cierra el navegador, mata el subproceso de Lighthouse y borra el directorio. No cubre `SIGKILL` ni un corte del contenedor; en ese caso puede quedar un `/tmp/lh-mobile-*` con la cookie de sesion que hay que borrar a mano. Limite conocido: durante la ventana (< 1 s) de `launchPersistentContext` aun no hay contexto que cerrar, asi que una senal en ese instante deja a Chromium en manos del handler de salida de Playwright y el borrado del directorio podria adelantarse a su cierre.
2. Playwright lanza Chromium headless (`--no-sandbox`) con puerto de depuracion remota en `127.0.0.1` y hace **un** `POST /password`; la cookie de sesion queda solo en ese perfil.
3. Lighthouse se conecta con `--port` a **ese mismo Chromium**. Se eligio esto en lugar de `--extra-headers` porque: (a) la cookie nunca viaja en argv (visible en `ps`) ni se escribe en disco fuera del perfil temporal; (b) el navegador solo envia la cookie al dominio que la emitio, mientras que `--extra-headers` la enviaria tambien a CDNs y terceros; (c) conserva el comportamiento normal de cookies y redirecciones.
4. Perfil por defecto de Lighthouse: movil (emulacion de telefono, throttling simulado). El script descarta la medicion si el informe no declara `formFactor=mobile` y `throttlingMethod=simulate`.
5. Ejecuciones en serie, minimo 1 s entre ellas. Un preflight por intento respeta `429` (usa `Retry-After`, si no, backoff exponencial hasta 120 s); hasta 3 intentos por ejecucion. Una redireccion a `/password` aborta con codigo 3; cualquier 3xx del preflight hacia otro origen, o un informe cuyo `finalDisplayedUrl` no tenga el origen solicitado, aborta con codigo 4 (la medicion seria de otra pagina). Cada ejecucion de Lighthouse tiene un timeout de 180 s, y se descarta la ejecucion si alguna metrica no es un numero finito.
6. Por pagina calcula la **mediana** de Performance, LCP, CLS, TBT, FCP y Speed Index, y el **promedio de las medianas** del preset movil.

## Riesgos

- **Codigo descargado y ejecutado.** `npx --yes lighthouse@13.6.0` descarga y ejecuta codigo del registro npm. Solo el paquete de primer nivel esta fijado: version 13.6.0, publicada el 2026-10-27; compruebe su integridad con `npm view lighthouse@13.6.0 dist.integrity`; el valor esperado es `sha512-2/HUPUpQyGm01VEgYCUjSlNZY7Zkhk1v3QI4c7UTbnaoRB7HF0qYMPzzaiidNf5iqw5wnmtm9LpGawKKqCfLmg==` y debe comprobarse contra este valor (no basta con que el comando devuelva algo, porque compararia el registro consigo mismo). Las dependencias transitivas usan rangos `^` y no estan fijadas, y no hay lockfile.
- **Entorno y cookie.** Ese codigo corre con el entorno del proceso padre (sin `STOREFRONT_PASSWORD` ni `SHOPIFY_CLI_THEME_TOKEN`, que se eliminan) y tiene acceso a la cookie de sesion a traves del depurador remoto de Chromium. Chromium tambien se lanza sin esas dos variables.
- **Puerto de depuracion.** Mientras la medicion corre, cualquier proceso local puede conectarse al puerto del depurador en `127.0.0.1` y leer la cookie. Usese solo en un contenedor de un solo usuario, nunca en una maquina compartida.

## Salida

El JSON contiene solo: fecha, version de Lighthouse, para cada pagina `kind`, `handle`, `preset`, lista de las puntuaciones y medianas, y el promedio del preset. No incluye cookies, contrasena, origen, ID de tema ni URLs con query. Los logs reemplazan URLs y la query de preview.

## Como interpretar

| Rendimiento movil (mediana / promedio) | Lectura |
|---|---|
| >= 70 | Verde |
| 60 a < 70 | Riesgo: informar y proponer mejoras |
| < 60 | Bloqueante para Theme Store |

El requisito es sobre la media de las tres paginas, pero conviene vigilar tambien cada pagina por separado (una pagina < 60 arrastra el promedio). Repetir la medicion si las 3 puntuaciones difieren mas de ~5 puntos.

## DP-005 (`docs/decisions-pending.md`, `docs/decisions.md`)

- DP-005 sigue pendiente de confirmacion por Johandry: repeticiones, viewports y metodo de aceptacion para Home, coleccion y producto en escritorio y movil. Este script cubre solo **movil** con 3 repeticiones y mediana; escritorio no esta incluido.
- Acordado: un rendimiento movil < 70 es un riesgo que debe informarse y motivar una propuesta de mejoras dentro del plan.
- Linea base G2 aprobada (movil home / coleccion / producto): Sartorial 88 / 83 / 82, Imprint 88 / 79 / 82, Archive 91 / 80 / 85. Medida con otro metodo; no comparar directamente sin tener en cuenta la diferencia de entorno.
- Un score aislado no es certificacion; reportar medianas y las tres puntuaciones.
- Esta medicion no sustituye la compuerta 5 (verificacion en tienda real y en movil simulado).

## Verificacion sin tienda

```bash
node scripts/lighthouse-mobile.selftest.mjs
```

Levanta un servidor local sintetico (`/password` con 302 + cookie, `/`, `/collections/x`, `/products/y`, un 429 unico), usa una contrasena ficticia, y comprueba: JSON con 3 puntuaciones y medianas por pagina, ausencia de contrasena/cookie/URLs en JSON y logs, backoff ante 429, salida 3 con contrasena erronea, rechazo de origenes fuera de la allowlist, rechazo de claves desconocidas (`--password=SECRETO` sale con 2 sin repetir el valor) y de `--pages` con mas de un `:`, salida 4 ante redirecciones a otro origen (302 en el preflight y redireccion JS), y que SIGINT/SIGTERM con una ejecucion en curso salen con 130/143 sin dejar `/tmp/lh-mobile-*` ni procesos. Tarda unos 2 minutos.
