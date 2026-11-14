# CLAUDE-DIRECTIVA-A-03-001: color del anillo de foco por `motion_style`

```text
ID: CLAUDE-DIRECTIVA-A-03-001 (tarea A-03 del plan V4.1; hallazgos RC-04 / TT-02)
Estado: Aprobada con cambios por CLAUDE-REVIEW-A-03-RD-001; donde difieran, manda la R-D (C-1..C-8)
Decisión requerida: R-D independiente (subagente Opus de contexto limpio, D11) antes de entregar esta
  directiva al implementador. Sin R-D aceptada no se empieza.
Resumen en 5 líneas:
  1. En `prefers-reduced-motion: no-preference`, los estilos technical y heritage pintan el anillo de foco
     de `.button`, `input` y `select` con hex fijos (#2b2b2b y #b5885c), no con el color del esquema.
  2. Cálculo y prueba sintética en Chromium: 39 de 270 combinaciones bajan de 3:1. Imprint: 1.33 en
     scheme-2 (footer) y 1.13 en scheme-4. Archive: de 2.25 a 2.76 en cuatro de sus cinco esquemas.
  3. Solución: cambiar dos declaraciones de `assets/base.css` a
     `outline: var(--focus-width) solid var(--color-foreground);`, como en la regla base y en atelier.
     Los offsets propios de cada estilo se conservan. Con ese cambio aplicado a una copia: 0 fallos en 270.
  4. Solo CSS, sin schema, sin tokens nuevos ni cambio de contrato (Nivel 1). Lista cerrada: `assets/base.css`,
     el arnés `agent-comms/outbox-claude/harness-A-03-001/` y el informe.
  5. Sin tienda (D22), el estado máximo es `código completo`. La matriz real en previews es la prueba de R-A
     y queda pendiente de credenciales (D13).
Archivos tocados (por este borrador): solo este archivo.
Desviaciones (Nivel 1 o Nivel 2): ninguna. La solución propuesta es Nivel 1 (§3.4).
Hallazgos extra fuera de alcance (con parche listo): H-1 a H-4 en §6.3. Ninguno se toca en A-03.
Verificación (comando, resultado y qué demuestra/qué no): §2.4 y §4.1. Cálculo estático y prueba sintética
  en Chromium local; no son medición en tienda.
Lista de afirmaciones falsables numeradas: §8.
```

> **Nota (aplicación de la R-D).** Esta directiva queda aprobada con los cambios C-1..C-8 de `agent-comms/outbox-claude/CLAUDE-REVIEW-A-03-RD-001.md` (§6); donde difieran, manda la R-D:
> - C-1: H-1 sin el header ni `.site-header__link`, con los controles reales, el agravante táctil, severidad P2 (TT-28) y la fila `:47` del ledger.
> - C-2: reformular el conteo de §4.1 criterio 4 y §8.7 (13 combinaciones; 39 filas con 3 controles y 13 x N con la matriz ampliada).
> - C-3: la rama `lote-a` la crea el coordinador desde `eb7cca7`; si no existe, el implementador PARA.
> - C-4: «limpio» es `git status --short --untracked-files=no` vacío.
> - C-5: ancla exacta de E1 (antes de la línea technical `.button:focus-visible`, sin líneas en blanco añadidas).
> - C-6: arnés con `import { chromium } from '@playwright/test'`, sin rutas absolutas, salida determinista y literal = 0.
> - C-7: ledger `:48` y `:49` a `código completo` en el commit del coordinador, con nota; el implementador solo lo propone.
> - C-8: la cabecera debe indicar qué hallazgos llevan parche candidato («no aplicar en A-03»).
>
> Quedan sustituidos (líneas del texto original, antes de esta nota): `:52` (`git switch -c lote-a eb7cca7`) por C-3; `:238` («exactamente las 39 filas») por C-2; y `:340` (frase «también en el header de Archive (scheme-1)» de H-1) por C-1. El resto del texto no se reescribe.

---

## 0. Fuentes leídas y su autoridad

| Fuente | Qué se toma de ella |
| --- | --- |
| `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md:193` (fila A-03), `:241-245` (A-03, causa y matriz), `:185-187` (Lote A), `:338-347` (§5.1 R-D), `:376` (R-A), `:382`, `:384-396` (§6) | Alcance, causa, matriz de prueba, prioridades (Imprint P1 condicionado, Archive P2) y contratos de revisión. |
| `AGENTS.md` y `agent-comms/RULES.md` §1.3-1.4, §2, §3.5, §3.8-3.9, §5 | Cabecera de entrega, cinco compuertas, niveles de desviación, `código completo` y no tocar filas verdes. |
| `agent-comms/outbox-claude/CLAUDE-DECISION-AUTONOMIA-001.md` D9-D18 y `CLAUDE-DECISION-LOTE-0-002.md` D20-D24 | D9: Claude ejecuta el plan aunque la fila nombre a GPT como dueño. D10: cuándo se para y se pregunta a Johandry. D11: revisor Opus de contexto limpio. D12: rama `lote-a`, sin force. D13: tienda solo para temas no publicados, con credenciales. D17: no copiar de SebastianDev017/atelier, no metafields, ninguna credencial. D22: sin tienda, máximo `código completo`. |
| `agent-comms/outbox-gpt/GPT-AUDIT-THREE-THEMES-TODO-EN-UNO-001.md:378-387` (TT-02) | Antecedente del defecto; cifras 1.33/1.13 y 2.25-2.76/4.09 coinciden con §2.4. |
| `agent-comms/outbox-gemini/GEMINI-AUDIT-COMPARATIVA-001.md:97` | Su propuesta `currentColor` se refuta en §3.3. Sus líneas 9097-9102 están desfasadas; las vigentes son 9102-9107. |
| `docs/requirements-ledger.md:48-49` | Filas afectadas (§5). |

---

## 1. Base y preflight (obligatorio, antes de editar)

Base de referencia: `eb7cca797f9de142089c6c14daaa5ed449597f9f` (`eb7cca7`, cabeza de `lote0/base-09f8342`). Rama de trabajo: `lote-a` (D12, D22).

Ejecuta y pega en el informe la salida literal de cada paso (RULES §1.3):

1. `git status --short`: el árbol debe estar limpio. Si hay cambios ajenos en `assets/base.css`, PARA y avisa al coordinador.
2. Rama:
   - Si `lote-a` existe (`git branch --list lote-a`): `git switch lote-a` y `git merge-base --is-ancestor eb7cca7 HEAD && echo DESCIENDE`. Si no imprime `DESCIENDE`, PARA.
   - Si no existe y `git rev-parse lote0/base-09f8342` es `eb7cca7…`: `git switch -c lote-a eb7cca7`. Si la cabeza de `lote0/base-09f8342` es otra, PARA y pregunta al coordinador. No crees la rama desde otro punto.
3. `git diff --stat eb7cca7 HEAD -- assets/base.css`. Lo esperado es una salida vacía, porque A-01, A-02, B-02 y C-08 no tienen `base.css` en su alcance. Si no está vacía, comprueba con el paso 4 que las tres reglas de foco por estilo están intactas. Si alguna cambió, PARA.
4. Revalida los localizadores por selector, no solo por número de línea (RULES §4.4):
   ```bash
   sed -n '283,286p;9058p;9069,9074p;9102,9107p;9126,9131p' assets/base.css
   grep -n -E "data-motion-style='(atelier|technical|heritage)'\] (\.button|input|select):focus-visible" assets/base.css
   grep -n -E "^\s*--focus-width" assets/base.css
   grep -n "data-motion-style" layout/theme.liquid
   grep -n '"motion_style"' config/settings_data.json
   grep -n -E "#2b2b2b|#b5885c|#333333" assets/base.css
   ```
   Valores esperados en `eb7cca7`:
   - `assets/base.css:283-286`: `:focus-visible { outline: var(--focus-width) solid var(--color-foreground); outline-offset: 3px; }`.
   - `assets/base.css:100`: `--focus-width: 2px;`, única definición; no hay redefinición en `layout/`, `sections/` ni `snippets/`.
   - `assets/base.css:9058`: `@media (prefers-reduced-motion: no-preference) {`.
   - Regla de atelier en `9069-9074`, con `outline: 2px solid var(--color-foreground)` y `outline-offset: 3px`.
   - Regla de technical en `9102-9107`, con `outline: 2px solid #2b2b2b` en 9105 y `outline-offset: 2px`.
   - Regla de heritage en `9126-9131`, con `outline: 2px solid #b5885c` en 9129 y `outline-offset: 3px`.
   - `#2b2b2b`, `#b5885c` y `#333333` aparecen solo en 9084, 9088, 9092, 9105, 9111, 9112, 9118, 9123 y 9129.
   - `layout/theme.liquid:3`: `data-motion-style="{{ settings.motion_style | default: 'atelier' }}"`.
   - `config/settings_data.json:157,234,311`: `atelier`, `technical` y `heritage` (presets Sartorial, Imprint y Archive). En `:79`, `current` usa `atelier`.
5. Herramientas: `node --version`, `npx playwright --version`, `ls "$PLAYWRIGHT_BROWSERS_PATH"`. En el entorno del redactor hay Node v22.23.4, Playwright 1.63.0 y Chromium en `/opt/pw-browsers/chromium-1243`. Si Chromium no arranca, no instales nada por red: registra «arnés no ejecutable» y sigue con el resto.

Prohibido en toda la tarea: abrir `.secrets`; leer o imprimir variables de entorno con credenciales; usar Shopify CLI contra tiendas (`theme push`, `theme dev`, `theme pull`…); ejecutar `scripts/gate5-*.mjs`; imprimir el literal de contraseña (ni para contarlo); copiar código de SebastianDev017/atelier; crear o leer metafields; commit, push o force.

---

## 2. Objetivo y defecto actual

### 2.1 Objetivo (plan V4.1:193, :243-245)

El anillo de foco de `.button`, `input` y `select` debe ser visible y tener al menos 3:1 contra los colores adyacentes con los estilos `technical` (Imprint) y `heritage` (Archive). La referencia es atelier (Sartorial), que ya usa el color del esquema. La corrección es solo CSS: el disparador es `motion_style` y el schema no se toca. Sartorial debe seguir igual.

Criterios WCAG 2.2 aplicables:
- **2.4.7 Focus Visible (AA):** el indicador de foco tiene que verse. Un anillo a 1.13:1 en la práctica no se ve.
- **1.4.11 Non-text Contrast (AA):** según su documento *Understanding*, la información visual necesaria para identificar estados, incluido el foco, necesita 3:1 contra los colores adyacentes.
- **2.4.13 Focus Appearance (AAA):** solo como referencia; no se exige.
- Un cálculo de contraste, o cero avisos de axe, no certifica la accesibilidad completa (plan:245). axe no evalúa el contraste del indicador de foco.

### 2.2 Causa (familia completa, barrido `rg`)

- `assets/base.css:283-286`: la regla base pinta el anillo con `var(--color-foreground)` del esquema efectivo y offset 3px. Especificidad (0,1,0).
- `assets/base.css:9058`: el bloque `@media (prefers-reduced-motion: no-preference)` contiene tres reglas de especificidad (0,2,2) que ganan a la base y a las reglas de componente:
  - `9069-9074` atelier: `outline: 2px solid var(--color-foreground)`, offset 3px. Es correcta: usa el color del esquema.
  - `9102-9107` technical: `outline: 2px solid #2b2b2b`, offset 2px. **Defecto:** gris grafito fijo.
  - `9126-9131` heritage: `outline: 2px solid #b5885c`, offset 3px. **Defecto:** latón fijo.
- Con `prefers-reduced-motion: reduce` el bloque no aplica y vuelve la regla base, que pasa. Por eso el fallo solo se produce con `no-preference`.
- El defecto depende de la combinación `motion_style` × esquema, no del preset: el comerciante puede elegir cualquier estilo en cualquier preset (`config/settings_schema.json:224-242`). Por ejemplo, Sartorial con technical falla a 1.21 en su scheme-2.
- Barrido de la familia: `.button`, `input` y `select` son los únicos selectores con color de foco fijo. El resto de `:focus-visible` del archivo pinta el anillo con `var(--color-foreground)`, solo cambia el offset o cambia el fondo o el color del control, pero nunca fija el color del anillo (`grep -n "focus-visible" assets/base.css`, 46 líneas revisadas). Las demás apariciones de `#2b2b2b`, `#b5885c` y `#333333` son de hover (§6.3, H-1 y H-3).

### 2.3 Dónde se ve (superficies compartidas por los tres presets)

Los grupos de secciones son comunes a los tres presets, porque `listings/*/` solo trae `templates/`:

- `sections/header-group.json:20`: announcement en scheme-2. Sus controles (`.announcement-bar__control` y `__link`) no son `.button`, así que usan el anillo base. **No se atribuye al header el esquema de announcement.**
- `sections/header-group.json:48`: header en scheme-1. Contiene predictive search (`snippets/predictive-search.liquid:77` input y `:106` `.button`, que hereda el esquema del header según `predictive-search.liquid:48`), el select de país (`snippets/localization-selectors.liquid:79`) y el submit no-JS (`:90`).
- `sections/footer-group.json:9`: footer en scheme-2. Contiene el input de newsletter (`sections/footer.liquid:58`), el submit `.button` (`:71`) y los selectores de localización (`:16`).
- Contenido por preset (`listings/*/templates/*.json`):
  - Imprint: newsletter en scheme-4 (input y `.button`), marquee en scheme-2, brand-manifesto en scheme-3, PDP y colección en scheme-1.
  - Archive: hero `cinematic` con velo `scrim` al 70 % en scheme-2 (botones sobre imagen), brand-manifesto y featured-product en scheme-3, marquee y newsletter en scheme-4, PDP y colección en scheme-1.
- Cart drawer: scheme-1 por defecto (`sections/cart-drawer.liquid:384-386`).

### 2.4 Contraste calculado con los valores reales de `config/settings_data.json`

Método 1 (estático): `python3 -I <scratch>/a03/contrast.py config/settings_data.json`, con la luminancia relativa WCAG 2.x y fondos sólidos `background` de cada esquema. Método 2 (sintético): `node <scratch>/a03/probe.mjs <css> config/settings_data.json`. Esta prueba carga el `base.css` real en Chromium headless. Inyecta las variables de esquema igual que `layout/theme.liquid:81-91`. Llega a cada control con `Tab` real, para que se cumpla `:focus-visible`, y lee `outlineColor` y el fondo con `getComputedStyle`, con `reducedMotion` emulado. Ambos métodos coinciden en todas las cifras. Las rutas de scratch son del redactor y no persisten; el implementador reconstruye el arnés según §4.2.

El anillo está fuera del control (offset de 2 o 3px), así que sus colores adyacentes son el fondo de la sección por los dos lados. Umbral: 3.00. **Negrita** = falla.

| Preset (motion propio) | Esquema | Fondo | Uso en el preset | Antes, motion propio | Si fuera technical #2B2B2B | Si fuera heritage #B5885C | Después, `--color-foreground` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sartorial (atelier) | scheme-1 | #F7F3EA | header, PDP, colección | 15.52 | 12.79 | **2.86** | 15.52 |
| Sartorial (atelier) | scheme-2 | #1D1B18 | footer, announcement, hero | 15.65 | **1.21** | 5.43 | 15.65 |
| Sartorial (atelier) | scheme-3 | #EDE7DA | featured, manifesto, newsletter | 13.95 | 11.49 | **2.57** | 13.95 |
| Sartorial (atelier) | scheme-4 | #D8A85D | sin uso en plantillas | 7.92 | 6.53 | **1.46** | 7.92 |
| Sartorial (atelier) | scheme-5 | #FBF9F4 | sin uso en plantillas | 14.28 | 13.46 | 3.01 | 14.28 |
| Imprint (technical) | scheme-1 | #FFFFFF | header, PDP, colección, hero | 14.16 | 14.16 | 3.16 | 18.88 |
| Imprint (technical) | scheme-2 | #111111 | **footer**, announcement, marquee | **1.33** | **1.33** | 5.97 | 18.09 |
| Imprint (technical) | scheme-3 | #F2F2F2 | bento, manifesto | 12.65 | 12.65 | **2.82** | 16.87 |
| Imprint (technical) | scheme-4 | #2E3440 | **newsletter** | **1.13** | **1.13** | 3.95 | 11.14 |
| Imprint (technical) | scheme-5 | #FAFAFA | sin uso en plantillas | 13.57 | 13.57 | 3.03 | 16.67 |
| Archive (heritage) | scheme-1 | #EFE6D9 | **header, PDP, colección** | **2.56** | 11.46 | **2.56** | 12.27 |
| Archive (heritage) | scheme-2 | #2F3327 | footer, announcement, hero | 4.09 | **1.09** | 4.09 | 10.46 |
| Archive (heritage) | scheme-3 | #E4D8C6 | **manifesto, featured** | **2.25** | 10.07 | **2.25** | 10.78 |
| Archive (heritage) | scheme-4 | #6E482F | **marquee, newsletter** | **2.52** | **1.77** | **2.52** | 7.58 |
| Archive (heritage) | scheme-5 | #F5EFE5 | sin uso en plantillas | **2.76** | 12.38 | **2.76** | 13.25 |

Fondo con imagen (Archive, hero `cinematic`, `scrim` 70 %, `listings/archive/templates/index.json`). Cota calculada con un píxel de imagen entre negro y blanco bajo un velo negro al 70 %, es decir, un fondo efectivo entre #000000 y #4D4D4D:
- Heritage #B5885C: de 6.64 a **2.67**.
- Después, `--color-foreground` #EFE6D9: de 16.99 a 6.84.

Es una cota, no una medida: la imagen real se mide en preview (R-A).

Prueba sintética antes del cambio (`base.css` de `eb7cca7`): 3 presets × 5 esquemas × 3 estilos × 2 preferencias × 3 controles (`.button`, `input[type=email]`, `select`) = 270 filas, **39 fallos**, todos con `no-preference`. Con `reduce`: 0 fallos. Después del cambio de §3.1, aplicado a una copia en scratch: **270 filas, 0 fallos**.

```text
$ node probe.mjs base-eb7cca7.css config/settings_data.json
filas=270 fallos=39
Imprint | technical | no-preference | scheme-2 | button | rgb(43, 43, 43) | rgb(17, 17, 17) | 1.33 | 2px | 2px
Imprint | technical | no-preference | scheme-4 | button | rgb(43, 43, 43) | rgb(46, 52, 64) | 1.13 | 2px | 2px
Archive | heritage | no-preference | scheme-3 | button | rgb(181, 136, 92) | rgb(228, 216, 198) | 2.25 | 2px | 3px
… (39 filas: 13 combinaciones estilo×esquema × 3 controles)
$ node probe.mjs base-proposed.css config/settings_data.json
filas=270 fallos=0
```

---

## 3. Solución

### 3.1 Cambio exacto (lista cerrada de ediciones en `assets/base.css`)

Haz las ediciones con la herramienta de edición, con contexto, y comprueba que cada `old_string` aparece exactamente 1 vez (RULES §3.2).

**E1.** Antes de la regla de foco de technical, es decir, tras el cierre de `html[data-motion-style='technical'] .product-card__title a:hover { … }` en 9097-9100, añade este comentario, en ASCII como el resto de comentarios del bloque:

```css
  /* Foco: el color del anillo sale del esquema (--color-foreground), igual que la regla base
     :focus-visible. Un gris o un laton fijos bajan de 3:1 en esquemas oscuros o calidos (A-03).
     Cada estilo solo cambia el outline-offset. */
```

**E2.** En la regla de technical (9102-9107), sustituye solo esta declaración:

```diff
-    outline: 2px solid #2b2b2b;
+    outline: var(--focus-width) solid var(--color-foreground);
```

**E3.** En la regla de heritage (9126-9131), sustituye solo esta declaración:

```diff
-    outline: 2px solid #b5885c;
+    outline: var(--focus-width) solid var(--color-foreground);
```

No cambies nada más:
- Ni los selectores, ni `outline-offset: 2px` de technical ni `outline-offset: 3px` de heritage.
- Ni la regla de atelier (9069-9074): es una fila verde (RULES §3.9) y su literal `2px` equivale a `--focus-width` (§6.3, H-4).
- Ni la posición de las reglas dentro del bloque `no-preference`.
- Ni las reglas de hover.

Resultado esperado del diff: un archivo, 3 líneas añadidas por el comentario y 2 sustituidas.

### 3.2 Por qué así

- **Usa la variable de esquema, no un color fijo.** `--color-foreground` lo emite cada `.color-<scheme>` (`layout/theme.liquid:81-91`) y la redefinen todas las secciones con selector de esquema. Así el anillo sigue al fondo efectivo de header, contenido, footer, drawer y paneles. Es el mismo token que ya usan la regla base (`base.css:284`), atelier (`:9072`) y las reglas de foco de componentes (`:1418`, `:2072`, `:2128`, `:2279`, `:2360`, `:2831`, `:3026`, `:9708`). No se crea ningún token.
- **Consistencia.** `--focus-width` (`base.css:100`, única definición) sustituye al literal `2px` en las dos líneas tocadas. El grosor efectivo sigue siendo 2px.
- **`prefers-reduced-motion`.** No se añade ninguna transición ni animación. Con `reduce` sigue aplicando la regla base, ya correcta. Con `no-preference`, los tres estilos usan el mismo color y difieren solo en el offset (2px o 3px), que es la diferencia estilística que se conserva.
- **Sartorial no cambia.** La regla de atelier no se toca; el arnés debe demostrar que las 30 filas de atelier del preset Sartorial son idénticas antes y después.
- **Margen.** El peor caso tras el cambio es 7.58:1 (Archive scheme-4). Contra las superficies derivadas `--color-surface` y `--color-surface-subtle` (`base.css:105-106`), el peor caso es 5.87:1 (cálculo del redactor).
- **Forced colors.** El navegador sustituye `outline-color` por colores del sistema, así que no se necesita una regla extra.

### 3.3 Alternativas descartadas (con cifras de §2.4)

| Alternativa | Motivo |
| --- | --- |
| `currentColor` (GEMINI-AUDIT-COMPARATIVA-001:97) | En `.button` primario, `currentColor` es `button_label`: contra el fondo da de 1.00 a 1.96 en todos los presets (por ejemplo, Imprint scheme-1, #FFFFFF sobre #FFFFFF). Falla siempre. |
| `--color-border` | Da de 3.00 a 4.53, con 3.00 justo en Imprint scheme-3 y 3.03 en Sartorial scheme-5. Depende de un ajuste del comerciante: margen nulo. |
| `--color-control-border` (mezcla al 60 %) | Mínimo 3.37, menor margen y distinto del anillo base, lo que rompe la consistencia. |
| Anillo doble (outline + box-shadow) | Innecesario con `--color-foreground`. Choca con el `box-shadow` del hover de technical (`:9088`) y con los `box-shadow` de componentes (`:3301`, `:4623`, `:8563`). |
| Quitar el color y dejar solo el offset | Funcionaría por herencia de la base, pero cambia la forma de la regla y depende del orden de cascada. La sustitución literal es más pequeña y verificable. |
| Sacar las reglas de foco del bloque `no-preference` | Cambiaría el offset que ve Sartorial con `reduce`. Queda fuera de alcance. |

### 3.4 Archivos permitidos (lista CERRADA) y nivel de desviación

| Archivo | Operación |
| --- | --- |
| `assets/base.css` | Solo E1, E2 y E3. |
| `agent-comms/outbox-claude/harness-A-03-001/` (nuevo) | Arnés `focus-contrast.mjs` y salidas `before.txt`, `after.txt` y `rules-count.txt`. No se empaqueta en el ZIP: `scripts/package-theme-zip.mjs` solo incluye las carpetas del tema. |
| `agent-comms/outbox-claude/CLAUDE-REPORT-A-03-001.md` (nuevo) | Informe (§7). |

Prohibido tocar: `config/settings_schema.json`, `config/settings_data.json`, `locales/*`, `layout/*`, `sections/*`, `snippets/*`, `templates/*`, `listings/*`, `docs/requirements-ledger.md`, `agent-comms/BOARD.md` y `CLAUDE-CLOUD-STATUS.md`. Las tres últimas las actualiza el coordinador tras la revisión.

**Nivel 1 (RULES §3.5):** no cambia ningún `id`, `default` ni opción de select, ni hay archivos fuera de lista. `motion_style` conserva sus valores y su texto `info` (`locales/en.default.schema.json`: «Select the physical timing and interaction style across the storefront.»), que no promete nada sobre el foco. Lo único que cambia es el color que ve el comprador, para cumplir WCAG. No hace falta autorización de Nivel 2.

Preflight de directiva (RULES §4.2): no se crean ramas condicionales; no se crean ni cambian IDs, `name` ni `aria-*`, porque el cambio es solo de CSS; no hay Nivel 2.

---

## 4. Criterios de aceptación y pruebas sin tienda

### 4.1 Criterios falsables

1. Salida de `git diff --stat eb7cca7 -- assets/base.css` (o contra la cabeza previa de `lote-a`): 1 archivo, 5 inserciones y 2 borrados (3 líneas de comentario y 2 sustituciones). `git diff` debe coincidir con E1, E2 y E3.
2. `grep -n -E "outline: 2px solid #(2b2b2b|b5885c)" assets/base.css` no devuelve nada (código de salida 1).
3. `grep -n -E "#2b2b2b|#b5885c|#333333" assets/base.css` devuelve solo las 7 líneas de hover: 9084, 9088 y 9092 sin cambio, y 9114, 9115, 9121 y 9126 (las antiguas 9111, 9112, 9118 y 9123, desplazadas +3 por el comentario E1 insertado tras la 9101).
4. Arnés sintético sobre el `base.css` modificado: 0 filas por debajo de 3:1 en toda la matriz de §4.2. Sobre `eb7cca7`: exactamente las 39 filas de §2.4.
5. Atelier no cambia: para `motion=atelier`, color, grosor, estilo y offset son idénticos antes y después en todas sus filas.
6. Offsets conservados con `no-preference`: technical 2px, heritage 3px y atelier 3px en `.button`, `input` y `select`. Con `reduce`, el offset base es 3px y el input del stepper conserva −3px, como antes.
7. Paridad de parseo: el número total de reglas CSS que Chromium obtiene del archivo, recorriendo `cssRules` de forma recursiva, es igual antes y después. Las dos reglas editadas contienen `var(--color-foreground)` en su `cssText`.
8. Theme Check: `npx shopify theme check` (offline) termina sin ofensas, y `node scripts/theme-check-sanity.mjs` termina con código 0. **Limitación:** Theme Check no inspecciona `assets/base.css` (CLAUDE-CLOUD-STATUS, punto 6b: «Los 3 de 93 no inspeccionados son `assets/base.css`…»), así que solo prueba que el paquete no empeora. Para el CSS, la evidencia es el criterio 7.
9. `node --check`: no aplica, porque no se toca JS. `node scripts/locale-key-inventory.mjs` y `node scripts/json-validate.mjs` son opcionales como no regresión (no se toca JSON ni locales). Si se ejecutan, pega su salida.

### 4.2 Arnés local (sintético, Chromium; viable, verificado por el redactor)

Crea `agent-comms/outbox-claude/harness-A-03-001/focus-contrast.mjs` con estos argumentos: `node focus-contrast.mjs <ruta-css> config/settings_data.json [--json salida.json]`. Pasos del arnés:

1. Lee `presets` de `settings_data.json`. Los tres son objetos planos con `color_schemes`; no tienen la clave `settings` en el primer nivel. Para cada esquema genera `.color-<id>{--color-background;--color-foreground;--color-button;--color-button-label;--color-link;--color-border;--color-shadow}` con la misma correspondencia que `layout/theme.liquid:81-91`.
2. Para cada estilo (`atelier`, `technical`, `heritage`) y cada `reducedMotion` (`no-preference`, `reduce`, con `page.emulateMedia`), crea una página. Lleva `<html data-motion-style=…>`, el CSS en línea, `<body class="color-scheme-1">` y una `<section class="color-<id>" style="background:var(--color-background)">` por esquema. Cada sección contiene:
   - `<button class="button">`, `<button class="button button--secondary">`, `<input type="email">`, `<select>` e `<input type="checkbox">`.
   - Como controles de regresión, que no deben cambiar: `<a href="#">` y `<button class="icon-button">`.
   - `<div class="quantity-stepper"><input class="quantity-stepper__input" type="number"></div>`.
3. Recorre los controles con `page.keyboard.press('Tab')`, sin `focus()` programático. En cada uno comprueba `matches(':focus-visible')` y registra `outlineColor`, `outlineStyle`, `outlineWidth` y `outlineOffset` del control, además del `backgroundColor` de la sección. Calcula el contraste con la luminancia WCAG.
4. Imprime una línea por fila con preset, motion, preferencia, esquema, control, color, fondo, ratio, grosor y offset. Imprime también un resumen `filas=N fallos=M`, donde fallo es ratio < 3, estilo distinto de `solid`, grosor < 2px o `:focus-visible` falso. Etiqueta la salida como `SINTÉTICO (Chromium local, sin tienda)`.
5. Paridad de parseo (criterio 7): cuenta las reglas recursivamente en `document.styleSheets` y guarda el resultado en `rules-count.txt` para el CSS de antes y el de después.

Procedimiento: `git show eb7cca7:assets/base.css > <tu-scratch>/base-before.css`. Ejecuta el arnés sobre ese archivo (→ `before.txt`) y sobre `assets/base.css` modificado (→ `after.txt`). Luego compara las filas de atelier entre los dos archivos con `diff` filtrado (criterio 5). Base de partida para el arnés (prueba de viabilidad del redactor; amplíala con los controles y comprobaciones de arriba):

```js
import { chromium } from '<repo>/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const [cssPath, settingsPath] = process.argv.slice(2);
const presets = JSON.parse(fs.readFileSync(settingsPath, 'utf8')).presets;
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const parse = s => s.match(/[\d.]+/g).slice(0, 3).map(Number);
const browser = await chromium.launch();
for (const [pname, p] of Object.entries(presets)) {
  const vars = Object.entries(p.color_schemes).map(([id, { settings: s }]) =>
    `.color-${id}{--color-background:${s.background};--color-foreground:${s.text};--color-button:${s.button};--color-button-label:${s.button_label};--color-link:${s.secondary_button_label};--color-border:${s.border};--color-shadow:${s.shadow};}`).join('\n');
  // … secciones por esquema, bucles motion × reducedMotion, Tab por control, getComputedStyle, cr(), salida
}
await browser.close();
```

Límites del arnés: usa fondos sólidos, no renderiza secciones reales, no mide imágenes y no sustituye a lectores de pantalla ni al teclado en el tema real. Es evidencia preliminar y no cierra filas (RULES §3.7). `tt02.js` no está en el repositorio (`git ls-files | grep -i tt02` sin salida) ni lo acredita 0-05, así que no se usa (plan:245).

### 4.3 Compuertas de calidad (RULES §2)

| Compuerta | Qué entregar |
| --- | --- |
| Requisitos | Las filas de §5, cada una con su afirmación y evidencia `archivo:línea` y del arnés. |
| Estados degenerados | No aplican a un color de anillo, porque depende del esquema y no del contenido. Se justifican uno a uno en el informe. *Muy largo:* un botón de dos líneas mantiene el anillo en su caja (el arnés añade un `.button` con un texto de 120 caracteres y ancho de 200px). *Faltante:* un esquema con `background_gradient` usa `--gradient-background`; el anillo sigue a `--color-foreground`, el mismo color del texto sobre ese fondo, y queda pendiente de R-A si algún preset lo usa (hoy ninguno: todos `''`). *Vacío*, *uno* y *muchos*: no aplican, se declara así. |
| Consistencia | Salidas del criterio 3 y de `grep -n -E "^\s*--focus-width" assets/base.css`, que muestren una sola definición. Ni tokens ni hex nuevos. |
| Superficie del comerciante | No aplica: no cambian schema, labels, `t:` ni `info`. Se declara así. |
| Tienda real | Pendiente (§4.4). Estado máximo: `código completo`. |

### 4.4 Pendiente de credenciales: prueba de R-A (no la ejecuta el implementador)

Con credenciales, D13 solo permite subir temas no publicados a `tema-qkqpke0j`. La ejecuta personalmente el revisor de R-A (plan:376 y :382) en previews acreditados por 0-02. Matriz completa, con una fila por combinación:

`preset/motion_style × control × estado × esquema efectivo × fondo (sólido o imagen efectiva) × reduce/no-preference`, más el método, el criterio (2.4.7 / 1.4.11), la medida y la captura.

- Recorrido con teclado (`Tab` y `Shift+Tab`) por header, contenido y footer, en móvil simulado (390) y en escritorio (1280).
- Controles: predictive search (input y submit), select de país del header y del footer, newsletter del footer en scheme-2 (input y submit), newsletter de la home (scheme-4 en Imprint y Archive), botones del hero (Archive `cinematic` sobre imagen con velo: medida en píxel real), add to cart, cantidad y selector de variante en PDP, facetas y orden en colección, y stepper y checkout en el cart drawer.
- Controles de regresión: enlaces e `icon-button`, que no deben cambiar.
- Estados: foco solo, foco con hover, deshabilitado (no enfocable) y `aria-disabled`.
- Footer scheme-2 incluido expresamente. El header (scheme-1) y el announcement (scheme-2) se registran por separado.
- Prioridad: Imprint es P1 condicionado (footer 1.33 y newsletter 1.13 son las filas críticas) y bloquea el avance si falla. Archive es P2: se ejecuta en el mismo turno y su fallo se devuelve sin bloquear a Imprint. Sartorial se ejecuta como regresión.

---

## 5. Filas del ledger y estado máximo sin tienda

`docs/requirements-ledger.md` no numera filas: se citan por nombre y línea en `eb7cca7`. **El implementador no edita el ledger** (fuera de lista). Propone en su informe y la actualización la hace su responsable (plan §6:396).

| Fila (línea) | Estado actual | Afirmación que aporta A-03 | Estado máximo sin tienda | Cierre |
| --- | --- | --- | --- | --- |
| «Contraste de Interfaz No-Texto >= 3:1», WCAG 1.4.11 (`:48`) | `cumplido`. Su evidencia cita `:focus-visible` a ≥15.52:1, medido en Couture y Sartorial (atelier). | En `eb7cca7`, el `cumplido` no se sostiene para technical y heritage (39 fallos sintéticos, §2.4). Tras A-03, 0 fallos sintéticos y el anillo sale de `--color-foreground` en los tres estilos (`base.css` tras E2 y E3). | `código completo` para la extensión a technical y heritage (Imprint y Archive). | R-A con la matriz de §4.4 en previews acreditados. |
| «Navegación por Teclado e Indicador de Foco», WCAG 2.4.7 (`:49`) | `cumplido`. Su evidencia es Playwright en tienda, histórica y sin preset Imprint ni Archive acreditado. | Igual que la fila anterior. | `código completo` para Imprint y Archive. | R-A. |

Que estas dos filas sigan como `cumplido` mientras TT-02 está abierto es una de las dudas para R-D (§6.2, D-1).

---

## 6. Riesgos, qué no hacer, dudas y hallazgos

### 6.1 Riesgos y prohibiciones

- No tocar el schema ni `settings_data.json`, y no añadir opciones. Eso sería Nivel 2 y está fuera del plan.
- No crear tokens nuevos (`--color-focus`, etc.), porque `--color-foreground` y `--focus-width` ya existen. No repetir hex.
- No corregir los hover (H-1, H-3) ni los offsets (H-2), aunque estén en el mismo bloque: eso es ampliar el alcance, y H-1 podría requerir a Johandry (§6.4).
- No cambiar la regla de atelier ni el resultado de Sartorial.
- No declarar `cumplido` ninguna fila: el máximo es `código completo` (D22, RULES §3.8).
- No mezclar etiquetas: el arnés es SINTÉTICO, el cálculo es ESTÁTICO y no hay pruebas de TIENDA.
- Riesgo residual: un comerciante puede configurar un esquema con poco contraste entre texto y fondo. Entonces el anillo hereda ese contraste, pero el texto falla antes (1.4.3), y es responsabilidad de su configuración. Se acepta y se documenta.

### 6.2 Dudas para el R-D

- **D-1. Filas del ledger 48 y 49.** Están en `cumplido` con evidencia que no cubre technical ni heritage, y TT-02 la contradice. ¿Debe su responsable pasarlas ya a `código completo` hasta R-A, o mantenerlas con una nota?
- **D-2. Commit.** Esta directiva prohíbe el commit al implementador: el coordinador lo hace tras la revisión D11 (D16). Debe alinearse con las directivas paralelas A-01/B-02, A-02 y C-08.
- **D-3. Carpeta del arnés.** ¿Es aceptable `harness-A-03-001/` dentro de `agent-comms/outbox-claude/`, como los `harness-*` existentes?
- **D-4. Literal de atelier.** ¿Confirma R-D que el `2px` literal de atelier (`:9072`) se deja sin tocar por RULES §3.9, aunque technical y heritage pasen a `var(--focus-width)`?
- **D-5. H-1.** ¿Qué prioridad tiene? ¿Se registra como hallazgo para una tarea posterior o se amplía A-03? Ver §6.4.

### 6.3 Hallazgos extra fuera de alcance (no se tocan en A-03)

- **H-1. Texto de hover en heritage (posible WCAG 1.4.3).** Ocurre en `base.css:9109-9124`: `.button:hover` pone `color: #b5885c` con fondo transparente, y `.product-card:hover .product-card__title a` y `.site-header__link:hover` usan el mismo color. Contraste del texto sobre el fondo (columna heritage de §2.4): en Archive, 2.25-2.76 en los esquemas claros, 2.52 en scheme-4 y 4.09 en scheme-2. Todos quedan por debajo de 4.5:1, también en el header de Archive (scheme-1). Parche posible: sustituir `#b5885c` por `var(--color-foreground)` o `var(--color-button)` según la intención de diseño. Es una decisión de diseño y no se prepara aquí.
- **H-2. Los offsets por estilo pisan los de componente.** Las reglas del bloque `no-preference` tienen especificidad (0,2,2) y ganan a `.quantity-stepper__input:focus-visible { outline-offset: -3px }` (`base.css:2521-2524`, cuyo comentario dice que debe dibujarse hacia dentro) y a `.predictive-search__input { outline-offset: 2px }` (`:7168`). Prueba sintética del input del stepper: atelier 3px, technical 2px, heritage 3px con `no-preference`, y −3px con `reduce`. Afecta a los tres estilos, Sartorial incluido. Parche posible: rebajar especificidad envolviendo el estilo en `:where(html[data-motion-style='…'])`, con regresión visual de Sartorial. P3 propuesto.
- **H-3. Hover de technical.** En `:9084`, `:9088` y `:9092`, `border-color` y `box-shadow` usan #2b2b2b y el `outline` de la tarjeta #333333. En esquemas oscuros son casi invisibles, pero son decorativos: el botón ya invierte fondo y texto con tokens. Sin criterio WCAG claro; solo se registra.
- **H-4. Atelier usa `2px` literal en lugar de `var(--focus-width)`** (`:9072`). Es equivalente y se deja sin tocar (RULES §3.9).

### 6.4 Conflictos

- **El plan nombra a GPT como dueño y usa `tt02.js`.** D9 asigna la ejecución a Claude, y `tt02.js` no existe en el repositorio. Se resuelve con el arnés sintético etiquetado de §4.2. No requiere a Johandry.
- **GEMINI-AUDIT-COMPARATIVA-001:97 recomienda `currentColor`.** Se refuta con cifras (§3.3). No requiere a Johandry.
- **Ledger en `cumplido` frente a TT-02.** Decide R-D o el responsable del ledger (D-1). No requiere a Johandry.
- **H-1, texto de hover de heritage.** Si R-D lo clasifica como P1, o si se quiere corregir dentro de A-03, es un hallazgo nuevo o un cambio fuera del plan: **según D10 requiere a Johandry**. Si se registra como hallazgo P2/P3 para una tarea posterior del plan, no.
- **Cierre de R-A sin credenciales.** D22 y D13 lo mantienen pendiente. La parada ya está registrada (credenciales en una sesión nueva) y no es una decisión nueva.

---

## 7. Informe del implementador

Ruta: `agent-comms/outbox-claude/CLAUDE-REPORT-A-03-001.md`. Contenido obligatorio:

1. La cabecera de RULES §1.4 completa:
   - `ID: CLAUDE-REPORT-A-03-001`
   - `Estado`
   - `Decisión requerida: revisión D11 (subagente Opus contexto limpio)`
   - Resumen en 5 líneas
   - Archivos tocados, con líneas exactas tras la edición
   - Desviaciones (Nivel 1 / Nivel 2)
   - Hallazgos extra
   - Verificación
   - Afirmaciones falsables numeradas
2. Preflight de §1, pasos 1 a 5, con comandos y salida literal.
3. `git diff` completo de `assets/base.css` y `git diff --stat`.
4. Las salidas de los criterios 1 a 9 de §4.1, pegadas literalmente, cada una con su etiqueta (ESTÁTICO / SINTÉTICO) y con «qué demuestra / qué no».
5. Tabla de contraste antes y después, regenerada por el arnés (no copiada de §2.4), y comparación de las filas de atelier.
6. Compuertas de §4.3, una por una.
7. Propuesta de filas del ledger (§5), sin editar el ledger.
8. La matriz de §4.4 como «pendiente de credenciales / R-A», sin resultados inventados.
9. Una declaración explícita de que no se abrió `.secrets`, no se usaron tiendas ni gate5, no se imprimieron variables de entorno ni el literal de contraseña, y no se hizo commit ni push.

Esfuerzo estimado: entre 1,5 y 3 h para la edición, el arnés y el informe. La matriz de R-A, con previews, es una parte de la banda de 0,5 a 1 d del plan.

---

## 8. Afirmaciones falsables de este borrador

1. En `eb7cca7`, `assets/base.css:9105` contiene `outline: 2px solid #2b2b2b;` y `:9129` contiene `outline: 2px solid #b5885c;`. Ambas están dentro de `@media (prefers-reduced-motion: no-preference)`, que se abre en `:9058`.
2. `assets/base.css:283-286` pinta el anillo base con `var(--focus-width) solid var(--color-foreground)` y offset 3px; `--focus-width` solo se define en `:100`.
3. `config/settings_data.json:157,234,311` asigna `atelier`, `technical` y `heritage` a Sartorial, Imprint y Archive, y `layout/theme.liquid:3` emite `data-motion-style`.
4. Header en scheme-1 (`sections/header-group.json:48`), announcement en scheme-2 (`:20`) y footer en scheme-2 (`sections/footer-group.json:9`), comunes a los tres presets. El footer contiene un `input` (`sections/footer.liquid:58`) y un `.button` (`:71`).
5. Con `technical`, el anillo mide 1.33:1 sobre el scheme-2 de Imprint (#111111) y 1.13:1 sobre su scheme-4 (#2E3440).
6. Con `heritage`, el anillo mide 2.56, 2.25, 2.52 y 2.76:1 sobre los esquemas 1, 3, 4 y 5 de Archive, y 4.09:1 sobre su scheme-2.
7. La prueba sintética sobre `eb7cca7` da 270 filas y 39 fallos, todos con `no-preference`. Con las sustituciones E2 y E3 aplicadas a una copia: 270 filas y 0 fallos.
8. `currentColor` en `.button` primario da ≤1.96:1 en todos los esquemas de los tres presets.
9. Con `--color-foreground`, el peor contraste del anillo en los 15 esquemas de los presets es 7.58:1 (Archive scheme-4).
10. Con `no-preference`, el `outline-offset` efectivo del input del stepper es 3px (atelier), 2px (technical) y 3px (heritage); con `reduce`, −3px (H-2).
11. Theme Check no inspecciona `assets/base.css` (CLAUDE-CLOUD-STATUS, punto 6b).
12. `git ls-files` no contiene `tt02.js`.
