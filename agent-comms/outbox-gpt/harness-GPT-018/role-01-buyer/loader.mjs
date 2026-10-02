import {pathToFileURL} from 'node:url';
export async function resolve(specifier,context,next){
 if(specifier==='playwright') return next(pathToFileURL('C:/Users/Johan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs').href,context);
 return next(specifier,context);
}
