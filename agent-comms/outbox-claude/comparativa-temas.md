# Comparativa final: Sartorial 1.0.0 frente a Contour 4.1.0 y Cucuyo 2.0.0

Revisión de solo lectura sobre los tres repos (Sartorial `b400cdc`, Contour `1576d06`, Cucuyo `727c0d4`). Para verificar el historial de Sartorial se profundizó el clon con `git fetch --depth=1000` (153 commits visibles); también se profundizaron Contour (472 commits) y Cucuyo (269) para fechar el linaje. No se modificó ningún repo. Theme Check se corrió con la misma configuración para los tres (`theme-check:all`, sin ignorar nada, sobre copias con solo las carpetas del tema). Los pesos gzip se midieron con `gzip -6` sobre los archivos concatenados en el orden de carga.

## Veredicto

Sartorial y Contour quedan prácticamente empatados (6,7 y 6,8 recalibrados); la brecha de 0,8 puntos de los informes originales venía de criterios distintos entre auditores, no del código. Sartorial gana en cumplimiento funcional de la Theme Store (selling plans en la PDP, cero `shopify://` en plantillas, accesibilidad más completa, JS sin librerías y más liviano) y pierde en internacionalización (2 idiomas y sin schema traducido frente a 5 completos), en amplitud de secciones (33 frente a 60), en presets realmente verticales y en higiene del repo. Cucuyo no compite en esta liga: es un tema a medida, bien resuelto para su tienda, pero sin la mitad de lo que exige la Theme Store. Sartorial no está listo para enviarse hoy: antes hay que sacar la contraseña del storefront que sigue versionada en HEAD, eliminar la lógica atada al catálogo demo y las dos cadenas en inglés sin traducir, y decidir qué hacer con las plantillas de documentación que viajan dentro del tema. Son arreglos de días, no de semanas; el peso de JS y CSS es el único problema estructural de fondo y no bloquea el envío por sí solo.

## Puntajes recalibrados

| # | Categoría | Sartorial (orig.) | Contour (orig.) | Cucuyo (orig.) | Qué cambió y por qué |
|---|---|---|---|---|---|
| 1 | Arquitectura | 7 (6) | 7 (8) | 5 (5) | Los dos usan la misma arquitectura: OS 2.0, section groups, 0 theme blocks en uso, `@app` en 2 secciones. `blocks/` de Contour son los 2 archivos del skeleton sin usar. Sartorial suma `enabled_on` en 14 secciones; Contour suma un grupo más y más secciones. Empate. |
| 2 | JavaScript | 7 (6) | 6 (6) | 6 (6) | Sartorial es el más liviano de los tres (57 KB gz en todas las páginas, 0 librerías, Web Components). Contour carga 97 a 103 KB gz con 6 librerías vendorizadas y lógica duplicada. Cucuyo 65 KB gz de los que el 71 % es GSAP/Lenis. |
| 3 | CSS | 6 (6) | 6 (7) | 6 (6) | Medido completo, Contour entrega más CSS que Sartorial (74 KB gz frente a 50 KB gz) porque los 69 `{% stylesheet %}` se sirven en un bundle global. Contour y Cucuyo tienen mejores tokens; Sartorial tiene 181 `font-size` literales y 47 `!important`. Se igualan. |
| 4 | Rendimiento | 7 (7) | 7 (7) | 5 (5) | Sin cambios. Contour optimiza LCP cargando el JS tras el FCP pero trae más bytes; Sartorial bloquea con 50 KB gz de CSS pero el pipeline de imágenes y el video del hero están bien. |
| 5 | Accesibilidad | 8 (8) | 8 (8) | 7 (7) | Sin cambios. |
| 6 | Theme Store | 8 (8) | 7 (8) | 2 (2) | Contour baja un punto: 6 `shopify://shop_images` en plantillas por defecto (home y about salen sin imagen en una tienda nueva), sin selector de selling plans en la PDP, `aria-label` en inglés quemados y paleta documentada como copia de otro sitio. Sartorial mantiene 8 pese a las 2 cadenas sin `t` y la lógica demo. |
| 7 | Funciones | 7 (8) | 7 (7) | 3 (3) | Con el mismo criterio SÍ/parcial/NO los dos quedan en 17 SÍ, 3 parciales y 4 NO (tabla más abajo). Sartorial baja porque "bundles" y "pickup" son parciales y a un tema de 380 dólares le faltan quick view, popup, countdown y comparador. |
| 8 | Calidad de código | 7 (7) | 7 (8) | 5 (6) | Con la misma config de Theme Check: Sartorial 6 ofensas (todas de tamaño), Contour 2 (pero el cargador dinámico oculta ~100 KB gz al chequeo y el repo desactiva `AssetSizeJavaScript`), Cucuyo 8 con un error de sintaxis Liquid. Contour baja por eso y por el naming Atelier/Contour (43 frente a 5 referencias). Cucuyo baja por el error de sintaxis. |
| 9 | Higiene del repo | 3 (3) | 6 (7) | 4 (4) | Sartorial: cookies de sesión confirmadas en el historial remoto y la contraseña del storefront todavía en HEAD en 5 archivos versionados (ver P0). Contour baja porque la contraseña de sus 3 demos también está versionada (`DEVELOPMENT.md:7`); misma vara. |
| 10 | Diseño | 7 (7) | 7 (8) | 8 (8) | Contour baja un punto: su contrato de diseño se declara reconstruido de fieldstudiesflora.com y 4 hex de marca son copia literal; eso resta originalidad aunque los presets sean los más verticales de los tres. |
| | **Promedio** | **6,7 (6,6)** | **6,8 (7,4)** | **5,1 (5,2)** | |

## Cifras duras lado a lado

| Métrica | Sartorial | Contour | Cucuyo |
|---|---|---|---|
| JS home (crudo / gz) | 240,7 KB / 56,9 KB (1 archivo) | 298,2 KB / 96,6 KB (24 archivos) | 182,5 KB / 64,7 KB (6 archivos) |
| JS producto (crudo / gz) | 253,2 KB / 60,5 KB (2) | 302,3 KB / 97,6 KB (25; 98,3 KB si es gift card) | 182,5 KB / 64,7 KB |
| JS colección (crudo / gz) | 240,7 KB / 56,9 KB (1) | 318,2 KB / 103,2 KB (25) | 182,5 KB / 64,7 KB |
| JS de librerías | 0 | 184 KB crudos (GSAP, ScrollTrigger, Flip, SplitText, Lenis, QRCode) | 129 KB crudos (GSAP, ScrollTrigger, Lenis) |
| Carga del JS | `defer` en `<head>`, todo en todas las páginas | inyección dinámica tras el FCP (fallback 3 s); solo 3 archivos varían por plantilla, 22 son comunes | `defer` al final del `<body>`, todo en todas |
| CSS global (crudo / gz) | 249,0 KB / 50,5 KB, `preload` bloqueante | 101,0 KB / 27,8 KB, 2 archivos bloqueantes | 130,5 KB / 33,7 KB |
| CSS en `{% stylesheet %}` | 0 | 212,4 KB / 46,5 KB en 69 archivos (bundle global) | 17,2 KB / 3,5 KB en 5 archivos |
| CSS total por página (gz) | ~50,5 KB | ~73,6 KB | ~36,5 KB |
| Comentarios en base.css | 18 % | 37 % | 45 % |
| Secciones .liquid / grupos | 33 / 2 | 60 / 3 | 35 / 2 |
| Snippets | 21 | 34 | 23 |
| Theme blocks en uso | 0 (sin `blocks/`) | 0 (2 archivos del skeleton sin usar) | 0 |
| Secciones con `@app` | 2 | 2 | 0 |
| Secciones con presets | 20 | 43 | 26 |
| `enabled_on` / `disabled_on` | 14 secciones | 0 | 0 |
| Presets | 3 (Sartorial, Imprint, Archive) | 3 (Contour, Annex, Maison) | 1 |
| `listings/` | 3 carpetas con solo `templates/` (76 KB) | 3 carpetas con `listing.json`, `preview.png` y templates (14 MB) | no |
| Idiomas storefront / schema | en, es / solo en | en, es, fr, de, it / los 5 | en / ninguno |
| `shopify://` en plantillas | 0 | 6 (`index.json`, `page.about.json`) | 61 (tema a medida, esperable) |
| Theme Check `theme-check:all` igual para los tres | 6 (3 AssetSizeCSS, 3 AssetSizeJavaScript) | 2 (AssetSizeJavaScript en password y gift_card; el resto no lo ve) | 8 (4 JS, 2 CSS, 1 LiquidHTMLSyntaxError, 1 OrphanedSnippet) |
| Funciones SÍ / parcial / NO | 17 / 3 / 4 | 17 / 3 / 4 | 3 / 3 / 18 |
| Peso del tema (carpetas del tema) | 1,19 MB | 2,04 MB | 27,7 MB (26,8 MB de JPG) |
| Repo en disco / archivos versionados | 502 MB / 2.202 (93 del tema) | 31 MB / 197 | 53 MB / 209 |
| theme_info docs y soporte | GitHub Pages, ambas 200 | GitHub Pages, 200 | repo e issues de GitHub (403 sin sesión) |

## Las 24 funciones lado a lado

| Función | Sartorial | Contour | Cucuyo |
|---|---|---|---|
| Mega menú | SÍ (`snippets/mega-menu.liquid`) | NO (índice lateral de 3 niveles) | NO |
| Cajón de carrito | SÍ | SÍ | NO |
| Cart upsell | SÍ (recomendaciones `complementary`) | SÍ (por colección, recorre `collections.all` en Liquid) | NO |
| Barra de envío gratis | SÍ (más umbral de regalo) | SÍ | NO |
| Quick view | NO (solo diálogo de variantes) | SÍ (modal con media, descripción y variantes) | NO |
| Quick add | SÍ | SÍ | NO |
| Swatches en tarjeta | SÍ | SÍ | parcial (solo en `featured-card`, no en `product-card`) |
| Zoom de producto | SÍ | NO | NO |
| Galería con video/3D | SÍ | SÍ | NO (solo imágenes) |
| Sticky add-to-cart | SÍ | SÍ | NO |
| Recently viewed | SÍ | SÍ | NO |
| Complementary products | SÍ | SÍ | NO |
| Size guide | SÍ (bloque con página) | parcial (bloque `dimensions` con diagrama) | NO |
| Lookbook / hotspots | SÍ | SÍ (`shop-the-set`) | NO |
| Newsletter | SÍ | SÍ | SÍ |
| Popup | NO | NO | SÍ |
| Countdown | NO | NO | NO |
| Testimonios | parcial (una cita con autor en `brand-manifesto`) | SÍ | parcial (cita de prensa) |
| FAQ | SÍ | SÍ | parcial (acordeones en PDP) |
| Video hero | SÍ | SÍ | SÍ |
| Comparador | NO | SÍ (`spec-compare`, `wall-comparison`) | NO |
| Bundles | parcial (multi-add sin descuento) | parcial (completa el set, sin descuento) | NO |
| Store locator / pickup | parcial (pickup sí, locator no) | parcial (igual) | NO |
| Multi-moneda / país | SÍ | SÍ | NO |
| **Total** | **17 / 3 / 4** | **17 / 3 / 4** | **3 / 3 / 18** |

Correcciones respecto a los informes originales: Sartorial contaba bundles y pickup como SÍ y testimonios como NO (19/0/5); Contour no contaba parciales; Cucuyo contaba swatches como SÍ.

## En qué gana Sartorial

| Punto | Evidencia |
|---|---|
| JS más liviano y sin dependencias | 56,9 KB gz en home frente a 96,6 KB de Contour y 64,7 KB de Cucuyo; 0 librerías frente a 6 y 3. 28 custom elements sobre `ThemeElement` (`assets/theme.js:152`). |
| Cumplimiento funcional de la Theme Store más completo | Selling plans con selector en PDP (`sections/main-product.liquid:3-21, 529-577`); Contour solo los muestra en el carrito. 0 `shopify://` en plantillas frente a 6 en Contour. `enabled_on` en 14 secciones. |
| Accesibilidad más trabajada | `inert` gestionado, foco devuelto, `forced-colors` (`assets/base.css:3053`), botón de pausa del video del hero, 9 bloques de reduced-motion. Contour tiene `aria-label` en inglés quemados en `snippets/social-icons.liquid:4-16`. |
| Funciones que Contour no tiene | Zoom de producto, mega menú con promo, guía de tallas con página, rewards en carrito (envío más regalo). |
| Imágenes y LCP | Pipeline único en `snippets/responsive-image.liquid` con `fetchpriority` en hero, PDP, colección y artículo; video del hero con `preload="none"`. Contour tiene el condicional de prioridad muerto en `product-card.liquid:40-44`. |
| Originalidad visual | No hay rastro de scrape ni de paletas copiadas: 0 coincidencias con los hex de fieldstudiesflora en Sartorial, 4 en Contour. |
| CI con compuertas | `.github/workflows/ci.yml` con JSON, contrato `data-*`, locales, ledger y Theme Check. Ninguno de los otros dos tiene CI. |

## En qué pierde Sartorial y qué puede tomar de los otros dos

> Nota: esta sección queda reemplazada por "Mejoras recomendadas (referencia: Contour)" al final del informe, que solo toma Contour como referencia.

| Idea | De quién | Esfuerzo | Prioridad |
|---|---|---|---|
| Traducir el schema a es y añadir fr, de, it (storefront y schema). Contour tiene 1.688 claves de schema en 5 idiomas con 0 faltantes; Sartorial deja el editor en inglés para comerciantes en español. | Contour | medio | alta |
| Quick view real (modal con media, descripción y variantes) reutilizando el diálogo de variantes que ya existe en `snippets/product-card.liquid:372`. Contour lo resuelve con una sección de Section Rendering (`sections/quick-buy.liquid`). | Contour | medio | alta |
| Popup de newsletter con retraso, días de supresión y código de descuento, con `<dialog>` nativo. | Cucuyo (`sections/newsletter-popup.liquid`) | bajo | alta |
| Dividir el JS por plantilla o por interacción: 57 KB gz de lookbook, facets, variantes y zoom viajan a todas las páginas. Contour separa SplitText, Flip, `collection-view.js` y `pickup-availability.js` por `template.name` (`layout/theme.liquid:172-201`). Sartorial puede empezar por sacar facets, lookbook y complete-the-look del monolito y cargarlos con `defer` desde su sección. | Contour | alto | alta |
| Presets más verticales: los 3 presets comparten radio, ancho, gutter y fuente de cuerpo. En Contour cada preset tiene secciones propias de su nicho (spec-compare, wall-comparison, kiln-log). Para moda: sastrería a medida, streetwear, archivo vintage, cada uno con 1 o 2 secciones exclusivas. | Contour | alto | media |
| `listings/<preset>/listing.json` y `preview.png` por preset, como material listo para el formulario de la Theme Store. | Contour | bajo | media |
| Sección de testimonios con bloques y sección de comparador de productos. | Contour | medio | media |
| Theme blocks reales (`blocks/` con `@theme` en secciones de contenido) para extensibilidad tipo Horizon. Ninguno de los tres lo hace; sería diferencial. | nadie | alto | media |
| `@app` en colección, carrito, header y footer, no solo en producto. | nadie | bajo | media |
| `.shopifyignore` y README de instalación. Contour tiene ambos. | Contour | bajo | baja |
| `preconnect` a fonts.shopifycdn.com. | Contour (`layout/theme.liquid:38`) | bajo | baja |

## Problemas de Sartorial por prioridad

### P0 (hay que resolverlo antes de cualquier envío o de hacer público el repo)

| Problema | Evidencia |
|---|---|
| La contraseña del storefront de las demos sigue versionada en HEAD como fallback literal, en scripts añadidos el 2026-10-10, después de la "remediación de seguridad" del 2026-10-02. El mismo literal aparece citado en 3 documentos. | `scripts/gate5-live-verify.mjs:5`, `scripts/gate5-complete-verification.mjs:5` (patrón `process.env.STOREFRONT_PASSWORD \|\| '<literal>'`), `agent-comms/BOARD.md:366`, `agent-comms/outbox-claude/CLAUDE-HANDOFF-SESSION-002.md:83, 87, 271`, `agent-comms/reviews/GEMINI-REVIEW-V1.1.0-PHASE2.md:82` |
| Cookies de sesión del storefront en el historial del remoto. Confirmado: el commit `ff3dca1` (2026-09-26) añadió `harness-AUDIT-360-001/lh-headers.json`, un JSON con una cabecera `Cookie` que contiene 4 valores `_shopify_*`, junto con `harness-AUDIT-360-001/get-cookies.mjs`. El archivo se borró en `080402c` (2026-10-02) pero sigue en el historial de `origin/master`. `BOARD.md:241` registra la rotación como P0 pendiente y no hay constancia de que se haya hecho. | `git log --diff-filter=A -- harness-AUDIT-360-001/lh-headers.json` |
| 24 instantáneas HTML con el `accessToken` público de Storefront API de las demos. Riesgo bajo, pero no debería viajar en el repo. | `harness-AUDIT-360-002/html-validation/*.html:152` |

Nada de esto bloquea la revisión de la Theme Store en sí (el revisor ve el ZIP, no el repo), pero sí bloquea hacer público el repo o compartirlo, y la rotación de contraseña es urgente porque las demos están en vivo.

### P1 (bloquea o pone en riesgo el envío a la Theme Store)

| Problema | Evidencia |
|---|---|
| Lógica atada al catálogo demo: el material se infiere si el handle contiene `brass` o `paperweight` y el tipo contiene `desk`, `object`, `metal` o `hardware`; la procedencia se activa si el título contiene `19` o `20`. Un título como "2024 Collection Tee" o "Top 20" dispara "circa". Ni Contour ni Cucuyo tienen nada equivalente (0 condicionales sobre handle, título o tipo). | `snippets/product-technical-specs.liquid:46-69`, `snippets/product-provenance.liquid:30` |
| Dos cadenas visibles al cliente sin `t`: `'Solid milled brass'` y `'Precision machined'`. | `snippets/product-technical-specs.liquid:53, 69` |
| Plantillas `page.documentation` y `page.support` con secciones `main-documentation` (313 líneas) y `main-support` (386) que meten documentación del tema en la tienda del comerciante; `main-documentation.liquid:241` tiene "Sartorial" como default. Un revisor lo marcará como contenido que no corresponde al comerciante. | `templates/page.documentation.json`, `templates/page.support.json`, `sections/main-documentation.liquid`, `sections/main-support.liquid` |
| Peso de assets en todas las páginas: 50,5 KB gz de CSS bloqueante con `preload` y 56,9 KB gz de JS. Theme Check `:all` da 6 ofensas de tamaño. Riesgo con el umbral de Lighthouse de la revisión, no un rechazo automático. | `layout/theme.liquid:54, 95` |
| El soporte apunta a un correo de un dominio ajeno: `support.html` ofrece `mailto:support@ruizdigital.com` y ruizdigital.com responde con "Ruiz Digital \| Content Marketing", que no es el autor del tema. El formulario Formspree de la misma página sí es propio. Las URLs de `theme_info` sí responden 200 (ver abajo). | `https://noobprobro-web.github.io/sartorial-docs/support.html` |
| `@app` solo en `main-product` y `featured-product`; colección, carrito, header y footer no aceptan apps. | `sections/main-product.liquid:1153` |

### P2 (deuda, no bloquea)

| Problema | Evidencia |
|---|---|
| `featured-product.liquid` comparte el 49 % de líneas con `main-product.liquid`; `main-search` el 37 % con `main-collection`; la lógica de `inert` está copiada 4 a 6 veces en `theme.js`. | `assets/theme.js:336, 1467, 2483, 5220` |
| `sections/main-placeholder.liquid` no la usa nadie y no tiene presets. | |
| Comentarios con IDs internos de tickets en código que se entrega (`5C-001`, `A360-04`, `TEC-04`) y mezcla de español e inglés. | `sections/header.liquid:135`, `assets/base.css:732` |
| 9 hex fuera de tokens en los estilos de movimiento `technical` y `heritage`, que no responden al esquema de color. | `assets/base.css:9079-9124` |
| Sin `.shopifyignore`, README desactualizado, `.agents/` con 90 archivos versionados aunque está en `.gitignore`, 96 % de los archivos del repo no son del tema. | raíz del repo |
| `listings/` solo trae templates; faltan `listing.json` y `preview.png` por preset (no es obligatorio, pero Contour lo tiene listo). | `listings/*/` |
| Sin `preconnect` ni preload de fuentes. | `layout/theme.liquid:56-64` |

### Verificación de theme_info (punto 1d)

Hoy `config/settings_schema.json:3-9` dice autor "Ruiz Digital", documentación `https://noobprobro-web.github.io/sartorial-docs/docs.html` y soporte `https://noobprobro-web.github.io/sartorial-docs/support.html`. Las dos responden HTTP 200 con títulos "Sartorial Theme Documentation | Ruiz Digital" y "Sartorial Theme Support | Ruiz Digital". El historial explica el hallazgo anterior: hasta el 2026-09-30 apuntaban a `https://ruizdigital.com/themes/sartorial/docs` y `/support` (y antes a `/themes/couture/`), que daban 404; el commit `1779ec2` las movió a páginas de la tienda demo y el `8e32327` (2026-10-10) a GitHub Pages. Queda pendiente lo del `mailto` a `support@ruizdigital.com` en la página de soporte. Contour apunta documentación y soporte a la misma URL `https://sebastiandev017.github.io/atelier/` (200, título "Contour, Theme Documentation"). Cucuyo apunta al repo de GitHub y a sus issues (403 sin sesión; aceptable para un tema a medida).

## Linaje de código y originalidad

### Linaje (punto 1f)

Método: se normalizaron las líneas de `assets`, `layout`, `sections`, `snippets` y `blocks` de los tres repos (sin `.min.js` ni binarios), se indexaron ventanas de 4 líneas y se cruzaron por pares. Resultado con los denominadores de cada repo (20.485 ventanas distintas en Sartorial, 20.039 en Contour, 9.880 en Cucuyo):

| Par | Ventanas de 4 líneas compartidas | Qué son |
|---|---|---|
| Sartorial y Contour | 16 (0,08 %) | Solo boilerplate de Shopify: el script `no-js`/`js`, `{% sections 'footer-group' %}`, `paginate.parts`, el `{%- when '@app' -%}{% render block %}`, los settings `link_list` `menu` y `customer_account_menu` del header, `@media (prefers-reduced-motion)` con `*::before`. Nada específico de ninguno de los dos. |
| Sartorial y Cucuyo | 7 (0,07 %) | Paginación, `has_only_default_variant`, cierre de un JSON de variantes. Genérico. |
| Contour y Cucuyo | 40 (0,40 %) | Archivos reales compartidos: `snippets/meta-tags.liquid` (17 ventanas, mismo bloque `og_*`), `assets/gsap-init.js` (11; Cucuyo es una versión recortada del de Contour con el mismo comentario sobre el ticker de GSAP y Lenis), `assets/gsap-animations.js` (5), `layout/theme.liquid` (favicon SVG inline con el mismo comentario). |

Nombres de archivo compartidos entre Sartorial y Contour: 31, todos nombres estándar de Shopify (`main-product`, `product-card`, `price`, `cart-drawer`, `theme.js`, `base.css`). Contour y Cucuyo comparten además `css-variables.liquid`, `meta-tags.liquid`, `gsap-init.js`, `gsap-animations.js`, `gsap.min.js`, `lenis.min.js`.

Cronología de los nombres "Atelier":

| Fecha | Repo | Hecho |
|---|---|---|
| 2026-06-23 | Contour | Primer commit "Build Atelier V2". `theme_name` pasa por "Atelier V2", "Atelier", "Side Atelier" (06-24) y "Contour" (2026-09-09). De ahí `window.Atelier`, los keyframes `atelier-vt-*` y el nombre del repo. |
| 2026-08-04 | Cucuyo | Commit "full theme reset on Atelier architecture": copia y adapta `meta-tags`, `gsap-init`, `gsap-animations` y el patrón de favicon de Contour. Los comentarios "Atelier pattern / architecture" se refieren a Contour, que entonces se llamaba Atelier. Mismo autor. |
| 2026-09-10 | Sartorial | `docs/decisions.md:10-12` define "Atelier Flow" como nombre interno del concepto y dice que se evitará "Atelier" como nombre público por confusión con el tema gratuito "Atelier by Shopify" (`docs/top-theme-benchmark.md:32`). El primer código de tema llega el 2026-09-11 (`b72bc63`). |
| 2026-09-13 | Sartorial | Se adopta "Sartorial" con presets Sartorial, Edition y Archive; la demo principal se llama `sartorial-atelier` y existe un estilo de movimiento `atelier` (`data-motion-style`). |
| 2026-09-30 | Sartorial | `harness-COMP-001/collect.js:4-6`, `GPT-AUDIT-013` y `GPT-AUDIT-015` usan las tiendas demo de Contour, Maison y Annex (`contour-ho5kbo9x`, `maison-10oym9w0`, `annex-r0zzjfjf.myshopify.com`) como "tiendas de referencia" para una auditoría comparativa en vivo de las demos de Sartorial. |

Conclusión con los hechos en la mano: Contour y Cucuyo sí comparten código, y el flujo es de Contour hacia Cucuyo, dentro del trabajo del mismo autor. Sartorial no comparte código con ninguno de los dos más allá del boilerplate estándar de Shopify: 16 ventanas de 4 líneas sobre 20.000, ninguna específica. "Atelier Flow" es un nombre de concepto independiente, documentado el 2026-09-10, tres meses después de que Contour ya se llamara Atelier, y el propio equipo de Sartorial lo descartó como nombre público por el tema gratuito de Shopify, no por Contour. El único contacto concreto entre los proyectos es que el equipo de Sartorial, el 2026-09-30, usó las demos públicas de Contour como referencia de comparación comercial, con el código de Sartorial ya construido. No hay evidencia de copia de código en ninguna dirección.

### Originalidad (punto 1g)

Contour: `DESIGN.md:16-40` declara que el contrato visual se reconstruyó con Playwright a partir de fieldstudiesflora.com el 2026-06-23 y lista sus custom properties "verbatim". En el código quedan 4 hex idénticos a los del sitio (`#D5CDB6`, `#FFF4D7`, `#3A7D33`, `#766356`) en `assets/base.css:37-40` con el comentario "from the fieldstudiesflora scrape". Las paletas de los presets (`#faf7f2`, `#2c1810`, etc.) ya no coinciden con el scrape (`#fbf8f2`, `#2e3030`); el riesgo se concentra en esas 4 constantes y en la documentación, que `.shopifyignore` excluye del paquete pero sigue en el repo.

Sartorial: no hay nada parecido. 0 de sus 52 hex coinciden con los del scrape de Contour, los 4 que comparte con Contour son blanco y tres grises neutros (`#ffffff`, `#111111`, `#1a1a1a`, `#2b2b2b`), y en `docs/` no hay ningún sitio de referencia extraído: el benchmark (`docs/top-theme-benchmark.md`) compara temas de pago de la Theme Store (Prestige, Palo Alto, Broadcast, Pipeline, Impact, Focal) a nivel de funciones. El único punto sensible es la auditoría comparativa contra las demos de Contour del 2026-09-30, que fue de UX y merchandising, no de diseño visual, y no dejó rastro en el código.

## Errores corregidos de los informes originales

| Informe | Decía | Corrección |
|---|---|---|
| Sartorial §9 | "El clon local es superficial y no deja verificarlo" (cookies en el historial). | Verificado con el historial completo: `ff3dca1` (2026-09-26) añadió `harness-AUDIT-360-001/lh-headers.json` con una cabecera `Cookie` de 4 valores `_shopify_*`; se borró en `080402c` (2026-10-02); sigue en `origin/master`. La afirmación del BOARD es cierta. |
| Sartorial §9 | Búsqueda de secretos: solo el token público de storefront y un marcador. | Faltó el hallazgo más grave: la contraseña del storefront está en HEAD como literal en `scripts/gate5-live-verify.mjs:5` y `scripts/gate5-complete-verification.mjs:5` (añadidos el 2026-10-10) y citada en `agent-comms/BOARD.md:366`, `CLAUDE-HANDOFF-SESSION-002.md:83, 87, 271` y `GEMINI-REVIEW-V1.1.0-PHASE2.md:82`. |
| Sartorial §1 y §6 | `listings/` "como pide la Theme Store". | La Theme Store no exige esa carpeta; es una convención. Además las de Sartorial solo traen templates, sin `listing.json` ni `preview.png`. |
| Sartorial §7 | 19 SÍ y 5 NO. | Con el criterio común: 17 SÍ, 3 parciales (testimonios, bundles, pickup), 4 NO. |
| Sartorial §6 | No menciona la página de soporte. | `support.html` enlaza `mailto:support@ruizdigital.com`, dominio de otra empresa. |
| Contour §2 | "Carga por plantilla tras el FCP", 107 a 114 KB gz. | La carga tras el FCP es real, pero la división por plantilla es mínima: 22 de 24 a 26 archivos son comunes; solo SplitText, Flip, `collection-view.js` y `pickup-availability.js` varían. Con el mismo método que los otros dos (gzip -6 concatenado): 96,6 KB home, 97,6 KB producto, 103,2 KB colección. Las cifras del informe eran la suma archivo por archivo, válida pero no comparable. |
| Contour §3 (7/10) frente a Sartorial §3 (6/10) | Contour con mejor CSS. | Medido completo, Contour entrega 73,6 KB gz de CSS por página (los 69 `{% stylesheet %}` van en un bundle global) frente a 50,5 KB de Sartorial. Mejor tokenizado, pero más pesado. Se igualan en 6. |
| Contour §1 (8/10) frente a Sartorial §1 (6/10) | Dos puntos de diferencia. | Misma arquitectura en los dos: OS 2.0, section groups, 0 theme blocks en uso, `@app` en 2 secciones. Igualados en 7. |
| Contour §8 | 0 ofensas con la config del repo. | La config del repo desactiva `AssetSizeJavaScript` y el cargador dinámico oculta ~100 KB gz al análisis estático. Con la misma config que los otros: 2 ofensas visibles, pero no es comparable con las 6 de Sartorial, que sí expone sus scripts al chequeo. |
| Contour §9 | 7/10 con la contraseña de las demos en `DEVELOPMENT.md:7` como nota menor. | Una credencial versionada es el mismo tipo de fallo que se penaliza en Sartorial; baja a 6. |
| Cucuyo §7 | Swatches en tarjeta: SÍ. | Parcial: solo `featured-card.liquid:294`; `product-card.liquid:5` dice explícitamente que no lleva swatches. |
| Cucuyo §8 | Theme Check: 3 errores y 1 advertencia. | Con la misma config que los otros dos (sin los umbrales que el repo subió a 100.000 y 130.000 B): 8 ofensas, incluidos 4 `AssetSizeJavaScript`. El error de sintaxis y el `OrphanedSnippet` se mantienen. |

Archivos de trabajo: `/tmp/claude-0/-home-claude/24a5d739-75d0-5475-96de-119a42626d3b/scratchpad/compare/` (scripts `sizes.sh`, `sizes2.sh`, `ss.py`, `lineage.py`, `shing_show.py`, copias `tc-*` para Theme Check y salidas `tc-*.json`).

## Mejoras recomendadas (referencia: Contour)

Decisión de Johandry: la única referencia es Contour, porque es el más desarrollado y ya pasó por varias rondas de corrección frente a Shopify. Fuentes: análisis de transferencia sobre Sartorial `b400cdc` y Contour `1576d06`, y revisión del historial de Contour (472 commits) contra la página pública de requisitos de la Theme Store (consultada el 2026-10-18).

### Principio rector

De Contour se toman patrones, decisiones y lecciones, y se reimplementan en el estilo de Sartorial. No se copia su Liquid, su JS, su CSS ni su paleta.
La línea de Sartorial no se negocia: cero librerías, Web Components sobre `ThemeElement`, CSS con variables en hojas propias, cero `shopify://` en plantillas e identidad editorial de moda con sus tres presets.
Todo lo nuevo nace como módulo con `defer`, hoja propia, `<dialog>` nativo cuando sea un diálogo y `t:` en todos los textos.

### Lecciones de las revisiones de Shopify a Contour

El repo de Contour no guarda el texto, la fecha ni el veredicto de ninguna revisión de la Theme Store; solo hay rechazos técnicos de subida o importación y correcciones contra los requisitos públicos.

| Lección | Evidencia en Contour | Qué hacer en Sartorial |
|---|---|---|
| `theme_info` admite un solo canal de soporte: Shopify rechazó la subida con URL y email a la vez | `e24ec5a` | Confirmar que `config/settings_schema.json` declara solo `theme_support_url` y quitar el `mailto:support@ruizdigital.com` de `support.html` |
| `{% stylesheet %}` no es válido en una plantilla con layout none ("Unknown tag 'stylesheet'") | `9c08763` (`gift_card.liquid`) | Al partir `base.css`, `templates/gift_card.liquid` sigue cargando su hoja con `stylesheet_tag`; nada de `{% stylesheet %}` ahí |
| Un handle de fuente inválido cae a la fuente de respaldo sin error visible | `9086cfe` (`eb_garamond_n4` frente a `ebgaramond_n4`) | Al dar un par tipográfico propio a cada preset, revisar en la vista previa que cada handle carga |
| Theme Check no detecta un grupo de secciones con tipo inválido; el grupo no se renderiza y `theme dev` no sube | `02e2d5d` (`"custom"` en vez de `"custom.<valor>"`) | El nuevo `overlay-group.json` del popup se prueba subiendo a una tienda de desarrollo, no solo con Theme Check |
| Un `richtext` sin etiqueta de bloque de nivel superior rechaza la subida y deja la vista previa en 404 | `475d1e3` | Gate en `scripts/json-validate.mjs`: todo valor `richtext` de `templates/` y `listings/` abre con `<p>`, `<h*>`, `<ul>` u `<ol>` |
| Shopify rechaza una plantilla JSON con más de 25 secciones | `1000793` | El mismo gate cuenta secciones por plantilla, incluidas las de `listings/` |
| El CSV de demo se rechaza si los campos de variante solo van en la primera fila | `9ad150e` | Si el catálogo demo se carga por CSV, cada fila de variante lleva Inventory Policy, Fulfillment Service, Requires Shipping y Taxable |
| Nombre de tema y de presets sin colisión con temas publicados; `theme_name` igual a un preset | `8a2da6b` ("Studio" pasa a Annex), `0543be1` | Comprobar "Sartorial", "Imprint" y "Archive" en themes.shopify.com antes del envío y dejarlo anotado |
| Las imágenes de la demo no viajan al instalar; el estado de instalación debe coincidir con la demo | `0b645ba` (49 `shopify://` eliminados) | Mantener el 0 actual y convertirlo en gate que rechace `shopify://` en `templates/` y `listings/` |
| Lighthouse se mide en la demo y en móvil, no en local | `1576d06` (de 60 a 70 a cerca de 90, según el commit) | Medir home, producto y colección en las tres demos antes y después de partir JS y CSS; la página pública pide media de 60 en rendimiento y 90 en accesibilidad |
| axe en cada plantilla y en los estados ocultos (cajón, modal, menú móvil) | `583d5db`, `3d13d8e` (57 violaciones a 35 y luego a 0) | Recorrer quick view, popup y lista de espera abiertos con axe, además de las plantillas |

### Mejoras por área

| Área | Decisión | Qué se toma de Contour | Cómo queda en Sartorial | Esfuerzo | Impacto en el envío |
|---|---|---|---|---|---|
| Internacionalización | ADOPTAR | Cobertura de 5 idiomas con 0 claves faltantes (250 de storefront y 1.688 de schema por idioma) y el relleno por script | Consolidar las 62 cadenas repetidas en `sections.all`, crear `es.schema.json`, luego fr, de, it; `locale-scaffold.mjs` y gate de paridad. Unas 3.314 cadenas en total | Medio (2 a 4 días más revisión nativa) | No bloquea (solo se exige `en.default`); diferencial comercial en el listado |
| Quick view | ADAPTAR | Sección endpoint sin presets por Section Rendering, un solo cascarón en el layout, reutilizar el selector de variantes | `sections/quick-view.liquid`, `<quick-view-dialog>` sobre `ThemeElement` con `<dialog>` nativo, módulo `quick-view.js`; el modo `picker` de la tarjeta se mantiene | Medio (3 a 5 días) | No es requisito; era uno de los 4 NO frente a la competencia del tier |
| Carga de JS | ADAPTAR | Cada sección declara su script; lista condicional por plantilla y ajuste; en `design_mode` cargar todo con `defer` | Núcleo `theme.js` de 9,2 KB gz más módulos por sección como `product-zoom.js`; cajón en dos fases; `featured-product` sin `VariantSelects`. Home de 56,9 a unos 36 a 40 KB gz | Alto (1 a 2 semanas) | Baja el riesgo de Lighthouse y quita las 3 ofensas `AssetSizeJavaScript` en layouts; ningún check apagado |
| CSS | ADAPTAR | Disciplina de tokens y orden de carga de las variables del comerciante | `base.css` de ~21 KB gz más `motion-*.css` por estilo y hojas por sección con `stylesheet_tag`, no `{% stylesheet %}`. CSS bloqueante de 50,5 a ~21 KB gz | Alto (1 a 2 semanas) | `AssetSizeCSS` deja de marcar; mejora LCP móvil |
| Presets verticales | ADAPTAR | Secciones exclusivas por preset y layout global distinto | Sartorial: `atelier-process`, `fabric-library`. Imprint: `drop-calendar`, `look-index`. Archive: `provenance-ledger`, `condition-guide`. Ancho, gutter, espaciado, escalas, radio y par tipográfico propios por preset | Alto (6 secciones, 1 a 2 semanas) más medio para presets | Cada ficha del listado necesita demo y argumento propios |
| Listings | ADOPTAR | `listings/<preset>/listing.json`, capturas y `page.about.json` por preset | `listing.json` con los campos del formulario (tagline de 70, 3 highlights), capturas 2000 x 2496, 750 x 1334 y 1600 x 1200 de menos de 1 MB, excluidas del paquete; gate de campos y dimensiones | Bajo (medio día más capturas finales) | Es el material del formulario de listado |
| Prensa y voces | ADAPTAR | Testimonios por bloques | `sections/press-quotes.liquid` con bloques `quote` y `press_logo`, sin carrusel ni autoplay, cero JS | Bajo | No es requisito; cubre el parcial de testimonios |
| Comparador de ajuste y tejido | ADAPTAR | Contrato de `spec-compare`: filas en la sección, respuestas por bloque de producto, tabla real desplazable | `sections/fit-comparison.liquid` para fits o tejidos, `<table>` nativa con `scope`, sin JS | Medio | No es requisito; diferencial del tier |
| Comparador antes/después | DESCARTAR | Nada (`wall-comparison` responde a una pregunta de arte, no de moda) | No se construye | | |
| Popup de newsletter | ADOPTAR (Contour no lo tiene) | Nada de código; solo el patrón de diálogo y la lección de no tapar el LCP | `sections/newsletter-popup.liquid` en `overlay-group`, `<dialog>` nativo, retraso mínimo de 3 s, días de supresión, código con `<copy-text>` | Bajo-medio (2 días) | No es requisito; era uno de los 4 NO |
| `@app` | ADOPTAR | La necesidad, no el código (Contour también lo tiene solo en ficha y featured) | `@app` en colección, carrito, cajón, header, footer, página y artículo | Bajo (1 día) | Lo exigido ya se cumple; el resto es extensibilidad que valoran los revisores |
| Theme blocks | ADAPTAR | Nada usable (los de Contour son nominales) | `blocks/` con 5 bloques genéricos aceptados solo por las secciones nuevas y `bento-discovery` | Medio | No es requisito; diferencial |
| Higiene y proceso | ADOPTAR | `.gitattributes` LF, `.shopifyignore`, README, `DEVELOPMENT.md`, `RELEASE-NOTES.md`, `LICENSE.md`, `preconnect`, favicon de respaldo, skip link en `<nav>`, gate de pasos de `range` | Lo mismo en versión propia, más `preload` de fuentes; `theme-check:recommended` sin nada apagado hasta poder pasar a `:all` | Bajo (1 a 2 días) | Notas de versión, docs y soporte operativos son parte del envío |
| Lista de espera por talla | ADAPTAR | Aviso de vuelta a stock con `<dialog>` y `form 'contact'` etiquetado | Bloque `waitlist` visible cuando la variante elegida está agotada, `<back-in-stock>` sobre `ThemeElement`, tags `waitlist`, handle y `variant_id`, todo con `t:` | Bajo-medio | No es requisito |
| Migas de pan | ADOPTAR | Contrato de accesibilidad: `<nav aria-label>`, separador oculto, `aria-current`, objetivos de 44 px | `snippets/breadcrumbs.liquid` en voz de eyebrow, en producto, colección, artículo y página, con ajuste `show_breadcrumbs` | Bajo | No es requisito |
| Video de campaña | ADOPTAR | Fachada que no carga nada hasta pulsar | `sections/campaign-video.liquid` con póster y botón de 44 px | Bajo-medio | No es requisito |
| Movimiento e inert | ADAPTAR | Un único punto de decisión de movimiento y un dueño único del foco | `ThemeCore.motionAllowed()` y `applyBackgroundInert` movido a `ThemeCore` (hoy copiado en 4 a 6 sitios) | Bajo | No es requisito |
| View transitions | ADOPTAR el detalle | Captura del rechazo de `pageswap`/`pagereveal` hacia checkout | Revisar que no quede `InvalidStateError`; si queda, un `catch` de 6 líneas. Sin fallback con JS | Bajo | No es requisito |
| Vista grilla o lista, grupo de anuncios propio | DESCARTAR | Nada | Se mantienen el conmutador 2 / 4 columnas y el anuncio dentro de `header-group` | | |

### Lo que no se toma de Contour

| Antipatrón | Evidencia en Contour | Qué hace Sartorial |
|---|---|---|
| Recorrer `collections.all.products` en Liquid para el upsell y el bundle | `snippets/cart-drawer-contents.liquid:44`, `snippets/bundle.liquid:33` | Recomendaciones `intent=complementary` |
| Check `AssetSizeJavaScript` apagado y JS oculto al análisis estático | `.theme-check.yml:7-27`, `layout/theme.liquid:207-236` | Scripts estáticos con `defer`, ningún check apagado |
| Interactividad supeditada al FCP con fallback de 3 s | `layout/theme.liquid:224-234` | `defer` normal con un núcleo de 9 KB gz |
| CSS en 69 `{% stylesheet %}` que terminan en un bundle global de 46,5 KB gz, más JS inline en `{% javascript %}` | 69 archivos, `assets/theme.js:39-54`, `sections/announcement-bar.liquid:505` | Hojas y módulos por sección cargados desde la sección |
| Diálogos como `div role="dialog"` con bloqueo manual de `overflow` y `lenis.stop()` | `snippets/quick-buy-modal.liquid:16`, `assets/quick-buy.js:35-39` | `<dialog>` nativo con `showModal()` |
| Smooth scroll activo por defecto, pantalla de carga y cursor personalizado | `config/settings_schema.json` (`enable_smooth_scroll`), `layout/theme.liquid:96-107`, `assets/cursor.js` | Ninguno de los tres |
| `shopify://shop_images` en plantillas por defecto | `templates/index.json`, `templates/page.about.json` (6 referencias) | 0, protegido por gate |
| Paleta copiada de un sitio real por scrape | `assets/base.css:37`, `DESIGN.md:17-23` | Nada de la paleta de Contour entra |
| Textos visibles sin `t`, incluido el aviso de stock | `snippets/social-icons.liquid:4-16`, `snippets/notify-me.liquid:24, 29, 42-49` | 100 % `t:` (y arreglar las 2 cadenas de `product-technical-specs.liquid`) |
| Contraseña de las demos en documentación versionada | `DEVELOPMENT.md:7` | No replicarla en el nuevo `DEVELOPMENT.md`; la de `scripts/gate5-*.mjs` sigue siendo P0 |

### Orden recomendado

Prerrequisito: el P0 de esta auditoría (rotar y sacar la contraseña de las demos, limpiar el historial) y quitar la lógica atada al catálogo demo y las plantillas `page.documentation` y `page.support` del paquete.

| Orden | Mejora | Esfuerzo | Depende de |
|---|---|---|---|
| 1 | Higiene base (`.gitattributes`, `.shopifyignore`, README, `DEVELOPMENT.md`, `RELEASE-NOTES.md`, `LICENSE.md`, fuentes, favicon, skip link, `mailto`) | Bajo | nada |
| 2 | Gates: pasos de `range`, `shopify://` prohibido, paridad de locales, `listing.json` y PNG, `richtext` y máximo de 25 secciones | Bajo | 1 |
| 3 | `@app` en colección, carrito, cajón, header, footer, página y artículo | Bajo | nada |
| 4 | Migas de pan, inert en `ThemeCore`, `ThemeCore.motionAllowed()` | Bajo | nada |
| 5 | Partición de `theme.js`, cajón en dos fases, `featured-product` reducido | Alto | 2 |
| 6 | Partición de `base.css` con regresión visual | Alto | 5, nunca en la misma entrega |
| 7 | Quick view | Medio | 5 |
| 8 | Popup de newsletter | Bajo-medio | 5 |
| 9 | Lista de espera por talla | Bajo-medio | 5, 8 |
| 10 | Prensa y voces, comparador de ajuste, video de campaña | Medio | 6 |
| 11 | Secciones exclusivas por preset y bloques de ficha por metafields | Alto | 6, 10 |
| 12 | Theme blocks | Medio | 11 |
| 13 | Layout global por preset, `listings/` con `page.about`, demos actualizadas | Medio | 11 |
| 14 | Kit de listado y capturas | Bajo | 13 |
| 15 | Internacionalización completa | Medio | 11, 12 |

Impactan el envío de forma directa los pasos 1, 2, 5, 6, 13 y 14; el resto justifica el tier de 380 a 400 dólares.

El plan de trabajo detallado está en `claude/plan-mejoras-contour.md` del proyecto.
