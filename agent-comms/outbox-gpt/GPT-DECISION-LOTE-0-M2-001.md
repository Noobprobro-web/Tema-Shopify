ID: GPT-DECISION-LOTE-0-M2-001
Estado: Decisión M2 tomada; ejecución y confirmación pendientes.
Decisión requerida: Johandry debe confirmar cuando haya completado la rotación y la actualización local. Las decisiones 0-04 permanecen pendientes de Johandry.
Resumen en 5 líneas:
1. El 2026-10-31 Johandry decidió repetir la rotación M2.
2. Johandry rota la contraseña de tema-qkqpke0j y de las tres demos y actualiza STOREFRONT_PASSWORD localmente.
3. La instrucción no acredita que esas acciones se hayan ejecutado; siguen pendientes de confirmación de Johandry.
4. Ningún agente prueba credenciales antiguas ni accede a valores de credenciales o de la variable para comprobarlos.
5. Continúan únicamente inventarios offline independientes; M2, R-0 y Lote 0 no se declaran verificados ni cerrados.
Archivos tocados: agent-comms/outbox-gpt/GPT-DECISION-LOTE-0-M2-001.md (nuevo).
Desviaciones (Nivel 1 o Nivel 2): Ninguna; registro documental, sin implementación ni cambio de contrato.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): Ver sección «Evidencia documental».
Lista de afirmaciones falsables numeradas: Ver sección «Alcance y estado».

## Decisión y restricciones

- **Fecha y autoridad:** 2026-10-31; decisión expresa de Johandry.
- **Decisión exacta:** «M2: la rotación se repite. Johandry rota la contraseña de tema-qkqpke0j y de las tres demos y actualiza STOREFRONT_PASSWORD localmente. Ningún agente prueba credenciales antiguas. Registra la decisión con fecha 2026-10-31 y sigue el Lote 0 hasta la siguiente decisión mía.»
- **Responsable:** Johandry ejecuta la rotación y actualiza localmente la variable. Pendiente su confirmación de ambas acciones; no se presume realizada ninguna.
- **Agentes:** no prueban credenciales antiguas; no solicitan, leen ni imprimen valores de credenciales; no acceden a la variable para comprobarla; no guardan secretos, cookies ni tokens y no los incluyen en comandos o logs.
- **Impacto:** M2 es una decisión tomada, con ejecución pendiente de confirmación. Hasta entonces no se declara M2 verificado o cerrado. R-0 y Lote 0 tampoco se declaran cerrados. Pueden avanzar solo inventarios offline que no dependan de esa ejecución. Las decisiones 0-04 se reservan a Johandry; este registro no las elige ni ejecuta.
- Sin acceso a tiendas o red, publicación, push, metafields, Sebas, A-02 ni Lote A en esta actuación. Ninguna fila del ledger se cierra o modifica.

## Alcance y estado

1. La base autorizada para esta actuación es `isolated-sartorial-lote0-09f`, HEAD `09f834295074402d9b93aa8ead83a732d78e6608`; el estado observado identifica tres assets modificados. Esto no acredita un build desplegado ni una prueba funcional.
2. El antecedente parcial `GPT-REPORT-LOTE-0-BASE-001.md` conserva SHA-256 `e5a8f4bdb979a8ac678faf709758d50eaca7ca40cf2c048f4b9bfd4886cce157`; no se modificó. El plan V4.1 conserva SHA-256 `917ddff1b9c96f62136d1b1070a0568f1f52f3b7bfa5681a80a1dcfb697d1a3d`. La decisión de este registro actualiza el estado M2 descrito como pendiente de decisión en el plan, sin editarlo.
3. El resultado es exclusivamente documental. No demuestra la rotación, el contenido de ninguna variable, el estado de una tienda ni el cumplimiento de compuertas.

## Evidencia documental

En la base autorizada se ejecutaron `git rev-parse HEAD` y `git status --short --branch`, con salida:

```text
09f834295074402d9b93aa8ead83a732d78e6608
## HEAD (no branch)
 M assets/base.css
 M assets/product-zoom.js
 M assets/theme.js
```

Se ejecutó `Get-FileHash -Algorithm SHA256` sobre los dos documentos de antecedente indicados arriba y produjo los dos SHA-256 citados. Antes de crear este registro, `Test-Path` sobre su ruta produjo `False`. La creación usa `CreateNew`; tamaño y hash final del registro se comunican por separado para evitar autorreferencia. Estas comprobaciones son locales y documentales; no prueban funcionamiento ni ejecución M2.