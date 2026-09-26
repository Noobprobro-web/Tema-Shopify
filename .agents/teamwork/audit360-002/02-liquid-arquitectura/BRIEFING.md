# BRIEFING: 02 - Liquid y Arquitectura

## Mandato
Revisión exhaustiva de todas las secciones, snippets, plantillas JSON y layout/theme.liquid. Verificación de bucles con limit, manejo de nil/blank, anchos responsivos en image_url, IDs dinámicos únicos, y soporte de @app y custom_liquid.

## Clases de Defecto Asignadas
- Bucle sin límite (for sin limit:)
- Falta de escape Liquid
- image_url sin responsive widths
- ID estático repetido en bucle
- Bloque custom_liquid faltante

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con `rg -n` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
