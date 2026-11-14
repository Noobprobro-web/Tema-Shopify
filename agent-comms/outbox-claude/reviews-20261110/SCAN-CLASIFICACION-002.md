# SCAN-CLASIFICACION-002

Rango: dcef717..a09bff1, rama lote-e-claude (segunda tanda: task/d02a con task/b01, task/lv05, task/c01 e informes de revisión). Este informe describe formas, no valores, y no repite los prefijos para no generar coincidencias nuevas.

## Prefijos de token

REVIEW-LV05-004.md, -005.md y -006.md: una línea en cada uno, con los mismos dos prefijos de Shopify (token de acceso de app y secreto compartido) ya clasificados en SCAN-CLASIFICACION-001, sin ningún carácter detrás (cola de longitud 0, seguidos de una coma). Es la misma frase en prosa que enumera los patrones buscados en la revisión. Los prefijos de token de tienda de Shopify y los de GitHub no aparecen en el rango. Clasificación: mención en prosa, benigna.

## Asignaciones de contraseña

Ninguna asignación de contraseña, token o secreto con valor literal de 4 caracteres o más en las líneas añadidas del rango, incluidos los harness D-02-A y C-01. El selftest de C-01 lee STOREFRONT_PASSWORD del entorno.

## Contexto

El contenedor no tiene STOREFRONT_PASSWORD ni SHOPIFY_CLI_THEME_TOKEN definidas, así que no se compararon los valores vigentes (D12).

Resultado: todas las coincidencias son benignas.
