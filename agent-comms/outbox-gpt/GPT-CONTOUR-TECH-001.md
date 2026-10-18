ID: GPT-CONTOUR-TECH-001
Estado: propuesta técnica; sin implementación ni nueva certificación en tienda.
Decisión requerida: Claude prioriza los sprints; Gemini valida el diseño y autoriza por escrito cada cambio de contrato de Nivel 2 antes de implementarlo.
Resumen en 5 líneas:
1. Adoptar de Contour separación de responsabilidades, capacidades específicas del nicho y soporte explícito del editor, conservando la arquitectura y estética de Sartorial.
2. Conservar ThemeElement, ThemeCore, compra nativa, guía de tallas, procedencia y movimiento sin dependencias; ya existen.
3. Primero corregir la reproducibilidad de CI y construir una línea base actual en tienda; después optimizar un componente por vez.
4. Dividir archivos sin reducir las descargas de cada página no demuestra una mejora: Contour también carga muchos módulos globalmente.
5. Los objetivos numéricos siguientes son criterios propuestos de aceptación, no resultados obtenidos ni requisitos oficiales de Shopify.
Archivos tocados: únicamente agent-comms/outbox-gpt/GPT-CONTOUR-TECH-001.md.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación. Las futuras opciones de schema, defaults y composiciones de presets se tratarán como Nivel 2.
Hallazgos extra fuera de alcance (con parche listo): ninguno; este encargo no prepara parches de aplicación.
Verificación (comando, resultado y qué demuestra/qué no): inspección acotada de fuentes y tamaños reproducibles; evidencia inferior. No se ejecutó la tienda ni GitHub Actions en este pase.
Lista de afirmaciones falsables numeradas: T1–T7 y las salidas literales de evidencia.

## Alcance y decisiones que se preservan

Revisión del 18 de octubre de 2026. Referente único: Contour, repositorio `SebastianDev017/atelier`, SHA `1576d06b336abb6827084b7734faebbcb4d8f32f`; proyecto objetivo: Sartorial en `/workspace/Tema-Shopify`. Se leyó AGENTS.md, RULES.md, las primeras 30 líneas de BOARD.md y el informe GPT-AUDIT-COMPARATIVA-001. Cucuyo queda fuera de esta propuesta.

La historia de rechazos de Contour mencionada por Johandry es contexto proporcionado por el usuario. No se dispone aquí de los dictámenes de revisión: no se infiere cuáles fueron sus causas, que sus cambios resolvieran cada rechazo ni que el tema esté aprobado. Shopify sigue siendo la fuente normativa; Contour es evidencia de decisiones técnicas que deben medirse en Sartorial.

| ID | Capacidad observada en Sartorial que se preserva | Fuente comprobada |
|---|---|---|
| T1 | Base de componentes con escucha abortable y limpieza al desconectar; exportación de utilidades compartidas para zoom. No sustituirla por un nuevo framework. | `assets/theme.js:152` (`ThemeElement`), `:167` (`stopListening`), `:5261` (`window.ThemeCore`) |
| T2 | Reglas de cantidad y planes de venta nativos, guía de tallas, procedencia, bloques de apps y Liquid personalizado. La migración no simplifica los formularios ni pierde atributos `data-*`. | `sections/main-product.liquid:397` (`quantity_min`), `:530` (`selling_plan_group`), `:270` (`size_guide`), `:702` (`provenance`), `:694` (`custom_liquid`), `:705` (`@app`) |
| T3 | Moneda procedente de Shopify, movimiento reducido y eventos del editor ya tienen soporte. No presentarlos como capacidades nuevas tomadas de Contour. | `layout/theme.liquid:101` (`shop.money_format`), `:103` (`prefers-reduced-motion`), `assets/theme.js:5618` (`shopify:section:load`), `:5619` (`shopify:section:unload`) |

Se mantiene la línea de moda editorial, sus tokens y los tres presets existentes. No se propone copiar código, textos, fotografías, navegación lateral, cursores o efectos visuales del referente. El historial del ledger conserva sus evidencias previas; esta propuesta no reabre filas verdes por comodidad ni cambia sus estados.

## Qué aprender del referente y qué verificar primero

| ID | Práctica de Contour | Adaptación propuesta a Sartorial | Límite y riesgo |
|---|---|---|---|
| T4 | Recursos separados por responsabilidades, con algunas condiciones por plantilla y opción. | Extracción pequeña de una capacidad opcional y carga cuando existe el componente; mantener el núcleo compartido. | `atelier/layout/theme.liquid:173` carga una lista amplia global; `:177` añade Lenis y GSAP. Separar archivos no garantiza menos JS ni mejor INP. |
| T5 | Tratamiento explícito de carga y reinicialización en editor. | Verificar añadir, duplicar, ordenar, seleccionar bloque y eliminar sección con los componentes propios de Sartorial. | `atelier/layout/theme.liquid:202` diferencia `design_mode`; `atelier/assets/tabs.js:103` maneja recarga y `:104` selección. Sartorial ya tiene eventos y limpieza; el trabajo es probar su continuidad. |
| T6 | Secciones que resuelven decisiones de compra particulares del nicho. | Reutilizar primero guía de tallas, procedencia, lookbook y compra de conjuntos; si falta una utilidad real, diseñar una sola capacidad original de moda. | `atelier/sections/frame-preview.liquid:15` explica radios nativos y fallback; `:129` encola su JS. Adaptar el principio de utilidad, no un simulador de marcos a prendas. |
| T7 | Locales del editor en varios idiomas y dos hojas globales de CSS. | Priorizar ES del editor y reducción demostrable de CSS específico; idiomas adicionales solo con necesidad comercial y revisión humana. | Dos CSS globales siguen siendo globales (`atelier/layout/theme.liquid:56`). Paridad de claves no acredita calidad de traducción. |

No se propone reproducir el cargador pospintado de Contour (`atelier/layout/theme.liquid:224`): introduce otro ciclo de arranque y tiene una espera de respaldo de 3000 ms (`:234`). Cualquier estrategia de este tipo exige demostrar disponibilidad de compra y manejo de interacción temprana bajo CPU lenta. La alternativa de menor riesgo es conservar `defer` para el núcleo comercial y condicionar únicamente módulos opcionales.

## Secuencia técnica propuesta

Los responsables son roles nominales del proyecto: **Claude líder e implementador**, **Gemini arquitecto consultor y autorizador del contrato técnico**, **GPT auditor independiente**, **Johandry dueño de prioridades y de acceso a la tienda**. Estos nombres no indican que otras identidades de modelo hayan ejecutado este análisis; el informe lo produjo un subagente de GPT/Codex.

### CT-00 — Reproducibilidad y evidencia actual, prioridad alta

**Problema confirmado:** CI declara Node 20 (`.github/workflows/ci.yml:27`) mientras `.nvmrc:1` fija 22.12.0 y el CLI del lockfile requiere >=22.12.0 (`package-lock.json:680`). CI ejecuta `playwright test --list` (`ci.yml:58`), que descubre pruebas sin ejecutarlas. No se afirma un crash de Node 20 ni un fallo observado de GitHub Actions.

**Alcance permitido propuesto:** `.github/workflows/ci.yml`, `playwright.config.mjs`, `tests/pdp-line-total.spec.mjs`; nuevos archivos de fixtures/pruebas solo con lista cerrada acordada. Manifiestos y lockfile se conservan salvo necesidad separadamente autorizada. Leer `.nvmrc` desde setup-node; separar comprobaciones estáticas de ejecución conectada.

**Entregables:** un job estático reproducible y un job conectado no desplegable que ejecute los tests reales con `PLAYWRIGHT_BASE_URL` y `PDP_PATH` definidos para un preview de desarrollo estable. Datos fixture de cantidad 1–3 y compare-at válidos. No usar el catálogo mutable como sustituto silencioso de una fixture. Configuración de autenticación mediante bindings seguros; nunca incluir credenciales en informe o workflow.

**Dependencias:** Johandry asegura acceso autorizado al preview/catálogo de desarrollo; Claude confirma variables existentes antes de pedir nuevas. Sin acceso, completar CI estático y dejar la ejecución conectada como `no verificado`.

**Aceptación:** CI usa la versión de `.nvmrc`; 8 compuertas estáticas pasan; los dos tests PDP realmente ejecutan sus aserciones y dan 2 passed, 0 skipped con las fixtures elegidas. Además, recorrido de variante disponible/agotada, añadir, cambiar cantidad y eliminar del carrito con importes y anuncios correctos en desktop y 375 px, mediante casos nuevos cuyo alcance valide Gemini. No aceptar `--list` como verificación funcional.

**Dueños y rollback:** Claude implementa; Gemini revisa configuración/catálogo; GPT intenta falsificar resultados y distingue omitidos. Revertir el commit de CI/pruebas si introduce regresiones; no revertir producto ni borrar datos del comerciante. No implica publicar el tema.

### CT-01 — Presupuesto de recursos y línea base, antes de cualquier refactor

**Alcance:** nuevo arnés o reutilización validada de herramientas existentes bajo `scripts/` y evidencia bajo una carpeta de entrega nueva; ningún cambio de CSS/JS de producto. Definir primero la lista exacta de archivos con Gemini.

**Matriz:** inicio, PDP, colección, búsqueda y carrito; catálogo y preview iguales antes/después; escritorio 1280 y móvil 375; arranque con caché fría. Cubrir EN/ES y estados sin JS, movimiento reducido y fallo de red de un módulo opcional. La interacción del editor se mide por separado.

**Aceptación:** registro por URL de CSS/JS realmente transferido, peticiones, cobertura orientativa, errores propios, LCP, CLS, TBT e interacción de compra. Tres ejecuciones por URL/perfil bajo los mismos parámetros y mediana; guardar resultados crudos y versiones de herramientas. Identificar imágenes y apps externas para no atribuir al CSS variaciones de otra causa. Cobertura en una sola navegación no autoriza borrar selectores.

**Dueños y rollback:** Claude ejecuta/produce evidencia, Gemini decide presupuesto a partir de resultados, GPT revisa comparabilidad. No hay rollback de producto; retirar exclusivamente el arnés añadido si no es fiable. Sin tienda, los tamaños locales inferiores sirven de baseline estático, sin sustituir las mediciones pendientes.

### CT-02 — CSS piloto de una capacidad opcional, prioridad media

**Dependencia:** CT-01. **Alcance candidato:** `assets/base.css`, `sections/lookbook.liquid`, nuevo `assets/component-lookbook.css`; solo si el barrido de selectores confirma que el bloque puede aislarse sin arrastrar estilos usados por otras secciones. Preservar tokens, orden de cascada, movimiento y estados accesibles. No retirar reglas compartidas por `curated-showcase`, galería o compra de conjuntos sin directiva adicional.

**Alternativas:** mantener todo global si el ahorro es mínimo; extraer solo CSS de una sección; mantener los estados de movimiento compartidos en base y extraer la estructura propia. No elegir dos CSS globales solo para parecerse al referente. Evitar un sistema de build nuevo para esta tarea.

**Aceptación propuesta:** en una página sin lookbook, el recurso específico no se solicita y los bytes CSS transferidos bajan frente al baseline; si el piloto no alcanza una reducción útil acordada con Gemini, no extenderlo. En una página con dos lookbooks el recurso no se descarga dos veces y ambas instancias funcionan. Sin diferencias visuales no deseadas en las cinco páginas, 375/768/1280 px; 0 errores propios nuevos, 0 overflow horizontal nuevo, 0 elementos permanentemente invisibles. CLS sin incremento >0.01 y medianas LCP/TBT sin regresión >10% bajo el mismo protocolo; si hay ruido, ampliar diagnóstico antes de aceptar. Estas tolerancias son guardas del sprint, no certificación Shopify.

**Dueños y rollback:** Claude implementa únicamente piloto; Gemini valida cascada, dependencias y budget; GPT verifica red y estados límite. Un commit autocontenido que restaure reglas y referencia de carga permite revertirlo sin alterar settings ni datos. Ampliar a otro componente solo tras revisión del primer piloto.

### CT-03 — JS opcional con contratos intactos, después del piloto CSS

**Alcance candidato:** `assets/theme.js`, `sections/lookbook.liquid`, nuevo `assets/component-lookbook.js`; `layout/theme.liquid` solo si hace falta una exposición mínima y explícita de utilidades compartidas. `ThemeCore` ya existe: no publicar funciones privadas adicionales sin necesidad demostrada. Inventariar previamente clases, ayudantes y eventos usados por `EditorialLookbook` y registrar cada consumidor.

**Diseño:** núcleo conserva compra, moneda, focus trap, coordinación de scroll e infraestructura de custom elements. El módulo opcional se registra una vez y soporta instancias nuevas tras añadir secciones en editor. La detección solo por `template.name` es insuficiente: el comerciante puede añadir una sección a otras plantillas. Si Shopify no entrega recursos nuevos en un re-render parcial del editor, usar una rama explícita de arranque en `design_mode`, probada y sin cambiar la carga de la tienda pública.

**Aceptación:** el módulo no se solicita donde no hay componente; aparece una única solicitud si hay varias instancias; 10 ciclos de añadir/duplicar/ordenar/eliminar sin doble registro, doble acción ni escucha residual observable. Primera interacción válida durante arranque lento; foco restaurado, Escape y teclado correctos. El conjunto conserva el contrato `data-*`, `shop.money_format`, planes de venta y reglas de cantidad. Cero regresión de las 8 compuertas y de CT-00. Si se amplía el inventario de assets JS, `gates:syntax` debe cubrirlos: hoy solo comprueba `theme.js` y `product-zoom.js` (`package.json`, script `gates:syntax`). La incorporación de ese archivo al alcance se acuerda antes de implementar.

**Alternativa y rollback:** si el núcleo común aumenta hasta consumir el ahorro, mantener esa clase global y elegir otro piloto; no fragmentar formularios críticos por tamaño bruto. Claude implementa, Gemini valida el grafo, GPT audita interacción/editor. Commit reversible que restaure la clase, su registro y la carga anterior; ningún cambio de IDs, defaults, plantilla del comerciante o almacenamiento.

### CT-04 — Editor y utilidad de moda, posterior a estabilizar carga

**Alcance inicial:** nuevo `locales/es.schema.json` alineado con `locales/en.default.schema.json`; reporte de tareas reales de edición, sin cambios funcionales de secciones. Revisar de manera humana terminología de tallas, corte, tejido, estado de conservación y venta por plan. Mantener labels `t:`, sentence case e `info` cuando el setting dependa de servicios/metafields externos.

**Aceptación:** 100% de claves de la nueva locale resuelven; valores de tipo compatible; 0 claves nuevas huérfanas; comerciante completa añadir lookbook, configurar tallas y publicar una composición de archivo en ES sin exponer jerga técnica. Probar selección de bloque, duplicación y preview de móvil. No activar DE/FR/IT por imitación de Contour sin necesidad de mercado y revisión lingüística.

**Utilidad opcional posterior:** auditar tareas de compra que no cubren ya guía de tallas/procedencia/conjuntos. Una sola nueva capacidad requerirá problema observado, definición comercial de Johandry, contrato cerrado de Gemini y lista nueva de archivos. No se autoriza desde este informe crear más secciones ni alterar presets certificados. La estructura compartida de presets no demuestra por sí sola falta de diferenciación visual.

**Dueños y rollback:** Claude implementa locale, Gemini revisa vocabulario/contratos, GPT audita flujo de comerciante, Johandry valida idioma/mercado objetivo. Retirar la nueva locale si se detectan errores; no cambiar IDs ni deshacer ajustes del comerciante. Las decisiones de producto nuevas se registran por sus escritores autorizados.

## Compuertas y administración de la entrega

Cada directiva debe declarar las filas del ledger afectadas por nombre y evidencia actual, validando sus índices antes de emitirla; no inferir números desde líneas históricas desplazadas. Este informe **no cierra ni modifica ninguna fila**. Priorizar revisión de «Motor de Movimiento Nativo sin Dependencias», «Soporte de prefers-reduced-motion», «Axioma Anti-Invisible», foco y moneda cuando un cambio los alcance, sin refactorizar módulos certificados ajenos al piloto.

Toda sección tocada recorre vacío, uno, muchos, texto largo y faltante. Cada entrega comprueba consistencia entre archivos, superficie del comerciante y pruebas en tienda real. «Código completo» se usa hasta la medición exigida; «cumplido» requiere evidencia pertinente. Claude entrega el diff y sus resultados; GPT valida las afirmaciones de forma independiente; Gemini registra BOARD/decisiones según sus permisos. Ningún agente se autoacepta. No se requiere migrar el sistema de colaboración para ejecutar este plan.

## Evidencia de terminal de este pase

Las siguientes salidas fueron obtenidas al inspeccionar el disco; se incluyen las líneas relevantes, no se ejecutaron tests ni comandos de despliegue para redactar el plan.

```text
$ git -C /workspace/Tema-Shopify status --short
?? agent-comms/outbox-gpt/GPT-AUDIT-COMPARATIVA-001.md

$ git -C /tmp/shopify-comparison/atelier rev-parse HEAD
1576d06b336abb6827084b7734faebbcb4d8f32f

$ nl -ba .github/workflows/ci.yml | sed -n '24,28p;57,58p'
    24      - name: Setup Node.js
    25        uses: actions/setup-node@v4
    26        with:
    27          node-version: 20
    28          cache: 'npm'
    57      - name: Verify Playwright Test Discovery
    58        run: npx playwright test --list

$ nl -ba .nvmrc
     1  22.12.0
$ rg -n '"node": ">=22.12.0"' package-lock.json
680:        "node": ">=22.12.0"

$ nl -ba playwright.config.mjs
     4  testDir: './tests',
     7  workers: 1,
    14  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:9292',
    19  name: 'chromium',
    23  viewport: { width: 1280, height: 900 },

$ nl -ba tests/pdp-line-total.spec.mjs | sed -n '142,145p'
   142  test('renders and clears the compare-at line total when catalog data permits', async ({ page }) => {
   143    const context = await openEligibleProduct(page, { compare: true });
   144    test.skip(!context, 'The connected catalog has no eligible compare-at-price variant.');

$ rg -n 'script-after-paint|stylesheet_tag' /tmp/shopify-comparison/atelier/sections/frame-preview.liquid
129:{% render 'script-after-paint', src: 'frame-preview.js' %}
```

Las citas de arquitectura se verificaron con `nl -ba assets/theme.js`, `nl -ba layout/theme.liquid`, `rg -n 'quantity_rule|selling_plan|size_guide|provenance|@app|custom_liquid' sections/main-product.liquid`, y con `nl -ba` sobre las rutas de Contour indicadas arriba. Extractos literales relevantes:

```text
Sartorial/assets/theme.js:
152:  class ThemeElement extends HTMLElement {
167:    stopListening() {
172:    disconnectedCallback() {
5261:  window.ThemeCore = {

Sartorial/layout/theme.liquid:
54:    {{ 'base.css' | asset_url | stylesheet_tag: preload: true }}
95:    <script src="{{ 'theme.js' | asset_url }}" defer="defer"></script>
101:      window.theme.moneyFormat = {{ shop.money_format | strip_html | json }};

Contour/layout/theme.liquid:
56:    {{ 'base.css' | asset_url | stylesheet_tag }}
57:    {{ 'base-components.css' | asset_url | stylesheet_tag }}
173:      assign theme_scripts = 'anim-settings.js,theme.js,cart.js,tooltip.js,tabs.js,compare-slider.js,horizontal-scroll-nav.js,collection-showcase.js,product-card.js,product.js'
177:      assign theme_scripts = theme_scripts | append: ',lenis.min.js,gsap.min.js,scrolltrigger.min.js'
202:    {%- if request.design_mode -%}
234:          setTimeout(start, 3000);
```

Medición reproducible: Python `Path.read_bytes()` y `len(gzip.compress(bytes, mtime=0))` sobre cada archivo; inventario con `Path.glob('*.liquid')` y `Path.glob('*schema.json')`. Salida literal:

```text
Sartorial
assets/base.css 249027 bytes 50153 gzip bytes
assets/theme.js 240668 bytes 56608 gzip bytes
sections 33
schema locales en.default.schema.json
Contour
assets/base.css 74203 bytes 20977 gzip bytes
assets/base-components.css 26801 bytes 8158 gzip bytes
assets/theme.js 38326 bytes 10636 gzip bytes
sections 60
schema locales de.schema.json,en.default.schema.json,es.schema.json,fr.schema.json,it.schema.json
```

Esto cuantifica archivos locales y presencia de locales, sin medir tráfico del navegador. Los 10636 bytes gzip de `Contour/theme.js` no representan todo su JavaScript: su layout incluye muchos otros recursos. El tamaño no es una puntuación de calidad, velocidad ni aceptación por Shopify.

## Addendum — Personalización y propagación de controles (CONTOUR-04)

Johandry recuerda un rechazo de Contour «por falta de personalización o algo así» y no dispone del reporte completo. Se registra como recuerdo de motivo incierto, sin adjudicarlo a un defecto concreto. «Personalización» podría aludir a flexibilidad efectiva del editor o a diferenciación/originalidad del producto y sus presets; ambos sentidos necesitan pruebas distintas. Tener más settings o secciones no acredita resolver ninguno.

**Resultado de la revisión estática:** los controles muestreados de ambos temas tienen consumidores reales en Liquid/CSS/JS. No se confirma que falte personalización general. No se ejecutó Shopify Theme Editor ni se comprobó persistencia/render calculado: los puntos siguientes son trazabilidad de implementación y pruebas pendientes.

| Control representativo | Sartorial: propagación comprobada | Contour: propagación comprobada | Límite y prueba necesaria |
|---|---|---|---|
| Tipografía global y preset | `config/settings_schema.json:121` define `type_heading_font`; `layout/theme.liquid:61` carga font_face y `:70`/`:72` emiten familia/peso; `assets/base.css:226`/`:228` los consumen. `settings_data.json:162` asigna Assistant a Imprint y `:85` Libre Baskerville a Sartorial. | `config/settings_schema.json:19` define `heading_font`; `snippets/css-variables.liquid:63`/`:64` emiten familia/peso; `assets/base.css:222`/`:223` los consumen. `settings_data.json:132`, `:234` y `:337` asignan fuentes diferentes a sus tres presets. | Contour limita el peso a 300–400 (`css-variables.liquid:29`); la familia cambia, pero no preserva cualquier peso elegido. Es una decisión estética comprobada, no causa de rechazo demostrada. Probar dos familias y pesos contrastados en headings/product titles y documentar qué se permite. Sartorial conserva `settings.type_heading_font.weight`; verificar el estilo calculado y la fuente cargada. |
| Esquema de color global y sección | `settings_schema.json:110` define esquema global; `layout/theme.liquid:81` genera clases `.color-*`; `lookbook.liquid:2`/`:3` resuelve sección→global→scheme-1 y `:12` aplica clase. `base.css:132` consume fondo y `:105` deriva superficie. | `frame-preview.liquid:22` resuelve esquema y `:35` lo aplica; `css-variables.liquid:190` genera `.color-scheme--*` y `:191`/`:192` emiten fondo/texto; el componente consume tokens propios en `frame-preview.liquid:149`/`:169`. | Sartorial `lookbook.liquid:230` asigna default scheme-1; una sección con esquema propio no hereda automáticamente un cambio global. Contour también fija background-1 en esa sección (`:232`). Probar selección explícita y ausencia/importación limpia por separado. No declarar roto el color global por la precedencia intencional de un esquema de sección. |
| Configuración de sección/bloque en móvil y editor | Lookbook declara imagen móvil (`:193`), la publica con `<source media>` (`:40`/`:42`); posición móvil (`:266`, `:277`) se emite como variables (`:86`) y se consume en media query (`base.css:4579`). El componente abre el hotspot seleccionado en el editor (`theme.js:3838`) y limpia al desconectar (`:3845`). | Frame preview declara `media_position` (`:221`) y añade clase (`:36`); CSS cambia orden solo a >=990 px (`:182`/`:184`). Los colores del bloque se publican como `data-fp-*` (`:91`) y `frame-preview.js:24` los escribe en variables; `:45` reinicia al recargar una sección. | Sartorial interpreta posición móvil 0 como herencia de desktop (`lookbook.liquid:76`), no una posición móvil independiente al 0%; mantener la ayuda existente y comprobar límites. Contour no promete aquí orden móvil independiente: comprobar expectativa del comerciante. Validar selección de bloque, duplicación, recarga y persistencia en ambos casos. |

**Tarea adicional dentro de CONTOUR-04: matriz de personalización efectiva.** Claude prepara escenarios y ejecuta el editor; Gemini fija precedencia/contratos; GPT verifica resultados y limita las conclusiones; Johandry evalúa si se mantiene su línea. No se crean controles nuevos antes de identificar una tarea imposible o un control que no se refleje correctamente.

Columnas mínimas del artefacto: preset y SHA, tarea del comerciante, control/clave, origen global/sección/bloque, valor A/B, override heredado, consumidor esperado, estilo/DOM/recurso observado, viewport, editor/storefront, guardado/recarga, evidencia y responsable. Ejecutar las tres familias anteriores en los tres presets de Sartorial a 375 y 1280 px, con dos valores válidos contrastados y una condición sin override donde aplique. Añadir/duplicar/reordenar/eliminar el componente, seleccionar su bloque, guardar y reabrir: no basta con que el control exista en el schema.

Aceptación propuesta: todos los escenarios declarados muestran el cambio esperado en preview y storefront tras guardar; las excepciones de herencia/móvil están descritas de manera comprensible; no hay IDs duplicados, errores propios, pérdida de ajustes ni diferencias no deseadas entre instancias. Si falla uno, registrar su consumidor y una corrección de alcance cerrado antes de proponer más features. Si la prueba requiere modificar default, IDs, select options o un esquema, sigue siendo Nivel 2 y necesita directiva explícita de Gemini. La evidencia de diferenciación se produce aparte con recorridos y composición por preset; no se deduce de la cantidad de controles.

**Evidencia de terminal del addendum.** Se ejecutaron `rg -n` de IDs/consumidores y `nl -ba` sobre los archivos citados. Extractos de salida:

```text
Sartorial/assets/base.css (rg -n):
226:  font-family: var(--font-heading-family);
228:  font-weight: var(--font-heading-weight);

Sartorial/sections/lookbook.liquid (nl -ba):
    42                  media="(max-width: 47.99rem)"
    75              assign hp_mobile = block.settings.horizontal_position_mobile
    76              if hp_mobile == 0
    77                assign hp_mobile = block.settings.horizontal_position
   230      "default": "scheme-1"

Sartorial/assets/base.css (nl -ba):
  4579  @media (max-width: 47.99rem) {
  4581      left: clamp(24px, var(--hotspot-x-mobile, var(--hotspot-x)), calc(100% - 24px));

Contour/snippets/css-variables.liquid (nl -ba):
    29  assign heading_weight = heading_font.weight | at_most: 400 | at_least: 300
    63      --font-heading: {{ heading_font.family }}, {{ heading_font.fallback_families }};
    64      --font-heading-weight: {{ heading_weight }};

Contour/sections/frame-preview.liquid (nl -ba):
   182  @media (min-width: 990px) {
   184    .frmprev__inner--media-right .frmprev__stage { order: 2; }

Contour/assets/frame-preview.js (nl -ba):
    24      stage.style.setProperty('--fp-frame', input.getAttribute('data-fp-frame'));
    45  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
```

El inventario de presets se comprobó leyendo exclusivamente las claves `type_heading_font`, `heading_font`, `page_width`, `default_color_scheme` con Python `json.loads` (retirando antes el comentario inicial autogenerado en la copia de texto de Contour). Salida literal:

```text
Sartorial
Sartorial {'type_heading_font': 'libre_baskerville_n4', 'page_width': 1300, 'default_color_scheme': 'scheme-1'}
Imprint {'type_heading_font': 'assistant_n4', 'page_width': 1300, 'default_color_scheme': 'scheme-1'}
Archive {'type_heading_font': 'libre_baskerville_n4', 'page_width': 1300, 'default_color_scheme': 'scheme-1'}
Contour
Contour {'heading_font': 'ebgaramond_n4', 'page_width': 1200}
Annex {'heading_font': 'libre_baskerville_n4', 'page_width': 1320}
Maison {'heading_font': 'playfair_display_n4', 'page_width': 1180}
```

Las fuentes/configuración del preset sí apuntan al mismo mecanismo de render, pero este pase no comprueba el comportamiento de aplicar un preset sobre ajustes existentes. Esa operación forma parte de la matriz y de la instalación limpia; no se realiza sobre una tienda de comerciante para probar el plan.
