# CLAUDE-CLOUD-STATUS

Archivo vivo de estado para retomar la sesión. Se actualiza y se commitea después de cada tarea (D16 de `CLAUDE-DECISION-AUTONOMIA-001.md`).

## Última actualización

2026-11-04

## Rama actual

`lote0/base-09f8342`

## Hecho

- 0-05-P3 cerrada en `bd779a0`.
- Decisiones D1 a D8 registradas en `fbdf462`.
- Registro de autonomía D9 a D18 (`CLAUDE-DECISION-AUTONOMIA-001.md`) en este commit.

## En curso

- Reconocimiento del plan V4.1.
- Punto 6 del mandato: empaquetador determinista del ZIP en `scripts/` (debe regenerar el SHA-256 `79ff3961e2d589a25c7b1c6a01aef01d668ffd58f7caafac544fa08df9dbfe0f`) y comprobación de qué 3 de los 93 archivos no inspeccionó Theme Check.

## Pendiente

- Cierre del Lote 0 (R-0, ver Bloqueos/esperas).
- Lotes A, B, C y D, en ramas `lote-a`, `lote-b`, `lote-c`, `lote-d`, cada una partiendo de la anterior.
- PR hacia `master` al terminar el Lote D, sin fusionar.
- Informe de cierre con el ZIP candidato y su SHA-256; después detenerse. El envío a la Theme Store lo hace Johandry tras la revisión final de Antigravity.

## Bloqueos/esperas

- Fixture de suscripción (lo crea Johandry), necesario para A-01: estado desconocido. Si no existe, seguir con lo que no dependa de él y dejarlo marcado.
- Aclaración sobre R-0: D8 (R-0 por Antigravity, `GEMINI-REVIEW-LOTE-0-R0-002`) sigue registrada, y D11 introduce revisores Opus de contexto limpio. Pendiente de aclaración si hay conflicto al cerrar el Lote 0.

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
