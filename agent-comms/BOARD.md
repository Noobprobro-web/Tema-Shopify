# BOARD.md: Tablero Maestro de Coordinación y Estado en Tiempo Real

```text
Ruta estable: agent-comms/BOARD.md
Único escritor autorizado: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Lectura obligatoria para: Johandry, Claude (Opus 5.5 Extra), GPT-6 Sol Max
Última actualización: 2026-09-23
Estado general: SPRINT 5B CERTIFICADO Y CERRADO (GPT-AUDIT-008) -> KICKOFF Y ALINEACIÓN DE SPRINT 5C (Mega Menú Editorial y Retención de Lujo)
Próximo hito: Directiva técnica vinculante para Sprint 5C y ejecución por Claude Opus 5.5 Extra
```

---

## 1. Sprint Cerrado: SPRINT 5B - LUXURY PDP MEDIA & ACCESSIBLE ZOOM (Certificado 100%)

**Certificación de Cierre:** Emitida por GPT-6 Sol Max en [`agent-comms/outbox-gpt/GPT-AUDIT-008-sprint-5b-certification.md`](outbox-gpt/GPT-AUDIT-008-sprint-5b-certification.md) tras verificar la remediación de F01 en la tienda viva (`tema-qkqpke0j.myshopify.com/products/qa5a-f04-colour-size` en EN/ES a 1280px, 390px y 360px).
- **Web Component `<product-zoom>` en `assets/product-zoom.js`:** 11.945 bytes (3.850 bytes gzipped), cero dependencias, carga diferida `defer` exclusiva en PDP.
- **Interacciones nativas:** `<dialog>` modal, protección de resolución natural anti-pixelado, gestos táctiles (pinch, drag, double-tap), teclado completo (+, -, 0, flechas, Home, End, Tab trapped, Escape).
- **Gestión atómica de foco (F01 resuelto):** Foco reubicado proactivamente en las 6 rutas críticas antes de mutar `hidden`/`disabled`. Cero pérdidas a `BODY`.
- **Optimizaciones de medios:** H-07 (`sizes` 30vw en rejilla), H-13 (pausa de `<video>`, YouTube y Vimeo al cambiar slide) y H-19 (alts secuenciales descriptivos).
- **Calidad estática:** 118 archivos inspeccionados por Theme Check con 0 ofensas, 394 claves con paridad total EN/ES y 25/25 pruebas en arnés automatizado.

---

## 2. Sprint Activo: SPRINT 5C - EDITORIAL MEGA MENU & LUXURY COMMERCE

**Objetivo Estratégico ($380 USD Tier):** Implementar la experiencia de navegación de cabecera propia de los grandes temas de lujo (Prestige, Focal) y resolver los pulidos de retención pendientes:
1. **Mega Menú Editorial Multicolumna en Cabecera (`sections/header.liquid`):**
   - Transición de dropdown simple de 1 columna a Mega Menú estructurado en columnas por enlaces de segundo nivel con sub-enlaces de tercer nivel.
   - Bloques promocionales editoriales (`mega_menu_promo`) configurables desde el editor de temas: imagen destacada, título de colección/campaña, subtítulo y enlace directo (1 a 2 bloques por menú).
   - Accesibilidad completa WCAG 2.2 AA (navegación fluida por Tabulador, Escape para cerrar, `aria-expanded`, sin trampas de foco).
   - 0 KB de JS nuevo: basado en la arquitectura existente `<theme-disclosure>` con imágenes `loading="lazy"`.
2. **Pulido P2-01 (Actualización de Live Region en Resize):**
   - Actualización del porcentaje anunciado en `announce()` tras `layout()` si la escala se reajusta por giro de pantalla o resize con zoom activo (`assets/product-zoom.js:71-86`).
3. **Cart Drawer Accesible & Retención:**
   - Anuncio sonoro explícito en live region al agregar producto ("*Added Serra Coat - Size M to cart*").

---

## 3. Asignaciones Activas por Agente

| Agente | Rol Actual | Tarea en Curso | Estado | Entregable Esperado |
|---|---|---|---|---|
| **Johandry / Ruiz Digital** | Dueño / Negocio | 1) Decisión/aprobación de alcance para Sprint 5C. 2) Opcional: configurar filtro "Color" en Search & Discovery. | 🟢 Activo | Aprobación de alcance |
| **Gemini Flash 3.8 High** | Arquitecto / Orquestador | Cierre de Sprint 5B, actualización de `BOARD.md` y `docs/decisions.md`, y redacción de directiva Sprint 5C. | 🟢 Activo | `CLAUDE-DIRECTIVE-5C-001.md` |
| **Claude (Opus 5.5 Extra)** | Implementador Principal / Disciplina Técnica | Preparado para recibir directiva 5C e implementar mega menú editorial y pulidos. | 🔵 En espera de directiva | `CLAUDE-REPORT-5C-001.md` |
| **GPT-6 Sol Max** | Auditor Senior de Producto | Certificación 5B completada (`GPT-AUDIT-008`). En reposo para auditar Sprint 5C. | 🟢 Completado | Auditoría de producto de Sprint 5C |

---

## 4. Estado del Ledger de Requisitos (`docs/requirements-ledger.md`)

*Conteo auditado matemáticamente sobre las 54 filas de requisitos oficiales:*

| Estado Canónico | Total Filas | % | Descripción |
|---|---|---|---|
| `cumplido` | **38** | 70.4% | Verificados con código, pruebas estáticas y mediciones empíricas en tienda real. |
| `código completo` | **14** | 25.9% | Código funcional implementado; fila 73 de Zoom PDP verificada en tienda viva; pendiente hardware multitáctil. |
| `no verificado` | **2** | 3.7% | Dependencias comerciales del comerciante: publicación de docs/soporte (DP-001) y fotos demo. |
| `ausente` | **0** | 0.0% | 0 requisitos sin atender. |
| **TOTAL** | **54** | **100%** | Cobertura de especificación Shopify Theme Store v1.0.0. |

---

## 5. Bloqueadores y Dependencias del Merchant (Johandry)

1. **[Comercial] Filtro de Color en Search & Discovery:**
   - En Shopify Admin > *Apps > Search & Discovery > Filtros*: Añadir filtro para la opción de producto "Color" para activar las muestras facetadas en tienda viva.
2. **[Calidad de Imagen] Fotografía de Catálogo para Zoom de Tejido (R3):**
   - Para la submission final a Shopify Theme Store, subir fotografías de alta costura con resolución >= 3000 px de ancho para exhibir el detalle textil.
