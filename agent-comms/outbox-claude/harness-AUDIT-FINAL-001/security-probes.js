/* CLAUDE-DIRECTIVE-AUDIT-FINAL-001, Track 1. Sondas de solo lectura (GET) ejecutadas en la consola
   de la tienda con la sesión de vista previa ya abierta. No envían formularios ni escriben nada.

   1. Inyección reflejada: se piden páginas con una carga útil en q, en filtros y en sort_by, y se busca
      la carga cruda en el HTML devuelto. Si el tema escapa bien, solo aparece codificada.
   2. Doble codificación de search.terms: se busca un término con &, " o ' y se sigue el primer enlace
      de pestaña (Todo / Productos / Artículos / Páginas) para ver qué término llega a la página. */

window.__xssProbe = async () => {
  const payload = `"><b id=xssA>x</b>'<svg/onload=1>&amp;`;
  const q = encodeURIComponent(payload);
  const urls = [
    `/search?q=${q}&type=product&options[prefix]=last`,
    `/search?q=${q}&type=product&section_id=main-search`,
    `/collections/all?filter.v.availability=${q}&sort_by=${q}`,
    `/collections/all?filter.v.price.gte=${q}`,
    `/es/search?q=${q}`,
    `/search?q=${q}&preview_theme_id=166186909939`,
  ];
  const out = [];
  for (const u of urls) {
    const r = await fetch(u, { credentials: 'same-origin' });
    const t = await r.text();
    out.push({ u: u.slice(0, 60), status: r.status, rawInjection: t.includes('<b id=xssA>') || t.includes('<svg/onload=1>') });
  }
  return out;
};

window.__searchTermProbe = async () => {
  const res = [];
  for (const term of ['Tom & Jerry', '12" frame', "O'Neil", 'coat']) {
    const r = await fetch(`/search?q=${encodeURIComponent(term)}&type=product&options%5Bprefix%5D=last&section_id=main-search`);
    const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
    const tab = [...doc.querySelectorAll('a[href*="/search?q="]')].map((a) => a.getAttribute('href'))[0];
    const r2 = await fetch(`${tab}&section_id=main-search`);
    const d2 = new DOMParser().parseFromString(await r2.text(), 'text/html');
    res.push({ term, firstTabHref: tab, inputAfterClick: d2.querySelector('input[name="q"]')?.value });
  }
  return res;
};
