ID: CLAUDE-DECISION-A-01-B-02-001
Fecha de comunicación de Johandry: 2026-11-04
Fecha de registro: 2026-11-04
Estado: Registrado
Decisión requerida: Ninguna. Resuelve la autorización de la desviación D-1 (Nivel 2) de `CLAUDE-REPORT-A-01-B-02-001.md`.
Resumen en 5 líneas:
1. D25: Johandry autoriza el archivo nuevo `snippets/variant-no-js-select.liquid`, que no estaba en la lista cerrada de la R-D de A-01/B-02.
2. La autorización cubre solo ese snippet; no amplía D11 a otras tareas ni autoriza otros archivos fuera de lista.
3. Sin el snippet, `sections/main-product.liquid` pasaría de 120 a 128 en LiquidComplexity de Theme Check; con él, queda en 120 y Theme Check da 0 ofensas.
4. La tarea ya estaba aceptada por el revisor (`CLAUDE-REVIEW-A-01-B-02-001`, §12, ACEPTADO); faltaba esta autorización para publicar.
5. No se modifica ninguna fila del ledger por esta decisión; el ledger lo cambia la entrega de A-01/B-02.
Archivos tocados: este archivo (nuevo).
Desviaciones (Nivel 1 o Nivel 2): Ninguna nueva. Registra la autorización de D-1 (Nivel 2) de A-01/B-02.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): Ver sección «Verificación». No demuestra nada sobre tiendas.
Lista de afirmaciones falsables numeradas:
1. Este registro contiene una sola decisión, D25.
2. D25 autoriza únicamente `snippets/variant-no-js-select.liquid`; ninguna otra ruta fuera de la lista cerrada de A-01/B-02.
3. D25 no modifica D11: el revisor sigue pudiendo autorizar por sí solo solo el Nivel 2 de A-02.
4. El snippet no añade ni cambia schema, ajustes ni claves de localización.
5. Theme Check sobre el árbol con el snippet da 0 ofensas (`CLAUDE-REPORT-A-01-B-02-001.md`, sección 3).
6. Este archivo contiene 0 coincidencias del literal sensible de contraseña.
7. Esta actuación no ejecutó ningún script gate5, no contactó tiendas, no abrió `.secrets`, no usó force, no tocó master ni otras ramas y no abrió PR.

# Decisión de Johandry / Ruiz Digital (comunicada el 2026-11-04)

Autor de la decisión: Johandry / Ruiz Digital. Fecha: 2026-11-04.

Pregunta planteada a Johandry:

> A-01/B-02 (suscripciones y variantes sin JS) está aceptado por el revisor, pero el implementador creó un snippet nuevo, snippets/variant-no-js-select.liquid, que no estaba en la lista cerrada. Así main-product.liquid se queda en el límite de complejidad de Theme Check (120) en lugar de pasarse a 128. El revisor lo clasifica como Nivel 2 (archivo fuera de la lista) y según D11 solo puede autorizar el Nivel 2 de A-02, no este. ¿Autorizas el snippet?

Respuesta textual de Johandry: «Autorizar snippet (Recomendado)».

Opción elegida:

> Se publica tal cual: un solo select compartido por la PDP y el producto destacado, sin cambios de schema, ajustes ni claves. Theme Check da 0 ofensas.

## D25. Snippet `variant-no-js-select` de A-01/B-02

Se autoriza la desviación D-1 de Nivel 2 de A-01/B-02: el archivo nuevo `snippets/variant-no-js-select.liquid`, usado por `sections/main-product.liquid` y `sections/featured-product.liquid`. Solo ese snippet; D25 no amplía D11 a otras tareas.

# Referencias

- `CLAUDE-REVIEW-A-01-B-02-001.md` (§12, ACEPTADO).
- `CLAUDE-REPORT-A-01-B-02-001.md` (D-1, secciones 3 y 7).

# Verificación

Registro documental; no se ejecutó código nuevo. Qué demuestra: la decisión y su alcance. Qué no demuestra: nada sobre tiendas ni la prueba en tienda de B-02 o A-01.
