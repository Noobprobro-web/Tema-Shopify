# BRIEFING: 15 - Navegadores y Entornos

## Mandato
Pruebas en motores Chromium, Firefox, WebKit en Playwright. Modo sin JavaScript. Zoom al 200% y reflow a 320 px (WCAG 1.4.10). Espaciado de texto (WCAG 1.4.12). Modo prefers-reduced-motion y forced-colors. Red 3G lenta.

## Clases de Defecto Asignadas
- Desbordamiento horizontal a 320 px
- Ruptura visual en Firefox o WebKit
- Contenido inerte o invisible sin JS
- Fallo con WCAG 1.4.12 text spacing

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con `rg -n` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
