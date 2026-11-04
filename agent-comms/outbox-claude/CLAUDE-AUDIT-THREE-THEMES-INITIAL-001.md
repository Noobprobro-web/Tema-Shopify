# CLAUDE-AUDIT-THREE-THEMES-INITIAL-001

Auditoría inicial independiente de tres temas Shopify: Sartorial, Atelier de Sebas (Contour) y Cucuyo de Sebas.

## 0. Encabezado

| Campo | Valor |
|---|---|
| ID | CLAUDE-AUDIT-THREE-THEMES-INITIAL-001 |
| Fecha | 2026-10-27 |
| Estado | Versión final tras revisión independiente |
| Coordinación | Sesión principal de Claude Code como orquestador. Un especialista por área, en paralelo, cada uno con su informe en el scratchpad (A1 a A8), una verificación independiente de las afirmaciones en conflicto (V1) y esta síntesis con un único redactor. Ningún especialista abrió agent-comms/outbox-gpt ni ninguna auditoría GPT. No se imprimió ninguna contraseña. |
| Modelos por tarea (alias) | haiku: A1 (inventario), fijación de versiones (pinning) e investigación auxiliar. opus: A2 (arquitectura), A6 (comerciante), A7 (Theme Store), A8 (originalidad), V1 (verificación) y esta síntesis. sonnet: A3 (compra), A4 (accesibilidad), A5 (rendimiento y seguridad). fable (esfuerzo high): revisión independiente R1 del borrador. |
| Revisión independiente | Revisor: alias fable, esfuerzo high. Informe: scratchpad/audit/R1-revision-fable.md. Veredicto: **requiere cambios**. Se aplicaron los 8 cambios requeridos (TT-11, TT-07, TT-31 con el hecho nuevo sobre la visibilidad de los repos, TT-06 frente a TT-24, TT-04, doble conteo en la matriz, TT-77 y el nuevo TT-99, conteos de §6.2) y las 7 mejoras opcionales (TT-29, TT-41, TT-48, procedencia de la regla de nombres, fila "Password page", página "Updating your theme" en TT-13 y TT-63, templates/customers/* en §10.1). El borrador original se conserva sin cambios en CLAUDE-AUDIT-THREE-THEMES-INITIAL-001.draft.md. |
| Alcance | Sartorial v1.0.0 (presets Sartorial, Imprint, Archive); Atelier de Sebas = Contour 4.1.0 (presets Contour, Annex, Maison); Cucuyo de Sebas = Cucuyo 2.0.0 (preset único Cucuyo). Áreas: inventario, arquitectura, compra, accesibilidad y móvil, rendimiento y seguridad, experiencia del comerciante, requisitos de la Theme Store, originalidad y percepción de valor. |
| Rutas auditadas | /home/claude/themes/sartorial-zip, atelier-main, atelier-annex, atelier-maison, cucuyo |
| Informes fuente | scratchpad/audit/A1-inventario.md, A2-arquitectura.md, A3-compra.md, A4-accesibilidad.md, A5-rendimiento-seguridad.md, A6-comerciante.md, A7-themestore.md, A8-originalidad.md, V1-verificacion.md |

**Limitaciones que aplican a todo el documento**

- Todo es análisis estático y sintético. No hubo acceso a ninguna tienda en vivo, ni a las demos, ni al editor de Shopify.
- No se ejecutó Lighthouse. No se ejecutó axe. No hubo pruebas con tecnología asistiva (NVDA, VoiceOver, JAWS, TalkBack) ni con dispositivos reales.
- No hubo acceso a la carpeta local C:\Users\Johan\Documents\Drive\Tema-Shopify-codex ni a STOREFRONT_PASSWORD, así que el HEAD local de Sartorial y el tema publicado 189832593651 no se verificaron.
- Las citas de páginas oficiales de Shopify pasaron por el resumidor de WebFetch (A7, V1); algunas citas literales son fragmentos.
- Si V1 contradice a A1-A8, manda V1. Los conflictos que quedaron abiertos se listan en la sección 10.
- Ninguna conclusión de este documento garantiza la aprobación de Shopify. La revisión real incluye juicio humano de diseño y pruebas en vivo.
- Las recomendaciones no autorizan implementación. Este documento no copia ni propone copiar código de Atelier ni de Cucuyo a Sartorial (ver sección 10).

---

## 1. Fijación de versiones y discrepancias

### 1.1 Versiones fijadas

| Tema | Versión | Fuente de la evidencia | Verificado | No verificado |
|---|---|---|---|---|
| Sartorial | 1.0.0 (theme_info, autor "Ruiz Digital") | ZIP integrado, sha256 `092242fba56513b7f491821f5fbd86c5933a8550c33ae541f0ffb5df801410e3`. Contiene base.css (`5d9ed6b2...`), theme.js (`861fe0d6...`) y product-zoom.js (`4828d5a1...`) con los hashes esperados. Extraído en sartorial-zip (sin .git). | Contenido del ZIP | Checkout local C:\Users\Johan\Documents\Drive\Tema-Shopify-codex con HEAD esperado 09f8342 (sin acceso a la carpeta). Tema publicado ID 189832593651 (sin STOREFRONT_PASSWORD). |
| Atelier de Sebas | Contour 4.1.0 (theme_info, autor "Sebastián Ruiz") | github.com/SebastianDev017/atelier: main 1576d06 (coincide), annex 183b488, maison 16f00f7, confirmados con `git ls-remote`. | Ramas y commits; código idéntico entre ramas (diff -rq: solo cambian config/settings_data.json y templates/{index,collection,product,page.about,page.contact}.json; A1 §0, A2 §0). Visibilidad: hacia las 20:30 del 2026-10-27, `git ls-remote` **anónimo** tuvo éxito a través de un proxy que solo sirve repos públicos sin credenciales, así que el repositorio era legible públicamente en ese momento (R1 §2). Esto contradice "(private)" en DEVELOPMENT.md:6 (TT-31). El 403 que recibió A7 vino del proxy sobre la web de GitHub, no del repositorio. | Demos contour-ho5kbo9x, annex-r0zzjfjf y maison-10oym9w0 .myshopify.com: no visitadas (sin autorización). |
| Cucuyo de Sebas | Cucuyo 2.0.0 (theme_info, autor "Cucuyo Home") | Clon anónimo 727c0d4 del 2026-10-27 12:45 (sin credenciales, así que el repositorio era público a esa hora). | Contenido del clon | A las 20:30 GitHub pedía credenciales: probable cambio de visibilidad entre 12:45 y 20:30; la revisión remota actual no está confirmada. Demo cucuyo-store no visitada. |

### 1.2 Discrepancias registradas

| # | Discrepancia | Fuentes | Resolución |
|---|---|---|---|
| D1 | El encargo nombra los presets de Sartorial "Atelier, Imprint, Archive". El ZIP tiene **Sartorial, Imprint, Archive**. | settings_data.json `presets` (V1 §3); listings/{sartorial,imprint,archive} | Se audita lo que hay en el ZIP. El preset con el nombre del tema (Sartorial) cumple la regla de Shopify "One theme preset must take the name of the parent theme" (A7 claim d). Además existe un tema gratuito de Shopify llamado Atelier (themes.shopify.com/themes/atelier/presets/atelier, A7 nota de alcance), así que el nombre anterior habría chocado. |
| D2 | La documentación publicada de Sartorial llama "Edition" al segundo preset; el código lo llama Imprint. | docs.html:204, support.html:254 (V1 §3) | Confirmado. Ver TT-04. |
| D3 | Sartorial conserva identificadores internos "atelier": valor `atelier` de `motion_style`, bloque `atelier_gallery` en main-about, ajuste `atelier_gift_threshold`. | A4 §0, A8 §2 E5, A3-13 | No es un preset ni un nombre de tema. No se verificó si alguna etiqueta visible en el editor dice "Atelier". Conviene revisarlo antes del envío para que nadie lo confunda con el tema de Shopify ni con Atelier de Sebas. |
| D4 | "Atelier de Sebas" es el tema Contour (repositorio `atelier`). No es el antiguo preset Atelier de Sartorial ni el tema Atelier de Shopify. | A7 nota de alcance, A4 §0 | En todo el documento, "Atelier" significa Atelier de Sebas (Contour 4.1.0) salvo que se diga otra cosa. |
| D5 | Conteo de ajustes globales: A1 reporta 59 (Atelier) y 30 (Cucuyo); A6 reporta 54 y 26. | V1 §4 | Ambos correctos con métodos distintos. Inputs reales (sin header/paragraph): Sartorial 23, Atelier 54, Cucuyo 26. Este documento usa esas cifras. |
| D6 | Secciones de Atelier: A1 cuenta 60, A6 cuenta 62 archivos con schema. | A1 §2, A2 §2, A6 §1 | 60 secciones más 2 theme blocks (blocks/group, blocks/text) = 62. |
| D7 | JS por página de Atelier: A2 mide unos 98 KB gz; A5 mide 105 a 112 KB gz. | A2-05, A5 §3.1 | Listas distintas: A5 suma SplitText (home y PDP) o Flip (colección) según plantilla. Se reporta el rango 98 a 112 KB gz. |
| D8 | Sartorial theme.js gz: 57.494 B (A2) frente a 57.895 B (A5). | A2 §3, A5 §3.1 | Diferencia de implementación de gzip. Irrelevante para las conclusiones. |
| D9 | El encargo dice que Shopify rechazó Atelier varias veces, quizá por falta de personalización o innovación. | Declaración de Sebas | **No verificado.** No se presenta como causa en ningún punto (ver sección 3.4). |
| D10 | A3-02 y V1 §8 suponen que /cart/change.js responde 422 cuando se pide más stock del disponible. | R1 §1 (F2) | La referencia Ajax API de Shopify no documenta esa respuesta para change.js (documenta el 422 y el recorte para add.js, un 400 para línea inexistente y el 429). V1 §8 no aporta fuente para el 422. TT-07 se reescribió sin esa premisa. |
| D11 | DEVELOPMENT.md:6 declara privado el repositorio de Atelier; A7 recibió 403. | R1 §2 | Hacia las 20:30 el repositorio era legible de forma anónima. El 403 fue del proxy sobre la web de GitHub. Ver TT-31. |

---

## 2. Tipos de evidencia

Cada hallazgo y cada celda de la matriz indica su tipo de evidencia con estas etiquetas:

| Etiqueta | Tipo | Qué incluye en esta auditoría | Estado |
|---|---|---|---|
| EST | Estático | Lectura de Liquid, JSON, CSS, JS, documentación del repositorio; conteos por script; `diff -rq` entre ramas. | Hecho en los tres temas |
| EST-web | Estático documental externo | Páginas oficiales de shopify.dev y themes.shopify.com, documentación pública de Sartorial (noobprobro-web.github.io), sitio ruizdigital.com, licencia de GSAP, descargadas con curl o WebFetch. | Hecho (A7, V1) |
| SIN | Sintético | Theme Check con Shopify CLI 5.0.0 (theme-check-common 3.30.1) y con @shopify/theme-check-node 3.31.0, en tres configuraciones por tema (A2, A5); bisección de un error de Theme Check (A5-02); contraste WCAG calculado por script (A4, V1 §9); pesos gzip por script; parseo de 42 JS con acorn (A5). | Theme Check: ejecutado. Contraste: calculado. **axe: no ejecutado.** Lighthouse: no ejecutado. |
| TR | Tienda real | Demos, tienda publicada, editor de temas, respuestas reales de Cart API y Section Rendering API. | **Ninguna** |
| TA | Tecnología asistiva | Lectores de pantalla, control por voz, ampliadores, dispositivos reales. | **Ninguna** |

Nota sobre accesibilidad: como axe no se ejecutó y no hubo pruebas con tecnología asistiva, nada de este documento afirma ausencia de violaciones, conformidad WCAG ni certificación. Los criterios WCAG se citan solo para clasificar.

---

## 3. Requisitos oficiales de Shopify

Fuentes consultadas el 2026-10-27 (A7 Parte 1, V1 §5 a §7):

- Requisitos: https://shopify.dev/docs/storefronts/themes/store/requirements
- Listings y precio: https://shopify.dev/docs/storefronts/themes/store/review-process/listings
- Proceso de envío: https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme
- Cambios desde el 15 de mayo de 2025: https://shopify.dev/changelog/updated-shopify-theme-store-requirements-and-submission-process-effective-may-15-2025
- Actualización de temas (base set en la raíz, sin JSON de demo; citada por R1 §6): https://shopify.dev/docs/storefronts/themes/store/success/updates
- Base aprobada: https://github.com/shopify/skeleton-theme
- Comprobación de nombres: https://themes.shopify.com/themes/responsive/presets/contour, https://themes.shopify.com/themes/gain/presets/maison, https://themes.shopify.com/themes/atelier/presets/atelier
- Licencia GSAP (riesgo de terceros): https://gsap.com/standard-license

### 3.1 Requisitos clave

| Tema del requisito | Texto o regla | URL | Fuente interna |
|---|---|---|---|
| Unicidad | "Your theme must be fundamentally different from other themes on the Shopify Theme Store (including your own)." Pide "inventive art direction" con sistemas claros de header y navegación, tarjetas de producto, tratamiento de media y estructura de página. "Cosmetic or additive alterations are insufficient" (espaciado, color, tipografía, gradientes, animación, "adding a few settings or sections to an existing codebase"). "A merchant shouldn't be able to buy your theme then customize it to appear almost identical to a different theme." | requirements, §2 | A7 claim a |
| Base del código | Skeleton Theme es "the only approved codebase for Theme Store development"; si no, "fully original code". "New theme submissions built on or derived from Dawn or Horizon are not eligible." | requirements, §2 | A7 claim b |
| Lighthouse | Promedio mínimo de rendimiento 60 y de accesibilidad 90, en producto, colección y home, desktop y móvil, con contenido real. | requirements, §6 | A7 claim c |
| Funciones obligatorias (22) | Sections Everywhere, Discounts, Accelerated checkout buttons, Faceted search filtering, Gift cards, Image focal points, Images for social sharing, Country selection, Language selection, Multi-level menus, Newsletter forms, Pickup availability, Related product recommendations, Complementary product recommendations, Rich product media, Search (con predictive search), Selling plans ("must be supported on the Cart page"), Shop Pay Installments, Unit pricing, Variant images, Follow on Shop, Account component (`<shopify-account>` en el header, visible en desktop y móvil). | requirements, §4 | A7 claim f |
| Página de producto | Swatches, destinatario de gift card, taxes_included, entre otros. | requirements, §5 | A7 claim f y checklist 4 |
| Mega menu | **No es obligatorio.** El requisito es "Multi-level menus". "Mega menu" solo aparece como casilla opcional de "Theme features" en el formulario del listing. | requirements (Multi-level menus); listings | V1 §6 |
| Presets y nombres | "One theme preset must take the name of the parent theme"; 1 a 2 palabras; menos de 30 caracteres. "Theme and preset names must be unique and distinct from existing themes". Además, "Don't use the same name as an existing theme and preset name", que no está en el bloque de requisitos de nombres sino en la lista "Increasing clarity and discoverability": es más una guía que un requisito duro (R1 §6). | requirements, §18 | A7 claim d, V1 §7, R1 §6 |
| /listings | "If you have more than one preset, you need to include a unique set of templates showcasing each preset", en `listings/<preset>/templates/*.json` con `sections/` opcional. Con un solo preset no hace falta. La página no menciona listing.json ni preview.png. | requirements ("Adding presets to your theme zip submission") | V1 §5 |
| Demos | "All theme presets must include at least one demo store", con industria y catálogo acordes; la install store debe coincidir con la demo. "All demo stores must use the same password." Capturas por demo: desktop 1000x1248 o 2000x2496, móvil 750x1334 (se suben en el formulario, no en el ZIP). | requirements §20; listings | A7 claim d, V1 §5 |
| Precio | "You can price your theme from $100 USD to $500 USD in increments of $10." Shopify no define "tiers". | listings | A7 claim e, A7 Parte 3 |
| Documentación y soporte | Documentación y formulario de contacto públicos antes del lanzamiento, consistentes con los settings, actualizados, y "should include an FAQ". Campos recomendados: nombre, email, URL de tienda, descripción con subida de archivo, auto-respuesta. | requirements §21 | A7 contexto |
| Exclusividad | Solo distribución por la Theme Store; sin créditos de diseñador ni enlaces de afiliado en los archivos. | requirements §1 | A7 contexto |
| Proceso | Cinco etapas: 1) funciones y OS 2.0; 2) Lighthouse; 3) requisitos técnicos; 4) diseño y UX (settings, font picker, sistema de color, imágenes responsive); 5) pre-lanzamiento (exclusividad, nombres, demos, documentación, soporte). Reenviar sin corregir puede causar suspensión temporal. | submit-theme | A7 claim g |

### 3.2 Cumplimiento estático de las 22 funciones

Presencia en código (EST). Presencia no es funcionamiento: nada de esto se probó en tienda.

| Función | Sartorial | Atelier (Contour/Annex/Maison) | Cucuyo |
|---|---|---|---|
| Sections Everywhere (plantillas JSON) | Presente (17 JSON) | Presente (13 JSON) | Parcial: faltan blog, article, list-collections, gift_card (A2-15) |
| Discounts | Presente (main-cart-items.liquid:86-89) | Presente (main-cart.liquid:33-36); el drawer no lista descuentos de carrito (TT-75) | Ausente en el carrito (TT-34) |
| Accelerated checkout | Presente (main-product.liquid:637-639) | Presente (main-product.liquid:250) | Ausente |
| Faceted filtering | Presente (main-collection.liquid:12, 67) | Presente (snippets/facets.liquid:22) | Ausente ("No filters yet", main-collection.liquid:9) |
| Gift cards con destinatario | Presente (gift-card-recipient.liquid; templates/gift_card.liquid) | Presente (main-product.liquid:213) | Ausente |
| Image focal points | Presente (focal_point en 6 archivos, p. ej. main-collection.liquid:107; comprobación de la síntesis) | Presente (6 archivos, p. ej. collection-banner.liquid:54) | Presente en 1 archivo (page-split.liquid:33) |
| Images for social sharing | Presente (social-meta-tags.liquid:35) | Presente (meta-tags.liquid:43) | Presente (meta-tags.liquid:30) |
| Country / Language selection | Presente (localization-selectors.liquid:22-31) | Presente (header.liquid:32-45) | Ausente |
| Multi-level menus | Presente (mega-menu.liquid:43-52) | Presente (header-menu.liquid:21-32) | Presente (nav-links.liquid) |
| Newsletter | Presente | Presente | Presente |
| Pickup availability | Presente (pickup-availability.liquid) | Presente | Ausente |
| Related recommendations | Presente (product-recommendations.liquid:6-12) | Presente (intent=related) | Parcial: por colección, sin API (TT-87) |
| Complementary recommendations | Presente | Presente (complementary-products.liquid:32) | Ausente |
| Rich product media | Presente (video, external_video, model) | Presente (con AR) | Parcial: solo imágenes en PDP |
| Search con predictive | Presente | Presente (dos implementaciones, TT-68) | Solo búsqueda, sin predictiva |
| Selling plans (exigido en carrito) | Presente en PDP y carrito | Carrito muestra el plan (cart-item.liquid:37-38); sin selector en PDP (TT-21) | Ausente |
| Shop Pay Installments | Presente (payment_terms, main-product.liquid:480) | Presente (payment_terms, main-product.liquid:65; comprobación de la síntesis) | Ausente |
| Unit pricing | Presente (price.liquid:81) | Presente (price.liquid:42-44) | Ausente |
| Variant images | Presente | Presente | Presente |
| Follow on Shop | Presente (footer.liquid:149) | Presente (login_button, main-product.liquid:257; comprobación de la síntesis) | Ausente |
| Account component `<shopify-account>` | Presente (header.liquid:191; atributo menu en hipótesis, TT-19) | Presente (header.liquid:160) | Ausente: solo enlace HTML (header.liquid:87, 126) |
| Password page (requisito escrito; añadida tras R1 §7) | Presente: templates/password.json y sections/main-password.liquid con `password_message` (comprobación de la síntesis) | Presente: templates/password.json y sections/password.liquid con `password_message` | Parcial: templates/password.json y formulario `storefront_password` (main-password.liquid:128) con shop.name; no se encontró `shop.password_message` |

### 3.3 Personalización frente a innovación

Shopify trata estas dos cosas por separado:

- **Personalización** se revisa sobre todo en la etapa 4 (diseño y UX: settings, font picker, sistema de color, imágenes responsive) y en la regla de que el comerciante no pueda convertir el tema en otro casi idéntico.
- **Innovación o unicidad** es la regla de la §2: dirección de arte propia con sistemas distintos de header, tarjeta, media y estructura de página. Agregar ajustes o secciones a una base existente no basta.

Contraste con lo observado en código (EST):

| Eje | Sartorial | Atelier | Cucuyo |
|---|---|---|---|
| Personalización global | 23 inputs, 5 esquemas, 2 font pickers | 54 inputs, 6 esquemas, 2 font pickers, 5 idiomas de editor | 26 inputs, sin esquemas, sin font picker |
| Personalización por sección | 371 ajustes; 1 sección con padding propio | 672 ajustes; 51 secciones con padding | 359 ajustes |
| Header (E1) | Estándar, un layout | Distintivo (nav lateral), un layout, derivado de una referencia externa | Poco común, derivado de referencias externas |
| Tarjeta (E2) | Estándar, una variante | Estándar, una variante | Poco común, una variante |
| Media y PDP (E3) | Poco común (4 layouts, zoom, provenance) | Estándar, sin zoom | Estándar, solo imágenes |
| Estructura (E4) | Poco común | Distintivo (secciones por vertical) | Distintivo para el cliente |

Fuentes: A6 §1, A8 §7, V1 §4.

### 3.4 Sobre los rechazos de Atelier

La afirmación de que Shopify rechazó Atelier por falta de personalización o innovación **no está verificada** y no se asume. Con la evidencia estática disponible, Atelier es el tema con más personalización global y por sección de los tres (A6 §1) y el más distintivo en estructura (A8 §7), así que el código no apunta de forma obvia a esa explicación. A la vez, el código y los documentos muestran otros riesgos de revisión que no tienen relación demostrada con ningún rechazo: nombres de preset que ya existen (TT-08), un contrato visual extraído de una tienda de terceros (TT-09), comentarios que citan patrones de Dawn (TT-84) y una PDP sin zoom ni layouts alternativos (TT-24). Ninguno se presenta como causa. Para conocer la causa real hace falta la comunicación de Shopify, que esta auditoría no tuvo.

---

## 4. Inventario de presets

Ningún preset se observó en una demo o tienda: en todos, "observado en demo" es **no observado**.

| Tema | Preset | Presente en código | Observado en demo | No verificable |
|---|---|---|---|---|
| Sartorial | Sartorial | Sí. settings_data.json `presets.Sartorial`; listings/sartorial/templates/{index,collection,product}.json (index 8 secciones / 26 bloques; PDP `split_screen`; motion `atelier`). (A1 §4.1, A8 §2) | No observado | Demo (ninguna referenciada en ZIP ni docs). Qué plantilla aplica la instalación: la raíz no coincide con ningún preset (TT-13). Tema publicado 189832593651. |
| Sartorial | Imprint | Sí. `presets.Imprint`; listings/imprint/templates (index 8/27, bento-discovery, PDP grid con technical_specs; motion `technical`). | No observado | Demo. Los docs lo llaman "Edition" (TT-04). |
| Sartorial | Archive | Sí. `presets.Archive`; listings/archive/templates (index 7/23, hero cinematic, PDP grid con provenance; motion `heritage`). | No observado | Demo. Si provenance se ve con datos reales (TT-03). |
| Atelier | Contour | Sí. `presets.Contour` en settings_data.json de las tres ramas; listings/contour/templates con index y page.about (collection y product heredan de la raíz); listing.json con demo contour-ho5kbo9x.myshopify.com. (A1 §4.2) | No observado (demo declarada, no visitada) | Estado y contenido de la demo. Colisión de nombre (TT-08). |
| Atelier | Annex | Sí. `presets.Annex`; listings/annex/templates con index, collection, product y page.about; demo annex-r0zzjfjf.myshopify.com. | No observado (demo declarada, no visitada) | Estado de la demo. Si "Annex" existe como preset de otro tema (solo se probó el slug de tema, 404). |
| Atelier | Maison | Sí. `presets.Maison`; listings/maison/templates con index, collection, product y page.about; demo maison-10oym9w0.myshopify.com. | No observado (demo declarada, no visitada) | Estado de la demo. Colisión de nombre (TT-08). |
| Cucuyo | Cucuyo | Sí. `presets.Cucuyo` en settings_data.json (único). `current` difiere del preset: fondo #FFFFFF frente a #F9F6F2 y escalas 110/90 frente a 100/100 (A1 §4.3). Sin /listings (no hace falta con un preset). | No observado (cucuyo-store.myshopify.com citada en README, no visitada) | Estado de la demo y de la tienda del cliente. Revisión remota actual. |

---

## 5. Matriz de puntuación (5 categorías x 20)

### 5.1 Decisión por categoría

Ninguna categoría tiene evidencia de tienda real, demo, Lighthouse, axe ni tecnología asistiva. Decisión categoría por categoría:

| Categoría | ¿Evidencia suficiente para una nota final? | Decisión | Por qué |
|---|---|---|---|
| Diseño y percepción de valor | No | **Provisional (solo estático)**, confianza baja | El código permite medir diferenciación estructural (E1 a E6 de A8), pero no acabado visual, fotografía, ritmo ni animación. La percepción de valor es visual y nadie vio una demo. |
| Compra, merchandising y conversión | No para runtime; sí para cobertura funcional en código | **Provisional (solo estático)**, confianza media | A3 trazó en código cerca del 90 % de las áreas. Faltan respuestas reales de Cart API y Section Rendering API, Markets y catálogos grandes. |
| Móvil y accesibilidad | No | **Provisional (estático más contraste calculado)**, confianza media-baja | Sin axe, sin tecnología asistiva, sin render ni dispositivo, y el umbral de Lighthouse accesibilidad 90 no se midió. A4 estima cobertura de 60 a 70 %. |
| Configuración y experiencia del comerciante | Casi: los schemas son la experiencia del comerciante | **Provisional (solo estático)**, confianza media-alta | A6 parseó todos los schemas, settings_data, listings y locales. Falta comprobar el editor real (renders vacíos, section:load). |
| Rendimiento y calidad funcional | No | **Provisional (estático más Theme Check)**, confianza media-baja | Lighthouse rendimiento 60 es un umbral de la Theme Store y no se midió. Theme Check y pesos son sintéticos, no runtime. |

### 5.2 Matriz

Formato de celda: nota provisional /20 · cobertura · confianza. Todas las notas son **provisionales (solo estático)**.

| Tema · preset | Diseño y percepción de valor | Compra, merchandising y conversión | Móvil y accesibilidad | Configuración y comerciante | Rendimiento y calidad funcional |
|---|---|---|---|---|---|
| Sartorial · Sartorial | 14 · baja (sin visual) · media-baja | 16 · alta en código, runtime 0 · media-alta | 17 · media (~65 %) · media-baja | 12 · alta en schemas · media-alta | 15 · media (~55 %) · media-baja |
| Sartorial · Imprint | 13 · baja · media-baja | 15 · alta en código · media-alta | 14 · media · media-baja | 11 · alta · media-alta | 15 · media · media-baja |
| Sartorial · Archive | 13 · baja · baja | 15 · alta en código · media-alta | 15 · media · media-baja | 11 · alta · media-alta | 15 · media · media-baja |
| Atelier · Contour | 14 · baja · media-baja | 11 · alta en código · media | 15 · media · media-baja | 16 · alta · media-alta | 15 · media · media-baja |
| Atelier · Annex | 15 · baja · media-baja | 11 · alta en código · media | 14 · media · media-baja | 16 · alta · media-alta | 15 · media · media-baja |
| Atelier · Maison | 15 · baja · media-baja | 11 · alta en código · media | 15 · media · media-baja | 16 · alta · media-alta | 15 · media · media-baja |
| Cucuyo · Cucuyo | 10 · baja · baja | 7 · alta en lo existente · alta en ausencias, media en runtime | 12 con el preset / 10 con la configuración actual · media (~60 %) · media-baja | 8 · alta en schemas y JS · media | 9 · media · media-baja |

Tipo de evidencia de la matriz: EST en todas las columnas; SIN además en Móvil y accesibilidad (contraste calculado) y en Rendimiento (Theme Check, pesos gzip).

### 5.3 Conciliación de las sugerencias de los especialistas

- **Diseño (A8).** Se toman las notas de A8 sin cambios. A8 advierte que, si la categoría midiera encaje con moda de lujo, Atelier perdería 2 o 3 puntos (A8-05, A8-06). La categoría mide diseño y percepción de valor en general, así que ese ajuste no se aplica; el encaje con moda se trata en la sección 9. A8 ya descontó a Atelier por el contrato visual derivado (A8-04) y a Sartorial por header y tarjeta estándar (A8-01).
- **Compra (A3).** Base de A3: 16 / 11 / 7. V1 §8 corrige el detalle del fallo de carrito de Atelier (el contador no muestra "NaN" visible: se oculta como vacío), pero la gravedad no cambia: el fallo sigue siendo silencioso. Los planes de venta de Atelier siguen restando aunque A7 aclare que el requisito literal es el carrito: el impacto de compra existe igual (TT-21).
- **Regla de doble conteo (corregida tras R1 §5).** El borrador contaba TT-03 solo en Configuración y TT-07 en Compra y en Accesibilidad, una asimetría que favorecía a Sartorial. Regla aplicada ahora a los dos temas por igual: un defecto que el comprador ve resta en Compra, y además en la categoría donde vive su causa o su otro efecto (Configuración para TT-03, porque nace de ajustes de plantilla y metafields no declarados; Accesibilidad para TT-07, porque falta el anuncio del error). Por eso Imprint y Archive, que traen el bloque activo por defecto, bajan de 16 a **15** en Compra. El preset Sartorial se queda en 16 porque solo le afecta si el comerciante añade el bloque.
- **Móvil y accesibilidad (A4).** Se toman las notas de A4. Se baja la confianza de "media" a "media-baja" porque falta todo lo que exige render (axe, lectores de pantalla, reflujo, tamaños reales) y el umbral de Lighthouse 90 no se midió. V1 §9 confirma 1.33:1 en Imprint y agrega que el anillo base reaparece con reduced motion; no cambia la nota.
- **Configuración (A6).** Se toman las notas de A6. A7-05 (plantillas de soporte del vendedor en el ZIP) coincide con A6-02, ya incluido.
- **Rendimiento y calidad funcional (A2 y A5).** Dos especialistas puntuaron la misma categoría desde ángulos distintos: A2 desde calidad de código y A5 desde rendimiento estático y seguridad.
  - Sartorial: A2 15, A5 15. Coinciden: **15**.
  - Atelier: A2 14, A5 16. A2 resta por el JS inyectado después del FCP que Theme Check no ve y por el check desactivado (A2-05), por errores de carrito silenciados (A2-06) y por el riesgo de theme-check 3.31 (A2-11). A5 premia la ingeniería de carga (JS tras FCP, prioridad LCP por índice, facade de video, preconnect, CSS de 29 KB gz). Las dos lecturas son válidas y no se anulan; el fallo de carrito ya resta en Compra y en Accesibilidad. Se toma el punto medio: **15**.
  - Cucuyo: A2 9, A5 10. A5 encontró un defecto funcional que A2 no contó (cinco ajustes anulados por el orden del CSS, A5-01) y A2 contó carencias OS 2.0 que A5 no puntuó (sin @app, plantillas ausentes). Sumadas, apoyan la nota más baja: **9**.

### 5.4 Sin total

No se da un total. Las cinco categorías son provisionales, ninguna tiene evidencia de runtime y dos umbrales de la Theme Store (Lighthouse rendimiento 60 y accesibilidad 90) no se midieron. Una suma de notas provisionales se leería como nota final y sería engañosa. El total se podrá calcular cuando existan Lighthouse, axe, revisión con tecnología asistiva y revisión visual de las demos.

---

## 6. Registro de hallazgos

### 6.1 Criterio de prioridad

| Nivel | Criterio |
|---|---|
| P0 | Incumple un requisito escrito de la Theme Store que impide el envío de un tema candidato (Sartorial o Atelier), o rompe la compra de forma generalizada. |
| P1 | Rompe un flujo de compra común; barrera de accesibilidad seria en una configuración activa por defecto; contenido falso visible al comprador sin que el comerciante lo pida; riesgo alto de revisión frente a un requisito escrito pero con interpretación o hechos aún sin confirmar, cuando hay un hecho documentado detrás (no solo juicio de diseño); falta una capacidad OS 2.0 básica (app blocks); credencial expuesta en un repositorio legible públicamente. |
| P2 | Defecto verificable con impacto acotado o condicional; inconsistencia documental (aunque convenga corregirla antes del envío); riesgo frente a la unicidad que depende solo del juicio del revisor; deuda con impacto medible; barrera de accesibilidad moderada o que depende de que el comerciante active algo habitual. |
| P3 | Higiene, mantenibilidad, condición inactiva en los presets entregados, o dato informativo. |

Reglas de recalibración aplicadas:

- Cucuyo es una tienda a medida, no candidata a la Theme Store. Sus carencias frente a la Theme Store se agrupan en un solo hallazgo (TT-86) con prioridad para su uso actual y la nota "P0 si se enviara".
- A1-02 (mega menu de Atelier, P1) se **descarta como hallazgo**: el mega menu no es obligatorio (V1 §6).
- A1-07 (Sartorial sin listing.json ni preview.png, P2) se **descarta**: refutado por V1 §5.
- A1-01 (selling plans en PDP de Atelier, P1) baja a P2: el texto oficial exige soporte en el carrito, que Atelier muestra (A7-30), y la PDP admite bloques @app.
- A7-02 (ruizdigital.com): la frase "Ruiz Digital no posee el dominio" no está demostrada (V1 §2). Queda como riesgo a confirmar con Johandry (TT-05).
- A3-02 / A2-06 / A4-11: se usa el comportamiento corregido por V1 §8.
- A2-12 frente a A5-02 (causa del error de color-swatches.liquid): manda la bisección de A5-02.
- A5 dice "no se encontraron secretos": su búsqueda fue por patrones de token y clave. La contraseña en texto plano de DEVELOPMENT.md:7 existe (A1-10, A7-28; comprobación de la síntesis: una coincidencia, línea 7, valor no leído).

Recalibraciones tras la revisión independiente R1:

- TT-04 (docs de Sartorial) baja de P1 a P2: es una inconsistencia documental. Sigue en la lista de correcciones previas al envío de la sección 9.
- TT-06 (Sartorial) baja de P1 a P2 para igualarlo con TT-24 (Atelier). Los dos temas tienen dos ejes estándar de los cuatro que nombra la regla §2 de Shopify, que los pone en pie de igualdad (Sartorial: header y tarjeta; Atelier: tarjeta y media/PDP). Los dos dependen solo del juicio del revisor. TT-09 sigue en P1 porque tiene detrás un hecho documentado (la extracción declarada en DESIGN.md).
- TT-31 (credencial de Atelier) sube de P2 a P1: el repositorio era legible de forma anónima hacia las 20:30 del 2026-10-27 (R1 §2). No sube a P0 porque la exposición no impide el envío ni rompe la compra: da acceso a los storefronts de demo, no al admin.
- TT-77 se corrige y se añade TT-99 (archivos de definiciones y demo/ de Atelier).

IDs: se conservan los del borrador para no romper las referencias cruzadas. Por eso, después de las recalibraciones, los IDs no son consecutivos dentro de cada prioridad. El nuevo hallazgo es TT-99.

Orden: por prioridad; dentro de cada prioridad, Sartorial, Atelier, Cucuyo y luego hallazgos de varios temas.

### 6.2 Resumen

| Prioridad | Cantidad | IDs |
|---|---|---|
| P0 | 1 | TT-01 |
| P1 | 9 | TT-02, TT-03, TT-05, TT-07, TT-08, TT-09, TT-10, TT-11, TT-31 |
| P2 | 43 | TT-04, TT-06, TT-12 a TT-30, TT-32 a TT-52, TT-99 |
| P3 | 46 | TT-53 a TT-98 |
| Total | 99 | |

### 6.3 P0

#### TT-01 · Sartorial · Sartorial, Imprint, Archive · P0
- **Criterio:** requisito escrito que impide el envío (requirements §18 y §20; listings).
- **Condición:** ni el ZIP ni la documentación pública declaran demo stores por preset. Shopify exige al menos una demo por preset, todas con la misma contraseña, Bogus Gateway o Shopify Payments en prueba, texto auténtico, sin apps salvo excepciones, derechos sobre marca e imágenes, e install store igual a la demo. Tampoco hay capturas por demo (2000x2496 o 1000x1248, y 750x1334).
- **Impacto:** sin demos no se puede completar el envío.
- **Reproducción:** buscar URLs de demo en sartorial-zip y en docs.html/support.html.
- **Evidencia:** A7-08; A7 Parte 3, filas 8 y 9; A1 §5 ("Sartorial: ninguna demo referenciada"). Requisito: requirements §20 y listings ("All demo stores must use the same password", V1 §5).
- **Tipo de evidencia:** EST, EST-web.
- **Estado:** parcialmente confirmado. El requisito y la ausencia en el paquete están confirmados; si existen demos fuera del paquete no se pudo evaluar (tema publicado 189832593651 no reverificado, sin STOREFRONT_PASSWORD).
- **Recomendación y límites:** crear o identificar una demo por preset con catálogo e industria acordes, misma contraseña, y preparar las capturas. Alinear las plantillas raíz con la install store (TT-13). Límite: no se sabe si ya existen tiendas preparadas.

### 6.4 P1

#### TT-02 · Sartorial · Imprint (P1) y Archive (P2) · P1
- **Criterio:** barrera de accesibilidad seria en una configuración activa por defecto (WCAG 2.4.7, 1.4.11).
- **Condición:** dentro de `@media (prefers-reduced-motion: no-preference)`, el anillo de foco de `.button`, `input` y `select` se fija por `motion_style` y no por esquema: `technical` usa `#2b2b2b` y `heritage` usa `#b5885c` (también como color de hover).
- **Impacto:** en Imprint el anillo mide 1.33:1 sobre scheme-2 (#111111), que usan header y footer, y 1.13:1 sobre scheme-4 (#2E3440). En Archive, 2.25 a 2.76:1 sobre los fondos claros y 2.52 sobre #6E482F; solo pasa 3:1 sobre #2F3327 (4.09). Un usuario de teclado pierde la posición en esas zonas. Con reduced motion activo vuelve el anillo base (`var(--color-foreground)`).
- **Reproducción:** preset Imprint, tabular a un botón o campo del footer.
- **Evidencia:** sartorial-zip/assets/base.css:9058-9132 (media query), :9102-9107 (technical), :9126-9131 (heritage), :283-286 (anillo base); sections/header-group.json:20, footer-group.json:9; listings/imprint/templates/index.json:40, 172; collection.json:15. Contraste recalculado en V1 §9 (script scratchpad/v1scripts/cr.py) y A4-01.
- **Tipo de evidencia:** EST, SIN (contraste calculado).
- **Estado:** confirmado (estático y cálculo). Sin prueba en navegador ni con tecnología asistiva.
- **Recomendación y límites:** derivar el anillo del token del esquema o usar un anillo doble. Medido contra el fondo del esquema, no contra imágenes. Los enlaces usan el anillo base y no se midieron por preset.
- **Fuentes:** A4-01, V1 §9.

#### TT-03 · Sartorial · Imprint y Archive por defecto; Sartorial si se añade el bloque · P1
- **Criterio:** contenido falso visible al comprador sin que el comerciante lo pida producto por producto.
- **Condición:** los bloques `technical_specs` y `provenance` de main-product leen metafields que el ZIP no declara ni documenta (`custom.material`, `custom.gsm`, `custom.hardware`, `custom.origin`, `custom.technical_specs`, `sartorial.*`, `custom.provenance_*`, `custom.circa_year`, `custom.condition_grade`). Cuando faltan: (a) si el handle contiene `brass` o `paperweight`, se imprimen las cadenas fijas en inglés "Solid milled brass" y "Precision machined"; (b) en productos textiles se usan los ajustes del bloque, que son de plantilla y salen iguales en todos los productos; (c) provenance aplica el "Circa" del bloque a productos cuyo título contiene "19" o "20". Si todo está vacío, el bloque no sale (de ahí que el rasgo más original de Imprint y Archive pueda no verse en la demo).
- **Impacto:** afirmaciones de material y época falsas en la PDP; el `info` del editor dice "this product" cuando el ajuste es de plantilla; el diferencial de Imprint y Archive puede quedar invisible si la demo no carga esos metafields.
- **Reproducción:** preset Imprint, producto con handle `brass-ring` y tipo vacío: la PDP muestra "Solid milled brass / Precision machined".
- **Evidencia:** sartorial-zip/snippets/product-technical-specs.liquid:48 (heurística `is_non_textile`), :54 y :70 (cadenas fijas), :80-84 (sin producto); snippets/product-provenance.liquid:29-35 (heurística "19"/"20"); locales/en.default.schema.json:1011, 1015, 1019, 1035, 1067; listings/imprint/templates/product.json:71-80 y listings/archive/templates/product.json:71-80. Conflicto A6-01 frente a A8-03 resuelto por la síntesis leyendo el snippet: ambos son correctos en casos distintos.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado en código; no renderizado.
- **Recomendación y límites:** quitar cadenas fijas y heurísticas; que el bloque solo muestre datos del producto y se oculte si faltan; reescribir los `info`. Las siete definiciones de metafields propuestas para Sartorial **no están creadas, ni en uso, ni aprobadas**; esta recomendación no las da por existentes. Límite: la gravedad depende de cuántos comerciantes usen la PDP de Imprint o Archive tal cual.
- **Fuentes:** A6-01, A8-03.

#### TT-05 · Sartorial · todos · P1
- **Criterio:** riesgo alto en la etapa 5 (soporte) con hechos sin confirmar; si se confirma que el buzón no es propio, es bloqueante.
- **Condición:** support.html muestra `mailto:support@ruizdigital.com`. Lo observado en https://ruizdigital.com: HTTP 200, sitio hecho con Canva Websites, título "Ruiz Digital | Content Marketing", único email `alex@ruizdigital.com`. No hay evidencia de que el autor del tema controle ese buzón, pero tampoco se demostró quién es el dueño. Además, theme_documentation_url y theme_support_url apuntan a noobprobro-web.github.io, una cuenta distinta de la que usan Atelier y Cucuyo (SebastianDev017), con titularidad no evaluada. El ZIP no menciona ruizdigital.com; theme_author es "Ruiz Digital".
- **Impacto:** si el buzón es de un tercero, los tickets de comerciantes se pierden o los lee otra persona.
- **Reproducción:** descargar support.html y revisar la línea 271; visitar ruizdigital.com.
- **Evidencia:** support.html:271; sartorial-zip/config/settings_schema.json:5, :7-8; V1 §2.
- **Tipo de evidencia:** EST-web, EST.
- **Estado:** parcialmente confirmado: el email está presente; la titularidad del dominio y de la cuenta de GitHub no está demostrada. **Riesgo a confirmar con Johandry**, no un hecho probado.
- **Recomendación y límites:** confirmar con Johandry quién controla ruizdigital.com y noobprobro-web; si no es propio, usar un buzón verificado. No se consultó WHOIS.
- **Fuentes:** A7-02, A1-14, V1 §2.

#### TT-07 · Atelier · Contour, Annex, Maison · P1
- **Criterio:** rompe un flujo de compra común (cambiar cantidad en el carrito) sin aviso. La prioridad se sostiene porque **cualquier** respuesta de error o no JSON produce el mismo fallo silencioso (por ejemplo el 429 de límite de peticiones, que sí está documentado, o una página de error en HTML), no porque se haya demostrado una respuesta concreta ante exceso de stock.
- **Condición:** `postChange` hace `res.json()` sin mirar `res.ok`. Si /cart/change.js devuelve un JSON de error, el objeto es truthy y no trae `item_count`, así que se llama `updateCartCount(undefined)`. Si devuelve algo que no es JSON, `res.json()` falla y el error cae en el `.catch` vacío. La referencia Ajax API de Shopify no documenta qué responde change.js cuando se piden más unidades que el stock (D10). Comportamiento corregido por V1: `parseInt(undefined)` da NaN, se escribe "NaN" en el contador pero se añade `is-empty`, que lo oculta (`display: none`); el contador **desaparece como si el carrito estuviera vacío**. El texto accesible `[data-cart-count-text]` no se actualiza y conserva el valor viejo. El `.catch(function () {})` silencia el error. El input de cantidad tiene `min="0"` sin `max` ni `step`. `saveNote` también traga errores. En cambio, el add-to-cart sí revisa `data.status`.
- **Impacto:** el comprador cree que el cambio se aplicó, el icono del carrito parece vacío y no recibe mensaje ni anuncio (WCAG 3.3.1 y 4.1.3).
- **Reproducción (requiere tienda):** drawer o /cart con un producto de una unidad en stock; escribir 5 en cantidad y salir del campo, y observar qué responde el servidor. Alternativa determinista: simular una respuesta de error o no JSON de /cart/change.js con las herramientas del navegador.
- **Evidencia:** atelier-main/assets/cart.js:33-39 (`postChange`), :20-26 (`updateCartCount`), :152-164 (drawer, `.catch` vacío en :162), :296-310 (página de carrito), :290 (`saveNote`), :216 y :338 (contraste: add-to-cart revisa `data.status`); sections/header.liquid:155, :288-291, :597; snippets/cart-item.liquid (input sin max). Mismo archivo en las tres ramas (md5 idéntico, V1).
- **Tipo de evidencia:** EST.
- **Estado:** parcialmente confirmado: el camino del código está confirmado; la respuesta del servidor en el caso de exceso de stock no está documentada ni probada.
- **Recomendación y límites:** comprobar `res.ok` y la presencia de `item_count`; ante error, restaurar el valor, mostrar `message` en una región `role="alert"` y no tocar el contador; calcular `max` desde el inventario.
- **Fuentes:** A2-06, A3-02, A4-11, V1 §8, R1 §1 (F2).

#### TT-08 · Atelier · Contour y Maison (y el theme_name Contour) · P1
- **Criterio:** riesgo alto frente a un requisito escrito de nombres (§18), con interpretación por confirmar.
- **Condición:** https://themes.shopify.com/themes/responsive/presets/contour responde 200 ("Responsive - Contour") y https://themes.shopify.com/themes/gain/presets/maison responde 200 ("Gain - Maison", de pago). Control: un preset inventado redirige. Contour es además el theme_name.
- **Impacto:** la regla dice "Don't use the same name as an existing theme and preset name". Es un riesgo real en la etapa 5. **No se afirma que sea la causa de ningún rechazo.**
- **Reproducción:** visitar las dos URLs.
- **Evidencia:** V1 §7; A7-20; atelier-main/config/settings_schema.json:4; settings_data.json `presets`.
- **Tipo de evidencia:** EST-web, EST.
- **Estado:** confirmado (los presets existen); la aplicación exacta de la regla a presets de otros temas está por confirmar.
- **Recomendación y límites:** elegir nombres sin colisión o confirmar con Shopify antes de un nuevo envío. "Annex" solo se probó como slug de tema (404); no se recorrieron todos los presets existentes.
- **Fuentes:** A7-20, V1 §7.

#### TT-09 · Atelier · Contour, Annex, Maison · P1
- **Criterio:** riesgo alto de originalidad (§2) y de parecido de marca, con similitud visual sin comprobar.
- **Condición:** DESIGN.md:15-18 dice que el contrato visual "was reverse-engineered from fieldstudiesflora.com with Playwright on 2026-06-23" y que la paleta, las familias tipográficas, el header de 48 px y la rejilla de 24 columnas se copiaron "verbatim from the site's `:root`". DESIGN.md:50-55 toma de esa tienda la nav lateral numerada y el orden de la tarjeta. TOKENS.md:7 dice que los valores salen del scrape. La nav lateral es el rasgo más distintivo de Atelier en el eje de header. No se afirma copia de código.
- **Impacto:** si un revisor reconoce la referencia, la originalidad pesa menos; hay riesgo de trade dress.
- **Reproducción:** leer DESIGN.md:15-55 y TOKENS.md:1-61.
- **Evidencia:** atelier-main/DESIGN.md:15, 17-18, 23-43, 50-55; TOKENS.md:7-12, 61; sections/header.liquid:180-230. El sitio existe (`curl -I` devuelve 301; no se visitó más).
- **Tipo de evidencia:** EST, EST-web.
- **Estado:** confirmado (lo que dicen los documentos); similitud visual no evaluada.
- **Recomendación y límites:** redefinir paleta, tarjeta y nav con criterio propio y no distribuir los documentos de extracción. Hace falta una comparación visual que esta auditoría no hizo.
- **Fuentes:** A8-04, V1 §1.

#### TT-31 · Atelier · repositorio (no el ZIP) · P1
- **Criterio:** credencial expuesta en un repositorio legible públicamente (tabla 6.1). Subido de P2 a P1 tras R1 §2. No es P0: no impide el envío ni rompe la compra, y según A7 da acceso a los storefronts de demo, no al admin.
- **Condición:** DEVELOPMENT.md:7 contiene una contraseña en texto plano (según A7, la de las demos). DEVELOPMENT.md:4 dice que no entra en el ZIP. DEVELOPMENT.md:6 declara el repositorio "(private)", pero hacia las 20:30 del 2026-10-27 `git ls-remote` anónimo contra github.com/SebastianDev017/atelier tuvo éxito a través de un proxy que solo sirve repos públicos sin credenciales: el repositorio era legible públicamente en ese momento y la afirmación de DEVELOPMENT.md:6 estaba contradicha. El 403 de A7 vino del proxy sobre la web de GitHub, no del repositorio. El mismo repositorio publica el gmail personal de listings/*/listing.json:5 (TT-33). .shopifyignore no excluye DEVELOPMENT.md de la sincronización con la tienda (excluye preview.html, DESIGN.md, TOKENS.md, listings/, *.zip).
- **Impacto:** la contraseña de las demos y un email personal quedaron al alcance de cualquiera mientras el repositorio fue público; el historial de git la conserva aunque se borre del archivo.
- **Reproducción:** `grep -n -i password DEVELOPMENT.md | cut -d: -f1` (solo número de línea); `git ls-remote` anónimo contra el repositorio.
- **Evidencia:** DEVELOPMENT.md:4, :6, :7; .shopifyignore; listings/*/listing.json:5; R1 §2. A5 no lo detectó porque buscaba patrones de token (conflicto resuelto).
- **Tipo de evidencia:** EST, EST-web (consulta anónima del remoto).
- **Estado:** confirmado: presencia de la contraseña (valor no leído) y legibilidad pública del repositorio a las 20:30. Si la contraseña sigue vigente no se evaluó.
- **Recomendación y límites:** rotar la contraseña de las demos (todas deben compartirla, así que se cambia en las tres a la vez), sacarla del archivo y purgarla del historial de git, y decidir de forma explícita la visibilidad del repositorio. La contraseña de las demos se entrega en el formulario de envío, no en git. Esta recomendación no autoriza a ejecutar la rotación ni la purga: las decide el dueño del repositorio.
- **Fuentes:** A1-10, A7-28, R1 §2.

#### TT-10 · Cucuyo · Cucuyo · P1
- **Criterio:** falta una capacidad OS 2.0 básica (app blocks), por expectativa del comerciante, no por requisito de revisión.
- **Condición:** 0 secciones aceptan `{"type": "@app"}`. main-product tiene 8 tipos de bloque, sin @app ni custom_liquid. No hay sección custom-liquid ni theme blocks.
- **Impacto:** apps de reseñas, suscripciones, cuotas, tallas o upsell no pueden insertarse como bloque; solo quedan los app embeds o tocar código.
- **Reproducción:** editor, producto, añadir bloque: no aparece la pestaña de apps (no probado en editor).
- **Evidencia:** cucuyo/sections/main-product.liquid:374-560; grep de `"@app"` en sections/: 0.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado.
- **Recomendación y límites:** añadir @app a main-product, main-cart, main-collection y footer, y una sección custom-liquid. Es un tema a medida.
- **Fuentes:** A2-13, A6-10.

#### TT-11 · Cucuyo · configuración actual · P1
- **Criterio:** barrera de accesibilidad seria en configuración activa (WCAG 4.1.2).
- **Condición:** el schema del popup sí tiene un valor por defecto para `button_label` (`"default": "submit"`, newsletter-popup.liquid:434-436), pero la configuración actual lo vacía (`"button_label": ""`, settings_data.json:46). El botón imprime ese valor sin respaldo (newsletter-popup.liquid:74). La sección se incluye de forma estática en layout/theme.liquid:65 (`{% section 'newsletter-popup' %}`) con `enabled: true`, y se abre a los 3 s.
- **Impacto:** `<button type="submit"></button>` sin nombre accesible: un lector de pantalla anuncia "botón" y el control por voz no puede nombrarlo.
- **Reproducción:** home sin la clave de suscripción en localStorage; esperar 3 s y tabular hasta el botón.
- **Evidencia:** cucuyo/sections/newsletter-popup.liquid:74, :434-436; config/settings_data.json:40-57 (`enabled: true`, `delay: 3`, `button_label: ""` en :46); layout/theme.liquid:65.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado en código, incluido que la sección está en uso en todas las páginas (inclusión estática con `enabled: true`). Sin render ni prueba con tecnología asistiva.
- **Recomendación y límites:** proteger el botón contra una etiqueta vacía (respaldo traducible cuando el ajuste quede en blanco) y añadir un `aria-label` de respaldo.
- **Fuentes:** A4-02, R1 §1 (F1).

### 6.5 P2

#### TT-04 · Sartorial · Imprint (docs de todos los presets) · P2
- **Criterio:** inconsistencia documental (tabla 6.1) frente al requisito de documentación consistente con los settings (requirements §21, etapa 5). Corrección trivial y fuera del ZIP; conviene cerrarla antes del envío (sección 9). Bajado de P1 a P2 tras R1 §4.
- **Condición:** docs.html y support.html publicados describen los presets "Sartorial, Edition, Archive" y un flujo de instalación por subida de ZIP ("from your Shopify account or your Theme Store purchase", "Add theme > Upload zip file"), que no es el flujo de un tema comprado en la Theme Store.
- **Impacto:** la documentación enlazada desde theme_info no coincide con el tema; el nombre de preset no se puede cambiar tras subir el ZIP, así que la corrección va en los docs.
- **Reproducción:** descargar https://noobprobro-web.github.io/sartorial-docs/docs.html y buscar "Edition".
- **Evidencia:** docs.html:204, :185-187; support.html:254; templates/page.documentation.json:10; settings_data.json `presets` (V1 §3).
- **Tipo de evidencia:** EST-web, EST.
- **Estado:** confirmado (docs leídos el 2026-10-27; pueden cambiar).
- **Recomendación y límites:** cambiar a Imprint, describir el flujo de la Theme Store y revisar el resto contra los settings reales.
- **Fuentes:** A7-01, A7-04, V1 §3.

#### TT-06 · Sartorial · Sartorial, Imprint, Archive · P2
- **Criterio:** riesgo frente al requisito de unicidad (§2) que depende solo del juicio del revisor. Dos ejes estándar de los cuatro que nombra Shopify, igual que Atelier en TT-24. Bajado de P1 a P2 tras R1 §4 para igualar el criterio entre los dos temas.
- **Condición:** un solo layout de header (nav a la izquierda, marca centrada, acciones a la derecha; sin select de layout) y una sola tarjeta de producto (sin grupo de ajustes de tarjeta). Los tres presets los comparten. Dos de los cuatro ejes que Shopify nombra salen como estándar.
- **Impacto:** la diferenciación se apoya solo en media/PDP y estructura de página. Aumenta el riesgo de una observación por diferenciación insuficiente. Es un riesgo, no un rechazo comprobado.
- **Reproducción:** schema de sections/header.liquid:209-262; config/settings_schema.json (sin grupo de tarjetas); snippets/product-card.liquid.
- **Evidencia:** sections/header.liquid:209-262; assets/base.css:619-624, 4389-4392; snippets/product-card.liquid:1-20; config/settings_data.json:82-311.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado (estructura); efecto en revisión: hipótesis.
- **Recomendación y límites:** valorar 2 o 3 layouts de header y 2 o 3 variantes de tarjeta, con una combinación distinta por preset. No se comparó con el catálogo actual de la Theme Store ni se vio una demo.
- **Fuentes:** A8-01.

#### TT-12 · Sartorial · todos · P2
- **Criterio:** deuda con impacto medible en peso por página.
- **Condición:** base.css (259.143 B, unos 50,6 a 50,9 KB gz, 10.011 líneas) es el único CSS y bloquea el render en todas las plantillas; theme.js (248.554 B, unos 57,5 a 57,9 KB gz, 28 componentes) va `defer` en el head en todas las páginas, incluidas password y gift card. Sin estrategia de carga posterior al paint. Minificado seguiría sobre 100 KB.
- **Impacto:** el mayor payload de CSS de los tres temas; efecto en LCP, TBT e INP no medido, y el umbral Lighthouse 60 está sin medir.
- **Reproducción:** `shopify theme check --path sartorial-zip --config theme-check:all`.
- **Evidencia:** layout/theme.liquid:54 y :95; Theme Check `all`: 3 AssetSizeCSS (theme.liquid:54, password.liquid:38, gift_card.liquid:27) y 3 AssetSizeJavaScript (theme.liquid:95, password.liquid:79, product-zoom.liquid:115); `recommended` en 0.
- **Tipo de evidencia:** EST, SIN.
- **Estado:** confirmado (tamaños); impacto en tiempos: hipótesis.
- **Recomendación y límites:** medir Lighthouse primero; luego valorar CSS por sección y JS por plantilla. No se sabe si el CDN minifica.
- **Fuentes:** A2-01, A5-07.

#### TT-13 · Sartorial · raíz del tema (ningún preset) · P2
- **Criterio:** inconsistencia que afecta a la regla "install store debe coincidir con la demo".
- **Condición:** templates/index.json (raíz) no coincide con ningún listing: tiene bento-discovery y no featured-product. templates/product.json:88 trae `media_layout: grid` y el listing de Sartorial `split_screen`; templates/index.json:6 trae hero `cinematic` y el listing de Sartorial `split`.
- **Impacto:** según cómo aplique Shopify el preset por defecto, una instalación limpia puede no mostrar el home ni la PDP de ningún preset.
- **Reproducción:** comparar templates/*.json con listings/*/templates/*.json.
- **Evidencia:** templates/index.json:6, :289; templates/product.json:88; listings/sartorial/templates/index.json:6 y product.json:88.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado (diferencias); efecto en la instalación no verificado.
- **Recomendación y límites:** alinear la raíz con el preset Sartorial o documentar la diferencia. La página "Updating your theme" (https://shopify.dev/docs/storefronts/themes/store/success/updates, citada por R1 §6) pide que la raíz de /templates y /sections contenga el "base set" completo y que no se incluyan JSON de demo que el comerciante no deba usar.
- **Fuentes:** A1-06, A8-10, R1 §6.

#### TT-14 · Sartorial · todos · P2
- **Criterio:** la ruta de soporte se rompe fuera de la demo y se publica contenido del autor en la tienda del comprador.
- **Condición:** el ZIP trae templates/page.documentation.json, page.support.json, sections/main-documentation.liquid y main-support.liquid. El formulario de main-support (`{% form 'contact' %}`, línea 114) llega al correo del propio comerciante. Además: "Presets change settings only" es incompleto (la composición de home por preset solo se aplica al instalar); "Release notes" anunciado sin URL; SLA de "two business days" frente a "Under 24 Business Hours" en la web; horario sin zona horaria.
- **Impacto:** el comerciante se escribe a sí mismo creyendo abrir un ticket con el autor; documentación del tema visible en su tienda si asigna la plantilla.
- **Reproducción:** leer main-support.liquid:1-10, :114 y las plantillas.
- **Evidencia:** sections/main-support.liquid:1-10, :114; templates/page.documentation.json:26, :111; page.support.json:24, :47, :61, :78.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado.
- **Recomendación y límites:** sacar esas plantillas del ZIP o convertirlas en enlaces a theme_support_url; unificar SLA. Que Theme Review lo marque es inferencia.
- **Fuentes:** A7-05, A7-06, A7-09, A6-02 (parte de plantillas).

#### TT-15 · Sartorial · todos · P2
- **Criterio:** estado degenerado al alcance del comerciante.
- **Condición:** siete secciones `main-*` de página (main-about, main-contact, main-documentation, main-faq, main-page, main-policy, main-support) tienen preset y no tienen `enabled_on`; todas imprimen `<h1>{{ page.title }}</h1>` sin condición.
- **Impacto:** añadibles en home, producto o colección con un H1 vacío o duplicado; ruido en el selector (20 secciones, 2 de ellas documentación y soporte del vendedor).
- **Reproducción:** editor, inicio, añadir sección "Page content".
- **Evidencia:** sections/main-page.liquid:13, :174; main-documentation.liquid:31, :307; main-support.liquid:47, :380; main-about.liquid:22, :368; main-policy.liquid:24, :97; main-faq.liquid:49, :261; main-contact.liquid:31, :316.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado en código; render no probado.
- **Recomendación y límites:** `enabled_on: {templates: ["page"]}` o quitar el preset.
- **Fuentes:** A6-02.

#### TT-16 · Sartorial · todos · P2
- **Criterio:** controles que faltan para un tema que se quiere vender a 380 USD.
- **Condición:** solo featured-product tiene padding propio; 12 selects de layout en todo el tema (7 en hero-editorial); footer sin bloques; 13 secciones de contenido general, sin texto enriquecido, imagen con texto, lista de colecciones, grid de colección simple, video, multicolumna, testimonios ni entradas de blog; sin theme blocks.
- **Impacto:** para montar páginas distintas de la demo hace falta custom-liquid o una app; no se ajusta el ritmo vertical por sección.
- **Reproducción:** conteo de schemas.
- **Evidencia:** A6 §1; sections/featured-product.liquid:605, 615; sections/footer.liquid (schema sin blocks).
- **Tipo de evidencia:** EST, SIN (conteo por script).
- **Estado:** confirmado (capacidad del editor, no calidad visual).
- **Recomendación y límites:** valorar 5 o 6 secciones genéricas y padding por sección.
- **Fuentes:** A6-03, A2-04.

#### TT-17 · Sartorial · Sartorial y Archive (Imprint en menor grado) · P2
- **Criterio:** presets con diferencia mayormente cosmética entre sí.
- **Condición:** en settings_data los presets solo cambian colores, fuente de títulos, escalas, espaciado y `motion_style` (que solo toca hovers y foco). Sartorial y Archive comparten Libre Baskerville y Assistant y el mismo `section_spacing`. Lo estructural vive en listings (hero, PDP, columnas, secciones de home); header y tarjeta no cambian.
- **Impacto:** entre Sartorial y Archive se notan sobre todo paleta y hero; puede leerse como el mismo tema con otra piel; al cambiar de estilo en el editor el comerciante solo ve color y escala.
- **Reproducción:** comparar settings_data.json:82-311 y listings/{sartorial,archive}.
- **Evidencia:** config/settings_data.json:85, 157, 162, 234, 239, 311; assets/base.css:9014-9128; listings/sartorial/templates/product.json:88; listings/archive/templates/product.json:99.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado.
- **Recomendación y límites:** dar a Archive su propia pareja tipográfica y una PDP propia. El peso de cada diferencia en la revisión no está publicado.
- **Fuentes:** A8-02, A6-04.

#### TT-18 · Sartorial · todos · P2
- **Criterio:** afirmaciones de marketing sin evidencia frente a una etapa que exige medición (etapa 2).
- **Condición:** docs.html afirma "blazing-fast native vanilla JavaScript architecture" y contraste "WCAG 2.2 AA" en los esquemas por defecto. "No third-party code dependencies" sí se verifica en código. No hay informes de Lighthouse; TT-02 muestra anillos de foco bajo 3:1 en dos presets.
- **Impacto:** afirmaciones no respaldadas, una de ellas contradicha parcialmente por el propio cálculo de contraste.
- **Reproducción:** leer docs.html.
- **Evidencia:** docs.html (A7-07); assets (base.css, theme.js, product-zoom.js; sin URLs externas fuera de Shopify, schema.org, w3.org, YouTube, Vimeo).
- **Tipo de evidencia:** EST-web, EST.
- **Estado:** confirmado (las afirmaciones existen y no hay mediciones).
- **Recomendación y límites:** medir Lighthouse en las tres demos y quitar "blazing-fast" y "WCAG 2.2 AA" hasta tener auditoría.
- **Fuentes:** A7-07.

#### TT-19 · Sartorial · todos · P2
- **Criterio:** posible fallo en el componente de cuenta, que es obligatorio.
- **Condición:** `menu="{{ section.settings.customer_account_menu }}"` pasa el objeto link_list en lugar de su handle; Atelier usa `.handle`.
- **Impacto:** el menú de cuenta configurado podría no aparecer en `<shopify-account>`.
- **Reproducción:** tienda con cuentas de cliente; inspeccionar el atributo `menu`.
- **Evidencia:** sartorial-zip/sections/header.liquid:191, :239-242.
- **Tipo de evidencia:** EST.
- **Estado:** hipótesis (no se sabe cómo imprime Liquid un link_list en un atributo).
- **Recomendación y límites:** usar `.handle` con comprobación de blank. Probar en tienda.
- **Fuentes:** A1-05.

#### TT-20 · Atelier · todos · P2
- **Criterio:** deuda con impacto medible y un gate de calidad que no representa el peso real.
- **Condición:** layout/theme.liquid:173-200 arma una lista fija de unos 20 scripts para todas las páginas (98 a 112 KB gz según plantilla y medición; incluye GSAP, ScrollTrigger, Lenis, SplitText o Flip, product.js y featured-product.js también en home y contenido). Fuera del editor se inyectan tras el first-contentful-paint o a los 3 s (:206-232). Theme Check no los ve y AssetSizeJavaScript está desactivado en .theme-check.yml; README.md:13 exige "0 offenses". DEVELOPMENT.md:12 dice que la config extiende `recommended` (usa `all`) y DEVELOPMENT.md:31 y :83 dicen que GSAP se retiró, pero está en assets y se carga. Smooth scroll (Lenis), animaciones, view transitions y grano de película están activos por defecto.
- **Impacto:** botones y formularios mejorados por JS no responden hasta después del FCP (o 3 s en segundo plano); en el editor el camino es distinto (`defer`); el "0 offenses" no equivale a lo que mida Shopify; documentación interna engañosa.
- **Reproducción:** leer theme.liquid:142-232 y sumar los gz de la lista.
- **Evidencia:** atelier-main/layout/theme.liquid:142-169, :173-200, :206-232; .theme-check.yml; README.md:13; DEVELOPMENT.md:12, :31, :83; assets/base.css:1037-1042, :1075-1086.
- **Tipo de evidencia:** EST, SIN.
- **Estado:** confirmado (estático); efecto en INP y TBT, y en la revisión: hipótesis.
- **Recomendación y límites:** cargar por sección los scripts que solo usan algunas secciones (el snippet script-after-paint ya existe), reactivar el check con umbral explícito y corregir DEVELOPMENT.md. Sin Lighthouse.
- **Fuentes:** A2-05, A5-09, A7-24.

#### TT-21 · Atelier · todos · P2
- **Criterio:** función de compra ausente que falla en silencio solo con productos de suscripción; el requisito literal (carrito) se cumple.
- **Condición:** no hay `selling_plan_groups` en secciones, snippets, bloques ni JS; el carrito solo muestra el nombre del plan. Con una variante `requires_selling_plan`, o con un 200 sin `sections`, el submit no abre el drawer ni muestra error.
- **Impacto:** un producto de suscripción no se puede comprar desde la PDP sin una app (main-product admite @app, así que una app puede aportar el selector).
- **Reproducción:** producto con plan obligatorio; pulsar Añadir al carrito.
- **Evidencia:** atelier-main/snippets/cart-item.liquid:37-38; assets/cart.js:196-229; grep de selling_plan en sections/main-product.liquid y assets/product.js: 0.
- **Tipo de evidencia:** EST, EST-web (texto del requisito).
- **Estado:** confirmado (ausencia); rotura silenciosa condicionada a la existencia de esos productos.
- **Recomendación y límites:** documentar el límite y ocultar el botón con mensaje cuando el plan sea obligatorio, o añadir selector. No se probó con una app.
- **Fuentes:** A1-01, A3-03, A7-30.

#### TT-22 · Atelier · todos · P2
- **Criterio:** acción de compra secundaria que falla sin que el comprador lo sepa.
- **Condición:** `showError` sale en silencio si no existe `[data-form-error]`, y el form de quick add de la tarjeta no lo tiene. `addBundleItem` añade la primera variante disponible de cualquier producto (también con varias variantes) e ignora errores.
- **Impacto:** un 422 desde la tarjeta no muestra nada; el bundle puede añadir una talla o color que el comprador no eligió.
- **Reproducción:** añadir desde la tarjeta una variante con límite; añadir desde "Pairs well with".
- **Evidencia:** assets/cart.js (showError; addBundleItem :321-353); snippets/product-card.liquid:54-60; snippets/bundle-item.liquid, bundle.liquid.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado en código.
- **Recomendación y límites:** región `role="alert"` en cada form de tarjeta; "Choose options" para productos con varias variantes en el bundle.
- **Fuentes:** A3-04.

#### TT-23 · Atelier · todos · P2
- **Criterio:** reglas de cantidad de la plataforma ignoradas en la PDP.
- **Condición:** el input de cantidad de la PDP tiene `min="1"` fijo, sin `max` ni `step`; no lee `variant.quantity_rule`.
- **Impacto:** con reglas de múltiplos o mínimos (B2B, mayoristas) el servidor rechaza el alta, con el problema de feedback de TT-22.
- **Reproducción:** producto con quantity_rule distinta de 1.
- **Evidencia:** atelier-main/sections/main-product.liquid:221.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado.
- **Recomendación y límites:** aplicar min, step y max desde quantity_rule. Solo afecta a catálogos con reglas.
- **Fuentes:** A3-06 (parte de cantidad).

#### TT-24 · Atelier · todos · P2
- **Criterio:** riesgo frente al requisito de unicidad (§2) que depende solo del juicio del revisor. Dos ejes estándar de los cuatro (tarjeta y media/PDP), igual que Sartorial en TT-06; misma prioridad para los dos. El encaje con moda de lujo se trata aparte (TT-85, sección 9).
- **Condición:** un solo layout de galería (escenario y tira de miniaturas), sin zoom ni lightbox ("the theme has no zoom or lightbox"); una sola tarjeta; header sin variantes. Los presets no cambian ninguna de las tres.
- **Impacto:** la diferenciación queda en header y estructura de página; para piezas de detalle (Annex: obras firmadas) falta zoom.
- **Reproducción:** schema de sections/main-product.liquid:999-1032.
- **Evidencia:** snippets/product-media.liquid:1-10, :22; sections/main-product.liquid:999-1009; snippets/product-card.liquid:69.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado.
- **Recomendación y límites:** zoom accesible y al menos un layout alternativo seleccionable por preset.
- **Fuentes:** A8-05, A3-06 (parte de zoom).

#### TT-25 · Atelier · Contour, Annex, Maison · P2
- **Criterio:** promesas comerciales activas por defecto que el comerciante no configuró.
- **Condición:** los tres presets entregan `cart_show_free_shipping_bar: true` con umbral 150; el umbral es `setting * 100` contra `cart.total_price` sin comprobar la moneda activa. trust-badges reutiliza la frase de envío gratis y trae "30-day returns" y "Made to order" fijos en inglés; los presets añaden "Secure checkout", "Signed and numbered", "Museum-grade materials", "Insured delivery", "Food-safe glazes", "Made by hand", "Packed to arrive whole".
- **Impacto:** promesa de envío gratis aunque la tienda no la ofrezca; con Markets, cifra en moneda de tienda mostrada como moneda del comprador; afirmaciones (incluida una de seguridad alimentaria) que el comerciante debe poder cumplir.
- **Reproducción:** instalar un preset sin tocar ajustes.
- **Evidencia:** snippets/cart-shipping-bar.liquid; snippets/free-shipping-claim.liquid; snippets/trust-badges.liquid; config/settings_data.json de las tres ramas; templates/product.json de cada preset.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado (defaults); efecto multimoneda: hipótesis.
- **Recomendación y límites:** default en false, guarda de moneda, textos traducibles y vacíos por defecto.
- **Fuentes:** A3-07, A3-16 (parte de textos).

#### TT-26 · Atelier · todos · P2
- **Criterio:** filtros usables pero con consistencia y accesibilidad degradadas.
- **Condición:** auto-envío con debounce de 400 ms y fetch de página completa sin AbortController; reemplazo de `form.innerHTML` (se pierde el foco); `.collection__count` no es región viva; en móvil `details.collection__facets` abierto por defecto; sidebar sticky sin max-height ni overflow.
- **Impacto:** una respuesta vieja puede pisar a una nueva; con lector de pantalla no se anuncia el resultado; en móvil los filtros tapan los productos.
- **Reproducción:** filtrar con teclado o red lenta.
- **Evidencia:** atelier-main/assets/theme.js:541-660; sections/main-collection.liquid.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado (foco y anuncio); carrera parcialmente confirmada.
- **Recomendación y límites:** AbortController, aria-live, restaurar foco, filtros cerrados en móvil.
- **Fuentes:** A3-08.

#### TT-27 · Atelier · todos · P2
- **Criterio:** promesa al comprador ("You're on the list") que no corresponde a una lista automática.
- **Condición:** notify-me usa el formulario de contacto de Shopify, exige `contact[accepts_marketing]`, tiene textos literales en inglés con `| default:` y product.js reescribe el cuerpo en inglés.
- **Impacto:** el comerciante recibe correos manuales; el consentimiento de marketing queda atado al aviso; textos sin traducir.
- **Reproducción:** producto con una variante agotada.
- **Evidencia:** snippets/notify-me.liquid; assets/product.js:62-105; sections/main-product.liquid:293-314.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado.
- **Recomendación y límites:** traducir, no atar el consentimiento y decir que el comerciante responderá por correo. El aspecto legal no se evaluó.
- **Fuentes:** A3-15.

#### TT-28 · Atelier · Contour · P2
- **Criterio:** WCAG 1.4.3 en estado hover.
- **Condición:** `.btn:hover` cambia el fondo al acento y deja la etiqueta clara; en Contour da 3.33:1 (Maison 4.73, Annex 17.76).
- **Impacto:** baja visión con ratón o lupa; no afecta a teclado ni táctil.
- **Reproducción:** pasar el cursor sobre un `.btn` en Contour.
- **Evidencia:** assets/base.css:540; sections/hero.liquid:269-271; sections/main-product.liquid:481; tabla 5.2 de A4.
- **Tipo de evidencia:** EST, SIN.
- **Estado:** confirmado (código y cálculo).
- **Recomendación y límites:** oscurecer el acento en hover hasta 4.5:1.
- **Fuentes:** A4-09.

#### TT-29 · Atelier · todos · P2
- **Criterio:** WCAG 1.4.11.
- **Condición:** `.notify-me__input` usa el borde del esquema, que mide 1.01 a 1.49:1 en esquemas claros (1.88 a 1.97 en oscuros), a diferencia de `.input` (mezcla 60 %). En foco se quita el outline y el indicador es solo el cambio del borde de 1 px a `--color-text` (base-components.css:605-608).
- **Impacto:** el campo casi no se distingue en reposo; el indicador de foco existe pero es fino.
- **Reproducción:** producto agotado; observar el campo.
- **Evidencia:** assets/base-components.css:594-608; assets/base.css:737-754; tablas 5.2 de A4.
- **Tipo de evidencia:** EST, SIN.
- **Estado:** confirmado.
- **Recomendación y límites:** reutilizar `.input` o el borde fuerte (3.02 a 3.53:1).
- **Fuentes:** A4-10.

#### TT-30 · Atelier · todos (condicional) · P2
- **Criterio:** WCAG 2.2.2 (nivel A) en acciones habituales del comerciante (poner video en el hero, añadir marquee).
- **Condición:** el hero con `video_url` usa `<video autoplay muted loop playsinline>` sin pausa ni condición de reduced-motion; marquee y press-marquee solo pausan con `:hover`.
- **Impacto:** movimiento de más de 5 s que teclado, táctil o conmutador no pueden detener. Inactivo en las plantillas entregadas.
- **Reproducción:** configurar video en el hero o añadir marquee.
- **Evidencia:** sections/hero.liquid:56-60; sections/marquee.liquid:53-66, :82-86; sections/press-marquee.liquid:63-76.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado en código; condicional.
- **Recomendación y límites:** botón de pausa y poster con reduced-motion.
- **Fuentes:** A4-13, A4-14.

#### TT-32 · Atelier · todos · P2
- **Criterio:** documentación pública (§21) sin FAQ y con afirmaciones no respaldadas o contradictorias.
- **Condición:** docs/index.html no tiene FAQ. Dice "installs automatically with demo content" (:70), pero Shopify dice "Demo imagery doesn't transfer" y RELEASE-NOTES lo reconoce. Dice "built to WCAG 2.2 AA... minimum 44×44px touch targets" (:192-194) mientras RELEASE-NOTES.md:33 dice 24 x 24 px; `min-height: 44px` solo en algunos controles.
- **Impacto:** documentación inconsistente que un revisor puede señalar.
- **Reproducción:** leer docs/index.html y RELEASE-NOTES.md.
- **Evidencia:** atelier-main/docs/index.html:70, :192-194; RELEASE-NOTES.md:33; assets/base.css:701, 898, 909-910, 925.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado.
- **Recomendación y límites:** añadir FAQ, reescribir la frase de instalación y dejar una sola cifra de accesibilidad respaldada por medición.
- **Fuentes:** A7-21, A7-22, A7-23.

#### TT-33 · Atelier · todos · P2
- **Criterio:** archivos no previstos por la especificación de /listings, con un email personal y mucho peso.
- **Condición:** listings/<preset>/ contiene listing.json (con support_email de gmail personal, demo_store_url, documentation_url) y preview.png (2000x2496, 4,5 a 4,8 MB cada uno, unos 14 MB). La especificación solo describe templates/ y sections/ opcional; V1 confirma que esos archivos son extras propios, no requisito. DEVELOPMENT.md:80 dice "No stray files in /listings".
- **Impacto:** comportamiento del validador del ZIP desconocido; email personal (gmail) dentro del paquete, y además publicado mientras el repositorio fue legible públicamente (TT-31); paquete de 17 MB.
- **Reproducción:** `find atelier-main/listings -type f`; `du -sh atelier-main/listings`.
- **Evidencia:** atelier-main/listings/*/listing.json:5; listings/*/preview.png; DEVELOPMENT.md:80; V1 §5.
- **Tipo de evidencia:** EST, EST-web.
- **Estado:** confirmado (archivos); efecto en el validador no verificado.
- **Recomendación y límites:** dejar en /listings solo templates/ y llevar los datos al formulario.
- **Fuentes:** A7-26, A1-12 (parte Atelier), V1 §5.

#### TT-34 · Cucuyo · Cucuyo · P2
- **Criterio:** información de compra descartada en el carrito; sube a P1 si la tienda usa descuentos automáticos o propiedades de línea (no verificado).
- **Condición:** main-cart solo pinta título de variante, final_line_price y eliminar: sin descuentos de línea ni de carrito, sin propiedades, sin plan de venta, sin precio unitario, sin nota, sin checkout acelerado.
- **Impacto:** un precio rebajado aparece sin explicación; la personalización introducida por el comprador no se muestra antes de pagar. El popup por defecto ya promociona un código de descuento (TT-89).
- **Reproducción:** tienda con descuento automático o propiedades de línea.
- **Evidencia:** cucuyo/sections/main-cart.liquid:1-83.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado (ausencias); impacto depende de la configuración de la tienda.
- **Recomendación y límites:** mostrar line_level_discount_allocations, cart_level_discount_applications y propiedades sin "_". El cliente pudo decidir un carrito mínimo.
- **Fuentes:** A3-18.

#### TT-35 · Cucuyo · Cucuyo · P2
- **Criterio:** funciones de compra ausentes que importan para parte del catálogo.
- **Condición:** el formulario solo lleva el id oculto: sin cantidad, sin payment_button ni payment_terms, sin plan, sin destinatario de gift card, sin mensaje de inventario, sin pickup, sin aviso de reposición; alta por envío nativo a /cart; sin elemento de `form.errors`.
- **Impacto:** un 422 con repintado nativo podría no mostrar mensaje (hipótesis); sin cantidad en PDP.
- **Reproducción:** cualquier producto.
- **Evidencia:** cucuyo/snippets/pdp-block.liquid:152-240.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado (ausencias); efecto del 422: hipótesis.
- **Recomendación y límites:** priorizar cantidad, mensaje de error y agotado con aviso. Algunas ausencias son decisiones del cliente (precio dentro del botón).
- **Fuentes:** A3-19.

#### TT-36 · Cucuyo · Cucuyo · P2
- **Criterio:** merchandising mínimo de colección.
- **Condición:** sin filtros ni orden; tarjetas sin precio, insignias, quick add ni estado agotado; comentario de la sección desactualizado ("name + price").
- **Impacto:** catálogos de más de una docena de piezas son difíciles de recorrer.
- **Reproducción:** abrir una colección.
- **Evidencia:** cucuyo/sections/main-collection.liquid:1-227 (:7, :9); snippets/product-card.liquid.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado.
- **Recomendación y límites:** sort_by y marca de agotado como mínimo. Decisión editorial documentada.
- **Fuentes:** A3-21.

#### TT-37 · Cucuyo · Cucuyo · P2
- **Criterio:** el gate de calidad falla con su propia configuración.
- **Condición:** `shopify theme check` con la config del repo da valid:false: LiquidHTMLSyntaxError en snippets/color-swatches.liquid:154, OrphanedSnippet falso en color-palette.liquid (consecuencia) y AssetSizeCSS en theme.liquid:23 y password.liquid:25 (base.css de 130.455 B frente a un umbral propio ya subido a 130.000). La bisección de A5 aisla el disparador en el comentario Liquid dentro de la etiqueta `<a>` (líneas 120-124); A2 había supuesto los comentarios dentro de `{% liquid %}` y A5 comprobó que quitarlos no lo arregla. .theme-check.yml sube también AssetSizeJavaScript a 100.000.
- **Impacto:** gate inutilizable; efecto en runtime probablemente nulo (Liquid de producción acepta esos comentarios), sin confirmar.
- **Reproducción:** `shopify theme check --path cucuyo --output json`.
- **Evidencia:** snippets/color-swatches.liquid:120-124, :154; .theme-check.yml; salidas en scratchpad/cli, scratchpad/a5tc.
- **Tipo de evidencia:** SIN, EST.
- **Estado:** confirmado con la herramienta; aceptación del servidor no comprobada.
- **Recomendación y límites:** sacar el comentario de la etiqueta y recortar base.css.
- **Fuentes:** A2-12, A5-02, A5-06 (parte de umbral), A7-44.

#### TT-38 · Cucuyo · Cucuyo · P2
- **Criterio:** personalización rota.
- **Condición:** css-variables se renderiza antes de base.css, y base.css:190-194 vuelve a declarar en `:root` `--card-gap`, `--card-text-inset`, `--card-text-start`, `--card-text-top` y `--card-text-space`. Misma especificidad: gana base.css.
- **Impacto:** cinco ajustes del personalizador no tienen efecto (settings_data guarda card_gap 10 y card_text_inset 20; se renderiza 5 px y 18 px).
- **Reproducción:** comparar layout/theme.liquid:10 y :23 con base.css:190-194.
- **Evidencia:** cucuyo/layout/theme.liquid:10, :23; snippets/css-variables.liquid:81-85; assets/base.css:190-194.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado por lectura de cascada; efecto visual no medido.
- **Recomendación y límites:** renderizar las variables después del CSS o quitar el bloque duplicado.
- **Fuentes:** A5-01.

#### TT-39 · Cucuyo · Cucuyo · P2
- **Criterio:** peso del paquete y archivos de trabajo distribuidos.
- **Condición:** assets/ pesa unos 27 MB con 106 a 108 JPG (exportes `figma-*`, `pdf-*`, `story-*`), de los cuales unos 79 a 80 (unos 19 MB) no tienen referencia. 22 ajustes `draft_asset` sirven JPG por `asset_url`, sin srcset ni conversión; 13 secciones exponen el campo "Draft asset filename". `alt="{{ alt_text }}"` sin `| escape` en draft-image.liquid:53. scripts/build-pages.py usa rutas locales de Windows; hay lorem ipsum en scripts/build-index.py; no hay .shopifyignore.
- **Impacto:** imágenes de hasta 898 KB que no se adaptan a la pantalla; jerga de trabajo en el editor; un alt con comillas rompe el atributo.
- **Reproducción:** `du -sh cucuyo/assets`; `grep -rn draft_asset templates/*.json`.
- **Evidencia:** snippets/draft-image.liquid:1-20, :49-60, :53; assets/ (search-sea-2600.jpg 897.930 B); scripts/build-pages.py; scripts/build-index.py.
- **Tipo de evidencia:** EST, SIN.
- **Estado:** confirmado.
- **Recomendación y límites:** subir imágenes definitivas a Archivos o image_picker, borrar las sin uso, escapar el alt y excluir scripts. Permisos de uso de imágenes del cliente no evaluados.
- **Fuentes:** A2-16, A5-03, A1-12 (parte Cucuyo), A6-12 (parte draft), A7-44 (lorem).

#### TT-40 · Cucuyo · Cucuyo · P2
- **Criterio:** riesgo de rendimiento significativo sin medir.
- **Condición:** Lenis, GSAP, ScrollTrigger, gsap-init y gsap-animations (unos 50 KB gz) en todas las páginas para 3 efectos (2.530 B). `gsap.from('.home-hero__cell', {opacity: 0, duration: 1.1})` oculta y vuelve a mostrar el hero ya pintado; lo mismo con tarjetas visibles. El hero va eager sin fetchpriority.
- **Impacto:** posible parpadeo y LCP retrasado (hipótesis).
- **Reproducción:** leer assets/gsap-animations.js:15-22, :28-41, :56-62.
- **Evidencia:** cucuyo/layout/theme.liquid:75-79; assets/gsap-animations.js; sections/home-hero.liquid:30-38.
- **Tipo de evidencia:** EST, SIN (pesos).
- **Estado:** peso confirmado; efecto en LCP: hipótesis.
- **Recomendación y límites:** no animar lo ya visible, fetchpriority en el primer hero, o IntersectionObserver con CSS.
- **Fuentes:** A2-17, A5-04.

#### TT-41 · Cucuyo · Cucuyo · P2
- **Criterio:** el editor deja de funcionar después de editar.
- **Condición:** IIFE de 1.209 líneas con 13 inicializadores; en `shopify:section:load` solo se re-ejecutan 2 (initStoryGallery, initProductStrips); variantes, tabs, swatches, drawer y autoplay se enlazan una vez; sin `shopify:section:unload`; en assets/theme.js hay 49 apariciones de addEventListener (en 47 líneas) frente a 1 removeEventListener (A2 contó 51; recuento de la síntesis); errores tragados y `/cart.js` fijo.
- **Impacto:** tras cambiar un ajuste de la PDP o del header en el editor, swatches, botón y menú móvil dejan de responder hasta recargar.
- **Reproducción:** editor, producto, cambiar "Media ratio", pulsar un swatch.
- **Evidencia:** cucuyo/assets/theme.js:100-103, :259-275, :385-392, :416-435, :643-660, :1160-1209; assets/gsap-animations.js:71-74.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado en código; no probado en el editor.
- **Recomendación y límites:** inits con `root` o custom elements. En storefront el carrito funciona sin JS.
- **Fuentes:** A2-18, A5-13, A6-11.

#### TT-42 · Cucuyo · Cucuyo · P2
- **Criterio:** editor no localizable, sin sistema de color y con jerga interna.
- **Condición:** sin color_scheme_group (6 colores globales y 28 pickers sueltos), sin font picker, 833 cadenas de schema fijas en inglés (0 `t:`), ningún *.schema.json; etiquetas como "Portrait 4:5 (Figma)", "Portrait, card shape (PDFs)", "as in the design".
- **Impacto:** no hay paletas reutilizables; editor solo en inglés y con jerga de diseño. Coherente con una tienda a medida, por debajo del listón de un tema comercial.
- **Reproducción:** abrir settings_schema.json y schemas de sección.
- **Evidencia:** cucuyo/config/settings_schema.json:10-81, :116, :127, :156; sections/home-hero.liquid:90, :120-122; sections/footer.liquid:162; sections/hero.liquid:53.
- **Tipo de evidencia:** EST, SIN (conteo).
- **Estado:** confirmado.
- **Recomendación y límites:** pasar a `t:`, quitar referencias a Figma y PDFs. La clienta trabaja en inglés.
- **Fuentes:** A2-14, A6-12, A6-14.

#### TT-43 · Cucuyo · Cucuyo · P2
- **Criterio:** documentación que contradice el código.
- **Condición:** README.md:27 dice que las fuentes salen de la librería nativa (`cormorant_n5` + `assistant_n4`) y que todo se edita desde el editor; en realidad css-variables.liquid carga Persona y Junction autoalojadas y no hay font_picker. docs/STYLE-GUIDE.md repite el claim. El README describe "Left sidebar navigation" y el header es una fila horizontal.
- **Impacto:** la clienta no puede cambiar la tipografía, contra lo documentado. Licencias de Persona y Junction no evaluadas.
- **Reproducción:** `grep -n "font-heading:\|font-body:" snippets/css-variables.liquid`.
- **Evidencia:** cucuyo/README.md:27; snippets/css-variables.liquid:3-5, :51-53; docs/STYLE-GUIDE.md; sections/header.liquid.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado.
- **Recomendación y límites:** corregir README y STYLE-GUIDE o añadir font pickers.
- **Fuentes:** A1-09, A7-42, A8 §4 (E1, E6).

#### TT-44 · Cucuyo · Cucuyo · P2
- **Criterio:** plantillas OS 2.0 ausentes.
- **Condición:** no existen templates/blog.json, article.json, list-collections.json ni gift_card.liquid, ni secciones main-blog y main-article.
- **Impacto:** /blogs/*, /collections y la página de gift card sin plantilla del tema; lo que renderiza Shopify no se comprobó.
- **Reproducción:** `ls cucuyo/templates`.
- **Evidencia:** cucuyo/templates/ (A2 §2).
- **Tipo de evidencia:** EST.
- **Estado:** confirmado (archivos); efecto: hipótesis.
- **Recomendación y límites:** añadirlas aunque sean mínimas.
- **Fuentes:** A2-15.

#### TT-45 · Cucuyo · Cucuyo · P2
- **Criterio:** estado degenerado al alcance del comerciante.
- **Condición:** main-product tiene preset ("Product page"), sin `enabled_on` y sin guarda de `product`.
- **Impacto:** añadible a la home o a una página, con un formulario de compra sin variante.
- **Reproducción:** editor, inicio, añadir "Product page".
- **Evidencia:** cucuyo/sections/main-product.liquid:22, :66, :569-580.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado en código; render no comprobado.
- **Recomendación y límites:** quitar el preset o limitarlo a product.
- **Fuentes:** A6-13.

#### TT-46 · Cucuyo · configuración actual · P2
- **Criterio:** WCAG 1.4.11.
- **Condición:** `color_detail` del popup es #5d3f1f, igual al fondo; la línea del campo y el placeholder usan ese color; en foco se quita el outline y solo cambia la línea de 1 px.
- **Impacto:** campo de email sin borde visible (1.00:1) e indicador de foco débil.
- **Reproducción:** abrir el popup.
- **Evidencia:** cucuyo/config/settings_data.json:40-57; sections/newsletter-popup.liquid (aprox. 296-320).
- **Tipo de evidencia:** EST, SIN.
- **Estado:** confirmado.
- **Recomendación y límites:** color de detalle con 3:1 y foco de 2 px. El default del schema (#8c6d3a) no se midió.
- **Fuentes:** A4-03.

#### TT-47 · Cucuyo · configuración actual · P2
- **Criterio:** WCAG 2.5.8 (objetivo mínimo).
- **Condición:** swatches de 14 px (tarjeta) y 18 px (PDP) con separación de 5 px.
- **Impacto:** por debajo de 24 x 24 px sin espaciado que lo compense; acierto difícil en móvil.
- **Reproducción:** inspeccionar `.swatch`.
- **Evidencia:** cucuyo/config/settings_data.json:24-27; assets/base.css:2864-2929.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado en código; área real renderizada no medida.
- **Recomendación y límites:** área activa de 24 px.
- **Fuentes:** A4-04.

#### TT-48 · Cucuyo · configuración actual (preset con body_scale 100) · P2
- **Criterio:** usabilidad móvil. No se detectó bloqueo de zoom en el meta viewport (lectura estática; no es una afirmación de cumplimiento de 1.4.4).
- **Condición:** texto base de 12,6 px con body_scale 90; campos de búsqueda y newsletter de 13 px; botón de quitar del carrito de 11 px.
- **Impacto:** lectura difícil y zoom automático de iOS al enfocar campos.
- **Reproducción:** iPhone Safari, enfocar el buscador.
- **Evidencia:** cucuyo/assets/base.css:90, 1363-1382, 2061-2091, 2391-2406, 2518-2520; config/settings_data.json:18-26.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado en código; no probado en dispositivo.
- **Recomendación y límites:** 16 px en controles y 14 px mínimo en texto corrido.
- **Fuentes:** A4-05.

#### TT-49 · Cucuyo · actual y preset · P2
- **Criterio:** WCAG 1.4.11.
- **Condición:** campos de búsqueda, newsletter y cantidad con borde #D9CFC4 (1.54:1 con la configuración actual, 1.43:1 con el preset) y `outline: none`; el foco solo cambia el borde de 1 px.
- **Impacto:** límite del control e indicador de foco débiles.
- **Reproducción:** tabular a los campos.
- **Evidencia:** cucuyo/assets/base.css:1363-1382, 2391-2406, 2534.
- **Tipo de evidencia:** EST, SIN.
- **Estado:** confirmado.
- **Recomendación y límites:** borde de 3:1 y outline de 2 px con `:focus-visible`.
- **Fuentes:** A4-06.

#### TT-50 · Cucuyo · Cucuyo (condicional: home-image-band no está en ninguna plantilla) · P2
- **Criterio:** WCAG 2.2.2 (nivel A) si el comerciante usa la sección; peso de video.
- **Condición:** media-video.liquid usa `<video autoplay muted loop>` con `preload="auto"` sin pausa, reintenta `play()` al entrar en pantalla sin mirar reduced-motion, e iframes de YouTube y Vimeo con autoplay sin facade.
- **Impacto:** movimiento que no se puede detener y descarga completa del video.
- **Reproducción:** añadir home-image-band con video y activar reducción de movimiento.
- **Evidencia:** cucuyo/snippets/media-video.liquid:25-60; assets/theme.js:342-372; sections/home-image-band.liquid:28.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado en código; inactivo hoy.
- **Recomendación y límites:** botón de pausa, poster con reduced-motion y facade.
- **Fuentes:** A4-07, A5-14.

#### TT-51 · Sartorial, Atelier y Cucuyo · todos · P2
- **Criterio:** defecto verificable condicionado a catálogos con más de 250 variantes (Shopify admite hasta 2048).
- **Condición:** los tres temas embeben `product.variants` en JSON (Liquid trunca a 250) y resuelven la combinación contra ese mapa. Sartorial ya tiene una salvaguarda en la tarjeta, no en la PDP.
- **Impacto:** las variantes 251 en adelante se tratan como no disponibles o conservan precio e imagen anteriores.
- **Reproducción:** producto con más de 250 variantes; elegir una combinación posterior.
- **Evidencia:** sartorial-zip/sections/main-product.liquid:722-779; snippets/product-card.liquid:109-110; atelier-main/sections/main-product.liquid:400; cucuyo/snippets/pdp-block.liquid:221-239.
- **Tipo de evidencia:** EST.
- **Estado:** parcialmente confirmado (truncado documentado, no probado).
- **Recomendación y límites:** resolver por URL de variante o Section Rendering con option_values. La mayoría de catálogos quedan muy por debajo de 250.
- **Fuentes:** A2-19, A3-01.

#### TT-52 · Atelier y Cucuyo · todos · P2
- **Criterio:** riesgo de licencia de terceros.
- **Condición:** GSAP 3.13.0 bajo la Standard License, que permite uso comercial pero prohíbe "tools that allow users to build visual animations without code". Atelier expone ajustes de animación en el editor. Sartorial no usa GSAP.
- **Impacto:** probablemente no es un constructor visual de animaciones, pero la licencia no menciona temas vendidos en marketplaces.
- **Reproducción:** leer LICENSE.md:91-98 y https://gsap.com/standard-license.
- **Evidencia:** atelier-main/LICENSE.md:91-98; config/settings_schema.json:388-459; assets/gsap*.js en Atelier y Cucuyo.
- **Tipo de evidencia:** EST, EST-web.
- **Estado:** riesgo no resuelto.
- **Recomendación y límites:** pedir confirmación escrita a GSAP antes de vender Atelier.
- **Fuentes:** A7-25.

#### TT-99 · Atelier · Contour, Annex, Maison · P2 (nuevo tras R1)
- **Criterio:** archivos no previstos por la arquitectura de temas dentro del paquete, con efecto en el empaquetado y la validación sin verificar (mismo criterio que TT-33).
- **Condición:** config/ contiene, además de settings_schema.json y settings_data.json, config/metafield_definitions.json (338 B; declara una definición: namespace `custom`, key `edition_number`, tipo `single_line_text_field`, owner PRODUCT) y config/metaobject_definitions.json (35 B, sin definiciones). En la raíz hay una carpeta demo/ con 4 CSV de productos (products.csv, atelier-products-v3.csv, annex-products-v1.csv, maison-products-v1.csv; 92 KB). La arquitectura oficial de temas solo admite sus subdirectorios estándar, y config/ documenta settings_schema.json, settings_data.json y markets.json (R1 §7). .shopifyignore no excluye demo/ ni esos dos archivos.
- **Impacto:** no se sabe si `shopify theme package`, la subida del ZIP o el validador de la Theme Store los rechazan, los ignoran o los aceptan. Un comerciante o un revisor podría leer metafield_definitions.json como una promesa de que el tema crea esa definición, cosa que el archivo por sí solo no hace.
- **Reproducción:** `ls atelier-main/config atelier-main/demo`; empaquetar con `shopify theme package` y listar el ZIP (no ejecutado).
- **Evidencia:** atelier-main/config/metafield_definitions.json; config/metaobject_definitions.json; demo/*.csv; .shopifyignore; A6 §5 (lo dejó al especialista de empaquetado); A8-03 (menciona que Atelier tiene el archivo y Sartorial no). Comprobación de la síntesis: nombres, tamaños y claves, sin abrir el contenido de los CSV.
- **Tipo de evidencia:** EST.
- **Estado:** confirmado (presencia de los archivos); efecto en empaquetado y revisión no verificado.
- **Recomendación y límites:** comprobar qué incluye el ZIP empaquetado y, si entran, sacarlos del paquete (los CSV de demo sirven para montar las tiendas demo, no al comerciante). Que el archivo declare `custom.edition_number` **no implica que esa definición esté creada ni aprobada** en ninguna tienda; este hallazgo no aprueba ninguna definición de metafield, ni de Atelier ni las siete propuestas para Sartorial.
- **Fuentes:** R1 §1 (F3) y §7, A6 §5, A8-03.

### 6.6 P3

Formato abreviado; mismos campos.

#### TT-53 · Sartorial · todos · P3
- **Criterio:** mantenibilidad. **Condición:** el 36 % de las ventanas de 6 líneas de featured-product.liquid aparece en main-product.liquid; el resolvedor de esquema se repite en 32 secciones; el CSS de esquemas es idéntico en theme.liquid:78-95 y password.liquid:62-79. **Impacto:** cambios dobles en la ficha. **Reproducción:** script de ventanas y diff. **Evidencia:** sections/featured-product.liquid, main-product.liquid, hero-editorial.liquid:2. **Tipo:** EST, SIN. **Estado:** confirmado. **Recomendación y límites:** extraer snippets. **Fuentes:** A2-02.

#### TT-54 · Sartorial · todos · P3
- **Criterio:** código muerto y editor. **Condición:** main-placeholder.liquid sin preset ni referencia; bloques cross_sell_product del drawer no emiten `block.shopify_attributes`. **Impacto:** archivo sobrante; clic sin resaltado en el editor. **Reproducción:** grep. **Evidencia:** sections/main-placeholder.liquid; cart-drawer.liquid:470; cart-drawer-recommendations.liquid:89. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** eliminar o documentar. **Fuentes:** A2-03.

#### TT-55 · Sartorial · todos · P3
- **Criterio:** optimización. **Condición:** sin `preconnect` a fonts.shopifycdn.com ni preload de fuentes. **Impacto:** no medido. **Reproducción:** grep de preconnect. **Evidencia:** layout/theme.liquid:57-64. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** una línea de preconnect, escrita desde cero. **Fuentes:** A5-08.

#### TT-56 · Sartorial · todos · P3
- **Criterio:** localización del editor. **Condición:** existe locales/es.json (438 claves) pero no es.schema.json; el editor solo está en inglés (500 claves). **Impacto:** comerciantes hispanohablantes ven el editor en inglés. **Reproducción:** `ls locales`. **Evidencia:** sartorial-zip/locales/. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** traducir el schema. **Fuentes:** A1-13, A6-05.

#### TT-57 · Sartorial · todos · P3
- **Criterio:** sección vacía sin aviso en el editor. **Condición:** marquee y announcement-bar no imprimen nada sin texto, tampoco en `design_mode`. **Impacto:** la sección desaparece del preview. **Reproducción:** vaciar los bloques. **Evidencia:** sections/marquee.liquid:12. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** placeholder en design_mode. **Fuentes:** A6-06.

#### TT-58 · Sartorial · Imprint y Archive (grid) · P3
- **Criterio:** pulido. **Condición:** en layout grid o stack, `goToSlide` sale antes de tiempo y la imagen de la variante no se destaca. **Impacto:** precio y botón correctos; imagen no resaltada. **Reproducción:** cambiar de variante en Imprint. **Evidencia:** assets/theme.js:365-567 (retorno cerca de :531). **Tipo:** EST. **Estado:** parcialmente confirmado. **Recomendación y límites:** scrollIntoView en grid. **Fuentes:** A3-09.

#### TT-59 · Sartorial · todos · P3
- **Criterio:** riesgo con catálogos grandes. **Condición:** sidebar de filtros sticky sin max-height ni overflow; en móvil los filtros se apilan sin cajón. **Impacto:** final de la lista posiblemente inalcanzable. **Reproducción:** muchas facetas. **Evidencia:** assets/base.css (aprox. 4489, 8374); sections/main-collection.liquid:67-306. **Tipo:** EST. **Estado:** hipótesis. **Recomendación y límites:** max-height con overflow; cajón en móvil. **Fuentes:** A3-10.

#### TT-60 · Sartorial · todos · P3
- **Criterio:** rendimiento condicionado. **Condición:** la tarjeta recorre variantes en bucles anidados y emite un JSON con todas. **Impacto:** TTFB y peso de HTML con 100 o más variantes por tarjeta. **Reproducción:** medir TTFB. **Evidencia:** snippets/product-card.liquid:199-205, :463-515. **Tipo:** EST. **Estado:** hipótesis. **Recomendación y límites:** limitar el JSON a quick add activo. **Fuentes:** A3-11.

#### TT-61 · Sartorial · todos · P3
- **Criterio:** presentación en caso borde. **Condición:** con price_varies, la tarjeta muestra "Desde" junto al compare_at_price_max. **Impacto:** puede leerse como descuento del precio mínimo. **Reproducción:** producto con precios variables y una variante rebajada. **Evidencia:** snippets/price.liquid:32-50, :60-68. **Tipo:** EST. **Estado:** confirmado (decisión documentada en comentario). **Recomendación y límites:** solo insignia de oferta en ese caso. **Fuentes:** A3-12.

#### TT-62 · Sartorial · todos · P3
- **Criterio:** funciones de conversión no exigidas. **Condición:** /cart sin barra de envío, estimador ni campo de descuento; el hito de regalo (`atelier_gift_threshold`, 250) no añade ningún producto; sin aviso de reposición. **Impacto:** promesa de regalo que depende de un descuento configurado aparte. **Reproducción:** leer la sección. **Evidencia:** sections/main-cart-items.liquid:1-256; cart-drawer.liquid:9-33, :389-393. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** documentar el requisito del descuento automático. **Fuentes:** A3-13.

#### TT-63 · Sartorial · los tres presets · P3
- **Criterio:** contenido de demo que puede publicarse por error. **Condición:** presets con "Complimentary white-glove courier", "Complimentary atelier returns within 30 days" y enlaces a /collections/tailoring y /collections/permanent-archive. **Impacto:** promesas y enlaces rotos si no se revisan. **Reproducción:** instalar un preset. **Evidencia:** listings/*/templates/product.json y collection.json; templates/product.json. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** usar los textos *_fallback del locale (en.default.json:163, :166). La guía "Updating your theme" (shopify.dev/docs/storefronts/themes/store/success/updates) desaconseja incluir JSON de demo que el comerciante no deba usar. **Fuentes:** A3-14, R1 §6.

#### TT-64 · Sartorial · Sartorial (scheme-4); Archive al límite · P3
- **Criterio:** WCAG 1.4.3 condicional. **Condición:** `.price__compare` con opacidad 0.68: 4.05:1 en scheme-4 de Sartorial; 4.51 y 4.52 en Archive. **Impacto:** tachado bajo 4.5:1. **Reproducción:** sección con scheme-4. **Evidencia:** assets/base.css:1086-1087; tabla 5.2 de A4. **Tipo:** EST, SIN. **Estado:** confirmado. **Recomendación y límites:** opacidad 0.8. **Fuentes:** A4-18.

#### TT-65 · Sartorial · todos · P3
- **Criterio:** campos recomendados (§21). **Condición:** formulario de Formspree sin subida de archivo; auto-respuesta no visible. **Impacto:** cumple el mínimo. **Reproducción:** leer support.html:189. **Evidencia:** support.html:189. **Tipo:** EST-web. **Estado:** confirmado (no se envió ticket). **Recomendación y límites:** añadir subida de capturas. **Fuentes:** A7-03.

#### TT-66 · Sartorial · todos · P3
- **Criterio:** originalidad del código (informativo). **Condición:** custom elements con nombres como los de Dawn (`variant-selects`, `cart-drawer`, `predictive-search`...) sobre base propia `ThemeCore.ThemeElement`; `trapFocus` con implementación propia. **Impacto:** bajo. **Reproducción:** assets/theme.js:5309-5414. **Evidencia:** assets/theme.js:18-56, :5309-5414. **Tipo:** EST. **Estado:** informativo; sin huellas de global.js, pubsub ni Dawn/Horizon (A7-12). **Recomendación y límites:** prefijar elementos es opcional. **Fuentes:** A8-08, A7-12.

#### TT-67 · Atelier · todos · P3
- **Criterio:** eficiencia. **Condición:** bucle de variantes dentro de cada valor de opción. **Impacto:** coste de render con muchas variantes. **Reproducción:** leer. **Evidencia:** sections/main-product.liquid:163-168; featured-product.liquid:110; quick-buy.liquid:80. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** usar `value.available`. **Fuentes:** A2-07.

#### TT-68 · Atelier · todos · P3
- **Criterio:** rutas y duplicación. **Condición:** search-palette.js:163 navega a '/search?q=' sin `Shopify.routes.root`; search.js:20 con fallback fijo; dos búsquedas predictivas cargadas. **Impacto:** en /es/, /fr/ Enter lleva al idioma por defecto. **Reproducción:** buscar desde un locale secundario. **Evidencia:** assets/search-palette.js:67-69, :163; assets/search.js:20. **Tipo:** EST. **Estado:** confirmado (no probado). **Recomendación y límites:** routes.search_url y una sola implementación. **Fuentes:** A2-08.

#### TT-69 · Atelier · todos · P3
- **Criterio:** mantenibilidad. **Condición:** bloque `<style>` de padding copiado en 48 secciones; helpers repetidos; 464 `var`; sin `shopify:section:unload` (observers y ScrollTriggers no se destruyen en el editor). **Impacto:** deuda; posibles fugas solo en el editor. **Reproducción:** grep. **Evidencia:** assets/gsap-animations.js:390-401; secciones. **Tipo:** EST. **Estado:** confirmado; fugas: hipótesis. **Recomendación y límites:** snippet de espaciado y helper común. **Fuentes:** A2-09, A5-13 (parte Atelier).

#### TT-70 · Atelier · todos · P3
- **Criterio:** código muerto. **Condición:** blocks/group.liquid y blocks/text.liquid (de Skeleton) sin `@theme` en ninguna sección. **Impacto:** nunca aparecen en el editor. **Reproducción:** `grep -rn "@theme" sections templates`. **Evidencia:** atelier-main/blocks/group.liquid:22, :50. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** borrarlos o adoptar theme blocks. **Fuentes:** A1-11, A6-07.

#### TT-71 · Atelier · todos · P3
- **Criterio:** ruido en el selector. **Condición:** ninguna sección usa enabled_on/disabled_on; main-404 tiene preset (H1 extra en cualquier página); sin categorías de preset. **Impacto:** lista plana de 43 secciones también en header y footer. **Reproducción:** editor. **Evidencia:** sections/main-404.liquid:98-100. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** disabled_on en grupos, quitar preset de 404. **Fuentes:** A6-08.

#### TT-72 · Atelier · todos · P3
- **Criterio:** validación de entrada. **Condición:** enlaces sociales `type: text`; bloque dimensions pide namespace y claves de metafield a mano. **Impacto:** enlaces relativos rotos sin https; configuración técnica. **Reproducción:** escribir "instagram.com/marca". **Evidencia:** config/settings_schema.json:514; snippets/social-icons.liquid:4; sections/main-product.liquid:339-352. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** tipo url y defaults ocultos. **Fuentes:** A6-09.

#### TT-73 · Atelier · todos (condicional, inactivo) · P3
- **Criterio:** rendimiento condicional. **Condición:** con image_mobile, ambas imágenes del hero van eager y fetchpriority high; una se oculta por CSS. **Impacto:** doble descarga compitiendo con el LCP. **Reproducción:** subir image_mobile. **Evidencia:** sections/hero.liquid:61-77, :236-239. **Tipo:** EST. **Estado:** confirmado; ningún preset lo activa. **Recomendación y límites:** `<picture>`. **Fuentes:** A5-10.

#### TT-74 · Atelier · todos · P3
- **Criterio:** discordancia posible solo ante fallo de red. **Condición:** el precio se refresca con una petición de sección; si falla, queda el precio anterior con el id nuevo; replaceState borra otros parámetros (UTM, selling_plan). **Impacto:** precio mostrado distinto del de la variante elegida (raro con el CDN). **Reproducción:** simular 5xx. **Evidencia:** assets/product.js:62-105, :134-160. **Tipo:** EST. **Estado:** hipótesis (replaceState confirmado). **Recomendación y límites:** estado "actualizando" y conservar parámetros. **Fuentes:** A3-05 (recalibrado de P2 a P3).

#### TT-75 · Atelier · todos · P3
- **Criterio:** información y accesibilidad menores. **Condición:** el drawer no lista descuentos de carrito; sin `role="status"` estable (el nodo con aria-live se reemplaza). **Impacto:** anuncio poco fiable. **Reproducción:** descuento automático de pedido. **Evidencia:** snippets/cart-drawer-contents.liquid; sections/main-cart.liquid. **Tipo:** EST. **Estado:** confirmado (descuentos); anuncio parcialmente confirmado. **Recomendación y límites:** listar descuentos y región estable. **Fuentes:** A3-17.

#### TT-76 · Atelier · todos · P3
- **Criterio:** precisión de estado. **Condición:** la disponibilidad de valores se marca en servidor por "alguna variante disponible" y el JS no recalcula por combinación. **Impacto:** valores imposibles en la combinación actual parecen elegibles. **Reproducción:** producto con varias opciones. **Evidencia:** sections/main-product.liquid:121-193. **Tipo:** EST. **Estado:** hipótesis (efecto). **Recomendación y límites:** recalcular por combinación. **Fuentes:** A3-16 (parte de disponibilidad).

#### TT-77 · Atelier · todos · P3
- **Criterio:** eficiencia y documentación. **Condición:** la tira de bundle se recalcula en cada render AJAX. La PDP y la tarjeta leen metafields: custom.width, depth, height, weight, assembly_time y box_count (PDP), custom.edition_number y reviews.rating (tarjeta). De ellos, solo `custom.edition_number` aparece declarado en config/metafield_definitions.json (corrección tras R1 §1, F3; ver TT-99); el resto no tiene declaración en el repositorio. Esa declaración en un archivo del repo no equivale a una definición creada en ninguna tienda ni a una aprobación. **Impacto:** el comerciante no descubre los metafields no declarados. **Reproducción:** leer. **Evidencia:** snippets/cart-drawer-contents.liquid; sections/main-product.liquid:337-387; snippets/product-card.liquid; config/metafield_definitions.json. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** documentarlos; cualquier definición queda pendiente de aprobación. **Fuentes:** A3-23, R1 §1 (F3).

#### TT-78 · Atelier · todos (móvil) · P3
- **Criterio:** WCAG 4.1.2. **Condición:** `.sidebar__panel` es un `<div>` sin role="dialog" ni aria-modal, aunque trapFocus atrapa el foco. **Impacto:** no se anuncia como diálogo (no probado con lector). **Reproducción:** abrir el menú en móvil. **Evidencia:** sections/header.liquid:227; assets/theme.js:64-97, :471-510. **Tipo:** EST. **Estado:** confirmado en código; efecto no evaluado. **Recomendación y límites:** role, aria-modal e inert. **Fuentes:** A4-15.

#### TT-79 · Atelier · todos · P3
- **Criterio:** WCAG 2.1.4. **Condición:** "/" abre la búsqueda y no se puede desactivar aparte. **Impacto:** activación involuntaria por voz (teórico). **Reproducción:** pulsar "/". **Evidencia:** assets/search-palette.js:137-140; sections/search-palette.liquid:128. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** ajuste propio o modificador. **Fuentes:** A4-16.

#### TT-80 · Atelier · todos · P3
- **Criterio:** buena práctica 1.3.1. **Condición:** skip link envuelto en `<nav aria-label>`. **Impacto:** landmark extra. **Reproducción:** leer. **Evidencia:** layout/theme.liquid:110-112. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** dejar solo el enlace. **Fuentes:** A4-17.

#### TT-81 · Atelier · Annex (cuerpo) y todos (campos) · P3
- **Criterio:** usabilidad móvil. **Condición:** `--text-base` con piso de 15,2 px en campos; notify-me a 14 px; Annex con body_scale 80 (cuerpo de unos 12,2 px). **Impacto:** zoom automático de iOS; texto pequeño en Annex. **Reproducción:** iPhone. **Evidencia:** assets/base.css:66, :164, :737-754; atelier-annex/config/settings_data.json:15, :238. **Tipo:** EST. **Estado:** confirmado; no probado en dispositivo. **Recomendación y límites:** max(16px, ...) en controles. **Fuentes:** A4-12.

#### TT-82 · Atelier · Maison (accent-1, condicional) · P3
- **Criterio:** WCAG 1.4.11 condicional. **Condición:** borde fuerte sobre accent-1 (#b89a6e) = 2.63:1. **Impacto:** controles bajo 3:1 sobre ese esquema. **Reproducción:** sección con accent-1. **Evidencia:** atelier-maison/config/settings_data.json:116-118; snippets/css-variables.liquid:198. **Tipo:** SIN. **Estado:** confirmado por cálculo; uso del esquema no verificado. **Recomendación y límites:** ajustar la mezcla. **Fuentes:** A4-19.

#### TT-83 · Atelier · todos · P3
- **Criterio:** claridad del soporte. **Condición:** theme_support_url igual a la documentación; el formulario existe con los campos recomendados. **Impacto:** menor. **Reproducción:** leer settings_schema.json:7-8. **Evidencia:** config/settings_schema.json:7-8; docs/index.html:203, :248. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** página o ancla de soporte propia. **Fuentes:** A7-27.

#### TT-84 · Atelier · todos · P3
- **Criterio:** señal de derivación (informativo). **Condición:** comentarios que citan "Dawn's pattern"; trapFocus/removeTrapFocus con la estructura de Dawn reescrita; custom elements y clases con nombres de Dawn. LICENSE.md declara Skeleton como base (aprobada). **Impacto:** un revisor podría leerlo como derivación. **Reproducción:** `grep -rn "Dawn" snippets assets`. **Evidencia:** snippets/product-media.liquid:168, :181, :369; assets/product.js:277; assets/theme.js:64-94; LICENSE.md:77-79. **Tipo:** EST. **Estado:** informativo; no se halló código de Dawn ni de Horizon. **Recomendación y límites:** reescribir los comentarios. **Fuentes:** A7-29, A8-07.

#### TT-85 · Atelier · Contour, Annex, Maison · P3
- **Criterio:** encaje de mercado (informativo). **Condición:** verticales declarados: muebles y hogar, galerías y láminas, cerámica; ninguno de moda. **Impacto:** encaja poco con moda de lujo; en sus verticales justificaría un tier alto. **Reproducción:** listings/*/listing.json:3. **Evidencia:** listings/{contour,annex,maison}/listing.json:3. **Tipo:** EST. **Estado:** informativo. **Recomendación y límites:** posicionarlo en sus verticales o crear un preset de moda. **Fuentes:** A8-06.

#### TT-86 · Cucuyo · Cucuyo · P3 para su uso actual (P0 si se enviara a la Theme Store)
- **Criterio:** tienda a medida, no candidata; los requisitos de la Theme Store no aplican a su uso actual.
- **Condición:** theme_name "Cucuyo" y autor "Cucuyo Home"; marca, fotos (108 en assets) y fuentes con licencia del cliente; faltan casi todas las funciones obligatorias (unit price, selling plans, payment_terms, Follow on Shop, selectores de país e idioma, pickup, predictiva, filtros, botones de pago, API de recomendaciones, gift card, media enriquecida, `<shopify-account>`); un solo locale; documentación apuntando al repo de desarrollo.
- **Impacto:** no publicable en la Theme Store sin generalizarlo por completo.
- **Reproducción:** grep de esas funciones (0 coincidencias salvo texto de política).
- **Evidencia:** cucuyo/config/settings_schema.json:4-8; sections/header.liquid:155; footer.liquid:163, :183; snippets/css-variables.liquid:3-5; sección 3.2 de este documento.
- **Tipo de evidencia:** EST, EST-web.
- **Estado:** confirmado.
- **Recomendación y límites:** no usarlo como base de un producto de 380 USD sin generalizarlo. Visibilidad del repo en conflicto (ver sección 10).
- **Fuentes:** A7-40, A7-41, A7-43, A1-03, A8-09.

#### TT-87 · Cucuyo · Cucuyo · P3
- **Criterio:** calidad de recomendación. **Condición:** "Pair it with" y "You may also like" usan product.collections.first (o collections.all), sin API de recomendaciones. **Impacto:** relevancia atada al orden de colecciones. **Reproducción:** `grep -rn "product_recommendations\|intent"`: 0. **Evidencia:** sections/related-products.liquid:11-13; you-may-like.liquid:17-19, :26. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** API de Shopify como respaldo. **Fuentes:** A1-04, A3-22.

#### TT-88 · Cucuyo · Cucuyo · P3
- **Criterio:** limitaciones menores. **Condición:** galería solo con imágenes; un option_value.variant nulo daría href vacío; opciones agotadas seleccionables. **Impacto:** video y 3D ignorados. **Reproducción:** producto con video. **Evidencia:** sections/main-product.liquid:22; snippets/variant-options.liquid; assets/theme.js:400-640. **Tipo:** EST. **Estado:** confirmado (href vacío: hipótesis). **Recomendación y límites:** proteger el href. **Fuentes:** A3-20.

#### TT-89 · Cucuyo · valores por defecto y current · P3
- **Criterio:** contenido de cliente en defaults (en su propia tienda probablemente intencional). **Condición:** newsletter-popup con el código CUCUYO10 al 10 %; current difiere del preset en fondo y escalas. **Impacto:** el preset no reproduce la tienda. **Reproducción:** `grep -n CUCUYO10 config/settings_data.json`. **Evidencia:** config/settings_data.json:12, :44, :60. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** documentar la diferencia. **Fuentes:** A1-08.

#### TT-90 · Cucuyo · plantilla index · P3
- **Criterio:** buena práctica 1.3.1. **Condición:** ninguna sección de la home emite `<h1>`. **Impacto:** sin encabezado principal en inicio. **Reproducción:** buscar `<h1` en sections. **Evidencia:** sections/home-grid.liquid:59; home-note.liquid:15. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** h1 visible u oculto en el hero. **Fuentes:** A4-08.

#### TT-91 · Cucuyo · configuración actual · P3
- **Criterio:** WCAG 3.3.1 y 4.1.3. **Condición:** el error del popup no tiene role="alert" ni aria-live (el éxito sí tiene role="status"). **Impacto:** el error no se anuncia. **Reproducción:** forzar un error. **Evidencia:** sections/newsletter-popup.liquid:53, :61. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** role="alert". **Fuentes:** A4-21.

#### TT-92 · Cucuyo · Cucuyo · P3
- **Criterio:** optimización. **Condición:** home-hero fuerza eager en las tres instancias (dos bajo el pliegue); 4 woff2 propios sin preload. **Impacto:** descargas prioritarias innecesarias; posible doble swap. **Reproducción:** leer. **Evidencia:** sections/home-hero.liquid:38; snippets/css-variables.liquid:15-50. **Tipo:** EST. **Estado:** confirmado; efecto no medido. **Recomendación y límites:** eager solo con section.index 1; preload de las fuentes visibles. **Fuentes:** A5-05, A5-06.

#### TT-93 · Cucuyo · Cucuyo · P3
- **Criterio:** texto largo. **Condición:** sin overflow-wrap, word-break, hyphens ni line-clamp en todo el CSS. **Impacto (probable):** desborde de títulos largos en móvil. **Reproducción:** grep (0). **Evidencia:** cucuyo/assets, sections, snippets. **Tipo:** EST. **Estado:** hipótesis, confianza baja. **Recomendación y límites:** reglas de corte. **Fuentes:** A6-16.

#### TT-94 · Cucuyo · Cucuyo · P3
- **Criterio:** procedencia (informativo). **Condición:** comentarios que citan "Atelier architecture" y el header de Horizon como referencia de comportamiento; gsap-init.js con similitud 0.68 con Contour (resto 0.03 a 0.10). **Impacto:** ninguno para una tienda a medida. **Reproducción:** leer. **Evidencia:** assets/gsap-init.js:2; gsap-animations.js:2; snippets/meta-tags.liquid:2; assets/theme.js:107. **Tipo:** EST, SIN. **Estado:** informativo; sin evidencia de código de Horizon. **Recomendación y límites:** ninguna obligatoria. **Fuentes:** A7-45.

#### TT-95 · Atelier y Cucuyo · todos · P3
- **Criterio:** riesgo futuro de gate, cero impacto en storefront. **Condición:** theme-check-node 3.31.0 marca LiquidHTMLSyntaxError cuando `{% doc %}` contiene HTML o Liquid de ejemplo (Atelier: free-shipping-claim.liquid:31; Cucuyo: 10 snippets). El CLI 5.0.0 no los marca. **Impacto:** el "0 offenses" de Atelier fallaría si el CLI adopta esa versión (hipótesis). **Reproducción:** `check(root)` con 3.31.0. **Evidencia:** atelier-main/snippets/free-shipping-claim.liquid:2, :31; cucuyo/snippets/draft-image.liquid:63 y otros 9 (A2-11). **Tipo:** SIN. **Estado:** confirmado con 3.31.0. **Recomendación y límites:** escapar los ejemplos. **Fuentes:** A2-11 (recalibrado de P2 a P3).

#### TT-96 · Atelier y Cucuyo (Sartorial un caso) · todos · P3
- **Criterio:** defensa en profundidad; solo datos del comerciante o de la tienda. **Condición:** salidas sin `| escape` en meta y title (Atelier meta-tags.liquid:22, :89, :92; Cucuyo meta-tags.liquid:23, :47, :48, :50), ajustes text/textarea (Cucuyo 7, Atelier 2, Sartorial 1 en main-documentation.liquid:154), `src="{{ video_url }}"` en Atelier hero.liquid:59, y la URL de imagen sin escapar en innerHTML de search-palette.js:109-111. **Impacto:** HTML mal formado con comillas; inyección solo por alguien con acceso al editor. **Reproducción:** nombre de tienda con comillas. **Evidencia:** las indicadas. **Tipo:** EST, SIN. **Estado:** confirmado. **Recomendación y límites:** `| escape` y escapeHtml. **Fuentes:** A5-11, A5-12.

#### TT-97 · Sartorial, Atelier y Cucuyo · todos · P3
- **Criterio:** ajustes que no aplican se muestran igual. **Condición:** `visible_if` sin uso (Cucuyo 1 vez); hero-editorial (27 ajustes), hero de Atelier (25) y home-image-band (19) enseñan todos los modos a la vez. **Impacto:** paneles confusos. **Reproducción:** abrir esas secciones. **Evidencia:** las secciones citadas. **Tipo:** EST. **Estado:** confirmado. **Recomendación y límites:** condicionar con visible_if. **Fuentes:** A6-15.

#### TT-98 · Atelier y Cucuyo · todos · P3
- **Criterio:** WCAG 1.4.10, no evaluable. **Condición:** `overflow-x: clip` en el contenedor principal podría ocultar desbordes. **Impacto:** desconocido. **Reproducción:** 320 px y 400 % de zoom. **Evidencia:** atelier-main/assets/base.css:339; cucuyo/assets/base.css:94. **Tipo:** EST. **Estado:** no evaluable. **Recomendación y límites:** probar con render. **Fuentes:** A4-20.

---

## 7. Ventajas y debilidades de cada producto

### Sartorial

Ventajas (evidencia):

- Flujo de compra más completo y defensivo de los tres: reglas de cantidad con min, step y max, guarda de plan obligatorio y selector de planes, gift card con destinatario, pickup, Shop Pay Installments, checkout acelerado, carrito que funciona sin JS, descuentos de línea y de carrito, precio unitario, alta al drawer con verificación del resultado y clasificación éxito, fallo o incierto (A3 §3).
- Las 22 funciones obligatorias presentes en código (sección 3.2), con la salvedad de TT-19.
- Arquitectura JS sólida: base `ThemeElement` con AbortController, `customElements.get` antes de definir, Section Rendering en carrito, filtros y recomendaciones, `section:load`/`unload` y `block:select` (A2-04, A5-13).
- Schema 100 % `t:`, Theme Check `recommended` en 0, enabled_on/disabled_on en 14 secciones, soporte de combined listings (A2-04).
- PDP diferencial: 4 layouts de galería, zoom propio con pinch y teclado, provenance y technical_specs, guía de tallas (A8 §2 E3). Es el que mejor encaja con moda de lujo (A8 §7).
- Base de accesibilidad madura: drawer con role="dialog", aria-modal e inert, regiones de estado, variantes con fieldset y radiogroup, marquee con botón de pausa, doble llave de reduced-motion (A4 §3).
- Sin dependencias de terceros ni GSAP; sin secretos (A5 §6, A7-07).

Debilidades:

- Listo para la revisión solo en código: faltan demos (TT-01), Lighthouse sin medir y docs con errores (TT-04, TT-05, TT-18).
- Anillo de foco bajo 3:1 en Imprint y Archive (TT-02).
- Afirmaciones de material inventadas en la PDP (TT-03).
- Header y tarjeta únicos y presets con diferencia mayormente cosmética (TT-06, TT-17).
- Catálogo de secciones estrecho y sin padding por sección (TT-16); secciones de página añadibles en cualquier sitio (TT-15); plantillas de soporte del vendedor en el ZIP (TT-14).
- CSS monolítico de 259 KB y JS de 249 KB en todas las páginas (TT-12).

### Atelier de Sebas (Contour 4.1.0)

Ventajas:

- El panel de configuración más rico: 54 inputs globales, 672 ajustes de sección, 51 secciones con padding, 5 idiomas de editor con paridad de claves (A6 §1, A2-10).
- Estructura y presets realmente distintos: cada preset tiene home con secciones propias de su vertical (wall-comparison, frame-preview, spec-compare, glaze-library, kiln-log, shop-the-set) (A8 §3 E4, A6 §1).
- Ingeniería de carga cuidada: CSS de 29 KB gz por sección, prioridad LCP por índice, facade de video, preconnect, design_mode bien tratado (A5 §6, A6 §3).
- Base Skeleton declarada (A7-29); Theme Check en 0 con la config del repo y con `recommended` (A2-10).
- Accesibilidad estructural sólida (skip link, trapFocus, variantes con fieldset, anim-settings que solo puede apagar movimiento) (A4 §3).

Debilidades:

- Fallo silencioso al cambiar cantidad en el carrito (TT-07) y otros errores de compra sin feedback (TT-21, TT-22).
- Riesgos de revisión no relacionados con la personalización: nombres de preset existentes (TT-08), contrato visual extraído de una tienda de terceros (TT-09), comentarios que citan Dawn (TT-84).
- PDP sin zoom ni layouts alternativos, tarjeta única (TT-24); sin selector de planes ni reglas de cantidad (TT-21, TT-23).
- 98 a 112 KB gz de JS por página inyectados tras el FCP, fuera del alcance del check desactivado (TT-20); licencia GSAP por confirmar (TT-52).
- Promesas comerciales activas por defecto (TT-25); credencial en DEVELOPMENT.md (TT-31).

### Cucuyo de Sebas (2.0.0)

Ventajas:

- Ejecución editorial a medida con diseño propio del cliente (home en mosaico, primer producto 2x2 automático) (A8 §4).
- Variantes como enlaces reales que funcionan sin JS, URL sincronizada, carrito nativo sin JS (A3 §3).
- Base Liquid moderna, buen uso de image_tag con widths y sizes, JSON coherente con schemas (A2 §5); 170 `info` claros para la clienta (A6 §3); seguridad correcta (A5 §6).

Debilidades:

- No es un producto de Theme Store (TT-86): sin app blocks (TT-10), sin esquemas de color ni i18n (TT-42), plantillas ausentes (TT-44).
- Defectos funcionales: ajustes anulados por el orden del CSS (TT-38), editor que deja de funcionar tras editar (TT-41), Theme Check que falla con su propia config (TT-37).
- Accesibilidad más débil de los tres: botón del popup sin nombre (TT-11), bordes y foco bajo 3:1 (TT-46, TT-49), texto y swatches pequeños (TT-47, TT-48).
- 27 MB de borradores en assets y GSAP desproporcionado (TT-39, TT-40); documentación que contradice el código (TT-43).

---

## 8. Comparaciones

### 8.1 Comparación principal: Sartorial frente a Atelier

| Categoría (provisional) | Sartorial | Atelier | Lectura |
|---|---|---|---|
| Diseño y percepción de valor | 13 a 14 | 14 a 15 | Atelier más distintivo en header y estructura; Sartorial más fuerte en PDP y encaje con moda. Confianza baja en ambos (sin visual). |
| Compra, merchandising y conversión | 15 a 16 | 11 | Ventaja clara de Sartorial (A3). Imprint y Archive bajan a 15 por TT-03 tras igualar la regla de doble conteo (§5.3). |
| Móvil y accesibilidad | 14 a 17 | 14 a 15 | Parejos. Sartorial depende del preset (Imprint baja por TT-02); Atelier pierde por el carrito silencioso y contrastes puntuales. |
| Configuración y comerciante | 11 a 12 | 16 | Ventaja clara de Atelier (A6). |
| Rendimiento y calidad funcional | 15 | 15 | Empate por razones distintas: Sartorial tiene JS más robusto y CSS pesado; Atelier tiene más ingeniería de carga y más JS. |

Lectura de conjunto: Sartorial es mejor tienda (compra, PDP, robustez de JS) y Atelier es mejor herramienta de comerciante (panel, secciones, idiomas, presets estructurales). Lo que a Sartorial le falta frente a Atelier es flexibilidad de editor y diferenciación de header y tarjeta (TT-06, TT-16, TT-17); lo que a Atelier le falta frente a Sartorial es solidez del flujo de compra y la PDP (TT-07, TT-21, TT-24). Las recomendaciones para Sartorial que mencionan cómo lo resuelve Atelier describen un patrón; cualquier cambio se escribe desde cero, sin copiar código.

### 8.2 Comparación adicional: Sartorial frente a Cucuyo

| Categoría (provisional) | Sartorial | Cucuyo |
|---|---|---|
| Diseño y percepción de valor | 13 a 14 | 10 |
| Compra, merchandising y conversión | 15 a 16 | 7 |
| Móvil y accesibilidad | 14 a 17 | 10 a 12 |
| Configuración y comerciante | 11 a 12 | 8 |
| Rendimiento y calidad funcional | 15 | 9 |

Sartorial supera a Cucuyo en las cinco categorías cuando se mide contra el listón de un tema comercial. La comparación es asimétrica: Cucuyo es una tienda a medida y muchas ausencias son decisiones del cliente (precio dentro del botón, sin filtros, fuentes fijas). Como tienda de cliente, su valor está en la ejecución editorial, que esta auditoría no pudo ver (sin demo).

### 8.3 Comparación de los tres donde hay evidencia comparable

| Métrica (EST o SIN) | Sartorial | Atelier | Cucuyo | Fuente |
|---|---|---|---|---|
| Inputs globales | 23 | 54 | 26 | V1 §4 |
| Secciones con schema / con preset | 33 / 20 | 60 (+2 blocks) / 43 | 35 / 26 | A2 §2, A6 §1 |
| Ajustes en secciones | 371 | 672 | 359 | A6 §1 |
| Esquemas de color | 5 | 6 | ninguno | A2 §2 |
| Idiomas storefront / editor | en, es / en | 5 / 5 | en / ninguno | A1 §3 |
| Cadenas de schema `t:` / fijas | 663 / 14 | 1366 / 125 | 0 / 833 | A2 §2 |
| Secciones con @app | 2 | 2 | 0 | A2 §2 |
| CSS global gz | 50,6 a 50,9 KB | 29,1 KB | 33,4 a 33,6 KB | A2 §3, A5 §3.1 |
| JS por página gz | 57,9 a 62,1 KB | 98 a 112 KB | 66,0 KB | A2-05, A5 §3.1 |
| Theme Check `recommended` | 0 | 0 | valid:false (1 error, 1 aviso) | A2 §1, A5 §4 |
| Theme Check config del repo | 0 (sin archivo) | 0 (AssetSizeJS desactivado) | 3 errores, 1 aviso | A2 §1 |
| Theme Check `all` | 6 errores (tamaño) | 2 errores (tamaño) | 7 errores, 1 aviso | A2 §1, A5 §4 |
| Custom elements | 28 | 7 | 0 | A2 §3 |
| Peso de assets | 520 KB | 524 KB (+14 MB de previews en listings) | 27 MB | A1 §2 |
| Funciones obligatorias presentes (de 22) | 22 (1 en hipótesis) | 21 completas; selling plans solo en carrito | minoría (ver 3.2) | Sección 3.2 |
| Secretos por patrón | 0 | 0 (más una contraseña en DEVELOPMENT.md:7) | 0 | A5 §6, TT-31 |

---

## 9. Preparación de Sartorial para el nivel de 380 USD

El precio de 380 USD es válido (entre 100 y 500, múltiplo de 10). Shopify no define "tiers": el posicionamiento premium es una decisión comercial y el precio no influye en la revisión (A7 Parte 3). **Nada de lo que sigue garantiza la aprobación de Shopify.**

### 9.1 Bloqueantes antes de enviar

| # | Bloqueante | Evidencia | Estado |
|---|---|---|---|
| B1 | Una demo store por preset (Sartorial, Imprint, Archive), misma contraseña, contenido real, derechos de marca e imágenes, más capturas por demo | TT-01 | Parcialmente confirmado (no se sabe si existen) |
| B2 | Lighthouse medido: promedio de rendimiento 60 o más y de accesibilidad 90 o más, en home, producto y colección, desktop y móvil, con contenido real | Requisito §6; TT-12 y TT-18 | No evaluado. Con 259 KB de CSS bloqueante y 249 KB de JS en todas las páginas, el rendimiento es la incógnita principal |
| B3 | Documentación pública consistente: Imprint en vez de Edition, flujo de instalación de la Theme Store | TT-04 | Confirmado. Prioridad P2 (inconsistencia documental), pero se lista aquí porque la etapa 5 revisa la documentación y la corrección es trivial |
| B4 | Canal de soporte verificado: confirmar con Johandry quién controla support@ruizdigital.com y noobprobro-web | TT-05 | Riesgo por confirmar |

### 9.2 Riesgos altos (no bloquean el envío, pueden causar observaciones)

| Riesgo | Evidencia |
|---|---|
| Unicidad: header y tarjeta únicos, iguales en los tres presets | TT-06 |
| Anillo de foco bajo 3:1 en Imprint y Archive (no lo detecta Lighthouse, sí una revisión de UX o un usuario de teclado) | TT-02 |
| Afirmaciones de material falsas por heurísticas; diferencial de Imprint y Archive invisible sin metafields | TT-03 |
| Presets con diferencia mayormente cosmética (Sartorial y Archive) | TT-17 |
| Plantillas raíz que no coinciden con el preset por defecto (install store frente a demo) | TT-13 |
| Plantillas de soporte del vendedor y secciones de página añadibles en cualquier sitio | TT-14, TT-15 |
| Catálogo de secciones estrecho para el precio | TT-16 |
| Atributo del menú de cuenta en hipótesis | TT-19 |
| Identificadores internos "atelier" que podrían confundirse con el tema Atelier de Shopify | D3 |

### 9.3 Lo que ya está listo (estático)

| Elemento | Evidencia |
|---|---|
| Código original, sin huellas de Dawn ni Horizon; sin créditos de diseñador ni afiliados; powered_by_link intacto | A7-12, TT-66, A7 Parte 3 fila 12 |
| Las 22 funciones obligatorias presentes en código y los requisitos de PDP (swatches, gift card recipient, taxes_included) | Sección 3.2; A7-11; A7 Parte 3 fila 4 |
| Nombre del tema igual al preset Sartorial; nombres de 1 palabra y menos de 30 caracteres; slugs de tema sin colisión (no se revisaron todos los presets existentes) | A7-10 |
| /listings con plantillas distintas por preset, como pide la especificación (listing.json y preview.png no hacen falta) | V1 §5 |
| Theme Check `recommended` en 0; schema 100 % `t:`; validación cruzada JSON contra schema sin errores | A2 §1, §2 |
| Flujo de compra completo y defensivo | A3 §3 |
| Base de accesibilidad estructural madura | A4 §3 |
| Formulario de soporte público y política de soporte | A7 Parte 3 fila 11 |
| Sin dependencias de terceros ni riesgo de licencia GSAP | A7-07, A7-25 |

Lectura: Sartorial está más cerca del envío que Atelier en el flujo de compra y en ausencia de riesgos de nombre y originalidad documentada, pero no está listo: tiene cuatro bloqueantes de proceso y evidencia (demos, Lighthouse, docs, soporte) y varios riesgos de diseño y UX que solo una revisión visual con demos puede valorar.

---

## 10. No evaluado y próximos pasos

### 10.1 No evaluado

| Elemento | Por qué | Qué hace falta |
|---|---|---|
| Checkout local de Sartorial (C:\Users\Johan\Documents\Drive\Tema-Shopify-codex, HEAD esperado 09f8342) | Sin acceso a la carpeta | Acceso a la carpeta para comparar el HEAD y el contenido con el ZIP auditado |
| Tema publicado de Sartorial (ID 189832593651) | Sin STOREFRONT_PASSWORD | La contraseña, para confirmar que lo publicado coincide con el ZIP |
| Demos de Atelier (contour-ho5kbo9x, annex-r0zzjfjf, maison-10oym9w0) y de Cucuyo (cucuyo-store) | Sin autorización | Autorización expresa para visitarlas |
| Lighthouse | Sin tienda | Ejecutarlo en home, producto y colección, desktop y móvil, por preset |
| axe | Sin render | Ejecutarlo sobre las plantillas clave por preset |
| Lectores de pantalla y dispositivos | Sin tecnología asistiva | NVDA y VoiceOver como mínimo, empezando por TT-02, TT-07, TT-11 y TT-78 |
| Revisión remota actual de Cucuyo | GitHub pedía credenciales a las 20:30 | Credenciales o confirmación del dueño |
| Comparación visual con fieldstudiesflora.com | Solo se comprobó que el sitio existe | Revisión visual lado a lado (TT-09) |
| Titularidad de ruizdigital.com y noobprobro-web | No demostrable desde aquí | Confirmación de Johandry (TT-05) |
| Respuestas reales de Cart API (422) y Section Rendering | Sin tienda | Prueba en tienda (TT-07, TT-21, TT-74) |
| Comportamiento del editor (renders vacíos, section:load) | Sin editor | Prueba en el editor (TT-15, TT-41, TT-45) |
| Plantillas templates/customers/* | No se verificó si siguen siendo exigidas con las nuevas cuentas de cliente. La ausencia es **común a los tres temas**, así que no es ventaja ni desventaja de ninguno | Consulta del requisito vigente (A2-20) |
| Contenido real del ZIP empaquetado de Atelier | No se ejecutó `shopify theme package` | Empaquetar y listar el ZIP (TT-33, TT-99) |
| Colisión de nombres con todos los presets existentes | Solo se probaron slugs de tema y dos presets | Recorrido del catálogo para Annex, Imprint, Archive y Sartorial |
| Licencia GSAP para temas vendidos | La licencia no menciona marketplaces | Confirmación escrita de GSAP (TT-52) |
| Licencias de Persona y Junction (Cucuyo) | Fuera de alcance | Revisión del contrato del cliente |

### 10.2 Conflictos

Resueltos en este documento: D5 a D8 (sección 1.2); A6-01 frente a A8-03 (TT-03, por lectura del snippet); A2-12 frente a A5-02 (TT-37, manda la bisección); A3-02/A2-06/A4-11 frente a V1 §8 (TT-07); A5 "sin secretos" frente a A1-10/A7-28 (TT-31); A1-01 frente a A7-30 (TT-21); A1-02 y A1-07 descartados por V1; premisa del 422 de A3-02 y V1 §8 sin fuente (D10, TT-07).

Cerrados tras la revisión independiente (R1 §2):

- **Visibilidad del repositorio de Atelier.** Hacia las 20:30 del 2026-10-27 era legible de forma anónima; "(private)" en DEVELOPMENT.md:6 estaba contradicho. El 403 de A7 fue del proxy sobre la web de GitHub. Consecuencia: TT-31 sube a P1 (no a P0, ver su criterio).
- **Visibilidad del repositorio de Cucuyo.** El clon de las 12:45 fue anónimo (público a esa hora, coherente con lo que vio A7-43 por WebFetch) y a las 20:30 pedía credenciales. Lectura: cambio de visibilidad probable entre 12:45 y 20:30. La revisión remota actual sigue sin confirmar.

Sin resolver:

- **Titularidad de ruizdigital.com y de noobprobro-web** (TT-05). Pendiente de Johandry.
- **Vigencia de la contraseña de las demos de Atelier** (TT-31). No se evaluó.

### 10.3 Próximos pasos propuestos (en orden)

1. Revisión independiente con fable en esfuerzo high: hecha (R1), cambios aplicados en esta versión.
2. Rotar la contraseña de las demos de Atelier y purgarla del historial, si el dueño lo aprueba (TT-31).
3. Conseguir acceso a la carpeta codex y STOREFRONT_PASSWORD para cerrar la fijación de versiones de Sartorial.
3. Confirmar con Johandry el dominio de soporte (TT-05) y si existen demos por preset (TT-01).
4. Con autorización, visitar las demos y ejecutar Lighthouse y axe por preset; luego una pasada con NVDA y VoiceOver.
5. Con esa evidencia, recalcular la matriz y decidir si se puede dar un total.

### 10.4 Notas obligatorias

- **Metafields.** Las siete definiciones de metafields propuestas para Sartorial **no se crearon ni se usaron**, y siguen **sin aprobar**. Ninguna recomendación de este documento depende de crearlas. Lo mismo aplica a cualquier definición que pudieran necesitar Atelier (TT-77) o Cucuyo. El archivo config/metafield_definitions.json de Atelier (TT-99) se registra como archivo del repositorio; no implica que la definición esté creada en ninguna tienda ni aprobada.
- **Sin autorización de implementación.** Las recomendaciones describen qué cambiar y por qué; no autorizan a nadie a implementar nada. Cualquier cambio requiere aprobación aparte.
- **Sin código copiado.** Este documento no copia código de Atelier ni de Cucuyo a Sartorial, ni lo propone. Cuando una recomendación dice cómo lo resuelve otro tema, describe un patrón como comparación; la implementación, si se aprueba, se escribe desde cero.
- **Rechazos de Atelier.** La causa sigue sin verificar (sección 3.4).
- **Aprobación.** Ningún resultado de esta auditoría garantiza la aprobación de Shopify.
