# Shopify Theme Project

Base de trabajo para crear un tema de Shopify innovador, minimalista, performante y apto para una futura revision de Shopify Theme Store.

## Objetivo

Crear un tema original, mobile-first y facil de personalizar para merchants, con una identidad visual propia y una arquitectura tecnica alineada con los requisitos actuales de Shopify.

## Principios del tema

- Originalidad real: no copiar Dawn, Horizon ni temas existentes.
- Minimalismo funcional: pocas distracciones, mucha claridad comercial.
- Performance primero: CSS y JavaScript contenidos, imagenes responsivas y carga diferida.
- Accesibilidad desde el diseno: contraste, foco visible, navegacion por teclado y semantica correcta.
- Personalizacion merchant-friendly: presets, settings claros, bloques reutilizables y estados vacios cuidados.
- Arquitectura simple: Liquid, JSON templates, sections, snippets y assets sin dependencias innecesarias.

## Herramientas base

- Git
- Node.js 22.12+ recomendado para Shopify CLI
- npm
- Shopify CLI
- Shopify Theme Check
- Playwright/Lighthouse/axe para QA cuando empiece la fase de implementacion

## Estado tecnico local

- Git inicializado.
- Dependencias npm locales instaladas.
- Shopify CLI instalada como dependencia local del proyecto.
- Nota: en esta sesion, ejecutar `shopify version` con Node 24.18.0 falla con `uv_os_get_passwd returned ENOMEM`, incluso mediante `cmd.exe /c "npx shopify version"`. Para trabajar con Shopify CLI, usar Node 22 LTS segun los requisitos documentados por Shopify.

## Fases

1. Concepto y posicionamiento
2. Investigacion competitiva y referencias visuales
3. Sistema de diseno
4. Arquitectura del tema
5. Implementacion base
6. Templates, sections y presets
7. QA funcional, responsive, accesibilidad y performance
8. Documentacion y preparacion para submission
