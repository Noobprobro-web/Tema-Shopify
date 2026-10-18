# Estructura del repo: respuesta a la auditoría de Gemini

Respuesta a la auditoría estructural de Gemini del 2026-10-18; verificado empíricamente en copias del repo.

# Estructura objetivo del repo Sartorial (Noobprobro-web/tema-shopify)

Fecha: 2026-10-18. Base: origin/master 19190b1. Solo lectura sobre los repos reales; todo lo ejecutado corrió en copias dentro de `/tmp/claude-0/-home-claude/24a5d739-75d0-5475-96de-119a42626d3b/scratchpad/estructura/diseno/` (carpeta `objetivo/` con la estructura propuesta y git inicializado para simular, `evidence-export/` con lo que sale del repo, `fr/repo` con la prueba de `git filter-repo`, `out/` con las salidas de las compuertas). Shopify CLI 4.9.4 reutilizada desde `scratchpad/sartorial/node_modules`.

## 1. Diagnóstico en 5 líneas

1. El tema está sano: `shopify theme package` da 94 archivos y 347 KB, Theme Check 0 ofensas, 8 compuertas en verde. Nada del tema hay que tocar por estructura.
2. Lo que "no sirve" es el repo como objeto que se comparte: el Download ZIP de GitHub pesa 250 MB (límite de Shopify 50 MB, de Gemini 100 MB) y el `.git` 220 MB. El 95 % del peso son 621 archivos de evidencia (PNG, PDF, JSON crudos) dentro de `agent-comms/outbox-*/harness-*` y `docs/gate5-reports/`.
3. La raíz mezcla tema, herramientas y basura histórica (9 `harness-*`, `.agents` versionada aunque está en `.gitignore`, `.playwright-mcp`, `cobertura-360-002.csv`), pero ninguna de esas carpetas rompe la CLI ni la integración de GitHub: ambas usan lista blanca.
4. El único archivo interno que sí llega al comerciante es `AGENTS.md`, porque la CLI 4.9.4 lo incluye a propósito en `theme package` y en `theme push`; un `.shopifyignore` lo saca del push pero no del paquete.
5. Faltan piezas baratas: `.gitattributes`, `.shopifyignore` correcto, README en inglés, un comando oficial para el ZIP, una regla sobre dónde van las evidencias y, pendiente desde BOARD §4.5, el historial con cookies (ff3dca1) y la contraseña.

## 2. Por qué no aplicar la propuesta de Gemini

| Propuesta de Gemini | Qué pasa de verdad | Veredicto |
|---|---|---|
| "La CLI intenta empujar archivos prohibidos y falla por falta de `.shopifyignore`" | `theme package` y `theme push` solo leen carpetas del tema más `AGENTS.md` y `DESIGN.md` (código: `chunk-J6LQR2F6.js` y `chunk-SZI6G247.js`). El paquete sale limpio sin `.shopifyignore` | Diagnóstico falso |
| `.shopifyignore` con `harness-*/`, `docs/`, `listings/`, `package.json`... | `theme package` no lee `.shopifyignore` (probado: ZIP idéntico con y sin él). La integración de GitHub tampoco. Solo afecta a push/pull/dev, donde esas carpetas ya no se leen | No cambia nada |
| `git rm -rf harness-* .agents .playwright-mcp agent-comms AGENTS.md cobertura.csv` | Borra BOARD.md, RULES.md, inbox/outbox y reviews: destruye el protocolo y la trazabilidad del ledger. No baja el ZIP del tema ni un byte | Destructivo e inútil para el síntoma |
| Variante del informe final: además `tests/` y `scripts/` | Rompe 5 gates de npm, 6 pasos del CI y la detección de Playwright (probado en copias) | Rompe el CI |
| Usar el Download ZIP de `.../archive/refs/heads/main.zip` | La rama es `master`; `main` no existe. El ZIP de GitHub además mete todo bajo `tema-shopify-master/` y no vale para subir a Shopify | Enlace roto y método equivocado |
| "`deploy-presets.mjs` ya está en el repo" | Vive solo en `scratch/` (ignorado) en la laptop de Johandry. Gemini lo vio en Drive | No versionado |
| Comparación con `listings/` como basura | `listings/` es la carpeta oficial de presets y viaja en el ZIP por diseño | Error de concepto |

## 3. Estructura objetivo (alternativa A, recomendada)

El tema sigue en la raíz de `master`, que es la rama que se conectaría a Shopify. Todo lo demás se agrupa o se va.

```
tema-shopify/
├── assets/ config/ layout/ locales/ sections/ snippets/ templates/   tema (sin cambios)
├── listings/{sartorial,imprint,archive}/templates/                   presets (sin cambios)
├── AGENTS.md            guía interna de agentes (se queda; fuera del ZIP y del push)
├── README.md            para humanos, en inglés (nuevo)
├── DEVELOPMENT.md LICENSE.md RELEASE-NOTES.md                        (7B, como ya estaba previsto)
├── .gitattributes .gitignore .shopifyignore .theme-check.yml .nvmrc
├── package.json package-lock.json playwright.config.mjs
├── .github/workflows/ci.yml
├── scripts/             compuertas + package-theme.mjs + repo-weight.mjs (+ deploy/ versionado)
├── tests/               Playwright (sin cambios)
├── docs/                decisiones, ledger, planes, gate5-reports solo con resúmenes
├── agent-comms/         BOARD, RULES, inbox/outbox/reviews; solo texto (.md .mjs .txt .diff .json pequeños)
│   └── archive/teamwork-audit360/   lo que era .agents/teamwork
└── tools/
    └── harness/{4D-001,4D-002,4D-003,4E-001,4E-002,4E-003,AUDIT-360-001,AUDIT-360-002,COMP-001}/
        └── README.md    tabla ruta vieja -> ruta nueva

Fuera del repo:
  sartorial-evidence/ (repo privado aparte, misma jerarquía de carpetas)   PNG, PDF, HAR, JSON crudos
  dist/ (ignorado)                                                         Sartorial-<versión>.zip generado
  evidence/ (ignorado)                                                     salida local de arneses antes de subirla
```

Medidas en la copia con esta estructura: árbol versionado 1.565 archivos y 14,9 MB (antes 2.210 y 285 MB); Download ZIP simulado con `git archive` 4,4 MB (antes 250 MB); `.git` de la copia 11 MB; ZIP del tema 93 archivos y 335 KB, idéntico al actual salvo que ya no trae `AGENTS.md`. `gates:static` 9/9 en verde (los 8 actuales más `gates:weight`), Theme Check 92 archivos y 0 ofensas, `playwright test --list` encuentra los 2 tests.

### Qué hace cada archivo nuevo

| Archivo | Para qué sirve de verdad | Borrador probado |
|---|---|---|
| `scripts/package-theme.mjs` (`npm run theme:package` y `gates:package`) | Copia a una carpeta temporal solo las carpetas del tema, `listings/<preset>/{templates,sections}` y `release-notes.md` si existe; llama a `shopify theme package --path <temporal>`; deja el ZIP en `dist/`; lee el directorio central del ZIP sin dependencias y falla (`--verify`) si entra cualquier archivo fuera de la lista blanca, si falta `layout/theme.liquid`, `settings_schema.json` o `settings_data.json`, o si pasa de 50 MB | `diseno/objetivo/scripts/package-theme.mjs`. Prueba negativa: con `DESIGN.md`, `listings/sartorial/preview.png` y `listing.json` en el árbol, el ZIP sigue limpio; `shopify theme package` a pelo mete los cuatro |
| `scripts/repo-weight.mjs` (`gates:weight`) | Falla si hay PNG/JPG/PDF/HAR/ZIP fuera de `assets/` y `listings/`, JSON de más de 300 KB fuera del tema, cualquier archivo de más de 1 MB fuera de `assets/`, o árbol de más de 40 MB. Usa `git ls-files` | `diseno/objetivo/scripts/repo-weight.mjs`. Detectó los 4 Lighthouse crudos de `docs/gate5-reports/` (600 a 700 KB cada uno) |
| `.shopifyignore` | Solo lo leen `theme push`, `pull` y `dev`. La CLI ya se limita a carpetas del tema más `AGENTS.md` y `DESIGN.md`, así que el archivo solo necesita: `AGENTS.md`, `DESIGN.md`, `*.zip`, `*.map`, `*.orig`, `*.rej`, `*.bak`, `*.tmp`, `.DS_Store`, `Thumbs.db`, `config/*.local.json`, `templates/*.temp.json`. Sin patrones de carpetas con barra final (la CLI avisa "Directory pattern may be misleading") y sin listar `docs/`, `scripts/` ni `package.json`, que nunca se leen | `diseno/objetivo/.shopifyignore` |
| `.gitattributes` | `* text=auto eol=lf` más explícitos para liquid, json, css, js, mjs, md, yml, svg; binarios marcados; `*.json linguist-language=jsonc` porque Shopify escribe cabeceras de comentario. El índice ya está 100 % LF (`git ls-files --eol`: 1.571 lf, 0 crlf), así que `git add --renormalize .` casi no produce diff; el riesgo "diff grande" de 7B no existe | `diseno/objetivo/.gitattributes` |
| `.gitignore` revisado | Añade `.playwright-mcp/`, `evidence/`, y los patrones de evidencia cruda bajo `agent-comms/**` y `tools/**` (png, jpg, webp, pdf, har, `raw-*.json`, `html-validation/`). Conserva `scratch/`, `*.zip`, `dist/`, `.agents/` | `diseno/objetivo/.gitignore` |
| `README.md` en inglés | Qué es el tema, tabla de carpetas con "ships to merchants sí/no", Node 22, comandos, aviso de no usar Download ZIP ni `shopify theme package` directo | `diseno/objetivo/README.md` |
| `tools/harness/README.md` | Tabla ruta vieja a ruta nueva, para que BOARD y los informes históricos sigan siendo legibles sin reescribirlos | `diseno/objetivo/tools/harness/README.md` |

Sobre `AGENTS.md`: se queda en la raíz con su contenido actual porque Codex lo lee ahí, RULES §1.1 lo exige y decenas de documentos lo citan por nombre; renombrarlo o vaciarlo costaría más que lo que resuelve. Sale del paquete porque `package-theme.mjs` nunca lo copia al staging, y del push por `.shopifyignore`. La alternativa `zip -d` se descarta: `zip` no está en Windows y deja la verdad en un postproceso en vez de en la entrada. Si algún día quieren un `AGENTS.md` público para las IA del comerciante (que es para lo que Shopify lo incluye), se escribe aparte y se añade a `ROOT_FILES` del script; hoy no.

Sobre `release-notes.md`: la CLI empaqueta `release-notes.md` en minúsculas (y `update_extension.json`); `RELEASE-NOTES.md` en mayúsculas nunca viaja (fast-glob distingue mayúsculas; el ZIP de Contour lo confirma). Si el equipo quiere que la Theme Store muestre notas al comerciante, el archivo se llama en minúsculas y se escribe para el comerciante; si es registro interno, en mayúsculas. Decisión D5.

## 4. Tabla de movimientos

| Origen | Destino | Cómo | Configuración a ajustar |
|---|---|---|---|
| `harness-4D-00{1,2,3}/`, `harness-4E-00{1,2,3}/`, `harness-AUDIT-360-00{1,2}/`, `harness-COMP-001/` | `tools/harness/<ID>/` | `git mv` (conserva historial) | `.theme-check.yml`: sustituir `harness-*/**`, `.agents/**`, `.playwright-mcp/**` por `tools/**`, `evidence/**`, `dist/**`. `.gitignore` (7A-T2): `tools/harness/*/html-validation/`. Ningún script de `scripts/`, `tests/`, `package.json`, `ci.yml` ni `playwright.config.mjs` referencia estas carpetas (grep vacío). Los arneses usan `process.cwd()`, siguen funcionando desde la raíz |
| `cobertura-360-002.csv` | `tools/harness/AUDIT-360-002/cobertura-360-002.csv` | `git mv` | Solo 3 menciones en docs/agent-comms; se cubre con `tools/harness/README.md` |
| `.agents/teamwork/` (90 md, en `.gitignore` pero versionado) | `agent-comms/archive/teamwork-audit360/` | `git mv` y `.agents/` queda ignorada para uso local | Ninguna |
| `.playwright-mcp/page-2026-09-29....yml` | Borrar | `git rm` | `.gitignore`: `.playwright-mcp/` |
| 499 PNG, 24 JPG, 18 PDF, HAR y JSON crudos de `agent-comms/outbox-claude/harness-LEAD-001` (107 MB), `harness-MOTION-002` (103 MB), `outbox-gemini/harness-TECH-AUDIT-001` (30 MB) y resto | Repo `sartorial-evidence` con la misma ruta | `git rm --cached` + copia al otro repo | `.gitignore` nuevo; `gates:weight`; cada informe afectado recibe una línea "Evidencia cruda: sartorial-evidence@<sha>/<ruta>". Las 3 evidencias que cita el ledger son `.mjs`, `.txt` y un JSON de 315 B: se quedan |
| `docs/gate5-reports/lh-*.json` (4 Lighthouse crudos, 2,7 MB) | `sartorial-evidence/docs/gate5-reports/` | igual | Nadie los cita en ledger ni BOARD; queda `gate5-empirical-report.md` y `results.json` |
| `tools/harness/AUDIT-360-002/html-validation/*.html` (24 con `accessToken`) | Fuera del índice (ya previsto en 7A-T2) | `git rm --cached` | `.gitignore` |
| `scratch/deploy-presets.mjs`, `verify-dev-previews.mjs`, `verify-presets-live.mjs`, `audit-sprint6c.mjs` (solo en la laptop de Johandry) | `scripts/deploy/` con `targets.json` (tiendas y theme IDs, que ya están en BOARD) y credenciales solo por variables de entorno | Johandry los entrega, GPT escanea secretos, Claude adapta | `package.json`: `deploy:dev`, `deploy:demos`, `verify:live`; `gates:secrets` de 7B los cubre. Sí deben versionarse: hoy el despliegue de BOARD §14 no es reproducible desde el repo |
| `package.json` | mismo | editar | `theme:package` y `gates:package` apuntan a `node scripts/package-theme.mjs [--verify]`; nuevo `gates:weight`; `gates:static` encadena 9 |
| `.github/workflows/ci.yml` | mismo | editar | `node-version-file: .nvmrc` (cierra la discrepancia Node 20 vs 22.12.0); paso nuevo `gates:weight` antes de `gates:package` |
| `AGENTS.md`, `agent-comms/RULES.md` | mismos | editar texto | Sección corta "Rutas y evidencias": `tools/harness/`, repo de evidencias, `npm run theme:package` como único ZIP, `dist/` ignorado. RULES §1.4 añade la línea "Evidencia cruda (repo y sha)" |

Nada de `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/` ni `listings/` se mueve. Las rutas que los documentos históricos citan (`harness-AUDIT-360-002/...`) se resuelven con la tabla de `tools/harness/README.md`; no se reescriben 1.000 archivos de agent-comms.

## 5. Peso del historial: opciones

| Opción | Efecto en Download ZIP | Efecto en clones y `.git` | Flujo de agentes | Coste | Veredicto |
|---|---|---|---|---|---|
| Git LFS para PNG/PDF/JSON | Pequeño (GitHub no mete objetos LFS en el archive salvo opción) | El clon descarga los objetos LFS igual (267 MB) salvo `GIT_LFS_SKIP_SMUDGE=1`; hace falta git-lfs en 4 entornos y en CI; migrar lo histórico exige `git lfs migrate`, que es reescritura | Transparente para quien tenga LFS; frágil para quien no | Cuota de almacenamiento y ancho de banda de LFS de la cuenta (verificar en Billing; cada reclonado completo la consume) | No |
| Repo aparte `sartorial-evidence` (misma jerarquía) + índice en cada informe | 4,4 MB | El repo principal queda en 15 MB de árbol; `.git` solo baja si además se reescribe | Un paso más al cerrar un sprint: copiar `evidence/<ID>/` al otro repo y pegar el sha en el informe. Verificación adversarial sigue teniendo las capturas | Un repo privado más; disciplina | Sí, recomendado |
| GitHub Releases como adjuntos (ZIP por sprint) | 4,4 MB | igual que el anterior | Requiere `gh` o subir a mano; los agentes no pueden navegar un ZIP adjunto tan fácil como un árbol | Gratis, 2 GB por archivo | Alternativa válida si no quieren segundo repo |
| Solo `.gitignore` y resúmenes versionados | 4,4 MB | igual | Las capturas se quedan en la laptop de Johandry: se pierden al cambiar de máquina (ya pasó con `scratch/`) | Cero | Insuficiente sola; es la mitad de la opción 2 |
| Reescritura con `git filter-repo` | No cambia el ZIP por sí sola | `.git` baja de 218 MB a 6,4 MB en la prueba (`diseno/fr/repo`, 49 commits disponibles; con el historial completo serán unos MB más). Saca también `harness-AUDIT-360-001/lh-headers.json` (cookies de sesión de ff3dca1 y 080402c) y los 24 HTML con `accessToken` | Todos reclonan una vez; ramas locales abiertas se pierden si no se rebasan antes | Force push, reclonar 4 entornos, reconectar la integración de GitHub si existe, pedir a GitHub Support que purgue objetos huérfanos, anotar fecha en `docs/decisions.md`. Irreversible salvo mirror previo | Sí, una vez, entre 7B y 7C como ya proponía F0-02, porque resuelve peso y secretos en el mismo acto |

Lista de rutas probada con filter-repo (archivo `diseno/fr/paths.txt`): `agent-comms/**/*.{png,jpg,jpeg,pdf,har}`, `harness-*/**/*.{png,jpg,pdf}`, `harness-*/html-validation/**`, `harness-AUDIT-360-001/lh-headers.json`, `agent-comms/outbox-claude/harness-REVIEW-AUDIT-360/vnu-24-paginas.json`, `docs/gate5-reports/lh-*.json`, `**/raw-*.json`. El `.md` CLAUDE-REVIEW-GEMINI-AUDIT-360 solo nombra cookies, no las contiene. La contraseña literal del storefront está en blobs de `scripts/gate5-*.mjs` según BOARD: tras rotarla (F0-01) deja de ser secreto y no hace falta `--replace-text`; si quieren borrarla igual, se añade un `--replace-text` con la cadena en la misma pasada.

## 6. Alternativa B: dos repos (tema solo + repo de trabajo con submódulo o subtree)

| Criterio | A: un repo, tema en raíz, herramientas en carpetas | B: repo `sartorial` solo tema conectado a Shopify + repo de trabajo |
|---|---|---|
| Integración de GitHub | Compatible: carpetas ajenas se ignoran | Compatible en el repo tema |
| Commits que Shopify escribe de vuelta ("Update from Shopify") | Caen en `master`; se ven en el mismo repo donde trabajan los agentes | Caen en el repo tema; el repo de trabajo tiene que mover el puntero del submódulo o hacer `git subtree pull` cada vez; con subtree, dos historiales de los mismos archivos |
| Compuertas y CI | Sin cambios de ruta: `scripts/`, `.theme-check.yml`, `playwright.config.mjs` siguen apuntando a `assets/`, `sections/`... | Todas las rutas pasan a `theme/assets/...`; `.theme-check.yml` con `root`; Theme Check y `theme dev` hay que lanzarlos desde `theme/`; dos `package.json` o uno con `--path` |
| Flujo de agentes | Un clon, un BOARD, un `git status` | Cada directiva debe decir en qué repo se commitea; un informe puede necesitar dos commits; Gemini commitea dos veces y coordina el bump del submódulo; los submódulos son el punto donde más se equivocan los agentes |
| Download ZIP | 4,4 MB (0,7 MB si `agent-comms/` y `tools/` llevan `export-ignore`) | El del repo tema pesa lo que el tema; el del repo de trabajo sigue pesando lo que pesen las evidencias |
| Evidencias | Siguen necesitando salir a otro sitio | Igual |
| Coste de migración | Un sprint corto, reversible con `git revert` | Reescritura de rutas en todo el tooling, dos repos que mantener, riesgo de divergencia tema/herramientas |

Recomendación: A. B no resuelve nada que A no resuelva y añade el peor problema de operación para un equipo de agentes: dos historiales que hay que mantener sincronizados a mano, agravado por los commits automáticos de Shopify. Si en el futuro conectan la integración, la lección de Contour aplica igual en A: nunca tres tiendas en la misma rama.

## 7. Plan de migración

Convención: Johandry autoriza y rota secretos; Claude implementa en rama `chore/estructura-7B` sin commit; Gemini commitea, despliega y escribe BOARD.md; GPT verifica. Antes de empezar, Gemini hace `git clone --mirror` del repo a un disco fuera de OneDrive y lo guarda hasta cerrar el paso 7.

| Paso | Quién | Qué | Reversible | Verificación al cerrar |
|---|---|---|---|---|
| 0 | Johandry | Firmar la tabla de decisiones (§10). Rotar contraseña del storefront, PAT de Figma y key de Composio (P0 de BOARD §4.5). Crear repo privado `Noobprobro-web/sartorial-evidence` vacío y dar acceso a los cuatro entornos | n/a | `git ls-remote <evidence>` responde; BOARD registra la rotación con fecha |
| 1 | Claude | Mover con `git mv` las 9 `harness-*` a `tools/harness/<ID>/`, el CSV, `.agents/teamwork` a `agent-comms/archive/teamwork-audit360/`; `git rm` de `.playwright-mcp`. Escribir `tools/harness/README.md`. Ajustar `.theme-check.yml` y `.gitignore` | Sí (`git revert`) | `npm run gates:static` 8/8 con exit 0; `npx shopify theme check` 92 archivos, 0 ofensas; `npx playwright test --list` 2 tests; `git status` sin archivos sin seguimiento |
| 2 | Claude | Añadir `.gitattributes`, `.shopifyignore`, `scripts/package-theme.mjs`, `scripts/repo-weight.mjs`, README en inglés; `package.json` (`theme:package`, `gates:package --verify`, `gates:weight`, `gates:static` de 9); `ci.yml` (`node-version-file`, paso `gates:weight`); `git add --renormalize .` | Sí | `npm run theme:package` deja `dist/Sartorial-1.0.0.zip` y "Manifest OK"; `unzip -l dist/*.zip \| grep -c AGENTS` = 0; `diff` de la lista del ZIP contra el actual = solo falta `AGENTS.md`; `git diff --stat` del renormalize es mínimo (índice ya LF) |
| 3 | Claude | Exportar evidencias: `git ls-files 'agent-comms/**/*.png' ... docs/gate5-reports/lh-*.json` a `../sartorial-evidence/` conservando rutas; `git rm --cached` de esas rutas y de `tools/harness/AUDIT-360-002/html-validation/`; añadir a cada informe afectado la línea "Evidencia cruda: sartorial-evidence/<ruta> (sha pendiente)". Informe `CLAUDE-REPORT-7B-ESTRUCTURA-001` con los diffs de listas | Sí (los archivos siguen en la rama anterior y en el repo de evidencias) | `npm run gates:weight` OK y árbol < 20 MB; `node scripts/ledger-verify.mjs` 0 incoherencias; las 3 evidencias que cita el ledger existen (`ls` de las 3 rutas) |
| 4 | GPT | Verificación adversarial: repetir `gates:static` 9/9 desde clon limpio; comparar `unzip -Z1` del ZIP nuevo contra `verif/pkg-sart`; `rg -n "harness-(4D|4E|AUDIT-360|COMP)-00[0-9]" scripts tests .github package.json playwright.config.mjs` = 0; `rg -n "shpat_|_shopify_essential=|STOREFRONT_PASSWORD \|\|"` en el árbol = 0; comprobar que ninguna evidencia exportada falta en `sartorial-evidence` (`diff -r` de listas) | n/a | Dictamen en `reviews/GPT-review-CLAUDE-7B-ESTRUCTURA-001.md` |
| 5 | Gemini | Tres commits en la rama: "chore: move harnesses and agent briefs under tools/ and agent-comms/archive", "chore: packaging script, weight gate, gitattributes, shopifyignore, README", "chore: move raw evidence to sartorial-evidence". Push de `sartorial-evidence` primero y sustituir "sha pendiente" por el sha real. Merge a `master`. BOARD.md §15 y entrada en `docs/decisions.md` | Sí hasta aquí | CI verde en GitHub con 10 pasos; `curl -sI https://github.com/Noobprobro-web/tema-shopify/archive/refs/heads/master.zip` y descargar: < 10 MB; `git clone` nuevo y `npm ci && npm run gates:static` en verde |
| 6 | Johandry decide, Gemini ejecuta | Reescritura del historial (D3). Ventana sin trabajo abierto, entre 7B y 7C. Todos hacen push de lo suyo y paran. Si hay tema conectado por integración de GitHub, desconectarlo antes. `git clone --mirror`, `git filter-repo --invert-paths --paths-from-file paths.txt` (lista de §5), revisar `git log --stat` de ff3dca1 y 080402c, `git push --force --mirror` | No (solo con el mirror de respaldo) | `git rev-list --objects --all \| git cat-file --batch-check` sin PNG/PDF; `du -sh .git` < 30 MB; `git log --all -- harness-AUDIT-360-001/lh-headers.json` vacío |
| 7 | Todos | Reclonar los 4 entornos (borrar el clon viejo, no hacer pull). Reconectar la integración si aplica. Pedir a GitHub Support la purga de objetos huérfanos y de cachés de archive. Gemini registra fecha y sha nuevo de `master` en `docs/decisions.md` y BOARD | n/a | Cada entorno: `git rev-parse HEAD` igual al nuevo `master`; `npm run gates:static` en verde; CI verde |
| 8 | Johandry entrega, GPT escanea, Claude adapta, Gemini commitea | Versionar `scripts/deploy/` (deploy-presets, verify-dev-previews, verify-presets-live) con `targets.json` y credenciales por entorno | Sí | `rg -n "password|shpat_|shptka_" scripts/deploy` = 0; `npm run deploy:dev -- --dry-run` lista las 3 instancias de tema-qkqpke0j |

Lo que no debe pasar durante los pasos 1 a 5: nadie toca `assets/`, `sections/`, `snippets/`, `templates/` ni `config/` (7A puede correr en paralelo porque no toca raíz; la única colisión es `RELEASE-NOTES.md` y la integra Gemini, como ya dice el plan).

## 8. Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| Documentos históricos (BOARD, informes, ledger) citan `harness-AUDIT-360-002/...` y dejan de resolver | `tools/harness/README.md` con la tabla de equivalencias; no reescribir el histórico. Las 3 evidencias del ledger no se mueven |
| Un agente guarda capturas en `agent-comms/.../harness-X/` y `.gitignore` las traga en silencio; el informe dice "capturas adjuntas" y no están | `gates:weight` no lo detecta (no están en el índice), así que la regla va en RULES §1.4: la cabecera del informe lleva "Evidencia cruda: sartorial-evidence/<ruta>@<sha>" y GPT la abre en la verificación adversarial. Convención de salida local: `evidence/<ID>/` (ignorada) y copia al repo de evidencias al cerrar |
| Alguien ejecuta `shopify theme package` a pelo y sube un ZIP con `AGENTS.md` | README lo prohíbe; `gates:package` falla si el ZIP de `dist/` trae algo fuera de la lista; PREFLIGHT PF-12 del plan pasa a ser "ZIP generado por `npm run theme:package`" |
| `package-theme.mjs` deja un staging a medias | El staging vive en `os.tmpdir()`, nunca en `.tmp/` del repo (que `.theme-check.yml` escanea a propósito), y se borra en `finally` |
| Shopify cambia la lista blanca de la CLI | El script no depende de ella para decidir qué entra (lo decide el staging) y la comprobación del manifiesto avisaría de cualquier novedad |
| Force push rompe clones, ramas abiertas y la integración de GitHub | Ventana acordada, mirror previo, reclonar en vez de pull, desconectar y reconectar la integración, registrar en decisions.md. Si Johandry no autoriza, el repo sigue funcionando con el `.git` de 220 MB: solo pesa el primer clon |
| GitHub conserva los blobs huérfanos y los enlaces a commits viejos siguen abiertos | Solicitud a GitHub Support o, más simple, recrear el repo desde el mirror filtrado; las credenciales ya rotadas en el paso 0 hacen que esto sea higiene y no urgencia |
| CRLF al volver a Windows/OneDrive | `.gitattributes` con `eol=lf`; README pide `core.autocrlf=false`; `gates:weight` no lo mira, pero Theme Check `AssetSizeCSS` del preset `all` sí lo delataría (lección de Contour) |
| Conectar `master` a una tienda hace que Shopify escriba commits de `settings_data.json` en la rama de trabajo | Seguir desplegando con `theme push --nodelete` desde `scripts/deploy/` (flujo actual de BOARD §14). Si se conecta algo, solo la tienda de desarrollo, y nunca las 3 demos a la misma rama |
| Cuota de LFS, si eligieran LFS | No elegir LFS; está en §5 solo para dejar constancia |

## 9. Cambios en el plan CLAUDE-PLAN-CONTOUR-REF-001

### Fase 0

| ID | Cambio |
|---|---|
| F0-02 | La recomendación pasa de "a) solo si el repo va a hacerse público" a "b) reescribir una vez, entre 7B y 7C, porque resuelve 220 MB de `.git` y las cookies de ff3dca1/080402c en el mismo acto". Lista de rutas: §5 de este informe. Criterio: `du -sh .git` < 30 MB y `git log --all -- harness-AUDIT-360-001/lh-headers.json` vacío |
| F0-11 (nueva) | Dónde viven las evidencias crudas: repo `sartorial-evidence` (recomendado) o Releases. Decide Johandry. Desbloquea 7B-T11 |
| F0-12 (nueva) | `release-notes.md` en minúsculas para el comerciante o `RELEASE-NOTES.md` interno. Decide Johandry, afecta a 7A-T6, 7B-T3 y PF-14 |

### Sprint 7A

| Tarea | Cambio |
|---|---|
| 7A-T2 | Las rutas pasan a `tools/harness/*/html-validation/` y `tools/harness/**/*headers.json` si 7B-T10 se integra antes; si 7A va primero, Gemini aplica el `git mv` en la integración. Añadir al criterio: `git ls-files tools/harness \| rg html-validation` = 0 |

### Sprint 7B (se amplía; sigue siendo 1.0.2)

| Tarea | Archivos | Criterio de aceptación |
|---|---|---|
| 7B-T2 (reescrita) | `.shopifyignore` con el contenido de §3 (solo lo que push/dev pueden leer: `AGENTS.md`, `DESIGN.md`, `*.zip`, `*.map`, `*.orig`, `*.rej`, `*.bak`, `*.tmp`, `.DS_Store`, `Thumbs.db`, `config/*.local.json`, `templates/*.temp.json`). Se elimina de la lista `agent-comms/`, `harness-*/`, `docs/`, `scripts/`, `tests/`, `package*.json`, `listings/**` porque la CLI no los lee y el patrón con barra final dispara aviso | `rg -n "^(docs|scripts|tests|agent-comms|package)" .shopifyignore` = 0; `npx shopify theme dev` arranca sin el aviso "Directory pattern may be misleading"; en el tema de desarrollo no aparece `AGENTS.md` tras un `theme push --nodelete` |
| 7B-T2b (nueva) | `scripts/package-theme.mjs`; `package.json` `theme:package` y `gates:package --verify`; `.gitignore` `dist/` ya existe | `npm run theme:package` imprime "Manifest OK"; `unzip -Z1 dist/*.zip` solo tiene `assets/ config/ layout/ locales/ sections/ snippets/ templates/ listings/*/templates/`; prueba negativa con `DESIGN.md` y `listings/sartorial/preview.png` en el árbol sigue limpia; PF-12 del preflight pasa a usar este comando |
| 7B-T10 (nueva) | `git mv` de las 9 `harness-*` a `tools/harness/<ID>/`, CSV, `.agents/teamwork` a `agent-comms/archive/teamwork-audit360/`, `git rm .playwright-mcp`; `.theme-check.yml` (`tools/**`, `evidence/**`, `dist/**`); `tools/harness/README.md` | `ls -d harness-* .agents .playwright-mcp cobertura-360-002.csv` vacío; `gates:static` exit 0; Theme Check 92 archivos 0 ofensas; `npx playwright test --list` 2 tests |
| 7B-T11 (nueva) | Política de evidencias: `scripts/repo-weight.mjs` (`gates:weight`), `.gitignore` con patrones de §3, exportación de los 621 archivos a `sartorial-evidence` con la misma ruta, línea "Evidencia cruda" en los informes afectados (LEAD-001, MOTION-002, TECH-AUDIT-001, 4F-001, 4F-002, AUDIT-FINAL-002/003, 5A-001, DOCS-VERIFY-001, GPT-018, gate5-reports), RULES §1.4 y AGENTS.md con la regla | `gates:weight` exit 0 y árbol < 20 MB; `git archive --format=zip HEAD` < 10 MB; `ledger-verify` 0 incoherencias; `diff` de listas entre lo exportado y `sartorial-evidence` vacío |
| 7B-T3 (ajuste) | README en inglés con la tabla "ships to merchants" y la prohibición del Download ZIP y del `theme package` directo (borrador en `diseno/objetivo/README.md`) | GPT lo lee como comerciante técnico; ningún secreto ni contraseña; enlaces de docs y soporte responden 200 |
| 7B-T1 (ajuste) | `.gitattributes` con el contenido de §3 (incluye binarios y `linguist-language=jsonc`) | `git ls-files --eol \| rg -c "i/crlf"` = 0; el commit de renormalize tiene menos de 10 archivos |
| 7B-T8 (ajuste) | `ci.yml`: `node-version-file: .nvmrc` en vez de un número; paso `gates:weight` antes de `gates:package`; `gates:package` ya verifica el manifiesto | CI con 10 pasos en verde |
| 7B-T12 (nueva, depende de que Johandry entregue los archivos) | `scripts/deploy/{deploy-presets,verify-dev-previews,verify-presets-live}.mjs` + `targets.json` sin secretos; `package.json` `deploy:dev`, `deploy:demos`, `verify:live` | `gates:secrets` (7B-T7) exit 0 sobre `scripts/deploy`; `--dry-run` lista las 6 instancias con sus theme IDs de BOARD §14 |
| Dueños | Igual que 7B: emite Gemini (`CLAUDE-DIRECTIVE-7B-001`), implementa Claude, audita GPT (`GPT-AUDIT-023-higiene-7b` añade: ZIP, peso, evidencias), verifica Gemini, commitea y despliega Gemini. La reescritura (F0-02) la ejecuta Gemini con autorización escrita de Johandry, entre 7B y 7C |
| Ledger | A `L-09` ("Paquete limpio verificado por `.shopifyignore` y `gates:package`") cambiarle la redacción: "Paquete limpio generado por `scripts/package-theme.mjs` y verificado contra lista blanca". Nueva `L-11` "Repositorio sin evidencias crudas ni secretos; Download ZIP menor de 10 MB" (fuente: higiene, BOARD §4.5), `cumplido` con `gates:weight` y `git archive` como evidencia |
| Esfuerzo | Sube de 2 a 3 días de Claude a 3 a 4; Gemini 1 día más la ventana de reescritura (medio día) |

## 10. Decisiones para Johandry

| # | Decisión | Opciones | Recomendación |
|---|---|---|---|
| D1 | Estructura | A) un repo, tema en raíz, herramientas en `tools/`; B) dos repos con submódulo o subtree | A |
| D2 | Dónde van las evidencias crudas (267 MB hoy, y las que vengan) | repo `sartorial-evidence`; adjuntos de Releases; Git LFS; solo disco local | Repo aparte con la misma jerarquía |
| D3 | Reescribir el historial con `git filter-repo` | ahora (ventana entre 7B y 7C) o nunca | Ahora: `.git` de 218 MB a unos 6 a 10 MB y fuera las cookies de ff3dca1 y 080402c. Exige rotar credenciales antes y reclonar después |
| D4 | `AGENTS.md` | mantener la guía interna en raíz y excluirla del ZIP y del push (0 cambios en RULES); o además publicar un `AGENTS.md` para las IA del comerciante | Mantener interna; nada público por ahora |
| D5 | Notas de versión | `release-notes.md` en minúsculas (viaja en el ZIP, lo lee el comerciante) o `RELEASE-NOTES.md` interno | Minúsculas y redactado para el comerciante, porque es para lo que Shopify lo empaqueta; el registro técnico sigue en BOARD |
| D6 | Scripts de despliegue de `scratch/` | versionarlos en `scripts/deploy/` sin secretos o dejarlos en la laptop | Versionarlos; hoy el despliegue de 6 temas no es reproducible |
| D7 | Integración de GitHub | conectar `master` a una tienda, o seguir con `theme push --nodelete` | Seguir con push desde `scripts/deploy/`; si se conecta algo, solo la tienda de desarrollo y una rama por tienda |
| D8 | `export-ignore` en `.gitattributes` para `agent-comms/` y `tools/` | sí (Download ZIP de 0,7 MB, solo tema y tooling) o no (4,4 MB con todo) | No por ahora: compartir el repo con otra IA suele requerir BOARD y RULES; 4,4 MB ya cabe en cualquier sitio |
| D9 | `.agents/teamwork` (90 briefs de las auditorías 360) | archivar en `agent-comms/archive/teamwork-audit360/` o borrar | Archivar; pesa 496 KB |

## Anexo: comandos y resultados de la verificación en copias

```
# estructura y pesos (diseno/objetivo tras los movimientos)
du -sh --exclude=node_modules .        -> 26M (antes 285M); tras exportar lh-*.json 18,7M
git ls-files | wc -l                   -> 1565 archivos, 14,9 MB según gates:weight
git archive --format=zip HEAD          -> 4,4 MB (antes 250,2 MB); con export-ignore 0,7 MB
du -sh ../evidence-export              -> 259M, 621 archivos

# compuertas
gates:json hooks sanity locales ledger theme-check syntax weight package -> exit 0 las nueve
npm run gates:static                   -> exit 0
npx shopify theme check                -> 92 files inspected with no offenses found
playwright test --list                 -> Total: 2 tests in 1 file

# paquete
npm run gates:package                  -> Staged 93 files... ZIP: 93 files, 335 KB... Manifest OK
diff old.lst new.lst                   -> "< AGENTS.md" (única diferencia con el ZIP actual de 94 archivos)
prueba negativa (DESIGN.md, preview.png, listing.json en el árbol)
  npm run gates:package                -> limpio
  shopify theme package a pelo         -> AGENTS.md DESIGN.md listings/sartorial/listing.json listings/sartorial/preview.png

# historial (clon en diseno/fr/repo, 49 commits disponibles)
git filter-repo --force --invert-paths --paths-from-file paths.txt
  size-pack 219,46 MiB -> 5,96 MiB ; du -sh .git 218M -> 6,4M
```
