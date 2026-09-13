# CLAUDE-IMPL-4B-002: Implementación de conversión, controles muertos y cierre de código del ledger

```text
ID: CLAUDE-IMPL-4B-002
Autor: Claude (Opus 5), en rol de Implementador Principal de Código
Responde a: agent-comms/inbox-claude/CLAUDE-TASK-4B-002-ledger-and-ux.md
Autoridad: Johandry / Ruiz Digital
Alcance ejecutado: Bloque A + Bloque B + Bloque C, más 5 archivos de /listings no previstos
Archivos modificados: 17
Validación: Theme Check 65 archivos / 0 ofensas · node --check OK · 17 JSON válidos
Fecha: 2026-09-13
```

---

## 1. Estado de entrega

Los cuatro bloques quedaron implementados y escritos en el repositorio. La tabla es el resumen; cada punto se detalla abajo con su evidencia.

| Bloque | Encargo | Estado |
|---|---|---|
| A1 | Total de línea en PDP | implementado y probado con 12 casos |
| A2 | Densidad de grilla móvil y tablet | implementado |
| B1 | `hero-editorial` valida etiqueta Y destino | implementado |
| B2 | `brand-manifesto` valida etiqueta Y destino | implementado |
| B3 | `templates/index.json` sin URLs fantasma | implementado |
| B4 | `js-only` en el conmutador de grilla | implementado |
| B5 | Región viva persistente para el conteo | implementado en `main-collection` **y** en `main-search` |
| C / Row 35 | Punto focal nativo | código completo |
| C / Row 37 | Dimensiones explícitas para CLS | código completo |
| C / Row 48 | Indicador de foco por teclado | código completo |
| C / Row 50 | Áreas táctiles de los dos objetivos citados | código completo |
| C / Row 51 | Jerarquía estricta de encabezados | código completo |
| C / Row 67 | Comparativos y badge con `price_varies` | código completo |
| C / Row 76 | Ordenamiento sin facetas activas | código completo |
| Extra | 14 enlaces fantasma en `/listings` | corregido, con checklist de restitución |

**Distingo "implementado" de "cumplido" a propósito.** Escribí el código de las siete filas. Ninguna de las siete se cierra con eso. Row 37 se cierra midiendo CLS en una tienda real, no comprobando que el atributo existe; Row 48, 50 y 51 se cierran con una pasada de teclado y un informe de axe; Row 67 y 76 se cierran viendo el caso en pantalla. Es la misma regla que apliqué al ledger de Gemini en `CLAUDE-review-GEMINI-4B-002`, y sería incoherente relajarla cuando el código es mío. La columna de arriba dice "código completo" porque es exactamente lo que puedo afirmar.

---

## 2. Bloque A1: total de línea en PDP

**El principio que gobierna el cambio: el precio unitario no se toca nunca.** `updateLineTotal()` solo escribe dentro de los nodos `[data-line-total-*]`. `updatePrice()` sigue siendo el único que escribe en `[data-current-price]`.

Se agregó `formatMoney(cents, format)` a nivel de módulo en `assets/theme.js`, con los siete tokens que Shopify admite en `money_format`. Probé los siete:

| Formato | 123456 centavos |
|---|---|
| `${{amount}}` | `$1,234.56` |
| `${{amount_no_decimals}}` | `$1,235` |
| `{{amount_with_comma_separator}}€` | `1.234,56€` |
| `{{amount_no_decimals_with_comma_separator}} kr` | `1.235 kr` |
| `CHF {{amount_with_apostrophe_separator}}` | `CHF 1'234.56` |
| `{{amount_no_decimals_with_space_separator}} ¥` | `1 235 ¥` |
| `{{amount_with_space_separator}} €` | `1 234,56 €` |

El `<script data-variant-json>` ahora lleva `price_cents` y `compare_at_price_cents` junto a las cadenas ya formateadas, tanto en la variante como en cada `selling_plan_allocation`. Las cadenas formateadas se quedan porque son las que `updatePrice` inyecta; los centavos son nuevos y solo los consume el total de línea.

**Doce casos ejecutados con un DOM simulado antes de escribir al repo:**

| Caso | Resultado |
|---|---|
| Cantidad 1 | oculto, sin texto residual |
| Cantidad 2 | `Total for 2` / `$760.00` |
| Cantidad 3 con comparativo | `$1,140.00` con `$1,350.00` tachado |
| Comparativo igual al precio | comparativo oculto, correcto |
| Cantidad vacía, `abc`, o 0 | oculto en los tres |
| Cantidad 12 en formato EUR | `4.560,00 €` |
| Cantidad 4 en JPY sin decimales | `¥15,200` |
| Variante sin `price_cents` | oculto, falla de forma segura |
| Suscripción activa | usa `allocation.price_cents`, no el de la variante |
| Producto de precio 0, cantidad 3 | `$0.00`, que es el total correcto |

El caso de suscripción importa: `updateLineTotal` replica la prioridad `this.currentAllocation || this.currentVariant` que ya usaba `updatePrice`, de modo que un producto con plan de suscripción seleccionado multiplica el precio del plan y no el de venta única.

---

## 3. Bloque A2: densidad de grilla

El mapa de columnas quedó así, y ahora los tres elementos que lo comunican dicen lo mismo:

| Ancho | Botón 1 | Botón 2 |
|---|---|---|
| Teléfono | 1 columna · icono de 1 barra · "Show one product per row" | 2 columnas · icono de 2 barras · "Show two products per row" |
| 48rem y más | 2 columnas · icono de 2 barras · "Show two products per row" | 4 columnas · icono de 4 barras · "Show four products per row" |

Tres cosas que conviene explicitar.

**`[data-grid-columns='4']` en tablet pasó de 3 a 4 columnas.** Era obligatorio: el botón se llama "cuatro por fila" y entregaba tres. Con 768px de ancho y `column-gap` de 1rem, cada tarjeta queda en unos 170px, que es estrecho pero es un modo de exploración densa y es lo que el control promete.

**El tile de promoción deja de aplastar la fila en tablet.** `grid-column: 1 / -1` seguía vigente entre 48rem y 62rem, así que una promoción se comía una fila de cuatro. Se agregó el `auto` en el tramo de 48rem.

**`gap-inline` aparecía dos veces, no una.** La directiva señalaba `base.css:3254`. Había una segunda en `.search-results-grid`. Ninguna de las dos hacía nada, porque `gap-inline` no existe en CSS; el navegador las descartaba en silencio. Ambas son ahora `column-gap`, y el efecto visible es que la separación entre columnas aparece por primera vez en la grilla de producto y en la de resultados de búsqueda.

---

## 4. Bloque B: controles muertos

El patrón de guarda quedó unificado en las tres secciones que lo tenían mal, tomando como modelo el que ya existía en `main-collection.liquid:274`:

```liquid
{%- if section.settings.button_label != blank and section.settings.button_url != blank -%}
```

`hero-editorial` calcula `has_primary_button` y `has_secondary_button` en el bloque `liquid` de cabecera y no queda ni un `| default: routes.root_url`. Barrí el tema completo: **cero ocurrencias de `default: routes.root_url` en un `href`, cero `href` con filtro `default`, cero `url` de schema con valor por defecto.**

`templates/index.json` perdió las tres URLs `"/"` y, con ellas, las etiquetas que quedaban inertes. `curated_showcase` quedó con una sola pestaña ligada a `collection: "all"`, que existe en cualquier tienda, así que desaparecen las dos rejillas vacías.

**Sobre la región viva, el hallazgo se repetía en dos secciones.** La directiva pedía arreglar `main-collection`. `main-search` tenía el mismo defecto: su `<p class="main-search__count" role="status" aria-live="polite">` también vive dentro del subárbol que `this.innerHTML = nextElement.innerHTML` reemplaza, y lo sirve el mismo componente. Arreglar solo una de las dos habría dejado la mitad del problema en pie con la fila del ledger en verde. Por eso `announceResultCount()` lee el hook genérico `[data-results-status]`, que las dos secciones ya compartían, y sirve a ambas con una sola función.

`P1-22` cerró con la palabra `js-only`, como estaba previsto. La regla `.no-js .js-only { display: none !important }` ya existía en `base.css:4425` desde antes.

---

## 5. Desviaciones respecto a la directiva

Cinco. Cada una tiene su razón y todas son revisables.

**1. El tag de encabezado dinámico, tal como estaba especificado, era código muerto.** La directiva proponía:

```liquid
assign heading_tag = section.settings.heading_tag | default: default_heading_tag
```

El problema es que el schema define `"default": "h1"` para `heading_tag`, así que el ajuste nunca vale `blank` y el filtro `default:` jamás se dispara. La rama automática no se habría ejecutado ni una vez. Lo resolví agregando una opción `auto` al select y haciéndola el valor por defecto. `auto` da `h1` en la home y `h2` en cualquier otra plantilla, y el comerciante conserva la posibilidad de forzar el nivel. También reescribí el `info` del ajuste, porque el anterior daba instrucciones manuales que ya no hacen falta.

**2. Quité el `aria-label` de los botones de grilla.** La directiva pedía agregar etiquetas visuales duales pero no decía nada del `aria-label` existente. Dejar las dos cosas habría creado un conflicto: el `aria-label` gana sobre el texto visible para el lector de pantalla, y si dicen cosas distintas se incumple WCAG 2.5.3 Label in Name. Ahora el nombre accesible viene solo de la etiqueta, que cambia con el breakpoint y siempre coincide con lo que el botón hace.

**3. Las etiquetas son `visually-hidden`, no texto visible.** El conmutador es de iconos por diseño y agregar "Show one product per row" al lado de un botón de 44px rompería la sobriedad de la sección. Funciona porque `.visually-hidden` en este tema declara `!important` en todo menos en `display`, así que el intercambio por breakpoint con `display: none` / `display: inline` opera sin tocar esa clase.

**4. Moví el selector de ordenamiento en `main-search` en lugar de agregar uno nuevo.** Renderizar el bloque de la directiva dejando el que ya existía dentro de `.main-search__filters` habría producido dos `<select name="sort_by">` con el mismo `id` en el mismo formulario: `id` duplicado y dos valores enviados. Lo saqué del panel de filtros y lo dejé una sola vez bajo `search.performed and search.results_count > 0`. Agregué además un botón de aplicar con clase `no-js-only`, porque sin JavaScript y sin facetas ya no quedaba ningún botón de envío cerca del selector.

**5. No refactoricé los dos `formatMoney` que ya existían.** `theme.js` tenía dos, en `complete-the-look` (línea 1988) y en `predictive-search` (línea 2736), ambos con `Intl.NumberFormat`. El mío es el tercero. Lo dejé así a propósito: tocar el de búsqueda predictiva es tocar una fila que está en verde, y eso no entra en este sprint. Queda apuntado en la sección 7 como deuda, porque `Intl` no respeta el `money_format` de la tienda y puede imprimir `US$1,234.56` donde el servidor imprime `$1,234.56`.

---

## 6. Hallazgo fuera del encargo: 14 enlaces fantasma en /listings

Esto es lo más importante que encontré y no estaba en la directiva.

Después de limpiar `templates/index.json` revisé los nueve archivos de `/listings/*/templates/`, que son los que el revisor de la Theme Store abre cuando evalúa cada preset. **Llevaban el mismo defecto, catorce veces, en cinco archivos.** Arreglar solo `templates/index.json` habría dejado las tres tiendas de demostración rotas justo donde más pesa.

| Archivo | Controles muertos |
|---|---|
| `couture/templates/index.json` | hero "Explore the lookbook", manifesto "Read our process", bento "Explore the story" |
| `studio/templates/index.json` | hero "Read the method", manifesto "Read the method", bento "Read the study" |
| `archive/templates/index.json` | hero "Read our history", manifesto "Read the house history", bento "Open the record", bento "Visit the workshop" |
| `couture/templates/collection.json` | promoción "Read the story" |
| `archive/templates/collection.json` | promoción "Open the record" |

Los diez de tipo `card_editorial` valían doble, porque en `bento-discovery.liquid:81` un `link` no vacío también convierte la imagen de la tarjeta en enlace. Cada tarjeta tenía dos controles apuntando a `/`, no uno.

Los catorce piden una página de contenido: un proceso, un método, una historia de la casa, una nota de taller. Ninguna de esas páginas existe en una tienda recién creada, así que no había destino honesto que poner. **Opté por quitar la etiqueta y el destino en lugar de inventar una URL.** La razón es de riesgo: un enlace a `/` es un defecto invisible que el revisor descubre haciendo clic, y un `/pages/our-process` que nadie creó es un 404, que es peor. Sin CTA la composición se ve más sobria pero nada está roto.

**Checklist para restituirlos cuando construyas cada tienda de demostración.** Crea la página, confirma el handle, y vuelve a poner el par. Son dos líneas por enlace:

```json
"button_secondary_label": "Explore the lookbook",
"button_secondary_url": "/pages/<handle-que-verificaste>",
```

| Preset | Páginas que hacen falta | Enlaces que revive cada una |
|---|---|---|
| Couture | proceso del atelier, lookbook, una historia editorial | 3 |
| Studio | el método, un estudio de producto | 3 |
| Archive | historia de la casa, nota de campo, nota de taller | 4 |

Dos observaciones más de esos archivos, que no son controles muertos y por eso no toqué.

`curated_showcase` en los tres presets tiene dos o tres pestañas y **todas apuntan a `collection: "all"`**. Funcionan, no hay rejillas vacías, pero las pestañas muestran los mismos productos con nombres distintos. Un revisor que haga clic en "Archive selection" y vea lo mismo que en "Current catalogue" va a leerlo como demo sin terminar. Esto solo se arregla creando colecciones reales en cada tienda, que es trabajo tuyo, no de código.

`studio/templates/index.json` tiene `"media_label": ""`. Es inocuo porque la sección lo filtra con `!= blank`, así que lo dejé.

---

## 7. Verificación

Cuatro compuertas, y una prueba de que las compuertas son reales.

**Theme Check: 65 archivos, 0 ofensas.** Ejecutado con Shopify CLI 4.8.0, que es la versión que fija `package.json`.

**La compuerta se probó rompiéndola a propósito antes de confiar en el verde.** Sobre una copia desechable inyecté un `{% if %}` sin cerrar, una clave de traducción inexistente y una clave `t:` de schema inexistente. Theme Check reportó las tres: `LiquidHTMLSyntaxError`, `TranslationKeyExists` y `ValidSchemaTranslations`. Eso importa porque significa que el verde limpio **prueba** que las cinco claves de schema que agregué y todas las claves `| t` que usé resuelven de verdad. No es una afirmación mía, es una consecuencia del linter.

**`node --check assets/theme.js`: sin errores.**

**JSON estricto: 17 de 17 archivos parsean**, incluidos los nueve de `/listings`, que quedan fuera del alcance de Theme Check y por lo tanto valida un script aparte.

**Barridos de regresión:** cero referencias a las claves `view_compact` y `view_dense` que eliminé, cero `default: routes.root_url`, cero `"/"` como valor de ajuste en `templates`, `config` y `listings`.

**Una confirmación que vale la pena registrar sobre Row 37.** Revisé `snippets/responsive-image.liquid`: usa el filtro `image_tag`, que ya emite `width` y `height` en el `<img>` de forma automática. El hueco real estaba solo en los `<source>` del `<picture>`, que es precisamente lo que la fila señalaba. Con los dos `<source>` móviles llevando las dimensiones intrínsecas de `image_mobile`, el lado de código de la fila queda completo de verdad y no a medias.

---

## 8. Lo que queda, y de quién es

**De Johandry, y no se puede delegar a código.** Las siete filas del Bloque C necesitan medición en tienda: CLS por debajo de 0.1 con imagen real, una pasada de teclado completa, un informe de axe sin violaciones de `heading-order`, un producto con precios variables en oferta para ver Row 67, y una búsqueda con resultados y sin facetas para ver Row 76. Además: las páginas de contenido de las tres tiendas de demostración según el checklist de la sección 6, las colecciones reales para que las pestañas de `curated_showcase` dejen de repetirse, y las dos URLs comerciales de `ruizdigital.com` devolviendo 200, que es la fila que propuse bajar a `parcial`.

**De Gemini, para el ledger.** Tres filas necesitan corrección de estado, no de código. `Live Regions (aria-live)` estaba en `cumplido` y no lo estaba, ni en `main-collection` ni en `main-search`; ahora el código está puesto pero la fila se cierra con un lector de pantalla, no con una cita de línea. `Áreas táctiles` sigue siendo `parcial` y no la subo: arreglé los dos objetivos que la directiva nombró, y eso no equivale a haber auditado todos los objetivos del tema. Y hace falta una fila nueva para la validación del nombre contra reglamento y marcas, que sigue sin existir.

**Deuda técnica que dejo apuntada, no resuelta.** Los tres `formatMoney` de `theme.js` deberían ser uno. Los dos viejos usan `Intl.NumberFormat`, que ignora el `money_format` de la tienda, así que en un mercado con formato europeo la búsqueda predictiva y el bundle pueden imprimir un precio con distinta puntuación que el que el servidor renderizó tres centímetros más arriba. No es un control muerto ni un riesgo de rechazo, es una inconsistencia visible en tiendas multi-mercado. El helper de módulo que agregué ya resuelve el problema correctamente; el trabajo pendiente es migrar los dos consumidores viejos y borrar sus métodos, en un sprint donde tocar búsqueda predictiva sea aceptable.

**Un detalle menor, deliberado.** `.product-grid[data-grid-columns='4']` en el tramo de 62rem quedó redundante con el de 48rem, porque ambos declaran cuatro columnas. Lo dejé para que el tramo de escritorio siga siendo explícito y el diff sea mínimo. Si se prefiere limpiarlo, es borrar cuatro líneas sin efecto visual.
