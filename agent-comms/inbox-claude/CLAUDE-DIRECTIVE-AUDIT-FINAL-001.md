# CLAUDE-DIRECTIVE-AUDIT-FINAL-001: Auditoría Integral Pre-Submission Multi-Agente — Seguridad, Rendimiento, Accesibilidad y Robustez de Presets

```text
Ruta: agent-comms/inbox-claude/CLAUDE-DIRECTIVE-AUDIT-FINAL-001.md
Autoridad: Johandry / Ruiz Digital (Dueño) · Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Destinatario: Claude (Opus 5.5 Extra - Implementador Principal y Auditor Senior UX/UI)
Referencia directa: Orden de Johandry ("auditoria completa multiagente, pendiente del plan del proyecto")
Insumos: final-certification-plan.md, CLAUDE-REPORT-6B-001.md, prompt_draft.md, docs/requirements-ledger.md
Estado: AUTORIZADO PARA EJECUCIÓN INMEDIATA
Fecha: 2026-09-25
```

---

## 1. Contexto y Directriz Suprema

1. **Estado del Proyecto:**
   - El 100% del alcance técnico está completado y certificado en el ledger vivo (`docs/requirements-ledger.md`): **55 cumplido (96.5%)**, 0 código completo, 0 ausente.
   - Las 7 filas de Sprint 6B/6C (76, 47, 53, 73, 35, 46, 72) están verificadas en tienda real.
   - Todas las compuertas estáticas (`npm run gates:static`) pasan con **0 ofensas** (150 archivos inspeccionados), 0 contratos rotos y paquete `Sartorial-1.0.0.zip` generado.
2. **Mandato del Usuario (Johandry):**
   - Ejecutar una **Auditoría Integral Multi-Agente Pre-Submission** antes de la subida a Shopify Theme Store.
   - **REGLA DE ORO VINCULANTE: MODO ESTRICTO DE SOLO LECTURA (READ-ONLY).** Está terminantemente prohibido modificar archivos existentes de producción durante esta auditoría. Todo hallazgo debe documentarse con ruta, línea, impacto y propuesta de parche sin alterar el repositorio.
3. **Preservación de Marca:**
   - La identidad visual, tipografía editorial, paleta de colores y espaciados de **Sartorial** ($380 USD Luxury tier) y de los presets **Edition** y **Archive** deben verificarse como 100% intactos.

---

## 2. Entorno y Tiendas de Prueba

- **Tienda de Desarrollo:** `https://tema-qkqpke0j.myshopify.com`
- **Storefront Password:** `1234`
- **Temas Desplegados para la Auditoría:**
  - **Couture (Live):** `#165809488115` (`https://tema-qkqpke0j.myshopify.com`)
  - **Sartorial (Principal):** `#166186909939` (`https://tema-qkqpke0j.myshopify.com?preview_theme_id=166186909939`)
  - **Edition:** `#166186942707` (`https://tema-qkqpke0j.myshopify.com?preview_theme_id=166186942707`)
  - **Archive:** `#166187041011` (`https://tema-qkqpke0j.myshopify.com?preview_theme_id=166187041011`)
- **Resoluciones Mandatorias:**
  - Desktop: 1280x800
  - Tablet: 768x1024
  - Mobile: 375x812 y 360x780

---

## 3. Pistas de Auditoría Especializada (Tracks)

### Track 1: Seguridad, Sanitización y Fugas de Datos (Liquid & JS)
- Auditar inyecciones XSS en parámetros de búsqueda (`predictive-search.liquid`, `main-search.liquid`), inputs de facetas (`facets-active-filters.liquid`) y atributos HTML dinámicos.
- Comprobar el filtrado correcto de cadenas con `escape`, `strip_html` y serialización segura con `json`.
- Verificar que ningún endpoint local ni snippet exponga metadatos privados de clientes o variables sensibles.
- Comprobar que no se usen `eval()`, `innerHTML` inseguro con entradas de usuario o inline scripts que violen la CSP estándar de Shopify.

### Track 2: Core Web Vitals y Rendimiento Dinámico
- Medir CLS real en Home, Colección y PDP (móvil y desktop). Comprobar que el valor se mantenga estrictamente `< 0.1`.
- Comprobar optimización de LCP: presencia de `fetchpriority="high"` en la imagen principal de hero y primera imagen de PDP, ausencia de `loading="lazy"` en recursos críticos 'above the fold'.
- Confirmar cero scripts bloqueantes externos (100% vanilla JS sobre Web Components nativos) y carga condicional estricta de `shopify-xr.js`.

### Track 3: Accesibilidad WCAG 2.2 Nivel AA Dinámica
- Ejecución de escaneo automatizado con `axe-core` 4.10.2 en Home, Colección y PDP en los 4 temas (debe dar 0 violaciones críticas o serias).
- Verificación de navegación por teclado real:
  - Mega Menú: navegación con Tabulador y flechas, apertura/cierre accesible.
  - Cajón de carrito (`cart-drawer`): focus trap estricto, Escape, foco restaurado al disparador.
  - Búsqueda predictiva: navegación de sugerencias con flechas Arriba/Abajo, foco en input, escape y restauración.
  - Diálogo modal de Zoom (`<product-zoom>`): apertura, navegación interna, Escape y restauración atómica de foco al botón original.
  - Píldoras de filtros activos: remoción vía teclado y foco de contingencia.
- Medición de ratios de contraste: texto >= 4.5:1 (incluyendo hero con velo `gradient_content` al 60% en Sartorial) y elementos de interfaz >= 3:1.

### Track 4: Auditoría de Estados Degenerados (Compuerta 2)
Auditar cómo responde la interfaz ante casos límite:
- **Vacío:** Colección sin productos, carrito vacío, recomendaciones sin resultados, blog sin artículos.
- **Uno solo:** Colección de 1 producto, producto de 1 variante, blog de 1 artículo.
- **Muchos:** Galería PDP con 10+ imágenes/videos, producto con 40+ variantes, colección con paginación de 50+ productos.
- **Muy largo:** Título de producto de 120 caracteres, vendor extenso, precios con decimales y símbolos largos sin desbordamiento.
- **Faltante:** Producto sin imagen (fallback elegante), producto sin descripción, imagen secundaria ausente.

### Track 5: Consistencia de Superficie del Comerciante y Localización (Compuertas 3 y 4)
- 100% de los labels de schema gestionados mediante `t:`.
- Cero claves faltantes o sin resolver en `locales/en.default.json` y `locales/es.json`.
- Redacción neutra en inglés para comerciante en sentence case, sin jerga de desarrollo ("popover", "bento", "intent").
- Atributo `info` presente en configuraciones que dependan de factores externos.

---

## 4. Entregable Esperado

Generar el informe final en:
`agent-comms/outbox-claude/CLAUDE-REPORT-AUDIT-FINAL-001.md`

Con la cabecera estándar de trazabilidad:
```markdown
# CLAUDE-REPORT-AUDIT-FINAL-001: Informe de Auditoría Integral Pre-Submission
Fecha: 2026-09-25
Autor: Claude (Opus 5.5 Extra)
Destinatario: Gemini Flash 3.8 High & Johandry
Dictamen Global: [APTO / APTO CON OBSERVACIONES / NO APTO]
```

Detallando:
1. Resumen ejecutivo de la auditoría.
2. Resultados por Track (Seguridad, CWV, WCAG 2.2 AA, Estados Degenerados, Superficie Comerciante).
3. Matriz de los 4 temas probados (Couture, Sartorial, Edition, Archive) a 1280px y 375px/360px.
4. Hallazgos específicos con `archivo:línea`, impacto y recomendación de remediación si correspondiera.
5. Veredicto final para submission a Shopify Theme Store.
