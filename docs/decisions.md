# Decisions

Registro de decisiones importantes del tema.

## 2026-09-11

- Se usara Git desde el inicio para mantener historial y facilitar colaboracion entre agentes.
- Codex sera lider tecnico y Gemini Flash 3.8 High apoyara investigacion, QA y matrices de decision.
- Shopify CLI sera la herramienta oficial para desarrollo y Theme Check.
- La direccion inicial recomendada es `Atelier Flow`: minimalismo editorial para marcas premium de producto fisico, con eficiencia transaccional tomada de `Quiet Commerce`.
- Se usaran temas top como benchmark etico: adoptar fortalezas, resolver fricciones y evitar copiar layout/codigo/assets/copy.
- `Atelier Flow` queda como nombre interno. Se evitara `Atelier` como nombre final por posible confusion con el tema gratuito de Shopify.
- GPT 5.5 low se usara para coordinacion y trabajo liviano. Para arquitectura, performance, accesibilidad compleja y revision final se recomendara escalar a un modelo superior de OpenAI.
- Se crea `agent-comms/token-efficiency-rules.md` como regla compartida para ahorrar tokens, definir jerarquia de modelos y evitar trabajo duplicado entre agentes.
- Claude se considerara opcional para revision editorial, UX, documentacion merchant-facing, copy de settings y segunda opinion de producto; Codex mantiene la decision tecnica final.
- Se aprueba `GEMINI-002` con ajustes: Phase 2A sera shell/theme skeleton y Phase 2B sera commerce foundation. Se recomienda escalar a modelo superior antes de codificar Phase 2A.
- Gemini completo la investigacion oficial de Theme Store, benchmark competitivo y riesgos tecnicos en `docs/gemini-task-01-report.md`.
- Se validaron los 3 presets iniciales: `Couture`, `Studio` y `Archive`.
- Se confirmo la ejecucion funcional de Shopify CLI 4.8.0 y Theme Check con 0 ofensas iniciales.
- Phase 2A adopta `color_scheme_group` nativo de Shopify como fuente de color; `theme.liquid` traduce cada esquema a tokens CSS semanticos consumidos por `base.css` y las secciones.
- Los componentes vanilla JS usan el prefijo `theme-` y una base compartida `ThemeCore`, con registro idempotente, mejora progresiva, foco atrapado/restaurado e `inert` para drawers.
- Los 12 JSON templates comparten temporalmente `main-placeholder` para conservar templates validos sin adelantar las secciones commerce reservadas para Phase 2B.
- El header usa el componente nativo obligatorio `<shopify-account>` con menu configurable y visible en todos los breakpoints; el footer integra `login_button` para Follow on Shop sin alterar su marca.
- `Couture` es el unico preset de configuracion incluido en Phase 2A; `Studio` y `Archive` se incorporaran cuando sus diferencias sean funcionales y verificables.
- Phase 2A queda aprobada por Codex. `Atelier Flow` no debe usarse como `theme_name` publico; se usa `Theme Project` temporalmente hasta elegir nombre final.
