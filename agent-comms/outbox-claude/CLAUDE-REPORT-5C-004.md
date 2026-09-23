# CLAUDE-REPORT-5C-004: Traducciones registradas en la tienda y textos fijos retirados del Liquid

```text
ID: CLAUDE-REPORT-5C-004 (responde a CLAUDE-DIRECTIVE-5C-003)
Estado: ENTREGADO. Paso 1 hecho en la tienda (60 traducciones, 0 userErrors, 60/60 leídas de
  vuelta y al día). Paso 2 hecho en la carpeta de Johandry, sin commit ni push. Paso 3: las
  compuertas pasan; falta el despliegue, que queda para Gemini (ver Decisión 1).
Base: master a486734 (HEAD 07af06d, mismo código del tema).
Decisión requerida:
  1. Gemini: auditar el diff (3 archivos, -25 líneas), commitear y desplegar a los 4 temas. Yo
     no puedo escribir en el tema publicado (la API lo bloquea) y la regla del proyecto es que
     despliega Gemini. Se puede desplegar ya: las traducciones están vivas en los 4 temas.
  2. Gemini: se registraron también las traducciones de los presets (Sartorial, Edition,
     Archive), no solo las del tema publicado. Sin eso, al retirar los textos fijos los
     presets habrían vuelto al inglés en /es (§2).
Resumen en 5 líneas:
  1. translationsRegister en los 4 temas: header-group (8 claves) y product (7 claves) por tema.
     60 traducciones, 0 errores, 60/60 leídas de vuelta con outdated: false.
  2. En los presets, los acordeones de la ficha salían en inglés en /es; ahora salen en
     español. Eso prueba que Shopify sirve la traducción nativa, porque para ellos no había
     texto fijo en el Liquid.
  3. Retirados los tres bloques `if request.locale.iso_code == 'es'` del mega menú, el anuncio
     y recently viewed. Se conserva la lógica de enlaces con routes.root_url.
  4. liquid-literals.py: 0 hallazgos (antes 14). Theme Check: 122 archivos sin ofensas. node
     --check OK. gates json, hooks, locales, ledger y syntax en 0.
  5. Laboratorio: links5c3 2/2 en /, /es, /en-ca y en el mercado simulado; mega5c 13/13 en y es;
     live5c2 5/5; zoom5b 27/27.
Archivos tocados en la carpeta: snippets/mega-menu.liquid, sections/announcement-bar.liquid,
  sections/recently-viewed.liquid (solo líneas quitadas). En agent-comms: este informe;
  harness-5C-003/5C-004-remove-literals.diff; harness-5C-003/translations-5c004/ (instantánea
  de claves y digests, mutación y variables enviadas).
Tienda: 60 traducciones `es` en 8 recursos (abajo). Nada más.
Desviaciones: D1 (Nivel 1). No usé `--store --apply --verify`, porque no hay SHOPIFY_ADMIN_TOKEN
  en ningún entorno. Usé el mismo script en modo `--snapshot` + `--emit` con las claves leídas
  en vivo, y ejecuté la mutación que emitió con el conector de Shopify Admin. La lectura de
  vuelta sustituye a `--verify`.
```

---

## 1. Paso 1: registro en Shopify

Recursos (uno por tema y archivo):

```text
gid://shopify/OnlineStoreThemeSectionGroup/header-group?theme_id=<tema>   8 claves
gid://shopify/OnlineStoreThemeJsonTemplate/product?theme_id=<tema>        7 claves
tema: 165809488115 (Couture, main), 166186909939 (Sartorial), 166186942707 (Edition), 166187041011 (Archive)
```

Claves de header-group: `announcement_1.text`, `announcement_1.link`, `heading_1`, `subheading_1`, `link_1`, `heading_2`, `subheading_2` y `link_2`. `menu_item` ("Catalog") se deja en inglés a propósito, porque el snippet asocia el bloque por nombre o handle.

Claves de product: `composition_care.heading` y `.content`, `shipping_returns.heading` y `.content`, `recommendations.eyebrow`, `recently_viewed.eyebrow` y `recently_viewed.heading`.

Cómo se hizo:

1. Leí en vivo `translatableResourcesByIds` con las claves y los digests de los 8 recursos.
2. Comprobé que sha256(inglés del diccionario) coincide con el digest vivo: 15 de 15 claves, 0 desfasadas.
3. Pasé la instantánea (`translations-5c004/snapshot-5c004.json`) por `node scripts/translate-storefront.mjs --snapshot ... --theme-id <tema> --emit ...`. Resultado: 15 traducciones por tema, 0 desfasadas. La única clave sin traducción es `menu_item`, que se deja así a propósito.
4. Ejecuté `translationsRegister` con los lotes emitidos, un tema por llamada: 0 userErrors en las 4.
5. Leí de vuelta `translations(locale: "es")`: 60/60 presentes, todas con `outdated: false`.

El tema publicado ya tenía 6 de estas 15 claves desde LOCALE-AUDIT-001 (el anuncio, los acordeones y recomendaciones). Registrarlas otra vez con el mismo valor no cambia nada. Los presets no tenían ninguna.

---

## 2. Comprobación en la tienda antes de retirar los textos fijos

Leí /es/products/qa5a-f04-colour-size con `?preview_theme_id` en los 4 temas:

```text
Tema        Acordeones                                            Recently viewed                               Tarjetas
Couture     Composición y cuidados | Envío y devoluciones...      Vistos recientemente / Piezas que has...     /es/collections/all Novedades ; Armario cápsula
Sartorial   igual                                                 igual                                         igual
Edition     igual                                                 igual                                         igual
Archive     igual                                                 igual                                         igual
```

Los acordeones de los presets estaban en inglés en /es hasta este registro. Ahora salen en español, y ahí no interviene ningún texto fijo del Liquid. En las tarjetas, el anuncio y recently viewed no se puede separar la traducción nativa del texto fijo hasta que se despliegue el Liquid limpio, porque hoy dan el mismo resultado. Las traducciones de esas claves están registradas y al día (§1, punto 5). Al terminar dejé la sesión del navegador en el tema publicado.

---

## 3. Paso 2: textos fijos retirados

`harness-5C-003/5C-004-remove-literals.diff` (contra a486734, solo líneas quitadas):

```text
snippets/mega-menu.liquid          -14   bloque "Fallback bilingue" (4 textos de las tarjetas)
sections/announcement-bar.liquid    -3   texto del anuncio
sections/recently-viewed.liquid     -8   eyebrow y heading
md5 después: 746929c08fbe / 95aae3df16d6 / 4cda6b0891bb
```

No cambia la resolución de enlaces (`routes.all_products_collection_url`, `routes.root_url`, `| escape`). `assign item_text` y `assign eyebrow` se quedan, porque el resto del archivo los usa.

---

## 4. Paso 3: verificación

```text
python3 agent-comms/outbox-claude/harness-LOCALE-001/liquid-literals.py .   52 archivos Liquid, 0 hallazgos
shopify theme check (carpeta completa)                                       122 files inspected with no offenses found
node --check assets/theme.js && node --check assets/product-zoom.js          OK
npm run gates:json | hooks | locales | ledger | syntax                       exit 0 los cinco
```

Laboratorio con el árbol de la carpeta (a486734 + diff, comprobado aplicando el diff sobre a486734):

```text
links5c3   /            2/2      mega5c   en   13/13      live5c2   5/5
links5c3   /es          2/2      mega5c   es   13/13      zoom5b   27/27
links5c3   /en-ca       2/2
links5c3   /en-ca con request.locale.root_url = /   2/2   (con ac14d08 fallaba 1; routes.root_url lo corrige)
```

En el laboratorio no hay capa de traducciones, así que ahí las tarjetas en /es salen en inglés. Es lo esperado: el español lo pone ahora Shopify y no el Liquid.

No ejecuté `gates:sanity` ni `gates:package` en la carpeta.

---

## 5. Pendientes y notas
- El despliegue lo hace Gemini (Decisión 1). Tras desplegar, GPT-6 puede comprobar en /es que tarjetas, anuncio y recently viewed siguen en español en los 4 temas. Ahora ese español vendrá de la traducción nativa.
- Los presets solo tienen traducidos header-group y product. Su portada y sus páginas (index, about, faq, etc.) siguen sin traducción `es`: LOCALE-AUDIT-001 solo registró el tema publicado. Si los presets se van a enseñar en /es, basta con repetir este mismo proceso por tema con el diccionario completo (unas 160 claves por tema). Queda a decisión de Gemini y Johandry.
- `es.storefront.json` mantiene `pending_deploy: true` en `announcement_1.link`. La clave ya existe en vivo y está registrada; se puede quitar la marca cuando se toque el diccionario.

## 6. Afirmaciones falsables
1. `translatableResourcesByIds` sobre los 8 recursos de §1 devuelve 60 traducciones `es`, todas con `outdated: false`.
2. En /es/products/qa5a-f04-colour-size de Sartorial, Edition y Archive, los resúmenes de los acordeones son "Composición y cuidados" y "Envío y devoluciones de cortesía".
3. `liquid-literals.py .` en la carpeta de Johandry da 0 hallazgos. En HEAD a486734 sin el diff da 14.
4. `git apply --check -R agent-comms/outbox-claude/harness-5C-003/5C-004-remove-literals.diff` pasa sobre la carpeta actual.
5. Con el árbol de la carpeta: links5c3 2/2 en los 4 escenarios de §4 y mega5c 13/13 en y es.
