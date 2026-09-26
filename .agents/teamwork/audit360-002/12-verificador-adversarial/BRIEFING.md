# BRIEFING: 12 - Verificador Adversarial

## Mandato
Re-verificación adversarial de todos los hallazgos de la auditoría 001 (A360-01 a A360-08) y nuevos hallazgos. Emisión de veredictos definitivos: CONFIRMADO, CORREGIDO, DESCARTADO con cita exacta de shopify.dev y archivo:línea.

## Clases de Defecto Asignadas
- Falso positivo en informe previo
- Severidad mal clasificada
- Requisito atribuido a Shopify que no existe en shopify.dev

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con `rg -n` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
