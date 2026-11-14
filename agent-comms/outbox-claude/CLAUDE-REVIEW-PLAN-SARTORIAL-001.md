# CLAUDE-REVIEW-PLAN-SARTORIAL-001

Revisión independiente del plan GPT-PLAN-IMPLEMENTACION-SARTORIAL-001. Solo lectura. No se modificó ningún archivo del dispositivo ni de los temas.

| Campo | Valor |
|---|---|
| Fecha | 2026-10-29 |
| Revisor | Claude (Fable 5.1), revisor independiente; no escribió el plan ni las auditorías |
| Plan revisado | agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001.md (18.806 B, copia tomada del dispositivo el 29-oct) |
| Evidencia leída | GPT-AUDIT-THREE-THEMES-MASTER-001, GPT-AUDIT-THREE-THEMES-VISUAL-001 (ambos con sus anexos de erratas), CLAUDE-AUDIT-THREE-THEMES-MASTER-001, CLAUDE-AUDIT-THREE-THEMES-LIVE-001 |
| Código contrastado | /home/claude/themes/sartorial-zip (ZIP integrado 092242…, equivalente al tema publicado según LIVE §1.2) |
| Veredicto | **Aprobar con cambios.** La estructura, el reparto y las reglas de gobierno son correctos; faltan ocho hallazgos P2 sin estado, dos dependencias de verificación no secuenciadas y la precondición dura sobre el build base |

Nada de este documento autoriza implementación, escrituras en tiendas, commits, pushes ni publicaciones. Las siete definiciones de metafields siguen sin aprobar. No se propone copiar código de Atelier ni de Cucuyo.

---

## 1. Cobertura de P1 y P2

Alcance implícito del plan: Sartorial. El plan no dice de forma expresa que los hallazgos de Atelier (TT-07, TT-08, TT-09, TT-31, TT-20 a TT-33, LV-06 a LV-20, LV-28 a LV-30, V-03, V-04) y los de Cucuyo quedan fuera; conviene decirlo en §1 para que nadie los busque en los lotes.

### 1.1 Cubiertos

| Hallazgo | Fuente y prioridad | Dónde lo cubre el plan | Observación |
|---|---|---|---|
| TT-100 / RC-02 selling_plan | Claude P1 (caso C), GPT P1 cond. | A-01 | El criterio dice "con/sin parámetro de URL" pero no nombra el caso C (carga con `?selling_plan=` o variante `requires_selling_plan`, comprador elige compra única, payload `["900"]`). Ver §2 y cambio 2 |
| TT-03 / RC-03 / S-03 specs y procedencia | P1 ambos | A-02 | Cubre handle, título y tipo. Falta la política de datos (ver cambio 3) |
| TT-02 / RC-04 foco Imprint y Archive | Claude P1/P2, GPT P1 cond./P2 | A-03 | Correcto agrupar ambos presets. Depende de que existan demos de Imprint y Archive (ver cambio 4) |
| G-20 / TT-104 / RC-10 menú al cruzar breakpoint | P2 ambos, reproducido en tienda | B-01 | Correcto |
| S-01 / TT-101 / RC-01 variante sin JS | GPT P1 cond., Claude P2 | B-02 | Correcto; la discrepancia de prioridad queda resuelta al colocarlo en B |
| S-07 / TT-102 / RC-12 reintento duplica | P2 ambos | B-03 | Correcto, incluida la nota "no doble cobro" |
| S-06 / TT-103 / RC-11 nota del drawer | P2 ambos | B-04 | Ruta "por confirmar": la doy en §2 |
| LV-01 idioma 2.5.3 | Claude P2 (axe serious) | B-05 | Correcto. Apto para Antigravity |
| V-02 filtros móviles / TT-26 Sartorial | GPT P2 | C-01 | Correcto |
| TT-13 / D-01 GPT raíz frente a listing | P2 ambos, confirmado en tienda | C-02 | Correcto |
| TT-12 / G-40 peso CSS y JS | Claude P2, GPT sin prioridad | C-03 | Ver cambio 10: condicionar al resultado de G2 por preset |
| TT-05 soporte, TT-18 claims, TT-14 docs | Claude P1 cond. / P2 | C-04 | Cubre buzón, claims e instrucciones |
| V-01 / LV-23 placeholders, LV-24 QA públicos, V-07 fotos del vestido | P1 demo (ambos) / P2 | D-01 | Correcto |
| RC-08 / TT-105, RC-13 / TT-106, RC-14 / TT-108 | GPT P2/P2/P3, Claude P3 | D-02 | Correcto; el plan resuelve la discrepancia dejándolos en P3 sin decirlo. Basta una línea |
| LV-02, LV-03, LV-05, LV-21, LV-22, V-08 | P3 | D-03 | Correcto |
| TT-06, TT-16, TT-17 unicidad y catálogo de secciones | P2 ambos | Lote E | Aceptable como diferido, pero el lote no cita los IDs ni dice que es un diferimiento con motivo |
| G1 Imprint y Archive no desplegados, G2 Lighthouse por preset, G4 release-notes, build | Compuertas | §3.5, §7 | Están nombradas; faltan tareas con dueño y fecha (ver cambios 1, 4 y 6) |
| V-06 identidad de LINEA NOVE | GPT P1 de trazabilidad | §3, §7 Demos | Cubierto por la ficha de identidad del build; conviene incluir la identidad de preview por tienda en esa ficha |

### 1.2 Sin estado en el plan (ni planificados, ni diferidos, ni rechazados)

| ID | Superficie | Prioridad | Por qué importa |
|---|---|---|---|
| TT-15 | Siete secciones main-* (page, documentation, support, about, policy, faq, contact) con preset y sin `enabled_on`; cada una imprime H1 | Claude P2; GPT "confirmado estático" | Un comerciante puede añadirlas a cualquier plantilla desde el editor y duplicar el H1. Es de la compuerta "superficie del comerciante" del propio plan. Arreglo pequeño en schema |
| TT-19 | header.liquid:191, `<shopify-account>` recibe el objeto link_list sin `.handle` | Claude P2 (hipótesis); GPT "fallo no demostrado" | Sigue sin verificar en tienda (LIVE §5.1). El plan debe cerrarlo como verificado o como no reproducible, no dejarlo abierto |
| TT-51 | main-product.liquid:722-779 serializa `product.variants` sin guarda de 250; la tarjeta sí la tiene (product-card.liquid:94, :113) | Claude P2 parcial; GPT parcial | Riesgo acotado pero es código, no contenido; debe tener estado |
| TT-14 (parte) | Plantillas page.documentation.json y page.support.json del vendedor dentro del ZIP; page.documentation.json:26 "Each preset changes theme settings only" | P2 ambos | C-04 habla de documentación pública; no decide si esas plantillas se quedan en el paquete, se corrigen o se retiran (success/updates pide no incluir JSON que el comerciante no deba usar) |
| LV-26 | Menú de tres enlaces (Home, Catalog, Contact) en las tres tiendas Sartorial | Claude P2 demo | Afecta a G1; D-01 no lo nombra |
| LV-25 | PDP del vestido en español con UI en inglés y sin tallas en tema-qkqpke0j | Claude P2 demo | D-01 habla de catálogo e imágenes, no de idioma del contenido |
| LV-27 + TT-04 | Tiendas y temas con nombres antiguos "Edition" y "Atelier"; docs públicos con "Edition" | P2 ambos | C-04 dice "nombres" sin citar los IDs ni las tiendas; conviene nombrar qué se renombra y quién decide |
| V-05 | Edition: narrativa técnica, CTA "VIEW TECHNICAL SPECS" a una colección, tarjeta naranja con instrucciones de interfaz, "Material composition: Desk Objects" | GPT P2 | La parte de código es A-02; la parte de copy y destinos de CTA es contenido y D-01 no la incluye |

Ocho hallazgos. Ninguno es P1, pero el plan afirma en §1 que recoge "las mejoras acordadas a partir de las dos auditorías maestras y sus anexos" y la compuerta de ledger exige estado por fila.

---

## 2. Corrección técnica de los ítems planificados

Contrastado contra el ZIP integrado.

**A-01 selling_plan.** Confirmado. El `<select data-selling-plan-select>` de JS (main-product.liquid:529; featured-product.liquid:277) no tiene `name`, así que no viaja. El `<select name="selling_plan">` del bloque no-JS (main-product.liquid:577; featured-product.liquid:325) solo se oculta con `.js .no-js-only { display: none !important }` (base.css:5653-5655) y nunca se deshabilita; theme.js:770 deshabilita `sellingPlanSelect`, que es el select de JS, no el no-JS. El hidden `data-selling-plan-input` (:565-571) sí se habilita y deshabilita (theme.js:771-775). Arreglo mínimo correcto: `disabled` en el select no-JS cuando hay JS, o moverlo a `<noscript>`. No regresa otros presets: el markup es común. Criterio de verificación: debe nombrar el caso C y comprobar el payload real (pestaña Network o `new FormData(form)` en consola) con exactamente cero o un `selling_plan`. Prerrequisito no listado: ninguna tienda Sartorial tiene `selling_plan_groups` (LIVE §5.1, TT-100) y el QA F06 exige plan sin tener grupos (LV-04); hace falta una app de suscripciones y al menos un producto con grupo de planes y una variante `requires_selling_plan`, lo que es una escritura en tienda que autoriza Johandry.

**A-02 specs y procedencia.** Confirmado. product-technical-specs.liquid:47-49 marca `is_non_textile` por `product.type` o handle; :53-54 "Solid milled brass" por handle; :55-56 usa `product.type` como material (la rama que produjo "Material composition: Desk Objects" en sartorial-edition, LIVE §5.1); :67-70 "Precision machined". product-provenance.liquid:30-36 aplica `block.settings.circa_year` si el título contiene "19", "20", "archive" o "vintage". Rutas y archivos del plan correctos. Falta una decisión: eliminadas las inferencias, las fuentes que quedan son metafields `custom.*` (leer si existen, sin crearlos, es lícito) y los `block.settings` (material, gsm, hardware, origin), que son valores de plantilla iguales para todos los productos. "Mostrar únicamente datos de mecanismos ya aprobados" no dice si esos defaults de bloque se mantienen, se vacían o se marcan como ejemplo. Prueba en tienda concreta: leather-desk-mat y folded-valet-tray en sartorial-edition no deben mostrar el tipo como material; milled-brass-paperweight no debe mostrar "Solid milled brass" salvo que lo diga un dato del producto.

**A-03 anillo de foco.** Confirmado. Dentro de `@media (prefers-reduced-motion: no-preference)`, base.css:9102-9107 (`technical`, `#2b2b2b`) y :9126-9131 (`heritage`, `#b5885c`) fijan el color; el preset `atelier` (:9069-9074) ya usa `var(--color-foreground)`, igual que la regla base `:focus-visible` (:283-285). El plan dice "configuración de esquemas correspondiente": no es necesario tocar esquemas; el disparador es `motion_style` (settings_data.json:157, :234, :311) y el arreglo es solo CSS (token del esquema o anillo doble). Sin regresión para Sartorial. Verificación: los fondos reales de Imprint y Archive solo existen si se despliegan esos presets o se cambia `motion_style` en un tema de preview; el plan no secuencia esa dependencia (cambio 4). El arnés tt02.js de Chromium sirve como prueba sintética previa, etiquetada como tal.

**B-01 menú al cruzar breakpoint.** Confirmado. `ThemeDrawer` (theme.js:274-364) no escucha resize ni `matchMedia`; `.site-header__mobile-menu { display: none }` a partir de 62rem (base.css:4389-4396). `<theme-drawer>` solo se usa en header.liquid:36, así que un `matchMedia('(min-width: 62rem)')` en la clase no afecta a `CartDrawer` (clase distinta, :2263). Mejor aún: leer el breakpoint de un atributo data para no acoplar JS y CSS. Verificación propuesta por el plan es la correcta; el arnés g20_g23.js ya reproduce el caso y puede volver a correrse.

**B-02 variante sin JS.** Confirmado. Radios con `name="options[...]"` fuera del `<form>` y sin atributo `form` (main-product.liquid:238-248); hidden `name="id"` en :477; `no-js` se retira en theme.liquid:98; no hay `<noscript>` en la PDP. Shopify ignora `options[]` en /cart/add, así que el arreglo correcto es un `<select name="id">` dentro de `<noscript>` en el formulario (ambas superficies), que no se interpreta con JS activo y por tanto no duplica `id`. Verificación con JS desactivado en DevTools y línea de carrito comprobada: correcta. Estimación alta (ver §6).

**B-03 reintento con resultado incierto.** Confirmado. `fetchCommerce` (theme.js:147-150) convierte cualquier fallo de red en el mensaje genérico; el add (:2561-2582) no consulta el carrito antes de mostrarlo; la clasificación con "Check cart" solo existe en la venta cruzada; `syncCart({ reconcile })` (:3286) solo corre con el drawer abierto. El plan acierta: consultar /cart.js antes de invitar a reintentar, reutilizando la maquinaria de reconciliación existente. La prueba "POST aceptado con respuesta perdida" solo es posible con un arnés (bloqueo de respuesta en DevTools o mock de fetch); el plan ya exige etiquetarlo como sintético. Correcto.

**B-04 nota del drawer.** Confirmado y con la ruta que el plan deja "por confirmar": el enlace View cart está en sections/cart-drawer.liquid:366-368, dentro del drawer; `handleDocumentClick` (theme.js:2363) descarta los enlaces contenidos en el propio drawer (`this.contains(link)`), por eso la nota se pierde. El arreglo va en el manejador interno de clics del drawer, reutilizando el guardado que ya se hace para Checkout (:2438-2457) y venta cruzada (:2408-2414). Marcado `dirty` en :2322-2326. Verificación del plan correcta.

**B-05 nombre accesible del idioma.** Confirmado. snippets/localization-selectors.liquid:59-66: botón con texto visible `ES` y `aria-label="{{ 'general.localization.update' | t }}: {{ language.endonym_name }}"`. Arreglo: que el nombre accesible empiece por el texto visible (por ejemplo `ES: Español`) o sustituir el aria-label por un `visually-hidden` tras el código; tocar las claves en en.default.json y es.json. Verificación: volver a pasar axe `label-content-name-mismatch` a 390 (footer) y 1280 (header), con el arnés ya existente. Pequeño y localizado: apto para Antigravity, como propone el plan.

**C-02 raíz frente a listing.** Confirmado en el ZIP: templates/index.json ordena hero-editorial, marquee, lookbook, curated-showcase, brand-manifesto, complete-the-look, bento-discovery, newsletter; listings/sartorial/templates/index.json ordena hero-editorial, marquee, curated-showcase, lookbook, featured-product, complete-the-look, brand-manifesto, newsletter. Imprint y Archive también difieren. La verificación "instalación limpia" solo puede hacerse subiendo el ZIP a una tienda de desarrollo (la instalación desde la Theme Store no existe antes de la aprobación); conviene decirlo.

**§3.5 build.** Confirmado que los tres cambios están en el ZIP: base.css:7035-7038 (placeholder de la newsletter del footer), theme.js:446-472 (`pagerHasFocus`, `focusedStep`), product-zoom.js:267-274 (`pointerup` del pellizco). El plan los describe bien.

**C-04 y G4.** El ZIP no contiene release-notes.md ni changelog (comprobado con find); la compuerta §7 lo nombra pero ninguna tarea lo produce.

---

## 3. Secuencia y decisión de build

Lo que está bien: §3 exige fijar identidad antes de escribir; §3.5 y §7 nombran la decisión entre ZIP integrado y submission 09f8342 y la reservan a Johandry; el orden Preparación, A, B, C, D, compuertas es razonable; B depende de A porque ambos tocan theme.js y el escritor único lo impone.

Lo que falta:

1. **Precondición dura del build base.** El plan dice que Johandry decide qué build enviar, pero no que el SHA base de todos los lotes deba contener ya los tres arreglos. Si GPT implementa sobre 09f8342 y los tres cambios siguen sin commit en el checkout codex, se pierden o entran en conflicto al final. Debe ser el primer acto de escritura autorizado (un "Lote 0" de una sola tarea: commit de los tres cambios, con autorización expresa de Johandry) o, si Johandry prefiere enviar el ZIP tal cual, declarar el ZIP como base y regenerar el tema de envío desde él antes del Lote A. LIVE §6 además pide repetir Lighthouse, axe y teclado sobre el build consolidado; §7 "Build" debería exigirlo.
2. **Despliegue de Imprint y Archive.** Hoy ningún preset distinto de Sartorial está desplegado (LIVE §1.1). De ello dependen la verificación de A-03, la revalidación de TT-02, TT-06 y TT-17, G1 y G2 por preset. El plan lo deja para las compuertas de §7, al final. Debe adelantarse como tarea de Antigravity con autorización de Johandry, en Preparación o en paralelo al Lote A, como creación de temas de preview o client transfer stores.
3. **Tienda con planes de venta.** A-01 no puede verificarse en tienda sin una app de suscripciones y productos con planes (ver §2). Es una escritura en tienda que debe pedirse en la directiva de A-01, no descubrirse durante la implementación.
4. **Escritor único con subagentes.** §2 permite que GPT delegue subtareas a subagentes "con archivos asignados" y §2 también dice "un solo agente modifica código a la vez". Son compatibles solo si los subagentes escriben en archivos disjuntos dentro del turno de GPT y GPT integra antes de devolver el turno; conviene escribirlo y que Antigravity registre la partición.
5. **Lote D en paralelo.** Correcto que el contenido de demo avance desde el primer día; son escrituras en tienda, no en código, y no compiten con el turno de escritura de código. Aclararlo evita que Antigravity lo bloquee.

---

## 4. Gobierno

| Regla | Estado en el plan |
|---|---|
| Sin autorización implícita | Cumple. §1, §2, §5.6 y §7 lo repiten; §8 pide esperar la orden de Johandry |
| Sin creación ni uso de los siete metafields | Cumple (§1). Matiz para A-02: los snippets ya leen `product.metafields.custom.*`; leerlos si existen no es crearlos. La directiva debe decirlo para que GPT no interprete "mecanismos aprobados" como permiso para definirlos ni como orden de borrar las lecturas |
| Sin copiar código de Atelier ni Cucuyo | Cumple (§1, Lote E). En A-03 y B-01 la solución natural coincide con un patrón genérico (token CSS, matchMedia); se escribe desde cero igualmente |
| Commits, pushes, publicaciones y escrituras en tienda gateados por Johandry | Cumple (§2, §5.6). Falta que el commit de los tres arreglos y las escrituras en tienda para A-01, A-03 y D-01 se pidan de forma explícita (cambios 1, 2 y 4) |
| Secretos | Cumple (§7). Añadir: los informes de Lighthouse, axe y teclado y los arneses de Playwright/Chrome no deben contener STOREFRONT_PASSWORD ni cookies de preview; MASTER-001 §10 registra dos impresiones accidentales anteriores |
| Ledger | Cumple: estados cerrados y filas reales (§5) |

---

## 5. Roles y puntos de revisión

Asignar a Claude solo revisión es viable si cada compuerta de revisión tiene entradas y salidas fijas. Propuesta:

**Entradas de toda revisión:** ID de directiva; SHA base y SHA o hash del árbol entregado; lista cerrada de archivos tocados; diff; informe del implementador con cabecera RULES §1.4; salidas de arneses con comando y etiqueta sintético/tienda; URL de preview del tema (sin credenciales en el informe); filas del ledger que se pretende mover.

**Salidas de toda revisión:** dictamen aceptar / devolver / escalar; lista numerada de afirmaciones del implementador intentadas falsar, con archivo:línea y comando reproducible; hallazgos devueltos dentro de alcance; hallazgos fuera de alcance anotados sin parche; propuesta de estado del ledger por fila.

| Punto | Momento | Qué revisa Claude |
|---|---|---|
| R-0 | Al cerrar §3 | Ficha de identidad del build: SHA, hashes, relación ZIP, tema publicado y tema de envío; presencia de los tres arreglos en el base; identidad de preview por tienda. Sin esto no se abre el Lote A |
| R-D | Antes de emitir cada directiva | Alcance cerrado, archivos, criterios falsables y prerrequisitos de tienda. Barato y evita devoluciones |
| R-A | Tras Lote A | Diff contra código; payload real de selling_plan en los tres escenarios incluido el caso C; specs y procedencia en los productos de sartorial-edition; foco en Imprint y Archive desplegados; tt02.js y Theme Check |
| R-B | Tras Lote B | g20_g23.js y resize real; envío sin JS con línea de carrito comprobada; arnés de respuesta perdida; nota del drawer; axe 2.5.3 a 390 y 1280 |
| R-C | Tras Lote C | Instalación del ZIP en tienda limpia por preset; comparación raíz y listing; antes/después de C-03 si se abre; docs y release-notes.md |
| R-Demo | Tras D-01 | Recorrido Home, PLP, PDP por preset en escritorio y móvil; ausencia de placeholders, QA e idioma mezclado; menú |
| R-G | Antes del envío | Lighthouse, axe y teclado repetidos por Claude sobre el build final y por preset; hashes del paquete; compuertas G1 a G4 |

Recomendación: que las mediciones TR-SIN (Lighthouse, axe, teclado) de R-A, R-B y R-G las ejecute Claude de forma independiente, no solo el implementador. Claude ya tiene el arnés en la VM del equipo (`$HOME/livetest`) y una medición del revisor vale más que una autodeclarada. El plan no dice hoy quién ejecuta esas mediciones.

---

## 6. Realismo de las estimaciones

| Ítem | Plan | Lectura | Motivo |
|---|---|---|---|
| A-01 | 1–2 d | Alta para el código, baja para el entorno | El cambio es de unas líneas en dos secciones. Lo que cuesta es montar planes de venta en la tienda de desarrollo y probar los tres escenarios en ambas superficies: 0,5 d de configuración más 0,5 d de pruebas, si Johandry autoriza la app |
| A-02 | 1–2 d | Razonable | Depende de la decisión sobre defaults de bloque; si se decide antes, 1 d |
| A-03 | 0,5–1 d | Razonable, bloqueada | Sin Imprint y Archive desplegados no puede cerrarse en tienda |
| B-01 | 0,5–1 d | Razonable | |
| B-02 | 1–2 d | Alta | `<noscript>` con select de variantes en dos secciones y prueba sin JS: 0,5–1 d |
| B-03 | 1–2 d | Razonable | La reconciliación ya existe para la venta cruzada; el arnés de red es lo que lleva tiempo |
| B-04 | 0,5–1 d | Alta | Un manejador y reutilizar el guardado del Checkout: 0,25 d |
| B-05 | 0,25–0,5 d | Razonable | |
| C-01 | 1–2 d | Razonable | |
| C-02 | 1–2 d más instalación | Razonable | |
| C-03 | 2–4 d tras perfilado | Cuestionable antes del envío | G2 ya se supera en el preset Sartorial (74,7 móvil, 98,3 escritorio). Dividir CSS y JS globales es un cambio transversal con riesgo de regresión en vísperas de envío. Condicionarlo a que Imprint y Archive, o la remedición del build final, bajen del umbral; si no, diferir a después del envío |
| C-04 | 1–2 d | Baja si incluye la web pública | docs.html y support.html viven fuera del tema (sitio noobprobro-web, TT-05); corregirlos y confirmar la titularidad del buzón depende de Johandry y puede no caber en 2 d |
| D-01 | 2–4 d más activos | Baja en la parte de activos | La producción de fotografía no tiene cota; separar configuración (2–4 d) de producción de activos (fecha de Johandry) |
| Lote E | 5–10 d | Fuera del camino de envío | Correcto tratarlo como decisión aparte |

---

## 7. Veredicto y cambios

**Veredicto: aprobar con cambios.**

### Cambios requeridos

1. **§3 y §4.** Añadir la precondición: el SHA base de todos los lotes contiene los tres arreglos del ZIP integrado (base.css:7035-7038, theme.js:446-472, product-zoom.js:267-274). Primer acto de escritura autorizable: commit de esos tres cambios (o declaración del ZIP como base y regeneración del tema de envío). En §7 "Build", exigir repetir Lighthouse, axe y teclado sobre el build consolidado.
2. **§4 A-01.** Nombrar el caso C en el criterio (carga con `?selling_plan=` o variante `requires_selling_plan`, compra única elegida, payload sin `selling_plan`). Añadir el prerrequisito de tienda: app de suscripciones y al menos un producto con grupo de planes y una variante `requires_selling_plan`, con autorización de Johandry. Exigir comprobación del payload real, no solo del resultado del carrito.
3. **§4 A-02.** Añadir la decisión de datos que debe tomar Johandry antes de la directiva: metafields se leen si existen y no se crean; qué ocurre con los defaults de bloque (material, gsm, hardware, origin), que son iguales para todos los productos. Incluir la rama `product.type` (product-technical-specs.liquid:55-56) y la prueba en sartorial-edition (leather-desk-mat, folded-valet-tray, milled-brass-paperweight).
4. **§3 o §4 A-03, y §7.** Sustituir "configuración de esquemas" por `motion_style`; el arreglo es solo CSS en base.css:9102-9107 y :9126-9131. Crear la tarea "desplegar Imprint y Archive" (Antigravity, con autorización de Johandry) antes del cierre del Lote A, porque de ella dependen A-03, TT-06, TT-17, G1 y G2 por preset.
5. **§4.** Dar estado (planificado, diferido con motivo o rechazado con motivo) a TT-15, TT-19, TT-51, TT-14 (plantillas del vendedor dentro del ZIP), LV-25, LV-26, LV-27 con TT-04 y la parte de contenido de V-05. Declarar en §1 que los hallazgos de Atelier y Cucuyo quedan fuera del plan.
6. **§4 C-04 y §7.** Convertir G4 en tarea con dueño: release-notes.md en la raíz del ZIP y regla de versión del paquete. Ligar G2 por preset a la tarea del cambio 4.
7. **§2.** Precisar la regla de escritor único cuando GPT usa subagentes: archivos disjuntos dentro del turno de GPT, integración antes de devolver el turno, partición registrada por Antigravity.
8. **§2 y §5.** Definir entradas, salidas y puntos de revisión de Claude (R-0, R-D, R-A, R-B, R-C, R-Demo, R-G de la sección 5 de esta revisión) y asignar a Claude la ejecución independiente de las mediciones TR-SIN.
9. **§4 B-04.** Cerrar la ruta: sections/cart-drawer.liquid:366-368 y theme.js:2358-2368 (el drawer excluye sus propios enlaces), reutilizando el guardado de nota de :2438-2457.
10. **§4 C-03.** Condicionar la división de CSS y JS a que la medición por preset o la remedición del build final baje de los umbrales de G2; de lo contrario, diferir a después del envío.

### Cambios opcionales

- Rebajar las estimaciones de A-01 (código), B-02 y B-04 según la sección 6; separar en D-01 configuración de producción de activos; anotar que C-04 depende de la web pública y de Johandry.
- Anotar en D-02 que TT-105, TT-106 y TT-108 quedan en P3 por decisión del plan, cerrando la discrepancia GPT P2 / Claude P3.
- Reutilizar en las directivas los arneses existentes (tt02.js, g20_g23.js, s2, p3, s8, axe y Lighthouse de `$HOME/livetest`) y nombrarlos en el criterio de cada ítem.
- En B-01, leer el breakpoint desde un atributo data en lugar de repetir 62rem en JS.
- Incluir en la ficha de identidad de §3 el nombre de preview y el ID de tema por tienda (189832593651 main, 189707452659 submission, 188743188704, 188655599784), para cerrar V-06.
- Anotar que el Lote E no bloquea el envío y se evalúa después.

---

## 8. Límites de esta revisión

Solo lectura de código y documentos; no se ejecutó ningún arnés ni se abrió ninguna tienda en esta fase. Las líneas citadas son del ZIP integrado; el checkout codex 09f8342 no es accesible desde este contenedor y su HEAD sigue sin verificar por Claude. No se imprimió ninguna contraseña ni token. Ninguna conclusión garantiza la aprobación de Shopify.
