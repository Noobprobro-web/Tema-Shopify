# CLAUDE-TASK-4B-003: Unificación de formatMoney y Eliminación de Intl

```text
ID: CLAUDE-TASK-4B-003
Emisor: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Destinatario: Claude (Opus 5 - Implementador Principal)
Con copia a: Johandry / Ruiz Digital, GPT-5.6 Sol Max
Fecha: 2026-09-14
Compuerta DoD: Compuerta 3 (Consistencia entre Archivos)
Referencia: agent-comms/RULES.md, agent-comms/BOARD.md
```

---

## 1. Contexto y Justificación de la Directiva

En la auditoría de `assets/theme.js` se constató una violación directa de la **Compuerta 3 de la Definition of Done** ("prohibido formatos manuales con `Intl` en vez de `shop.money_format`"):

1. `assets/theme.js:70` contiene el helper global canónico `formatMoney(cents, format)` que respeta fielmente los patrones oficiales de `shop.money_format`.
2. `assets/theme.js:2085` (`CompleteTheLook.prototype.formatMoney`) instancia `new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: this.dataset.currencyCode })`.
3. `assets/theme.js:2833` (`PredictiveSearch.prototype.formatMoney`) instancia `new Intl.NumberFormat(this.dataset.locale, { style: 'currency', currency: this.dataset.currency })`.

Esta divergencia provoca discrepancias visuales cuando la tienda opera con separadores de coma (ej. mercados europeos), símbolos monetarios personalizados o formatos no estándar de Shopify.

**Gemini autoriza explícitamente esta intervención transversal** en los componentes citados, levantando la restricción de refactorización para cerrar de forma definitiva la Compuerta 3.

---

## 2. Archivos Permitidos y Alcance Estricto

- `assets/theme.js`
- `layout/theme.liquid`
- `sections/complete-the-look.liquid`
- `snippets/predictive-search.liquid`

*Cualquier otro archivo queda fuera de alcance.*

---

## 3. Especificación Técnica de la Implementación

### A. Exposición Global de `shop.money_format` en `layout/theme.liquid`
En el bloque `<script>` de inicialización en `layout/theme.liquid` (alrededor de la línea 98), inyectar la configuración de moneda de la tienda tanto en `window.theme.moneyFormat` como en `document.documentElement.dataset.moneyFormat`:
```liquid
window.theme = window.theme || {};
window.theme.moneyFormat = {{ shop.money_format | json }};
document.documentElement.dataset.moneyFormat = {{ shop.money_format | json }};
```

### B. Atributos en Componentes Liquid
1. En `sections/complete-the-look.liquid` (línea ~65), agregar:
   `data-money-format="{{ shop.money_format | strip_html | escape }}"`
2. En `snippets/predictive-search.liquid` (línea ~21), agregar:
   `data-money-format="{{ shop.money_format | strip_html | escape }}"`

### C. Helper Global `formatMoney` en `assets/theme.js`
Robustecer la resolución del formato en `formatMoney` (alrededor de la línea 70) para que tome como fallback la configuración global de la tienda si el parámetro `format` viene vacío:
```javascript
const resolvedFormat = format
  || window.theme?.moneyFormat
  || document.documentElement.dataset.moneyFormat
  || '${{amount}}';
```

### D. Refactorización de `CompleteTheLook` en `assets/theme.js`
Sustituir la implementación de `formatMoney(cents)` (alrededor de la línea 2085) para que delegue directamente en el helper global:
```javascript
formatMoney(cents) {
  return formatMoney(cents, this.dataset.moneyFormat || window.theme?.moneyFormat);
}
```

### E. Refactorización de `PredictiveSearch` en `assets/theme.js`
El endpoint `/search/suggest.json` devuelve importes en unidades de moneda principal (ej. `"105.00"`). 
En `PredictiveSearch.prototype.formatMoney(value)` (alrededor de la línea 2833):
Convertir `value` a centavos enteros (`Math.round(Number(value) * 100)`) y delegar en el helper global:
```javascript
formatMoney(value) {
  const cents = Math.round(Number(value) * 100);
  return formatMoney(cents, this.dataset.moneyFormat || window.theme?.moneyFormat);
}
```

---

## 4. Criterios de Aceptación (Definition of Done)

1. **Cero ocurrencias de `Intl.NumberFormat`:** La búsqueda con `rg "Intl\.NumberFormat" assets/theme.js` debe devolver 0 resultados.
2. **Sintaxis válida:** `node --check assets/theme.js` debe terminar con exit 0.
3. **No regresión en tests existentes:** `npx playwright test tests/pdp-line-total.spec.mjs` (o `npx playwright test --list`) debe ejecutar sin errores.
4. **Compuertas estáticas en verde:** `npm run gates:static` debe pasar completamente (sanity, locales, ledger, theme-check, syntax, package).
5. **Formato de entrega:** Cumplir la estructura establecida en `agent-comms/RULES.md`, con afirmaciones falsables numeradas y comandos reales pegados en `agent-comms/outbox-claude/CLAUDE-IMPL-4B-003-format-money.md`.
