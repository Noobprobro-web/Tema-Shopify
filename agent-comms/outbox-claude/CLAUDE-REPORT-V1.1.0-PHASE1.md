# CLAUDE-REPORT-V1.1.0-PHASE1: Fase 1 de la expansión de lujo v1.1.0

```text
ID: CLAUDE-REPORT-V1.1.0-PHASE1
De: Claude (Haiku 5.5, implementador). Sin subagentes. Sin uso de Opus.
Para: Gemini Flash 3.8 High (Arquitecto Consultor). Copia: Johandry.
Fecha: 2026-10-08
Directiva: CLAUDE-TASK-V1.1.0-PHASE1
Estado: FASE 1 IMPLEMENTADA. NO CERTIFICABLE. Compuerta gates:theme-check en 1 ofensa (LiquidComplexity 153 de 120). Gates:static no llega a verde.
Decisión requerida: sí. Un punto (sección 5): cómo liberar 33 puntos de LiquidComplexity en sections/main-product.liquid.
Commit, push y despliegue: ninguno.
```

## 1. Resumen en 5 líneas

Implementé las cinco tareas de código de la Fase 1, sin commit y sin tocar nada fuera de los archivos de alcance salvo la creación de este reporte. Las tareas 1.1 (vista de lista), 1.2 (subtotal y copy fiscal), 1.4 (procedencia Archive) y 1.5 (split_screen) quedan en código completo; la 1.3 (especificaciones Edition) también, pero su bloque suma complejidad Liquid. Las compuertas locales, de JSON, de sintaxis y de ledger pasan. La compuerta de Theme Check no: `main-product.liquid` sube de 120 a 153 de LiquidComplexity, y el sandbox de gates:sanity falla por esa misma razón. No puedo resolverlo dentro de los archivos permitidos sin cambiar código existente, así que la decisión queda contigo (sección 5).

## 2. Estado por tarea

| Tarea | Estado | Nota |
|---|---|---|
| 1.1 Vista de lista PLP | Código completo | Botón, JS y CSS. Sin verificar en navegador. |
| 1.2 Subtotal PDP y copy fiscal | Código completo | Copy fiscal siempre visible (ver sección 4). |
| 1.3 technical_specs (Edition) | Código completo, bloqueado por complejidad | Suma a LiquidComplexity. |
| 1.4 provenance (Archive) | Código completo, bloqueado por complejidad | Suma a LiquidComplexity. |
| 1.5 split_screen (Atelier) | Código completo | Sin cambio de Liquid más allá de una opción de schema. |

## 3. Archivos tocados (líneas de la versión en disco)

Los archivos ya tenían cambios sin commitear de sesiones anteriores, así que los números de `git diff --stat` mezclan trabajo ajeno. Cito solo mis líneas.

- `sections/main-collection.liquid`: botón `data-grid-view="list"` en las líneas 293 a 305, dentro de `.collection-grid-switcher`.
- `assets/theme.js`: `applyStoredGridView` en la línea 3000 (acepta `'list'`), `setGridView` en la línea 3008, y `updateLineTotal` con `minQty` en la línea 915 y `showTotal` en la línea 923.
- `assets/base.css`: vista de lista en las líneas 4725 a 4745 (inicia en 4725, la regla del icono en 4726, la del contenedor en 4731); copy fiscal en 5063 a 5068; bloques `technical_specs` y `provenance` y el split en 9423 a 9484.
- `sections/main-product.liquid`: `data-line-total-template` en la línea 187 (usa `estimated_line_total`); copy fiscal en 462 a 469; `when 'technical_specs'` en 701 a 735; `when 'provenance'` en 736 a 775; opción `split_screen` en la línea 941; definiciones de bloque en el schema en 1172 a 1206.
- `locales/en.default.json`: `estimated_line_total`, copy fiscal y los grupos `technical_specs` y `provenance` en las líneas 406 a 421; `list_view` en la 532. Se quitó `products.product.line_total` (era huérfana).
- `locales/es.json`: mismas claves, con traducción neutra al español, en las líneas 406 a 421 y 532. Se quitó `line_total` (huérfana).
- `locales/en.default.schema.json`: `media_layout.options__4` en la línea 834 y bloques `technical_specs` (960) y `provenance` (984). El archivo usa CRLF y se escribió con CRLF.
- `listings/edition/templates/product.json`: bloque `technical_specs` en las líneas 71 a 79 y en `block_order` en la 93.
- `listings/archive/templates/product.json`: bloque `provenance` en las líneas 71 a 79 y en `block_order` en la 93.
- `listings/sartorial/templates/product.json`: `media_layout` a `split_screen` en la línea 88.

## 4. Desviaciones

Nivel 1, documentadas aquí y reversibles:

- El copy fiscal no está condicionado a la cantidad. Va en su propio párrafo (`product-form__tax-note`) fuera de la región viva, siempre visible. Lo puse así porque el bloque de subtotal se reserva con `visibility: hidden` (LEAD-001), y mostrar el copy solo con cantidad mayor a 1 movería el botón de compra. El aviso de descuentos va en el mismo párrafo y también es permanente.
- El texto del subtotal es `Estimated item subtotal for [quantity] units:`. El importe va en su propio `span`, no dentro del texto, para que el controlador no tenga que recomponerlo.
- `products.product.line_total` se eliminó de ambos locales porque quedó huérfana. Es la única clave que retiré.
- Añadí las mismas claves a `es.json` para mantener paridad. La directiva solo citaba `en.default.json`.
- Se mantiene el evento `theme:variant-change` (Decisión 1). No se usa `variant:change`.
- El subtotal usa `minQty` (`quantity_min` de la variante) para mostrarse desde el primer render cuando el mínimo es mayor a 1.

Nivel 2, no ejecutado y necesario para cerrar la fase: ver sección 5.

## 5. Decisión requerida

LiquidComplexity: `sections/main-product.liquid` pasa de 120 (base medida) a 153 con mis tres adiciones (copy fiscal, `technical_specs` y `provenance`). No separé cuánto aporta cada una. Eliminar la complejidad con lógica dentro del mismo archivo no cabe en el margen, porque la base ya estaba en el límite exacto.

Opciones:

A. Autorizar dos snippets nuevos, `snippets/product-technical-specs.liquid` y `snippets/product-provenance.liquid`, llamados con `{% render %}` desde un solo `when` combinado. Esto es una estimación no medida: quedaría cerca de 124, todavía por encima del límite, así que haría falta además un ahorro de unos 4 puntos en código existente o en el copy fiscal. Hay que medirlo antes de implementar. Recomiendo esta opción junto con la siguiente.

B. Autorizar un ahorro de complejidad en código existente de `main-product.liquid`, sin cambio de comportamiento, para liberar al menos 33 puntos. Es más invasivo y toca filas que la directiva marca como verdes.

C. Subir el umbral de LiquidComplexity en `.theme-check.yml`. No lo recomiendo: oculta el problema en lugar de resolverlo, y el revisor de la Theme Store usa su propio conjunto de checks.

Mi recomendación es A con el ajuste de 4 puntos, porque mantiene el comportamiento y separa la lógica nueva del archivo principal. Necesito tu autorización explícita por ser Nivel 2 (archivos nuevos y cambio en código existente).

## 6. Hallazgos extra fuera de alcance

- Revisé las etiquetas de la rejilla (`collections.grid.*`): los textos de 2 y 4 columnas coinciden con el comportamiento móvil. No encontré errores ahí.
- Los dos bloques nuevos usan `<h3>` sin un `<h2>` previo en la PDP. Conviene revisar el orden de encabezados con axe.
- `listings/archive` usa `show_unique_piece: true` con `condition_grade: grade_2`. La guarda de unicidad oculta el badge si el producto tiene más de una variante, así que hay que confirmar en la tienda demo que el badge no aparece en un producto con variantes.

## 7. Verificación (comandos y salida literal)

Copia del árbol con `mkcopy.sh`. Gates corridos sobre la copia, no sobre la carpeta de trabajo.

```text
$ npm run gates:json
Archivos .json comprobados: 534
Fallos de parseo:           0

$ npm run gates:hooks
Contratos rotos: 0

$ node scripts/theme-check-sanity.mjs            (EXIT 1)
[theme-check-sanity] FALLO: el sandbox restaurado no quedo limpio, asi que las mutaciones no se revirtieron bien

$ npm run gates:locales                          (EXIT 0)
Sin resolver en storefront:     0
Sin resolver en schema:         0
Huerfanas en storefront:        0
Huerfanas en schema:            0

$ npm run gates:ledger                           (EXIT 0)

$ npm run gates:theme-check                      (EXIT 0 del CLI, pero con 1 ofensa)
Liquid complexity is 153, which exceeds the maximum of 120. The decision at line 762 pushed it over the limit.
88 files inspected with 1 total offenses found across 1 files.

$ npm run gates:syntax                           (EXIT 0)

$ npm run gates:package                          (no ejecutado: la cadena se detiene antes)
```

Base medida con el `main-product.liquid` original (copia separada, umbral `max_complexity: 1`): complejidad máxima 120, 88 archivos sin ofensas. Con el archivo actual: 153.

Lo que no demostré: no probé en navegador la vista de lista a 320 y 375 px ni la ausencia de desbordamiento horizontal. No probé el subtotal ni el split_screen en la tienda. Esa verificación exige desplegar a una tienda o levantar una vista previa, y la directiva prohíbe el despliegue. Queda pendiente para la compuerta 5 con la tienda de desarrollo.

## 8. Afirmaciones falsables

1. El `main-product.liquid` original tiene LiquidComplexity máxima de 120 (medido en la copia con el archivo de respaldo).
2. El `main-product.liquid` actual tiene LiquidComplexity de 153 (salida de `npm run gates:theme-check`).
3. El tema original pasa Theme Check con 88 archivos y 0 ofensas.
4. Las claves `products.product.line_total` no quedan referenciadas tras el cambio, y se eliminaron de `en.default.json` y `es.json`.
5. `gates:locales` pasa con 0 huérfanas y 0 sin resolver.
6. Los archivos que toqué no contienen `Intl.` ni `variant:change`; el evento de variante sigue siendo `theme:variant-change`.
7. El copy fiscal siempre está en el DOM, y no depende de la cantidad.
8. No hay commit ni push. La carpeta de trabajo conserva sus cambios previos sin commitear.
9. La vista de lista, el subtotal y split_screen no están verificados en navegador ni en la tienda.
