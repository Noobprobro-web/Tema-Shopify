# BRIEFING: 17 - Datos y Formatos

## Mandato
Pruebas con monedas sin decimales (JPY, KRW) y con separadores coma/punto (EUR). Formato de precios largos, precios tachados y precio unitario. Textos largos y caracteres especiales (catálogo hostil de 18 casos límite).

## Clases de Defecto Asignadas
- Hardcoded toFixed(2) asumiendo 2 decimales
- Truncamiento de precios o títulos largos
- Error al renderizar caracteres especiales o comillas
- Desborde por descripción o vendor extenso

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con `rg -n` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
