ID: CLAUDE-R5-INTEGRACION-001
Estado: Integrado y verificado en local; compuerta 5 abierta
Decisión requerida: Ninguna. Fusión a `master` y compuerta 5 quedan para Gemini/Johandry.

# CLAUDE-R5-INTEGRACION-001: integración de R5 y cierre de la revisión

## 1. Qué se integró

- La rama `claude/clever-gauss-ddhyr2` avanzó por fast-forward de `fd762bb` a `master` (`6b19e82`).
- Se fusionó con `--no-ff` `codex/r5-001-six-fixes` (`e211fba`, PR #31): seis arreglos A a F de D79 (carrito sin «Update cart», barra fija, búsqueda de la 404, huecos de vídeo y 3D, selector de país del menú móvil; F sin cambio). Sin conflictos. La rama de GPT no se tocó.
- Encima, un commit de Claude con M1 y M3, tests, decisiones D82 a D85, ledger y esta entrega.

## 2. La revisión en resumen

`e211fba` es fusionable. Los seis arreglos están bien hechos, los gates estáticos pasan en los nueve commits de código, 135/135 Playwright, y la ZIP de 111 archivos (sha256 `a1c01543…58d7`) coincide con su manifiesto. Quedaron cinco puntos, M1 a M5.

## 3. M1 a M5 y su resolución

| Punto | Hallazgo | Resolución |
|---|---|---|
| M1 | Anuncio de error falso en /cart si el cajón empieza una mutación mientras la página relee su sección: `painted` queda vacío aunque el carrito se actualizó. | Corregido. `currentRevision` sale del `if` y `superseded` evita el error (`assets/theme.js:7311-7322`). Test `tests/r5-cart-page.spec.mjs:128`: falla con `e211fba` («Something went wrong») y pasa. |
| M2 | «Update cart» sigue visible con JavaScript. | Aceptado como respaldo del formulario: D82. |
| M3 | Misma línea editada en la página y en el cajón durante el debounce: la edición antigua de la página pisaba el cambio del cajón. | Corregido: gana el cambio más reciente (D83). `assets/theme.js:320-325` y `:4160`. Test `tests/r5-cart-page.spec.mjs:153`: falla con `e211fba` (recibe 2, espera 5) y pasa. El test de líneas distintas (`:119`) se mantiene. |
| M4 | `handOffFocus` manda el foco al logo de la cabecera tras un salto hacia arriba sin control visible. | Aceptado: D84. |
| M5 | Referencias y afirmaciones imprecisas en la entrega de GPT. | Ver §4. |

Detalle de M1. El arreglo propuesto por la revisión era exacto y se aplicó tal cual: `superseded = Boolean(drawer) && !painted && drawer.syncRevision !== (currentRevision ?? revision)`; el mensaje usa errores y anuncios si `painted || superseded`. Cuando la página se repinta por la mutación del cajón, el anuncio de «Updated … to N» sigue siendo cierto porque la petición llegó al servidor.

Detalle de M3. `discardCartPageEdit(key)` fija el valor del campo de la página como su base antes de que el debounce lea las ediciones, así que el debounce no ve cambio para esa línea. La respuesta del cajón repinta la página con la cantidad del servidor. Se hace al empezar `changeLine`, no al recibir la respuesta, para que no dependa de que esa respuesta no sea superada.

Residuales aceptados (D85): checkout acelerado sin debounce, «Checkout» sin estado de carga, foco al `h1` si un descuento rota la clave, recorte silencioso de cantidad sin explicación.

## 4. Correcciones a la entrega de GPT (M5)

Referencias `archivo:línea` reales, ajustadas a la versión final de `assets/theme.js` tras M1 y M3:

- Helpers del carrito (`fetchCommerce`, `postCartUpdate`, `cartRows`, `lineControlAfterRender`, `requestCartPageSection`, `cartPageFocusTarget`, `discardCartPageEdit`, `replaceCartPage`, `updateCartHeaderCount`, `writeCartStatus`, `announceCartPage`): `assets/theme.js:248-391` (la entrega cita 253-381 sin M3).
- Arreglo B, barra fija (`StickyCartBar`, `watchPrimaryButton`, `setVisible`, `syncStickyOffset`, `handOffFocus`): `assets/theme.js:2010-2117` (la entrega cita 2001-2106).
- `initCartPage` y su lectura de ediciones: `assets/theme.js:7219-7410` (la entrega cita 7208-7396).
- CSS de C, D y E: sin cambios de línea (`assets/base.css:7367`, `:9184,9201,9214`, `:7646`).

Otras correcciones:

- La §3 de la entrega no incluye salidas de las pruebas, sino rutas a logs de la máquina de GPT (`C:\Users\Johan\AppData\Local\Temp\...`, `.tmp/...`) que no están en el repositorio. La evidencia reproducible es el spec mismo con `R3_THEME_JS` y `R3_BASE_CSS`, y las dos pasadas de esta integración (§5).
- Errata de la §5: la frase «Generados una sola vez desde HEAD de código `db5b1b7…)`» tiene un paréntesis de cierre sin apertura. El manifiesto de `e211fba` declara `HEAD db5b1b7…` como revisión; el ZIP de esta entrega se empaqueta desde el commit de Claude, por lo que la revisión del manifiesto cambia.
- No se hizo la parte opcional de D (igualar la altura de las diapositivas 3D y de vídeo del carrusel móvil con el marco del carrusel, `GPT-TASK-R5-001.md:257`). Queda fuera de 1.0.

## 5. Verificación

- `npm run gates:static`: exit 0 (Theme Check, 111 archivos sin infracciones; referencias internas ninguna). `npm run gates:ledger`: 105 filas, 0 incoherencias.
- Playwright (`npx playwright test --trace off` sobre los 17 specs, sin `tests/pdp-line-total.spec.mjs`), dos pasadas: 137 passed y 137 passed (135 de GPT más los dos tests nuevos). El spec excluido requiere un storefront local en `127.0.0.1:9292`.
- Los dos tests nuevos fallan con el `assets/theme.js` de `e211fba` y pasan con el actual.

## 6. Ledger

Con evidencia de R5 y en `código completo`: AS-02/FB-30 (cajón y página), Live Regions, Medios Enriquecidos y Modelos 3D, Selector de País / Moneda. Filas nuevas en `código completo`: barra fija de compra bajo la cabecera fija (QA 5, D81) y campo de búsqueda de la 404 (QA 3, M-17). Recuento: 105 filas, 38 cumplido, 63 código completo, 3 no verificado, 1 ausente. Nada pasa a `cumplido`: falta la compuerta 5 (tienda de desarrollo con catálogo demo y móvil simulado).

## 7. Pendiente

Compuerta 5 en tienda real: inventario y cajón con página en /cart, barra fija con la barra de vista previa oculta, visor 3D/AR y vídeo reales, Markets con más de un país, lector de pantalla.
