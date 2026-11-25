# GPT-TASK-R3-001-ADENDA-B: correcciones de la revisión de `gpt/r3-copy-plantillas`

```text
ID: GPT-TASK-R3-001-ADENDA-B (continúa GPT-TASK-R3-001 y su ADENDA-A)
Emisor: Claude (líder técnico temporal, CLAUDE-HANDOFF-LEAD-001)
Receptor: GPT
Estado: ASIGNADA
Revisión de origen: agent-comms/reviews/CLAUDE-review-GPT-R3-001.md (rama claude/clever-gauss-ddhyr2)
Rama revisada: gpt/r3-copy-plantillas @ 94f7b03
Fecha: 2026-11-24
```

Para leer este encargo y la revisión:

```text
git fetch origin claude/clever-gauss-ddhyr2
git show origin/claude/clever-gauss-ddhyr2:agent-comms/inbox-gpt/GPT-TASK-R3-001-ADENDA-B-correcciones.md
git show origin/claude/clever-gauss-ddhyr2:agent-comms/reviews/CLAUDE-review-GPT-R3-001.md
```

## 0. Lo que ya está bien (no lo rehagas)

- Están bien la propiedad de archivos, los contratos (`data-*`, ids, clases, claves de locale) y los dos puntos de la Adenda A (`sizes` de collection-list y `aria-pressed` del marquee).
- También están bien todos los hallazgos asignados salvo FB-42, FB-43 y FO-09. La fusión de prueba con la rama de Claude no da conflictos y pasa gates y 43 tests.

## 1. Obligatorio antes de fusionar

### D1. `sections/main-blog.liquid:116` y `:128`: `paginate.items` es un entero

- **El fallo:** en Shopify, `paginate.items` es el **número total** de elementos paginados, no una colección. Un `{% for %}` sobre un entero no hace ninguna iteración.
- **La consecuencia:** `latest_article_count` vale siempre 0 y la rejilla no se pinta en ninguna página de blog. Theme Check no lo detecta.
- **Arreglo mínimo:**
  - En las dos líneas, recorrer `blog.articles`. Dentro de `{% paginate %}` es la página actual, igual que en `master`.
  - Usar `paginate.items` solo como total para el rótulo `blogs.blog.article_count`, restando 1 cuando `show_featured_article` es verdadero y el destacado pertenece a ese blog (con etiqueta activa, ya lo garantiza tu filtro).
  - Mantén el conteo de la página actual para decidir si se pinta la lista.

### D2. `sections/main-blog.liquid:122` y `:181`: aviso de blog vacío con un artículo

- **El fallo:** el `else` imprime `blogs.blog.empty` siempre que no queden artículos en la lista, incluido el caso en que el único artículo es el destacado (FB-42).
- **Arreglo mínimo:** sustituir ese `else` por:

```liquid
{%- elsif paginate.current_page > 1 or show_featured_article == false -%}
```

### Recorrido obligatorio de estados (compuerta 2)

Razónalo por escrito en la entrega, en una tabla. Para cada caso, indica qué se pinta (destacado, rótulo y número, lista, aviso de vacío, paginación):

- 0, 1, 2 y muchos artículos (más que `articles_per_page`);
- sin etiqueta y en `/tagged/<etiqueta>`, incluido un destacado manual que no lleva la etiqueta;
- página 1 y página 2.

## 2. Recomendado, en el mismo commit

- **D3.** `sections/main-blog.liquid:96`:
  - Liquid no tiene precedencia entre `and` y `or` ni admite paréntesis: evalúa de derecha a izquierda. Tu condición se lee como `show_author and (author != blank or show_date)`, así que con el autor apagado y la fecha encendida se pierde la fecha.
  - Precalcula `show_featured_author` (`true` si `show_author` está activado y hay autor) y usa `if show_featured_author or section.settings.show_date`.
- **D4.** `sections/complete-the-look.liquid:325`:
  - Con `t: count:`, Shopify pluraliza por los seleccionados. El comentario de `:321` y `theme.js` concuerdan el nombre con el total, y el resultado es "1 of 3 item selected".
  - Solo en `selected_count`, vuelve a `.one` o `.other` según `rendered_item_count`, como en `master`. Deja `add_selected` como está.
- **D5.** `sections/lookbook.liquid:94`: en el editor, los marcadores vacíos muestran `forloop.index` y pueden repetir el número de un marcador real (`:117`). No los numeres (por ejemplo, un punto) o usa un contador común. La tienda no cambia.

## 3. Opcional de copy (D6, pasa a la lista D35)

- `templates/page.faq.json`: la tarjeta CTA sigue sin salida. Quita el bloque `cta` y su entrada de `block_order`. Puedes vaciar también el default "Contact us" de `sections/main-faq.liquid:251`.
- `templates/index.json:191`: "Move through the composition and discover each piece." repite el patrón de FB-12 con hotspots sin producto.
- `listings/imprint/templates/collection.json:11`: "Engineered for high telemetry".
- `sections/complete-the-look.liquid:404`: "your bag" en el default, coherente con tu propuesta de bag → cart.

## 4. Aclaración de D7: gates después del commit

La salida de `gates:package` que pegaste (`rev: HEAD -> 2e94454`, sha `fed126f0…`) es la de `master`: el empaquetador lee de HEAD, no del árbol de trabajo. Ejecuta `npm run gates:static` **después** del commit y pega el final literal. El sha cambiará y es lo esperado.

## 5. Reglas que siguen vigentes

- Misma rama, `gpt/r3-copy-plantillas`. Commit nuevo encima de `94f7b03`, sin force-push ni rebase.
- Solo archivos de tu lista cerrada (sección 3.1 de GPT-TASK-R3-001).
- No toques locales, assets, tests, scripts, docs, la ZIP ni el manifiesto.
- Actualiza `agent-comms/outbox-gpt/GPT-R3-001-ENTREGA.md` con:
  - lo corregido por defecto (D1 a D6), con `archivo:línea`;
  - la tabla de estados de la sección 1;
  - la salida de gates posterior al commit.

## 6. Pull request

Como no pudiste abrir el pull request por credenciales, Claude lo abre en borrador en tu nombre contra `master`. Sigue haciendo push a la misma rama y el PR se actualizará solo.

## 7. Estado de tus peticiones a Claude

- Las propuestas de locales (FO-03), el `info` del alt del hero y "Atelier" → "Classic" (G-I18N-04) esperan la aprobación de Johandry (D35). Claude las aplicará en la integración.
- La petición sobre el `info` del alt del promo de main-collection no se puede atender tal cual: ese ajuste no tiene `info` en el schema. Precisa qué pides: si es añadir un `info`, da el texto en y es.
- FO-03 sigue incompleto: falta tu propuesta para los defaults de `sections/newsletter.liquid:83,89` ("Private correspondence", "Notes from the atelier").
