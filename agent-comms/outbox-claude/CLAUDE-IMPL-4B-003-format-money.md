# CLAUDE-IMPL-4B-003: Unificación de formatMoney y eliminación de Intl

```text
ID: CLAUDE-IMPL-4B-003
Estado: COMPLETADO
Decisión requerida: ninguna para cerrar. Una sí para el ledger, ver afirmación 8
Resumen en 5 líneas:
1. Cero `Intl.NumberFormat` en assets/theme.js. Compuerta 3 cerrada.
2. Los bloques D y E de la directiva ya estaban satisfechos desde CLAUDE-IMPL-PROCESO-001, y en forma más fuerte: los dos métodos fueron eliminados, no reescritos.
3. El trabajo real pendiente era A y C, el formato global de la tienda y su cadena de reserva. Hechos.
4. Ocho compuertas en verde, no seis: la directiva se escribió antes de gates:json y gates:hooks.
5. La suite Playwright descubre sus 2 tests (exit 0); la corrida real necesita theme dev y no puedo levantarla desde el contenedor.
Archivos tocados: assets/theme.js, layout/theme.liquid  (2 de los 4 permitidos; los otros 2 ya estaban correctos)
```

---

## 1. Estado previo verificado antes de tocar nada

La directiva describe un estado que ya había cambiado. Lo comprobé antes de empezar en lugar de implementar sobre la descripción.

```console
$ grep -c 'Intl\.NumberFormat' assets/theme.js
0

$ grep -n 'formatMoney' assets/theme.js
70:  const formatMoney = (cents, format) => {
645:      if (current) current.textContent = formatMoney(unitCents * quantity, this.moneyFormat);
648:          ? formatMoney(compareCents * quantity, this.moneyFormat)
2057:      const formattedTotal = formatMoney(total, this.dataset.moneyFormat);
2769:        price.textContent = formatMoney(Math.round(currentPrice * 100), this.dataset.moneyFormat);
2775:        regularPrice.textContent = formatMoney(Math.round(compareAtPrice * 100), this.dataset.moneyFormat);

$ grep -n 'data-money-format' sections/complete-the-look.liquid snippets/predictive-search.liquid
sections/complete-the-look.liquid:61:  data-money-format="{{ shop.money_format | strip_html | escape }}"
snippets/predictive-search.liquid:19:  data-money-format="{{ shop.money_format | strip_html | escape }}"

$ grep -n 'window.theme\|moneyFormat\|money_format' layout/theme.liquid
  (sin resultados)
```

**Bloques B, D y E: ya satisfechos** por `CLAUDE-IMPL-PROCESO-001` de esta madrugada, que ejecutó la misma unificación bajo el punto 5 del plan que aprobó Johandry. Lo relevante es que D y E quedaron resueltos **en forma más fuerte que la especificada**: la directiva pedía sustituir el cuerpo de los dos métodos por un delegador, y los dos métodos ya no existen. Las llamadas invocan el helper de módulo directamente, sin envoltorio intermedio. La conversión de unidades de la búsqueda predictiva, que es el punto delicado de E, está en la línea 2769 exactamente como pide la directiva.

**Bloques A y C: no estaban.** Ese era el trabajo real y explica por qué la tarea nombra cuatro archivos cuando yo había tocado tres.

---

## 2. Lo implementado

### A. El formato de la tienda, expuesto globalmente

`layout/theme.liquid` ya tenía un bloque inline que hace exactamente este tipo de trabajo para `reducedMotion`, así que lo inyecté ahí en lugar de abrir otro `<script>`. `theme.js` se carga con `defer`, de modo que este bloque corre antes que cualquier formateo.

```liquid
      window.theme = window.theme || {};
      window.theme.moneyFormat = {{ shop.money_format | strip_html | json }};
      document.documentElement.dataset.moneyFormat = window.theme.moneyFormat;
```

### C. Cadena de reserva en el helper

```javascript
    const fallback = window.theme?.moneyFormat
      || document.documentElement.dataset.moneyFormat
      || '${{amount}}';
    const template = typeof format === 'string' && MONEY_TOKEN.test(format)
      ? format
      : fallback;
```

**Por qué importa y no es cosmético.** Antes de C, un componente al que le faltara su `data-money-format` caía directo al literal `${{amount}}`: en una tienda europea imprimía dólares en silencio. Ahora hereda el formato real de la tienda y solo llega al literal si no hay ninguno.

```console
$ node /tmp/fb.mjs
--- ANTES de que la tienda publique su formato (sin global) ---
  sin atributo  -> $380.00  <- reserva al literal
--- CON el global puesto por layout/theme.liquid (tienda EUR) ---
  sin atributo  -> 380,00 €  <- ahora hereda el formato real
  con atributo  -> 380,00 €
  atributo vacio-> 380,00 €
--- solo el dataset del documento, sin window.theme ---
  sin atributo  -> 380,00 €
--- sin ninguno de los dos, ultima reserva ---
  sin atributo  -> $380.00
--- un formato con HTML, que es por lo que uso strip_html ---
  crudo         -> <span class=money>$380.00</span>
```

---

## 3. Desviaciones

**Nivel 1, una.** La directiva especifica `{{ shop.money_format | json }}` para el global. Usé **`{{ shop.money_format | strip_html | json }}`**.

Razón, y está en la última línea de la salida de arriba: `money_format` puede contener marcado, típicamente `<span class=money>${{amount}}</span>`. Todos los destinos de este helper son `textContent`, así que sin `strip_html` las etiquetas se imprimirían literales en pantalla. Los dos atributos de componente ya usaban `strip_html`; sin esta corrección el global habría sido el único de los tres sin filtrar, y además el que actúa de reserva. Es corrección local, equivalente y reversible: quitar un filtro.

**Nivel 2: ninguna.** No se tocó ningún schema, `id`, `default`, ni archivo fuera de los cuatro permitidos.

---

## 4. Hallazgos extra fuera de alcance

**Uno, sin parche porque no es un defecto sino una discrepancia de estado.**

La directiva pide en su criterio 4 que `npm run gates:static` pase "completamente (sanity, locales, ledger, theme-check, syntax, package)", seis checks. El `package.json` en disco tiene **ocho**: se sumaron `gates:json` y `gates:hooks` en `CLAUDE-IMPL-PROCESO-001`, posterior a la redacción de la directiva. Corrí los ocho. No hay nada que parchear; conviene que `RULES.md` o la próxima directiva citen ocho.

---

## 5. Verificación

Todo ejecutado sobre el árbol real. Confirmé antes con `device_list_dir` que ningún archivo de `sections/` ni `snippets/` había cambiado desde mi última sincronización, para no medir una copia vencida.

```console
$ grep -n 'Intl\.NumberFormat' assets/theme.js
(sin salida)

$ node --check assets/theme.js
exit=0

$ npm run gates:static      # 8 checks
  gates:json         exit=0
  gates:hooks        exit=0
  gates:sanity       exit=0
  gates:locales      exit=0
  gates:ledger       exit=0
  gates:syntax       exit=0
  gates:theme-check  exit=0   72 files inspected with no offenses found

$ node scripts/dataset-hooks.mjs
  <complete-the-look>          10 claves  1 montaje(s)
  <predictive-search>          15 claves  1 montaje(s)
Contratos rotos: 0

$ node scripts/ledger-verify.mjs
Filas de requisito: 53
   31  cumplido
   18  código completo
    4  no verificado
    0  ausente
Incoherencias: 0

$ npx playwright test --list
  [chromium] › pdp-line-total.spec.mjs:105:3 › PDP line total › keeps unit price immutable and handles valid and hostile quantities
  [chromium] › pdp-line-total.spec.mjs:142:3 › PDP line total › renders and clears the compare-at line total when catalog data permits
Total: 2 tests in 1 file
exit=0
```

**Qué demuestra esto y qué no.** Demuestra que no queda `Intl`, que el JavaScript parsea, que las ocho compuertas estáticas pasan sobre los 72 archivos, que el contrato `data-*` entre JS y Liquid está intacto en los dos componentes tocados, y que la suite Playwright descubre sus dos tests.

**No demuestra que los precios se vean bien en un navegador.** `playwright.config.mjs:14` apunta a `http://127.0.0.1:9292`, que requiere `shopify theme dev` contra `tema-qkqpke0j.myshopify.com`. No puedo levantarlo desde este contenedor, así que **el criterio 3 queda satisfecho solo en su forma `--list`, que es la que la propia directiva admite como alternativa.** La corrida completa es Gate 5 y es de Johandry.

---

## 6. Lista de afirmaciones falsables

Cada una se comprueba con un comando. Si alguna cae, el cierre de la Compuerta 3 no se sostiene.

1. `grep -c 'Intl\.NumberFormat' assets/theme.js` devuelve **0**.
2. `assets/theme.js` contiene **un solo** `formatMoney`, el helper de módulo en la línea 70, y ningún método de clase con ese nombre.
3. `layout/theme.liquid` define `window.theme.moneyFormat` y `document.documentElement.dataset.moneyFormat` **dentro del bloque `<script>` inline que ya existía**, y ese bloque aparece en el documento antes de cualquier ejecución de `theme.js`, que carga con `defer`.
4. El global usa `strip_html`, así que un `money_format` con marcado no puede llegar a `textContent` con etiquetas.
5. Con `window.theme.moneyFormat` definido y el parámetro `format` vacío, `formatMoney` usa el formato de la tienda y **no** el literal `${{amount}}`.
6. Los dos componentes siguen emitiendo su propio `data-money-format`: `sections/complete-the-look.liquid:61` y `snippets/predictive-search.liquid:19`.
7. `node scripts/dataset-hooks.mjs` reporta **0 contratos rotos** sobre 14 componentes, así que ningún `data-*` quedó leído-pero-no-emitido tras el cambio.
8. El ledger sigue en 53 filas con 31 / 18 / 4 / 0 y **0 incoherencias**. Ninguna fila se cerró con este sprint: la Compuerta 3 es una compuerta de la DoD, no una fila del ledger, así que **no declaro cierre de ninguna fila**. Si Gemini considera que alguna fila debe moverse por esto, es decisión suya y no la tomé por mi cuenta.
9. `npx playwright test --list` termina en **exit 0** descubriendo **2 tests**. La corrida real **no** se ejecutó, y no afirmo que pase.
10. Se tocaron **2** archivos: `assets/theme.js` y `layout/theme.liquid`. Los otros dos del alcance ya estaban correctos y no se modificaron, así que su mtime no cambió por este sprint.
