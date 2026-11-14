```text
ID: HANDOFF-SESION-NUEVA-20261114
Estado: ENTREGADO, actualizado a HEAD f81774e tras REVIEW-DOCS-20261114-001 (runbook para una sesión nueva de Claude sin contexto; no se ejecutó nada en tienda)
Decisión requerida: Johandry: definir las 3 variables de entorno y los pendientes de §5 antes del paso 1 de §4.
Resumen en 5 líneas:
  1. La tienda nueva sartorial-theme-kvkzl39t tiene catálogo (24 del kit y 24 de Imprint/Archive), colecciones, páginas, menús, blog y 3 temas UNPUBLISHED subidos. Faltan imágenes y todas las pruebas.
  2. §2 recoge las autorizaciones vigentes (D29 a D39 en docs/decisions.md) y el criterio de corridas diagnósticas en la tienda nueva.
  3. §3 es el arranque de solo lectura y §4 los pasos ordenados: correcciones de datos, export y subida (ya hechos para las 3 previews), identidad, imágenes, pruebas, Lighthouse, C-02/C-05 y ZIP.
  4. Cada paso indica el modelo que lo hace, un revisor distinto y la evidencia que hay que guardar.
  5. §6 define «terminado» como G1 a G4 más las filas del ledger con evidencia de tienda, y dice qué no bloquea.
Archivos tocados: solo este archivo (nuevo; reescrito el 2026-11-14 contra f81774e).
Desviaciones (Nivel 1 o Nivel 2): ninguna. Sin comandos de Shopify, sin MCP, sin red, sin commit ni push, sin abrir .secrets.
Hallazgos extra fuera de alcance: H1 resuelto (las rutas de run.mjs van por tienda en stores.json). H2 harness-GPT-RD-001/run.mjs:12-23,234 sigue fijado a tema-qkqpke0j. H3 la fila 116 del ledger dice `cumplido` con demos antiguas: no vale como evidencia de G1 en la tienda nueva.
Verificación (comando, resultado y qué demuestra/qué no): lectura local con git status/log, grep y node -e sobre created-*.json; ver §7. No demuestra ningún estado de la tienda posterior a los registros created-*.json.
Lista de afirmaciones falsables numeradas: §7.
```

## 1. Contexto

1. Proyecto: el tema Shopify «Sartorial» (Ruiz Digital) con 3 presets: Sartorial, Imprint y Archive (`listings/<preset>/`). Versión 1.0.0 (`config/settings_schema.json:6`). Va a la Theme Store.
2. Rama `lote-e-claude`. HEAD `f81774e` (comprobar con `git log`): el parche de `run.mjs`, `selftest.mjs`, `stores.json` y `created-*.json` están commiteados. `run.mjs` usa `--store=` y `stores.json`; `run-b02.mjs` sigue anclado a la tienda antigua (`D28_STORE`, línea 32).
3. Tienda nueva: `sartorial-theme-kvkzl39t.myshopify.com`. La antigua, `tema-qkqpke0j`, queda fuera de alcance (D38).
4. Verificado en el Admin (REVIEW-STORE-STATE-001, 2026-11-14): 24/24 productos del kit (21 ACTIVE y 3 DRAFT: `test-1-variant`, `test-250-variants`, `test-252-variants`). IDs en `docs/demo-store/created-products.json`. Además hay 24 productos de Imprint/Archive (9 ACTIVE y 15 DRAFT; `created-products-imprint-archive.json`), que incluyen los 9 handles que faltaban en REVIEW-THEMES-UPLOAD-001 C1/C2; no tienen imágenes.
5. Las variantes, precios, compare-at y el inventario coinciden con `products.csv`. El stock está solo en «Shop location», 8 por variante, y `serra-coat` Camel/M tiene 0 con DENY.
6. Hay 11 colecciones por tag. `empty-test` tiene 0 productos, `single-product-test` tiene 1 (`cashmere-scarf`) y `test-fixtures` no está publicada.
7. Páginas `about`, `contact` y `faq`; menús `main-menu` y `footer`; blog `news` con 3 artículos (`docs/demo-store/created-content.json`).
8. Políticas: solo existe Privacy, con título en español y el email personal del dueño. Faltan Refund, Shipping y Terms (C1 y C3 de REVIEW-STORE-STATE-001), así que 3 enlaces del footer dan 404. Son tarea manual de Johandry (§5).
9. Sobra lo siguiente: las colecciones de ejemplo `frontpage`, `automated-collection` y `hydrogen` están publicadas en el canal Online Store (C2; retirada manual de Johandry, §5), y `gift-card` tiene el vendor «Snowboard Vendor» (O1).
10. Hecho en el repo sin tienda: los arreglos de 2026-11-14 (REVIEW-FIXES-20261114-001/002), el kit `docs/demo-store/` y las decisiones D29 a D39.
11. Hecho: hay 3 temas UNPUBLISHED (Preview sartorial `190300356912`, Preview imprint `190300455216` y Preview archive `190300422448`, nombres «Preview <preset> 2026-11-14»), subidos como ZIP con `stagedUploadsCreate` + `themeCreate` desde `exports-76dd94d` menos 4 rutas (82 archivos; `docs/demo-store/created-themes.json`, REVIEW-THEMES-UPLOAD-001). `stores.json` ya los registra. El tema MAIN de la tienda es `test-data` (`190299111728`) y NO se toca. **Las previews no tienen imágenes todavía**: 0 medios de producto y 0 imágenes de sección.
12. GPT genera las imágenes según `agent-comms/inbox-gpt/CLAUDE-TO-GPT-IMAGENES-DEMO-001.md`: 68 de producto, 8 de colección y 48 de sección. Orden emitida; la entrega `agent-comms/outbox-gpt/GPT-IMAGENES-DEMO-001.md` no existe todavía. La orden cubre el kit, no las fotos de producto de Imprint/Archive.
13. NO hecho: ninguna prueba en la tienda nueva (R-A, R-B, A-01, B-02, C-07, D-02, estados degenerados, Lighthouse, C-02/C-05).
14. Evidencia antigua (tienda vieja, `cb20d86`): R-A 132 checks con 0 failed (REVIEW-RA-READONLY-001) y R-B con 6/6 checks pero scope failed por el harness (REVIEW-RB-CART-001). No sirve para cerrar filas aquí.
15. Ninguna fila del ledger se cerró desde 2026-11-11.
16. Revisión visual (screenshots con `theme_screenshot`, observación de la sesión del 2026-11-14, sin JSON de resultado en el repo; límite de ~3-4 llamadas por minuto, con 429 y reintento a los 60 s). Hallazgos P2: colección vacía con tarjeta promo (corregido en el árbol de trabajo, pendiente de commit y de subida), contraste del placeholder del newsletter y título largo.

## 2. Reglas vigentes y límites

- Lectura obligatoria: `AGENTS.md`, `agent-comms/RULES.md` (cabecera §1.4, 4 estados de §5, adversarial §4.7) y `docs/decisions.md` §2026-11-14 (D29 a D39).
- Escritura en la tienda nueva (D38):
  - Permitido: productos, colecciones, páginas, menús, blog e inventario; archivar productos de ejemplo; subir temas **sin publicar**. Las políticas y la retirada de colecciones de ejemplo del canal NO son de Claude: las hace Johandry a mano (§5).
  - Prohibido: publicar o borrar temas, instalar o configurar apps, crear o modificar metafields, y tocar `tema-qkqpke0j`.
- Carrito autorizado en previews no publicadas, con limpieza verificada en `finally` (D30). El carrito huérfano T-2 de la tienda antigua se deja caducar.
- Lighthouse lo mide Claude en el contenedor: 3 repeticiones, mediana, por preset y por página (home, colección y producto). Es una medición aproximada. Umbral: media móvil ≥60 (D31).
- C-01 diferido y fuera del envío (D33). Versión 1.0.0 y `release-notes.md` en borrador pendiente de aprobación (D29).
- Parche de `run.mjs` autorizado por Johandry (D32). SHA-256 final de `run.mjs`: `5c03c13957dfd0fef8fd241f89f44d8b471da20819162e10438ed55d578a2bc1` (D32, commit `f81774e`), igual al `D28_RUNNER_SHA256` de `run-b02.mjs:29`. Cualquier cambio de `run.mjs` exige otra re-aceptación.
- Corridas diagnósticas:
  - Las 5 autorizadas eran para la tienda antigua y se usaron 4. La quinta **no se transfiere**: la tienda antigua quedó fuera de alcance (D38).
  - **Decisión de este runbook:** en la tienda nueva el contador empieza de cero. Se apoya en la autorización expresa de Johandry en la conversación del 2026-11-14 («autorizo todo lo que necesites», registrada en D38) y en D30.
  - Límite que fija Claude como líder: hasta 5 corridas por modo de harness (R-A, R-B, B-02 y RD) y preset. Cada fallo exige diagnóstico escrito antes de repetir y nunca se repite en bucle.
  - Las reglas D10 y D28 siguen vigentes: si hay 429, credencial rechazada o un carrito inicial no vacío, se detiene la corrida.
- Seguridad:
  - No abrir `.secrets` ni imprimir valores.
  - Antes de cada commit, contar 0 apariciones de `$STOREFRONT_PASSWORD` y `$SHOPIFY_CLI_THEME_TOKEN` con `grep -cF` sobre los archivos nuevos, sin mostrar el valor.
  - Un comando de Shopify cada vez, nunca en paralelo. Nunca `--publish`, `--live` ni `--allow-live`.
  - Commit y push solo en `lote-e-claude`, sin force.
- Modelos:
  - Opus: análisis, decisiones y revisión adversarial.
  - Sonnet: implementación, parches de harness y ejecución de pruebas.
  - Haiku: lecturas acotadas (listar IDs, contar archivos, extraer campos de JSON).
  - Quien ejecuta no revisa su propio resultado (RULES §4.7).

## 3. Checklist de arranque (solo lectura; Haiku ejecuta y Opus valida)

```bash
cd /home/user/Tema-Shopify && git status --short && git log --oneline -5        # HEAD esperado: f81774e o posterior
for v in SHOPIFY_CLI_THEME_TOKEN STOREFRONT_PASSWORD SHOPIFY_FLAG_STORE; do [ -n "${!v}" ] && echo "$v=definida" || echo "$v=FALTA"; done
[ "$SHOPIFY_FLAG_STORE" = "sartorial-theme-kvkzl39t.myshopify.com" ] && echo store-ok || echo STORE-DISTINTA
npm ci && npx shopify version                                                     # CLI 4.8.0 esperado
npx shopify theme list --json --no-color > "$SCRATCH/list-0.json"                 # 1 comando; si da 401, PARAR (§5 R1)
sha256sum agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs                   # esperado: 5c03c139…a2bc1 (D32)
```
- MCP `get-shop-info` (lectura): el `domain` tiene que ser `sartorial-theme-kvkzl39t.myshopify.com`. Si no lo es, usar `switch-shop` o parar.
- `$SCRATCH` es el scratchpad de la sesión. Nada de esto se escribe en el repo salvo los resultados finales.
- Si falta una variable, el store no coincide, el CLI da 401 o el SHA de `run.mjs` no está aceptado, **parar** y pedírselo a Johandry.

## 4. Pasos ordenados

Notación: **[Ejecuta / Revisa]**. Evidencia: JSON en `results/` o en `$SCRATCH`, más el informe en `agent-comms/outbox-claude/`.

**P0. Correcciones de datos de la tienda** (O1 de REVIEW-STORE-STATE-001) [Sonnet vía MCP / Opus relee por GraphQL]
- Cambiar el vendor de `gift-card` y revisar su inventario.
- Las políticas (Refund, Shipping, Terms, Privacy) y la retirada de `frontpage`, `automated-collection` y `hydrogen` del canal Online Store NO se asignan a Sonnet: son tareas manuales de Johandry (§5).
- Antes de cada mutación, consultar `graphql_schema`, porque la API 2026-10 trae deprecaciones (§5 R2).
- Evidencia: consulta GraphQL de antes y después, sin datos personales. Puede ir en paralelo con P1.

**P1. Export de los 3 presets al commit vigente** (ya hecho a `76dd94d` para las 3 previews; repetir solo si cambia el código del tema, p. ej. tras commitear el arreglo de la colección vacía) [Sonnet / Opus]
```bash
SHA=$(git rev-parse --short=7 HEAD); H=agent-comms/outbox-claude/harness-C-01-ID-001
for P in Sartorial Imprint Archive; do node $H/build-export.mjs --commit $SHA --preset $P --out "$SCRATCH/exp-$P"; done
# Igualar con el paquete de envío: package-theme-zip.mjs excluye estas 4 rutas (EXCLUDED_PATHS, líneas 88-94);
# build-export las incluye (86 archivos por preset a 76dd94d). Borrar SOLO en la copia del scratchpad, nunca en el repo:
for P in Sartorial Imprint Archive; do rm "$SCRATCH/exp-$P"/{sections/main-documentation.liquid,sections/main-support.liquid,templates/page.documentation.json,templates/page.support.json}; done
```
- Evidencia: el manifiesto SHA-256 de cada export y el recuento de archivos tras el borrado (86 − 4 = 82 esperados).
- Hashes de referencia de los manifiestos a 76dd94d, solo como ejemplo porque se rehacen en el commit final:
  - Sartorial `b697ec5c…11c8`
  - Imprint `5489c449…2f80`
  - Archive `16322d5e…3535`

**P2. Subida sin publicar** [Sonnet / Opus]
- Estado: las 3 previews ya existen (§1.11). No borrar ni reutilizar las previews existentes (D38).
- Método usado: ZIP por `stagedUploadsCreate` (resource FILE) + `themeCreate(source: resourceUrl, role: UNPUBLISHED)` vía MCP, no el CLI: la credencial de Theme Access dio 401 desde el proxy (D39). Para resubir, usar esa misma ruta, salvo que el CLI funcione con las variables nuevas.
- Lo que sigue es el procedimiento CLI alternativo, solo si el CLI funciona:
- Convención de nombres, derivada de C01 («C01 serial <Preset>»): `Sartorial 1.0.0 demo <SHA>`, `Imprint 1.0.0 demo <SHA>`, `Archive 1.0.0 demo <SHA>` y `Clean install 1.0.0 <SHA>` (P9).
- Preflight: en `list-0.json` no puede haber ningún tema con esos nombres. Si existe, parar: no se reutiliza ni se borra.
```bash
npx shopify theme push --unpublished --theme "Sartorial 1.0.0 demo $SHA" --path "$SCRATCH/exp-Sartorial" --no-color   # luego Imprint y luego Archive, en serie
npx shopify theme list --role unpublished --json --no-color > "$SCRATCH/list-1.json"
```
- Cada nombre tiene que aparecer exactamente una vez, con rol `unpublished` y un ID nuevo. Anotar los 3 IDs.

**P3. Identidad** (`identity.mjs`; sin relajarlo) [Sonnet ejecuta / Opus clasifica]
```bash
node $H/identity.mjs --full --candidates $SHA --target <id>:$SHA:Sartorial --out "$SCRATCH/id-sartorial.json"   # igual con Imprint y Archive
```
- Se espera `ok=false`, por dos motivos documentados:
  - (a) `templates/index.json` sale `mismatch` por la normalización de Shopify: `settings:{}` en 5 bloques featured_product, y `blocks:{}` y `block_order:[]` omitidos en manifesto (precedente: CLAUDE-SESION-20261111-TIENDA-002 §4).
  - (b) las 4 rutas de P1 salen `missing-remote` porque se borraron a propósito.
- Opus acepta solo si:
  - no hay ningún otro archivo distinto de `exact`/`normalized`;
  - el diff de `index.json` se reduce a esas claves vacías, comprobado con un script aparte en `$SCRATCH` que compara el JSON canónico quitando `{}`/`[]` vacíos. El script **no** modifica `identity.mjs` ni `lib.mjs`.
- Además, comprobar que las 4 rutas no están en el tema remoto: aparecen como `missing-remote` en el JSON (opcionalmente, `theme pull --only` de esas rutas debe venir vacío).
- Evidencia: los 3 JSON y una tabla de clasificación en el informe.

**P4. Registro de theme IDs y arnés** [Sonnet / Opus]
- `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/stores.json` (schema 1, lista cerrada de 2 tiendas) ya registra los 3 IDs de la tienda nueva (190300356912, 190300455216, 190300422448). Si se crean previews nuevas, actualizarlo (eso no cambia el SHA de `run.mjs`).
- El arnés R-A/R-B exige `--store=<dominio>` (lista cerrada en `stores.json`) y comprueba `Shopify.theme.role === 'unpublished'` (`run.mjs:266-269`, `PREVIEW_ROLE_NOT_UNPUBLISHED`). Las rutas van por tienda (`/collections/permanent-collection` y `/products/serra-coat`; `run.mjs:40-56`).
- Pendiente: migrar `D28_STORE` en `run-b02.mjs:32` (sigue en `tema-qkqpke0j`).
- La migración de `D28_STORE` es una decisión de Claude como líder, apoyada en D38.

**P5. Imágenes de sección en el editor** (cuando GPT entregue GPT-IMAGENES-DEMO-001) [Sonnet asigna / Opus verifica]
- Primero revisar los criterios de §7 de la orden a GPT.
- Asignar según su §4 (Sartorial 17, Imprint 17, Archive 14) en cada tema demo, sin publicar.
- Después repetir P3 solo como observación: los cambios del editor alteran `templates/*.json`, así que los mismatch nuevos son esperados y hay que listarlos.
- Si las imágenes no llegan, P6 a P8 siguen igual. Solo bloquean el estado «10+ imágenes» y el material de G1/G3.

**P6. Pruebas en tienda y móvil** (390×844 y 1280×800). En serie por comando de Shopify; los análisis pueden ir en paralelo.

| Prueba | Comando / método | Ejecuta / Revisa | Evidencia |
|---|---|---|---|
| R-A read-only | `node agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs --store=sartorial-theme-kvkzl39t.myshopify.com --read-only` | Sonnet / Opus | JSON `results/RA-RB-read-only-*`, 0 failed y `incomplete` explicados |
| R-B cart (FIFO) | `… --store=… --cart --theme=<id>`. Un preset cada vez, en orden Sartorial, Imprint, Archive; el siguiente solo arranca con limpieza verificada (carrito vacío al final) en el anterior | Sonnet / Opus | 3 JSON `RA-RB-cart-*` con `scopeResult` distinto de failed |
| A-01 suscripción | Necesita Shopify Subscriptions instalada por Johandry (D34) y `qa-subscription`. No hay runner de tienda (`harness-A-01-B-02-001` es sintético): Sonnet escribe un Playwright en `$SCRATCH` que lee el PDP, el `selling_plan` y el estado sin JS. Sin checkout | Sonnet / Opus | script y su SHA, JSON y capturas 390/1280 |
| B-02 | `node agent-comms/outbox-claude/harness-B-02-STORE-001/run-b02.mjs --fixture=$SCRATCH/b02.json`, con `serra-coat` (Camel/M en 0 y DENY; featured en la home de Sartorial). IDs de variante por MCP `get-product` | Sonnet / Opus | JSON y preflight `theme list` |
| C-07 | PDP de `test-1-variant`, `test-250-variants` y `test-252-variants` (DRAFT: Preview del admin, o activarlos temporalmente y volver a DRAFT, anotándolo). Enlace `?variant=` de una variante posterior a la 250 | Sonnet / Opus | JSON y capturas; estado DRAFT restaurado (GraphQL) |
| D-02 | D-02-A (barra sticky con precio de plan) en PDP y móvil. D-02-Q solo si existen Catálogos B2B en la tienda dev (duda abierta); si no, queda en harness local | Sonnet / Opus | capturas y nota de disponibilidad de B2B |
| Estados degenerados (compuerta 2) | vacío `/collections/empty-test`, carrito vacío y búsqueda sin resultados; uno solo `/collections/single-product-test` y `cashmere-scarf` (1 variante); muchos `doppio-trench` (12 imágenes, depende de GPT) y `test-252-variants`; largo `long-title-fixture-wrap-coat` (120 caracteres, 1499.99) y `cropped-tailored-jacket` (612.75); faltante `leather-belt` (sin imagen) y `silk-twill-square` (sin descripción). Sin fixture: blog vacío (`empty-news` no creado) y 200 productos paginados (solo hay 24): se crean o se declaran no cubiertos | Sonnet / Opus | matriz 5 estados × 3 presets × 2 viewports con captura y desbordamiento |
| Editor | `section:load` del cajón y 3D en featured-product (REVIEW-FIXES-20261114-002 §e 1-2) | Sonnet / Opus | consola sin errores y capturas |

**P7. Lighthouse móvil** (D31) [Sonnet / Opus]
- Herramienta: `scripts/lighthouse-mobile.mjs` (Lighthouse 13.6.0; ver `scripts/lighthouse-mobile.README.md`), que admite la tienda nueva. Estaba sin commitear y en revisión (REVIEW-LIGHTHOUSE-SCRIPT-001): comprobar su estado en `git log` antes de usarla.
- `harness-GPT-RD-001/run.mjs` sigue fijado a la tienda antigua (líneas 12-23 y 234); no usarlo sin parchearlo y revisarlo.
- 3 corridas por preset (`--theme=<id>`), con mediana por página (home, colección y producto).
- Evidencia: 9 JSON, una tabla de medianas y la media móvil frente a ≥60. El resultado cierra o no DP-005.

**P8. C-05 instalación limpia y paridad** [Sonnet / Opus]
- `node scripts/package-theme-zip.mjs --out "$SCRATCH/theme.zip" && sha256sum "$SCRATCH/theme.zip"`.
- Subir el ZIP sin editor como tema nuevo no publicado «Clean install 1.0.0 $SHA», por `stagedUploadsCreate` + `themeCreate` (o con `npx shopify theme push --unpublished` descomprimido en `$SCRATCH/zip` si el CLI funciona).
- Comparar con capturas la home, la colección y la PDP del tema limpio frente a la demo de Sartorial, en 390 y 1280: mismo layout, tipografía y paleta (`acceptance-matrix.md:76`).
- Rastrear los enlaces de la home: 0 respuestas 404.
- La paridad de Imprint y Archive depende de si «Change style» aplica `listings/`: comprobarlo en la tienda y documentarlo.
- C-02 (tienda limpia sin catálogo) **no se cumple aquí**: la tienda tiene catálogo. Requiere DP-006 (Johandry).

**P9. ZIP final** [Sonnet / Opus]
- Tras el último commit de código: `npm run gates:static`, después `node scripts/package-theme-zip.mjs --out dist/theme.zip` y `sha256sum dist/theme.zip`.
- `unzip -l` debe dar: `release-notes.md` en la raíz, 0 rutas de EXCLUDED_PATHS y menos de 50 MB.
- Referencia a 76dd94d, solo como ejemplo: 92 archivos y sha256 `fe096602…36f4`. Ese valor ya no vale: `release-notes.md`, `assets/base.css` y `sections/main-collection.liquid` cambian el contenido; recalcular tras commitearlos.
- Registrar el hash en el informe. El ZIP subido en P8 debe tener el mismo hash; si cambia el código, repetir P1 a P3 y P8.

**Paralelismo:**
- P0 ∥ P1.
- P5 se dispara cuando GPT termine.
- En P6, R-A va primero. A-01, B-02, C-07 y D-02 se preparan en paralelo, pero sus comandos de tienda van en serie.
- P7 va después de P5, porque necesita imágenes reales.
- P8 y P9 van al final.
- Cierre: Opus redacta `CLAUDE-SESION-<fecha>-TIENDA-003.md` con las filas del ledger cerradas o modificadas y su evidencia (RULES §2.1).

## 5. Pendientes de Johandry y riesgos

**Pendientes de Johandry**
1. Las 3 variables de entorno de la tienda nueva (D39).
2. Instalar Shopify Subscriptions y crear `qa-subscription` (D34; Claude no instala apps).
3. SHA final registrado en D32; confirmación expresa de Johandry sobre el valor final pendiente. Solo vuelve a hacer falta si se modifica `run.mjs`.
4. DP-006: tienda limpia para C-02.
5. Aprobar en bloque el copy de la demo (D35) y `release-notes.md` (D29).
6. 3 demos sin contraseña al enviar (G1).
7. Borrar `/axe_head.js` a mano.
8. Crear las políticas Refund, Shipping y Terms; editar Privacy (título en inglés y quitar el email personal).
9. Quitar del canal Online Store las 3 colecciones de ejemplo `automated-collection`, `frontpage` y `hydrogen`.

**Riesgos**
- R1 Theme Access y proxy: la credencial dio 401 a través del proxy (D39). Si el CLI da 401 con la variable del entorno, parar tras 1 intento y avisar. No probar más credenciales.
- R2 API 2026-10: hay campos deprecados. Validar cada query y mutación con `graphql_schema` o `validate_graphql_codeblocks` antes de ejecutarla.
- R3 2 ubicaciones activas («My Custom Location» sin stock, O2): la pickup y el inventario pueden diferir del README («single location»). Documentarlo o desactivarla (D38 permite inventario, no ajustes de ubicaciones: consultar a Johandry).
- R4 `gift-card` con vendor «Snowboard Vendor», `tracked` a 0 y DENY: puede no ser comprable. Corregir en P0.
- R5 colecciones de ejemplo publicadas: `automated-collection` mezcla 12 productos del kit con snowboards archivados.
- R6 SHA de `run.mjs`: cada cambio rompe `D28_RUNNER_SHA256` de `run-b02.mjs` y exige re-aceptación. No ejecutar `run-b02` con un pin desfasado: falla cerrado, lo cual es correcto.
- R8 Imprint/Archive tienen productos sin imágenes: G1 queda bloqueado hasta las fotos de producto (fuera de la orden GPT actual).
- R9 los fixtures DRAFT activados temporalmente hay que devolverlos a DRAFT. Verificarlo por GraphQL.

## 6. Definición de «terminado» para el envío

- **G1** Una demo por preset (Sartorial, Imprint y Archive), con contenido real, imágenes y el preset publicado por Johandry, accesible y con paridad demo/instalación (P8). La fila 116 del ledger necesita evidencia nueva.
- **G2** Lighthouse según D31: media móvil de rendimiento ≥60 en home, colección y producto por preset (P7). D31 solo fija el método y el umbral de rendimiento.
- **G3** Capturas por demo (escritorio 2000×2496 o 1000×1248, móvil 750×1334), las URLs de docs y soporte de GitHub Pages respondiendo y con contenido veraz (D36), y datos del formulario.
- **G4** `release-notes.md` en la raíz del ZIP, versión 1.0.0 y notas aprobadas por Johandry. ZIP final con hash registrado (P9).
- **Además:** R-A, R-B, A-01, B-02, C-07 y la compuerta 2 con evidencia de tienda (Gate 5), y las filas del ledger actualizadas con `archivo:línea` o JSON.
- **NO bloquea:**
  - C-01 (D33).
  - D-02-Q si la tienda dev no ofrece Catálogos B2B (se documenta).
  - Los `incomplete` de axe ya explicados (REVIEW-RA-READONLY-001).
  - El carrito huérfano T-2 de la tienda antigua.
  - El idioma `es` sin publicar.
  - El incidente histórico de la tienda antigua.
  - El 404 de `/favicon.ico` y los avisos de CDN (DP-005).

## 7. Verificación y afirmaciones falsables

Comandos de esta redacción (locales, rehechos contra `f81774e`): `git status --short`, `git rev-parse --short HEAD`, `cat stores.json`, `node -e` sobre `created-*.json`, `grep -n` en `run.mjs`, `package-theme-zip.mjs`, `harness-GPT-RD-001` y en el ledger.

1. `stores.json` está commiteado, con `schema:1`, y la tienda nueva tiene los 3 IDs 190300356912, 190300455216 y 190300422448.
2. `run.mjs:40-56` define rutas por tienda y la tienda nueva usa `/collections/permanent-collection` y `/products/serra-coat`; `run.mjs:266-269` exige rol `unpublished`.
3. `scripts/package-theme-zip.mjs:88-94` lista las 4 rutas excluidas citadas en P1, y la línea 83 incluye `release-notes.md`.
4. `run-b02.mjs:32` tiene `D28_STORE = 'tema-qkqpke0j.myshopify.com'`; `D28_RUNNER_SHA256` (línea 29) es `5c03c139…` (SHA final de D32).
5. `created-products.json` tiene 25 entradas: 24 del kit más `gift-card` (3 DRAFT). `created-products-imprint-archive.json` tiene 24 creados (9 ACTIVE y 15 DRAFT). `created-themes.json` tiene los 3 temas UNPUBLISHED.
6. `harness-GPT-RD-001/run.mjs:23` fija `STORE_HOST = 'tema-qkqpke0j.myshopify.com'`.
7. D29 a D39 están en `docs/decisions.md` (pueden estar aún sin commitear), y D38 prohíbe instalar o configurar apps.
8. Este runbook no ejecutó ningún comando de Shopify ni ninguna llamada MCP, y no tocó ningún otro archivo.

## 8. Hallazgos verificados el 2026-11-14

1. `theme_screenshot` NO refleja el código desplegado en temas no publicados. Experimento con marcadores DIAG en el tema Archive: ninguno apareció en la captura, y el tema se restauró a la versión `f872ab75`. No usar capturas de `theme_screenshot` como evidencia de verificación. Verificar con el HTML real vía Playwright, con `STOREFRONT_PASSWORD` de la tienda nueva en el entorno.
2. El arreglo de la colección vacía (commit `303bf4d`) está verificado por código y por 2 revisiones, pero NO en tienda real. Hay que comprobar en el HTML que, con la colección `empty-test`, no aparecen `product-grid__item--promotion` ni `data-product-list`.
3. Los hallazgos visuales previos (P2) proceden de esas capturas y por tanto son indicativos, no concluyentes.
4. Tarjetas, handles y demás: sin cambios.
