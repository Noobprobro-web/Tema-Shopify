ID: GPT-DECISION-LOTE-0-04-COPY-001
Estado: Decisión de copy aplicada localmente; pendiente verificación adversarial independiente. No es cierre de 0-04, Lote 0 ni R-0.
Decisión requerida: Revisión independiente de esta entrega. Lote A sigue requiriendo R-0 aceptado por Claude y aprobación de Johandry.
Resumen en 5 líneas:
1. Johandry aprobó expresamente el 2026-10-31 cinco valores de copy, incluido el vaciado del caption.
2. Se aplicaron únicamente a la plantilla Sartorial de la base aislada identificada abajo.
3. El árbol conservó los tres assets modificados preexistentes, con hashes idénticos antes y después.
4. El análisis de Liquid y CSS acota la ausencia de nodo y margen del caption vacío; no es una prueba visual ni de tienda.
5. No se cierra ningún requisito del ledger ni se autoriza Lote A, commit, push, publicación o escritura de tienda.
Archivos tocados: `isolated-sartorial-lote0-09f/listings/sartorial/templates/index.json`; este registro nuevo en `agent-comms/outbox-gpt/`.
Desviaciones (Nivel 1 o Nivel 2): Ninguna expansión del alcance autorizado; cinco valores de settings existentes, sin cambiar IDs ni schema.
Hallazgos extra fuera de alcance (con parche listo): Ninguno identificado en esta comprobación acotada; no se propone parche fuera de alcance.
Verificación (comando, resultado y qué demuestra/qué no): Véanse secciones de evidencia y límites; la revisión independiente aún no se ha realizado.
Lista de afirmaciones falsables numeradas:
1. El JSON contiene exactamente los cinco valores aprobados en las claves identificadas, y ningún otro cambio semántico frente a HEAD.
2. En el JSON indicado no aparece `Haute Couture` en búsqueda sin distinguir mayúsculas.
3. Los tres hashes de los assets preexistentes coinciden antes y después de esta edición.
4. La etiqueta `<p class="lookbook__caption">` está completamente dentro del condicional que exige caption no vacío; el margen del caption pertenece a esa etiqueta.
5. El análisis no acredita render en Shopify ni geometría medida en navegador o tienda.

# Decisión de Johandry y aplicación

Fecha de decisión: **2026-10-31**. Autor de la decisión: **Johandry**. El alcance autorizado incorpora expresamente un quinto valor, el caption vacío, adicional a las cuatro sustituciones de la formulación previa del plan. La aprobación posterior prevalece sobre el estado de decisión pendiente reflejado históricamente en V4.1; no modifica ese plan.

Base exclusiva: `C:\Users\Johan\Documents\Drive\Tema Shopify\isolated-sartorial-lote0-09f`; HEAD `09f834295074402d9b93aa8ead83a732d78e6608` detached, con tres modificaciones de assets previas. Archivo: `listings/sartorial/templates/index.json`.

| Clave contextual | Antes | Aprobado y aplicado |
| --- | --- | --- |
| `sections.hero.settings.eyebrow` | `HAUTE COUTURE / ATELIER SARTORIAL` | `SARTORIAL / 01` |
| `sections.collections.settings.heading` | `Selected Haute Couture Silhouettes` | `Selected Silhouettes` |
| `sections.lookbook.settings.heading` | `Silhouettes in Haute Couture Motion` | `Silhouettes in Motion` |
| `sections.lookbook.settings.caption` | `Haute couture silhouettes photographed in natural salon light.` | `""` (cadena vacía) |
| `sections.capsule.settings.heading` | `Complete the Haute Couture Ensemble` | `Complete the Look` |

El diff textual inspeccionado muestra únicamente esas cinco sustituciones. Las claves y contexto se verificaron antes de reemplazar; cada cadena original apareció exactamente una vez, y se comparó el objeto resultante contra el original tras aplicar los cinco cambios esperados. No se modificaron otros textos ni formatos. No se modificaron V1–V4.1, informe BASE o registro M2 durante este turno.

# Evidencia local saneada

## Preflight e integridad

`git status --short --branch` y `git rev-parse HEAD` antes de editar mostraron `## HEAD (no branch)`, tres rutas `M` (`assets/base.css`, `assets/product-zoom.js`, `assets/theme.js`) y `09f834295074402d9b93aa8ead83a732d78e6608`. Los mismos comandos tras la edición agregaron solamente `M listings/sartorial/templates/index.json`; la comprobación final tuvo salida exitosa 0. El registro se crea fuera de la base aislada.

`Get-FileHash -Algorithm SHA256 -LiteralPath 'assets/base.css','assets/product-zoom.js','assets/theme.js'` antes y después devolvió los mismos SHA-256:

| Archivo | Antes = después |
| --- | --- |
| `assets/base.css` | `5D9ED6B2981F115D9FCA06406A47A6FF784E63023883EA1E88F49EC84429AF43` |
| `assets/product-zoom.js` | `4828D5A15471330E4D82F52BD16016C3EF1E71E2F53D275E9DC3CAB28AA6C246` |
| `assets/theme.js` | `DB2F2A6EFD27F45B4A0BF68A1368F2598ADCEEDDDD207784C26E6632EAC56A9C` |

SHA-256 final del JSON por `Get-FileHash -Algorithm SHA256`: `9E50AEA4A4896438B66191D7044E0EB1DAE68083D5563C45B910AC3C3AAC1768`.

## Comprobaciones ejecutadas

- Script Python sobre bytes locales: comprobó las cinco claves y valores originales, exigió una coincidencia por cadena, sustituyó una vez cada una y verificó `json.loads(b)==d` antes de guardar. Salida literal `Five contextual values replaced; JSON parsed successfully.`; exit 0.
- Script Python separado: cargó `git show HEAD:listings/sartorial/templates/index.json` y el JSON actual, aplicó a la estructura de HEAD los cinco valores esperados y exigió igualdad completa; buscó `haute couture` con `re.I` solo en el JSON. Salida literal:

  ```text
  JSON parse: OK; semantic changes: exactly five approved values
  Haute Couture occurrences (case-insensitive): 0
  ```

  Exit 0. Esto compara contenido semántico con HEAD, no otros archivos ni una tienda.
- `git diff -- listings/sartorial/templates/index.json`: mostró las cinco sustituciones registradas en la tabla; exit 0 en la ejecución agrupada. `git diff --check -- listings/sartorial/templates/index.json` ejecutado por separado: sin salida, exit 0.
- `rg -n 'lookbook__caption|lookbook__inner|lookbook__stage|lookbook__media|lookbook\.section|editorial-lookbook' assets/base.css sections/lookbook.liquid` y lectura de fragmentos con `Get-Content` numerado: identificaron estructura, todas las referencias de selectores buscados y reglas aplicables citadas debajo. La ejecución agrupada terminó exit 0. `node_modules/liquidjs` no existe en esta base; no se utilizó motor Liquid ni se instaló dependencia.

## Caption vacío: estructura y límites

`sections/lookbook.liquid:155-157` contiene el `if section.settings.caption != blank`, dentro del cual se encuentra la etiqueta `<p class="lookbook__caption">` completa. Una cadena vacía satisface `blank` según la condición Liquid y, por lectura estática, esa rama no emite el elemento ni su contenido. El estilo `assets/base.css:4701-4706` asigna `margin-block: var(--space-2) 0` a `.lookbook__caption`: al no existir la etiqueta, ese margen no se aplica. El padre `.lookbook__inner` tiene ancho y márgenes horizontales (`4511-4515`); `.lookbook__stage` tiene posición relativa (`4538-4540`), sin espacio reservado al caption en estas reglas. Las reglas específicas de escritorio `5134-5148` y `5176-5194` alteran encabezado, medios, ancho y padding general, no reservan hueco al caption. No se observó un gap del padre de caption en las reglas específicas inspeccionadas.

La sección mantiene padding general en `.section` (`323-327`) y padding de sección a partir de 62rem (`5176-5180`), independientes del caption. Además, `sections/lookbook.liquid:159-174` contiene un fallback `<noscript>` cuya navegación tiene margen propio en `assets/base.css:4708-4710`; puede producir espacio/contenido con JavaScript deshabilitado, independientemente del caption. El header tiene su propio margen y grid gap. Estos espacios existentes no son reserva del caption y no se alteraron.

Esta es una conclusión estructural limitada por lectura de Liquid y CSS de la base, válida para las reglas estáticas citadas y sus variantes móvil/escritorio; no se ejecutó render Shopify, DOM, medición de layout, inspección visual ni prueba en storefront. Las interferencias de otras condiciones de ejecución no quedan medidas. No se declara compuerta 5 ni cumplimiento de requisitos.

# Alcance y estado posterior

No se cerró ni modificó ninguna fila del ledger. La decisión aquí registrada resuelve estas cinco sustituciones, no toda la actividad de 0-04. No acredita cierre de Lote 0 o R-0. Lote A requiere R-0 aceptado por Claude y aprobación de Johandry. Queda pendiente la revisión independiente de esta entrega; no hubo commit, push, red, prueba en tienda, ni publicación.
