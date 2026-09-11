# Directiva de Implementación: GPT-3A-001

```text
ID: GPT-3A-001
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador de Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 3A (Diseño Visual, Figma Canvas Blueprints & Design Tokens)
Fecha: 2026-09-11
Estado: LISTA PARA EJECUCIÓN
```

---

## 1. Contexto y Objetivos

Habiendo concluido y validado exitosamente la **Phase 2B (Commerce Foundation)** con 0 ofensas en Theme Check, iniciamos **Phase 3A: Sistema de Diseño Visual y Presets en Figma**.

- **Archivo Figma Oficial:** [Atelier Flow](https://www.figma.com/design/132QRVaYF2wRverRKEaymB/Atelier-Flow) (File Key: `132QRVaYF2wRverRKEaymB`).
- **Acceso:** Conexión validada con éxito mediante `figma-developer-mcp`.
- **Dinámica:** El usuario cuenta con una cuenta gratuita de Figma (sin Dev Mode). Para que no tenga que dibujar a mano las pantallas en Figma, **GPT-5.6 Sol Max generará el diseño visual mediante bloques vectoriales/SVG estructurados que se pegan directamente en el lienzo de Figma**, transformándose instantáneamente en frames, autolayouts y capas nativas editables, sincronizados con los tokens de diseño de `docs/design-tokens.json`.

---

## 2. Criterios de Aceptación P0 / P1 / P2

### P0 (Mandatorio / Bloqueante)
1. **Figma Canvas Blueprints (Vector/SVG):**
   - Generar el código SVG de alta fidelidad para el viewport Desktop (1440px) y Mobile (390px) del preset **Couture**.
   - El SVG debe incluir:
     - Header editorial hairline con `<shopify-account>` simulado.
     - PDP con galería de imágenes enmarcada, tipografía serif, selector de variantes en pastillas y bloque `@app` simulado.
     - Componente **Sticky Cart Bar** (fijado inferior con thumbnail, título, precio y botón Add to Cart).
     - Componente **Lookbook Interactivo** (imagen editorial con 2 hotspots interactivos con radio de pulso y tarjeta de producto emergente).
2. **Tokens de Diseño y Variables:**
   - Respetar rigurosamente los tokens estandarizados en `docs/design-tokens.json` para los 3 presets (`Couture`, `Studio`, `Archive`).
   - Todos los contrastes de texto deben superar **WCAG 2.2 AA** (mínimo 4.5:1 para body y 3:1 para headings/UI).
   - Todos los botones interactivos y tap targets deben medir como mínimo **44×44px**.

### P1 (Arquitectura y Presets)
1. **Blueprints de Presets Alternativos:**
   - Generar las variantes visuales de la tarjeta de producto y header para **Studio** (grotesk contemporáneo, radio 4px) y **Archive** (monospaced brutalista/técnico, bordes marcados).
2. **Mapeo a Shopify CSS Variables:**
   - Proporcionar la tabla de correspondencia entre los tokens de Figma y las variables CSS ya declaradas en `assets/base.css` (`--color-background`, `--color-foreground`, `--font-heading-family`, etc.).

### P2 (Documentación y Hand-off)
1. **Guía de Importación en Figma para el Usuario:**
   - Instrucciones claras de un solo paso para copiar el SVG y pegarlo (`Ctrl + V`) en el lienzo de Figma.
   - Instrucciones para aplicar los tokens usando el plugin gratuito *Tokens Studio for Figma* o *Variables nativas*.

---

## 3. Restricciones Técnicas

- No usar dependencias externas no autorizadas.
- No alterar la lógica de Liquid implementada en Phase 2B.
- Formato de entrega: `agent-comms/outbox-gpt/GPT-3A-001-figma-visual-system.md`.
