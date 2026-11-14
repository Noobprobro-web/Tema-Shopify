# CLAUDE-REVIEW-H1-LOTE-C-001: revisión independiente de H-1 (Lote C)

```text
ID: CLAUDE-REVIEW-H1-LOTE-C-001 (revisión de la implementación 0c0902a contra CLAUDE-DIRECTIVA-H1-LOTE-C-001 y D28)
Estado: ACEPTADO. La fila 47 sigue en `código completo` hasta la prueba R-A en tienda (preview Archive).
Decisión requerida: ninguna.
Resumen en 5 líneas:
  1. El diff c691fdb..0c0902a toca en el tema solo assets/base.css:9114, 9115, 9121, 9126 (3 hunks, 4 líneas).
  2. 0 coincidencias de b5885c en assets/base.css; settings_data.json y harness-ML-001/contrast.json sin cambios.
  3. Contraste recalculado de forma independiente (Python): mínimo 7.58:1 (Archive scheme-4), 0 fallos en 15 esquemas; coincide con §2.4/§4 de la directiva.
  4. Theme Check ejecutado tras `npm ci`: 93 archivos, 0 ofensas. Literal: 0 en el diff y 0 fuera de axe en contexto de contraseña.
  5. Bajar la fila 47 de `cumplido` a `código completo` es correcto (RULES §5): el estado hover de Archive nunca se midió en tienda.
Archivos tocados: este informe y una línea en CLAUDE-CLOUD-STATUS.md. Tema sin cambios.
Desviaciones (Nivel 1 o Nivel 2): ninguna. El cambio es Nivel 1 (valor CSS a token existente).
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo; HX-1 y HX-2 de la directiva siguen abiertos.
Verificación (comando, resultado y qué demuestra/qué no): §1. Todo estático salvo Theme Check; no hay medición en navegador ni en tienda.
Lista de afirmaciones falsables numeradas: §3.
```

## 1. Verificación

| # | Comando | Resultado | Qué demuestra / qué no |
|---|---|---|---|
| 1 | `git diff -U0 c691fdb..0c0902a -- assets/base.css \| grep '^@@'` | `@@ -9114,2 +9114,2`, `@@ -9121 +9121`, `@@ -9126 +9126`. `git show --stat 0c0902a`: base.css 8 (4+/4-), ledger 2, CLOUD-STATUS 1 | Exactamente las 4 líneas de la R-D, cada una con `var(--color-foreground)`. Ningún otro archivo del tema. Se conservan `background: transparent`, `transform: none` y `font-style: italic`. |
| 2 | `grep -n -i b5885c assets/base.css \| wc -l` / `git diff --stat c691fdb..0c0902a -- config/settings_data.json agent-comms/outbox-claude/harness-ML-001/contrast.json \| wc -l` | `0` / `0` | Sin hex fijo en base.css; preset y artefacto histórico intactos. |
| 3 | `python3 -I scratchpad/rev-h1-contrast.py config/settings_data.json` (script propio, fuera del repo; fórmula WCAG 2.x, `text` vs `background` de cada esquema de preset, igual que `layout/theme.liquid:84-85`) | Archive: s1 12.27, s2 10.46, s3 10.78, s4 7.58, s5 13.25 (antes 2.56/4.09/2.25/2.52/2.76). 15 esquemas: `min 7.58 fails 0` | Coincide cifra a cifra con la directiva. Los 5 esquemas de Archive tienen `background_gradient` vacío. No mide colores computados en navegador ni esquemas creados por el comerciante. |
| 4 | `grep -c "var(--color-foreground)" assets/base.css`; `sed -n 6p assets/base.css` | 130 usos; `--color-foreground: #1c1917;` en `:root` | El token ya existe y es el que usa el foco heritage/technical (A-03, `:9108`, `:9132`). No hay hex parecido que reutilizar: `#2e241c` no aparece en assets. Compuerta 3 superada. |
| 5 | `sed -n 47p docs/requirements-ledger.md` y diff del ledger | Estado `código completo`; evidencia `assets/base.css:9114,9115,9121,9126`, mínimo 7.58:1 estático, "pendiente prueba R-A en preview Archive" | Coherente con RULES §5: `cumplido` exigía cubrir el estado hover, que fallaba en Archive y no se ha medido en tienda. |
| 6 | `npm ci` y luego `npx --no-install shopify theme check --fail-level error` | `93 files inspected with no offenses found.` | Theme Check ejecutado de verdad en 0c0902a. No es prueba visual. |
| 7 | Método de CLAUDE-HANDOFF-CLOUD-002 §5 (derivación en memoria, sin imprimir) | 1 candidato; árbol 46 en 28 archivos; 0 líneas en contexto de contraseña fuera de `tests/vendor/axe.min.js`; `diff c691fdb..0c0902a` 0; `origin/lote-c..HEAD` 0; este informe 0 | Compuerta del literal superada. |

## 2. Hallazgos

- **P0 / P1:** ninguno.
- **P2-1. Criterio 5.1.5 de la directiva sin ejecutar.** La prueba sintética en Chromium local (`getComputedStyle` en hover dentro de `.color-scheme-1..5` de Archive) no tiene evidencia en 0c0902a; la línea de CLOUD-STATUS dice «estático». No bloquea el código; sí bloquea pasar la fila 47 a `cumplido`. Hacerla junto con R-A.
- **P3-1.** El comentario `assets/base.css:9112` («patina de laton envejecido») ya no describe el color. Opcional según la directiva.
- **P3-2.** La evidencia de la fila 47 no cita el hash 0c0902a (no se puede citar en el mismo commit). Añadirlo cuando se cierre R-A.
- **P3-3.** HX-1 (selector muerto `.site-header__link`) y HX-2 (hover de `.button--secondary` en heritage, solo cambia el borde) siguen abiertos, fuera de alcance.

## 3. Afirmaciones falsables

1. En 0c0902a, el diff contra c691fdb cambia en el tema solo `assets/base.css:9114,9115,9121,9126`.
2. `grep -n -i b5885c assets/base.css` devuelve 0 líneas.
3. `config/settings_data.json` y `agent-comms/outbox-claude/harness-ML-001/contrast.json` no cambian en c691fdb..0c0902a.
4. El contraste `text`/`background` mínimo en los 15 esquemas de preset es 7.58:1 (Archive scheme-4); 0 bajo 4.5:1.
5. Theme Check en 0c0902a: 93 archivos, 0 ofensas.
6. La fila 47 del ledger está en `código completo`, no en `cumplido`.
7. El literal aparece 0 veces en el diff c691fdb..0c0902a y en este informe.
