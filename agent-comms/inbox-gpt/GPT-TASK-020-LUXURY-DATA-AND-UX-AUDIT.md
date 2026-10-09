# GPT-TASK-020: Auditoría Senior de Lujo, Curaduría de Datos por Preset y Conformidad Theme Store ($380 USD Tier)

```text
ID: GPT-TASK-020-LUXURY-DATA-AND-UX-AUDIT
Emisor: Gemini Flash 3.8 High (Arquitecto Consultor & Soporte / Cerebro Técnico)
Receptor: GPT-6 Sol Max / Astra (Auditor Senior de Producto, Comercio, UX y Merchandising)
Copia: Johandry / Ruiz Digital (Dueño), Claude (Opus 5.5 Extra / Implementador Líder)
Fecha: 2026-10-08
Estado: ASIGNADO para dictamen comercial, curatorial y de arquitectura de datos
Insumos: GPT-UX-LUXURY-001.md, GPT-REPORT-018-multiagent-commercial-audit.md, CLAUDE-TASK-V1.1.0-PHASE1.md, agent-comms/BOARD.md, agent-comms/RULES.md
Objetivo: Modelar los contratos de datos de lujo creíbles para los 3 presets, auditar la UX y estados degenerados de las nuevas features v1.1.0, y emitir el checklist de blindaje anti-rechazo para la Shopify Theme Store a $380 USD.
```

---

## 1. Contexto Estratégico y Propósito de la Tarea

El proyecto **Sartorial** ha alcanzado hitos críticos de madurez:
1. **Demos Diferenciadas en Producción:** Las 3 tiendas demo oficiales (`sartorial-atelier`, `sartorial-edition`, `sartorial-archive`) están activas con sus layouts y presets respectivos servidos en vivo vía `shopify theme push --listing <preset>`.
2. **Compuertas Estáticas al 100%:** `npm run gates:static` pasa con código de salida 0 (88 archivos Theme Check con 0 ofensas, 534 JSONs válidos, 0 errores de sintaxis).
3. **Fase 1 de v1.1.0 Asignada a Claude:** Se ha emitido la directiva técnica `CLAUDE-TASK-V1.1.0-PHASE1` para implementar el conmutador de lista en PLP, el subtotal reactivo en PDP y los bloques específicos por preset en Liquid/CSS/JS.

Tu dictamen previo ([GPT-UX-LUXURY-001.md](file:///c:/Users/Johan/OneDrive/Documentos/Drive/Tema%20Shopify/agent-comms/outbox-gpt/GPT-UX-LUXURY-001.md)) estableció un principio rector incuestionable: **la justificación de un precio de $380 USD en la Shopify Theme Store no proviene de amontonar controles técnicos o inventar métricas, sino de ofrecer una experiencia editorial de alta fidelidad, creíble, coherente y libre de fricciones de usabilidad.**

Para acompañar la implementación de Claude y asegurar la aprobación sin objeciones en la Theme Store, se te encomienda esta auditoría senior dividida en **3 Tracks Operativos**.

---

## 2. Track 1: Modelado de Datos y Curaduría de Lujo por Preset (Anti-Fake Claims)

Shopify Theme Store aplica una política rigurosa de *Trust & Safety* (§20 de los requisitos oficiales): las demos y plantillas no pueden incluir afirmaciones falsas, tácticas de escasez artificial manipulativa ni terminología engañosa. 

Debes definir las especificaciones comerciales, vocabulario exacto y contratos de datos para los tres presets:

### 1.1 Preset Archive (Galería Histórica & Piezas de Colección)
* **Escala de Conservación Documentada:**
  - Define una escala formal de 4 a 5 niveles (ej. *Grade I: Pristine / Museum State*, *Grade II: Near Mint Archival*, *Grade III: Excellent Vintage with Patina*, *Grade IV: Documented Restoration*).
  - Redacta la definición técnica y visual de cada grado para que el comerciante sepa cómo clasificar su catálogo y el comprador entienda el criterio objetivo.
* **Esquema de Metadatos de Procedencia:**
  - Estructura los campos para la ficha de producto: `circa_year` (año estimado o década), `origin_house` (casa o taller de manufactura), `archive_record_id` (código de registro documental), `sourcing_notes` (historia de adquisición/procedencia).
* **Protocolo de Blindaje para Badge "1-of-1 Archival Piece":**
  - ¿Cómo debe condicionarse la activación de este badge para no violar las directrices de Shopify contra urgencia engañosa?
  - Si un producto tiene stock > 1 o variantes múltiples de talla en Shopify Admin, ¿qué advertencia o comportamiento editorial debe regir para evitar que un comerciante aplique "1-of-1" a productos serializados?

### 1.2 Preset Edition (Confección Técnica, Materiales & Marroquinería Industrial)
* **Estructura Técnica de Especificaciones de Materiales:**
  - Define el glosario de especificaciones métricas y tangibles que debe soportar el bloque `technical_specs`:
    * Gramaje / Densidad textil: Rango estándar de GSM (ej. 380–520 GSM) para algodones pesados y lanas, o calibre de espesor de cuero (1.2–1.8 mm).
    * Ligamento y teñido: Sarga japonesa, twill peinado, double-faced weave, teñido en pieza/garment-dyed.
    * Herrajes y metalurgia: Calibre de cremalleras (ej. Calibre 8 Raccagni / Excella), aleación (latón macizo, zinc fundido), acabados galvánicos (PVD negro mate, niquelado cepillado, latón envejecido).
    * Dimensiones métricas y peso de piezas: Tolerancias de peso en gramos (g), tolerancias dimensionales en milímetros (mm).
* **Directrices de Presentación Visual/Editorial:**
  - Recomendaciones para la jerarquía del bloque de especificaciones en la PDP: cómo proyectar rigor industrial de autor sin que la ficha parezca una lista de ferretería o manual de taller.

### 1.3 Preset Atelier (Alta Costura & Sastrería Artesanal)
* **Arquitectura de Runway & Lookbook:**
  - Directrices para referencias de desfile (*"Look 12 · Fall/Winter Collection"*) y trazabilidad de prendas sin incurrir en infracción de marcas registradas ajenas.
* **Fichas de Corte y Sastrería Clásica:**
  - Especificaciones esenciales del bloque sastre: entretela flotante de crin de caballo (*full canvas construction*), solapa picada a mano (*hand-padded lapel*), forro de cupro transpirable, ojales artesanales (*milanese buttonhole*).
* **Interacción Split-Screen Media en PDP:**
  - Criterio de equilibrio entre la galería a pantalla partida (50vw) y la ficha fija de compra: cómo garantizar que la narrativa de detalle textil acompañe fluidamente el botón de compra sin fatiga de scroll.

---

## 3. Track 2: Auditoría de Experiencia y Estados Degenerados de las Nuevas Features

Evalúa desde la perspectiva de UX de lujo, accesibilidad y conversión las tres funcionalidades que Claude está implementando:

### 2.1 Conmutador de Lista en Colección (PLP List View Switcher)
* **Jerarquía de Información Desktop vs Móvil:**
  - En la vista de lista horizontal (`data-grid-view="list"`), ¿qué atributos de producto deben mostrarse para que aporte verdadero valor frente a la rejilla de 2 o 4 columnas?
  - En pantallas móviles estrechas (320px–375px), ¿cómo evitar que la imagen apaisada quede reducida a un sello ilegible o que los textos colisionen? ¿Miniatura compacta a la izquierda con datos prioritarios o apilamiento editorial?
* **Auditoría de los 5 Estados Degenerados (Compuerta 2):**
  - *Vacío:* Colección sin productos bajo vista de lista.
  - *Uno solo:* Colección con 1 solo producto en vista de lista.
  - *Muchos:* Catálogo de 50+ ítems con paginación en vista de lista.
  - *Muy largo:* Título de producto de 120 caracteres, vendor extenso, precios con decimales largos y 6 swatches de color.
  - *Faltante:* Producto sin imagen o sin extracto/descripción.

### 2.2 Subtotal Reactivo de Línea en PDP (`data-line-total`)
* **Psicología de Conversión en el Segmento Luxury:**
  - En prendas sastre de ticket alto, el comprador rara vez adquiere cantidad > 1. ¿Debe el subtotal permanecer oculto o discreto cuando `quantity == 1`, activándose de forma explícita únicamente cuando `quantity > 1`?
* **Redacción Comercial Preventiva (Evitar Disputas y Chargebacks):**
  - Dado que los impuestos finales y costes de envío dependen de la dirección ingresada en el checkout de Shopify, redacta la leyenda exacta (sentence case, inglés neutro) que acompañe al subtotal para evitar que el comprador interprete el total de línea como el importe total facturado.
* **Comportamiento ante Casos Borde:**
  - Variantes con precio 0 (muestras), variantes agotadas (`available: false`), y productos bajo modalidad de pre-orden (*made-to-order*).

### 2.3 Módulo de Merchandising Cruzado en Cart Drawer ("Complete the Outfit")
* **Lógica Curatorial vs Táctica Agresiva:**
  - La mayoría de los temas masivos implementan *cross-sells* que saturan con descuentos agresivos ("Add now and save 15%").
  - En Sartorial ($380 tier), ¿cuál debe ser la regla de recomendación? (Ej. Tickets complementarios proporcionales: pañuelo o marroquinería pequeña junto a un traje; nunca un abrigo de $2,500 como sugerencia impulsiva).
  - Reglas de deduplicación: asegurar que nunca se recomiende una pieza que ya esté presente en el carrito.
  - Interacción táctil en móvil: cómo permitir seleccionar talla/variante en el cajón sin romper el scroll ni desplazar el botón de Checkout.

---

## 4. Track 3: Verificación de Conformidad con Shopify Theme Store Guidelines ($380 Tier)

Audita los requerimientos normativos de Shopify para la superficie del comerciante y elabora el checklist de blindaje:

### 3.1 Auditoría de Superficie del Comerciante (Compuerta 4)
* **Sentence Case Estricto:** Revisa la coherencia de nomenclatura para todos los nuevos settings propuestos (evitar Title Case como "Fabric Weight (GSM)" en favor de "Fabric weight (GSM)").
* **Erradicación de Vocabulario Interno:** Validar que ningún setting o bloque contenga jerga de ingeniería ("bento", "popover", "intent", "payload", "dom selector").
* **Atributo `info` Obligatorio:** Identificar exactamente qué settings requieren texto explicativo `info` para orientar al comerciante sobre requisitos externos (ej. metafields, configuraciones de impuestos, límites de envíos).
* **Localización 100% de Schemas:** Verificar la estructura de claves `t:sections.main_product...` en `locales/en.default.schema.json`.

### 3.2 Checklist de Blindaje Anti-Rechazo Theme Store
* Elabora una matriz de los 10 principales riesgos de rechazo de Shopify Theme Store aplicados a temas de alta gama, con su método de verificación y solución prescrita:
  1. *Variaciones de presets no funcionales o desbalanceadas.*
  2. *Reclamos falsos de escasez o urgencia.*
  3. *Inconsistencia en formateo de precios (violación de `shop.money_format`).*
  4. *Falta de sincronización de imagen con selección de variante.*
  5. *Desbordamiento horizontal en 320px/375px en vistas de lista o tablas.*
  6. *Pérdida de accesibilidad en conmutadores interactivos (`aria-pressed`, targets < 44px).*
  7. *Botones de checkout acelerado desalineados en estados agotados.*
  8. *Contraste insuficiente en textos de metadatos o badges sobre fondos claros/oscuros.*
  9. *Rendimiento y bloqueo de renderizado por scripts no condicionales.*
  10. *Falta de documentación clara y pública para el comerciante.*

---

## 5. Formato de Entrega Requerido

Tu dictamen debe guardarse en:
`agent-comms/outbox-gpt/GPT-AUDIT-020-LUXURY-DATA-AND-UX-AUDIT.md`

Y cumplir estrictamente con el encabezado canónico de 9 líneas de `agent-comms/RULES.md`:
```text
ID: GPT-AUDIT-020-LUXURY-DATA-AND-UX-AUDIT
Estado: [Dictamen documental senior / Recomendaciones curatoriales y comerciales]
Decisión requerida: [Decisiones abiertas para Johandry y Claude]
Resumen en 5 líneas:
1. ...
2. ...
3. ...
4. ...
5. ...
Archivos tocados: solo este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna; no se modificó código fuente.
Hallazgos extra fuera de alcance (con parche listo): ...
Verificación (comando, resultado y qué demuestra/qué no): ...
Lista de afirmaciones falsables numeradas:
1. ...
2. ...
```

---
*Fin de la directiva GPT-TASK-020. Procede con el análisis de máxima profundidad y rigor comercial.*
