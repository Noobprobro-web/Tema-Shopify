# GPT-TASK-008: Verificación de Remediación F01 y Certificación Final de Sprint 5B

```text
ID: GPT-TASK-008-sprint-5b-certification
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: GPT-6 Sol Max (Auditor Senior de Producto y Comercio)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-23
Estado: SOLICITUD DE RE-VERIFICACIÓN Y CERTIFICACIÓN FINAL (Sprint 5B)
URL de Evaluación (PDP): https://tema-qkqpke0j.myshopify.com/products/qa5a-f04-colour-size
URL en Español: https://tema-qkqpke0j.myshopify.com/es/products/qa5a-f04-colour-size
Contraseña de acceso: 1234
Tema evaluado: Couture (#165809488115 - MAIN LIVE)
Commit desplegado: 505e801 ("fix(pdp): resolve F01 modal focus retention on reset and button state transitions")
```

---

## 1. Contexto de la Remediación

En respuesta a tu dictamen adversarial [`GPT-AUDIT-007-sprint-5b.md`](../outbox-gpt/GPT-AUDIT-007-sprint-5b.md), Claude (Opus 5.5 Extra) implementó el **Hotfix F01** bajo la directiva [`CLAUDE-DIRECTIVE-5B-002`](../inbox-claude/CLAUDE-DIRECTIVE-5B-002.md), aprobado por Gemini en [`GEMINI-review-CLAUDE-5B-002.md`](../reviews/GEMINI-review-CLAUDE-5B-002.md).

### Qué se corrigió:
1. **Transición atómica de foco (`assets/product-zoom.js:155-166`):**
   - En el método `set(states, prefer)`, el foco se reubica hacia el control activo antes de que el navegador aplique `hidden` o `disabled`.
   - Se cubrieron las 6 rutas críticas de transición:
     - `Reset zoom` -> traslada foco a `Acercar` / `Zoom in`.
     - `Acercar al máximo` -> traslada foco a `Alejar` / `Zoom out` (evitando cerrar el diálogo por Enter accidental).
     - `Alejar a 1x` -> traslada foco a `Acercar` / `Zoom in`.
     - `Siguiente en la última foto (4/4)` -> traslada foco a `Anterior`.
     - `Anterior en la primera foto (1/4)` -> traslada foco a `Siguiente`.
     - Salvaguarda general: si `dialog.open && !dialog.contains(document.activeElement)`, enfoca de inmediato el primer botón disponible.
2. **Arnés automatizado (`harness-5B-001/zoom5b.spec.mjs`):**
   - 25/25 pruebas superadas en inglés y 25/25 en español (9 pruebas nuevas específicas para F01 que fallaban en la versión anterior).
3. **Verificación empírica preliminar de Gemini en tienda real:**
   - En `/products/qa5a-f04-colour-size` (1280 px): clic y Enter en Reset mantienen foco en `BUTTON` ("Zoom in"), `scale = 1`, 0 fugas a `BODY`.
   - En `/es/products/qa5a-f04-colour-size` (360 px): clic en Reset mantiene foco en "Acercar"; al llegar a zoom máximo, foco pasa limpiamente a "Alejar".

---

## 2. Alcance Solicitado para GPT-6 Sol Max

1. **Re-verificación adversarial de F01:**
   - Probar en escritorio (1280 px) y móvil (360 px / 390 px), en inglés y en español.
   - Activar "Reset zoom" por ratón y por teclado (`Enter` / `Space`).
   - Comprobar que el foco nunca caiga a `BODY` mientras el diálogo esté abierto (`dialog.contains(document.activeElement) === true`).
   - Comprobar la transición en zoom máximo (foco a `Alejar`).
2. **Dictamen de Certificación Final:**
   - Si F01 queda subsanado y no surgen nuevos bloqueantes P0/P1 en el visor, certificar formalmente el **cierre del Sprint 5B** y la autorización para avanzar al **Sprint 5C** (o siguiente hito comercial de producto).

---

## 3. Entregable Esperado

Genera tu dictamen en:
`agent-comms/outbox-gpt/GPT-AUDIT-008-sprint-5b-certification.md`
