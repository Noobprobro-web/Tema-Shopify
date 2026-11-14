ID: GPT-AUDIT-THREE-THEMES-MASTER-001
Estado: MAESTRO DE CONTRASTE PARCIAL; SIN CERTIFICACIÓN EN TIENDA
Decisión requerida: ninguna ejecución autorizada por este documento; Johandry recibe el contraste. El cierre conjunto y el plan quedan pendientes de que comparta ambas auditorías maestras.
Resumen en 5 líneas:
1. Se cruzan exclusivamente las dos auditorías iniciales identificadas, preservando sus desacuerdos y contrastando código mediante especialistas.
2. Sartorial y Contour permiten comprobaciones estáticas sobre artefactos fijados; Cucuyo no tiene un original disponible para verificación independiente.
3. No se confirma un P0: la ausencia de demos dentro del ZIP no demuestra su inexistencia; hay riesgos de código que impiden afirmar que solo falta documentación.
4. La amplitud del editor de Contour es mayor; su calidad visual, la superioridad comercial global y la justificación de USD 380 siguen sin demostrarse.
5. Se registran los 99 IDs de Claude, resultados por tema cuando corresponde y causas adicionales GPT; no se generan plan ni dictamen final conjunto.
Archivos tocados: únicamente agent-comms/outbox-gpt/GPT-AUDIT-THREE-THEMES-MASTER-001.md, creado nuevo.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación. No se modifican contratos, código, tiendas, datos, Git ni ledger.
Hallazgos extra fuera de alcance (con parche listo): ninguno; no se preparan parches.
Verificación (comando, resultado y qué demuestra/qué no): procedencia y comprobaciones delegadas detalladas en §2; ninguna acredita compra, aspecto visual, conformidad completa ni identidad de demos.
Lista de afirmaciones falsables numeradas: §10.

# Maestro independiente de contraste de tres temas

Fecha: 2026-10-28, America/Caracas. Esta es la etapa de contraste entre auditorías iniciales. No es una auditoría final compartida ni un plan de implementación. No se leyó la auditoría maestra de Claude, ni se sustituyen o sobrescriben las iniciales.

## 1. Resultado y desacuerdos principales

La auditoría de Claude aporta un inventario amplio y límites explícitos. Sus 99 IDs mezclan hechos de código, resultados sintéticos, riesgos, recomendaciones e información. No equivalen a 99 defectos independientes comprobados. Nuestro contraste confirma varios mecanismos, limita generalizaciones y refuta subafirmaciones concretas; no invalida en bloque la auditoría.

| Conclusión o lectura | Dictamen de este maestro | Evidencia y límite |
|---|---|---|
| «Shopify más mira la personalización» | No sustentada como regla única ni como cita literal de Claude | Claude inicial §3.3 distingue personalización de unicidad. Shopify exige experiencia global y diferenciación; añadir ajustes o secciones por sí solo no basta. |
| «Sartorial solo necesita demos/documentación y ningún cambio de código» | Refutado como afirmación absoluta | El propio Claude reconoce TT-02, TT-03 y otros riesgos en §7 y §9. GPT agrega selección sin JS, planes de venta y otros mecanismos. El comportamiento final sigue pendiente de reproducción. |
| TT-01 demuestra un P0 por inexistencia de demos | Parcial; P0 no confirmado | No hay referencias suficientes en el paquete, pero no se verificó la inexistencia de demos externas ni su preparación actual. |
| Sartorial es mejor tienda; Contour, mejor herramienta | Parcial como síntesis de cobertura estática; no demostrado como experiencia global | Sartorial incluye más mecanismos comerciales defensivos; se detectaron fallos potenciales en ellos. Contour tiene más superficie de editor. No hubo compra, tareas de comerciante ni observación visual comparable. |
| Contour fue rechazado por poca personalización/innovación | No verificable | No se dispone de comunicación de Shopify. Claude tampoco presenta esa causa como hecho. |
| El código de Sartorial es original porque no aparecen huellas de Dawn | No verificable como certificación de procedencia | Ausencia de patrones buscados y nombres compartidos no prueban ni refutan originalidad integral. Lo mismo se aplica a comentarios Dawn en Contour. |
| Archive inventa una época automáticamente | Refutado en esa formulación | El listing fija circa_year vacío; la salida depende de datos y configuración. Sí está confirmada la inferencia de material/fabricación por handle en el snippet técnico de Imprint. |
| El error de Contour muestra necesariamente «NaN» visible | Refutado como salida visible general | El contador puede recibir NaN, pero la clase is-empty lo oculta. Error silencioso y estado accesible desactualizado siguen siendo riesgos del código. |
| /cart/change.js devuelve 422 por exceso de stock | No demostrado | El fixture GPT fue simulado. Se conserva el problema general de no comprobar respuesta; no se atribuye al servidor una respuesta no observada. |
| GSAP impide vender un tema comercial | Refutado como conclusión automática | La licencia permite uso comercial; la aplicabilidad a una herramienta concreta requiere revisar sus términos. No se declara infracción ni dictamen legal. |
| Las puntuaciones provisionales de Claude permiten clasificar los tres temas | No sustentado como clasificación final | No son métricas Shopify ni hubo runtime. Se preservan como opinión estática del autor; este maestro mantiene NE y no calcula total. |
| Fable hizo exactamente 29 cambios en esta inicial | No verificable | La inicial declara ocho cambios requeridos y siete mejoras opcionales. No demuestra ni refuta 29 cambios en otro documento no disponible. |
| USD 380 es un precio permitido y ya justificado | Primera parte confirmada; segunda no verificada | La regla permite USD 100–500 en incrementos de 10. Precio permitido no demuestra propuesta de valor ni aceptación. |
| Cucuyo puede clasificarse a partir del informe Claude | No verificable independientemente | Sin código, clon, ZIP ni scratchpads originales accesibles para este cruce. No se traslada su puntuación a una clasificación propia. |

Marco oficial vigente consultado por el especialista: [unicidad](https://shopify.dev/docs/storefronts/themes/store/requirements#2-uniqueness-from-other-themes), [requisitos](https://shopify.dev/docs/storefronts/themes/store/requirements), [precio](https://shopify.dev/docs/storefronts/themes/store/review-process/listings#theme-price), [propuesta de valor](https://shopify.dev/docs/storefronts/themes/store/review-process/listings#theme-price-and-value-proposition), [rechazos comunes](https://shopify.dev/docs/storefronts/themes/store/review-process/common-theme-rejections) y [checklist](https://shopify.dev/docs/storefronts/themes/store/test-theme/checklist). Ninguno constituye un resultado de prueba de estos temas.

## 2. Identidades, procedencia y método

### Fuentes iniciales

| Fuente | SHA-256 revalidado | Alcance |
|---|---|---|
| agent-comms/outbox-claude/CLAUDE-AUDIT-THREE-THEMES-INITIAL-001.md | d31ced8363b57605d3d7fd5e127f379f7f65215c6c5ca4e1a27bc23a60d88284 | Inicial de Claude, fechada 2026-10-27; 99 IDs TT-01 a TT-99 |
| agent-comms/outbox-gpt/GPT-AUDIT-THREE-THEMES-INITIAL-002.md | 98de427290db164567fed40c15e527d861c0992643eaeb5ef95429d0135f7b68 | Inicial GPT independiente, fechada 2026-10-28 |

El hash Claude coincide con el prefijo/sufijo facilitados al coordinador; no se recibió un hash completo anterior con el cual certificar igualdad completa histórica. El recuento del documento Claude se repitió: P0=1, P1=9, P2=43, P3=46; total=99 IDs. Son las prioridades declaradas por Claude, no el conteo de severidades confirmadas por este maestro.

### Artefactos y fronteras de identidad

- **Sartorial 1.0.0:** ZIP integrado agent-comms/outbox-gpt/harness-GPT-PACKAGE-INTEGRATED-001-v4/isolated-theme/Sartorial-1.0.0.zip; SHA-256 092242fba56513b7f491821f5fbd86c5933a8550c33ae541f0ffb5df801410e3; 347818 bytes, 107 entradas, incluidos directorios. Todas las referencias Sartorial de este documento corresponden a miembros de ese ZIP, no al checkout de coordinación.
- Un ZIP homónimo en la raíz tiene SHA-256 1dc246095fa630899c289da99eb80d81eedd34c4c5a863e2ef9db84857d8986a. No es el artefacto de este cruce.
- El checkout de auditoría C:/Users/Johan/Documents/Drive/Tema-Shopify-codex es distinto. HEAD 09f834295074402d9b93aa8ead83a732d78e6608 fue observado el 27 de octubre; en el cruce actual Git falló con Permission denied y no se revalidó HEAD, estado staged ni el árbol completo. Tres hashes de archivos y miembros ZIP sí coincidieron: base.css 5d9ed6b2981f115d9fca06406a47a6ff784e63023883ea1e88f49ec84429af43; theme.js 861fe0d606dbaa790f827e3d01cf89b431bdb630064a612608f50accc03aa8f7; product-zoom.js 4828d5a15471330e4d82f52bd16016c3ef1e71e2f53d275e9dc3cab28aa6c246. Tres coincidencias no prueban identidad integral del árbol.
- El workspace de coordinación C:/Users/Johan/Documents/Drive/Tema Shopify tiene rama sprint/F0. El preflight del escritor mostró archivos no rastreados preexistentes, sin cambios tracked listados. No se ha hecho commit, add, push, fetch ni modificación de Git.
- **Atelier de Sebas:** repositorio SebastianDev017/atelier, main fijado a 1576d06b336abb6827084b7734faebbcb4d8f32f, identidad de producto **Contour 4.1.0**. No es el tema gratuito Atelier de Shopify. Presets Contour, Annex y Maison presentes en main. La API del árbol devolvió truncated:false y 214 entradas. Los branches annex 183b488 y maison 16f00f7 y su igualdad histórica son afirmaciones de la inicial Claude, no una nueva comparación de esas ramas.
- **Cucuyo:** Claude declara clon /home/claude/themes/cucuyo y revisión abreviada 727c0d4. Ese original y sus scratchpads no están disponibles. Las consultas actuales al repositorio/commit devolvieron 404; no prueban inexistencia ni permiten determinar visibilidad, autorización o contenido. El supuesto cambio de visibilidad queda como interpretación histórica de Claude.
- La lectura de hashes del tema MAIN 189832593651 citada en INITIAL-002 es evidencia previa diferenciada: 84 rutas, 83 MD5 coincidentes y settings_data distinto, nueve listings excluidos. No se repitió aquí ni prueba identidad de demos o paridad byte a byte del conjunto.

### Organización y pruebas

La coordinación recibió informes separados de procedencia, contraste Sartorial, contraste Contour/Cucuyo y criterios adversariales. Los especialistas verificaron los originales disponibles; la redacción usa esos informes y las dos iniciales. Coordinación: GPT-6.1 Terra. Cruces Sartorial y criterios: GPT-6 Astra high. Cruce Contour/Cucuyo, procedencia y redacción de este maestro: GPT-6.1 Sol high. Estas asignaciones fueron confirmadas por el coordinador. No se atribuyen pruebas no ejecutadas al modelo.

Preflight del escritor: git status --short --branch → rama sprint/F0 y archivos no rastreados existentes; Test-Path del destino → False. Se consultaron AGENTS.md, BOARD.md en lectura y RULES.md. El resultado de lectura conjunta de BOARD fue truncado; se continuó por bloques. Las fuentes iniciales se leyeron con Get-Content y el registro de IDs se localizó con rg -n '^#### TT-'. No se leyó el maestro Claude.

Los especialistas comunicaron Get-FileHash/medición de archivos, zipfile/hashlib, lectura de miembros y fuentes GitHub fijadas. Los hashes de procedencia y el conteo 99 se conservaron en sus informes al coordinador. Las comprobaciones originales de INITIAL-002 incluyen entries 107 mismatch [], sintaxis node --check exit 0 y simulaciones next=5,validStep=false y rendered=NaN. No se reejecutaron esas simulaciones en esta fase. La simulación 422 no representa una respuesta Shopify observada.

No hubo demos, editor, compra, checkout, envío de formularios, Lighthouse, axe ni tecnología asistiva en este cruce. No se recorrieron los cinco estados degenerados en tienda. No se crearon ni usaron las siete definiciones de metafields propuestas. Leer código que ya referencia datos no implica crearlos, poblarlos o aprobarlos.

## 3. Estados y prioridades

**Confirmado** significa que se verificó la afirmación delimitada con el original disponible. No implica funcionamiento en tienda. **Parcial** significa que hay un núcleo confirmado y una extensión sin demostrar o refutada. **Refutado** se aplica a una afirmación concreta contradicha por la fuente. **No verificable** indica que faltó el original, la ejecución o el medio requerido; no significa falso.

Para priorizar se aplica el mismo criterio a ambos candidatos:

- **P0:** daño grave inmediato o bloqueo esencial demostrado y de alcance amplio. No se confirma ninguno en esta revisión parcial; tampoco se demuestra ausencia de P0.
- **P1:** riesgo significativo de compra, accesibilidad o confianza, con mecanismo concreto. Puede permanecer condicionado a una configuración o a reproducción.
- **P2:** riesgo relevante acotado, inconsistencia documental o dependencia que requiere tratamiento según impacto.
- **P3:** higiene, mantenibilidad, mejora menor o información. Si el contenido afecta materialmente una promesa al comprador, no se rebaja por pertenecer a una marca concreta.

Las prioridades propuestas son triaje, no severidades observadas ni motivos de rechazo. El criterio P0 de Claude incluye un requisito de envío faltante; el nuestro exige demostrar que realmente falta y bloquea. Esa diferencia explica TT-01.

## 4. Cobertura simétrica por tema y preset

**NE** = no evaluado numéricamente, no cero. **E** = evidencia estática dirigida de estructura/código y/o configuración del preset; **T** = observación real, no realizada. Confianza alta E solo para los hechos puntuales contrastados; cobertura parcial y desigual. En todas las celdas con E, la confianza de experiencia T es no evaluable. No se suman puntuaciones.

| Tema / preset | Diseño y percepción de valor /20 | Compra, merchandising y conversión /20 | Móvil y accesibilidad /20 | Configuración y experiencia del comerciante /20 | Rendimiento y calidad funcional /20 |
|---|---|---|---|---|---|
| Sartorial / Sartorial | NE; E estructura/config.; T no; E alta puntual | NE; E formularios/carrito; T no; E alta puntual | NE; E CSS/foco dirigido; T no; E alta puntual | NE; E schemas/listings/docs; T no; E alta puntual | NE; E código/sintaxis; T no; E alta puntual |
| Sartorial / Imprint | NE; E estructura/config.; T no; E alta puntual | NE; E común + técnico; T no; E alta puntual | NE; E foco calculado/CSS; T no; E alta puntual | NE; E schemas/listings/docs; T no; E alta puntual | NE; E código/sintaxis; T no; E alta puntual |
| Sartorial / Archive | NE; E estructura/config.; T no; E alta puntual | NE; E común + procedencia; T no; E alta puntual | NE; E foco calculado/CSS; T no; E alta puntual | NE; E schemas/listings/docs; T no; E alta puntual | NE; E código/sintaxis; T no; E alta puntual |
| Contour / Contour | NE; E estructura/config.; T no; E alta puntual | NE; E PDP/carrito/aviso; T no; E alta puntual | NE; E mecanismos/CSS; T no; E alta puntual | NE; E schemas/listings/docs; T no; E alta puntual | NE; E código/carga; T no; E alta puntual |
| Contour / Annex | NE; E main/listing; T no; E alta puntual | NE; E común en main; T no; E alta puntual | NE; E común/config.; T no; E alta puntual | NE; E main/listing; T no; E alta puntual | NE; E común en main; T no; E alta puntual |
| Contour / Maison | NE; E main/listing; T no; E alta puntual | NE; E común en main; T no; E alta puntual | NE; E común/config.; T no; E alta puntual | NE; E main/listing; T no; E alta puntual | NE; E común en main; T no; E alta puntual |
| Cucuyo / declarado Cucuyo | NE; E/T no disponibles; confianza no evaluable | NE; E/T no disponibles; confianza no evaluable | NE; E/T no disponibles; confianza no evaluable | NE; E/T no disponibles; confianza no evaluable | NE; E/T no disponibles; confianza no evaluable |

El alcance Annex/Maison se limita a lo presente en el SHA main fijado. No incluye afirmar identidad con branches, instalaciones o demos. Las notas provisionales de Claude se conservan en su inicial §5.2; no se adoptan ni recalculan sin evidencia adicional. Sus porcentajes de cobertura son estimaciones declaradas del autor, no mediciones de cobertura reproducidas aquí.

## 5. Registro individual de los 99 IDs

En las tablas, **S** remite a miembros del ZIP Sartorial fijado; **A** remite al repositorio Contour al SHA fijado; **C** remite únicamente a la declaración Claude, sin original disponible. Las líneas son las contrastadas por los especialistas. Las afirmaciones de render, efectos, daño, legalidad y rechazo requieren su propia evidencia aunque el mecanismo figure confirmado. Las fuentes A se abren bajo [este commit](https://github.com/SebastianDev017/atelier/tree/1576d06b336abb6827084b7734faebbcb4d8f32f); cada ruta relativa de la tabla pertenece a él.

### TT-01 a TT-33

| ID | Tema / resultado | Dictamen, evidencia y límite |
|---|---|---|
| TT-01 | S: Parcial | Ausencia de referencias/capturas en el ZIP; inexistencia externa no verificada. No P0 confirmado. |
| TT-02 | S: Parcial | base.css:9058,9102–9107,9126–9131 fija colores de foco; cálculos Imprint 1.334/1.134 y Archive 2.249–4.090. Header-group:20 es announcement; header real :48 scheme-1. Footer-group:9 scheme-2 y footer.liquid:59–71 aporta controles. Alcance de teclado/render pendiente; P1 condicionado Imprint, P2 Archive. |
| TT-03 | S: Parcial; inferencia material confirmada; época automática refutada | product-technical-specs:47–54,67–70 infiere latón/fabricación por brass/paperweight; Imprint product:71–89 activa bloque. product-provenance:30–36 depende de datos/título/tipo; Archive circa_year está vacío :75–78. Una sola causa con GPT S-03, no dos defectos. |
| TT-04 | S: Parcial | Código usa Imprint. Web con Edition observada por Claude el 27, no revalidada aquí. Inconsistencia histórica P2, estado publicado actual desconocido. |
| TT-05 | S: Parcial | settings_schema:5,7–8 confirma autor/URLs. Titularidad del dominio, buzón o GitHub y pérdida de tickets no demostradas. P1 solo si se confirma un canal ajeno/inoperante; no hecho probado. |
| TT-06 | S: Parcial | Header/tarjeta compartidos y escasas variantes estructurales de esos componentes. Calidad visual, necesidad de 2–3 layouts y efecto sobre rechazo no demostrados; P2 como riesgo de diferenciación. |
| TT-07 | A: Parcial | cart.js:33–38 sin res.ok; :152–163,296–310 trata item_count de respuesta errónea. :20–29 genera contador inválido y header:597 lo oculta. 422 previo fue simulado; no respuesta Shopify observada. P1 de mecanismo condicionado, no «NaN visible» universal. |
| TT-08 | A: Parcial | Colisiones Contour/Maison confirmadas en páginas oficiales y schema; aplicación exacta al envío y relación con rechazos pendientes. P1 de revisión condicionado, no motivo probado. |
| TT-09 | A: Parcial | DESIGN.md:17–21,50–55 y TOKENS.md:7–14,61–65 declaran extracción/referencia. Confirma la declaración documental; no copia de código, infracción, similitud visual medida ni causa de rechazo. |
| TT-10 | C: No verificable | Ausencia de @app declarada; original y editor no disponibles. No se adopta P1 confirmado. |
| TT-11 | C: No verificable | Botón vacío en current y popup activo declarados; sin código/render para confirmar. |
| TT-12 | S: Parcial; subafirmación gift card refutada | Tamaños y carga global en layout/theme:54,95. gift_card:1 usa layout none y no carga theme.js; sí CSS :27 y script propio :130–149. Peso fuente no mide LCP/INP ni transferencia comprimida; P2. |
| TT-13 | S: Confirmado para diferencias; instalación no probada | Raíz index/product difiere de listings; hero cinematic frente a split, PDP grid frente a split_screen. No demuestra qué instala Shopify. P2; converge con GPT D-01. |
| TT-14 | S: Parcial | main-support:9–10,114 usa contacto de tienda; page.documentation:111 enlaza soporte. Riesgo de destinatario equivocado, no ticket enviado. Plantillas no crean/publican páginas automáticamente. Converge con GPT D-02. |
| TT-15 | S: Confirmado estático | Siete main-* imprimen H1 y son añadibles sin enabled_on: main-page:13,174; documentation:31,307; support:47,380; about:22,368; policy:24,97; faq:49,261; contact:31,316. H1 vacío/duplicado en editor no renderizado. |
| TT-16 | S: Parcial | 33 secciones, 20 con preset; footer sin bloques, sin theme blocks. Resto de conteos detallados no repetido. «Insuficiente para USD 380» es juicio comercial sin tareas de editor. |
| TT-17 | S: Parcial; necesidad de PDP propia de Archive matizada | Mucho solapamiento de tipos de home/header/tarjeta; listings sí cambian estructura. Archive ya tiene PDP grid+provenance frente a Sartorial split. No reducirlo a colores ni certificar suficiente diferenciación. |
| TT-18 | S: No verificable en su estado web actual | Claims publicados y mediciones ausentes son evidencia histórica Claude. No se revalidó la web ni se deduce que no existan mediciones externas. Peso/código no certifican rapidez ni WCAG. |
| TT-19 | S: Parcial | header:191 pasa objeto link_list; :239–242 setting. Serialización Liquid y cuenta real sin ejecutar. Fallo no demostrado. |
| TT-20 | A: Parcial | theme.liquid:173–234 lista/inserta scripts; .theme-check.yml:5–26 desactiva control. No se midieron FCP/INP/TBT ni se reprodujo el peso gzip agregado. P2; «0 ofensas» depende del alcance. |
| TT-21 | A: Parcial; fallo silencioso general PDP refutado | Falta selector de planes nativo en recorrido inspeccionado; carrito muestra plan. cart.js:216–218 sí llama showError y main-product:284 tiene role=alert. App y respuesta 200 sin sections no verificadas; no generalizar fallo silencioso. |
| TT-22 | A: Confirmado estático | product-card:53–60 carece de destino de error; cart.js:239–244 puede salir sin feedback; bundle :338,351 usa variante y silencia error. Talla equivocada/422 real pendientes. P2. |
| TT-23 | A: Parcial | main-product:200–222 min=1, novalidate, sin quantity_rule. Catálogo con reglas y rechazo real pendientes. Misma causa que GPT C-04, una vez. |
| TT-24 | A: Parcial | product-media:21–26 y schema no ofrecen zoom/layout alternativo en recorrido auditado. No demuestra estética deficiente ni motivo de rechazo; P2 de cobertura/diferenciación. |
| TT-25 | A: Parcial | settings_data:152–153,255–256,358–359 umbral activo; trust-badges:27–33 promesas/fallbacks. Tarifas, moneda real, cumplimiento y defaults de branches no ejecutados. Promesas materiales se homologan con TT-63 a P1 condicionado. |
| TT-26 | A: Parcial | theme.js:557–605,617–637 reemplaza filtros sin cancelación/restauración explícita en recorrido. Foco, carrera y anuncio reales no reproducidos; P2. |
| TT-27 | A: Parcial | notify-me usa contacto, consentimiento y fallbacks ingleses. Automatización externa no evaluada; no afirmar que no haya alertas. P2 de comunicación/consentimiento; GPT C-02/C-07 convergen. |
| TT-28 | A: Parcial | Contraste teórico Contour 3.33, Annex 17.76, Maison 4.73; depende esquema/estado renderizado. No certifica incumplimiento universal. |
| TT-29 | A: Parcial | base-components:594–608 bordes/foco Notify; comparación teórica sin render/teclado. P2 condicionado. |
| TT-30 | A: Parcial | hero:56–60 autoplay y marquee:57–85 movimiento/pausa condicional. Configuración, duración y controles efectivos no probados; no declarar violación observada. |
| TT-31 | A: Confirmado como riesgo estático; vigencia no verificable | DEVELOPMENT.md:7 contiene línea con apariencia de contraseña en repositorio accesible; valor no divulgado. No prueba clave vigente ni acceso administrativo. .shopifyignore:3–7 no lo menciona; no demuestra inclusión en ZIP. P1 condicionado a vigencia; no autoriza rotación/purga. |
| TT-32 | A: Parcial | docs:70,192–196 contienen claims de instalación/WCAG/44×44. Caja de cantidad main-product:529 40px contradice universalidad documental sin demostrar violación WCAG. FAQ/contradicciones a contrastar con documentación efectivamente publicada; P2. |
| TT-33 | A: Parcial | Tres previews suman 14049685 bytes en Git y hay listing.json. Paquete final no inspeccionado; archivos extra en Git no prueban inclusión/rechazo del ZIP. Email personal no se reproduce. |

Referencias concretas externas para TT-08: [Responsive / Contour](https://themes.shopify.com/themes/responsive/presets/contour), [Gain / Maison](https://themes.shopify.com/themes/gain/presets/maison), [regla de nombres](https://shopify.dev/docs/storefronts/themes/store/requirements#18-naming-themes-and-theme-presets). TT-31: [.shopifyignore fijado](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/.shopifyignore). TT-07: [cart.js fijado](https://github.com/SebastianDev017/atelier/blob/1576d06b336abb6827084b7734faebbcb4d8f32f/assets/cart.js).

### TT-34 a TT-52

Cada fila Cucuyo tiene dictamen individual no verificable: la explicación resume la afirmación de Claude y no la adopta como hecho.

| ID | Tema / resultado | Dictamen, evidencia y límite |
|---|---|---|
| TT-34 | C: No verificable | Carrito sin descuentos/propiedades y otros datos declarado; main-cart original no disponible. |
| TT-35 | C: No verificable | Ausencias de compra en pdp-block declaradas; no inferir 422 ni efecto real. |
| TT-36 | C: No verificable | Merchandising/filtros/precio de colección declarados; sin fuente ni catálogo. |
| TT-37 | C: No verificable | Theme Check/bisección declarados; sin código ni outputs originales y no reejecutado. No certificar fallo actual. |
| TT-38 | C: No verificable | Cinco variables anuladas por cascada declaradas; sin original ni cálculo reproducido. |
| TT-39 | C: No verificable | Peso, assets sin referencia, draft_asset y escape declarados; no inspección local. |
| TT-40 | C: No verificable | GSAP/Lenis/peso y parpadeo declarados; sin original, LCP no medido. |
| TT-41 | C: No verificable | Reinicialización de editor/listeners declarados; editor no probado. |
| TT-42 | C: No verificable | Editor sin esquema/i18n/font picker y jerga declarado; no se valida conteo 833. |
| TT-43 | C: No verificable | Documentación y fuentes divergentes declaradas; sin licencias ni original. |
| TT-44 | C: No verificable | Plantillas ausentes declaradas; no se deduce respuesta Shopify. |
| TT-45 | C: No verificable | main-product añadible sin guarda declarado; editor no disponible. |
| TT-46 | C: No verificable | Colores de popup/contraste 1:1 declarados; no recalculados. |
| TT-47 | C: No verificable | Swatches 14/18px y separación declarados; tamaño efectivo no medido. |
| TT-48 | C: No verificable | Tipografía/zoom iOS declarados; sin CSS/dispositivo. |
| TT-49 | C: No verificable | Borde/foco y ratios declarados; no recalculados. |
| TT-50 | C: No verificable | Video sin pausa/fachada declarado; configuración y ejecución desconocidas. |
| TT-51 | S: Parcial; A: Parcial; C: No verificable | S main-product:722–779 y tarjeta:109–110; A main-product:399–401, product.js:43–59 serializan variants. Límite Liquid documentado; no fixture 250+ ni fallo final. C solo declaración. |
| TT-52 | A: Parcial; prohibición automática refutada; C: No verificable | A LICENSE.md:27–34 declara GSAP; cita Claude :91–98 no corresponde a archivo de 54 líneas. Licencia permite uso comercial y contempla herramientas de nicho; no conclusión legal automática. C sin original. |

El límite documentado de product.variants no equivale a un fallo reproducido: [objeto product](https://shopify.dev/docs/api/liquid/objects/product#product-variants). Para TT-52 se verificó la [licencia GSAP](https://gsap.com/community/standard-license/); su lectura no sustituye una revisión de aplicabilidad.

### TT-53 a TT-85

| ID | Tema / resultado | Dictamen, evidencia y límite |
|---|---|---|
| TT-53 | S: Parcial | Duplicación de mecanismos confirmada; porcentaje 36%, 32 resolvedores y detalle de ventanas no repetidos. Beneficio de extraer código no medido; P3. |
| TT-54 | S: Confirmado estático | main-placeholder sin referencias/preset y ausencia de block.shopify_attributes en bloques drawer/recomendaciones. Consecuencia de selección en editor pendiente. |
| TT-55 | S: Confirmado estático | Sin font preload/preconnect en recorrido de layout; ahorro/impacto no medidos. |
| TT-56 | S: Parcial | Storefront EN/ES y schema solo EN confirmado. Conteos 438/500 no repetidos; paridad semántica no probada. |
| TT-57 | S: Confirmado estático | Marquee/announcement vacíos no imprimen preview de design_mode. Experiencia editor no observada. |
| TT-58 | S: Parcial | Mecanismo de carrusel/imagen depende del layout y móvil; retorno de goToSlide no permite generalizar que la imagen no cambia/se destaca en todos los tamaños. Sin render. |
| TT-59 | S: Parcial | Sticky sin límite/overflow inspeccionado. Facetas inaccesibles o final inalcanzable no demostrado; fixture largo pendiente. |
| TT-60 | S: Parcial; JSON incondicional refutado | Bucles/JSON en tarjeta están condicionados y también sirven a swatches; no solo quick add. TTFB/peso con variantes no medidos. |
| TT-61 | S: Parcial | price:32–50,60–68 combina mínimo y compare_at máximo. Lectura engañosa depende producto/render; no comprobada. |
| TT-62 | S: Parcial; falta de ayuda refutada | Hito/regalo no crea descuento automáticamente, pero en.default.schema:820 ya advierte dependencia. No exigir documentar como si faltara toda ayuda. Otras capacidades ausentes no se convierten en requisitos obligatorios. |
| TT-63 | S: Parcial | Promesas de devolución/servicio y rutas en plantillas confirmadas. Cumplimiento real/enlaces instalados pendientes. Se eleva a P1 condicionado con el mismo criterio que TT-25/C-06; no P3 por ser Sartorial. |
| TT-64 | S: No verificable en cálculo específico | Opacidad inspeccionable, ratios 4.05/4.51/4.52 no recalculados por el especialista. Sin render no se confirma violación. |
| TT-65 | S: No verificable actualmente | Formspree/adjuntos/auto-respuesta externos no revalidados. No se envió ticket. |
| TT-66 | S: Parcial | Nombres de custom elements/base propia presentes. No prueba origen íntegro ni ausencia de derivación por búsqueda de patrones. |
| TT-67 | A: Parcial | main-product:152–168 bucles de variantes confirmados; coste no medido y demás superficies no equivalen a benchmark. |
| TT-68 | A: Parcial | search-palette:163 ruta fija; search.js tiene recorrido distinto. Salida de locale y duplicidad efectiva no probadas con navegación. |
| TT-69 | A: Parcial | gsap-animations:390–401 no registra unload en recorrido; duplicación observable. Conteos/porcentajes/fugas no medidos. |
| TT-70 | A: Confirmado estático | Dos theme blocks y ninguna de 60 secciones declara @theme. Aparición/uso en editor no probado. |
| TT-71 | A: Confirmado estático | Sin enabled_on/disabled_on ni categorías de presets. Ruido, alcance exacto del selector y H1 adicional pendientes de editor. |
| TT-72 | A: Parcial | settings_schema:514–518 y social-icons:4–16 usan entrada text/salida. Enlace roto y facilidad de datos manuales pendientes. |
| TT-73 | A: Parcial | hero:61–76 marca ambas imágenes eager/high; doble descarga simultánea y coste LCP no medidos. |
| TT-74 | A: Parcial | product.js:71–77,96–99,134–159 cambia ID antes de refresco y tiene catch; también protección reqId. Discordancia ante red fallida no reproducida. |
| TT-75 | A: Parcial | Drawer no muestra descuentos globales en recorrido; cart-item:59–64 sí muestra descuentos de línea. Fiabilidad de región viva no medida. |
| TT-76 | A: Parcial | Disponibilidad calculada en código no sustituye fixture cruzado; combinación imposible y efectos no ejecutados. |
| TT-77 | A: Parcial | Referencias a datos y archivo declarativo confirmados; ni presencia ni ausencia de definiciones reales en tienda probadas. No se crean/usan las propuestas; coste de bundle no medido. |
| TT-78 | A: Parcial | header:227 div sin aria-modal; theme:500–503 trapFocus. Efecto lector y semántica del recorrido no probados. |
| TT-79 | A: Parcial | search-palette:137–140 atajo «/» confirmado; activación accidental por voz/criterio WCAG requiere revisión de interacción. |
| TT-80 | A: Confirmado estático | layout/theme:110–112 contiene skip link dentro de nav. Landmark extra no acredita por sí solo infracción. |
| TT-81 | A: Parcial | Escalas/CSS tipográficos dependen de viewport y configuración. iOS/área efectiva sin probar. |
| TT-82 | A: No verificable en cálculo específico | Contraste Maison 2.63 declarado por Claude no repetido; uso real del esquema desconocido. |
| TT-83 | A: Confirmado para URLs; destino no probado | settings_schema:7–8 da soporte y docs iguales. No demuestra soporte inexistente o formulario fallido. |
| TT-84 | A: Parcial | Comentarios Dawn y licencia Skeleton presentes; no prueban derivación. Cita de licencia :77–79 de Claude requiere corrección porque archivo tiene 54 líneas. |
| TT-85 | A: Confirmado descriptivo; valoración premium no verificada | Listings describen hogar/arte/cerámica. Encaje con moda y precio son juicios comerciales sin demo ni investigación comparable. |

### TT-86 a TT-99

| ID | Tema / resultado | Dictamen, evidencia y límite |
|---|---|---|
| TT-86 | C: No verificable | Se declara tienda a medida y carencias Theme Store; no se confirma código ni objetivo comercial actual. No P0 hipotético tratado como real. |
| TT-87 | C: No verificable | Recomendaciones por colección declaradas; no hay original o respuesta real. |
| TT-88 | C: No verificable | Galería solo de imágenes y opciones/URL de variante declaradas por Claude; no se adopta ausencia o defecto. |
| TT-89 | C: No verificable | Claims/defaults de popup declarados; no catálogo ni políticas disponibles. |
| TT-90 | C: No verificable | Home sin H1 declarada; sin artefacto/render para comprobar semántica. |
| TT-91 | C: No verificable | Error de popup sin anuncio declarado; sin código/lector para comprobarlo. |
| TT-92 | C: No verificable | Carga eager de tres heroes y fuentes sin preload declaradas; sin original/medición. |
| TT-93 | C: No verificable | Ausencia de reglas de corte y riesgo con texto largo declarados; sin original/render. |
| TT-94 | C: No verificable | Comentarios de procedencia y similitud GSAP declarados; sin original ni metodología reproducible. |
| TT-95 | A: No verificable; C: No verificable | No se reejecutó CLI/theme-check-node 3.31 ni se tienen los outputs originales. No afirmar fallo actual ni futuro del CLI. |
| TT-96 | S: Parcial; A: Parcial; C: No verificable | S main-documentation:154 salida code sin escape; A meta-tags:22,89,92, hero:59 y search-palette:109–111 salidas sin escape. No payload, exploit, origen controlable o daño demostrado. C sin fuente. |
| TT-97 | S: Parcial; A: Parcial; C: No verificable | S no usa visible_if en recorrido; A no en secciones pero sí una vez en block group: refuta «ningún uso» global. Confusión UX no medida. C sin fuente. |
| TT-98 | A: Parcial; C: No verificable | A overflow-x:clip presente; no prueba contenido cortado ni incumplimiento reflow. C sin fuente. |
| TT-99 | A: Parcial | Archivos declarativos y cuatro CSV existen en Git; CSV suman 82321 bytes en conteo actual. No prueban inclusión en ZIP, creación de datos ni rechazo del paquete. No se ejecutó empaquetado. |

## 6. Causas adicionales GPT y deduplicación

Este registro **contiene 14 causas prioritarias delimitadas**, contadas una vez por mecanismo. No es el total de defectos de los temas ni el número de hallazgos confirmados; combina evidencia estática y riesgos pendientes. TT-03/S-03, TT-07/C-03, TT-23/C-04 y TT-25/TT-63/C-06 son referencias convergentes, no nuevos defectos cada vez que aparecen en otra categoría. Algunas filas TT abarcan múltiples mecanismos; por ello no se hace una suma «99 + adiciones» ni se convierte la suma de categorías en impacto comercial.

| Causa única | Prioridad propuesta / referencias | Evidencia y resultado |
|---|---|---|
| RC-01 Variante seleccionada sin JS no controla el ID enviado | P1 condicionado; GPT S-01; omisión en Claude | S main-product:238–248 y featured-product:136–146 radios fuera de form y sin form; hidden id :477/:226; theme.js:838–844 sincroniza por JS. Seleccionar B puede enviar A. Código confirmado; no se envió compra. |
| RC-02 Duplicación de selling_plan en formulario | P1 condicionado; GPT S-02; omisión | S main-product:565–599, featured:313–347; base.css:5653–5655 solo oculta fallback. theme.js:762–775 habilita/actualiza hidden; :2561–2571 usa FormData. Hidden y select pueden discrepar; compra única puede dejar plan A del fallback. Interpretación Shopify/checkout no probada. |
| RC-03 Material/fabricación inferidos por handle | P1 condicionado; TT-03 = GPT S-03 | S snippet técnico:47–54,67–70; glass-paperweight alcanza rama de latón sin dato explícito. No se crea fixture en tienda. Una causa, no contar otra por cada idioma/categoría. |
| RC-04 Color de foco desacoplado del esquema | P1 condicionado Imprint/P2 Archive; TT-02 | CSS y cálculos descritos en TT-02; alcance real con teclado pendiente. |
| RC-05 Error de cambio de carrito tratado como carrito válido | P1 condicionado; TT-07 = GPT C-03 | A cart.js sin res.ok y contador oculto inválido; simulación previa, no 422 Shopify confirmado. Otros errores de nota/bundle requieren delimitarse, no generalizar al add principal. |
| RC-06 Confirmación Notify me dentro de form oculto | P1 condicionado; GPT C-01; omisión distinta de TT-27 | A notify-me:104–107 coloca éxito dentro del form; theme.js:777–780 oculta form y muestra descendiente. Mostrar hijo no vuelve visible ancestro. No se envió formulario ni se certificó éxito semántico de la respuesta. |
| RC-07 Promesas de políticas no sustentadas por configuración real | P1 condicionado en ambos; TT-25 + TT-63 + GPT C-06 | Defaults de devoluciones/fabricación/servicio y fallbacks existen. No prueba que una tienda incumpla; mismo criterio y prioridad para ambos temas. Cada instancia permanece documentada por tema, sin doble contabilizar el riesgo conceptual. |
| RC-08 Cantidad Sartorial clamp a máximo incompatible con incremento | P2; GPT S-04; omisión | S theme.js:5750–5756; fixture min2/paso2/actual4/max5 dio next5,validStep=false. Simulación original previa, no Shopify. |
| RC-09 Cantidad Contour sin reglas de variante | P2; TT-23 = GPT C-04 | A main-product:200–222 min1 sin quantity_rule; cambio variante product.js:62–104,134–159. Rechazo/stock real sin probar. Causa distinta de RC-08 por implementación. |
| RC-10 Menú móvil oculto por breakpoint conserva estado | P2; GPT S-05; omisión | S theme.js:275–299,336–360 controla inert/scroll; base.css:4389–4396 oculta sobre 62rem. Falta cierre por resize en recorrido; bloqueo real requiere navegador/orientación. |
| RC-11 Borrador de nota puede perderse al ir a View cart | P2; GPT S-06; omisión | S theme.js:2322–2326 marca dirty; guardado previo en cross-sell :2408–2414; cart-drawer:366–368 enlaza carrito. No se confirma pérdida en vivo ni se extiende a checkout normal. |
| RC-12 Resultado incierto de add invita a reintentar | P2; GPT S-07; omisión | S theme.js:2561–2582,2611–2620,3286. POST aceptado y respuesta perdida podría duplicar cantidad; no doble pago. Escenario de red no ejecutado. |
| RC-13 Anuncio de agotado ambiguo | P2; GPT S-08; omisión | S theme.js:814–815,1056–1064 frente a botón :855–856. Causa verbal puede diferir; lector no probado. |
| RC-14 Guía de tallas de ejemplo puede parecer dato de producto | P3; GPT D-03; omisión | S main-product:947,965,971 incluye medidas/modelo de ejemplo. Bloque opcional; editor y producto real no probados. |

Las adiciones GPT de documentación (D-01/D-02) se absorben en TT-13/TT-14/TT-17. Consentimiento/proceso Notify (C-02/C-07) se absorbe en TT-27; no se mezcla con la confirmación oculta RC-06. Claim universal de accesibilidad C-08 converge en TT-32. Umbral C-05 forma parte de TT-25, pero distinguir informar/configurar tarifas de cumplir promesas; no se ha probado Markets. Las otras filas TT conservan su individualidad en §5 y no se omiten por no aparecer en este registro de prioridades.

## 7. Comparación que sí permite la evidencia

### Editor y estructura

Recuento Sartorial comunicado y contrastado parcialmente: 33 secciones, 20 con preset, 23 inputs globales; frontend EN/ES, schema EN. No se repitieron todos los comandos de inventario originales, por lo que no se convierten en compuerta.

Contour, recuento fijo del especialista: 60 secciones, 43 con preset, dos theme blocks, 54 inputs globales excluyendo encabezados y definiciones de color. Los 59 de otro método incluyen encabezados; 62 incluye definiciones de color. En ajustes de contenido: 532 de sección + 134 de bloques locales = 666; +6 de theme blocks = 672. Por tanto, llamar a 672 «solo ajustes de sección» es impreciso. Referencias t: 1345 en secciones +21 theme blocks =1366, +112 globales =1478. No son magnitudes contradictorias si se explicita el denominador. Hay 51 secciones con padding y dos secciones con @app. No se convierten 125 cadenas literales de contenido como Stoneware/Hand-thrown/Lead-free glaze en 125 labels de editor sin traducir.

Contour presenta mayor amplitud configurable e identidades estructurales más distintas en homes: Contour/Annex comparten tres tipos; Maison comparte dos con cada uno en el análisis inicial. Sartorial/Imprint comparten siete de ocho; siete tipos de Archive aparecen también en Sartorial. Esto demuestra diferencias de composición, no calidad visual, facilidad, conversión u originalidad frente al mercado. Archive tiene diferencias de PDP reales y debe conservarse ese matiz.

### Compra, accesibilidad y rendimiento

Sartorial contiene planes, zoom, reglas, regiones de estado, protecciones y recomendaciones; su existencia no supera los riesgos RC-01/02/08/10/11/12/13. Contour contiene quick-buy, editor más amplio y distintos mecanismos de carga; RC-05/06/09 y TT-22 delimitan riesgos comerciales. No hay base para asignar ganador final en compra sin transacciones de prueba y estados límite.

Contrastes calculados y cajas CSS son útiles para encontrar candidatos a fallo; no certifican WCAG ni reemplazan teclado/lectores. Un control de 40px aislado no demuestra incumplimiento de WCAG por sí solo. Los 44×44 corresponden también a una norma del proyecto más exigente en ciertos contextos y no deben confundirse con todos los criterios mínimos de WCAG.

Peso fuente y gzip estático no son latencia, transferencia real, CPU ni INP. No se adopta un empate 15/20 de rendimiento ni se afirma que el mayor CSS cause lentitud observada. Los umbrales oficiales de rendimiento/accesibilidad deben medirse bajo su método; aquí no hay puntuaciones Lighthouse.

### Cucuyo

Solo se puede contrastar la calidad de la argumentación del informe de Claude y registrar lo que dice haber visto. Sin original, no se confirma que Sartorial lo supere en las cinco categorías, que Cucuyo sea publicable/no publicable actualmente, ni que sus carencias fueran aceptadas por la clienta. Su condición declarada de tienda a medida exige separar objetivo de cliente de candidato Theme Store; la comparación es asimétrica incluso si se recuperase el artefacto.

## 8. USD 380 y alcance comercial

USD 380 es admisible bajo la regla de precio oficial. No se identifica un «tier de 380» obligatorio de Shopify. El valor comercial requiere demostrar dirección de arte, editor utilizable, compra fiable, catálogo/medios adecuados, documentación/soporte y diferenciación. Ninguna suma de ajustes o presencia de funciones valida el precio.

La arquitectura disponible permite investigar ese posicionamiento. No permite certificarlo ni descartarlo con las notas provisionales. La titularidad del soporte, la preparación de demos, la identidad del despliegue y los derechos/licencias siguen teniendo límites independientes. No se deduce por ello un rechazo automático, un problema legal comprobado o una causa histórica de rechazo.

## 9. Alcance de cierre y responsables

No se cierra ninguna fila de docs/requirements-ledger.md. Esta entrega documental no certifica las cinco compuertas de una entrega técnica. Causas estáticas contrastadas no pasan a «cumplido» por este maestro.

| Incertidumbre conservada | Responsable nominal de aportar o coordinar evidencia |
|---|---|
| Identidad de soporte, propósito comercial y artefacto Cucuyo disponible | Johandry |
| Identidad de ramas/demos/instalación y organización de cualquier prueba autorizada | Gemini |
| Comportamiento de código que eventualmente sea autorizado corregir | Claude como implementador, mediante directiva |
| Verificación independiente de resultados, escenarios y límites | GPT |
| Aprobación comercial, cambios de alcance, escrituras en tienda, pushes y acciones críticas | Johandry |

La tabla asigna responsabilidad; no es un plan ni una autorización. Las recomendaciones de ambos iniciales siguen siendo propuestas. No se copia código entre temas ni se propone adoptar código de Contour o Cucuyo. No se muestran secretos y no se rotan, purgan o publican datos. Cualquier futura decisión sobre metafields permanece separada y no aprobada.

## 10. Afirmaciones falsables y límites finales

1. Las dos iniciales utilizadas tienen los SHA-256 listados en §2; el maestro Claude no fue leído.
2. El artefacto Sartorial de contraste es el ZIP integrado 092242…; el ZIP raíz distinto no se usó como sustituto.
3. La fuente Contour es 1576d06… y los presets de main no acreditan identidad de sus branches o demos.
4. Los 99 IDs TT están registrados individualmente; TT-51/52/95/96/97/98 distinguen resultados por tema.
5. No hay original Cucuyo disponible en este cruce; sus estados propios permanecen no verificables.
6. TT-12 no permite afirmar carga de theme.js en gift card; TT-62 ya tiene ayuda de dependencia; TT-21 sí tiene error general de PDP; TT-97 Contour sí usa visible_if en un theme block.
7. RC-01/02 y RC-06 describen mecanismos estáticos concretos omitidos en la inicial Claude; sus resultados Shopify/tienda siguen pendientes.
8. No hay P0 demostrado ni prueba de ausencia de P0; los P1 condicionados no equivalen a defectos de tienda reproducidos.
9. No hay compra, demos, editor, Lighthouse, axe, lectores, formulario enviado o pruebas de dispositivo nuevos.
10. No se crean ni usan las siete definiciones propuestas; no se modifica código/tiendas/ledger/Git.
11. El registro de 14 causas prioritarias deduplica referencias convergentes y no es un total general de defectos.
12. Este archivo entrega solo el maestro GPT. El cierre conjunto y cualquier plan permanecen pendientes de que Johandry comparta ambas auditorías maestras.

## Anexo de erratas prevalentes — 2026-10-28

Este anexo prevalece expresamente sobre las tres formulaciones siguientes del cuerpo; conserva el documento original y no introduce nuevas pruebas.

1. En la afirmación falsable 6 (línea 304 del cuerpo original), «TT-21 sí tiene error general de PDP» debe leerse «TT-21 sí dispone de manejo/aviso general de error en PDP». Describe la existencia de tratamiento y aviso, coherente con la fila TT-21; no afirma que exista un error general de la PDP.
2. En el inventario del editor (línea 261 del cuerpo original), la cifra 125 declarada por Claude no se reprodujo con definición inequívoca y no equivale a 125 labels del editor sin traducir. Stoneware, Hand-thrown y Lead-free glaze son valores de contenido de presets. No se presenta 125 como recuento independiente de cadenas literales de contenido.
3. En TT-71 (línea 197 del cuerpo original), la ausencia de categorías se limita a los presets de SECCIONES inspeccionados. El theme block blocks/group sí declara category t:general.layout; no se generaliza esa ausencia al conjunto del tema.