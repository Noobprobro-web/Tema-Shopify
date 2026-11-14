# REVIEW-LV05-004. Cuarta revisión de LV-05 (CN-3 y CN-4)

Fecha: 2026-11-10. Revisor: Claude (subagente, solo lectura).
Commit: `1598b9452f7668b393aa4136523e9eb265b51800` (task/lv05, worktree `wt-lv05`). La rama tiene 4 commits propios (`605459c`, `239ab06`, `8a6a3b7` y `1598b94`) y su diff desde la merge-base con `lote-e-claude` (`e8f17e5`) toca `assets/base.css`, `docs/requirements-ledger.md`, `snippets/card-swatch-fit.liquid` (nuevo) y `snippets/product-card.liquid`.

`lote-e-claude` avanzó después: `git diff lote-e-claude..1598b94`, con dos puntos, muestra además archivos ajenos a esta rama. `git merge-tree` contra la punta actual de `lote-e-claude` no da conflictos.

No modifiqué el repo ni hice commit o push, y `git status --short` sale vacío. liquidjs 10.30.1 quedó instalado solo en `scratchpad/review-lv05-004/lj/`.

## Veredicto

**ACEPTADO CON CONDICIONES.**

CN-3 y CN-4 quedan cerradas. El Liquid real, renderizado con liquidjs, produce un `data-swatch-fit` idéntico al del harness del autor en los 24 casos. Con ese HTML y el `base.css` real, a 1280 px las tallas cortas muestran las 4 sin "+N". Los nombres largos se leen y el "+N" es accesible y cuenta bien. No hay scroll horizontal, los títulos siguen alineados y no hay regresiones en LV-05, LV05-NF01 ni CN-1. Theme Check da `[]` y no hay credenciales.

Condiciones:
1. **CN-5 (P3, robustez).** El ancho mínimo de texto está en rem (`--card-swatch-text-min: 4.75rem`, `assets/base.css:2003`), pero la estimación de Liquid (76 en `snippets/card-swatch-fit.liquid:21-28`) y las bandas del container query (`base.css:2063-2181`) están en px. Si el usuario sube el tamaño de letra por defecto del navegador al 125 %, las piezas miden 95 px y se solapan (NF-01 en otra forma). Con el HTML real pasa en g4 (Long thirty, Mixed names), search y 404 a 1280, y en bento y curated a 320. No es nuevo de este commit: con 8a6a3b7 y el mismo ajuste ya salían solapes y desbordes de 13-15 px en g2, rv y search, y 239ab06 no los tenía en las rejillas del alcance. La solución más sencilla es fijar el mínimo en px (76px) para que coincida con la estimación, o expresar bandas y estimación en la misma unidad. El zoom normal del navegador no se ve afectado.
2. Sigue vigente: liquidjs no es el motor de Shopify. D-03 y la fila del ledger necesitan evidencia de R-Demo en la tienda real, con un producto de valores cortos y otro de valores largos.

Observación, no bloqueante: la estimación de 9 px por carácter es conservadora. A 320 px, "Red / Blue / Gold / Teal" muestra "Red +3" con unos 56 px libres, y "Ivory" en un grupo mixto muestra solo el primer color con "+3" teniendo 60 px libres. Nunca desborda, pero oculta piezas que cabrían. Si se quiere afinar, bastaría con unos 7 px por carácter más 28.

## 1. Liquid real frente al harness del autor

- `render.js` usa liquidjs 10.30.1 con `jsTruthy: false`, un filtro `t` que lee `locales/en.default.json` y un tag `form` de paso. Renderiza el `snippets/product-card.liquid` completo de 1598b94, que a su vez hace `render 'card-swatch-fit'`, con las fuentes sacadas de un `git archive 1598b94`. Para el modo enlace añadí `product_url` a los valores.
- Fixtures: XS/S/M/XL con 4 y 6 valores, Red/Blue/Gold/Teal, nombres largos con 30, 2 y 1 valores, WWWW/MMMM, mixto con color y nombre largo, mixto con color y "Ivory", mixto de nombres (Medium/S/Midnight…/XL), solo color y sin swatches. Cada uno en modo radio y en modo enlace.
- Resultado (`fit-compare.json`): **24/24 coincidencias** con `fitWords` y los anchos de pieza de `harness-lv05/run.js:25-38` y `:47`. Ejemplos: tallas 4 → `a1 b2 c4 d4 e4 f4 g4 h4`; tallas 6 → `a1 b2 c3 d3 e4 f4 g4 h4`; largos 30 → `a1 b1 c1 d2 e2 f3 g3 h4`; solo color y sin swatches → sin atributo.
- Markup verificado en `rendered.json`:
  - `data-swatch-fit` en el grupo (`product-card.liquid:193`).
  - Clases `card-swatch--n2..n4` solo en grupos con texto. Los grupos de color mantienen `--wide-only` y las píldoras `--narrow` y `--wide` (`:241-247`, `:315-335`).
  - Píldoras `--k1..k4` con `aria-label` "+N more" y el texto visible `aria-hidden` (`:303-313`).
  - `title` en `:266` y `:289`.
  - El `split: ','` con la coma final no genera un elemento vacío en liquidjs, igual que en Ruby.

## 2. Playwright con el HTML real y el base.css real

Arnés: `r4.js`, que carga el HTML de `rendered.json` con `v4.css` (`git show 1598b94:assets/base.css`). Anchos: 320, 390, 768 y 1280. Rejillas: g4 (4 filas de casos), g2, lista, recs, recently viewed, search, 404, article, bento y curated. Log en `r4.log` y datos en `r4.json`. Capturas: `real-g4-{a,c}-{320,1280}.png`.

- **1280, tallas cortas (g4, fila de 310 px):** "XS S M XL" sin "+N" con 4 valores, y "XS S M XL +2" con 6. Red/Blue/Gold/Teal, las 4. El grupo mixto con Ivory muestra 4 piezas sin "+N", y el mixto largo 4 piezas con "+2". CN-3 resuelta.
- **Legibilidad de nombres largos:**
  - g4 a 320: 1 pieza con 11-12/21 caracteres y "+29".
  - g4 a 390 y 768: 16-18/21.
  - g4 a 1280: 3 piezas con 6-9 caracteres y "+27".
  - Long two a 1280: 2 piezas con 16/21.
  - Mínimo observado: 5/20 en "WWWW…", que tiene glifos anchos. En nombres normales, 6.
- **"+N":** como mucho una píldora visible por tarjeta, y en todos los casos coincide con el total menos los visibles (p. ej. tallas 6: "+4", "+3" o "+2" según caben 2, 3 o 4). El `aria-label` es igual al texto visible más "more", y la píldora mide 44×44 sin solapes.
- **Scroll horizontal:** no hay en ningún ancho (`scrollWidth` igual al viewport).
- **Títulos:** desfase 0 en todas las rejillas del alcance. Bento da 25 px a 1280, porque está excluido a propósito, como antes.
- **LV05-NF01:** 0 solapes, 0 desbordes de fila o tarjeta y objetivos de 44 px o más con el CSS por defecto. Con una fuente más ancha (Verdana/DejaVu en `.card-swatch__text`) también da 0 incidencias en todos los anchos.
- **CN-1:** el `title` y el `aria-label` completos se mantienen, y la legibilidad es igual o mejor que en 8a6a3b7.
- **CN-4:** `base.css:2128-2130` y el comentario de CN-3 ya dicen "unos 6 caracteres", coherente con lo medido.

## 3. Theme Check, alcance, ledger y credenciales
- `npx shopify version` devuelve 4.8.0 y `npx shopify theme check --output json` devuelve `[]` con exit 0 (`review-lv05-004/tc.json`).
- `node scripts/ledger-verify.mjs` (sin `--fix`) da 63 filas e "Incoherencias: 0". El ledger actualiza la fila LV05-NF01/CN1/CN3 y los localizadores de LV05-V01.
- No hay credenciales: busqué token, secret, password, api key, shpat_, shpss_, bearer y URLs en las líneas añadidas de `lote-e-claude...1598b94`, sin coincidencias.
