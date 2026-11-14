ID: CLAUDE-DECISION-AUTONOMIA-001
Fecha de comunicación de Johandry: 2026-11-04
Fecha de registro: 2026-11-04
Estado: Registrado
Decisión requerida: Ninguna. Una nota queda «pendiente de aclaración» (R-0 del Lote 0, ver Nota (a)); se preguntará a Johandry solo si hay conflicto.
Resumen en 5 líneas:
1. D9: Claude ejecuta el plan V4.1 en orden (cierre del Lote 0, luego A, B, C y D) sin pedir aprobación entre lotes.
2. D10: Claude se detiene y pregunta solo ante un hallazgo P0/P1 nuevo, un cambio fuera del plan o de las decisiones, un gate que falla dos veces seguidas, una escritura en tiendas distinta de subir temas no publicados, o una duda sobre credenciales.
3. D11 y D12: un subagente Opus nuevo, con contexto limpio, revisa cada tarea de código y cada lote (R-A, R-B…); git va a `lote0/base-09f8342` hasta cerrar el Lote 0 y luego a una rama por lote, sin force y sin tocar `master`.
4. D13 a D15: tiendas solo con Shopify CLI y solo temas no publicados en `tema-qkqpke0j`; primero el empaquetador determinista del ZIP (SHA-256 esperado `79ff3961…fe0f`) y los 3 archivos que Theme Check no inspeccionó; el fixture de suscripción lo crea Johandry.
5. D16 a D18: estado vivo en `CLAUDE-CLOUD-STATUS.md` con commit tras cada tarea; reglas del plan (sin copiar de SebastianDev017/atelier, sin metafields, sin credenciales en archivos ni logs); cierre con informe, ZIP candidato y SHA-256, y el envío a la Theme Store lo hace Johandry tras revisión final de Antigravity.
Archivos tocados: solo dos archivos nuevos: este (`agent-comms/outbox-claude/CLAUDE-DECISION-AUTONOMIA-001.md`) y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`.
Desviaciones (Nivel 1 o Nivel 2): Ninguna. Registro documental; ninguna fila de `docs/requirements-ledger.md` se modifica o cierra. No se edita ningún archivo existente.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): Ver sección «Verificación». Es un registro documental: no demuestra que el plan V4.1 se haya ejecutado, que el ZIP regenere el SHA-256, ni nada sobre el estado de las tiendas.
Lista de afirmaciones falsables numeradas:
1. Antes de este commit, HEAD local y `origin/lote0/base-09f8342` estaban en `fbdf462af5254c28ad852fc166e5a44bcc4c2240`, con el árbol limpio.
2. El commit que añade este archivo contiene exactamente 2 rutas, ambas añadidas: este archivo y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`.
3. Este archivo y `CLAUDE-CLOUD-STATUS.md` contienen 0 coincidencias del literal sensible de contraseña.
4. El conteo del literal sobre el árbol base (`09f8342`) es 46 coincidencias en 28 archivos; fuera de `tests/vendor/axe.min.js` es 0 en HEAD; en lo publicado (`origin/lote0/base-09f8342..HEAD`) es 0.
5. Esta actuación no ejecutó ningún script gate5, no contactó tiendas, no abrió `.secrets`, no usó force, no tocó master ni otras ramas y no abrió PR.
6. `origin/master` sigue en `09f834295074402d9b93aa8ead83a732d78e6608` tras el push.
7. Este registro contiene 10 decisiones numeradas D9 a D18, una por punto de la cita.

# Decisiones de Johandry / Ruiz Digital (comunicadas el 2026-11-04)

Autor de las decisiones: Johandry / Ruiz Digital. Fecha: 2026-11-04.

Cita textual de Johandry:

> Modo autónomo, autorizado por Johandry el 2026-11-04. Regístralo en `agent-comms/outbox-claude/` antes de empezar:
> 1. Ejecuta el plan V4.1 en orden: cierra el Lote 0 y sigue con A, B, C y D sin pedir aprobación entre lotes.
> 2. Detente y pregunta solo si pasa algo de esto: un hallazgo P0 o P1 nuevo, un cambio fuera del plan o de las decisiones registradas, un gate que falla dos veces seguidas, cualquier escritura en tiendas distinta de subir temas no publicados, o cualquier duda sobre credenciales.
> 3. Revisión: al final de cada tarea de código y de cada lote, lanza un subagente Opus nuevo, con contexto limpio y que no haya escrito ese código, para que haga la revisión del lote (R-A, R-B, etc.) contra el plan. Si la rechaza, corriges y vuelves a revisar. Para A-02, la autorización técnica de Nivel 2 la da ese revisor.
> 4. Git: haz commit y push a `lote0/base-09f8342` hasta cerrar el Lote 0, y después a una rama por lote (`lote-a`, `lote-b`…), cada una partiendo de la anterior. Sin force y sin tocar `master`. Antes de cada push, el literal de contraseña debe contar 0 fuera de `tests/vendor/axe.min.js`, sin imprimirlo. Al terminar el Lote D, abre un PR hacia `master` y no lo fusiones.
> 5. Tiendas: con Shopify CLI y `SHOPIFY_CLI_THEME_TOKEN` desde el entorno, solo puedes subir temas no publicados en `tema-qkqpke0j` para las previews de Sartorial, Imprint y Archive, Lighthouse, axe y teclado. Nunca publiques, nunca borres temas existentes y no toques productos, apps ni configuración. Usa `STOREFRONT_PASSWORD` solo desde el entorno. No abras `.secrets`.
> 6. Primero: versiona en `scripts/` el empaquetador determinista del ZIP y verifica que regenera el SHA-256 `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f`. Comprueba también qué 3 de los 93 archivos no inspeccionó Theme Check.
> 7. El fixture de suscripción lo crea Johandry. Si no existe cuando llegues a A-01, sigue con lo que no dependa de él y déjalo marcado.
> 8. Mantén `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md` con lo hecho, la tarea en curso y lo pendiente, y haz commit después de cada tarea, para poder retomar si la sesión se reinicia.
> 9. Mantén las reglas del plan: no copiar código de SebastianDev017/atelier, no crear metafields y ninguna credencial en archivos ni en logs.
> 10. Al final, deja un informe de cierre con el ZIP candidato y su SHA-256 y detente. El envío a la Theme Store lo hace Johandry, después de una revisión final de Antigravity.

## D9. Orden de ejecución del plan V4.1

- Claude ejecuta el plan V4.1 en orden: cierra el Lote 0 y sigue con los Lotes A, B, C y D.
- No se pide aprobación entre lotes.

## D10. Condiciones de parada

- Claude se detiene y pregunta solo si ocurre alguno de estos casos:
  - un hallazgo P0 o P1 nuevo;
  - un cambio fuera del plan o de las decisiones registradas;
  - un gate que falla dos veces seguidas;
  - cualquier escritura en tiendas distinta de subir temas no publicados;
  - cualquier duda sobre credenciales.
- Fuera de esos casos, Claude continúa sin preguntar.

## D11. Revisión por subagente Opus de contexto limpio

- Al final de cada tarea de código y de cada lote, Claude lanza un subagente Opus nuevo, con contexto limpio y que no haya escrito ese código.
- Ese subagente hace la revisión del lote (R-A, R-B, etc.) contra el plan.
- Si la rechaza, Claude corrige y vuelve a revisar.
- Para A-02, la autorización técnica de Nivel 2 la da ese revisor.

## D12. Alcance de git

- Commit y push a `lote0/base-09f8342` hasta cerrar el Lote 0.
- Después, una rama por lote (`lote-a`, `lote-b`, `lote-c`, `lote-d`), cada una partiendo de la anterior.
- Sin force y sin tocar `master`.
- Antes de cada push, el literal de contraseña debe contar 0 fuera de `tests/vendor/axe.min.js`, sin imprimirlo.
- Al terminar el Lote D, abrir un PR hacia `master` sin fusionarlo.

## D13. Tiendas

- Se usa Shopify CLI con `SHOPIFY_CLI_THEME_TOKEN` desde el entorno.
- Solo se pueden subir temas no publicados en `tema-qkqpke0j`, para las previews de Sartorial, Imprint y Archive, Lighthouse, axe y teclado.
- Nunca se publica, nunca se borran temas existentes, y no se tocan productos, apps ni configuración.
- `STOREFRONT_PASSWORD` se usa solo desde el entorno. No se abre `.secrets`.

## D14. Primera tarea: empaquetador determinista y Theme Check

- Versionar en `scripts/` el empaquetador determinista del ZIP y verificar que regenera el SHA-256 `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f`.
- Comprobar qué 3 de los 93 archivos no inspeccionó Theme Check.

## D15. Fixture de suscripción

- El fixture de suscripción lo crea Johandry.
- Si no existe al llegar a A-01, Claude sigue con lo que no dependa de él y lo deja marcado.
- Estado actual del fixture: desconocido.

## D16. Estado vivo y commits por tarea

- Se mantiene `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md` con lo hecho, la tarea en curso y lo pendiente.
- Se hace commit después de cada tarea, para poder retomar si la sesión se reinicia.

## D17. Reglas del plan

- No copiar código de SebastianDev017/atelier.
- No crear metafields.
- Ninguna credencial en archivos ni en logs.

## D18. Cierre

- Al final, informe de cierre con el ZIP candidato y su SHA-256, y detenerse.
- El envío a la Theme Store lo hace Johandry, después de una revisión final de Antigravity.

# Notas

- (a) D11 (punto 3) introduce revisores Opus de contexto limpio por tarea de código y por lote. D8 (R-0 por Antigravity como `GEMINI-REVIEW-LOTE-0-R0-002`, registro `CLAUDE-DECISION-0-05-P3-002`) sigue registrada. La forma de cerrar el Lote 0 se resolverá según el plan y, si hay conflicto entre D8 y D11, se preguntará a Johandry. Estado: **pendiente de aclaración**.
- (b) D12 sustituye a D7 para tareas posteriores a 0-05-P3, con las ramas `lote-a`, `lote-b`, `lote-c` y `lote-d`. D7 sigue vigente para 0-05-P3.
- (c) El escritor único sigue siendo Claude (D2).
- (d) La tienda permitida es solo `tema-qkqpke0j`, y solo para subir temas no publicados (D13).

# Verificación

Comandos ejecutados antes de redactar (solo lectura, sin red):

```text
git rev-parse HEAD origin/lote0/base-09f8342 origin/master
-> fbdf462af5254c28ad852fc166e5a44bcc4c2240
-> fbdf462af5254c28ad852fc166e5a44bcc4c2240
-> 09f834295074402d9b93aa8ead83a732d78e6608

git status --porcelain | wc -l
-> 0
```

Qué demuestra: el estado de partida del repositorio y de origin.

Qué no demuestra: que se haya ejecutado nada del plan V4.1, el estado de las tiendas, la existencia del fixture de suscripción ni la presencia de credenciales en el entorno. La compuerta del literal y el resultado del push se reportan en el informe de la tarea, no aquí.
