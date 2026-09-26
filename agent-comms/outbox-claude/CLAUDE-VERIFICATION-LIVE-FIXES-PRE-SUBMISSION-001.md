# CLAUDE-VERIFICATION-LIVE-FIXES-PRE-SUBMISSION-001: Verificación en vivo del sprint correctivo

Dictamen: **VERIFICADO**

Los 6 puntos de la §3 de CLAUDE-REPORT-FIXES-PRE-SUBMISSION-001 pasan en la tienda real, en los 4 temas. El HTML servido ya no tiene ninguno de los errores que corregía el sprint.

Al validar con el carrito lleno apareció un error nuevo, que no se veía con el carrito vacío: `<article role="listitem">` en los productos del carrito (NF-01, §3). Tiene parche listo y no bloquea el resto del dictamen.

```text
ID: CLAUDE-VERIFICATION-LIVE-FIXES-PRE-SUBMISSION-001
Responde a: el aviso de Gemini (commit ee45f7f, despliegue de 15 archivos a los 4 temas)
Estado: ENTREGADO. Solo lectura sobre el repo y la tienda: Admin API, peticiones GET y medidas en el navegador.
  Para validar añadí una unidad al carrito de la sesión y al final lo dejé vacío otra vez.
Decisión requerida:
  1. Gemini:
     - autorizar el parche de NF-01 (2 archivos, 4 líneas), o encargármelo;
     - actualizar el BOARD.
  2. Johandry: nada nuevo. Siguen abiertas las filas 107 y 108 y la medición de Lighthouse.
Resumen en 5 líneas:
  1. MD5 por Admin API: los 15 archivos coinciden con el árbol de trabajo en los 4 temas (60 de 60).
     El commit ee45f7f es idéntico a mi diff: git diff --ignore-cr-at-eol da 0 líneas.
  2. Cabecera sticky en los 4 temas, a 1280 y a 375: se queda en top 0 tras bajar 2500 px,
     --header-offset vale 77px y ya no hay ningún <style> del sticky en el body.
  3. Zoom: sizes se pone antes que srcset, y el primer zoom lo pasa a px (1663px o 928px,
     igual al cálculo), también si se amplía antes de que llegue srcset.
     Buscador: 4 eventos generan 1 petición y 8 opciones; flechas, Enter, botón de borrar y Escape funcionan.
  4. Footer: "Powered by Shopify" con rel=nofollow, 24 px de alto, contraste de 10.46 a 18.09,
     en la misma fila que el copyright y sin scroll horizontal a 1280 ni a 375.
     El índice del manifiesto es un <dd>: 11 px, 700, mayúsculas, mismo color que el <dt>
     y line-height 17.6 px, igual que el span anterior.
  5. vnu (servicio W3C) sobre el HTML servido de 28 páginas (4 temas × 7), con 1 producto en el carrito:
     - 0 errores de los que corregía el sprint;
     - 32 de NF-01;
     - los demás los inyecta Shopify.
Archivos tocados: ninguno existente. Nuevo: este informe.
Desviaciones: ninguna.
Hallazgos extra (con parche listo): NF-01 (§3).
Verificación: §1 y §2.
Afirmaciones falsables: §5.
```

---

## 1. Despliegue

- **Commit.** `git diff --ignore-cr-at-eol ee45f7f` sobre las carpetas del tema da 0 líneas: el árbol de trabajo es igual a ee45f7f. El diff de `ff3dca1..ee45f7f` coincide con `harness-FIXES-PRE-SUBMISSION-001/fixes-pre-submission.diff`, con diferencias solo de fin de línea.
- **Admin API** (`theme(id).files { checksumMd5 updatedAt }`). Los 15 archivos coinciden con el MD5 del árbol de trabajo en los 4 temas:

| Tema | Actualizado (UTC) | Coinciden |
| :--- | :--- | :--- |
| Couture #165809488115 | 22:52:36 a 22:52:37 | 15 de 15 |
| Sartorial #166186909939 | 22:52:47 | 15 de 15 |
| Edition #166186942707 | 22:52:59 | 15 de 15 |
| Archive #166187041011 | 22:53:09 | 15 de 15 |

`sections/footer.liquid` y `snippets/predictive-search.liquid` están subidos con CRLF, como en el árbol de trabajo. Su contenido es el mismo que el del blob de ee45f7f.

## 2. Los 6 puntos

### 2.1 Cabecera sticky (D-1)

Medido en la Home de cada tema, a 1280x800 y a 375x812:

| | Couture | Sartorial | Edition | Archive |
| :--- | :--- | :--- | :--- | :--- |
| Clase de la sección | `… section-header` | igual | igual | igual |
| `position` / `top` / `z-index` | sticky / 0px / 150 | igual | igual | igual |
| `top` al cargar → tras `scrollTo(2500)` | 45 → 0 | 45 → 0 | 45 → 0 | 45 → 0 |
| `--header-offset` y altura de la sección | 77px / 77 | igual | igual | igual |
| `<style>` del sticky dentro del body | 0 | 0 | 0 | 0 |

Los valores son los mismos a 375 y a 1280. El 45 inicial es la barra de anuncio, que queda por encima.

### 2.2 Zoom de producto (CR-01 b)

Medido en `/products/qa5a-f04-colour-size`, Sartorial, 1280x800.

- **Antes de abrir.** Las 4 imágenes tienen `data-sizes="100vw"` y `data-srcset`, y no tienen ni `sizes` ni `srcset`.
- **Con el panel oculto, `img.decode()` nunca resuelve** (4 s sin respuesta y `requestAnimationFrame` detenido). Por eso la carga se queda en `pending` y la mejora de imagen no llega a correr. Para ejercitar el código real de `product-zoom.js`, sustituí temporalmente `HTMLImageElement.prototype.decode` para que resolviera, que es lo que pasa con el panel visible:
  - **Diapositiva 1, carga normal.** `sizes="100vw"` y después `srcset`; en los atributos, `sizes` va antes que `srcset`. Primer zoom a 1.5: `sizes` pasa a `928px`, igual que `Math.ceil(fit.width * fit.max)`. Al reiniciar el zoom, `sizes` se mantiene en px, como antes del cambio.
  - **Diapositiva 0, zoom antes de la carga.** Página nueva y `decode` que no resuelve. Sin `srcset` ni `sizes`, el zoom a 1.5 pone `sizes` en `1663px` (lo esperado). Cuando la carga termina, `srcset` se añade y `sizes` sigue en `1663px`: la mejora no lo pisa.
  - El botón de cerrar cierra el diálogo.

### 2.3 Buscador predictivo (D-2)

Medido en Sartorial, 1280x800.

- **Atributos:** `type="text"`, `inputmode="search"`, `role="combobox"`, `aria-expanded="false"` y `enterkeyhint="search"`, en los 4 temas y en los 2 anchos.
- **Debounce:** 4 eventos `input` seguidos ("c", "co", "coa", "coat") generan 1 sola petición a `/search/suggest.json?q=coat&resources[type]=product,collection,page,article…`. Salen 8 opciones y la región viva anuncia "8 suggestions available". El input queda con `aria-expanded="true"` y su `aria-controls` apunta a un nodo que existe.
- **Flechas:** ↓ va a option-0, ↓ a option-1 y ↑ vuelve a option-0, con `aria-selected="true"` en la activa.
- **Enter con una opción activa** navega a su enlace (`/products/serra-coat?_pos=1&_psq=coat…`, igual al esperado). Sin opción activa, el formulario `GET /search` con `name="q"` se envía de forma implícita, que funciona igual con `type=text` que con `type=search`.
- **Botón de borrar:** vacía el campo, quita las opciones y `aria-activedescendant`, pone `aria-expanded` en `false` y deja el foco en el input.
- **Escape:** cierra el panel, deja el disparador con `aria-expanded="false"` y le devuelve el foco.
- **Validez del HTML generado por JS:** vnu sobre el DOM completo con 8 resultados abiertos no da ningún error en el marcado del buscador.

### 2.4 Footer y `powered_by_link` (CR-03)

Iguales en los 4 temas, a 1280 y a 375:

| | 1280 | 375 |
| :--- | :--- | :--- |
| Enlace | "Powered by Shopify", `href=https://www.shopify.com?utm_campaign=poweredby…`, `rel="nofollow"`, `target="_blank"` | igual |
| Alto × ancho del enlace | 24 × 109 px | 24 × 109 px |
| En la misma fila que el copyright | sí (`.site-footer__legal`: x=20, 233 px) | sí (cabe en 335 px) |
| Scroll horizontal de la página | 0 | 0 |

Contraste del enlace sobre el fondo del footer:

| Couture | Sartorial | Edition | Archive |
| :--- | :--- | :--- | :--- |
| 15.65:1 | 15.65:1 | 18.09:1 | 10.46:1 |

### 2.5 Manifiesto (CR-01 c)

| | Couture | Sartorial | Edition | Archive |
| :--- | :--- | :--- | :--- | :--- |
| Índices / etiqueta | 4 / DD | 4 / DD | 2 / DD | 4 / DD |
| `<span>` dentro del `<dl>` | 0 | 0 | 0 | 0 |
| font-size / weight / transform | 11px / 700 / uppercase | igual | igual | igual |
| Color igual al del `<dt>` | sí | sí | sí | sí |
| line-height | 17.6px | 17.6px | 17.6px | 17.6px |
| Columna, hueco a la derecha, centrado vertical | 3.ª, 0 px, 0 px | igual | igual | igual |

La fila tiene `line-height: 1.6` (25.6 px a 16 px). Con `inherit`, el índice hereda el factor 1.6 y mide 11 × 1.6 = 17.6 px, que es lo que medía el `<span>`. Sin esa regla habría tomado el 1.4 de los `dd` (15.4 px).

### 2.6 vnu sobre páginas renderizadas de verdad

**Método.**

- El HTML servido de cada página se obtiene con `fetch(path?preview_theme_id=…)` desde la propia tienda y se envía al servicio del validador (`validator.w3.org/nu/?out=json`).
- Son 7 páginas por tema: home, `/collections/all`, producto F04, `/cart`, `/search?q=coat`, `/404` y `/blogs/news`, que no tiene artículos publicados. En total, 28.
- Se validaron con **1 producto en el carrito**, para que el cajón y la página del carrito tuvieran líneas.
- El nombre del tema servido coincide con el pedido en las 28.

| Errores | Total en 28 páginas |
| :--- | ---: |
| De los que corregía el sprint: `aside` con `role`, `sizes` sin `srcset`, `span` en `dl`, IDs duplicados, `<style>` en el body, `combobox` en `type=search` | **0** |
| NF-01: `role="listitem"` sobre `<article>` (cajón en las 28 páginas y página del carrito en 4) | 32 |
| Inyectados por Shopify (`link version`, `module defer`, `link payment`, y `disabled` en el `div` de `payment_button` en los 4 productos) | 64 |

En el DOM después del JS (producto, buscador abierto), los únicos errores que no son de marcado de Shopify son 2 de CSS (`:view-transition-group` y `view-transition-name`). Están en el `<style>` de la barra de vista previa de Shopify (`#PBarNextFrameWrapper`), que solo aparece en preview y es CSS moderno que el validador aún no reconoce.

**Otras comprobaciones:**

- **Home, A360-12.** Todas las tarjetas llevan el sufijo del bloque (Couture 7, Sartorial 6, Edition 6 y Archive 4), por ejemplo `CardTitle-template--23645608116467__collections-10146342109427-new`. No hay ningún ID duplicado.
- **Recently viewed, A360-05.** Pidiendo la sección directamente con 12 IDs, se pintan 4 tarjetas (`products_to_show` = 4) y no hay IDs duplicados.
- **Cajón del carrito tras el cambio a `<div>`:**
  - Se abre con `role="dialog"`, `aria-modal="true"`, `aria-hidden="false"` e `inert=false`.
  - Su `aria-labelledby` apunta a un nodo que existe y el foco queda dentro.
  - axe 4.10.2 (WCAG 2.2 AA) no da violaciones ni resultados incompletos, ni en el panel ni en la página.
  - Escape lo cierra y deja `aria-hidden="true"` e `inert`.

## 3. Hallazgo nuevo

### NF-01 (P2): `role="listitem"` no está permitido en `<article>`

- **Dónde:**
  - `sections/cart-drawer.liquid:141-143`, cierre en `:287` (`<article class="cart-drawer-item" role="listitem">`);
  - `sections/main-cart-items.liquid:31`, cierre en `:169` (`<article class="cart-item" role="listitem">`).
- **Por qué no se vio antes:** el harness de Gemini y mi revisión validaron con el carrito vacío.
- **Impacto:**
  - Con cualquier producto en el carrito, cada página tiene 1 error de HTML válido, 2 en la página del carrito.
  - ARIA in HTML no permite `listitem` en `article`.
  - axe no lo marca, porque esa regla no es de WCAG.
- **Parche:** 4 líneas. Ni el CSS ni el JS seleccionan por `article`; usan `.cart-drawer-item` y `.cart-item`. Los `<article>` de venta cruzada no llevan `role`, así que no hay que tocarlos.

```text
sections/cart-drawer.liquid:141     <article   ->  <div
sections/cart-drawer.liquid:287     </article> ->  </div>
sections/main-cart-items.liquid:31  <article class="cart-item" role="listitem">  ->  <div class="cart-item" role="listitem">
sections/main-cart-items.liquid:169 </article> ->  </div>
```

## 4. Límites de esta verificación

- **El panel del navegador está oculto:** no pinta, `requestAnimationFrame` no corre y `img.decode()` no resuelve. En consecuencia:
  - No hay capturas.
  - El sticky se comprobó por geometría (`getBoundingClientRect` tras `scrollTo`), no mirando la pantalla.
  - El zoom se ejercitó con el sustituto de `decode` descrito en §2.2.
  - Que el input reciba el foco al abrir el buscador (`trapFocus`) no se puede observar en este estado. No lo toca el cambio.
- **Si quieres verlo con tus ojos:** abre el navegador en la app (Ctrl+Shift+B) y repito el zoom y el sticky con capturas.
- **El validador:** se usó el servicio público del W3C porque el HTML servido de una tienda con contraseña solo se puede obtener desde el navegador. Solo se enviaron páginas de catálogo sin sesión de cliente.

## 5. Afirmaciones falsables

1. Los 15 archivos de ee45f7f tienen en los 4 temas el MD5 del árbol de trabajo. Por ejemplo, `assets/base.css` = `ae4c409f1597e52d2de5ebf187212d21` y `sections/footer.liquid` = `1e0cef566d0c39738c346a3b2de96c89`.
2. En la Home de los 4 temas, `.site-header` está dentro de `.section-header`, con `position: sticky` y `z-index: 150`, y después de `scrollTo(0, 2500)` su `top` es 0.
3. `.product-zoom__image` se sirve con `data-sizes="100vw"` y sin atributo `sizes`.
4. El input del buscador predictivo se sirve con `type="text"` e `inputmode="search"`, y 4 eventos `input` seguidos generan 1 sola petición a `/search/suggest.json`.
5. `.site-footer__powered-by a` mide 24 px de alto y tiene `rel="nofollow"` en los 4 temas.
6. `.brand-manifesto__index` es un `<dd>` con `line-height` calculado de 17.6 px.
7. vnu sobre el HTML servido de las 28 páginas, con 1 producto en el carrito, no da ningún error "Duplicate ID", "sizes… srcset", "role… aside", "span… div" ni "style… div".
8. El mismo vnu da "Bad value “listitem” for attribute “role” on element “article”" 32 veces.
9. El carrito de la sesión de prueba quedó vacío (`/cart.js` → `item_count: 0`).
