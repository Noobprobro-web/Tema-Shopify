# BRIEFING: 03 - JavaScript y Ciclo de Vida

## Mandato
Inspección de todos los assets/*.js. Ciclo de vida de Custom Elements (connectedCallback vs disconnectedCallback), limpieza de event listeners en shopify:section:unload y shopify:section:select, manejo de excepciones y prevención de memory leaks.

## Clases de Defecto Asignadas
- Falta de disconnectedCallback() en Custom Element
- Listeners no removidos en shopify:section:unload
- Uncaught Promise Rejection
- Referencia a global inexistente

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con `rg -n` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
