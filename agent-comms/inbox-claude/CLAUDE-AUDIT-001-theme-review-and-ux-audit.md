# Directiva de Auditoría: CLAUDE-AUDIT-001 (Segunda Opinión UX, Revisión Editorial y Detección de Riesgos Theme Store)

```text
ID: CLAUDE-AUDIT-001
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador del Proyecto)
Destinatario: Claude (Auditor Senior de UX/UI, Experiencia de Merchant y Calidad Editorial)
Fase: Transición Phase 3B -> Phase 4 (QA y Preparación Theme Store)
Fecha: 2026-09-12
Modo: READ-ONLY (Auditoría e Informe de Recomendaciones. Cero modificaciones de código)
```

---

## 1. Contexto del Proyecto y Jerarquía

- **Concepto:** `Atelier Flow` (nombre público provisional `Theme Project`).
- **Nicho:** Moda de lujo, sastrería contemporánea, calzado de autor, alta joyería y marcas de diseño.
- **Objetivo:** Aprobación en la Shopify Theme Store en el escalafón premium ($380–$400), compitiendo al nivel de *Prestige*, *Impact* o *Broadcast*, pero con una identidad visual y técnica original, minimalista y libre de dependencias pesadas.
- **Arquitectura:** Online Store 2.0 nativo, 100% Vanilla JS (componentes web sobre `ThemeElement`), CSS moderno con variables Couture/Studio/Archive, 52 archivos con 0 ofensas en Shopify Theme Check.
- **Estado Actual:** GPT-5.6 Sol Max se encuentra ejecutando el sprint técnico final (`GPT-3B-005` de cumplimiento comercial). Mientras concluye, Claude asume la auditoría integral de producto, UX, comerciante y posibles trampas de rechazo.

---

## 2. Regla Fundamental

**MODO SOLO LECTURA:** No debes editar ningún archivo del tema, ni ejecutar comandos que modifiquen el código, ni realizar commits. Tu entrega debe ser un informe de análisis profundo, constructivo y accionable que se guardará en `agent-comms/outbox-claude/CLAUDE-AUDIT-001-review.md` (o entregado en texto al usuario).

---

## 3. Pilares de Auditoría Asignados a Claude

### Pilar 1: Experiencia de Usuario (UX) y Conversión Premium ($380–$400)
- Analiza la arquitectura del flujo de compra:
  - Navegación, búsqueda con filtros facetados (`main-search.liquid`), drawer del carrito con barra de recompensas por tramos ($150 envío gratis / $250 regalo exclusivo) y cross-sell complementario de un clic (`cart-drawer.liquid`).
  - PDP: Jerarquía visual de `main-product.liquid`, selector de variantes, guía de tallas modal interactiva (`size-guide-modal.liquid`), y barra fija de compra (`sticky-cart-bar.liquid`).
  - Merchandising editorial: Lookbook interactivo con hotspots (`lookbook.liquid`) y Capsule Bundle ("Complete the Look" en `complete-the-look.liquid`).
- **Pregunta clave:** ¿La experiencia se siente verdaderamente como software de lujo de $380? ¿Hay fricciones, saltos visuales o elementos que parezcan de un tema genérico de $50?

### Pilar 2: Experiencia del Comerciante (Merchant Ergonomics & Schemas)
- Revisa los schemas JSON de las secciones principales (`sections/*.liquid`):
  - `hero-editorial.liquid`, `curated-showcase.liquid`, `brand-manifesto.liquid`, `bento-discovery.liquid`, `marquee-banner.liquid`, `lookbook.liquid`, `complete-the-look.liquid`, `main-contact.liquid`.
- **Pregunta clave:** ¿Son los settings comprensibles, útiles y limpios para un comerciante sin conocimientos técnicos? ¿Faltan opciones críticas para una marca de moda (ej. alineaciones, opacidad de máscaras, ratios de aspecto de imagen)?

### Pilar 3: Tono Editorial, Micro-copy y Textos en `locales/en.default.json`
- Audita exhaustivamente el archivo `locales/en.default.json`.
- **Pregunta clave:** ¿Es el tono suficientemente elevado y sofisticado (*"Complimentary Additions"*, *"Curated Selection"*, *"Atelier"*) sin caer en la pretenciosidad incomprensible? ¿Están cubiertos todos los estados vacíos, alertas de error del carrito y etiquetas de accesibilidad `aria-label`?

### Pilar 4: Detección de Casos Esquina (Edge Cases) y Riesgos de Rechazo Theme Store
- Identifica escenarios límite que los revisores de Shopify suelen testear para rechazar temas:
  - Títulos de producto extremadamente largos (100+ caracteres) o nombres de colecciones extensos.
  - Productos sin imagen o con imágenes en proporciones no estándar (panorámicas vs ultra verticales).
  - Colecciones con 1 solo producto o colecciones vacías.
  - Errores de red o de stock durante el add-to-cart vía AJAX.
  - Dispositivos con pantallas pequeñas (360px - 390px) y legibilidad/tap targets.
  - Modos de alto contraste o reducción de movimiento (`prefers-reduced-motion`).

### Pilar 5: Propuestas para Presets y Diferenciadores (Fase 4)
- Propuestas creativas para los 3 presets de estilo requeridos por Shopify (`Couture`, `Studio`, `Archive`):
  - ¿Qué matices tipográficos, de espaciado o detalles sutiles harían que cada preset se sienta como una tienda completamente distinta?

---

## 4. Formato de Entrega del Informe

El informe de Claude debe estar estructurado con:
1. **Resumen Ejecutivo y Veredicto General** (Puntaje estimado 1-10 en madurez comercial para Theme Store).
2. **Fortalezas Principales** (Lo que ya está a nivel clase mundial).
3. **Hallazgos Críticos y Oportunidades de Mejora** (Priorizados en P0: Riesgos de rechazo / P1: Fricciones de UX / P2: Polish editorial).
4. **Auditoría de Micro-copy y Locales** (Propuestas concretas de mejora en textos si aplica).
5. **Recomendaciones para los Presets de la Fase 4**.
