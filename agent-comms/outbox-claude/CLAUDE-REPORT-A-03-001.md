# CLAUDE-REPORT-A-03-001: color del anillo de foco por `motion_style`

```text
ID: CLAUDE-REPORT-A-03-001
Estado: código completo (D22: sin tienda no hay `cumplido`). Matriz en previews reales pendiente de
  credenciales (D13); la ejecuta el revisor de R-A.
Decisión requerida: revisión D11 (subagente Opus contexto limpio). Johandry: ninguna ahora.
Resumen en 5 líneas:
  1. `assets/base.css`: en technical y heritage (bloque `prefers-reduced-motion: no-preference`) el anillo de
     `.button`, `input` y `select` pasa de hex fijos (#2b2b2b, #b5885c) a `var(--focus-width) solid var(--color-foreground)`.
  2. Diff: 1 archivo, 5 inserciones y 2 borrados (3 líneas de comentario E1 + E2 + E3), idéntico a la R-D (C-5).
  3. Arnés SINTÉTICO (Chromium): antes 810 filas, 91 fallos (13 combinaciones estilo×esquema × 7 controles
     objetivo; 78 con los 6 controles de la R-D); después 810 filas, 0 fallos, mínimo 7.58:1.
  4. Atelier, `reduce` y controles de regresión (`a`, `.icon-button`): idénticos antes y después. Reglas CSS parseadas: 1556 = 1556.
  5. Theme Check: 92 archivos, 0 ofensas (no inspecciona base.css; solo no regresión). Sin commit, sin tienda.
Archivos tocados: `assets/base.css` (líneas en §3); carpeta `agent-comms/outbox-claude/harness-A-03-001/` (nueva: 4 archivos); este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna de Nivel 2. Una de procedimiento (preflight acotado a base.css, §1) y una de conteo (91 en vez de 78, §4).
Hallazgos extra fuera de alcance (con parche listo): H-1 (P2), H-2, H-3, H-4 (P3), R-1 (P3), R-2 (§6, con parches candidatos «no aplicar en A-03»).
Verificación (comando, resultado y qué demuestra/qué no): §4-§5. ESTÁTICO / SINTÉTICO (Chromium local). No demuestra nada sobre previews, imágenes reales ni tecnología asistiva.
Lista de afirmaciones falsables numeradas: §9.
```

Aplicadas las condiciones C-1 a C-8 de `CLAUDE-REVIEW-A-03-RD-001.md`; donde la directiva y la R-D difieren, manda la R-D.

## 1. Preflight (RULES §1.3; C-3 y C-4)

```text
$ git status --short --untracked-files=no
 M listings/archive/templates/index.json
 M locales/en.default.schema.json
 M snippets/product-provenance.liquid
 M snippets/product-technical-specs.liquid
$ git status --short --untracked-files=no -- assets/base.css
(vacío)
$ git branch --show-current
lote-a
$ git branch --list lote-a
* lote-a
$ git merge-base --is-ancestor eb7cca7 HEAD && echo DESCIENDE
DESCIENDE
$ git diff --stat eb7cca7 HEAD -- assets/base.css
(vacío)
```

Desviación de procedimiento: los cuatro archivos modificados son cambios sin commit de A-02, hechos por otro agente. No son míos y no los toqué. Acoté la comprobación de «limpio» a `assets/base.css`, que estaba limpio (con eso se cumple el espíritu de C-4). `lote-a` ya existía (creada por el coordinador, C-3).

### 1.1 Salida literal de los pasos 4 y 5 del preflight (añadida por M-2 de CLAUDE-REVIEW-A-03-001)

Se re-ejecutan tras el commit de A-02 (`a6a9074`) porque el informe original resumió estos pasos en prosa y la directiva pedía la salida literal (RULES §1.3). Como `assets/base.css` del árbol de trabajo ya lleva la edición de A-03, los localizadores se ejecutan sobre la copia de `eb7cca7:assets/base.css` (la base de la directiva), y por eso los números de línea son los del estado previo a la edición. `layout/theme.liquid` y `config/settings_data.json` también se toman de `eb7cca7`. El hash `e82d567e…` coincide con el blob de `HEAD`, y `git diff --stat eb7cca7 HEAD -- assets/base.css` sale vacío (el commit de A-02 no toca `base.css`).

```text
$ git show eb7cca7:assets/base.css | git hash-object --stdin
e82d567e7c35e04eca1d40a4d9be38229f6488e0
$ git diff --stat eb7cca7 HEAD -- assets/base.css
(exit=0)
$ sed -n '283,286p;9058p;9069,9074p;9102,9107p;9126,9131p' base.css@eb7cca7
:focus-visible {
  outline: var(--focus-width) solid var(--color-foreground);
  outline-offset: 3px;
}
@media (prefers-reduced-motion: no-preference) {
  html[data-motion-style='atelier'] .button:focus-visible,
  html[data-motion-style='atelier'] input:focus-visible,
  html[data-motion-style='atelier'] select:focus-visible {
    outline: 2px solid var(--color-foreground);
    outline-offset: 3px;
  }
  html[data-motion-style='technical'] .button:focus-visible,
  html[data-motion-style='technical'] input:focus-visible,
  html[data-motion-style='technical'] select:focus-visible {
    outline: 2px solid #2b2b2b;
    outline-offset: 2px;
  }
  html[data-motion-style='heritage'] .button:focus-visible,
  html[data-motion-style='heritage'] input:focus-visible,
  html[data-motion-style='heritage'] select:focus-visible {
    outline: 2px solid #b5885c;
    outline-offset: 3px;
  }
$ grep -n -E "data-motion-style='(atelier|technical|heritage)'\] (\.button|input|select):focus-visible" base.css@eb7cca7
9069:  html[data-motion-style='atelier'] .button:focus-visible,
9070:  html[data-motion-style='atelier'] input:focus-visible,
9071:  html[data-motion-style='atelier'] select:focus-visible {
9102:  html[data-motion-style='technical'] .button:focus-visible,
9103:  html[data-motion-style='technical'] input:focus-visible,
9104:  html[data-motion-style='technical'] select:focus-visible {
9126:  html[data-motion-style='heritage'] .button:focus-visible,
9127:  html[data-motion-style='heritage'] input:focus-visible,
9128:  html[data-motion-style='heritage'] select:focus-visible {
$ grep -n -E "^\s*--focus-width" base.css@eb7cca7
100:  --focus-width: 2px;
$ grep -n "data-motion-style" layout/theme.liquid@eb7cca7
3:<html class="no-js" lang="{{ request.locale.iso_code }}" dir="{{ request.locale.direction }}" data-animations="{{ settings.animations | default: 'subtle' }}" data-motion-style="{{ settings.motion_style | default: 'atelier' }}">
$ grep -n "\"motion_style\"" config/settings_data.json@eb7cca7
79:    "motion_style": "atelier"
157:      "motion_style": "atelier"
234:      "motion_style": "technical"
311:      "motion_style": "heritage"
$ grep -n -E "#2b2b2b|#b5885c|#333333" base.css@eb7cca7
9084:    border-color: #2b2b2b;
9088:    box-shadow: 0 0 0 1px #2b2b2b;
9092:    outline: 1px solid #333333;
9105:    outline: 2px solid #2b2b2b;
9111:    border-color: #b5885c;
9112:    color: #b5885c;
9118:    color: #b5885c;
9123:    color: #b5885c;
9129:    outline: 2px solid #b5885c;
$ node --version
v22.23.4
$ npx --no-install playwright --version
Version 1.63.0
$ ls /opt/pw-browsers
chromium
chromium-1243
chromium_headless_shell-1243
ffmpeg-1011
```

Localizadores en `eb7cca7` (antes de editar), todos como la directiva: `base.css:283-286` regla base con `var(--focus-width) solid var(--color-foreground)`; `:9058` abre `no-preference`; atelier `9069-9074`; technical `9102-9107` (outline fijo en `:9105`); heritage `9126-9131` (`:9129`); `--focus-width` solo en `:100`, sin redefinición en `layout/`, `sections/` ni `snippets/`; `layout/theme.liquid:3` emite `data-motion-style`; `settings_data.json:79,157,234,311` = atelier, atelier, technical, heritage; `#2b2b2b|#b5885c|#333333` en 9084, 9088, 9092, 9105, 9111, 9112, 9118, 9123, 9129. `base.css` era idéntico a `base-before.css` de la R-D antes de editar.

Herramientas: `node v22.23.4`, `playwright 1.63.0`, Chromium en `chromium-1243`. Funcionan.

## 2. Edición (E1-E3, anclas de C-5)

`git diff --stat eb7cca7 -- assets/base.css`: ` assets/base.css | 7 +++++--` / `1 file changed, 5 insertions(+), 2 deletions(-)`.

```diff
--- a/assets/base.css
+++ b/assets/base.css
@@ -9099,10 +9099,13 @@ html[data-motion-style='heritage'] {
     text-underline-offset: 3px;
   }
 
+  /* Foco: el color del anillo sale del esquema (--color-foreground), igual que la regla base
+     :focus-visible. Un gris o un laton fijos bajan de 3:1 en esquemas oscuros o calidos (A-03).
+     Cada estilo solo cambia el outline-offset. */
   html[data-motion-style='technical'] .button:focus-visible,
   html[data-motion-style='technical'] input:focus-visible,
   html[data-motion-style='technical'] select:focus-visible {
-    outline: 2px solid #2b2b2b;
+    outline: var(--focus-width) solid var(--color-foreground);
     outline-offset: 2px;
   }
 
@@ -9126,7 +9129,7 @@ html[data-motion-style='heritage'] {
   html[data-motion-style='heritage'] .button:focus-visible,
   html[data-motion-style='heritage'] input:focus-visible,
   html[data-motion-style='heritage'] select:focus-visible {
-    outline: 2px solid #b5885c;
+    outline: var(--focus-width) solid var(--color-foreground);
     outline-offset: 3px;
   }
 }
```

Líneas tras la edición: comentario E1 `9102-9104`; technical `9105-9110` con el outline en `9108` (offset 2px en `9109`); heritage con el outline en `9132` (offset 3px en `9133`). El archivo resultante es idéntico (`diff`) al `base-after.css` de la R-D. No se tocó la regla de atelier, ni selectores, ni offsets, ni hovers.

## 3. Archivos del arnés (`agent-comms/outbox-claude/harness-A-03-001/`, C-6)

| Archivo | Contenido |
| --- | --- |
| `focus-contrast.mjs` | Arnés. `import { chromium } from '@playwright/test'`, sin rutas absolutas ni de scratch (`grep -n -E "/home/\|/tmp/\|scratchpad"` sin resultados). Uso: `node .../focus-contrast.mjs <css> config/settings_data.json [--label X]` o `<css> --rules`. |
| `before.txt` | Salida sobre `git show eb7cca7:assets/base.css`. 867 líneas, determinista, sin fechas ni entorno. |
| `after.txt` | Salida sobre `assets/base.css` modificado. |
| `rules-count.txt` | Conteo recursivo de reglas CSS y comprobación del `cssText` de las dos reglas editadas. |

Matriz: 3 presets × 3 estilos × 2 preferencias × 5 esquemas × 9 controles = 810 filas. Controles: `.button`, `.button--secondary`, `input[type=email]`, `select`, `input[type=checkbox]`, input del stepper y un `.button` de 120 caracteres con ancho 200px (objetivo, 7), más `a` e `.icon-button` (regresión, 2). Cada control se alcanza con `Tab` real y se exige `:focus-visible`. Fallo = ratio < 3, estilo ≠ solid, grosor < 2px o sin `:focus-visible`.

Reproducir el «antes»: `git show eb7cca7:assets/base.css > <ruta>` y pasar esa ruta al arnés.

## 4. Criterios de §4.1 (con las correcciones de la R-D)

**Criterio 1, ESTÁTICO.** `git diff --stat eb7cca7 -- assets/base.css`: 1 archivo, 5 inserciones, 2 borrados. Demuestra el tamaño del cambio; no su efecto.

**Criterio 2, ESTÁTICO.** `grep -n -E "outline: 2px solid #(2b2b2b|b5885c)" assets/base.css` → sin salida, `exit=1`.

**Criterio 3, ESTÁTICO.** `grep -n -E "#2b2b2b|#b5885c|#333333" assets/base.css`:
```text
9084:    border-color: #2b2b2b;
9088:    box-shadow: 0 0 0 1px #2b2b2b;
9092:    outline: 1px solid #333333;
9114:    border-color: #b5885c;
9115:    color: #b5885c;
9121:    color: #b5885c;
9126:    color: #b5885c;
```
Exacto lo que fija la R-D (C-5): solo hover. `grep -n -E "^\s*--focus-width"` → `100:  --focus-width: 2px;` (única definición). Sin tokens ni hex nuevos.

**Criterio 4, SINTÉTICO (C-2 reformulado).**
```text
before.txt: filas=810 fallos=91
  fallos_por_control={"btn":13,"btn2":13,"email":13,"select":13,"checkbox":13,"stepper":13,"btnlong":13}
  combinaciones_estilo_esquema_con_fallo=13   fallos_con_reduce=0   ratio_minimo_controles_objetivo=1.09
after.txt:  filas=810 fallos=0
  fallos_por_control={}                       combinaciones_estilo_esquema_con_fallo=0
  fallos_con_reduce=0   ratio_minimo_controles_objetivo=7.58   anchos_btnlong=200
```
Sobre `eb7cca7` fallan exactamente las 13 combinaciones estilo×esquema de la tabla de §5, todas con `no-preference`: 13 × 7 controles objetivo = 91 filas (78 con los 6 controles de la R-D, más 13 del botón largo que añadí por el estado «muy largo»; 39 con los 3 controles de la directiva original). Con `reduce`: 0. Después: 0 en 810 filas. Demuestra el efecto en Chromium con fondos sólidos; no demuestra nada sobre secciones reales ni imágenes (hero `cinematic` de Archive queda en R-A).

**Criterio 5, SINTÉTICO.** `diff <(grep " | atelier | " before.txt) <(grep " | atelier | " after.txt)` → `ATELIER_IDENTICAL` (285 filas). Tampoco cambian las 405 filas con `reduce` (`REDUCE_IDENTICAL`) ni las 180 de `a` e `.icon-button` (`REGRESSION_IDENTICAL`).

**Criterio 6, SINTÉTICO (offsets).** Idénticos antes y después:
```text
btn:     atelier/no-preference=3px atelier/reduce=3px technical/no-preference=2px technical/reduce=3px heritage/no-preference=3px heritage/reduce=3px
stepper: atelier/no-preference=3px atelier/reduce=-3px technical/no-preference=2px technical/reduce=-3px heritage/no-preference=3px heritage/reduce=-3px
```
Coincide con la R-D y confirma H-2 (con `no-preference` el stepper pierde el −3px).

**Criterio 7, SINTÉTICO (paridad de parseo).** `rules-count.txt`:
```text
SINTETICO (Chromium local, sin tienda) ANTES (eb7cca7)
reglas_css=1556
regla_foco html[data-motion-style="technical"] .button:focus-visible usa_var_color_foreground=false
regla_foco html[data-motion-style="heritage"] .button:focus-visible usa_var_color_foreground=false
SINTETICO (Chromium local, sin tienda) DESPUES (A-03)
reglas_css=1556
regla_foco html[data-motion-style="technical"] .button:focus-visible usa_var_color_foreground=true
regla_foco html[data-motion-style="heritage"] .button:focus-visible usa_var_color_foreground=true
```
Demuestra que el CSS se parsea igual (ninguna regla perdida) y que las dos reglas editadas llevan la variable. Es la evidencia para el CSS, ya que Theme Check no lo inspecciona.

**Criterio 8, Theme Check (no regresión; no inspecciona `assets/base.css`).**
```text
$ npx shopify theme check
  92 files inspected with no offenses found.        (exit 0)
$ node scripts/theme-check-sanity.mjs
  [theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.   (exit 0)
```

**Criterio 9.** `node scripts/json-validate.mjs` exit 0; `node scripts/locale-key-inventory.mjs` exit 0 (`OK: todas las referencias estaticas resuelven contra los locales.`). `node --check` no aplica (sin JS). Nota: este entorno inspecciona 92 archivos, no 93 como cita la directiva; no cambia la conclusión.

## 5. Contraste antes y después (SINTÉTICO, regenerado por el arnés)

Ratio mínimo del anillo entre los 7 controles objetivo, con `no-preference`, para cada preset × estilo forzado × esquema. «Antes» = `before.txt`, «Después» = `after.txt`. Las 15 combinaciones con el estilo propio de cada preset coinciden con la tabla de la R-D (15.52, 18.88, 2.56, 2.25, 2.52…).

| Preset | Estilo forzado | Esquema | Antes | Después | |
| --- | --- | --- | --- | --- | --- |
| Sartorial | atelier | scheme-1 | 15.52 | 15.52 |  |
| Sartorial | atelier | scheme-2 | 15.65 | 15.65 |  |
| Sartorial | atelier | scheme-3 | 13.95 | 13.95 |  |
| Sartorial | atelier | scheme-4 | 7.92 | 7.92 |  |
| Sartorial | atelier | scheme-5 | 14.28 | 14.28 |  |
| Sartorial | technical | scheme-1 | 12.79 | 15.52 |  |
| Sartorial | technical | scheme-2 | 1.21 | 15.65 | **falla antes** |
| Sartorial | technical | scheme-3 | 11.49 | 13.95 |  |
| Sartorial | technical | scheme-4 | 6.53 | 7.92 |  |
| Sartorial | technical | scheme-5 | 13.46 | 14.28 |  |
| Sartorial | heritage | scheme-1 | 2.86 | 15.52 | **falla antes** |
| Sartorial | heritage | scheme-2 | 5.43 | 15.65 |  |
| Sartorial | heritage | scheme-3 | 2.57 | 13.95 | **falla antes** |
| Sartorial | heritage | scheme-4 | 1.46 | 7.92 | **falla antes** |
| Sartorial | heritage | scheme-5 | 3.01 | 14.28 |  |
| Imprint | atelier | scheme-1 | 18.88 | 18.88 |  |
| Imprint | atelier | scheme-2 | 18.09 | 18.09 |  |
| Imprint | atelier | scheme-3 | 16.87 | 16.87 |  |
| Imprint | atelier | scheme-4 | 11.14 | 11.14 |  |
| Imprint | atelier | scheme-5 | 16.67 | 16.67 |  |
| Imprint | technical | scheme-1 | 14.16 | 18.88 |  |
| Imprint | technical | scheme-2 | 1.33 | 18.09 | **falla antes** |
| Imprint | technical | scheme-3 | 12.65 | 16.87 |  |
| Imprint | technical | scheme-4 | 1.13 | 11.14 | **falla antes** |
| Imprint | technical | scheme-5 | 13.57 | 16.67 |  |
| Imprint | heritage | scheme-1 | 3.16 | 18.88 |  |
| Imprint | heritage | scheme-2 | 5.97 | 18.09 |  |
| Imprint | heritage | scheme-3 | 2.82 | 16.87 | **falla antes** |
| Imprint | heritage | scheme-4 | 3.95 | 11.14 |  |
| Imprint | heritage | scheme-5 | 3.03 | 16.67 |  |
| Archive | atelier | scheme-1 | 12.27 | 12.27 |  |
| Archive | atelier | scheme-2 | 10.46 | 10.46 |  |
| Archive | atelier | scheme-3 | 10.78 | 10.78 |  |
| Archive | atelier | scheme-4 | 7.58 | 7.58 |  |
| Archive | atelier | scheme-5 | 13.25 | 13.25 |  |
| Archive | technical | scheme-1 | 11.46 | 12.27 |  |
| Archive | technical | scheme-2 | 1.09 | 10.46 | **falla antes** |
| Archive | technical | scheme-3 | 10.07 | 10.78 |  |
| Archive | technical | scheme-4 | 1.77 | 7.58 | **falla antes** |
| Archive | technical | scheme-5 | 12.38 | 13.25 |  |
| Archive | heritage | scheme-1 | 2.56 | 12.27 | **falla antes** |
| Archive | heritage | scheme-2 | 4.09 | 10.46 |  |
| Archive | heritage | scheme-3 | 2.25 | 10.78 | **falla antes** |
| Archive | heritage | scheme-4 | 2.52 | 7.58 | **falla antes** |
| Archive | heritage | scheme-5 | 2.76 | 13.25 | **falla antes** |

Antes: 13 combinaciones bajo 3:1, las marcadas en la tabla. Después: 0, mínimo 7.58 (Archive scheme-4).

## 6. Hallazgos extra (fuera de alcance; ninguno se toca en A-03)

Clasificación de la R-D (C-1 y C-8 aplicados).

- **H-1, P2: texto de hover en heritage (WCAG 1.4.3).** `base.css:9109-9124` (tras A-03: 9112-9127; `.button:hover` en `:9113`): `.button:hover` pone `color: #b5885c` con fondo transparente. Contraste del texto sobre el fondo de sección en Archive: 2.56 (scheme-1), 2.25 (scheme-3), 2.52 (scheme-4), 2.76 (scheme-5), 4.09 (scheme-2); todos bajo 4.5:1. Controles afectados: todo `.button` (add to cart de la PDP, quick-buy de tarjeta `snippets/product-card.liquid:317,356,368,450,455`, submit de newsletter `sections/footer.liquid:71`, botones del hero `sections/hero-editorial.liquid:189,198`, submit de búsqueda predictiva) y los títulos de tarjeta en hover (`snippets/product-card.liquid:298-299`). **El header no está afectado**: `.site-header__link` no lo emite ningún archivo (R-1). Agravante táctil: el bloque no está protegido por `@media (hover: hover)` (el tema sí lo usa en `base.css:1953` y `:3005`), así que en táctil el hover puede quedarse pegado. Severidad P2 por precedente TT-28 (1.4.3 en hover, 3.33:1, P2). Parche candidato, **no aplicar en A-03**: sustituir `color: #b5885c` por `color: var(--color-foreground)` en las reglas de hover de `.button` y de `.product-card__title a`. Requiere decisión de diseño y, si se abre tarea nueva, a Johandry (D10).
- **R-2: fila `:47` del ledger (1.4.3, `cumplido`)** contradicha por H-1 en Archive. Proponer `no verificado` hasta decidir el color, en la misma decisión que abra H-1.
- **H-2, P3: los offsets por estilo pisan los de componente.** Las reglas del bloque `no-preference` (especificidad 0,2,2) ganan a `.quantity-stepper__input:focus-visible` (`outline-offset: -3px`, `base.css:2521-2524`) y a `.predictive-search__input` (`:7168`). Medido: stepper 3/2/3px con `no-preference` y −3px con `reduce`. No reduce el contraste. Parche candidato, **no aplicar en A-03**: envolver el selector de estilo en `:where(html[data-motion-style='…'])`, con regresión visual de Sartorial.
- **H-3, P3: hover de technical** usa `#2b2b2b` y `#333333` (`:9084`, `:9088`, `:9092`). Decorativo; sin parche.
- **H-4, P3: atelier usa `2px` literal** (`:9072`) en vez de `var(--focus-width)`. Equivalente; se deja (RULES §3.9). Sin parche necesario.
- **R-1, P3: selector muerto `.site-header__link`** (`base.css:9122`, tras A-03 `:9125`). Sin parche (limpieza fuera de A-03).

Sin parche listo: H-3, H-4 y R-1.

## 7. Compuertas de calidad (RULES §2)

| Compuerta | Resultado |
| --- | --- |
| Requisitos | Filas de §8. Evidencia: `assets/base.css:9108` y `:9132` y `harness-A-03-001/{before,after,rules-count}.txt`. «Theme Check pasa» no se usa como evidencia. |
| Estados degenerados | *Muy largo*: el arnés incluye un `.button` de 120 caracteres con ancho 200px; el anillo se mide en todos los esquemas (`btnlong`, 0 fallos tras el cambio; el ancho de caja se mantiene en 200). *Faltante*: un esquema con `background_gradient` usa `--gradient-background`; el anillo sigue a `--color-foreground`; hoy ningún preset lo usa (todos `''`); queda para R-A. *Vacío, uno, muchos*: no aplican (el color del anillo depende del esquema, no del contenido). |
| Consistencia | `--focus-width` con una sola definición (`:100`). Sin tokens ni hex nuevos; hex restantes solo de hover (criterio 3). Mismo token que la regla base (`:284`) y atelier (`:9072`). |
| Superficie del comerciante | No aplica: no cambia schema, labels, `t:` ni `info`. |
| Tienda real | Pendiente (§8). Máximo: `código completo`. |

## 8. Ledger (propuesta; no se edita) y matriz R-A

Propuesta para el coordinador, aplicando la decisión D-1 de la R-D: filas `:48` (1.4.11) y `:49` (2.4.7) de `cumplido` a **`código completo`** en el commit que integre A-03, con la nota: «Evidencia previa: solo atelier. A-03 (TT-02): technical y heritage usan `--color-foreground` en `assets/base.css:9108` y `:9132`; arnés SINTÉTICO `harness-A-03-001` con 0 fallos. Pendiente: R-A, matriz de §4.4 en previews Imprint y Archive.» Recalcular la cabecera con `node scripts/ledger-verify.mjs` (R-D estima 54/6 a 52/8). Fila `:47`: ver R-2.

**Pendiente de credenciales / R-A (no ejecutado, sin resultados):** matriz `preset/motion_style × control × estado × esquema efectivo × fondo (sólido o imagen) × reduce/no-preference`, con teclado (`Tab` y `Shift+Tab`) en 390 y 1280, en previews acreditados de `tema-qkqpke0j` (D13). Controles: predictive search, select de país en header y footer, newsletter del footer (scheme-2) y de la home (scheme-4), botones del hero de Archive sobre imagen con velo (medida en píxel real), add to cart, cantidad, variante, facetas, orden, stepper y checkout del drawer, quick-buy de tarjeta y anillo del stepper (O-1 de la R-D). Regresión: enlaces e `icon-button`. Estados: foco, foco con hover, `aria-disabled`. Imprint P1 condicionado (bloquea si falla); Archive P2; Sartorial regresión.

## 9. Afirmaciones falsables

1. `assets/base.css:9108` y `:9132` contienen `outline: var(--focus-width) solid var(--color-foreground);`, dentro del `@media` abierto en `:9058`; `:9102-9104` es el comentario E1.
2. `git diff --stat eb7cca7 -- assets/base.css` da 5 inserciones y 2 borrados; `assets/base.css` es idéntico al `base-after.css` de la R-D.
3. `grep -n -E "outline: 2px solid #(2b2b2b|b5885c)" assets/base.css` no devuelve nada; `#2b2b2b|#b5885c|#333333` solo en 9084, 9088, 9092, 9114, 9115, 9121, 9126.
4. `before.txt`: 810 filas, 91 fallos, 13 combinaciones, 0 con `reduce`. `after.txt`: 810 filas, 0 fallos, mínimo 7.58.
5. Las filas de atelier (285), `reduce` (405) y `a`/`icon-button` (180) son idénticas antes y después.
6. Offsets idénticos antes y después (technical 2px, heritage 3px, atelier 3px con `no-preference`).
7. `reglas_css=1556` antes y después; las dos reglas editadas contienen `var(--color-foreground)` en su `cssText`.
8. Theme Check: 92 archivos, 0 ofensas; `theme-check-sanity.mjs` exit 0.
9. `focus-contrast.mjs` importa de `@playwright/test` y no contiene rutas absolutas.
10. No se tocó ningún archivo fuera de `assets/base.css`, la carpeta del arnés y este informe.

## 10. Declaración y compuerta del literal

No se abrió `.secrets`, no se usaron tiendas, Shopify CLI contra tiendas ni gate5 (`npx shopify theme check` se ejecutó solo en local), no se leyeron ni imprimieron variables de entorno ni el literal de contraseña, no se copió código de SebastianDev017/atelier, y no hubo `git add/commit/stash/checkout/reset/push` ni cambios de schema.

```text
$ python3 -I count-two.py assets/base.css agent-comms/outbox-claude/harness-A-03-001/{focus-contrast.mjs,before.txt,after.txt,rules-count.txt} agent-comms/outbox-claude/CLAUDE-REPORT-A-03-001.md
assets/base.css=0
agent-comms/outbox-claude/harness-A-03-001/focus-contrast.mjs=0
agent-comms/outbox-claude/harness-A-03-001/before.txt=0
agent-comms/outbox-claude/harness-A-03-001/after.txt=0
agent-comms/outbox-claude/harness-A-03-001/rules-count.txt=0
agent-comms/outbox-claude/CLAUDE-REPORT-A-03-001.md=0
$ python3 -I ctx-check.py   (desde la raíz)
fuera_de_tests_vendor_axe= 0
```
