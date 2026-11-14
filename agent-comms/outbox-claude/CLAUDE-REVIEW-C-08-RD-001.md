ID: CLAUDE-REVIEW-C-08-RD-001
Estado: R-D emitida. Veredicto: APROBADA CON CAMBIOS (M-1 a M-8, §8). Nivel 2 de C-08 (N2-1, N2-2 y N2-3): NO AUTORIZADO por esta R-D, porque no tiene autoridad para hacerlo (D11 solo cubre A-02). REQUIERE AUTORIZACIÓN DE JOHANDRY.
Decisión requerida: (1) Johandry: autorizar o denegar por escrito el Nivel 2 de C-08b (§5.3; D10, cambio fuera de las decisiones registradas). (2) Coordinador: incorporar M-1 a M-8 y partir la directiva en C-08a (Nivel 1, puede ejecutarse ya según D9) y C-08b (Nivel 2, espera a Johandry). Si M-1 a M-8 se incorporan tal cual, no hace falta otra R-D.
Resumen en 5 líneas:
1. Reproducido: los SHA-256 de los tres anexos coinciden; sobre una copia del árbol actual (A-02/A-03 aplicados), el Anexo A da `C08_APPLY_OK archivos=27`, el Anexo B `C08_VERIFY_OK plantillas_revisadas=28` y el Anexo C 35 residuos; JSON válido, Theme Check 91/0, inventario de locales sin huérfanas, en/es 434/434.
2. Inventario sólido, pero incompleto: faltan 2 CTA engañosos de Imprint de la misma clase que I-02, un default con fecha («Autumn / Winter 26») y, en AR-08, el vaciado hace aparecer el título de catálogo «Restored Pieces». Hay además 10 textos conservables que no están clasificados.
3. Los tres cambios señalados (fallbacks, 23 defaults y la opción «Private appointment») son Nivel 2 según RULES §3.5. Ni D11 ni esta R-D pueden autorizarlos.
4. Se propone partir la directiva: C-08a (18 archivos, todo el contenido de plantillas y locales) avanza ya; C-08b (13 archivos, Liquid, defaults y claves de los fallbacks) espera a Johandry. Ambas partes se probaron en copias.
5. Decisiones: C-2, I-02 se queda en C-08 (sin Johandry); C-3, se conserva la barra (sin Johandry); C-4, se acepta el residuo hasta C-04-N; Q-1 a Q-6 resueltas en §6, con la fila 88 en `código completo` cuando R-A acepte C-08b.
Archivos tocados: solo este archivo nuevo, `agent-comms/outbox-claude/CLAUDE-REVIEW-C-08-RD-001.md`. Las pruebas se hicieron en copias dentro de `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rd-c08/`. Sin git de escritura, sin tiendas, sin `.secrets`, sin variables de entorno y sin gate5.
Desviaciones (Nivel 1 o Nivel 2): Ninguna en esta revisión. Esta R-D no autoriza ningún Nivel 2.
Hallazgos extra fuera de alcance (con parche listo): Sin parche. (a) `<dl class="main-contact__atelier-facts">` queda vacío si no hay horario ni dirección (`sections/main-contact.liquid:41-54`). Es válido y no tiene borde (`assets/base.css:5854-5858`), pero R-A debe revisarlo visualmente. (b) Los extras de §7.3 de la directiva se confirman.
Verificación (comando, resultado y qué demuestra/qué no): §1. Demuestra que los anexos son íntegros y que la edición propuesta y su partición dejan las compuertas estáticas en verde sobre copias. No demuestra el renderizado ni el comportamiento en tienda, ni la existencia de destinos, ni los títulos reales de las colecciones (ese dato viene de un rastreo antiguo, ver F-4).
Lista de afirmaciones falsables numeradas:
1. `sha256sum` de los scripts extraídos con el comando de §1.4 da exactamente los tres hashes declarados. La directiva mide `7f53483fec801b23babdf4f9b5bc775d50ae918a726a4a218ae35843918fce64`.
2. Sobre una copia del árbol actual, el Anexo A modifica 27 archivos, el Anexo B da OK y el Anexo C devuelve 35 líneas, que son las 37 de §5.3 menos `period selection` y `circa 1`. Una segunda ejecución del Anexo A falla sin escribir.
3. Sobre `git archive eb7cca7`, el barrido da 295 líneas antes y 37 después.
4. `listings/imprint/templates/index.json:70` («Inspect blueprint», enlace a `/collections/leather-goods`) y `listings/imprint/templates/collection.json:13` («View specifications», enlace a `/collections/daily-objects`) no están en el inventario de la directiva.
5. `sections/hero-editorial.liquid:404` tiene el default `"Autumn / Winter 26"` y no está inventariado.
6. La partición C-08a + C-08b (§5.4) produce el mismo árbol que el Anexo A más los cambios M-2. Theme Check da 0 ofensas en las dos fases.
7. Ninguna cadena nueva de la directiva contiene material, origen, proceso, plazo, coste, persona, certificación, fecha ni cantidad. La única objeción de calidad es AR-08 (F-4), por el título de catálogo que hace aparecer.

---

# 0. Identidad de lo revisado

- Directiva: `agent-comms/outbox-claude/CLAUDE-DIRECTIVA-C-08-001.md` (sin seguimiento en git), 1266 líneas, SHA-256 `7f53483f…918fce64`.
- Repositorio: rama `lote-a`, HEAD `eb7cca7`. Cambios rastreados sin commit (A-02/A-03): `assets/base.css`, `listings/archive/templates/index.json` (`provenance_notes` vaciado), `locales/en.default.schema.json` (los siete `info` de F4, líneas 1008-1067), `snippets/product-provenance.liquid` y `snippets/product-technical-specs.liquid`.
- Fuentes leídas: `AGENTS.md`; `agent-comms/RULES.md` (§1.3-1.4, §2, §3.5, §3.8-3.9, §4.2, §5); plan V4.1 (§4.1 C-08 y A-02, §4.3 C-04-N/P/R y párrafo RC-07, §4.4 D-01-V, §5.1, §5.2 R-A/R-C, §6); `GPT-DECISION-LOTE-0-04-C08-001.md`; D9-D18 (`CLAUDE-DECISION-AUTONOMIA-001.md`) y D20-D24 (`CLAUDE-DECISION-LOTE-0-002.md`); `docs/requirements-ledger.md` (filas de las líneas 22, 84, 88, 109 y 111); `CLAUDE-REVIEW-A-02-RD-001.md` (§2 y M-9); `CLAUDE-DIRECTIVA-A-02-001.md` (F4); el origen de V-05 en `GPT-AUDIT-THREE-THEMES-VISUAL-001.md:152-156`.
- Directorios de prueba: `rd-c08/cur` (árbol actual + Anexo A), `rd-c08/curpre` (árbol actual sin C-08), `rd-c08/base` (`git archive eb7cca7` + Anexo A), `rd-c08/splitA` y `rd-c08/splitAB` (partición), `rd-c08/splitP` (mitigación opcional de la contraseña). Scripts propios en `rd-c08/tools/`.

# 1. Verificación independiente (punto 2 del encargo)

Extraje los scripts con el comando literal de §1.4 a `rd-c08/tools/`, no con los del redactor:

```text
ed1bd633cabd0c891ee38c470b877143192595119abf73ccb2f48ec673124106  c08_apply.py   (= declarado)
90f4b9967003df0e77865135b2dd88dd9c9bd0f62f22ce566b333ae852ab18ea  c08_verify.py  (= declarado)
d824d9ba766e151e3b4bd098febc1d6d9f6855a80e2a9abf80442056b3f52ef4  c08_grep.sh    (= declarado)
```

Copia del árbol actual (`cp -r` de assets, config, layout, locales, sections, snippets, templates, listings, scripts, `package.json` y `.theme-check.yml`):

```text
bash c08_grep.sh curpre | wc -l            -> 293   (295 de eb7cca7 menos las 2 líneas que retiró A-02)
python3 -I c08_verify.py curpre            -> C08_VERIFY_FAIL (templates/index.json:marquee: bloque marquee_series sigue presente …)
python3 -I c08_apply.py cur                -> C08_APPLY_OK archivos=27 (los 27 de §4.1)
python3 -I c08_apply.py cur  (2.ª vez)     -> C08_APPLY_FAIL: sections/main-product.liquid: se esperaba 1 coincidencia y hay 0 …  exit=1
python3 -I c08_verify.py cur               -> C08_VERIFY_OK plantillas_revisadas=28
bash c08_grep.sh cur | wc -l               -> 35  (tabla = las 37 de §5.3 sin «period selection» ni «circa 1»)
node scripts/json-validate.mjs             -> Fallos de parseo: 0 ; json_exit=0
node scripts/locale-key-inventory.mjs      -> estáticas 424; en.default.json 434 hojas; schema 500; sin resolver 0/0; runtime 0; huérfanas 0/0; locale_exit=0
paridad en/es (comando §5.2 paso 8)        -> en 434 es 434 en-es 0 es-en 0
grep '"page":|"page_content":' (paso 9)    -> 0
grep fallbacks/claves retiradas (paso 10)  -> 0
shopify theme check --path curpre          -> 91 files inspected with no offenses found.
shopify theme check --path cur             -> 91 files inspected with no offenses found.
node scripts/theme-check-sanity.mjs (cur)  -> OK. Las 3 clases se detectaron por separado … ; sanity_exit=0
diff -rq curpre cur                        -> exactamente los 27 archivos de §4.1
```

Sobre `git archive eb7cca7`: el barrido da 295 antes y 37 después, y la verificación da OK, como declara la directiva.

El árbol cambió durante esta revisión por trabajo de otros agentes. Al cerrarla, `git log` muestra `a6a9074` (A-02) y `c81cbcb` (A-03) con commit en `lote-a`, y hay cambios sin commit de A-01/B-02: `sections/main-product.liquid` (hunks en `:26`, `:229`, `:489` y `:593`), `sections/featured-product.liquid`, `assets/theme.js`, `layout/theme.liquid`, `docs/requirements-ledger.md` y el nuevo `snippets/variant-no-js-select.liquid`. Sobre una copia nueva de ese árbol (`rd-c08/now`), el Anexo A sigue dando `C08_APPLY_OK archivos=27`, `C08_VERIFY_OK plantillas_revisadas=28` y 35 residuos. Las ediciones de A-01/B-02 no chocan con las regiones de T-01 a T-04. C-08 debe ejecutarse después del commit de A-01/B-02, porque el preflight de §1.2 exige árbol limpio.

La lectura del diff confirma estas premisas:

- Liquid. `main-product.liquid` envuelve cada `<p class="product-trust">` en `if … != blank`. En `featured-product.liquid` la condición queda `featured_product != blank and … != blank` y el `endif` existente se reutiliza.
- No hay otro lector. `grep -rn "delivery_text\|returns_text" sections snippets layout assets/*.js` solo devuelve esas dos secciones, y ninguno de los dos settings tiene `default` en el schema (`main-product.liquid:1029-1031,1053-1055`; `featured-product.liquid:694-696,718-720`).
- Tampoco quedan fallbacks de texto en Liquid. `grep -rnE "\| *default: *'…'|_fallback"` solo encuentra esquemas de color y `curated-showcase` `tab_fallback` («Collection N», neutro).

Las citas de línea de la directiva coinciden con `eb7cca7`; comprobé por muestreo `en.default.json:157,215,231,616,620,631`, `main-contact.liquid:115,211`, `lookbook.liquid:218` y `listings/sartorial/templates/index.json:35,52`.

# 2. Completitud y clasificación del inventario (punto 1)

Método propio: `rd-c08/tools/strings.py` extrae todo el texto visible de `templates/`, `sections/*.json`, `listings/`, `config/settings_data.json`, `locales/en.default.json` y `locales/es.json`, más los defaults de texto y los presets de los schemas y el texto literal del marcado Liquid. Revisé a mano las 1029 cadenas resultantes del árbol editado y crucé los CTA con sus destinos. Barrido amplio en/es sobre devoluciones, envío, plazos, garantía, artesanía, certificaciones, origen, numeración, procedencia, atribuciones y destinos. La revisión excluye `page.support/documentation` y `main-support/documentation`, que pertenecen a C-04-P.

## 2.1 Hallazgos que faltan (en alcance según la regla §3.0 de la propia directiva)

| ID | Ubicación | Texto y destino | Tipo | Tratamiento exigido |
| --- | --- | --- | --- | --- |
| F-1 | `listings/imprint/templates/index.json:70` (`discovery.blocks.story.link_label`) | «Inspect blueprint» enlaza a `/collections/leather-goods`. Promete un plano y lleva a un listado; es la misma clase que I-02. | D | Neutralizar a «Explore leather goods» (C-08a). |
| F-2 | `listings/imprint/templates/collection.json:13` (`technical_tile.link_label`) | «View specifications» enlaza a `/collections/daily-objects`, la «tarjeta naranja» de V-05 (`GPT-AUDIT-THREE-THEMES-VISUAL-001.md:153-154`). O-15 solo cubre su texto, no el CTA. | D | Neutralizar a «Explore daily objects» (C-08a). El archivo entra en la lista cerrada. El texto instructivo sigue siendo de D-01-V (O-15). |
| F-3 | `sections/hero-editorial.liquid:404` | Default de `heading` «Autumn / Winter 26». La regla §3.0 incluye las fechas en PR, y aparece en cuanto el comerciante añade la sección. | PR | Neutralizar el default a «Form in quiet movement», el heading ya empaquetado en `templates/index.json`. Es un default, así que va a C-08b (N2-2 pasa de 23 a 24). |
| F-4 | AR-08, `listings/archive/templates/index.json:62` (`decade90`, colección `restored-pieces`) | Con `tab_label: ""` la pestaña muestra el título de la colección. El rastreo `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-links-crawl.json:3480` lo registra como «Restored Pieces». El cambio del tema haría aparecer una afirmación de restauración (PR) donde antes no estaba. Eso choca con el criterio 2 de la decisión: no introducir otra afirmación al neutralizar. | PR | Usar `tab_label` «Selected pieces», en coherencia con AR-02 «View the selection». `decade80` se queda en `""` («Permanent Archive», rótulo nominal). |

## 2.2 Conservables encontrados sin clasificar (se añaden a §3.6, sin edición)

Hay que listarlos de forma explícita para que R-A y R-C no tengan que decidirlos de nuevo. Mi dictamen es conservarlos por la regla §3.0, porque son rótulos o ambiente sin un hecho concreto:

- `sections/main-password.liquid:172,178`: «Private collection / New edition» y «The next study opens quietly.» (se ven en la contraseña).
- Encabezados de newsletter: «New vault accession notices» (Archive), «Engineering telemetry & field updates» (Imprint) y el eyebrow «PRIVATE SALON CORRESPONDENCE» (Sartorial). Describen un boletín de novedades, sin servicio, fecha ni cantidad.
- «CURATORIAL PROTOCOL / ARCHIVE 02» (`listings/archive/templates/index.json`, eyebrow del manifiesto).
- El capsule de Imprint: «A modular rig for daily carry, field telemetry and technical desk deployment.» (misma familia que O-16).
- «[04] BLUEPRINT ANALYSIS» (eyebrow de F-1; la narrativa es de D-01-V).
- Mega menú `sections/header-group.json`: «Explore the autumn edit». Es una temporada sin año.
- `en.default.json`/`es.json`: `not_found.message` («…current series… moved into the archive.»), `password.image_alt` («Editorial preview of the next collection») y `sections.homepage.manifesto.region_label` («Our craft and materials», rótulo ARIA).

## 2.3 Recomendado, no bloqueante

- F-5 (C, coherencia): `faq.search.placeholder` dice «Shipping, sizing, returns» / «Envíos, tallas, devoluciones». Tras R-19 el FAQ ya no tiene preguntas de devoluciones. Propuesta (Nivel 1, C-08a): «Shipping, sizing, care» / «Envíos, tallas, cuidados», que son las categorías que quedan.

## 2.4 Clasificación existente

- Las 102 filas están bien tipadas. Las clasificaciones dudosas, que acepto, son: T-10 como P (plazo de respuesta, aunque sea marcado fijo); S-04/S-05 como PR (pasarela); R-07 como D, por la coherencia con R-29 aunque el destino `/pages/about` exista.
- O-06 contiene una premisa inexacta: «el texto solo aparece si el comerciante la activa y fija su umbral». Los umbrales tienen default 150 y 250 en el schema (`sections/cart-drawer.liquid`, `free_shipping_threshold` y `atelier_gift_threshold`) y en Liquid (`:9-10`, `| default: 150` y `| default: 250`). Basta con activar la casilla para que se muestre «free shipping» a 150. La conclusión de conservarla no cambia (C-3), pero el texto debe corregirse (M-3).

# 3. Calidad de las cadenas neutras nuevas (Q-3)

Revisé todas las sustituciones de los anexos (E2-E7) en el diff de `rd-c08/cur`.

- **No factuales.** Ninguna aporta material, origen, proceso, plazo, coste, servicio, persona, ensayo, certificación, fecha ni cantidad. Los casos límite son aceptables:
  - «Modular gear and desk objects for daily carry.»: «modular» es un adjetivo genérico admitido por §3.0.
  - «…photographed in salon light.»: es el pie de una foto; la variante raíz equivalente ya se conserva.
  - «Contact us before ordering…» y «contact us with your usual size…» invitan a contactar sin prometer respuesta, plazo ni servicio, y se apoyan en el formulario de contacto del tema.
  - «Thank you. Your message has been sent.» describe el resultado del envío, que la plataforma confirma.
- **Marquees inventados (S-03, I-03).** «PROPORTION / CUT / DRAPE», «TAILORING», «SILHOUETTE STUDIES», «TECHNICAL STUDIO», «DAILY OBJECTS» y «DESK AND STUDY» son rótulos sin ningún hecho. Aceptados.
- **«Explore the collection» como anuncio (T-14/R-01).** Es neutro y coincide con su destino `/collections/all`. Aceptado.
- **Etiquetas de CTA.** Coinciden con el nombre del destino (R-07, S-02, I-02, I-06, AR-02, AR-05, AR-17). La excepción es AR-08, corregida en F-4.
- **Inglés neutro y sentence case.** Los defaults y el copy de plantilla van en sentence case; los marquees y eyebrows en mayúsculas siguen la convención visual existente. No se añade ni cambia ningún label. Las dos `info` de T-06 siguen detrás de las mismas claves `t:` (`sections.main_product.blocks.*.settings.*.info`), en sentence case, y describen el comportamiento nuevo. `locale-key-inventory` da 0 sin resolver en el schema. Los defaults de schema siguen siendo literales, como todos los del tema; no es una regresión de la compuerta 4, que exige `t:` en labels e info.
- **Defaults instructivos** («Describe the ideas behind your work.», «Add a short detail», «Add the answer your customers need here.»). Es la práctica estándar de defaults que el comerciante reemplaza, y no se empaquetan en ninguna plantilla. Aceptados.
- **Traducciones es.** Son correctas y neutras: «En existencias», «Gracias. Tu mensaje se ha enviado.», «Suscribirse», «Puedes darte de baja cuando quieras.», «Gracias por suscribirte.», «Suscríbete a nuestro boletín.». Están en paridad de claves (434/434). El copy de plantillas y listings no tiene versión es en el paquete; `scripts/translations/es.storefront.json` queda obsoleto (extra de §7.3, D-01-L).

# 4. Respeto de fronteras (punto 4)

| Frontera | Comprobación | Resultado |
| --- | --- | --- |
| A-02 (M-9) | `diff -u curpre cur` de `listings/archive/templates/index.json` no toca `provenance_notes`, `provenance` ni `technical_specs`. En `en.default.schema.json` solo cambian 4 líneas (`:972,984`), fuera de los siete `info` de F4 (`:1008-1067`). No se toca ningún snippet. | Respetada. |
| C-04-N | `listings/sartorial/templates/index.json` `editions` («INDIVIDUALLY NUMBERED ATELIER EDITIONS») y `:52` quedan intactos. Ningún identificador renombrado. Las cadenas conservadas por el plan (`:19,53,70,107,128`, `collection.json:10`, `templates/index.json:90`) no cambian. | Respetada. |
| C-04-P | Ninguna edición en support/documentation; el barrido los excluye por nombre. | Respetada. |
| C-04-R | No se escriben notas de versión. | Respetada. |
| D-01-V | I-02 y, con M-2, F-1 y F-2 solo cambian la etiqueta del CTA para que coincida con el destino. La URL, la narrativa técnica, la tarjeta instructiva y el material por tipo siguen siendo de D-01-V. | No invade (C-2, §6). |
| A-01/B-02 | El script falla sin escribir si sus ediciones tocan las regiones T-01 a T-04. | Correcto. |

# 5. Nivel de desviación y autoridad (C-1)

## 5.1 Regla

RULES §3.5. Nivel 1 es lo que «no altera contratos con el comerciante, ni `id`, ni `default`». Nivel 2 es lo que «toca un `id`, altera un `default`, añade opciones a un select…» y queda «PROHIBIDO implementar sin autorización previa y explícita de Gemini». RULES §4.2 pide que la directiva lo autorice expresamente. D11 traslada esa autorización al revisor **solo para A-02** («Para A-02, la autorización técnica de Nivel 2 la da ese revisor»). Ni el plan V4.1 ni la decisión C08 asignan la autorización técnica de Nivel 2 de C-08. La decisión C08 es de contenido y dice de sí misma que «no autoriza ejecutar C-08». Extender D11 por analogía, como propone la directiva, sería atribuirse una autoridad que Johandry delimitó de forma expresa.

## 5.2 Clasificación

| Cambio | Nivel | Motivo |
| --- | --- | --- |
| N2-1. Retirar los fallbacks de entrega y devoluciones (T-01 a T-04), con las ayudas `info` de T-06, las claves de T-05 y el efecto en R-11 | **Nivel 2** | Cambia el contrato con el comerciante. La `info` vigente le dice que un campo vacío muestra «a neutral checkout/policy message», y ahora el vacío oculta el bloque. El fallback hace de default efectivo del setting. No es Nivel 1, porque el Nivel 1 exige «no altera contratos con el comerciante». |
| N2-2. Los 23 defaults de schema (T-14 a T-27), 24 con F-3 | **Nivel 2** | Literal en RULES §3.5: «altera un `default`». |
| N2-3. Quitar «Private appointment» del formulario de contacto (T-09 y su clave) | **Nivel 2** (clasificación conservadora) | Cambia el conjunto de valores de `contact[Reason]` que recibe el comerciante y es el caso simétrico de «añade opciones a un select». Es el más débil de los tres, pero la duda se resuelve hacia el lado que exige autorización. |
| Resto: contenido de plantillas y listings (R-, S-, I-, AR-, F-1, F-2, F-4), valores de locale (T-07, T-08, T-11 a T-13, F-5) y retirada del marcado de la nota de respuesta con su clave (T-10) | Nivel 1 | Sin `id`, sin `default`, sin opciones y sin cambio de comportamiento de ningún setting. |

**N2-1, N2-2 Y N2-3 SON NIVEL 2 Y REQUIEREN AUTORIZACIÓN DE JOHANDRY (D10: CAMBIO FUERA DE LAS DECISIONES REGISTRADAS; D11 SOLO DELEGA EN EL REVISOR EL NIVEL 2 DE A-02). ESTA R-D NO LOS AUTORIZA.** Johandry puede autorizarlos él mismo, delegar la autorización en el revisor Opus de C-08 (ampliando D11) o remitirla a Antigravity (RULES §3.5). Cualquiera de las tres vías debe quedar registrada por escrito antes de ejecutar C-08b.

## 5.3 Pregunta para Johandry (texto propuesto)

> C-08 necesita tres cambios de contrato con el comerciante para cumplir tu decisión del 2026-11-02 sin dejar promesas en fallbacks ni defaults: (1) si los textos de entrega o devoluciones de la ficha de producto quedan vacíos, el bloque se oculta en vez de mostrar «Delivery times and costs confirmed at checkout» / «Returns subject to our store policy»; (2) 24 textos por defecto de secciones dejan de incluir promesas (envío gratis a 150 $, «hecho a mano», horario, Milán, «first access»…); (3) el formulario de contacto deja de ofrecer «Private appointment». ¿Los autorizas, total o parcialmente, o delegas la autorización en el revisor?

## 5.4 Partición para que el Nivel 1 avance sin esperar (probada)

- **C-08a (Nivel 1, ejecutable ya por D9).**
  - **Filas.** R-01 a R-30 (R-11 sin edición), S-01 a S-14, I-01 a I-14, AR-01 a AR-17, T-07, T-08, T-10, T-11, T-12 y T-13, más F-1, F-2, F-4 y, si se acepta, F-5.
  - **Archivos (18).**
    - Locales: `locales/en.default.json` y `locales/es.json`.
    - Secciones: `sections/header-group.json` y `sections/main-contact.liquid` (solo la nota de respuesta).
    - Plantillas raíz: `templates/index.json`, `templates/product.json`, `templates/page.faq.json`, `templates/page.contact.json` y `templates/page.about.json`.
    - Listings: los 9 archivos de `listings/*/templates/*.json`, incluido `listings/imprint/templates/collection.json` por F-2.
  - **Script.** El Anexo A sin E1 (salvo la retirada de `main-contact__response-note`) y sin E2. En E3 se ejecutan solo `stock`, `succ`, `resp`, `pw`, `nl` y `nls`, sin `appt`, `fb`, el bloque de fallbacks de es ni las `info`. Se añaden F-1, F-2 y F-4 tras sus filas.
  - **Resultado probado en `rd-c08/splitA`.** Prueba del revisor, no normativa: `C08_APPLY_OK archivos=18`; JSON 0; locales 437/437 y huérfanas 0/0; Theme Check 91/0. El barrido da 70 líneas: las 35 finales más 35 de C-08b. La diferencia está en `rd-c08/splitA-residuals.txt` contra `full-residuals.txt`: fallbacks y «appointment» de locales, más los defaults de 9 secciones.
  - **Estado intermedio documentado.** Las siete superficies con `delivery_text`/`returns_text` vaciado y R-11 muestran el fallback genérico existente hasta C-08b. Es el estado que ya tiene hoy `templates/product.json`. C-08 no se acepta en R-A hasta que C-08b se aplique o Johandry decida otra cosa.
- **C-08b (Nivel 2, espera la autorización escrita).**
  - **Filas.** T-01 a T-06, T-09 y T-14 a T-27, más F-3.
  - **Archivos (13).** `locales/en.default.json`, `locales/es.json`, `locales/en.default.schema.json` y diez secciones: `main-product`, `featured-product`, `main-contact`, `announcement-bar`, `brand-manifesto`, `hero-editorial`, `main-about`, `main-faq`, `main-password` y `newsletter`.
  - **Resultado probado en `rd-c08/splitAB`, después de C-08a.** `C08_APPLY_OK archivos=13`, `C08_VERIFY_OK plantillas_revisadas=28`, barrido de 35 líneas y Theme Check 91/0. El árbol es idéntico a `rd-c08/cur` salvo los 4 archivos de F-1 a F-4.
- **Si Johandry deniega:**
  - N2-1: nueva R-D para retirar de las 7 plantillas los bloques `shipping_lead_time` y `trust_badges` vacíos. Es Nivel 1, pero deja el fallback para los bloques que añada el comerciante como residuo documentado.
  - N2-2: mitigación opcional de Nivel 1 en `templates/password.json`, con `"text"` neutro y `"opening_note": ""`, probada en `rd-c08/splitP` con Theme Check 91/0. Corrige la página de contraseña visible sin tocar defaults.
  - N2-3: la opción se queda como residuo con dueño, y C-08 no se puede cerrar.

# 6. Decisiones (punto 6)

- **C-2 (I-02 frente a D-01-V): se queda en C-08, sin Johandry.** La decisión C08 (2026-11-02) es posterior a la aprobación del plan (2026-10-31). Su criterio 3 ordena tratar «CTA, enlaces u otros destinos engañosos», y el criterio 4 pide «definir el tratamiento concreto de cada enlace». La fila C-08 del plan incluye el «destino instalado». Cambiar la etiqueta para que coincida con el destino es Nivel 1, reversible y no reasigna nada: D-01-V conserva la narrativa, el destino técnico real, la tarjeta instructiva y el material por tipo, y puede volver a etiquetar cuando aporte un destino técnico. Por coherencia, F-1 y F-2 reciben el mismo tratamiento (M-2).
- **C-3 (barra de envío gratuito y regalo): se conserva, sin Johandry.** Es una función opcional del comerciante, desactivada por defecto (`enable_tiered_progress` false), sin activación en `config/settings_data.json` ni en plantillas, y su `info` exige que coincida con las tarifas reales. Retirarla sería un cambio funcional fuera del plan. Hay que corregir la premisa de O-06 sobre los umbrales por defecto (M-3).
- **C-4 («NUMBERED»): se acepta el residuo hasta C-04-N (Lote C, D23), sin Johandry.** Ejecutar aquí el copy de C-04-N reasignaría una tarea del plan. R-A lo registra como residuo conocido con dueño C-04-N; R-C verifica que desaparece (M-6); R-G no puede encontrarlo.
- **Q-1. Se confirma la conservación de O-08, O-09 y O-16**, más los de §2.2. «Objects gain meaning through the hands that make them.», «True bespoke luxury lives in the invisible mastery of the cut.» y «Made slowly, kept closely.» son aforismos sin un hecho medible de los productos. «Made slowly» es el caso más cercano al límite; R-A lo vuelve a valorar en contexto.
- **Q-2. «Unsubscribe at any time.» se conserva.** Darse de baja del marketing es una función de la plataforma (consentimiento de marketing del cliente). No está verificado en tienda: R-A comprueba que el formulario de la contraseña crea un cliente con consentimiento revocable. No hace falta tocar `main-password.liquid`.
- **Q-3. Aceptadas con el cambio F-4** (§3).
- **Q-4. Se mantienen los bloques vacíos en las plantillas**, para que sigan visibles en el editor y ocultos en tienda, siempre que C-08b se autorice. Si se deniega N2-1, se aplica la alternativa de §5.4.
- **Q-5. Fila 88 (línea 88, «Capa de Confianza e Inventario Reactivo en PDP», hoy `cumplido`).** Transición fijada para el futuro, sin mover la fila ahora: cuando R-A acepte C-08b, propone `código completo` con evidencia archivo:línea nueva (condiciones de `main-product.liquid` y `featured-product.liquid`) hasta la prueba en preview. El motivo es que la certificación citada (Couture #165809488115) no cubre el comportamiento nuevo. C-08a solo cambia el copy de `in_stock` y no altera el estado; basta una nota en la evidencia. RULES §3.9 no se infringe, porque el cambio lo ordena una decisión expresa de Johandry, que está por encima de Gemini en la jerarquía. La edición del ledger la hace su responsable, no el implementador. Filas 22, 84, 109 y 111: se acepta la propuesta de §6 de la directiva. RC-07/TT-63 no tiene fila y no se inventa ninguna (plan §4).
- **Q-6. Esfuerzo:** 1-2 h, coherente con la estimación. La partición añade unos 30 min de redacción y verificación. C-08a cuesta alrededor de 1 h y C-08b alrededor de 1 h tras la autorización. La prueba en tienda de R-A queda pendiente de credenciales (D22).

# 7. Criterios y pruebas (punto 7)

Los criterios son verificables y repetibles por R-A y R-C, con estos defectos (se corrigen en M-4 a M-6):

1. **El residuo esperado depende del orden con A-02.** M-9 de A-02 fija que A-02 se hace commit antes de C-08, así que el valor principal debe ser 35 (37 queda solo como contingencia).
2. **La tabulación de §5.2 trunca coincidencias con «:».** `awk -F: '{print $1": "tolower($3)}'` corta, por ejemplo, «10:00» en «10», como observé en `splitA`. Hay que usar `awk -F: '{m=$3; for(i=4;i<=NF;i++) m=m":"$i; print $1": "tolower(m)}'`.
3. **El Anexo C no cubre F-1 a F-3.** Hay que añadir `inspect blueprint|view specifications|winter [0-9]{2}` al `PAT` y recalcular las líneas de `eb7cca7` y las finales.
4. **El Anexo B no distingue fases.** C-08a necesita su propia verificación: secciones 1 a 3 completas, más `contact.services.response` ausente, paridad, y `delivery_fallback`/`returns_fallback`/`reason_appointment` todavía presentes como estado intermedio esperado.
5. **R-C no tiene lista propia.** Tras C-04-N desaparece la línea `numbered` y quedan 34 (o el valor recalculado). Si C-04-P retira las plantillas de soporte del ZIP, el barrido no cambia, porque ya las excluye.
6. **Límite declarado y aceptado.** No hay renderizador local; la ocultación se acredita leyendo el código y con el Anexo B. La prueba en tienda corresponde a R-A (§5.5, compuerta 5).

# 8. Cambios obligatorios (lista exacta)

- **M-1 (C-1).** Partir la directiva en C-08a y C-08b según §5.4, con scripts, hashes, listas cerradas (18 y 13 archivos), verificaciones y residuos esperados propios. Reescribir §5.6 y §9.1 C-1: N2-1, N2-2 (24 defaults) y N2-3 son Nivel 2, no los autoriza esta R-D y requieren autorización escrita de Johandry. El informe de C-08b cita el documento de esa autorización. Documentar el estado intermedio y las alternativas si se deniega.
- **M-2 (inventario).**
  - Añadir F-1, F-2 y F-4 a C-08a.
  - Añadir F-3 a C-08b.
  - Pasar `listings/imprint/templates/collection.json` de «No se tocan» a la lista de C-08a.
  - Añadir a §3.6 los conservables de §2.2.
  - Las sustituciones exactas usadas en la prueba, que deben aparecer después de las de AR-08, I-06 y equivalentes:
    - `"link_label": "Inspect blueprint",` → `"link_label": "Explore leather goods",`
    - `"link_label": "View specifications",` → `"link_label": "Explore daily objects",`
    - `"collection": "restored-pieces", "tab_label": ""` → `"collection": "restored-pieces", "tab_label": "Selected pieces"`
    - `"default": "Autumn / Winter 26"` → `"default": "Form in quiet movement"`
- **M-3 (O-06).** Corregir la premisa: los umbrales tienen default 150 y 250 en el schema y en Liquid (`cart-drawer.liquid:9-10`), así que activar la casilla basta para mostrar la barra. La conservación se mantiene y la responsabilidad del valor es del comerciante, según su `info`.
- **M-4 (barrido).** Aplicar los puntos 1 a 3 de §7: residuo principal 35 (o el recalculado), `awk` sin truncado y patrones de F-1 a F-3. Recalcular los SHA-256 de §1.4.
- **M-5 (verificación por fase).** Una verificación para C-08a y otra para C-08b (o un argumento de fase en el Anexo B), con sus salidas esperadas literales.
- **M-6 (R-C).** Añadir a §5.3 la lista esperada después de C-04-N.
- **M-7 (recuento).** Actualizar §3.7 y el resumen: 106 hallazgos en alcance (102 + F-1 a F-4). AR-08 queda como vaciado solo de `decade80`, y F-4 es una fila nueva de neutralización de `decade90`. El total queda en 27 retiradas, 56 neutralizaciones (52 + F-1, F-2, F-3 y F-4), 22 vaciados y 1 sin edición. Los conservados son 19 + §2.2.
- **M-8 (afirmación 6 y §4.1).** La afirmación 6 debe reflejar el archivo adicional, y §4.1 debe declarar las dos listas cerradas.

Recomendado, no bloqueante: F-5 en C-08a.

# 9. Veredicto

**APROBADA CON CAMBIOS (M-1 a M-8).** El diseño (inventario, regla de clasificación, edición determinista con una coincidencia y escritura atómica, verificación semántica y barrido) es correcto y se reproduce de forma independiente. El copy neutro cumple los criterios 2 a 5 de la decisión C08, salvo AR-08.

**Lo que requiere a Johandry, separado de lo demás:**

1. **REQUIERE AUTORIZACIÓN DE JOHANDRY: Nivel 2 de C-08b** (N2-1 fallbacks, N2-2 24 defaults y N2-3 la opción «Private appointment»), o que delegue esa autorización por escrito (§5.1 a §5.3).
2. Nada más. C-2, C-3, C-4 y Q-1 a Q-6 se resuelven dentro del plan y de las decisiones registradas.

C-08a puede emitirse e implementarse según D9 cuando el coordinador incorpore M-1 a M-8, después del commit de A-02 y A-03 (M-9 de A-02), porque el preflight exige árbol limpio. C-08 no se da por aceptado en R-A hasta que C-08b se aplique o Johandry decida la alternativa.

# 10. Compuerta del literal sobre este archivo

Script: copia sin cambios de `count-two.py` en `rd-c08/tools/count-two-rd.py`, que imprime solo `ruta=N`. Resultado de este archivo: `agent-comms/outbox-claude/CLAUDE-REVIEW-C-08-RD-001.md=0`. La salida literal está en el informe de vuelta al coordinador.
