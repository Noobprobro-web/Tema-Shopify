# GPT-REVIEW-MATRIX-A-03-20261108-001

Fecha: 2026-11-08. Revisión independiente de los artefactos guardados; no se repitieron pruebas de navegador ni se accedió a la tienda.

**Dictamen: PARCIAL.** La corrida aporta muestras útiles de foco en las tres previews, pero no cumple la matriz completa de la directiva A-03 y no permite cerrar las filas de contraste no textual o navegación por teclado.

## Evidencia revisada

- [Informe final de matrices](../../GPT-TEST-MATRICES-20261107-001.md), sección A-03.
- [Resultado JSON A-03](../results/matrix-A-03-20261108T072012205Z-f399d2b5-386d-4a07-aaad-4d7c8cd31310.json), SHA-256 `db9aba967bd5b712b992a141c55c2ecdbcd3b13e1c2d6e25ec86dd86b55f29c1`.
- La directiva A-03, sección 4.4, exige una matriz por preset, control, estado, esquema, fondo y preferencia de movimiento; teclado en ambos sentidos, capturas y medida real sobre imagen para el hero de Archive.

## Resultados observados

El JSON contiene 36 recorridos: tres presets por dos viewports, dos preferencias de movimiento y tres rutas. Se registraron 1.817 eventos de foco, ninguno marcado invisible o inerte. Los tres accesos registran verificación de Shopify.theme.id. Footer scheme-2 aparece en las 36 celdas; el campo incluye muestras de input email, submit y select.

| Preset | Muestras | Ratios heurísticos menores de 3:1 | Mínimo heurístico |
|---|---:|---:|---:|
| Sartorial | 633 | 12 | 1,215:1 |
| Imprint | 598 | 12 | 1,106:1 |
| Archive | 586 | 8 | 1,378:1 |

Hay 35 eventos sin ratio calculable. Los valores son señales para investigar, no fallos WCAG confirmados: la instrumentación compara el color computado del outline con el primer fondo ancestro opaco y no mide el píxel real del área adyacente ni el contraste de box-shadow. Los registros no identifican inequívocamente cada control. La prioridad de la directiva para Imprint exige identificar y volver a medir sus señales bajas antes de un cierre.

## Límites y revisión

1. Cada entrada `A03_tab_focus_samples` se marca `passed` cuando termina la captura; el wrapper de `harness-GPT-RA-RB-001/run.mjs:194-203` no exige que `lowContrast` sea cero. El estado acredita obtención de muestras, no conformidad 3:1. El informe final lo describe como parcial.
2. La instrumentación temporal consultada en `scratch/codex-shopify-matrix-cases.mjs:15-47` recorre Tab y pulsa Shift+Tab una vez al final. No demuestra el recorrido inverso completo, foco con hover, controles deshabilitados o aria-disabled, ni la cobertura específica del stepper y checkout del cart drawer.
3. No se guardaron capturas ni un hash contemporáneo del wrapper efectivo de A-03; la copia temporal cambió entre matrices. No hay medida de píxel real para el hero sobre imagen. El propio JSON declara que no certifica contraste visual ni lector de pantalla.
4. El JSON registra `required_external_coordinator_check` para el preflight de cada sesión. El informe final declara CLI 4.8.0, salida 0 y los tres roles unpublished; esta revisión no reejecutó ese comando. Las huellas de base.css y theme.js identifican cuerpos servidos, pero por sí solas no vinculan la preview con un SHA completo del árbol.
5. Los tres contextos se cerraron y `cartTouched` es false. La política de filtrado de recursos figura como límite y puede afectar la representación observada.

Para cerrar A-03 se requieren controles identificados de la directiva con Tab y Shift+Tab, foco solo y con hover, estados deshabilitado y aria-disabled, medición y capturas sobre fondos efectivos, incluido el hero de Archive, y verificación específica del drawer. Las 32 señales inferiores a 3:1 deben atribuirse y medirse con el método apropiado; hasta entonces no se confirman como defectos ni se pueden declarar aprobadas.
