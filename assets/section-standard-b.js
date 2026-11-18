/*
 * Behaviour for the slideshow and video sections.
 * Self-contained: no dependency on theme.js. Safe to load more than once.
 */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  class ThemeSlideshow extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-slideshow-track]');
      this.slides = Array.from(this.querySelectorAll('[data-slideshow-slide]'));
      if (!this.track || this.slides.length < 2 || this.ready) return;

      this.ready = true;
      this.controls = this.querySelector('[data-slideshow-controls]');
      this.dots = Array.from(this.querySelectorAll('[data-slideshow-dot]'));
      this.toggle = this.querySelector('[data-slideshow-toggle]');
      this.index = 0;
      this.target = null;
      this.timer = null;
      this.settleTimer = null;
      this.frame = null;
      this.rtl = getComputedStyle(this).direction === 'rtl';
      this.delay = Math.max(Number(this.dataset.delay) || 5000, 3000);
      this.wantsAutoplay = this.dataset.autoplay === 'true';
      this.userPaused = false;
      this.hovering = false;
      this.focusInside = false;
      this.editing = false;

      this.onScroll = () => {
        if (this.frame) return;
        this.frame = requestAnimationFrame(() => {
          this.frame = null;
          this.syncFromScroll();
        });
      };
      this.onResize = () => this.goTo(this.index, { smooth: false });
      this.onVisibility = () => this.refreshPlayback();
      this.onMotionChange = () => this.refreshPlayback();
      this.onSelect = (event) => {
        const slide = event.target.closest('[data-slideshow-slide]');
        if (!slide) return;
        this.editing = true;
        this.goTo(this.slides.indexOf(slide), { smooth: false });
        this.refreshPlayback();
      };
      this.onDeselect = () => {
        this.editing = false;
        this.refreshPlayback();
      };

      if (this.controls) this.controls.hidden = false;
      this.track.tabIndex = 0;
      this.track.addEventListener('scroll', this.onScroll, { passive: true });
      this.track.addEventListener('keydown', (event) => this.onKey(event));
      this.addEventListener('shopify:block:select', this.onSelect);
      this.addEventListener('shopify:block:deselect', this.onDeselect);
      window.addEventListener('resize', this.onResize);
      document.addEventListener('visibilitychange', this.onVisibility);
      reducedMotion.addEventListener('change', this.onMotionChange);

      const previous = this.querySelector('[data-slideshow-previous]');
      const next = this.querySelector('[data-slideshow-next]');
      if (previous) previous.addEventListener('click', () => this.step(-1));
      if (next) next.addEventListener('click', () => this.step(1));
      this.dots.forEach((dot, position) => {
        dot.addEventListener('click', () => this.goTo(position));
        dot.addEventListener('keydown', (event) => this.onKey(event));
      });

      if (this.toggle) {
        this.toggle.addEventListener('click', () => {
          this.userPaused = !this.userPaused;
          // Pressing play is an explicit request, so hover and focus no longer hold it back.
          if (!this.userPaused) {
            this.hovering = false;
            this.focusInside = false;
          }
          this.refreshPlayback();
        });
      }

      this.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'mouse') {
          this.hovering = true;
          this.refreshPlayback();
        }
      });
      this.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'mouse') {
          this.hovering = false;
          this.refreshPlayback();
        }
      });
      this.addEventListener('focusin', () => {
        this.focusInside = true;
        this.refreshPlayback();
      });
      this.addEventListener('focusout', (event) => {
        if (!this.contains(event.relatedTarget)) {
          this.focusInside = false;
          this.refreshPlayback();
        }
      });

      this.setAttribute('data-ready', '');
      this.setActive(0);
      this.refreshPlayback();
    }

    disconnectedCallback() {
      if (!this.ready) return;
      this.ready = false;
      clearTimeout(this.timer);
      clearTimeout(this.settleTimer);
      if (this.frame) cancelAnimationFrame(this.frame);
      window.removeEventListener('resize', this.onResize);
      document.removeEventListener('visibilitychange', this.onVisibility);
      reducedMotion.removeEventListener('change', this.onMotionChange);
    }

    get isPlaying() {
      return (
        this.wantsAutoplay &&
        !reducedMotion.matches &&
        !this.userPaused &&
        !this.hovering &&
        !this.focusInside &&
        !this.editing &&
        !document.hidden
      );
    }

    step(direction) {
      const total = this.slides.length;
      const nextIndex = (this.index + direction + total) % total;
      const wrapped = Math.abs(nextIndex - this.index) > 1;
      this.goTo(nextIndex, { smooth: !wrapped });
    }

    goTo(position, { smooth = true } = {}) {
      if (position < 0 || position >= this.slides.length) return;
      const slide = this.slides[position];
      // Distance from the track's start edge to the slide, valid for both writing directions.
      const left =
        this.track.scrollLeft + slide.getBoundingClientRect().left - this.track.getBoundingClientRect().left;
      this.target = position;
      clearTimeout(this.settleTimer);
      // Releases the scroll lock even if the browser never reports reaching the slide.
      this.settleTimer = setTimeout(() => {
        this.target = null;
      }, 900);
      this.setActive(position);
      this.track.scrollTo({
        left,
        behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto',
      });
    }

    syncFromScroll() {
      const width = this.track.clientWidth;
      if (!width) return;
      const nearest = Math.min(
        this.slides.length - 1,
        Math.max(0, Math.round(Math.abs(this.track.scrollLeft) / width))
      );
      if (this.target !== null) {
        // Ignore the slides passed on the way to a requested destination.
        if (nearest !== this.target) return;
        this.target = null;
        clearTimeout(this.settleTimer);
      }
      if (nearest !== this.index) this.setActive(nearest);
    }

    setActive(position) {
      this.index = position;
      this.slides.forEach((slide, slidePosition) => {
        const active = slidePosition === position;
        slide.inert = !active;
        slide.toggleAttribute('data-active', active);
      });
      this.dots.forEach((dot, dotPosition) => {
        dot.setAttribute('aria-current', dotPosition === position ? 'true' : 'false');
      });
      this.refreshPlayback();
    }

    onKey(event) {
      const forward = this.rtl ? 'ArrowLeft' : 'ArrowRight';
      const backward = this.rtl ? 'ArrowRight' : 'ArrowLeft';
      let handled = true;
      if (event.key === forward) this.step(1);
      else if (event.key === backward) this.step(-1);
      else if (event.key === 'Home') this.goTo(0);
      else if (event.key === 'End') this.goTo(this.slides.length - 1);
      else handled = false;
      if (handled) event.preventDefault();
    }

    refreshPlayback() {
      clearTimeout(this.timer);
      const playing = this.isPlaying;
      // Announce slide changes only when the visitor moves them; automatic changes stay silent.
      this.track.setAttribute('aria-live', playing ? 'off' : 'polite');
      if (this.toggle) {
        const available = this.wantsAutoplay && !reducedMotion.matches;
        this.toggle.hidden = !available;
        const paused = this.userPaused;
        this.toggle.toggleAttribute('data-paused', paused);
        this.toggle.setAttribute('aria-label', paused ? this.dataset.playLabel : this.dataset.pauseLabel);
      }
      if (playing) this.timer = setTimeout(() => this.step(1), this.delay);
    }
  }

  class ThemeVideoPoster extends HTMLElement {
    connectedCallback() {
      this.button = this.querySelector('[data-video-play]');
      this.template = this.querySelector('template[data-video-template]');
      this.stage = this.querySelector('[data-video-stage]');
      if (!this.button || !this.template || !this.stage || this.bound) return;
      this.bound = true;
      this.button.hidden = false;
      this.button.addEventListener('click', () => this.load());
    }

    // The player is created here and nowhere else, so no third-party request happens before the click.
    load() {
      if (this.loaded) return;
      this.loaded = true;
      const media = this.template.content.firstElementChild;
      if (!media) return;
      const player = media.cloneNode(true);
      const poster = this.querySelector('[data-video-poster]');
      this.stage.append(player);
      if (poster) poster.hidden = true;
      this.button.hidden = true;
      this.setAttribute('data-playing', '');
      player.tabIndex = -1;
      player.focus({ preventScroll: true });
      if (player instanceof HTMLVideoElement) {
        const attempt = player.play();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
      }
    }
  }

  if (!customElements.get('theme-slideshow')) customElements.define('theme-slideshow', ThemeSlideshow);
  if (!customElements.get('theme-video-poster')) customElements.define('theme-video-poster', ThemeVideoPoster);
})();
