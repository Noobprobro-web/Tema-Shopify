# AUDIT REPORT: RENDIMIENTO LIGHTHOUSE (ROL 1)
**Identificador de Auditoría:** `TECH-AUDIT-001`  
**Rol:** Rol 1 — Auditor de Rendimiento Lighthouse  
**Fecha:** 2026-10-02  
**Herramienta:** Lighthouse Programático Oficial (Lighthouse 13.5.0) sobre Chromium Headless con Remote Debugging Port (`--remote-debugging-port=9222`) y autenticación storefront de sesión (cookies `_shopify_essential`).  
**Alcance de Ejecución:** 54 auditorías completadas (3 tiendas demo × 3 páginas representativas × 2 form factors × 3 repeticiones).

---

## 1. Resumen Ejecutivo y Dictamen Oficial Theme Store

- **Umbral Exigido por Shopify Theme Store:** Media de rendimiento móvil $\ge 60/100$.
- **Media Global Móvil Obtenida:** **98.0 / 100**
- **Media Global Escritorio Obtenida:** **98.7 / 100**
- **Dictamen:** **APROBADO CON EXCELENCIA (SUPERAVIT DE +38 PUNTOS)**. Las 3 tiendas demo oficiales de Sartorial superan con holgura el umbral reglamentario exigido para la aprobación comercial en la Shopify Theme Store.

---

## 2. Metodología de Auditoría y Pacing

1. **Entorno Controlado:**
   - Para eludir fallos conocidos de permisos y bloqueos de archivos en Windows (`EPERM` en `chrome-launcher` al destruir directorios temporales), el arnés levantó una instancia persistente de Chromium mediante Playwright controlada en el puerto CDP 9222.
   - Lighthouse 13.5.0 ejecutó las auditorías programáticas conectándose directamente a dicho puerto.
2. **Autenticación Storefront y Desbloqueo:**
   - Se inyectaron los headers HTTP `Cookie` con el token de sesión esencial de Shopify (`_shopify_essential`) previamente persistido en caché local `%TEMP%\sartorial-audit-final-002\*.cookies.json`.
   - Se verificó que el 100% de las 54 ejecuciones evaluaron la tienda viva real y no la pantalla de bloqueo `/password` (`finalDisplayedUrl` validado contra la ruta real del catálogo).
3. **Pacing y Resiliencia 429:**
   - Pausa mínima de 2500 ms entre peticiones y reintentos automáticos con backoff exponencial. Cero fallos no recuperados en las 54 ejecuciones.
4. **Cálculo de Métricas:**
   - Cada combinación de (Tienda × Página × Form Factor) se ejecutó 3 veces consecutivas. Los valores reportados corresponden a la **mediana matemática exacta** de las 3 corridas.

---

## 3. Tabla Completa de Resultados y Medianas (54 Corridas)

| Tienda | Página / Ruta | Dispositivo | Score (Mediana) | LCP (s) | CLS | TBT (ms) | INP | Corridas Individuales (Score) |
|---|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Sartorial Atelier** | Home (`/`) | Móvil | **99** | 2.01s | 0.000 | 3ms | *N/A (Lab)* | [85, 99, 99] |
| **Sartorial Atelier** | Home (`/`) | Escritorio | **99** | 0.99s | 0.000 | 0ms | *N/A (Lab)* | [99, 99, 98] |
| **Sartorial Atelier** | Colección (`/collections/all`) | Móvil | **98** | 2.32s | 0.000 | 0ms | *N/A (Lab)* | [98, 98, 98] |
| **Sartorial Atelier** | Colección (`/collections/all`) | Escritorio | **99** | 0.99s | 0.000 | 0ms | *N/A (Lab)* | [98, 99, 99] |
| **Sartorial Atelier** | PDP (`/products/serra-coat`) | Móvil | **98** | 1.99s | 0.000 | 1ms | *N/A (Lab)* | [99, 98, 97] |
| **Sartorial Atelier** | PDP (`/products/serra-coat`) | Escritorio | **99** | 0.99s | 0.000 | 0ms | *N/A (Lab)* | [98, 99, 99] |
| **Sartorial Edition** | Home (`/`) | Móvil | **98** | 2.33s | 0.000 | 46ms | *N/A (Lab)* | [80, 99, 98] |
| **Sartorial Edition** | Home (`/`) | Escritorio | **99** | 0.88s | 0.000 | 0ms | *N/A (Lab)* | [99, 99, 99] |
| **Sartorial Edition** | Colección (`/collections/all`) | Móvil | **98** | 2.45s | 0.000 | 7ms | *N/A (Lab)* | [98, 98, 97] |
| **Sartorial Edition** | Colección (`/collections/all`) | Escritorio | **99** | 0.87s | 0.000 | 0ms | *N/A (Lab)* | [98, 99, 99] |
| **Sartorial Edition** | PDP (`/products/structured-tote`) | Móvil | **99** | 2.01s | 0.000 | 66ms | *N/A (Lab)* | [97, 99, 99] |
| **Sartorial Edition** | PDP (`/products/structured-tote`) | Escritorio | **99** | 0.88s | 0.000 | 0ms | *N/A (Lab)* | [99, 99, 98] |
| **Sartorial Archive** | Home (`/`) | Móvil | **96** | 2.57s | 0.000 | 114ms | *N/A (Lab)* | [76, 97, 96] |
| **Sartorial Archive** | Home (`/`) | Escritorio | **98** | 1.03s | 0.000 | 0ms | *N/A (Lab)* | [98, 98, 98] |
| **Sartorial Archive** | Colección (`/collections/all`) | Móvil | **98** | 2.39s | 0.000 | 2ms | *N/A (Lab)* | [99, 97, 98] |
| **Sartorial Archive** | Colección (`/collections/all`) | Escritorio | **98** | 0.99s | 0.000 | 0ms | *N/A (Lab)* | [98, 98, 97] |
| **Sartorial Archive** | PDP (`/products/1990-pinstripe-double-breasted-jacket`) | Móvil | **98** | 2.02s | 0.000 | 4ms | *N/A (Lab)* | [98, 97, 99] |
| **Sartorial Archive** | PDP (`/products/1990-pinstripe-double-breasted-jacket`) | Escritorio | **98** | 1.05s | 0.000 | 0ms | *N/A (Lab)* | [99, 98, 98] |

---

## 4. Dictamen Técnico sobre INP (Interaction to Next Paint)

- **Métrica INP en Lighthouse Sintético Estático:** `null / notApplicable`.
- **Justificación Técnica:**
  El motor oficial de Lighthouse (verificado directamente en `core/audits/metrics/interaction-to-next-paint.js`) declara explícitamente:
  `if (settings.throttlingMethod === 'simulate') return { score: null, notApplicable: true };` y `if (interactionEvent === null) return { score: null, notApplicable: true };`.
  INP es una métrica de campo (RUM - Real User Monitoring) que requiere registrar la latencia de respuesta ante interacciones físicas del usuario (clics de mouse, pulsaciones de teclado, toques de pantalla táctil) a lo largo de todo el ciclo de vida de la página. En una auditoría de navegación estática automatizada no existen interacciones de usuario y el motor de simulación Lantern no simula eventos de interacción.
- **Proxy Oficial de Laboratorio:**
  Para evaluar la capacidad de respuesta y fluidez del hilo principal ante interacciones, el estándar oficial de Google y Lighthouse es el **Total Blocking Time (TBT)**. En las 54 ejecuciones, el TBT de Sartorial se mantuvo entre **0 ms y 114 ms**, situándose íntegramente en la franja "Buena" (< 200 ms) de Web Vitals.

---

## 5. Cuantificación y Desglose de Impacto de GSAP (Modo Full vs Modo Lean)

A partir de la medición física exacta de los activos en disco (`assets/`) y compresión CDN (`raw-asset-sizes.json`):

### Desglose de Archivos de la Suite GSAP:
1. `gsap.min.js`: 72,927 bytes sin comprimir (71.22 KB) | 28,420 bytes gzip (27.75 KB) | **25,706 bytes brotli (25.10 KB)**.
2. `gsap-scrolltrigger.min.js`: 44,575 bytes sin comprimir (43.53 KB) | 18,003 bytes gzip (17.58 KB) | **16,225 bytes brotli (15.84 KB)**.
3. `motion.js`: 8,235 bytes sin comprimir (8.04 KB) | 3,236 bytes gzip (3.16 KB) | **2,901 bytes brotli (2.83 KB)**.

### Comparativa de Carga Transferida (Wire Transfer) en Plantillas Home / Colección:
- **Modo Full (Animaciones Completas con Suite GSAP):**
  - JS Incluido: `theme.js` + `gsap.min.js` + `gsap-scrolltrigger.min.js` + `motion.js`
  - Peso Raw: **326,669 bytes (319.01 KB)**
  - Peso Gzip: **94,424 bytes (92.21 KB)**
  - Peso Brotli (CDN Shopify estándar): **80,727 bytes (78.83 KB)**
- **Modo Lean (Animaciones Sutiles o Nulas):**
  - JS Incluido: Únicamente `theme.js` (la suite GSAP se omite por completo)
  - Peso Raw: **200,932 bytes (196.22 KB)**
  - Peso Gzip: **44,765 bytes (43.72 KB)**
  - Peso Brotli (CDN Shopify estándar): **35,895 bytes (35.05 KB)**
- **Delta Exacto Ahorrado por Modo Lean:**
  - Reducción Raw: **125,737 bytes (-122.79 KB)**
  - Reducción Gzip: **49,659 bytes (-48.50 KB)**
  - Reducción Brotli: **44,832 bytes (-43.78 KB)**
  - **Porcentaje de Reducción en Carga JS Inicial:** **-55.5%** de bytes JavaScript transferidos sobre Brotli en modo Lean.

---

## 6. Verificación de Artefactos Crudos en Disco

- **Directorio de Informes Crudos:** `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/lighthouse/`
- **Total de Informes JSON Crudos Generados:** **54 archivos**
- **Archivo de Resumen Consolidado:** `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-lighthouse-summary.json` (52,031 bytes)
- **Verificación de Integridad de Archivos:**
  Ejecución de comprobación mediante PowerShell `Get-ChildItem`:
  - Archivos con 0 bytes: **0**
  - Rango de tamaño por informe: **197 KB – 236 KB**
  - Contenido: Árbol LHR completo de Lighthouse 13.5.0 con trazas, tiempos, categorías y auditorías completas.
