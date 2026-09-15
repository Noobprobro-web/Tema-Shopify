# CLAUDE-REPORT-4D-001 — Peak hardening y cinematic refine

**Sprint:** 4D-001 · **Directiva:** `agent-comms/inbox-claude/CLAUDE-DIRECTIVE-4D-001-peak-hardening-y-cinematic-refine.md`
**Implementador:** Claude · **Fecha:** 2026-09-15
**Estado:** entregado en árbol local, **sin `git commit` ni `git push`** (Gemini audita el diff, Johandry autoriza).

---

## 0. Resumen ejecutivo

Los tres pilares están ejecutados. Además de la recalibración pedida, el "rómpelo todo" del Pilar 2 encontró **dos bugs reales de producto** que no aparecían con las pruebas anteriores porque los mocks eran más benévolos que Shopify, y el Pilar 3 encontró **una inconsistencia real del Theme Editor** (el ajuste `button_radius` no llegaba a dos botones), un selector muerto, dos tokens muertos, un token definido y jamás usado (`--ease-exit`) y una clave de locale existente pero sin cablear (`opens_in_new_window`). Todo corregido y cubierto con prueba.

| Compuerta | Exigido | Resultado |
| :--- | :--- | :--- |
| `shopify theme check` | 0 errores, 0 advertencias | **0 ofensas** (`--output json` → `[]`, 74 ficheros inspeccionados) |
| `shopify://` en el repo | cero | **cero** (`grep -rn` sobre templates, config, sections, snippets, layout, locales, assets, listings) |
| Strings en inglés quemados en Liquid | cero | **cero** (auditoría por AST simplificado: 12 falsos positivos, todos entidades HTML, JSON-LD o scripts inline) |
| Librerías externas | cero | cero (sin cambios de dependencias) |
| `npm run gates:static` (8 compuertas) | verde | **verde**, exit 0 |
| Harness Playwright (real `theme.js` + `base.css`) | verde | **34/34** (26 previos + 8 nuevos de 4D) |
| Ficheros del tema tocados | — | 5 (`assets/base.css`, `assets/theme.js`, `sections/main-product.liquid`, `sections/cart-drawer.liquid`, `sections/main-cart-items.liquid`) + `docs/requirements-ledger.md` (solo texto de evidencia) |

---

## 1. Pilar 1 — "Atelier Prime": recalibración del sistema de movimiento

### 1.1 Tokens: antes vs después (`assets/base.css`)

| Token | Antes (4C-002) | Después (4D-001) | Línea | Rango pedido |
| :--- | :---: | :---: | :---: | :--- |
| `--motion-fast` | 160ms | **160ms** (sin cambio) | 52 | — (realimentación, no debe ralentizarse) |
| `--motion-base` | 320ms | **680ms** | 53 | 600–750ms ✓ |
| `--motion-slow` | 640ms | **1000ms** | 54 | 900–1100ms ✓ |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | igual, **ahora en uso** (§3.3) | 55 | — |
| `--ease-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | igual ("silk" expo-out) | 56 | curva silk ✓ |
| `--ease-move` | `cubic-bezier(0.65, 0, 0.35, 1)` | igual | 57 | — |
| `--reveal-shift` | 12px | **24px** | 60 | 20–28px ✓ |
| `--reveal-stagger` | 60ms | **90ms** | 61 | 80–100ms ✓ |

El comentario del bloque (líneas 40–51) documenta el **reparto por intención**, que es lo que evita que subir `base` ralentice la interfaz: `fast` = realimentación que sigue al usuario (hover de botón, chevron, cabecera); `base` = entrada de superficie (cruce de imagen, reveal, quick add, líneas de carrito); `slow` = masas grandes (cajones, modales, escala de imagen).

### 1.2 Reasignaciones de consumidores (mismo fichero)

| Consumidor | Antes | Después | Línea |
| :--- | :--- | :--- | :---: |
| `cart-drawer-enter` (entrada del cajón) | `220ms ease-out` literal | `var(--motion-slow) var(--ease-enter)` = 1000ms | 6070 |
| `announcement-reveal` | `180ms` literal | `var(--motion-base) var(--ease-enter)` | 6078 |
| `.site-header` (condensación al bajar) | `var(--motion-base)` | `var(--motion-fast)` — sigue al scroll, si tarda 680ms se lee como lag | 6231 |
| `hero-content-settle` (solo texto, solo `full`) | `var(--motion-slow)` | `var(--motion-base)` — un segundo de titular casi invisible ya es retrasar contenido primario | 6195 |
| Hover de tarjeta de producto | `scale(1.015)` | **`scale(1.025)`** | 1724 |
| Escalonado de líneas del carrito | ya existía (`cart-line-in`, `--item-index` desde Liquid `cart-drawer.liquid:129`) | ahora hereda `base` = 680ms + 40ms por línea | 6251–6255 |

Bucles que **no** se tokenizan a propósito (no son entradas): `theme-spin 800ms`, `lookbook-hotspot-pulse 2.4s`, `editorial-marquee var(--marquee-duration)`.

### 1.3 Motor de reveal (`assets/theme.js`)

- `REVEAL_TARGETS` (3230–3251): **+6 objetivos** — `.lookbook__header`, `.curated-showcase__header`, `.complete-the-look__header`, `.bento-discovery__header`, `.product-recommendations__header`, `.brand-manifesto__statement`. Van primero en la lista para que el encabezado intersecte antes que su rejilla.
- **Exclusión deliberada** (comentario 3231–3234): los encabezados de página (`.collection-main__header`, `.main-search__header`, `.main-blog__header`, `.main-list-collections__header`) no entran: son el `h1`, están sobre el pliegue y esconderlos aunque sea 680ms retrasa contenido primario. Prueba `motion.spec.mjs` #8 lo fija.
- Observer (3275–3276): `rootMargin: '0px 0px -6% 0px'`, `threshold: 0.05` (antes -8% / 0.04).
- El hero sigue fuera por selector y por `closest('.hero-editorial')` (3284). LCP nunca oculto.

### 1.4 Reglas de oro, verificadas

| Regla | Cómo se verifica |
| :--- | :--- |
| LCP nunca oculto | `motion.spec.mjs` #4 (`#inside-hero` jamás recibe `data-reveal`) |
| `prefers-reduced-motion` mata el 100% | `motion.spec.mjs` #3 + llave 2 en `base.css:6287–6306` (`!important` sobre animation/transition/reveal/view-transition) |
| `animations: none` mata el 100% | `motion.spec.mjs` #2 + llave 1 en `base.css:6271–6285` |
| Sin JS / sin IntersectionObserver todo se ve | `motion.spec.mjs` #1 (`data-reveal-ready` solo lo pone el motor) |
| CLS < 0.05 / Performance ≥ 60 | No se ha re-medido en tienda real en este sprint (no tengo acceso). El reveal solo anima `opacity`/`transform` (compositor, sin layout) y ningún cambio de 4D toca dimensiones. Recomiendo a Gemini re-ejecutar Gate 5 con `animations: none` y `subtle` para atribuir el 83→72 de 4C (ver §5). |

---

## 2. Pilar 2 — "Rómpelo todo"

### 2.1 Auditoría estática de estados límite (sin cambios necesarios)

Todas las ramas vacías/hostiles existen y están localizadas: carrito vacío (`cart-drawer.liquid:114`, `main-cart-items.liquid:15`), búsqueda sin resultados (`main-search.liquid:279`, `predictive-search.liquid:21`), colección vacía (`main-collection.liquid:312`), producto sin imágenes (`product-gallery__placeholder`, `product-card__media-placeholder` con `placeholder_svg_tag`), agotado (`updateForms` → `soldOutText`, botón deshabilitado, badge), variante inexistente (`updateForms(undefined)` → `unavailableText`). 40 variantes: el JSON de variantes se emite pre-formateado con `| money` (`main-product.liquid:513–545`), `updateOptionAvailability` es O(opciones × variantes) — trivial a 40. Títulos largos: `body { overflow-wrap: anywhere }` (`base.css:112`) y `.product-card { min-width: 0 }`.

### 2.2 Suite destructiva nueva: `stress.spec.mjs` (7 pruebas, viewport 390px) + `stress.html`

| # | Prueba | Resultado |
| :---: | :--- | :--- |
| 1 | Título de 160 caracteres con token de 60 sin espacios: la tarjeta, el título y la página no desbordan; la fila de la rejilla no se rompe | ✓ |
| 2 | Modal de guía de tallas con título hostil: abre, no desborda, foco dentro, `Escape` cierra y devuelve el foco al disparador | ✓ |
| 3 | Cart drawer: línea con título hostil y 6 opciones largas no desborda el panel (sin scroll horizontal) | ✓ |
| 4 | Trampa de foco del drawer: 12 `Tab` + 12 `Shift+Tab` nunca salen del panel; `Escape` devuelve foco | ✓ |
| 5 | 10 ciclos abrir/cerrar rápidos: un solo estado coherente (sin `inert` sobrante en `<main>`, sin lock de scroll huérfano, `pendingMutations` 0) | ✓ |
| 6 | **Ráfaga de 12 cambios de cantidad** con respuestas en orden inverso: el DOM termina en el valor del servidor y sin GET de sincronización | ✓ **tras corregir bug B1** |
| 7 | Ráfaga cuya **última** mutación falla (422): el servidor queda en 8, el DOM muestra 8 (no 5 ni 9), exactamente 1 GET de resincronización y el error sigue visible tras el repintado | ✓ (nueva, cubre B1) |

Nota sobre el "+/−": el cajón y la página de carrito **no tienen botones +/−**, solo `<input type="number">` (`cart-drawer.liquid:206–218`, `main-cart-items.liquid:110–118`). Las flechas del input disparan `change` en cada pulsación, así que la ráfaga de `changeLine` es el equivalente exacto. Añadir un stepper +/− es una **decisión de diseño para Johandry** (§5), no la he implementado.

### 2.3 Fallas encontradas y corregidas

#### B1 — Carrera de respuestas en el cart drawer (`assets/theme.js`) — **bug real, severidad alta**

**Síntoma:** con varias mutaciones en vuelo, Shopify renderiza la sección `cart-drawer` **en el momento de aplicar cada cambio**, así que una respuesta lenta de una petición antigua trae HTML más viejo que una rápida. `renderCartResponse` pintaba lo que llegara, en el orden en que llegara. Reproducido de forma determinista: 12 cambios (3→14) con latencia inversa al orden de salida → **DOM = 3, servidor = 14**, sin error visible y sin resincronización.

**Por qué no lo vio la suite de 4B-007:** el mock anterior renderizaba la sección en el momento de *responder*, no de *procesar*, así que toda respuesta traía el estado final. He corregido el mock (`stress.spec.mjs:23–33`) para que se comporte como Shopify.

**Corrección:**
- `beginMutation()` devuelve la revisión de la mutación (1621–1628).
- `renderCartResponse(result, revision)` (1670–1681) descarta la respuesta si `revision !== this.syncRevision` — antes y después del `requestSection()` de respaldo.
- Las cuatro llamadas pasan su revisión: `addItem` (1490/1518), `addCrossSell` (1536/1569), `changeLine` (1584/1614), `CompleteTheLook.addSelectedItems` (2280/2323).
- `endMutation()` (1630–1640): al llegar `pendingMutations` a 0, si la última revisión **no** llegó a pintarse (falló, fue abortada o perdió la carrera) y el cajón está abierto, hace **un** `syncCart()`. Antes solo lo hacía si un `syncCart` había sido desplazado durante la ráfaga. Economía verificada: en la ráfaga feliz (prueba 6) hay **0** GET extra porque la última respuesta sí se pinta.
- El mensaje de error vive fuera de `[data-cart-drawer-content]` (`cart-drawer.liquid:438–439`), así que la resincronización no lo borra (prueba 7 lo afirma).

#### B2 — El estado oculto del reveal se animaba (`assets/base.css`) — **bug real, severidad media (visual)**

**Síntoma:** la transición de `opacity`/`transform` estaba en `[data-reveal]` a secas, es decir, en **ambos** estados. Si el navegador ya había calculado estilo antes de que corriera `theme.js` (la página pinta antes de llegar al script del final de `<body>`, cosa habitual con CSS en caché), al poner `data-reveal` el elemento **se animaba de visible a oculto** durante 680ms. Bajo el pliegue no se ve; **sobre el pliegue** producía un parpadeo y anulaba la entrada (el observer lo revelaba un frame después y la transición se invertía desde ~1px). Reproducido: 4 de 8 cargas del fixture mostraban `transform` intermedio (`22.17px`, `opacity 0.07`) sin `data-revealed`. Con `theme.js` retrasado 150ms, 8/8.

**Corrección** (6165–6188): la transición y el `transition-delay` del escalonado viven **solo** en `[data-reveal][data-revealed]`; el estado pendiente solo declara `opacity: 0; transform: translateY(var(--reveal-shift)); will-change`. Ocultar es instantáneo; revelar se anima. CSS arranca transiciones según el estilo de destino, así que el reveal conserva duración, curva y escalonado (prueba #9 lo mide: `0.68s` y `0.09s` en el segundo hermano; `0s` en el estado oculto).

**Pruebas nuevas:** `motion.spec.mjs` #9 (reescrita: mide oculto y revelado por separado) y **#10** (retrasa `theme.js` con `page.route` para forzar el peor caso y muestrea 8 veces: siempre `matrix(1,0,0,1,0,24)|0`). #10 falla de forma determinista contra el CSS anterior (verificado).

#### Fixture: dos defectos de construcción corregidos en `stress.html`

El `<p>` de error usaba `data-cart-drawer-error` en vez de `data-cart-error`, así que `showError` no encontraba salida y la aserción `error === ''` de la prueba 6 era vacía. Corregido a los hooks reales del tema (`data-cart-status` / `data-cart-error`, con `hidden` y roles). Lo declaro porque afecta a la credibilidad de la primera ejecución verde que reporté en la sesión.

---

## 3. Pilar 3 — Cierre técnico y submission readiness

### 3.1 Localización 100%

- **Texto quemado en Liquid:** escaneo de `sections/`, `snippets/`, `layout/`, `templates/` eliminando `{% schema %}`, comentarios, `<style>`, JSON inline y objetos/etiquetas Liquid; búsqueda de nodos de texto y de atributos `aria-label|placeholder|title|alt|label|value|content` con texto literal. **12 coincidencias, 0 reales** (entidades `&ndash;`/`&times;`/`&ldquo;`, JSON-LD de `structured-data.liquid`, scripts inline de `theme.liquid`/`gift_card.liquid`/`featured-product.liquid`).
- **JS:** `theme.js` no contiene ninguna frase en inglés como literal; todos los textos llegan por `data-*` desde Liquid localizado. Solo literales de nombres de clase.
- **Claves:** 332 claves `t:` usadas en schemas y 322 claves `| t` en storefront, **todas resuelven** contra `en.default.schema.json` / `en.default.json`. Labels de schema: 0 candidatos a Title Case (todo en sentence case).
- **Clave existente sin usar → cableada:** `general.accessibility.opens_in_new_window` existía en el locale y ningún enlace `target="_blank"` la usaba. Los dos que hay (archivos subidos como propiedad de línea) ahora la anuncian con `<span class="visually-hidden">` — `cart-drawer.liquid:171`, `main-cart-items.liquid:71`. Con esto **las 333 claves del locale están en uso**.

### 3.2 Theme Check

```
$ shopify theme check --output json
[]
$ shopify theme check
74 files inspected with no offenses found.
```

Sin `.theme-check.yml` (preset `recommended`, el de la Theme Store). Para ir más allá ejecuté también `extends: theme-check:all`: **3 avisos informativos, ninguno exigible**: `AssetSizeCSS` (base.css 133.597 B sin comprimir, umbral 100.000) ×2 y `AssetSizeJavaScript` (theme.js 23.793 B gzip, umbral 10.000). Ambos checks están desactivados en `recommended` por opinables; la Theme Store mide Lighthouse, no estos umbrales. Tamaños gzip reales: **base.css 21,8 KB · theme.js 23,8 KB**.

### 3.3 CSS muerto y bugs latentes (`assets/base.css`)

| Hallazgo | Tipo | Corrección | Líneas |
| :--- | :--- | :--- | :---: |
| `--radius-button: 2px` hardcodeado usado por `.sticky-cart-bar__submit` y `.cart-cross-sell__button`, mientras `.button` y el payment button usan `--button-radius` (alimentado por `settings.button_radius`, `theme.liquid:74`) | **bug real del Theme Editor**: el ajuste de radio del comerciante no llegaba a esos dos botones | token eliminado; ambos usan `var(--button-radius)` | 1551, 2192 |
| `--radius-card`, `--space-none` | tokens definidos y jamás leídos | eliminados | (bloque `:root`) |
| `--ease-exit` | token público definido en 4C-002 y **nunca usado** | cableado en el único cruce real del tema: en el hover de tarjeta la imagen que sale usa `ease-exit`, la que entra `ease-enter`, en ambos sentidos (la curva la fija el estilo de destino). El `transform` conserva `ease-move` | 1701–1717 |
| `.sticky-cart-bar__variant[hidden]` | selector muerto: el `<span data-sticky-variant>` no tenía esa clase | la clase se añade al markup (`main-product.liquid:583`), coherente con su hermano `__separator` | 1547 |
| Clases sin referencia literal (17) | 15 son modificadores construidos por interpolación Liquid (`hero-editorial--{{ … }}`, `product-main__layout--{{ … }}`) y 1 la emite Shopify (`shopify-payment-button__button--unbranded`) | vivas, sin cambio | — |
| Atributos `data-*` en CSS sin emisor | 0 | — | — |
| `--cluster-gap` | leído con fallback como hook público (`gap: var(--cluster-gap, var(--space-3))`) | vivo | 317 |

### 3.4 Compuerta de repositorio

- `grep -rn "shopify://"` sobre `templates config sections snippets layout locales assets listings` → **0 resultados**.
- JSON válido en `templates/**`, `config/`, `locales/`, `sections/*.json`, `listings/**` (0 inválidos); todos los `type` de sección referenciados por `listings/*/templates/*.json` existen en `sections/`.
- `Sartorial-1.0.0.zip` (gate 8): 93 entradas, solo carpetas del tema + `listings/`. Observación menor: existe un directorio vacío `listings/templates/` (sin ficheros) en el árbol del dispositivo; inocuo, pero conviene borrarlo a mano (el puente no puede borrar).
- Sin `console.*`/`debugger` en `theme.js`; sin `<img>` sin `width`/`height` en Liquid.
- `docs/requirements-ledger.md:21`: texto de evidencia "Theme Check: 72 archivos" sustituido por "0 ofensas (0 errores, 0 advertencias; la cifra de archivos varía por entorno…)" — la métrica que ya corregí en 4B-007 §0. Ningún estado de fila cambia; `gates:ledger` verde.

---

## 4. Verificación

```
npm run gates:static      → 8/8 verde, exit 0 (json, hooks, sanity, locales, ledger, theme-check, syntax, package)
node --check assets/theme.js → OK
npx playwright test       → 34 passed (verify 10, r007 7, motion 10, stress 7), 3 ejecuciones consecutivas sin flakes
```

Ficheros del harness (van a `harness-4D-001/` en el dispositivo): `pw.config.mjs`, `fixture.html`, `motion.html`, `stress.html`, `verify.spec.mjs`, `r007.spec.mjs`, `motion.spec.mjs`, `stress.spec.mjs`. Para ejecutar: copiar `assets/theme.js` y `assets/base.css` a la carpeta y `npx playwright test -c pw.config.mjs`.

---

## 5. Cabos que quedan fuera de mi alcance (decisiones o acciones de otros)

1. **Stepper +/− en el carrito** (Johandry): hoy solo hay `<input type="number">`. Es una mejora de UX de conversión razonable para un tema de 380–400 USD; si se aprueba, la haría con `beginMutation/changeLine` tal cual y sin tocar la concurrencia (ya cubierta).
2. **Re-medir Gate 5** (Gemini): Lighthouse Home móvil con `animations: none` vs `subtle` para atribuir el 83→72 de 4C (confundido con 5→8 secciones + fotos). Tokens más largos no afectan a LCP/CLS: el reveal es `opacity`/`transform` en compositor y el LCP está excluido.
3. **Publicar los 24 productos y 6 colecciones** en el canal Online Store; **paso 6 de Gemini** (asignar productos a lookbook / complete-the-look / bento) y la sección bento vacía (evidencia en `evidencia-bento-vacio.png`).
4. `/pages/documentation` y `/pages/support` siguen sin existir: único bloqueante de rechazo automático (`theme_info` en `settings_schema.json:3–9`).
5. Decisión pendiente B4 (overlay de quick-add).
6. Borrar a mano el directorio vacío `listings/templates/`.

---

## 6. Inventario de cambios para la auditoría de Gemini

| Fichero | Cambio | Líneas (fichero final) |
| :--- | :--- | :--- |
| `assets/base.css` | tokens 4D (base 680, slow 1000, shift 24, stagger 90) + comentario de reparto por intención; `--radius-button`/`--radius-card`/`--space-none` eliminados | 33–61 |
| `assets/base.css` | `.sticky-cart-bar__submit` y `.cart-cross-sell__button` → `var(--button-radius)` | 1551, 2192 |
| `assets/base.css` | cruce de imagen de tarjeta con `ease-exit`/`ease-enter` explícitos; hover `scale(1.025)` | 1701–1725 |
| `assets/base.css` | `cart-drawer-enter` → `slow`; `announcement-reveal` → `base` | 6070, 6078 |
| `assets/base.css` | reveal: transición solo en estado revelado (B2) | 6165–6188 |
| `assets/base.css` | `hero-content-settle` → `base`; `.site-header` → `fast` | 6195, 6231–6233 |
| `assets/theme.js` | revisión por mutación en `addItem`, `addCrossSell`, `changeLine`, `CompleteTheLook` (B1) | 1490, 1518, 1536, 1569, 1584, 1614, 2280, 2323 |
| `assets/theme.js` | `beginMutation` devuelve revisión; `endMutation` resincroniza si la última revisión no se pintó; `renderCartResponse(result, revision)` descarta respuestas superadas | 1621–1640, 1670–1681 |
| `assets/theme.js` | `REVEAL_TARGETS` +6 encabezados con exclusión documentada; observer −6% / 0.05 | 3230–3251, 3271–3277 |
| `sections/main-product.liquid` | `class="sticky-cart-bar__variant"` en el span de variante | 583 |
| `sections/cart-drawer.liquid` | anuncio "Opens in a new window" en enlace de archivo subido | 171 |
| `sections/main-cart-items.liquid` | ídem | 71 |
| `docs/requirements-ledger.md` | evidencia de Theme Check corregida (solo texto) | 21 |

Sin cambios en `config/`, `locales/`, `templates/`, `listings/`, `snippets/`, `layout/`.
