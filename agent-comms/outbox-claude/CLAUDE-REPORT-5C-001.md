# CLAUDE-REPORT-5C-001: Track 1, mega menú editorial y pulido P2-01 (Sprint 5C)

```text
ID: CLAUDE-REPORT-5C-001 (responde a CLAUDE-DIRECTIVE-5C-001)
Estado: ENTREGADO. Sin commit ni push. Working tree listo para la auditoría de Gemini.
Base: master 7fa1fe4 (el código del tema es el de 505e801). El Track 2 de GPT-6 tiene cambios
  sin commit en la misma carpeta (base.css, theme.js, locales, main-product, featured-product
  y tres archivos nuevos); los míos se fusionaron encima sin tocar los suyos (§2.3).
Decisión requerida:
  1. Gemini: auditar el diff del Track 1 (7 archivos del tema, +499 -49) junto con el Track 2 y
     autorizar el commit.
  2. Gemini: aceptar o revertir D1 a D8 (§5). Ninguna cambia ids existentes. El bloque nuevo
     mega_menu_promo es el Nivel 2 que autoriza la directiva.
  3. Johandry: el main-menu de la tienda tiene dos niveles, así que sin bloque no se verá ningún
     mega menú. Para la demo: añadir en el editor un bloque "Mega menu promotion" con
     "Catalog" y dos fotos verticales de 800 px o más, o un tercer nivel en el menú (§6, E5).
  4. Gemini, después de fusionar el Track 2: dos parches de 2 y 3 líneas en ThemeDisclosure
     (theme.js es del Track 2 en este sprint y la directiva pide cero JS): E1, que cierre el
     panel hermano al abrir otro, y E2, que el editor abra el mega menú al seleccionar su
     bloque (§6).
Resumen en 5 líneas:
  1. snippets/mega-menu.liquid decide entre panel clásico y mega menú: mega cuando el enlace
     tiene un bloque mega_menu_promo asociado o tres niveles. header.liquid baja de 24 a 21 de
     complejidad (máximo 120) y el panel clásico sale igual (HTML idéntico salvo espacios).
  2. Columnas por enlace de segundo nivel con su tercer nivel debajo; a la derecha, hasta dos
     tarjetas 4:5 con loading="lazy" (0 peticiones hasta abrir, medido). Cero JS nuevo:
     Tab en orden y sin trampa, Escape al disparador y aria-expanded los da <theme-disclosure>.
  3. El bloque se asocia por nombre sin distinguir mayúsculas, o por el handle del enlace: en
     /es "Catálogo" encuentra el bloque "Catalog". El menú móvil no cambia (marcado idéntico).
  4. P2-01: layout() anuncia el zoom reajustado tras un resize o un giro (225 % → 167 % en la
     foto de 928 px). product-zoom.js: 11.988 bytes.
  5. Arnés 5C 13/13 en y es (9 fallan en el árbol previo); arnés 5B 26/26 en y es; regresiones
     sin cambios. En la carpeta de Johandry, con los dos tracks: Theme Check 122 archivos sin
     ofensas, 404 claves con paridad, 5 compuertas en 0.
Archivos tocados: sections/header.liquid, snippets/mega-menu.liquid (nuevo),
  assets/product-zoom.js, y por fusión aditiva assets/base.css, locales/en.default.json,
  locales/es.json y locales/en.default.schema.json (§2). Arnés: harness-5C-001/ (nuevo) y
  harness-5B-001/zoom5b.spec.mjs (prueba P2-01). Este informe.
Desviaciones (Nivel 1 o Nivel 2): D1 a D8 de Nivel 1 (§5).
Hallazgos extra fuera de alcance: E1 a E6 (§6).
Verificación (comando, resultado y qué demuestra/qué no): §7.
Lista de afirmaciones falsables numeradas: §9.
```

---

## 1. Qué cambia para el comprador y el comerciante

| Caso | Antes | Ahora |
|---|---|---|
| Enlace con tres niveles (Catálogo → Mujer → Abrigos) | Desplegable estrecho de 15 rem con el tercer nivel sangrado debajo de cada hijo | Panel a todo el ancho bajo la cabecera: "View all Catalog", una columna por hijo con su título en la tipografía editorial y sus enlaces debajo |
| Enlace con bloque "Mega menu promotion" | No existía | Las mismas columnas y, a la derecha, hasta dos tarjetas con foto vertical 4:5, título y subtítulo, cada una enlazada |
| Enlace de dos niveles sin bloque | Desplegable clásico | Igual, mismo marcado |
| Móvil | Acordeón en el cajón | Igual, mismo marcado |
| Teclado | Tab, Escape y flechas en el desplegable | Lo mismo en el mega menú: Enter abre, Tab recorre en orden de lectura y sale al siguiente enlace de primer nivel, Escape cierra y vuelve al disparador, Flecha abajo entra |
| Peso | | 0 fotos pedidas hasta abrir el mega menú; al abrir, el candidato de 240 w (15 rem) |
| Visor de zoom | Al girar el móvil con zoom, la región viva seguía diciendo "225 %" con la foto a 167 % | Anuncia "Image 3 of 4, zoom 167%" |
| Comerciante | | Bloque "Mega menu promotion" en la sección Header: "Menu item", y para "Card 1" y "Card 2" imagen, título, subtítulo y enlace |

---

## 2. Archivos tocados (árbol final, líneas exactas)

| Archivo | Cambio | Líneas |
|---|---|---|
| `sections/header.liquid` | +67 -36 | 138-139 (render del snippet), 248-312 (bloques del schema, `mega_menu_promo`) |
| `snippets/mega-menu.liquid` | nuevo, 179 | 27-55 decisión y asociación del bloque; 57-67 disparador; 68-161 mega menú; 97-148 tarjetas; 162-177 panel clásico |
| `assets/product-zoom.js` | +18 -13 | 87-92 P2-01; 59-62 `lock()`; resto, compactación (§4) |
| `assets/base.css` | +186 (al final) | bloque "5C-001. Mega Menú Editorial Multicolumna" (8404-8589 en mi copia; en la carpeta de Johandry va después del bloque 5C-002 del Track 2) |
| `locales/en.default.json` / `es.json` | +3 cada uno | `sections.header.mega_menu.featured`: "Featured" / "Destacados" |
| `locales/en.default.schema.json` | +43 | `sections.header.blocks.mega_menu_promo.*` |

Diff completo: `harness-5C-001/5C-001-theme.diff` (660 líneas, contra 7fa1fe4).

### 2.1 header.liquid
```diff
             {%- if link.links != blank -%}
-              <theme-disclosure class="desktop-nav__disclosure" data-disclosure-arrows>
-                … 34 líneas: disparador, panel, hijos y nietos …
-              </theme-disclosure>
+              {%- comment -%} 5C-001: panel clasico o mega menu, en el snippet. {%- endcomment -%}
+              {%- render 'mega-menu', link: link, section: section, index: forloop.index, color_scheme_id: color_scheme_id -%}
             {%- else -%}
```
Schema: bloque `mega_menu_promo` (`limit: 6`) con `menu_item` (text, label e info), `header` "Card 1", `image_1` (image_picker con info de proporción), `heading_1`, `subheading_1`, `link_1` (url), y lo mismo para la tarjeta 2. Todas las etiquetas con `t:sections.header.blocks.mega_menu_promo.settings.*`.

### 2.2 snippets/mega-menu.liquid
```liquid
assign promo = nil
assign link_title = link.title | downcase | strip
assign link_handle = link.title | handleize
for block in section.blocks
  if block.type == 'mega_menu_promo' and promo == nil
    assign wanted = block.settings.menu_item | downcase | strip
    assign wanted_handle = block.settings.menu_item | handleize
    if wanted != blank
      if wanted == link_title or wanted_handle == link_handle or wanted_handle == link.handle
        assign promo = block
      endif
    endif
  endif
endfor
# … has_third_level si algún hijo tiene hijos; is_mega = promo o tercer nivel
```
Marcado del mega menú, dentro del mismo `<theme-disclosure data-disclosure-arrows>`:
```html
<div id="DesktopMenu-{id}-{n}" class="desktop-nav__panel desktop-nav__mega-menu color-{scheme}" data-disclosure-panel hidden>
  <div class="container mega-menu__grid">
    <div class="mega-menu__columns">
      <a class="mega-menu__view-all" href="…">View all Catalog</a>
      <ul class="mega-menu__column-list" role="list">
        <li class="mega-menu__column">
          <a class="mega-menu__column-title" href="…">Women</a>
          <ul class="mega-menu__sublist" role="list"><li><a href="…">Coats</a></li>…</ul>
        </li>…
      </ul>
    </div>
    <ul class="mega-menu__promos" role="list" aria-label="Featured" {{ promo.shopify_attributes }}>
      <li class="mega-menu__promo"><a class="mega-menu__promo-card" href="…">
        <span class="mega-menu__promo-media"><img … loading="lazy" sizes="(min-width: 62rem) 15rem, 100vw" alt=""></span>
        <span class="mega-menu__promo-heading">…</span><span class="mega-menu__promo-subheading">…</span>
      </a></li>
    </ul>
  </div>
</div>
```
Reglas de las tarjetas (líneas 97-148):
- una tarjeta se pinta si tiene imagen o título;
- con enlace es un `<a>`; sin enlace, un `<div>` (nada que parezca un control y no lo sea);
- con título, la foto lleva `alt=""` porque el nombre del enlace ya es el título; sin título, `alt` de la foto o, si falta, el nombre del enlace de primer nivel, para que el enlace nunca quede sin nombre;
- si el bloque no tiene ninguna tarjeta, no hay lista vacía.

### 2.3 Fusión en archivos compartidos con el Track 2
En la carpeta de Johandry, GPT-6 ya había tocado `base.css`, los tres locales y `theme.js` (sin commit). No sobrescribí esos archivos: `harness-5C-001/merge-shared-5c001.py` añade mi bloque CSS al final de `base.css` y mis claves bajo `sections.header` en los locales, y comprueba antes que el JSON esté en formato canónico para no reformatear nada. Es idempotente. Resultado medido en la carpeta: +186 -0, +3 -0, +3 -0 y +43 -0, con las md5 de partida de los cuatro archivos iguales a las que había copiado para probar el parche. `header.liquid`, `mega-menu.liquid` y `product-zoom.js` solo los toca este track y se entregaron completos, tras comprobar que seguían en su md5 de 7fa1fe4.

### 2.4 base.css (al final)
- **Fuera de media query (sin JS):** el panel ya se pinta dentro de la cabecera por las reglas `.no-js` existentes; se ocultan las tarjetas y las columnas quedan apiladas con enlaces de 44 px.
- **Desde 62rem:**
  - `.desktop-nav__disclosure--mega { position: static }`: el panel se ancla a `.site-header` (`position: relative`), con `inset-inline: 0` e `inset-block-start: 100%`.
  - `max-height: calc(100dvh - var(--header-offset) - var(--space-6))` con `overflow-y: auto` y `overscroll-behavior: contain`, para que un menú más alto que la ventana se recorra dentro del panel.
  - `.mega-menu__grid`: una columna explícita `minmax(0, 1fr)` y las tarjetas en una columna implícita. Sin tarjetas no queda hueco a la derecha (fallaba con `1fr auto`: 48 px de hueco vacío).
  - Columnas `repeat(auto-fill, minmax(10.5rem, 1fr))`. Títulos en `--font-heading-family` con filete `--color-border-hairline`, y enlaces de 44 px.
  - Tarjetas de `15rem`, `aspect-ratio: 4 / 5`, `object-fit: cover` sobre `--color-surface`.
  - Ampliación al pasar el cursor solo con `data-animations='full'` y con el mismo gesto que la tarjeta de producto (`scale(1.025)`, `--motion-slow`).
  - La entrada del panel reutiliza la animación existente de `.desktop-nav__panel`.

---

## 3. Contrato del mega menú

| Requisito de la directiva | Cómo se cumple | Prueba |
|---|---|---|
| Lógica en `snippets/mega-menu.liquid` | Todo el desplegable vive en el snippet; `header.liquid` pasa de complejidad 24 a 21 (máximo 120). El snippet mide 28 | Theme Check con `maxComplexity: 1` (§7.2) |
| Mega si hay bloque o tres niveles; si no, panel clásico | `is_mega = promo != nil or has_third_level` | M1, M9, M10 |
| Columnas de 2º nivel con 3er nivel debajo | `.mega-menu__column-title` y `.mega-menu__sublist` | M1 |
| Hasta 2 tarjetas, imagen lazy, título, subtítulo, enlace | Bucle `(1..2)`; `loading="lazy"` en un panel `hidden` | M1, M2 |
| Proporción de lujo 4:5 | `aspect-ratio: 4 / 5` en el contenedor | M4 (0,8 ± 0,01 a 992, 1280 y 1440) |
| Objetivos ≥ 44 px | Todos los enlaces del panel | M4, M8 |
| Móvil sin cambios | `header.liquid` no toca el cajón | Marcado idéntico en las 3 páginas del arnés; M6 |
| Tab limpio, Escape, aria-expanded, cero JS | `<theme-disclosure>` tal cual | M3 |
| Paridad de locales | `sections.header.*` en en y es, schema en en | 395 claves en mi copia, 404 con el Track 2 |

---

## 4. P2-01 en product-zoom.js

```diff
     this.fit = this.fits[this.index];
-    this.scale = Math.min(this.scale, Math.max(1, this.fit.max));
+    const previous = this.scale;
+    this.scale = Math.min(previous, Math.max(1, this.fit.max));
     this.track.scrollLeft = this.offsetOf(this.index);
     this.apply();
+    // P2-01: anuncia el zoom reajustado.
+    if (this.dialog.open && Math.round(this.scale * 100) !== Math.round(previous * 100)) this.announce();
   }
```
Para seguir por debajo de 12.000 bytes (11.945 → 11.988) compacté sin cambiar comportamiento:
- `lock(open)` reúne `data-open` y `syncDialogScrollLocks()`, que estaban repetidos en `open` y `handleClose`;
- `+x` en lugar de `Number(x)` en tres conversiones de atributos (en las dos sumas de pasos sigue `Number`, por legibilidad);
- `img.srcset` en lugar de `hasAttribute('srcset')`;
- `dataset.pending = 1`;
- el comentario de F01 queda en una línea.

Las 26 pruebas del visor siguen pasando.

---

## 5. Desviaciones de Nivel 1

| # | Directiva | Implementado | Por qué |
|---|---|---|---|
| D1 | Extraer "el marcado y lógica del mega menú" | El snippet pinta el desplegable entero, también el clásico | Así `header.liquid` solo tiene un `render` y su complejidad baja. El panel clásico sale idéntico, comprobado con el HTML normalizado del arnés |
| D2 | `menu_item` insensible a mayúsculas | También sin espacios sobrantes y por handle del enlace (`link.handle` o el título en handle) | En /es `link.title` es "Catálogo": un bloque "Catalog" no se aplicaría en español. Con el handle, el mismo bloque vale en los dos idiomas (M9) |
| D3 | Settings del bloque | Añadí dos `header` ("Card 1", "Card 2"), `info` en las imágenes y `limit: 6` | Orden en el editor y la proporción recomendada donde se elige la foto |
| D4 | Claves `sections.header.*` | Una de storefront, `sections.header.mega_menu.featured` ("Featured" / "Destacados"), para el `aria-label` de la lista de tarjetas | El lector anuncia "Featured, lista, 2 elementos" antes de las tarjetas |
| D5 | Tarjeta con imagen, título, subtítulo y enlace | Sin título el `alt` nombra el enlace; sin enlace la tarjeta es un `<div>` | Evita enlaces sin nombre y controles falsos (axe 0 en M7) |
| D6 | No especifica "ver todo" | "View all {{ title }}" arriba de las columnas, con la clave existente `general.navigation.view_all` | Mismo destino que ya ofrecía el panel clásico |
| D7 | P2-01: anunciar si la escala cambió | Anuncia si cambia el porcentaje redondeado | Un resize que mueve la escala 0,2 % repetía "zoom 167 %" en cada evento. La prueba lo comprueba |
| D8 | Presupuesto < 12 KB | Compactación de §4 | P2-01 llevaba el archivo a 12.139 bytes |

---

## 6. Hallazgos y riesgos (no aplicados)

**E1, dos paneles abiertos por teclado.** `<theme-disclosure>` no cierra al perder el foco. Si se abre Catálogo con Enter, se sale con Tab y se abre Diario, quedan los dos abiertos y el desplegable de Diario tapa parte del mega menú. Ya pasaba antes con dos desplegables (medido en el árbol previo: "abiertos: Catalog, Journal"); con el panel a todo el ancho se nota más. Los estados `aria-expanded` son ciertos. Arreglarlo exige JS en `theme.js`, del Track 2 en este sprint. Parche propuesto para `ThemeDisclosure.setOpen`:
```js
if (open) this.parentElement?.closest('.desktop-nav')?.querySelectorAll('theme-disclosure[data-open]')
  .forEach((other) => other !== this && other.setOpen(false));
```

**E2, editor de temas.** Al seleccionar un bloque "Mega menu promotion", el panel no se abre solo: el comerciante tiene que pulsar el enlace en la vista previa para ver lo que edita. Parche propuesto en `ThemeDisclosure.connectedCallback` (los eventos del editor burbujean desde `{{ promo.shopify_attributes }}`):
```js
this.listen(this, 'shopify:block:select', () => this.setOpen(true));
this.listen(this, 'shopify:block:deselect', () => this.setOpen(false));
```

**E3, sin JS.** Con JavaScript desactivado, los navegadores desactivan `loading="lazy"` y piden las fotos aunque la lista esté en `display: none`. Medido: 3 peticiones de 240 w (con JS, 0). Afecta a una fracción mínima de visitas. Se podría evitar con `<picture><source media="(scripting: none)" srcset="data:,">`; no lo hice por no complicar el marcado.

**E4, citas del ledger.** La fila 73 cita `assets/product-zoom.js:1-285` y `112,152-166`. La compuerta pasa porque siguen dentro del archivo, pero ahora apuntan a otras líneas. Texto corregido: `1-290` y `118,158-171`. No toqué el ledger porque no es de mi track.

**E5, demo.** El main-menu de la tienda (Home · Catalog con 6 colecciones · Contact) tiene dos niveles: sin bloque, Catálogo sigue con el desplegable clásico. Para enseñar el mega menú hacen falta un bloque para "Catalog" con dos fotos de campaña verticales, o un tercer nivel. No cambié `header-group.json` porque no estaba en mi lista de archivos.

**E6, 992 px.** Con cinco enlaces, la navegación de escritorio ocupa dos filas entre 62 y unos 70 rem, y la cabecera pasa de 77 a 95 px. Pasaba igual antes; el mega menú se coloca bien debajo (M4 a 992).

**Riesgos.**
- `handleize` de Shopify con acentos. Si no translitera "Catálogo", la asociación sigue funcionando por el título en minúsculas (mismo idioma) o por el handle del enlace (otro idioma). Probado en liquidjs, no en Shopify.
- Safari y Firefox no medidos.

---

## 7. Verificación

### 7.1 Compuertas en mi copia (7fa1fe4 + Track 1, sin el Track 2)
```text
$ npm run gates:static                                                        exit 0
  Fallos de parseo: 0 | Contratos rotos: 0 | [theme-check-sanity] OK. Las 3 clases se detectaron…
  Claves en en.default.json: 395 hojas | en.default.schema.json: 490 hojas | Sin resolver: 0 y 0 | Huerfanas en storefront: 0
  Filas de requisito: 54 | Incoherencias: 0
  85 files inspected with no offenses found.
  > node --check assets/theme.js && node --check assets/product-zoom.js      ok
$ wc -c assets/product-zoom.js                                                11988
```
Antes de 5C: 394 claves, 475 del schema y 84 archivos.

### 7.2 Complejidad Liquid (Theme Check con `maxComplexity: 1` sobre una copia)
```text
sections/header.liquid (7fa1fe4)   24
sections/header.liquid (5C-001)    21
snippets/mega-menu.liquid          28      (máximo del proyecto: 120)
```

### 7.3 En la carpeta de Johandry, con el Track 1 y el trabajo en curso del Track 2
```text
md5sum -c (8 archivos propios, LF)                                   8/8 OK
merge-shared-5c001.py                                                base.css +186 -0 | en +3 -0 | es +3 -0 | schema +43 -0
npm run gates:json | hooks | locales | ledger | syntax                exit 0 los cinco
  hooks: <product-inventory>, <recently-viewed> y <product-zoom> sin contratos rotos
  locales: 404 hojas, 513 del schema, 0 sin resolver, 0 huérfanas
./node_modules/.bin/shopify theme check --no-color                   122 files inspected with no offenses found.   exit 0
locale-parity.mjs                                                    es.json: 404 claves, 0 problemas
liquid-literals.py                                                   52 archivos Liquid, 0 hallazgos
wc -c assets/product-zoom.js                                         11988
```
No corrí `gates:sanity` ni `gates:package` allí, por los motivos de siempre: el sandbox que el puente no borra y el zip que se sobrescribe.

### 7.4 Arnés 5C (`harness-5C-001/`, Liquid real con liquidjs, theme.js y base.css reales, Chromium 141)
```text
SITE=site          13 passed          SITE=site-es       13 passed
SITE=site-before   (árbol 7fa1fe4)    9 failed, 4 passed
Con el base.css y el theme.js del Track 2 copiados de la carpeta de Johandry:   13 passed
```
| Prueba | Qué comprueba | Árbol previo |
|---|---|---|
| M1 | Columnas y tercer nivel; tarjetas con `alt=""` y `lazy`; bloque duplicado e inexistente sin efecto; Journal clásico; Atelier (dos niveles con bloque) mega, con tarjeta de solo foto (alt "Atelier interior") y tarjeta sin enlace (`DIV`) | falla |
| M2 | 0 fotos antes de abrir tras recorrer la página; al abrir, solo las del panel abierto y ≤ 320 w | falla |
| M3 | Enter abre; 14 Tab en orden; el 15º sale a "Journal"; Shift+Tab vuelve; Escape cierra con foco en el disparador; Flecha abajo entra | falla |
| M4 × 3 | A 992, 1280 y 1440: panel de borde a borde bajo la cabecera y dentro de la ventana; tarjetas a la derecha en 4:5; 0 enlaces bajo 44 px; sin scroll horizontal | falla |
| M5 | El disparador alterna; clic fuera cierra; el contenido no se mueve y CLS 0 | pasa |
| M6 | 390: cajón con los mismos 5 enlaces y acordeón; 0 fotos de tarjeta | pasa |
| M7 × 2 | axe WCAG 2.2 AA con Catálogo y con Atelier abiertos: 0 violaciones | pasa |
| M8 | Sin JS: columnas visibles, tarjetas ocultas, enlaces de 44 px | falla |
| M9 | Menú en español con el bloque "Catalog": "Catálogo" recibe el mega menú por el handle | falla |
| M10 | Tres niveles sin bloque: mega solo con columnas y sin hueco; cabecera por defecto con el panel clásico y sus 7 enlaces | falla |

Además, el HTML normalizado de `<header>` en `classic.html` es idéntico al del árbol previo (8.813 caracteres), y el del cajón móvil también en `mega.html`, `mega-es-titles.html` y `mega-noblocks.html`.

### 7.5 Arnés 5B (visor de zoom)
```text
SITE=site     26 passed      SITE=site-es     26 passed
P2-01 con el product-zoom.js de 5B-002: falla con  Expected "Image 3 of 4, zoom 167%"  Received "Image 3 of 4, zoom 225%"
```
La prueba P2-01 (`zoom5b.spec.mjs`):
1. a 390 × 844 abre la foto de 928 px y la lleva a 225 % con Enter en Acercar;
2. pasa a 1280 × 800;
3. comprueba escala = máximo, matriz = máximo, anuncio del porcentaje nuevo, Acercar inactivo y foco en Alejar;
4. comprueba que un resize que no cambia el porcentaje no repite el anuncio.

### 7.6 Regresión
```text
Arnés 5A-003 (28)          en 28/28   es 28/28
Arnés 5A (36)              en 36/36   es 36/36
Heredado 4B a 4F (106)     101/106; los mismos 5 typescale T1 de siempre
```

### 7.7 Comandos (desde `agent-comms/outbox-claude/harness-5C-001/`)
```text
OUT_DIR=site node render5c.mjs
OUT_DIR=site-es LOCALE_FILE=locales/es.json LOCALE_ISO=es node render5c.mjs
SITE=site npx playwright test -c pw.config.mjs          (puerto 8113; CHROMIUM_PATH opcional)
python3 agent-comms/outbox-claude/harness-5C-001/merge-shared-5c001.py .      (desde la raíz; idempotente)
```

---

## 8. Filas del ledger propuestas (Gemini decide)
| Requisito | Estado propuesto | Evidencia |
|---|---|---|
| **Mega Menú Editorial en Cabecera** (nueva) | `código completo` | `snippets/mega-menu.liquid:1-179`, `sections/header.liquid:138-139,248-312`, bloque 5C-001 al final de `assets/base.css`. Arnés 5C 13/13 en y es. Cierra con la Compuerta 5: bloque configurado en la tienda y prueba de teclado y axe en vivo |
| **Zoom de Imagen Nativo y Accesible en PDP** (fila 73) | sigue `código completo` | Localizadores `assets/product-zoom.js:1-290` y hotfix `118,158-171`; P2-01 en `87-92`. Arnés 5B 26/26 en y es |

---

## 9. Afirmaciones falsables
1. `wc -c assets/product-zoom.js` da 11988 y `node --check` pasa.
2. `sections/header.liquid` no contiene ya `<theme-disclosure class="desktop-nav__disclosure"`. Lo pinta `snippets/mega-menu.liquid:57`.
3. Con el main-menu de dos niveles y sin bloques, el `<header>` renderizado es idéntico al de 7fa1fe4, salvo espacios en blanco.
4. Un enlace de primer nivel con algún nieto lleva `desktop-nav__disclosure--mega` aunque no haya bloque.
5. Un bloque con `menu_item` "Catalog" se aplica al enlace cuyo título es "Catálogo" si su handle es `catalog`.
6. Con el mega menú cerrado no se pide ninguna foto de tarjeta; al abrirlo a 1280 px se piden las dos del panel, a 240 w.
7. Tab desde el disparador de Catálogo recorre 14 enlaces del panel y el 15º enfoca el disparador de Journal; Escape devuelve el foco al disparador de Catálogo con `aria-expanded="false"`.
8. A 992, 1280 y 1440 px, el panel mide el ancho de la ventana, empieza en el borde inferior de la cabecera y sus tarjetas miden 4:5.
9. axe (wcag2a a wcag22aa) da 0 violaciones con Catálogo o Atelier abiertos.
10. En el visor de zoom, pasar de 390 a 1280 px con la foto de 928 px a 225 % deja la región viva en "Image 3 of 4, zoom 167%".
11. En la carpeta de Johandry, `shopify theme check` inspecciona 122 archivos sin ofensas y `es.json` tiene 404 claves con paridad.
12. `merge-shared-5c001.py` ejecutado dos veces deja los archivos igual que una.
13. No hay commit: `git log -1` sigue en 7fa1fe4.
