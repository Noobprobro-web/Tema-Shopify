export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'playwright') {
    return { url: 'file:///C:/Users/Johan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs', shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
