# BRIEFING: 06 - Accesibilidad WCAG 2.2 AA

## Mandato
Auditoría de accesibilidad: axe-core en 84 combinaciones de temas/páginas/viewports, recorrido de foco por teclado (Tab/Shift+Tab, detección de foco tapado), y medición de contraste real sobre píxeles en imágenes de hero/banner con velo.

## Clases de Defecto Asignadas
- Violación axe WCAG 2.2 AA
- Elemento interactivo inaccesible por teclado
- Foco tapado por contenedor o z-index
- Contraste < 4.5:1 en texto o < 3:1 en UI

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con `rg -n` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
