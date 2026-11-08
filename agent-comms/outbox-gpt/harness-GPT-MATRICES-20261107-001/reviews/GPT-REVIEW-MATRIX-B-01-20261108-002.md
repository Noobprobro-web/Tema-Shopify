# Revisión independiente · B-01 seguimiento · 2026-11-08

**Dictamen: PARCIAL.** El cruce con scroll previo amplía la revisión 001, pero no completa la matriz de `CLAUDE-DIRECTIVA-B-01-001.md:298`.

En `matrix-persistent-read-only-20261108T205655091Z-6cd1c1e0-94f4-4426-a0f7-eb66aaf3a0dd.json`, SHA-256 `155440014a4e60a4c82c3e262fd55c4a98b186da7c077e3cf5677757d2b9f657`, los tres presets registran scrollY=240 antes de abrir el menú; tras el cruce emulado a escritorio, scrollY=0, `mainInert=false` y `bodyLocked=false`. Falta una lectura entre la apertura y el cambio de viewport: no se determina cuándo cambió el scroll. Tampoco se registra el foco posterior en este seguimiento.

Las tres ejecuciones de axe-core 4.10.2 con 29 reglas seleccionadas registran cero violaciones en ese subconjunto, pero `color-contrast` queda incompleto en los tres presets y `aria-valid-attr-value` también en Sartorial. Son resultados que necesitan revisión manual, no violaciones confirmadas ni certificación completa. El carrito desde el menú queda `not_run: NO_CART_CONTROL_IN_MENU` en los tres; siguen pendientes el editor, el arrastre real de ventana, los cruces y la continuidad de teclado/foco que faltaban en la revisión 001, y dispositivo físico si está disponible.

El JSON registra preflight, `cartTouched=false`, lectura inicial y final HTTP 200 con cero artículos/líneas y nota vacía, sin eventos 429 y contexto cerrado. Esta revisión no reejecutó la tienda y no cierra filas del ledger.
