# CLAUDE-REVIEW-B-01-001: revisión D11 de la implementación B-01 (menú móvil y breakpoint)

```text
ID: CLAUDE-REVIEW-B-01-001
Estado: Entregado. Veredicto: ACEPTADO CON CAMBIOS MENORES (M-1, solo documental; §4).
Decisión requerida: Coordinador Claude: aplicar M-1 al informe (o anotarlo en el commit) e integrar
  B-01 en `lote-b` aplicando PD-4 de la R-D al ledger. No hace falta otra revisión. Johandry: ninguna.
  No hay P0 ni P1. El código no cambia.
Resumen en 5 líneas:
  1. Diff = E1 (con el comentario de C-1) + E2 literales, +19/-0, hunks solo en ThemeDrawer (:299-302,
     :314-328); 0 apariciones de `62rem|61.99rem|47.99rem` en :274-383. Nivel 1.
  2. Arnés entregable reejecutado: fix 0 / base 41, con y sin MOBILE=1; las 4 salidas, byte a byte
     iguales a las entregadas; determinista; sin rutas absolutas.
  3. Sonda propia distinta (5 casos): fix 0 fallos (con y sin MOBILE=1) y base 10 fallos. Cubre
     teclado, Shift+Tab, un segundo theme-drawer, la recarga de sección y el `inert` global.
  4. Theme Check sin ofensas; sanity, dataset-hooks y json-validate exit 0; literal = 0; ctx-check 0
     fuera de axe.
  5. Informe exacto en cifras y líneas, pero incompleto en forma: faltan campos de la cabecera de
     RULES §1.4, el preflight literal y las afirmaciones falsables (M-1, P2 documental).
Archivos tocados: solo este archivo (nuevo). Pruebas en el scratch, `rev-b01/` (probe.mjs y sus salidas).
Desviaciones (Nivel 1 o Nivel 2): ninguna de la implementación. B-01 es Nivel 1 (confirmado).
Hallazgos extra fuera de alcance (con parche listo): ninguno nuevo. H-1..H-4 siguen como P3 (R-D §5).
Verificación (comando, resultado y qué demuestra/qué no): §1-§3. ESTÁTICO y SINTÉTICO (Chromium local,
  sin tienda). No demuestra el resize de un dispositivo real, el editor de temas, el header renderizado
  por Shopify ni la tecnología asistiva (eso queda para R-B). Compuerta del literal (copia adaptada de
  count-two.py, `rev-b01/count-rev.py`): este archivo = 0 (§3). Sin .secrets, entorno, tiendas ni gate5.
Lista de afirmaciones falsables numeradas: §5.
```

## 1. Diff (ESTÁTICO)

```text
$ git diff HEAD --numstat -- assets/theme.js            -> 19  0  assets/theme.js
$ git diff -U0 HEAD -- assets/theme.js | grep '^@@'     -> @@ -298,0 +299,4 @@ / @@ -309,0 +314,15 @@
$ sed -n 299,302p assets/theme.js | diff - <C-1 l.120-122 + directiva l.189>   -> E1C1_EXACT
$ sed -n 314,327p assets/theme.js  vs directiva l.195-208                      -> idéntico (solo difiere la valla ```js)
$ sed -n 274,383p assets/theme.js | grep -c "62rem\|61.99rem\|47.99rem"       -> 0
$ node --check assets/theme.js && echo CHECK_OK                                 -> CHECK_OK
$ git diff HEAD --stat -- . ':!agent-comms'   -> assets/theme.js (B-01) + snippets/localization-selectors.liquid (B-05, fuera de alcance)
```

`{ passive: true }` se conserva (N-1 de la R-D era opcional; no tiene efecto en `resize`). `setOpen`, `applyBackgroundInert`, las funciones globales y `CartDrawer` no se tocan. `theme-drawer` solo se emite en `sections/header.liquid:36`.

## 2. Comportamiento (SINTÉTICO, Chromium local, sin tienda)

Arnés entregable (`node agent-comms/outbox-claude/harness-B-01-001/drawer-breakpoint.mjs . <modo>`):

```text
fix exit=0 fallos=0 | base exit=1 fallos=41 | MOBILE=1 fix fallos=0 | MOBILE=1 base fallos=41
diff contra salida-{fix,base,fix-mobile,base-mobile}.txt -> SAME x4 ; 2.ª ejecución fix -> DET_OK
base, fallos por escenario: S1 8, S2 8, S4 8, vacío 6, muchos 8, arrastre 2, submenú 1 (= 41); pasan S3, teclado, Escape y cajón cerrado
grep -nE '/home|/tmp|/opt|/root|scratchpad' harness + informe -> sin salida
```

C-3 cumplido: teclado virtual, arrastre de 89 pasos con `setOpen(false)` exactamente 1 vez, `MOBILE` en `newPage` (todos los escenarios) y `activeVisible` con `getClientRects`.

Sonda propia (`rev-b01/probe.mjs`, página distinta: botón de mega menú como primer control de escritorio, localización con `select` en el panel, skip link y un segundo `theme-drawer` sin la clase del corte, siempre visible):

| Caso | fix (y MOBILE=1) | base `1fee9e2` |
| --- | --- | --- |
| P1. Abrir con Enter, ir a 1280, Tab y Shift+Tab, volver a 390, reabrir y pulsar Escape | OK. Ningún `[inert]` fuera de los paneles, `overflow: visible`, foco en el botón del mega menú, Tab a `d2`, Shift+Tab x2 al skip link y la rueda desplaza. Al volver sigue cerrado; reabre con foco en Cerrar, la trampa sigue activa y Escape devuelve el foco. | 6 FAIL |
| P2. Foco en el `select` de localización del panel, ir a 1100 | OK: cerrado y foco en el botón del mega menú | FAIL |
| P3. Segundo `theme-drawer` siempre visible y abierto, ir a 1280 y volver | OK: no se cierra (su disparador se sigue pintando). Si luego se abre el menú y se cruza, todo queda limpio. | FAIL (solo en el segundo paso) |
| P4. Recarga de sección (se sustituye `theme-drawer` por un clon) y cruce | OK: solo responden instancias conectadas (`calls=[true,true]`) y sin errores de JS | FAIL |
| P5. Cajón cerrado con el foco en el disparador, ir a 1280 | OK: no fuerza el foco | OK |

Resumen: fix 0 / 0 (MOBILE=1) y base 10. Nota: el `inert` del panel cerrado del mega menú lo pone `ThemeDisclosure` (`assets/theme.js`, `this.panel.inert = !open`); no es residuo de B-01 y la sonda lo excluye.

Qué demuestra: el mecanismo con `theme.js` y `base.css` reales, incluidas varias instancias y el ciclo de vida. Qué no demuestra: un dispositivo real, el header de Shopify, el editor de temas ni un lector de pantalla.

## 3. Compuertas estáticas y del literal (ESTÁTICO)

```text
$ npx --no-install shopify theme check --path . --fail-level error  -> 93 files inspected with no offenses found. (exit 0)
$ node scripts/theme-check-sanity.mjs -> exit 0 | dataset-hooks.mjs -> exit 0 | json-validate.mjs -> exit 0
$ python3 -I rev-b01/count-rev.py <theme.js, arnés, 4 salidas, informe>   -> todos =0
$ python3 -I ctx-check.py   -> total_lineas_literal_contexto= 1 (tests/vendor/axe.min.js) ; fuera_de_tests_vendor_axe= 0
```

## 4. Hallazgos y cambios

| ID | Prioridad | Hallazgo | Cambio |
| --- | --- | --- | --- |
| M-1 | P2 (documental) | A la cabecera de `CLAUDE-REPORT-B-01-001.md` le faltan tres campos de RULES §1.4: «Hallazgos extra…», «Verificación…» y «Lista de afirmaciones falsables numeradas». Tampoco tiene el preflight de §1.3 con salida literal (lo exige la directiva §7.1-7.2) ni una lista de afirmaciones falsables. | Añadir los tres campos y una lista numerada de afirmaciones al informe. El preflight sustituto es el que quedó a mano tras el reinicio: el `grep` de anclas y el de cortes ya figuran en §3 del informe; basta con declararlo. |
| R-1 | P3 (opcional) | `salida-base*.txt` dice `sha=HEAD`. Cuando se haga el commit de B-01, `base` sin SHA dará 0 fallos. | Documentar en el informe (o regenerar) `base 1fee9e2` explícito. |
| R-2 | P3 (opcional) | En el informe, sanity, dataset-hooks y json-validate solo muestran el exit code, y Theme Check se lanzó sin `--fail-level error`. | Ninguno: aquí se reejecutaron y el resultado es el mismo. |

No hay P0 ni P1 nuevos. Las cifras y líneas del informe son exactas (`:299-302`, `:314-328`; 41 / 0; 11 escenarios; 5 cortes desplazados +19).

## 5. Afirmaciones falsables

1. `git diff HEAD --numstat -- assets/theme.js` da `19 0`, en dos hunks (`+299,4` y `+314,15`), ambos dentro de `ThemeDrawer` (`:274-383`).
2. `assets/theme.js:299-302` coincide byte a byte con el comentario de C-1 más la línea `this.listen(window, 'resize', …)` de E1. `:314-327` coincide con E2 de la directiva.
3. Entre `:274` y `:383` hay 0 apariciones de `62rem`, `61.99rem` y `47.99rem`.
4. El arnés entregable da fix 0 y base 41, con y sin `MOBILE=1`, y sus salidas son idénticas a las cuatro entregadas.
5. La sonda del revisor da fix 0 (con y sin `MOBILE=1`) y base 10. Un `theme-drawer` cuyo disparador se sigue pintando no se cierra con `resize`.
6. Tras reemplazar `theme-drawer` por un clon, `closeIfHidden` solo corre en instancias conectadas.
7. Theme Check no encuentra ofensas; sanity, dataset-hooks y json-validate salen con exit 0; el literal da 0 en los archivos de B-01 y en esta revisión; ctx-check da 0 fuera de axe.
8. Al informe le faltan los campos «Hallazgos extra», «Verificación» y «Lista de afirmaciones falsables» de RULES §1.4.
