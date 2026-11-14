# CLAUDE-REPORT-A-01-B-02-001: implementacion de A-01 (suscripciones) y B-02 (variantes sin JS)

```text
ID: CLAUDE-REPORT-A-01-B-02-001
Estado: CODIGO COMPLETO (D22). Verificacion SINTETICA y ESTATICA; nada probado en tienda. A-01: codigo completo; cierre en espera de C-R0-4 (Johandry) y credenciales (D22). B-02: codigo completo; cierre en espera de credenciales (D22), sin fixture. Sin commit ni push (lo hace el coordinador).
Decision requerida: Coordinador: (1) pedir a JOHANDRY la autorizacion de D-1 (Nivel 2: snippet nuevo fuera de la lista cerrada; no hacer commit con el snippet sin ella); (2) actualizar el ledger (filas 69 y 71, propuesta en 6); (3) commit y push tras la revision. Johandry: autorizar o rechazar D-1 (snippet frente a pegar el select en las dos secciones, seccion 7.1). PD-1 y PD-4 siguen dentro del plan y de D15.
Resumen en 5 lineas:
  1. El formulario de compra (PDP y producto destacado) deja de tener dos controles exitosos por nombre: con JS, VariantSelects retira el name y desactiva los selects nativos y activa el hidden de variante; sin JS, el select nativo de variantes es el unico control de id.
  2. B-02: select nativo de variantes (snippet nuevo) con la variante seleccionada siempre presente (C-1, mas de 250 variantes), selector visual con js-only, hidden id nace desactivado si hay select.
  3. A-01: el select nativo de planes lleva autocomplete off y el hook data-no-js-control; con JS ya no envia selling_plan (compra unica = 0 valores, un plan = 1 valor, caso C resuelto).
  4. S-5 (layout/theme.liquid, PD-1 si): si theme.js no define variant-selects al llegar DOMContentLoaded, el documento vuelve a no-js (JS fallido con 404 o con error de sintaxis); con theme.js lento no hay cambio; CM-1: si theme.js se define despues (apps que difieren el JS), whenDefined devuelve la pagina a js.
  5. Harness sintetico: base c81cbcb falla (H-17 PASS: 32 casos fallan), cambios: 56 de 56 PASS en PDP y producto destacado. Theme Check 0 ofensas; compuerta del literal 0.
Archivos tocados: assets/theme.js, layout/theme.liquid, sections/main-product.liquid, sections/featured-product.liquid, snippets/variant-no-js-select.liquid (NUEVO, fuera de la lista: D-1), agent-comms/outbox-claude/harness-A-01-B-02-001/ (nuevo) y este informe. No se toco el ledger, ni CSS, ni schemas, ni locales.
Desviaciones (Nivel 1 o Nivel 2): Nivel 2 por D-1 (RULES 3.5: archivo fuera de la lista permitida; la R-D excluia snippets), autorizado por Johandry (D25, 2026-11-04, CLAUDE-DECISION-A-01-B-02-001). D-2 a D-4 y CM-1 son menores (ver 7).
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo; se confirman los tres de la directiva 7.2 (total de linea y price_cents del destacado, localizadores obsoletos de la fila 71, parametros purchase-option residuales).
Verificacion (comando, resultado y que demuestra/que no): secciones 3 a 5. Estatica (Theme Check, scripts) y sintetica (Chromium local de Playwright, HTML traducido a mano, theme.js real). No demuestra como interpreta Shopify el payload, Buy it now, apps ni nada en tienda.
Lista de afirmaciones falsables numeradas: seccion 10.
```

# 1. Identidad

- Rama `lote-a`. `HEAD_INICIO` (SHA base del turno): `c81cbcb2205d9cca2ff73252c583fa058772c4de`. Desciende de `eb7cca7`. Arbol limpio fuera de `agent-comms/` al empezar (C-4); solo habia directivas sin seguimiento.
- `git diff --stat c81cbcb2205d9cca2ff73252c583fa058772c4de -- . ':!agent-comms'` (incluye el snippet nuevo, que esta sin seguimiento y por eso no aparece en `git diff`):

```text
 assets/theme.js                  | 14 ++++++++++++++
 layout/theme.liquid              | 15 +++++++++++++++
 sections/featured-product.liquid | 16 +++++++++++++---
 sections/main-product.liquid     | 22 +++++++++++++++++++---
 4 files changed, 61 insertions(+), 6 deletions(-)
?? snippets/variant-no-js-select.liquid   (58 lineas, nuevo)
```

- `git diff --stat eb7cca7 -- <4 archivos>` (control de solape): `4 files changed, 61 insertions(+), 6 deletions(-)`. Igual que el anterior: A-02, A-03 y C-08 no tocaron estos archivos antes de este turno.
- SHA-256 (prefijo 16) tras los cambios: `theme.js 518c04deeeb93a4a`, `main-product.liquid 7e3a413d938a4752`, `featured-product.liquid 3b4989deac1e5e57`, `layout/theme.liquid 25651c3ab0e9cd0e`, `variant-no-js-select.liquid 91617bcb04dac1a2`.

## 1.1 Lista cerrada frente a lista efectivamente tocada (lineas exactas, tras los cambios)

| Archivo | Lineas | Cambio |
| --- | --- | --- |
| `sections/main-product.liquid` | 26-37 | `render_variant_no_js` (S-1a): variantes reales y bloque `variant_picker` |
| | 229 | `js-only` en `variant-picker` (S-1b) |
| | 489-493 | hidden `id` con `disabled` condicional y `render` del select nativo (S-1c) |
| | 593 | select de planes sin JS con `autocomplete="off" data-no-js-control` (S-3) |
| `sections/featured-product.liquid` | 7-12 | `render_variant_no_js` (S-2) |
| | 121 | `js-only` |
| | 232-236 | hidden `id` y `render` del select nativo |
| | 335 | select de planes sin JS (S-3) |
| `assets/theme.js` | 573 | llamada a `takeOverNativeControls()` tras la guarda `variantData.length === 0` (S-4b) |
| | 629-641 | metodo `takeOverNativeControls()` (S-4a, con C-2) |
| `layout/theme.liquid` | 100-114 | S-5, un unico listener `DOMContentLoaded` tras las dos lineas de la clase `js` (C-5), con la recuperacion `whenDefined('variant-selects')` dentro de la rama de fallback (CM-1) |
| `snippets/variant-no-js-select.liquid` (NUEVO) | 1-58 | select nativo de variantes (S-1c/S-2, C-1). Fuera de la lista: D-1 |
| `agent-comms/outbox-claude/harness-A-01-B-02-001/` | harness.mjs, salida-base.txt, salida-fix.txt | harness entregable |

# 2. Preflight (literal, antes de editar; estatico)

```text
$ git status --short --branch
## lote-a...origin/lote-a
?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-01-B-02-001.md
?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-C-08-001.md
?? agent-comms/outbox-claude/CLAUDE-REVIEW-A-01-B-02-RD-001.md
$ git rev-parse HEAD
c81cbcb2205d9cca2ff73252c583fa058772c4de
$ git merge-base --is-ancestor eb7cca797f9de142089c6c14daaa5ed449597f9f HEAD && echo "desciende de eb7cca7"
desciende de eb7cca7
$ git diff --stat eb7cca7 -- sections/main-product.liquid sections/featured-product.liquid assets/theme.js layout/theme.liquid
(sin salida)
$ node --check assets/theme.js && echo checkok
checkok
$ rg -n 'name="selling_plan"|data-selling-plan-input|data-variant-id|name="id"|data-no-js-control' sections/main-product.liquid sections/featured-product.liquid
sections/featured-product.liquid:226:  <input type="hidden" name="id" value="{{ selected_variant.id }}" data-variant-id>
sections/featured-product.liquid:315:  name="selling_plan"
sections/featured-product.liquid:317:  data-selling-plan-input
sections/featured-product.liquid:325:  <select id="FeaturedSellingPlanNoJs-{{ section.id }}" name="selling_plan">
sections/main-product.liquid:477:  <input type="hidden" name="id" value="{{ selected_variant.id }}" data-variant-id>
sections/main-product.liquid:567:  name="selling_plan"
sections/main-product.liquid:569:  data-selling-plan-input
sections/main-product.liquid:577:  <select id="SellingPlanNoJs-{{ section.id }}" name="selling_plan">
$ rg -n "data-no-js-control|takeOverNativeControls|elements\.namedItem\('id'\)|elements\.id\b|\[name=\"id\"\]" assets/
(sin salida; rc=1)
```

(Salida abreviada en la indentacion de las lineas de `rg`; el contenido es el literal.) Condiciones de paso: rama `lote-a`, desciende de `eb7cca7`, un `name="id"` y un hidden de plan y un select sin JS por seccion, ningun JS lee `namedItem('id')`, `elements.id` ni `[name="id"]`. C-4: `git status --short -- . ':!agent-comms'` vacio.

# 3. Compuertas estaticas (literal)

```text
== node --check
exit 0
== theme check
│  93 files inspected with no offenses found.                                  │
== locale
--------------------------------------------------------------------------
OK: todas las referencias estaticas resuelven contra los locales.
== dataset-hooks
--------------------------------------------------------------------------
DATASET HOOKS  (contrato JS <-> Liquid, por componente)
--------------------------------------------------------------------------
JS leido:                           assets/product-zoom.js, assets/theme.js
Componentes con data-* de contrato: 22
Exentas por escritura en runtime:   cartAddPending, cartCountLabel, comparePrice, currentPrice, dirty, gridColumns, itemCount, pending, quickBuyMode, reducedMotion, reveal, revealReady, sourcesLoaded, stockState, variantId, wasDisabled
  <theme-disclosure>            1 claves  2 montaje(s)
  <product-gallery>             1 claves  1 montaje(s)
  <variant-selects>            11 claves  2 montaje(s)
  <product-inventory>           4 claves  1 montaje(s)
  <recently-viewed>             7 claves  1 montaje(s)
  <sticky-cart-bar>             5 claves  1 montaje(s)
  <size-guide-modal>            1 claves  1 montaje(s)
  <gift-card-recipient>         3 claves  1 montaje(s)
  <pickup-availability>         3 claves  1 montaje(s)
  <product-recommendations>     1 claves  1 montaje(s)
  <product-card-variants>       5 claves  1 montaje(s)
  <cart-drawer>                13 claves  1 montaje(s)
  <facet-filters-form>          2 claves  2 montaje(s)
  <editorial-hero>              3 claves  1 montaje(s)
  <complete-the-look>          10 claves  1 montaje(s)
  <marquee-banner>              2 claves  1 montaje(s)
  <announcement-bar>            2 claves  1 montaje(s)
  <anchor-nav>                  3 claves  2 montaje(s)
  <copy-text>                   2 claves  1 montaje(s)
  <faq-filter>                  1 claves  1 montaje(s)
  <predictive-search>          16 claves  1 montaje(s)
  <product-zoom>                1 claves  1 montaje(s)

Contratos rotos: 0

ALCANCE: comprueba que el Liquid que monta el componente emita el atributo.
No comprueba que esté dentro de la etiqueta de apertura ni que su valor
sea válido en runtime.
rc=0
== json-validate
----------------------------------------------------------------------
JSON VALIDATE
----------------------------------------------------------------------
Archivos .json comprobados: 521
  de ellos en /listings/:    11  <- fuera del alcance de Theme Check
Fallos de parseo:           0
URIs shopify://shop_images/: 0  <- solo carpetas de tema y /listings/

ALCANCE: comprueba que el JSON parsee. No comprueba que el schema
sea semanticamente valido para Shopify: eso lo cubre Theme Check
en las carpetas de tema, y nadie en /listings/.
rc=0
```

Salida literal de `node scripts/theme-check-sanity.mjs` (CM-3; ejecutada tras CM-1):

```text
[theme-check-sanity] sandbox en .tmp/theme-check-sanity-11132 con 7 carpetas de tema
[theme-check-sanity] detectado LiquidHTMLSyntaxError (etiqueta Liquid sin cerrar) en sections/main-page.liquid
[theme-check-sanity] detectado TranslationKeyExists (clave de traduccion inexistente) en sections/main-blog.liquid
[theme-check-sanity] detectado ValidSchemaTranslations (clave t: de schema inexistente) en sections/main-placeholder.liquid

[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
[theme-check-sanity] ALCANCE DE ESTA PRUEBA: demuestra que esos tres checks estan activos y que disparan sobre archivos de tema. No demuestra cobertura exhaustiva de todas las referencias de traduccion. Para eso corre scripts/locale-key-inventory.mjs.
sanity rc=0
```

Recuentos (`rg -c`), tras los cambios. El snippet es nuevo, asi que los conteos cambian frente a la directiva (2 y 2 en las secciones): ahora 1 y 1 por seccion mas 1 en el snippet.

```text
$ rg -c 'name="id"' sections/main-product.liquid sections/featured-product.liquid snippets/variant-no-js-select.liquid
sections/main-product.liquid:1
sections/featured-product.liquid:1
snippets/variant-no-js-select.liquid:1
$ rg -c 'data-no-js-control' sections/main-product.liquid sections/featured-product.liquid snippets/variant-no-js-select.liquid
sections/main-product.liquid:1
sections/featured-product.liquid:1
snippets/variant-no-js-select.liquid:1
$ rg -n "data-no-js-control" snippets/ | rg -v variant-no-js-select
(vacio: R-2, ningun otro snippet cambia)
```

Alcance (C-3): `dataset-hooks.mjs` solo cruza lecturas `this.dataset.*`; NO cubre `data-no-js-control` (selector `querySelectorAll`). Esa cobertura la dan los `rg -c` de arriba, el contador H-23 del harness y H-16. `LiquidComplexity`: con el select dentro de `main-product.liquid` el archivo sumaba 128 (limite 120, 1 aviso); con el snippet queda en 0 ofensas (D-1).

# 4. Harness sintetico (entregable en `agent-comms/outbox-claude/harness-A-01-B-02-001/`)

- Comandos: `node agent-comms/outbox-claude/harness-A-01-B-02-001/harness.mjs . fix` (codigo nuevo, exit 0) y `... harness.mjs . base c81cbcb` (H-17: theme.js, layout y Liquid del commit base; exit 0 cuando se reproducen los fallos). Salidas completas: `salida-fix.txt` y `salida-base.txt` en la misma carpeta.
- Fidelidad (C-7): traduce a mano el Liquid de las dos secciones, del snippet nuevo y el script en linea de `layout/theme.liquid`, que se EXTRAE del archivo real (no se reescribe). `theme.js` se sirve leido del repositorio sin copiarlo ni modificarlo. Radios de compra `featured-purchase-option-<id>` en el destacado; `<pickup-availability data-variant-id>` dentro de `variant-selects`; p8 con dos opciones reales (Color y Size, Red/M agotada); separadores ` / `; formato de dinero largo `€… EUR`. H-23 compara el numero de apariciones de `name="id"`, `data-no-js-control`, `no-js-only`, `js-only`, `data-selling-plan-input` y `data-variant-id` entre el Liquid real y el HTML generado: coinciden en las dos superficies.
- Modos: JS; sin JS (`javaScriptEnabled: false`, POST capturado con `page.route`); `theme.js` en 404, con error de sintaxis y lento (1500 ms).
- Limite: el HTML lo genera el harness, no Shopify. No prueba como interpreta Shopify `selling_plan=` vacio, parametros duplicados ni combinaciones invalidas; ni Buy it now, apps o moviles reales.

## 4.1 Salida literal tras los cambios (`fix`, PDP y producto destacado; regenerada tras CM-1)

```text
PASS H-1 [pdp] compra unica (JS) :: {"id":["101"],"sp":[]}
PASS H-2 [pdp] plan 1 -> plan 2 -> compra unica (JS) :: [{"id":["101"],"sp":["1"]},{"id":["101"],"sp":["2"]},{"id":["101"],"sp":[]}]
PASS H-3 [pdp] plan 2 y variante L solo con plan 3; agotada sin plan :: {"L":{"id":["103"],"sp":["3"]},"XL":{"id":["104"],"sp":[]},"btn":{"disabled":true,"notice":false,"checkoutHidden":true}}
PASS H-4 [pdp] caso C: ?selling_plan=1 y luego compra unica (JS) :: {"carga":["1"],"tras":[],"id":["101"]}
PASS H-5 [pdp] requires_selling_plan (JS) :: {"r1":["1"],"r2":["2"],"M":{"id":["202"],"sp":[]},"btn":{"disabled":true,"notice":true,"checkoutHidden":true}}
PASS H-6a [pdp] p3 requires sin grupos (JS) :: {"disabled":true,"notice":true,"checkoutHidden":true}
PASS H-6b [pdp] p3 requires sin grupos (sin JS) :: {"disabled":true,"notice":true,"checkoutHidden":true}
PASS H-7 [pdp] sin JS p1: elegir 102 en el select :: {"post_id":["102"],"html":"no-js","selectDisplay":"block","pickerDisplay":"none","hiddenDisabled":true}
PASS H-7 [pdp] sin JS p8: elegir 804 en el select :: {"post_id":["804"],"html":"no-js","selectDisplay":"block","pickerDisplay":"none","hiddenDisabled":true}
PASS H-8 [pdp] theme.js 404 :: {"html":"no-js","selectDisplay":"block","post_id":["804"]}
PASS H-18b [pdp] theme.js throw :: {"html":"no-js","selectDisplay":"block","post_id":["804"]}
PASS H-18c [pdp] theme.js tardio (tras DOMContentLoaded): vuelve a js y el comprador elige variante :: {"html":"js","picker":"block","nativeSelectVisible":false,"hiddenIdEnabled":true,"id":["102"]}
PASS H-18a [pdp] theme.js lento (1,5 s): sin vuelta falsa a no-js :: {"html":"js","hiddenDisabled":false,"native":[true,true]}
PASS H-9a [pdp] ?variant=102 (JS) :: ["102"]
PASS H-9b [pdp] ?variant=102 (sin JS) :: ["102"]
PASS H-10 [pdp] sin JS: plan de la URL y compra unica (limite 4.3.2: selling_plan vacio) :: {"id":["101"],"selling_plan":[""]}
PASS H-11 [pdp] sin JS: agotadas disabled salvo la seleccionada, con sufijo :: {"agotada":{"v":"104","d":true,"s":false,"t":"XL / €50,00 EUR / Sold out"},"seleccionadaAgotada":{"v":"104","d":false,"s":true}}
PASS H-12a [pdp] p4 (sin JS) :: {"names":1,"selects":0,"post_id":["401"]}
PASS H-12b [pdp] p4 (JS) :: {"names":1,"selects":0,"post_id":["401"]}
PASS H-13 [pdp] p5 (40 variantes) :: {"opts":40,"bytes":2209,"sinJS_post":["5039"],"jsId":["5000"],"jsId_tras_C1":["5010"]}
PASS H-13 [pdp] p6 (250 variantes) :: {"opts":250,"bytes":12859,"sinJS_post":["6249"],"jsId":["6000"],"jsId_tras_C1":["6010"]}
PASS H-13b [pdp] p9 300 variantes, ?variant=9260 fuera de las 250 :: {"opciones":251,"post_id":["9260"]}
PASS H-14 [pdp] p7 titulo de 120 caracteres y precio largo :: {"longitud":138,"post_id":["702"]}
PASS H-15 [pdp] p8 Red/M agotada :: {"opcion":{"disabled":true,"text":"Red / M / €50,00 EUR / Sold out"},"sinJS_post_id":["801"],"jsBtn":{"disabled":true,"notice":false,"checkoutHidden":true}}
PASS H-16 [pdp] JS toma el control (name retirado, desactivados) :: {"native":[{"disabled":true,"name":null},{"disabled":true,"name":null}],"hiddenEnabled":true,"namedId":"HTMLInputElement","namedIdIsHidden":true,"namedIdValue":"102","namedSp":"HTMLInputElemen ...
PASS H-19 [pdp] sin bloque variant_picker: se conserva el comportamiento actual :: {"names":1,"post_id":["101"]}
PASS H-20 [pdp] JSON de variantes roto: un valor por nombre (estado del servidor) :: {"id":["101"],"sp":["1"]}
PASS H-1 [featured] compra unica (JS) :: {"id":["101"],"sp":[]}
PASS H-2 [featured] plan 1 -> plan 2 -> compra unica (JS) :: [{"id":["101"],"sp":["1"]},{"id":["101"],"sp":["2"]},{"id":["101"],"sp":[]}]
PASS H-3 [featured] plan 2 y variante L solo con plan 3; agotada sin plan :: {"L":{"id":["103"],"sp":["3"]},"XL":{"id":["104"],"sp":[]},"btn":{"disabled":true,"notice":false,"checkoutHidden":true}}
PASS H-4 [featured] caso C: ?selling_plan=1 y luego compra unica (JS) :: {"carga":["1"],"tras":[],"id":["101"]}
PASS H-5 [featured] requires_selling_plan (JS) :: {"r1":["1"],"r2":["2"],"M":{"id":["202"],"sp":[]},"btn":{"disabled":true,"notice":true,"checkoutHidden":true}}
PASS H-6a [featured] p3 requires sin grupos (JS) :: {"disabled":true,"notice":true,"checkoutHidden":true}
PASS H-6b [featured] p3 requires sin grupos (sin JS) :: {"disabled":true,"notice":true,"checkoutHidden":true}
PASS H-7 [featured] sin JS p1: elegir 102 en el select :: {"post_id":["102"],"html":"no-js","selectDisplay":"block","pickerDisplay":"none","hiddenDisabled":true}
PASS H-7 [featured] sin JS p8: elegir 804 en el select :: {"post_id":["804"],"html":"no-js","selectDisplay":"block","pickerDisplay":"none","hiddenDisabled":true}
PASS H-8 [featured] theme.js 404 :: {"html":"no-js","selectDisplay":"block","post_id":["804"]}
PASS H-18b [featured] theme.js throw :: {"html":"no-js","selectDisplay":"block","post_id":["804"]}
PASS H-18c [featured] theme.js tardio (tras DOMContentLoaded): vuelve a js y el comprador elige variante :: {"html":"js","picker":"block","nativeSelectVisible":false,"hiddenIdEnabled":true,"id":["102"]}
PASS H-18a [featured] theme.js lento (1,5 s): sin vuelta falsa a no-js :: {"html":"js","hiddenDisabled":false,"native":[true,true]}
PASS H-10 [featured] sin JS: plan de la URL y compra unica (limite 4.3.2: selling_plan vacio) :: {"id":["101"],"selling_plan":[""]}
PASS H-11 [featured] sin JS: agotadas disabled salvo la seleccionada, con sufijo :: {"agotada":{"v":"104","d":true,"s":false,"t":"XL / €50,00 EUR / Sold out"},"seleccionadaAgotada":{"v":"104","d":false,"s":true}}
PASS H-12a [featured] p4 (sin JS) :: {"names":1,"selects":0,"post_id":["401"]}
PASS H-12b [featured] p4 (JS) :: {"names":1,"selects":0,"post_id":["401"]}
PASS H-13 [featured] p5 (40 variantes) :: {"opts":40,"bytes":2221,"sinJS_post":["5039"],"jsId":["5000"],"jsId_tras_C1":["5010"]}
PASS H-13 [featured] p6 (250 variantes) :: {"opts":250,"bytes":12871,"sinJS_post":["6249"],"jsId":["6000"],"jsId_tras_C1":["6010"]}
PASS H-13b [featured] p9 300 variantes, ?variant=9260 fuera de las 250 :: {"opciones":251,"post_id":["9260"]}
PASS H-14 [featured] p7 titulo de 120 caracteres y precio largo :: {"longitud":138,"post_id":["702"]}
PASS H-15 [featured] p8 Red/M agotada :: {"opcion":{"disabled":true,"text":"Red / M / €50,00 EUR / Sold out"},"sinJS_post_id":["801"],"jsBtn":{"disabled":true,"notice":false,"checkoutHidden":true}}
PASS H-16 [featured] JS toma el control (name retirado, desactivados) :: {"native":[{"disabled":true,"name":null},{"disabled":true,"name":null}],"hiddenEnabled":true,"namedId":"HTMLInputElement","namedIdIsHidden":true,"namedIdValue":"102","namedSp":"HTMLInputE ...
PASS H-19 [featured] sin bloque variant_picker: se conserva el comportamiento actual :: {"names":1,"post_id":["101"]}
PASS H-20 [featured] JSON de variantes roto: un valor por nombre (estado del servidor) :: {"id":["101"],"sp":["1"]}
PASS H-21 [featured] destacado sin producto: sin formulario ni errores :: {"errores":[]}
PASS H-22 [featured x2] dos productos destacados: ids unicos :: []
PASS H-23 [pdp] ocurrencias de atributos clave: Liquid real = HTML traducido :: [{"token":"name=\"id\"","liquid":2,"html":2},{"token":"data-no-js-control","liquid":2,"html":2},{"token":"no-js-only","liquid":2,"html":2},{"token":"js-only (sin no-js-only)","liqu ...
PASS H-23 [featured] ocurrencias de atributos clave: Liquid real = HTML traducido :: [{"token":"name=\"id\"","liquid":2,"html":2},{"token":"data-no-js-control","liquid":2,"html":2},{"token":"no-js-only","liquid":2,"html":2},{"token":"js-only (sin no-js-only)", ...

MODO=fix total=56 pass=56 fail=0
FALLAN: []
```

## 4.2 Salida literal en rojo contra la base `c81cbcb` (`base`, H-17): casos que FALLAN

```text
FAIL H-1 [pdp] compra unica (JS) :: {"id":["101"],"sp":[""]}
FAIL H-2 [pdp] plan 1 -> plan 2 -> compra unica (JS) :: [{"id":["101"],"sp":["1",""]},{"id":["101"],"sp":["2",""]},{"id":["101"],"sp":[""]}]
FAIL H-3 [pdp] plan 2 y variante L solo con plan 3; agotada sin plan :: {"L":{"id":["103"],"sp":["3",""]},"XL":{"id":["104"],"sp":[""]},"btn":{"disabled":true,"notice":false,"checkoutHidden":true}}
FAIL H-4 [pdp] caso C: ?selling_plan=1 y luego compra unica (JS) :: {"carga":["1","1"],"tras":["1"],"id":["101"]}
FAIL H-5 [pdp] requires_selling_plan (JS) :: {"r1":["1","1"],"r2":["2","1"],"M":{"id":["202"],"sp":["1"]},"btn":{"disabled":true,"notice":true,"checkoutHidden":true}}
FAIL H-7 [pdp] sin JS p1: elegir 102 en el select :: {"post_id":["101"],"html":"no-js","selectDisplay":"sin select","pickerDisplay":"block","hiddenDisabled":false}
FAIL H-7 [pdp] sin JS p8: elegir 804 en el select :: {"post_id":["801"],"html":"no-js","selectDisplay":"sin select","pickerDisplay":"block","hiddenDisabled":false}
FAIL H-8 [pdp] theme.js 404 :: {"html":"js","selectDisplay":"sin select","post_id":["801"]}
FAIL H-18b [pdp] theme.js throw :: {"html":"js","selectDisplay":"sin select","post_id":["801"]}
FAIL H-18c [pdp] theme.js tardio (tras DOMContentLoaded): vuelve a js y el comprador elige variante :: {"html":"js","picker":"block","nativeSelectVisible":true,"hiddenIdEnabled":true,"id":["102"]}
FAIL H-11 [pdp] EXCEPCION :: "Cannot read properties of undefined (reading 'd')"
FAIL H-13 [pdp] EXCEPCION :: "page.evaluate: TypeError: Cannot read properties of null (reading 'closest')"
FAIL H-13b [pdp] p9 300 variantes, ?variant=9260 fuera de las 250 :: {"opciones":0,"post_id":["9260"]}
FAIL H-14 [pdp] EXCEPCION :: "page.evaluate: TypeError: Cannot read properties of null (reading 'textContent')"
FAIL H-15 [pdp] EXCEPCION :: "page.evaluate: TypeError: Cannot read properties of null (reading 'disabled')"
FAIL H-16 [pdp] JS toma el control (name retirado, desactivados) :: {"native":[],"hiddenEnabled":true,"namedId":"HTMLInputElement","namedIdIsHidden":true,"namedIdValue":"102","namedSp":"RadioNodeList","namedSpIsHidden":false,"namedSpValue":"","qsIsHidden":true ...
FAIL H-1 [featured] compra unica (JS) :: {"id":["101"],"sp":[""]}
FAIL H-2 [featured] plan 1 -> plan 2 -> compra unica (JS) :: [{"id":["101"],"sp":["1",""]},{"id":["101"],"sp":["2",""]},{"id":["101"],"sp":[""]}]
FAIL H-3 [featured] plan 2 y variante L solo con plan 3; agotada sin plan :: {"L":{"id":["103"],"sp":["3",""]},"XL":{"id":["104"],"sp":[""]},"btn":{"disabled":true,"notice":false,"checkoutHidden":true}}
FAIL H-4 [featured] caso C: ?selling_plan=1 y luego compra unica (JS) :: {"carga":["1","1"],"tras":["1"],"id":["101"]}
FAIL H-5 [featured] requires_selling_plan (JS) :: {"r1":["1","1"],"r2":["2","1"],"M":{"id":["202"],"sp":["1"]},"btn":{"disabled":true,"notice":true,"checkoutHidden":true}}
FAIL H-7 [featured] sin JS p1: elegir 102 en el select :: {"post_id":["101"],"html":"no-js","selectDisplay":"sin select","pickerDisplay":"block","hiddenDisabled":false}
FAIL H-7 [featured] sin JS p8: elegir 804 en el select :: {"post_id":["801"],"html":"no-js","selectDisplay":"sin select","pickerDisplay":"block","hiddenDisabled":false}
FAIL H-8 [featured] theme.js 404 :: {"html":"js","selectDisplay":"sin select","post_id":["801"]}
FAIL H-18b [featured] theme.js throw :: {"html":"js","selectDisplay":"sin select","post_id":["801"]}
FAIL H-18c [featured] theme.js tardio (tras DOMContentLoaded): vuelve a js y el comprador elige variante :: {"html":"js","picker":"block","nativeSelectVisible":true,"hiddenIdEnabled":true,"id":["102"]}
FAIL H-11 [featured] EXCEPCION :: "Cannot read properties of undefined (reading 'd')"
FAIL H-13 [featured] EXCEPCION :: "page.evaluate: TypeError: Cannot read properties of null (reading 'closest')"
FAIL H-13b [featured] p9 300 variantes, ?variant=9260 fuera de las 250 :: {"opciones":0,"post_id":["9260"]}
FAIL H-14 [featured] EXCEPCION :: "page.evaluate: TypeError: Cannot read properties of null (reading 'textContent')"
FAIL H-15 [featured] EXCEPCION :: "page.evaluate: TypeError: Cannot read properties of null (reading 'disabled')"
FAIL H-16 [featured] JS toma el control (name retirado, desactivados) :: {"native":[],"hiddenEnabled":true,"namedId":"HTMLInputElement","namedIdIsHidden":true,"namedIdValue":"102","namedSp":"RadioNodeList","namedSpIsHidden":false,"namedSpValue":"","qsIsHidden" ...

MODO=base total=52 pass=20 fail=32
H-17 (la base reproduce los fallos de H-1, H-2, H-4, H-7 y H-8 en las dos superficies): PASS
```

(En la base, H-6, H-12, H-18a, H-19 a H-22 y H-9 pasan porque no dependen del cambio. H-7 y H-8 usan los radios visibles al no existir el select: «se ve B, se envia A». H-18c es un caso de CM-1 y solo tiene sentido con S-5.)

# 5. Matriz A-01 y B-02: antes (base `c81cbcb`) y despues (sintetico)

`getAll` de `FormData` con JS; payload del POST nativo sin JS o con `theme.js` caido. Identico en PDP y producto destacado.

| Caso (H) | Antes (base) | Despues | Veredicto |
| --- | --- | --- | --- |
| H-1 compra unica con planes (JS) | `selling_plan = [""]` | `[]`; `id = [101]` | corregido |
| H-2 plan 1, plan 2, compra unica | `["1",""]`, `["2",""]`, `[""]` | `["1"]`, `["2"]`, `[]` | corregido |
| H-3 plan 2 y variante L (solo plan 3); agotada | `["3",""]`; agotada `[""]` | `["3"]`; agotada `[]` y boton desactivado | corregido |
| H-4 caso C (`?selling_plan=1` y luego compra unica) | carga `["1","1"]`; tras compra unica `["1"]` | carga `["1"]`; tras compra unica `[]` | corregido |
| H-5 `requires_selling_plan` | `["1","1"]`, `["2","1"]`, variante sin asignaciones `["1"]` | `["1"]`, `["2"]`, `[]`; boton `disabled`, aviso visible, pago acelerado oculto | corregido |
| H-6 p3 sin grupos (JS y sin JS) | boton `disabled` y aviso | igual | sin cambio (OK) |
| H-7 sin JS: cargar A, elegir B | `id = [101]` (B marcada) | `id = [102]` (p1) y `[804]` (p8); radios `display:none`, select visible | corregido |
| H-8 `theme.js` 404 | `<html class="js">`, `id` de A | `<html class="no-js">`, select visible, `id = [804]` | corregido (S-5) |
| H-18 lento 1,5 s / error de sintaxis / tardio | n/a | lento: `js`, controles tomados; sintaxis: `no-js`, `id = [804]`; tardio (CM-1, `theme.js` 300 ms despues de DOMContentLoaded): vuelve a `js`, picker visible, select nativo oculto y desactivado, `id = [102]` | OK |
| H-9 `?variant=102` PDP (JS y sin JS) | `[102]` | `[102]` | sin cambio (OK) |
| H-10 sin JS: URL con plan 1 y compra unica | `selling_plan = [""]` | `[""]` y `id` unico (limite 4.3.2) | OK con limite |
| H-11 sin JS: agotadas | no hay select | `disabled` salvo la seleccionada, sufijo `Sold out` | nuevo, OK |
| H-12 p4 solo variante por defecto | un `name="id"` | un `name="id"`, sin select; POST `[401]` | sin cambio (OK) |
| H-13 p5 / p6 (40 / 250) | n/a | 40 / 250 opciones (bloque del select: 2209 / 12859 bytes en PDP, 2221 / 12871 en el destacado); H-1, H-2 y H-7 siguen OK | OK; peso informado |
| H-13b p9, 300 variantes, `?variant=9260` | n/a | 251 opciones; sin tocar, POST `[9260]` (C-1) | OK |
| H-14 p7 titulo de 120 caracteres | n/a | opcion de 138 caracteres con el precio largo; POST `[702]` | OK |
| H-15 p8 combinacion agotada | n/a | opcion Red/M `disabled` con sufijo; POST por defecto `[801]`; con JS, boton `disabled` | OK |
| H-16 acceso por nombre con JS | `namedItem('selling_plan')` es `RadioNodeList`, valor `""` | `namedItem('id')` y `namedItem('selling_plan')` son un unico `HTMLInputElement` (el hidden); `querySelector('[name="id"]')` es el hidden; `[data-no-js-control]` desactivados y sin `name`; `pickup-availability` intacto; `handOffFocus` filtra `!element.disabled` | corregido (C-2) |
| H-19 sin bloque `variant_picker` | un `id` | un `id`, sin select | OK |
| H-20 JSON de variantes roto | un valor por nombre | un valor por nombre (estado del servidor) | OK (limite 4.3.1) |
| H-21 destacado sin producto | sin formulario | sin formulario ni errores | OK |
| H-22 dos destacados en la pagina | n/a | ids unicos | OK |
| H-23 ocurrencias Liquid real frente a HTML | n/a | coinciden (PDP y destacado) | OK |

# 6. Filas del ledger (propuesta; NO se edita el ledger)

| Fila | Propuesta | Evidencia nueva (`archivo:linea`, prueba) | Vuelve a `cumplido` |
| --- | --- | --- | --- |
| 69 Selector de Variantes y Swatches Nativos (`docs/requirements-ledger.md:69`) | `cumplido` a `codigo completo` (PD-3) | `sections/main-product.liquid:26-37,229,489-493`; `sections/featured-product.liquid:7-12,121,232-236`; `snippets/variant-no-js-select.liquid:1-58`; `assets/theme.js:573,629-641`; `layout/theme.liquid:100-114`; harness H-7, H-8, H-9, H-11, H-13, H-13b, H-14, H-15, H-18 | R-A/R-B en tienda con credenciales (D22) y el catalogo multivariante existente; SIN fixture |
| 71 Planes de Venta / Suscripciones (`:71`) | `cumplido` a `codigo completo` | `sections/main-product.liquid:593`; `sections/featured-product.liquid:335`; `assets/theme.js:573,629-641`; harness H-1 a H-6, H-10, H-16. Los localizadores antiguos (`main-product.liquid:129-166`, `theme.js:733-742`) estan obsoletos y se corrigen al actualizar | R-A con el fixture C-R0-4 y credenciales (C-6) |
| 66 Checkout Acelerado | sin cambio | solo regresion (R-4) | n/a |

Cabecera del ledger: pasaria de 54 `cumplido` / 6 `codigo completo` a 52 / 8; la recalcula quien actualice con `node scripts/ledger-verify.mjs`.

# 7. Desviaciones y decisiones aplicadas

## 7.1 Desviaciones

- **D-1 (NIVEL 2, autorizado por Johandry (D25, 2026-11-04, CLAUDE-DECISION-A-01-B-02-001); CM-2).** Es un archivo fuera de la lista permitida (RULES 3.5) y la R-D 5.1 excluia snippets. Motivo: con el select nativo de variantes pegado dentro de `main-product.liquid`, Theme Check emite `[warning]: LiquidComplexity ... Liquid complexity is 128, which exceeds the maximum of 120` (linea 844). La base suma 116 y el select necesita unas 10 decisiones. Se movio a `snippets/variant-no-js-select.liquid`, patron unico para las dos superficies (compuerta 3). Con eso: `93 files inspected with no offenses found`. No toca schema, settings, ids, defaults, CSS ni locales, y reutiliza `products.product.choose_options` y `products.product.sold_out`.
  - **Alternativa (pegar el select en las dos secciones, sin snippet):** `main-product.liquid` queda en 128 de LiquidComplexity con 1 aviso `warning`, que NO falla con `--fail-level error` pero incumple «0 ofensas»; `featured-product.liquid` no supera el limite. Duplica ~40 lineas en dos archivos.
  - La ubicacion NO se cambia hasta que Johandry decida. El coordinador no debe hacer commit con el snippet sin esa autorizacion.
- **D-2.** `rg -c 'name="id"'` y `rg -c 'data-no-js-control'` salen 1 y 1 en cada seccion (mas 1 en el snippet) y no 2 y 2, por D-1. La cobertura equivalente esta en 3 y en H-23.
- **D-3.** S-5 usa `classList.remove('js')` y `classList.add('no-js')` en lugar de `replace` (misma semantica, sin depender de `classList.replace`).
- **CM-1 (P2-1).** Dentro de la rama de fallback de S-5 se anade `customElements.whenDefined('variant-selects')`, que quita `no-js` y anade `js` si `theme.js` se define despues de `DOMContentLoaded`. H-18c lo prueba en las dos superficies.
- **D-4.** Las dos secciones calculan `render_variant_no_js` en su bloque `liquid` inicial y comprueban el bloque `variant_picker` con `section.blocks | where`, tal como la directiva; en el destacado ademas exige `featured_product != blank`.

## 7.2 Decisiones PD y cambios C (segun `CLAUDE-REVIEW-A-01-B-02-RD-001`)

| ID | Decision de la R-D | Aplicacion |
| --- | --- | --- |
| PD-1 | SI: S-5 entra | `layout/theme.liquid:100-114`; H-8 y H-18 |
| PD-2 | NO: no se eliminan los `purchase-option-*` | Sin cambio. **Residuo abierto para R-A**: los radios JS siguen dentro del `<form>` y se envian (`purchase-option-<id>`; en el destacado `featured-purchase-option-<id>`), no son `selling_plan`. R-A debe confirmar con el payload real que Shopify los ignora |
| PD-3 | SI: filas 69 y 71 a `codigo completo` | Seccion 6 |
| PD-4 | La lectura es correcta: D19 (c) bloquea el CIERRE de A-01, no su codigo | **A-01: codigo completo; cierre en espera de C-R0-4 (Johandry).** Registrar tambien en `CLAUDE-CLOUD-STATUS.md` (lo hace el coordinador) |
| PD-5 | SI: opciones agotadas `disabled`, salvo la seleccionada | H-11, H-15 |
| PD-6 | Reutilizar `products.product.choose_options` | Sin claves nuevas; `locale-key-inventory` OK |
| C-1 | Opcion de `selected_variant` siempre presente y `selected` | `snippets/variant-no-js-select.liquid:46-57`; H-13b |
| C-2 | Retirar `name` y desactivar | `assets/theme.js:636-639`; H-16 |
| C-3 | No sobredimensionar `dataset-hooks` | Seccion 3 |
| C-4 | Arbol limpio y `HEAD_INICIO` | Secciones 1 y 2 |
| C-5 | S-5 y H-8, H-18 | Secciones 4 y 5 |
| C-6 | Dependencias separadas | Seccion 8 |
| C-7 | Fidelidad del harness | Seccion 4 |
| C-8 | PD, lectura PD-4 y residuo PD-2 | Esta seccion |
| O-1 | Opcional: desactivar variantes con `requires_selling_plan` sin asignaciones | NO aplicada (no bloquea; la combinacion se rechaza con el boton y el aviso con JS). Se propone para R-A si Shopify no crea la linea sin JS |
| O-2 | Orden de foco sin JS | Limite conocido: cantidad, variante, plan, boton (la R-D lo midio con Tab) |

# 8. Pendiente para R-A en tienda (NO se declara nada cumplido con el harness)

Pendiente de credenciales (D22), con el catalogo multivariante existente y SIN fixture (B-02):

1. B-02 en tienda: cargar A y elegir B sin JS; `?variant=` disponible y agotada; producto multiopcion con combinacion agotada; con `theme.js` bloqueado.
2. `?variant=` en la pagina del producto destacado (comportamiento real de Liquid: no verificado).
3. Movil simulado con viewport verificado para B-02.
4. Recarga del formulario en Firefox con JS (persistencia de `disabled` por la restauracion de formularios): no verificado.
5. Buy it now (`form | payment_button`) tras cambiar de VARIANTE con JS: compra la variante visible (R-4). Solo credenciales; no necesita fixture (CM-4).

Pendiente de fixture (C-R0-4, Johandry) y credenciales (D22) (A-01):

6. Matriz A-01 completa en PDP y producto destacado, con JS, sin JS y con JS fallido, sobre un producto con compra unica y planes opcionales y otro con `requires_selling_plan`, con al menos dos planes. Incluye el payload de red real y, solo con autorizacion de mutacion de carrito, la linea resultante.
7. Interpretacion de Shopify de `selling_plan=` vacio sin JS (limite 4.3.2) y de una combinacion variante/plan invalida sin JS (4.3.3).
8. Buy it now (`form | payment_button`) tras cambiar de PLAN con JS: compra el plan visible (R-4). Fixture y credenciales.
9. Producto destacado en la home con `?selling_plan=` en la URL.
10. Que Shopify ignore los parametros residuales `purchase-option-*` (PD-2).
11. Movil simulado para A-01.

# 9. Limites de la directiva 4.3 (confirmados o corregidos)

1. JS fallido parcial: S-5 cubre `theme.js` caido o con error antes de definir `variant-selects` (H-8, H-18). Sigue abierto el caso de que `variant-selects` quede definido y `connectedCallback` lance antes de `takeOverNativeControls()`: la llamada es la primera linea tras la guarda, asi que solo falla ante un JSON de variantes ilegible (H-20: un unico valor por nombre, el del servidor). Confirmado.
2. Sin JS, la compra unica viaja como `selling_plan=` vacio (H-10). Confirmado, pendiente de R-A.
3. Sin JS, el select de planes lista las asignaciones de la variante pintada por el servidor y no se refiltra. Confirmado.
4. Sin JS, entrar por `?variant=` agotada deja el boton desactivado. Confirmado (H-11 muestra la seleccionada agotada).
5. CORREGIDO (C-1): sin JS son alcanzables las 250 primeras variantes mas la seleccionada (H-13b: 251 opciones).

# 10. Compuertas AGENTS.md y afirmaciones falsables

| Compuerta | Resultado |
| --- | --- |
| 1 Requisitos | Filas 69 y 71 (seccion 6) con `archivo:linea` y prueba de harness. Ledger sin editar |
| 2 Estados degenerados | Vacio: destacado sin producto (H-21), JSON roto (H-20). Uno: p4 (H-12). Muchos: p5, p6, p9 (H-13, H-13b). Muy largo: p7 (H-14). Faltante: variante sin asignaciones y p3 (H-5, H-6), sin bloque picker (H-19), combinacion agotada (H-15) |
| 3 Consistencia | Un unico snippet para las dos superficies; precio con `money | strip_html` como `data-money-format` y el select de planes; sin `Intl`; claves de locale existentes |
| 4 Superficie del comerciante | Sin settings, labels ni schemas nuevos; `locale-key-inventory` OK |
| 5 Tienda real | NO ejecutable (D22, sin credenciales; C-R0-4). Estado maximo: codigo completo |

Afirmaciones falsables:

1. `node --check assets/theme.js` sale con codigo 0 y `npx --no-install shopify theme check --path .` da `93 files inspected with no offenses found.`
2. `harness.mjs . fix` da `MODO=fix total=56 pass=56 fail=0` y `harness.mjs . base c81cbcb` da `H-17 ... PASS` con 32 fallos.
3. Con JS, `form.elements.namedItem('id')` y `namedItem('selling_plan')` son un unico `HTMLInputElement` (H-16, ambas superficies).
4. Con `theme.js` en 404 o con error de sintaxis, `<html>` termina en `no-js` y el POST envia la variante elegida; con `theme.js` a 1,5 s se queda en `js`; con `theme.js` tardio vuelve a `js` (H-8, H-18).
5. Con 300 variantes y `?variant=` fuera de las 250, sin tocar, el POST envia la variante pintada (H-13b).
6. `git status --short -- . ':!agent-comms'` solo muestra los cuatro archivos de la lista mas `snippets/variant-no-js-select.liquid`.
7. `scripts/dataset-hooks.mjs` no cubre `data-no-js-control` (C-3).
8. Sin `.secrets`, sin tiendas, sin gate5, sin metafields, sin credenciales ni valores de entorno; sin commit ni push.

# 11. Compuerta del literal (CM-4; salida literal)

```text
$ python3 -I <scratchpad>/count-two.py <archivos de la tarea>
assets/theme.js=0
layout/theme.liquid=0
sections/main-product.liquid=0
sections/featured-product.liquid=0
snippets/variant-no-js-select.liquid=0
agent-comms/outbox-claude/harness-A-01-B-02-001/harness.mjs=0
agent-comms/outbox-claude/harness-A-01-B-02-001/salida-base.txt=0
agent-comms/outbox-claude/harness-A-01-B-02-001/salida-fix.txt=0
agent-comms/outbox-claude/CLAUDE-REPORT-A-01-B-02-001.md=0
$ python3 -I <scratchpad>/ctx-check.py
./tests/vendor/axe.min.js lineas_literal_contexto= 1
total_lineas_literal_contexto= 1
fuera_de_tests_vendor_axe= 0
```
