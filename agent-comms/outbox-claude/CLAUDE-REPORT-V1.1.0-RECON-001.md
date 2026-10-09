# CLAUDE-REPORT-V1.1.0-RECON-001: Reconocimiento previo a la directiva v1.1.0

```text
ID: CLAUDE-REPORT-V1.1.0-RECON-001
De: Claude (Haiku 5.5)
Para: Gemini (decide los cuatro puntos de la sección 4). Copia: Johandry.
Fecha: 2026-10-08
Directiva: Sartorial, expansión de lujo v1.1.0 (cinco módulos)
Estado: RECONOCIMIENTO COMPLETO. Sin cambios en el código.
Decisión requerida: sí, cuatro puntos (sección 4).
Commit, push y despliegue: ninguno.
Subagentes: ninguno. Toda la tarea se hizo con Haiku 5.5 en esta sesión.
```

## 1. Resumen

Revisé el código que la directiva puede tocar, sin modificar nada. Tres de los cinco módulos ya existen en parte, y el módulo 5 ya existe completo como `sticky-cart-bar`. Hay 50 archivos con cambios reales sin commitear en la carpeta, entre ellos `assets/base.css` y `assets/theme.js`, que no son de mi última verificación. Antes de implementar hacen falta cuatro decisiones: cómo integrar lo existente, sobre qué base trabajar, en qué temas aplicar las features de preset y en cuántas entregas.

## 2. Estado del repositorio

HEAD es `60599ab` (traspaso de liderazgo CLAUDE-HANDOFF-LEAD-001). Antes están `ea3e3dc`, `1779ec2`, `49a257f`, `c6a82b5` (NF-01) y `f855762`. Mi último resumen tenía HEAD en `f855762`, así que la rama avanzó desde entonces. No he verificado en vivo los commits posteriores a `ee45f7f`.

Medido con `git diff --ignore-cr-at-eol --stat`: 50 archivos, 1064 inserciones y 168 borrados. Los archivos núcleo son `assets/base.css` (456 líneas), `assets/theme.js` (198), `config/settings_schema.json` (4), `docs/merchant/docs.html` (30) y `docs/merchant/support.html` (65). El resto son listings, templates, locales y harness. No sé de quién son esos cambios.

NF-01 está resuelto en HEAD y en disco: `sections/cart-drawer.liquid:141` usa `<div>` con `role="listitem"` y `sections/main-cart-items.liquid:31` también.

## 3. Solapes con la directiva

| Módulo | Lo que ya existe | Lo que falta | Riesgo si se duplica |
|---|---|---|---|
| 1. Subtotal en PDP | `formatMoney` en `assets/theme.js:119`, cálculo de línea en `theme.js:941` y `944`, bloque `data-line-total` en `sections/main-product.liquid:450` con `aria-live="polite"` en la línea 452. No hay `Intl.` en el tema (0 coincidencias). | El tema usa el evento `theme:variant-change` (6 coincidencias, por ejemplo `theme.js:384`, `1233`, `1563`). La directiva pide `variant:change`, que no aparece en ningún archivo (0). | Bajo |
| 2. Presets Atelier, Edition, Archive | `media_layout` con `stack`, `grid` y `thumbnails` en `sections/main-product.liquid:852-859`. `sections/bento-discovery.liquid` (295 líneas). | `split_screen`, `circa_year`, badge `1-of-1`, campo GSM y bloques de especificaciones (material, GSM, origen). Ninguno aparece en el tema. | Medio: toca schemas y locales |
| 3. Drawer: envío gratis y Complete the Look | Barra de progreso por niveles en `sections/cart-drawer.liquid:9-28` y `84-117`, con `free_shipping_threshold` y `atelier_gift_threshold`. Cross-sell en `cart-drawer.liquid:297-424`. Section Rendering API ya usada en el drawer (comentario en la línea 502). `sections/complete-the-look.liquid` existe (426 líneas). | El módulo "Complete the Look" dentro del drawer. Hoy el drawer muestra cross-sell, no un bloque de looks. | Medio |
| 4. Vista de PLP | Conmutador de 2 y 4 columnas en `sections/main-collection.liquid:254-290`. `theme.js:2875` (clave `theme:grid-columns` en localStorage) y `2999-3019` (`setGridView`). | La vista de lista como tercer modo. | Bajo |
| 5. Barra de compra rápida | `sticky-cart-bar` en `assets/theme.js:1185-1290`, registrada en `theme.js:4560-4561`. Markup en `sections/main-product.liquid:767-805`. IntersectionObserver en `theme.js:1251-1260`. Publica `--sticky-cart-offset` en `theme.js:1286`. Sincronizada con el formulario. | Nada funcional. Un segundo componente de barra fija duplicaría esta. | Alto: dos barras fijas en la misma página |

No he medido CLS al aparecer la barra ni el drawer. Esa medición es parte del criterio de aceptación de la directiva y queda pendiente.

## 4. Hallazgo nuevo: theme_info

HEAD apunta a `https://sartorial-atelier.myshopify.com/pages/theme-documentation` y `.../pages/theme-support`. El disco apunta a `https://noobprobro-web.github.io/sartorial-docs/docs.html` y `.../support.html`. El cambio está sin commitear en `config/settings_schema.json`. No he verificado ninguna de las dos URL. La de `sartorial-atelier` es la tienda demo de Atelier, y no sé si es pública. Hay que decidir cuál queda como definitiva antes de cerrar A360-01.

## 5. Decisiones para Gemini

D1. Solapes. Opción A: completar lo existente, agregando la vista de lista, el nombre de evento que pide la directiva si hace falta y los estados degenerados (recomendada). Opción B: crear componentes nuevos y retirar los actuales. Recomiendo A porque los módulos 1, 3, 4 y 5 ya tienen estados y pruebas de la verificación anterior, y B reabriría regresiones en la compra.

D2. Base de trabajo. Opción A: Gemini commitea o aclara de quién son los 50 archivos antes de que yo toque `base.css` y `theme.js` (recomendada). Opción B: trabajar sobre el estado actual y separar mis cambios en el reporte. Recomiendo A porque, sin esa separación, mi diff se mezclaría con cambios ajenos y no se podría auditar.

D3. Features de preset. Según CLAUDE-HANDOFF-LEAD-001, Atelier, Edition y Archive son presets de Sartorial (demos "Sartorial Atelier", "Sartorial Edition" y "Sartorial Archive"). En `listings/` hay carpetas `archive`, `edition` y `sartorial`, pero no `atelier`; hay que confirmar que `sartorial` corresponde a Atelier. Opción A: cada feature solo en su preset (recomendada). Opción B: en los cuatro temas, apagada por defecto. Recomiendo A porque así los demás temas no cambian.

D4. Alcance. Opción A: por partes, empezando por la vista de lista del módulo 4 (recomendada), que es lo único nuevo que no toca la compra. Opción B: los cinco módulos en un solo reporte. Recomiendo A.

## 6. Lo que no hice

No modifiqué ningún archivo del tema ni de la documentación. No hice commit, push ni despliegue. No corrí `npm run gates:static` ni Theme Check, porque no hay cambios que validar todavía. No abrí la tienda ni el navegador.

## 7. Comandos y evidencia

Comandos ejecutados, en la carpeta montada, sin escritura:

1. `git log --oneline -20`: HEAD `60599ab`.
2. `git diff --ignore-cr-at-eol --stat`: 50 archivos, 1064 inserciones, 168 borrados.
3. `git show HEAD:config/settings_schema.json` (líneas 3-9) frente a `config/settings_schema.json` en disco: URLs distintas.
4. `grep -rn "formatMoney|money_format|Intl\." assets sections snippets layout`: `formatMoney` aparece en 6 líneas de `assets/`; `Intl.` aparece en 0.
5. `grep -rn "theme:variant-change"` y `grep -rn "[^e]variant:change"`: 6 y 0 coincidencias.
6. `grep -rni "atelier|circa_year|split_screen|1-of-1|gsm"`: sin `split_screen`, `circa_year`, `1-of-1` ni `gsm`. Solo `atelier_gift_threshold` y textos.
7. `grep -n "sticky-cart-bar" assets/theme.js`: 2 líneas (la clase y el `customElements.define`).
8. `sed -n 141p sections/cart-drawer.liquid`: `<div`.

## 8. Afirmaciones falsables

1. HEAD es `60599ab` y su historial incluye `c6a82b5` (NF-01).
2. Hay 50 archivos con cambios reales sin commitear, con 1064 inserciones y 168 borrados.
3. `config/settings_schema.json` en HEAD apunta a `sartorial-atelier.myshopify.com`. En disco apunta a `noobprobro-web.github.io`.
4. El tema no contiene `Intl.`.
5. El tema no contiene `split_screen`, `circa_year`, `1-of-1` ni `gsm`.
6. El evento de variante del tema es `theme:variant-change`. No existe `variant:change`.
7. El subtotal de PDP ya tiene `aria-live="polite"` en `sections/main-product.liquid:452`.
8. Existe una `sticky-cart-bar` registrada en `assets/theme.js:4560-4561`.
