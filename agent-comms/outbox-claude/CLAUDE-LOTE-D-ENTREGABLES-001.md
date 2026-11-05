# CLAUDE-LOTE-D-ENTREGABLES-001: entregables de D-01, D-01-N y D-01-L para importación manual

```text
ID: CLAUDE-LOTE-D-ENTREGABLES-001 (rama lote-d, creada desde lote-c)
Estado: ENTREGADO. PARADA para que Johandry importe (D23). No se escribió en ninguna tienda.
Decisión requerida: Johandry. (1) Tienda de destino de cada preset. (2) Mercado e idioma (se propone inglés único). (3) Escala real de tallas de Sartorial y talla de etiqueta de Archive. (4) Aprobación del catálogo, los menús y las afirmaciones de Imprint y Archive antes de activar. (5) Cuándo retirar los fixtures QA de tema-qkqpke0j.
Resumen en 5 líneas:
  1. D-01: tres CSV de productos de Shopify: Sartorial 24 productos y 253 variantes (active), Imprint 13 y 38 (draft), Archive 12 y 12 (draft, inventario 1). Más colecciones por etiqueta y la lista de fotos por superficie.
  2. D-01-N: main-menu y footer por preset. Solo apuntan a colecciones, páginas (about, faq, contact) y políticas que se crean en estos pasos. Se conserva «Catalog» por el mega menú.
  3. D-01-L: se propone inglés único. Las descripciones de Sartorial se tradujeron al inglés sin cambiar cifras (incluido el vestido de LV-25), y todas las prendas tienen opción Size propuesta, pendiente de datos reales.
  4. scripts/demo-import.mjs (build/check) genera los CSV a partir de docs/demo-import/data/*.json. Valida handles, variantes, precios y miembros de cada colección. También comprueba que las plantillas y los menús solo apuntan a destinos definidos.
  5. Tema intacto: no se tocó ningún archivo de assets, config, layout, locales, sections, snippets, templates ni listings.
Archivos tocados: docs/demo-import/{D-01-catalogo-y-fotos.md, D-01-N-navegacion.md, D-01-L-idioma.md, sartorial-products.csv, imprint-products.csv, archive-products.csv, sartorial-photos.csv, imprint-photos.csv, archive-photos.csv, data/sartorial.json, data/imprint.json, data/archive.json}; scripts/demo-import.mjs; este informe; 1 línea en CLAUDE-CLOUD-STATUS.md.
Desviaciones (Nivel 1 o Nivel 2): ninguna en el tema. Hay tres ajustes de copy sobre las fuentes, documentados en §3.
Hallazgos extra fuera de alcance (con parche listo): HX-1. La tienda sartorial-edition tenía la colección `desk-study`, pero listings/imprint/templates/index.json apunta a `desk-and-study`. Lo resuelve el entregable (crear `desk-and-study`). HX-2. templates/page.about.json y page.faq.json son compartidos por los tres presets; su copy por preset no forma parte de este entregable.
Verificación (comando, resultado y qué demuestra/qué no): §2. Es estática: no demuestra que Shopify acepte el CSV sin avisos ni cómo se ve en tienda. Eso queda para R-Demo.
Lista de afirmaciones falsables numeradas: §4.
```

## 1. Qué pide el plan y qué se entrega

| Tarea | Plan V4.1 | Entregable | Formato para Johandry |
|---|---|---|---|
| D-01 (V-01, LV-23, LV-24, V-07) | :301. Sin placeholders ni fixtures QA, con fotos pertinentes y catálogo aprobado | `<preset>-products.csv`, tabla de colecciones, `<preset>-photos.csv`, lista de fixtures | CSV de Productos > Importar. Colecciones automáticas a mano. Fotos en admin y en el editor |
| D-01-N (LV-26) | :302. Navegación útil con destinos reales | Tablas de main-menu y footer, y las tres páginas | Creación manual en Contenido > Menús y Páginas (Shopify no importa menús) |
| D-01-L (LV-25) | :303. Idioma coherente y tallas reales, sin inventar medidas | Propuesta de inglés único, descripciones en inglés, tabla de escalas de talla pendientes | Configuración > Idiomas, opcionalmente Translate & Adapt, y reimportar el CSV si cambian las tallas |

D23 (`docs/decisions.md:242`; `CLAUDE-DECISION-LOTE-0-002.md:56-58`) limita estas tareas a entregables en el repo y una parada. D28 (`CLAUDE-DECISION-SESION-003.md`) no trata D-01: solo cubre H-1, PD-3, PD-8, el fixture de suscripción y el incidente del carrito. Pasos detallados en `docs/demo-import/D-01-*.md`.

## 2. Verificación

| # | Comando | Resultado | Qué demuestra / qué no |
|---|---|---|---|
| 1 | `node --check scripts/demo-import.mjs` | sin salida, exit 0 | Sintaxis válida |
| 2 | `node scripts/demo-import.mjs check` | `sartorial: 24 productos, 253 variantes, 7 colecciones` / `imprint: 13 productos, 38 variantes, 3 colecciones` / `archive: 12 productos, 12 variantes, 2 colecciones` / `OK: 0 errores` | Los CSV están al día con los datos, tienen columnas uniformes, sin handles ni combinaciones repetidas, con ≤100 variantes y precios numéricos. Cada producto, colección o página que citan las plantillas de cada preset existe, y cada enlace de menú resuelve. No demuestra que Shopify acepte el CSV |
| 3 | Prueba negativa: añadir una línea a `imprint-photos.csv` y ejecutar `check` | `desactualizado…` y `fila 55 con 1 columnas`, `FALLO: 2 error(es)`. Tras `build`, `OK: 0 errores` | El check detecta CSV alterados |
| 4 | `JSON.parse` de `docs/demo-import/data/*.json` | 3 × OK | JSON válido |
| 5 | `git status --porcelain` antes del commit | solo `?? docs/demo-import/` y `?? scripts/demo-import.mjs` | El tema no cambia. No se ejecutó Theme Check porque no se tocó el tema. `scripts/package-theme-zip.mjs:78-80` no incluye `docs/` ni `scripts/` en el ZIP |

Recuentos contrastados con la auditoría histórica (`harness-AUDIT-FINAL-002/results-07-parity-catalog.json`): atelier tenía new-forms 11, permanent-collection 14 y tailoring 5; archive tenía permanent-archive 12 y restored-pieces 3. Coinciden con las etiquetas de estos datos.

## 3. Fuentes y ajustes de copy

- Sartorial: `CLAUDE-DEMO-001` §Dos, traducido al inglés. Cifras sin cambiar (19 micras, 4 %, 120 hilos, 180 × 45 cm, 90 cm, 13 pulgadas).
- Imprint: `GPT-REPORT-014` E01-E13, literal salvo dos frases con tono de instrucción interna. «fit must be checked against the actual device» pasa a «check the fit against your device», y «confirm pen circumference» pasa a «check the pen's circumference».
- Archive: de cada borrador de `GPT-REPORT-014` A01-A12 se toma solo la frase descriptiva. Se quitan «Record … should/must» (instrucciones internas, el riesgo de V-05) y «proposed». El estado de conservación no se publica. La talla de etiqueta va como «Single piece. Label size: …», pendiente de verificar.
- Vendor: LINEA NOVE en Sartorial (fuente CLAUDE-DEMO-001, con búsqueda de marca pendiente). Vacío en Imprint y Archive, para no inventar marca.
- Inventario: Sartorial e Imprint sin seguimiento (no se inventan existencias). Archive con seguimiento, cantidad 1 y `deny`.

## 4. Afirmaciones falsables

1. `node scripts/demo-import.mjs check` da `OK: 0 errores` en el commit de esta entrega.
2. `docs/demo-import/sartorial-products.csv` tiene 254 líneas (cabecera y 253 variantes). `imprint-products.csv` tiene 39 y `archive-products.csv` 13.
3. Todas las filas de producto de `bias-cut-slip-dress` tienen la descripción en inglés y diez variantes (Ink, Bone × XS-XL).
4. Ningún CSV tiene columnas de imagen. Sobrescribir no borra las fotos existentes.
5. El main-menu de los tres presets tiene un elemento de primer nivel llamado «Catalog» (`sections/header-group.json:31`).
6. `git diff --stat lote-c..lote-d` no muestra archivos de assets, config, layout, locales, sections, snippets, templates ni listings.
7. Ningún archivo del commit contiene el literal de contraseña (conteo 0).
