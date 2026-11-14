ID: CLAUDE-DECISION-C-08-001
Fecha de comunicación de Johandry: 2026-11-04
Fecha de registro: 2026-11-04
Estado: Registrado
Decisión requerida: Ninguna. Resuelve la autorización del Nivel 2 de C-08b (tres cambios que cambian el contrato con el comerciante).
Resumen en 5 líneas:
1. D26: Johandry autoriza los tres cambios de Nivel 2 de C-08b tal como los propone la R-D (`CLAUDE-REVIEW-C-08-RD-001`).
2. Los tres cambios: (1) bloques de entrega y devoluciones de la PDP vacíos se ocultan; (2) 24 valores por defecto del schema pasan a textos neutros; (3) se quita la opción «Private appointment» del formulario de contacto.
3. La parte de Nivel 1 de C-08 (contenido de plantillas, listings y locales) se aplica en cualquier caso.
4. La tarea ya estaba aceptada por el revisor (`CLAUDE-REVIEW-C-08-001`, ACEPTADO); faltaba esta autorización para publicar.
5. No se modifica ninguna fila del ledger por esta decisión.
Archivos tocados: este archivo (nuevo).
Desviaciones (Nivel 1 o Nivel 2): Ninguna nueva. Registra la autorización del Nivel 2 de C-08b.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): Ver sección «Verificación». No demuestra nada sobre tiendas.
Lista de afirmaciones falsables numeradas:
1. Este registro contiene una sola decisión, D26.
2. D26 autoriza únicamente tres cambios de Nivel 2 de C-08b: entrega y devoluciones vacíos ocultos, 24 defaults neutros y retirada de «Private appointment».
3. D26 no amplía D11 a otras tareas y no autoriza ningún otro cambio de Nivel 2.
4. D26 no modifica D11: el revisor sigue pudiendo autorizar por sí solo solo el Nivel 2 de A-02.
5. La parte de Nivel 1 de C-08 no depende de D26.
6. `CLAUDE-REVIEW-C-08-001` está en estado ACEPTADO.
7. Este archivo contiene 0 coincidencias del literal sensible de contraseña.
8. Esta actuación no ejecutó ningún script gate5, no contactó tiendas, no abrió `.secrets`, no usó force, no tocó master ni otras ramas y no abrió PR.

# Decisión de Johandry / Ruiz Digital (comunicada el 2026-11-04)

Autor de la decisión: Johandry / Ruiz Digital. Fecha: 2026-11-04.

Pregunta planteada a Johandry:

> C-08 (retirar promesas sin respaldo) incluye tres cambios que la R-D clasifica como Nivel 2 porque cambian el contrato con el comerciante: (1) si los campos de entrega o devoluciones de la PDP quedan vacíos, el bloque se oculta en vez de mostrar 'Delivery times and costs confirmed at checkout' / 'Returns subject to our store policy'; (2) 24 valores por defecto del schema pasan a textos neutros; (3) se quita la opción 'Private appointment' del formulario de contacto. La parte de Nivel 1 (contenido de plantillas, listings y locales) seguirá en cualquier caso. ¿Qué hacemos con estos tres cambios?

Respuesta textual de Johandry: «Autorizar los tres (Recomendado)».

Opción elegida:

> Se aplican tal como los propone la R-D. C-08 queda completa en el Lote A, con revisión de código Opus como siempre.

## D26. Nivel 2 de C-08b

Se autorizan los tres cambios de Nivel 2 de C-08b: (1) ocultar los bloques de entrega y devoluciones de la PDP cuando sus campos están vacíos; (2) pasar 24 valores por defecto del schema a textos neutros; (3) quitar la opción «Private appointment» del formulario de contacto. Solo esos tres cambios; D26 no amplía D11 a otras tareas.

# Referencias

- `CLAUDE-REVIEW-C-08-RD-001.md` (clasificación de Nivel 2).
- `CLAUDE-REVIEW-C-08-001.md` (ACEPTADO).

# Verificación

Registro documental; no se ejecutó código nuevo. Qué demuestra: la decisión y su alcance. Qué no demuestra: nada sobre tiendas ni la prueba en tienda de C-08.
