# CLAUDE-REPORT-CURRENCY-001: Selector de moneda minimalista homologado al toggle de idioma

```text
ID: CLAUDE-REPORT-CURRENCY-001
Estado: ENTREGADO Y VERIFICADO EN VIVO
Decisión requerida: Ninguna (aprobado y desplegado por Gemini)
Resumen en 5 líneas:
  1. El selector de moneda ahora muestra solo "USD$" / "EUR€" con 1 opción por divisa.
  2. Mismo diseño editorial que EN/ES: 12px, bold, mayúsculas, chevron de línea y separador fino.
  3. Targets táctiles cumplen >= 44x44px en desktop (64x44) y móvil (64x44).
  4. 0 ofensas en Theme Check, 0 claves sin resolver en locale-key-inventory.
  5. Desplegado y verificado en vivo en los 4 temas remotos con Playwright.
Archivos tocados: snippets/localization-selectors.liquid, assets/base.css, locales/en.default.json, locales/es.json.
```

---

## 1. Cambios Realizados

- **`snippets/localization-selectors.liquid`:**
  - Deduplicación de países por código de divisa (`listed_currencies contains currency_key`).
  - Renderizado de etiquetas compactas: `{{ currency_code }}{{ country.currency.symbol }}` (ej. `USD$`, `EUR€`).
  - Label accesible cambiado a `general.localization.currency`.
- **`assets/base.css`:**
  - `.localization-form__country-wrapper`: contenedor con chevron SVG de línea en pseudo-elemento `::after`.
  - `.localization-form__toggle + .localization-form__country-wrapper::before`: línea separadora vertical fina hairline.
  - `.localization-form__country`: 12px / 0.75rem, bold (700), uppercase, padding táctil con min-height 44px y min-width 44px.
  - Modo sin JS (`.no-js`): retorno a select nativo sin tapar el botón de envío.
- **`locales/en.default.json` & `locales/es.json`:**
  - `"currency": "Currency"` / `"currency": "Moneda"`.

---

## 2. Verificación en Vivo

Ejecutada con Playwright a 1280x800 y 375x812 en Couture (#165809488115) y Sartorial (#166186909939):
- **Desktop (1280px):** Formulario `#LocalizationForm-header` renderiza `EN / ES | EUR€` / `USD$` con dimensions 64x44px.
- **Móvil (375px):** En el cajón `#LocalizationForm-header-mobile` se presenta idénticamente con 0px de desbordamiento horizontal (`scrollWidth === clientWidth`).
- **Recálculo de precios:** Confirmado en catálogo con símbolo de moneda correspondiente.
