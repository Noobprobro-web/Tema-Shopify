# GPT-TASK-012: Auditoría Integral y Exhaustiva de los 3 Presets y Tema Principal

```text
Ruta: agent-comms/inbox-gpt/GPT-TASK-012-final-unified-audit.md
Autoridad: Johandry / Ruiz Digital (Dueño) · Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Destinatario: GPT-6 Sol Max (Auditor Senior de Producto, UX y Viabilidad Comercial)
Referencia directa: Orden de Johandry ("solo quiero que se vean las imagenes y todo perfectamente en las previews de los 3 temas, y activa lo nuevo en los 3 temas tambien, para que gpt y claude hagan la revision exaustiva")
Insumos: CLAUDE-REPORT-UNIFIED-POLISH-001.md, fixes visuales desplegados en vivo
Estado: LISTO PARA EJECUCIÓN
Fecha: 2026-09-23
```

---

## 1. Contexto y Estado del Proyecto

1. **Sprint 5C certificado formalmente (`GPT-AUDIT-011`):** Filas 83–85 del ledger en `cumplido` (41 cumplido / 71.9% de cobertura Theme Store).
2. **Traducciones registradas en vivo (28 nuevas):** Claude completó la directiva `CLAUDE-DIRECTIVE-UNIFIED-POLISH-001`:
   - 8 traducciones en Couture (#165809488115): Contacto, Soporte, botón de FAQ y 2 botones de portada.
   - 20 traducciones en los 3 presets remotos (Sartorial, Edition, Archive): 10 etiquetas de botón + 10 URLs localizadas a `/es/`.
   - 0 userErrors y 0 outdated en 32 recursos leídos de vuelta.
3. **Corrección visual de titulares desplegada en vivo:**
   - Se aplicó `overflow-wrap: break-word` y escalado responsivo en `assets/base.css`.
   - En Archive, `content_width` se ajustó a `46` (paso par válido del esquema).
   - El código fue desplegado a los 4 temas remotos vía Shopify CLI. Pruebas empíricas de Playwright confirman que "movimiento", "remembered" y "recordada" se muestran enteros sin cortes a 1280px, 375px y 360px, con 0 overflow horizontal.
4. **Preferencia explícita de Johandry:**
   - **Sartorial** es su preset favorito: mantener intacta su dirección visual y estética.
   - Garantizar que los 3 presets se vean perfectos en previsualización, con todas las imágenes cargando y la experiencia 100% bilingüe.

---

## 2. Alcance Obligatorio de Auditoría (Para GPT-6 Sol Max)

GPT-6 Sol Max debe realizar una auditoría adversarial y exhaustiva en la tienda real (`tema-qkqpke0j.myshopify.com`, password `<redactado>`) cubriendo los siguientes frentes en los 4 temas independientes:
- **Couture (Main):** `#165809488115`
- **Sartorial (Favorito):** `#166186909939` (`?preview_theme_id=166186909939`)
- **Edition:** `#166186942707` (`?preview_theme_id=166186942707`)
- **Archive:** `#166187041011` (`?preview_theme_id=166187041011`)

### Frente 1: Acabado Tipográfico y Visual de Titulares
- Verificar a 1280x800 y a 375x812 (móvil) que los titulares del hero en `/` y en `/es/` no parten palabras por la mitad ("movimient / o", "rememb / ered").
- Verificar que no existe scroll horizontal (`scrollWidth === clientWidth`) en 1280, 375 y 360 px.
- Verificar que todas las imágenes de la portada cargan adecuadamente (sin broken images o 404s).

### Frente 2: Coherencia Bilingüe y Continuidad de Locale
- Verificar que en `/es/`:
  - Botones principales y secundarios del hero conducen a URLs localizadas (`/es/collections/all`, `/es/collections`).
  - Botones del manifiesto ("Conoce nuestro proceso") y bento ("Descubre la historia") están en español.
  - Enlaces de las tarjetas del mega menú conducen a `/es/collections/all` y mantienen al usuario en español.
  - Páginas nativas (`/es/pages/about`, `/es/pages/contact`, `/es/pages/faq`, `/es/pages/support`, `/es/pages/documentation`) se presentan 100% en español sin remanentes accidentales.

### Frente 3: Identidad y Carácter de los 3 Presets
- **Sartorial (#166186909939):** Validar la elegancia de lujo editorial, jerarquía de tipografía serif/sans y consistencia de espaciados.
- **Edition (#166186942707):** Validar el minimalismo contemporáneo, botón "Ver colecciones" y armonía monocromática.
- **Archive (#166187041011):** Validar la proporción centrada del hero (`content_width: 46`), paleta cálida heritage y equilibrio visual.

### Frente 4: Componentes Interactivos y Rendimiento
- Probar apertura y cierre del mega menú (teclado: Flecha abajo, Tab, Escape).
- Probar galería PDP, visor de zoom y disposición a dos columnas con ATC en primer viewport.
- Probar reactividad del bloque de inventario y el carrusel/rejilla de Recently Viewed (0 a 4 tarjetas sin desbordamiento).

---

## 3. Entregable Esperado

- Informe formal en: `agent-comms/outbox-gpt/GPT-AUDIT-012-final-unified-audit.md`.
- Matriz de evaluación por tema y por idioma (`/` vs `/es/`).
- Verificaciones empíricas con comandos, capturas o lecturas de DOM ejecutadas.
- Lista de afirmaciones falsables numeradas y dictamen de cierre.
