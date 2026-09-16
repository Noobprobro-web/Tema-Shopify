# DIRECTIVA TÉCNICA: SPRINT 4E-002 — REFINAMIENTO VISUAL DE PÁGINAS NATIVAS Y ELEVACIÓN DE NAVEGACIÓN EN HEADER

```text
ID: CLAUDE-DIRECTIVE-4E-002
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Fable 5.1 Max / Opus 5 - Implementador Principal de Código)
Autoridad: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-16
Estado: EMITIDA / LISTA PARA EJECUCIÓN
Objetivo: Auditar, pulir estéticamente y elevar al estándar de lujo las 5 páginas nativas recién creadas (Documentation, Support, FAQ, About, Policy), e integrar soporte robusto para navegación multinivel y enlaces de utilidad en el Header.
```

---

## 1. Contexto y Mandato del Usuario

Johandry ha revisado las páginas nativas recién creadas y ha solicitado dos acciones prioritarias:
1. **Revisión y Elevación Estética de las 5 Páginas:** Someter las 5 secciones a una auditoría visual y de micro-interacciones (espaciados armónicos, tipografía editorial, transiciones de acordeones, feedback de copiado en código y legibilidad responsive a 390px).
2. **Integración en el Header:** Asegurar que las páginas puedan integrarse de forma fluida en la navegación de la cabecera, tanto en menús desplegables multinivel de lujo (*dropdowns*) como mediante un soporte opcional de enlaces de utilidad (*utility menu / secondary menu*).

---

## 2. Bloque A: Refinamiento Estético y Funcional de las 5 Páginas

### A1. Documentación (`sections/main-documentation.liquid` y `assets/base.css`)
- **Micro-interacción de Copiado:** Cuando el usuario hace clic en el botón `[COPY]`, añadir una transición visual con icono o badge de confirmación ("Copied! / Copiado") y feedback accesible.
- **Scroll-Spy y Sidebar Sticky:** Pulir la barra lateral fija (`.anchor-nav`) con un indicador visual elegante (línea activa a la izquierda o acento tipográfico sutil) que acompañe la posición del scroll sin saltos bruscos.
- **Móvil (390px):** Asegurar que el selector desplegable del índice móvil ("On this page") sea fluido, fácil de pulsar (mínimo 44px) y colapse limpiamente al seleccionar un apartado.

### A2. Soporte (`sections/main-support.liquid`)
- **Estilo del Formulario:** Aplicar los tokens de formulario de alta sastrería (`.form-field`, focus rings con `--focus-ring`, validación `:user-invalid` sutil).
- **Tarjetas de Alcance (Scope Cards):** Elevar el diseño visual de "What is covered" y "What is not covered" con bordes finos de pelo (*hairline*), viñetas de diseño y jerarquía visual nítida.
- **Acordeones de Soporte:** Asegurar que los acordeones técnicos reutilicen la animación fluida y el indicador más/menos accesible.

### A3. Preguntas Frecuentes (`sections/main-faq.liquid`)
- **Filtro / Buscador Rápido (Mejora Progresiva):** Añadir un campo de búsqueda instantánea opcional para filtrar preguntas en tiempo real sin recargar página (si no hay JS, se muestran todas).
- **Transición Suave de Acordeones:** Animar la apertura y cierre del `<details>` / `<summary>` utilizando transiciones CSS sobre `grid-template-rows: 0fr -> 1fr` o `opacity` / `transform` para que la expansión se sienta sedosa y editorial.

### A4. Historia / About (`sections/main-about.liquid`)
- **Integración con Sistema de Movimiento Cinemático:** Aplicar atributos `data-reveal` a los bloques de valores, citas de artesanos y galería de atelier para que entren con la cadencia de lujo calibrada en 4D.
- **Cita Destacada:** Comillas serif grandes de diseño editorial y tipografía proporcional.

### A5. Políticas Legales (`sections/main-policy.liquid`)
- **Tipografía y Legibilidad:** Asegurar un ancho máximo de lectura de 68ch a 72ch con altura de línea de 1.75, subtítulos `h2` y `h3` armónicos, y enlaces con subrayado decorativo sutil.

---

## 3. Bloque B: Elevación de Navegación en el Header (`sections/header.liquid` y `assets/base.css`)

### B1. Perfeccionamiento del Menú Desplegable (Dropdown Multinivel)
- En Shopify, las páginas se enlazan mediante los menús de navegación (`linklists`).
- Auditar y pulir el panel desplegable de navegación en desktop (`.desktop-nav__panel`):
  - Animación de entrada suave: `--motion-fast` con desplazamiento sutil (`translateY(4px) -> translateY(0)`) y `opacity: 0 -> 1`.
  - Sombra de elevación sutil y bordes limpios con `--color-border-hairline`.
  - Navegación accesible por teclado: Apertura con `Enter`/`Space`, cierre con `Escape`, navegación con flechas/Tab y restauración de foco.

### B2. Soporte Opcional de Menú Secundario / Utility Links
- Añadir en el schema de `sections/header.liquid` un setting opcional de tipo `link_list` llamado `secondary_menu` (label: `t:sections.header.settings.secondary_menu.label`, info: "Optional menu for documentation, support, or about links").
- Si está configurado, renderizar estos enlaces de forma discreta y elegante en la cabecera (junto a las acciones o en una barra de utilidad), y en la parte inferior del menú móvil lateral (`.drawer-panel`).

---

## 4. Compuertas Obligatorias

1. **Theme Check:** 0 ofensas (0 errores, 0 advertencias).
2. **Gates Estáticas:** `npm run gates:static` debe dar **exit code 0** en las 8 compuertas.
3. **Internacionalización:** 100% de claves nuevas en `locales/en.default.json` y `en.default.schema.json` con `t:` y sentence case.
4. **Cero `shopify://` en Git.**
5. **No hacer `git commit` ni `git push`:** Reportar entrega con evidencias en `agent-comms/outbox-claude/CLAUDE-REPORT-4E-002.md`.
