export default async (metadata) => {
  const { preset, stage, themeId, width, height, dpr, previewBar } = metadata;
  if (!['Sartorial', 'Imprint', 'Archive'].includes(preset)
    || !['before', 'after'].includes(stage)
    || !/^\d+$/.test(String(themeId))
    || !['hidden', 'measure'].includes(previewBar)) {
    throw new Error('Specify the preset, stage, numeric theme ID and preview-bar treatment');
  }
  if (innerWidth !== width || innerHeight !== height || devicePixelRatio !== dpr || scrollY !== 0) {
    throw new Error('Match viewport and DPR and return to the top of the page');
  }

  const observe = (type) => {
    const entries = [];
    if (!PerformanceObserver.supportedEntryTypes.includes(type)) return { entries: null, stop() {} };
    const observer = new PerformanceObserver((list) => entries.push(...list.getEntries()));
    observer.observe({ type, buffered: true });
    return {
      entries,
      stop() {
        entries.push(...observer.takeRecords());
        observer.disconnect();
      },
    };
  };
  const paints = observe('largest-contentful-paint');
  const shifts = observe('layout-shift');
  await document.fonts.ready;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  paints.stop();
  shifts.stop();

  const bar = document.querySelector('#preview-bar-iframe, #ShopifyPreviewBar, shopify-preview-bar');
  const barHeight = bar?.getBoundingClientRect().height || 0;
  if (previewBar === 'measure' && barHeight === 0) throw new Error('Visible preview bar could not be measured');
  if (previewBar === 'hidden' && barHeight > 0) throw new Error('Preview bar is visible');
  const firstCard = document.querySelector('[data-product-list] > li > article.product-card[data-product-id]');
  if (!firstCard) throw new Error('The collection contains no product card');
  const facets = document.querySelector('[data-facet-form]');
  if (!facets) throw new Error('Expected collection filters');

  let cls = null;
  if (shifts.entries) {
    cls = 0;
    let sessionStart = null;
    let lastShift = null;
    let sessionValue = 0;
    for (const entry of shifts.entries.filter((shift) => !shift.hadRecentInput)) {
      if (sessionStart === null || entry.startTime - lastShift >= 1000 || entry.startTime - sessionStart >= 5000) {
        sessionStart = entry.startTime;
        sessionValue = 0;
      }
      sessionValue += entry.value;
      cls = Math.max(cls, sessionValue);
      lastShift = entry.startTime;
    }
  }

  const lcp = paints.entries?.at(-1);
  const element = lcp?.element;
  return {
    preset, stage, themeId, width, height, dpr, previewBar, barHeight,
    collectionPath: location.pathname,
    viewportHeight: visualViewport?.height ?? null,
    firstCardProductId: firstCard.dataset.productId,
    firstCardTop: firstCard.getBoundingClientRect().top,
    facetsTop: facets.getBoundingClientRect().top,
    facetsPosition: getComputedStyle(facets).position,
    bannerHeight: document.querySelector('.collection-main__banner')?.getBoundingClientRect().height ?? null,
    lcpMs: lcp?.startTime ?? null,
    lcpElement: element ? { tag: element.tagName, id: element.id, className: element.getAttribute('class') } : null,
    cls,
  };
};
