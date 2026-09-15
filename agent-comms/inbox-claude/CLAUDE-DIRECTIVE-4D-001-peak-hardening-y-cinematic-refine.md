# DIRECTIVA TÉCNICA: SPRINT 4D-001 — PEAK HARDENING, STRESS TEST Y ELEVACIÓN CINEMÁTICA

```text
ID: CLAUDE-DIRECTIVE-4D-001
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Fable 5.1 Max / Opus 5 - Implementador Principal de Código)
Autoridad: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-15
Objetivo: Elevar el tema a su Prime/Peak comercial. Revisión destructiva a fondo, corrección de cualquier cabo suelto y rediseño de la presencia del sistema de movimiento (animaciones más visibles, suaves y fluidas con scroll cadencioso).
```

---

## 1. Contexto y Mandato de Negocio

El catálogo de demostración de **LINEA NOVE** (24 productos de alta sastrería y 6 colecciones) ya está 100% publicado y activo en la tienda (`tema-qkqpke0j.myshopify.com`). La base arquitectónica está sólida (8 compuertas en verde, 0 ofensas de Theme Check).

Sin embargo, Johandry ha instruido un **empuje definitivo de excelencia técnica y sensorial**:
1. **Presencia visual del movimiento:** Las animaciones actuales son demasiado tímidas/micro-rápidas; casi no se perciben. Quiere que el scroll se sienta lujoso, cadencioso, tardío y suave, con transiciones que transmitan alta gama sin sacrificar rendimiento.
2. **Stress testing destructivo ("Rómpelo todo"):** Someter el tema a los casos límite más hostiles para blindar la submission ante los auditores de Shopify Theme Store.
3. **Cierre de todos los detalles restantes:** Limpiar cualquier inconsistencia residual de CSS, JS o Liquid para que el tema quede en su *Peak/Prime* absoluto.

---

## 2. Bloque A: Sistema de Movimiento Cinemático "Atelier Prime"

### A1. Calibración de Tokens de Movimiento (`assets/base.css`)
Las duraciones de 160ms–320ms y el desplazamiento de 12px resultaron casi invisibles para el ojo humano en pantallas grandes. Se deben ajustar los tokens para una cadencia editorial:
- `--reveal-shift`: Incrementar a un rango de **`20px` a `28px`** (desplazamiento vertical perceptible y elegante, sin saltos bruscos).
- `--motion-base`: Elevar a **`600ms` a `750ms`** con curva de desaceleración de seda: `cubic-bezier(0.16, 1, 0.3, 1)` o `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- `--motion-slow`: Configurar en **`900ms` a `1100ms`** para transiciones de fondo, aperturas de diálogo y grandes masas visuales.
- `--reveal-stagger`: Incrementar a **`80ms` a `100ms`** entre elementos contiguos para que el ritmo secuencial sea claramente legible al hacer scroll.

### A2. Mayor Rango de Scroll Reveal Progresivo (`assets/theme.js`)
- Extender el selector `REVEAL_TARGETS` para abarcar:
  - Encabezados de sección (`.section-header`, `.complete-the-look__header`, `.curated-showcase__header`).
  - Tarjetas de bento, tarjetas de producto en grid y bloques editoriales.
  - Bloques de testimonios / citas del manifiesto.
- **Scroll Suave y Físicas:** Ajustar el `IntersectionObserver` con un `rootMargin: '0px 0px -6% 0px'` y `threshold: 0.05` para que los elementos comiencen su entrada cuando el usuario realmente los alcanza en su campo visual.

### A3. Micro-interacciones de Lujo
- **Hover en Product Cards:** Transición suave de escala en la imagen (`transform: scale(1.025)`) con transición de `var(--motion-base)` y `ease-out`.
- **Botones y CTAs:** Transición fluida de fondo y color al pasar el cursor o hacer foco.
- **Cart Drawer:** Escalonado de entrada en los ítems del carrito cuando se abre el cajón.

### A4. Salvaguardas de Theme Store (Innegociables)
- **LCP Protegido:** El Hero editorial NUNCA debe retrasar su renderizado por JS. La imagen principal debe cargar de inmediato sin opacity 0.
- **Accesibilidad:** `@media (prefers-reduced-motion: reduce)` debe anular el 100% de las animaciones y transformaciones de inmediato (`opacity: 1 !important; transform: none !important;`).
- **Métricas límite:** LCP < 2.5s, CLS < 0.05, Performance Móvil >= 60.

---

## 3. Bloque B: Stress Test Destructivo ("Rómpelo Todo")

Claude debe simular y auditar el comportamiento del tema ante los siguientes escenarios degenerados:

1. **Estado Vacío Extremo:**
   - Carrito vacío (`cart-drawer` y página `/cart`).
   - Búsqueda predictiva y página de búsqueda sin resultados (`/search?q=xyzinexistente`).
   - Colección vacía (0 productos).
2. **Estado de Catálogo Hostil:**
   - Productos con títulos de 140+ caracteres (verificar que no rompan la rejilla ni los modales).
   - Precios con separadores largos y decimales atípicos.
   - Producto con 40 variantes y nombres de opciones extensos.
   - Producto con 0 imágenes (fallback de placeholder limpio y elegante).
   - Producto agotado (`available: false`): badges de sold out, botones deshabilitados sin errores de JS.
3. **Estrés de Interacción y Concurrencia:**
   - Ráfaga de clics en selector de cantidad (`+` / `-`) en el carrito: verificar que `syncCart` o el debouncer no generen condiciones de carrera ni desincronicen el DOM.
   - Apertura y cierre rápido de drawers y modales con `Escape` y clics en el backdrop.
   - Navegación por teclado (tab, enter, espacio) verificando que el focus trap sea impenetrable en modales y drawers.

---

## 4. Bloque C: Cierre Técnico y Calidad de Código

1. **Localización y Schemas:**
   - Verificar que no exista ningún string hardcodeado en Liquid. 100% gestionado mediante `t:`.
   - Verificar que todos los settings de schemas tengan labels en *Sentence case*, descripciones claras y atributos `info` donde dependa de configuración externa.
2. **Theme Check:**
   - Ejecutar `shopify theme check` sobre los 91+ archivos: **0 errores y 0 advertencias**.
3. **Consistencia de Repositorio (Regla Crítica):**
   - Cero URLs fijas o `shopify://` en los archivos locales.

---

## 5. Protocolo de Entrega de Claude

- **No hacer commit ni push:** Todo el código debe quedar escrito en el árbol de trabajo local para auditoría de Gemini y aprobación de Johandry.
- **Entregable formal:** Redactar y guardar en `agent-comms/outbox-claude/CLAUDE-REPORT-4D-001.md`.
- El reporte debe desglosar:
  1. Cambios exactos en movimiento y CSS/JS (tokens, valores anteriores vs nuevos).
  2. Fallas encontradas durante el stress test y cómo fueron remediadas.
  3. Resultado de Theme Check y scripts de compuertas estáticas.
  4. Estado del Ledger.
