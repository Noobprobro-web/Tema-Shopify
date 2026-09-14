# GPT-OPINION-PROCESO-001: Dictamen adversarial sobre la propuesta de proceso

```text
ID: GPT-TASK-4B-004 / dictamen GPT-OPINION-PROCESO-001
Estado: APROBAR CON CAMBIOS; no ejecutar la propuesta completa como está escrita
Decision requerida: Johandry debe elegir alcance después de contrastar este dictamen con el de Gemini.
Resumen en 5 lineas:
1. La dirección es correcta, pero `npm run gates` no vuelve automáticas las cinco compuertas: solo las orquesta.
2. De las 53 filas actuales, 7 admiten cierre estático, 39 necesitan navegador/tienda y 7 conservan juicio humano irreductible.
3. CI live sí es viable con credenciales Shopify, pero exige secretos protegidos, store dedicada, serialización y código confiable.
4. El mayor riesgo de rechazo actual son documentación y soporte: ambas URLs declaradas responden HTTP 404.
5. Recomiendo únicamente ledger + CI, con alcance no mutante y un timebox de dos horas; después, Gate 5 y submission.
```

## Hallazgos prioritarios

### P0. La promesa central está sobredimensionada

Un comando puede ejecutar cinco categorías, pero no convertirlas en cinco verdades binarias. Puede verificar que una ruta existe, que una línea está dentro del archivo o que un test pasó; no puede deducir de una frase libre que esa línea prueba el requisito. El nombre correcto es **orquestador de evidencia**, no “verdad compartida sobre el código”.

La propuesta debe separar cuatro resultados: `blocker estático`, `prueba live`, `advertencia heurística` y `firma humana`. Solo el primero puede ser obligatorio en cada PR sin credenciales.

### P0. El orden de calendario empieza por el bloqueador equivocado

Las URLs configuradas actualmente son:

- `https://ruizdigital.com/themes/sartorial/docs`
- `https://ruizdigital.com/themes/sartorial/support`

El 2026-09-13, `curl --head --location` devolvió **HTTP 404** para ambas. Shopify exige documentación y formulario público de soporte listos antes del lanzamiento, y advierte que faltar a cualquier requisito causa rechazo. Esta es la causa de rechazo más probable de las cinco pendientes y debe resolverse antes de cualquier trabajo de proceso. Fuente: [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements).

### P0. CI con secretos cambia los límites de autoridad

`theme dev` sí admite `SHOPIFY_CLI_THEME_TOKEN` y `SHOPIFY_FLAG_STORE`, por lo que no tiene que quedarse local. Sin embargo, el token de Theme Access permite escribir temas. GitHub advierte que quien puede modificar el workflow puede intentar acceder a sus secretos; el job live no debe ejecutar código no confiable ni usar `pull_request_target` para hacer checkout del PR. Debe vivir en un environment protegido con aprobación de Johandry, permisos mínimos y rotación del token. Fuentes: [Shopify CLI en CI/CD](https://shopify.dev/docs/storefronts/themes/tools/cli/ci-cd), [`theme dev` flags](https://shopify.dev/docs/api/shopify-cli/theme/theme-dev) y [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use).

### P1. Un workflow en `push` no evita romper `master`

Si los agentes siguen haciendo push directo a `master`, CI informa el daño después de integrarlo. Para ser compuerta necesita ramas por tarea, PR, check requerido sobre el SHA más reciente y protección de `master`. GitHub confirma que los checks requeridos deben pasar sobre el commit vigente. Fuente: [Required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks).

### P1. `BOARD.md` no puede ser un archivo multiwriter

Centralizar lectura es correcto; centralizar escritura de cuatro agentes en un solo archivo crea el punto de conflicto más caliente del repositorio. Gemini debe ser su único escritor. Los ejecutores solo escriben entregas append-only en sus `outbox-*`; Gemini sintetiza el board y conserva la autoridad de aceptación.

### P1. El ledger no debe autogenerar estados desde evidencia libre

El script puede validar vocabulario, recuentos, dueño, campos obligatorios, rutas y líneas. No debe cambiar una fila a `cumplido`. Si más adelante se quiere generar Markdown, la fuente tendrá que ser una estructura tipada con `row_id`, `evidence_kind`, `artifact`, `locator`, `verified_commit`, `owner` y `human_signoff`; hasta entonces, el ledger permanece humano y el script solo falla por incoherencias mecánicas.

### P1. La compuerta destructiva aún no es segura para agentes concurrentes

`theme-check-sanity.mjs` usa un sandbox fijo y termina eliminando **todo** `REPO/.tmp`, no solo su carpeta. Además, `process.exit()` puede evitar una limpieza garantizada si el proceso falla. En GitHub-hosted runners aislados el riesgo es bajo; en el workspace compartido por cuatro agentes puede borrar artefactos temporales ajenos o interferir con otra ejecución. Antes de paralelizar gates, el parche debe usar un sandbox por PID, lanzar errores en vez de salir dentro del flujo y limpiar solo `SANDBOX` mediante `finally`. No se modificó el script en este dictamen.

### P1. La propuesta contiene estado histórico vencido

La prueba Playwright del total de línea ya existe, pasó `2/2` y fue aceptada en `34eeeb7`. El nombre Sartorial ya está propagado a `settings_schema`, `settings_data` y `/listings/{sartorial,edition,archive}`. No deben reescribirse entregas históricas de `agent-comms/` para sustituir Couture: son evidencia de decisiones en su fecha, no documentación vigente.

## Las cinco compuertas, sin atribuirles más alcance

### 1. Evidencia y ledger

**Automatizable:** parsear 53 filas; exigir ID estable, estado permitido, dueño y artefacto; recalcular el encabezado; verificar que archivos existan, que las líneas estén en rango y que un token literal declarado esté cerca; vincular resultado a commit, versiones y fecha.

**No automatizable genéricamente:** pertinencia, suficiencia, interpretación del requisito oficial, vigencia semántica y veracidad de una frase libre. Una línea existente puede demostrar algo distinto. Veredicto: gate estructural útil, pero nunca auto-green semántico.

### 2. Estados degenerados

**Automatizable:** fixtures hostiles estables y journeys de Playwright que verifiquen render, ausencia de errores, invariantes de precio, navegación y estados vacíos.

**No automatizable de forma sostenible:** el producto cartesiano de cinco estados por nueve superficies, navegadores, presets, mercados y configuraciones. La matriz completa crece más rápido que el tema y termina abandonada.

Subconjunto que captura aproximadamente el 80% del riesgo:

1. Smoke de las 12 plantillas en 1440 y 390 px, sin error de página/console y con un `h1` válido.
2. PDP mínimo: una variante, sin imagen, sin descripción y título largo.
3. PDP complejo: 40 variantes, agotado, compare-at, unit price, selling plan y cantidad hostil.
4. Colección vacía y búsqueda sin resultados.
5. Colección masiva: paginación, filtros, sorting, promotion tile y producto sin imagen.
6. Carrito vacío, un ítem y carrito mixto con propiedades largas, descuentos y cambio de cantidad.
7. Predictive search vacío/múltiple y recorrido completo solo con teclado.
8. Blog vacío, un artículo y artículo largo; contacto/newsletter en éxito y error.
9. Mercado alterno: JPY, formato con coma decimal y selector de idioma.

Estos son tests guiados por datos, no 45 specs independientes. El QA visual premium, lector de pantalla y AR en dispositivo real siguen siendo humanos.

### 3. Consistencia entre archivos

**Bloqueable por máquina:** duplicados sintácticos exactos, dependencias prohibidas, rutas `/` dentro de JSON estructurado, claves de locale sin resolver, custom elements duplicados y usos de un formateador monetario explícitamente prohibido en rutas de precio conocidas.

**Solo advertencia:** tokens CSS sin uso, números repetidos, similitud entre helpers y cualquier `Intl.NumberFormat` sin contexto. Liquid, JS, apps y fallbacks pueden consumir tokens dinámicamente; `44`, `100` o `250` repetidos no implican la misma regla de negocio.

Umbral operativo: todo check nuevo empieza en warning durante 20 ejecuciones. Un blocker debe tener cero falsos positivos conocidos; si supera **5% de falsos avisos (1 de cada 20)** o repite la misma excepción, se desactiva como blocker hasta corregirlo. Para heurísticas, el ratio no se arregla con silencios globales: se usa allowlist localizada con motivo y caducidad.

### 4. Superficie del comerciante

**Automatizable:** todos los `label`/`info` usan `t:`, las claves resuelven, los schemas parsean, una lista explícita de settings que dependen de configuración externa tiene `info`, y un glosario detecta términos prohibidos como advertencia.

**Humano:** sentence case real, inglés neutro, ausencia semántica de jerga, gramática, claridad y que el `info` explique la dependencia correcta. Inferir “requiere info” solo desde `type: url` también es incorrecto: un enlace editorial simple no depende de configuración externa. Veredicto: integridad bloqueable; copy review obligatoria.

### 5. Tienda real

**Automatizable con navegador:** Playwright, axe y Lighthouse sobre una tienda dedicada y sembrada; `h1`, parte de heading order, geometría de tap targets, flujos, CLS y scores. Shopify ofrece además una Lighthouse CI Action que prueba home, producto y colección con datos de referencia. Fuente: [Shopify Lighthouse CI](https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci).

**No cubierto por ese verde:** toda WCAG, calidad de anuncios de lector de pantalla, Safari/iOS real, AR/3D real, checkout (Shopify indica que `127.0.0.1:9292` no previsualiza checkout), todos los mercados/apps, estabilidad de red ni ergonomía del editor. Veredicto: gate live híbrido, no sustituto de la pasada manual.

## Viabilidad de entorno

### Q1. GitHub Actions y Windows/OneDrive

OneDrive y la ruta local con espacios no se trasladan al runner hospedado: Actions hace un checkout nuevo en su propio workspace. Los riesgos remotos reales son sensibilidad a mayúsculas, finales de línea, layouts internos de dependencias, scripts dependientes del shell y archivos locales sin commit.

Recomendación: `ubuntu-latest` como gate canónico, porque detecta errores de case que Windows oculta y coincide con los ejemplos oficiales de Shopify y Playwright. Añadir un job corto en `windows-latest` para los dos scripts, activado al tocar `scripts/**`, `package*.json` o workflows. Si solo puede existir un runner, elegir Ubuntu. Usar Node `22.12.0`, `npm ci`, lockfile y un worker de Playwright; [Playwright recomienda instalación explícita de browsers/deps y un worker en CI](https://playwright.dev/docs/ci).

### Q2. Playwright contra `theme dev` en CI

Sí es viable, pero no como check indiscriminado de todo PR:

1. Workflow estático sin secretos para PRs.
2. Workflow live sobre SHA confiable mediante environment protegido o `workflow_dispatch`.
3. Secrets separados: Theme Access token, store y storefront password si aplica.
4. `concurrency` de uno para evitar que dos runs reemplacen la misma development theme; `theme dev` reemplaza la development theme existente para ese entorno.
5. Arranque con timeout y health check, Playwright en el mismo job, `finally` que cierre el servidor y artefactos de trace/reporte.
6. Store dedicada con catálogo fijo. Para Lighthouse, preferir la acción oficial y su benchmark dataset.

No usar secretos en código de PR no confiable. El resultado debe registrar SHA, theme/store ID, preset, dataset, navegador y versiones; pegar un log sin esa identidad permite evidencia correcta sobre el commit equivocado.

### Q3. Ejecución independiente en Windows

Sí se ejecutó en Windows, en la ruta real con OneDrive y espacio, usando Node `22.12.0` y Shopify CLI `4.8.0`. Gemini la aceptó en `agent-comms/reviews/GEMINI-review-GPT-4B-003.md` y el cierre quedó en `34eeeb7`.

```text
> node scripts/theme-check-sanity.mjs
[theme-check-sanity] sandbox en .tmp/theme-check-sanity con 7 carpetas de tema
[theme-check-sanity] detectado LiquidHTMLSyntaxError (...) en sections/main-page.liquid
[theme-check-sanity] detectado TranslationKeyExists (...) en sections/main-blog.liquid
[theme-check-sanity] detectado ValidSchemaTranslations (...) en sections/main-placeholder.liquid
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
exit 0
```

```text
> node scripts/locale-key-inventory.mjs
Archivos escaneados: 65
Referencias estaticas | t: 322
Referencias de schema t:: 327
Sin resolver en storefront: 0
Sin resolver en schema: 0
Construidas en runtime: 0
Huerfanas en storefront: 1
Huerfanas en schema: 62
OK: todas las referencias estaticas resuelven contra los locales.
exit 0
```

El inventario no terminó en `1` porque el criterio de la tarea quedó obsoleto: Gemini ya había autorizado y aplicado `button_radius.label`. No fue una diferencia de plataforma. Shopify CLI falla solo dentro del sandbox de Codex con `uv_os_get_passwd returned ENOMEM`; fuera del sandbox de Windows completó correctamente.

## Clasificación de las 53 filas

Clasifico por el **artefacto final que puede cerrar la fila tal como está redactada**, no por la herramienta que puede ayudar.

| Montón | Cantidad | Filas |
|---|---:|---|
| Script estático | **7** | 12 plantillas JSON; Gift Card Liquid; section groups; bloques `@app`; schemas/settings localizados; exclusión de `markets.json`; alineación nombre tema/preset |
| Navegador / tienda | **39** | Performance: 5 filas dinámicas (Lighthouse, imágenes responsivas, focal point, LCP, CLS); Accesibilidad: las 11 filas; Comercio: las 19 filas; SEO/metadatos: las 4 filas |
| Juicio humano irreductible | **7** | originalidad; “JS modular vanilla” como calidad arquitectónica; CSS “obsoleto”/legibilidad; nombre y marcas; diferenciación real de presets; suficiencia de documentación/soporte; autenticidad, derechos y calidad de las 3 demos |
| **Total** | **53** | 7 + 39 + 7 |

Dos filas humanas son mixtas: un script sí puede comprobar “cero dependencias”, “cero SCSS” y heurísticas de minificación, pero no cerrar la fila completa mientras también diga “modular” u “obsoleto”. Deben dividirse en predicados atómicos si se quiere elevar la cobertura estática sin exagerarla.

Resultado: con el ledger actual, un script estático puede cerrar por sí solo **7/53 (13.2%)**. Puede asistir en muchas más y Playwright puede cerrar una parte importante de las 39 live, pero la frase “las cinco compuertas se vuelven ejecutables” solo es defendible si “ejecutable” significa “produce un reporte mixto”, no “produce cinco verdes”.

## Riesgo de calendario

No aprobaría “todo incluido Playwright” antes de submission. El coste de una suite live estable no está en escribir asserts: está en preparar fixtures, credenciales, aislamiento, presets, mercados y diagnóstico de flakes. Tampoco consolidaría once documentos ahora; mover rutas y archivar fuentes antes de entregar crea churn y rompe referencias históricas.

Sí conservaría una red mínima porque cuatro agentes escribiendo directamente en `master` ya produjeron integraciones concurrentes durante una prueba. El alcance correcto es pequeño: validador **no mutante** del ledger + CI estático requerido. El resto se congela hasta resolver los 404 y ejecutar Gate 5.

Orden comercial recomendado:

1. Publicar documentación y formulario de soporte; comprobar contenido y HTTP 200.
2. Resolver decisiones de producto que afecten listing/demos.
3. Importar/fijar el catálogo y ejecutar las ocho filas de medición real.
4. Preparar las tres demos y la submission.
5. Después de envío, ampliar Playwright y consolidar gobernanza sin presión de calendario.

## Recomendación a Johandry en tres líneas

**Elegir: solo ledger y CI.** Validador estructural no mutante, `gates:static` en Ubuntu, smoke Windows y check requerido sobre PR; timebox máximo de dos horas.
**No ejecutar ahora:** ledger autogenerado, heurísticas bloqueantes, rearchivo de gobernanza ni matriz Playwright completa.
**Prioridad previa y absoluta:** publicar docs/soporte (hoy ambos 404); después completar Gate 5 y submission.
