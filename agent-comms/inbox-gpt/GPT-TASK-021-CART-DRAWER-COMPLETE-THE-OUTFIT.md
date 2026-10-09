# GPT-TASK-021: Arquitectura de Producto, UX de Lujo y Contrato de Recomendaciones "Complete the Outfit" en Cart Drawer (Sartorial v1.1.0 — Fase 2)

```text
ID: GPT-TASK-021-CART-DRAWER-COMPLETE-THE-OUTFIT
Emisor: Gemini Flash 3.8 High (Arquitecto Consultor & Soporte / Cerebro Técnico)
Receptor: GPT-6 Sol Max / Astra (Auditor Senior de Producto, Comercio, UX y Merchandising)
Copia: Johandry / Ruiz Digital (Dueño), Claude (Opus 5.5 Extra / Implementador Líder)
Fecha: 2026-10-08
Estado: ASIGNADA para dictamen comercial, diseño de interacción y contratos de datos
Insumos: sections/cart-drawer.liquid, assets/theme.js, GPT-UX-LUXURY-001.md, GPT-AUDIT-020-LUXURY-DATA-AND-UX-AUDIT.md, CLAUDE-TASK-V1.1.0-PHASE1.md, agent-comms/BOARD.md, agent-comms/RULES.md
Objetivo: Diseñar la experiencia editorial y de conversión de "Complete the Outfit" en el Cart Drawer para el segmento de $380 USD, definiendo la psicología de curaduría por preset, la interacción de selección de variantes, el contrato de API/metafields con estados degenerados, y el blindaje normativo de Theme Store (§8, §14, §15, §20).
```

---

## 1. Contexto Operativo y Propósito de la Fase 2

El proyecto **Sartorial** ha concluido y certificado con éxito la **Fase 1** de la expansión v1.1.0:
1. **Compuertas Estáticas al 100%:** `npm run gates:static` verificado en verde con código de salida 0, 8/8 compuertas aprobadas, 90 archivos inspeccionados por Theme Check con 0 ofensas, y paquete `Sartorial-1.0.0.zip` sincronizado.
2. **Modularización Nivel 2 Completada:** Los bloques de especificaciones técnicas y procedencia histórica se encapsularon limpiamente en `snippets/product-technical-specs.liquid` y `snippets/product-provenance.liquid`, reduciendo la complejidad Liquid en `sections/main-product.liquid` de 153 a ~116 (holgadamente por debajo del umbral de 120).
3. **Decisión del Usuario (Johandry):** La verificación visual de Fase 1 se difiere para el final del ciclo; se autoriza la apertura inmediata de la **Fase 2**, asignando el diseño de producto y UX a **GPT-6 Sol Max**.

La Fase 2 aborda el componente más crítico para la conversión y la percepción de marca tras la PDP: el **Cart Drawer** (`sections/cart-drawer.liquid` y `assets/theme.js`), específicamente el rediseño del módulo de recomendaciones curadas **"Complete the Outfit"** (actualmente titulado "Complimentary additions").

Como Auditor Senior de Producto, Comercio, UX y Merchandising, se te solicita formular el dictamen maestro y los contratos funcionales antes de que Claude inicie la implementación en código.

---

## 2. Track 1: UX y Psicología de Lujo para "Complete the Outfit"

### 1.1 Curaduría Editorial vs. Upsell Agresivo de Liquidación
La mayoría de los temas comerciales de bajo costo caen en la trampa del *upsell* agresivo: carruseles saturados, descuentos forzados ("Añade esto y obtén 20%"), temporizadores de urgencia ficticia y sugerencias desconectadas de valor marginal (calcetines baratos empujados indiscriminadamente).

En una marca de lujo ($380 USD tier):
* El Cart Drawer no es una cesta de liquidación; es la extensión privada del probador de la boutique (*private fitting room*).
* La recomendación complementaria debe percibirse como un **servicio de estilismo experto (*curated styling*)** que eleva el look principal, no como una maniobra desesperada para inflar el AOV.
* **Curaduría específica por preset:**
  - **Preset Atelier (Alta Costura & Sastrería Artesanal):** Estilismo de conjunto formal de pasarela (*The Curated Ensemble* / *Runway Styling*). Piezas afines de sastrería: pañuelos de bolsillo en twill de seda, alfileres de solapa de forja artesanal, guantes de napa italiana, bufandas de lana cachemira o tirantes de seda clásica.
  - **Preset Edition (Confección Técnica & Marroquinería Industrial):** Objetos de diseño modular y accesorios utilitarios (*Modular Companions* / *Technical Essentials*). Complementos de alta ingeniería: fundas impermeables de viaje con cremallera Raccagni, tarjeteros de cuero moldeado al vacío, mosquetones de latón macizo con tratamiento PVD, o cepillos de cerdas naturales para el cuidado del paño de 500 GSM.
  - **Preset Archive (Galería Histórica & Piezas de Colección):** Preservación patrimonial y piezas afines de época (*Archival Care & Period Companions*). Elementos de conservación: fundas transpirables de algodón orgánico con cremalleras libres de ácido, perchas de cedro para conservación estructural de hombreras, o accesorios vintage complementarios de la misma década documentada.
* **Ratio de Valor y Precio:**
  - ¿Cuál debe ser la relación de precio entre la pieza principal y el complemento? (Ej. Un accesorio de $80–$180 complementando una prenda de $600–$1.200 representa un 15%–30% coherente; sugerir un abrigo de $2.500 ante una camiseta de $120 rompe la lógica de compra).
  - Dictamina la regla comercial y cómo debe comportarse el motor curatorial frente a los precios del catálogo.

### 1.2 Comportamiento ante Interacción y Selección de Variantes
En la versión actual (`sections/cart-drawer.liquid:305,379` y `assets/theme.js:2513–2563`):
* El tema toma `recommendation.selected_or_first_available_variant` y añade la variante con cantidad 1 en un solo clic.
* **El fallo crítico de UX en moda:** Si el producto complementario es una prenda con opciones de talla (S, M, L, XL) o color, añadir a ciegas la primera variante disponible en stock resulta inaceptable para el comprador (ej. recibir una talla XS sin haberla elegido) y genera fricción extrema, cancelaciones y devoluciones.

Debes dictaminar la arquitectura de interacción táctil y accesible:
1. **Opción A (Añadir Directo Condicional):** Si el producto tiene una única variante (`has_only_default_variant == true`), se permite la adición directa en 1 clic con indicador de carga y anuncio accesible.
2. **Opción B (Selector Discreto Inline "Choose Options"):** Si el producto tiene múltiples variantes (tallas/colores):
   - ¿Cómo debe desplegarse la selección sin romper el contenedor de scroll ni invocar modales superpuestos que atrapen el foco de forma inaccesible?
   - Diseño recomendado: ¿Píldoras/chips táctiles de talla (mínimo 44×44 px) directamente integradas en la tarjeta de la recomendación, o un selector desplegable accesible antes de confirmar la adición?
3. **Opción C (Derivación Elegante a PDP):** Si el producto complementario posee alta complejidad (planes de suscripción, campos de personalización obligatorios, o más de 2 opciones independientes): ¿Debe el botón mostrar "View product" / "Select options" y dirigir a la PDP preservando el estado?
4. **Preservación del Footer Sticky:**
   - Toda interacción debe estar confinada al área desplazable (`cart-drawer__scroll`).
   - El pie con el Subtotal, impuestos y el botón de Checkout acelerado/primario **NUNCA debe ser desplazado fuera de pantalla ni quedar oculto** por la apertura de opciones.

---

## 3. Track 2: Contrato de Datos, API y Estados Degenerados

### 2.1 Fuentes de Datos y Estrategia Jerárquica de Fallback
Shopify ofrece múltiples vías para alimentar recomendaciones. Debes auditar y definir la jerarquía técnica óptima:
1. **API de Recomendaciones Nativa de Shopify:**
   - Endpoint: `routes.product_recommendations_url` (`/recommendations/products.json?product_id=...&intent=complementary&limit=4`).
   - Ventaja: Se gestiona de forma nativa a través de la aplicación oficial gratuita *Shopify Search & Discovery*, permitiendo al comerciante asociar complementos específicos por producto.
   - Limitación: Requiere que el comerciante haya instalado y configurado la app, y depende de peticiones asíncronas en runtime.
2. **Metafield de Producto (`sartorial.complementary_products` o `custom.complementary_products`):**
   - Tipo: `list.product_reference`.
   - Ventaja: Renderizado 100% del lado del servidor en Liquid sin dependencias de red adicionales.
3. **Bloques Estáticos del Tema (`cross_sell_product`) y Colección Fallback (`cross_sell_collection`):**
   - Actualmente implementados en `sections/cart-drawer.liquid:299–444`.
   - Permiten curaduría manual por bloques o una colección general cuando no hay datos dinámicos.

**Dictamen Requerido:** Define la cascada canónica: ¿Cómo debe priorizar el tema entre estas fuentes para garantizar que la tienda siempre muestre complementos pertinentes sin romperse jamás si una fuente está vacía?

### 2.2 Gestión de Carrito Multi-Producto y "Prenda Ancla" (Anchor Item)
Cuando el carrito contiene varios artículos (ej. un traje sastre de $1.200, una corbata de $150 y un perfume de $95):
* ¿Qué producto debe gobernar las recomendaciones de "Complete the Outfit"?
  - *Opción 1:* El último producto añadido (`cart.items.first`).
  - *Opción 2:* El producto de mayor valor unitario (`highest_price_item` — la prenda ancla del outfit).
  - *Opción 3:* Prioridad editorial por tipo de producto (ej. outerwear/sastrería sobre accesorios).
* ¿Qué sucede cuando el comprador elimina del carrito la prenda ancla? ¿Cómo debe reaccionar el drawer en la re-renderización AJAX?

### 2.3 Matriz de los Cinco Estados Degenerados (Compuerta 2 del DoD)
Define con exactitud la conducta y el renderizado para cada caso extremo:
1. **Estado Vacío (0 productos en carrito):**
   - ¿Debe mostrarse alguna recomendación o debe el estado vacío (`cart.empty?`) prevalecer de forma pura con el botón "Continue shopping"?
2. **Estado Uno Solo (1 producto en carrito):**
   - Con complementos disponibles vs. cuando el producto no tiene complementos o todos están agotados (`available == false`). Ocultamiento total del contenedor sin dejar etiquetas ni separadores huérfanos.
3. **Estado Muchos (10+ productos en carrito / 20+ recomendaciones potenciales):**
   - Límite estricto de productos mostrados (máximo 2 productos visibles para no competir con el scroll de líneas).
   - Prevención de sobrecarga de peticiones AJAX y gestión de debounce.
4. **Estado Muy Largo:**
   - Producto complementario con título de 120 caracteres, precios en monedas con símbolos y decimales largos, y nombres de opciones extensos.
   - Comportamiento en pantallas estrechas de 320 px y 375 px: cero desbordamiento horizontal (`scrollWidth <= clientWidth`).
5. **Estado Faltante:**
   - Producto complementario sin imagen (placeholder neutro proporcional).
   - Producto complementario sin stock en la variante por defecto pero disponible en otras tallas.

### 2.4 Deduplicación Estricta y Mutaciones Concurrentes
* **Deduplicación frente al Carrito:** Todo producto cuyo `product_id` ya figure en cualquier línea del carrito (`cart.items`) debe ser estrictamente excluido, independientemente de qué variante tenga añadida.
* **Deduplicación entre Bloques/Fuentes:** Si se presentan 2 recomendaciones, jamás deben mostrar el mismo `product_id`.
* **Mutaciones y Foco:** Al pulsar "Add", el drawer actualiza el carrito; el producto añadido debe desaparecer de las recomendaciones y el foco del teclado debe viajar predeciblemente a la nueva línea del carrito, conforme al estándar WCAG 2.4.3.

---

## 4. Track 3: Merchant Surface y Cumplimiento Theme Store

### 3.1 Controles de Schema y Localización (§14)
Audita la configuración en `sections/cart-drawer.liquid` y define los estándares de Merchant Surface:
* **Vocabulario de Comerciante:**
  - Prohibido terminología de desarrollo interno: sustituir `cross_sell`, `payload`, `intent_complementary` o `upsell` por terminología neutra de comercio: *"Complementary products"*, *"Curated additions"*, *"Suggested products"*.
* **Sentence Case Universal:**
  - 100% de los `name`, `label`, `info` y nombres de opciones en sentence case ("Complementary products", no "Complementary Products").
* **100% Claves `t:`:**
  - Absolutamente ninguna cadena en inglés hardcodeada en el schema.
  - Estructuración propuesta bajo `sections.cart_drawer.settings.*` y `sections.cart_drawer.blocks.*` en `locales/en.default.schema.json` y `locales/en.default.json`.
* **Atributos `info` Obligatorios:**
  - Todo control que interactúe con apps externas (como *Shopify Search & Discovery*) o dependa de metafields debe incluir un texto explicativo `info` que guíe al comerciante sobre dónde y cómo configurarlo en el Shopify Admin.

### 3.2 Matriz de Blindaje Anti-Rechazo Theme Store
Detalla los requisitos específicos y cómo blindar el Cart Drawer contra las directrices oficiales:
* **§8 (Consistency and functionality):**
  - Cero tácticas engañosas de urgencia o escasez ("¡Solo queda 1!", "Comprado hace 2 minutos").
  - Consistencia de precios, impuestos y monedas con la sesión activa del comprador.
* **§14 (Merchant settings and theme configuration):**
  - Settings intuitivos, funcionales por defecto, sin dependencias forzadas de apps de pago.
* **§15 (Cart and checkout experience):**
  - Acceso libre y visible en todo momento al botón de Checkout y subtotal.
  - Soporte íntegro de botones de pago acelerado (`additional_checkout_buttons` / `content_for_additional_checkout_buttons`).
  - Nota de carrito (`cart.note`) si está habilitada en los ajustes globales.
  - Transparencia en el aviso de impuestos y envío según `cart.taxes_included`.
* **§20 (Demo stores):**
  - Garantizar que en las 3 demos oficiales (`sartorial-atelier`, `sartorial-edition`, `sartorial-archive`), el módulo de recomendaciones funcione de forma impecable sin errores 404, 422 ni excepciones de consola.

---

## 5. Entregables Esperados de GPT

Redacta tu dictamen maestro en:
`agent-comms/outbox-gpt/GPT-REPORT-021-CART-DRAWER-RECOMMENDATIONS.md`

El informe debe incluir:
1. **Resumen Ejecutivo y Dictamen Comercial:** Justificación del módulo para el tier de $380 USD.
2. **Especificación Curatorial por Preset:** Propuesta de styling para Atelier, Edition y Archive.
3. **Decisión de Interacción de Variantes:** Elección fundamentada y wireframe conceptual de interacción (Opción A, B o C) y gestión de foco accesible.
4. **Contrato de API y Cascada de Fallback:** Algoritmo de selección de prenda ancla, deduplicación y gestión de estados límite.
5. **Propuesta de Schema y Locales:** Bloque de schema en JSON y entradas correspondientes de traducción para `en.default.json` y `en.default.schema.json`.
6. **Checklist de Conformidad Theme Store:** Matriz de mitigación de riesgos §8, §14, §15 y §20.

---
*Directiva emitida formalmente por Gemini Flash 3.8 High. Registrada en BOARD.md. Lista para ejecución.*
