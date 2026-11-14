```text
ID: REVIEW-POLISH-20261114-001
Estado: revisión adversarial independiente, solo lectura (lote-e-claude @ f81774e + árbol sin commitear). Sin Shopify, sin tienda, sin commit/push, sin editar código.
Decisión requerida: aplicar 2 cambios mínimos (C1, C2) antes del commit. Veredicto: COMMITEAR CON CAMBIOS.
Resumen en 5 líneas:
  1. El guard nuevo de la rejilla (main-collection.liquid:310) no rompe AJAX, contador, Clear all ni paginado; el tema no tiene infinite scroll.
  2. Liquid equilibrado (if/endif 33/33, for 7/7), Theme Check 0 ofensas en 94 archivos, las 5 gates locales y node --check salen con exit 0.
  3. Contrastes recalculados: coinciden con los del agente (placeholder 5.10 y borde 4.24 en scheme-4).
  4. La regla de borde del newsletter (base.css:7338-7340) añade un literal 70 % que duplica el token --color-control-border (60 %). Ese token ya se aplica al input (base.css:944) y da ≥3.36:1 en los 5 esquemas, así que la regla sobra: compuerta 3.
  5. El vacío de colección fija la fuente heading a 1.5rem sin --font-heading-scale: el ajuste "Heading scale" no le llega. El overflow-wrap del título es redundante: lo hereda del body.
Archivos tocados: solo este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna.
Hallazgos extra fuera de alcance (con parche listo): H1 placeholders de otros 8 campos; H2 selector de rejilla visible con 0 resultados (ver final).
Verificación (comando, resultado y qué demuestra/qué no): ver §B. No demuestra el render real: compuerta 5 no verificada.
Lista de afirmaciones falsables numeradas: §A–§E.
```

## Cambios mínimos exigidos

**C1. Newsletter: quitar el borde con literal (compuerta 3).** En assets/base.css:7336-7340 sustituir

```css
/* Contraste en cualquier esquema (WCAG 1.4.3 / 1.4.11): el placeholder por defecto del
   navegador no sigue el esquema; borde derivado del texto del esquema, sin colores fijos. */
.newsletter-section .newsletter-form__field input {
  border-color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-background));
}

```
por
```css
/* Contraste en cualquier esquema (WCAG 1.4.3): el placeholder por defecto del navegador
   (#757575) no sigue el esquema y baja a 2.12:1 en scheme-4. El borde ya sale de
   --color-control-border (regla global de input), que da >=3.36:1 en los 5 esquemas. */
```
Si se quiere un borde más fuerte por diseño, hace falta un token nuevo junto a base.css:111, no un 70 % suelto. Esa decisión no es de esta entrega.

**C2. Vacío de colección: respetar Heading scale.** En assets/base.css:6626 sustituir `font-size: 1.5rem;` por `font-size: calc(1.5rem * var(--font-heading-scale));`. Es el mismo patrón que base.css:1361 y que explica el comentario de base.css:885.

Opcional, sin cambio de comportamiento: borrar `overflow-wrap: anywhere;` de base.css:1359, porque ya llega por herencia desde `body` (base.css:131) y ni `h1` (base.css:218-232) ni `.product-main__title` lo reinician.

## A. Regresiones del cambio (1): cumplido (código completo)

1. Con filtros activos y 0 resultados: FacetFiltersForm.renderUrl sustituye todo el `innerHTML` por el de la sección re-renderizada con `section_id` (theme.js:4196-4222). No depende de que exista `<ul>`.
2. `setGridView` sale sin hacer nada si no hay `[data-product-list]` (theme.js:4283-4284), igual que antes con 0 productos y 0 bloques.
3. `setBusy` usa `[data-product-grid]` (theme.js:4249), que vive en el contenedor exterior (main-collection.liquid:240), fuera del guard.
4. El contador `[data-results-status]` (main-collection.liquid:250) queda fuera del guard y `announceResultCount` lo sigue leyendo.
5. Clear all `[data-facet-clear-all]` (main-collection.liquid:411 y la barra de filtros) se sigue interceptando (theme.js:4160-4165).
6. El paginado (main-collection.liquid:421-445) está fuera del guard. En una página fuera de rango sale el estado vacío "no_products".
7. Infinite scroll: no existe en el tema. `grep -n "infinite\|load-more" assets/theme.js` sale vacío y los IntersectionObserver son de otros componentes.
8. Con 1 producto: `promotion_append_position` vale 2 y los tiles con posición ≥2 caen en el hueco 2. Nada cambia porque el guard es verdadero.
9. Con 0 productos y bloques promo, antes salían los tiles y el texto "No products match / This collection is empty" a la vez, también en storefront con filtros a 0. Ese es el defecto visual que se corrigió.
10. Ahora el editor no previsualiza los tiles en una colección vacía. Lo considero **aceptable** y desaconsejo `request.design_mode`: devolvería en el editor la misma mezcla tile + "vacío" que se quería eliminar, y la vista previa dejaría de coincidir con el storefront. El texto de ayuda ya avisa de la dependencia con los productos (`en.default.schema.json` → promotion_tile.position_in_grid.info). Si Gemini lo quiere igualmente, el cambio mínimo es `{%- if collection.products.size > 0 or request.design_mode and section.blocks.size > 0 -%}`. Liquid evalúa de derecha a izquierda, así que se lee como `a or (b and c)`.

## B. Sintaxis y gates: cumplido

- Balance de etiquetas con un script node sobre el archivo: `{ if: 33, endif: 33, for: 7, endfor: 7, unless: 1, endunless: 1, paginate: 1, endpaginate: 1 }`. Dentro de los `liquid`: `if 7/7`, `for 1/1`.
- `node_modules/.bin/shopify theme check` → "94 files inspected with no offenses found."
- `npm run -s gates:{json,hooks,sanity,locales,ledger}` → exit=0 las cinco. `node --check assets/theme.js` → OK.

## C. CSS

1. Especificidad: `.newsletter-section .newsletter-form__field input` es (0,2,1) y le gana a `input:not([type='checkbox'],[type='radio'])` (0,1,1, base.css:938-944). Los `:focus-visible` por estilo (base.css:9319-9384) solo tocan `outline`, así que no hay conflicto. **Cumplido.**
2. Otros newsletters:
   - footer.liquid:52-66 tiene su propia regla (base.css:7275, `color: inherit`): ya estaba resuelto.
   - password usa `.password-newsletter` y no tiene placeholder.
   - main-article, main-contact y gift-card-recipient tienen inputs email sin placeholder.
   - Ningún newsletter queda sin arreglar. **Cumplido.**
3. `color-mix(in srgb, …)`: el CSS ya lo usaba en 39 sitios y los tokens derivados dependen de él (base.css:105-111), sin fallback en ninguna parte. El cambio no añade riesgo de soporte (Chrome 111, Safari 16.2, Firefox 113). **Cumplido.**
4. `overflow-wrap: anywhere`: ya está en `body` (base.css:131) y en otros 9 sitios. Soporte en Safari desde 15.4. Es redundante (ver la opción opcional arriba).
5. Literales:
   - 70 %: **ausente como token** → C1.
   - 1.5rem: no hay escala tipográfica en tokens, y 1.5rem ya se repite 8 veces. Falta multiplicarlo por la escala de headings → C2.
   - 1.3 y 1.2: no existen tokens de line-height, y ambos valores ya se repiten (1.2 más de 15 veces, 1.3 en 3 sitios). Aceptable.
   - `--space-3xl` y `--space-lg`: tokens existentes, correcto.

## D. Contrastes (script propio en el scratchpad: contrast.mjs, mezcla sRGB y luminancia WCAG 2.x)

`--color-foreground-muted` = `color-mix(in srgb, fg 78%, bg)` (base.css:107), calculado sobre el elemento `.color-scheme-N` de la sección. Es un color sólido derivado, sin opacidad. Por eso `opacity: 1` en `::placeholder` es correcto: neutraliza el 0.54 de Firefox.

| Esquema | Texto | Placeholder (muted 78 %) | Borde 70 % (agente) | Borde token 60 % (actual global) | Placeholder UA #757575 (antes) |
|---|---|---|---|---|---|
| scheme-1 #F7F3EA | 15.52 | #4d4b46 7.91 | 6.04 | 4.37 | 4.16 |
| scheme-2 #1D1B18 | 15.65 | #c8c4bd 9.90 | 8.21 | 6.37 | 3.73 |
| scheme-3 #EDE7DA (newsletter de index.json:235) | 13.95 | #4b4843 7.41 | 5.73 | 4.21 | 3.74 |
| scheme-4 #D8A85D | 7.92 | #463a27 **5.10** | **4.24** | 3.36 | 2.12 |
| scheme-5 #FBF9F4 | 14.28 | #58544f 7.10 | 5.48 | 4.04 | 4.38 |

Los valores del agente quedan confirmados. El placeholder nuevo es necesario: el UA daba 2.12 en scheme-4. El borde no lo es: el token ya cumple 1.4.11 (≥3:1) en los 5 esquemas, de ahí C1. No se ha comprobado con gradientes de fondo: los 5 esquemas tienen `background_gradient` vacío.

## E. Estados degenerados (compuerta 2): código completo, no verificado en tienda

- **Vacío:** sale el estado vacío centrado. Con `handle == 'all'` sale solo el texto. Con filtros activos sale el texto y Clear all.
- **Uno solo:** sin cambios (A.8).
- **Muchos:** el paginado no cambia. Una página fuera de rango muestra el vacío "no_products".
- **Muy largo:** el texto del vacío ocupa como mucho 48rem y se parte por herencia. En un título de 120 caracteres, `line-height` 1.2 frente a 1.05 son +5.4 px por línea a 1.68rem; a 28ch salen unas 5 líneas, o sea unos +27 px. Hay que medir de nuevo el criterio AF-09 (precio y botón sobre el pliegue a 1280x800). **No verificado.**
- **Faltante:** el newsletter sin placeholder no se ve afectado. Una colección sin imagen no cambia.

## Hallazgos fuera de alcance

- **H1.** 8 campos con placeholder siguen con el color del UA y bajan de 4.5:1 en esquemas oscuros o cálidos: cart-drawer:318, main-cart-items:183, main-404:23, main-faq:80, main-search:77, main-support:176 y predictive-search:84,139. Parche que cubre todo y haría sobrante la regla nueva: `::placeholder { color: var(--color-foreground-muted); opacity: 1; }` junto a base.css:164. Habría que comprobar que la regla del footer (base.css:7275, `inherit`) mantiene su intención.
- **H2.** Con 0 resultados el selector de rejilla sigue visible (main-collection.liquid:254-306), pero `setGridView` no hace nada sin `<ul>`. Antes pasaba solo sin bloques y ahora también con bloques. Parche: envolver el `<div class="collection-grid-switcher …">` en `{%- if collection.products.size > 0 -%}…{%- endif -%}`.
