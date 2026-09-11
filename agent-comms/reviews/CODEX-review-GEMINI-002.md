# Codex Review: GEMINI-002

ID: GEMINI-002
Estado: aprobado con ajustes
Decision requerida: escalar a modelo superior antes de implementar la arquitectura base del theme skeleton.
Resumen en 5 lineas:
1. La matriz de secciones es util y suficientemente concreta para iniciar Fase 2.
2. La division Phase 2A/2B es correcta y reduce scope risk.
3. Los tokens propuestos son buena base, pero deben adaptarse a Shopify Color Schemes y settings reales antes de codificar.
4. Las interacciones propuestas deben implementarse con componentes vanilla JS pequenos, foco accesible y `aria-live`.
5. Se acepta usar Claude luego para copy/settings/documentacion, no para arquitectura principal.

## Aprobado

- Mantener `Atelier Flow` como nombre interno.
- Iniciar implementacion con preset base `Couture`.
- Dividir Fase 2 en:
  - Phase 2A: shell, folder structure, `theme.liquid`, header/footer groups, tokens CSS, settings schema, locales base.
  - Phase 2B: `main-product`, `main-collection`, cart drawer y foundation JS.
- Adoptar como diferenciadores MVP:
  - editorial rhythm grid,
  - shoppable lookbook accesible,
  - dual-axis PDP,
  - sticky mobile cart bar,
  - cart drawer enriquecido,
  - metaobject-ready content blocks.

## Ajustes de Codex

- La lista de "11 plantillas JSON" en realidad contiene 12 archivos cuando se incluye `password.json`. Trataremos `password.json` como requerido por acceptance/submission prep y lo incluiremos desde el inicio.
- Evitar Mermaid en documentacion que vaya a ser consumida por todos los agentes si no aporta ejecucion directa; para futuras entregas, preferir tablas Markdown simples.
- `main-cart-drawer` no deberia ser una seccion obligatoria de template JSON aislada al inicio. Mejor implementarlo como section/snippet global incluido desde `theme.liquid` o header group, segun arquitectura final.
- `predictive-search` probablemente debe ser snippet/componente global, no seccion reusable ordinaria. Lo definiremos en arquitectura.
- `sticky-cart-bar` debe formar parte de PDP o snippet asociado a `main-product`, no una section independiente en el editor para evitar configuracion confusa.
- Los tokens de color deben integrarse con `settings_schema.json` y/o Color Schemes nativos de Shopify; no hardcodear presets finales solo en CSS.

## Riesgos Aceptados

- Hotspots y lookbook ya existen en temas premium. Nuestro diferencial debe estar en accesibilidad, mobile UX, authoring experience y relacion con compra.
- El cart drawer puede crecer demasiado. Debe empezar simple y robusto antes de agregar upsells.
- El sistema de settings puede volverse pesado. Debemos preferir controles por intencion: density, mood, commercial intensity, media rhythm.

## Escalamiento

ESCALATE_MODEL_RECOMMENDED

Conviene usar un modelo superior de OpenAI antes de codificar Phase 2A porque se definira la arquitectura base de Liquid, JSON templates, sections, snippets, CSS tokens y JS components. Un error aqui multiplicaria deuda tecnica en todo el tema.

## Uso Futuro de Claude

Claude es recomendable despues de tener schemas iniciales para:

- labels y helper texts de settings,
- empty states,
- documentacion para merchants,
- revision UX/editorial de tono premium.

No es necesario para iniciar arquitectura tecnica.

## Proxima Accion

Codex debe preparar `docs/phase-2-architecture-plan.md` y luego, idealmente con modelo superior, implementar Phase 2A.

