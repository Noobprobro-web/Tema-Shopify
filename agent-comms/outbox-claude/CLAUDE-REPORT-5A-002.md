# CLAUDE-REPORT-5A-002: Compuerta 5 del Sprint 5A en la tienda real y fixtures de GPT-AUDIT-004

```text
ID: CLAUDE-REPORT-5A-002 (responde a CLAUDE-DIRECTIVE-5A-002)
Estado: fixtures creados y publicados en /collections/qa-sprint-5a (8 de 9; la gift card no se
        puede crear hasta que la tienda active las tarjetas de regalo). Compuerta 5 medida en la
        tienda real con el tema f2f2291 desplegado: 0 áreas interactivas por debajo de 44 x 44 px,
        0 solapes y 0 px de desborde a 1280 y a 390 px; axe-core sin violaciones en los componentes
        de 5A; compra real en inglés y en español con el foco en la línea añadida y el carrito de
        vuelta a 0. Swatches de filtros sin verificar en vivo: la tienda solo tiene filtros de
        disponibilidad y precio. Sin commit ni push; ningún archivo del tema cambió.
Decisión requerida:
  1. Johandry: añadir el filtro de Color en la app Search & Discovery (Filtros > Añadir filtro >
     la opción de producto "Color"). Sin ese filtro no existen swatches de filtro que medir, ni en
     colección ni en búsqueda (§4.1). Después corro qa-live.js otra vez.
  2. Johandry: activar las tarjetas de regalo en el admin (Configuración > Tarjetas de regalo) si
     quieres el fixture F08 en vivo. La tienda rechazó crearlo (GIFT_CARDS_NOT_ACTIVATED).
  3. Gemini: aplicar o rechazar dos parches de Nivel 2 fuera de 5A (§5): contraste del idioma
     inactivo en la cabecera (la única violación WCAG que queda en la tienda) y los landmarks de
     cabecera y pie. Con los dos simulados en el DOM vivo, axe da 0 violaciones, best-practice incluida.
  4. Gemini: con esta evidencia, decidir si la fila "Selector de Variantes y Swatches Nativos" pasa
     a cumplido. La de filtros debe esperar al punto 1 (§7).
Resumen en 5 líneas:
  1. Admin (cada mutación confirmada en el host): definiciones estándar shopify--color-pattern y shopify.color-pattern activadas, 9 colores (7 con color, 1 con imagen, 1 sin swatch), colección oculta qa-sprint-5a y 8 productos con stock, publicados en la Tienda online.
  2. Tamaños: de 19 a 24 áreas medidas por estado (tarjetas, swatches, "+N", botones, panel y filtros); la menor mide 44 x 44 px; 0 solapes; 0 px de desborde en los 5 estados.
  3. axe-core 4.10.2 (WCAG 2.0, 2.1 y 2.2 A y AA más best-practice) en los 3 estados pedidos: 0 violaciones en tarjetas, panel y hoja. Quedan 2 fuera de 5A: el botón "ES"/"EN" inactivo a 2.80:1 (solo escritorio) y "region" (best-practice) porque la cabecera y el pie viven dentro de un <section>.
  4. Compra real de F03 (talla L en inglés, S en español) con clic de ratón: aria-busy en el panel y en el botón, las demás tallas deshabilitadas, cajón abierto en 1,07 s, foco en el enlace de la línea (?variant=), mensaje localizado; retirada con la X del cajón (carrito 0) y Escape devuelve el foco al disparador.
  5. Swatches en vivo: color e imagen nativos, "Undyed" como etiqueta de texto, el cursor previsualiza y restaura, el clic compromete foto, alt, enlace, precio (F04 Camel pasa de "From $320.00" con oferta a $340.00) y tallas (S y M agotadas; Olive XL "Option unavailable").
Archivos tocados: ninguno del tema. Nuevos: este informe y agent-comms/outbox-claude/harness-5A-002/ (§8).
Desviaciones (Nivel 1 o Nivel 2): 3 de Nivel 1 (§6). 2 parches de Nivel 2 propuestos, no aplicados (§5).
Hallazgos extra (con parche listo): 2, más 1 observación sin parche (§5).
Verificación (comando, resultado y qué demuestra/qué no): §3 y §4.
Lista de afirmaciones falsables numeradas: §9.
```

---

## 1. Fixtures en la tienda

Colección "QA Sprint 5A" (`/collections/qa-sprint-5a`, orden manual), sin enlace en ningún menú, publicada en la Tienda online. Todos los productos llevan la etiqueta `qa-sprint-5a` y la descripción "QA fixture ... Not a real product". Las fotos son copias de las del catálogo demo.

| Fixture | Handle | Modo en la tarjeta | Qué cubre |
|---|---|---|---|
| F01 | `qa5a-f01-single` | `single` | Variante única, 20 unidades (QB-01) |
| F02 | `qa5a-f02-sold-out` | `sold_out` | Variante única, 0 unidades (QB-02) |
| F03 | `qa5a-f03-size-only` | `picker` | Talla XS a XL, M agotada (QB-03, QB-04) |
| F04 | `qa5a-f04-colour-size` | `picker` | Color sin swatch nativo (Ink, Camel, Olive, Bone) x S a XL, foto por color; Ink en oferta $320/$380; Camel $340 con S y M agotadas; Olive XL no existe; Bone agotado entero (QB-05, QB-07, SW-01, SW-06, SW-07) |
| F05 | `qa5a-f05-native-swatches` | `picker` | Color enlazado a `shopify.color-pattern`: Ink y Bone con color, Clay con imagen, Undyed sin swatch; x S M L; Bone S agotada; Undyed sin foto (SW-01 a SW-08) |
| F06 | `qa5a-f06-subscription` | `options` | `requiresSellingPlan: true` (QB-11) |
| F08 | `qa5a-f08-gift-card` | | **No creado**: la tienda respondió `GIFT_CARDS_NOT_ACTIVATED` (§4.2) |
| F10 | `qa5a-f10-hostile` | `picker` | Título de 142 caracteres, vendor largo, una sola foto (QB-20) |
| F11 | `qa5a-f11-many-swatches` | `direct` | 7 colores enlazados, Burgundy agotado, 4 con foto (SW-10, SW-11, SW-12) |

Cambios en el admin, en orden, cada uno confirmado en el host:
1. `standardMetaobjectDefinitionEnable(type: "shopify--color-pattern")`. Campos obligatorios: `label`, `color_taxonomy_reference` y `pattern_taxonomy_reference`.
2. `standardMetafieldDefinitionEnable(PRODUCT, shopify, color-pattern)`.
3. 9 `metaobjectCreate` (handles `qa5a-ink` ... `qa5a-forest`; patrón "liso", `TaxonomyValue/2874`).
4. `collectionCreate` de `qa-sprint-5a`.
5. `productSet` síncrono para los 8 productos, en 3 llamadas. La de F06 y F08 aplicó F06 y rechazó F08.
6. `publishablePublish` de la colección y los 8 productos en la Tienda online.

No reutilicé los borradores `qa-01` a `qa-18` de auditorías anteriores: siguen intactos. IDs y handles en `harness-5A-002/fixtures-5a.json`.

---

## 2. Método

- **Tema medido:** Couture #165809488115 (MAIN). Antes de medir comprobé por Admin API que `product-card.liquid`, `theme.js`, `base.css`, `main-collection.liquid`, `main-search.liquid`, `cart-drawer.liquid` y `es.json` tienen en la tienda el mismo MD5 que en la carpeta de Johandry (commit `f2f2291`).
- **Navegador:** el navegador integrado de la app de Claude. La sesión del storefront ya estaba abierta en ese perfil, así que no hubo que escribir la contraseña. Tamaños emulados: 1280 x 800 y 390 x 844.
- **Mediciones:** `harness-5A-002/qa-live.js`, inyectado en la página: carga axe-core 4.10.2 desde cdnjs, mide cada área interactiva visible con `getBoundingClientRect` y busca solapes entre pares y desborde horizontal.
- **Interacción:** clics reales de ratón en disparadores, tallas, swatches, fondo de la hoja y la X del cajón; Escape real de teclado. Las marcas de tiempo de `aria-busy`, `disabled`, `open` y `data-open` salen de un `MutationObserver`.
- **Límite de la herramienta:** el panel del navegador no convierte Enter ni Espacio en activación de botón (ya documentado en 4F). La activación por teclado queda cubierta por el arnés local (B3, P5); en vivo solo probé Escape.

---

## 3. Resultados

### 3.1 Áreas de toque (44 x 44 px)

| Estado | Áreas medidas | Menor ancho x alto | Por debajo de 44 | Solapes | Desborde |
|---|---|---|---|---|---|
| 1280, rejilla de 4 (tarjetas de 214 px), cerrado | 19 | 44 x 44 (swatch y "+N") | 0 | 0 | 0 px |
| 1280, panel de tallas de F05 abierto | 23 (+ Cerrar y 3 tallas) | 44 x 44 | 0 | 0 | 0 px |
| 1280, rejilla de 2 (tarjetas de 444 px) | 23 | 44 x 44 | 0 | 0 | 0 px |
| 390, rejilla de 2 (tarjetas de 169 px), cerrado | 19 | 44 x 44 | 0 | 0 | 0 px |
| 390, hoja de F04 abierta (modal, 390 x 134 px al pie) | las 19 de arriba + 5 del panel (Cerrar y 4 tallas) | 44 x 44 | 0 | 0 | 0 px |

Botones de compra de ancho completo: 214, 444 y 169 px de ancho por 44 de alto. Filtros (disponibilidad y precio): 44 px de alto.

### 3.2 axe-core en la tienda real

| Estado | WCAG A/AA (2.0, 2.1, 2.2) | best-practice |
|---|---|---|
| 1280, colección, panel cerrado | 1: `color-contrast` en el botón de idioma inactivo | 1: `region` (10 nodos de la cabecera) |
| 1280, panel de tallas abierto | la misma | la misma |
| 390, hoja modal abierta | 0 | 1: `region` (9 nodos) |
| 1280, `/es/collections/qa-sprint-5a` | la misma `color-contrast` (ahora sobre "EN") | no medido |
| 1280, con los parches de §5 simulados en el DOM vivo | 0 | 0 |

Ningún nodo de tarjeta, swatch, panel, hoja ni cajón aparece en las violaciones. Las dos que quedan vienen de la cabecera (commit `9c46e2a` y la etiqueta `section` del esquema) y tienen parche en §5.

### 3.3 Compra real y carrito (QB-01, QB-08, QB-17, QB-18)

**Inglés, `/collections/qa-sprint-5a`, F03, talla L:**
1. Clic en "Quick add": el panel se abre (`open`), `aria-expanded="true"`, el foco va a XS (primera disponible) y M sale deshabilitada con "Sold out".
2. Clic en L. En t = 0: `aria-busy="true"` en el panel y en el botón L, y las otras 4 tallas pasan a `disabled`.
3. En t = 1,07 s: el panel se cierra y el cajón se abre (`data-open`). Las tallas se reactivan salvo M, y el `aria-busy` se retira.
4. El foco está en el enlace de la línea "F03 Size Only Blazer", `href=/products/qa5a-f03-size-only?variant=51572123992307`. La región viva dice "Item added to your cart.". `/cart.js`: 1 artículo, "F03 Size Only Blazer - L".
5. Clic en la X de la línea: carrito 0. Escape: el cajón se cierra y el foco vuelve al disparador de F03.

**Español, `/es/collections/qa-sprint-5a`, F03, talla S:** mismo recorrido y mismos cambios de atributos. `form action="/es/cart/add"` y `data-cart-add-url="/es/cart/add.js"`. El foco cae en `/es/products/qa5a-f03-size-only?variant=51572123926771`. El cajón dice "Tu carrito" y "Artículo añadido a tu carrito." Textos de la tarjeta: "Añadir rápido", "Seleccionar talla", "Agotado", "Añadir al carrito", "Elegir opciones", "+5 más". Carrito de vuelta a 0 y foco devuelto al disparador.

**Móvil, 390, F04:** el toque en "Quick add" abre la hoja con `showModal()` (`:modal`), `data-modal-open` en el body y el foco en S. Un toque en el fondo la cierra y el foco vuelve al disparador.

### 3.4 Swatches en vivo

| Comprobación | Resultado |
|---|---|
| F05, datos nativos (SW-01) | Ink `rgb(29, 35, 49)` y Bone `rgb(228, 218, 200)` pintados desde `swatch.color`; Clay con `url(.../doppio...)` desde `swatch.image`; Undyed como etiqueta de texto (`card-swatch--text`) |
| Grupo (SW-05) | `role="radiogroup"`, `aria-label="Color"`, un solo `tabindex="0"` por tarjeta, `aria-label="Color: Ink"` por swatch |
| F05, clic en Bone (SW-04) | Foto `qa5a-f05-bone.jpg`, `alt` "Bone alpaca cardigan-coat", enlace `?variant=51572138672371`, `aria-checked` solo en Bone; el panel muestra S agotada |
| F11, cursor sobre Bone y salida (SW-02, SW-03) | La foto pasa a `qa5a-f11-bone.jpg` sin tocar `aria-checked` ni el enlace; al salir vuelve a `qa5a-f11-ink.jpg` |
| F04, toque en Camel a 390 (QB-07, SW-07) | El precio pasa de "From $320.00 / $380.00 / Sale" a "$340.00" sin oferta; foto `qa5a-f04-camel.jpg`; S y M "Sold out" |
| F04, Olive | XL "Option unavailable" (no existe la variante) |
| F04, Bone (SW-06) | 4 tallas deshabilitadas e insignia "Sold out" en el precio |
| F05, Undyed sin foto (SW-08) | Vuelve a la foto destacada; ninguna imagen rota (`naturalWidth > 0`) |
| Densidad (SW-10, SW-11) | 1280 con rejilla de 4 (tarjetas de 214 px): 2 + "+2" en F04 y F05, 2 + "+5" en F11. 1280 con rejilla de 2 (444 px): los 4 de F04 y F05 sin pill, 4 + "+3" en F11. 390 (169 px): 2 + "+N" |
| "+N" (SW-12) | Enlace a la ficha, `aria-label` "+3 more" / "+5 más" |

### 3.5 Degradaciones en vivo
F01 "Add to cart" (1 clic); F02 botón "Sold out" deshabilitado; F06 "Choose options" hacia la ficha; F11 compra directa "Add to cart" sincronizada con el color. Sin errores en la consola durante las pruebas.

---

## 4. Lo que no pude verificar en vivo

### 4.1 Swatches en filtros (SW-13, SW-14)
La colección y la búsqueda solo ofrecen los filtros "Availability" y "Price". Lo comprobé en `/collections/qa-sprint-5a` y en `/search?q=swatch|F05|blazer`. El tema pinta swatches cuando existe un filtro de color, pero en esta tienda no hay ninguno. Los filtros se configuran en la app Search & Discovery y no tienen API de administración, así que lo tiene que hacer Johandry (decisión 1). Hasta entonces, la evidencia de filtros es la del arnés local (G1 a G3, `probe-facet5a.mjs`).

### 4.2 Gift card (QB-13)
La tienda tiene las tarjetas de regalo desactivadas, y activarlas es un ajuste de la cuenta que no toco sin permiso. El fallback a la ficha para gift cards sigue probado en el arnés (C1).

### 4.3 Capturas
El navegador integrado no exporta imágenes a archivo, así que la evidencia es la de §3: mediciones, atributos y respuestas de `/cart.js`, todas repetibles con `qa-live.js`. Las capturas que tomé durante la sesión confirman lo mismo (panel sobre la base de la imagen, hoja al pie con fondo velado, cajón con la línea), pero no quedan en el repositorio.

### 4.4 Activación con Enter y Espacio
Límite de la herramienta (§2). Cubierto por el arnés local.

---

## 5. Hallazgos extra (parches de Nivel 2, no aplicados)

### 5.1 Botón de idioma inactivo por debajo de 4.5:1 (WCAG 1.4.3)
`assets/base.css:6299-6307` (commit `9c46e2a`): el idioma inactivo usa `opacity: 0.45`. Sobre `#f7f3ea` da `rgb(149, 146, 140)`, 2.80:1, con 12 px y peso 500. Es la única violación WCAG que queda en la colección. Parche en `harness-5A-002/patch-language-switcher-contrast.diff`: `color: var(--color-foreground-muted)` (unos 8:1) y `color: var(--color-foreground)` al pasar el cursor o con foco. El activo sigue marcado por peso 700 y subrayado. Theme Check 87 archivos y 0 ofensas con el parche; simulado en la tienda, `color-contrast` pasa a 0.

### 5.2 Cabecera y pie sin landmark (axe `region`, best-practice)
`sections/header.liquid:230` y `sections/footer.liquid:135` declaran `"tag": "section"`. Un `<header>` o `<footer>` dentro de un `<section>` pierde el rol de banner y de contentinfo, y axe marca 9 o 10 nodos de la cabecera como contenido fuera de landmarks. Parche en `harness-5A-002/patch-header-footer-landmarks.diff`: `"tag": "div"` en los dos. La cabecera fija de 4F-001 no depende de la etiqueta, porque se engancha a `#shopify-section-{{ section.id }}`. Con el parche simulado, `region` pasa a 0. No es un requisito WCAG AA, pero Lighthouse lo reporta.

### 5.3 Observación sin parche: el nombre de la tienda se corta a 390 px
Con la tienda ya llamada "LINEA NOVE", a 390 px la marca se ve como "LINEA NO…" junto a búsqueda, cuenta y carrito. Es una decisión de diseño (tamaño del logotipo en texto o un logo en imagen), no un defecto de 5A.

---

## 6. Desviaciones de Nivel 1

- **D1.** No reutilicé qa-06 ni qa-09: creé productos nuevos con prefijo `qa5a-` para no alterar la evidencia de auditorías anteriores.
- **D2.** F04 usa un Color sin swatch nativo a propósito, para probar en vivo el respaldo de texto de SW-01 junto a F05, que sí los tiene.
- **D3.** Los fixtures F07, F09 y F12 no estaban en la lista de 5A-002 y no los creé. Más de 250 variantes y el listado combinado siguen cubiertos por el arnés (C2).

---

## 7. Ledger (propuesta, no editado)

- **"Selector de Variantes y Swatches Nativos":** hay evidencia en tienda real para pasarla a `cumplido`. Serían F03, F04, F05 y F11 en `/collections/qa-sprint-5a`, más §3 de este informe.
- **"Filtros Facetados Nativos en Colección y Búsqueda":** sigue en `código completo` hasta que exista un filtro de color en la tienda (§4.1).

No toqué `docs/requirements-ledger.md`: la directiva no lo pedía y el cambio de estado es de Gemini.

---

## 8. Carpeta `agent-comms/outbox-claude/harness-5A-002/`

| Archivo | Qué es |
|---|---|
| `qa-live.js` | Mediciones en vivo: áreas de toque, solapes, desborde y axe-core |
| `fixtures-5a.json` | IDs y handles de colección, productos, metaobjetos y definiciones |
| `fixtures-5a-productset.py` | Generador de las entradas de `productSet` usadas |
| `patch-language-switcher-contrast.diff` | Parche de §5.1 |
| `patch-header-footer-landmarks.diff` | Parche de §5.2 |

**Para retirar los fixtures más adelante:** archivar o eliminar desde el admin los productos con la etiqueta `qa-sprint-5a` y la colección `qa-sprint-5a`, y los 9 metaobjetos `qa5a-*` del tipo Color. Borrar es permanente y lo hace Johandry.

---

## 9. Afirmaciones falsables

1. `/collections/qa-sprint-5a` muestra 8 productos y la colección no aparece en ningún menú de navegación.
2. En la tienda, `snippets/product-card.liquid` tiene MD5 `82229c9e66f5a1b46cbc5f992e452349` y `assets/theme.js` `1eca1d47cbdc720929f392f46d56e657`, iguales a los de la carpeta de Johandry.
3. Con `qa-live.js` a 1280 x 800 y a 390 x 844, `qa.targets().small` y `qa.targets().overlaps` están vacíos y `overflowX` es 0, también con el panel o la hoja abiertos.
4. `qa.axe()` no devuelve ningún nodo dentro de `.product-card`, `[data-quick-buy-panel]` ni `cart-drawer`.
5. A 1280, `qa.axe()` devuelve `color-contrast` con 1 nodo, el botón de idioma inactivo, cuyo color efectivo es `rgb(149, 146, 140)` sobre `rgb(247, 243, 234)` (2.80:1).
6. Tras abrir el panel de F03 y tocar L, `/cart.js` devuelve 1 línea con `variant_id` 51572123992307, y `document.activeElement` es el enlace de esa línea en el cajón.
7. En `/es/collections/qa-sprint-5a`, el formulario de compra rápida de F03 tiene `action="/es/cart/add"` y el disparador dice "Añadir rápido".
8. En F05, el swatch Clay tiene `background-image: url(...doppio...)`, Ink y Bone tienen color de fondo y Undyed lleva la clase `card-swatch--text`.
9. En F04, tras tocar Camel, el precio de la tarjeta es "$340.00" sin insignia de oferta y las tallas S y M están deshabilitadas.
10. A 390 px, F11 muestra 2 swatches y "+5"; con la rejilla de 2 a 1280 px muestra 4 y "+3".
11. `productSet` con `giftCard: true` en esta tienda devuelve `GIFT_CARDS_NOT_ACTIVATED`.
12. Tras las pruebas, `/cart.js` devuelve `item_count: 0`.
13. Con los dos parches de §5 aplicados, Theme Check inspecciona 87 archivos sin ofensas.
