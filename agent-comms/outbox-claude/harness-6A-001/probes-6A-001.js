/* CLAUDE-DIRECTIVE-6A-001. Sondas que se ejecutaron en la tienda viva (tema-qkqpke0j.myshopify.com),
   en la pestaña del storefront con sesión abierta y ?preview_theme_id=<tema>.
   Couture 165809488115 y Sartorial 166186909939, a 1280x800, 375x812 y 360x780, en / y /es/.

   Notas de entorno (ver informe §6):
   - El panel del navegador integrado puede quedar oculto (document.visibilityState = 'hidden'). Ahí Chrome
     no ejecuta requestAnimationFrame y agrupa los setTimeout a ~1 s. trapFocus() enfoca el input dentro
     de un rAF, así que antes de abrir el diálogo se instala un rAF de prueba con setTimeout(16).
   - Las pulsaciones reales (ArrowDown, ArrowUp, Home, End, Escape, Tab, Shift+Tab, Enter) se enviaron con
     la herramienta de teclado del navegador; __kb() solo lee el estado entre pulsaciones.
   - Ninguna sonda escribe en la tienda. Los envíos (idioma, carrito) se hicieron aparte, con permiso. */

/* ---------- Track 1: búsqueda predictiva ---------- */
window.__sleep = (ms) => new Promise((r) => setTimeout(r, ms));
window.__ps = () => document.querySelector('predictive-search');
window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16); // solo con el panel oculto

window.__psState = () => {
  const ps = __ps();
  const trig = [...document.querySelectorAll('[data-predictive-search-open]')].find((t) => t.getClientRects().length);
  const panel = ps.querySelector('[role="dialog"]');
  const input = ps.querySelector('input[type="search"]');
  const ov = ps.querySelector('[data-predictive-search-overlay]');
  const a = document.activeElement;
  const pr = panel.getBoundingClientRect();
  return {
    trigAE: trig && trig.getAttribute('aria-expanded'),
    panelAH: panel.getAttribute('aria-hidden'),
    panelInert: panel.hasAttribute('inert'),
    overlayHidden: ov ? ov.hidden : null,
    focus: a === input ? 'input[type=search]' : (a.getAttribute('aria-label') || a.tagName).toString().slice(0, 60),
    focusInPanel: panel.contains(a),
    bodyOverflow: getComputedStyle(document.body).overflow,
    bodyAttrs: [...document.body.attributes].filter((x) => /modal|lock|open/i.test(x.name)).map((x) => x.name).join(' '),
    inertSiblings: [...document.body.children].filter((c) => c.hasAttribute('inert')).map((c) => c.id || c.tagName.toLowerCase()),
    panelRect: [Math.round(pr.left), Math.round(pr.top), Math.round(pr.width), Math.round(pr.height)],
    input: { type: input.type, role: input.getAttribute('role'), ae: input.getAttribute('aria-expanded'), ad: input.getAttribute('aria-activedescendant') },
    hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
};

window.__psOpen = async () => {
  [...document.querySelectorAll('[data-predictive-search-open]')].find((t) => t.getClientRects().length).click();
  await __sleep(500);
  return __psState();
};

// Registro de peticiones a /search/suggest para medir el debounce.
window.__fetchLog = [];
if (!window.__fetchWrapped) {
  const of = window.fetch;
  window.fetch = function (u) {
    const s = String((u && u.url) || u);
    if (s.includes('/search/suggest')) window.__fetchLog.push({ t: Math.round(performance.now()), u: s });
    return of.apply(this, arguments);
  };
  window.__fetchWrapped = true;
}

// Ráfaga síncrona de 4 input events: debe salir 1 sola petición con el término final.
window.__psBurst = async () => {
  const input = __ps().querySelector('input[type="search"]');
  const typeAt = (v) => { input.value = v; input.dispatchEvent(new Event('input', { bubbles: true })); return performance.now(); };
  window.__fetchLog = []; typeAt(''); let last;
  for (const v of ['w', 'wo', 'woo', 'wool']) last = typeAt(v);
  await __sleep(1500);
  return { calls: __fetchLog.length, q: __fetchLog.map((f) => new URL(f.u, location.origin).searchParams.get('q')), delayMs: __fetchLog[0] ? Math.round(__fetchLog[0].t - last) : null };
};

window.__psSet = async (term, wait = 1800) => {
  const input = __ps().querySelector('input[type="search"]');
  input.focus(); input.value = term;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await __sleep(wait);
  return __psRender();
};

window.__psRender = () => {
  const ps = __ps();
  const res = ps.querySelector('[role="listbox"]');
  const pr = ps.querySelector('[role="dialog"]').getBoundingClientRect();
  const groups = [...res.querySelectorAll('[role="group"]')].map((g) => {
    const h = g.querySelector('h2,h3');
    const opts = [...g.querySelectorAll('[role="option"]')];
    return {
      heading: h && h.textContent.trim(),
      labelledOk: !!(h && g.getAttribute('aria-labelledby') === h.id),
      n: opts.length,
      first: opts.slice(0, 2).map((o) => {
        const img = o.querySelector('img');
        return {
          href: o.getAttribute('href'),
          text: o.textContent.replace(/\s+/g, ' ').trim().slice(0, 90),
          srcsetW: img ? (img.getAttribute('srcset') || '').split(',').map((s) => (s.match(/width=(\d+)/) || [])[1]).join('/') : null,
          sizes: img && img.getAttribute('sizes'),
        };
      }),
    };
  });
  const empty = ps.querySelector('.predictive-search__empty');
  const va = ps.querySelector('.predictive-search__view-all');
  const outside = [...ps.querySelectorAll('[role="dialog"] *')].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width && (r.right > pr.right + 1 || r.left < pr.left - 1);
  }).length;
  return {
    status: ps.querySelector('[role="status"]').textContent.trim(),
    inputAE: ps.querySelector('input[type="search"]').getAttribute('aria-expanded'),
    groups,
    empty: empty && empty.textContent.trim(),
    viewAll: va && { href: va.getAttribute('href'), text: va.textContent.trim() },
    outsidePanel: outside,
    hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
};

window.__kb = () => {
  const ps = __ps(); const input = ps.querySelector('input[type="search"]');
  const sel = [...ps.querySelectorAll('[role="option"][aria-selected="true"]')];
  return {
    focus: document.activeElement === input ? 'input' : document.activeElement.tagName,
    ad: input.getAttribute('aria-activedescendant'),
    selected: sel.map((s) => s.id.split('-').pop() + ':' + s.textContent.replace(/\s+/g, ' ').trim().slice(0, 30)),
    open: ps.hasAttribute('data-open'), value: input.value, url: location.pathname,
  };
};

// Entidad articles: la tienda no tiene artículos publicados (/blogs/news vacío). Se sustituye la
// respuesta de /search/suggest en el cliente por la real de "the" más 1 artículo de prueba, para
// comprobar que renderResults dibuja el grupo "Journal"/"Diario". No toca la tienda.
window.__psMockArticle = async () => {
  const real = await fetch('/search/suggest.json?q=the&resources[type]=product,collection,page,article&resources[limit]=8&resources[limit_scope]=all&resources[options][unavailable_products]=last').then((r) => r.json());
  const mock = JSON.parse(JSON.stringify(real));
  mock.resources.results.articles = [{ title: 'Notes on double-faced wool', url: '/blogs/news/notes-on-double-faced-wool', handle: 'notes-on-double-faced-wool', image: real.resources.results.products[0].image }];
  const of = window.fetch;
  window.fetch = function (u) {
    if (String((u && u.url) || u).includes('/search/suggest')) return Promise.resolve(new Response(JSON.stringify(mock), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    return of.apply(this, arguments);
  };
  const r = await __psSet('thea', 1800);
  window.fetch = of;
  return { status: r.status, groups: r.groups.map((g) => g.heading + ':' + g.n) };
};

// Móvil: disparador, panel a pantalla completa, botones de 44 px, término largo y vacío.
window.__psMobile = async () => {
  const s = await __psOpen(); const ps = __ps(); const i = ps.querySelector('input[type=search]'); const ir = i.getBoundingClientRect();
  const out = { vw: innerWidth, locale: Shopify.locale, open: { trigAE: s.trigAE, focus: s.focus, panelRect: s.panelRect, bodyOverflow: s.bodyOverflow, inputRect: [Math.round(ir.left), Math.round(ir.right), Math.round(ir.height)], inputFont: getComputedStyle(i).fontSize } };
  const r1 = await __psSet('coat');
  out.btns = [...ps.querySelectorAll('[role=dialog] button')].filter((b) => b.getClientRects().length && !b.hidden).map((b) => (b.getAttribute('aria-label') || b.textContent.trim()) + ' ' + Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height));
  out.coat = { status: r1.status, outside: r1.outsidePanel, hScroll: r1.hScroll };
  const r2 = await __psSet('doublefacedwoolandcashmerebeltedwrapcoatwithraglansleeves concealed placket');
  const vr = ps.querySelector('.predictive-search__view-all').getBoundingClientRect();
  out.long = { outside: r2.outsidePanel, hScroll: r2.hScroll, viewAll: [Math.round(vr.left), Math.round(vr.right), Math.round(vr.height)] };
  const r3 = await __psSet('xyznoresults999'); out.none = { empty: r3.empty, hScroll: r3.hScroll };
  ps.querySelector('[data-predictive-search-close]').click(); await __sleep(400);
  const c = __psState(); out.closed = { trigAE: c.trigAE, focus: c.focus, bodyOverflow: c.bodyOverflow, inert: c.inertSiblings.length };
  return out;
};

// axe-core 4.10.2 (cdnjs) sobre el panel abierto: con resultados y sin resultados.
window.__psAxe = async () => {
  if (!window.axe) { const src = await fetch('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js').then((r) => r.text()); (0, eval)(src); }
  const run = async () => (await axe.run(__ps(), { resultTypes: ['violations'] })).violations.map((v) => v.id + '(' + v.impact + ') x' + v.nodes.length);
  await __psOpen(); await __psSet('the'); const withResults = await run();
  await __psSet('xyznoresults999'); const noResults = await run();
  return { withResults, noResults };
};

/* ---------- Tracks 2 y 3: localización y newsletter (solo lectura) ---------- */
window.__loc = () => [...document.querySelectorAll('form')].filter((f) => f.querySelector('[name=language_code],[name=country_code]')).map((f) => ({
  id: f.id, action: f.getAttribute('action'), method: f.getAttribute('method'),
  hidden: [...f.querySelectorAll('input[type=hidden]')].map((i) => i.name + '=' + i.value),
  items: [...f.querySelectorAll('.localization-form__item')].map((e) => e.tagName.toLowerCase() + ' ' + (e.getAttribute('aria-label') || e.textContent.trim().replace(/\s+/g, ' ')) + (e.getAttribute('aria-current') ? ' [aria-current=' + e.getAttribute('aria-current') + ']' : '') + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)),
  countrySelects: f.querySelectorAll('select[name=country_code]').length,
}));

// Selector de país simulado (la tienda tiene 1 solo mercado y el select no se renderiza): se inserta el
// marcado exacto de localization-selectors.liquid:52-61 con 3 países y se intercepta el submit.
window.__countrySim = async () => {
  const form = document.getElementById('LocalizationForm-header');
  const wrap = document.createElement('div'); wrap.className = 'localization-form__country-wrapper';
  wrap.innerHTML = '<label class="visually-hidden" for="LocalizationForm-header-country">Country/region</label><select id="LocalizationForm-header-country" class="localization-form__country" name="country_code" onchange="this.form.requestSubmit()"><option value="US" selected>United States (USD $)</option><option value="ES">Spain (EUR €)</option><option value="MX">Mexico (MXN $)</option></select>';
  form.append(wrap); const log = [];
  const stop = (e) => { log.push({ submitter: e.submitter ? e.submitter.name : null, data: [...new FormData(form, e.submitter)].filter(([k]) => /code|return_to/.test(k)).map(([k, v]) => k + '=' + v) }); e.preventDefault(); };
  form.addEventListener('submit', stop, true);
  const sel = wrap.querySelector('select'); sel.value = 'ES'; sel.dispatchEvent(new Event('change', { bubbles: true }));
  await __sleep(200);
  const noJsSubmitControls = [...form.querySelectorAll('button[type=submit], input[type=submit]')].map((b) => b.name + '=' + b.value);
  form.removeEventListener('submit', stop, true); form.removeAttribute('aria-busy'); wrap.remove();
  return { withJs: log, noJsSubmitControls };
};

window.__nl = () => [...document.querySelectorAll('form')].filter((f) => f.querySelector('input[name="contact[email]"]')).map((f) => {
  const e = f.querySelector('input[name="contact[email]"]'); const b = f.querySelector('button[type=submit]');
  const lab = e.labels && e.labels[0];
  return {
    section: (f.closest('.shopify-section')?.id || '').replace(/^shopify-section-(template--\d+__|sections--\d+__)/, ''),
    id: f.id, action: f.getAttribute('action'), method: f.getAttribute('method'),
    hidden: [...f.querySelectorAll('input[type=hidden]')].map((i) => i.name + '=' + i.value),
    email: { type: e.type, autocomplete: e.getAttribute('autocomplete'), autocapitalize: e.getAttribute('autocapitalize'), autocorrect: e.getAttribute('autocorrect'), required: e.required, ariaRequired: e.getAttribute('aria-required'), ariaInvalid: e.getAttribute('aria-invalid'), ariaDescribedby: e.getAttribute('aria-describedby'), label: lab ? lab.textContent.trim() + (lab.classList.contains('visually-hidden') ? ' (visually-hidden)' : '') : 'SIN LABEL', size: Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height) },
    submit: b && (b.textContent.trim() + ' ' + Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height)),
  };
});

/* ---------- Track 4: iconos de pago ---------- */
window.__pay = () => {
  const L = document.querySelector('.site-footer__payment-list');
  if (!L) return { list: false, wrapper: !!document.querySelector('.site-footer__payments'), utilities: document.querySelectorAll('.site-footer__utilities').length };
  const items = [...L.querySelectorAll('.site-footer__payment-item')]; const lr = L.getBoundingClientRect();
  return {
    count: items.length, svgs: items.filter((i) => i.querySelector('svg')).length,
    svgSize: items[0] && Math.round(items[0].querySelector('svg').getBoundingClientRect().width) + 'x' + Math.round(items[0].querySelector('svg').getBoundingClientRect().height),
    rows: new Set(items.map((i) => Math.round(i.getBoundingClientRect().top))).size,
    outside: items.filter((i) => { const r = i.getBoundingClientRect(); return r.right > innerWidth || r.left < 0 || r.right > lr.right + 1; }).length,
    hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth, vw: innerWidth,
  };
};

// Simulación: la tienda no tiene métodos de pago activos, así que se inserta el marcado de
// footer.liquid:112-121 con N SVG de 38x24 (el tamaño que emite payment_type_svg_tag) y se mide.
window.__paySim = async (n = 14) => {
  document.querySelector('#pay-sim')?.remove();
  const names = ['visa', 'master', 'american_express', 'discover', 'diners_club', 'jcb', 'unionpay', 'paypal', 'apple_pay', 'google_pay', 'shopify_pay', 'klarna', 'maestro', 'venmo'].slice(0, n);
  const li = names.map((t) => '<li class="site-footer__payment-item"><svg class="icon icon--full-color" viewBox="0 0 38 24" width="38" height="24" role="img" aria-labelledby="pi-' + t + '"><title id="pi-' + t + '">' + t + '</title><rect width="38" height="24" rx="3" fill="#fff" stroke="#000" stroke-opacity=".07"/></svg></li>').join('');
  const wrap = document.createElement('div'); wrap.id = 'pay-sim'; wrap.className = 'container site-footer__utilities';
  wrap.innerHTML = '<div class="site-footer__payments" aria-label="Payment methods"><span class="visually-hidden">Payment methods</span><ul class="site-footer__payment-list unstyled-list" role="list">' + li + '</ul></div>';
  const bottom = document.querySelector('.site-footer__bottom'); bottom.parentNode.insertBefore(wrap, bottom);
  await __sleep(300);
  return __pay();
};

/* ---------- Track 5: checkout acelerado en la ficha ---------- */
window.__dc = () => {
  const w = [...document.querySelectorAll('.product-form__dynamic-checkout')];
  const atc = document.querySelector('.product-form__submit');
  const b = document.querySelector('.product-form__dynamic-checkout .shopify-payment-button__button');
  return {
    wrappers: w.length, hidden: w.map((x) => x.hidden).join(','), visible: w.map((x) => !!x.getClientRects().length).join(','),
    btn: b && (b.textContent.trim() + ' ' + Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height) + ' ' + b.className),
    atc: atc && atc.textContent.trim().replace(/\s+/g, ' ') + (atc.disabled ? ' (disabled)' : ''),
    variantId: document.querySelector('form[action*="/cart/add"] [name=id]')?.value,
    checked: [...document.querySelectorAll('variant-selects input:checked')].map((i) => i.value).join('/'),
    recommended: document.querySelector('shopify-accelerated-checkout')?.getAttribute('recommended'),
  };
};
window.__pick = async (v) => {
  const i = [...document.querySelectorAll('variant-selects input')].find((x) => x.value === v);
  if (!i) return 'no ' + v;
  i.click(); await __sleep(1500); return __dc();
};
