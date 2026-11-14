ID: CLAUDE-REVIEW-A-02-RD-001
Estado: R-D emitida. Veredicto: APROBADA CON CAMBIOS (equivale a «apta con condiciones» de §0.1 de la directiva). Nivel 2 de A-02: AUTORIZADO, con las condiciones de §2.
Decisión requerida: Ninguna de Johandry (no hay caso D10). El coordinador incorpora los cambios obligatorios M-1 a M-9 (§7) en `CLAUDE-DIRECTIVA-A-02-001.md` antes de entregarla al implementador; no hace falta otra R-D si los incorpora literalmente.
Resumen en 5 líneas:
1. Las 14 fuentes y H1–H8 existen exactamente donde dice la directiva en `eb7cca7`; el barrido no encuentra ninguna otra fuente automática en los dos snippets ni en sus cuatro llamadas.
2. El Liquid propuesto, aplicado a una copia limpia de `eb7cca7`, pasa Theme Check (92 archivos, 0 ofensas), locale-key-inventory (0/0 sin resolver, 0/0 huérfanas), json-validate, theme-check-sanity y V1–V15.
3. Autorizo el Nivel 2 (D11): retiro reversible, decidido por Johandry el 2026-10-30, sin IDs, defaults ni opciones cambiados, y el dato manual sigue en los settings del bloque.
4. PD-1 sí, PD-2 sí, PD-3 no, PD-4 sin cambio de estado, PD-5 sin fila nueva. C-1 a C-4: de acuerdo con la directiva. No existe otro locale de schema que cambiar.
5. Cambios obligatorios: preflight semántico de `sections/` (A-01/B-02 y C-08 editan esos archivos), preflight y V7 que toleren otros `??` en `agent-comms/`, comentario de F2 más exacto, V5b más amplia, un solo commit, hallazgos completos para C-08 y dos pruebas R-A más.
Archivos tocados: solo este archivo nuevo, `agent-comms/outbox-claude/CLAUDE-REVIEW-A-02-RD-001.md`. Las pruebas se hicieron en una copia en el scratchpad (`git archive HEAD`). Sin git de escritura, sin red, sin tiendas, sin `.secrets`, sin variables de entorno, sin dependencias instaladas.
Desviaciones (Nivel 1 o Nivel 2): Ninguna en esta revisión. Esta revisión es la autorización de Nivel 2 de A-02 que pide D11.
Hallazgos extra fuera de alcance (con parche listo): Sin parche. En §6.3: claims de Archive que faltan en §8.3 de la directiva (para C-08) y el tagline de Archive en `docs/decisions.md:150,169` (para C-04/G3).
Verificación (comando, resultado y qué demuestra/qué no): §1, §3 y §4. Demuestra el estado de `eb7cca7` y que el cambio propuesto, aplicado de forma literal a una copia, cumple las compuertas estáticas. No demuestra el render en tienda ni el estado de los metafields en `tema-qkqpke0j`, y tampoco la implementación futura.
Lista de afirmaciones falsables numeradas:
1. En `eb7cca7` los `git hash-object` de los dos snippets, `sections/main-product.liquid`, `sections/featured-product.liquid`, `listings/archive/templates/index.json` y `locales/en.default.schema.json` coinciden con los de §1.2 de la directiva.
2. Fuera de los dos snippets, la única lectura de `metafields.custom.*` o `metafields.sartorial.*` del tema es `snippets/cart-drawer-recommendations.liquid:80`.
3. Con F1, F2 (M-4), F3 y F4 aplicados a la copia, los `git hash-object` finales son: F1 `68354c31e7357f40bdf1385fa1916013cc1fa756`, F2 `2a624b236b5c31242fd3b6c042894196afb6baa7`, F3 `68f4b21a2812b6ec4302e8420f164c8d85994a9a` y F4 `34122e73def9ea02e0d43613da59341c71989b15`. Los de F3 y F4 solo valen si esos archivos no cambiaron después de `eb7cca7`.
4. En la copia modificada: Theme Check «92 files inspected with no offenses found» y exit 0; V1, V2, V4, V5 y V5b sin salida; V3 una línea; V6 `0`; V8 `UNTOUCHED_OK`; V13 sin salida; V14 `F3_OK`; V15 `F4_OK`.
5. `locales/` contiene solo `en.default.json`, `en.default.schema.json` y `es.json`: no existe otro locale de schema que deba cambiar en paralelo.
6. El script de preflight semántico de M-2 imprime `SECTIONS_OK` sobre el árbol actual (`eb7cca7`).

---

# 1. Identidad y base

```text
git status --short            -> ?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-02-001.md
                                 ?? agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-03-001.md
git log --oneline -1          -> eb7cca7 Lote 0: BOARD reconciliado (B3), decisiones D19-D24 y estado vivo
rama                          -> lote0/base-09f8342

git hash-object (en copia de HEAD) snippets/product-technical-specs.liquid snippets/product-provenance.liquid
  sections/main-product.liquid sections/featured-product.liquid listings/archive/templates/index.json locales/en.default.schema.json
-> 201343dd3e088698f74c850ef6cc9240ff3aa7ee
-> ca9796ea1a64c256b11e2c314b561d0657e41677
-> 34003beda635575dd0352aab87d2f6fbd30096c8
-> 58c8c04a9f78a4d9787542153ec1610b5b6f6b72
-> ce4ee46bbdcd72ce925feda88cf39339820e93c7
-> 2a628d9be95a4a74ea266d9d4cf46924ae942981
```

Coinciden con §1.2 de la directiva. Copia de trabajo: `git archive HEAD` (temas, `listings`, `scripts`, `package*.json`, `.theme-check.yml`, `.shopifyignore`), con `node_modules` enlazado y un commit local que hace de base para `git diff`.

# 2. Autorización técnica de Nivel 2 (D11)

**AUTORIZADO el cambio de Nivel 2 de A-02**, es decir, el cambio de contrato con el comerciante al retirar las 14 fuentes automáticas y las heurísticas H1–H8, en los términos de `CLAUDE-DIRECTIVA-A-02-001.md` con los cambios M-1 a M-9 de esta revisión.

Justificación:

1. Autoridad. D11 (`CLAUDE-DECISION-AUTONOMIA-001.md`, «Para A-02, la autorización técnica de Nivel 2 la da ese revisor») es posterior y expresa del dueño, y prevalece sobre la atribución a Gemini/Antigravity del plan V4.1 (líneas 58, 87, 192, 375 y 433) y de `GPT-DECISION-LOTE-0-04-C08-001.md`. La decisión de negocio de retirar ya existe (Johandry, chat 2026-10-30, plan V4.1:58 y :87). Esta autorización es solo técnica.
2. El contrato no queda sin salida. Los cuatro settings técnicos y los cinco de procedencia siguen existiendo con los mismos IDs, tipos, defaults y opciones (`sections/main-product.liquid:1117–1151`, `sections/featured-product.liquid:769–803`, que no se tocan, V8). El comerciante puede seguir publicando cualquier dato real desde el bloque. Lo único que se pierde es la lectura implícita de claves `custom.*`/`sartorial.*` y las inferencias por título, handle o tipo, que el plan considera la raíz de claims no respaldados (V-05, RC-03).
3. Superficie afectada. Según D18 el tema no se ha enviado a la Theme Store, así que el cambio solo alcanza a las tiendas propias (demo y desarrollo). Ahí lo cubren el aviso de C-04-R (§8.1 de la directiva) y las pruebas R-A.
4. Reversible y acotado. Son tres o cuatro archivos y un solo commit revertible. No cambian schema, CSS ni JS, ni se crean metafields (D17).
5. Más honesto para el comerciante. Desaparecen dos textos inventados («Solid milled brass», «Precision machined») y el tipo de producto mostrado como material (`snippets/product-technical-specs.liquid:53–56,69–70`). Con PD-1, cada `info` del editor explica el nuevo contrato.

Condiciones de la autorización (si falla alguna, la autorización no cubre la entrega):

- (a) Solo los archivos F1–F4 y el informe R, con los cambios exactos de §3 de la directiva y M-4.
- (b) F1, F2 y F3 (y F4) en un único commit. Si F3 entrara sin F2, `custom.provenance_notes` del producto destacado volvería a mostrarse en Archive home (`GPT-DECISION-LOTE-0-04-C08-001.md`, criterio 3: vaciar un campo no basta si queda un fallback).
- (c) El estado máximo sigue siendo «código completo» hasta R-A en tienda (D22). Nada se declara `cumplido`.
- (d) C-04-R debe llevar el aviso de retiro (§8.1 de la directiva) antes del envío; esa dependencia queda abierta en BOARD/STATUS.

# 3. Verificación independiente de fuentes y heurísticas (punto 1)

## 3.1 Las 14 fuentes y H1–H8

Leídos completos `snippets/product-technical-specs.liquid` (120 líneas) y `snippets/product-provenance.liquid` (83 líneas) en `eb7cca7`. Las tablas §2.2 y §2.3 de la directiva coinciden línea por línea:

- Fuentes 1–8: `product-technical-specs.liquid:20–23` (dos claves por línea, `custom` y `sartorial`).
- Fuente 9: `custom.technical_specs` en `:26–27`, consumo `ts.*` en `:28–39` y bloque `if` en `:26–40`. Confirmo la corrección C-3 (el plan dice 26–38).
- Fuentes 10–12: `product-provenance.liquid:27`. Fuente 13: `:42`. Fuente 14: `:49`.
- H1 `:43–44`; H2 `:46–49`; H3 `:53–54`; H4 `:55–56`; H5 `:51–61` y `:67–75`; H6 `:69–70`; H7 `:63–65`; H8 `product-provenance.liquid:30–39`.

## 3.2 Completitud: barrido de clase

```text
grep -rn -E "metafield|metaobject" assets config layout locales sections snippets templates blocks listings (sin locales)
-> sections/cart-drawer.liquid:422-424 (setting use_product_metafield), snippets/cart-drawer-recommendations.liquid:11,20,79,80,
   y las líneas de los dos snippets (19-27 en specs; 26-49 en provenance). Ninguna otra.
grep -rn -E "\b(custom|sartorial)\.[a-z_]+" sections snippets layout templates (sin "metafield")  -> sin salida
grep -rn "product.type" snippets sections -> solo product-provenance.liquid:34 y product-technical-specs.liquid:43,47,55,56
grep -rn -E "contains '(19|20|vintage|archive|brass|desk|metal|object)'" snippets sections layout
-> solo product-provenance.liquid:35 y product-technical-specs.liquid:47,53,69
grep -rn -E "(title|handle|type)[_a-z]* \| downcase" snippets sections
-> los dos snippets y snippets/mega-menu.liquid:29 (link.title, navegación; no es dato de producto)
```

Lecturas de `product.` que quedan en los snippets después del cambio (copia modificada): solo `product.selected_or_first_available_variant` y `product.variants.size` en `product-provenance.liquid:20,22`, que pertenecen al badge de pieza única que se conserva (§2.4 de la directiva). Llamadas: `sections/main-product.liquid:700,703` y `sections/featured-product.liquid:451,456` (con guardas `:450` y `:455`). Solo pasan `block`, `product`, `heading_tag` y `selected_variant`; ninguna llamada calcula un dato de producto antes del render. Las plantillas de `templates/`, `config/*.json` y los grupos de `sections/*.json` no contienen bloques `technical_specs` ni `provenance` (recorrido JSON y grep sin resultados). `tests/` no contiene ninguna aserción sobre estos bloques. Solo los scripts gate5 los consultan, y lo hacen de forma informativa (`scripts/gate5-live-verify.mjs:181–188`).

Conclusión: la lista es completa. No falta ninguna fuente automática.

Nota sobre V5: su regex no detectaría un sustituto como `product.tags`, `product.vendor` o `product['type']`. Por eso M-5 añade V5b.

# 4. Liquid de sustitución (punto 2)

## 4.1 Prueba en copia

Script de aplicación: `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rd-a02-tools/apply.py`. Aplica literalmente F1.a, F1.b, F2.a, F2.b, F3 y F4, cada sustitución con su conteo afirmado igual a 1. Después apliqué M-4 sobre F2.a.

```text
python3 -I apply.py <copia>                         -> APPLIED
git diff --stat                                     -> 4 files changed, 23 insertions(+), 101 deletions(-)  (antes de M-4)
npx shopify theme check --path <copia>              -> "92 files inspected with no offenses found." TC_EXIT=0 (antes y después de M-4)
node scripts/locale-key-inventory.mjs               -> Sin resolver 0/0; Huérfanas 0/0; "OK: todas las referencias estaticas resuelven contra los locales." LKI_EXIT=0
node scripts/json-validate.mjs                      -> JSON_EXIT=0
node scripts/theme-check-sanity.mjs                 -> "OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas." SANITY_EXIT=0
V1  grep metafields (2 snippets)                    -> sin salida, exit=1
V2  grep 14 claves (todo el tema)                   -> sin salida, exit=1
V3  grep metafields.(custom|sartorial).             -> 1 línea: snippets/cart-drawer-recommendations.liquid:80
V4  grep metafields|metaobject (2 snippets + 2 sections) -> sin salida, exit=1
V5  grep heurísticas                                -> sin salida, exit=1
V5b (M-5)                                           -> sin salida (en eb7cca7 la misma orden da 15 líneas)
V6  default: añadidos en snippets                   -> 0   (en todo el diff: 0)
V8                                                  -> UNTOUCHED_OK
V13 git diff --check                                -> sin salida, exit=0
V14                                                 -> F3_OK
V15                                                 -> F4_OK
git hash-object finales (con M-4 y PD-1)            -> F1 68354c31e7357f40bdf1385fa1916013cc1fa756
                                                       F2 2a624b236b5c31242fd3b6c042894196afb6baa7
                                                       F3 68f4b21a2812b6ec4302e8420f164c8d85994a9a
                                                       F4 34122e73def9ea02e0d43613da59341c71989b15
sha256 (LF)                                         -> F1 5d8b7e14878cf5a24482c7b3ab61b173c04265a56bfce69662afa531c8b3c47a
                                                       F2 a217c745ad69ba8398c75433493c58786ff9f10c812219d1347b6b6ba9bd1959
                                                       F3 9cc59fa907c0e4684a98e9699d27320aeece46cd71bc493c8b59733a34ea615d
                                                       F4 751953f9b156aea2411ccacf75eb45ffeb0ff1b058f591f90f34b8f2a974abe9
```

Theme Check no ejecuta Liquid. Este resultado prueba sintaxis, schema y traducciones; no prueba el comportamiento.

## 4.2 Lectura del Liquid resultante

- Sintaxis: F1 queda en las líneas 14–19, un `liquid` con cuatro `assign` de `block.settings.*`. F2 queda en las líneas 27–39 de `product-provenance.liquid` (numeración con M-4). La guarda `contains '{{'` dentro del tag `liquid` ya existía en producción (`:32` actual), así que no introduce un riesgo de parser nuevo.
- Estado vacío: especificaciones solo emiten marcado si `material_val != blank or gsm_val != blank or hardware_val != blank or origin_val != blank` (render actual `:88`, nuevo `:21`). Con los cuatro vacíos no hay salida, ni encabezado ni contenedor, ni siquiera en el editor (PD-3). Procedencia: con `circa_year` vacío, `condition_grade` en `not_assessed`, `provenance_notes` vacío y `show_unique_piece` en false, no emite nada en la tienda y en el editor muestra el aviso existente `editor_empty` (nuevas `:42` y `:69–73`, numeración con M-4). `nil | strip` da `""`, que es blank, igual que hoy.
- Sin texto inventado: el diff añadido no contiene literales de contenido ni `default:` (V6 = 0). Los únicos literales son `''` y `'not_assessed'`, que ya existían.
- Escape: los valores de especificaciones salen con `| escape` (render intacto, `:30,36,42,48` nuevas). El año sale con `| t: year: … | escape`. El encabezado se escapa. Las notas son `richtext` y salen sin escape, como hoy y como corresponde al tipo de setting. No hay ninguna salida nueva sin escapar.
- Equivalencia que pide §3.2 de la directiva: confirmada por lectura. Sin metafields y con H8 cumplida, el año antes era `strip(circa_year)` salvo `{{` o vacío; ahora es lo mismo para todo producto. El grado y las notas toman el último `default:` de su cadena actual (`:42` y `:49`).
- Desbordamiento con valores largos: `assets/base.css:9982–9985` (`.product-technical-specs__row dd { overflow-wrap: anywhere; }`) y `body` en `:131` cubren el caso estático. La comprobación visual queda para R-A (M-8).

# 5. Lista de archivos, huérfanos y Archive `:111` (punto 3)

- La lista cerrada F1–F4+R es suficiente. Ningún otro archivo necesita cambiar para que el retiro sea completo (§3.2). La directiva excluye correctamente `sections/*`, los schemas, `locales/en.default.json` y `locales/es.json`: `editor_empty` (`en.default.json:440`, `es.json:440`) sigue siendo exacto, y lo es más tras A-02.
- Huérfanos: ninguno. Los diez settings siguen leyéndose (en la copia, `block.settings.{material,gsm,hardware,origin,circa_year,condition_grade,provenance_notes,show_unique_piece}` aparece una vez cada uno y `heading` cuatro veces). Las claves de storefront siguen referenciadas y locale-key-inventory da 0 huérfanas.
- `listings/archive/templates/index.json:111`: de acuerdo con vaciarlo (`""`). No consta ningún respaldo factual aprobado de la frase, y en el repositorio solo aparece en esa línea (grep fuera de `agent-comms`). El plan V4.1 (§A-02: «dejará `provenance_notes` vacío si no existe respaldo aprobado; no inventará texto neutro») y el criterio C-08 (retirar en vez de ocultar) apuntan a lo mismo. Con los demás valores del bloque (`circa_year: ""`, `show_unique_piece: false`, `not_assessed`), el bloque deja de renderizar en la tienda. El encabezado «Archival provenance» queda en el setting pero no se emite. Los otros tres bloques empaquetados ya están vacíos (verificado por recorrido JSON).

# 6. Decisiones PD y C (punto 4)

## 6.1 PD

- **PD-1: SÍ.** F4 entra con los siete valores exactos de §3.4 de la directiva. Comprobé que son Nivel 1 (mismas claves, V15), que están en sentence case, en inglés neutro y sin jerga, y que siguen usando `t:`. Corrigen el «for this product» de `hardware` (`locales/en.default.schema.json:1019`), que con el nuevo contrato pasa a ser engañoso. Otros locales de schema: no existe ninguno (`ls locales` da `en.default.json`, `en.default.schema.json` y `es.json`; `es.json` es de storefront y solo tiene un `info` ajeno, `:247`). No hay que cambiar nada en paralelo. Si en el futuro se activa TT-56 (`es.schema.json`), deberá partir de los textos nuevos.
- **PD-2: SÍ.** Se conserva la guarda `contains '{{'`: sanea un literal escrito a mano, no lee el producto y mantiene el comportamiento actual.
- **PD-3: NO en A-02.** Añadir un aviso de editor a especificaciones exige claves nuevas en `en.default.json` y `es.json`, fuera de la lista. Pasa al Lote C (superficie del comerciante) como hallazgo.
- **PD-4: sin cambio de estado** en «Presets Diferenciados» (`docs/requirements-ledger.md:109`). La diferenciación no depende de esa frase. R-C la regresará con el ZIP final.
- **PD-5: no se crea fila.** El ledger refleja requisitos oficiales; A-02 se sigue en BOARD/STATUS como «código completo».

## 6.2 C

- **C-1:** de acuerdo, prevalece D11 (§2). Antigravity conserva la revisión final antes del envío (D18).
- **C-2:** de acuerdo, sin efecto técnico (D9).
- **C-3:** confirmado. `custom.technical_specs` ocupa `:26–40`; `sections/product-recommendations.liquid:6–12` coincide, y `:66–72` es hoy el schema `intent` (`:64–72`), fuera de alcance.
- **C-4:** de acuerdo. A-02 vacía y no sustituye, así que cumple a la vez «sin texto neutro» (A-02) y «retirar» (C-08).

## 6.3 Hallazgos extra que la directiva debe completar (M-7)

La §8.3 de la directiva omite claims de Archive que el inventario C-08 (`GPT-INVENTARIO-LOTE-0-C08-001.md`, grupo 6) sí recoge:

- `listings/archive/templates/index.json:33–36` (grados «Grade I / Mint» … «Stabilized by master conservator…»), `:53–55` (marquee «CIRCA 1989–1999 THE PERMANENT ARCHIVE», «CURATED ARCHIVAL GARMENTS & CONSERVATION», «CURATED PERIOD SELECTIONS & ACCESSIONS») y `:116` (envío «Climate-controlled archival transport | Insured courier»). Son de C-08.
- Tagline de Archive para la ficha de Theme Store, «Heritage catalogue pages, with provenance on every line.» (`docs/decisions.md:150,169`). Tras A-02, el preset Archive empaquetado no muestra procedencia en ninguna ficha, así que el tagline queda sin respaldo visible. Es para C-04/G3 (listing), no para A-02.

# 7. Cambios obligatorios que el coordinador incorpora a la directiva

- **M-1 (§1.2, árbol limpio).** Sustituir `git status --porcelain | wc -l  # esperado: 0` por:
  ```bash
  git status --porcelain -- assets config layout locales sections snippets templates listings scripts docs | wc -l
  # esperado: 0
  git status --porcelain
  # pegar literal; solo se admiten líneas "?? agent-comms/..." (otras directivas o revisiones sin commit). Cualquier otra: detenerse.
  ```
  Motivo: hoy están sin commit esta directiva, A-03 y esta R-D, y C-08 y A-01/B-02 vendrán en otros turnos. Con el texto actual el preflight falla siempre. Se recomienda que el coordinador haga commit de la directiva y de esta R-D en `lote-a` antes de entregarla.
- **M-2 (§1.2, secciones).** Mantener exactos los hashes de los dos snippets, pero quitar de esa línea los de `sections/main-product.liquid` y `sections/featured-product.liquid` y sustituirlos por esta comprobación semántica, que debe imprimir `SECTIONS_OK`:
  ```bash
  python3 -I - <<'EOF'
  import json, re, subprocess
  def blocks(src):
      m = re.search(r'\{%-?\s*schema\s*-?%\}(.*?)\{%-?\s*endschema\s*-?%\}', src, re.S)
      return [b for b in json.loads(m.group(1))['blocks'] if b.get('type') in ('technical_specs', 'provenance')]
  calls = {
   'sections/main-product.liquid': [
    "{% render 'product-technical-specs', block: block, product: product, heading_tag: 'h2' %}",
    "{% render 'product-provenance', block: block, product: product, selected_variant: selected_variant %}"],
   'sections/featured-product.liquid': [
    "{% render 'product-technical-specs', product: section.settings.product, block: block %}",
    "{% render 'product-provenance', product: section.settings.product, block: block, selected_variant: selected_variant %}"],
  }
  for f, cs in calls.items():
      cur = open(f, encoding='utf-8').read()
      base = subprocess.check_output(['git', 'show', 'eb7cca7:' + f]).decode('utf-8')
      for c in cs:
          assert cur.count(c) == 1, (f, c)
      assert blocks(cur) == blocks(base) and len(blocks(cur)) == 2, f
  print('SECTIONS_OK')
  EOF
  ```
  Motivo: el plan pone A-01/B-02 (formularios de PDP y featured) y C-08 en el mismo lote, y ambos editan esas dos secciones. En el scratchpad de la sesión hay una simulación de C-08 que toca `sections/main-product.liquid`, `sections/featured-product.liquid`, `listings/archive/templates/index.json` y `locales/en.default.schema.json`. Durante esta revisión apareció sin commit `agent-comms/outbox-claude/CLAUDE-DIRECTIVA-A-01-B-02-001.md`, que nombra 10 veces cada una de esas dos secciones (grep de rutas). Con el hash exacto, A-02 tendría que volver a R-D sin motivo técnico. Este script da `SECTIONS_OK` en `eb7cca7`. Ajustar §1.1 y la frase final de §1.2 («cualquier hash de los cuatro primeros» pasa a «de los dos snippets, o falta `SECTIONS_OK` o `PRE_OK`»).
- **M-3 (§5.1, V7).** Resultado exigido: `git diff --name-only` igual al conjunto {F1, F2, F3, F4}. En `git status --porcelain`, fuera de `agent-comms/` solo esas cuatro rutas como ` M`; dentro de `agent-comms/` solo el informe R nuevo más las líneas `??` ya anotadas en el preflight (M-1). Además, cambiar el resultado exigido de V3 a «exactamente 1 línea, en `snippets/cart-drawer-recommendations.liquid` y con `metafields.custom.complementary_products`», sin fijar el número de línea, para que una edición previa del Lote A en ese archivo no la haga fallar.
- **M-4 (§3.2, F2.a).** El comentario propuesto afirma «Each row renders only from this block's settings», pero el badge también lee variantes e inventario del producto (`product-provenance.liquid:20–22`). Sustituir las líneas 3–4 por exactamente estas tres:
  ```text
    Rows come only from this block's settings, which show as entered for every product that displays the block.
    The unique piece label also checks the product's variant count and inventory settings.
    With every setting empty or off, nothing renders in the storefront.
  ```
  Ajustar «Resto intacto» de F2 (las líneas siguientes se desplazan una posición).
- **M-5 (§5.1, V5b nueva).** Añadir después de V5:
  ```bash
  # V5b
  grep -n -E "(^|[^a-z_.])product(\.|\[)" snippets/product-technical-specs.liquid snippets/product-provenance.liquid | grep -v -E "product\.(selected_or_first_available_variant|variants\.size)"
  ```
  Resultado exigido: sin salida. Demuestra que no hay lectores sustitutos de producto (tags, vendor, description…) en los dos snippets. En `eb7cca7` la misma orden devuelve 15 líneas.
- **M-6 (§5.3 y §7 de la directiva, commit).** F1–F4 van en un único commit del coordinador (condición (b) de §2). Añadir a §5.3, como referencia auxiliar, los `git hash-object` esperados de la afirmación 3 (F1 y F2 siempre; F3 y F4 solo si esos archivos no cambiaron desde `eb7cca7`). Si no coinciden, el revisor D11 compara el diff con §3 de la directiva antes de aceptar.
- **M-7 (§8.3).** Añadir los hallazgos de §6.3 de esta revisión.
- **M-8 (§5.4, R-A).** Añadir dos pruebas: (7) un valor de 120 caracteres o más, sin espacios, en `material` y en `circa_year`, en PDP con viewport verificado de 390 px, sin desbordamiento horizontal; (8) un bloque de especificaciones con solo `heading` relleno: nada en la tienda y nada en la vista previa del editor (confirma el estado de PD-3). Recordar que, con presets vacíos, `scripts/gate5-live-verify.mjs:181–188` informará `false` para ambos bloques, y que eso es lo esperado.
- **M-9 (§8.1, coordinación con C-08).** Añadir: A-02 se ejecuta y se hace commit antes del turno de C-08 (orden del plan V4.1 §8, paso 3, línea 417: A-01, A-02, A-03, B-02, C-08). La directiva C-08 se redacta y se revisa en R-D sobre el árbol posterior a A-02. Así sus grupos 6 y 7 del inventario parten de `:111` vacío y snippets sin lectores. C-08 no edita `snippets/product-technical-specs.liquid` ni `snippets/product-provenance.liquid`, ni la clave `sections.featured_product.blocks.provenance.settings.provenance_notes` de `listings/archive/templates/index.json`, ni las siete claves `info` de F4. Si C-08 se ejecutara antes, A-02 sigue siendo viable gracias a M-2 y al `PRE_OK` semántico, siempre que C-08 no haya tocado esas claves.

Recomendaciones no obligatorias:

- R-1. El texto sugerido para C-04-R podría indicar como vía de migración que los settings `text`/`richtext` del bloque admiten fuentes dinámicas nativas del editor en plantillas de producto. Solo si R-A lo comprueba antes en el editor, sin crear metafields (D17).
- R-2. El hash canónico del ZIP (D21) cambia con este commit porque se modifican `listings/`, `locales/` y `snippets/`. Es esperado y no es una regresión.

# 8. Criterios y pruebas (punto 5)

- Verificables: sí. V1–V15 tienen salida exacta y no dependen del juicio del implementador. Con M-3 y M-5 dejan de fallar por ruido de otros agentes y cierran la clase «lector sustituto».
- Estados degenerados: la tabla de §5.2 cubre vacío, uno solo, muchos (40 variantes, badge), muy largo (título y valor de setting), faltante (sin tipo, metafields, descripción ni imagen), textil frente a no textil, las 14 claves rellenas, `{{` literal, `heading` vacío y featured sin producto. «Muchas imágenes» y «200 productos paginados» no aplican a estos bloques, porque ni leen media ni paginan. La parte visual de «muy largo» queda en R-A (M-8).
- Separación estático/tienda: correcta. §5.1 y §5.2 se etiquetan «estática»; §5.4 queda «pendiente de credenciales (D22)», solo con el tema no publicado en `tema-qkqpke0j` y sin escribir productos ni metafields. Prohíbe declarar `cumplido`.

# 9. Ledger

Las filas que cita la directiva existen y su estado es el indicado: `docs/requirements-ledger.md:22` (`cumplido`), `:109` (`cumplido`) y `:111` (`cumplido`). Ninguna fila describe la veracidad de datos de especificación o procedencia. `:88` («Capa de Confianza…») no cita estos snippets. A-02 no cierra ni modifica filas. El estado de la tarea es «código completo» y lo registra el coordinador.

# 10. Coordinación con C-08 (punto 6)

`agent-comms/outbox-claude/CLAUDE-DIRECTIVA-C-08-001.md` no existe en el árbol (`ls agent-comms/outbox-claude/`; solo hay sin commit A-02 y A-03). Según el inventario C-08 y la simulación del scratchpad, comparten archivos con A-02: `listings/archive/templates/index.json` (seguro) y `locales/en.default.schema.json` (probable). También tocan `sections/main-product.liquid` y `sections/featured-product.liquid`, que A-02 no edita pero usaba en su preflight. Reparto y orden: M-9. La directiva A-03 (`assets/base.css`) no se solapa con A-02.

# 11. Veredicto

**APROBADA CON CAMBIOS** (apta con condiciones, §0.1 de la directiva). La directiva puede entregarse al implementador cuando el coordinador incorpore M-1 a M-9 literalmente. **Nivel 2 de A-02: AUTORIZADO** (D11), con las condiciones (a) a (d) de §2. El implementador cita `CLAUDE-REVIEW-A-02-RD-001` en «Desviaciones» de su informe.

Compuerta del literal sobre este archivo: se ejecuta tras escribirlo, con el contador del scratchpad y salida solo `ruta=N`. El resultado se informa al coordinador fuera del archivo, porque el archivo no puede contener su propio conteo después de escribirse.
