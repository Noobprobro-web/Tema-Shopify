# CLAUDE-CLOUD-STATUS

Archivo vivo de estado para retomar la sesión. Se actualiza y se commitea después de cada tarea (D16 de `CLAUDE-DECISION-AUTONOMIA-001.md`).

## Última actualización

2026-11-04

## Rama actual

`lote0/base-09f8342`

## Hecho

- 0-05-P3 cerrada en `bd779a0`.
- Decisiones D1 a D8 registradas en `fbdf462`.
- Registro de autonomía D9 a D18 (`CLAUDE-DECISION-AUTONOMIA-001.md`) en `ba97b5e`.
- D19 registrada (`CLAUDE-DECISION-LOTE-0-CIERRE-001.md`): R-0 vigente `GEMINI-REVIEW-LOTE-0-R0-002` (no se repite) y cierre del Lote 0 por `CLAUDE-REVIEW-LOTE-0-CIERRE-001`.
- Reconocimiento del plan V4.1 (`agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md`).
- Punto 6b confirmado: Theme Check (CLI 4.8.0, offline) imprime "92 files inspected with no offenses found": inspecciona los 90 `.liquid`/`.json` del paquete más `package.json` y `package-lock.json` de la raíz. Los 3 de 93 no inspeccionados son `assets/base.css`, `assets/product-zoom.js` y `assets/theme.js` (glob `**/*.{liquid,json}` en `node_modules/@shopify/cli/dist/chunk-F3NYCSXT.js:253`). Paquete: assets 3, config 2, layout 2, locales 3, sections 35, snippets 21, templates 18, listings 9.

## En curso

- En espera de respuestas de Johandry (ver Bloqueos).

## Pendiente

- Cierre del Lote 0: revisión `CLAUDE-REVIEW-LOTE-0-CIERRE-001` (subagente Opus nuevo, contexto limpio), limitada a las cuatro condiciones de la R-0 `GEMINI-REVIEW-LOTE-0-R0-002`:
  - C-R0-1: ficha `GEMINI-FICHA-LOTE-0-BASE-001.md` (no está en el clon; localizarla o pedirla).
  - C-R0-2: ZIP regenerable desde el empaquetador versionado, SHA-256 `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f`.
  - C-R0-3: previews de Imprint y Archive como temas no publicados.
  - C-R0-4: fixture de suscripción; si no existe, cerrar con «pendiente de Johandry».
- Lotes A, B, C y D, en ramas `lote-a`, `lote-b`, `lote-c`, `lote-d`, cada una partiendo de la anterior.
- PR hacia `master` al terminar el Lote D, sin fusionar.
- Informe de cierre con el ZIP candidato y su SHA-256; después detenerse. El envío a la Theme Store lo hace Johandry tras la revisión final de Antigravity.
- Nomenclatura: en el plan, «R-D» es la revisión previa de cada directiva; la revisión del Lote D es «R-Demo». IDs propuestos: `CLAUDE-REVIEW-LOTE-A-RA-001`, `CLAUDE-REVIEW-LOTE-B-RB-001`, `CLAUDE-REVIEW-LOTE-C-RC-001`, `CLAUDE-REVIEW-LOTE-D-RDEMO-001`; R-D de tareas: `CLAUDE-REVIEW-<tarea>-RD-001`.

## Bloqueos/esperas

1. `GEMINI-REVIEW-LOTE-0-R0-002` y `GEMINI-FICHA-LOTE-0-BASE-001.md` no existen en ninguna rama o commit del repo; solo existe `GPT-FICHA-LOTE-0-BASE-002.md`. Bloquea la verificación C-R0-1 del cierre.
2. SHA-256 `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f` no reproducible (intento 1: 816 variantes de git archive / python zipfile / info-zip, LF/CRLF, con y sin directorios, fechas, compresión; ninguna coincide). Hash no presente en el repo; el único ZIP documentado es `092242fb…` (Windows, CRLF, árbol anterior). `shopify theme package` no es determinista. Falta origen (herramienta/árbol/EOL) o decisión de fijar un hash nuevo con parámetros publicados. Un segundo fallo activa la parada de D10.
3. Credenciales ausentes en el entorno: `SHOPIFY_CLI_THEME_TOKEN`, `STOREFRONT_PASSWORD`, `SHOPIFY_FLAG_STORE`. Se configuran en los ajustes del entorno (Network secrets o variables) y solo las toma una sesión nueva; red a `*.myshopify.com` sin verificar. Bloquea previews Imprint/Archive (C-R0-3), B2, A-03, R-A, R-B, R-Demo, Lighthouse.
4. Tareas del plan con escrituras en tienda fuera de D13: D-01, D-01-N, D-01-L (catálogo, fotos, menús, idioma), C-02 (tienda limpia), C-04-R (versión y release notes: decide Johandry), C-04-P (retener/retirar plantillas de documentación).
5. `BOARD.md` (B3): único escritor Antigravity; pendiente quién lo reconcilia.
6. Fixture de suscripción (A-01): lo crea Johandry; estado a 2026-11-02 sin planes ni app de suscripción.

## Reglas vigentes

- No abrir, listar ni buscar en `.secrets`.
- Ninguna credencial en archivos ni en logs; el literal de contraseña cuenta 0 fuera de `tests/vendor/axe.min.js` antes de cada push, sin imprimirlo.
- Nunca publicar ni borrar temas; solo subir temas no publicados.
- Única tienda permitida: `tema-qkqpke0j`; no tocar productos, apps ni configuración.
- No copiar código de SebastianDev017/atelier.
- No crear metafields.
- Sin force, sin tocar `master`, sin fusionar el PR.
- Detenerse y preguntar solo en los casos de D10.

## Cómo retomar

1. Leer este archivo.
2. Leer `agent-comms/outbox-claude/CLAUDE-DECISION-AUTONOMIA-001.md`.
3. Comprobar `git log -1` en la rama actual y `git status --porcelain`.
4. Continuar con la tarea de la sección «En curso».
5. En una sesión nueva: `npm ci` (`node_modules` está en `.gitignore`); comprobar solo nombres de `SHOPIFY_CLI_THEME_TOKEN`, `STOREFRONT_PASSWORD` y `SHOPIFY_FLAG_STORE`. La compuerta del literal se deriva en memoria comparando los blobs `09f8342` y HEAD de los documentos CMP-01 en la posición del marcador `[REDACTED_STOREFRONT_PASSWORD]`, sin imprimirlo. Criterio: 0 líneas con literal fuera de `tests/vendor/axe.min.js` y 0 en el rango publicado.
