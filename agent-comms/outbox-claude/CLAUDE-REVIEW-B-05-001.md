ID: CLAUDE-REVIEW-B-05-001
Estado: Revisión de tarea (D11) emitida. **ACEPTADO.** Sin P0, P1 ni P2. Cuatro observaciones P3 que no bloquean (§3).
Decisión requerida: ninguna de Johandry (D10). El coordinador puede hacer commit de B-05 (D12/D16). Los P3 se recogen si se quiere, sin repetir la revisión.
Resumen en 5 líneas:
1. El diff es mínimo y está dentro de lo pedido: 5 líneas añadidas y 3 borradas, todas dentro del bloque de idioma. Una sola variable (`language_code_label`) alimenta el texto visible, el `aria-label` y el span activo. Se mantienen `escape` y `value`/`name`/`type`, y el bloque de país no cambia.
2. Reproduje el harness entregado. La base sale en rojo (exit 1, 64 fallos: 20 `[FALLA] H-1` y 10 `[FALLA] H-3`) y el fix en verde (exit 0). Dos corridas del fix son idénticas entre sí y byte a byte a `salida-fix.txt`; la corrida en rojo coincide con `salida-base.txt`. No hay rutas absolutas ni `__pycache__`.
3. Hice una sonda propia con otro motor: liquidjs 10.19.0, un motor Liquid completo (el harness usa `mini.py`), sobre el snippet entero. La regla axe 4.10.2 `label-content-name-mismatch` se forzó a 390 y 1280, con EN/ES/PT-BR/ZH-TW, con JS y sin JS. Resultado del fix: 40/40 botones contienen el texto visible como palabra y empiezan por él, axe da 0 violaciones con 40 `passes` y el POST sale bien en 16/16. La base falla 40/40 por palabra y axe da un falso pass en {en,es}.
4. Compuertas estáticas en verde: Theme Check 93 archivos sin ofensas, `theme-check-sanity` OK, `locale-key-inventory` OK. Ningún JS de `assets/` lee esos botones.
5. El informe es exacto en lo que se comprobó: líneas, hunks, sha del bloque de país, recuentos de fallos y números de axe. Le falta pegar el preflight literal y abrevia algunos rótulos de la cabecera (P3).
Archivos tocados: solo este archivo nuevo. Fuera del repo: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rev-b05/` (`base.liquid`, `base1.txt`, `fix1.txt`, `fix2.txt`, `o-*`, `probe.mjs`, `probe.txt`, `dep/` con liquidjs, `count-two.py`). Sin git de escritura, sin tiendas, sin `.secrets`, sin gate5 y sin valores de entorno.
Desviaciones (Nivel 1 o Nivel 2): ninguna. El cambio sigue siendo Nivel 1 (directiva §4.3).
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo. Siguen vigentes los de la directiva §7.2 y la R-D §4 (`capitalize`, filas 46/82/83). Nota: `git status` muestra ` M docs/requirements-ledger.md` y ` M agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`. No son de B-05 y no se revisan aquí.
Verificación (comando, resultado y qué demuestra/qué no): §1 y §2. Es SINTÉTICA y ESTÁTICA. Demuestra el nombre accesible que calcula Chromium, axe 4.10.2 y el envío del formulario sobre el Liquid real renderizado por dos motores independientes, con `base.css` y `theme.js` (HEAD) reales. No demuestra el HTML servido por Shopify, los valores reales de `endonym_name`/`iso_code`, axe 4.14 ni lectores de pantalla o control por voz: eso queda para R-B (informe §7).
Lista de afirmaciones falsables numeradas:
1. `git diff HEAD --stat -- snippets/ locales/ sections/ layout/ config/ templates/` da solo `snippets/localization-selectors.liquid | 8 +++++---` (5 líneas añadidas y 3 borradas).
2. `rg -c language_code_label snippets/localization-selectors.liquid` = 4, `rg -c 'aria-label='` = 2, y `rg -n "language_code|localization-form__btn|localization-form__item" assets/ --glob '*.js'` sale con exit 1.
3. El harness con `WORK_SNIPPET=<snippet de 1fee9e2>` sale con exit 1 y `RESULTADO: 64 FALLO(S)`. Sin esa variable sale con exit 0. Dos corridas del fix dan una salida byte a byte igual a `salida-fix.txt` (`cmp`) y la corrida en rojo da una salida igual a `salida-base.txt`.
4. La sonda liquidjs (`rev-b05/probe.txt`) da `fix|js=true: botones=40 contienePalabra=40 empiezaPor=40 axeForzada(v+inc)=0 pass=40 postOk=8/8`, `fix|js=false` da 40/40 y `postOk=8/8`, y los bloques de país renderizados en base y fix son 12 con `distintos=0`.
5. En la base, axe 4.10.2 con la regla forzada da v=0 en {en,es} (falso pass) y v=4/6 en {en,es,pt-BR,zh-TW}.
6. `npx --no-install shopify theme check --fail-level error` da «93 files inspected with no offenses found.» (exit 0).
7. La compuerta del literal da `=0` en los archivos de B-05 y en esta revisión (§4).

---

# 1. Diff (`git diff HEAD -- snippets/localization-selectors.liquid`)

| Línea final | Cambio | Juicio |
| --- | --- | --- |
| `:52` | Comentario en español, una sola línea, sin el nombre de la variable (C-2) | Correcto |
| `:53` | `{%- assign language_code_label = language.iso_code | upcase -%}`, antes del `if` | Correcto. Una sola fuente (R-2) |
| `:58` | Span activo con `aria-hidden`: `{{- language_code_label -}}` | Correcto. El resultado es el mismo |
| `:66` | `aria-label="{{ language_code_label | escape }}, {{ 'general.localization.update' | t }}: {{ language.endonym_name | capitalize | escape }}"` | Correcto. Añade `escape` al código; el resto del valor no cambia (la salida de `t` ya iba sin `escape` en la base) |
| `:68` | Texto visible: `{{- language_code_label -}}` | Correcto |

No cambian `class`, `type`, `name`, `value`, el `role="group"`, el texto oculto del idioma activo, los divisores, el bloque de país (`:78-96`), el aviso del editor ni el `{%- liquid` inicial. El harness da `sha256 bloque pais base=fix e14fabc04e86ed6c` y 4 hunks, todos dentro del bloque de idioma. Se cumplen C-1 a C-5, PD-1=A, PD-2 (reutiliza la clave, sin locales nuevos) y PD-4=no.

# 2. Pruebas propias

## 2.1 Harness entregado (reproducción)

```
WORK_SNIPPET=<base 1fee9e2> node .../harness.mjs   -> base exit=1, "RESULTADO: 64 FALLO(S) en la variante fix", 20 [FALLA] H-1, 10 [FALLA] H-3
node .../harness.mjs (x2)                           -> exit=0, exit=0, "RESULTADO: todo OK en la variante fix"
cmp fix1 fix2 / cmp fix1 salida-fix.txt / cmp base1 salida-base.txt   -> idénticos
rg '/home/|/tmp/|/opt/|/root' harness-B-05-001/ CLAUDE-REPORT-B-05-001.md   -> exit 1 (sin rutas absolutas)
```

## 2.2 Sonda independiente (liquidjs 10.19.0, motor completo)

Renderiza el snippet ENTERO, incluido el bloque `{%- liquid` y la lógica `show_*`. Solo se emulan la etiqueta `form` y los filtros `t` y `handle`. Se cargan `base.css` real, `theme.js` de `HEAD` y una página que pasa de `no-js` a `js` como `layout/theme.liquid`. Casos: página en/es con {en,es,pt-BR,zh-TW} y con {en,es}, a 390 y 1280, con JS y sin JS (`javaScriptEnabled:false`, se queda en `no-js`).

| Variante | Botones visibles | Palabra contenida / empieza por | axe forzada (v+inc) / pass | POST con Enter |
| --- | --- | --- | --- | --- |
| base, JS | 40 | 0 / 0 | 20 / 20 (v=0 en {en,es}: falso pass) | 8/8 |
| base, sin JS | 40 | 0 / 0 | — | 8/8 |
| fix, JS | 40 | 40 / 40 | 0 / 40 | 8/8 |
| fix, sin JS | 40 | 40 / 40 | — | 8/8 |

Nombres literales del fix: «ES, Update preferences: Español», «PT-BR, Update preferences: Português (brasil)», «ZH-TW, Update preferences: 中文 (台灣)», «EN, Actualizar preferencias: English», «PT-BR, Actualizar preferencias: Português (brasil)», «ZH-TW, Actualizar preferencias: 中文 (台灣)». No hay ningún `pageerror` aparte del de ViewTransition, ya conocido.

## 2.3 Compuertas estáticas

```
npx --no-install shopify theme check --fail-level error  -> 93 files inspected with no offenses found. (exit 0)
node scripts/theme-check-sanity.mjs                      -> [theme-check-sanity] OK. ... volvio a 0 ofensas. (exit 0)
node scripts/locale-key-inventory.mjs                    -> OK: todas las referencias estaticas resuelven contra los locales. (exit 0)
rg -c language_code_label snippets/localization-selectors.liquid -> 4 ; rg -c 'aria-label=' -> 2
rg -n "language_code|localization-form__btn|localization-form__item" assets/ --glob '*.js' -> exit 1
```

# 3. Hallazgos

Sin P0, P1 ni P2.

- **P3-1 (harness H-5).** La directiva pide que Tab llegue a cada botón de idioma y al select de país en el orden del DOM. El harness solo comprueba que llega al primer botón del formulario objetivo. No bloquea: el DOM y el orden no cambian (H-9/H-10) y el POST se verifica.
- **P3-2 (harness H-3/H-10).** «`passes` ≥ 1 por formulario visible» se comprueba solo en el total, y «regla `inapplicable` para el `<select>`» no se comprueba de forma explícita. En la práctica sí se cumple: hay 2 o 3 `passes` por página, uno por formulario visible (sonda §2.2).
- **P3-3 (rótulos de la corrida en rojo).** Con `WORK_SNIPPET`, `salida-base.txt` rotula el snippet de la base como «fix» («64 FALLO(S) en la variante fix»). Además, el paso C-4 (`git diff` del árbol de trabajo) mide el árbol y no `WORK_SNIPPET`. Puede confundir a quien lea la salida. El resultado no cambia.
- **P3-4 (informe).** No pega la salida literal del preflight, que pide la directiva §1.2 y §8.3: la resume en §1. También abrevia rótulos de RULES §1.4 («Hallazgos extra:», «Verificacion:», «Afirmaciones falsables:»). Los datos que comprobé son exactos.

# 4. Compuerta del literal y contexto

`python3 -I rev-b05/count-two.py` (copia adaptada de `scratchpad/count-two.py`, que solo imprime `ruta=N`) sobre `snippets/localization-selectors.liquid`, `harness-B-05-001/*` (5), `CLAUDE-REPORT-B-05-001.md` y esta revisión: todos `=0`. `ctx-check` da `fuera_de_tests_vendor_axe= 0`. Los resultados se registran en el informe de vuelta.
