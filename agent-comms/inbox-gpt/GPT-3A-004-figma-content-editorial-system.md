# Directiva de Implementación: GPT-3A-004

```text
ID: GPT-3A-004
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador de Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 3A.4 (Bloque 2: Páginas de Historia, Contacto/FAQ, Blog/Artículo y Sistema en Figma)
Fecha: 2026-09-11
Estado: LISTA PARA EJECUCIÓN
```

---

## 1. Contexto y Objetivos

Con la aprobación del Bloque 1 (Colección, Cart Drawer, Mega-Menú y Footer bajo el dictamen `GEMINI-005`), iniciamos el **Bloque 2 final de diseño en Figma**. 

Este bloque completará el **100% de las 12 plantillas estándar requeridas por la Shopify Theme Store**.

---

## 2. Pantallas Requeridas (Desktop 1440px & Mobile 390px)

### 1. Página de Historia / Marca (`Section-About-Atelier`)
- Encabezado editorial con titular de manifiesto y fecha de fundación (`Atelier Flow / Heritage`).
- Bloque de narrativa: Filosofía de producto físico, lentitud productiva y materiales nobles.
- Galería de taller / proceso artesanal (3 encuadres fotográficos hairline con pies de foto explicativos).
- Cierre con firma de directores creativos y botón "Explore Our Archive".

### 2. Contacto & FAQ (`Section-Contact-FAQ`)
- Encabezado de atención personalizada: citas de showroom, soporte y concierge.
- Formulario de contacto minimalista (Nombre, Email, Motivo de consulta, Mensaje) con campos de 52px de alto.
- Acordeón interactivo de Preguntas Frecuentes (FAQ) con 4 temas clave: *Shipping & Provenance*, *Care & Longevity*, *Returns & Archive Exchange*, *Bespoke Orders*.

### 3. Blog y Lectura de Artículo (`Section-Blog-Magazine` & `Section-Article-Reading`)
- **Portada de Blog (`blog.json`):** Formato revista con artículo principal destacado + grilla de 2 columnas de ensayos con tiempo de lectura (`5 min read`) y categorías.
- **Lectura de Artículo (`article.json`):** Maqueta de lectura de gran legibilidad tipográfica con pull-quote centrada, separador hairline y bloque de recomendación de productos incrustados ("Objects featured in this story").

### 4. Páginas de Sistema: Búsqueda, 404 y Password (`Section-System-Templates`)
- **Búsqueda (`search.json`):** Barra de búsqueda con resultados predictivos y estado de cero resultados elegante con sugerencias.
- **Error 404 (`404.json`):** Mensaje curatorial (*"404 / Object not found in the atelier"*) con botón de retorno a Home y mini-carrusel de piezas populares.
- **Password / Próximamente (`password.json`):** Pantalla de apertura de colección privada con formulario de suscripción para acceso anticipado y login de contraseña.

---

## 3. Criterios de Aceptación Técnicos

1. **Archivos SVG autocontenidos en `docs/figma/`:**
   - `docs/figma/couture-about-contact-1440.svg` (y versión 390px)
   - `docs/figma/couture-blog-system-1440.svg` (y versión 390px)
2. **Tokens y Accesibilidad:**
   - 100% alineados con `docs/design-tokens.json` (paleta Couture).
   - Contrastes >= 4.5:1 (WCAG 2.2 AA).
   - Tap targets interactivos >= 44×44px.
3. **Estructura para Figma:**
   - Grupos con IDs semánticos para fácil agrupamiento y conversión a Frames.
4. **Documentación:**
   - Entrega en `agent-comms/outbox-gpt/GPT-3A-004-figma-content-editorial-system.md`.
