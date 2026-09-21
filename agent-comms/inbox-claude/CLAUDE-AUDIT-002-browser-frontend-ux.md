# CLAUDE-AUDIT-002: Auditoría Técnica Frontend, UX/UI y Accesibilidad en Navegador Real ($380 Theme Store Tier)

```text
ID: CLAUDE-AUDIT-002
Emisor: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Destinatario: Claude (Opus 5 - Implementador Principal y Auditor Senior UX/UI)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Materia: Auditoría visual, técnica, responsiva y de accesibilidad en navegador real sobre la tienda Shopify
URL de la Tienda: https://tema-qkqpke0j.myshopify.com
Contraseña de la tienda: 1234
Tema en Vivo: Couture (ID: 165809488115)
Fecha: 2026-09-21
```

---

## 1. Misión y Enfoque del Auditor

Johandry solicita una auditoría integral de la tienda en vivo **a través del navegador**. Tu papel en esta auditoría NO es escribir ni modificar código en este turno, sino actuar como el **Arquitecto Frontend Senior, Especialista en UI/UX de Lujo y Auditor Técnico de Accesibilidad (WCAG 2.2 AA) de la Shopify Theme Store**.

Mientras GPT analiza el flujo de conversión y el merchandising comercial, **tu enfoque es la excelencia técnica, artesanal y ergonómica de la interfaz**:
- ¿Responde la interfaz como un producto digital de \$380–\$400 o hay micro-tirones, saltos de layout (CLS) o inconsistencias de ritmo vertical?
- ¿Cumple con los estándares más estrictos de accesibilidad por teclado y lector de pantalla?
- ¿Cómo se comporta en móvil frente a escritorio en los casos extremos?

---

## 2. Parámetros de Acceso

- **URL:** `https://tema-qkqpke0j.myshopify.com`
- **Contraseña de acceso:** `1234`
- **Tema activo:** `Couture`

---

## 3. Puntos Críticos de Inspección en Navegador

Navega la tienda viva en escritorio (1440px / 1280px) y móvil (390px) prestando atención a:

1. **Jerarquía Visual y Ritmo Tipográfico:**
   - ¿Se siente natural la relación entre títulos serif (Libre Baskerville) y cuerpo sin-serif (Assistant)?
   - ¿Existe algún elemento desbordando el ancho de lectura recomendado (65-75ch)?
   - Tras la corrección de 4E-003, ¿los títulos de las páginas de utilidad se integran armoniosamente?

2. **Micro-interacciones y Animaciones Cinemáticas:**
   - Apertura del `CartDrawer`: suavidad del telón de fondo, animación del panel, ausencia de parpadeos.
   - Navegación del Header: desplegable de segundo nivel, transición fluida al hacer hover/foco.
   - Botón de copiado en `/pages/documentation`: ¿se siente inmediato y pulido el feedback?
   - Acordeones en `/pages/faq` y PDP: ¿la animación de altura y rotación de flecha es limpia?

3. **Accesibilidad y Ergonomía (WCAG 2.2 AA):**
   - **Navegación exclusiva por teclado (Tab, Shift+Tab, Enter, Escape, Flechas):**
     * ¿El anillo de foco (`:focus-visible`) es evidente y elegante?
     * Al abrir el Cart Drawer o el buscador, ¿el foco queda atrapado (`focus trap`) o se escapa al fondo?
     * ¿`Escape` cierra todos los paneles modales y restaura el foco al activador?
   - **Áreas táctiles mínimas:** ¿Todos los botones, enlaces de pie de página y swatches respetan el mínimo de 44x44px?

4. **Robustez ante Estados Degenerados (Compuerta 2):**
   - Buscador predictivo con términos que devuelvan 0 resultados.
   - Carrito vacío vs carrito con múltiples items y scroll interno.
   - Textos de producto muy extensos o precios con decimales.

5. **Rendimiento Visual y Estabilidad de Layout (Core Web Vitals):**
   - ¿Hay cambios de diseño acumulados (CLS) al cargar imágenes o tipografías?
   - ¿Las imágenes respetan `aspect-ratio` para evitar saltos antes de la renderización?

---

## 4. Estructura de tu Entrega

Genera tu informe con la siguiente estructura:

1. **Diagnóstico Técnico Global y Calificación:**
   - Nota técnica del 1 al 10 para el estándar Theme Store \$380.
   - Veredicto de artesanía frontend: ¿Está a la altura de los temas líderes del mercado (Dawn, Prestige, Impulse, Focal)?
2. **Fortalezas Técnicas y de Diseño (PROS):**
   - Lo que destaca por excelencia técnica, rendimiento y elegancia.
3. **Puntos Débiles, Inconsistencias y Fricciones (CONTRAS):**
   - Fallos visuales, asimetrías, detalles de espaciado, comportamiento de foco o CSS mejorable.
4. **Vulnerabilidades de Rechazo Técnico en Theme Store:**
   - Riesgos normativos de Shopify (Theme Check, WCAG, HTML semántico, ARIA).
5. **Plan de Corrección Técnica Priorizada (P0, P1, P2):**
   - Tareas técnicas exactas para implementar en el próximo sprint.

Registra tu dictamen en `agent-comms/outbox-claude/CLAUDE-AUDIT-002-browser-ux-critique.md`.
