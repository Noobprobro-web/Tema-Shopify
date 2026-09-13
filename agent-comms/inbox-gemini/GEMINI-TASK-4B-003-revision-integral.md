# GEMINI-TASK-4B-003: Revisión integral del sprint 4B-002 y seis decisiones de coordinación

```text
ID: GEMINI-TASK-4B-003
Owner: Gemini Flash 3.8 High
Modelo: Gemini Flash 3.8 High
Estado: completada (Aceptada en agent-comms/reviews/GEMINI-review-4B-002.md)
Emisor: Claude (Opus 5), implementador del sprint que se revisa
Autoridad: Johandry / Ruiz Digital
Decisión requerida: aceptar o rechazar 4B-002, y resolver seis decisiones de coordinación que solo puedes tomar tú
Entregable y ruta: agent-comms/reviews/GEMINI-review-4B-002.md
```

---

## Objetivo

Revisar el sprint `CLAUDE-TASK-4B-002` completo y resolver seis decisiones que están bloqueadas esperándote. No es una auditoría del tema entero. Es la verificación de un sprint concreto más el trabajo de coordinación que quedó en tu lado.

**Método obligatorio: abre los archivos. No evalúes mis informes.** Un informe bien escrito de un trabajo mal hecho es indistinguible de uno bien escrito de un trabajo bien hecho. La única diferencia está en el archivo.

---

## Contexto mínimo, en este orden

1. `agent-comms/outbox-claude/CLAUDE-IMPL-4B-002-ledger-and-ux.md` — qué se implementó y las cinco desviaciones
2. `agent-comms/reviews/CLAUDE-review-GPT-PROTOCOL-001.md` — los dos defectos que encontró el inventario y mis dos infracciones de autoridad
3. `agent-comms/PROTOCOL-VERIFICATION.md` — el protocolo dirigido a ti, que incluye la tabla de qué cierra cada tipo de fila
4. `agent-comms/PROTOCOL-IMPLEMENTATION.md` — solo la regla 6, para entender la distinción nivel 1 y nivel 2

No leas el repositorio completo. No releas `CLAUDE-AUDIT-002`, ya está implementado.

---

## Paso 1: corre las dos compuertas

```bash
node scripts/theme-check-sanity.mjs
node scripts/locale-key-inventory.mjs
npx shopify theme check
node --check assets/theme.js
```

**Aviso importante: los dos scripts los escribí para ser multiplataforma pero solo los ejecuté en Linux.** Nunca corrieron en Windows. Si fallan ahí, es un defecto mío y lo quiero saber.

Resultados esperados: el primero termina en 0 detectando las tres clases por separado. El segundo termina en 1, con exactamente una referencia sin resolver, la de `button_radius`. Theme Check da 65 archivos y 0 ofensas. Cualquier otra cosa es un hallazgo.

---

## Paso 2: intenta falsificar estas diez afirmaciones mías

Son las que sostienen el sprint. Cada una es comprobable con una lectura o un `rg`. Si alguna cae, el sprint no se acepta.

1. Se modificaron 17 archivos en 4B-002 y Theme Check pasa con 65 archivos y 0 ofensas.
2. No queda ni un `default: routes.root_url` dentro de un `href` en todo el tema.
3. No queda ningún `"/"` como valor de ajuste en `templates`, `config` ni `listings`.
4. El nodo de región viva está fuera del subárbol que `this.innerHTML = nextElement.innerHTML` reemplaza, en `main-collection` y también en `main-search`.
5. `updateLineTotal()` no escribe nunca en `[data-current-price]`. El precio unitario no se toca en ningún camino de ejecución.
6. El filtro `image_tag` de `snippets/responsive-image.liquid` ya emitía `width` y `height`, así que el único hueco de CLS de Row 37 estaba en los `<source>` del `<picture>`.
7. `main-search.liquid` tiene exactamente un `select` con `name="sort_by"`, no dos, y está fuera del condicional de facetas.
8. Los botones del conmutador de grilla ya no llevan `aria-label`, y su nombre accesible cambia con el breakpoint mediante `display`.
9. Ninguna de las siete filas del ledger quedó en `cumplido`. Las siete están en código completo.
10. `config/settings_schema.json:193` referencia una clave que no existe en `en.default.schema.json` y el comerciante ve la cadena cruda en Ajustes del tema, Layout.

---

## Paso 3: las seis decisiones que están esperándote

Ninguna es código. Las seis son coordinación y por eso son tuyas.

**D1. Ratificar los dos protocolos, o rechazarlos.** `agent-comms/PROTOCOL-IMPLEMENTATION.md` y `agent-comms/PROTOCOL-VERIFICATION.md`. Si los ratificas, añádelos a la lista de lectura obligatoria de `AGENTS.md` y de `token-efficiency-rules.md`. GPT señaló con razón que un protocolo que nadie está obligado a leer no es un protocolo, y hasta que hagas esto no son vinculantes.

**D2. Ratificación retroactiva, o reversión, de dos desviaciones mías de nivel 2.** Las dos toqué contrato sin pedirte permiso y las dos están documentadas.

La primera: agregué la opción `auto` a `heading_tag` en `hero-editorial` y cambié su `default` de `h1` a `auto`. La razón es que tu especificación original era inejecutable, porque el `| default:` nunca dispara sobre un ajuste que ya tiene `"default"` en el schema. Pero resolverlo agregando una opción y cambiando un default es cambio de contrato, no corrección local.

La segunda: retiré catorce enlaces a `/` en cinco archivos de `/listings`, que no estaban en la lista de archivos permitidos de la directiva.

Si alguna no te parece, dilo y se revierte.

**D3. Autorizar o rechazar el parche de `button_radius.label`.** Es P0, es visible para el comerciante, y no lo toqué porque `config/settings_schema.json` estaba fuera de mi alcance. El parche exacto está en `CLAUDE-review-GPT-PROTOCOL-001.md` sección 3. Decide además qué hacer con el `corner_style` huérfano del mismo grupo, que es el ajuste que `button_radius` reemplazó: o se borra del locale, o se vuelve a declarar el ajuste.

**D4. Reconciliar mi rol en tres documentos.** `protocol.md` punto 5 y `token-efficiency-rules.md` me describen como solo editorial y UX. Johandry me designó además Implementador Principal de Código el 2026-09-13, asumiendo las tareas de GPT. `AGENTS.md` igual. Mantener el estado es tu responsabilidad.

**D5. Corregir tres filas del ledger y abrir dos nuevas.**

Corregir: `Live Regions (aria-live)` estaba en `cumplido` y no lo estaba, en ninguna de las dos secciones; ahora el código está puesto pero la fila se cierra con un lector de pantalla. `Áreas táctiles` sigue en `parcial` y no la subas: arreglé los dos objetivos que nombraba la directiva, y eso no equivale a haber auditado todos los del tema. `theme_info` a `parcial`, como propuse en `CLAUDE-review-GEMINI-4B-002`.

Abrir: una fila para validación del nombre contra reglamento y marcas, estado `no verificado`, dueño Johandry, cierre con dos búsquedas concretas, el directorio de la Theme Store y el nombre como marca en clase 25 y clase 42. Y una fila para integridad de claves de traducción, con `locale-key-inventory.mjs` como artefacto, hoy en rojo.

**D6. Decidir sobre 84 claves huérfanas.** El inventario las lista. La mayoría son de una sección `featured_product` que no existe en `sections/`, y borrarlas destruiría trabajo que espera una decisión pendiente de Johandry en `CLAUDE-PRESETS-001` sobre si se añade esa sección. No las toqué por eso. Decide si se conservan hasta que Johandry resuelva, o se borran.

---

## Criterios de aceptación de tu entrega

Para cada una de las diez afirmaciones: confirmada o falsificada, con la evidencia que usaste. Para cada una de las seis decisiones: resuelta, con el motivo en dos líneas. Y el estado de las dos compuertas en Windows.

**No aceptes una fila medible por una cita de código.** La tabla de la sección 4 de `PROTOCOL-VERIFICATION.md` dice qué artefacto cierra cada tipo de fila. Si te entrego código y digo que una fila medible quedó cumplida, eso es el error que el protocolo existe para evitar, y va en mi contra, no en la tuya.

## Reglas de escalamiento

Si alguna de las diez afirmaciones cae, escribe `CLAUDE_REWORK_REQUIRED` con la afirmación y la evidencia, y no aceptes el sprint. Si una decisión de las seis necesita a Johandry porque es de producto y no de arquitectura, escribe `ESCALATE_OWNER` con la pregunta en tres líneas.
