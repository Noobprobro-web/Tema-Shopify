# DIAG-EMPTY-COLLECTION-PROMO-001

Diagnóstico solo de lectura (commit 303bf4d, rama lote-e-claude). No se aplicó ningún cambio, no se tocó la tienda.

## Resumen

La tarjeta «ATELIER SARTORIAL / 01 · Cloth remembers…» solo puede salir de UN sitio y ese sitio ya está protegido por el guard nuevo. En el código del commit, con 0 productos, la tarjeta NO se puede renderizar. La captura coincide exactamente con el comportamiento del guard ANTERIOR, lo que apunta a que lo que se ve no es el código del commit (HTML en caché o render de otra versión), no a una segunda ruta de render.

## 1. De dónde sale la tarjeta (evidencia)

Búsqueda de «Cloth remembers the shape of daily life», «material study», «ATELIER SARTORIAL» y `promotion_tile`/`promotion-tile` en sections/, snippets/, templates/, listings/, locales/, config/, assets/:

- `listings/sartorial/templates/collection.json:7-17`: único sitio con el texto «ATELIER SARTORIAL / 01» (eyebrow, línea 10), «Cloth remembers the shape of daily life» (heading, línea 11) y «Follow a material study from cloth to finished silhouette.» (línea 12). Es un bloque `promotion_tile` llamado `editorial` dentro de la sección `main` (`type: main-collection`), `position_in_grid: 4`, `color_scheme: scheme-4`.
- `sections/main-collection.liquid:546,552`: solo los `default` del schema (otro texto: «fibre to finished form»). No se usan al renderizar, solo al añadir un bloque nuevo.
- No existe snippet `collection-promo`. `grep promotion-tile|promotion_tile` en `.liquid`/`.js`/`.json` (fuera de harness/docs/agent-comms) solo encuentra `sections/main-collection.liquid` y los 3 `listings/*/templates/collection.json`.
- `templates/collection.json` (raíz) NO tiene bloques: nunca pinta tarjeta.
- `config/settings_data.json`: sin coincidencias.
- No hay sección propia aparte: el bloque vive en la misma sección `main`.

Única ruta de render: `sections/main-collection.liquid:323-375` (bucle `for block in section.blocks` → `<li class="product-grid__item product-grid__item--promotion">` → `<article class="promotion-tile …">`).

## 2. Respuestas

(1) ¿El guard era el sitio correcto? Sí. Todo el bucle de tarjetas (310-400) está dentro de `{%- if collection.products.size > 0 -%}` (línea 310; cierre en 400). Antes (`git diff 303bf4d~1`) era `collection.products.size > 0 or section.blocks.size > 0`, que con 0 productos y 1 bloque entraba al `ul`, y además el cálculo `promotion_append_position = size+1 = 1` y `total_grid_slots = 0 + blocks.size = 1` hacía que el bucle `1..1` pintara el bloque en la posición 1. Ese es exactamente el síntoma de la captura.

(2) ¿Otra ruta de render con promo y 0 productos? No. No hay otro `render`/`include` de promo en el archivo. Los únicos `render` del archivo son `responsive-image` (45, 344), `icon` (81, 368), `facets-active-filters` (246) y `product-card` (387); ninguno pinta bloques. `collection.products.size` dentro de `paginate` es 0 con colección vacía (la propia captura muestra «0 products» y el mensaje vacío en 407, que usa la misma condición `size == 0`).

(3) ¿Dentro o fuera de `.collection-products__empty`? Fuera. La tarjeta iría en `ul.product-grid > li` (311-373), hermano anterior de `div.collection-products__empty` (408). Nunca dentro. En la captura aparece encima del mensaje, igual que el orden del código.

(4) Otros presets: `listings/imprint/templates/collection.json` (bloque `technical_tile`, posición 4) y `listings/archive/templates/collection.json` (`catalogue_note`, posición 3) usan la misma sección y el mismo bloque `promotion_tile`, así que se comportan igual que Sartorial (con el guard nuevo no pintan nada con 0 productos). `templates/collection.json` no tiene bloques. Ningún preset sobrescribe la sección.

## 3. Causa raíz probable

El código del commit es correcto. La captura reproduce al milímetro el render del guard anterior (promo en slot 1 + empty state + «0 products» + toolbar). Causas posibles, de más a menos probable (no verificables sin tocar la tienda):

a) HTML de la colección en caché en el edge de Shopify / en la herramienta de captura (la caché de página puede servir HTML renderizado con la versión anterior del Liquid un rato tras la subida; los checksums de archivos no lo descartan).
b) La captura se hizo contra un tema distinto (otro `preview_theme_id` o el tema publicado en vez del actualizado). `docs/demo-store/created-themes.json` (cambio sin commitear) registra `lastUpdate.commit 303bf4d` para Sartorial/Imprint/Archive con `assets/base.css` y `sections/main-collection.liquid`.
c) Descartado por código: segunda ruta de render, bloque fuera del guard, snippet o sección aparte.

Comprobaciones que hay que hacer sin cambiar código (cuando se pueda tocar la tienda): pedir `/collections/empty-test?preview_theme_id=<Sartorial>&_=<timestamp>` y buscar en el HTML `product-grid__item--promotion` y `data-product-list`. Con el código nuevo ninguno de los dos debe aparecer en una colección de 0 productos. Si aparecen, el tema servido no es 303bf4d. Si no aparecen pero el estilo del empty state (`.collection-products__empty`, centrado, serif) tampoco se ve, es un `base.css` viejo/cacheado.

## 4. Cambio mínimo

Ninguno obligatorio para la tarjeta: el guard de la línea 310 ya es el cambio mínimo y correcto. No cambia nada para 1+ productos (el `ul` se pinta igual), ni para filtros sin resultados (0 productos → solo empty state «No products match your selection.» + «Clear all»), ni para el editor (en el editor con 0 productos tampoco se ve la tarjeta; el comerciante la verá en cuanto la colección tenga productos, lo cual es la intención del comentario de la línea 309).

Cierre robusto opcional (defensa en profundidad, solo si se quiere eliminar toda duda entre `size` y `products_count`): usar `collection.products_count > 0` en la línea 310 y 407. No lo recomiendo: `size` ya es coherente con el empty state y evita desincronizar los dos guards.

## 5. H2: ocultar «Filter and sort», conteo y botones Grid con 0 productos

Dependencias JS (`assets/theme.js`):
- `setGridView` (4279-4297): sale si no hay `[data-product-list]` (4283-4284). Con 0 productos el `ul` no existe, así que los botones Grid no hacen nada (ni siquiera actualizan `aria-pressed`). Ocultarlos no rompe JS.
- `FacetFiltersForm` es el custom element `<facet-filters-form>` que envuelve todo (29 y 451). Cada refresco AJAX sustituye `this.innerHTML` por el del HTML nuevo (4221-4223) y vuelve a llamar `applyStoredGridView` (4224), así que lo que se muestre lo decide siempre el servidor en cada render. Si se oculta el form o el toolbar, el JS solo falla en silencio si el selector no existe: `focusFallback` (4237) usa `querySelector(...)` con comprobación; `announceResultCount` (4249-4263) tolera ausencia de `[data-results-status]`; `setBusy` (4248-4251) tolera ausencia de `[data-product-grid]` (que no se oculta).
- Cuidado: con filtros activos y 0 resultados el form debe SEGUIR visible (si no, el usuario no puede quitar filtros salvo con el enlace «Clear all», que sí sigue). Por eso la condición debe basarse en `collection.all_products_count == 0` (sin filtros), no en `size == 0`.

Propuesta H2 (opcional, no aplicada):

- Botones Grid: ocultar siempre que `collection.products.size == 0` (no hay rejilla que cambiar, tanto vacía como filtrada).
- Bloque «Filter and sort» (`form.facets`, líneas 57-238): ocultar solo si `collection.all_products_count == 0` (colección realmente vacía; sin facets ni utilidad de ordenar).
- «0 products» (250-252): mantener con filtros (es el `data-results-status` que anuncia el resultado y recibe foco); con colección realmente vacía puede ocultarse, pero lo mínimo es dejarlo.
- Layout desktop: `.collection-main__body` pasa a 2 columnas (`assets/base.css:4707-4711`, `minmax(14rem,17rem) 1fr`). Si se quita el `form` queda la columna lateral vacía y el mensaje descentrado, así que hace falta una clase modificadora en el contenedor.

## 6. Diff propuesto (NO aplicado)

Parte A, ya aplicada en 303bf4d (no hay que repetirla): guard de 310.

Parte B, H2 opcional. En `sections/main-collection.liquid`:

```diff
@@ -20,2 +20,6 @@
   endfor
 -%}
+{%- liquid
+  assign collection_is_blank = false
+  if collection.all_products_count == 0
+    assign collection_is_blank = true
+  endif
+-%}
@@ -56 +60 @@
-      <div class="collection-main__body">
+      <div class="collection-main__body{% if collection_is_blank %} collection-main__body--empty{% endif %}">
+        {%- unless collection_is_blank -%}
         <form class="facets" ...>
         ...
         </form>
+        {%- endunless -%}
@@ -253 +257 @@
-              <div
-                class="collection-grid-switcher js-only"
+              {%- if collection.products.size > 0 -%}
+              <div
+                class="collection-grid-switcher js-only"
 ...
-              </div>
+              </div>
+              {%- endif -%}
```

y en `assets/base.css`, dentro del media query de 4707 (o después):

```diff
+.collection-main__body--empty {
+  grid-template-columns: minmax(0, 1fr);
+}
```

(La clase modificadora debe ir también después de la regla de 4707-4711 para ganar la cascada, o dentro del mismo `@media (min-width: …)`.)

## 7. Riesgos

- Parte A (ya aplicada): riesgo nulo; verificar solo que con 1+ productos el `ul` sale igual (no cambia el camino) y que el editor del tema con colección vacía deja de mostrar la tarjeta (esperado).
- Parte B: (i) `all_products_count` es el total sin filtros; usarlo evita ocultar el form al filtrar a 0, pero en un tema sin Search & Discovery configurado también vale. (ii) Un collection page en el editor sin productos pierde «Filter and sort» y el comerciante no verá los ajustes de rejilla: el contenido del editor sigue accesible desde los ajustes de la sección, pero conviene avisarlo. (iii) Ocultar el toolbar con filtros a 0 también quita `data-results-status`; si se oculta el conteo, `announceResultCount`/foco usan fallback, por eso se mantiene el conteo con filtros. (iv) Los strings del tema (`collections.filters.title`, `collections.grid.*`) no cambian; no hay nuevas claves de locale. (v) Requiere recorrido en tienda real de los 5 estados degenerados antes de cerrar (compuerta 2 y 5).
- Si tras confirmar (a)/(b) de la sección 3 la tarjeta persiste con el commit correcto, escalar: significaría que `collection.products.size` no es 0 en esa renderización (p. ej. render distinto de Shopify), y habría que comparar con `collection.products_count` en el HTML.
