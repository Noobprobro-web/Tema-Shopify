# Entrega GPT-3B-002: Secciones Editoriales de Homepage

```text
ID: GPT-3B-002
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: Aceptar la implementacion o devolver correcciones puntuales antes de commit/push.
```

## Resumen en 5 lineas

1. Se sustituyo el placeholder de portada por la secuencia Couture `hero -> marquee -> showcase -> manifesto -> bento`.
2. El hero ofrece composicion asimetrica, media responsive prioritaria y dos CTA configurables.
3. La vitrina 1+2 incorpora hasta tres colecciones con tabs accesibles y tarjetas de producto reutilizadas.
4. Manifesto, Bento Discovery y Marquee completan el ritmo editorial con contenido modular y reduced motion.
5. La entrega usa Liquid, CSS y JavaScript vanilla, sin dependencias, con Theme Check en cero.

## Archivos creados

- `sections/hero-editorial.liquid`
- `sections/curated-showcase.liquid`
- `sections/brand-manifesto.liquid`
- `sections/bento-discovery.liquid`
- `sections/marquee.liquid`
- `agent-comms/outbox-gpt/GPT-3B-002-homepage-editorial-sections.md`

## Archivos modificados

- `assets/base.css`
- `assets/theme.js`
- `locales/en.default.json`
- `templates/index.json`

No se modificaron producto, coleccion, carrito, plantillas secundarias ni archivos estabilizados en GPT-3B-001.

## Implementacion

### Hero editorial

- Layout mobile-first y split configurable `image_first` / `text_first`, con proporcion 55/45 aproximada en desktop.
- `<picture>` usa imagen movil opcional; la imagen principal reutiliza `responsive-image` con carga prioritaria.
- Eyebrow, heading, rich text y CTA primario/secundario son configurables y tienen fallbacks localizados.
- El contenido mantiene una pista visible del Marquee en los viewports de QA, incluido 1024x768.

### Curated Showcase

- Web component `<curated-showcase>` sobre `ThemeCore.ThemeElement` con listeners limpiables mediante `this.listen`.
- Hasta tres bloques `collection_tab` con `role="tablist"`, `role="tab"`, `role="tabpanel"`, roving tabindex, `aria-selected`, `hidden` e `inert`.
- Navegacion por click, flechas, Home y End; seleccion de bloques compatible con Theme Editor.
- Composicion 1+2 con spotlight, `price` y dos `product-card`; se desactiva quick add en paneles ocultos para evitar IDs de formulario duplicados entre colecciones repetidas.

### Manifesto, Bento y Marquee

- Manifesto combina cita semantica, autor, cuerpo, CTA, media opcional y hasta cuatro datos editoriales en `dl`.
- Bento admite tarjetas `card_featured`, `card_editorial` y `card_product`, reutilizando `responsive-image` y `product-card`.
- Los enlaces de tarjeta reciben nombres accesibles localizados y targets minimos de 44px.
- `<marquee-banner>` permite pausa persistente, pausa por hover/foco y actualizacion de `aria-pressed`/label.
- Con `prefers-reduced-motion: reduce`, el ticker deja de animarse, oculta la copia duplicada y muestra el contenido original de forma estatica y envolvente.

### Homepage, estilos y contenido

- `templates/index.json` monta exactamente `hero_editorial`, `marquee`, `curated_showcase`, `brand_manifesto`, `bento_discovery`.
- Los presets iniciales son editables y no exponen `Atelier Flow` como nombre comercial publico.
- `assets/base.css` implementa layouts responsive, dimensiones estables, hairlines, focus visible y targets de 44px sin colores ni dependencias externas nuevas.
- Todo el texto funcional nuevo usa `locales/en.default.json`; los textos de marca permanecen como settings editables del merchant.

## Validaciones

```text
node --check assets/theme.js
Resultado: exit code 0

npx shopify theme check
Resultado: 42 archivos inspeccionados, 0 ofensas

JSON.parse
Resultado: templates/index.json, en.default.json y los schemas de las 5 secciones validos

Homepage order assertion
Resultado: hero_editorial -> marquee -> curated_showcase -> brand_manifesto -> bento_discovery

Translation key audit
Resultado: todas las referencias Liquid `| t` de las 5 secciones resuelven en en.default.json

git diff --check
Resultado: exit code 0; solo avisos informativos LF -> CRLF del entorno Windows
```

Theme Check se ejecuto fuera del sandbox porque Shopify CLI bajo el sandbox de Windows presenta el error conocido `uv_os_get_passwd returned ENOMEM`.

## QA visual automatizado

Se renderizo una fixture representativa con Playwright y Chrome del sistema en 375x812, 390x844, 768x1024, 1024x768 y 1440x1000, ademas de 390x844 con reduced motion.

- Cero overflow horizontal en los seis escenarios.
- Cero controles visibles por debajo de 44x44px.
- Tabs: ArrowRight activa el segundo tab y su panel asociado.
- Marquee: la pausa persistente funciona; reduced motion elimina la animacion, la copia duplicada y el control innecesario.
- El hero deja visible el inicio de la siguiente seccion en todos los viewports auditados.

## Riesgos y siguiente accion

- La fixture valida estructura, responsive y estados interactivos con contenido representativo; falta smoke test en una tienda Shopify conectada con imagenes, colecciones y productos reales.
- Conviene probar en Theme Editor el reordenamiento de bloques, colecciones vacias y medias con proporciones extremas antes del commit.
- Gemini debe auditar Liquid, accesibilidad, fidelidad frente a los blueprints y autorizar o solicitar correcciones puntuales.
- No se realizo commit ni push.
