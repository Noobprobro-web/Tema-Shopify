ID: GPT-AUDIT-THREE-THEMES-INITIAL-002
Estado: AUDITORÍA INICIAL INDEPENDIENTE PARCIAL; NO CERTIFICADA
Decisión requerida: Johandry decide priorización y autoriza cualquier prueba o acción que lo requiera; Gemini coordina directivas.
Resumen en 5 líneas:
1. Sartorial se examinó desde un ZIP identificado; Contour desde una revisión fija; Cucuyo no estuvo disponible.
2. Se identificaron riesgos de variantes, suscripciones, carrito, contenido comercial y experiencia del comerciante, principalmente por análisis estático.
3. Los estilos presentan diferencias verificables en archivos; su calidad visual y diferenciación comercial requieren observación real.
4. Los flujos de compra, editor, accesibilidad y rendimiento no se certifican con esta revisión.
5. El precio de USD 380 permanece como hipótesis comercial pendiente de evidencia comparable.
Archivos tocados: únicamente este informe, creado como archivo nuevo.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación ni modificación de contratos; alcance de observación limitado por acceso.
Hallazgos extra fuera de alcance (con parche listo): ninguno; se proponen verificaciones, no parches ni directivas de implementación.
Verificación (comando, resultado y qué demuestra/qué no): ver sección Método y evidencia. Ninguna prueba demuestra compra real ni conformidad completa.
Lista de afirmaciones falsables numeradas: ver sección final.

# Auditoría inicial independiente de tres temas

Fecha: 2026-10-28. Esta revisión es nueva y conserva INITIAL-001. No se consultaron la auditoría inicial ni la maestra de Claude. Modelos informados por el coordinador: GPT-6.1 Terra en coordinación e inventario, GPT-6.1 Sol high en revisión técnica y editor, GPT-6 Astra high en revisión adversarial independiente. Los resultados de agentes se contrastaron con fragmentos originales del ZIP; las referencias remotas corresponden al SHA fijado. No se deben interpretar informes históricos del tablero como pruebas realizadas en esta ejecución.

## Identidad, método y límites

- **Sartorial:** `agent-comms/outbox-gpt/harness-GPT-PACKAGE-INTEGRATED-001-v4/isolated-theme/Sartorial-1.0.0.zip`. `Get-FileHash -Algorithm SHA256 <ZIP>` → `092242FBA56513B7F491821F5FBD86C5933A8550C33AE541F0FFB5DF801410E3`. Los archivos y líneas Sartorial citados son miembros de ese ZIP. Los presets presentes son Sartorial, Imprint y Archive.
- **Atelier de Sebas:** repositorio `SebastianDev017/atelier`, commit `1576d06b336abb6827084b7734faebbcb4d8f32f`; el producto se identifica como **Contour 4.1.0**, con presets Contour, Annex y Maison. [Identidad original](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/config/settings_schema.json#L3-L8). No es el tema gratuito Atelier de Shopify.
- **Cucuyo:** no disponible por ahora según Johandry. No evaluado; no se concluye que no exista.
- El checkout `Tema-Shopify-codex` tenía HEAD `09f834295074402d9b93aa8ead83a732d78e6608`; tres hashes de assets coincidieron con referencias informadas. Sus `git status` y `git diff` fallaron incluso con `GIT_OPTIONAL_LOCKS=0`, por lo que cambios adicionales y staging son desconocidos. No es la identidad del ZIP. El workspace de coordinación es otro checkout (`sprint/F0`, HEAD informado `b45e913…`).
- El 2026-10-28 01:03 UTC, según lectura API comunicada por coordinación, el tema MAIN 189832593651 tenía 84 rutas coincidentes con el ZIP: 83 MD5 coincidieron y `settings_data` difería; nueve listings quedaron excluidos. La equivalencia semántica de 24 JSON se comprobó en una auditoría anterior y no se repitió aquí. Esto no demuestra identidad byte a byte del conjunto, ni que las demos usen ese paquete.
- El agente técnico comparó ZIP y directorio aislado con Python `zipfile`/`hashlib`: salida `entries 107 mismatch []` (107 incluye directorios). `node --check` para `assets/theme.js` y `assets/product-zoom.js` devolvió exit 0 y salida vacía: solo sintaxis. Se inspeccionaron schemas, plantillas, Liquid, JS, CSS y documentación pertinente. La escritora comprobó directamente fragmentos originales en memoria con `zipfile`, sin extracción.
- Astra ejecutó funciones originales extraídas del ZIP con un fixture simulado: `current=4,min=2,max=5,step=2` → `next=5,validStep=false`. Para Contour simuló una respuesta HTTP 422 y observó `[{"rendered":"NaN"}]`. Son simulaciones dirigidas, no pruebas Shopify ni de red real.
- Demos inaccesibles por web en esta ejecución; una pantalla `/password` se observó en navegador en una fecha anterior, no como nueva verificación. No se ejecutaron instalación limpia, editor, Lighthouse, axe, compra, checkout, envío de formularios ni pruebas en móvil. No se crearon ni usaron metafields. Los sitios públicos de documentación y soporte no pudieron abrirse: eso no demuestra caída. No se evaluaron los cinco estados degenerados en tienda. No se modifican ni cierran filas del ledger.

## Marco y puntuaciones

Cada categoría se valora sobre 20: identidad visual y diferenciación; compra y conversión; personalización y editor; accesibilidad y robustez; rendimiento y preparación comercial. Para asignar un número comparable se requiere evidencia visual y funcional suficiente en cada preset; código o número de opciones por sí solos no alcanzan. **NE** significa no evaluado numéricamente, no cero. Confianza alta significa evidencia directa del código para lo descrito, no una probabilidad estadística ni un juicio sobre experiencia real.

| Tema / preset | Visual /20 | Compra /20 | Editor /20 | Accesibilidad /20 | Rendimiento y preparación /20 | Cobertura y confianza |
|---|---:|---:|---:|---:|---:|---|
| Sartorial / Sartorial | NE | NE | NE | NE | NE | Plantillas y código compartido inspeccionados; alta en estructura, baja en experiencia real |
| Sartorial / Imprint | NE | NE | NE | NE | NE | Plantillas y bloque técnico inspeccionados; alta en configuración, baja en experiencia real |
| Sartorial / Archive | NE | NE | NE | NE | NE | Plantillas y configuración inspeccionadas; alta en estructura, baja en experiencia real |
| Contour / Contour | NE | NE | NE | NE | NE | Código y plantillas fijados inspeccionados; alta en estructura, baja en experiencia real |
| Contour / Annex | NE | NE | NE | NE | NE | Código y plantillas fijados inspeccionados; alta en estructura, baja en experiencia real |
| Contour / Maison | NE | NE | NE | NE | NE | Código y plantillas fijados inspeccionados; alta en estructura, baja en experiencia real |
| Cucuyo / presets desconocidos | NE | NE | NE | NE | NE | Artefacto no disponible; sin base para asignar confianza o puntuación |

## Comparación verificable

Sartorial tiene 33 secciones Liquid, 20 añadibles con preset y 23 ajustes globales identificados; Contour tiene 60, 43 y 54 respectivamente, además de dos theme blocks. Sartorial tiene storefront EN/ES y schema EN; Contour storefront y schema EN/ES/DE/FR/IT. Los recuentos no miden facilidad, calidad ni conversión. El análisis de referencias de schema informó 718 ocurrencias y cero claves inglesas ausentes en Sartorial, 1478 y cero en Contour; no acredita traducción ni ejecución del editor.

Sartorial usa hero dividido 65/35 y PDP split; Imprint, 50/50, cuadrícula y especificaciones; Archive, hero cinematográfico y procedencia. Sartorial e Imprint comparten siete de ocho tipos de sección en home; los siete tipos de Archive aparecen también en Sartorial con diferente orden, contenido o configuración. Contour plantea showroom, Annex un darkroom y marcos, Maison proceso y cerámica; Contour y Annex comparten tres tipos de sección de home, Maison comparte dos con cada uno. Contour presenta mayor diferenciación estructural interna en estas plantillas; no demuestra originalidad frente al mercado ni suficiencia de diferenciación comercial. Evidencia Sartorial: `config/settings_data.json:81–311`, `listings/{sartorial,imprint,archive}/templates/{index,product}.json`. Evidencia Contour: [settings](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/config/settings_data.json#L130-L439), [Contour home](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/listings/contour/templates/index.json#L311-L320), [Annex home](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/listings/annex/templates/index.json#L343-L353), [Maison home](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/listings/maison/templates/index.json#L401-L411).

Sartorial incluye configuraciones de diseño, planes de compra, recomendaciones, protección de envío simultáneo y zoom con diálogo y manejo de foco; Contour añade controles tipográficos amplios, sidebar y quick-buy. Son capacidades de código, no pruebas de funcionamiento. Sartorial explica en ayudas que umbrales y regalos no configuran tarifas ni descuentos reales; ambas experiencias requieren pruebas reales de instalación y configuración.

## Hallazgos priorizados

Los hallazgos tienen estado **código confirmado**, **simulado** o **hipótesis pendiente de reproducción**. P1 indica riesgo comercial prioritario, no un rechazo confirmado de Shopify. Salvo indicación, aplican a los tres presets del tema si se utiliza la función compartida. Propietario propuesto de resolución: Gemini para coordinar directiva y Claude para implementación; GPT verifica independientemente. No se autoriza cambio por este documento.

### S-01 — P1 — Variante sin JavaScript (Sartorial, tres presets; producto principal y destacado)

Condición: producto con dos variantes comprables y JS desactivado. Pasos: cargar A, seleccionar visualmente B y examinar el formulario antes de enviar. Radios fuera del formulario y sin atributo `form`: `sections/main-product.liquid:238–248`, `featured-product.liquid:136–146`; formulario y `id` inicial en `main-product.liquid:472–477` y `featured-product.liquid:220–226`. `assets/theme.js:838–844` sincroniza ID. **Estado:** mecanismo confirmado en código, compra no enviada. **Impacto:** el ID puede permanecer en A mientras se muestra B. **Recomendación:** reproducir con PDP y destacado, carrito página/drawer y establecer fallback que envíe la selección real. Límite: sin transacción real.

### S-02 — P1 provisional — Dos valores de selling_plan (Sartorial, tres presets; producto con planes)

Condición: JS activo y plan seleccionado diferente del valor inicial. Pasos: elegir plan y examinar `new FormData(form).getAll('selling_plan')`. `main-product.liquid:565–599`, `featured-product.liquid:313–347` incluyen hidden y select; `base.css:5653–5655` solo oculta fallback, `theme.js:771–780` habilita hidden y `:2561` crea FormData. **Estado:** duplicación de controles sustentada en código y contrastada independientemente; efecto final no verificado. **Impacto:** valores contradictorios podrían afectar selección o precio; no se afirma cuál interpreta Shopify. **Recomendación:** reproducir payload y resultado en entorno de prueba autorizado, incluyendo checkout acelerado; garantizar un único valor activo.

### S-03 — P1 — Especificaciones inferidas por handle (Sartorial, especialmente Imprint)

Condición: producto sin datos de material/hardware y handle que contiene `paperweight` o `brass`. Pasos: usar fixture de vidrio con handle `glass-paperweight` y bloque técnico. `snippets/product-technical-specs.liquid:47–54,67–70` infiere “Solid milled brass” y “Precision machined”; Imprint incluye bloque en `listings/imprint/templates/product.json:71–89`. **Estado:** rama confirmada por código, producto real no comprobado. **Impacto:** atribución material y fabricación no sustentada. **Recomendación:** mostrar datos explícitos o dejar vacío; verificar contenido del comerciante. No crear ni usar metafields durante esta auditoría.

### S-04 — P2 — Cantidad inválida por límite superior (Sartorial, tres presets)

Condición: min 2, incremento 2, máximo 5. Pasos: desde 4 pulsar incremento; `assets/theme.js:5750–5756` limita a máximo; `:1007–1013` puede establecer máximo por inventario. **Estado:** función original simulada produjo `next=5, validStep=false`; no reproducido en Shopify. **Impacto:** interfaz puede proponer cantidad que no cumple incremento. **Recomendación:** fixture con reglas escalonadas e inventario limitado, ajustar máximo al valor válido alcanzable.

### S-05 — P2 — Menú móvil oculto conserva bloqueo (Sartorial, tres presets)

Condición: menú abierto a 390 px y ancho cambia a 1280 px. `assets/base.css:4389–4396` oculta menú a 62rem; `assets/theme.js:275–299,336–360` gestiona apertura e inert sin escucha de breakpoint; `base.css:142–144` bloquea scroll. **Estado:** interacción inferida de código, no reproducida en navegador. **Impacto:** contenido podría quedar inerte y sin scroll. **Recomendación:** probar cambio de orientación, zoom y teclado; cerrar y restaurar estado al cruzar breakpoint.

### S-06 — P2 — Nota sin guardar al ir a carrito (Sartorial, tres presets)

Condición: drawer abierto con nota nueva. Pasos: editar nota y pulsar View cart. `sections/cart-drawer.liquid:318,366–368`; `assets/theme.js:2322–2326` marca borrador; guardado previo cubre enlaces cross-sell `:2408–2414,2973–3025`. **Estado:** flujo de código; persistencia real pendiente. **Impacto:** posible pérdida de instrucciones. **Recomendación:** probar navegación y guardar o advertir antes de abandonar; no atribuir esta pérdida al checkout normal sin prueba.

### S-07 — P2 — Respuesta incierta al añadir (Sartorial, tres presets)

Condición: servidor acepta POST pero respuesta se pierde con drawer cerrado. `assets/theme.js:2565–2582,2611–2620,3286`; mensaje `locales/en.default.json:80` invita a reintentar. **Estado:** diferencia de manejo en código; escenario de red no reproducido. **Impacto:** reintento puede añadir cantidad dos veces; no implica cobro duplicado. **Recomendación:** simular respuesta perdida y reconciliar carrito antes de sugerir reintento.

### S-08 — P2 — Anuncio de agotado ambiguo (Sartorial, tres presets)

Condición: combinación existente agotada entre opciones globalmente alcanzables. `assets/theme.js:814–815,1056–1064` prioriza mensaje de opción de compra no disponible sobre sold out; botón en `:855–856`. **Estado:** rama lógica confirmada; lector de pantalla no probado. **Impacto:** explicación accesible potencialmente confusa. **Recomendación:** probar fixture cruzado con lector y priorizar causa correcta.

### C-01 — P1 — Confirmación de Notify me oculta (Contour, tres presets con bloque activo)

Condición: producto agotado y respuesta exitosa de formulario. Pasos propuestos: abrir aviso y enviar datos válidos en entorno autorizado; observar y escuchar confirmación. [notify-me.liquid:104–107](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/snippets/notify-me.liquid#L104-L107) sitúa éxito dentro de form; [theme.js:777–780](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/assets/theme.js#L777-L780) oculta form y muestra hijo. **Estado:** código confirmado; no se envió formulario. **Impacto:** confirmación puede permanecer oculta por ancestro. **Recomendación:** separar confirmación del formulario y verificar anuncio accesible.

### C-02 — P2 — Aviso de reposición depende de proceso no documentado (Contour, tres presets con Notify me)

[Formulario de contacto](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/snippets/notify-me.liquid#L55-L69), [promesa por defecto](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/sections/main-product.liquid#L789-L825). **Estado:** dependencia no documentada en código inspeccionado; automatizaciones externas no evaluadas. **Impacto:** el comerciante puede creer que el aviso se envía automáticamente. **Pasos:** revisar flujo de alta y reabastecimiento con autorización. **Recomendación:** explicar gestión manual, app o automatización necesaria. No se afirma que una tienda concreta carezca de ella.

### C-03 — P2 — Respuesta 422 tratada como carrito válido (Contour, drawer y página)

Condición: cambio rechazado por stock o regla de cantidad. [assets/cart.js](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/assets/cart.js) `:33–38,152–163,296–310` no comprueba `res.ok` en el recorrido auditado; `:20–24` procesa contador. **Estado:** funciones originales con 422 simulado produjeron `[{"rendered":"NaN"}]`; sin respuesta real. **Impacto:** contador inválido y error no comunicado. **Recomendación:** probar rechazo real en fixture y tratar respuesta antes de renderizar.

### C-04 — P2 — Reglas de cantidad no reflejadas en PDP (Contour, presets con PDP común)

[main-product.liquid:200–222](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/sections/main-product.liquid#L200-L222) presenta mínimo 1 y `novalidate`; [product.js](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/assets/product.js) `:62–104,134–159` actualiza variante sin reglas inspeccionadas. **Estado:** código confirmado en PDP; no ejecución. **Condición y pasos:** producto con mínimo/incremento mayores a uno; cambiar variante y examinar control. **Impacto:** interfaz incompatible con regla, sujeta al rechazo servidor. **Recomendación:** reflejar reglas y probar escenarios B2B; no extender conclusión a otras superficies.

### C-05 — P2 — Umbral de envío insuficientemente explicado (Contour, tres presets si activo)

[Ayuda de schema](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/locales/en.default.schema.json#L4858-L4860), [claim](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/snippets/free-shipping-claim.liquid#L25-L30). **Condición:** umbral del tema distinto de tarifas reales. **Estado:** código/documentación; checkout no probado. **Impacto:** promesa comercial puede no coincidir con checkout. **Pasos:** comparar umbral y tarifas en tienda de prueba autorizada. **Recomendación:** indicar claramente que el ajuste no configura tarifas.

### D-01 — P2 — Documentación de instalación y presets incompleta (ambos temas)

Sartorial `templates/page.documentation.json:26,75,142` explica cambio de estilo pero no reproducción completa de composiciones listing ni setup de datos especializados. Contour [docs/index.html:68–85,98–110](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/docs/index.html#L68-L110) presenta demos/órdenes que no explican plenamente instalación y divergen de órdenes actuales. **Estado:** confirmado en archivos inspeccionados; documentación web externa no evaluada. **Impacto:** instalación puede no parecerse a demo. **Pasos:** instalación limpia de cada listing y tareas de comerciante. **Recomendación:** guía con catálogo, medios, dependencias y diferencia entre cambiar estilo y aplicar plantillas.

### D-02 — P2 — Soporte interno de Sartorial puede dirigir al comerciante (Sartorial, todos)

`sections/main-support.liquid:9–10,114` y `templates/page.documentation.json:111`: la página instalada usa formulario de contacto de la tienda y se propone como soporte. **Estado:** plantilla confirmada; destinatario real no probado, URL externa no evaluada. **Impacto:** comprador del tema podría contactar al comerciante en lugar del desarrollador. **Pasos:** instalar y revisar destinatario sin enviar formulario. **Recomendación:** canal de soporte del desarrollador verificable y documentado.

### D-03 — P3 — Guía de tallas de ejemplo (Sartorial, bloque opcional)

`sections/main-product.liquid:947,965,971` incluye medidas y modelo concretos. **Condición:** comerciante agrega bloque sin personalizar. **Estado:** defaults confirmados; no probado en editor. **Impacto:** datos orientativos podrían parecer específicos del producto. **Pasos:** añadir bloque a producto de otras medidas. **Recomendación:** contenido vacío o claramente de ejemplo con ayuda.

## Valor de USD 380 y criterios oficiales

El precio es defendible como objetivo si la ejecución visual, edición y compra demuestran una experiencia premium y coherente en los tres estilos. El inventario y la arquitectura muestran base suficiente para investigarlo, pero los riesgos P1, la falta de demos accesibles y la ausencia de pruebas comparables impiden certificarlo o descartarlo. No hay evidencia de causa oficial de rechazo para Contour ni de una causa de rechazo comprobada para estos paquetes.

Shopify requiere diferenciación sustancial, presets y evaluación conforme a su proceso; sus referencias publicadas incluyen benchmark Lighthouse de rendimiento 60 y accesibilidad 90 bajo su metodología. Esos umbrales no son resultados de este informe. Véanse [requisitos](https://shopify.dev/docs/storefronts/themes/store/requirements), [envío](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme), [rechazos comunes](https://shopify.dev/docs/storefronts/themes/store/review-process/common-theme-rejections), [pruebas](https://shopify.dev/docs/storefronts/themes/store/test-theme) y [rendimiento](https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance). El ZIP carga CSS y JS globales (`layout/theme.liquid:54,95`); tamaños fuente informados 259143 y 248554 bytes son exposición, no medición de lentitud ni transferencia comprimida.

## Prioridades y afirmaciones falsables

1. Gemini coordina reproducir S-01/S-02 y C-01 en entornos de prueba apropiados; Johandry autoriza acciones externas necesarias. No enviar datos ni comprar sin autorización pertinente.
2. Reproducir S-03, S-04–S-08 y C-02–C-05 con fixtures y capturas; confirmar comportamiento y alcance antes de abrir directivas.
3. Instalar cada estilo en tienda limpia, recorrer editor, contenido faltante, catálogo vacío/uno/muchos/largo/faltante y móvil; comparar identidad y experiencia con mismos criterios.
4. Medir Lighthouse y axe bajo método documentado; revisar teclado, lectores, checkout, documentación y soporte. Contrastar identidad exacta de despliegue y demos con artefactos preservados.
5. Incorporar Cucuyo solo cuando el artefacto esté disponible; no producir clasificación global completa hasta entonces.

Afirmaciones falsables: (1) el SHA del ZIP es el declarado arriba; (2) el hidden de variante se actualiza mediante JS en las líneas citadas; (3) el fallback de plan permanece en el formulario y CSS lo oculta; (4) las ramas de especificaciones citadas usan términos del handle; (5) el fixture de cantidad y 422 produjo las salidas registradas; (6) las composiciones y archivos de presets se encuentran en las rutas indicadas; (7) ningún resultado aquí demuestra una compra real, puntuación Lighthouse/axe, conformidad total ni identidad de demos.

## Complemento: contraste adicional de Contour y precisión temporal

La fijación de HEAD y hashes del checkout `Tema-Shopify-codex` indicada arriba procede del **27 de octubre**, no de una revalidación completa del árbol el 28. El resultado del 28 de octubre de 01:03 UTC corresponde a los hashes del tema MAIN, con los límites ya descritos. Dos cuerpos remotos se ofrecieron mediante URL temporal no descargada: la coincidencia MD5 es evidencia de hashes y no comparación directa de esos cuerpos.

### C-06 — P1 — Promesas predeterminadas de políticas (Contour, plantilla de producto)

La [plantilla de producto:39–57,68–72](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/templates/product.json#L39-L72) precarga referencias a devolución de 30 días y fabricación bajo pedido; [trust-badges.liquid:27–33](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/snippets/trust-badges.liquid#L27-L33) usa fallback `default`. **Condición:** políticas reales distintas y bloques activos. **Pasos:** aplicar plantilla a fixture y vaciar etiquetas, comprobar texto final. **Estado:** código inspeccionado, impacto y render pendientes. **Impacto:** una promesa puede no reflejar políticas reales. **Recomendación:** revisar defaults y permitir retirar promesas de modo inequívoco; propietario Gemini/Claude, verificación GPT.

### C-07 — P2 — Consentimiento de aviso y marketing (Contour, Notify me)

[notify-me.liquid:86–96](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/snippets/notify-me.liquid#L86-L96) presenta el consentimiento para el aviso mediante `accepts_marketing` obligatorio. **Condición:** visitante solicita aviso de reposición. **Estado:** código observado, flujo y configuración reales no evaluados. **Impacto:** el propósito del aviso y la suscripción de marketing pueden confundirse. **Pasos:** revisar copia, payload y flujo de extremo a extremo en entorno autorizado sin enviar datos reales. **Recomendación:** clarificar propósito y separar consentimiento de marketing cuando corresponda; análisis legal y comportamiento Shopify pendientes. Propietario Gemini/Claude; Johandry decide política comercial.

### C-08 — P2 — Afirmación de accesibilidad requiere medición (Contour, documentación)

[docs/index.html:191–196](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/docs/index.html#L191-L196) afirma WCAG 2.2 AA y controles de 44 × 44; [main-product.liquid:528–529](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/sections/main-product.liquid#L528-L529) define botón de cantidad de 40 px de ancho. **Estado:** textos y regla estáticos; caja efectiva y conformidad no medidas. **Condición y pasos:** inspeccionar tamaño efectivo, separación y teclado en navegador. **Impacto:** la afirmación universal no queda sustentada por esta evidencia. **Recomendación:** ajustar documentación a resultados y realizar auditoría real; 40 px aislados no demuestran incumplimiento WCAG. Propietario Gemini/Claude, medición GPT.

El umbral de C-05 aparece activado a 150 en los tres estilos ([Contour](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/config/settings_data.json#L150-L153), [Annex](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/config/settings_data.json#L253-L256), [Maison](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/config/settings_data.json#L356-L359)); las tarifas y destinos reales no se verificaron. Además del 422 simulado de C-03, examinar en pruebas autorizadas las rutas de nota y bundle que silencian errores en `assets/cart.js:102–107,331–351`; no generalizar al add principal, que sí contempla error en `:196–227`.

## Anexo de precisión metodológica y matriz completa

Este anexo prevalece sobre las etiquetas incompletas del cuerpo cuando exista diferencia. No introduce nuevas pruebas; completa la descripción de la evidencia y conserva la calificación **NE** como no evaluada numéricamente, no como cero. No se calcula total con categorías sin evidencia suficiente.

### Categorías, cobertura y confianza por preset

Clave: **E** = revisión estática del código, schemas y plantillas del preset y/o código compartido, con confianza alta para los hechos puntuales citados y sin inferir ejecución; **T** = observación en tienda durante esta revisión, no realizada, por lo que la confianza sobre comportamiento o aspecto real es no evaluable. Cobertura E es parcial, dirigida y desigual entre superficies; no supone auditoría exhaustiva de todo el código. En Cucuyo no hubo artefacto disponible, de modo que ni E ni T se evaluaron. En todas las celdas la puntuación sobre 20 es NE.

| Tema / preset | Diseño y percepción de valor /20 | Compra, merchandising y conversión /20 | Móvil y accesibilidad /20 | Configuración y experiencia del comerciante /20 | Rendimiento y calidad funcional /20 |
|---|---|---|---|---|---|
| Sartorial / Sartorial | NE; E: estructura/configuración; T: no; confianza E alta, T no evaluable | NE; E: flujos compartidos y plantilla; T: no; confianza E alta, T no evaluable | NE; E: mecanismos y CSS dirigidos; T: no; confianza E alta, T no evaluable | NE; E: schema/plantillas y documentación; T: no; confianza E alta, T no evaluable | NE; E: código y sintaxis dirigidos; T: no; confianza E alta, T no evaluable |
| Sartorial / Imprint | NE; E: estructura/configuración; T: no; confianza E alta, T no evaluable | NE; E: flujos compartidos y bloque técnico; T: no; confianza E alta, T no evaluable | NE; E: mecanismos y CSS dirigidos; T: no; confianza E alta, T no evaluable | NE; E: schema/plantillas y documentación; T: no; confianza E alta, T no evaluable | NE; E: código y sintaxis dirigidos; T: no; confianza E alta, T no evaluable |
| Sartorial / Archive | NE; E: estructura/configuración; T: no; confianza E alta, T no evaluable | NE; E: flujos compartidos y procedencia; T: no; confianza E alta, T no evaluable | NE; E: mecanismos y CSS dirigidos; T: no; confianza E alta, T no evaluable | NE; E: schema/plantillas y documentación; T: no; confianza E alta, T no evaluable | NE; E: código y sintaxis dirigidos; T: no; confianza E alta, T no evaluable |
| Contour / Contour | NE; E: estructura/configuración; T: no; confianza E alta, T no evaluable | NE; E: PDP, carrito y plantilla dirigidos; T: no; confianza E alta, T no evaluable | NE; E: mecanismos y CSS dirigidos; T: no; confianza E alta, T no evaluable | NE; E: schema/plantillas y documentación; T: no; confianza E alta, T no evaluable | NE; E: código y simulación dirigida; T: no; confianza E alta, T no evaluable |
| Contour / Annex | NE; E: estructura/configuración; T: no; confianza E alta, T no evaluable | NE; E: PDP, carrito y plantilla dirigidos; T: no; confianza E alta, T no evaluable | NE; E: mecanismos y CSS dirigidos; T: no; confianza E alta, T no evaluable | NE; E: schema/plantillas y documentación; T: no; confianza E alta, T no evaluable | NE; E: código y simulación dirigida; T: no; confianza E alta, T no evaluable |
| Contour / Maison | NE; E: estructura/configuración; T: no; confianza E alta, T no evaluable | NE; E: PDP, carrito y plantilla dirigidos; T: no; confianza E alta, T no evaluable | NE; E: mecanismos y CSS dirigidos; T: no; confianza E alta, T no evaluable | NE; E: schema/plantillas y documentación; T: no; confianza E alta, T no evaluable | NE; E: código y simulación dirigida; T: no; confianza E alta, T no evaluable |
| Cucuyo / no disponible | NE; E y T no disponibles; confianza no evaluable | NE; E y T no disponibles; confianza no evaluable | NE; E y T no disponibles; confianza no evaluable | NE; E y T no disponibles; confianza no evaluable | NE; E y T no disponibles; confianza no evaluable |

La confianza alta se refiere únicamente a la lectura estática puntual, no a los impactos hipotéticos ni a calidad visual, experiencia o rendimiento. La simulación dirigida no equivale a observación en tienda.

### Método de inventario y exclusiones

El inventario comunicado por el agente de editor contó archivos de secciones Liquid, secciones con al menos un `preset` en schema como añadibles, y ajustes globales con `id`, excluyendo definiciones de color anidadas. Contó por separado theme blocks, idiomas y referencias `t:` al schema inglés. El análisis fue estático sobre schemas y plantillas JSON de los dos artefactos fijados. Los números del cuerpo son resultados comunicados por el agente; **no se conservó en su informe el comando exacto ni la salida literal** que permitirían reproducir cada recuento aquí. Deben repetirse antes de utilizarlos como compuerta. Las sumas y conteos describen amplitud, no miden calidad, facilidad, accesibilidad, conversión ni valor comercial.

### Criterios de prioridad

- **P0:** bloqueo crítico demostrado, de alcance amplio o daño grave inmediato, que impide continuar una operación esencial o exige respuesta inmediata.
- **P1:** riesgo comercial, funcional o de confianza significativo, condicionado o demostrado, que merece reproducción y tratamiento prioritario antes de entrega.
- **P2:** defecto o riesgo relevante con alcance o condición delimitada; corregir tras P1 según evidencia e impacto.
- **P3:** mejora menor o riesgo acotado cuya resolución puede planificarse posteriormente.

**P0 confirmados: ninguno identificado en esta revisión y alcance parcial.** Esto no demuestra ausencia de P0, ni convierte hipótesis P1 en defectos reproducidos. La prioridad es juicio de triaje y debe actualizarse con reproducción y alcance real.

### Identidad y comandos conocidos

Checkout de auditoría: `C:\Users\Johan\Documents\Drive\Tema-Shopify-codex`, HEAD observado el 27 de octubre `09f834295074402d9b93aa8ead83a732d78e6608`. Sus tres hashes SHA-256 reportados son:

| Ruta relativa al checkout de auditoría | SHA-256 |
|---|---|
| `assets/base.css` | `5d9ed6b2981f115d9fca06406a47a6ff784e63023883ea1e88f49ec84429af43` |
| `assets/theme.js` | `861fe0d606dbaa790f827e3d01cf89b431bdb630064a612608f50accc03aa8f7` |
| `assets/product-zoom.js` | `4828d5a15471330e4d82f52bd16016c3ef1e71e2f53d275e9dc3cab28aa6c246` |

El agente informó que `git status` y `git diff` fallaron, también con `GIT_OPTIONAL_LOCKS=0` y variantes que indicaban worktree/git-dir; error literal: `this operation must be run in a work tree`. **La línea de comandos exacta de esas variantes no fue conservada** en el informe recibido. Estado staged y cambios adicionales desconocidos. El workspace de coordinación `C:\Users\Johan\Documents\Drive\Tema Shopify` es otro checkout, cuyo HEAD `b45e913…` fue informado; no debe atribuirse al checkout de auditoría ni al ZIP.

ZIP fijado: `C:\Users\Johan\Documents\Drive\Tema Shopify\agent-comms\outbox-gpt\harness-GPT-PACKAGE-INTEGRATED-001-v4\isolated-theme\Sartorial-1.0.0.zip`, SHA-256 `092242fba56513b7f491821f5fbd86c5933a8550c33ae541f0ffb5df801410e3`. La identidad del ZIP, checkout, tema MAIN y demos son observaciones distintas.

### Asignación de modelos

El coordinador confirmó que **editor_v2 empleó GPT-6.1 Sol con razonamiento high**; la revisión técnica también usó GPT-6.1 Sol high. La revisión adversarial independiente empleó **GPT-6 Astra high** y la coordinación/inventario, **GPT-6.1 Terra**. No se atribuye al modelo la verificación de hechos que no conste en su informe.
