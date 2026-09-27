# GPT-AUDIT-012 | Auditoría 360° de pre-submission

ID: GPT-AUDIT-012
Estado: ENTREGADO; **NO APTO** para envío hoy.
Decisión requerida: Johandry y Gemini deben resolver la oferta de tres frente a cuatro presets, publicar documentación/soporte y aportar pruebas de demos y Lighthouse; Claude debe corregir los defectos de código priorizados abajo.
Resumen en 5 líneas:
1. Dos URLs comerciales del `theme_info` responden 404: bloqueo de publicación confirmado.
2. Theme Check pasa, pero hay una infracción de URLs de assets y una carrera reproducida en el carrito.
3. Una prueba móvil perdió el foco de teclado; otras pruebas mostraron opciones agotadas ambiguas y cápsulas demo sin configurar.
4. El paquete contiene tres presets instalables, no los cuatro de la solicitud; las tres demos requeridas y Lighthouse siguen sin evidencia de cierre.
5. El presupuesto de dos horas sirve para algunos parches, no para dar por terminadas tiendas demo, contenido de soporte y mediciones reales.
Archivos tocados: solo este informe. Ningún archivo de tema, script, ledger o tablero modificado.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación; la auditoría no autoriza cambios de contrato. Añadir un cuarto preset, alterar defaults o cambiar el contrato comercial requiere decisión de Johandry y directiva de Gemini (Nivel 2).
Hallazgos extra fuera de alcance (con parche listo): hay tres scripts ya staged en `scratch/`; al menos dos incluyen una credencial de storefront en texto claro. Excluirla/redactarla antes de cualquier commit y rotarla si se ha compartido; no toqué esos archivos. `BOARD.md` tiene un resumen inicial obsoleto sobre cinco fixes ya resueltos más abajo; Gemini debe sincronizarlo.
Verificación (comando, resultado y qué demuestra/qué no): véase la sección **Evidencia y límites**.
Lista de afirmaciones falsables numeradas: (1) ambas URLs devuelven 404; (2) existen tres presets locales; (3) la barra fija puede mandar el foco a `BODY` en móvil; (4) dos altas simultáneas pueden dejar el drawer con una sola línea; (5) Theme Check en verde no prueba demos, accesibilidad integral ni Lighthouse.

## 1. Cuadro de mando

**Veredicto: NO APTO.** Observaciones consolidadas, sin duplicar hallazgos entre los cinco auditores: **P0 1, P1 5, P2 8, P3 1**. Tres de las P2 son riesgos de código/editor todavía sin reproducción en una compra real y se identifican como tales. Un P1 de experiencia comercial no equivale por sí solo a rechazo automático de Shopify; la columna de la matriz distingue esa situación.

El [reglamento oficial de Theme Store](https://shopify.dev/docs/storefronts/themes/store/requirements) exige documentación y soporte públicos, una demo por preset instalable, assets enlazados con URL relativa al protocolo y promedios Lighthouse de **60 rendimiento / 90 accesibilidad** en home, producto y colección, móvil y escritorio. Para las demos exige tiendas **Client transfer** con **Bogus Gateway o Shopify Payments en modo prueba**, no necesariamente un sistema de tickets específico. El proyecto fija 44 px como objetivo táctil; no debe presentarse como mínimo universal de WCAG 2.2, que admite 24 px o excepciones.

**Puertas abiertas sin prueba suficiente (no sumadas al conteo de bugs):** `docs/requirements-ledger.md` filas 107 (soporte/documentación) y 108 (demos) figuran `no verificado`; las filas 35 y 72 figuran `código completo`. No se recibieron enlaces verificables a tres Client transfer stores ni medición Lighthouse estandarizada. No afirmo que las tiendas no existan: su existencia y conformidad están **NO VERIFICADAS**. Los informes anteriores de axe y Nu HTML son pruebas parciales del momento medido, no garantía de todas las vistas y estados; el barrido independiente de 28 páginas posterior a NF-01 no se reprodujo en esta auditoría.

## 2. Cinco estados degenerados

| Estado | Prueba observada | Veredicto y siguiente prueba |
| --- | --- | --- |
| Vacío | Carrito vacío: foco, `Escape` y retorno al disparador funcionaron; búsqueda sin resultados anunció cero sugerencias. | **Parcial.** Faltan colección sin productos y blog sin artículos en tienda, más drawer después de borrar la última línea. |
| Único | F01 mostró una variante, ningún control de variante innecesario y ATC; carrito vacío observado. | **Parcial.** Falta colección de un producto y blog de un artículo. |
| Masivo | Código de colección/búsqueda usa paginación; recently viewed usa `limit`; no bucle sin límite probado. | **NO VERIFICADO** en 15+ imágenes, 80+ variantes ni 500 productos paginados; no extrapolar desde el código. |
| Muy largo | F10: título real de 142 caracteres; ATC en `y=1176` a 375×800 y `y=1187` a 360×800. F11: siete swatches sin scroll horizontal a 360 px. | **Fricción confirmada** de compra móvil. Falta vendor de cuatro líneas y precios largos JPY/KRW/EUR en carrito lleno. |
| Faltante | No se ensayó producto sin imagen/descripción ni variante sin imagen. | **NO VERIFICADO**; crear fixtures, validar fallback visual, alt, tarjeta y PDP. |

## 3. Matriz forense

`P0` es bloqueo de envío; `P1` es crítico técnico/comercial; `P2` es moderado; `P3` es pulido. La columna «motivo» declara si es regla oficial, posible rechazo por demo o riesgo de UX, sin llamar rechazo automático a todo defecto.

| ID | Agente | Archivo/componente | Sev. | Motivo y prueba | Solución técnica exacta / dueño |
| --- | --- | --- | --- | --- | --- |
| A360-01 | 1, 4 | `config/settings_schema.json:7-8` | **P0** | Las URLs de docs y support dan **HTTP 404**; [documentación y contacto públicos son requisito](https://shopify.dev/docs/storefronts/themes/store/requirements). | **Johandry:** publicar ambos destinos y formulario de contacto funcional; **Claude:** actualizar URLs si cambian; Gemini verifica HTTP 200 y envío de formulario. No exigir un software de tickets concreto. |
| A360-02 | 1, 2 | `layout/theme.liquid:31,36`; `sections/featured-product.liquid:512` | **P1** | `model-viewer-ui.css` usa `https://cdn.shopify.com/...`; Shopify [exige URL relativa al protocolo para assets](https://shopify.dev/docs/storefronts/themes/store/requirements). | **Claude:** sustituir las tres por `//cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css`; comprobar carga 3D y reempaquetar. |
| A360-03 | 2 | `assets/theme.js:2366-2372,2549-2565,2603-2609,2704-2707` | **P1** | **Prueba Chrome con JS real y respuestas Shopify simuladas:** dos Quick Adds en formularios distintos finalizaron en orden inverso; servidor `['2','1']`, drawer `['2']`, revisiones iguales. El drawer puede mentir sobre el carrito; **no probado aún en tienda**. | **Claude:** serializar las mutaciones globales o forzar `syncCart()` fresco al terminar la última mutación si hubo concurrencia/sync diferido; añadir prueba con respuestas invertidas y paridad `/cart`. |
| A360-04 | 3 | `assets/theme.js:1215-1244`, `StickyCartBar.setVisible` | **P1** | **Vivo, PDP F04, 375×800:** foco en ATC fijo; al reaparecer ATC principal la barra pasó a `inert` y `document.activeElement` a `BODY`. Riesgo WCAG 2.4.3. | **Claude:** antes de ocultar la barra, transferir foco al ATC principal si es visible, o diferir `inert` hasta `focusout`; probar Tab/Shift+Tab y restauración de offset a 360/375/390 px. |
| A360-05 | 4 | `assets/theme.js:622`, `VariantSelects.updateOptionAvailability` | **P1** | **Vivo, F04:** Camel/S y Camel/M seguían elegibles aunque llevan a «Sold out»; Camel/L vuelve a permitir compra. Estado de combinación engañoso, riesgo de demo y conversión, no regla de rechazo automático aislada. | **Claude:** evaluar disponibilidad de la combinación completa para cada radio, aplicar estado visual y nombre accesible «Sold out», sin selección silenciosa de otra talla. Probar EN/ES y combinaciones inexistentes. |
| A360-06 | 4, 5 | `listings/sartorial/templates/index.json:103`; `listings/edition/templates/index.json:65` | **P1** | **Vivo:** ambas cápsulas muestran «Choose two to four products in the theme editor» y CTA deshabilitado. Shopify pide demos completas, auténticas y representativas; posible fricción de revisión comercial. | **Gemini/Johandry:** escoger 2-4 productos reales por demo y guardar referencias válidas en cada preset; **Claude:** verificar que instalación y demo no muestran texto de onboarding ni CTA muerto. |
| A360-07 | 4 | `assets/theme.js:1215`, activación de Sticky ATC | **P2** | F10 a 360/375 px deja ATC bajo el primer viewport; barra fija no aparece hasta sobrepasarlo. Pérdida de conversión, **no incumplimiento oficial probado**. | **Claude/Gemini:** mostrar acción fija cuando ATC principal esté *debajo* del viewport; si falta elección obligatoria, desplazar/enfocar selector, no añadir variante implícita. Probar teclado virtual y `scroll-padding-bottom`. |
| A360-08 | 4, 5 | `sections/header-group.json:11`; `sections/cart-drawer.liquid:4` | **P2** | **Vivo en EUR:** anuncio promete envío sobre «$150»; barra de progreso se omite fuera de moneda base. Puede prometer una tarifa falsa. Cálculo con carrito lleno **NO VERIFICADO**. | **Gemini/Johandry:** definir política por mercado; **Claude:** quitar cifra del default o localizarla a umbral real configurado, sincronizar anuncio, drawer y tarifas de checkout. |
| A360-09 | 1, 4 | `config/settings_data.json:79`; `/listings/` | **P2** | El encargo dice **cuatro** estilos, paquete instala **Sartorial, Edition, Archive**; Couture es tema remoto, no preset instalable. Incoherencia comercial condicional: solo sería incumplimiento si se anuncia como cuarto preset. | **Johandry/Gemini:** decidir si la oferta oficial es tres o cuatro; retirar Couture del claim o crear preset/listing/demo completo. No fabricarlo por inferencia. |
| A360-10 | 4 | `snippets/product-inventory.liquid:34`; `sections/main-product.liquid:718,985` | **P2** | **Vivo, F10:** «Low stock: 3 left» revela cantidad exacta; contrario al objetivo de privacidad del brief, **no regla Shopify**. | **Gemini:** decidir política; **Claude:** usar banda cualitativa y no serializar cifra exacta al DOM/JSON, con opt-in del comerciante si se desea precisión. |
| A360-11 | 2 | `assets/product-zoom.js:42-45,64-71` | **P2** | **Probe de JS real:** desmontar zoom abierto en editor dejó `bodyLocked=true` y marcador `data-open`; evento `close` llega tras abortar listener. No reproducido en comprador. | **Claude:** en `disconnectedCallback` liberar trap, scroll lock, temporizadores y marcador antes de abortar listeners; prueba `shopify:section:unload` con zoom abierto. |
| A360-12 | 3 | `assets/theme.js:2509,2675,2752`; `sections/cart-drawer.liquid:80` | **P2** | **Riesgo estático, NO VERIFICADO en vivo:** cambio de cantidad puede perder el control enfocado y no anuncia subtotal nuevo en región de estado. | **Claude:** capturar destino de foco antes de deshabilitar, restaurar el control equivalente tras render y publicar mensaje localizado de cantidad/subtotal; prueba con lector de pantalla y borrado de línea. |
| A360-13 | 5 | `sections/cart-drawer.liquid:552`; `sections/main-product.liquid:910`; `templates/page.contact.json:9,72` | **P2** | Defaults como «Complimentary Additions», «Size Guide & Measurements» y contenido comercial ficticio pueden sobrevivir en `/es` o instalación nueva; inventario de claves 0 faltantes **no** cubre valores libres del merchant. | **Gemini/Claude:** defaults neutrales traducibles o vacíos con fallback `t`, contenido demo solo en stores demo; probar fresh install EN/ES. Cambiar defaults es Nivel 2. |
| A360-14 | 2 | `layout/theme.liquid:33`; `sections/featured-product.liquid:514` | **P2** | Dos `onload="this.media='all'"` inline: infringen el criterio interno de cero handlers inline y dificultan CSP. **No se documentó prohibición oficial absoluta** de este patrón. | **Claude:** carga CSS condicional normal o listener registrado desde JS sin atributo inline; medir que no cause FOUC/CLS. |
| A360-15 | 5 | `sections/header.liquid:279,304`; `sections/main-faq.liquid:254`; `sections/cart-drawer.liquid:530` | **P3** | Algunos ajustes URL/externos o de recompensa carecen de `info`; brecha de la compuerta interna de comerciante, no rechazo automático demostrado. | **Claude:** añadir `info` localizado que explique destino externo o dependencia de tarifas/configuración; validar Theme Check y schema locales. |

## 4. Siete preguntas adversariales para Gemini y Claude

1. **Johandry/Gemini:** ¿Cuáles son las URLs públicas definitivas de docs y soporte, dónde está el formulario y qué evidencia de HTTP 200 más envío real demuestra que un comprador puede pedir ayuda?
2. **Johandry/Gemini:** ¿La oferta oficial son tres presets o cuatro? Por cada preset anunciado, ¿dónde está la Client transfer store, su configuración de checkout de prueba, su contraseña común, su catálogo auténtico y la captura comparativa instalación/demostración?
3. **Claude:** ¿Qué prueba de red invertida demuestra que dos `add.js` simultáneos desde formularios distintos acaban con servidor, drawer y `/cart` mostrando idénticas líneas, incluso tras error HTTP?
4. **Claude:** ¿Qué traza `document.activeElement` a 360/375/390 px demuestra que el Sticky ATC nunca envía foco a `BODY` al cambiar visibilidad, y que el carrito conserva foco al actualizar cantidades?
5. **Claude/Gemini:** ¿Qué fixtures de variantes muestran Camel/S y Camel/M agotadas *antes* del clic, opciones inexistentes, preorder y selling plans sin elegir talla implícitamente, en EN y ES?
6. **Gemini/Claude:** ¿Dónde están los informes crudos y reproducibles de Lighthouse home/product/collection, escritorio/móvil, con contenido real, y las nuevas corridas de Nu HTML y axe posteriores al último despliegue? ¿Qué queda `no verificado`?
7. **Johandry/Gemini:** En USD/EUR/JPY/KRW, ¿cuáles son los umbrales reales de envío y la prueba de checkout que justifica cada promesa del anuncio y el progreso del drawer, incluidos carritos vacíos y llenos?

## 5. Plan priorizado antes de empaquetar

- [ ] **P0, Johandry:** publicar docs y soporte con formulario; entregar enlaces y prueba de contacto. Sin esto, no enviar.
- [ ] **Admisión, Johandry/Gemini:** aportar evidencia de una Client transfer demo *por preset instalable*, checkout de prueba, contenido auténtico y misma contraseña; decidir tres vs cuatro. No declarar resuelto por tener cuatro temas remotos.
- [ ] **Admisión, Gemini:** ejecutar Lighthouse oficial con las seis vistas y guardar informes crudos; repetir Nu HTML/axe en el paquete final y estados de carrito pertinentes.
- [ ] **P1, Claude:** corregir las tres URLs de asset; reconciliar mutaciones concurrentes del carrito; arreglar pérdida de foco de Sticky ATC; disponibilidad por combinación; rellenar cápsulas de las demos.
- [ ] **P2, Claude tras aprobación de Gemini:** resolver primer viewport móvil, promesa de envío por mercado, limpieza de zoom en Theme Editor y continuidad/anuncios de carrito. Priorizar por pruebas, no por estética.
- [ ] **Cierre, Gemini:** repetir `node scripts/ledger-verify.mjs`, `node scripts/locale-key-inventory.mjs`, `node --check assets/theme.js`, `npx shopify theme check`, pruebas vivas adversariales y empaquetado; solo entonces actualizar ledger y autorizar push/submission.

**Estimación honesta:** los cambios acotados de código *podrían* repartirse en bloques de ~2 h; publicar soporte, construir/validar demos, obtener fixtures y medir Lighthouse no tiene plazo responsable de dos horas sin infraestructura y datos ya preparados.

## Evidencia y límites

```text
git status --short --branch
## master...origin/master
A  scratch/test-archive-contrast.mjs
A  scratch/test-f10.mjs
A  scratch/verify-deploy.mjs

node scripts/json-validate.mjs
303 JSON parseados; 9 listings fuera de Theme Check; 0 fallos de parseo.

node scripts/locale-key-inventory.mjs
83 archivos; 396 referencias storefront; 452 de schema; 0 claves sin resolver/dinámicas/huérfanas.

node scripts/ledger-verify.mjs
57 filas: 53 cumplido, 2 código completo, 2 no verificado, 0 ausente, 0 inconsistencias.

node --check assets/theme.js
exit 0
node --check assets/product-zoom.js
exit 0

cmd.exe /c "npx shopify theme check" (fuera del sandbox por ENOMEM del entorno)
351 files inspected; no offenses found; exit 0.

curl.exe -sS -L -o NUL -w "%{http_code} %{url_effective}\n" --max-time 20 <URL>
docs: 404; support: 404.

Pruebas independientes en navegador por agentes 3 y 4:
PDP F04 a 375x800: al ocultarse Sticky ATC con foco dentro, activeElement=BODY.
F04 Camel/S y Camel/M: Sold out tras elegir; radios antes activos. Camel/L: Add to cart.
F10: ATC top=1176 a 375x800; top=1187 a 360x800; título=142 caracteres.
Chrome + JS real con respuestas Shopify simuladas: server=['2','1'], rendered=['2'], pending=0, renderedRevision=2, syncRevision=2.
```

Los comandos estáticos comprueban sintaxis e inventario, **no** accesibilidad completa, contenido de demos ni comportamiento de compra. La prueba de carrera es una falsificación controlada del JS real, no una observación de compra remota. La prueba de contraste anterior no cubre todas las fotos, estados ni overlays. No se compró ni se modificó el carrito de la tienda durante esta auditoría. No se hizo commit ni push.
