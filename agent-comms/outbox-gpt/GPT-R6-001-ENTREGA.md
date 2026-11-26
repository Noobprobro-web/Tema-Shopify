ID: GPT-TASK-R6-001
Estado: Implementado y validado en código; rama subida. Sin PR porque GitHub denegó la creación por API.
Decisión requerida: Claude debe abrir el PR borrador y completar la compuerta 5 en la tienda de QA.
Resumen en 5 líneas:
- Los 422 de `/cart` muestran el texto de Shopify junto a la línea afectada y enlazan el campo con `aria-describedby`.
- El mensaje usa `textContent`, conserva el anuncio existente y no añade otro live region.
- Los cambios de la misma línea limpian su aviso; un fallo en otra línea conserva los avisos existentes.
- Se añadieron 12 pruebas R6 y se actualizaron las filas de carrito y live regions del ledger, que siguen en `código completo`.
- `npm run gates:static` y 149 pruebas Playwright pasaron; la ZIP de 111 archivos se validó localmente, no en tienda.
Archivos tocados: `assets/theme.js`, `tests/r6-cart-line-error.spec.mjs`, `tests/support/r3-support.mjs`, `docs/requirements-ledger.md`, este informe y `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`.
Desviaciones (Nivel 1 o Nivel 2): Ninguna de alcance o contrato. GitHub impidió crear el PR; ver §9.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): `npm run gates:static` pasó en `3974cfc`; 149 Playwright pasaron (excluido `pdp-line-total.spec.mjs`); el spec R6 falla con los assets de base (10 fallos, 2 pases) y pasa con el cambio (12/12). La ZIP tiene 111 archivos, checksum `292abb31b104eda44ac4fde78c32c53fefc1c6b4704ffaef381066769a0b0bd4`; `unzip -t`, `node --check` de los JS extraídos y referencias internas pasaron. Esto no demuestra el comportamiento en una tienda real.
Lista de afirmaciones falsables numeradas:
1. `origin/master` comprobado fue `1758bd6a08cdb79d0d479fddc10224bfa9316adb` y contiene el encargo R6.
2. La rama `gpt/r6-cart-line-error` parte de esa base y contiene el commit de implementación `3974cfc`.
3. El mensaje visible está asociado al campo por clave de línea y no tiene `role` ni `aria-live`.
4. Las cinco filas de estados límite del encargo tienen casos en `tests/r6-cart-line-error.spec.mjs`.
5. El cambio no fue validado en tienda; Claude conserva pendiente la compuerta 5.

## 1. Rama, commits y PR

- Rama: `gpt/r6-cart-line-error`, creada desde `origin/master` en `1758bd6a08cdb79d0d479fddc10224bfa9316adb`.
- Commit de código: `3974cfc` — `Muestra errores de stock por línea en el carrito`.
- Push a `origin/gpt/r6-cart-line-error`: correcto.
- PR borrador: no creado. La CLI recibió `Forbidden` tanto en GraphQL como en REST; no existe un enlace de PR que pueda adjuntar. Claude debe abrirlo.

## 2. Archivos y líneas

- `assets/theme.js:326-419`: crea y limpia avisos por fila, asocia el campo sin reemplazar descripciones previas, conserva avisos de otras líneas cuando otra falla y los incorpora antes de restaurar el foco.
- `assets/theme.js:7334,7367,7377-7390`: limpia el aviso de la línea editada, pasa errores por `renderCartResponse` y conserva el mensaje en la página si falla la lectura de sección.
- `tests/r6-cart-line-error.spec.mjs:57-207`: casos de página, cajón, sanitización de texto, asociación accesible, sustitución por éxito, lectura fallida y estados límite.
- `tests/support/r3-support.mjs:190-193`: fixture de carrito con `.cart-item__details`, acorde al markup real.
- `docs/requirements-ledger.md:60,153`: evidencia R6 en las filas de Live Regions y carrito sincronizado.
- `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`: manifiesto de la ZIP generada desde el commit de código `3974cfc`.

## 3. Tests y compuertas

Playwright en el entorno no encontró el Chromium descargado por Playwright (`/home/agent/.cache/ms-playwright` no existe) y el CDN devolvió HTTP 403. Para ejecutar las pruebas usé `/usr/bin/chromium` mediante un config temporal `playwright.system.config.mjs`, eliminado después; el config no forma parte de la rama.

- Baseline de los assets: `BASE=$(git rev-parse origin/master); git show "$BASE":assets/theme.js > /tmp/r6-base-theme.js; git show "$BASE":assets/base.css > /tmp/r6-base-base.css; R3_THEME_JS=/tmp/r6-base-theme.js R3_BASE_CSS=/tmp/r6-base-base.css npx playwright test --config=playwright.system.config.mjs tests/r6-cart-line-error.spec.mjs` → `10 failed`, `2 passed`. Los seis casos obligatorios (texto visible, asociación, no duplicación, desaparición/retención, página con cajón y lectura fallida) fallan con la base. La protección del cajón pasa también en base; se comprobó además sola con `-g 'drawer keeps its existing'` → `1 passed`.
- Después: `npx playwright test --config=playwright.system.config.mjs tests/r6-cart-line-error.spec.mjs` → `12 passed`.
- Compuerta 2, incorporada en el spec: carrito vacío tras eliminar, una línea, 11 líneas, texto de 300 caracteres con título de 120 a 375 px y respuesta sin texto de error.
- Tras el commit de código: `npm run gates:static` → pasó. JSON: 898 comprobados; contratos dataset: 0 rotos; sanity: 3 checks detectados; locales: 0 sin resolver; ledger: 0 incoherencias; Theme Check: 111 archivos sin ofensas; sintaxis JS correcta; ZIP de control: 111 archivos, sin referencias internas.
- Batería final solicitada, salvo `pdp-line-total.spec.mjs`: `npx playwright test --config=playwright.system.config.mjs --trace off $(ls tests/*.spec.mjs | grep -v pdp-line-total)` → `149 passed (1.6m)`.

## 4. ZIP y manifiesto

Generada una vez con `node scripts/package-theme-zip.mjs --out Sartorial-1.0.0.zip --expect-count 111` desde `3974cfc`.

- Archivos: 111; tamaño: 339455 bytes.
- SHA-256 ZIP: `292abb31b104eda44ac4fde78c32c53fefc1c6b4704ffaef381066769a0b0bd4`.
- Hash de contenido indicado por el empaquetador: `43ff11e5180c3573001b8654a2805bdcb78d5d387b500f0ee35219d425e72e2a`.
- `internal references: none`; `unzip -t Sartorial-1.0.0.zip` reportó que no hay errores; `node --check` pasó en `assets/product-zoom.js`, `assets/section-standard-b.js` y `assets/theme.js` extraídos.
- El manifiesto declara `Validado en tienda: NO`. La ZIP no fue subida a ninguna tienda.

## 5. Ledger

- Live Regions (fila 60): permanece `código completo`. El test prueba aviso visible asociado al campo sin sumar otro `role`/`aria-live`; falta lector de pantalla en tienda real.
- Página de carrito y cajón sincronizados, AS-02 / FB-30 (fila 153): permanece `código completo`. Se añade evidencia Playwright de 422, respuesta recortada y sincronización con o sin cajón; falta inventario y comprobación en tienda real.

## 6. Copy

Ninguno nuevo. Se muestra el texto localizado devuelto por Shopify y se conserva `sections.cart.error` como respaldo.

## 7. Residuales y límites

- Queda resuelto el recorte silencioso de `/cart` cuando Shopify responde 422. Si Shopify cambia la cantidad en una respuesta exitosa sin texto de error, sigue aplicando el residual D85.
- No se probó con inventario real, idioma de tienda ni lector de pantalla. El entorno de pruebas usa Chromium del sistema debido al bloqueo 403 del CDN de Playwright.
- No se hicieron llamadas a tiendas ni cambios de catálogo.

## 8. Desviaciones

Sin desviaciones de alcance, locales o contrato. La configuración temporal del navegador se eliminó. La única limitación externa es la creación del PR, descrita abajo.

## 9. Bloqueos de GitHub

- `gh pr create --draft --base master --head gpt/r6-cart-line-error ...` respondió `Post "https://api.github.com/graphql": Forbidden`.
- La alternativa REST `gh api repos/Noobprobro-web/Tema-Shopify/pulls --method POST ...` respondió `Post "https://api.github.com/repos/Noobprobro-web/Tema-Shopify/pulls": Forbidden`.
- El push de la rama sí funcionó. Claude puede crear el PR borrador desde la rama publicada.
