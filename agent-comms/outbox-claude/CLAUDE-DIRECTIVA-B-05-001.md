ID: CLAUDE-DIRECTIVA-B-05-001
Fecha: 2026-11-04
Autor: Claude (Opus), redactor de directivas. No implementa.
Destinatario: implementador Sonnet sin contexto previo (ejecuta). También el revisor Opus de contexto limpio (R-D de esta directiva y revisión de la tarea, D11) y el coordinador Claude (rama, commit y push, D12/D16).
Estado: Aprobada con cambios por CLAUDE-REVIEW-B-05-RD-001; donde difieran, manda la R-D.
Decisión requerida: R-D independiente por un revisor Opus de contexto limpio (D11 de `CLAUDE-DECISION-AUTONOMIA-001.md`). El R-D decide PD-1 a PD-4 (§9.1). Ninguna requiere a Johandry (§9.2, D10).
Resumen en 5 líneas:
1. Defecto LV-01 (P2, WCAG 2.5.3 «Label in Name»): el botón de idioma muestra «ES» (o «EN») pero su `aria-label` es «Update preferences: Español» (`snippets/localization-selectors.liquid:64`). El nombre accesible sustituye al texto visible y no lo contiene como palabra.
2. Diagnóstico confirmado con un harness Playwright local (HTML a mano + `assets/base.css` real + axe 4.10.2 de `tests/vendor/axe.min.js`, a 390 y 1280 px). Ojo: axe 4.10.2 da falso «pass» en EN/ES porque compara subcadenas («es» ⊂ «pref**e**r**e**nc**es**») y solo falla con «PT-BR». Por eso el criterio añade una comprobación por palabra del nombre accesible (§2.3).
3. Solución: el `aria-label` del botón empieza por el mismo texto visible, «ES, Update preferences: Español», desde una única variable Liquid. Se reutilizan las claves existentes; no hace falta ninguna clave nueva.
4. Lista cerrada: solo `snippets/localization-selectors.liquid` (más harness e informe en `agent-comms/`). Sin CSS, JS, locales, schemas ni settings. Nivel 1.
5. Máximo sin tienda: «código completo» (D22). Se propone bajar la fila 83 del ledger («Selector de Idioma») de `cumplido` a `código completo`; vuelve a `cumplido` con axe y teclado de Claude en tienda en R-B.
Archivos tocados (por esta entrega de redacción): solo este archivo nuevo, `agent-comms/outbox-claude/CLAUDE-DIRECTIVA-B-05-001.md`. Fuera del repositorio, en el scratch `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/b05/`: `harness.mjs`, `real.mjs`, `salida.txt`, `resumen.txt`, `salida-real.txt`, `tc.txt`, `dh.txt`. Sin git de escritura, sin red, sin tiendas, sin `.secrets`, sin gate5, sin metafields.
Desviaciones (Nivel 1 o Nivel 2): ninguna en esta redacción. La implementación propuesta es Nivel 1 (§4.3).
Hallazgos extra fuera de alcance (con parche listo): §7.2. Son tres: el filtro `capitalize` pone en minúscula el resto del endónimo («Português (brasil)»); la fila 82 del ledger cita una clave y un formato que ya no existen; y la fila 46 afirma «cero violaciones» frente a LV-01. Solo el primero lleva parche y no se aplica aquí.
Verificación (comando, resultado y qué demuestra/qué no): §1.3 y §2. ESTÁTICA y SINTÉTICA (Chromium de Playwright 1.63.0, HTML traducido a mano). Demuestra el nombre accesible que calcula Chromium y el resultado de axe 4.10.2 sobre ese HTML. No demuestra el HTML que pinta Shopify hoy (más allá de una captura antigua, §2.4), ni el comportamiento de lectores de pantalla o control por voz reales, ni el resultado de axe 4.14 (el de la auditoría LIVE).
Lista de afirmaciones falsables numeradas:
1. En `1fee9e2`, el botón no activo del toggle de idioma tiene texto visible `{{ language.iso_code | upcase }}` (`snippets/localization-selectors.liquid:66`) y `aria-label="{{ 'general.localization.update' | t }}: {{ language.endonym_name | capitalize | escape }}"` (`:64`). El `aria-label` no contiene el código visible.
2. `general.localization.update` vale «Update preferences» en `locales/en.default.json:37` y «Actualizar preferencias» en `locales/es.json:37`. Ninguna de las dos cadenas contiene el código de idioma.
3. Con el markup actual, Chromium calcula el nombre «Update preferences: Español» para el botón «ES» y «Actualizar preferencias: English» para «EN». La comprobación por palabra de §2.3 falla en los 28 botones visibles medidos (4 casos × 2 anchos).
4. axe 4.10.2 marca `label-content-name-mismatch` como `experimental`. No se ejecuta con `runOnly` por etiquetas WCAG: hace falta `runOnly: { type: 'rule', values: ['label-content-name-mismatch'] }`. Con la regla forzada, el markup actual da 0 violaciones en EN/ES y 2 por ancho con «PT-BR».
5. Con la solución de §4 (variante «A» del harness), los 28 botones visibles medidos tienen un nombre que empieza por el texto visible y axe 4.10.2 da 0 violaciones y `passes` en todos los casos, incluido «PT-BR».
6. El selector de país no comparte el patrón: es un `<select>` con `<label for>` visualmente oculto, sin `aria-label` ni `aria-labelledby` (`:78-79`), y para él la regla de axe es inaplicable.
7. Ningún JS del tema lee el `aria-label` ni el texto de estos botones: `LocalizationForm` (`assets/theme.js:4841-4866`) solo usa el `<form>` y `[data-localization-select]`.
8. En `1fee9e2`, Theme Check da «93 files inspected with no offenses found.», `locale-key-inventory` da «OK: todas las referencias estaticas resuelven contra los locales.» y `dataset-hooks` sale con código 0.

---

# 0. Condiciones de entrada (bloqueantes)

El implementador NO empieza a editar si falta alguna de estas condiciones. Si falta, se detiene y lo informa al coordinador sin tocar archivos.

1. Hay un dictamen R-D del revisor Opus de contexto limpio sobre esta directiva (ID sugerido `CLAUDE-REVIEW-B-05-RD-001`) con resultado «apta» o «apta con cambios». Si el R-D cambia algo, manda el R-D.
2. La rama `lote-b` existe y está activa, preparada por el coordinador. Si no existe, el implementador no la crea: se detiene.
3. El preflight de §1.2 pasa completo.
4. Ningún otro agente escribe en el repositorio durante el turno (escritor único, plan V4.1 §2). B-01, B-03 y B-04 escriben en turnos distintos (§7.1 R-6).

# 1. Base y preflight

## 1.1 Base

- Rama de trabajo: `lote-b`, creada por el coordinador desde `lote-a` (D12). Cabeza de referencia de esta redacción: `1fee9e2e0fdd9c62f5b58550487e2236057ac73f` («Lote A: R-A estatica (aceptado con cambios), ledger y estado»).
- `lote-b` puede traer antes commits de B-01, B-03 o B-04. Tocan `assets/theme.js`, `assets/base.css`, `sections/cart-drawer.liquid` y, en el caso de B-03, quizá `locales/*.json`. Ninguno debería tocar `snippets/localization-selectors.liquid` ni las claves `general.localization.*`.
- Localiza siempre por el ancla textual (atributo, clave o clase) que acompaña a cada número de línea, nunca solo por la línea.

## 1.2 Preflight obligatorio (antes de editar)

Ejecuta y pega la salida literal en el informe (§8):

```
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 1fee9e2e0fdd9c62f5b58550487e2236057ac73f HEAD && echo "desciende de 1fee9e2"
git diff --stat 1fee9e2 -- snippets/localization-selectors.liquid locales/
sha256sum snippets/localization-selectors.liquid
rg -n 'aria-label|language_code|iso_code|endonym_name|language_code_label' snippets/localization-selectors.liquid
rg -n "render 'localization-selectors'" sections/ snippets/ layout/ templates/
rg -n '"update"|"current_language"|"language"' locales/en.default.json locales/es.json
rg -n "aria-label|language_code|localization-form__btn" assets/theme.js
```

Condiciones de paso:

- La rama es `lote-b`, desciende de `1fee9e2` y no hay cambios sin commit en el snippet ni en `locales/`.
- `sha256sum` del snippet empieza por `8f2529cc2acd8c17`. Si no, `git diff 1fee9e2 -- snippets/localization-selectors.liquid` debe estar vacío o no tocar las líneas `:49-74`. Si las toca, detente y repórtalo.
- `rg` encuentra en el snippet exactamente 2 `aria-label` (`:50`, grupo `role="group"`; `:64`, botón) y ningún `language_code_label`.
- Hay exactamente 3 llamadas a render: `sections/header.liquid` (contextos `header-mobile` y `header`) y `sections/footer.liquid` (contexto `footer`).
- Las claves `general.localization.update` y `general.localization.current_language` existen en los dos locales.
- La última búsqueda en `theme.js` no encuentra ningún uso del `aria-label` ni de `.localization-form__btn`. Si apareciera alguno, detente y repórtalo.

## 1.3 Estado base medido hoy (`1fee9e2`, referencia)

| Comando | Resultado literal (extracto) |
| --- | --- |
| `git rev-parse HEAD` | `1fee9e2e0fdd9c62f5b58550487e2236057ac73f`; `git status --short` vacío |
| `npx --no-install shopify theme check --fail-level error` | `93 files inspected with no offenses found.` |
| `node scripts/locale-key-inventory.mjs` | `OK: todas las referencias estaticas resuelven contra los locales.` |
| `node scripts/dataset-hooks.mjs` | exit 0 |
| `sha256sum` (prefijo 16) | `localization-selectors.liquid 8f2529cc2acd8c17`, `en.default.json 7bd0af985201ec8a`, `es.json 99f118acd0da3d40` |

`theme-check-sanity.mjs` no se ejecutó en la redacción porque escribe un sandbox en `.tmp/`. El implementador sí lo ejecuta (§5.2).

# 2. Diagnóstico

## 2.1 Markup actual (código, `1fee9e2`)

| Elemento | Archivo:línea | Hoy | ¿Afecta a 2.5.3? |
| --- | --- | --- | --- |
| Grupo del toggle | `snippets/localization-selectors.liquid:50` | `<div role="group" aria-label="{{ 'general.localization.language' | t }}">` | No: un grupo no es un control con nombre tomado del contenido |
| Idioma activo | `:52-57` | `<span aria-current="true">` con «Current language: English» visualmente oculto y «EN» con `aria-hidden` | No: no es interactivo. Se conserva sin cambios |
| **Botón de otro idioma** | `:59-67` | texto visible `{{- language.iso_code | upcase -}}` (`:66`); `aria-label="{{ 'general.localization.update' | t }}: {{ language.endonym_name | capitalize | escape }}"` (`:64`) | **Sí. El `aria-label` sustituye al contenido y no contiene «ES»** |
| Selector de país | `:78-79` | `<label class="visually-hidden" for="…-country">` + `<select>` sin `aria-label` | No (afirmación 6). Comparte snippet, pero no el patrón |
| Botón sin JS del país | `:90-92` | texto visible = nombre («Update preferences») | No |
| Locales | `locales/en.default.json:33-40`, `locales/es.json` (`general.localization`) | `update`: «Update preferences» / «Actualizar preferencias»; `current_language`: «Current language: {{ language }}» / «Idioma actual: {{ language }}» | Ninguna cadena contiene el código |

Llamadas: `sections/header.liquid:124` (`header-mobile`, dentro del cajón móvil), `:188` (`header`, oculto por debajo de 48rem por `assets/base.css:6854-6863`) y `sections/footer.liquid:16-21` (`footer`, visible en cualquier ancho). Por eso el plan pide «header a 1280 y footer a 390».

Antecedente: `CLAUDE-AUDIT-THREE-THEMES-LIVE-001.md:136` y `:244` (LV-01, P2, axe 4.14.0, `label-content-name-mismatch` serious, en `#LocalizationForm-footer` a 390 px y en el header a 1280 px). No es un hallazgo nuevo según D10. El repositorio ya aplicó el mismo remedio a los hotspots del lookbook (`sections/lookbook.liquid:94`: `aria-label="{{ forloop.index }}. …"`), así que la solución sigue un patrón existente del tema.

## 2.2 Harness sintético (método)

`/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/b05/harness.mjs`. Se ejecuta con `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node harness.mjs /home/user/Tema-Shopify`.

- Un servidor Node local sirve páginas que traducen a mano el snippet en sus tres contextos, con `assets/base.css` REAL en línea y las cadenas leídas de `locales/en.default.json` y `locales/es.json`. El cajón móvil se muestra a 390 px quitando `hidden` al contenedor.
- Variantes: `base` (markup de `1fee9e2`), `A` (la solución de §4) y `B` (alternativa de PD-1: sin `aria-label`, con texto visualmente oculto dentro del botón).
- Casos: página en inglés con {en, es}; página en español con {en, es}; inglés con {en, es, fr, de, pt-BR}; alemán con {en, de}. Cada caso a 390 y 1280 px.
- Medidas:
  - axe 4.10.2 (`tests/vendor/axe.min.js`) con la regla forzada y, aparte, con las etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `wcag22aa`;
  - nombre accesible de Chromium (`locator.ariaSnapshot()`) de cada botón visible;
  - comprobación por palabra (§2.3);
  - orden de Tab;
  - Enter sobre el primer botón (footer a 390, header a 1280) con el POST a `/localization` interceptado.
- Límite: es SINTÉTICO. El HTML no lo pinta Shopify y el endónimo de prueba se escribió a mano («español» en minúscula, como lo devuelve Shopify según el uso de `capitalize` en el snippet; no verificado en tienda).

## 2.3 Resultados (salida en `.../b05/salida.txt` y `resumen.txt`)

| Variante | Nombre accesible (Chromium) | Comprobación por palabra¹ | axe 4.10.2, regla forzada | axe con etiquetas WCAG | Enter |
| --- | --- | --- | --- | --- | --- |
| `base` | «Update preferences: Español»; «Actualizar preferencias: English» | **FALLA en 28/28 botones** (ES, EN, FR, DE, PT-BR) | 0 violaciones en {en, es} y {en, de}; **2 por ancho con PT-BR** (header/header-mobile y footer) | la regla no se ejecuta (`experimental`) | POST `language_code=es&country_code=US` |
| `A` (§4) | «ES, Update preferences: Español»; «EN, Actualizar preferencias: English»; «PT-BR, Update preferences: Português (brasil)» | pasa en 28/28 | 0 violaciones; `passes` en todos los casos (2 u 8 nodos) | no se ejecuta | igual que `base` |
| `B` (PD-1) | «ES , Update preferences: Español» (Chromium inserta un espacio antes de la coma) | pasa en 28/28 | `inapplicable` (no hay `aria-label`) | no se ejecuta | igual que `base` |

¹ Comprobación por palabra: el nombre debe empezar por el texto visible, sin distinguir mayúsculas, seguido de fin de cadena o de un carácter que no sea letra ni número. En el harness es `new RegExp('^' + visible + '($|[^\\p{L}\\p{N}])', 'iu')`.

Lectura:

- El defecto queda confirmado por el nombre accesible: «ES» no aparece como palabra en «Update preferences: Español». Un usuario de control por voz que diga «pulsa ES» no activa el botón (WCAG 2.5.3).
- axe 4.10.2 no lo detecta en EN/ES por una coincidencia de subcadena. Su evaluación (`label-content-name-mismatch-evaluate`, en `axe.min.js` función `ug`) termina en `r.includes(n)` tras quitar la puntuación: «update preferences español» incluye «es» (de «preferences») y «actualizar preferencias english» incluye «en». Con «PT-BR» la subcadena «ptbr» no aparece y la regla sí falla. La auditoría LIVE usó axe 4.14.0 y lo marcó en EN/ES, lo que es coherente con una comparación más estricta en esa versión. Esto último no está verificado localmente (sin red).
- Consecuencia para los criterios: «0 violaciones de axe 4.10.2» no basta como prueba. El criterio exige además la comprobación por palabra (H-1) y un caso «PT-BR» en el que axe 4.10.2 sí discrimina (H-3).

## 2.4 Corroboración con HTML real capturado (antiguo)

`.../b05/real.mjs` ejecuta axe 4.10.2 (regla forzada, `base.css` inyectado, red bloqueada) sobre `harness-AUDIT-360-002/html-validation/Sartorial_home.html`, una captura real de Shopify del commit `e6d0ff7` con un markup de país antiguo («Currency», «EUR€»). Resultado (`salida-real.txt`):

- a 1280 px, el botón `#LocalizationForm-header … [value="es"]` aparece en `passes`, con 0 violaciones;
- a 390 px el cajón está cerrado y el botón no se evalúa.

Confirma el falso pass de 4.10.2 sobre HTML real. No sustituye a la prueba en tienda.

# 3. Causa

El `aria-label` del botón (`:64`) se redactó como descripción de la acción («Update preferences: <idioma>») sin incluir la etiqueta visible. En un botón, `aria-label` sustituye por completo al nombre que se calcularía del contenido, así que el texto visible «ES» desaparece del nombre accesible. Es un defecto de una sola línea, en un solo archivo. El patrón no se repite en el resto del snippet (§2.1) y ya se corrigió en el lookbook (`sections/lookbook.liquid:94`).

# 4. Solución

## 4.1 Principio

El nombre accesible del botón empieza por su texto visible exacto, y los dos salen de una sola expresión Liquid, para que no puedan divergir. Se conserva la información útil del nombre actual (acción e idioma de destino). El código es original: no copies de SebastianDev017/atelier (D17) ni de otros temas.

## 4.2 Cambio S-1 (lista cerrada; líneas de `1fee9e2`)

`snippets/localization-selectors.liquid`, dentro de `{%- for language in localization.available_languages -%}` (`:51-72`):

- a) Justo después de la apertura del bucle (`:51`) y antes de `{%- if language.iso_code == localization.language.iso_code -%}` (`:52`), añade:
  `{%- assign language_code_label = language.iso_code | upcase -%}`
- b) En el `<button … name="language_code">` (`:59-67`), sustituye el `aria-label` de `:64` por:
  `aria-label="{{ language_code_label | escape }}, {{ 'general.localization.update' | t }}: {{ language.endonym_name | capitalize | escape }}"`
- c) En el contenido visible del botón (`:66`), sustituye `{{- language.iso_code | upcase -}}` por `{{- language_code_label -}}`.
- d) En el `<span aria-hidden="true">` del idioma activo (`:56`), sustituye `{{- language.iso_code | upcase -}}` por `{{- language_code_label -}}`. Es solo consistencia: el resultado no cambia.
- e) Añade un comentario Liquid breve (una o dos líneas) junto al `assign`. Debe decir que el nombre accesible empieza por el texto visible (WCAG 2.5.3, B-05/LV-01).

No toques: `class`, `type`, `name="language_code"`, `value`, el grupo `role="group"` (`:50`), el `<span aria-current>` y su texto oculto (`:53-55`), los divisores, el selector de país (`:76-94`), el aviso del editor ni la lógica del `{%- liquid` inicial (`:14-44`).

Resultado esperado del nombre: «ES, Update preferences: Español» (página en inglés) y «EN, Actualizar preferencias: English» (página en español).

## 4.3 Nivel de desviación: Nivel 1

- No toca ningún `id` de setting, `default`, schema, preset ni clave de locale (RULES §3.5).
- Los campos que se envían a Shopify (`language_code`, `country_code`) y sus valores no cambian. Los hooks `data-localization-form` y `data-localization-select` tampoco.
- No hay atributos `aria-*` nuevos: cambia el valor de uno existente (RULES §4.2). No se crean IDs ni `name` duplicados.
- No cambia nada visible (texto, tamaño ni CSS). No hay riesgo de CLS.

## 4.4 Límites reales que se documentan (no se resuelven)

1. Un lector de pantalla leerá «E S, Update preferences: Español» (o «es» como palabra). Es inherente a una etiqueta visible abreviada. El botón activo ya expone el idioma completo («Current language: English»).
2. La puntuación «, » y «: » va escrita en el markup, como ya pasaba con «: ». Es aceptable con los dos locales del tema (en/es). Una clave con placeholders la haría traducible (PD-2).
3. El endónimo sigue pasando por `capitalize` (hallazgo extra §7.2.1, fuera de alcance).
4. El endónimo va en otro idioma que la página, sin `lang` propio (WCAG 3.1.2). Ya era así y queda fuera de alcance (PD-4).

## 4.5 Orden de implementación y esfuerzo

1. Preflight §1.2.
2. Harness en rojo: escribe el harness de §5.1 y ejecútalo contra el snippet de la base. H-11 debe pasar: el harness detecta el defecto. Guarda la salida.
3. S-1.
4. Harness en verde y compuertas estáticas de §5.2.
5. Informe de §8.

Esfuerzo orientativo: unas 0,25 jornadas entre código y harness, dentro de la banda del plan (0,25–0,5 d). La prueba en tienda va aparte y está bloqueada (§5.4).

# 5. Criterios de aceptación y pruebas

## 5.1 Harness local (sintético, sin tienda): obligatorio

Ubicación entregable: `agent-comms/outbox-claude/harness-B-05-001/` (patrón de `harness-A-01-B-02-001/`), con `harness.mjs` y las salidas `salida-base.txt` y `salida-fix.txt`. Puedes partir de `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/b05/harness.mjs` si existe. Si no, escríbelo con este diseño:

- Un servidor Node local. Sin credenciales, sin URLs de tienda, sin red externa. `assets/base.css`, `tests/vendor/axe.min.js` y los dos locales se leen del repositorio, sin copiarlos.
- Una función que traduce a mano el snippet DEFINITIVO en los contextos `header`, `header-mobile` (cajón visible a 390 px) y `footer`. El `aria-label` y el texto visible se calculan con la misma expresión que el Liquid.
- Un modo `BASE=1` que reproduce el `aria-label` de `1fee9e2`, para la prueba en rojo (H-11).
- Una comprobación de fidelidad con `rg`/`grep` sobre el Liquid real:
  - `language_code_label` aparece 4 veces (`assign`, `aria-label`, botón y span activo);
  - `aria-label=` aparece 2 veces;
  - `name="language_code"` aparece 1 vez.
  El harness falla si el Liquid no coincide con lo que traduce.
- Lanza Chromium con `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` y el Playwright de `node_modules` (1.63.0).

Criterios (página en inglés y en español salvo que se diga otra cosa):

| # | Caso | Criterio de aceptación |
| --- | --- | --- |
| H-1 | Nombre accesible por palabra | Para cada botón de idioma visible, el nombre de `ariaSnapshot()` empieza por el texto visible seguido de fin o de un carácter que no sea letra ni número (regex de §2.3). Se mide en: header a 1280, footer a 1280, footer a 390 y header-mobile a 390 con el cajón visible |
| H-2 | Nombre exacto | Página en inglés con {en, es}: «ES, Update preferences: Español». Página en español: «EN, Actualizar preferencias: English» |
| H-3 | axe 4.10.2, regla forzada | `axe.run(document, { runOnly: { type: 'rule', values: ['label-content-name-mismatch'] } })` da 0 violaciones y `passes` con al menos 1 nodo por formulario visible, a 390 y a 1280. Incluye el caso {en, es, fr, de, pt-BR}, que en la base da 2 violaciones por ancho |
| H-4 | axe 4.10.2, etiquetas WCAG | `runOnly` por etiquetas (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) no da ninguna violación nueva frente a la base, en la página sintética. Se declara que 4.10.2 no incluye esta regla con esas etiquetas |
| H-5 | Teclado | Tab llega a cada botón de idioma y al select de país en orden del DOM. `:focus-visible` se aplica al botón enfocado (`element.matches(':focus-visible')`). Enter sobre el botón envía un POST a `/localization` con `language_code=<valor>` (interceptado con `page.route`), en el footer a 390 y en el header a 1280 |
| H-6 | Sin JS | Con `javaScriptEnabled: false`, H-1, H-2 y el POST de H-5 dan el mismo resultado |
| H-7 | Idioma activo intacto | El `<span aria-current="true">` conserva su texto oculto («Current language: English» / «Idioma actual: Español») y el código visible con `aria-hidden` |
| H-8 | Degenerados | (a) Un solo idioma: no se pinta el toggle y no hay botones. (b) Cinco idiomas, con «PT-BR» (código regional): H-1 y H-3 pasan. (c) Endónimo largo «português (Brasil)» y RTL «ar» / «العربية»: H-1 pasa. (d) `endonym_name` vacío: el nombre sigue empezando por el código («ES, Update preferences: ») |
| H-9 | Sin regresión visual | El `innerText` visible del botón y su `getBoundingClientRect()` (ancho y alto) son iguales en la base y tras el cambio, en los tres contextos y en los dos anchos |
| H-10 | País sin cambios | El HTML generado del bloque de país es idéntico byte a byte en la base y tras el cambio. La regla de axe es `inapplicable` para el `<select>` |
| H-11 | El harness detecta el defecto | Con `BASE=1`, H-1 FALLA en todos los botones y H-3 FALLA en el caso PT-BR (como en §2.3) |

## 5.2 Compuertas estáticas obligatorias

Pega la salida literal de cada una en el informe:

```
npx --no-install shopify theme check --fail-level error     # esperado: 93 files inspected with no offenses found.
node scripts/theme-check-sanity.mjs
node scripts/locale-key-inventory.mjs                       # sin claves nuevas ni huérfanas
node scripts/dataset-hooks.mjs
node scripts/json-validate.mjs
rg -c 'language_code_label' snippets/localization-selectors.liquid       # 4
rg -c 'aria-label=' snippets/localization-selectors.liquid               # 2
rg -n 'aria-label="\{\{ language_code_label' snippets/localization-selectors.liquid   # 1 línea
git diff --stat 1fee9e2 -- snippets/localization-selectors.liquid locales/ assets/ sections/ layout/ config/ templates/
```

Para la última línea, si otros turnos de B ya hicieron commit, usa como base el HEAD anotado en el preflight. Debe aparecer solo `snippets/localization-selectors.liquid` con unas 4–6 líneas cambiadas.

Antes de cada push, el coordinador cuenta como 0 las apariciones del literal de contraseña fuera de `tests/vendor/axe.min.js`, sin imprimirlo (D12). El implementador no imprime ni busca ese literal.

## 5.3 Cinco compuertas (AGENTS.md / RULES §2)

| Compuerta | Exigencia para esta tarea |
| --- | --- |
| 1. Requisitos / ledger | Declarar la fila 83 (§6) con evidencia `archivo:línea` del cambio y los IDs H-1 a H-11 del harness. No editar el ledger. |
| 2. Estados degenerados | Vacío: un solo idioma, sin toggle (H-8a), y aviso del editor sin cambios. Uno: un solo botón ({en, es}). Muchos: cinco idiomas (H-8b). Muy largo: endónimo largo y código regional «PT-BR» (H-8b/c). Faltante: endónimo vacío (H-8d). RTL: «ar» (H-8c). |
| 3. Consistencia | Una sola fuente del código visible (`language_code_label`) para el texto y el nombre. Se reutiliza `general.localization.update`, sin cadenas nuevas en el markup salvo la coma. Mismo patrón que `sections/lookbook.liquid:94`. Sin `Intl` ni formato de moneda (no aplica). |
| 4. Superficie del comerciante | Sin settings, labels ni schemas nuevos. Si crees que hace falta una clave de locale nueva, DETENTE: es PD-2 del R-D. |
| 5. Tienda real | No ejecutable (D22, sin credenciales). Pendiente de §5.4. Estado máximo: «código completo». |

## 5.4 Pendiente para R-B en tienda (bloqueado por credenciales, D22)

Marca cada punto en el informe como «pendiente de credenciales (D22), R-B». Ninguno se declara cumplido con el harness.

1. Claude ejecuta axe en la preview no publicada con el build identificado: footer a 390 y header a 1280, como mínimo en Home, con la página en inglés y en `/es/`. Hay que usar la regla forzada si se usa 4.10.2, y además la comprobación por palabra (H-1) sobre el árbol de accesibilidad real. Si se dispone de axe ≥ 4.14 (la versión de LIVE), se registra también ese resultado con su versión.
2. Teclado real: Tab hasta el botón, Enter y cambio de idioma efectivo (`/collections/x` → `/es/collections/x` y vuelta), en el header a 1280 y en el footer a 390 y en el cajón móvil.
3. HTML real servido por Shopify: el `aria-label` coincide con H-2 y `endonym_name` llega en minúscula («español»), lo que confirma el supuesto de §2.2.
4. Móvil simulado con viewport verificado.
5. Opcional, sin bloquear: comprobación manual con un lector de pantalla o con control por voz.

# 6. Filas del ledger y estado máximo

| Fila (línea) | Estado actual | Relación | Estado propuesto tras esta tarea (sin tienda) |
| --- | --- | --- | --- |
| «Selector de Idioma (`form 'localization'`)» (`docs/requirements-ledger.md:83`) | `cumplido` | Su evidencia cita como correcto el propio `aria-label` defectuoso («Update preferences: Español»). Los localizadores están obsoletos: dice `:22-50` y el toggle está hoy en `:49-74`. LV-01 demuestra una violación WCAG 2.5.3 (serious) en el componente de la fila. | `código completo` (PD-3), con evidencia nueva (`snippets/localization-selectors.liquid` líneas de S-1 y H-1 a H-11). Vuelve a `cumplido` solo tras R-B en tienda (§5.4.1–3). |
| «Lighthouse Accesibilidad >= 90» (`:46`) | `cumplido` | La puntuación ≥ 90 no se contradice (LIVE midió 100), pero su texto «Cero violaciones WCAG 2.2 AA» sí, por LV-01. | Sin cambio de estado. Corregir la frase al actualizar el ledger (§7.2.3). |
| «Selector de País / Moneda» (`:82`) | `cumplido` | Sin relación con el defecto (afirmación 6). Su evidencia está obsoleta (§7.2.2). | Sin cambio de estado. |

- El implementador NO edita `docs/requirements-ledger.md`. Propone en su informe y la actualización la decide la revisión (plan V4.1 §6).
- Cabecera actual: `60 filas | 49 cumplido | 11 código completo`. Con la propuesta pasaría a 48 / 12. La recalcula quien actualice, con `node scripts/ledger-verify.mjs`.

# 7. Riesgos y hallazgos extra

## 7.1 Riesgos de regresión (cada uno con su comprobación)

| ID | Riesgo | Mitigación / prueba |
| --- | --- | --- |
| R-1 | Romper el envío del idioma (con o sin JS). | No se tocan `name`, `value` ni `type`. H-5 y H-6 capturan el POST. |
| R-2 | Que el texto visible y el nombre diverjan en el futuro. | Una sola variable (`language_code_label`) y comprobación de fidelidad del harness. |
| R-3 | Cambio visual o CLS. | El contenido visible no cambia. H-9 mide texto y caja. |
| R-4 | Falso verde de axe 4.10.2 (subcadena y regla experimental). | H-1 (por palabra), H-3 con PT-BR y H-11 en rojo. §5.4.1 lo repite en tienda. |
| R-5 | Comillas o `&` en el endónimo dentro del atributo. | Se conserva `escape` en el endónimo y se añade `escape` al código. |
| R-6 | Concurrencia: B-01, B-03 y B-04 escriben en `lote-b` (theme.js, base.css, cart-drawer y quizá locales). | Archivos disjuntos. Escritor único y turnos secuenciales (§0.4). Si `git diff` del preflight muestra cambios en el snippet o en `general.localization`, detente. |
| R-7 | Una app o JS externo que lea el `aria-label` del botón. | No hay ninguno en el tema (afirmación 7). Si existiera fuera del repositorio, no está verificado. |

## 7.2 Hallazgos extra fuera de alcance (no tocar en esta tarea)

1. **`capitalize` sobre el endónimo** (`snippets/localization-selectors.liquid:54` y `:64`). El filtro Liquid `capitalize` pone en minúscula el resto de la cadena: el harness lo reproduce como «Português (brasil)». Afecta solo a endónimos con más de una palabra o con mayúsculas internas. Parche preparado, no aplicado: sustituir `| capitalize` por una mayúscula solo en el primer carácter (`slice: 0 | upcase` + `slice: 1, size`). P3, candidato a C-04-N o a pulido de D.
2. **Fila 82 del ledger con evidencia obsoleta.** Cita `general.localization.currency` (la clave no existe: `rg '"currency"' locales/en.default.json locales/es.json` no da resultados), opciones «USD$»/«EUR€» con deduplicación y `snippets/localization-selectors.liquid:51-76`. Hoy el código usa `general.localization.country` y `{{ country.name }} ({{ country.currency.iso_code }} {{ country.currency.symbol }})` (`:78-86`). Se corrige al actualizar el ledger, sin cambio de estado.
3. **Fila 46 del ledger**: «Cero violaciones WCAG 2.2 AA» frente a LV-01 (axe 4.14.0, LIVE). Solo es un cambio de redacción.

# 8. Informe del implementador

Ruta: `agent-comms/outbox-claude/CLAUDE-REPORT-B-05-001.md`.

Contenido obligatorio:

1. Cabecera completa RULES §1.4: ID, Estado, Decisión requerida, Resumen en 5 líneas, Archivos tocados, Desviaciones, Hallazgos extra, Verificación y Afirmaciones falsables.
2. Identidad: SHA de `HEAD` de `lote-b` antes de editar, `git diff --stat` y lista cerrada frente a lista efectivamente tocada, con líneas exactas.
3. Salida literal del preflight (§1.2), de las compuertas (§5.2) y del harness en rojo (`BASE=1`) y en verde. Etiqueta todo como «sintético» o «estático».
4. Tabla H-1 a H-11 con su resultado por contexto (header, header-mobile, footer), ancho (390/1280) y página (en/es), con los nombres accesibles literales.
5. Decisión aplicada de cada PD de §9.1, citando el dictamen R-D.
6. Propuesta de estado de la fila 83 del ledger (§6), sin editar el ledger, y nota de las filas 46 y 82.
7. Lista de §5.4 marcada como «pendiente de credenciales (D22), R-B».
8. Ninguna credencial, URL de tienda con token, cookie ni valor de entorno. No se abre `.secrets`, no se crean metafields y no se usa gate5 (D13, D17).
9. El implementador no hace commit ni push. Lo hace el coordinador tras la revisión (D11, D12, D16).

# 9. Decisiones para el R-D y conflictos

## 9.1 Puntos que decide el R-D (PD)

| ID | Pregunta | Recomendación del redactor |
| --- | --- | --- |
| PD-1 | ¿Variante «A» (`aria-label` que empieza por el código visible) o «B» (sin `aria-label`, código visible más texto visualmente oculto dentro del botón)? | **A**. Cambia un solo atributo y no altera el DOM. axe la evalúa y da `passes` (B queda `inapplicable`, una evidencia más débil para R-B). Además sigue el patrón ya aplicado en `sections/lookbook.liquid:94`. B también cumple 2.5.3 (§2.3), pero añade un hijo con `position:absolute` dentro de un `inline-flex`, y Chromium mete un espacio («ES , …»). |
| PD-2 | ¿Reutilizar `general.localization.update` con «, » escrito en el markup, o crear una clave con placeholders (por ejemplo `general.localization.switch_language`: «{{ code }}, update preferences: {{ language }}», con paridad en/es)? | **Reutilizar**. El plan admite «claves locales permitidas», pero la clave nueva saca `locales/*.json` a la lista, mientras que B-03 también puede tocar locales en `lote-b` (más conflictos), y la puntuación escrita ya existía (`: `). Si el R-D elige la clave nueva: alta en `locales/en.default.json` y `locales/es.json` con paridad, y `locale-key-inventory` en verde. |
| PD-3 | ¿Se propone bajar la fila 83 de `cumplido` a `código completo`? | **Sí**. Su evidencia valida el atributo defectuoso y LV-01 es una violación serious en vivo. Un `cumplido` no convive con un defecto confirmado en su componente (RULES §3.8, precedente PD-3 de A-01/B-02). |
| PD-4 | ¿Añadir `lang="{{ language.iso_code }}"` al endónimo (WCAG 3.1.2)? | **No en B-05**. Dentro de un `aria-label` no se puede marcar el idioma de una parte. Exigiría la variante B y amplía el alcance. Se registra como mejora posible. |

## 9.2 Conflictos detectados (y si requieren a Johandry según D10)

| ID | Conflicto | ¿Johandry? |
| --- | --- | --- |
| K-1 | El plan asigna B-05 a Antigravity (o a GPT si el alcance es transversal). D9 y D11 lo sustituyen por Claude, el implementador Sonnet y el revisor Opus de contexto limpio. | No (ya decidido en D9 y D11). |
| K-2 | El plan exige axe ejecutado por Claude en R-B; D22 impide la tienda sin credenciales. | No (decidido en D22). Máximo «código completo». |
| K-3 | La herramienta local (axe 4.10.2) no reproduce LV-01 en EN/ES; LIVE usó 4.14.0. | No: se resuelve con el criterio por palabra (H-1) y PT-BR (H-3). Registrar en R-B la versión de axe usada. |
| K-4 | La fila 83 del ledger está en `cumplido` frente a LV-01. | No: la propuesta la resuelve la revisión (§6). |
| K-5 | Concurrencia con B-01, B-03 y B-04 en `lote-b`. | No: lo coordina el coordinador por turnos (R-6). |

Ningún punto requiere a Johandry: LV-01 es P2 y ya estaba registrado (no es un P0/P1 nuevo), el archivo es la superficie candidata del plan y no hay escritura en tiendas ni dudas de credenciales (D10).
