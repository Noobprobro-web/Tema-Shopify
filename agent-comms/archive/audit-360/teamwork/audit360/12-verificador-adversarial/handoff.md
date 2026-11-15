# HANDOFF: 12-verificador-adversarial

## Dictamen de Verificación y Falsificación

### Hallazgos P0/P1 Confirmados (Inmunes a falsificación)
1. **A360-01 [P0] Fila 107 - URLs de documentación y soporte inexistentes:**
   - *Intento de falsificación:* Se realizó petición HTTP/DNS a \`ruizdigital.com\`.
   - *Resultado:* Conexión rechazada / NXDOMAIN. Además \`support.html\` es un enlace \`mailto:\` sin subida de archivos ni confirmación por webhook/backend.
   - *Estado:* CONFIRMADO P0.
2. **A360-02 [P0] Fila 108 - Falta de 3 tiendas demo públicas independientes:**
   - *Intento de falsificación:* Se verificó la disponibilidad de tiendas demo públicas en la red.
   - *Resultado:* Solo existe una tienda dev protegida con contraseña (\`tema-qkqpke0j.myshopify.com\`).
   - *Estado:* CONFIRMADO P0.
3. **A360-03 [P1] sections/main-product.liquid carece de bloque \`custom_liquid\`:**
   - *Intento de falsificación:* Búsqueda de \`"type": "custom_liquid"\` en el schema de \`sections/main-product.liquid\`.
   - *Resultado:* 0 ocurrencias. Contrastado con \`featured-product.liquid:741\` que sí lo tiene. La directriz oficial de Shopify lo exige expresamente.
   - *Estado:* CONFIRMADO P1.
4. **A360-04 [P1] scripts/ledger-verify.mjs falla en git archive HEAD en Windows:**
   - *Intento de falsificación:* Ejecución en copia limpia de \`git archive HEAD\`.
   - *Resultado:* Error en línea 58 por \`split('\\n')\` con finales de línea CRLF.
   - *Estado:* CONFIRMADO P1.

### Hallazgos Candidatos Falsificados (Trasladados a Anexo de Descartados)
1. **[FALSIFICADO] Checkboxes en complete-the-look violan Target Size Minimum (2.5.8):**
   - *Argumento inicial:* Input mide 20x20px (< 24x24px).
   - *Prueba empírica:* El input está envuelto en \`<label class="complete-the-look__check">\` cuyo bounding box real es de 44x44px. Al hacer clic en el label se activa el control. Cumple excepción WCAG 2.2.
   - *Destino:* DESCARTADO.
2. **[FALSIFICADO] Vulnerabilidad XSS en cart.note y line item properties:**
   - *Argumento inicial:* Expresiones detectadas por regex estático.
   - *Prueba empírica:* Ambos campos están explícitamente sanitizados con \`| escape\` y las propiedades de archivo filtradas por esquema HTTPS y ruta \`/uploads/\`.
   - *Destino:* DESCARTADO.
3. **[FALSIFICADO] Violación de regla de comercio por término interno "popover":**
   - *Argumento inicial:* La clave de schema contiene \`popover_position\`.
   - *Prueba empírica:* El texto que ve el comerciante en \`locales/en.default.schema.json:661\` es "Product card position". El comerciante nunca ve el término interno.
   - *Destino:* RECLASIFICADO a P3 (deuda técnica menor en id).
