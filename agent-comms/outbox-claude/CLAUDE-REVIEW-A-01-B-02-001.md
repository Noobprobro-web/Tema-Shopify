# CLAUDE-REVIEW-A-01-B-02-001: revisión de la tarea de código A-01/B-02 (D11)

```text
ID: CLAUDE-REVIEW-A-01-B-02-001
Estado: Entregado. Veredicto: ACEPTADO CON CAMBIOS MENORES (CM-1 a CM-4, §8), y con D-1 bloqueada:
  D-1 ES NIVEL 2 Y REQUIERE AUTORIZACIÓN DE JOHANDRY (D10/D11) antes del commit (§6).
Decisión requerida: Johandry: autorizar o no el snippet nuevo `snippets/variant-no-js-select.liquid`
  (D-1, fuera de la lista cerrada de la R-D). Propuesta: autorizarlo (§6.4). Coordinador Claude: aplicar
  CM-1 a CM-4 y pedir esa autorización; no hacer commit con el snippet sin ella. Sin nueva revisión
  completa: basta con repetir los dos harness y Theme Check tras CM-1.
Resumen en 5 líneas:
  1. El diff cumple la directiva y C-1 a C-8 de la R-D. Un único control exitoso por nombre en cada modo,
     verificado en Chromium: 54/54 del harness del implementador (repetido, salida idéntica) y 30 fallos en la base.
  2. Casos propios R-1 a R-6: PDP + destacado en la misma página, variante única, requires_selling_plan con
     cambio de variante, teclado sin JS e idempotencia. Pasan, salvo R-5. Control negativo en la base: 7 de 8 fallan.
  3. P2-1 nuevo (introducido por S-5): si theme.js llega DESPUÉS de DOMContentLoaded (apps de «retrasar JS»), la
     página queda en no-js con el select nativo desactivado. El comprador no puede elegir variante. Arreglo de
     1 sentencia en layout/theme.liquid (whenDefined), probado en memoria: 54/54 y R-5 PASS.
  4. D-1: RULES §3.5 la define como Nivel 2 («modifica archivos fuera de la lista permitida»); el informe la
     declara Nivel 1. LiquidComplexity es un warning y main-product está hoy en 120/120. No hay alternativa equivalente dentro de la lista.
  5. Compuertas estáticas en verde: node --check, Theme Check 93 files sin ofensas, sanity, locales, hooks y JSON.
     Literal 0. Hallazgo extra: C-08 sobre esta base sube main-product a 122 (aviso).
Archivos tocados: solo este archivo (nuevo). Scratch: /tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rev-a01/
  (harness-impl.mjs, harness-impl-wd.mjs, rev-harness.mjs, rep-*.txt, rev-*.txt, tc/, count-rev.py). Sin git de
  escritura, sin red, sin tiendas, sin .secrets, sin gate5, sin metafields, sin valores de entorno.
Desviaciones (Nivel 1 o Nivel 2): ninguna en esta revisión. En la tarea revisada, D-1 es Nivel 2 (§6).
Hallazgos extra fuera de alcance (con parche listo): HX-1. C-08 (borrador) añade 2 decisiones a
  main-product.liquid: 120 → 122, con un aviso LiquidComplexity (§7). Sin parche: lo decide la R-D/el turno de C-08.
Verificación (comando, resultado y qué demuestra/qué no): §3 a §5. ESTÁTICA y SINTÉTICA (Chromium local de
  Playwright 1.63.0, HTML traducido a mano y theme.js real). No demuestra cómo interpreta Shopify el payload,
  Buy it now, apps de terceros reales ni nada en tienda.
Lista de afirmaciones falsables numeradas: §10.
```

# 1. Identidad de lo revisado

- `date -u +%FT%TZ` → `2026-11-04T20:19:49Z`.
- `git branch --show-current` → `lote-a`; `git rev-parse HEAD` → `c81cbcb2205d9cca2ff73252c583fa058772c4de`.
- `git status --short`: ` M assets/theme.js`, ` M layout/theme.liquid`, ` M sections/featured-product.liquid`, ` M sections/main-product.liquid`, `?? snippets/variant-no-js-select.liquid`, más documentos sin seguimiento en `agent-comms/outbox-claude/`. Esos documentos son la directiva A-01/B-02, la directiva C-08, la R-D, el informe y el harness.
- `git diff HEAD --stat` (4 archivos): `4 files changed, 54 insertions(+), 6 deletions(-)`.
- `sha256sum` (prefijo 16), idéntico al §1 del informe: `theme.js 518c04deeeb93a4a`, `main-product.liquid 7e3a413d938a4752`, `featured-product.liquid 3b4989deac1e5e57`, `layout/theme.liquid 25651c3ab0e9cd0e`, `variant-no-js-select.liquid 91617bcb04dac1a2`.
- Observación: la directiva (`CLAUDE-DIRECTIVA-A-01-B-02-001.md`) no lleva C-1 a C-8 incorporados en su texto (sigue en «Borrador para R-D»). El implementador los aplicó leyendo la R-D. El resultado es el mismo, pero el coordinador debe dejar constancia de que la directiva vigente es «directiva + R-D».

# 2. Diff frente a directiva y R-D (punto 1 del encargo)

## 2.1 Conformidad por cambio

| Exigencia | Código | Veredicto |
| --- | --- | --- |
| S-1a `render_variant_no_js` (variantes reales y bloque `variant_picker`) | `main-product.liquid:33-37` | Conforme |
| S-1b `js-only` en el picker | `main-product.liquid:229` | Conforme; `{{ block.shopify_attributes }}` intacto |
| S-1c hidden `disabled` condicional, primer `name="id"` del form | `main-product.liquid:489`; render en `:491-493` | Conforme |
| S-2 equivalentes en el destacado, exige `featured_product != blank` | `featured-product.liquid:8-12,121,232,234-236` | Conforme (`product` = `featured_product`, `:3`) |
| S-3 `autocomplete="off" data-no-js-control` en el select de planes | `main-product.liquid:593`, `featured-product.liquid:335` | Conforme; opciones, `id` y `name` sin cambios |
| S-4a método, `input[data-variant-id]` (evita `pickup-availability`) | `theme.js:629-641` | Conforme |
| S-4b llamada tras la guarda y antes de todo lo demás | `theme.js:573` | Conforme |
| S-4c/d sin tocar `updatePurchaseOptions`, `updateForms`, `CartDrawer`, `StickyCartBar`; sin `Intl` | `git diff` solo añade 14 líneas en esos dos puntos | Conforme |
| S-5 (PD-1) un único listener tras las dos líneas de la clase | `layout/theme.liquid:100-107` | Conforme, con el defecto P2-1 (§4.3) |
| C-1 opción de la variante seleccionada siempre presente y `selected` | `variant-no-js-select.liquid:17,25-27,46-56` | Conforme (H-13b: 251 opciones, POST 9260) |
| C-2 `removeAttribute('name')` | `theme.js:636-639` | Conforme (H-16, R-1a, R-6) |
| C-3 alcance de `dataset-hooks` | informe §3 | Conforme |
| C-4 árbol limpio y `HEAD_INICIO` | informe §1-2 | Conforme |
| C-5 H-8 y H-18 | harness | Conforme |
| C-6 dependencias separadas | informe §8 | Conforme, con un matiz (P3-4) |
| C-7 fidelidad del harness | harness | Conforme (§3.2) |
| C-8 PD, lectura PD-4, residuo PD-2 | informe §7.2 | Conforme |
| PD-5 agotadas `disabled` salvo la seleccionada | snippet `:31` | Conforme |
| PD-6 `products.product.choose_options` | snippet `:21` | Conforme; la clave existe en `en.default.json` («Choose options») y `es.json` («Elegir opciones»), igual que `sold_out` |
| Lista cerrada (R-D §5.1) | snippet nuevo fuera de la lista | **Desviación D-1: Nivel 2 (§6)** |

## 2.2 `takeOverNativeControls()`

- **Orden.** Se llama justo tras `if (this.variantData.length === 0) return;` (`theme.js:571-573`). `getInitialVariant` (`:623-627`) lee después el primer `[data-variant-id]`, que es el hidden, porque `pickup-availability` va detrás del `</form>` (`main-product.liquid:662`). Un `disabled` no impide leer `.value`. `updateForms` (`:849-855`) recorre `[data-variant-id]`, lo que no incluye el select nativo (no lleva ese atributo).
- **Idempotencia.** Desconectar y volver a conectar `variant-selects` vuelve a ejecutar `connectedCallback`. El estado sigue correcto: R-6 da `id ["102"]`, `sp ["1"]`, `namedItem('id')` es `HTMLInputElement` y los nativos no tienen `name`, sin errores.
- **Varios formularios.** Las consultas se limitan a `this`. R-1a (PDP y destacado del mismo producto en una página): cada formulario conserva su `id`/`selling_plan`, al cambiar el destacado no cambia la PDP y no hay `id` duplicados. R-1b: sin JS, cada POST lleva su propio `id`. H-22: dos destacados.
- **Otros consumidores del `id`.** `rg` sobre `assets/*.js` solo encuentra `theme.js:624` (`getInitialVariant`), `:850` (`updateForms`), `:1256` (`namedItem('quantity')`, sin relación) y `:2602` (`formData.get('id')` en `CartDrawer`, ahora con un solo valor). Compra rápida (`product-card.liquid:314,400`, `data-quick-buy-id`) y recomendaciones del cajón usan formularios propios sin `variant-selects`. `<variant-selects` solo se monta en las dos secciones. `StickyCartBar.handOffFocus` filtra `!element.disabled` (`theme.js:1340-1346`).
- **Límite residual (no defecto).** Antes de que `theme.js` (diferido) conecte el componente, el formulario tiene dos `name="id"`, y el activo es el select. Un script asíncrono de Shopify (`payment_terms` / `payment_button`) que lea `form.elements.namedItem('id')` en ese intervalo vería una `RadioNodeList`. El primer `[name="id"]` en el DOM es el hidden, con el valor correcto. No es verificable sin tienda: queda en R-A (Buy it now, §5.4.4).

## 2.3 Select nativo

- Precio con `money | strip_html` (como `data-money-format` y el select de planes); sin `Intl`.
- `variant.title | escape`; sufijo `sold_out`.
- `<label for>` asociado: R-4 lee `select.labels[0]` = `Choose options`.
- C-1 y el texto de la opción extra siguen el mismo formato.
- Variante única con opción real (`One size`): 1 opción `selected`, POST `1001` sin JS y `id ["1001"]` con JS (R-2).
- Teclado sin JS (R-4): el orden de foco es `SELECT:id → BUTTON:add`, la flecha abajo salta la agotada (801 → 803, 802 `disabled`) y Enter envía `id ["803"]`.
- `requires_selling_plan` sin JS (R-3b): elegir M (solo plan 2) envía `selling_plan ["1"]`, el plan de S pintado por el servidor. Es el límite 4.3.3 ya documentado y O-1 no se aplicó (opcional). Lo mide R-A.

## 2.4 Con JS no se rompe nada

H-1 a H-5, H-9a, H-12b, H-13 (JS), H-15 (JS), H-16, H-18a y R-1a, R-3a, R-6 pasan. R-3a: S `["1"]` → M `["2"]` (solo el plan de M) → L `[]` con botón `disabled` y aviso → S `["2"]`.

# 3. Harness (punto 2 del encargo)

## 3.1 Repetición del harness del implementador

```text
$ node harness-impl.mjs /home/user/Tema-Shopify fix   > rep-fix.txt   ; rc=0
MODO=fix total=54 pass=54 fail=0
FALLAN: []
$ node harness-impl.mjs /home/user/Tema-Shopify base c81cbcb > rep-base.txt ; rc=0
MODO=base total=50 pass=20 fail=30
H-17 (la base reproduce los fallos de H-1, H-2, H-4, H-7 y H-8 en las dos superficies): PASS
$ diff <(cut -c1-140 rep-fix.txt)  <(cut -c1-140 .../harness-A-01-B-02-001/salida-fix.txt)  && echo FIX-IDENTICA
FIX-IDENTICA
$ diff <(cut -c1-140 rep-base.txt) <(cut -c1-140 .../harness-A-01-B-02-001/salida-base.txt) && echo BASE-IDENTICA
BASE-IDENTICA
```

(`harness-impl.mjs` es una copia byte a byte del entregable, ejecutada desde el scratch.)

## 3.2 Fidelidad del HTML frente al Liquid actual

Comparé `render()` del harness (`harness.mjs:47-121`) con `main-product.liquid:1-37,226-280,484-662`, `featured-product.liquid:1-31,77-81,118-160,227-404` y el snippet completo.

- Coinciden: el orden en el DOM (hidden → select nativo → planes → botón → aviso → dinámico; `pickup-availability` tras el `</form>`), las clases `js-only`/`no-js-only`, los `disabled`/`selected`, los `name` por superficie (`options[...]` / `featured-options-<id>[...]`, `purchase-option-` / `featured-purchase-option-`), el tope de 250 y la opción extra de C-1.
- El script en línea se EXTRAE de `layout/theme.liquid` (`harness.mjs:24-28`), no se reescribe.
- H-23 compara recuentos de atributos entre el Liquid real y el HTML.
- Divergencias sin efecto en el resultado:
  - la disponibilidad por valor del picker se aproxima («algún variante disponible con ese valor»), mientras que Shopify usa `value.available`, que depende de la selección;
  - faltan el campo de cantidad con `form=` (`main-product.liquid:437`), `payment_terms` y `payment_button`.
- Ninguna afecta a los nombres exitosos del formulario.

## 3.3 Casos propios (`rev-harness.mjs`, traducción independiente hecha por el revisor)

```text
$ node rev-harness.mjs /home/user/Tema-Shopify fix
PASS R-1a PDP + destacado en la misma pagina (JS): cada formulario aislado :: carga [101,[]] [101,[]]; tras cambiar el destacado [101,[]] [102,["1"]]; ids duplicados []; named [HTMLInputElement, HTMLInputElement]
PASS R-1b PDP + destacado sin JS: cada POST con su propio id :: {"destacado":["102"],"pdp":["101"]}
PASS R-2 variante unica (One size): select de 1 opcion sin JS; un id con JS :: {"opciones":[{"v":"1001","s":true,"t":"One size / €50,00 EUR"}],"sinJS":["1001"],"conJS":["1001"]}
PASS R-3a requires_selling_plan JS: S[1] -> M[solo 2] -> L[sin planes] -> S :: S sp ["1"]; M id ["202"] sp ["2"]; L sp [] btn disabled + aviso; S2 sp ["2"]
PASS R-3b requires_selling_plan SIN JS: elegir M (solo plan 2) envia el plan 1 de S (limite 4.3.3, informativo) :: {"post":{"id":["202"],"selling_plan":["1"]}}
PASS R-4 teclado sin JS: foco, flecha salta la agotada, Enter envia lo elegido; label asociado :: {"orden":["SELECT:id","BUTTON:add","BODY:null"],"valorTrasFlecha":"803","post":["803"],"label":"Choose options"}
FAIL R-5 theme.js tardio (tras DOMContentLoaded): el comprador puede elegir variante :: {"html":"no-js","picker":"none","nativeSelectVisible":true,"nativeSelectDisabled":true}
PASS R-6 reconexion de variant-selects: sigue un unico control por nombre :: {"fd":{"id":["102"],"sp":["1"]},"named":"HTMLInputElement","nativeNames":[null,null],"errores":[]}
MODO=fix total=8 pass=7 fail=1
```

(Salidas resumidas solo en las líneas R-1a y R-3a; las completas están en `rev-fix.txt`.)

**Control negativo (base `c81cbcb`, mismo harness):** `MODO=base total=8 pass=1 fail=7`.

- R-1a: `sp [""]` y `["1",""]`.
- R-2: sin select; R-3a: `["1","1"]`, `["2","1"]` y, con L, `["1"]`.
- R-6: `sp ["1","1"]`.
- R-1b, R-3b y R-4: no hay select nativo.
- R-5 pasa en la base: sin S-5 la página sigue en `js` y el picker funciona cuando llega `theme.js`. **Por eso R-5 es una regresión introducida por S-5 (P2-1).**

**Con el arreglo propuesto CM-1 aplicado en memoria (`fixwd`):**

```text
$ node rev-harness.mjs /home/user/Tema-Shopify fixwd
PASS R-5 theme.js tardio (tras DOMContentLoaded): el comprador puede elegir variante :: {"html":"js","picker":"block","nativeSelectVisible":false,"nativeSelectDisabled":true}
MODO=fixwd total=8 pass=8 fail=0
$ WD=1 node harness-impl-wd.mjs /home/user/Tema-Shopify fix
MODO=fix total=54 pass=54 fail=0
PASS H-8 [pdp] theme.js 404 :: {"html":"no-js","selectDisplay":"block","post_id":["804"]}
PASS H-18b [pdp] theme.js throw :: {"html":"no-js","selectDisplay":"block","post_id":["804"]}
PASS H-18a [pdp] theme.js lento (1,5 s): sin vuelta falsa a no-js :: {"html":"js","hiddenDisabled":false,"native":[true,true]}
(idénticas en [featured])
```

# 4. Compuertas estáticas (punto 3 del encargo)

```text
$ node --check assets/theme.js ; echo rc=$?
node-check rc=0
$ npx --no-install shopify theme check --path .
│  93 files inspected with no offenses found.                                  │
tc rc=0
$ node scripts/theme-check-sanity.mjs
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
sanity rc=0
$ node scripts/locale-key-inventory.mjs
OK: todas las referencias estaticas resuelven contra los locales.
locale rc=0
$ node scripts/dataset-hooks.mjs
  <variant-selects>            11 claves  2 montaje(s)
Contratos rotos: 0
hooks rc=0
$ node scripts/json-validate.mjs
Archivos .json comprobados: 521
Fallos de parseo:           0
json rc=0
```

`git status --short` tras `theme-check-sanity` no cambia: el sandbox restauró el árbol. `dataset-hooks` no cubre `data-no-js-control` (C-3). Esa cobertura la dan H-16, H-23 y los `rg -c` del informe.

## 4.1 Medición de LiquidComplexity

Se usó una copia del tema en `rev-a01/tc/` con `maxComplexity: 1` para que el check informe del valor de cada archivo:

```text
ACTUAL  snippets/variant-no-js-select.liquid  Liquid complexity is 9
ACTUAL  sections/featured-product.liquid      Liquid complexity is 111
ACTUAL  sections/main-product.liquid          Liquid complexity is 120
BASE    sections/featured-product.liquid      Liquid complexity is 106   (c81cbcb)
BASE    sections/main-product.liquid          Liquid complexity is 116   (c81cbcb)
INLINE  (snippet pegado en main-product, config real del repo):
        [warning]: LiquidComplexity  Liquid complexity is 128, which exceeds the maximum of 120. ...
        Consider simplifying conditional logic, or moving self-contained decision logic into snippets with the render tag.
        84 files inspected with 1 total offenses found across 1 files. 1 warnings.
        --fail-level error → rc=0
A01B02 + reemplazos R(MP,...) del Anexo de C-08:  main-product  Liquid complexity is 122
```

(84 archivos porque la copia no incluye `listings/`.) `npx shopify theme check --print` → `LiquidComplexity: enabled: true, severity: 1, maxComplexity: 120`; `--list` → `severity: warning`.

# 5. Comprobación del informe (punto 5 del encargo)

| Exigencia | Resultado |
| --- | --- |
| Cabecera RULES §1.4 completa | Sí |
| Salidas literales | Faltan dos: §3 «== sanity» está vacío (P3-2) y §11 remite al «mensaje de vuelta» en lugar de pegar `ruta=N` y `ctx-check` (P3-3) |
| Afirmaciones 1-8 de §10 del informe | Ciertas. Las comprobé: node --check, Theme Check 93/0, 54/54 y 30 fallos, H-16, H-8/H-18, H-13b, `git status` (4 + snippet), C-3, sin escrituras prohibidas (no se observó ninguna) |
| Líneas de §1.1 | Exactas (`rg -n`: `main-product:33,36,229,489,491,593`; `featured:8,11,121,232,234,335`; `theme.js:573,632`; `layout:100,103`) |
| Hashes de §1 | Idénticos (§1) |
| Solo «código completo», nada «cumplido» | Sí (Estado y §6) |
| Pruebas de tienda separadas por dependencia | Sí: B-02 solo con credenciales (puntos 1-4); A-01 con fixture C-R0-4 y credenciales (5-10). Matiz P3-4: la parte de variante de «Buy it now» (§5.4.4) no necesita fixture |
| Residuo PD-2 | Registrado como abierto para R-A (`purchase-option-<id>` / `featured-purchase-option-<id>`) en §7.2 y §8.9 |
| Clasificación de D-1 | Incorrecta: Nivel 1 en la cabecera y en §7.1; es Nivel 2 (P3-1, §6) |

# 6. Desviación D-1 (punto 4 del encargo)

## 6.1 Clasificación: NIVEL 2

- RULES §3.5 define el Nivel 2 como «modifica archivos fuera de la lista permitida», y el Nivel 1 exige no tocar «archivos fuera de alcance».
- La lista cerrada la fija la R-D (plan V4.1 §5.1). `CLAUDE-REVIEW-A-01-B-02-RD-001` §5.1 la enumera y dice: «Fuera de la lista: CSS, locales, schemas, **snippets**…».
- El plan V4.1 (`:109`) repite que los «archivos fuera de lista requiere[n] la autorización de Nivel 2».
- Que el snippet no toque settings, ids, defaults ni locales (es cierto) no lo convierte en Nivel 1. El criterio de archivo es independiente.
- El informe lo declara Nivel 1 y pide la decisión al «Coordinador». Las dos cosas están mal (P3-1).

## 6.2 Quién autoriza

- RULES §3.5 asigna la autorización de Nivel 2 a Gemini.
- D11 la delega en el revisor de contexto limpio **solo para A-02**. Este revisor no puede autorizarla.
- Además, cambiar la lista cerrada fijada por la R-D es «un cambio fuera … de las decisiones registradas» (D10), que es una condición de parada.

## 6.3 Alternativas dentro de la lista cerrada

| Alternativa | Medición | Valoración |
| --- | --- | --- |
| A. Pegar el select en las dos secciones y dejar el aviso | main-product 128 > 120: 1 `[warning] LiquidComplexity`. `--fail-level error` rc=0. El destacado quedaría en unos 119 (111 + 9 − 1, no medido) | Funciona, pero rompe el resultado esperado de la directiva (§5.2 «no offenses») y la convención de 0 ofensas del proyecto. El propio mensaje del check recomienda «moving self-contained decision logic into snippets». Severidad: warning. Que la Theme Store tolere un warning de Theme Check **no está verificado** en esta revisión (sin red). Es un último recurso, no una solución equivalente |
| B. Reducir complejidad sin quitar funciones | La base de main-product es 116: quedan 4 de margen. El select cuesta 9 (medido en el snippet); solo el bucle y su `if` ya consumen el margen | Haría falta simplificar unas 5-8 decisiones de código preexistente de main-product, ajeno a A-01/B-02. Va contra RULES §3.9 («No refactorices filas verdes») y amplía el riesgo |
| C. Recortar funciones aprobadas (C-1, PD-5, sufijo de agotado) | — | Inaceptable: C-1 y PD-5 son cambios obligatorios o decisiones de la R-D |

No hay una alternativa aceptable y equivalente dentro de la lista.

## 6.4 Dictamen

**D-1 ES NIVEL 2 Y REQUIERE AUTORIZACIÓN DE JOHANDRY (D10/D11). EL COORDINADOR NO DEBE HACER COMMIT DEL SNIPPET SIN ELLA.**

Propuesta (la mejor opción): **autorizar `snippets/variant-no-js-select.liquid` tal como está.** Motivos:

- es lo que recomienda Theme Check;
- es un único patrón para las dos superficies (compuerta 3);
- es un snippet privado, sin schema, settings, ids, defaults ni claves nuevas;
- se revierte borrando el archivo y las dos líneas `render`;
- deja Theme Check en 0 ofensas.

Si Johandry no lo autoriza: alternativa A (pegar el contenido en las dos secciones, con `id_prefix` fijo), declarar 1 warning LiquidComplexity en main-product y retirar el snippet. Es código equivalente; no hace falta repetir la R-D, pero sí repetir los harness.

# 7. Hallazgos

| ID | Sev. | Archivo:línea | Evidencia | Corrección |
| --- | --- | --- | --- | --- |
| P2-1 | P2 (nuevo, introducido por S-5; no es P0/P1) | `layout/theme.liquid:102-107` | R-5: con `theme.js` inyectado 300 ms tras `DOMContentLoaded` (lo que hacen las apps u optimizadores de «retrasar JS hasta la interacción»), el listener baja a `no-js`. Luego `theme.js` define `variant-selects`, `takeOverNativeControls` desactiva el select nativo y la página sigue en `no-js`: picker `display:none`, select visible y `disabled`. Resultado: `{"html":"no-js","picker":"none","nativeSelectVisible":true,"nativeSelectDisabled":true}`. El comprador no puede elegir variante y todo el tema queda con estilos `.no-js` con JS activo. En la base, R-5 pasa | CM-1. En la rama del fallback, tras `classList.add('no-js')`, añade `if (window.customElements) window.customElements.whenDefined('variant-selects').then(function () { document.documentElement.classList.remove('no-js'); document.documentElement.classList.add('js'); });`. Medido en memoria: R-5 PASS, 8/8 y 54/54; H-8, H-18b y H-18a sin cambios. Añadir el caso «theme.js tardío» al harness entregable. Nivel 1 (mismo archivo de la lista) |
| P3-1 | P3 | informe `:6`, `:14`, `:318` | D-1 declarada «Nivel 1», con la decisión pedida al «Coordinador» | CM-2: reclasificar como Nivel 2, con la decisión en Johandry (§6) |
| P3-2 | P3 | informe `:93` | `== sanity` sin salida (RULES §1.3) | CM-3: pegar la salida literal (§4 de esta revisión la tiene) |
| P3-3 | P3 | informe `:391-393` | Compuerta del literal y `ctx-check` sin salida literal en el archivo | CM-4: pegar las líneas `ruta=N` y `fuera_de_tests_vendor_axe=` |
| P3-4 | P3 | informe `:357` (punto 7) | «Buy it now» va entero al grupo con fixture; C-6 de la R-D solo pone ahí «la parte de plan de 5.4.4» | CM-4 (misma edición): separar «Buy it now tras cambiar variante» (solo credenciales) de «… tras cambiar plan» (fixture y credenciales) |
| HX-1 | P2 de coordinación, fuera de alcance | `sections/main-product.liquid` (complejidad 120/120) | Con los cuatro `R(MP, ...)` del Anexo de `CLAUDE-DIRECTIVA-C-08-001.md` aplicados en una copia: `Liquid complexity is 122` (1 warning) | Sin parche. La R-D o el implementador de C-08 deben contar con esto. Opciones: compensar dentro de C-08, o mover `shipping_lead_time`/`trust_badges` a un snippet con autorización de Nivel 2 |
| Obs. | — | `snippets/variant-no-js-select.liquid` | R-3b: sin JS, `requires_selling_plan` y otra variante envían el plan de la variante pintada (límite 4.3.3; O-1 no aplicada, era opcional) | Ninguna; R-A |

No hay hallazgos P0 ni P1.

# 8. Veredicto

**ACEPTADO CON CAMBIOS MENORES**, con esta lista exacta:

1. **CM-1** (P2-1): en `layout/theme.liquid`, dentro del `if` del listener S-5, añadir la recuperación con `customElements.whenDefined('variant-selects')` de §7. Añadir al harness entregable un caso «theme.js cargado tras DOMContentLoaded» y volver a generar `salida-fix.txt` y `salida-base.txt`.
2. **CM-2** (P3-1): en el informe, D-1 pasa a Nivel 2; la «Decisión requerida» pasa a Johandry.
3. **CM-3** (P3-2): salida literal de `theme-check-sanity` en el §3 del informe.
4. **CM-4** (P3-3 y P3-4): en el §11 del informe, salidas literales de la compuerta del literal y de `ctx-check`; en el §8, separar la parte de variante de «Buy it now».

Y la condición previa al commit: **AUTORIZACIÓN DE JOHANDRY PARA D-1** (§6.4). Sin ella, alternativa A.

Tras CM-1 a CM-4 no hace falta otra revisión completa: el coordinador repite los dos harness, `node --check` y Theme Check y pega las salidas. Estado máximo: A-01 «código completo» (cierre en espera de C-R0-4 y credenciales); B-02 «código completo» (cierre en espera de credenciales). Se mantiene la propuesta de bajar las filas 69 y 71 del ledger a «código completo».

# 9. Límites de esta revisión

- Todo es sintético o estático. El HTML lo traducen a mano el implementador y el revisor; Shopify no interviene.
- No verifica: cómo interpreta Shopify `selling_plan=` vacío o una combinación inválida, el comportamiento de `payment_button`/`payment_terms` con dos `name="id"` antes de que conecte el componente, Firefox (solo Chromium disponible), apps reales de retraso de JS ni la política de la Theme Store sobre warnings.

# 10. Afirmaciones falsables

1. En `lote-a` @ `c81cbcb` más los cambios sin commit, los prefijos SHA-256 son los de §1.
2. El harness entregable, repetido, da `MODO=fix total=54 pass=54 fail=0` y, en la base, `total=50 pass=20 fail=30` con H-17 PASS. Las salidas coinciden con las entregadas (los primeros 140 caracteres de cada línea).
3. `rev-harness.mjs fix` da 7/8 (falla R-5), `base` 1/8 y `fixwd` 8/8.
4. Con CM-1 en memoria, el harness entregable sigue dando 54/54.
5. LiquidComplexity: main-product 120 (actual), 116 (base), 128 (snippet pegado), 122 (actual más C-08); featured 111 / 106; snippet 9. El check es `severity: warning` con `maxComplexity: 120`.
6. `npx --no-install shopify theme check --path .` → `93 files inspected with no offenses found.`
7. `products.product.choose_options` y `products.product.sold_out` existen en `locales/en.default.json` y `locales/es.json`, los dos únicos locales de tienda.
8. `<variant-selects` solo aparece en `sections/main-product.liquid` y `sections/featured-product.liquid`.
9. La R-D `CLAUDE-REVIEW-A-01-B-02-RD-001` §5.1 excluye «snippets» de la lista cerrada.
10. Compuerta del literal sobre los archivos de la tarea y esta revisión: 0 en todos (§11).

# 11. Compuerta del literal

Se usó `python3 -I .../scratchpad/rev-a01/count-rev.py <archivos>`, copia de `count-two.py`. Deriva el literal solo en memoria desde la historia de git e imprime únicamente `ruta=N`. Desde la raíz del repositorio:

```text
sections/main-product.liquid=0
sections/featured-product.liquid=0
assets/theme.js=0
layout/theme.liquid=0
snippets/variant-no-js-select.liquid=0
agent-comms/outbox-claude/harness-A-01-B-02-001/harness.mjs=0
agent-comms/outbox-claude/harness-A-01-B-02-001/salida-base.txt=0
agent-comms/outbox-claude/harness-A-01-B-02-001/salida-fix.txt=0
agent-comms/outbox-claude/CLAUDE-REPORT-A-01-B-02-001.md=0
agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-01-B-02-001.md=0
agent-comms/outbox-claude/CLAUDE-REVIEW-A-01-B-02-RD-001.md=0
```

Este archivo, los harness del revisor y `ctx-check` (`python3 -I .../scratchpad/ctx-check.py`, desde la raíz):

```text
agent-comms/outbox-claude/CLAUDE-REVIEW-A-01-B-02-001.md=0
.../scratchpad/rev-a01/rev-harness.mjs=0
.../scratchpad/rev-a01/harness-impl-wd.mjs=0
./tests/vendor/axe.min.js lineas_literal_contexto= 1
total_lineas_literal_contexto= 1
fuera_de_tests_vendor_axe= 0
```

(Medido antes de añadir este bloque. La cifra de este archivo tras la última edición consta en el informe de vuelta.)

# 12. Re-verificación de correcciones

```text
Fecha: 2026-11-04T22:46:48Z. Rama lote-a, HEAD c81cbcb + cambios sin commit.
Veredicto final: ACEPTADO. D-1 queda AUTORIZADO POR JOHANDRY (D25, 2026-11-04), según el coordinador.
Pendientes no bloqueantes: dos retoques cosméticos del informe (§12.3).
```

## 12.1 Autorización de D-1

- Según el mensaje del coordinador, Johandry autorizó el 2026-11-04 `snippets/variant-no-js-select.liquid` tal como está (D-1, Nivel 2). Se registrará como **D25** en el commit.
- La condición de §6.4 queda satisfecha. El prefijo SHA-256 del snippet no cambia (`91617bcb04dac1a2`), así que lo autorizado es exactamente lo revisado.
- Esta revisión no ve el registro escrito de D25: el coordinador debe incluirlo en el commit, como anuncia.

## 12.2 CM-1 (`layout/theme.liquid:100-114`, prefijo SHA-256 `d642926e4b687bd2`)

**Código.** La recuperación con `whenDefined` queda DENTRO de la rama de fallback. Solo se registra si `window.customElements` existe y `variant-selects` no estaba definido en `DOMContentLoaded`. El resto de los archivos de la tarea no cambia de hash (`theme.js 518c04deeeb93a4a`, `main-product 7e3a413d938a4752`, `featured 3b4989deac1e5e57`).

**Corrección y efectos colaterales.** Probado con un registro de cada cambio de clase de `<html>` (`rev-a01/flip-check.mjs`, script en línea real y `theme.js` real):

```text
ok   ["no-js","js"] errores=0
slow ["no-js","js"] errores=0
late ["no-js","js","no-js","js"] errores=0
404  ["no-js","js","no-js"] errores=0
```

- Con JS normal o lento no hay ningún cambio extra: no hay efecto colateral.
- Con `theme.js` tardío hay una sola vuelta `no-js → js`. Es inevitable: la página no puede saber que el JS llegará.
- Con 404 se queda en `no-js`.
- `whenDefined` se registra una vez y se resuelve como mucho una vez. No hay bucles.

**Harness del implementador (copia byte a byte, repetida):**

```text
$ node harness-impl2.mjs /home/user/Tema-Shopify fix
MODO=fix total=56 pass=56 fail=0
FALLAN: []
PASS H-18c [pdp] theme.js tardio (tras DOMContentLoaded): vuelve a js y el comprador elige variante :: {"html":"js","picker":"block","nativeSelectVisible":false,"hiddenIdEnabled":true,"id":["102"]}
PASS H-18c [featured] (idéntico)
$ node harness-impl2.mjs /home/user/Tema-Shopify base c81cbcb
MODO=base total=52 pass=20 fail=32
H-17 (la base reproduce los fallos de H-1, H-2, H-4, H-7 y H-8 en las dos superficies): PASS
FIX-IDENTICA / BASE-IDENTICA (frente a salida-fix.txt y salida-base.txt entregados)
```

Observación sin efecto en el veredicto: en la base, H-18c sale FAIL por un artefacto del harness. Sin select nativo, `nativeSelectVisible` cae en `document.body` y da `true`. H-17 no depende de H-18c.

**Harness del revisor:**

```text
$ node rev-harness.mjs /home/user/Tema-Shopify fix
PASS R-5 theme.js tardio (tras DOMContentLoaded): el comprador puede elegir variante :: {"html":"js","picker":"block","nativeSelectVisible":false,"nativeSelectDisabled":true}
MODO=fix total=8 pass=8 fail=0
$ node rev-harness.mjs /home/user/Tema-Shopify base
MODO=base total=8 pass=1 fail=7
```

## 12.3 CM-2 a CM-4 en el informe

| CM | Comprobación | Resultado |
| --- | --- | --- |
| CM-2 | Cabecera `:6`, `:14` y §7.1 `:335-337`: D-1 «NIVEL 2 … pendiente de autorización de Johandry»; la decisión requerida es de Johandry | Hecho |
| CM-3 | `:148-157`: salida literal de `theme-check-sanity` (tres detecciones y `OK.`) | Hecho. Cosmético: en `:93` sigue el rótulo `== sanity` vacío dentro del bloque de §3 |
| CM-4 | §11: salidas literales `ruta=N` (9 archivos, todas 0) y `ctx-check` (`fuera_de_tests_vendor_axe= 0`). §8 `:372` «Buy it now» tras cambiar de VARIANTE: solo credenciales; `:378` tras cambiar de PLAN: fixture y credenciales | Hecho |

Retoques cosméticos no bloqueantes:

- `:14` repite «D-2 a D-4 menores (ver 7).»;
- el informe sigue diciendo «pendiente de autorización»; tras D25 conviene anotarlo en el commit.

## 12.4 Compuertas (salida literal)

```text
$ node --check assets/theme.js ; echo rc=$?
node-check rc=0
$ npx --no-install shopify theme check --path .
│  93 files inspected with no offenses found.                                  │
tc rc=0
$ node scripts/theme-check-sanity.mjs | grep OK.
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
$ node scripts/locale-key-inventory.mjs | tail -1
OK: todas las referencias estaticas resuelven contra los locales.
$ node scripts/dataset-hooks.mjs | grep "Contratos rotos"
Contratos rotos: 0
$ node scripts/json-validate.mjs | grep "Fallos de parseo"
Fallos de parseo:           0
```

La compuerta del literal sobre todos los archivos de la tarea y esta revisión, tras esta adenda, consta en el informe de vuelta (se mide después de la última edición).

## 12.5 Veredicto final

**ACEPTADO.**

- CM-1 a CM-4 están aplicados y verificados.
- D-1 queda autorizado por Johandry (D25, 2026-11-04).
- No quedan hallazgos P0, P1 ni P2 en la tarea. HX-1 (complejidad de C-08 sobre esta base: 122) sigue como aviso para el turno de C-08.
- Estado máximo:
  - A-01: «código completo», con cierre en espera de C-R0-4 y credenciales.
  - B-02: «código completo», con cierre en espera de credenciales.
- Se mantiene la propuesta de bajar las filas 69 y 71 del ledger a «código completo».
