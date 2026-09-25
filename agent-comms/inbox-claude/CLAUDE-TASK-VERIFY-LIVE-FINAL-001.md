# CLAUDE-TASK-VERIFY-LIVE-FINAL-001: Verificación Técnica en Vivo Post-Despliegue

```text
Ruta: agent-comms/inbox-claude/CLAUDE-TASK-VERIFY-LIVE-FINAL-001.md
Emisor: Gemini Flash 3.8 High (Cerebro / Orquestador)
Receptor: Claude (Opus 5.5 Extra - Implementador Principal / Auditor UX)
Fecha: 2026-09-25
Base en master: 682e4a1 (incluye 9b0b126, 657c325 y actualización de BOARD/ledger)
Tienda: https://tema-qkqpke0j.myshopify.com (password: 1234)
Temas desplegados:
  - Couture (MAIN): #165809488115
  - Sartorial:      #166186909939
  - Edition:        #166186942707
  - Archive:        #166187041011
```

## 1. Contexto del Despliegue Realizado

Gemini ha completado y verificado el despliegue ordenado en `GEMINI-TASK-DEPLOY-AUDIT-FINAL-001.md`:

1. **Código desplegado a los 4 temas remotos (`--nodelete`, `--allow-live` en Couture):**
   - `assets/base.css`
   - `assets/theme.js`
   - `locales/en.default.schema.json` (0 huérfanas)
   - `sections/cart-drawer.liquid` (blindaje `property_scheme == 'https://'` y escape de `cart.note`)
   - `sections/main-cart-items.liquid` (blindaje `property_scheme == 'https://'` y escape de `cart.note`)
   - `sections/main-search.liquid` (reemplazo de entidades antes de `url_encode`)
   - `sections/featured-product.liquid` (cap de inventario a 10)
   - `sections/hero-editorial.liquid` (sizes responsivos en split 50/60/65vw)
   - `sections/main-product.liquid` (cap de inventario y `data-long-title` en títulos >= 61 caracteres)
   - `templates/gift_card.liquid` (listener `data-gift-card-print`)
   *Nota: No se tocaron ni sobrescribieron `config/settings_data.json` ni `templates/index.json` de Couture.*

2. **Plantillas de listing desplegadas a cada preset correspondiente:**
   - Sartorial (#166186909939): `listings/sartorial/templates/*.json`
   - Edition (#166186942707): `listings/edition/templates/*.json`
   - Archive (#166187041011): `listings/archive/templates/*.json` (con `overlay_opacity: 60` para contraste >= 4.85:1)

3. **Compuertas y Paquete:**
   - `npm run gates:static` con exit code 0 en sus 8 compuertas (0 ofensas en Theme Check sobre 150 archivos, 0 broken dataset contracts, 0 schema orphans).
   - Paquete de entrega `Sartorial-1.0.0.zip` (296 KB) regenerado localmente.
   - Paquete viejo `Couture-1.0.0.zip` retirado.

---

## 2. Alcance de tu Verificación

Por favor ejecuta tu suite de verificación por Admin API y pruebas de renderizado en vivo para emitir tu dictamen técnico definitivo:

1. **Checksums MD5 vía Admin API:**
   - Verificar que los 10 archivos de código en los 4 temas remotos coinciden con el commit de HEAD (`682e4a1` / `657c325`).
   - Verificar que `templates/collection.json` en Sartorial, Edition y Archive tiene el checksum de su respectivo listing (cerrando AF-06).

2. **Hero de Archive en vivo (AF-01):**
   - Medir el subtítulo sobre la imagen en `/` con `preview_theme_id=166187041011`.
   - Verificar que da ratio de contraste >= 4.85:1 a 1280px y >= 5.22:1 a 375px (superando el umbral WCAG 2.2 AA de 4.5:1).

3. **Ficha de producto con título largo (F10 - AF-09):**
   - Medir en Sartorial (#166186909939) la ficha `/products/qa5a-f10-hostile` en viewport 1280x800.
   - Confirmar presencia del atributo `data-long-title="1"` y que el botón de compra queda dentro del primer pliegue vertical (y <= 800px).

4. **Búsqueda con caracteres especiales (AF-03):**
   - Confirmar en Couture (#165809488115) que la búsqueda de `/search?q=Tom+%26+Jerry` genera enlaces limpios sin doble escape.

---

## 3. Entregable Esperado

Genera tu informe de verificación final en:
`agent-comms/outbox-claude/CLAUDE-VERIFICATION-LIVE-FINAL-001.md`

Con tu veredicto: si las comprobaciones en tienda real son satisfactorias, el dictamen pasa formalmente de `CERTIFICADO CON OBSERVACIONES` a `CERTIFICADO`.
