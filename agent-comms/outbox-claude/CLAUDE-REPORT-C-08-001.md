ID: CLAUDE-REPORT-C-08-001
Estado: código completo (estático). Pruebas de R-A y R-C pendientes de credenciales (D22); sin tienda. C-08a (Nivel 1) y C-08b (Nivel 2) aplicadas en el árbol de trabajo de `lote-a`, SIN commit (instrucción de la tarea: sin git add/commit). Nivel 2 de C-08b autorizado por Johandry el 2026-11-04 («Autorizar los tres (Recomendado)»), a registrar como D26 en el commit.
Decisión requerida: del coordinador, commit(s) de C-08a y C-08b (ver desviación D-1) y registro de D26.
Resumen en 5 líneas:
1. Ambas fases aplicadas con los scripts de la directiva v2; los cinco SHA-256 coinciden.
2. C-08a: `C08_APPLY_OK archivos=18`, verificación `a` OK, barrido 71 (idéntico a la tabla de §5.3). C-08b: `C08_APPLY_OK archivos=13`, verificación `b` OK, barrido 35 (idéntico).
3. Theme Check 0 ofensas tras cada fase (93 archivos inspeccionados, ver observación O-1); sin LiquidComplexity: main-product 120, featured-product 111 tras C-08a y 110 tras C-08b.
4. Locales: 437 hojas tras C-08a y 434 tras C-08b, en/es en paridad, sin huérfanas ni sin resolver; JSON válido; theme-check-sanity exit 0.
5. Sin metafields, sin tiendas, sin `.secrets`, sin tocar archivos de A-02 ni `provenance_notes`.
Archivos tocados: ver §4. Solo la lista cerrada de cada fase (18 en C-08a, 13 en C-08b; unión 28 archivos) más este informe.
Desviaciones: D-1 (C-08b aplicada sin commit previo de C-08a, por instrucción de la tarea; el preflight §1.2 lo exigía). Ninguna otra. N2-1, N2-2, N2-3 ejecutadas con la autorización de Johandry (D26).
Hallazgos extra fuera de alcance: los de §7.3 de la directiva, sin parche (ver §9).
Verificación: salidas literales abajo, todas estáticas. Demuestran que los scripts aplican, que el JSON parsea, que Theme Check/locales/complejidad pasan y que los residuos son los esperados. No demuestran comportamiento en tienda, existencia de destinos de CTA ni títulos de colecciones.

# 1. Preflight y línea base (antes de editar)

```text
$ git rev-parse --abbrev-ref HEAD
lote-a
$ git merge-base --is-ancestor eb7cca7… HEAD && echo BASE_OK
BASE_OK
$ git log --oneline eb7cca7..HEAD
64862d1 Lote A: A-01 y B-02 un solo control de variante y de plan por formulario
c81cbcb Lote A: A-03 foco visible por motion_style con el color del esquema
a6a9074 Lote A: A-02 retira las fuentes automaticas de especificaciones y procedencia
$ git status --short
?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-C-08-001.md
?? agent-comms/outbox-claude/CLAUDE-REVIEW-C-08-RD-001.md
Línea base: theme check "93 files inspected with no offenses found."; theme-check-sanity exit 0;
locale-key-inventory sin resolver 0/0, huérfanas 0/0; json-validate exit 0;
complejidad: sections/featured-product.liquid 111, sections/main-product.liquid 120; barrido: 296
```

SHA-256 de los scripts extraídos (coinciden con §1.4):

```text
f4aba7a77d28ed5d8770750a9fdaa4ac74d8cae02d8deece9794f85af24b1709  c08a_apply.py
6b029845866af7980c3eb5e40115854ef74607c41023e22c969a114291e00554  c08b_apply.py
21312b3b06fb67c9a0094b6c1848156c05b0c14f1970bfc44e999a5c242f777e  c08_verify.py
ce012a431c1e65e60a2021fa21493e4703f82b36f69b12c7559f95056df30981  c08_grep.sh
4ca494f36afc827bef5d1052696b4e563bd4bc221c90547539a192606077138d  c08_complexity.sh
```

# 2. Ensayo y aplicación

```text
C-08a ensayo (git archive HEAD):  C08_APPLY_OK archivos=18 ; C08_VERIFY_OK fase=a plantillas_revisadas=28
C-08a real:                       C08_APPLY_OK archivos=18 ; C08_VERIFY_OK fase=a plantillas_revisadas=28
C-08b ensayo (copia del árbol con C-08a): C08_APPLY_OK archivos=13 ; C08_VERIFY_OK fase=b plantillas_revisadas=28
C-08b real:                       C08_APPLY_OK archivos=13 ; C08_VERIFY_OK fase=b plantillas_revisadas=28
```

# 3. Verificaciones por fase (salidas literales)

| Criterio (§5.1) | Tras C-08a | Tras C-08b |
| --- | --- | --- |
| 1 git diff --name-only | 18 archivos = lista cerrada | 28 acumulados; los 13 de C-08b = lista cerrada (10 nuevos + 3 ya tocados: ambos locales y main-contact) |
| 3 c08_verify | `C08_VERIFY_OK fase=a plantillas_revisadas=28` | `C08_VERIFY_OK fase=b plantillas_revisadas=28` |
| 4 barrido | 71 (tabla idéntica, diff vacío) | 35 (tabla idéntica, diff vacío) |
| 5 json-validate | exit 0 | exit 0 |
| 6 Theme Check | `93 files inspected with no offenses found.` | `93 files inspected with no offenses found.` |
| 7 theme-check-sanity | exit 0 | exit 0 |
| 8 locale-key-inventory | sin resolver 0/0, runtime 0, huérfanas 0/0, exit 0 | ídem, exit 0 |
| 9 paridad | `en 437 es 437 en-es 0 es-en 0` | `en 434 es 434 en-es 0 es-en 0` |
| 10 complejidad (HX-1) | main-product 120, featured-product 111 | main-product 120, featured-product 110 |
| 11 page/page_content | 0 | 0 |
| 12 fallbacks/reason_appointment | 15 | 0 |

Sin aviso LiquidComplexity en ninguna fase; no se añadió ningún archivo nuevo.

Salida literal de Theme Check tras C-08b: `│  93 files inspected with no offenses found.  │`. Complejidad tras C-08b:

```text
sections/featured-product.liquid 110
sections/main-product.liquid 120
```

Barrido tras C-08a (`uniq -c`, idéntico a §5.3):

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

Barrido tras C-08b (35 líneas, idéntico a §5.3):

```text
      2 listings/archive/templates/index.json: conservat
      1 listings/imprint/templates/index.json: tolerance
      1 listings/sartorial/templates/index.json: numbered
      1 locales/en.default.json: complimentary
      3 locales/en.default.json: free shipping
      1 locales/en.default.json: grade i
      1 locales/en.default.json: grade ii
      1 locales/en.default.json: grade iii
      1 locales/en.default.json: grade iv
      2 locales/en.default.json: showroom
      2 locales/en.default.schema.json: free shipping
      1 locales/en.default.schema.json: grade i
      1 locales/en.default.schema.json: grade ii
      1 locales/en.default.schema.json: grade iii
      1 locales/en.default.schema.json: grade iv
      1 locales/en.default.schema.json: repair
      1 locales/en.default.schema.json: showroom
      1 locales/es.json: complimentary
      3 locales/es.json: envío gratuito
      2 locales/es.json: showroom
      5 sections/main-contact.liquid: showroom
      1 snippets/cart-drawer-recommendations.liquid: complimentary
      1 templates/page.contact.json: showroom
```

# 4. Archivos tocados

C-08a (18): `git apply --stat` del parche de la fase:

```text
 listings/archive/templates/collection.json   |    6 +--
 listings/archive/templates/index.json        |   43 ++++++++-----------
 listings/archive/templates/product.json      |   14 +-----
 listings/imprint/templates/collection.json   |    2 -
 listings/imprint/templates/index.json        |   38 +++++++---------
 listings/imprint/templates/product.json      |   18 ++------
 listings/sartorial/templates/collection.json |    2 -
 listings/sartorial/templates/index.json      |   33 ++++++--------
 listings/sartorial/templates/product.json    |   18 ++------
 locales/en.default.json                      |   19 ++++----
 locales/es.json                              |   19 ++++----
 sections/header-group.json                   |    4 +-
 sections/main-contact.liquid                 |    1 
 templates/index.json                         |   60 +++-----------------------
 templates/page.about.json                    |   20 ++-------
 templates/page.contact.json                  |   60 ++++----------------------
 templates/page.faq.json                      |   57 +++----------------------
 templates/product.json                       |   14 +-----
 18 files changed, 116 insertions(+), 312 deletions(-)
```

C-08b (13): locales/en.default.json, locales/es.json, locales/en.default.schema.json, sections/main-product.liquid, sections/featured-product.liquid, sections/main-contact.liquid, sections/announcement-bar.liquid, sections/brand-manifesto.liquid, sections/hero-editorial.liquid, sections/main-about.liquid, sections/main-faq.liquid, sections/main-password.liquid, sections/newsletter.liquid.

Acumulado (`git diff --stat`):

```text
 listings/archive/templates/collection.json   |  6 +--
 listings/archive/templates/index.json        | 43 +++++++++-----------
 listings/archive/templates/product.json      | 14 ++-----
 listings/imprint/templates/collection.json   |  2 +-
 listings/imprint/templates/index.json        | 38 ++++++++----------
 listings/imprint/templates/product.json      | 18 +++------
 listings/sartorial/templates/collection.json |  2 +-
 listings/sartorial/templates/index.json      | 33 +++++++--------
 listings/sartorial/templates/product.json    | 18 +++------
 locales/en.default.json                      | 26 +++++-------
 locales/en.default.schema.json               |  4 +-
 locales/es.json                              | 26 +++++-------
 sections/announcement-bar.liquid             |  2 +-
 sections/brand-manifesto.liquid              |  6 +--
 sections/featured-product.liquid             | 27 +++----------
 sections/header-group.json                   |  4 +-
 sections/hero-editorial.liquid               |  4 +-
 sections/main-about.liquid                   | 12 +++---
 sections/main-contact.liquid                 | 18 ++++-----
 sections/main-faq.liquid                     |  4 +-
 sections/main-password.liquid                |  5 +--
 sections/main-product.liquid                 | 25 +++---------
 sections/newsletter.liquid                   |  3 +-
 templates/index.json                         | 60 +++-------------------------
 templates/page.about.json                    | 20 ++--------
 templates/page.contact.json                  | 60 +++++-----------------------
 templates/page.faq.json                      | 57 ++++----------------------
 templates/product.json                       | 14 ++-----
 28 files changed, 153 insertions(+), 398 deletions(-)
```

Diferencia con las listas cerradas: ninguna. Más este informe (único archivo nuevo, no rastreado).

# 5. Recorrido estático (§5.4), archivo:línea tras editar

- PDP: `sections/main-product.liquid:675` `when 'shipping_lead_time', 'trust_badges'`; `:676` `trust_text` ; `:677` `if trust_text != blank` (vacío → sin `<p class="product-trust">`); iconos `:681-688` (clock, truck, ruler, shield). Complejidad 120.
- Producto destacado: `sections/featured-product.liquid:421-422` (`featured_product != blank and trust_text != blank`), `:435` texto escapado. Complejidad 110.
- `grep -rn "delivery_text\|returns_text" sections snippets layout` solo devuelve main-product y featured-product (más sus schemas).
- Pestañas: `grep -c shipping_returns` = 0 en `templates/product.json` y en los tres `listings/*/templates/product.json`; criterio 11 = 0.
- Newsletter: `sections/newsletter.liquid:24` cae a `newsletter.copy` (neutralizado en locale).
- Contacto: `<select>` con 5 opciones (`sections/main-contact.liquid:112-116`: placeholder, order, materials, press, other); nota de respuesta retirada.
- Contraseña: `sections/main-password.liquid:92` `opening_note != blank` (default retirado, nota oculta).
- Destinos de CTA: URL sin cambios; etiquetas limitadas a lo que ofrece el destino. Existencia en tienda: no verificado (D22).

# 6. Filas ejecutadas

C-08a: R-01–R-30 (R-11 sin edición), S-01–S-14, I-01–I-14, AR-01–AR-17, T-07, T-08, T-10, T-11, T-12, T-13, F-1, F-2, F-4, F-5. C-08b: T-01–T-06 (N2-1), T-09 (N2-3), T-14–T-27 y F-3 (N2-2). El detalle fila → línea nueva lo acreditan `c08_verify.py` (fases a y b) y el diff; no se transcribió fila a fila.

# 7. Compuertas

1. Requisitos: C-08 no cierra filas del ledger (no editado). Evidencia en §3 y §5.
2. Estados degenerados (estático): vacío (trust_text vacío → sin `<p>`; manifiesto sin detalles → sin `<dl>`; newsletter sin texto → locale), uno solo (marquee raíz 2 ítems, Archive 3), muchos (sin cambio), muy largo (mismo escape), faltante (colección inexistente → `tab_fallback`). En tienda: pendiente.
3. Consistencia: textos neutros repetidos literalmente entre FAQ, contacto y producto; `in_stock` coincide con el otro uso; sin duplicar SVG.
4. Superficie del comerciante: sin labels nuevos; dos `info` de T-06 siguen en `t:`.
5. Tienda real: no aplica sin credenciales; queda para R-A.

# 8. Ledger (propuesta, sin editar)

Fila 88: C-08a nota en evidencia (`in_stock`); tras R-A, C-08b a `código completo`. Filas 84, 22, 109, 111: sin cambio de estado. Nada se declara `cumplido`.

# 9. Observaciones, extras y dudas

- O-1: Theme Check inspecciona 93 archivos (la directiva decía 92 en su copia). Es el mismo número en línea base, tras C-08a y tras C-08b; no hay variación atribuible a C-08. Probable diferencia de la copia del redactor; no investigado.
- D-1: C-08b se ejecutó con C-08a aún sin commit (el preflight §1.2 exigía el commit). Los scripts no dependen del commit; la verificación `a` pasó antes de C-08b. El coordinador puede separar los commits con `git add` selectivo: los archivos exclusivos de C-08b son los 10 que `c08b` añade a la lista de C-08a; los tres compartidos (en.default.json, es.json, main-contact.liquid) mezclan ambas fases; el parche solo de C-08a queda en el scratchpad (`.../scratchpad/c08/phase_a.patch`).
- Extras §7.3 (sin parche): CSS sin uso `.main-contact__response-note` en `assets/base.css`; `scripts/translations/es.storefront.json:318,718` obsoletos; `templates/page.about.json:11` texto instructivo visible; `<dl class="main-contact__atelier-facts">` vacío; `main-product.liquid` sin margen de complejidad (120/120).
- Nada que anotar sobre cadenas posiblemente factuales en los anexos.

# 10. Afirmaciones falsables (todas estáticas)

1. Tras C-08a, `git diff --name-only` lista exactamente los 18 archivos de §4.1 y el barrido da 71 líneas idénticas a la tabla.
2. Tras C-08b, el acumulado son 28 archivos, el barrido da 35 líneas idénticas a la tabla y `delivery_fallback|returns_fallback|contact.services.response|reason_appointment` da 0.
3. Theme Check: 0 ofensas tras cada fase; main-product 120, featured-product 110 al final.
4. Locales: 434 hojas en en y es, 0 diferencias, 0 huérfanas.
5. Ninguna fase toca metafields, `assets/`, `config/`, `layout/`, `snippets/`, ni `provenance_notes`.
