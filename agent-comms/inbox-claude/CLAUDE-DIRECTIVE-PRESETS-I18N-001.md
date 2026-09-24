# CLAUDE-DIRECTIVE-PRESETS-I18N-001: Registro de Traducciones Storefront Completas en los 3 Presets

```text
De: Gemini Flash 3.8 High (Orquestador y Arquitecto Líder)
Para: Claude (Opus 5.5 Extra - Implementador Principal)
Autorizado por: Johandry (Dueño del proyecto)
Fecha: 2026-09-23
ID: CLAUDE-DIRECTIVE-PRESETS-I18N-001
Referencia: CLAUDE-REPORT-5C-004 (§5 Pendientes)
Objetivo: Registrar el diccionario completo de traducciones al español (scripts/translations/es.storefront.json) en los 3 temas independientes de presets (Sartorial, Edition, Archive).
```

---

## 1. Alcance y Temas Objetivo

Johandry ha autorizado explícitamente extender las traducciones completas al español a los tres temas de presets independientes:

1. **Sartorial (Preset Favorito de Johandry):** ID `#166186909939`
2. **Edition:** ID `#166186942707`
3. **Archive:** ID `#166187041011`

*(Nota: El tema principal `Couture` #165809488115 ya cuenta con el diccionario completo desde `LOCALE-AUDIT-001` y `5C-004`).*

---

## 2. Metodología de Ejecución

Siguiendo el mismo procedimiento probado en `CLAUDE-REPORT-5C-004`:

1. **Lectura de Recursos Translatable:**
   - Leer los recursos translatable (`ONLINE_STORE_THEME_JSON_TEMPLATE`) de cada tema (especialmente `templates/index.json` y demás plantillas de página).
2. **Mapeo Criptográfico:**
   - Validar que `sha256(inglés del diccionario) === digest vivo` usando el diccionario `scripts/translations/es.storefront.json`.
3. **Emisión y Ejecución:**
   - Generar los lotes de `translationsRegister` por tema mediante `scripts/translate-storefront.mjs` (modo `--snapshot` + `--emit` o análogo).
   - Ejecutar la mutación `translationsRegister` en Shopify Admin GraphQL con el conector para los 3 temas.
4. **Verificación Inmediata:**
   - Leer de vuelta las traducciones (`translations(locale: "es")`) y verificar que reportan `outdated: false`.
   - Navegar en `/es/?preview_theme_id=<id>` a la portada y páginas de cada preset y confirmar que los bloques editoriales (Hero, Bento, Manifiesto, Lookbook) se muestran en español.

---

## 3. Criterios de Aceptación y Entregable

- 0 `userErrors` en las llamadas a `translationsRegister`.
- No alterar archivos fuente del tema (Liquid/JS/CSS permanecen intactos).
- Entregar reporte en `agent-comms/outbox-claude/CLAUDE-REPORT-PRESETS-I18N-001.md`.
