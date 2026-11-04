ID: CLAUDE-REVIEW-C-08-001 (revisión independiente de la tarea de código C-08, fases C-08a y C-08b, según D11)
Estado: Revisión emitida. Veredicto: ACEPTADO. C-08 queda en `código completo` (estático); la prueba en tienda sigue pendiente en R-A (D22). Sin P0 ni P1. Un P2 fuera de alcance (traducciones al español de las tiendas demo) y siete P3 no bloqueantes.
Decisión requerida: del coordinador, (1) commit de los 28 archivos (en uno o en dos commits; el parche de C-08a del implementador es exacto, ver §1.3) y registro de D26 (autorización de Nivel 2 de Johandry, 2026-11-04) en el commit; (2) asignar P2-1 a R-A/D-01-L. Johandry: nada nuevo.
Resumen en 5 líneas:
1. Aplicando los scripts de la directiva v2 (hashes idénticos) sobre una copia limpia de `git archive HEAD` (64862d1), primero C-08a y luego C-08b, el resultado es idéntico byte a byte al árbol de trabajo: 667 archivos rastreados comparados, 0 diferencias. No hay ningún cambio fuera de los scripts.
2. Verificaciones repetidas: `c08_verify` a y b OK; barrido 71 tras C-08a y 35 tras C-08b, iguales a las tablas de §5.3; JSON válido; Theme Check 0 ofensas; complejidad 120/111 (a) y 120/110 (b); locales 437 y luego 434 hojas, sin huérfanas, en/es en paridad; `theme-check-sanity` exit 0.
3. Barrido propio en en/es (devoluciones, envío, plazos, garantías, hecho a mano, certificaciones, origen, numeración, procedencia, atribuciones y CTA/destinos): ningún residuo nuevo dentro del alcance. Todo lo que queda está en la tabla de §5.3 o en O-01 a O-29.
4. Comportamiento (estático): con textos de entrega o devoluciones vacíos no se renderiza nada (no hay contenedor por bloque). `contact[Reason]` sigue siendo un select con etiqueta, `required` y 4 motivos. Los 24 defaults son neutros, están en sentence case y las dos ayudas siguen en `t:`. El español es correcto.
5. Fronteras respetadas: no toca snippets (A-02), `provenance_notes`, los siete `info` de A-02 (`en.default.schema.json:1011-1067`) ni `listings/sartorial/templates/index.json:35,52` (C-04-N). D-01-V solo con las reetiquetas decididas en C-2. La desviación D-1 es razonable.
Archivos tocados: solo este archivo nuevo, `agent-comms/outbox-claude/CLAUDE-REVIEW-C-08-001.md`. Las pruebas se hicieron en copias dentro de `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rev-c08/`. Sin git de escritura, sin tiendas, sin `.secrets`, sin valores de entorno y sin gate5.
Desviaciones (Nivel 1 o Nivel 2): Ninguna en esta revisión. El Nivel 2 de C-08b (N2-1, N2-2 y N2-3) lo autorizó Johandry el 2026-11-04 (D26, se registra en el commit). La revisión comprueba que lo ejecutado no va más allá de esa autorización.
Hallazgos extra fuera de alcance (con parche listo): Sin parche. P2-1 (traducciones al español de las tiendas demo y diccionario `scripts/translations/es.storefront.json`, dueño D-01-L/R-A) y P3-5 (`<dl>` vacío del contacto, para la revisión visual de R-A). Ver §6.
Verificación (comando, resultado y qué demuestra/qué no): §1 a §5, con las salidas literales. Demuestra que el árbol de trabajo es exactamente el resultado de los scripts aprobados, que las compuertas estáticas pasan en las dos fases y que no quedan promesas en alcance según el barrido de la directiva y el propio. No demuestra el renderizado, el comportamiento en tienda, la existencia de los destinos de los CTA, los títulos reales de las colecciones ni el estado de las traducciones de las tiendas demo.
Lista de afirmaciones falsables numeradas:
1. `sha256sum` de los cinco scripts extraídos con el comando de §1.4 de la directiva da exactamente los cinco hashes de v2.
2. Sobre `git archive HEAD` (64862d1): `c08a_apply.py` y luego `c08b_apply.py` producen un árbol cuyos 667 archivos rastreados (sin `agent-comms/`) son idénticos byte a byte al árbol de trabajo, y la lista de archivos coincide.
3. `git diff HEAD --name-only` da 28 archivos: la unión de las listas cerradas de §4.1. `git diff HEAD --name-only -- agent-comms` da 0. Los únicos archivos no rastreados son tres informes de `agent-comms/outbox-claude/`, más esta revisión.
4. `scratchpad/c08/phase_a.patch` (del implementador), aplicado a `git archive HEAD`, da el mismo árbol que `c08a_apply.py` (`diff -rq` vacío).
5. Barrido: 296 antes, 71 tras C-08a y 35 tras C-08b. Las dos tablas `uniq -c` coinciden línea a línea con §5.3.
6. Theme Check en el repo tras C-08b: «93 files inspected with no offenses found.». Con el conjunto de copia de la directiva sobre HEAD da 92 (la diferencia es previa a C-08).
7. Complejidad: `main-product` 120 y `featured-product` 111 tras C-08a; 120 y 110 tras C-08b.
8. `grep -rnE "delivery_fallback|returns_fallback|contact\.services\.response|reason_appointment" …` da 15 tras C-08a y 0 tras C-08b.
9. En las 64 secciones de plantillas y grupos, `blocks` y `block_order` coinciden. Ninguna categoría del FAQ queda sin pregunta.
10. `scripts/translate-storefront.mjs --check` (sin red) pasa de 8 problemas en HEAD a 66 tras C-08 (exit 1 en ambos), con 58 entradas del diccionario obsoletas por C-08.
11. Compuerta del literal: 0 en los 28 archivos, en el informe y en esta revisión; `ctx-check` da 0 fuera de `tests/vendor/axe.min.js`.

---

# 0. Contrato y método

- Contrato: directiva v2 `agent-comms/outbox-claude/CLAUDE-DIRECTIVA-C-08-001.md` (§1.4, §3, §4, §5, §7, §8, anexos), R-D `CLAUDE-REVIEW-C-08-RD-001.md` (M-1 a M-8, F-1 a F-5, C-1 a C-4), decisión `agent-comms/outbox-gpt/GPT-DECISION-LOTE-0-04-C08-001.md` (criterios 1 a 5, citados en §2.2 de la directiva), plan V4.1 (fila C-08 :195, R-A :376, R-C :378 y R-G :380, frontera C-04-N :169), `AGENTS.md` (las 5 compuertas) y `agent-comms/RULES.md` §1.3-1.4 y §3.5.
- Autorización de Nivel 2: Johandry, 2026-11-04 (D26). El informe la cita en la línea 2: «Autorizar los tres (Recomendado)». Comprende N2-1 (ocultar los bloques vacíos), N2-2 (24 defaults) y N2-3 (retirar «Private appointment»), que es exactamente lo que contiene `c08b_apply.py`.
- Método: copias en `rev-c08/` (`pre` = HEAD, `A` = HEAD + C-08a, `AB` = HEAD + C-08a + C-08b, `pA` = HEAD + el parche de fase a del implementador), comparaciones byte a byte y compuertas repetidas en el repositorio, sin escribir en él.

# 1. Reproducción de los scripts y comparación byte a byte

## 1.1 Hashes

```text
4ca494f36afc827bef5d1052696b4e563bd4bc221c90547539a192606077138d  c08_complexity.sh
ce012a431c1e65e60a2021fa21493e4703f82b36f69b12c7559f95056df30981  c08_grep.sh
21312b3b06fb67c9a0094b6c1848156c05b0c14f1970bfc44e999a5c242f777e  c08_verify.py
f4aba7a77d28ed5d8770750a9fdaa4ac74d8cae02d8deece9794f85af24b1709  c08a_apply.py
6b029845866af7980c3eb5e40115854ef74607c41023e22c969a114291e00554  c08b_apply.py
```

Coinciden con §1.4 de la directiva y con el informe.

## 1.2 Aplicación sobre una copia limpia de HEAD (64862d1)

```text
--- pre
296
C08_VERIFY_FAIL
  templates/index.json:marquee: bloque marquee_series sigue presente …
--- A
C08_APPLY_OK archivos=18
C08_VERIFY_OK fase=a plantillas_revisadas=28
C08_VERIFY_FAIL
  locale: clave sections.main_product.blocks.shipping_lead_time.delivery_fallback sigue presente …
71
--- AB
C08_APPLY_OK archivos=18
C08_APPLY_OK archivos=13
C08_VERIFY_OK fase=b plantillas_revisadas=28
35
--- rerun
C08_APPLY_FAIL: sections/main-product.liquid: se esperaba 1 coincidencia y hay 0: …
C08_APPLY_FAIL: sections/main-contact.liquid: se esperaba 1 coincidencia y hay 0: …
```

(`c08_verify AB a` falla, como debe: la fase a comprueba el estado intermedio. Las dos segundas ejecuciones fallan sin escribir.)

## 1.3 Comparación con el árbol de trabajo

```text
$ git ls-files | grep -v '^agent-comms/' | wc -l          -> 667
$ for f in …; cmp -s "$f" "AB/$f"                          -> diffs=0
$ diff <(git ls-files sin agent-comms) <(find AB …)        -> (vacío)
$ git diff HEAD --name-only -- agent-comms | wc -l         -> 0
$ git status --short --untracked-files=all | grep -v '^?? agent-comms/'   -> solo los 28 « M »
$ diff -rq pre A | wc -l -> 18 ;  diff -rq pre AB | wc -l -> 28
$ git apply phase_a.patch (sobre HEAD) ; diff -rq pA A     -> PHASE_A_PATCH_EQUALS_SCRIPT_A
```

Resultado: el árbol de trabajo es idéntico al de los scripts. No hay ningún cambio fuera de ellos. El parche de C-08a que el implementador dejó en `scratchpad/c08/phase_a.patch` reproduce exactamente C-08a (18 archivos, 116+/312-), así que el coordinador puede separar los dos commits sin reconstruir nada.

# 2. Verificaciones repetidas

## 2.1 Tras C-08b (repositorio)

```text
$ python3 -I c08_verify.py . b              -> C08_VERIFY_OK fase=b plantillas_revisadas=28
$ bash c08_grep.sh . | wc -l                -> 35
$ (tabla uniq -c) vs §5.3 tras C-08b        -> idéntica (solo difieren las líneas ``` de la extracción)
$ node scripts/json-validate.mjs            -> json_exit=0
$ npx shopify theme check --path .          -> │  93 files inspected with no offenses found.  │  (tc_exit=0)
$ node scripts/theme-check-sanity.mjs       -> sanity_exit=0 ; «[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.»
$ node scripts/locale-key-inventory.mjs     -> locale_exit=0
    Claves en en.default.json:        434 hojas
    Claves en en.default.schema.json: 500 hojas
    Sin resolver en storefront:     0
    Sin resolver en schema:         0
    Construidas en runtime:         0
    Huerfanas en storefront:        0
    Huerfanas en schema:            0
$ paridad (node -e … §5.2 paso 9)           -> en 434 es 434 en-es 0 es-en 0
$ c08_complexity.sh .                       -> sections/featured-product.liquid 110 / sections/main-product.liquid 120
$ grep '"page":|"page_content":' templates listings | wc -l          -> 0
$ grep fallbacks|services.response|reason_appointment … | wc -l       -> 0
```

No aparece ningún aviso `LiquidComplexity`; `main-product.liquid` queda en 120, el máximo permitido.

## 2.2 Tras C-08a (copia `A`)

```text
theme check --path A        -> │  93 files inspected with no offenses found.  │
c08_complexity.sh A         -> featured-product 111 / main-product 120
json-validate (A)           -> json_exit_A=0
locale-key-inventory (A)    -> 437 hojas; sin resolver 0/0; huérfanas 0/0
paridad (A)                 -> en 437 es 437 en-es 0 es-en 0
criterio 12 (A)             -> 15
barrido (A)                 -> 71; tabla uniq -c idéntica a §5.3 tras C-08a (SWEEP_A_MATCH)
```

## 2.3 O-1 del informe (93 frente a 92 archivos)

```text
theme check --path <git archive HEAD completo>                                   -> 93 files inspected with no offenses found.
theme check --path <copia "cp -r assets config layout locales sections snippets
                    templates listings scripts package.json .theme-check.yml">  -> 92 files inspected with no offenses found.
```

La diferencia la produce el conjunto de archivos que la directiva copió, es anterior a C-08 y no tiene que ver con él. Cierra la O-1 del informe (P3-4).

## 2.4 Coherencia estructural de las plantillas

```text
blocks frente a block_order (templates/*.json, listings/*/templates/*.json, sections/*.json) -> secciones= 64 inconsistencias= 0
```

FAQ (`templates/page.faq.json`): `cat_shipping→q_dispatch`, `cat_sizing→q_size`, `cat_care→q_care`, `cta`. Ninguna categoría se queda sin pregunta. El placeholder de F-5 («Shipping, sizing, care») coincide con las tres categorías.

# 3. Barrido propio independiente de promesas residuales

Herramienta propia (`rev-c08/my/strings.py`). Extrae todos los valores de cadena de los JSON de `templates/`, `listings/`, `sections/*.json`, `config/` y de los locales de tienda; los `default`/`content` de schema de `sections/`, `snippets/` y `layout/`; los literales `default:` de Liquid y el texto visible del marcado. Excluye soporte y documentación (O-04). Usé dos baterías de patrones en/es:

- P1: devoluciones/reembolsos, envío gratuito/complimentary, despacho/mensajería/seguimiento, días hábiles y `[0-9]+ días/horas/semanas`, garantías, hecho a mano/artesano, certificaciones/orgánico/sostenible/reciclado, made in/origen/Italia/Milán/Biella/París/Amberes/Japón, numerado/limitado/series pequeñas, procedencia/circa/décadas/vintage/restaurado/conservación/auténtico/inspección/grado, materiales concretos (seda, lana, cachemir, cuero, titanio, aluminio, nylon), impermeable/ensayado/tolerancia, a medida/cita/showroom/concierge/reparación/arreglos, head of/fundador/equipo/«a person», asegurado/exprés/internacional, early/first access, privado/exclusivo/invitación, horarios, trazable/fibras naturales, ready to ship, respuesta/plazos, calidad/lujo/premios.
- P2: ship/arrive/packaging/gift wrap, care label, muestras, fitting, medidas/guía de tallas, pago aplazado, sostenibilidad/eco/vegano, local/familia/since/founded, prensa/reseñas/valoraciones, best seller/últimas unidades/stock, pre-order/bajo pedido/encargos/personalización/grabado.

Además: todos los pares etiqueta → URL de CTA de plantillas y listings, y la lectura completa de las cadenas visibles de `templates/index.json`, `templates/product.json`, los tres `index.json` y los tres `collection.json` de los listings y `sections/header-group.json`.

Resultado: dentro del alcance no queda nada sin justificar. Todo lo que aparece está en la tabla de residuos de §5.3 o en O-01 a O-29:

| Residuo encontrado | Clasificación |
| --- | --- |
| Barra de envío gratuito y regalo (`locales/*:cart.*`, ayuda de schema) | O-06 (opcional, desactivada por defecto, con `info`) |
| «Taxes and shipping calculated at checkout.» y variantes | O-07 |
| `products.product.provenance.*`, «Archival provenance», «Origin and craftsmanship» | O-14 / A-02 (bloques vacíos y ocultos; `provenance_notes` intacto) |
| «INDIVIDUALLY NUMBERED ATELIER EDITIONS», «ATELIER EDITIONS / 02» | O-03 / C-04-N |
| «Form follows engineering tolerance.», «True bespoke luxury lives in the invisible mastery of the cut.», «What endures carries…», «Objects gain meaning through the hands that make them.» | O-08 (aforismos; R-A los revisa en contexto, R-D Q-1) |
| «Private correspondence», «PRIVATE SALON CORRESPONDENCE», «TECHNICAL DISPATCH», «New vault accession notices», «Engineering telemetry & field updates» | O-22 a O-24 y sus equivalentes nominales |
| «Explore the autumn edit», «Explore the series» → `/collections/the-autumn-series` | O-28 / nominal |
| Defaults de `size_guide` («Model is 178cm…») | O-05 / D-02-T |
| Handles con años (`1994-cashmere-cocoon-coat`) | O-10 / D-01 |
| CTA de Imprint «Inspect system inventory» y «Inspect collection» → `/collections/daily-objects` | Sin promesa: el destino es un listado de productos, es decir, un inventario. No es de la clase D de F-1/F-2. Sin acción. |
| «Three objects from the archive record» (lookbook de Archive) | Coincide con los tres marcadores del bloque; nominal. Sin acción. |

Ninguna búsqueda de plazos numéricos (`[0-9]+ ?(day|días|hours|horas|weeks|semanas)`) devuelve resultados en el alcance. Fuera del ZIP sí queda contenido obsoleto (P2-1).

# 4. Comportamiento (estático)

## 4.1 Bloques de entrega y devoluciones vacíos (N2-1)

- `sections/main-product.liquid:675-693`: `when 'shipping_lead_time', 'trust_badges'`, luego `assign trust_text = block.settings.delivery_text | default: block.settings.returns_text | strip` (`:676`) y `if trust_text != blank` (`:677`). Los filtros se aplican de izquierda a derecha: un campo vacío da `nil`, `strip` lo convierte en `""` y no se pinta nada; un campo con solo espacios tampoco pinta nada.
- `sections/featured-product.liquid:420-437`: igual, con `featured_product != blank and trust_text != blank` (`:422`).
- No hay contenedor por bloque: el bucle `for block in section.blocks` / `case block.type` (`main-product.liquid:200-201,710-711`; `featured-product.liquid:89-90`) emite el `<p class="product-trust">` directamente. Si el texto está vacío no queda ningún contenedor vacío ni ningún encabezado huérfano. La regla `.product-trust + .product-trust` (`assets/base.css:9671`) sigue funcionando cuando uno de los dos bloques falta.
- El schema de los dos bloques no tiene default de texto (`main-product.liquid:1031-1045`; `featured-product.liquid:711-724`). Las ayudas de T-06 (`en.default.schema.json:972,984`) dicen ahora «Leave blank to hide this block.», en `t:` y en sentence case. No queda ningún otro lector de `delivery_text`/`returns_text` (`grep` solo devuelve `:421` y `:676`).
- Las siete superficies con texto vaciado (los cuatro `product.json` y los tres `featured_product` de los listings, `index.json:86/109/121`) quedan ocultas.

## 4.2 Formulario de contacto (N2-3)

`sections/main-contact.liquid:110-117`: `<label for="{{ contact_reason_id }}">` + `<select id=… name="contact[Reason]" aria-required="true" required>` con una opción vacía de placeholder y 4 motivos (order, materials, press, other). Cada `value` es la cadena traducida con `escape`. Sigue siendo válido y accesible; el placeholder vacío obliga a elegir. Ningún JS, prueba ni CSS depende de la opción retirada (`grep -rn appointment|contact\[Reason\] assets layout snippets tests scripts docs/merchant` solo devuelve el diccionario de P2-1 y la regla CSS sin uso O-17). Mensaje de éxito: «Thank you. Your message has been sent.» / «Gracias. Tu mensaje se ha enviado.», correcto cuando `form.posted_successfully?`.

## 4.3 Los 24 defaults (N2-2)

Recuento en el diff: `announcement-bar` 1, `brand-manifesto` 3, `hero-editorial` 2, `main-about` 6, `main-contact` 7, `main-faq` 2, `main-password` 2 y `newsletter` 1, en total 24. Se retiran 4 (`studio_hours`, `showroom_address`, `opening_note` y `text` del newsletter); los cuatro tienen ocultación funcional comprobada (`main-contact.liquid:41,47`, `main-password.liquid:92`, `newsletter.liquid:21-25` cae a `newsletter.copy`). Se neutralizan 20, todos en sentence case y sin hechos: «Explore the collection», «Describe the ideas behind your work.», «Add a short detail», «Form in quiet movement», «Materials»/«Process»/«Collection» y sus «Describe…», «Contact», «Write to us about an order or a product.», «When will my order arrive?», «Add the answer your customers need here.», «Order questions», «Send us a message through our contact page.», «Contact us» y «Leave your email address to join our mailing list.». Los defaults siguen siendo literales, como en todo el tema (§4.3 de la directiva; las etiquetas, que es lo que debe ir en `t:`, no cambian). Las URL por defecto junto a los CTA nuevos (`/collections/all` en `announcement-bar.liquid:151` y `brand-manifesto.liquid:120`) coinciden con sus etiquetas.

## 4.4 Español

Valores nuevos en `es.json`: «En existencias», «Gracias. Tu mensaje se ha enviado.», «Suscribirse», «Puedes darte de baja cuando quieras.», «Gracias por suscribirte.» (dos veces), «Suscríbete a nuestro boletín.» y «Envíos, tallas, cuidados». Son correctos, neutros y tienen la misma estructura que el inglés. Se retiraron las claves equivalentes en los dos idiomas (paridad 434/434).

## 4.5 Otras ausencias citadas por la directiva (comprobadas en el código)

`brand-manifesto.liquid:30` (cuerpo) y `:65` (`<dl>` solo si `section.blocks.size > 0`); `main-about.liquid:71` (figcaption) y `:159` (pie); `snippets/mega-menu.liquid:165` (subtítulo); `bento-discovery.liquid:108` (cuerpo); `curated-showcase.liquid:40-42` (pestaña vacía → título de la colección → `tab_fallback`). Las siete se cumplen.

# 5. Fronteras e informe

## 5.1 Fronteras

```text
git diff HEAD -U0 -- locales/en.default.schema.json | grep '^@@'  -> @@ -972 +972 @@ / @@ -984 +984 @@   (los siete info de A-02 están en :1011-1067: intactos)
git diff HEAD | grep -c provenance_notes                          -> 0
git diff HEAD --name-only | grep -c '^snippets/'                  -> 0
listings/sartorial/templates/index.json:35,52                     -> sin cambios («INDIVIDUALLY NUMBERED ATELIER EDITIONS», «ATELIER EDITIONS / 02»; C-04-N)
listings/imprint/templates/collection.json                        -> solo @@ -13 @@ (F-2, link_label); :12 (texto instructivo, D-01-V) intacto
```

No toca `assets/`, `config/`, `layout/`, `templates/password.json`, soporte ni documentación, `docs/**` ni `scripts/**`. Con D-01-V solo hay las tres reetiquetas de CTA decididas en la R-D C-2 (I-02, F-1, F-2), sin cambiar URL ni narrativa técnica. No hay notas de versión (C-04-R) ni toca soporte (C-04-P).

## 5.2 Informe `CLAUDE-REPORT-C-08-001.md`

- Las afirmaciones del informe que he podido comprobar son ciertas: hashes, `APPLY_OK`/`VERIFY_OK`, barridos 71 y 35, Theme Check 93/0, complejidad, hojas y paridad, criterio 12 (15 y luego 0) y las citas de §5. Solo «featured `:421-422`» es aproximada: la rama empieza en `:420`.
- Estado «código completo (estático)», sin `cumplido` y sin editar el ledger: correcto (RULES §3.8, D22).
- Desviación D-1 (C-08b aplicada sin el commit intermedio de C-08a): razonable. Los scripts no dependen del commit; la verificación `a` pasó antes de C-08b; el resultado es idéntico a aplicar a→b sobre HEAD (§1.3); y el parche de fase a reproduce C-08a exactamente, así que la trazabilidad por fase se puede recuperar en el commit. Una consecuencia menor es que hay un solo informe en lugar de dos (P3-3).
- Defectos de forma en P3-1 y P3-2.

# 6. Hallazgos

Sin P0 ni P1.

| ID | Prioridad | Archivo:línea | Evidencia | Corrección / dueño |
| --- | --- | --- | --- | --- |
| P2-1 | P2 (fuera de alcance, no bloquea C-08) | `scripts/translations/es.storefront.json` (p. ej. `:318,322,325-329,355,365`) y las traducciones `es` ya registradas en las tiendas demo | C-08 deja obsoletas 58 entradas del diccionario, no solo las dos de la línea 318/718 que cita §7.3. `env -i … node scripts/translate-storefront.mjs --check`: HEAD «check: 8 problemas», tras C-08 «check: 66 problemas» (exit 1 en ambos). El script no puede volver a registrar promesas, porque exige que el digest coincida (`translate-storefront.mjs:17-19,123`). Riesgo **no verificado**: en las tiendas demo, si se actualiza el tema existente en lugar de instalar uno nuevo, las traducciones al español de las claves neutralizadas (p. ej. la respuesta de envío de contacto y FAQ, los marquees o el subtítulo del héroe) pueden seguir mostrándose como traducciones desactualizadas con la promesa antigua. Además, los textos neutros nuevos no tienen traducción al español en la tienda. | R-A/R-Demo: revisar el storefront `/es` de cada demo tras subir el candidato, en las superficies de §5.4. D-01-L: actualizar el diccionario a los textos neutros y retirar las entradas obsoletas (sin parche aquí: fuera del ZIP y de la lista cerrada). |
| P3-1 | P3 | `CLAUDE-REPORT-C-08-001.md:11-13` | La cabecera no reproduce los rótulos literales de RULES §1.4 («Desviaciones (Nivel 1 o Nivel 2):», «Hallazgos extra fuera de alcance (con parche listo):», «Verificación (comando, resultado y qué demuestra/qué no):») y le falta el campo «Lista de afirmaciones falsables numeradas:», que solo aparece al final, en §10. | Aplicarlo en los informes siguientes; no hace falta reeditar este. |
| P3-2 | P3 | `CLAUDE-REPORT-C-08-001.md:29-31,47-50,243` | La línea base y el ensayo están resumidos, no pegados literalmente (RULES §1.3), y falta la tabla «ID → archivo:línea nuevo → resultado» que pide §8 punto 7 de la directiva («no se transcribió fila a fila»). Lo compensa esta revisión, que reprodujo todas las salidas (§1-§2) y la equivalencia byte a byte con los scripts. | No bloquea. Para próximas tareas, pegar las salidas literales. |
| P3-3 | P3 | Directiva §8 frente al informe | La directiva pedía un informe por fase (`…-001` y `…-002`); hay uno solo, consecuencia de D-1. | El commit y D26 citan este informe y esta revisión para las dos fases. |
| P3-4 | P3 | Informe `:259` (O-1) | 93 frente a 92 archivos «no investigado». | Resuelto en §2.3: lo produce el conjunto de copia de la directiva y es anterior a C-08. |
| P3-5 | P3 (extra conocido, R-D extra a) | `sections/main-contact.liquid:40-53`; `assets/base.css:5838-5843,5854-5858` | Con horario y dirección vacíos (R-27), el `<dl class="main-contact__atelier-facts">` vacío sigue siendo un elemento de la rejilla `.main-contact__header` (`display:grid; gap: var(--space-xl)`). En móvil eso añade un hueco extra de `--space-xl` bajo la intro; en escritorio deja vacía la columna derecha. Es HTML válido. | Revisión visual en R-A. Si molesta, envolver el `<dl>` en `if section.settings.studio_hours != blank or section.settings.showroom_address != blank` (Nivel 1; +2 de complejidad en `main-contact.liquid`, archivo sin límite cercano). Tarea aparte. |
| P3-6 | P3 | `sections/main-product.liquid:677-678`; `featured-product.liquid:422-423` | `{{ block.shopify_attributes }}` solo se emite si hay texto, así que un bloque «Delivery message»/«Returns message» recién añadido no se ve en la vista previa del editor hasta que tiene texto. Es el comportamiento autorizado en N2-1 y lo explica la `info`. | Comprobar en el editor en R-A. Sin cambio. |
| P3-7 | P3 (exactitud de la directiva, afirmación 3) | `main-product.liquid:676`; `featured-product.liquid:421` | El marcado es idéntico «para cualquier valor no vacío» salvo en una cosa: los espacios al principio y al final del texto ahora se recortan (`| strip` antes de `escape`). No tiene efecto visual. | Ninguna; queda anotado. |

# 7. Compuertas (AGENTS.md)

1. **Requisitos:** C-08 no cierra filas. La propuesta de ledger de §6 de la directiva (fila 88 a `código completo` cuando R-A acepte C-08b; filas 84, 22, 109 y 111 sin cambio) es coherente con lo ejecutado. La evidencia está en §4.1 (`main-product.liquid:675-693`, `featured-product.liquid:420-437`). Nada pasa a `cumplido`.
2. **Estados degenerados (estático):** *vacío*, sin `<p>`, sin `<dl>` del manifiesto, newsletter con el texto del locale, contacto sin servicios ni nota (pero ver P3-5); *uno solo*, marquee raíz con 2 ítems, Archive con 3 y 2 pestañas; *muchos*, sin cambios; *muy largo*, mismo escape (con recorte de extremos, P3-7); *faltante*, pestaña sin colección → `tab_fallback`, destino ausente → 404 sin promesa.
3. **Consistencia:** el texto neutro de envío está repetido literalmente en `page.faq.json` y `page.contact.json`; el de cuidado, en el FAQ, el contacto y los cuatro `product.json`; `in_stock` coincide con `predictive_search.in_stock`; T-22 reutiliza los defaults de `main-faq`; los dos SVG por rama no se duplican; un único `newsletter.copy`.
4. **Superficie del comerciante:** ninguna etiqueta nueva; las dos `info` cambiadas siguen en `t:`, en sentence case y en inglés neutro, y describen el comportamiento nuevo; sin jerga.
5. **Tienda real:** no aplica (D22). Pendiente en R-A: la ficha de producto y el producto destacado con los dos campos vacíos y llenos y con cada icono; el editor (P3-6); FAQ, contacto (P3-5), about, contraseña y home de los tres presets; los destinos de §5.4 de la directiva; el storefront `/es` (P2-1).

# 8. Compuerta del literal y ctx-check

Copia adaptada de `count-two.py` (`rev-c08/count-rev.py`): deriva el literal en memoria igual que el original y solo imprime `ruta=N`. Se ejecutó desde la raíz del repositorio.

```text
$ python3 -I rev-c08/count-rev.py $(git diff HEAD --name-only) agent-comms/outbox-claude/CLAUDE-REPORT-C-08-001.md agent-comms/outbox-claude/CLAUDE-REVIEW-C-08-001.md
$ (misma orden) | awk -F= '{print $2}' | sort | uniq -c
     31 0                      # 28 archivos del tema + informe + revisión + línea total, todos =0
$ python3 -I rev-c08/count-rev.py agent-comms/outbox-claude/CLAUDE-REVIEW-C-08-001.md agent-comms/outbox-claude/CLAUDE-REPORT-C-08-001.md
agent-comms/outbox-claude/CLAUDE-REVIEW-C-08-001.md=0
agent-comms/outbox-claude/CLAUDE-REPORT-C-08-001.md=0
total=0
$ python3 -I ctx-check.py
./tests/vendor/axe.min.js lineas_literal_contexto= 1
total_lineas_literal_contexto= 1
fuera_de_tests_vendor_axe= 0
```

# 9. Veredicto

**ACEPTADO.** El código de C-08a + C-08b es exactamente el de los scripts aprobados (directiva v2 + R-D), dentro de la autorización de Nivel 2 de Johandry (D26) y de las listas cerradas, con las compuertas estáticas en verde y sin promesas residuales en alcance. No hay que cambiar nada en los 28 archivos. P2-1 queda para R-A/D-01-L; los P3 no bloquean. El estado máximo es `código completo`, hasta R-A en tienda.
