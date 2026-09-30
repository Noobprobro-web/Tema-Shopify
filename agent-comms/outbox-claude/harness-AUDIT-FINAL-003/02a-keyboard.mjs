// Eje 1: recorrido real con Tab / Shift+Tab, indicador de foco, foco tapado, trampas de foco y Escape.
import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from './lib.mjs';

const FOCUS_INFO = () => {
  const lum = (c) => { const a = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; };
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).map(Number); return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 }; };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return +((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2); };
  const bgOf = (el) => { for (let p = el; p; p = p.parentElement) { const c = parse(getComputedStyle(p).backgroundColor); if (c && c.a > 0.5) return c.rgb; } return [255, 255, 255]; };
  const hasImgBehind = (el) => { const r = el.getBoundingClientRect(); return document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2).some((n) => n !== el && /^(img|video|picture)$/.test(n.localName)); };
  const d = (el) => el.localName + (el.id ? '#' + el.id.slice(0, 40) : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '');
  const el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return null;
  let host = el;
  // Web components de Shopify (shopify-account): el foco real vive en el shadow root abierto.
  let shadowInner = null;
  if (el.shadowRoot && el.shadowRoot.activeElement) { shadowInner = el.shadowRoot.activeElement; host = shadowInner; }
  let r = host.getBoundingClientRect();
  // Inputs visualmente ocultos: el indicador vive en el label asociado.
  if (r.width <= 2 || r.height <= 2) {
    const lab = (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) || el.closest('label');
    if (lab) { host = lab; r = lab.getBoundingClientRect(); }
  }
  const cs = getComputedStyle(host);
  const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
  const oc = parse(cs.outlineColor);
  const vw = document.documentElement.clientWidth, vh = window.innerHeight;
  const inView = r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw && r.width > 0 && r.height > 0;
  let obscuredBy = null;
  let coveredPct = 0;
  if (inView) {
    // Muestreo 5x3 del rectángulo para estimar cuánta área queda tapada (WCAG 2.4.11).
    let hit = 0, total = 0;
    for (let ix = 1; ix <= 5; ix++) for (let iy = 1; iy <= 3; iy++) {
      const x = r.left + (r.width * ix) / 6, y = r.top + (r.height * iy) / 4;
      if (x < 0 || y < 0 || x >= vw || y >= vh) { total++; hit++; continue; }
      const top = document.elementFromPoint(x, y);
      total++;
      if (top && !(host.contains(top) || top.contains(host) || el.contains(top))) { hit++; obscuredBy = obscuredBy || d(top); }
    }
    coveredPct = Math.round((hit / total) * 100);
  }
  return {
    el: d(el), shadow: shadowInner ? d(shadowInner) : (el.shadowRoot ? 'open-no-active' : null),
    host: host === el ? null : d(host),
    label: (el.getAttribute('aria-label') || el.textContent || el.value || el.name || '').replace(/\s+/g, ' ').trim().slice(0, 50),
    x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height),
    inView, coveredPct, obscuredBy,
    focusVisible: el.matches(':focus-visible'),
    outline, outlineCss: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor} off=${cs.outlineOffset}`,
    boxShadow: cs.boxShadow === 'none' ? null : cs.boxShadow.slice(0, 60),
    outlineContrast: outline && oc ? ratio(oc.rgb, bgOf(host.parentElement || host)) : null,
    overImage: hasImgBehind(host),
    exp: el.getAttribute('aria-expanded'),
    inDialog: !!el.closest('[role="dialog"], dialog'),
    region: el.closest('header, main, footer, [role="dialog"], dialog, .shopify-section')?.localName || null,
    section: (el.closest('[id^="shopify-section-"]')?.id || '').split('__').pop(),
  };
};

async function tabWalk(page, max, key = 'Tab') {
  const stops = [];
  for (let i = 0; i < max; i++) {
    await page.keyboard.press(key);
    // html tiene scroll-behavior: smooth; se espera a que el scroll se asiente antes de medir.
    await page.waitForTimeout(40);
    await page.evaluate(() => new Promise((res) => { let last = -1, same = 0; const tick = () => { if (window.scrollY === last) { if (++same >= 4) return res(); } else { same = 0; last = window.scrollY; } requestAnimationFrame(tick); }; tick(); }));
    const s = await page.evaluate(FOCUS_INFO);
    if (!s) { stops.push({ el: '(body)' }); break; }
    stops.push(s);
  }
  return stops;
}

const IN_PANEL = (sel) => {
  const panel = document.querySelector(sel);
  const a = document.activeElement;
  const d = (el) => (el ? el.localName + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') : null);
  return { inside: !!(panel && a && panel.contains(a)), active: d(a), label: a ? (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 30) : '' };
};

async function trapTest(page, name, triggerSel, panelSel, opts = {}) {
  const res = { name, triggerSel, panelSel };
  const trig = page.locator(triggerSel).first();
  if ((await trig.count()) === 0 || !(await trig.isVisible().catch(() => false))) { res.skipped = 'trigger no visible/no existe'; return res; }
  await trig.scrollIntoViewIfNeeded().catch(() => {});
  await trig.focus();
  res.before = await page.evaluate((s) => { const t = document.querySelector(s); return { exp: t.getAttribute('aria-expanded'), controls: t.getAttribute('aria-controls'), haspopup: t.getAttribute('aria-haspopup') }; }, triggerSel);
  await page.keyboard.press(opts.key || 'Enter');
  await page.waitForTimeout(opts.wait || 900);
  if (opts.expectNavigation && page.url().includes(opts.expectNavigation)) { res.navigated = page.url(); return res; }
  res.open = await page.evaluate(({ t, p }) => {
    const trig = document.querySelector(t), panel = document.querySelector(p);
    if (!panel) return { panel: false };
    const r = panel.getBoundingClientRect();
    const cs = getComputedStyle(panel);
    const bg = [...document.querySelectorAll('main, footer, header .site-header, #MainContent')].map((n) => n.localName + ':' + (n.closest('[inert]') ? 'inert' : 'live') + (n.getAttribute('aria-hidden') ? ':ah=' + n.getAttribute('aria-hidden') : ''));
    return {
      panel: true, exp: trig.getAttribute('aria-expanded'), ariaHidden: panel.getAttribute('aria-hidden'), ariaModal: panel.getAttribute('aria-modal'), role: panel.getAttribute('role') || panel.localName,
      labelled: !!(panel.getAttribute('aria-label') || (panel.getAttribute('aria-labelledby') && document.getElementById(panel.getAttribute('aria-labelledby')))),
      inert: panel.inert, visible: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none', w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left), right: Math.round(r.right),
      focusInside: panel.contains(document.activeElement), activeLabel: (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent || '').trim().slice(0, 30),
      background: bg, bodyOverflow: getComputedStyle(document.body).overflow, scrollLocked: document.body.hasAttribute('data-drawer-open') || getComputedStyle(document.documentElement).overflow === 'hidden' || getComputedStyle(document.body).overflow === 'hidden',
    };
  }, { t: triggerSel, p: panelSel });
  const fwd = [], back = [];
  let escapes = 0;
  for (let i = 0; i < (opts.tabs || 30); i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(25); const s = await page.evaluate(IN_PANEL, panelSel); if (!s.inside) escapes++; fwd.push(s.active + '|' + s.label); }
  for (let i = 0; i < (opts.tabs || 30); i++) { await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(25); const s = await page.evaluate(IN_PANEL, panelSel); if (!s.inside) escapes++; back.push(s.active + '|' + s.label); }
  res.trap = { escapes, distinctStops: new Set(fwd).size, cycle: [...new Set(fwd)].slice(0, 14) };
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  res.afterEscape = await page.evaluate(({ t, p }) => {
    const trig = document.querySelector(t), panel = document.querySelector(p);
    const r = panel.getBoundingClientRect();
    const a = document.activeElement;
    return { focusOnTrigger: a === trig, active: a ? a.localName + '.' + String(a.className).split(/\s+/).slice(0, 2).join('.') : null, exp: trig.getAttribute('aria-expanded'), ariaHidden: panel.getAttribute('aria-hidden'), inert: panel.inert, stillVisible: getComputedStyle(panel).visibility !== 'hidden' && r.width > 0 && r.left < innerWidth && r.right > 0 && !panel.inert && getComputedStyle(panel).display !== 'none' && !(panel.localName === 'dialog' && !panel.open), bgInert: [...document.querySelectorAll('main')].some((n) => n.closest('[inert]')) };
  }, { t: triggerSel, p: panelSel });
  return res;
}

const out = {};
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  out[name] = {};
  for (const vp of [{ n: '1440', width: 1440, height: 900 }, { n: '375', width: 375, height: 667 }]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await unlock(context, store.url);
    const logs = [];
    const page = await context.newPage();
    attachConsole(page, logs);
    const o = (out[name][vp.n] = {});

    // --- Recorrido completo de la home ---
    await page.goto(store.url + '/', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, 0));
    o.homeWalk = await tabWalk(page, 260);
    // Recorrido inverso desde el final para comprobar simetría.
    await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
    o.homeWalkReverse = (await tabWalk(page, 260, 'Shift+Tab')).map((s) => s.el + '|' + (s.label || ''));

    // --- Trampas en home ---
    await page.goto(store.url + '/', { waitUntil: 'networkidle' });
    o.traps = [];
    o.traps.push(await trapTest(page, 'mobile-menu', '.site-header__menu-button', '[id^="MobileMenu-"]'));
    o.traps.push(await trapTest(page, 'predictive-search', '.predictive-search__trigger', '[id^="PredictiveSearchPanel-"]'));
    o.traps.push(await trapTest(page, 'cart-drawer-empty', 'a.site-header__cart', '.cart-drawer__panel', { expectNavigation: '/cart' }));
    if (!page.url().endsWith('/')) await page.goto(store.url + '/', { waitUntil: 'networkidle' });
    const hot = await page.locator('.lookbook-hotspot__trigger').count();
    if (hot) {
      const ctl = await page.locator('.lookbook-hotspot__trigger').first().getAttribute('aria-controls');
      o.traps.push(await trapTest(page, 'lookbook-popover', '.lookbook-hotspot__trigger', '#' + ctl));
    } else o.traps.push({ name: 'lookbook-popover', skipped: 'sección no presente en este preset' });

    // --- PDP: recorrido, zoom, ATC ---
    await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'networkidle' });
    o.pdpWalk = await tabWalk(page, 90);
    await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'networkidle' });
    o.traps.push(await trapTest(page, 'pdp-zoom', '.product-gallery__zoom-trigger', 'dialog.product-zoom'));
    o.traps.push(await trapTest(page, 'size-guide', 'size-guide-modal [data-size-guide-open], size-guide-modal button', 'size-guide-modal dialog'));

    // ATC con teclado: drawer, live region y retorno de foco.
    await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      window.__live = [];
      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          const host = (m.target.nodeType === 1 ? m.target : m.target.parentElement)?.closest('[aria-live], [role="status"], [role="alert"]');
          if (!host) continue;
          const txt = host.textContent.replace(/\s+/g, ' ').trim();
          if (txt) window.__live.push({ t: Math.round(performance.now()), live: host.getAttribute('aria-live'), role: host.getAttribute('role'), cls: String(host.className).slice(0, 40), hidden: host.hidden || !!host.closest('[hidden]'), inert: !!host.closest('[inert]'), ariaHiddenAncestor: !!host.closest('[aria-hidden="true"]'), txt: txt.slice(0, 90) });
        }
      });
      mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
    });
    const atc = page.locator('.product-form__submit').first();
    await atc.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);
    o.atc = await page.evaluate(() => {
      const panel = document.querySelector('.cart-drawer__panel');
      const a = document.activeElement;
      const count = document.querySelector('.site-header__cart');
      return { drawerOpen: panel && !panel.inert && panel.getAttribute('aria-hidden') !== 'true', focusInside: panel.contains(a), active: a.localName + '.' + String(a.className).split(/\s+/).slice(0, 2).join('.'), activeLabel: a.getAttribute('aria-label') || a.textContent.trim().slice(0, 30), cartLinkLabel: count.getAttribute('aria-label'), live: window.__live };
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(700);
    o.atc.afterEscape = await page.evaluate(() => { const a = document.activeElement; return { active: a.localName + '.' + String(a.className).split(/\s+/).slice(0, 3).join('.'), isAtc: a.matches('.product-form__submit') }; });

    // --- Drawer con artículos: trampa + Escape desde el icono de cabecera ---
    await page.goto(store.url + '/', { waitUntil: 'networkidle' });
    o.traps.push(await trapTest(page, 'cart-drawer-filled', 'a.site-header__cart', '.cart-drawer__panel', { expectNavigation: '/cart', tabs: 40 }));

    // Vaciar carrito para no contaminar pasadas siguientes.
    await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }));
    o.console = logs;
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-02a-keyboard.json', import.meta.url), JSON.stringify(out, null, 1));

for (const [store, vps] of Object.entries(out)) for (const [vp, o] of Object.entries(vps)) {
  const w = o.homeWalk.filter((s) => s.el !== '(body)');
  const noInd = w.filter((s) => !s.outline && !s.boxShadow);
  const notView = w.filter((s) => !s.inView);
  const covered = w.filter((s) => s.inView && s.coveredPct >= 50);
  const lowC = w.filter((s) => s.outline && s.outlineContrast !== null && s.outlineContrast < 3 && !s.overImage);
  console.log(`\n## ${store} @${vp}: home stops=${w.length} reverse=${o.homeWalkReverse.filter((s) => !s.startsWith('(body)')).length} sinIndicador=${noInd.length} fueraDeVista=${notView.length} tapado>=50%=${covered.length} contrasteFoco<3=${lowC.length} endsAtBody=${o.homeWalk.at(-1).el === '(body)'}`);
  for (const s of noInd.slice(0, 8)) console.log('   SIN-INDICADOR', s.el, '|', s.label, '|', s.outlineCss);
  for (const s of notView.slice(0, 8)) console.log('   FUERA-VISTA', s.el, '|', s.label, `x=${s.x} y=${s.y} w=${s.w} h=${s.h}`);
  for (const s of covered.slice(0, 8)) console.log('   TAPADO', s.coveredPct + '%', s.el, '|', s.label, '<=', s.obscuredBy);
  for (const s of lowC.slice(0, 8)) console.log('   FOCO-BAJO-CONTRASTE', s.outlineContrast, s.el, '|', s.label, '|', s.outlineCss);
  console.log('   orden:', w.map((s) => (s.section || s.region || '?')).reduce((acc, x) => { if (acc.at(-1)?.[0] === x) acc.at(-1)[1]++; else acc.push([x, 1]); return acc; }, []).map(([a, b]) => a + '×' + b).join(' → '));
  const pw = o.pdpWalk.filter((s) => s.el !== '(body)');
  console.log(`   PDP stops(<=90)=${pw.length} sinIndicador=${pw.filter((s) => !s.outline && !s.boxShadow).length} fueraDeVista=${pw.filter((s) => !s.inView).length} tapado=${pw.filter((s) => s.inView && s.coveredPct >= 50).length}`);
  for (const s of pw.filter((s) => (!s.outline && !s.boxShadow) || !s.inView || (s.inView && s.coveredPct >= 50)).slice(0, 8)) console.log('     PDP-FLAG', s.el, '|', s.label, `inView=${s.inView} cov=${s.coveredPct}% outline=${s.outline} <= ${s.obscuredBy}`);
  for (const t of o.traps) {
    if (t.skipped) { console.log(`   TRAP ${t.name}: SKIP (${t.skipped})`); continue; }
    if (t.navigated) { console.log(`   TRAP ${t.name}: NAVEGÓ a ${t.navigated}`); continue; }
    console.log(`   TRAP ${t.name}: exp ${t.before.exp}→${t.open.exp}→${t.afterEscape.exp} | visible=${t.open.visible} focusInside=${t.open.focusInside}(${t.open.activeLabel}) modal=${t.open.ariaModal} labelled=${t.open.labelled} bg=[${t.open.background.join(',')}] | escapes=${t.trap.escapes} stops=${t.trap.distinctStops} | Esc→trigger=${t.afterEscape.focusOnTrigger} (${t.afterEscape.active}) stillVisible=${t.afterEscape.stillVisible} bgInertAfter=${t.afterEscape.bgInert}`);
  }
  console.log(`   ATC: drawerOpen=${o.atc.drawerOpen} focusInside=${o.atc.focusInside} active=${o.atc.active}(${o.atc.activeLabel}) cartLabel="${o.atc.cartLinkLabel}" Esc→ATC=${o.atc.afterEscape.isAtc} (${o.atc.afterEscape.active})`);
  for (const l of o.atc.live.slice(0, 10)) console.log(`     LIVE t=${l.t} live=${l.live} role=${l.role} hidden=${l.hidden} inert=${l.inert} ahAnc=${l.ariaHiddenAncestor} [${l.cls}] "${l.txt}"`);
  console.log('   console:', o.console.length, o.console.slice(0, 3).map((c) => c.type + ':' + c.text.slice(0, 120)).join(' || '));
}
