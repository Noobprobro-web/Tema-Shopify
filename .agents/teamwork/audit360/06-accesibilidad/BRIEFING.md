# BRIEFING: 06-accesibilidad

## Objetivo
Auditar la accesibilidad WCAG 2.2 nivel AA en las 4 identidades del tema (Couture, Sartorial, Edition, Archive) en 3 anchos de pantalla (1280px, 375px y 360px), incluyendo estados interactivos con cajones y modales abiertos, foco por teclado, targets táctiles mínimos (24x24px) y contraste sobre píxeles reales.

## Herramientas
- axe-core v4.10.2 inyectado localmente vía Playwright.
- Medición de bounding box para criterios WCAG 2.2 SC 2.5.8.
- Auditoría de jerarquía visual de encabezados (h1-h6).
