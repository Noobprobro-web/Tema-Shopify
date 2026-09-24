# CLAUDE-REPORT-6A-001: Certificación en tienda real de búsqueda predictiva, localización, newsletter, pagos y checkout acelerado

```text
ID: CLAUDE-REPORT-6A-001 (responde a CLAUDE-DIRECTIVE-6A-001)
Estado: ENTREGADO. Dictamen: 1 de las 6 filas es apta para `cumplido` (fila 80, selector de
  idioma). Las otras 5 siguen en `código completo`:
  - Fila 78 por un defecto real de accesibilidad (axe, critical), con parche listo y probado en vivo.
  - Filas 79, 82 y 63 porque a la tienda le falta lo que hay que medir: tiene un solo mercado (US,
    USD) y ningún método de pago activo.
  - Fila 81 porque Shopify protege el formulario con hCaptcha y no lo sorteé, y el envío inválido
    no estaba autorizado.
Base: master 2d1fc29 (el código del tema es el de af6ee6d; 2d1fc29 solo toca docs). Tienda leída
  el 2026-09-24 hasta las 19:18 UTC.
Decisión requerida:
  1. Gemini: aprobar harness-6A-001/ps-listbox-structure.diff (Nivel 2: Liquid, JS y CSS). Saca del
     listbox el enlace "Ver todos", el mensaje vacío y el rol de los h2 (D1). Lo probé en vivo con el
     mismo código: axe pasa a 0 violaciones, el teclado no cambia y no hay desborde a 360 px.
     Con los 5 diffs aplicados, Theme Check da 0 ofensas y node --check pasa.
  2. Gemini: aprobar harness-6A-001/localization-country-nojs.diff (Nivel 2, Liquid). Da al selector
     de país un envío sin JS (D2). Decidir además si el auto-submit al cambiar de país se queda (R1,
     WCAG 3.2.2).
  3. Gemini, opcionales (P3/P4): ps-price-sr-labels.diff (H-A), pdp-buy-buttons.diff (H-B) y
     footer-payments-label.diff (H-C).
  4. Johandry:
     a. Activar un método de pago de prueba (Bogus Gateway o Shopify Payments en modo prueba). Sin
        eso no se pueden medir las filas 82 y 63. Yo no toco pagos.
     b. Crear un segundo mercado con otra moneda (por ejemplo España/EUR o Canadá/CAD) para medir
        la fila 79.
     c. Hacer a mano los dos envíos del newsletter (válido e inválido). Son 2 minutos; los pasos
        están en §3.4.
     d. Opcional: publicar 1 artículo en /blogs/news para medir el grupo "Diario" con datos reales.
     e. Contenido: 21 productos tienen la descripción principal (inglés) escrita en español (H-D).
Resumen en 5 líneas:
  1. Fila 78, búsqueda: lo funcional pasa en 2 temas, 3 anchos y 2 idiomas, con teclado real. axe
     marca una violación critical: el listbox contiene elementos que no son opciones (D1).
  2. Filas 79 y 80, localización: el idioma queda certificado con envíos reales en escritorio y en el
     cajón móvil. El país no se renderiza porque hay 1 solo país; simulado, sin JS no se puede enviar.
  3. Fila 81, newsletter: el marcado es correcto en los 2 formularios de cada página. El envío real
     no salió porque la protección de Shopify lo retuvo.
  4. Fila 82, pagos: la tienda no tiene métodos activos y el contenedor no se imprime (estado vacío
     correcto). Con 14 iconos simulados no hay desborde a 1280, 375 ni 360.
  5. Fila 63, checkout: en la ficha el botón dinámico sale y se oculta en variantes agotadas. En el
     cajón y en /cart no sale porque, sin pasarela, additional_checkout_buttons es falso.
Archivos tocados: ninguno del tema ni del ledger. En agent-comms: este informe y harness-6A-001/
  (5 diffs y las sondas). No hice commit ni push. La contraseña del storefront no la escribí: la
  sesión ya estaba abierta.
Desviaciones (Nivel 1 o Nivel 2): ninguna aplicada. Los 5 diffs son propuestas de Nivel 2.
Hallazgos extra fuera de alcance (con parche listo): H-A ps-price-sr-labels.diff; H-B
  pdp-buy-buttons.diff; H-C footer-payments-label.diff; H-D contenido de la tienda, sin parche;
  H-E citas de línea desactualizadas en el ledger y en la directiva (texto de reemplazo en §6).
Verificación (comando, resultado y qué demuestra/qué no): §1 a §5 y §8.
Lista de afirmaciones falsables numeradas: §10.
```

---

## 0. Método y límites del entorno

Todo se midió en `tema-qkqpke0j.myshopify.com` con `?preview_theme_id=165809488115` (Couture) y `?preview_theme_id=166186909939` (Sartorial), en `/` y `/es/`. Usé el navegador integrado con la sesión del storefront ya abierta y viewport emulado a 1280x800, 375x812 y 360x780. Las sondas están en `harness-6A-001/probes-6A-001.js`. axe-core 4.10.2 se cargó desde cdnjs dentro de la página.

Permisos. Johandry autorizó en el chat tres acciones: el cambio de idioma (envío a /localization), añadir al carrito y el envío válido del newsletter. El envío inválido no estaba autorizado y no lo hice. No toqué el Admin: solo hice lecturas por GraphQL.

Límites del panel. Durante buena parte de la sesión el panel estuvo oculto (`document.visibilityState = "hidden"`). En ese estado Chrome no ejecuta `requestAnimationFrame` y agrupa los `setTimeout` en tramos de ~1 s. Eso tiene tres efectos:

1. Foco inicial. `trapFocus()` (`assets/theme.js:24-55`) enfoca el input dentro de un rAF. Para medir el foco al abrir instalé un rAF de prueba (`setTimeout(cb, 16)`). Sin él, el foco se queda en `body` mientras el panel esté oculto. En un navegador visible el rAF corre solo.
2. Debounce. Los 200 ms del código (`theme.js:4101`) se miden como ~1 s por ese agrupado. Lo que certifico es el número de peticiones por ráfaga, no los milisegundos.
3. Teclado. Las teclas reales funcionaron en la portada a 1280 y en /es a 360. En `/collections/all` a 1280 el panel dejó de entregar eventos (ni `keydown` ni `pointerdown` llegaban a la página). Ahí y en Sartorial usé `KeyboardEvent` despachado, y lo indico en cada caso.

---

## 1. Track 1, fila 78: búsqueda predictiva

### 1.1 Disparo y diálogo (Couture, 1280, en)

Medido con `__psState()` antes y después de pulsar `[data-predictive-search-open]`:

| Atributo | Cerrado | Abierto |
| :--- | :--- | :--- |
| `aria-expanded` del disparador | `false` | `true` |
| `aria-hidden` / `inert` del panel `role=dialog aria-modal=true` | `true` / sí | `false` / no |
| Overlay `[data-predictive-search-overlay]` | `hidden` | visible |
| `body` | `overflow: visible` | `overflow: hidden` y `data-modal-open` |
| Hermanos de `body` con `inert` | 0 | 9 (`MainContent`, pie, cajón, barra de anuncio, skip link...) |
| Foco | `body` | `input[type=search]` (`role=combobox`, `aria-controls` al listbox) |
| Panel | 0x0 | 768x800 en x=512 (1280); 375x812 y 360x780 a pantalla completa |

Cierre por las tres vías:
- Botón "Close": se restablece todo y el foco vuelve a "Search".
- `Escape` con tecla real: igual.
- `pointerdown` en el overlay: igual.

En los tres casos quedan 0 hermanos con `inert` y `overflow` vuelve a `visible`. El disparador mide 44x44 en los 3 anchos.

### 1.2 Debounce y petición

- Ráfaga de 4 eventos `input` (w, wo, woo, wool): **1** petición, con `q=wool`.
- Dos pulsaciones separadas 1,5 s (dr y dress): **2** peticiones.
- Un solo carácter: **0** peticiones (el mínimo son 2).
- URL real: `/search/suggest.json?q=jacket&resources[type]=product,collection,page,article&resources[limit]=8&resources[limit_scope]=all&resources[options][unavailable_products]=last`

### 1.3 Entidades

Primero consulté `/search/suggest.json` directo y después miré lo que dibuja el panel.

| Término | Grupos renderizados | Primera opción |
| :--- | :--- | :--- |
| coat | Products: 8 | Serra Coat $1,890.00 In stock |
| dress | Products: 6 | Bias-Cut Slip Dress $780.00 In stock |
| jacket | Products: 8 | Cropped Tailored Jacket $890.00 In stock |
| wool | Products: 8 | Wool Waistcoat $460.00 In stock |
| the | Products: 3, Collections: 3, Pages: 2 | /products/leather-belt, /collections/the-permanent-collection, /pages/policy |

- **Products.** Imagen con `srcset` 72w/144w/216w (`?width=72|144|216`), `sizes="72px"`, `width=72 height=90` y el alt del producto.
  - Precio `$1,890.00`: coincide con `data-money-format="${{amount}}"`, que es el `shop.money_format`.
  - Precio tachado (F04): `<span>$320.00</span><s aria-label="Regular price">$380.00</s>`.
  - Agotado ("poplin"): `F02 Sold Out Poplin Shirt $290.00 Sold out` sale al final, con `data-sold-out`.
- **Collections y pages.** Salen con el término "the" (arriba).
- **Articles.** La tienda no tiene artículos publicados (`/blogs/news`: "No essays have been published yet."; 10 términos de prueba dieron 0 artículos). Probé el render sustituyendo en el cliente la respuesta real de "the" por la misma más 1 artículo: aparece el grupo "Journal" entre Collections y Pages, con "9 suggestions available". Es una prueba del código de render, no del dato real (ver 4.d en la cabecera).
- **/es.** Salen los títulos Productos, Colecciones y Páginas. La primera opción es `Abrigo Serra $1,890.00 Disponible`, con "Agotado" en F02 y enlaces `/es/products/...`, `/es/collections/...` y `/es/pages/...`. Estado: "8 sugerencias disponibles".

### 1.4 Estados límite

- **Sin resultados** (`xyznoresults999`): "No suggestions yet. Press enter to search the full catalog.", idéntico a `data-no-results-text`. En /es: "Aún no hay sugerencias. Pulsa Enter para buscar en todo el catálogo.". Estado: "0 suggestions available".
- **Término de 75 caracteres** (`doublefacedwool...concealed placket`): 0 elementos fuera del panel y 0 px de scroll horizontal a 1280, 375 y 360, en los dos temas. "Ver todos" se parte en líneas (`overflow-wrap: anywhere`): 58 px de alto a 1280 y 91 px a 375/360. El input desplaza su texto por dentro (580/289 px), como corresponde.
- **Título de 142 caracteres** (F10): la opción crece a 194 px (375) y 219 px (360) sin salirse del panel.
- **Input en móvil:** 16 px de fuente, así que iOS no hace zoom.

### 1.5 Teclado

Couture, 1280, portada, **teclas reales** y búsqueda "coat":

| Tecla | Opción activa (`aria-selected="true"` y `aria-activedescendant`) |
| :--- | :--- |
| ArrowDown | option-0 Serra Coat |
| ArrowDown | option-1 Cocoon Cardigan-Coat |
| ArrowDown | option-2 F10... |
| ArrowUp | option-1 |
| End | option-7 F01 Single Variant Waistcoat |
| ArrowDown | option-0 (vuelve al principio) |
| Home | option-0 |
| ArrowUp | option-7 (vuelve al final) |

- El foco se queda en el input todo el tiempo.
- `Enter` sobre option-1 navega a `/products/cocoon-cardigan-coat?_pos=2&_psq=coat...` (plantilla product, preview Couture).
- `Enter` sin opción activa (tecla real, Couture /es a 360) envía el formulario a `/es/search?q=linen&options[prefix]=last&type=product,collection,page,article`, con h1 "Resultados para «linen»".
- `Escape` cierra el panel y devuelve el foco a "Search".
- Trampa de foco con Tab real: input → Clear search → Search (submit) → View all → Close → input. Shift+Tab desde el input va a Close.
- **Clear.** `aria-label="Clear search"`, 44x44. Vacía el input, quita las opciones y deja `aria-expanded="false"`. El foco sigue en el input y el botón se oculta.
- **Sartorial** (1280, `KeyboardEvent`): ArrowDown→0, ArrowDown→1, ArrowUp→0, ArrowUp→7. Escape cierra y el foco vuelve a "Search".

### 1.6 "Ver todos los resultados"

- Clic en "View all results for "wool"": navega a `/search?q=wool&type=product%2Ccollection%2Cpage%2Carticle&options%5Bprefix%5D=last`, plantilla search, h1 `Results for "wool"`, título "14 results found".
- En /es el href es `/es/search?q=coat&type=...` y el texto "Ver todos los resultados para «coat»".

### 1.7 Sin JS

- El HTML servido tiene `<html class="no-js">` y el componente lleva `class="predictive-search js-only"`.
- La alternativa (`snippets/predictive-search.liquid:125-140`) es un `<details class="predictive-search-no-js no-js-only">`. El `summary` tiene `aria-label="Search"` y el formulario es `GET /search` con `role="search"`, un `<label>` asociado, `input name=q required`, `options[prefix]=last` oculto y un botón de envío.
- Con JS: `html.js`, el `details` queda en `display: none` y el componente en `grid`.

### 1.8 D1 (P2): el listbox contiene elementos que no son opciones

axe 4.10.2 sobre el panel abierto (Sartorial 360 en, y Couture 1280 en con "F04"):

```text
con resultados: aria-required-children (critical) x1  #predictive-search-results-...__header
  "Element has children which are not allowed: a[tabindex], h2[tabindex]"
sin resultados: aria-required-children (critical) x1
  "Element has children which are not allowed: a[tabindex]"
```

`renderResults()` (`theme.js:4144-4207`) mete dentro de `[role=listbox]` el enlace "Ver todos" y, si no hay resultados, el `<p>` vacío. Además, cada grupo lleva un `<h2>` con rol de encabezado. Un listbox solo admite `option` y `group` (WAI-ARIA 1.2). Además, con 0 resultados el combobox queda en `aria-expanded="true"` apuntando a un listbox sin opciones.

Parche `harness-6A-001/ps-listbox-structure.diff`:
- Liquid: añade `<div class="predictive-search__footer" data-predictive-search-footer hidden>` junto al listbox.
- JS: el vacío y "Ver todos" van a ese pie, el `h2` lleva `role="presentation"` (sigue nombrando el grupo por `aria-labelledby`) y el listbox se oculta cuando hay 0 opciones.
- CSS: reparte el padding entre los dos contenedores.

Probado en vivo inyectando el mismo código en la página (Sartorial 360):

```text
axe con resultados ("the"):          []   (antes: aria-required-children critical)
axe sin resultados:                  []
aria-expanded con 0 resultados:      "false" (antes "true")
teclado: ArrowDown→0, End→7, ArrowDown→0, ArrowUp→7 (igual que antes)
grupos: Products:3, Collections:3, Pages:2, los 3 con aria-labelledby válido
0 elementos fuera del panel, 0 px de scroll; "Ver todos" 44 px y en la misma posición visual
```

`patch -p1 --dry-run` aplica sobre master y `node --check` pasa con los 5 diffs aplicados en secuencia (§8).

### 1.9 Matriz

| Tema | Ancho | Idioma | Abrir/foco/inert | 4 términos | Vacío y largo | Teclado | Ver todos | axe |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Couture | 1280 | en | OK | OK | OK | real OK | OK | D1 |
| Couture | 1280 | es | OK | coat/the/poplin OK | OK | - | /es/search OK | - |
| Couture | 375 | en | OK | coat OK | OK | - | OK | - |
| Couture | 360 | es | OK | poplin OK | OK | real OK (Enter) | /es/search OK | - |
| Sartorial | 1280 | en | OK | OK | OK | despachado OK | OK | - |
| Sartorial | 375 | es | OK | coat OK | OK | - | OK | - |
| Sartorial | 360 | en | OK | the OK | OK | - | OK | D1 |

---

## 2. Track 2: filas 79 y 80

### 2.1 Fila 80, selector de idioma

Marcado (`snippets/localization-selectors.liquid:22-50`), Couture en `/collections/outerwear`:

```text
form#LocalizationForm-header action=/localization method=post
  hidden: form_type=localization, utf8=✓, _method=put, return_to=/collections/outerwear
  div role=group aria-label="Language"
    span.is-active aria-current="true"  "Current language: English" + "EN"  44x44
    button type=submit name=language_code value=es aria-label="Update preferences: Español"  44x44
```

**Escritorio (Couture 1280, envío real).** Pulsé ES en `/collections/outerwear`:
- 1 redirección a `/es/collections/outerwear` con el preview de Couture intacto.
- `html lang="es"`, h1 "Prendas de abrigo".
- `aria-current` en "Idioma actual: Español".
- El otro botón queda como "Actualizar preferencias: English" y `return_to` pasa a `/es/collections/outerwear`.
- Al volver atrás: `/collections/outerwear` en inglés, sin `aria-busy` pegado. La página no se restauró desde bfcache (`notRestoredReasons: masked`).

**Móvil (Sartorial 375, envío real).** El cajón abierto ("Menú", `aria-expanded="true"`) muestra el formulario `#LocalizationForm-header-mobile`, con el botón "Actualizar preferencias: English" de 44x44 dentro del viewport. Lo pulsé desde `/es/products/serra-coat` y llevó a `/products/serra-coat` en inglés, con el preview de Sartorial intacto.

**Visibilidad por ancho.** Por debajo de 768 px el formulario de la cabecera está en `display: none` y el del cajón es el visible. Sin scroll horizontal.

**Contraste.** El botón inactivo es rgb(77,75,70) sobre rgb(247,243,234): 7,87:1.

**Sin JS.** El envío que hice fue nativo: `LocalizationForm` solo pone `aria-busy` en `submit` y no lo cancela (`theme.js:3983-3985`), y los botones son `type=submit` de un POST a `/localization`. Sin JS el camino es el mismo.

### 2.2 Fila 79, selector de país y moneda

Lectura del Admin (GraphQL `markets`, `shopLocales`, `shop`):

```text
markets: 1 → "United States" (handle us, ACTIVE, REGION, regiones: US)
shop.enabledPresentmentCurrencies: ["USD"]
shopLocales: en (primario, publicado), es (publicado)
```

Con un solo país, `localization.available_countries.size > 1` es falso y el `<select name="country_code">` no se imprime: 0 en la página, en los dos temas. La condición funciona, pero **el selector no se puede certificar en vivo, y el recálculo de precios en otra moneda tampoco**.

Simulación. Inserté en `#LocalizationForm-header` el marcado exacto de las líneas 52-61, con 3 países, e intercepté el `submit` para que no saliera:

```text
con JS, change a ES → submit sin submitter, datos: return_to=/, country_code=ES (sin language_code)
controles de envío disponibles sin JS: ["language_code=es"]
```

**D2 (P2).** Sin JS no hay forma de enviar solo el país:
- Si hay 2 idiomas, el único botón es el de idioma, que manda `language_code` y además cambia el idioma.
- Si la tienda tiene 1 idioma, no hay ningún control de envío.

El ledger afirma "fallback sin JS" para esta fila, y para el país no es cierto.

Además, el `<select>` usa `onchange="this.form.requestSubmit()"` en línea y no lleva `data-localization-select`. Por eso el listener de `LocalizationForm` (`theme.js:3987-3989`) nunca se engancha.

Parche `harness-6A-001/localization-country-nojs.diff`: cambia el manejador en línea por `data-localization-select`, de modo que el cambio pasa por `submitForm()`, y añade un botón "Update preferences" con `no-js-only` que solo se ve sin JS. Usa la clave `general.localization.update`, que ya existe.

**R1 (decisión, sin diff).** Enviar el formulario al cambiar un `<select>` es un fallo típico de WCAG 3.2.2 (On Input). En Chrome para Windows, las flechas sobre un select cerrado disparan `change` en cada pulsación y recargarían la página a cada tecla. La directiva pide auto-submit. Gemini decide si se mantiene o si se pasa a botón explícito.

---

## 3. Track 3, fila 81: newsletter

### 3.1 Marcado (medido en vivo)

| Página | Formulario | Oculto | Email | Label | Botón |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Couture / 1280 | `NewsletterForm-template--...__newsletter`, POST `/contact#...` | `form_type=customer`, `contact[tags]=newsletter` | `type=email`, `autocomplete=email`, `autocapitalize=off`, `autocorrect=off`, `required`, `aria-required=true`, 344x52 | "Email address" (visually-hidden) | "Subscribe" 119x52 |
| Couture / 1280 | `FooterNewsletter`, POST `/contact#FooterNewsletter` | igual | igual, 271x52 | igual | "Subscribe" 119x52 |
| Couture /es 360 | los dos | igual | 320x52, placeholder "nombre@ejemplo.com" | "Correo electrónico" (visually-hidden) | "Suscribirse" 320x52 |
| Sartorial /es 375 | `FooterNewsletter` (la portada de Sartorial no tiene la sección) | igual | 335x52 | "Correo electrónico" | "Suscribirse" 335x52 |

Sin un envío previo, `aria-invalid` y `aria-describedby` no aparecen. Lo correcto es que solo salgan cuando `form.errors` existe (`newsletter.liquid:44`, `footer.liquid:54`). El botón mide 52 px de alto y 119 px de ancho como mínimo, así que cumple los 44x44.

### 3.2 Envío válido: bloqueado por la protección de Shopify

Con permiso, rellené `test-audit@example.com` en el formulario de la sección y lo envié tres veces: con `click()`, con un clic real y con `requestSubmit()`. No salió ninguna petición a `/contact` (0 en `performance`) ni hubo navegación.

La causa es el script de protección que Shopify inyecta en el storefront, `storefront-forms-hcaptcha`. Hace dos cosas:
- Se engancha a `form[action*='/contact'] input[name=form_type][value=customer]`.
- Cancela el `submit` (`preventDefault`) de cualquier formulario que no se haya "armado" antes con un `focusin` o un `change` de una persona. Después ejecuta hCaptcha.

Mi relleno por script no produce ese `focusin`. Forzarlo para que el captcha me deje pasar es sortear una protección anti-bots, y no lo hice. Resultado: **no se creó ningún cliente**, vacié el campo y la página quedó como estaba.

### 3.3 Envío inválido

No estaba autorizado. En el código:
- `aria-invalid="true"` y `aria-describedby="NewsletterError-{{ section.id }}"` (o `FooterNewsletterError`) solo con `form.errors`.
- El contenedor lleva `role="alert"` y `form.errors | default_errors` (`newsletter.liquid:57-62`, `footer.liquid:67-72`).
- El éxito es un `<p role="status">` (`newsletter.liquid:52-56`, `footer.liquid:62-66`).

### 3.4 Prueba manual para Johandry (2 minutos)

1. En la portada de Couture, escribe `test-audit@example.com` en "Notes from the atelier" y pulsa Subscribe. Anota:
   a. La URL de destino.
   b. Si aparece "Thank you. Your first note will arrive soon." con `role="status"`.
   c. **Si el mensaje aparece también en el newsletter del pie.**
2. Repite con `test-audit@example`: el navegador lo acepta porque no exige dominio de nivel superior. Mira si sale el error con `role="alert"` y si el input queda con `aria-invalid="true"`.
3. Borra luego el cliente `test-audit@example.com` en Clientes.

Riesgo a mirar en el paso 1c. La portada tiene dos formularios `customer`. `form.posted_successfully?` y `form.errors` dependen del tipo de formulario, no de su `id`, así que es probable que los dos muestren el mensaje a la vez. Si pasa, se corrige comparando el ancla de la URL con el id del formulario; preparo el parche cuando se confirme.

---

## 4. Track 4, fila 82: iconos de pago

En vivo, en los dos temas, a 1280, 375 y 360 y en / y /es: `.site-footer__payments` = 0 y `.site-footer__utilities` = 0. La tienda no tiene métodos de pago activos, `shop.enabled_payment_types.size` es 0 y el `if` de `footer.liquid:111` no imprime el contenedor. **El estado vacío es correcto: no queda un envoltorio sin contenido en el DOM.**

Lo que no se puede medir es el SVG real de `payment_type_svg_tag`. Lo simulé: inserté el marcado de `footer.liquid:112-121` con N SVG de 38x24 (el tamaño que emite Shopify), `role="img"` y `<title>`.

| Tema / ancho | Iconos | Filas | Fuera de la lista | Scroll horizontal | axe |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Couture 1280 en | 14 | 1 | 0 | 0 px | - |
| Sartorial 375 es | 14 | 2 | 0 | 0 px | - |
| Couture 360 en | 12 | 2 | 0 | 0 px | 0 violaciones |

H-C (P4): el `aria-label` va en un `<div>` sin rol, donde ARIA 1.2 lo prohíbe y los lectores lo ignoran. El `span.visually-hidden` de al lado ya da el texto, así que no hay pérdida para el usuario. Parche de 1 línea en `footer-payments-label.diff`.

---

## 5. Track 5, fila 63: checkout acelerado

### 5.1 Ficha

`main-product.liquid:632-633` imprime `<shopify-accelerated-checkout recommended="null" fallback="{...buy_it_now...}">`. Sin billeteras activas, Shopify pinta el botón genérico `button.shopify-payment-button__button--unbranded`.

| Tema / ancho / idioma | Botón | Add to cart |
| :--- | :--- | :--- |
| Couture 1280 en | "Buy it now" 397x44, fondo rgb(29,27,24), radio 0 | 397x44 |
| Sartorial 375 es | "Comprar ahora" 335x44 | 335x44, con 12 px de separación |
| Couture 360 en | "Buy it now" 320x44 | 320x44 |

Variantes agotadas, al cargar y al cambiar:

| Producto | Estado | `.product-form__dynamic-checkout` | Add to cart |
| :--- | :--- | :--- | :--- |
| F02 (agotado entero) | carga | `hidden`, no visible | "Sold out", deshabilitado |
| F03 `?variant=` de M (agotada) | carga | `hidden` | "Sold out", deshabilitado |
| F04 Ink/S | carga | visible | "Add to cart" |
| F04 → Camel/S (agotada) | cambio | `hidden` | "Sold out" |
| F04 → Camel/L | cambio | visible | "Add to cart" |
| F04 → Camel/M (agotada) | cambio | `hidden` | "Sold out" |

Camel/S (oculto) y Camel/L (visible) dan lo mismo en Sartorial 375 /es y en Couture 360. En la carga lo controla Liquid (`can_add_to_cart`); al cambiar, `theme.js:817-819` (`container.hidden = !purchaseOptionValid`).

### 5.2 Cajón y /cart

Con permiso añadí 1 Serra Coat desde la ficha (Couture 1280). Se abrió el cajón con 1 artículo y "Checkout" de 455x44.

```text
.cart__dynamic-checkout en el cajón:                 0
/?sections=cart-drawer contiene dynamic-checkout:    false
/cart: artículos 1, .cart__dynamic-checkout 0, botón "Checkout" presente
```

Sin pasarela ni billeteras, `additional_checkout_buttons` es falso y el `if` de `cart-drawer.liquid:500` y `main-cart-items.liquid:219` no imprime el contenedor. **La condición funciona, pero la integración con Shop Pay o PayPal no se puede ver.** Después quité el artículo (`/cart/change.js`, cantidad 0) y el carrito quedó en 0.

### 5.3 Armonía con Add to cart (H-B, P3)

Tamaño, color y radio coinciden. La tipografía no:

```text
Add to cart: Assistant 14px 700 uppercase, letter-spacing 0.84px
Buy it now:  Assistant 16px 500 sin mayúsculas, letter-spacing normal
```

Además, la nota "Delivery times and costs confirmed at checkout" (`.product-trust`) queda a **0 px** del botón, porque `.product-trust { margin: 0 }` anula el margen de flujo.

`pdp-buy-buttons.diff` (solo CSS) da a `--unbranded` la tipografía de `.button` y añade `.product-form + .product-trust { margin-block-start: var(--space-3) }`. Inyectado en vivo (Sartorial 375): los dos botones quedan en 14px/700/uppercase y la nota a 16 px.

---

## 6. Hallazgos

| ID | Prioridad | Qué | Parche |
| :--- | :--- | :--- | :--- |
| D1 | P2 | Listbox de búsqueda con hijos no permitidos (axe critical) y `aria-expanded="true"` con 0 opciones | `ps-listbox-structure.diff` |
| D2 | P2 | Selector de país sin envío posible sin JS; manejador en línea que deja muerto el listener del tema | `localization-country-nojs.diff` |
| R1 | decisión | Auto-submit del país al cambiar (WCAG 3.2.2) | sin diff, lo decide Gemini |
| H-A | P3 | En las sugerencias, `aria-label` en `<s>` (prohibido en el rol deletion) y precio rebajado sin etiqueta. Es el mismo defecto que af6ee6d arregló en la ficha | `ps-price-sr-labels.diff`. Inyectado: el lector de pantalla lee "Precio de oferta $320.00 Precio habitual $380.00" y el visible sigue siendo "$320.00 / $380.00"; axe 0 |
| H-B | P3 | "Buy it now" con otra tipografía y nota pegada al botón | `pdp-buy-buttons.diff` |
| H-C | P4 | `aria-label` en div sin rol en el pie de pagos | `footer-payments-label.diff` |
| H-D | contenido | 21 productos (Serra Coat, Nove Blazer, Wool Waistcoat...) tienen `body_html` principal en español. En `/products/serra-coat` en inglés se lee "Doble faz de lana y cachemira...". Medido con `/products.json`: proporción de palabras funcionales españolas > 0,12 | sin parche: son datos de la tienda, lo decide Johandry |
| H-E | docs | Citas de línea desactualizadas (tabla siguiente) | texto de reemplazo abajo |

H-E. Líneas reales en 2d1fc29 (salida de `grep -n` en §8):

| Dónde | Dice | Real |
| :--- | :--- | :--- |
| Ledger fila 78 | `theme.js:2415-2820`, `base.css:5335-5490` | `class PredictiveSearch` en `theme.js:4004`; CSS desde `base.css:6513` |
| Ledger filas 79 y 80 | `theme.js:2390-2410`, `base.css:5224-5250` | `class LocalizationForm` en `theme.js:3977`; CSS en `base.css:6274-6350` |
| Ledger fila 81 | `newsletter.liquid:1-95`, `footer.liquid:12-32` | `newsletter.liquid:1-104`, `footer.liquid:38-73` |
| Ledger fila 82 | `footer.liquid:66-73` | `footer.liquid:111-122`, CSS `base.css:6388-6400` |
| Ledger fila 63 | `main-product.liquid:596`, `cart-drawer.liquid:491-495`, `main-cart-items.liquid:214-218` | `632-633`, `500-504`, `219-223` |

Texto de evidencia propuesto para la fila 80, si Gemini la pasa a `cumplido`:

> `snippets/localization-selectors.liquid:22-50` (toggle con `aria-current` y `aria-label` "Update preferences: Español"), `sections/header.liquid:127,191`, `assets/theme.js:3977`. Certificado en tienda real (CLAUDE-REPORT-6A-001 §2.1): POST nativo a /localization. Couture 1280: `/collections/outerwear` → `/es/collections/outerwear`. Sartorial 375 en el cajón: `/es/products/serra-coat` → `/products/serra-coat`. Preview conservado, objetivos de 44x44, contraste 7,87:1.

---

## 7. Dictamen por fila

| Fila | Requisito | ¿Apta para `cumplido`? | Justificación | Qué falta para cerrarla |
| :--- | :--- | :--- | :--- | :--- |
| 78 | Búsqueda predictiva | **No** | Todo lo funcional pasa (§1.1 a §1.7), pero axe da una violación critical (D1), y la fila afirma "listbox WAI-ARIA". Los artículos solo se probaron con respuesta sustituida | Aplicar `ps-listbox-structure.diff` y repetir `__psAxe()` en vivo. Opcional: 1 artículo publicado |
| 79 | País y moneda | **No** | La tienda tiene 1 mercado y 1 moneda: el select no existe y el recálculo no se puede ver. Sin JS no hay envío (D2) | Segundo mercado con otra moneda (Johandry), `localization-country-nojs.diff` y decisión sobre R1 |
| 80 | Idioma | **Sí** | Envío real en escritorio y en el cajón móvil, ruta con /es conservada en los dos sentidos, `aria-current` y `aria-label` correctos, POST nativo sin dependencia de JS, 44x44, 7,87:1 (§2.1) | Nada. Solo actualizar la evidencia (texto en §6) |
| 81 | Newsletter | **No** | Marcado y objetivos correctos (§3.1). El éxito (`role=status`) y el error (`aria-invalid`, `role=alert`) no se vieron en vivo: el válido lo retuvo hCaptcha y el inválido no estaba autorizado | Prueba manual de §3.4; si los dos formularios muestran el mensaje, un parche más |
| 82 | Iconos de pago | **No** | Estado vacío correcto en vivo. El render de `payment_type_svg_tag` no existe en esta tienda; lo del desborde viene de una simulación | Método de pago de prueba activo (Johandry) y repetir `__pay()` a 1280, 375 y 360 |
| 63 | Checkout acelerado | **No** | La ficha está certificada, con ocultación en agotado (§5.1). Cajón y /cart no muestran botones porque no hay pasarela (§5.2); el propio ledger pide "pasarela activa" | Método de pago de prueba o billetera activa, y repetir §5.2 |

---

## 8. Verificación

```text
$ git rev-parse --short HEAD
2d1fc29

$ grep -n "class PredictiveSearch\|class LocalizationForm\|    renderResults(\|container.hidden = !purchaseOptionValid" assets/theme.js
818:        container.hidden = !purchaseOptionValid;
3977:  class LocalizationForm extends ThemeElement {
4004:  class PredictiveSearch extends ThemeElement {
4144:    renderResults(resultGroups, query) {

$ grep -n "onchange" snippets/localization-selectors.liquid
55:          <select id="{{ localization_form_id }}-country" class="localization-form__country" name="country_code" onchange="this.form.requestSubmit()">

$ grep -n "enabled_payment_types\|payment_button\|additional_checkout_buttons" sections/footer.liquid sections/main-product.liquid sections/cart-drawer.liquid sections/main-cart-items.liquid
sections/footer.liquid:111:  {%- if shop.enabled_payment_types.size > 0 -%}
sections/main-product.liquid:633:                      {{ form | payment_button }}
sections/cart-drawer.liquid:500:              {%- if additional_checkout_buttons -%}
sections/main-cart-items.liquid:219:            {%- if additional_checkout_buttons -%}

$ for d in ps-listbox-structure ps-price-sr-labels localization-country-nojs footer-payments-label pdp-buy-buttons; do
    patch -p1 --binary --dry-run < agent-comms/outbox-claude/harness-6A-001/$d.diff >/dev/null && echo "$d: dry-run OK"; done
ps-listbox-structure: dry-run OK
ps-price-sr-labels: dry-run OK
localization-country-nojs: dry-run OK
footer-payments-label: dry-run OK
pdp-buy-buttons: dry-run OK

# copia aparte de theme.js, base.css y los 3 Liquid, con los 5 diffs aplicados en secuencia
$ node --check assets/theme.js && echo combo js ok
combo js ok

# copia completa del tema (assets, config, layout, locales, sections, snippets, templates) fuera del repo
$ node_modules/.bin/shopify theme check --path <copia sin parches>     (CLI 4.8.0)
exit 0, 0 ofensas
$ node_modules/.bin/shopify theme check --path <copia con los 5 diffs>
76 files inspected with no offenses found.

# Admin GraphQL (lectura): markets, shopLocales, shop.enabledPresentmentCurrencies
markets: [{name: "United States", handle: "us", status: ACTIVE, type: REGION, regions: [US]}]
shopLocales: [en primary, es]; enabledPresentmentCurrencies: [USD]
```

Qué demuestra esto:
- Las citas de línea.
- Que los 5 parches aplican sobre master, juntos y en el orden de la lista.
- Que el JS resultante es sintácticamente válido y que Theme Check no encuentra ofensas con los parches aplicados.
- Que la tienda tiene 1 mercado y 1 moneda.

Qué no demuestra:
- No ejecuté `gates:sanity` ni `gates:package` (no se corren en el equipo de Johandry).
- El comportamiento de D1, H-A y H-B está probado inyectando el mismo código en la página viva, no con el tema desplegado.

---

## 9. Material

`agent-comms/outbox-claude/harness-6A-001/`:

| Archivo | Contenido |
| :--- | :--- |
| `probes-6A-001.js` | Sondas de los 5 tracks (`__psState`, `__psBurst`, `__psRender`, `__kb`, `__psMockArticle`, `__psMobile`, `__psAxe`, `__loc`, `__countrySim`, `__nl`, `__pay`, `__paySim`, `__dc`, `__pick`) |
| `ps-listbox-structure.diff` | D1: snippets/predictive-search.liquid, assets/theme.js, assets/base.css |
| `localization-country-nojs.diff` | D2: snippets/localization-selectors.liquid |
| `ps-price-sr-labels.diff` | H-A: snippets/predictive-search.liquid, assets/theme.js |
| `pdp-buy-buttons.diff` | H-B: assets/base.css |
| `footer-payments-label.diff` | H-C: sections/footer.liquid |

Estado en que quedó la tienda:
- Idioma de la sesión en EN, carrito vacío, preview en Couture y viewport sin emulación.
- Ningún cliente creado y ningún cambio en el Admin.

---

## 10. Afirmaciones falsables

1. Al abrir la búsqueda en Couture a 1280, el disparador pasa a `aria-expanded="true"`, el panel pierde `inert` y `aria-hidden`, y 9 hijos de `body` quedan con `inert`.
2. Con el rAF disponible, el foco cae en `input[type=search]` al abrir.
3. Escape, el botón Close y el `pointerdown` en el overlay cierran el panel y devuelven el foco a "Search".
4. Una ráfaga de 4 eventos `input` produce 1 sola petición a `/search/suggest.json` con el término final.
5. Con 1 carácter no sale ninguna petición.
6. La primera sugerencia de "coat" es "Serra Coat $1,890.00 In stock", con imagen `srcset` 72/144/216 y `sizes="72px"`.
7. "the" devuelve Products 3, Collections 3 y Pages 2, y ningún artículo, porque la tienda no tiene artículos publicados.
8. "poplin" muestra "F02 Sold Out Poplin Shirt" en último lugar, con `data-sold-out` y el texto "Sold out" (en /es, "Agotado").
9. `xyznoresults999` muestra exactamente `data-no-results-text` y el estado "0 suggestions available".
10. Un término de 75 caracteres no deja elementos fuera del panel ni scroll horizontal a 1280, 375 y 360.
11. Con teclas reales, End lleva a option-7, ArrowDown desde la última vuelve a option-0 y ArrowUp desde la primera va a option-7.
12. Enter sobre una opción navega a su URL; Enter sin opción envía a `/search` (o `/es/search`) con `q`, `options[prefix]` y `type`.
13. axe 4.10.2 da `aria-required-children` (critical) sobre el listbox, con y sin resultados.
14. Con el código de `ps-listbox-structure.diff`, axe da 0 violaciones y el teclado no cambia.
15. El ES de la cabecera lleva de `/collections/outerwear` a `/es/collections/outerwear` con 1 redirección y conserva el preview de Couture.
16. El botón inactivo de idioma tiene `aria-label="Update preferences: Español"` y mide 44x44.
17. La tienda tiene 1 mercado (US) y solo USD; no hay ningún `select[name=country_code]` en la página.
18. Con el marcado del país insertado, sin JS el único control de envío es `language_code=es`.
19. Los dos formularios de newsletter de la portada de Couture llevan `contact[tags]=newsletter`, `autocomplete=email`, `autocapitalize=off`, `autocorrect=off`, un label visually-hidden y un botón de 52 px de alto.
20. Un `submit` sin interacción previa del usuario en esos formularios lo cancela el script `storefront-forms-hcaptcha` de Shopify y no sale ninguna petición a `/contact`.
21. `.site-footer__payments` no existe en ninguna página, tema ni ancho de esta tienda.
22. Con 14 iconos de 38x24 simulados no hay desborde a 1280 (1 fila) ni a 375 (2 filas).
23. En la ficha, `payment_button` pinta "Buy it now" de 44 px de alto y del mismo ancho que Add to cart a 1280, 375 y 360.
24. F04 Camel/S y Camel/M ocultan el botón dinámico, y Camel/L lo muestra.
25. F02 y F03 con variante agotada en la URL cargan con el botón dinámico `hidden`.
26. Con 1 artículo en el carrito, ni el cajón ni /cart tienen `.cart__dynamic-checkout`.
27. "Buy it now" usa 16px/500 sin mayúsculas y Add to cart 14px/700 en mayúsculas.
28. La nota de envío queda a 0 px del botón de pago dinámico.
29. 21 productos tienen el `body_html` principal en español.
30. Los 5 diffs aplican con `patch -p1 --dry-run` sobre 2d1fc29, el `theme.js` resultante pasa `node --check` y Theme Check (CLI 4.8.0) da 0 ofensas en 76 archivos con los 5 aplicados.
