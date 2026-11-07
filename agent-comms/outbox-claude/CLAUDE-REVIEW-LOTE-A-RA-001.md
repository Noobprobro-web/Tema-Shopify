ID: CLAUDE-REVIEW-LOTE-A-RA-001 (R-A del plan V4.1, parte estática; revisor Opus de contexto limpio según D11; no escribió ninguna directiva, R-D ni código del Lote A)
Estado: Revisión emitida. Veredicto: ACEPTADO CON CAMBIOS (un P2 nuevo de integración, documental, en el ledger). El código del Lote A (`eb7cca7..fe736f7`) se acepta en lo estático sin cambios. La parte de tienda de R-A sigue PENDIENTE (D22): nada pasa a `cumplido`.
Decisión requerida: Coordinador: aplicar CR-1 y CR-2 (§8) en un único commit de `docs/requirements-ledger.md` en `lote-a` y repetir `node scripts/ledger-verify.mjs` (exit 0 esperado). No hace falta otra R-A estática. Johandry: nada nuevo en esta revisión. Siguen abiertas sus decisiones previas: H-1 de A-03 con la fila 47 y el fixture C-R0-4.
Resumen en 5 líneas:
1. Trazabilidad completa: las cinco tareas del Lote A del plan (A-01, A-02, A-03, B-02 y C-08) tienen directiva, R-D, informe, revisión aceptada y commit. Los tres Nivel 2 están autorizados (A-02 por R-D/D11, D-1 de A-01/B-02 por D25, C-08b por D26). No falta ninguna tarea.
2. Integración sobre `fe736f7`: Theme Check 93 archivos sin ofensas (sin LiquidComplexity: main-product 120, featured-product 110). `node --check` y sanity OK. Locales 0/0 y 0/0. JSON y hooks OK. Harness A-01/B-02 56/56 y A-03 810 filas/0 fallos, idénticos byte a byte a lo entregado. C-08 fase b OK. Barrido 35 con tabla idéntica a §5.3. Greps de A-02 conformes.
3. P2 NUEVO: `node scripts/ledger-verify.mjs` da exit 1 en HEAD. Lo provoca C-08b: retiró un default de `sections/newsletter.liquid`, el archivo pasa a tener 104 líneas y la fila 84 cita `:1-105`. En `64862d1` la compuerta daba exit 0. Por eso `npm run gates:static` se corta en `gates:ledger`. Se corrige en el ledger (CR-1); probado en copia: exit 0.
4. Sin regresiones cruzadas: C-08 no toca el formulario ni los bloques de compra (A-01/B-02). Respeta el `provenance_notes` vacío y los siete `info` de A-02. Nadie toca `assets/base.css` después de A-03, y el select sin JS de B-02 recibe el anillo de A-03.
5. ZIP sobre HEAD: 94 archivos (93 + `snippets/variant-no-js-select.liquid`). SHA-256 `8f666379137325873e09f5fce321b66149112bff015e8f20027e35dc9350d5f6`, idéntico en dos generaciones; huella `2afbc7a849583f0bf0adfbc0312219dd1c000bb4e87f2d775e9996efeb78c4f5`. Fila 88: SÍ pasa a `código completo` (CR-2).
Archivos tocados: solo este archivo nuevo, `agent-comms/outbox-claude/CLAUDE-REVIEW-LOTE-A-RA-001.md`. Las pruebas se hicieron en copias `git archive` dentro de `/tmp/claude-0/-home-user-Tema-Shopify/9660ab1f-c64f-5ecc-9b52-d2cc9600f318/scratchpad/ra/`. Sin git de escritura, sin tiendas, sin gate5, sin `.secrets`, sin valores de entorno (el `--check` de traducciones se ejecutó con `env -i`).
Desviaciones (Nivel 1 o Nivel 2): Ninguna en esta revisión.
Hallazgos extra fuera de alcance (con parche listo): Parche listo solo para P2-A y la fila 88 (CR-1 y CR-2, §8; probado en copia). El resto (§7) va sin parche: deriva de localizadores del ledger, directivas versionadas en borrador, D25/D26 fuera de `docs/decisions.md`, BOARD y STATUS desfasados.
Verificación (comando, resultado y qué demuestra/qué no): §2 a §5, con salidas literales. ESTÁTICA y SINTÉTICA (Chromium local de Playwright, HTML traducido a mano en el harness de A-01/B-02). Demuestra que el lote integrado mantiene las compuertas estáticas y la evidencia sintética de cada tarea, y que el ZIP corresponde a los blobs de `fe736f7`. No demuestra el render en tienda, la interpretación de Shopify del payload, el foco en previews reales, los destinos de los CTA ni el estado de las demos.
Lista de afirmaciones falsables numeradas:
1. `git rev-parse HEAD origin/lote-a` da `fe736f7b6bd66981b6acb94728072424993c321d` dos veces; el árbol está limpio; `eb7cca7..fe736f7` son 4 commits lineales (a6a9074, c81cbcb, 64862d1, fe736f7).
2. Sobre `git archive fe736f7`: `npx shopify theme check --path .` → «93 files inspected with no offenses found.», exit 0. `c08_complexity.sh` → featured-product 110, main-product 120.
3. Sobre la misma copia: `node scripts/ledger-verify.mjs` → exit 1, con una incoherencia: «línea 84: sections/newsletter.liquid:1-105: fuera de rango, el archivo tiene 104 líneas». Sobre `git archive` de eb7cca7, a6a9074, c81cbcb y 64862d1 → exit 0.
4. Con CR-1 y CR-2 aplicados a una copia: ledger-verify da «49 cumplido / 11 código completo», «Incoherencias: 0» y exit 0.
5. El harness entregado de A-01/B-02 en modo `fix` contra la copia de HEAD → «MODO=fix total=56 pass=56 fail=0». Su salida es idéntica byte a byte a `harness-A-01-B-02-001/salida-fix.txt`.
6. El harness de A-03 con `assets/base.css` de HEAD → «filas=810 fallos=0», mínimo 7.58. Es idéntico byte a byte a `after.txt`. Con el CSS de eb7cca7 es idéntico a `before.txt` (91 fallos), y `--rules` es idéntico a las líneas 5-8 de `rules-count.txt`.
7. Los cinco scripts de los anexos de C-08, extraídos con el comando de §1.4 de su directiva, dan los cinco SHA-256 de v2. En HEAD, `c08_verify.py . b` → `C08_VERIFY_OK fase=b plantillas_revisadas=28` y la fase `a` falla (control negativo). El barrido da 35 líneas y su tabla `uniq -c` coincide con §5.3 (`SWEEP_TABLE_MATCH`).
8. A-02 en HEAD: V1, V2, V4, V5 y V5b sin salida (exit 1). V3 da una sola línea, `snippets/cart-drawer-recommendations.liquid:80`. Los blobs de los dos snippets son los de F1/F2 (`68354c31…`, `2a624b23…`) y no cambian desde a6a9074. `provenance_notes` de Archive home sigue vacío y los siete `info` siguen iguales que en a6a9074.
9. `node scripts/package-theme-zip.mjs --rev fe736f7` da 94 archivos y el SHA-256 de §4 dos veces (`cmp` sin diferencias). Los 94 contenidos son iguales a los blobs de git. Frente a eb7cca7 (que reproduce `f001627e…`) solo se añade `snippets/variant-no-js-select.liquid` y cambian 33 archivos.
10. Compuerta del literal: 0 en `git diff eb7cca7..fe736f7`, 0 en el ZIP (archivo y contenido descomprimido) y 0 en este archivo; `ctx-check` da 0 fuera de `tests/vendor/axe.min.js` (§9).

---

# 0. Identidad y método

- Revisado: rama `lote-a`, `fe736f7` (= `origin/lote-a`), con base `eb7cca7`. Ninguna tarea tiene cambios sin commit (`git status --short` vacío).
- Contrato leído: plan V4.1 §4.1 (Lote A completo, A-01 a A-03), §5.1 y §5.2 (contrato R-A) y §6. También `AGENTS.md` (las 5 compuertas), `agent-comms/RULES.md` entero y `docs/requirements-ledger.md` (cabecera y filas 47, 48, 49, 53, 69, 71, 84 y 88). Decisiones D9-D18 (`CLAUDE-DECISION-AUTONOMIA-001`), D19 (`…-LOTE-0-CIERRE-001`), D20-D24 (`…-LOTE-0-002`), D25 (`…-A-01-B-02-001`) y D26 (`…-C-08-001`). De cada tarea, las cabeceras y los veredictos de su directiva, R-D, informe y revisión, más las secciones citadas abajo.
- Copias de prueba (sin `.git`, con `node_modules` enlazado de solo lectura): `ra/head` (`git archive fe736f7`), `ra/at-<sha>` (los cuatro commits anteriores) y `ra/ledfix` (HEAD con CR-1 y CR-2). Scripts propios en `ra/tools/`. El sandbox de `theme-check-sanity` se crea dentro de `ra/head/.tmp`, nunca en el repo.

# 1. Trazabilidad

| Tarea del plan (§4.1) | Directiva | R-D (veredicto) | Informe | Revisión D11 (veredicto) | Nivel 2 y autorización | Commit |
| --- | --- | --- | --- | --- | --- | --- |
| A-02 | `CLAUDE-DIRECTIVA-A-02-001` | `CLAUDE-REVIEW-A-02-RD-001`: APROBADA CON CAMBIOS (M-1 a M-9); Nivel 2 AUTORIZADO (D11) | `CLAUDE-REPORT-A-02-001` | `CLAUDE-REVIEW-A-02-001`: ACEPTADO | Retiro de las 14 fuentes: R-D según D11 | `a6a9074` (F1-F4 + documentos) |
| A-03 | `CLAUDE-DIRECTIVA-A-03-001` | `CLAUDE-REVIEW-A-03-RD-001`: APROBADA CON CAMBIOS (C-1 a C-8) | `CLAUDE-REPORT-A-03-001` | `CLAUDE-REVIEW-A-03-001`: ACEPTADO CON CAMBIOS MENORES (M-1 a M-3, sin tocar código) | No aplica (Nivel 1) | `c81cbcb` (base.css + harness + ledger 48/49) |
| A-01 y B-02 (una directiva conjunta) | `CLAUDE-DIRECTIVA-A-01-B-02-001` | `CLAUDE-REVIEW-A-01-B-02-RD-001`: APROBADA CON CAMBIOS (C-1 a C-8); PD-1 mete `layout/theme.liquid` en la lista | `CLAUDE-REPORT-A-01-B-02-001` | `CLAUDE-REVIEW-A-01-B-02-001`: ACEPTADO CON CAMBIOS MENORES (CM-1 a CM-4) + D-1 bloqueada | D-1 (snippet nuevo): Johandry, D25 | `64862d1` (5 archivos de tema + harness + ledger 69/71 + D25) |
| C-08 (RC-07) | `CLAUDE-DIRECTIVA-C-08-001` v2 (partida en C-08a/C-08b) | `CLAUDE-REVIEW-C-08-RD-001`: APROBADA CON CAMBIOS (M-1 a M-8); Nivel 2 no autorizado por la R-D | `CLAUDE-REPORT-C-08-001` | `CLAUDE-REVIEW-C-08-001`: ACEPTADO | N2-1, N2-2 y N2-3: Johandry, D26 | `fe736f7` (28 archivos de tema + documentos + D26) |

Comprobaciones:

- **¿Falta alguna tarea?** No. El plan §4.1 y §8 punto 3 enumeran A-01, A-02, A-03, B-02 y C-08. Las cinco están arriba. B-02 se ejecutó en A tal como fija el plan (§4.2: «aquí solo se regresa»).
- **Listas cerradas frente a lo tocado** (`git show --stat`):
  - A-02 toca exactamente F1-F4.
  - A-03 toca solo `assets/base.css`, más el harness y el ledger que permitía su R-D.
  - A-01/B-02 toca la lista de la directiva más `layout/theme.liquid` (PD-1 de la R-D) y el snippet (D25).
  - C-08 toca 28 archivos, la unión de C-08a (18) y C-08b (13).
  - No hay ningún archivo de tema fuera de esas listas.
- **Cambios exigidos por las revisiones, presentes en el commit:**
  - CM-1 (`whenDefined`, `layout/theme.liquid`) está en `64862d1`, y el harness pasa de 54 a 56 casos.
  - CM-2 está aplicado: el informe declara D-1 como Nivel 2.
  - M-1 de A-03 está aplicado como nota en `CLAUDE-DIRECTIVA-A-03-001.md:28`.
  - Las directivas de A-02 y A-01/B-02 se versionaron en estado «Borrador para R-D» y sin los cambios de su R-D. Es P3-B.
- **Orden de autorizaciones:**
  - D-1 de A-01/B-02 se implementó en el árbol antes de que Johandry la autorizara (la revisión la bloqueó hasta D25). Se hizo commit después. El repositorio nunca tuvo el Nivel 2 sin autorizar, pero RULES §3.5 pide autorización «previa» (P3-E, proceso).
  - El registro de D26 dice «faltaba esta autorización para publicar». El informe de C-08 la da por recibida al aplicar C-08b. La redacción es ambigua y no tiene efecto en el código.

# 2. Integración sobre `fe736f7` (copia `ra/head`)

```text
$ npx shopify theme check --path .            -> │  93 files inspected with no offenses found.  │   tc_exit=0
$ node --check assets/theme.js                -> syntax_theme=0
$ node --check assets/product-zoom.js         -> syntax_zoom=0
$ node scripts/theme-check-sanity.mjs         -> sanity_exit=0
    [theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
$ node scripts/locale-key-inventory.mjs       -> locale_exit=0
    Claves en en.default.json:        434 hojas
    Claves en en.default.schema.json: 500 hojas
    Sin resolver en storefront:     0
    Sin resolver en schema:         0
    Construidas en runtime:         0  <- no verificables por ningun linter
    Huerfanas en storefront:        0
    Huerfanas en schema:            0
$ node scripts/json-validate.mjs              -> json_exit=0
$ node scripts/dataset-hooks.mjs              -> hooks_exit=0
$ node scripts/ledger-verify.mjs              -> ledger_exit=1
    Filas de requisito: 60
       50  cumplido
       10  código completo
    Incoherencias: 1 { localizador: 1 }
      [localizador] línea 84: sections/newsletter.liquid:1-105: fuera de rango, el archivo tiene 104 líneas
$ (misma orden sobre git archive de cada commit)
    eb7cca7 ledger_exit=0 / a6a9074 ledger_exit=0 / c81cbcb ledger_exit=0 / 64862d1 ledger_exit=0
$ TMPDIR=… bash c08_complexity.sh .           -> sections/featured-product.liquid 110 / sections/main-product.liquid 120
```

LiquidComplexity: no hay ningún aviso. `main-product.liquid` sigue en 120, el máximo del preset. El aviso de 122 (HX-1) lo resolvió la v2 de C-08 al fusionar ramas. `CLAUDE-CLOUD-STATUS.md` todavía lo da como pendiente (P3-C).

**Causa de `ledger_exit=1` (P2-A).** `git diff 64862d1 fe736f7 -- sections/newsletter.liquid` muestra que C-08b quitó el `default` de `text` (N2-2, autorizado). El archivo pasa de 105 a 104 líneas, y la fila 84 del ledger cita el archivo entero como `:1-105`. Ni la directiva ni el informe ni la revisión de C-08 ejecutaron `ledger-verify` (`grep -n ledger-verify` en los cuatro documentos de C-08 no da nada). `package.json` encadena `gates:static` como `json → hooks → sanity → locales → ledger → theme-check → syntax → package`, así que la cadena se corta en `gates:ledger`. El código del tema no está afectado.

## 2.1 Harness entregados contra HEAD (¿siguen pasando tras C-08?)

```text
$ node harness-a01.mjs <ra/head> fix          (copia literal de harness-A-01-B-02-001/harness.mjs)
    PASS H-23 [pdp] ocurrencias de atributos clave: Liquid real = HTML traducido :: [... name="id" 2/2, data-no-js-control 2/2, no-js-only 2/2, js-only 2/2, data-selling-plan-input 1/1, data-variant-id 2/2]
    PASS H-23 [featured] ... (mismos conteos)
    MODO=fix total=56 pass=56 fail=0
    FALLAN: []
    exit=0
$ diff harness-A-01-B-02-001/salida-fix.txt a01-fix-head.txt  -> sin diferencias (IDENTICAL_TO_DELIVERED)

$ node harness-A-03-001/focus-contrast.mjs assets/base.css config/settings_data.json --label "DESPUES (A-03)"
    filas=810 fallos=0 / fallos_por_control={} / combinaciones_estilo_esquema_con_fallo=0 / fallos_con_reduce=0
    ratio_minimo_controles_objetivo=7.58
$ diff after.txt a03-after-head.txt           -> AFTER_IDENTICAL
$ … --rules --label "DESPUES (A-03)"          -> RULES_IDENTICAL (frente a rules-count.txt:5-8)
$ … <base.css de eb7cca7> … --label "ANTES (eb7cca7)" -> BEFORE_IDENTICAL (filas=810 fallos=91)
```

Límite del harness de A-01/B-02: traduce el Liquid a mano. Que siga en 56/56 tras C-08 prueba que `assets/theme.js` y el script en línea de `layout/theme.liquid` (que lee de HEAD) no cambiaron. También prueba que los conteos H-23, leídos del Liquid real de HEAD, cuadran. La parte de Liquid que tocó C-08 se revisó a mano en §3.1.

## 2.2 Verificador de C-08 (fase b) y barrido

```text
$ sha256sum c08a_apply.py c08b_apply.py c08_verify.py c08_grep.sh c08_complexity.sh   (extraídos con §1.4 de la directiva)
    f4aba7a7…1709  6b029845…0554  21312b3b…777e  ce012a43…0981  4ca494f3…138d   (los cinco de v2)
$ python3 -I c08_verify.py . b    -> C08_VERIFY_OK fase=b plantillas_revisadas=28   verify_b_exit=0
$ python3 -I c08_verify.py . a    -> C08_VERIFY_FAIL (25 líneas «estado intermedio»)  verify_a_exit=1   [control negativo esperado]
$ bash c08_grep.sh . | wc -l      -> 35
$ (tabla uniq -c de §5.2 paso 4) frente a §5.3 «Tras C-08b»  -> SWEEP_TABLE_MATCH (23 líneas de tabla)
$ grep -rnE "delivery_fallback|returns_fallback|contact\.services\.response|reason_appointment" templates listings sections snippets layout config locales | wc -l  -> 0
```

## 2.3 Greps de A-02 sobre HEAD

```text
--V1   (metafields en los dos snippets)                              exit=1, sin salida
--V2   (las 14 fuentes en todo el tema)                              exit=1, sin salida
--V3   metafields.(custom|sartorial). en el tema                     snippets/cart-drawer-recommendations.liquid:80 (única)
--V4   metafields|metaobject en snippets + main/featured + variant-no-js-select   exit=1, sin salida
--V5   heurísticas H1-H8                                             exit=1, sin salida
--V5b  lectores sustitutos de product                                exit=1, sin salida
--V6   'default:' añadidos en los dos snippets, eb7cca7..fe736f7     0
blobs F1/F2 en fe736f7: 68354c31e7357f40bdf1385fa1916013cc1fa756 / 2a624b236b5c31242fd3b6c042894196afb6baa7 ; git diff --stat a6a9074 fe736f7 -- <snippets> vacío
F3_HEAD provenance_notes='' bloque_igual=True      (Archive home, frente a a6a9074)
F4_HEAD siete_info_iguales=True                    (en.default.schema.json, frente a a6a9074)
```

Los bloques empaquetados `technical_specs`/`provenance` siguen vacíos o en `not_assessed` en `listings/archive` (product e index) y `listings/imprint` (product e index). Los lectores externos al alcance se conservan: V3 y `sections/product-recommendations.liquid`, que el lote no toca.

# 3. Interacciones cruzadas

## 3.1 A-01/B-02 × C-08 en las secciones de producto

- `git diff 64862d1 fe736f7 -- sections/main-product.liquid sections/featured-product.liquid`: el único hunk de cada archivo es la fusión `when 'shipping_lead_time', 'trust_badges'`. Está en `main-product.liquid:675-692` y `featured-product.liquid:420-437`.
- C-08 no toca el formulario, el `render 'variant-no-js-select'`, el hidden `id`, `data-no-js-control` ni el select de planes. H-23 lo confirma con los conteos reales.
- Corrección de la rama fusionada:
  - Los iconos son disjuntos: `shipping_lead_time` usa `none/truck/clock` y `trust_badges` usa `none/shield/ruler`, en los dos schemas. La cadena `if/elsif` única pinta el mismo icono que antes.
  - `delivery_text | default: returns_text | strip` toma el setting propio de cada tipo, porque el otro no existe en ese bloque.
- Plantillas: C-08 no cambia ningún bloque `variant_picker`/`buy_buttons` ni los settings de las secciones `main-product`/`featured-product` en las ocho plantillas de producto y home. Solo cambian `shipping_lead_time`, `trust_badges`, `composition_care`, la eliminación de `shipping_returns` y `block_order`.
- Complejidad conjunta: 120 y 110 (§2). Sin regresión.

## 3.2 A-02 × C-08 en Archive y locales

- `listings/archive/templates/index.json`: C-08 cambia 43 líneas, pero el bloque `provenance` del producto destacado es idéntico al de a6a9074 (`provenance_notes` vacío).
- `locales/en.default.schema.json`: C-08 cambia solo los dos `info` de `delivery_text`/`returns_text` («Leave blank to hide this block.»). Los siete `info` de F4 son iguales a los de a6a9074.
- C-08 no toca los snippets de A-02.

## 3.3 A-03 × resto en `assets/base.css`

- `git diff --stat c81cbcb fe736f7 -- assets/base.css config/settings_data.json` está vacío. Después de A-03 solo cambia `layout/theme.liquid` (A-01/B-02), que no participa en el harness.
- El `<select>` nativo de B-02 cae en `html[data-motion-style='technical'|'heritage'] select:focus-visible` (`base.css:9107`, `:9131`). Ese es el control `select` del harness, con 0 fallos.
- El cambio `js`/`no-js` de S-5 no afecta a las reglas de foco, que dependen de `data-motion-style` y `prefers-reduced-motion`, no de la clase `js`.
- `.js .no-js-only` y `.no-js .js-only` existen (`base.css:5653-5654`).
- C-08 deja CSS sin uso (`.main-contact__response-note`), ya inventariado en §7.3 de su directiva. No es una regresión.

Conclusión: no hay ninguna regresión cruzada en el código. La única regresión de integración es documental (P2-A).

# 4. Empaquetado

```text
$ node scripts/package-theme-zip.mjs --rev fe736f7 --out …/scratchpad/ra/lote-a.zip
rev:      fe736f7 -> fe736f7b6bd66981b6acb94728072424993c321d
fecha:    1793835003 (2026-11-04T23:30:03.000Z), DOS UTC con floor a 2 s
archivos: 94
tamano:   283635 bytes
sha256:   8f666379137325873e09f5fce321b66149112bff015e8f20027e35dc9350d5f6
contenido: 2afbc7a849583f0bf0adfbc0312219dd1c000bb4e87f2d775e9996efeb78c4f5 (huella independiente de zlib)
zlib:     1.3.1-e00f703 (node 22.23.4)
$ (segunda generación en lote-a-2.zip) ; cmp     -> BYTE_IDENTICAL (mismo sha256)
$ (misma orden con --rev eb7cca7)                 -> archivos: 93 / sha256 f001627e…e585 / contenido 02bd3bc8…df34  (= BOARD.md:42,73)
$ comparación de contenidos (python zipfile)
    solo_en_HEAD ['snippets/variant-no-js-select.liquid'] / solo_en_eb7 [] / cambiados 33 / distintos_de_blob_git 0
```

Los 33 cambiados son la unión de los archivos de tema de las cuatro tareas: base.css, theme.js, layout, los 9 `listings/*`, 3 locales, 13 secciones (incluido `header-group.json`), 2 snippets de A-02 y 5 plantillas de `templates/`. Theme Check inspecciona 93 (91 `.liquid`/`.json` + `package.json` y `package-lock.json`). El ZIP lleva 94 (esos 91 + `base.css`, `theme.js` y `product-zoom.js`). Las cifras son coherentes. El hash canónico de D21 cambia, como se esperaba. El candidato final se fija en R-G, no aquí.

# 5. Ledger

| Línea | Fila | Estado en HEAD | Lo que movió el lote | Propuesta de esta R-A |
| --- | --- | --- | --- | --- |
| 48 | Contraste no-texto ≥ 3:1 | `código completo` | A-03 (c81cbcb), con nota | Sin cambio. Pasa a `cumplido` solo con la medición de Claude en previews de Imprint y Archive (solo credenciales). |
| 49 | Teclado e indicador de foco | `código completo` | A-03 (c81cbcb), con nota | Igual que la 48. |
| 69 | Selector de variantes | `código completo` | B-02 (64862d1), con nota | Sin cambio. `cumplido` solo con la prueba B-02 en tienda (solo credenciales). |
| 71 | Planes de venta | `código completo` | A-01 (64862d1), con nota | Sin cambio. `cumplido` solo con el fixture C-R0-4 y credenciales. |
| 88 | Capa de confianza en PDP | `cumplido` | Nada (C-08 no edita el ledger) | **Pasa a `código completo` (CR-2).** |
| 84 | Formulario de newsletter | `cumplido` | Nada; su localizador quedó roto por C-08b | Sin cambio de estado; corregir el localizador (CR-1). |
| A-02 | — | — | — | No hay fila de A-02: así lo deciden la directiva §6 y la R-D (PD-4 y PD-5). Las filas 22, 109 y 111 no cambian de estado. |

**Decisión sobre la fila 88.** La R-D de C-08 (Q-5) condicionaba el paso a `código completo` a que R-A aceptara C-08b. Esta R-A acepta C-08b en lo estático (§2.2 y §3.1). Además, la evidencia `cumplido` que cita la fila (certificación Couture #165809488115, «acordeones y mensajes bilingües») ya no describe el código de HEAD, por tres motivos:

- los bloques de entrega y devoluciones con texto vacío no se renderizan;
- las cuatro plantillas de producto empaquetadas los dejan vacíos y quitan el acordeón `shipping_returns`;
- el copy de `in_stock` cambia.

Mantener `cumplido` sería afirmar una medición que no cubre el comportamiento actual. Esperar a la parte de tienda no aporta nada: esa prueba es justo la que llevará la fila de vuelta a `cumplido`. Es una bajada de estado ordenada por una R-D y por una decisión de Johandry (D26), no un refactor de fila verde (RULES §3.9).

# 6. Lo que queda para la parte de tienda de R-A

Todo se hace solo con temas no publicados en `tema-qkqpke0j` (D13), con viewport verificado y etiquetado «tienda». Claude mide personalmente el foco, el teclado y axe (plan §5.2).

**Solo con credenciales (incluye subir las previews de Imprint y Archive, C-R0-3):**

1. A-03: matriz de foco por preset, `motion_style`, control, estado, esquema y fondo sólido o con imagen, con `reduce` y `no-preference`. Cubre header, contenido y footer, incluido el footer `scheme-2`, con medida y captura. Cierra las filas 48 y 49.
2. B-02 (informe A-01/B-02 §8, puntos 1-5):
   - sin JS: cargar A, elegir B y ver que el payload envía B;
   - `?variant=` disponible y agotada;
   - combinación agotada en multiopción;
   - `theme.js` bloqueado;
   - `?variant=` en el producto destacado;
   - recarga en Firefox;
   - Buy it now tras cambiar de variante;
   - móvil simulado.
   La línea real de carrito solo con autorización de mutación (plan §4.1). Cierra la fila 69.
3. A-02, pruebas R-A 1-8 (directiva §5.4, más M-8 7-8 recogidas en el informe `:557-558`):
   - `circa_year` y `gsm` en un producto textil y otro no textil, con dato y vacío;
   - las 14 claves ignoradas;
   - sin «Solid milled brass» ni el tipo mostrado como material;
   - Archive home sin bloque de procedencia;
   - PDP y producto destacado en escritorio y móvil;
   - 120 o más caracteres sin espacios a 390 px;
   - especificaciones con solo `heading`: nada en la tienda ni en el editor.
4. C-08:
   - render de los bloques de entrega y devoluciones vacíos (ocultos) en PDP y destacado;
   - `<dl>` vacío del contacto (P3-5 de su revisión);
   - destinos reales de los CTA neutralizados y títulos de colección (AR-08 «Restored Pieces»);
   - formulario de contacto con 4 motivos.
   Cierra la fila 88.

**Credenciales + fixture C-R0-4 (Johandry):**

5. Matriz A-01 completa en PDP y destacado, con JS, sin JS y con JS fallido:
   - payload real;
   - `selling_plan=` vacío y combinación inválida sin JS;
   - Buy it now tras cambiar de plan;
   - destacado con `?selling_plan=`;
   - residuo PD-2 (`purchase-option-*` / `featured-purchase-option-*` ignorados por Shopify);
   - móvil.
   La línea de carrito solo con autorización. Cierra la fila 71.

**Credenciales + escritura fuera de D13 (requiere a Johandry):**

6. P2-1 de C-08:
   - 58 entradas de `scripts/translations/es.storefront.json` quedan obsoletas;
   - el `--check` (sin red, `env -i`) pasa de «check: 8 problemas» (64862d1) a «check: 66 problemas» (HEAD), exit 1 en ambos;
   - hay que revisar `/es` en cada demo tras subir el candidato (dueño D-01-L/R-A);
   - registrar traducciones en las demos es una escritura en tienda que D13 no cubre.

# 7. Hallazgos

| ID | Prioridad | Dónde | Hallazgo | Acción |
| --- | --- | --- | --- | --- |
| P2-A | P2 (nuevo, integración; no es P0/P1) | `docs/requirements-ledger.md:84`; `sections/newsletter.liquid` (104 líneas) | `ledger-verify` da exit 1 en HEAD por el localizador `:1-105`. Lo introduce `fe736f7` (C-08b, N2-2). `gates:static` queda en rojo. | CR-1 (§8). En las directivas de lotes futuros que cambien el número de líneas de archivos citados, incluir `ledger-verify` en la lista de compuertas. |
| P3-A | P3 | Ledger, filas 32, 34, 38, 50, 54, 56, 57, 66, 67, 69, 71, 72, 76, 79, 81-84, 87 y 88 | Deriva de localizadores: A-01/B-02 inserta 14 líneas en `theme.js` (desde unas `:573`/`:629`) y 12 en `main-product.liquid` (desde `:23`). Las líneas citadas ya no apuntan a lo mismo; por ejemplo, la «validación reactiva» de la fila 71 estaba en `theme.js:733-742` y ahora está en `:747-756`. `ledger-verify` solo detecta los rangos fuera del archivo. La fila 53 (`main-contact.liquid:38-75`, cuyas etiquetas están en `:79+`) ya estaba desfasada antes del lote. | Refrescar los localizadores al editar cada fila, con nombre de función o selector (RULES §4.4). No bloquea. |
| P3-B | P3 (proceso) | `CLAUDE-DIRECTIVA-A-02-001.md:5`, `CLAUDE-DIRECTIVA-A-01-B-02-001.md:5` | Están versionadas en «Borrador para R-D», sin los cambios M-1 a M-9 / C-1 a C-8 de su R-D ni una nota que lo diga. A A-03 se le añadió esa nota (M-1) y C-08 tiene v2. Las pruebas M-8 7-8 de A-02 solo aparecen en el informe. La trazabilidad se sostiene porque los informes declaran que aplicaron la R-D y las revisiones lo comprobaron. | Añadir la misma nota de una línea que tiene A-03 al cerrar el lote. |
| P3-C | P3 (estado vivo) | `docs/decisions.md` (llega hasta D24, `:234`); `agent-comms/BOARD.md:63`; `CLAUDE-CLOUD-STATUS.md` («Aviso: … 122») | D25 y D26 no están en `docs/decisions.md` (AGENTS.md). El BOARD no refleja el Lote A. El STATUS mantiene el aviso de complejidad 122, que ya está resuelto (120). | Actualizar al cierre del lote. |
| P3-D | P3 (higiene) | `CLAUDE-REPORT-A-03-001.md:134,145`; `CLAUDE-REPORT-C-08-001.md:183`; `CLAUDE-REVIEW-A-03-001.md:63` | `git diff --check eb7cca7 fe736f7` da 4 espacios finales, solo en `agent-comms/`. En los archivos de tema, exit 0. | Opcional. |
| P3-E | P3 (proceso) | D25 / revisión A-01/B-02 §6 | El snippet de Nivel 2 se escribió en el árbol antes de que Johandry lo autorizara; se hizo commit después. Ningún commit contiene un Nivel 2 sin autorizar. | Ninguna. Que conste para B-D: pedir la autorización antes de escribir. |

Hallazgos abiertos del lote, heredados y sin cambio de prioridad:

- **H-1 de A-03** (P2, fuera del plan). El texto en hover de `.button` en heritage está entre 2.25 y 2.76:1 (Archive). Su consecuencia **R-2** es que la fila 47 (1.4.3, `cumplido`) queda contradicha en Archive. La R-D de A-03 propuso `no verificado` en la misma decisión que abra H-1. Ambas están pendientes de Johandry.
- **H-2 a H-4 y R-1 de A-03** (P3).
- **H-3 de A-02** (P3): la redacción «Shown as entered» se pule en el Lote C.
- **C-04-R**: aviso del retiro de metafields en `release-notes.md`. Es una dependencia abierta de A-02 y su condición (d).
- **Residuo PD-2** de A-01/B-02: §6, punto 5.
- **P2-1 de C-08**: §6, punto 6.
- **P3-5 a P3-7 de C-08**:
  - `<dl>` vacío en el contacto;
  - bloque vacío invisible en la vista previa del editor;
  - `strip`.
- **Extras de §7.3 de C-08**: CSS sin uso y texto instructivo en `templates/page.about.json:11`.
- **P3 opcionales de gate5** (del STATUS), antes de su primer uso en tienda.

No hay ningún P0 ni P1 nuevo.

# 8. Veredicto

**ACEPTADO CON CAMBIOS.** El código de A-01, A-02, A-03, B-02 y C-08, integrado en `fe736f7`, se acepta en lo estático tal cual. Los cambios exigidos son solo del ledger y van en un commit del coordinador:

- **CR-1 (P2-A).** En `docs/requirements-ledger.md:84`, sustituir `` `sections/newsletter.liquid:1-105` `` por `` `sections/newsletter.liquid:1-104` ``. Opcionalmente, añadir a la evidencia: «C-08 (lote-a): copy neutralizado y default de `text` retirado; el estado no cambia».
- **CR-2 (fila 88).** En `docs/requirements-ledger.md:88`, cambiar `` `cumplido` `` por `` `código completo` `` y añadir a la evidencia: «C-08 (lote-a): `shipping_lead_time` y `trust_badges` en una sola rama, ocultos con texto vacío (`sections/main-product.liquid:675-692`, `sections/featured-product.liquid:420-437`); copy de `in_stock` neutralizado; la certificación Couture no cubre este comportamiento; pendiente prueba R-A en preview (solo credenciales)». En la cabecera, cambiar `50 cumplido | 10 código completo` por `49 cumplido | 11 código completo`.
- **Comprobación.** CR-1 y CR-2 (las tres sustituciones, con `assert count == 1`) se aplicaron a una copia: `ledger-verify` → «49 cumplido / 11 código completo», «Incoherencias: 0», exit 0. El texto de evidencia no afecta a la compuerta.

Tras CR-1 y CR-2 no hace falta otra R-A estática: basta con pegar la salida de `ledger-verify` con exit 0. La parte de tienda de R-A (§6) sigue pendiente de credenciales y, para A-01, del fixture C-R0-4. Hasta entonces, el estado máximo de las cinco tareas es «código completo» (D22). No bloquea el inicio del Lote B en código (D9). Sí bloquea, como dice el plan, declarar `cumplido` ninguna fila del lote.

# 9. Compuerta del literal

Se usó `ra/tools/count-ra.py`, una copia adaptada de `count-two.py`. Deriva el literal solo en memoria e imprime únicamente `ruta=N`. El argumento `DIFF:a..b` cuenta sobre la salida de `git diff`. Desde la raíz del repositorio:

```text
$ python3 -I ra/tools/count-ra.py DIFF:eb7cca7..fe736f7 ra/lote-a.zip
git diff eb7cca7..fe736f7=0
…/scratchpad/ra/lote-a.zip=0
zip_contenido_descomprimido= 0        (94 entradas descomprimidas, mismo método)
```

El recuento sobre este archivo y la salida de `ctx-check` se ejecutan después de escribirlo y se añaden abajo. Añadirlos no altera el recuento.

```text
$ python3 -I ra/tools/count-ra.py agent-comms/outbox-claude/CLAUDE-REVIEW-LOTE-A-RA-001.md
agent-comms/outbox-claude/CLAUDE-REVIEW-LOTE-A-RA-001.md=0
$ python3 -I scratchpad/ctx-check.py        (desde la raíz del repositorio)
./tests/vendor/axe.min.js lineas_literal_contexto= 1
total_lineas_literal_contexto= 1
fuera_de_tests_vendor_axe= 0
$ git status --short
?? agent-comms/outbox-claude/CLAUDE-REVIEW-LOTE-A-RA-001.md
```

# 10. Verificación de CR-1/CR-2 y documentación

Revisado: `git diff HEAD` sobre `fe736f7`, sin commit. Seis archivos modificados: `docs/requirements-ledger.md`, `agent-comms/BOARD.md`, `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`, `docs/decisions.md`, `CLAUDE-DIRECTIVA-A-02-001.md` y `CLAUDE-DIRECTIVA-A-01-B-02-001.md`. Este revisor no escribió el BOARD (D24). Todo es de solo lectura, salvo esta adenda.

```text
$ node scripts/ledger-verify.mjs            (árbol de trabajo)
    49  cumplido / 11  código completo / 0 no verificado / 0 ausente
    Incoherencias: 0        exit=0
$ python3 -I ra/tools/count-ra.py <6 archivos> CLAUDE-REVIEW-LOTE-A-RA-001.md DIFF:HEAD
    docs/requirements-ledger.md=0  agent-comms/BOARD.md=0  agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md=0
    docs/decisions.md=0  CLAUDE-DIRECTIVA-A-02-001.md=0  CLAUDE-DIRECTIVA-A-01-B-02-001.md=0
    CLAUDE-REVIEW-LOTE-A-RA-001.md=0  git diff HEAD=0
$ python3 -I scratchpad/ctx-check.py        -> fuera_de_tests_vendor_axe= 0
$ git branch --list 'lote*'                 -> * lote-a / lote0/base-09f8342   (lote-b aún no existe)
```

**CR-1 y CR-2: correctos.**

- La fila 84 cita `:1-104`.
- La fila 88 pasa a `código completo` y suma la evidencia `main-product.liquid:675-692` y `featured-product.liquid:420-437`. Comprobé los dos rangos: empiezan en la rama `when` fusionada y terminan en su `endif`.
- La cabecera dice 49/11.

**Fila 88: la certificación antigua no se quita; se marca como histórica.** Quitarla borraría evidencia que fue real en su momento (es el mismo criterio que C-04-P3 aplica al ledger). Dejarla como está deja una fila `código completo` que se apoya en un «Certificado en tienda real» que ya no cubre el código. Cambio exacto (aplicado a una copia completa de HEAD: `ledger-verify`, 0 incoherencias, exit 0):

- Antes: `` Certificado en tienda real Couture #165809488115 (`GPT-AUDIT-011`): layout 2 columnas ``
- Después: `` Certificación histórica, anterior a C-08 y que no cubre el comportamiento actual de los bloques de entrega y devoluciones (Couture #165809488115, `GPT-AUDIT-011`): layout 2 columnas ``

Opcional, dentro de P3-A: el localizador de la fila 88 `assets/theme.js:2375-2387` ya era impreciso antes del lote. Apuntaba a la cola de `handleAddSubmit` y a `handleDrawerClick`, no al anuncio de carrito, y además se desplazó 14 líneas. El anuncio está en la región `[data-cart-status]` de `CartDrawer` (`announceRemoval`, `assets/theme.js:3231`).

**BOARD.**

Correcto y con fuente:

- los commits de las cuatro tareas;
- el estado «código completo» con revisión aceptada;
- R-A ACEPTADO CON CAMBIOS y la salida de `ledger-verify` (reproducida arriba);
- el ZIP: 94 archivos, `8f666379…d5f6` / `2afbc7a8…c4f5` (§4), del `fe736f7`. El commit documental no toca rutas empaquetadas, así que el hash del ZIP no cambia;
- los pendientes, remitidos por dependencia a §6;
- D25 y D26 en las fuentes.

Dos cambios exactos:

1. En la fila del Lote A, cambiar «H-1 de A-03 (P2, fuera del plan; decide Johandry)» por «H-1 de A-03 (P2, fuera del plan; contradice la fila 47 del ledger, hoy `cumplido`; decide Johandry)». La fila 47 es el único hallazgo abierto que afecta a un `cumplido` y el STATUS ya lo nombra.
2. En la línea `Rama:` de la cabecera, cambiar «HEAD fe736f7 más los cambios de la R-A» por «último commit de código fe736f7; más el commit documental de la R-A». Así no queda falsa en cuanto se haga el commit.

**STATUS.** Correcto.

- Retira el aviso 122, que ya está resuelto, y el pendiente de la fila 88, que ya se hizo.
- Añade la fila 47 a H-1, el P3 de localizadores y la nota de D13 sobre P2-1.
- Las cifras del ZIP coinciden.
- Un ajuste exacto: en «En curso», cambiar «rama `lote-b` desde `lote-a`» por «rama `lote-b` por crear desde `lote-a`». `lote-b` todavía no existe.

**`docs/decisions.md`.**

- D25 es fiel a `CLAUDE-DECISION-A-01-B-02-001.md`, incluidas la cifra 120→128 (`:9`) y el alcance «solo ese snippet».
- A D26 le falta el límite de alcance del registro (`CLAUDE-DECISION-C-08-001.md:18-19`). Cambio exacto: añadir al final de la línea D26 «Solo esos tres cambios; D26 no amplía D11 a otras tareas.».

**Directivas.** «Aprobada con cambios por CLAUDE-REVIEW-…-RD-001; donde difieran, manda la R-D» es exacto según los veredictos de las dos R-D y cierra P3-B. La línea «Decisión requerida» sigue en el texto previo a la R-D. Es aceptable, porque el nuevo `Estado:` la supera.

**Veredicto de esta adenda: ACEPTADO CON CAMBIOS MENORES.** Son cinco cambios exactos y todos de texto:

1. fila 88 marcada como histórica;
2. BOARD, fila 47;
3. BOARD, línea `Rama:`;
4. STATUS, «por crear»;
5. decisions.md, alcance de D26.

No hace falta otra revisión: basta con volver a ejecutar `node scripts/ledger-verify.mjs` (exit 0) y la compuerta del literal sobre los seis archivos antes del commit.
