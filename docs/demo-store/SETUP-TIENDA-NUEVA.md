# Puesta a punto de la tienda de desarrollo nueva (Sartorial, Imprint, Archive)

Checklist para Johandry. Fecha: 2026-11-14. Fuentes: repo (`archivo:línea`) y ayuda oficial de Shopify. shopify.dev no fue accesible desde la sesión (DNS bloqueado por la red del entorno): lo que solo está allí va marcado **a confirmar**.

**Respuesta corta:** es un tema. No hace falta instalar ninguna app para que funcione. Solo hay que **subir el tema y cargar el catálogo**. Hay tres matices:
1. Algunas pruebas concretas necesitan una app o un ajuste de la tienda. La única app imprescindible es una de suscripciones, para A-01.
2. Para pasar la Theme Store, cada preset necesita **su propia tienda demo**, no solo una copia del tema (ver d).
3. Los presets no se aplican del todo con «Change style»: las plantillas de `listings/` solo entran con un push por preset (ver b.4).

## a) ¿Hay que instalar algo además del tema?

| Función | Dónde la usa el tema | ¿Qué requiere? | Clase | Coste |
|---|---|---|---|---|
| Suscripciones (A-01) | `sections/main-product.liquid:515,562`, `sections/featured-product.liquid:258,304` | Una app que cree selling plans. La recomendada es **Shopify Subscriptions** (App Store, de Shopify). Requisitos de pasarela y plan: **a confirmar** | Solo A-01 | Gratis (ficha de la app) |
| Reglas de cantidad (D-02-Q) | `sections/main-cart-items.liquid:118-120`, `sections/cart-drawer.liquid:241-243`, `sections/featured-product.liquid:190-192` | B2B y catálogos con reglas de cantidad. Shopify B2B existe en Basic, Grow, Advanced y Plus (help.shopify.com/manual/b2b). En tiendas de desarrollo: **a confirmar**. Si no aparece *Catálogos*, D-02-Q se queda en harness local | Solo D-02-Q | Incluido en el plan |
| Filtros de colección y búsqueda | `sections/main-collection.liquid:12-15`, `sections/main-search.liquid:12,90` | Disponibilidad y precio vienen por defecto. Para filtros por opción, tipo, etiqueta o swatch: app **Shopify Search & Discovery** | Opcional (recomendado para la PLP demo) | Gratis |
| Búsqueda predictiva | `snippets/predictive-search.liquid:2-12`, `sections/header.liquid:186` | Nativa, no requiere app. Los sinónimos son opcionales y se configuran en Search & Discovery | Obligatoria sin app | Gratis |
| Recomendaciones | `sections/cart-drawer.liquid:48,311`, `snippets/cart-drawer-recommendations.liquid:11-20` | Nativas (`routes.product_recommendations_url`). «Complementarios» requiere Search & Discovery, y el setting `use_search_discovery` está en false (`sections/cart-drawer.liquid:428-432`) | Opcional | Gratis |
| Tarjeta regalo | `templates/gift_card.liquid:4-8`, `sections/featured-product.liquid:378` | Productos > Tarjetas de regalo > crear un producto tarjeta regalo. Disponibilidad en tienda dev: **a confirmar** | Solo prueba de tarjeta regalo | Incluido |
| Cuentas de cliente nuevas | `sections/header.liquid:191` (`<shopify-account>`) | Configuración > Cuentas de cliente > cuentas nuevas (sin contraseña) | Recomendado (es el modo por defecto actual) | Gratis |
| Recogida en tienda | `snippets/pickup-availability.liquid:11` | Configuración > Ubicaciones (1 ubicación) y luego Envío y entrega > Recogida local: activar en esa ubicación | Solo la prueba de pickup | Gratis |
| Modelos 3D | `snippets/product-media.liquid:2,25`, `layout/theme.liquid:35,161-170` | Subir un `.glb` como medio de un producto. El visor es el nativo de Shopify (CDN) | Solo la fila 75 (Medios 3D) | Gratis |
| Newsletter | `sections/footer.liquid:52` (`form 'customer'`) | Nativo: crea clientes con consentimiento de marketing. Shopify Email no es necesario | Ninguna acción | Gratis |
| Idiomas | `locales/en.default.json`, `locales/es.json`; selector en `sections/header.liquid:124,188` y `sections/footer.liquid:16` | Inglés por defecto (D-01-L, `docs/demo-import/D-01-L-idioma.md`). El español es opcional: Configuración > Idiomas > Añadir español; el contenido se traduce con Translate & Adapt (gratis) o con `scripts/translate-storefront.mjs:10` (Admin token, fuera de este alcance) | Opcional; publicarlo solo si todo está traducido | Gratis |
| Pagos de prueba | — | Configuración > Pagos > «Test payment gateway» (tarjeta 1 = aprobada, 2 = rechazada). Según la ayuda **no es compatible con productos de suscripción** y requiere plan de pago; en tienda dev: **a confirmar** (allí suele llamarse Bogus Gateway) | Solo si se prueba checkout. Los arneses actuales no hacen checkout (`docs/decisions.md:270`) | Gratis |
| Contraseña de tienda | `scripts/gate5-live-verify.mjs:5`, `harness-B-02-STORE-001/run-b02.mjs:52` | Tienda online > Preferencias > Protección con contraseña. Las tiendas dev la tienen activa por defecto | Obligatoria mientras se prueba | Gratis |
| Theme Access | Los arneses leen `SHOPIFY_CLI_THEME_TOKEN` (`harness-C-01-ID-001/identity.mjs:28`) | App **Theme Access** (gratis): crea un *theme password*. Se envía por email, el enlace caduca a los 7 días y solo se puede ver una vez | Obligatoria para push y pruebas con CLI | Gratis |

## b) Orden de puesta a punto

- [ ] 1. **Crear la tienda.** Partners/Dev Dashboard > Stores > Add store > tienda de desarrollo, **sin datos de prueba** (C-02 exige una tienda limpia). Apunta el dominio `xxxx.myshopify.com`.
- [ ] 2. **Ajustes básicos.**
  - Configuración > Detalles de la tienda: moneda **USD**, la de los CSV (a confirmar contra `products.csv`).
  - Configuración > Ubicaciones: 1 ubicación.
  - Configuración > Idiomas: inglés por defecto.
  - Configuración > Políticas: generar las 4. El pie las enlaza (`docs/demo-import/D-01-N-navegacion.md`, menú footer).
- [ ] 3. **Instalar Theme Access** y crear la contraseña para el agente. No la pegues en el chat ni en el repo: cárgala solo en el entorno de la sesión.
- [ ] 4. **Subir el tema, una copia por preset.**
  - El ZIP canónico (`node scripts/package-theme-zip.mjs`, D21) se sube por Tienda online > Temas > Importar tema > Subir archivo zip. Es la prueba de **instalación limpia** (C-05), pero deja `settings_data` en `current` y las plantillas base.
  - Cambiar de preset en el editor (Configuración del tema > *Theme style* > Change style, según `docs/merchant/docs.html:213`) solo cambia los valores de presentación. No aplica `listings/<preset>/templates/*.json`; según Shopify, eso solo pasa al instalar el preset desde la Theme Store (**a confirmar**).
  - Para que cada preset quede exacto en su propia copia hay que generar el export por preset: `node agent-comms/outbox-claude/harness-C-01-ID-001/build-export.mjs --commit <sha> --preset Sartorial --out <dir>` (tema + overlay de `listings/` + `"current": "Sartorial"`, ver su `README.md:15-16`).
  - Después, `shopify theme push --unpublished` desde `<dir>`. Nunca `--publish`, `--live` ni `--allow-live` (`README.md` C-01, «Reglas»).
  - Repite con Imprint y Archive y anota los 3 theme IDs. El push lo hace Claude solo con la autorización de (c).
  - Descartado: la integración con GitHub publica una rama sola, no un preset por copia.
- [ ] 5. **Importar el catálogo.** Productos > Importar > `docs/demo-store/products.csv`.
  - Desmarca «Sobrescribir» en una tienda vacía.
  - Mantén los productos en **draft** hasta tu aprobación (`docs/demo-import/D-01-catalogo-y-fotos.md:48`).
  - Si los tres presets comparten tienda, ojo con el handle duplicado `structured-tote` (`D-01-catalogo-y-fotos.md:28`).
- [ ] 6. **Colecciones** (automáticas por etiqueta, con el handle exacto) y publicarlas en Tienda online (`D-01-catalogo-y-fotos.md:49`). **Menús** `main-menu` y `footer` a mano: Shopify no importa menús (`D-01-N-navegacion.md`). **Páginas** About (plantilla `page.about`), FAQ y Contact.
- [ ] 7. **Fotos** de `<preset>-photos.csv`, en productos y en el editor (`D-01-catalogo-y-fotos.md:50-54`).
- [ ] 8. **Ajustes del tema para las pruebas.** `show_cart_note` está en `default: false` (`config/settings_schema.json:270-276`). Para probar B-04, actívalo en Personalizar > Configuración del tema > Carrito, solo en la copia de prueba. Es configuración de esa tienda, no un cambio del tema: deja anotado si se queda así en la demo.
- [ ] 9. **Contraseña.** Mantenla activa durante las pruebas. Quítala solo en la tienda demo final de cada preset, cuando el tema esté **publicado** y aprobado por ti.

## c) Fixtures y lo que Claude necesita después

Crea los fixtures como productos **activos solo en el canal Tienda online**, con la etiqueta `qa-fixture`, en una colección `qa-fixtures` que no esté en los menús. Así no contaminan la demo. Si la tienda será demo, retíralos del canal antes de publicar (`D-01-catalogo-y-fotos.md:56`).

- [ ] **A-01 Suscripción.**
  - Instala Shopify Subscriptions y crea `qa-subscription` con 2 variantes.
  - Crea un plan mensual con un 10 % de descuento.
  - Haz que 1 variante *requiera* el plan (solo venta por suscripción) y que la otra permita compra única y suscripción.
  - Pásale a Claude: handle, IDs de las variantes y ID del `selling_plan` (los harnesses lo piden numérico, `run-b02.mjs:79`).
- [ ] **B-02 Selector nativo.**
  - Crea `qa-native-select` con la opción Size (S/M/L), con el bloque `variant_picker` presente (`sections/main-product.liquid:38-39`) y con inventario rastreado.
  - Deja **M con stock 0** y «Seguir vendiendo» desactivado.
  - En Home, añade una sección «Featured product» apuntando a ese producto.
  - Pásale a Claude: handle, IDs de las variantes A/B y el selector del formulario. El fixture de `run-b02.mjs` admite `surface: pdp|featured` (`run-b02.mjs:74`).
- [ ] **C-07 Variantes.** El máximo hoy son **2048 variantes y 3 opciones** por producto (help.shopify.com, «Add variants»). Liquid solo expone 250, y por eso el tema cambia de modo con más de 250 (`sections/main-product.liquid:3-6`). Carga por CSV (una fila por variante). Para cargas grandes hay un límite diario solo a partir de 500 000 variantes en la tienda.
  - `qa-variants-1`: sin opciones (variante por defecto).
  - `qa-variants-250`: Color 10 × Size 5 × Fit 5 = 250.
  - `qa-variants-252`: 7 × 6 × 6 = 252. Deja agotada una variante de más allá de la posición 250 para el enlace profundo `?variant=` (`docs/decisions.md:323-324`).
  - Opcional: `qa-variants-2048` (16 × 16 × 8).
  - `scripts/demo-import.mjs:17` valida `MAX_VARIANTS = 100`: estos CSV de QA no pasan por ese script.
  - Pásale a Claude: handles, el ID de esa variante posterior a la 250 y la colección.
- [ ] **D-02-Q Cantidades** (si *Catálogos* existe en la tienda): crea un catálogo B2B con una regla min 2 / incremento 2 / max 10 sobre una variante, una empresa y un cliente de prueba (sin datos reales).
- [ ] **C-02 / C-05 Tienda e instalación limpias.**
  - C-02: no crees nada fuera de esta lista. Anota la fecha de creación y que se creó sin datos de prueba.
  - C-05: sube el ZIP canónico como tema extra (sin tocar el editor) y compara cada preset con su copia demo. La paridad es el criterio de `docs/shopify-theme-store-acceptance-matrix.md:76`. Pásale a Claude el SHA-256 del ZIP subido y el theme ID de esa copia.

**Variables de entorno de la sesión de pruebas** (nunca en el repo, en argv ni en el chat):
- `SHOPIFY_FLAG_STORE`: el dominio nuevo.
- `SHOPIFY_CLI_THEME_TOKEN`: la contraseña de Theme Access de la tienda nueva.
- `STOREFRONT_PASSWORD`: la contraseña de la tienda nueva.
- `STOREFRONT_ORIGIN` y `STOREFRONT_THEME_ID` (`scripts/gate5-complete-verification.mjs:9-11`).

Las credenciales de `tema-qkqpke0j` no sirven en la tienda nueva. El escaneo D12 compara los valores vigentes (`docs/decisions.md:342`).

**Cambio de arnés necesario (no hecho; requiere tu autorización y una revisión independiente):**
- `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs`: ORIGIN (`:11`), PREVIEWS e IDs (`:13-15`), rutas de fixtures (`:18`), READ_HOSTS (`:23`), INVENTORY_HOSTS (`:32`) y `target.host` (`:56`). Quitar o adaptar el incidente histórico (`:68`).
- Al cambiar run.mjs se rompe el pin `D28_RUNNER_SHA256` de `agent-comms/outbox-claude/harness-B-02-STORE-001/run-b02.mjs:29`. Hay que recalcularlo tras la revisión.
- `agent-comms/outbox-gpt/harness-GPT-RD-001/run.mjs:13-15,22-23,234`.
- `scripts/gate5-complete-verification.mjs:15-16` (TARGET_ORIGIN y TARGET_THEME_ID).
- `scripts/capture-presets.mjs:14-16,131,141` (IDs antiguos y dominio fijo).
- La autorización vigente limita las pruebas a las previews de `tema-qkqpke0j` (`D-01-catalogo-y-fotos.md:61`). Hace falta una decisión nueva en `docs/decisions.md` que nombre el dominio y los 3 a 4 theme IDs nuevos.

## d) Requisitos de la Theme Store que dependen de la demo

- [ ] **Una tienda demo completa y funcional por preset**, con la industria y el tamaño de catálogo de la etiqueta del preset; la tienda de instalación debe cumplir lo que promete la demo (requisitos de mayo de 2025, shopify.dev, **a confirmar** en la fuente). Esta tienda nueva sirve para probar. Para enviar a revisión hacen falta 3 demos con el preset publicado; la matriz exige preset = demo (`docs/shopify-theme-store-acceptance-matrix.md:74-76`).
- [ ] **Paridad** entre demo e instalación nueva: mismo layout, tipografía y paleta (`acceptance-matrix.md:76`). Se cubre con C-05.
- [ ] **Contraseña:** la demo enviada debe ser accesible y sin contraseña. Despublica o retira los fixtures QA antes.
- [ ] **Capturas** por demo: 1 de escritorio (1000×1248 o 2000×2496 px) y 1 móvil (750×1334 px) de la Home, sin marco de navegador ni texto añadido. Imágenes del preset: 1600×1200 px, sin GIF animado, con alt text. Tamaños **a confirmar** en el formulario de la Theme Store, porque las páginas difieren.
- [ ] **Documentación y soporte:** GitHub Pages ya decidido (`config/settings_schema.json:7-8`). Comprueba que ambas URLs responden y son usables en móvil (`acceptance-matrix.md:78`).
- [ ] **Idiomas:** demo en inglés (D-01-L). Publica `es` solo si está todo traducido.

## e) Riesgos y lo que NO hay que hacer

- [ ] **No crear metafields.** `use_product_metafield` está en false por defecto (`sections/cart-drawer.liquid:422-425`) y requiere `custom.complementary_products`. Déjalo así.
- [ ] **No publicar por error** una copia de prueba ni el ZIP: Personalizar no publica, pero el botón «Publicar» sí.
- [ ] **No importar datos reales** de clientes, pedidos ni direcciones. Las empresas y clientes B2B deben ser ficticios (`example.com`).
- [ ] No activar productos de catálogo antes de tu aprobación factual (C-08). No poner la tarjeta real en el checkout de prueba.
- [ ] No mezclar presets en la misma tienda sin resolver el handle `structured-tote`. No borrar las previews de `tema-qkqpke0j` hasta cerrar la migración del arnés.

## Dudas a confirmar

1. ¿Están disponibles B2B, catálogos y reglas de cantidad en una tienda de desarrollo (D-02-Q)? La ayuda solo cita planes de pago.
2. Requisitos de Shopify Subscriptions en una tienda dev (¿Shopify Payments en modo de prueba?). La pasarela de prueba no admite suscripciones.
3. ¿«Change style» aplica o no `listings/<preset>/templates`? Comprobarlo en shopify.dev (inaccesible desde aquí).
4. Tamaños exactos de las capturas y la norma vigente de demo por preset en shopify.dev.
5. ¿Hay productos tarjeta regalo y Test payment gateway en tiendas dev sin plan?
6. Moneda de `docs/demo-store/products.csv` (no se leyó: lo genera otro agente).
