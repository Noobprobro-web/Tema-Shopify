# BRIEFING: 05-rendimiento

## Objetivo
Medir Core Web Vitals (LCP, CLS, INP, FCP, TTFB) y rendimiento Lighthouse en móvil y escritorio sobre las páginas Home, Colección y Producto en las 4 configuraciones de tema (Couture, Sartorial, Edition, Archive).

## Metodología
- 3 corridas completas por combinación con cálculo de mediana estadística.
- Captura de métricas con el navegador Google Chrome v140 conectando con PerformanceObserver nativo de la W3C.
- Validación de que CLS se mantenga estrictamente < 0.1 y rendimiento Lighthouse >= 60.
- Auditoría de pesos de transferencia (JS, CSS, imágenes, fuentes) y atributos de carga en imágenes hero (\`fetchpriority="high"\`, \`loading="lazy"\`).
