# Revisión independiente · A-03 seguimiento · 2026-11-08

**Dictamen: PARCIAL.** El seguimiento amplía la evidencia de foco con hover, pero no completa la matriz de `CLAUDE-DIRECTIVA-A-03-001.md:304` ni resuelve las señales de la revisión 001.

En `matrix-persistent-read-only-20261108T205655091Z-6cd1c1e0-94f4-4426-a0f7-eb66aaf3a0dd.json`, SHA-256 `155440014a4e60a4c82c3e262fd55c4a98b186da7c077e3cf5677757d2b9f657`, hay doce combinaciones de preset, dos tamaños y dos preferencias. Cada una localizó newsletter del footer, enlace hero y control de búsqueda del header: 36 filas con `focusVisible` y `hovered`; el selector de país del footer no se encontró visible en las doce. Hay 34 ratios CSS calculados y dos nulos; ninguno de los 34 es menor de 3:1 en este subconjunto.

El método usa foco programático seguido de Shift+Tab y Tab alrededor del control, y estima contraste de outline frente a fondo ancestro. No demuestra un recorrido completo en ambos sentidos ni contraste de píxel real, sombras o imagen del hero. El control de búsqueda observado no sustituye input y submit de predictive search; tampoco se cubren todos los controles, estados deshabilitados/aria-disabled, capturas y drawer exigidos. Las 32 señales heurísticas menores de 3:1 de la corrida anterior no quedaron atribuidas ni medidas visualmente; Imprint conserva la prioridad indicada por la directiva. Los `passed` del wrapper acreditan observación, no conformidad WCAG.

La sesión de solo lectura registró identidad de los presets, preflight y carrito inicial/final con HTTP 200, cero artículos/líneas y nota vacía; `cartTouched=false`, sin eventos 429 y contexto cerrado. Esta revisión no repitió las mediciones y no cierra filas del ledger.
