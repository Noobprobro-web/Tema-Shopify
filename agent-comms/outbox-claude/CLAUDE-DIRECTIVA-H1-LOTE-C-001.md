# CLAUDE-DIRECTIVA-H1-LOTE-C-001: contraste del texto en hover de heritage (Archive)

```text
ID: CLAUDE-DIRECTIVA-H1-LOTE-C-001 (tarea H-1 del Lote C; origen: hallazgo H-1 de CLAUDE-DIRECTIVA-A-03-001 §6.3;
  decisión D28 de CLAUDE-DECISION-SESION-003.md)
Estado: Directiva + R-D redactadas (solo análisis). Sin implementar. Rama lote-c.
Decisión requerida: ninguna nueva. D28 autoriza corregir H-1 en el Lote C. La solución propuesta es Nivel 1;
  si la revisión la reclasificara como Nivel 2, queda autorizada por D28 y por esta R-D (§3.3).
Resumen en 5 líneas:
  1. `assets/base.css:9113-9127` (bloque heritage dentro de `prefers-reduced-motion: no-preference`) pinta
     el texto en hover con el hex fijo #b5885c, sin mirar el esquema.
  2. WCAG 2.x sobre los fondos de Archive: 2.56 (scheme-1), 2.25 (scheme-3), 2.76 (scheme-5), 2.52 (scheme-4),
     4.09 (scheme-2). H-1 coincide con el código: el rango 2.25-2.76 son los tres esquemas claros.
  3. Cambio mínimo: las cuatro declaraciones `#b5885c` del bloque pasan a `var(--color-foreground)`, el token
     que ya usan la regla base de foco y A-03. `var(--color-button)` se descarta: falla en Archive (4.09 y 4.14).
  4. Después: 0 de 15 esquemas de preset bajo 4.5:1; mínimo 7.58:1 (Archive scheme-4). Solo valor CSS (Nivel 1).
  5. Fila 47 del ledger: se modifica con nota H-1 y evidencia pendiente de implementación; NO pasa a cumplida.
Archivos tocados (por esta entrega): este archivo y una línea en CLAUDE-CLOUD-STATUS.md. Tema sin cambios.
Desviaciones (Nivel 1 o Nivel 2): ninguna en esta entrega. El cambio propuesto es Nivel 1 (§3.3).
Hallazgos extra fuera de alcance (con parche listo): §6 (selector muerto `.site-header__link`; hover de
  `.button--secondary` en heritage). No se tocan en H-1.
Verificación (comando, resultado y qué demuestra/qué no): §2 y §4. Cálculo estático WCAG 2.x reproducible con
  node sobre `config/settings_data.json`. No es medición en tienda ni en navegador (eso es R-A, §5).
Lista de afirmaciones falsables numeradas: §7.
```

## 1. Directiva

**Qué.** Sustituir el color fijo `#b5885c` del hover del estilo de movimiento heritage por el token de esquema `var(--color-foreground)`.

**Dónde.** Solo `assets/base.css`, bloque `/* Heritage: patina de laton envejecido y cursivas solemnes */`, dentro de `@media (prefers-reduced-motion: no-preference)` (abre en `:9058`):

| Línea (lote-c a8ac15c) | Selector | Declaración actual | Declaración nueva |
|---|---|---|---|
| `:9114` | `html[data-motion-style='heritage'] .button:hover:not([disabled])` | `border-color: #b5885c;` | `border-color: var(--color-foreground);` |
| `:9115` | ídem | `color: #b5885c;` | `color: var(--color-foreground);` |
| `:9121` | `html[data-motion-style='heritage'] .product-card:hover .product-card__title a` | `color: #b5885c;` | `color: var(--color-foreground);` |
| `:9126` | `html[data-motion-style='heritage'] .site-header__link:hover` | `color: #b5885c;` | `color: var(--color-foreground);` |

Se conservan `background: transparent`, `transform: none` y `font-style: italic`. No se añaden ni quitan selectores, ni se toca el comentario de cabecera (opcional: actualizarlo para que no hable de «patina de laton» en el color; no es obligatorio).

**Por qué.** El texto que se muestra en hover es texto y WCAG 1.4.3 se evalúa en cada estado en que se presenta (precedente TT-28, citado en `CLAUDE-REVIEW-A-03-RD-001.md:171-173`). El hex fijo no sigue al esquema y queda por debajo de 4.5:1 en los cinco esquemas de Archive, lo que contradice la fila 47 del ledger (`cumplido`). Agravante táctil: en móvil el hover queda pegado tras el toque, así que el botón pulsado sigue mostrando la etiqueta a 2.25-2.76:1.

## 2. R-D: análisis

### 2.1 Localización (comandos y salida)

```text
$ grep -rn -i "b5885c" --include=*.liquid --include=*.css --include=*.json --include=*.js .
./config/settings_data.json:267:            "button": "#B5885C",
./assets/base.css:9114:    border-color: #b5885c;
./assets/base.css:9115:    color: #b5885c;
./assets/base.css:9121:    color: #b5885c;
./assets/base.css:9126:    color: #b5885c;
./agent-comms/outbox-claude/harness-ML-001/contrast.json:947:   "#B5885C",
./agent-comms/outbox-claude/harness-ML-001/contrast.json:955:   "#B5885C",
```

- El estilo se activa con `data-motion-style="{{ settings.motion_style | default: 'atelier' }}"` en `layout/theme.liquid:3` y `layout/password.liquid:2`. El preset Archive lo fija a `heritage` (`config/settings_data.json`, preset `Archive`); el comentario `assets/base.css:9010` documenta «Heritage (Archive / Museo y boveda)». Cualquier comerciante puede elegir heritage con otro preset, por eso se miden los 15 esquemas.
- Solo se ve con `prefers-reduced-motion: no-preference` (el bloque abre en `:9058`). Con `reduce`, el hover vuelve a la regla base.

### 2.2 Fondo real

- `.button:hover` pone `background: transparent` (`:9116`): el texto queda sobre `--color-background` del contenedor `.color-scheme-N` más cercano (variables emitidas en `layout/theme.liquid:82-91`).
- `.product-card__title a` hereda el fondo de la tarjeta, que es el del esquema de la sección.
- Esquemas usados por las plantillas de Archive (`listings/archive/templates/*.json` y grupos): scheme-1 (7), scheme-2 (3), scheme-3 (2), scheme-4 (3). scheme-5 existe en el preset y se mide igual.

### 2.3 Tamaño de texto (decide el umbral)

- `.button`: `font-size: 0.875rem` (14 px), `font-weight: 700` (`assets/base.css:381-399`, `:391`).
- `.product-card__title`: `font-size: 0.95rem` (15.2 px), `font-weight: 700` (`:1927-1933`).
- Root a 16 px (los rem no dependen de `--font-body-scale`, que solo actúa en `body`, `:135`).
- Ninguno llega a 18.66 px en negrita ni a 24 px: es **texto normal, umbral 4.5:1**.

### 2.4 Contraste antes y después (WCAG 2.x)

Fórmula: luminancia relativa con linealización sRGB (`c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`), `L = 0.2126R + 0.7152G + 0.0722B`, ratio `(L1+0.05)/(L2+0.05)`. Script: `/tmp/claude-0/-home-user-Tema-Shopify/6a519136-63e8-5e29-8918-5c19680ae99e/scratchpad/h1-contrast.mjs` (fuera del repo; se reproduce en §4).

| Preset / esquema | Fondo | Antes `#b5885c` | Alternativa `--color-button` | **Después `--color-foreground`** |
|---|---|---|---|---|
| Archive scheme-1 | #EFE6D9 | **2.56** | #8A5A3B 4.71 | #2E241C **12.27** |
| Archive scheme-2 | #2F3327 | **4.09** | #B5885C **4.09** | #EFE6D9 **10.46** |
| Archive scheme-3 | #E4D8C6 | **2.25** | #8A5A3B **4.14** | #2E241C **10.78** |
| Archive scheme-4 | #6E482F | **2.52** | #FFF8F0 7.58 | #FFF8F0 **7.58** |
| Archive scheme-5 | #F5EFE5 | **2.76** | #8A5A3B 5.09 | #2E241C **13.25** |
| Sartorial scheme-1..5 | — | 2.86 / 5.43 / 2.57 / 1.46 / 3.01 | ≥ 7.92 | ≥ 7.92 |
| Imprint scheme-1..5 | — | 3.16 / 5.97 / 2.82 / 3.95 / 3.03 | ≥ 11.14 | ≥ 11.14 |
| Fallback `:root` | #faf8f5 | 2.98 | #786c5e 4.83 | #1c1917 16.50 |

Fallos bajo 4.5:1 en los 15 esquemas de preset: `#b5885c` 13, `--color-button` 2, `--color-foreground` 0.

**Confirmación de H-1:** sí. El rango 2.25-2.76:1 corresponde a los tres esquemas claros de Archive (scheme-3 2.25, scheme-1 2.56, scheme-5 2.76). Además scheme-4 (2.52) y scheme-2 (4.09) también fallan; D28 los cubre porque el defecto es el mismo hex.

### 2.5 Elección del token (compuerta 3)

- `var(--color-foreground)`: token existente (`assets/base.css:6`, por esquema en `layout/theme.liquid:85`). Es el par texto/fondo que el comerciante ya controla y el que certifica la fila 47 (base 15.52:1). Mismo criterio que A-03 para el anillo de foco (`:9104-9110`, `:9129-9133`). 0 fallos.
- `var(--color-button)` / `--color-accent`: conserva el tono latón, pero el par botón/fondo no está pensado como par de texto y falla en Archive scheme-2 (4.09) y scheme-3 (4.14). Descartado.
- Token nuevo o `color-mix`: añadiría un valor sin garantía por esquema y contradice «reutilizar». Descartado.

Coste de diseño asumido: el hover deja de ser latón. La pista de hover se mantiene: el botón pasa de relleno a contorno (fondo transparente, borde y texto en `--color-foreground`) y el título de la tarjeta conserva la cursiva.

## 3. Nivel del cambio y alcance

### 3.1 Lista cerrada de archivos que puede tocar la implementación

- `assets/base.css` (solo las cuatro líneas de §1).
- `docs/requirements-ledger.md` fila 47 (nota de evidencia; §5).
- Informe en `agent-comms/outbox-claude/` y, si se quiere, un arnés propio en `agent-comms/outbox-claude/harness-H1-001/`.

### 3.2 Sitios con #b5885c y si se cambian

| Sitio | ¿Se cambia? | Motivo |
|---|---|---|
| `assets/base.css:9114`, `:9115` (botón heritage hover) | Sí | Texto de botón (14 px) y su borde sobre fondo transparente. Es el defecto. |
| `assets/base.css:9121` (título de tarjeta heritage hover) | Sí | Texto 15.2 px. Es el defecto. |
| `assets/base.css:9126` (`.site-header__link:hover`) | Sí, solo por coherencia | El selector no tiene marcado en el tema (`grep -rn "site-header__link" sections snippets layout assets/*.js` sin resultados). Cambiarlo no tiene efecto en ejecución y deja el bloque sin hex fijos; borrarlo sería ampliar alcance (§6). |
| `config/settings_data.json:267` (Archive scheme-2, `button`) | No | Es el color de fondo del botón del esquema oscuro, con etiqueta `#241F19`; no es texto sobre fondo en hover. Tocarlo cambia un `default` de preset (Nivel 2) sin necesidad. |
| `agent-comms/outbox-claude/harness-ML-001/contrast.json:947`, `:955` | No | Artefacto histórico de un arnés, no es parte del tema. |

### 3.3 Nivel

**Nivel 1** según RULES §3.5: cambia solo valores CSS dentro de un selector existente, a un token existente; no toca `id`, `default`, opciones de select, schema ni locales, y no sale de la lista de §3.1. Es reversible en una línea por declaración.

Nota para la revisión: el cambio altera la identidad visual del hover de heritage (de latón a color de texto) en todos los presets que usen heritage. Si la revisión considera eso «estilo compartido» y lo reclasifica como **Nivel 2, queda autorizado expresamente por D28** («si la solucion resulta de Nivel 2, la autoriza su R-D») y por esta R-D.

## 4. Verificación reproducible

```text
$ node /tmp/claude-0/-home-user-Tema-Shopify/6a519136-63e8-5e29-8918-5c19680ae99e/scratchpad/h1-contrast.mjs \
    /home/user/Tema-Shopify/config/settings_data.json
preset scheme bg | #b5885c | --color-button(accent) | --color-foreground
Sartorial scheme-1 #F7F3EA | 2.86 | #1D1B18 15.52 | #1D1B18 15.52
Sartorial scheme-2 #1D1B18 | 5.43 | #D8A85D 7.92 | #F8F4EB 15.65
Sartorial scheme-3 #EDE7DA | 2.57 | #1D1B18 13.95 | #1D1B18 13.95
Sartorial scheme-4 #D8A85D | 1.46 | #1D1B18 7.92 | #1D1B18 7.92
Sartorial scheme-5 #FBF9F4 | 3.01 | #1D1B18 16.33 | #2A2621 14.28
Imprint scheme-1 #FFFFFF | 3.16 | #111111 18.88 | #111111 18.88
Imprint scheme-2 #111111 | 5.97 | #FAFAFA 18.09 | #FAFAFA 18.09
Imprint scheme-3 #F2F2F2 | 2.82 | #111111 16.87 | #111111 16.87
Imprint scheme-4 #2E3440 | 3.95 | #F0F2F5 11.14 | #F0F2F5 11.14
Imprint scheme-5 #FAFAFA | 3.03 | #111111 18.09 | #1A1A1A 16.67
Archive scheme-1 #EFE6D9 | 2.56 | #8A5A3B 4.71 | #2E241C 12.27
Archive scheme-2 #2F3327 | 4.09 | #B5885C 4.09 | #EFE6D9 10.46
Archive scheme-3 #E4D8C6 | 2.25 | #8A5A3B 4.14 | #2E241C 10.78
Archive scheme-4 #6E482F | 2.52 | #FFF8F0 7.58 | #FFF8F0 7.58
Archive scheme-5 #F5EFE5 | 2.76 | #8A5A3B 5.09 | #2E241C 13.25
root fallback #faf8f5: brass 2.98 accent #786c5e 4.83 fg #1c1917 16.50
esquemas 15 fallos <4.5: {"brass":13,"accent":2,"fg":0}
```

Qué demuestra: con los colores de esquema de los tres presets, el par `--color-foreground`/`--color-background` supera 4.5:1 en todos. Qué no demuestra: el color calculado en el navegador (cascada, `background_gradient`, imagen detrás) ni esquemas creados por el comerciante (para esos, el contraste del hover pasa a ser exactamente el del texto normal del esquema, que ya es responsabilidad del par texto/fondo).

## 5. Criterios de aceptación (falsables) y ledger

### 5.1 Criterios

1. `grep -n -i "b5885c" assets/base.css` devuelve 0 líneas tras el cambio.
2. `git diff a8ac15c -- assets/base.css` muestra exactamente 4 líneas cambiadas, todas en `:9114`, `:9115`, `:9121`, `:9126` (o sus equivalentes si se desplazan), y cada nueva línea contiene `var(--color-foreground)`.
3. `git diff --stat a8ac15c` no lista archivos del tema fuera de `assets/base.css` (en particular, `config/settings_data.json`, `sections/`, `snippets/`, `templates/`, `locales/`, `layout/` sin cambios).
4. El script de §4 (o uno equivalente del implementador) da 0 fallos bajo 4.5:1 en los 15 esquemas para `--color-foreground`; mínimo 7.58:1.
5. Prueba sintética en Chromium local (R-A previa a tienda): con `data-motion-style="heritage"`, `prefers-reduced-motion: no-preference` y hover forzado sobre `.button` y `.product-card__title a` dentro de `.color-scheme-1..5` del preset Archive, `getComputedStyle(el).color` es igual a `--color-foreground` del esquema y el ratio calculado con el fondo efectivo es ≥ 4.5:1 en los 5 esquemas.
6. Theme Check sin errores nuevos respecto a `a8ac15c`.
7. En tienda (R-A, cuando haya preview Archive disponible): medición en hover de botón y título de tarjeta en `/` y `/collections/*` a 1280 y 375 px, ratio ≥ 4.5:1 medido con el mismo cálculo WCAG sobre colores computados. Hasta entonces, estado máximo `código completo`.

### 5.2 Filas del ledger

- **Fila 47 (`Contraste de Texto >= 4.5:1`, WCAG 1.4.3): se MODIFICA, no se cierra.** Añadir a evidencia: «H-1 (lote-c): hover heritage `#b5885c` (2.25-4.09:1 en Archive) sustituido por `var(--color-foreground)` en `assets/base.css:9114,9115,9121,9126` — evidencia de implementación pendiente (hash y archivo:línea tras el commit); pendiente prueba R-A en preview Archive». No se marca `cumplido` por este cambio; la revisión decide si el estado actual `cumplido` debe bajar a `código completo` hasta la prueba en tienda (RULES §3.8).
- Fila 48 (1.4.11): no se modifica. El borde del botón en hover también mejora (de 2.25-4.09 a ≥ 7.58), pero el texto ya identifica el control; se menciona solo como efecto lateral.

## 6. Hallazgos extra fuera de alcance (no se tocan en H-1)

- **HX-1. Selector muerto `.site-header__link`.** No tiene marcado en `sections/`, `snippets/`, `layout/` ni `assets/*.js`. Parche posible en otra tarea: eliminar la regla `assets/base.css:9125-9127`. Ya lo señaló C-1 de `CLAUDE-REVIEW-A-03-RD-001`.
- **HX-2. Hover de `.button--secondary` en heritage.** La regla heritage (especificidad mayor) pisa `.button--secondary:hover` (`assets/base.css:1032-1035`, que rellena con `--color-button`). Con el cambio, un botón secundario en heritage solo cambia el color del borde en hover. No es un fallo WCAG; se registra por si se quiere una pista de hover más visible. Sin parche.

## 7. Afirmaciones falsables

1. En `lote-c` `a8ac15c`, `#b5885c` aparece en el tema solo en `assets/base.css:9114,9115,9121,9126` y en `config/settings_data.json:267` (mayúsculas).
2. Las cuatro líneas de `base.css` están dentro de `@media (prefers-reduced-motion: no-preference)` abierto en `:9058`.
3. El texto afectado es de 14 px y 15.2 px en negrita: umbral 4.5:1.
4. Contraste actual en Archive: 2.56, 4.09, 2.25, 2.52, 2.76 (scheme-1..5).
5. Con `var(--color-foreground)`, el mínimo en los 15 esquemas de preset es 7.58:1 y no hay fallos bajo 4.5:1.
6. `var(--color-button)` falla en Archive scheme-2 (4.09) y scheme-3 (4.14).
7. `.site-header__link` no tiene marcado en el tema.
8. Esta entrega no modifica ningún archivo del tema.
