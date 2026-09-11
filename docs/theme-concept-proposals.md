# Propuestas de Concepto para el Tema Shopify

Este documento presenta 3 propuestas de conceptos diferenciados, minimalistas, originales y orientados a la aceptación en la Shopify Theme Store. Han sido diseñados para evitar el síndrome "Dawn clone", resolver necesidades comerciales reales sin depender de apps externas, y cumplir estrictamente con los estándares de rendimiento (Core Web Vitals) y accesibilidad (WCAG 2.1/2.2 AA).

---

## Comparativa Rápida de Conceptos

| Criterio | Concepto 1: ATELIER | Concepto 2: ELEMENT | Concepto 3: FORM |
| :--- | :--- | :--- | :--- |
| **Nicho Principal** | Moda contemporánea, sastrería, calzado y joyería de autor | Cosmética limpia, skincare botánico, suplementos y fragancias | Tecnología de diseño, audio, EDC y mobiliario minimalista |
| **Estilo Visual** | Editorial asimétrico, líneas milimétricas (hairline), amplio espacio blanco, tipografía editorial | Belleza clínica y botánica, tarjetas táctiles suaves, paletas orgánicas, badges de pureza | Brutalismo refinado, bento-grids de precisión técnica, fuentes mono, estética industrial |
| **Poder Funcional Nativo** | Lookbook shoppable con hotspots, selector de tallas por metaobjetos, drawer con upsell | Creador de rutinas/bundles (3 pasos), selector de suscripciones nativo, slider antes/después | Matriz comparativa de especificaciones, visor 3D/AR diferido, drawer de specs rápidas |
| **Reto de Aceptación** | Cero layout shifts en hotspots y lookbooks | Cálculo de descuentos en bundles sin scripts pesados | Lazy-load eficiente de `model-viewer` y videos de producto |

---

## Concepto 1: ATELIER

### 1. Nombre provisional
**Atelier** *(Alternativas: Modulor, Vestige)*.
*Justificación:* Sustantivo sonoro, memorable e internacional que evoca artesanía, alta costura y diseño de autor. Cumple con la regla de Shopify de usar sustantivos no tendenciosos.

### 2. Merchant target
Marcas de moda independiente, diseñadores de calzado, sastrería contemporánea, marroquinería y joyería fina.
- Catálogo: Pequeño a mediano (15 a 150 SKUs) enfocado en colecciones de temporada (drops) y piezas icónicas.
- Audiencia: Compradores exigentes que valoran la dirección de arte, el patronaje y los materiales sostenibles.

### 3. Diferenciador visual
- **Composición Editorial Asimétrica con Encuadre Hairline:** Rompe la cuadrícula rígida de 4 columnas de Dawn. Utiliza divisiones finas y elegantes (`1px` con opacidad sutil), abundante espacio negativo deliberado y pares tipográficos de alto impacto (Serif editorial o Sans geométrica refinada con micro-etiquetas técnicas).
- **PDP de Doble Eje Fluido:** En escritorio, la galería fluye en cascada vertical mientras el bloque de compra permanece fijado (*sticky*) con pestañas de composición, origen y cuidados. En móvil, un carrusel panorámico fluido sin saltos de scroll y barra flotante de compra rápida ergonómica.

### 4. Diferenciador funcional (Sin apps externas)
- **Shoppable Lookbook / Hotspots Nativos:** Bloques en Liquid + Web Component nativo donde el merchant posiciona pines interactivos sobre fotos editoriales. Al hacer tap, se despliega un popover accesible con variantes y botón "Añadir al carrito" instantáneo vía `/cart/add.js`.
- **Guía de Tallas y Ajuste por Metaobjetos:** Sistema nativo configurable en el Theme Editor que lee tablas de medidas estandarizadas mediante metaobjetos de Shopify, eliminando apps de size charts.
- **Cart Drawer con Barra de Recompensas Escalonadas:** Barra de envío gratis progresiva, selector de envoltorio para regalo (`cart.attributes`), y sugerencia de productos complementarios (`recommendations?intent=complementary`).

### 5. Riesgos frente a requisitos de Shopify y mitigación
- *Riesgo:* Los pines de hotspots pueden causar saltos visuales (CLS) o fallar en accesibilidad móvil.
- *Mitigación:* Coordenadas relativas en porcentajes (`%`) mediante CSS custom properties; navegación por teclado accesible (botones con `aria-expanded` y etiquetas descriptivas).
- *Riesgo:* Imágenes de alta resolución de moda pesadas que reduzcan la velocidad móvil.
- *Mitigación:* Generación estricta de `srcset` con `image_url: width: ...`, carga asíncrona (`loading="lazy"`) y solo `fetchpriority="high"` en la primera imagen del viewport.

### 6. Secciones imprescindibles
1. `shoppable-lookbook`: Fotografía editorial con pines interactivos directos al carrito.
2. `split-editorial`: Bloque dividido asimétrico (imagen de campaña + texto de manifiesto + micro-tarjeta de producto).
3. `collection-layout-toggle`: Selector en PLP para alternar entre vista editorial espaciosa y vista compacta de catálogo.
4. `sticky-cart-bar`: Barra móvil inferior en PDP con selector rápido de talla integrado en drawer.
5. `craftsmanship-timeline`: Línea de tiempo visual para explicar el proceso de confección artesanal.

### 7. Presets sugeridos
1. **Couture:** Blanco y negro estricto, estética de alta moda parisina, tipografía serif refinada y fotografía de estudio.
2. **Studio:** Tonos lino, arena y terracota suave; tipografía sans cálida; ideal para marcas de lino orgánico, sombreros o cerámica de lujo.
3. **Archive:** Modo oscuro elegante con toques carbón, tipografía monospace técnica; ideal para moda urbana contemporánea (streetwear) o marroquinería oscura.

---

## Concepto 2: ELEMENT

### 1. Nombre provisional
**Element** *(Alternativas: Savant, Botanica)*.
*Justificación:* Sustantivo claro que connota pureza, ingredientes activos, formulación y transparencia científica/botánica.

### 2. Merchant target
Marcas de cosmética limpia, skincare de laboratorio o botánico, fragancias de nicho, cuidado capilar y suplementos nutricionales.
- Catálogo: 10 a 60 productos enfocados en rutinas diarias, recompras y packs de iniciación.
- Audiencia: Consumidores conscientes que leen listas de ingredientes, buscan certificaciones y compran soluciones integradas (rutinas).

### 3. Diferenciador visual
- **Minimalismo Táctil y Farmacéutico Contemporáneo:** Inspirado en la sofisticación de marcas como Aesop, Byredo y Rhode. Fondos en tonos piedra/marfil cálidos, esquinas con radio micro-curvado (`2px` a `4px`), tipografía sans legible y elegante, y sistema de badges para sellos de certificación (Cruelty-Free, Vegano, Reciclable).
- **Tratamiento Visual de Ingredientes y Texturas:** Tarjetas interactivas que destacan la textura física del producto (bálsamo, sérum, aceite) con zoom limpio y listas de principios activos con concentraciones visibles.

### 4. Diferenciador funcional (Sin apps externas)
- **Regimen / Routine Builder Nativo (Crea tu Rutina en 3 Pasos):** Sección interactiva tipo "Limpieza + Tratamiento + Hidratación". El cliente elige un producto de cada paso y el botón maestro agrega el set completo al carrito en un único `/cart/add.js`, calculando visualmente el ahorro.
- **Selector Nativo de Suscripción vs. Compra Única:** Integración profunda con los `selling_plans` de Shopify en PDP y Drawer. Cambia dinámicamente precios, frecuencias de entrega y porcentajes de descuento sin inyectar scripts de apps de suscripción.
- **Slider Comparador Antes / Después:** Componente web ligero en CSS nativo (sin librerías pesadas) para mostrar resultados clínicos y eficacia visible con control deslizante accesible por teclado.

### 5. Riesgos frente a requisitos de Shopify y mitigación
- *Riesgo:* La gestión de suscripciones suele chocar con validaciones de checkout si el carrito no sincroniza los `selling_plan_id`.
- *Mitigación:* Usar el endpoint oficial de Shopify Ajax Cart (`/cart/change.js`) respetando la estructura nativa de `selling_plan`.
- *Riesgo:* El routine builder podría exceder el peso de JS permitido o fallar si una variante queda sin stock.
- *Mitigación:* Validación previa en Liquid de disponibilidad y micro-estados en vanilla JS.

### 6. Secciones imprescindibles
1. `routine-builder`: Constructor modular de rutinas de cuidado en 2 o 3 pasos con checkout conjunto.
2. `ingredient-glossary`: Acordeón/rejilla interactiva con filtro de ingredientes activos y beneficios dermatológicos.
3. `before-after-slider`: Comparativa visual antes/después con slider optimizado sin layout shift.
4. `clinical-proof-metrics`: Bloque de estadísticas con barras o cifras destacadas ("92% piel más hidratada").
5. `quick-reorder-pdp`: Botón rápido para clientes recurrentes que activa compra en 1 clic de recambios (*refills*).

### 7. Presets sugeridos
1. **Botanical:** Verdes salvia, lino crudo, acentos orgánicos; ideal para cosmética natural, aceites esenciales y té de especialidad.
2. **Clinical:** Blanco puro, gris quirúrgico tenue, azul cobalto de acento; ideal para dermatología médica, péptidos y cuidado celular.
3. **Elixir:** Tonos ámbar profundo, sombras suaves y contrastes dorados; ideal para perfumería de nicho, velas y spa.

---

## Concepto 3: FORM

### 1. Nombre provisional
**Form** *(Alternativas: Kinetic, Datum)*.
*Justificación:* Sustantivo elemental del diseño industrial ("la forma sigue a la función"), directo y global.

### 2. Merchant target
Marcas de hardware de consumo, diseño industrial, accesorios de escritorio ergonómicos, audio de alta fidelidad, relojería contemporánea y EDC (Everyday Carry).
- Marcas de referencia: Teenage Engineering, Nothing, Rimowa, Nomad Goods, Grovemade.
- Catálogo: 5 a 80 productos de alto valor percibido donde las especificaciones técnicas y los materiales deciden la compra.

### 3. Diferenciador visual
- **Bento-Grid Técnico y Brutalismo de Precisión:** Cuadrículas modulares tipo bento con bordes de precisión, jerarquía estructurada con tipografía monospace para especificaciones (dimensiones, batería, peso, resistencia) combinada con una tipografía grotesque robusta para titulares.
- **Integración Nativa de Modelos 3D y Medios Enriquecidos:** Espacios de galería donde el modelo interactivo 3D (`model-viewer`) se activa bajo demanda para no penalizar la carga inicial, con esquemas de corte o vistas explosionadas.

### 4. Diferenciador funcional (Sin apps externas)
- **Matriz Comparativa de Modelos (Side-by-Side Spec Comparison):** Tabla comparativa interactiva que permite contrastar 2 o 3 productos de la colección (por ejemplo, Modelo Base vs. Modelo Pro) leyendo directamente metafields de producto (dimensiones, conectividad, autonomía).
- **Drawer de Ficha Técnica Rápida (Quick Spec Drawer):** Desde la lista de productos (PLP), el usuario puede abrir un panel lateral deslizable con las especificaciones técnicas completas y diagramas sin cambiar de página.
- **Explorador de Acabados y Materiales:** Selector interactivo donde al cambiar de acabado (Aluminio espacial, Titanio, Negro mate) se actualiza la paleta ambiental de la tarjeta y el render 3D/imagen correspondiente.

### 5. Riesgos frente a requisitos de Shopify y mitigación
- *Riesgo:* `model-viewer` y videos incrustados pueden hundir el rendimiento en Lighthouse móvil (<60).
- *Mitigación:* Renderizar inicialmente un poster estático optimizado con `image_url` y montar el script y el tag `<model-viewer>` únicamente tras la primera interacción del usuario o visibilidad en `IntersectionObserver`.
- *Riesgo:* Las tablas comparativas complejas se desbordan y rompen la legibilidad en pantallas móviles pequeñas.
- *Mitigación:* Diseño responsive con scroll horizontal bloqueable con indicadores de deslizamiento y tarjetas apilables en viewports menores a 640px.

### 6. Secciones imprescindibles
1. `bento-features`: Rejilla modular bento con bloques interactivos para destacar microchips, materiales y batería.
2. `product-comparison-matrix`: Tabla comparativa dinámica de especificaciones entre modelos.
3. `technical-specs-table`: Desglose técnico formal con soporte para descarga de manuales/fichas técnicas (PDF).
4. `rich-media-showcase`: Hero interactivo con soporte de video ambiental silenciado y cambio a vista 3D.
5. `modular-exploded-view`: Bloque interactivo con puntos clave del diseño interno del producto.

### 7. Presets sugeridos
1. **Titanium:** Fondo grafito mate, tipografía técnica nítida, acentos metálicos; ideal para audio y EDC premium.
2. **Draft:** Fondo blanco papel técnico, retícula milimétrica sutil, líneas negras finas; ideal para diseño industrial y papelería técnica.
3. **Nordic:** Tonos madera de abedul, arcilla y gris cálido; ideal para mobiliario ergonómico contemporáneo y arquitectura interior.
