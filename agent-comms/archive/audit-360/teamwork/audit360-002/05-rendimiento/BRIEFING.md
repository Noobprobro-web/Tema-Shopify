# BRIEFING: 05 - Rendimiento y CWV

## Mandato
Medición de Core Web Vitals (LCP, CLS, INP) en 72 corridas empíricas (4 temas x 3 páginas x 2 viewports x 3 corridas). Verificación de fetchpriority="high", optimización de fuentes tipográficas, render blocking scripts, y budget de assets.

## Clases de Defecto Asignadas
- CLS > 0.1
- LCP > 2.5s
- Falta de fetchpriority="high" en LCP hero
- Script bloqueante en head sin defer

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con `rg -n` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
