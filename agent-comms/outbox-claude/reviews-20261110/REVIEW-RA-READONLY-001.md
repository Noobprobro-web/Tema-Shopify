```text
ID: REVIEW-RA-READONLY-001
Estado: ACEPTADO CON CONDICIONES. La corrida es válida como humo R-A de solo lectura. No cierra ninguna fila del ledger. Las condiciones C1 a C4 están al final.
Decisión requerida: ninguna para aceptar la corrida como evidencia de humo. Gemini/Johandry deben saber que el inverso Shift+Tab no está serializado (H1), que la anomalía de foco de archive/390/home no se puede diagnosticar con este JSON (H2) y que el lookbook de Archive no generó en axe la señal que sí generó en Sartorial (H3).
Resumen en 5 líneas:
1. Validez OK: 132 checks, 0 failed y 0 not_run. Identidad Shopify.theme.id verificada en cada goto (run.mjs:214-226). rateLimitEvents=[], routeFailureEvents=[] e interventionRequired=false en las 3 sesiones. 0 URLs, 0 '?', 0 cookies/tokens. Único dominio de tienda: tema-qkqpke0j. STOREFRONT_PASSWORD=0 y SHOPIFY_CLI_THEME_TOKEN=0, con las dos variables definidas.
2. Lo que se demuestra: sin desbordamiento horizontal (documentWidth = viewport en 18/18 vistas, h1Count=1), 32 Tab sin foco oculto/inerte, axe 4.10.2 (29 reglas fijas) con 0 violaciones, nombre visible del idioma = aria-label, 3 secuencias de cruce de menú por preset y drawer vacío que abre/cierra con foco inicial usable.
3. Lo que NO: el resultado del Shift+Tab no está en el JSON (solo se infiere, porque un fallo habría dado failed). Los pasos en body/iframe se descartan en silencio. La secuencia 3 de menú no cruza el corte. No se mide la restauración del scroll ni el contraste del foco. Los incomplete de color-contrast siguen sin resolver.
4. aria-valid-attr-value (4 nodos, solo Sartorial home): es "needs review" por diseño de axe (precheck controlsWithinPopup cuando aria-haspopup no es false/null). El ID existe (lookbook.liquid:73,95,104). No es un defecto del tema.
5. Ledger: las filas 48, 49 y 50 siguen en `código completo`. Ninguna pasa a `cumplido`.
Archivos tocados: solo este informe (nuevo). Sin commit ni push.
Desviaciones (Nivel 1 o Nivel 2): ninguna. No se ejecutó ningún comando de Shopify ni ninguna petición a la tienda. No se abrió .secrets y no se imprimió ningún secreto: los recuentos se hicieron en memoria con os.environ.
Hallazgos extra fuera de alcance (con parche listo): H8 (P3, sin parche): role="button" redundante en <button> (sections/lookbook.liquid:93).
Verificación (comando, resultado y qué demuestra/qué no): scripts python3 -I en línea sobre el JSON (§1-§3), grep sobre run.mjs, tests/vendor/axe.min.js, sections/lookbook.liquid, assets/theme.js y listings/*/templates/index.json, sha256sum del axe vendorizado y git diff cb20d86..ecc2ca3. Demuestran la validez del artefacto y el criterio real del arnés. NO demuestran el comportamiento en un navegador: no he repetido la corrida.
Lista de afirmaciones falsables numeradas: §6.
```

## 1. Validez del artefacto

Archivo: `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/results/RA-RB-read-only-20261111T223754136Z-2606bf16-d94d-46ea-a7d6-89d97ee0a676.json` (388 500 bytes, sin rastrear).

| Punto | Resultado | Evidencia |
| :--- | :--- | :--- |
| Modo y estado | `read-only`, `executionResult=completed`, `scopeResult=completed_with_limits`. La corrida duró de 22:37:54 a 22:39:09Z | cabecera del JSON |
| Checks | 132 en total. Por resultado: passed = 3 storefront_access, 18 page_access, 18 horizontal_overflow, 18 keyboard_tab_smoke, 18 axe_smoke, 6 language, 9 menu_viewport_cross y 6 empty_cart_drawer. observed = 18 axe_rule_summary y 18 axe_platform_warning. 0 failed y 0 not_run | Counter sobre `checks` |
| Identidad | `storefront_access.previewIdVerified=true` ×3. `goto()` llama a `verifyPreview()` en cada navegación, y esa función exige `String(window.Shopify.theme.id) === themeId` y que el id esté en `AUTHORIZED_THEME_IDS` | run.mjs:214-226, run.mjs:17 |
| 429 | `rateLimitEvents=[]` y `rateLimitEventsOmitted=0` en las 3 sesiones | `sessions[*]` |
| Intervención | `interventionRequired=false`, `cartTouched=false` y `cartMutationsAllowed=false`. `historicalIncidents` solo arrastra ARCHIVE_ORPHANED_CART_20261106 (LEAVE_TO_EXPIRE, blocksLote0=false) | raíz del JSON |
| Fallos de ruta | `routeFailureEvents=[]`, `routeWarningEvents=[]` y `routeOperationFailed=false` en las 3 sesiones | `sessions[*]` |
| URLs, cookies y tokens | 0 apariciones de `http`, `?`, `@`, `cookie`, `token`, `Bearer`, `shpat_`, `shptka_`, `_secure_session`, `storefront_digest` y `preview_theme_id`. `password` aparece 3 veces, y las 3 son el valor fijo `pathClass: "password_auth"` | escaneo de cadenas |
| Dominios | El único `*.myshopify.com` es `tema-qkqpke0j.myshopify.com`. Hosts externos, solo como hostname y todos bloqueados: `otlp-http-production.shopifysvc.com`, `error-analytics-sessions-production.shopifysvc.com`, `monorail-edge.shopifysvc.com` (analytics), `shop.app` (GET document, PLATFORM_HOST_BLOCKED, 3 por sesión) y `shopify-assets.shopifycdn.com`. Todos son de Shopify y todos tienen `pathname=null, redacted=true` | `networkWarnings` |
| Claves | run.mjs no tiene una lista blanca formal de claves de informe. Lo que hice fue inventariar las 143 claves del JSON: todas son nombres fijos de esquema (`tabSteps`, `sectionFamily`, `redactionReason`...) y no hay ninguna clave con texto libre, HTML, selector o atributo. Los nodos axe solo llevan categorías fijas (run.mjs:623-650) | recorrido recursivo |
| Secretos | STOREFRONT_PASSWORD: count=0 (también 0 sin distinguir mayúsculas). SHOPIFY_CLI_THEME_TOKEN: count=0. Las dos variables estaban definidas, así que el 0 no es trivial | os.environ en memoria, sin imprimir |
| axe | `sha256(tests/vendor/axe.min.js) = b511cd9d…75e3`, igual al pin de run.mjs:19, y versión `4.10.2`. La corrida anterior del 10-11 falló justo por `AXE_SOURCE_DIGEST_NOT_EXPECTED`, y ecc2ca3 corrigió el pin | sha256sum, git diff |
| Contenido del tema | `git diff --stat cb20d86 ecc2ca3 -- assets sections snippets layout templates config locales listings` está vacío: entre el commit sincronizado y HEAD no cambió ningún archivo del tema | git |

Límite de validez (P3, H6): el JSON no registra ni el commit ni ninguna huella del contenido del tema. La relación "preview = cb20d86" depende de REVIEW-SYNC-RESULT-001, no de este artefacto. `unpublishedPreflight` vale `required_external_coordinator_check`: el arnés no comprueba por sí mismo que los temas no estén publicados.

## 2. Lo que demuestra el JSON frente a lo que afirmó el resumen del ejecutor

| Afirmación | En el JSON | Veredicto |
| :--- | :--- | :--- |
| Sin desbordamiento | 18/18 vistas con `documentWidth == viewportWidth` (390/1280) y `h1Count=1` dentro de `main` | Demostrado, solo para `scrollWidth` del documento. Un contenedor con `overflow:hidden` que recorte contenido no se detecta |
| Foco: 32 Tab | 17/18 vistas con 32/32 pasos usables. archive/390/home tiene 29 usables, 2 iframe externo y 1 body | Demostrado como "ningún paso cae en un elemento oculto, de tamaño 0 o inerte" (run.mjs:576,598). No demuestra el orden, la visibilidad del indicador ni el contraste |
| Foco: Shift+Tab | **No hay ningún campo en el JSON.** run.mjs:602-604 ejecuta un único Shift+Tab y lo usa como compuerta (`reverse.usable \|\| reverse.externalFrame`), pero no lo serializa | Inferido, no evidenciado (H1). Que `keyboard_tab_smoke=passed` implica que la compuerta pasó. Además la compuerta acepta un iframe externo como inverso válido |
| Indicador CSS | 31/32 en 17 vistas y 28/29 en archive/390/home: siempre falta 1 paso sin outline ni box-shadow | Observación (`cssIndicatorIsObservationOnly=true`). No se sabe qué elemento es (H7) |
| axe 0 violaciones | `violations=[]` en 18/18 vistas, con 29 reglas seleccionadas y `unavailableFixedRuleCount=0`. Cada vista tiene 1 nodo del preview bar filtrado como `axe_platform_warning` (run.mjs:661-671: solo se descarta una regla si **todos** sus nodos son del preview bar) | Demostrado para el subconjunto de 29 reglas en el documento principal. Los iframes no se analizan |
| axe incomplete | `color-contrast` (serious) en 18/18 vistas, con 2 a 17 nodos (archive/1280/home=17 e incluye `hero_editorial` h1/p/span). `aria-valid-attr-value` (critical) con 4 nodos, solo en sartorial/home (390 y 1280) | Pendiente de revisión, no superado. Ver §4 y H5 |
| Idioma | 6/6 con `labelsContainVisibleText=true`. visibleControls=1 en 390 y 2 en 1280. `actualLanguageChangeNotTested=true` | Demostrado solo para la coincidencia de nombre visible ↔ aria-label (2.5.3). No se probó el cambio de idioma |
| 3 cruces de menú | Seq1 390→1280→390: cierra en 1280 (`expanded=false`) y sigue cerrado al volver. Seq2 820→1180: cierra. **Seq3 390→844×390: `triggerVisible=true, expanded=true`**, es decir, no cruza el corte | Hay 2 cruces reales por preset, no 3 (H4). Al cerrar se verifica: aria-expanded=false, body sin `data-drawer-open`, `main` no inerte y foco "usable o iframe" (run.mjs:701-707). La restauración del scroll no se mide |
| Drawer vacío | 6/6: `opened`, `closed`, `usableInitialFocus` y `sectionRenderingResponseVerified` | Demostrado: abre, el panel es visible, el foco inicial es usable y cierra con el botón (run.mjs:744-754). No se prueban la trampa de foco, Escape, la restauración del foco al enlace del carrito ni el texto del estado vacío |

## 3. Anomalía de foco archive/390/home (29 + 2 iframe + 1 body)

Criterio del arnés (run.mjs:568-607):
- Un paso cuenta como `externalFrame` si `activeElement.tagName === 'IFRAME'`. No se registra qué iframe es (run.mjs:572).
- Un paso cuenta como `body` si `activeElement` es body o html (run.mjs:571).
- Ninguno de los dos casos hace fallar el check: los dos se cuentan y se saltan con `continue` (run.mjs:596-597). Solo falla un elemento real que esté oculto, tenga tamaño 0 o sea inerte (run.mjs:598).
- Solo se serializan recuentos, no la secuencia ni la identidad de cada paso.

Hipótesis fundada (la más parsimoniosa): **el recorrido llega al final del orden de tabulación del documento y vuelve al principio.** No sería un defecto del tema. Indicios:
- Con 32 Tab desde body, las demás vistas no llegan nunca a un iframe ni a body, así que tienen al menos 32 paradas. archive/390/home tiene exactamente 29 paradas del tema. Después vienen 2 pasos dentro de uno o más iframes externos situados al final del DOM: el preview bar de `cdn.shopify.com` (host permitido) o el documento `shop.app` bloqueado, que aparece 3 veces por sesión en `networkWarnings`. Luego 1 paso en body, que es el salto de salida del documento en Chromium headless. 29+2+1=32.
- Archive tiene la home más corta. El orden de `listings/archive/templates/index.json:130` incluye 7 secciones, sin bento-discovery ni complete-the-look, y su curated-showcase tiene 2 bloques. A 390 la navegación del header está plegada en el drawer. La misma página a 1280, con más enlaces de cabecera, da 32/32. Collection y product a 390 también dan 32/32.
- Encaja con H3: si el lookbook de Archive no renderiza los 3 botones hotspot, la página pierde 3 paradas.

Hipótesis alternativa que no puedo descartar con este JSON: una pérdida de foco a body a mitad de página (un elemento enfocado que se elimina o se oculta) más un iframe dentro de la página (por ejemplo, un `media_tag` de vídeo externo del featured product, snippets/product-media.liquid:23-24). El arnés no distingue los dos casos.

Conclusión: no hay evidencia de un defecto del tema, y el ruido más probable es la combinación de preview bar/iframe externo y el final del documento. Sí hay una debilidad del arnés: la compuerta acepta en silencio body e iframes en cualquier posición. Condición C2.

## 4. aria-valid-attr-value en el lookbook de Sartorial

- Nodos: 4 `button` dentro de `section.lookbook`, en `main`, con `hasAriaLabel=true`. Son los 4 hotspots de `listings/sartorial/templates/index.json:59-65` (marker1 a marker4).
- Atributos del botón (sections/lookbook.liquid:90-99): `aria-label` (:94), `aria-controls="{{ popover_id }}"` (:95), `aria-haspopup="dialog"` (:96) y `aria-expanded="false"` (:97).
- El ID existe: `popover_id` se asigna en :73 y el `div` del mismo bloque lo lleva como `id` en :104 (con `hidden` e `inert`, pero está presente en el DOM). El JS lo resuelve con `document.getElementById(popoverId)` y `this.contains(popover)` (assets/theme.js:4442-4444). Tampoco hay ningún `aria-describedby` ni otro atributo idref en el botón.
- Causa en axe 4.10.2 (tests/vendor/axe.min.js, `aria-valid-attr-value-evaluate`): el precheck de `aria-controls` pone `needsReview` con el mensaje `controlsWithinPopup` ("Unable to determine if aria-controls referenced ID exists on the page while using aria-haspopup") siempre que `aria-haspopup` no sea `false`/null, exista o no el ID. Por eso el resultado es `incomplete` y no una violación.
- Veredicto: **falso positivo / revisión manual por diseño de axe. No es un defecto de accesibilidad del tema.** La única nota cosmética es el `role="button"` redundante de :93 (H8).
- Alcance: afecta a cualquier preset que renderice hotspots con producto. Imprint no tiene lookbook (su orden no lo incluye). Archive sí lo tiene, con 3 bloques (`listings/archive/templates/index.json:73-80`), pero **no produjo el incomplete** (H3). La plantilla base `templates/index.json:149-150` también tiene lookbook y no se probó en esta corrida.

## 5. Mapa al ledger (docs/requirements-ledger.md)

| Fila | Estado actual | Qué aporta esta corrida | Qué NO aporta | Estado tras la corrida |
| :--- | :--- | :--- | :--- | :--- |
| 48, Contraste no-texto ≥3:1 (A-03 pendiente de R-A en Imprint/Archive) | `código completo` | Que el anillo existe como outline/box-shadow computado en 31/32 paradas de Imprint y Archive (observación) | La medición del contraste del anillo technical/heritage, que es el núcleo de A-03 en 1.4.11. `NO_SCREEN_READER_OR_VISUAL_CONTRAST_CERTIFICATION` | `código completo` |
| 49, Teclado e indicador (A-03) | `código completo` | 32 Tab sin foco oculto ni inerte en home/collection/product a 390 y 1280 en los 3 presets, y una compuerta Shift+Tab que pasó | El orden, la visibilidad real del indicador (2.4.7, el paso sin indicador) y el inverso serializado, y explica la anomalía de Archive solo por hipótesis | `código completo` |
| 50, Focus trap y drawers (B-01) | `código completo` | 2 cruces reales del corte por preset con cierre, aria-expanded=false, body sin `data-drawer-open`, `main` no inerte y foco usable. Además, el drawer de carrito vacío abre y cierra | La restauración del scroll (parte declarada de B-01), la restauración del foco a un destino concreto, la trampa de foco, Escape y la secuencia 3 como cruce | `código completo` |

Ninguna fila cambia de estado: una corrida humo no cierra filas (RULES §2, compuerta 5). La fila 47 (contraste de texto) dice "axe-core 4.10.2: 0 violaciones en todas las vistas". Eso sigue siendo cierto, pero los `color-contrast` incomplete en `hero_editorial` de Archive (h1/p/span) quedan sin resolver y no deben leerse como confirmación de AF-01.

## Hallazgos

| ID | Sev. | Hallazgo | Ruta |
| :--- | :--- | :--- | :--- |
| H1 | P2 | El Shift+Tab no se serializa, es un solo paso y acepta un iframe externo como inverso válido. Afirmar "32 Tab + Shift+Tab" es correcto como compuerta, pero no hay dato | run.mjs:602-606 |
| H2 | P2 | Los pasos en body e iframe se aceptan en silencio en cualquier posición y sin identidad. La anomalía de archive/390/home no se puede diagnosticar con el JSON | run.mjs:571-572, 596-597 |
| H3 | P2 | Asimetría en el lookbook de Archive: tiene 3 hotspots configurados pero 0 incomplete `aria-valid-attr-value`, mientras Sartorial da 4 con 4 bloques. Como la señal de axe es determinista con aria-haspopup+aria-controls, lo probable es que los botones no se rendericen en Archive (producto en blanco, lookbook.liquid:69-71) o estén ocultos. Sería un estado degradado del contenido demo que hay que confirmar | listings/archive/templates/index.json:73-80; sections/lookbook.liquid:69-71 |
| H4 | P3 | La secuencia 3 de menú (390→844×390) no cruza el corte, así que el resumen de "3 cruces" es en realidad 2 cruces más 1 rotación sin cruce | run.mjs:38-40 (CROSSES); JSON seq 3 |
| H5 | P3 | Los `color-contrast` incomplete (2 a 17 nodos por vista, incluidos header/footer, curated_showcase y el hero de Archive) requieren revisión manual y no son un "pasa" | JSON axe_rule_summary |
| H6 | P3 | Falta procedencia: el JSON no registra commit ni huella del tema, y el preflight de no publicado es externo | raíz del JSON; run.mjs:981 |
| H7 | P3 | En todas las vistas hay 1 parada sin outline/box-shadow, sin identificar. Podría tener un estilo alternativo legítimo, pero está sin verificar | run.mjs:577 |
| H8 | P3 | `role="button"` redundante en `<button>` | sections/lookbook.liquid:93 |
| H9 | P3 | Lo que el drawer vacío no prueba: trampa, Escape, restauración del foco y texto vacío | run.mjs:715-756 |

## Condiciones

- C1: no usar esta corrida para mover ninguna fila a `cumplido`.
- C2: antes de citar el inverso o la anomalía de Archive como evidencia, ampliar el arnés para serializar por paso `{tag, sectionFamily, frame(familia), body}` y el estado del Shift+Tab (con categorías fijas, como ya hacen los nodos axe), y volver a ejecutar archive/390/home.
- C3: confirmar en una prueba de solo lectura cuántos `[data-lookbook-trigger]` renderiza la home de Archive (H3). Si son 0, abrir una tarea de contenido demo/catálogo.
- C4: los incomplete de `color-contrast` y la medición del anillo de foco (filas 47 y 48) necesitan una medición visual dedicada. Este humo no la sustituye.

## 6. Afirmaciones falsables

1. El JSON tiene 132 checks: 0 `failed`, 0 `not_run`, 36 `observed` y 96 `passed`.
2. `rateLimitEvents` está vacío y `interventionRequired=false` en las 3 sesiones.
3. El JSON contiene 0 apariciones de `http`, de `?` y de los valores de STOREFRONT_PASSWORD y SHOPIFY_CLI_THEME_TOKEN.
4. El único host `*.myshopify.com` es `tema-qkqpke0j.myshopify.com`. Todos los hosts externos son de Shopify y tienen `pathname=null`.
5. Ningún campo del JSON registra el resultado del Shift+Tab.
6. archive/390/home: tabSteps=32, usable=29, externalFrame=2, body=1, cssIndicator=28. Las otras 17 vistas: 32/32/0/0 y 31.
7. `aria-valid-attr-value` aparece solo en sartorial/home 390 y 1280, con 4 nodos `button` de la familia `lookbook`.
8. tests/vendor/axe.min.js contiene `controlsWithinPopup` en el precheck de `aria-controls`, condicionado a `aria-haspopup`.
9. sha256 de tests/vendor/axe.min.js = `b511cd9dec01c76f4b2ad1723b66b6db37d4c2eb4ed199076e1829d9ee7b75e3` = run.mjs:19.
10. `git diff --stat cb20d86 ecc2ca3` sobre los directorios del tema está vacío.
11. La secuencia 3 de `menu_viewport_cross` registra `triggerVisible=true, expanded=true` a 844×390 en los 3 presets.

## Nota final (condicion C4 de la sesion 20261111)

Los paths del JSON de R-A de 2026-11-11 tambien estan redactados por el falso positivo SECRET_MATCH de run.mjs:323 (OLDPWD="/"), segun REVIEW-RB-CART-001. El veredicto de esta revision no cambia.
