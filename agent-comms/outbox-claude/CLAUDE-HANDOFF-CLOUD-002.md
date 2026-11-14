ID: CLAUDE-HANDOFF-CLOUD-002
Fecha: 2026-11-05 (America/Caracas)
Autor: Claude (redacción; sin edición del tema, scripts, plan ni refs)
Para: sesión de Claude Code en la nube sin contexto previo, con credenciales en el entorno.
Sustituye a: `CLAUDE-HANDOFF-CLOUD-001.md` en estado y pasos; el contexto de proyecto de aquel sigue valiendo.

# 1. Ramas y cabezas

- `master`: `09f8342` (intacta; no se toca).
- `lote0/base-09f8342`: `eb7cca7`.
- `lote-a`: `1fee9e2`.
- `lote-b`: el commit que contiene este archivo (ver `git log -1 origin/lote-b`).
- Cada lote parte del anterior. Sin force, sin rebase, sin tocar master. PR a master solo al terminar el Lote D y sin fusionar (D12).

# 2. Mandato vigente

Modo autónomo D9 a D18 (`CLAUDE-DECISION-AUTONOMIA-001.md`):
1. D9: ejecutar el plan V4.1 en orden, sin pedir aprobación entre lotes.
2. D10: paradas solo ante P0/P1 nuevo; cambio fuera del plan o de lo registrado; un gate que falla dos veces seguidas; escritura en tiendas distinta de subir temas no publicados; duda sobre credenciales.
3. D11: revisión por subagente Opus nuevo de contexto limpio por tarea de código y por lote.
4. D12: una rama por lote; sin force; literal en 0 antes de cada push; PR sin fusionar al final.
5. D13: Shopify CLI con `SHOPIFY_CLI_THEME_TOKEN`; solo temas no publicados en `tema-qkqpke0j`; nunca publicar ni borrar; no tocar productos, apps ni configuración; `STOREFRONT_PASSWORD` solo del entorno; no abrir `.secrets`.
6. D14: empaquetador determinista (hecho).
7. D15: el fixture de suscripción lo crea Johandry.
8. D16: estado vivo en `CLAUDE-CLOUD-STATUS.md` y commit por tarea.
9. D17: no copiar de SebastianDev017/atelier; no crear metafields; ninguna credencial en archivos ni logs.
10. D18: informe de cierre con ZIP candidato y SHA-256, y parar; el envío lo hace Johandry tras revisión final de Antigravity.

Además D19 a D27 (`CLAUDE-DECISION-LOTE-0-CIERRE-001`, `-LOTE-0-002`, `-A-01-B-02-001`, `-C-08-001`, `-SESION-002`). Claude es escritor único (D2, D24, incluido `BOARD.md`). Nivel 2 solo los autorizados: A-02 por su R-D (D11), D25 (snippet `variant-no-js-select`) y D26 (tres cambios de C-08b). Cualquier otro Nivel 2: preguntar a Johandry.

# 3. Preferencias del usuario sobre modelos

- El coordinador no ejecuta trabajo: delega en subagentes.
- Opus: coordinación, análisis y auditorías. Sonnet: implementación y pruebas. Haiku: búsquedas e inventarios.
- Un subagente por tarea; los independientes, en paralelo; leer informes, no archivos.

# 4. Proceso por tarea

Directiva (Opus) -> R-D independiente (Opus) -> implementación (Sonnet, sin commit) -> revisión de código (Opus nuevo) -> commit del coordinador (Sonnet) con STATUS y ledger. Al cierre de lote, revisión de lote.
IDs: `CLAUDE-DIRECTIVA-<t>-001`, `CLAUDE-REVIEW-<t>-RD-001`, `CLAUDE-REPORT-<t>-001`, `CLAUDE-REVIEW-<t>-001`, `CLAUDE-REVIEW-LOTE-<X>-R<X>-001` (Lote D: `RDEMO`). Harness por tarea en `agent-comms/outbox-claude/harness-<t>-001/`. Todo en `agent-comms/outbox-claude/`.

# 5. Compuerta del literal (el scratchpad no existirá)

Recrearla sin imprimir el literal:
- Derivarlo en memoria (script Python que no lo imprime) comparando `git show 09f8342:<ruta>` y `git show HEAD:<ruta>` de los dos documentos CMP-01, en la posición del marcador `[REDACTED_STOREFRONT_PASSWORD]`. Rutas: `agent-comms/outbox-claude/CLAUDE-HANDOFF-SESSION-002.md` y `agent-comms/outbox-gpt/harness-GPT-018/context-brief.md` (verificar con `git ls-files`). Debe salir un único candidato; contar bytes exactos.
- Criterio antes de cada push: 0 líneas con el literal en contexto de contraseña fuera de `tests/vendor/axe.min.js`; 0 coincidencias en el diff publicado (`origin/<rama>..HEAD`) y en cada archivo del commit. El árbol completo da 46 en 28 archivos (falsos positivos aceptados).
- Nunca imprimir el literal; nunca mostrar `git diff` de los dos documentos CMP-01 (sus líneas eliminadas lo contienen). Solo conteos.
- Aviso: valores ficticios numéricos pueden contenerlo por azar (un valor de prueba de uso común lo contenía); usar `900700500` o `987654321` tras comprobar.

# 6. Estado por lote

- Lote 0: 0-05-P3 cerrada. Empaquetador `scripts/package-theme-zip.mjs`; hash canónico `f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585`, huella `02bd3bc8d99c8c7ee1be8a87358139144bccbd0986d15525a43b49506ec9df34`. Cierre pendiente de C-R0-3 (previews) y C-R0-4 (fixture); lo verifica `CLAUDE-REVIEW-LOTE-0-CIERRE-001`.
- Lote A: A-02 `a6a9074`, A-03 `c81cbcb`, A-01/B-02 `64862d1`, C-08 `fe736f7`; R-A estática aceptada en `1fee9e2`. ZIP de lote-a: 94 archivos, SHA-256 `8f666379137325873e09f5fce321b66149112bff015e8f20027e35dc9350d5f6`.
- Lote B: B-01 `a0274ce`, B-05 `4e5c6d6`, B-03 `9834bac`, B-04 `0e8a401`; todas con código completo y revisión aceptada. R-B pendiente (se lanzó y Johandry la detuvo; no hay informe).
- Lotes C y D sin empezar. D23: D-01/D-01-N/D-01-L son solo entregables en el repo, y se para para que Johandry los importe; C-02 (tienda limpia) la crea Johandry; C-04-R es borrador de versión y notas para aprobación final y debe avisar del retiro de metafields de A-02; C-04-P retira del paquete `templates/page.documentation.json` y `templates/page.support.json` sin borrarlas del repo, vía EXCLUDED_PATHS del empaquetador.

# 7. Siguientes pasos, en orden

1. `git fetch`, checkout `lote-b`, `npm ci`. Comprobar solo NOMBRES de `SHOPIFY_CLI_THEME_TOKEN`, `STOREFRONT_PASSWORD` y `SHOPIFY_FLAG_STORE`, y conectividad a `*.myshopify.com` sin escribir.
2. R-B estática (`CLAUDE-REVIEW-LOTE-B-RB-001`, Opus nuevo) y aplicar sus cambios; actualizar `BOARD.md` con revisión Opus (D24).
3. Antes de la primera ejecución en tienda, los 3 P3 de gate5: quitar el `browser.close()` duplicado en `runChecks`; limitar con tiempo máximo el `finally`; rechazar rutas de colección/producto cuyo último tramo sea `password` o `challenge`. Confirmar cookie `storefront_digest`, redirección de `/password` y apertura del modal.
4. Subir como temas NO publicados en `tema-qkqpke0j` las previews de Sartorial, Imprint y Archive (Shopify CLI, `--unpublished` y `--listing <preset>`). Nunca publicar ni borrar temas existentes; no tocar productos, apps ni configuración (D13).
5. Pruebas de tienda de R-A y R-B (Lighthouse, axe, teclado, matrices de cada tarea). Las que muten el carrito (PD-8 de B-03) requieren autorización expresa de Johandry ANTES.
6. Cerrar el Lote 0 con `CLAUDE-REVIEW-LOTE-0-CIERRE-001` cuando haya previews (si el fixture sigue sin existir, cerrar con C-R0-4 pendiente de Johandry, D19).
7. Lote C en `lote-c` desde `lote-b`; luego Lote D en `lote-d`.
8. Informe de cierre con ZIP candidato y SHA-256, PR a master sin fusionar, y parar (D18).

# 8. Preguntas abiertas para Johandry

- H-1 de A-03: el hover de heritage queda por debajo de 4.5:1 en Archive; contradice la fila 47 del ledger; fuera del plan.
- PD-3 de B-04: ampliar el guardado de nota a los enlaces de línea del cajón; fuera del plan.
- PD-8 de B-03: permiso para mutar el carrito en previews.
- P2-1 de C-08: 58 entradas obsoletas en `scripts/translations/es.storefront.json`; revisar `/es` en las demos. Escribir traducciones en las demos está fuera de D13.
- Fixture de suscripción C-R0-4.

# 9. Hallazgos abiertos menores

- Residuo PD-2 de A-01 (`purchase-option-*`).
- H-2 de B-01: foco a botón oculto al cruzar el corte con el carrito abierto desde el menú (P3).
- P3 de líneas desplazadas en el ledger (+14 en `assets/theme.js`, +12 en `sections/main-product.liquid`).
- Atribución «Sonnet 5.5» en dos commits (`1fee9e2` y otro) no reescrita por no hacer force.
- P3-4 de B-04: arnés sin aserciones automáticas.
- Pendientes menores de `CLAUDE-CLOUD-STATUS.md` (P3-1..P3-3 de B-05, H-3 de A-02, P3-5 y extras de C-08).

# 10. Incidencias de la sesión

Dos reinicios del contenedor; las tareas se relanzaron sin pérdida de trabajo publicado.
