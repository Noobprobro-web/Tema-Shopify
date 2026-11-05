ID: CLAUDE-REPORT-B-05-001
Estado: Implementado, sin commit. Estado maximo sin tienda: `codigo completo` (D22). Listo para revision.
Decision requerida: ninguna de Johandry (D10). Pendiente solo R-B en tienda (seccion 7).
Resumen en 5 lineas (RULES §1.4):
1. LV-01 (WCAG 2.5.3): el `aria-label` del boton de idioma ahora empieza por el texto visible: «ES, Update preferences: Espanol» / «EN, Actualizar preferencias: English».
2. Una sola variable Liquid (`language_code_label`) alimenta texto visible, nombre accesible y span del idioma activo. Sin claves nuevas (PD-2), sin CSS/JS/locales/schemas.
3. Harness (sintetico, Liquid REAL renderizado con `mini.py`, `base.css` real, `theme.js` real de `git show HEAD:`, axe 4.10.2 local): rojo con la base (64 fallos), verde con el fix (0), salidas deterministas.
4. Compuertas estaticas verdes: Theme Check 93 archivos sin ofensas, sanity OK, locale-key-inventory OK, dataset-hooks exit 0.
5. Aplicados C-1..C-5 y PD-1=A, PD-2 reutilizar, PD-3 si, PD-4 no (R-D `CLAUDE-REVIEW-B-05-RD-001`).
Archivos tocados: `snippets/localization-selectors.liquid` (lineas 52-53 nuevas, 58, 66, 68 del fichero final), `agent-comms/outbox-claude/harness-B-05-001/{harness.mjs,gen.py,mini.py,salida-base.txt,salida-fix.txt}` (sin `__pycache__`), este informe. Nada mas (el `M assets/theme.js` de `git status` es de B-01, ajeno).
Desviaciones: ninguna (Nivel 1).
Hallazgos extra (fuera de alcance): los de la directiva 7.2 y R-D seccion 4 (capitalize, filas 82/83/46 del ledger con localizadores obsoletos). No se tocan. Nota: la salida de la corrida con JS muestra un `pageerror` de ViewTransition en la navegacion del POST, igual en base y fix (preexistente, R-D C-5); el harness cuenta solo los que no son ViewTransition (0) para que la salida sea determinista.
Verificacion (sintetica y estatica, no en tienda): SINTETICA y ESTATICA. Demuestra nombre accesible en Chromium y axe 4.10.2 sobre HTML generado del Liquid real. No demuestra HTML servido por Shopify, `endonym_name`/`iso_code` reales, axe 4.14, lectores de pantalla ni control por voz.
Afirmaciones falsables (comprobables por el revisor):
1. `rg -c language_code_label snippets/localization-selectors.liquid` = 4; `rg -c 'aria-label='` = 2; `grep -cF` de las cadenas de C-3 = 1/1/2 (salida-fix.txt lineas 2-7).
2. `git diff -U0 1fee9e2 -- snippets/localization-selectors.liquid`: 4 hunks (-51,0 +52,2; -56 +58; -64 +66; -66 +68), todos dentro del bloque de idioma; sha256 del bloque de pais igual (e14fabc04e86ed6c).
3. Base: H-1 falla en todos los botones (20 FALLA H-1 en salida-base.txt); axe regla forzada falla con PT-BR, AR/ZH-TW y endonimo vacio (10 FALLA H-3).
4. Fix: 0 fallos; H-1 ok en los 6 casos x 2 anchos x con/sin JS; axe v=0 con passes; Enter envia `language_code=<valor>&country_code=US` con y sin JS.
5. Ningun JS lee el aria-label: `rg -n "language_code|localization-form__btn|localization-form__item" assets/ --glob '*.js'` sin resultados (exit 1); `class LocalizationForm` (`assets/theme.js`) solo usa `form` y `[data-localization-select]`.

---
# 1. Identidad
- HEAD `lote-b` antes de editar: `1fee9e2e0fdd9c62f5b58550487e2236057ac73f` (desciende de 1fee9e2). `git status --short --branch` mostro `## lote-b...origin/lote-b`, ` M assets/theme.js` (B-01) y archivos `??` de agent-comms; snippet y locales sin cambios.
- sha256 (prefijo 16) previo: snippet `8f2529cc2acd8c17`, en.default `7bd0af985201ec8a`, es `99f118acd0da3d40` (coinciden con la directiva).
- Renders: `sections/footer.liquid:16`, `sections/header.liquid:124` y `:188` (3, como se esperaba). Locales con `update` y `current_language` en ambos.
- Lista cerrada = lista tocada. `git diff --stat 1fee9e2 -- snippets/localization-selectors.liquid locales/ assets/ sections/ layout/ config/ templates/`: `snippets/localization-selectors.liquid | 8 +++++---` (mas `assets/theme.js | 19 +++` de B-01, ajeno).

# 1b. Preflight literal (directiva §1.2 y §8.3)
Salida pegada tal cual, ejecutada en el momento de publicar (HEAD `a0274ce`, con el snippet ya modificado; el preflight previo a editar fue sobre `1fee9e2` con arbol limpio, ver §1):
```
$ git rev-parse HEAD
a0274ce851df2e96dd495a47f00f08bfb31ceb1a
$ git status --short --untracked-files=no -- snippets/localization-selectors.liquid
 M snippets/localization-selectors.liquid
$ git diff --stat HEAD -- snippets/localization-selectors.liquid
 snippets/localization-selectors.liquid | 8 +++++---
 1 file changed, 5 insertions(+), 3 deletions(-)
```

# 1c. Pendientes menores para R-B (P3 de CLAUDE-REVIEW-B-05-001)
- P3-1: H-5 del harness solo comprueba que Tab llega al primer boton; falta recorrer todos los botones y el select de pais en orden del DOM.
- P3-2: H-3/H-10: `passes` >= 1 por formulario visible solo se comprueba en total; `inapplicable` del `<select>` no se comprueba de forma explicita.
- P3-3: con `WORK_SNIPPET`, `salida-base.txt` rotula la base como «fix» y el paso C-4 mide el arbol de trabajo, no `WORK_SNIPPET`. El resultado no cambia.

# 2. Cambio (lineas del fichero final)
- `:52` comentario en espanol, sin el nombre de la variable (C-2): `{%- comment -%} WCAG 2.5.3 (B-05/LV-01): el nombre accesible del boton empieza por su texto visible. {%- endcomment -%}`
- `:53` `{%- assign language_code_label = language.iso_code | upcase -%}`
- `:58` span activo: `{{- language_code_label -}}`
- `:66` `aria-label="{{ language_code_label | escape }}, {{ 'general.localization.update' | t }}: {{ language.endonym_name | capitalize | escape }}"`
- `:68` texto visible del boton: `{{- language_code_label -}}`

# 3. Compuertas estaticas (estatico, salida literal)
```
$ npx --no-install shopify theme check --fail-level error
  93 files inspected with no offenses found.
$ node scripts/theme-check-sanity.mjs
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
$ node scripts/locale-key-inventory.mjs
OK: todas las referencias estaticas resuelven contra los locales.
$ node scripts/dataset-hooks.mjs   -> exit=0
$ node scripts/json-validate.mjs   -> (sin errores; solo comprueba que parsee)
$ rg -c 'language_code_label' snippets/localization-selectors.liquid   -> 4
$ rg -c 'aria-label=' snippets/localization-selectors.liquid           -> 2
$ rg -n 'aria-label="\{\{ language_code_label' snippets/localization-selectors.liquid -> 66: (1 linea)
```

# 4. Harness (sintetico)
Comandos (desde la raiz del repo; sin rutas absolutas; `theme.js` se lee con `git show ${THEME_REV:-HEAD}:assets/theme.js`, ignora los cambios sin commit de B-01):
```
export PLAYWRIGHT_BROWSERS_PATH=<navegadores de Playwright>
git show 1fee9e2:snippets/localization-selectors.liquid > <archivo temporal>
WORK_SNIPPET=<archivo temporal> node agent-comms/outbox-claude/harness-B-05-001/harness.mjs > agent-comms/outbox-claude/harness-B-05-001/salida-base.txt   # ROJO
node agent-comms/outbox-claude/harness-B-05-001/harness.mjs > agent-comms/outbox-claude/harness-B-05-001/salida-fix.txt                                      # VERDE
```
Resultados: rojo exit 1, `RESULTADO: 64 FALLO(S) en la variante fix` (H-11: el harness detecta el defecto). Verde exit 0, `RESULTADO: todo OK en la variante fix`. Dos corridas consecutivas, `cmp` identico (deterministas).

| # | Resultado en fix (salida-fix.txt) |
| --- | --- |
| H-1 palabra | ok en header 1280, footer 1280, footer 390 y header-mobile 390, 6 casos, con y sin JS |
| H-2 nombre | `ES, Update preferences: Español` (pagina en); `EN, Actualizar preferencias: English` (pagina es) |
| H-3 axe 4.10.2 regla forzada | v=0, pass>0 en todos; en5 1280: pass=12; base en5 390: v=2; base rtl 390: v=4; base empty 390: v=2 |
| H-4 etiquetas WCAG | iguales a la base; `reglaEnTags=false` (4.10.2 no ejecuta la regla experimental con etiquetas) |
| H-5/H-6 teclado | Tab llega, `:focus-visible`, Enter -> `language_code=<valor>&country_code=US`, con `theme.js` real (`localization-form` definido) y con `class="no-js"` + `javaScriptEnabled:false` |
| H-7 activo | texto oculto «Current language: English» / «Idioma actual: Español» y codigo con `aria-hidden` intactos |
| H-8 degenerados | a) un idioma: sin botones; b) en5 con `PT-BR`: «PT-BR, Update preferences: Português (brasil)»; c) rtl: «AR, Update preferences: العربية», «ZH-TW, Update preferences: 中文 (台灣)»; d) vacio: «IT, Update preferences:» |
| H-9 | solo prueba que texto visible y caja no cambian: `cajas comparadas=90 distintas=0` |
| H-10 | C-4: 4 hunks dentro del bloque de idioma, `fuera_del_bloque_idioma=0`; sha256 bloque pais base=fix `e14fabc04e86ed6c`; 18 bloques renderizados distintos: 0 |
| H-11 | base: 20 `[FALLA] H-1`, 10 `[FALLA] H-3` (PT-BR, AR/ZH-TW, vacio) |

# 5. Decisiones aplicadas (R-D)
PD-1=A, PD-2 reutilizar `general.localization.update`, PD-3 si, PD-4 no. C-1 (busqueda en `assets/` 0 resultados), C-2, C-3, C-4, C-5 aplicados. m-1: casos zh-TW y endonimo vacio incluidos (H-8).

# 6. Ledger (aplicado en el commit de B-05 tras CLAUDE-REVIEW-B-05-001; antes era propuesta)
Fila 83 (`docs/requirements-ledger.md:83`) de `cumplido` a `codigo completo`, evidencia: `snippets/localization-selectors.liquid:52-53,58,66,68` y H-1..H-11 (`harness-B-05-001/salida-fix.txt`); cabecera esperada 60 / 48 / 12, a recalcular con `node scripts/ledger-verify.mjs` por quien edite. Corregir localizadores obsoletos de filas 82/83 (`theme.js:3977` hoy `class LocalizationForm`; `header.liquid:127,191` hoy `:124,:188`) y la frase «Cero violaciones WCAG 2.2 AA» de la fila 46.

# 7. Pendiente de credenciales (D22), R-B en tienda
1. axe en preview (footer 390, header 1280, en y /es/), regla forzada + H-1 sobre el arbol real; registrar version (4.14 si hay).
2. Teclado real y cambio de idioma efectivo (header 1280, footer 390, cajon movil).
3. HTML servido: aria-label = H-2; valor real de `endonym_name`/`iso_code`.
4. Movil simulado con viewport verificado.
5. Opcional: lector de pantalla / control por voz.
Ninguno se declara cumplido con el harness.

# 8. Seguridad
Sin credenciales, tiendas, `.secrets`, gate5 ni valores de entorno. Sin git de escritura (no commit/push).
