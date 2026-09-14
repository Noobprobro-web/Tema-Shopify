# RULES.md: Reglamento Operativo Unificado del Proyecto

```text
Ruta estable: agent-comms/RULES.md
Autoridad: Johandry / Ruiz Digital (dueño) · Gemini Flash 3.8 High (arquitecto líder)
Consolida y reemplaza: protocol.md, token-efficiency-rules.md,
                        PROTOCOL-IMPLEMENTATION.md, PROTOCOL-VERIFICATION.md
Ámbito: Vinculante para todos los agentes (Gemini, Claude, GPT-5.6, GPT-5.5) y humanos.
Versión: 1.0 · 2026-09-14
```

---

## 1. Principios Cardinales y Eficiencia de Tokens

1. **Lectura Mínima Obligatoria:** En cada turno, el agente debe leer únicamente:
   - `AGENTS.md` (jerarquía de autoridad y roles vigentes).
   - `agent-comms/BOARD.md` (tablero vivo de tareas y bloqueos).
   - Este archivo: `agent-comms/RULES.md`.
   - Su tarea específica en `agent-comms/inbox-<modelo>/`.
   - Los archivos de código o docs explícitamente permitidos en el alcance de la tarea.
   *Prohibido volcar el repositorio completo o leer archivos innecesarios por defecto.*
2. **Pregúntale al Repositorio, No lo Leas:**
   - Usa `rg` o scripts dedicados para resolver dudas sobre todo el proyecto en 2 líneas en vez de leer decenas de archivos.
   - Lee completos únicamente los archivos que vas a editar para garantizar contexto exacto.
3. **No Afirmar sin Evidencia de Terminal:**
   - Toda afirmación de validación, recuento o cita de línea debe acompañarse del comando ejecutado y su salida literal pegada. Prohibido citar de memoria o inventar porcentajes de confianza sin metodología.
4. **Entrega Compacta y Falsable:**
   Toda entrega en `outbox-<modelo>/` comienza con:
   ```text
   ID:
   Estado:
   Decisión requerida:
   Resumen en 5 líneas:
   Archivos tocados:
   Desviaciones (Nivel 1 o Nivel 2):
   Hallazgos extra fuera de alcance (con parche listo):
   Verificación (comando, resultado y qué demuestra/qué no):
   Lista de afirmaciones falsables numeradas:
   ```

---

## 2. Definition of Done (Las 5 Compuertas Obligatorias)

Ningún sprint o cambio técnico se aprueba si falla una sola compuerta:

1. **Compuerta de Requisitos (Ledger Vivo):**
   - Declarar explícitamente qué filas de `docs/requirements-ledger.md` cierra o modifica.
   - Todo cierre debe tener evidencia concreta verificable (`archivo:línea` real o artefacto de prueba en tienda). "Theme Check pasa" NO es evidencia.
2. **Compuerta de Estados Degenerados:**
   - Todo componente o sección nueva/modificada debe contemplar 5 estados límite:
     * *Vacío:* Colección/carrito sin productos, recomendaciones vacías, blog sin posts.
     * *Uno solo:* 1 producto, 1 variante, 1 artículo.
     * *Muchos:* 10+ imágenes de galería, 40 variantes, 200 productos paginados.
     * *Muy largo:* Título de 120 caracteres, vendor extenso, precios con decimales y símbolos largos.
     * *Faltante:* Producto sin imagen o sin descripción, imagen secundaria ausente.
3. **Compuerta de Consistencia entre Archivos:**
   - Cero duplicación hardcodeada de umbrales, selectores o clases redundantes.
   - **Formato de moneda:** Prohibido usar `Intl.NumberFormat` para precios de tienda. Todo formateo de precio en JavaScript debe consumir la plantilla de moneda de la tienda (`shop.money_format` vía `formatMoney(cents, format)`).
4. **Compuerta de Superficie del Comerciante:**
   - 100% de labels de configuración en sentence case, inglés neutro y comprensible.
   - Prohibida la jerga interna de desarrollo ("popover", "intent", "bento") o de marca hardcodeada ("atelier gift").
   - Atributo "info" obligatorio en todo setting que dependa de configuración externa (URLs externas, metafields, suscripciones, tarifas de envío).
   - 100% de labels de schema gestionados mediante claves de localización `t:`.
5. **Compuerta de Verificación en Tienda Real (Gate 5):**
   - Ninguna funcionalidad crítica para Theme Store se declara `cumplida` solo con análisis estático.
   - Es obligatoria la prueba en la tienda de desarrollo real (`tema-qkqpke0j.myshopify.com`) con catálogo demo/hostil y en móvil antes de la entrega final.

---

## 3. Normativa de Implementación de Código

Aplica a quien escriba Liquid, CSS, JS, JSON o schemas (principalmente Claude):

1. **Prueba las compuertas y no sobredimensiones su cobertura:**
   - `node scripts/theme-check-sanity.mjs`: valida que el linter responda ante mutaciones reales.
   - `node scripts/locale-key-inventory.mjs`: valida resolución de claves `t:`, referencias huérfanas y esquemas de configuración.
2. **Nunca edites a ciegas:**
   - Si usas scripts de reemplazo, valida que el conteo de coincidencias sea exactamente 1 (`assert c == 1`).
   - Usa herramientas de parche con contexto para evitar sustituciones fallidas silenciosas.
3. **Nunca reescribas un archivo completo desde una salida truncada.** Siempre opera sobre el archivo en disco.
4. **Inspecciona código muerto antes de implementar:**
   - Revisa filtros `| default:` sobre settings que ya traen "default" en schema, o guardas sobre objetos que Shopify nunca deja vacíos.
5. **Dos Niveles de Desviación:**
   - **Nivel 1 (Corrección local equivalente y reversible):** No altera contratos con el comerciante, ni `id`, ni `default`, ni archivos fuera de alcance. *Se implementa y se documenta en el informe.*
   - **Nivel 2 (Cambio de contrato o expansión de alcance):** Toca un `id`, altera un `default`, añade opciones a un select, o modifica archivos fuera de la lista permitida. *PROHIBIDO implementar sin autorización previa y explícita de Gemini.*
6. **Detectar en todo el repositorio, corregir solo en alcance:**
   - Si al investigar detectas el mismo defecto en archivos fuera de tu tarea, anótalo en `HALLAZGOS EXTRA` con el diff preparado. No lo toques en el mismo sprint.
7. **Prueba código real, no stubs:**
   - Funciones exportadas o tests de Playwright contra el tema en ejecución. Los stubs aislados son solo soporte preliminar.
8. **Separa 'código completo' de 'cumplido':**
   - Todo requisito que requiera medición empírica (Lighthouse, axe, CLS, tap targets, teclado) debe marcarse como `código completo` hasta que se ejecute la prueba en tienda real y se adjunte el reporte correspondiente.
9. **No refactorices filas verdes:**
   - Deudas técnicas preexistentes en módulos aprobados no se tocan salvo directiva expresa de Gemini.

---

## 4. Normativa de Verificación y Emisión de Directivas

Aplica a quien audite o emita tareas (Gemini y GPT):

1. **Verificar abriendo archivos, nunca leyendo solo informes:**
   - La verdad está en el código del disco, no en la narrativa del informe.
2. **Preflight antes de enviar una directiva:**
   - Comprobar que cada rama condicional propuesta sea alcanzable.
   - Comprobar que no se creen IDs o names duplicados en formularios.
   - Comprobar que no se generen conflictos con atributos `aria-*` existentes.
   - Si la directiva requiere una desviación de Nivel 2, autorizarla explícitamente en el texto.
3. **Citar la clase del defecto, no solo la instancia aislada:**
   - Ejecutar un barrido previo (`rg -n`) para acotar todas las ocurrencias del patrón.
4. **Comprobar citas de línea en el momento de redactar:**
   - Para referencias frágiles, acompañar el número de línea con el nombre de la función, selector o clave.
5. **Prohibido el porcentaje de confianza sin método:**
   - Si no hay método empírico documentado, registrar como `no verificado`.
6. **Toda fila abierta debe tener un dueño nominal:**
   - Declarar si la resolución corresponde a Johandry, Gemini, Claude o GPT.
7. **Verificación Adversarial Cruzada:**
   - Ninguna entrega se da por buena hasta que un agente distinto de quien escribió el código valide sus afirmaciones intentando falsificarlas una por una.

---

## 5. Vocabulario Canónico de 4 Estados para el Ledger

Solo se reconocen estos cuatro estados en `docs/requirements-ledger.md`:

1. `cumplido`: Requisito 100% satisfecho con evidencia verificable (estática o empírica) documentada.
2. `código completo`: Código implementado en el repositorio; pendiente únicamente de la medición empírica en tienda real / dispositivo (Gate 5).
3. `no verificado`: Requisito pendiente de auditoría técnica, decisión de negocio o acción externa (ej. URLs de soporte, registros de marca).
4. `ausente`: Requisito no implementado o descartado del alcance.

*Cualquier otra etiqueta (`cumplido (código)`, `parcial`, etc.) queda estrictamente prohibida.*
