ID: GPT-PENDIENTES-JOHANDRY-001
Estado: Preparado; las decisiones e importaciones de tienda están pendientes de Johandry.
Decisión requerida: Resolver cada fila de la tabla antes de la acción correspondiente.
Resumen en 5 líneas:
- En esta tanda no se escribió producto, menú, idioma, fotografía, fixture ni configuración en una tienda; la afirmación se limita a esta tanda.
- Los CSV D-01 están preparados en `draft`; no activar ni publicar hasta aprobar catálogo, precios, tallas y afirmaciones.
- C-R0-4/A-01 y C-07 requieren fixtures autorizados; no se crean metafields ni planes de suscripción.
- El carrito Sartorial T-2 sigue `UNKNOWN`; no se reutiliza ni se limpia fuera de su contexto. Las mediciones nuevas de solo lectura están autorizadas; T-2 bloquea cualquier mutación/limpieza del carrito.
- Lote 0 se cierra solo en el alcance D19; C y D mantienen sus verificaciones de tienda pendientes.
Archivos tocados: Este informe únicamente.
Desviaciones (Nivel 1 o Nivel 2): Ninguna.
Hallazgos extra fuera de alcance (con parche listo): Ninguno.
Verificación (comando, resultado y qué demuestra/qué no): Inspección de los pendientes D23, D19, V4.1 §4.3–4.4 y revisión independiente de cierre; demuestra preparación documental, no aprobación ni configuración de tienda.
Lista de afirmaciones falsables numeradas:
1. Los CSV de catálogo están configurados como `draft` y sus imágenes siguen en listas separadas.
2. `CLAUDE-REVIEW-LOTE-0-CIERRE-001.md` traslada T-2 como disposición pendiente y T-1 como fixture de suscripción pendiente.

## Acciones pendientes

| ID | Acción que requiere a Johandry | Estado y condición de entrega |
|---|---|---|
| T-2 | Decidir la disposición del carrito de Gate 5 Sartorial `T231955117Z` y si bloquea. | `UNKNOWN`: alta/limpieza no verificadas; no volver a tocar ese contexto. Mediciones de solo lectura autorizadas; resolver antes de pruebas nuevas que muten el carrito. |
| C-R0-4 / A-01 | Proveer o autorizar el fixture de suscripción/selling plan con producto y grupo de planes válido. | Pendiente; no crear productos, planes, apps ni metafields desde esta tarea. |
| C-02 | Crear/autorizar una tienda de desarrollo limpia y decidir el resultado canónico de instalación por preset. | Pendiente; no sustituirla por las previews existentes. |
| D-01 | Aprobar el catálogo, precios, tallas reales, claims y tiendas de destino de cada preset. | CSV en draft; después de aprobación Johandry importa los productos y crea colecciones. |
| D-01-N | Aprobar los menús principales/footer, destinos reales y páginas/políticas disponibles. | Tablas de menú preparadas; Shopify no importa estos menús desde CSV. |
| D-01-L | Confirmar idioma/mercado, publicación de español y escala de tallas real por producto. | Propuesta de inglés preparada; no se inventan conversiones ni medidas. |
| D-01 fotos | Aportar/confirmar derechos de uso y selección final de fotografías para Home, PLP, PDP y header. | Listas por hueco preparadas; toda fila sigue pendiente. |
| D-01 QA | Retirar del canal Tienda online los productos/colección QA si una tienda existente se convierte en demo. | No borrar datos ni retirar fixtures del entorno hostil mientras A-01/Gate 5 los necesiten. |
| C-07 | Autorizar fixtures de 1, 250 y 251+ variantes en PDP y featured product. | Pendiente; no crear productos de prueba ni simular datos en tienda. |
| C-03 / R-D | Revisar la propuesta de mejora si alguna celda móvil resulta inferior a 70; Johandry ya definió que ese resultado se informe como riesgo y se propongan mejoras dentro del plan. | La medición queda bloqueada por falta local del paquete Lighthouse 13.4.1; el arnés recibió revisión estática independiente, pero no se ejecutó ni hay resultados para revisar. No hay aprobación de Johandry pendiente para iniciar la lectura. |
| C-04-R | Aprobar la propuesta de versión `1.1.0` y el borrador de `release-notes.md`. | El metadata del tema se conserva en 1.0.0 hasta aprobación. |
| C-04 soporte | Confirmar titularidad, canales de soporte, endpoint/dominio, SLA, URLs y texto utilizable para publicar. | El borrador local aún contiene un endpoint Formspree y un SLA sin aprobación acreditada; no se presenta como listo para publicar ni se cambian sin decisión. |
| C-04-N | Confirmar destinos externos/propiedad de canales y la mención de «Haute Couture» si se amplía copy. | No hay verificación de buzones, dominios o marcas ni mensajes de prueba. |
| C-06 | Aportar un entorno/cuentas válidos para reproducir el contrato de `<shopify-account>`. | Hipótesis pendiente; no cambiar a `.handle` sin reproducción y contrato oficial. |
| D-01 demo | Definir la tienda demo por preset y validar instalación/importación con catálogo y fotos aprobados. | Las previews de `tema-qkqpke0j` son para verificación, no sustituyen la tienda limpia C-02. |
| C-02 password | Decidir el modal/flujo de contraseña de la tienda limpia y proporcionar el acceso necesario. | Preparado; no se publicará ni se cambiará la protección de las previews. |
| Cierre | Ejecutar la revisión final de Antigravity y decidir su aceptación. | Pendiente tras build candidato y R-Demo. |
| PR | Revisar/fusionar el PR de entrega cuando esté listo. | Reservado a Johandry; esta rama no se fusiona. |
| Envío | Presentar el tema a Shopify Theme Store y completar los pasos de Partner Dashboard. | Reservado a Johandry; no se envía ni publica desde esta tarea. |

## Alcance que sí queda preparado

- D-01 entrega `sartorial-products.csv`, `imprint-products.csv`, `archive-products.csv`, fuentes JSON y listas de fotos. Se regeneran con `node scripts/demo-import.mjs build` y se validan con `node scripts/demo-import.mjs check`.
- D-01-N conserva tablas de menús y enlaces sugeridos; D-01-L conserva propuesta y conflictos de idioma/tallas sin presentarlos como datos aprobados.
- El cierre D19 no certifica R-A/R-B completas, R-D/G2 ni R-Demo. Los artefactos de paquete y su SHA se vuelven a verificar tras cambios de C-04-P/C-04-R.
- El reporte actualizado de entrega distinguirá hechos locales, lecturas de tienda, dependencias de Johandry y limitaciones.
