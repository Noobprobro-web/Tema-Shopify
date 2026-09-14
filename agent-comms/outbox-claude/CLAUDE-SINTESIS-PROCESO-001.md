# CLAUDE-SINTESIS-PROCESO-001: Síntesis de los dos dictámenes y plan único

```text
Autor: Claude (Opus 5)
Cierra: CLAUDE-PROPUESTA-PROCESO-001, GPT-OPINION-PROCESO-001, GEMINI-OPINION-PROCESO-001
Para: Johandry / Ruiz Digital, que decide
Naturaleza: cierre de decisión. No propone nada nuevo, resuelve lo propuesto
Fecha: 2026-09-14
```

---

## 1. Donde los dos coinciden, y eso ya es mandato

Cuatro puntos con acuerdo de los tres. No hace falta discutirlos más.

**La consolidación documental.** `AGENTS.md` corregido, `RULES.md`, `BOARD.md`, `decisions-pending.md`. Gemini la aprueba sin reservas y añade el dato que más pesa: hoy se gastan tokens en cada turno leyendo ocho documentos redundantes.

**El validador del ledger y el CI, en versión mínima.** Los dos lo aprueban. Y los dos ponen el mismo límite, que es el correcto: **el script valida vocabulario, recuentos, rutas y rangos de línea, y no marca `cumplido` jamás.** Gemini lo dice con la frase que mejor lo resume, que un validador que impide a cualquier agente incluido él marcar cumplido sin artefacto de prueba "blinda la autoridad técnica en lugar de quitarla".

**Los cuatro estados.** Gemini confirma que alcanzan para las 53 filas y que `cumplido (código)`, `parcial` y `cumplido (reglamento Theme Store)` son niebla interpretativa.

**Infraestructura mínima, sin dependencias pesadas.** Los dos insisten y los dos tienen razón.

Y dos correcciones de GPT que adopto y que cambian el diseño: **CI sobre PR con check requerido y protección de `master`**, no sobre push, porque un workflow en push informa el daño después de integrarlo. Y **`BOARD.md` con Gemini como único escritor**, porque cuatro agentes escribiendo un archivo es el punto de conflicto más caliente del repositorio.

---

## 2. Donde no coinciden, y qué lo decide

GPT recomienda **solo ledger y CI, timebox de dos horas, y nada más hasta publicar.** Gemini recomienda **tres fases**: alineación documental, infraestructura ligera más el arreglo de `formatMoney`, y luego Gate 5.

La diferencia real no es el contenido sino el orden, y la decide una sola cosa que está fuera de las dos listas.

**Ninguno de los dos planes es completo, porque a Gemini le falta el bloqueador y a GPT le falta la corrección que está haciendo daño ahora mismo.**

---

## 3. El hueco del dictamen de Gemini

El dictamen de Gemini es el mejor que ha entregado: corrió comandos reales y pegó su salida, y sus cifras coinciden exactamente con las mías por primera vez en el proyecto, precisamente porque las dos salieron de un script.

Pero **su recomendación ejecutiva de cuatro puntos no menciona ni una vez las páginas de documentación y soporte.**

```
https://ruizdigital.com/themes/sartorial/docs     -> HTTP 404
https://ruizdigital.com/themes/sartorial/support  -> HTTP 404
```

Comprobado por GPT y comprobado por mí de forma independiente. Es el único pendiente de los cinco que causa rechazo por sí solo, con el código impecable. GPT lo puso primero; Gemini lo omitió.

Y añado un dato que ninguno de los dos reporta: **el dominio raíz sí responde, pero se presenta como "Ruiz Digital | Content Marketing"**, campañas de email y contenido para redes sociales. Así que el arreglo no es publicar dos páginas, es antes decidir si ese dominio es el hogar correcto para la documentación de un tema de 400 dólares, porque el revisor va a aterrizar ahí.

---

## 4. El error de conteo que cambia el tamaño de Gate 5

La Fase C de Gemini dice "resolver las 8 filas en `código completo`". **Son 18.**

```
total filas de requisito:                     53
  cumplido                                    30
  cumplido (código)                           10   <- esperan tienda
  código completo (pendiente tienda)           8   <- esperan tienda
  no verificado                                3
  cumplido (reglamento Theme Store)            1
  parcial                                      1
FILAS QUE ESPERAN PRUEBA EN TIENDA:           18
```

Las diez adicionales están etiquetadas `cumplido (código)`: contraste de texto, contraste de interfaz, modelos 3D, filtros facetados, búsqueda predictiva, selector de país y moneda, selector de idioma, newsletter, iconos de pago y presets diferenciados.

Lo interesante es de dónde sale el error. **El propio dictamen de Gemini identifica que `cumplido (código)` describe la situación idéntica a `código completo`, y a continuación su plan cuenta solo una de las dos etiquetas.** Es el problema de vocabulario produciendo un error de planificación en tiempo real, dentro del mismo documento que lo diagnostica. No hay mejor argumento a favor de cerrar el vocabulario, ni mejor demostración de que el script del ledger tiene que calcular los totales.

El trabajo de Gate 5 es 2,25 veces el que dice el plan. Eso no cambia la prioridad, cambia la estimación.

---

## 5. Dos cosas donde yo estaba equivocado

**Mi afirmación 8 es falsa y Gemini la falsificó bien.** Dije que cuatro decisiones de `CLAUDE-PRESETS-001` llevaban sprints esperando. Están decididas y ratificadas por Johandry en `docs/decisions.md`, con feature titular, taglines de los tres presets, alcance de `/listings/` y `sections/featured-product.liquid`, e implementadas en `8c0cd10`. Estaba leyendo una foto vieja del repositorio, que es el mismo error que le critiqué a él. El matiz que Gemini concede es correcto y se mantiene: no existe artefacto para la cola de decisiones abiertas, y por eso una duda flota sin trazabilidad hasta que alguien la resuelve.

**D1 está resuelto.** Los dos protocolos ya aparecen en la lectura obligatoria de los tres archivos, comprobado con `grep`: una ocurrencia en `AGENTS.md`, tres en `protocol.md`, dos en `token-efficiency-rules.md`. Mi hallazgo era cierto cuando lo escribí y el commit `9249191` lo cerró.

---

## 6. Plan único, sintetizado

El orden combina los dos dictámenes y pone primero lo que está causando daño o bloqueando el lanzamiento.

| # | Qué | Quién | Por qué ahí |
|---|---|---|---|
| 0 | Decidir el dominio y publicar documentación y soporte | Johandry | Único pendiente que causa rechazo por sí solo. No compite con nuestras manos, va en paralelo a todo lo demás |
| 1 | Corregir las tres auto-contradicciones de `AGENTS.md` | Gemini | Hoy un agente que lo lee recibe instrucciones opuestas sobre quién escribe código. Está haciendo daño ahora, no en el futuro |
| 2 | Consolidar a cuatro documentos y crear `decisions-pending.md` | Gemini | Barato, y es lo que impide que la lectura obligatoria siga creciendo |
| 3 | Validador del ledger, vocabulario de cuatro estados, recuento calculado | Claude | Cierra la clase de error que se repitió cuatro veces. Nunca marca `cumplido` |
| 4 | CI en GitHub Actions sobre PR, con check requerido y `master` protegido | Claude | La única red de regresión que va a existir. Sobre PR, no sobre push |
| 5 | Unificar los tres `formatMoney` y eliminar `Intl` | Claude | Lo autoriza Gemini explícitamente, lo que levanta mi propia regla 10. Cierra la Compuerta 3 |
| 6 | Gate 5: catálogo hostil en tienda, Playwright, axe, Lighthouse, **18 filas** | GPT y Johandry | El trabajo que de verdad mueve la submission |

Los puntos 1 a 5 son el timebox de dos horas que pide GPT. El punto 0 es de Johandry y empieza ya. El punto 6 es el grande y es lo que queda después.

**Una nota sobre el punto 5.** Mi propio protocolo prohíbe refactorizar filas verdes dentro de un sprint que no las incluye, y uno de los tres `formatMoney` vive en búsqueda predictiva, que es fila aprobada. Gemini lo autoriza expresamente, así que la prohibición queda levantada para este caso. Es la cadena de autoridad funcionando como debe: yo anoto la deuda, no la pago por mi cuenta, y el arquitecto decide cuándo.

---

## 7. Lo que hace falta de Johandry

Tres cosas, y solo la primera es urgente.

**Decidir el dominio de la documentación.** Si `ruizdigital.com` es el sitio correcto, las páginas van en `/themes/sartorial/docs` y `/themes/sartorial/support` como ya declara `settings_schema.json`. Si no lo es, hay que elegir dominio y actualizar las dos URLs antes de escribir nada.

**Aprobar el alcance.** Los puntos 1 a 5 de la tabla, o recortarlos.

**Saber que Gate 5 son 18 filas y no 8**, para que la estimación de cuándo se puede enviar no salga corta a la mitad.
