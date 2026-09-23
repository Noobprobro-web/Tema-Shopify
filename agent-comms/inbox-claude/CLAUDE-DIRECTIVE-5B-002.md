# CLAUDE-DIRECTIVE-5B-002: Hotfix P1 de Foco en Reset Zoom y Blindaje Modal (Sprint 5B)

```text
ID: CLAUDE-DIRECTIVE-5B-002
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5.5 Extra - Implementador Principal y Disciplina Técnica)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-22
Estado: DIRECTIVA TÉCNICA VINCULANTE (HOTFIX F01 - SPRINT 5B)
Responde a: GPT-AUDIT-007-sprint-5b.md (Dictamen adversarial de GPT-6 Sol Max)
```

---

## 1. Diagnóstico del Hallazgo F01 (P1 - Bloqueante)

En [`GPT-AUDIT-007-sprint-5b.md`](../outbox-gpt/GPT-AUDIT-007-sprint-5b.md), GPT-6 Sol Max detectó un defecto crítico reproducible de accesibilidad y foco en el visor de zoom modal:

- **Ruta y Archivo:** `assets/product-zoom.js:151-166`, método `apply()`.
- **Mecanismo del Fallo:**
  1. Al presionar el botón "Reset zoom" / "Restablecer zoom" (por clic o con tecla `Enter`), el foco del navegador reside en `this.resetButton`.
  2. En la línea 162 se ejecuta: `this.resetButton.hidden = scale <= 1;`.
  3. En la especificación DOM/HTML de navegadores modernos, al ocultar (`hidden = true` o `display: none`) un elemento que tiene el foco activo, el navegador despoja inmediatamente el foco y lo devuelve a `document.body`.
  4. En la línea 163 se evalúa: `const active = document.activeElement;`. Como el foco ya cayó a `body`, `dialog.contains(active)` evalúa a `false`.
  5. La guarda de recuperación de foco (`:164-166`) nunca se ejecuta, dejando el foco atrapado en `BODY` mientras el `<dialog>` sigue visible y modal. El comprador que navega por teclado pierde la referencia visual por completo.

---

## 2. Requerimientos de Implementación

### A. Corrección en `assets/product-zoom.js` (`apply()`)
Modificar la gestión de foco en `apply()` de forma atómica:
1. Comprobar si `document.activeElement` se encuentra dentro del diálogo **antes** de mutar los atributos `hidden` o `disabled`.
2. Si el elemento activo es `this.resetButton` y la escala bajará a `<= 1`, o si es un botón que quedará deshabilitado (`inButton` o `outButton`), **mover proactivamente el foco antes** de ocultar o deshabilitar:
   - Preferencia de destino: `this.inButton` (si `!inButton.disabled && !inButton.hidden`), o en su defecto `this.closeButton`.
3. Aplicar `this.resetButton.hidden = scale <= 1;`, `this.inButton.disabled = ...`, `this.outButton.disabled = ...`.
4. Salvaguarda adicional obligatoria:
   - Si tras las mutaciones `dialog.open && !dialog.contains(document.activeElement)` (capturando cualquier desenfoque anómalo inducido por el navegador), reubicar el foco inmediatamente en el primer control visible y habilitado del diálogo (`[this.inButton, this.outButton, ...this.steps, this.closeButton].find(...)`).

### B. Pruebas Automatizadas en `harness-5B-001/zoom5b.spec.mjs`
Añadir cobertura específica en el arnés de Playwright:
1. Abrir el modal en una foto con zoom disponible.
2. Hacer zoom in (`scale > 1`) para que el botón Reset sea visible.
3. Activar el botón Reset por clic de ratón y verificar que inmediatamente `dialog.contains(document.activeElement)` sea `true` y `document.activeElement.tagName !== 'BODY'`.
4. Repetir la secuencia activando Reset mediante teclado (`Enter` o `Space`) y verificar que el foco permanece dentro del diálogo (típicamente en `inButton` o `closeButton`).
5. Ejecutar la prueba en ambos idiomas (EN y ES) y en ambos viewports (1280px y 360px/390px).

### C. Compuertas Estáticas y Rendimiento
1. `npm run gates:static` debe finalizar con código de salida `0`.
2. Theme Check: 118 archivos inspeccionados con **0 ofensas**.
3. Mantener el tamaño de `assets/product-zoom.js` estrictamente por debajo de los 12 KB sin minificar.
4. Preservar 100% de paridad bilingüe en locales (394 claves).

---

## 3. Protocolo de Entrega

1. Trabajar en el árbol de trabajo local sin realizar commit ni push.
2. Documentar los cambios exactos (archivo, líneas, comandos ejecutados y resultados de pruebas) en:
   `agent-comms/outbox-claude/CLAUDE-REPORT-5B-002.md`
3. Incluir la lista de afirmaciones falsables numeradas y la evidencia del arnés.
