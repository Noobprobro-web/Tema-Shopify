# CLAUDE-VERIFY-4B-002: Cómo subirlo a Shopify y ver cada arreglo

```text
ID: CLAUDE-VERIFY-4B-002
Para: Johandry / Ruiz Digital
Acompaña a: CLAUDE-IMPL-4B-002-ledger-and-ux.md
Alcance: 17 archivos modificados en el sprint CLAUDE-TASK-4B-002
Fecha: 2026-09-13
```

---

## 1. Cómo subirlo

Los archivos ya están escritos en tu carpeta local. Falta llevarlos a la tienda.

**Usa `theme dev`, no `theme push`.** Es la vía correcta para esta revisión por una razón concreta: `theme dev` renderiza desde tus archivos locales, así que el `templates/index.json` nuevo es lo que vas a ver. Si haces `push` a un tema donde ya personalizaste la home en el editor, Shopify conserva lo del editor y **no verías ninguno de los arreglos de la home**, que son cinco de los dieciocho de esta lista.

```bash
cd "C:\Users\Johan\OneDrive\Documentos\Drive\Tema Shopify"
npx shopify theme dev --store tu-tienda.myshopify.com
```

La primera vez te va a pedir autenticarte en el navegador. Al terminar te da una URL local, normalmente `http://127.0.0.1:9292`, y recarga sola cuando un archivo cambia.

Si prefieres un enlace que puedas abrir desde el teléfono o compartir:

```bash
npx shopify theme push --unpublished
```

Eso crea un tema nuevo sin publicar y te da el enlace de vista previa desde el admin. No toca el tema que esté publicado.

**Dos cosas que la tienda necesita tener antes de que esta lista sirva:**

Productos suficientes para llenar una rejilla, al menos ocho o diez. Y **un producto con varias variantes a precios distintos donde la más cara esté rebajada**, porque sin eso no puedes ver el arreglo de Row 67 ni el precio tachado del total de línea. Si ya importaste el catálogo hostil de `CLAUDE-QA-001`, eso ya está cubierto.

**Al final, regenera el zip**, porque `Couture-1.0.0.zip` en la raíz del repo es anterior a estos cambios:

```bash
npx shopify theme package
```

---

## 2. Los dieciocho arreglos, y dónde mirar cada uno

### En la home

**1. El hero ahora tiene un solo botón.** Antes tenía dos y el segundo, "Explore lookbook", te devolvía a la home. Ahora ves solo "Discover the collection", que va a `/collections/all`.

**2. La prueba de que el arreglo funciona de verdad.** Esto es lo que conviene que compruebes tú mismo, porque es el arreglo de fondo y no solo la limpieza del contenido. Abre el editor de temas, sección del hero, y pon cualquier enlace en "Secondary button link". El botón aparece. Bórralo. El botón desaparece. Antes el botón estaba siempre, con enlace o sin él, y sin enlace apuntaba a la home. También verás una nota nueva bajo el campo que dice que el botón aparece cuando tiene enlace.

**3. La sección de la cita no tiene botón.** Antes decía "Read our process" y te devolvía a la home. Mismo comportamiento que el punto 2: si le pones un enlace en el editor, el botón vuelve.

**4. La sección "Curated edit" tiene una sola pestaña con productos.** Antes tenía tres y dos estaban vacías, porque a esos dos bloques nunca se les asignó una colección.

**5. La tarjeta del medio del bento, "Carried close", ya no tiene CTA.** Y su imagen ya no es un enlace. Antes eran dos controles, el CTA y la imagen, los dos apuntando a la home.

### En la página de producto

**6. El total de línea.** Pon la cantidad en 2. Debajo del campo aparece una línea que dice "Total for 2" con el importe. Ponla en 1 y desaparece. Escribe `0`, borra el campo, o escribe letras: desaparece también, sin mostrar `NaN` ni un total corrupto.

**7. Lo más importante de este cambio: el precio unitario de arriba no se mueve.** Cámbiale la cantidad varias veces y vigila el precio grande del producto. Tiene que quedarse igual. Eso era el requisito y es lo que hay que comprobar.

**8. Con una variante rebajada**, el total de línea muestra también el total viejo tachado al lado del nuevo.

**9. Si el producto tiene plan de suscripción**, selecciónalo: el total usa el precio del plan, no el de compra única.

### En una colección

**10. En teléfono, los dos botones de densidad ahora dan 1 y 2 columnas.** Ábrela en el móvil, o en el navegador con DevTools a 375px de ancho. Antes los botones decían 2 y 4 y entregaban 1 y 2, así que ninguno de los dos decía la verdad. Fíjate también en los iconos: ahora el primero muestra una sola barra y el segundo dos, en lugar de dos y cuatro.

**11. A 768px de ancho, los mismos botones dan 2 y 4 columnas**, y los iconos vuelven a mostrar dos y cuatro barras.

**12. A 768px, en vista de 4 columnas, el tile de promoción ocupa una celda**, no la fila completa. Antes se comía una fila entera de cuatro.

**13. La separación entre columnas de la rejilla se ve desde 768px.** Esto no existía: la declaración estaba escrita con una propiedad que no existe en CSS y el navegador la descartaba en silencio. Lo mismo pasaba en la rejilla de resultados de búsqueda.

**14. Desactiva JavaScript y recarga.** Los botones de densidad desaparecen del todo, en lugar de quedarse ahí sin hacer nada.

**15. El punto focal.** En Shopify, edita la imagen del hero y ponle un punto focal descentrado. El recorte del hero ahora lo respeta.

### En búsqueda, 404 y tarjetas

**16. Busca algo que dé resultados en una tienda sin filtros configurados.** El desplegable de "Sort by" sigue estando. Antes desaparecía junto con los filtros, así que en esa situación no había forma de ordenar.

**17. Entra a una URL que no exista.** El título de la sección de recomendaciones se ve como un encabezado y no como una etiqueta diminuta.

**18. Busca en una colección el producto de variantes a precios distintos con la más cara rebajada.** Su tarjeta ahora muestra "From" con el precio, el precio comparativo tachado y la etiqueta de oferta. Antes ese producto no mostraba ni comparativo ni etiqueta, así que una oferta real quedaba invisible en la rejilla.

**Extra que se nota al pasar:** los enlaces de los submenús del escritorio son más altos, 44px, y el mismo cambio aplica al interruptor de destinatario de tarjeta regalo.

---

## 3. Lo que no se ve a ojo

Tres cosas de este sprint necesitan una herramienta. Son las que dejan las filas del ledger en "código completo" en lugar de "cumplido".

**El conteo de resultados para lectores de pantalla.** El arreglo es que el nodo que anuncia el cambio ahora vive fuera del trozo que el filtrado reemplaza. Para verlo sin lector de pantalla: abre DevTools, busca el `<div data-facet-live-region>` que está justo antes de `<facet-filters-form>`, aplica un filtro y mira cómo su texto cambia. Para verificarlo de verdad hace falta NVDA, que es gratis en Windows.

**CLS.** Corre Lighthouse en modo móvil sobre la home con una imagen real cargada. El objetivo es por debajo de 0.1. El arreglo fue poner las dimensiones en los `<source>` del `<picture>`; el `<img>` ya las tenía porque el filtro `image_tag` de Shopify las emite solo.

**Jerarquía de encabezados.** Con la extensión axe DevTools, o pegando esto en la consola en cada plantilla:

```javascript
console.log('h1 en esta página:', document.querySelectorAll('h1').length);
```

Tiene que dar exactamente 1. El cambio fue que el hero ahora usa `h1` solo en la home y `h2` en cualquier otra plantilla, con la opción "Automatic" del ajuste "Heading level", que es el nuevo valor por defecto.

---

## 4. Tres comprobaciones que puedes correr tú en la consola

Pégalas en la consola del navegador, en cualquier página del tema. Son las que yo usaría para una pasada rápida.

**Enlaces que todavía van a la home desde el contenido:**

```javascript
[...document.querySelectorAll('main a[href]')]
  .filter(a => new URL(a.href, location.href).pathname === '/')
  .forEach(a => console.warn('va al inicio:', a.textContent.trim() || a.outerHTML.slice(0, 80)));
```

Si no imprime nada, no quedan controles muertos en esa página. Córrela en la home, en una colección y en un producto.

**Objetivos táctiles por debajo de 44px:**

```javascript
[...document.querySelectorAll('a, button, select, input, summary')]
  .filter(el => { const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44); })
  .forEach(el => console.warn(Math.round(el.getBoundingClientRect().height) + 'px', el));
```

Esto te da el inventario completo que hace falta para cerrar la fila de áreas táctiles. Yo arreglé los dos elementos que la directiva nombraba, y eso no es lo mismo que haber auditado todos. Lo que salga de aquí es la lista real.

**Botones cuyo nombre accesible no coincide con lo que ves:**

```javascript
[...document.querySelectorAll('[aria-label]')]
  .filter(el => el.textContent.trim() && !el.getAttribute('aria-label').includes(el.textContent.trim()))
  .forEach(el => console.warn('aria-label:', el.getAttribute('aria-label'), '| visible:', el.textContent.trim()));
```

Este es el patrón que causaba el problema de los botones de grilla, donde el `aria-label` decía "Compact grid view" y el botón entregaba otra cosa.

---

## 5. Si algo se ve raro

Dos cambios de este sprint alteran la composición visual y quiero que sepas que son intencionales, para que no los reportes como bugs.

**Las home de los tres presets tienen menos botones.** En `/listings/couture`, `/listings/studio` y `/listings/archive` retiré catorce CTA que apuntaban a la home. Todos pedían una página de contenido que no existe en una tienda nueva. La sección 6 de `CLAUDE-IMPL-4B-002` tiene el checklist de qué páginas crear en cada tienda demo y cómo devolver cada CTA con dos líneas de JSON, una vez que confirmes el handle real.

**A 768px, cuatro columnas es más estrecho que antes.** Cada tarjeta queda en unos 170px. Es el precio de que el botón que dice "cuatro por fila" entregue cuatro por fila. Si al verlo te parece demasiado apretado, dímelo: la alternativa es renombrar ese botón y volver a tres columnas en tablet, y son dos cambios pequeños.
