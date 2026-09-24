/* PRESETS-I18N-001. Sondas de solo lectura para la tienda viva. Se pegan en la consola de una
   pestaña del storefront con la sesión ya abierta (la contraseña la escribe Johandry).
   __grab(ruta) descarga la página con fetch, la analiza con DOMParser y devuelve el tema que la
   sirvió (Shopify.theme del HTML), el lang del documento, las secciones con su primer titular y
   todos los nodos de texto de <main>.
   __cmp(idTema, ruta) pide la ruta en inglés y en /es con ?preview_theme_id=<idTema> y devuelve
   los textos de /es que son idénticos a algún texto de la versión en inglés (candidatos a restos
   sin traducir). Nombres propios, la marca y los nombres de producto salen también: se revisan a
   mano.
   Ojo: ?preview_theme_id deja la vista previa en la cookie. Al terminar, navegar a
   /?preview_theme_id=165809488115 para volver al tema publicado. */
window.__grab = async (path) => {
  const r = await fetch(path, { credentials: 'include' });
  const h = await r.text();
  const doc = new DOMParser().parseFromString(h, 'text/html');
  const m = h.match(/Shopify\.theme\s*=\s*(\{.*?\});/);
  let theme = null; try { theme = JSON.parse(m[1]); } catch (e) {}
  const main = doc.querySelector('main') || doc.body;
  const texts = [];
  const w = doc.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) {
    const p = n.parentElement; if (!p || p.closest('script,style,noscript')) continue;
    const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t) texts.push(t);
  }
  const sections = [...main.querySelectorAll('.shopify-section')].map((s) => {
    const hd = s.querySelector('h1,h2,h3');
    return s.id.replace(/^shopify-section-template--\d+__/, '') + ' | ' + (hd ? hd.textContent.replace(/\s+/g, ' ').trim().slice(0, 70) : '');
  });
  return { url: r.url, status: r.status, lang: doc.documentElement.lang, theme: theme && (theme.name + ' ' + theme.id + ' ' + theme.role), sections, texts };
};
window.__cmp = async (id, path) => {
  const en = await __grab(path + '?preview_theme_id=' + id);
  const es = await __grab('/es' + path + '?preview_theme_id=' + id);
  const enSet = new Set(en.texts);
  const same = [...new Set(es.texts.filter((t) => enSet.has(t) && /[A-Za-z]{3,}/.test(t)))];
  return { en: { url: en.url, theme: en.theme, lang: en.lang, n: en.texts.length }, es: { url: es.url, theme: es.theme, lang: es.lang, n: es.texts.length, sections: es.sections }, sameAsEnglish: same };
};
/* Uso en este informe:
   await __cmp('166186909939', '/')                      portada de Sartorial
   await __cmp('166186942707', '/pages/contact')         una página de Edition
   Temas: Couture 165809488115 (main), Sartorial 166186909939, Edition 166186942707, Archive 166187041011. */
