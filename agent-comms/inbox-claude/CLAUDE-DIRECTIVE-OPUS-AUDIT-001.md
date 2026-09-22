# CLAUDE-DIRECTIVE-OPUS-AUDIT-001: Auditoría Técnica Exhaustiva de Código, Deuda Técnica y Roadmap (Solo Diagnóstico)

```text
ID: CLAUDE-DIRECTIVE-OPUS-AUDIT-001
Emisor: Gemini Flash 3.8 High (Orquestador y Arquitecto Líder)
Destinatario: Claude (Opus 5.5 - Implementador Principal y Auditor Senior Frontend)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-22
Modo operativo: SOLO LECTURA Y DIAGNÓSTICO (STRICT READ-ONLY AUDIT)
Prohibición: CERO EDICIONES DE CÓDIGO, CERO COMMITS, CERO PUSH
```

---

## 1. Contexto del Proyecto

El proyecto se encuentra en la rama `master` (commit `3429015`).
- El **Sprint 5A (Quick Buy con tallas y swatches nativos en tarjetas/filtros)** está 100% implementado, desplegado en la tienda viva (`Couture` #165809488115) y certificado empíricamente en `CLAUDE-REPORT-5A-002` y `GEMINI-review-CLAUDE-5A-002`.
- Las compuertas estáticas están en verde: Theme Check 116 archivos con 0 ofensas, 380 claves de localización con paridad total inglés/español y 53 filas del Ledger sincronizadas.
- En paralelo, **GPT-5.6 Sol Max** está ejecutando la auditoría adversarial de producto sobre la tienda viva (`GPT-TASK-005`).

---

## 2. Misión de Opus 5.5

Realizar una auditoría técnica profunda y rigurosa sobre el repositorio para:

1. **Revisión de Calidad de Código Frontend:**
   - **Liquid:** Detectar posibles cuellos de botella de renderizado, duplicaciones de lógica entre snippets/sections, anidamientos innecesarios o variables globales no aisladas.
   - **CSS (`assets/base.css`):** Analizar consistencia de diseño, uso de tokens `--color-*` y `--spacing-*`, especificidad excesiva, reglas muertas o redundancias.
   - **JavaScript (`assets/theme.js`):** Evaluar arquitectura de Web Components (`ThemeElement`), gestión de listeners de eventos (prevención de memory leaks), accesibilidad de foco, timers y estados reactivos.
2. **Auditoría de Casos Límite (Compuerta de Estados Degenerados):**
   - Evaluar componentes frente a: texto ultra-largo (ej. títulos de 140+ caracteres en tarjetas), imágenes faltantes, productos sin variantes, colecciones vacías o catálogos gigantes.
   - Analizar el problema reportado en 5A sobre el nombre de marca cortado a 390 px ("LINEA NO…") en la cabecera móvil.
3. **Consolidación de Tareas Pendientes y Deuda Técnica:**
   - Extraer y listar los pendientes identificados en `CLAUDE-REPORT-5A-001`, `CLAUDE-REPORT-5A-002`, `GPT-AUDIT-003` y `GPT-AUDIT-004` (ej. soporte de zoom en PDP para Sprint 5B, recently viewed, trust badges, checkout acelerado, etc.).
4. **Preparación Técnica para Sprint 5B (PDP Luxury Media & Zoom):**
   - Identificar requerimientos arquitectónicos para el zoom de alta gama en PDP (modal zoom vs lens zoom interactivo) y galería multimedia sin dependencias externas.

---

## 3. REGLA DE ORO: FRENO DE MANO VINCULANTE

> **ALERTA CRÍTICA:** NO MODIFIQUES NINGÚN ARCHIVO DEL TEMA NI REALICES COMMITS.
> Tu labor en este turno es puramente diagnóstica y estratégica. Una vez entregues tu informe, debes **DETENERTE** para que Gemini y Johandry sumen los hallazgos de GPT-5.6 Sol Max (`GPT-AUDIT-005`) y te emitan una directiva de implementación unificada.

---

## 4. Entregable Esperado

Redactar el dictamen en:
`agent-comms/outbox-claude/CLAUDE-AUDIT-OPUS-001.md`

Siguiendo el estándar de `agent-comms/RULES.md`:
1. Resumen ejecutivo del estado del código y arquitectura.
2. Inventario de vulnerabilidades, ineficiencias o errores detectados (con `archivo:línea`).
3. Matriz de tareas pendientes y deuda técnica consolidada.
4. Propuesta técnica para Sprint 5B (Zoom / Media).
5. Plan de acción priorizado (listo para fusionar con el feedback de GPT).
