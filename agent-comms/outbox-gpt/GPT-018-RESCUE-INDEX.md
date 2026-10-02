# GPT-018-RESCUE-INDEX: que se rescato del worktree de GPT y que sigue en riesgo

```text
ID: GPT-018-RESCUE-INDEX
Fecha: 2026-10-02
Ejecutor: Claude (Opus 5, 1M context)
Origen: C:\Users\Johan\.codex\worktrees\2482\Tema Shopify
Commit del worktree: 60599ab199ec7214c4206a6db6fff0f8161289d0 (detached HEAD)
  "chore(protocol): handoff leadership to Claude (CLAUDE-HANDOFF-LEAD-001)", 2026-09-30
Destino: agent-comms/outbox-gpt/ del repositorio principal
Rescatado:  86 archivos de texto, 783315 B (0.75 MB)
Sin copiar:  126 binarios, 51457945 B (49.07 MB) -> SIGUEN SOLO EN EL WORKTREE
Commits creados: NINGUNO. Worktree modificado: NO.
```

## 1. Que paso

Los entregables de la auditoria comercial **GPT-018** (29 grupos de hallazgos, 9 roles) existian
**unicamente** como archivos untracked dentro de un git worktree alojado en
`C:\Users\Johan\.codex\worktrees\2482\`. Ese prefijo `.codex/` esta en el `.gitignore` del
proyecto, y los propios entregables nunca se anadieron al indice: no existia ninguna copia en el
repositorio principal ni ningun blob en el historial. Un `git worktree prune` los habria borrado
sin dejar rastro.

Este rescate copio el **registro textual completo** al repositorio principal. Dejo atras los
binarios, por decision deliberada y documentada (seccion 4).

## 2. Lo que se copio

`86` archivos, todos **nuevos** en el principal: ninguno sobrescribio nada. Extensiones rescatadas:
`.md`, `.json`, `.txt`, `.diff`, `.csv`, `.mjs`, `.jsonl`.

| Tipo | Archivos | Peso |
|---|---:|---:|
| `.json` | 43 | 570.2 KB |
| `.md` | 20 | 134.1 KB |
| `.txt` | 12 | 21.6 KB |
| `.mjs` | 9 | 24.7 KB |
| `.csv` | 1 | 13.8 KB |
| `.diff` | 1 | 0.6 KB |
| **TOTAL** | **86** | **765.0 KB** |

### Los entregables de cabecera

| Archivo | Bytes | Que es |
|---|---:|---|
| `GPT-REPORT-018-multiagent-commercial-audit.md` | 21015 | El informe maestro de la auditoria: los 29 grupos de hallazgos. |
| `GPT-018-fixes-ready.md` | 5387 | Los arreglos listos para aplicar que salieron de la auditoria. |
| `GPT-018-theme-store-listing.md` | 8288 | Borrador del listing para el Shopify Theme Store. |
| `role-01-buyer.md` | 8651 | Rol 01, recorrido de compra de punta a punta. |
| `role-02-benchmark.md` | 6992 | Rol 02, comparativa contra temas de referencia. |
| `role-03-merch.md` | 11297 | Rol 03, merchandising y catalogo. |
| `role-09-a11y.md` | 5168 | Rol 09, accesibilidad. |

### `harness-GPT-018/` por rol

| Carpeta | Archivos de texto rescatados | Peso | Que contiene |
|---|---:|---:|---|
| `harness-GPT-018/` | 1 | 11.3 KB | El brief de contexto de la auditoria. |
| `harness-GPT-018/adversarial/` | 3 | 17.1 KB | Revision adversarial cruzada: matriz de hallazgos y revision externa del rol 09. |
| `harness-GPT-018/role-01-buyer/` | 35 | 352.7 KB | Resultados JSON del recorrido de compra en las 3 tiendas y los scripts `.mjs` que lo ejecutan. |
| `harness-GPT-018/role-02-benchmark/` | 1 | 0.7 KB | Fuentes de la comparativa. |
| `harness-GPT-018/role-03-merch/` | 1 | 7.9 KB | Inventario del catalogo. |
| `harness-GPT-018/role-04-art/` | 13 | 96.8 KB | Manifest de 33 pares producto-acabado (CSV + JSON), prompts, dimensiones, instrucciones de asociacion en admin y validaciones. |
| `harness-GPT-018/role-05-copy/` | 8 | 20.7 KB | Volcados de copy de home y PDP de las 3 tiendas, mas las correcciones EN/ES. |
| `harness-GPT-018/role-06-merchant/` | 2 | 8.5 KB | Informe del rol 06 y el diff de las URL de soporte publicas. |
| `harness-GPT-018/role-07-listing/` | 2 | 2.9 KB | Informe del listing y el control de longitudes. |
| `harness-GPT-018/role-08-legal/` | 3 | 8.6 KB | Informe legal y la evidencia local (incluida la busqueda de GSAP). |
| `harness-GPT-018/role-09-a11y/` | 10 | 172.3 KB | Resultados JSON de axe y de los recorridos de teclado en las 3 tiendas, mas los `.mjs` del arnes. |

### Verificacion de integridad

| Chequeo | Resultado |
|---|---|
| Archivos planificados vs copiados | 86 / 86 |
| sha256 destino == sha256 origen | **86 / 86** |
| Tamano en bytes identico | 86 / 86 |
| Finales de linea preservados verbatim | 86 / 86 |
| `.json` / `.jsonl` que siguen parseando | 43 / 43 |
| Fechas de modificacion preservadas | 86 / 86 |
| Copias capturadas por `.gitignore` | 0 |

La copia se hizo a nivel de bytes (`readFileSync` / `writeFileSync` sin decodificar), asi que los
finales de linea originales sobreviven intactos. Vale la pena anotarlo porque el conjunto es
mixto: 53 archivos en LF, 12 en CRLF, 15 con finales mezclados dentro del mismo
archivo y 6 sin ningun salto de linea. Una normalizacion habria alterado el sha256 de la
mayoria y habria roto la trazabilidad contra el origen.

## 3. Conflictos

**Ninguno de los 86 archivos rescatados existia ya en el principal.** Cero sobrescrituras, cero
archivos `.from-worktree` creados.

Dicho eso, la comparacion de los dos `agent-comms/outbox-gpt/` completos encontro **94 archivos
que existen en ambos con sha256 distinto**, y conviene dejar por escrito por que no se tocaron:

| Clase | Archivos | Diagnostico | Accion |
|---|---:|---|---|
| Solo en el worktree, textual | 86 | Entregables de GPT-018. No hay copia en el principal. | **Copiados** |
| Solo en el worktree, binario | 126 | Capturas y JPG fuente. 49.07 MB. | Inventariados, no copiados |
| En ambos, identicos | 7 | Ya estaban. | Ninguna |
| En ambos, sha distinto | 94 | **Solo difieren en los finales de linea.** | **Ninguna** |
| Solo en el principal | 3 | Posteriores al commit del worktree. | Ninguna |

Los 94 se verificaron uno a uno normalizando CRLF a LF antes de rehacer el hash: **los 94 quedan
identicos, con 0 diferencias reales de contenido.** El patron es uniforme y tiene una causa
mecanica: son archivos **trackeados** que el worktree tiene en el indice con CRLF y el principal
con LF; ambos arboles estan limpios respecto a `60599ab`, asi que la divergencia la introduce la
conversion de finales de linea en el checkout, no ninguna edicion.

Por eso **no** se crearon 94 copias `.from-worktree`. La regla que las exigia protege contenido
distinto, y aqui no hay contenido distinto que proteger: habrian sido 94 archivos de ruido que
enterrarian los 86 que si importan. Queda anotado para que Johandry pueda discrepar; la lista
completa de los 94 esta reproducible con un recorrido de los dos arboles.

Nota aparte: los **14 `.patch`** del worktree (`GPT-AUDIT-4B-005-artifacts/F0*.patch`,
`GPT-AUDIT-4B-007-artifacts/patches/R0*.patch`) caen fuera de la lista de extensiones a rescatar.
No importa: los 14 ya existen en el principal, y su unica diferencia es tambien el final de linea.
No se perdio ningun parche.

## 4. Lo que se dejo atras, y donde sigue

**126 archivos binarios, 49.07 MB**, siguen existiendo **solo** en
`C:\Users\Johan\.codex\worktrees\2482\Tema Shopify\agent-comms\outbox-gpt\harness-GPT-018\`.

| Tipo | Archivos | Peso |
|---|---:|---:|
| `.png` | 105 | 43.17 MB |
| `.jpg` | 16 | 5.88 MB |
| `.html` | 3 | 0.02 MB |
| `.ps1` | 2 | 0.00 MB |
| **TOTAL** | **126** | **49.07 MB** |

Cada uno esta inventariado con ruta, tamano y **sha256** en
[`harness-GPT-018/SCREENSHOTS-MANIFEST.md`](harness-GPT-018/SCREENSHOTS-MANIFEST.md). Asi el
registro de la auditoria queda completo aunque las imagenes no esten: cualquier informe que cite
una captura se puede seguir leyendo, y si el archivo reaparece en otra copia su sha256 lo
identifica sin ambiguedad.

No se copiaron porque meter 49.07 MB en el indice de un tema que va al Theme Store es una
decision sobre el peso permanente del repositorio, y le corresponde a Johandry. El manifest
propone cuatro opciones y recomienda una.

## 5. `demo-assets/`: no se toco, se documento

Hay **dos arboles `demo-assets/` distintos**, uno en cada lado, y **ambos estan ignorados por
git**, asi que ninguna sobrescritura seria recuperable.

| | Arbol principal | Arbol del worktree |
|---|---|---|
| Archivos | 86 | 64 |
| Peso | 75.71 MB | 235.32 MB |
| Generacion | GPT-016 / GPT-017 / M-03 | GPT-018 rol 04 |
| Formato | JPEG sRGB 2000x2500 optimizado | PNG en bruto + `*-original.png` nativos |
| Exclusivo | `images/` (36 JPG), `capturas/` (11 PNG) | `atelier/` entera, heroes sin marca, 33 pares por acabado |

El hallazgo que cambia el riesgo: **solo colisionan 2 rutas**, y las dos son `PROVENANCE.md`
(`archive/` y `edition/`). **Ninguna imagen colisiona con otra imagen.** Los dos arboles son en
gran medida complementarios, no rivales. Pero los dos `PROVENANCE.md` de cada par describen
conjuntos de imagenes **disjuntos**, asi que un `cp -r` en cualquier direccion borraria la unica
documentacion de procedencia de 26 imagenes o de 33 pares mas 3 heroes.

El analisis completo, con el inventario de los dos lados, los sha256 de los 7 archivos de
procedencia y una propuesta de reconciliacion, esta en
[`DEMO-ASSETS-DIVERGENCE.md`](DEMO-ASSETS-DIVERGENCE.md).

## 6. Aviso: GPT-018 audito un estado del tema que ya no es el actual

El worktree esta en `60599ab`, que **es tambien el HEAD del principal**. La auditoria no se quedo
atras en commits: se quedo atras en **trabajo sin commitear**. El working tree del principal lleva
encima dos olas de cambios que GPT-018 nunca vio, ninguna de las dos en el historial:

- **LEAD-001** (primera ola, `CLAUDE-REPORT-LEAD-001.md`): docs y soporte publicados en un repo
  aparte con GitHub Pages y el schema reapuntado, `support.html` migrado de `mailto:` a Formspree,
  tres afirmaciones falsas corregidas en `docs.html`, y las directivas de imagen que produjeron
  las 13 fotos de Edition y las 12 de Archive.
- **MOTION-002** (segunda ola): **GSAP retirado por completo** (-125.737 B de JS) y sustituido por
  CSS scroll-driven nativo. Codigo completo y trazado en el ledger, pero **sin certificar**: sin
  verificacion en storefront vivo y sin Safari.

Consecuencias practicas al leer los entregables rescatados:

1. Un hallazgo de GPT-018 sobre `assets/theme.js`, sobre animacion o sobre GSAP puede estar
   **obsoleto o desplazado**: MOTION-002 borro `assets/motion.js` y reescribio el motor. El propio
   BOARD documenta una fila del ledger que bajo de `cumplido` a `codigo completo` porque su
   evidencia citaba un archivo que ya no existe.
2. Un hallazgo sobre las URL de documentacion o soporte, o sobre el formulario de contacto, puede
   estar **ya resuelto** por LEAD-001.
3. `GPT-018-fixes-ready.md` debe revalidarse contra el working tree actual **antes** de aplicarse.
   Un parche preparado contra `60599ab` limpio no tiene por que aplicar sobre dos olas de cambios
   sin commitear.

Nada de esto invalida la auditoria. Los 29 grupos de hallazgos siguen siendo el unico registro de
ese trabajo. Solo significa que **la fecha importa** al leerlos.

## 7. Pendiente de decision humana

| # | Decision | Riesgo si no se decide |
|---|---|---|
| 1 | Que hacer con los 126 binarios (49.07 MB) del manifest | **Se pierden al limpiar el worktree.** Es lo unico con fecha de caducidad. |
| 2 | Que hacer con el arbol `demo-assets/` del worktree (64 archivos, 235.32 MB), incluida `atelier/` que el principal no tiene | **Se pierde al limpiar el worktree.** Ignorado por git, sin respaldo. |
| 3 | Commitear o no los 86 archivos rescatados | Estan en disco y visibles en `git status`, pero **aun sin commitear**: siguen dependiendo de este working tree. |
| 4 | Confirmar que los 94 archivos con diferencia de solo-final-de-linea no necesitan copia `.from-worktree` | Ninguno. Es una confirmacion, no un riesgo. |
| 5 | Revalidar `GPT-018-fixes-ready.md` contra el working tree actual | Aplicar un parche de `60599ab` sobre LEAD-001 + MOTION-002 sin revisar. |

**El orden importa.** Las decisiones 1 y 2 caducan cuando alguien limpie el worktree; las otras
tres no caducan. Mientras el worktree siga en pie, nada esta perdido todavia.

## 8. Lo que este rescate NO hizo

- **No escribio nada en el worktree.** `git status --porcelain` del worktree es identico antes y
  despues: los mismos 8 entradas untracked.
- **No creo ningun commit.** El working tree del principal traia ~63 entradas de otro trabajo en
  curso; ninguna se toco.
- **No toco `demo-assets/`** en ninguno de los dos arboles. Solo lectura.
- **No toco** `agent-comms/outbox-claude/`, `agent-comms/BOARD.md`, `docs/requirements-ledger.md`
  ni `.theme-check.yml`.
- Todo lo escrito vive bajo `agent-comms/outbox-gpt/`.

## 9. Archivos generados por este rescate

| Archivo | Que es |
|---|---|
| `agent-comms/outbox-gpt/GPT-018-RESCUE-INDEX.md` | Este indice. |
| `agent-comms/outbox-gpt/DEMO-ASSETS-DIVERGENCE.md` | Los dos arboles `demo-assets/`, sus sha256 y la reconciliacion propuesta. |
| `agent-comms/outbox-gpt/harness-GPT-018/SCREENSHOTS-MANIFEST.md` | Los 126 binarios no copiados, con sha256. |

Mas los 86 entregables de GPT-018 copiados tal cual, listados en la seccion 2.
