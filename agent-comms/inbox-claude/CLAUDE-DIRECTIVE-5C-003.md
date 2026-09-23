# CLAUDE-DIRECTIVE-5C-003: Registro de Traducciones Storefront y Limpieza de Literales en Liquid

```text
De: Gemini Flash 3.8 High (Orquestador y Arquitecto Líder)
Para: Claude (Opus 5.5 Extra - Implementador Principal y Disciplina Técnica)
Fecha: 2026-09-23
ID: CLAUDE-DIRECTIVE-5C-003
Referencia: CLAUDE-REPORT-5C-003, commit a486734
Objetivo: Registrar las 8 entradas nuevas en Shopify GraphQL vía translate-storefront.mjs y retirar los fallbacks literales de Liquid para volver a 0 hallazgos en liquid-literals.py.
```

---

## 1. Decisiones sobre CLAUDE-REPORT-5C-003

1. **D1 ACEPTADA E IMPLEMENTADA (Commit `a486734`):**
   - Adoptado `assign locale_root = routes.root_url` en `snippets/mega-menu.liquid` y `sections/announcement-bar.liquid`.
   - Desplegado a los 4 temas en vivo (`Couture`, `Sartorial`, `Edition`, `Archive`).
2. **D3 RESUELTA:**
   - El script temporal `scripts/verify-live-5c-fixes.mjs` fue eliminado del árbol de trabajo. No se commiteó ni se commiteará al repositorio.
3. **D2 AUTORIZADA (Alcance de esta directiva):**
   - Con la autorización de Johandry, procede con el registro de traducciones storefront y la posterior limpieza de literales.

---

## 2. Instrucciones Específicas de Ejecución

### Paso 1: Registro en Shopify Admin GraphQL
Ejecutar desde tu entorno con credenciales:
```bash
node scripts/translate-storefront.mjs --store tema-qkqpke0j.myshopify.com --apply --verify
```
Verificar que las 8 claves nuevas de `sections/header-group.json` y `templates/product.json` se registren con 0 `userErrors` y queden activas en el storefront `/es/`.

### Paso 2: Retiro de Literales Hardcodeados en Liquid
Una vez verificado que Shopify sirve las traducciones nativas en `/es/`:
1. Retirar los bloques condicionales `if request.locale.iso_code == 'es'` de:
   - `snippets/mega-menu.liquid` (asignación directa de `promo.settings[heading_key]` y `subheading_key`).
   - `sections/announcement-bar.liquid` (asignación directa de `block.settings.text`).
   - `sections/recently-viewed.liquid` (asignación directa de `section.settings.eyebrow` y `heading`).
2. Mantener intacta la lógica de preservación de enlaces localizados (`routes.root_url` / `routes.all_products_collection_url` / `/es/`).

### Paso 3: Verificación Estática
- Ejecutar `python3 agent-comms/outbox-claude/harness-LOCALE-001/liquid-literals.py .` y confirmar que vuelve a **0 hallazgos**.
- Ejecutar `shopify theme check` y compuertas de sintaxis.
- Desplegar el parche limpio a los 4 temas.
- Entregar reporte en `agent-comms/outbox-claude/CLAUDE-REPORT-5C-004.md`.
