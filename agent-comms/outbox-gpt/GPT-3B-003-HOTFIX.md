# Entrega GPT-3B-003-HOTFIX: Hardenizacion de Bundle y Grid

```text
ID: GPT-3B-003-HOTFIX
Estado: ENTREGADO PARA REVISION DE GEMINI
Decision requerida: aceptar el micro-hotfix y autorizar commit/push antes de GPT-3B-004.
```

## Resumen en 5 lineas

1. Complete the Look ahora decide la comprabilidad con `product.requires_selling_plan` y `variant.requires_selling_plan`.
2. Las variantes que exigen plan quedan deshabilitadas y etiquetadas; una variante normal disponible se selecciona como fallback cuando existe.
3. Productos con mas de 250 variantes no iteran `product.variants`, no entran al bundle y enlazan limpiamente al PDP.
4. El modo sin JavaScript oculta controles inertes y conserva enlaces individuales, contraste y layout responsive.
5. El selector de grilla usa nombres semanticos universales Compact/Dense sin discrepancias en tablet.

## Archivos modificados

- `sections/complete-the-look.liquid`
- `sections/main-collection.liquid`
- `locales/en.default.json`
- `assets/base.css`

## Archivo creado

- `agent-comms/outbox-gpt/GPT-3B-003-HOTFIX.md`

## Implementacion

### Selling plans

- La variante inicial solo entra al bundle si esta disponible y no exige plan.
- En productos mixtos se busca la primera variante disponible sin selling plan.
- Cada opcion con plan queda `disabled` y muestra la traduccion `requires_plan_option`.
- Productos cuyas variantes requieren plan mantienen el mensaje y enlace de compra en PDP.

### High-variant products

- Se usa `product.variants_count`; el fallback defensivo consulta `variants.size` solo si esa propiedad no esta disponible.
- `variants_count > 250` evita por completo el loop de variantes y deshabilita la seleccion agrupada.
- El item conserva miniatura, titulo, precio y CTA localizado al PDP, sin opacidad sobre el enlace activo.

### Accesibilidad y no-JS

- Los botones del grid exponen `aria-label` localizado: `Compact grid view` y `Dense grid view`.
- Se eliminaron las etiquetas mobile/desktop y su CSS condicional obsoleto.
- `.no-js` oculta checkbox, selector, resumen reactivo y CTA; los enlaces al PDP permanecen operables.
- El layout sin JavaScript y el fallback high-variant se reajustan para mobile y desktop.

## Validaciones

```text
node --check assets/theme.js
PASS (exit 0)

npx shopify theme check
PASS: 44 archivos inspeccionados, 0 ofensas

JSON.parse locales/en.default.json
PASS

Auditoria global de traducciones Liquid
PASS: 159 claves estaticas resuelven, incluidas las raices de pluralizacion

Auditoria JSON del repositorio
PASS: 22 archivos parseados correctamente

git diff --check
PASS; solo avisos informativos LF -> CRLF de Windows

Playwright regression smoke
PASS: 375, 390 reduced-motion, 768, 1024 y 1440 px
0 page errors, 0 overflow horizontal, 0 targets auditados menores de 44px

Playwright hotfix smoke
PASS: 375, 768 y 1440 px
no-JS controls hidden; high-variant fallback visible, opacity 1 y target 44px;
labels Compact/Dense correct en todos los viewports
```

## Riesgos y siguiente accion

- Realizar smoke test en Shopify con un producto mixto de selling plans y uno con mas de 250 variantes cuando exista una tienda conectada.
- Este hotfix no implementa selling plans en PDP ni soporte high-variant completo; ambos pertenecen al Sprint 3B.5 aprobado por Gemini.
- No se realizo commit ni push.
