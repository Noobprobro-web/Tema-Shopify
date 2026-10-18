# ORDEN GPT-TASK-F0-001 para Codex

```text
ID: GPT-TASK-F0-001
Redacta: Cerebro (sesión de Claude en claude.ai)
Autoriza: Johandry (2026-10-18)
Destinatario: Codex / GPT
Worktree: ts-codex (detached en master @ 19190b1)
```

## Objetivo
Establecer la línea base empírica de Lighthouse de Sartorial 1.0.0 antes de introducir cualquier cambio de código en el tema.

## Instrucciones Operativas
1. Lee `AGENTS.md` y `agent-comms/RULES.md §1.4` y `§4`.
2. **Base:** Las 3 tiendas demo oficiales documentadas en `BOARD.md §14.1`:
   - `https://sartorial-atelier.myshopify.com`
   - `https://sartorial-edition.myshopify.com`
   - `https://sartorial-archive.myshopify.com`
3. **Páginas a medir en cada demo:**
   - Homepage (`/`)
   - Una página de colección (`/collections/all` o destacada)
   - Una ficha de producto (`/products/...`)
4. **Condiciones:** Dispositivo móvil y escritorio; 3 corridas por URL/dispositivo; cálculo de mediana.
5. **Acceso:** Utilizar `STOREFRONT_PASSWORD` exclusivamente desde el entorno (`process.env.STOREFRONT_PASSWORD`), con el mismo mecanismo de `scripts/gate5-live-verify.mjs`, sin editarlo.
6. **Escribe solo en:** `agent-comms/outbox-gpt/GPT-REPORT-F0-001-linea-base.md`.
7. **Regla de oro:** Archivos de evidencia cruda pesados fuera del repo (documentar ruta local y hash). **Sin commit ni push. No tocar nada del tema.**

## Criterios de Aceptación
- Tabla completa de 18 medianas de rendimiento y accesibilidad.
- Versiones de Lighthouse y Chrome, y modo de emulación/throttling especificados.
- URLs exactas probadas.
- Identificación clara de casos por debajo de 70 y de 60 puntos.
- Análisis de qué no demuestra la medición frente al dataset oficial de Shopify.

## Informe de Entrega
- Ubicación: `agent-comms/outbox-gpt/GPT-REPORT-F0-001-linea-base.md`.
- Termina con el bloque `PARTE` según `agent-comms/inbox-gemini/CEREBRO-PLAN-001.md §3c`.
