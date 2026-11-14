ID: CLAUDE-REVIEW-B-05-RD-001
Estado: Dictamen R-D emitido. **APROBADA CON CAMBIOS** (lista cerrada en §2). Equivale a «apta con cambios» de la condición §0.1 de la directiva.
Decisión requerida: ninguna de Johandry (D10). El coordinador incorpora C-1 a C-5 en la directiva (o el implementador los aplica como parte de ella, mandando este dictamen) antes de ejecutar S-1.
Resumen en 5 líneas:
1. Defecto LV-01 confirmado de forma independiente con el Liquid REAL renderizado (no traducido a mano): el botón «ES» se llama «Update preferences: Español»; el nombre no contiene «ES» como palabra (WCAG 2.5.3).
2. Causa del falso «pass» de axe 4.10.2 confirmada en `tests/vendor/axe.min.js` (función `ug`): compara por subcadena (`r.includes(n)`) y la regla está etiquetada `experimental`. Además de con PT-BR, 4.10.2 sí falla con endónimos no latinos (AR, ZH-TW) y con endónimo vacío.
3. La solución S-1, aplicada literalmente a una copia, da nombres que empiezan por el texto visible en 100 % de los botones, 0 violaciones con la regla forzada, mismo POST con y sin JS (con `assets/theme.js` real cargado), cajas idénticas y bloque de país idéntico. Theme Check sobre la copia: sin ofensas.
4. PD-1 = A, PD-2 = reutilizar la clave, PD-3 = sí (fila 83 a `código completo`, 48/12), PD-4 = no en B-05.
5. Cambios obligatorios: preflight de `theme.js` desambiguado (C-1), comentario sin el nombre de la variable (C-2), fidelidad por línea exacta (C-3), H-10 medido sobre el Liquid (C-4) y H-5/H-6 con `theme.js` real y `no-js` (C-5).
Archivos tocados: solo este archivo nuevo. Fuera del repo: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rd-b05/` (`base.liquid`, `patch.py`, `fix.liquid`, `mini.py`, `gen.py`, `pages/`, `test.mjs`, `salida.txt`, `tc/`, `count-two.py`). Sin git de escritura, sin red, sin tiendas, sin `.secrets`, sin gate5. No se tocaron B-01, B-03 ni B-04.
Desviaciones (Nivel 1 o Nivel 2): ninguna. S-1 sigue siendo Nivel 1.
Hallazgos extra fuera de alcance (con parche listo): §4 (localizadores obsoletos adicionales en filas 82/83; ceguera estructural de la evidencia de la fila 46). Sin parche de código.
Verificación (comando, resultado y qué demuestra/qué no): §1. SINTÉTICA y ESTÁTICA. Demuestra el nombre accesible de Chromium y axe 4.10.2 sobre HTML generado del Liquid real (base y copia con S-1) con `base.css` y `theme.js` reales. No demuestra el HTML servido por Shopify, `endonym_name`/`iso_code` reales, axe 4.14 ni lectores de pantalla o control por voz reales (queda para R-B).
Lista de afirmaciones falsables numeradas:
1. `sha256sum snippets/localization-selectors.liquid` empieza por `8f2529cc2acd8c17` en `1fee9e2`; `en.default.json` `7bd0af985201ec8a`; `es.json` `99f118acd0da3d40`.
2. En `tests/vendor/axe.min.js` (cabecera `axe v4.10.2`), `label-content-name-mismatch` tiene `tags:[…,"experimental"]` y su evaluación `ug` termina en `r.includes(n)` tras `lg()` (quita puntuación).
3. `rg -c "aria-label|language_code|localization-form__btn" assets/theme.js` da 13; `rg -n "language_code|localization-form__btn|localization-form__item" assets/ --glob '*.js'` no da resultados (exit 1).
4. Aplicando a/b/c/d/e de §4.2 con un comentario que no nombra la variable, `grep -c language_code_label` = 4 y `grep -c 'aria-label='` = 2.
5. Con el Liquid de la base, axe 4.10.2 con la regla forzada da 0 violaciones en {en, es} y violaciones en {…, pt-BR}, {en, ar, zh-TW} y endónimo vacío; con S-1 da 0 violaciones y `passes` en todos los casos.
6. Los 18 bloques de país generados (6 casos × 3 contextos) son idénticos byte a byte en base y con S-1; las 90 cajas de botón medidas son idénticas.
7. Ningún punto de B-05 requiere a Johandry.

---

# 1. Verificación independiente

## 1.1 Método (distinto del harness del redactor)

- `rd-b05/patch.py` aplica S-1 (a–e) a una copia del snippet con `assert count == 1` por sustitución. `diff -u base.liquid fix.liquid`: solo cambian el bucle (2 líneas añadidas), `:56`, `:64` y `:66`.
- `rd-b05/mini.py` es un mini-renderizador Liquid (subconjunto: `for`, `if`/`else`, `unless`, `assign`, `comment`, filtros `t`, `upcase`, `capitalize`, `escape`, control de espacios) que **renderiza el snippet real** entre `{%- form %}` y `{%- endform -%}`. Así la prueba usa el Liquid y no una traducción a mano.
- `rd-b05/test.mjs` (Playwright 1.63.0, `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) sirve `assets/base.css` y `assets/theme.js` reales y usa axe 4.10.2 local. Casos: {en,es} en/es, {en,es,fr,de,pt-BR}, {en,ar,zh-TW}, endónimo vacío, un idioma. Anchos 390 y 1280, con JS (`theme.js` real) y sin JS (`javaScriptEnabled:false`, `class="no-js"`).

## 1.2 Resultados (`rd-b05/salida.txt`)

| Caso | Base: nombre / palabra / axe forzada | S-1: nombre / palabra / axe forzada |
| --- | --- | --- |
| en {en,es} | «Update preferences: Español» / falla / v=0 pass=2–3 (**falso pass**) | «ES, Update preferences: Español» / ok / v=0 pass |
| es {en,es} | «Actualizar preferencias: English» / falla / v=0 (**falso pass**) | «EN, Actualizar preferencias: English» / ok / v=0 pass |
| en {en,es,fr,de,pt-BR} | falla 8/8 y 12/12 / v=2 (390), v=3 (1280, cajón visible) | «PT-BR, Update preferences: Português (brasil)» / ok / v=0 |
| en {en,ar,zh-TW} | «Update preferences: العربية» / falla / **v=4 y v=6** | «AR, …», «ZH-TW, Update preferences: 中文 (台灣)» / ok / v=0 |
| endónimo vacío | «Update preferences:» / falla / v=2–3 | «IT, Update preferences:» / ok / v=0 |
| un idioma | sin toggle, regla `inapplicable` | igual |

- Etiquetas WCAG (`wcag2a…wcag22aa`): la regla no se ejecuta en ningún caso (`reglaEnTags=false`), 0 violaciones en base y S-1.
- Teclado: Tab llega al botón objetivo (footer a 390, header a 1280), `:focus-visible` verdadero, Enter envía `language_code=<valor>&country_code=US`, idéntico con y sin JS, en base y S-1. El único `pageerror` («Transition was aborted… ViewTransition») aparece en la navegación del POST, igual en base y S-1: no lo causa B-05.
- Árbol de accesibilidad del grupo (S-1, en): `group "Language" / text "Current language: English" / button "ES, Update preferences: Español"`. En es, el botón EN va antes que «Idioma actual: Español» porque sigue el orden de `available_languages`, igual que hoy.
- H-9: `cajas comparadas=90 distintas=0`. H-10: `bloques de pais comparados: 18 distintos: 0`.
- Theme Check sobre una copia del tema con S-1 (`rd-b05/tc`, `npx --no-install shopify theme check --path … --fail-level error`): «82 files inspected with no offenses found.» (la copia solo lleva las carpetas del tema; el repo da 93).

## 1.3 Fidelidad del harness del redactor (`scratchpad/b05/`)

- Coincide con mis resultados en nombres, palabra y recuentos de axe para los cuatro casos que mide: los resultados de §2.3 de la directiva son reproducibles.
- Límites: (a) traduce el HTML a mano y fija el bloque de país, así que H-9 y H-10 serían triviales en él; (b) no carga `assets/theme.js`, así que «con JS» y «sin JS» son el mismo experimento; (c) no tiene la comprobación de fidelidad que la directiva exige. C-3 a C-5 lo corrigen.
- Corrección de texto: la afirmación «axe 4.10.2 solo falla con PT-BR» es incompleta. También falla con endónimos no latinos y con endónimo vacío. La conclusión no cambia: en EN/ES da falso pass.

## 1.4 Lectores de pantalla, códigos compuestos y país

- Orden: el nombre empieza por el texto visible y conserva acción e idioma de destino. La redundancia «ES … Español» es la mínima que exige 2.5.3 con una etiqueta abreviada. La pronunciación de «ES»/«EN» por el sintetizador queda como límite documentado (§4.4.1 de la directiva), no como defecto.
- `pt-BR`/`zh-TW`: el texto visible y el nombre salen de la misma variable `language_code_label`, así que no pueden divergir; `value` sigue usando `language.iso_code` sin `upcase`. Que Shopify devuelva `pt-BR` (con región) no está verificado en tienda, pero no afecta a la corrección.
- País: no comparte el patrón (`<label for>` + `<select>`, `:78-79`), bloque byte a byte igual y regla `inapplicable` para el `<select>`.

# 2. Veredicto: APROBADA CON CAMBIOS

Cambios obligatorios (lista exacta):

- **C-1 (preflight §1.2, ambigüedad bloqueante).** `rg -n "aria-label|language_code|localization-form__btn" assets/theme.js` da hoy 13 líneas de `aria-label` ajenas (`:459`, `:1260`, `:3815`…). La condición «no encuentra ningún uso» haría que el implementador se detenga sin motivo. Sustituye la búsqueda y la condición por: `rg -n "language_code|localization-form__btn|localization-form__item" assets/ --glob '*.js'`, que debe dar 0 resultados, y lectura de `class LocalizationForm` (`assets/theme.js:4841-4866`) para confirmar que solo usa `form` y `[data-localization-select]`.
- **C-2 (§4.2 e y §5.2).** El comentario va antes del `assign`, en español, en una línea, y NO contiene la cadena `language_code_label`. Si la contuviera, el recuento sería 5 y fallaría la compuerta del 4. Texto sugerido: `{%- comment -%} WCAG 2.5.3 (B-05/LV-01): el nombre accesible del boton empieza por su texto visible. {%- endcomment -%}`.
- **C-3 (fidelidad, §5.1).** Además de los recuentos, el harness exige con búsqueda de cadena fija (`grep -cF`) exactamente 1 aparición de cada una de estas cadenas en el Liquid real: `aria-label="{{ language_code_label | escape }}, {{ 'general.localization.update' | t }}: {{ language.endonym_name | capitalize | escape }}"`, `{%- assign language_code_label = language.iso_code | upcase -%}` y `{{- language_code_label -}}` ×2 (`grep -cF` = 2). Si alguna no coincide, el harness falla.
- **C-4 (H-10 y H-9).** H-10 se demuestra sobre el Liquid y no sobre el HTML fijo del harness: (a) `git diff -U0 <HEAD preflight> -- snippets/localization-selectors.liquid` solo tiene hunks entre `{%- if show_language_selector -%}` y su `{%- endif -%}`; (b) el `sha256` del bloque `{%- if show_country_selector -%}` … `{%- endif -%}` (extraído por anclas) es igual antes y después. H-9 se mantiene, pero se declara que en un harness sintético solo prueba que el texto visible no cambia.
- **C-5 (H-5/H-6).** En el modo con JS, el harness carga `assets/theme.js` real (servido desde el repo, sin copiar) y el `<localization-form>` queda definido. En el modo sin JS, usa `javaScriptEnabled:false` y `<html class="no-js">`. Se acepta como preexistente un `pageerror` de ViewTransition durante la navegación del POST si aparece igual en la base (H-11).

Cambios menores (no bloquean; el implementador los recoge en el informe):

- m-1: H-8 añade `zh-TW` («中文 (台灣)») al caso no latino. H-11 registra que la base también falla en axe con AR/ZH-TW y con endónimo vacío.
- m-2: el «Resumen 2» y §2.3 de la directiva pasan a decir «falla con PT-BR, endónimos no latinos y endónimo vacío».

# 3. Decisiones PD

| PD | Decisión | Motivo |
| --- | --- | --- |
| PD-1 | **A** (`aria-label` que empieza por el código visible) | Cambia un solo valor de atributo, sin DOM ni CSS nuevos; axe lo evalúa (`passes`, prueba más fuerte para R-B que `inapplicable`); sigue `sections/lookbook.liquid:94`. B no aporta nada a 2.5.3 y solo tendría sentido junto con PD-4. |
| PD-2 | **Reutilizar** `general.localization.update` | Sin claves nuevas, `locales/` fuera de la lista (evita choque con B-03). La puntuación escrita ya existía («: »). El tema solo trae en/es. Una clave con placeholders queda como mejora P3 de localización, no de B-05. |
| PD-3 | **Sí**: fila 83 de `cumplido` a `código completo` | Su evidencia certifica el atributo defectuoso y LV-01 es una violación serious en vivo. RULES §3.8 y D22: sin tienda el máximo es `código completo`. Cabecera esperada 60 / 48 cumplido / 12 código completo, recalculada con `node scripts/ledger-verify.mjs` por quien edite. Vuelve a `cumplido` solo con §5.4.1–3 en R-B. |
| PD-4 | **No en B-05** | 3.1.2 no se puede satisfacer dentro de un `aria-label` y exigiría B. Se registra como mejora (P3) para C/D. |

# 4. Ledger y hallazgos extra

- Fila 83 (`docs/requirements-ledger.md:83`): además de `:22-50` (hoy `:49-74`), también están obsoletos `assets/theme.js:3977` (hoy `class LocalizationForm` en `:4841`) y `sections/header.liquid:127,191` (hoy `:124` y `:188`). El footer (`sections/footer.liquid:16`) no se cita. Corregirlo al actualizar la fila.
- Fila 82: mismos localizadores obsoletos de `theme.js` y `header.liquid`, además de lo señalado en §7.2.2 de la directiva. Sin cambio de estado.
- Fila 46: su evidencia («axe-core 4.10.2 … Cero violaciones WCAG 2.2 AA») no podía ver LV-01: con etiquetas WCAG, 4.10.2 no ejecuta la regla `experimental` y, forzada, da falso pass en EN/ES. Se cambia la redacción, no el estado (Lighthouse 100 no se contradice).
- §7.2.1 (`capitalize`): confirmado («Português (brasil)»). Fuera de alcance, como dice la directiva.

# 5. Queda para R-B (pendiente de credenciales, D22)

Se mantiene §5.4 de la directiva, con estas precisiones: (1) axe en la preview con la regla forzada y, si es posible, axe 4.14.0 (versión de LIVE), registrando la versión; la comprobación por palabra H-1 sobre el árbol de accesibilidad real es obligatoria porque axe 4.10.2 no discrimina EN/ES; (2) teclado real y cambio de idioma efectivo en el header a 1280, el footer a 390 y el cajón móvil; (3) HTML servido: el `aria-label` coincide con H-2 y se registra el valor real de `endonym_name` e `iso_code` (incluido un mercado con código regional si existe); (4) móvil simulado con viewport verificado; (5) opcional: VoiceOver o NVDA y control por voz («pulsa ES»). Ningún punto se declara cumplido con el harness.

# 6. Johandry (D10)

NINGÚN PUNTO DE B-05 REQUIERE A JOHANDRY: LV-01 es P2 ya registrado, el cambio es de Nivel 1 dentro del plan, no hay escritura en tiendas ni dudas de credenciales y ningún gate ha fallado dos veces.

# 7. Compuerta del literal

`cd /home/user/Tema-Shopify && python3 -I /tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rd-b05/count-two.py agent-comms/outbox-claude/CLAUDE-REVIEW-B-05-RD-001.md` (copia de `count-two.py`, solo imprime `ruta=N`). Resultado esperado y registrado en el informe de vuelta: `=0`.
