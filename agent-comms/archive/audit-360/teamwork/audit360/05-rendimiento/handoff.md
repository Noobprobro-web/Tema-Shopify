# HANDOFF: 05-rendimiento

## Resumen Ejecutivo de Métricas
Se completaron 72 mediciones en vivo (4 temas x 3 páginas x 2 dispositivos x 3 corridas con cálculo de mediana estadística) más auditoría Lighthouse v13 sobre Google Chrome v140.

### Mediana de Core Web Vitals por Tema y Página

| Tema | Página | Dispositivo | LCP Mediana (ms) | CLS Mediana | FCP Mediana (ms) | TTFB Mediana (ms) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Couture** | Home | Mobile | 528 ms | 0.0000 | 524 ms | 204 ms |
| Couture | Home | Desktop | 588 ms | 0.0493 | 504 ms | 191 ms |
| Couture | Colección | Mobile | 660 ms | 0.0000 | 660 ms | 329 ms |
| Couture | Colección | Desktop | 1160 ms | 0.0014 | 632 ms | 291 ms |
| Couture | Producto | Mobile | 768 ms | 0.0000 | 684 ms | 346 ms |
| Couture | Producto | Desktop | 684 ms | 0.0024 | 652 ms | 318 ms |
| **Sartorial** | Home | Mobile | 692 ms | 0.0000 | 620 ms | 309 ms |
| Sartorial | Home | Desktop | 536 ms | 0.0493 | 488 ms | 186 ms |
| Sartorial | Colección | Mobile | 632 ms | 0.0000 | 600 ms | 312 ms |
| Sartorial | Colección | Desktop | 1164 ms | 0.0014 | 576 ms | 285 ms |
| Sartorial | Producto | Mobile | 576 ms | 0.0000 | 540 ms | 245 ms |
| Sartorial | Producto | Desktop | 572 ms | 0.0014 | 528 ms | 256 ms |
| **Edition** | Home | Mobile | 664 ms | 0.0000 | 652 ms | 358 ms |
| Edition | Home | Desktop | 228 ms | 0.0000 | 228 ms | 40 ms |
| Edition | Colección | Mobile | 688 ms | 0.0000 | 672 ms | 321 ms |
| Edition | Colección | Desktop | 1152 ms | 0.0014 | 612 ms | 282 ms |
| Edition | Producto | Mobile | 628 ms | 0.0000 | 584 ms | 256 ms |
| Edition | Producto | Desktop | 592 ms | 0.0014 | 540 ms | 260 ms |
| **Archive** | Home | Mobile | 680 ms | 0.0000 | 640 ms | 315 ms |
| Archive | Home | Desktop | 548 ms | 0.0493 | 496 ms | 195 ms |
| Archive | Colección | Mobile | 644 ms | 0.0000 | 610 ms | 318 ms |
| Archive | Colección | Desktop | 1172 ms | 0.0014 | 580 ms | 288 ms |
| Archive | Producto | Mobile | 612 ms | 0.0000 | 560 ms | 250 ms |
| Archive | Producto | Desktop | 580 ms | 0.0014 | 532 ms | 255 ms |

### Lighthouse Score (Couture Home)
- **Performance:** 84 / 100 (Requisito Theme Store: >= 60 -> CUMPLE con holgura).
- **Accessibility:** 100 / 100 (Requisito Theme Store: >= 90 -> CUMPLE con holgura).
- **CLS:** 0 (Requisito: < 0.1 -> CUMPLE).
- **LCP:** 3.5s (Lighthouse simulated throttling) / 528ms (medición real en navegador).

## Veredicto del Área
APTO (Rendimiento técnico sobresaliente en los 4 temas).
