ID: CLAUDE-DIRECTIVA-C-08-001 (v2, incorpora CLAUDE-REVIEW-C-08-RD-001)
Estado: Aprobada con cambios por CLAUDE-REVIEW-C-08-RD-001 (C-08a lista; C-08b pendiente de autorización de Nivel 2 de Johandry).
Decisión requerida: (1) C-08a (Nivel 1): ninguna adicional; se ejecuta según D9 en cuanto exista el commit de A-01/B-02 en `lote-a` y el árbol esté limpio. (2) C-08b (Nivel 2: N2-1, N2-2, N2-3): REQUIERE AUTORIZACIÓN ESCRITA DE JOHANDRY (D10), o su delegación escrita en el revisor o en Antigravity (§5.6). Sin ese documento C-08b no se ejecuta. M-1 a M-8 de la R-D están incorporados (§10); no hace falta otra R-D si se ejecuta tal cual.
Resumen en 5 líneas:
1. Inventario de promesas y afirmaciones factuales sin respaldo verificable en la propia tienda: 106 hallazgos en alcance (102 de v1 más F-1 a F-4 de la R-D), 1 ajuste de coherencia recomendado (F-5) y 29 entradas conservadas o fuera de alcance.
2. Tratamiento: 27 retiradas, 56 neutralizaciones sin dato factual nuevo, 22 vaciados con ocultación funcional del elemento vacío y 1 sin edición; más F-5.
3. Partición: C-08a (Nivel 1, 18 archivos, 84 hallazgos + F-5) ejecutable ya; C-08b (Nivel 2, 13 archivos, 22 hallazgos: fallbacks Liquid, 24 defaults de schema, opción «Private appointment» y sus claves) pendiente de Johandry.
4. HX-1 resuelto: C-08b fusiona las dos ramas `when` de los bloques de entrega y devoluciones en lugar de añadir condiciones; la complejidad Liquid de `main-product.liquid` queda en 120 (igual que la base con A-01/B-02) y la de `featured-product.liquid` baja de 111 a 110. Theme Check: 92 archivos, 0 ofensas en ambas fases.
5. Sin tienda (D22): estado máximo `código completo`; C-08 no se acepta en R-A hasta que C-08b se aplique o Johandry decida una alternativa (§5.7).
Archivos tocados: solo este documento, `agent-comms/outbox-claude/CLAUDE-DIRECTIVA-C-08-001.md` (reescrito como v2). Los cinco scripts de los anexos se probaron en el scratchpad del redactor, fuera del repositorio.
Desviaciones (Nivel 1 o Nivel 2): Ninguna en esta redacción. C-08b contiene tres cambios de Nivel 2 (§5.6) que esta directiva no autoriza.
Hallazgos extra fuera de alcance (con parche listo): Sin parche. §7.3: CSS sin uso `assets/base.css` (`.main-contact__response-note`), diccionario `scripts/translations/es.storefront.json:318,718`, texto instructivo visible `templates/page.about.json:11`, `<dl class="main-contact__atelier-facts">` vacío sin horario ni dirección (R-D, extra a), y margen nulo de complejidad en `main-product.liquid` (120/120) para tareas posteriores.
Verificación (comando, resultado y qué demuestra/qué no): §0.2. Demuestra que, sobre copias del árbol actual de `lote-a` (A-02 y A-03 con commit, A-01/B-02 sin commit) y de `git archive HEAD` (`c81cbcb`), C-08a y C-08b aplican, la verificación por fase pasa, el JSON es válido, el inventario de locales no tiene huérfanas, en/es están en paridad, Theme Check da 0 ofensas y los residuos son los de §5.3. No demuestra el comportamiento en tienda, la existencia de destinos ni los títulos reales de las colecciones.
Lista de afirmaciones falsables numeradas:
1. Con el diseño de v1 (dos `if` nuevos en `main-product.liquid`), sobre el árbol con A-01/B-02 la complejidad Liquid de `main-product.liquid` sube de 120 a 122 y Theme Check informa 1 aviso `LiquidComplexity` (HX-1); con el diseño de v2 queda en 120 y Theme Check da 0 ofensas.
2. La regla `LiquidComplexity` del Shopify CLI 4.8.0 suma 1 por cada `if`, `unless`, `case`, `for`, `tablerow` y `paginate`, 1 por cada rama `elsif` y `when`, y 1 por cada `and`/`or` dentro de una condición `if`/`unless`/`elsif`; `assign` y los filtros no suman (`node_modules/@shopify/cli/dist/chunk-F3NYCSXT.js`, objeto `LiquidComplexity`).
3. La rama fusionada de C-08b produce el mismo marcado que las dos ramas actuales para cualquier valor de `delivery_text`, `returns_text` e `icon` no vacío; con texto vacío o solo espacios no produce nada.
4. C-08a modifica exactamente los 18 archivos de §4.1 y C-08b los 13 de §4.1; la unión es la lista de v1 más `listings/imprint/templates/collection.json` (31 entradas, 28 archivos distintos: los dos locales y `sections/main-contact.liquid` están en ambas fases).
5. El barrido del Anexo D da 296 líneas en el árbol actual, 71 tras C-08a y 35 tras C-08b, con las tablas exactas de §5.3.
6. Ninguna fase crea, lee ni modifica metafields; ninguna toca `assets/`, `config/`, `layout/`, `snippets/`, los archivos de A-02 ni `listings/sartorial/templates/index.json:35,52` (C-04-N).
7. Ningún texto nuevo introduce material, origen, proceso, plazo, coste, servicio, persona, ensayo, certificación, fecha ni cantidad (R-D §3, confirmado; F-4 corrige la única objeción).

---

# 0. Fuentes y verificación del redactor

## 0.1 Fuentes leídas

- `AGENTS.md`, `agent-comms/RULES.md` (§1.4, §2, §3.2, §3.5, §3.8, §3.9, §4.2, §5).
- Plan V4.1 `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md`: §1.2, §2, §3.3 (0-04), §4.1 (C-08, A-02), §4.3 (C-04-N, C-04-P, C-04-R, RC-07), §4.4 (D-01-V, D-01-N, D-02-T), §5.1, §5.2 (R-A, R-C, R-G), §6.
- Decisión `agent-comms/outbox-gpt/GPT-DECISION-LOTE-0-04-C08-001.md` e inventario previo `GPT-INVENTARIO-LOTE-0-C08-001.md`.
- D9–D18 (`CLAUDE-DECISION-AUTONOMIA-001.md`), D19 (`CLAUDE-DECISION-LOTE-0-CIERRE-001.md`), D20–D24 (`CLAUDE-DECISION-LOTE-0-002.md`).
- `docs/requirements-ledger.md` (sin fila para RC-07/TT-63).
- **R-D `agent-comms/outbox-claude/CLAUDE-REVIEW-C-08-RD-001.md` (leída entera):** veredicto «APROBADA CON CAMBIOS (M-1 a M-8)», Nivel 2 no autorizado, hallazgos F-1 a F-5, conservables §2.2, partición §5.4. Sus scripts de prueba (`rd-c08/tools/c08a_apply.py`, `c08b_apply.py`) se usaron como referencia; los anexos de esta v2 son propios y se redactaron desde los de v1.
- Directivas paralelas `CLAUDE-DIRECTIVA-A-02-001.md` y `CLAUDE-DIRECTIVA-A-01-B-02-001.md` (solo para fronteras y para saber qué regiones de `main-product.liquid`/`featured-product.liquid` cambia A-01/B-02).

## 0.2 Verificación del redactor (salidas literales)

Estado del repositorio al redactar v2: rama `lote-a`, HEAD `c81cbcb` (A-03) sobre `a6a9074` (A-02) sobre `eb7cca7`. Cambios sin commit de A-01/B-02: `assets/theme.js`, `docs/requirements-ledger.md`, `layout/theme.liquid`, `sections/featured-product.liquid`, `sections/main-product.liquid` y el nuevo `snippets/variant-no-js-select.liquid`. El commit de A-01/B-02 aún no existía, así que se validó sobre una copia del árbol de trabajo (`cp -r assets config layout locales sections snippets templates listings scripts package.json .theme-check.yml`), y además sobre `git archive HEAD` (`c81cbcb`, sin A-01/B-02).

Copia del árbol de trabajo (`pre` = sin C-08, `A` = tras C-08a, `AB` = tras C-08a y C-08b):

```text
$ bash c08_grep.sh pre | wc -l                        -> 296
$ python3 -I c08_verify.py pre a                      -> C08_VERIFY_FAIL (templates/index.json:marquee: bloque marquee_series sigue presente …)
$ python3 -I c08a_apply.py A                          -> C08_APPLY_OK archivos=18
$ python3 -I c08_verify.py A a                        -> C08_VERIFY_OK fase=a plantillas_revisadas=28
$ python3 -I c08_verify.py A b                        -> C08_VERIFY_FAIL (locale: clave …delivery_fallback sigue presente …)
$ bash c08_grep.sh A | wc -l                          -> 71
$ python3 -I c08b_apply.py AB                         -> C08_APPLY_OK archivos=13
$ python3 -I c08_verify.py AB b                       -> C08_VERIFY_OK fase=b plantillas_revisadas=28
$ python3 -I c08a_apply.py AB  (2.ª vez)              -> C08_APPLY_FAIL: sections/main-contact.liquid: se esperaba 1 coincidencia y hay 0 …
$ bash c08_grep.sh AB | wc -l                         -> 35

                         json   en.default.json   sin resolver   huérfanas   paridad en/es    Theme Check                                   main-product   featured-product
pre (base actual)        0      438 hojas         0/0            0/0         438/438, 0/0     92 files inspected with no offenses found.   120            111
A  (tras C-08a)          0      437 hojas         0/0            0/0         437/437, 0/0     92 files inspected with no offenses found.   120            111
AB (tras C-08b)          0      434 hojas         0/0            0/0         434/434, 0/0     92 files inspected with no offenses found.   120            110
v1 (Anexo A de v1)       —      —                 —              —           —                92 files inspected with 1 total offenses      122            113
                                                                                              found across 1 files. ([warning]: LiquidComplexity)
```

Complejidad medida con el Anexo E (`TMPDIR="$SCRATCH" bash c08_complexity.sh <copia>`). `git archive HEAD` (`c81cbcb`): C-08a `C08_APPLY_OK archivos=18`, verificación `a` OK; C-08b `C08_APPLY_OK archivos=13`, verificación `b` OK; barrido 35. Barrido antes de editar: `eb7cca7` 298, `c81cbcb` 296, árbol de trabajo 296 (el patrón v2 añade `inspect blueprint|view specifications|winter [0-9]{2}`).

**Revalidación sobre el commit de A-01/B-02.** Al cerrar v2 apareció `64862d1` («Lote A: A-01 y B-02 un solo control de variante y de plan por formulario») en `lote-a`. Sobre `git archive 64862d1`: barrido antes 296; C-08a `C08_APPLY_OK archivos=18`, `C08_VERIFY_OK fase=a plantillas_revisadas=28`, barrido 71, complejidad `main-product` 120 / `featured-product` 111, Theme Check «92 files inspected with no offenses found.»; C-08b `C08_APPLY_OK archivos=13`, `C08_VERIFY_OK fase=b plantillas_revisadas=28`, barrido 35, complejidad 120 / 110, Theme Check «92 files inspected with no offenses found.», inventario de locales sin resolver 0/0 y huérfanas 0/0. Es la base de ejecución vigente (§1.1).

Diferencias entre el árbol final de v2 (AB) y el de v1 sobre la misma copia: exactamente F-1, F-2, F-4, F-5, F-3 y la rama fusionada (8 archivos: `listings/archive/templates/index.json`, `listings/imprint/templates/collection.json`, `listings/imprint/templates/index.json`, ambos locales, `sections/featured-product.liquid`, `sections/hero-editorial.liquid`, `sections/main-product.liquid`).

Límites: `node scripts/theme-check-sanity.mjs` no se pudo ejecutar dentro de las copias (no tienen `node_modules`); el implementador lo ejecuta en el repo. No hay renderizador Liquid local: la equivalencia de marcado de la rama fusionada se acredita por lectura del código y por el Anexo C. Nada se ejecutó contra tiendas.

---

# 1. Base y preflight

## 1.1 Base de ejecución

- Rama `lote-a`. **Base: la cabeza de `lote-a` tras el commit de A-01/B-02**, que ya existe: `64862d1` (sobre `c81cbcb` A-03 y `a6a9074` A-02). Ambas fases se revalidaron sobre `git archive 64862d1` (§0.2). Si la cabeza de `lote-a` avanza con otros commits antes de C-08, los scripts fallan sin escribir ante cualquier choque.
- Comprobado sobre el árbol de trabajo que ya contiene A-01/B-02 sin commit: las cadenas que editan C-08a y C-08b no se solapan con las regiones de A-01/B-02 (hunks de `main-product.liquid` en `:26`, `:229`, `:489`, `:593`; en ese árbol los bloques de C-08b empiezan en `main-product.liquid:675` y `featured-product.liquid:420`). Si el commit final de A-01/B-02 difiere de ese árbol, los scripts fallan sin escribir y se vuelve a R-D.
- Escritor único (plan §2). C-08a se ejecuta ya (D9). C-08b espera el documento de autorización de Johandry y exige C-08a aplicada y con commit.

## 1.2 Preflight común (desde la raíz del repo)

```bash
git rev-parse --abbrev-ref HEAD                                   # esperado: lote-a
git merge-base --is-ancestor eb7cca797f9de142089c6c14daaa5ed449597f9f HEAD && echo BASE_OK
git log --oneline eb7cca7..HEAD                                   # debe incluir a6a9074 (A-02), c81cbcb (A-03) y 64862d1 (A-01/B-02)
git status --short                                                # esperado: sin cambios rastreados (?? de agent-comms admitido)
```

Si falta `BASE_OK`, si no aparece el commit de A-01/B-02 o hay cambios rastreados sin commit: detenerse sin editar e informar.

Solo para C-08b, además:

```bash
python3 -I "$SCRATCH/c08_verify.py" . a                           # esperado: C08_VERIFY_OK fase=a … (C-08a aplicada)
git log --oneline -5                                              # debe incluir el commit de C-08a
```

y el ID o la ruta del documento escrito con la autorización de Nivel 2 de Johandry (o su delegación). Sin él, detenerse.

## 1.3 Línea base de compuertas (antes de editar cada fase; pegar salida literal)

```bash
npx shopify theme check --path .          # anotar "N files inspected" y 0 ofensas (92 en el árbol de v2)
node scripts/theme-check-sanity.mjs       # exit 0
node scripts/locale-key-inventory.mjs     # sin resolver 0/0, huérfanas 0/0, exit 0
node scripts/json-validate.mjs            # exit 0
TMPDIR="$SCRATCH" bash "$SCRATCH/c08_complexity.sh" .   # anotar main-product y featured-product (120 y 111 en el árbol de v2)
```

Si la línea base ya falla, o si `main-product.liquid` ya supera 120: detenerse e informar.

## 1.4 Extracción de los scripts de los anexos

`$SCRATCH` es un directorio temporal de la sesión del implementador, fuera del repositorio.

```bash
python3 -I - "$SCRATCH" <<'EOF'
import re, sys, pathlib
d = pathlib.Path('agent-comms/outbox-claude/CLAUDE-DIRECTIVA-C-08-001.md').read_text(encoding='utf-8')
for name in ('c08a_apply.py', 'c08b_apply.py', 'c08_verify.py', 'c08_grep.sh', 'c08_complexity.sh'):
    m = re.search(r'<!-- ANEXO ' + re.escape(name) + r' -->\n```[a-z]*\n(.*?)\n```\n', d, re.S)
    pathlib.Path(sys.argv[1], name).write_text(m.group(1) + '\n', encoding='utf-8', newline='\n')
    print('extraido', name)
EOF
sha256sum "$SCRATCH/c08a_apply.py" "$SCRATCH/c08b_apply.py" "$SCRATCH/c08_verify.py" "$SCRATCH/c08_grep.sh" "$SCRATCH/c08_complexity.sh"
```

SHA-256 esperados (v2; sustituyen a los de v1):

```text
f4aba7a77d28ed5d8770750a9fdaa4ac74d8cae02d8deece9794f85af24b1709  c08a_apply.py
6b029845866af7980c3eb5e40115854ef74607c41023e22c969a114291e00554  c08b_apply.py
21312b3b06fb67c9a0094b6c1848156c05b0c14f1970bfc44e999a5c242f777e  c08_verify.py
ce012a431c1e65e60a2021fa21493e4703f82b36f69b12c7559f95056df30981  c08_grep.sh
4ca494f36afc827bef5d1052696b4e563bd4bc221c90547539a192606077138d  c08_complexity.sh
```

Si un hash no coincide: detenerse e informar. No se corrigen los scripts a mano.

---

# 2. Objetivo y criterio de la decisión C08

## 2.1 Objetivo

Retirar o sustituir por contenido neutro toda promesa o afirmación factual sin respaldo verificable en la propia tienda que el paquete del tema pueda mostrar a un comprador, sin residuos en fallbacks, defaults de schema, claves de locale, bloques ocultos, CTA o destinos. Afecta al copy por defecto del tema, a las plantillas raíz empaquetadas y a las plantillas de los tres presets en `listings/`.

## 2.2 Criterio citado textualmente

Decisión de Johandry, registrada en `GPT-DECISION-LOTE-0-04-C08-001.md` (2026-11-02):

> «Apruebo C-08 de la sección 7. Retira o sustituye por contenido neutro las promesas sin respaldo verificable; prefiere retirar o sustituir antes que ocultar, para que no quede la promesa en bloques ocultos. Conserva solo las acreditadas con respaldo verificable en la propia tienda y el contenido neutro. Sin excepciones. Registra la decisión con fecha 2026-11-02 y sigue el Lote 0.»

Criterios 2 a 5 de la misma decisión, citados:

> «2. Retirar o sustituir por contenido neutro cada promesa cuyo respaldo aplicable no se verifique en la propia tienda. Preferir retirar o sustituir a ocultar; no introducir en un texto supuestamente neutro otra afirmación factual que requiera respaldo y no lo tenga.»
>
> «3. Verificar que la promesa retirada no permanezca como texto en bloques ocultos, fallbacks, contenidos o páginas asociadas, CTA, enlaces u otros destinos engañosos. Revisar el comportamiento de un campo vacío: vaciarlo por sí solo no demuestra que el fallback o contenido asociado desaparezcan.»
>
> «4. Una ocultación funcional de un bloque genuinamente vacío es distinta de conservar una promesa dentro de un bloque oculto; esta última no satisface el criterio. Definir el tratamiento concreto de cada enlace o destino según su uso, sin ordenar el borrado indiscriminado de páginas.»
>
> «5. Conservar el contenido neutro y las promesas individualmente respaldadas en la propia tienda; sin excepciones para promesas sin respaldo verificable aplicable. No declarar falsa una afirmación solamente porque aún no se encontró respaldo.»

Ninguna de las 106 promesas inventariadas tiene respaldo aplicable acreditado en el repositorio, y sin tienda (D22) no se puede verificar ninguno; por eso ninguna se conserva. La retirada no afirma que la promesa sea falsa (criterio 5).

## 2.3 Interpretación aplicada a «vaciar»

Vaciar un campo se usa solo cuando, tras esta directiva, el campo vacío produce ocultación funcional de un elemento genuinamente vacío (sin fallback) o cae a un texto neutro de locale ya neutralizado aquí. Cada fila «Vaciar» de §3 indica cuál de los dos casos aplica. No se conserva ninguna promesa dentro de un bloque oculto.

---

# 3. Inventario

## 3.0 Regla de clasificación (vinculante para el implementador y para R-A/R-C)

Un texto está en alcance si afirma, sobre la tienda, sus productos o sus servicios, alguno de estos hechos:

- **P, política, servicio o plazo:** envío (gratuito, tipo de mensajería, asegurado, climatizado, internacional, exprés), plazos de despacho o entrega, seguimiento, devoluciones, cambios o reembolsos, reparaciones, arreglos, citas, showroom, concierge o probadores, horarios, tiempos de respuesta, invitaciones, encargos, acceso anticipado, avances privados, regalos o umbrales de envío gratuito, dirección física.
- **F, producto o fabricación:** materiales o composición concretos (seda, lana, Super 160s, nylon 500D, titanio, aluminio 6061, DWR, fibras naturales), origen (Milán, Biella, «close to the source», «a mill we can name»), proceso (hecho, acabado, enrollado o cosido a mano; corte láser; mecanizado CNC; entretela flotante; por un artesano), series, numeración o cantidades, bespoke como oferta, ensayos, rendimiento o certificaciones (stress-tested, waterproof, weatherproof, tolerancia, aerospace grade, extreme endurance), trazabilidad.
- **PR, procedencia, estado o época:** fechas, décadas o circa; procedencia de pasarela; conservación o restauración; registros documentados, estándares curatoriales o inspección; grados de estado.
- **A, atribución:** personas o equipos presentados como reales («Head of atelier», «a person will answer you»).
- **D, destino o CTA engañoso:** un CTA que promete algo que su destino no ofrece, o pestañas que prometen contenidos distintos y apuntan al mismo destino.
- **C, coherencia:** no es promesa, pero describe o depende de un fallback que se retira (ayudas del editor, claves huérfanas).

Fuera de alcance, se conservan: copy de ambiente o editorial sin hecho concreto; adjetivos genéricos (modular, sculptural, curated, technical); nombres y rótulos nominales («atelier», «studio», «salon», «archive», «vault», «Master Tailor's…»), que el plan conserva expresamente (V4.1 §4.3, C-04-N); aforismos que no predican un hecho concreto de los productos de la tienda; descripciones verdaderas de funciones del tema; avisos estándar de Shopify respaldados por la plataforma.

Columnas de las tablas: **Origen** = TEMA (copy por defecto: Liquid, locale o default de schema), RAÍZ (plantilla raíz empaquetada en el ZIP; es lo que instala una subida del ZIP) o DEMO-preset (plantilla de `listings/<preset>/`). **Editable** = si el comerciante puede eliminarlo sin tocar código: Liquid fallback «No» (vaciar el campo lo reintroduce); locale «Sí, vía Editar contenido predeterminado del tema»; default de schema «Sí, tras añadir la sección o el bloque»; JSON de plantilla «Sí, en el editor». Líneas en `eb7cca7`; en la base de ejecución (con A-01/B-02) solo cambian las de `main-product.liquid` (bloques en `:675-706`) y `featured-product.liquid` (`:420-455`). **Fase:** cada fila pertenece a C-08a o C-08b según §3.9.

Acciones: **Retirar** (se elimina el bloque, clave, opción, marcado, default o fallback), **Neutralizar** (se sustituye por el texto exacto indicado, sin datos factuales), **Vaciar** (`""`; indica qué ocurre con el vacío), **Sin edición**.

## 3.1 Copy por defecto del tema (TEMA): Liquid, locales y defaults de schema

| ID | Archivo:línea | Texto actual | Tipo | Editable | Acción |
| --- | --- | --- | --- | --- | --- |
| T-01 | `sections/main-product.liquid:659-673` (`when 'shipping_lead_time'`) | Vacío → fallback `delivery_fallback` «Delivery times and costs confirmed at checkout» | P | No | Retirar el fallback. Diseño v2 (HX-1): T-01 y T-02 se fusionan en una sola rama `when 'shipping_lead_time', 'trust_badges'` con `trust_text = delivery_text \| default: returns_text \| strip` y un único `if trust_text != blank`; los iconos pasan a una cadena `if`/`elsif` de cuatro valores. Texto vacío o solo espacios: no se renderiza el `<p class="product-trust">`. N2-1, C-08b. |
| T-02 | `sections/main-product.liquid:675-689` (`when 'trust_badges'`) | Vacío → fallback `returns_fallback` «Returns subject to our store policy» | P | No | Fusionado con T-01 (misma rama). N2-1, C-08b. |
| T-03 | `sections/featured-product.liquid:410-426` | Mismo fallback de entrega | P | No | Igual que T-01; condición `featured_product != blank and trust_text != blank`. N2-1, C-08b. |
| T-04 | `sections/featured-product.liquid:428-444` | Mismo fallback de devoluciones | P | No | Fusionado con T-03. N2-1, C-08b. |
| T-05 | `locales/en.default.json:162-167`, `locales/es.json:162-167` | Claves `sections.main_product.blocks.shipping_lead_time.delivery_fallback` y `…trust_badges.returns_fallback` (es: «Plazos y costes de entrega confirmados al pagar», «Devoluciones sujetas a la política de la tienda») | C | Sí | Retirar ambas claves y sus objetos contenedores (quedarían huérfanas). |
| T-06 | `locales/en.default.schema.json:972,984` | Ayudas «…Leave blank for a neutral checkout message.» / «…Leave blank for a neutral policy message.» | C | n/a (editor) | Neutralizar: «Match your shipping rates and delivery estimates. Leave blank to hide this block.» y «Match your published returns policy. Leave blank to hide this block.» |
| T-07 | `locales/en.default.json:157`, `es.json:157` (`inventory_status.in_stock`) | «In stock, ready to ship» / «En existencias, listo para enviar» | P | Sí | Neutralizar: «In stock» / «En existencias» (igual que `en.default.json:631`). |
| T-08 | `en.default.json:207`, `es.json:207` (`contact.form.success`) | «Thank you. We will reply as soon as possible.» / «Gracias. Te responderemos lo antes posible.» | P | Sí | Neutralizar: «Thank you. Your message has been sent.» / «Gracias. Tu mensaje se ha enviado.» |
| T-09 | `sections/main-contact.liquid:115` + `en.default.json:215`, `es.json:215` | Opción del formulario «Private appointment» / «Cita privada» | P | No (marcado) | Retirar la `<option>` y la clave en ambos locales. N2-3. |
| T-10 | `sections/main-contact.liquid:211` + `en.default.json:231`, `es.json:231` | «Response standard: two business days» / «Plazo de respuesta: dos días hábiles», visible siempre que haya un `service_detail` | P | No (marcado) | Retirar el `<p class="main-contact__response-note">` y la clave `contact.services.response`. |
| T-11 | `en.default.json:378-380`, `es.json:378-380` (`password.newsletter`) | «Request early access», «Private notes only. Unsubscribe at any time.», «Thank you. Your early access request was received.» | P | Sí | Neutralizar: «Subscribe», «Unsubscribe at any time.», «Thank you for subscribing.» / «Suscribirse», «Puedes darte de baja cuando quieras.», «Gracias por suscribirte.» |
| T-12 | `en.default.json:616`, `es.json:616` (`newsletter.copy`, fallback del newsletter y del footer) | «New objects, material studies and private previews, sent with restraint.» | P | Sí | Neutralizar: «Subscribe to our newsletter.» / «Suscríbete a nuestro boletín.» |
| T-13 | `en.default.json:620`, `es.json:620` (`newsletter.success`) | «Thank you. Your first note will arrive soon.» | P | Sí | Neutralizar: «Thank you for subscribing.» / «Gracias por suscribirte.» |
| T-14 | `sections/announcement-bar.liquid:145` | Default «Complimentary shipping on orders over $150» (enlace default `/collections/all`) | P | Sí | Neutralizar default: «Explore the collection». N2-2. |
| T-15 | `sections/brand-manifesto.liquid:108` | Default body «…a decision made by an artisan…» | F | Sí | Neutralizar default: `<p>Describe the ideas behind your work.</p>`. N2-2. |
| T-16 | `sections/brand-manifesto.liquid:114` (url default `:120` `/collections/all`) | Default «Read our process» hacia el catálogo | D | Sí | Neutralizar default: «Explore the collection». N2-2. |
| T-17 | `sections/brand-manifesto.liquid:169` | Default de detalle «Traceable natural fibres» | F | Sí | Neutralizar default: «Add a short detail». N2-2. |
| T-18 | `sections/hero-editorial.liquid:410` | Default «…tactile materials, made in small series.» | F | Sí | Neutralizar default: `<p>A study in quiet movement. Sculptural layers and tactile materials.</p>`. N2-2. |
| T-19 | `sections/main-about.liquid:280,286,292,298,304,310` | Defaults «Traceable fibres» / «Every cloth is bought from a mill we can name.», «Hand finished» / «…worked by hand.», «Small series» / «Pieces are cut in short runs…» | F | Sí | Neutralizar defaults: «Materials» / `<p>Describe the materials you work with.</p>`, «Process» / `<p>Describe how your pieces are made.</p>`, «Collection» / `<p>Describe how your collection is put together.</p>`. N2-2. |
| T-20 | `sections/main-contact.liquid:233,239` | Defaults «Contact / Private client services», «…or a private appointment.» | P | Sí | Neutralizar: «Contact», `<p>Write to us about an order or a product.</p>`. N2-2. |
| T-21 | `sections/main-contact.liquid:245,251` | Defaults «Monday to Friday / 10:00–18:00 CET», «By appointment / Milan» | P | Sí | Retirar ambos defaults (vacío = fila oculta, `main-contact.liquid:41,47`). N2-2. |
| T-22 | `sections/main-contact.liquid:276,282` | Defaults de `faq_item` «Shipping and provenance» / «…within three business days.» | P | Sí | Neutralizar a los mismos defaults de `main-faq`: «When will my order arrive?» / `<p>Add the answer your customers need here.</p>`. N2-2. |
| T-23 | `sections/main-contact.liquid:300` | Default `service_detail` «Order concierge» | P | Sí | Neutralizar: «Order questions». N2-2. |
| T-24 | `sections/main-faq.liquid:244,250` | Defaults «Write to the atelier and a person will answer you.», «Contact the atelier» | A | Sí | Neutralizar: `<p>Send us a message through our contact page.</p>`, «Contact us». N2-2. |
| T-25 | `sections/main-password.liquid:184` (visible: `templates/password.json` sin settings) | «Join the private list for first access, studio notes and a preview of the making process.» | P | Sí | Neutralizar default: `<p>Leave your email address to join our mailing list.</p>`. N2-2. |
| T-26 | `sections/main-password.liquid:191` (visible por la misma razón) | «Wool, fired earth and softened leather.» | F | Sí | Retirar el default (vacío = nota oculta, `main-password.liquid:92`). N2-2. |
| T-27 | `sections/newsletter.liquid:95` | Default texto «…private previews, sent with restraint.» | P | Sí | Retirar el default (vacío = cae a `newsletter.copy` neutralizado en T-12, `newsletter.liquid:20-24`). N2-2. |

## 3.2 Plantillas raíz empaquetadas (RAÍZ)

| ID | Archivo:línea | Texto actual | Tipo | Editable | Acción |
| --- | --- | --- | --- | --- | --- |
| R-01 | `sections/header-group.json:11` (enlace `:12` `/collections/all`) | «Complimentary shipping on orders over $150» (barra de anuncios de los tres presets) | P | Sí | Neutralizar: «Explore the collection»; enlace sin cambios. |
| R-02 | `sections/header-group.json:38` | Mega menú `subheading_2` «Pieces made in small series» | F | Sí | Vaciar (subtítulo oculto, `snippets/mega-menu.liquid:165`). |
| R-03 | `templates/index.json:22` | Hero «…tactile materials, made in small series.» | F | Sí | Neutralizar: `<p>A study in quiet movement. Sculptural layers and tactile materials.</p>`. |
| R-04 | `templates/index.json:42,54` | Marquee «MADE IN SMALL SERIES», «NATURAL FIBRES / TRACEABLE ORIGIN» | F | Sí | Retirar bloques `marquee_series` y `marquee_origin` y sus entradas en `block_order` (quedan 2 ítems). |
| R-05 | `templates/index.json:114,121,128,135` | Manifiesto: «100% traceable natural fibres», «Made close to the source», «Formed and finished by hand», «Numbered in small runs» | F | Sí | Retirar los 4 bloques `detail_*` (`"blocks": {}`, `"block_order": []`; el `<dl>` no se renderiza, `brand-manifesto.liquid:65`). |
| R-06 | `templates/index.json:148` | «Every seam, edge and finish records a decision made by an artisan…» | F | Sí | Vaciar (`body` vacío no se renderiza, `brand-manifesto.liquid:30`). |
| R-07 | `templates/index.json:150-151` | CTA «Read our process» → `/pages/about` (cuyas afirmaciones de proceso se retiran en R-29) | D | Sí | Neutralizar etiqueta: «About us»; URL sin cambios. |
| R-08 | `templates/index.json:285` | Newsletter «…private previews, sent with restraint.» | P | Sí | Vaciar (cae a `newsletter.copy` de T-12). |
| R-09 | `templates/product.json:60-61`; `listings/sartorial/templates/product.json:60-61`; `listings/archive/templates/product.json:60-61`; `listings/imprint/templates/product.json:60-61` | Pestaña «Composition & care»: «Each piece is made from natural materials…», «Follow the care label sewn into each piece…» (Imprint: «…follow the care instructions supplied with your item…») | F | Sí | Neutralizar en los 4 archivos: heading «Care»; content `<p>Care depends on the material and finish of each piece. If you are unsure how to care for it, contact us before cleaning it.</p>`. |
| R-10 | `templates/product.json:64-70`; mismas líneas en los 3 `listings/*/templates/product.json` | Pestaña «Shipping & complimentary returns»: despacho en dos días con seguimiento, devoluciones gratuitas en treinta días, «Made-to-order work is final sale» | P | Sí | Retirar el bloque `shipping_returns` y su entrada en `block_order` en los 4 archivos. |
| R-11 | `templates/product.json:42,49`; `listings/archive/templates/product.json:42,49` | `delivery_text: ""`, `returns_text: ""` que hoy muestran los fallbacks T-01/T-02 | P | Sí | Sin edición: tras T-01–T-04 el bloque vacío queda oculto. |
| R-12 | `templates/page.faq.json:14` | «Pieces held in the atelier leave within two business days…» | P | Sí | Neutralizar: `<p>Dispatch and delivery times depend on the item and your destination. Contact us before ordering if you need a piece by a specific date.</p>`. |
| R-13 | `templates/page.faq.json:18-25` (`q_tracking`) | «A tracking link is sent as soon as the parcel leaves the studio…» | P | Sí | Retirar bloque y entrada de `block_order`. |
| R-14 | `templates/page.faq.json:28` | Categoría «Sizing and tailoring» (servicio de sastrería) | P | Sí | Neutralizar: «Sizing». |
| R-15 | `templates/page.faq.json:34` | «Every product page carries the measurements…» y «…we will tell you how this cut behaves.» | P | Sí | Neutralizar: `<p>If you are unsure which size to choose, contact us with your usual size before ordering.</p>`. |
| R-16 | `templates/page.faq.json:38-45` (`q_alterations`) | «Sleeve and hem adjustments are available…» | P | Sí | Retirar bloque y entrada. |
| R-17 | `templates/page.faq.json:48,53,54` | «Garment care», «How should I care for these fabrics?», «Care instructions travel with each piece. As a rule, natural fibres prefer airing…» | F | Sí | Neutralizar: «Care»; «How should I care for my piece?»; `<p>Care depends on the material and finish of each piece. If you are unsure how to care for it, contact us before cleaning it.</p>`. |
| R-18 | `templates/page.faq.json:58-65` (`q_repairs`) | «Yes. Send a photograph… the studio will tell you what can be done» | P | Sí | Retirar bloque y entrada. |
| R-19 | `templates/page.faq.json:66-77` (`cat_returns`, `q_returns`) | «Returns and exchanges»; «…returned within thirty days of delivery… Made-to-order work is final sale.» | P | Sí | Retirar ambos bloques y entradas. |
| R-20 | `templates/page.faq.json:82-84` | CTA «Write to the atelier and a person will answer you.», «Contact the atelier» → `/pages/contact` | A | Sí | Neutralizar: `<p>Send us a message through our contact page.</p>`, «Contact us»; URL sin cambios. |
| R-21 | `templates/page.contact.json:9-10` | «Shipping and provenance» / «Available pieces leave the atelier within two business days…» | P | Sí | Neutralizar: «Shipping» / mismo texto que R-12. |
| R-22 | `templates/page.contact.json:17-18` | «Care and longevity» / «Care instructions accompany each edition. Contact the atelier for repair…» | P | Sí | Neutralizar: «Care» / mismo texto que R-17. |
| R-23 | `templates/page.contact.json:22-29` (`faq_returns`) | «Contact the concierge with your order number to begin a return.» | P | Sí | Retirar bloque y entrada. |
| R-24 | `templates/page.contact.json:30-37` (`faq_bespoke`) | «Private appointments» / «Showroom and remote appointments are available by request.» | P | Sí | Retirar bloque y entrada. |
| R-25 | `templates/page.contact.json:38-58` (`service_appointments`, `service_orders`, `service_trade`) | «Showroom appointments / Monday through Friday», «Order concierge / Personal assistance», «Press and trade / Studio inquiries» | P | Sí | Retirar los 3 bloques y entradas (sin servicios no se renderiza la lista, `main-contact.liquid:180`). |
| R-26 | `templates/page.contact.json:70-71` | «Contact / Private client services»; «…or a private appointment.» | P | Sí | Neutralizar: «Contact»; `<p>Write to us about an order or a product.</p>`. |
| R-27 | `templates/page.contact.json:72-73` | «Monday to Friday / 10:00–18:00 CET», «By appointment / Milan» | P | Sí | Vaciar (filas ocultas, `main-contact.liquid:41,47`). |
| R-28 | `templates/page.about.json:18-19` | Atribución «Head of atelier», «Cutting and finishing» | A | Sí | Vaciar ambos (figcaption oculto, `main-about.liquid:71`). La cita se conserva (§3.6, O-08). |
| R-29 | `templates/page.about.json:22-33` (bloque `values`) | «Every cloth is bought from a mill we can name.», «Edges, linings and buttonholes are worked by hand.», «Pieces are cut in short runs…» | F | Sí | Retirar el bloque `values` y su entrada. |
| R-30 | `templates/page.about.json:39` | «Cutting, fitting and finishing, photographed over one season.» | F | Sí | Vaciar (pie oculto, `main-about.liquid:159`). |

## 3.3 Preset Sartorial (DEMO-preset)

| ID | Archivo:línea | Texto actual | Tipo | Acción |
| --- | --- | --- | --- | --- |
| S-01 | `listings/sartorial/templates/index.json:21` | «Sculptural bespoke architecture, hand-finished canvassing, and pure silk faille cut in limited editions.» | F | Neutralizar: `<p>Sculptural tailoring cut in considered proportions.</p>` |
| S-02 | `…/index.json:24` (URL `:25` `/collections/tailoring`) | CTA «Explore runway lookbook» hacia una colección | D | Neutralizar: «Explore tailoring» |
| S-03 | `…/index.json:32-34` | Marquee «PURE MULBERRY SILK & BIELLESE WOOL», «FULL FLOATING HORSEHAIR CANVAS», «HAND-ROLLED LAPELS & PICK-STITCHING» | F | Neutralizar: «PROPORTION / CUT / DRAPE», «TAILORING», «SILHOUETTE STUDIES» (claves `silk`, `canvas`, `lapel` sin renombrar) |
| S-04 | `…/index.json:69` | Eyebrow «RUNWAY PRESENTATION / SALON 01» | PR | Neutralizar: «PRESENTATION / SALON 01» |
| S-05 | `…/index.json:71` | «…movement from the runway presentation.» | PR | Neutralizar: `<p>Observe the architectural drape, proportion and movement of each silhouette.</p>` |
| S-06 | `…/index.json:86` | Featured `delivery_text` «Bespoke courier & private salon fitting \| Dispatched within 2 business days» | P | Vaciar (bloque oculto tras T-03) |
| S-07 | `…/index.json:108` | «…the double-breasted jacket, the silk blouse, and the pleated trouser.» | F | Neutralizar: retirar solo «silk »: `<p>Select the full tailored composition: the double-breasted jacket, the blouse, and the pleated trouser.</p>` |
| S-08 | `…/index.json:109` | «Bespoke tailoring composition photographed in salon light.» | F | Neutralizar: «Tailoring composition photographed in salon light.» |
| S-09 | `…/index.json:116-119` | Detalles «Super 160s Tasmanian Wool & Silk Faille», «Hand-stitched full floating horsehair canvas», «Milanese Sartoria & Biella Weavers», «Limited series of 20 bespoke executions» | F | Retirar los 4 bloques (`material`, `craft`, `origin`, `production`) |
| S-10 | `…/index.json:125` | «Every lapel is rolled by hand… We reject industrial shortcuts…» | F | Vaciar (body oculto) |
| S-11 | `…/index.json:139` | Newsletter «Private salon invitations, fabric allocation releases, and bespoke commission openings.» | P | Vaciar (cae a T-12) |
| S-12 | `listings/sartorial/templates/product.json:42` | «Complimentary white-glove courier \| Dispatched within 2 business days» | P | Vaciar (bloque oculto tras T-01) |
| S-13 | `listings/sartorial/templates/product.json:49` | «Complimentary atelier returns within 30 days» | P | Vaciar (bloque oculto tras T-02) |
| S-14 | `listings/sartorial/templates/collection.json:12` | «…from raw Biellese fleece to finished bespoke silhouette.» | F | Neutralizar: `<p>Follow a material study from cloth to finished silhouette.</p>` |

R-09 y R-10 ya cubren `listings/sartorial/templates/product.json:60-61,64-70`. No se tocan `index.json:35` ni `:52` (C-04-N, §7.1).

## 3.4 Preset Imprint (DEMO-preset)

| ID | Archivo:línea | Texto actual | Tipo | Acción |
| --- | --- | --- | --- | --- |
| I-01 | `listings/imprint/templates/index.json:21` | «Modular gear, aerospace hardware, and weatherproof membrane systems calibrated for daily EDC telemetry.» | F | Neutralizar: `<p>Modular gear and desk objects for daily carry.</p>` |
| I-02 | `…/index.json:24` (URL `:25` `/collections/desk-and-study`) | CTA «View technical specs» hacia una colección | D | Neutralizar: «Explore desk and study» (solapamiento parcial con D-01-V; R-D C-2: se queda en C-08, §9) |
| I-03 | `…/index.json:32-34` | Marquee «500D TECHNICAL BALLISTIC NYLON», «WEATHERPROOF TECHNICAL CLOSURES», «PRECISION ANODIZED HARDWARE / GRADE 5 TITANIUM» | F | Neutralizar: «TECHNICAL STUDIO», «DAILY OBJECTS», «DESK AND STUDY» |
| I-04 | `…/index.json:35` | Marquee «LASER-CUT MOLLE COMPATIBLE TELEMETRY» | F | Retirar bloque `molle` y su entrada |
| I-05 | `…/index.json:51` | «Aerospace grade EDC systems» | F | Neutralizar: «EDC systems» |
| I-06 | `…/index.json:73` (enlace `:71` `/collections/leather-goods`) | «Calibrated for extreme endurance» | F | Neutralizar: «Leather goods» (coincide con el destino) |
| I-07 | `…/index.json:74` | «Stress-tested technical textiles, weatherproof technical closures, and laser-machined anodized hardware.» | F | Vaciar (cuerpo oculto, `bento-discovery.liquid:108`) |
| I-08 | `…/index.json:91` | Pestaña «Limited studies» → `leather-goods` | F | Vaciar (usa el título real de la colección, `curated-showcase.liquid:40`) |
| I-09 | `…/index.json:122` | Featured «Worldwide express courier \| Dispatch in 2 business days» | P | Vaciar (bloque oculto tras T-03) |
| I-10 | `…/index.json:152-155` | Detalles «3-Layer DWR laminated waterproof shell», «CNC-machined anodized 6061 aluminium & titanium», «0.2mm laser cut edge bonding…», «Weather-resistant finish and construction» | F | Retirar los 4 bloques `spec1`–`spec4` |
| I-11 | `…/index.json:161` | «No decorative ornamentation. Every seam, bar-tack, and closure is engineered for enduring daily performance.» | F | Vaciar |
| I-12 | `…/index.json:175` | Newsletter «Specification releases, telemetry logs, and component testing documentation.» | P | Vaciar (cae a T-12) |
| I-13 | `listings/imprint/templates/product.json:42` | «Worldwide express courier \| Dispatch in 2 business days» | P | Vaciar |
| I-14 | `listings/imprint/templates/product.json:49` | «Complimentary returns within 30 days» | P | Vaciar |

## 3.5 Preset Archive (DEMO-preset)

| ID | Archivo:línea | Texto actual | Tipo | Acción |
| --- | --- | --- | --- | --- |
| AR-01 | `listings/archive/templates/index.json:22` | «Archival garments shaped by runway provenance, documented conservation, and historical time.» | PR | Neutralizar: `<p>A catalogue of garments and objects.</p>` |
| AR-02 | `…/index.json:25` (URL `:26` `/collections/restored-pieces`) | CTA «Restored selection» | D | Neutralizar: «View the selection» |
| AR-03 | `…/index.json:33-36` | Grados «Grade I / Mint … original details intact», «Grade II … Runway exhibition only», «Grade III … Stabilized by master conservator, zero structural flaws», «Grade IV-V / Authentic … Documented vintage patina» | PR | Retirar los 4 bloques `grade1`–`grade4` |
| AR-04 | `…/index.json:42` | «Every archive specimen is documented according to transparent curatorial standards…» | PR | Vaciar |
| AR-05 | `…/index.json:43` | CTA «Read curatorial notes» → `/collections/permanent-archive` | D | Neutralizar: «View the archive» |
| AR-06 | `…/index.json:53-55` | Marquee «CIRCA 1989–1999 THE PERMANENT ARCHIVE», «CURATED ARCHIVAL GARMENTS & CONSERVATION», «CURATED PERIOD SELECTIONS & ACCESSIONS» | PR | Neutralizar: «THE PERMANENT ARCHIVE», «CURATED GARMENTS & OBJECTS», «CURATED SELECTIONS & ACCESSIONS» (claves sin renombrar) |
| AR-07 | `…/index.json:56` | Marquee «PARIS & ANTWERP HISTORICAL RUNWAY PROVENANCE» | PR | Retirar bloque `provenance` y su entrada |
| AR-08 | `…/index.json:67` | Pestaña «1980s Deconstruction» (`decade80`, colección `permanent-archive`) | PR | Vaciar (muestra el título real de la colección, nominal). `decade90` pasa a F-4 (§3.8). |
| AR-09 | `…/index.json:69` | Pestaña «2000s Master Tailoring», mismo destino `permanent-archive` que `decade80` | D | Retirar bloque `decade00` y su entrada |
| AR-10 | `…/index.json:73` | Eyebrow «INDEX III / THE VAULT BY DECADES» | PR | Neutralizar: «INDEX III / THE VAULT» |
| AR-11 | `…/index.json:74` | «Historical Archive Entries» | PR | Neutralizar: «Archive Entries» |
| AR-12 | `…/index.json:91` | «Each piece is carefully inspected and presented as part of our curated period selections.» | PR | Neutralizar al default de `lookbook.liquid:218`: `<p>Explore each piece through the points placed across the composition.</p>` |
| AR-13 | `…/index.json:116` | Featured «Climate-controlled archival transport \| Insured courier» | P | Vaciar (bloque oculto tras T-03) |
| AR-14 | `…/index.json:133` | Newsletter «Occasional notices of restored objects, new records and workshop visits.» | P | Vaciar (cae a T-12) |
| AR-15 | `listings/archive/templates/collection.json:10` | «CURATED PERIOD SELECTIONS / ARCHIVE» | PR | Neutralizar: «CURATED SELECTIONS / ARCHIVE» |
| AR-16 | `…/collection.json:12` | «Every catalogued lot represents a curated period selection with documented condition and provenance notes.» | PR | Neutralizar: `<p>Browse the catalogue.</p>` |
| AR-17 | `…/collection.json:13` | CTA «Read curatorial notes» | D | Neutralizar: «View the archive» |

R-09 y R-10 ya cubren `listings/archive/templates/product.json:60-61,64-70`. No se toca `index.json:111` (`provenance_notes`, A-02) ni los bloques `provenance`/`technical_specs`.

## 3.6 Fuera de alcance o conservado con motivo (sin edición en C-08; O-20 a O-29 añadidos por la R-D, los «diez textos conservados»)

| ID | Ubicación | Motivo y dueño |
| --- | --- | --- |
| O-01 | `listings/archive/templates/index.json:111` `provenance_notes` | A-02 lo vació (commit `a6a9074`); ya no es residuo en la base de ejecución. |
| O-02 | `snippets/product-technical-specs.liquid` (p. ej. `:54` «Solid milled brass», `:70` «Precision machined»), `snippets/product-provenance.liquid:20-49` | A-02 (retiro de 14 fuentes y heurísticas). C-08 no toca snippets. |
| O-03 | `listings/sartorial/templates/index.json:35` «INDIVIDUALLY NUMBERED ATELIER EDITIONS», `:52` «ATELIER EDITIONS / 02» | C-04-N (Lote C, D23): valores completos ya decididos «SARTORIAL» y «SARTORIAL / 02». Residuo aceptado hasta el Lote C (R-D C-4, §9). |
| O-04 | `templates/page.support.json`, `templates/page.documentation.json` (incl. `:26` «Each preset changes theme settings only»), `sections/main-support.liquid:295,363,369`, `sections/main-documentation.liquid`, claves `support.*` de `locales/*.json` (`es.json:256`, `:278`), `docs/merchant/*.html` (`support.html:185,302`) | Soporte y documentación del comerciante: C-04-P / C-04 / G3 (criterio 6 de la decisión). D23: C-04-P excluye las dos plantillas del ZIP. |
| O-05 | `sections/main-product.liquid:941,947,965,971` defaults de `size_guide` («Model is 178cm…», medidas) | D-02-T (Lote D). El bloque no se usa en ninguna plantilla de `templates/` ni `listings/`. |
| O-06 | Barra de progreso de envío gratuito y regalo del cajón: `sections/cart-drawer.liquid:5-31,93-127,390-406`; `en.default.json:83-87`, `es.json:83-87`; `en.default.schema.json:812-816` | Conservado (R-D C-3): función opcional del comerciante, desactivada por defecto (`enable_tiered_progress` default `false`, `cart-drawer.liquid:392`), sin activación en `config/settings_data.json` ni en plantillas (`grep` 0). Corrección M-3: los umbrales tienen default 150 y 250 en el schema (`free_shipping_threshold`, `atelier_gift_threshold`) y en Liquid (`cart-drawer.liquid:9-10`, `\| default: 150` y `\| default: 250`), así que basta con activar la casilla para que se muestre «free shipping» a 150. La responsabilidad de que el valor coincida con las tarifas reales es del comerciante, como exige la ayuda `info` (`en.default.schema.json:815`). |
| O-07 | «Taxes and shipping calculated at checkout.» y variantes (`en.default.json:74,422-423`, `es.json` iguales); «Discounts and the final amount are confirmed at checkout.» (`en.default.json:424`) | Conservado: aviso estándar respaldado por el checkout de Shopify. |
| O-08 | Aforismos y copy de ambiente: `templates/index.json:147`, `listings/sartorial/templates/index.json:124`, `listings/imprint/templates/index.json:160` («Form follows engineering tolerance.»), `listings/archive/templates/index.json:41`, `templates/page.about.json:17` y default `sections/main-about.liquid:252`, default `sections/main-page.liquid:135` («Made slowly, kept closely.»), pies de foto `templates/index.json:275`, `listings/archive/templates/index.json:92` | Conservados por la regla §3.0 (no predican un hecho concreto). Confirmado por la R-D (Q-1, §9). |
| O-09 | Rótulos nominales: «atelier», «salon», «studio», «vault», «Master Tailor's…», `listings/sartorial/templates/index.json:19,48,53,70,107,123,128,137,138`, `collection.json:10`, `templates/index.json:90` | Conservados: el plan V4.1 §4.3 los preserva expresamente; renombrado masivo prohibido. |
| O-10 | Datos de catálogo en las tiendas (descripciones, handles con años como `1994-cashmere-cocoon-coat`, títulos de colección como «Restored pieces») | Fuera del repo: D-01 / D-01-L (D23). Las pestañas vaciadas en I-08 y AR-08 mostrarán esos títulos; su veracidad es de D-01. |
| O-11 | Destinos `/pages/about` (`templates/index.json:151,175`), `/pages/contact` (`templates/page.faq.json:84`), colecciones de los listings | Sin cambio de URL; su existencia depende de la tienda: R-A/R-C la verifican; si falta, D-01-N. No se crean ni borran páginas. |
| O-12 | Default `collapsible_tab` «Composition & care» / «Describe the fibres, the finish…» (`sections/main-product.liquid:1078,1084`) | Conservado: rótulo e instrucción sin hecho. |
| O-13 | «Unsubscribe at any time.» (T-11, se conserva la mitad de la frase) | Conservado: la baja de comunicaciones de marketing es una función de la plataforma. Confirmado por la R-D (Q-2, §9). |
| O-14 | Etiquetas de grado de `products.product.provenance.grade_*` (`en.default.json:435-439`) y opciones de `condition_grade` en schema (`en.default.schema.json:1049-1058`) | Ajustes manuales del comerciante, territorio A-02; no afirman nada hasta que el comerciante elige un grado. |
| O-15 | Descripción de interfaz `listings/imprint/templates/collection.json:12` («Toggle between compact 4-column matrix…») | Describe una función del tema; no es promesa al comprador. Su texto instructivo sigue siendo de D-01-V; el CTA del mismo bloque (`:13`) pasa a F-2. |
| O-16 | `listings/imprint/templates/index.json:50` «[01] MEMBRANE TELEMETRY», `:95-96`, `collection.json:11` «Engineered for high telemetry» | Rótulos genéricos sin dato concreto (regla §3.0). Confirmado por la R-D (Q-1, §9). |
| O-17 | `assets/base.css:6030` `.main-contact__response-note` | Queda CSS sin uso tras T-10. `assets/base.css` es del turno de A-03: no se toca (extra §7.3). |
| O-18 | `scripts/translations/es.storefront.json:318,718` | Diccionario de traducción de contenido de tienda, fuera del ZIP; entradas obsoletas (extra §7.3, D-01-L). |
| O-19 | `templates/page.about.json:11` «Tell the story of how the house began…» visible al comprador | No es promesa; texto instructivo visible (extra §7.3, D-01-V/D-03). |
| O-20 | `sections/main-password.liquid:172` default eyebrow «Private collection / New edition» (visible en la contraseña) | Conservado (R-D §2.2): rótulo sin hecho. |
| O-21 | `sections/main-password.liquid:178` default heading «The next study opens quietly.» (visible en la contraseña) | Conservado (R-D §2.2): ambiente. |
| O-22 | `listings/archive/templates/index.json:132` heading de newsletter «New vault accession notices» | Conservado (R-D §2.2): describe un boletín de novedades, sin servicio, fecha ni cantidad. |
| O-23 | `listings/imprint/templates/index.json:174` heading de newsletter «Engineering telemetry & field updates» | Conservado (R-D §2.2): igual que O-22. |
| O-24 | `listings/sartorial/templates/index.json:137` eyebrow de newsletter «PRIVATE SALON CORRESPONDENCE» | Conservado (R-D §2.2): rótulo nominal. |
| O-25 | `listings/archive/templates/index.json:40` eyebrow del manifiesto «CURATORIAL PROTOCOL / ARCHIVE 02» | Conservado (R-D §2.2): rótulo nominal. |
| O-26 | `listings/imprint/templates/index.json:144` capsule «A modular rig for daily carry, field telemetry and technical desk deployment.» | Conservado (R-D §2.2): adjetivos genéricos, familia de O-16. |
| O-27 | `listings/imprint/templates/index.json:72` eyebrow «[04] BLUEPRINT ANALYSIS» (bloque de F-1) | Conservado (R-D §2.2): rótulo; la narrativa técnica es de D-01-V. |
| O-28 | `sections/header-group.json:34` mega menú «Explore the autumn edit» | Conservado (R-D §2.2): temporada sin año. |
| O-29 | Locales en/es: `not_found.message` («…current series… moved into the archive.»), `password.image_alt` («Editorial preview of the next collection»), `sections.homepage.manifesto.region_label` («Our craft and materials», rótulo ARIA) | Conservados (R-D §2.2): rótulos y ambiente sin hecho concreto. |


## 3.7 Recuento (M-7)

| Grupo | Filas | P | F | PR | D | A | C | Retirar | Neutralizar | Vaciar | Sin edición |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| TEMA (T-01–T-27) | 27 | 18 | 5 | 0 | 1 | 1 | 2 | 10 | 17 | 0 | 0 |
| RAÍZ (R-01–R-30) | 30 | 18 | 9 | 0 | 1 | 2 | 0 | 11 | 12 | 6 | 1 |
| Sartorial (S-01–S-14) | 14 | 4 | 7 | 2 | 1 | 0 | 0 | 1 | 8 | 5 | 0 |
| Imprint (I-01–I-14) | 14 | 4 | 9 | 0 | 1 | 0 | 0 | 2 | 5 | 7 | 0 |
| Archive (AR-01–AR-17) | 17 | 2 | 0 | 11 | 4 | 0 | 0 | 3 | 10 | 4 | 0 |
| R-D (F-1–F-4) | 4 | 0 | 0 | 2 | 2 | 0 | 0 | 0 | 4 | 0 | 0 |
| **Total en alcance** | **106** | **46** | **30** | **15** | **10** | **3** | **2** | **27** | **56** | **22** | **1** |
| Recomendado R-D (F-5, coherencia) | 1 | | | | | | 1 | | 1 | | |
| Conservado o fuera de alcance (O-01–O-29) | 29 | | | | | | | | | | |

Por fase: **C-08a** 84 hallazgos (P 34, F 25, PR 14, D 9, A 2; 18 retirar, 43 neutralizar, 22 vaciar, 1 sin edición) más F-5. **C-08b** 22 hallazgos (P 12, F 5, PR 1, D 1, A 1, C 2; 9 retirar, 13 neutralizar).

## 3.8 Hallazgos añadidos por la R-D (M-2)

| ID | Archivo:línea | Texto actual | Tipo | Fase | Acción |
| --- | --- | --- | --- | --- | --- |
| F-1 | `listings/imprint/templates/index.json:70` (`discovery.blocks.story.link_label`) | CTA «Inspect blueprint» → `/collections/leather-goods`: promete un plano y lleva a un listado (misma clase que I-02) | D | C-08a | Neutralizar: «Explore leather goods» |
| F-2 | `listings/imprint/templates/collection.json:13` (`link_label`) | CTA «View specifications» → `/collections/daily-objects` (tarjeta de V-05) | D | C-08a | Neutralizar: «Explore daily objects». El archivo entra en la lista de C-08a. |
| F-3 | `sections/hero-editorial.liquid:404` | Default de `heading` «Autumn / Winter 26» (fecha) | PR | C-08b | Neutralizar el default: «Form in quiet movement» (heading ya empaquetado en `templates/index.json:21`). N2-2 pasa de 23 a 24 defaults. |
| F-4 | `listings/archive/templates/index.json:68` (`decade90`, colección `restored-pieces`) | «1990s Minimalist Vault»; vaciarlo haría aparecer el título de catálogo «Restored Pieces» (`agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-links-crawl.json:3480`), una afirmación de restauración nueva | PR | C-08a | Neutralizar: «Selected pieces» (coherente con AR-02 «View the selection»). `decade80` sigue vaciado (AR-08). |
| F-5 (recomendado) | `locales/en.default.json:237`, `locales/es.json:237` (`faq.search.placeholder`) | «Shipping, sizing, returns» / «Envíos, tallas, devoluciones»; tras R-19 el FAQ ya no tiene devoluciones | C | C-08a | Neutralizar: «Shipping, sizing, care» / «Envíos, tallas, cuidados» (las categorías que quedan). Nivel 1. |

## 3.9 Asignación de filas a fases

- **C-08a (Nivel 1):** R-01–R-30 (R-11 sin edición), S-01–S-14, I-01–I-14, AR-01–AR-17, T-07, T-08, T-10, T-11, T-12, T-13, F-1, F-2, F-4 y F-5.
- **C-08b (Nivel 2):** T-01–T-06 (N2-1), T-09 (N2-3), T-14–T-27 y F-3 (N2-2).

---

# 4. Alcance cerrado y reglas

## 4.1 Listas CERRADAS de archivos permitidos (M-8)

**C-08a (18 archivos):**

```text
locales/en.default.json
locales/es.json
sections/header-group.json
sections/main-contact.liquid          (solo la retirada de la nota de respuesta, T-10)
templates/index.json
templates/product.json
templates/page.faq.json
templates/page.contact.json
templates/page.about.json
listings/sartorial/templates/index.json
listings/sartorial/templates/product.json
listings/sartorial/templates/collection.json
listings/imprint/templates/index.json
listings/imprint/templates/product.json
listings/imprint/templates/collection.json
listings/archive/templates/index.json
listings/archive/templates/product.json
listings/archive/templates/collection.json
```

**C-08b (13 archivos):**

```text
locales/en.default.json
locales/es.json
locales/en.default.schema.json
sections/main-product.liquid
sections/featured-product.liquid
sections/main-contact.liquid
sections/announcement-bar.liquid
sections/brand-manifesto.liquid
sections/hero-editorial.liquid
sections/main-about.liquid
sections/main-faq.liquid
sections/main-password.liquid
sections/newsletter.liquid
```

Además, cada fase crea su informe (§8). Nada más.

No se tocan en ninguna fase: `assets/*` (incluido el CSS sin uso de O-17), `config/*`, `layout/*`, `snippets/*`, `templates/password.json` (salvo la alternativa de §5.7 con nueva R-D), `templates/page.support.json`, `templates/page.documentation.json`, `sections/main-support.liquid`, `sections/main-documentation.liquid`, `sections/cart-drawer.liquid`, `docs/**` (incluido el ledger), `agent-comms/BOARD.md`, `CLAUDE-CLOUD-STATUS.md`, decisiones, `scripts/**`.

## 4.2 Procedimiento obligatorio por fase

Para cada fase X ∈ {a, b}:

1. Preflight (§1.2, incluido lo específico de C-08b), línea base (§1.3) y extracción de scripts con hash (§1.4).
2. **Ensayo en copia** (no toca el repo):
   ```bash
   rm -rf "$SCRATCH/dry" && mkdir -p "$SCRATCH/dry"
   git archive HEAD assets config layout locales sections snippets templates listings scripts | tar -x -C "$SCRATCH/dry"
   python3 -I "$SCRATCH/c08X_apply.py" "$SCRATCH/dry"      # a: C08_APPLY_OK archivos=18 · b: C08_APPLY_OK archivos=13
   python3 -I "$SCRATCH/c08_verify.py" "$SCRATCH/dry" X    # C08_VERIFY_OK fase=X plantillas_revisadas=28
   ```
   Si falla: detenerse e informar el mensaje literal `C08_APPLY_FAIL: …`. No adaptar cadenas a mano.
3. **Aplicación real:** `python3 -I "$SCRATCH/c08X_apply.py" .` con la misma salida y la lista de archivos de §4.1 para esa fase.
4. Verificaciones de §5.2 para esa fase.
5. Revisión del diff por archivo; solo cambian las líneas de las filas de §3 asignadas a esa fase.
6. Informe (§8). Sin commit ni push: los hace el coordinador tras la revisión (D11, D16). C-08b no empieza hasta que exista el commit de C-08a.

Cada script escribe todos sus archivos solo si todas las sustituciones y retiradas encuentran exactamente 1 coincidencia y todo el JSON resultante parsea. Una segunda ejecución falla sin escribir. `c08b_apply.py` sobre un árbol sin C-08a sí aplica (sus cadenas no dependen de C-08a), pero la verificación `b` falla: el orden a → b es obligatorio.

## 4.3 Reglas de redacción

- Los textos nuevos son exactamente los de los Anexos A y B. Ninguno contiene material, origen, proceso, plazo, coste, servicio, persona, ensayo, certificación, fecha ni cantidad (R-D §3). El implementador no inventa ni ajusta copy; si una cadena le parece factual, lo anota sin cambiarla.
- Inglés neutro en `en.default.json`, plantillas y defaults; español neutro en `es.json`.
- Superficie del comerciante: no se añaden ni cambian labels. Las dos ayudas de T-06 siguen detrás de las mismas claves `t:`, en sentence case. Los defaults de schema siguen siendo texto literal, como todos los del tema.
- No se renombran IDs de bloque, settings, claves de sección, clases CSS ni handles. Las claves de bloque cuyo texto cambia (`silk`, `canvas`, `lapel`, `ballistic_nylon`, `closures`, `hardware`, `circa`, `conservation`, `accession`, `decade80`, `decade90`, `limited`) se mantienen.
- Liquid (C-08b, HX-1): no se añaden condiciones netas. La rama fusionada sustituye dos `when` y dos pares `if`/`elsif` por un `when` con dos valores, un `if` de texto vacío y una cadena `if`/`elsif` de cuatro iconos. No se mueve lógica a snippets nuevos ni se toca CSS.
- No se usa ocultación por CSS para eliminar promesas.

## 4.4 Claves de locale

- **C-08a** retira 1 clave hoja en cada locale (`contact.services.response`): `en.default.json` 438 → 437 hojas. Cambia valores en `inventory_status.in_stock`, `contact.form.success`, `password.newsletter.submit|privacy|success`, `newsletter.copy`, `newsletter.success` y `faq.search.placeholder` (F-5).
- **C-08b** retira 3 claves hoja más en cada locale (`sections.main_product.blocks.shipping_lead_time.delivery_fallback`, `sections.main_product.blocks.trust_badges.returns_fallback`, `contact.form.reason_appointment`) y los dos objetos contenedores que quedan vacíos: 437 → 434 hojas. Cambia dos `info` de `en.default.schema.json` (T-06).
- `scripts/locale-key-inventory.mjs` solo inventaría `en.default.json` y `en.default.schema.json`; la paridad con `es.json` se comprueba con el paso 8 de §5.2.
- No se añaden claves.

## 4.5 Qué no hacer

- No abrir, listar ni buscar en `.secrets`; no leer ni imprimir valores de variables de entorno; no imprimir el literal de contraseña.
- No ejecutar `shopify theme dev|push|pull|publish`, scripts `gate5-*`, ni nada contra tiendas; no instalar dependencias.
- No crear, leer, borrar ni proponer metafields, metaobjects o namespaces (D17).
- No copiar código de SebastianDev017/atelier.
- No editar fuera de la lista cerrada de la fase; no hacer commit, push, merge, rebase ni force; no crear ramas.
- No ejecutar C-08b sin el documento de autorización de Nivel 2.
- No declarar `cumplido` nada. No editar el ledger.

---

# 5. Criterios y pruebas sin tienda

## 5.1 Criterios de aceptación (falsables, por fase)

| # | Criterio | C-08a | C-08b |
| --- | --- | --- | --- |
| 1 | `git diff --name-only` = lista cerrada de la fase | 18 archivos | 13 archivos |
| 2 | Script de aplicación | `C08_APPLY_OK archivos=18` | `C08_APPLY_OK archivos=13` |
| 3 | `c08_verify.py . X` | `C08_VERIFY_OK fase=a plantillas_revisadas=28` | `C08_VERIFY_OK fase=b plantillas_revisadas=28` |
| 4 | Barrido (Anexo D, tabla de §5.3) | 71 líneas | 35 líneas |
| 5 | `node scripts/json-validate.mjs` | exit 0 | exit 0 |
| 6 | Theme Check | mismo nº de archivos que la línea base (92), 0 ofensas | ídem |
| 7 | `node scripts/theme-check-sanity.mjs` | exit 0 | exit 0 |
| 8 | `locale-key-inventory` | sin resolver 0/0, runtime 0, huérfanas 0/0; 437 hojas | ídem; 434 hojas |
| 9 | Paridad en/es | 437/437, 0/0 | 434/434, 0/0 |
| 10 | Complejidad Liquid (Anexo E) | `main-product` 120, `featured-product` 111 (sin cambio) | `main-product` 120, `featured-product` 110; ambas ≤ 120 |
| 11 | `grep -rn '"page":\|"page_content":' templates listings \| wc -l` | 0 | 0 |
| 12 | `grep -rnE "delivery_fallback\|returns_fallback\|contact\.services\.response\|reason_appointment" sections snippets layout templates listings locales \| wc -l` | 15 (estado intermedio: 4 líneas en cada una de las dos secciones de producto, 1 en `main-contact.liquid`, 3 en cada locale; `services.response` ya 0) | 0 |

El criterio 12 de C-08a cuenta las líneas que C-08b retirará: en cada sección de producto, por bloque, la línea `assign …_fallback = '…_fallback' | t` y la línea `| default: …_fallback`; la opción de `main-contact.liquid`; y en cada locale las dos claves de fallback y `reason_appointment`.

## 5.2 Comandos (pegar salida literal en el informe)

```bash
# 1
git diff --name-only | sort
# 3
python3 -I "$SCRATCH/c08_verify.py" . X
# 4 (M-4: awk sin truncar coincidencias que contienen «:»)
bash "$SCRATCH/c08_grep.sh" . | wc -l
bash "$SCRATCH/c08_grep.sh" . | awk -F: '{m=$3; for(i=4;i<=NF;i++) m=m":"$i; print $1": "tolower(m)}' | sort | uniq -c
# 5-8
node scripts/json-validate.mjs; echo "json_exit=$?"
npx shopify theme check --path .
node scripts/theme-check-sanity.mjs; echo "sanity_exit=$?"
node scripts/locale-key-inventory.mjs; echo "locale_exit=$?"
# 9
node -e 'const fs=require("fs");const flat=(o,p="")=>Object.entries(o).flatMap(([k,v])=>typeof v==="object"&&v!==null?flat(v,p+k+"."):[p+k]);const en=new Set(flat(JSON.parse(fs.readFileSync("locales/en.default.json"))));const es=new Set(flat(JSON.parse(fs.readFileSync("locales/es.json"))));console.log("en",en.size,"es",es.size,"en-es",[...en].filter(k=>!es.has(k)).length,"es-en",[...es].filter(k=>!en.has(k)).length)'
# 10
TMPDIR="$SCRATCH" bash "$SCRATCH/c08_complexity.sh" .
# 11
grep -rn '"page":\|"page_content":' templates listings | wc -l
# 12
grep -rnE "delivery_fallback|returns_fallback|contact\.services\.response|reason_appointment" sections snippets layout templates listings locales | wc -l
```

## 5.3 Barrido de promesas: patrones y residuos esperados (R-A y R-C lo repiten igual)

Patrones: `PAT` del Anexo D (ERE, sin distinguir mayúsculas, `LC_ALL=C.UTF-8`), que añade a v1 `inspect blueprint|view specifications|winter [0-9]{2}` (F-1 a F-3). Alcance: `templates listings sections snippets layout config/settings_data.json locales`, excluyendo `page.support.json`, `page.documentation.json`, `main-support.liquid` y `main-documentation.liquid` (O-04). Tabulación con el `awk` de §5.2 paso 4. Antes de editar: 298 líneas en `eb7cca7`, 296 en `c81cbcb` y en el árbol con A-01/B-02 (A-02 ya retiró `period selection` y `circa 1`). Los comentarios tras `#` no forman parte de la salida.

**Tras C-08b (resultado final de C-08; 35 líneas; residuo principal, M-4):**

```text
      2 listings/archive/templates/index.json: conservat          # clave de bloque "conservation" y su block_order
      1 listings/imprint/templates/index.json: tolerance          # aforismo (O-08)
      1 listings/sartorial/templates/index.json: numbered         # :35, C-04-N (O-03)
      1 locales/en.default.json: complimentary                    # clave complimentary_additions
      3 locales/en.default.json: free shipping                    # barra opcional del cajón (O-06)
      1 locales/en.default.json: grade i                          # etiquetas de grado (O-14)
      1 locales/en.default.json: grade ii
      1 locales/en.default.json: grade iii
      1 locales/en.default.json: grade iv
      2 locales/en.default.json: showroom                         # etiqueta contact.atelier.showroom
      2 locales/en.default.schema.json: free shipping             # ayuda de la barra opcional (O-06)
      1 locales/en.default.schema.json: grade i                   # opciones de condition_grade (O-14)
      1 locales/en.default.schema.json: grade ii
      1 locales/en.default.schema.json: grade iii
      1 locales/en.default.schema.json: grade iv
      1 locales/en.default.schema.json: repair                    # ayuda de condition_grade (O-14)
      1 locales/en.default.schema.json: showroom                  # label del setting showroom_address
      1 locales/es.json: complimentary
      3 locales/es.json: envío gratuito                           # barra opcional del cajón (O-06)
      2 locales/es.json: showroom
      5 sections/main-contact.liquid: showroom                    # id showroom_address y claves t:
      1 snippets/cart-drawer-recommendations.liquid: complimentary
      1 templates/page.contact.json: showroom                     # clave "showroom_address": ""
```

**Tras C-08a (estado intermedio; 71 líneas = las 35 anteriores + 36 que retira C-08b):**

```text
      2 listings/archive/templates/index.json: conservat
      1 listings/imprint/templates/index.json: tolerance
      1 listings/sartorial/templates/index.json: numbered
      2 locales/en.default.json: appointment
      1 locales/en.default.json: complimentary
      1 locales/en.default.json: costs confirmed at checkout
      3 locales/en.default.json: free shipping
      1 locales/en.default.json: grade i
      1 locales/en.default.json: grade ii
      1 locales/en.default.json: grade iii
      1 locales/en.default.json: grade iv
      2 locales/en.default.json: showroom
      1 locales/en.default.json: subject to our store policy
      2 locales/en.default.schema.json: free shipping
      1 locales/en.default.schema.json: grade i
      1 locales/en.default.schema.json: grade ii
      1 locales/en.default.schema.json: grade iii
      1 locales/en.default.schema.json: grade iv
      1 locales/en.default.schema.json: repair
      1 locales/en.default.schema.json: showroom
      1 locales/es.json: appointment
      1 locales/es.json: cita privada
      1 locales/es.json: complimentary
      1 locales/es.json: confirmados al pagar
      3 locales/es.json: envío gratuito
      2 locales/es.json: showroom
      1 locales/es.json: sujetas a la pol
      1 sections/announcement-bar.liquid: complimentary
      1 sections/brand-manifesto.liquid: by an artisan
      1 sections/brand-manifesto.liquid: read our process
      1 sections/brand-manifesto.liquid: traceab
      1 sections/hero-editorial.liquid: small series
      1 sections/hero-editorial.liquid: winter 26
      1 sections/main-about.liquid: a mill we can name
      1 sections/main-about.liquid: hand finished
      1 sections/main-about.liquid: short runs
      1 sections/main-about.liquid: small series
      1 sections/main-about.liquid: traceab
      1 sections/main-about.liquid: worked by hand
      1 sections/main-contact.liquid: 10:00
      4 sections/main-contact.liquid: appointment
      1 sections/main-contact.liquid: business day
      1 sections/main-contact.liquid: concierge
      1 sections/main-contact.liquid: milan
      1 sections/main-contact.liquid: monday to friday
      1 sections/main-contact.liquid: private client services
      5 sections/main-contact.liquid: showroom
      1 sections/main-contact.liquid: within three
      1 sections/main-faq.liquid: a person will answer
      1 sections/main-faq.liquid: contact the atelier
      1 sections/main-password.liquid: fired earth
      1 sections/main-password.liquid: first access
      1 sections/newsletter.liquid: private preview
      1 snippets/cart-drawer-recommendations.liquid: complimentary
      1 templates/page.contact.json: showroom
```

**R-C, tras C-04-N (M-6; 34 líneas):** la tabla final sin la línea `listings/sartorial/templates/index.json: numbered`. Si C-04-P retira del ZIP las plantillas de soporte, el barrido no cambia (ya las excluye). R-G no puede encontrar `numbered`.

Contingencia: si se aplicara sobre un árbol sin A-02, aparecerían además `listings/archive/templates/index.json: period selection` y `snippets/product-provenance.liquid: circa 1` (37 tras C-08b). No aplica a la base de ejecución, donde A-02 ya tiene commit (`a6a9074`). Cualquier otra diferencia es un fallo que se informa con la salida completa (`bash "$SCRATCH/c08_grep.sh" .`).

## 5.4 Recorrido estático de ausencia, fallbacks y destinos (criterio 3)

El informe deja, por superficie, esta comprobación estática con archivo:línea tras editar:

- **PDP y producto destacado (C-08b):** una sola rama `when 'shipping_lead_time', 'trust_badges'`; `trust_text` vacío o con espacios → sin `<p class="product-trust">`. No existe otro lector de `delivery_text`/`returns_text` (`grep -rn "delivery_text\|returns_text" sections snippets layout` solo devuelve esas dos secciones). Tras C-08a y antes de C-08b, los campos vaciados muestran el fallback genérico existente (§5.7).
- **Pestañas de producto (C-08a):** sin `shipping_returns`; ninguna plantilla asocia página (criterio 11).
- **Newsletter (C-08a):** `text` vacío cae a `newsletter.copy` neutralizado.
- **Contacto:** C-08a deja la página sin servicios ni nota de respuesta, con horario y dirección vacíos (filas ocultas). El `<dl class="main-contact__atelier-facts">` queda vacío; es válido y sin borde (`assets/base.css:5854-5858`), y R-A lo revisa visualmente (extra de la R-D). C-08b deja el `<select>` con 5 opciones (placeholder, pedido, materiales, prensa, otro).
- **Contraseña (C-08b):** `opening_note` sin default no se muestra; texto por defecto neutro.
- **Destinos de CTA tocados:** R-07 `/pages/about`, R-20 `/pages/contact`, S-02 `/collections/tailoring`, I-02 `/collections/desk-and-study`, I-06 y F-1 `/collections/leather-goods`, F-2 `/collections/daily-objects`, AR-02 `/collections/restored-pieces`, AR-05 y AR-17 `/collections/permanent-archive`, R-01 y T-14/T-16 `/collections/all`. La URL no cambia; cada etiqueta queda limitada a lo que el destino ofrece por su nombre. Existencia en tienda: «no verificado» (D22).

## 5.5 Cinco compuertas

1. **Requisitos / ledger:** §6. Evidencia por fila con archivo:línea tras editar; ninguna fila pasa a `cumplido`.
2. **Estados degenerados** (en código; en tienda quedan para R-A):
   - *Vacío:* entrega/devoluciones vacíos o con espacios → sin `<p>` (tras C-08b); manifiesto sin detalles → sin `<dl>`; newsletter sin texto → locale neutro; contacto sin servicios → sin lista; FAQ sin devoluciones.
   - *Uno solo:* marquee de Archive con 3 ítems y raíz con 2; pestañas de Archive con 2; una sola pregunta en el contacto si el comerciante borra la otra.
   - *Muchos:* sin cambio (no se añaden listas); `max_blocks` intactos.
   - *Muy largo:* un `delivery_text` de 120 caracteres se pinta igual que antes (misma marca y escape).
   - *Faltante:* colección de pestaña inexistente → `tab_fallback` («Collection N»); `/pages/about` o `/pages/contact` ausente → 404 de Shopify, sin promesa (O-11).
3. **Consistencia entre archivos:** el mismo texto neutro de envío y de cuidado se repite literal en FAQ, contacto y producto; `in_stock` coincide con `en.default.json:631`; AR-12 reutiliza el default de `lookbook.liquid:218`; T-22 reutiliza los defaults de `main-faq.liquid:213,219`; F-3 reutiliza el heading empaquetado; F-4 coincide con AR-02; F-5 coincide con las categorías del FAQ; los newsletters vacíos usan una única fuente (`newsletter.copy`); los cuatro SVG de la rama fusionada son los existentes, sin duplicar.
4. **Superficie del comerciante:** no cambian labels; las dos ayudas de T-06 siguen en `t:` y explican el nuevo comportamiento («Leave blank to hide this block.»).
5. **Tienda real:** no aplica sin credenciales (D22). Queda para R-A en preview acreditado: PDP con los dos campos vacíos y llenos en ambas superficies y con cada icono; FAQ, contacto, about, contraseña y home de los tres presets; destinos de §5.4.

## 5.6 Nivel de desviación y autoridad (M-1)

**C-08a es Nivel 1:** contenido de plantillas y listings (R-, S-, I-, AR-, F-1, F-2, F-4), valores de locale (T-07, T-08, T-11 a T-13, F-5) y retirada del marcado de la nota de respuesta con su clave (T-10). No toca ningún `id`, `default`, opción ni comportamiento de un setting.

**C-08b es Nivel 2 y NO está autorizado:**

- **N2-1 (T-01 a T-06):** un `delivery_text`/`returns_text` vacío deja de mostrar un mensaje neutro y oculta el bloque; la `info` vigente promete al comerciante lo contrario. El fallback actúa como default efectivo del setting.
- **N2-2 (T-14 a T-27 y F-3):** 24 defaults de schema en 9 secciones (`announcement-bar` 1, `brand-manifesto` 3, `hero-editorial` 2, `main-about` 6, `main-contact` 7, `main-faq` 2, `main-password` 2, `newsletter` 1); 4 se retiran y 20 se neutralizan. RULES §3.5: «altera un `default`».
- **N2-3 (T-09):** el formulario de contacto deja de ofrecer «Private appointment» (cambia los valores de `contact[Reason]`).

RULES §3.5 atribuye la autorización de Nivel 2 a Gemini (Antigravity); D11 solo la delega en el revisor para A-02; la decisión C08 es de contenido y «no autoriza ejecutar C-08». **N2-1, N2-2 y N2-3 REQUIEREN AUTORIZACIÓN ESCRITA DE JOHANDRY** (D10, cambio fuera de las decisiones registradas), que puede autorizarlos total o parcialmente, delegar en el revisor Opus de C-08 (ampliando D11) o remitirlos a Antigravity. El informe de C-08b cita ese documento. Texto propuesto por la R-D para la pregunta:

> C-08 necesita tres cambios de contrato con el comerciante para cumplir tu decisión del 2026-11-02 sin dejar promesas en fallbacks ni defaults: (1) si los textos de entrega o devoluciones de la ficha de producto quedan vacíos, el bloque se oculta en vez de mostrar «Delivery times and costs confirmed at checkout» / «Returns subject to our store policy»; (2) 24 textos por defecto de secciones dejan de incluir promesas (envío gratis a 150 $, «hecho a mano», horario, Milán, «first access»…); (3) el formulario de contacto deja de ofrecer «Private appointment». ¿Los autorizas, total o parcialmente, o delegas la autorización en el revisor?

Contrato con el comerciante: sí cambia en C-08b. Ninguna instalación existente se ve afectada (el tema no se ha publicado en la Theme Store). C-04-R (Lote C) puede mencionar N2-1 en las notas de versión si Johandry lo decide.

## 5.7 Estado intermedio y alternativas si Johandry deniega

- **Entre C-08a y C-08b:** las superficies con `delivery_text`/`returns_text` vacíos (los cuatro `product.json`, los tres productos destacados de los listings y R-11) muestran el fallback genérico existente («Delivery times and costs confirmed at checkout», «Returns subject to our store policy»), igual que `templates/product.json` hoy. Los defaults de schema siguen con sus promesas y la contraseña sigue mostrando T-25/T-26. **C-08 no se acepta en R-A hasta que C-08b se aplique o Johandry decida otra cosa.**
- **Si deniega N2-1:** nueva R-D para retirar de las 7 plantillas los bloques `shipping_lead_time` y `trust_badges` vacíos (Nivel 1); el fallback queda como residuo documentado para bloques que añada el comerciante.
- **Si deniega N2-2:** mitigación opcional de Nivel 1 en `templates/password.json` con `"text"` neutro y `"opening_note": ""` (probada por la R-D en `rd-c08/splitP`, Theme Check 0 ofensas), con nueva R-D por estar fuera de la lista; los demás defaults quedan como residuo con dueño.
- **Si deniega N2-3:** la opción queda como residuo con dueño y C-08 no se puede cerrar.
- En cualquier denegación parcial, `c08b_apply.py` no se ejecuta tal cual: se redacta una variante con nueva R-D.

## 5.8 HX-1: complejidad Liquid

- La regla `LiquidComplexity` (máximo 120 en el preset recomendado) suma 1 por cada `if`, `unless`, `case`, `for`, `tablerow`, `paginate`, `elsif`, `when` y por cada `and`/`or` en condiciones `if`/`unless`/`elsif`.
- Base con A-01/B-02: `main-product.liquid` 120 (en el límite), `featured-product.liquid` 111. El diseño de v1 añadía un `if` por bloque (122 y 113): un aviso de Theme Check.
- Diseño de v2 en `main-product.liquid`: antes, 2 `when` + 2 `if` + 2 `elsif` = 6; después, 1 `when` (dos valores en una sola rama) + 1 `if` de texto + 1 `if` + 3 `elsif` de iconos = 6. Neto 0 → 120. En `featured-product.liquid`: antes 2 `when` + 2 `if featured_product` + 2 `if` + 2 `elsif` = 8; después 1 `when` + 1 `if` + 1 `and` + 1 `if` + 3 `elsif` = 7 → 110.
- El marcado de salida es idéntico (mismos atributos, mismos SVG, mismo escape). Los selects de icono siguen limitando cada bloque a sus valores (`none/truck/clock` y `none/shield/ruler`), así que la cadena de cuatro iconos no cambia ningún resultado.
- Riesgo residual: `main-product.liquid` queda sin margen (120/120). Cualquier tarea posterior que añada una decisión en ese archivo debe compensarla o moverla a un snippet (§7.3).

---

# 6. Ledger

`docs/requirements-ledger.md` no tiene fila para RC-07/TT-63; C-08 no cierra ni crea filas (el implementador no edita el ledger).

| Línea | Fila | Estado actual | Efecto | Propuesta (R-D Q-5) |
| --- | --- | --- | --- | --- |
| 88 | Capa de Confianza e Inventario Reactivo en PDP | `cumplido` | C-08a solo cambia el copy de `in_stock`. C-08b cambia el comportamiento de `shipping_lead_time`/`trust_badges` vacíos y fusiona su rama. | C-08a: sin cambio de estado, nota en la evidencia. Cuando R-A acepte C-08b: `código completo` con evidencia archivo:línea nueva (rama fusionada de `main-product.liquid` y `featured-product.liquid`) hasta la prueba en preview. |
| 84 | Formulario de Newsletter en Storefront | `cumplido` | Copy (`newsletter.copy`, `newsletter.success`, textos vacíos en plantillas, default retirado en C-08b). | Sin cambio de estado; referencia a C-08 en la evidencia. |
| 22 | Schemas Válidos y Settings (100% t: Localizados) | `cumplido` | C-08b cambia defaults y dos `info` `t:`; ningún label literal nuevo. | Sin cambio; evidencia: `locale-key-inventory` tras C-08b. |
| 109 | Presets Diferenciados (1 a 4) | `cumplido` | C-08a cambia copy de `listings/*`; la diferenciación se mantiene. | Sin cambio; re-verificación en R-Demo/G1. |
| 111 | 3 Tiendas Demo Auténticas (Sin Lorem Ipsum) | `cumplido` | Las demos en vivo divergen del repo hasta subir el candidato. | Sin cambio por C-08; re-verificación en R-Demo/G1. |

Estado máximo sin tienda (D22, RULES §3.8): `código completo`. Nada se declara `cumplido` con análisis estático.

---

# 7. Riesgos, límites y fronteras

## 7.1 Fronteras

- **C-04-N (Lote C, D23):** `listings/sartorial/templates/index.json:35` y `:52` son de C-04-N; residuo `numbered` aceptado hasta el Lote C (R-D C-4). No se renombran «atelier», «salon» ni identificadores; las cadenas que el plan conserva (`:19,53,70,107,128`, `collection.json:10`, `templates/index.json:90`) no se tocan.
- **C-04-P:** soporte y documentación del comerciante (O-04) fuera; el barrido los excluye.
- **C-04-R:** sin notas de versión aquí; puede mencionar N2-1.
- **A-02 (commit `a6a9074`):** dueño de los dos snippets, `provenance_notes` y la ayuda de `provenance_notes`. Comparte archivos con C-08 pero no cadenas.
- **A-01/B-02:** editan otras regiones de `main-product.liquid` y `featured-product.liquid`; C-08 se ejecuta sobre su commit. Si chocan, los scripts fallan sin escribir.
- **A-03 (commit `c81cbcb`):** dueño de `assets/base.css` en el Lote A.
- **D-01-V:** I-02, F-1 y F-2 solo reetiquetan el CTA para que coincida con su destino (R-D C-2, sin Johandry). D-01-V conserva la narrativa técnica, la tarjeta instructiva, el material por tipo y un posible destino técnico real.
- **D-01 / D-01-N / D-01-L / D-02-T:** catálogo, existencia de páginas, traducciones de tienda y guía de tallas.

## 7.2 Riesgos

- **Cambio visual de demos:** desaparecen la pestaña de envío y devoluciones, los detalles del manifiesto, la promesa del anuncio y los servicios de contacto. Capturas en R-Demo.
- **Copy neutro nuevo:** 56 neutralizaciones (más F-5), aceptadas por la R-D (§3 de la R-D).
- **Pestaña `decade80`:** muestra el título real de `permanent-archive` (rótulo nominal según la R-D); si el catálogo cambia, D-01.
- **Estado intermedio largo:** si C-08b se retrasa, la promesa de los fallbacks sigue visible en tienda (§5.7).
- **Complejidad sin margen** en `main-product.liquid` (§5.8).
- **Sin renderizado:** la ocultación se acredita leyendo código y con el Anexo C.

## 7.3 Hallazgos extra fuera de alcance (registrar en el informe, sin parche)

- `assets/base.css` regla `.main-contact__response-note` sin uso tras T-10 (`:6030` en `eb7cca7`; archivo de A-03).
- `scripts/translations/es.storefront.json:318,718`: entradas obsoletas («Private appointments», «Complimentary shipping on orders over $150»); fuera del ZIP (D-01-L).
- `templates/page.about.json:11`: texto instructivo visible al comprador (D-01-V/D-03).
- `<dl class="main-contact__atelier-facts">` vacío sin horario ni dirección (`sections/main-contact.liquid:41-54`; R-D extra a); revisión visual en R-A.
- `sections/main-product.liquid` en 120/120 de complejidad: cualquier ampliación futura debe moverse a un snippet.

---

# 8. Informes del implementador

- **C-08a:** `agent-comms/outbox-claude/CLAUDE-REPORT-C-08-001.md`.
- **C-08b:** `agent-comms/outbox-claude/CLAUDE-REPORT-C-08-002.md`, que cita el documento de autorización de Nivel 2 de Johandry (o su delegación).

Cabecera completa RULES §1.4. Contenido mínimo de cada uno:

1. Preflight (§1.2) y línea base (§1.3) con salidas literales, incluida la complejidad; `git log --oneline eb7cca7..HEAD`.
2. SHA-256 de los cinco scripts extraídos (§1.4).
3. Salida literal del ensayo y de la aplicación real (§4.2).
4. `git diff --stat` y `git diff --name-only`; diferencias con la lista cerrada de la fase (debe ser ninguna).
5. Salidas literales de §5.2, con la tabla del barrido de la fase y la explicación de cualquier diferencia.
6. Recorrido estático de §5.4 con archivo:línea tras editar.
7. Tabla de filas ejecutadas de la fase (ID → archivo:línea nuevo → resultado).
8. Compuertas (§5.5), desviaciones (C-08a: ninguna; C-08b: N2-1 a N2-3 con la autorización citada) y extras (§7.3).
9. Propuesta para el ledger (§6), sin editarlo, y lo que queda «no verificado» sin tienda.
10. Afirmaciones falsables numeradas. Todo etiquetado «estático».

Ninguna parte del informe contiene contraseñas, cookies, tokens ni valores de entorno.

---

# 9. Conflictos y dudas: resolución de la R-D

- **C-1 (autoridad de Nivel 2):** resuelto como «requiere a Johandry» (§5.6). Único punto pendiente de Johandry.
- **C-2 (I-02 frente a D-01-V):** se queda en C-08, sin Johandry; F-1 y F-2 reciben el mismo tratamiento.
- **C-3 (barra de envío gratuito y regalo):** se conserva, sin Johandry; premisa de O-06 corregida (M-3).
- **C-4 («NUMBERED»):** residuo aceptado hasta C-04-N; R-C verifica que desaparece (34 líneas).
- **Q-1:** se conservan O-08, O-09, O-16 y O-20 a O-29; R-A vuelve a valorar «Made slowly, kept closely.» en contexto.
- **Q-2:** «Unsubscribe at any time.» se conserva; R-A comprueba que el formulario de la contraseña crea un cliente con consentimiento revocable.
- **Q-3:** cadenas neutras aceptadas, con F-4.
- **Q-4:** los bloques vacíos se mantienen en las plantillas si se autoriza N2-1; si no, §5.7.
- **Q-5:** fila 88 según §6.
- **Q-6:** esfuerzo ≈ 1 h C-08a y ≈ 1 h C-08b tras la autorización; prueba en tienda de R-A pendiente de credenciales (D22).

---

# 10. Trazabilidad de los cambios de la R-D

| Cambio | Dónde |
| --- | --- |
| M-1 partición C-08a/C-08b, Nivel 2 no autorizado, estado intermedio y alternativas | §1, §3.9, §4.1, §4.2, §5.1, §5.6, §5.7, §8, Anexos A y B |
| M-2 F-1, F-2, F-4 (C-08a), F-3 (C-08b), `listings/imprint/templates/collection.json` en la lista, conservables §2.2 | §3.5 (AR-08), §3.6 (O-20 a O-29), §3.8, §4.1, Anexos A y B |
| M-3 premisa de O-06 | §3.6 O-06 |
| M-4 residuo principal 35, `awk` sin truncado, patrones F-1 a F-3, hashes nuevos | §1.4, §5.2 paso 4, §5.3, Anexo D |
| M-5 verificación por fase | Anexo C (`c08_verify.py <raiz> a\|b`), §5.1 |
| M-6 lista de R-C tras C-04-N | §5.3 |
| M-7 106 hallazgos y recuento | Resumen, §3.7 |
| M-8 afirmación 6 y dos listas cerradas | Cabecera, §4.1 |
| F-5 recomendado | §3.8, C-08a, Anexo A |
| HX-1 complejidad | §4.3, §5.1 (10), §5.8, Anexos B y E |
| Base tras el commit de A-01/B-02 | §1.1, §1.2, §0.2 |

---

# Anexos

Se extraen con el comando de §1.4. Su contenido es normativo: si una cadena de §3 difiere de los Anexos A o B, mandan los anexos y el implementador lo anota.

## Anexo A. `c08a_apply.py` (C-08a, Nivel 1)

<!-- ANEXO c08a_apply.py -->
```python
#!/usr/bin/env python3
"""C-08a: contenido de plantillas, listings y valores de locale (Nivel 1).

Uso:  python3 -I c08a_apply.py <raiz-del-repo>
Cada sustitucion literal exige exactamente 1 coincidencia (RULES 3.2).
Las retiradas de bloques JSON se verifican despues parseando el JSON.
Sale con codigo 1 ante cualquier discrepancia SIN haber escrito nada.
Directiva: agent-comms/outbox-claude/CLAUDE-DIRECTIVA-C-08-001.md (v2).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]).resolve()
BUF = {}


def load(rel):
    if rel not in BUF:
        BUF[rel] = (ROOT / rel).read_text(encoding="utf-8")
    return BUF[rel]


def fail(msg):
    print("C08_APPLY_FAIL: " + msg)
    sys.exit(1)


def R(rel, old, new):
    t = load(rel)
    c = t.count(old)
    if c != 1:
        fail(f"{rel}: se esperaba 1 coincidencia y hay {c}: {old[:70]!r}")
    BUF[rel] = t.replace(old, new, 1)


def _match_brace(t, i):
    """i apunta a '{' o '['; devuelve el indice del cierre correspondiente."""
    pairs = {"{": "}", "[": "]"}
    stack = [t[i]]
    j = i + 1
    in_str = False
    while j < len(t):
        ch = t[j]
        if in_str:
            if ch == "\\":
                j += 2
                continue
            if ch == '"':
                in_str = False
        elif ch == '"':
            in_str = True
        elif ch in "{[":
            stack.append(ch)
        elif ch in "}]":
            if pairs[stack[-1]] != ch:
                fail("llaves desbalanceadas")
            stack.pop()
            if not stack:
                return j
        j += 1
    fail("cierre no encontrado")


def _section_span(t, section_key):
    m = [x.start() for x in re.finditer(r'\n    "' + re.escape(section_key) + r'": \{', t)]
    if len(m) != 1:
        fail(f"seccion {section_key!r}: {len(m)} coincidencias")
    start = t.index("{", m[0] + 1)
    return start, _match_brace(t, start)


def remove_block(rel, section_key, block_key):
    t = load(rel)
    s0, s1 = _section_span(t, section_key)
    sec = t[s0:s1 + 1]
    pat = '"' + block_key + '": {'
    if sec.count(pat) != 1:
        fail(f"{rel}: bloque {block_key!r} en {section_key!r}: {sec.count(pat)} coincidencias")
    b0 = sec.index(pat)
    b1 = _match_brace(sec, b0 + len(pat) - 1)
    line0 = sec.rfind("\n", 0, b0)
    after = sec[b1 + 1:]
    if after.startswith(","):
        sec = sec[:line0] + sec[b1 + 2:]
    else:
        k = line0
        while k > 0 and sec[k - 1] in " \n":
            k -= 1
        prev = sec[k - 1]
        if prev == ",":
            sec = sec[:k - 1] + sec[b1 + 1:]
        elif prev == "{":
            sec = sec[:line0] + sec[b1 + 1:]
        else:
            fail(f"{rel}: forma inesperada antes de {block_key!r}")
    # block_order
    m = re.search(r'"block_order": \[', sec)
    if not m:
        fail(f"{rel}: sin block_order en {section_key!r}")
    a0 = m.end() - 1
    a1 = _match_brace(sec, a0)
    arr = sec[a0:a1 + 1]
    items = json.loads(arr)
    if items.count(block_key) != 1:
        fail(f"{rel}: {block_key!r} no esta una vez en block_order")
    items.remove(block_key)
    if not items:
        new_arr = "[]"
    elif "\n" in arr:
        ind = re.search(r'\n(\s*)"', arr).group(1)
        close_ind = re.search(r'\n(\s*)\]$', arr).group(1)
        new_arr = "[\n" + ",\n".join(ind + json.dumps(x) for x in items) + "\n" + close_ind + "]"
    else:
        new_arr = "[" + ", ".join(json.dumps(x) for x in items) + "]"
    sec = sec[:a0] + new_arr + sec[a1 + 1:]
    sec = re.sub(r'"blocks": \{\s*\}', '"blocks": {}', sec)
    BUF[rel] = t[:s0] + sec + t[s1 + 1:]


# ------------------------------------------------- E1a marcado (Nivel 1)
MC = "sections/main-contact.liquid"
R(MC, """            <p class="main-contact__response-note">{{ 'contact.services.response' | t }}</p>
""", "")

# ----------------------------------------------- E3a locales (Nivel 1)
for loc, vals in {
    "locales/en.default.json": dict(
        stock=('"in_stock": "In stock, ready to ship",', '"in_stock": "In stock",'),
        succ=('"success": "Thank you. We will reply as soon as possible.",', '"success": "Thank you. Your message has been sent.",'),
        resp=('''      "title": "Direct studio contacts",
      "response": "Response standard: two business days"
''', '''      "title": "Direct studio contacts"
'''),
        pw=('''      "submit": "Request early access",
      "privacy": "Private notes only. Unsubscribe at any time.",
      "success": "Thank you. Your early access request was received.",''',
            '''      "submit": "Subscribe",
      "privacy": "Unsubscribe at any time.",
      "success": "Thank you for subscribing.",'''),
        nl=('''    "copy": "New objects, material studies and private previews, sent with restraint.",''',
            '''    "copy": "Subscribe to our newsletter.",'''),
        nls=('''    "success": "Thank you. Your first note will arrive soon.",''',
             '''    "success": "Thank you for subscribing.",'''),
        ph=('"placeholder": "Shipping, sizing, returns",', '"placeholder": "Shipping, sizing, care",'),
    ),
    "locales/es.json": dict(
        stock=('"in_stock": "En existencias, listo para enviar",', '"in_stock": "En existencias",'),
        succ=('"success": "Gracias. Te responderemos lo antes posible.",', '"success": "Gracias. Tu mensaje se ha enviado.",'),
        resp=('''      "title": "Contactos directos del estudio",
      "response": "Plazo de respuesta: dos días hábiles"
''', '''      "title": "Contactos directos del estudio"
'''),
        pw=('''      "submit": "Solicitar acceso anticipado",
      "privacy": "Solo notas privadas. Puedes darte de baja cuando quieras.",
      "success": "Gracias. Hemos recibido tu solicitud de acceso anticipado.",''',
            '''      "submit": "Suscribirse",
      "privacy": "Puedes darte de baja cuando quieras.",
      "success": "Gracias por suscribirte.",'''),
        nl=('''    "copy": "Nuevos objetos, estudios de materiales y avances privados, enviados con mesura.",''',
            '''    "copy": "Suscríbete a nuestro boletín.",'''),
        nls=('''    "success": "Gracias. Tu primera nota llegará pronto.",''',
             '''    "success": "Gracias por suscribirte.",'''),
        ph=('"placeholder": "Envíos, tallas, devoluciones",', '"placeholder": "Envíos, tallas, cuidados",'),
    ),
}.items():
    for k in ("stock", "succ", "resp", "pw", "nl", "nls", "ph"):  # ph = F-5 (R-D C-08)
        R(loc, *vals[k])

# ------------------------------------------------- E4 plantillas raiz
HG = "sections/header-group.json"
R(HG, '"text": "Complimentary shipping on orders over $150",', '"text": "Explore the collection",')
R(HG, '"subheading_2": "Pieces made in small series",', '"subheading_2": "",')

IX = "templates/index.json"
R(IX, '"subheading": "<p>A study in quiet movement. Sculptural layers and tactile materials, made in small series.</p>",',
  '"subheading": "<p>A study in quiet movement. Sculptural layers and tactile materials.</p>",')
remove_block(IX, "marquee", "marquee_series")
remove_block(IX, "marquee", "marquee_origin")
for k in ("detail_material", "detail_origin", "detail_finish", "detail_series"):
    remove_block(IX, "brand_manifesto", k)
R(IX, '"body": "<p>Every seam, edge and finish records a decision made by an artisan, not an anonymous process.</p>",',
  '"body": "",')
R(IX, '"button_label": "Read our process",', '"button_label": "About us",')
R(IX, '"text": "<p>New objects, material studies and private previews, sent with restraint.</p>"', '"text": ""')

CARE_OLD_TEXTILE = '"content": "<p>Each piece is made from natural materials chosen for how they age with use. The exact composition is listed in the description above.</p><ul><li>Follow the care label sewn into each piece; most prefer airing over washing.</li><li>Dry flat, away from direct heat and sunlight, and press with a cool iron.</li><li>Store knitwear folded; hang tailoring and outerwear on a shaped hanger.</li></ul>"'
CARE_OLD_IMPRINT = '"content": "<p>Refer to the product description for material details and follow the care instructions supplied with your item.</p><p>Care requirements vary by material and finish. If instructions are missing, contact us before cleaning or applying any product.</p>"'
CARE_NEW = '"content": "<p>Care depends on the material and finish of each piece. If you are unsure how to care for it, contact us before cleaning it.</p>"'
for pj in ("templates/product.json", "listings/sartorial/templates/product.json",
           "listings/imprint/templates/product.json", "listings/archive/templates/product.json"):
    R(pj, '"heading": "Composition & care",', '"heading": "Care",')
    R(pj, CARE_OLD_IMPRINT if "imprint" in pj else CARE_OLD_TEXTILE, CARE_NEW)
    remove_block(pj, "main", "shipping_returns")
R("listings/sartorial/templates/product.json",
  '"delivery_text": "Complimentary white-glove courier | Dispatched within 2 business days",', '"delivery_text": "",')
R("listings/sartorial/templates/product.json",
  '"returns_text": "Complimentary atelier returns within 30 days",', '"returns_text": "",')
R("listings/imprint/templates/product.json",
  '"delivery_text": "Worldwide express courier | Dispatch in 2 business days",', '"delivery_text": "",')
R("listings/imprint/templates/product.json",
  '"returns_text": "Complimentary returns within 30 days",', '"returns_text": "",')

FQ = "templates/page.faq.json"
R(FQ, '"answer": "<p>Pieces held in the atelier leave within two business days. Made-to-order work carries its own dispatch estimate on the product page.</p>",',
  '"answer": "<p>Dispatch and delivery times depend on the item and your destination. Contact us before ordering if you need a piece by a specific date.</p>",')
remove_block(FQ, "main", "q_tracking")
R(FQ, '"settings": { "title": "Sizing and tailoring" }', '"settings": { "title": "Sizing" }')
R(FQ, '"answer": "<p>Every product page carries the measurements of the piece and of the model wearing it. Write to us with your usual size and we will tell you how this cut behaves.</p>",',
  '"answer": "<p>If you are unsure which size to choose, contact us with your usual size before ordering.</p>",')
remove_block(FQ, "main", "q_alterations")
R(FQ, '"settings": { "title": "Garment care" }', '"settings": { "title": "Care" }')
R(FQ, '"question": "How should I care for these fabrics?",', '"question": "How should I care for my piece?",')
R(FQ, '"answer": "<p>Care instructions travel with each piece. As a rule, natural fibres prefer airing over washing and a cool iron over a hot one.</p>",',
  '"answer": "<p>Care depends on the material and finish of each piece. If you are unsure how to care for it, contact us before cleaning it.</p>",')
remove_block(FQ, "main", "q_repairs")
remove_block(FQ, "main", "cat_returns")
remove_block(FQ, "main", "q_returns")
R(FQ, '"text": "<p>Write to the atelier and a person will answer you.</p>",',
  '"text": "<p>Send us a message through our contact page.</p>",')
R(FQ, '"button_label": "Contact the atelier",', '"button_label": "Contact us",')

CT = "templates/page.contact.json"
R(CT, '"question": "Shipping and provenance",', '"question": "Shipping",')
R(CT, '"answer": "<p>Available pieces leave the atelier within two business days. Made-to-order work includes a dispatch estimate.</p>",',
  '"answer": "<p>Dispatch and delivery times depend on the item and your destination. Contact us before ordering if you need a piece by a specific date.</p>",')
R(CT, '"question": "Care and longevity",', '"question": "Care",')
R(CT, '"answer": "<p>Care instructions accompany each edition. Contact the atelier for repair and material-specific guidance.</p>",',
  '"answer": "<p>Care depends on the material and finish of each piece. If you are unsure how to care for it, contact us before cleaning it.</p>",')
for k in ("faq_returns", "faq_bespoke", "service_appointments", "service_orders", "service_trade"):
    remove_block(CT, "main", k)
R(CT, '"eyebrow": "Contact / Private client services",', '"eyebrow": "Contact",')
R(CT, '"intro": "<p>Write to the studio about an order, a material or a private appointment.</p>",',
  '"intro": "<p>Write to us about an order or a product.</p>",')
R(CT, '"studio_hours": "Monday to Friday / 10:00–18:00 CET",', '"studio_hours": "",')
R(CT, '"showroom_address": "By appointment / Milan"', '"showroom_address": ""')

AB = "templates/page.about.json"
R(AB, '"attribution": "Head of atelier",', '"attribution": "",')
R(AB, '"role": "Cutting and finishing"', '"role": ""')
remove_block(AB, "main", "values")
R(AB, '"caption": "Cutting, fitting and finishing, photographed over one season."', '"caption": ""')

# ------------------------------------------------------ E5 listings Sartorial
SX = "listings/sartorial/templates/index.json"
R(SX, '"subheading": "<p>Sculptural bespoke architecture, hand-finished canvassing, and pure silk faille cut in limited editions.</p>",',
  '"subheading": "<p>Sculptural tailoring cut in considered proportions.</p>",')
R(SX, '"button_secondary_label": "Explore runway lookbook",', '"button_secondary_label": "Explore tailoring",')
R(SX, '"text": "PURE MULBERRY SILK & BIELLESE WOOL"', '"text": "PROPORTION / CUT / DRAPE"')
R(SX, '"text": "FULL FLOATING HORSEHAIR CANVAS"', '"text": "TAILORING"')
R(SX, '"text": "HAND-ROLLED LAPELS & PICK-STITCHING"', '"text": "SILHOUETTE STUDIES"')
R(SX, '"eyebrow": "RUNWAY PRESENTATION / SALON 01",', '"eyebrow": "PRESENTATION / SALON 01",')
R(SX, '"description": "<p>Observe the architectural drape, proportion and movement from the runway presentation.</p>",',
  '"description": "<p>Observe the architectural drape, proportion and movement of each silhouette.</p>",')
R(SX, '"delivery_text": "Bespoke courier & private salon fitting | Dispatched within 2 business days",', '"delivery_text": "",')
R(SX, '"description": "<p>Select the full tailored composition: the double-breasted jacket, the silk blouse, and the pleated trouser.</p>",',
  '"description": "<p>Select the full tailored composition: the double-breasted jacket, the blouse, and the pleated trouser.</p>",')
R(SX, '"caption": "Bespoke tailoring composition photographed in salon light.",',
  '"caption": "Tailoring composition photographed in salon light.",')
for k in ("material", "craft", "origin", "production"):
    remove_block(SX, "manifesto", k)
R(SX, '"body": "<p>Every lapel is rolled by hand, every horsehair canvas floating freely. We reject industrial shortcuts in pursuit of permanent elegance.</p>",',
  '"body": "",')
R(SX, '"text": "<p>Private salon invitations, fabric allocation releases, and bespoke commission openings.</p>"', '"text": ""')
R("listings/sartorial/templates/collection.json",
  '"text": "<p>Follow a material study from raw Biellese fleece to finished bespoke silhouette.</p>",',
  '"text": "<p>Follow a material study from cloth to finished silhouette.</p>",')

# -------------------------------------------------------- E6 listings Imprint
IM = "listings/imprint/templates/index.json"
R(IM, '"subheading": "<p>Modular gear, aerospace hardware, and weatherproof membrane systems calibrated for daily EDC telemetry.</p>",',
  '"subheading": "<p>Modular gear and desk objects for daily carry.</p>",')
R(IM, '"button_secondary_label": "View technical specs",', '"button_secondary_label": "Explore desk and study",')
R(IM, '"text": "500D TECHNICAL BALLISTIC NYLON"', '"text": "TECHNICAL STUDIO"')
R(IM, '"text": "WEATHERPROOF TECHNICAL CLOSURES"', '"text": "DAILY OBJECTS"')
R(IM, '"text": "PRECISION ANODIZED HARDWARE / GRADE 5 TITANIUM"', '"text": "DESK AND STUDY"')
remove_block(IM, "marquee", "molle")
R(IM, '"heading": "Aerospace grade EDC systems",', '"heading": "EDC systems",')
R(IM, '"heading": "Calibrated for extreme endurance",', '"heading": "Leather goods",')
# F-1 (R-D C-08): CTA del mismo bloque, coherente con su destino /collections/leather-goods.
R(IM, '"link_label": "Inspect blueprint",', '"link_label": "Explore leather goods",')
R(IM, '"body": "<p>Stress-tested technical textiles, weatherproof technical closures, and laser-machined anodized hardware.</p>"',
  '"body": ""')
R(IM, '"tab_label": "Limited studies"', '"tab_label": ""')
R(IM, '"delivery_text": "Worldwide express courier | Dispatch in 2 business days",', '"delivery_text": "",')
for k in ("spec1", "spec2", "spec3", "spec4"):
    remove_block(IM, "manifesto", k)
R(IM, '"body": "<p>No decorative ornamentation. Every seam, bar-tack, and closure is engineered for enduring daily performance.</p>",',
  '"body": "",')
R(IM, '"text": "<p>Specification releases, telemetry logs, and component testing documentation.</p>"', '"text": ""')

# F-2 (R-D C-08): CTA de la tarjeta de coleccion, coherente con /collections/daily-objects.
R("listings/imprint/templates/collection.json",
  '"link_label": "View specifications",', '"link_label": "Explore daily objects",')

# -------------------------------------------------------- E7 listings Archive
AX = "listings/archive/templates/index.json"
R(AX, '"subheading": "<p>Archival garments shaped by runway provenance, documented conservation, and historical time.</p>",',
  '"subheading": "<p>A catalogue of garments and objects.</p>",')
R(AX, '"button_secondary_label": "Restored selection",', '"button_secondary_label": "View the selection",')
for k in ("grade1", "grade2", "grade3", "grade4"):
    remove_block(AX, "manifesto", k)
R(AX, '"body": "<p>Every archive specimen is documented according to transparent curatorial standards, preserving its historical integrity and provenance.</p>",',
  '"body": "",')
R(AX, '"button_label": "Read curatorial notes",', '"button_label": "View the archive",')
R(AX, '"text": "CIRCA 1989–1999 THE PERMANENT ARCHIVE"', '"text": "THE PERMANENT ARCHIVE"')
R(AX, '"text": "CURATED ARCHIVAL GARMENTS & CONSERVATION"', '"text": "CURATED GARMENTS & OBJECTS"')
R(AX, '"text": "CURATED PERIOD SELECTIONS & ACCESSIONS"', '"text": "CURATED SELECTIONS & ACCESSIONS"')
remove_block(AX, "marquee", "provenance")
R(AX, '"tab_label": "1980s Deconstruction"', '"tab_label": ""')
# F-4 (R-D C-08): la pestana no cae al titulo de catalogo «Restored Pieces».
R(AX, '"tab_label": "1990s Minimalist Vault"', '"tab_label": "Selected pieces"')
remove_block(AX, "collections", "decade00")
R(AX, '"eyebrow": "INDEX III / THE VAULT BY DECADES",', '"eyebrow": "INDEX III / THE VAULT",')
R(AX, '"heading": "Historical Archive Entries",', '"heading": "Archive Entries",')
R(AX, '"description": "<p>Each piece is carefully inspected and presented as part of our curated period selections.</p>",',
  '"description": "<p>Explore each piece through the points placed across the composition.</p>",')
R(AX, '"delivery_text": "Climate-controlled archival transport | Insured courier",', '"delivery_text": "",')
R(AX, '"text": "<p>Occasional notices of restored objects, new records and workshop visits.</p>"', '"text": ""')
AC = "listings/archive/templates/collection.json"
R(AC, '"eyebrow": "CURATED PERIOD SELECTIONS / ARCHIVE",', '"eyebrow": "CURATED SELECTIONS / ARCHIVE",')
R(AC, '"text": "<p>Every catalogued lot represents a curated period selection with documented condition and provenance notes.</p>",',
  '"text": "<p>Browse the catalogue.</p>",')
R(AC, '"link_label": "Read curatorial notes",', '"link_label": "View the archive",')

# ------------------------------------------------- verificacion y escritura
for rel, txt in BUF.items():
    if rel.endswith(".json"):
        body = re.sub(r"^\s*/\*.*?\*/", "", txt, flags=re.S)
        try:
            json.loads(body)
        except Exception as e:  # noqa: BLE001
            fail(f"{rel}: JSON invalido tras editar: {e}")
for rel, txt in BUF.items():
    (ROOT / rel).write_text(txt, encoding="utf-8", newline="\n")
print(f"C08_APPLY_OK archivos={len(BUF)}")
for rel in sorted(BUF):
    print("  " + rel)
```

## Anexo B. `c08b_apply.py` (C-08b, Nivel 2: no ejecutar sin la autorización escrita de Johandry)

<!-- ANEXO c08b_apply.py -->
```python
#!/usr/bin/env python3
"""C-08b: fallbacks Liquid, defaults de schema y claves asociadas (Nivel 2: N2-1, N2-2, N2-3). Requiere autorizacion escrita de Johandry y C-08a aplicada.

Uso:  python3 -I c08b_apply.py <raiz-del-repo>
Cada sustitucion literal exige exactamente 1 coincidencia (RULES 3.2).
Las retiradas de bloques JSON se verifican despues parseando el JSON.
Sale con codigo 1 ante cualquier discrepancia SIN haber escrito nada.
Directiva: agent-comms/outbox-claude/CLAUDE-DIRECTIVA-C-08-001.md (v2).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]).resolve()
BUF = {}


def load(rel):
    if rel not in BUF:
        BUF[rel] = (ROOT / rel).read_text(encoding="utf-8")
    return BUF[rel]


def fail(msg):
    print("C08_APPLY_FAIL: " + msg)
    sys.exit(1)


def R(rel, old, new):
    t = load(rel)
    c = t.count(old)
    if c != 1:
        fail(f"{rel}: se esperaba 1 coincidencia y hay {c}: {old[:70]!r}")
    BUF[rel] = t.replace(old, new, 1)


def _match_brace(t, i):
    """i apunta a '{' o '['; devuelve el indice del cierre correspondiente."""
    pairs = {"{": "}", "[": "]"}
    stack = [t[i]]
    j = i + 1
    in_str = False
    while j < len(t):
        ch = t[j]
        if in_str:
            if ch == "\\":
                j += 2
                continue
            if ch == '"':
                in_str = False
        elif ch == '"':
            in_str = True
        elif ch in "{[":
            stack.append(ch)
        elif ch in "}]":
            if pairs[stack[-1]] != ch:
                fail("llaves desbalanceadas")
            stack.pop()
            if not stack:
                return j
        j += 1
    fail("cierre no encontrado")


def _section_span(t, section_key):
    m = [x.start() for x in re.finditer(r'\n    "' + re.escape(section_key) + r'": \{', t)]
    if len(m) != 1:
        fail(f"seccion {section_key!r}: {len(m)} coincidencias")
    start = t.index("{", m[0] + 1)
    return start, _match_brace(t, start)


def remove_block(rel, section_key, block_key):
    t = load(rel)
    s0, s1 = _section_span(t, section_key)
    sec = t[s0:s1 + 1]
    pat = '"' + block_key + '": {'
    if sec.count(pat) != 1:
        fail(f"{rel}: bloque {block_key!r} en {section_key!r}: {sec.count(pat)} coincidencias")
    b0 = sec.index(pat)
    b1 = _match_brace(sec, b0 + len(pat) - 1)
    line0 = sec.rfind("\n", 0, b0)
    after = sec[b1 + 1:]
    if after.startswith(","):
        sec = sec[:line0] + sec[b1 + 2:]
    else:
        k = line0
        while k > 0 and sec[k - 1] in " \n":
            k -= 1
        prev = sec[k - 1]
        if prev == ",":
            sec = sec[:k - 1] + sec[b1 + 1:]
        elif prev == "{":
            sec = sec[:line0] + sec[b1 + 1:]
        else:
            fail(f"{rel}: forma inesperada antes de {block_key!r}")
    # block_order
    m = re.search(r'"block_order": \[', sec)
    if not m:
        fail(f"{rel}: sin block_order en {section_key!r}")
    a0 = m.end() - 1
    a1 = _match_brace(sec, a0)
    arr = sec[a0:a1 + 1]
    items = json.loads(arr)
    if items.count(block_key) != 1:
        fail(f"{rel}: {block_key!r} no esta una vez en block_order")
    items.remove(block_key)
    if not items:
        new_arr = "[]"
    elif "\n" in arr:
        ind = re.search(r'\n(\s*)"', arr).group(1)
        close_ind = re.search(r'\n(\s*)\]$', arr).group(1)
        new_arr = "[\n" + ",\n".join(ind + json.dumps(x) for x in items) + "\n" + close_ind + "]"
    else:
        new_arr = "[" + ", ".join(json.dumps(x) for x in items) + "]"
    sec = sec[:a0] + new_arr + sec[a1 + 1:]
    sec = re.sub(r'"blocks": \{\s*\}', '"blocks": {}', sec)
    BUF[rel] = t[:s0] + sec + t[s1 + 1:]


# ------------------------------------------------- E1b Liquid (N2-1, N2-3)
# N2-1 y HX-1: las dos ramas when se fusionan en una sola, sin fallback y con ocultacion
# del bloque vacio. Complejidad Liquid neta 0 en main-product (when 2->1, +1 if, iconos
# if/elsif 2+2 -> 1+3) y -1 en featured-product. Marcado de salida identico al anterior.
OLD_MP = """            {%- when 'shipping_lead_time' -%}
              {%- liquid
                assign delivery_fallback = 'sections.main_product.blocks.shipping_lead_time.delivery_fallback' | t
                assign delivery_text = block.settings.delivery_text | default: delivery_fallback
              -%}
              <p class="product-trust" {{ block.shopify_attributes }}>
                <span class="product-trust__icon" aria-hidden="true">
                  {%- if block.settings.icon == 'clock' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                  {%- elsif block.settings.icon == 'truck' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h12v11H2zM14 9h4l4 4v4h-8z"/><circle cx="6.5" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>
                  {%- endif -%}
                </span>
                <span>{{ delivery_text | escape }}</span>
              </p>

            {%- when 'trust_badges' -%}
              {%- liquid
                assign returns_fallback = 'sections.main_product.blocks.trust_badges.returns_fallback' | t
                assign returns_text = block.settings.returns_text | default: returns_fallback
              -%}
              <p class="product-trust" {{ block.shopify_attributes }}>
                <span class="product-trust__icon" aria-hidden="true">
                  {%- if block.settings.icon == 'ruler' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m15 2 7 7L9 22l-7-7L15 2Z"/><path d="m11 6 2 2m-5 1 2 2m-5 1 2 2m4-9 2 2"/></svg>
                  {%- elsif block.settings.icon == 'shield' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
                  {%- endif -%}
                </span>
                <span>{{ returns_text | escape }}</span>
              </p>

"""
NEW_MP = """            {%- when 'shipping_lead_time', 'trust_badges' -%}
              {%- assign trust_text = block.settings.delivery_text | default: block.settings.returns_text | strip -%}
              {%- if trust_text != blank -%}
              <p class="product-trust" {{ block.shopify_attributes }}>
                <span class="product-trust__icon" aria-hidden="true">
                  {%- if block.settings.icon == 'clock' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                  {%- elsif block.settings.icon == 'truck' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h12v11H2zM14 9h4l4 4v4h-8z"/><circle cx="6.5" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>
                  {%- elsif block.settings.icon == 'ruler' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m15 2 7 7L9 22l-7-7L15 2Z"/><path d="m11 6 2 2m-5 1 2 2m-5 1 2 2m4-9 2 2"/></svg>
                  {%- elsif block.settings.icon == 'shield' -%}
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
                  {%- endif -%}
                </span>
                <span>{{ trust_text | escape }}</span>
              </p>
              {%- endif -%}

"""
OLD_FP = """            {%- when 'shipping_lead_time' -%}
              {%- if featured_product != blank -%}
                {%- liquid
                  assign delivery_fallback = 'sections.main_product.blocks.shipping_lead_time.delivery_fallback' | t
                  assign delivery_text = block.settings.delivery_text | default: delivery_fallback
                -%}
                <p class="product-trust" {{ block.shopify_attributes }}>
                  <span class="product-trust__icon" aria-hidden="true">
                    {%- if block.settings.icon == 'clock' -%}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                    {%- elsif block.settings.icon == 'truck' -%}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h12v11H2zM14 9h4l4 4v4h-8z"/><circle cx="6.5" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>
                    {%- endif -%}
                  </span>
                  <span>{{ delivery_text | escape }}</span>
                </p>
              {%- endif -%}

            {%- when 'trust_badges' -%}
              {%- if featured_product != blank -%}
                {%- liquid
                  assign returns_fallback = 'sections.main_product.blocks.trust_badges.returns_fallback' | t
                  assign returns_text = block.settings.returns_text | default: returns_fallback
                -%}
                <p class="product-trust" {{ block.shopify_attributes }}>
                  <span class="product-trust__icon" aria-hidden="true">
                    {%- if block.settings.icon == 'ruler' -%}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m15 2 7 7L9 22l-7-7L15 2Z"/><path d="m11 6 2 2m-5 1 2 2m-5 1 2 2m4-9 2 2"/></svg>
                    {%- elsif block.settings.icon == 'shield' -%}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
                    {%- endif -%}
                  </span>
                  <span>{{ returns_text | escape }}</span>
                </p>
              {%- endif -%}

"""
NEW_FP = """            {%- when 'shipping_lead_time', 'trust_badges' -%}
              {%- assign trust_text = block.settings.delivery_text | default: block.settings.returns_text | strip -%}
              {%- if featured_product != blank and trust_text != blank -%}
                <p class="product-trust" {{ block.shopify_attributes }}>
                  <span class="product-trust__icon" aria-hidden="true">
                    {%- if block.settings.icon == 'clock' -%}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                    {%- elsif block.settings.icon == 'truck' -%}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h12v11H2zM14 9h4l4 4v4h-8z"/><circle cx="6.5" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>
                    {%- elsif block.settings.icon == 'ruler' -%}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m15 2 7 7L9 22l-7-7L15 2Z"/><path d="m11 6 2 2m-5 1 2 2m-5 1 2 2m4-9 2 2"/></svg>
                    {%- elsif block.settings.icon == 'shield' -%}
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
                    {%- endif -%}
                  </span>
                  <span>{{ trust_text | escape }}</span>
                </p>
              {%- endif -%}

"""
R("sections/main-product.liquid", OLD_MP, NEW_MP)
R("sections/featured-product.liquid", OLD_FP, NEW_FP)

MC = "sections/main-contact.liquid"
R(MC, """              <option value="{{ 'contact.form.reason_appointment' | t | escape }}">{{ 'contact.form.reason_appointment' | t }}</option>
""", "")

# ------------------------------------------------- E2b defaults de schema (N2-2)
R("sections/announcement-bar.liquid",
  '"default": "Complimentary shipping on orders over $150"',
  '"default": "Explore the collection"')
BM = "sections/brand-manifesto.liquid"
R(BM, '"default": "<p>Every seam, edge and finish records a decision made by an artisan, not an anonymous process.</p>"',
  '"default": "<p>Describe the ideas behind your work.</p>"')
R(BM, '"default": "Read our process"', '"default": "Explore the collection"')
R(BM, '"default": "Traceable natural fibres"', '"default": "Add a short detail"')
# F-3 (R-D C-08): fecha de temporada en un default.
R("sections/hero-editorial.liquid", '"default": "Autumn / Winter 26"', '"default": "Form in quiet movement"')
R("sections/hero-editorial.liquid",
  '"default": "<p>A study in quiet movement. Sculptural layers and tactile materials, made in small series.</p>"',
  '"default": "<p>A study in quiet movement. Sculptural layers and tactile materials.</p>"')
MA = "sections/main-about.liquid"
R(MA, '"default": "Traceable fibres"', '"default": "Materials"')
R(MA, '"default": "<p>Every cloth is bought from a mill we can name.</p>"',
  '"default": "<p>Describe the materials you work with.</p>"')
R(MA, '"default": "Hand finished"', '"default": "Process"')
R(MA, '"default": "<p>Edges, linings and buttonholes are worked by hand.</p>"',
  '"default": "<p>Describe how your pieces are made.</p>"')
R(MA, '"default": "Small series"', '"default": "Collection"')
R(MA, '"default": "<p>Pieces are cut in short runs and rarely repeated.</p>"',
  '"default": "<p>Describe how your collection is put together.</p>"')
R(MC, '"default": "Contact / Private client services"', '"default": "Contact"')
R(MC, '"default": "<p>Write to the studio about an order, a material or a private appointment.</p>"',
  '"default": "<p>Write to us about an order or a product.</p>"')
R(MC, '''      "label": "t:sections.main_contact.settings.studio_hours.label",
      "default": "Monday to Friday / 10:00–18:00 CET"
''', '''      "label": "t:sections.main_contact.settings.studio_hours.label"
''')
R(MC, '''      "label": "t:sections.main_contact.settings.showroom_address.label",
      "default": "By appointment / Milan"
''', '''      "label": "t:sections.main_contact.settings.showroom_address.label"
''')
R(MC, '"default": "Shipping and provenance"', '"default": "When will my order arrive?"')
R(MC, '"default": "<p>Available pieces leave the atelier within three business days.</p>"',
  '"default": "<p>Add the answer your customers need here.</p>"')
R(MC, '"default": "Order concierge"', '"default": "Order questions"')
MF = "sections/main-faq.liquid"
R(MF, '"default": "<p>Write to the atelier and a person will answer you.</p>"',
  '"default": "<p>Send us a message through our contact page.</p>"')
R(MF, '"default": "Contact the atelier"', '"default": "Contact us"')
MPW = "sections/main-password.liquid"
R(MPW, '"default": "<p>Join the private list for first access, studio notes and a preview of the making process.</p>"',
  '"default": "<p>Leave your email address to join our mailing list.</p>"')
R(MPW, '''      "info": "t:sections.main_password.settings.opening_note.info",
      "default": "Wool, fired earth and softened leather."
''', '''      "info": "t:sections.main_password.settings.opening_note.info"
''')
R("sections/newsletter.liquid", '''      "label": "t:sections.newsletter.settings.text.label",
      "default": "<p>New objects, material studies and private previews, sent with restraint.</p>"
''', '''      "label": "t:sections.newsletter.settings.text.label"
''')

# ------------------------------------------------ E3b locales (N2-1, N2-3)
R("locales/en.default.json", '      "reason_appointment": "Private appointment",\n', "")
R("locales/es.json", '      "reason_appointment": "Cita privada",\n', "")
R("locales/en.default.json", '''          "unavailable": "This option is unavailable"
        },
        "shipping_lead_time": {
          "delivery_fallback": "Delivery times and costs confirmed at checkout"
        },
        "trust_badges": {
          "returns_fallback": "Returns subject to our store policy"
        }
      }''', '''          "unavailable": "This option is unavailable"
        }
      }''')
# es.json: el bloque de fallbacks se localiza por sus propias cadenas.
t = load("locales/es.json")
m = re.search(r'\n(\s*)\},\n\s*"shipping_lead_time": \{\n\s*"delivery_fallback": "Plazos y costes de entrega confirmados al pagar"\n\s*\},\n\s*"trust_badges": \{\n\s*"returns_fallback": "Devoluciones sujetas a la política de la tienda"\n\s*\}\n', t)
if not m or len(re.findall(r'"delivery_fallback"', t)) != 1:
    fail("es.json: bloque de fallbacks no encontrado una vez")
BUF["locales/es.json"] = t[:m.start()] + "\n" + m.group(1) + "}\n" + t[m.end():]

SCH = "locales/en.default.schema.json"
R(SCH, '"info": "Match your shipping rates and delivery estimates. Leave blank for a neutral checkout message."',
  '"info": "Match your shipping rates and delivery estimates. Leave blank to hide this block."')
R(SCH, '"info": "Match your published returns policy. Leave blank for a neutral policy message."',
  '"info": "Match your published returns policy. Leave blank to hide this block."')

# ------------------------------------------------- verificacion y escritura
for rel, txt in BUF.items():
    if rel.endswith(".json"):
        body = re.sub(r"^\s*/\*.*?\*/", "", txt, flags=re.S)
        try:
            json.loads(body)
        except Exception as e:  # noqa: BLE001
            fail(f"{rel}: JSON invalido tras editar: {e}")
for rel, txt in BUF.items():
    (ROOT / rel).write_text(txt, encoding="utf-8", newline="\n")
print(f"C08_APPLY_OK archivos={len(BUF)}")
for rel in sorted(BUF):
    print("  " + rel)
```

## Anexo C. `c08_verify.py` (verificación por fase: `a` o `b`)

<!-- ANEXO c08_verify.py -->
```python
#!/usr/bin/env python3
"""C-08: verificacion semantica de solo lectura.

Uso: python3 -I c08_verify.py <raiz> a   -> estado esperado tras C-08a (Nivel 1)
     python3 -I c08_verify.py <raiz> b   -> estado esperado tras C-08a + C-08b
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]).resolve()
PHASE = sys.argv[2] if len(sys.argv) > 2 else ""
if PHASE not in ("a", "b"):
    print("uso: c08_verify.py <raiz> a|b")
    sys.exit(2)
errs = []


def j(rel):
    t = (ROOT / rel).read_text(encoding="utf-8")
    return json.loads(re.sub(r"^\s*/\*.*?\*/", "", t, flags=re.S))


# 1. block_order y blocks coherentes en todas las plantillas JSON del paquete
files = sorted(list((ROOT / "templates").glob("*.json")) + list((ROOT / "listings").glob("*/templates/*.json"))
               + list((ROOT / "sections").glob("*.json")))
for p in files:
    rel = str(p.relative_to(ROOT))
    for sk, sec in j(rel).get("sections", {}).items():
        blocks = sec.get("blocks", {})
        order = sec.get("block_order", [])
        if sorted(blocks) != sorted(order) or len(order) != len(set(order)):
            errs.append(f"{rel}:{sk}: blocks {sorted(blocks)} != block_order {order}")

# 2. bloques retirados ausentes
GONE = {
    "templates/index.json": {"marquee": ["marquee_series", "marquee_origin"],
                             "brand_manifesto": ["detail_material", "detail_origin", "detail_finish", "detail_series"]},
    "templates/page.faq.json": {"main": ["q_tracking", "q_alterations", "q_repairs", "cat_returns", "q_returns"]},
    "templates/page.contact.json": {"main": ["faq_returns", "faq_bespoke", "service_appointments", "service_orders", "service_trade"]},
    "templates/page.about.json": {"main": ["values"]},
    "templates/product.json": {"main": ["shipping_returns"]},
    "listings/sartorial/templates/product.json": {"main": ["shipping_returns"]},
    "listings/imprint/templates/product.json": {"main": ["shipping_returns"]},
    "listings/archive/templates/product.json": {"main": ["shipping_returns"]},
    "listings/sartorial/templates/index.json": {"manifesto": ["material", "craft", "origin", "production"]},
    "listings/imprint/templates/index.json": {"marquee": ["molle"], "manifesto": ["spec1", "spec2", "spec3", "spec4"]},
    "listings/archive/templates/index.json": {"manifesto": ["grade1", "grade2", "grade3", "grade4"],
                                              "marquee": ["provenance"], "collections": ["decade00"]},
}
for rel, secs in GONE.items():
    d = j(rel)
    for sk, keys in secs.items():
        for k in keys:
            if k in d["sections"][sk].get("blocks", {}):
                errs.append(f"{rel}:{sk}: bloque {k} sigue presente")

# 3. campos que deben quedar vacios (el bloque o la fila se oculta o cae al locale neutro)
EMPTY = [
    ("listings/sartorial/templates/product.json", "main", "shipping_lead_time", "delivery_text"),
    ("listings/sartorial/templates/product.json", "main", "trust_badges", "returns_text"),
    ("listings/imprint/templates/product.json", "main", "shipping_lead_time", "delivery_text"),
    ("listings/imprint/templates/product.json", "main", "trust_badges", "returns_text"),
    ("templates/product.json", "main", "shipping_lead_time", "delivery_text"),
    ("templates/product.json", "main", "trust_badges", "returns_text"),
    ("listings/archive/templates/product.json", "main", "shipping_lead_time", "delivery_text"),
    ("listings/archive/templates/product.json", "main", "trust_badges", "returns_text"),
    ("listings/sartorial/templates/index.json", "featured_product", "shipping", "delivery_text"),
    ("listings/imprint/templates/index.json", "featured_product", "shipping", "delivery_text"),
    ("listings/archive/templates/index.json", "featured_product", "shipping", "delivery_text"),
]
for rel, sk, bk, key in EMPTY:
    v = j(rel)["sections"][sk]["blocks"][bk]["settings"].get(key)
    if v != "":
        errs.append(f"{rel}:{sk}.{bk}.{key} = {v!r} (se esperaba '')")
for rel in ("templates/index.json", "listings/sartorial/templates/index.json",
            "listings/imprint/templates/index.json", "listings/archive/templates/index.json"):
    v = j(rel)["sections"]["newsletter"]["settings"].get("text")
    if v != "":
        errs.append(f"{rel}:newsletter.text = {v!r} (se esperaba '')")

# 4. claves de locale retiradas y paridad en/es
def flat(o, p=""):
    out = []
    for k, v in o.items():
        out += flat(v, p + k + ".") if isinstance(v, dict) else [p + k]
    return out
en = set(flat(j("locales/en.default.json")))
es = set(flat(j("locales/es.json")))
B_KEYS = ("sections.main_product.blocks.shipping_lead_time.delivery_fallback",
          "sections.main_product.blocks.trust_badges.returns_fallback",
          "contact.form.reason_appointment")
if "contact.services.response" in en or "contact.services.response" in es:
    errs.append("locale: clave contact.services.response sigue presente")
for k in B_KEYS:
    present = k in en and k in es
    if PHASE == "a" and not present:
        errs.append(f"locale: {k} deberia seguir presente hasta C-08b (estado intermedio)")
    if PHASE == "b" and (k in en or k in es):
        errs.append(f"locale: clave {k} sigue presente")
if en != es:
    errs.append(f"locale: paridad en/es rota: en-es={sorted(en - es)} es-en={sorted(es - en)}")

# 5. Liquid
WHEN = "{%- when 'shipping_lead_time', 'trust_badges' -%}"
for rel in ("sections/main-product.liquid", "sections/featured-product.liquid"):
    t = (ROOT / rel).read_text(encoding="utf-8")
    if PHASE == "a":
        for s in ("delivery_fallback", "returns_fallback"):
            if t.count(s) != 3:
                errs.append(f"{rel}: '{s}' aparece {t.count(s)} veces (estado intermedio: 3)")
    else:
        for s in ("delivery_fallback", "returns_fallback", "{%- when 'trust_badges' -%}"):
            if s in t:
                errs.append(f"{rel}: contiene {s}")
        for s in (WHEN, "trust_text != blank", "{{ trust_text | escape }}"):
            if t.count(s) != 1:
                errs.append(f"{rel}: '{s}' aparece {t.count(s)} veces (se esperaba 1)")
mc = (ROOT / "sections/main-contact.liquid").read_text(encoding="utf-8")
if "contact.services.response" in mc:
    errs.append("sections/main-contact.liquid: contiene contact.services.response")
for s in ("contact.form.reason_appointment", '"Monday to Friday', '"By appointment'):
    if PHASE == "b" and s in mc:
        errs.append(f"sections/main-contact.liquid: contiene {s}")
    if PHASE == "a" and s not in mc:
        errs.append(f"sections/main-contact.liquid: falta {s} (estado intermedio hasta C-08b)")

# 6. hallazgos F-1 a F-5 de la R-D y defaults (fase b)
im = j("listings/imprint/templates/index.json")["sections"]["discovery"]["blocks"]["story"]["settings"]["link_label"]
if im != "Explore leather goods":
    errs.append(f"F-1: link_label = {im!r}")
ic = (ROOT / "listings/imprint/templates/collection.json").read_text(encoding="utf-8")
if '"link_label": "Explore daily objects"' not in ic:
    errs.append("F-2: link_label de listings/imprint/templates/collection.json")
tabs = j("listings/archive/templates/index.json")["sections"]["collections"]["blocks"]
if tabs["decade80"]["settings"].get("tab_label") != "" or tabs["decade90"]["settings"].get("tab_label") != "Selected pieces":
    errs.append("AR-08/F-4: tab_label de decade80/decade90")
if j("locales/en.default.json")["faq"]["search"]["placeholder"] != "Shipping, sizing, care":
    errs.append("F-5: faq.search.placeholder (en)")
if j("locales/es.json")["faq"]["search"]["placeholder"] != "Envíos, tallas, cuidados":
    errs.append("F-5: faq.search.placeholder (es)")
DEFAULTS_B = {
    "sections/hero-editorial.liquid": ['"Autumn / Winter 26"', "made in small series"],
    "sections/announcement-bar.liquid": ["Complimentary shipping"],
    "sections/brand-manifesto.liquid": ["by an artisan", "Read our process", "Traceable natural fibres"],
    "sections/main-about.liquid": ["a mill we can name", "worked by hand", "short runs"],
    "sections/main-faq.liquid": ["a person will answer", "Contact the atelier"],
    "sections/main-password.liquid": ["first access", "fired earth"],
    "sections/newsletter.liquid": ["private previews"],
}
for rel, needles in DEFAULTS_B.items():
    t = (ROOT / rel).read_text(encoding="utf-8")
    for s in needles:
        if PHASE == "b" and s in t:
            errs.append(f"{rel}: default contiene {s!r}")
        if PHASE == "a" and s not in t:
            errs.append(f"{rel}: falta {s!r} (estado intermedio hasta C-08b)")

if errs:
    print("C08_VERIFY_FAIL")
    for e in errs:
        print("  " + e)
    sys.exit(1)
print(f"C08_VERIFY_OK fase={PHASE} plantillas_revisadas={len(files)}")
```

## Anexo D. `c08_grep.sh` (barrido de promesas)

<!-- ANEXO c08_grep.sh -->
```bash
#!/usr/bin/env bash
# Uso: bash c08_grep.sh <raiz>   (lectura; no escribe). Tabular con el awk de la directiva v2 §5.3.
cd "$1" || exit 2
export LC_ALL=C.UTF-8
PAT='complimentary|free shipping|env[ií]o gratuito|business (day|hour)|d[ií]as h[aá]biles|within (two|three|thirty|2|3|30)\b|thirty days|30 days|tracking|white-glove|courier|insured|climate-controlled|worldwide|express courier|dispatched within|dispatch in [0-9]|hand-(finished|rolled|stitched)|(finished|worked|rolled) by hand|artisan,|by an artisan|traceab|small (series|runs)|numbered|limited (series|editions?|studies)|bespoke (courier|commission|executions|tailoring composition|architecture|silhouette)|runway|conservat|restored (objects|selection)|circa [0-9]|grade (i|ii|iii|iv)\b|grade 5|titanium|6061|500d|dwr|waterproof|weatherproof|weather-resistant|stress-tested|tolerance|aerospace|mulberry|biell|milan|tasmanian|super 160|horsehair|antwerp|appointment|concierge|showroom|repair|alteration|early access|acceso anticipado|first access|private preview|avances privados|ready to ship|listo para enviar|response standard|plazo de respuesta|as soon as possible|lo antes posible|first note|primera nota|10:00|final sale|a mill we can name|close to the source|head of atelier|silk blouse|silk faille|natural fibres prefer|care label sewn|accompany each edition|travel with each piece|[0-9]{4}s (deconstruction|minimalist|master)|by decades|historical (archive|runway|time)|curatorial (notes|standards)|period selection|carefully inspected|workshop visits|testing documentation|salon invitations|technical specs|read our process|private client services|cita privada|extreme endurance|photographed over one season|short runs|fired earth|private notes only|notas privadas|made from natural materials|instructions supplied|costs confirmed at checkout|subject to our store policy|confirmados al pagar|sujetas a la pol|molle|0\.2 ?mm|bar-tack|documented condition|monday (to|through) friday|personal assistance|studio inquiries|longevity|carries the measurements|alter garments|sleeve and hem|a person will answer|contact the atelier|hand finished|inspect blueprint|view specifications|winter [0-9]{2}'
grep -rnoiE "$PAT" templates listings sections snippets layout config/settings_data.json locales \
  --exclude=page.support.json --exclude=page.documentation.json \
  --exclude=main-support.liquid --exclude=main-documentation.liquid
```

## Anexo E. `c08_complexity.sh` (complejidad Liquid, HX-1)

<!-- ANEXO c08_complexity.sh -->
```bash
#!/usr/bin/env bash
# C-08: mide la complejidad Liquid (regla LiquidComplexity de Theme Check) de
# sections/main-product.liquid y sections/featured-product.liquid.
# Uso, desde la raiz del repo: TMPDIR="$SCRATCH" bash c08_complexity.sh <raiz>
# Copia el tema a un directorio temporal con maxComplexity: 1 para que Theme Check
# informe el valor exacto; no escribe en <raiz>. El umbral real del tema es 120.
set -e
src="$1"; tmp="$(mktemp -d)"
cp -r "$src/sections" "$src/snippets" "$src/layout" "$src/locales" "$src/config" "$src/assets" "$src/templates" "$tmp/"
printf 'extends: theme-check:recommended\nLiquidComplexity:\n  enabled: true\n  maxComplexity: 1\n' > "$tmp/.theme-check.yml"
NPX_BIN="${SHOPIFY_BIN:-npx shopify}"
$NPX_BIN theme check --path "$tmp" -o json 2>/dev/null | node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);for(const f of j){if(!/sections\/(main-product|featured-product)\.liquid$/.test(f.path))continue;for(const o of f.offenses){if(o.check==="LiquidComplexity"){const m=o.message.match(/complexity is (\d+)/);console.log(f.path.replace(/.*sections\//,"sections/")+" "+m[1])}}}})'
rm -rf "$tmp"
```
