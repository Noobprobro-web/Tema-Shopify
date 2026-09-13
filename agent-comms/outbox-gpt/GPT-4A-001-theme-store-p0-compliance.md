# Entrega GPT-4A-001: Cumplimiento P0 de Shopify Theme Store

```text
ID: GPT-4A-001
Estado: ENTREGADO PARA REVISION DE GEMINI
Base revisada: ebbd73f (master sincronizado con origin/master al iniciar esta continuacion)
Decision requerida: auditar la entrega y autorizar commit/push.
```

## Resumen en 5 lineas

1. La busqueda predictiva ya funciona sobre la URL localizada oficial de Shopify, con resultados de productos, colecciones, articulos y paginas.
2. El dialogo de busqueda incorpora debounce, cancelacion de solicitudes, listbox accesible, flechas, Escape, focus trap, `inert` y restauracion de foco.
3. Los formularios oficiales de localizacion se envian al cambiar pais/moneda o idioma, y conservan su boton nativo cuando JavaScript no esta disponible.
4. Newsletter, pagos, localizacion, busqueda y media 3D reciben estilos responsive con targets de 44 px y controles con contraste reforzado.
5. Los filtros monetarios conservan decimales con coma, quitan separadores de miles y apostrofes, usan `step="any"` y pasan Theme Check con 0 ofensas.

## Contexto de reanudacion

Durante la interrupcion de la tarea, el andamiaje inicial de GPT-4A-001 fue integrado por el commit concurrente `add33ce`, y Gemini completo los locales y la traduccion de schemas en `ebbd73f`. Se reviso el estado real antes de continuar y no se reescribio ese trabajo.

La continuacion implementa solo las cuatro piezas que `GEMINI-4B-002` dejo expresamente a GPT:

- Clase `<predictive-search>`.
- Clase `<localization-form>`.
- CSS de los componentes P0.
- Normalizacion final de los filtros de precio.

Se conserva `Couture` como nombre vigente del tema y del preset porque es la decision de coordinacion mas reciente. No se revirtio a `Atelier Flow`.

## Archivos modificados en esta continuacion

- `assets/theme.js`
- `assets/base.css`
- `snippets/predictive-search.liquid`
- `locales/en.default.json`
- `sections/main-collection.liquid`
- `sections/main-search.liquid`
- `agent-comms/outbox-gpt/GPT-4A-001-theme-store-p0-compliance.md`

## Andamiaje P0 ya presente en la base revisada

- `snippets/localization-selectors.liquid`
- `snippets/predictive-search.liquid`
- `snippets/social-meta-tags.liquid`
- `snippets/product-media.liquid`
- `sections/newsletter.liquid`
- `sections/header.liquid`
- `sections/footer.liquid`
- `sections/main-product.liquid`
- `sections/cart-drawer.liquid`
- `sections/main-cart-items.liquid`
- `layout/theme.liquid`
- `config/settings_schema.json`
- `config/settings_data.json`

## Implementacion

### Busqueda predictiva

- `<predictive-search>` hereda de `ThemeCore.ThemeElement` y todos los listeners persistentes se registran con `this.listen` y `AbortController`.
- Consume `routes.predictive_search_url` mediante su endpoint JSON oficial y localizado, con tipos `product,collection,page,article`, limite global de ocho resultados y productos agotados al final.
- Usa debounce de 200 ms y cancela solicitudes anteriores para impedir resultados obsoletos.
- Construye el DOM con `createElement` y `textContent`; no inyecta HTML recibido por red.
- Productos muestran miniatura, titulo, precio localizado con `Intl.NumberFormat`, precio comparativo y estado de stock.
- El combobox controla `aria-expanded`, `aria-activedescendant`, `role="listbox"`, `role="option"`, flechas, Home/End y Enter.
- El dialogo cierra con Escape o click en el overlay, aisla el fondo con `inert`, atrapa el foco y lo devuelve al disparador.
- El formulario dentro de `<details class="no-js-only">` sigue enviando una busqueda estandar sin JavaScript.

Se eligio `/search/suggest.json` porque es parte oficial de Predictive Search API y el alcance autorizaba un snippet, no una seccion adicional `sections/predictive-search.liquid` requerida por Section Rendering API.

### Localizacion y multimoneda

- `<localization-form>` hereda de `ThemeElement` y envia el formulario oficial al cambiar cualquiera de sus selects.
- No deshabilita el select antes del envio, por lo que `country_code` o `language_code` siempre llegan a Shopify.
- El fallback `no-js-only` conserva el boton de envio nativo.
- El carrito, ya endurecido en la base, solo muestra recompensas escalonadas cuando la moneda activa coincide con `shop.currency`; evita comparar umbrales base contra importes JPY/EUR convertidos sin una tasa Liquid fiable.

### Filtros de precio

- Se detectan formatos de coma decimal mediante los tokens de `shop.money_format` y `shop.money_with_currency_format`.
- En formato europeo se eliminan puntos de miles y la coma decimal se convierte a punto.
- En formato anglosajon se eliminan comas de miles; espacios y apostrofes tambien se normalizan.
- Se conserva `step="any"`, los valores permanecen escapados y no se divide entre 100, por lo que no se introduce una suposicion incorrecta para monedas zero-decimal.

### Estilos y accesibilidad

- Se agregaron layouts responsive para busqueda, localizacion, newsletter, utilidades del footer, metodos de pago y boton AR.
- Los controles conservan `--tap-target-min: 44px`; newsletter y busqueda usan 52 px en acciones primarias.
- `--color-control-border` mezcla 60% del foreground contra la superficie: ratio medido 4.39:1 en Couture claro y 6.35:1 en Couture oscuro, por encima del minimo 3:1 de WCAG 1.4.11.
- Los botones `aria-busy="true"` conservan opacidad 1 incluso deshabilitados.
- Texto y precio de prendas no seleccionadas mantienen opacidad 1; solo se atenua su imagen. El texto muted midio 6.49:1 y 8.60:1 en los dos esquemas actuales.

## Validaciones

```text
node --check assets/theme.js
PASS (exit 0)

cmd.exe /c "npx shopify theme check"
PASS: 62 archivos inspeccionados, 0 ofensas

JSON.parse equivalente mediante ConvertFrom-Json
PASS: config/settings_schema.json
PASS: config/settings_data.json
PASS: locales/en.default.json
PASS: locales/en.default.schema.json

git diff --check
PASS; solo avisos informativos LF -> CRLF de Windows

Smoke headless con Google Chrome local
PASS: definicion de ambos custom elements
PASS: request a /search/suggest.json y render de dos tipos de resultado
PASS: precio y compare-at localizados, estado In stock
PASS: ArrowDown + aria-activedescendant
PASS: fondo inert, Escape y restauracion de foco
PASS: auto-submit del formulario de localizacion
```

El primer Theme Check dentro del sandbox reprodujo el error conocido `uv_os_get_passwd returned ENOMEM`; la misma validacion fuera del sandbox termino correctamente con 0 ofensas.

## Riesgos y siguiente accion

- `https://ruizdigital.com/themes/couture/docs` responde HTTP 404.
- `https://ruizdigital.com/themes/couture/support` responde HTTP 404.
- Esas dos paginas son un bloqueo externo de submission aunque `theme_info` sea sintacticamente correcto. Johandry/Ruiz Digital debe publicarlas antes de la compuerta final.
- Ejecutar un smoke en tienda Shopify conectada con al menos dos mercados, dos idiomas, EUR con coma decimal, JPY, resultados agotados y un producto con modelo 3D.
- Confirmar visualmente model-viewer/AR en un dispositivo compatible; no puede certificarse con el fixture DOM local.
- La estrategia conservadora del carrito oculta recompensas en monedas no base hasta que el producto defina umbrales por mercado o una fuente fiable de conversion.
- Gemini debe actualizar el ledger solo con evidencia: el codigo de P0-1, P0-2, P0-3, P0-5 y P0-7 queda implementado, pero las URLs y pruebas de tienda real siguen siendo compuertas externas.
- No se realizo commit ni push.
