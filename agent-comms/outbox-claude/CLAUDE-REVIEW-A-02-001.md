ID: CLAUDE-REVIEW-A-02-001
Estado: Revisión D11 de la tarea de código A-02 emitida. Veredicto: ACEPTADO. Estado máximo de A-02: «código completo» (D22). Las pruebas R-A en tienda siguen PENDIENTES DE CREDENCIALES.
Decisión requerida: Ninguna de Johandry (no hay caso D10). El coordinador hace un único commit en `lote-a` con F1–F4 añadidos por ruta (condición (b) de la R-D) y sin `assets/base.css`, que es de A-03. Lo acompañan este archivo y el informe del implementador. La dependencia C-04-R sigue abierta (condición (d)).
Resumen en 5 líneas:
1. El diff de los cuatro archivos coincide byte a byte con la directiva y M-4. Reconstruí F1–F3 desde el texto de la directiva sobre `HEAD` y obtuve los mismos `git hash-object`, que son también los de M-6. F4 da `F4_OK`.
2. Están retiradas las 14 fuentes y H1–H8. En los dos snippets no queda ningún lector de producto aparte de las dos lecturas del badge de pieza única, y no hay texto inventado ni `default:` nuevo.
3. En una copia aislada (`HEAD` + solo estos cuatro archivos) pasan Theme Check (92 archivos, 0 ofensas, exit 0), locale-key-inventory (0/0 y 0/0), theme-check-sanity, json-validate y V1–V15 + V5b.
4. Los estados degenerados se comprobaron por lectura del Liquid final, porque no hay renderer local y la directiva prohíbe instalarlo. Con todo vacío no se emite nada en la tienda, los valores salen escapados y la guarda `{{` se conserva. Que el producto sea textil o no ya no cambia nada.
5. Solo encuentro hallazgos P3 de forma en el informe, sin cambios exigidos. NO HAY P0/P1 NUEVOS.
Archivos tocados: solo este archivo nuevo, `agent-comms/outbox-claude/CLAUDE-REVIEW-A-02-001.md`. Las pruebas se hicieron en una copia en `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/rev-a02/copy` (`git archive HEAD` con commit local de base, más los cuatro archivos del árbol de trabajo). Sin git de escritura en el repo, sin red, sin tiendas, sin gate5, sin `.secrets`, sin variables de entorno, sin dependencias instaladas.
Desviaciones (Nivel 1 o Nivel 2): Ninguna en esta revisión.
Hallazgos extra fuera de alcance (con parche listo): Sin parche. Ver §7: V8 falla hoy en el árbol vivo por `assets/base.css` de A-03, que no es de A-02.
Verificación (comando, resultado y qué demuestra/qué no): §2 a §5. Demuestra que el diff es exacto, que el retiro es completo según el barrido estático y que las compuertas estáticas pasan con solo los cambios de A-02. No demuestra el render en tienda, el editor ni el estado real de metafields en `tema-qkqpke0j`.
Lista de afirmaciones falsables numeradas:
1. `git hash-object` de los cuatro archivos en el árbol de trabajo: F1 `68354c31e7357f40bdf1385fa1916013cc1fa756`, F2 `2a624b236b5c31242fd3b6c042894196afb6baa7`, F3 `68f4b21a2812b6ec4302e8420f164c8d85994a9a` y F4 `34122e73def9ea02e0d43613da59341c71989b15`. Los tres primeros salen también al reconstruir desde el texto de la directiva (§3.1, §3.2 con M-4, §3.3) aplicado a `HEAD`.
2. En la copia aislada: V1, V2, V4, V5 y V5b sin salida (exit 1); V3 da una sola línea, en `snippets/cart-drawer-recommendations.liquid:80`; V6 da `0`; V8 da `UNTOUCHED_OK`; V13 sin salida (exit 0); V14 `F3_OK`; V15 `F4_OK`.
3. Theme Check sobre la copia aislada: «92 files inspected with no offenses found.», TC_EXIT=0. locale-key-inventory: 0/0 sin resolver y 0/0 huérfanas, exit 0. theme-check-sanity: OK, exit 0. json-validate: 521 archivos, 0 fallos, exit 0.
4. Los cuatro bloques `technical_specs`/`provenance` empaquetados en `templates/`, `listings/`, `config/` y `sections/*.json` tienen hoy todos los valores vacíos o `not_assessed`.
5. `git rev-parse lote-a` = `git rev-parse lote0/base-09f8342` = `eb7cca797f9de142089c6c14daaa5ed449597f9f`, y la rama activa es `lote-a`.
6. Compuerta del literal: los cuatro archivos y el informe dan `ruta=0`. El conteo de este archivo se informa fuera de él (§8).

---

# 1. Base y alcance revisado

```text
$ git branch --list ; git rev-parse lote0/base-09f8342 lote-a
  claude/beautiful-edison-tqvng5
* lote-a
  lote0/base-09f8342
  master
eb7cca797f9de142089c6c14daaa5ed449597f9f
eb7cca797f9de142089c6c14daaa5ed449597f9f

$ git diff HEAD --stat -- snippets/product-technical-specs.liquid snippets/product-provenance.liquid listings/archive/templates/index.json locales/en.default.schema.json
 listings/archive/templates/index.json   |  2 +-
 locales/en.default.schema.json          | 14 +++---
 snippets/product-provenance.liquid      | 28 ++++--------
 snippets/product-technical-specs.liquid | 81 +++------------------------------
 4 files changed, 24 insertions(+), 101 deletions(-)
```

Fuera de alcance y sin revisar: ` M assets/base.css` (A-03) y los `??` de `agent-comms/` de otras tareas.

# 2. Exactitud del diff frente a la directiva y la R-D

## 2.1 Reconstrucción independiente

Script propio (no el `apply.py` de la R-D). Lee los blobs de `HEAD`, afirma los anclajes de línea (comentario 1–10 y `liquid` 12–86 en specs; 3–4 y 26–49 en provenance; una única ocurrencia en F3), sustituye con el texto literal de la directiva y M-4 y calcula el hash:

```text
F1 68354c31e7357f40bdf1385fa1916013cc1fa756
F2 2a624b236b5c31242fd3b6c042894196afb6baa7
F3 68f4b21a2812b6ec4302e8420f164c8d85994a9a

$ git hash-object snippets/product-technical-specs.liquid snippets/product-provenance.liquid listings/archive/templates/index.json locales/en.default.schema.json
68354c31e7357f40bdf1385fa1916013cc1fa756
2a624b236b5c31242fd3b6c042894196afb6baa7
68f4b21a2812b6ec4302e8420f164c8d85994a9a
34122e73def9ea02e0d43613da59341c71989b15

$ sha256sum (mismos 4)
5d8b7e14878cf5a24482c7b3ab61b173c04265a56bfce69662afa531c8b3c47a  snippets/product-technical-specs.liquid
a217c745ad69ba8398c75433493c58786ff9f10c812219d1347b6b6ba9bd1959  snippets/product-provenance.liquid
9cc59fa907c0e4684a98e9699d27320aeece46cd71bc493c8b59733a34ea615d  listings/archive/templates/index.json
751953f9b156aea2411ccacf75eb45ffeb0ff1b058f591f90f34b8f2a974abe9  locales/en.default.schema.json
```

Los cuatro `git hash-object` coinciden con M-6 y con la afirmación 3 de la R-D. Los SHA-256 coinciden con los del informe (§5). F4 se verifica con V15 (§3) y en el diff solo cambian las siete líneas `info` (1011, 1015, 1019, 1023, 1035, 1043, 1067). Final de línea LF; `file` informa «ASCII text» en ambos snippets.

## 2.2 Lectura del diff

- F1 (`snippets/product-technical-specs.liquid`): el comentario 1–12 sigue §3.1 F1.a, el `liquid` 14–19 tiene cuatro `assign` de `block.settings.*` y el render 21–53 es idéntico al de antes (no aparece en el diff).
- F2 (`snippets/product-provenance.liquid`): comentario 3–5 según M-4 y bloque 27–39 según §3.2 F2.b. No cambian `heading_tag` (16–19), `current_variant`/`unique_piece` (21–25), el render 42–68 ni `editor_empty` (69–73).
- F3: un solo valor (`F3_OK`); orden de claves y formato intactos (el diff es de una línea).
- F4: siete `info`; no cambia ninguna clave, label ni opción (`F4_OK`).

# 3. Verificaciones repetidas (copia aislada: `HEAD` + solo los 4 archivos)

```text
## V1   grep metafields (2 snippets)                         -> exit=1 (sin salida)
## V2   grep 14 claves (todo el tema)                        -> exit=1 (sin salida)
## V3   grep metafields.(custom|sartorial).
snippets/cart-drawer-recommendations.liquid:80:              assign pool = anchor_product.metafields.custom.complementary_products.value
exit=0
## V4   metafields|metaobject (2 snippets + 2 sections)      -> exit=1
## V5   heurísticas                                          -> exit=1
## V5b  lectores de product. ajenos al badge                 -> exit=1
## V5b sin filtro (lo único que queda):
snippets/product-provenance.liquid:21:  assign current_variant = selected_variant | default: product.selected_or_first_available_variant
snippets/product-provenance.liquid:23:  if block.settings.show_unique_piece and product.variants.size == 1 and current_variant.inventory_management != blank and current_variant.inventory_policy == 'deny'
## V5b sobre HEAD (control)                                  -> 15 líneas
## V6   default: añadidos en snippets                        -> 0   (en todo el diff: 0)
## V8                                                        -> UNTOUCHED_OK
## V13  git diff --check                                     -> exit=0 (sin salida)
## grep -rn "product\.type" snippets sections                -> exit=1
## grep custom.|sartorial. sin "metafields" (2 snippets)     -> exit=1
F3_OK
F4_OK
SECTIONS_OK   (script M-2, sobre el repo vivo)

$ npx shopify theme check --path <copia>
│  92 files inspected with no offenses found.                                  │
TC_EXIT=0
$ node scripts/locale-key-inventory.mjs
Sin resolver en storefront:     0
Sin resolver en schema:         0
Construidas en runtime:         0
Huerfanas en storefront:        0
Huerfanas en schema:            0
OK: todas las referencias estaticas resuelven contra los locales.
LKI_EXIT=0
$ node scripts/theme-check-sanity.mjs
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
SANITY_EXIT=0
$ node scripts/json-validate.mjs
Archivos .json comprobados: 521
Fallos de parseo:           0
JSON_EXIT=0
```

En el repo vivo solo repetí `git diff --check -- <los 4 archivos>` (exit 0), los hashes y SHA-256 (§2.1) y SECTIONS_OK. V8 en el repo vivo: véase §7.

Comprobaciones de clase adicionales:

- Llamadores (`grep -rn "product-technical-specs|product-provenance"` en `sections snippets blocks layout templates`): solo `sections/main-product.liquid:700,703` y `sections/featured-product.liquid:451,456`, sin cambios (SECTIONS_OK).
- Recorrido JSON de los bloques empaquetados: `listings/archive/templates/product.json` (main/provenance), `listings/archive/templates/index.json` (featured_product/provenance), `listings/imprint/templates/product.json` y `listings/imprint/templates/index.json` (technical_specs). Todos los valores están vacíos o en `not_assessed`. No hay ningún otro bloque de estos tipos en `templates/`, `config/` ni `sections/*.json`.
- Restos: los literales «Solid milled brass» y «Precision machined» ya no aparecen en el tema (grep fuera de `agent-comms`). `scripts/gate5-complete-verification.mjs:172–189` contiene HTML sintético de prueba y no depende del render real. `scripts/gate5-live-verify.mjs` dará `false` con presets vacíos, como ya está previsto.

Conclusión §2 y §3: se cumplen directiva y R-D. Están retiradas las 14 fuentes y H1–H8. No hay lectores sustitutos ni texto inventado.

# 4. Estados degenerados (lectura del Liquid final; no hay renderer local)

S = `snippets/product-technical-specs.liquid`, P = `snippets/product-provenance.liquid`.

| Caso | Especificaciones | Procedencia |
| --- | --- | --- |
| Settings vacíos (defaults: `not_assessed`, `show_unique_piece` false, richtext vacío) | La condición S:21 es falsa y no se emite nada, ni en la tienda ni en el editor (PD-3, aceptado). | `unique_piece` falso (P:22–25), `nil \| strip` → `""` (P:28), `show_grade` falso (P:34–37) y notas en blanco (P:39), así que P:42 es falsa. Tienda: nada. Editor: `editor_empty` (P:69–73). |
| Solo encabezado | Igual que vacío: `heading` no entra en S:21. | Igual que vacío: `heading` no entra en P:42. |
| Valor de 120+ caracteres | Sale con `\| escape` (S:30,36,42,48). El desborde lo cubren `.product-technical-specs__row dd { overflow-wrap: anywhere }` (`assets/base.css:9982–9985` en HEAD) y `body { overflow-wrap: anywhere }` (`:131`). | El año sale con `t: year: … \| escape` (P:51) y hereda `overflow-wrap` de `body` (`:131`). Las notas son richtext sin escape (P:66), como antes y como corresponde al tipo. La verificación visual queda en R-A (M-8, prueba 7). |
| Producto textil frente a no textil | Indiferente: no hay ninguna lectura de `product` (V5b). Ambos muestran lo mismo. | Indiferente: año, grado y notas no leen el producto (P:27–39). El badge solo depende de variantes e inventario (P:23), que no cambia. |
| `circa_year` con `{{` | n/a | P:29–31 lo vacía y la línea del año no se emite. Equivale a la guarda anterior (`unless … contains '{{' or … == blank`). Con solo eso relleno, P:42 es falsa y en el editor sale `editor_empty`. |
| Uno solo / muchos | Una fila más el encabezado, o cuatro filas (S:27–50). | Un producto de una variante muestra el badge solo con `show_unique_piece` y política `deny` con inventario gestionado (P:23). Con 40 variantes no hay badge. Año, grado y notas (P:50–67). |
| Faltante (sin tipo, imagen ni descripción) | Igual que el caso general: solo settings. | Igual. |
| Featured sin producto | No se renderiza (guarda `sections/featured-product.liquid:450`, intacta). | Ídem (`:455`). |

Sintaxis Liquid: el literal `'{{'` dentro de `{%- liquid … -%}` (P:29) ya existía en producción en `eb7cca7` (antigua `:32`). No hay ningún `%}` entre la apertura del tag y su cierre, así que el tokenizer no corta el tag. Theme Check lo parsea sin ofensas. Las asignaciones de S:15–18 y P:28–39 se usan todas (no hay UnusedAssign).

Badge de pieza única y lógica conservada: P:16–25 son idénticas a `eb7cca7` (fuera del diff). Es correcto que el badge siga leyendo `product.variants.size` y el inventario de la variante: la directiva §2.4 lo conserva y no es un lector de metafields.

# 5. Superficie del comerciante (siete `info`)

| Clave (`locales/en.default.schema.json`) | Sentence case / inglés neutro / sin jerga | ¿Veraz tras el cambio? |
| --- | --- | --- |
| `technical_specs.material` (:1011) | Sí | Sí: S:15 lo muestra tal cual en todo producto con el bloque. |
| `technical_specs.gsm` (:1015) | Sí | Sí: ya no lo filtra `is_non_textile`. |
| `technical_specs.hardware` (:1019) | Sí | Sí: se quitó «for this product», que era engañoso. |
| `technical_specs.origin` (:1023) | Sí | Sí. |
| `provenance.circa_year` (:1035) | Sí | Sí: ya no lo condiciona el título (H8). Se muestra con el prefijo «Circa» (`en.default.json:433`). |
| `provenance.condition_grade` (:1043) | Sí | Sí, con un matiz P3 (§6, H-3). |
| `provenance.provenance_notes` (:1067) | Sí | Sí. |

Las mismas claves `t:` las usan `sections/main-product.liquid:1121–1149` y `sections/featured-product.liquid:773–801`. En featured la frase «every product that displays this block» sigue siendo cierta: el bloque se aplica al único producto elegido. No aparecen términos internos («popover», «intent», «bento», nombres de marca). No hay labels nuevos y todo sigue pasando por `t:` (locale-key-inventory 0/0).

# 6. Hallazgos

No hay P0, P1 ni P2. NO HAY P0/P1 NUEVOS NO PREVISTOS POR EL PLAN.

- H-1 (P3, informe). `CLAUDE-REPORT-A-02-001.md:76–81`: el `git diff --stat` de §3 («Diff») incluye `assets/base.css` y dice «5 files changed». Contradice la V7 del propio informe (`:350–358`, cuatro archivos) y el enunciado del encargo (§7.4 de la directiva: stat de F1–F4). Es una salida literal capturada después de que A-03 tocara el CSS, y §13 (`:568`) lo explica, así que no es falsa. Corrección opcional: que el coordinador añada en el commit o en STATUS que el stat de A-02 es `4 files changed, 24 insertions(+), 101 deletions(-)` (§1 de esta revisión). No bloquea.
- H-2 (P3, proceso). `CLAUDE-REPORT-A-02-001.md:20`: el implementador trabajó en `lote0/base-09f8342` aunque la condición de entrada §0.3 de la directiva pedía detenerse si `lote-a` no existía, y lo declaró como Nivel 1 (D-1). No tiene efecto técnico: `lote-a` y `lote0/base-09f8342` apuntan al mismo commit (`eb7cca7…`), la rama activa ya es `lote-a` y los cambios sin commit están en ella. Para próximas tareas, el coordinador debería crear la rama antes de entregar la directiva. No bloquea.
- H-3 (P3, redacción). `locales/en.default.schema.json:1043`: «Shown as entered» en un setting `select` es algo impreciso, porque el valor se elige y «Not assessed» no se muestra. El texto es el exacto aprobado por directiva y R-D (PD-1), y no es falso en sustancia. Si se quisiera pulir, sería en el Lote C (superficie del comerciante), no en A-02. No bloquea.
- H-4 (P3, informe). `CLAUDE-REPORT-A-02-001.md:24`: la etiqueta de cabecera es «Verificación:» y no la etiqueta completa de RULES §1.4 («Verificación (comando, resultado y qué demuestra/qué no):»). El contenido sí dice qué no demuestra («Estática; no sustituye la prueba en tienda»). No bloquea.

Comprobación del informe (RULES §1.3–1.4): tiene los nueve campos de cabecera, pega las salidas literales con exit code y sus afirmaciones falsables 1–5 son ciertas (las repetí en §2–§3). El estado declarado es «código completo» y no se declara `cumplido`. Las referencias `archivo:línea` de §4 y §6 del informe coinciden con el árbol final (S:15–18, 21, 23–25, 27–50; P:23, 28–31, 33, 39, 42, 44–46, 47–49, 50–67, 51, 66, 69–72/73). La línea base de json-validate solo se comprobó por texto, y el informe lo declara (`:63`).

# 7. Notas para el coordinador (fuera de alcance de A-02)

- En el árbol vivo, V8 falla hoy porque `assets/base.css` está modificado (`git diff --quiet -- assets/` → exit 1). Es trabajo de A-03, no de A-02. V8 pasa en la copia aislada. El commit de A-02 debe hacerse con `git add` por ruta de F1–F4, más el informe y esta revisión si se versionan.
- R-2 de la R-D: el hash canónico del ZIP (D21) cambiará con este commit, como se espera.
- Siguen abiertas: C-04-R (aviso de retiro de metafields, condición (d)) y las pruebas R-A 1–8 (pendientes de credenciales).

# 8. Veredicto

**ACEPTADO.** A-02 cumple la directiva `CLAUDE-DIRECTIVA-A-02-001` y la R-D `CLAUDE-REVIEW-A-02-RD-001` (M-1..M-9; condiciones (a) y (c) cumplidas; (b) a cargo del coordinador, en un único commit; (d) abierta). Los hallazgos H-1 a H-4 son P3 y no exigen cambios antes del commit. Estado de la tarea: «código completo»; nada se declara `cumplido`.

Compuerta del literal sobre este archivo: se ejecuta después de escribirlo, con una copia de `count-two.py` que solo imprime `ruta=N`. El resultado se informa al coordinador fuera del archivo, porque el archivo no puede contener su propio conteo.
