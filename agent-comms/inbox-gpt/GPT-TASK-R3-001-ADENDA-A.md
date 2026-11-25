# GPT-TASK-R3-001-ADENDA-A: cambios de Claude que afectan a tus archivos

```text
ID: GPT-TASK-R3-001-ADENDA-A (continua GPT-TASK-R3-001)
Emisor: Claude (implementador de la ronda R3)
Receptor: GPT
Estado: ASIGNADA
Alcance: suma a GPT-TASK-R3-001; no cambia nada de lo ya asignado. Mismas reglas de archivos, ramas y compuertas.
```

## a) `sections/collection-list.liquid`: `sizes` de la tarjeta unica

- Motivo: el commit `9843c0e` de la rama `claude/clever-gauss-ddhyr2` cambio `.std-grid--single` (`assets/section-standard-a.css:109-112`). Ahora es una sola pista (`grid-template-columns: minmax(0, 1fr)`) con `max-width: 28rem` (448 px) en todos los breakpoints. Antes mantenia sus N pistas.
- Problema: si `collection-list.liquid` calcula `sizes` dividiendo entre las columnas del ajuste, el navegador elige una imagen demasiado pequena para esa tarjeta unica.
- Cambio pedido: cuando la rejilla sea de tarjeta unica, llama a `card-sizes` con `columns_mobile: 1, columns_tablet: 1, columns_desktop: 1, max_width: 448` (sin `gap`). Referencia ya aplicada: `sections/featured-collection.liquid` (bloque `card_sizes`, junto a `grid_is_single`).
- Actualiza tambien el comentario que dice que la tarjeta unica "mantiene sus pistas": ahora debe decir que la rejilla tiene una sola pista de 448 px.
- Verificar: `gates:theme-check`; razonar con 1 coleccion (448 px) y con 2 o mas (sin cambios).

## b) `sections/marquee.liquid`: boton de pausa

`assets/theme.js` usa ahora un unico mecanismo para el boton de pausa: el nombre accesible alterna entre pausar y reanudar (`data-pause-label` / `data-play-label`) y `aria-pressed` se elimina al conectar el componente. Puedes quitar el `aria-pressed="false"` estatico del boton (`sections/marquee.liquid:52`). Conserva `data-pause-label`, `data-play-label`, `data-marquee-toggle` y `data-marquee-toggle-label`. Es una excepcion adicional a la regla 4.1 del encargo, solo esta.

## c) Aviso de contratos nuevos de `theme.js` (solo informacion)

No son archivos tuyos; no los toques ni los dupliques:

- El boton de envio sin JS debe seguir siendo `button.no-js-only[type="submit"]` dentro de `variant-selects`: `theme.js` lo elimina del DOM al tomar el control.
- El enlace de carrito del header debe seguir siendo `a.site-header__cart[data-cart-count-enabled]`.

## d) Textos para aprobacion de Johandry (D35) que se suman a tu lista

Cambios de defaults de `sections/bento-discovery.liquid` (Nivel 2, DP-010), hechos por Claude en `9843c0e`:

| Ajuste | Antes | Ahora |
| --- | --- | --- |
| Seccion, `eyebrow` | "DISCOVER BY FORM / 04" | "Discover by form" |
| Bloque `card_featured`, `eyebrow` | "[01] FEATURED COLLECTION" | "Featured collection" |
| Bloque `card_editorial`, `eyebrow` | "[02] MATERIAL STUDY" | "Material study" |
| Bloque `card_featured`, `heading` | "Sculptural layers" | (sin default) |
| Bloque `card_featured`, `link` | "/collections/all" | (sin default) |

Anade estas filas a la tabla de copy de tu entrega para que Johandry las apruebe junto con las tuyas.
