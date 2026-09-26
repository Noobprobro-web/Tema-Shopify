# BRIEFING: 08 - Editor y Comerciante

## Mandato
Auditoría de personalizador: settings_schema.json, schemas de secciones y bloques, cobertura de claves t:, coherencia en locales/*.json, sentence case en labels, atributo info en settings dependientes de configuración externa.

## Clases de Defecto Asignadas
- Clave t: faltante o huérfana
- Label en Title Case en lugar de Sentence case
- Falta de atributo info en setting dependiente
- Default inválido en schema

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con `rg -n` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
