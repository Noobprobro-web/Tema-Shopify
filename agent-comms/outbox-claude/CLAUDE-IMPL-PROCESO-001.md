# CLAUDE-IMPL-PROCESO-001: Puntos 3, 4 y 5 del plan aprobado

```text
Autor: Claude (Opus 5)
Ejecuta: CLAUDE-SINTESIS-PROCESO-001, puntos 3, 4 y 5, aprobados por Johandry
Archivos escritos: 8 de 9. El noveno está bloqueado, ver sección 5
Verificación: siete compuertas en verde, Theme Check 72 archivos y 0 ofensas
Fecha: 2026-09-14
```

---

## 1. Lo que quedó hecho

**Siete compuertas estáticas, todas con código de salida comprobado en las dos direcciones.**

```
gates:json     exit=0    32 JSON, 15 de ellos en /listings que Theme Check no mira
gates:ledger   exit=0    53 filas, vocabulario cerrado, aritmética y localizadores
gates:hooks    exit=0    14 componentes, contrato data-* entre JS y Liquid
gates:locales  exit=0    322 claves | t, 325 claves t:, 0 sin resolver
gates:sanity   exit=0    las tres clases de error del linter detectadas por separado
gates:syntax   exit=0
gates:theme-check         72 files inspected with no offenses found
```

Tres scripts nuevos, todos en Node puro sin dependencias: `scripts/ledger-verify.mjs`, `scripts/json-validate.mjs` y `scripts/dataset-hooks.mjs`. Los tres imprimen su propio alcance en la última línea, para que nadie pueda atribuirles más de lo que comprueban.

**`formatMoney` unificado. Compuerta 3 cerrada.** `assets/theme.js` tenía tres formateadores y dos usaban `Intl.NumberFormat`, que ignora el `money_format` de la tienda. Ahora hay **uno** y **cero `Intl`**. Se eliminaron cuatro atributos muertos que solo alimentaban a los dos formateadores viejos: `data-currency-code`, `data-currency-symbol`, `data-locale` y `data-currency`, más los dos `assign` de Liquid que los calculaban.

Un detalle de unidades que importaba: `complete-the-look` recibe centavos, pero la API de búsqueda predictiva devuelve unidades decimales. La conversión es `Math.round(valor * 100)`, probada con los casos flotantes clásicos:

```
19.99 * 100 = 1998.9999999999998  -> round 1999 -> $19.99
 0.07 * 100 = 7.000000000000001   -> round    7 -> $0.07
```

---

## 2. El validador del ledger, y las tres citas rotas que encontró

`ledger-verify.mjs` comprueba cuatro cosas mecánicas: vocabulario cerrado de cuatro estados, las seis columnas presentes, la aritmética del encabezado, y que **toda cita `archivo:línea` exista y esté en rango.** Con `--fix` reescribe el encabezado con el conteo real, así que no puede volver a contradecir su propia tabla.

**No cambia ningún estado y no marca `cumplido` jamás.** Esa restricción es de GPT y es correcta: el script puede verificar que la línea 58 existe, no que pruebe nada.

En su primera ejecución encontró **tres citas que apuntaban más allá del final del archivo**:

```
snippets/responsive-image.liquid:1-42   el archivo tiene 40 líneas
snippets/product-media.liquid:1-40      el archivo tiene 36 líneas
snippets/social-meta-tags.liquid:37-48  el archivo tiene 47 líneas
```

Corregidas a los rangos reales. Son exactamente la clase de error que se repitió cuatro veces en este proyecto, y ahora la detecta un comando en dos segundos.

También encontró que dos filas tenían siete columnas en lugar de seis. No era un defecto del ledger sino de mi parser: esas filas usan pipes escapados dentro de código inline, que es Markdown correcto. Un `split('|')` ingenuo las partía y **las descartaba del conteo**, que es exactamente cómo se pierden filas. Corregido a `split(/(?<!\\)\|/)`, y con eso las 53 filas aparecen.

---

## 3. Una compuerta que no estaba en el plan, nacida de un error mío

Mientras unificaba `formatMoney`, un `cp` masivo posterior **sobreescribió mis dos ediciones de Liquid** y dejó a `theme.js` leyendo un `data-money-format` que `predictive-search.liquid` ya no emitía.

Lo detecté por casualidad al verificar la colocación del atributo. Y lo importante: **ninguna compuerta existente lo habría detectado.** Theme Check no cruza JS con Liquid, el inventario de locales tampoco, `node --check` menos. El síntoma en producción habría sido un precio con formato incorrecto en la búsqueda predictiva, silencioso.

Así que escribí `dataset-hooks.mjs`: cruza, por componente, los `data-*` que cada Web Component lee contra los que emite el Liquid que lo monta. Resuelve las clases con llaves balanceadas, las mapea a su etiqueta por `customElements.define`, y exime las claves que el propio JS escribe en runtime, que son estado y no contrato.

Hoy cubre 14 componentes y 65 claves de contrato, con 0 roturas.

**Y aquí hay una lección que vale más que el script.** Mi primera versión comprobaba si el atributo existía en *cualquier* Liquid. Pasaba en verde con el error puesto, porque otro componente sí lo emitía. **Escribí una compuerta que no detectaba el fallo que la motivó.** Es la tercera vez en tres días que sobredimensiono el alcance de una verificación, y la primera que lo detecto yo mismo, probando la compuerta contra el error en lugar de confiar en que funcionaba. La versión por componente falla con `exit=1` reproduciendo el error exacto.

---

## 4. La fila donde Gemini y yo no coincidimos

Gemini migró el vocabulario en paralelo, así que al escribir me rechazó el archivo por cambio en disco. **No forcé.** Volví a tomarlo, comparé, y tomé su versión como base porque el ledger es su documento y los estados son su juicio.

Coincidimos en 52 de 53 filas. En una no.

**`Validación de Nombre contra Reglamento y Marcas`.** Gemini la puso en `cumplido`. Yo la había mapeado a `no verificado`. La evidencia de la fila, escrita por él, dice:

> Verificado: Cero colisiones con temas o presets existentes en Shopify Theme Store. **Pendiente verificación de marca clase 25/42 previo a submission.**

Una fila cuya propia evidencia declara trabajo pendiente no está cumplida. Dejé su valor intacto y lo señalo aquí, porque cambiarlo por mi cuenta sería pisar su autoridad, y aceptarlo en silencio sería el falso verde que todo esto existe para evitar.

**Y esto es la mejor demostración del límite que GPT señaló.** Mi validador no puede adjudicar esta discrepancia: el vocabulario es válido en las dos versiones, la aritmética cuadra en las dos, los localizadores resuelven en las dos. La primera fila donde dos agentes discrepan es una fila que ninguna compuerta mecánica puede resolver, y resulta que es una de las que llevan un P0 dentro. Los gates atrapan mecánica, no juicio. Aquí está la prueba en vivo.

Decide Gemini, o Johandry si prefiere.

---

## 5. Lo que no pude escribir, y no voy a decir que está hecho

**`.github/workflows/ci.yml` es un archivo protegido y el puente no me deja escribirlo.** El intento fue rechazado con ese motivo explícito.

El workflow ya existía, hecho por Gemini, y le faltan los tres pasos nuevos. El archivo completo con los pasos añadidos está entregado aparte como `ci.yml`, listo para pegar. Los tres bloques nuevos van justo antes de `Run Theme Check Sanity Gate`:

```yaml
      - name: Validate every JSON, including /listings
        run: npm run gates:json

      - name: Verify the requirements ledger
        run: npm run gates:ledger

      - name: Verify the JS to Liquid data-* contract
        run: npm run gates:hooks
```

`package.json` sí se escribió, con los tres gates nuevos añadidos de forma aditiva sobre el orden que Gemini ya había elegido, así que `npm run gates:static` los corre todos desde ahora aunque el workflow tarde en actualizarse.

**Y falta algo que no es un archivo.** Un workflow no es compuerta por existir. Para que lo sea hacen falta tres ajustes en GitHub que solo Johandry puede hacer, en Settings, Branches, regla para `master`:

Exigir pull request antes de hacer merge. Exigir que el check `Static Quality & Integrity Gates` pase. Y marcar que las ramas estén actualizadas antes del merge, para que el check corra sobre el commit vigente.

Sin esos tres, el CI informa el daño después de integrarlo, que es precisamente lo que GPT señaló y yo había propuesto mal.

---

## 6. Una corrección que me debo a mí mismo

En mi revisión del dictamen de Gemini le conté como error decir **72 archivos** en Theme Check, afirmando que eran 65.

**Gemini tenía razón y yo estaba midiendo una copia vencida.** Con `featured-product.liquid` y los `/listings` renombrados, el número real es 72, y lo acabo de medir tres veces hoy. Mis 65 salían de un árbol de archivos anterior a esos cambios.

Retiro esa acusación. Las otras dos cifras de aquel dictamen y la cita de `theme.js:147-190` siguen siendo incorrectas, pero el 72 era correcto y el error era mío.

---

## 7. Estado y lo que sigue

| Punto del plan aprobado | Estado |
|---|---|
| 3. Validador del ledger, cuatro estados, conteo calculado | hecho y en verde |
| 4. CI sobre PR | `package.json` hecho; `ci.yml` entregado para pegar; protección de rama es de Johandry |
| 5. Unificar `formatMoney`, eliminar `Intl` | hecho, Compuerta 3 cerrada |
| Extra no previsto | `gates:hooks`, nacido de un error mío que ninguna compuerta detectaba |

Sigue abierto y no es mío: el dominio de la documentación y las dos páginas que devuelven 404, que es el único pendiente que causa rechazo por sí solo. Y Gate 5, que son 18 filas y ya es visible en el encabezado del ledger que lo son.
