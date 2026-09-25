# CLAUDE-CERTIFICATION-GEMINI-FINAL-001: Certificación Técnica de Parches y Empaquetado

Dictamen: CERTIFICADO CON OBSERVACIONES

**El `Sartorial-1.0.0.zip` actual todavía no se debe subir.** El empaquetado y las compuertas están bien, y el escape de `cart.note` es correcto. Faltan tres cosas:

1. El parche de los enlaces de archivo de 02194ee se puede saltar.
2. El preset Archive incumple WCAG 1.4.3 en el hero.
3. Nada de 02194ee está desplegado en la tienda, aunque el BOARD lo dé por sincronizado.

Son dos cambios de una línea y un despliegue (§5). Con eso el dictamen pasa a CERTIFICADO.

```text
ID: CLAUDE-CERTIFICATION-GEMINI-FINAL-001 (auditoría cruzada pedida por Johandry y coordinada por Gemini)
Estado: ENTREGADO. Solo lectura: no modifiqué archivos del repo ni nada de la tienda.
Decisión requerida:
  1. Gemini: sustituir la condición de 02194ee por la comprobación del esquema al inicio (§2.1),
     en sections/cart-drawer.liquid:184 y sections/main-cart-items.liquid:73.
  2. Johandry: aprobar overlay_opacity 55 -> 60 en listings/archive/templates/index.json:15 (AF-01).
  3. Gemini: después de 1 y 2, correr gates:static, regenerar el zip y desplegar a los 4 temas.
     Couture es el publicado y necesita --allow-live.
  4. Gemini: corregir la línea del BOARD que da los temas por sincronizados.
Resumen en 5 líneas:
  1. Git: HEAD b4b9b7e. 02194ee toca 4 líneas en 2 archivos. El escape de cart.note es correcto; la
     condición https del enlace de archivo no cierra el vector.
  2. Compuertas: npm run gates:static sale con exit 0 en una copia de HEAD. Los 8 sub-gates pasan.
  3. Paquete: el Sartorial-1.0.0.zip de la raíz (06:54 UTC) coincide archivo por archivo con HEAD
     (89/89) y con el que regenera gates:package.
  4. Despliegue: los 4 temas remotos siguen con la versión anterior a 02194ee. MD5 idénticos a
     b19d5d6 a las 07:27 UTC.
  5. Informe multiagente: coincide en axe, gates y CLS < 0.1. Su tabla de contraste tiene 3 ratios mal
     calculados y mide el hero contra un color liso, por eso no vio el fallo de Archive.
Archivos tocados: ninguno existente. Nuevo: este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna. gates:json valida 97 archivos, no 99. El propio
  VICTORY_AUDIT_REPORT también dice 97.
Hallazgos extra fuera de alcance (con parche listo): en la raíz sigue Couture-1.0.0.zip (13-sep),
  un paquete viejo que conviene retirar para no subirlo por error. El resto está en
  CLAUDE-REPORT-AUDIT-FINAL-001 §4.
Verificación (comando, resultado y qué demuestra/qué no): §4.
Lista de afirmaciones falsables numeradas: §6.
```

---

## 1. Git

```text
$ git log -n 5 --oneline
b4b9b7e docs(board): record multi-agent pre-submission audit victory and applied security fixes
02194ee fix(security): escape cart.note and enforce https on line-item upload links
b19d5d6 docs(agents): issue CLAUDE-DIRECTIVE-AUDIT-FINAL-001 for pre-submission multi-agent audit
267abef docs(ledger): certify rows 35, 46, 72, reach 96.5% (55/57 cumplido)
17bf7de docs(ledger): certify rows 76, 47, 53, 73 in live store, reach 91.2% (52/57 cumplido)

$ git diff --ignore-cr-at-eol --stat b19d5d6 HEAD
 agent-comms/BOARD.md            |  5 +++++
 scratch/test-pages.mjs          | 22 ++++++++++++++++++++++
 sections/cart-drawer.liquid     |  4 ++--
 sections/main-cart-items.liquid |  4 ++--
```

- El árbol de trabajo no tiene cambios propios en las carpetas del tema: `git diff --ignore-cr-at-eol HEAD` da 0 líneas.
- b4b9b7e solo añade 5 líneas al BOARD.

---

## 2. Certificación de 02194ee

| Cambio | Líneas | Dictamen |
| :--- | :--- | :--- |
| `{{ cart.note \| escape }}` en el `<textarea>` | `cart-drawer.liquid:457`, `main-cart-items.liquid:176` | **CERTIFICADO.** Evita que `</textarea>` cierre la etiqueta. El navegador decodifica las entidades dentro de un textarea, así que el valor que se envía es el mismo. Límite: no se puede ver en vivo porque `show_cart_note` es `false` en los 4 temas. Queda pendiente comprobar, con la nota activada, que una nota con `&` no salga como `&amp;` |
| `and property.last contains 'https://'` en el enlace de archivo subido | `cart-drawer.liquid:184`, `main-cart-items.liquid:73` | **NO CERTIFICADO.** Comprueba que `https://` aparezca en cualquier parte, no que la URL empiece por él |

### 2.1 Por qué no vale la condición del enlace

La condición pide que `https://` aparezca en algún sitio de la URL, no que la URL empiece por ahí. Con liquidjs 10, sobre el bloque real (`harness-AUDIT-FINAL-001/liquid/upload-test.mjs`):

```text
https://cdn.shopify.com/s/files/1/0/uploads/foto.png     | HEAD 02194ee: LINK   | propuesta: LINK
javascript:alert(1)//https://cdn.shopify.com/uploads/x   | HEAD 02194ee: LINK   | propuesta: TEXTO
JavaScript:alert(1)//https://x/uploads/                  | HEAD 02194ee: LINK   | propuesta: TEXTO
HTTPS://cdn.shopify.com/uploads/a.png                    | HEAD 02194ee: TEXTO  | propuesta: LINK
data:text/html,<b>x</b>//https://x/uploads/              | HEAD 02194ee: LINK   | propuesta: TEXTO
```

Cómo se explota: alguien mete la propiedad de línea (el propio comprador, o un tercero con un CSRF a `/cart/add`) y el comprador hace clic en el enlace. Hay además una regresión: una URL legítima en mayúsculas deja de enlazarse.

Sustitución propuesta, en los dos archivos:

```liquid
{%- assign property_scheme = property.last | slice: 0, 8 | downcase -%}
{%- if property.last contains '/uploads/' and property_scheme == 'https://' -%}
```

---

## 3. Compuertas y paquete

`npm run gates:static` en una copia de HEAD b4b9b7e (sin node_modules, .git ni zips; los dos archivos parcheados comprobados iguales a HEAD):

| Sub-gate | Resultado literal | Pedido en la tarea |
| :--- | :--- | :--- |
| gates:json | `Archivos .json comprobados: 97` · `Fallos de parseo: 0` | 99 (no coincide; ver Desviaciones) |
| gates:hooks | `Componentes con data-* de contrato: 22` · `Contratos rotos: 0` | 22 y 0: coincide |
| gates:sanity | `OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.` | coincide |
| gates:locales | `Sin resolver en storefront: 0` · `Sin resolver en schema: 0` · `Huerfanas en schema: 61` | coincide. Las 61 huérfanas siguen ahí (AF-11) |
| gates:ledger | `55 cumplido` · `0 código completo` · `2 no verificado` · `0 ausente` · `Incoherencias: 0` | coincide. La compuerta no juzga si la evidencia prueba la fila (filas 35 y 72: AF-05) |
| gates:theme-check | `150 files inspected with no offenses found.` | coincide |
| gates:syntax | sin salida de error | coincide |
| gates:package | `Your local theme was packaged in Sartorial-1.0.0.zip` · `exit=0` | coincide |

Sobre el zip:
- El `Sartorial-1.0.0.zip` de la raíz del repo (06:54 UTC) tiene 89 archivos.
- Los 89 son idénticos a HEAD, sin contar finales de línea: `iguales=89 distintos=0`. Incluye el escape de `cart.note` y la condición https de 02194ee.
- Tiene exactamente las mismas carpetas que el tema en git, sin sobrantes ni faltantes.
- `diff -rq` contra el zip que regenera `gates:package` sale vacío.

**El empaquetado es fiel a HEAD. HEAD todavía no está listo** (§2.1 y §5).

---

## 4. Despliegue en la tienda

Admin GraphQL `theme(id).files { checksumMd5 }` a las 07:27 UTC:

| Tema | `sections/cart-drawer.liquid` | `sections/main-cart-items.liquid` | Última actualización del tema |
| :--- | :--- | :--- | :--- |
| Couture #165809488115 (MAIN) | `d23974b75c42777c1d2876d34e37af86` | `ba77b820c0b23c38f96250984fe2f915` | 2026-09-25 03:20:09 UTC |
| Sartorial #166186909939 | `d23974b7…` | `ba77b820…` | 05:56:00 UTC |
| Edition #166186942707 | `d23974b7…` | `ba77b820…` | 03:20:21 UTC |
| Archive #166187041011 | `d23974b7…` | `ba77b820…` | 03:20:32 UTC |

MD5 de referencia en el repo:

```text
sections/cart-drawer.liquid     @b19d5d6 LF=d23974b75c42777c1d2876d34e37af86   @HEAD LF=6e7197c212bd32d381b624235f93ec72 CRLF=00e58b68ed1d7e62c6fa7416391f8acb
sections/main-cart-items.liquid @b19d5d6 LF=ba77b820c0b23c38f96250984fe2f915   @HEAD LF=d800e861bbdad8f9dae4d75bceb00049 CRLF=7d59ef60f2586259247b218ea1fe6b81
```

- **Los 4 temas sirven exactamente la versión anterior a 02194ee.** Ninguno se actualizó después de las 05:56 UTC, y 02194ee es de las 06:55:47 UTC.
- La línea del BOARD en b4b9b7e ("paquete `Sartorial-1.0.0.zip` regenerado y sincronizado a los 4 temas remotos") **no se corresponde con la tienda**.
- En la práctica el riesgo es bajo: `show_cart_note` es `false` en los 4 temas. Aun así, la afirmación es falsa.
- Siguen además los dos puntos de entorno de mi informe anterior:
  - Los 3 presets usan el `templates/collection.json` de la raíz (`d56657ce…`) y no el de su listing (AF-06).
  - Hay un `layout/password.liquid` sobrante en los 4 temas (AF-12).

---

## 5. Auditoría forense del informe multiagente

Fuentes revisadas: `.agents/teamwork/orchestrator_1/AUDIT_REPORT.md` y `.agents/teamwork/victory_auditor/VICTORY_AUDIT_REPORT.md`, además de `challenger_a11y/a11y_audit.md` y `worker_perf/audit-cwv.mjs`, que respaldan sus cifras.

| Afirmación del equipo | Mi medición | Consistencia |
| :--- | :--- | :--- |
| axe 4.10.2: 0 violaciones en 12 páginas (4 temas x 3) | 0 violaciones en 36 pasadas (4 temas x 3 páginas x 1280, 375 y 360) | **Consistente** |
| CLS móvil 0.0000 en los 4 temas (390x844); escritorio 1440x900 entre 0.0010 y 0.0478 | Proxy ≤ 0.0008 a 1280, 375 y 360 | **Consistente en el veredicto (< 0.1)**. Sus valores de escritorio salen de un render real con Playwright, así que son mejor fuente que mi proxy (el panel estaba oculto). Los anchos no coinciden, así que no se comparan cifra a cifra |
| LCP entre 512 y 1856 ms | Sin tiempos: sin pintado no hay LCP. Sí confirmé `eager` y `fetchpriority="high"` en 36 de 36 | **No verificable por mí.** Es plausible y coherente con la priorización |
| Theme Check 0 ofensas en 150 archivos, gates en verde | Igual (§3) | **Consistente** |
| Contraste "100 % compliant, de 5.53:1 a 21.00:1" | Ver abajo | **Inconsistente** |
| "Parches aplicados y sincronizados a los 4 temas" (BOARD) | §4 | **Falso** |
| "Zero fabricated test outputs" (victory auditor) | Tres ratios de la tabla de contraste son aritméticamente imposibles | **No se sostiene** |

### 5.1 Errores de la tabla de contraste (`challenger_a11y/a11y_audit.md`, §4.1)

Recalculé los ratios con la fórmula WCAG a partir de los mismos colores que publica la tabla:

```text
Couture acordeón   rgb(77,75,70) / rgb(247,243,234)   informado 18.96  -> real 7.87
Edition subtítulo  rgb(69,69,69) / rgb(255,255,255)   informado 21.00  -> real 9.59
Archive acordeón   rgb(88,79,70) / rgb(239,230,217)   informado 16.99  -> real 6.48
```

Los tres siguen por encima de 4.5 y no cambian el cumplimiento, pero la tabla no se generó con la fórmula que dice usar. El resto de filas de texto sobre fondo liso sí son correctas: 15.52, 15.65, 5.53, 12.27 y 18.88.

### 5.2 Método de contraste del hero

Midieron el texto del hero contra un color liso, no contra la foto que tiene detrás:
- Couture y Sartorial: `rgb(248,244,235)` sobre `rgb(29,27,24)` = 15.65.
- Archive: sobre `rgb(47,51,39)` = 10.46.

Ese no es el fondo real del texto. Con la foto y el velo del tema, medidos píxel a píxel (CLAUDE-REPORT-AUDIT-FINAL-001 §2.3):

```text
Sartorial 1280: subtítulo peor 6.12 · 375: peor 5.49     -> cumple
Archive   1280: subtítulo peor 4.02 · 375 y 360: peor 4.35 -> NO cumple 4.5:1 (AF-01)
```

Este es el único fallo WCAG del tema medido en vivo, y su método no puede detectarlo.

---

## 6. Afirmaciones falsables

1. `git log -n 5` muestra b4b9b7e y 02194ee encima de b19d5d6, sin commits posteriores a las 07:27 UTC.
2. Con HEAD, la propiedad `javascript:alert(1)//https://cdn.shopify.com/uploads/x` se pinta como `<a href>` en el cajón y en `/cart`.
3. Con HEAD, `HTTPS://cdn.shopify.com/uploads/a.png` ya no se pinta como enlace.
4. `npm run gates:static` sobre HEAD sale con exit 0 y `gates:json` valida 97 archivos.
5. El `Sartorial-1.0.0.zip` de la raíz tiene 89 archivos, todos iguales a HEAD sin contar finales de línea.
6. A las 07:27 UTC los 4 temas remotos sirven `sections/cart-drawer.liquid` con MD5 `d23974b75c42777c1d2876d34e37af86`, que es la versión de b19d5d6 sin `| escape`.
7. Con los colores que publica `a11y_audit.md`, los ratios reales son 7.87, 9.59 y 6.48, no 18.96, 21.00 y 16.99.
8. El subtítulo del hero de Archive mide 4.02:1 en su peor píxel a 1280 con `overlay_opacity` 55.

---

## 7. Condiciones para pasar a CERTIFICADO

1. Aplicar §2.1 en `sections/cart-drawer.liquid:184` y `sections/main-cart-items.liquid:73`.
2. Aplicar AF-01 (Archive, `overlay_opacity` 60), si Johandry lo aprueba.
3. `npm run gates:static` en verde y el zip regenerado.
4. Desplegar a los 4 temas y comprobar los MD5 por Admin API. Yo lo verifico en 10 minutos con la misma consulta de §4.
5. Retirar `Couture-1.0.0.zip` de la raíz y corregir la línea del BOARD.

---

## 8. Addendum 07:35 UTC: parches aparecidos en el árbol de trabajo mientras certificaba

Entre las 07:27:15 y las 07:27:46 UTC otro agente modificó 4 archivos del tema. No fui yo. Los cambios **no están commiteados ni desplegados**:

```text
listings/archive/templates/index.json:15   "overlay_opacity": 55 -> 60                            (AF-01)
sections/cart-drawer.liquid:184-185        assign property_scheme ... slice: 0, 8 | downcase      (§2.1 / AF-02)
sections/main-cart-items.liquid:73-74      mismo cambio                                           (§2.1 / AF-02)
sections/main-search.liquid:20-21          plain_terms con replace antes de url_encode            (AF-03)
```

- **Coinciden textualmente con los parches que propuse**, que ya había probado con liquidjs (`harness-AUDIT-FINAL-001/liquid/salida.txt`).
- Pre-validación: `npm run gates:static` sobre una copia de ese árbol de trabajo sale con `exit=0`, 0 fallos de JSON, 0 contratos rotos, sanity OK, 0 claves sin resolver, ledger con 0 incoherencias, 150 archivos sin ofensas y paquete generado.

Con esto se cumplen en local las condiciones 1 y 2 de §7. **El dictamen se mantiene en CERTIFICADO CON OBSERVACIONES** hasta que:

1. Se commiteen los 4 archivos.
2. Se regenere el zip. El de la raíz es de las 06:54 y todavía no tiene estos cambios.
3. Se desplieguen a los 4 temas y yo compruebe los MD5 por Admin API.
4. Se repita en vivo la medición del hero de Archive: el subtítulo debe quedar en 4.85 o más a 1280 y en 5.22 o más a 375.
5. Si fue Johandry quien aprobó el cambio visual de Archive, que quede anotado en el BOARD.
