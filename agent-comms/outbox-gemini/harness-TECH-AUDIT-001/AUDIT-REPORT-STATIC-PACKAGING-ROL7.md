# INFORME DE AUDITORÍA: COMPUERTA ESTÁTICA Y EMPAQUETADO (ROL 7)

- **Identificador de Auditoría:** `TECH-AUDIT-001-ROL7`
- **Rol:** Auditor Estático y Empaquetado (Rol 7)
- **Fecha:** 2026-10-01 (UTC: 2026-10-02T02:33:00Z)
- **Directorio de Artefactos Crudos:** `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/`

---

## 1. COMPUERTA ESTÁTICA (`gates:static`)

### 1.1 Ejecución Top-Level
- **Comando:** `npm run gates:static`
- **Código de salida:** `1`
- **Ruta archivo crudo:** `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-gates-static.txt` (11,383 bytes)

#### Extracto literal del fallo:
```text
> shopify-theme-project@0.1.0 gates:static
> npm run gates:json && npm run gates:hooks && npm run gates:sanity && npm run gates:locales && npm run gates:ledger && npm run gates:theme-check && npm run gates:syntax && npm run gates:package

> shopify-theme-project@0.1.0 gates:json
> node scripts/json-validate.mjs

----------------------------------------------------------------------
JSON VALIDATE
----------------------------------------------------------------------
Archivos .json comprobados: 440
  de ellos en /listings/:    11  <- fuera del alcance de Theme Check
Fallos de parseo:           12
  scratch/audit-live-pull/full-atelier/config/settings_data.json: Unexpected token '/', "/*\n * ----"... is not valid JSON
  scratch/audit-live-pull/full-atelier/locales/en.default.json: Unexpected token '/', "/*\n * ----"... is not valid JSON
  ...
  scratch/store-push/archive/config/settings_data.json: Unexpected token '/', "/*\n * ---"... is not valid JSON
```

### 1.2 Causa Raíz Técnica
1. La compuerta top-level `gates:static` encadena 8 sub-compuertas mediante `&&`. Al fallar la primera (`gates:json`), el comando aborta sin llegar a las 7 restantes.
2. `scripts/json-validate.mjs` recorre recursivamente todo el repositorio (`REPO`) ignorando únicamente: `['node_modules', '.git', '.tmp', 'test-results', 'playwright-report', 'dist']`.
3. Existen archivos en carpetas de trabajo volátiles no añadidas a la lista de exclusión: `scratch/store-push/` y `scratch/audit-live-pull/`. Estos archivos fueron generados por `shopify theme pull` / sincronizaciones previas, las cuales anteponen cabeceras de comentarios C-style (`/* IMPORTANT: The contents of this file are auto-generated... */`).
4. **Estado del tema oficial:** El 100% de los archivos JSON oficiales del tema en `config/`, `locales/`, `sections/`, `templates/` y `listings/` son JSON válidos sin comentarios y con parsing impecable.

### 1.3 Ejecución Individual de Sub-Compuertas
Para garantizar transparencia y rigor técnico total, se ejecutaron individualmente todas las sub-compuertas estáticas:

| Sub-compuerta | Comando | Salida / Estado | Código Salida |
|---|---|---|---|
| `gates:json` | `node scripts/json-validate.mjs` | Falla por 12 archivos en `scratch/` (tema oficial limpio) | 1 |
| `gates:hooks` | `node scripts/dataset-hooks.mjs` | **EXITOSO** (22 componentes validados, 0 contratos rotos) | 0 |
| `gates:sanity` | `node scripts/theme-check-sanity.mjs` | **EXITOSO** (3 mutaciones sintéticas detectadas y sandbox limpio a 0 ofensas) | 0 |
| `gates:locales` | `node scripts/locale-key-inventory.mjs` | **EXITOSO** (83 archivos escaneados, 396 claves storefront, 452 schema, 0 huérfanas, 0 sin resolver) | 0 |
| `gates:ledger` | `node scripts/ledger-verify.mjs` | **EXITOSO** (57 filas de requisitos verificadas, 0 incoherencias) | 0 |
| `gates:syntax` | `node --check assets/theme.js && node --check assets/product-zoom.js` | **EXITOSO** (Sintaxis V8 JS válida en ambos scripts) | 0 |
| `gates:package` | `shopify theme package` | **EXITOSO** (`Sartorial-1.0.0.zip` generado) | 0 |
| `theme:check` (directo) | `npx shopify theme check` | 0 ofensas en archivos de tema oficiales (las 198 warnings observadas en escaneos amplios provinieron únicamente de la subcarpeta `scratch/store-push/`) | 0 |

---

## 2. AUDITORÍA DEL EMPAQUETADO ZIP (`Sartorial-1.0.0.zip`)

- **Paquete evaluado:** `Sartorial-1.0.0.zip`
- **Generador:** `shopify theme package` (oficial de Shopify CLI)
- **Ruta archivo crudo:** `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-zip-contents.txt` (11,551 bytes)

### 2.1 Métricas de Empaquetado
- **Tamaño en disco del archivo ZIP:** `359,370 bytes` (**350.95 KB** / **0.34 MB**)
- **Tamaño descomprimido total:** `1,241,404 bytes` (**1,212.31 KB** / **1.18 MB**)
- **Tamaño comprimido de datos:** `344,250 bytes` (**336.18 KB**)
- **Total de entradas en ZIP:** `106`
  - **Archivos:** `92`
  - **Directorios explícitos:** `14`

### 2.2 Verificación contra Requisitos Oficiales de Shopify Theme Store

| Requisito de Empaquetado | Regla Theme Store | Resultado en `Sartorial-1.0.0.zip` | Dictamen |
|---|---|---|---|
| **Límite de peso del ZIP** | Máximo 50 MB | 350.95 KB (0.34 MB) — representa el **0.7% del límite** | **PASS** |
| **Archivos ocultos (`.*`)** | Prohibidos (`.DS_Store`, `.git`, `.env`, etc.) | 0 archivos ocultos detectados | **PASS** |
| **Directorios prohibidos** | Prohibidos (`node_modules/`, `.git/`, `.github/`, `docs/`, `scripts/`, `agent-comms/`, etc.) | 0 entradas encontradas | **PASS** |
| **Archivos de dev en raíz** | Prohibidos (`package.json`, `.gitignore`, `playwright.config.js`, `README.md`, etc.) | 0 archivos encontrados | **PASS** |
| **Carpetas raíz permitidas** | Solo `assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`, `blocks`, `listings` | Encontradas: `assets`, `config`, `layout`, `listings`, `locales`, `sections`, `snippets`, `templates` (100% conformes) | **PASS** |
| **Estructura de Presets (`/listings/`)** | Obligatorio si > 1 preset. Subcarpetas por preset con `templates/` | 16 entradas bajo `listings/` (`archive`, `edition`, `sartorial`) con sus correspondientes `index.json`, `collection.json`, `product.json` | **PASS** |

---

## 3. MEDICIÓN DE PESOS DE ASSETS (JS Y CSS)

- **Ruta archivo crudo:** `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-asset-sizes.json` (6,021 bytes)
- **Metodología:** Medición byte a byte de archivos en disco (`assets/`), compresión determinista Gzip (`zlib.gzipSync`) y compresión Brotli (`zlib.brotliCompressSync`) a nivel de red CDN.

### 3.1 Pesos Individuales de Assets (`assets/`)

| Archivo | Tipo | Tamaño Raw (Bytes) | Tamaño Raw (KB) | Gzip (KB) | Brotli (KB) |
|---|---|---|---|---|---|
| `base.css` | CSS | 221,968 B | 216.77 KB | 41.09 KB | **33.08 KB** |
| `theme.js` | JS | 200,932 B | 196.22 KB | 43.72 KB | **35.05 KB** |
| `gsap.min.js` | JS | 72,927 B | 71.22 KB | 27.75 KB | **25.10 KB** |
| `gsap-scrolltrigger.min.js` | JS | 44,575 B | 43.53 KB | 17.58 KB | **15.84 KB** |
| `product-zoom.js` | JS | 12,522 B | 12.23 KB | 3.97 KB | **3.53 KB** |
| `motion.js` | JS | 8,235 B | 8.04 KB | 3.16 KB | **2.83 KB** |
| **Total assets repo** | — | **561,159 B** | **548.01 KB** | **137.27 KB** | **115.45 KB** |

### 3.2 Pesos Transferidos e Incluidos por Plantilla Principal

En `layout/theme.liquid`, `base.css` y `theme.js` se cargan globalmente. El paquete de animaciones GSAP (`gsap.min.js`, `gsap-scrolltrigger.min.js`, `motion.js`) se carga de forma condicional si `settings.animations == 'full'` (configuración por defecto en los 3 presets). `product-zoom.js` se carga exclusivamente en la ficha de producto (`sections/main-product.liquid` vía `snippets/product-zoom.liquid`).

#### A. Página de Inicio (`index.json` / Home)
- **CSS Transferido:** `base.css` -> **216.77 KB raw** (41.09 KB gzip / **33.08 KB brotli**)
- **JS Transferido (Modo Full - Defecto):** `theme.js` + `gsap.min.js` + `gsap-scrolltrigger.min.js` + `motion.js`
  - Raw: **319.01 KB** (326,669 bytes)
  - Gzip: **92.21 KB**
  - Brotli: **78.83 KB**
- **JS Transferido (Modo Lean - `animations: subtle/none`):** `theme.js`
  - Raw: **196.22 KB** (200,932 bytes)
  - Gzip: **43.72 KB**
  - Brotli: **35.05 KB**
- **Total Transferencia Red (Full / Brotli):** **111.91 KB** (CSS + JS)

#### B. Página de Colección (`collection.json`)
- **CSS Transferido:** `base.css` -> **216.77 KB raw** (41.09 KB gzip / **33.08 KB brotli**)
- **JS Transferido (Modo Full - Defecto):** `theme.js` + `gsap.min.js` + `gsap-scrolltrigger.min.js` + `motion.js`
  - Raw: **319.01 KB** (326,669 bytes)
  - Gzip: **92.21 KB**
  - Brotli: **78.83 KB**
- **JS Transferido (Modo Lean - `animations: subtle/none`):** `theme.js`
  - Raw: **196.22 KB** (200,932 bytes)
  - Gzip: **43.72 KB**
  - Brotli: **35.05 KB**
- **Total Transferencia Red (Full / Brotli):** **111.91 KB** (CSS + JS)

#### C. Página de Producto (`product.json` / PDP)
- **CSS Transferido:** `base.css` -> **216.77 KB raw** (41.09 KB gzip / **33.08 KB brotli**)
- **JS Transferido (Modo Full - Defecto con Zoom):** `theme.js` + GSAP bundle + `product-zoom.js`
  - Raw: **331.24 KB** (339,191 bytes)
  - Gzip: **96.18 KB**
  - Brotli: **82.37 KB**
- **JS Transferido (Modo Lean con Zoom):** `theme.js` + `product-zoom.js`
  - Raw: **208.45 KB** (213,454 bytes)
  - Gzip: **47.68 KB**
  - Brotli: **38.59 KB**
- **Total Transferencia Red (Full / Brotli):** **115.45 KB** (CSS + JS)

---

## 4. CERTIFICACIÓN DE INTEGRIDAD DE ARCHIVOS CRUDOS (`Get-Item`)

Se ejecutó `Get-Item` en PowerShell sobre los artefactos generados en `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/`. Certifico formalmente que ninguno tiene 0 bytes:

```powershell
Get-Item "agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-gates-static.txt", "agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-zip-contents.txt", "agent-comms/outbox-gemini/harness-TECH-AUDIT-001/raw-asset-sizes.json" | Format-Table Name, Length, LastWriteTime -AutoSize
```

### Resultado de la Certificación:
| Nombre del Archivo | Longitud (Bytes) | Fecha/Hora de Escritura | Estado Certificado |
|---|---|---|---|
| `raw-gates-static.txt` | **11,383 bytes** | 2026-10-01 22:27:17 | **VÁLIDO (> 0 bytes)** |
| `raw-zip-contents.txt` | **11,551 bytes** | 2026-10-01 22:30:52 | **VÁLIDO (> 0 bytes)** |
| `raw-asset-sizes.json` | **6,021 bytes** | 2026-10-01 22:33:08 | **VÁLIDO (> 0 bytes)** |
