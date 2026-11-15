# Auditoria 360 archivada de la raiz

Movida desde la raiz del repositorio con `git mv` (2026-11-15). Nada de aqui forma parte del tema.

| Antes | Ahora |
| --- | --- |
| `harness-AUDIT-360-001/` | `agent-comms/archive/audit-360/harness-AUDIT-360-001/` |
| `harness-AUDIT-360-002/` | `agent-comms/archive/audit-360/harness-AUDIT-360-002/` |
| `cobertura-360-002.csv` | `agent-comms/archive/audit-360/cobertura-360-002.csv` |
| `.agents/teamwork/` | `agent-comms/archive/audit-360/teamwork/` |

`.agents/` queda ignorado por `.gitignore` y ya no tiene archivos rastreados. `generate-cobertura.mjs` escribe `cobertura-360-002.csv` y `setup-role-workspaces.mjs` escribe `.agents/teamwork/audit360-002` relativos a `cwd`: ejecutarlos desde esta carpeta recrea ahi la salida, no en la raiz.

## Advertencias

- Los arneses usan `process.cwd()` y rutas relativas o literales de la raiz del repo (por ejemplo `harness-AUDIT-360-002/aggregate-cwv-full.mjs:4`, `generate-cobertura.mjs:198`, `verify-rule10.mjs:26`). Tras el movimiento hay que ejecutarlos con `cwd` en su carpeta nueva o ajustar esas rutas en una copia de trabajo.
- Los hashes fijados (por ejemplo `D28_RUNNER_SHA256` `103c1551fc1d639e93a882900885ba9283d8c260d49c938543d6299ac1a4292f` de `run.mjs`) NO cambian: el contenido de los archivos no cambia, solo su ruta. `git mv` conserva el historial (`git log --follow`).
- Los informes de `agent-comms/` que citan las rutas antiguas son evidencia historica y no se reescriben: usa la tabla de arriba para localizar el archivo.
- Origen de la decision: `agent-comms/outbox-claude/PLAN-LIMPIEZA-REPO-20261114.md` (clases C-3 y C-4, opcion A').
