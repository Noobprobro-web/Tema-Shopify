# CLAUDE-AUDIT-002: Barrido de controles muertos y enlaces sin destino

```text
ID: CLAUDE-AUDIT-002
Autor: Claude (auditor, modo READ-ONLY)
Disparado por: Johandry, revisando la tienda en vivo
Método: barrido sistemático de los 187 hooks de datos del tema, todos los href,
        todos los fallbacks de URL, y el mecanismo .no-js
Fecha: 2026-09-13
```

---

## 1. "Explore lookbook" tiene dos causas independientes, y hay que arreglar las dos

Arreglar una sola deja el botón roto.

### Causa A, en el código

`sections/hero-editorial.liquid:112-128` y `sections/brand-manifesto.liquid:34-37` condicionan la existencia del botón a la **etiqueta**, no al **destino**, y luego hacen fallback de la URL a la raíz del sitio:

```liquid
{%- if section.settings.button_secondary_label != blank -%}
  <a
    class="button button--secondary hero-editorial__button"
    href="{{ section.settings.button_secondary_url | default: routes.root_url | escape }}"
  >
```

Y los schemas traen la etiqueta con valor por defecto mientras la URL no tiene ninguno:

| Setting | Default en el schema |
| --- | --- |
| `hero-editorial.button_primary_label` | `"Discover the collection"` |
| `hero-editorial.button_primary_url` | **sin default** |
| `hero-editorial.button_secondary_label` | `"Explore lookbook"` |
| `hero-editorial.button_secondary_url` | **sin default** |
| `brand-manifesto.button_label` | `"Read our process"` |
| `brand-manifesto.button_url` | **sin default** |

El resultado es aritmético: etiqueta con default más URL sin default más fallback a la raíz igual a **un botón que siempre se renderiza y siempre lleva al inicio**. No hace falta que el comerciante se equivoque en nada; sale así de fábrica.

### Causa B, en el contenido

`templates/index.json` pone `"/"` de forma explícita en tres lugares. Verificado: la fecha de modificación del archivo es la misma que cuando hice la auditoría original, o sea que nadie lo ha tocado.

```
hero_editorial.button_secondary_url            = "/"
brand_manifesto.button_url                     = "/"
bento_discovery.bento_editorial.link           = "/"
```

El tercero es distinto de los dos primeros y vale distinguirlo: `bento-discovery` **sí** valida bien (`{%- if block.settings.link != blank -%}`), pero `"/"` no está en blanco, así que la validación pasa y el enlace se renderiza. Ahí el código está correcto y el contenido es el problema.

---

## 2. Inventario completo del homepage de fábrica

Seis cosas que un revisor de la Theme Store ve en la primera pantalla y media.

| # | Qué | Dónde | Tipo |
| --- | --- | --- | --- |
| 1 | Botón **"Explore lookbook"** lleva al inicio | hero, secundario | Código y contenido |
| 2 | Botón **"Read our process"** lleva al inicio | brand statement | Código y contenido |
| 3 | Enlace **"Explore the story"** lleva al inicio | bento, tarjeta editorial | Solo contenido |
| 4 | Pestaña **"Permanent collection"** abre un panel sin productos | curated showcase, bloque 2 | Solo contenido |
| 5 | Pestaña **"Objects"** abre un panel sin productos | curated showcase, bloque 3 | Solo contenido |
| 6 | Botón "Discover the collection" lleva a `/collections/all` | hero, primario | Funciona, sin daño |

### Dos correcciones a mi auditoría original

Al verificar en detalle me equivoqué en dos cosas y las corrijo, porque las dos hacen que el trabajo quede mejor de lo que reporté.

**La tarjeta de producto del bento no está vacía.** Dije que quedaba un hueco. `bento-discovery.liquid:134-137` tiene un `placeholder_svg_tag` de respaldo, así que sin producto asignado muestra un marcador elegante, que es exactamente lo que el requisito de Shopify pide para el estado de instalación. Está bien hecho.

**Las pestañas del curated showcase no están muertas, están vacías.** El código tiene una cadena de fallbacks bien pensada: la etiqueta cae a `collection.title` y luego a "Collection 02", el enlace del spotlight cae a `routes.all_products_collection_url`, y la imagen cae de `editorial_image` a la del primer producto a la de la colección. Así que la pestaña se abre, el enlace funciona y la imagen tiene marcador. Lo único que queda vacío es la grilla de productos, porque no hay colección. Es un problema de contenido, no de código.

---

## 3. El patrón, y la sección que ya lo hace perfecto

Esto no es un defecto general del tema. De los seis lugares donde un enlace depende de un setting de URL, **cuatro lo hacen bien**:

| Sección | Validación | Veredicto |
| --- | --- | --- |
| `main-collection:274` | `if block.settings.link_label != blank and block.settings.link_url != blank` | **El modelo. Valida las dos cosas** |
| `bento-discovery:81` | `if block.settings.link != blank` y si no, renderiza un `<div>` en vez de un `<a>` | Correcto |
| `announcement-bar:45` | `if block.settings.link != blank` y si no, un `<span>` | Correcto |
| `main-contact:188` | `if block.settings.link != blank` | Correcto |
| `hero-editorial:112` | valida la etiqueta, fallback de URL a la raíz | **Roto** |
| `brand-manifesto:34` | valida la etiqueta, fallback de URL a la raíz | **Roto** |

El arreglo es copiar el patrón de `main-collection`, que exige etiqueta **y** destino. No hay que inventar nada, ya está escrito en el propio tema.

---

## 4. Los arreglos

### 4a. `sections/hero-editorial.liquid`

**Buscar:**

```liquid
        {%- if section.settings.button_primary_label != blank or section.settings.button_secondary_label != blank -%}
          <div class="hero-editorial__actions">
            {%- if section.settings.button_primary_label != blank -%}
              <a
                class="button hero-editorial__button"
                href="{{ section.settings.button_primary_url | default: routes.all_products_collection_url | escape }}"
              >
                <span>{{ section.settings.button_primary_label | escape }}</span>
                {% render 'icon', name: 'arrow', size: 18 %}
              </a>
            {%- endif -%}
            {%- if section.settings.button_secondary_label != blank -%}
              <a
                class="button button--secondary hero-editorial__button"
                href="{{ section.settings.button_secondary_url | default: routes.root_url | escape }}"
              >
                <span>{{ section.settings.button_secondary_label | escape }}</span>
                {% render 'icon', name: 'arrow', size: 18 %}
              </a>
            {%- endif -%}
          </div>
```

**Reemplazar por:**

```liquid
        {%- liquid
          assign has_primary_button = false
          assign has_secondary_button = false
          if section.settings.button_primary_label != blank and section.settings.button_primary_url != blank
            assign has_primary_button = true
          endif
          if section.settings.button_secondary_label != blank and section.settings.button_secondary_url != blank
            assign has_secondary_button = true
          endif
        -%}
        {%- if has_primary_button or has_secondary_button -%}
          <div class="hero-editorial__actions">
            {%- if has_primary_button -%}
              <a
                class="button hero-editorial__button"
                href="{{ section.settings.button_primary_url | escape }}"
              >
                <span>{{ section.settings.button_primary_label | escape }}</span>
                {% render 'icon', name: 'arrow', size: 18 %}
              </a>
            {%- endif -%}
            {%- if has_secondary_button -%}
              <a
                class="button button--secondary hero-editorial__button"
                href="{{ section.settings.button_secondary_url | escape }}"
              >
                <span>{{ section.settings.button_secondary_label | escape }}</span>
                {% render 'icon', name: 'arrow', size: 18 %}
              </a>
            {%- endif -%}
          </div>
```

### 4b. `sections/brand-manifesto.liquid`

**Buscar:**

```liquid
      {%- if section.settings.button_label != blank -%}
        <a
          class="button button--secondary brand-manifesto__button"
          href="{{ section.settings.button_url | default: routes.root_url }}"
        >
```

**Reemplazar por:**

```liquid
      {%- if section.settings.button_label != blank and section.settings.button_url != blank -%}
        <a
          class="button button--secondary brand-manifesto__button"
          href="{{ section.settings.button_url | escape }}"
        >
```

El `| escape` también es nuevo: esa URL la escribe el comerciante y era una de las que quedaban sin escapar.

### 4c. `templates/index.json`

Tres cambios de contenido. Con 4a y 4b aplicados, **quitar la clave es la forma de que el botón no se renderice**, que es mejor que un botón a ninguna parte.

1. `hero_editorial`: eliminar la clave `"button_secondary_url": "/"`. Y como el label tiene default en el schema, eliminar también `"button_secondary_label"` del template si estuviera, para que el par quede limpio.
2. `brand_manifesto`: eliminar la clave `"button_url": "/"`.
3. `bento_discovery.bento_editorial`: eliminar `"link": "/"`. Con `link` en blanco el bloque renderiza un `<div>` en vez de un `<a>`, que ya está bien resuelto en el código.
4. `curated_showcase`: dejar **un solo bloque** de pestaña, con `"collection": "all"`. Un comerciante recién instalado ve una pestaña que funciona y el botón de agregar bloques. Tres pestañas de las cuales dos están vacías se ve roto; tres apuntando todas a `all` se ve duplicado.

Y en el `index.json` de `/listings/couture` van los valores reales del documento `CLAUDE-DEMO-001`: el secundario del hero a `/collections/the-permanent-collection`, el del brand statement a `/pages/how-we-work`, el del bento a `/blogs/journal/why-we-stopped-lining-coats`, y las tres pestañas con sus colecciones. Para eso existe el mecanismo `/listings`: el estado de instalación es sobrio y la demo está completa.

---

## 5. Tres hallazgos nuevos que salieron del barrido

### 5a. El switcher de densidad se cierra con una sola palabra

El hallazgo **P1-22** decía que el switcher de grilla es JS-only y que sin JavaScript quedan dos botones con un `aria-pressed` que nunca cambia. Buscando el mecanismo encontré que el tema **ya tiene la solución genérica** en `base.css:4425`:

```css
.js .no-js-only,
.no-js .js-only {
  display: none !important;
}
```

Doce controles del tema ya usan `js-only` o `no-js-only`. El switcher no. El arreglo es agregar `js-only` a su clase en `main-collection.liquid:187`:

```liquid
                class="collection-grid-switcher js-only"
```

Una palabra y P1-22 queda cerrado. Va junto al cambio `CLAUDE-CHANGE-002`, que toca ese mismo elemento.

### 5b. La región viva del conteo de resultados se destruye al filtrar

Este es nuevo y toca una fila del ledger que está en verde.

`main-collection.liquid:183` declara el conteo de resultados como región viva:

```liquid
              <p class="collection-products__count" aria-live="polite" data-results-status>
```

Y `theme.js:1625`, al terminar de filtrar, hace esto:

```js
        this.innerHTML = nextElement.innerHTML;
```

Eso reemplaza todo el interior de `<facet-filters-form>`, **incluido el nodo de la región viva**. Los lectores de pantalla siguen las regiones vivas por nodo: si el nodo se sustituye, el contenido nuevo se trata como contenido inicial y no como una actualización, así que **no se anuncia**. Un usuario con lector de pantalla aplica un filtro y no recibe confirmación de cuántos resultados quedaron.

El síntoma que lo delató es el punto 5c: `data-results-status` no lo lee ni el JavaScript ni el CSS. Existe porque alguien pensó que el JS iba a escribir en él, y nadie lo hizo, porque el re-render del servidor parecía suficiente. Para lo visual lo es; para la región viva no.

**Arreglo propuesto:** poner una región viva persistente **fuera** del subárbol que se reemplaza, como hermana de `<facet-filters-form>`, y después de `this.innerHTML = ...` copiarle el texto del conteo nuevo. El `<p>` visible pierde el `aria-live` y queda como texto normal.

**Consecuencia para el ledger:** la fila `Live Regions (aria-live)` está en `cumplido` citando `cart-drawer`, `main-product` y `pickup-availability`, que son correctos. El caso de los facetados no está cubierto por esa evidencia. Sugiero pasarla a `parcial` hasta que se verifique con lector de pantalla, o dividirla en dos filas.

### 5c. Once hooks de datos sin lector

De los 187 hooks `data-*` del markup, 17 no los lee el JavaScript, y de esos, 11 tampoco los usa el CSS:

```
data-cart-form          data-cart-item-key      data-cart-rewards
data-facet-section      data-intent             data-localization-form
data-lookbook-popover   data-price-wrapper      data-product-id
data-recipient-errors   data-results-status
```

La mayoría son identificadores inofensivos y no propongo una cacería. Los anoto por dos razones: uno de ellos reveló 5b, y `data-recipient-errors` merece una mirada porque es el contenedor de errores del destinatario de gift card y conviene confirmar que los errores de validación sí aparecen en alguna parte.

Los otros seis del grupo de 17 **no son código muerto**: `data-shopify-xr`, `data-shopify-model3d-id`, `data-shopify-title` y `data-shopify-xr-hidden` los lee el `shopify-xr.js` de Shopify, y `data-cross-sell-label` y `data-single-announcement` los usa el CSS.

---

## 6. Lo que verifiqué y está bien

Para que el informe no se lea como si todo estuviera roto, esto es lo que el barrido confirmó en orden:

- **Cero `href="#"` y cero `href=""` en todo el tema.** No hay un solo enlace ancla falso, que es el vicio más común de esta clase de bug.
- **Los cinco enlaces sociales del footer** están cada uno dentro de su propia validación de no-blanco. Ninguno se renderiza vacío.
- **`bento-discovery` y `announcement-bar`** degradan correctamente de `<a>` a `<div>` y a `<span>` cuando no hay destino. Es el patrón correcto y es mejor que ocultar el contenido.
- **`main-collection`** valida etiqueta y destino a la vez. Es el modelo del tema.
- **La cadena de fallbacks del curated showcase** está bien pensada en tres niveles para etiqueta, enlace e imagen.
- **El mecanismo genérico `.no-js` existe** y doce controles lo usan. Falta uno.
- **`product-gallery` y `editorial-hero` ya están definidos en `theme.js`**, y el hero tiene `layout_mode` con `split` y `cinematic` más el setting `heading_tag`. O sea que el carrusel de PDP y el hero dual del blueprint aterrizaron, y el hero creció de 5.555 a 14.689 bytes.

---

## 7. Resumen para el ledger

| Hallazgo | Prioridad | Costo |
| --- | --- | --- |
| Hero y brand statement validan la etiqueta en vez del destino | **P1** | Dos bloques de Liquid |
| `index.json` con tres `"/"`, dos pestañas sin colección | **P1** | Contenido, cuatro ediciones de JSON |
| Switcher de grilla sin clase `js-only`, cierra P1-22 | P1 | Una palabra |
| Región viva del conteo destruida por `innerHTML` | P1 | Un elemento nuevo y tres líneas de JS |
| Once hooks de datos sin lector | P2 | Limpieza, opcional |
| Fila `Live Regions` del ledger, de `cumplido` a `parcial` | Registro | Ninguno |

Las dos primeras son las que Johandry vio, y juntas son seis controles en la primera pantalla del homepage. Van antes que todo lo demás, porque es lo primero que abre un revisor.

Igual que los cambios anteriores: bloques listos para pegar, sin escribir sobre los archivos del tema, para mantener el modo READ-ONLY y la compuerta de revisión.
