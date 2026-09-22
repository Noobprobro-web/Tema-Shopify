# GPT-TASK-004: Estrategia de Merchandising de Presets para Theme Store y Matriz de Aceptación para Quick Buy & Swatches

```text
ID: GPT-TASK-004-merchandising-and-quickbuy-criteria
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: GPT-5.6 Sol Max (Auditor Senior de Producto y Comercio)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-22
Estado: SOLICITUD DE ESTRATEGIA COMERCIAL Y PROTOCOLO DE AUDITORÍA (Sprint 5A)
```

---

## 1. Contexto

Gemini ha emitido la directiva técnica vinculante `CLAUDE-DIRECTIVE-5A-001` para que Claude implemente el **Sprint 5A: Quick Buy con Tallas y Swatches Nativos en Tarjetas y Filtros**, adoptando directamente la recomendación P0 de tu informe `GPT-AUDIT-003`.

Mientras Claude ejecuta la implementación técnica en Liquid, CSS y Web Components, requerimos tu liderazgo como Auditor Senior de Producto y Estratega Comercial para resolver dos pilares estratégicos decisivos antes de la submission a Shopify Theme Store:

---

## 2. Misión y Preguntas Estratégicas

### Pilar A: Estrategia de Demos y Merchandising para los 3 Presets (`Sartorial`, `Edition`, `Archive`)

En tu informe `GPT-AUDIT-003` señalaste con exactitud:
> *"Shopify exige una plantilla única por preset, paridad entre estado instalado y demo, y al menos una demo por preset. Sartorial está demostrado; Edition y Archive necesitan demos con catálogo y fotografía propios para no parecer un simple skin."*

Solicitamos tu especificación estratégica concreta:
1. **Arquitectura de Demos para Theme Store:**
   - ¿Cuál es la ruta óptima para que Johandry presente las 3 demos requeridas a los evaluadores de Shopify? (Ej. uso de tiendas de desarrollo gratuitas bajo cuenta de Shopify Partners: una para cada preset apuntando al mismo tema base con su preset preseleccionado).
   - ¿Cómo garantizamos la paridad exacta entre el archivo `Sartorial-1.0.0.zip` que el comerciante instala y lo que se visualiza en cada demo?
2. **Curaduría de Catálogo Ficticio (*LINEA NOVE*):**
   - Para **`Edition`** (Enfoque: Objetos de diseño, accesorios contemporáneos, sistema editorial sans-serif):
     - ¿Qué tipos de productos debe contener el catálogo? (piezas de piel, papelería de diseño, objetos de cerámica/metal, gafas, pequeña marroquinería).
     - ¿Cuáles son las directrices de dirección de arte fotográfica? (planos cenitales, iluminación neutra/fría, ausencia deliberada de modelos humanos para contrastar con Sartorial).
   - Para **`Archive`** (Enfoque: Sastrería patrimonial, piezas numeradas, cuero curtido, oliva/tierra, estética documental):
     - ¿Qué tipos de productos y atributos debe destacar? (series limitadas, año de manufactura, procedencia del tejido, numeración de archivo).
     - ¿Qué dirección fotográfica y microcopy debe tener para alejarse de Sartorial y transmitir carácter histórico?

---

### Pilar B: Matriz de Criterios de Aceptación para Quick Buy & Swatches (Sprint 5A)

Para cuando Claude entregue el código de Sprint 5A, necesitamos tu **Matriz de Auditoría Adversarial de Producto**. Define los criterios exactos con los que evaluarás la entrega:

1. **Casos de Uso de Compra Rápida:**
   - ¿Qué comportamiento debe tener ante productos con 1 sola variante vs productos con múltiples opciones (Talla y Color)?
   - ¿Cómo debe reaccionar el Quick Buy cuando una talla específica está agotada (`inventory = 0` / `available = false`)?
   - ¿Qué tratamiento debe recibir un producto que requiere plan de venta / suscripción obligatoria?
2. **Experiencia de Swatches:**
   - ¿Cómo debe comportarse el cambio de imagen de la tarjeta al pasar el cursor o hacer clic sobre un color?
   - ¿Cómo se garantiza que el comprador no se confunda entre el color previsualizado y la variante añadida al carrito?
   - ¿Qué umbral de swatches visibles debe haber antes de mostrar el contador `+N` para evitar saturar la tarjeta en móvil (390px)?
3. **Flujo de Conversión y Señales de Confianza:**
   - Al añadir un producto mediante Quick Buy, ¿cómo debe recibir el comprador el feedback en el `CartDrawer`? (actualización de la barra de envío gratis sobre $150, desglose de precio, cross-sell sugerido).

---

## 3. Entregable Esperado

Redacta tu dictamen y especificación en:
`agent-comms/outbox-gpt/GPT-AUDIT-004-merchandising-and-quickbuy-criteria.md`.

No es necesario escribir código ni modificar archivos del tema; tu función es proveer la dirección estratégica, la curaduría de producto y la matriz de pruebas senior para asegurar la aprobación y defensa del precio de $380 en Shopify.
