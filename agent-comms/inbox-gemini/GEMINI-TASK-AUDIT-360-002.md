# GEMINI-TASK-AUDIT-360-002: Segunda pasada exhaustiva de la auditoría integral

```text
Ruta: agent-comms/inbox-gemini/GEMINI-TASK-AUDIT-360-002.md
Origen: Johandry. Quiere que se revise de nuevo todo, hasta lo más mínimo.
Base: master d2827db. Se audita el código del tema de HEAD, que es el mismo de 2f42c4f.
Entrada: agent-comms/outbox-gemini/GEMINI-REPORT-AUDIT-360-001.md (el primer informe)
Modo: SOLO LECTURA. Rigen todas las reglas de la sección 1 de GEMINI-TASK-AUDIT-360-001.
Entregable: agent-comms/outbox-gemini/GEMINI-REPORT-AUDIT-360-002.md, harness-AUDIT-360-002/
  y cobertura-360-002.csv
```

## 0. Por qué hay una segunda pasada

El primer informe es un borrador, no la verdad. 13 agentes y 209 líneas son poco para un tema de este tamaño. Hay cifras sueltas sin desglose, como "Lighthouse 84/100", y afirmaciones que nadie ha reproducido todavía.

Esta pasada tiene tres objetivos:

1. Confirmar, corregir o descartar cada hallazgo del 001, con evidencia.
2. Encontrar todo lo que el 001 no vio.
3. Demostrar que no quedó nada sin revisar.

No hay límite de tiempo ni de tokens. Usa el máximo nivel de razonamiento. Si se te acaba el contexto, retoma desde el `progress.md` de cada agente.

## 1. Cobertura total: la regla central

Antes de buscar nada, genera `cobertura-360-002.csv` con una fila por cada unidad revisable:

- cada archivo de `layout/`, `sections/`, `snippets/`, `templates/`, `listings/`, `assets/`, `locales/` y `config/`. Hoy no existen `blocks/`, `templates/customers/` ni `layout/password.liquid`: di si alguno debería existir;
- cada setting de `settings_schema.json` y de cada schema de sección y bloque;
- cada combinación de tipo de página, tema (los 4) y viewport (320, 375, 768, 1280 y 1920).

Columnas: unidad, agente responsable, pasada 1 (sí/no), pasada 2 (sí/no), hallazgos (IDs) y nota.

El informe no se entrega mientras quede una fila sin las dos pasadas. Una fila sin hallazgos necesita una nota que diga qué se comprobó.

## 2. Equipo multiagente

Esta pasada es multiagente, igual que el 001, pero con 17 especialistas en lugar de 13. Gemini orquesta y no audita directamente.

Cada agente:

- trabaja en `.agents/teamwork/audit360-002/<rol>/`, con BRIEFING, progress y handoff propios;
- empieza de cero, sin reutilizar las carpetas del 001;
- lee el informe 001 solo en la oleada 3.

### Oleada 1, en paralelo

1. **01-requisitos-theme-store:** matriz punto por punto contra shopify.dev (requisitos, listing y proceso de revisión).
2. **02-liquid-arquitectura:** todas las secciones, snippets, templates y layout.
3. **03-javascript:** todos los `assets/*.js`.
4. **04-seguridad:** escape, inyección, redirecciones y datos expuestos.
5. **05-rendimiento:** Lighthouse y CWV (sección 3).
6. **06-accesibilidad:** axe, teclado y contraste (sección 3).
7. **07-comercio-funcional:** flujo de compra y cada función y página que exige Shopify, probados en vivo.
8. **08-editor-y-comerciante:** personalizador, settings, claves `t:` y locales. Incluye la prueba del editor de la sección 3.
9. **09-presets-y-demo:** los 4 temas, `listings/` y las tiendas demo.
10. **10-producto-y-diseño:** UX, conversión y comparación con temas de pago de moda.
11. **11-documentacion-y-soporte:** documentación contra los settings, FAQ y formulario.
12. **14-revisor-shopify:** actúa como el revisor de la Theme Store e intenta rechazar el tema con el reglamento en la mano.
13. **15-navegadores-y-entornos:**
    - Chromium, Firefox y WebKit en Playwright.
    - Sin JS.
    - Zoom al 200%, reflow a 320 px y espaciado de texto (WCAG 1.4.12).
    - `prefers-reduced-motion` y `forced-colors`.
    - Red 3G lenta.
14. **16-html-valido:** pasa el validador Nu (validator.w3.org/nu) por el HTML renderizado de cada tipo de página, porque Shopify exige HTML válido. También busca IDs duplicados.
15. **17-datos-y-formatos:**
    - Monedas sin decimales (JPY) y con coma decimal (EUR).
    - Precios largos, precios comparados y precio unitario.
    - Textos largos en otros idiomas.
    - El catálogo hostil de `agent-comms/outbox-claude/qa-catalogo-hostil.csv`.

### Oleada 2, en paralelo

Los mismos 15 agentes hacen la polinización cruzada y la pasada de "encuentra más" (fases 2 y 3, más abajo).

### Oleada 3

- **12-verificador-adversarial** re-verifica cada hallazgo del 001 (sección 4) y cada P0 y P1 nuevo.
- Si hace falta, lanza varias instancias en paralelo, una por área.
- Ningún agente verifica sus propios hallazgos.

### Oleada 4

**13-sintetizador** deduplica, arma el informe y comprueba que la cobertura dé 100%.

### Fases de cada agente en las oleadas 1 y 2

1. **Pasada línea a línea.** Cada archivo de su área, completo, contra una lista de clases de defecto escrita en su BRIEFING antes de empezar. Ejemplos por tipo de archivo:
   - Liquid: escape, nil y blank, `default`, límites de bucles, `image_url` con anchos, claves `t:` que existan, IDs únicos y ARIA.
   - CSS: valores fijos en lugar de tokens, `!important`, overflow a 320 px, foco visible, movimiento reducido y z-index.
   - JS: manejo de errores, limpieza al descargar secciones, carreras y accesibilidad.
2. **Polinización cruzada.** Al terminar la fase 1, cada agente recibe los hallazgos de los otros y busca la misma clase de defecto en su área con `rg -n`. Si un fallo aparece una vez, hay que encontrar todas sus copias.
3. **Pasada de "encuentra más".** Una segunda lectura completa, con la consigna de encontrar al menos lo que la primera no vio. Si no encuentra nada, lo declara con la lista de lo que comprobó.

## 3. Mediciones obligatorias, desglosadas

- **Lighthouse:** 4 temas, 3 páginas (Home, colección y producto), móvil y escritorio, 3 corridas cada una, con `?pb=0`. Son 72 corridas. Tabla con cada corrida, la mediana y el promedio simple por tema y dispositivo. Guarda los JSON en el harness.
- **axe:** 4 temas, todos los tipos de página y 3 viewports, con drawers, modales, menús y zoom abiertos. Guarda los JSON.
- **Teclado:** recorrido completo con Tab y Shift+Tab en Home, colección, producto, carrito, búsqueda y cuenta. Registra el orden del foco y si algún elemento queda tapado.
- **Contraste:** sobre píxeles reales en cada texto encima de imagen, en los 4 temas.
- **Estados degenerados:** vacío, uno solo, muchos, muy largo y faltante, en cada sección que muestra datos.
- **Editor:** añade, quita, reordena y oculta cada sección y cada bloque. Anota lo que se rompe o no se refresca. Hazlo solo en el tema de desarrollo temporal de `shopify theme dev`, nunca en los 4 temas.

Cada cifra del informe apunta a su archivo crudo en el harness. Una cifra sin archivo crudo no entra.

## 4. Re-verificación del 001

Para cada A360-NN del informe 001, el verificador adversarial emite uno de estos veredictos, con evidencia:

- **CONFIRMADO**
- **CORREGIDO**: cambia la severidad, el archivo, la causa o el parche.
- **DESCARTADO**: no se reproduce o el requisito citado no existe tal cual en shopify.dev.

Revisa con especial cuidado cada afirmación de que algo es "exigido por Shopify": cita la frase exacta de la documentación. Lo mismo con los resultados perfectos (0 violaciones, CLS 0.0000): di con qué contenido, qué páginas y en qué estados se midieron.

## 5. Informe 002

Usa la misma cabecera y las mismas secciones del 001, más estas:

1. **Delta frente al 001:** confirmados, corregidos, descartados y nuevos, con sus totales.
2. **Cobertura:** filas totales, filas con doble pasada y filas con hallazgos. Debe dar 100%.
3. **Hallazgos por clase de defecto:** cada clase con todas sus apariciones.
4. **Ideas y propuestas:** cada una con qué tema competidor la tiene (con fuente), impacto, esfuerzo y riesgo.

Sin adjetivos de marketing ("clase mundial", "sobresaliente"). Solo hechos medidos.

## 6. Al terminar

1. En el BOARD, añade una línea con el enlace al 002.
2. No cambies el ledger.
3. Haz commit solo de las rutas nuevas.
4. Avisa a Johandry. Claude hará la verificación cruzada del 001 y del 002.
