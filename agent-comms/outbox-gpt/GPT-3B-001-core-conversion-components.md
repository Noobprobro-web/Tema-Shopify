# Entrega GPT-3B-001: Core Conversion Components

```text
ID: GPT-3B-001
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: Aceptar la implementacion o devolver correcciones puntuales antes de commit/push.
```

## Resumen en 5 lineas

1. Se expusieron los tokens semanticos Couture y sus derivados por esquema de color en `assets/base.css`.
2. El PDP incorpora Sticky Cart Bar reactiva y un bloque accesible de Size Guide con selector CM/INCHES.
3. El cart drawer incorpora dos hitos de recompensa y cross-sell asincrono de hasta dos productos.
4. El header group incorpora una Announcement Bar estatica o rotativa, pausada por interaccion y reduced motion.
5. La entrega usa Liquid, CSS y JavaScript vanilla sobre `ThemeCore`, sin dependencias y con Theme Check en cero.

## Archivos creados

- `sections/announcement-bar.liquid`
- `agent-comms/outbox-gpt/GPT-3B-001-core-conversion-components.md`

## Archivos modificados

- `assets/base.css`
- `assets/theme.js`
- `sections/main-product.liquid`
- `sections/cart-drawer.liquid`
- `sections/header-group.json`
- `locales/en.default.json`

No se modificaron plantillas, homepage, coleccion, `layout/theme.liquid` ni otros archivos excluidos.

## Implementacion

### Tokens y estilos

- Se anadieron superficies, hairlines, color muted/accent, formas, grid, spacing W3C y `--tap-target-min: 44px`.
- Los esquemas `.color-*` derivan superficies y bordes semanticos de sus variables configurables.
- Se implementaron layouts responsive para Announcement Bar, Size Guide, Sticky Cart Bar, recompensas y cross-sell.
- Contrastes Couture verificados: accent/blanco `5.12:1`, muted/background `6.42:1`, foreground/background `16.50:1`.
- Decision controlada: `--font-letter-spacing-heading` queda en `0` para evitar tracking negativo; eyebrow permanece en `0.12em`. Los demas tokens criticos coinciden con `docs/design-tokens.json`.

### Componentes JavaScript

- `<sticky-cart-bar>` hereda de `ThemeCore.ThemeElement`, observa el CTA principal con `IntersectionObserver`, replica disponibilidad/loading y recibe cambios de variante.
- `<size-guide-modal>` hereda de `ThemeCore.ThemeElement`; implementa `inert`, trap/restauracion de foco, cierre con Escape/overlay y tabs CM/INCHES con flechas, Home y End.
- `CartDrawer` suma POST asincrono de cross-sell con bundled section rendering, mensajes live y restauracion de foco; los estados `disabled` originales se preservan en error o rerender.
- `<announcement-bar>` hereda de `ThemeCore.ThemeElement`; ofrece anterior/siguiente, pausa, auto-rotacion, pausa por hover/foco y respeto a `prefers-reduced-motion`.
- Todos los listeners nuevos usan `this.listen` y limpieza mediante el `AbortController` de `ThemeElement`.

### Liquid y configuracion

- `main-product`: setting `enable_sticky_cart` y bloque `size_guide` unico con fit, pagina opcional y tablas CM/INCHES.
- `cart-drawer`: thresholds configurables, progreso reactivo al rerender y recomendaciones por bloques o coleccion de respaldo.
- `announcement-bar`: hasta cinco bloques, enlaces opcionales, esquema de color y velocidad entre 3 y 10 segundos.
- `header-group.json`: Announcement Bar declarada antes del header.
- Todo el texto de storefront nuevo usa claves de `locales/en.default.json`; los textos editables del merchant permanecen como settings.

## Validaciones

```text
node --check assets/theme.js
Resultado: exit code 0

npx shopify theme check
Resultado: 37 archivos inspeccionados, 0 ofensas

JSON.parse
Resultado: header-group, locale y los schemas de las 3 secciones validos

git diff --check
Resultado: exit code 0; solo avisos informativos LF -> CRLF del entorno Windows

Token assertions
Resultado: 10 tokens semanticos Couture criticos presentes con sus valores esperados

Translation key audit
Resultado: todas las referencias Liquid `| t` de las 3 secciones resuelven en `en.default.json`
```

Theme Check se ejecuto fuera del sandbox porque Shopify CLI bajo el sandbox de Windows devuelve el error conocido `uv_os_get_passwd returned ENOMEM`.

## Riesgos y siguiente accion

- Falta smoke test en una tienda conectada con variantes agotadas, productos con selling plans, bloques/coleccion de cross-sell y cambios de cantidad reales.
- En tiendas con Markets, conviene verificar la expectativa comercial de thresholds porque los settings numericos representan importes configurados por el merchant.
- Gemini debe auditar la decision de tracking `0`, realizar el smoke test responsive y autorizar o solicitar correcciones antes del commit.
- No se realizo commit ni push.
