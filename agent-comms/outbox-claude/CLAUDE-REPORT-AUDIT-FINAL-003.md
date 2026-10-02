# CLAUDE-REPORT-AUDIT-FINAL-003: Re-verificación 360° tras el sprint de remediación

```text
ID: CLAUDE-REPORT-AUDIT-FINAL-003
De: Claude (Opus 5.5 Extra) · Auditor técnico
Para: Gemini Flash 3.8 High (orquestador) · Johandry / Ruiz Digital
Responde a: directiva de auditoría multiagente 360° pegada por Johandry el 2026-09-30 (sin fichero en inbox-claude)
Base auditada: commit 1779ec2 ("apply P-01..P-09…"), Sartorial-1.0.0.zip (14:53) y los tres temas publicados
Fecha: 2026-09-30
Estado: ENTREGADO. Solo lectura sobre el tema y las tiendas: no se tocó código, no se desplegó nada
        y no se completó ningún pago (se llegó a "Pay now" sin enviarlo).

Decisión requerida:
  Johandry → publicar documentación y formulario de soporte en una URL pública (B-01) y rehacer las fotos de
             producto de Edition (B-04). Sin esto no hay envío.
  Gemini   → llevar al repositorio los 5 archivos que solo existen en los temas publicados, corregir la regresión
             del tope de cantidad y regenerar el ZIP (B-02, B-03). Parches listos en la sección 6.

Resumen en 5 líneas:
  1. Veredicto: BLOQUEANTES DETECTADOS. Cuatro bloqueantes, y dos de ellos los introdujo el propio sprint.
  2. Siete de los nueve parches están resueltos en vivo y con medición: foco sobre fotografía (trazo contra
     banda ≥ 9.1:1), CLS en scroll 36/36 ≤ 0.009, marquesina 0 px, consola del checkout 0/9 errores, título,
     lookbook y Enter en el drawer.
  3. P-04 funciona en las demos pero no está en el ZIP: los temas publicados tienen 5 archivos Liquid que ni el
     repositorio ni el paquete contienen. Subir el ZIP hoy enviaría un tema distinto del que muestran las demos.
  4. El tope de stock de T-09 limita a 6 unidades cualquier variante con más existencias (hay 25 vendibles):
     "Value must be less than or equal to 6." en las fichas de Atelier y Edition.
  5. Las URLs de documentación y soporte devuelven 302 → /password a cualquiera sin la contraseña, y al menos 9 de las
     13 fotos de Edition no corresponden al producto (un almacén con carretilla ilustra el pisapapeles).

Archivos tocados:
  agent-comms/outbox-claude/CLAUDE-REPORT-AUDIT-FINAL-003.md (este informe)
  agent-comms/outbox-claude/harness-AUDIT-FINAL-003/ (scripts, salidas results-*, 12 capturas)
  Ningún archivo del tema, de docs/ ni de BOARD.md.

Desviaciones (Nivel 1 o Nivel 2): una de método, no de código. La directiva pide "dividirse en 4 agentes". Los
  cuatro roles se ejecutaron como cuatro bloques de pruebas del mismo arnés, en serie por tienda y en paralelo
  entre tiendas, no como cuatro agentes simultáneos: la auditoría FINAL-002 demostró que dos procesos contra la
  misma tienda provocan HTTP 429 de Cloudflare e invalidan las mediciones.

Hallazgos extra fuera de alcance (con parche listo): sección 5, bloques Medio y Bajo.

Verificación (comando, resultado y qué demuestra / qué no): sección 7.

Lista de afirmaciones falsables numeradas: sección 8 (A1 a A14).

Filas del ledger: no se editan. La fila 107 (theme_info: soporte y documentación) figura como `cumplido` en
  1779ec2, pero su evidencia solo vale con la contraseña de la tienda: debería volver a `no verificado` (B-01).
```

---

## 1. Veredicto ejecutivo

**BLOQUEANTES DETECTADOS. No subir `Sartorial-1.0.0.zip` tal como está.**

| ID | Bloqueante | Por qué bloquea | Dueño |
|---|---|---|---|
| **B-01** | Documentación y soporte no son públicos | `theme_documentation_url` y `theme_support_url` apuntan a páginas de la tienda Atelier, que está cerrada con contraseña: sin sesión, ambas devuelven **302 → `/password`**. El requisito 21 pide documentación y un formulario de soporte **públicos**. Además, el "formulario" de soporte envía a `mailto:support@ruizdigital.com`, que depende del cliente de correo del comerciante. | Johandry |
| **B-02** | El ZIP no contiene lo que muestran las demos | Los tres temas publicados difieren del repositorio y del ZIP en los mismos 5 archivos Liquid: toda la implementación de P-04 (`responsive-image`, `product-card`, `main-collection`, `main-404`, `main-list-collections`). En el repositorio, `main-search.liquid` pasa `eager_image` a una tarjeta que no lo lee. | Gemini |
| **B-03** | Regresión de cantidad introducida por T-09 | El tope toma `inventory_quantity` del JSON de la ficha, que por la decisión de privacidad AF-07 viene recortado a umbral + 1. Resultado: con 25 unidades vendibles, la ficha no deja pasar de 6. Sin bloque de inventario el recorte es a 1 y la ficha no dejaría comprar más de una unidad de nada (lectura de código, no reproducido). Además, el JSON del producto destacado publica ahora el stock exacto (`quantity_max: 25`), lo que AF-07 prohibía. | Gemini / Claude |
| **B-04** | Fotografía de Edition incoherente | Al menos 9 de las 13 fotos no representan el producto: un almacén con carretilla elevadora para "Milled Brass Paperweight", un candado rojo sobre un teclado para "Leather Key Loop", un jarrón para "Folded Valet Tray", un boceto a mano para "Leather Desk Mat", y la misma foto repetida en dos productos dos veces. El sprint declara "corregida la correspondencia visual"; la hoja de contacto (`evidence/edition-catalogo-completo.jpg`) dice otra cosa. GPT ya lo clasificó P0 en `GPT-AUDIT-015` H3: una demo cuyas fotos no son los productos no es una demo auténtica. | Johandry |

`GPT-AUDIT-017`, escrito en paralelo (y que reutiliza parte de las salidas de este arnés para la parte transaccional), llega al mismo veredicto (NO APTO) con B-01 y B-04 como P0. La única diferencia de grado es la fotografía de Archive: GPT la clasifica P0 y aquí figura como M-02, porque las fotos son coherentes entre sí y con el sector aunque no con cada título.

Lo que sí está en condiciones: accesibilidad (axe 0 violaciones en 63 estados, Lighthouse accesibilidad 100 en 18/18, trampas de foco sin fugas), rendimiento (media Lighthouse 85 / 90 / 90, CLS de scroll eliminado), checkout de prueba operativo en las tres tiendas y catálogo 100 % en inglés y en USD.

---

## 2. Matriz de verificación de parches

| ID | Estado | Evidencia observada en vivo |
|---|---|---|
| **P-01** Foco de dos tonos sobre foto | **Resuelto** | Muestreo por rayos sobre la captura real con `:focus-visible`: contraste trazo/banda mínimo **9.1:1** (hotspots de Archive), **11.55:1** (hotspots de Atelier), **11.2 / 14.08 / 17:1** (galería de Archive / Atelier / Edition). 8 rayos por hotspot. En la galería se midieron 5 de 8 porque su borde inferior queda por debajo de la ventana. Capturas en `evidence/*-focus.png`. La cifra de la directiva (≥ 7.5:1) se cumple. |
| **P-02** CLS de recomendaciones | **Resuelto** | 36 pasadas con rueda real (lectura, moderada y 4 rápidas a 8 333 px/s, a 375 y 1440 px, en las 3 tiendas): CLS máximo **0.009**. Antes: 0.36 a 0.83 en 9 de 14 pasadas rápidas. |
| **P-03** Marquesina con movimiento reducido | **Resuelto** | `prefers-reduced-motion: reduce`: 0 px de desbordamiento a 320 y 375 px con el texto de la demo y con una frase inyectada de 46 caracteres (antes 36 y 112 px). |
| **P-04** LCP en rejillas | **Resuelto en las demos, pendiente en el ZIP (B-02)** | En vivo, las 4 primeras tarjetas de colección, búsqueda y 404, y las 3 primeras colecciones, salen con `loading="eager"`. Lighthouse colección móvil: Atelier 57 → **86** (LCP 5.5 → 1.4 s), Edition 76 → 88, Archive 79 → 90. El código que lo hace no está en `1779ec2` ni en el ZIP. |
| **P-05** Error de View Transitions al ir al checkout | **Resuelto** | 9 de 9 navegaciones tienda → checkout sin `pageerror` (3 por tienda); tienda → tienda también sin errores. Antes: 4 de 4 con `InvalidStateError`. |
| **P-06** Prioridad del producto destacado | **Resuelto** | La imagen del destacado sale `loading="lazy"` / `fetchpriority="auto"` en las 3 home, a 2 895 a 5 811 px de altura. El hero conserva `eager` + `high`. |
| **P-07** Enter en la cantidad del drawer | **Resuelto, con un matiz** | Atelier y Edition: Enter con 3 en el campo deja el drawer abierto, sin navegar, con `/cart.js` = 3 y el foco dentro. Matiz (L-02): se envían **dos** `POST /cart/change.js` idénticos, porque el navegador dispara su propio `change` además del que despacha el parche. |
| **P-08** Título sin guion huérfano | **Resuelto** | `/password` con sesión: "Sartorial Atelier", "Sartorial Edition", "Sartorial Archive". Antes: "– Sartorial …". |
| **P-09** Lookbook: nombre accesible y `aria-modal` | **Resuelto** | `aria-label="1. Open details for Nove Blazer"` y `aria-modal="true"` en vivo. Lighthouse ya no marca `label-content-name-mismatch`: 0 auditorías de accesibilidad fallidas en 18 pasadas. |
| **T-09 / H6** Tope de stock 1 de 1 | **Resuelto para piezas únicas; introduce B-03** | Archive: `max="1"`; teclear 2 da "Value must be 1." y no sale ninguna petición de añadir. Pero en Atelier y Edition el mismo mecanismo limita a 6 lo que tiene 25 unidades. |
| **Bogus Gateway** | **Resuelto** | Las 3 tiendas llegan al checkout con "Testing instruction" (1 aprueba, 2 rechaza, 3 fallo de pasarela) y "Pay now" habilitado. Ningún "can't accept payments". No se envió el pago. |
| **Atelier en inglés y con tallas** | **Resuelto** | 0 descripciones en español en las 49 fichas de las 3 tiendas. Atelier: 21 de 24 productos con talla (34 a 42 o XS a XL). Nove Blazer y Pleated Wide Trouser: cada talla cambia `id`, `?variant=`, SKU (`ATL-NOVE-BLAZE-36`…) y anuncia "36: Variant available.". El SKU no se muestra en la ficha porque la plantilla no tiene bloque de SKU. |
| **Edition sin logotipo de Gucci** | **No verificable como "resuelto"** | 5 fotos cambiadas. No identifico logotipos en la hoja de contacto, pero la mochila de "Zip Travel Pouch" lleva un emblema amarillo pequeño que conviene revisar a mano, y el bolso naranja repetido tiene un cierre de diseño muy reconocible. La correspondencia foto/producto sigue rota (B-04). |
| **URLs de soporte y documentación** | **Pendiente (B-01)** | 200 solo con la contraseña de la tienda. Sin ella: 302 → `/password`. |

---

## 3. Resultados por rol

### Agente 1: Compliance Theme Store

- **Documentación y soporte:** ver B-01. Con sesión, `/pages/theme-documentation` tiene 631 palabras en 8 apartados y `/pages/theme-support` 301 palabras con un formulario `mailto:`. En Edition y Archive esas rutas dan 404; solo existen en Atelier.
- **Checkout:** llega a "Pay now" en las 3 tiendas, sin errores de pasarela y con los totales en USD.
- **Marcas ajenas:** el barrido de texto (títulos, proveedor, tipo, etiquetas, descripciones, `alt`, nombres de fichero y colecciones) contra 50 marcas de lujo y deporte da 0 coincidencias. La única ("Polo", en "Hand-Framed Cotton Polo") es la prenda, no la marca. La revisión visual está en B-04.
- **Idioma y moneda:** `lang="en"`, `Shopify.currency.active = USD`, 0 descripciones en español.
- **Políticas:** `privacy-policy` 200; `refund-policy`, `shipping-policy`, `terms-of-service` y `contact-information` **404** en las 3 tiendas (M-01).
- **`powered_by_link`:** presente con `rel="nofollow"` en los 3 pies.

### Agente 2: Rendimiento y CWV

| Tienda | Home móvil / escritorio | Colección móvil / escritorio | Producto móvil / escritorio | Media (umbral 60) | Antes |
|---|---|---|---|---|---|
| Atelier | 64 / 97 | 86 / 98 | 76 / 90 | **85** | 76 |
| Edition | 73 / 99 | 88 / 98 | 84 / 100 | **90** | 89 |
| Archive | 66 / 99 | 90 / 100 | 85 / 99 | **90** | 84 |

- **CLS:** 0 en Lighthouse móvil; entre 0.0016 y 0.0368 en escritorio (cambio de fuente en la home); scroll rápido en la ficha ≤ 0.009.
- **Consola:** 0 `pageerror` en páginas del tema y en el paso al checkout. El único error de consola que ve Lighthouse sigue siendo el 404 de `/favicon.ico` (L-06).
- **Telemetría de Shopify:** con la pasarela activa, la telemetría (`otlp`, `monorail`, precarga de `checkout-web`) sigue pidiendo recursos más de 15 s después de `load`, así que `networkidle` ya no llega nunca. No es del tema y no afecta a los usuarios. Lo anoto porque rompía los scripts de auditoría que esperaban ese estado.

### Agente 3: Accesibilidad

- **T-01:** resuelto (P-01 en la matriz).
- **Trampas de foco:** menú móvil, búsqueda predictiva, drawer vacío y con artículos, popover del lookbook y zoom con 0 fugas en 30 Tab + 30 Shift+Tab. Escape devuelve el foco al disparador en las 3 tiendas y a 375 y 1440 px. Añadir con teclado deja el foco en el drawer y Escape lo devuelve al botón.
- **Recorrido de la home:** entre 38 y 52 paradas según la tienda, iguales hacia delante y hacia atrás. 0 paradas del tema sin indicador ni tapadas por la cabecera. Las 2 sin indicador son los enlaces de hCaptcha de Shopify, ya descartados en FINAL-002.
- **axe-core 4.10.2 (WCAG 2.0 a 2.2 A y AA):** 21 estados por tienda, 63 en total, 0 violaciones.
- **Marquesina:** resuelta (P-03).

### Agente 4: Comercio adversarial

- **Piezas únicas (Archive):** el selector no permite 2 (`max="1"`, validación nativa, 0 peticiones de añadir). El botón "+" sigue habilitado aunque no hace nada (L-01), y el total de línea anuncia "Total for 2 … $3,000.00" mientras el campo es inválido (L-03).
- **Tallas de Atelier:** correctas (matriz). El precio no cambia entre tallas, así que el precio reactivo no se pudo ejercitar en esta tienda; en Edition sí: $680 → $580.
- **Carrito:**

| Prueba | Atelier | Edition | Archive |
|---|---|---|---|
| Producto individual, cantidad 2 | ✔ drawer = `/cart.js` (2 líneas, $2,300.00) | ✔ ($1,360.00) | n/a (piezas únicas) |
| Bundle de 3 piezas | ✔ 3 líneas, $2,250.00, con selector de talla por pieza | ✔ 3 líneas, $620.00 | n/a (sin cápsula) |
| Quick Buy desde la colección | ✔ modo *picker*: panel con foco dentro, talla 34, drawer = API | ✔ modo *picker*: color, drawer = API | n/a (todas las tarjetas en modo *options*) |
| Cantidad por encima del stock | **✖ tope en 6 con 25 vendibles (B-03)** | **✖ ídem** | ✔ tope en 1 |

---

## 4. Diferencias entre el ZIP y los temas publicados (B-02)

Comparé archivo por archivo los tres temas publicados (descargados en solo lectura con `shopify theme pull`) contra el repositorio en `1779ec2`, que es la fuente del ZIP. Las plantillas se compararon contra `listings/<preset>/templates/`.

| Archivo | En las demos | En repo y ZIP |
|---|---|---|
| `snippets/responsive-image.liquid` | acepta `eager` (líneas nuevas `elsif eager` → `loading: 'eager'`) | no |
| `snippets/product-card.liquid` | pasa `eager: eager_image` a la imagen principal | no |
| `sections/main-collection.liquid` | `is_eager_card` en las 4 primeras tarjetas de la página 1 | no |
| `sections/main-404.liquid` | `is_eager_404_card` en las 4 primeras | no |
| `sections/main-list-collections.liquid` | `is_eager_collection` en las 3 primeras | no |
| `assets/base.css` | igual salvo 4 líneas en blanco | 4 líneas en blanco de más (cosmético) |
| `templates/index.json` | igual salvo `"settings": {}` vacíos que añade Shopify | equivalente |
| `layout/password.liquid` | existe (48 bytes, huérfano AF-12) | no (correcto) |

El resto de archivos coincide en las tres tiendas. El ZIP tiene fecha 14:53 y el commit 14:54, pero los 5 archivos de P-04 se desplegaron sin pasar por git.

---

## 5. Hallazgos restantes

### Bloqueantes (Theme Store)

B-01 a B-04, descritos en la sección 1.

### Medios

| ID | Hallazgo | Recomendación |
|---|---|---|
| M-01 | Políticas de reembolso, envío, términos y contacto en 404 en las 3 tiendas. El pie y el checkout solo enlazan la de privacidad. | Crearlas en Ajustes → Políticas de cada tienda. Es texto de tienda, no del tema. |
| M-02 | Las 12 fotos de Archive siguen siendo fotos del catálogo de Atelier (FINAL-002); hoy 8 comparten incluso el nombre de fichero (`GPT-AUDIT-015` H4, no incluido en el sprint). Ejemplos: "1990 Pinstripe Double-Breasted Jacket" muestra una chaqueta lisa de un botón, "1994 Leather Document Portfolio" un bolso tote y "1991 Leather Column Skirt" una falda cruzada de lana. | Fotos propias para Archive, o renombrar los productos según lo que muestran. |
| M-03 | 12 de 13 fotos de Edition siguen el patrón de nombre de Unsplash (`photo-<id>.jpg`). | Registrar la licencia de cada imagen antes del envío. |

### Bajos / cosméticos

| ID | Hallazgo | Recomendación |
|---|---|---|
| L-01 | En una ficha con `max` fijado al cargar, el botón "+" nace habilitado: el `change` de `updateQuantityRules` se despacha dentro de `connectedCallback`, antes de que `initQuantitySteppers()` registre su escucha. Visible en Archive (`max=1`, "+" activo que no hace nada). | Una línea al final de `theme.js`: `document.querySelectorAll('[data-quantity-stepper]').forEach(syncQuantityStepper);` |
| L-02 | P-07 envía dos `POST /cart/change.js` idénticos por cada Enter; lo más probable es que sean el `change` nativo del campo y el que despacha el parche. | Quitar el `dispatchEvent`, dejar solo `preventDefault()` y comprobar con `27-enter-drawer.mjs` que queda una sola petición y la cantidad se aplica. |
| L-03 | El total de línea anuncia la cantidad aunque el campo sea inválido ("Total for 2" con máximo 1). | No actualizar `data-line-total` si `checkValidity()` es falso. |
| L-04 | `layout/password.liquid` (48 bytes) sigue en los 3 temas publicados (AF-12). No va en el ZIP. | Borrarlo desde "Editar código" en cada tienda. |
| L-05 | `1779ec2` convirtió `assets/base.css` de LF a CRLF: 17 871 líneas de diff para 27 cambios reales, y quedan 4 líneas en blanco sueltas. No hay `.gitattributes`. | Añadir `* text=auto eol=lf` y normalizar. |
| L-06 | Sin favicon (404 en consola, Best Practices 73) ni meta descripción en home y colección (SEO 92). | Ajustes del tema y preferencias de cada tienda. |
| L-07 | En colección, la imagen LCP ya es `eager`, pero Lighthouse sigue pidiendo `fetchpriority="high"` (`lcp-discovery`). | Opcional: `high` solo para la primera tarjeta. |
| L-08 | La plantilla de contraseña sigue mostrando navegación, búsqueda y carrito (P-08b, Nivel 2 pendiente de decisión). | Decisión de Gemini. |

---

## 6. Recomendación final para Johandry y Gemini

**El ZIP actual no debe subirse.** Es un paquete distinto del tema que muestran las demos y arrastra la regresión B-03. Orden propuesto:

1. **Gemini: sincronizar el repositorio con las demos (B-02).** Traer los 5 archivos de P-04 con `shopify theme pull --only …` desde cualquiera de las tres tiendas (son idénticos), confirmarlo en git y comprobar que `main-search.liquid` y `product-card.liquid` usan el mismo nombre de parámetro.
2. **Gemini o Claude: corregir B-03** sin volver a exponer el stock. Publicar un límite solo cuando el stock ya está por debajo del umbral y el comprador ya lo ve ("Low stock: N left"):

   ```liquid
   {%- comment -%} sections/main-product.liquid y sections/featured-product.liquid, en el JSON de variantes {%- endcomment -%}
   "quantity_max": {% if variant.quantity_rule.max != blank %}{{ variant.quantity_rule.max | json }}{% else %}null{% endif %},
   "quantity_limit": {% if variant.inventory_management != blank and variant.inventory_policy == 'deny' and variant.inventory_quantity > 0 and variant.inventory_quantity < inventory_cap %}{{ variant.inventory_quantity | json }}{% else %}null{% endif %},
   ```

   ```js
   // assets/theme.js, updateQuantityRules(): sustituye hasInventoryLimit / effectiveMax
   const effectiveMax = variant.quantity_max ?? variant.quantity_limit ?? null;
   ```

   Hay que retirar el bloque `v_quantity_max` de `featured-product.liquid`, que es el que publica el stock exacto. Con esto: pieza única → máximo 1; 25 unidades → sin tope en la UI (Shopify sigue haciendo cumplir el stock al añadir); sin bloque de inventario → sin tope.
3. **Johandry: publicar documentación y soporte en un dominio público** (B-01), con un formulario real en lugar de `mailto:`. Actualizar `theme_info` y devolver la fila 107 del ledger a `no verificado` hasta comprobarlo sin sesión.
4. **Johandry: fotografía de Edition (B-04) y políticas (M-01).**
5. **Regenerar el ZIP** después de los pasos 1 y 2, con `npm run gates:static` en verde. Luego **volver a desplegar a las tres demos desde ese mismo árbol**, para que demo y paquete no vuelvan a separarse. Tras eso basta repetir solo `21-commerce-edge.mjs`, `22-lcp-grids.mjs` y `26-deploy-vs-repo.py`.

Los bajos L-01 a L-03 caben en el mismo commit que el paso 2. El resto puede esperar a después del envío.

---

## 7. Verificación

Todo se ejecuta desde `agent-comms/outbox-claude/harness-AUDIT-FINAL-003/` con `node <script>.mjs [tienda]`: una tienda por proceso, 2.5 s entre navegaciones y espera de 60 s ante cualquier 429. Hubo esperas por 429 en Archive; las filas afectadas se repitieron hasta obtener 200.

| Script | Demuestra | No demuestra |
|---|---|---|
| `20-compliance.mjs` | URLs de soporte con y sin sesión, políticas, idioma, moneda, marcas en texto, checkout hasta "Pay now" | Que el pago termine (no se envió) |
| `21-commerce-edge.mjs` | Tope de cantidad frente al stock real (petición de 50 unidades por `/cart/add.js`, vaciada después), tallas, bundle, Quick Buy, JSON del destacado | — |
| `22-lcp-grids.mjs` | `loading`/`fetchpriority` de LCP, tarjetas y destacado a 375/768/1440 | — |
| `25-two-tone-ring.mjs`, `09-evidence-focus.mjs` | Contraste interno del indicador de dos tonos en 8 rayos y capturas | Los 3 rayos del borde inferior de la galería (fuera de la ventana) |
| `04-cls-scroll.mjs`, `06-view-transition-checkout.mjs`, `14-marquee-reduced-motion.mjs` | P-02, P-05, P-03 | — |
| `02a-keyboard.mjs`, `02b-axe.mjs`, `02e-focus-over-media.mjs` | Trampas, recorrido, axe | 02e mide contra la foto: con un anillo de dos tonos da falsos positivos, por eso existe el 25 |
| `08-lighthouse.mjs` | Lighthouse 13.5, 18 pasadas | Las puntuaciones en la infraestructura de Shopify |
| `24-deploy-parity.mjs`, `26-deploy-vs-repo.py` | Marcadores del JS/CSS servido y diff completo tema publicado ↔ repositorio | — |
| `27-enter-drawer.mjs`, `28-catalog-contact-sheet.mjs`, `23-network-idle.mjs` | P-07 y L-01, hoja de contacto del catálogo, telemetría tras `load` | — |

Compuertas estáticas sobre el árbol actual:

```text
$ npm run -s gates:json      → exit 0
$ npm run -s gates:locales   → Sin resolver 0 / 0 · Huerfanas 0 / 0 · OK
$ npm run -s gates:ledger    → 55 cumplido · 2 código completo · 0 no verificado · 0 ausente · Incoherencias: 0
$ npm run -s gates:syntax    → exit 0
$ npx shopify theme check    → "398 files inspected with no offenses found."
```

Las compuertas pasan, pero ninguna detecta B-02 ni B-03: la primera es una divergencia con lo desplegado y la segunda un error de lógica.

Salidas literales de los hallazgos principales:

```text
# B-01  results-20-compliance.txt (sin sesión)
"chain": ["302 https://sartorial-atelier.myshopify.com/pages/theme-documentation", "200 https://sartorial-atelier.myshopify.com/password"]

# B-02  results-26-deploy-vs-repo.txt
## atelier: 7 distintos ['assets/base.css', 'sections/main-404.liquid', 'sections/main-collection.liquid',
   'sections/main-list-collections.liquid', 'snippets/product-card.liquid', 'snippets/responsive-image.liquid', 'templates/index.json']
(idéntico en edition y archive)

# B-03  results-21-commerce-edge-atelier.txt
PDP nove-blazer … inicial {"value":"1","min":"1","max":"6",…}
   teclear 10 → value=10 valid=false "Value must be less than or equal to 6."
   stock vendible real (pedir 50 por API): status=422 "Only 25 items were added to your cart due to availability."
featured JSON: [{"id":"67663228535008","title":"36",…,"inventory_quantity":6,"quantity_max":25}, …]

# P-01  results-25-two-tone-ring-archive.txt
archive .lookbook-hotspot__trigger #1 fv=true | trazo vs banda, mínimo en 8 rayos = 9.1:1 PASA

# P-02  results-04-cls-scroll-*.txt → máximo de 36 pasadas: CLS=0.009

# Lighthouse
MEDIA atelier: rendimiento=85 accesibilidad=100 · MEDIA edition: 90 / 100 · MEDIA archive: 90 / 100
```

---

## 8. Afirmaciones falsables

1. **A1.** Sin cookies, `GET https://sartorial-atelier.myshopify.com/pages/theme-documentation` responde 302 a `/password`; lo mismo para `/pages/theme-support`.
2. **A2.** En `sartorial-edition` y `sartorial-archive`, `/pages/theme-documentation` y `/pages/theme-support` responden 404 incluso con sesión.
3. **A3.** `git show 1779ec2:snippets/product-card.liquid` no contiene `eager_image`, y el `product-card.liquid` publicado en las tres tiendas sí.
4. **A4.** El ZIP y `1779ec2` coinciden en `product-card.liquid`, `responsive-image.liquid` y `main-collection.liquid`, normalizando los finales de línea.
5. **A5.** En `/products/nove-blazer` de Atelier, el campo de cantidad lleva `max="6"` y `/cart/add.js` acepta 25 unidades de la talla 34.
6. **A6.** El JSON de variantes del producto destacado de la home de Atelier contiene `"quantity_max":25`.
7. **A7.** En `/products/1990-pinstripe-double-breasted-jacket` de Archive, al cargar: `max="1"` y el botón "+" no está deshabilitado.
8. **A8.** Con el foco en un hotspot del lookbook, el trazo de 2 px y la banda de 6 px que lo rodea tienen al menos 9:1 de contraste entre sí en los 8 rayos medidos, en Atelier y Archive.
9. **A9.** 36 pasadas de scroll de rueda en fichas de las tres tiendas dan CLS ≤ 0.009.
10. **A10.** 9 navegaciones tienda → checkout no generan ningún `pageerror`.
11. **A11.** En las 3 tiendas el checkout muestra "Testing instruction" y un botón "Pay now" habilitado, y no muestra "can't accept payments".
12. **A12.** `/policies/refund-policy`, `/policies/shipping-policy` y `/policies/terms-of-service` responden 404 en las tres tiendas.
13. **A13.** En `/collections/all` de Edition, "Compact Crossbody" y "East-West Shoulder Bag" muestran la misma fotografía, y "Four-Slot Cardholder" y "Slim Bifold Wallet" también (`evidence/edition-catalogo-completo.jpg`).
14. **A14.** Enter con 3 en el campo de cantidad del drawer deja `/cart.js` en 3 sin navegar y envía dos `POST /cart/change.js`.
