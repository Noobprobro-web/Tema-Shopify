ID: GPT-018-ROLE-02
Estado: Benchmark base completado; comparación live pendiente de evidencia de roles 1/3.
Decisión requerida: Priorizar catálogo, rutas de compra y confianza antes de ampliar features.
Resumen en 5 líneas:
1. Precios oficiales verificados: Be Yours $350; Prestige e Impact $400; Symmetry $420 USD.
2. $380 es el segmento propuesto de Sartorial, no precio publicado certificado.
3. Sartorial ya contiene capacidades de descubrimiento y compra relevantes; no procede presumir ausencia por falta de configuración.
4. Debilidades históricas de demos necesitan nueva reproducción antes de confirmarse.
5. No se abrió navegador Sartorial ni se aplicaron parches.
Archivos tocados: Este informe y harness-GPT-018/role-02-benchmark/sources.md.
Desviaciones (Nivel 1 o Nivel 2): Ninguna.
Hallazgos extra fuera de alcance (con parche listo): Ninguno confirmado.
Verificación (comando, resultado y qué demuestra/qué no): git status --short no produjo entradas; advertencias de permisos de git ignore. Get-Content del reporte Claude solicitado falla: archivo ausente. rg de REPORT-016/017 no encontró nombres; sí existen AUDIT-016/017 y REPORT-014. Fuentes oficiales abiertas con web.open; las listas declaran capacidades, no demuestran usabilidad, performance ni conversión.
Lista de afirmaciones falsables numeradas:
1. Los cuatro precios pueden verificarse en sus fichas oficiales enlazadas.
2. El repositorio incluye swatches y sticky cart; no equivale a configuración correcta en demo.
3. Las referencias históricas mencionadas abajo pueden quedar obsoletas al reauditar.

## Plan y alcance
Comparar posicionamiento y promesas oficiales; contrastar con soporte local; entregar criterios prácticos para validar con runtime del equipo. Sin comparar tasas de conversión inexistentes ni exigir todas las features de competidores. Sin cierre/modificación de filas del ledger.

## Matriz competitiva (consulta 1 octubre 2026)
| Referente / fuente oficial | Precio USD | Promesa y capacidades declaradas relevantes | Expectativa práctica para Sartorial |
|---|---:|---|---|
| [Prestige](https://themes.shopify.com/themes/prestige/presets/prestige) | 400 | Identidad premium, más de 30 secciones, zoom, galerías, swatches, lookbook, búsqueda y compra rápida; docs y soporte enlazados | Atelier: las fotos deben explicar caída y detalles; elegir talla con información suficiente. Archive: imágenes y relato deben corresponder al objeto. |
| [Be Yours](https://themes.shopify.com/themes/be-yours/presets/be-yours) | 350 | Enfoque beauty, narrativa editorial, entrega, galerías, swatches, sticky cart y soporte/documentación | Edition: el acabado elegido debe poder verse; materiales, medidas y entrega deben ser concretos. No trasladar funciones beauty innecesarias a marroquinería. |
| [Impact](https://themes.shopify.com/themes/impact/presets/impact) | 400 | Personalidad visual, más de 35 secciones, quick buy, sticky compra y complementarios | Los tres presets deben demostrar identidad sin sacrificar selección y compra móvil. Animación por sí sola no demuestra valor comercial. |
| [Symmetry](https://themes.shopify.com/themes/symmetry/presets/symmetry) | 420 | Catálogo con filtros, mega menu, size chart, información de entrega y compra rápida | Atelier: talla y navegación visibles. Edition: rutas por uso. Archive: condición y medidas por pieza. La taxonomía es administración de catálogo, no ausencia automática del tema. |

No se copió la lista completa de cada ficha. Más secciones, RTL, countdown, infinite scroll o before/after no son bloqueos automáticos ni requisitos nuevos de esta auditoría.

## Sartorial: capacidad versus demostración
`rg -n 'mega|swatch|recent|sticky|quick|filter' sections/header.liquid sections/main-product.liquid snippets/product-card.liquid` devuelve `sections/main-product.liquid:232` (value.swatch.image), `:236` (value.swatch.color), `:763` (enable_sticky_cart), `:765` (selected_variant.featured_media). `rg --files sections` identifica lookbook.liquid, recently-viewed.liquid, complete-the-look.liquid y product-recommendations.liquid. Esto refuta la premisa de que faltan todas las herramientas premium; su experiencia real queda pendiente.

## Brechas comerciales candidatas: no confirmadas de nuevo
| ID | Prioridad candidata / superficie / dueño | Evidencia histórica y/o actual local | Qué la refutaría | Acción práctica |
|---|---|---|---|---|
| BM-01 | P1 contenido/imágenes; Johandry | AUDIT-017-post-remediation-commercial-verdict.md:10,22 reporta fotos incongruentes Edition/Archive; :75-81 detalla límites | Catálogo actual con fotos correspondientes a título, material y acabado en todas las variantes | Aplicar material de rol 4 y asociar imágenes a variantes; distinguir objeto demo de objeto real |
| BM-02 | P1 configuración; Johandry | AUDIT-017-brand-notes.md:28 reproduce 404 /collections/desk-and-study; listings/edition/templates/index.json:36,39 y :79 conservan handle | Colección publicada y accesible actualmente | Crear colección Desk and study con productos de escritorio y verificar tarjeta y tab |
| BM-03 | P1 configuración/contenido; Johandry | AUDIT-017-post-remediation-commercial-verdict.md:91-93 reporta navegación limitada y relato/políticas poco visibles | Menús y políticas actualizados que resuelven dudas antes del checkout | Mostrar colecciones, contacto, entrega y devolución; en Archive añadir condición y autenticidad contextual |
| BM-04 | P1 contenido Atelier; Johandry | AUDIT-017-post-remediation-commercial-verdict.md:91 declara PDP con una foto y sin guía | Fotos actuales de detalle/uso y guía de medidas publicada | Dar fotos suficientes y guía de talla; no convertir esta mejora de demo en feature faltante del código |
| BM-05 | P0 candidato soporte/docs; Johandry | AUDIT-017-post-remediation-commercial-verdict.md:22 reporta acceso no público; estado antiguo | Documentación y formulario públicos operativos verificados por rol 6 | Resolver accesibilidad pública y flujo de soporte antes de ficha |

## Conclusión base
La propuesta visual puede diferenciarse dentro de $350-$420, pero ningún precio ni lista de features certifica una demo lista. La prioridad es demostrar productos comprensibles, navegación fiable y posventa clara. No hay defecto nuevo de código confirmado aquí; no corresponde crear un .diff especulativo. Esperar resultados nuevos del comprador/merchandising para clasificar los candidatos definitivos.

## Limitaciones y contexto disponible
Leídos AGENTS.md, RULES.md, BOARD.md y extractos dirigidos de AUDIT-016/017 y REPORT-014. CLAUDE-REPORT-LEAD-001.md, GPT-REPORT-016 y GPT-REPORT-017 no están disponibles bajo esos nombres en este worktree. No se consultó una demo Sartorial, ni se probaron competidores comprando. Fuentes de competencia: fichas oficiales consultadas hoy; afirmaciones funcionales son declaraciones del proveedor. Un 429 nunca se clasifica como defecto.
