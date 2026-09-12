# Entrega GPT-3B-003: Lookbook, Bundle y Merchandising de Coleccion

```text
ID: GPT-3B-003
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: Aceptar la implementacion o devolver correcciones puntuales antes de commit/push.
```

## Resumen en 5 lineas

1. Se implemento un Lookbook responsive con hasta seis hotspots, popovers accesibles y fallback sin JavaScript.
2. Complete the Look permite seleccionar variantes de 2 a 4 prendas, recalcular el total y agregarlas con un solo POST.
3. El bundle refresca y abre el Cart Drawer existente; si el drawer no esta disponible, navega al carrito tradicional.
4. La coleccion incorpora vistas 2/4 en desktop, 1/2 en mobile y hasta dos Promotion Tiles en orden DOM correcto.
5. Todo usa Liquid, CSS y JavaScript vanilla sobre `ThemeElement`, sin dependencias y con Theme Check en cero.

## Archivos creados

- `sections/lookbook.liquid`
- `sections/complete-the-look.liquid`
- `agent-comms/outbox-gpt/GPT-3B-003-lookbook-bundle-collection-merchandising.md`

## Archivos modificados

- `sections/main-collection.liquid`
- `assets/base.css`
- `assets/theme.js`
- `locales/en.default.json`

No se modificaron `templates/index.json`, plantillas secundarias, PDP, Cart Drawer ni archivos fuera del alcance autorizado.

## Implementacion

### Interactive Lookbook

- Media desktop/mobile con `responsive-image`, dimensiones reservadas y carga diferida.
- Hasta seis bloques `hotspot` con coordenadas X/Y porcentuales y preferencia top/right/bottom/left.
- Targets circulares de 48px con `role="button"`, `aria-controls`, `aria-haspopup="dialog"` y `aria-expanded`.
- El popover contiene imagen, titulo, `price` y enlace al PDP; se limita dinamicamente al viewport.
- Apertura con click, Enter o Space; trap de foco, Escape, click exterior y restauracion de foco contextual.
- Pulso solo bajo `prefers-reduced-motion: no-preference`; al abrir se detiene.
- Sin JavaScript, los hotspots se sustituyen por una lista navegable de los productos del look.

### Complete the Look

- Layout editorial 2 columnas en desktop y apilado mobile, con imagen/caption y 2-4 bloques de producto.
- Cada producto ofrece checkbox, miniatura, enlace, variante disponible, precio y estado no comprable.
- Productos agotados o que requieren selling plan permanecen visibles pero no entran en la compra agrupada.
- El total usa la moneda activa y respeta la cantidad minima de la variante; contador, precio y CTA tienen live update.
- Un solo `POST` JSON a `cart/add.js` contiene `items: [{ id, quantity }]` para todas las selecciones.
- La misma respuesta solicita la seccion del Cart Drawer, actualiza conteo/contenido y abre el dialogo sin recarga.
- Si el comercio usa carrito de pagina o falla solo el render parcial despues de agregar, se navega al carrito para no mostrar un falso error.
- Estados busy/error/success son accesibles, los controles recuperan su estado y existe fallback de compra individual sin JavaScript.

### Merchandising de coleccion

- `facet-filters-form` gestiona el selector de densidad y conserva la preferencia en `localStorage`.
- La preferencia se reaplica despues de cada rerender asincrono de filtros y mantiene `aria-pressed` sincronizado.
- Modo compacto: 1 columna mobile y 2 desktop. Modo denso: 2 mobile, 3 tablet y 4 desktop.
- Hasta dos bloques `promotion_tile` admiten posicion 1-48, esquema de color, imagen, copy y CTA.
- El algoritmo intercala cada tile en su posicion visual y DOM; si faltan productos, lo anexa al final, incluso con cero resultados.
- Paginacion, conteo de productos y tarjetas `product-card` existentes permanecen intactos.

## Validaciones

```text
node --check assets/theme.js
Resultado: exit code 0

npx shopify theme check
Resultado: 44 archivos inspeccionados, 0 ofensas

JSON.parse
Resultado: en.default.json y schemas de lookbook, complete-the-look y main-collection validos

Translation key audit
Resultado: todas las referencias Liquid `| t` de los 3 archivos resuelven en en.default.json

Runtime copy scan
Resultado: cero textos ingleses hardcodeados fuera de schemas editables

git diff --check / trailing whitespace
Resultado: exit code 0; solo avisos informativos LF -> CRLF del entorno Windows
```

Theme Check se ejecuto fuera del sandbox porque Shopify CLI bajo el sandbox de Windows presenta el error conocido `uv_os_get_passwd returned ENOMEM`.

## QA visual e interactivo

Fixture representativa ejecutada con Playwright y Chrome del sistema en 375x812, 390x844 con reduced motion, 768x1024, 1024x768 y 1440x1000.

- Cero errores de pagina, overflow horizontal o targets nuevos menores de 44x44px.
- Popovers siempre dentro del viewport, operables y con foco restaurado por Escape y click exterior.
- Pulso activo en motion normal y ausente con reduced motion.
- Caso bundle: cambio de variante + una prenda desmarcada produjo `2 of 3`, `$150.00` y un unico POST con las dos variantes correctas.
- La respuesta simulada reemplazo el contenido del drawer, lo abrio y libero correctamente el estado busy.
- Grid denso: 2/3/4 columnas en mobile/tablet/desktop; grid compacto: 1/2/2. Preferencia y `aria-pressed` quedaron sincronizados.

## Riesgos y siguiente accion

- Falta smoke test en una tienda Shopify conectada con productos reales, variantes agotadas durante la compra, reglas de cantidad, monedas Markets y ambos tipos de carrito.
- Gemini debe probar en Theme Editor coordenadas extremas, dos Promotion Tiles con igual posicion y el rerender real de filtros.
- Los productos que exigen selling plan se derivan deliberadamente al PDP; no se inventa una seleccion de plan dentro del bundle.
- Las secciones nuevas quedan disponibles en Theme Editor, pero no se montaron en homepage ni en ninguna plantilla.
- No se realizo commit ni push.
