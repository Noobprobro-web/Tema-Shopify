# harness-MOTION-002 — Verificación del motor de animación nativo

Arnés de la tarea **T5** de la migración **MOTION-002**. Sustituye a
`agent-comms/outbox-claude/harness-LEAD-001/13-motion-check.mjs`, que medía el motor
GSAP (`data-motion-pending`, `window.ScrollTrigger`). Aquí se verifica el contrato
nuevo, 100% nativo.

| Archivo | Qué es |
| --- | --- |
| `01-motion-check.mjs` | El arnés completo. Playwright, ESM, sin dependencias nuevas. |
| `results-01-motion-check.json` | Salida (se sobreescribe en cada ejecución). |
| `evidence/*.png` | Capturas a mitad de gesto. Se sobreescriben por nombre. |
| `evidence/print-<proyecto>-<ruta>.pdf` | PDF de Chromium de la prueba de impresion (G11). |

El inventario de tiendas y el desbloqueo del storefront (reintentos 429, reutilización
de cookies fuera del repositorio) **no se duplican**: se importan de
`../harness-AUDIT-FINAL-003/lib.mjs`, que es el patrón compartido.

---

## 1. Contrato que verifica

```
data-reveal=""            pendiente de coreografía
data-reveal="done"        asentado (el gesto terminó)
data-revealed             marca del motor IntersectionObserver
html[data-reveal-ready]   el motor JS arrancó
html[data-animations]     none | subtle | full
```

La selección de motor es cascada CSS pura
(`@supports (animation-timeline: view()) and (animation-range: entry 0% entry 100%)`).
El arnés **no** exige que el JS consulte `CSS.supports`: solo observa el resultado.

**Axioma que se persigue:** ningún elemento puede quedar oculto permanentemente, en
ninguna combinación de soporte / JS / modo.

---

## 2. Qué mide

### Por cada ruta (`/`, `/collections/all`, `/products/<handle>`, `/pages/about`)

| # | Métrica | Aprobado |
| --- | --- | --- |
| M1 | `CSS.supports('animation-timeline: view()')` **y** `animation-range: entry 0% entry 100%` | informativo (condiciona M3) |
| M2 | `[data-reveal=""]` tras recorrer la página entera scrolleando, más la lista de `[data-reveal]` con `opacity < 0.05`, `clip-path: inset(100%…` o `visibility: hidden` | **0 y 0** (fallo duro) |
| M3 | `getAnimations()` con `timeline.constructor.name !== 'DocumentTimeline'`, tomando el **máximo** visto durante el recorrido | `> 0` en modo `full` con soporte; `0` con `reduce`; `0` sin soporte |
| M4 | `window.gsap === undefined` y `window.ScrollTrigger === undefined` | ambos `true` |
| M5 | Todos los `<script src>` del documento + menciones a `gsap`/`ScrollTrigger` en scripts en línea | 0 ofensores **del tema**, 0 menciones en línea |
| M6 | CLS durante el scroll (`PerformanceObserver`, `layout-shift`, sin `hadRecentInput`) | `< 0.1` |
| M7 | 40 tabulaciones; el elemento enfocado y sus ancestros sin `opacity < 0.05` ni `clip-path: inset(100%` ni `visibility: hidden` (WCAG 2.4.7 / 2.4.11) | 0 focos invisibles |
| M8 | Capturas a mitad de gesto, con el **progreso real** de la animación scroll-driven anotado junto al PNG | ≥1 captura con progreso en (0,3 – 0,7) |
| M9 | Impresión sin scroll (solo proyectos Chromium): la página carga en pantalla, **no** se hace scroll, `page.emulateMedia({ media: 'print' })` y se inspecciona cada `[data-reveal]` y sus hijos animados (los que tienen `getAnimations()` o son líneas/medio de B8). Luego `page.pdf()` en `evidence/`. | 0 elementos con `opacity < 1`, `visibility: hidden`, `clip-path` que recorte la caja o `transform` distinto de la identidad (G11, fallo duro) |

### Escenarios

- **`reduce`:** las 4 rutas con `reducedMotion: 'reduce'`. Debe dar `[data-reveal]` = 0,
  `scrollAnimations` = 0, `pending` = 0 y `<html>` **sin** `data-reveal-ready`.
- **Respaldo (`@supports not`):** Firefox con
  `firefoxUserPrefs: { 'layout.css.scroll-driven-animations.enabled': false }`.
  Debe revelar vía IntersectionObserver (`data-revealed` presente) y no dejar nada con
  `opacity: 0`. Es la rama que nadie mira: la prueba más valiosa del arnés.
- **Ruta corta (guardia de fin de página):** una ruta con poco o ningún scroll. Al llegar
  al final, `[data-reveal=""]` debe ser 0. Si la ruta resulta tener más de 900 px de
  scroll, el arnés la declara `NO_MEDIBLE` en vez de darla por buena.
- **Estados degenerados (Gate 2):** vacío, único, masivo, muy largo (120+ chars) y
  falta de asset, resueltos **contra el catálogo real** de la tienda
  (`/collections.json`, `/products.json`). Lo que no exista en la tienda sale como
  `NO_ALCANZABLE` con su motivo; el arnés no inventa un resultado.

### Keyframes

Se compara el conjunto observado en `getAnimations()` contra
`scroll-rise`, `scroll-fade`, `scroll-line-rise`, `scroll-unveil`,
`scroll-unveil-settle`, `hero-parallax`, `marquee-drift`.
Los no observados se listan como informativos: cada uno vive en secciones concretas que
la tienda puede no tener configuradas.

---

## 3. Proyectos Playwright

| Proyecto | Navegador | Particularidad |
| --- | --- | --- |
| `chromium-full` | Chromium | Rama nativa. Modo forzado a `full`. |
| `chromium-reduce` | Chromium | `reducedMotion: 'reduce'`. |
| `firefox-no-scroll-driven` | Firefox | `layout.css.scroll-driven-animations.enabled = false`. Ejerce `@supports not`. |

Se seleccionan con `MOTION_PROJECTS` o con el primer argumento posicional:

```bash
node agent-comms/outbox-claude/harness-MOTION-002/01-motion-check.mjs chromium-full
MOTION_PROJECTS=firefox-no-scroll-driven node .../01-motion-check.mjs
```

Si un navegador no está instalado, el proyecto queda `launched: false` con el comando
exacto para instalarlo y el veredicto agregado baja a **INCOMPLETO**: nunca a APTO.

---

## 4. Cómo se ejecuta

```bash
# obligatorio contra una tienda demo real
export STOREFRONT_PASSWORD='…'          # PowerShell: $env:STOREFRONT_PASSWORD='…'

node agent-comms/outbox-claude/harness-MOTION-002/01-motion-check.mjs
```

Si falta Firefox:

```bash
npx playwright install firefox
```

### Variables de entorno

| Variable | Por defecto | Para qué |
| --- | --- | --- |
| `STOREFRONT_PASSWORD` | **sin valor por defecto** | Contraseña del storefront. **Obligatoria** salvo destino local. No existe ningún literal en el código (`CLAUDE.md:23`). |
| `MOTION_STORE` | `atelier` | Tienda del inventario de `lib.mjs` (`atelier`, `edition`, `archive`). |
| `MOTION_BASE_URL` | la URL de `MOTION_STORE` | URL completa. Si **no** es `*.myshopify.com` (p. ej. `http://127.0.0.1:9292` de `shopify theme dev`) se considera destino local: no se desbloquea nada y `STOREFRONT_PASSWORD` deja de ser obligatoria. |
| `MOTION_PRODUCT` | primer handle de la tienda | Handle para la ruta `/products/<handle>`. Sin él en destino local, esa ruta se omite y queda anotado. |
| `MOTION_ROUTES` | `/,/collections/all,/products/<handle>,/pages/about` | Lista separada por comas. |
| `MOTION_SHORT_ROUTE` | la colección de 1 producto que encuentre, si no `/pages/contact` | Ruta para la guardia de fin de página. |
| `MOTION_PROJECTS` | los tres | Proyectos a ejecutar, separados por comas. |
| `MOTION_PRINT` | `1` | `0` desactiva la prueba de impresión (G11). |
| `MOTION_PRINT_ONLY` | sin valor | `1` corre solo G0 y G11 sobre `MOTION_ROUTES` (sin recorrido, teclado ni degenerados). Útil para no castigar el limitador de la tienda. |
| `MOTION_FORCE_MODE` | `full` | Valor que se escribe en `html[data-animations]` antes de que pinte la página. `MOTION_FORCE_MODE=''` desactiva el forzado y se usa el ajuste publicado. El valor nativo se registra en cada fila de todos modos. |
| `AUDIT_STATE_DIR`, `AUDIT_MIN_GAP_MS` | ver `lib.mjs` | Heredadas del patrón compartido: carpeta de cookies (fuera del repositorio) y ritmo entre navegaciones. |

El arnés es idempotente: sobreescribe `results-01-motion-check.json` y los PNG de
`evidence/`, y no escribe nada más dentro del repositorio. Las cookies de sesión viven
en el temporal del sistema, nunca en git.

---

## 5. Cómo se interpreta el veredicto

`results-01-motion-check.json` lleva `verdict` y una tabla `gates` (G0–G11). El
veredicto se **recalcula** a partir de lo medido; el JSON guarda la medición cruda, no
el juicio.

| Veredicto | Significado |
| --- | --- |
| `APTO` | Ni un fallo duro **y** todo medido. |
| `NO_APTO` | Al menos un fallo duro. Sale con código 1. |
| `INCOMPLETO` | Sin fallos, pero algo no se pudo medir: un navegador que no arrancó, una ruta sin contenido útil, `layout-shift` no soportado, un recorrido de teclado no concluyente o una preferencia de Firefox que el navegador ignoró. **No es un aprobado.** |

Cada fila lleva `verdict` (`PASA` / `FALLA` / `NO_MEDIBLE`), `failures` (fallos duros),
`warnings` (lo que no aplica, con el motivo) y `noMeasureReason`. Los estados
degenerados añaden `NO_ALCANZABLE`, que no bloquea pero queda explícito.

**La regla que gobierna todo el archivo:** un `0` nunca cuenta como aprobado si pudo
venir de "no se pudo medir". Ejemplos implementados:

- `cls.supported` distingue "CLS = 0" de "este navegador no implementa `layout-shift`"
  (Firefox nunca lo hace).
- `loaded.hasMain` + `bodyChildren` + `status` cierran la puerta antes de cualquier
  métrica: una ruta 404 es `NO_MEDIBLE`, no una página sin elementos ocultos.
- `loaded.themeJsRan` es el **control positivo** del motor: comprueba que `theme.js`
  llegó a definir algún custom element del tema. Sin él, "0 animaciones, 0 pendientes,
  0 ocultos" vendría de que el motor nunca existió en esa carga, y se leería como
  aprobado. Se aplica también a las rutas degeneradas.
- `keyboard.distinctFocusables` evita que "0 focos invisibles" sea verde cuando el foco
  nunca salió de `<body>`.
- `requireNoNativeSupport` en el proyecto de Firefox: si el navegador declara soporte a
  pesar de la preferencia, la rama de respaldo **no se ejercitó** y la fila es
  `NO_MEDIBLE`.
- `m3Applicable` separa "no hay animaciones scroll-driven" de "este navegador o este
  modo no las puede tener".
- `midGesture.progress` prueba que la captura es de media animación, en vez de confiar
  en una posición de scroll calculada.

---

## 6. Limitaciones conocidas

- **"50 por página"** no es alcanzable desde la URL: `products_per_page` es un ajuste de
  sección (`sections/main-collection.liquid`, min 8, máx 48, por defecto 24). El estado
  "masivo" se mide sobre `/collections/all` tal como lo rinde la tienda y el arnés anota
  el número de tarjetas.
- **Un solo ítem de marquee** y **una sola imagen de galería de sección** dependen de
  bloques del editor de temas y no se pueden provocar desde fuera. El arnés registra
  `marqueeItemsPerGroup` y `placeholderSvgInReveal` observados, y marca el estado como
  no alcanzable si el contenido actual no lo produce.
- Los estados degenerados y la ruta corta se miden **una vez**, en el primer proyecto que
  arranque y **que no sea `reduce`**, para no castigar el limitador de peticiones de la
  tienda. El cruce con los tres escenarios se hace en las 4 rutas principales. Si solo se
  pide `chromium-reduce`, se miden igualmente pero G8 y G9 salen `NO_MEDIBLE`: con `reduce`
  el motor no decora nada y un "0 pendientes" sería cierto y vacío a la vez.
- El recorrido completo es lento a propósito: el patrón compartido espacia cada
  navegación 2,5 s (`AUDIT_MIN_GAP_MS`) para no provocar un 429 de Cloudflare. Los tres
  proyectos con las 4 rutas, más degenerados y ruta corta, tardan varios minutos.

---

## 7. G11: contenido revelado al imprimir

Fila del ledger "Contenido Revelado al Imprimir". La llave 3 de B8 (`@media print` en
`assets/base.css`) promete que todo `html[data-reveal-ready] [data-reveal]` sale en papel
con `opacity: 1`, `transform: none`, `clip-path: none` y `animation: none`.

- Corre en `chromium-full` y `chromium-reduce` (Firefox no tiene `page.pdf()`), sobre
  `MOTION_ROUTES`. Las filas van en `projects[].printRows`.
- Control anti-vacío: en `full` al menos una ruta debe tener `[data-reveal=""]` al cargar
  sin scroll (`printExercised`); si no, G11 es `NO_MEDIBLE`. También exige `scrollY = 0`,
  `matchMedia('print')` verdadero y el PDF escrito.
- Se mira tambien a los **hijos** animados porque la llave 3 solo neutraliza el propio
  `[data-reveal]`: las líneas (`scroll-line-rise`) y el medio del unveil
  (`scroll-unveil-settle`) consumen el timeline `--reveal` del padre y no heredan su
  `animation: none`.

```bash
MOTION_PRINT_ONLY=1 MOTION_ROUTES='/,/collections/all,/products/serra-coat' \
  MOTION_STORE=atelier MOTION_PROJECTS=chromium-full,chromium-reduce \
  node agent-comms/outbox-claude/harness-MOTION-002/01-motion-check.mjs
```
