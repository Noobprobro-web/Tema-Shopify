# Revisión independiente · matriz B-01 · 2026-11-08

**Dictamen: PARCIAL.** La evidencia observada no completa la matriz de tienda de la directiva y no permite cerrar R-B ni filas del ledger. Esta revisión es documental; no repite las pruebas ni modifica el resultado crudo.

## Alcance y fuentes

- Directiva: [CLAUDE-DIRECTIVA-B-01-001, §4.4](../../../outbox-claude/CLAUDE-DIRECTIVA-B-01-001.md), en especial líneas 298–304.
- [Resultado JSON B-01](../results/matrix-B-01-20261108T072307840Z-09c61102-b653-4e65-b8d3-5f433649c7b0.json), SHA-256 `564719f00ad78c0b6d44aaa7ef30b4e4ef8af6cbbcc562b661f23f65c7d58d5d`.
- [Informe de las matrices](../../GPT-TEST-MATRICES-20261107-001.md), sección B-01 y preflight.

## Lo que sí registra el resultado

El JSON identifica las tres previews Sartorial, Imprint y Archive y registra cuatro secuencias de viewport por preset. En 390×844 → 1280×800 → 390×844 observa cierre del menú al cruzar a escritorio, liberación del bloqueo de scroll y de `inert` en `main`, y menú cerrado al volver a móvil. En 820×1180 → 1180×820 observa también cierre y liberación. En las dos secuencias entre 390×844 y 844×390 el menú continúa abierto. Son observaciones del navegador emulado; el JSON por sí solo no acredita el arrastre real de ventana pedido por la directiva.

Se registran 12 comprobaciones de axe-core 4.10.2 con 29 reglas seleccionadas y cero violaciones en esas comprobaciones. Axe también devuelve resultados `incomplete`: `color-contrast` en los tres presets y `aria-valid-attr-value` en Sartorial. Estos resultados requieren revisión; no se clasifican por sí solos como violaciones confirmadas. El indicador de foco CSS es una observación y no prueba contraste visual.

El drawer de carrito vacío se abre y cierra desde el encabezado en los tres presets. Los datos de sesión declaran `cartMutationsAllowed: false`, `cartTouched: false` y `contextClosed: true`. El campo de preflight del JSON remite a una comprobación externa; el informe principal documenta el preflight CLI y los IDs, por lo que el JSON aislado no acredita el inventario CLI.

## Cobertura pendiente y límites

1. El escenario de abrir el carrito desde el menú móvil, cruzar a escritorio y cerrar el carrito figura como `not_run: NO_CART_CONTROL_IN_MENU` en los tres presets. Abrir el carrito desde el encabezado no cubre ese escenario.
2. El intento que empieza en 1180×820 y vuelve a 820×1180 figura como `not_run: MOBILE_MENU_TRIGGER_NOT_RENDERED` en los tres presets. No consta una prueba del editor cambiando entre vistas con el menú abierto ni de tableta física.
3. El JSON incluye un resultado de teclado y axe por secuencia, sin evidencia independiente de ambos anchos 390 y 1280 tras cada cruce. Al volver a 390 en la secuencia principal registra foco en `BODY`; se requiere evaluar la continuidad de navegación. El scroll registrado es 0, por lo que queda sin evidenciar el cruce con scroll previo distinto de cero.
4. La corrida declara que el filtrado de recursos puede afectar los resultados y que no certifica lector de pantalla ni contraste visual. Las huellas de assets observados no identifican por sí solas el SHA completo del tema servido.

La revisión conserva las observaciones parciales sin elevarlas a aceptación de la matriz. Quedan pendientes los escenarios y verificaciones descritos arriba.
