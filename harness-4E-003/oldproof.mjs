import { chromium } from '/home/claude/w2/node_modules/@playwright/test/index.mjs';
// Reinyecta las reglas ANTERIORES encima del build nuevo para comprobar que las
// aserciones del spec son sensibles: si con el CSS viejo siguen pasando, no guardan nada.
const OLD = `
.main-documentation__title,.main-support__title,.main-faq__title,.main-about__title,.main-policy__title{
  font-size: calc(clamp(2.5rem, 9vw, 7rem) * var(--font-heading-scale));
}
.main-support__section-title{ font-size: calc(clamp(2rem, 5vw, 4.5rem) * var(--font-heading-scale)); }
.main-documentation__body{ max-width: none; }
.doc-section__content,.doc-preset,.doc-snippet,.doc-callout{ max-width: 68ch; }
.main-faq__group{ margin-block-start: 0; }
.main-faq__group + .main-faq__group{ margin-block-start: var(--space-2xl); }
`;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });

await p.goto('http://127.0.0.1:8123/documentation.html', { waitUntil: 'networkidle' });
await p.addStyleTag({ content: OLD });
await p.waitForTimeout(150);
console.log(await p.evaluate(() => {
  const t = document.querySelector('.main-documentation__title');
  const cs = getComputedStyle(t);
  const lines = Math.round(t.getBoundingClientRect().height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize)));
  const r = (s) => Math.round(document.querySelector(s).getBoundingClientRect().right);
  return `T1/T2 doc: h1=${Math.round(parseFloat(cs.fontSize))}px lineas=${lines}  |  T3 bordes: h2=${r('.doc-section__title')} texto=${r('.doc-section__content')}`;
}));

await p.goto('http://127.0.0.1:8123/support.html', { waitUntil: 'networkidle' });
await p.addStyleTag({ content: OLD });
await p.waitForTimeout(150);
console.log(await p.evaluate(() => {
  const s = Array.from(document.querySelectorAll('.main-support__section-title')).map((e) => Math.round(parseFloat(getComputedStyle(e).fontSize)));
  return `T4 soporte: titulos=${s.join('/')}px`;
}));

await p.goto('http://127.0.0.1:8123/faq.html', { waitUntil: 'networkidle' });
await p.addStyleTag({ content: OLD });
await p.waitForTimeout(150);
console.log(await p.evaluate(() => {
  const g = Array.from(document.querySelectorAll('.main-faq__group'));
  return 'T7 FAQ: huecos=' + g.map((x) => Math.round(x.getBoundingClientRect().top - x.previousElementSibling.getBoundingClientRect().bottom)).join('/') + 'px';
}));
await b.close();
