# CLAUDE-REVIEW-A-03-001: revisión D11 de la implementación de A-03 (anillo de foco por `motion_style`)

```text
ID: CLAUDE-REVIEW-A-03-001
Estado: Entregado. Veredicto: ACEPTADO CON CAMBIOS MENORES (M-1 a M-3, §6; ninguno toca código).
Decisión requerida: Coordinador Claude: aplicar M-1 a M-3 en el commit que integre A-03 (§6) y,
  en ese mismo commit, el cambio del ledger de la decisión D-1 de la R-D. Johandry: ninguna.
  No hay ningún P0 ni P1 nuevo.
Resumen en 5 líneas:
  1. El diff de assets/base.css es exactamente E1+E2+E3, con el ancla de C-5: 5 inserciones y 2 borrados,
     y nada más. Byte a byte es idéntico al base-after.css de la R-D.
  2. Arnés reejecutado: before/after/rules-count salen idénticos byte a byte a los versionados (determinista).
     Después: 810 filas y 0 fallos, con mínimo 7.58. Antes: 91 fallos (13 combinaciones × 7 controles).
  3. Sonda propia distinta (píxeles renderizados, 10 controles, esquema anidado, foco+hover): antes 156
     fallos y después 0 en 1800 filas, con mínimo 7.58; atelier, reduce y controles no objetivo idénticos.
  4. Compuerta 3: los tokens se usan como en el resto del archivo. No queda ningún color de foco fijo para
     ningún control en technical o heritage; los únicos hex que quedan son de hover (H-1, H-3).
  5. Informe veraz (45/45 filas de la tabla cuadran con el arnés). Defectos solo de forma (P3): preflight
     resumido en vez de literal, rótulos de §1.4 abreviados y un rango de línea desfasado en H-1.
Archivos tocados: solo este archivo (nuevo). Pruebas en scratch: .../scratchpad/rev-a03/ (no versionadas).
Desviaciones (Nivel 1 o Nivel 2): ninguna. La implementación es Nivel 1, como fija la directiva (§3.4).
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo de código. Hay una observación de
  proceso (M-1: la directiva en disco no lleva C-1..C-8) y notas N-1 y N-2 sin parche (§5).
Verificación (comando, resultado y qué demuestra/qué no): §1 a §4. ESTÁTICO y SINTÉTICO (Chromium local,
  sin tienda). No demuestra nada sobre previews reales, imágenes reales ni tecnología asistiva (R-A pendiente).
Lista de afirmaciones falsables numeradas: §8.
```

---

## 0. Alcance, método y estado del repositorio

Soy un revisor independiente de contexto limpio (D11): no escribí la directiva, ni la R-D, ni el código. Leí la directiva entera, la R-D `CLAUDE-REVIEW-A-03-RD-001.md` (C-1..C-8), el informe, el arnés, `AGENTS.md` y `agent-comms/RULES.md`. Del plan V4.1 me basta lo que citan la directiva y la R-D (A-03 y R-A), sin reabrir su alcance. Revisé solo A-03.

**Cambio de HEAD durante la revisión.** La revisión empezó con HEAD en `eb7cca7`. Durante la revisión, el coordinador hizo el commit de A-02 (`a6a9074`), así que ahora HEAD es `a6a9074`. Ese commit no toca nada de A-03:

```text
$ git diff --stat eb7cca7 a6a9074 -- assets/base.css agent-comms/outbox-claude/harness-A-03-001 agent-comms/outbox-claude/CLAUDE-REPORT-A-03-001.md
(sin salida, exit=0)
$ git show eb7cca7:assets/base.css | cmp - rev-a03/base-before.css && echo BEFORE_EQ_EB7CCA7
BEFORE_EQ_EB7CCA7
$ git merge-base --is-ancestor eb7cca7 HEAD && echo DESCIENDE ; git branch --show-current
DESCIENDE
lote-a
$ git diff HEAD --stat
 assets/base.css | 7 +++++--
 1 file changed, 5 insertions(+), 2 deletions(-)
```

Por tanto, `HEAD:assets/base.css` y `eb7cca7:assets/base.css` son el mismo archivo, y todas las cifras siguientes valen para las dos bases.

No abrí `.secrets` ni leí o imprimí valores de entorno, y no usé tiendas, Shopify CLI contra tiendas ni gate5. No ejecuté git de escritura y no imprimí el literal.

---

## 1. Punto 1: el diff

```text
$ git diff HEAD -- assets/base.css
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
$ cmp assets/base.css rd-a03/base-after.css && echo EQ_RD_AFTER
EQ_RD_AFTER
$ git diff eb7cca7 -- assets/base.css | grep -E "^[+-][^+-]" | wc -l
7
$ grep -nP "[^\x00-\x7F]" <(sed -n '9102,9104p' assets/base.css) ; echo "nonascii exit=$?"
nonascii exit=1
```

- **E1:** el comentario va en 9102-9104, justo antes de `html[data-motion-style='technical'] .button:focus-visible,` (9105) y tras la línea en blanco 9101, sin líneas en blanco añadidas. Es el ancla de C-5, el texto coincide literalmente con la directiva y es ASCII.
- **E2:** `:9108`. **E3:** `:9132`. Solo se sustituye la declaración `outline`. Selectores, offsets (`:9109` 2px y `:9133` 3px), la regla de atelier (`:9069-9074`, sigue con `2px` literal, como dice D-4), los hover y la posición dentro de `@media (prefers-reduced-motion: no-preference)` (`:9058`) no cambian.
- **Nada más cambió:** de las 7 líneas `+`/`-` del diff, 3 son el comentario y 4 son las dos sustituciones. Además, el archivo es idéntico al `base-after.css` que la R-D construyó aplicando E1-E3 con `assert count == 1`.
- Criterios estáticos de la directiva:
  - El criterio 2 (`grep -n -E "outline: 2px solid #(2b2b2b|b5885c)"`) da `exit=1`.
  - El criterio 3 deja los hex solo en `9084 9088 9092 9114 9115 9121 9126` (todos de hover).
  - `--focus-width` tiene una sola definición, `100:  --focus-width: 2px;`, sin redefinición en `layout/`, `sections/` ni `snippets/`.

Veredicto del punto 1: **conforme**.

---

## 2. Punto 2: arnés y sonda propia

### 2.1 Reejecución del arnés versionado (SINTÉTICO, Chromium local)

```text
$ git show HEAD:assets/base.css > rev-a03/base-before.css ; cp assets/base.css rev-a03/base-after.css
$ node agent-comms/outbox-claude/harness-A-03-001/focus-contrast.mjs rev-a03/base-before.css config/settings_data.json --label "ANTES (eb7cca7)" > rev-a03/before.txt
$ node …/focus-contrast.mjs rev-a03/base-after.css config/settings_data.json --label "DESPUES (A-03)" > rev-a03/after.txt
$ { node …/focus-contrast.mjs rev-a03/base-before.css --rules --label "ANTES (eb7cca7)"; node …/focus-contrast.mjs rev-a03/base-after.css --rules --label "DESPUES (A-03)"; } > rev-a03/rules-count.txt
$ for f in before.txt after.txt rules-count.txt; do cmp harness-A-03-001/$f rev-a03/$f && echo "$f IDENTICO"; done
before.txt IDENTICO
after.txt IDENTICO
rules-count.txt IDENTICO
$ grep -E "^(filas|fallos_|combin|ratio_min|anchos)" rev-a03/after.txt
filas=810 fallos=0
fallos_por_control={}
combinaciones_estilo_esquema_con_fallo=0
fallos_con_reduce=0
ratio_minimo_controles_objetivo=7.58
anchos_btnlong=200
$ diff <(grep " | atelier | " before.txt) <(grep " | atelier | " after.txt) && echo ATELIER_IDENTICAL
ATELIER_IDENTICAL 285
REDUCE_IDENTICAL 405
REGRESSION_IDENTICAL 180            (filas de `a` e `.icon-button`)
GROSOR_OFFSET_FV_IDENTICAL          (grosor, offset y :focus-visible de las 810 filas, antes = después)
```

`before.txt` repite lo que dice el informe: `filas=810 fallos=91`, 13 por cada uno de los 7 controles objetivo, 13 combinaciones, 0 con `reduce` y un mínimo de 1.09.

- **Qué demuestra:** el efecto del cambio en Chromium con fondos sólidos. Que el arnés es determinista: las salidas se regeneran idénticas byte a byte. Que atelier, `reduce` y los controles de regresión no cambian. Y que los 285 = 270 filas de atelier más las 15 líneas de resumen de atelier.
- **Qué no demuestra:** nada sobre secciones reales, imágenes reales ni el tema servido.

Higiene del arnés (C-6):

```text
$ grep -n -E "/home/|/tmp/|scratchpad|[0-9]{4}-[0-9]{2}-[0-9]{2}|T[0-9]{2}:[0-9]{2}" harness-A-03-001/* ; echo "grep exit=$?"
grep exit=1
$ sed -n '6p' harness-A-03-001/focus-contrast.mjs
import { chromium } from '@playwright/test';
$ node --version ; npx --no-install playwright --version
v22.23.4
Version 1.63.0
```

Conformidad con C-6:

- Importa `@playwright/test`.
- No contiene rutas absolutas ni de scratch, ni fechas.
- Sus salidas no llevan marca de tiempo ni datos del entorno.
- El literal cuenta 0 en cada archivo (§7).
- La lógica es correcta:
  - Llega a cada control con `Tab` real y exige `:focus-visible`.
  - El fallo se define como ratio < 3, estilo distinto de `solid`, grosor < 2px o ausencia de `:focus-visible`.
  - El mapeo de variables es el de `layout/theme.liquid:81-91`.
  - Incluye el botón largo («muy largo»).

### 2.2 Sonda propia, con un método distinto (SINTÉTICO, píxeles)

`rev-a03/rev_pixel_probe.mjs` no lee `getComputedStyle` para el color. Hace una captura real de cada control enfocado, decodifica el PNG en un `<canvas>` y muestrea el píxel del anillo frente al píxel del fondo (en el borde izquierdo, a la altura media del control). Se diferencia del arnés en tres cosas:

- **Diez controles:** `.button`, `a.button`, `input[type=email]`, `input[type=search].predictive-search__input`, `textarea`, `select`, `radio`, `summary`, `a` e `.icon-button`.
- **Esquema anidado:** un `div.color-scheme-X` dentro de una `section.color-scheme-1`, para simular un header, un drawer o un panel con esquema propio.
- **Dos estados:** foco sin hover y foco con hover real.

La matriz es de 3 presets × 3 estilos × 2 preferencias × 2 estados de hover × 5 esquemas × 10 controles = 1800 filas. Las transiciones están anuladas y `scroll-behavior` se fuerza a `auto`, porque el `scroll-behavior: smooth` de `base.css:124` desplazaba las capturas.

```text
$ node rev_pixel_probe.mjs base-before.css config/settings_data.json
PIXEL filas=1800 fallos=156
fallos_por_motion_pref_control={"technical/no-preference/btn":10,"technical/no-preference/abtn":10,"technical/no-preference/email":10,"technical/no-preference/search":10,"technical/no-preference/select":10,"technical/no-preference/radio":10,"heritage/no-preference/btn":16,"heritage/no-preference/abtn":16,"heritage/no-preference/email":16,"heritage/no-preference/search":16,"heritage/no-preference/select":16,"heritage/no-preference/radio":16}
min_ratio=1.09
$ node rev_pixel_probe.mjs base-after.css config/settings_data.json
PIXEL filas=1800 fallos=0
fallos_por_motion_pref_control={}
min_ratio=7.58
PX_ATELIER_IDENTICAL 600   PX_REDUCE_IDENTICAL 900   PX_NONTARGET_IDENTICAL 720 (link, icon-button, textarea, summary)
$ (segunda ejecución sobre base-after) cmp px-after.txt px-after2.txt && echo PX_DETERMINISTIC
PX_DETERMINISTIC
```

Lectura de los resultados:

- **Antes**, fallan 156 filas: 13 combinaciones estilo×esquema × 6 controles afectados × 2 estados de hover. Technical aporta 5 combinaciones × 2 = 10 por control y heritage 8 × 2 = 16. Son las mismas 13 combinaciones de la directiva, medidas ahora en píxeles.
- **Después**, 0 fallos con un mínimo de 7.58:1. La cifra coincide, medida en píxeles, con la del arnés y con la de la R-D.
- **Foco con hover** (no lo cubre el arnés): tampoco falla después. El hover de heritage, con fondo transparente y borde de latón, y el `box-shadow` del hover de technical no alteran el anillo.
- **Offsets con `no-preference`**: technical vale 2px en `.button`, `input`, `select` y `radio`, y 3px en `a`, `.icon-button`, `summary` y `textarea`, porque esos controles usan la regla base. Heritage vale 3px en todos. En heritage, `predictive-search__input` toma 3px en lugar de su 2px propio (`:7168`), lo que confirma H-2. A-03 no lo cambia.
- **`textarea`** no está en los selectores por estilo y conserva el anillo base con `--color-foreground`. No es un defecto.

Veredicto del punto 2: **conforme**. El mínimo después del cambio es 7.58:1 por dos métodos independientes.

---

## 3. Punto 3: consistencia (compuerta 3)

- **`--color-foreground`:** es el token del anillo en todo el archivo. `var(--focus-width) solid var(--color-foreground)` aparece 10 veces en `eb7cca7` y 12 ahora; las dos nuevas son E2 y E3. La regla base (`:284`) y las de componentes usan la misma forma. No se crean tokens ni hex.
- **`--focus-width`:** tiene una sola definición (`:100`). Con E2 y E3, technical y heritage adoptan la forma mayoritaria. Quedan dos literales `2px solid var(--color-foreground)`:
  - `:9072`, atelier: es H-4 (P3), se deja por D-4 y RULES §3.9.
  - `:1198`, `.product-gallery__thumbnail[aria-pressed='true']`: es un indicador de selección, no de foco, así que queda fuera de la familia (N-2, sin acción).
- **Colores de foco fijos que quedan:** ninguno, en ningún control y con ningún estilo.

```text
$ grep -n -E "outline(-color)?\s*:" assets/base.css | grep -v -E "var\(--color-foreground\)|outline:\s*(none|0)\b|outline-offset"
3068:    outline: 2px solid CanvasText;
3074:      outline: 2px solid CanvasText;
9092:    outline: 1px solid #333333;
$ grep -rn -E "outline[^;]*#[0-9a-fA-F]{3,6}|outline[^;]*rgb" --include=*.liquid --include=*.css --include=*.js sections snippets layout assets blocks
assets/base.css:9092:    outline: 1px solid #333333;
```

Clasificación de lo que queda:

- **`:3068` y `:3074` (`CanvasText`):** son de `forced-colors`, el color de sistema correcto. Sin acción.
- **`:9092`:** es el `outline` de `.product-card:hover .product-card__media` de technical, un hover decorativo (H-3, P3). No es foco.
- **Foco de componentes:** las 47 líneas con `focus-visible` (46 en `eb7cca7`; la nueva es el texto del comentario E1, N-1) pintan el anillo con `--color-foreground` o cambian el fondo o el `box-shadow` con `--color-background` o `--color-surface` (`:600`, `:3301`, `:4069`, `:4623`, `:7214`, `:8563`). Ninguna fija un color.
- **Controles que pedía revisar:**
  - `a`, `.icon-button`, `summary` y `textarea`: usan la regla base y la sonda de píxeles los da idénticos antes y después.
  - Campos de búsqueda: `input[type=search]` queda cubierto por la regla de `input` de cada estilo.
  - Controles del cart drawer: no tienen reglas propias con color fijo.
- **Otros archivos:** no hay más CSS que `assets/base.css`, y ningún `.liquid` ni `.js` fija el color de un `outline`.

Veredicto del punto 3: **conforme**. No hay ningún control con foco fijo sin cubrir.

---

## 4. Punto 4: el informe

| Aspecto | Resultado |
| --- | --- |
| Cabecera RULES §1.4 | Tiene los nueve campos, pero dos rótulos están abreviados: «Hallazgos extra:» (falta «fuera de alcance (con parche listo)») y «Verificación:» (falta «(comando, resultado y qué demuestra/qué no)»). La abreviatura viene de la directiva §7. **P3 (M-2).** |
| Salidas literales (RULES §1.3) | El diff, los criterios 2-7 y la compuerta del literal son literales. En cambio, el **paso 4 del preflight** (sed y grep de localizadores) y el **paso 5** (versiones) se resumen en prosa, en lugar de pegar su salida como pedía la directiva §1. Los criterios 8 y 9 van recortados. Las afirmaciones resumidas son ciertas (las reverifiqué: §1, §2.1 y `node`/`playwright` 22.23.4 y 1.63.0), así que no hay daño material. **P3 (M-2).** |
| Afirmaciones | Las 10 de §9 son ciertas: §1, §2 y §3 lo verifican. La tabla de §5 es correcta: **45/45 filas coinciden** con los resúmenes de `before.txt` y `after.txt`, y las 13 marcadas «falla antes» son exactamente las que tienen < 3. Theme Check: `92 files inspected with no offenses found.` (exit 0, reejecutado localmente y sin tienda). No reejecuté `theme-check-sanity.mjs`. La afirmación 10 es coherente con `git status`: en el árbol solo hay `base.css` modificado y los archivos nuevos de A-03, además de archivos no rastreados de otras tareas. |
| Estado | `código completo` (D22). En ningún sitio se declara `cumplido`. La matriz R-A queda pendiente, sin resultados inventados, e incluye O-1. |
| Hallazgos | **H-1 (P2):** bien descrito y conforme a C-1. No usa el header ni `.site-header__link` como superficie, lista los controles reales, señala el agravante táctil (sin `(hover: hover)`), cita el precedente TT-28 y R-2, e incluye el parche candidato marcado «no aplicar en A-03». Única errata: «`base.css:9110-9124` (tras A-03: 9112-9127)» mezcla dos anclas. El bloque con su comentario va de `9109-9124` a `9112-9127`, y la regla `.button:hover` de `9110` a `9113`. **P3 (M-3).** **H-2 (P3):** bien descrito, con medida y parche `:where(...)`. **H-3 y H-4 (P3):** bien descritos. **R-1 y R-2:** bien descritos. La línea «Sin parche listo: H-3, H-4 y R-1» es honesta (C-8). |
| Desviación de preflight | **Razonable.** El paso 1 de la directiva solo manda parar si hay cambios ajenos en `assets/base.css`. Los cuatro archivos modificados eran de A-02, y el coordinador acaba de hacer su commit en `a6a9074` sin `base.css` (§0). Acotar la comprobación a `base.css` cumple la parada que pide la directiva y el espíritu de C-4. Además, el informe la declara. La «desviación de conteo» (91 en lugar de 78) no lo es: es el 13 × N de C-2 con el botón largo que pide la compuerta de estados degenerados (directiva §4.3). |
| Arnés frente a §4.2 | La directiva preveía `[--json salida.json]`. El arnés no implementa `--json` y añade `--label` y `--rules` sin declararlo. No afecta a ninguna evidencia (P3, sin cambio obligatorio). |

---

## 5. Hallazgos de esta revisión

Ninguno P0 ni P1. Ninguno P2 nuevo: H-1 sigue siendo P2, es preexistente y queda fuera de alcance.

- **P3. M-1 (proceso, coordinador):** la directiva en disco no tiene aplicados C-1..C-8:
  - `CLAUDE-DIRECTIVA-A-03-001.md:5` sigue en «Estado: Borrador para R-D».
  - `:52` conserva `git switch -c lote-a eb7cca7` (C-3).
  - `:238` dice «exactamente las 39 filas» (C-2).
  - `:340` mantiene la frase del header en H-1 (C-1).

  El implementador declara que aplicó C-1..C-8 («donde difieren, manda la R-D») y en la práctica lo hizo. Pero D-2 de la R-D prevé versionar «la directiva corregida».
- **P3. M-2 (informe):** el preflight (pasos 4 y 5) está en prosa y no como salida literal, y dos rótulos de la cabecera §1.4 van abreviados.
- **P3. M-3 (informe):** el rango de línea de H-1 está desfasado (§4).
- **N-1 (nota, sin acción):** el comentario E1 contiene `:focus-visible`, así que `grep -c focus-visible assets/base.css` pasa de 46 a 47. Cualquier recuento futuro por grep debe saberlo.
- **N-2 (nota, sin acción):** `:1198` usa `2px` literal en un indicador de selección (`aria-pressed`), no de foco. No es de la familia H-4.

---

## 6. Veredicto: **ACEPTADO CON CAMBIOS MENORES**

El código (E1-E3) se acepta tal cual: es exacto, mínimo y Nivel 1, sin regresión en atelier, `reduce` ni los controles no objetivo, y deja 0 fallos con un mínimo de 7.58:1 por dos métodos. Cambios menores, ninguno en `assets/base.css` ni en el arnés:

- **M-1 (coordinador, antes o en el commit de A-03):** aplicar C-1..C-8 a `CLAUDE-DIRECTIVA-A-03-001.md` y poner `Estado:` en «aprobada con cambios (R-D)». Como alternativa equivalente, añadir al inicio de la directiva una nota: «Corregida por CLAUDE-REVIEW-A-03-RD-001 C-1..C-8; donde difieran, manda la R-D».
- **M-2 (informe):**
  - pegar en §1 la salida literal de los comandos del paso 4 (sed y los cinco grep) y del paso 5 (`node --version`, `npx playwright --version`);
  - completar los rótulos «Hallazgos extra fuera de alcance (con parche listo):» y «Verificación (comando, resultado y qué demuestra/qué no):».
- **M-3 (informe, §6 H-1):** cambiar «`base.css:9110-9124` (tras A-03: 9112-9127)» por «`base.css:9109-9124` (tras A-03: `9112-9127`; regla `.button:hover` en `:9113`)».

Recordatorio de la R-D, sin cambios:

- En el mismo commit que integre A-03, el coordinador pasa las filas `:48` y `:49` del ledger a `código completo`, con la nota de D-1 y las líneas `assets/base.css:9108` y `:9132`.
- Después recalcula la cabecera con `node scripts/ledger-verify.mjs`.
- `a6a9074` no tocó el ledger, así que las líneas siguen siendo las mismas.

---

## 7. Compuerta del literal y ctx-check

El contador es `rev-a03/count-review.py`, copia sin cambios de `scratchpad/count-two.py`. Deriva el literal solo en memoria, a partir de `count-literal.py`, sin `.secrets` ni entorno, e imprime solo `ruta=N`. Se ejecuta desde la raíz del repositorio, después de escribir este archivo:

```text
$ python3 -I rev-a03/count-review.py assets/base.css agent-comms/outbox-claude/harness-A-03-001/focus-contrast.mjs agent-comms/outbox-claude/harness-A-03-001/before.txt agent-comms/outbox-claude/harness-A-03-001/after.txt agent-comms/outbox-claude/harness-A-03-001/rules-count.txt agent-comms/outbox-claude/CLAUDE-REPORT-A-03-001.md agent-comms/outbox-claude/CLAUDE-REVIEW-A-03-001.md
assets/base.css=0
agent-comms/outbox-claude/harness-A-03-001/focus-contrast.mjs=0
agent-comms/outbox-claude/harness-A-03-001/before.txt=0
agent-comms/outbox-claude/harness-A-03-001/after.txt=0
agent-comms/outbox-claude/harness-A-03-001/rules-count.txt=0
agent-comms/outbox-claude/CLAUDE-REPORT-A-03-001.md=0
agent-comms/outbox-claude/CLAUDE-REVIEW-A-03-001.md=0
$ python3 -I ctx-check.py        (desde la raíz)
fuera_de_tests_vendor_axe= 0
```

---

## 8. Afirmaciones falsables

1. `git diff HEAD -- assets/base.css` tiene 5 inserciones y 2 borrados: el comentario E1 en `:9102-9104` (ASCII, antes de `:9105`) y `outline: var(--focus-width) solid var(--color-foreground);` en `:9108` y `:9132`. No cambia nada más, y el archivo es idéntico a `rd-a03/base-after.css`.
2. `a6a9074` (commit de A-02, hecho durante esta revisión) no modifica `assets/base.css`, el arnés ni el informe de A-03; `HEAD:assets/base.css` es igual a `eb7cca7:assets/base.css`.
3. Al reejecutar el arnés se obtienen `before.txt`, `after.txt` y `rules-count.txt` idénticos byte a byte a los versionados. Después: `filas=810 fallos=0`, mínimo 7.58. Antes: `filas=810 fallos=91`, 0 fallos con `reduce`.
4. Las filas de atelier (285 líneas), las de `reduce` (405) y las de `a`/`.icon-button` (180) son idénticas antes y después. También lo son el grosor, el offset y `:focus-visible` de las 810 filas.
5. La sonda de píxeles propia da 156 fallos antes (13 combinaciones × 6 controles × 2 estados de hover) y 0 después, con un mínimo de 7.58 en 1800 filas. Atelier (600), `reduce` (900) y los controles no objetivo (720) son idénticos, y es determinista.
6. Fuera de `forced-colors` (`CanvasText`, `:3068`, `:3074`), ninguna declaración `outline` de ningún archivo del tema usa un color fijo salvo `:9092`, que es hover de technical (H-3).
7. `--focus-width` se define solo en `assets/base.css:100`. `var(--focus-width) solid var(--color-foreground)` aparece 10 veces en `eb7cca7` y 12 en la copia de trabajo.
8. Las 45 filas de la tabla de §5 del informe coinciden con los resúmenes de `before.txt` y `after.txt`, y las 13 marcadas «falla antes» son exactamente las que tienen < 3.
9. `npx shopify theme check` (local) da `92 files inspected with no offenses found.` con exit 0.
10. `CLAUDE-DIRECTIVA-A-03-001.md:5`, `:52`, `:238` y `:340` no reflejan la R-D (estado de borrador, C-3, C-2 y C-1 respectivamente; M-1).
11. El literal cuenta 0 en `assets/base.css`, en los cuatro archivos del arnés, en el informe y en esta revisión. ctx-check da 0 fuera de axe.
12. Esta revisión no abrió `.secrets`, no leyó ni imprimió valores de entorno, no usó tiendas, Shopify CLI contra tiendas ni gate5, no ejecutó git de escritura y no imprimió el literal.
