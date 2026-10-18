**Auditoría y mejoras recomendadas: Sartorial con Contour como referencia**

ID: GPT-AUDIT-COMPARATIVA-001 · revisión 2
Estado: comparación ampliada y plan multiagente documentado; sin implementación.
Decisión requerida: ninguna para completar este encargo documental. Claude/Gemini reciben el plan conforme al protocolo vigente; las decisiones futuras de arquitectura y producto se resuelven por ese flujo.
Resumen en 5 líneas:
1. Contour es la única referencia externa del plan por instrucción expresa de Johandry; se conserva Sartorial y su línea editorial de moda.
2. Se adoptan prácticas de especialización, datos fiables, configuración, organización y revisión, verificando su utilidad en nuestro tema.
3. Primero CI, copy/datos y línea base real; después un piloto de recursos y mejora del editor/presets con piezas existentes.
4. Imprint ya incluye technical_specs y Archive provenance: la diferenciación existe también dentro de main-product y debe preservarse.
5. Los rechazos del referente son contexto del usuario; sus dictámenes no están disponibles y no prueban aprobación ni convierten sus decisiones en normas Shopify.
Archivos tocados: informe, plan, aportes de subagentes, revisión y handoff/registro documental. Código de aplicación y ledger sin modificar.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementación; este plan identifica cambios de contrato que deberán concretarse en sus directivas.
Hallazgos extra fuera de alcance (con parche listo): no se prepararon parches de código.
Verificación (comando, resultado y qué demuestra/qué no): evidencia estática de la revisión anterior al mismo SHA y contrastes de fuente de los agentes; no se reejecutó tienda.
Lista de afirmaciones falsables numeradas: 1–6 siguientes y sus fuentes.

**1. Alcance y experiencia aprovechable**

Base: Sartorial `b400cdc5acc345e9e9d6c0c99e3132a3bc6a5e44`; Contour/atelier `1576d06b336abb6827084b7734faebbcb4d8f32f`. La comparación anterior queda conservada en el histórico externo; el análisis activo y sus recomendaciones se limitan a Contour.

La experiencia de revisiones de Shopify mencionada por Johandry justifica examinar el tema con atención, pero no se localizaron cartas ni dictámenes con causas concretas en los documentos examinados. Johandry precisa que recuerda «falta de personalización o algo así», sin el reporte completo. Es una pista para auditar libertad real del editor y diferenciación/originalidad, no una causa confirmada de rechazo. Los cambios que el autor describe en RELEASE-NOTES.md y DEVELOPMENT.md son aprendizajes a contrastar. La consulta de requisitos oficiales actuales recibió 403 del proxy; no se presentan como revalidados hoy.

**2. Comparación útil para decidir**

| Aspecto observable | Sartorial | Contour |
|---|---|---|
| Línea | Moda editorial | Mobiliario, arte y cerámica |
| Secciones Liquid | 33 | 60 |
| Presets | Sartorial, Imprint, Archive | Contour, Annex, Maison |
| Storefront incluido | EN/ES | EN/ES/DE/FR/IT |
| Schema del editor | EN | EN/ES/DE/FR/IT |
| Labels de schema localizados | 492/492 | 1171/1171 |
| Theme Check común recomendado | 0 incidencias | 0 incidencias |
| CSS global, gzip local | 50.2 kB | 29.1 kB |
| JS del ejemplo de portada, gzip local parcial | 56.6 kB | 103.8 kB |

Son resultados/inventario de la auditoría anterior sobre esos SHAs; no se reetiquetan como pruebas de este pase. Gzip local no representa transferencia de red, ni Lighthouse ni conversión. La suma de JS de Contour excluye opciones y scripts adicionales de secciones; la igualdad de claves no demuestra calidad lingüística. Un mayor inventario de secciones no acredita superioridad en cada flujo.

**3. Qué adaptar de Contour conservando nuestra línea**

| Referencia | Adaptación recomendada | Capacidad de Sartorial que se conserva |
|---|---|---|
| Presets con necesidades particulares de compra | Ensayar recorridos originales por preset con catálogo real y piezas existentes | Identidad editorial y nombres actuales; lookbook, conjuntos, technical_specs y provenance |
| Datos de producto documentados y ausencia explícita de valores desconocidos | Eliminar afirmaciones inferidas solo por handle/tipo y definir fuente de datos y fallback | Metafields y configuración explícita del comerciante |
| Organización por responsabilidades | Piloto CSS y luego JS opcional según presencia del componente, con editor probado | ThemeElement, ThemeCore, eventos, datos y formularios comerciales |
| Editor localizado y ayuda contextual | Español del editor, recetas de datos/tallas/procedencia y guía de envío precisa | Labels t:, storefront EN/ES, controles e IDs existentes |
| Aislar código del tema y contenido de tienda | Instalación limpia y actualización segura por preset | Ajustes, imágenes y catálogo del comerciante |
| Registro de evolución y revisión | Dossier de pruebas actuales y trazabilidad por requisito | Cinco compuertas del proyecto y revisión adversarial |

La navegación lateral, cursores, GSAP/Lenis, el cargador global pospintado y los módulos específicos de muebles/cerámica no se proponen como cambios de Sartorial. Su utilidad no se deduce de que el referente los use. Una ampliación original de moda solo entra si las piezas actuales no resuelven una necesidad concreta.

**4. Hallazgos prioritarios y matices incorporados**

- CI usa Node 20 (`.github/workflows/ci.yml:27`), pero CLI 4.8.0 exige >=22.12.0 (`package-lock.json:680`); `.nvmrc` fija 22.12.0. Incompatibilidad declarada confirmada; no se ejecutó GitHub Actions bajo Node 20.
- CI ejecuta `playwright test --list` (`ci.yml:58`), no las aserciones de los dos casos PDP. Requieren catálogo que permita ambos, sin sustituir cobertura por omisiones.
- `snippets/product-technical-specs.liquid:46-69` puede emitir “Solid milled brass” y “Precision machined” por coincidencias en handle sin datos técnicos explícitos. Es una rama verificable de código; no se ha probado su exposición en un producto real. La tarea futura define fuente explícita y prueba negativa.
- `docs/merchant/docs.html:204` conserva Edition mientras el estado actual incluye Imprint; `:254` promete cálculo automático del umbral, pero `locales/en.default.schema.json:816` explica configurarlo según tarifas reales. Prioridad: exactitud del producto y ayuda antes de sumar funciones.
- Los bloques de PDP ya diferencian Imprint (`listings/imprint/templates/product.json:72`, technical_specs) y Archive (`listings/archive/templates/product.json:72`, provenance). Se amplía la lectura anterior: compartir tipos de sección no significa compartir toda la función o experiencia.
- El CSS global es una oportunidad de optimización y el núcleo JS es extenso; Contour también carga bastantes módulos globalmente (`layout/theme.liquid:173-200` del referente). Dividir archivos no demuestra un ahorro: el piloto debe medir solicitudes y regresiones de editor/interacción.

**Personalización, con la pista adicional de Johandry.** Los agentes verificaron controles reales de hero/proporciones/móvil, color, tipografía y bloques; Sartorial ya ofrece bastante configuración. La nueva matriz distingue soporte en código de validación pendiente en editor. Los dos candidatos concretos son espaciado local de sección y columnas móviles PLP independientes, empezando por ensayos pequeños que preserven herencia y preferencias actuales. La aceptación pide dos composiciones/recorridos originales dentro de un mismo preset sin editar código, además de controles que se propaguen y persistan. Esta comprobación cubre libertad del comerciante y diferenciación, sin afirmar que conocemos el motivo exacto del rechazo.

**5. Plan multiagente y responsables**

El [plan ejecutable GPT-PLAN-CONTOUR-001](../../docs/contour-reference-plan.md) desarrolla alcance, dependencias, archivos candidatos, aceptación, reversión y relación con el ledger:

1. CONTOUR-00: procedencia de evidencia, contratos y requisitos vigentes.
2. CONTOUR-01: Node/CI y exactitud de datos, ayuda y documentación.
3. CONTOUR-02: línea base en tienda por los tres presets y flujos de compra/editor.
4. CONTOUR-03: piloto CSS y después JS contextual, ampliable solo con ahorro y compatibilidad demostrados.
5. CONTOUR-04: matriz de personalización efectiva, editor ES y recorridos diferenciados con piezas actuales. Se prioriza antes de ampliar el piloto de recursos por la pista aportada por Johandry.
6. CONTOUR-05: ampliación original opcional, solo ante una carencia observada.
7. CONTOUR-06: instalación/actualización por preset y dossier de revisión.

Claude conserva el liderazgo técnico temporal y la implementación; Gemini la arquitectura consultora y el flujo de directivas; GPT la auditoría independiente; Johandry las decisiones comerciales y tiendas. Los análisis de esta sesión los ejecutaron subagentes Codex de técnica, producto y calidad, seguidos de revisión independiente; no se atribuyen a ejecuciones de Claude/Gemini ni se simulan sus aprobaciones. BOARD.md y los estados del ledger se conservan.

**6. Evidencia, límites y entregables**

Resultados anteriores al mismo SHA: `npm run gates:static` exit 0, Theme Check 92 archivos sin incidencias; perfil core recomendado de ambos temas exit 0. Los siete casos locales del onboarding no validan compra ni Liquid real. No se han ejecutado las mejoras ni nuevos tests conectados en esta planificación.

Fuentes comprobables de la referencia: `Contour/DEVELOPMENT.md:130-135` describe datos ausentes sin publicar; `:69-77` separa contenido de código en las tiendas; `Contour/layout/theme.liquid:173-234` muestra módulos globales y arranque pospintado. Las notas del autor se contrastarán con código y tienda; no se generalizan como política vigente.

Aportes: [técnico](GPT-CONTOUR-TECH-001.md), [producto](GPT-CONTOUR-PRODUCT-001.md) y [calidad](GPT-CONTOUR-QA-001.md). La [revisión adversarial](../reviews/GPT-REVIEW-CONTOUR-PLAN-001.md) cubre el plan final. La evidencia histórica filtrada de ambos temas acompaña la copia externa del informe; los nuevos documentos dejan separado lo observado, lo propuesto y lo pendiente.

El primer paquete concreto es CI, fixtures, contrato de datos/ayuda y matriz de personalización. Un control debe demostrar propagación, alcance y persistencia en editor; no se añade por conteo. Se evalúan ambas lecturas de personalización, configuración y diferenciación de producto. La ruta protege la identidad y lo ya aprobado mientras incorpora mejoras de madurez contrastables del referente.
