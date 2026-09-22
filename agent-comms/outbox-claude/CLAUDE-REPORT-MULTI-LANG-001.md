# CLAUDE-REPORT-MULTI-LANG-001: Español, auditoría de presets y roadmap de lujo

```text
ID: CLAUDE-REPORT-MULTI-LANG-001 (responde a CLAUDE-TASK-MULTI-LANG-001)
Estado: es.json entregado y validado (374/374 claves). Auditoría de presets hecha:
        Edition cumple WCAG AA en sus 5 esquemas; Archive falla en el esquema 4 y la
        escala tipográfica de Archive (110 %) casi no llega a la tienda. Roadmap de 5+2.
Decisión requerida:
  1. Gemini: autorizar el parche de contraste de §4.3 (base.css + settings_data.json,
     Nivel 2: cambia un default de preset). Sin él, el esquema 4 de Archive y el de
     Sartorial muestran texto secundario por debajo de 4.5:1.
  2. Gemini: autorizar el parche de escala tipográfica de §5.3 (base.css). Sin él, el
     ajuste "Heading size" solo afecta a 7 de 72 reglas de títulos.
  3. Johandry: validar las decisiones de voz de §2.2 (tú, "carrito", "Añadir",
     "obsequio del atelier", "Diario" para Journal) antes de que se sumen más idiomas.
  4. Johandry y Gemini: elegir del roadmap (§7) qué entra en el siguiente sprint.
Resumen en 5 líneas:
  1. locales/es.json: 374 claves, mismas variables {{ }} y mismo HTML que en.default.json; Theme Check 0 ofensas en 86 archivos.
  2. Render en español a 360, 390, 768 y 1440 px: 0 px de desborde; un botón del bundle se partía y se acortó en la traducción.
  3. Edition: 45 pares de contraste y 0 fallos, también en páginas renderizadas. Archive: el texto atenuado del esquema 4 queda en 3.73:1 (3.29 sobre superficie).
  4. Tipografía: los tres presets muestran exactamente los mismos tamaños; solo cambia la familia. Archive al 110 % no se ve.
  5. Roadmap: zoom inmersivo, quick buy con talla, swatches en tarjetas y filtros, mega menú editorial y morph de imagen tarjeta → ficha; después FR/IT/DE y medida de ajuste.
Archivos tocados: 1 nuevo, locales/es.json. Ningún archivo existente modificado.
Desviaciones (Nivel 1 o Nivel 2): ninguna aplicada. Dos parches de Nivel 2 propuestos (§4.3, §5.3).
Hallazgos extra fuera de alcance (con parche listo): 7 (§6).
Verificación (comando, resultado y qué demuestra/qué no): §8.
Lista de afirmaciones falsables numeradas: §9.
```

---

## 1. Qué se hizo y con qué

- `locales/es.json` construido clave a clave desde `en.default.json`: el mismo árbol, el mismo orden y las mismas variables. Se generó desde una tabla de traducciones con un script que falla si falta una clave, sobra otra o cambia una variable, y solo escribe el archivo si todo coincide.
- Validación con tres herramientas: Theme Check (`MatchingTranslations`), el nuevo `locale-parity.mjs` (variables, HTML, plurales) y un render de las páginas del tema en inglés y en español, comparando desbordes, textos cortados y botones que saltan de línea.
- Presets: contraste calculado sobre los tokens reales del tema (incluidos los derivados con `color-mix` en `base.css:82-92`). Después, auditoría en páginas renderizadas: cada texto visible contra su fondo efectivo, para cada uno de los 15 esquemas (3 presets × 5), a 390 y 1440 px. La tipografía se midió renderizando cada preset con su fuente y su escala.
- Roadmap: fichas oficiales de Prestige, Focal e Impulse en la Theme Store (consultadas el 2026-09-22), cruzadas con lo que el código de Sartorial ya tiene.

---

## 2. locales/es.json

### 2.1 Cobertura
```text
$ node locale-parity.mjs .
es.json: 374 claves, 0 problemas
```
- 374 de 374 claves, 13 grupos plurales `one`/`other` completos.
- Variables idénticas en todas las claves; de las 3 claves `_html`, las dos de recogida en tienda conservan `<strong>` (la del saldo de la tarjeta regalo no lleva HTML en inglés tampoco).
- 14 valores iguales al inglés a propósito: nombres de redes (Instagram, Facebook, Pinterest, TikTok, YouTube), `© {{ year }} {{ shop }}`, "Subtotal", "Editorial", "Showroom", "CM", `{{ quantity }} × {{ price }}`, `Total {{ total }}`, `{{ shop }}` y el precio de ejemplo `$480.00`.

### 2.2 Decisiones de voz (para validar)
| Tema | Decisión | Motivo |
| :--- | :--- | :--- |
| Tratamiento | **tú** | El inglés habla de tú ("your cart"), igual que el español de Shopify en su checkout y en sus temas. "Usted" choca con el checkout, que Shopify traduce de tú. |
| Cart / bag | **carrito** en todo el tema | El inglés mezcla "cart" y "bag"; en español dos palabras parecerían dos lugares distintos. "Carrito" es lo que el comprador ve luego en el checkout de Shopify. |
| Add | **Añadir** | Correcto en toda la región; más cuidado que "Agregar" en registro de lujo. |
| Checkout | **Finalizar compra** | "Pagar" suena a trámite; "Checkout" es anglicismo. |
| Complimentary Shipping / Atelier Gift | **envío de cortesía** / **obsequio del atelier** | "Obsequio" tiene más registro que "regalo". |
| Journal | **Diario** | Traducido, como pide la tarea. Alternativa si se prefiere mantener marca: "Journal". |
| Comillas | **« »** | Norma tipográfica del español. |
| Tallas | "Talla de referencia" | En inglés "Model fit"; no se asume el género del modelo. |

Todo el vocabulario evita regionalismos: nada de "platicar", "vale", "ordenar" por pedir, "checar" o "chamarra".

### 2.3 Lo que es.json no cubre
- **El editor de temas en español.** Las etiquetas del editor viven en `en.default.schema.json` (473 claves). No estaban en el alcance; ver H6.
- **El contenido de las plantillas JSON** (textos por defecto de secciones, acordeones, FAQ). Es contenido del comerciante: se traduce con la app Translate & Adapt, no con locales. Hoy la demo en español mostraría la interfaz en español y el contenido en inglés.

---

## 3. Render en español

Comparación automática entre la build en inglés y la española. Páginas: home, ficha con cantidad 2 y barra fija visible, carrito con título de 120 caracteres, bundle, cajón con aviso, buscador y menú móvil. Anchos: 360, 390, 768 y 1440 px.

| Resultado | Inglés | Español |
| :--- | :--- | :--- |
| Desborde horizontal en las 28 combinaciones | 0 px | 0 px |
| Botón del bundle a 360 y 390 px | 1 línea | **2 líneas** ("AÑADIR 3 PIEZAS AL CARRITO \| $1,760.00") → corregido: "Añadir 3 piezas \| $1,760.00", 1 línea |
| Título en la barra fija a 360 y 390 px | "Cocoon Cardigan-Coat" entero (128 px) | "Cocoon Card…" (86 px): el botón "AÑADIR AL CARRITO" mide 162 px contra 120. Ver H4 |

Captura: `harness-ML-001/ml-compare-360.png`.

---

## 4. Contraste de los presets

### 4.1 Pares por esquema (tokens del tema, WCAG 2.2: 4.5:1 texto, 3:1 no texto)
"Atenuado" es `--color-foreground-muted` (72 % de texto sobre fondo). "Superficie" es `--color-surface` (fondo con 6 % de texto), la banda de recompensas del cajón y los paneles. "Borde campo" es `--color-control-border` (60 %).

**Edition**

| Esquema | fondo / texto | Texto | Atenuado | Aten./superf. | Enlace | Etiq./botón | Botón/fondo | Borde campo | Borde |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| scheme-1 | #FFFFFF / #111111 | 18.88 | 7.57 | 6.70 | 18.88 | 18.88 | 18.88 | 4.95 | 3.03 |
| scheme-2 | #111111 / #FAFAFA | 18.09 | 9.62 | 8.40 | 18.09 | 18.09 | 18.09 | 6.96 | 3.29 |
| scheme-3 | #F2F2F2 / #111111 | 16.87 | 7.20 | 6.34 | 16.87 | 18.88 | 16.87 | 4.76 | 3.00 |
| scheme-4 | #2E3440 / #F0F2F5 | 11.14 | 6.63 | 5.59 | 11.14 | 11.14 | 11.14 | 5.11 | 3.14 |
| scheme-5 | #FAFAFA / #1A1A1A | 16.67 | 6.71 | 5.98 | 16.67 | 18.88 | 18.09 | 4.48 | 3.02 |

**Archive**

| Esquema | fondo / texto | Texto | Atenuado | Aten./superf. | Enlace | Etiq./botón | Botón/fondo | Borde campo | Borde |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| scheme-1 | #EFE6D9 / #2E241C | 12.27 | 5.44 | 4.86 | 12.27 | 5.53 | 4.71 | 3.82 | 3.44 |
| scheme-2 | #2F3327 / #EFE6D9 | 10.46 | 6.25 | 5.28 | 10.46 | 5.17 | 4.09 | 4.83 | 3.56 |
| scheme-3 | #E4D8C6 / #2E241C | 10.78 | 5.07 | 4.56 | 10.78 | 5.53 | 4.14 | 3.64 | 3.66 |
| scheme-4 | #8A5A3B / #FFF8F0 | 5.53 | **3.74 ✗** | **3.31 ✗** | 5.53 | 5.53 | 5.53 | 3.10 | 3.31 |
| scheme-5 | #F5EFE5 / #2E241C | 13.25 | 5.63 | 5.05 | 13.25 | 5.53 | 5.09 | 3.95 | 3.53 |

**Sartorial (referencia: es el preset publicado)**

| Esquema | fondo / texto | Texto | Atenuado | Aten./superf. | Enlace | Etiq./botón | Botón/fondo | Borde campo | Borde |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| scheme-1 | #F7F3EA / #1D1B18 | 15.52 | 6.49 | 5.77 | 15.52 | 17.18 | 15.52 | 4.39 | 3.28 |
| scheme-2 | #1D1B18 / #F8F4EB | 15.65 | 8.60 | 7.36 | 15.65 | 7.92 | 7.92 | 6.35 | 3.53 |
| scheme-3 | #EDE7DA / #1D1B18 | 13.95 | 6.12 | 5.47 | 13.95 | 17.18 | 13.95 | 4.19 | 3.15 |
| scheme-4 | #D8A85D / #1D1B18 | 7.92 | **4.47 ✗** | **4.05 ✗** | 7.92 | 15.52 | 7.92 | 3.37 | 3.31 |
| scheme-5 | #FBF9F4 / #2A2621 | 14.28 | 5.84 | 5.20 | 14.28 | 17.18 | 16.33 | 4.05 | 3.03 |

Los esquemas oscuros (Edition 2 y 4, Archive 2, Sartorial 2) pasan con margen. Los bordes de Edition están justo en 3:1 (3.00 a 3.03). Cumplen, pero sin margen: si alguien aclara el borde un tono, deja de cumplir.

### 4.2 Confirmación en páginas renderizadas
Cada texto visible contra su fondo efectivo (los fondos semitransparentes se mezclan; se excluyen los textos sobre imagen). 15 esquemas, 6 estados de página, 390 y 1440 px:
```text
Edition   scheme-1..5  0 fallos
Archive   scheme-1..3, 5  0 fallos · scheme-4  14 fallos (peor 3.29:1)
Sartorial scheme-1..3, 5  0 fallos · scheme-4  13 fallos (peor 4.01:1)
```
Los fallos son siempre texto atenuado: "Total for 2", descripción y acordeones de la ficha, "2 × $980.00" en la barra fija, pie de foto del bundle, impuestos del carrito, sugerencias vacías del buscador, y los hitos "Shipping at / Gift at" de la barra de recompensas (sobre superficie, los peores). Detalle en `harness-ML-001/dom-contrast.json`.

### 4.3 Parche propuesto (Nivel 2, no aplicado)
Solo con CSS no se arregla Archive 4: necesitaría un 94 % de mezcla, es decir, dejar de tener texto atenuado. Con solo paleta, Sartorial 4 exige tocar un dorado que es seña del preset. La combinación mínima:
```css
/* assets/base.css:85 */
--color-foreground-muted: color-mix(in srgb, var(--color-foreground) 78%, var(--color-background));
```
```text
config/settings_data.json › presets.Archive.color_schemes.scheme-4.settings
  background:   #8A5A3B → #6E482F   (terracota → tabaco, mismo tono, 20 % más oscuro)
  button_label: #8A5A3B → #6E482F   (el botón invertido usa el color del fondo)
```
Resultado calculado:
- Archive 4: texto 7.58, atenuado 5.35, sobre superficie 4.56, borde 4.53.
- Sartorial 4: atenuado 4.80, sobre superficie 4.41. Sobre superficie todavía no llega; con 80 % en vez de 78 % llegaría, pero el atenuado de los demás esquemas se acercaría demasiado al texto normal. Alternativa para Sartorial: no usar texto atenuado sobre superficie en la barra de recompensas (una regla).
- Los otros 13 esquemas siguen cumpliendo con 78 %.

Alternativa sin tocar la paleta: un ajuste de color "Texto secundario" por esquema en `settings_schema.json`. Es más flexible para el comerciante, pero suma un control más a cada esquema.

---

## 5. Tipografía de los presets

### 5.1 Lo medido
| Elemento | 360 px (S / E / A) | 390 px (S / E / A) | 1440 px (S / E / A) |
| :--- | :--- | :--- | :--- |
| H1 del hero | 44 / 44 / 44 px, 3 líneas | 44 / 44 / 44, 3 l | 72 / 72 / 72, 2 / **3** / 2 l |
| Título de producto | 37.6 / 37.6 / 37.6, 2 l | igual | 48 / 48 / 48, 2 l |
| H2 de sección | 36 px, 2 / 1 / 2 l | 36, 1 l | 48, 1 l |
| H1 del carrito | **48** px | **48** | 48 |
| Cuerpo | 16 px | 16 | 16 |
| Marca de texto | 18.4 px, cortada con puntos suspensivos en S y A | entera | 25.6 |

S = Sartorial (Libre Baskerville, 105 %), E = Edition (Assistant, 100 %), A = Archive (Libre Baskerville, 110 %).

### 5.2 Conclusiones
1. **Los tres presets tienen exactamente los mismos tamaños.** El ajuste `heading_scale` ("Heading size") solo se aplica en 7 de las 72 reglas de títulos de `base.css`: `h1`, `h2`, `h3` y `h4` genéricos y tres títulos de documentación y FAQ. Hero, ficha, carrito, secciones, bento, bundle y manifiesto tienen tamaños fijos en rem. Archive al 110 % no se ve en ninguna de esas superficies, y el deslizador de 90 a 130 % del editor casi no hace nada: es un control muerto en la práctica.
2. **Edition escala bien.** Assistant a 72 px ocupa una línea más en el hero de escritorio (3 frente a 2), porque es más ancha y el bloque de texto mide el 38 % del ancho. No desborda, pero conviene subir el ancho del texto del hero en la demo de Edition, o dejarlo así si se busca ese titular en bloque.
3. **Jerarquía.** A 390 px el H1 del carrito (48 px) es más grande que el H1 del hero (44 px) y que el título de producto (37.6 px). La página de utilidad grita más que la portada.
4. **No hay desbordes en ningún preset ni ancho.** La marca de texto se recorta a 360 px en los presets serif; es la regla de 4F-002, que prioriza no pisar los iconos.

### 5.3 Parche propuesto (Nivel 2, no aplicado)
Multiplicar por `var(--font-heading-scale)` los tamaños de los títulos de exhibición, no los rótulos de interfaz (tarjetas, barra fija, acordeones):
```text
.hero-editorial__heading, .product-main__title, .featured-product__title,
.collection-main__title, .cart-page__header h1, .bento-discovery__heading,
.brand-manifesto__quote h2, .complete-the-look__heading,
.product-recommendations__header h2, .main-search__title (+ grupo de títulos de página)
font-size: <valor actual> → calc(<valor actual> * var(--font-heading-scale))
```
Simulación en Archive, sin desbordes en ningún caso:
- Al 110 %: hero 48 px (3 líneas) a 360 y 79 px (3 líneas) a 1440; producto 41 y 53 px.
- Al 130 %, el máximo del editor: hero 57 px (4 líneas) a 360, producto 49 px (3 líneas). Recomiendo limitar el hero con `min()` a unos 3.25rem en móvil.

Para la jerarquía del carrito: añadir `.cart-page__header h1` al grupo de títulos de página (2.75 / 3.5 / 4rem).

---

## 6. Hallazgos extra

**H1. El texto en inglés "Complimentary Additions" dice "de regalo".** `sections.cart.complimentary_additions` es el título por defecto de las recomendaciones del cajón. "Complimentary" es gratis; "complementary" es complementario. En español ya va "Complementos para tu pedido". Parche para `en.default.json`: `"Complete the order"` (o `"Complementary pieces"`).

**H2. El color "Secondary button label" no pinta el botón secundario.** En `theme.liquid:84` se publica como `--color-link` y colorea todos los enlaces (`base.css:165`). `.button--secondary` usa `--color-foreground` (`base.css:937`). El `role` del schema lo declara bien (`links` y `on_secondary_button`), pero la etiqueta promete otra cosa. Parche mínimo: `.button--secondary { color: var(--color-link); border-color: var(--color-link); }` o cambiar la etiqueta a "Links and secondary buttons".

**H3. Theme Check no valida las variables de las traducciones.** Mutación en una copia: se borró una clave, se añadió otra y se quitó `{{ quantity }}` de `line_total`. `MatchingTranslations` detectó 2 de las 3; la variable perdida pasó. `locale-parity.mjs` detecta las 3. Propuesta: sumarlo a `gates:static` como `gates:locale-parity` (toca `scripts/` y `package.json`, Nivel 2).

**H4. En español, la barra fija recorta el nombre del producto a 360–390 px.** "AÑADIR AL CARRITO" deja 86 px para el título. Opciones: permitir dos líneas en el título por debajo de 48rem (la barra crece unos 16 px), o reducir el `letter-spacing` del botón en móvil. No se acorta la traducción: el botón principal de la ficha usa la misma clave.

**H5. Sartorial y Archive recortan la marca de texto a 360 px.** "LINEA NOVE" en Libre Baskerville no cabe a 18.4 px junto al menú y los iconos (Assistant sí). Con logo en imagen no pasa. Queda como está salvo que se quiera bajar el tamaño de la marca en móvil a 1.05rem.

**H6. El editor de temas sigue en inglés para un comerciante hispanohablante.** Falta `locales/es.schema.json` (473 claves). Prestige, Focal e Impulse anuncian traducciones EN, FR, IT, DE y ES. Propuesta de sprint: `es.schema.json` y después `fr`, `it` y `de` (storefront y schema), con la misma validación.

**H7. El contenido de la demo no se traduce con locales.** Los textos de `templates/*.json` (FAQ, acordeones, soporte) y los productos están en inglés o en español según el caso. Para una demo bilingüe: activar el español en la tienda y traducir contenido con Translate & Adapt.

---

## 7. Roadmap: 5 funcionalidades para superar a Prestige, Focal e Impulse

### 7.1 Punto de partida (fichas oficiales, consultadas el 2026-09-22)
| | Precio | Presets | Lo que anuncian y Sartorial no tiene |
| :--- | :--- | :--- | :--- |
| Prestige 11.4.1 | $400 | 5 | image zoom, quick view, mega menu con promos en el menú, swatch filters, recently viewed, stock counter, before/after, countdown, quick order list, EU translations |
| Focal 13.0.0 | $320 | 4 | image zoom, quick view, mega menu, swatch filters, recently viewed, trust badges, EU translations |
| Impulse 9.2.0 | $500 | 4 | image zoom, quick view, mega menu, breadcrumbs, age verifier, before/after, countdown, EU translations |

Lo que Sartorial ya hace y ellos no destacan igual:
- Lookbook con hotspots accesibles y un bundle "Complete the look" que añade el conjunto en una sola llamada.
- Barra fija que confirma cantidad y total, y cajón con recompensas a dos niveles.
- Documentación y soporte nativos dentro del tema, y transición de página nativa (`@view-transition`, `base.css:7570`).
- Sin librerías, con Lighthouse móvil entre 72 y 87 en la tienda real.

Los tres competidores comparten el mismo hueco: zoom, quick view, mega menú y filtros por swatch. Para un tema de moda de $380 esa es la mesa mínima. La prioridad va primero a cerrar lo que un comprador de moda echa en falta y después a lo que ningún competidor tiene.

### 7.2 Las cinco, en orden

**1. Galería inmersiva con zoom de tejido (P0, esfuerzo M).**
- **Por qué:** en moda de lujo el comprador compra la trama, la costura y el acabado. Los tres competidores tienen zoom y GPT-AUDIT-002 lo echó en falta: "al pulsar la imagen no se abrió ampliación".
- **Qué:** pantalla completa sobre `<dialog>` nativo con foco atrapado y Escape. Zoom con pellizco y doble toque en móvil, lupa que sigue al cursor en escritorio, y teclado (flechas y +/−). La imagen grande (2400–3200 px del CDN con `?width=`) se pide solo al abrir. Reutiliza el carrusel de 4F-001.
- **Rendimiento:** 0 KB en la carga inicial; unos 3 KB de JS diferido.
- **Aceptación:** nombre accesible, anuncio de "imagen 2 de 4", CLS 0 al abrir y `prefers-reduced-motion` respetado.

**2. Quick buy con selector de talla (P0, esfuerzo M).**
- **Por qué:** hoy el "Add to cart" de las tarjetas solo existe en productos de variante única (`product-card.liquid:54`). En moda casi todo tiene talla, así que en la práctica el quick buy desaparece justo donde más se usa. Los tres competidores lo tienen.
- **Qué:** panel lateral (el mismo patrón del cajón) que carga la ficha por Section Rendering (`?section_id=`) con `VariantSelects`, stepper, disponibilidad y guía de tallas ya existentes. Añadir lleva al cajón sin salir de la colección.
- **Rendimiento:** HTML bajo demanda, sin JSON de variantes en cada tarjeta.
- **Aceptación:** foco devuelto a la tarjeta al cerrar, variante agotada anunciada y funciona con 100 variantes.

**3. Swatches de color en tarjetas y filtros (P1, esfuerzo M).**
- **Por qué:** en una colección de moda el color es el primer filtro. Prestige y Focal anuncian swatch filters. Sartorial ya lee los swatches nativos de Shopify (`swatch.color` / `swatch.image`) en la ficha, pero no en tarjetas ni facetas.
- **Qué:** puntos de color en la tarjeta que cambian la imagen al pasar o tocar, con la imagen de la variante y precarga en hover, más "+3" si no caben. Facetas de color con muestras en vez de casillas de texto, y preparación para combined listings.
- **Rendimiento:** CSS y un listener delegado, sin peticiones extra salvo la imagen.
- **Aceptación:** swatches con nombre accesible, contraste 3:1 del anillo seleccionado y objetivos de 24 px como mínimo (norma de Shopify) o 44 px (norma del proyecto).

**4. Mega menú editorial (P1, esfuerzo S–M).**
- **Por qué:** el menú es lo primero que ve un comprador en la demo. Hoy Catalog abre una lista de 6 enlaces. Los tres competidores tienen mega menú y Prestige suma promos dentro del menú.
- **Qué:** con el mismo `<theme-disclosure>` y el menú de 3 niveles que ya se renderiza: columnas por segundo nivel y hasta dos bloques de imagen editorial con enlace (bloques de la sección header, sin apps). En móvil se mantiene el acordeón actual.
- **Rendimiento:** imágenes `loading="lazy"` que solo existen al abrir, sin JS nuevo.
- **Aceptación:** navegable con teclado (Tab, Escape, flechas opcionales), sin trampa de foco y cerrado al perder el foco.

**5. Morph de imagen tarjeta → ficha con View Transitions (P2, diferenciador, esfuerzo S).**
- **Por qué:** ningún competidor lo anuncia. Es la sensación de app de lujo en un tema de páginas normales, con cero JS, y Sartorial ya tiene la mitad hecha (`@view-transition { navigation: auto }`).
- **Qué:** al pulsar una tarjeta, su imagen "viaja" hasta la galería de la ficha (`view-transition-name` única por producto, puesta solo en el elemento pulsado y en la imagen destacada de destino). Chrome/Edge 126+ y Safari 18.2+ lo soportan; Firefox navega normal.
- **Lo que no hacer:** añadir `prerender` propio. Shopify ya hace prefetch por defecto con eagerness `moderate` desde mayo de 2026 y evitó el prerender por problemas de analítica. El tema no debe duplicarlo.
- **Aceptación:** desactivado con `prefers-reduced-motion` y con `animations: none`, sin cambio en LCP ni CLS.

### 7.3 Siguientes (para llegar a 7)
6. **Traducciones FR, IT y DE**, más `es.schema.json` (P1, S por idioma, 374 + 473 claves con la misma validación). Paridad con los tres competidores y requisito práctico para vender en la UE.
7. **Medida de ajuste por producto** (P2, S): metafield "fit" (talla pequeña / justa / grande) y medidas de la modelo en la ficha, junto a la guía de tallas. Reduce devoluciones en prendas de $400–$1,000, que es donde un tema de lujo se gana al comerciante. Ningún competidor lo anuncia como función del tema.

Descartados por ahora:
- Countdown, age verifier y stock counter no encajan con el tono de la marca.
- Before/after no aporta en moda.
- Recently viewed tiene valor, pero menos que los anteriores; es un buen candidato para 4G.

---

## 8. Verificación

```text
$ npm run gates:static ; echo "exit $?"
exit 0
JSON VALIDATE ... Archivos .json comprobados: 40 · Fallos de parseo: 0
DATASET HOOKS ... Contratos rotos: 0
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
LOCALES ......... Sin resolver en storefront: 0 · Sin resolver en schema: 0
LEDGER .......... Incoherencias: 0
THEME CHECK ..... 86 files inspected with no offenses found.   (85 + es.json)
PACKAGE ......... Your local theme was packaged in Sartorial-1.0.0.zip

$ node harness-ML-001/locale-parity.mjs .
es.json: 374 claves, 0 problemas

Mutación en una copia (clave borrada, clave extra, variable quitada):
  Theme Check:        2 errores MatchingTranslations (no ve la variable)
  locale-parity.mjs:  3 problemas, exit 1

$ npx playwright test (harness completo)
106 passed          # sin cambios de código; confirma que es.json no altera nada
```
Qué no demuestra:
- La calidad de la traducción la juzga una persona. El script garantiza estructura, no estilo.
- El render usa liquidjs y Chromium, no la tienda ni Safari.
- El contraste excluye textos sobre imagen (el hero se midió aparte en 4F-001).
- La tienda aún no tiene el español activado, así que nada de esto se ha visto en vivo.

---

## 9. Afirmaciones falsables

1. `locales/es.json` tiene exactamente las mismas 374 claves hoja que `locales/en.default.json` y ninguna más.
2. En cada clave, el conjunto de variables `{{ }}` de es.json es igual al de en.default.json.
3. Las claves `products.product.pickup.available_at_html` y `unavailable_at_html` de es.json contienen `<strong>` y `</strong>` como en inglés.
4. `shopify theme check` informa 0 ofensas en 86 archivos con es.json incluido.
5. Theme Check no detecta una variable eliminada en una traducción; `locale-parity.mjs` sí.
6. Renderizado en español, ninguna de las 28 combinaciones (7 estados × 4 anchos) tiene desborde horizontal.
7. En español, el botón del bundle con 3 piezas ocupa una sola línea a 360 px.
8. Edition: los 5 esquemas superan 4.5:1 en texto, texto atenuado y enlaces, y 3:1 en botón y bordes.
9. Archive esquema 4: el texto atenuado da 3.74:1 sobre fondo y 3.31:1 sobre superficie.
10. Sartorial esquema 4: el texto atenuado da 4.47:1 sobre fondo.
11. Con el parche de §4.3, Archive esquema 4 pasa a 5.35:1 (atenuado) y 4.56:1 (sobre superficie).
12. El tamaño computado del H1 del hero, del título de producto y del H1 del carrito es idéntico en Sartorial, Edition y Archive a 360, 390 y 1440 px.
13. De las 72 reglas de títulos con `font-size` en `base.css`, 65 no usan `--font-heading-scale`.
14. No se modificó ningún archivo existente del tema; no hay `git commit` ni `git push`.
