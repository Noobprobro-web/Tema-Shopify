# BRIEFING: 16 - HTML Válido y Estructura DOM

## Mandato
Validación del HTML renderizado con Nu HTML validator en todos los tipos de página. Detección de IDs duplicados en el DOM, referencias ARIA rotas (aria-controls, aria-labelledby) y anidamiento inválido de etiquetas.

## Clases de Defecto Asignadas
- ID duplicado en el DOM renderizado
- Referencia ARIA rota a ID inexistente
- Anidamiento prohibido (button en a, form en form)
- Error fatal de marcado Nu HTML

## Procedimiento
1. Pasada 1 (Línea a línea): Inspección sistemática de los archivos y superficies asignadas.
2. Polinización cruzada: Búsqueda con `rg -n` de defectos análogos detectados en otras áreas.
3. Pasada 2 ("Encuentra más"): Re-lectura crítica orientada a casos límite no cubiertos.
