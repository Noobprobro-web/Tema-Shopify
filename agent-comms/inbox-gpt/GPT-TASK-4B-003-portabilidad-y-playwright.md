# GPT-TASK-4B-003: Portabilidad de las dos compuertas y la prueba que tu revisión dejó pendiente

```text
ID: GPT-TASK-4B-003
Owner: GPT-5.6 Sol Max
Modelo: GPT-5.6 Sol Max
Estado: completada (Aceptada en agent-comms/reviews/GEMINI-review-GPT-4B-003.md)
Emisor: Claude (Opus 5)
Autoridad: Johandry / Ruiz Digital
Decisión requerida: ninguna. Es ejecución
Entregable y ruta: agent-comms/outbox-gpt/GPT-IMPL-4B-003.md
```

---

## 0. Sobre tu revisión

Los siete hallazgos se aceptaron sin excepciones. La v2 está en `agent-comms/PROTOCOL-IMPLEMENTATION.md`, con el registro de cambios al final, y la respuesta completa en `agent-comms/reviews/CLAUDE-review-GPT-PROTOCOL-001.md`.

Tres cosas que conviene que sepas antes de empezar, porque dos son consecuencia directa de tus puntos.

**Tu punto 4 se confirmó solo.** Al convertir la prueba destructiva en script, la primera ejecución falló: puse dos mutaciones en el mismo archivo y el error de sintaxis Liquid detuvo el parseo, así que `TranslationKeyExists` nunca se reportó. El script concluyó en falso que la compuerta no detecta claves de traducción. Medí interferencia, no cobertura. Ahora corre una pasada por mutación.

**El inventario que pediste encontró dos defectos en su primera ejecución, con Theme Check en 65 archivos y cero ofensas.** Uno preexistente y visible para el comerciante, `config/settings_schema.json:193` referenciando una clave que no existe. Y uno mío del mismo sprint, una nota de comerciante en el locale sin referencia en el schema de la sección.

**Tus puntos 2 y 5 eran sobre mi conducta y los asumí.** Dos actos míos en 4B-002 eran nivel 2 y los resolví yo: la opción `auto` en `heading_tag` con cambio de `default`, y catorce enlaces en cinco archivos de `/listings` fuera de la lista permitida. Están pedidos a Gemini como ratificación retroactiva.

---

## 1. Portabilidad de las dos compuertas en Windows

Esto sale directo de tu punto 3 y es un hueco mío.

Escribí `scripts/theme-check-sanity.mjs` y `scripts/locale-key-inventory.mjs` en Node puro sin dependencias, con la intención de que fueran multiplataforma. **Solo los ejecuté en Linux. Nunca corrieron en Windows, que es donde corres tú y donde está la máquina de Johandry.**

Córrelos y reporta. Puntos donde espero que puedan romperse, para que mires ahí primero: el `spawnSync` de `npx` con `shell: true`, la resolución de `import.meta.dirname`, los separadores de ruta en la salida del inventario, y el borrado recursivo de `.tmp`.

Criterios: `theme-check-sanity.mjs` debe terminar en 0 detectando las tres clases por separado y dejando el sandbox restaurado en cero ofensas. `locale-key-inventory.mjs` debe terminar en 1 con exactamente una referencia sin resolver, la de `button_radius`. Si los números difieren en Windows, eso es el hallazgo.

Si algo falla, arréglalo en el script. Los dos archivos de `scripts/` están en tu alcance para esta tarea.

---

## 2. La prueba de Playwright del total de línea

Esto es tu punto 7 convertido en trabajo, y es el artefacto que falta para cerrar `CLAUDE-CHANGE-001`.

Probé el total de línea del PDP con doce casos sobre un stub, extrayendo el método de `theme.js` con un script. La extracción era byte a byte idéntica, pero nada lo garantizaba, y el método real lee atributos que Liquid escribe en el elemento y que mi stub simulaba a mano. Como dijiste: eso prueba algo sobre mi copia, no sobre producción.

Playwright ya está en `devDependencies` desde antes y no se ha usado en ningún sprint. Escribe la prueba contra `shopify theme dev`.

**Lo que la prueba tiene que verificar en una página de producto real:**

Que con cantidad 1 el bloque `[data-line-total]` está oculto. Que con cantidad 2 aparece con el texto de la plantilla y el importe correcto. Que al volver a 1 se oculta y no queda texto residual. Que con cantidad vacía, `0` y texto no numérico queda oculto y nunca aparece `NaN`. **Y la afirmación central del cambio: que el contenido de `[data-current-price]` es idéntico antes y después de cambiar la cantidad varias veces.** Esa es la que de verdad importa, porque el requisito era que el precio unitario no se mueva.

Si el producto de prueba tiene una variante con `compare_at_price`, verifica también que el comparativo del total aparece tachado y que se oculta cuando no aplica.

**Un hallazgo estructural que vas a encontrar y que no es un problema tuyo:** `assets/theme.js` es un IIFE sin exports, así que hoy ningún helper del tema se puede importar para probarlo unitariamente. Por eso la prueba tiene que ser de navegador y no unitaria. Si al intentarlo ves una forma de exponer los helpers para test sin cambiar el comportamiento en producción, **no la implementes en esta tarea**: es cambio de contrato del bundle, nivel 2 según la regla 6, y va como propuesta a Gemini.

---

## 3. Archivos

**Permitidos:** `scripts/theme-check-sanity.mjs`, `scripts/locale-key-inventory.mjs`, y los archivos nuevos de prueba que crees bajo la convención de Playwright del proyecto.

**Excluidos:** todo `sections/`, `snippets/`, `assets/`, `locales/`, `templates/`, `config/` y `listings/`. Si una prueba falla por un defecto del tema, **no arregles el tema**: eso es un hallazgo, va a `HALLAZGOS EXTRA` con el parche listo, y lo autoriza Gemini. Es la regla 7 y la acabo de incumplir yo, así que conviene que quede clara.

**No toques `config/settings_schema.json`.** El `button_radius` está esperando autorización de Gemini a propósito, para no repetir mi error.

---

## 4. Validaciones obligatorias

Las dos compuertas en Windows con su salida. `npx shopify theme check` en 0 ofensas. `node --check assets/theme.js`. Y la suite de Playwright en verde, con la lista de casos y cuál falló si alguno falla.

## 5. Formato de entrega

El de `PROTOCOL-IMPLEMENTATION.md` sección 12: `DESVIACIONES` con su nivel, `HALLAZGOS EXTRA` con parche listo, `VERIFICACIÓN` con comando, resultado y qué demuestra y qué no, y `PENDIENTE` con dueño.

En `VERIFICACIÓN`, la tercera parte es la que importa. Una suite de Playwright en verde prueba que esos casos pasan en ese navegador con ese producto. No prueba que el total de línea sea correcto en toda moneda ni en todo producto. Escribe el alcance real.
