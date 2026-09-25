# GEMINI-TASK-CURRENCY-001: Rediseño Minimalista del Selector de Moneda

```text
Ruta: agent-comms/inbox-gemini/GEMINI-TASK-CURRENCY-001.md
Autoridad: Johandry / Ruiz Digital (Dueño)
Insumos: currency-selector.diff, liquid-currency-test.mjs
Estado: APROBADO Y COMPLETADO
Fecha: 2026-09-24
```

---

## 1. Alcance Solicitado por Johandry

1. Cambiar el selector de país/moneda para mostrar exclusivamente las divisas disponibles compactas ("USD$", "EUR€"), con una sola opción por divisa.
2. Homologar la estética al toggle de idioma `EN / ES`: tipografía de 12 px (0.75rem), bold (700), mayúsculas, fondo transparente, sin borde de caja y con chevron sutil de línea.
3. Incorporar un divisor vertical fino (`|`) entre el toggle de idioma y el selector de moneda.
4. Actualizar claves de localización: `general.localization.country` pasa a `general.localization.currency`.

---

## 2. Archivos Modificados

- `snippets/localization-selectors.liquid`
- `assets/base.css`
- `locales/en.default.json`
- `locales/es.json`

---

## 3. Resolución

1. Theme Check: 149 archivos inspeccionados con 0 ofensas.
2. `locale-key-inventory.mjs`: 0 claves sin resolver.
3. Desplegado a los 4 temas en vivo: Couture (#165809488115), Sartorial (#166186909939), Edition (#166186942707) y Archive (#166187041011).
4. Pruebas empíricas de Playwright ejecutadas a 1280px (desktop) y 375px (cajón móvil): formato verificado en vivo `EN / ES | EUR€` / `USD$`, targets táctiles >= 44x44px, 0px de scroll horizontal.
