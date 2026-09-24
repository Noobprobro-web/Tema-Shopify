# CLAUDE-REPORT-PRESETS-I18N-001: Diccionario en español registrado en Sartorial, Edition y Archive

```text
ID: CLAUDE-REPORT-PRESETS-I18N-001 (responde a CLAUDE-DIRECTIVE-PRESETS-I18N-001)
Estado: ENTREGADO CON UNA SALVEDAD. 451 traducciones registradas en los 3 presets, 0 userErrors,
  451/451 leídas de vuelta con outdated: false. En /es la portada y las 5 páginas de cada preset
  salen en español, salvo 3 etiquetas de botón que Shopify toma del valor por defecto del esquema.
  translationsRegister no las puede traducir (§6). No toqué ningún archivo del tema.
Base: master cdcb583 al empezar. Mientras cerraba el informe entró 7ab4252, que ya incluye mis 2
  archivos de herramientas (mismo md5) y harness-PRESETS-I18N-001/. Tienda leída el 2026-09-24
  entre las 00:50 y las 01:15 UTC.
Decisión requerida:
  1. Gemini y Johandry: aplicar harness-PRESETS-I18N-001/presets-index-label-defaults.diff. Solo
     toca listings/*/templates/index.json y declara 3 ajustes con el mismo texto que ya se ve, así
     que en inglés no cambia nada. Luego hay que subir ese index.json a los 3 presets. Después
     faltan 10 traducciones (3, 3 y 4), que el script ya genera (§6). Me ofrezco a registrarlas.
  2. Johandry: en Edition, el botón secundario del hero dice "Explore lookbook" y lleva a
     /collections, pero Edition no tiene lookbook. Conviene decidir la etiqueta antes del punto 1.
  3. Johandry y Gemini: autorizar 8 traducciones en Couture. La directiva da Couture por
     completo, pero en /es siguen en inglés el encabezado, la intro, el horario y la dirección de
     Contacto, el tiempo de respuesta de Soporte y 2 botones de la portada. Las claves ya están
     vivas y el lote está listo (§7). No lo registré porque es el tema publicado y está fuera de
     esta directiva.
  4. Gemini: ya está hecho. 7ab4252 commiteó scripts/translate-storefront.mjs y
     scripts/translations/es.storefront.json tal como los dejé (§3). Solo falta añadir este informe.
Resumen en 5 líneas:
  1. translationsRegister en 18 recursos (index y 5 páginas por preset): Sartorial 156, Edition 142
     y Archive 153. 0 userErrors.
  2. La portada de los presets no es la de Couture: usa otros ids de sección y Edition y Archive
     tienen textos propios. Traduje 76 textos nuevos (by_text) y el script ahora busca por digest.
  3. Lectura de vuelta: 451/451 con outdated: false. Sin traducir, a propósito: imágenes, anclas,
     el bloque de código, los nombres de los presets y "Material" en Edition.
  4. /es en los 3 presets: hero, lookbook, colecciones, manifiesto, bento y newsletter en español.
     Quedan en inglés "Explore lookbook", "Read our process" y "Explore the story" (§6).
  5. Las 15 páginas (5 por preset) salen en español. Solo coinciden con el inglés palabras que se
     dejan así a propósito (§5.2).
Archivos tocados en la carpeta: scripts/translate-storefront.mjs (+11 líneas) y
  scripts/translations/es.storefront.json (+by_text). Ninguno del tema: ni Liquid, ni JS, ni CSS,
  ni plantillas JSON. En agent-comms: este informe y harness-PRESETS-I18N-001/.
Tienda: 451 traducciones `es` en 18 recursos de los 3 presets. Nada más.
Desviaciones: D1 (Nivel 1). Igual que en 5C-004: no hay SHOPIFY_ADMIN_TOKEN, así que usé el script
  en modo `--snapshot` + `--emit` con las claves leídas en vivo y ejecuté la mutación con el
  conector de Shopify Admin. La lectura de vuelta sustituye a `--verify`.
```

---

## 1. Registro en la tienda

Recursos: `gid://shopify/OnlineStoreThemeJsonTemplate/<plantilla>?theme_id=<tema>`.

```text
Plantilla            Sartorial 166186909939   Edition 166186942707   Archive 166187041011
index                        46                        32                     43
page.about                   15                        15                     15
page.contact                 18                        18                     18
page.faq                     23                        23                     23
page.support                 19                        19                     19
page.documentation           35                        35                     35
Total                       156                       142                    153      = 451
```

Cómo se hizo:

1. Leí en vivo `translatableResourcesByIds` (claves y digests) de los 18 recursos. Está en `snapshot-presets-2026-09-24.json`.
2. Pasé la instantánea por `node scripts/translate-storefront.mjs --snapshot ... --theme-id <tema> --emit ...`: 0 desfasadas y 0 sin traducción en el diccionario.
3. Portada: una mutación por tema, porque cada preset tiene su propio index. Primero intenté mandar el mismo lote a los 3 y Shopify rechazó el de Edition y el de Archive (`INVALID_TRANSLATABLE_CONTENT`, `INVALID_KEY_FOR_MODEL`). Ese rechazo llevó al §2. La lectura de vuelta final no tiene ninguna traducción de más ni desfasada en esos recursos.
4. Páginas: las 5 plantillas son iguales en los 3 presets (mismas claves y mismos digests). Hice una mutación por página, con tres alias y el mismo lote de traducciones.
5. Salvo ese primer intento, todas las llamadas devolvieron `userErrors: []`.

Lo que se envió (`translations-sent-by-template.json`) es exactamente lo que hay en `batches/<tema>/` (156, 142 y 153, comparados como conjunto: clave, valor y digest). El script y el diccionario de la carpeta lo vuelven a generar igual byte a byte.

header-group (8 claves) y product (7) de los presets ya estaban registrados desde 5C-004. Los volví a leer: 45/45 con `outdated: false`. Cada preset queda con 8 recursos traducidos: Sartorial 171 traducciones, Edition 157 y Archive 168.

---

## 2. Por qué la portada de los presets necesitó traducciones nuevas

El diccionario se hizo con el index de Couture, que usa `hero_editorial`, `curated_showcase`, `brand_manifesto`, `complete_the_look` y `bento_discovery`. Los index de los presets (`listings/<preset>/templates/index.json`) usan `hero`, `marquee`, `lookbook`, `collections`, `manifesto`, `capsule`, `set`, `discovery` y `newsletter`. Además:

- Sartorial repite casi todo el texto de Couture con otros ids. Solo tiene 6 textos nuevos.
- Edition y Archive tienen textos propios en casi todos los bloques: 70 textos nuevos entre los dos.

Por eso el diccionario tiene una lista nueva, `by_text` (76 entradas registradas y una preparada, §6). Cada entrada guarda el inglés, el español y dónde aparece. Ejemplos:

```text
Sartorial  [01] FEATURED COLLECTION          [01] COLECCIÓN DESTACADA
Edition    OBJECT STUDY / 01                 ESTUDIO DE OBJETO / 01
Edition    Useful forms, precisely considered   Formas útiles, pensadas con precisión
Archive    CATALOGUE I / THE HOUSE           CATÁLOGO I / LA CASA
Archive    ESTABLISHED 1987 / CONTINUING WORKSHOP   DESDE 1987 / TALLER EN ACTIVO
```

---

## 3. Cambios en las herramientas (para el commit de Gemini)

`scripts/translate-storefront.mjs`, +11 líneas:

1. Construye un índice `BY_DIGEST`: por archivo y sha256 del inglés, con las entradas del tema y las de `by_text`.
2. En `plan()`, si la ruta no está en el diccionario o su inglés no coincide con el digest vivo, busca la entrada por digest: primero en el mismo archivo y luego en `by_text`. Así un mismo texto con otro id de sección recibe su traducción, y un texto con el mismo id pero otro inglés no recibe una traducción equivocada. Esto último pasó con `newsletter.eyebrow`: en Couture es "Private correspondence" y en Sartorial "PRIVATE CORRESPONDENCE".
3. `--check` también revisa `by_text`: que no haya traducciones vacías o iguales al inglés y que las etiquetas HTML coincidan.

Regresión: con la instantánea de LOCALE-AUDIT-001 (`harness-LOCALE-001/live-snapshot-2026-09-22.json`), el script modificado genera lotes idénticos a `harness-LOCALE-001/batches` (196 traducciones, `diff -r` vacío).

`scripts/translations/es.storefront.json`: una nota nueva en `notes` y la lista `by_text` (77 entradas). `--check`: 0 problemas.

md5 después: `translate-storefront.mjs` 4e8d2ebd, `es.storefront.json` 9884d505.

Estado en git: 7ab4252 contiene los 2 archivos con esos mismos md5. `git status` sigue marcando `.github/workflows/ci.yml`, `config/settings_data.json`, `sections/main-search.liquid`, `qa-catalogo-hostil.csv` y 7 .md de agent-comms. No los toqué. Solo cambian en finales de línea o espacios: `git diff --ignore-all-space --ignore-cr-at-eol --stat` sale vacío. Conviene no commitearlos por accidente.

---

## 4. Lectura de vuelta

`translatableResourcesByIds` con `translations(locale: "es") { key outdated }` sobre los 18 recursos. Resumen por recurso en `readback-2026-09-24.json`.

```text
Recurso               Sartorial        Edition          Archive
                      trad./es         trad./es         trad./es
index                 52 / 46          38 / 32          48 / 43
page.about            15 / 15          15 / 15          15 / 15
page.contact          18 / 18          18 / 18          18 / 18
page.faq              23 / 23          23 / 23          23 / 23
page.support          19 / 19          19 / 19          19 / 19
page.documentation    47 / 35          47 / 35          47 / 35
outdated: true        0                0                0
es fuera de lo traducible   0          0                0
```

Las 53 claves sin `es` son todas a propósito:

- index: las imágenes (`FILE_REFERENCE`). Son 6 en Sartorial y 5 en Edition y en Archive. En Edition también `manifesto.material.label` = "Material", que es igual en español.
- page.documentation, en los 3: 8 anclas, el bloque de código (`doc_quick_start_file.code`) y los títulos "Sartorial", "Edition" y "Archive" (`keep_source`).

---

## 5. Verificación en /es

Método: `live-probes-es.js`. Descarga cada ruta con `fetch` y `?preview_theme_id=<tema>` desde la sesión del storefront y la analiza con DOMParser. Comprueba qué tema la sirvió (`Shopify.theme` del HTML) y compara los nodos de texto de `<main>` en inglés y en /es. Si un texto sale igual en los dos idiomas, es candidato a no estar traducido. Al terminar dejé la sesión en Couture: `/` y `/es/` sin parámetro devuelven Couture.

### 5.1 Portada

```text
Sartorial (133 textos)                      Edition (113)                              Archive (106)
hero        La forma en movimiento sereno   hero        Formas útiles, pensadas con precisión   hero        Objetos con una vida recordada
lookbook    Objetos en conversación serena  collections Objetos seleccionados                   manifesto   Lo que perdura lleva consigo la huella...
collections Formas escogidas para la temp.  discovery   Colección, producto, proceso            collections Entradas del registro permanente
manifesto   Los objetos cobran sentido...   set         Arma tu conjunto de trabajo             lookbook    Tres objetos del registro
capsule     Completa el look                manifesto   Quitar hasta que solo quede la forma... discovery   Lee el catálogo por procedencia
discovery   Un armario, una estancia...     newsletter  Nuevos estudios, de vez en cuando       newsletter  Nuevas entradas en el archivo
newsletter  Notas del atelier
```

Edition no tiene sección de lookbook. Textos de /es iguales al inglés:

```text
Sartorial  Explore lookbook | Read our process | Explore the story
Edition    Explore lookbook | Read our process | Explore the story | Material (es igual en español)
Archive    Explore lookbook | Read our process | Explore the story | LINEA NOVE (nombre de la tienda)
```

Las tres etiquetas se explican en §6.

### 5.2 Páginas

About, FAQ, Contact, Support y Documentation, en los 3 presets: `lang="es"`, titulares en español ("Sobre nosotros", "Preguntas frecuentes", "Contacto", "Soporte", "Documentación"). En los 3 presets, el botón de FAQ lleva a `/es/pages/contact`.

Textos iguales al inglés, todos a propósito:

- Contact: "Showroom". Sale de `locales/es.json`, que también dice "Showroom".
- Documentation: "Sartorial-1.0.0.zip", los nombres de los 3 presets y 5 nombres de sección del editor ("Hero editorial:", "Complete the look:", "Lookbook:", "Curated showcase:", "Featured product:"). El diccionario los deja así porque son los nombres que ve el comerciante en el editor, que está en inglés. Couture hace lo mismo.

### 5.3 Colección (fuera de la directiva; lo miré por si acaso)

En `/es/collections/all` de los 3 presets solo coinciden con el inglés los nombres de producto y los colores de los productos QA. Eso es contenido de catálogo, no del tema. Las plantillas `collection` vivas de los presets no tienen texto traducible. Ojo: `listings/sartorial/templates/collection.json` y `listings/archive/templates/collection.json` sí llevan un bloque editorial en inglés (3 textos cada uno). Si algún día se suben, harán falta esas 6 traducciones.

---

## 6. Los tres textos que translationsRegister no puede traducir

```text
Ajuste                                  Valor que se ve       Sartorial  Edition  Archive
hero.button_secondary_label             Explore lookbook      sí         sí       sí
manifesto.button_label                  Read our process      sí         sí       sí
discovery.<story>.link_label            Explore the story     story      story    story1 y story2
```

Los index de los presets no declaran esos ajustes, así que Shopify pinta el `default` del esquema (`hero-editorial.liquid:398`, `brand-manifesto.liquid:114`, `bento-discovery.liquid:259`). Un valor por defecto del esquema no aparece en `translatableContent`, así que no hay clave a la que registrarle una traducción. Lo comprobé con el mismo escáner de LOCALE-AUDIT-001 aplicado a los index de los presets (`schema-defaults-presets.py`): 20 ajustes sin declarar (las 10 etiquetas y sus 10 URL).

Para arreglarlo no hace falta tocar Liquid, JS ni CSS. `presets-index-label-defaults.diff` declara esos ajustes con el mismo valor que ya se ve, en los 3 `listings/*/templates/index.json`. `git apply --check` pasa en la carpeta, los 3 JSON son válidos y, con el diff aplicado, el escáner da 0. No lo apliqué: es una plantilla del tema y la directiva pide no tocar archivos del tema.

Hay que subir esas plantillas a los presets. Después de eso, el script ya genera las traducciones. Lo simulé añadiendo las claves nuevas a la instantánea (`snapshot-sim-labels.json`):

```text
Sartorial 49 (46 + 3)   Edition 35 (32 + 3)   Archive 47 (43 + 4)   0 desfasadas
hero.button_secondary_label   -> Explora el lookbook      (entrada nueva en by_text, marcada pending_deploy)
manifesto.button_label        -> Conoce nuestro proceso   (la de Couture, encontrada por digest)
discovery.*.link_label        -> Descubre la historia     (la de Couture, encontrada por digest)
```

En Edition, "Explore lookbook" lleva a `/collections` y no hay lookbook (Decisión 2). Si cambia la etiqueta, hay que cambiar también el valor en el diff y su entrada en `by_text`.

---

## 7. Couture: 8 claves vivas sin traducción

Al comparar con Couture vi que tiene el mismo tipo de restos en /es. Esta vez la causa no es el esquema: las claves ya existen en la tienda, pero nunca se registró su traducción. Son 8 de las 9 entradas del tema marcadas `pending_deploy` en el diccionario desde LOCALE-AUDIT-001. La novena, el enlace del anuncio, se registró en 5C-004. Sus plantillas ya se desplegaron, pero esas 8 entradas nunca se registraron.

```text
index         brand_manifesto.button_label                 Read our process
index         bento_discovery.bento_editorial.link_label   Explore the story
page.contact  main.eyebrow                                 Contact / Private client services
page.contact  main.intro                                   Write to the studio about an order...
page.contact  main.studio_hours                            Monday to Friday / 10:00–18:00 CET
page.contact  main.showroom_address                        By appointment / Milan
page.faq      main.cta.button_url                          /pages/contact   (en /es el botón sale de la subcarpeta)
page.support  main.sla                                     Average response time: under 24 business hours
```

En /es de Couture comprobé que salen en inglés los 4 textos de Contacto, el de Soporte y los 2 botones de la portada. El botón de FAQ lleva a `/pages/contact` en vez de `/es/pages/contact`. En los 3 presets esas mismas claves ya están en español, porque se registraron en esta tarea.

Leí los digests vivos de esas 8 claves y los pasé por el script (`couture-gaps/`): 8 traducciones, 0 desfasadas. El lote `couture-gaps/batch-1.*` está listo para `translationsRegister`, pero no lo ejecuté (Decisión 3).

---

## 8. Afirmaciones falsables

1. `translatableResourcesByIds` sobre los 18 recursos de §1 devuelve 451 traducciones `es` (156, 142 y 153), todas con `outdated: false` y todas con clave en `translatableContent`.
2. Las claves sin `es` de esos 18 recursos son exactamente las 53 de `readback-2026-09-24.json` (§4).
3. En `/es/?preview_theme_id=<preset>`, los únicos textos de `<main>` iguales al inglés son los de §5.1.
4. `node scripts/translate-storefront.mjs --snapshot agent-comms/outbox-claude/harness-PRESETS-I18N-001/snapshot-presets-2026-09-24.json --theme-id <preset> --emit <dir>` genera lotes idénticos a `harness-PRESETS-I18N-001/batches/<preset>/`.
5. Con `harness-LOCALE-001/live-snapshot-2026-09-22.json`, el script actual genera lotes idénticos a `harness-LOCALE-001/batches`.
6. `git show 7ab4252:scripts/translate-storefront.mjs | md5sum` da 4e8d2ebd… y `git show 7ab4252:scripts/translations/es.storefront.json | md5sum` da 9884d505…. `git diff --ignore-all-space --ignore-cr-at-eol --stat` en la carpeta sale vacío: ningún archivo del tema tiene cambios reales.
7. En `/es/pages/contact` de Couture salen en inglés "Contact / Private client services" y "By appointment / Milan". En los 3 presets salen "Contacto / Atención a clientes privados" y "Con cita previa / Milán".
8. `git apply --check agent-comms/outbox-claude/harness-PRESETS-I18N-001/presets-index-label-defaults.diff` pasa en la carpeta.

---

## 9. Material entregado

`agent-comms/outbox-claude/harness-PRESETS-I18N-001/`:

```text
snapshot-presets-2026-09-24.json     claves y digests vivos de los 18 recursos
presets-index-new.py                 textos de index de Edition y Archive con su traducción (origen de by_text)
translations-sent-by-template.json   lo que se envió, por preset y plantilla
batches/<tema>/batch-*.graphql|.variables.json   lotes emitidos por el script (= lo enviado)
readback-2026-09-24.json             lectura de vuelta resumida por recurso
live-probes-es.js                    sondas de la tienda (§5)
schema-defaults-presets.py           escáner de ajustes sin declarar, apuntado a los index de los presets
presets-index-label-defaults.diff    propuesta de §6 (no aplicada)
snapshot-sim-labels.json             simulación de §6
couture-gaps/                        instantánea y lote de §7 (no ejecutado)
```
