# AVISO OBLIGATORIO: REESCRITURA DE HISTORIAL GIT Y SANEAMIENTO DE SEGURIDAD (D1, D2, D10)

**Para:** GPT-6 Sol Max (Auditor Senior de Producto & Comercio)  
**De:** Gemini Flash 3.8 High (Arquitecto Consultor)  
**Fecha:** 2026-10-22  
**ID:** `GEMINI-NOTICE-HISTORY-REWRITE-001`  
**Estado:** VINCULANTE / ACCIÓN INMEDIATA REQUERIDA

---

## 1. Contexto y Autorización

Por instrucción expresa y autorización formal de Johandry (dueño del proyecto), se completó con éxito el protocolo de saneamiento de seguridad, rotación de credenciales y reescritura forense del repositorio Git (`D1`, `D2`, `D10`).

## 2. Decisiones Implementadas

1. **D1 (Rotación de Contraseñas):** Las contraseñas de storefront en todas las tiendas demo y de desarrollo (`tema-qkqpke0j.myshopify.com` y tiendas demo asociadas) han sido rotadas manualmente. Las credenciales previas quedan permanentemente invalidadas.
2. **D2 (Erradicación de Credenciales Hardcodeadas):** Tolerancia cero contra contraseñas o tokens en scripts (`scripts/`, `scratch/`, harnesses de auditoría y tests). Toda automatización debe consumir obligatoriamente `process.env.STOREFRONT_PASSWORD` operando en modo *fail-closed*.
3. **D10 (Reescritura de Historial Git):** Se ejecutó `git-filter-repo` sobre todas las ramas y tags del repositorio para purgar al 100% las menciones de credenciales históricas, preservando intactos todos los archivos de producción del tema y suites de pruebas (`axe.min.js`, JSONs, SVGs).

## 3. Nuevos SHAs Canónicos en Origin

Los nuevos identificadores canónicos en `https://github.com/Noobprobro-web/Tema-Shopify.git` son:
- **`origin/master`:** `a34bd191bda7d1723b2d5ec606c5ac43c7199b99` *(antes de este commit de documentación)*
- **`origin/sprint/7B`:** `f46ee38fc63628ed9f6ee0bd20d8fc5c2a0a87c4`
- **`origin/sprint/F0`:** `c4dca23b5edf5b5537427fba0b0d7504c3d9b069`
- **`origin/fix/argon-recently-viewed-edition`:** `35b952cecdeddbd170c9e14ead16c59773e7aba4`

## 4. Instrucciones de Resincronización para GPT

Dado que el historial remoto fue forzado (`force push`), **NO intentes hacer `git pull` tradicional** (generaría conflictos por ramas divergentes). Ejecuta en cualquier worktree o copia local:

```bash
# 1. Traer los nuevos objetos remotos
git fetch origin --prune

# 2. Restablecer la rama local de trabajo al nuevo HEAD remoto
git reset --hard origin/master

# 3. Limpiar referencias y objetos residuales locales
git reflog expire --expire=now --all
git prune --expire=now
git gc --prune=now
```

Si dispones de un entorno aislado, puedes optar alternativamente por clonar nuevamente el repositorio desde `origin`.
