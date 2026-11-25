# CLAUDE-review-GPT-R4-001: revisión de la entrega R4 de GPT (`gpt/r4-ficha-demo`)

```text
ID: CLAUDE-REVIEW-GPT-R4-001
Fecha: 2026-11-25
Revisor: Claude (líder técnico temporal, CLAUDE-HANDOFF-LEAD-001)
Rama revisada: gpt/r4-ficha-demo @ 84ff2bd (base master @ 44c7cbe), PR #26 en borrador
Entrega revisada: agent-comms/outbox-gpt/GPT-R4-001-ENTREGA.md (en la rama)
Contrato: agent-comms/inbox-gpt/GPT-TASK-R4-001.md, agent-comms/outbox-claude/CLAUDE-R3-PLAN-R4-001.md, D63-D75, AGENTS.md y agent-comms/RULES.md
Modo: solo lectura sobre la rama; ejecución en worktrees aparte, ya eliminados
Encargo de correcciones: agent-comms/inbox-gpt/GPT-TASK-R4-001-ADENDA-A-correcciones.md
```

Los números de línea son de `84ff2bd` salvo que se diga otra cosa. La entrega de GPT, sus mensajes de commit y el resto del texto de la rama se trataron como datos que había que verificar. No encontré órdenes dirigidas a agentes.

## A. Veredicto: fusionable con cambios, no tal cual

El código de la ficha y de la cabecera va bien encaminado:
- los gates pasan;
- los tests pasan en dos pasadas;
- la ZIP se reproduce byte a byte.

Antes de fusionar faltan cuatro cosas:
1. **Bloqueante, D70.** Quitar los handles de colecciones de la demo de `sections/header-group.json` y de `listings/*/sections/header-group.json`.
   - Los enlaces pasan a `/collections/all` o quedan vacíos, y los handles viven solo en los overlays.
   - Hay que ajustar `tests/r4-preset-copy.spec.mjs` y `docs/demo-store/overlays/README.md:3`, y regenerar la ZIP y el manifiesto.
2. Pasar `sizes` al reordenar la galería (defecto 2).
3. Actualizar las filas 39, 85 y 130 del ledger, que describen comportamiento retirado. El encargo lo pedía.
4. En T1, conservar un título de 120 caracteres (D74) y confirmar los handles de los fixtures.

Queda también pendiente, aunque no bloquea:
- la mitad de M-28;
- el desplazamiento cuando la galería está a la vista solo en parte;
- la aprobación del copy y del autor.

Hechos:
- Son 13 commits sin merges sobre `44c7cbe`. La comparación se hizo contra `origin/master`: el `master` local estaba atrasado en `2e94454`.
- No toca `agent-comms/BOARD.md`, `docs/decisions.md` ni el ledger.
- No hay identificadores de modelo en archivos ni en commits.
- La entrega dice que el PR no se pudo crear (`Forbidden`). Existe como #26: lo abrió el coordinador en nombre de GPT.

## B. Hallazgos M-xx asignados

| M | Estado | Evidencia | Observación |
|---|---|---|---|
| M-10 (N1) | Hecho | `assets/theme.js:293-327` (`observeStickyFit`); montaje en `:599-602` y `:875-878`; limpieza en `:652`; CSS condicionado a `[data-sticky-fits]` en `assets/base.css:1399`, `:5116`, `:9090-9091`, `:10748` | Usa ResizeObserver (columna y cabecera), MutationObserver (`style` de `<html>`, `--header-offset`) y `resize`. Sin JS, la columna no es sticky. `StickyCartBar` queda intacto. Lo que no cubren los tests: que la barra fija aparezca, ni la medida 1536×674. |
| M-06 | A medias | Liquid: `sections/main-product.liquid:46-51` y `:88`; zoom por `zoom_images` en `:115-129`. JS: `assets/theme.js:330-336` y `:701-733` | Bien: el orden del foco es el del DOM (sin `order:-1`), el LCP va por `forloop.first`, el zoom tiene índice correcto, se respeta reduced motion y los índices del carrusel son correctos. Falta pasar `sizes` (defecto 2). El desplazamiento depende de la galería entera (defecto 3). |
| M-15 | Hecho | Se retiró la regla de `assets/base.css` (antes en `:10783-10791`); featured product reordena en `sections/featured-product.liquid:39-43` y `assets/theme.js:1555-1565` | Ledger sin actualizar (defecto 4). |
| M-16 | Hecho | `assets/theme.js:6067-6069` | El `requestAnimationFrame` corre después del de `trapFocus`. |
| M-13 | Hecho | `snippets/localization-selectors.liquid:79-91`, `assets/base.css:7630-7647` | Comentario obsoleto en `assets/base.css:7679-7680`. |
| M-19 | Hecho | `assets/theme.js:6186`, `:6334-6341` | La entrega lo sitúa por error en `snippets/predictive-search.liquid`, que no cambió. |
| M-20 | Hecho | `assets/theme.js:4001-4002`, `:4414-4417` | El anuncio se mantiene para el lector de pantalla, con «0 items». |
| M-17 | Hecho | `assets/base.css:7367-7369`, `locales/en.default.json:432` | — |
| M-18 | Hecho (plantilla) | `templates/product.gift-card.json` | Copia exacta de `templates/product.json` sin `composition_care`. Usa grid, pero el preset Sartorial usa split_screen. |
| M-27 | Hecho | `sections/main-blog.liquid:184-188` | El texto dice «Return to the journal», pero no hay enlace. |
| M-28 | A medias | `locales/*.json:663`, `assets/theme.js:6206-6207` | El estado vivo sigue anunciando «0 suggestions available» (`assets/theme.js:6230` y `:6363-6366`). |
| M-14 (parte del preset) | Hecho con regresión | `sections/header-group.json:35,39`; `listings/{sartorial,imprint,archive}/sections/header-group.json:35,39` | El copy está bien, pero mete handles de la demo en la ZIP (defecto 1). |

## C. Defectos, de más a menos grave

### 1. Alta, CONFIRMADO leyendo el código: handles de la demo en la ZIP

**Dónde.** `sections/header-group.json:35,39` y los tres `listings/*/sections/header-group.json:35,39`.

**Qué pasa.** Los enlaces del mega menú apuntan a colecciones que solo existen en la demo:
- `/collections/new-forms`
- `/collections/tailoring`
- `/collections/daily-objects`
- `/collections/desk-and-study`
- `/collections/permanent-archive`

**Por qué falla.**
- D70 dice que los JSON de `listings/` siguen sin handles de la demo y que el mega menú va en el overlay.
- Una instalación de la ZIP en una tienda que no es la demo deja las dos promos en 404. Shopify pide «Adjust or remove copy that could cause support issues».
- `docs/demo-store/overlays/README.md:3` afirma «the preset listing JSON remains handle-neutral», y es falso.
- Los overlays de cabecera son idénticos a los de `listings/`.
- `listings/sartorial/sections/header-group.json` es igual a la raíz. Shopify («Updating your theme») dice: «Don't duplicate .json files for every preset when the contents are identical».
- `tests/r4-preset-copy.spec.mjs` fija la regresión.

**Lo que sí funciona.** La misma página de shopify.dev confirma que `listings/<preset>/sections/*.json` sustituye al `/sections` base. El mecanismo es correcto y el preset por defecto renderiza, pero con enlaces rotos.

**Arreglo.**
- Enlaces neutros en la raíz y en `listings/`.
- Handles solo en los overlays.
- Quitar el archivo de Sartorial si queda igual a la raíz.
- Regenerar la ZIP.

### 2. Media, CONFIRMADO leyendo el código: `sizes` sin actualizar al reordenar

**Dónde.** `assets/theme.js:330-336`, `:717`, `:1562`. El reordenado con JS no toca `sizes`.

**Qué pasa.**
- En la ficha con layout grid y un número impar de medios (`sections/main-product.liquid:98-112`), la figura que pasa a ser primera ocupa las dos columnas, pero conserva `sizes` de 30vw.
- En featured product (`sections/featured-product.liquid:106-109`) ocurre lo mismo.
- El resultado es una imagen blanda en Imprint, Archive y featured product. El plan listaba este riesgo explícitamente.

**Arreglo.** Intercambiar `sizes` entre la figura movida y la antigua primera.

### 3. Media-baja, PLAUSIBLE: el desplazamiento mira la galería entera

**Dónde.** `assets/theme.js:725-731`. Solo se llama a `scrollIntoView` si toda la galería está fuera de la vista.

**Escenario.**
1. La columna de detalles es sticky.
2. El comprador baja hasta la 5.ª imagen.
3. Cambia de variante.
4. El medio pasa al principio, por encima de la ventana, y no lo ve.

**Arreglo.** Medir el rectángulo del medio seleccionado, no el de la galería.

### 4. Media, compuerta 1, CONFIRMADO: filas del ledger obsoletas

En `docs/requirements-ledger.md` de `master`:
- La fila 85 cita el recorte a cinco medios (`assets/base.css:10766`).
- La fila 130 cita «variante seleccionada primero» por CSS.
- La fila 39 cita líneas de `sizes` de featured product que se han movido.

### 5. Media, T1 y D74, CONFIRMADO: fixtures mal renombrados

**Dónde.** `docs/demo-store/scripts/catalog-r4-data.mjs:33-38`.

**Qué pasa.**
- `long-title-fixture-wrap-coat` pasa de 120 caracteres (su título en `products.csv`) a 101. `fixture-long-title` queda en 100. Se pierde el caso límite de 120 caracteres.
- Cinco de los seis handles no están en `products.csv`. Salen de sondas de R2.
- No cubren otros fixtures vistos en R2: «Fixture Alignment Tee», «Fixture Focal Point Scarf», «Fixture color only» y «Fixture Long Title Hand-Finish».
- «Multi-Option Knit» renombra un «Many Variants Jacket» como si fuera de punto.

### 6. Media-baja: los planificadores T1-T3 no leen la tienda

- La «idempotencia» es tautológica: con `currentValues = targetState` salen cero cambios.
- Las operaciones son intenciones abstractas, no GraphQL ejecutable, y no se pueden aplicar (`--apply` se rechaza).
- Además:
  - el inventario está fijo en 8 (`catalog-r4.mjs:195-196`, `:219-220`);
  - el handle `welcome-to-the-demo-store` se queda, con meta-texto en la URL (`:153`);
  - T2 sobre la tienda de QA activaría y publicaría productos de Imprint en una tienda compartida (`:186-208`).

### 7. Baja, CONFIRMADO: patrones `$` en la búsqueda

**Dónde.** `assets/theme.js:6207`. `replaceAll('[terms]', query)` interpreta patrones `$&` y `$'` de la búsqueda. Pasa lo mismo, y ya pasaba antes, con `.replace` en `:6214`.

**Riesgo.** Sin XSS, porque el texto se asigna con `textContent`.

**Arreglo.** Usar `() => query`.

### 8. Baja: detalles menores

- El texto de página fuera de rango no lleva enlace (`sections/main-blog.liquid:185`).
- La tarjeta regalo usa grid también en Sartorial.
- El `aria-label` del zoom numera en el orden del producto (`sections/main-product.liquid:123-128`): la primera imagen visible puede anunciarse como «image 7 of 7».
- La tabla de `docs/demo-store/overlays/README.md:11,13` no cuadra con la cabecera:
  - Sartorial: `image_2` dice «Permanent collection», pero el promo es Tailoring.
  - Archive: `image_2` dice «Restored pieces», pero el promo es «Selected pieces».

### Lo que comprobé y está bien

- **`nil | where/reject/concat` con featured product vacío:** no da error de Liquid, porque InputIterator devuelve `[]`.
- **Schemas:** no cambia ninguno, así que no hay reglas nuevas de servidor en juego.
- **Claves de locale nuevas:** existen en `en.default.json` y `es.json`, sin huérfanas.
- **Contrato `data-*`:** se mantiene (`gates:hooks`).

## D. Scripts de catálogo

### Qué leí

Leí enteros `catalog-r4.mjs`, `catalog-r4-data.mjs` y `catalog-r4-stores.json`.

### Seguridad

- **Red y credenciales:** no hay red, ni `fetch`, ni lectura de credenciales o variables de entorno.
- **Modo de ejecución:** `--apply` sale con código 2. No toca temas.
- **Tiendas permitidas:** la lista está cerrada a QA y tres alias sin dominio.
- **Escritura:** solo escriben el JSON del plan, en `docs/demo-store/plans/` o en `--out`.
- **Planes:** no llevan IDs, `gid` ni secretos.

### Qué harían

**T1, 731 cambios:**
- 689 asociaciones de medio a variante, localizando el medio por texto alternativo o nombre de archivo;
- 22 descripciones;
- el vendor por consulta;
- 6 títulos;
- blog: título, cuerpo, etiquetas, autor y despublicar el artículo de título largo;
- tarjeta regalo: texto y `templateSuffix`;
- 2 colecciones fuera del canal.

**T2:**
- en QA, 24 cambios y 1 omitido (el tote);
- en la demo de Imprint, 27, con un `productSet` para el tote.

**T3:** 26 cambios.

### Qué no pude ejecutar

El clasificador de permisos me denegó ejecutar la CLI en seco. La lógica (`buildPlan`) sí corrió dentro de `tests/r4-catalog-runs.spec.mjs`, que pasa.

## E. Tests

Ejecuté los specs de la rama en un worktree de `master`.

**Fallan en master y pasan en la rama: 21.**
- Prueban comportamiento real:
  - C1a ×2, C1b escritorio, C1b featured y C1c;
  - M-16, M-19 y M-20;
  - M-28: la sustitución en JS, con un texto propio del fixture y no el del locale;
  - M-13, la geometría: el fixture ya usa el marcado nuevo.
- Solo comparan cadenas o JSON:
  - M-13 en Liquid y el zoom;
  - M-17: CSS real más locale;
  - M-18 y M-27;
  - C4 ×2;
  - overlays ×4.
- `r4-catalog-runs` (×5) falla en `master` solo porque el módulo no existe.

**Pasan también en master y no demuestran nada:**
- «R4 C1b mobile keeps carousel DOM order…»;
- los tests de R3 que ya existían.

**Sin test:**
- la barra fija que aparece al bajar;
- la medida 1536×674;
- sin JS con `?variant=` (solo se comparan cadenas);
- `sizes` y span de la primera figura;
- que el zoom abra la imagen pulsada.

## F. Gates, tests, ZIP y manifiesto

**Gates y tests**
- `npm run gates:static` en verde: 898 JSON, 0 defaults vacíos, Theme Check «111 files … no offenses» y «internal references: none».
- Playwright sin `pdp-line-total`: 74/74 en las dos pasadas.

**ZIP**
- La regeneré sobre `84ff2bd`. El tema es idéntico al de `6b0d173`.
- 111 archivos, 333552 bytes, sha256 `1d9a22b30cd2ddb738426951cc9f2c28fb76fb9713d7b1f80b7b7799a9bffec1`. Coincide aunque la versión de zlib es otra.
- `unzip -t` sin errores y `node --check` correcto en los dos JS.

**Manifiesto**
- Sus 111 líneas coinciden con la ZIP.

**De 107 a 111 archivos**
- Entran:
  - `listings/{archive,imprint,sartorial}/sections/header-group.json`
  - `templates/product.gift-card.json`
- No entra ningún overlay ni documento.
- Dos de los archivos de cabecera llevan el defecto 1, y el de Sartorial además duplica la raíz.

## G. Los dos asuntos que GPT pidió revisar

**(a) Sufijo de preview.** No hay discrepancia.
- «Reescribir las descripciones con el sufijo…» quiere decir «las que llevan el sufijo».
- D72 y el requisito de Shopify («Don't use Lorem Ipsum or onboarding text») obligan a quitarlo, y GPT lo quitó bien.
- Cerrado.

**(b) Autor «proyect-shopi».**
- Solo aparece en archivos de GPT. El script dice «Author supplied by Johandry in this task reply», así que viene de la conversación y no del repositorio.
- No contiene datos personales.
- No es apropiado como autor visible: parece un usuario o un placeholder, lleva la errata «proyect» y choca con D72.
- Recomendación: un autor editorial ficticio coherente con la marca de cada preset, aprobado por Johandry.

## H. Copy para aprobación y checklist de Johandry, tal como los entregó GPT

### Locales

| Clave | EN antes → después | ES antes → después |
|---|---|---|
| `blogs.blog.page_out_of_range` (nueva) | — → «There are no essays on this page. Return to the journal to browse all stories.» | — → «No hay ensayos en esta página. Vuelve al diario para consultar todas las historias.» |
| `not_found.recommendations` | «Popular pieces / Continue exploring» → «Popular pieces» (aprobado en D66) | «Piezas destacadas / Sigue explorando» → «Piezas populares» |
| `predictive_search.no_results` | «No suggestions yet. Press enter to search the full catalog.» → «No matches for “[terms]”. Try a different search or view all results.» | «Aún no hay sugerencias. Pulsa Enter para buscar en todo el catálogo.» → «No hay resultados para «[terms]». Prueba otra búsqueda o consulta todos los resultados.» |

### Cabeceras (solo inglés)

| Archivo | heading_1 | subheading_1 | heading_2 | subheading_2 |
|---|---|---|---|---|
| Raíz y Sartorial | «New Arrivals» → «New forms» | «Explore the collection» → «Explore pieces from the current collection.» | «Capsule Wardrobe» → «Tailoring» | «» → «A closer look at cut and proportion.» |
| Imprint | «Daily objects» | «Tools and pieces for work and everyday use.» | «Desk and study» | «Explore the pieces for your workspace.» |
| Archive | «Permanent archive» | «Browse garments and objects from the archive.» | «Selected pieces» | «A considered view across the collection.» |

### `listings/imprint/templates/index.json`

| Antes | Después |
|---|---|
| «TECHNICAL STUDIO» | «Technical studio» |
| «Modular gear and desk objects for daily carry.» | «Desk objects and accessories for work and everyday routines.» |
| «Inspect system inventory» | «Browse the collection» |
| marquee «TECHNICAL STUDIO / DAILY OBJECTS / DESK AND STUDY» | «Technical studio / Daily objects / Desk and study» |
| «MEMBRANE TELEMETRY» | «Daily carry» |
| «EDC systems» | «Everyday carry systems» |
| «BLUEPRINT ANALYSIS» | «Object details» |
| «GRID STUDY» | «The collection» |
| «SYSTEM INVENTORY» | «The collection» |
| «Studio Modular Systems» | «Desk objects for daily use» |
| «EDC MODULAR CAPSULE» | «A modular carry» |
| «The Complete Utility Rig» | «Pieces for daily carry» |
| «A modular rig for daily carry, field telemetry and technical desk deployment.» | «An arrangement of pieces for work and everyday routines.» |
| «A modular arrangement for daily work.» | «An arrangement for work and daily routines.» |
| «STUDIO PRINCIPLES» | «Studio principles» |
| «Form follows engineering tolerance.» | «Useful forms begin with the work they do.» |
| «Inspect collection» | «Browse the collection» |
| «TECHNICAL REPORT» | «Studio notes» |

Sin cambio: el titular «Engineered utility, precise discipline» (`listings/imprint/templates/index.json:20`). Conviene revisarlo.

### `listings/archive/templates/index.json`

| Antes | Después |
|---|---|
| «Catalog / The house» | «Catalog / the house» |
| «CURATORIAL PROTOCOL» | «Curatorial notes» |
| «ARCHIVE COLLECTION» | «Archive collection» |
| marquee «THE PERMANENT ARCHIVE / CURATED GARMENTS & OBJECTS / CURATED SELECTIONS & ACCESSIONS» | «Permanent archive / Garments and objects / Selected pieces» |
| «THE VAULT» | «The archive» |
| «Archive Entries» | «Archive pieces» |
| «CURATED SELECTIONS» | «Selected pieces» |

### `listings/archive/templates/collection.json`

| Antes | Después |
|---|---|
| «CURATED SELECTIONS / ARCHIVE» | «From the archive» |
| «Curated Archival Garments» | «Selected garments and objects» |

### Catálogo (`docs/demo-store/scripts/catalog-r4-data.mjs`)

**Vendors**
- «Line & Form»
- «Field & Form»
- «Archive Index»

**Fixtures renombrados**
- «Studio Form Coat»
- «Multi-Option Knit»
- «Double-Faced Wool and Cashmere Wrap Coat with a Detachable Belt, Oversized Collar and Longline Shape»
- «Ribbed Cotton Jersey Tee»
- «Cotton Jersey Long-Sleeve Tee»
- «Double-Faced Wool and Cashmere Wrap Coat with a Detachable Belt and Oversized Collar in Soft Ink Navy»

**Descripciones.** Sustituyen a «…Demo product for theme preview. Replace this text with your own description.».

| Handle | Descripción |
|---|---|
| serra-coat | «A long wrap coat with a quiet line through the body.» |
| doppio-trench | «A double-breasted trench with a clean, straight profile.» |
| cocoon-cardigan-coat | «An open-front knit coat with a rounded silhouette.» |
| nove-blazer | «A single-breasted blazer with notch lapels.» |
| cropped-tailored-jacket | «A cropped jacket with a compact shape and considered proportions.» |
| pleated-wide-trouser | «A wide-leg trouser with front pleats.» |
| cigarette-trouser | «A straight trouser with a narrow leg.» |
| cashmere-rib-crew | «A ribbed crew-neck knit.» |
| fine-merino-turtleneck | «A fine-gauge turtleneck with a close, clean line.» |
| oversized-alpaca-knit | «An oversized jumper with a dropped shoulder.» |
| poplin-column-shirt | «A long, straight shirt with a clean collar.» |
| silk-charmeuse-blouse | «A fluid blouse with a soft collar.» |
| striped-cotton-shirt | «A striped shirt with a classic collar.» |
| bias-cut-slip-dress | «A slip dress cut on the bias with narrow straps.» |
| wrap-wool-skirt | «A midi wrap skirt with a clean front.» |
| pleated-midi-skirt | «A pleated midi skirt with a fluid line.» |
| leather-belt | «A plain belt with a metal buckle.» |
| cashmere-scarf | «A wide scarf in one size.» |
| silk-twill-square | «A square scarf in silk twill, shaped for versatile styling.» |
| structured-tote | «A structured tote bag with two handles.» |
| long-title-fixture-wrap-coat | «A double-faced wool and cashmere wrap coat with a detachable belt and oversized collar.» |

**Blog**

| Antes | Después |
|---|---|
| Título «Welcome to the demo store» | «A study in proportion» |
| Su cuerpo | «A line begins at the shoulder, then softens through the body. We look at proportion as a way to bring ease to the pieces worn every day.» |
| Sus etiquetas | `journal`, `tailoring` |
| Título «How to read the size chart» | «How to read garment measurements» |
| Su cuerpo | «Compare the measurements below each size with a similar piece that fits you well. Check the shoulder, chest and length before choosing a size.» |
| Sus etiquetas | `guide`, `fit` |
| Autor «Demo store» | «proyect-shopi» |

El cuerpo de «How to read garment measurements» remite a medidas «below each size», pero debajo no hay ninguna tabla.

**Tarjeta regalo**

| Antes | Después |
|---|---|
| «This is a gift card for the store.» | «A gift card for a piece chosen by its recipient.» |

### Checklist de Johandry (literal de la entrega, §9)

- [ ] Confirmar en Dev Dashboard si `sartorial-theme-kvkzl39t` es development o client transfer (DP-024).
- [ ] Crear tres tiendas client transfer, una por preset (D67).
- [ ] Asignar a cada tienda su nombre, que también es el logo de texto.
- [ ] Configurar Bogus Gateway o Shopify Payments en modo de prueba y desactivar otros métodos de pago.
- [ ] Habilitar ventas y envío a Canadá o retirar ese mercado.
- [ ] Elegir y acreditar derechos de imagen (DP-025); subir recursos de las tres photo maps.
- [ ] Facilitar credenciales Admin por variable de entorno o ejecutar con acceso los planes T1–T3, con lectura y verificación.
- [ ] Aplicar overlays a temas sin publicar, verificar y publicar cada preset mediante el proceso de Johandry.
- [ ] Aprobar el copy nuevo de §7 y confirmar autor `proyect-shopi` (D35).

### Afirmaciones de la entrega que no se sostienen

| La entrega dice | Lo que hay en realidad |
|---|---|
| M-19 se corrigió «en `snippets/predictive-search.liquid`» | El cambio está en `assets/theme.js` |
| «the preset listing JSON remains handle-neutral» (README de overlays) | Falso: ver el defecto 1 |
| «conservando sus casos límite» | Falso para el título de 120 caracteres |
| Los planes son «idempotentes» | Solo nominalmente: no leen la tienda |
| El PR no quedó abierto | Existe como #26 |
| El tip es `e8531e9` | El tip es `84ff2bd` |
| «gates:static pasó después de cada commit» | No lo verifiqué: solo lo comprobé en la cabeza |

## I. Lo que no pude verificar

**Nada en tienda:**
- la subida a Shopify;
- el comportamiento real de `where`, `reject` y `concat` en el servidor;
- M-06 con medios ya asociados.

**Fuera de la tienda:**
- La ejecución de la CLI de los scripts: me la denegó el clasificador de permisos.
- Los gates en los commits intermedios.
- Si existen en la tienda los handles de fixtures que propone GPT.

Los worktrees de revisión (rama y `master`) se crearon en el scratchpad y se eliminaron. El árbol principal quedó limpio.
