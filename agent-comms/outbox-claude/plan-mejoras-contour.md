# CLAUDE-PLAN-CONTOUR-REF-001: plan de trabajo para mejorar Sartorial tomando Contour 4.1.0 como referencia

```text
ID: CLAUDE-PLAN-CONTOUR-REF-001
De: Claude (líder técnico temporal, CLAUDE-HANDOFF-LEAD-001)
Para: Johandry / Ruiz Digital (dueño). Copia: Gemini Flash 3.8 High (arquitecto), GPT (auditor de producto).
Fecha: 2026-10-18
Directiva: ninguna. Plan propio solicitado por Johandry; se somete a ratificación de Gemini y aprobación de Johandry.
Base: 19190b1 (origin/master, 2026-10-18). Solo lectura: ningún archivo del repo fue modificado. Sin commit ni push.
Estado: propuesta. No ejecutable hasta cerrar la Fase 0.
Decisión requerida: sí. Doce decisiones de Fase 0 (sección 2) y la tabla de la sección 8.
Resumen en 5 líneas:
  1. Contour aporta patrones y lecciones, no código: se adoptan 15 mejoras priorizadas en transferencia.md y 10 lecciones de contour-rechazos.txt, reimplementadas sobre ThemeElement, base.css y los tokens de Sartorial.
  2. Antes de tocar código hay 12 decisiones que solo Johandry o Gemini pueden cerrar, la primera es rotar la contraseña del storefront y sacarla de scripts/gate5-*.mjs.
  3. El plan tiene 13 sprints (7A a 11A más dos preflights) en cuatro bloques: saneamiento, monolitos, funciones de tier, presets e idiomas. Nunca se parten theme.js y base.css en la misma entrega.
  4. El envío a la Theme Store solo depende de Fase 0, 7A, 7B, 7C y PREFLIGHT-001: unos 13 a 15 días hábiles si Lighthouse móvil supera el umbral en las demos; unos 23 a 25 si hay que partir theme.js antes.
  5. Todo lo demás (quick view, popup, lista de espera, secciones por preset, theme blocks, 5 idiomas) justifica el tier de 380 a 400 dólares y se publica como actualizaciones 1.2.0 a 1.9.0.
Archivos tocados: ninguno en el repo. Entregables en el scratchpad: este informe y directivas-borrador.md.
Desviaciones (Nivel 1 o Nivel 2): no aplica (sin código).
Hallazgos extra fuera de alcance (con parche listo): sección 7 de este plan lista riesgos; no hay parches porque no se editó nada.
Verificación (comando, resultado y qué demuestra/qué no): sección 9, afirmaciones comprobables con rg, ls y node sobre b400cdc (válidas en 19190b1 salvo la 3, anotada).
Lista de afirmaciones falsables numeradas: sección 9.
```

**Revisión 2026-10-18 (tarde):** base actualizada a 19190b1 (solo documentación de GPT: `docs/contour-reference-plan.md` y decisión "Referencia única Contour" en `docs/decisions.md`, sin cambios en el tema); se integra la estructura objetivo del repo, ver `claude/estructura-repo.md`.

---

## 1. Objetivo y principio rector

Objetivo: llevar Sartorial de 1.0.0 (candidato técnico) a un tema que pase la revisión de la Theme Store a la primera y que sostenga el tier de 380 a 400 dólares frente a Prestige, Impact y Broadcast, usando la experiencia de Contour 4.1.0 (más secciones, 5 idiomas, kit de listado, varias rondas de corrección contra requisitos públicos) sin perder la línea de Sartorial.

Principio rector, en una frase: de Contour se toman decisiones, patrones y lecciones; de Contour no se toma ni una línea de Liquid, JS, CSS, ni un hex, ni un texto. Cada mejora se reimplementa sobre `ThemeElement`, `base.css`, los tokens y la voz editorial de Sartorial. Lo que ya está escrito en `docs/decisions.md` y `AGENTS.md` sigue siendo ley: cero librerías, Web Components, CSS con variables, cero `shopify://` en plantillas, 100 % `t:`, nada de SCSS ni minificación.

Qué se adopta, qué se adapta, qué se descarta (resumen de transferencia.md):

| Se adopta tal cual (la idea) | Se adapta (la idea con mecanismos propios) | Se descarta |
|---|---|---|
| Cobertura de 5 idiomas en storefront y schema | Quick view por Section Rendering, pero con `<dialog>` nativo y el `VariantSelects` existente | Cargador de JS tras el FCP con fallback de 3 s |
| `listings/<preset>/listing.json` y capturas como kit de envío | Carga de JS por sección, pero con `<script defer>` estático y sin apagar checks | `{% stylesheet %}` por sección (acaba en un bundle global) |
| `.gitattributes`, `.shopifyignore`, README, DEVELOPMENT.md, RELEASE-NOTES.md, LICENSE.md | Partición de CSS en hojas por sección reales | Smooth scroll, loader, cursor personalizado |
| `@app` en más secciones, migas de pan, preconnect, favicon de respaldo, skip link en `<nav>` | Presets verticales: secciones exclusivas por preset dentro de la moda | Testimonios con carrusel autoplay |
| Popup de newsletter (Contour no lo tiene; se construye al estilo Sartorial) | Comparador: de specs a comparador de ajuste y tejido | Comparador antes/después con deslizador |
| Gate de pasos de `range`, preview por plantilla tras cambios de schema, una demo por preset | Lista de espera por talla a partir del notify-me | Vista grilla/lista, grupo de anuncios separado, atribución de terceros en la licencia |

Antipatrones de Contour que no entran (tabla corta; la lista completa de 22 está en transferencia.md §11):

| Antipatrón | Qué hace Sartorial en su lugar |
|---|---|
| Recorrer `collections.all.products` en Liquid para el upsell | API de recomendaciones `intent=complementary` (ya existe) |
| JS oculto al análisis estático y `AssetSizeJavaScript` apagado | Scripts estáticos con `defer`, ningún check apagado, el peso se ve y se discute |
| `div role="dialog"` con bloqueo manual de scroll | `<dialog>` nativo con `showModal()` y `syncDialogScrollLocks` central |
| Paleta y contrato visual copiados de un sitio real | Tokens propios; 0 hex compartidos con Contour, y así se queda |
| `shopify://shop_images` en plantillas por defecto | 0 ocurrencias, y un gate que las prohíbe |
| Textos quemados sin `t:` (aria-labels, defaults) | 100 % `t:`; se corrigen las 2 cadenas de `product-technical-specs.liquid:53, 69` |
| Contraseña de demos en documentación versionada | Secretos solo en variables de entorno, gate que lo verifica |
| Dos búsquedas predictivas y helpers duplicados | Un `ThemeCore`, un componente por responsabilidad |

---

## 2. Fase 0: decisiones y bloqueos previos

Nada de código de mejora empieza hasta cerrar F0-01 a F0-04. Las demás pueden cerrarse en paralelo con 7A y 7B, pero antes de PREFLIGHT-001.

| ID | Decisión o bloqueo | Quién decide | Opciones | Recomendación | Qué desbloquea |
|---|---|---|---|---|---|
| F0-01 | Rotar la contraseña del storefront en las 3 demos y en tema-qkqpke0j, y retirar el literal de `scripts/gate5-live-verify.mjs:5` y `scripts/gate5-complete-verification.mjs:5` | Johandry (rotación en Admin); Claude (retiro del literal, en 7A) | a) rotar y hacer el script fail-closed sin fallback; b) rotar y dejar fallback vacío | a). El script debe abortar con mensaje claro si falta `STOREFRONT_PASSWORD` | Gate 5, todos los arneses, PREFLIGHT-001 |
| F0-02 | Limpieza y peso del historial: `ff3dca1` y `080402c` con cookies de sesión (`harness-AUDIT-360-001/lh-headers.json`), blob con la contraseña, 24 HTML con `accessToken` en `harness-AUDIT-360-002/html-validation/`, y un `.git` de 220 MB que son casi todo evidencias PNG y PDF | Johandry decide; Gemini ejecuta | a) rotar credenciales y dejar el historial (repo privado); b) reescribir con `git filter-repo`, force push y reclonar en los 4 entornos | b) reescribir una vez, entre 7B y 7C, porque resuelve los 220 MB de `.git` y las cookies de ff3dca1/080402c en el mismo acto. Lista de rutas: `claude/estructura-repo.md` §5. Requisitos: F0-01 hecha antes, `git clone --mirror` de respaldo fuera de OneDrive, ventana sin trabajo abierto, integración de GitHub desconectada si existe, reclonar (no `pull`) y fecha en `docs/decisions.md`. Criterio: `du -sh .git` < 30 MB y `git log --all -- harness-AUDIT-360-001/lh-headers.json` vacío | Cerrar el P0 de BOARD §4.5; clones ligeros; publicar el repo |
| F0-03 | Nombre del segundo preset: Edition (decisions.md:162, ledger, tienda `sartorial-edition`) o Imprint (`config/settings_data.json`, `listings/imprint/`, BOARD §9 en adelante) | Johandry | a) Imprint; b) Edition | a) Imprint, por dos razones: es lo que está desplegado y "Editions" fue un tema publicado en la Theme Store (verificar en themes.shopify.com antes de cerrar). Registrar en `docs/decisions.md`, actualizar las 2 filas del ledger que dicen Edition, revisar el tagline (habla de "objects", no de moda) y el nombre visible de la tienda demo | 7A, 10C, 11A, kit de listado |
| F0-04 | Autoridad y regla única de Nivel 2 (AGENTS.md:26 pide autorización del usuario; RULES.md:87 la de Gemini; BOARD.md:5-6 pone a Gemini como único escritor y a Claude como líder) | Johandry | a) Gemini autoriza todo Nivel 2; b) regla dividida | b): Nivel 2 técnico (ids, defaults, archivos fuera de lista) lo autoriza Gemini por escrito en la directiva; Nivel 2 de alcance (función nueva, setting visible al comerciante, borrar plantillas, cambiar versión) lo autoriza Johandry y Gemini lo transcribe en la directiva con la fecha. Claude sigue sin commitear ni hacer push salvo autorización escrita. Publicar como RULES.md 1.1 y alinear AGENTS.md y la cabecera de BOARD.md | Toda directiva nueva |
| F0-05 | Versión: `theme_version` sigue en 1.0.0 (`config/settings_schema.json:6`) pero BOARD etiqueta "v1.1.0" las fases 1 y 2 | Gemini propone, Johandry ratifica | a) quedarse en 1.0.0 hasta el envío; b) subir en cada sprint con RELEASE-NOTES | b). 7A sale como 1.0.1, 7B como 1.0.2, 7C como 1.1.0 (candidato de envío). Un release por sprint, siempre con entrada en `RELEASE-NOTES.md` | 7A y todos los siguientes |
| F0-06 | Decisiones que viven solo en BOARD.md y faltan en `docs/decisions.md` (última entrada 2026-09-26): retiro de GSAP (MOTION-002), rechazo de Lenis, eliminación de marquee-drift, layout de contraseña, preset Imprint, URLs en GitHub Pages (contradice decisions.md:173-175 y deja DP-001 mal cerrada) | Gemini redacta, Johandry firma | a) una entrada retroactiva por decisión con su fecha real; b) una sola entrada de consolidación | a). También cerrar DP-002 (habla de 18 filas y de un ID de tema antiguo) | 7B (DEVELOPMENT.md se escribe sobre decisiones firmadas) |
| F0-07 | IDs estables en el ledger (hoy sin columna de ID; BOARD cita "Fila 72" para una fila que está en la línea 75) | Gemini | a) columna `ID` con prefijo por sección (A-01, P-01, X-01, C-01, S-01, L-01); b) numerar por línea | a). Exige actualizar `scripts/ledger-verify.mjs` (estructura) y reescribir las referencias de BOARD. Se hace en 7B, una sola vez | Todas las filas que este plan crea o cierra |
| F0-08 | `mailto:support@ruizdigital.com` en `docs/merchant/support.html:271` (dominio ajeno al autor) y plazo de respuesta | Johandry | a) quitar el mailto y dejar el formulario como único canal, declarando "2 business days"; b) buzón en un dominio propio | a) ahora; b) cuando exista dominio. El cambio vive en el repo `sartorial-docs`, fuera de este | PREFLIGHT-001 (theme_info con un solo canal operativo) |
| F0-09 | Plantillas `page.documentation` y `page.support` con `main-documentation.liquid` (313 líneas) y `main-support.liquid` (386) dentro del tema del comerciante; `main-documentation.liquid:241` tiene "Sartorial" como default | Johandry (es alcance) | a) borrar las 2 plantillas y las 2 secciones, el contenido ya está en `sartorial-docs`; b) dejarlas sin preset y fuera de las plantillas | a). Nivel 2 de alcance. Reduce 2 plantillas, 2 secciones, unas 60 claves de schema y 21,5 KB de CSS por repartir en 8B | 7A, 8B |
| F0-10 | Lógica atada al catálogo demo: `snippets/product-technical-specs.liquid:46-69` infiere material por handle (`brass`, `paperweight`) y tipo; `snippets/product-provenance.liquid:30` activa "circa" si el título contiene `19` o `20` | Johandry confirma los metafields; Claude implementa en 7A | a) solo metafields (`custom.material`, `custom.gsm`, `custom.hardware`, `custom.provenance_year`) con fallback al setting del bloque, sin inferencia; b) mantener inferencia | a). Los metafields se declaran en el `info` del setting. En 10A estos bloques se sustituyen por `fabric_specs` y `provenance-ledger` | 7A, PREFLIGHT-001 |
| F0-11 | Dónde viven las evidencias crudas (621 archivos PNG, PDF, HAR y JSON crudos de `agent-comms/outbox-*/harness-*` y `docs/gate5-reports/`, el 95 % del peso del repo) | Johandry | a) repo privado `Noobprobro-web/sartorial-evidence` con la misma jerarquía de carpetas; b) adjuntos de GitHub Releases por sprint | a), con la línea "Evidencia cruda: sartorial-evidence/<ruta>@<sha>" en cada informe (`claude/estructura-repo.md` §5) | 7B-T11 |
| F0-12 | Nombre de las notas de versión: la CLI empaqueta `release-notes.md` en minúsculas y nunca `RELEASE-NOTES.md` en mayúsculas | Johandry | a) `release-notes.md` en minúsculas, redactado para el comerciante (viaja en el ZIP); b) `RELEASE-NOTES.md` como registro interno | a); el registro técnico sigue en BOARD | 7A-T6, 7B-T3, PF-14 |

Bloqueos adicionales que no son decisiones nuevas pero hay que cerrar antes del preflight: exportar `STOREFRONT_PASSWORD` en el entorno de los arneses; retirar la protección por contraseña de las demos para el revisor (o aceptar que el revisor recibe la contraseña en el formulario, que es lo que la Theme Store prevé); CI en Node 20 y `.nvmrc` en 22.12.0 (alinear a 22 en 7B); repo fuera de OneDrive.

---

## 3. Sprints en orden

Convenciones comunes a todos los sprints. Emite: Gemini (directiva en `agent-comms/inbox-claude/CLAUDE-DIRECTIVE-<ID>.md` o `inbox-gpt/GPT-TASK-<NNN>-<slug>.md`), previa autorización escrita de Johandry para el alcance. Implementa: Claude, informe en `outbox-claude/CLAUDE-REPORT-<ID>.md` con la cabecera de RULES.md §1.4, sin commit ni push. Audita: GPT en `outbox-gpt/GPT-AUDIT-<NNN>-<slug>.md` (producto, UX, comercio, Theme Store). Verifica (adversarial): Gemini en `reviews/GEMINI-review-CLAUDE-<ID>.md` abriendo archivos, no informes; cuando GPT escribe código, verifica Claude. Commitea y despliega: Gemini, único escritor de BOARD.md, con `shopify theme push --nodelete` a tema-qkqpke0j primero y a las 3 demos después. Compuertas mínimas para cerrar: `gates:static` 8/8 con exit 0 (más los gates que cada sprint añada), DoD de RULES.md §2 (5 estados degenerados, consistencia, superficie del comerciante, ledger), Gate 5 en tienda real para toda fila que exija medición, dictamen adversarial, BOARD.md y `docs/decisions.md` actualizados, `theme_version` y `RELEASE-NOTES.md` con la versión indicada.

Numeración: los sprints existentes llegan a 6C; este plan empieza en 7A. GPT: `GPT-AUDIT-020`, `GPT-TASK-021` y `GPT-REPORT-021` son los más altos; el plan continúa desde 022. Ledger: las filas nuevas nacen como `ausente` al emitirse la directiva, pasan a `código completo` con el informe de Claude y a `cumplido` solo con evidencia en tienda real o estática según el caso. Los IDs de fila usan el esquema de F0-07 (sección 6 del ledger: `L-nn`; sección 2: `P-nn`; sección 3: `X-nn`; sección 4: `C-nn`); hasta que F0-07 se aplique, se citan por texto.

### Sprint 7A: saneamiento P0 y P1 (seguridad, catálogo demo, plantillas de desarrollador)

| Campo | Contenido |
|---|---|
| Objetivo | Dejar el repo y el paquete sin secretos, sin lógica atada al catálogo demo y sin contenido del desarrollador en la tienda del comerciante |
| Alcance | 7A-T1 `scripts/gate5-live-verify.mjs`, `scripts/gate5-complete-verification.mjs`: quitar el fallback literal, abortar con exit 1 y mensaje si falta `STOREFRONT_PASSWORD`; `scripts/capture-presets.mjs` igual si tiene fallback. 7A-T2 `.gitignore`: añadir `tools/harness/*/html-validation/` y `tools/harness/**/*headers.json` si 7B-T10 se integra antes; si 7A va primero, se escriben con las rutas actuales (`harness-*/html-validation/`, `harness-*/**/*headers.json`) y Gemini aplica el `git mv` y ajusta los patrones en la integración; sacar del índice (`git rm --cached`) los 24 HTML de `harness-AUDIT-360-002/html-validation/` (`tools/harness/AUDIT-360-002/html-validation/` tras el movimiento). 7A-T3 borrar `templates/page.documentation.json`, `templates/page.support.json`, `sections/main-documentation.liquid`, `sections/main-support.liquid`, sus claves en `locales/en.default.schema.json`, `en.default.json`, `es.json` y su CSS en `assets/base.css` (bloque "Documentación, soporte"). 7A-T4 `snippets/product-technical-specs.liquid`: eliminar la inferencia por handle y tipo (líneas 40-72), leer `product.metafields.custom.material | gsm | hardware`, fallback al setting del bloque, quitar `'Solid milled brass'` y `'Precision machined'`; `snippets/product-provenance.liquid`: eliminar la inferencia por título (línea 30), leer `custom.provenance_year` o el setting del bloque con `info` que diga que se muestra tal cual. 7A-T5 aplicar F0-03: si es Imprint, actualizar `docs/decisions.md`, las 2 filas del ledger y el tagline; si es Edition, renombrar la clave del preset, `listings/imprint/` y las referencias. 7A-T6 `config/settings_schema.json` `theme_version` 1.0.1 y primera entrada de las notas de versión (1.0.0 retroactiva y 1.0.1), con el nombre que fije F0-12 (`release-notes.md` o `RELEASE-NOTES.md`) |
| Qué NO entra | Ninguna función nueva. Ni `.shopifyignore` ni README (7B). Ni `@app` ni migas (7C). No tocar `theme.js` salvo que 7A-T3 deje código muerto de `main-support` (`FaqFilter` se queda porque `main-faq` lo usa) |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-7A-001`). Implementa Claude. Audita GPT (`GPT-AUDIT-022-saneamiento-7a`, enfoque: ¿queda alguna huella del catálogo demo, algún texto del desarrollador, algún claim?). Verifica Gemini (`GEMINI-review-CLAUDE-7A-001`). Commitea y despliega Gemini |
| Dependencias | F0-01 (rotación hecha antes del push), F0-03, F0-05, F0-09, F0-10, F0-12 (nombre de las notas en 7A-T6) |
| Ledger | Crea `L-06` "Sin secretos ni credenciales en el repositorio ni en el paquete" (fuente: higiene / BOARD §4.5 P0; sección 6) y la cierra en `cumplido` con `rg` como evidencia. Crea `L-07` "Sin contenido del desarrollador en plantillas del comerciante" (fuente: Official Requirements: Demos y Copy auténtico; sección 6), `cumplido`. Crea `C-24` "Datos de producto por metafields, sin inferencias sobre handle, título o tipo" (fuente: Official Requirements: Copy auténtico / BOARD claims; sección 4), `código completo` hasta ver la ficha en las 3 demos con y sin metafields |
| Compuertas y cierre | `gates:static` 8/8; `rg -n "STOREFRONT_PASSWORD \|\|" scripts` = 0; `rg -n "brass\|paperweight\|contains '19'" snippets` = 0; `ls templates/*.json | wc -l` = 15; `git ls-files tools/harness \| rg html-validation` = 0 (o `git ls-files 'harness-*' \| rg html-validation` = 0 si 7A se integra antes de 7B-T10); las 3 demos muestran la ficha con metafields presentes y ausentes (Gate 5, capturas en `harness-7A-001/`) |
| Riesgo | Bajo. Borrar plantillas puede dejar páginas `page.documentation` asignadas en las demos: Johandry las reasigna a `page` antes del push |
| Esfuerzo | 2 a 3 días |
| Nivel de parche | Nivel 2 de alcance (borra plantillas, cambia defaults de bloques), autorizado en la directiva |
| Versión | 1.0.1, `RELEASE-NOTES.md` sección "1.0.1: data integrity and cleanup" |

### Sprint 7B: higiene de repo, estructura y compuertas nuevas

| Campo | Contenido |
|---|---|
| Objetivo | Convertir en gates las lecciones de Contour, dejar el repo documentado para humanos y ligero de compartir: evidencias crudas fuera, arneses en `tools/`, un único comando para el ZIP (estructura objetivo, alternativa A de `claude/estructura-repo.md`) |
| Alcance | 7B-T1 `.gitattributes` con el contenido de `claude/estructura-repo.md` §3: `* text=auto eol=lf`, explícitos para liquid, json, css, js, mjs, md, yml y svg, binarios marcados y `*.json linguist-language=jsonc`; `export-ignore` solo si D23 lo aprueba; `git add --renormalize .` (el índice ya está 100 % LF, diff mínimo). 7B-T2 (reescrita) `.shopifyignore` solo con lo que `theme push`, `pull` y `dev` pueden leer: `AGENTS.md`, `DESIGN.md`, `*.zip`, `*.map`, `*.orig`, `*.rej`, `*.bak`, `*.tmp`, `.DS_Store`, `Thumbs.db`, `config/*.local.json`, `templates/*.temp.json`. Se eliminan de la lista `agent-comms/`, `harness-*/`, `docs/`, `scripts/`, `tests/`, `package*.json` y `listings/**`, porque la CLI no los lee y los patrones con barra final disparan el aviso "Directory pattern may be misleading". 7B-T2b (nueva) `scripts/package-theme.mjs` con `npm run theme:package` y `gates:package --verify` en `package.json` (`dist/` ya está en `.gitignore`): copia a una carpeta de `os.tmpdir()` solo las carpetas del tema, `listings/<preset>/{templates,sections}` y `release-notes.md` si existe (F0-12), llama a `shopify theme package --path <temporal>`, deja `dist/Sartorial-<theme_version>.zip` y con `--verify` falla si entra un archivo fuera de la lista blanca, si falta `layout/theme.liquid`, `settings_schema.json` o `settings_data.json`, o si pasa de 50 MB. `AGENTS.md` deja de viajar en el ZIP. 7B-T3 `README.md` en inglés (qué es, presets, Node 22 y Shopify CLI, `npm run gates:static`, tabla de carpetas "ships to merchants" sí/no, prohibición del Download ZIP de GitHub y de `shopify theme package` directo, docs y soporte, licencia; borrador en `diseno/objetivo/README.md`); el texto actual pasa a `docs/project-history.md`. 7B-T4 `DEVELOPMENT.md` (tiendas y presets sin contraseñas, cómo correr compuertas, cómo añadir una sección: schema con `t:`, locales, `enabled_on`, módulo JS con `defer`, hoja CSS propia, estados degenerados; cómo liberar una versión con `npm run theme:package`). 7B-T5 `LICENSE.md` de tema comercial sin terceros. 7B-T6 `layout/theme.liquid`: `preconnect` a `fonts.shopifycdn.com` si la fuente no es de sistema, `preload_tag` de las 2 fuentes regulares, favicon SVG inline de respaldo, skip link dentro de `<nav aria-label>`; replicar lo que aplique en `layout/password.liquid`. 7B-T7 gates: `scripts/json-validate.mjs` rechaza `shopify://` en `templates/` y `listings/`, valida que cada valor numérico de `settings_data.json` y `listings/**/templates` caiga en `min + n * step`, y valida `listings/<preset>/listing.json` y dimensiones PNG cuando existan; `scripts/locale-key-inventory.mjs` exige paridad estructural de todo `locales/*.json` con su `en.default` y marca cadenas idénticas al inglés fuera de una lista blanca; nuevo `scripts/secrets-scan.mjs` (`gates:secrets`) que falla ante `process.env.X || '<literal>'`, cookies `_shopify_*`, tokens `shpat_`, `shpca_`; `gates:syntax` con glob sobre `assets/*.js`; `scripts/ledger-verify.mjs` acepta la columna `ID` (F0-07) y falla si falta o se repite. 7B-T8 (ajuste) `.github/workflows/ci.yml`: `node-version-file: .nvmrc` en vez de un número (cierra Node 20 frente a 22.12.0), pasos para los gates nuevos y `gates:weight` antes de `gates:package`, que ya verifica el manifiesto. 7B-T9 ledger: columna `ID`, y Gemini reescribe las referencias de BOARD. 7B-T10 (nueva) `git mv` de las 9 `harness-*` a `tools/harness/<ID>/`, de `cobertura-360-002.csv` a `tools/harness/AUDIT-360-002/` y de `.agents/teamwork` a `agent-comms/archive/teamwork-audit360/` (D24); `git rm` de `.playwright-mcp`; `.theme-check.yml` ignora `tools/**`, `evidence/**` y `dist/**` en lugar de `harness-*/**`, `.agents/**` y `.playwright-mcp/**`; `tools/harness/README.md` con la tabla ruta vieja a ruta nueva (el histórico no se reescribe). 7B-T11 (nueva) política de evidencias (F0-11): `scripts/repo-weight.mjs` (`gates:weight`); `.gitignore` con `.playwright-mcp/`, `evidence/` y los patrones de evidencia cruda bajo `agent-comms/**` y `tools/**` (png, jpg, webp, pdf, har, `raw-*.json`, `html-validation/`); exportación de los 621 archivos a `sartorial-evidence` con la misma ruta y `git rm --cached`; línea "Evidencia cruda" en los informes afectados (LEAD-001, MOTION-002, TECH-AUDIT-001, 4F-001, 4F-002, AUDIT-FINAL-002/003, 5A-001, DOCS-VERIFY-001, GPT-018, gate5-reports); la regla en RULES §1.4 y en `AGENTS.md`. 7B-T12 (nueva, depende de que Johandry entregue los archivos; D21) `scripts/deploy/{deploy-presets,verify-dev-previews,verify-presets-live}.mjs` con `targets.json` sin secretos y credenciales solo por variables de entorno; `package.json` `deploy:dev`, `deploy:demos`, `verify:live` |
| Qué NO entra | Nada de CSS o JS de componente. No se parte nada. Nada de `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/` ni `listings/` se mueve. `.theme-check.yml` solo cambia sus rutas ignoradas (T10): sigue `recommended` sin apagar ningún check. La reescritura del historial (F0-02) no es parte del sprint: va en la ventana entre 7B y 7C |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-7B-001`). Implementa Claude (gates, layout, archivos raíz, movimientos, exportación de evidencias y adaptación de los scripts de despliegue) y Gemini (7B-T9 referencias de BOARD y F0-06 en decisions.md). Johandry crea `sartorial-evidence` y entrega los scripts de `scratch/`; GPT escanea secretos en ellos antes de que Claude los adapte. Audita GPT (`GPT-AUDIT-023-higiene-7b`: README y DEVELOPMENT legibles para un comerciante técnico, licencia, superficie, y además ZIP, peso y evidencias). Verifica Gemini sobre Claude y Claude sobre la parte de Gemini. Commitea y despliega Gemini (push de `sartorial-evidence` primero y sustitución de "sha pendiente" por el sha real). La reescritura (F0-02) la ejecuta Gemini con autorización escrita de Johandry, entre 7B y 7C |
| Dependencias | F0-05, F0-06, F0-07, F0-11 (T11), F0-12 (T2b y T3), D17 (T10 y T11), D21 (T12; si Johandry no entrega los archivos, T12 sale del sprint sin bloquearlo). Puede correr en paralelo con 7A si las listas de archivos no se cruzan (7A no toca `scripts/json-validate.mjs` ni las carpetas que mueve T10; 7B no toca `snippets/` ni `templates/`). Cruces: `RELEASE-NOTES.md` y `theme_version`, y `.gitignore` (7A-T2 y 7B-T11), que integra Gemini; si 7A va primero, Gemini aplica el `git mv` de T10 sobre lo que dejó 7A-T2 |
| Ledger | Crea `L-08` "Notas de versión por release" (fuente: Theme Store, actualizaciones; sección 6), `cumplido`. `L-09` "Paquete limpio generado por `scripts/package-theme.mjs` y verificado contra lista blanca" (Official Requirements: Packaging), `cumplido`. `L-10` "Licencia comercial propia sin restos de terceros" (contour-rechazos §6.7), `cumplido`. `L-11` "Repositorio sin evidencias crudas ni secretos; Download ZIP menor de 10 MB" (fuente: higiene, BOARD §4.5; sección 6), `cumplido` con `gates:weight` y `git archive` como evidencia. `P-09` "`preconnect` y preload de fuentes" (guía de rendimiento de shopify.dev; sección 2), `código completo` hasta medir. `X-14` "Skip link dentro de landmark" (WCAG 2.4.1 / axe region; sección 3), `código completo` hasta axe en vivo |
| Compuertas y cierre | `gates:static` pasa a 10 (con `gates:secrets` y `gates:weight`) y sale 0; CI con 10 pasos en verde. T1: `git ls-files --eol \| rg -c "i/crlf"` = 0 y el commit de renormalize tiene menos de 10 archivos. T2: `rg -n "^(docs\|scripts\|tests\|agent-comms\|package)" .shopifyignore` = 0; `npx shopify theme dev` arranca sin el aviso "Directory pattern may be misleading"; en el tema de desarrollo no aparece `AGENTS.md` tras un `theme push --nodelete`. T2b: `npm run theme:package` imprime "Manifest OK"; `unzip -Z1 dist/*.zip` solo tiene `assets/ config/ layout/ locales/ sections/ snippets/ templates/ listings/*/templates/`; la prueba negativa con `DESIGN.md` y `listings/sartorial/preview.png` en el árbol sigue limpia. T3: GPT lo lee como comerciante técnico; ningún secreto ni contraseña; enlaces de docs y soporte responden 200. T7: `node scripts/json-validate.mjs` falla ante un `shopify://` inyectado y ante un valor fuera de `step` (demostración con mutación y restauración, como `theme-check-sanity`). T10: `ls -d harness-* .agents .playwright-mcp cobertura-360-002.csv` vacío; Theme Check 0 ofensas sobre el mismo número de archivos que antes (92 en 19190b1); `npx playwright test --list` 2 tests. T11: `gates:weight` exit 0 y árbol < 20 MB; `git archive --format=zip HEAD` < 10 MB; `ledger-verify` 0 incoherencias; `diff` de listas entre lo exportado y `sartorial-evidence` vacío. T12: `gates:secrets` exit 0 sobre `scripts/deploy`; `--dry-run` lista las 6 instancias con sus theme IDs de BOARD §14 |
| Riesgo | Medio-bajo. Los documentos históricos citan rutas viejas (`harness-AUDIT-360-002/...`): se resuelven con `tools/harness/README.md`, sin reescribir el histórico. Un agente puede dejar capturas en una carpeta que `.gitignore` traga en silencio: RULES §1.4 obliga a citar `sartorial-evidence/<ruta>@<sha>` en la cabecera del informe y GPT lo abre en la verificación. Antes de T10, Gemini hace `git clone --mirror` fuera de OneDrive. El renormalize casi no produce diff (índice ya 100 % LF), pero se mantiene el commit separado "chore: normalize line endings" |
| Esfuerzo | 3 a 4 días de Claude; Gemini 1 día más medio día de ventana de reescritura (F0-02, entre 7B y 7C) |
| Nivel de parche | Nivel 1 en código; Nivel 2 documental (ledger y RULES 1.1) y de estructura (movimiento de carpetas, repo de evidencias, scripts de despliegue), autorizado |
| Versión | 1.0.2 |

### Sprint 7C: ganancias rápidas de extensibilidad y navegación

| Campo | Contenido |
|---|---|
| Objetivo | Cerrar lo barato que separa a Sartorial de los temas del tier sin tocar los monolitos |
| Alcance | 7C-T1 `@app` en `sections/main-collection.liquid` (cabecera y entre filtros y grilla), `sections/main-cart-items.liquid`, `sections/cart-drawer.liquid` (bajo el resumen; comprobar que el re-render por Section Rendering conserva el bloque), `sections/footer.liquid`, `sections/header.liquid` (barra de utilidades), `sections/main-page.liquid`, `sections/main-article.liquid`, con `{% when '@app' %}{% render block %}` y `block.shopify_attributes`. 7C-T2 `snippets/breadcrumbs.liquid` nuevo (`<nav aria-label>`, separador `aria-hidden`, `aria-current="page"`, objetivos de 44 px, colección padre desde `collection` cuando la URL es `within`, si no `product.collections.first`), setting `show_breadcrumbs` con `t:` en `main-product`, `main-collection`, `main-article`, `main-page`, default `false` para no alterar las demos; CSS en `base.css` (hasta 8B) en voz de eyebrow. 7C-T3 `assets/theme.js`: mover `applyBackgroundInert` y `restoreBackgroundInert` a `ThemeCore` y que los 4 a 6 duplicados lo llamen; exponer `ThemeCore.motionAllowed()` y usarlo en los 3 `matchMedia` existentes; verificar en consola el `InvalidStateError` de `pageswap` hacia checkout y añadir el `catch` solo si aparece. 7C-T4 locales en/es para todo lo nuevo |
| Qué NO entra | Ningún archivo JS nuevo (eso fija el patrón en 8A). Ningún diálogo nuevo. Quick view no |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-7C-001`). Implementa Claude. Audita GPT (`GPT-AUDIT-024-extensibilidad-7c`: prueba de instalación de 2 apps reales de reseñas y wishlist en tema-qkqpke0j, migas en móvil). Verifica Gemini. Commitea y despliega Gemini |
| Dependencias | 7A y 7B integrados (comparte `theme.js` con nadie en ese momento). Puede correr en paralelo con la redacción de PREFLIGHT-001 |
| Ledger | Crea `C-25` "Bloques `@app` en colección, carrito, cajón, header, footer, página y artículo" (Official Requirements: App Integration, extensibilidad; sección 4), `código completo` hasta instalar 2 apps en vivo. `C-26` "Migas de pan accesibles" (WCAG 2.4.8 / benchmark de tier; sección 4), `código completo` hasta axe. Modifica la fila existente "Bloques de Aplicación (`@app`)" para citar las 9 secciones |
| Compuertas y cierre | `gates:static` 10/10; `gates:hooks` sin contratos rotos; 2 apps instaladas y visibles en 5 superficies; migas con teclado y lector en móvil; `rg -n "applyBackgroundInert" assets/theme.js` muestra una definición |
| Riesgo | Medio-bajo: el re-render del cajón por Section Rendering y los bloques de app; probar con una app real, no con un bloque vacío |
| Esfuerzo | 3 días |
| Nivel de parche | Nivel 2 (settings nuevos `show_breadcrumbs`, tipos `@app` nuevos), autorizado en la directiva |
| Versión | 1.1.0, candidato de envío |

### Sprint PREFLIGHT-001: preflight Theme Store (lista ejecutable, Gate 5 y medición)

| Campo | Contenido |
|---|---|
| Objetivo | Convertir las lecciones de contour-rechazos.txt en una lista de verificación ejecutable y correrla completa sobre 1.1.0 en tienda real antes de que Johandry envíe |
| Alcance | PF-T1 `docs/theme-store-preflight.md`: lista con ID, qué se comprueba, cómo (comando o pasos), evidencia esperada y quién. Ítems mínimos: PF-01 nombre del tema y de los 3 presets sin colisión en themes.shopify.com y con el nombre de las tiendas demo (fecha de comprobación); PF-02 `theme_info` con un solo campo de soporte (`theme_support_url` o `email`, nunca ambos), ambas URLs 200 y la página de soporte con formulario operativo y plazo de 2 días hábiles; PF-03 subida a tienda de desarrollo y preview de las 16 plantillas tras cualquier cambio de schema (los grupos con tipo inválido, los richtext sin etiqueta de bloque y los `theme_info` en conflicto no los ve Theme Check); PF-04 ninguna plantilla JSON con más de 25 secciones; PF-05 una demo por preset, estado de instalación igual a la demo (diff de `listings/<preset>/templates` contra el tema desplegado), sin `shopify://`, imágenes en la propia tienda, copy auténtico sin Lorem ipsum, sin marcas ajenas ni claims absolutos, pasarela de prueba activa; PF-06 Lighthouse móvil y escritorio en demo real (no en local) en home, producto y colección de los 3 presets, con 3 corridas y mediana: rendimiento media ≥ 60, accesibilidad ≥ 90; PF-07 axe en cada plantilla a 1440 y 390 px incluidos estados ocultos (cajón, menú móvil, quick buy, zoom, búsqueda, selector de país); PF-08 contraste 4.5:1 texto y 3:1 no texto desde tokens, objetivos de 24 px, foco visible, menú de 3 niveles; PF-09 funciones obligatorias: paginación de colección, lista de colecciones, blog y comentarios, `@app`, rich media, `<shopify-account>`, Shop Pay Installments, Follow on Shop, accelerated checkout, `cart.taxes_included`, QR de gift card ≥ 120 px, Custom Liquid, fuentes con bold e italic, favicon, `page_image`, selling plans, pickup; PF-10 licencias: sin librerías vendorizadas (argumento), `LICENSE.md` presente, sin restos de starters; PF-11 fuentes por handle válido (Georgia silenciosa como síntoma); PF-12 paquete: ZIP generado por `npm run theme:package` (nunca `shopify theme package` directo ni el Download ZIP de GitHub) y verificado con `gates:package --verify` contra la lista blanca; PF-13 CSV de demo con campos de variante en cada fila; PF-14 notas de versión (nombre según F0-12; si son `release-notes.md`, viajan en el ZIP) y `theme_version` coinciden con el ZIP; PF-15 `gates:static` y `gates:secrets` en verde; PF-16 material del formulario listo (tagline ≤ 70, descripción, capturas 2000x2496 y 750x1334, 3 highlights 1600x1200, industria, catálogo, etiquetas). PF-T2 `scripts/preflight.mjs` (`gates:preflight`): ejecuta lo automatizable (PF-02 URLs, PF-04, PF-05 diff y `shopify://`, PF-12, PF-14, PF-15) y emite `docs/gate5-reports/preflight-<fecha>.md` con los ítems manuales en blanco para rellenar. PF-T3 recertificar las 6 filas en `código completo` (35, 38, 56, 57, 58, 75) y las nuevas de 7B y 7C con los arneses existentes (`harness-MOTION-002`, fixtures de punto focal y 3D de Johandry) |
| Qué NO entra | Correcciones de fondo: si PF-06 falla, se abre 8A; si falla una función, se abre un hotfix `7D-001` con su propia directiva |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-PREFLIGHT-001` para la lista y el script; `GPT-TASK-025-preflight-theme-store` para la ejecución de PF-05 a PF-09 en las 3 demos como auditor independiente). Implementa Claude (lista, script, recertificación). Audita GPT (ejecuta la lista completa y firma `GPT-AUDIT-025-preflight-theme-store`). Verifica Gemini (`GEMINI-review-PREFLIGHT-001`, con medición propia de PF-06 en al menos un preset). Johandry: PF-01, PF-02, PF-05 (pasarela, nombre de tienda), PF-16 y el envío |
| Dependencias | 7A, 7B, 7C integrados y desplegados a tema-qkqpke0j y a las 3 demos; `STOREFRONT_PASSWORD` exportada; F0-08 aplicado |
| Ledger | Crea `P-10` "Lighthouse móvil ≥ 60 y accesibilidad ≥ 90 en home, producto y colección de las 3 demos" (Official Requirements: Performance; sección 2), nace `no verificado` y cierra con el reporte. `L-16` "Preflight ejecutado y firmado por un agente distinto del implementador antes de cada envío" (proceso; sección 6; antes numerada `L-11`, que pasa a 7B). Cierra las 6 filas en `código completo` si la medición acompaña |
| Compuertas y cierre | 16 ítems con evidencia y firma; `gates:preflight` exit 0; ledger 0 filas en `código completo` o, si quedan, con dueño y fecha; GO/NO-GO escrito por Gemini en BOARD y ratificado por Johandry |
| Riesgo | Medio: PF-06 puede dar menos de 60 en móvil con 57 KB gz de JS y 50 KB gz de CSS bloqueante. Regla: si la mediana de rendimiento móvil es ≥ 70 en los 9 casos, se envía 1.1.0; si está entre 60 y 70, Johandry decide; si es menor que 60 en cualquiera, 8A antes del envío |
| Esfuerzo | 3 a 4 días (1 de lista y script, 2 a 3 de ejecución y recertificación) |
| Nivel de parche | Ninguno en el tema; solo docs y scripts |
| Versión | 1.1.0 confirmada como paquete de envío (`Sartorial-1.1.0.zip`) |

### Sprint 8A: partición de theme.js en núcleo y módulos por sección

| Campo | Contenido |
|---|---|
| Objetivo | Que cada página cargue solo el JS que usa, con `<script defer>` estático y sin apagar checks, fijando el patrón de módulo para todo lo nuevo |
| Alcance | Según transferencia.md §3: `assets/theme.js` queda como núcleo (helpers, `ThemeElement`, `ThemeDisclosure`, `ThemeDrawer`, `LocalizationForm`, `AnnouncementBar`, reduced motion, `closeOtherDialogs`, `syncDialogScrollLocks`, header scroll, steppers, `pageswap`, export `ThemeCore`, objetivo ≤ 10 KB gz). Módulos nuevos, cada uno un IIFE con `if (!window.ThemeCore) return;` y guarda `customElements.get`: `cart-drawer.js` (y `cart-drawer-extras.js` cargado al primer `open()`), `predictive-search.js`, `product-card.js`, `product.js`, `facets.js`, `motion.js`, `lookbook.js`, `complete-the-look.js`, `hero-editorial.js`, `curated-showcase.js`, `marquee.js`, `product-recommendations.js`, `recently-viewed.js`, `content.js`, `password.js`. Cada sección o snippet escribe `<script src="{{ 'x.js' | asset_url }}" defer></script>`; en `request.design_mode` `layout/theme.liquid` carga todos los módulos con `defer`. 8A-T2 `featured-product` deja de depender de `VariantSelects` y usa el picker de la tarjeta (quita `product.js` de la home). 8A-T3 arneses: `gates:syntax` ya es glob (7B); `dataset-hooks.mjs` recorre todos los módulos; nuevo `scripts/js-budget.mjs` (`gates:budget`, solo informa) que calcula KB gz por plantilla a partir de los scripts referenciados por layout y secciones, y escribe la tabla en el informe |
| Qué NO entra | `base.css` no se toca más allá de lo imprescindible. Ningún componente nuevo. Nada de módulos ES ni bundler |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-8A-001`). Implementa Claude con un subagente por módulo (sección 4). Audita GPT (`GPT-AUDIT-026-js-split`: regresión funcional en los 5 flujos de compra y en el editor de temas, incluida sección añadida en vivo). Verifica Gemini (`GEMINI-review-CLAUDE-8A-001`, con `js-budget` y Lighthouse antes y después). Commitea y despliega Gemini |
| Dependencias | 7B (gates), 7C (inert y `motionAllowed` ya en `ThemeCore`). Nunca junto con 8B |
| Ledger | Crea `P-11` "JavaScript cargado por sección con `defer` estático; núcleo ≤ 10 KB gz; sin checks desactivados" (Official Requirements: Performance / Theme Check; sección 2), `código completo` hasta Lighthouse. Modifica "JavaScript Modular Vanilla (Zero Libs)" para citar los módulos. Cierra o re-abre `P-10` según la nueva medición |
| Compuertas y cierre | `gates:static` 10/10; `gates:budget`: home ≤ 45 KB gz, producto ≤ 50, colección ≤ 42, contenido ≤ 35, password ≤ 11; los 28 custom elements siguen definidos en la plantilla que los usa (script `rg "customElements.define"` contra un inventario); en el editor, añadir cada sección con JS en vivo y comprobar que se inicializa; 0 errores de consola en 16 plantillas y 3 presets; `theme-check:all` sin `AssetSizeJavaScript` en layouts |
| Riesgo | Medio-alto por volumen, bajo por técnica (`product-zoom.js` ya la prueba). Vigilar: HTML del cajón por Section Rendering sin `<script>`, selectores de `closeOtherDialogs` para componentes aún no definidos, `REVEAL_TARGETS` en `motion.js` |
| Esfuerzo | 7 a 9 días con regresión completa |
| Nivel de parche | Nivel 2 (archivos nuevos en `assets/`, cambio de `featured-product`), autorizado |
| Versión | 1.2.0 |

### Sprint 8B: partición de base.css en base, movimiento por estilo y hojas por sección

| Campo | Contenido |
|---|---|
| Objetivo | Bajar el CSS bloqueante de 50,5 KB gz a unos 21 KB gz y que cada sección sea dueña de su hoja |
| Alcance | Trabajo previo obligatorio: mover los parches tardíos ("AUDITORIA EN VIVO" `:7461, :8107, :8318, :8823, :9002`; "LEAD-001" `:5377, :5718, :5878, :6848`; "COMP-001" `:706, :879`) al componente que corrigen; sustituir los 9 hex del bloque de movimiento (`:9079-9124`) por `color-mix()` sobre tokens; revisar los 47 `!important`. Luego según transferencia.md §4: `base.css` (tokens, reset, tipografía, botones, formularios, layout, header y mega menú, footer, localización, anuncio, tarjeta; ≤ 100 KB crudos), `motion-atelier.css`, `motion-technical.css`, `motion-heritage.css` (solo el elegido, sin preload), `section-product.css`, `section-cart-drawer.css`, `section-collection.css`, una hoja por sección de home, `section-content.css`, `predictive-search.css`, cada una con `{{ 'x.css' | asset_url | stylesheet_tag }}` en su sección. Capturas de referencia antes y después con `scripts/capture-presets.mjs` en 3 presets x 16 plantillas x 2 anchos, comparadas píxel a píxel con tolerancia declarada |
| Qué NO entra | JS. Secciones nuevas. `{% stylesheet %}` para CSS de componente |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-8B-001`). Implementa Claude, un subagente por hoja. Audita GPT (`GPT-AUDIT-027-css-split`: revisión visual de las 96 capturas y de los 3 estilos de movimiento). Verifica Gemini con diff de capturas. Commitea y despliega Gemini |
| Dependencias | 8A integrado y certificado (el mapa de "qué sección es dueña de qué" es el mismo). Nunca junto con 8A |
| Ledger | Crea `P-12` "CSS crítico ≤ 25 KB gz; hojas por sección; `AssetSizeCSS` sin ofensas en `theme-check:all`" (Official Requirements: Performance; sección 2), `código completo` hasta Lighthouse. Re-mide `P-10` |
| Compuertas y cierre | `gates:static` 10/10; `theme-check:all` 0 ofensas de tamaño (primera vez que se puede afirmar frente a Contour); 0 diferencias visuales fuera de tolerancia o cada una justificada en el informe; `rg -c "!important" assets/*.css` menor que 47; 0 hex fuera de tokens en `motion-*.css` |
| Riesgo | Alto: la cascada por orden cambia. Mitigación: por componente, con capturas, y un commit por hoja para poder revertir una sola |
| Esfuerzo | 7 a 9 días |
| Nivel de parche | Nivel 2 (archivos nuevos), autorizado |
| Versión | 1.3.0 |

### Sprint 9A: quick view con Section Rendering y `<dialog>`

| Campo | Contenido |
|---|---|
| Objetivo | Cerrar uno de los 4 NO de la comparativa con el patrón de Contour y los mecanismos de Sartorial |
| Alcance | `sections/quick-view.liquid` (sin presets, sin `enabled_on`): galería reducida de 4 medias con `loading="lazy"` salvo la primera, vendor, título, `price`, `<variant-selects data-section-id="quick-view">` con el markup de `main-product`, cantidad, botón, `payment_button`, enlace a la ficha. `snippets/quick-view-dialog.liquid` renderizado una vez en `layout/theme.liquid` si `settings.quick_view`: `<quick-view-dialog>` con `<dialog class="quick-view">`, cierre de 44 px, región `aria-busy`, `<p role="status">`. `assets/quick-view.js`: `QuickViewDialog extends ThemeElement`, clic delegado en `[data-quick-view]`, `fetch(url + '?section_id=quick-view')` con `AbortController`, `showModal()`, foco al título, `Shopify.PaymentButton.init()`, cierre sin devolver foco al añadir (el cajón lo toma); registro en `DIALOGS_WITH_CLOSE` y `syncDialogScrollLocks`. `assets/quick-view.css` propia. `snippets/product-card.liquid`: modo `options` pinta "Quick view" con `data-quick-view` y conserva el enlace como fallback sin JS; modo `picker` se mantiene. `VariantSelects`: aceptar `data-section-id` distinto del de la ficha y `data-url` del producto; `sticky-cart-bar` y `product-inventory` filtran eventos por sección. Setting `quick_view` en `settings_schema.json` (default `true` en Sartorial e Imprint, `false` en Archive) y 3 claves de locale |
| Qué NO entra | Descripción larga, zoom ni 3D dentro del quick view. Cambios al picker de talla |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-9A-001`) tras dictamen de GPT sobre el contrato de UX (`GPT-TASK-028-quick-view-ux`: qué muestra, qué no, comportamiento al añadir). Implementa Claude. Audita GPT (`GPT-AUDIT-028-quick-view`: 5 estados degenerados, 40 variantes, producto sin imagen, selling plan, lector de pantalla). Verifica Gemini. Commitea y despliega Gemini |
| Dependencias | 8A (patrón de módulo), 8B (hoja propia). 7C (`motionAllowed`) |
| Ledger | Crea `C-27` "Quick view accesible con Section Rendering y `<dialog>` nativo" (benchmark de tier, docs/top-theme-benchmark.md; sección 4), `código completo` hasta Gate 5 móvil |
| Compuertas y cierre | `gates:static` 10/10; `gates:hooks` con los nuevos `data-quick-view`; en tema-qkqpke0j: abrir, cambiar variante, añadir, cerrar con Escape, con teclado y con lector; sin JS el botón lleva a la ficha; `gates:budget` solo suma `quick-view.js` en páginas con tarjetas |
| Riesgo | Medio: doble `<variant-selects>` en página y eventos globales de variante. Mitigación: filtrar por `section_id` y probar en la ficha con quick view abierto desde recomendaciones |
| Esfuerzo | 4 a 5 días |
| Nivel de parche | Nivel 2 (setting global nuevo, `settings_data.json` de los 3 presets), autorizado |
| Versión | 1.4.0 |

### Sprint 9B: popup de newsletter y lista de espera por talla

| Campo | Contenido |
|---|---|
| Objetivo | Dos diálogos nuevos sobre el mismo patrón: captación y recuperación de demanda por talla |
| Alcance | 9B-T1 `sections/overlay-group.json` (tipo `aside`) renderizado al final de `layout/theme.liquid` con `{% sections 'overlay-group' %}`; `sections/newsletter-popup.liquid` con `<newsletter-popup>` y `<dialog>`, imagen 4:5 lazy, eyebrow, título, texto, `form 'customer'` con label y `aria-live`, `<copy-text>` para el código, cierre de 44 px, "No, thanks"; settings `delay` (default 8, mínimo 3), `days_hidden` (30), `show_on_mobile`, `position`, `discount_code`, imagen, textos, `color_scheme`; `assets/newsletter-popup.js` (`showModal()` tras el retraso, nunca si hay otro diálogo abierto, nunca en password, cart ni políticas, `localStorage` de cierre y suscripción, `shopify:section:select` en el editor, apertura inmediata tras `form.posted_successfully?`); `assets/newsletter-popup.css`. 9B-T2 bloque `waitlist` en `main-product` y `featured-product` visible cuando la variante seleccionada está agotada; `<back-in-stock>` en `assets/back-in-stock.js` que abre un `<dialog>` con email, consentimiento y la talla escrita, envía `form 'contact'` con tags `waitlist`, handle y `variant_id`; `info` en el setting explicando que un flujo o app recoge el tag; `assets/back-in-stock.css`. Todo con `t:` y con `ThemeCore.motionAllowed()` para la animación de entrada |
| Qué NO entra | Integración con apps concretas de email. Popups de salida (exit intent). Countdown |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-9B-001`) con dictamen previo de GPT sobre copy y reglas de aparición (`GPT-TASK-029-overlays-ux`). Implementa Claude (2 subagentes). Audita GPT (`GPT-AUDIT-029-overlays`: no tapa el LCP, aparece después del retraso, cierre accesible, no reaparece, el formulario de lista de espera llega al admin como contacto etiquetado). Verifica Gemini. Commitea y despliega Gemini |
| Dependencias | 8A, 8B, 9A (reutiliza el registro de diálogos y la hoja de patrón de diálogo) |
| Ledger | Crea `C-28` "Popup de newsletter accesible con retraso, supresión por días y código copiable" (benchmark de tier; sección 4) y `C-29` "Lista de espera por talla vía formulario de contacto etiquetado" (benchmark de tier; sección 4), ambas `código completo` hasta Gate 5 |
| Compuertas y cierre | `gates:static` 10/10; Lighthouse de la home con el popup activo no baja más de 2 puntos respecto a 1.3.0; axe con el popup abierto; prueba de envío real de lista de espera en tema-qkqpke0j con captura del contacto en Admin |
| Riesgo | Bajo-medio: un popup antes del LCP o sin cierre accesible es hallazgo típico de revisión; el retraso mínimo de 3 s y el default apagado en `overlay-group` lo mitigan |
| Esfuerzo | 3 a 4 días |
| Nivel de parche | Nivel 2 (grupo de secciones nuevo, bloque nuevo en ficha), autorizado |
| Versión | 1.5.0 |

### Sprint 9C: prensa y voces, comparador de ajuste y tejido, video de campaña

| Campo | Contenido |
|---|---|
| Objetivo | Tres secciones de contenido sin JS nuevo (salvo la fachada de video) que cubren testimonios, comparador y video de campaña |
| Alcance | `sections/press-quotes.liquid` (bloques `quote` y `press_logo`, 3 columnas, `scroll-snap` en móvil, tipografía heredada de `brand-manifesto`, 0 JS, hoja propia). `sections/fit-comparison.liquid` (filas definidas en la sección, respuestas por bloque de producto, 2 a 4 productos, `<table>` con `scope`, región desplazable enfocable, primera columna fija, 0 JS, hoja propia). `sections/campaign-video.liquid` (póster con botón de 44 px, carga el iframe de YouTube/Vimeo o el `<video>` al pulsar, título y texto opcionales, `assets/campaign-video.js` mínimo, hoja propia). Presets en las 3, `enabled_on` acotado, locales en/es, 5 estados degenerados |
| Qué NO entra | Carrusel con autoplay. Deslizador antes/después. Secciones exclusivas por preset (10A) |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-9C-001`) tras `GPT-TASK-030-content-sections-brief` (qué filas de comparación importan en moda, tono de prensa). Implementa Claude (3 subagentes). Audita GPT (`GPT-AUDIT-030-content-sections`). Verifica Gemini. Commitea y despliega Gemini |
| Dependencias | 8B (nacen con hoja propia). Puede correr en paralelo con 9B si se reparte `layout/theme.liquid` (9C no lo toca) |
| Ledger | Crea `C-30` "Testimonios y prensa por bloques sin movimiento no solicitado" (WCAG 2.2.2 / benchmark; sección 4), `C-31` "Comparador de ajuste y tejido en tabla accesible" (benchmark; sección 4), `C-32` "Fachada de video que no carga nada hasta pulsar" (Performance; sección 2). `código completo` hasta Gate 5 |
| Compuertas y cierre | `gates:static` 10/10; 0 peticiones a youtube.com o vimeo.com antes del clic (panel de red); tabla navegable con teclado y lector a 390 px |
| Riesgo | Bajo |
| Esfuerzo | 4 días |
| Nivel de parche | Nivel 2 (secciones nuevas), autorizado |
| Versión | 1.6.0 |

### Sprint 10A: secciones exclusivas por preset y bloques de ficha por metafields

| Campo | Contenido |
|---|---|
| Objetivo | Que cada preset tenga 2 secciones de su nicho dentro de la moda y que la ficha lea datos reales |
| Alcance | Sartorial: `sections/atelier-process.liquid` (pasos con número, título, texto, imagen, duración; sin JS) y `sections/fabric-library.liquid` (muestras con `<theme-disclosure>`); bloque `fabric_specs` en `main-product` que lee `custom.composition`, `custom.weight`, `custom.origin` y sustituye a `technical_specs`. Imprint: `sections/drop-calendar.liquid` (fecha, estado próximo/disponible/agotado, producto o colección; usa `waitlist` de 9B en "próximo"; sin reloj) y `sections/look-index.liquid` (índice numerado que revela imagen con `:focus-within` y `<theme-disclosure>` en móvil; 0 JS). Archive: `sections/provenance-ledger.liquid` (tabla editorial desde metafields, región desplazable) y `sections/condition-guide.liquid` (`<details>` nativos); el bloque `provenance` de la ficha enlaza la guía. Cada sección con presets, `enabled_on`, hoja propia, `t:`, `info` en settings con metafields, fallback visible sin metafields, 5 estados degenerados. Johandry crea los metafields y sus valores en las 3 demos |
| Qué NO entra | Cambios de layout global de presets (10C). Theme blocks (10B). Secciones fuera de la moda |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-10A-001`) tras `GPT-TASK-031-preset-sections-brief` (GPT define el contenido de demo y valida que cada sección responde a una pregunta real del comprador de su preset). Implementa Claude (6 subagentes, uno por sección, más uno para `fabric_specs`). Audita GPT (`GPT-AUDIT-031-preset-sections` en las 3 demos). Verifica Gemini. Commitea y despliega Gemini |
| Dependencias | 8B, 9B (waitlist), 9C (patrón de tabla). 7A (ya sin inferencias) |
| Ledger | Crea `L-12` "Cada preset tiene al menos 2 secciones propias de su vertical" (Official Requirements: Presets diferenciados / listado por preset; sección 6), `código completo` hasta ver las 3 demos. Cierra `C-24` en `cumplido` al retirar `technical_specs` y la provenance inferida |
| Compuertas y cierre | `gates:static` 10/10; `gates:locales` con unas 150 claves de schema nuevas en paridad en/es; cada sección en su demo con contenido real y en una tienda vacía con su estado vacío; ningún `shopify://` |
| Riesgo | Medio: superficie de schema y locales. 6 secciones son 6 fuentes de estados degenerados |
| Esfuerzo | 7 a 9 días de Claude, 2 de Johandry en metafields y contenido |
| Nivel de parche | Nivel 2 (secciones y bloques nuevos, retiro de `technical_specs`), autorizado |
| Versión | 1.7.0 |

### Sprint 10B: theme blocks donde aportan

| Campo | Contenido |
|---|---|
| Objetivo | Theme blocks reales, no nominales: 5 bloques genéricos aceptados por las secciones nuevas y por `bento-discovery` |
| Alcance | `blocks/heading.liquid`, `blocks/text.liquid`, `blocks/button.liquid`, `blocks/image.liquid`, `blocks/spacer.liquid` con schema y `t:`; `{"type": "@theme"}` en `press-quotes`, `atelier-process`, `drop-calendar`, `fabric-library`, `look-index`, `condition-guide` y `bento-discovery` con `content_for 'blocks'`; comprobar `shopify:block:select` en `mega-menu` y `announcement-bar`. Locales en/es. CSS de bloques en `base.css` (son transversales) con tokens |
| Qué NO entra | Retrofit de las 19 secciones existentes con 63 tipos de bloque. `@theme` en header, footer o ficha |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-10B-001`). Implementa Claude (1 subagente por bloque y 1 por integración). Audita GPT (`GPT-AUDIT-032-theme-blocks`: experiencia del comerciante al anidar en el editor). Verifica Gemini. Commitea y despliega Gemini |
| Dependencias | 10A |
| Ledger | Crea `A-08` "Theme blocks (`blocks/`) aceptados por secciones de contenido" (Official Requirements: Theme architecture / dirección Horizon; sección 1), `código completo` hasta probar en el editor |
| Compuertas y cierre | `gates:static` 10/10; en el editor añadir, reordenar y borrar bloques anidados en las 7 secciones sin errores de consola; preview de las 16 plantillas (PF-03) |
| Riesgo | Medio: cambia el flujo de eventos del editor |
| Esfuerzo | 3 a 4 días |
| Nivel de parche | Nivel 2 (carpeta nueva), autorizado |
| Versión | 1.8.0 (junto con 10C) |

### Sprint 10C: presets con layout propio, plantillas de listado, demos y kit de listado

| Campo | Contenido |
|---|---|
| Objetivo | Que las tres fichas de la Theme Store dejen de ser "el mismo tema en tres colores" y que el material del formulario esté versionado |
| Alcance | 10C-T1 `config/settings_data.json`: `page_width` 1300/1480/1180, `page_gutter` 24/16/32, `section_spacing` 80/48/64, `body_scale` 100/95/105, `heading_scale` 105/100/115, `button_radius` 0/0/2, par tipográfico distinto por preset elegido de la biblioteca de Shopify y verificado con contraste (nuevo setting `border_weight` 1/2 px si Gemini lo autoriza), `quick_view` on/on/off, dentro de los pasos de `range` (gate de 7B). 10C-T2 `listings/<preset>/templates/` con `index.json` que incluya las secciones exclusivas de 10A, `page.about.json` por preset, `collection.json` y `product.json` revisados; estado de instalación igual a la demo. 10C-T3 `listings/<preset>/listing.json` con `name`, `tagline` (≤ 70, revisar Imprint), `description`, `demo_store_url`, `industry`, `catalog_size`, `features`, `highlights` (3 x 30/140), `documentation_url`, `support_url`; nunca la contraseña. 10C-T4 capturas con `scripts/capture-presets.mjs`: `preview-desktop.png` 2000x2496, `preview-mobile.png` 750x1334, `highlight-{1,2,3}.png` 1600x1200, cada una menor que 1 MB; validadas por el gate de 7B. 10C-T5 Johandry actualiza las 3 demos (secciones nuevas, metafields, imágenes propias) y Gemini despliega |
| Qué NO entra | Un cuarto preset. Cambios de paleta (ya decididos) |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-10C-001`) tras `GPT-TASK-033-listing-copy` (GPT escribe taglines, descripciones y highlights en inglés US, sentence case). Implementa Claude (settings, listings, capturas). Audita GPT (`GPT-AUDIT-033-presets-and-listing`: compara las 3 demos como compraría un comerciante). Verifica Gemini con diff instalación/demo. Commitea y despliega Gemini |
| Dependencias | 10A, 10B. Las capturas se hacen sobre las demos finales |
| Ledger | Modifica "Presets Diferenciados (1 a 4)" para citar layout y secciones propias. Crea `L-13` "Kit de listado versionado por preset: `listing.json` validado y capturas con dimensiones exactas" (Theme Store listing page; sección 6), `cumplido` con el gate. Crea `L-14` "Estado de instalación igual a la demo, verificado por diff" (Official Requirements §20; sección 6), `cumplido` |
| Compuertas y cierre | `gates:static` 10/10 (incluye validación de listing y PNG); diff `listings/<preset>/templates` contra `shopify theme pull` de cada demo = solo imágenes; PF-05 completo |
| Riesgo | Medio-bajo: cambiar `page_width` y fuentes en Imprint y Archive mueve todo el layout; capturas de regresión como en 8B |
| Esfuerzo | 3 a 4 días de Claude, 2 a 3 de Johandry en contenido |
| Nivel de parche | Nivel 2 (presets y settings), autorizado por Johandry |
| Versión | 1.8.0 |

### Sprint 11A: internacionalización (es.schema, fr, de, it)

| Campo | Contenido |
|---|---|
| Objetivo | Igualar la cobertura de Contour con herramientas propias, sobre un inventario de claves congelado |
| Alcance | 11A-T1 consolidar las 62 etiquetas repetidas en `sections.all` de `locales/en.default.schema.json` (unas 20 a 30 secciones tocadas en `label`). 11A-T2 `scripts/locale-scaffold.mjs`: genera `locales/<lang>.json` y `<lang>.schema.json` con todas las claves de `en.default` y valor `null`; el gate falla mientras quede un `null`. 11A-T3 `locales/es.schema.json` primero (el equipo lo revisa), luego `fr`, `de`, `it` en storefront y schema; pluralización `one`/`other` y variables `{{ count }}` validadas; revisión lingüística nativa externa antes de cerrar. 11A-T4 `date_formats` por idioma. 11A-T5 `README.md` y listado: "5 languages" |
| Qué NO entra | Traducción de la documentación del tema. Idiomas más allá de los 5 |
| Dueños | Emite Gemini (`CLAUDE-DIRECTIVE-11A-001`). Implementa Claude (1 subagente por idioma y archivo; traducciones con glosario común). Audita GPT (`GPT-AUDIT-034-i18n`: tono de comerciante en el editor en es, muestreo de fr/de/it). Verifica Gemini con el gate y con un revisor nativo contratado por Johandry. Commitea y despliega Gemini (y Johandry publica los idiomas en las demos) |
| Dependencias | 10A, 10B, 10C (inventario de claves congelado). Es el último sprint de tema antes del siguiente envío |
| Ledger | Crea `L-15` "Storefront y schema en 5 idiomas con paridad verificada por gate" (Theme Store listing: idiomas; sección 6), `código completo` hasta la revisión nativa |
| Compuertas y cierre | `gates:locales` con paridad de 10 archivos, 0 `null`, 0 cadenas idénticas al inglés fuera de lista blanca; editor de temas en español sin cadenas en inglés (captura); revisión nativa firmada para fr, de, it |
| Riesgo | Medio: calidad en idiomas que el equipo no habla. Mitigación: scaffold, glosario, revisión externa |
| Esfuerzo | 4 a 5 días de herramientas y traducción, más la revisión externa |
| Nivel de parche | Nivel 1 en código, Nivel 2 documental (archivos nuevos en `locales/`), autorizado |
| Versión | 1.9.0 |

### Sprint PREFLIGHT-002: preflight de actualización

Misma lista y mismo script que PREFLIGHT-001, ejecutados antes de cada actualización que se envíe a la Theme Store (recomendado agrupar: 1.3.0 tras los monolitos, 1.6.0 tras funciones, 1.9.0 tras presets e idiomas). Emite Gemini con `CLAUDE-DIRECTIVE-PREFLIGHT-00n` y `GPT-TASK-0nn`; firma GPT; GO/NO-GO en BOARD. Esfuerzo 2 días por ejecución. Sin versión propia.

---

## 4. Paralelismo

Qué puede correr a la vez sin chocar (la condición siempre es una lista cerrada de archivos por directiva y que Gemini integre):

| Ventana | En paralelo | Condición |
|---|---|---|
| Semana 1 | Fase 0 (Johandry, Gemini) + redacción de directivas 7A y 7B (Gemini) | Ninguna línea de código hasta F0-01 |
| Semanas 1 a 2 | 7A (snippets, templates, scripts gate5) y 7B (raíz, scripts de gates, layout, CI, movimientos a `tools/`, evidencias a `sartorial-evidence`) | Cruce en `RELEASE-NOTES.md`, `theme_version` y `.gitignore`: lo integra Gemini en el orden 7A, 7B. Al cerrar 7B, ventana de reescritura del historial (F0-02, medio día, Gemini) y reclonado de los 4 entornos |
| Semana 2 | Tras el reclonado: 7C (secciones con `@app`, `theme.js` inert y motionAllowed, breadcrumbs) y redacción de `docs/theme-store-preflight.md` + `scripts/preflight.mjs` (PF-T1 y PF-T2) | PF-T3 (recertificación) espera a que 7C esté desplegado |
| Semana 3 | Ejecución de PREFLIGHT-001 (GPT, Gemini, Johandry) y redacción de la directiva 8A (Gemini) | Claude no abre 8A hasta el GO/NO-GO, porque un NO-GO por función abre un hotfix 7D que toca los mismos archivos |
| Semanas 4 a 5 | 8A (Claude) y GPT-TASK-028/029/030 (briefs de UX de quick view, overlays y contenido) | GPT no toca código |
| Semanas 6 a 7 | 8B (Claude) y revisión de 8A (GPT, Gemini), pero 8B solo empieza con 8A integrado | Nunca 8A y 8B abiertos a la vez |
| Semana 8 | 9A y 9C | 9A toca `layout/theme.liquid`, `product-card`, `theme.js` núcleo; 9C no toca ninguno de esos |
| Semana 9 | 9B y GPT-TASK-031 (brief de secciones por preset) | 9B toca `layout/theme.liquid` (overlay-group): esperar a que 9A esté integrado |
| Semanas 10 a 11 | 10A (Claude) y contenido de demos y metafields (Johandry) | Johandry trabaja en Admin, no en el repo |
| Semana 12 | 10B y 10C-T3/T4 (listing.json y capturas provisionales) | Las capturas finales esperan a 10C-T1 y a las demos |
| Semana 13 | 11A y PREFLIGHT-002 de 1.8.0 | 11A solo toca `locales/` y labels |

Reparto de subagentes del lado de Claude, un subagente por tarea con lista de archivos propia, planificación antes de lanzar, informe leído por el coordinador (no los archivos), e integración por el coordinador:

| Sprint | Subagentes | Modelo sugerido |
|---|---|---|
| 7A | T1 scripts; T2 gitignore y limpieza; T3 borrado de plantillas, secciones, claves y CSS; T4 specs y provenance; T5 preset; T6 versión y notas | Opus 5.5 para ediciones; Haiku 4.5 para el inventario de claves a borrar |
| 7B | uno por archivo raíz (gitattributes y shopifyignore juntos; README; DEVELOPMENT; LICENSE); uno para layout; uno por gate nuevo (json-validate, locale-key-inventory, secrets-scan, ledger-verify, package-theme, repo-weight); uno para CI; uno para movimientos (T10); uno para exportación de evidencias (T11); uno para scripts de despliegue (T12) | Opus 5.5; Fable 5.1 revisa el diseño de los gates y de `package-theme.mjs` antes de implementar |
| 7C | T1 `@app` (uno por sección, 7); T2 breadcrumbs; T3 ThemeCore | Opus 5.5; Fable 5.1 para T3 por tocar el núcleo |
| PREFLIGHT | lista (Haiku 4.5 investiga la página pública y los requisitos vigentes); script (Opus 5.5); recertificación (uno por fila) | mixto |
| 8A | uno por módulo (15) tras un subagente de arquitectura que fija el núcleo, el orden y el inventario de custom elements; uno para `featured-product`; uno para `js-budget` | Fable 5.1 arquitectura y revisión final; Opus 5.5 módulos |
| 8B | uno de arquitectura (mapa de propiedad de reglas y parches tardíos); uno por hoja (12); uno para capturas y diff | Fable 5.1 arquitectura; Opus 5.5 hojas |
| 9A | sección y snippet; módulo JS; `VariantSelects` y filtros por sección; tarjeta y setting | Fable 5.1 para `VariantSelects`; Opus 5.5 resto |
| 9B | popup; lista de espera | Opus 5.5 |
| 9C | uno por sección (3) | Opus 5.5 |
| 10A | uno por sección (6); uno para `fabric_specs` | Opus 5.5; Fable 5.1 revisa schemas y estados degenerados |
| 10B | uno por bloque (5); uno para integración `@theme` | Opus 5.5 |
| 10C | settings de presets; listings templates; listing.json; capturas | Opus 5.5 |
| 11A | consolidación `sections.all`; scaffold; uno por idioma y archivo (8) | Opus 5.5; Haiku 4.5 para glosario |

---

## 5. Calendario estimado y ruta crítica

Días hábiles de trabajo efectivo de Claude; las auditorías de GPT y Gemini añaden 1 a 2 días por sprint, en parte solapados con el sprint siguiente.

| Bloque | Sprints | Días de Claude | Días de calendario acumulados | Versión al cierre |
|---|---|---|---|---|
| Fase 0 | decisiones | 0 (Johandry y Gemini, 2 días) | 2 | 1.0.0 |
| Saneamiento | 7A + 7B en paralelo, reescritura del historial (Gemini), luego 7C | 3 + 4 (paralelo) + 0,5 (Gemini) + 3 | 10 a 11 | 1.1.0 |
| Preflight y envío | PREFLIGHT-001 + envío de Johandry | 3 a 4 | 13 a 15 | 1.1.0 enviada |
| Monolitos | 8A, 8B | 8 + 8 | 30 a 33 | 1.3.0 |
| Funciones de tier | 9A, 9B, 9C | 5 + 3 + 4 (9A y 9C solapan) | 39 a 42 | 1.6.0 |
| Presets | 10A, 10B, 10C | 8 + 4 + 4 | 53 a 57 | 1.8.0 |
| Idiomas y preflight | 11A, PREFLIGHT-002 | 5 + 2 (+ revisión externa) | 60 a 64 | 1.9.0 |

Ruta crítica hasta el envío: F0-01 (rotación) y F0-03/F0-09/F0-10 (decisiones de alcance) → 7A → 7B (los gates nuevos y `npm run theme:package` son parte del preflight; 3 a 4 días de Claude) → reescritura del historial (F0-02, medio día de Gemini) y reclonado → 7C → despliegue a 6 temas → PREFLIGHT-001 → GO → envío. Unos 13 a 15 días hábiles si PF-06 da ≥ 70 en móvil. Si PF-06 da menos de 60 en cualquiera de los 9 casos, se inserta 8A (8 días) y un segundo preflight de 2 días: unos 23 a 25 días.

Qué bloquea el envío frente a qué justifica el tier:

| Bloquea el envío | Justifica el tier (actualizaciones después del envío) |
|---|---|
| F0-01, F0-03, F0-08, F0-09, F0-10, F0-12 | F0-02 y F0-11 (higiene y peso del repo; F0-02 va entre 7B y 7C pero no condiciona el ZIP) |
| 7A completo | 7C (pero es barato y mejora la primera impresión del revisor: se incluye) |
| 7B: `npm run theme:package` con lista blanca (T2b), `.shopifyignore`, notas de versión, LICENSE, gates de `shopify://` y `range`, `gates:secrets` | 7B: README y DEVELOPMENT (higiene, no requisito); T10 a T12 (estructura, evidencias, despliegue reproducible) |
| PREFLIGHT-001 completo con PF-06 ≥ 60 | 8A y 8B si PF-06 ya supera 60 |
| Demos sin contraseña o con contraseña entregada en el formulario, pasarela de prueba, nombres de tienda sin marca ajena | 9A, 9B, 9C, 10A, 10B, 10C (10C-T3/T4 sí: material del formulario), 11A |

Recomendación: enviar 1.1.0 en cuanto PREFLIGHT-001 dé GO, porque la cola de revisión de la Theme Store se mide en semanas y las mejoras de tier se pueden ir sumando como versiones durante la revisión y después de la aprobación. Una excepción: si Johandry prefiere que la primera impresión del revisor ya incluya quick view y popup, la ruta pasa a 8A → 9A → 9B → preflight → envío, unos 31 a 32 días.

---

## 6. Cambios propuestos a compuertas y a la plantilla de directiva

Gates nuevos o ampliados (todos sin dependencias, en `scripts/`, sumados a `gates:static` y a CI):

| Gate | Script | Qué comprueba | Sprint |
|---|---|---|---|
| `gates:secrets` | `scripts/secrets-scan.mjs` | Ningún `process.env.X \|\| '<literal>'`, cookie `_shopify_*`, `shpat_`, `shpca_`, ni cabecera `Cookie:` en archivos versionados; falla cerrado | 7B |
| `gates:json` ampliado | `scripts/json-validate.mjs` | JSON válido; 0 `shopify://` en `templates/` y `listings/`; valores numéricos dentro de `min + n * step`; `listing.json` completo y límites de caracteres; PNG con dimensiones exactas y < 1 MB; ninguna plantilla con más de 25 secciones | 7B, 10C |
| `gates:locales` ampliado | `scripts/locale-key-inventory.mjs` | Paridad estructural de todo `locales/*.json` con `en.default`; 0 `null`; cadenas idénticas al inglés fuera de lista blanca; pluralización y variables | 7B, 11A |
| `gates:syntax` | `package.json` | `node --check` sobre glob `assets/*.js` | 7B |
| `gates:ledger` ampliado | `scripts/ledger-verify.mjs` | Columna `ID` única y con prefijo de sección; filas nuevas con dueño y sprint | 7B |
| `gates:package` ampliado | `scripts/package-theme.mjs --verify` (`npm run theme:package` genera el ZIP) | Staging en `os.tmpdir()` con lista blanca; el ZIP contiene solo carpetas del tema y `listings/*/templates`; presentes `layout/theme.liquid`, `settings_schema.json` y `settings_data.json`; menos de 50 MB; `dist/Sartorial-<theme_version>.zip` | 7B |
| `gates:weight` | `scripts/repo-weight.mjs` | Sobre `git ls-files`: ningún PNG, JPG, PDF, HAR ni ZIP fuera de `assets/` y `listings/`; ningún JSON de más de 300 KB fuera del tema; ningún archivo de más de 1 MB fuera de `assets/`; árbol menor de 40 MB | 7B |
| `gates:budget` (solo informa) | `scripts/js-budget.mjs` | KB gz de JS y CSS por plantilla a partir de los assets referenciados; umbrales por plantilla se vuelven bloqueantes a partir de 8B | 8A, 8B |
| `gates:preflight` | `scripts/preflight.mjs` | Lo automatizable de la lista PF-01 a PF-16 y un reporte con los manuales en blanco | PREFLIGHT-001 |
| Gate 5 ampliada | arneses existentes + `docs/theme-store-preflight.md` | Lighthouse móvil y escritorio en demo real con 3 corridas y mediana; axe con estados ocultos; preview de 16 plantillas tras cambios de schema | PREFLIGHT-001 |

Plantilla de directiva (sartorial-flujo.md §3): se mantienen los 4 encabezados y el bloque de cabecera; se añaden campos, no secciones nuevas.

| Dónde | Qué se añade | Por qué |
|---|---|---|
| Cabecera | `Autorización de alcance: Johandry, <fecha>` separada de `Autorización Nivel 2: Gemini` | F0-04 |
| Cabecera | `Versión resultante:` y `Entrada de RELEASE-NOTES:` | F0-05 |
| Cabecera | `Filas del ledger (IDs): crea ... / cierra ... / modifica ...` | F0-07 |
| §2 por tarea | `Archivos permitidos (lista cerrada):` y `Archivos prohibidos en este sprint:` | Paralelismo sin colisiones |
| §2 | `Subagentes sugeridos:` una línea por tarea | Sección 4 |
| §3 | `Gates obligatorios:` lista explícita (static 10/10, budget, preflight si aplica) y `Gate 5:` qué se mide, dónde y con qué arnés | Evitar "código completo" eterno |
| §4 | `Dueños: emite / implementa / audita / verifica / commitea y despliega` | RULES §4.7 |
| §4 | `Rutas: informe, dictamen de GPT, review de Gemini, carpeta de arnés` con nombres exactos | Trazabilidad (hoy faltan dictámenes para 4 entregas) |
| Rutas en la directiva | Siempre relativas al repo, nunca `file:///c:/Users/...` | Discrepancia 12 de sartorial-flujo.md |

---

## 7. Riesgos del plan y mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| La Fase 0 se demora y el equipo empieza código "mientras tanto" | Alta | Rehacer 7A | Regla escrita en BOARD: ninguna directiva 7x se emite sin F0-01 a F0-04 cerradas en `docs/decisions.md` |
| Lighthouse móvil < 60 en PREFLIGHT-001 | Media | +10 días antes del envío | La regla 70/60 de PREFLIGHT-001; medir ya en 7C una corrida de referencia para no descubrirlo al final |
| Regresión de cascada en 8B que nadie atribuye | Media | Semanas de parches tardíos nuevos | Un commit por hoja, capturas antes y después, nunca junto con 8A, prohibido añadir bloques "AUDITORIA" al final de `base.css` |
| Partición de JS rompe el editor de temas (sección añadida por `innerHTML`) | Media | Rechazo o experiencia rota del comerciante | Cargar todos los módulos con `defer` en `design_mode`; prueba obligatoria de "añadir sección en vivo" en PF-03 |
| Dos agentes editan `layout/theme.liquid` o `theme.js` a la vez | Media | Conflictos y pérdida de cambios | Listas cerradas de archivos por directiva; 9A antes que 9B; Gemini integra |
| Traducciones de mala calidad en fr, de, it | Media | Devoluciones del tema | Scaffold con `null`, glosario, revisión nativa pagada antes de cerrar `L-15` |
| Metafields que no existen en la tienda del comerciante | Alta | Secciones vacías | Fallback visible, `info` en el setting, estado vacío diseñado y probado en tienda limpia |
| Los dictámenes adversariales se saltan por prisa (ya pasó con 4 entregas) | Alta | Certificaciones sobre código que ya no existe | El gate `gates:ledger` exige, para cada fila que pasa a `cumplido`, una ruta de review existente en `agent-comms/reviews/` |
| Contraseña nueva vuelve a filtrarse en un arnés | Media | Repetir F0-01 | `gates:secrets` en CI y en pre-commit |
| Historial reescrito (F0-02 b, recomendada) rompe clones de los 4 agentes o la integración de GitHub | Media | Un día perdido | Ventana entre 7B y 7C, `git clone --mirror` previo fuera de OneDrive, aviso en BOARD, todos hacen push y paran, reclonado obligatorio (no `pull`), integración desconectada antes y reconectada después, fecha y sha nuevo en `docs/decisions.md` |
| "Imprint" o "Edition" colisiona con un tema publicado | Baja | Renombrar en plena revisión | PF-01 con captura y fecha antes de 7A-T5 |
| El revisor pide una app (como Judge.me en Contour) o encuentra texto de desarrollador | Baja tras 7A | Rechazo | PF-05 y PF-09; `rg -n "install .* app"` sobre `sections/` |

---

## 8. Decisiones pendientes para Johandry y Gemini

| # | Decisión | Decisor | Plazo | Bloquea |
|---|---|---|---|---|
| D1 | F0-01 rotar la contraseña y exportar `STOREFRONT_PASSWORD` | Johandry | Antes de cualquier directiva | Todo |
| D2 | F0-03 Imprint o Edition | Johandry | Antes de 7A | 7A-T5, ledger, listado |
| D3 | F0-04 regla única de Nivel 2 y publicación de RULES.md 1.1 | Johandry decide, Gemini redacta | Antes de 7A | Toda directiva |
| D4 | F0-09 borrar `page.documentation` y `page.support` | Johandry | Antes de 7A | 7A-T3 |
| D5 | F0-10 metafields oficiales de la ficha (`custom.material`, `custom.gsm`, `custom.hardware`, `custom.provenance_year`, y en 10A `custom.composition`, `custom.weight`, `custom.origin`) | Johandry con Gemini | Antes de 7A | 7A-T4, 10A |
| D6 | F0-05 versionado por sprint (1.0.1, 1.0.2, 1.1.0...) | Gemini propone, Johandry ratifica | Antes de 7A | RELEASE-NOTES |
| D7 | F0-06 entradas retroactivas en `docs/decisions.md` y cierre de DP-001 y DP-002 | Gemini | Durante 7B | DEVELOPMENT.md |
| D8 | F0-07 esquema de IDs del ledger | Gemini | Durante 7B | Filas nuevas |
| D9 | F0-08 quitar el `mailto` y declarar 2 días hábiles en `sartorial-docs` | Johandry | Antes de PREFLIGHT-001 | PF-02 |
| D10 | F0-02 reescribir el historial con `git filter-repo` (D3 de `claude/estructura-repo.md`). Recomendación: sí, una vez, entre 7B y 7C (`.git` de 218 MB a unos 6 a 10 MB y fuera las cookies de ff3dca1 y 080402c); exige F0-01 hecha antes y reclonar después | Johandry decide, Gemini ejecuta | Antes de cerrar 7B | Ventana entre 7B y 7C; P0 de BOARD §4.5; publicar el repo |
| D11 | Ruta de envío: 1.1.0 tras preflight (recomendada) o esperar a quick view y popup | Johandry | Al cerrar PREFLIGHT-001 | Calendario |
| D12 | Umbral de Lighthouse para enviar sin 8A (propuesta: mediana móvil ≥ 70 en 9 casos) | Johandry con Gemini | Antes de PREFLIGHT-001 | GO/NO-GO |
| D13 | Autorizar `border_weight` como setting nuevo de Archive | Gemini | Antes de 10C | 10C-T1 |
| D14 | Contratar revisión nativa fr, de, it | Johandry | Antes de 11A | `L-15` |
| D15 | Demos sin contraseña para el revisor o contraseña en el formulario | Johandry | Antes del envío | PF-05 |
| D16 | Alinear modelos y nombres de rol en AGENTS.md, RULES.md y BOARD.md (hoy tres variantes por agente) | Gemini | Durante 7B | Claridad de directivas |
| D17 | Estructura del repo (D1 de estructura-repo): A) un repo, tema en raíz, herramientas en `tools/` (recomendada); B) dos repos con submódulo o subtree | Johandry | Antes de 7B | 7B-T10, 7B-T11 |
| D18 | F0-11 dónde van las evidencias crudas (D2 de estructura-repo): repo `sartorial-evidence` con la misma jerarquía (recomendado), adjuntos de Releases, Git LFS o solo disco local | Johandry (crea el repo y da acceso a los 4 entornos) | Antes de 7B | 7B-T11, `L-11` |
| D19 | `AGENTS.md` (D4 de estructura-repo): mantener la guía interna en raíz, fuera del ZIP y del push, sin cambios en RULES (recomendado); o además publicar un `AGENTS.md` para las IA del comerciante | Johandry | Antes de 7B | 7B-T2, 7B-T2b |
| D20 | F0-12 notas de versión (D5 de estructura-repo): `release-notes.md` en minúsculas, redactado para el comerciante y dentro del ZIP (recomendado), o `RELEASE-NOTES.md` interno | Johandry | Antes de 7A | 7A-T6, 7B-T2b, 7B-T3, PF-14 |
| D21 | Scripts de despliegue de `scratch/` (D6 de estructura-repo): versionarlos en `scripts/deploy/` sin secretos (recomendado; hoy el despliegue de 6 temas no es reproducible desde el repo) o dejarlos en la laptop | Johandry entrega los archivos | Durante 7B | 7B-T12 |
| D22 | Integración de GitHub (D7 de estructura-repo): seguir con `theme push --nodelete` desde `scripts/deploy/` (recomendado) o conectar `master`; si se conecta algo, solo la tienda de desarrollo y una rama por tienda | Johandry | Antes de F0-02 | Ventana de reescritura (desconectar antes) |
| D23 | `export-ignore` en `.gitattributes` para `agent-comms/` y `tools/` (D8 de estructura-repo): no por ahora (recomendado; el Download ZIP queda en 4,4 MB con BOARD y RULES) o sí (0,7 MB) | Johandry | Antes de 7B | 7B-T1 |
| D24 | `.agents/teamwork` con los 90 briefs de las auditorías 360 (D9 de estructura-repo): archivar en `agent-comms/archive/teamwork-audit360/` (recomendado, 496 KB) o borrar | Johandry | Antes de 7B | 7B-T10 |

D17 a D24 y la actualización de D10 vienen de la estructura objetivo del repo (`claude/estructura-repo.md` §10, donde se numeran D1 a D9; la referencia entre paréntesis remite a esa numeración, no a la de esta tabla).

---

## 9. Afirmaciones falsables

Todas sobre `b400cdc` en `/home/claude/noobprobro-web/tema-shopify`. Siguen valiendo en `19190b1`, que solo añade documentación, salvo la 3 (anotada).

1. `rg -n "STOREFRONT_PASSWORD \|\|" scripts/` devuelve exactamente 2 líneas: `scripts/gate5-live-verify.mjs:5` y `scripts/gate5-complete-verification.mjs:5`.
2. `node -e 'console.log(Object.keys(require("./config/settings_data.json").presets))'` imprime `Sartorial`, `Imprint`, `Archive`; `docs/decisions.md:162` y 2 filas de `docs/requirements-ledger.md` dicen `Edition`.
3. `grep -n "^## 2026" docs/decisions.md | tail -1` da `2026-09-26`; no hay entrada para MOTION-002, Lenis, marquee-drift, layout de contraseña ni Imprint. En `19190b1` la última entrada es `2026-10-18` ("Referencia única Contour"); las cinco decisiones siguen sin entrada.
4. `ls agent-comms/reviews | grep -i "MASTER\|MOTION\|PHASE1\|TEC2"` no devuelve nada: esas 4 entregas no tienen dictamen adversarial.
5. `docs/requirements-ledger.md` tiene 60 filas sin columna de ID; `código completo` aparece en las líneas 35, 38, 56, 57, 58 y 75.
6. `ls -a | grep -i "shopifyignore\|gitattributes"` y `ls | grep -i "release\|license\|development"` no devuelven nada: faltan los 5 archivos de higiene.
7. `grep -n "node-version" .github/workflows/ci.yml` da `20`; `cat .nvmrc` da `22.12.0`.
8. `grep -ln "'@app'" sections/*.liquid` devuelve solo `featured-product.liquid` y `main-product.liquid`.
9. `ls snippets | grep -i bread` no devuelve nada y `ls blocks` falla: no hay migas de pan ni theme blocks.
10. `ls locales` devuelve 3 archivos: `en.default.json`, `en.default.schema.json`, `es.json`.
11. `grep -c "" sections/main-documentation.liquid sections/main-support.liquid` da 313 y 386; `sections/main-documentation.liquid:241` tiene `"default": "Sartorial"`.
12. `snippets/product-technical-specs.liquid:46` contiene la condición sobre `'desk'`, `'object'`, `'metal'`, `'hardware'`, `'brass'`, `'paperweight'`, y las líneas 53 y 69 contienen `'Solid milled brass'` y `'Precision machined'`; `snippets/product-provenance.liquid:30` contiene `contains '19' or p_title_lower contains '20'`.
13. `docs/merchant/support.html:271` contiene `mailto:support@ruizdigital.com`.
14. `grep -n '"gates:syntax"' package.json` lista exactamente 2 archivos a mano.
15. `ls harness-AUDIT-360-002/html-validation | wc -l` da 24.
16. El ID de sprint más alto en BOARD.md es 6C (`agent-comms/BOARD.md:42`); los IDs de GPT más altos son `GPT-AUDIT-020`, `GPT-TASK-021` y `GPT-REPORT-021`; este plan empieza en 7A y en 022.
17. `config/settings_schema.json:6` dice `"theme_version": "1.0.0"` y `:7-8` apuntan a `noobprobro-web.github.io/sartorial-docs/`, con una sola clave de soporte (`theme_support_url`).
18. `ls templates/*.json | wc -l` da 17 más `gift_card.liquid`; tras 7A-T3 dará 15 más `gift_card.liquid`.
19. `grep -n "theme.js" layout/theme.liquid` da una sola línea (`:95`) con `defer`; `grep -n "preconnect" layout/theme.liquid` no devuelve nada.
20. Ningún archivo de `sections/`, `snippets/`, `assets/` o `locales/` de Sartorial comparte con Contour más que boilerplate de Shopify (comparativa.md, 16 ventanas de 4 líneas sobre 20.485); este plan no propone copiar ninguna.
