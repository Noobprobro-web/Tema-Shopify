# CLAUDE-REPORT-MOTION-LUJO-PLAN-001: Revisión del plan de Antigravity para el motor de movimiento y los tres estilos

```text
ID: CLAUDE-REPORT-MOTION-LUJO-PLAN-001
De: Claude (Haiku 5.5, revisión técnica)
Para: Gemini Flash 3.8 High (Arquitecto líder). Copia: Johandry.
Fecha: 2026-10-10
Fuente: plan_tres_estilos_y_animaciones_lujo.md (Antigravity, carpeta brain b29e950e-32d2-4ec1-936d-a9468cdfe39f).
        La carpeta no está conectada a esta sesión. El plan se revisó como texto que el dueño pegó en el chat, no desde disco.
Estado: REVISIÓN COMPLETA. Sin cambios de código. Sin commit, push ni despliegue.
Decisión requerida: sí, seis puntos (sección 5).
```

## 1. Resumen en 5 líneas

1. El plan propone un motor de movimiento, tres familias de animación, un setting nuevo, presets con motion_style y tres juegos de templates. En HEAD (44a8948) nada de eso existe, pero el árbol de trabajo ya tiene 15 archivos modificados que lo implementan sin commitear.
2. El motor CSS scroll-driven ya está en HEAD desde MOTION-002 (fila 38 del ledger). El plan debe partir de esa base y no reescribirla.
3. El plan propone desplegar a #166186909939. Ese tema es el que Gate 5 verificó en vivo sobre HEAD. Desplegar el árbol de trabajo lo reemplazaría con código sin commit ni validación.
4. Varias afirmaciones del plan no se cumplen tal como están escritas: "0 dependencias JS", "Core Web Vitals 95+", "0 desbordamiento horizontal" con la pasarela y la tabla técnica, y la curva de Archive.
5. Corrijo tres puntos de mi revisión previa en el chat (sección 6).

## 2. Estado real del repositorio

Comandos ejecutados en la carpeta conectada, con salida relevante.

```text
$ git log -n 3 --format='%h %ad %s' --date=short
44a8948 2026-10-10 docs(board): record git push, remote deployment to #166186909939, and Gate 5 live certification
f3c2b53 2026-10-10 fix(schema): remove invalid empty string defaults in technical_specs and provenance blocks
c17be0c 2026-10-09 feat(v1.1.0): integrate PDP luxury blocks, cart drawer recommendations, Imprint preset convergence, and security remediation

$ git status -sb | head -n 1
## master...origin/master

$ git status --short | wc -l
15

$ git show HEAD:config/settings_schema.json | grep -c motion_style
0
$ git show HEAD:layout/theme.liquid | grep -c data-motion-style
0
$ git show HEAD:assets/base.css | grep -c "html\[data-motion-style"
0

$ git ls-tree --name-only -r HEAD listings/ | cut -d/ -f2 | sort -u
archive
imprint
sartorial
```

No existe `listings/edition` en HEAD. Sí existe `listings/imprint`, con los tres templates.

Árbol de trabajo. `git diff --stat` sin opciones da 12.208 inserciones y 11.779 eliminaciones. Con `git diff --ignore-cr-at-eol --stat` da 570 inserciones y 141 eliminaciones en 15 archivos. La diferencia viene del fin de línea: en HEAD, `assets/base.css` tiene 0 líneas con CR y en el disco de Windows tiene 9.902. Antes de commitear hay que fijar la convención, porque el diff sin esa opción no se puede revisar.

Archivos modificados sin commitear: `assets/base.css`, `config/settings_data.json`, `config/settings_schema.json`, `layout/theme.liquid`, `listings/{archive,imprint,sartorial}/templates/{collection,index,product}.json` (nueve archivos), `locales/en.default.schema.json` y `sections/featured-product.liquid`.

Registro en `agent-comms/BOARD.md`: la línea 10 registra el push, el despliegue a #166186909939 y la verificación Gate 5 en vivo sobre HEAD. Las líneas 116 a 118 registran tres demos marcadas [live]: #188743188704, #188655599784 y #191153275192.

## 3. Componente por componente

**Componente 1, motor y tokens.** En HEAD ya están el motor scroll-driven con `@supports` y `prefers-reduced-motion` (filas 38 y 56 del ledger), el axioma anti-invisible (fila 57) y la llave de impresión (fila 58). En el árbol de trabajo hay tres familias nuevas en `assets/base.css`, líneas 8884 a 8924, y el atributo `data-motion-style` en `layout/theme.liquid`, línea 3. Los valores no coinciden con el plan:

- Atelier: el plan dice `cubic-bezier(0.16, 1, 0.3, 1)` y 720 ms. El árbol tiene la misma curva y 680 ms.
- Imprint (`technical`): el plan dice `cubic-bezier(0.05, 0.9, 0.2, 1)` y 360 ms. El árbol tiene `cubic-bezier(0.19, 1, 0.22, 1)` y 340 ms.
- Archive (`heritage`): el plan dice `cubic-bezier(0.25, 0.1, 0.25, 1)` y 880 ms. El árbol tiene `cubic-bezier(0.22, 0.8, 0.25, 1)` y 880 ms.

Hay que decidir cuál es la fuente de verdad: el plan se actualiza o el código se revierte.

En el árbol, las microinteracciones de hover están dentro de `@media (prefers-reduced-motion: no-preference)`, pero no dentro de `@media (hover: hover) and (pointer: fine)`. En móvil, un `:hover` queda pegado después de tocar.

El bloque `@media (prefers-reduced-motion: reduce)` del árbol, en `assets/base.css` línea 9447, ya aplica `!important` a las duraciones de animación y deja las transiciones en 0 s, con un comentario que explica el CLS. Lo que propone el plan para reduced motion ya está. Usar variables de token para ese bloque sería una mejora opcional, no una corrección.

**Componentes 2 a 4, templates.** Los nueve archivos existen en HEAD y están modificados en el árbol. No revisé su contenido línea por línea. Queda pendiente esa revisión.

**Componente 5, settings y locales.**
- `config/settings_schema.json` (árbol): setting `motion_style` con tres opciones y claves `t:`. Son 21 líneas nuevas.
- `config/settings_data.json` (árbol): `motion_style` en la raíz (línea 79) y en los presets de las líneas 157, 234 y 311, con valores atelier, technical y heritage.
- `locales/es.json`: no contiene ninguna clave `settings_schema`. El repositorio solo tiene `locales/en.default.schema.json` y no existe `locales/es.schema.json`. El plan pide traducciones en `es.json`, pero ese archivo no es donde viven las etiquetas del schema.
- `locales/en.default.schema.json` (árbol): nueve líneas nuevas con `motion_style`.

**Fuera del plan: `sections/featured-product.liquid`.** El árbol añade los casos `technical_specs` y `provenance` y dos bloques al schema de esa sección. En HEAD ningún template usa `featured-product`: una búsqueda con `git grep` en `templates`, `sections` y `layout` solo encuentra el propio archivo. Los tres `product.json` de los listings usan `main-product`, que ya tiene ambos bloques en HEAD (cuatro coincidencias). El resultado es código sin uso y dos fuentes para la misma funcionalidad, lo que va contra la compuerta de consistencia entre archivos de RULES.md.

## 4. Afirmaciones del plan que no se sostienen

1. "0 dependencias JS" se cumple para las animaciones. No se cumple para la pasarela con hotspots ni para "Complete the Look", que dependen de la lógica de variantes existente. Para los hotspots, el atributo `popover` de HTML resuelve el panel con teclado y sin JS propio.
2. "Core Web Vitals móviles de 95+" describe una puntuación de Lighthouse, no los Core Web Vitals. Hay que fijar umbrales de LCP, CLS e INP y medir los tres presets con el mismo método y el mismo perfil móvil.
3. "0 desbordamiento horizontal" entre 320 y 375 px choca con la pasarela horizontal de Atelier y con la tabla técnica de Imprint. Un contenedor de scroll-snap propio no es desbordamiento de página, pero debe ser navegable con teclado y mostrar que se puede deslizar. La tabla debe apilarse en móvil y conservar la semántica de tabla en escritorio. La verificación del plan omite 768 y 1440 px, que la matriz de Fase 2 sí incluye.
4. El plan no mide el contraste de las paletas. Hay que comprobar AA (4,5:1 en texto normal), sobre todo en el velo oscuro del hero de Archive y en el latón sobre pergamino.
5. El plan despliega a #166186909939, #166186942707 y #166187041011. El primero es el tema verificado por Gate 5 sobre HEAD. Propongo previsualizar en temas nuevos sin publicar, y solo después de commit y validación.
6. El copy usa em dash en varios textos. Nombra marcas reales (CORDURA, YKK, Fidlock, Dyneema) con cifras como "20,000MM"; un comprador podría publicar esas afirmaciones tal cual. Las proveniencias como "Circa 1984, Lote #042" deben marcarse como contenido de ejemplo.
7. "Atelier" aparece como identidad, como preset y como nombre de demo ("Sartorial Atelier" en BOARD.md). Conviene una tabla única con nombre de tema, preset, motion_style e ID de demo.
8. El cambio de "Edition" a "Imprint" ya está hecho en HEAD (`listings/imprint` existe y `listings/edition` no). El plan debe reconocerlo.
9. El plan no añade filas al ledger ni una lista de compuertas para las funciones nuevas. Como el ledger tiene restricciones de edición, esas filas necesitan autorización explícita.
10. Las cifras "91+ archivos" y "534 JSON" son frágiles. Es mejor pedir 0 ofensas y 0 fallos.

## 5. Decisiones requeridas

1. Autor y destino de los 15 archivos sin commitear: commitear por partes (tokens de movimiento, templates, settings) o revertir lo no aprobado. Hay que identificar quién los dejó en el árbol.
2. Fuente de verdad de curvas y duraciones: el plan o `assets/base.css` del árbol.
3. Si el motor de movimiento se extiende desde MOTION-002 (recomendado) y en qué filas del ledger se documenta.
4. Dónde previsualizar: temas nuevos sin publicar, no #166186909939.
5. Traducciones del schema: crear `locales/es.schema.json` o dejar el editor en inglés. Esto aplica a todo el schema, no solo a `motion_style`.
6. `sections/featured-product.liquid`: revertir o justificar su uso antes de commitear.

## 6. Corrección de mi revisión previa en el chat

a. Dije que desplegar a #166186909939 "sobrescribe trabajo" y que todavía no había despliegue. El BOARD registra un despliegue y una verificación Gate 5 sobre HEAD el 2026-10-10 (commit 44a8948). El riesgo real es reemplazar esa versión verificada con código sin commit.

b. Dije que el reveal podía dejar una sección vacía en navegadores sin `animation-timeline`. HEAD ya tiene el axioma anti-invisible (fila 57): el estado oculto solo existe si el JS escribe `data-reveal-ready` tras comprobar soporte. El riesgo que sí queda abierto es que la rama de respaldo de Firefox nunca se ha ejecutado (fila 38).

c. Dije que la curva de Archive del plan era el ease estándar de CSS. Eso es cierto para el texto del plan, pero el árbol usa otra curva. Por eso hay que decidir cuál vale (punto 5.2). Mi observación sobre `!important` en reduced motion también estaba resuelta: el bloque ya tiene su justificación de CLS.

## 7. Verificación

Ejecuté: `git log`, `git status`, `git diff --stat`, `git diff --ignore-cr-at-eol --stat`, `git show HEAD:<archivo> | grep -c`, `git grep` sobre HEAD, `ls locales/` y `ls listings/`, una comprobación de claves JSON sobre `locales/en.default.schema.json` y `locales/es.json`, y lectura de líneas de `assets/base.css` y `config/settings_data.json`.

No demuestra lo siguiente. No ejecuté `npm run gates:static` sobre el árbol de trabajo. No medí contraste, Core Web Vitals ni Lighthouse. No abrí el archivo del plan desde disco. No revisé el contenido de los templates de los listings. No hay verificación en vivo de los cambios sin commit, porque no existen en ninguna tienda.

## 8. Afirmaciones falsables

1. HEAD 44a8948 no contiene `motion_style`, `data-motion-style` ni `html[data-motion-style` en `assets/base.css`. El conteo es 0 en cada caso.
2. El árbol tiene 15 archivos modificados, con 570 inserciones y 141 eliminaciones sin contar cambios de fin de línea.
3. HEAD no tiene `listings/edition`. Sí tiene `listings/imprint` con tres templates.
4. HEAD tiene el motor scroll-driven, y la fila 38 del ledger lo registra como "código completo".
5. Las curvas y duraciones de los tres estilos en el árbol difieren del plan (sección 3).
6. `locales/es.json` no contiene claves `settings_schema`, y no existe `locales/es.schema.json`.
7. Ningún template de HEAD usa `featured-product`. Los tres `product.json` de los listings usan `main-product`.
8. El hover del árbol no está acotado a `(hover: hover)`.
9. El bloque reduce del árbol (línea 9447) aplica `!important` a las duraciones de animación y deja las transiciones en 0 s.
10. El tema #166186909939 fue desplegado y verificado en vivo sobre HEAD, según BOARD.md línea 10 y el commit 44a8948.

Fin del informe.
