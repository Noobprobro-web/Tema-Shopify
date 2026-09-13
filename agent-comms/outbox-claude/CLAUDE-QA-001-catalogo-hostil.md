# CLAUDE-QA-001: Catálogo hostil de QA

```text
ID: CLAUDE-QA-001
Autor: Claude
Archivo asociado: qa-catalogo-hostil.csv (18 productos, 54 filas)
Para: tienda de desarrollo. NO importar en una tienda real
Fecha: 2026-09-13
```

## Qué es esto

Un catálogo diseñado para romper el tema, no para venderse. Cada producto existe por una razón concreta y reproduce un hallazgo específico de la auditoría o un caso borde que los revisores de Shopify prueban.

Importar con **Productos > Importar > archivo CSV**. Verificado: se relee correctamente, las comillas dobles del vendor y del tipo sobreviven el viaje de ida y vuelta, y los 18 handles se agrupan bien.

Las imágenes salen de `placehold.co` a propósito. No son bonitas y no deben serlo: son placeholders con proporción exacta para que veas cómo recorta el tema. Si tu red o la tienda bloquea la descarga, borra la columna `Image Src` y sube imágenes a mano.

## Los 18 productos y para qué sirve cada uno

| Handle | Qué prueba | Hallazgo relacionado |
| --- | --- | --- |
| `qa-01-long-title` | Título de 124 caracteres en tarjeta, carrito, drawer, barra fija y búsqueda | P1-24, cero line-clamp y filas desalineadas |
| `qa-02-no-image` | Placeholder en tarjeta, galería, drawer y cross-sell | B10 de la auditoría |
| `qa-03-panoramic` | Imagen 21:9, recorte y CLS | P1-8 |
| `qa-04-ultra-tall` | Imagen 2:5 en grilla y galería | P1-8 |
| `qa-05-quoted-vendor` | Vendor `Bob's "Best" Atelier` y tipo `12" x 18" Print` | **P0-8. Filtrar por vendor o tipo rompe el facetado** |
| `qa-06-many-variants` | 3 opciones, 24 variantes, Clay agotado entero y XS/Long agotado | **P1-2, callejones sin salida del variant picker** |
| `qa-07-sold-out` | Badge agotado, botón deshabilitado, barra fija | |
| `qa-08-on-sale` | Precio tachado y badge de oferta | |
| `qa-09-price-varies` | Precios distintos por variante, la Large en oferta | **P1-7. El branch price_varies nunca muestra comparativo ni badge** |
| `qa-10-gift-card` | Plantilla `gift_card.liquid` y bloque de destinatario | |
| `qa-11-special-chars` | Acentos, ñ, comillas tipográficas, ampersand, vendor con apóstrofo | **P0-8 en `aria-label` de remover del carrito** |
| `qa-12-free` | Precio 0.00 | |
| `qa-13-expensive` | 12.500,00 y separador de miles | **P0-7 al cambiar la tienda a EUR** |
| `qa-14-long-description` | Descripción de ~4.000 caracteres en el PDP | P1-3, falta bloque colapsable |
| `qa-15-no-description` | Sin descripción | |
| `qa-16-single-char` | Título de un carácter al lado de uno de 124 | P1-24 |
| `qa-17-single-variant` | **Único producto donde aparece el quick add**, porque exige `has_only_default_variant` | P1-36 |
| `qa-18-many-images` | 10 imágenes de proporciones mezcladas | **P1-1, el apilado vertical infinito en móvil** |

## Pasos manuales que el CSV no puede cubrir

El importador de Shopify no crea colecciones, mercados, planes de venta ni medios 3D. Estos siete pasos toman unos quince minutos y son los que completan el escenario.

**1. Colección con un solo producto.** Colecciones > Crear > Automatizada, condición `Etiqueta del producto es igual a qa-single`. Queda con un producto. Reproduce B8 de la auditoría, donde el tile de promoción domina visualmente al único producto.

**2. Colección vacía.** Automatizada, condición `Etiqueta del producto es igual a qa-empty`. Ningún producto la tiene, así que queda vacía. Reproduce **P1-16**: verás "No products match your selection" con un enlace "Clear all" que apunta a la página donde ya estás, más la toolbar y el switcher de densidad renderizados sobre una grilla que no existe.

**3. Colección grande para paginación.** Automatizada, condición `qa-all`. Baja `products_per_page` a 8 en el theme editor y agrega dos tiles de promoción sin tocar su posición. Reproduce **P1-17** (el tile se repite en cada página) y **P1-18** (los dos tiles colisionan en el mismo slot porque ambos vienen con `position_in_grid: 4`).

**4. Filtros de búsqueda.** Instalar la app gratuita Search & Discovery y activar filtros por disponibilidad, precio, tipo y vendor. Sin esto no puedes probar el facetado, y además sin ella `intent: complementary` en las recomendaciones renderiza vacío, que es el P1-36.

**5. Segundo mercado en EUR.** Configuración > Mercados, agregar uno con formato de moneda `1.234,56`. Reproduce **P0-7** en el filtro de precio y hace visible el selector de país, que hoy no se renderiza porque `localization-selectors.liquid` exige más de un país o idioma.

**6. Un producto con modelo 3D y otro con video.** Subir a `qa-18-many-images`. Reproduce **P0-5**: el modelo queda como póster inerte porque `theme.js` no carga `model-viewer-ui` ni `shopify-xr`, y el video sale con controles de navegador en medio de la galería editorial.

**7. Un plan de venta.** Instalar una app de suscripciones gratuita y asignar un plan a `qa-17-single-variant`. Prueba el bloque de selling plans del PDP y su respaldo sin JavaScript.

## La prueba de red, que es la más rápida y la que más sorprende

Con cualquier producto en pantalla, abre DevTools, pon la red en **Offline** y presiona Añadir al carrito.

Deberías ver aparecer en el drawer el texto **"Failed to fetch"**, en inglés y sin traducir, porque `theme.js` hace `showError(error.message)` con el `TypeError` crudo del navegador. Ese es el hallazgo **P1-13** y es el que un revisor de Shopify produce en diez segundos.

Después vuelve la red a normal y prueba con `qa-06-many-variants`: elige Clay, que está agotado entero, e intenta volver a otra talla. Ahí ves el callejón sin salida del P1-2.

## Cómo dejar la tienda limpia después

Los 18 productos llevan la etiqueta `qa-all`. Filtrar por esa etiqueta en Productos, seleccionar todo y archivar o eliminar. Las tres colecciones automatizadas se borran a mano.

Recomendación: no los borres hasta la submission. Este catálogo es el pase de QA de cada sprint bajo la compuerta 5 de la nueva Definition of Done, no una prueba de una sola vez.
