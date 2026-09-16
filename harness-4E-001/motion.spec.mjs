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
    // scroll suave + 680ms de transicion: se espera al estado final, no a un tiempo fijo
    await page.waitForFunction(() => getComputedStyle(document.getElementById('b0')).opacity === '1', null, { timeout: 4000 });
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

  test('4D: los encabezados de seccion entran al reveal, los h1 de pagina no', async ({ page }) => {
    await page.goto('/motion.html');
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => ({
      sectionHeader: document.getElementById('section-header').hasAttribute('data-reveal'),
      pageH1Header: document.getElementById('page-h1-header').hasAttribute('data-reveal'),
      pageH1Opacity: Number(getComputedStyle(document.getElementById('page-h1-header')).opacity),
    }));
    expect(r.sectionHeader).toBe(true);
    expect(r.pageH1Header).toBe(false);
    expect(r.pageH1Opacity).toBe(1);
  });

  test('4D: los tokens recalibrados estan en :root y el reveal los usa', async ({ page }) => {
    await page.goto('/motion.html');
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const b0 = document.getElementById('b0');
      const b1 = document.getElementById('b1');
      const hidden = getComputedStyle(b0);
      const out = {
        base: cs.getPropertyValue('--motion-base').trim(),
        slow: cs.getPropertyValue('--motion-slow').trim(),
        shift: cs.getPropertyValue('--reveal-shift').trim(),
        stagger: cs.getPropertyValue('--reveal-stagger').trim(),
        b0Transform: hidden.transform,
        b0Opacity: hidden.opacity,
        // ocultar es instantaneo: el estado pendiente no lleva transicion
        b0HiddenDuration: hidden.transitionDuration,
      };
      // revelar si se anima, con la duracion base y el escalonado por hermano
      b0.setAttribute('data-revealed', '');
      b1.setAttribute('data-revealed', '');
      out.b0Duration = getComputedStyle(b0).transitionDuration;
      out.b1Delay = getComputedStyle(b1).transitionDelay;
      return out;
    });
    expect(r.base).toBe('680ms');
    expect(r.slow).toBe('1000ms');
    expect(r.shift).toBe('24px');
    expect(r.stagger).toBe('90ms');
    // oculto = desplazado 24px hacia abajo (matrix(1,0,0,1,0,24)), sin transicion de ida
    expect(r.b0Transform).toBe('matrix(1, 0, 0, 1, 0, 24)');
    expect(r.b0Opacity).toBe('0');
    expect(r.b0HiddenDuration).toBe('0s');
    expect(r.b0Duration).toContain('0.68s');
    // segundo hermano: 1 * 90ms
    expect(r.b1Delay).toContain('0.09s');
  });

  test('4D: al arrancar el motor, un elemento ya pintado se oculta al instante (sin animar hacia oculto)', async ({ page }) => {
    // Fuerza el peor caso: la pagina pinta (estilo calculado) ANTES de que corra theme.js.
    await page.route('**/theme.js', async (route) => {
      await new Promise((r) => setTimeout(r, 150));
      await route.continue();
    });
    await page.goto('/motion.html');
    // muestreo inmediato tras data-reveal-ready: nunca debe verse un valor intermedio
    const samples = await page.evaluate(async () => {
      const b0 = document.getElementById('b0');
      const out = [];
      for (let k = 0; k < 8; k += 1) {
        out.push(getComputedStyle(b0).transform + '|' + getComputedStyle(b0).opacity);
        await new Promise((r) => setTimeout(r, 40));
      }
      return out;
    });
    for (const s of samples) expect(s).toBe('matrix(1, 0, 0, 1, 0, 24)|0');
  });
});
