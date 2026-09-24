# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5.5 Extra), GPT-6 Sol Max
Última actualización: 2026-09-24
Estado general: SPRINT 6A CERTIFICADO (`CLAUDE-REPORT-6A-001`) -> FILAS 78 Y 80 EN CUMPLIDO (44 CUMPLIDO / 77.2%) -> 5 PARCHES APLICADOS Y DESPLEGADOS EN VIVO (AXE = 0)
Próximo hito: Activación por Johandry de pasarela de prueba y 2do mercado para desbloquear Filas 79, 81, 82 y 63
```

---

## 1. Sprints Cerrados y Certificados

- **Sprint 5A - High-Fashion Catalog Architecture & Swatches:** Certificado en tienda real con 8 fixtures F01-F06, F10, F11 (`GPT-AUDIT-006`).
- **Sprint 5B - Luxury PDP Media & Accessible Zoom:** Certificado en tienda real (`GPT-AUDIT-008`). Hotfix F01 implementado con gestión atómica de foco.
- **Sprint 5C - The Luxury Triple Crown ($380 USD Tier):** Certificado en tienda real Couture #165809488115 (`GPT-AUDIT-011`). Mega Menú editorial bilingüe (0 CLS, tarjetas 4:5, links dinámicos localizados), Recently Viewed nativo (0-4 tarjetas, persistencia 8 IDs, sin overflow 390/360 px), inventario reactivo multi-estado (in_stock, low_stock, sold_out, preorder), acordeones bilingües y anuncio accesible de carrito. Filas 83-85 del ledger pasadas a `cumplido`.
- **Auditoría de Presets y Cierre de Fila 106:** Certificado en tienda real en los 4 temas independientes (`CLAUDE-REPORT-AUDIT-PRESETS-001`). Dictamen APTO. Sartorial 100% preservado. Parches H1 y H2 aplicados (`af6ee6d`). Fila 106 en `cumplido`.
- **Sprint 6A - Search, Markets & Storefront Hardening:** Certificado en tienda real (`CLAUDE-REPORT-6A-001`). Fila 80 (selector de idioma) y Fila 78 (búsqueda predictiva) pasadas a `cumplido`. 5 parches aplicados y desplegados a los 4 temas vivos: `ps-listbox-structure` (axe 0 violaciones), `localization-country-nojs` (fallback no-js con `data-localization-select`), `ps-price-sr-labels` (a11y precio oferta/habitual), `pdp-buy-buttons` (armonía tipográfica y margen trust) y `footer-payments-label`.

---

## 2. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | Acciones de Admin: Activar Bogus Gateway, 2do Mercado y envío manual de Newsletter (§5). | 🟡 Pendiente | Desbloqueo de Filas 79, 81, 82, 63 |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | 5 parches aprobados, aplicados y desplegados a los 4 temas. Ledger actualizado a 44 cumplido (77.2%). | 🟢 Cumplido | Supervisión y coordinación |
| **Claude (Opus 5.5 Extra)** | Implementador Principal / Auditor UX | Sprint 6A completado con informe exhaustivo (`CLAUDE-REPORT-6A-001`) y 5 parches listos. | 🟢 Cumplido | `CLAUDE-REPORT-6A-001.md` |
| **GPT-6 Sol Max** | Auditor Senior de Producto | Standby (reemplazado por Claude para esta auditoría por disponibilidad de usuario). | ⚪ En reposo | N/A |

---

## 3. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente por `scripts/ledger-verify.mjs` sobre 57 filas oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **44** | 77.2% | Verificados con código, pruebas estáticas y mediciones empíricas en tienda real. |
| `código completo` | **11** | 19.3% | Código funcional implementado; pendientes pruebas en tienda real / Gate 5. |
| `no verificado` | **2** | 3.5% | Dependencias comerciales del comerciante: publicación de docs/soporte (DP-001) y fotos demo. |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **57** | **100%** | Cobertura de especificación Shopify Theme Store v1.0.0. |

---

## 5. Bloqueadores y Acciones Requeridas del Merchant (Johandry)

1. **[Pagos] Activar Método de Pago de Prueba (Bogus Gateway):**
   - En Shopify Admin > *Configuración > Pagos*: Activar "(for testing) Bogus Gateway" o Shopify Payments en modo de prueba.
   - **Impacto:** Desbloquea de inmediato la **Fila 82** (Iconos de pago SVG en footer) y la **Fila 63** (Checkout acelerado en cart drawer y /cart).
2. **[Mercados] Configurar un Segundo Mercado con Otra Moneda:**
   - En Shopify Admin > *Configuración > Mercados*: Añadir un segundo mercado (ej. España/EUR o Canadá/CAD).
   - **Impacto:** Desbloquea la **Fila 79** (Selector de país/moneda y recálculo reactivo de precios).
3. **[Newsletter] Envío Manual en Storefront (2 minutos):**
   - En la portada, ingresar `test-audit@example.com` en el formulario y pulsar suscribirse, para sortear el hCaptcha humano. Repetir con email inválido `test-audit@example`.
   - **Impacto:** Desbloquea la **Fila 81** (Newsletter).
4. **[Contenido] Corregir Descripciones de 21 Productos:**
   - En Shopify Admin > *Productos*: 21 productos (Serra Coat, Nove Blazer, Wool Waistcoat...) tienen su descripción en inglés escrita en español en el campo `body_html` base.
5. **[Comercial] Filtro de Color en Search & Discovery:**
   - En Shopify Admin > *Apps > Search & Discovery > Filtros*: Añadir filtro para la opción de producto "Color" para activar las muestras facetadas en tienda viva.
6. **[Calidad de Imagen] Fotografía de Catálogo para Zoom de Tejido (R3):**
   - Subir fotografías de alta costura con resolución >= 3000 px de ancho para exhibir el detalle textil en PDP.
