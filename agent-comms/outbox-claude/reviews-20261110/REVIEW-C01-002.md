# REVIEW-C01-002 · Re-revisión del harness C-01 (commit 0256270, rama task/c01)

Revisor: Claude (subagente, solo lectura). Fecha: 2026-11-10. Worktree `wt-c01`, HEAD `0256270` sobre `dabd19f`, árbol limpio antes y después. No se ejecutó nada contra Shopify. Rutas relativas a `agent-comms/outbox-claude/harness-C-01-ID-001/`. Condiciones de referencia: REVIEW-C01-001.md.

## Veredicto

**ACEPTADO CON CONDICIONES.** C1, C2, C3 y C5 quedan cerradas en código y con pruebas. C4 queda cerrada salvo la limpieza: es un procedimiento manual que protege bien en la práctica, pero no nombra las tres previews existentes ni vuelve a comprobar al borrar que el ID no existía antes. Son dos cambios de texto en el README (D1, D2), no bloquean la medición pero sí la limpieza.

## Ejecuciones

`node --check` en los 7 `.mjs`: sin errores. `node synthetic.mjs`: exit 0 (librería). `node selftest.mjs` sin variables de Shopify ni `STOREFRONT_PASSWORD`: 46/46, exit 0, mismos deltas (-71,55 / -8 / -71,55 px a 390, sin cambios a 1280). `git status` vacío tras las ejecuciones.

## C1 · compareBytes

Cerrada. Compara buffers con `equals` (lib.mjs:124-126). Lo que no esté en `TEXT_EXTENSIONS` solo admite `exact` (lib.mjs:106-107, 127). CRLF a LF se hace sobre bytes, sin decodificar (lib.mjs:110-119, 128). El JSON canónico solo se aplica a `.json` (lib.mjs:129-134). Pruebas propias: png con 0x80 frente a 0xff da `mismatch`; png con CRLF frente a LF da `mismatch`; css con bytes no UTF-8 distintos da `mismatch`; `.liquid` con JSON reformateado da `mismatch`; `.json` con comentario de cabecera y otro formato da `normalized`. Selftest añade siete casos C1.

## C2 · identidad --full obligatoria

Cerrada. measure.mjs:145 rechaza informes con `scope` distinto de `full`. El target tiene que coincidir en tema, preset y commit (measure.mjs:147-148). En serie, el informe del después tiene que ser posterior al fin de la medición del antes (measure.mjs:150-154). Tiene pruebas para el informe sin `--full` y para el informe anterior al antes.

## C3 · tema servido y barra

Cerrada. Cada fila lee `window.Shopify.theme.id`; en tienda, si falta o no coincide con `themeId`, la fila es inválida (measure.mjs:232-238, 254). La URL fija `preview_theme_id` desde `themeId` y rechaza una URL con otro valor (measure.mjs:108-112). Los selectores de la barra son ahora los de capture.mjs (measure.mjs:50 frente a capture.mjs:33). La altura sale solo de capture (measure.mjs:268), y en modo `measure` espera a la barra con un tiempo máximo (measure.mjs:257-263). Queda un riesgo residual, que el README reconoce (README.md:32 y paso 6): los selectores no se han validado contra una preview real. Si la barra real usa otro id, `hide` no la ocultaría y capture pasaría con altura 0. No afecta a `firstCardTop`, porque la barra es un overlay fijo, pero sí al viewport útil. La captura de control del paso 6 es la salvaguarda correcta.

## C4 · README, contraseña y 429

Cerrada salvo la limpieza. URL de preview documentada (README.md:52) y construida desde el entorno (measure.mjs:99-114). La contraseña solo viene de `STOREFRONT_PASSWORD`: el plan con claves `password` o `token` se rechaza (measure.mjs:83-84) y el valor se tacha en los errores (measure.mjs:276). Los 429 respetan `Retry-After` con un tope de 120 s y tres reintentos (measure.mjs:208-218). Hay preflight de rol y nombre antes de cada push (README.md:62, 65, 72). El push del después va al mismo ID, sin `--only` ni `--nodelete` y sin `--allow-live` (README.md:73-74). Los comandos van en serie y escriben fuera del repo (README.md:47).

Limpieza (README.md:94-102). Ningún script borra: grep de `delete` en los `.mjs` solo da `delete` de variables de entorno en selftest.mjs:24-26. El borrado es manual y exige a la vez: ID en el ledger, ID presente en la lista final, nombre exacto `C01 serial <Preset>` y rol `unpublished` (README.md:98). Borra por ID, de uno en uno (README.md:99). Un tema publicado no pasa por el rol `unpublished`. Una de las tres previews existentes no pasa salvo que alguien la apunte por error en el ledger y además se llame `C01 serial …`. Al crear el tema, el ledger solo admite un ID que no estuviera en `list-0.json` (README.md:65). Puntos débiles:

D1. El README no da los IDs 190232297715, 190232330483 y 190232363251 ni pide excluirlos explícitamente; solo dice "las tres previews existentes" (README.md:100, 102). Debe añadirse una lista de exclusión con esos tres IDs y el live, que se compruebe antes de cada `theme delete`.

D2. La condición "ID que no estaba en la lista inicial" solo se comprueba al crear, no al borrar (README.md:98). Además, `list-0.json` se sobrescribe en el paso 2 de cada preset (README.md:62), de modo que la comprobación final del paso 4 de limpieza (README.md:100) se hace contra la lista del último preset, que ya incluye los temporales anteriores. Hay que guardar una lista inicial única (`list-initial.json`) antes del primer preset y exigir al borrar que el ID no figure en ella.

Ninguno de los dos permite un borrado accidental si se siguen los demás controles, pero el requisito era que la limpieza no pudiera tocar esos temas, y hoy eso depende de un ledger escrito a mano.

## C5 · mismo tema, en serie

Cerrada. El procedimiento recomendado es una preview por preset, en serie (README.md:56-80). measure.mjs exige la serie cuando antes y después comparten tema (measure.mjs:118-122). Las filas del antes tienen que venir del mismo plan y de la misma versión del script (measure.mjs:126-131). El par queda inválido si los temas difieren sin `allowDistinctThemes` (measure.mjs:300). La alternativa con dos temas queda documentada y sujeta a la aceptación de la R-D (README.md:104-106). Selftest cubre serie, exigencia de serie y temas distintos.

## Observaciones menores, sin condición

El archivo `--before` no está firmado: se valida por hash del plan y del script, pero se podría editar a mano. Es aceptable para un arnés interno. En la alternativa con dos temas, el README no repite que cada ID nuevo debe faltar en la lista inicial (README.md:106); con D2 queda cubierto. La limpieza temporal de identity.mjs en la ruta de error está corregida (identity.mjs:193-200).

## Condiciones

D1. README.md:94-102: lista de exclusión explícita con el live y 190232297715, 190232330483 y 190232363251, comprobada antes de cada `theme delete`.
D2. README.md:62 y 98-100: una sola lista inicial antes del primer preset; al borrar, exigir que el ID no figure en ella; la comprobación final debe hacerse contra esa lista.
