ID: CLAUDE-HANDOFF-CLOUD-001
Fecha: 2026-11-04 (America/Caracas)
Autor: Claude (lectura y redacción; sin edición del tema, scripts, plan ni refs)
Para: sesión de Claude Code en la nube sin contexto previo.

# 1. Proyecto

Sartorial v1.0.0 es un tema Shopify OS 2.0 que se prepara para la Shopify Theme Store.
Johandry es el dueño y la autoridad final: ninguna decisión suya se presume ni se reabre.
El trabajo sigue el plan V4.1 por lotes (Lote 0 de base, luego Lote A), con escritor, revisor y coordinador separados.

# 2. Documentos clave (rutas relativas a la raíz "Tema Shopify")

Plan rector: `agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md`
Auditorías: `agent-comms/outbox-claude/CLAUDE-AUDIT-THREE-THEMES-INITIAL-001.md`, `...-LIVE-001.md`, `...-MASTER-001.md`
Revisiones del plan: `agent-comms/outbox-claude/CLAUDE-REVIEW-PLAN-SARTORIAL-001.md` a `-004.md`
R-0 previa: `agent-comms/outbox-claude/CLAUDE-REVIEW-LOTE-0-R0-001.md`
R-D de 0-05-P3 (C1 a C8, P1 a P7): `agent-comms/outbox-claude/CLAUDE-REVIEW-0-05-P3-RD-001.md`
Lote 0, GPT (en `agent-comms/outbox-gpt/`): `GPT-HANDOFF-LOTE-0-RD-R0-001.md`, `GPT-DECISION-CMP-01-M2-001.md`, `GPT-REPORT-CMP-01-REDACTION-001.md`, `GPT-DECISION-LOTE-0-M2-001.md` a `-003.md`, `GPT-DECISION-LOTE-0-04-COPY-001.md`, `GPT-DECISION-LOTE-0-04-C08-001.md`, `GPT-INVENTARIO-LOTE-0-C08-001.md`, `GPT-INVENTARIO-LOTE-0-HERRAMIENTAS-001.md`, `GPT-FICHA-LOTE-0-BASE-002.md`, `GPT-REPORT-LOTE-0-BASE-001.md`, `GPT-REPORT-LOTE-0-AVANCE-002.md`, `GPT-REPORT-LOTE-0-AVANCE-003.md`
Reglas de coordinación: `agent-comms/RULES.md`, `agent-comms/BOARD.md` (BOARD sin reconciliar; solo Antigravity escribe en él)

Base de trabajo: worktree `isolated-sartorial-lote0-09f`, HEAD detached `09f834295074402d9b93aa8ead83a732d78e6608`.

# 3. Estado actual

Lote 0 abierto. Decisiones de Johandry:
M1: 2026-10-30 (A-02 y C-04-N, por chat).
M2: decidida 2026-10-31; verificada por Johandry el 2026-11-02 (clave nueva funciona, la anterior es rechazada en las 4 tiendas).
Copy Haute Couture: 2026-10-31.
C-08: 2026-11-02 (retirar o neutralizar promesas sin respaldo, sin excepciones).
CMP-01: aceptado 2026-11-02 (cero exposiciones como contraseña; 46 coincidencias legítimas en 28 archivos se conservan).

0-05-P3 (comprobado el 2026-11-04, solo lectura): A MEDIAS.
Hecho: los dos gate5 se editaron el 2026-11-02 hacia las 23:17 (Caracas), después de la R-D. Línea 5 sin `||` ni valor por defecto (C1). `validateConfiguration()` corre antes del import dinámico de playwright, de `chromium.launch` y de cualquier `goto` o `fetch`, y trata ausente, vacío y espacios como ausente (C2). Entradas por entorno: STOREFRONT_ORIGIN, STOREFRONT_THEME_ID, STOREFRONT_PASSWORD, STOREFRONT_COLLECTION_PATH, STOREFRONT_PRODUCT_PATH; sin origen, ID ni producto fijos; 3 de 3 `page.goto` con `preview_theme_id`. `node --check` exit 0 en ambos (P1). Conteos P5 en 0. Status con exactamente 8 rutas de contenido y 0 no rastreados; los 6 hashes previos intactos (P6).
Falta: no hay directiva registrada ni informe de GPT o Sol; no hay evidencia de P2, P3, P4 ni P7 (hook sin red); los nombres de variables no fueron fijados por una directiva (C3). `gate5-complete-verification.mjs` sigue imprimiendo "Acceso al storefront concedido" sin verificar el desbloqueo (fuera de alcance, anotado en la R-D).
Recomendación: continuar sobre lo que hay, no descartarlo. Nuevos SHA-256: live-verify `25724afe84778a9da44c74d4267b10b4374a9915ba54966bc6a4de9d63cfeb4a`, complete-verification `288f9ae11c6edb5a2362d7e80be00ee120406676ac3bd631e0239413eeed99dc`.

Bloqueos abiertos:
Fixture de suscripción sin planes utilizables para TT-100 y A-01.
Previews de Imprint y Archive sin acreditar.
SHA del tema MAIN sin registrar.
ZIP del candidato no demostrado como regenerable; política CRLF/LF sin fijar.
`scripts/capture-presets.mjs` con tienda e ID de tema fijos.
Ficha de Antigravity con campos PENDIENTE (origen, ID preview, rutas, identidad observada).

# 4. Siguientes pasos, en orden

1. Terminar 0-05-P3: cumplir C1 a C8 y entregar P1 a P7 con comandos y salidas, más el informe. Johandry decide si acepta a posteriori las ediciones hechas sin directiva registrada.
2. Pedir la R-0 nueva (CLAUDE-REVIEW-LOTE-0-R0-002) según §8 de la R-D.
3. Cerrar el Lote 0.
4. Aprobación explícita de Johandry antes de abrir el Lote A.

# 5. Reglas duras

Un solo escritor a la vez. El escritor era GPT (Sol). Pasar la escritura a Claude requiere autorización explícita de Johandry y que quede registrada.
Sin commit, push, publicación ni escritura en tiendas sin aprobación de Johandry.
No usar b45e913 ni c4dca23, ni publicar refs locales anteriores a la reescritura.
Ninguna contraseña, cookie ni token en archivos o logs. Solo STOREFRONT_PASSWORD desde el entorno. Ningún agente prueba credenciales. No abrir `.secrets`. Para literales, solo conteos.
No mostrar `git diff` de los dos documentos redactados por CMP-01: sus líneas eliminadas contienen el literal.
No copiar código de Sebas (SebastianDev017/atelier) ni crear metafields.
Revisor independiente distinto del escritor. Detenerse en cada decisión de Johandry.

# 6. Acceso

Remoto: `https://github.com/Noobprobro-web/Tema-Shopify.git` (origin/master = 09f8342).
Limitación: el worktree tiene 8 rutas modificadas sin commit que solo existen en local (4 de producto, 2 documentos CMP-01, 2 gate5). Un clon de GitHub no las tiene, y publicarlas exigiría commit y push, que están prohibidos sin aprobación. Para continuar 0-05-P3 o hacer la R-0, la sesión debe llegar a la carpeta local vinculando el equipo desde la app de escritorio. El repo de GitHub sirve solo para leer historia y documentos versionados.
Nota técnica: el `.git` del worktree apunta a una ruta de Windows. Desde la VM, leer git con `GIT_DIR=<raíz>/.git/worktrees/isolated-sartorial-lote0-09f`, `GIT_WORK_TREE=<raíz>/isolated-sartorial-lote0-09f` y `--no-optional-locks`, y usar `--ignore-cr-at-eol`: sin eso aparecen 15 rutas más que solo difieren en CRLF.
