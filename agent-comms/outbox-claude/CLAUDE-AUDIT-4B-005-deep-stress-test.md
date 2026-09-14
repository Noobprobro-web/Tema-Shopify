# CLAUDE-AUDIT-4B-005: Auditoría adversarial de ingeniería, Sartorial 1.0.0

```text
ID: CLAUDE-AUDIT-4B-005
Estado: ENTREGADO
Decisión requerida: Gemini autoriza o rechaza los cinco parches. Ninguno cambia contrato ni schema
Resumen en 5 líneas:
1. Un P1 en la ruta de compra: cuatro llamadas al carrito parsean JSON antes de mirar response.ok, y un 5xx o 429 con cuerpo HTML le muestra al comprador "Unexpected token '<'".
2. Cuatro P2 verificados: cantidad vacía que se convierte en 1 unidad, dos rAF que sobreviven a la desconexión, tokens de badge de oferta que nadie consume, y dos endurecimientos de formatMoney.
3. Limpieza de listeners, observers y timers: los 22 componentes limpian. Cero fugas por esa vía. Verificado clase por clase.
4. Contratos JS a Liquid: cero rotos, incluidos 16 contratos en elementos hijo y emisión condicional, que el gate actual no mira.
5. Cuatro puntos ciegos de gates:static demostrados con herramienta, con estado actual limpio en los cuatro.
Archivos tocados: ninguno. Auditoría de solo lectura
Desviaciones: ninguna
Hallazgos extra fuera de alcance: los cuatro puntos ciegos de la sección 4, con script listo
Método: análisis estático en Node sobre el árbol real. Sin navegador. Lo que exige navegador queda marcado como no verificado
```

---

## 0. Qué se auditó y con qué

Todo sobre el árbol real, sincronizado y comprobado por `mtime` antes de empezar. `assets/theme.js` idéntico byte a byte a mi último commit.

| Frente | Método | Resultado |
|---|---|---|
| Fugas: listeners, timers, observers, rAF | script que aísla las 22 clases por llaves balanceadas y cuenta registros contra limpieza | 0 fugas por listener. 2 rAF que sobreviven a la desconexión |
| `TypeError` con variante indefinida | lectura de los 9 métodos que reciben `variant` | 0. Todos usan `variant?.` o `if (!variant)` |
| Condiciones de carrera | lectura de `addItem`, `addCrossSell`, `fetchResults`, `renderUrl` | doble clic guardado; búsqueda predictiva con `AbortController` local y comprobación de query vigente |
| Contrato `data-*` raíz | `node scripts/dataset-hooks.mjs` | 14 componentes, 0 rotos |
| Contrato `data-*` en hijos y emisión condicional | scripts ad hoc, sección 4 | 16 claves, 0 rotos; 0 atributos dentro de `{% if %}` |
| JSON: integridad y coherencia entre presets | `node scripts/json-validate.mjs` + script ad hoc | 27 templates, 0 settings fuera de schema, 0 desajustes `order`/`block_order` |
| `formatMoney` | 29 entradas hostiles de centavos y 18 formatos hostiles | 2 endurecimientos |
| CSS | `csstree-validator` | 0 propiedades o valores inválidos |
| `gates:static` | los 8, ejecutados | 8 en verde, Theme Check 72 archivos y 0 ofensas |

---

## 1. Hallazgos

### [SEVERIDAD: P1] Un 5xx o 429 del carrito le muestra al comprador un error de parser

- **Archivo y Línea:** `assets/theme.js:1413`, `:1450`, `:1486`, `:2124`. Cuatro sitios, mismo patrón, en `addItem`, `addCrossSell`, `changeLine` y `addSelectedItems`.
- **Compuerta Violada:** Compuerta 2, entradas hostiles del servidor. Requisito Theme Store de manejo de errores en el carrito.
- **Escenario de Reproducción:** Shopify devuelve un `503` de mantenimiento, un `429` por límite de tasa bajo carga de campaña, o un `502` de borde. El cuerpo de esas respuestas es HTML, no JSON. Se ejecuta:
  ```javascript
  const result = await response.json();          // lanza SyntaxError antes de la siguiente línea
  if (!response.ok) throw new Error(result.description || result.message || this.dataset.errorMessage);
  ```
  El `SyntaxError` sale del `try` y `handleAddSubmit` (`:1298`) hace `this.showError(error.message, form)`.
- **Impacto Real:** El comprador lee en la página de producto o en el cajón del carrito: **`Unexpected token '<', "<!DOCTYPE "... is not valid JSON`**. Es `textContent` (`:1633`), así que no hay inyección, pero es el mensaje que un revisor de la Theme Store anota como defecto de manejo de errores, y ocurre precisamente cuando la tienda está bajo presión. El texto amable `this.dataset.errorMessage` existe y nunca se usa en este camino.
- **Parche Exacto Propuesto:** en los cuatro sitios, sustituir las dos líneas por:
  ```javascript
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    throw new Error(result?.description || result?.message || this.dataset.errorMessage);
  }
  ```
  Cubre los tres casos: error con JSON de Shopify (muestra su `description`), error con HTML (muestra el mensaje amable), y `200` con cuerpo corrupto (mensaje amable en vez de `renderCartResponse(undefined)`).

---

### [SEVERIDAD: P2] Letras en el selector de cantidad se convierten en una unidad añadida

- **Archivo y Línea:** `sections/main-product.liquid:301-311` y `sections/featured-product.liquid:158`. Ninguno lleva `required`.
- **Compuerta Violada:** Compuerta 2, entradas hostiles en JS.
- **Escenario de Reproducción:** El comprador escribe `abc` en la cantidad. Un `<input type="number">` deja `value = ""`. No es `required`, así que la validación nativa pasa. `handleAddSubmit` recibe el `submit`, `new FormData(form)` (`:1401`) serializa `quantity=` vacío, y `/cart/add.js` interpreta la cantidad ausente como **1**.
- **Impacto Real:** El comprador ve la caja vacía, pulsa añadir, y aparece una unidad en el carrito. El total de línea sí maneja bien la entrada vacía (se oculta), así que la pantalla y el carrito se contradicen. Los valores `0` y negativos sí quedan bloqueados por `min`; solo la cadena vacía se cuela.
- **Parche Exacto Propuesto:** añadir `required` a los dos inputs. Con eso la validación nativa bloquea el envío y muestra el mensaje del navegador. Una línea por archivo, sin JS.

---

### [SEVERIDAD: P2] Dos `requestAnimationFrame` que sobreviven a la desconexión del componente

- **Archivo y Línea:** `assets/theme.js:2312-2316` (`AnnouncementBar`, en `focusout`) y `:2434` (`PasswordModal`, en `connectedCallback`).
- **Compuerta Violada:** Compuerta 2, robustez de Web Components. Fuga de memoria.
- **Escenario de Reproducción, AnnouncementBar:** en el editor de temas, el comerciante cambia un ajuste de la barra de anuncios mientras un botón de ella tiene el foco. El editor reemplaza la sección: `disconnectedCallback` limpia el timer (`:2325-2327`), pero al retirar del DOM el botón enfocado el navegador dispara `focusout`, cuyo callback ya está encolado en un rAF. El rAF corre **después** de la desconexión: `this.contains(document.activeElement)` es falso, así que llama `this.schedule()` (`:2359`), que crea un `setTimeout` nuevo sobre el elemento ya desconectado. Ese timer llama `setActive` y vuelve a `schedule()` cada `interval` ms, indefinidamente. Cada re-render en el editor añade una cadena huérfana más.
- **Escenario, PasswordModal:** con `[data-password-error]` presente, `connectedCallback` encola `this.open(...)` en un rAF. Si el editor reemplaza la sección en ese frame, `open()` corre sobre el elemento desconectado y ejecuta `document.body.setAttribute('data-modal-open', '')` (`:2466`) sobre el **body vivo**. `base.css:101` estila `body[data-modal-open]`. Nadie lo quita, porque el `close()` del elemento viejo ya no volverá a ejecutarse.
- **Impacto Real:** Fuga proporcional a los re-renders del editor en el primer caso; en el segundo, ventana de un frame, pero el resultado es el body de la vista previa con el atributo de modal abierto hasta recargar. Ninguno afecta al storefront publicado, que no re-renderiza secciones. Es defecto de calidad de editor, y el editor es donde vive el comerciante las primeras horas.
- **Parche Exacto Propuesto:**
  ```javascript
  // :2312
  requestAnimationFrame(() => {
    if (!this.isConnected || this.contains(document.activeElement)) return;
    this.interactionPaused = false;
    this.schedule();
  });
  // :2434
  requestAnimationFrame(() => { if (this.isConnected) this.open(this.passwordInput); });
  ```
  Y como cinturón, en `schedule()` (`:2359`): `if (!this.isConnected) return;` como primera línea. Los otros dos rAF del archivo ya están protegidos: `:1897` comprueba `trigger?.isConnected` y `:1719` solo enfoca por `id`.

---

### [SEVERIDAD: P2] Los tokens del badge de oferta existen en dos niveles y no los consume nadie

- **Archivo y Línea:** `assets/base.css:17-18` (declaración en `:root`), `:70-71` (redeclaración por esquema con `color-mix`), y `:967-977` (`.badge`, que pinta con `border: 1px solid currentColor` y ningún fondo).
- **Compuerta Violada:** Compuerta 3, consistencia entre archivos. Tokens declarados sin consumidor.
- **Escenario de Reproducción:** un comerciante quiere el badge "Sale" en color de acento. Los esquemas de color exponen `--color-sale-badge-bg` y `--color-sale-badge-text`, así que cambia esos valores. **Nada cambia**, porque `.badge` no los lee. Además `[data-sale-badge]` y `[data-sold-out-badge]` comparten la misma regla: "Sale" y "Sold out" son visualmente idénticos.
- **Impacto Real:** una capacidad que el sistema de tokens promete y que no existe. En un tema de 400 dólares que vende "15 esquemas de color" como argumento, un token de esquema que no hace nada es lo primero que un comerciante avanzado va a reportar como bug.
- **Parche Exacto Propuesto:**
  ```css
  /* base.css, después de .badge */
  .badge[data-sale-badge] {
    border-color: var(--color-sale-badge-bg);
    background: var(--color-sale-badge-bg);
    color: var(--color-sale-badge-text);
  }
  ```
  Los tokens ya están calculados por esquema con contraste sobre el par foreground/background, así que el contraste queda cubierto sin nuevos valores. Si Gemini prefiere no diferenciar los badges, la alternativa honesta es borrar las cuatro declaraciones.

---

### [SEVERIDAD: P2] `formatMoney` es permisivo con tipos y solo sustituye el primer token

- **Archivo y Línea:** `assets/theme.js:71` (`Math.round(Number(cents))`) y `:87` (`template.replace(MONEY_TOKEN, value)`).
- **Compuerta Violada:** Compuerta 3, robustez del formateo de moneda.
- **Escenario de Reproducción:** ejecutado con 29 entradas hostiles. Las que producen un resultado engañoso en vez de vacío:
  ```
  null   -> "$0.00"      ""  -> "$0.00"     "  " -> "$0.00"     [] -> "$0.00"
  true   -> "$0.01"      [1234] -> "$12.34"  "12.34" -> "$0.12"
  '{{amount}} / {{amount}}' con 123456 -> "1,234.56 / {{amount}}"
  ```
  El caso `"12.34" -> "$0.12"` es el importante: una cadena decimal de dólares se interpreta como centavos y sale cien veces menor, en silencio. Es exactamente la confusión de unidades que la búsqueda predictiva ya tuvo y que hubo que corregir con `Math.round(valor * 100)`.
- **Impacto Real:** hoy **ningún** sitio de llamada pasa esos tipos: los tres consumidores llegan con números finitos y guardas `Number.isFinite`. Es un riesgo de futuro llamador, no un fallo activo. El segundo caso, dos tokens, es un error de configuración del comerciante en el campo de formato del admin, poco probable pero posible.
- **Parche Exacto Propuesto:**
  ```javascript
  const formatMoney = (cents, format) => {
    if (typeof cents !== 'number' || !Number.isFinite(cents)) return '';
    const amount = Math.round(cents);
    ...
    return template.replace(new RegExp(MONEY_TOKEN.source, 'g'), value);
  };
  ```
  Contrato estricto: solo números. Todo llamador actual cumple, verificado en `:645`, `:648`, `:2057`, `:2769`, `:2775`.

---

## 2. Lo que se buscó y no se encontró, con evidencia

Esto no es alabanza. Es cobertura: sin ella, la ausencia de hallazgos no significa nada.

**Listeners, timers y observers, 22 clases.** `ThemeElement.disconnectedCallback` aborta el `AbortController` de `this.listen()`, así que las 8 clases sin `disconnectedCallback` propio no filtran nada por esa vía. Las que registran recursos fuera de ese mecanismo los limpian: `StickyCartBar` desconecta sus dos observers (`:766-769`), `ProductRecommendations` desconecta el observer y aborta el fetch (`:1187-1190`), `AnnouncementBar` y `PredictiveSearch` limpian sus timers, y los 7 modales y cajones guardan la función de liberación de `trapFocus` y la llaman en `close()`, que todos invocan desde `disconnectedCallback`.

**Variante indefinida.** `updateForms`, `updatePrice`, `updateQuantityRules`, `updateMedia`, `updateStatus`, `updateUrl`, `updatePurchaseOptions` y `updateLineTotal` toleran `undefined`, que es el caso real de una combinación de opciones que no existe. Cero `TypeError` posibles por esa ruta.

**Doble clic en añadir al carrito.** `setFormBusy` deshabilita el botón de forma síncrona antes del primer `await` (`:1398`), y `StickyCartBar` replica `disabled` y `aria-busy` al botón espejo con un `MutationObserver` (`:741-744`), que corre entre dos clics. No se duplica la línea.

**Búsqueda predictiva.** `AbortController` local por petición, comprobación `this.input.value.trim() !== query` antes de renderizar (`:2666`), y el `finally` solo libera si el controlador vigente sigue siendo el suyo. No pueden pintarse resultados viejos.

**Presets.** Los tres `index.json` difieren de verdad: 8, 6 y 7 secciones con composición distinta. `collection.json` y `product.json` son estructuralmente iguales en los tres, que es lo correcto. Cero desajustes entre `order` y `sections`, y entre `block_order` y `blocks`. Cero settings o tipos de bloque que no existan en el schema de su sección, sobre 27 templates.

**Defaults que apuntan a recursos.** Tres, todos `link_list`: `main-menu`, `footer` y `customer-account-main-menu`. Los tres existen en toda tienda Shopify por defecto.

---

## 3. Lo que no pude verificar y no afirmo

Todo lo de esta auditoría es análisis estático en Node. No hubo navegador. Por tanto **no verifiqué**: foco atrapado y `inert` en los cajones en un navegador real, la restauración exacta del foco tras `Escape`, áreas táctiles medidas en píxeles renderizados, jerarquía de encabezados sobre el DOM final, ni el aspecto de ningún estado degenerado. Esas son las 18 filas de Gate 5 y siguen siendo de Johandry con `theme dev`. Frente D del encargo queda, por diseño, fuera de lo que este método puede cerrar.

---

## 4. Puntos ciegos de `gates:static`, demostrados

Los cuatro tienen hoy estado limpio. El valor no es lo que encontraron, es que nada los vigila.

**CSS no se lintea.** `csstree-validator` instalado y probado contra un archivo con `gap-inline`, `colr` y `display: flexx`: reporta los tres. Sobre `assets/base.css`: cero. Las dos `gap-inline` que se corrigieron a mano en 4B-002 habrían salido aquí en dos segundos. Propuesta: `gates:css` con `npx csstree-validator assets/base.css`.

**Settings de template contra schema.** Shopify ignora en silencio un setting cuyo `id` no existe en la sección, así que una renombrada en un schema deja config muerta en `templates/` y `/listings/` sin que nadie lo note. Script ad hoc: 27 templates, 0 desviaciones hoy. Propuesta: `gates:templates`.

**`dataset-hooks` solo mira `this.dataset`.** Hay 16 claves más leídas en elementos hijo (`button.dataset.gridView`, `source.dataset.price`, `thumbnail.dataset.mediaId`...) y el gate no las cruza. Tampoco detectaría un atributo emitido solo dentro de `{% if %}`. Ambas comprobadas ad hoc: 0 problemas hoy. Propuesta: extender el gate con las dos pasadas, que ya están escritas.

**Tokens CSS muertos.** Seis custom properties declaradas y nunca consumidas: las dos del badge (hallazgo arriba), `--radius-card`, `--space-none`, y dos más. Ningún gate las reporta. Propuesta: sumarlo a `gates:css`.

---

## 5. Lista de afirmaciones falsables

1. `assets/theme.js:1413`, `:1450`, `:1486` y `:2124` contienen `const result = await response.json();` y en las cuatro la comprobación de `response.ok` está **después**.
2. `sections/main-product.liquid:301-311` y `sections/featured-product.liquid:158` definen `<input type="number" name="quantity">` sin el atributo `required`, y ninguno de los dos formularios lleva `novalidate`.
3. `assets/theme.js:2312-2316` encola un rAF que llama `this.schedule()` sin comprobar `this.isConnected`, y `schedule()` (`:2359-2367`) crea un `setTimeout` sin comprobarlo.
4. `assets/theme.js:2434` encola `this.open(...)` en un rAF sin comprobar `isConnected`, y `open()` escribe en `document.body` (`:2466`).
5. `--color-sale-badge-bg` y `--color-sale-badge-text` aparecen declaradas en `base.css:17-18` y `:70-71` y **ninguna** aparece dentro de `var(...)` en `base.css` ni en ningún `.liquid`.
6. `.badge` (`base.css:967`) no declara `background` y usa `currentColor` en el borde, y no existe regla para `[data-sale-badge]`.
7. `formatMoney("12.34", "${{amount}}")` devuelve `"$0.12"` y `formatMoney(null, "${{amount}}")` devuelve `"$0.00"`.
8. `formatMoney(123456, "{{amount}} / {{amount}}")` devuelve `"1,234.56 / {{amount}}"`.
9. Las 22 clases que extienden `ThemeElement` limpian todo listener registrado con `this.listen()` al desconectarse, porque `ThemeElement.disconnectedCallback` (`:110-112`) aborta el controlador.
10. Los 27 templates JSON no contienen ningún setting ni tipo de bloque ausente del schema de su sección.
11. `npx csstree-validator assets/base.css` termina en `exit 0` con cero avisos.
12. `gates:static` corre 8 comprobaciones y las 8 terminan en `exit 0`; Theme Check reporta 72 archivos y 0 ofensas.
