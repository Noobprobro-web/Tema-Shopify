ID: GPT-REVIEW-CONTOUR-PLAN-001
Estado: APTO como plan documental para el flujo de directivas; sin certificación de implementación ni autorización de publicación.
Decisión requerida: ninguna del usuario para completar este encargo documental; las futuras directivas se concretan por el flujo vigente.
Resumen en 5 líneas:
1. Referente exclusivo Contour; se conserva la línea de moda y no se duplican herramientas existentes de Sartorial.
2. CI, claims inferidos, diferencias PDP y límites de controles fueron contrastados directamente con fuentes.
3. La falta de personalización recordada por Johandry es una pista incierta; configuración del comerciante y originalidad requieren evidencias diferentes.
4. Se corrigieron y releyeron precisiones sobre locales ES, presupuestos, fuente táctil, tiendas y autoridad de Nivel 2.
5. Esta revisión no implementa, ejecuta pruebas funcionales, autoriza despliegues ni certifica requisitos Shopify.
Archivos tocados: únicamente agent-comms/reviews/GPT-REVIEW-CONTOUR-PLAN-001.md.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación.
Hallazgos extra fuera de alcance (con parche listo): ninguno; revisión documental sin parches de aplicación.
Verificación (comando, resultado y qué demuestra/qué no): lecturas acotadas con rg/nl/Python y contraste de fuentes descritos abajo. No se ejecutaron gates, editor, Lighthouse, axe ni tienda en este pase.
Lista de afirmaciones falsables numeradas: R1–R6 al final.

## Alcance y autoridad

Subagente real Codex distinto del redactor del plan. Se leyeron AGENTS.md, RULES.md, primeras 30 líneas de BOARD, GPT-AUDIT-COMPARATIVA-001 revisión 2, GPT-PLAN-CONTOUR-001 y los tres apoyos TECH/PRODUCT/QA. El coordinador recibió los hallazgos y confirmó por mensaje la integración de personalización antes del dictamen. Se releyeron la versión final del plan, revisión 2 del informe, addenda de técnica/producto y los handoffs GPT-HANDOFF-CONTOUR-PLAN-001/GPT-CONSULTA-CONTOUR-PLAN-001. La última corrección de autoridad se contrastó nuevamente en disco.

El repositorio mantiene su estructura nominal: Johandry decide negocio, Claude lidera temporalmente la implementación, Gemini contrasta contratos y conserva escritura exclusiva de BOARD, GPT audita. RULES.md:87 exige autorización previa explícita de Gemini para Nivel 2. No se atribuye a Claude/Gemini una ejecución o aprobación producida por Codex. Este documento no es una autorización técnica de Nivel 2 ni aceptación de implementación.

## Hallazgos y correcciones

| ID / severidad documental | Fuente de la observación | Corrección o criterio de cierre | Estado |
|---|---|---|---|
| H1 · Media | `docs/contour-reference-plan.md:128`, CONTOUR-04; `scripts/locale-key-inventory.mjs:58` y `:59` | `gates:locales` solo lee los locales base EN. Para añadir `es.schema.json`, exigir comparación EN/ES por claves, tipos e interpolaciones, además de revisión humana y editor. Un gate verde no prueba traducción ES. | Corregido en el plan: CONTOUR-04 incluye comparador explícito y un caso negativo; no obliga a ampliar scripts antes de cerrar alcance. |
| H2 · Media | `docs/contour-reference-plan.md:101`, aceptación de CONTOUR-03 | Una tolerancia relativa de CLS +0.01 podría permitir cruzar un presupuesto absoluto. Mantener simultáneamente presupuestos internos y tolerancias de regresión, sin llamar oficiales a los valores no revalidados. | Corregido y releído: ambos contratos se aplican simultáneamente. |
| H3 · Baja | `docs/contour-reference-plan.md:91`, accesibilidad de CONTOUR-02; `docs/requirements-ledger.md:51`; `assets/base.css:42` | El objetivo interno de 44 px no aparece en RULES.md. Referenciar ledger/token y distinguirlo de la interpretación normativa WCAG pendiente de revisión. | Corregido en el plan; RULES conserva las cinco compuertas. No se modificó el ledger. |
| H4 · Media | `docs/contour-reference-plan.md:115`, matriz de personalización para ambos temas | Comparación estática de Contour; verificación empírica obligatoria de Sartorial. No convertir acceso a tiendas de Sebastián en dependencia ni prometer comprobar su editor. Una eventual copia de desarrollo propia requiere alcance explícito. | Corregido y releído: runtime Contour queda fuera y no bloquea Sartorial. |
| H5 · Media | `docs/contour-reference-plan.md:16`, `:113` y `:119` | Distinguir flexibilidad útil del editor de originalidad/diferenciación. Inventariar controles y consumidores; probar dos composiciones con piezas existentes antes de proponer ajustes nuevos. No deducir rechazo oficial o insuficiencia general por número de settings. | Corregido y releído, junto con los candidatos de espaciado local y columnas móviles, sujetos a ensayo. |
| H6 · Media | `agent-comms/outbox-gpt/GPT-CONTOUR-PRODUCT-001.md:204`, Candidato A | Cambiar «Claude puede autorizar una directiva de Nivel 2» por «Claude prepara la directiva; Gemini autoriza por escrito antes de implementar», conforme a RULES.md:87. | Corregido y verificado: Claude prepara/coordina, Gemini autoriza por escrito; Johandry conserva negocio y alcance. |

No quedan hallazgos documentales bloqueantes identificados tras las correcciones. El dictamen APTO se limita a coherencia, alcance y evidencia del plan; no significa cinco compuertas de implementación superadas ni aprobación del liderazgo nominal. Las pruebas futuras pueden revelar fallos y devolver sus paquetes. Cualquier defecto de runtime debe registrarse con reproducción, no derivarse del parecido entre temas.

## Conclusiones contrastadas directamente

- **No duplicación:** Imprint ya configura `technical_specs` y Archive `provenance`; se comprobó `main-product.liquid:694–706` para Liquid personalizado y apps, `:397–399` para reglas de cantidad y `:483–553` para planes. Compartir sección PDP no implica igualdad de recorrido. El plan protege estas capacidades y exige demostrar una carencia antes de añadir una sección.
- **Identidad:** los nombres actuales de presets son Sartorial/Imprint/Archive; las propuestas de recorrido siguen siendo hipótesis. El informe no impone el mobiliario, los objetos de demo o la estética de Contour a la moda editorial. Las referencias históricas Edition del ledger son una reconciliación documental; no autorizan renombrar ni invalidar evidencia previa.
- **Recursos/editor:** `ThemeElement` usa AbortController y limpieza; `EditorialLookbook` depende de él, escucha eventos y selección de bloque. `ThemeCore` ya exporta utilidades. Separar JS exige conservar orden de carga, registro único y soporte al añadir secciones en editor. El plan contempla esos riesgos y añade los nuevos assets al contrato de sintaxis si se implementan.
- **Referencia contrastada:** `atelier/layout/theme.liquid:173–200` carga múltiples módulos y `:202–234` distingue editor del arranque pospintado. El plan evita interpretar el menor `theme.js` del referente como menor JS total y no adopta automáticamente ese cargador.
- **Datos:** `product-technical-specs.liquid:46–69` sí tiene ramas alcanzables que infieren latón y mecanizado desde handle sin material/hardware explícitos. `DEVELOPMENT.md:130–135` de Contour documenta datos ausentes sin publicar; es relato del autor, no prueba empírica de esa tienda. Se propone corregir nuestra rama con casos positivos/negativos, sin afirmar exposición actual.
- **Personalización muestreada:** Sartorial publica fuente/peso en `layout/theme.liquid:61–72`; Contour limita peso editorial a 300–400 en `snippets/css-variables.liquid:29`. Lookbook permite esquema de sección y posiciones móviles; 0 significa herencia desktop (`lookbook.liquid:75–81`). Contour cambia posición del medio en frame-preview solo desde 990 px (`:182–184`). Son límites observados en código, no motivos de rechazo demostrados ni fallos de editor reproducidos.
- **Candidatos acotados:** no aparecen `padding_top`/`padding_bottom` en main-product, main-collection o brand-manifesto de Sartorial; no se generaliza esa ausencia al tema completo. `base.css:5033–5038` sí fija la correspondencia móvil 2→1 y 4→2; `theme.js:3690–3722` conserva la vista del visitante. Contour expone columnas móviles independientes y padding en `main-collection.liquid:154–197`, consumidos en `:8–11`. El plan trata ambos como ensayos condicionados, con herencia/defaults/preferencias preservados; no como fallos normativos ni implementaciones aprobadas.

## Secuencia, métricas y ledger

CONTOUR-00 puede documentar fuentes, procedencia y controles sin tienda; CONTOUR-01 puede preparar CI estático y exactitud de ayuda sin esperar credenciales. La línea base CONTOUR-02 sí precede a cambios medidos de composición/recursos. La personalización se investiga en paralelo y debe preceder a ampliar el piloto; no hace falta ejecutar las 54 auditorías de la matriz completa por cada modificación.

La suite actual PDP elige productos con reglas compatibles con cantidades 1–3 y no cubre por sí sola min distinto de 1, incrementos o planes obligatorios (`tests/pdp-line-total.spec.mjs:52–56`). Su segundo caso puede omitirse (`:144`). El plan exige fixtures y escenarios adicionales, por lo que 2 passed/0 skipped se interpreta como aceptación de esos dos casos, no de toda la compra.

Las tareas futuras deben vincular filas por nombre y evidencia vigente, o declarar mejora de proceso sin fila modificada. El apoyo QA sí ofrece ese mapeo; la síntesis remite al mismo y exige lista cerrada por directiva. No se cambian estados ni se reabren filas verdes desde esta revisión. SHA, tema, preset, ruta, fixture, herramientas y resultado real distinguen evidencia actual de artefactos históricos.

La revalidación oficial sigue pendiente. El fallo 403 de consulta es evidencia comunicada por el coordinador, no una petición repetida por este revisor. No se atribuyen a Shopify tolerancias de sprint, número de secciones o reglas descritas únicamente por el autor de Contour.

## Evidencia reproducible de este pase

Se ejecutaron `git -C <repo> rev-parse HEAD`, lecturas numeradas y búsquedas dirigidas de las expresiones citadas. Un script Python leyó solo los archivos enumerados, emitió línea de cada coincidencia exacta, leyó los nombres de presets con `json.loads` y contó `44` en RULES.md. Salida literal relevante:

```text
/workspace/Tema-Shopify: b400cdc5acc345e9e9d6c0c99e3132a3bc6a5e44
/tmp/shopify-comparison/atelier: 1576d06b336abb6827084b7734faebbcb4d8f32f
.github/workflows/ci.yml:27: node-version: 20
.github/workflows/ci.yml:58: run: npx playwright test --list
package-lock.json:680: "node": ">=22.12.0"
scripts/locale-key-inventory.mjs:58: const storefront = flatten(JSON.parse(await readFile(path.join(REPO, 'locales/en.default.json'), 'utf8')));
scripts/locale-key-inventory.mjs:59: const schema = flatten(JSON.parse(await readFile(path.join(REPO, 'locales/en.default.schema.json'), 'utf8')));
snippets/product-technical-specs.liquid:53: assign material_val = 'Solid milled brass'
snippets/product-technical-specs.liquid:69: assign hardware_val = 'Precision machined'
assets/base.css:42: --tap-target-min: 44px;
listings/imprint/templates/product.json:72: "type": "technical_specs",
listings/archive/templates/product.json:72: "type": "provenance",
Presets: Sartorial, Imprint, Archive
RULES 44 matches: 0
```

Se contaron las cadenas `padding_top` y `padding_bottom` mediante `Path.read_text().count()` exclusivamente en las tres superficies indicadas. Salida literal:

```text
main-product: padding_top=0, padding_bottom=0
main-collection: padding_top=0, padding_bottom=0
brand-manifesto: padding_top=0, padding_bottom=0
```

`nl -ba assets/base.css | sed -n '5028,5041p'`, `nl -ba assets/theme.js | sed -n '3690,3725p'` y la lectura equivalente de `atelier/sections/main-collection.liquid` confirmaron los consumidores. Extractos literales:

```text
Sartorial/assets/base.css:
5033 .product-grid[data-grid-columns='2'] {
5034   grid-template-columns: minmax(0, 1fr);
5037 .product-grid[data-grid-columns='4'] {
5038   grid-template-columns: repeat(2, minmax(0, 1fr));
Sartorial/assets/theme.js:
3694 storedValue = window.localStorage.getItem(this.gridStorageKey);
3699 const gridView = ['2', '4', 'list'].includes(storedValue)
3700   ? storedValue
3701   : this.dataset.defaultGridColumns;
Contour/sections/main-collection.liquid:
8 --pt: {{ section.settings.padding_top }}px;
9 --pb: {{ section.settings.padding_bottom }}px;
11 --grid-columns-mobile: {{ section.settings.columns_mobile }};
165 "id": "columns_mobile",
```

En este último bloque se normaliza únicamente la indentación al citar; nombres, valores y números de línea son los observados.

Lectura adicional numerada de archivos de arquitectura/personalización, extractos literales:

```text
Sartorial/assets/theme.js:
152:   class ThemeElement extends HTMLElement {
167:     stopListening() {
168:       this.abortController?.abort();
3815:   class EditorialLookbook extends ThemeElement {
5261:   window.ThemeCore = {
5326:   if (!customElements.get('editorial-lookbook')) {
5327:     customElements.define('editorial-lookbook', EditorialLookbook);
5618:     document.addEventListener('shopify:section:load', (event) => register(event.target));

Contour/layout/theme.liquid:
173:       assign theme_scripts = 'anim-settings.js,theme.js,cart.js,tooltip.js,tabs.js,compare-slider.js,horizontal-scroll-nav.js,collection-showcase.js,product-card.js,product.js'
177:       assign theme_scripts = theme_scripts | append: ',lenis.min.js,gsap.min.js,scrolltrigger.min.js'
202:     {%- if request.design_mode -%}
234:           setTimeout(start, 3000);

Contour/snippets/css-variables.liquid:
29:   assign heading_weight = heading_font.weight | at_most: 400 | at_least: 300

Sartorial/sections/lookbook.liquid:
75:               assign hp_mobile = block.settings.horizontal_position_mobile
76:               if hp_mobile == 0
77:                 assign hp_mobile = block.settings.horizontal_position
230:       "default": "scheme-1"
```

## Pendientes y afirmaciones falsables

- R1. Los SHAs examinados son los impresos; no hay implementación nueva revisada aquí.
- R2. CI descubre sin ejecutar los dos casos PDP; no se reprodujo un fallo GitHub Actions con Node 20.
- R3. `gates:locales` actual no carga ES; su éxito aislado no valida la nueva locale propuesta.
- R4. Las ramas de inferencia de material/hardware existen; no se demostró publicación actual de un claim falso.
- R5. Los controles muestreados tienen consumidores en código; no se probó aplicación, persistencia o accesibilidad en el editor real.
- R6. La revisión de documentación no cierra filas empíricas, no confirma el motivo de rechazo de Contour y no acredita aceptación Shopify.

Pendiente externo de implementación: acceso de desarrollo propio, catálogo/fixtures y dependencias de cada escenario, requisitos oficiales actuales y ejecución con crudos. No bloquea el cierre del trabajo documental. La relectura final y las seis correcciones documentales de esta revisión están completas.
