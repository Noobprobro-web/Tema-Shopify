ID: CLAUDE-DECISION-LOTE-0-002
Fecha de comunicación de Johandry: 2026-11-04
Fecha de registro: 2026-11-04
Estado: Registrado
Decisión requerida: Ninguna. Resuelve los bloqueos 1, 2, 4 y 5 de `CLAUDE-CLOUD-STATUS.md`; los bloqueos 3 y 6 siguen abiertos.
Resumen en 5 líneas:
1. D20: Antigravity subió la R-0, la ficha y su método de empaquetado a la rama (commit `1c7aec0`); se hizo pull y se usan.
2. D21: el empaquetador determinista se publica en `scripts/`; el SHA-256 canónico será el de dos generaciones idénticas; `79ff3961…` pasa a referencia histórica no reproducible.
3. D22: sin credenciales se avanza solo en lo que no necesita tienda; el Lote A se trabaja en la rama `lote-a`.
4. D23: D-01, D-01-N y D-01-L se limitan a entregables en el repo; C-02, C-04-R y C-04-P según lo indicado.
5. D24: `BOARD.md` pasa a escritor único Claude, revisado por un subagente Opus de contexto limpio.
Archivos tocados: este archivo (nuevo) y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md` (modificado).
Desviaciones (Nivel 1 o Nivel 2): Ninguna. Registro documental; ninguna fila de `docs/requirements-ledger.md` se modifica o cierra. D24 cambia la regla de `AGENTS.md`/`RULES.md` sobre `BOARD.md` solo en cuanto al escritor, por decisión expresa de Johandry.
Hallazgos extra fuera de alcance (con parche listo): Ninguno con parche. Hallazgo de verificación: `agent-comms/outbox-gemini/package-reproducible-zip.py` no reproduce el hash que declara (ver «Verificación»).
Verificación (comando, resultado y qué demuestra/qué no): Ver sección «Verificación». No demuestra que las condiciones C-R0-3 y C-R0-4 se cumplan ni nada sobre las tiendas.
Lista de afirmaciones falsables numeradas:
1. Antes del pull, HEAD era `121d50faf8f588f36a7ff82f041c0d63da39dbac`, con el árbol limpio; `origin/lote0/base-09f8342` estaba en `1c7aec07e4ac96a80331d337a1d85a1a84376d15`, y el avance fue fast-forward.
2. El único commit nuevo es `1c7aec0` (autor Noobprobro-web, «Lote 0: review R0-002, ficha base 001 y script de empaquetado reproducible Sartorial ZIP») y añade 3 archivos, todos en `agent-comms/outbox-gemini/`: `GEMINI-REVIEW-LOTE-0-R0-002.md` (179 líneas), `GEMINI-FICHA-LOTE-0-BASE-001.md` (265 líneas) y `package-reproducible-zip.py` (167 líneas).
3. El commit que añade este archivo contiene exactamente 2 rutas: este archivo (añadido) y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md` (modificado).
4. Este registro contiene cinco decisiones, D20 a D24.
5. La fecha fija propuesta en D21 para la revisión actual es la fecha de committer UTC de `91f6e9f`: 2026-11-04 14:48:42 (`git log -1 --format=%ct HEAD -- assets config layout locales sections snippets templates listings` = 1793803722).
6. Ejecutar `package-reproducible-zip.py` desde HEAD (`--dest` fuera del repo) produce 289834 bytes y SHA-256 `3629d9d4217caa0c49d07935fc642aa101a8a8a17b7ce66e4346a84e316fc44e`, no `79ff3961…` (288969 bytes).
7. Este archivo y `CLAUDE-CLOUD-STATUS.md` contienen 0 coincidencias del literal sensible de contraseña.
8. El conteo del literal en el árbol de trabajo es 46 coincidencias en 28 archivos (igual que antes del pull); fuera de `tests/vendor/axe.min.js` es 0 líneas con contexto de credencial; en lo publicado (`origin/lote0/base-09f8342..HEAD`) es 0.
9. Esta actuación no ejecutó ningún script gate5, no contactó tiendas, no abrió `.secrets`, no usó force, no tocó master ni otras ramas y no abrió PR.
10. `origin/master` sigue en `09f834295074402d9b93aa8ead83a732d78e6608` tras el push.

# Decisión de Johandry / Ruiz Digital (comunicada el 2026-11-04)

Autor de la decisión: Johandry / Ruiz Digital. Fecha: 2026-11-04.

Cita textual de Johandry:

> 1. Antigravity sube la R-0, la ficha y su método de empaquetado a la rama. Haz pull y úsalos.
> 2. ZIP: publica en `scripts/` tu empaquetador determinista (LF, fecha fija igual a la del commit, orden alfabético, permisos y compresión fijos). Genera el ZIP dos veces y fija ese SHA-256 como hash canónico. `79ff3961` queda como referencia histórica no reproducible; no lo persigas más.
> 3. Las credenciales llegan en una sesión nueva. Mientras tanto, avanza solo en lo que no necesita tienda.
> 4. D-01, D-01-N y D-01-L: prepara los entregables (CSV de importación, menús, lista de fotos, idioma) y detente para que Johandry los importe. C-02: la tienda limpia la crea Johandry. C-04-R: redacta la versión y las notas para que Johandry las apruebe al final. C-04-P: retira las plantillas de documentación del paquete y consérvalas en el repo.
> 5. BOARD.md lo escribe Claude como único escritor y lo revisa el subagente Opus.

## D20. R-0, ficha y método de empaquetado en la rama

Antigravity subió a la rama la R-0 (`GEMINI-REVIEW-LOTE-0-R0-002.md`), la ficha (`GEMINI-FICHA-LOTE-0-BASE-001.md`) y su empaquetador (`package-reproducible-zip.py`) en `1c7aec0`. Se hizo pull y se usan como insumo. Resuelve el bloqueo 1 de `CLAUDE-CLOUD-STATUS.md`. Resumen fiel en la sección «Contenido del pull».

## D21. Empaquetador determinista y hash canónico

Publicar en `scripts/` un empaquetador determinista propio (LF, fecha fija, orden alfabético, permisos y compresión fijos). Generar el ZIP dos veces y fijar ese SHA-256 como hash canónico. `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f` queda como referencia histórica no reproducible y no se persigue más. Resuelve el bloqueo 2.

Nota de interpretación del coordinador (no es cita de Johandry): «fecha fija igual a la del commit» se interpreta como la fecha de committer (UTC) del último commit que modificó las rutas empaquetadas en la revisión empaquetada (`git log -1 --format=%ct <rev> -- <rutas>`), para que el hash no cambie con commits que solo tocan documentación. El ZIP se genera desde los blobs de git (LF), no desde el árbol de trabajo.

## D22. Trabajo sin tienda hasta recibir credenciales

Las credenciales llegan en una sesión nueva; mientras tanto se avanza solo en lo que no necesita tienda.

Nota de interpretación del coordinador (no es cita de Johandry): mientras no haya credenciales, el cierre del Lote 0 queda pendiente de C-R0-3 (previews) y C-R0-4 (fixture). El trabajo de código del Lote A que no necesita tienda se hace en la rama `lote-a`, creada desde la cabeza de `lote0/base-09f8342`; si el Lote 0 recibe commits posteriores, se integran en `lote-a` con merge sin force. Las pruebas de tienda de cada tarea quedan como «código completo» (máximo sin medición en tienda, según el plan) hasta la sesión con credenciales. Resuelve el bloqueo 4 en cuanto a qué hacer mientras tanto; los bloqueos 3 y 6 siguen.

## D23. Tareas con escritura en tienda

Nota de interpretación del coordinador (no es cita de Johandry): D-01, D-01-N y D-01-L se limitan a entregables en el repo (CSV de importación, menús, lista de fotos, idioma; sin escritura en tiendas) y parada para que Johandry los importe. C-02 depende de la tienda limpia que crea Johandry. C-04-R entrega borrador de versión y release notes pendiente de aprobación final de Johandry. C-04-P excluye `templates/page.documentation.json` y `templates/page.support.json` del ZIP sin borrarlas del repo.

## D24. BOARD.md

`BOARD.md` pasa a tener a Claude como escritor único, con revisión por un subagente Opus de contexto limpio. Cambia la regla de `AGENTS.md` y `RULES.md` sobre `BOARD.md` solo en cuanto al escritor. Resuelve B3 y el bloqueo 5.

# Contenido del pull

Commit nuevo: `1c7aec0` (Noobprobro-web), 3 archivos añadidos, 611 líneas, todos en `agent-comms/outbox-gemini/`.

## R-0: `GEMINI-REVIEW-LOTE-0-R0-002.md`

- Dictamen: ACEPTADO CONDICIONAL. Revisión adversarial de solo lectura de `bd779a0` y `fbdf462` frente a `09f8342`.
- Aprobado: criterios C1 a C8 de 0-05-P3 (fallback de credencial eliminado, validación fail-closed antes de red sin eco de valores, nombres de variables, git acotado a la rama, ámbito de escritura, escritor exclusivo, rotación M2 humana, entrega con P1 a P7). Diff contra `09f8342` solo con rutas autorizadas (3 arreglos en `assets/`, copy de `listings/sartorial/templates/index.json`, dos `scripts/gate5-*.mjs`, documentación).
- Seguridad: literal sensible en 0 líneas añadidas por `bd779a0`/`fbdf462`; 46 coincidencias en 28 archivos del árbol (1 en `tests/vendor/axe.min.js`, 45 en SVG y fixtures históricos); 0 con contexto de credencial fuera de axe; 0 en scripts gate5 y en los 93 archivos del tema. Sin conexión a tiendas.
- Observación: `master` local en `19190b1` está rezagado respecto de `origin/master` (`09f8342`); recomienda alinearla, sin push.
- Condiciones para el cierre del Lote 0 y apertura del Lote A: (a) ficha formal `FICHA-LOTE-0-BASE`; (b) ZIP regenerable con hash reproducible y política de `listings/`; (c) fixture de suscripción (producto con `requires_selling_plan=true`, grupos de planes y app; `qa5a-f06-subscription` no tiene grupos activos); (d) previews de Imprint y Archive acreditadas con URLs limpias; (e) hallazgo adicional: `scripts/gate5-complete-verification.mjs:88` imprime «Acceso al storefront concedido» sin comprobar que `input[type="password"]` ya no exista; debe corregirse antes de reutilizarlo como evidencia de tienda.

## Ficha: `GEMINI-FICHA-LOTE-0-BASE-001.md`

- SHA base auditado: `fbdf462af5254c28ad852fc166e5a44bcc4c2240` (comparación contra `09f8342`); worktree `isolated-sartorial-lote0-09f`, limpio.
- Árbol: 93 archivos de tema (assets 3, config 2, layout 2, locales 3, sections 35, snippets 21, templates 18, `listings/` 9: archive, imprint y sartorial con 3 plantillas cada uno).
- Manifest: tabla de los 93 archivos con bytes y SHA-256 en LF (blob de git) y en CRLF (disco Windows).
- Política EOL: LF canónico; los 93 blobs de git están en LF; el worktree de Windows materializa CRLF por `core.autocrlf=true`; el ZIP debe empaquetar LF desde los blobs o normalizando.
- Hashes declarados: ZIP canónico LF `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f` (288.969 bytes, 93 entradas, dos corridas idénticas); variante CRLF `16467c9f9f769acd91f0e46704776f4d926c815a2f853b76c591c96ac922052d` (290.883 bytes). Ubicaciones en rutas de Windows fuera del repo (`C:\Users\Johan\releases\`, `C:\Users\Johan\audit-gemini\dist\`), que no están en este clon.
- Verificaciones declaradas: Theme Check «90 files inspected with no offenses found»; `node --check` válido en `theme.js` y `product-zoom.js`; JSON parseable. Dictamen «certificado y concluido» con condiciones (a) y (b) de la R-0 satisfechas.

## Método de empaquetado: `package-reproducible-zip.py`

- Herramienta: script Python con `zipfile`. Origen de datos: blobs de git de `HEAD` (`ls-tree -r` + `cat-file blob`) con fallback al disco normalizado a LF; exige exactamente 93 archivos.
- Inclusiones: rutas bajo `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`, `listings/`. Exclusiones: todo lo demás (`agent-comms/`, `scripts/`, `tests/`, `docs/`, etc.).
- Parámetros: orden alfabético; fecha fija (2026, 11, 4, 15, 42, 7) (fecha de autor de `fbdf462`); `create_system=3`; `external_attr=0o100644<<16`; Deflate nivel 9; sin entradas de directorio. Opciones: `--repo-root`, `--dest`, `--crlf-variant`, `--verify-only`.

# Verificación

Comandos ejecutados (sin red hacia tiendas), desde la raíz del repositorio:

```text
git rev-parse HEAD ; git status --porcelain | wc -l
-> 121d50faf8f588f36a7ff82f041c0d63da39dbac ; 0

git fetch origin lote0/base-09f8342 ; git merge --ff-only origin/lote0/base-09f8342
-> fast-forward a 1c7aec07e4ac96a80331d337a1d85a1a84376d15

git diff --name-status HEAD~1 HEAD
-> A agent-comms/outbox-gemini/GEMINI-FICHA-LOTE-0-BASE-001.md
   A agent-comms/outbox-gemini/GEMINI-REVIEW-LOTE-0-R0-002.md
   A agent-comms/outbox-gemini/package-reproducible-zip.py

git log -1 --format='%ct %cI' HEAD -- assets config layout locales sections snippets templates listings
-> 1793803722 (91f6e9f, 2026-11-04 14:48:42 UTC)

python3 agent-comms/outbox-gemini/package-reproducible-zip.py --repo-root . --dest <ruta fuera del repo>
-> 93 archivos; 289834 bytes; SHA-256 3629d9d4217caa0c49d07935fc642aa101a8a8a17b7ce66e4346a84e316fc44e; "HASH NO COINCIDE" frente a 79ff3961…
```

Hallazgo: el script de Antigravity, ejecutado sin modificar en este entorno, no reproduce el tamaño ni el hash que declara la ficha (289834 contra 288969 bytes). Coincide con D21 («`79ff3961` queda como referencia histórica no reproducible»). El empaquetador propio de D21 fijará el hash canónico y sustituye a la constante `CANONICAL_SHA256` del script de Antigravity, que no se modifica. Además, el script usa la fecha de autor de `fbdf462` (15:42:07 UTC), que corresponde a un commit solo documental; D21 fija la fecha del último commit que toca las rutas empaquetadas.

Qué demuestra: el contenido del pull, el estado de partida y que el script de Antigravity no reproduce su hash en este entorno.

Qué no demuestra: que la causa sea la versión de Python o de zlib (no se investigó, por D21); que C-R0-3 y C-R0-4 se cumplan; ni el estado de las tiendas.
