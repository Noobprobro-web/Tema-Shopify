# Directiva de Implementación: GPT-3A-5 (Figma System Hardening & Top-Tier Merchandising)

```text
ID: GPT-3A-5
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador de Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 3A.5 (Endurecimiento del Sistema Figma y Módulos Comerciales Top-Tier)
Fecha: 2026-09-11
Estado: AUTORIZADA PARA EJECUCIÓN
```

---

## 1. Visión y Alineación de Criterios (Gemini + Codex)

Se aprueba formalmente la propuesta unificada surgida de la auditoría de Codex (`CODEX-FIGMA-001`) y el análisis de benchmarks de Gemini. 

**Principio Rector:** Preservar intacta la identidad editorial y originalidad de `Atelier Flow` (no convertirlo en un clon de Prestige o Broadcast), elevando su madurez técnica en Figma y dotándolo de los módulos comerciales que justifican un tema de $380-$400 USD en la Shopify Theme Store.

---

## 2. Alcance y Criterios de Aceptación

### Bloque P0: Endurecimiento de la Arquitectura en Figma (System Hardening)
1. **Tipografía y Fuentes:**
   - Eliminar definitivamente el fallback faltante `Georgia`. Toda la familia serif primaria queda unificada en **`Playfair Display Regular`** y el body en **`Plus Jakarta Sans`**.
   - Definir escala tipográfica estandarizada: `Display`, `Heading`, `Subheading`, `Body`, `Label`, `Eyebrow` (con tracking `0.12em`) y `Micro` (mínimo 12px para accesibilidad).
2. **Organización del Archivo Figma (Aprovechando las 3 páginas de la cuenta gratuita):**
   - Página 1: `01 Foundations & Components` (Variables, estilos tipográficos y biblioteca de componentes).
   - Página 2: `02 Couture Screens & Flows` (Los blueprints organizados por secciones y flujos prototipados).
   - Página 3: `03 Presets (Studio & Archive) + QA` (Variantes funcionales de los otros dos presets).
3. **Biblioteca de Componentes Clave con Auto Layout y Variantes:**
   - Crear component sets para los 10 componentes críticos:
     - `Button` (Primary, Secondary, Text; default, hover, focus, loading, disabled).
     - `Product Card` (con hover de segunda imagen y swatch switcher visual).
     - `Variant Selector` (pastillas de talla y swatches de color con estados default, selected, disabled).
     - `Accordion` (Collapsed / Expanded / Focus).
     - `Sticky Cart Bar` (Hidden, Visible, Loading, Success).
     - `Cart Item` (con stepper de cantidad y botón remove).
     - `Drawer Shell` (con backdrop-blur y scroll interior).
     - `Hotspot` (Idle con pulso sutil, Hover, Focus, Active).
     - `Predictive Result Card` (Producto, Artículo, Sugerencia).
     - `Form Input` (Default, Focus, Error con mensaje, Disabled).

---

### Bloque P1: Módulos Comerciales y de Conversión Top-Tier (La Fórmula $390 USD)
1. **Modal de Guía de Tallas & Fit del Modelo (PDP):**
   - Enlace `Size Guide & Measurements` junto al selector de tallas.
   - Modal/Drawer accesible con selector de unidades `CM / INCHES`, tabla de medidas y ficha: *"Model is 178cm / 5'10" wearing size S"*.
2. **Venta Cruzada en Cart Drawer (In-Drawer 1-Click Cross-Sell):**
   - Módulo compacto dentro del Cart Drawer (*"Complimentary additions"*) con 2 accesorios de compra impulsiva (ej. calcetines merino, bálsamo para cuero) y botón `+ Add` en 1 clic.
   - Barra de progreso escalonada: Envío gratis a $150 / Regalo de atelier a $250.
3. **"Complete the Look" / Shoppable Capsule Bundle:**
   - Sección modular que muestra un look completo de 2-3 prendas con checkboxes y CTA único con precio total combinado.
4. **Catálogo & Colección Dinámica (PLP):**
   - Selector de vista de grilla: conmutador `[ || ] 2 Columnas` vs `[ |||| ] 4 Columnas`.
   - **Promotion Tile:** Bloque editorial integrado dentro de la grilla de productos (para destacar una cita, campaña o evento de temporada).
   - Quick-buy sheet en móvil con selector de talla rápido para productos multivarianza.
5. **Ecosistema Editorial Global:**
   - **Announcement Bar:** Barra superior sutil (36-44px) configurable para envíos o lanzamientos.
   - **Editorial Marquee / Ticker:** Cinta horizontal lenta entre secciones con manifiesto continuo de marca.

---

## 3. Entregables Requeridos

1. **Assets SVG / Figma:**
   - Generar los blueprints vectoriales para los nuevos componentes y pantallas enriquecidas en `docs/figma/` (Size Guide Modal, In-Drawer Cross-Sell, Complete the Look, Promo Tiles, Grid Switcher y Marquee).
2. **Documentación:**
   - Registrar la entrega en `agent-comms/outbox-gpt/GPT-3A-5-figma-system-hardening.md` detallando la estructura de páginas de Figma, componentes creados y contratos de interacción.
3. **Restricciones:**
   - No modificar código Liquid ni archivos de producción de Shopify en este paso.
