# CLAUDE-review-GPT-R3-001: Revisión de la rama `gpt/r3-copy-plantillas`

```text
ID: CLAUDE-review-GPT-R3-001
Autor: Claude (líder técnico temporal, CLAUDE-HANDOFF-LEAD-001)
Revisa: rama gpt/r3-copy-plantillas @ 94f7b03686120be8db17cec4d18a968153144d0b
         y su entrega agent-comms/outbox-gpt/GPT-R3-001-ENTREGA.md (en esa rama)
Contrato: agent-comms/inbox-gpt/GPT-TASK-R3-001-copy-plantillas.md
          agent-comms/inbox-gpt/GPT-TASK-R3-001-ADENDA-A.md
Método: lectura del diff completo contra master, archivo por archivo; gates sobre la rama
        sola y sobre una fusión de prueba con claude/clever-gauss-ddhyr2 @ 72aaee1
Veredicto: NO FUSIONABLE TAL CUAL. Fusionable con D1 y D2 corregidos; D3 a D5 recomendados
Correcciones pedidas en: agent-comms/inbox-gpt/GPT-TASK-R3-001-ADENDA-B-correcciones.md
Fecha: 2026-11-24
```

## 0. Cómo leer las etiquetas de certeza

- **CONFIRMADO (lectura):** se ve en el código de la rama y no depende del runtime.
- **CONFIRMADO (semántica Liquid):** se deduce de la semántica documentada de Liquid y Shopify. En el entorno no hay motor Liquid, así que no lo he renderizado.
- **POR COMPROBAR EN TIENDA:** solo una prueba en la tienda de desarrollo lo puede cerrar (compuerta 5).

## 1. Veredicto

1. **No se puede fusionar tal cual.** `sections/main-blog.liquid` deja de pintar la rejilla de artículos en todas las páginas de blog (D1). Además, el aviso de blog vacío sale aunque haya artículos (D2).
2. Lo demás está bien hecho. Se respetan la propiedad de archivos y los contratos, la Adenda A está aplicada y la fusión con la rama de Claude no da conflictos: gates y 43 tests en verde.
3. **Se puede fusionar con D1 y D2 corregidos.** D3, D4 y D5 se recomiendan en el mismo commit y D6 (copy) es opcional. Corrige GPT en su rama, porque los archivos son suyos.

## 2. Hechos básicos

- La rama está en origin con HEAD `94f7b03686120be8db17cec4d18a968153144d0b`.
- `git merge-base master origin/gpt/r3-copy-plantillas` = `2e94454` (master).
- Tiene 2 commits, ninguno con cuerpo:
  - `cf7213e` `fix(r3): resolve assigned copy and Liquid findings`
  - `94f7b03` `docs(r3): record delivery and PR auth blocker`

## 3. Propiedad de archivos y contratos: CUMPLIDO

- **Archivos:** `git diff --name-status master...origin/gpt/r3-copy-plantillas` da 22 archivos, 21 modificados y la entrega nueva. Todos están en la lista cerrada 3.1.
  - Ninguno en `locales/`, `assets/`, `tests/`, `scripts/`, `config/`, `docs/` (ledger, decisiones, manifiesto), `agent-comms/BOARD.md` ni en archivos de Claude.
- **`data-*`, ids y clases:** solo aparecen líneas reindentadas (`main-article__navigation*`, `main-blog__meta`) y las excepciones permitidas:
  - los spans `visually-hidden` de FB-24;
  - en marquee se quitan `role`, `aria-label` y `aria-pressed` (FB-26 y Adenda b);
  - en lookbook cambian el número visible y el `aria-label` (FB-45).
  - `data-lookbook-trigger`, `aria-controls`, `data-pause-label`, `data-play-label`, `data-marquee-toggle` y `data-marquee-toggle-label` se conservan. `gates:hooks` da 0 contratos rotos.
- **Locales:** no usa ninguna clave nueva. Las raíces plurales `sections.complete_the_look.selected_count` y `add_selected` ya existían. `gates:locales` da 0 sin resolver, en la rama sola y en la fusión.
- **Órdenes a agentes en la entrega:** ninguna fuera del contrato. Las "Peticiones a Claude" son las que prevé la sección 8 del encargo.

## 4. Tabla por hallazgo asignado (líneas de la rama de GPT)

| ID | Estado | archivo:línea | Observación |
| --- | --- | --- | --- |
| FB-12 / SO-01 + FO-08 | Hecho | `listings/archive/templates/index.json:83-85` | Pasa a "Collection highlights" y "Explore the collection.", con caption vacío. |
| FB-12 / SO-09 | Hecho | `listings/imprint/templates/collection.json:10,12` | Se quedan el heading "Engineered for high telemetry" y un `link_label` sin `link_url`, que no se pinta (D6). |
| FB-12 (mega menú) | Hecho | `sections/header-group.json:34` | "Explore the collection". |
| FO-08 (plantilla) | Hecho | `templates/index.json:227` | Caption de complete-the-look vacío. |
| FB-59 | A medias | `templates/page.faq.json:47` | El cambio no es visible: el botón ya se ocultaba sin URL (`main-faq.liquid:132`), así que la tarjeta sigue sin salida (D6). |
| FB-42 | **Mal hecho** | `sections/main-blog.liquid:114-129,181` | D1 y D2. |
| FB-43 | **Hecho con fallo** | `sections/main-blog.liquid:9-24,54,96-106,124` | El filtro del destacado por etiqueta es correcto. La condición del separador rompe la fecha (D3) y el contador usa el bucle roto (D1). |
| FB-60 | Hecho | `sections/main-article.liquid:96-114` | `<nav>` solo si hay artículo anterior o siguiente. |
| FB-61 | Hecho | `sections/main-password.liquid:8,54` | Respaldo `shop.name` con escape. |
| FO-11 | Hecho | `layout/password.liquid:131` | `shop.name \| escape`. |
| FB-27 | Hecho | `sections/main-search.liquid:335,343` | `h3`. |
| FB-24 | Hecho | `sections/main-collection.liquid:88-89,96-97`; `sections/main-search.liquid:95-96` | Número con `aria-hidden` más `visually-hidden`, con la clave existente. |
| FB-50 / AS-11 | Hecho | `sections/main-list-collections.liquid:4-6,44` | `card-sizes` 1/2/`columns_desktop`. |
| FO-06 | Hecho | `sections/main-faq.liquid:19-21` | En inglés; "Indice del primer" ya no aparece. |
| FO-04 | Hecho | `brand-manifesto.liquid:4-9,59`; `main-password.liquid:9-13,26`; `complete-the-look.liquid:4-9,137`; `lookbook.liquid:4-9,59`; `hero-editorial.liquid:44-53,112,166`; `main-collection.liquid:374-378,399` | Orden del alt: ajuste, luego `image.alt`, luego `decorative` si hay título visible. En el hero con vídeo usa el alt del póster. |
| FO-08 (secciones) | Hecho | `lookbook.liquid:172`; `complete-the-look.liquid:146,410` | Pie solo con imagen; defaults vacíos. |
| FO-01 | Hecho | `brand-manifesto.liquid:95,142`; `main-collection.liquid:591`; `lookbook.liquid:235` | Sin numeración de demo ni instrucciones. |
| FO-03 (defaults de schema) | Hecho | `main-password.liquid:175,181`; `main-blog.liquid:221`; `main-list-collections.liquid:100` | Queda "your bag" en el default de `complete-the-look.liquid:404` (D6). |
| FB-45 | Hecho, con un resto en el editor | `lookbook.liquid:70,100,111,117` | En el editor, los marcadores vacíos siguen usando `forloop.index` (`:94`) (D5). |
| FB-56 | Hecho | `hero-editorial.liquid:98,152`; `lookbook.liquid:45-47`; `complete-the-look.liquid:125-127` | Añade 1100w. |
| FB-01 | Hecho | `complete-the-look.liquid:243-244,269-270` | `escape_once`. |
| FO-09 | Hecho según el contrato, con regresión | `complete-the-look.liquid:321-325,339-343` | D4. `add_selected` está bien. |
| FB-26 | Hecho | `marquee.liquid` (se quitan las antiguas 15-16) | Coherente con MarqueeBanner en `assets/theme.js`. |
| FB-32 | Hecho | `blog-posts.liquid:48-55` | `max_width: 448` con tarjeta única. |
| FB-52 | Hecho | `collection-list.liquid:91-94` | Respaldo al primer producto solo si `card_image == blank`. |
| FB-57 / SO-06 | Hecho | `snippets/product-provenance.liquid:23` | Añade `inventory_quantity == 1`. |

## 5. Defectos, de más a menos grave

### D1. CRÍTICO, CONFIRMADO (semántica Liquid). La rejilla del blog no se pinta nunca

- **Dónde:** `sections/main-blog.liquid:116` y `:128`, `for blog_article in paginate.items`.
- **Por qué falla:**
  - En Shopify, `paginate.items` es un **entero**: el número total de elementos que se paginan. No es una colección.
  - Un `for` sobre un entero no hace ninguna iteración.
  - Así `latest_article_count` vale siempre 0, el `if` de `:122` no entra y la `<ul>` no se pinta en ninguna página de `/blogs/*`, con cualquier número de artículos.
  - Theme Check no lo detecta.
- **Arreglo mínimo:**
  - Recorrer `blog.articles` en las dos líneas. Dentro de `{% paginate %}` es la página actual, igual que en `master`.
  - Para el rótulo de FB-43 (`blogs.blog.article_count`), usar `paginate.items` como total, restando 1 cuando `show_featured_article` es verdadero y el destacado pertenece a ese blog.
- **Por comprobar en tienda:** 0, 1, 2 y muchos artículos, con y sin etiqueta, en las páginas 1 y 2.

### D2. ALTO, CONFIRMADO (lectura). Aviso de blog vacío con artículos

- **Dónde:** `sections/main-blog.liquid:122` y `:181`. El `else` imprime `blogs.blog.empty` siempre que `latest_article_count == 0`.
- **Escenario:**
  - Hoy ocurre en todas las páginas, por D1.
  - Aun corregido D1, en un blog de un solo artículo (el destacado) sale "no hay artículos" debajo de ese artículo. Es justo el caso de FB-42.
- **Arreglo mínimo:** sustituir el `else` por `{%- elsif paginate.current_page > 1 or show_featured_article == false -%}`.

### D3. MEDIO, CONFIRMADO (semántica Liquid). La fecha del destacado desaparece

- **Dónde:** `sections/main-blog.liquid:96`, `if section.settings.show_author and featured_article.author != blank or section.settings.show_date`.
- **Por qué falla:**
  - Liquid no tiene precedencia entre `and` y `or` ni admite paréntesis: evalúa de derecha a izquierda.
  - La condición queda como `show_author and (author != blank or show_date)`.
  - Con el autor desactivado y la fecha activada, no se pinta el `<p class="main-blog__meta">` y se pierde la fecha.
- **Arreglo mínimo:** precalcular `show_featured_author`, que vale `true` si `show_author` está activado y hay autor, y usar `if show_featured_author or section.settings.show_date`.

### D4. BAJO, CONFIRMADO (semántica Liquid). Concordancia del contador de complete-the-look

- **Dónde:** `sections/complete-the-look.liquid:325`, `'sections.complete_the_look.selected_count' | t: count: selected_item_count, total: …`.
- **Por qué falla:**
  - Shopify elige `one` u `other` según `count`, que aquí es el número de piezas seleccionadas.
  - El comentario de `:321` y `assets/theme.js` (`this.items.length === 1`) hacen concordar el nombre con el **total** de piezas.
  - Con 3 piezas y 1 seleccionada al renderizar (por ejemplo, con dos agotadas), sale "1 of 3 item selected" (es: "1 de 3 pieza seleccionada"). El JS lo corrige en la primera interacción.
  - El origen está en el propio contrato FO-09.
- **Arreglo mínimo:**
  - Solo en `selected_count`, volver a `.one` o `.other` según `rendered_item_count`, como en `master`.
  - En `add_selected` se mantiene el cambio.
  - El soporte de few/many para esta clave requiere rediseñarla en locales y queda para Claude.

### D5. BAJO, CONFIRMADO (lectura), solo en el editor. Números de marcador repetidos

- **Dónde:** `sections/lookbook.liquid:94` (los marcadores vacíos muestran `forloop.index`) frente a `:117` (los reales muestran `hotspot_count`).
- **Escenario:** si el bloque 1 está vacío y el bloque 2 tiene producto, los dos marcadores muestran "1".
- **Arreglo mínimo:** en el editor, no numerar los marcadores vacíos (por ejemplo, un punto) o usar un contador común. La tienda no cambia.

### D6. BAJO, CONFIRMADO (lectura). Copy pendiente (opcional)

- `templates/page.faq.json:42-49`: la tarjeta CTA sigue sin salida. Lo mejor es quitar el bloque `cta` y su entrada de `block_order`. Valorar vaciar también el default "Contact us" en `sections/main-faq.liquid:251`, que tampoco tiene URL.
- `templates/index.json:191`: "Move through the composition and discover each piece." en un lookbook cuyos hotspots no tienen producto. Es el mismo patrón que FB-12 y no se comunicó.
- `listings/imprint/templates/collection.json:11`: "Engineered for high telemetry" es vocabulario técnico. El `link_label` "Explore daily objects" no tiene URL y no se pinta.
- `sections/complete-the-look.liquid:404`: el default dice "your bag", mientras la propia entrega propone cambiar bag por cart en locales.

### D7. INFORMATIVO, CONFIRMADO (lectura). La salida de `gates:package` de la entrega es la de master

- La salida pegada en la entrega dice `rev: HEAD -> 2e94454…`, sha `fed126f0…`, 105 archivos: es la ZIP de `master`.
- El empaquetador lee de HEAD, no del árbol de trabajo, así que se ejecutó antes del commit.
- Repetido aquí sobre `94f7b03`: `gates:static` sale con código 0, 105 archivos, sha256 `7dd2d76699794bfd0df23c97558095bf23b8b7eb34adc3aa2ef7476e72905988`. El fondo de la afirmación se sostiene.
- **Acción:** ejecutar `npm run gates:static` después de cada commit.

## 6. Adenda A

| Punto | Estado | Evidencia |
| --- | --- | --- |
| a) `sizes` de la tarjeta única en collection-list | HECHO | `sections/collection-list.liquid:36-43`: `card-sizes` 1/1/1 con `max_width: 448` y sin `gap`, idéntico a `featured-collection.liquid:44-48`. Comentario actualizado. Cuadra con `.std-grid.std-grid--single` (`assets/section-standard-a.css:109-112`). |
| b) `aria-pressed` estático del marquee | HECHO | Quitado; `theme.js` también lo elimina al conectar. |
| c) contratos nuevos de `theme.js` | Sin acción | GPT no toca esos archivos. |
| d) filas del bento para D35 | HECHO | Incluidas en la tabla de copy de la entrega. |

## 7. Integración de prueba

Worktree temporal: rama local `tmp/r3-merge-check` desde `origin/claude/clever-gauss-ddhyr2` (`72aaee1`), con `merge --no-ff origin/gpt/r3-copy-plantillas`. Después la eliminé y no la subí.

- **Conflictos:** ninguno; los archivos son disjuntos.
- **`npm run gates:static`:** código 0.
  - json: 0 fallos de parseo.
  - hooks: 0 contratos rotos.
  - sanity: OK.
  - locales: 0 sin resolver.
  - ledger: 0 incoherencias.
  - Theme Check: 107 archivos sin ofensas.
  - syntax: OK.
  - package: `internal references: none`.
- **Tests:** `npx playwright test tests/slideshow-reconnect.spec.mjs tests/r3-*.spec.mjs --trace off` → **43 passed**.
- **ZIP de la fusión:** 107 archivos, sha256 `76a48ad7ea5071eb0aebcc618eef92a5e93e7014a98999ca4c662c288a6d3da2`. No es la ZIP final: falta corregir D1 a D4 y aplicar el copy aprobado.
- **Interacciones cruzadas:**
  - El marcado del marquee y del lookbook cuadra con `theme.js`.
  - collection-list y blog-posts cuadran con el CSS de tarjeta única.
  - Ningún cambio de GPT revierte un arreglo de Claude.
  - Las claves que GPT usa existen en los locales de Claude.

### Claves que quedarán huérfanas tras la fusión (6; las borra Claude al integrar)

- `sections.lookbook.image_alt`, `sections.complete_the_look.image_alt`, `sections.homepage.manifesto.material_image_alt`, `password.image_alt`: las de FO-04, previstas.
- `sections.homepage.marquee.region_label`: la deja huérfana FB-26.
- `sections.slideshow.region_label`: ya lo estaba en la rama de Claude, porque `slideshow.liquid:31` usa `region_label_numbered`.

## 8. Entrega de GPT: contraste

- **Dictamen:** no discrepa de la reconciliación ni del reparto. Mantiene AS-01 en severidad media, AS-11 en baja y SO-03/SO-06 en baja.
- **Afirmaciones que no se sostienen:**
  - "Razonado con 0, 1 y 2 artículos" en main-blog: D1 y D2 lo contradicen.
  - La salida de `gates:package` pegada (D7).
- **Lo que declara no haber hecho** (locales, ledger, JS/CSS, ZIP, tests de navegador, tienda, PR) coincide con el diff.
- **Peticiones a Claude:**
  - Las propuestas de locales (FO-03), el `info` del alt del hero y "Atelier" → "Classic" (G-I18N-04) esperan la aprobación de Johandry (D35). Claude las aplica en la integración.
  - La petición sobre el `info` del alt del promo de main-collection no se puede atender tal cual: ese ajuste no tiene `info` en el schema.
  - FO-03 queda incompleto: no hay propuesta para los defaults de `sections/newsletter.liquid:83,89` ("Private correspondence", "Notes from the atelier").

## 9. Qué no se pudo verificar

- No he renderizado nada: no hay motor Liquid en el entorno. D1, D3 y D4 se apoyan en la semántica documentada de Liquid y Shopify.
- No he comprobado la tienda de desarrollo, axe, lector de pantalla, móvil, inventario real ni la elección de imagen en el navegador.
- No he verificado las filas del ledger que la entrega cita (líneas 34, 52, 84 y 114).
- No he comprobado que `current_tags contains` compare bien etiquetas que difieren en mayúsculas o acentos.

---

## 10. Segunda revisión (`792d58f`), 2026-11-24

```text
Revisa: gpt/r3-copy-plantillas @ 792d58f (código en 03cddcb, 7 archivos, todos de la lista 3.1;
        792d58f solo actualiza la entrega). Sin force-push: 94f7b03 es ancestro.
Veredicto: FUSIONABLE. D1 a D7 están corregidos. Queda N1, bajo y no bloqueante, recomendado.
Método: una revisión independiente, más mi comprobación con git log --stat 94f7b03..origin/gpt/r3-copy-plantillas,
        lectura de las líneas citadas y una fusión de prueba propia.
```

| ID | Estado | Evidencia (rama de GPT @ `792d58f`) |
| --- | --- | --- |
| D1 | corregido | `sections/main-blog.liquid:124` y `:136` recorren `blog.articles`; `paginate.items` solo se usa como total del rótulo (`:120`) |
| D2 | corregido | `sections/main-blog.liquid:188`: `elsif paginate.current_page > 1 or show_featured_article == false` |
| D3 | corregido | `sections/main-blog.liquid:22-24` precalcula `show_featured_author`; `:100` usa `show_featured_author or section.settings.show_date` |
| D4 | corregido | `sections/complete-the-look.liquid:326-328`: `selected_count.one` u `.other` según `rendered_item_count` |
| D5 | corregido | `sections/lookbook.liquid:94`: el marcador vacío del editor muestra «·» |
| D6 | corregido (copy opcional, pendiente de aprobación en DP-023) | Imprint «Objects for everyday use»; descripción del lookbook de `templates/index.json`; CTA sin URL retirado de `templates/page.faq.json`; default «Contact us» vacío; `sections/complete-the-look.liquid:408` dice «…before adding them to your cart.» |
| D7 | corregido | La entrega pega la salida de `gates:static` posterior al commit (`rev: HEAD -> 03cddcb…`) |

### N1. BAJO, no bloqueante, recomendado. El total del rótulo no resta el destacado

- **Dónde:** `sections/main-blog.liquid:121`, `if show_featured_article and featured_article.blog.id == blog.id`.
- **Por qué falla:** el objeto `article` de Shopify no tiene propiedad `blog`. La condición es siempre falsa y nunca se resta el destacado del total.
- **Efecto:** con 5 artículos se ven el destacado y 4 tarjetas, y el rótulo dice «5 essays». Es el mismo criterio que tenía `master`, pero no el que la entrega dice haber implementado.
- **Arreglo, a elección de GPT:**
  - borrar esas líneas y contar el total (documentándolo); o
  - comparar por prefijo de URL (`featured_article.url contains` la URL del blog más «/»), que habría que comprobar en tienda con mercados e idiomas.
- **Además:** la tabla de estados de la entrega (fila «2 artículos con P=1, página 1») dice «rótulo sí». El código no lo pinta, porque `latest_article_count` es 0 cuando el único artículo de la página es el destacado (`:130`).

### Integración de prueba

Rama local temporal desde `97e050d` con `merge --no-ff origin/gpt/r3-copy-plantillas` (`792d58f`). La eliminé después y no la subí.

- **Conflictos:** ninguno.
- **`npm run gates:static`:** código 0.
  - hooks: 0 contratos rotos.
  - locales: 0 sin resolver en storefront y 0 en schema.
  - Theme Check: 107 archivos sin ofensas.
- **ZIP de la fusión:** 107 archivos, sha256 `18b880e6c6c4ac9ba139befe7f3b983d59279b9e5b36f546437a001a3d60145d`. No es la ZIP final.
- **Tests:** `npx playwright test tests/slideshow-reconnect.spec.mjs tests/r3-*.spec.mjs --trace off` → `43 passed`.
- **Claves huérfanas en storefront:** 5. Las borra Claude tras la fusión:
  - `sections.lookbook.image_alt`
  - `sections.complete_the_look.image_alt`
  - `sections.homepage.manifesto.material_image_alt`
  - `password.image_alt`
  - `sections.homepage.marquee.region_label`

No se ha renderizado nada en tienda. N1 y la tabla de estados se apoyan en la semántica documentada de Liquid y Shopify.
