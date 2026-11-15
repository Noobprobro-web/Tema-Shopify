// B-01: cierre del cajon de menu (theme-drawer) al cruzar el corte 62rem (992px) + Tab/Shift+Tab atrapado. Sin carrito.
import { chromium, THEMES, newCtx, nav, save, sleep, presets } from './common.mjs';
const out = { script: 'probe-b01-drawer.mjs', at: new Date().toISOString(), breakpointPx: 992, runs: [] };
const state = (page) => page.evaluate(() => {
  const d = document.querySelector('theme-drawer'); const t = d.querySelector('[data-drawer-trigger]'); const p = d.querySelector('[data-drawer-panel]'); const o = d.querySelector('[data-drawer-overlay]');
  const a = document.activeElement; const usable = (e) => !!e && e.isConnected && !e.closest('[hidden],[inert]') && e.getClientRects().length > 0;
  return { expanded: t.getAttribute('aria-expanded'), dataOpen: d.hasAttribute('data-open'), panelInert: p.inert, panelAriaHidden: p.getAttribute('aria-hidden'), overlayHidden: o.hidden, bodyDrawerOpen: document.body.hasAttribute('data-drawer-open'), bodyOverflow: getComputedStyle(document.body).overflow, inertCount: document.querySelectorAll('[inert]').length, triggerVisible: t.getClientRects().length > 0, active: a ? a.tagName.toLowerCase() + '.' + String(a.className).split(' ')[0] + (a.getAttribute('aria-label') ? '[' + a.getAttribute('aria-label') + ']' : '') : null, activeIsBody: a === document.body, activeUsable: usable(a), activeInPanel: p.contains(a) };
});
const openAt = async (page, w, h) => { await page.setViewportSize({ width: w, height: h }); await sleep(300); await page.locator('theme-drawer [data-drawer-trigger]').first().click(); await sleep(400); };
const b = await chromium.launch();
try { for (const preset of presets) { const ctx = await newCtx(b, 390, 844, { reducedMotion: 'reduce' }); const page = await ctx.newPage(); const run = { preset, cases: {} };
  try {
    await nav(page, '/', THEMES[preset], 800);
    run.baselineInert = (await state(page)).inertCount;
    // A: 390 -> 1280
    await openAt(page, 390, 844); const open = await state(page); await page.setViewportSize({ width: 1280, height: 800 }); await sleep(500);
    run.cases.A_390_open_to_1280 = { opened: open.expanded === 'true', after: await state(page) };
    // F: volver a 390 con foco tras el cierre
    await page.setViewportSize({ width: 390, height: 844 }); await sleep(500); run.cases.F_back_to_390 = await state(page);
    // E: reabrir y Escape devuelve foco al disparador
    await openAt(page, 390, 844); const reopened = await state(page); await page.keyboard.press('Escape'); await sleep(400);
    run.cases.E_reopen_escape = { reopened: reopened.expanded === 'true', after: await state(page) };
    // B: 991 -> 992
    await openAt(page, 991, 800); const o991 = await state(page); await page.setViewportSize({ width: 992, height: 800 }); await sleep(500);
    run.cases.B_991_open_to_992 = { opened: o991.expanded === 'true', after: await state(page) };
    await page.setViewportSize({ width: 390, height: 844 }); await sleep(400);
    // C: giro dentro del movil (390x844 -> 844x390) sigue abierto
    await openAt(page, 390, 844); await page.setViewportSize({ width: 844, height: 390 }); await sleep(500);
    run.cases.C_rotate_stays_open = await state(page);
    // D: trampa de foco (abierto, 844x390 -> volver a 390)
    await page.setViewportSize({ width: 390, height: 844 }); await sleep(300);
    const tabs = []; for (let i = 0; i < 16; i++) { await page.keyboard.press('Tab'); await sleep(60); const s = await state(page); tabs.push({ i: i + 1, active: s.active, inPanel: s.activeInPanel }); }
    const shifts = []; for (let i = 0; i < 16; i++) { await page.keyboard.press('Shift+Tab'); await sleep(60); const s = await state(page); shifts.push({ i: i + 1, active: s.active, inPanel: s.activeInPanel }); }
    run.cases.D_trap = { tabOutside: tabs.filter((x) => !x.inPanel).length, shiftOutside: shifts.filter((x) => !x.inPanel).length, tabSeq: tabs.map((x) => x.active), shiftSeq: shifts.map((x) => x.active), stillOpen: (await state(page)).expanded === 'true' };
    await page.keyboard.press('Escape'); await sleep(300);
    // G: abrir en 1280 el menu no existe; cruzar desde 1280 hacia 390 con foco en nav de escritorio
    await page.setViewportSize({ width: 1280, height: 800 }); await sleep(400);
    const nav1 = page.locator('.site-header__desktop-nav a, .desktop-nav a').first(); if (await nav1.count()) { await nav1.focus(); await page.setViewportSize({ width: 390, height: 844 }); await sleep(500); run.cases.G_desktop_focus_to_390 = await state(page); }
  } catch (e) { run.error = String(e.message).slice(0, 200); }
  out.runs.push(run); await ctx.close();
  const c = run.cases; console.log(preset, 'A closed', c.A_390_open_to_1280?.after.expanded, 'bodyLock', c.A_390_open_to_1280?.after.bodyDrawerOpen, 'inertDelta', c.A_390_open_to_1280 && c.A_390_open_to_1280.after.inertCount - run.baselineInert, 'activeUsable', c.A_390_open_to_1280?.after.activeUsable, '| B', c.B_991_open_to_992?.after.expanded, '| C stays', c.C_rotate_stays_open?.expanded, '| D out', c.D_trap?.tabOutside, c.D_trap?.shiftOutside, run.error || '');
} } finally { await b.close(); save('08-b01-drawer.json', out); }
