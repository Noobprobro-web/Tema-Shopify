# Directiva de Implementación: GPT-3A-003

```text
ID: GPT-3A-003
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador de Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 3A.3 (Bloque 1: Colección, Carrito, Mega-Menú y Footer en Figma)
Fecha: 2026-09-11
Estado: LISTA PARA EJECUCIÓN
```

---

## 1. Contexto y Estrategia

Para completar el diseño visual de todas las pantallas requeridas por la Shopify Theme Store sin saturar tokens ni degradar la calidad vectorial, dividimos el trabajo restante en **2 bloques estructurados**.

Este **Bloque 1 (GPT-3A-003)** abarca el **núcleo transaccional y de navegación global**:
1. **Página de Colección / Catálogo (`collection.json`)**
2. **Cart Drawer Desplegado + Estado Vacío (`cart-drawer` / `cart.json`)**
3. **Header Desplegado (Mega-menú Desktop y Drawer Mobile)**
4. **Footer Global Completo de la Tienda**

---

## 2. Requerimientos de Diseño (Desktop 1440px & Mobile 390px)

### 1. Página de Colección (`Section-Collection-Catalog`)
- **Encabezado editorial:** Título serif en *Playfair Display*, bajada descriptiva, conteo de piezas (`[24 Pieces]`).
- **Barra de herramientas:**
  - Filtros facetados (*Availability*, *Price*, *Size*, *Color*) con estado desplegado/pills.
  - Selector de ordenamiento (*Sort by: Featured / Price / Date*).
  - Contador de filtros activos y botón "Clear all".
- **Grilla de catálogo:** Grilla balanceada con cards completas (precio, badges "Sale" / "Sold Out", pastillas de color y botón de Quick-Add accesible).
- **Paginación:** Indicador editorial `Page 1 of 3` con botón accesible "Load More Pieces".

### 2. Cart Drawer Desplegado (`Section-Cart-Drawer-Open`)
- Drawer lateral abierto sobre overlay translúcido.
- Encabezado con título `Your Selection (2)` y botón de cerrar (`44×44px`).
- **Barra de progreso de envío gratis:** `Add $35 more for complimentary shipping`.
- **Items del carrito:** 2 productos con imagen, título, variante seleccionada, precio, selector de cantidad `[-] 1 [+]` y acción de eliminar.
- **Notas de pedido:** Acordeón desplegable `Add gift note or delivery instructions`.
- **Subtotal y Checkout:** Desglose con texto de impuestos incluidos según Shopify y botón `Checkout • $420.00` (52px de altura).
- **Empty State:** Variante compacta para bolsa vacía con mensaje refinado y botón "Explore Collection".

### 3. Mega-Menú & Navegación (`Section-Navigation-Expanded`)
- **Desktop (1440px):** Mega-menú desplegable con 3 columnas de texto (*Apparel*, *Objects*, *Atelier Stories*) + 1 columna con tarjeta editorial con fotografía y enlace directo a la cápsula de temporada.
- **Mobile (390px):** Drawer de navegación a pantalla completa con tipografía grande, acordeones de subcategorías, acceso a cuenta y selectores de país/moneda.

### 4. Footer Global (`Section-Footer-Global`)
- **Newsletter:** Formulario inline refinado (`Your email address`) con botón de suscripción sutil y texto de consentimiento.
- **Navegación inferior:** 4 columnas (Colecciones, Sobre nosotros, Atención al cliente, Legal).
- **Follow on Shop:** Botón nativo de Shop integrado respetando su branding oficial.
- **Utilidades:** Selectores de moneda/idioma de Shopify Markets y fila de iconos de pago autorizados.

---

## 3. Criterios de Aceptación Técnicos

1. **Archivos SVG autocontenidos en `docs/figma/`:**
   - `docs/figma/couture-collection-catalog-1440.svg` (y versión 390px)
   - `docs/figma/couture-cart-drawer-navigation-1440.svg` (y versión 390px)
2. **Tokens y Accesibilidad:**
   - Alineación estricta con `docs/design-tokens.json` (paleta Couture).
   - Contrastes >= 4.5:1 (WCAG 2.2 AA).
   - Tap targets interactivos >= 44×44px.
3. **Estructura para Figma:**
   - Grupos con nombres semánticos para facilitar conversión a Frames en Figma.
4. **Documentación:**
   - Entrega en `agent-comms/outbox-gpt/GPT-3A-003-figma-collection-cart-navigation.md`.
