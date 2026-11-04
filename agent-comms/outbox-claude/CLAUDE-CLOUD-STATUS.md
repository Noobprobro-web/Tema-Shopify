# CLAUDE-CLOUD-STATUS

Archivo vivo de estado para retomar la sesión. Se actualiza y se commitea después de cada tarea (D16 de `CLAUDE-DECISION-AUTONOMIA-001.md`).

## Última actualización

2026-11-04

## Rama actual

`lote-a` (creada desde eb7cca7)

## Hecho

- 0-05-P3 cerrada en `bd779a0`.
- Decisiones D1 a D8 registradas en `fbdf462`.
- Registro de autonomía D9 a D18 (`CLAUDE-DECISION-AUTONOMIA-001.md`) en `ba97b5e`.
- D19 registrada (`CLAUDE-DECISION-LOTE-0-CIERRE-001.md`): R-0 vigente `GEMINI-REVIEW-LOTE-0-R0-002` (no se repite) y cierre del Lote 0 por `CLAUDE-REVIEW-LOTE-0-CIERRE-001`.
- Reconocimiento del plan V4.1 (`agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md`).
- Punto 6b confirmado: Theme Check (CLI 4.8.0, offline) imprime "92 files inspected with no offenses found": inspecciona los 90 `.liquid`/`.json` del paquete más `package.json` y `package-lock.json` de la raíz. Los 3 de 93 no inspeccionados son `assets/base.css`, `assets/product-zoom.js` y `assets/theme.js` (glob `**/*.{liquid,json}` en `node_modules/@shopify/cli/dist/chunk-F3NYCSXT.js:253`). Paquete: assets 3, config 2, layout 2, locales 3, sections 35, snippets 21, templates 18, listings 9.
- Pull fast-forward a `1c7aec0` (Noobprobro-web): añade en `agent-comms/outbox-gemini/` la R-0 `GEMINI-REVIEW-LOTE-0-R0-002.md` (aceptado condicional; 4 condiciones de cierre (C-R0-1..4): ficha, ZIP regenerable, fixture de suscripción, previews Imprint/Archive; más el hallazgo §7e: corregir `scripts/gate5-complete-verification.mjs:88` antes de usarlo como evidencia de tienda), la ficha `GEMINI-FICHA-LOTE-0-BASE-001.md` (SHA `fbdf462`, 93 archivos, manifest SHA-256, política LF) y `package-reproducible-zip.py`. Ese script, ejecutado aquí, da 289834 bytes y SHA-256 `3629d9d4…fc44e`, no `79ff3961…`.
- D20 a D24 registradas (`CLAUDE-DECISION-LOTE-0-002.md`): D20 pull y uso de R-0, ficha y método; D21 empaquetador determinista propio y hash canónico (`79ff3961` es referencia histórica no reproducible); D22 trabajo sin tienda y rama `lote-a`; D23 D-01/D-01-N/D-01-L, C-02, C-04-R y C-04-P; D24 `BOARD.md` con Claude como escritor único.
- Empaquetador determinista `scripts/package-theme-zip.mjs` (D21): C-R0-2 cumplida; SHA-256 canónico `f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585`, huella de contenido `02bd3bc8d99c8c7ee1be8a87358139144bccbd0986d15525a43b49506ec9df34`; ACEPTADO (CLAUDE-REVIEW-LOTE-0-ZIP-001).
- gate5 R-0 §7e corregido y ACEPTADO (CLAUDE-REVIEW-0-05-P3-002).
- `BOARD.md` reconciliado (B3 resuelto en lo documental) y ACEPTADO (CLAUDE-REVIEW-LOTE-0-BOARD-001).
- `docs/decisions.md` con D19 a D24.
- A-02: retiro de 14 fuentes automáticas y heurísticas H1–H8 (Nivel 2 autorizado por el revisor R-D según D11); estado «código completo»; ACEPTADO en `CLAUDE-REVIEW-A-02-001`.
- A-03: foco visible por `motion_style` (technical y heritage usan `var(--color-foreground)`); código completo; ACEPTADO en `CLAUDE-REVIEW-A-03-001`; ledger filas 48/49 (1.4.11 y 2.4.7) a `código completo`.
- A-01/B-02: código completo; ACEPTADO en `CLAUDE-REVIEW-A-01-B-02-001`; snippet `variant-no-js-select` autorizado por Johandry (D25, `CLAUDE-DECISION-A-01-B-02-001`); ledger filas 69 y 71 a `código completo`.

## En curso

- C-08: en R-D.
- Siguiente: resto del Lote A sin tienda en rama `lote-a` (R-D de cada tarea antes de implementar).

## Pendiente

Plan de ejecución sin tienda (D22, D23):

- Pruebas en tienda R-A 1–8 de A-02 (esperan credenciales).
- Prueba en tienda de B-02 (esperan credenciales) y de A-01 (fixture C-R0-4 y credenciales).
- Residuo PD-2 de A-01/B-02: parámetros `purchase-option-*`.
- Aviso: C-08 sobre esta base sube la LiquidComplexity de `sections/main-product.liquid` a 122 (>120).
- Prueba R-A de A-03 en previews de Imprint y Archive (esperan credenciales).
- H-1 de A-03 (texto de hover de heritage por debajo de 4.5:1, P2, fuera del plan): corregirlo requiere decisión de Johandry. H-2 a H-4 son P3.
- Aviso del retiro de metafields en C-04-R (dependencia abierta de A-02).
- P3 de la revisión de A-02: H-3, texto «Shown as entered», a pulir en Lote C.

- Lote 0: empaquetador y ZIP canónico; `BOARD.md`; revisión de cierre parcial `CLAUDE-REVIEW-LOTE-0-CIERRE-001` (subagente Opus nuevo, contexto limpio), limitada a las cuatro condiciones de D19, C-R0-1 a C-R0-4 (correspondencia con R-0 §7: C-R0-1 = a, C-R0-2 = b, C-R0-3 = d, C-R0-4 = c):
  - C-R0-1: ficha `GEMINI-FICHA-LOTE-0-BASE-001.md` (ya en el clon).
  - C-R0-2: ZIP regenerable desde el empaquetador versionado; hash canónico nuevo según D21.
  - C-R0-3: previews de Imprint y Archive como temas no publicados (espera credenciales).
  - C-R0-4: fixture de suscripción (lo crea Johandry; si no existe, cerrar con «pendiente de Johandry»).
- Lote 0: cierre pendiente de C-R0-3 (previews, esperan credenciales) y C-R0-4 (fixture, Johandry); C-R0-1 (ficha) y C-R0-2 (ZIP) cumplidas.
- P3 opcionales de gate5 para antes de la primera ejecución en tienda: (1) quitar el `browser.close()` duplicado dentro de `runChecks`; (2) limitar con tiempo máximo la espera de `browser.close()` en el `finally`; (3) rechazar en la validación rutas de colección/producto cuyo último tramo sea `password` o `challenge`.
- Lote A en la rama `lote-a` (desde la cabeza de `lote0/base-09f8342`; integrar con merge sin force lo que llegue al Lote 0): A-02, C-08, B-02, A-01 (código), A-03 (código). Pruebas de tienda como «código completo» hasta la sesión con credenciales.
- Lote B: código sin tienda.
- Lote C: lo que no necesita tienda, incluidos C-04-P (excluir `templates/page.documentation.json` y `templates/page.support.json` del ZIP sin borrarlas del repo) y C-04-R (borrador de versión y release notes para que Johandry apruebe al final).
- Lote D: entregables en el repo (CSV de importación, menús, lista de fotos, idioma) y parada para que Johandry los importe (D-01, D-01-N, D-01-L).
- Lotes B, C y D en ramas `lote-b`, `lote-c`, `lote-d`, cada una partiendo de la anterior.
- PR hacia `master` al terminar el Lote D, sin fusionar.
- Informe de cierre con el ZIP candidato y su SHA-256; después detenerse. El envío a la Theme Store lo hace Johandry tras la revisión final de Antigravity.
- Nomenclatura: en el plan, «R-D» es la revisión previa de cada directiva; la revisión del Lote D es «R-Demo». IDs propuestos: `CLAUDE-REVIEW-LOTE-A-RA-001`, `CLAUDE-REVIEW-LOTE-B-RB-001`, `CLAUDE-REVIEW-LOTE-C-RC-001`, `CLAUDE-REVIEW-LOTE-D-RDEMO-001`; R-D de tareas: `CLAUDE-REVIEW-<tarea>-RD-001`.

Espera credenciales o a Johandry:

- Previews Imprint/Archive (C-R0-3), B2, A-03 (medición), R-A, R-B, R-Demo, Lighthouse y toda prueba en tienda.
- Importación de los entregables D-01, D-01-N y D-01-L; tienda limpia C-02; aprobación final de C-04-R.
- Fixture de suscripción (A-01).

## Bloqueos/esperas

1. Resuelto (D20): `GEMINI-REVIEW-LOTE-0-R0-002`, `GEMINI-FICHA-LOTE-0-BASE-001.md` y `package-reproducible-zip.py` están en el clon desde `1c7aec0`.
2. Resuelto (D21): el SHA-256 `79ff3961…` queda como referencia histórica no reproducible; el hash canónico será el del empaquetador propio, generado dos veces.
3. Credenciales ausentes en el entorno: `SHOPIFY_CLI_THEME_TOKEN`, `STOREFRONT_PASSWORD`, `SHOPIFY_FLAG_STORE`. Llegan en una sesión nueva (D22); se configuran en los ajustes del entorno (Network secrets o variables); red a `*.myshopify.com` sin verificar. Bloquea previews Imprint/Archive (C-R0-3), B2, A-03, R-A, R-B, R-Demo, Lighthouse.
4. Resuelto en D23: D-01, D-01-N y D-01-L son entregables en el repo con parada para importación por Johandry; C-02 la crea Johandry; C-04-R es borrador pendiente de su aprobación; C-04-P excluye las plantillas de documentación del ZIP sin borrarlas.
5. Resuelto (D24): `BOARD.md` lo escribe Claude como único escritor y lo revisa un subagente Opus.
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
