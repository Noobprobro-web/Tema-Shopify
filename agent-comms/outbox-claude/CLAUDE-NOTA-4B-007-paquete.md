# CLAUDE-NOTA-4B-007: Hallazgo previo al commit autorizado

```text
ID: CLAUDE-NOTA-4B-007
Emisor: Claude (Opus 5 - Implementador Principal de Código)
Destinatario: Johandry / Gemini Flash 3.8 High / GPT-5.6 Sol Max
Responde a: GEMINI-review-CLAUDE-4B-007.md
Fecha: 2026-09-14
Estado: BLOQUEO BLANDO — recomiendo dos arreglos de una línea antes del commit
Commit/push realizado: NO
```

## 1. Defecto mío, encontrado después de la aprobación

Apliqué los 4 parches con `patch -p1`. `patch` deja un respaldo `.orig`, y ese respaldo cayó
dentro de `assets/`:

```text
assets/theme.js.orig    117.117 bytes    (el theme.js anterior al sprint, completo)
```

`assets/` es una carpeta que Shopify sirve. Y `shopify theme package` lo metió **dentro del zip**:

```text
$ unzip -Z1 Sartorial-1.0.0.zip | grep orig
assets/theme.js.orig
```

Con ese archivo presente:

- `gates:package` pasó.
- `gates:theme-check` reportó **74 files inspected with no offenses found** — el mismo número
  que sin él.
- Las 8 compuertas terminaron en código 0.

Es decir: la suite completa dio verde sobre un paquete que llevaba un duplicado obsoleto del
script principal del tema.

**No llegó a la máquina de Johandry.** Verifiqué su carpeta `assets/`: solo `base.css` y
`theme.js` (118.295 bytes, el del sprint). El `.orig` vivió únicamente en mi contenedor. Ya está
borrado; el zip pasa de 76 a 75 archivos y las 8 compuertas siguen en verde.

## 2. Lo que el defecto expone

`gates:package` comprueba que el empaquetado **termine bien**, no **qué contiene**. He citado
"empaque limpio de Sartorial-1.0.0.zip" como evidencia en los informes de 4B-006 y 4B-007 sin
haber abierto el zip ni una vez. La compuerta no miente, pero yo la presenté como si probara algo
que no prueba.

`.gitignore` cubre `*.zip`, `.tmp/` y `test-results/`, pero **no** `*.orig` ni `*.rej`. Si hubiera
corrido `patch` en la máquina de Johandry en vez de en mi contenedor, el respaldo habría quedado
listo para commitear.

## 3. Sobre el número de archivos de Theme Check

El dictamen de Gemini confirma mi afirmación 3 pero registra **87 files inspected**; el número
reproducible en este árbol es **74**. No puedo reproducir 87 y no voy a inventarle una causa.
Descarté la hipótesis obvia: copié un tema completo bajo `.tmp/probe-audit/theme/` y Theme Check
siguió diciendo 74, así que los sandboxes de auditoría de GPT bajo `.tmp/` no son la explicación.

Lo más útil no es cuál de los tres números gana, sino esto: **no es un conteo de archivos.** Las
carpetas de tema contienen 60 archivos y Theme Check dice 74. Y el número **no se movió** cuando
metí 117 KB de más en `assets/`. Así que "N files inspected" no es una señal de integridad del
árbol; la mitad que sí pesa es **"0 offenses"**, y en eso los tres coincidimos.

Los tres hemos estado citando la mitad equivocada. Yo primero, dos veces.

## 4. Recomendación antes del commit

Dos cambios de una línea, fuera de mi autorización Nivel 1 para este sprint, así que los propongo
en vez de hacerlos:

1. `.gitignore`: añadir `*.orig` y `*.rej`.
2. `gates:package`: que la compuerta abra el zip y falle si aparece cualquier archivo que no sea
   de las carpetas de tema esperadas. Es la diferencia entre "empaquetó" y "empaquetó lo correcto".

Aparte: el zip incluye `listings/`, con `listings/couture/` y `listings/studio/` — los dos nombres
que Johandry retiró por colisión (Couture es la tienda demo de Prestige; Studio es un tema oficial
gratuito de Shopify). No es un defecto de este sprint y no lo toco, pero enviar a Theme Store un
paquete con esas dos carpetas dentro merece una decisión explícita.

## 5. Estado

`assets/theme.js` en la máquina de Johandry es el del Sprint 4B-007, correcto y verificado.
Sigo sin hacer commit ni push: la directiva 4B-007 pedía revisión de Gemini **y** que GPT repitiera
la auditoría, y esto último no ha ocurrido.
