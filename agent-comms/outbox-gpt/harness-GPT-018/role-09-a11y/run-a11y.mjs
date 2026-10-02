import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { unlock, STORES } from '../../../outbox-claude/harness-AUDIT-FINAL-002/lib.mjs';

const out = 'agent-comms/outbox-gpt/harness-GPT-018/role-09-a11y';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });

for (const [key, store] of Object.entries(STORES)) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  await unlock(context, store.url);
  const page = await context.newPage();
  const result = { store: key, checks: [], pageErrors: [] };
  page.on('pageerror', e => result.pageErrors.push(String(e.message)));

  const snapshot = async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try { return await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    const root = document.documentElement;
    const buttons = [...document.querySelectorAll('button')].filter(b => !b.getAttribute('aria-label') && !b.innerText.trim()).length;
    return {
      url: location.href,
      active: { tag: el.tagName, role: el.getAttribute('role'), name: (el.getAttribute('aria-label') || el.innerText || el.getAttribute('name') || '').trim().slice(0, 120), id: el.id, outline: cs.outline, outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, boxShadow: cs.boxShadow, rect: el.getBoundingClientRect().toJSON() },
      headingCount: document.querySelectorAll('h1').length,
      language: root.lang,
      emptyNameButtons: buttons,
      dialogs: [...document.querySelectorAll('[role=dialog]')].map(d => ({ name: d.getAttribute('aria-label') || d.getAttribute('aria-labelledby'), modal: d.getAttribute('aria-modal'), visible: !!d.getClientRects().length })),
      motion: { preference: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'no-preference', rootData: { ...root.dataset }, animations: document.getAnimations().slice(0, 12).map(a => ({ state: a.playState, duration: a.effect?.getTiming().duration })) }
    };
      }); } catch (error) {
        if (attempt === 2) throw error;
        await page.waitForLoadState('domcontentloaded').catch(() => {});
      }
    }
  };
  const shot = async name => { await page.screenshot({ path: path.join(out, `${key}-${name}.png`), fullPage: false }); result.checks.push({ stage: name, ...(await snapshot()) }); };
  const findByRole = async (roles, rx) => {
    for (const role of roles) {
      const list = page.getByRole(role, { name: rx }).first();
      if (await list.count()) return list;
    }
    return null;
  };

  await page.goto(store.url, { waitUntil: 'domcontentloaded' });
  await shot('home-full');
  await page.keyboard.press('Tab');
  result.checks.push({ stage: 'first-tab', ...(await snapshot()) });
  const search = await findByRole(['button', 'link'], /^search$/i);
  if (search) {
    await search.focus(); await page.keyboard.press('Enter');
    const searchDialog = page.getByRole('dialog', { name: /search our collection/i });
    await searchDialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    result.checks.push({ stage: 'search-open', ...(await snapshot()), mainSnapshot: await page.locator('main').ariaSnapshot().catch(e => String(e)) });
    await page.keyboard.press('Escape');
    await searchDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    result.checks.push({ stage: 'search-escape', ...(await snapshot()) });
  } else result.checks.push({ stage: 'search-control', result: 'no accessible Search button/link found' });

  await page.goto(`${store.url}/products/${store.products[0]}`, { waitUntil: 'domcontentloaded' });
  await shot('pdp-full');
  result.checks.push({ stage: 'pdp-main', mainSnapshot: await page.locator('main').ariaSnapshot().catch(e => String(e)) });
  await page.goto(`${store.url}/cart`, { waitUntil: 'domcontentloaded' });
  await shot('cart-full');
  result.checks.push({ stage: 'cart-main', mainSnapshot: await page.locator('main').ariaSnapshot().catch(e => String(e)) });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(store.url, { waitUntil: 'domcontentloaded' });
  const menu = await findByRole(['button', 'link'], /^menu$/i);
  if (menu) {
    await menu.focus(); await page.keyboard.press('Enter');
    const menuDialog = page.getByRole('dialog', { name: /^menu$/i });
    await menuDialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}); await shot('menu-mobile-open');
    const focusWalk = [];
    for (let i = 0; i < 10; i++) { await page.keyboard.press('Tab'); focusWalk.push((await snapshot()).active); }
    result.checks.push({ stage: 'menu-mobile-tab-walk', focusWalk });
    await page.keyboard.press('Escape');
    await menuDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {}); await shot('menu-mobile-escape');
  } else result.checks.push({ stage: 'menu-control', result: 'no accessible Menu button/link found' });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(store.url, { waitUntil: 'domcontentloaded' });
  await shot('home-reduced-motion');
  result.checks.push({ stage: 'image-alt', images: await page.locator('main img').evaluateAll(images => images.slice(0, 30).map(i => ({ alt: i.getAttribute('alt'), currentSrc: i.currentSrc, loaded: i.complete && i.naturalWidth > 0 }))) });
  fs.writeFileSync(path.join(out, `${key}-results.json`), JSON.stringify(result, null, 2));
  await context.close();
  console.log(`${key}: ${result.checks.length} evidence records`);
}
await browser.close();
