# CLAUDE-REPORT-MOTION-002: cierre del sprint de migración del motor de movimiento a CSS scroll-driven nativo

```text
ID: CLAUDE-REPORT-MOTION-002
Alcance de este informe: trazabilidad, configuración de compuertas y ejecución de compuertas.
  La implementación la hicieron 6 agentes previos; aquí no se escribió ni una línea de assets/,
  layout/, sections/, config/, locales/ ni docs/merchant/.
Estado: CÓDIGO COMPLETO, SIN CERTIFICAR. El sprint cierra en lo documentable y NO cierra en
  verificación: no hay ni una medición en storefront vivo, ni una apertura en Safari, ni una
  ejecución real de la rama de respaldo B8.1.
Compuertas: `npm run gates:static` sale 1. Falla la compuerta 1 de 8 (`gates:json`) por 75 JSON
  de `scratch/`, fuera del tema y fuera de mi frontera. Las otras 7 pasan por separado.
Decisión requerida:
  (1) Exportar STOREFRONT_PASSWORD y ejecutar harness-MOTION-002 (desbloquea 4 filas del ledger).
  (2) Rotar la contraseña del storefront: las cookies de sesión SÍ están publicadas en GitHub.
  (3) Aplicar `patch-gates-static-scratch.diff` (está en scripts/, fuera de mi frontera).
  (4) Volver a desplegar las 3 demos: hoy sirven el motor GSAP que el repositorio ya no tiene.
  (5) ¿Changelog para comerciantes por la pérdida de la aceleración del marquee?
Resumen en 6 líneas:
  1. Balance: -125.737 B de JavaScript (3 assets borrados) a cambio de +339 líneas de CSS y
     +169/-15 de JS. GSAP nunca estuvo commiteado: se sustituye un experimento, no una función
     publicada en el repositorio. Pero SÍ está desplegado en las 3 demos (C-02).
  2. `.theme-check.yml` creado: 787 archivos / 2.487 ofensas / 9 errores -> 88 archivos /
     0 ofensas / exit 0, con el preset recomendado COMPLETO y cero checks desactivados.
  3. Ledger: 57 -> 60 filas. Fila 55 reescrita (hoy 56) y degradada a `código completo` porque
     citaba `assets/motion.js`, un archivo borrado. 3 filas nuevas: 38, 57 y 58.
  4. Las 6 correcciones a la especificación quedan registradas, incluida la que importa:
     Firefox NO soporta scroll-driven animations, ni en la 158 Beta.
  5. 3 bugs activos arreglados por la migración (no latentes): comilla decapitada en móvil,
     carril de pestañas scrollable y 9,7 px de fondo asomando sobre el elemento LCP.
  6. 4 conflictos con TECH-AUDIT-001 detectados y NO resueltos: se reportan al orquestador.
Archivos tocados (los 5 de mi frontera, ni uno más):
  .theme-check.yml  (nuevo, 110 líneas)
  docs/requirements-ledger.md  (encabezado + fila 56 reescrita + filas 38, 57, 58 nuevas)
  agent-comms/BOARD.md  (cabecera, §2, §3, §4 nueva, §5)
  agent-comms/outbox-claude/CLAUDE-REPORT-MOTION-002.md  (este archivo)
  agent-comms/outbox-claude/CLAUDE-REVIEW-GEMINI-AUDIT-360.md:112-113  (solo esas 2 líneas)
  Artefacto regenerado por compuerta: Sartorial-1.0.0.zip (306,0 KB, 103 entradas). Está en .gitignore.
Desviaciones (Nivel 1 o Nivel 2):
  N1. `listings/` NO se excluye en `.theme-check.yml`, aunque no está en THEME_DIRS de
      scripts/theme-check-sanity.mjs. Motivo: viaja dentro del paquete (16 entradas verificadas
      en el zip) y hoy aporta 0 ofensas, así que excluirlo solo crearía un hueco ciego en
      archivos que se envían a Shopify. Justificado en comentario dentro del archivo.
  N1. `.tmp/` tampoco se excluye, aunque es desechable: el sandbox de `gates:sanity` vive ahí y
      excluirlo haría que la compuerta de cordura viera "0 ofensas" y concluyera en falso que
      Theme Check no detecta nada. Verificado: con el archivo nuevo, `gates:sanity` sigue
      detectando las 3 mutaciones y sale 0.
  N2. No se verificó la cadena `gates:static` parcheada. Se demostró por partes: 0 fallos de
      parseo fuera de `scratch/` (75 de 75 están dentro) y las otras 7 compuertas en verde por
      separado. No se aplicó el parche porque `scripts/` está fuera de mi frontera.
Hallazgos extra fuera de alcance (con diagnóstico):
  X1. [P0] Las 3 tiendas demo sirven GSAP. El pull congelado del 2026-10-01 22:25
      (`scratch/audit-live-pull/full-*/`) trae los 3 assets y un `layout/theme.liquid` que los
      carga en 103-105. Rompe el "60 de 60 idénticos byte a byte" del Rol 8 de TECH-AUDIT-001.
  X2. [P1] Los 9 errores de Theme Check del rastreo sin alcance eran precisamente
      `MissingAsset` de gsap.min.js, gsap-scrolltrigger.min.js y motion.js en esas tres copias
      congeladas: el síntoma de X1 visto desde la compuerta.
  X3. [P2] El modo `None` no está descrito en ninguna superficie de comerciante. El `info` de
      `settings_schema.animations` describe Subtle y Full con precisión y no dice qué hace None;
      la opción solo tiene la etiqueta "None".
  X4. [P3] El ledger arrastra localizadores desplazados de sprints anteriores que la compuerta
      no detecta porque solo comprueba el rango (filas 32, 33, 47, 48, 49, 51, 53, 54 y otras
      apuntan a líneas que ya no contienen lo que la evidencia dice). No se tocaron: están
      fuera del alcance de esta tarea y ninguno rompe `gates:ledger`.
  X5. [P3] Los 4 parches de TECH-AUDIT-001 siguen aplicando limpios tras MOTION-002
      (`git apply --check` sale 0 en los cuatro). El X5 toca `layout/theme.liquid` y no
      `assets/base.css`, así que la migración no lo invalidó.
Verificación (comando, resultado y qué demuestra / qué no):
  V1. `shopify theme check --init` en un directorio limpio -> plantilla con `extends` e `ignore`.
      Demuestra que la sintaxis del archivo es la de la herramienta y no una invención.
      NO demuestra nada sobre el contenido del tema.
  V2. `shopify theme check --print` sin config vs `-C theme-check:recommended` -> `diff` vacío.
      Demuestra que fijar el preset no relaja ni endurece nada hoy. NO garantiza que una versión
      futura del CLI mantenga ese predeterminado: por eso se fija.
  V3. `shopify theme check -o json` antes -> 787 archivos, 2.487 ofensas, 9 errores, 165
      archivos afectados, 0 en carpetas de tema. Después -> 88 archivos, 0 ofensas, exit 0.
  V4. `npm run gates:sanity` con el archivo nuevo -> las 3 clases detectadas por separado y
      sandbox restaurado limpio, exit 0 en 28 s. Demuestra que acotar el alcance no cegó la
      compuerta. NO demuestra cobertura exhaustiva de checks.
  V5. `npm run gates:ledger` -> 60 filas, 54/6/0/0, 0 incoherencias, exit 0. Demuestra que los
      localizadores nuevos existen y están en rango. NO demuestra que prueben su requisito.
  V6. `git merge-base --is-ancestor ff3dca1 origin/master` -> código 0. Demuestra que las
      cookies de sesión de `harness-AUDIT-360-001/lh-headers.json` llegaron a GitHub.
  V7. `git ls-files assets/ | grep -i "gsap\|motion"` y `git log --all -- assets/gsap.min.js
      assets/gsap-scrolltrigger.min.js assets/motion.js` -> ambos vacíos. Demuestran que los
      tres assets nunca estuvieron en el repositorio.
  V8. Todos los localizadores de este informe y del ledger se derivaron por grep sobre los
      archivos actuales. Ninguno viene de los informes de los 6 agentes: sus números se habían
      pisado entre ellos (+23 líneas en la cabecera de base.css desplazaron a todos los demás).
Lista de afirmaciones falsables numeradas:
  1. `assets/gsap.min.js`, `assets/gsap-scrolltrigger.min.js` y `assets/motion.js` no existen en
     disco ni en ningún commit alcanzable del repositorio.
  2. `git diff layout/theme.liquid` está vacío, y el único `<script src>` del tema en ese archivo
     es `theme.js` en la línea 95 (más `shopify-xr.js` condicional en 129).
  3. `shopify theme check` en la raíz sale 0 con "88 files inspected with no offenses found".
  4. `.theme-check.yml` no contiene ninguna entrada de check individual: solo `extends` e `ignore`.
  5. `npm run gates:ledger` sale 0 y reporta 60 filas: 54 cumplido, 6 código completo.
  6. `npm run gates:json` sale 1 y los 75 fallos de parseo están todos bajo `scratch/`.
  7. `npm run gates:hooks`, `gates:sanity`, `gates:locales`, `gates:ledger`, `gates:theme-check`,
     `gates:syntax` y `gates:package` salen 0 cada uno por separado.
  8. `Sartorial-1.0.0.zip` tiene 103 entradas, 306,0 KB, 3 assets (base.css, theme.js,
     product-zoom.js) y ninguna referencia a gsap ni a motion.
  9. `scratch/audit-live-pull/full-atelier/assets/` contiene gsap.min.js (72.927 B),
     gsap-scrolltrigger.min.js (44.575 B) y motion.js (8.235 B).
 10. `locales/en.default.schema.json` describe Subtle y Full en
     `settings_schema.animations.settings.animations.info` y no describe None en ninguna clave.
```

---

## 1. Balance de la migración

| Concepto | Antes | Después | Delta |
|---|---|---|---|
| `assets/gsap.min.js` | 72.927 B | borrado | −72.927 B |
| `assets/gsap-scrolltrigger.min.js` | 44.575 B | borrado | −44.575 B |
| `assets/motion.js` | 8.235 B | borrado | −8.235 B |
| **JavaScript retirado** | | | **−125.737 B** |
| `<script src>` en modo Full | 4 | 1 | −3 |
| `assets/base.css`, regiones de movimiento | | | +339 líneas |
| `assets/theme.js`, motor de revelado | | | +169 / −15 líneas |
| `sections/marquee.liquid` | | | +8 / −1 líneas |
| `Sartorial-1.0.0.zip` | | 306,0 KB, 103 entradas | 3 assets, 0 referencias a GSAP |

El bloque B8 completo vive en `assets/base.css:8707-8998` (293 líneas); el resto del delta de CSS
se reparte entre los tokens de movimiento (`assets/base.css:66-84`, 19 líneas), la llave 3 de
impresión (`assets/base.css:9043-9054`, comentario incluido), los dos `clip-path: none !important`
de las llaves 1 y 2 (`assets/base.css:9014-9016` y `assets/base.css:9034-9035`) y los ajustes del marquee
(`assets/base.css:3741-3745` y `assets/base.css:3983-3987`).

**Cifras de la especificación original frente a lo medido.** La especificación del sprint hablaba
de "+322 líneas en base.css" y "+59 en theme.js". Medido con `git diff --numstat` por hunk: el
bloque B8 son 293 líneas y el total de las regiones de movimiento de `base.css` son 339
inserciones; en `theme.js` son 169 inserciones, de las cuales 82 son líneas de código y 69 de
comentario. Las dos cifras de la especificación encajan si se cuenta el bloque B8 a secas y solo
las líneas de código: no hay discrepancia de fondo, pero este informe usa lo medido.

### 1.1 GSAP nunca estuvo en el repositorio

`git ls-files assets/` no lista ninguno de los tres assets y `git log --all --` sobre los tres no
devuelve ni un commit. El bloque de `layout/theme.liquid` que los cargaba era trabajo sin
commitear: `git diff layout/theme.liquid` está vacío, y el archivo de HEAD ya solo trae `theme.js`.

Dicho con precisión, y sin dramatizar en ninguna dirección: **esta migración sustituye un
experimento que no entró al repositorio, no retira una función publicada en él.** El paquete que
se envía a Shopify nunca contuvo GSAP.

Lo que sí es cierto en la otra dirección, y es un hallazgo de este cierre: **las 3 tiendas demo
tienen GSAP desplegado.** Ver §6, conflicto C-02.

---

## 2. Arquitectura final

**La selección de motor es 100 % cascada CSS.** No hay una sola rama en JavaScript que decida qué
motor anima:

```
@supports (animation-timeline: view()) and (animation-range: entry 0% entry 100%)   base.css:8745
  -> B8.2, el motor nativo (dentro de @media (prefers-reduced-motion: no-preference), base.css:8746)
@supports not (animation-timeline: view())                                          base.css:8730
  -> B8.1, el respaldo: reusa el estado oculto y la transición de B2 y les sube
     distancia, duración y escalonado a los tokens expresivos
```

Son dos pruebas y no una a propósito: hubo versiones de navegador que aceptaban `view()` pero no la
sintaxis de dos valores de `animation-range`, y ahí los rangos se quedaban sin resolver y la
coreografía entera no arrancaba.

`data-motion-engine` se eliminó. `initScrollReveal` (`assets/theme.js:4715`) es agnóstico: **no
consulta `CSS.supports` en ningún punto** (comprobado por grep: la cadena no aparece en
`assets/theme.js`). Solo reparte coreografía y publica `--reveal-index`.

**Contrato de atributos**

| Atributo | Significado |
|---|---|
| `html[data-reveal-ready]` | el motor de JavaScript arrancó. Lo escribe solo `assets/theme.js:4721` |
| `[data-reveal=""]` | pendiente de coreografía |
| `[data-reveal="done"]` | asentado, el gesto terminó |
| `[data-revealed]` | marca del respaldo IntersectionObserver |
| `html[data-animations]` | `none` / `subtle` / `full`, lo pone el Liquid en `layout/theme.liquid:3` |

**Animaciones** (`assets/base.css:8914-8998`): `scroll-rise` (revelado genérico), `scroll-fade` y
`scroll-line-rise` (los siete encabezados editoriales: el contenedor funde y sus líneas suben
recortadas por una máscara fija), `scroll-unveil` y `scroll-unveil-settle` (las cuatro masas
fotográficas, que se descubren de abajo arriba mientras la foto se asienta), `hero-parallax` y
`marquee-drift` (con `animation-composition: add`, `assets/base.css:8907`).

**Las tres llaves de apagado**, por orden de autoridad:

| Llave | Disparador | Localizador |
|---|---|---|
| 1 | el comerciante elige `animations: none` | `assets/base.css:9001-9017` |
| 2 | el visitante pide reducir movimiento. Gana siempre | `assets/base.css:9020-9041` |
| 3 | papel (`@media print`). **Nueva en MOTION-002** | `assets/base.css:9047-9054` |

Las llaves 1 y 2 añadieron `clip-path: none !important` porque la máscara tipográfica de B8.2b
recorta por el borde del contenedor: sin anularla, apagar el movimiento dejaba las líneas
recortadas en su posición inicial.

---

## 3. Las 6 correcciones a la especificación

### M-01. Firefox NO soporta scroll-driven animations

La especificación del sprint decía Firefox 144+. Es falso. Fuente primaria: **ni la 158 Beta
(octubre de 2026) lo trae habilitado**; sigue detrás de la preferencia
`layout.css.scroll-driven-animations.enabled` y el meta bug de Bugzilla **1676780** continúa en
estado NEW. Solo Nightly.

**Matriz de soporte real**

| Navegador | Soporte de `animation-timeline: view()` | Rama que ejerce |
|---|---|---|
| Chrome | 115+ | B8.2, motor nativo |
| Edge | 115+ | B8.2, motor nativo |
| Safari macOS | 26.0+ | B8.2, motor nativo |
| Safari iOS | 26.0+ (idéntico a macOS) | B8.2, motor nativo |
| **Firefox** | **NO** (tras preferencia, solo Nightly; meta bug 1676780 NEW) | **B8.1, respaldo** |

Cobertura caniuse **87,22 %** (dataset de agosto de 2026); **85-86 % efectivo**. Es decir: en torno
al 13-15 % del tráfico ve la rama de respaldo, y esa rama **no se ha ejecutado ni una vez** (§5).

### M-02. Hero: `animation-range-start: exit 0%`, no `calc(0% - var(--header-offset))`

`html { scroll-padding-block-start: var(--header-offset) }` ya existe (`assets/base.css:7934`) y
los view timelines no miden contra el viewport sino contra la región óptima de visionado, que ya
descuenta la cabecera pegada. Restarla otra vez adelanta el inicio por debajo del scroll 0.

Medido con una cabecera de 77 px: con la resta, el progreso **nace en 0,124** a scroll 0 y asoman
**9,7 px de `--color-surface`** por el borde superior del medio antes de que nadie toque la rueda,
y justo en el elemento LCP. Con `exit 0%` (`assets/base.css:8881`) el progreso nace en 0 y avanza
ya en el primer píxel de scroll.

### M-03. El estado oculto fabrica su propio scroll

El `translateY(64px)` del estado oculto desborda el documento cuando el pendiente es lo último de
la página, y fabrica **hasta 64 px de `scrollHeight` que no existían** (medido: 732 px de layout
frente a 785 de `scrollHeight`).

Por eso la guardia de fin de página mide contra `root.offsetHeight` y **no** contra `scrollHeight`
(`assets/theme.js:4762`), y por eso hay un `ResizeObserver` sobre la raíz
(`assets/theme.js:4881-4882`) que repite la guardia cuando cambia la geometría: el evento de scroll
no llega si la página dejó de scrollear (el editor de temas conmuta el viewport, el móvil rota, el
editor quita una sección).

**Queda documentado aquí porque sin la explicación alguien "simplificará" esas dos piezas y
reabrirá el bug.** Con `scrollHeight`, la página corta parecería scrollear por culpa del elemento
que se intenta rescatar, y ese elemento no se asentaría nunca: se quedaría invisible en pantalla.
En una página con pie, ambas medidas coinciden, así que el error no se ve hasta que aparece la
plantilla corta.

### M-04. El marquee cambió de naturaleza

| | Antes (GSAP) | Ahora (CSS) |
|---|---|---|
| Qué lee | la **velocidad** del scroll | la **posición** del scroll |
| Mecanismo | `playbackRate` 1 → 4× | 16vw aditivo (`--marquee-drift`, `assets/base.css:84`) |
| Bucle base | 32 s autónomo | 32 s autónomo, **se conserva** |
| Composición | — | `animation-composition: add` (`assets/base.css:8907`) |

`playbackRate` no tiene equivalente en CSS: la aceleración por velocidad de scroll **se perdió**, y
es la única pérdida funcional visible de la migración. Requirió un tercer grupo en
`sections/marquee.liquid:22` y el token `--marquee-groups`, que el keyframe base consume en
`assets/base.css:3987` para que el ciclo cierre sobre la copia siguiente sea cual sea el número de
grupos.

**Efecto lateral positivo:** el estado degenerado "Único" mejora. Con tres grupos, el grupo mínimo
para que la banda no deje hueco baja de **≥100vw a ≥58vw**.

### M-05. Desviación de nivel 1: el primer fotograma en modo `subtle`

En modo `subtle`, los elementos visibles al cargar **ya no pasan un fotograma ocultos**. El
observador de entrada decora solo lo que está por debajo del pliegue o lo que no tiene caja; lo
visible se suelta sin tocarlo (`assets/theme.js:4794`).

Mejora el LCP y elimina un parpadeo, pero **es un cambio perceptible de comportamiento y se
registra como desviación, no como mejora silenciosa.**

### M-06. Menores

| Qué | Antes | Ahora | Localizador |
|---|---|---|---|
| Selector muerto | `.newsletter-section .newsletter__inner` (clase que no existe en ninguna sección ni snippet: la sección de newsletter nunca tuvo revelado) | `.newsletter-section__inner` | `assets/theme.js:4692` |
| Carril de pestañas | `.curated-showcase__tabs` animaba sus botones | excluido de la animación de líneas | `assets/base.css:8832-8835` |
| Máscara tipográfica | `inset(0 -1rem)` | `inset(-100% -1rem 0)` | `assets/base.css:8779` |
| Suelo del observador | sin clamp | `SETTLE_LINE_MIN = 10` | `assets/theme.js:4713` |

---

## 4. Bugs encontrados y arreglados

Tres de ellos eran **activos**, no latentes: se reproducían con el tema tal y como estaba.

| # | Bug | Severidad | Arreglo |
|---|---|---|---|
| B-1 | La comilla de `.brand-manifesto__quote-mark` **se recortaba** en móvil 390×844 sin eyebrow. Es absoluta y cuelga 1,5rem por encima de su `blockquote`; sin eyebrow su borde superior coincide exactamente con el del contenedor (`padding-block-start: var(--space-lg)` = 1,5rem, 0 px de margen medido). | Activo, visible | Máscara a `inset(-100% -1rem 0)`: el borde superior queda abierto y solo se recorta el inferior, que es el único que el gesto necesita (`assets/base.css:8779`) |
| B-2 | `.curated-showcase__tabs` tiene `overflow-x: auto`, y la regla que prohíbe desbordar un solo eje lo deja con `overflow-y: auto` también. Mover sus botones 64 px convertía el carril en scrollable mientras duraba la entrada: `scrollHeight` pasaba de 52 a 116 px, asomaba una barra vertical y los botones se salían del recorte. | Activo | `animation-name: none` sobre `.curated-showcase__tabs[role='tablist'] > *`, con especificidad (0,6,1) para no depender del orden en el archivo (`assets/base.css:8832-8835`) |
| B-3 | 9,7 px de fondo asomando por el borde superior del medio del hero a scroll 0, con cabecera de 77 px, en el elemento LCP. | Activo | `animation-range-start: exit 0%` (M-02) |
| B-4 | La sección de newsletter nunca recibió revelado por un selector que no existe. | Latente desde su sprint | `.newsletter-section__inner` |
| B-5 | Con tokens largos (distancia + 7 escalones ≥ 94), el `rootMargin` del observador de asentamiento llegaba a −100 %, su caja raíz colapsaba y no disparaba nunca: nada se asentaba y cada elemento se deshacía al volver a subir. | Latente, dependiente de configuración | `SETTLE_LINE_MIN = 10`, que deja una banda de 70-100 px (`assets/theme.js:4713`) |
| B-6 | Al imprimir, todo lo pendiente de revelar se quedaba en progreso 0 y **salía en blanco en papel**. Las dos llaves existentes no cubren el caso: una depende de `data-animations: none` y la otra de `prefers-reduced-motion`. | Activo en impresión | Llave 3, `@media print` (`assets/base.css:9047-9054`) |
| B-7 | Apagar el movimiento (llave 1 o llave 2) dejaba las líneas recortadas por la máscara en su posición inicial. | Habría sido activo al introducir la máscara | `clip-path: none !important` en las dos llaves (`assets/base.css:9016` y `assets/base.css:9035`) |
| B-8 | La página corta no se asentaba nunca porque el estado oculto fabricaba scroll fantasma. | Activo en plantillas cortas | `root.offsetHeight` + `ResizeObserver` (M-03) |

---

## 5. Lo verificado y lo explícitamente NO verificado

### 5.1 Verificado

- **Estático completo.** Las 8 compuertas ejecutadas; 7 en verde. Detalle en §7.
- **Theme Check con alcance real:** 88 archivos, 0 ofensas, exit 0, con el preset recomendado
  completo y cero checks desactivados.
- **La compuerta de cordura sigue viendo:** `gates:sanity` detecta las 3 clases de error inyectadas
  después de acotar el alcance.
- **Localizadores:** los 60 de este informe y del ledger se derivaron por grep sobre los archivos
  actuales. `gates:ledger` confirma 0 incoherencias.
- **Mediciones locales en Chrome sobre fixtures con el CSS y el JS reales**, declaradas por los
  agentes de MOTION-002. **No las reejecuté y no hay artefacto en el repositorio**: las cito como
  declaradas, no como comprobadas por mí.

### 5.2 NO verificado

Esta es la lista que impide declarar el tema listo para submission.

1. **Storefront vivo: nada.** `agent-comms/outbox-claude/harness-MOTION-002/01-motion-check.mjs`
   existe, está documentado y cubre G0-G10, pero exige `STOREFRONT_PASSWORD`, que nadie exportó.
   Cero rutas visitadas, cero capturas a mitad de gesto, cero CLS medido.
2. **Safari: nunca se abrió.** Es la segunda plataforma con soporte nativo (26.0+). macOS e iOS.
3. **La rama de respaldo B8.1 (`@supports not`): nunca se ejecutó.** Es la que ve Firefox, o sea el
   13-15 % de la cobertura. El proyecto `firefox-no-scroll-driven` del arnés está escrito y no se
   ha corrido; además requiere `npx playwright install firefox`.
4. **Vista previa de impresión: en ningún navegador.** La llave 3 es nueva y solo está verificada
   por lectura del CSS.
5. **Lighthouse posterior a la migración: no hay.** Las 54 corridas de TECH-AUDIT-001 (media móvil
   98.0) midieron el motor GSAP. El tema de hoy no se ha medido.
6. **CLS posterior a la migración: no hay.** Incluido el CLS bajo `prefers-reduced-motion: reduce`,
   cuya ruta cambió (la llave 2 ahora anula `clip-path`).
7. **axe-core posterior a la migración: no hay.** Las 180 evaluaciones también son del motor
   anterior.
8. **El recorrido de teclado del axioma anti-invisible: no se ejecutó.** Las 40 tabulaciones con
   comprobación de ancestros invisibles están implementadas en el arnés y no corridas.
9. **Los 5 estados degenerados (Gate 2 del DoD) contra el catálogo real: no se ejecutaron.**
10. **Las 4 filas del ledger en `código completo`** (38, 56, 57, 58) siguen abiertas por esto mismo.
11. **La paridad con las 3 demos está rota y sin corregir** (§6, C-02).
12. **El `@view-transition` y la interacción de las transiciones de página con el motor nuevo:**
    no se probaron en navegación real.

---

## 6. Conflictos con TECH-AUDIT-001 — detectados y no resueltos

Se reportan sin tocar los hallazgos de la auditoría de Gemini, conforme a la regla de la tarea.
Están volcados también en `agent-comms/BOARD.md` §4.4.

| # | Qué dice el BOARD | Qué se midió tras MOTION-002 | Quién decide |
|---|---|---|---|
| C-01 | Rol 1: *"Modo Lean de GSAP ahorra −55,5 % de transferencia inicial JS en Brotli"* | GSAP ya no existe. La métrica describe un motor retirado, y las 54 corridas de Lighthouse se tomaron sobre él. La cifra es verdad sobre lo que midió; ya no describe el tema. | Orquestador |
| C-02 | Rol 8: *"60 de 60 archivos ejecutables son 100 % idénticos byte a byte en las 3 tiendas demo. Cero derivas."* | **Hay deriva.** El pull congelado del 2026-10-01 a las 22:25 (`scratch/audit-live-pull/full-{atelier,edition,archive}/`) contiene los 3 assets de GSAP y un `layout/theme.liquid` que los carga en las líneas 103-105. `base.css` y `theme.js` también difieren. Las 3 demos sirven hoy un motor que el tema ya no lleva. | Johandry + orquestador |
| C-03 | Rol 9: *"CLS reducido de 0,1740 a 0,0041 (−97,6 %) mediante `patch-X5-cls-reduced-motion.diff`"* | La medición es del motor GSAP. El parche sigue aplicando limpio (toca `layout/theme.liquid`, no `base.css`), pero la ruta de `reduce` cambió. La cifra hay que volver a medirla, no heredarla. | Orquestador |
| C-04 | Cierres previos: *"Theme Check 351 archivos con 0 ofensas"* | No es reproducible. Sin config: 787 archivos / 2.487 ofensas / 9 errores. Con `.theme-check.yml`: 88 archivos / 0 ofensas. Ninguna de las dos es 351: el conteo de archivos inspeccionados depende del alcance, y hasta hoy no había alcance declarado. | Orquestador |

---

## 7. Compuertas

`npm run gates:static` **sale 1**. Se detiene en la compuerta 1 de 8.

| # | Compuerta | Resultado | Qué modificó | Diagnóstico |
|---|---|---|---|---|
| 1 | `gates:json` | **FALLA (exit 1)** | nada | 575 JSON comprobados, **75 fallos de parseo, los 75 bajo `scratch/`** (`audit-live-pull/full-*` y `store-push/*`): son volcados de Shopify con un comentario `/* ... */` de cabecera, que no es JSON válido. **0 fallos fuera de `scratch/`.** Fuera de mi frontera: el arreglo está en `scripts/json-validate.mjs:21`. Ver §7.1 |
| 2 | `gates:hooks` | PASA (exit 0) | nada | 0 contratos rotos |
| 3 | `gates:sanity` | PASA (exit 0) | crea y borra `.tmp/theme-check-sanity-<pid>/` | 3 de 3 clases detectadas por separado; sandbox restaurado limpio. 28 s |
| 4 | `gates:locales` | PASA (exit 0) | nada | 83 archivos, 396 + 452 claves, 0 sin resolver, 0 huérfanas, 0 construidas en runtime |
| 5 | `gates:ledger` | PASA (exit 0) | **nada: el script solo escribe con `--fix`, y `gates:ledger` no lo pasa.** El encabezado `CONTEO` lo actualicé a mano | 60 filas, 54 cumplido / 6 código completo / 0 no verificado / 0 ausente, 0 incoherencias |
| 6 | `gates:theme-check` | PASA (exit 0) | nada | 88 archivos, 0 ofensas. Antes de `.theme-check.yml`: 787 archivos, 2.487 ofensas, 9 errores, exit 1 |
| 7 | `gates:syntax` | PASA (exit 0) | nada | `node --check` sobre `theme.js` y `product-zoom.js` |
| 8 | `gates:package` | PASA (exit 0) | **regenera `Sartorial-1.0.0.zip`** (306,0 KB, 103 entradas). Está en `.gitignore` | 3 assets, 16 entradas de `listings/`, 0 referencias a GSAP |

### 7.1 El único fallo, y por qué no lo arreglo

`scripts/json-validate.mjs:21` declara
`const SKIP = new Set(['node_modules', '.git', '.tmp', 'test-results', 'playwright-report', 'dist']);`
y no incluye `scratch`. El script existe precisamente para cubrir `listings/`, que Theme Check no
mira; recorrer `scratch/` es un efecto colateral de recorrer todo el repositorio.

**Arreglo propuesto, ya escrito y validado por otro agente:**
`agent-comms/outbox-gemini/harness-TECH-AUDIT-001/patch-gates-static-scratch.diff` añade `'scratch'`
a ese `Set`. `git apply --check` sale **0**. Es el mismo hallazgo que el Rol 7 de TECH-AUDIT-001 ya
había registrado.

No lo apliqué porque `scripts/` está fuera de mi frontera. **No desactivé ninguna compuerta ni
relajé ningún umbral para llegar al verde**, y la cadena sigue roja a propósito.

**Qué pasa cuando se aplique.** La cadena debería quedar en verde: los 75 fallos están todos dentro
de `scratch/` y 0 fuera, y las otras 7 compuertas ya pasan por separado. **No lo ejecuté con el
parche puesto**, así que esto es una inferencia, no una medición.

---

## 8. `.theme-check.yml`

### 8.1 Por qué no existía y qué costaba

| Problema | Medida |
|---|---|
| Sin alcance, `shopify theme check` toma la raíz del repositorio como raíz del tema | 787 archivos inspeccionados, **2.487 ofensas en 165 archivos, 9 errores**, exit 1 |
| De dónde salían | **las 2.487 de `scratch/audit-live-pull/`**, ninguna de carpetas de tema. 2.421 `UndefinedObject`, 57 `OrphanedSnippet`, 9 `MissingAsset` |
| Cuáles eran los 9 errores | `MissingAsset` de `assets/gsap.min.js`, `assets/gsap-scrolltrigger.min.js` y `assets/motion.js` en los `layout/theme.liquid` de las tres copias congeladas: el síntoma de C-02 visto desde la compuerta |
| Sin `extends`, el conjunto de checks lo fija la versión del CLI | un bump de `@shopify/cli` podía tumbar la compuerta 5 sin que cambiara una línea del tema |

### 8.2 Sintaxis verificada, no adivinada

`shopify theme check --init` en un directorio limpio genera exactamente:

```yaml
extends: theme-check:recommended
ignore:
  - node_modules/**
```

Esas son las dos únicas claves que usa el archivo. Lo demás que emite `--init` son entradas de
check **comentadas**, que no se tocan.

**El preset es el recomendado completo y no hay ni un check individual desactivado.** Comprobado
con `shopify theme check --print`: el resultado de `theme-check:recommended` es idéntico línea por
línea al predeterminado del CLI 4.8.0 (`diff` vacío), así que fijarlo **no relaja nada hoy**; solo
lo inmuniza contra un cambio de versión. Se descartó `theme-check:all` a propósito: añade
`AssetSizeCSS` y `AssetSizeJavaScript` con umbrales de 100 KB y 10 KB que ningún requisito de Theme
Store exige, y un umbral que no es requisito no debería poder bloquear la compuerta.

### 8.3 Alcance

"El tema" son las carpetas de `THEME_DIRS` en `scripts/theme-check-sanity.mjs` (`assets`, `config`,
`layout`, `locales`, `sections`, `snippets`, `templates`, `blocks`) **más `listings/`**. El `ignore:`
es el complemento, con un comentario por patrón dentro del archivo. Comodines comprobados:
`harness-*/**` baja los archivos inspeccionados de 787 a 370.

**Dos decisiones que se apartan del complemento literal y por qué:**

- **`listings/` NO se excluye.** No está en `THEME_DIRS` porque esa constante existe para armar un
  tema mínimo válido que mutar en el sandbox de la compuerta de cordura, no para definir el
  entregable. `listings/` **sí viaja en el paquete** (16 entradas verificadas en el zip) y hoy aporta
  0 ofensas, así que excluirlo solo crearía un hueco ciego en archivos que se envían a Shopify.
  Verificado: con `listings/**` excluido el conteo baja de 88 a 79 archivos.
- **`.tmp/` NO se excluye.** El sandbox de `gates:sanity` vive ahí. Si estuviera excluido, las tres
  mutaciones serían invisibles, la compuerta vería "0 ofensas" y concluiría en falso que Theme Check
  no detecta nada: fallaría por una razón falsa. Hoy `.tmp/` aporta 0 archivos inspeccionados
  (comprobado: añadir `.tmp/**` deja el conteo igual en 88), así que dejarlo dentro no cuesta
  ninguna ofensa. La contrapartida está anotada en el propio archivo: un sandbox que sobreviva a una
  corrida interrumpida mete una segunda copia del tema en el rastreo.

### 8.4 Antes y después

| | Antes | Después |
|---|---|---|
| Archivos inspeccionados | 787 | **88** |
| Ofensas | **2.487** en 165 archivos | **0** |
| Errores | **9** | **0** |
| Advertencias | 2.478 | 0 |
| Exit | 1 | **0** |
| Checks desactivados | — | **ninguno** |
| Preset | el que trajera el CLI | `theme-check:recommended`, fijado por escrito |

---

## 9. Ledger

`docs/requirements-ledger.md`: **57 → 60 filas**. Encabezado actualizado a mano a
`CONTEO CALCULADO: 60 filas | 54 cumplido | 6 código completo | 0 no verificado | 0 ausente`, porque
`gates:ledger` no pasa `--fix` y por tanto no escribe.

### 9.1 La fila que estaba rota

| | |
|---|---|
| **Fila** | 55 antes del desplazamiento; **56** ahora |
| **Requisito** | Soporte de `prefers-reduced-motion` (WCAG 2.2 AA 2.3.3) |
| **Citaba** | `assets/base.css:5225-5245`, `assets/motion.js:150` y `assets/theme.js:4700` |
| **Por qué estaba roto** | `assets/motion.js` **no existe**: era el único localizador que `gates:ledger` podía detectar, y lo detectaba (`el archivo no existe en esa ruta`). `assets/theme.js:4700` existe pero hoy es `].join(', ')`, el cierre de `REVEAL_TARGETS`. `assets/base.css:5225-5245` cayó en `.product-recommendations__header h2` tras el desplazamiento |
| **Cita ahora** | `assets/base.css:6938-6958` (`no-preference` heredado), `assets/base.css:6982-7017` (marquee estático bajo `reduce`), `assets/base.css:8745` y `assets/base.css:8746` (el `@supports` y el `@media` que envuelven B8.2), `assets/base.css:9020-9041` con `assets/base.css:9035` (llave 2 con `clip-path: none !important`), `assets/base.css:9047-9054` (llave 3, `@media print`), `assets/theme.js:4715` y `assets/theme.js:4719` (`initScrollReveal` y su `return`), `layout/theme.liquid:103-105` (`dataset.reducedMotion`) |
| **Estado** | `cumplido` → **`código completo`** |
| **Para volver a `cumplido`** | exportar `STOREFRONT_PASSWORD` y ejecutar `harness-MOTION-002` en `chromium-full`, `chromium-reduce` y `firefox-no-scroll-driven` con veredicto APTO. El escenario `reduce` debe dar 0 pendientes, 0 animaciones scroll-driven y la raíz sin `data-reveal-ready` |

La degradación **no es una regresión del tema**: la verificación en vivo que cerraba la fila medía
un motor que ya no existe, así que la evidencia dejó de sostener el estado.

### 9.2 Las 3 filas nuevas

| Fila | Requisito | Fuente | Estado | Qué cubre que antes no existía |
|---|---|---|---|---|
| **38** | Motor de Movimiento Nativo sin Dependencias (CSS Scroll-Driven) | Official Requirements: Performance / Browser Support | `código completo` | El balance de bytes, la selección de motor por cascada y **la matriz de soporte real de navegador**, con Firefox en la rama de respaldo. Antes no había ninguna fila que respondiera "¿y qué ve Firefox?" |
| **57** | Axioma Anti-Invisible del Motor de Revelado | WCAG 2.2 AA (2.4.7 / 2.4.11) | `código completo` | Las 5 piezas que impiden que un elemento quede oculto para siempre, con la advertencia de no simplificar la guardia de `offsetHeight` ni el `ResizeObserver` |
| **58** | Contenido Revelado Disponible al Imprimir | Acceptance Matrix / MOTION-002 | `código completo` | La llave 3. Antes el motor imprimía en blanco lo pendiente y ninguna fila lo cubría |

### 9.3 Otras filas revisadas

Grep de `gsap`, `motion.js`, `ScrollTrigger`, `animation`, `animaciones`, `movimiento`, `scroll`,
`parallax`, `marquee` y `reveal` sobre el ledger: **la fila 55 era la única con evidencia de
movimiento rota.** Las demás coincidencias son la fila 31 ("movimiento activo", una nota de
medición sin localizador) y las filas 76, 82 y 106, donde "scroll" aparece como "sin scroll
horizontal", ajeno a esto.

Hallazgo colateral: el ledger arrastra **localizadores desplazados de sprints anteriores** que la
compuerta no puede ver porque solo comprueba que el archivo exista y la línea esté en rango. Filas
32, 33, 47, 48, 49, 51, 53 y 54, entre otras, apuntan a líneas que ya no contienen lo que su
evidencia describe. **No se tocaron**: están fuera del alcance de esta tarea y ninguna rompe
`gates:ledger`. Queda como X4 para un sprint de saneamiento.

---

## 10. Acciones humanas

Prioridad recomendada por Claude. Volcadas también en `agent-comms/BOARD.md` §4.5.

| Prioridad | # | Acción | Por qué ahí |
|---|---|---|---|
| **P0** | 1 | **Rotar la contraseña del storefront** en Shopify Admin en las 3 demos (`sartorial-atelier`, `sartorial-edition`, `sartorial-archive`) y en `tema-qkqpke0j` | Invalida las cookies de sesión publicadas en GitHub. **Verificado por mí:** `git merge-base --is-ancestor ff3dca1 origin/master` sale 0, y ff3dca1 trae `harness-AUDIT-360-001/lh-headers.json` con `_shopify_essential`, `_shopify_analytics` y compañía. Es la única mitigación real: reescribir la historia no sirve de nada sobre algo ya publicado |
| **P0** | 2 | **Exportar `STOREFRONT_PASSWORD`** | Sin ella **todos** los arneses fallan por diseño (no hay literal en el código, por `CLAUDE.md`). Es la llave de las 4 filas en `código completo` y de los 12 puntos del §5.2. Va junto a la 1: primero se rota, luego se exporta la nueva |
| **P1** | 3 | **Aplicar `patch-gates-static-scratch.diff`** | Devuelve `npm run gates:static` al verde. Está en `scripts/`, fuera de mi frontera. `git apply --check` sale 0 |
| **P1** | 4 | **Volver a desplegar las 3 demos** | Hoy sirven el motor GSAP que el repositorio ya no tiene (C-02). Mientras no se haga, cualquier auditoría en vivo mide un tema distinto del que se va a enviar |
| **P1** | 5 | **Rotar el PAT de Figma y la API key de Composio** | Higiene. Nunca se commitearon, pero hay 5 copias en disco y un blob suelto inalcanzable en `.git` |
| **P1** | 6 | **Limpiar la contraseña literal de 5 scripts** de `agent-comms/outbox-gemini/harness-TECH-AUDIT-001/`: `crawl-links.mjs:33`, `run-axe-audit.mjs:7`, `run-cross-verification.mjs:13`, `run-responsive-audit.mjs:7` (patrón `\|\| '<literal>'`) y `measure-live-cls.mjs:6` (hardcodeada, sin override) | Mismo riesgo que la 1, y en archivos **sin commitear todavía**: se arregla antes de que entren al índice. Fuera de mi frontera; no los toqué |
| **P1** | 7 | **Ejecutar `harness-MOTION-002`** y recertificar las filas 38, 56, 57 y 58 a `cumplido` | Es el único camino para cerrar el sprint. Depende de la 2, y de `npx playwright install firefox` para el tercer proyecto |
| **P2** | 8 | **Decidir el changelog para comerciantes.** ¿Se declara la pérdida de la aceleración del marquee (M-04)? ¿Se redacta una frase que describa el modo `None`? | El `info` de `settings_schema.animations` describe Subtle y Full con precisión y **no dice qué hace None** en ninguna clave de `locales/en.default.schema.json`; la opción solo tiene la etiqueta "None". Gate 4 del DoD |
| **P2** | 9 | **Valorar sacar el repositorio de la carpeta sincronizada por OneDrive** | Un árbol de trabajo con `.git` dentro de una carpeta de sincronización continua es fuente de corrupción y de copias no gobernadas. `CLAUDE-REPORT-LEAD-001` §1 ya documentó cambios locales aparecidos sin autor |

> Las 7 acciones del encargo original son las numeradas 1, 2, 5, 7, 8, 9 y 6. Las 3 y 4 las añado
> yo: la 3 porque sin ella la cadena de compuertas no vuelve al verde, y la 4 porque la deriva con
> las demos es P0 de hecho aunque no estuviera en la lista.

---

## 11. Veredicto

**El sprint cierra en lo documentable y no cierra en verificación.**

Lo que está hecho está bien hecho y bien explicado: la arquitectura es coherente, la cascada decide
el motor sin una sola rama en JavaScript, el axioma anti-invisible está sostenido por cinco piezas
que se defienden solas en los comentarios, y las 6 correcciones a la especificación están medidas y
no supuestas. Tres de los bugs que arregla eran activos.

Lo que falta no es cosmético: **el 13-15 % del tráfico ve una rama que nunca se ha ejecutado**, no
hay una sola medición en storefront vivo, Safari no se ha abierto, y las métricas de rendimiento y
accesibilidad que respaldan el tema en el BOARD se tomaron sobre un motor que ya no existe. Y las
3 tiendas demo que un revisor de Shopify abriría hoy sirven ese motor viejo.

**El tema no está listo para submission.** La ruta más corta al verde son las acciones 1, 2, 3 y 4
de §10, por ese orden.
