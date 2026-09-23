ID: GPT-AUDIT-007-sprint-5b
Estado: RECHAZADO para cierre de Sprint 5B por un P1 de foco en el visor modal.
Decisión requerida: Gemini debe asignar a Claude el parche de F01, exigir re-prueba EN/ES a 1280, 390 y 360 px, y mantener `docs/requirements-ledger.md:73` en `código completo` hasta que Gate 5 pase. Johandry aporta fixtures de video, alt vacío y foto de 600 px para cerrar lo no verificable.
Resumen en 5 líneas:
1. El zoom abre un `<dialog>` modal, carga la imagen activa y vecinas al entrar, alterna por clic y limita la ampliación de la foto de 928 px a 167%.
2. Navegación de 4 imágenes, producto de una sola foto, Escape, foco al disparador, anuncios EN/ES y controles de 44 px funcionaron en las rutas probadas.
3. **F01 P1:** activar `Reset zoom` oculta el botón enfocado y deja el foco en `BODY` con el diálogo todavía abierto; reproducido por clic y Enter, EN escritorio y ES móvil.
4. No hubo fixture con video, alt manual ausente o imagen de 600 px; el ancho móvil no emula dedos, por lo que pinch, double-tap y pan táctil no están certificados.
5. Comercialmente, Serra Coat muestra una sola toma trasera y su descripción en `/products/serra-coat` está en español; la tecnología de zoom no suple ese contenido de demo.
Archivos tocados: únicamente este informe. No se modificó Liquid, CSS, JS, schema, BOARD ni ledger; no hubo commit ni push.
Desviaciones (Nivel 1 o Nivel 2): ninguna; auditoría independiente.
Hallazgos extra fuera de alcance (con parche listo): M01, contenido comercial bilingüe de Serra Coat: Johandry debe cargar traducción inglesa de la descripción, traducir alt manual en ES y completar galería frontal, posterior y detalle de tejido. No tocar el tema para resolver contenido de producto.
Verificación (comando, resultado y qué demuestra/qué no): `git status --short --branch` inicial -> `## master...origin/master`; `git log -4 --oneline` incluye `a946c3b feat(pdp): complete Sprint 5B native accessible zoom and media optimizations`. Pruebas reales CUA/DOM, clic, teclado, drag y scroll en el storefront, detalladas abajo. No se corrieron Lighthouse, axe-core, red instrumentada ni hardware táctil.
Lista de afirmaciones falsables numeradas:
1. En F04 EN/ES el visor abre con `dialog.open=true`, `:modal=true`; antes de abrir, sus imágenes siguen como marcador 1x1 sin `srcset` activo.
2. En F04/Camel de 928 px, dos pulsaciones de Zoom in producen 150% y 167%, deshabilitando acercar; Reset vuelve a 100%.
3. Activar Reset por clic o Enter produce `document.activeElement.tagName === 'BODY'` mientras `dialog.open === true`.
4. En la sesión probada, Tab posterior vuelve al diálogo y Escape lo cierra restaurando foco al botón exacto de apertura.
5. Colección QA y Home no inyectan `<product-zoom>`, disparadores ni `product-zoom.js`; Serra Coat tiene una sola imagen y prev/next deshabilitados.

## Dictamen ejecutivo

**No apto para cerrar 5B todavía.** F01 incumple el foco confinado exigido por la directiva y el patrón de [diálogo modal de WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Shopify requiere acceso por teclado y foco visible en el [Theme Store](https://shopify.dev/docs/storefronts/themes/store/requirements). Es un fallo concreto, no una inferencia de Theme Check ni una afirmación de rechazo automático por Shopify. El zoom puede avanzar a un hotfix acotado; no necesita rediseño.

## Hallazgo bloqueante

### F01 - P1, foco perdido al restablecer zoom

- **Archivo/línea:** `assets/product-zoom.js:151-166`, método `apply()`. En `:162` se aplica `this.resetButton.hidden = scale <= 1` antes de consultar `document.activeElement` en `:163-165`.
- **Reproducción:** F04 EN a 1280 x 800 o ES a 360 px: abrir una foto, activar Zoom in/Acercar y luego Reset zoom/Restablecer zoom con clic **o** Enter. Resultado literal en ambos: `{activeTag:'BODY', focusInside:false, open:true, modal:true}`. El live region ya anuncia 100%.
- **Impacto:** desaparece el foco visible del visor mientras éste sigue modal; el usuario de teclado pierde la referencia. Tab vuelve a `Close zoom`/`Cerrar zoom` y Escape todavía cierra y devuelve foco al disparador original, pero eso no corrige el estado intermedio.
- **Parche listo para Claude:** capturar si `document.activeElement === this.resetButton` **antes** de ocultarlo. Si `scale <= 1`, mover primero el foco a `this.inButton` (o a `this.closeButton` si Acercar está deshabilitado), y después poner `resetButton.hidden = true`. Mantener la guarda general para botones que pasan a disabled. Añadir prueba Playwright real que active Reset por ratón y teclado y compruebe `dialog.contains(document.activeElement)` inmediatamente después en EN/ES y 360/1280.

## Matriz adversarial

`NV` = no verificado en tienda con estos fixtures o herramientas. `Parcial` = se observó una parte del contrato, sin afirmar la parte restante.

| Criterio | Estado | Viewport/ruta | Evidencia concreta |
| --- | --- | --- | --- |
| Modal y foto correcta | Pasa | F04 EN 1280, ES 390; Serra EN 1280/360 | Trigger 1/4 o 2/4 abre `dialog.open=true`, `matches(':modal')=true`; contador y foto coinciden. |
| Carga diferida del zoom | Parcial | F04 EN 1280 | Antes: 4 `img` con GIF 1x1 y sin `srcset`. Después de abrir: activa y vecina con `srcset`; activa `fetchpriority=high`. No se midieron bytes de red ni LCP. |
| Clic para alternar 1x/zoom | Pasa | F04 EN 1280 | Dos clics en foto: `Image 1 of 4, zoom 300%` -> `100%`. |
| Follow cursor / pan ratón | Parcial | F04 EN 1280 | Drag a 3x cambió `transform` a `translate3d(-17.9375px, -100px, 0px) scale(3)`; no se midió jank/INP. |
| Cierre exterior a 1x | Pasa | F04 EN 1280, ES 360 | Clic fuera de foto cerró diálogo y devolvió foco a `Zoom image 2 of 4` / `Ampliar imagen 1 de 4`. |
| Escape y disparador exacto | Pasa | F04 EN 1280, ES 360; Serra EN 360 | `Escape` cerró y enfocó exactamente el trigger que abrió, incluso después de F01. |
| Double-tap real | NV | Móvil 390/360 | El override de ancho no cambia el puntero del navegador a touch; no se generaron dos taps táctiles. |
| Pinch a dos dedos/ancla | NV | Móvil 390/360 | Sin evento multitouch real. Código y arnés no sustituyen una prueba independiente en dispositivo. |
| Pan con un dedo | NV | Móvil 390/360 | Drag probado fue de ratón, no `pointerType=touch`. |
| Navegación horizontal 1x | Parcial | F04 ES 390 | Scroll horizontal sobre visor cambió a 2/4, `scrollLeft=390.4`, live region `Imagen 2 de 4, zoom 100 %`; no se probó swipe táctil. |
| Reset visible y funcional | **Falla** | F04 EN 1280 y ES 360/390 | Tras zoom aparece botón de 102x44 (EN) / 149x44 (ES); vuelve a 100%, pero deja foco en BODY (F01). |
| Anti-pixelación 928 px | Pasa | F04 EN 1280 | Camel `data-width=928`, ancho ajustado 554.2; tope `scale(1.67442)`, live 167%, Zoom in disabled. |
| Anti-pixelación 600 px | NV | No existe foto suministrada de 600 px | Requiere fixture de 600 px y medición de tope. |
| Teclado +, -, 0, flechas, Home, End | Pasa | F04 EN 1280 | End 4/4, Home 1/4, Right 2/4, + 150%, - 100%, 0 100%; Down a 150% desplazó `translateY(-103.2px)`. |
| Tab/Shift+Tab confinado | **Falla** | F04 EN 1280, ES 360 | Antes de Reset, 12 Tab y 8 Shift+Tab quedaron dentro; después de Reset el foco es BODY con modal abierto. |
| Anuncio atómico EN/ES | Pasa en DOM | F04 EN 1280, ES 390 | `aria-live` cambió `Image 1 of 4, zoom 100%` -> `300%` y `Imagen 1 de 4, zoom 100 %` -> `150 %`. No se usó lector de pantalla real. |
| Targets de botones | Pasa en muestra | F04 EN 1280 y ES 390 | Close, prev, in/out, next: 44x44 px; Reset: 102x44 / 149x44. |
| axe-core / reduced motion | NV | Todos | No se ejecutó axe sobre modal vivo ni se emuló `prefers-reduced-motion`; código contiene rama de reduced motion (`assets/product-zoom.js:102`). |
| H-07 `sizes` de rejilla | Pasa atributo; red NV | F04 EN 1280 y Serra EN 1280 | F04 4 fotos: `(min-width: 62rem) 30vw, 100vw`, ancho visual 377 px; Serra 1 foto: `60vw`. `currentSrc` de imágenes previamente cacheadas no permite inferir bytes nuevos. |
| H-13 pausa de video | NV en vivo | F04 y Serra | Ambos tienen 0 `<video>`/iframes de video. Código de pausa en `assets/theme.js:81-94,456-461,494-499`; falta fixture HTML5/YouTube/Vimeo. |
| H-19 alt secuencial | NV en vivo | F04 y Serra | Todas las imágenes suministradas tienen alt manual. Fallback está en `snippets/media-alt.liquid:12-18`, sin un producto sin alt para falsificarlo. |
| Zoom setting desactivado | NV en vivo | Theme Editor no intervenido | Liquid condiciona trigger/visor (`sections/main-product.liquid:49-52,87,169`), pero no se alteró la configuración de la tienda viva. |
| Script fuera de PDP | Pasa en DOM | `/` y `/collections/qa-sprint-5a` | En ambas: `zoomElements=0`, `zoomScript=0`, `zoomTriggers=0`. No es medición de transferencia CDN. |
| Una sola foto | Pasa | Serra EN 1280 y 360 | 1/1, Zoom in funciona; prev/next disabled; Escape devuelve foco y 360 px no desborda. |
| Título hostil/compare-at en visor | NV | Fixtures suministrados | F04 tiene descuento, pero título corto; Serra también. Falta producto de título largo/precio extenso para cerrar este estado. |

## Viabilidad comercial y siguiente acción

El visor se siente sobrio y consistente con Couture: pantalla completa sin un marco decorativo, controles discretos, buena respuesta de teclado salvo F01 y límite honesto para la foto de 928 px. Sin embargo, el zoom no es diferenciador por sí solo: [Prestige ya ofrece image zoom e image galleries](https://themes.shopify.com/themes/prestige/presets/prestige). Para defender $380, la demo debe permitir examinar tejido, costuras y caída con fotos propias de alta resolución. Serra Coat en móvil y escritorio tiene **una sola toma desde atrás** y el storefront EN muestra una descripción en español; la versión ES traduce el título a `Abrigo Serra`, pero conserva alt manual en inglés. Son problemas de contenido/configuración de merchant, no defectos de Liquid. Shopify exige demos completas y contenido auténtico en sus [requisitos de Theme Store](https://shopify.dev/docs/storefronts/themes/store/requirements).

**Prioridad:** Claude corrige F01 sin ampliar scope; Gemini revalida foco tras Reset, cierre y navegación. Johandry aporta un PDP con 600 px, otro sin alt, video HTML5 y externo, un título hostil y fotos de Serra frontal/detalle; después GPT/Gemini repiten Gate 5 táctil y de medios. No declarar `cumplido` el zoom ni autorizar submission solo por las 16/16 pruebas del arnés.

## Trazabilidad

- Código desplegado según historial local: `a946c3b` para 5B; HEAD `715adae` solo añade esta directiva. Worktree limpio antes de escribir el informe.
- Sesión: carrito 0, sin compras ni cambios de Admin. Vista temporal 1280 x 800, 390 x 844 y 360 x 800; viewport restablecido a 1280 al terminar.
- Consola del tab probado: `dev.logs({levels:['error','warn'],limit:40}) -> []`; no demuestra ausencia de todo error de red o de otras sesiones.
- Límites: no se capturaron archivos de screenshot persistentes, recursos de red/LCP, axe, lector de pantalla ni gestos de hardware; se inspeccionaron capturas en vivo y salidas DOM. `performance` no está expuesto en el evaluador de navegador de esta sesión.
