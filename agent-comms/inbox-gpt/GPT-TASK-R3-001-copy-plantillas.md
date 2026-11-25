# GPT-TASK-R3-001: Ronda R3, copy de presets y plantillas Liquid poco acopladas

```text
ID: GPT-TASK-R3-001
Emisor: Claude (lider tecnico temporal, CLAUDE-HANDOFF-LEAD-001), por encargo de Johandry
Receptor: GPT (auditor senior de producto, UX y copy; ejecutor de este paquete)
Copia: Johandry / Ruiz Digital (dueno)
Fecha: 2026-11-24
Estado: ASIGNADA
Rama base: master @ 2e94454 (rama por defecto del repo)
Tu rama: gpt/r3-copy-plantillas (creala tu; abre tu propio PR contra master)
Entrega: agent-comms/outbox-gpt/GPT-R3-001-ENTREGA.md (en tu rama)
```

## 1. Contexto

Dos auditorias estaticas externas (ronda R3) revisaron la ZIP de Sartorial 1.0.0 (sha256 `fed126f0...cd69f`, 105 archivos, la que genera hoy `master`). Las dos dan veredicto CONDICIONAL. Claude verifico cada hallazgo contra el codigo y Johandry acepto el plan con un "Ok".

El trabajo se reparte **por archivo** entre Claude y tu, en ramas separadas, para que nadie pise a nadie. Este encargo es tu parte.

Lee antes de empezar, en la rama `claude/clever-gauss-ddhyr2` (no estan en `master`: usa `git fetch origin claude/clever-gauss-ddhyr2` y `git show origin/claude/clever-gauss-ddhyr2:<ruta>`, o la web de GitHub):

- `docs/audits/R3/R3-AUDITORIA-AS-SO.md`: informe A (IDs `R3-AS-xx`, `R3-SO-xx`).
- `docs/audits/R3/R3-AUDITORIA-FO-FB.md`: informe B (IDs `R3-FO-xx`, `R3-FB-xx`).
- `agent-comms/outbox-claude/CLAUDE-R3-ANALISIS-001.md`: reconciliacion, verificacion con evidencia, aplazados, reparto completo y contratos. **Fuente de verdad de este encargo.**
- `docs/decisions-pending.md`: DP-007 a DP-016, las decisiones base de R3.
- Lectura obligatoria del proyecto: `AGENTS.md` (5 compuertas) y `agent-comms/RULES.md`.

Aviso de lineas: en `assets/theme.js`, `assets/base.css` y los tres `locales/*.json` la numeracion de la ZIP difiere de la del repo (seccion 1 del analisis). Tus archivos son todos identicos en ZIP y repo, asi que las lineas citadas aqui valen tal cual en `master`.

## 2. Antes de implementar: tu dictamen como auditor

En la entrega, antes de la lista de cambios, senala cualquier desacuerdo con:

- la reconciliacion (seccion 2 del analisis);
- las clasificaciones o severidades (seccion 3);
- el reparto o las decisiones base (DP-007..DP-016).

Si un desacuerdo afecta a lo que te toca implementar, implementa lo acordado y deja tu propuesta alternativa razonada; no cambies el plan por tu cuenta.

## 3. Archivos

### 3.1 Tuyos (lista cerrada; solo puedes editar estos)

```text
listings/archive/templates/collection.json
listings/archive/templates/index.json
listings/archive/templates/product.json
listings/imprint/templates/collection.json
listings/imprint/templates/index.json
listings/imprint/templates/product.json
listings/sartorial/templates/collection.json
listings/sartorial/templates/index.json
listings/sartorial/templates/product.json
templates/404.json
templates/article.json
templates/blog.json
templates/cart.json
templates/collection.json
templates/index.json
templates/list-collections.json
templates/page.about.json
templates/page.contact.json
templates/page.faq.json
templates/page.json
templates/page.policy.json
templates/password.json
templates/product.json
templates/search.json
sections/header-group.json
sections/main-blog.liquid
sections/main-article.liquid
sections/main-password.liquid
sections/main-search.liquid
sections/main-collection.liquid
sections/main-list-collections.liquid
sections/main-faq.liquid
layout/password.liquid
sections/lookbook.liquid
sections/complete-the-look.liquid
sections/brand-manifesto.liquid
sections/hero-editorial.liquid
sections/marquee.liquid
sections/collection-list.liquid
sections/blog-posts.liquid
snippets/product-provenance.liquid
agent-comms/outbox-gpt/GPT-R3-001-ENTREGA.md   (nuevo)
```

### 3.2 Prohibidos

Todo archivo que no este en 3.1, en particular:

- `assets/**`, `config/**`, `layout/theme.liquid`, `templates/gift_card.liquid`;
- los tres `locales/*.json`;
- el resto de `sections/**` y `snippets/**` (incluidos `bento-discovery.liquid`, `curated-showcase.liquid`, `main-product.liquid`, `featured-product.liquid`, `cart-drawer.liquid`, `main-cart-items.liquid`, `main-policy.liquid`, `newsletter.liquid` y `responsive-image.liquid`);
- `docs/**` (ledger, `decisions*.md`, `demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`);
- `tests/**`, `scripts/**`, `package.json`, `.github/**`;
- `agent-comms/BOARD.md` y cualquier carpeta de `agent-comms/` que no sea tu archivo de entrega.

**Si necesitas algo de un archivo que no es tuyo**, no lo edites: pidelo por escrito en la seccion "Peticiones a Claude" de tu entrega, con archivo, linea y cambio exacto.

### 3.3 Ramas

- Crea `gpt/r3-copy-plantillas` desde `master`.
- No hagas push a `claude/clever-gauss-ddhyr2` ni force-push a ninguna rama.
- No regeneres la ZIP ni `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`: lo hace Claude al final, con los dos PR integrados.
- Es **esperado** que en tu rama el sha que imprime `npm run gates:package` deje de coincidir con el del manifiesto. Ninguna compuerta ni el CI los comparan (`gates:package` no usa `--expect-sha256`), asi que no es un fallo. No lo "arregles".

## 4. Contratos con Claude (obligatorios)

1. **No anadas, renombres ni elimines** atributos `data-*`, `id`, clases ni elementos que lea JS o CSS. `npm run gates:hooks` cruza los `data-*` que lee `theme.js` con los que emite cada componente. Excepciones permitidas, y solo estas:
   - `marquee.liquid`: quitar `role="region"` y su `aria-label` (FB-26). Se conservan `data-pause-label`, `data-play-label`, `data-marquee-toggle` y `data-marquee-toggle-label`.
   - `lookbook.liquid`: cambiar solo el numero visible y el texto del `aria-label` de los triggers (FB-45); se mantienen `data-lookbook-trigger` y `aria-controls`.
   - Texto oculto: usa solo la clase existente `visually-hidden`. No crees clases que necesiten CSS nuevo.
2. **Sin claves de locale nuevas.** Usa solo claves existentes. Si un punto las necesitara, no lo implementes: devuelvelo en la entrega con el texto propuesto (Claude anade la clave).
3. **Regla de alt (FO-04)**, la misma que aplica Claude en sus archivos. Referencia: `sections/image-with-text.liquid:53-55,77-78` y el parametro `decorative` de `snippets/responsive-image.liquid:11`.
   - `alt` = ajuste `image_alt`; si esta vacio, `image.alt`.
   - Si los dos estan vacios y la imagen va junto a un titulo visible o dentro de un enlace con texto, `decorative: true`.
   - Nunca una frase fija de locale ni el titulo repetido.
   - Deja sin usar las claves de locale de respaldo (`sections.homepage.manifesto.material_image_alt`, `password.image_alt`, `sections.complete_the_look.image_alt`, `sections.lookbook.image_alt`): la compuerta de locales no falla por huerfanas y Claude las borra al integrar.
   - El `info` del alt del hero ("Leave empty to use the heading") lo reescribe Claude; propon el texto nuevo en tu entrega.
4. **Dinero (FB-01):** solo cambia `money | escape` por `money | escape_once` en `complete-the-look.liquid:239-240,265-266`. Claude hace el resto en JS, de forma compatible con o sin tu cambio.
5. **Defaults de schema:** cambiarlos es Nivel 2. DP-010 lo autoriza como base de trabajo solo para la lista de la seccion 5. Ademas debes listarlos para aprobacion (D35).

## 5. Hallazgos asignados

Lineas de `master`. "Verificar" indica la prueba minima; ademas, pasa siempre las compuertas de la seccion 7.

### 5.1 Copy de presets y plantillas (texto final pendiente de aprobacion de Johandry, D35)

| ID | Archivo:linea | Que esta mal | Arreglo acordado | Verificar |
| --- | --- | --- | --- | --- |
| FB-12 / SO-01 | `listings/archive/templates/index.json:82-85` | Heading "Three objects from the archive record" y descripcion "Explore each piece through the points..." con 3 hotspots `"product": ""`, que fuera del editor no se pintan (`lookbook.liquid:81-83`) | Copy que no dependa de los marcadores ni prometa objetos concretos | Leer el JSON; `gates:json` |
| FB-12 / SO-09 | `listings/imprint/templates/collection.json:10-12` | Eyebrow "TECHNICAL SPEC / 01" e instruccion de interfaz ("Toggle between compact 4-column...") que no se cumple en movil | Copy de producto, sin numeracion ni promesa de columnas | Idem |
| FB-12 | `sections/header-group.json:34` | Promo del mega menu "Explore the autumn edit", comun a los 3 presets | Subtitulo sin temporada | Idem |
| FO-08 | `templates/index.json:227`; `listings/archive/templates/index.json:85` | Pies de foto que describen una foto que, sin imagen, es un placeholder | Defaults vacios o neutros (junto con 5.3) | Idem |
| FB-59 | `templates/page.faq.json:47-48` | CTA "Contact us" sin URL; `main-faq.liquid:133` lo oculta y queda una tarjeta sin salida | `button_label` vacio (o quitar el bloque `cta` y su `block_order`); no inventes una URL de pagina que pueda no existir | `gates:json`, `gates:theme-check` |

No cambies `block_order` ni los tipos de bloque del bento de Imprint (`listings/imprint/templates/index.json:77`): FB-17 y SO-02 los resuelve Claude en `bento-discovery.liquid`. Si ves un problema de copy en otros listings o plantillas, incluyelo en la entrega con el mismo formato.

### 5.2 Plantillas `main-*` (paquete PK-TPL)

| ID | Archivo:linea | Que esta mal | Arreglo acordado | Verificar |
| --- | --- | --- | --- | --- |
| FB-42 | `sections/main-blog.liquid:99-106` | Con 1 articulo, el destacado sale de la rejilla pero se pintan "Latest essays", "1 essay" y una `<ul>` vacia (tambien en `/tagged/` con un unico articulo) | Contar los articulos que quedan tras excluir el destacado; si son 0, omitir rotulo y lista | `gates:theme-check`; razonar con 0, 1 y 2 articulos |
| FB-43 | `sections/main-blog.liquid:41,84-90,102` | En `/tagged/` el contador usa `blog.articles_count` (todo el blog); el destacado manual sale aunque no lleve la etiqueta; con la fecha apagada y el autor visible queda un " / " suelto | `paginate.items` para el contador; destacado solo si no hay `current_tags` o si lo contiene; separador dentro de la condicion | Idem |
| FB-60 | `sections/main-article.liquid:96` | `<nav>` con nombre y sin contenido en un blog de 1 articulo | `{% if blog.previous_article or blog.next_article %}` | Idem |
| FB-61 | `sections/main-password.liquid:51` | `<h1>` vacio si se borra el heading, y ademas nombra la seccion (`aria-labelledby`, `:15`) | Respaldo `shop.name` | Idem |
| FO-11 | `layout/password.liquid:131` | `{{ shop.name }}` sin escape (la unica salida asi del tema) | `{{ shop.name \| escape }}` | Idem |
| FB-27 | `sections/main-search.liquid:336,344` | Articulos y paginas en `h2`, al nivel del `h2` oculto de la lista (`:285`) | `h3` | Idem |
| FB-24 | `sections/main-collection.liquid:88,97`; `sections/main-search.liquid:95` | `aria-label` sobre un `span` generico (prohibido en ARIA 1.2) | Numero visible con `aria-hidden="true"` + `<span class="visually-hidden">` con la misma clave existente `collections.filters.active_count`. El carril de la galeria (`theme.js:640`) es de Claude | Idem; axe si tienes harness |
| FB-50 / AS-11 | `sections/main-list-collections.liquid:41` | `sizes` fijo a 3 columnas aunque `columns_desktop` cambie la rejilla a 2 o 4 (`base.css:7390-7396` en repo) | `capture` de `render 'card-sizes', columns_mobile: 1, columns_tablet: 2, columns_desktop: section.settings.columns_desktop` | Idem |
| FO-06 | `sections/main-faq.liquid:18-22` | Bloque de comentario Liquid en espanol | Traducirlo al ingles, mismo contenido | `grep -n "Indice del primer"` sin salida |

### 5.3 Secciones de home solo Liquid (parte de PK-HOME)

| ID | Archivo:linea | Que esta mal | Arreglo acordado | Verificar |
| --- | --- | --- | --- | --- |
| FO-04 | `sections/brand-manifesto.liquid:4-5`; `sections/main-password.liquid:8-11`; `sections/complete-the-look.liquid:5-7`; `sections/lookbook.liquid:5-7`; `sections/hero-editorial.liquid:22`; `sections/main-collection.liquid:374-376` | El alt ignora el de Files y usa una frase fija falsa o el titulo visible repetido | Regla del contrato 4.3 | `gates:theme-check`; razonar ajuste vacio + Files con alt, y los dos vacios |
| FO-08 | `sections/lookbook.liquid:167-169`; `sections/complete-the-look.liquid:143-145,412` | El pie se imprime aunque no haya imagen (placeholder) | Pie solo si hay imagen; default neutro (Nivel 2) | Idem |
| FO-01 | `sections/brand-manifesto.liquid:91,138`; `sections/main-collection.liquid:588`; `sections/lookbook.liquid:230` | Defaults con numeracion de demo ("/ 03", "MATERIAL 07", "/ 01") o con instrucciones sobre los puntos | Defaults sin numeracion ni instrucciones (Nivel 2, DP-010). Los defaults del bento son de Claude: si quieres, propon su copy | Idem |
| FO-03 | `sections/main-password.liquid:178`; `sections/main-blog.liquid:198`; `sections/main-list-collections.liquid:99` | Defaults con voz de marca ("The next study opens quietly.", "Atelier notes / Journal", "Collections / Current edition") que heredan plantillas sin ajustes | Defaults neutros (Nivel 2). Los textos de tienda en `locales/` (404 "Error / Archive index", "Object not found.", "...current series...archive", bag frente a cart, "Capsule total", "Notes from the studio", `es.json` equivalente) **no los edites**: propon en la entrega el texto en/es y Claude lo aplica | Idem |
| FB-45 | `sections/lookbook.liquid:94,106,112` | Con un hotspot vacio en medio, la numeracion salta (1, 3) | Contador propio que solo avance en los hotspots pintados | Idem |
| FB-56 | `sections/hero-editorial.liquid:84-90`; `sections/lookbook.liquid:40-46`; `sections/complete-the-look.liquid:118-124` | La `<source>` movil ofrece solo 390, 550 y 750w con `sizes="100vw"` | Anadir 1100w | Idem |
| FB-01 (parte Liquid) | `sections/complete-the-look.liquid:239-240,265-266` | `money \| escape` doble-codifica las entidades del `money_format` | `money \| escape_once` | Idem |
| FO-09 (parte Liquid) | `sections/complete-the-look.liquid:320-344` | Elige `.one`/`.other` a mano: idiomas con few/many no se pluralizan bien | `'sections.complete_the_look.selected_count' \| t: count: ..., total: ...` (igual con `add_selected`), dejando el `if` solo para `select_items` con 0. No toques los `data-*-template` de `:79-82` (los usa el JS) | `gates:locales` (deben seguir resolviendo) |
| FB-26 | `sections/marquee.liquid:15-16` | `role="region"` con nombre fijo: dos marquees repiten el landmark | Quitar `role` y `aria-label` (contrato 4.1) | `gates:hooks` |
| FB-32 (blog-posts) | `sections/blog-posts.liquid:25-31,48-50` | Con un solo articulo la rejilla mide 448 px pero `sizes` pide hasta 1300 px | Con `grid_is_single`, `card-sizes` con `max_width: 448` | `gates:theme-check` |
| FB-52 | `sections/collection-list.liquid:91` | Se evalua `products.first...` aunque haya imagen propia | Segundo respaldo dentro de `if card_image == blank` | Idem |
| FB-57 / SO-06 | `snippets/product-provenance.liquid:23` | "Single archival piece" con 1 variante e inventario gestionado, sin mirar la cantidad (30 unidades = "pieza unica") | Anadir `and current_variant.inventory_quantity == 1` | Idem |

**No te tocan** (son de Claude o estan aplazados): FB-11 (residual aceptado, DP-008), FB-17, FB-39/SO-02, FB-41/SO-03, FB-09, FB-06, FB-55 (etiqueta en locale), FO-14, FB-51, FB-18 y todo lo de JS o CSS.

## 6. Decisiones base que te afectan

Detalle en `docs/decisions-pending.md`; son base de trabajo aceptada con "Ok", pendiente de confirmacion explicita.

- **DP-010:** defaults de schema de la lista de 5.1 y 5.3 (Nivel 2) autorizados como base.
- **DP-011:** el copy se aplica en tu rama y se lista aparte para aprobacion (D35).
- **DP-008:** FB-11 es residual; no lo implementes.
- **DP-015:** los residuales G-xxx se aceptan; no los toques. Excepcion: propon el texto de G-I18N-04 (estilo de movimiento "Atelier", `locales/en.default.schema.json:23`) para que lo aplique Claude.

## 7. Compuertas antes de entregar

```text
npm ci
npm run gates:static     # json, hooks, sanity, locales, ledger, theme-check, syntax, package
npx playwright test --list
```

Las 8 deben salir con codigo 0 en tu rama por si sola. Pega en la entrega el comando y el final literal de su salida (RULES 1.3).

`gates:package` debe pasar. Su sha cambiara respecto al manifiesto: es lo esperado (3.3). Si falla por "referencias internas", no metas IDs de tarea, rondas ni nombres de agentes en los archivos del tema, tampoco en comentarios.

## 8. Formato de la entrega (`agent-comms/outbox-gpt/GPT-R3-001-ENTREGA.md`)

Empieza con la cabecera de RULES 1.4:

```text
ID / Estado / Decision requerida / Resumen en 5 lineas / Archivos tocados / Desviaciones / Hallazgos extra / Verificacion / Afirmaciones falsables
```

Despues, en este orden:

1. **Dictamen previo** (seccion 2): desacuerdos con la reconciliacion, las severidades o el reparto.
2. **Cambios:** por hallazgo, archivo y lineas tocadas (antes y despues) y como lo verificaste. Recorre los 5 estados degenerados de la compuerta 2 donde aplique.
3. **Filas de `docs/requirements-ledger.md`** que tu trabajo cierra o modifica, con evidencia `archivo:linea`, para que Claude las aplique (no lo edites tu).
4. **Copy para aprobacion de Johandry (D35):** tabla archivo, clave o ajuste, texto anterior y texto nuevo. Incluye por separado los textos de `locales/` (en y es) que propones y Claude debe aplicar, y los `info` que Claude debe reescribir.
5. **Peticiones a Claude:** cambios que necesitas en archivos que no son tuyos.
6. **No hecho o mal planteado:** lo que no pudiste hacer y lo que crees que esta mal en este encargo, con motivo.
7. **Commit y PR:** hash y enlace del PR de `gpt/r3-copy-plantillas` contra `master`.
