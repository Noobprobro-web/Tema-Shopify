import { expect, test } from '@playwright/test';

test.describe('4E-002 refinamiento', () => {
  test('about: el texto y los bloques entran con el sistema de movimiento, la imagen del LCP nunca se oculta', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/about.html');
    await page.waitForTimeout(300);

    const start = await page.evaluate(() => {
      const q = (id) => {
        const el = document.getElementById(id);
        return { reveal: el.hasAttribute('data-reveal'), revealed: el.hasAttribute('data-revealed'), opacity: getComputedStyle(el).opacity };
      };
      return {
        ready: document.documentElement.hasAttribute('data-reveal-ready'),
        media: { reveal: document.getElementById('story-media').closest('.main-about__story-media').hasAttribute('data-reveal') },
        text: q('story-text'), quote: q('quote'), v1: q('v1'), g1: q('g1'),
      };
    });
    expect(start.ready, 'el motor arranco').toBe(true);
    // la fotografia del primer bloque es el LCP de la pagina: no entra al reveal
    expect(start.media.reveal, 'la imagen del panel no se oculta jamas').toBe(false);
    // y lo que si entra, entra: el atributo lo pone el motor, no el Liquid
    expect(start.text.reveal).toBe(true);
    expect(start.quote.reveal).toBe(true);
    expect(start.v1.reveal).toBe(true);
    expect(start.g1.reveal).toBe(true);

    // lo que esta bajo el pliegue aparece al llegar, y termina visible del todo
    for (const id of ['quote', 'v1', 'g1']) {
      await page.evaluate((target) => document.getElementById(target).scrollIntoView(), id);
      await page.waitForFunction((target) => getComputedStyle(document.getElementById(target)).opacity === '1', id, { timeout: 4000 });
    }

    // el escalonado reinicia en cada rejilla
    const idx = await page.evaluate(() => ['v1', 'v2', 'v3'].map((id) => document.getElementById(id).style.getPropertyValue('--reveal-index')));
    expect(idx).toEqual(['0', '1', '2']);
  });

  test('about: nada se queda oculto para siempre (el motor observa todo lo que marca)', async ({ page }) => {
    await page.goto('/about.html');
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1200);
    const stuck = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]:not([data-revealed])')]
      .filter((el) => el.getBoundingClientRect().top < window.innerHeight)
      .map((el) => el.id || el.className));
    expect(stuck, 'ningun bloque visible se queda sin revelar').toEqual([]);
  });

  test('faq: el buscador filtra al escribir, retira las categorias vacias y anuncia el conteo', async ({ page }) => {
    await page.goto('/faq.html');
    await page.waitForTimeout(250);

    const state = () => page.evaluate(() => ({
      visible: [...document.querySelectorAll('details')].filter((d) => !d.hidden).map((d) => d.id),
      groups: [...document.querySelectorAll('[data-filter-group]')].filter((g) => !g.hidden).map((g) => g.id),
      status: document.querySelector('[data-filter-status]').textContent.trim(),
      empty: !document.querySelector('[data-filter-empty]').hidden,
    }));

    await page.fill('[data-filter-input]', 'parcel');
    await page.waitForTimeout(250);
    let s = await state();
    expect(s.visible).toEqual(['q-tracking']);
    expect(s.groups, 'la categoria sin resultados se retira entera').toEqual(['grp-ship']);
    expect(s.status).toBe('Matches: 1');
    expect(s.empty).toBe(false);

    // busca tambien en la respuesta, no solo en la pregunta
    await page.fill('[data-filter-input]', 'measurements');
    await page.waitForTimeout(250);
    expect((await state()).visible).toEqual(['q-size']);

    // sin acentos: quien escribe "envio" encuentra "envío"
    await page.fill('[data-filter-input]', 'envio');
    await page.waitForTimeout(250);
    expect((await state()).visible).toEqual(['q-envio']);

    // sin resultados: mensaje visible y cero categorias
    await page.fill('[data-filter-input]', 'zzzz');
    await page.waitForTimeout(250);
    s = await state();
    expect(s.visible).toEqual([]);
    expect(s.groups).toEqual([]);
    expect(s.empty).toBe(true);
    expect(s.status).toBe('Matches: 0');

    // Escape limpia sin perder el foco
    await page.focus('[data-filter-input]');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    s = await state();
    expect(s.visible).toEqual(['q-dispatch', 'q-tracking', 'q-size', 'q-envio']);
    expect(s.groups).toEqual(['grp-ship', 'grp-size']);
    expect(s.status).toBe('');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('q');
  });

  test('faq: sin JavaScript el buscador no aparece y se ven todas las preguntas', async ({ page }) => {
    await page.goto('/faq.html');
    await page.evaluate(() => {
      document.documentElement.classList.remove('js');
      document.documentElement.classList.add('no-js');
    });
    await page.waitForTimeout(150);
    const out = await page.evaluate(() => ({
      searchShown: getComputedStyle(document.querySelector('faq-filter')).display !== 'none',
      questions: [...document.querySelectorAll('details')].filter((d) => !d.hidden).length,
    }));
    expect(out.searchShown).toBe(false);
    expect(out.questions).toBe(4);
  });

  test('faq: al abrir una respuesta entra animada y el indicador gira', async ({ page }) => {
    await page.goto('/faq.html');
    await page.waitForTimeout(250);
    const before = await page.evaluate(() => getComputedStyle(document.querySelector('#q-dispatch .faq-item__icon')).transform);
    await page.click('#q-dispatch summary');
    await page.waitForTimeout(80);
    const during = await page.evaluate(() => {
      const answer = document.querySelector('#q-dispatch .faq-item__answer');
      const cs = getComputedStyle(answer);
      return { animation: cs.animationName, duration: cs.animationDuration };
    });
    expect(during.animation, 'la respuesta entra con su propia animacion').toBe('faq-answer-in');
    expect(during.duration).toContain('0.68s');

    await page.waitForTimeout(800);
    const after = await page.evaluate(() => ({
      icon: getComputedStyle(document.querySelector('#q-dispatch .faq-item__icon')).transform,
      opacity: getComputedStyle(document.querySelector('#q-dispatch .faq-item__answer')).opacity,
      expanded: document.querySelector('#q-dispatch summary').getAttribute('aria-expanded'),
    }));
    expect(after.icon, 'el indicador gira al abrir').not.toBe(before);
    expect(after.opacity, 'y la respuesta queda legible del todo').toBe('1');
    expect(after.expanded).toBe('true');
  });

  test('faq: con animaciones apagadas la respuesta sigue apareciendo entera', async ({ page }) => {
    await page.goto('/faq.html');
    await page.evaluate(() => document.documentElement.setAttribute('data-animations', 'none'));
    await page.waitForTimeout(100);
    await page.click('#q-dispatch summary');
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('#q-dispatch .faq-item__answer')).opacity)).toBe('1');
  });

  test('header: el desplegable se recorre con flechas, Escape cierra y devuelve el foco', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/nav.html');
    await page.waitForTimeout(250);

    const focused = () => page.evaluate(() => document.activeElement?.id);

    // ArrowDown desde el disparador abre y entra
    await page.focus('#nav-trigger');
    await page.keyboard.press('ArrowDown');
    expect(await page.evaluate(() => document.querySelector('#nav-trigger').getAttribute('aria-expanded'))).toBe('true');
    expect(await focused()).toBe('lnk-all');

    await page.keyboard.press('ArrowDown');
    expect(await focused()).toBe('lnk-coats');
    await page.keyboard.press('End');
    expect(await focused()).toBe('lnk-knit');
    // no cicla por abajo
    await page.keyboard.press('ArrowDown');
    expect(await focused()).toBe('lnk-knit');
    await page.keyboard.press('Home');
    expect(await focused()).toBe('lnk-all');
    // por arriba vuelve al disparador, que es donde se sale del menu
    await page.keyboard.press('ArrowUp');
    expect(await focused()).toBe('nav-trigger');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.querySelector('#nav-trigger').getAttribute('aria-expanded'))).toBe('false');
    expect(await focused(), 'Escape devuelve el foco al disparador').toBe('nav-trigger');
  });

  test('header: el panel entra animado y el panel cerrado es inerte', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/nav.html');
    await page.waitForTimeout(250);
    const closed = await page.evaluate(() => {
      const panel = document.getElementById('dm1');
      return { hidden: panel.hidden, inert: panel.inert };
    });
    expect(closed.hidden).toBe(true);
    expect(closed.inert).toBe(true);

    await page.click('#nav-trigger');
    await page.waitForTimeout(60);
    const open = await page.evaluate(() => {
      const cs = getComputedStyle(document.getElementById('dm1'));
      return { animation: cs.animationName, duration: cs.animationDuration, borderColor: cs.borderTopColor };
    });
    expect(open.animation).toBe('desktop-nav-panel-in');
    expect(open.duration).toContain('0.16s');
  });

  test('header: el menu secundario se ve en escritorio y sus enlaces llegan a 44 px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/nav.html');
    await page.waitForTimeout(200);
    const desktop = await page.evaluate(() => ({
      shown: getComputedStyle(document.querySelector('.site-header__secondary')).display !== 'none',
      heights: [...document.querySelectorAll('.site-header__secondary-list a')].map((a) => Math.round(a.getBoundingClientRect().height)),
    }));
    expect(desktop.shown).toBe(true);
    for (const h of desktop.heights) expect(h).toBeGreaterThanOrEqual(44);

    // en movil se retira: esos enlaces viven al pie del menu lateral
    await page.setViewportSize({ width: 390, height: 800 });
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.site-header__secondary')).display)).toBe('none');
  });

  test('documentacion: el copiado deja marca visible y anuncio, y vuelve solo a su estado', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/docs.html');
    await page.waitForTimeout(250);
    const iconShown = () => page.evaluate(() => getComputedStyle(document.querySelector('[data-copy-icon]')).display !== 'none');
    expect(await iconShown(), 'en reposo no hay marca').toBe(false);

    await page.click('[data-copy-trigger]');
    await page.waitForTimeout(150);
    expect(await iconShown(), 'tras copiar aparece la marca').toBe(true);
    expect(await page.evaluate(() => document.querySelector('copy-text').hasAttribute('data-copied'))).toBe(true);
    expect(await page.evaluate(() => document.querySelector('[data-copy-status]').textContent.trim())).toBe('Copied');

    await page.waitForFunction(() => !document.querySelector('copy-text').hasAttribute('data-copied'), null, { timeout: 4000 });
    expect(await iconShown(), 'y se retira sola').toBe(false);
    expect(await page.evaluate(() => document.querySelector('[data-copy-status]').textContent.trim())).toBe('');
  });

  test('documentacion: en movil el indice colapsa al elegir un apartado', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/docs.html');
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => document.querySelector('[data-anchor-disclosure]').open)).toBe(true);
    await page.click('[data-anchor-link][href="#presets"]');
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => document.querySelector('[data-anchor-disclosure]').open), 'se cierra al saltar').toBe(false);

    // en escritorio se queda abierto: ahi la barra lateral es la navegacion permanente
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/docs.html');
    await page.waitForTimeout(250);
    await page.click('[data-anchor-link][href="#presets"]');
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => document.querySelector('[data-anchor-disclosure]').open)).toBe(true);
  });
});
