ID: GPT-DECISION-LOTE-0-04-C08-001
Fecha de decisión: 2026-11-02 (America/Caracas)
Estado: Decisión de contenido 0-04/C-08 tomada; preparación de Lote 0 continúa. C-08 no implementado.
Decisión requerida: Ninguna adicional sobre el criterio C-08 aprobado. R-0 y la aprobación de Johandry para Lote A permanecen pendientes.
Resumen en 5 líneas:
1. Johandry aprobó C-08 de la sección 7 del informe de avance, con el criterio posterior aquí registrado.
2. Las promesas sin respaldo verificable en la propia tienda deben retirarse o sustituirse por contenido neutro, prefiriendo esas opciones a ocultarlas.
3. Solo se conservan promesas con respaldo aplicable y verificable en la propia tienda y el contenido neutro; sin excepciones.
4. No deben quedar promesas residuales ocultas, en fallbacks, páginas asociadas, CTA o destinos que induzcan a error.
5. Esta decisión prepara 0-04; no autoriza implementar C-08 en Lote A ni efectuar escrituras en tienda.
Archivos tocados: este documento nuevo en `agent-comms/outbox-gpt/`.
Desviaciones (Nivel 1 o Nivel 2): Ninguna; registro documental sin implementación ni modificación de contratos.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): Preflight e identidad documental al final; no acredita cumplimiento en tienda.
Lista de afirmaciones falsables numeradas:
1. La decisión expresa es del 2026-11-02 y responde a la pregunta de `GPT-REPORT-LOTE-0-AVANCE-002.md` §7.
2. El criterio aprobado requiere respaldo aplicable y verificable en la propia tienda; no deja excepciones.
3. Las excepciones hipotéticas y la opción de conservar una promesa mediante ocultación, planteadas en §7, quedan desplazadas por la decisión posterior aquí registrada.
4. No se ejecutó C-08 ni A-02, no se modificó el plan ni código, y ninguna fila del ledger se cierra.

# Decisión de Johandry

El 2026-11-02 Johandry indicó: «Apruebo C-08 de la sección 7. Retira o sustituye por contenido neutro las promesas sin respaldo verificable; prefiere retirar o sustituir antes que ocultar, para que no quede la promesa en bloques ocultos. Conserva solo las acreditadas con respaldo verificable en la propia tienda y el contenido neutro. Sin excepciones. Registra la decisión con fecha 2026-11-02 y sigue el Lote 0.»

Esta decisión responde y resuelve la pregunta de `GPT-REPORT-LOTE-0-AVANCE-002.md` §7, relativa a los ocho grupos del inventario. Prevalece sobre la propuesta anterior cuando esta admitía excepciones hipotéticas o dejar una promesa oculta. El respaldo debe ser **aplicable y verificable en la propia tienda**; no basta presumirlo. La falta de respaldo observado no demuestra que una afirmación sea falsa. C-08/RC-07 conserva su prioridad P1 condicionada.

# Criterios para una futura directiva C-08

1. Inventariar cada promesa alcanzada por su texto y contexto, producto o mercado, superficie y destino; registrar el respaldo aplicable y verificable en la propia tienda para cada una que se proponga conservar.
2. Retirar o sustituir por contenido neutro cada promesa cuyo respaldo aplicable no se verifique en la propia tienda. Preferir retirar o sustituir a ocultar; no introducir en un texto supuestamente neutro otra afirmación factual que requiera respaldo y no lo tenga.
3. Verificar que la promesa retirada no permanezca como texto en bloques ocultos, fallbacks, contenidos o páginas asociadas, CTA, enlaces u otros destinos engañosos. Revisar el comportamiento de un campo vacío: vaciarlo por sí solo no demuestra que el fallback o contenido asociado desaparezcan.
4. Una ocultación funcional de un bloque genuinamente vacío es distinta de conservar una promesa dentro de un bloque oculto; esta última no satisface el criterio. Definir el tratamiento concreto de cada enlace o destino según su uso, sin ordenar el borrado indiscriminado de páginas.
5. Conservar el contenido neutro y las promesas individualmente respaldadas en la propia tienda; sin excepciones para promesas sin respaldo verificable aplicable. No declarar falsa una afirmación solamente porque aún no se encontró respaldo.
6. Mantener separado el soporte al comerciante bajo C-04-P/G3. La retirada ya decidida para A-02 sigue su propia ruta, sin nueva decisión de contenido; no se toca en esta actuación.
7. Registrar evidencia por superficie y verificar el recorrido de ausencia, fallbacks y destinos al ejecutar la directiva autorizada; conservar límites de la comprobación y solicitar revisión independiente. No inferir estado de despliegue o tienda de un análisis estático.

La decisión resuelve el criterio de contenido en 0-04, no autoriza ejecutar C-08. Antes de abrir Lote A se requieren R-0 aceptado por Claude y aprobación de Johandry. A-02 requiere además autorización técnica previa y explícita de Antigravity para Nivel 2. Se mantienen las decisiones previas de cinco valores de copy, base y M2; no se reabren.

# Preflight e integridad documental

Base fuente: `C:\Users\Johan\Documents\Drive\Tema Shopify\isolated-sartorial-lote0-09f`. En la secuencia de trabajo de esta sesión ya se consultaron AGENTS, BOARD de solo lectura, RULES y el plan autorizado; en este turno, tras `git status`, se comprobó que las tres instrucciones no tenían diff respecto a HEAD y se verificó el hash del plan. Salida de `git status --short --branch`:

```text
## HEAD (no branch)
 M assets/base.css
 M assets/product-zoom.js
 M assets/theme.js
 M listings/sartorial/templates/index.json
```

`git rev-parse HEAD` → `09f834295074402d9b93aa8ead83a732d78e6608`. `git diff --quiet -- AGENTS.md agent-comms/BOARD.md agent-comms/RULES.md` → `INSTRUCTIONS_DIFF_EXIT=0`. `Get-FileHash -Algorithm SHA256` sobre las cuatro rutas modificadas dio:

```text
assets/base.css 5d9ed6b2981f115d9fca06406a47a6ff784e63023883ea1e88f49ec84429af43
assets/theme.js db2f2a6efd27f45b4a0bf68a1368f2598adceedddd207784c26e6632eac56a9c
assets/product-zoom.js 4828d5a15471330e4d82f52bd16016c3ef1e71e2f53d275e9dc3cab28aa6c246
listings/sartorial/templates/index.json 9e50aea4a4896438b66191d7044e0eb1dae68083d5563c45b910ac3c3aac1768
```

El mismo comando de hash verificó V4.1 `917ddff1b9c96f62136d1b1070a0568f1f52f3b7bfa5681a80a1dcfb697d1a3d`, avance 002 `91b3f7f6daf0aeac02d5fc255067165ea7b566aa84841d1fc7b82f240ddec43a` e inventario C08-001 `5e98fa442e3b84a3c6dd5b96a9bf0dce7ae621b95cf65f91ef90710f39f2d915`. Esta comprobación identifica archivos, no demuestra cumplimiento de contenido, funcionalidad o tienda. No hubo red, pruebas de credenciales, cambios de código, commits, pushes ni escritura en tiendas. El hash y tamaño de este registro se informan fuera del propio documento.
