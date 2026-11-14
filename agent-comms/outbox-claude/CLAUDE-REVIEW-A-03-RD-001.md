# CLAUDE-REVIEW-A-03-RD-001: R-D de `CLAUDE-DIRECTIVA-A-03-001` (anillo de foco por `motion_style`)

```text
ID: CLAUDE-REVIEW-A-03-RD-001
Estado: Entregado. Veredicto: APROBADA CON CAMBIOS (C-1 a C-8, §6).
Decisión requerida: Coordinador Claude: aplicar C-1 a C-8 a la directiva y entregarla al implementador
  sin nueva R-D (son correcciones de redacción, conteo y procedimiento; no cambian la solución ni la
  lista de archivos). Johandry: ninguna ahora. H-1 se clasifica P2 (no P0/P1): D10 no obliga a parar.
  Ampliar A-03 para corregir H-1 sí sería un cambio fuera del plan y entonces requeriría a Johandry.
Resumen en 5 líneas:
  1. Defecto confirmado en eb7cca7: base.css:9105 `outline: 2px solid #2b2b2b` (technical) y :9129
     `outline: 2px solid #b5885c` (heritage), dentro de `@media (prefers-reduced-motion: no-preference)` (:9058).
  2. Tabla de §2.4 recalculada con script propio: las 75 cifras coinciden a 2 decimales. Sonda Chromium
     propia (8 controles, 720 filas): 13 combinaciones estilo×esquema fallan, todas con no-preference.
  3. Solución `var(--focus-width) solid var(--color-foreground)`: 0 fallos en 720 filas, mínimo 7.58:1;
     atelier, `reduce` y controles de regresión idénticos antes/después. Es la mejor opción sin tokens nuevos.
  4. Lista cerrada aceptada, incluido el arnés en `agent-comms/outbox-claude/harness-A-03-001/` (con C-6).
  5. H-1 = P2; H-2, H-3 y H-4 = P3. La afirmación de H-1 sobre el header es falsa (`.site-header__link`
     no se emite en ninguna plantilla): C-1.
Archivos tocados: solo este archivo (nuevo). Pruebas en scratch: .../scratchpad/rd-a03/.
Desviaciones (Nivel 1 o Nivel 2): ninguna. La directiva es Nivel 1 (confirmado, §3).
Hallazgos extra fuera de alcance (con parche listo): R-1 (selector muerto `.site-header__link`, P3,
  sin parche: decisión de limpieza fuera de A-03) y R-2 (fila :47 del ledger contradicha por H-1), §5.
Verificación (comando, resultado y qué demuestra/qué no): §1 y §2. ESTÁTICO y SINTÉTICO (Chromium local,
  sin tienda). No demuestra nada sobre previews reales, imágenes reales ni tecnología asistiva.
Lista de afirmaciones falsables numeradas: §8.
```

---

## 0. Alcance y método

Revisor independiente de contexto limpio (D11). No escribí la directiva ni escribiré el código. Leí la directiva entera, `AGENTS.md`, `agent-comms/RULES.md` (§1.3-1.4, §3.5, §3.6, §3.8, §3.9, §5), el plan V4.1 (`:193`, `:243-245`, §5.1 `:338-347`, R-A `:376`, `:382`, §6 `:384-396`), la escala de prioridad de `GPT-AUDIT-THREE-THEMES-TODO-EN-UNO-001.md:323-330` (la que usa el plan), TT-02 (`:378-391`) y el precedente TT-28 (`:677-686`), `docs/requirements-ledger.md:47-49` y las decisiones D9-D24. Verifiqué en el disco cada localizador, recalculé los contrastes con un script propio y escribí una sonda Chromium propia, distinta de la del redactor (más controles, hover y comparación de filas). No se abrió `.secrets`, no se leyeron variables de entorno con credenciales, no se usaron tiendas ni gate5, no se imprimió el literal y no hubo git de escritura.

Herramientas propias (scratch, no versionadas): `rd_contrast.py` (ESTÁTICO), `rd_probe.mjs` (SINTÉTICO), `base-before.css` (`git show eb7cca7:assets/base.css`), `base-after.css` (E1-E3 aplicadas con `assert count == 1`), `count-review.py` (copia de `count-two.py`).

---

## 1. Punto 1: defecto y tabla de contrastes

### 1.1 Localizadores (ESTÁTICO)

```text
$ git rev-parse lote0/base-09f8342
eb7cca797f9de142089c6c14daaa5ed449597f9f
$ grep -n -E "#2b2b2b|#b5885c|#333333" assets/base.css
9084:    border-color: #2b2b2b;
9088:    box-shadow: 0 0 0 1px #2b2b2b;
9092:    outline: 1px solid #333333;
9105:    outline: 2px solid #2b2b2b;
9111:    border-color: #b5885c;
9112:    color: #b5885c;
9118:    color: #b5885c;
9123:    color: #b5885c;
9129:    outline: 2px solid #b5885c;
$ grep -n -E "^\s*--focus-width" assets/base.css ; grep -rn "focus-width" layout sections snippets
100:  --focus-width: 2px;
```

Confirmado también: `:283-286` (regla base con `var(--focus-width) solid var(--color-foreground)` y offset 3px), `:9058` (abre `no-preference`), atelier `:9069-9074`, technical `:9102-9107`, heritage `:9126-9131`, `layout/theme.liquid:3` y `:81-91` (mapeo de variables), `config/settings_data.json:79,157,234,311`, y que `current` tiene los mismos `color_schemes` que Sartorial. Los ocho localizadores de reglas de componente de §3.2 (`:1418` … `:9708`) contienen `outline: var(--focus-width) solid var(--color-foreground);`. `grep -c focus-visible` = 46. Los esquemas por plantilla de §2.3 coinciden con `listings/{imprint,archive}/templates/*.json`, y los de grupo con `header-group.json:20,48` y `footer-group.json:9`.

### 1.2 Contrastes recalculados (ESTÁTICO, `rd_contrast.py`, luminancia WCAG 2.x, umbral 3:1)

```text
preset|motion|scheme|bg|fg|tech|her|own_before|after_fg|fg_vs_surface|fg_vs_surface_subtle|fg_vs_button|her_text_hover(1.4.3)|button_label_vs_bg(currentColor)
Sartorial|atelier|scheme-1|#F7F3EA|#1D1B18|12.79|2.86|15.52|15.52|13.80|12.69|1.00|2.86|1.11
Sartorial|atelier|scheme-2|#1D1B18|#F8F4EB|1.21|5.43|15.65|15.65|13.39|11.82|1.98|5.43|1.00
Sartorial|atelier|scheme-3|#EDE7DA|#1D1B18|11.49|2.57|13.95|13.95|12.46|11.51|1.00|2.57|1.23
Sartorial|atelier|scheme-4|#D8A85D|#1D1B18|6.53|1.46|7.92|7.92|7.17|6.65|1.00|1.46|1.96
Sartorial|atelier|scheme-5|#FBF9F4|#2A2621|13.46|3.01|14.28|14.28|12.73|11.83|1.14|3.01|1.05
Imprint|technical|scheme-1|#FFFFFF|#111111|14.16|3.16|14.16|18.88|16.72|15.27|1.00|3.16|1.00
Imprint|technical|scheme-2|#111111|#FAFAFA|1.33|5.97|1.33|18.09|15.79|14.13|1.00|5.97|1.00
Imprint|technical|scheme-3|#F2F2F2|#111111|12.65|2.82|12.65|16.87|14.85|13.77|1.00|2.82|1.12
Imprint|technical|scheme-4|#2E3440|#F0F2F5|1.13|3.95|1.13|11.14|9.40|8.33|1.00|3.95|1.00
Imprint|technical|scheme-5|#FAFAFA|#1A1A1A|13.57|3.03|13.57|16.67|14.87|13.69|1.08|3.03|1.04
Archive|heritage|scheme-1|#EFE6D9|#2E241C|11.46|2.56|2.56|12.27|10.96|10.23|2.60|2.56|1.17
Archive|heritage|scheme-2|#2F3327|#EFE6D9|1.09|4.09|4.09|10.46|8.84|7.93|2.56|4.09|1.26
Archive|heritage|scheme-3|#E4D8C6|#2E241C|10.07|2.25|2.25|10.78|9.68|9.01|2.60|2.25|1.33
Archive|heritage|scheme-4|#6E482F|#FFF8F0|1.77|2.52|2.52|7.58|6.46|5.87|1.00|2.52|1.00
Archive|heritage|scheme-5|#F5EFE5|#2E241C|12.38|2.76|2.76|13.25|11.88|11.01|2.60|2.76|1.09
combos estilo-propio que fallan: 6  combos fijos (tech/her en cualquier preset) que fallan: 13
min despues fg/bg: 7.58  min fg vs surfaces: 5.87
combinaciones (preset x esquema x estilo fijo) <3: 13 -> x3 controles = 39
scrim70 px=0 -> fondo 0: her 6.64 fg(Archive s2 #EFE6D9) 16.99
scrim70 px=255 -> fondo 76: her 2.72 fg(Archive s2 #EFE6D9) 6.95
```

Qué demuestra: las 75 cifras de la tabla de §2.4 (5 columnas × 15 esquemas) coinciden exactamente, igual que el peor caso posterior (7.58, Archive scheme-4) y el peor caso contra `--color-surface`/`--color-surface-subtle` (5.87). Las alternativas de §3.3 también coinciden: `--color-border` 3.00-4.53 (3.00 Imprint scheme-3, 3.03 Sartorial scheme-5), `--color-control-border` mínimo 3.37 y `currentColor` ≤ 1.96. Única discrepancia: la cota del velo es 76.5/255. Con 76 da 2.72 y 6.95; con 77 (#4D4D4D, lo que usó el redactor) da 2.67 y 6.84. No cambia ninguna conclusión (opcional O-2). Qué no demuestra: fondos con imagen real ni secciones renderizadas.

### 1.3 Sonda SINTÉTICA propia (Chromium local, sin tienda)

`rd_probe.mjs`: 3 presets × 3 estilos × 2 preferencias × 5 esquemas × 8 controles (`.button`, `.button--secondary`, `input[type=email]`, `select`, `input[type=checkbox]`, `a`, `.icon-button`, `.quantity-stepper__input`). La sonda llega a cada control con `Tab` real y comprueba `:focus-visible`.

```text
$ node rd_probe.mjs base-before.css config/settings_data.json
SINTETICO filas=720 fallos_controles_objetivo=65
combos estilo x esquema con fallo: 13
fallos por control: {"btn":13,"btn2":13,"input":13,"select":13,"checkbox":13}
regresion a/icon fallos: 0 colores distintos de fg? 0
(conteo con el input del stepper incluido: 13 por control x 6 controles = 78; 0 fallos con reduce)
$ node rd_probe.mjs base-after.css config/settings_data.json
SINTETICO filas=720 fallos_controles_objetivo=0
min ratio controles objetivo: 7.58
offsets stepper: atelier/no-preference=3px atelier/reduce=-3px technical/no-preference=2px technical/reduce=-3px heritage/no-preference=3px heritage/reduce=-3px
offsets btn: atelier/no-preference=3px atelier/reduce=3px technical/no-preference=2px technical/reduce=3px heritage/no-preference=3px heritage/reduce=3px
$ diff <(grep " | atelier | " before-full.txt) <(grep " | atelier | " after-full.txt) && echo ATELIER_IDENTICAL
ATELIER_IDENTICAL
$ diff <(grep " | reduce | " before-full.txt) <(grep " | reduce | " after-full.txt) && echo REDUCE_IDENTICAL
REDUCE_IDENTICAL
(a / icon-button: 180 filas idénticas antes y después) REGRESSION_CONTROLS_IDENTICAL
$ diff base-before.css base-after.css
9101a9102,9104  (+3 líneas de comentario E1)
9105c9108       (E2)
9129c9132       (E3)
$ grep -n -E "#2b2b2b|#b5885c|#333333" base-after.css
9084 9088 9092 9114 9115 9121 9126   (criterio 3 de la directiva: exacto)
```

La sonda del redactor (`a03/probe.mjs`) cubre tres controles y da 39 fallos, que es lo que afirma la directiva. Lo confirmo. Pero con la matriz ampliada que pide la propia directiva en §4.2 salen 78. El criterio 4 queda mal formulado: C-2.

---

## 2. Punto 2: la solución

1. **≥3:1 en los 15 esquemas de los tres presets:** sí, mínimo 7.58:1, y 5.87:1 contra las superficies derivadas. También sobre el velo del hero `cinematic` de Archive: 6.84-6.95 en la cota clara, frente a 2.67-2.72 antes.
2. **Botón primario:** con offset de 2-3px, el anillo queda separado del relleno por una franja del fondo de sección, así que sus dos colores adyacentes son ese fondo. La sonda mide el fondo de la sección y no el del botón, y esa es la comparación correcta. Cuando `--color-button` coincide con el texto (por ejemplo Sartorial scheme-1), el anillo se lee como un segundo borde separado. Es lo que atelier ya hace hoy, sin regresión. Para 2.4.13, que es informativo: el anillo tiene 2px de grosor en todo el perímetro y el cambio entre foco y reposo en esos píxeles es fondo→texto (≥7.58).
3. **Carácter de cada `motion_style`:** se conservan los offsets (technical 2px, heritage 3px, atelier 3px), las transiciones y todos los hover. Se pierde el anillo de latón de heritage, que solo era legible en scheme-2. Es una pérdida aceptable frente a WCAG 1.4.11.
4. **Alternativas sin tokens nuevos:** `--color-foreground` es la mejor. Revisé además `--color-button` (`--color-accent`): mínimo 4.09 en los 15 esquemas, y conservaría el latón en Archive scheme-2. La descarto como obligatoria porque depende de un ajuste del comerciante sin requisito propio de contraste (un botón de contorno puede estar a menos de 3:1), mientras que el texto está obligado a 4.5:1. Puede añadirse a la tabla de §3.3 (opcional O-3). `currentColor` y `--color-border` quedan refutadas con las cifras de §1.2.
5. **Nivel 1:** confirmado. No cambia ningún `id`, `default`, opción ni archivo fuera de lista, y el texto `info` de `motion_style` no promete nada sobre el foco (`locales/en.default.schema.json:21`). La sintaxis `outline: var(--focus-width) solid …` se resuelve a `2px` en Chromium (sonda: `w=2px` en todas las filas posteriores).

---

## 3. Punto 3: lista cerrada y arnés

- Se acepta la lista: `assets/base.css` (solo E1-E3), `agent-comms/outbox-claude/harness-A-03-001/` y `CLAUDE-REPORT-A-03-001.md`.
- **Arnés versionado en `harness-A-03-001/`: ACEPTADO.** Hay 27 carpetas `harness-*` previas en `agent-comms/outbox-claude/` (`ls … | grep -i harness`). `scripts/package-theme-zip.mjs:78-80` (`INCLUDE_DIRS`) no incluye `agent-comms/`, así que no entra en el ZIP. Además, versionarlo es necesario para que R-A pueda reproducir la matriz. Condiciones (C-6):
  - importar Playwright como `import { chromium } from '@playwright/test'`, que es la devDependency declarada en `package.json:23` y resuelve la 1.63.0 en este entorno (`node -e "import('@playwright/test')…"` → `ok function 1.63.0`), y no desde `<repo>/node_modules/playwright/index.mjs`;
  - sin rutas absolutas a `/home/…` ni al scratch en archivos versionados;
  - las salidas (`before.txt`, `after.txt`, `rules-count.txt`) son texto determinista y no llevan marcas de tiempo ni entorno;
  - el literal cuenta 0 en cada archivo nuevo.

---

## 4. Punto 4: decisiones

| Duda | Decisión | Base |
| --- | --- | --- |
| **D-1. Ledger :48 (1.4.11) y :49 (2.4.7)** | Ninguna de las dos puede seguir en `cumplido`. RULES §5 exige que esté «100 % satisfecho», y la evidencia de las dos filas solo cubre atelier (Couture/Sartorial), mientras que TT-02 y esta R-D demuestran fallos en dos presets entregados. **En el mismo commit que integre A-03** (tras la revisión D11 de la implementación), el coordinador, como responsable bajo D9, pasa las dos filas a **`código completo`**. Conserva la evidencia histórica y añade esta nota: «Evidencia previa: solo atelier. A-03 (TT-02): technical y heritage usan `--color-foreground` en `assets/base.css:<líneas tras E2/E3>`; arnés SINTÉTICO `harness-A-03-001` con 0 fallos. Pendiente: R-A, matriz de §4.4 en previews Imprint y Archive (dueño: Claude)». Después recalcula la cabecera con `node scripts/ledger-verify.mjs` (hoy 54/6; pasaría a 52/8, a verificar con el script). El implementador no toca el ledger. | RULES §3.8 y §5; AGENTS.md compuerta 5; plan `:396` («se propone `código completo`»; la actualización la hace su responsable); D22 (máximo sin tienda). |
| **D-2. Commit** | Confirmado. El implementador no hace commit, push ni force. El coordinador hace commit en `lote-a` tras la revisión D11 de la implementación aceptada (D11, D16). En ese commit van la directiva corregida, esta R-D, el informe, el arnés y `base.css`, más el ledger, `BOARD.md` y `CLAUDE-CLOUD-STATUS.md` que actualiza él. Antes del push, el literal debe contar 0 (D12). El mismo procedimiento vale para las directivas paralelas, y por eso C-3 alinea la creación de la rama con A-02. | D11, D12, D16, D24. |
| **D-3. Carpeta del arnés** | Aceptada con C-6 (§3). | Precedente de 27 carpetas `harness-*`; fuera del ZIP. |
| **D-4. `2px` literal de atelier (`:9072`)** | Se deja sin tocar. Equivale a `var(--focus-width)` y no tocarlo garantiza que Sartorial tenga diff cero (criterio 5). Es deuda de consistencia P3 (H-4), no un defecto. | RULES §3.9; compuerta 3 sin impacto funcional. |
| **D-5. Prioridad** | Se mantiene la del plan, sin reabrirla: **Imprint P1 condicionado** (el footer scheme-2 a 1.33 y la newsletter scheme-4 a 1.13 son barreras serias en la configuración por defecto del preset, según la escala `TODO-EN-UNO:328`, y bloquea R-A si falla) y **Archive P2** (2.25-2.76: visible pero bajo umbral, «moderada»). El «condicionado» se levanta al reproducirlo en preview real (R-A). Un solo cambio corrige los dos, y la diferencia de prioridad solo rige el bloqueo en R-A, como dice §4.4. | Plan `:193`; escala §6.1. |
| **H-1 dentro de A-03** | No se amplía A-03. Se registra como hallazgo P2 con dueño (coordinador Claude) y se plantea a Johandry en el siguiente punto de decisión natural, porque elegir el color de hover de heritage es una decisión de diseño y abrir una tarea nueva es un cambio de plan (D10). No bloquea A-03. | D10; RULES §3.6. |

---

## 5. Punto 5: clasificación de H-1 a H-4 (y hallazgos propios R-1 y R-2)

Escala aplicada: `GPT-AUDIT-THREE-THEMES-TODO-EN-UNO-001.md:323-330` (P0: impide el envío o rompe la compra de forma generalizada; P1: barrera seria en configuración por defecto, entre otros; P2: barrera moderada o defecto acotado; P3: higiene).

### H-1: texto de hover en heritage → **P2** (no es P0 ni P1; D10 no obliga a parar)

- **Selectores verificados** (bloque `no-preference`, eb7cca7):
  - `:9110-9115` `html[data-motion-style='heritage'] .button:hover:not([disabled])`: `color: #b5885c; background: transparent; border-color: #b5885c`.
  - `:9117-9120` `.product-card:hover .product-card__title a`: `color: #b5885c` (y cursiva).
  - `:9122-9124` `.site-header__link:hover`.
- **Solo en hover, no en reposo ni en foco:** ninguno de los tres selectores usa `:focus`. La sonda lo confirma: el foco con teclado no cambia el texto.
- **Controles afectados:** todo `.button`, primario y secundario, también en `<a>`. Por ejemplo, add to cart de la PDP, quick-buy de tarjeta (`snippets/product-card.liquid:317,356,368,450,455`), submit de newsletter (`sections/footer.liquid:71`), botones del hero (`sections/hero-editorial.liquid:189,198`) y el submit de búsqueda predictiva. También los títulos de tarjeta al pasar sobre la tarjeta (`snippets/product-card.liquid:298-299`; la tarjeta no tiene fondo propio, así que el fondo es el de la sección).
- **El header NO está afectado:** `.site-header__link` no aparece en ningún `.liquid`, `.js` ni `.json` del repositorio (`grep -rn "site-header__link" --include=*.liquid --include=*.js --include=*.json .` → solo `assets/base.css:9122`). La frase de la directiva «también en el header de Archive (scheme-1)» es falsa (C-1).
- **Medida (sonda SINTÉTICA con hover real y 700 ms de espera):** el texto queda en `rgb(181,136,92)` sobre fondo transparente, y por tanto sobre el fondo de la sección. En Archive: scheme-1 2.56, scheme-3 2.25, scheme-4 2.52, scheme-5 2.76 y scheme-2 4.09. Todos están por debajo de 4.5:1, y los claros también por debajo de 3:1, así que no se salvan ni como texto grande. Sobre el velo del hero, entre 2.67 y 6.64.
- **¿Aplica 1.4.3?** Sí: el texto que se muestra en hover es texto, y el criterio se evalúa en cada estado en que se presenta. El propio plan lo trató así en TT-28 («WCAG 1.4.3 en estado hover»).
- **Por qué P2 y no P1:**
  - El precedente directo, TT-28, es 1.4.3 en hover en un preset por defecto (3.33:1) y se clasificó P2 («baja visión con ratón o lupa; no afecta a teclado»).
  - Es transitorio: el texto es legible en reposo y en foco.
  - No rompe ningún flujo de compra.
  - Agravantes que lo dejan como P2 alto, a corregir antes de R-G: el ratio está por debajo incluso de 3:1; afecta al CTA principal; y el bloque no está protegido por `@media (hover: hover)` (el tema sí lo usa en `base.css:1953` y `:3005`), así que en táctil el hover puede quedarse pegado tras el toque.
- **No es «nuevo» en sustancia:** TT-02 ya lo mencionaba («también como color de hover», `TODO-EN-UNO:380`), pero nunca se cuantificó ni se clasificó.
- **Parche candidato** (para la tarea futura, no para A-03): en `:9112` y `:9118`, `color: var(--color-foreground);` (≥7.58:1 en los 15 esquemas), conservando el borde de latón y la cursiva como rasgo de heritage. Borrar o mantener `:9122-9124` es R-1.
- **Contradice la fila `:47` del ledger** (1.4.3, `cumplido`): R-2.

### H-2: los offsets por estilo pisan los de componente → **P3**

Confirmado con la sonda: input del stepper con 3/2/3px con `no-preference` y −3px con `reduce`. Afecta también a `.predictive-search__input` (`:7168`). No reduce el contraste (el anillo sigue siendo `--color-foreground` tras A-03) y `.quantity-stepper` no tiene `overflow: hidden` (`:2492-2497`), así que el anillo no se recorta. Lo que no se cumple es la intención documentada en `:2519-2520`. P3, con comprobación visual en R-A (O-1).

### H-3: hover de technical con #2b2b2b y #333333 → **P3**

Decorativo: el estado de hover ya se comunica invirtiendo fondo y texto con tokens (`:9085-9086`, texto fg/bg ≥ 7.58). Ni 1.4.11 ni 2.4.7 exigen que el hover sea visible. Solo se registra.

### H-4: `2px` literal en atelier → **P3** (higiene; no se toca, D-4)

### R-1 (propio): selector muerto `.site-header__link` → **P3**

No lo emite ningún archivo del tema. Basta con registrarlo; su limpieza encaja en una tarea de higiene CSS, no en A-03.

### R-2 (propio): ledger `:47` (1.4.3) en `cumplido` contradicho por H-1 en Archive

Con el mismo razonamiento de D-1, `cumplido` no se sostiene. No es materia de A-03. Recomendación al coordinador: al registrar H-1, anotar la fila `:47` y proponer su estado (`no verificado` mientras la elección de color esté pendiente) en la misma decisión que abra la tarea de H-1.

---

## 6. Veredicto: **APROBADA CON CAMBIOS**

La solución, la lista de archivos, el nivel, las compuertas y la separación ESTÁTICO / SINTÉTICO / TIENDA son correctas, y todas las cifras salen reproducidas de forma independiente. Antes de entregarla al implementador hay que aplicar estos cambios obligatorios:

- **C-1. §6.3 H-1 y §6.4:**
  - eliminar «también en el header de Archive (scheme-1)» y el uso de `.site-header__link` como superficie afectada (es un selector muerto, R-1);
  - listar los controles reales de §5;
  - añadir el agravante táctil (sin `(hover: hover)`);
  - fijar la severidad **P2** con la referencia a TT-28;
  - mencionar la fila `:47` del ledger (R-2).
- **C-2. §4.1, criterio 4, y §8.7:** reformular el conteo. «Sobre `eb7cca7` fallan exactamente las 13 combinaciones estilo×esquema de §2.4, todas con `no-preference`: 39 filas con los controles `.button`, `input[type=email]` y `select`, y 13 × N con los N controles objetivo de la matriz ampliada de §4.2 (78 con `.button`, `.button--secondary`, email, select, checkbox y el input del stepper). Con `reduce`: 0. Los controles de regresión (`a`, `.icon-button`) son idénticos antes y después.» Tal como está, «exactamente las 39 filas» falla con el arnés que la propia directiva ordena construir.
- **C-3. §1, paso 2:** alinear con `CLAUDE-DIRECTIVA-A-02-001.md:32,40`. El coordinador crea `lote-a` desde `eb7cca7` antes de la entrega. Si no existe, el implementador PARA. Hay que quitar la rama `git switch -c lote-a eb7cca7` de las manos del implementador.
- **C-4. §1, paso 1:** definir «limpio» como `git status --short --untracked-files=no` vacío. Los no rastreados de `agent-comms/outbox-claude/` (directivas y R-D sin commit) no son motivo de parada. Alternativa: el coordinador hace commit de las directivas y las R-D en `lote-a` antes de entregarlas. Ahora mismo `git status --short` muestra `?? …DIRECTIVA-A-02-001.md` y `?? …DIRECTIVA-A-03-001.md`.
- **C-5. §3.1 E1:** dar un ancla exacta. Insertar las 3 líneas inmediatamente antes de `  html[data-motion-style='technical'] .button:focus-visible,` (es decir, después de la línea en blanco 9101) y sin añadir líneas en blanco. Así los criterios 1 (5 inserciones y 2 borrados) y 3 (9114, 9115, 9121, 9126) son exactos. Mi aplicación con esa ancla los cumple (§1.3).
- **C-6. §4.2:** usar `import { chromium } from '@playwright/test'`; no poner rutas absolutas en archivos versionados; salidas deterministas; literal = 0 en los archivos del arnés (§3).
- **C-7. §5 y §6.2 D-1:** sustituir la duda por la decisión de §4 (D-1): `código completo` en `:48` y `:49` en el commit del coordinador, con la nota y el recálculo de la cabecera. Añadir que el implementador solo lo propone.
- **C-8. Cabecera de la directiva:** el campo «Hallazgos extra fuera de alcance (con parche listo): H-1 a H-4» no es exacto (H-1 y H-3 no tienen parche). Hay que añadir los parches candidatos marcados «no aplicar en A-03» (H-1: el de §5; H-2: `:where(html[data-motion-style='…'])`) o decir cuáles los tienen (RULES §1.4 y §3.6).

Opcionales:

- **O-1.** Añadir a la matriz de R-A (§4.4) los botones quick-buy de tarjeta y la comprobación visual del anillo del stepper (H-2) en la PDP y en el drawer.
- **O-2.** Cota del velo: 76.5/255 → 2.67-2.72 (heritage) y 6.84-6.95 (fg).
- **O-3.** Añadir `--color-button` (mínimo 4.09) a §3.3 como alternativa considerada y descartada (§2.4).

---

## 7. Compuerta del literal sobre este archivo

Contador: `.../scratchpad/rd-a03/count-review.py` (copia de `count-two.py`; deriva el literal solo en memoria e imprime solo `ruta=N`). Comando: `cd /home/user/Tema-Shopify && python3 -I <scratch>/rd-a03/count-review.py agent-comms/outbox-claude/CLAUDE-REVIEW-A-03-RD-001.md`. Salida, tras escribir este archivo: `agent-comms/outbox-claude/CLAUDE-REVIEW-A-03-RD-001.md=0`. La misma prueba sobre la directiva dio `agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-03-001.md=0`.

---

## 8. Afirmaciones falsables

1. En `eb7cca7`, `assets/base.css:9105` y `:9129` contienen `outline: 2px solid #2b2b2b;` y `outline: 2px solid #b5885c;`, dentro del `@media (prefers-reduced-motion: no-preference)` abierto en `:9058`.
2. Las 75 cifras de la tabla de §2.4 de la directiva coinciden a 2 decimales con `rd_contrast.py` sobre `config/settings_data.json`.
3. Con `var(--color-foreground)`, el peor anillo en los 15 esquemas es 7.58:1 (Archive scheme-4), y 5.87:1 contra `--color-surface-subtle`.
4. `rd_probe.mjs` sobre `eb7cca7` da 720 filas y 13 combinaciones estilo×esquema con fallo, 13 por cada uno de los 6 controles objetivo (78), 0 con `reduce`. Sobre la copia con E1-E3 da 0 fallos.
5. Con E1-E3, las filas de atelier, todas las filas con `reduce` y las 180 filas de `a` e `.icon-button` son idénticas byte a byte antes y después.
6. Tras E1 (con el ancla de C-5), `#2b2b2b|#b5885c|#333333` aparece solo en 9084, 9088, 9092, 9114, 9115, 9121 y 9126.
7. `.site-header__link` no aparece en ningún `.liquid`, `.js` ni `.json` del repositorio; solo en `assets/base.css:9122`.
8. Con heritage y `no-preference`, el hover de `.button` y de `.button--secondary` pone el texto en `rgb(181, 136, 92)` sobre fondo transparente: 2.25-2.76:1 en los esquemas 1, 3, 4 y 5 de Archive, y 4.09:1 en scheme-2.
9. `--color-button` frente al fondo da como mínimo 4.09:1 en los 15 esquemas (Archive scheme-2).
10. `scripts/package-theme-zip.mjs:78-80` no incluye `agent-comms/` en `INCLUDE_DIRS`.
11. `@playwright/test` se resuelve desde la raíz del repositorio con la versión 1.63.0 y exporta `chromium.launch`.
12. `CLAUDE-DIRECTIVA-A-02-001.md:32` prohíbe al implementador crear `lote-a`; `CLAUDE-DIRECTIVA-A-03-001.md:52` se lo ordena si no existe.
13. Esta revisión no abrió `.secrets`, no leyó variables de entorno con credenciales, no usó tiendas, gate5 ni git de escritura, y no imprimió el literal.
