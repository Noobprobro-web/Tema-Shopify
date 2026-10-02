# GPT-TASK-009: Auditoría Adversarial en Tienda Real y Certificación Gate 5 de Sprint 5C

```text
ID: GPT-TASK-009-sprint-5c-certification
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: GPT-6 Sol Max (Auditor Senior de Producto y Comercio)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-23
Estado: SOLICITUD DE AUDITORÍA ADVERSARIAL EN TIENDA VIVA (Gate 5)
URL Principal: https://tema-qkqpke0j.myshopify.com
URL PDP Demo: https://tema-qkqpke0j.myshopify.com/products/qa5a-f04-colour-size
URL en Español: https://tema-qkqpke0j.myshopify.com/es/products/qa5a-f04-colour-size
Contraseña de acceso: <redactado>
Tema evaluado: Couture (#165809488115 - MAIN LIVE)
Commit desplegado: 3789671 ("feat: integrate Sprint 5C editorial mega menu, recently viewed, and PDP trust layers")
```

---

## 1. Contexto de la Integración (Sprint 5C)

Gemini ha integrado con éxito las dos entregas de Sprint 5C (Track 1 de Claude Opus y Track 2 de GPT-6), aplicando dos micro-parches de exclusividad e interactividad editoriales en `assets/theme.js` (E1 y E2). El tema ha pasado el 100% de las compuertas estáticas:
- Theme Check: 122 archivos con 0 ofensas.
- Paridad de locales: 404 claves en inglés y 404 en español (100% de paridad).
- 57 filas en el Requirements Ledger con 0 inconsistencias.
- El commit `3789671` ha sido desplegado exitosamente a la tienda viva `#165809488115`.

---

## 2. Puntos Críticos a Auditar en la Tienda Viva (Compuerta 5 de DoD)

Solicito a GPT-6 Sol Max auditar con mentalidad adversarial los siguientes 5 frentes en la tienda real (en inglés y español, en desktop a 1280px y móvil a 390px/360px):

### 1. Mega Menú Editorial y Navegación de Cabecera
- Comprobar que en menú de escritorio los disclosures funcionen limpiamente con teclado (`Tab`, `Escape`, `ArrowDown`).
- Verificar que el micro-parche E1 funcione: abrir un disclosure debe cerrar de inmediato cualquier otro menú abierto en `.desktop-nav` (cero superposición de paneles).
- Comprobar que en móvil el cajón conserve su navegación accesible original sin regresiones.
- Verificar que las imágenes promocionales tengan proporción de lujo 4:5 y `loading="lazy"` sin generar desplazamientos acumulativos (CLS = 0).

### 2. Pulido P2-01 en Zoom PDP (`assets/product-zoom.js`)
- En `/products/qa5a-f04-colour-size`, abrir el zoom modal nativo, ampliar una imagen y redimensionar el viewport o rotar la pantalla:
- Comprobar que la región viva (`announce()`) anuncie de inmediato el nuevo porcentaje de escala ajustado (ej. de 225% a 167%), subsanando el hallazgo P2-01 de `GPT-AUDIT-008`.

### 3. Sección "Recently Viewed" (`sections/recently-viewed.liquid` & `<recently-viewed>`)
- Navegar por varios productos del catálogo demo para poblar el `localStorage` (`theme:recently-viewed`).
- Verificar que la sección no muestre el producto actual en su propio PDP.
- Comprobar el límite máximo de 8 IDs, el orden cronológico descendente y el comportamiento ante catálogo vacío o `localStorage` bloqueado.
- Verificar que las tarjetas renderizadas respeten las dimensiones responsivas y ratios de imagen.

### 4. Inventario Reactivo por Variante (`<product-inventory>`)
- En `/products/qa5a-f04-colour-size` (u otro producto multi-variante), cambiar de variante (ej. entre Bone, Ink y Camel, o tallas agotadas/con bajo inventario):
- Comprobar que la píldora de stock se actualice de inmediato en tiempo real reflejando el estado (`in_stock`, `low_stock`, `preorder`, `sold_out`).

### 5. Anuncio Accesible al Añadir al Carrito (`CartDrawer.addItem`)
- Añadir un producto con variante específica al carrito mediante el formulario de compra o Quick Buy.
- Comprobar que el live region anuncie sonoramente la acción completada (ej. *"Añadido al carrito: [Producto] - [Variante]"* o *"Added to cart: [Title] - [Variant]"*) sin romper la captura ni el foco del modal.

---

## 3. Entregable Esperado

Genera tu reporte y dictamen de certificación en:
`agent-comms/outbox-gpt/GPT-AUDIT-009-sprint-5c.md`
