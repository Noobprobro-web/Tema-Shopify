import { test, expect } from '@playwright/test';

/* Sprint 5B-001. Fichas renderizadas desde el Liquid real (render5b.mjs) con theme.js,
   product-zoom.js y base.css reales. SITE=site (ingles), site-es (espanol) o site-before
   (arbol previo, para ver que las pruebas detectan la ausencia del zoom y los defectos). */
const SITE = process.env.SITE || 'site';
const ES = SITE.endsWith('-es');
const L = ES
  ? { status: (i, t, z) => `Imagen ${i} de ${t}, zoom ${z} %`, image: (i, t) => `Imagen ${i} de ${t}`, open: (i, t) => `Ampliar imagen ${i} de ${t}` }
  : { status: (i, t, z) => `Image ${i} of ${t}, zoom ${z}%`, image: (i, t) => `Image ${i} of ${t}`, open: (i, t) => `Zoom image ${i} of ${t}` };
const HIGH_RES = /zoom-(large|demo|soft|small|single|yt-a|yt-b)\.png\?width=(\d+)/;

async function go(page, file, w = 1280, h = 900) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`/${SITE}/${file}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}
const trigger = (page, n) => page.locator('[data-zoom-open]').nth(n);
const dialog = (page) => page.locator('dialog.product-zoom');
async function openZoom(page, n = 0) {
  await trigger(page, n).click();
  await expect(dialog(page)).toHaveAttribute('open', '');
}
// Estado leido del propio componente y de la transformacion calculada de la foto actual,
// una vez terminada la transicion de transform (var(--motion-fast)).
const state = (page) => page.evaluate(async () => {
  const zoom = document.querySelector('product-zoom');
  const img = zoom.fit?.img;
  if (img) {
    getComputedStyle(img).transform;
    await Promise.all(img.getAnimations().map((animation) => animation.finished.catch(() => {})));
  }
  const transform = img ? getComputedStyle(img).transform : 'none';
  const matrix = new DOMMatrixReadOnly(transform === 'none' ? undefined : transform);
  return {
    open: zoom.dialog.open, index: zoom.index, scale: zoom.scale, max: zoom.fit?.max, x: zoom.x, y: zoom.y,
    matrixScale: matrix.a, counter: zoom.counter.textContent.trim(), status: zoom.output.textContent.trim(),
    zoomable: zoom.dialog.hasAttribute('data-zoomable'), active: document.activeElement?.outerHTML.slice(0, 80),
  };
});
const highResRequests = (urls) => urls.map((u) => u.match(HIGH_RES)).filter((m) => m && Number(m[2]) >= 1600).map((m) => `${m[1]}@${m[2]}`);

test.describe(`5B-001 zoom (${SITE})`, () => {
  test('Z1 cero peticiones de alta resolucion antes de abrir; al abrir, la actual (high) y sus vecinas', async ({ page }) => {
    const urls = [];
    page.on('request', (request) => urls.push(request.url()));
    await go(page, 'pdp-zoom.html');
    await page.mouse.wheel(0, 2500);
    await page.waitForTimeout(400);
    await page.mouse.wheel(0, -2500);
    await page.waitForLoadState('networkidle');
    expect(highResRequests(urls)).toEqual([]);
    expect(await page.locator('.product-zoom__image[srcset]').count()).toBe(0);

    await openZoom(page, 0);
    await page.waitForLoadState('networkidle');
    const after = highResRequests(urls);
    expect(after.some((r) => r.startsWith('large@'))).toBe(true);
    expect(after.some((r) => r.startsWith('demo@'))).toBe(true);
    expect(after.some((r) => r.startsWith('soft@') || r.startsWith('small@'))).toBe(false);
    expect(await page.locator('.product-zoom__image').first().evaluate((img) => img.fetchPriority)).toBe('high');
  });

  test('Z2 el zoom nunca pasa de min(3, natural / pintado); una foto de 600 px no se amplia', async ({ page }) => {
    const urls = [];
    page.on('request', (request) => urls.push(request.url()));
    await go(page, 'pdp-zoom.html');
    await openZoom(page, 0);
    for (let i = 0; i < 5; i += 1) await page.keyboard.press('+');
    let s = await state(page);
    expect(s.max).toBe(3);
    expect(s.scale).toBe(3);
    expect(s.matrixScale).toBeCloseTo(3, 2);
    // Al ampliar, sizes pide el ancho del zoom maximo y llega un candidato mayor que 1600.
    await page.waitForLoadState('networkidle');
    expect(highResRequests(urls).some((r) => /^large@(2000|2400|3000)$/.test(r))).toBe(true);

    await page.keyboard.press('0');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    s = await state(page);
    expect(s.index).toBe(2);
    expect(s.max).toBeGreaterThan(1.25);
    expect(s.max).toBeLessThan(1.6);
    for (let i = 0; i < 4; i += 1) await page.keyboard.press('+');
    s = await state(page);
    expect(s.scale).toBeCloseTo(s.max, 5);
    expect(s.matrixScale).toBeLessThanOrEqual(s.max + 0.001);

    await page.keyboard.press('End');
    s = await state(page);
    expect(s.index).toBe(3);
    expect(s.max).toBe(1);
    expect(s.zoomable).toBe(false);
    await expect(page.locator('[data-zoom-in]')).toBeDisabled();
    await page.keyboard.press('+');
    await page.locator('.product-zoom__image').nth(3).click();
    s = await state(page);
    expect(s.scale).toBe(1);
    expect(s.open).toBe(true);
  });

  test('Z3 Escape, Cerrar y clic en el fondo cierran y devuelven el foco al disparador exacto', async ({ page }) => {
    await go(page, 'pdp-zoom.html');
    const opener = trigger(page, 1);
    await opener.focus();
    await page.keyboard.press('Enter');
    await expect(dialog(page)).toHaveAttribute('open', '');
    await expect(page.locator('[data-zoom-close]')).toBeFocused();
    await expect(page.locator('body')).toHaveAttribute('data-modal-open', '');
    await page.keyboard.press('Escape');
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(opener).toBeFocused();
    await expect(page.locator('body')).not.toHaveAttribute('data-modal-open', '');

    await opener.click();
    await page.locator('[data-zoom-close]').click();
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(opener).toBeFocused();

    await opener.click();
    const box = await page.locator('[data-zoom-track]').boundingBox();
    await page.mouse.click(box.x + 20, box.y + box.height / 2);
    await expect(dialog(page)).not.toHaveAttribute('open', '');
    await expect(opener).toBeFocused();
  });

  for (const [w, h] of [[1280, 900], [390, 844]]) {
    test(`Z4 ${w}px: Tab no sale del visor y todos sus controles miden 44 x 44 o mas`, async ({ page }) => {
      await go(page, 'pdp-zoom.html', w, h);
      await openZoom(page, 1);
      await page.keyboard.press('+');
      const sizes = await page.locator('dialog.product-zoom button:visible').evaluateAll((buttons) => buttons.map((b) => {
        const r = b.getBoundingClientRect();
        return [b.getAttribute('aria-label') || b.textContent.trim(), Math.round(r.width), Math.round(r.height)];
      }));
      expect(sizes.length).toBeGreaterThanOrEqual(6);
      for (const [, bw, bh] of sizes) {
        expect(bw).toBeGreaterThanOrEqual(44);
        expect(bh).toBeGreaterThanOrEqual(44);
      }
      for (const key of ['Tab', 'Shift+Tab']) {
        for (let i = 0; i < 10; i += 1) {
          await page.keyboard.press(key);
          expect(await page.evaluate(() => document.querySelector('dialog.product-zoom').contains(document.activeElement))).toBe(true);
        }
      }
    });
  }

  test('Z5 teclado: +, -, 0, flechas, Home, End y anuncios de foto y zoom', async ({ page }) => {
    await go(page, 'pdp-zoom.html');
    await openZoom(page, 0);
    let s = await state(page);
    expect(s.counter).toBe('1 / 4');
    expect(s.status).toBe(L.status(1, 4, 100));
    await page.keyboard.press('+');
    expect((await state(page)).status).toBe(L.status(1, 4, 150));
    await page.keyboard.press('-');
    expect((await state(page)).status).toBe(L.status(1, 4, 100));
    await page.keyboard.press('+');
    await page.keyboard.press('0');
    expect((await state(page)).scale).toBe(1);
    await page.keyboard.press('ArrowRight');
    s = await state(page);
    expect(s.counter).toBe('2 / 4');
    expect(s.status).toBe(L.status(2, 4, 100));
    await page.keyboard.press('End');
    expect((await state(page)).counter).toBe('4 / 4');
    await page.keyboard.press('Home');
    expect((await state(page)).counter).toBe('1 / 4');
    // Con zoom, las flechas desplazan la foto y no cambian de imagen.
    await page.keyboard.press('+');
    await page.keyboard.press('+');
    const before = await state(page);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    const after = await state(page);
    expect(after.index).toBe(0);
    expect(after.x).toBeLessThan(before.x);
    expect(after.y).toBeLessThan(before.y);
  });

  // 5B-002, F01 (GPT-AUDIT-007). Un boton enfocado que se oculta o se desactiva deja el foco en
  // body si nadie lo mueve antes. focusout con relatedTarget fuera del dialogo abierto = foco perdido,
  // aunque un arreglo posterior lo devuelva dentro en la misma tarea.
  const watchFocus = (page) => page.evaluate(() => {
    window.__lost = [];
    const zoomDialog = document.querySelector('dialog.product-zoom');
    zoomDialog.addEventListener('focusout', (event) => {
      if (zoomDialog.open && !zoomDialog.contains(event.relatedTarget)) {
        window.__lost.push(event.target.getAttribute('aria-label') || event.target.textContent.trim());
      }
    });
  });
  const focusState = (page) => page.evaluate(() => {
    const zoomDialog = document.querySelector('dialog.product-zoom');
    const active = document.activeElement;
    return {
      open: zoomDialog.open, inside: zoomDialog.contains(active), tag: active.tagName, lost: window.__lost,
      hook: ['in', 'out', 'reset', 'close', 'step'].find((name) => active.hasAttribute(`data-zoom-${name}`)) || null,
      step: active.dataset.zoomStep || null, scale: document.querySelector('product-zoom').scale,
    };
  });

  for (const [w, h] of [[1280, 800], [360, 800]]) {
    for (const how of ['click', 'Enter', 'Space']) {
      test(`F01 ${w}px ${how}: Reset zoom devuelve 1x y el foco sigue dentro del visor, en Acercar`, async ({ page }) => {
        await go(page, 'pdp-zoom.html', w, h);
        await openZoom(page, 0);
        await watchFocus(page);
        await page.locator('[data-zoom-in]').click();
        const reset = page.locator('[data-zoom-reset]');
        await expect(reset).toBeVisible();
        if (how === 'click') {
          await reset.click();
        } else {
          await reset.focus();
          await page.keyboard.press(how);
        }
        const s = await focusState(page);
        expect(s.scale).toBe(1);
        expect(s.open).toBe(true);
        expect(s.inside).toBe(true);
        expect(s.tag).not.toBe('BODY');
        expect(s.hook).toBe('in');
        expect(s.lost).toEqual([]);
        await expect(reset).toBeHidden();
        // Tab sigue atrapado despues del Reset.
        for (let i = 0; i < 8; i += 1) {
          await page.keyboard.press('Tab');
          expect((await focusState(page)).inside).toBe(true);
        }
      });
    }

    test(`F01 ${w}px: Acercar al maximo, Alejar a 1x y Siguiente al final no pierden el foco`, async ({ page }) => {
      await go(page, 'pdp-zoom.html', w, h);
      await openZoom(page, 0);
      await watchFocus(page);
      // Acercar con Enter hasta el maximo (3x): el boton se desactiva y el foco pasa a Alejar, no a Cerrar,
      // para que un Enter mas no cierre el visor.
      await page.locator('[data-zoom-in]').focus();
      for (let i = 0; i < 3; i += 1) await page.keyboard.press('Enter');
      let s = await focusState(page);
      expect(s.scale).toBe(3);
      await expect(page.locator('[data-zoom-in]')).toBeDisabled();
      expect([s.inside, s.hook, s.lost]).toEqual([true, 'out', []]);
      // Alejar con Espacio hasta 1x: Alejar y Reset se desactivan u ocultan; el foco pasa a Acercar.
      for (let i = 0; i < 3; i += 1) await page.keyboard.press('Space');
      s = await focusState(page);
      expect(s.scale).toBe(1);
      expect([s.inside, s.hook, s.lost]).toEqual([true, 'in', []]);
      // Siguiente con Enter hasta la ultima foto: el boton se desactiva y el foco pasa a Anterior.
      await page.locator('[data-zoom-step="1"]').focus();
      for (let i = 0; i < 3; i += 1) await page.keyboard.press('Enter');
      s = await focusState(page);
      expect(s.inside).toBe(true);
      expect(s.hook).toBe('step');
      expect(s.step).toBe('-1');
      expect(s.lost).toEqual([]);
      await expect(page.locator('[data-zoom-step="1"]')).toBeDisabled();
      // Y Anterior hasta la primera: el foco vuelve a Siguiente.
      for (let i = 0; i < 3; i += 1) await page.keyboard.press('Enter');
      s = await focusState(page);
      expect([s.inside, s.hook, s.step, s.lost]).toEqual([true, 'step', '1', []]);
    });
  }

  test('F01 salvaguarda: con el visor abierto y el foco fuera, la siguiente actualizacion lo devuelve dentro', async ({ page }) => {
    await go(page, 'pdp-zoom.html');
    await openZoom(page, 0);
    const result = await page.evaluate(() => {
      const zoom = document.querySelector('product-zoom');
      document.activeElement.blur();
      const before = document.activeElement.tagName;
      zoom.zoomTo(1.5);
      const active = document.activeElement;
      return { before, inside: zoom.dialog.contains(active), isIn: active === zoom.inButton, open: zoom.dialog.open };
    });
    expect(result).toEqual({ before: 'BODY', inside: true, isIn: true, open: true });
  });

  // 5C-001, P2-01 (GPT-AUDIT-008). Al girar el movil o redimensionar, el zoom maximo puede bajar
  // y la escala se ajusta; la region viva tiene que anunciar el porcentaje nuevo.
  test('P2-01 resize 390 -> 1280 con la foto de 928 px a 225 %: se anuncia el zoom reajustado y el foco sigue dentro', async ({ page }) => {
    await go(page, 'pdp-zoom.html', 390, 844);
    await openZoom(page, 2);
    await page.locator('[data-zoom-in]').focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    let s = await state(page);
    expect(s.index).toBe(2);
    expect(s.scale).toBeCloseTo(2.25, 5);
    expect(s.status).toBe(L.status(3, 4, 225));
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect.poll(async () => (await state(page)).max, { timeout: 3000 }).toBeLessThan(2.25);
    s = await state(page);
    expect(s.scale).toBeCloseTo(s.max, 5);
    expect(s.matrixScale).toBeCloseTo(s.max, 2);
    expect(s.status).toBe(L.status(3, 4, Math.round(s.max * 100)));
    await expect(page.locator('[data-zoom-in]')).toBeDisabled();
    await expect(page.locator('[data-zoom-out]')).toBeFocused();
    // Un resize que no cambia la escala no repite el anuncio.
    await page.evaluate(() => { document.querySelector('[data-zoom-status]').textContent = 'sin cambios'; });
    await page.setViewportSize({ width: 1280, height: 801 });
    await page.waitForTimeout(200);
    expect((await state(page)).status).toBe('sin cambios');
  });

  test('Z6 raton: clic alterna en el punto y el zoom sigue al cursor', async ({ page }) => {
    await go(page, 'pdp-zoom.html');
    await openZoom(page, 0);
    const image = page.locator('.product-zoom__image').first();
    const box = await image.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    let s = await state(page);
    expect(s.scale).toBe(3);
    const track = await page.locator('[data-zoom-track]').boundingBox();
    await page.mouse.move(track.x + 5, track.y + track.height / 2);
    const left = await state(page);
    await page.mouse.move(track.x + track.width - 5, track.y + track.height / 2);
    const right = await state(page);
    expect(left.x).toBeGreaterThan(0);
    expect(right.x).toBeLessThan(0);
    await page.mouse.click(track.x + track.width / 2, track.y + track.height / 2);
    s = await state(page);
    expect(s.scale).toBe(1);
    expect(s.open).toBe(true);
  });

  test('Z7 tactil 390: doble toque, pellizco, arrastre, restablecer y deslizar entre fotos', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, baseURL: test.info().project.use.baseURL });
    const page = await context.newPage();
    await page.goto(`/${SITE}/pdp-zoom.html`, { waitUntil: 'networkidle' });
    const cdp = await context.newCDPSession(page);
    const touch = (type, points) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points.map(([x, y], id) => ({ x, y, id })) });
    const tapAt = async (x, y) => { await touch('touchStart', [[x, y]]); await touch('touchEnd', []); };

    const opener = trigger(page, 0);
    await opener.scrollIntoViewIfNeeded();
    const tbox = await opener.boundingBox();
    await tapAt(tbox.x + tbox.width / 2, tbox.y + tbox.height / 2);
    await expect(dialog(page)).toHaveAttribute('open', '');
    const img = await page.locator('.product-zoom__image').first().boundingBox();
    const cx = img.x + img.width / 2;
    const cy = img.y + img.height / 2;

    await tapAt(cx, cy);
    await page.waitForTimeout(80);
    await tapAt(cx, cy);
    let s = await state(page);
    expect(s.scale).toBe(s.max);
    await page.waitForTimeout(400);
    await tapAt(cx, cy);
    await page.waitForTimeout(80);
    await tapAt(cx, cy);
    expect((await state(page)).scale).toBe(1);

    // Pellizco fuera del centro: el punto medio de los dos dedos queda fijo, x = P (1 - escala).
    await page.waitForTimeout(400);
    const track = await page.locator('[data-zoom-track]').boundingBox();
    const [px, py] = [cx + 50, cy + 40];
    await touch('touchStart', [[px - 20, py], [px + 20, py]]);
    for (let d = 30; d <= 90; d += 10) await touch('touchMove', [[px - d, py], [px + d, py]]);
    await touch('touchEnd', []);
    s = await state(page);
    expect(s.scale).toBeGreaterThan(1.5);
    expect(s.scale).toBeLessThanOrEqual(s.max);
    expect(s.x).toBeCloseTo((px - track.x - track.width / 2) * (1 - s.scale), 0);
    expect(s.y).toBeCloseTo((py - track.y - track.height / 2) * (1 - s.scale), 0);
    expect(s.status).toBe(L.status(1, 4, Math.round(s.scale * 100)));

    const x0 = s.x;
    await touch('touchStart', [[cx, cy]]);
    for (let d = 10; d <= 60; d += 10) await touch('touchMove', [[cx + d, cy]]);
    await touch('touchEnd', []);
    s = await state(page);
    expect(s.x).toBeGreaterThan(x0);
    expect(s.index).toBe(0);

    const reset = page.locator('[data-zoom-reset]');
    await expect(reset).toBeVisible();
    const rbox = await reset.boundingBox();
    await tapAt(rbox.x + rbox.width / 2, rbox.y + rbox.height / 2);
    expect((await state(page)).scale).toBe(1);
    await expect(reset).toBeHidden();

    // A 1x el dedo desliza la pista (touch-action: pan-x) y cambia de foto.
    await page.waitForTimeout(400);
    await touch('touchStart', [[330, cy]]);
    for (let x = 300; x >= 40; x -= 20) await touch('touchMove', [[x, cy]]);
    await touch('touchEnd', []);
    await expect.poll(async () => (await state(page)).index, { timeout: 3000 }).toBe(1);

    // Un toque fuera de la foto a 1x cierra (tras la ventana del doble toque) y el foco vuelve al disparador.
    await page.waitForTimeout(400);
    await tapAt(track.x + track.width / 2, track.y + 8);
    await expect(dialog(page)).toHaveAttribute('open', '');
    await expect(dialog(page)).not.toHaveAttribute('open', '', { timeout: 2000 });
    await expect(opener).toBeFocused();
    await context.close();
  });

  test('Z8 movimiento reducido: cambio de foto instantaneo y sin transicion de escala', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', baseURL: test.info().project.use.baseURL });
    const page = await context.newPage();
    await page.goto(`/${SITE}/pdp-zoom.html`, { waitUntil: 'networkidle' });
    await openZoom(page, 0);
    await page.keyboard.press('ArrowRight');
    const scroll = await page.locator('[data-zoom-track]').evaluate((t) => [t.scrollLeft, t.clientWidth]);
    expect(Math.abs(scroll[0] - scroll[1])).toBeLessThanOrEqual(1);
    const duration = await page.locator('.product-zoom__image').nth(1).evaluate((img) => parseFloat(getComputedStyle(img).transitionDuration));
    expect(duration).toBeLessThanOrEqual(0.001);
    await context.close();
  });

  test('Z9 H-13: el carrusel movil pausa el video y el reproductor de YouTube al deslizar; sin zoom en video', async ({ page }) => {
    await go(page, 'pdp-zoom.html', 390, 844);
    await expect(page.locator('[data-product-media-id="8103"] [data-zoom-open]')).toHaveCount(0);
    await page.evaluate(() => {
      window.__paused = 0;
      const original = HTMLMediaElement.prototype.pause;
      HTMLMediaElement.prototype.pause = function pause() { window.__paused += 1; return original.call(this); };
    });
    const next = page.locator('[data-gallery-step="1"]');
    await next.click();
    await next.click();
    await page.waitForTimeout(500);
    const pausedBefore = await page.evaluate(() => window.__paused);
    await next.click();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.__paused)).toBeGreaterThan(pausedBefore);

    await go(page, 'pdp-zoom-youtube.html', 390, 844);
    await expect(page.locator('[data-product-media-id="8302"] [data-zoom-open]')).toHaveCount(0);
    await page.locator('[data-gallery-step="1"]').click();
    await page.waitForTimeout(500);
    await page.locator('[data-gallery-step="1"]').click();
    await page.waitForTimeout(500);
    const messages = await page.locator('[data-product-media-id="8302"] iframe').evaluate((frame) => frame.contentWindow.__messages);
    expect(messages).toContain('{"event":"command","func":"pauseVideo","args":""}');
  });

  test('Z10 H-07: en rejilla cada foto pide su media columna; la primera impar y la pila, 60vw', async ({ page }) => {
    await go(page, 'pdp-zoom.html');
    const gallery = page.locator('.product-gallery__image');
    await expect(gallery.nth(1)).toHaveAttribute('sizes', '(min-width: 62rem) 30vw, 100vw');
    await expect(gallery.nth(0)).toHaveAttribute('sizes', '(min-width: 62rem) 60vw, 100vw');
    await gallery.nth(1).scrollIntoViewIfNeeded();
    await expect.poll(() => gallery.nth(1).evaluate((img) => img.currentSrc)).toMatch(/width=/);
    const width = await gallery.nth(1).evaluate((img) => [Number(new URL(img.currentSrc).searchParams.get('width')), img.getBoundingClientRect().width]);
    expect(width[0]).toBeLessThanOrEqual(640);
    expect(width[0]).toBeGreaterThanOrEqual(width[1]);
    await go(page, 'pdp-zoom-stack.html');
    for (const sizes of await page.locator('.product-gallery__image').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('sizes')))) {
      expect(sizes).toBe('(min-width: 62rem) 60vw, 100vw');
    }
  });

  test('Z11 H-19: alt secuencial sin alt del catalogo, alt real intacto, una sola foto con el titulo', async ({ page }) => {
    await go(page, 'pdp-zoom.html');
    const expected = [`Serra Coat – ${L.image(1, 5)}`, `Serra Coat – ${L.image(2, 5)}`, 'Detail of the collar', `Serra Coat – ${L.image(5, 5)}`];
    expect(await page.locator('.product-gallery__image').evaluateAll((imgs) => imgs.map((i) => i.alt))).toEqual(expected);
    expect(await page.locator('.product-zoom__image').evaluateAll((imgs) => imgs.map((i) => i.alt))).toEqual(expected);
    await expect(trigger(page, 2)).toHaveAttribute('aria-label', L.open(3, 4));
    await go(page, 'pdp-zoom-single.html');
    expect(await page.locator('.product-gallery__image').first().getAttribute('alt')).toBe('Wool Waistcoat');
    await openZoom(page, 0);
    await expect(page.locator('[data-zoom-step]').first()).toBeDisabled();
    await expect(page.locator('[data-zoom-step]').last()).toBeDisabled();
    expect((await state(page)).counter).toBe('1 / 1');
  });

  test('Z12 ajuste apagado y resto de paginas: sin disparadores, sin visor y 0 bytes de product-zoom.js', async ({ page }) => {
    const urls = [];
    page.on('request', (request) => urls.push(request.url()));
    await go(page, 'pdp-zoom-off.html');
    await expect(page.locator('[data-zoom-open]')).toHaveCount(0);
    await expect(page.locator('product-zoom')).toHaveCount(0);
    await go(page, 'collection.html');
    expect(urls.filter((u) => u.includes('product-zoom.js'))).toEqual([]);
    await go(page, 'pdp-zoom.html');
    expect(urls.filter((u) => u.includes('product-zoom.js')).length).toBe(1);
  });

  test('Z13 CLS 0 al abrir y cerrar el visor', async ({ page }) => {
    await go(page, 'pdp-zoom.html');
    await page.evaluate(() => {
      window.__shift = 0;
      new PerformanceObserver((list) => list.getEntries().forEach((e) => { window.__shift += e.value; })).observe({ type: 'layout-shift' });
    });
    await openZoom(page, 1);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.__shift)).toBe(0);
  });

  for (const [w, h] of [[1280, 900], [390, 844]]) {
    test(`AXE ${w}px con el visor abierto y ampliado: 0 violaciones WCAG 2.2 AA`, async ({ page }) => {
      await go(page, 'pdp-zoom.html', w, h);
      await openZoom(page, 0);
      await page.keyboard.press('+');
      await page.addScriptTag({ url: `/${SITE}/axe.min.js` });
      const violations = await page.evaluate(async () => {
        const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
        return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
      });
      expect(violations).toEqual([]);
    });
  }
});
