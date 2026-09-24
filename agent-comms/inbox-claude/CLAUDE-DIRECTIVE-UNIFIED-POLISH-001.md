# CLAUDE-DIRECTIVE-UNIFIED-POLISH-001: Ejecución Unificada de Traducciones y Pulido Total de Presets y Couture

```text
Ruta: agent-comms/inbox-claude/CLAUDE-DIRECTIVE-UNIFIED-POLISH-001.md
Autoridad: Johandry / Ruiz Digital (Dueño) · Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Destinatario: Claude (Opus 5.5 Extra - Implementador Principal y Auditor Técnico)
Referencia directa: Orden de Johandry ("une lo de claude y gpt, para que claude haga todo lo necesario")
Entradas: CLAUDE-REPORT-PRESETS-I18N-001.md, GPT-AUDIT-010-sprint-5c-certification.md, GPT-AUDIT-011-sprint-5c-certification.md
Estado: AUTORIZADO PARA EJECUCIÓN INMEDIATA
Fecha: 2026-09-23
```

---

## 1. Contexto y Decisión de Negocio

El dueño del proyecto (Johandry) ha emitido una directiva explícita de unificación:
> *"une lo de claude y gpt, para que claude haga todo lo necesario"*
> *"el mas atractivo es sartorial, y no quiero que cambiar nada, solo quiero que se vean las imagenes y todo perfectamente en las previews de los 3 temas, y activa lo nuevo en los 3 temas tambien, para que gpt y claude hagan la revision exaustiva"*

**Estado previo consolidado:**
1. **Sprint 5C certificado formalmente:** GPT-6 Sol Max emitió `GPT-AUDIT-011`, certificando Gate 5 en la tienda principal Couture (#165809488115). Las filas 83, 84 y 85 de `docs/requirements-ledger.md` pasaron a `cumplido` (41 cumplidas, 14 código completo, 2 no verificado, 0 ausente, 0 incoherencias).
2. **Preset templates actualizados y desplegados:** Gemini aplicó los ajustes en `listings/*/templates/index.json` (declarando explícitamente `button_secondary_label`, `button_label` y `link_label` para evitar depender de defaults no traducibles del esquema). En Edition, la etiqueta se ajustó formalmente a `"Browse collections"` con destino a `"/collections"` y traducción `"Ver colecciones"`. Estos 3 archivos `index.json` fueron **desplegados exitosamente a los 3 temas remotos** mediante Shopify CLI:
   - Sartorial: `#166186909939` (desplegado)
   - Edition: `#166186942707` (desplegado)
   - Archive: `#166187041011` (desplegado)
3. Los cambios de código local y diccionarios ya están commiteados en master (`e18351d`) y sincronizados con origin.

---

## 2. Alcance Específico de Ejecución (Para Claude)

Claude tiene autorización completa y exclusiva para ejecutar las siguientes tres tareas operativas:

### Tarea A: Registro de las 8 Gaps de Traducción en el Tema Principal `Couture` (#165809488115)
- **Origen:** Identificadas en §7 de `CLAUDE-REPORT-PRESETS-I18N-001.md`. Lote ya preparado en `agent-comms/outbox-claude/harness-PRESETS-I18N-001/couture-gaps/`.
- **Claves vivas a registrar:**
  1. `index` -> `brand_manifesto.button_label`: `"Conoce nuestro proceso"`
  2. `index` -> `bento_discovery.bento_editorial.link_label`: `"Descubre la historia"`
  3. `page.contact` -> `main.eyebrow`: `"Contacto / Atención a clientes privados"`
  4. `page.contact` -> `main.intro`: `"<p>Escribe al estudio sobre un pedido, un material o una cita privada.</p>"`
  5. `page.contact` -> `main.studio_hours`: `"De lunes a viernes / 10:00–18:00 CET"`
  6. `page.contact` -> `main.showroom_address`: `"Con cita previa / Milán"`
  7. `page.faq` -> `main.cta.button_url`: `"/es/pages/contact"`
  8. `page.support` -> `main.sla`: `"Tiempo medio de respuesta: menos de 24 horas hábiles"`
- **Acción:** Ejecutar `translationsRegister` mediante el conector de Shopify Admin consumiendo `batch-1.variables.json` y `batch-1.graphql`.
- **Criterio de éxito:** `userErrors: []` y lectura de vuelta con `outdated: false`.

### Tarea B: Registro de las 10 Traducciones de Botones en los 3 Presets Remotos
- **Origen:** Identificadas en §6 de `CLAUDE-REPORT-PRESETS-I18N-001.md`. Ahora que `index.json` está desplegado en los 3 temas, los digests están vivos en `translatableResourcesByIds`.
- **Recursos a traducir:**
  1. **Sartorial (`#166186909939`):**
     - `hero.button_secondary_label`: `"Explora el lookbook"`
     - `manifesto.button_label`: `"Conoce nuestro proceso"`
     - `discovery.story.link_label`: `"Descubre la historia"`
  2. **Edition (`#166186942707`):**
     - `hero.button_secondary_label`: `"Ver colecciones"` (asociado al inglés `"Browse collections"`)
     - `manifesto.button_label`: `"Conoce nuestro proceso"`
     - `discovery.story.link_label`: `"Descubre la historia"`
  3. **Archive (`#166187041011`):**
     - `hero.button_secondary_label`: `"Explora el lookbook"`
     - `manifesto.button_label`: `"Conoce nuestro proceso"`
     - `discovery.story1.link_label`: `"Descubre la historia"`
     - `discovery.story2.link_label`: `"Descubre la historia"`
- **Acción:**
  - Leer en vivo los recursos `index` de los temas `166186909939`, `166186942707` y `166187041011` para obtener sus digests exactos.
  - Generar el lote de mutación con `scripts/translate-storefront.mjs` y `scripts/translations/es.storefront.json`.
  - Ejecutar la mutación `translationsRegister` vía conector de Shopify Admin.
  - Verificar lectura de vuelta con `outdated: false`.

### Tarea C: Verificación y Auditoría Bilingüe Integral en Vivo
- **Acción:** Ejecutar las pruebas vivas (`live-probes-es.js` o scripts equivalentes) contra la tienda en los 4 temas:
  - `Couture` (#165809488115, live main)
  - `Sartorial` (#166186909939)
  - `Edition` (#166186942707)
  - `Archive` (#166187041011)
- **Comprobaciones obligatorias:**
  1. Portada en `/es/`: comprobar que el 100% de los botones (incluidos los secundarios del hero, el manifiesto y el bento) se muestran en español.
  2. Páginas nativas en `/es/pages/*` (About, Contact, FAQ, Support, Documentation): comprobar que no quedan cadenas en inglés (salvo nombres propios, marcas o fragmentos de código previstos).
  3. Enlaces del mega menú y promociones: verificar que navegar en `/es/` conserva el locale `/es/collections/all`.
  4. Estado visual en desktop y móvil (CLS 0, sin overflow).

---

## 3. Restricciones y Reglas de Disciplina

1. **NO modificar código Liquid, CSS, JS ni JSON del tema principal.** Cualquier cambio de archivo local requiere autorización. (Las plantillas de presets ya fueron desplegadas por Gemini).
2. **NO modificar `docs/requirements-ledger.md`.** La escritura del ledger es potestad de Gemini tras revisar entregas.
3. **NO hacer commit ni push a git.**
4. Seguir rigurosamente el formato de reporte de `agent-comms/RULES.md`.

---

## 4. Entregable Esperado

- Informe formal en: `agent-comms/outbox-claude/CLAUDE-REPORT-UNIFIED-POLISH-001.md`.
- Conteo exacto de traducciones registradas en Couture (8) y Presets (10).
- Confirmación de lectura de vuelta (`outdated: false`).
- Resultados de la auditoría en vivo en los 4 temas en `/` y `/es/`.
- Lista de afirmaciones falsables numeradas.
