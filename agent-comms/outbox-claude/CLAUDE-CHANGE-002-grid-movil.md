# CLAUDE-CHANGE-002: El selector de densidad de grilla dice 2 y 4 cuando entrega 1 y 2

```text
ID: CLAUDE-CHANGE-002
Autor: Claude
Reportado por: Johandry, mirando la tienda en vivo
Segundo de dos cambios del mismo lote. El primero es CLAUDE-CHANGE-001
Archivos afectados: 3. Cero cambios en JavaScript
Fecha: 2026-09-13
```

## El diagnóstico, que no es el que parecía

Johandry reportó que en móvil los botones muestran 2 y 4 columnas cuando la pantalla solo da para 1 y 2. Fui a verificar y **el layout ya está correcto**. Lo que está mal son los controles.

Mapa real, verificado línea por línea en `base.css`:

| Breakpoint | Botón `data-grid-view="2"` | Botón `data-grid-view="4"` |
| --- | --- | --- |
| Base, móvil | **1 columna** (`base.css:3898`) | **2 columnas** (`base.css:3902`) |
| ≥ 48rem, tablet | 2 columnas (`3977`) | 3 columnas (`3981`) |
| ≥ 62rem, escritorio | 2 columnas (`4033`) | 4 columnas (`4037`) |

O sea que en un teléfono el botón cuyo `aria-label` dice **"Show four products per row"** entrega dos, y el que dice "Compact grid view" con dos barras en el icono entrega una. El comportamiento es correcto y la interfaz miente.

Para un usuario con lector de pantalla en un teléfono eso no es un detalle estético: oye "mostrar cuatro productos por fila", lo presiona y recibe dos. Y el icono es un diagrama literal de columnas, cuatro barras verticales, así que también miente visualmente.

**Un detalle que confirma que esto estaba previsto y se quedó a medias.** `locales/en.default.json` ya tiene tres claves escritas que nadie usa: `one_column`, `two_columns` y `four_columns`, con los textos "Show one product per row", "Show two products per row" y "Show four products per row". Alguien escribió exactamente las etiquetas que hacían falta y el markup nunca las consumió. Las marqué como claves huérfanas en la auditoría sin saber para qué eran. Este cambio las usa.

## La decisión de diseño, y su aritmética

Hay tres regímenes de columnas y dos botones. Para que las etiquetas puedan ser exactas hay que reducirlo a dos regímenes, y la forma correcta es **igualar tablet con escritorio**: el botón denso pasa de 3 a 4 columnas en tablet.

La justificación es el ancho físico de la tarjeta, no el gusto:

- **Teléfono de 375px.** `.container` es `100% - (20px × 2)` = 335px. El gap de columna es `--space-2`, 12px. Dos columnas dan **(335 − 12) / 2 = 161,5px** por tarjeta.
- **Tablet de 768px.** El contenedor da 728px. El gap de columna es `--space-3`, 16px. Cuatro columnas dan **(728 − 48) / 4 = 170px** por tarjeta.

Una tarjeta a cuatro por fila en tablet mide 170px. Una a dos por fila en un teléfono mide 161,5px. **Son físicamente la misma tarjeta.** Si dos por fila es aceptable en un teléfono, cuatro por fila es aceptable en un tablet, porque el producto se ve exactamente igual de grande. Eso deja dos regímenes, 1 y 2 en móvil, 2 y 4 arriba, que es literalmente lo que pediste, y permite que el control diga la verdad.

---

## Edit 1 de 3: `sections/main-collection.liquid`

Los dos botones cambian `aria-label` por dos etiquetas ocultas, una por régimen. El nombre accesible sale de la que esté visible para la tecnología asistiva, porque la otra queda en `display: none` y eso la excluye del árbol de accesibilidad. Un `aria-label` no se puede cambiar con CSS; esto sí.

**Buscar** (líneas 194 a 215 de la versión actual):

```liquid
                <button
                  class="collection-grid-switcher__button"
                  type="button"
                  data-grid-view="2"
                  aria-label="{{ 'collections.grid.view_compact' | t }}"
                  aria-pressed="{% if default_grid_columns == '2' %}true{% else %}false{% endif %}"
                >
                  <span class="collection-grid-switcher__icon collection-grid-switcher__icon--two" aria-hidden="true">
                    <i></i><i></i>
                  </span>
                </button>
                <button
                  class="collection-grid-switcher__button"
                  type="button"
                  data-grid-view="4"
                  aria-label="{{ 'collections.grid.view_dense' | t }}"
                  aria-pressed="{% if default_grid_columns == '4' %}true{% else %}false{% endif %}"
                >
                  <span class="collection-grid-switcher__icon collection-grid-switcher__icon--four" aria-hidden="true">
                    <i></i><i></i><i></i><i></i>
                  </span>
                </button>
```

**Reemplazar por:**

```liquid
                <button
                  class="collection-grid-switcher__button"
                  type="button"
                  data-grid-view="2"
                  aria-pressed="{% if default_grid_columns == '2' %}true{% else %}false{% endif %}"
                >
                  <span class="collection-grid-switcher__icon collection-grid-switcher__icon--two" aria-hidden="true">
                    <i></i><i></i>
                  </span>
                  <span class="visually-hidden collection-grid-switcher__label--small">
                    {{- 'collections.grid.one_column' | t -}}
                  </span>
                  <span class="visually-hidden collection-grid-switcher__label--wide">
                    {{- 'collections.grid.two_columns' | t -}}
                  </span>
                </button>
                <button
                  class="collection-grid-switcher__button"
                  type="button"
                  data-grid-view="4"
                  aria-pressed="{% if default_grid_columns == '4' %}true{% else %}false{% endif %}"
                >
                  <span class="collection-grid-switcher__icon collection-grid-switcher__icon--four" aria-hidden="true">
                    <i></i><i></i><i></i><i></i>
                  </span>
                  <span class="visually-hidden collection-grid-switcher__label--small">
                    {{- 'collections.grid.two_columns' | t -}}
                  </span>
                  <span class="visually-hidden collection-grid-switcher__label--wide">
                    {{- 'collections.grid.four_columns' | t -}}
                  </span>
                </button>
```

Nota de layout: el botón es `display: grid` con `place-items: center`, así que agregar hijos podría crear filas nuevas. No pasa: `.visually-hidden` es `position: absolute !important` (`base.css:261`), o sea que los dos spans salen del flujo del grid y el botón sigue midiendo exactamente 44 por 44.

Nota de que `two_columns` aparece dos veces a propósito: en móvil es lo que entrega el botón denso, y en escritorio es lo que entrega el botón amplio. La misma etiqueta describe bien los dos casos.

---

## Edit 2 de 3: `assets/base.css`

### 2a. Iconos y etiquetas por régimen

Agregar justo después de la regla `.collection-grid-switcher__icon i` (que termina en la línea 3896).

```css
/* Mobile renders 1 and 2 columns, so the icons show 1 and 2 bars. */
.collection-grid-switcher__icon--two i:nth-child(n + 2),
.collection-grid-switcher__icon--four i:nth-child(n + 3) {
  display: none;
}

.collection-grid-switcher__label--wide {
  display: none;
}
```

Y **dentro del bloque `@media (min-width: 48rem)` existente**, junto a las reglas de `.product-grid[data-grid-columns]` de la línea 3977:

```css
  .collection-grid-switcher__icon--two i:nth-child(n + 2),
  .collection-grid-switcher__icon--four i:nth-child(n + 3) {
    display: block;
  }

  .collection-grid-switcher__label--small {
    display: none;
  }

  .collection-grid-switcher__label--wide {
    display: block;
  }
```

Los iconos son barras verticales en `grid-auto-flow: column`, o sea un diagrama literal de columnas. Ocultar barras con `display: none` las saca del grid y las restantes se reparten el ancho, así que una barra llena el cuadro y dos lo dividen. El diagrama queda correcto sin tocar el markup.

### 2b. Tablet pasa de 3 a 4 columnas

**Buscar** en el bloque `@media (min-width: 48rem)`, línea 3981:

```css
  .product-grid[data-grid-columns='4'] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
```

**Reemplazar por:**

```css
  .product-grid[data-grid-columns='4'] {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
```

### 2c. El `gap-inline` que nunca se aplicó

Esto es el hallazgo P1-41 de la auditoría y está dentro de la misma regla que estoy tocando, así que va aquí.

**Buscar** en el bloque `@media (min-width: 48rem)`, línea 3248:

```css
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap-inline: var(--space-3);
  }
```

**Reemplazar por:**

```css
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: var(--space-3);
  }
```

`gap-inline` no existe como propiedad CSS, así que el parser la descarta en silencio y el gap de columna en tablet sigue siendo el de móvil, 12px. La intención era `column-gap`. Va en este cambio porque con cuatro columnas en lugar de tres el gap deja de ser un detalle: es la diferencia entre 173px y 170px de tarjeta.

### 2d. El tile de promoción en tablet, consecuencia de 2b

`base.css:3906` hace que el tile editorial ocupe todo el ancho cuando la grilla está en modo denso, y `base.css:4041` lo revierte a una sola celda en escritorio. En tablet sigue ocupando todo. Con tres columnas eso era un banner ancho; con cuatro es un banner de 728px que aplasta la grilla.

**Agregar** al bloque `@media (min-width: 48rem)`, junto a 2b:

```css
  .product-grid[data-grid-columns='4'] .product-grid__item--promotion {
    grid-column: auto;
  }
```

Con eso tablet se comporta como escritorio y la regla de la línea 4041 queda redundante pero inofensiva. Lo marco aparte porque es una decisión de diseño derivada de 2b y no un arreglo: si prefieres que el tile siga a ancho completo en tablet, se omite este bloque.

---

## Edit 3 de 3: `locales/en.default.json`

Dentro de `collections.grid`, **eliminar** las dos claves que quedan huérfanas con este cambio:

```json
"view_compact": "Compact grid view",
"view_dense": "Dense grid view",
```

Las tres que se quedan, `one_column`, `two_columns` y `four_columns`, ya existen con el texto correcto y ahora sí se usan. No hay que escribir ni una línea nueva de copy.

Opcional, un `info` para el setting del comerciante en `locales/en.default.schema.json`, dentro de `sections.main_collection.settings.default_grid_columns`:

```json
"info": "Sets the desktop default. On phones the two options render one and two products per row.",
```

Sin eso, un comerciante que elija "Four per row" y luego mire su tienda en el teléfono va a pensar que el setting no funciona.

---

## Cero cambios en `assets/theme.js`

Y esto es lo mejor del arreglo. `setGridView` valida contra `['2', '4']` (`theme.js:1662`), escribe ese valor en `data-grid-columns` del contenedor, sincroniza `aria-pressed` y lo guarda en `localStorage`. **Nada de eso cambia**, porque los valores de estado siguen siendo 2 y 4; lo único que cambia es cómo se presentan y a cuántas columnas se traducen por breakpoint.

Sin listener de `resize`, sin ramas por viewport, sin duplicar estado. La preferencia que el cliente guardó en `localStorage` sigue siendo válida y coherente en los dos regímenes.

---

## Qué verificar en la tienda de desarrollo

1. Colección `qa-all` en un teléfono de 375px. Presionar el primer botón: **una** columna, y el icono muestra **una** barra. Presionar el segundo: **dos** columnas, **dos** barras.
2. La misma colección en tablet a 768px. Primer botón: dos columnas, dos barras. Segundo: **cuatro** columnas, cuatro barras. Medir una tarjeta, debería andar por 170px.
3. En escritorio a 1280px, sin cambios respecto a hoy.
4. Con VoiceOver o TalkBack en el teléfono, enfocar los dos botones y confirmar que se anuncian como "Show one product per row" y "Show two products per row", **no** como cuatro.
5. Elegir denso en escritorio, recargar en el teléfono, y confirmar que `localStorage` mantiene la preferencia y que en móvil se traduce a dos columnas.
6. Con dos tiles de promoción en la colección, revisar tablet: cada tile debería ocupar una celda y no la fila completa.
7. Sin JavaScript, los botones no hacen nada. Eso sigue siendo el hallazgo **P1-22** y este cambio no lo toca: falta una regla `.no-js` que oculte el switcher, como ya existe para el header, el lookbook y el pickup.

## Lo que este cambio no arregla, para que quede en el ledger

**P1-22 sigue abierto.** El switcher es JS-only y no hay `<noscript>` ni regla `.no-js` que lo oculte, así que sin JavaScript quedan dos botones con `aria-pressed` que nunca cambia. Es una línea de CSS y no la meto aquí porque es un hallazgo independiente con su propia fila; que se arregle junto a este cambio o aparte es decisión de Gemini.

## Nota de protocolo

Igual que el cambio anterior: bloques listos para pegar, sin escribir sobre los archivos, para mantener el modo READ-ONLY y la compuerta de revisión. Este es el segundo de dos cambios del mismo lote, así que conviene que Gemini los encargue juntos: entre los dos tocan `main-collection.liquid`, `main-product.liquid`, `theme.js`, `base.css` y los dos archivos de locales, y hacer una sola pasada de Theme Check para ambos.
