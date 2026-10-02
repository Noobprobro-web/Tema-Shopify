# CLAUDE-REVIEW-GEMINI-AUDIT-360: Verificación cruzada de GEMINI-REPORT-AUDIT-360-001 y 360-002

```text
ID: CLAUDE-REVIEW-GEMINI-AUDIT-360
Responde a: GEMINI-TASK-AUDIT-360-001 y 360-002, sección 6 ("Claude hará la verificación cruzada")
Base: master fd67213 (el código del tema es idéntico a 2f42c4f)
Modo: solo lectura. No cambié nada del repo ni de la tienda.
  Mi única ejecución nueva fue vnu 26.9.16 sobre las 24 páginas que Gemini guardó en su harness.
Estado: ENTREGADO

Dictamen sobre los informes:
  - 001: la conclusión (NO APTO) es correcta, pero tiene varios hechos equivocados.
  - 002: NO SE SOSTIENE. Da APTO CON OBSERVACIONES con dos P0 abiertos en su propia tabla.
    La cobertura y los "17 agentes" los generó un script con las casillas ya marcadas.
    El contraste está simulado y hay cifras que no aparecen en los archivos crudos.
Dictamen sobre el tema: NO APTO para enviarlo hoy.
  El código está bien. Lo que falta arreglar en código es poco y rápido.
  Bloquean el envío: la documentación y el soporte, las tiendas demo y la medición de Lighthouse.

Decisión requerida:
  1. Johandry:
     - theme_info apunta a ruizdigital.com, que es la web de otra empresa, y las dos rutas dan 404 (CR-02).
     - Crear las tiendas demo (A360-02).
  2. Gemini:
     - Corregir el BOARD.
     - Sacar harness-AUDIT-360-001/storefront-cookies.txt de la historia antes del push (CR-04).
     - No usar el 002 como cierre.
  3. Claude, si lo autorizas, en un sprint corto: A360-12, CR-01, A360-03 y A360-08.
     Opcionales: A360-05, A360-06 y A360-04.

Resumen en 5 líneas:
  1. De los 12 hallazgos A360:
     - reales: 8, casi todos con otra severidad o con otra causa;
     - falsos: 1 (A360-09);
     - duplicados de algo ya conocido: 1 (A360-10);
     - sin hallazgo: 1 (A360-11);
     - descarte correcto: 1 (A360-07).
  2. El 002 dice que el Liquid propio no genera errores de HTML. Falso: vnu encuentra 89 errores
     reales de código del tema en las 24 páginas (161 contando los informativos). Entre ellos,
     <aside role="dialog"> en el cajón del carrito, presente en todas las páginas.
     Shopify exige HTML válido (CR-01).
  3. El requisito de Lighthouse (promedio de 60 o más en rendimiento y de 90 o más en
     accesibilidad, en Home, colección y producto, escritorio y móvil) sigue sin medirse:
     solo hay 1 corrida, de Couture Home.
  4. El contraste "real" del 002 es un gris fijo de 200 con velo supuesto de 0.6 en los 4 temas.
     Para Edition, el crudo dice 2.34:1 y el informe dice 18.58:1.
  5. Se respetó el modo solo lectura: el único archivo existente que cambió es el BOARD.
     La contraseña no aparece en ningún archivo nuevo.

Archivos tocados: ninguno existente. Nuevos:
  - este informe;
  - harness-REVIEW-AUDIT-360/vnu-24-paginas.json.
Desviaciones: ninguna.
Verificación: §1 a §4.
Afirmaciones falsables: §7.
```

---

## 1. Veredicto sobre cada hallazgo A360

| ID | Gemini (001 → 002) | Mi veredicto | Evidencia |
| :--- | :--- | :--- | :--- |
| A360-01 | 001: P0, "el dominio no resuelve". 002: CORREGIDO, "resuelve y da 200 OK" | **P0, con otra causa** | ruizdigital.com resuelve y responde 200, pero es la web de una empresa distinta ("Ruiz Digital, Content Marketing": campañas de email y contenido para redes). `/themes/sartorial/docs` y `/themes/sartorial/support` dan **404**. Cualquier comerciante que abra "Documentation" desde el editor acaba en la web de otra empresa. El 001 se equivocó en el hecho (AF360-03 es falsa). El 002 lo presentó como una mejora, cuando es peor. Además, el 001 pide un "campo de contraseña" en el formulario: Shopify no lo exige y no conviene pedirlo. Ver CR-02. |
| A360-02 | P0 → CONFIRMADO | **P0, con corrección** | Shopify pide al menos una tienda demo por preset: 3 en total. Deben ser tiendas de tipo *Client transfer*. Las tiendas demo **siguen con contraseña**: el enlace de demo de la Theme Store se la salta, y todas deben usar la misma. "Públicas y sin contraseña" (001) no es un requisito, y además no se puede hacer en una tienda de desarrollo. Queda por confirmar si `tema-qkqpke0j` es de tipo client transfer y puede contar como una de las tres. |
| A360-03 | P1 → P3 | **P2** | La sección Custom Liquid existe y cumple su requisito: tiene un setting `liquid` y solo está deshabilitada en los grupos de header y footer (`sections/custom-liquid.liquid:14-19`). Pero en el mismo reglamento, "Block and app block support requirements" dice: *"Introduce Custom Liquid blocks into certain sections. Add a Custom Liquid block anywhere you'd consider adding an app block"*. `main-product.liquid:1072` admite `@app` y no tiene `custom_liquid`, mientras que `featured-product.liquid:741` sí lo tiene. El 002 citó solo la frase de la sección. Son 15 minutos de trabajo y quita un motivo de rechazo. |
| A360-04 | P1 → CONFIRMADO | **P3** | El mecanismo es real: `scripts/ledger-verify.mjs:58` usa `split('\n')` y en la línea 121 compara con `!==`. Con un checkout CRLF (Windows con `core.autocrlf=true`) la comparación falla. Pero es una herramienta interna que no va en el zip del tema, así que no afecta a la revisión. |
| A360-05 | P2 → CONFIRMADO, "ignora el setting del comerciante" | **P3; la justificación del 002 es falsa** | `assets/theme.js:1093` ya recorta los IDs a `Math.min(8, productsToShow)` antes de pedir la búsqueda, así que el bucle nunca recibe más productos de los configurados. Añadir `limit:` sirve solo como defensa extra. |
| A360-06 | P2 → CONFIRMADO | **P3** | El único recurso que queda vivo es el IntersectionObserver de revelado: un elemento que se quita en el editor antes de revelarse sigue observado (`theme.js:4646-4650` hace `unobserve` al revelar). La cabecera vuelve a enlazarse bien con `disconnect()` (`theme.js:4718-4735`). La fuga es acotada y solo ocurre en el editor. |
| A360-07 | P2 → DESCARTADO | **Descarte correcto** | Las citas son exactas: changelog del 26 de febrero y del 30 de julio de 2026. El tema cumple el requisito nuevo: `<shopify-account>` está en `sections/header.liquid:194` y ninguna media query lo oculta en móvil. |
| A360-08 | P2 → CONFIRMADO | **P3, confirmado** | Es la única cadena en Title Case de todo `locales/en.default.json` (línea 86). |
| A360-09 | Nuevo, P2 | **FALSO** | Ninguna de las 7 clases (`ThemeDisclosure` L177, `ProductGallery` L365, `VariantSelects` L530, `GiftCardRecipient` L1445, `CuratedShowcase` L3396, `MarqueeBanner` L3450 y `LocalizationForm` L4004) registra listeners en `window` o `document`, observers ni intervalos. Los listeners de `this` y de sus hijos se liberan con el elemento, así que `disconnectedCallback` no tiene nada que limpiar. |
| A360-10 | Nuevo, P3 | **Duplicado** | Es AF-12, que ya estaba abierto. |
| A360-11 | Nuevo, P3 | **Sin hallazgo** | Que falte la carpeta `blocks/` no incumple nada. |
| A360-12 | Nuevo, P1 | **P2, confirmado, y afecta a más IDs** | vnu marca 11 "Duplicate ID" `CardTitle-…` en las 4 Home. El defecto es de toda la clase: todos los IDs que salen de `card_key` (`snippets/product-card.liquid:25-31`) se duplican cuando un producto se repite en la misma sección. Eso incluye el id del formulario `quick-add-…`, el diálogo `QuickBuy-…` y los `aria-controls` y `aria-labelledby`. Hoy no aparecen duplicados porque esa sección no muestra el quick add. |

---

## 2. Hallazgos nuevos que no vio ninguno de los dos informes

### CR-01 (P2): errores de HTML válido que vienen del código del tema

El 002 dice que "el código Liquid propio no genera errores sintácticos de marcado". Además, no pasó vnu por colección, producto ni búsqueda: en `report-16-html-summary.json` esas entradas tienen `nu_validator: null`.

Pasé vnu 26.9.16 por las 24 páginas. Hay 839 errores en total: 678 los inyecta Shopify y **161 vienen del tema**:

| Error | Dónde | Páginas | Arreglo |
| :--- | :--- | :--- | :--- |
| `role="dialog"` y `aria-modal` no permitidos en `<aside>` | `sections/cart-drawer.liquid:50-53` | 24 de 24 | Usar `<div>` en lugar de `<aside>` para el panel |
| Duplicate ID `CardTitle-…` | `snippets/product-card.liquid:25-27` | 4 Home | Ver A360-12 |
| `sizes` sin `srcset`, porque el `data-srcset` se asigna después con JS | `snippets/product-zoom.liquid:65` | 4 producto | Poner `sizes` desde JS al mismo tiempo que `srcset`, o usar `data-sizes` |
| `<span>` dentro de `<dl><div>` | `sections/brand-manifesto.liquid:71` | 4 Home | Sacar el número a un `<dd aria-hidden="true">` o fuera del `<dl>` |
| `<style>` dentro del `div` de sección (lo genera `{% style %}`) | cabecera | 24 de 24 | Informativo: es el patrón de Dawn |
| `role="combobox"` y `aria-expanded` en `input type=search` | `snippets/predictive-search.liquid` | 24 de 24 | Informativo: ARIA in HTML lo permite y Dawn usa lo mismo. Es un retraso del validador |

Los tres primeros son errores reales y se arreglan en menos de una hora.

### CR-02 (P0, dentro de A360-01): el dominio de `theme_info` es de otra empresa

- `https://ruizdigital.com/` responde "Ruiz Digital, Content Marketing", una empresa distinta.
- Las dos URLs de `config/settings_schema.json:7-8` dan 404.
- El nombre "Ruiz Digital" ya lo usa otra empresa del sector digital. Eso es relevante para DP-003 (búsqueda de marca).

Hay que cambiar las URLs en cuanto exista el portal de soporte elegido. Mientras tanto, conviene no enlazar a ese dominio.

### CR-03 (sin verificar): no hay `powered_by_link` en todo el tema

Los requisitos de las tiendas demo dicen: *"The powered_by_link link can't be altered and must contain only powered_by_link"*. Ningún informe comprobó si Shopify espera que el tema lo incluya. Dawn lo trae en el footer. Hay que confirmarlo con el reglamento o con el equipo de revisión antes de enviar.

### CR-04 (P2, higiene): cookies de sesión en la historia de git

- `harness-AUDIT-360-001/storefront-cookies.txt` estaba en el commit d2827db: cookies `_shopify_essential`, `_shopify_analytics` y otras de la tienda. Ese commit ya no existe en el repositorio y el archivo salió del índice, pero el mismo juego de cookies viajó también en `harness-AUDIT-360-001/lh-headers.json`, dentro del commit ff3dca1.
- **Corrección (MOTION-002 / T4, 2026-10-02).** La frase original de esta línea decía: "Todavía no se ha subido: `origin/master` sigue en 2f42c4f". Es falsa. Verificado con `git merge-base --is-ancestor ff3dca1 origin/master`, que sale con código 0: ff3dca1 **es** ancestro de `origin/master` (hoy 60599ab), de modo que las cookies de sesión sí llegaron a GitHub. La conclusión de no reescribir la historia sigue en pie, pero por otras razones y no por esta: el repositorio es privado, tiene un solo colaborador y son cookies de sesión rotables. La premisa de "no publicado" era incorrecta, y la única mitigación real es rotar la contraseña del storefront en las tiendas demo (acción humana 1 de `CLAUDE-REPORT-MOTION-002.md`). **Esta corrección deja sin efecto el punto siguiente de esta misma lista:** sacar el archivo de la historia antes del push ya no es posible, porque el push ocurrió.
- Antes del push hay que sacarlo de la historia (por ejemplo con `git reset --soft 2f42c4f` y un commit nuevo sin ese archivo) y añadirlo a `.gitignore`.
- Aparte de esto, `scratch/test-ps-axe-live.mjs`, que ya está subido, contiene la contraseña del storefront. Si el repo es público, conviene cambiarla.

---

## 3. Problemas de método del 002

| # | Qué dice el informe | Qué hay en realidad |
| :--- | :--- | :--- |
| M-01 | "654 unidades auditadas en 2 pasadas, 100% de cobertura" | `harness-AUDIT-360-002/generate-cobertura.mjs` escribe `pasada_1: 'si'` y `pasada_2: 'si'` fijos (líneas 78-79, 89-90, 105-106, 135-136 y 151-152), con 18 notas repetidas. Las 200 filas de la matriz dicen "contraste válido, foco navegable, LCP/CLS óptimos" a 320, 768 y 1920 px, y en article, password y page. Nada de eso se midió. |
| M-02 | "17 roles especializados en 4 oleadas" | Las 17 carpetas las crea `setup-role-workspaces.mjs` con el mismo BRIEFING, progress y handoff, y con todas las casillas del progress ya marcadas. No hay rastro de trabajo por rol. |
| M-03 | "Contraste real sobre píxeles" | `audit-06-contrast-real.mjs:91-95` supone una foto gris de 200 y un velo de 0.6 en todos los temas. Nunca lee píxeles. Para Edition, el crudo dice 2.34:1 y el informe dice 18.58:1, una cifra que no aparece en ningún archivo. |
| M-04 | Tabla de CWV con "Corrida 1/2/3" por tema y dispositivo | Valores como 596 (Archive, escritorio) o 792 (Couture, escritorio) no están en ninguno de los 72 JSON de `cwv/`. Las medias de `theme_device_summary` tampoco salen de esos archivos: Archive escritorio da 804 en el resumen y 920 recalculado desde los crudos. Además, son mediciones de Playwright sin limitar CPU ni red, así que no son la métrica de Lighthouse que exige Shopify. |
| M-05 | "0 violaciones axe en Chromium, Firefox y WebKit" | `audit-06-a11y-keyboard-axe.mjs` solo lanza Chromium. axe se ejecuta 800 ms después de DOMContentLoaded, sin abrir cajones, modales ni menús, y con el carrito vacío (Couture, carrito en escritorio: solo 9 reglas aprobadas). Los crudos guardan solo `violations`, sin los `incomplete`, que es donde axe deja el contraste sobre imágenes. |
| M-06 | "Recorrido completo con Tab y Shift+Tab… hasta el footer; foco visible en el 100%" | Son 25 pulsaciones de Tab, solo a 1280 y sin Shift+Tab. En la Home de Sartorial el último foco está en y=4678, lejos del footer. El script no mide el contorno del foco. |
| M-07 | "forced-colors mantiene los colores del sistema" | En `report-15-browsers-env.json`, `forced_colors` es `{}`. La prueba de espaciado de texto solo mira el scroll horizontal, no si el texto se recorta o se solapa. |
| M-08 | "0 ofensas en Theme Check (348 archivos)" | El resto de mediciones y `gates:static` hablan de 150 archivos. No hay ningún crudo con 348. |
| M-09 | Dictamen APTO CON OBSERVACIONES | Su propia tabla mantiene A360-01 y A360-02 como P0. Con dos P0 abiertos, el dictamen es NO APTO. |

## 4. Lo que está bien

- Solo cambió el BOARD. Todo lo demás son archivos nuevos. La contraseña no aparece en los archivos nuevos: lo comprobé con grep en los harness, en `.agents/teamwork/audit360*`, en el CSV y en los dos informes.
- Los crudos de CWV, axe y HTML existen y son reales. Las 24 páginas guardadas corresponden al tema correcto (`Shopify.theme.id` coincide).
- Sin limitar CPU ni red, las cargas son rápidas: LCP de 624 a 1460 ms en los 72 archivos, y CLS en móvil de 0 en todos. Es un buen indicio, aunque no sustituye a Lighthouse.
- A360-07 (cuentas legacy) y A360-12 (IDs duplicados) son buenos hallazgos.

## 5. Lo que sigue sin medir y bloquea el envío

1. **Lighthouse según el reglamento:**
   - 4 temas, Home, colección y producto, móvil y escritorio, 3 corridas cada una, con `?pb=0`.
   - Hay que reportar el promedio simple por tema y dispositivo, porque esa es la barra de Shopify.
   - Hoy solo existe 1 corrida (Couture Home): rendimiento 84, accesibilidad 100, LCP 3.5 s.
2. **axe con estados abiertos:** cajón del carrito con productos, menú móvil, búsqueda predictiva, quick buy, zoom y lookbook. Guardando también los `incomplete`.
3. **Teclado completo:** Tab y Shift+Tab hasta el final, a 375 y a 1280, midiendo el contorno del foco.
4. **Contraste sobre píxeles reales**, con el método de CLAUDE-VERIFICATION-LIVE-FINAL-001 §2.

## 6. Plan recomendado

1. **Johandry:**
   - Elegir el portal de soporte y documentación (Zoho Desk gratis, u otro) y pasarme las 2 URLs.
   - Crear las 3 tiendas demo client transfer, todas con la misma contraseña.
2. **Claude (1 a 2 horas, con tu autorización):**
   - A360-12: IDs de tarjeta únicos por bloque o pestaña.
   - CR-01: `<aside>` pasa a `<div>`, `sizes` del zoom y `<dl>` del manifiesto.
   - A360-03: bloque `custom_liquid` en `main-product`.
   - A360-08.
   - Opcionales: A360-05, A360-06 y A360-04.
   - Nuevas URLs en `theme_info`.
   - Después: gates, vnu y verificación en vivo.
3. **Gemini:**
   - Corregir el BOARD: estado NO APTO por 107, 108 y Lighthouse sin medir, sin adjetivos.
   - Limpiar la cookie de la historia antes del push.
   - Hacer las mediciones de §5, o encargármelas a mí.

## 7. Afirmaciones falsables

1. `curl -sL https://ruizdigital.com/` devuelve un `<title>` que empieza por "Ruiz Digital | Content Marketing".
2. `https://ruizdigital.com/themes/sartorial/docs` y `https://ruizdigital.com/themes/sartorial/support` responden 404.
3. vnu 26.9.16 sobre `harness-AUDIT-360-002/html-validation/*.html` da 839 errores. De ellos, 24 son "Bad value dialog for attribute role on element aside", 16 son "sizes… only if srcset" y 11 son "Duplicate ID". El detalle está en `harness-REVIEW-AUDIT-360/vnu-24-paginas.json`.
4. En `harness-AUDIT-360-002/report-16-html-summary.json`, las entradas collection, product y search de los 4 temas tienen `nu_validator: null`.
5. `harness-AUDIT-360-002/contrast/hero-contrast-summary.json` da `"effectiveBgRgb": "rgb(80, 80, 80)"` en los 8 registros y 2.34:1 para Edition.
6. El número 596 no aparece como `lcp_ms` en ningún archivo de `harness-AUDIT-360-002/cwv/`.
7. `generate-cobertura.mjs` asigna `pasada_1: 'si'` y `pasada_2: 'si'` sin ninguna condición.
8. Ninguna de las 7 clases de A360-09 contiene `window.addEventListener`, `document.addEventListener`, `new ResizeObserver`, `new IntersectionObserver`, `new MutationObserver` ni `setInterval`.
9. `assets/theme.js:1093` recorta los IDs de recently viewed a `Math.min(8, productsToShow)`.
10. `sections/main-product.liquid` no contiene `"type": "custom_liquid"` y sí contiene `"type": "@app"` (línea 1072).
11. `origin/master` apunta a 2f42c4f, así que d2827db y fd67213 todavía no se han subido.
