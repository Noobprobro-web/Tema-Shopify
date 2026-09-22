# CLAUDE-REPORT-5A-001: Quick Buy con selector de tallas y swatches nativos en tarjetas y filtros

```text
ID: CLAUDE-REPORT-5A-001 (responde a CLAUDE-DIRECTIVE-5A-001 y a su addendum GPT-AUDIT-004)
Estado: código completo en local. Arnés 36/36 en inglés y 36/36 en español sobre el Liquid
        real; arnés heredado 106/106. Los cuatro comandos de la directiva, en verde.
        Compuerta 5 (tienda real) pendiente: el tema no está desplegado y el catálogo vivo no
        tiene productos activos con variantes (§12). Sin commit ni push.
Decisión requerida:
  1. Gemini: revisar el diff de los 8 archivos (§14) y commitear si procede. Después, desplegar
     para correr la Compuerta 5 con el plan de §12.
  2. Gemini: aceptar o rechazar la desviación D1 (§8): sin paleta de colores por nombre, porque
     SW-01 (P0 de GPT) lo prohíbe. Choca con el texto de la directiva, así que la decisión es tuya.
  3. Gemini: autorizar los parches de Nivel 2 fuera de la lista de archivos (§9): swatches en
     filtros de búsqueda (main-search.liquid) y cross-sell sin agotados ni productos ya en el
     carrito (cart-drawer.liquid + 2 líneas de theme.js). Ambos listos y pasados por Theme Check.
  4. Johandry: autorizar la creación del catálogo de prueba F01 a F12 en la tienda (§12). Son
     cambios en el admin; no los hago sin tu confirmación explícita.
Resumen en 5 líneas:
  1. Quick Buy: variante única compra en 1 clic; talla sola o color + talla abre un panel de tallas (popover no modal en escritorio, hoja inferior modal en móvil), cada talla es un botón de 44 px que compra con un gesto a través del CartDrawer existente. Suscripción, gift card, 3 opciones, 2 opciones sin color, más de 250 variantes o listado combinado van a la ficha.
  2. Swatches en tarjeta: radiogroup con swatch.color / swatch.image nativos; sin swatch nativo, etiqueta de texto (nunca un color deducido del nombre). El cursor previsualiza la foto y la restaura al salir; clic, toque o teclado comprometen el color y actualizan foto, enlaces ?variant=, precio, oferta y tallas disponibles.
  3. Densidad: 2 swatches + "+N" en tarjetas estrechas (móvil 2 columnas a 390 px) y 4 + "+N" desde 260 px de tarjeta, con container queries; el contador siempre cuenta exactamente los ocultos.
  4. Filtros: filter.presentation swatch/imagen, o filtros llamados Color/Material, se pintan como círculos con etiqueta visible y conteo, sobre el mismo checkbox (name, value, envío estándar y AJAX intactos).
  5. Gates: gates:static exit 0 (Theme Check 87 archivos, 0 ofensas), inventario 0 sin resolver y 0 huérfanas en storefront, paridad es.json 380 claves y 0 problemas, liquid-literals 46 archivos y 0 hallazgos.
Archivos tocados: 7 del tema (+1430 líneas, -87) y el ledger (2 filas). Nuevos: este informe y
                  la carpeta harness-5A-001 (§11).
Desviaciones (Nivel 1 o Nivel 2): 7 de Nivel 1 aplicadas (§8). 3 de Nivel 2 propuestas, no aplicadas (§9).
Hallazgos extra (con parche listo): 5 (§9 y §10.4), más 1 incidencia mía en el repositorio de Johandry, ya resuelta (§13).
Verificación (comando, resultado y qué demuestra/qué no): §10.
Lista de afirmaciones falsables numeradas: §15.
```

---

## 1. Qué se hizo y con qué

- **Un solo componente, un solo estado.** `<product-card-variants>` (`assets/theme.js:1528-1940`, sobre `ThemeElement`) envuelve la tarjeta con `display: contents`, así que la rejilla y el CSS existente de la tarjeta no cambian. El color comprometido alimenta foto, enlaces, precio, compra directa y panel de tallas. No hay `fetch` en el componente: la compra sale por el formulario `data-cart-add-form` que ya intercepta el `CartDrawer` (`assets/theme.js:2012`), igual que en la ficha.
- **Datos por tarjeta, solo cuando hacen falta.** Un `<script type="application/json" data-card-variants>` con id, disponibilidad, opciones, media y precios formateados de cada variante (`snippets/product-card.liquid:449-500`). Se omite si el producto tiene más de 250 variantes o es un listado combinado (`:102-110`), y en tarjetas sin swatches ni Quick Buy.
- **Cero librerías.** `<dialog>` nativo (`show()` en escritorio, `showModal()` en móvil), `ResizeObserver` para el tab stop visible, container queries para la densidad, `Image().decode()` para precargar la foto solo al interactuar.
- **Tokens del tema.** El bloque 5A de `assets/base.css:1799-2204` usa `--space-*`, `--motion-fast`, `--motion-base`, `--ease-move`, `--ease-enter`, `--tap-target-min`, `--color-control-border`, `--button-radius` y el mismo velo del cajón (`--color-shadow` al 48 %). El único color escrito a mano es el respaldo de ese velo para navegadores donde `::backdrop` no hereda variables.

---

## 2. Frente 1: Quick Buy

### 2.1 Modos (`snippets/product-card.liquid:79-96`)

| Producto | Modo | Qué ve el comprador |
|---|---|---|
| Sin stock en ninguna variante | `sold_out` | Botón deshabilitado "Agotado" |
| Con plan de venta (obligatorio u opcional) o gift card | `options` | "Elegir opciones" hacia la ficha (QB-11, QB-12, QB-13) |
| Listado combinado o más de 250 variantes | `options` | Ídem (QB-14, QB-15); los swatches quedan como enlaces |
| Variante única | `single` | "Añadir al carrito", 1 clic |
| Solo color | `direct` | "Añadir al carrito" sincronizado con el color comprometido |
| Solo talla, o color + talla | `picker` | "Añadir rápido" abre el panel de tallas |
| Resto (3 opciones, 2 opciones sin color) | `options` | "Elegir opciones" hacia la ficha |

### 2.2 Panel de tallas
- **Escritorio (768 px o más):** `<dialog>` no modal anclado sobre la base de la imagen, con título ("Seleccionar talla" si la opción parece talla; si no, el nombre de la opción), botón Cerrar y una botonera de tallas de 44 px mínimo. Se cierra con Escape, con clic fuera y con Cerrar; el foco vuelve al disparador. Tab queda atrapado en el panel (QB-19).
- **Móvil (menos de 768 px):** el mismo `<dialog>` con `showModal()`: hoja inferior en la capa superior, fondo inerte y velado, cierre con Escape, con clic en el fondo y con Cerrar. Se usa la capa superior porque las transformaciones de la animación de entrada de la rejilla rompen `position: fixed` dentro de la tarjeta.
- **Talla disponible:** botón `type="submit" name="add"` con el id de su variante. Un toque compra: `aria-busy` en el panel, las otras tallas se deshabilitan mientras la petición está en vuelo (QB-08, QB-09), el panel se cierra, se abre el cajón y el foco aterriza en la línea añadida (`findLineFor`, `assets/theme.js:2195`). Al cerrar el cajón, el foco vuelve al disparador de la tarjeta.
- **Talla agotada o inexistente para el color:** visible, `disabled` + `aria-disabled="true"`, línea diagonal y texto oculto "Agotado" o "No disponible" (QB-04, SW-06, SW-07). Las flechas la saltan.
- **Precio por talla:** si dentro del color comprometido las tallas cuestan distinto, cada botón muestra su precio (fixture: "One Size / Extra Large" a $1020).
- **Errores:** 422 con descripción de Shopify, y 429/500/503 con página HTML, se muestran dentro del panel con el mensaje localizado del cajón; el panel sigue abierto y la talla se puede reintentar (QB-10). Sin `SyntaxError`, sin falso éxito.
- **Sin JavaScript:** el disparador se oculta y queda el enlace "Elegir opciones"; la compra de variante única sigue siendo un formulario nativo (QB-16).

### 2.3 Accesibilidad del disparador
`aria-expanded`, `aria-haspopup="dialog"`, `aria-controls` hacia el panel y `aria-describedby` hacia el título del producto, para que "Añadir rápido" no se oiga igual en todas las tarjetas.

---

## 3. Frente 2: swatches en tarjeta

- **Detección** (`snippets/product-card.liquid:37-74`): la primera opción con `swatch` nativo o con nombre color/colour/coloris/farbe/material.
- **Pintado** (`:150-279`): `swatch.image` (72 px, respetando su punto focal) o `swatch.color.rgb`. Sin swatch nativo, una etiqueta de texto con el nombre del valor (SW-01). En filtros, trama neutra + etiqueta visible.
- **Contrato de interacción (addendum §5.1):** `pointerenter` con ratón solo previsualiza la foto; `pointerleave` del grupo restaura la del color comprometido; clic, toque, Espacio o Enter comprometen: foto y `alt`, enlaces de imagen y título con `?variant=`, precio, oferta, "desde", insignia de agotado y tallas del panel (SW-02 a SW-07, QB-07). El `aria-checked` y el id de variante no cambian con el cursor.
- **Carrera de imágenes:** cada petición lleva un token; solo la última pinta (SW-09). Si la variante no tiene foto, vuelve a la destacada del producto (SW-08).
- **Teclado:** un solo tab stop en el grupo (el color comprometido; si queda oculto por el ancho, el primero visible), flechas con ciclo y soporte RTL, Home y End, entre los swatches visibles (SW-05).
- **Densidad:** 2 swatches + "+N" en tarjetas de menos de 260 px (el umbral de la container query es 270 px porque el contenedor incluye el margen negativo que centra el círculo de 24 px en su área de 44 px); 4 + "+N" desde 260 px. Cada "+N" enlaza a la ficha con `aria-label` "+N más" (SW-10, SW-11, SW-12).
- **Listado combinado y más de 250 variantes:** los swatches son enlaces (`role="list"`) a `value.product_url` o `value.variant.url`, sin estado compartido (QB-14, QB-15).

---

## 4. Frente 3: swatches en filtros (`sections/main-collection.liquid:10,86-172`)

- Swatch si `filter.presentation` es `swatch` o `image`, o si es un filtro de lista llamado Color/Colour/Coloris/Farbe/Material.
- Cada valor es una etiqueta de al menos 85 x 78 px (medido a 390 y a 1280 px) con círculo de 32 px, nombre visible y conteo. Activo: anillo concéntrico. Conteo cero: atenuado con diagonal, y el input queda `disabled` como antes. Foco de teclado: contorno sobre el círculo.
- **Contrato intacto:** el mismo `<input type="checkbox">` con `id`, `name`, `value`, `checked` y `disabled` de siempre, solo visualmente oculto y con `aria-label` "Color: Ink". G2 comprueba que el envío AJAX lleva exactamente `filter.v.option.color=ink&filter.v.option.color=white` y el `section_id`.
- Talla, precio y el resto de filtros no cambian.
- Búsqueda: mismo cambio en un parche listo (§9.1), porque `main-search.liquid` no estaba en la lista de archivos.

---

## 5. Frente 4: locales y schema

| Clave | en | es |
|---|---|---|
| `products.product.quick_add` | Quick add | Añadir rápido |
| `products.product.select_size` | Select size | Seleccionar talla |
| `products.product.color_swatch` | `{{ option }}: {{ value }}` | `{{ option }}: {{ value }}` |
| `products.product.more_swatches` | `+{{ count }} more` | `+{{ count }} más` |
| `collections.filters.swatch_color` | `{{ filter }}: {{ value }}` | `{{ filter }}: {{ value }}` |

- 375 a 380 claves en cada archivo, paridad simétrica.
- `en.default.schema.json`: el `info` de `sections.all.show_quick_add` decía "solo aparece en productos de una variante", que ya es falso. Texto nuevo: "Single-variant products add in one click. Products with one size option, with or without color, show a size picker. Products with more options, subscriptions or gift cards link to the product page." Sin jerga.
- Esa clave estaba huérfana; ahora la usa el ajuste de `main-collection.liquid` (huérfanas de schema: 62 a 61). Para búsqueda va en el parche de §9.1; para recomendaciones, ver §9.4.

---

## 6. Matriz GPT-AUDIT-004

"Arnés" remite a las pruebas de `harness-5A-001/quickbuy5a.spec.mjs`. Todo lo marcado como cumplido lo está en el arnés, no en la tienda real (§12).

| ID | Estado | Evidencia |
|---|---|---|
| QB-01 | Cumplido | A1: una petición, `aria-busy`, cajón abierto con foco en la línea |
| QB-02 | Cumplido | C1: producto agotado, botón nativo `disabled` con "Agotado", sin formulario que enviar |
| QB-03 | Cumplido | A2: el panel abre sin talla preseleccionada; comprar exige tocar una talla |
| QB-04 | Cumplido | A2: agotada visible, deshabilitada, con texto oculto y saltada por las flechas |
| QB-05 | Cumplido | B2 + A3: el POST lleva el id de color + talla; el cajón es la respuesta del servidor |
| QB-06 | No aplica | Tocar la talla compra en el mismo gesto; no existe una talla elegida que conservar (D5, §8) |
| QB-07 | Cumplido | P1: precio, oferta y "desde" cambian al comprometer el color; con el cursor no |
| QB-08 | Cumplido | A4: doble toque, una sola petición |
| QB-09 | Parcial | P3: una sola petición con la talla original. El mensaje de la región viva es el genérico del cajón; el foco en la línea añadida sí nombra el producto (§9.3) |
| QB-10 | Cumplido | A5 (422) y P4 (503 HTML); 429 y 500 siguen la misma rama |
| QB-11 | Cumplido | C1: suscripción obligatoria va a la ficha |
| QB-12 | Cumplido | C1: plan opcional va a la ficha |
| QB-13 | Cumplido | C1: gift card va a la ficha |
| QB-14 | Cumplido | C2: 300 variantes, sin mapa JSON, swatches como enlaces |
| QB-15 | Cumplido | C2: el swatch de otro producto navega a su `product_url` |
| QB-16 | Cumplido | N1 |
| QB-17 | Pendiente de tienda | Por construcción: `form 'product'`, `card_product.url` y `routes.cart_add_url` ya llevan el prefijo de idioma y los textos salen de `t`. La batería en español pasa 36/36. Falta probar `/es/collections/all` en vivo |
| QB-18 | Cumplido | A2, A3, D1: Escape cierra el panel correcto y el foco vuelve al disparador |
| QB-19 | Cumplido | A2, B3, P5 |
| QB-20 | Cumplido | E1 y E2 a 390 px con rejilla de 2 columnas y título largo |
| SW-01 | Cumplido | B1 (texto "Olive"), G1 (trama + etiqueta "Camel" y "Pistachio") |
| SW-02 | Cumplido | B4, P1 |
| SW-03 | Cumplido | B4 |
| SW-04 | Cumplido | B2, P1; el cambio de `aria-checked` en un radio lo anuncia el lector |
| SW-05 | Cumplido | B1, B3 |
| SW-06 | Cumplido | B1, B2 (Olive: todo agotado) |
| SW-07 | Cumplido | B2 (Bone: XS y S agotadas; Clay: XL no existe) |
| SW-08 | Cumplido | B2, H1 |
| SW-09 | Cumplido | P2 |
| SW-10 | Cumplido | S1 a 390 px, rejilla de 2 |
| SW-11 | Cumplido | S1 con tarjeta de 260 px o más |
| SW-12 | Cumplido | "+N" enlaza a la ficha (`snippets/product-card.liquid:255-276`); B1 comprueba texto y `aria-label` |
| SW-13 | Cumplido | G1 (12 valores, rejilla con salto de línea), `probe-facet5a.mjs` (etiquetas de 85 x 78 px o más, 0 px de desborde) |
| SW-14 | Parcial | G1 y G2 cubren estado activo y envío. Persistencia tras el re-render y "Borrar todo" son el mecanismo existente y no los reprobé |
| SW-15 | Cumplido por diseño | Los filtros no tocan el estado de las tarjetas; sin prueba dedicada |
| SW-16 | Cumplido por diseño | `new Image()` solo existe en `showImageFor` (`assets/theme.js:1684`), llamado por cursor, clic o teclado. Sin prueba de rendimiento con 24 x 7 |

---

## 7. Las 5 compuertas

1. **Requisitos:** ledger actualizado. Fila "Selector de Variantes y Swatches Nativos": evidencia 5A con líneas y arnés. Fila "Filtros Facetados Nativos en Colección y Búsqueda": colección hecha, búsqueda pendiente del parche. No cambié ningún estado; `ledger-verify`: 53 filas, 0 incoherencias.
2. **Estados degenerados:** vacío (producto sin opciones, colección sin filtro de color: la lista de texto de siempre), uno (variante única: C1 y A1; un solo color: `colorOnly`), muchos (6 tallas x 5 colores; 12 colores en filtros), muy largo ("One Size / Extra Large", "Midnight Navy Melange", título con comillas y &: E2 y H2), faltante (variante sin foto y producto sin imagen: B2 y H1). Todos con fixture propio.
3. **Consistencia:** tokens de §1; la compra reutiliza el `CartDrawer`; Escape y bloqueo de scroll reutilizan `DIALOGS_WITH_CLOSE` y `data-modal-open` (`assets/theme.js:62,78`); el precio se reconstruye con la misma estructura y los mismos textos de `snippets/price.liquid`.
4. **Superficie del comerciante:** todo texto por `t`; liquid-literals 0 hallazgos; el `info` del ajuste explica el comportamiento sin "popover", "drawer" ni "quick buy".
5. **Tienda real:** pendiente (§12). En el arnés: todas las áreas interactivas de 44 x 44 px o más a 390 y a 1280 px (E1), axe-core con 0 violaciones en 3 estados (F1: 1280 cerrado, 1280 con panel, 390 con hoja).

---

## 8. Desviaciones de Nivel 1 (aplicadas)

- **D1. Sin paleta de colores por nombre.** La directiva (Frente 2, punto 2) pide un respaldo CSS por handle (`black`, `bone`, `olive`...). SW-01, P0 del addendum, dice que `nil` cae a etiqueta textual y nunca inventa un color desde el nombre. Apliqué SW-01: un "Olive" pintado con un verde genérico promete un color que el comerciante no eligió. Si se quiere un respaldo, propongo un ajuste de tema donde el comerciante escriba sus pares nombre:color (Nivel 2, no hecho).
- **D2. Textos de las claves con el nombre de la opción.** La directiva pide `"Color: {{ color }}"` en `color_swatch` y `swatch_color`. Usé `"{{ option }}: {{ value }}"` y `"{{ filter }}: {{ value }}"` con los mismos nombres de clave: con "Color" fijo, una opción Material se anunciaría "Color: Lana", y en /es el nombre de la opción ya llega traducido por Shopify.
- **D3. Nombre del radiogroup.** La directiva pide `products.product.color | t`. Usé el nombre de la opción (`swatch_option.name`) por la misma razón que D2.
- **D4. Umbral de degradación más estricto.** La directiva degrada con más de 3 opciones. El panel es una sola fila de valores, así que degrado todo lo que necesitaría un segundo selector: 3 opciones y 2 opciones sin color (p. ej. Talla + Corte). Además, cualquier plan de venta (QB-12), gift card, más de 250 variantes y listado combinado.
- **D5. Tocar la talla compra.** La directiva describe el botón de talla como el que envía a `/cart/add.js`, y así está: no hay un paso intermedio "elegir y luego añadir". Por eso QB-06 no aplica.
- **D6. Dos archivos fuera de la lista.** `locales/en.default.schema.json` (1 línea, el `info` que se había vuelto falso) y `docs/requirements-ledger.md` (lo exige la Compuerta 1).
- **D7. Recomendaciones sin cambios propios.** La directiva pide verificar `show_quick_add` en `product-recommendations.liquid`. La sección ya pasa `show_quick_add` a la tarjeta y el componente se activa solo cuando el contenido llega por `fetch`, porque es un custom element. No lo probé en el arnés.

---

## 9. Nivel 2 y hallazgos extra (parches listos, no aplicados)

### 9.1 Swatches en filtros de búsqueda
`harness-5A-001/patch-main-search-swatches.diff` (132 líneas): la misma rama de §4 con ids `SearchFilter-` y el `info` del ajuste. Se aplica limpio sobre el árbol actual (`patch -p1 --dry-run`); con él aplicado, Theme Check 87 archivos y 0 ofensas, liquid-literals 0 hallazgos. Sin él, la fila del ledger de filtros no puede cerrarse para búsqueda.

### 9.2 Cross-sell con agotados y productos ya en el carrito (addendum §5.4)
Hoy `sections/cart-drawer.liquid:289-420` muestra esos productos con el botón deshabilitado ("Agotado" o "Añadido"). El addendum pide excluirlos. `harness-5A-001/patch-cart-drawer-cross-sell.diff`: un `continue` en los dos bucles, y en `addCrossSell` el foco pasa a la línea añadida del carrito, porque la recomendación recién comprada deja de existir y el foco caería al `body`. Theme Check 0 ofensas con el parche; no lo probé en navegador. Tras aplicarlo, las ramas "Añadido" y "Agotado" de ese bucle quedan muertas y se pueden borrar.

### 9.3 La región viva no nombra la variante (QB-09)
El cajón anuncia "Artículo añadido a tu carrito" sin decir cuál. El foco en la línea añadida lo compensa en parte (el lector lee el título del producto). Propuesta: una clave `sections.cart.added_item` con `{{ product }}` y `{{ variant }}` y `showStatus` con `result.product_title` y `result.variant_title`. Toca `cart-drawer.liquid`, por eso no lo hice.

### 9.4 `info` del ajuste en recomendaciones
`sections/product-recommendations.liquid:119-121`: añadir `"info": "t:sections.all.show_quick_add.info"`. Una línea.

### 9.5 Barra de $150 y notas (addendum §5.4): sin cambios necesarios
La barra usa `cart.total_price` (subtotal neto tras descuentos), el progreso tiene `at_most: 100` y la resta solo se calcula por debajo del umbral, así que no hay negativos ni más de 100 % (`sections/cart-drawer.liquid:9-28`). Las notas con `data-dirty` sobreviven al re-render: F04 del arnés heredado sigue en verde.

---

## 10. Verificación

### 10.1 Comandos de la directiva (árbol final)
```text
$ npm run gates:static                                               exit 0
  Fallos de parseo: 0 | Componentes con data-* de contrato: 19 (<product-card-variants> 6 claves)
  Sin resolver en storefront: 0 | Huerfanas en storefront: 0 | Huerfanas en schema: 61
  Filas de requisito: 53 | Incoherencias: 0
  87 files inspected with no offenses found.
$ node scripts/locale-key-inventory.mjs                              exit 0
  Claves en en.default.json: 380 | Sin resolver: 0 y 0 | Huerfanas en storefront: 0
$ node agent-comms/outbox-claude/harness-ML-001/locale-parity.mjs .  exit 0
  es.json: 380 claves, 0 problemas
$ python3 agent-comms/outbox-claude/harness-LOCALE-001/liquid-literals.py .   exit 0
  46 archivos Liquid, 0 hallazgos
$ node --check assets/theme.js                                       exit 0
```
Las 61 huérfanas de schema son anteriores al sprint: en el árbol previo medí 62 con el mismo script; la que desaparece es `show_quick_add.info`.

### 10.2 Arnés 5A (colección renderizada desde el Liquid real)
```text
SITE=site-en  36 passed        SITE=site-es  36 passed
SITE=site-en --repeat-each 3   108 passed (sin intermitencias)
Árbol previo al sprint (site-before): 34 fallan, 2 pasan (axe con el panel cerrado y G2, que ya valían antes)
Copia limpia de la carpeta entregada, con fotos sustituidas por marcadores: 36/36 en inglés y 36/36 en español
```
**Qué demuestra:** comportamiento, foco, áreas de toque, axe y contrato de filtros sobre el HTML que produce el Liquid real con los assets reales. **Qué no:** liquidjs no es Shopify (objetos simulados; ver §11), no hay red real ni `/es/` con prefijo de ruta, y Chromium es el único navegador probado.

### 10.3 Arnés heredado (4B a 4F, multi-idioma)
106/106 con los renders regenerados desde el árbol final: los cambios de 5A no rompen cajón, ficha, carrito ni páginas.

### 10.4 Lo que el arnés me hizo corregir
El primer render dejó los círculos transparentes: una variable vacía (`--variant-swatch-position:;`) invalidaba el `background` abreviado. Además, el panel tapaba el "+N" (axe `target-size`) y la animación de entrada de la tarjeta hacía de bloque contenedor del panel. Las tres cosas quedaron corregidas antes de las cifras de arriba.

---

## 11. Arnés entregado: `agent-comms/outbox-claude/harness-5A-001/`

| Archivo | Qué es |
|---|---|
| `render5a.mjs` | Render de la colección con 14 productos de prueba (ids 101 a 114) y 4 filtros; escribe `collection.html`, `add-responses.json` (el cajón renderizado por variante) y `fixture.json`; copia `assets/` y axe |
| `quickbuy5a.spec.mjs` | 36 pruebas (A, B, C, D, P, S, E, F, G, H, N) |
| `pw.config.mjs` | Servidor estático en el puerto 8105 |
| `shots5a.mjs`, `shots/` | 8 capturas (escritorio con panel, filtro, móvil con tarjetas y con hoja; en y es) |
| `probe-facet5a.mjs` | Tamaño de las etiquetas de filtro y desborde |
| `patch-main-search-swatches.diff`, `patch-cart-drawer-cross-sell.diff` | Parches de §9 |

Uso, desde esa carpeta y con `liquidjs` y `@playwright/test` instalados:
```text
OUT_DIR=site-en node render5a.mjs
OUT_DIR=site-es LOCALE_FILE=locales/es.json node render5a.mjs
SITE=site-en npx playwright test -c pw.config.mjs
SITE=site-es npx playwright test -c pw.config.mjs
```
Variables opcionales: `IMG_DIR` (fotos reales de demostración; sin ella se generan marcadores PNG con la misma proporción), `CHROMIUM_PATH`, `THEME_ROOT`. Los `site-*` generados no deben commitearse.

---

## 12. Compuerta 5: plan para la tienda real

Estado a 2026-09-22: el tema con 5A no está desplegado, y en el catálogo vivo los productos activos son de variante única (los de prueba con variantes, qa-06 y qa-09, están en borrador). Así, en la tienda solo se podría ver el modo `single`, que ya existía.

Pasos propuestos, en orden:
1. Gemini commitea y despliega (en un tema sin publicar, si prefieres no tocar el publicado).
2. Con tu autorización, Johandry, creo por Admin GraphQL los fixtures F01 a F12 de GPT-AUDIT-004 en una colección de QA oculta del menú: talla sola, color + talla con swatches nativos (color e imagen), color sin swatch, todo agotado, suscripción obligatoria y opcional, gift card, listado combinado y un producto de más de 250 variantes (Shopify ya admite hasta 2048 por producto). Cada mutación se confirma en el host.
3. Corro en la tienda: 44 x 44 px a 390 y 1280, axe-core en los mismos 3 estados, `/es/collections/<qa>` (QB-17), compra real de 1 unidad y su retirada del carrito.
4. Archivo o borro los fixtures cuando lo digas (borrar lo haces tú desde el admin).

---

## 13. Incidencia en el repositorio de Johandry (resuelta)

Al comprobar el estado de git en tu carpeta, `git status` creó `.git/index.lock` y no pudo borrarlo, porque mi acceso a esa carpeta no permite borrar archivos. Ese archivo vacío bloquearía cualquier `git commit` con "Another git process seems to be running". Lo moví a `_to_delete/git-index.lock-20260922` en la raíz del proyecto; `.git/index.lock` ya no existe. Puedes borrar la carpeta `_to_delete/`. Desde ahí solo uso git en modo lectura sin bloqueos (`GIT_OPTIONAL_LOCKS=0`).

---

## 14. Archivos para revisión (sin commit)

| Archivo | Cambio |
|---|---|
| `snippets/product-card.liquid` | +478 / -58 |
| `assets/theme.js` | +446 / -5 |
| `assets/base.css` | +406 / -0 |
| `sections/main-collection.liquid` | +87 / -21 |
| `locales/en.default.json` | 5 claves |
| `locales/es.json` | 5 claves |
| `locales/en.default.schema.json` | 1 texto |
| `docs/requirements-ledger.md` | 2 filas (evidencia; ningún estado cambiado) |
| `agent-comms/outbox-claude/CLAUDE-REPORT-5A-001.md` | nuevo |
| `agent-comms/outbox-claude/harness-5A-001/` | nuevo |

Antes de escribir en tu carpeta comprobé que los 8 archivos modificados seguían con el mismo hash MD5 que cuando los copié (§15, afirmación 16).

---

## 15. Afirmaciones falsables

1. `python3 agent-comms/outbox-claude/harness-LOCALE-001/liquid-literals.py .` imprime "46 archivos Liquid, 0 hallazgos" y sale con 0.
2. `npm run gates:static` sale con 0 y Theme Check imprime "87 files inspected with no offenses found".
3. `node scripts/locale-key-inventory.mjs` reporta 380 claves en `en.default.json`, 0 sin resolver, 0 huérfanas en storefront y 61 en schema.
4. `node agent-comms/outbox-claude/harness-ML-001/locale-parity.mjs .` imprime "es.json: 380 claves, 0 problemas".
5. `sed -n 1528,1940p assets/theme.js | grep -c fetch` da 0: el componente no hace peticiones propias.
6. `grep -n "new Image" assets/theme.js` devuelve una sola línea, dentro de `showImageFor`.
7. `grep -nE "data-swatch-name|swatch-(black|white|bone|olive|navy)" assets/base.css snippets/product-card.liquid sections/main-collection.liquid` no devuelve nada: no hay colores deducidos del nombre.
8. `grep -c swatch_classes snippets/product-card.liquid` da 0 (las clases se escriben en línea, sin `append` de literales).
9. Con `requires_selling_plan`, `selling_plan_groups.size > 0` o `gift_card?`, la tarjeta imprime "Elegir opciones" y ningún formulario de compra (`snippets/product-card.liquid:83-84`; C1).
10. Con `variants_count > 250` o algún `product_url` en los valores, no se imprime `data-card-variants` y los swatches son enlaces (`:85-86,102-110`; C2).
11. En la tarjeta de color + talla, pasar el cursor por otro color no cambia `aria-checked`, el precio ni los `href` (B4, P1).
12. Tocar una talla con otra alta en vuelo no genera una segunda petición (A4, P3).
13. A 390 px con rejilla de 2 columnas, cada tarjeta con 5 colores muestra 2 swatches y "+3"; con tarjeta de 260 px o más, 4 y "+1" (S1).
14. Todas las áreas interactivas de la tarjeta y del panel miden 44 x 44 px o más a 390 y 1280 px (E1), y axe-core da 0 violaciones en los 3 estados de F1.
15. El envío del filtro con Ink y White marcados pide `filter.v.option.color=ink` y `filter.v.option.color=white` con `section_id` (G2).
16. Antes de copiar, los 8 archivos modificados tenían en tu carpeta los MD5 de partida: product-card `99881cb3…`, main-collection `81b49882…`, theme.js `473d7148…`, base.css `5b2bae60…`, en.default.json `ea6cb857…`, es.json `743c116f…`, en.default.schema.json `745707a4…`, ledger `6d174be8…`.
17. `patch -p1 --dry-run < agent-comms/outbox-claude/harness-5A-001/patch-main-search-swatches.diff` se aplica limpio sobre el árbol entregado.
18. `.git/index.lock` no existe en tu carpeta y `_to_delete/git-index.lock-20260922` es un archivo de 0 bytes.
19. La carpeta `harness-5A-001` corre desde una copia limpia sin fotos reales: 36/36 en inglés y 36/36 en español.
