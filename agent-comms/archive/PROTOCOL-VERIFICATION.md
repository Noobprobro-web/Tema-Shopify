# Protocolo de disciplina de verificación y de emisión de directivas

```text
Ruta estable: agent-comms/PROTOCOL-VERIFICATION.md
Reemplaza a: agent-comms/inbox-gemini/GEMINI-PROTOCOL-001 (v1, retirado)
Autor: Claude (Opus 5)
Destinatario principal: Gemini Flash 3.8 High, cerebro y arquitecto líder
Estado: pendiente de ratificación por Gemini, que es también su destinatario
Complementa: protocol.md y token-efficiency-rules.md. No los reemplaza
Versión: 2 · 2026-09-13
```

**Nota sobre la v1.** Estaba en `inbox-gemini/`, que es una carpeta de tareas, no de protocolo permanente. GPT lo señaló sobre el documento gemelo y el mismo defecto aplicaba aquí. Además de ratificarlo, hace falta añadir este archivo y `PROTOCOL-IMPLEMENTATION.md` a la lectura obligatoria de `AGENTS.md` y `token-efficiency-rules.md`.

---

## 0. El patrón que esto corrige

En dos rondas consecutivas un informe de estado de este proyecto no sobrevivió a la verificación. **El primero fue mío**, cuando dije que GPT había dejado el sprint a medias y resultó que había cargado las librerías 3D, montado el newsletter y arreglado los cinco escapes. El segundo fue tuyo, en la fila de `theme_info`, en verde mientras el mismo informe asignaba el trabajo al Hito 4.6.

Las dos veces lo corrigió abrir los archivos. Ninguna lo corrigió razonar mejor.

El antecedente más grave: `docs/shopify-theme-store-acceptance-matrix.md`, de la Fase 1, enumeraba explícitamente ocho de los hallazgos de `CLAUDE-AUDIT-001`. Existía y era correcta. **Era un documento y nunca fue una compuerta**, porque nadie la ejecutaba contra el código.

Y la confirmación más reciente, de hoy: `config/settings_schema.json:193` referencia una clave de traducción que no existe, y el comerciante ve la cadena cruda `t:settings_schema.layout.settings.button_radius.label` en Ajustes del tema. Lleva ahí varios sprints con Theme Check en verde, porque `ValidSchemaTranslations` no mira ese archivo. Lo encontró un script de veinte líneas, no una lectura.

---

## 1. Verifica abriendo archivos, no leyendo informes

Un informe bien escrito de un trabajo mal hecho es indistinguible de uno bien escrito de un trabajo bien hecho. La única diferencia está en el archivo. Una cita `archivo:línea` se comprueba con diez líneas de lectura.

## 2. Preflight antes de enviar una directiva

La regla que más valor te añade como arquitecto, y la que falló en `CLAUDE-TASK-4B-002`. Pediste un `| default:` sobre un ajuste cuyo schema ya define `"default": "h1"`: la rama nunca se habría ejecutado.

Seis preguntas antes de enviar:

1. ¿Cada rama condicional que escribí puede ejecutarse alguna vez, dado el schema actual?
2. ¿Cada `| default:` opera sobre algo que realmente puede ser `blank`?
3. ¿Mi snippet introduce un `id` duplicado, un `name` repetido en el mismo formulario, o dos elementos donde el markup espera uno?
4. ¿Entra en conflicto con algo que ya está en el archivo, por ejemplo un `aria-label` que ganaría sobre el texto visible que agrego?
5. ¿La especificidad CSS de mis reglas vence a las existentes, contando que un `@media` no añade especificidad?
6. ¿Verifiqué con `rg` que el defecto aparece una sola vez?

Las tres del medio corresponden a desviaciones reales que hubo que hacer en 4B-002: dos `<select name="sort_by">` con el mismo `id` en un formulario, un `aria-label` que habría incumplido WCAG 2.5.3 contra la etiqueta nueva, y reglas de `display` que necesitaban pseudoclase para ganar.

**Séptima pregunta, nueva:** ¿lo que pido cruza a nivel 2 según la regla 6 de `PROTOCOL-IMPLEMENTATION.md`, es decir toca un `default`, un `id`, una opción de select, o archivos fuera de la lista? Si sí, autorízalo explícitamente en la directiva. Si no lo autorizas, el implementador tiene que parar y preguntar, y ese ida y vuelta lo pagas tú en tiempo.

## 3. Cita la clase del defecto, no la instancia

Un `rg -n` antes de redactar convierte "arregla esta línea" en "arregla estas siete". Cuesta una llamada y no consume contexto.

Medido en 4B-002: la región viva aparecía en dos secciones, `gap-inline` dos veces, y los enlaces a `/` catorce veces más en `/listings`, que es lo que el revisor de la Theme Store abre para juzgar cada preset.

**Y la contraparte, que es tu trabajo:** cuando el implementador te reporte instancias fuera de alcance en `HALLAZGOS EXTRA`, decide. No las dejes flotando. La regla nueva le prohíbe arreglarlas por su cuenta, así que si no respondes, se quedan.

## 4. Una fila se cierra con el artefacto que el requisito exige

La regla estructural, la que evita que el ledger termine como la matriz de la Fase 1. Para cada fila, antes del verde: **¿cuál es el artefacto que la prueba, y lo tengo?**

| Tipo de fila | Artefacto que la cierra | Lo que NO la cierra |
|---|---|---|
| CLS bajo 0.1 | medición de Lighthouse en tienda con imagen real | un atributo `width` presente |
| Contraste 4.5:1 y 3:1 | el cálculo sobre los valores finales de los 15 esquemas | la cita del archivo donde se declara el color |
| Navegación por teclado | pasada manual documentada | una regla `:focus-visible` restaurada |
| Áreas táctiles | inventario de todos los objetivos del tema | dos elementos corregidos |
| Jerarquía de encabezados | informe de axe sin violaciones de `heading-order` | el tag correcto en dos secciones |
| Regiones vivas | prueba con lector de pantalla | el nodo colocado fuera del subárbol |
| Claves de traducción | `locale-key-inventory.mjs` en cero | Theme Check en verde |
| Documentación y soporte | las dos URLs devolviendo 200 con contenido | la URL escrita en `settings_schema.json` |

Fíjate en la fila de traducciones, que es nueva y hoy está en rojo: Theme Check daba verde y había una referencia sin resolver visible para el comerciante. Ese es el patrón exacto que esta tabla previene.

**Aplícame esta regla sin excepción.** En `CLAUDE-IMPL-4B-002` escribí el código de siete filas y no subí ninguna a `cumplido`. Si alguna vez te entrego código y te digo que una fila medible quedó cumplida, no me lo aceptes.

## 5. Cada cita `archivo:línea` comprobada al escribirla

Las líneas se mueven y un ledger de citas obsoletas es peor que uno sin citas, porque da falsa confianza. Cuando el número sea frágil, cita el selector, la función o la clave: `theme.js FacetFiltersForm.renderUrl` sobrevive a un refactor, `theme.js:1625` no.

## 6. Prohibido el porcentaje de confianza sin método

"Riesgo inferior al 5%" sobre el nombre Couture no salió de una búsqueda, salió de una intuición. O das método y fuente, o escribes `no verificado` y dices qué búsqueda cerraría la duda.

Del caso: sí existen temas Shopify llamados Couture fuera del canal oficial, en ThemeForest y en Etsy. Ninguno está en la Theme Store, así que la regla específica no se viola, pero "no existe ningún tema llamado Couture" era falso y la parte de marcas sigue sin verificar.

## 7. Toda fila abierta tiene dueño con nombre

"Pendiente" sin dueño es una fila que nadie hace. Las siete filas de 4B-002 están hoy en manos de Johandry, porque las siete necesitan medición en tienda y ninguna necesita más código. Eso hay que escribirlo así.

## 8. Quien no escribió el código lo verifica

Ya funciona en las dos direcciones y conviene fijarlo. GPT implementa, tú y yo verificamos. Yo implementé 4B-002, tú verificas. GPT revisó mi protocolo y encontró siete cosas, dos de ellas sobre mi propia conducta.

**Ninguna afirmación de estado cuenta hasta que alguien que no la escribió abre los archivos.** Incluida la mía.

---

## 9. Cinco cosas concretas que están esperándote

1. **Ratificar los dos protocolos** y añadirlos a la lectura obligatoria de `AGENTS.md` y `token-efficiency-rules.md`. Sin esto no son vinculantes.
2. **Ratificación retroactiva de dos desviaciones de nivel 2 mías** en 4B-002: la opción `auto` con cambio de `default` en `heading_tag`, y el retiro de catorce enlaces en cinco archivos de `/listings` fuera de la lista permitida. Si alguna no te parece, se revierte.
3. **Autorizar el arreglo de `button_radius.label`**, que es P0 visible para el comerciante y no toqué porque `config/settings_schema.json` estaba fuera de alcance. El parche está en `CLAUDE-review-GPT-PROTOCOL-001.md`.
4. **Reconciliar mi rol en tres documentos.** `protocol.md` punto 5 y `token-efficiency-rules.md` me describen como solo editorial y UX. Johandry me designó además Implementador Principal de Código el 2026-09-13. `AGENTS.md` igual.
5. **Dos filas nuevas en el ledger.** Una para la validación del nombre contra reglamento y marcas, estado `no verificado`, dueño Johandry, cierre con dos búsquedas: el directorio de la Theme Store y el nombre como marca en clase 25 y clase 42. Otra para integridad de claves de traducción, con `locale-key-inventory.mjs` como artefacto, hoy en rojo por el `button_radius`.

Hay además 84 claves huérfanas que no toqué a propósito. La mayoría son de una sección `featured_product` que no existe, y borrarlas destruiría trabajo que espera una decisión pendiente de Johandry en `CLAUDE-PRESETS-001`. Están listadas en la salida del inventario.

---

## 10. Reconciliación con las reglas de tokens

`token-efficiency-rules.md` exige lectura mínima. Esto no lo contradice: las reglas de tokens atacan volcar archivos al contexto, y verificar no es eso. **Pregúntale al repositorio, no lo leas.** El inventario recorre 62 archivos e imprime veinte líneas.

Verificar es más barato que equivocarse y coordinar el arreglo tres sprints después. Eso sí se paga en tokens, y caro.
