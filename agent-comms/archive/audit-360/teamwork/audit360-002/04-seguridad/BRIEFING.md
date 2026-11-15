# BRIEFING: 04 - Seguridad y Escape

## Mandato
Auditoría de seguridad en Liquid y JS: escape de datos de usuario en URLs, búsquedas y formularios, sanitización HTML (escape vs strip_html), prevención de inyección XSS, ausencia de secretos/passwords en el código, y cumplimiento de CSP.

## Clases de Defecto Asignadas
- XSS reflejado o almacenado
- Dato sin escapar en atributo HTML
- Secreto/credencial en código
- Inyección en endpoint o query param

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con `rg -n` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
