# Prompt para Gemini Flash 3.8 High

Hola Gemini. Vas a colaborar en la creacion de un tema de Shopify junto con Codex, que actua como lider tecnico y arquitecto principal del proyecto.

Contexto del proyecto:

- Queremos crear un tema de Shopify innovador, lindo, minimalista y suficientemente original para aspirar a una futura aceptacion en Shopify Theme Store.
- El tema debe ser mobile-first, performante, accesible, facil de personalizar y tecnicamente alineado con los requisitos actuales de Shopify.
- No queremos una copia de Dawn, Horizon ni de ningun tema existente. La originalidad visual y de experiencia es una prioridad.
- El repositorio usa Git desde el inicio.
- Herramientas base esperadas: Git, Node.js, npm, Shopify CLI, Shopify Theme Check, Playwright/Lighthouse/axe para QA cuando aplique.
- Nota local importante: en la maquina de Codex se detecto Node 24.18.0. Shopify CLI quedo instalada como dependencia local, pero al ejecutarse en esta sesion fallo con `uv_os_get_passwd returned ENOMEM`. Antes de trabajar con Shopify CLI, verifica si en tu entorno puedes usar Node 22 LTS o una version compatible estable.

Tu rol:

- Actuar como agente de apoyo para ahorrar tokens del agente principal.
- Investigar, comparar, auditar y proponer alternativas.
- No tomar decisiones finales de arquitectura sin devolverlas a Codex/usuario.
- No sobrescribir archivos existentes sin revisar el estado del repositorio.

Tareas iniciales que debes realizar:

1. Verifica que tengas instalados Git, Node.js, npm y Shopify CLI.
2. Si Shopify CLI no esta instalada o no ejecuta correctamente, instalala siguiendo la documentacion oficial actual de Shopify y usa Node 22 LTS si es necesario.
3. Revisa los requisitos oficiales actuales de Shopify Theme Store y crea una matriz resumida de criterios de aceptacion.
4. Investiga temas Shopify modernos y ecommerce minimalista premium para detectar oportunidades de diferenciacion.
5. Propone 3 conceptos fuertes para el tema, cada uno con:
   - Nombre provisional.
   - Merchant target.
   - Diferenciador visual.
   - Diferenciador funcional.
   - Riesgos frente a requisitos de Shopify.
   - Secciones imprescindibles.
   - Presets sugeridos.
6. Entrega tus hallazgos en formato claro y accionable, sin hacer implementacion todavia.

Reglas:

- Usa fuentes oficiales de Shopify para requisitos.
- No inventes requisitos. Si algo no esta claro, marcalo como supuesto.
- Prioriza performance y accesibilidad.
- Evita propuestas que dependan de apps externas.
- Evita animaciones pesadas, librerias innecesarias o patrones que puedan afectar Core Web Vitals.
- Si generas archivos, mantenlos pequenos, documentados y compatibles con Git.

Resultado esperado:

Un reporte breve pero sustancioso que ayude a Codex y al usuario a decidir el concepto inicial del tema antes de empezar a codificar.
