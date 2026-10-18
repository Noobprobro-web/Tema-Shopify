# Borradores de la primera directiva de cada sprint del plan CLAUDE-PLAN-CONTOUR-REF-001

```text
Estado de este documento: BORRADOR. Ninguna directiva de aquí está emitida.
Emisión: solo Gemini Flash 3.8 High puede emitirlas, en agent-comms/inbox-claude/ o inbox-gpt/.
Autorización: cada una requiere la autorización de alcance de Johandry por escrito antes de emitirse.
Prerrequisito común: Fase 0 del plan cerrada en docs/decisions.md (F0-01 a F0-04 como mínimo).
Base de todas: origin/master 19190b1 o el HEAD que resulte del sprint anterior integrado por Gemini.
Formato: encabezados de la plantilla de Gemini (sartorial-flujo.md §3) con los campos añadidos en la sección 6 del plan.
Reglas transversales que cada directiva da por incluidas sin repetirlas: RULES.md §2 (DoD), §3 (niveles de parche), §4.7 (verificación cruzada); AGENTS.md; cero librerías; Web Components sobre ThemeCore.ThemeElement; CSS con variables; cero shopify:// en plantillas; 100 % t:; nada de código, paleta ni copy de Contour.
```

---

# CLAUDE-DIRECTIVE-7A-001: saneamiento P0 y P1 (secretos, catálogo demo, plantillas de desarrollador)

```text
ID: CLAUDE-DIRECTIVE-7A-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador y líder técnico temporal)
Copia: Johandry / Ruiz Digital (dueño); GPT (auditor)
Fecha: BORRADOR (pendiente de emisión)
Insumos: CLAUDE-PLAN-CONTOUR-REF-001.md §2 y §3 (7A), comparativa.md P0 y P1, transferencia.md §11 fila 17, agent-comms/BOARD.md §4.5, agent-comms/RULES.md
Estado: BORRADOR. Pendiente de emisión por Gemini y de autorización de Johandry
Autorización de alcance: Johandry, pendiente (F0-03, F0-09, F0-10)
Autorización Nivel 2: Gemini, pendiente (borrado de 2 plantillas y 2 secciones; cambio de defaults y lógica de 2 snippets; renombrado o confirmación del preset)
Rama / Base: origin/master 19190b1
Versión resultante: 1.0.1
Entrada de RELEASE-NOTES: "1.0.1: data integrity and cleanup" (más la entrada retroactiva 1.0.0)
Filas del ledger (IDs): crea L-06, L-07, C-24
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

La contraseña del storefront sigue en HEAD como fallback literal en dos scripts; hay 24 instantáneas HTML con el token público de Storefront API; dos snippets de la ficha infieren datos por handle, tipo o título del producto (lógica atada al catálogo demo, con dos cadenas visibles sin `t:`); y dos plantillas llevan documentación del desarrollador a la tienda del comerciante. Nada de esto es función nueva: es lo que hay que quitar antes de cualquier envío.

### Autorizaciones expresas de desviación Nivel 2

1. Borrado de `templates/page.documentation.json`, `templates/page.support.json`, `sections/main-documentation.liquid`, `sections/main-support.liquid` y de sus claves y CSS. Razón: contenido del desarrollador en la superficie del comerciante; el material vive en el repo `sartorial-docs`. (Pendiente F0-09.)
2. Cambio de lógica y defaults en `snippets/product-technical-specs.liquid` y `snippets/product-provenance.liquid`: se elimina toda inferencia sobre `product.handle`, `product.type` y `product.title`; los datos vienen de metafields y, si faltan, del setting del bloque sin transformación. Razón: claims no respaldados y comportamiento imprevisible en catálogos reales. (Pendiente F0-10 con la lista de metafields.)
3. Resolución del nombre del segundo preset según F0-03. Si Imprint: solo documentos y ledger. Si Edition: renombrar la clave en `config/settings_data.json`, la carpeta `listings/imprint/` y toda referencia. (Pendiente F0-03.)

## 2. Alcance técnico detallado

### Tarea 2.1: scripts de Gate 5 sin fallback de contraseña
- Archivos permitidos: `scripts/gate5-live-verify.mjs`, `scripts/gate5-complete-verification.mjs`, `scripts/capture-presets.mjs`.
- Cambio: leer solo `process.env.STOREFRONT_PASSWORD`; si falta, imprimir un mensaje de una línea y salir con código 1 antes de abrir cualquier navegador o petición.
- Criterio de aceptación: `rg -n "STOREFRONT_PASSWORD \|\|" scripts/` devuelve 0 líneas; ejecutar cada script sin la variable sale 1 con el mensaje; con la variable (Gemini la exporta en su entorno) funciona como antes.
- Subagente sugerido: uno (Opus 5.5).

### Tarea 2.2: limpieza de instantáneas y reglas de ignore
- Archivos permitidos: `.gitignore`, `tools/harness/AUDIT-360-002/html-validation/*` (solo `git rm --cached`). Si 7A se integra antes que 7B-T10, la carpeta sigue en `harness-AUDIT-360-002/html-validation/` y Gemini aplica el `git mv` y ajusta los patrones en la integración.
- Cambio: añadir `tools/harness/*/html-validation/` y `tools/harness/**/*headers.json` a `.gitignore` (con las rutas actuales `harness-*/html-validation/` y `harness-*/**/*headers.json` si 7A va primero); sacar del índice los 24 HTML.
- Criterio de aceptación: `git ls-files tools/harness | rg html-validation` = 0 (o `git ls-files 'harness-*' | rg html-validation` = 0 si 7A va primero); `rg -n "accessToken" --glob '!node_modules' .` no devuelve archivos versionados.

### Tarea 2.3: retirar plantillas y secciones de desarrollador
- Archivos permitidos: `templates/page.documentation.json`, `templates/page.support.json`, `sections/main-documentation.liquid`, `sections/main-support.liquid` (borrado); `locales/en.default.schema.json`, `locales/en.default.json`, `locales/es.json` (solo quitar las ramas `main_documentation` y `main_support` y las claves de storefront que solo ellas usen); `assets/base.css` (solo el bloque de documentación y soporte, identificado por sus selectores; nada más).
- Cambio exacto: borrar los 4 archivos; quitar las claves; quitar las reglas CSS cuyos selectores empiecen por los prefijos de esas dos secciones. No tocar `main-faq` ni `FaqFilter`.
- Criterio de aceptación: `gates:locales` sin huérfanas ni faltantes; `ls templates/*.json | wc -l` da 15; `rg -n "main-documentation|main-support|main_documentation|main_support" --glob '!agent-comms/**' --glob '!docs/**' .` da 0; Theme Check 0 ofensas.
- Johandry, antes del push: reasignar en las 4 tiendas cualquier página que use `page.documentation` o `page.support` a la plantilla `page`.

### Tarea 2.4: ficha de producto sin inferencias
- Archivos permitidos: `snippets/product-technical-specs.liquid`, `snippets/product-provenance.liquid`, `locales/en.default.schema.json`, `locales/en.default.json`, `locales/es.json`; `sections/main-product.liquid` solo si hace falta añadir `info` a los settings de los bloques `technical_specs` y `provenance`.
- Cambio exacto: en specs, eliminar `is_non_textile` y toda condición sobre `product.type` y `product.handle`; `material_val`, `gsm_val`, `hardware_val` se leen de `product.metafields.custom.material`, `custom.gsm`, `custom.hardware` (claves según F0-10) y, si están vacíos, del setting del bloque; eliminar `'Solid milled brass'` y `'Precision machined'`. En provenance, eliminar la condición sobre `p_title_lower` y `p_type_lower`; `provenance_year` se lee de `custom.provenance_year` y, si falta, del setting `circa_year` tal cual, sin heurística. Añadir `info` con `t:` a cada setting que dependa de un metafield, nombrando la clave exacta.
- Criterio de aceptación: `rg -n "brass|paperweight|contains '19'|contains '20'|is_non_textile" snippets/` da 0; sin metafields y con settings vacíos ningún bloque pinta una fila; con metafields pinta exactamente lo que dice el metafield; 5 estados degenerados documentados con capturas en `agent-comms/outbox-claude/harness-7A-001/`.
- Subagente sugerido: uno (Opus 5.5); revisión de Fable 5.1 sobre el diff.

### Tarea 2.5: nombre del segundo preset (según F0-03)
- Archivos permitidos si Imprint: `docs/requirements-ledger.md` (2 filas), `docs/decisions.md` (entrada nueva, la redacta Gemini y Claude solo la cita), tagline en `docs/decisions.md` si Johandry lo cambia. Si Edition: además `config/settings_data.json`, `listings/imprint/` (renombrar a `listings/edition/`), `listings/*/templates/*.json`, `agent-comms/BOARD.md` (lo edita Gemini).
- Criterio de aceptación: `rg -n "Imprint|Edition" config listings docs/requirements-ledger.md` devuelve un solo nombre.

### Tarea 2.6: versión y notas
- Archivos permitidos: `config/settings_schema.json` (solo `theme_version`), `RELEASE-NOTES.md` (nuevo; `release-notes.md` en minúsculas si F0-12 lo elige, y entonces se redacta para el comerciante porque viaja en el ZIP).
- Cambio: `theme_version` a `1.0.1`; `RELEASE-NOTES.md` con una entrada 1.0.0 (retroactiva, resumen) y una 1.0.1 (qué cambia para el comerciante: datos de producto por metafields, retirada de páginas de documentación del tema).
- Criterio de aceptación: `gates:package` produce `Sartorial-1.0.1.zip`.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Cinco estados degenerados en los dos bloques de ficha (vacío, uno solo, muchos, muy largo, faltante), con capturas.
- Consistencia: ningún umbral ni texto duplicado; ningún `Intl` nuevo.
- Superficie del comerciante: `info` en todo setting que dependa de metafield; sentence case; `t:` en todo.
- Ledger: `L-06` y `L-07` nacen y cierran en `cumplido` con evidencia `rg`; `C-24` nace en `código completo` hasta Gate 5 en las 3 demos.
- `npm run gates:static` exit 0 (8/8 en esta base).
- Gate 5: ficha en tema-qkqpke0j y en las 3 demos con producto con metafields y sin ellos, móvil 390 px.
- Gates obligatorios: static 8/8. Gate 5: `harness-7A-001/` con capturas y salida de consola.

## 4. Instrucciones de entrega para Claude

1. Confirmar en `docs/decisions.md` que F0-03, F0-09 y F0-10 están firmadas; si no, detenerse y reportar.
2. Implementar 2.1 a 2.6 con un subagente por tarea; integrar; correr `gates:static`.
3. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-7A-001.md` con la cabecera de RULES.md §1.4, diff combinado en `CLAUDE-REPORT-7A-001.diff`, arnés en `harness-7A-001/`.
4. Sin commit ni push. Gemini integra, verifica (`agent-comms/reviews/GEMINI-review-CLAUDE-7A-001.md`), commitea y despliega a tema-qkqpke0j; GPT audita en `agent-comms/outbox-gpt/GPT-AUDIT-022-saneamiento-7a.md`.
5. Dueños: emite Gemini; implementa Claude; audita GPT; verifica Gemini; commitea y despliega Gemini.

---

# CLAUDE-DIRECTIVE-7B-001: higiene de repo, estructura y compuertas nuevas

```text
ID: CLAUDE-DIRECTIVE-7B-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador). Parte 2.9 la ejecuta Gemini.
Copia: Johandry; GPT
Fecha: BORRADOR (pendiente de emisión)
Insumos: CLAUDE-PLAN-CONTOUR-REF-001.md §3 (7B) y §6, claude/estructura-repo.md §3, §4, §7 y §9, transferencia.md §10 y §6, contour-rechazos.txt §5 y §6
Estado: BORRADOR. Pendiente de emisión por Gemini y de autorización de Johandry
Autorización de alcance: Johandry, pendiente (F0-05, F0-06, F0-07, F0-11, F0-12; D17 estructura A, D19 AGENTS.md, D21 scripts de despliegue, D23 export-ignore, D24 .agents/teamwork)
Autorización Nivel 2: Gemini, pendiente (archivos nuevos en raíz; columna ID en el ledger; RULES.md 1.1; movimiento de carpetas a tools/ y agent-comms/archive/; salida de evidencias crudas a sartorial-evidence)
Rama / Base: chore/estructura-7B sobre el HEAD tras integrar 7A (o 19190b1 si corre en paralelo; Gemini resuelve RELEASE-NOTES, theme_version y .gitignore)
Versión resultante: 1.0.2
Entrada de RELEASE-NOTES: "1.0.2: packaging, fonts preconnect, accessibility of skip link" (archivo con el nombre que fije F0-12)
Filas del ledger (IDs): crea L-08, L-09, L-10, L-11, P-09, X-14
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

Contour pagó con varias rondas lo que Theme Check no detecta (tipos de grupo inválidos, richtext sin bloque, `theme_info` con dos campos de soporte, valores fuera de la grilla de `step`, CRLF que empuja `base.css` por encima de 100 KB). Sartorial convierte esas lecciones en compuertas y deja el repo documentado para humanos. Ningún CSS o JS de componente cambia.

Además, la auditoría estructural del 2026-10-18 (`claude/estructura-repo.md`) mostró que el tema está sano (`shopify theme package` da 94 archivos y 347 KB) y que lo que no sirve es el repo como objeto que se comparte: el Download ZIP de GitHub pesa 250 MB y el `.git` 220 MB, el 95 % por 621 archivos de evidencia. La CLI ya empaqueta por lista blanca y no lee `.shopifyignore` al empaquetar; el único archivo interno que llega al comerciante es `AGENTS.md`. Este sprint aplica la alternativa A: tema en la raíz de `master`, herramientas en `tools/`, evidencias crudas en un repo aparte y un único comando oficial para el ZIP.

### Autorizaciones expresas de desviación Nivel 2

1. Archivos nuevos en la raíz: `.gitattributes`, `.shopifyignore`, `LICENSE.md`, `DEVELOPMENT.md`; reescritura de `README.md` (el actual pasa a `docs/project-history.md`).
2. Columna `ID` en `docs/requirements-ledger.md` con prefijos A, P, X, C, S, L por sección, y cambio correspondiente en `scripts/ledger-verify.mjs`.
3. Scripts nuevos en `scripts/` (`package-theme.mjs`, `repo-weight.mjs`, `secrets-scan.mjs`, `scripts/deploy/`) y entradas nuevas en `package.json` y `.github/workflows/ci.yml`.
4. Commit separado para la renormalización de finales de línea.
5. Movimiento con `git mv` de las 9 `harness-*`, `cobertura-360-002.csv` y `.agents/teamwork`; borrado de `.playwright-mcp`; ajuste de rutas ignoradas en `.theme-check.yml` (sin apagar checks).
6. Salida del índice de las evidencias crudas (621 archivos) hacia `Noobprobro-web/sartorial-evidence`, con la misma ruta, y línea "Evidencia cruda" en los informes afectados.

## 2. Alcance técnico detallado

### Tarea 2.1 (7B-T1): `.gitattributes` y renormalización
- Archivos permitidos: `.gitattributes` (nuevo).
- Cambio: contenido de `claude/estructura-repo.md` §3 (borrador en `diseno/objetivo/.gitattributes`): `* text=auto eol=lf`; explícitos para `*.liquid`, `*.json`, `*.css`, `*.js`, `*.mjs`, `*.md`, `*.yml`, `*.svg`; binarios marcados; `*.json linguist-language=jsonc`. `export-ignore` para `agent-comms/` y `tools/` solo si D23 lo aprueba. Claude no ejecuta `git add --renormalize .` (lo hace Gemini en su commit separado); solo reporta `git ls-files --eol | rg crlf | wc -l` antes.
- Criterio: `git ls-files --eol | rg -c "i/crlf"` = 0; el commit de renormalize de Gemini tiene menos de 10 archivos (el índice ya está 100 % LF); el tamaño de `base.css` no sube.

### Tarea 2.2 (7B-T2, reescrita): `.shopifyignore`
- Archivos permitidos: `.shopifyignore` (nuevo).
- Cambio: solo lo que `theme push`, `pull` y `dev` pueden leer: `AGENTS.md`, `DESIGN.md`, `*.zip`, `*.map`, `*.orig`, `*.rej`, `*.bak`, `*.tmp`, `.DS_Store`, `Thumbs.db`, `config/*.local.json`, `templates/*.temp.json`. Nada de `agent-comms/`, `harness-*/`, `docs/`, `scripts/`, `tests/`, `package*.json` ni `listings/**`: la CLI no los lee y los patrones de carpeta con barra final disparan el aviso "Directory pattern may be misleading". Borrador en `diseno/objetivo/.shopifyignore`.
- Criterio: `rg -n "^(docs|scripts|tests|agent-comms|package)" .shopifyignore` = 0; `npx shopify theme dev` arranca sin el aviso "Directory pattern may be misleading"; en el tema de desarrollo no aparece `AGENTS.md` tras un `theme push --nodelete` (lo ejecuta Gemini y pega la salida).

### Tarea 2.2b (7B-T2b, nueva): `package-theme.mjs` y `gates:package` verificado
- Archivos permitidos: `scripts/package-theme.mjs` (nuevo), `package.json` (solo `theme:package` y `gates:package`). `.gitignore` ya tiene `dist/`.
- Cambio: el script copia a una carpeta de `os.tmpdir()` (nunca `.tmp/` del repo) solo las carpetas del tema, `listings/<preset>/{templates,sections}` y `release-notes.md` si existe (F0-12); llama a `shopify theme package --path <temporal>`; deja `dist/Sartorial-<theme_version>.zip`; borra el staging en `finally`. Con `--verify` lee el directorio central del ZIP sin dependencias y falla si entra un archivo fuera de la lista blanca, si falta `layout/theme.liquid`, `config/settings_schema.json` o `config/settings_data.json`, o si pasa de 50 MB. `npm run theme:package` genera; `gates:package` ejecuta `node scripts/package-theme.mjs --verify`. Borrador en `diseno/objetivo/scripts/package-theme.mjs`.
- Criterio: `npm run theme:package` imprime "Manifest OK"; `unzip -Z1 dist/*.zip` solo tiene `assets/ config/ layout/ locales/ sections/ snippets/ templates/ listings/*/templates/`; `diff` de la lista contra el ZIP actual de 94 archivos = solo falta `AGENTS.md`; prueba negativa con `DESIGN.md` y `listings/sartorial/preview.png` en el árbol sigue limpia (salida pegada en el informe). PF-12 del preflight pasa a usar este comando.

### Tarea 2.3 (7B-T3 a T5): README, DEVELOPMENT, LICENSE
- Archivos permitidos: `README.md`, `DEVELOPMENT.md` (nuevo), `LICENSE.md` (nuevo), `docs/project-history.md` (nuevo, con el README actual).
- Cambio: README en inglés, corto: qué es Sartorial, 3 presets, requisitos (Node 22.12, Shopify CLI), tabla de carpetas con "ships to merchants" sí/no, `npm run gates:static`, aviso de no usar el Download ZIP de GitHub ni `shopify theme package` directo (el ZIP sale de `npm run theme:package`), `core.autocrlf=false`, enlaces a docs y soporte de `theme_info`, licencia. Borrador en `diseno/objetivo/README.md`. DEVELOPMENT.md: tiendas y presets (sin contraseñas, nunca), cómo correr cada gate, cómo añadir una sección (schema con `t:`, locales en/es, `enabled_on`, módulo JS propio con `defer` y guarda `customElements.get`, hoja CSS propia, estados degenerados), cómo liberar una versión (theme_version, notas de versión según F0-12, `npm run theme:package`, push). LICENSE.md comercial sin sección de terceros.
- Criterio: `rg -n "password|contraseña" README.md DEVELOPMENT.md` da 0; GPT lo lee como comerciante técnico; ningún secreto; enlaces de docs y soporte responden 200.

### Tarea 2.4 (7B-T6): layout
- Archivos permitidos: `layout/theme.liquid`, `layout/password.liquid`, `assets/base.css` (solo reglas de `.skip-link` si cambia el selector).
- Cambio: `preconnect` a `https://fonts.shopifycdn.com` con `crossorigin` solo si `settings.type_body_font.system?` es falso; `preload_tag` de los dos archivos de fuente regulares (cuerpo y titular) vía `font_url`; favicon SVG inline neutro cuando `settings.favicon` está vacío (marca tipográfica en el color del esquema, sin ningún logotipo); skip link envuelto en `<nav aria-label>` con `t:`.
- Criterio: con fuente de sistema no hay `preconnect`; axe no marca "content outside landmarks" en la home; Lighthouse Best Practices no reporta 404 de favicon.

### Tarea 2.5 (7B-T7): `json-validate.mjs` ampliado
- Archivos permitidos: `scripts/json-validate.mjs`.
- Cambio: tres comprobaciones nuevas además del parseo: a) 0 ocurrencias de `shopify://` en `templates/**` y `listings/**`; b) cada valor numérico de `config/settings_data.json` (`current` y `presets`) y de `listings/**/templates/*.json` cuyo setting en el schema sea `range` cae en `min + n * step` y dentro de `[min, max]`; c) si existe `listings/<preset>/listing.json`: campos obligatorios, `tagline` ≤ 70, `highlights[].title` ≤ 30, `highlights[].description` ≤ 140; si existen PNG: cabecera IHDR con dimensiones exactas (2000x2496, 750x1334, 1600x1200) y tamaño < 1 MB; d) ninguna plantilla JSON con más de 25 entradas en `order`.
- Criterio: demostración por mutación y restauración (inyectar un `shopify://`, un valor fuera de `step`, una 26.ª sección) con la salida pegada; sobre el árbol limpio sale 0.

### Tarea 2.6 (7B-T7): `locale-key-inventory.mjs` ampliado
- Archivos permitidos: `scripts/locale-key-inventory.mjs`, `scripts/translations/identical-allowlist.json` (nuevo).
- Cambio: paridad estructural de todo `locales/*.json` con su `en.default` (claves aplanadas iguales, 0 sobrantes, 0 faltantes, 0 `null`); cadenas idénticas al inglés fuera de la lista blanca se listan y hacen fallar el gate; pluralización `one`/`other` y variables `{{ }}` deben coincidir.
- Criterio: las 6 cadenas idénticas ya auditadas de `es.json` están en la lista blanca con motivo; mutación de prueba falla.

### Tarea 2.7 (7B-T7): `secrets-scan.mjs` y `gates:syntax` con glob
- Archivos permitidos: `scripts/secrets-scan.mjs` (nuevo), `package.json` (`gates:secrets`, `gates:syntax`, `gates:static`).
- Cambio: el escáner recorre archivos versionados (`git ls-files`) y falla ante `process.env.[A-Z_]+ \|\| ['"]`, `_shopify_(y|s|essential)`, `shpat_`, `shpca_`, `shpss_`, cabeceras `Cookie:` con valores, y cualquier literal que Gemini añada en una lista en el propio script. `gates:syntax` pasa a `for f in assets/*.js; do node --check "$f"; done` o equivalente en Node.
- Criterio: con el árbol de 7A integrado sale 0; inyectar un fallback de prueba lo hace fallar.

### Tarea 2.8 (7B-T7 y T8, ajuste): `ledger-verify.mjs` con IDs y CI
- Archivos permitidos: `scripts/ledger-verify.mjs`, `docs/requirements-ledger.md` (añadir columna `ID` a las 60 filas, sin cambiar estados ni evidencia), `.github/workflows/ci.yml`.
- Cambio: columna `ID` como primera columna, única, con prefijo de sección; el script falla si falta, se repite o no coincide con la sección. CI con `node-version-file: .nvmrc` en vez de un número (cierra Node 20 frente a 22.12.0), pasos para `gates:secrets`, el `gates:syntax` nuevo y `gates:weight` antes de `gates:package`, que ya verifica el manifiesto.
- Criterio: `node scripts/ledger-verify.mjs` exit 0 con 60 filas y 60 IDs; CI con 10 pasos en verde en la rama de Gemini.

### Tarea 2.9 (7B-T9; Gemini, no Claude): decisiones retroactivas y BOARD
- Archivos: `docs/decisions.md` (entradas con fecha real para MOTION-002, Lenis, marquee-drift, layout de contraseña, Imprint, URLs en GitHub Pages; más la entrada de la estructura del repo con D17 a D24), `docs/decisions-pending.md` (cerrar DP-001 bien, actualizar DP-002), `agent-comms/BOARD.md` (referencias "Fila nn" sustituidas por IDs), `agent-comms/RULES.md` 1.1 (regla única de Nivel 2 según F0-04), `AGENTS.md` (misma redacción de roles y modelos).
- Criterio: Claude verifica adversarialmente en `agent-comms/reviews/CLAUDE-review-GEMINI-7B-001.md`.

### Tarea 2.10 (7B-T10, nueva): movimientos a `tools/` y archivo de briefs
- Archivos permitidos: `harness-4D-00{1,2,3}/`, `harness-4E-00{1,2,3}/`, `harness-AUDIT-360-00{1,2}/`, `harness-COMP-001/` (solo `git mv` a `tools/harness/<ID>/`); `cobertura-360-002.csv` (`git mv` a `tools/harness/AUDIT-360-002/`); `.agents/teamwork/` (`git mv` a `agent-comms/archive/teamwork-audit360/`, D24); `.playwright-mcp/` (`git rm`); `.theme-check.yml` (solo sustituir `harness-*/**`, `.agents/**`, `.playwright-mcp/**` por `tools/**`, `evidence/**`, `dist/**`); `tools/harness/README.md` (nuevo, tabla ruta vieja a ruta nueva; borrador en `diseno/objetivo/tools/harness/README.md`).
- Prohibido: reescribir rutas en documentos históricos de `agent-comms/` o `docs/`; tocar `scripts/`, `tests/`, `package.json`, `ci.yml` o `playwright.config.mjs` por este movimiento (ninguno referencia esas carpetas).
- Criterio: `ls -d harness-* .agents .playwright-mcp cobertura-360-002.csv` vacío; `npm run gates:static` exit 0; Theme Check 0 ofensas sobre el mismo número de archivos que antes (92 en 19190b1); `npx playwright test --list` 2 tests; `git status` sin archivos sin seguimiento.

### Tarea 2.11 (7B-T11, nueva): política de evidencias y `gates:weight`
- Archivos permitidos: `scripts/repo-weight.mjs` (nuevo), `package.json` (`gates:weight` y `gates:static`), `.gitignore` (`.playwright-mcp/`, `evidence/` y patrones de evidencia cruda bajo `agent-comms/**` y `tools/**`: png, jpg, webp, pdf, har, `raw-*.json`, `html-validation/`; se conservan `scratch/`, `*.zip`, `dist/`, `.agents/`), los 621 archivos de evidencia cruda de `agent-comms/outbox-*/harness-*`, `docs/gate5-reports/lh-*.json` y `tools/harness/AUDIT-360-002/html-validation/` (solo `git rm --cached` tras copiarlos a `../sartorial-evidence/` con la misma ruta), los informes afectados (LEAD-001, MOTION-002, TECH-AUDIT-001, 4F-001, 4F-002, AUDIT-FINAL-002/003, 5A-001, DOCS-VERIFY-001, GPT-018, gate5-reports; solo añadir la línea "Evidencia cruda: sartorial-evidence/<ruta> (sha pendiente)"), `agent-comms/RULES.md` §1.4 y `AGENTS.md` (sección corta "Rutas y evidencias": `tools/harness/`, repo de evidencias, `npm run theme:package` como único ZIP, `dist/` ignorado, salida local en `evidence/<ID>/`).
- Cambio: `repo-weight.mjs` usa `git ls-files` y falla si hay PNG, JPG, PDF, HAR o ZIP fuera de `assets/` y `listings/`, JSON de más de 300 KB fuera del tema, cualquier archivo de más de 1 MB fuera de `assets/`, o árbol de más de 40 MB. Las 3 evidencias que cita el ledger (`.mjs`, `.txt` y un JSON de 315 B) no se mueven. Borrador en `diseno/objetivo/scripts/repo-weight.mjs`.
- Requisito previo: F0-11 firmada y `sartorial-evidence` creado por Johandry con acceso para los 4 entornos (`git ls-remote` responde).
- Criterio: `gates:weight` exit 0 y árbol < 20 MB; `git archive --format=zip HEAD` < 10 MB; `node scripts/ledger-verify.mjs` 0 incoherencias; las 3 evidencias del ledger existen; `diff` de listas entre lo exportado y `sartorial-evidence` vacío.

### Tarea 2.12 (7B-T12, nueva; depende de que Johandry entregue los archivos, D21)
- Archivos permitidos: `scripts/deploy/deploy-presets.mjs`, `scripts/deploy/verify-dev-previews.mjs`, `scripts/deploy/verify-presets-live.mjs`, `scripts/deploy/targets.json` (nuevos), `package.json` (`deploy:dev`, `deploy:demos`, `verify:live`).
- Cambio: Johandry entrega los scripts de `scratch/`; GPT escanea secretos antes; Claude los adapta: tiendas y theme IDs en `targets.json` (los de BOARD §14), credenciales solo por variables de entorno, opción `--dry-run`.
- Criterio: `gates:secrets` exit 0 sobre `scripts/deploy`; `rg -n "password|shpat_|shptka_" scripts/deploy` = 0; `npm run deploy:dev -- --dry-run` lista las 6 instancias con sus theme IDs de BOARD §14. Si los archivos no llegan, la tarea sale del sprint sin bloquearlo.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados: no aplica a componentes; aplica a los gates (árbol limpio, mutación, archivo ausente) y al paquete (prueba negativa con archivos ajenos en el árbol).
- Consistencia: los umbrales de dimensiones, límites de caracteres, pesos y la lista blanca del paquete viven una sola vez en cada script.
- Superficie del comerciante: solo el `aria-label` del skip link, con `t:`; el ZIP pierde `AGENTS.md` y nada más.
- Ledger: `L-08`, `L-09` ("Paquete limpio generado por `scripts/package-theme.mjs` y verificado contra lista blanca"), `L-10` y `L-11` ("Repositorio sin evidencias crudas ni secretos; Download ZIP menor de 10 MB", evidencia `gates:weight` y `git archive`) en `cumplido`; `P-09` y `X-14` en `código completo` hasta medición.
- `npm run gates:static` exit 0 con 10 compuertas (las 8 actuales, `gates:secrets` y `gates:weight`).
- Gates obligatorios: static 10/10, CI con 10 pasos en verde. Gate 5: axe de la home con el skip link nuevo; Lighthouse Best Practices sin 404 de favicon; `AGENTS.md` ausente del tema de desarrollo tras el push.

## 4. Instrucciones de entrega para Claude

1. Antes de empezar, Gemini hace `git clone --mirror` del repo a un disco fuera de OneDrive y lo guarda hasta cerrar la reescritura (F0-02). Claude trabaja en la rama `chore/estructura-7B`.
2. Un subagente por tarea 2.1 a 2.8 y 2.10 a 2.12; Fable 5.1 revisa el diseño de 2.2b y de 2.5 a 2.8 antes de escribir. Orden: 2.10 (movimientos), luego 2.1, 2.2, 2.2b, 2.3 y gates, y 2.11 (evidencias) al final.
3. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-7B-001.md` (incluye lo que la estructura objetivo llamaba `CLAUDE-REPORT-7B-ESTRUCTURA-001`), diff en `.diff`, salidas de cada gate pegadas y diffs de listas del ZIP y de la exportación.
4. Sin commit ni push. Gemini hace los commits: "chore: normalize line endings"; "chore: move harnesses and agent briefs under tools/ and agent-comms/archive"; "chore: packaging script, weight gate, gitattributes, shopifyignore, README"; "chore: move raw evidence to sartorial-evidence"; y el de contenido restante. Push de `sartorial-evidence` primero y sustitución de "sha pendiente" por el sha real. Verifica en `reviews/GEMINI-review-CLAUDE-7B-001.md`; GPT audita en `GPT-AUDIT-023-higiene-7b.md` (README, DEVELOPMENT, licencia, superficie, y además ZIP, peso y evidencias: `gates:static` desde clon limpio, `unzip -Z1` contra el paquete actual, `rg` de rutas viejas en scripts, tests, CI y `package.json` = 0, `rg` de secretos = 0, `diff -r` de listas de evidencias).
5. Dueños: emite Gemini; implementa Claude (2.1 a 2.8, 2.10 a 2.12) y Gemini (2.9); Johandry crea `sartorial-evidence` y entrega los scripts de despliegue; audita GPT; verifica Gemini sobre Claude y Claude sobre Gemini; commitea y despliega Gemini. La reescritura del historial (F0-02) no es parte de esta directiva: la ejecuta Gemini con autorización escrita de Johandry en la ventana entre 7B y 7C.

---

# CLAUDE-DIRECTIVE-7C-001: extensibilidad y navegación (`@app`, migas, ThemeCore)

```text
ID: CLAUDE-DIRECTIVE-7C-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador)
Copia: Johandry; GPT
Fecha: BORRADOR (pendiente de emisión)
Insumos: CLAUDE-PLAN-CONTOUR-REF-001.md §3 (7C), transferencia.md §9 y §12, comparativa.md P1 (@app)
Estado: BORRADOR. Pendiente de emisión por Gemini y de autorización de Johandry
Autorización de alcance: Johandry, pendiente (setting visible show_breadcrumbs)
Autorización Nivel 2: Gemini, pendiente (tipo @app en 7 secciones; setting nuevo en 4 secciones; snippet nuevo; refactor de inert en theme.js)
Rama / Base: HEAD tras integrar 7A y 7B
Versión resultante: 1.1.0 (candidato de envío)
Entrada de RELEASE-NOTES: "1.1.0: app blocks everywhere, breadcrumbs, focus management"
Filas del ledger (IDs): crea C-25, C-26; modifica A-05 (Bloques de Aplicación)
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

Tres mejoras baratas que los revisores y las apps grandes esperan en un tema de pago, sin abrir los monolitos: bloques de app fuera de la ficha, migas de pan accesibles y un `ThemeCore` con un solo dueño del `inert` y una sola respuesta a "¿se permite movimiento?". Ningún archivo JS nuevo: el patrón de módulo se fija en 8A.

### Autorizaciones expresas de desviación Nivel 2

1. `{"type": "@app"}` en los schemas de `main-collection`, `main-cart-items`, `cart-drawer`, `footer`, `header`, `main-page`, `main-article`, con render `{% when '@app' %}{% render block %}` y `block.shopify_attributes`. Razón: extensibilidad exigida por las guías de instalación de apps de reseñas y wishlist.
2. Setting `show_breadcrumbs` (checkbox, default `false`) en `main-product`, `main-collection`, `main-article`, `main-page`. Razón: no alterar las demos ni las capturas; el comerciante lo activa.
3. Refactor interno de `assets/theme.js`: `applyBackgroundInert` y `restoreBackgroundInert` pasan a `ThemeCore`; se añade `ThemeCore.motionAllowed()`. Razón: una sola fuente para un comportamiento de accesibilidad; prerrequisito de los diálogos de 9A y 9B.

## 2. Alcance técnico detallado

### Tarea 2.1: `@app` en siete secciones
- Archivos permitidos: `sections/main-collection.liquid`, `sections/main-cart-items.liquid`, `sections/cart-drawer.liquid`, `sections/footer.liquid`, `sections/header.liquid`, `sections/main-page.liquid`, `sections/main-article.liquid`.
- Cambio exacto: en cada schema añadir `{"type": "@app"}` a `blocks`; en el markup, dentro del `{% for block in section.blocks %}` existente (o uno nuevo mínimo en las secciones sin bloques), el `case` con `@app`. Posiciones: colección en la cabecera y entre filtros y grilla; carrito y cajón bajo el resumen; footer en una fila propia; header en la barra de utilidades; página y artículo bajo el contenido. En el cajón, comprobar que `renderSection` por Section Rendering conserva el bloque y no duplica scripts de la app.
- Criterio: `rg -ln "'@app'" sections/*.liquid | wc -l` da 9; GPT instala 2 apps reales (una de reseñas, una de wishlist) en tema-qkqpke0j y las ve en las 5 superficies; `gates:hooks` sin contratos rotos; 0 errores de consola al abrir y cerrar el cajón con bloque de app.
- Subagentes: uno por sección (7, Opus 5.5).

### Tarea 2.2: migas de pan
- Archivos permitidos: `snippets/breadcrumbs.liquid` (nuevo), `sections/main-product.liquid`, `sections/main-collection.liquid`, `sections/main-article.liquid`, `sections/main-page.liquid` (solo el render y el setting), `assets/base.css` (bloque nuevo `.breadcrumbs` al final del bloque de tipografía, no al final del archivo), `locales/en.default.json`, `locales/es.json`, `locales/en.default.schema.json`.
- Cambio exacto: `<nav aria-label="{{ 'general.breadcrumbs.label' | t }}">` con `<ol>`, separador `aria-hidden="true"`, último elemento con `aria-current="page"`, objetivos de 44 px, voz de eyebrow (versalitas, regla fina) con tokens existentes. Colección padre: `collection` cuando la URL es `within` (comprobar `collection.url` en `product.url`), si no `product.collections.first`; si no hay, solo Home y producto. Artículo: Home, blog, artículo. Página: Home, página. Nada de JS.
- Criterio: con `show_breadcrumbs: false` no se renderiza nada (0 markup); axe limpio; con teclado y lector en móvil a 390 px; 5 estados degenerados (producto sin colección, título de 120 caracteres, colección anidada, página raíz, artículo sin blog).
- Subagente: uno (Opus 5.5).

### Tarea 2.3: `ThemeCore` con un solo dueño del inert y `motionAllowed()`
- Archivos permitidos: `assets/theme.js`.
- Cambio exacto: definir `applyBackgroundInert(root)` y `restoreBackgroundInert()` una vez junto a `trapFocus` y exportarlas en `ThemeCore`; sustituir las copias en los componentes que las duplican (hoy en torno a las líneas 336, 1467, 2483, 5220 y las que `rg` encuentre); añadir `motionAllowed()` que devuelva `html.dataset.animations !== 'none' && !html.dataset.reducedMotion`, y usarla en los 3 `matchMedia` existentes sin cambiar su comportamiento observable. Verificar en consola (Chromium) que no queda `InvalidStateError` de `pageswap` al ir a checkout; si queda, añadir el `catch` mínimo en el script inline del `<head>` (`layout/theme.liquid`, en ese caso permitido para esa línea).
- Criterio: `rg -c "function applyBackgroundInert|applyBackgroundInert = " assets/theme.js` da 1; `node --check` pasa; el cajón, el menú móvil, el quick buy picker, el zoom, la búsqueda y la guía de tallas siguen dejando el fondo `inert` y lo restauran (prueba manual con captura del atributo); `gates:hooks` sin cambios de contrato.
- Subagente: uno (Fable 5.1, por tocar el núcleo).

### Tarea 2.4: versión y notas
- Archivos permitidos: `config/settings_schema.json` (`theme_version`), `RELEASE-NOTES.md`.
- Criterio: `dist/Sartorial-1.1.0.zip` producido por `npm run theme:package` y verificado por `gates:package --verify`.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados de las migas y del render de `@app` con 0 bloques.
- Consistencia: ningún selector de `inert` duplicado; tokens existentes en `.breadcrumbs`.
- Superficie del comerciante: label e `info` de `show_breadcrumbs` con `t:`, sentence case.
- Ledger: `C-25`, `C-26` en `código completo`; A-05 modificada para citar 9 secciones.
- `npm run gates:static` exit 0 (10/10).
- Gates obligatorios: static 10/10. Gate 5: 2 apps instaladas en tema-qkqpke0j, migas en móvil, inert en 6 superficies; capturas y consola en `harness-7C-001/`.

## 4. Instrucciones de entrega para Claude

1. 2.1 y 2.2 en paralelo; 2.3 después de 2.1 (ambos tocan `cart-drawer.liquid` solo en 2.1, pero 2.3 toca el JS del cajón).
2. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-7C-001.md` con la cabecera de RULES.md §1.4; medir una corrida de Lighthouse móvil de referencia en la home de la demo Sartorial y pegarla (anticipo de PF-06).
3. Sin commit ni push. Dueños: emite Gemini; implementa Claude; audita GPT (`GPT-AUDIT-024-extensibilidad-7c.md`); verifica Gemini (`GEMINI-review-CLAUDE-7C-001.md`); commitea y despliega Gemini a tema-qkqpke0j y a las 3 demos.

---

# CLAUDE-DIRECTIVE-PREFLIGHT-001 y GPT-TASK-025: preflight Theme Store

```text
ID: CLAUDE-DIRECTIVE-PREFLIGHT-001 (inbox-claude) y GPT-TASK-025-preflight-theme-store (inbox-gpt)
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (lista, script, recertificación); GPT (ejecución independiente de la lista en las 3 demos)
Copia: Johandry (ejecuta PF-01, PF-02, PF-05 parcial, PF-16 y el envío)
Fecha: BORRADOR (pendiente de emisión)
Insumos: contour-rechazos.txt §3, §4, §6; CLAUDE-PLAN-CONTOUR-REF-001.md §3 (PREFLIGHT-001); página pública de requisitos de la Theme Store (consultar en la fecha de emisión); docs/shopify-theme-store-checklist.md y acceptance-matrix existentes
Estado: BORRADOR. Pendiente de emisión por Gemini y de autorización de Johandry
Autorización de alcance: Johandry, pendiente (D12 umbral de Lighthouse; D15 contraseña de demos)
Autorización Nivel 2: no aplica al tema (solo docs y scripts)
Rama / Base: HEAD tras integrar 7C, desplegado a tema-qkqpke0j y a las 3 demos
Versión resultante: 1.1.0 confirmada como paquete de envío
Entrada de RELEASE-NOTES: ninguna nueva
Filas del ledger (IDs): crea P-10, L-16; cierra o re-abre las 6 filas en código completo (35, 38, 56, 57, 58, 75) y P-09, X-14, C-24, C-25, C-26
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

Contour acumuló rechazos de subida e importación que Theme Check no detecta y pasó varias rondas de corrección contra la página pública. Este sprint convierte esa experiencia en una lista que se ejecuta y se firma antes de cada envío. Nada se corrige aquí: un fallo abre un hotfix `7D-00n` con su propia directiva o abre 8A si falla el rendimiento.

### Autorizaciones expresas de desviación Nivel 2

Ninguna sobre el tema. Se autoriza crear `docs/theme-store-preflight.md`, `scripts/preflight.mjs` y la entrada `gates:preflight` (fuera de `gates:static`, porque necesita red y credenciales).

## 2. Alcance técnico detallado

### Tarea 2.1 (Claude): `docs/theme-store-preflight.md`
- Archivos permitidos: `docs/theme-store-preflight.md` (nuevo).
- Contenido: tabla con `ID | Qué se comprueba | Cómo (comando o pasos) | Evidencia esperada | Quién | Automatizable`. Ítems PF-01 a PF-16 tal como los define el plan §3 (nombre sin colisiones; `theme_info` con un solo canal de soporte y 2 días hábiles; preview de las 16 plantillas tras cambios de schema; máximo 25 secciones por plantilla; una demo por preset con estado de instalación igual a la demo, sin `shopify://`, imágenes propias, copy auténtico, sin marcas ajenas ni claims, pasarela de prueba; Lighthouse móvil y escritorio en demo real con 3 corridas y mediana; axe con estados ocultos; contraste, objetivos de 24 px, foco, menú de 3 niveles; funciones obligatorias; licencias y sin restos de starters; handles de fuente válidos; ZIP generado por `npm run theme:package` y verificado con `gates:package --verify`; CSV de demo; versión y notas; gates en verde; material del formulario). Cada ítem cita por nombre la sección de la página pública, no un número de brief interna.
- Criterio: GPT puede ejecutar la lista sin preguntar nada; cada ítem tiene evidencia definida.
- Subagente: Haiku 4.5 investiga la página pública vigente y propone el mapeo; Opus 5.5 redacta.

### Tarea 2.2 (Claude): `scripts/preflight.mjs`
- Archivos permitidos: `scripts/preflight.mjs` (nuevo), `package.json` (`gates:preflight`).
- Cambio: ejecuta lo automatizable (URLs de `theme_info` con HTTP 200 y un solo campo de soporte; `order` ≤ 25; 0 `shopify://`; diff de `listings/<preset>/templates` contra un `shopify theme pull` previo a una carpeta temporal fuera del repo; `npm run theme:package` y `gates:package --verify`; coincidencia `theme_version` con las notas de versión (nombre según F0-12) y nombre del ZIP; `gates:static` y `gates:secrets`) y escribe `docs/gate5-reports/preflight-<fecha>.md` con todos los ítems, marcando los manuales como pendientes de firma. Sin dependencias; credenciales solo por variables de entorno; falla cerrado si faltan.
- Criterio: exit 0 en el árbol de 1.1.0; el reporte generado está en el repo.

### Tarea 2.3 (Claude): recertificación de filas en `código completo`
- Archivos permitidos: `docs/requirements-ledger.md`, `agent-comms/outbox-claude/harness-PREFLIGHT-001/` (nuevo).
- Cambio: correr `harness-MOTION-002` en los 3 presets (filas 38, 56, 57, 58), punto focal y 3D con los fixtures de Johandry (35, 75), axe y Lighthouse de P-09, X-14, C-24, C-25, C-26. Cada fila pasa a `cumplido` solo con reporte adjunto, o se queda con dueño y fecha.
- Criterio: `node scripts/ledger-verify.mjs` exit 0; conteo en la cabecera actualizado.

### Tarea 2.4 (GPT, `GPT-TASK-025`): ejecución independiente
- Archivos permitidos: `agent-comms/outbox-gpt/GPT-AUDIT-025-preflight-theme-store.md`, `agent-comms/outbox-gpt/harness-GPT-025/`.
- Cambio: ejecutar PF-05 a PF-09 y PF-13 en las 3 demos y en tema-qkqpke0j sin leer el informe de Claude antes; Lighthouse con 3 corridas por caso (3 presets x 3 plantillas x 2 dispositivos) y mediana; axe en 16 plantillas a 1440 y 390 px con cajón, menú móvil, quick buy, zoom, búsqueda y selector de país abiertos.
- Criterio: tabla de 18 medianas de Lighthouse, tabla de axe por plantilla y estado, lista de ítems con veredicto y evidencia; dictamen GO / NO-GO razonado.

### Tarea 2.5 (Johandry): PF-01, PF-02, PF-05 parcial, PF-16
- Comprobar el nombre del tema y de los 3 presets en themes.shopify.com con captura y fecha; publicar en `sartorial-docs` la página de soporte sin `mailto` ajeno y con "2 business days"; confirmar pasarela de prueba y nombre visible de cada tienda demo; preparar tagline, descripción, capturas provisionales y highlights (las definitivas llegan en 10C).

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados: no aplica.
- Consistencia: el umbral de Lighthouse vive en `docs/theme-store-preflight.md` y en `preflight.mjs` como constante única.
- Superficie del comerciante: no aplica.
- Ledger: `P-10` nace `no verificado` y cierra con la tabla de medianas; `L-16` cierra con la firma de GPT y la review de Gemini.
- `npm run gates:static` 10/10 y `gates:preflight` exit 0.
- Gate 5: es este sprint entero.
- Regla de decisión (D12, pendiente): mediana móvil de rendimiento ≥ 70 en los 9 casos: GO para 1.1.0; entre 60 y 70 en alguno: Johandry decide; menor que 60 en alguno: NO-GO y se emite 8A antes del envío.

## 4. Instrucciones de entrega

1. Claude: 2.1 y 2.2 en paralelo; 2.3 cuando Gemini confirme el despliegue a las 6 instancias. Informe `agent-comms/outbox-claude/CLAUDE-REPORT-PREFLIGHT-001.md`.
2. GPT: 2.4 en paralelo con 2.3, sin leer el informe de Claude hasta terminar; informe `GPT-AUDIT-025-preflight-theme-store.md`.
3. Gemini: review `agent-comms/reviews/GEMINI-review-PREFLIGHT-001.md` con medición propia de PF-06 en al menos un preset; GO/NO-GO en BOARD.md; Johandry ratifica y envía `Sartorial-1.1.0.zip`.
4. Dueños: emite Gemini; implementa Claude; audita GPT; verifica Gemini; despliega Gemini; envía Johandry.

---

# CLAUDE-DIRECTIVE-8A-001: partición de theme.js en núcleo y módulos por sección

```text
ID: CLAUDE-DIRECTIVE-8A-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador)
Copia: Johandry; GPT
Fecha: BORRADOR (pendiente de emisión)
Insumos: CLAUDE-PLAN-CONTOUR-REF-001.md §3 (8A), transferencia.md §3 y §11 filas 4, 7, 8, 11, 22; assets/product-zoom.js como patrón
Estado: BORRADOR. Pendiente de emisión por Gemini y de autorización de Johandry
Autorización de alcance: Johandry, pendiente (cambio de experiencia en featured-product)
Autorización Nivel 2: Gemini, pendiente (hasta 18 archivos nuevos en assets/; etiquetas script en secciones y snippets; carga condicional en layout; featured-product con picker de tarjeta)
Rama / Base: HEAD tras el GO de PREFLIGHT-001 (o tras el envío de 1.1.0)
Versión resultante: 1.2.0
Entrada de RELEASE-NOTES: "1.2.0: faster pages, JavaScript loaded per section"
Filas del ledger (IDs): crea P-11; modifica A-01 (JavaScript Modular Vanilla); re-mide P-10
Prohibido en este sprint: tocar assets/base.css más allá de selectores que un módulo mueva consigo (ninguno previsto). 8B no se abre hasta que 8A esté integrado y certificado.
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

`theme.js` pesa 240,7 KB (56,9 KB gz) y viaja a todas las páginas. Contour reparte en 24 archivos pero los inyecta tras el FCP, los oculta a Theme Check y apaga `AssetSizeJavaScript`. Sartorial hace lo contrario: cada sección declara su `<script defer>` estático, el núcleo baja a menos de 10 KB gz, ningún check se apaga y el peso por plantilla se mide y se publica. La técnica ya está probada en `assets/product-zoom.js`.

### Autorizaciones expresas de desviación Nivel 2

1. Archivos nuevos en `assets/`: `cart-drawer.js`, `cart-drawer-extras.js`, `predictive-search.js`, `product-card.js`, `product.js`, `facets.js`, `motion.js`, `lookbook.js`, `complete-the-look.js`, `hero-editorial.js`, `curated-showcase.js`, `marquee.js`, `product-recommendations.js`, `recently-viewed.js`, `content.js`, `password.js`. Cada uno es un IIFE que empieza con `if (!window.ThemeCore) return;` y define sus elementos con guarda `customElements.get`. Sin módulos ES, sin bundler, sin minificar.
2. Etiquetas `<script src="{{ 'x.js' | asset_url }}" defer></script>` en las secciones y snippets dueños (nunca `script_tag`). En `request.design_mode`, `layout/theme.liquid` carga todos los módulos con `defer`.
3. `sections/featured-product.liquid` deja de usar `VariantSelects` y la galería completa y pasa al picker de `ProductCardVariants`. Razón: quitar `product.js` de la home de los 3 presets.
4. `cart-drawer-extras.js` (recomendaciones, cross-sell con opciones, rewards, nota) se inyecta al primer `open()` del cajón con `document.head.append(script)`; es la única carga diferida permitida y está documentada en DEVELOPMENT.md.
5. `scripts/js-budget.mjs` y `gates:budget` (informa; no bloquea hasta 8B).

## 2. Alcance técnico detallado

### Tarea 2.1: arquitectura y contrato (antes de escribir módulos)
- Archivos permitidos: `agent-comms/outbox-claude/harness-8A-001/inventory.md` (nuevo).
- Cambio: inventario de los 28 custom elements con clase, líneas actuales, módulo destino, sección o snippet que lo carga, plantillas afectadas, dependencias entre clases (quién usa `fetchCommerce`, `trapFocus`, `formatMoney`, `closeOtherDialogs`); orden de carga esperado por plantilla; lista de selectores de `DIALOGS_WITH_CLOSE` y `REVEAL_TARGETS`.
- Criterio: Gemini aprueba el inventario antes de 2.2 (una respuesta en el hilo de la directiva).
- Subagente: Fable 5.1.

### Tarea 2.2: núcleo
- Archivos permitidos: `assets/theme.js`.
- Cambio: dejar solo helpers, `ThemeElement`, `ThemeDisclosure`, `ThemeDrawer`, `LocalizationForm`, `AnnouncementBar`, reduced motion, `closeOtherDialogs`, `syncDialogScrollLocks`, header scroll, steppers, foco de formularios, `pageswap`, export `ThemeCore` (incluye `applyBackgroundInert`, `restoreBackgroundInert`, `motionAllowed`, `fetchCommerce`, `formatMoney`, `trapFocus`). `closeOtherDialogs` tolera componentes aún no definidos (ya lo hace con `typeof dialog.close`).
- Criterio: `gzip -6 -c assets/theme.js | wc -c` ≤ 10.240; `node --check`; `rg -c "customElements.define" assets/theme.js` coincide con el inventario del núcleo.

### Tareas 2.3 a 2.17: un módulo por tarea
- Archivos permitidos por tarea: el módulo nuevo y la sección o snippet que lo carga (lista cerrada en el inventario aprobado). Las tareas no comparten archivos; si dos módulos deben cargarse desde la misma sección, la segunda etiqueta la añade el coordinador en la integración.
- Cambio: mover la clase sin reescribirla (diff mínimo), envolver en el IIFE con guarda, añadir la etiqueta `defer` en la sección; en `layout/theme.liquid` añadir el módulo a la lista de `design_mode`.
- Criterio por módulo: `node --check`; la sección funciona en su plantilla y en el editor al añadirla en vivo; 0 errores de consola; el `data-*` que consume está en `gates:hooks`.
- Subagentes: uno por módulo (Opus 5.5).

### Tarea 2.18: cajón en dos fases
- Archivos permitidos: `assets/cart-drawer.js`, `assets/cart-drawer-extras.js`, `sections/cart-drawer.liquid`.
- Cambio: lo esencial (abrir, cerrar, cantidad, eliminar, `aria-live`, foco) en `cart-drawer.js`; el resto en `cart-drawer-extras.js` cargado en el primer `open()`; el HTML que llega por Section Rendering no trae `<script>`.
- Criterio: `cart-drawer.js` ≤ 8 KB gz; añadir al carrito desde una tarjeta antes de que cargue extras no rompe nada (prueba con red lenta); recomendaciones aparecen tras la carga sin salto de layout.
- Subagente: Fable 5.1.

### Tarea 2.19: `featured-product` con picker de tarjeta
- Archivos permitidos: `sections/featured-product.liquid`, `assets/product-card.js` (si necesita un hook), locales.
- Cambio: el bloque de compra del featured usa el mismo markup y componente que `product-card` en modo `picker` u `options`; galería reducida; conserva `@app`, selling plans visibles y `payment_button`.
- Criterio: la home de los 3 presets no referencia `product.js`; 5 estados degenerados del featured; GPT valida que la experiencia sigue siendo de ficha destacada, no de tarjeta.
- Subagente: Opus 5.5 con revisión de Fable 5.1.

### Tarea 2.20: `js-budget.mjs`
- Archivos permitidos: `scripts/js-budget.mjs` (nuevo), `package.json` (`gates:budget`).
- Cambio: para cada plantilla JSON, resolver layout, grupos, secciones y snippets referenciados, recolectar los `asset_url` de `.js` (y `.css` para 8B), sumar bytes y gzip, imprimir tabla y escribirla en `docs/gate5-reports/budget-<fecha>.md`. Umbrales como constantes; en 8A solo avisa.
- Criterio: tabla pegada en el informe con antes (b400cdc) y después.

### Tarea 2.21: versión y notas
- `theme_version` 1.2.0; `RELEASE-NOTES.md`.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados: por módulo, los de su componente; en el editor, "sección recién añadida" como sexto estado obligatorio.
- Consistencia: ningún helper duplicado entre módulos (`rg -n "function formatMoney|function trapFocus" assets/` da 1 cada uno).
- Superficie del comerciante: sin cambios de schema salvo `featured-product` (sentence case, `t:`).
- Ledger: `P-11` en `código completo` hasta Lighthouse; `P-10` se re-mide.
- `npm run gates:static` 10/10; `gates:budget` con home ≤ 45 KB gz, producto ≤ 50, colección ≤ 42, contenido ≤ 35, password ≤ 11.
- Gates obligatorios: static, budget, hooks. Gate 5: 16 plantillas x 3 presets sin errores de consola; editor de temas con cada sección añadida en vivo; Lighthouse móvil antes y después en home, producto y colección de la demo Sartorial.
- `theme-check:all` (fuera de las compuertas, solo informe): 0 `AssetSizeJavaScript` en layouts.

## 4. Instrucciones de entrega para Claude

1. 2.1 primero y espera de aprobación; 2.2 después; 2.3 a 2.19 en paralelo por subagente con listas de archivos disjuntas; integración por el coordinador; 2.20 y 2.21 al final.
2. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-8A-001.md` con la cabecera de RULES.md §1.4, tabla de presupuesto antes y después, inventario final, diff combinado.
3. Sin commit ni push. Dueños: emite Gemini; implementa Claude; audita GPT (`GPT-AUDIT-026-js-split.md`, regresión funcional en los 5 flujos de compra y en el editor); verifica Gemini (`GEMINI-review-CLAUDE-8A-001.md` con `js-budget` y Lighthouse propios); commitea y despliega Gemini, primero a tema-qkqpke0j, a las demos solo tras la review.

---

# CLAUDE-DIRECTIVE-8B-001: partición de base.css

```text
ID: CLAUDE-DIRECTIVE-8B-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador)
Copia: Johandry; GPT
Fecha: BORRADOR (pendiente de emisión)
Insumos: CLAUDE-PLAN-CONTOUR-REF-001.md §3 (8B), transferencia.md §4 y §11 fila 12; harness-COMP-001 y scripts/capture-presets.mjs como arnés de capturas
Estado: BORRADOR. Pendiente de emisión por Gemini y de autorización de Johandry
Autorización de alcance: Johandry, pendiente (sin cambio visible previsto; se pide por el riesgo)
Autorización Nivel 2: Gemini, pendiente (hasta 16 hojas nuevas en assets/; stylesheet_tag en secciones; carga condicional de motion por estilo)
Rama / Base: HEAD tras integrar y certificar 8A
Versión resultante: 1.3.0
Entrada de RELEASE-NOTES: "1.3.0: lighter critical CSS, styles loaded per section"
Filas del ledger (IDs): crea P-12; re-mide P-10
Prohibido en este sprint: cualquier cambio en assets/*.js. Prohibido añadir bloques de parche al final de ningún archivo CSS.
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

`base.css` pesa 249 KB (50,5 KB gz) y bloquea el pintado con `preload` en todas las páginas; tiene bloques tardíos que corrigen reglas anteriores por orden de cascada y 9 hex fuera de tokens en los estilos de movimiento. Contour "divide" con `{% stylesheet %}` y acaba sirviendo más CSS que Sartorial. Aquí se parte de verdad: hojas por sección cargadas desde la sección con `stylesheet_tag`, movimiento solo del estilo elegido, y un `base.css` por debajo de 100 KB.

### Autorizaciones expresas de desviación Nivel 2

1. Hojas nuevas: `motion-atelier.css`, `motion-technical.css`, `motion-heritage.css`, `section-product.css`, `section-cart-drawer.css`, `section-collection.css`, `section-hero.css`, `section-showcase.css`, `section-manifesto.css`, `section-bento.css`, `section-marquee.css`, `section-lookbook.css`, `section-complete-the-look.css`, `section-content.css`, `predictive-search.css`. Carga con `{{ 'x.css' | asset_url | stylesheet_tag }}` dentro de la sección o snippet dueño; `motion-*.css` desde `layout/theme.liquid` según `settings.motion_style` y solo si `settings.animations != 'none'`, sin `preload`.
2. Trabajo previo dentro del mismo sprint: mover los bloques "AUDITORIA EN VIVO", "LEAD-001" y "COMP-001" al componente que corrigen; sustituir los 9 hex del bloque de movimiento por `color-mix()` sobre tokens; revisar los 47 `!important` y eliminar los que la nueva especificidad haga innecesarios.
3. `gates:budget` pasa a bloquear con umbrales de CSS: crítico en `<head>` ≤ 25 KB gz; total por página ≤ 48 KB gz.

## 2. Alcance técnico detallado

### Tarea 2.1: mapa de propiedad y capturas de referencia
- Archivos permitidos: `agent-comms/outbox-claude/harness-8B-001/` (nuevo).
- Cambio: mapa regla a hoja destino (por selector raíz), lista de parches tardíos con su regla original, lista de `!important` con veredicto; capturas de referencia de 16 plantillas x 3 presets x 2 anchos con `scripts/capture-presets.mjs` sobre tema-qkqpke0j en el HEAD de 8A.
- Criterio: Gemini aprueba el mapa antes de 2.2.
- Subagente: Fable 5.1.

### Tarea 2.2: saneamiento previo en `base.css`
- Archivos permitidos: `assets/base.css`.
- Cambio: integrar cada parche tardío en su regla de origen; `color-mix()` por los 9 hex; `!important` sobrantes fuera.
- Criterio: capturas idénticas a la referencia dentro de la tolerancia; `rg -c "!important" assets/base.css` menor que 47; `rg -n "#[0-9a-fA-F]{3,6}" assets/base.css` solo en la definición de tokens.

### Tareas 2.3 a 2.17: una hoja por tarea
- Archivos permitidos por tarea: la hoja nueva, `assets/base.css` (solo borrar las reglas movidas), la sección o snippet que la carga.
- Cambio: mover reglas sin reescribirlas; la etiqueta `stylesheet_tag` al inicio del markup de la sección; en `layout/theme.liquid` nada salvo para `motion-*.css`.
- Criterio por hoja: capturas de las plantillas donde aparece la sección idénticas a la referencia dentro de la tolerancia; 0 reglas duplicadas entre `base.css` y la hoja.
- Subagentes: uno por hoja (Opus 5.5), en dos tandas para que el coordinador integre y re-capture entre ellas.

### Tarea 2.18: movimiento por estilo
- Archivos permitidos: `assets/motion-atelier.css`, `assets/motion-technical.css`, `assets/motion-heritage.css`, `layout/theme.liquid`.
- Criterio: con `motion_style: technical` la página solo descarga `motion-technical.css`; con `animations: none` ninguna; reduced motion sigue apagando todo.

### Tarea 2.19: presupuesto y versión
- `gates:budget` con CSS, umbrales bloqueantes; `theme_version` 1.3.0; `RELEASE-NOTES.md`.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados: los visuales (sección vacía, un bloque, muchos, texto largo, sin imagen) en cada sección cuya hoja se movió, con capturas.
- Consistencia: ningún selector definido en dos hojas; tokens únicos.
- Superficie del comerciante: sin cambios.
- Ledger: `P-12` en `código completo` hasta Lighthouse; `P-10` se re-mide.
- `npm run gates:static` 10/10; `gates:budget` bloqueante en verde.
- Gates obligatorios: static, budget. Gate 5: diff de 96 capturas antes y después con tolerancia declarada; Lighthouse móvil en home, producto y colección de las 3 demos; axe en 16 plantillas (forced-colors y reduced motion incluidos).
- `theme-check:all` (informe): 0 `AssetSizeCSS` y 0 `AssetSizeJavaScript`, por primera vez.

## 4. Instrucciones de entrega para Claude

1. 2.1, aprobación, 2.2, re-captura, 2.3 a 2.17 en dos tandas, 2.18, 2.19.
2. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-8B-001.md`; carpeta `harness-8B-001/` con capturas antes y después y el diff de píxeles; un parche por hoja en `CLAUDE-REPORT-8B-001-<hoja>.diff` para que Gemini pueda commitear hoja por hoja.
3. Sin commit ni push. Dueños: emite Gemini; implementa Claude; audita GPT (`GPT-AUDIT-027-css-split.md`, revisión visual de capturas y de los 3 estilos de movimiento); verifica Gemini (diff de capturas propio); commitea Gemini en un commit por hoja y despliega.

---

# CLAUDE-DIRECTIVE-9A-001: quick view con Section Rendering y `<dialog>`

```text
ID: CLAUDE-DIRECTIVE-9A-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador)
Copia: Johandry; GPT
Fecha: BORRADOR (pendiente de emisión)
Insumos: GPT-REPORT-028-quick-view-ux (dictamen previo de GPT, pendiente), CLAUDE-PLAN-CONTOUR-REF-001.md §3 (9A), transferencia.md §2 y §11 fila 13
Estado: BORRADOR. Pendiente de dictamen de GPT, emisión por Gemini y autorización de Johandry
Autorización de alcance: Johandry, pendiente (función nueva visible; setting global quick_view)
Autorización Nivel 2: Gemini, pendiente (sección endpoint nueva; snippet en layout; módulo y hoja nuevos; setting global y settings_data de 3 presets; cambios en VariantSelects, sticky-cart-bar, product-inventory, product-card)
Rama / Base: HEAD tras integrar 8B
Versión resultante: 1.4.0
Entrada de RELEASE-NOTES: "1.4.0: quick view"
Filas del ledger (IDs): crea C-27
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

Quick view es uno de los 4 NO de la comparativa y lo tienen todos los competidores del tier. Se toma de Contour el patrón (sección endpoint renderizada desde la URL del producto, un solo cascarón en el layout, reutilizar el selector de variantes) y se descartan sus mecanismos (div con role, bloqueo manual de scroll, adopción de estilos, GSAP). En moda de lujo la vista rápida sirve para elegir talla y color, no para leer: sin descripción larga. El modo `picker` de la tarjeta se mantiene.

### Autorizaciones expresas de desviación Nivel 2

1. `sections/quick-view.liquid` sin `presets` ni `enabled_on` (endpoint de Section Rendering). Razón: `product` en la sección es el producto de la URL.
2. `snippets/quick-view-dialog.liquid` renderizado una vez en `layout/theme.liquid` cuando `settings.quick_view` es verdadero.
3. `assets/quick-view.js` y `assets/quick-view.css` nuevos; registro del selector en `DIALOGS_WITH_CLOSE` y `syncDialogScrollLocks` del núcleo (único cambio permitido en `assets/theme.js`).
4. Setting global `quick_view` (checkbox) en `config/settings_schema.json`; `config/settings_data.json`: `true` en Sartorial e Imprint, `false` en Archive.
5. `VariantSelects` (`assets/product.js`) acepta `data-section-id` distinto del de la ficha y `data-url` del producto; `StickyCartBar` y `ProductInventory` filtran eventos por `section_id`.
6. `snippets/product-card.liquid`: el modo `options` pinta "Quick view" con `data-quick-view` cuando el setting está activo; conserva el enlace a la ficha como fallback sin JS.

## 2. Alcance técnico detallado

### Tarea 2.1: sección endpoint y cascarón
- Archivos permitidos: `sections/quick-view.liquid` (nuevo), `snippets/quick-view-dialog.liquid` (nuevo), `layout/theme.liquid` (solo el render condicional), locales.
- Cambio: la sección renderiza galería reducida (primeras 4 medias, `loading="lazy"` salvo la primera, sin zoom ni 3D), vendor, título como `h2`, `{% render 'price' %}`, `<variant-selects data-section-id="quick-view" data-url="{{ product.url }}">` con el markup de `main-product`, cantidad, botón de añadir, `payment_button`, enlace "View full details". El cascarón: `<quick-view-dialog>` con `<dialog class="quick-view">`, botón de cierre de 44 px con `t:`, región con `aria-busy`, `<p role="status">` para cargando y error.
- Criterio: `GET /products/<handle>?section_id=quick-view` devuelve el fragmento; sin JS no hay cascarón visible ni markup roto.

### Tarea 2.2: módulo
- Archivos permitidos: `assets/quick-view.js` (nuevo), `assets/quick-view.css` (nuevo), `assets/theme.js` (solo las dos listas de diálogos).
- Cambio: `QuickViewDialog extends ThemeCore.ThemeElement`; clic delegado en `[data-quick-view]`; `fetch` con `AbortController` reutilizando el patrón de `fetchCommerce`; inserción del fragmento; `showModal()`; foco al título; `Shopify.PaymentButton.init()`; al recibir el evento de "añadido" del cajón, cerrar sin devolver el foco (el cajón lo toma); al cerrar por Escape o botón, devolver el foco al disparador; animación de entrada solo si `ThemeCore.motionAllowed()`.
- Criterio: `node --check`; 0 nuevas copias de `inert` o de bloqueo de scroll; `gates:hooks` con `data-quick-view` y `data-section-id`.
- Subagente: Opus 5.5 con revisión de Fable 5.1.

### Tarea 2.3: `VariantSelects` y consumidores por sección
- Archivos permitidos: `assets/product.js`.
- Cambio: `VariantSelects` lee `data-url` y `data-section-id` del propio elemento; `StickyCartBar` y `ProductInventory` ignoran eventos de variante cuya `section_id` no sea la suya.
- Criterio: en la ficha, abrir un quick view desde recomendaciones y cambiar variante no altera la barra fija ni el inventario de la ficha; prueba con captura.
- Subagente: Fable 5.1.

### Tarea 2.4: tarjeta y setting
- Archivos permitidos: `snippets/product-card.liquid`, `config/settings_schema.json`, `config/settings_data.json`, `listings/*/templates/*.json` (solo si contienen `quick_view`), locales.
- Cambio: en modo `options` y con el setting activo, botón "Quick view" con `data-quick-view="{{ card_product.url }}"` y enlace de fallback; con el setting apagado, comportamiento actual. Setting con label, `info` y `t:`.
- Criterio: 5 estados degenerados de la tarjeta; Archive no muestra quick view.

### Tarea 2.5: versión y notas
- `theme_version` 1.4.0; `RELEASE-NOTES.md`.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados en el quick view: producto sin imagen, 1 variante, 40 variantes, título de 120 caracteres, producto con selling plan obligatorio, producto agotado, error de red (status visible).
- Consistencia: precios por `formatMoney`; tokens existentes en `quick-view.css`.
- Superficie del comerciante: setting `quick_view` con `info`; 3 claves de locale nuevas en en/es.
- Ledger: `C-27` en `código completo` hasta Gate 5 móvil.
- `npm run gates:static` 10/10; `gates:budget`: `quick-view.js` solo en páginas con tarjetas.
- Gate 5: en tema-qkqpke0j, abrir, cambiar variante, añadir, cerrar con Escape y con botón, con teclado y con lector; en móvil 390 px; sin JS el botón lleva a la ficha; Lighthouse de colección no baja más de 2 puntos.

## 4. Instrucciones de entrega para Claude

1. 2.1 y 2.4 en paralelo; 2.2 y 2.3 en paralelo después; integración; 2.5.
2. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-9A-001.md`, arnés en `harness-9A-001/`.
3. Sin commit ni push. Dueños: emite Gemini tras el dictamen `GPT-REPORT-028`; implementa Claude; audita GPT (`GPT-AUDIT-028-quick-view.md`); verifica Gemini (`GEMINI-review-CLAUDE-9A-001.md`); commitea y despliega Gemini.

---

# CLAUDE-DIRECTIVE-9B-001: popup de newsletter y lista de espera por talla

```text
ID: CLAUDE-DIRECTIVE-9B-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador)
Copia: Johandry; GPT
Fecha: BORRADOR (pendiente de emisión)
Insumos: GPT-REPORT-029-overlays-ux (dictamen previo, pendiente), CLAUDE-PLAN-CONTOUR-REF-001.md §3 (9B), transferencia.md §8 y §12 (notify-me)
Estado: BORRADOR. Pendiente de dictamen de GPT, emisión por Gemini y autorización de Johandry
Autorización de alcance: Johandry, pendiente (dos funciones nuevas visibles)
Autorización Nivel 2: Gemini, pendiente (grupo de secciones nuevo en layout; sección, bloque, 2 módulos y 2 hojas nuevos)
Rama / Base: HEAD tras integrar 9A
Versión resultante: 1.5.0
Entrada de RELEASE-NOTES: "1.5.0: newsletter popup, size waitlist"
Filas del ledger (IDs): crea C-28, C-29
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

Dos diálogos sobre el patrón ya fijado en 9A: un popup de newsletter que el comerciante gestiona como una sección más (grupo `overlay-group`) y una lista de espera por talla, porque en moda se agota la talla, no el producto. Contour no tiene el popup y su notify-me lleva textos quemados; ambos nacen aquí al estilo Sartorial con `<dialog>`, `t:` en todo y `ThemeCore.motionAllowed()`.

### Autorizaciones expresas de desviación Nivel 2

1. `sections/overlay-group.json` (tipo `aside`) renderizado al final de `layout/theme.liquid` con `{% sections 'overlay-group' %}`; nace vacío en `templates/` y con `newsletter-popup` desactivado en las plantillas de `listings/` (el comerciante lo activa).
2. `sections/newsletter-popup.liquid`, `assets/newsletter-popup.js`, `assets/newsletter-popup.css`.
3. Bloque `waitlist` en `sections/main-product.liquid` y `sections/featured-product.liquid`; `assets/back-in-stock.js`, `assets/back-in-stock.css`; `snippets/back-in-stock-dialog.liquid`.
4. Settings del popup: `delay` (range 3 a 60, default 8), `days_hidden` (range 1 a 90, default 30), `show_on_mobile`, `position` (select: center, bottom_corner), `discount_code`, `image`, `eyebrow`, `heading`, `text`, `button_label`, `color_scheme`. Todos con `t:`; `discount_code` con `info` que aclare que el código debe existir en Admin.

## 2. Alcance técnico detallado

### Tarea 2.1: popup
- Archivos permitidos: `sections/overlay-group.json` (nuevo), `sections/newsletter-popup.liquid` (nuevo), `assets/newsletter-popup.js` (nuevo), `assets/newsletter-popup.css` (nuevo), `layout/theme.liquid` (solo el render del grupo), `templates/*.json` y `listings/*/templates/*.json` (solo si el grupo exige entrada), locales.
- Cambio: `<newsletter-popup>` con `<dialog>`; imagen 4:5 `loading="lazy"`; `form 'customer'` con label asociado, `aria-live` de resultado y `<copy-text>` para el código; cierre de 44 px y enlace "No, thanks". JS: `showModal()` tras `delay`; nunca si otro diálogo está abierto; nunca en `password`, `cart` ni plantillas de política; `localStorage` de fecha de cierre y de suscripción; `shopify:section:select` abre y `deselect` cierra en el editor; `form.posted_successfully?` abre de inmediato para mostrar el mensaje. Animación solo si `motionAllowed()`.
- Criterio: no aparece antes de `delay`; no aparece con el cajón abierto; no reaparece dentro de `days_hidden`; axe con el popup abierto; Lighthouse de la home no baja más de 2 puntos; sin JS no hay nada visible.
- Subagente: Opus 5.5.

### Tarea 2.2: lista de espera por talla
- Archivos permitidos: `sections/main-product.liquid`, `sections/featured-product.liquid` (solo el bloque nuevo), `snippets/back-in-stock-dialog.liquid` (nuevo), `assets/back-in-stock.js` (nuevo), `assets/back-in-stock.css` (nuevo), locales.
- Cambio: bloque `waitlist` visible solo cuando la variante seleccionada no está disponible (escucha el evento de variante de su `section_id`); botón "Notify me" abre `<dialog>` con email, consentimiento, la talla ya escrita y un texto de privacidad; envía `form 'contact'` con `contact[tags]` = `waitlist,<handle>,<variant_id>` y el cuerpo con producto y variante; mensaje de éxito en la misma región; `info` en el setting del bloque explicando que el contacto llega etiquetado al Admin y que un flujo o app lo recoge.
- Criterio: con producto disponible el bloque no pinta; con variante agotada aparece; el envío en tema-qkqpke0j crea un contacto con los tags (captura del Admin); 5 estados degenerados (sin variantes, 1, 40, título largo, sin email válido).
- Subagente: Opus 5.5.

### Tarea 2.3: versión y notas
- `theme_version` 1.5.0; `RELEASE-NOTES.md`.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados en los dos diálogos y en el bloque.
- Consistencia: un solo registro de diálogos en el núcleo; tokens existentes.
- Superficie del comerciante: todos los settings con `t:`, `info` en `discount_code` y en `waitlist`.
- Ledger: `C-28`, `C-29` en `código completo` hasta Gate 5.
- `npm run gates:static` 10/10; `gates:budget` en verde (los módulos solo cargan donde existen).
- Gate 5: pruebas en tema-qkqpke0j en móvil; contacto de lista de espera verificado en Admin; popup con teclado y lector.

## 4. Instrucciones de entrega para Claude

1. 2.1 y 2.2 en paralelo (archivos disjuntos salvo locales, que integra el coordinador); 2.3.
2. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-9B-001.md`, arnés en `harness-9B-001/`.
3. Sin commit ni push. Dueños: emite Gemini tras `GPT-REPORT-029`; implementa Claude; audita GPT (`GPT-AUDIT-029-overlays.md`); verifica Gemini; commitea y despliega Gemini.

---

# CLAUDE-DIRECTIVE-9C-001: prensa y voces, comparador de ajuste y tejido, video de campaña

```text
ID: CLAUDE-DIRECTIVE-9C-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador)
Copia: Johandry; GPT
Fecha: BORRADOR (pendiente de emisión)
Insumos: GPT-REPORT-030-content-sections-brief (pendiente), CLAUDE-PLAN-CONTOUR-REF-001.md §3 (9C), transferencia.md §7 y §12 (video-feature)
Estado: BORRADOR. Pendiente de dictamen de GPT, emisión por Gemini y autorización de Johandry
Autorización de alcance: Johandry, pendiente (3 secciones nuevas)
Autorización Nivel 2: Gemini, pendiente (3 secciones, 3 hojas, 1 módulo)
Rama / Base: HEAD tras integrar 8B (puede correr en paralelo con 9A; no toca layout, product-card ni theme.js)
Versión resultante: 1.6.0
Entrada de RELEASE-NOTES: "1.6.0: press quotes, fit comparison, campaign video"
Filas del ledger (IDs): crea C-30, C-31, C-32
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

Tres secciones de contenido que cubren "parcial" y "NO" de la comparativa sin copiar el carrusel con autoplay de Contour ni su comparador de specs de muebles: prensa y voces por bloques (0 JS), comparador de ajuste y tejido en tabla accesible (0 JS) y video de campaña con fachada que no carga nada hasta pulsar.

### Autorizaciones expresas de desviación Nivel 2

1. `sections/press-quotes.liquid` con bloques `quote` (cita, autor, medio o cargo, logotipo opcional) y `press_logo` (logotipo con enlace); `assets/section-press-quotes.css`.
2. `sections/fit-comparison.liquid` con settings de filas (`row_labels`, una por línea) y bloques `product` (producto, respuestas una por línea); `assets/section-fit-comparison.css`.
3. `sections/campaign-video.liquid` con póster, URL de YouTube o Vimeo o video alojado, título y texto; `assets/campaign-video.js`, `assets/section-campaign-video.css`.
4. Presets en las 3 secciones; `enabled_on` acotado a `index`, `page`, `collection` (y `product` para `fit-comparison`).

## 2. Alcance técnico detallado

### Tarea 2.1: `press-quotes`
- Archivos permitidos: `sections/press-quotes.liquid` (nuevo), `assets/section-press-quotes.css` (nuevo), locales.
- Cambio: tres columnas en escritorio, lista con `scroll-snap` horizontal en móvil, tipografía heredada de `brand-manifesto` vía tokens; logotipos con `alt` desde el setting; 0 JS.
- Criterio: 5 estados degenerados (0 bloques: no renderiza; 1; 12; cita de 400 caracteres; sin logotipo); axe limpio; sin movimiento automático.

### Tarea 2.2: `fit-comparison`
- Archivos permitidos: `sections/fit-comparison.liquid` (nuevo), `assets/section-fit-comparison.css` (nuevo), locales.
- Cambio: `<table>` con `<caption>` (título de la sección), `scope="col"` y `scope="row"`, región desplazable con `tabindex="0"` y `aria-label`, primera columna fija por CSS; título, imagen, precio (`formatMoney` en Liquid vía `money`) y enlace leídos del producto; 2 a 4 bloques; filas que no tengan respuesta en un bloque muestran un guion con `aria-label` de "no aplica" traducido.
- Criterio: navegable con teclado y lector a 390 px; 5 estados degenerados (1 producto: no renderiza y lo dice el `info`; 4 productos; 12 filas; respuesta de 200 caracteres; producto sin imagen).

### Tarea 2.3: `campaign-video`
- Archivos permitidos: `sections/campaign-video.liquid` (nuevo), `assets/campaign-video.js` (nuevo), `assets/section-campaign-video.css` (nuevo), locales.
- Cambio: póster (imagen del setting o miniatura del video alojado) con botón de 44 px y `t:`; al pulsar se crea el `<iframe>` (YouTube nocookie o Vimeo con `dnt=1`) o se carga el `<video>` con `controls`; `<campaign-video extends ThemeElement>`; con `motionAllowed()` falso no hay transición; sin JS el botón enlaza a la URL del video.
- Criterio: 0 peticiones a dominios de video antes del clic (panel de red con captura); `node --check`; `gates:hooks`.

### Tarea 2.4: versión y notas
- `theme_version` 1.6.0; `RELEASE-NOTES.md`.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados por sección (arriba).
- Consistencia: tokens existentes; precios por `money`.
- Superficie del comerciante: labels e `info` con `t:` en en/es; `row_labels` con `info` que explique el contrato "una fila por línea, misma cantidad de líneas en cada producto".
- Ledger: `C-30`, `C-31`, `C-32` en `código completo` hasta Gate 5.
- `npm run gates:static` 10/10; `gates:budget` en verde.
- Gate 5: las 3 secciones en tema-qkqpke0j en móvil y escritorio, con teclado y lector; red del video verificada.

## 4. Instrucciones de entrega para Claude

1. 2.1, 2.2 y 2.3 en paralelo (archivos disjuntos salvo locales); 2.4.
2. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-9C-001.md`, arnés en `harness-9C-001/`.
3. Sin commit ni push. Dueños: emite Gemini tras `GPT-REPORT-030`; implementa Claude; audita GPT (`GPT-AUDIT-030-content-sections.md`); verifica Gemini; commitea y despliega Gemini.

---

# CLAUDE-DIRECTIVE-10A-001: secciones exclusivas por preset y bloques de ficha por metafields

```text
ID: CLAUDE-DIRECTIVE-10A-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador); Johandry (metafields y contenido en las 3 demos)
Copia: GPT
Fecha: BORRADOR (pendiente de emisión)
Insumos: GPT-REPORT-031-preset-sections-brief (pendiente), CLAUDE-PLAN-CONTOUR-REF-001.md §3 (10A), transferencia.md §5, docs/decisions.md 2026-09-13 (identidades de preset)
Estado: BORRADOR. Pendiente de dictamen de GPT, emisión por Gemini y autorización de Johandry
Autorización de alcance: Johandry, pendiente (6 secciones nuevas; retiro del bloque technical_specs; metafields nuevos)
Autorización Nivel 2: Gemini, pendiente (6 secciones, 6 hojas, 1 bloque nuevo y 1 retirado en main-product)
Rama / Base: HEAD tras integrar 9B y 9C
Versión resultante: 1.7.0
Entrada de RELEASE-NOTES: "1.7.0: atelier process, fabric library, drop calendar, look index, provenance ledger, condition guide; fabric specs from metafields"
Filas del ledger (IDs): crea L-12; cierra C-24
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

Hoy los 3 presets comparten todas las secciones y solo reordenan. Contour da a cada preset secciones de su nicho; Sartorial lo hace dentro de la moda con sus tres identidades ya decididas (alta costura editorial; minimalismo denso; heritage y archivo). Cada sección responde a una pregunta real del comprador de ese preset, según el brief de GPT. Ninguna copia el markup ni el nombre de las de Contour.

### Autorizaciones expresas de desviación Nivel 2

1. Secciones nuevas con presets, `enabled_on` y hoja propia: `atelier-process`, `fabric-library` (Sartorial); `drop-calendar`, `look-index` (Imprint); `provenance-ledger`, `condition-guide` (Archive). Las 6 quedan disponibles para cualquier comerciante; solo se colocan en las plantillas de `listings/` de su preset.
2. Bloque `fabric_specs` en `main-product` que lee `custom.composition`, `custom.weight`, `custom.origin` (claves confirmadas por F0-10 ampliado) y sustituye a `technical_specs`, que se retira con su snippet; el bloque `provenance` de la ficha gana un enlace opcional a la página de `condition-guide`.
3. `drop-calendar` usa el bloque `waitlist` de 9B para el estado "próximo"; sin reloj en marcha.
4. Metafields declarados en el `info` de cada setting; fallback visible sin metafields; estado vacío diseñado.

## 2. Alcance técnico detallado

### Tareas 2.1 a 2.6: una sección por tarea
- Archivos permitidos por tarea: `sections/<nombre>.liquid` (nuevo), `assets/section-<nombre>.css` (nuevo), locales; nada más.
- Contratos:
  - `atelier-process`: bloques `step` (número automático, título, texto, imagen, duración opcional); columnas con regla fina; 0 JS.
  - `fabric-library`: bloques `fabric` (imagen de muestra, nombre, composición, gramaje, origen, enlace a colección); grilla de muestras; ficha al enfocar vía `<theme-disclosure>`; 0 JS nuevo.
  - `drop-calendar`: bloques `drop` (fecha, estado select `upcoming | available | sold_out`, imagen, producto o colección); en `upcoming` renderiza el botón de lista de espera si el producto existe; 0 JS nuevo.
  - `look-index`: bloques `look` (número, nombre, imagen, enlace); índice tipográfico grande; `:hover` y `:focus-within` revelan la imagen; `<theme-disclosure>` en móvil; 0 JS nuevo.
  - `provenance-ledger`: tabla editorial de productos de una colección (año, procedencia, condición, talla, estado) desde metafields `custom.provenance_year`, `custom.origin`, `custom.condition`; `<table>` con `scope`, región desplazable enfocable; 0 JS.
  - `condition-guide`: bloques `grade` (nombre, descripción, qué incluye); `<details>` nativos como `main-faq`; 0 JS.
- Criterio por sección: presets válidos; `enabled_on` acotado; 5 estados degenerados con capturas; axe limpio; `t:` en todo; `info` en settings con metafields; renderiza su estado vacío en una tienda sin metafields.
- Subagentes: uno por sección (Opus 5.5); Fable 5.1 revisa los 6 schemas antes de integrar.

### Tarea 2.7: `fabric_specs` y retiro de `technical_specs`
- Archivos permitidos: `sections/main-product.liquid`, `snippets/product-fabric-specs.liquid` (nuevo), `snippets/product-technical-specs.liquid` (borrado), `snippets/product-provenance.liquid` (solo el enlace a la guía), `templates/product.json`, `listings/*/templates/product.json`, locales.
- Criterio: `rg -n "technical_specs|product-technical-specs" --glob '!agent-comms/**' --glob '!docs/**' .` da 0; la ficha de las 3 demos muestra specs reales desde metafields; sin metafields no pinta filas.

### Tarea 2.8 (Johandry): metafields y contenido
- Crear las definiciones de metafields en las 3 demos y en tema-qkqpke0j; cargar valores en los productos de demo; preparar textos e imágenes propias para las 6 secciones. Gemini coloca las secciones en las plantillas de `listings/` en 10C.

### Tarea 2.9: versión y notas
- `theme_version` 1.7.0; `RELEASE-NOTES.md`.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados por sección y por bloque de ficha.
- Consistencia: tokens existentes; ningún texto de marca quemado; ningún claim absoluto.
- Superficie del comerciante: unas 150 claves de schema nuevas con `t:` y paridad en/es; `info` en todo setting con metafield.
- Ledger: `L-12` en `código completo` hasta ver las 3 demos; `C-24` pasa a `cumplido` al retirar la última inferencia.
- `npm run gates:static` 10/10; `gates:budget` en verde; 0 `shopify://`.
- Gate 5: cada sección en su demo con contenido real y en una tienda limpia con su estado vacío; móvil 390 px; teclado y lector en las dos tablas.

## 4. Instrucciones de entrega para Claude

1. 2.1 a 2.6 en paralelo; 2.7 en paralelo (no comparte archivos con las secciones); integración de locales por el coordinador; 2.9.
2. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-10A-001.md`, arnés en `harness-10A-001/`.
3. Sin commit ni push. Dueños: emite Gemini tras `GPT-REPORT-031`; implementa Claude; audita GPT (`GPT-AUDIT-031-preset-sections.md` en las 3 demos); verifica Gemini; commitea y despliega Gemini.

---

# CLAUDE-DIRECTIVE-10B-001: theme blocks donde aportan

```text
ID: CLAUDE-DIRECTIVE-10B-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador)
Copia: Johandry; GPT
Fecha: BORRADOR (pendiente de emisión)
Insumos: CLAUDE-PLAN-CONTOUR-REF-001.md §3 (10B), transferencia.md §9 (theme blocks) y §11 fila 15
Estado: BORRADOR. Pendiente de emisión por Gemini y de autorización de Johandry
Autorización de alcance: Johandry, pendiente (carpeta blocks/ nueva; anidación en 7 secciones)
Autorización Nivel 2: Gemini, pendiente
Rama / Base: HEAD tras integrar 10A
Versión resultante: 1.8.0 (compartida con 10C)
Entrada de RELEASE-NOTES: parte de "1.8.0: preset layouts, theme blocks, listing kit"
Filas del ledger (IDs): crea A-08
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

Contour acepta `@theme` en un bloque que ninguna sección usa. Sartorial crea cinco bloques genéricos y los acepta solo donde anidar aporta: las secciones nuevas de 9C y 10A y `bento-discovery`. Sin retrofit de las 19 secciones existentes.

### Autorizaciones expresas de desviación Nivel 2

1. `blocks/heading.liquid`, `blocks/text.liquid`, `blocks/button.liquid`, `blocks/image.liquid`, `blocks/spacer.liquid`, cada uno con `{% schema %}`, `t:` y CSS transversal en `base.css` (sección de bloques, con tokens).
2. `{"type": "@theme"}` y `{% content_for 'blocks' %}` en `press-quotes`, `atelier-process`, `drop-calendar`, `fabric-library`, `look-index`, `condition-guide`, `bento-discovery`.

## 2. Alcance técnico detallado

### Tareas 2.1 a 2.5: un bloque por tarea
- Archivos permitidos: `blocks/<nombre>.liquid` (nuevo), `assets/base.css` (solo el bloque de reglas `.block-<nombre>`), locales.
- Criterio: schema válido; `t:`; 5 estados degenerados (texto vacío, 1, muchos anidados, 120 caracteres, imagen ausente); axe.

### Tarea 2.6: integración `@theme`
- Archivos permitidos: las 7 secciones listadas (solo schema y el `content_for 'blocks'`), `templates/*.json` y `listings/*/templates/*.json` si hace falta ejemplo.
- Criterio: en el editor, añadir, reordenar y borrar bloques anidados en las 7 secciones sin errores de consola; `mega-menu` y `announcement-bar` siguen respondiendo a `shopify:block:select`; preview de las 16 plantillas (PF-03).
- Subagente: Fable 5.1.

### Tarea 2.7: versión y notas
- `theme_version` 1.8.0 (si 10C no está integrado todavía, Gemini decide el orden); `RELEASE-NOTES.md`.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados por bloque; "bloque anidado recién añadido en el editor" como estado obligatorio.
- Consistencia: tokens; ningún estilo duplicado con los bloques de sección existentes.
- Superficie del comerciante: `t:` en los 5 schemas; nombres en sentence case.
- Ledger: `A-08` en `código completo` hasta probar en el editor en vivo.
- `npm run gates:static` 10/10; Theme Check 0 ofensas en `blocks/`.
- Gate 5: editor de temas en tema-qkqpke0j con las 7 secciones; preview de 16 plantillas.

## 4. Instrucciones de entrega para Claude

1. 2.1 a 2.5 en paralelo; 2.6 después; 2.7.
2. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-10B-001.md`, arnés en `harness-10B-001/` con grabación o capturas del editor.
3. Sin commit ni push. Dueños: emite Gemini; implementa Claude; audita GPT (`GPT-AUDIT-032-theme-blocks.md`, experiencia del comerciante al anidar); verifica Gemini; commitea y despliega Gemini.

---

# CLAUDE-DIRECTIVE-10C-001 y GPT-TASK-033: presets con layout propio, plantillas de listado y kit de listado

```text
ID: CLAUDE-DIRECTIVE-10C-001 (inbox-claude) y GPT-TASK-033-listing-copy (inbox-gpt)
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (settings, listings, capturas); GPT (copy del listado); Johandry (demos)
Copia: todos
Fecha: BORRADOR (pendiente de emisión)
Insumos: CLAUDE-PLAN-CONTOUR-REF-001.md §3 (10C), transferencia.md §5 (layout por preset) y §6 (kit de listado), docs/decisions.md 2026-09-13 (taglines), Theme Store listing page
Estado: BORRADOR. Pendiente de emisión por Gemini y de autorización de Johandry
Autorización de alcance: Johandry, pendiente (cambios de layout y tipografía en Imprint y Archive; taglines; D13 border_weight)
Autorización Nivel 2: Gemini, pendiente (settings_data de 3 presets; setting border_weight si se aprueba; listing.json y PNG; page.about por preset)
Rama / Base: HEAD tras integrar 10A y 10B
Versión resultante: 1.8.0
Entrada de RELEASE-NOTES: "1.8.0: preset layouts, theme blocks, listing kit"
Filas del ledger (IDs): modifica L-03 (Presets diferenciados); crea L-13, L-14
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

Los 3 presets comparten ancho, gutter, radio y fuente de cuerpo; dos comparten la serif de titulares. Las fichas de la Theme Store piden una demo y un argumento por preset. Este sprint diferencia el layout global por settings (dentro de los pasos de `range`), coloca las secciones de 10A en las plantillas de `listings/`, añade `page.about` por preset y versiona el material del formulario. Las familias tipográficas las elige Johandry con GPT de la biblioteca de Shopify y se verifican con contraste; no se fijan aquí.

### Autorizaciones expresas de desviación Nivel 2

1. `config/settings_data.json`: `page_width` 1300 / 1480 / 1180; `page_gutter` 24 / 16 / 32; `section_spacing` 80 / 48 / 64; `body_scale` 100 / 95 / 105; `heading_scale` 105 / 100 / 115; `button_radius` 0 / 0 / 2; `quick_view` on / on / off; par tipográfico distinto por preset (al menos uno sin Assistant y solo uno con Libre Baskerville).
2. Setting `border_weight` (select 1 / 2 px) si Gemini lo aprueba (D13), con uso en hairlines y marcos.
3. `listings/<preset>/templates/page.about.json` nuevo; `index.json` con las secciones exclusivas; `collection.json` y `product.json` revisados.
4. `listings/<preset>/listing.json` y PNG (`preview-desktop.png` 2000x2496, `preview-mobile.png` 750x1334, `highlight-1..3.png` 1600x1200, cada uno < 1 MB), validados por `gates:json`; fuera del paquete porque `scripts/package-theme.mjs` solo copia `listings/<preset>/{templates,sections}` (`theme package` no lee `.shopifyignore`).

## 2. Alcance técnico detallado

### Tarea 2.1 (Claude): settings por preset
- Archivos permitidos: `config/settings_data.json`, `config/settings_schema.json` (solo `border_weight` si está aprobado), `assets/base.css` (solo consumo de `--border-weight` si aplica), locales.
- Criterio: `gates:json` confirma que todo valor cae en la grilla de `step`; capturas de las 16 plantillas por preset antes y después; contraste verificado de los pares tipográficos.

### Tarea 2.2 (Claude): plantillas de listado
- Archivos permitidos: `listings/*/templates/*.json`.
- Criterio: 0 `shopify://`; `order` ≤ 25; cada home incluye sus 2 secciones exclusivas; diff contra `shopify theme pull` de cada demo = solo imágenes (PF-05).

### Tarea 2.3 (GPT, `GPT-TASK-033`): copy del listado
- Archivos permitidos: `agent-comms/outbox-gpt/GPT-REPORT-033-listing-copy.md`.
- Contenido: por preset, `name`, `tagline` ≤ 70 (revisar Imprint: hoy habla de "objects"), `description` en frases completas, `industry`, `catalog_size`, `features`, 3 `highlights` (título ≤ 30, descripción ≤ 140, qué muestra la imagen), en inglés US y sentence case; sin claims absolutos ni marcas ajenas.
- Criterio: Johandry aprueba; Claude lo vuelca en `listing.json` sin editar el texto.

### Tarea 2.4 (Claude): `listing.json` y capturas
- Archivos permitidos: `listings/*/listing.json` (nuevos), `listings/*/*.png` (nuevos), `scripts/capture-presets.mjs` (solo para producir los tamaños exactos).
- Criterio: `gates:json` valida campos, límites y dimensiones; `gates:package --verify` confirma que no viajan en el ZIP; cada PNG < 1 MB.

### Tarea 2.5 (Johandry): demos
- Actualizar las 3 demos con las secciones nuevas, metafields y fotografías propias; Gemini despliega con `--nodelete` y toma el `pull` para el diff de 2.2.

### Tarea 2.6: versión y notas
- `theme_version` 1.8.0; `RELEASE-NOTES.md`.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados: no aplica a settings; aplica a `page.about` por preset (sin imágenes, sin texto).
- Consistencia: un solo lugar para cada dimensión de PNG y límite de caracteres (gate de 7B).
- Superficie del comerciante: `border_weight` con `t:` e `info` si existe.
- Ledger: L-03 modificada; `L-13` y `L-14` en `cumplido` con el gate y el diff.
- `npm run gates:static` 10/10.
- Gate 5: PF-05 completo en las 3 demos; capturas de regresión de layout en Imprint y Archive.

## 4. Instrucciones de entrega

1. Claude: 2.1 y 2.2 en paralelo; 2.4 cuando GPT entregue 2.3 y Johandry 2.5; 2.6.
2. Informe `agent-comms/outbox-claude/CLAUDE-REPORT-10C-001.md`; GPT `GPT-REPORT-033-listing-copy.md` y luego `GPT-AUDIT-033-presets-and-listing.md` (compara las 3 demos como compraría un comerciante).
3. Sin commit ni push. Dueños: emite Gemini; implementa Claude (y GPT el copy); audita GPT; verifica Gemini con diff instalación/demo; commitea y despliega Gemini.

---

# CLAUDE-DIRECTIVE-11A-001: internacionalización

```text
ID: CLAUDE-DIRECTIVE-11A-001
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude (implementador)
Copia: Johandry (contrata la revisión nativa); GPT
Fecha: BORRADOR (pendiente de emisión)
Insumos: CLAUDE-PLAN-CONTOUR-REF-001.md §3 (11A), transferencia.md §1, scripts/locale-key-inventory.mjs ampliado en 7B
Estado: BORRADOR. Pendiente de emisión por Gemini y de autorización de Johandry
Autorización de alcance: Johandry, pendiente (4 idiomas nuevos; coste de revisión nativa, D14)
Autorización Nivel 2: Gemini, pendiente (archivos nuevos en locales/; cambio de labels a sections.all en 20 a 30 secciones; script nuevo)
Rama / Base: HEAD tras integrar 10C (inventario de claves congelado)
Versión resultante: 1.9.0
Entrada de RELEASE-NOTES: "1.9.0: Spanish theme editor; French, German and Italian storefront and editor"
Filas del ledger (IDs): crea L-15
Prohibido en este sprint: añadir o renombrar claves de schema fuera de la consolidación en sections.all; tocar cualquier sección fuera del valor de label.
```

---

## 1. Contexto, dictamen de aprobación y resoluciones de Nivel 2

Sartorial tiene en/es en storefront y solo en en el schema: un comerciante hispanohablante ve el editor en inglés. Contour lleva 5 idiomas completos. Se adopta la cobertura con herramientas propias: scaffold con `null`, gate de paridad en todos los archivos, consolidación previa de etiquetas repetidas y revisión nativa externa antes de cerrar. Se hace al final porque cada sección nueva habría crecido el inventario.

### Autorizaciones expresas de desviación Nivel 2

1. Consolidar las 62 etiquetas repetidas en `sections.all` de `locales/en.default.schema.json`, cambiando solo el valor de `label` en las secciones afectadas (sin tocar `id` ni `default`).
2. `scripts/locale-scaffold.mjs` y archivos nuevos `locales/es.schema.json`, `fr.json`, `fr.schema.json`, `de.json`, `de.schema.json`, `it.json`, `it.schema.json`.
3. `date_formats` por idioma en los archivos de storefront.

## 2. Alcance técnico detallado

### Tarea 2.1: consolidación en `sections.all`
- Archivos permitidos: `locales/en.default.schema.json`, `sections/*.liquid` (solo valores de `label` e `info` que pasen a `t:sections.all.*`), `config/settings_schema.json` (ídem).
- Criterio: `gates:locales` sin huérfanas; número de claves de `en.default.schema.json` baja y queda registrado; Theme Check 0 ofensas.
- Subagente: Haiku 4.5 inventaría; Opus 5.5 aplica.

### Tarea 2.2: scaffold
- Archivos permitidos: `scripts/locale-scaffold.mjs` (nuevo), `package.json` (script `locales:scaffold`, fuera de gates).
- Cambio: genera `<lang>.json` y `<lang>.schema.json` con todas las claves de `en.default` y valor `null`, respetando el orden; si el archivo existe, añade solo las claves faltantes.
- Criterio: tras generar, `gates:locales` falla por `null` (demostración) y pasa cuando no queda ninguno.

### Tarea 2.3: `es.schema.json`
- Archivos permitidos: `locales/es.schema.json`.
- Criterio: 0 `null`; 0 cadenas idénticas al inglés fuera de lista blanca; captura del editor en español sin cadenas en inglés; revisión del equipo (es el idioma del equipo).

### Tareas 2.4 a 2.9: fr, de, it (storefront y schema)
- Archivos permitidos por tarea: un solo archivo de `locales/`.
- Cambio: traducción con glosario común (`scripts/translations/glossary.md`, nuevo: términos de moda, de Shopify y de la interfaz), pluralización `one`/`other`, variables intactas, `date_formats`.
- Criterio: gate en verde; muestreo de GPT; revisión nativa firmada por idioma antes de pasar `L-15` a `cumplido`.
- Subagentes: uno por archivo (Opus 5.5).

### Tarea 2.10: superficie y notas
- Archivos permitidos: `README.md`, `RELEASE-NOTES.md`, `config/settings_schema.json` (`theme_version`), `listings/*/listing.json` (campo de idiomas).
- Criterio: `theme_version` 1.9.0.

## 3. Compuertas de calidad obligatorias (DoD de RULES.md)

- Estados degenerados: plurales con 0, 1 y muchos; cadenas largas en alemán en botones de 44 px (capturas).
- Consistencia: glosario único; ningún término traducido de dos formas.
- Superficie del comerciante: sentence case equivalente por idioma; sin jerga.
- Ledger: `L-15` en `código completo` hasta la revisión nativa.
- `npm run gates:static` 10/10 con paridad de 10 archivos.
- Gate 5: idiomas publicados en tema-qkqpke0j; recorrido del checkout previo (carrito, cajón, ficha) en los 4 idiomas en móvil; editor en español.

## 4. Instrucciones de entrega para Claude

1. 2.1, luego 2.2, luego 2.3 y 2.4 a 2.9 en paralelo (archivos disjuntos); 2.10.
2. Informe en `agent-comms/outbox-claude/CLAUDE-REPORT-11A-001.md` con la salida del gate y las capturas.
3. Sin commit ni push. Dueños: emite Gemini; implementa Claude; audita GPT (`GPT-AUDIT-034-i18n.md`); verifica Gemini con el gate y con la revisión nativa que contrata Johandry; commitea y despliega Gemini; Johandry publica los idiomas en las demos.

---

# CLAUDE-DIRECTIVE-PREFLIGHT-002: preflight de actualización

```text
ID: CLAUDE-DIRECTIVE-PREFLIGHT-002 (y GPT-TASK-035-preflight-update)
De: Gemini Flash 3.8 High (arquitecto)
Para: Claude; GPT; Johandry
Fecha: BORRADOR (pendiente de emisión)
Insumos: docs/theme-store-preflight.md, scripts/preflight.mjs, CLAUDE-PLAN-CONTOUR-REF-001.md §3
Estado: BORRADOR. Se emite una vez por paquete de actualización que se envíe (recomendado: 1.3.0, 1.6.0, 1.9.0)
Autorización de alcance: Johandry (qué versión se envía)
Autorización Nivel 2: no aplica
Rama / Base: HEAD de la versión a enviar
Versión resultante: la misma, confirmada
Filas del ledger (IDs): re-mide P-10, P-11, P-12 y las C-nn del bloque enviado; L-16 se mantiene con la fecha de la última ejecución
```

Mismo alcance, compuertas y dueños que PREFLIGHT-001, con tres añadidos: a) diff de `RELEASE-NOTES.md` entre la versión enviada anterior y la actual, para que el texto de "What's new" del formulario salga de ahí; b) comprobación de que el estado de instalación de las secciones nuevas (sin imágenes, sin `shopify://`) coincide con las demos; c) `gates:budget` dentro de los umbrales bloqueantes. GO/NO-GO en BOARD por Gemini; envío por Johandry.
