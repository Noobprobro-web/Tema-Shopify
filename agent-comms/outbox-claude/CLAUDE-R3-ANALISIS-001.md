# CLAUDE-R3-ANALISIS-001: Analisis de las auditorias R3, verificacion contra el codigo y reparto Claude/GPT

```text
ID: CLAUDE-R3-ANALISIS-001
Estado: ENTREGADO. Johandry respondio "Ok" al plan y a las recomendaciones (seccion 6); las decisiones
        quedan como base de trabajo en docs/decisions-pending.md (DP-007 a DP-016), sin cerrar.
Decision requerida: confirmacion explicita de DP-007..DP-016 y aprobacion del copy final (D35).
Resumen en 5 lineas:
  1. Dos auditorias estaticas R3 sobre la ZIP fed126f0...cd69f (105 archivos), que es la que genera hoy HEAD 2e94454.
  2. 66 + 18 hallazgos; tras reconciliar, ninguno es falso; varios son parciales o solo verificables en tienda.
  3. Las lineas de 5 archivos de la ZIP NO coinciden con el repo (bloques docs-only): ver seccion 1.
  4. Reparto por archivo en dos ramas: GPT copy/presets/plantillas Liquid poco acopladas; Claude JS, CSS, PDP, carrito, locales e integracion.
  5. Claude es el unico que regenera la ZIP y el manifiesto, al final, con los dos PR integrados.
Archivos tocados: solo documentacion (este archivo, docs/audits/R3/*, agent-comms/inbox-gpt/GPT-TASK-R3-001-copy-plantillas.md,
                  docs/decisions-pending.md, docs/README.md). Nada del tema.
Desviaciones: ninguna.
Verificacion: ZIP regenerada desde HEAD en un directorio temporal: sha256 fed126f030cb626f6210337ee24e45b9a356965f07cd2e2fee6de2fa88acd69f, 105 archivos.
              Las citas archivo:linea de ambos informes son literales en esa ZIP.
```

Fuentes:

- Informe A (IDs `R3-AS-xx`, `R3-SO-xx`): `docs/audits/R3/R3-AUDITORIA-AS-SO.md`.
- Informe B (IDs `R3-FO-xx`, `R3-FB-xx`): `docs/audits/R3/R3-AUDITORIA-FO-FB.md`.
- Encargo para GPT: `agent-comms/inbox-gpt/GPT-TASK-R3-001-copy-plantillas.md`.

En adelante se omite el prefijo `R3-`.

---

## 1. Aviso: desfase de lineas entre ZIP y repo

El empaquetador (`scripts/package-theme-zip.mjs`, `DOCS_ONLY_DELIMITED` y `DOCS_ONLY_LOCALE_KEYS`) elimina los bloques `docs-only` y unas claves de locale. Solo 5 archivos difieren entre ZIP y repo; los otros 100 son identicos byte a byte, asi que sus citas valen tal cual.

| Archivo | Correspondencia ZIP -> repo |
| --- | --- |
| `assets/theme.js` | igual hasta ~5475; despues +58 (5580->5638, 5723->5781, 5769->5827, 5829->5887, 5947->6005); desde ~6298, +63 (6520->6583, 6602->6665, 6707->6770) |
| `assets/base.css` | igual hasta ~6167; 7347->7390, 7381->7424, 7449->7492, 7478->7521, 7998->8041, 8235->8534, 8337->8639, 8452->8814, 8674->9039, 10027->10392, 10288->10653, 10364->10729 |
| `locales/en.default.json` | 378/380->417/419, 597->636 (antes de ~250, igual) |
| `locales/es.json` | 379->418, 464->503 |
| `locales/en.default.schema.json` | igual en las lineas citadas (1193, 1303, 1471) |

En las tablas siguientes, las lineas de esos 5 archivos son del **repo**, salvo que se indique ZIP.

---

## 2. Reconciliacion entre informes

### 2.1 Mismo problema (misma causa raiz)

| Informe A | Informe B | Nota |
| --- | --- | --- |
| AS-03 | FB-34 | Busqueda predictiva cerrada durante el debounce o la peticion |
| AS-05 | FB-19 | Foco de filtros |
| AS-06 | FB-31 | Prioridad LCP en thumbnails |
| AS-07 (4 bloques) | FO-06 (5 bloques) | Comentarios en espanol; B tiene razon, incluye `main-faq` |
| AS-09 | FB-01 | Precio con `money_format` con entidades o HTML |
| AS-11 | FB-50 | `sizes` de `main-list-collections` |
| SO-01 + SO-09 | FB-12 | Copy de demo en presets; B anade el promo del mega menu |
| SO-02 | FB-39 | Placeholder del bento en tienda |
| SO-03 | FB-41 | `<a>` anidado en el bento |
| SO-04 | parte de FO-05 | Quick add con minimo > 1 |
| SO-06 | FB-57 | "Single archival piece" sin mirar el stock |
| residual G-TSR-01 | FO-05 + G-TSR-01 | Volume pricing |

- Solo en A: AS-01, AS-02, AS-04, AS-08, AS-10, SO-08.
- Solo en B: el resto.

### 2.2 Contradicciones resueltas leyendo el codigo

1. **F-TSR-C2 (rich media en `featured-product`).** A lo da por corregido; B (FB-05) dice que no en escritorio. **B tiene razon:** `assets/base.css:10653` oculta los medios del 6.º en adelante desde 62rem. Ademas, shopify.dev pide rich media "in the product template, featured product section, and product forms such as quick view features".
2. **F-LIQ-02/03 y F-SEC-05.** A los da por corregidos; B (FO-07) por abiertos. **B tiene razon,** pero queda un unico caso: `sections/featured-product.liquid:72`. `featured-collection:58` y `blog-posts:61` escapan titulos crudos y estan bien.
3. **AS-01 (A lo califica alto).** **Medio:** exige abrir el panel durante la peticion de variante. Pero es mas amplio de lo descrito: ocurre haya o no ubicaciones (ver tabla 3).
4. **SO-02, SO-03, SO-06 (medio) frente a FB-39, FB-41, FB-57 (bajo).** SO-02 es **medio** porque sale en un preset entregado (Imprint). SO-03 es **bajo** porque exige que el comerciante anada un enlace al cuerpo. SO-06 es **bajo** porque viene apagado, aunque roza la regla "must not mislead ... with false data".
5. **AS-11 medio frente a FB-50 bajo.** **Bajo:** solo afecta al rendimiento y con un ajuste que no es el de defecto.
6. **AS-03 y AS-05 medio frente a FB-34 y FB-19 bajo.** Los hechos coinciden. **Bajo-medio:** solo se ve con red lenta.
7. **FO-03.** B afirma que `es.json` ya es neutro. **Solo a medias:** el titulo si, pero `locales/es.json:420` ("no forma parte de la serie actual... pasado al archivo") mantiene la voz de marca.
8. **FB-35.** El arreglo propuesto (deshabilitar el boton `no-js-only`) **romperia el Enter:** un boton por defecto deshabilitado anula el envio implicito del formulario. Hay que eliminarlo del DOM.

---

## 3. Verificacion contra el codigo y arreglo acordado

Clasificacion: CONF = confirmado leyendo el flujo; PARC = real pero mas acotado; NREP = no reproducible estaticamente (depende de tienda, navegador o payload). Ningun hallazgo resulto FALSO. Dueno: C = Claude, G = GPT.

| ID(s) | Sev. (informe) | Clasif. | Evidencia (repo) | Arreglo acordado | Tam. | Dueno |
| --- | --- | --- | --- | --- | --- | --- |
| AS-01 | alto | CONF, medio | `theme.js:2097-2140` `updateForVariant`: si el panel se abre durante el fetch, `innerHTML=` + `setClosedState()` quitan `data-open` sin `releaseFocusTrap`, `restoreBackgroundInert` ni `syncDialogScrollLocks`; Escape (`:2006`) deja de actuar | `close(false)` si `isOpen` antes de sustituir; no abrir con `aria-busy=true` | S | C |
| AS-02 | medio | CONF | `open()` -> `syncCart` (`:3045`) -> `renderCartPage(null)` (`:3924`) -> `replaceWith` (`:3998`); solo el cajon conserva la nota sucia (`:4014`) | En la sync sin mutacion, no reemplazar /cart si tiene campos cambiados, o copiar sus valores | S | C |
| AS-03 / FB-34 | medio/bajo | CONF | `setOpen(false)` (`theme.js:5826-5829`) anula `requestController`; el `finally` (`:5887`) no limpia `aria-busy`; el `catch` (`:5885`) muestra "sin resultados" | Limpiar el estado al cerrar; relanzar al abrir; mensaje de error propio | S | C (+1 clave) |
| AS-04 | medio | PARC | El select nativo solo cambia `id`; min/step/max (`main-product.liquid:425-427`) y planes (`:620`) son de la variante inicial. Shopify lo rechaza en servidor | Modo `option_links` cuando las variantes difieren en `quantity_rule` o en planes | M | C |
| AS-05 / FB-19 | medio/bajo | CONF | `theme.js:4416`, `:4461` | Respetar `activeEl` si sigue dentro; `origin` solo si el foco cayo a body | S | C |
| AS-06 / FB-31 | bajo | CONF | `main-product.liquid:88,100` | `prioritize` en el medio seleccionado en thumbnails | S | C |
| AS-07 / FO-06 | bajo | CONF | `main-product.liquid:17-21,31-35,47-51,58-62`; `main-faq.liquid:18-22` | Traducir al ingles | S | C (`main-product`), G (`main-faq`) |
| AS-08 | medio | PARC/NREP | Las tarjetas soportan `value.product_url` (`product-card.liquid:78,310`); la ficha no (`theme.js:1019`). Solo Plus | **Aplazado** (DP-012) | M | — |
| AS-09 / FB-01 | medio | CONF (flujo), efecto NREP | Salidas por `textContent`: `theme.js:1120,1122,1239,1243,1275,1754,2458,2545,3545,4899,4901`; solo `formatMoney` decodifica (`:196`); `complete-the-look.liquid:239-240,265-266` usa `money \| escape` | Helper JS `moneyText()` en todas esas salidas (C) + `escape_once` en `complete-the-look` (G) | M | C + G |
| AS-10 | medio | NREP | `theme.js:6005` | Tachar solo si el precio es unico o calcularlo sobre `variants` | S | C |
| AS-11 / FB-50 | medio/bajo | CONF | `main-list-collections.liquid:41` | `render 'card-sizes'` con las columnas del ajuste | S | G |
| SO-01 / SO-09 / FB-12 | medio | CONF | `listings/archive/templates/index.json:82-85`, `listings/imprint/templates/collection.json:10-12`, `sections/header-group.json:34` | Solo copy (D35) | S | G |
| SO-02 / FB-39 | medio/bajo | CONF | `bento-discovery.liquid:156-163` | Placeholder solo con `request.design_mode` (DP-009) | S | C |
| SO-03 / FB-41 | medio/bajo | CONF | `bento-discovery.liquid:100-130` | Contenedor `div` + enlace extendido | M | C |
| SO-04 | medio | CONF | `quick-add-mode.liquid:14-21`, `product-card.liquid:128,384` | `single` con min o incremento > 1 pasa a `options` (va a la ficha) | S | C |
| SO-06 / FB-57 | medio/bajo | CONF | `product-provenance.liquid:23` | `and current_variant.inventory_quantity == 1` | S | G |
| SO-08 | bajo | CONF | `cart-drawer.liquid:199-213` y `main-cart-items.liquid` | Mapear los 4 nombres nativos a `products.product.recipient.*` | S | C |
| FB-02 | medio | CONF | `theme.js:3806`, `:4217` | `showStatus` tras cambiar la cantidad (clave nueva) | S | C |
| FB-03 | medio | CONF | `theme.js:4802-4821` | Margen superior = `--header-offset` + 16 | S | C |
| FB-04 | medio | CONF (patron), tactil NREP | `theme.js:1819,5638,5781` frente a `dismissFromOverlay` (`:54`) | Usar `dismissFromOverlay` en los tres | S | C |
| FB-05 | medio | CONF; requisito oficial | `base.css:10653`; `theme.js:1411` | `data-media-type` en la `figure` (`featured-product.liquid:99`) + CSS que no oculte vídeo ni 3D | S | C |
| FB-06 | medio | CONF | `base.css:10729` gana por orden a `:4699`; placeholder en `curated-showcase.liquid:117-121` | CSS para panel unico; `sizes`; placeholder solo en el editor | S | C |
| FB-07 | medio | CONF | `base.css:379-385` | `overflow-wrap: break-word` en `.product-card__title` | S | C |
| FB-08 | medio | CONF | `section-standard-a.css:106-109,360-363`; `featured-collection.liquid:40-48` | Una pista en `.std-grid--single`; `sizes` acorde | S | C |
| FB-09 | medio | CONF | `bento-discovery.liquid:44-46` + defaults del schema | Quitar los defaults `link` y `heading` (Nivel 2, DP-010) | S | C |
| FB-10 | bajo | CONF | `cart-drawer.liquid:9-12,132,406,413` | Vacio o 0 = sin etapa; mensajes e `info` acordes | M | C |
| FB-11 | medio | CONF | `product-provenance.liquid:3,27-31` | **Aceptado como residual 1.0** (DP-008); `info` aclaratorio | S | C |
| FB-13 | medio | CONF | `main-policy.liquid:37-59`; `base.css:8639` | Dos columnas solo con `:has(> .main-policy__nav:not([hidden]))` | S | C |
| FB-14 | medio | PARC/NREP | `base.css:7423,7492,7520` | `flex-wrap`, `max-width` y `text-overflow` | S | C |
| FB-15 | medio | CONF | `main-product.liquid:360-414`; `theme.js:1886` ya tolera la ausencia | Solo Liquid: pestanas solo si hay cm e in | S | C |
| FB-16 | medio | CONF | 0 reglas `iframe`; `base.css:148-155` | `.rte iframe, embed, object { max-width: 100% }` + `aspect-ratio` | S | C |
| FB-17 | medio | CONF | `base.css:4763-4771`; `listings/imprint/templates/index.json:77` | `data-count` en la rejilla + CSS para 1, 2 y 4 | S-M | C |
| FB-18 | medio | NREP | `marquee.liquid:22-46` | **Aplazado** (DP-014) | M | — |
| FO-04 | medio | CONF | `brand-manifesto.liquid:4-5`, `main-password.liquid:8-11`, `complete-the-look.liquid:5-7`, `lookbook.liquid:5-7`, `hero-editorial.liquid:22`, `bento-discovery.liquid:47,93`, `main-collection.liquid:376`; `responsive-image.liquid:21` | Regla comun (contrato 5.3) | M | G (sus archivos), C (bento) |
| FO-05 / G-TSR-01 | medio | CONF (no se muestra) | `main-product.liquid:425-427`; 0 usos de `quantity_price_breaks` | Texto de la regla en la ficha y en `featured-product`; sin tabla de precios por volumen (DP-007) | M | C |
| FO-07 | medio | CONF | `featured-product.liquid:72` | `escape_once` | S | C |
| FB-20 | bajo | CONF | `theme.js:4047-4067` | `data-focus-key` en Checkout y restauracion por clave | S | C |
| FB-21 | bajo | PARC | `theme.js:4119,3205,5088` | Devolver el foco al submitter si quedo en body | S | C |
| FB-22 | bajo | CONF | `theme.js:5185-5188` | Nombre fijo + `aria-pressed` | S | C |
| FB-23 | bajo | CONF | `theme.js:4090-4096` | Limitarlo al enlace del header | S | C |
| FB-24 | bajo | CONF | `main-collection.liquid:88,97`; `main-search.liquid:95`; `theme.js:640` | Texto `visually-hidden` (G); `role="group"` en el carril (C) | S | G + C |
| FB-25 | bajo | CONF | `base.css:2626,2859,5791` | `outline` `Highlight` en `forced-colors` | S | C |
| FB-26 | bajo | CONF | `marquee.liquid:15-16`; `featured-product.liquid:54` | Quitar `role="region"` del marquee (G); numerar `featured-product` (C, clave nueva) | S | G + C |
| FB-27 | bajo | CONF | `main-search.liquid:336,344` | `h3` | S | G |
| FB-30 | bajo | CONF | `theme.js:6665` | Ampliar la condicion a `[name="updates[]"]` | S | C |
| FB-32 | bajo | PARC | `blog-posts.liquid:25-31,48-50`; `featured-product.liquid:109` | `max_width: 448` si hay un solo articulo (G); `sizes` de `featured-product` (C) | S | G + C |
| FB-33 | bajo | CONF | `theme.js:4269` | `form.noValidate = true` en JS + recorte de valores | S | C |
| FB-35 | bajo | CONF | `product-submit-button.liquid:23-26`; `theme.js:953` | Eliminar el boton `no-js-only` en `takeOverNativeControls` | S | C |
| FB-36 | bajo | CONF | `theme.js:3779` | Plazo + reconciliacion (opcional) | M | C |
| FB-37 | bajo | CONF | `theme.js:5342,5391-5396,6583`; `base.css:8041` | Envolver en `docs-only` y reescribir comentarios (no borrar: lo usa `main-documentation.liquid` del repo) | S | C |
| FB-38 | bajo | NREP | `main-product.liquid:130-133` | **Aplazado** (DP-014) | M | — |
| FB-42 / FB-43 | bajo | CONF | `main-blog.liquid:41,84-90,99-106,102` | Contar tras excluir el destacado; `paginate.items`; destacado solo si lleva la etiqueta; separador dentro de la condicion | S | G |
| FB-45 | bajo | CONF | `lookbook.liquid:94,106,112` | Contador propio | S | G |
| FB-47 | bajo | NREP | `theme.js:6770`; `footer.liquid:73,78`; `newsletter.liquid:53,58` | Mensaje del formulario indicado por `location.hash` | S | C |
| FB-48 | bajo | NREP | `announcement-bar.liquid:42` | **Aplazado** (DP-014) | M | — |
| FB-49 | bajo | CONF | `base.css:4950,8814` frente a `:10392` | `max-height` + `overflow-y` | S | C |
| FB-51 | bajo | PARC | `main-search.liquid:310`, `main-blog.liquid:43,108` | **Aplazado** | — | — |
| FB-52 | bajo | PARC | `collection-list.liquid:91` | Segundo respaldo solo si `card_image == blank` | S | G |
| FB-53 | bajo | CONF | `theme.js:4893-4904` frente a `:1256-1263` | Helper comun de etiquetas de precio | S | C |
| FB-55 | bajo | CONF | `main-collection.liquid:369-370`; `en.default.schema.json:1471` | Etiqueta "Position in grid" | S | C (locale) |
| FB-56 | bajo | CONF | `hero-editorial.liquid:84-90`, `lookbook.liquid:40-46`, `complete-the-look.liquid:118-124` | Anadir 1100w | S | G |
| FB-58 | bajo | NREP | `pickup-availability.liquid:27` | Solo con prueba en tienda | — | — |
| FB-59 | bajo | CONF | `templates/page.faq.json:47-48`; `main-faq.liquid:133` | Plantilla sin boton (`button_label` vacio) o sin el bloque | S | G |
| FB-60 | bajo | CONF | `main-article.liquid:96` | Condicionar el `nav` | S | G |
| FB-61 | bajo | CONF | `main-password.liquid:51` | Respaldo `shop.name` | S | G |
| FO-01 | bajo | CONF | `bento-discovery.liquid:183,228,263`; `brand-manifesto.liquid:91,138`; `main-collection.liquid:588`; `lookbook.liquid:230` | Defaults sin numeracion (Nivel 2, DP-010) | S | C (bento), G (resto) |
| FO-03 | bajo | CONF | `en.default.json:417-419`, `es.json:418-420`; defaults en `main-password.liquid:178`, `main-blog.liquid:198`, `main-list-collections.liquid:99`, `newsletter.liquid:89` | Locales: G propone y C aplica; defaults de G en sus archivos; `newsletter` C | S | G + C |
| FO-08 | bajo | CONF | `lookbook.liquid:167-169`, `complete-the-look.liquid:143-145,412`; `templates/index.json:227`; `listings/archive/templates/index.json:85` | Pie de foto solo con imagen; defaults neutros | S | G |
| FO-09 | bajo | CONF | `complete-the-look.liquid:320-344` (Liquid), `:79-82` y `predictive-search.liquid:31-32` (JS) | Liquid: pasar `count` al nodo plural (G). JS: **aplazado** | S | G |
| FO-11 | bajo | CONF | `layout/password.liquid:131` | `\| escape` | S | G |
| FO-13 | bajo | PARC | `base.css` (`44px` literales; fila "Areas tactiles" `cumplido`) | **Aplazado** (RULES 3.9) | M | — |
| FO-14 | bajo | CONF | `product-card.liquid:57`, `main-collection.liquid:27`, `main-search.liquid:23` | **Aplazado** | S | — |
| G-SEC-04 | residual | CONF | `video.liquid:129` | Anadir `dnt=1` | S | C |
| G-I18N-04 | residual | CONF | `en.default.schema.json:23` "Atelier" | Renombrar la etiqueta (G propone el texto, C lo aplica) | S | C |

Resto de residuales G-xxx: G-I18N-01, G-SEC-01, G-SEC-03, G-I18N-05, G-I18N-06, G-MANT-01, G-PERF-06, G-UX-01. Se proponen como aceptados (DP-015). Ninguno figuraba antes como aceptado en `docs/decisions.md`.

---

## 4. Aplazados y puntos abiertos

**Aplazados:**

- **Hasta medir Lighthouse y CLS (DP-005 / D31):** FB-18, FB-38, FB-48, FB-51, G-PERF-06.
- **Fila verde, no se refactoriza:** FO-13.
- **Idiomas o tiendas que el tema no trae:** FO-09 (parte JS), FO-14.
- **Solo Plus (DP-012):** AS-08.
- **Solo con tienda:** FB-58.
- **Residual aceptado (DP-008):** FB-11.
- **Sin tienda B2B para probar (DP-007):** la tabla de precios por volumen.

**Solo se cierran en tienda real (compuerta 5):**

- FB-01 / AS-09: `money_format` `&pound;{{amount}}` y `<span class=money>${{amount}}</span>`.
- FB-04: tactil real.
- FB-14: 2 mercados y 2 idiomas.
- FB-21: Chromium, Firefox y Safari.
- FB-47: dos formularios `customer`.
- AS-10: payload de `suggest.json`.
- FO-07 y FB-58: comprobar si `t` escapa lo interpolado.
- FB-02 y FB-03 con NVDA o VoiceOver.

**Punto abierto nuevo, sin auditar: rich media en la vista rapida.** shopify.dev pide rich media tambien en "product forms such as quick view features". Nadie ha revisado que muestra el modal de opciones de `product-card` (`product-card-variants`, `snippets/product-card.liquid`) con un producto cuyo medio principal es video o 3D. Dueno: Claude, en la fase A3; primero se verifica y despues, si procede, se abre hallazgo.

**Ledger desactualizado (fuera de R3, se senala):** la fila "Presets Diferenciados" de `docs/requirements-ledger.md` cita el preset "Edition", que hoy es Imprint. Varias evidencias apuntan a lineas antiguas (por ejemplo `theme.js:1-2407`).

---

## 5. Reparto de archivos

Reglas:

- Propiedad por archivo durante toda R3.
- Todo archivo no listado en 5.1 es de Claude.
- Ramas: Claude en `claude/clever-gauss-ddhyr2`; GPT en `gpt/r3-copy-plantillas`, creada desde `master` @ `2e94454`. Nadie hace push a la rama del otro ni force-push.

### 5.1 Archivos de GPT (lista cerrada)

- `listings/archive/templates/{collection,index,product}.json`, `listings/imprint/templates/{collection,index,product}.json`, `listings/sartorial/templates/{collection,index,product}.json`.
- `templates/404.json`, `article.json`, `blog.json`, `cart.json`, `collection.json`, `index.json`, `list-collections.json`, `page.about.json`, `page.contact.json`, `page.faq.json`, `page.json`, `page.policy.json`, `password.json`, `product.json`, `search.json`. `templates/gift_card.liquid` NO es de GPT.
- `sections/header-group.json`.
- `sections/main-blog.liquid`, `main-article.liquid`, `main-password.liquid`, `main-search.liquid`, `main-collection.liquid`, `main-list-collections.liquid`, `main-faq.liquid`, `layout/password.liquid`.
- `sections/lookbook.liquid`, `complete-the-look.liquid`, `brand-manifesto.liquid`, `hero-editorial.liquid`, `marquee.liquid`, `collection-list.liquid`, `blog-posts.liquid`, `snippets/product-provenance.liquid`.
- Su entrega en `agent-comms/outbox-gpt/`.

**Hallazgos de GPT:** SO-01/SO-09/FB-12, FB-59, FO-08, FO-03 (defaults en sus archivos y propuesta de los textos de locale), FO-01 (sus archivos), FO-04 (sus archivos), FO-06 (`main-faq`), FO-09 (Liquid), FO-11, FB-24 (Liquid), FB-26 (marquee), FB-27, FB-32 (`blog-posts`), FB-42, FB-43, FB-45, FB-50/AS-11, FB-52, FB-56, FB-57/SO-06, FB-60, FB-61, AS-09/FB-01 (`escape_once` en `complete-the-look`). Tambien propone textos para G-I18N-04, FB-55 y para los defaults de Claude (bento) si lo cree util.

### 5.2 Archivos de Claude

Todo lo demas. En particular: `assets/**`, `config/**`, `layout/theme.liquid`, `locales/**`, `snippets/**` salvo `product-provenance.liquid`, `templates/gift_card.liquid` y estas secciones: `announcement-bar`, `bento-discovery`, `cart-drawer`, `curated-showcase`, `custom-liquid`, `featured-collection`, `featured-product`, `footer`, `footer-group.json`, `header`, `image-with-text`, `main-404`, `main-about`, `main-cart-items`, `main-contact`, `main-page`, `main-policy`, `main-product`, `newsletter`, `product-recommendations`, `recently-viewed`, `rich-text`, `slideshow` y `video`.

Ademas tiene un escritor unico para `docs/requirements-ledger.md`, `docs/decisions*.md`, `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`, `tests/`, `scripts/`, `package.json` y `.github/`. `agent-comms/BOARD.md` sigue siendo de Gemini.

**Por que `bento-discovery` y `curated-showcase` son de Claude entero:** acumulan hallazgos acoplados con CSS (FB-06, FB-17, SO-03/FB-41, FB-09, SO-02/FB-39, FO-01, FO-04). Partirlos crearia contratos cruzados y una rama que no pasaria las compuertas sola.

### 5.3 Contratos de nombres

Elegidos para que **no haya dependencias cruzadas de compuerta**: `gates:hooks` cruza por componente los `data-*` que lee el JS con los que emite el Liquid, asi que ningun atributo nuevo que lea el JS de Claude vive en un archivo de GPT.

1. **GPT no anade, renombra ni elimina** atributos `data-*`, `id`, clases ni elementos que lea JS o CSS en sus archivos. Las excepciones exactas son estas:
   - `marquee.liquid`: quitar `role="region"` y su `aria-label` (FB-26). Se conservan `data-pause-label`, `data-play-label`, `data-marquee-toggle` y `data-marquee-toggle-label`.
   - `lookbook.liquid` (FB-45): solo cambian el texto visible del numero y el `aria-label` del trigger; `data-lookbook-trigger` y `aria-controls` se mantienen.
   - Clases nuevas: GPT no crea clases nuevas que necesiten CSS. Para el texto oculto de FB-24 usa la utilidad existente `visually-hidden`.
2. **Regla de alt (FO-04)**, la misma para Claude y GPT. Referencia: `sections/image-with-text.liquid:53-55,77-78` y el parametro `decorative` de `snippets/responsive-image.liquid:11`.
   - `alt` = ajuste `image_alt` del comerciante; si esta vacio, `image.alt` de Files.
   - Si ambos estan vacios y la imagen va junto a un titulo visible o dentro de un enlace con texto, `decorative: true` (`alt=""`).
   - Nunca una frase fija del locale ni el titulo repetido.
   - Las claves que queden sin uso (`sections.homepage.manifesto.material_image_alt`, `password.image_alt`, `sections.complete_the_look.image_alt`, `sections.lookbook.image_alt`) se quedan en los locales: la compuerta de locales no falla por huerfanas. Claude las borra en la integracion.
   - Claude reescribe en la integracion el `info` `sections.hero_editorial.settings.image_alt.info` ("Leave empty to use the heading"), que deja de ser cierto.
3. **Dinero (FB-01):** GPT cambia `money | escape` por `money | escape_once` en `complete-the-look.liquid:239-240,265-266`. Claude anade `moneyText()` en `theme.js`, que decodifica entidades, quita etiquetas y es idempotente, asi que funciona antes y despues del cambio de GPT.
4. **Claves de locale:** los arreglos de GPT no necesitan claves nuevas. Todo texto de `locales/` lo propone GPT en su entrega y lo aplica Claude.
5. **Defaults de schema (Nivel 2, DP-010):** cada uno los cambia en sus propios archivos y los lista para aprobacion (D35).

---

## 6. Decisiones (base de trabajo aceptada con "Ok"; pendientes de confirmacion en DP-007..DP-016)

| DP | Tema | Base de trabajo |
| --- | --- | --- |
| DP-007 | Quantity rules / volume pricing | Mostrar la regla (min, incremento, max) en la ficha y en `featured-product`; quick add a la ficha (SO-04); sin price breaks |
| DP-008 | Procedencia y especificaciones por producto (FB-11) | Residual 1.0 con `info` aclaratorio; metafields en 1.1 |
| DP-009 | Placeholders del bento en tienda (SO-02/FB-39) | Solo en el editor, como `curated-showcase` |
| DP-010 | Nivel 2 en bloque, como D26 | FO-01, FB-09 (`link`/`heading`), semantica de umbrales de FB-10 y defaults de FO-03. Lista cerrada: la de la seccion 3 |
| DP-011 | Copy de presets y tienda | Se aplica en las ramas; Johandry aprueba el texto final (D35) |
| DP-012 | Combined Listings en la ficha (AS-08) | Aplazado y documentado |
| DP-013 | Sin JS con reglas o planes distintos por variante (AS-04) | Se implementa el modo `option_links` |
| DP-014 | CLS/rendimiento estimados (FB-18, FB-38, FB-48, G-PERF-06) | Aplazados hasta la medicion de DP-005 |
| DP-015 | Residuales G-xxx | Aceptados con dueno, salvo G-SEC-04 y G-I18N-04, que se arreglan |
| DP-016 | Severidad de AS-01 | Medio; se arregla en la fase A1 |

---

## 7. Plan de Claude (orden, verificacion, integracion)

Todo en `claude/clever-gauss-ddhyr2`; cada fase termina con `npm run gates:static`.

1. **Fase L (locales, primero).**
   - Claves nuevas en `en.default.json` y `es.json`: `sections.cart.quantity_updated` (FB-02), `sections.cart.shipping_unlocked` y la variante solo regalo (FB-10), `predictive_search.error` (FB-34), `products.product.quantity_rules.{min,max,increment}` (DP-007) y el nombre numerado de `featured-product` (FB-26).
   - En `en.default.schema.json`: FB-55, los `info` de FB-10 y FB-11, y G-I18N-04 (texto propuesto por GPT si llega a tiempo).
2. **Fase CSS** (`base.css`, `section-standard-a.css`): FB-05, FB-06, FB-07, FB-08, FB-13, FB-14, FB-16, FB-17, FB-25, FB-49 y FB-37 (CSS).
3. **Fase PDP** (`main-product`, `featured-product`, `variant-no-js-select`, `product-submit-button`, `quick-add-mode`, `product-card`): AS-04, AS-06/FB-31, FB-05 (`data-media-type`), FB-15, FB-26 (`featured-product`), FB-32 (`featured-product`), FO-05/DP-007, FO-06 (`main-product`), FO-07, SO-04.
4. **Fase HOME de Claude** (`bento-discovery`, `curated-showcase`, `video`): FB-06 (Liquid), FB-09, FB-17 (`data-count`), FO-01, FO-04, SO-02/FB-39, SO-03/FB-41, G-SEC-04.
5. **Fase CART** (`cart-drawer`, `main-cart-items`): FB-02 (atributo de plantilla), FB-10, FB-20 (`data-focus-key`), SO-08.
6. **Fase JS** (`theme.js`, en serie):
   - A1 dialogos: AS-01, FB-03, FB-04, FB-21, FB-22, FB-23, FB-35.
   - A2 cajon: AS-02, FB-02, FB-20, FB-30 y FB-36 opcional.
   - A3 busqueda, filtros y precio: AS-03/FB-34, AS-05/FB-19, FB-33, AS-10, FB-01, FB-53, FB-47, FB-37 (docs-only), FB-24 (carril) y la revision de rich media en la vista rapida.
   - Para FB-53, confirmar que `gates:hooks` acepta leer `data-label-*` del `price` renderizado. Si no, leerlos con `wrapper.dataset`, como ya hace `VariantSelects` (`theme.js:1256`).
7. **Tests Playwright nuevos, en local** con los assets reales (patron de `tests/slideshow-reconnect.spec.mjs` + `page.route`):
   - carrera de pickup;
   - reapertura de la predictiva;
   - foco de filtros con respuesta lenta;
   - `moneyText` con `&pound;` y `<span>`;
   - anuncio de cantidad en `[data-cart-status]`;
   - cierre tactil del overlay;
   - anchos de `.std-grid--single`, `.main-policy__body` y bento con 4 hijos;
   - `iframe` de 560 px a 390 px.
8. **Integracion (en serie, tras fusionar los dos PR):**
   - Aplicar el copy de locale propuesto por GPT (una vez aprobado), borrar las claves huerfanas de FO-04 y reescribir el `info` del alt del hero.
   - Actualizar `docs/requirements-ledger.md` con las filas declaradas por GPT y por Claude, mas filas nuevas: "Reglas de cantidad visibles" y "Contenido RTE embebido".
   - `npm run gates:static` y Playwright.
   - Regenerar la ZIP y `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`.
   - Compuerta 5 en `sartorial-theme-kvkzl39t` (D38).

**Manifiesto:** ninguna compuerta ni el CI comparan `ZIP-FINAL-MANIFEST-1.0.0.txt` con el SHA de la ZIP. `gates:package` (`package.json:16`) y el paso "Verify Packaging" de `.github/workflows/ci.yml` solo generan la ZIP, sin `--expect-sha256`. En cada rama la ZIP cambiara de SHA y el manifiesto quedara desfasado hasta la integracion: es lo esperado y no rompe ninguna compuerta.
