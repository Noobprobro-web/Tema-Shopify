# GPT-AUDIT-003: Presets, experiencia bilingue y roadmap comercial

ID: GPT-AUDIT-003-presets-and-roadmap
Estado: ENTREGADO. APROBACION CONDICIONADA; no certifico aun los tres presets para submission.
Decision requerida: Gemini y Johandry deben aprobar el orden revisado del roadmap y cerrar las cuatro condiciones P0 de demos/localizacion antes de presentar Edition y Archive como presets terminados.
Fecha: 2026-09-21.
Tienda observada: https://tema-qkqpke0j.myshopify.com

Resumen en 5 lineas:
1. Sartorial ya sostiene una identidad premium clara en 1440 px y 390 px; Edition y Archive tienen diferenciacion real en configuracion y plantillas, pero no demos publicas que permitan certificarlos visualmente.
2. Los 15 esquemas revisados superan los umbrales declarados: texto atenuado >= 5.11:1, bordes >= 3.00:1 y botones >= 5.17:1 en la muestra calculada.
3. El selector EN / ES es mejor que un select tradicional cuando existen exactamente dos idiomas, pero cada opcion interactiva mide 28 x 44 px y no cumple el objetivo interno de 44 x 44 px.
4. La ruta `/es` funciona y declara `lang="es"`, aunque la demo queda parcialmente en ingles porque navegacion, anuncios y copy editorial configurado por el merchant no estan traducidos.
5. Apruebo las cinco ideas, pero no el orden: Quick Buy y swatches son P0 comercial; Zoom y mega menu son P1; View Transitions debe quedar como mejora progresiva P2.

Archivos tocados: exclusivamente este informe.
Desviaciones (Nivel 1 o Nivel 2): ninguna implementacion. Edition y Archive no estaban publicados como demos independientes; se auditaron sus configuraciones y `listings/`, pero no se inventa una certificacion visual.
Hallazgos extra fuera de alcance: la demo aun muestra la marca `Tema`, no LINEA NOVE, y la documentacion publica afirma que los presets "solo cambian ajustes", aunque `/listings/` demuestra secuencias distintas. Se incluyen acciones concretas; no se aplicaron parches.
Ledger: esta auditoria no cierra filas. `Presets Diferenciados` debe permanecer en `codigo completo` hasta probar instalacion y demo de los tres presets.

## 1. Dictamen ejecutivo

**La estrategia de tres presets es comercialmente defendible, pero hoy solo Sartorial esta demostrado.** La arquitectura no es un simple cambio de paleta: las portadas, el orden de secciones y parte de PDP/coleccion cambian. Sin embargo, Shopify exige una plantilla unica por preset, paridad entre estado instalado y demo, y al menos una demo por preset. El repositorio cumple la primera parte; la evidencia publica disponible no cumple aun las dos ultimas.

Mi decision por superficie:

| Superficie | Dictamen | Motivo |
| --- | --- | --- |
| Sartorial | APTO como direccion principal | La demo publicada transmite sastreria editorial en ambos anchos y conserva jerarquia comercial. |
| Edition | APTO CONDICIONADO | Sans serif, espaciado mas compacto y narrativa de objetos lo separan de moda; falta verlo con catalogo y fotografia propios. |
| Archive | APTO CONDICIONADO | Paleta, miniaturas, vendor visible y narrativa de procedencia aportan caracter; todavia comparte demasiado ADN calido/serif con Sartorial. |
| Selector EN / ES | APTO CON AJUSTES | Es elegante y rapido para dos idiomas; area tactil y demo parcialmente traducida impiden cerrarlo. |
| Roadmap de lujo | APROBADO CON REORDEN | Cuatro ideas alcanzan paridad competitiva; el morphing no debe desplazar funciones que reducen duda de compra. |

Esto no es una certificacion integral de Theme Store ni una prueba en Safari/iPhone fisico. Se navego la tienda real en Chrome a 1440 x 900 y 390 x 844, se inspecciono el DOM renderizado y se contrastaron datos de presets del repositorio con requisitos y fichas oficiales vigentes.

## 2. Evaluacion de presets

### Sartorial

**Personalidad: clara y vendible.** En la demo real, el hero combina fotografia arquitectonica, serif de alto contraste, copy de movimiento y CTA de 52 px en movil. El H1 renderizo a 75.6 px en escritorio y 46.2 px en movil sin corte horizontal. La secuencia lookbook -> vitrina curatorial -> manifiesto -> Complete the Look da una historia reconocible y no parece una plantilla generica de catalogo.

Riesgo comercial pendiente: el header sigue mostrando `Tema`. Mientras la marca ficticia no sea LINEA NOVE o una marca demo consistente, la calidad del sistema se percibe como un entorno de prueba.

### Edition

**Personalidad: conceptualmente clara, visualmente no certificada.** Usa Assistant tambien en headings, blanco/negro, espaciado de seccion de 56 px y una portada de seis modulos centrada en objetos, sistema y proceso. Su PDP usa galeria `grid`, omite guia de tallas y reduce ruido en recomendaciones. Eso crea un caso de uso distinto para objetos, accesorios y diseno contemporaneo.

El riesgo es caer en "minimalismo blanco generico" si fotografia, microcopy y composicion no son extraordinarios. Necesita demo propia en escritorio y movil con objetos reales, escalas variadas y productos sin modelo humano. La configuracion sola no prueba personalidad.

### Archive

**Personalidad: prometedora, pero es la pareja mas dificil de separar.** La paleta oliva/cuero, heading al 110%, galeria PDP con miniaturas, vendor visible, manifiesto de procedencia y lookbook de archivo son decisiones coherentes. La portada de siete modulos cambia el relato hacia catalogo, fabricante y registro.

Su problema no es accesibilidad; es distancia de marca. Sartorial y Archive comparten serif, calor material, 72 px de ritmo y recursos editoriales similares. La demo de Archive debe exagerar su lenguaje propio: metadatos de procedencia, numeracion, cronologia, pies documentales, composicion mas densa y fotografia de archivo. Si solo cambia marron por alabastro, el comprador lo leera como un skin.

### Evidencia de diferenciacion estructural

- `listings/sartorial/templates/index.json:134` usa ocho secciones e incluye marquee, lookbook, capsule y bento.
- `listings/edition/templates/index.json:101` usa seis secciones y una narrativa de objetos sin marquee ni lookbook.
- `listings/archive/templates/index.json:115` usa siete secciones con manifiesto, marquee, lookbook y catalogo de procedencia.
- Sartorial agrega `size_guide`; Edition mantiene galeria `grid`; Archive cambia a `thumbnails`, muestra vendor e imagen secundaria en recomendaciones.
- Sartorial y Archive intercalan promotion tiles distintos en coleccion; Edition conserva un catalogo mas limpio.

Por ello, **si hay tres demos bien curadas, la diferenciacion es defendible**. No acepto, en cambio, la frase publica de `/pages/documentation` que dice que cada preset "changes theme settings only". Es falsa respecto del paquete y debilita el argumento comercial. Debe explicar que tambien cambian plantillas, secuencias y merchandising inicial.

### Contraste calculado

Se calcularon ratios sRGB desde `config/settings_data.json`, componiendo el texto atenuado al 78% sobre el fondo solido. Todos los gradientes de esos esquemas estan vacios. Esto valida tokens, no texto sobre fotografia ni estados interactivos completos.

| Preset | Texto primario minimo | Texto atenuado minimo | Borde minimo | Boton minimo |
| --- | ---: | ---: | ---: | ---: |
| Sartorial | 7.92:1 | 5.11:1 | 3.03:1 | 7.92:1 |
| Edition | 11.14:1 | 7.44:1 | 3.00:1 | 11.14:1 |
| Archive | 7.58:1 | 5.35:1 | 3.44:1 | 5.17:1 |

Archive `scheme-4` queda confirmado en **7.58:1 para texto primario, 5.35:1 para texto atenuado y 4.53:1 para borde** sobre `#6E482F`.

## 3. Experiencia bilingue y selector

### Lo que funciona

- El clic en `ES` navego de `/` a `/es` y el documento paso a `lang="es"`.
- Los enlaces internos observados adoptaron el prefijo `/es`.
- El control usa un grupo accesible `Language` / `Idioma`; el idioma alternativo expone un nombre accesible completo.
- En escritorio ocupa poco espacio y no compite con busqueda, cuenta o carrito.
- En movil vive dentro del drawer y no satura el header de 390 px.

Para **exactamente dos idiomas**, `EN / ES` es mejor que un `<select>` visible: reduce un clic, mantiene la estetica y hace la alternativa inmediatamente legible. No recomiendo volver al formulario tradicional solo por tradicion.

### Lo que impide considerarlo terminado

1. **Area tactil:** el boton alternativo mide 28 x 44 px tanto en header como en menu movil. Puede superar el minimo AA de 24 px bajo ciertas condiciones, pero incumple el criterio interno vinculante de este proyecto: 44 x 44 px.
2. **Estado actual debil:** el idioma activo aparece como texto `EN` o `ES`, sin nombre completo ni estado actual explicito para tecnologia asistiva. Debe anunciar, por ejemplo, `Espanol, idioma actual`.
3. **Localizacion parcial:** al activar espanol, `Saltar al contenido`, estados, precios y controles cambian; `HOME`, `CATALOG`, el anuncio, hero, manifiesto, tabs y gran parte de la documentacion permanecen en ingles. Son contenidos/navigation del merchant, no una falla de paridad de `locales/es.json`, pero la experiencia final sigue siendo mixta.
4. **Escalabilidad:** el patron es excelente para dos idiomas y malo para cuatro o seis. Debe mutar a disclosure/select cuando `available_languages.size > 2`, o documentar formalmente su limite.

Recomendacion: conservar la expresion visual `EN / ES`, ampliar cada hitbox a 44 x 44 px, marcar el idioma actual semanticamente y completar las traducciones del contenido de la demo desde Shopify. No usar banderas.

## 4. Segunda opinion sobre el roadmap de $380

### Benchmark real

Las fichas oficiales consultadas hoy muestran:

| Tema | Precio | Prueba social | Funciones relevantes anunciadas |
| --- | ---: | ---: | --- |
| [Prestige](https://themes.shopify.com/themes/prestige/presets/prestige) | $400 | 91%, 866 reviews | Quick buy, zoom, swatches, swatch filters, mega menu, recently viewed, quick view. |
| [Focal](https://themes.shopify.com/themes/focal/presets/focal) | $320 | 93%, 335 reviews | Quick buy, zoom, swatches, swatch filters, mega menu, recently viewed, shipping/delivery. |
| [Impulse](https://themes.shopify.com/themes/impulse/presets/impulse) | $500 | 94%, 1301 reviews | Quick buy, zoom, swatches, mega menu, recently viewed, stock counter, shipping/delivery. |

Conclusion incomoda pero necesaria: **Quick Buy, zoom, swatches y mega menu no convierten a Sartorial en lider; corrigen una desventaja de paridad.** El liderazgo debe venir de la ejecucion, del lookbook/capsule merchandising y de la confianza operativa.

### Orden recomendado

1. **Quick Buy con selector de talla y variante. P0.** Es la mejora mas cercana a conversion y elimina el viaje innecesario al PDP. Debe manejar agotados, selling plans, gift cards, errores de red, opciones complejas y fallback al PDP.
2. **Swatches nativos en cards y filtros. P0.** Deben cambiar imagen/precio/disponibilidad sin confundir la variante seleccionada, funcionar por teclado y mostrar agotados. Conviene entregarlos junto con Quick Buy porque comparten estado de variante.
3. **Galeria inmersiva y Zoom de tejido. P1.** En lujo reduce duda sobre material. Debe incluir pinch, doble toque, teclado, Escape, foco, imagen de alta resolucion bajo demanda y no descargar todo al inicio.
4. **Mega menu editorial. P1.** Tiene valor para catalogos medianos/grandes y refuerza marca. Debe ser opcional, soportar menus vacios/largos, imagen ausente y traducciones extensas.
5. **View Transitions tarjeta -> PDP. P2, despues de Gate final.** Puede dar firma visual, pero no compensa una talla dudosa, una entrega incierta ni una demo incompleta. Debe ser mejora progresiva, respetar `prefers-reduced-motion`, conservar foco/historial/scroll y no interceptar navegacion esencial.

### Elementos indispensables que faltan en la prioridad

**A. Capa de confianza de compra.** Hacer visible cerca del CTA stock real, guia/model fit, entrega/devolucion y pickup aplicables a la variante. Parte existe en el tema; el trabajo pendiente es convertirlo en una composicion compacta y demostrable, no agregar mas acordeones por agregar.

**B. Recently viewed.** Los tres competidores lo anuncian. Para un catalogo premium reduce perdida de contexto y es mas valioso que el morphing. Debe ser privado, ligero y con fallback vacio limpio.

**C. Demos y soporte como producto.** Prestige, Focal e Impulse no venden solo componentes: venden cientos de reviews, estabilidad, documentacion y soporte. Un tema nuevo a $380 necesita tres demos impecables, onboarding claro, calendario de actualizaciones y SLA creible. Ninguna animacion sustituye esa confianza.

**D. Catalogo hostil en cada nueva funcion.** Quick Buy, swatches, zoom y mega menu deben probarse con 1/50 variantes, agotados, sin imagen, titulos de 150 caracteres, tres idiomas, red lenta y tap repetido. Ese blindaje es parte del valor de $380.

Mi posicion final: conservar las cinco ideas, pero mover View Transitions fuera del camino critico e insertar `Recently viewed + capa de confianza` antes de declararse lider. Complete the Look y Lookbook deben seguir siendo los titulares diferenciales; son mas memorables que una transicion y estan mas cerca de elevar AOV.

## 5. Condiciones P0 antes de submission

1. Publicar y auditar una demo real por preset, con industria, catalogo y fotografia propios; recorrer cada una a 1440 px y 390 px.
2. Instalar cada preset desde el ZIP limpio y comparar su estado inicial con su demo, incluyendo portada, coleccion, PDP, tipografia y color.
3. Traducir por completo al espanol el contenido de la demo que se anuncia bilingue y sustituir la marca generica `Tema` por la identidad demo aprobada.
4. Corregir la documentacion para reflejar las plantillas diferenciadas y ampliar los hit targets EN / ES a 44 x 44 px.

Shopify exige un set de templates unico por preset, paridad con la demo y al menos una demo por preset: [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements). El repositorio ya tiene los sets; falta demostrar el resultado publicado.

## 6. Verificacion realizada

| Evidencia | Resultado | Demuestra | No demuestra |
| --- | --- | --- | --- |
| Navegador real, 1440 x 900 y 390 x 844 | PASS para Sartorial | Jerarquia, responsive y selector publicado | Edition/Archive, Safari, rendimiento o checkout final |
| Cambio `ES` desde header | `/es`, `html[lang=es]` | El formulario/localizacion opera | Traduccion completa de contenido merchant |
| DOM y bounding boxes | Boton alternativo 28 x 44 px | Incumplimiento del target interno 44 x 44 | Auditoria WCAG completa |
| `node -e` sobre `settings_data.json` | Ratios de tabla | Contraste matematico de colores solidos | Texto sobre imagen, hover, focus o gradientes futuros |
| Diff de nueve archivos en `/listings/` | Secuencias y ajustes diferentes | No son solo recolores | Paridad de instalacion ni calidad visual publicada |
| Fichas oficiales de competidores | Precios/features/reviews de hoy | Paridad comercial anunciada | Calidad comparativa medida de sus demos |

No se ejecuto Theme Check, Lighthouse, lector de pantalla, Safari, red degradada ni instalacion limpia del ZIP porque no eran el objeto de esta opinion y no deben inferirse de la inspeccion realizada.

## 7. Afirmaciones falsables

1. La demo publica observada solo permite experimentar Sartorial; no expone demos independientes de Edition y Archive.
2. Sartorial renderiza su H1 a 75.6 px en 1440 px y 46.2 px en 390 px; el CTA principal movil mide 288 x 52 px.
3. El selector cambia a `/es` y establece `lang="es"`, pero su boton alternativo mide 28 x 44 px.
4. Tras el cambio a espanol, controles del tema se traducen mientras navegacion, anuncio y copy editorial permanecen mayoritariamente en ingles.
5. Los tres presets contienen cinco esquemas y sus minimos calculados aparecen en la tabla de contraste.
6. Los `index.json` de Sartorial, Edition y Archive contienen 8, 6 y 7 secciones respectivamente.
7. La documentacion publica afirma que los presets cambian solo ajustes, en contradiccion con las plantillas diferenciadas de `/listings/`.
8. Prestige, Focal e Impulse anuncian Quick Buy, image zoom, color swatches y mega menu; esas cuatro funciones son paridad, no una ventaja exclusiva.
9. Shopify exige al menos una demo por preset y que el estado instalado refleje esa demo.

## Conclusion

**Si se publicaran hoy solo con la evidencia actual, mantendria Sartorial y retrasaria la inclusion comercial de Edition y Archive.** No porque sus conceptos sean debiles, sino porque un preset no existe comercialmente hasta que un comprador puede verlo, instalarlo y reconocerlo sin explicacion.

Con tres demos independientes, traduccion completa, selector corregido y el roadmap reordenado hacia Quick Buy -> swatches -> zoom -> mega menu -> confianza/recently viewed, Sartorial puede defender $380. View Transitions debe rematar el producto; no cargar con la promesa de justificarlo.
