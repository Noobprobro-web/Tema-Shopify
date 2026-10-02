# CLAUDE-REPORT-LEAD-001: Plan de ataque y ejecución de la primera ola (B-01 · B-04/M-02 · M-01)

```text
ID: CLAUDE-REPORT-LEAD-001
Estado: EN CURSO. B-01 CERRADO (ver Actualización 1); directivas de imagen emitidas; M-01 (colección, políticas y menú) preparado, a la espera de que se autorice el conector en cada tienda.
Decisión requerida:
  (1) [HECHO] Paso 0 y push del schema, por Johandry.  (2) [HECHO] Formspree xyezvvjo.
  (3) Johandry reautoriza el conector Shopify en sartorial-edition, luego en atelier y luego en archive.
  (4) Las políticas las crea Claude por conector con shopPolicyUpdate (decisión de Johandry; sustituye §4.4).
Resumen en 5 líneas:
  1. Docs y soporte publicados en un repo público aparte (GitHub Pages): las 3 URLs dan 200 sin cookies y el schema ya apunta a ellas.
  2. support.html deja de usar mailto: ahora envía a Formspree por POST con mejora progresiva y región viva; falta el ID real.
  3. docs.html corregido: tenía 3 afirmaciones falsas (26→33 secciones, "15" esquemas→5, casilla de términos inexistente) y una descripción de Archive equivocada.
  4. Fotos: directivas a GPT (13 de Edition) y a Gemini (12 de Archive), con ficha por handle y criterio de aceptación verificable.
  5. M-01: la línea base en vivo confirma 4 políticas en 404 en las 3 tiendas y desk-and-study en 404; las operaciones GraphQL están validadas contra Admin 2026-07.
Archivos tocados:
  config/settings_schema.json:7-8
  docs/merchant/docs.html · docs/merchant/support.html · docs/merchant/index.html (nuevo)
  agent-comms/inbox-gpt/GPT-TASK-016-edition-imagery.md (nuevo)
  agent-comms/inbox-gemini/GEMINI-TASK-IMAGERY-001-archive.md (nuevo)
  agent-comms/outbox-claude/harness-LEAD-001/* (nuevo)
  Externo: github.com/Noobprobro-web/sartorial-docs (repo público nuevo; solo los 3 HTML, README y .nojekyll)
Desviaciones (Nivel 1 o Nivel 2):
  N1. GitHub Pages desde /docs del repo del tema era inviable: el repo es privado, y publicarlo expondría el código y los docs internos. Se usa un repo público aparte (decisión de Johandry).
  N1. Políticas: se recomienda "Crear desde plantilla" de Shopify (texto legal de Shopify) en vez de escribirlas con shopPolicyUpdate.
  N2. El Paso 0 (git checkout de 5 archivos y del handoff) y el push del schema a las demos los denegó el clasificador del modo automático: los ejecuta Johandry.
Hallazgos extra fuera de alcance (con parche listo):
  X1. [P1] El árbol de trabajo tenía sin commit la reversión de P-04 en 5 Liquid y el handoff vacío (ver §1). Si se empaqueta así, se rompe la paridad B-02. Parche: Paso 0.
  X2. [P2] Los heroes de Archive y Edition muestran texto de terceros: "STOCKMAN Paris" (marca real de maniquíes) y un póster "BAUHAUS". Además miden solo 1376×768. Regeneración opcional pedida en GEMINI-TASK-IMAGERY-001 §7.
  X3. [P3] GPT-017 H7 ("el pie de Edition/Archive solo muestra Search") ya no se reproduce: ambos pies enlazan sus colecciones (results-02-m01-baseline.jsonl). Solo faltan las políticas.
  X4. [P3] La 2026-07 de Admin GraphQL marca como obsoletos collectionCreate(input:) y ruleSet; la operación preparada usa collection: + sources.
Verificación (comando, resultado y qué demuestra/qué no):
  V1. sh harness-LEAD-001/01-public-docs.sh → 200 ×3, schema:7-8 con las nuevas URLs, W3C Nu 0 errores ×3. Demuestra el acceso público y el HTML válido. NO demuestra que el formulario envíe: el ID aún es un marcador.
  V2. npm run gates:json → exit 0; npm run gates:theme-check → "429 files inspected with no offenses found". NO se ejecutó gates:static completo, porque regeneraría el ZIP sin P-04 (X1).
  V3. node harness-LEAD-001/02-m01-verify.mjs baseline → 404 en refund/shipping/terms/contact ×3 tiendas; desk-and-study 404; el clic en el bento lleva a "Object not found.". Es la línea base "antes".
  V4. shopify-dev validate (Admin 2026-07) sobre harness-LEAD-001/03-m01-admin.graphql → 7/7 válidas.
Lista de afirmaciones falsables numeradas:
  1. curl a https://noobprobro-web.github.io/sartorial-docs/{,docs.html,support.html} sin cookies devuelve 200.
  2. config/settings_schema.json:7-8 contiene esas URLs.
  3. El repo público sartorial-docs contiene solo index.html, docs.html, support.html, README.md y .nojekyll.
  4. ls sections/*.liquid | wc -l = 33, y docs.html ya dice 33.
  5. En las 3 demos, /policies/{refund-policy,shipping-policy,terms-of-service,contact-information} devuelven 404 a fecha 2026-09-30 (antes de corregir).
```

---

## 1. Estado del árbol de trabajo (bloqueante para el ZIP)
`git diff --stat` al empezar la sesión mostró **cambios sin commit** que deshacen P-04:

| Archivo | Cambio |
|---|---|
| `sections/main-404.liquid` | −7 (`is_eager_404_card`) |
| `sections/main-collection.liquid` | −7 (`is_eager_card`) |
| `sections/main-list-collections.liquid` | −5 (`is_eager_collection`) |
| `snippets/product-card.liquid` | −1 (`eager: eager_image`) |
| `snippets/responsive-image.liquid` | −2 (parámetro `eager`) |
| `agent-comms/inbox-claude/CLAUDE-HANDOFF-LEAD-001.md` | vaciado (−109) |

HEAD `60599ab` sí tiene P-04, y las demos también. Son cambios locales, probablemente de OneDrive o de una herramienta (los archivos cambiaron entre las 19:16 y las 19:21). Hay que restaurarlos **antes** de `npm run gates:static`, porque ese gate regenera `Sartorial-1.0.0.zip`.

## 2. B-01: documentación y soporte públicos
- **Publicación:** `https://noobprobro-web.github.io/sartorial-docs/` (redirige a docs), `/docs.html` y `/support.html`. Se publicó en un repo público aparte para no exponer el código del tema; el commit va firmado con el correo *noreply* de GitHub, no con un correo personal.
- **support.html:**
  - `<form action="https://formspree.io/f/FORMSPREE_FORM_ID" method="POST">` con `_subject` y honeypot `_gotcha`.
  - Script de mejora progresiva: envía con `fetch` y `Accept: application/json`, y anuncia el resultado en `role="status"`, o `role="alert"` si hay error.
  - Sin JS, el formulario hace un POST normal a Formspree.
  - El `mailto:` queda solo como contacto de respaldo en el pie.
- **docs.html, correcciones de veracidad:**
  - Número de secciones: 26 → 33.
  - Esquemas de color: "up to 15" → "cinco listos, puedes añadir más".
  - Se retira la "casilla de términos" del cajón del carrito, que no existe en `sections/cart-drawer.liquid`.
  - Archive pasa a describirse como "vintage and archival apparel".
  - h4 → h3 en las tarjetas de presets (salto de nivel detectado por W3C Nu).
  - Se quita "Playfair Display", que no se cargaba.
- **Pendiente:**
  - Sustituir `FORMSPREE_FORM_ID` en `docs/merchant/support.html` y en el repo público.
  - Hacer un envío real de prueba.
  - Push del schema (§4.2).
  - Fila 107 del ledger a `cumplido` con la evidencia V1 y el envío real.

## 3. B-04 / M-02 / M-03: fotografía
- **Edition:** `agent-comms/inbox-gpt/GPT-TASK-016-edition-imagery.md`. 13 fichas; cada una fotografía la variante por defecto, que es la primera del CSV (por ejemplo, el pisapapeles es Natural brass).
- **Archive:** `agent-comms/inbox-gemini/GEMINI-TASK-IMAGERY-001-archive.md`. 12 fichas con puntos de control por pieza (cruzada a rayas, falda de cuero, etc.).
- **Requisitos comunes a ambas directivas:**
  - 4:5, ≥ 2000×2500, sin texto, marcas ni personas.
  - `alt-text.csv` y `PROVENANCE.md`, que cierra M-03 (licencia de cada imagen).
  - Entrega en `demo-assets/<preset>/`, que no va a git.
- **Cuando lleguen las imágenes, Claude:**
  - Hace QA visual con la hoja de contactos.
  - Las sube por conector (`stagedUploadsCreate` → `productCreateMedia` → `productDeleteMedia`).
  - Regenera los CSV de `scratch/`.

## 4. Acciones para Johandry (en este orden)
### 4.1 Paso 0: restaurar P-04 (1 min)
```powershell
cd "C:\Users\Johan\OneDrive\Documentos\Drive\Tema Shopify"
git checkout -- sections/main-404.liquid sections/main-collection.liquid sections/main-list-collections.liquid snippets/product-card.liquid snippets/responsive-image.liquid agent-comms/inbox-claude/CLAUDE-HANDOFF-LEAD-001.md
git status --short
```
`git status` debe mostrar solo los archivos de §"Archivos tocados".

### 4.2 Push del schema a las 3 demos (2 min)
```powershell
npx shopify theme push --store sartorial-atelier.myshopify.com --theme 188743188704 --only config/settings_schema.json --nodelete --allow-live
npx shopify theme push --store sartorial-edition.myshopify.com --theme 188655599784 --only config/settings_schema.json --nodelete --allow-live
npx shopify theme push --store sartorial-archive.myshopify.com --theme 191153275192 --only config/settings_schema.json --nodelete --allow-live
```
Los IDs están verificados hoy con `shopify theme list` (los tres son `[live]`).

### 4.3 Formspree (5 min)
1. Entra en https://formspree.io y regístrate con tu Gmail.
2. Pulsa **New form**, ponle de nombre "Sartorial Support" y elige tu Gmail como destino.
3. Copia el ID (`https://formspree.io/f/xxxxxxxx`) y pásaselo a Claude.
4. Después de que Claude lo publique, haz un envío de prueba desde la página de soporte y confirma el correo de verificación que te manda Formspree.

### 4.4 Políticas: Crear desde plantilla (≈2 min por tienda, ×3)
Para cada tienda (`admin.shopify.com/store/sartorial-atelier`, `…/sartorial-edition` y `…/sartorial-archive`):
1. Ve a **Configuración → Políticas**.
2. Para cada una de **Política de reembolso**, **Política de envío** y **Términos del servicio**, pulsa **Crear desde plantilla** y luego **Guardar**.
3. En **Información de contacto**, completa los datos de la tienda y pulsa **Guardar**.
4. La política de privacidad ya existe; no la toques.

### 4.5 Reautorizar el conector Shopify (1 min por tienda)
En claude.ai, ve a **Ajustes → Conectores → Shopify**, autoriza la tienda **sartorial-edition** y avisa a Claude. Claude entonces:
- Crea la colección `desk-and-study` (colección inteligente por la etiqueta `desk-and-study`) y la publica.
- Añade las políticas al menú `footer`.
- Verifica tu pedido Bogus.

Después se repite con Atelier y con Archive.

**Alternativa manual si el conector no tiene permisos:**
1. En Edition, ve a **Productos → Colecciones → Crear colección**.
2. Pon de título "Desk & Study", elige el tipo **Automatizada** con la condición "Etiqueta del producto es igual a `desk-and-study`" y pulsa **Guardar**.
3. Comprueba que el identificador (handle) es `desk-and-study`.

### 4.6 Pedido de prueba Bogus (≈3 min por tienda)
1. Abre la tienda y entra con la contraseña de la demo.
2. Añade un producto al carrito y ve al pago.
3. Rellena la tarjeta así: nombre **Bogus Gateway**, número **1**, cualquier fecha futura y CVV **123**.
4. Pulsa **Pagar ahora** y anota el número de pedido (#1001…).

## 5. Lo que sigue (equipo)
1. Con el ID de Formspree: actualizar `support.html` en los dos repos, hacer un envío real y repetir V1.
2. Con el conector autorizado: ejecutar `03-m01-admin.graphql` en Edition → Atelier → Archive, y después `node harness-LEAD-001/02-m01-verify.mjs after`.
3. Con las imágenes: QA visual, subida y regenerar los CSV.
4. Release:
   - Ejecutar `npm run gates:static`, que regenera el ZIP.
   - Comprobar las URLs del schema dentro del ZIP con `unzip -p`.
   - Pull de solo lectura de las 3 demos y comparación con `26-deploy-vs-repo.py`.
   - Commit, y push tras el OK de Johandry.
   - Redactar `CLAUDE-SUBMISSION-MANIFEST-001.md`.
5. Nota para Gemini (único escritor de BOARD): actualizar el BOARD con:
   - B-01 publicado, a falta del ID de Formspree y del push del schema.
   - Directivas de imagen emitidas.
   - M-01 a la espera de las políticas de Johandry y de la autorización del conector.

---

## Actualización 1 (2026-09-30): B-01 cerrado
- **Paso 0:** Johandry restauró el árbol. `git status --short` ya no muestra Liquid modificados, y `grep -c eager` da 4/1/3/3/3 en los 5 archivos de P-04. El handoff vuelve a tener 109 líneas.
- **Schema en las demos:** un `shopify theme pull --only config/settings_schema.json` de solo lectura confirma `theme_support_url` = `…/sartorial-docs/support.html` en Atelier, Edition y Archive.
- **Formspree `xyezvvjo`:**
  - Está en `docs/merchant/support.html:188` y publicado en el repo público (commit `735b6ee`, Pages `built`).
  - Envío E2E real (`harness-LEAD-001/04-support-form-e2e.mjs`): POST `formspree.io/f/xyezvvjo` → **200**; estado `success` en `role="status"`; el formulario se vacía. Resultado en `results-04-support-form-e2e.json`.
  - El envío de prueba es "LEAD-001 QA (test)" con remitente `qa-test@example.com`; Johandry debe verlo en su Gmail y confirmar Formspree si se lo pide.
- **Ledger:** fila 107 reescrita con la nueva evidencia (`docs/requirements-ledger.md`); `npm run gates:ledger` → exit 0.
- **Políticas por conector:** se usarán `harness-LEAD-001/05-policies.json` (4 cuerpos HTML con estructura de plantilla Shopify) y la operación `UpsertPolicy`. Las rellenan los datos reales de cada tienda (`shop.name`, `contactEmail`, `shopAddress`). Ambas operaciones están validadas contra Admin 2026-07; requieren el scope `write_legal_policies`. Si el conector no lo tiene, el fallback es §4.4.

---

## Actualización 2 (2026-09-30): conector en Atelier, QA de imágenes
- **Conector en Atelier:**
  - `get-shop-info` confirma *Sartorial Atelier*. Hoy hay 0 pedidos: el Bogus sigue pendiente.
  - Menú `footer` = Search + Your Privacy Choices. Política existente: solo PRIVACY_POLICY.
  - `shopPolicyUpdate` → **`Access denied … Required access: write_legal_policies`**. El conector no tiene ese scope, así que las políticas no se pueden crear por esta vía.
- **Vía alternativa: Shopify CLI 4.8.0.**
  - Johandry ejecuta `shopify store auth --store <tienda> --scopes …` una vez por tienda.
  - Claude ejecuta después `shopify store execute` con los scopes exactos que exigen las operaciones validadas: políticas, colección, menú, medios y pedidos.
- **Decisión de Johandry:** ningún correo en texto público. `05-policies.json` remite a `/pages/contact`, y CONTACT_INFORMATION lleva nombre comercial, canal y país.
- **Corrección del harness:** el pie real es `.site-footer__menu` (menú `footer`). La línea base recogía enlaces de otros `<footer>` (X3 queda anulado: el pie de las 3 tiendas solo muestra Search y Privacy Choices).
- **QA de imágenes:**
  - **Edition (GPT, 13/13): ACEPTADAS.**
    - Cada objeto coincide con su ficha.
    - Los pares #2/#3 y #7/#8 se distinguen.
    - El tarjetero muestra 4 ranuras.
    - Sin texto ni marcas; sesión coherente.
    - Reserva: son ampliaciones desde 1122×1402 (GPT lo declara). Valen para tarjeta y PDP; el zoom 2× se verá algo blando.
  - **Archive (Gemini, 4/12): ACEPTADAS** las 4 entregadas: chaleco, cruzada diplomática, falda de cuero y blusa. Reserva menor: la falda muestra tapeta frontal donde se pedía cierre oculto.
  - **Archive pendiente: 8/12.** Gemini agotó la cuota; se recarga en unas 2 h.
  - **Discrepancia:** Gemini declaró entregados `PROVENANCE.md`, `alt-text.csv`, `process_archive_images.py` y `GEMINI-REPORT-IMAGERY-001-archive.md`, pero **los cuatro miden 0 bytes** (`ls -la`). Debe regenerarlos.

---

## Actualización 3 (2026-09-30): Atelier cerrado por CLI; Archive #5-#12 reasignado a GPT
- **Autorización CLI:** solo existe la de `sartorial-atelier`. `shopify store execute` en Edition y Archive responde "No stored app authentication found".
- **Atelier, políticas** (`06-apply-policies.mjs`): las 4 se crearon sin `userErrors` (`results-06-policies-atelier.json`).
- **Atelier, menú `footer`** (`07-footer-menu.mjs`): Search, Refund policy, Shipping policy, Privacy policy, Terms of service, Contact information y Your Privacy Choices. Los ítems de política son de tipo `SHOP_POLICY` (`results-07-footer-atelier.json`).
- **Atelier, verificación en vivo** (`02-m01-verify.mjs after-atelier atelier`):
  - 5/5 `/policies/*` → 200, con h1 en inglés.
  - 5/5 enlaces de política del pie → 200.
  - Pedidos: 0, así que el Bogus sigue pendiente.
- **Medios:** `08-upload-media.mjs` está listo (staged upload → `productUpdate(media)` → espera READY → `productDeleteMedia`). Si la imagen nueva no llega a READY, no borra la vieja. Espera la autorización CLI de Edition y Archive.
- **Imágenes de Archive #5-#12:** reasignadas a GPT por Johandry (`agent-comms/inbox-gpt/GPT-TASK-017-archive-imagery-completion.md`), con las 4 aprobadas como referencia de estilo obligatoria. Durante la sesión, un tercero (Gemini o GPT) escribió `demo-assets/archive/alt-text.csv` con las 12 filas.

---

## Actualización 4 (2026-09-30): M-01 cerrado en las 3 tiendas; Edition 13/13; Archive 4/12; DERIVA de despliegue
- **Políticas y pie** (`06-apply-policies.mjs`, `07-footer-menu.mjs`): Edition y Archive igual que Atelier. Sin `userErrors`.
- **Colección `desk-and-study`** (Edition, `results-09-collection-edition.json`):
  - `collectionCreate` con fuente inteligente por etiqueta, y `publishablePublish` en Online Store.
  - `productsCount` = 6: folio, laptop sleeve, desk mat, valet tray, paperweight y pen sleeve.
- **Verificación en vivo** (`02-m01-verify.mjs after`, `results-02-m01-after.jsonl`):
  - 15/15 `/policies/*` → 200 con h1 en inglés.
  - 15/15 enlaces de política del pie → 200.
  - `/collections/desk-and-study` → 200 con 6 tarjetas.
  - El clic en el bento de la portada de Edition aterriza en h1 "Desk & Study". **M-01/R4 cerrado.**
- **Medios** (`08-upload-media.mjs`, `results-08-media-*.jsonl`):
  - Edition: 13/13 sustituidos (READY y foto vieja borrada).
  - Archive: 4/12 (#1-#4); las 8 restantes siguen con fotos de Atelier hasta que entregue GPT-TASK-017.
  - Hojas de contacto en vivo: `harness-LEAD-001/evidence/{edition,archive}-catalogo-completo.jpg`. **B-04 cerrado**; M-02 parcial.
- **CSV** (`10-regen-csv.mjs`): `scratch/sartorial_{edition,archive}_products.csv` apuntan ya a las URLs CDN servidas hoy. Solo cambian `Image Src` e `Image Alt Text`; las copias de respaldo están en el scratchpad de la sesión.
- **Gates:** `npm run gates:static` → exit 0, 439 archivos sin ofensas. ZIP regenerado:
  - SHA-256 `f2792c656e814c13d513a47742e30861e9b599f90875d985567758746f6a404e`
  - `unzip -p … settings_schema.json` muestra las URLs públicas.
- **[P0] Deriva de despliegue:**
  - Un pull completo de solo lectura de las 3 demos, comparado con `26-deploy-vs-repo.py`, da **8 archivos distintos en las 3**.
  - El handoff afirmaba que `ea3e3dc` estaba desplegado. **No lo está.**
  - Funcionales:
    - `assets/theme.js`: falta B-03 (`effectiveMax` por umbral), L-01, L-02 y L-03.
    - `sections/featured-product.liquid`: conserva el bloque `v_quantity_max` que B-03 retiró. Por tanto, **la regresión del tope de stock sigue viva en las demos**.
  - No funcionales:
    - `main-404`, `main-collection`, `main-list-collections`, `product-card`: P-04 equivalente con otro orden o sangría.
    - `base.css`: solo líneas en blanco.
  - Ruido conocido: `templates/index.json` (`settings: {}`) y `layout/password.liquid`.
  - Parche: Johandry empuja los 7 archivos con `--only` (comandos en el mensaje a Johandry). Después, Claude repite el pull, la comparación y una prueba en vivo de cantidad (25 unidades sin tope de 6; pieza 1-de-1 limitada a 1).

---

## Actualización 5 (2026-09-30): Archive 12/12, deriva corregida y B-03 verificado en vivo
- **GPT-TASK-017:** QA de las 8 imágenes **ACEPTADAS** (#5-#12). Cada una cumple su punto de control: franja de satén, capullo sin botones, portafolios plano sin asas, capa asimétrica sin mangas, bajo curvo, estampado sin letras, bies con bajo asimétrico, gabardina con cinturón y sin botonadura cruzada.
  - 12/12 son 2000×2500 con SHA-256 distintos.
  - Hoja de las 12: `demo-assets/archive/contact-sheet.jpg`. Es coherente como campaña; los fondos de GPT son algo más cálidos que los de Gemini.
  - Reserva declarada por GPT: los originales son de 1122×1402 y se ampliaron.
- **Subida a Archive** (`08-upload-media.mjs`): 8/8 READY con la foto vieja borrada. Total Archive: 12/12 (`results-08-media-archive.jsonl`).
  - Hoja en vivo: `evidence/archive-catalogo-completo.jpg`.
  - `scratch/sartorial_archive_products.csv`: 12/12 nombres propios y 0 compartidos con Atelier. **M-02 cerrado.**
- **Deriva:** Johandry empujó los 7 archivos. El primer intento falló con `EPERM scandir C:\WINDOWS\system32\config`, porque se lanzó desde system32; se resolvió con `--path`.
  - Un nuevo pull completo, comparado con `26-deploy-vs-repo.py`, da en las 3 tiendas "1 distintos ['templates/index.json']" (ruido conocido `settings: {}`) y "solo en el tema publicado: layout/password.liquid" (AF-12).
  - **Repo = ZIP = demos.**
- **B-03 en vivo** (`12-commerce-edge.mjs`, copia de FINAL-003/21):
  - Edition `structured-tote` y Atelier `nove-blazer`, con 25 vendibles: `max=null`, el `+` llega a 31, y la API de carrito acepta 25 ("Only 25 items were added"). El tope artificial de 6 ha desaparecido.
  - Archive, 3 piezas 1-de-1: `max=1`, `+` deshabilitado, y la API acepta 1.
  - El JSON publica `inventory_quantity: 6` con 25 en stock, que es la privacidad AF-07 (umbral + 1), intacta.
  - Cada prueba vacía el carrito.
- **Estado de la matriz del handoff:**
  - B-01 ✅
  - B-04 ✅
  - M-01/R4 ✅
  - M-02 ✅
  - M-03: procedencia completa (`PROVENANCE.md` de Gemini #1-#4 y `PROVENANCE-GPT.md` #5-#12). Johandry debe confirmar que los planes de las herramientas de generación permiten el uso comercial.
  - Bogus: ❌ pendiente de Johandry (0 pedidos en las 3 tiendas).
  - Commit y push: pendientes del OK de Johandry.

---

## Actualización 6 (2026-10-01): movimiento expresivo en modo Full (GSAP + ScrollTrigger)
**Pedido de Johandry:** animaciones y scroll suaves y marcados. **Decisión de Johandry:** GSAP + ScrollTrigger, sin referencia externa. Se usaron las skills `gsap-scrolltrigger` y `gsap-performance`.

**Archivos:**
- `assets/gsap.min.js` y `assets/gsap-scrolltrigger.min.js`: GSAP 3.15.0 de npm, sin modificar y con sus avisos de copyright.
  - Licencia: *Standard no-charge*. Permite el uso comercial y exige conservar los avisos.
  - No menciona expresamente la redistribución dentro de un tema vendido; se documenta en `docs.html`.
- `assets/motion.js` (nuevo, 8 KB): el motor de movimiento.
- `layout/theme.liquid`: carga condicional (solo con Animaciones = Full) y el atributo `data-motion-engine`.
- `assets/theme.js`: expone `window.theme.reveal` (misma lista de objetivos y tope) y cede el reveal CSS en modo Full.
- `assets/base.css`: tokens `--motion-expressive`, `--reveal-shift-expressive`, `--reveal-stagger-expressive` y `--parallax-shift`.
- `config/settings_data.json`: `animations: full` en `current` y en los 3 presets.
- `locales/en.default.schema.json`: texto de ayuda del ajuste.
- `docs/merchant/docs.html`: sección *Motion*, publicada (commit `925b42c` del repo público).
- `docs/requirements-ledger.md`: fila 55 con la evidencia del motor nuevo.

**Efectos en modo Full:**
1. Entrada por lotes: 64 px y 1,2 s en `expo.out` (la curva de `--ease-enter`), con escalonado de 100 ms y el mismo tope de 7.
2. Medios editoriales (manifiesto, complete-the-look, lookbook y galería de "about") que se descubren con máscara `clip-path`; la foto se asienta desde una escala de 1,18. El lookbook no escala, para no desalinear sus puntos de compra.
3. Parallax del hero con `scrub: 0.6`. Empieza en 0, así que no afecta al LCP.
4. Marquee que acelera con la velocidad del scroll (hasta 4×) y recupera su ritmo; usa `quickTo` y `playbackRate` de la animación CSS existente.

**Garantías:**
- El contenido nace visible: sin JS, si GSAP falla o con movimiento reducido no se oculta nada.
- Lo que ya está a la vista al cargar no se toca.
- Se oculta con opacidad, no con `visibility`: el foco revela al instante.
- Solo se animan transform, opacity y clip-path.
- El editor de temas está soportado (`shopify:section:load/unload`).

**Verificación:**
- **Gates:** `npm run gates:static` → exit 0, 443 archivos sin ofensas. ZIP regenerado:
  - SHA-256 `79e90971a53e455615d41d8386481fd1b69ced45a27b4c01de6ceefe5d4d143e`
  - Contiene `gsap.min.js`, `gsap-scrolltrigger.min.js` y `motion.js`.
- **`13-motion-check.mjs`** contra `shopify theme dev` (Edition, tema de desarrollo):
  - **Full:** GSAP activo, 15/5/0 ScrollTriggers en home/colección/PDP. Tras recorrer cada página, 0 elementos ocultos. CLS 0,0116 / 0,0015 / 0,0002. 40 tabulaciones sin foco en elementos invisibles. 0 errores de consola del tema.
  - **Reducido:** 0 ScrollTriggers y 0 elementos ocultos.
  - El bug `context.add(fn)` (GSAP invoca la función al instante) se detectó y corrigió en la primera pasada.
- **Fotogramas a mitad de animación:** `harness-LEAD-001/evidence/motion/`.
- **W3C Nu de `docs.html`:** 0 errores.

**Hallazgo fuera de alcance (X5, P2):** en el servidor de desarrollo, la portada **por defecto del repo** (`templates/index.json`) tiene un CLS de **0,17 con movimiento reducido**, igual en Full y en Subtle e independiente de GSAP (A/B con los scripts bloqueados: 0,1696). Cambian la marca de la cabecera y las acciones/subtítulo del hero hacia los 0,7-1,4 s. En la demo Edition en vivo (su propia portada), con movimiento reducido: 0,0118. Hay que investigarlo en un sprint aparte: la portada por defecto es lo que ve un comerciante al instalar el ZIP.

**Pendiente:**
- Johandry: push de los 7 archivos a las 3 demos (comando en el mensaje).
- Johandry: poner Animaciones = Full en el editor de cada demo. El `settings_data` de cada tienda es suyo y no se empuja.
- Medir Lighthouse en vivo después del despliegue.
- Borrar el tema de desarrollo `#188697313448` en Edition, creado por `theme dev`.

---

## Actualización 7 (2026-10-01): auditoría visual multiagente y correcciones
**Auditoría:** tres agentes en paralelo, uno por tienda, de solo lectura. Usaron `lib.mjs` (sin 429), desktop 1440 y móvil 390. Informes:
- `harness-LEAD-001/audit-atelier/audit-atelier.md`
- `harness-LEAD-001/audit-edition/audit-edition.md`
- `harness-LEAD-001/audit-archive/audit-archive.md`

**Corregido en código (repo; ZIP regenerado; gates exit 0):**
| Hallazgo | Arreglo |
|---|---|
| P1 `/policies/*` (5×3): h1 de 112-123 px partido a mitad de palabra, sin aire, columna de 65ch inyectada por Shopify | `assets/base.css` estiliza `.shopify-policy__*` con la medida y la escala de `.main-policy__*`. Verificado: h1 de 58,8 px en una línea, 64 px bajo la cabecera, h2 de 29,4 px, cuerpo de 17 px, sin scroll horizontal |
| P2 portada: el borde izquierdo salta entre 70 y 32 px por sección | Token `--content-width` (fórmula de `.container`) en showcase, bento, manifiesto, lookbook, complete-the-look y hero partido. Verificado: todas a x=70 (desktop) y x=20 (móvil), igual que header y footer |
| P2 PDP agotada: + activo y "Total for 3" | `theme.js`: con `available === false` el máximo es el mínimo y no se muestra el total. Verificado: max 1, + deshabilitado, sin total |
| P2 cajón y /cart: + activo en pieza 1-de-1 | `cart-drawer.liquid` y `main-cart-items.liquid`: tope igual al stock vendible cuando la línea ya lo contiene (respeta AF-07) |
| P2 contacto: h2 mayor que el h1 | `.main-contact__layout h2` con escala de sección. Verificado: 33,6 frente a 67,2 px |
| P3 total de línea empuja 31 px | Hueco reservado (`visibility`, `min-height`) |
| P3 "Choose options" en productos de una sola variante | `product-card.liquid`: `variant_total == 1` va a añadir directo |
| P3 línea huérfana en el menú móvil | `.mobile-nav__localization:not(:has(*))` |
| P3 "View all Catalog" | `en.default.json` pasa a "Explore {{ title }}" |
| P3 copy contradictorio | `page.contact.json`: "Monday through Friday". Marquee de Archive: "Milan & Paris" |
| P3 PDP de Edition con texto genérico de envío | `listings/edition/templates/product.json`: entrega y devoluciones coherentes con la portada y la política de 30 días |

Evidencia: `harness-LEAD-001/15-fixes-check.mjs`, `results-15-fixes-check.json` y `evidence/fixes/` (contra `theme dev` de Archive).

**Corregido en las tiendas (CLI, `write_*`):**
- **Mega menú:** `main-menu` → "Catalog" con dos columnas, *Collections* y *Signature pieces* (`14-mega-menu.mjs`).
- **Colecciones despublicadas** (no borradas; se puede revertir):
  - Edition: `desk-study` (duplicada) y `frontpage`.
  - Atelier y Archive: `frontpage`.
- **Vendor de Atelier:** 24 productos pasan de "LINEA NOVE" a "Sartorial Atelier".
- **Pedidos de prueba:** #1001 en las 3 tiendas (test, PAID).

**Preparado para que Johandry lo empuje** (`scratch/store-push/<tienda>/`, ignorado por git):
- Los archivos de código anteriores.
- `config/settings_data.json` de la tienda, con `animations: full` en sus presets como único cambio.
- `sections/header-group.json` de la tienda, donde solo cambia la promo del mega menú: imágenes que existen en cada tienda y textos de la propia tienda.
- Edition: `templates/product.json`. Archive: `templates/index.json`.

**Pendiente o propuesto (no hecho):**
- [P2] Filtros de colección en móvil: plegar el bloque entero. Toca el marcado que repinta el AJAX de facetas, así que va en un sprint aparte.
- [P2] Las variantes de color de Edition no tienen imagen propia. Es contenido: haría falta generar las fotos por acabado.
- [P2] La chaqueta de 1990 está agotada por el pedido de prueba y es el producto destacado de la portada de Archive. Johandry debe reponer su stock a 1; el CLI no tiene `write_inventory`.
- [P3] Dos newsletters seguidas en la portada (sección + bloque del footer).
- [P3] Placeholder del buscador cortado en el 404.
- [P3] Título "Products" en `/collections/all`.
- [P3] "Low stock: 1 left" en piezas únicas.
- [P3] Tipografía de "Buy it now" y sangría de "Size" en la PDP de Atelier.
- El mega menú abre con clic y no con hover, por decisión de accesibilidad (`snippets/mega-menu.liquid:17-19`).
