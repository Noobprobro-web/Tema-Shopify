# SCAN-CLASIFICACION-001

Rango: e8f17e5..e572cb4, rama lote-e-claude. Este informe describe formas, no valores.

## Prefijos de token

REVIEW-LV05-001.md, -002.md y -003.md: una línea en cada uno. Solo aparecen los prefijos shpat_ y shpss_, sin ningún carácter detrás (cola de longitud 0, seguidos de una coma). Están dentro de una frase en prosa que enumera los patrones buscados en la revisión. shptka_, ghp_ y github_pat_ no aparecen en el rango. Clasificación: mención en prosa, benigna.

## Asignaciones de contraseña

conditions-test.mjs:

- Línea 215 y 217: valores de un solo carácter en minúscula (entropía 0) y una cadena vacía, usados como entradas para probar el lector de credenciales. Benignos.
- Línea 263: cadena sintética de 12 caracteres en tres segmentos separados por guiones (2, 5 y 3 caracteres), minúsculas y dígitos, entropía aproximada de 3,25 bits por carácter. Se pasa en un objeto env de prueba al guardián de secretos y se usa como canario para comprobar que no se filtra al informe redactado del harness, que corre contra un servidor HTTP local. Solo aparece en este archivo (2 apariciones), no se usa en ninguna otra parte del repositorio. Benigna.

## Contexto

El contenedor no tiene STOREFRONT_PASSWORD ni SHOPIFY_CLI_THEME_TOKEN definidas, y los archivos se generaron aquí.

Resultado: todas las coincidencias son benignas.
