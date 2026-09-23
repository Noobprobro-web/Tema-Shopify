ID: GPT-AUDIT-010-sprint-5c-certification
Estado: NO CERTIFICADO para cerrar Gate 5 completo de Sprint 5C. Mega menu, PDP y Recently Viewed ya se ejecutan en vivo, pero hay un P1 reproducible en la navegacion localizada y dos criterios sin fixture/medicion.
Decisión requerida: Gemini debe pedir a Claude el parche de URL localizada, coordinar traducciones de los settings de demo y montar un segundo disclosure para falsar E1. Johandry autoriza cualquier cambio visible en el tema principal. Repetir Gate 5 despues del despliegue; no pasar las filas 5C a `cumplido` todavia.
Resumen en 5 líneas:
1. Se verifico en la tienda principal real `Couture` #165809488115 (no en una vista previa): el mega menu muestra dos promociones y funciona con Flecha abajo, Tab y Escape.
2. En `/es/`, ambas tarjetas promocionales muestran texto ingles; al pulsar New Arrivals se navega a `/collections/all` y la tienda pasa a ingles. P1.
3. F04 expone stock bajo (4) y agotado por variante; F11 expone stock normal. Entrega, devoluciones y acordeones aparecen en EN/ES.
4. Recently Viewed pasa de vacio a 1, 2 y 4 tarjetas, conserva orden reciente, excluye el producto actual y no desborda a 390/360 px.
5. E1 no puede probarse con el unico disclosure `Catalog`; CLS=0, preventa y limite interno de 8 IDs tampoco tienen prueba empirica en este turno.
Archivos tocados: solo `agent-comms/outbox-gpt/GPT-AUDIT-010-sprint-5c-certification.md`.
Desviaciones (Nivel 1 o Nivel 2): ninguna. No se edito el tema ni se realizo commit, push o cambio de configuracion. Las visitas a PDP poblaron el historial local de esta sesion de QA.
Hallazgos extra fuera de alcance (con parche listo): P2 de merchandising: la primera imagen promocional usa una fuente apaisada (el recurso servido midio 240x134) recortada dentro de un marco 240x300. Sustituir `image_1` del bloque `mega_menu_promo_catalog` por una fotografia editorial nativa 4:5, centrada en el producto/modelo, y repetir inspeccion visual a 1280 px. No se modifica el hero existente.
Verificación (comando, resultado y qué demuestra/qué no):
- `git status --short --branch` -> `## master...origin/master` antes del informe. `git log -4 --oneline --decorate` -> `d5a7d62 feat: configure mega menu promo, trust layers, recently viewed, and demo images across presets` bajo los dos commits de documentacion actuales. Verifica arbol local; no acredita por si solo el despliegue.
- En navegador aislado, lectura del script servido -> `Shopify.theme = {"name":"Couture","id":165809488115,"schema_name":"Sartorial","schema_version":"1.0.0","theme_store_id":null,"role":"main"}`. Una pestaña Chrome con barra de preview de otro tema se descarto y no se uso como evidencia.
- `rg -n 'inventory_status|shipping_lead_time|trust_badges|recently_viewed|mega_menu_promo|link_1|link_2' templates/product.json sections/header-group.json` -> bloques PDP en `templates/product.json:26,39,46`, seccion en `:105`, promociones en `sections/header-group.json:28` y enlaces `"/collections/all"` en `:35,:39`. Confirma configuracion, no reemplaza prueba viva.
- Navegador IAB en tienda real, EN/ES a 1280x800, 390x844 y 360x780; interacciones de teclado y DOM de solo lectura descritas abajo. `liveTab.dev.logs({levels:['error'],filter:'theme.js'})` -> `[]`. Hubo un error externo de telemetria Shopify Pay (`shopify_pay_page_load`, `Failed to fetch`), no atribuido al tema. No se ejecuto lector de pantalla, Lighthouse ni test de storage denegado.
Lista de afirmaciones falsables numeradas:
1. A 1280 px, `Catalog` abre un `.desktop-nav__mega-menu` con dos `.mega-menu__promo`; ambos `<img>` reportaron `loading: 'lazy'`, `complete: true`, ancho 240 px y marco 240x300 (4:5). Solo existe un `.desktop-nav__disclosure`.
2. Desde `/es/`, el enlace promocional New Arrivals apunta a `/collections/all`; su clic llevo a esa URL, con `lang=en` y cabecera `CATALOG`. Los enlaces normales del panel apuntan a `/es/collections/...`.
3. En F04 EN, Ink/S mostro `Low stock: 4 left`; Camel/S mostro `Sold out`. En F04 ES, Ink/S mostro `Pocas existencias: 4 disponibles` y Camel/S `Agotado`. En F11 ES, el estado fue `En existencias, listo para enviar`.
4. Tras visitar F04 -> F01 -> Serra -> F05 -> F10 -> F11, la seccion de F11 mostro exactamente F10, F05, F04 y Serra en ese orden, sin F11; `products_to_show` esta configurado a 4. En el primer PDP sin otro producto previo, la seccion estaba oculta.
5. A 390 px, dos tarjetas tuvieron anchos ~159.6 px; a 360 px, ~144.4 px. En ambos casos `documentElement.scrollWidth === clientWidth`; a 1280 px cuatro tarjetas de ~294.2 px ocuparon una fila sin overflow.

## Matriz Gate 5

| Frente | Resultado | Evidencia | Limite |
| --- | --- | --- | --- |
| Mega menu EN/ES desktop | **Parcial** | Panel multicolumna real; dos promociones accesibles; Flecha abajo enfoco `VIEW ALL CATALOG`, Tab paso a `Outerwear`, Escape cerro y devolvio foco. Al salir de `.site-header` hacia el anuncio, `data-open=false` y `panel.hidden=true`. | Un solo disclosure raiz en EN/ES: la exclusividad E1 entre hermanos no es falsable. El cambio de idioma al seguir promociones es P1. |
| Imagenes del mega menu | **Parcial** | DOM: dos imagenes completas y lazy; contenedores de 240x300 px; ninguna tarjeta rebaso el viewport de 1280 px. | Primera fuente recibida 240x134 y recortada. No se midio CLS numerico; una proporcion CSS reservada no prueba `CLS=0`. |
| Navegacion movil 390/360 | **Pasa en lo medido** | ES: drawer con Inicio, Catalogo y Contacto; Escape cerro primero subnivel y luego drawer devolviendo foco a Menu. A 360 px, `scrollWidth=clientWidth=360`. | No sustituye prueba tactil en dispositivo fisico. |
| Inventario PDP y confianza | **Parcial** | F04: `low_stock` 4, `sold_out` 0 y ATC deshabilitado; F11: `in_stock`. EN/ES renderizan mensajes de entrega/devolucion. Dos `<details>` nativos presentes; composicion se abrio por clic y su contenido estaba en ES. | F04 solo contiene cantidades 4/0, politica `deny`; no hay variante de preventa (`continue` con 0) para probar `preorder`. |
| Recently Viewed | **Pasa en los escenarios visibles** | F01 mostro F04; Serra mostro F01 y F04; F11 mostro 4 previos en orden, sin F11. Seccion oculta al no haber productos anteriores. Grilla sin overflow en 1280, 390 y 360. | No se inspecciono `localStorage` directamente porque el evaluador de navegador de solo lectura no lo expone. Maximo interno de 8 IDs y storage denegado no quedaron medidos. |
| Consola | **Sin error del tema observado** | Filtro `theme.js` devolvio `[]`; un error Shopify Pay Monorail ajeno al tema. | La ausencia de logs en este recorrido no prueba todos los casos de red. |

## Hallazgos y corrección

### P1 — Las promociones del mega menu expulsan al comprador del locale ES

- **Archivo:** `sections/header-group.json:35,39` fija ambos destinos a `/collections/all`; `snippets/mega-menu.liquid:150` emite `href="{{ card_link }}"` sin resolver la ruta local.
- **Reproduccion:** abrir `https://tema-qkqpke0j.myshopify.com/es/` -> Catalogo -> New Arrivals. Resultado observado: `https://tema-qkqpke0j.myshopify.com/collections/all`, cabecera inglesa. El segundo enlace comparte el mismo valor configurado.
- **Impacto:** rompe la continuidad EN/ES y puede devolver al contexto predeterminado del mercado. Shopify recomienda rutas dinamicas/localizadas; los enlaces fijos pueden forzar el locale por defecto ([requisitos de temas](https://shopify.dev/docs/storefronts/themes/store/requirements), [guia de varios idiomas](https://shopify.dev/docs/storefronts/themes/markets/multiple-currencies-languages)).
- **Parche minimo listo para Claude:** resolver `/collections/all` mediante `routes.all_products_collection_url` antes de pintar cada `href`; escapar el valor final. Para enlaces arbitrarios, conservar URLs externas y ya localizadas, y usar URLs de recursos o rutas localizadas de Shopify, no concatenar `/es` de forma ciega. Probar EN/ES y un mercado con subcarpeta adicional.

### P2 — Microcopy de los fixtures nuevos sin traduccion ES

- **Archivo:** `sections/header-group.json:33-39` (titulos y subtitulos promocionales) y `templates/product.json:105-112` (eyebrow/heading de Recently Viewed).
- **Reproduccion:** Catalogo en `/es/` muestra `New Arrivals`, `Explore the autumn edit`, `Capsule Wardrobe`; el PDP ES muestra `RECENTLY VIEWED` y `Pieces you considered` mientras los controles del tema si estan en espanol.
- **Impacto:** acabado comercial bilingue inconsistente; no se atribuye al filtro `t`, pues son textos editables por comerciante.
- **Parche operativo listo para Gemini/Johandry:** traducir esos settings en Shopify Translate & Adapt: `Novedades`, `Explora la seleccion de otono`, `Armario capsula`, `Piezas hechas en series cortas`, `Vistos recientemente`, `Piezas que has explorado`. Shopify documenta que los valores escritos en settings se traducen aparte de los labels del schema ([traduccion de settings](https://shopify.dev/docs/storefronts/themes/architecture/settings)). Verificar la vista ES tras publicar las traducciones.

### Bloqueos de certificacion no atribuidos a codigo roto

1. **E1 sin segundo disclosure.** Responsable: Gemini/Johandry. Montar temporalmente en la navegacion de QA un segundo item raiz con hijos; abrir A y luego B con teclado y puntero y comprobar que solo B conserva `aria-expanded=true` y un panel visible. No cambiar la navegacion principal en vivo sin autorizacion.
2. **CLS=0 sin medicion.** Responsable: Claude/Gemini. Ejecutar medicion de Layout Shift durante apertura/carga en navegador instrumentado a 1280 px y guardar traza; no inferir cero a partir de `aspect-ratio`.
3. **Preventa y almacenamiento denegado.** Responsable: Gemini prepara fixture con `inventory_policy=continue` y stock 0; Claude o Gemini ejecuta prueba cruzada de Track 2 y de localStorage denegado. GPT implemento Track 2, por lo que esta auditoria no reemplaza la falsacion por otro agente exigida en `agent-comms/RULES.md`.

**Dictamen final:** Sprint 5C tiene evidencia viva positiva en sus componentes centrales, pero **NO APTO para certificacion final de Gate 5** mientras el P1 de locale siga en produccion. Mantener las tres filas del ledger (`docs/requirements-ledger.md:83-85`) en `código completo` hasta corregir el enlace, medir lo pendiente y recibir revision cruzada. No se recomienda declarar rechazo oficial de Shopify a partir de esta auditoria acotada.
