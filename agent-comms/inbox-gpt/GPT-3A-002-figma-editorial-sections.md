# Directiva de Implementación: GPT-3A-002

```text
ID: GPT-3A-002
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador de Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 3A.2 (Secciones Editoriales de Homepage para Figma Canvas)
Fecha: 2026-09-11
Estado: LISTA PARA EJECUCIÓN
```

---

## 1. Contexto y Objetivos

Habiendo validado la primera entrega en Figma (PDP, Lookbook, Sticky Cart Bar y variantes de presets en `Atelier Flow`), procedemos a diseñar el **ecosistema de secciones editoriales para la Homepage** bajo la dirección estética de `Atelier Flow`.

El usuario continuará con el flujo de importación directa vía SVG vectorial para su cuenta gratuita de Figma.

---

## 2. Secciones Requeridas (Desktop 1440px & Mobile 390px)

### 1. Editorial Split Hero Banner
- Layout asimétrico: Media container principal (fotografía de moda/objeto) + columna de texto tipográfico de alto impacto.
- Elementos: Eyebrow con tracking amplio (`0.12em`), Titular editorial en *Playfair Display* (Couture), texto de bajada y botón dual ("Discover The Collection" / "Explore Lookbook").
- Hairline borders sutiles (`#E5DFD5`) y detalles de temporada (`Autumn / Winter 26`).

### 2. Featured Collection / Curated Showcase (Ritmo Asimétrico)
- Grilla con ritmo editorial diferenciado (rompiendo la monotonía de Dawn):
  - 1 Spotlight Card grande (destacado a la izquierda) + 2 Standard Cards a la derecha con información detallada (precio, pastilla de disponibilidad, quick-add sutil).
- Tabs de colección superiores: `[01] New Arrivals`, `[02] Permanent Collection`, `[03] Objects`.

### 3. Brand Manifesto / Craft & Provenance Split
- Bloque de narrativa de marca:
  - Cita tipográfica de gran formato (*editorial serif quote*) con entrecomillado fino.
  - Columna secundaria con fotografía macro de materiales/texturas y ficha técnica indexada: *Materials*, *Origin*, *Artisanal Finish*.

### 4. Categorías Bento / Visual Discovery
- Composición de 3 bloques asimétricos para explorar categorías clave (ej. *Apparel*, *Accessories*, *Living Objects*) con overlays sutiles y micro-etiquetas numéricas.

---

## 3. Criterios de Aceptación

1. **Archivos SVG autocontenidos:**
   - `docs/figma/couture-homepage-sections-1440.svg`
   - `docs/figma/couture-homepage-sections-390.svg`
2. **Tokens y Accesibilidad:**
   - 100% alineados con `docs/design-tokens.json` (paleta Couture: `#FAF8F5`, `#1C1917`, `#786C5E`, `#E5DFD5`).
   - Contrastes >= 4.5:1 (WCAG 2.2 AA).
   - Áreas táctiles mínimas de 44×44px en todos los botones y enlaces.
3. **Estructura para Figma:**
   - Grupos con IDs semánticos: `Section-Hero-Editorial`, `Section-Curated-Showcase`, `Section-Brand-Manifesto`, `Section-Bento-Discovery`.
4. **Documentación:**
   - Entrega registrada en `agent-comms/outbox-gpt/GPT-3A-002-figma-editorial-sections.md`.
