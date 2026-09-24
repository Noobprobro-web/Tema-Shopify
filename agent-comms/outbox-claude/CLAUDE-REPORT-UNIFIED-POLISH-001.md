# CLAUDE-REPORT-UNIFIED-POLISH-001: Traducciones pendientes registradas y auditoría bilingüe de los 4 temas

```text
ID: CLAUDE-REPORT-UNIFIED-POLISH-001 (responde a CLAUDE-DIRECTIVE-UNIFIED-POLISH-001)
Estado: ENTREGADO CON UN HALLAZGO VISUAL. Tareas A y B hechas: 28 traducciones nuevas, 0 userErrors
  y lectura de vuelta con outdated: false en todas. Tarea C: en /es no queda texto en inglés salvo
  nombres propios, marca y fragmentos previstos; los enlaces internos conservan /es en los 4 temas;
  CLS 0 y sin desborde horizontal a 1280 y 375. Hallazgo: el titular del hero parte palabras a
  la mitad en Couture y Sartorial (/es) y en Archive (en y es) (§5). No lo corregí: es CSS.
Base: master 76104a1. Tienda leída y verificada el 2026-09-24 entre las 01:35 y las 02:00 UTC.
Decisión requerida:
  1. Gemini y Johandry: aprobar o descartar harness-UNIFIED-POLISH-001/hero-heading-proposal.diff
     (§5). Son 2 líneas de CSS en .hero-editorial__heading y, solo para Archive, content_width de
     30 a 45 en listings/archive/templates/index.json. Sin eso, "movimient|o" y "rememb|ered"
     siguen partidos. En Couture ese titular afecta al tema publicado.
  2. Gemini: añadir al diccionario la entrada de by_text de
     harness-UNIFIED-POLISH-001/presets-secondary-url/by_text-entry-proposed.json
     ("/collections" -> "/es/collections"). Ya está registrada en la tienda (D2); con la entrada,
     el script la vuelve a generar sin copia temporal.
Resumen en 5 líneas:
  1. Tarea A (Couture): 8 traducciones del lote couture-gaps, 0 userErrors. Digests releídos antes de
     mandar: los 8 seguían iguales. Contacto, Soporte, FAQ y los 2 botones de la portada salen en español.
  2. Tarea B (presets): 10 etiquetas (3, 3 y 4) más 7 URL que el script genera con la regla de /es
     del diccionario (D1), y 3 URL del botón secundario del hero (D2). 20 traducciones, 0 userErrors.
  3. Lectura de vuelta de 32 recursos (8 por tema): 705 traducciones es, 0 con outdated: true y
     0 sin clave viva. Sin traducir solo quedan imágenes, "Catalog" del menú, las anclas, el bloque
     de código, los nombres de preset en documentation de los presets y "Material" en Edition.
  4. /es: 24 páginas (portada + 5 páginas por tema) en español; 862 enlaces internos, todos con
     /es; clic real en la tarjeta del mega menú lleva a /es/collections/all.
  5. Visual: 16 cargas (4 temas x / y /es x 1280 y 375): CLS 0, sin desborde horizontal y todas las
     imágenes cargan. Titular partido en 7 de las 16 (§5).
Archivos tocados: ninguno del tema ni del diccionario. En agent-comms: este informe y
  harness-UNIFIED-POLISH-001/. No hice commit ni push ni toqué el ledger.
Desviaciones (Nivel 1 o Nivel 2):
  D1 (Nivel 1). La directiva pedía 10 traducciones en los presets. Al declarar los botones, el
    index.json de los presets también declaró sus URL (manifesto.button_url y discovery.*.link).
    El script, con el diccionario del repo, genera para ellas "/es/collections/all", igual que para
    las URL que ya estaban traducidas (hero.button_primary_url, discovery.collection.link). Registré
    esas 7 junto con las 10 etiquetas. Se puede revertir.
  D2 (Nivel 1). Con el index.json nuevo, el botón secundario del hero de los 3 presets enlazaba a
    /collections en /es y sacaba al cliente del idioma. Antes, con el valor por defecto del esquema,
    salía /es/collections. El diccionario no tiene entrada para "/collections". Generé la traducción
    con el mismo script apuntando a una copia temporal del diccionario (--data, fuera del repo, con
    una entrada más) y la registré en los 3: "/es/collections". Después, el enlace sale con /es.
Hallazgos extra fuera de alcance (con parche listo):
  H1. Titular del hero partido a mitad de palabra (§5). Parche: hero-heading-proposal.diff, no aplicado.
Verificación (comando, resultado y qué demuestra/qué no): §2, §3 y §4.
Lista de afirmaciones falsables numeradas: §6.
```

---

## 1. Tareas A y B: registro en la tienda

Todo con `translationsRegister` por el conector de Shopify Admin, después de validar la operación con `validate_graphql_codeblocks`.

```text
Tema        Recurso        Traducciones nuevas                                            userErrors
Couture     index          brand_manifesto.button_label, bento_editorial.link_label       []
Couture     page.contact   main.eyebrow, main.intro, main.studio_hours, main.showroom_address []
Couture     page.faq       main.cta.button_url (/es/pages/contact)                        []
Couture     page.support   main.sla                                                       []
Sartorial   index          hero.button_secondary_label (Explora el lookbook), manifesto.button_label,
                           discovery.story.link_label + 2 URL + hero.button_secondary_url     []
Edition     index          hero.button_secondary_label (Ver colecciones), manifesto.button_label,
                           discovery.story.link_label + 2 URL + hero.button_secondary_url     []
Archive     index          hero.button_secondary_label (Explora el lookbook), manifesto.button_label,
                           discovery.story1/story2.link_label + 3 URL + hero.button_secondary_url []
Total: Couture 8, presets 10 etiquetas + 7 URL (D1) + 3 URL (D2) = 28
```

Cómo:

1. Couture: releí `translatableContent { key digest }` de index, contact, faq y support. Los 8 digests del lote `harness-PRESETS-I18N-001/couture-gaps/batch-1.variables.json` seguían iguales y sin traducción. Mandé ese lote tal cual.
2. Presets: leí el index vivo de los 3 temas (el que desplegó Gemini). Las claves nuevas y sus digests están en `presets-labels/snapshot-new-keys.json`. Luego ejecuté `node scripts/translate-storefront.mjs --snapshot ... --theme-id <tema> --emit ...` con el diccionario del repo (md5 24ff54ca, commit e18351d). Resultado: 5, 5 y 7 traducciones, 0 desfasadas. "Browse collections" de Edition coincide con la entrada nueva de by_text ("Ver colecciones").
3. Botón secundario (D2): `--data ~/wpi18n/up/es.storefront.plus-collections.json` (el diccionario del repo con una entrada más en by_text) y `snapshot-secondary-url.json`: 1 traducción por tema, 0 desfasadas. `--check` con esa copia: 0 problemas.

---

## 2. Lectura de vuelta

`translatableResourcesByIds` sobre 32 recursos: index, page.about, page.contact, page.faq, page.support, page.documentation, product y header-group de los 4 temas. Resumen en `readback-2026-09-24.json`.

```text
Tema        traducciones es   outdated: true   es sin clave viva
Couture          189                0                 0
Sartorial        177                0                 0
Edition          163                0                 0
Archive          176                0                 0
```

Los 25 valores nuevos de A y B coinciden con lo enviado. Los 3 de D2 (`hero.button_secondary_url`) se confirmaron en una segunda lectura del index de los presets, todos con `outdated: false`.

Claves traducibles sin `es`, todas a propósito:

- Imágenes (`FILE_REFERENCE`) en index y header-group.
- `mega_menu_promo_catalog.menu_item` = "Catalog". El snippet busca el bloque por ese nombre.
- En page.documentation de los 3 presets: las anclas, el bloque de código y los nombres de preset. En Couture están registradas con el mismo valor.
- `manifesto.material.label` = "Material" en Edition, que es igual en español.

Qué no demuestra: la lectura de vuelta dice que la traducción existe y está al día. Si se ve bien, lo dice §3.

---

## 3. Verificación bilingüe en vivo (Tarea C, puntos 1 a 3)

Método: `harness-PRESETS-I18N-001/live-probes-es.js` (`__grab`/`__cmp`) en la pestaña del storefront con la sesión abierta. Cada ruta se pide con `?preview_theme_id=<tema>` en inglés y en /es, y se comprueba el tema que la sirve (`Shopify.theme` del HTML).

### 3.1 Textos iguales al inglés en /es (nodos de texto de `<main>`)

```text
Ruta                 Couture                    Sartorial   Edition     Archive
/                    F04 Colour and Size Knit   (ninguno)   Material    LINEA NOVE
/pages/about         (ninguno)                  (ninguno)   (ninguno)   (ninguno)
/pages/contact       Showroom                   Showroom    Showroom    Showroom
/pages/faq           (ninguno)                  (ninguno)   (ninguno)   (ninguno)
/pages/support       (ninguno)                  (ninguno)   (ninguno)   (ninguno)
/pages/documentation Sartorial-1.0.0.zip y 5 nombres de sección del editor; en los presets,
                     además, los nombres Sartorial, Edition y Archive
```

Todos son previstos:

- "F04 Colour and Size Knit" es un nombre de producto (catálogo QA).
- "LINEA NOVE" es la marca.
- "Showroom" sale de `locales/es.json`, que también dice Showroom.
- Los nombres de sección son los del editor, que está en inglés.

Header y footer de la portada en /es: solo coinciden "LINEA NOVE" y "© 2026 LINEA NOVE".

Antes de esta tarea, Couture tenía en inglés "Contact / Private client services", la intro, el horario, "By appointment / Milan", el tiempo de respuesta de Soporte, "Read our process" y "Explore the story". Los presets tenían en inglés los 3 botones. Ya no sale ninguno de esos textos.

### 3.2 Botones de la portada en /es

```text
Couture    Descubre la colección -> /es/collections/all | Explora la serie -> /es/collections/the-autumn-series
           Conoce nuestro proceso -> /es/pages/about
Sartorial  Descubre la colección -> /es/collections/all | Explora el lookbook -> /es/collections
           Conoce nuestro proceso -> /es/collections/all
Edition    Ver todos los objetos -> /es/collections/all | Ver colecciones -> /es/collections
           Conoce nuestro proceso -> /es/collections/all
Archive    Entra en el catálogo -> /es/collections/all | Explora el lookbook -> /es/collections
           Conoce nuestro proceso -> /es/collections/all
```

"Descubre la historia" (bento) sale en los 4 temas, y "Explore the story" ya no aparece en /es. Antes de D2, el botón secundario de los 3 presets enlazaba a `/collections`.

### 3.3 Locale en los enlaces

Revisé todos los `a[href^="/"]` de la portada y de las 5 páginas en /es, incluidos header, mega menú y footer. Son 229 enlaces en Couture, 213 en Sartorial, 213 en Edition y 207 en Archive. Ninguno sale sin `/es`. Las dos tarjetas del mega menú apuntan a `/es/collections/all` en los 4 temas.

Hice además un clic real en Sartorial /es: al abrir "Catálogo" y pulsar la tarjeta "Novedades" se navega a `/es/collections/all` (título "Productos", locale es).

---

## 4. Estado visual (Tarea C, punto 4)

Método: `live-audit-visual.js`. Navegué de verdad a cada combinación, con la ventana emulada a 1280 x 800 y a 375 x 812 (móvil). Por cada carga:

- Sumé las entradas `layout-shift` sin interacción al cargar y tras recorrer la página dos veces.
- Comparé el ancho del documento con el de la ventana.
- Comprobé que las imágenes de `<main>` cargan.
- Detecté saltos de línea dentro de una palabra, midiendo carácter a carácter con `Range.getClientRects`.

```text
                 1280 x 800                              375 x 812
                 CLS   desborde  imágenes  palabra rota  CLS   desborde  imágenes  palabra rota
Couture   /      0     no        23/23     no            0     no        23/23     no
Couture   /es    0     no        23/23     SÍ            0     no        23/23     SÍ
Sartorial /      0     no        15/15     no            0     no        15/15     no
Sartorial /es    0     no        15/15     SÍ            0     no        15/15     SÍ
Edition   /      0     no        14/14     no            0     no        14/14     no
Edition   /es    0     no        14/14     no            0     no        14/14     no
Archive   /      0     no        11/11     SÍ            0     no        11/11     SÍ
Archive   /es    0     no        11/11     SÍ            0     no        11/11     no
```

Imágenes: el panel del navegador está oculto, así que las imágenes `loading="lazy"` no se piden al hacer scroll. Por eso, a las que quedaban pendientes les pasé `loading="eager"` en mi pestaña y esperé el evento: cargaron todas, sin ningún error. La imagen del hero de Couture es `loading="eager"` y `fetchpriority="high"`. Esto demuestra que las URL existen y decodifican. No demuestra el momento exacto en que carga cada imagen lazy en un navegador visible. La captura de Sartorial /es a 375 muestra el hero con su foto y los dos botones en español.

---

## 5. H1: titular del hero partido a mitad de palabra

```text
Tema / ruta         Ancho   Líneas que se ven                          Tamaño   Ancho del h1
Couture /es         1280    La forma en | movimient | o sereno         75,6px   481px
Couture /es         375     La forma | en | movimient | o sereno       46,2px   288px
Sartorial /es       1280    igual que Couture (mismo texto y ancho)
Sartorial /es       375     igual que Couture
Archive /           1280    Objects | with a | rememb | ered life      79,2px   380px
Archive /           1440    Objects | with a | remembe | red life      79,2px
Archive /           375     Objects | with a | remember | ed life      48,4px   288px
Archive /es         1280    ... recordad | a                           79,2px   380px
Couture y Sartorial /es a 1440, Edition en todos los casos: sin palabras partidas.
```

Causa: `body { overflow-wrap: anywhere; }` (`assets/base.css`, regla `body`). La hereda `.hero-editorial__heading`, que tiene `max-width: 11ch`. Con `anywhere`, el navegador puede partir una palabra por cualquier letra cuando no cabe, y el ancho mínimo del titular deja de respetar la palabra más larga. En español, "movimiento" no cabe a 1280 ni a 375. En Archive, el bloque de texto mide el 30 % del ancho (`content_width: 30`) y a 79 px "remembered" tampoco cabe, ni en inglés.

Lo probé en mi pestaña inyectando CSS, sin tocar la tienda:

```text
Propuesta                                            Couture /es 375       Couture /es 1280     Archive / 375        Archive / 1280
overflow-wrap: break-word + tope 10.5vw en móvil     movimiento entera     movimiento entera*   remembered entera    se sale 151px del bloque
  + Archive content_width 45                          -                     -                    -                    remembered entera, 0px fuera
hyphens: auto                                        sin efecto: este Chromium no tiene diccionario de guiones
* el texto sobresale 1 px de la caja del h1, dentro del hero; no se nota ni crea scroll.
```

`hero-heading-proposal.diff`, no aplicado, tiene dos partes:

1. `assets/base.css`, en `.hero-editorial__heading`: `font-size: min(3.25rem, calc(2.75rem * var(--font-heading-scale)), 10.5vw)` y `overflow-wrap: break-word`. La regla de escritorio (`@media (min-width: 62rem)`) sigue fijando el tamaño a partir de 992 px, así que el tope de 10.5vw solo actúa en móvil. Entre 768 y 991 px, 10.5vw es mayor que 3.25rem y no cambia nada. Esta rama no la medí.
2. `listings/archive/templates/index.json`, hero: `content_width` de 30 a 45. Es un cambio de diseño del preset, y Johandry pidió no cambiar nada. Por eso es decisión suya. Sin él, Archive a 1280 sigue partiendo "remembered" o, con la parte 1, el titular se sale del bloque centrado.

`git apply --check` pasa en la carpeta. Toca CSS del tema, así que es Nivel 2 y necesita la autorización de Gemini.

---

## 6. Afirmaciones falsables

1. `translatableResourcesByIds` sobre los 32 recursos de §2 devuelve 189, 177, 163 y 176 traducciones es (Couture, Sartorial, Edition, Archive), ninguna con `outdated: true`.
2. En Couture, `section.page.contact.json.main.eyebrow` tiene la traducción "Contacto / Atención a clientes privados" y `section.page.faq.json.main.cta.button_url` tiene "/es/pages/contact".
3. En el index de Edition, `hero.button_secondary_label` tiene "Ver colecciones". En Sartorial y Archive tiene "Explora el lookbook". En los 3, `hero.button_secondary_url` tiene "/es/collections".
4. En /es/?preview_theme_id=<cualquiera de los 4>, ningún enlace interno de la portada ni de las 5 páginas sale sin prefijo /es.
5. En /es/pages/contact de Couture no aparecen "Contact / Private client services" ni "By appointment / Milan".
6. En la portada /es de los 3 presets no aparecen "Explore lookbook", "Browse collections", "Read our process" ni "Explore the story".
7. A 375 px, en /es/?preview_theme_id=165809488115, el h1 del hero se pinta en 4 líneas y la tercera es "movimient".
8. Con `overflow-wrap: break-word` y el tope de 10.5vw, esa misma h1 se pinta "La forma en | movimiento | sereno" sin salirse de su bloque.
9. `node scripts/translate-storefront.mjs --snapshot agent-comms/outbox-claude/harness-UNIFIED-POLISH-001/presets-labels/snapshot-new-keys.json --theme-id 166187041011 --emit <dir>` genera 7 traducciones idénticas a `presets-labels/emit-166187041011.variables.json`.
10. `git status` no muestra cambios míos fuera de `agent-comms/outbox-claude/`.

Al terminar dejé la vista del navegador en su tamaño normal y la sesión en Couture: `/` y `/es/` sin parámetro devuelven Couture.

## 7. Material

`agent-comms/outbox-claude/harness-UNIFIED-POLISH-001/`:

```text
presets-labels/snapshot-new-keys.json            claves y digests nuevos leídos en vivo (3 index)
presets-labels/emit-<tema>.variables.json         lo que generó el script por tema
presets-labels/variables-sent.json + emit.graphql lo enviado (una mutación con 3 alias)
presets-secondary-url/                            instantánea, lote y entrada de by_text propuesta (D2)
readback-2026-09-24.json                          lectura de vuelta por recurso (32)
live-audit-visual.js                              auditoría visual de §4
hero-heading-proposal.diff                        propuesta de §5 (no aplicada)
```

El lote de Couture es `harness-PRESETS-I18N-001/couture-gaps/batch-1.*`, enviado tal cual.
