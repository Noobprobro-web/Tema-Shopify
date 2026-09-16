import { expect, test } from '@playwright/test';

const state = (page) => page.evaluate(() => {
  const input = document.getElementById('Quantity-pdp');
  const stepper = document.querySelector('[data-quantity-stepper]');
  const total = document.querySelector('[data-line-total]');
  return {
    value: input.value,
    min: input.getAttribute('min'),
    step: input.getAttribute('step'),
    max: input.getAttribute('max'),
    minusOff: stepper.querySelector('[data-quantity-button="decrease"]').disabled,
    plusOff: stepper.querySelector('[data-quantity-button="increase"]').disabled,
    total: total.textContent.replace(/\s+/g, ' ').trim(),
    totalHidden: total.hasAttribute('data-empty'),
  };
});

const pick = (page, id) => page.evaluate((optionId) => {
  const input = document.getElementById(optionId);
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}, id);

const press = (page, direction) => page.evaluate((d) => {
  document.querySelector(`[data-quantity-button="${d}"]`).click();
}, direction);

test.describe('4D-003 stepper en la ficha de producto', () => {
  test.use({ viewport: { width: 420, height: 900 } });

  test('el estado inicial lo decide el Liquid: en el minimo el menos nace apagado', async ({ page }) => {
    await page.goto('/pdp.html');
    await page.waitForTimeout(250);
    const s = await state(page);
    expect(s.value).toBe('1');
    expect(s.minusOff, 'valor inicial = minimo, asi que el menos nace apagado').toBe(true);
    expect(s.plusOff).toBe(false);
    // con cantidad 1 no hay total de linea que mostrar
    expect(s.totalHidden).toBe(true);
  });

  test('al cambiar de variante el stepper adopta la rejilla nueva y el total de linea sigue a la cantidad', async ({ page }) => {
    await page.goto('/pdp.html');
    await page.waitForTimeout(250);

    // Ink: min 4, incremento 2, max 10. La cantidad sube sola de 1 a 4.
    await pick(page, 'opt-ink');
    await page.waitForTimeout(150);
    let s = await state(page);
    expect(s.value, 'la cantidad se ajusta al minimo de la variante').toBe('4');
    expect([s.min, s.step, s.max]).toEqual(['4', '2', '10']);
    expect(s.minusOff, 'en el minimo nuevo, el menos se apaga').toBe(true);
    expect(s.plusOff).toBe(false);
    // Esto es lo que se rompia antes: updatePrice() calcula el total ANTES de que
    // updateQuantityRules() mueva la cantidad, asi que el comprador se quedaba sin ver
    // el precio de las 4 unidades que iba a comprar.
    expect(s.totalHidden, 'el total de linea no puede quedarse oculto con cantidad 4').toBe(false);
    expect(s.total).toContain('Total for 4');
    expect(s.total).toContain('$7,560.00');

    // el incremento de la variante manda: 4 -> 6, no 4 -> 5
    await press(page, 'increase');
    await page.waitForTimeout(150);
    s = await state(page);
    expect(s.value).toBe('6');
    expect(s.total).toContain('Total for 6');
    expect(s.total).toContain('$11,340.00');
  });

  test('una variante con maximo mas bajo apaga el mas en vez de dejar pulsar de mas', async ({ page }) => {
    await page.goto('/pdp.html');
    await page.waitForTimeout(250);
    await pick(page, 'opt-ink');
    await page.waitForTimeout(150);
    await press(page, 'increase');
    await page.waitForTimeout(150);
    expect((await state(page)).value).toBe('6');

    // Bone: min 1, incremento 1, max 6. La cantidad 6 ya esta en el tope.
    await pick(page, 'opt-bone');
    await page.waitForTimeout(150);
    const s = await state(page);
    expect(s.value).toBe('6');
    expect([s.min, s.step, s.max]).toEqual(['1', '1', '6']);
    expect(s.plusOff, 'con la cantidad en el maximo de la variante nueva, el mas se apaga').toBe(true);
    expect(s.minusOff).toBe(false);

    // y pulsarlo no mueve nada
    await press(page, 'increase');
    await page.waitForTimeout(150);
    expect((await state(page)).value).toBe('6');
  });

  test('el stepper de la ficha no desborda ni pierde el area tactil de 44 px', async ({ page }) => {
    await page.goto('/pdp.html');
    await page.waitForTimeout(250);
    const box = await page.evaluate(() => {
      const stepper = document.querySelector('[data-quantity-stepper]');
      const wrap = document.querySelector('.product-form__quantity');
      return {
        buttons: [...stepper.querySelectorAll('[data-quantity-button]')].map((b) => {
          const r = b.getBoundingClientRect();
          return [Math.round(r.width), Math.round(r.height)];
        }),
        stepperRight: Math.round(stepper.getBoundingClientRect().right),
        wrapRight: Math.round(wrap.getBoundingClientRect().right),
        docScrollW: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      };
    });
    for (const [w, h] of box.buttons) {
      expect(w).toBeGreaterThanOrEqual(44);
      expect(h).toBeGreaterThanOrEqual(44);
    }
    expect(box.stepperRight).toBeLessThanOrEqual(box.wrapRight);
    expect(box.docScrollW, 'sin scroll horizontal de pagina').toBeLessThanOrEqual(box.viewport);
  });
});
