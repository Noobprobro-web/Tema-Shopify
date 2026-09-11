# GEMINI-002: Phase 2 Prep

## Objetivo

Preparar insumos concretos para que Codex pueda iniciar la arquitectura e implementacion del theme skeleton Shopify.

## Contexto

El proyecto busca crear un tema Shopify original, minimalista, premium y aceptable para una futura revision de Shopify Theme Store.

Direccion interna actual:

- Concepto: `Atelier Flow`.
- Target: marcas premium de producto fisico con catalogos pequenos o medianos.
- Categorias: moda, joyeria, skincare/wellness, home decor, cafe/vino/especialidad, objetos de diseno.
- Benchmark: Prestige, Palo Alto, Broadcast, Pipeline y Atelier by Shopify, sin copiar codigo, layout, assets ni copy.

Principios ya aceptados:

- Mobile-first.
- Performance por defecto.
- Accesibilidad como feature.
- Commerce inside storytelling.
- Agency-ready architecture.
- Presets por industria/intencion, no solo por color.

## Archivos a Leer

- `README.md`
- `AGENTS.md`
- `docs/strategy-brief.md`
- `agent-comms/token-efficiency-rules.md`
- `docs/mvp-scope.md`
- `docs/top-theme-benchmark.md`
- `docs/shopify-theme-store-checklist.md`
- `docs/shopify-theme-store-acceptance-matrix.md`
- `docs/gemini-task-01-report.md`
- `docs/roadmap.md`
- `docs/decisions.md`

## Entregable Esperado

Crea un archivo:

`agent-comms/outbox-gemini/GEMINI-002-phase-2-prep-report.md`

Debe incluir:

1. **Section Architecture Matrix**
   - Lista priorizada de sections MVP.
   - Para cada section: objetivo, bloques, settings principales, soporta `@app` si aplica, riesgo tecnico, riesgo UX/accessibility.

2. **Template Architecture Matrix**
   - Templates obligatorios.
   - Sections recomendadas por template.
   - Notas de conversion y accesibilidad.

3. **Design Tokens Proposal**
   - Tokens semanticos para color, spacing, radius, typography y motion.
   - Paletas iniciales para presets `Couture`, `Studio`, `Archive`.
   - Verificacion de contraste estimada. Marca cualquier contraste dudoso.

4. **Interaction Spec**
   - Header/mobile menu.
   - Predictive search.
   - Cart drawer.
   - Quick add.
   - Variant picker.
   - Shoppable lookbook hotspots.
   - Sticky mobile cart bar.

5. **QA Plan**
   - Checklist para Theme Check, Lighthouse, accessibility, keyboard, responsive y edge cases de ecommerce.

6. **Risks and Open Questions**
   - Riesgos de Theme Store.
   - Riesgos de scope.
   - Preguntas que Codex o el usuario deben decidir antes de codificar.
   - Puntos que recomiendas revisar con un modelo superior de OpenAI antes de implementar.
   - Puntos donde recomiendas usar Claude para UX, copy, documentacion o segunda opinion.

## Criterios de Aceptacion

- El reporte debe ser accionable para implementacion.
- No debe proponer dependencias pesadas.
- No debe depender de apps externas para features core.
- Debe priorizar mobile, performance y accesibilidad.
- Debe marcar supuestos.
- Debe evitar copiar temas existentes.
- Debe mantener `Atelier Flow` como nombre interno, no como nombre final.
- Debe marcar decisiones que convendria escalar a modelo superior antes de codificar.
- Debe marcar tareas donde Claude podria aportar valor sin duplicar trabajo.

## Reglas

- No edites archivos fuera de `agent-comms/outbox-gemini/` salvo que el usuario te lo pida explicitamente.
- Si necesitas proponer cambios a documentos oficiales del proyecto, incluyelos como recomendaciones dentro del reporte.
- Usa fuentes oficiales para cualquier requisito Shopify que cites.
- Se conciso, pero suficientemente especifico para que Codex pueda implementar.
