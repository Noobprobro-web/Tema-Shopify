/* 5B-001. Zoom de la ficha: <dialog>, Pointer Events y teclado. Sin globales. */
if (window.ThemeCore && !customElements.get('product-zoom')) customElements.define('product-zoom', class extends window.ThemeCore.ThemeElement {
  clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  pointers = new Map();
  gap = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  mid = (a, b) => this.point({ clientX: (a.clientX + b.clientX) / 2, clientY: (a.clientY + b.clientY) / 2 });

  connectedCallback() {
    this.startListening();
    const find = (name) => this.querySelector(`[data-zoom-${name}]`);
    [this.dialog, this.track, this.output, this.counter, this.inButton, this.outButton, this.resetButton, this.closeButton] =
      'dialog track status counter in out reset close'.split(' ').map(find);
    this.section = this.closest('[data-section-id]');
    this.slides = [...this.querySelectorAll('[data-zoom-slide]')];
    this.steps = [...this.querySelectorAll('[data-zoom-step]')];
    if (!this.section || !this.slides.length) return;
    this.resetView();

    const on = (...args) => this.listen(...args);
    on(this.section, 'click', (event) => {
      const trigger = event.target.closest('[data-zoom-open]');
      if (trigger) this.open(Number(trigger.dataset.zoomOpen) || 0, trigger);
    });
    on(this.closeButton, 'click', () => this.dialog.close());
    [[this.inButton, 1.5], [this.outButton, 2 / 3], [this.resetButton, 0]].forEach(([button, factor]) => on(button, 'click', () => this.zoomTo(this.scale * factor)));
    this.steps.forEach((step) => on(step, 'click', () => this.goTo(this.index + Number(step.dataset.zoomStep))));
    on(this.dialog, 'keydown', (event) => this.handleKey(event));
    on(this.dialog, 'close', () => this.handleClose());
    let frame = 0;
    on(this.track, 'scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => this.select(this.indexFromScroll()));
    });
    ['down', 'move', 'up', 'cancel'].forEach((type) => on(this.track, `pointer${type}`, (event) => this.handlePointer(event)));
    // Dos dedos a 1x: si no, el navegador lo toma como pan-x.
    on(this.track, 'touchmove', (event) => {
      if (event.touches.length > 1 || this.scale > 1) event.preventDefault();
    }, { passive: false });
    on(window, 'resize', () => this.dialog.open && this.layout());
  }

  disconnectedCallback() {
    if (this.dialog?.open) this.dialog.close();
    super.disconnectedCallback();
  }

  open(index, trigger) {
    if (this.dialog.open) return;
    this.opener = trigger;
    this.dialog.showModal();
    this.setAttribute('data-open', '');
    window.ThemeCore.syncDialogScrollLocks();
    this.rtl = getComputedStyle(this.track).direction === 'rtl';
    this.releaseFocus = window.ThemeCore.trapFocus(this.dialog, this.closeButton);
    this.index = -1;
    this.layout();
    this.goTo(index, false);
  }

  handleClose() {
    this.releaseFocus?.();
    clearTimeout(this.tapTimer);
    this.pointers.clear();
    this.start = this.pinch = null;
    this.resetView();
    this.removeAttribute('data-open');
    window.ThemeCore.syncDialogScrollLocks();
    this.opener?.focus();
  }

  // 1x: cabe en la ventana sin pasar del tamano natural.
  layout() {
    const { clientWidth: width, clientHeight: height } = this.track;
    this.fits = this.slides.map((slide) => {
      const img = slide.querySelector('img');
      const natural = Number(img.dataset.width) || 1;
      const ratio = Number(img.dataset.ratio) || 1;
      const fit = Math.min(width, height * ratio, natural);
      img.style.width = `${fit}px`;
      img.style.height = `${fit / ratio}px`;
      return { img, width: fit, height: fit / ratio, max: Math.min(3, natural / fit) };
    });
    if (this.index < 0) return;
    this.fit = this.fits[this.index];
    this.scale = Math.min(this.scale, Math.max(1, this.fit.max));
    this.track.scrollLeft = this.offsetOf(this.index);
    this.apply();
  }

  offsetOf(index) {
    return index * this.track.clientWidth * (this.rtl ? -1 : 1);
  }

  indexFromScroll() {
    return this.clamp(Math.round(Math.abs(this.track.scrollLeft) / (this.track.clientWidth || 1)), 0, this.slides.length - 1);
  }

  goTo(index, smooth = true) {
    const target = this.clamp(index, 0, this.slides.length - 1);
    const left = this.offsetOf(target);
    this.scrollTarget = Math.abs(this.track.scrollLeft - left) > 1 ? target : null;
    const still = !smooth || matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.track.scrollTo({ left, behavior: still ? 'auto' : 'smooth' });
    this.select(target, true);
  }

  select(index, force) {
    if (!force && this.scrollTarget != null) {
      if (index === this.scrollTarget) this.scrollTarget = null;
      return;
    }
    if (index === this.index || !this.fits) return;
    this.resetView();
    this.index = index;
    this.fit = this.fits[index];
    [index, index - 1, index + 1].forEach((slide, order) => this.load(slide, !order));
    this.steps.forEach((step) => {
      step.disabled = !this.slides[index + Number(step.dataset.zoomStep)];
    });
    this.counter.textContent = `${index + 1} / ${this.slides.length}`;
    this.apply();
    this.announce();
  }

  // Marcador: la foto que ya pinto la galeria; luego, el srcset grande.
  load(index, priority) {
    const slide = this.slides[index];
    const img = slide?.querySelector('img');
    if (!img || img.hasAttribute('srcset')) return;
    if (priority) img.fetchPriority = 'high';
    if ('pending' in img.dataset) return;
    img.dataset.pending = '';
    const upgrade = () => img.setAttribute('srcset', img.dataset.srcset);
    const shown = this.section.querySelector(`[data-product-media-id="${slide.dataset.mediaId}"] img`)?.currentSrc;
    if (!shown) return upgrade();
    img.src = shown;
    img.decode().then(upgrade, upgrade);
  }

  resetView() {
    this.scale = 1;
    this.x = this.y = 0;
    if (this.fit) this.apply();
  }

  bounds() {
    const { fit, scale, track } = this;
    return [Math.max(0, (fit.width * scale - track.clientWidth) / 2), Math.max(0, (fit.height * scale - track.clientHeight) / 2)];
  }

  apply() {
    const { fit, scale, dialog } = this;
    if (!fit) return;
    const [boundX, boundY] = this.bounds();
    this.x = this.clamp(this.x, -boundX, boundX);
    this.y = this.clamp(this.y, -boundY, boundY);
    fit.img.style.transform = scale > 1 ? `translate3d(${this.x}px, ${this.y}px, 0) scale(${scale})` : '';
    dialog.toggleAttribute('data-zoomable', fit.max >= 1.25);
    dialog.toggleAttribute('data-zoomed', scale > 1);
    this.inButton.disabled = fit.max < 1.25 || scale >= fit.max - 0.01;
    this.outButton.disabled = scale <= 1;
    this.resetButton.hidden = scale <= 1;
    const active = document.activeElement;
    if (dialog.contains(active) && (active.disabled || active.hidden)) {
      [this.inButton, this.outButton, ...this.steps, this.closeButton].find((button) => !button.disabled && !button.hidden)?.focus();
    }
  }

  // (pointX, pointY): punto fijo, relativo al centro de la pista.
  zoomTo(next, pointX = 0, pointY = 0) {
    const { fit } = this;
    if (!fit || fit.max < 1.25) return;
    let scale = this.clamp(next, 1, fit.max);
    if (scale < 1.01) scale = 1;
    const ratio = scale / this.scale;
    this.x = pointX - (pointX - this.x) * ratio;
    this.y = pointY - (pointY - this.y) * ratio;
    this.scale = scale;
    // Primer zoom: sizes al ancho ampliado; el srcset sube de candidato.
    if (scale > 1 && fit.img.sizes === '100vw') fit.img.sizes = `${Math.ceil(fit.width * fit.max)}px`;
    this.apply();
    if (Math.abs(ratio - 1) > 0.001 && !this.pinch) this.announce();
  }

  point({ clientX, clientY }) {
    const rect = this.track.getBoundingClientRect();
    return [clientX - rect.left - rect.width / 2, clientY - rect.top - rect.height / 2];
  }

  follow(event) {
    const [pointX, pointY] = this.point(event);
    const [boundX, boundY] = this.bounds();
    this.x = (-2 * pointX * boundX) / this.track.clientWidth;
    this.y = (-2 * pointY * boundY) / this.track.clientHeight;
    this.apply();
  }

  handlePointer(event) {
    const { type, pointerId: id } = event;
    const { pointers, start, pinch, gap, mid } = this;
    if (type === 'pointerdown') {
      if (event.button) return;
      this.scrollTarget = null;
      pointers.set(id, event);
      this.start = pointers.size === 1 ? { event, x: this.x, y: this.y } : null;
      const [a, b] = pointers.values();
      if (b) this.pinch = { gap: gap(a, b) || 1, scale: this.scale, x: this.x, y: this.y, mid: mid(a, b) };
      if (this.scale > 1 || this.pinch) {
        this.dialog.setAttribute('data-gesture', '');
        this.track.setPointerCapture?.(id);
      }
    } else if (type === 'pointermove') {
      if (!pointers.has(id)) {
        if (event.pointerType === 'mouse' && this.scale > 1) this.follow(event);
        return;
      }
      pointers.set(id, event);
      const [a, b] = pointers.values();
      if (pinch && b) {
        // Desde el inicio del pellizco: la foto sigue al punto medio de los dedos.
        const [pointX, pointY] = mid(a, b);
        this.scale = pinch.scale;
        this.x = pinch.x + pointX - pinch.mid[0];
        this.y = pinch.y + pointY - pinch.mid[1];
        this.zoomTo((pinch.scale * gap(a, b)) / pinch.gap, pointX, pointY);
      } else if (start) {
        if (gap(event, start.event) > 8) start.moved = true;
        if (this.scale <= 1) return;
        if (event.pointerType === 'mouse') return this.follow(event);
        this.x = start.x + event.clientX - start.event.clientX;
        this.y = start.y + event.clientY - start.event.clientY;
        this.apply();
      }
    } else if (pointers.delete(id) && !pointers.size) {
      this.start = this.pinch = null;
      this.dialog.removeAttribute('data-gesture');
      if (pinch) this.announce();
      else if (type === 'pointerup' && start && !start.moved && event.timeStamp - start.event.timeStamp < 500) {
        this.tap(event, start.event.target);
      }
    }
  }

  // Clic o doble toque (< 300 ms, < 24 px) en la foto alterna; fuera, a 1x, cierra.
  // target: el del pointerdown (con captura, el pointerup llega a la pista).
  tap(event, target) {
    const onImage = target === this.fit.img;
    const toggle = () => this.zoomTo(this.scale > 1 ? 1 : 3, ...this.point(event));
    const close = !onImage && this.scale <= 1;
    const last = this.lastTap;
    clearTimeout(this.tapTimer);
    this.lastTap = null;
    if (event.pointerType === 'mouse') {
      if (onImage) toggle();
      else if (close) this.dialog.close();
    } else if (last && event.timeStamp - last.timeStamp < 300 && this.gap(event, last) < 24) {
      toggle();
    } else {
      this.lastTap = event;
      if (close) this.tapTimer = setTimeout(() => this.dialog.close(), 300);
    }
  }

  handleKey(event) {
    const { key } = event;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const side = this.rtl ? -1 : 1;
    const [panX, panY] = [this.track.clientWidth * 0.15, this.track.clientHeight * 0.15];
    const move = { ArrowLeft: [panX, 0, -side], ArrowRight: [-panX, 0, side], ArrowUp: [0, panY], ArrowDown: [0, -panY] }[key];
    const factor = { '+': 1.5, '=': 1.5, '-': 2 / 3, _: 2 / 3, 0: 0 }[key];
    if (factor != null) this.zoomTo(this.scale * factor);
    else if (key === 'Home' || key === 'End') this.goTo(key === 'End' ? this.slides.length : 0);
    else if (move && this.scale > 1) {
      this.x += move[0];
      this.y += move[1];
      this.apply();
    } else if (move?.[2]) this.goTo(this.index + move[2]);
    else return;
    event.preventDefault();
  }

  announce() {
    this.output.textContent = (this.dataset.statusTemplate || '')
      .replace('[index]', this.index + 1)
      .replace('[total]', this.slides.length)
      .replace('[zoom]', Math.round(this.scale * 100));
  }
});
