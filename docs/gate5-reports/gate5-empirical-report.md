# Reporte de Auditoria Empirica - Compuerta 5 (Tienda Real)

**Fecha de ejecucion:** 2026-09-14T15:06:58.128Z
**URL Base:** `http://127.0.0.1:9292` (Shopify Theme Dev Proxy)

## 1. Resumen Ejecutivo

| Metrica | Resultado | Umbral Requerido | Estado |
| :--- | :--- | :--- | :--- |
| **Violaciones axe-core (WCAG 2.1/2.2 AA)** | **0** | 0 | PASA |
| **Jerarquia de Encabezados (h1 unico)** | **0 fallos** | 0 fallos | PASA |
| **Desbordamiento Horizontal (Mobile 390px)** | **0 fallos** | 0 fallos | PASA |
| **Cumulative Layout Shift (CLS)** | **0.1519** | < 0.1 | MEJORAR |
| **Areas Tactiles Movil (<44px)** | **3 fallos** | 0 fallos | REVISAR |

## 2. Detalle por Plantilla

### Plantilla: 404 (`/404-nonexistent-page`)

- **Movil (390x844):**
  - HTTP Status: `404`
  - CWV: CLS = `0`, LCP = `684ms`
  - Overflow: `No (perfecto)`
  - Encabezados: `1 <h1>`, Errores orden: `0`
  - Tap Targets (<44px): `0`
  - axe-core: `0` violaciones (29 reglas superadas)
- **Desktop (1280x900):**
  - HTTP Status: `404`
  - CWV: CLS = `0`, LCP = `892ms`
  - axe-core: `0` violaciones (29 reglas superadas)

### Plantilla: Home (`/`)

- **Movil (390x844):**
  - HTTP Status: `200`
  - CWV: CLS = `0`, LCP = `564ms`
  - Overflow: `No (perfecto)`
  - Encabezados: `1 <h1>`, Errores orden: `0`
  - Tap Targets (<44px): `1`
    - `a` ("A"): 21.6x44px
  - axe-core: `0` violaciones (32 reglas superadas)
- **Desktop (1280x900):**
  - HTTP Status: `200`
  - CWV: CLS = `0.011`, LCP = `560ms`
  - axe-core: `0` violaciones (31 reglas superadas)

### Plantilla: Collection (`/collections/all`)

- **Movil (390x844):**
  - HTTP Status: `200`
  - CWV: CLS = `0`, LCP = `904ms`
  - Overflow: `No (perfecto)`
  - Encabezados: `1 <h1>`, Errores orden: `0`
  - Tap Targets (<44px): `2`
    - `input` ("1"): 18.4x18.4px
    - `input` ("0"): 18.4x18.4px
  - axe-core: `0` violaciones (31 reglas superadas)
- **Desktop (1280x900):**
  - HTTP Status: `200`
  - CWV: CLS = `0.001`, LCP = `640ms`
  - axe-core: `0` violaciones (31 reglas superadas)

### Plantilla: PDP (`/products/qa-16-single-char`)

- **Movil (390x844):**
  - HTTP Status: `200`
  - CWV: CLS = `0`, LCP = `464ms`
  - Overflow: `No (perfecto)`
  - Encabezados: `1 <h1>`, Errores orden: `0`
  - Tap Targets (<44px): `0`
  - axe-core: `0` violaciones (28 reglas superadas)
- **Desktop (1280x900):**
  - HTTP Status: `200`
  - CWV: CLS = `0.152`, LCP = `492ms`
  - axe-core: `0` violaciones (28 reglas superadas)

### Plantilla: Search (`/search?q=sartorial`)

- **Movil (390x844):**
  - HTTP Status: `200`
  - CWV: CLS = `0`, LCP = `512ms`
  - Overflow: `No (perfecto)`
  - Encabezados: `1 <h1>`, Errores orden: `0`
  - Tap Targets (<44px): `2`
    - `input` ("1"): 18.4x52px
    - `input` ("0"): 18.4x52px
  - axe-core: `0` violaciones (30 reglas superadas)
- **Desktop (1280x900):**
  - HTTP Status: `200`
  - CWV: CLS = `0.001`, LCP = `464ms`
  - axe-core: `0` violaciones (30 reglas superadas)

## 3. Interactividad y Foco por Teclado (Cart Drawer)

- Disparador presente: `Si`
- Apertura de Drawer: `Si`
- Foco entra al Drawer: `Si`
- Escape cierra el Drawer: `Si`
- Foco restaurado al disparador: `Si`

