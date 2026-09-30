// Eje 1: sincronía de estados ARIA (tabs, acordeones, combobox, marquesina), semántica de página,
// tamaño de objetivo (WCAG 2.5.8), contraste no textual de hotspots y prefers-reduced-motion.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const PAGE_SEMANTICS = () => {
  const d = (el) => el.localName + (el.id ? '#' + el.id.slice(0, 30) : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden], [inert]'); };
  const ids = {};
  document.querySelectorAll('[id]').forEach((n) => { ids[n.id] = (ids[n.id] || 0) + 1; });
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(vis).map((h) => +h.localName[1]);
  const skips = []; for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) skips.push(`h${heads[i - 1]}→h${heads[i]}`);
  // 2.5.8: objetivos < 24 px sin 24 px de holgura respecto a otro objetivo.
  const targets = [...document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"])')].filter(vis).filter((el) => !el.disabled);
  const box = (el) => { let r = el.getBoundingClientRect(); if ((r.width <= 2 || r.height <= 2 || el.matches('input[type="checkbox"], input[type="radio"]')) ) { const lab = (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) || el.closest('label'); if (lab) { const l = lab.getBoundingClientRect(); if (l.width * l.height > r.width * r.height) r = l; } } return r; };
  const small = [];
  const boxes = targets.map((el) => ({ el, r: box(el) }));
  for (const { el, r } of boxes) {
    if (r.width >= 24 && r.height >= 24) continue;
    const cs = getComputedStyle(el);
    const inline = cs.display === 'inline' && el.closest('p, li, .rte, dd, span');
    // Excepción de espaciado: un círculo de 24 px centrado no toca otro objetivo ni su círculo.
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const clash = boxes.some((o) => { if (o.el === el || o.el.contains(el) || el.contains(o.el)) return false; const ox = Math.max(o.r.left, Math.min(cx, o.r.right)), oy = Math.max(o.r.top, Math.min(cy, o.r.bottom)); return Math.hypot(cx - ox, cy - oy) < 12; });
    small.push({ el: d(el), label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height), inline: !!inline, spacingOk: !clash, offscreen: r.left >= document.documentElement.clientWidth || r.right <= 0 });
  }
  const mv = document.querySelector('meta[name="viewport"]')?.content || '';
  const skip = document.querySelector('.skip-link');
  return {
    lang: document.documentElement.lang, title: document.title, viewport: mv, zoomBlocked: /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\D|$)/.test(mv),
    h1: [...document.querySelectorAll('h1')].filter(vis).length, headingSkips: [...new Set(skips)],
    landmarks: { header: document.querySelectorAll('header').length, banner: document.querySelectorAll('body > header, [role="banner"]').length, main: document.querySelectorAll('main').length, nav: [...document.querySelectorAll('nav')].map((n) => n.getAttribute('aria-label') || n.getAttribute('aria-labelledby') || '(sin nombre)'), footer: document.querySelectorAll('footer').length },
    skipLink: skip ? { href: skip.getAttribute('href'), targetExists: !!document.querySelector(skip.getAttribute('href')), targetFocusable: (() => { const t = document.querySelector(skip.getAttribute('href')); return t ? t.getAttribute('tabindex') : null; })() } : null,
    duplicateIds: Object.entries(ids).filter(([, n]) => n > 1).map(([k, n]) => k + '×' + n).slice(0, 10),
    unlabelledControls: [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), select, textarea')].filter(vis).filter((el) => !(el.labels && el.labels.length) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.title).map(d),
    emptyLinksButtons: [...document.querySelectorAll('a[href], button')].filter(vis).filter((el) => !(el.getAttribute('aria-label') || el.textContent.trim() || el.querySelector('img[alt]:not([alt=""]), svg title') || el.getAttribute('aria-labelledby') || el.title)).map(d).slice(0, 10),
    imgNoAlt: [...document.querySelectorAll('img:not([alt])')].length,
    ariaControlsBroken: [...document.querySelectorAll('[aria-controls]')].filter((el) => el.getAttribute('aria-controls').split(/\s+/).some((id) => !document.getElementById(id))).map((el) => d(el) + '→' + el.getAttribute('aria-controls')).slice(0, 10),
    labelledbyBroken: [...document.querySelectorAll('[aria-labelledby], [aria-describedby]')].filter((el) => ['aria-labelledby', 'aria-describedby'].some((a) => el.getAttribute(a) && el.getAttribute(a).split(/\s+/).some((id) => !document.getElementById(id)))).map(d).slice(0, 10),
    smallTargets: small,
    liveRegions: [...document.querySelectorAll('[aria-live], [role="status"], [role="alert"]')].length,
  };
};

const out = {};
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  const o = (out[name] = {});
  for (const vp of [{ n: '375', width: 375, height: 667 }, { n: '1440', width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await unlock(context, store.url);
    const page = await context.newPage();
    const v = (o[vp.n] = { pages: {} });
    const go = async (p) => { for (let i = 0; i < 5; i++) { const r = await page.goto(store.url + p, { waitUntil: 'load', timeout: 60000 }).catch(() => null); if (r && r.status() !== 429) break; await page.waitForTimeout(45000); } await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {}); await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); }); await page.waitForTimeout(500); };

    for (const p of ['/', '/collections/all', '/products/' + store.products[0], '/cart', '/search?q=le']) { await go(p); v.pages[p] = await page.evaluate(PAGE_SEMANTICS); }

    // --- Home: tabs del showcase ---
    await go('/');
    v.tabs = await page.evaluate(() => { const tl = document.querySelector('[role="tablist"]'); if (!tl) return null; const tabs = [...tl.querySelectorAll('[role="tab"]')]; return { count: tabs.length, state: tabs.map((t) => ({ sel: t.getAttribute('aria-selected'), tabindex: t.getAttribute('tabindex'), controls: t.getAttribute('aria-controls'), panel: (() => { const p = document.getElementById(t.getAttribute('aria-controls')); return p ? { role: p.getAttribute('role'), hidden: p.hidden, labelledby: p.getAttribute('aria-labelledby') === t.id, tabindex: p.getAttribute('tabindex') } : null; })() })) }; });
    if (v.tabs && v.tabs.count > 1) {
      await page.locator('[role="tab"]').first().focus();
      await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500);
      v.tabsAfterArrow = await page.evaluate(() => { const tabs = [...document.querySelectorAll('[role="tablist"] [role="tab"]')]; return { focusIndex: tabs.indexOf(document.activeElement), state: tabs.map((t) => t.getAttribute('aria-selected') + '/' + t.getAttribute('tabindex') + '/panelHidden=' + document.getElementById(t.getAttribute('aria-controls'))?.hidden) }; });
      await page.keyboard.press('Home'); await page.waitForTimeout(300);
      v.tabsAfterHome = await page.evaluate(() => [...document.querySelectorAll('[role="tablist"] [role="tab"]')].indexOf(document.activeElement));
    }
    // --- Marquesina: aria-pressed + pausa real ---
    const mq = page.locator('[data-marquee-toggle]').first();
    if (await mq.count()) {
      const st = () => page.evaluate(() => { const b = document.querySelector('[data-marquee-toggle]'); const tr = document.querySelector('.marquee-banner__track'); return { pressed: b.getAttribute('aria-pressed'), label: b.getAttribute('aria-label'), playState: getComputedStyle(tr).animationPlayState, anim: getComputedStyle(tr).animationName }; });
      const a = await st(); await mq.scrollIntoViewIfNeeded(); await mq.click(); await page.waitForTimeout(300); const b = await st();
      v.marquee = { before: a, after: b };
    }
    // --- Lookbook: contraste no textual del hotspot (fondo del botón vs. imagen alrededor) ---
    v.hotspots = await page.evaluate(() => [...document.querySelectorAll('.lookbook-hotspot__trigger')].map((b) => { const cs = getComputedStyle(b); const after = getComputedStyle(b, '::after'); const before = getComputedStyle(b, '::before'); return { w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height), bg: cs.backgroundColor, border: cs.borderTopWidth + ' ' + cs.borderTopColor, shadow: cs.boxShadow.slice(0, 80), color: cs.color, afterBg: after.backgroundColor, afterBorder: after.borderTopWidth + ' ' + after.borderTopColor, beforeBg: before.backgroundColor, exp: b.getAttribute('aria-expanded'), label: b.getAttribute('aria-label') }; }));
    // --- Búsqueda predictiva: combobox ---
    await page.locator('.predictive-search__trigger').first().click(); await page.waitForTimeout(500);
    const inp = page.locator('.predictive-search__input').first();
    const cb = () => inp.evaluate((i) => ({ role: i.getAttribute('role'), exp: i.getAttribute('aria-expanded'), controls: i.getAttribute('aria-controls'), autocomplete: i.getAttribute('aria-autocomplete'), active: i.getAttribute('aria-activedescendant'), listRole: document.getElementById(i.getAttribute('aria-controls'))?.getAttribute('role') || document.getElementById(i.getAttribute('aria-controls'))?.querySelector('[role="listbox"]')?.getAttribute('role'), options: document.querySelectorAll('[id^="predictive-search-results"] [role="option"]').length, label: i.getAttribute('aria-label') || (i.labels[0] && i.labels[0].textContent.trim()), status: [...document.querySelectorAll('predictive-search [role="status"], predictive-search [aria-live]')].map((n) => n.textContent.trim().slice(0, 60)) }));
    const c0 = await cb();
    await page.keyboard.type('le', { delay: 80 }); await page.waitForTimeout(1800);
    const c1 = await cb();
    await page.keyboard.press('ArrowDown'); await page.waitForTimeout(200);
    const c2 = await cb();
    const activeOk = await page.evaluate(() => { const i = document.querySelector('.predictive-search__input'); const a = i.getAttribute('aria-activedescendant'); const el = a && document.getElementById(a); return el ? { selected: el.getAttribute('aria-selected'), text: el.textContent.trim().slice(0, 30) } : null; });
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    const c3 = await cb();
    v.combobox = { closed: c0, typed: c1, arrow: c2, active: activeOk, afterEsc: c3 };
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);

    // --- PDP: acordeones y variantes (grupo de radios) ---
    await go('/products/' + store.products[0]);
    v.accordion = await page.evaluate(async () => { const s = document.querySelector('.product-details__summary'); if (!s) return null; const dt = s.closest('details'); const before = dt.open; s.click(); await new Promise((r) => setTimeout(r, 400)); return { native: !!dt, before, after: dt.open, ariaExpanded: s.getAttribute('aria-expanded') }; });
    v.variantGroups = await page.evaluate(() => [...document.querySelectorAll('main [id$="__main"] fieldset')].map((f) => ({ legend: f.querySelector('legend')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 40), radios: f.querySelectorAll('input[type="radio"]').length, sameName: new Set([...f.querySelectorAll('input[type="radio"]')].map((r) => r.name)).size === 1 })));
    v.qtyGroup = await page.evaluate(() => { const i = document.querySelector('main [id$="__main"] [data-quantity-input]'); return i ? { label: (i.labels[0] && i.labels[0].textContent.trim()) || i.getAttribute('aria-label'), type: i.type, min: i.min } : null; });
    await context.close();
  }
  // --- prefers-reduced-motion ---
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await unlock(context, store.url);
    const page = await context.newPage();
    await page.goto(store.url + '/', { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    o.reducedMotion = await page.evaluate(() => { const tr = document.querySelector('.marquee-banner__track'); const running = document.getAnimations().filter((a) => a.playState === 'running').map((a) => (a.animationName || a.transitionProperty || 'anim') + '@' + (a.effect?.target?.className || '').toString().slice(0, 40)); return { scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior, marquee: tr ? getComputedStyle(tr).animationName + '/' + getComputedStyle(tr).animationPlayState + '/' + getComputedStyle(tr).animationDuration : null, runningAnimations: running.slice(0, 8), heroVideoAutoplay: [...document.querySelectorAll('video')].map((v) => ({ autoplay: v.autoplay, paused: v.paused })) }; });
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-02d-aria' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const [store, o] of Object.entries(out)) {
  for (const vp of ['375', '1440']) {
    const v = o[vp]; if (!v) continue;
    console.log(`\n## ${store} @${vp}`);
    for (const [p, s] of Object.entries(v.pages)) {
      console.log(` ${p.padEnd(44)} lang=${s.lang} h1=${s.h1} skips=[${s.headingSkips}] main=${s.landmarks.main} nav=[${s.landmarks.nav}] skip=${JSON.stringify(s.skipLink)} zoomBlocked=${s.zoomBlocked} dupIds=[${s.duplicateIds}] unlabelled=[${s.unlabelledControls}] empty=[${s.emptyLinksButtons}] imgNoAlt=${s.imgNoAlt} ctlBroken=[${s.ariaControlsBroken}] lblBroken=[${s.labelledbyBroken}]`);
      const bad = s.smallTargets.filter((t) => !t.inline && !t.spacingOk && !t.offscreen);
      const ok = s.smallTargets.filter((t) => !t.inline && t.spacingOk && !t.offscreen);
      console.log(`    objetivos<24: FALLAN=${bad.length} ${bad.slice(0, 6).map((t) => t.el + ' "' + t.label + '" ' + t.w + 'x' + t.h).join(' | ')} || con-holgura=${ok.length} ${ok.slice(0, 4).map((t) => t.el + ' ' + t.w + 'x' + t.h).join(' | ')} || offscreen=${s.smallTargets.filter((t) => t.offscreen).map((t) => t.el).join(',')}`);
    }
    console.log(' tabs:', JSON.stringify(v.tabs), '→', JSON.stringify(v.tabsAfterArrow), 'Home→', v.tabsAfterHome);
    console.log(' marquee:', JSON.stringify(v.marquee));
    console.log(' hotspots:', JSON.stringify(v.hotspots && v.hotspots[0]), 'n=', v.hotspots && v.hotspots.length);
    console.log(' combobox:', JSON.stringify(v.combobox));
    console.log(' accordion:', JSON.stringify(v.accordion), 'variantGroups:', JSON.stringify(v.variantGroups), 'qty:', JSON.stringify(v.qtyGroup));
  }
  console.log(' reducedMotion:', JSON.stringify(o.reducedMotion));
}
