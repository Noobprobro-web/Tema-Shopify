# CLAUDE-REVIEW-B-01-RD-001: R-D de `CLAUDE-DIRECTIVA-B-01-001` (menú móvil al cruzar el breakpoint)

```text
ID: CLAUDE-REVIEW-B-01-RD-001
Estado: Entregado. Veredicto: APROBADA CON CAMBIOS (C-1 a C-4, §6).
Decisión requerida: Coordinador Claude: aplicar C-1 a C-4 a la directiva y entregarla al implementador
  sin nueva R-D (redacción, criterio de conteo y arnés; no cambian la solución ni la lista de archivos).
  Johandry: ninguna. Ningún hallazgo es P0/P1 nuevo y no se amplía el alcance fuera del plan (D10).
Resumen en 5 líneas:
  1. Defecto confirmado en 1fee9e2: ThemeDrawer (theme.js:274-363) no escucha resize/matchMedia/
     ResizeObserver; base.css:4389-4397 oculta .site-header__mobile-menu desde 62rem. Arnés: 25 fallos.
  2. Arnés del redactor fiel: theme-base.js idéntico a `git show 1fee9e2:assets/theme.js`; reejecutado
     aquí: base 25 / proto 0, con y sin MOBILE=1; salidas idénticas a las del redactor salvo la cabecera.
  3. Solución correcta y mínima: E1/E2 aplicados LITERALMENTE desde la directiva: node --check OK, +19/-0,
     0 fallos; extras propios: teclado virtual (solo alto) no cierra, arrastre de 90 pasos cierra 1 vez.
  4. Defecto de la directiva: el comentario de E1 contiene el literal `62rem` y rompe su propio criterio 3
     (6 apariciones, una dentro de ThemeDrawer): C-1. Más C-2 (conteo base), C-3 (arnés), C-4 (riesgo PD-1).
  5. PD-1..PD-6 decididas (§4). H-1..H-4 = P3, incluido H-2. Secuencia B-01 -> B-03 -> B-04 confirmada.
Archivos tocados: solo este archivo (nuevo). Pruebas en scratch: .../scratchpad/rd-b01/.
Desviaciones (Nivel 1 o Nivel 2): ninguna. La directiva es Nivel 1 (confirmado, §3).
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo; H-1..H-4 clasificados en §5.
Verificación (comando, resultado y qué demuestra/qué no): §1 y §2. ESTÁTICO y SINTÉTICO (Chromium local,
  sin tienda). No demuestra resize real de dispositivo, editor de temas ni tecnología asistiva.
  Compuerta del literal (copia adaptada de count-two.py, rd-b01/count-rd.py):
  agent-comms/outbox-claude/CLAUDE-REVIEW-B-01-RD-001.md=0. Sin .secrets, entorno, tiendas ni gate5.
Lista de afirmaciones falsables numeradas: §8.
```

---

## 1. Verificación estática (ESTÁTICO, `1fee9e2`, copia de trabajo limpia en `assets/`)

```text
$ git log --oneline -1                      -> 1fee9e2 Lote A: R-A estatica (aceptado con cambios), ledger y estado
$ git diff --quiet 1fee9e2 -- assets/theme.js assets/base.css && echo WT_CLEAN   -> WT_CLEAN
$ grep -n "62rem\|61.99rem\|47.99rem" assets/theme.js   -> :395 (comentario), :408, :1861, :3788, :4481
$ grep -n "this.listen(window, 'resize'" assets/theme.js -> 3883 (positionPopover, otra clase)
$ sed -n 4389,4397p assets/base.css         -> @media (min-width: 62rem) { ... .site-header__mobile-menu { display: none; } ...
$ sed -n 140,146p assets/base.css           -> body[data-drawer-open], body[data-modal-open] { overflow: hidden; }
```

- `ThemeDrawer` (`assets/theme.js:274-363`): cierres solo por botón (`:288-290`), overlay (`:291-293`), Escape (`:294-298`), `closeOtherDialogs` y `disconnectedCallback` (`:301-304`). Sin escucha de tamaño. Confirmado.
- `getFocusableElements` (`:18-22`) excluye `[hidden], [inert]` y exige `getClientRects().length > 0`: tras `setOpen(false)` (que llama a `restoreBackgroundInert`), la nav de escritorio ya es elegible. El orden de E2 (cerrar y luego buscar destino) es el correcto.
- `sections/header.liquid:34` (`data-section-id` en `<header>`), `:36` (`<theme-drawer class="site-header__mobile-menu">`), `:42` (trigger), `:128` (cierre) y `:129` (nav de escritorio justo después): el «primer control visible que sigue» es el primer elemento de la nav de escritorio (enlace o botón de `mega-menu`), o el logo si el menú está vacío. Confirmado.
- `theme-drawer` solo se emite en `sections/header.liquid` (grep en `sections/ snippets/ layout/`). El barrido de clase de §2.2 es correcto: ningún otro diálogo con `inert` de fondo lo oculta un corte CSS.
- Media query en `rem`: se evalúa con el tamaño de fuente **inicial**, no el de `:root`. Por eso el riesgo residual de PD-1 que cita la directiva (cambio de fuente raíz en caliente) no mueve el corte (X3, §2): C-4.

## 2. Verificación SINTÉTICA propia (Chromium local, sin tienda)

Fidelidad del arnés del redactor (`.../scratchpad/b01/`):

```text
$ git show 1fee9e2:assets/theme.js | cmp - b01/theme-base.js && echo BASE_IDENTICAL   -> BASE_IDENTICAL
$ diff b01/theme-base.js b01/theme-proto.js   -> solo +E1 (1 línea) y +E2 (método, 12 líneas), sin comentarios
$ diff b01/harness.mjs b01/harness-mobile.mjs -> solo isMobile/hasTouch y tap condicionados a MOBILE
reejecución en rd-b01/:  base exit=1 fallos=25 | base-mobile(MOBILE=1) fallos=25 | proto exit=0 fallos=0 | proto MOBILE=1 fallos=0
diff (sin línea sha=) contra b01/salida-base.txt y salida-proto.txt -> SAME_BASE, SAME_PROTO
```

Observación de fidelidad: `MOBILE` solo afecta a `scenario()`; Escape, «cajón cerrado» y «submenú» corren siempre sin táctil. La comprobación «foco fuera de BODY y visible» no mide la visibilidad. Ambas cosas van a C-3.

Directiva aplicada al pie de la letra (texto de E1 y E2 extraído del propio `.md`, anclas de cuenta 1):

```text
$ node --check rd-b01/theme-directiva.js && echo CHECK_OK  -> CHECK_OK
$ diff assets/theme.js rd-b01/theme-directiva.js | grep -c '^>'  -> 19 ; '^<' -> 0
$ grep -n closeIfHidden ...           -> 302 (listener), 317 (método); ThemeDrawer 274..ProductGallery 384
$ grep -n "62rem\|61.99rem\|47.99rem" -> 300: // .site-header__mobile-menu desde 62rem) ...   <- 6.ª aparición, dentro de ThemeDrawer
JSFILE=theme-directiva.js harness (sin MOBILE / MOBILE=1)  -> fallos=0 / fallos=0
JSFILE=theme-directiva.js extra.mjs                        -> fallos=0
```

Escenarios extra del revisor (`rd-b01/extra.mjs`, base vs proto):

| Escenario | base `1fee9e2` | proto / directiva |
| --- | --- | --- |
| X1 teclado virtual: abierto a 390×844 → 390×420 → 390×844 (solo cambia el alto) | OK (sigue abierto) | OK: sigue abierto, `inert` y bloqueo intactos, foco en Cerrar. **No cierra indebidamente.** |
| X2 arrastre: 89 `setViewportSize` de 400 a 1280 sin esperar | FAIL (queda abierto) | OK: 9 eventos `resize` (Chromium los agrupa por frame), 7 llamadas a `getClientRects`, `setOpen(false)` exactamente 1 vez, foco en `d-shop`. |
| X3 `:root { font-size: 8px }` a 900 px sin resize (informativo) | trigger sigue pintado | igual: el corte no se mueve; Escape cierra. Riesgo residual inexistente para este caso. |
| X4 nav de escritorio vacía, 390 → 1280 | FAIL | OK: foco al logo. |

Qué demuestra: el mecanismo con `theme.js` y `base.css` reales en Chromium. Qué no: iOS/Android reales (teclado y barra de URL), el editor de temas, el header renderizado por Shopify ni lectores de pantalla (R-B, §4.4 de la directiva).

## 3. Evaluación de la solución

- **Una sola fuente del corte:** sí. El JS pregunta al CSS (`getClientRects` del disparador, modismo ya usado en `:21`). Cumple el plan (`:253`, `:520`) siempre que el comentario no repita el literal (C-1).
- **Scroll, `inert`, foco:** `setOpen(false)` reutiliza `syncDialogScrollLocks` y `restoreBackgroundInert` (que solo quita lo que puso). Correcto; no duplica estado.
- **Rendimiento:** con el cajón cerrado el handler sale en `!this.isOpen` (un `getAttribute`). Abierto, `getClientRects` fuerza un layout que el `resize` ya requiere, y deja de llamarse tras cerrar. `resize` ya llega a ritmo de frame (X2): **no hace falta throttle ni rAF**. `{ passive: true }` no tiene efecto en `resize`; inocuo.
- **Orientación y zoom:** el giro con cruce (S2) cierra; sin cruce (S3) no. El zoom del navegador cambia el ancho CSS y dispara `resize`: correcto. El pellizco no cambia el viewport de layout: no actúa, correcto.
- **Teclado virtual:** el corte depende solo de `min-width`; un cambio de alto nunca oculta el disparador (X1). No cierra indebidamente.
- **Reapertura:** al volver a móvil el disparador reabre con foco en Cerrar y Cerrar devuelve el foco al disparador (S1/S2/S4 OK).
- **Rama `focusWasInside === false`:** con el cajón abierto todo lo exterior es `inert` y el disparador está dentro de `theme-drawer`, así que es inalcanzable en uso normal; queda como guarda. Aceptable (RULES §4.2: la directiva lo declara).
- **Ciclo de vida:** `this.listen` cuelga del `AbortController`; recarga de sección en el editor lo retira. Correcto.
- **Nivel 1:** confirmado. Un archivo de tema, sin `id`, `default`, schema, `t:` ni `aria-*` nuevos.

## 4. Decisiones PD-1 a PD-6

| PD | Decisión | Motivo |
| --- | --- | --- |
| PD-1 | `resize` + `getClientRects` del disparador. Sin `ResizeObserver`. | Cubre ancho, giro y zoom; sin `disconnect()` manual. El caso que justificaría `ResizeObserver` (fuente raíz) no mueve un corte en `rem` (X3). Corregir el texto del riesgo residual (C-4). |
| PD-2 | Primer control visible que sigue al cajón en su sección; logo si la nav está vacía; si no hay ninguno, no se fuerza. | Conserva la posición lógica (WCAG 2.4.3). BODY pierde la posición; `#MainContent` salta la cabecera. Probado en S1/S4/X4. |
| PD-3 | Se acepta: los submenús internos quedan como estén. | Mismo comportamiento que el cierre por botón; plegarlos tocaría todos los cierres (fuera de alcance). |
| PD-4 | En el mismo commit que integre B-01 (tras la revisión D11 de la implementación), el coordinador pasa la fila `:50` a **`código completo`**, sustituye la evidencia obsoleta (H-4) por anclas actuales (`ThemeDrawer.closeIfHidden`, arnés `harness-B-01-001`, 0 fallos SINTÉTICOS) con nota «pendiente R-B §4.4» y recalcula la cabecera con `node scripts/ledger-verify.mjs`. `:49` sin cambio de estado, con nota B-01. El implementador solo lo propone. | Mismo criterio que D-1 de `CLAUDE-REVIEW-A-03-RD-001`: TT-104 reproducido en tienda contradice el `cumplido` (RULES §3.8, §5). |
| PD-5 | Fuera de B-01 (H-3). | Comportamiento genérico del CSS responsive, no del cajón. |
| PD-6 | Confirmado: `assets/base.css` queda fuera de la lista cerrada. | La solución no lo necesita y el CSS sigue siendo la fuente del corte. |

## 5. Hallazgos H-1 a H-4

| H | Clasificación | Nota |
| --- | --- | --- |
| H-1 cortes duplicados en JS | P3 | Higiene; cada uno necesita su contrato. Fuera de B-01. |
| H-2 carrito abierto desde el menú, cruce y cierre | **P3** (no P0/P1 nuevo) | ESTÁTICO confirmado: `CartDrawer.open()` (`:2488-2492`) fija el disparador del menú como retorno y `close()` (`:2528-2530`) solo comprueba `isConnected`, no si se pinta. Resultado: foco en BODY tras cerrar el carrito, sin trampa, sin bloqueo de scroll ni `inert` residual; la página sigue operable y el siguiente Tab avanza. Preexistente; B-01 no lo empeora (con el carrito abierto el menú ya está cerrado y `closeIfHidden` no actúa). No se añade a B-03/B-04 (sería ampliar su alcance); el coordinador lo registra como tarea P3 y R-B lo observa. |
| H-3 foco en control solo de escritorio al volver a móvil | P3 | Genérico. |
| H-4 evidencia obsoleta en `:50` | P3 documental | Se resuelve con PD-4. |

## 6. Cambios obligatorios (lista exacta)

- **C-1 (E1, §3.1).** Sustituir la segunda línea del comentario de E1 para que no contenga el literal del corte. Texto exacto de las tres líneas de comentario:
  ```js
        // B-01 (TT-104). El corte movil/escritorio vive solo en el CSS (base.css oculta
        // .site-header__mobile-menu en escritorio). Si el cajon abierto deja de pintarse por un
        // cambio de ancho o un giro, se cierra aqui y devuelve scroll, inert y foco sin Escape.
  ```
  Añadir al criterio 3 de §4.1: «`grep -c "62rem" ` entre `class ThemeDrawer` y `class ProductGallery` = 0».
- **C-2 (§4.1 criterio 5 y §8.4).** Los «25 fallos» son del arnés del redactor sin degenerados. Redactar: «En modo `base` fallan S1, S2, S4, submenú, vacío, muchos y arrastre (se informa el total; 25 corresponde al arnés del redactor sin degenerados); pasan S3, teclado virtual, Escape y cajón cerrado».
- **C-3 (§4.2, arnés entregable).** Añadir: (a) teclado virtual: abierto a 390×844 → 390×420 → 390×844, debe seguir abierto con bloqueo, `inert` y foco en Cerrar; (b) arrastre: ≥ 50 `setViewportSize` de 400 a 1280 sin esperar entre pasos, `setOpen(false)` exactamente 1 vez (instrumentado en la página) y estado final coherente; (c) `MOBILE=1` aplica a todos los escenarios, no solo al de cruce; (d) el criterio «foco visible» comprueba `getClientRects().length > 0` del elemento activo.
- **C-4 (§3.3 fila `ResizeObserver` y §6.1 riesgo residual).** Sustituir «cambio de tamaño de fuente raíz sin `resize`» por: «las media queries en `rem` usan el tamaño de fuente inicial, no el de `:root`; el único caso residual es cambiar en caliente el tamaño de fuente por defecto del navegador sin `resize`, raro, y Escape lo recupera».

Opcional (no bloquea): N-1, quitar `{ passive: true }` de E1 (sin efecto en `resize`; `:3883` no lo usa). Si se quita, el diff sigue siendo +19.

## 7. Secuencia

Confirmada: **B-01 → B-03 → B-04**, turnos secuenciales sobre `assets/theme.js` con commit del coordinador entre turnos. B-01 inserta +19 líneas antes de `:311`; `CartDrawer` y todo lo posterior se desplazan +19, por eso B-03/B-04 localizan por ancla. B-05 no edita `assets/theme.js`, pero cita `LocalizationForm` en `:4841-4866`: tras B-01 serán `:4860-4885` aprox.; localizar por ancla. B-05 no tiene dependencia de orden con B-01.

## 8. Afirmaciones falsables

1. `git show 1fee9e2:assets/theme.js` es byte a byte igual a `scratchpad/b01/theme-base.js`.
2. El arnés del redactor reejecutado da base 25 / proto 0 fallos, con y sin `MOBILE=1`, y sus salidas coinciden con `salida-base.txt` y `salida-proto.txt` salvo la línea `sha=`.
3. E1 y E2 aplicados literalmente desde la directiva: `node --check` OK, 19 líneas añadidas y 0 borradas, `closeIfHidden` en 2 líneas, ambas entre `class ThemeDrawer` y `class ProductGallery`.
4. Con E1 literal, `grep -n "62rem\|61.99rem\|47.99rem"` devuelve 6 apariciones, una en el comentario de E1 dentro de `ThemeDrawer` (C-1).
5. Con la directiva aplicada, el cambio solo de alto 390×844 → 390×420 deja el cajón abierto con foco en Cerrar.
6. Con 89 cambios de ancho seguidos de 400 a 1280, Chromium entrega 9 eventos `resize` y `setOpen(false)` se llama 1 vez.
7. Con `:root { font-size: 8px }` a 900 px, el disparador sigue pintado (el corte en `rem` no se mueve).
8. Con la nav de escritorio vacía, el foco tras cruzar va a `#logo`.
9. `CartDrawer.close()` devuelve el foco con la única condición `returnFocusTarget?.isConnected` (`assets/theme.js:2528-2530`).
10. Ninguna de las decisiones de esta R-D requiere a Johandry.
