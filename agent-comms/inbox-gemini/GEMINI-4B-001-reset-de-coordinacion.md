# GEMINI-4B-001: Reset de Coordinación y Cierre de Fase 4

```text
ID: GEMINI-4B-001
Emisor: Johandry (dueño del proyecto, autoridad final)
Destinatario: Gemini Flash 3.8 High (cerebro y coordinador técnico)
Redactado con: Claude (auditor UX/UI y de cumplimiento)
Fase: 4 (QA, Presets y Submission)
Prioridad: bloqueante. Ninguna directiva nueva a GPT sale hasta que esto esté entregado.
```

---

## 1. Por qué existe esta directiva

No es una queja sobre la calidad de tu arquitectura. La arquitectura es buena y el código que dirigiste lo demuestra. Es sobre una función de coordinación específica que no se ejecutó, y la evidencia es tu propio documento.

`docs/shopify-theme-store-acceptance-matrix.md` lo escribiste en Fase 1. Lista, textualmente, como criterios de aceptación oficiales:

- **Búsqueda Predictiva.** "Autocompletado rápido consumiendo `/search/suggest.json`". No existe en el tema. Cero implementación.
- **Selector de Moneda/Idioma.** "Selectores mediante el formulario oficial `{% form 'localization' %}`". No existe. Cero implementación.
- **Punto focal nativo `image.presentation.focal_point`.** No se usa en el hero, que es donde más importa.
- **Dimensiones `width` y `height` explícitas para evitar saltos (CLS < 0.1).** El `<source>` del hero móvil no las tiene.
- **Contraste mínimo 3:1 para elementos de interfaz interactivos.** `--color-border` está en 1.25:1 y está en inputs, chips de talla y selling plans.
- **Jerarquía estricta de encabezados, `h1` único por página.** `hero-editorial` emite `<h1>` sin restricción de plantilla.
- **Medios Enriquecidos, modelos 3D con `model-viewer`.** El markup se emite y las librerías no se cargan.
- **Documentación y Soporte, formulario de contacto accesible.** `theme_info` apunta a un issue tracker de GitHub.

Ocho criterios que tú mismo documentaste, ausentes o rotos, y detectados por una auditoría externa cuatro sprints después.

Y en `agent-comms/status.md` quedó escrito "Requisitos comerciales de Shopify Theme Store completados".

**El diagnóstico no es que falte capacidad. Es que la matriz es un documento y nunca fue una compuerta.** Se escribió, se archivó y se dejó de consultar. Nadie volvió a preguntar fila por fila si el tema cumplía. Theme Check ocupó ese lugar sin poder hacerlo: Theme Check valida sintaxis y esquemas, no sabe si existe un selector de moneda.

Por eso esta directiva no te pide "revisar mejor". Te pide construir la compuerta.

Nota adicional: la matriz también tiene huecos propios. No menciona el formulario de newsletter en storefront ni los metadatos Open Graph y Twitter, que sí son obligatorios. Al reconstruirla hay que partir de la fuente oficial, no de la matriz.

---

## 2. Lo que tienes que entregar, antes de cualquier directiva nueva a GPT

### Artefacto 1: `docs/requirements-ledger.md`

Un registro vivo, no un resumen. Una fila por cada requisito obligatorio del listado oficial de la Theme Store, reconstruido desde la fuente y reconciliado con tu matriz de Fase 1.

Columnas exactas:

| Requisito | Fuente | Estado | Evidencia | Dueño | Sprint |

- **Estado** solo admite cuatro valores: `cumplido`, `parcial`, `ausente`, `no verificado`.
- **Evidencia** es obligatoria para `cumplido` y `parcial`. Es una referencia concreta: `archivo:línea`, o el nombre de la prueba ejecutada en tienda. **"Lo implementó GPT" no es evidencia. "Theme Check pasa" no es evidencia.**
- **`no verificado` es un estado legítimo y esperado.** Es más honesto que un `cumplido` sin prueba. Al arrancar, la mayoría de las filas de accesibilidad y performance deberían estar en `no verificado`, porque nadie ha abierto este tema en una tienda real.

Este archivo pasa a ser la métrica principal del proyecto.

### Artefacto 2: `agent-comms/status.md` reescrito con dos métricas separadas

Hoy reporta una sola y se está leyendo mal. A partir de ahora reporta dos, siempre juntas y nunca fusionadas:

- **Salud técnica:** archivos, ofensas de Theme Check, sintaxis.
- **Cobertura de requisitos:** `X / Y cumplidos con evidencia`, tomado del ledger.

La segunda es la que dice si el proyecto puede enviarse. La primera no dice nada al respecto.

### Artefacto 3: Definition of Done en `AGENTS.md`

Cinco compuertas. Una entrega no se acepta si falla una. Aplican a GPT y también a ti cuando revisas.

1. **Requisitos.** ¿Qué filas del ledger cierra esta entrega, y con qué evidencia? Si no cierra ninguna, decirlo explícitamente.
2. **Estados degenerados.** Cada componente entregado se recorre en cinco estados: vacío, uno solo, muchos, muy largo, faltante. Con evidencia de que se recorrió.
3. **Consistencia entre archivos.** Una pregunta obligatoria antes de cerrar: este valor, este formato o esta variable, ¿ya existen en otro archivo del tema?
4. **Superficie del comerciante.** Labels en sentence case, sin vocabulario de marca ni de developer, con `info` en todo setting que dependa de algo externo (una app, una tarifa de envío, un descuento, un metafield), y todos vía claves `t:`.
5. **Verificación en tienda real.** Ejecutada en la tienda de desarrollo, no solo en análisis estático.

### Artefacto 4: Plan de Fase 4 con ruta crítica y dueños

Secuencia, dependencias, y nombre propio en cada línea. Tiene que incluir explícitamente quién produce las tres demo stores con su contenido y sus assets con derechos, porque es el trabajo más largo del proyecto, no es código, y hoy no tiene dueño asignado.

---

## 3. Los dos pases que faltaban, y por qué

La auditoría encontró 9 hallazgos P0 y 56 P1. No están repartidos al azar: caen en tres sitios, y dos de ellos se cierran con pases mecánicos.

**Pase de estado degenerado.** Cierra, entre otros: la colección vacía que dice "No products match your selection" sin filtros aplicados, la barra de recompensas encima del carrito vacío, el tile de promoción repitiéndose en las nueve páginas de paginación, los dos bloques con `position_in_grid: 4` colisionando de fábrica, los dos `case` sin `else`. Cinco minutos por componente.

**Pase de consistencia entre archivos.** Cierra: el `150` en tres archivos sin fuente única, `Intl.NumberFormat` en `complete-the-look` contra el filtro `money` en todo el resto, el guard que pregunta por `collection.image` y el render que usa `collection.featured_image`, `--button-radius` contra `--radius-button`, y `[data-reduced-motion]` escrito por el JS y leído por nadie.

Trece hallazgos entre los dos pases. Ninguno requiere más talento, solo una pregunta más antes de cerrar.

---

## 4. La tienda de desarrollo, y por qué es lo más urgente después del ledger

Todo lo que sabemos de este tema sale de análisis estático: Theme Check y una auditoría de lectura de código. **Nadie ha hecho clic en este tema.**

Eso explica la forma de los hallazgos. El carrito vacío con la barra de recompensas encima, las dos pestañas vacías del curated showcase en el homepage por defecto, el "Failed to fetch" en inglés cuando cae la red: ninguno de los tres es un bug sutil. Los tres saltan en los primeros dos minutos de uso. No se encontraron antes porque nadie usó el tema.

Montar la tienda de desarrollo es prioridad inmediata, y con ella un catálogo deliberadamente hostil. Cuesta una tarde y es el activo de QA de mayor retorno del proyecto:

- Un producto con título de 120 caracteres.
- Un producto sin imagen.
- Un producto con imagen panorámica 21:9 y otro ultra vertical 2:5.
- Un vendor y un product type que contengan comillas dobles, por ejemplo `12" x 18"`.
- Una colección con un solo producto, y otra vacía.
- Un producto con tres opciones y cuarenta variantes, con una combinación agotada.
- Un producto con modelo 3D y otro con video.
- Un producto con selling plan.
- Una gift card.
- La tienda configurada en EUR con formato `1.234,56` y un segundo mercado activo.

Ese catálogo, más el checklist de 18 pruebas de la sección 7 de `CLAUDE-AUDIT-001-review.md`, es el pase de QA de cada sprint desde ahora, no solo el del final.

---

## 5. Decisiones que no puedes tomar tú y que bloquean el empaquetado

Estas son de Johandry y hay que cerrarlas con fecha, porque ningún agente las puede resolver y las cuatro bloquean la submission:

1. Nombre final del tema, y qué preset comparte ese nombre.
2. Entidad comercial que va como `theme_author`.
3. URL real de documentación y formulario de soporte merchant-facing.
4. Titularidad del repositorio, hoy en `github.com/Noobprobro-web/Tema-Shopify`.

Tu trabajo aquí es listarlas en el plan con fecha límite y escalarlas, no resolverlas.

---

## 6. Lo que NO se te pide en esta directiva

Para que no se disperse el alcance: no se te pide rediseñar nada, ni proponer secciones nuevas, ni revisar el blueprint de experiencia. El blueprint (`CLAUDE-BLUEPRINT-001`) ya está entregado y lo convertirás en especificación después, no ahora.

Esta directiva es solo de infraestructura de coordinación: el ledger, el status, la Definition of Done y el plan.

---

## 7. Formato de respuesta

Entregar en `agent-comms/outbox-gemini/GEMINI-4B-001-reset-de-coordinacion.md`:

1. El ledger completo, con el conteo `X / Y` en la primera línea.
2. Cuántas filas quedaron en `no verificado` y qué hace falta para verificarlas.
3. Los tres artefactos restantes.
4. Una lista de los requisitos oficiales que **no** estaban en tu matriz de Fase 1, para cerrar el hueco de origen.
5. Si algo de esta directiva te parece equivocado, dilo antes de ejecutarlo. Prefiero una objeción razonada ahora que una ejecución silenciosa de algo que no sirve.
