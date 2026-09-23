ID: GPT-REPORT-5C-001
Estado: ENTREGADO PARA AUDITORIA; codigo completo local, Gate 5 pendiente.
Decision requerida: Gemini debe revisar el diff, decidir donde montar la seccion y los bloques en el editor, y coordinar prueba en tienda real antes de aceptar o publicar. No se hizo commit ni push.
Resumen en 5 lineas:
1. Se creo la seccion opcional Recently viewed, con historial local de maximo ocho IDs y busqueda renderizada por Shopify.
2. Se agregaron inventario reactivo, plazo de entrega, mensaje de devoluciones y acordeones nativos a ambos PDP.
3. CartDrawer.addItem anuncia producto y variante tras confirmar que Shopify agrego la linea.
4. El CSS 5C-002 se agrego exclusivamente al final de base.css; las claves EN/ES mantienen paridad.
5. Theme Check termino con 0 ofensas; las pruebas de navegador fueron locales con respuestas simuladas, no Gate 5.
Archivos tocados: sections/recently-viewed.liquid; snippets/product-inventory.liquid; snippets/product-accordion.liquid; sections/main-product.liquid; sections/featured-product.liquid; assets/theme.js; assets/base.css; locales/en.default.json; locales/es.json; locales/en.default.schema.json; este informe.
Desviaciones (Nivel 1 o Nivel 2): Nivel 1: el setting heading queda vacio en el editor y el escaparate muestra el default traducido por `sections.recently_viewed.heading`. Un default de texto fijo en el schema se guardaria en ingles y romperia la experiencia ES sin Translate & Adapt. Nivel 1: el anuncio del carrito reutiliza el prefijo ya traducido `sections.cart.added` y anexa `producto - variante`; transmite los mismos datos solicitados, aunque no reproduce literalmente la sintaxis de ejemplo. Nivel 2: ninguna.
Hallazgos extra fuera de alcance (con parche listo): La seccion y los nuevos bloques no aparecen en la tienda hasta que se agreguen en el editor; no se alteraron templates/*.json por la particion de archivos. Accion para Gemini: agregar `recently-viewed` en las plantillas donde se quiera exhibir y los bloques `inventory_status`, `shipping_lead_time`, `trust_badges` y `collapsible_tab` a los PDP del demo; conservar sus IDs y configuracion al exportar el preset. No hay defecto de codigo confirmado fuera del alcance.
Verificacion (comando, resultado y que demuestra/que no):
- `node --check assets/theme.js` -> salida vacia, codigo 0. Prueba parseo JS, no comportamiento en Shopify.
- `cmd.exe /c "npx shopify theme check"` fuera del sandbox -> `122 files inspected with no offenses found.` Prueba validaciones estaticas de Theme Check, no render ni UX en tienda. Dentro del sandbox falla por `uv_os_get_passwd returned ENOMEM`, problema conocido del entorno.
- `node scripts/theme-check-sanity.mjs` fuera del sandbox -> `detectado LiquidHTMLSyntaxError`, `detectado TranslationKeyExists`, `detectado ValidSchemaTranslations`, `OK`. Prueba que estas tres reglas estan activas, no cobertura exhaustiva.
- `node scripts/json-validate.mjs` -> `Archivos .json comprobados: 70`, `Fallos de parseo: 0`. Prueba sintaxis JSON.
- `node scripts/locale-key-inventory.mjs` -> `Sin resolver en storefront: 0`, `Sin resolver en schema: 0`, `Construidas en runtime: 0`. Hubo 61 claves schema huerfanas preexistentes; la comprobacion no demuestra traduccion visual.
- Comparacion de hojas con Node -> `EN 403 ES 403 missing ES [] missing EN []`. Prueba paridad de claves storefront.
- `node scripts/dataset-hooks.mjs` -> `Contratos rotos: 0`. Prueba presencia de hooks de datos, no valores runtime.
- `node scripts/ledger-verify.mjs` -> `Filas de requisito: 54`, `Incoherencias: 0`. No se cierra ni modifica ninguna fila del ledger en este track; Gemini debe registrar las nuevas funciones como `codigo completo` hasta Gate 5.
- `git diff --check -- assets/base.css assets/theme.js locales/en.default.json locales/es.json locales/en.default.schema.json sections/main-product.liquid sections/featured-product.liquid` -> codigo 0, solo avisos de futura conversion LF/CRLF. No inspecciona archivos nuevos no trackeados.
- Playwright local con `assets/theme.js` real y HTML/Ajax simulados: historial `stored [123,111,222]`, consulta `q=id%3A111+OR+id%3A222`, tarjetas finales `[111,222]` pese a respuesta desordenada y producto intruso; estados `low_stock`, `preorder`, `sold_out`, `unavailable`. Codigo 0. Prueba estado cliente, no Section Rendering en la tienda.
- Playwright local, historial vacio salvo el PDP actual -> `{"fetches":0,"stored":["10"],"hidden":true}`, codigo 0. Prueba que no se consulta ni se muestra la misma ficha.
- Playwright local, historial largo -> `{"q":"id:1 OR id:2 OR id:3 OR id:4","stored":["10","1","2","3","4","5","6","7"],"cards":["1","2","3","4"]}`, codigo 0. Prueba limite de ocho IDs y cuatro tarjetas mostradas.
- Playwright local de toggles: `{"vendor":false,"secondary":false,"action":false,"mode":"none"}`, codigo 0. Prueba que la configuracion del componente prevalece sobre HTML con defaults de Shopify.
- Playwright local de `CartDrawer.addItem` con Ajax exitoso simulado: `{"matches":true,"hidden":false,"pending":null}`, codigo 0. Prueba que la region viva recibe producto/variante y limpia pending; el primer intento fallo por charset del mock y se repitio con UTF-8. No prueba una compra real.
Lista de afirmaciones falsables numeradas:
1. `sections/main-product.liquid:58` registra el ID del PDP; `assets/theme.js:1009-1032` conserva hasta ocho IDs, recientes primero, sin duplicados y tolera localStorage bloqueado.
2. `sections/recently-viewed.liquid:9-48` nace oculto; `assets/theme.js:1034-1124` excluye el producto actual, consulta `/search` con `section_id`, ordena por historial y rechaza IDs ajenos.
3. `sections/recently-viewed.liquid:16-18,38-44` y `assets/theme.js:1090-1114` preservan los tres toggles del editor aunque `/search` renderice la seccion con settings por defecto.
4. `snippets/product-inventory.liquid:1-49` y `assets/theme.js:972-1007` implementan estados de stock; los JSON de variantes de ambos PDP exponen management, quantity y policy (`sections/main-product.liquid:707`, `sections/featured-product.liquid:462`).
5. `snippets/product-accordion.liquid:10-30` usa `details/summary` y conserva el contenido de pagina compartida sin depender de JS.
6. `assets/theme.js:2377-2387` anuncia nombre y variante solo despues de validar la respuesta y la linea fresca; `textContent` evita interpretar HTML del catalogo.
7. `assets/base.css:8405-8519` contiene los estilos nuevos al final, con summary de al menos 56px por el estilo existente, foco visible y movimiento desactivable.
8. Sigue sin evidencia de Gate 5 para Section Rendering, render bilingue real, inventario de 40 variantes, titulo de 120 caracteres, imagen ausente y anuncio de compra real. Gemini/QA debe falsificar esos casos tras montar y desplegar en tienda de desarrollo.

Referencia oficial que motiva la proteccion de settings en el cliente: Shopify documenta que Section Rendering usa ajustes por defecto cuando la seccion no existe en la plantilla consultada: https://shopify.dev/docs/api/ajax/section-rendering. El comportamiento del ID de busqueda y de esta nueva seccion aun requiere verificacion en la tienda real.
