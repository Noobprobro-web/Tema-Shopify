# Auditoría manual R4 de GPT y diagnóstico de su defecto alto

Fecha: 2026-11-25. Temas revisados: "Sartorial R4 (0b4d517)" `190695473456`, "Archive R4 (0b4d517)" `190695506224` e "Imprint R4 (0b4d517)" `190695538992`, los tres sin publicar en la tienda de QA.

Procedencia: el informe completo de GPT se quedó en una rama local de su equipo y no se subió al repositorio. La parte 1 es el resumen que GPT entregó en la conversación, sin añadidos. La parte 2 es el diagnóstico posterior de Claude sobre el único defecto alto. No contiene credenciales ni datos personales.

## 1. Resumen entregado por GPT

**Defecto alto (único):** en Sartorial, a 1536×674, el botón de compra aparece y desaparece al bajar por la ficha, y «no hay columna ni barra de compra fija».

**Funcionó:**
- búsqueda (cabecera y página de resultados);
- filtros de colección;
- menú (escritorio y móvil);
- zoom de imagen;
- cambio de cantidades;
- búsqueda sin resultados;
- foco y teclado en los recorridos probados;
- blog;
- vídeo de producto;
- sin errores de Liquid ni traducciones ausentes en las páginas revisadas.

**No pudo probar:**
- el cambio de variante y la tarjeta regalo: su herramienta bloqueó esas acciones;
- la página de contraseña.

**Incidencia del entorno:** en algunas rutas móviles de Archive e Imprint la barra de vista previa de Shopify salió en negro y sin el nombre del tema, así que en esas páginas no pudo confirmar el preset por la barra.

## 2. Diagnóstico de Claude sobre el defecto alto

**Conclusión: el defecto alto no es un defecto del tema.** Es un artefacto de la barra de vista previa de Shopify, que solo existe al previsualizar un tema sin publicar. La parte real que queda es el tramo corto sin botón visible del defecto 5 de la auditoría de QA (`docs/audits/R4/R4-AUDITORIA-MANUAL-QA.md`), de severidad baja, que se corrige en R5.

**Cómo se comprobó:**
- Playwright en navegador real, en los tres presets, con desplazamiento por rueda de ratón.
- Viewports: 1536×674, 1229×539 a escala 1,25, 1440×674 y 1366×768.

**Lo que se observó:**
1. La columna de detalles no cabe en la ventana a esas alturas, así que no es sticky. Es el diseño de R4 C1a: solo es sticky si cabe entera bajo la cabecera.
   - El atributo lo pone `observeStickyFit` en `assets/theme.js:295-328`.
   - El CSS que lo usa está en `assets/base.css:5116-5119` y `:9088-9092`.
2. El botón «Add to cart» sale por arriba de la ventana en el segundo desplazamiento.
3. La barra fija `sticky-cart-bar` se activa en ese momento: `assets/theme.js:1866-1869` (`!entry.isIntersecting && entry.boundingClientRect.bottom <= 0`).
4. La barra queda bien colocada, con `position: fixed; bottom: 0; z-index: 40` (`assets/base.css:1660-1679`).
5. En la vista previa la tapa la barra de vista previa de Shopify: el iframe `#PBarNextFrame`, de unos 64 px, pegado abajo.
   - Ese iframe solo existe cuando la URL lleva `preview_theme_id`.
   - Con «Hide bar» de esa barra, la barra del tema se ve entera.
6. La auditoría de QA vio lo mismo de forma independiente. En su §5 anota: «La barra de vista previa de Shopify tapaba la barra fija de compra, así que la oculté por script».

**Lo que sí es real** (defecto 5 de QA, severidad baja; R5 lo corrige):
- **Al cargar:** a esas alturas el botón queda bajo el borde inferior, y la barra no sale porque solo aparece cuando el botón ha salido por arriba.
- **Al bajar:** hay un tramo en el que el botón está detrás de la cabecera fija y la barra todavía no se ha activado, porque el observador usa la ventana entera como raíz, sin descontar `--header-offset`.

Estos dos tramos explican por qué el botón «aparece y desaparece»: se ve, lo tapa la cabecera y, cuando sale la barra, la barra de vista previa la oculta.

Decisión: D81 en `docs/decisions.md`. Arreglo: `agent-comms/inbox-gpt/GPT-TASK-R5-001.md` §3, arreglo B.
