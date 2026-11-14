# REVIEW-C01-003 · Verificación final del harness C-01 (commit 765fb72, rama task/c01)

Revisor: Claude (subagente, solo lectura). Fecha: 2026-11-10. Worktree `wt-c01`, HEAD `765fb72`, árbol limpio antes y después. No se ejecutó nada contra Shopify. Rutas relativas a `agent-comms/outbox-claude/harness-C-01-ID-001/`. Referencia: condiciones D1 y D2 de REVIEW-C01-002.md.

## Veredicto

**ACEPTADO.** D1 y D2 quedan cerradas. Con esto, las condiciones C1 a C5 (REVIEW-C01-001) y D1 a D2 (REVIEW-C01-002) están cerradas.

## D1 · exclusión explícita

Cerrada. `DELETE_EXCLUDED_IDS` fija 190232297715, 190232330483 y 190232363251 (lib.mjs:142). También queda protegido cualquier ID con rol `main` o `live` en cualquiera de las listas, la final o las previas (lib.mjs:143, 150-151, 156). El README la documenta y pide comprobarla a ojo antes de cada delete (README.md, sección «Limpieza de las previews temporales», pasos 2 y 3).

## D2 · ID preexistente no borrable

Cerrada. Hay una lista previa por preset, `list-0-<preset>.json`, que no se sobrescribe, y `ledger.jsonl` es acumulado. `deleteCandidates` rechaza cualquier ID que figure en la lista previa de su preset, y también cuando falta esa lista (lib.mjs:159-161). Además exige el nombre del procedimiento (lib.mjs:144, 158) y que el ID aparezca una sola vez en la lista final, con el mismo nombre y rol `unpublished` (lib.mjs:162-167).

## cleanup-check.mjs

Solo lee archivos: no importa `child_process`, no invoca el CLI y no borra nada (cleanup-check.mjs:10-12). Sale con 2 si faltan `--dir`, `ledger.jsonl` o `list-final.json` (cleanup-check.mjs:17-19, 26-29, 37-40). Sale con 1 si alguna entrada no es borrable (cleanup-check.mjs:43).

## Pruebas propias

Probé 13 casos contra `deleteCandidates`. Las dos entradas legítimas salen `BORRABLE`. Salen `NO_BORRAR`:

- las tres previews excluidas, incluso renombradas a `C01 serial …` o sin lista previa;
- un tema `live` y uno con rol `main`;
- un tema con nombre C01 que ya existía antes del push;
- un temporal de Sartorial apuntado bajo Imprint;
- una entrada sin lista previa;
- un ID con cero inicial, uno con espacio y uno con nombre ajeno;
- un ID duplicado en la lista final.

También probé `cleanup-check.mjs` de punta a punta: con 190232363251 en el ledger y nombre válido devuelve `NO_BORRAR`, exit 1. Sin argumentos sale con 2.

## Ejecuciones

`node --check` en los 8 `.mjs`: sin errores. `node synthetic.mjs`: exit 0. `node selftest.mjs`, sin variables de Shopify ni contraseña: 48/48, exit 0. `git status` vacío.

## Observación menor (no bloquea)

El paso 4 de la limpieza compara el resto de la lista con `list-0-sartorial.json`. Es correcto, porque es la lista más antigua, pero el README no dice por qué se usa esa.
