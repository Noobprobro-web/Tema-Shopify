# HANDOFF: 01-requisitos-theme-store

## Hallazgos Clave
1. **[P0] Fila 107 - Documentación y Soporte Públicos Inexistentes:**
   - `config/settings_schema.json:1-15`: `theme_documentation_url` y `theme_support_url` apuntan a `ruizdigital.com`, dominio no activo públicamente.
   - El formulario de soporte en `docs/merchant/support.html` es un `mailto:` y carece de subida de archivos, campo de contraseña de storefront y auto-responder.
2. **[P0] Fila 108 - Tiendas Demo de Transferencia Inexistentes:**
   - Shopify exige 3 tiendas demo públicas (Client Transfer) con Bogus Gateway y sin contraseña. Actualmente solo existe 1 tienda dev protegida con password.
3. **[P1] gates:ledger en git archive HEAD (CRLF sensitivity):**
   - `scripts/ledger-verify.mjs:58`: Falla en checkout CRLF en Windows al procesar el archivo sin normalizar \r\n.

## Veredicto del Área
NO APTO (bloqueado por dependencias comerciales externas de submission: dominio público, formulario backend y 3 tiendas demo).
