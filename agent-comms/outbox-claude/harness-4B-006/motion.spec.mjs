import { expect, test } from '@playwright/test';

const visible = (page, id) => page.evaluate((i) => {
  const el = document.getElementById(i);
  const cs = getComputedStyle(el);
  return { opacity: Number(cs.opacity), transform: cs.transform, hasReveal: el.hasAttribute('data-reveal') };
}, id);

test.describe('4C-002 sistema de movimiento', () => {
  test('contenido nace visible: sin IntersectionObserver nada se oculta', async ({ page }) => {
    await page.addInitScript(() => { delete window.IntersectionObserver; });
    await page.goto('/motion.html');
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => document.documentElement.dataset.revealReady)).toBeUndefined();
    for (const id of ['a0', 'a1', 'a2', 'b0', 'b1']) {
      expect((await visible(page, id)).opacity, id).toBe(1);
    }
  });

  test('contenido nace visible: con animations=none nada se oculta', async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener('readystatechange', () => {
        document.documentElement.setAttribute('data-animations', 'none');
      }, { once: true });
    });
    await page.goto('/motion.html');
    await page.evaluate(() => document.documentElement.setAttribute('data-animations', 'none'));
    await page.reload();
    await page.evaluate(() => document.documentElement.setAttribute('data-animations', 'none'));
    await page.waitForTimeout(200);
    for (const id of ['b0', 'b1']) {
      expect((await visible(page, id)).opacity, id).toBe(1);
    }
  });

  test('contenido nace visible: con prefers-reduced-motion nada se oculta', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/motion.html');
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => document.documentElement.dataset.revealReady)).toBeUndefined();
    for (const id of ['a0', 'b0', 'b1']) {
      expect((await visible(page, id)).opacity, id).toBe(1);
    }
    await ctx.close();
  });

  test('el LCP del hero nunca entra en el reveal', async ({ page }) => {
    await page.goto('/motion.html');
    await page.waitForTimeout(250);
    const hero = await visible(page, 'inside-hero');
    expect(hero.hasReveal).toBe(false);
    expect(hero.opacity).toBe(1);
    const heroImgReveal = await page.evaluate(() =>
      document.querySelectorAll('.hero-editorial [data-reveal]').length);
    expect(heroImgReveal).toBe(0);
  });

  test('lo que esta bajo el pliegue se oculta y se revela al llegar', async ({ page }) => {
    await page.goto('/motion.html');
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => document.documentElement.dataset.revealReady)).toBe('true');

    const before = await visible(page, 'b0');
    expect(before.hasReveal).toBe(true);
    expect(before.opacity).toBeLessThan(1);

    await page.evaluate(() => document.getElementById('b0').scrollIntoView());
    await page.waitForTimeout(900);
    expect((await visible(page, 'b0')).opacity).toBe(1);
  });

  test('el escalonado reinicia en cada rejilla', async ({ page }) => {
    await page.goto('/motion.html');
    await page.waitForTimeout(250);
    const idx = (id) => page.evaluate((i) =>
      document.getElementById(i).style.getPropertyValue('--reveal-index'), id);
    expect(await idx('a0')).toBe('0');
    expect(await idx('a1')).toBe('1');
    expect(await idx('a2')).toBe('2');
    expect(await idx('b0')).toBe('0');
    expect(await idx('b1')).toBe('1');
  });

  test('la cabecera se condensa al bajar y vuelve al subir', async ({ page }) => {
    await page.goto('/motion.html');
    await page.waitForTimeout(200);
    const scrolled = () => page.evaluate(() =>
      document.querySelector('.site-header').hasAttribute('data-header-scrolled'));
    expect(await scrolled()).toBe(false);
    // base.css:97 declara scroll-behavior: smooth, asi que scrollTo es animado.
    // Se espera al valor real de scrollY en vez de a un tiempo fijo.
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForFunction(() => window.scrollY > 40);
    await page.waitForTimeout(80);
    expect(await scrolled()).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);
    await page.waitForTimeout(80);
    expect(await scrolled()).toBe(false);
  });
});
