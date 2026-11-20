(() => {
  'use strict';

  if (window.ThemeCore?.initialized) return;

  const focusableSelector = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'details > summary:first-of-type',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const getFocusableElements = (container) =>
    Array.from(container.querySelectorAll(focusableSelector)).filter((element) => {
      if (element.closest('[hidden], [inert]')) return false;
      return element.getClientRects().length > 0;
    });

  const isFocusTargetUsable = (element) => Boolean(element?.isConnected
    && !element.closest('[hidden], [inert]')
    && element.getClientRects().length > 0);

  // Closing on a press of a drawer's backdrop. preventDefault stops the mousedown that follows (or
  // the compatibility one after a tap) from sending focus to BODY. On a tap, the synthetic click
  // arrives after the backdrop is hidden and would land on whatever is underneath (a link in main,
  // the header cart): that one click is discarded. It expires on the next pointerdown, on
  // pointercancel (the gesture turned into a scroll and no click will come) or after 800ms. A click
  // with detail 0 (keyboard, screen reader, switch, click()) does not come from a pointer and is
  // never discarded.
  const swallowNextClick = () => {
    let timer = 0;
    const release = () => {
      window.removeEventListener('click', swallow, true);
      window.removeEventListener('pointerdown', release, true);
      window.removeEventListener('pointercancel', release, true);
      window.clearTimeout(timer);
    };
    const swallow = (event) => {
      if (event.detail === 0) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      release();
    };
    window.addEventListener('click', swallow, true);
    window.addEventListener('pointerdown', release, true);
    window.addEventListener('pointercancel', release, true);
    timer = window.setTimeout(release, 800);
  };

  const dismissFromOverlay = (event, close) => {
    event.preventDefault();
    if (event.pointerType !== 'mouse') swallowNextClick();
    close();
  };

  const trapFocus = (container, initialFocus = null) => {
    const handleKeydown = (event) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    container.addEventListener('keydown', handleKeydown);

    requestAnimationFrame(() => {
      const focusTarget = initialFocus || getFocusableElements(container)[0] || container;
      focusTarget.focus();
    });

    return () => container.removeEventListener('keydown', handleKeydown);
  };

  // Only one dialog may own the focus trap and the inert background at a time. Two open
  // at once make each other's ancestors inert, which leaves the visible dialog's own
  // controls unclickable and sends Escape to the wrong surface. Every dialog therefore
  // dismisses the others as it opens.
  const DIALOGS_WITH_SET_OPEN = 'theme-drawer[data-open], predictive-search[data-open]';
  const DIALOGS_WITH_CLOSE = 'cart-drawer[data-open], size-guide-modal[data-open], pickup-availability[data-open], password-modal[data-open], product-card-variants[data-open]';

  const closeOtherDialogs = (except = null) => {
    document.querySelectorAll(DIALOGS_WITH_SET_OPEN).forEach((dialog) => {
      if (dialog === except || typeof dialog.setOpen !== 'function') return;
      dialog.setOpen(false);
    });

    document.querySelectorAll(DIALOGS_WITH_CLOSE).forEach((dialog) => {
      if (dialog === except || typeof dialog.close !== 'function') return;
      dialog.close(false);
    });
  };

  // The lock (overflow: hidden on body, base.css) removes the classic desktop scrollbar and the
  // content used to shift by its width. The bar is measured before locking and body compensates
  // with padding-right (--scrollbar-compensation). With overlay scrollbars (mobile) the measurement
  // is 0. A global scrollbar-gutter is not used: it would change the width of full-bleed sections
  // compared with the unlocked page.
  const syncDialogScrollLocks = () => {
    const { body } = document;
    const wasLocked = body.hasAttribute('data-drawer-open') || body.hasAttribute('data-modal-open');
    const drawerOpen = Boolean(document.querySelector('theme-drawer[data-open], cart-drawer[data-open]'));
    const modalOpen = Boolean(document.querySelector('size-guide-modal[data-open], pickup-availability[data-open], password-modal[data-open], predictive-search[data-open], product-card-variants[data-modal], product-zoom[data-open]'));
    const locked = drawerOpen || modalOpen;

    // The compensation is how much clientWidth grows on locking (the removed bar), not innerWidth -
    // clientWidth: on mobile, with horizontal overflow, that subtraction measures the page scale
    // and would give hundreds of px.
    const widthBefore = locked && !wasLocked ? document.documentElement.clientWidth : 0;

    body.toggleAttribute('data-drawer-open', drawerOpen);
    body.toggleAttribute('data-modal-open', modalOpen);

    if (locked && !wasLocked) {
      const scrollbar = Math.max(0, document.documentElement.clientWidth - widthBefore);
      if (scrollbar > 0) body.style.setProperty('--scrollbar-compensation', `${scrollbar}px`);
      else body.style.removeProperty('--scrollbar-compensation');
    }
    if (!locked) body.style.removeProperty('--scrollbar-compensation');
  };

  // A slide that leaves the view cannot keep playing: <video> is paused and YouTube and Vimeo
  // players (media_tag with its API enabled) receive the pause command via postMessage, the same
  // message each platform documents.
  const pauseMedia = (container) => {
    container.querySelectorAll('video').forEach((video) => video.pause());
    container.querySelectorAll('iframe').forEach((frame) => {
      const source = frame.getAttribute('src') || '';
      if (source.includes('youtube')) {
        frame.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else if (source.includes('vimeo')) {
        frame.contentWindow?.postMessage('{"method":"pause"}', '*');
      }
    });
  };

  // The eight amount tokens Shopify allows inside money_format / money_with_currency_format.
  const MONEY_PATTERNS = {
    amount: { precision: 2, thousands: ',', decimal: '.' },
    amount_no_decimals: { precision: 0, thousands: ',', decimal: '.' },
    amount_with_comma_separator: { precision: 2, thousands: '.', decimal: ',' },
    amount_no_decimals_with_comma_separator: { precision: 0, thousands: '.', decimal: ',' },
    amount_with_apostrophe_separator: { precision: 2, thousands: "'", decimal: '.' },
    amount_no_decimals_with_space_separator: { precision: 0, thousands: ' ', decimal: '.' },
    amount_with_space_separator: { precision: 2, thousands: ' ', decimal: ',' },
    amount_with_period_and_space_separator: { precision: 2, thousands: ' ', decimal: '.' },
  };

  const MONEY_TOKEN = /\{\{\s*(\w+)\s*\}\}/;

  // Last-resort template. Only reached when the shop exposes no usable money_format,
  // and exists so a price degrades to a readable number instead of an empty node.
  const DEFAULT_MONEY_FORMAT = '${{amount}}';

  // Accepts cents as a number, or as a string of digits. A decimal string such as
  // "12.34" is rejected rather than silently read as 12 cents.
  const isCentsLike = (cents) => typeof cents === 'number'
    || (typeof cents === 'string' && /^-?\d+$/.test(cents.trim()));

  const formatMoney = (cents, format) => {
    if (!isCentsLike(cents)) return '';
    const amount = Math.round(Number(cents));
    if (!Number.isFinite(amount)) return '';

    const template = [
      format,
      window.theme?.moneyFormat,
      document.documentElement.dataset.moneyFormat,
      DEFAULT_MONEY_FORMAT,
    ].find((candidate) => typeof candidate === 'string'
      && Object.hasOwn(MONEY_PATTERNS, candidate.match(MONEY_TOKEN)?.[1]));
    if (!template) return '';

    const pattern = MONEY_PATTERNS[template.match(MONEY_TOKEN)[1]];
    // Decodes entities a merchant may have typed into money_format (&pound;, &#36;)
    // while keeping any markup inert, since the result is written with textContent.
    const decoder = document.createElement('textarea');
    decoder.innerHTML = template.replace(/</g, '&lt;');
    const textTemplate = decoder.value;
    const fixed = (amount / 100).toFixed(pattern.precision);
    const [whole, fraction] = fixed.split('.');
    const grouped = whole.replace(/(\d)(?=(\d{3})+$)/g, `$1${pattern.thousands}`);
    const value = fraction ? `${grouped}${pattern.decimal}${fraction}` : grouped;

    return textTemplate.replace(new RegExp(MONEY_TOKEN.source, 'g'), value);
  };

  const fetchCommerce = (url, options, errorMessage) => fetch(url, options).catch((error) => {
    if (error.name === 'AbortError') throw error;
    throw new Error(errorMessage);
  });

  // Shopify's quantity grid: only min + k * increment up to max is valid. The real ceiling is the
  // largest step that fits under max (min 2, step 2, max 5 gives 4, not 5). If not even the minimum
  // fits (max < min), it returns a value below min and the caller decides how to block.
  const quantityGridMax = (min, step, max) => (
    Number.isFinite(max) ? min + Math.floor((max - min) / step) * step : Infinity
  );

  // Snaps a value to the nearest valid step within [min, ceiling]. On a tie (exactly between two
  // steps) it rounds down: no more is requested than was typed.
  const snapQuantity = (value, min, step, gridMax) => {
    if (gridMax < min) return min;
    const index = Math.ceil((value - min) / step - 0.5);
    return Math.min(gridMax, Math.max(min, min + index * step));
  };

  class ThemeElement extends HTMLElement {
    startListening() {
      this.stopListening();
      this.abortController = new AbortController();
      return this.abortController.signal;
    }

    listen(target, eventName, handler, options = {}) {
      if (!this.abortController) this.startListening();
      target.addEventListener(eventName, handler, {
        ...options,
        signal: this.abortController.signal,
      });
    }

    stopListening() {
      this.abortController?.abort();
      this.abortController = null;
    }

    disconnectedCallback() {
      this.stopListening();
    }
  }

  class ThemeDisclosure extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-disclosure-trigger]');
      this.panel = this.querySelector('[data-disclosure-panel]');

      if (!this.trigger || !this.panel) return;

      this.setOpen(false);
      this.listen(this.trigger, 'click', () => this.setOpen(!this.isOpen));
      this.listen(document, 'pointerdown', (event) => {
        if (this.isOpen && !this.contains(event.target)) this.setOpen(false);
      });
      this.listen(this, 'shopify:block:select', () => this.setOpen(true));
      this.listen(this, 'shopify:block:deselect', () => this.setOpen(false));
      // On desktop the panel covers the page below the header: if focus reaches something outside
      // it, the panel closes so as not to leave it underneath (WCAG 2.4.11). Inside the header it
      // covers nothing and Shift+Tab still returns to the panel. The mobile drawer does not need
      // this.
      const header = this.closest('.desktop-nav') && this.closest('.site-header');
      if (header) {
        this.listen(document, 'focusin', (event) => {
          if (this.isOpen && !header.contains(event.target)) this.setOpen(false);
        });
      }
      this.listen(this, 'keydown', (event) => {
        if (event.key === 'Escape' && this.isOpen) {
          event.preventDefault();
          event.stopPropagation();
          this.setOpen(false, true);
          return;
        }

        // Arrow keys are optional in a disclosure menu: the expected navigation is Tab, and in the
        // mobile drawer capturing ArrowDown would take scrolling away from the keyboard. So whoever
        // wants them asks for them, with data-disclosure-arrows.
        if (this.dataset.disclosureArrows !== undefined) this.handleArrowKeys(event);
      });
    }

    get isOpen() {
      return this.trigger?.getAttribute('aria-expanded') === 'true';
    }

    get focusableLinks() {
      return Array.from(this.panel?.querySelectorAll('a[href]') || []);
    }

    handleArrowKeys(event) {
      const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(event.key)) return;

      // From the trigger, ArrowDown opens the panel and moves into it: it is the gesture keyboard
      // users expect, and saves a Tab.
      if (event.target === this.trigger && event.key === 'ArrowDown') {
        event.preventDefault();
        if (!this.isOpen) this.setOpen(true);
        this.focusableLinks[0]?.focus();
        return;
      }

      const links = this.focusableLinks;
      const index = links.indexOf(event.target);
      if (index === -1) return;

      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowDown') next = index + 1;
      else if (event.key === 'ArrowUp') next = index - 1;
      else if (event.key === 'Home') next = 0;
      else next = links.length - 1;

      // No wrapping: going past the top returns to the trigger, and going past the bottom does
      // nothing. Wrapping the list leaves people who cannot see the screen not knowing where it
      // ends.
      if (next < 0) {
        this.trigger.focus();
        return;
      }
      links[Math.min(next, links.length - 1)]?.focus();
    }

    setOpen(open, restoreFocus = false) {
      if (!this.trigger || !this.panel) return;

      if (open) {
        this.closest('.desktop-nav')?.querySelectorAll('theme-disclosure[data-open]')
          .forEach((other) => other !== this && other.setOpen(false));
      }

      this.trigger.setAttribute('aria-expanded', String(open));
      this.panel.hidden = !open;
      this.panel.inert = !open;
      this.toggleAttribute('data-open', open);

      if (!open && restoreFocus) this.trigger.focus();
    }
  }

  class ThemeDrawer extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-drawer-trigger]');
      this.overlay = this.querySelector('[data-drawer-overlay]');
      this.panel = this.querySelector('[data-drawer-panel]');
      this.closeButtons = this.querySelectorAll('[data-drawer-close]');
      this.managedInertElements = [];
      this.releaseFocusTrap = null;

      if (!this.trigger || !this.overlay || !this.panel) return;

      this.setOpen(false);
      this.listen(this.trigger, 'click', () => this.setOpen(true));
      this.closeButtons.forEach((button) => {
        this.listen(button, 'click', () => this.setOpen(false, true));
      });
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target !== this.overlay) return;
        dismissFromOverlay(event, () => this.setOpen(false, true));
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.setOpen(false, true);
      });
      // The mobile/desktop breakpoint lives only in CSS (base.css hides .site-header__mobile-menu
      // on desktop). If the open drawer stops being painted because of a width change or a
      // rotation, it closes here and returns scroll, inert and focus without Escape.
      this.listen(window, 'resize', () => {
        this.closeIfHidden();
        this.repairFocusHandoff();
      }, { passive: true });
      // After closing, focus is tracked while it remains in the header: if a width change hides the
      // focused control (the desktop navigation when going back to mobile), it is relocated (see
      // repairFocusHandoff). Leaving the header or dropping focus manually (clicking an area with
      // no controls) ends the tracking.
      this.focusHandoff = false;
      this.listen(document, 'focusin', (event) => {
        if (!this.focusScope.contains(event.target)) this.focusHandoff = false;
      });
      this.listen(document, 'focusout', (event) => {
        if (!event.relatedTarget && this.focusScope.contains(event.target) && isFocusTargetUsable(event.target)) {
          this.focusHandoff = false;
        }
      });
    }

    disconnectedCallback() {
      this.setOpen(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.trigger?.getAttribute('aria-expanded') === 'true';
    }

    // Focus target on close: the trigger if it is painted; otherwise (desktop), the first visible
    // control that follows the drawer in its section (the main navigation) and, as a last resort,
    // the first visible control of the section. Never a hidden element.
    get focusScope() {
      return this.closest('[data-section-id]') || this.parentElement || document.body;
    }

    getFocusReturnTarget() {
      if (isFocusTargetUsable(this.trigger)) return this.trigger;
      const candidates = getFocusableElements(this.focusScope).filter((element) => !this.contains(element));
      return candidates.find((element) => this.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)
        || candidates[0]
        || null;
    }

    returnFocus() {
      const target = this.getFocusReturnTarget();
      this.focusHandoff = Boolean(target);
      target?.focus({ preventScroll: true });
    }

    // Close without restoreFocus: the trigger is no longer visible. If focus was in the drawer (or
    // fell to BODY when it was hidden), it goes to getFocusReturnTarget.
    closeIfHidden() {
      if (!this.isOpen || this.trigger.getClientRects().length > 0) return;
      const active = document.activeElement;
      const focusWasInside = !active || active === document.body || this.contains(active);
      this.setOpen(false);
      if (focusWasInside) this.returnFocus();
    }

    // If the header's focused control stops being painted after a close (going from 1280 to 390
    // hides the desktop navigation), focus goes to getFocusReturnTarget instead of falling to BODY.
    repairFocusHandoff() {
      if (this.isOpen || !this.focusHandoff) return;
      const active = document.activeElement;
      if (active && active !== document.body) {
        if (!this.focusScope.contains(active)) {
          this.focusHandoff = false;
          return;
        }
        if (isFocusTargetUsable(active)) return;
      }
      this.returnFocus();
    }

    setOpen(open, restoreFocus = false) {
      if (!this.trigger || !this.overlay || !this.panel) return;

      // Runs before this drawer touches body[data-drawer-open] or the inert background,
      // so a closing cart drawer cannot strip the state this one is about to set.
      if (open) closeOtherDialogs(this);
      if (open) this.focusHandoff = false;

      this.trigger.setAttribute('aria-expanded', String(open));
      this.panel.setAttribute('aria-hidden', String(!open));
      this.panel.inert = !open;
      this.overlay.hidden = !open;
      this.toggleAttribute('data-open', open);
      syncDialogScrollLocks();

      if (open) {
        this.applyBackgroundInert();
        const initialFocus = this.querySelector('[data-drawer-close]');
        this.releaseFocusTrap = trapFocus(this.panel, initialFocus);
      } else {
        this.releaseFocusTrap?.();
        this.releaseFocusTrap = null;
        this.restoreBackgroundInert();
        if (restoreFocus) this.returnFocus();
      }
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this;

      while (currentElement.parentElement) {
        const parentElement = currentElement.parentElement;

        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });

        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }
  }

  class ProductGallery extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.guardUnsizedModels();
      if (this.dataset.layout !== 'thumbnails') {
        this.initCarousel();
        return;
      }

      this.items = Array.from(this.querySelectorAll('[data-product-media-id]'));
      this.thumbnails = Array.from(this.querySelectorAll('[data-product-thumbnail]'));
      this.status = this.querySelector('[data-product-gallery-status]');
      if (this.items.length === 0 || this.thumbnails.length === 0) return;

      this.thumbnails.forEach((thumbnail) => {
        this.listen(thumbnail, 'click', () => this.selectMedia(thumbnail.dataset.mediaId, true));
      });

      const productSection = this.closest('[data-section-id]');
      if (productSection) {
        this.listen(productSection, 'theme:variant-change', (event) => {
          const mediaId = event.detail?.variant?.featured_media_id;
          if (mediaId) this.selectMedia(mediaId, false);
        });
      }

      const initialMedia = this.items.find((item) => item.hasAttribute('data-selected'))
        || this.items[0];
      this.selectMedia(initialMedia.dataset.productMediaId, false);
    }

    // WCAG 2.4.7. A <model-viewer> enters the tab order by itself, but until its component loads
    // (or while its slide is not laid out) it measures 0 wide and focus would land on an invisible
    // element. While it has no box it is made inert; once it gets a size it becomes operable again
    // (3D and AR are not touched).
    guardUnsizedModels() {
      const models = Array.from(this.querySelectorAll('model-viewer'));
      if (models.length === 0 || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver((entries) => {
        entries.forEach(({ target, contentRect }) => {
          target.inert = contentRect.width < 1 || contentRect.height < 1;
        });
      });
      models.forEach((model) => {
        model.inert = model.offsetWidth < 1;
        observer.observe(model);
      });
      this.disconnectModelObserver = () => observer.disconnect();
    }

    disconnectedCallback() {
      this.disconnectModelObserver?.();
      super.disconnectedCallback();
    }

    // In carousel mode the slides outside the view must not receive keyboard focus: they are
    // reached with previous and next. On desktop they are all operable.
    syncSlideInert() {
      this.slides.forEach((slide, position) => {
        slide.inert = this.carouselQuery.matches && position !== this.currentSlide;
      });
    }

    // Mobile carousel. Below 62rem the gallery (stack or grid) is a scroll-snap row that CSS
    // already makes swipeable without JavaScript. Here only what CSS cannot do is added: counter,
    // previous and next buttons, keyboard focus on the track and jumping to the selected variant's
    // image.
    initCarousel() {
      this.track = this.querySelector('[data-gallery-track]');
      this.pager = this.querySelector('[data-gallery-pager]');
      this.slides = Array.from(this.querySelectorAll('[data-product-media-id]'));
      if (!this.track || !this.pager || this.slides.length < 2) return;

      this.counter = this.pager.querySelector('[data-gallery-current]');
      this.carouselStatus = this.pager.querySelector('[data-gallery-status]');
      this.steps = Array.from(this.pager.querySelectorAll('[data-gallery-step]'));
      this.carouselQuery = window.matchMedia('(max-width: 61.99rem)');
      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.currentSlide = -1;
      // The first time the carousel is shown it starts on the preselected media, if any.
      this.initialSlidePending = true;

      this.steps.forEach((step) => {
        this.listen(step, 'click', () => {
          this.goToSlide(this.currentSlide + Number(step.dataset.galleryStep), true);
        });
      });

      // The index comes from the scroll position, which is what the shopper sees whether swiping
      // with a finger, trackpad or keyboard arrows.
      let frame = 0;
      this.listen(this.track, 'scroll', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => this.syncSlide(false));
      }, { passive: true });

      this.listen(this.carouselQuery, 'change', () => this.syncCarouselMode());

      const productSection = this.closest('[data-section-id]');
      if (productSection) {
        this.listen(productSection, 'theme:variant-change', (event) => {
          const mediaId = event.detail?.variant?.featured_media_id;
          const index = this.slides.findIndex(
            (slide) => String(slide.dataset.productMediaId) === String(mediaId),
          );
          if (index >= 0) this.goToSlide(index, false);
        });
      }

      this.syncCarouselMode();
    }

    syncCarouselMode() {
      const active = this.carouselQuery.matches;
      const pagerHasFocus = Boolean(
        this.pager && (this.pager === document.activeElement || this.pager.contains(document.activeElement)),
      );
      const trackHasFocus = Boolean(
        this.track && (this.track === document.activeElement || (this.track.contains(document.activeElement) && !pagerHasFocus)),
      );
      const slideIndex = Math.max(0, this.currentSlide >= 0 ? this.currentSlide : 0);

      this.pager.hidden = !active;
      this.syncSlideInert();

      // A scrollable track must be able to receive focus so the keyboard can move it (axe:
      // scrollable-region-focusable). Outside the carousel it is not scrollable and must not be an
      // empty tab stop.
      if (active) {
        this.track.tabIndex = 0;
        this.track.setAttribute('aria-label', this.getAttribute('aria-label') || '');
        const preselected = this.initialSlidePending && this.currentSlide < 0
          ? this.slides.findIndex((slide) => slide.hasAttribute('data-selected'))
          : -1;
        this.initialSlidePending = false;
        if (preselected > 0 && !this.slides.some((slide) => slide.hidden)) this.goToSlide(preselected, false, true);
        else this.syncSlide(false);
      } else {
        this.track.removeAttribute('tabindex');
        this.track.removeAttribute('aria-label');
        if (this.currentSlide < 0) this.applySlide(0, false);
      }

      // If the pager or the track had focus and they are hidden on desktop, move focus to an
      // interactive, visible element of the current slide (e.g. zoom) or to the slide itself with
      // tabindex="0", so focus is not ejected to the body.
      if (!active && (pagerHasFocus || trackHasFocus)) {
        const targetSlide = (this.slides && this.slides[slideIndex]) || this.slides?.[0];
        if (targetSlide) {
          const interactive = targetSlide.querySelector(
            'button:not([disabled]), [tabindex="0"], a[href], video, [data-gallery-zoom-trigger]',
          );
          const fallback = interactive || targetSlide;
          if (fallback === targetSlide && !fallback.hasAttribute('tabindex')) {
            fallback.setAttribute('tabindex', '0');
          }
          fallback.focus?.();
        }
      }
    }

    slideIndexFromScroll() {
      const width = this.track.clientWidth;
      if (!width) return 0;
      // In RTL scrollLeft is negative; the absolute value counts from the start all the same.
      const index = Math.round(Math.abs(this.track.scrollLeft) / width);
      return Math.min(Math.max(index, 0), this.slides.length - 1);
    }

    syncSlide(announce) {
      this.applySlide(this.slideIndexFromScroll(), announce);
    }

    applySlide(index, announce) {
      if (index === this.currentSlide && !announce) return;
      this.currentSlide = index;
      this.slides.forEach((slide, position) => {
        if (position !== index) pauseMedia(slide);
      });
      this.syncSlideInert();

      if (this.counter) this.counter.textContent = String(index + 1);
      const focusedStep = this.steps.find(
        (step) => step === document.activeElement || step.contains(document.activeElement),
      );
      this.steps.forEach((step) => {
        const direction = Number(step.dataset.galleryStep);
        step.disabled = direction < 0 ? index === 0 : index === this.slides.length - 1;
      });
      // If the button just pressed reaches the limit and is disabled, focus would fall to body and
      // disorient assistive technology: it is passed to the opposite available button or to the
      // carousel track.
      if (focusedStep && focusedStep.disabled) {
        const fallback = this.steps.find((step) => !step.disabled)
          || (this.track && this.track.tabIndex >= 0 ? this.track : null);
        fallback?.focus();
      }

      if (announce && this.carouselStatus) {
        const template = this.pager.dataset.viewMediaTemplate || '';
        this.carouselStatus.textContent = template.replace('[number]', String(index + 1));
      }
    }

    goToSlide(index, announce, instant = false) {
      if (!this.carouselQuery?.matches) return;
      const target = Math.min(Math.max(index, 0), this.slides.length - 1);
      const rtl = getComputedStyle(this.track).direction === 'rtl';
      const left = target * this.track.clientWidth * (rtl ? -1 : 1);

      this.track.scrollTo({ left, behavior: instant || this.reducedMotionQuery.matches ? 'auto' : 'smooth' });
      // The counter jumps straight to the destination: waiting for the smooth scroll would leave it
      // a few hundred milliseconds on the source image, and with the track already in place there
      // would be no scroll event to correct it.
      this.applySlide(target, announce);
    }

    selectMedia(mediaId, announce) {
      const selectedItem = this.items.find(
        (item) => String(item.dataset.productMediaId) === String(mediaId),
      );
      if (!selectedItem) return;

      this.items.forEach((item) => {
        const selected = item === selectedItem;
        item.hidden = !selected;
        item.toggleAttribute('data-selected', selected);
        if (!selected) pauseMedia(item);
      });

      let selectedThumbnail = null;
      this.thumbnails.forEach((thumbnail) => {
        const selected = String(thumbnail.dataset.mediaId) === String(mediaId);
        thumbnail.setAttribute('aria-pressed', String(selected));
        if (selected) selectedThumbnail = thumbnail;
      });

      if (announce && this.status && selectedThumbnail) {
        this.status.textContent = selectedThumbnail.getAttribute('aria-label') || '';
      }
    }
  }

  class VariantSelects extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.usesServerVariants = this.hasAttribute('data-variant-state-url');
      this.variantData = this.usesServerVariants ? [] : this.getVariantData();
      this.variantRequest = null;
      this.variantStateCache = new Map();

      if (!this.usesServerVariants && this.variantData.length === 0) return;

      this.takeOverNativeControls();
      this.moneyFormat = this.dataset.moneyFormat || '';
      this.quantityInput = this.querySelector('[data-quantity-input]');
      this.lineTotal = this.querySelector('[data-line-total]');

      if (this.quantityInput && this.lineTotal) {
        const recalculate = () => this.updateLineTotal();
        this.listen(this.quantityInput, 'input', recalculate);
        this.listen(this.quantityInput, 'change', recalculate);
      }

      this.listen(this, 'change', (event) => {
        if (event.target.matches('[data-option-position]')) {
          this.updateSelectedOptionLabels();
          if (this.usesServerVariants) {
            this.resolveVariant();
          } else {
            this.updateOptionAvailability();
            this.updateVariant();
          }
          return;
        }

        if (event.target.matches('[data-purchase-option]')) {
          this.updatePurchaseSelection();
          return;
        }

        if (event.target.matches('[data-selling-plan-select]')) {
          this.updatePurchaseSelection();
        }
      });

      this.listen(this, 'submit', (event) => {
        const form = event.target;
        if (!form.matches('[data-cart-add-form]')) return;

        const variant = this.currentVariant;
        if (!variant?.id || !this.isPurchaseOptionValid(variant)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, { capture: true });

      this.cachePurchaseOptionElements();
      this.updateSelectedOptionLabels();

      this.currentVariant = this.getInitialVariant();
      if (!this.usesServerVariants) this.updateOptionAvailability();
      this.updatePurchaseOptions(this.currentVariant);
      this.updateQuantityRules(this.currentVariant);
      this.updateForms(this.currentVariant);
      this.updatePrice(this.currentVariant);
    }

    disconnectedCallback() {
      this.variantRequest?.abort();
      super.disconnectedCallback();
    }

    getVariantData() {
      const dataElement = this.querySelector('[data-variant-json]');
      if (!dataElement) return [];

      try {
        return JSON.parse(dataElement.textContent);
      } catch {
        return [];
      }
    }

    getInitialVariant() {
      const variantId = this.dataset.initialVariantId;
      if (!this.usesServerVariants) {
        return this.variantData.find((variant) => String(variant.id) === variantId) || null;
      }

      const root = this.querySelector('[data-variant-state]');
      const payload = root?.querySelector('[data-resolved-variant]');
      if (!variantId || !payload || root.dataset.productId !== this.dataset.productId
        || root.dataset.variantId !== variantId) return null;
      const requestedValues = new URLSearchParams(window.location.search).get('option_values');
      if (requestedValues !== null) {
        const selectedValues = Array.from(root.querySelectorAll('[data-state-option-value][data-selected]'))
          .map((value) => value.dataset.stateOptionValue).join(',');
        if (!selectedValues || selectedValues !== requestedValues) return null;
      }
      try {
        const variant = JSON.parse(payload.textContent);
        return String(variant?.id) === variantId ? variant : null;
      } catch {
        return null;
      }
    }

    async resolveVariant() {
      this.variantRequest?.abort();
      const request = new AbortController();
      this.variantRequest = request;

      const inputs = Array.from(this.querySelectorAll('[data-option-position]:checked'));
      const optionValueIds = inputs.map((input) => input.dataset.optionValueId);
      const optionLabels = inputs.map((input) => input.value);
      const key = optionValueIds.join(',');
      const picker = this.querySelector('[data-variant-picker]');
      picker?.setAttribute('aria-busy', 'true');
      this.currentVariant = null;
      this.currentAllocation = null;
      this.updateForms(null);

      try {
        if (!key || optionValueIds.some((id) => !id)) {
          throw new Error('Incomplete variant selection');
        }

        let state = this.variantStateCache.get(key);
        if (!state || state.expiresAt <= Date.now()) {
          await new Promise((resolve) => window.setTimeout(resolve, 80));
          if (this.variantRequest !== request || request.signal.aborted) return;

          const sectionId = this.dataset.variantStateSection;
          const url = new URL(this.dataset.variantStateUrl, document.baseURI);
          url.searchParams.delete('variant');
          url.searchParams.delete('selling_plan');
          url.searchParams.set('section_id', sectionId);
          url.searchParams.set('option_values', key);

          const response = await fetch(url, { signal: request.signal });
          if (!response.ok) throw new Error('Variant request failed');
          const documentState = new DOMParser().parseFromString(await response.text(), 'text/html');
          const root = documentState.querySelector('[data-variant-state]');
          const payload = root?.querySelector('[data-resolved-variant]');
          if (!payload || root.dataset.productId !== this.dataset.productId
            || root.dataset.stateSectionId !== sectionId) {
            throw new Error('Unexpected product in variant response');
          }

          const variant = JSON.parse(payload.textContent);
          const values = Array.from(root.querySelectorAll('[data-state-option-value]'));
          const resolvedOptionIds = values
            .filter((value) => value.hasAttribute('data-selected'))
            .map((value) => value.dataset.stateOptionValue)
            .join(',');
          const variantId = variant === null ? '' : String(variant.id);
          if (resolvedOptionIds !== key
            || variantId !== root.dataset.variantId
            || (variant !== null && (!/^\d+$/.test(variantId)
              || !Array.isArray(variant.options)
              || variant.options.length !== optionLabels.length
              || variant.options.some((label, index) => label !== optionLabels[index])))) {
            throw new Error('Unexpected selection in variant response');
          }

          state = { variant, values, expiresAt: Date.now() + 15000 };
          if (this.variantStateCache.size >= 16) {
            this.variantStateCache.delete(this.variantStateCache.keys().next().value);
          }
          this.variantStateCache.set(key, state);
        }

        if (this.variantRequest !== request || request.signal.aborted || !this.isConnected) return;
        const availableValues = new Map(state.values.map((value) => [
          value.dataset.stateOptionValue, value.getAttribute('aria-disabled') === 'false',
        ]));
        this.querySelectorAll('[data-option-value-id]').forEach((input) => {
          const available = availableValues.get(input.dataset.optionValueId) === true;
          input.setAttribute('aria-disabled', String(!available));
          const label = this.querySelector(`label[for="${input.id}"] [data-unavailable-label]`);
          if (label) label.hidden = available;
        });
        const variant = state.variant;
        this.applyVariant(variant);
        if (!variant && key && this.dataset.productUrl) {
          const url = new URL(window.location.href);
          url.searchParams.delete('variant');
          url.searchParams.delete('selling_plan');
          url.searchParams.set('option_values', key);
          window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
        }
      } catch {
        if (this.variantRequest !== request || request.signal.aborted || !this.isConnected) return;
        this.applyVariant(null, { updateUrl: false });
      } finally {
        if (this.variantRequest === request) {
          this.variantRequest = null;
          picker?.removeAttribute('aria-busy');
        }
      }
    }

    // With JS, the native variant and plan selects (the no-JS ones) stop submitting values: they
    // are disabled and lose their name so form.elements.namedItem('id') and ('selling_plan') remain
    // a single control. The variant hidden input is activated.
    takeOverNativeControls() {
      this.querySelectorAll('[data-no-js-control]').forEach((control) => {
        control.disabled = true;
        control.removeAttribute('name');
      });
    }

    cachePurchaseOptionElements() {
      this.sellingPlans = this.querySelector('[data-selling-plans]');
      this.sellingPlanInput = this.querySelector('[data-selling-plan-input]');
      this.sellingPlanSelect = this.querySelector('[data-selling-plan-select]');
      this.sellingPlanDetails = this.querySelector('[data-selling-plan-details]');
      this.sellingPlanStatus = this.querySelector('[data-selling-plan-status]');
      this.perDeliveryPrice = this.querySelector('[data-selling-plan-per-delivery]');
      this.oneTimeInput = this.querySelector('[data-purchase-option="one_time"]');
      this.subscriptionInput = this.querySelector('[data-purchase-option="subscription"]');
      this.oneTimePrice = this.querySelector('[data-one-time-price]');
      this.subscriptionPrice = this.querySelector('[data-subscription-price]');
      this.currentAllocation = null;
    }

    getSelectedOptions() {
      const selectedOptions = [];

      this.querySelectorAll('[data-option-position]:checked').forEach((input) => {
        selectedOptions[Number(input.dataset.optionPosition) - 1] = input.value;
      });

      return selectedOptions;
    }

    updateSelectedOptionLabels() {
      this.querySelectorAll('[data-option-position]:checked').forEach((input) => {
        const output = this.querySelector(`[data-selected-option="${input.dataset.optionPosition}"]`);
        if (output) output.textContent = input.value;
      });
    }

    // The sold-out notice depends on the combination with the other selected options. Only a value
    // with no available variant at all is disabled: disabling per combination would leave in-stock
    // combinations unreachable (Camel/L and Black/S, for example).
    updateOptionAvailability() {
      const selectedOptions = this.getSelectedOptions();
      this.querySelectorAll('[data-option-position]').forEach((input) => {
        const optionIndex = Number(input.dataset.optionPosition) - 1;
        const inStock = this.variantData.filter(
          (variant) => variant.available && variant.options[optionIndex] === input.value,
        );
        const availableHere = inStock.some((variant) => variant.options.every(
          (value, index) => index === optionIndex || selectedOptions[index] == null || value === selectedOptions[index],
        ));
        const unavailableLabel = this.querySelector(
          `label[for="${input.id}"] [data-unavailable-label]`,
        );

        input.disabled = inStock.length === 0;
        input.setAttribute('aria-disabled', String(input.disabled));
        if (unavailableLabel) unavailableLabel.hidden = availableHere;
      });
    }

    updateVariant() {
      const selectedOptions = this.getSelectedOptions();
      const variant = this.variantData.find(
        (candidate) =>
          candidate.options.length === selectedOptions.length &&
          candidate.options.every((option, index) => option === selectedOptions[index]),
      );

      this.applyVariant(variant || null);
    }

    applyVariant(variant, { updateUrl = true } = {}) {
      this.currentVariant = variant;
      this.updatePurchaseOptions(variant);
      this.updateQuantityRules(variant);
      this.updateForms(variant, { resolvingVariant: false });
      this.updatePrice(variant);
      this.updateMedia(variant);
      this.updateStatus(variant, { variantChanged: true });
      if (updateUrl) this.updateUrl(variant);
      this.dispatchEvent(
        new CustomEvent('theme:variant-change', {
          bubbles: true,
          detail: { variant },
        }),
      );
      this.dispatchPurchaseOptionChange();
    }

    updatePurchaseSelection() {
      if (this.variantRequest) return;
      this.updatePurchaseOptions(this.currentVariant);
      this.updateForms(this.currentVariant);
      this.updatePrice(this.currentVariant);
      this.updateStatus(this.currentVariant);
      this.updateUrl(this.currentVariant);
      this.dispatchPurchaseOptionChange();
    }

    updatePurchaseOptions(variant) {
      if (!this.sellingPlans) {
        this.currentAllocation = null;
        return;
      }

      const allocations = variant?.selling_plan_allocations || [];
      const allocationIds = new Set(allocations.map((allocation) => String(allocation.id)));

      this.sellingPlanSelect?.querySelectorAll('[data-selling-plan-option]').forEach((option) => {
        const available = allocationIds.has(String(option.value));
        option.disabled = !available;
        option.hidden = !available;
      });
      this.sellingPlanSelect?.querySelectorAll('[data-selling-plan-group]').forEach((group) => {
        group.hidden = !Array.from(group.querySelectorAll('[data-selling-plan-option]')).some(
          (option) => !option.disabled,
        );
      });

      const requestedPlanId = this.sellingPlanSelect?.value || this.sellingPlanInput?.value;
      const selectedAllocation = allocations.find(
        (allocation) => String(allocation.id) === String(requestedPlanId),
      ) || allocations[0] || null;
      const oneTimeAvailable = Boolean(variant?.available && !variant.requires_selling_plan);
      const subscriptionAvailable = Boolean(variant?.available && selectedAllocation);

      if (this.oneTimeInput) this.oneTimeInput.disabled = !oneTimeAvailable;
      if (this.subscriptionInput) this.subscriptionInput.disabled = !subscriptionAvailable;

      let purchaseMode = this.getPurchaseMode();
      if (variant?.requires_selling_plan && subscriptionAvailable) {
        purchaseMode = 'subscription';
      } else if (purchaseMode === 'subscription' && !subscriptionAvailable) {
        purchaseMode = oneTimeAvailable ? 'one_time' : null;
      } else if (purchaseMode === 'one_time' && !oneTimeAvailable) {
        purchaseMode = subscriptionAvailable ? 'subscription' : null;
      } else if (!purchaseMode) {
        purchaseMode = oneTimeAvailable ? 'one_time' : (subscriptionAvailable ? 'subscription' : null);
      }

      if (this.oneTimeInput) this.oneTimeInput.checked = purchaseMode === 'one_time';
      if (this.subscriptionInput) this.subscriptionInput.checked = purchaseMode === 'subscription';
      if (this.sellingPlanSelect && selectedAllocation) {
        this.sellingPlanSelect.value = String(selectedAllocation.id);
      }

      const subscriptionSelected = purchaseMode === 'subscription' && selectedAllocation;
      this.currentAllocation = subscriptionSelected ? selectedAllocation : null;

      if (this.sellingPlanDetails) this.sellingPlanDetails.hidden = !subscriptionSelected;
      if (this.sellingPlanSelect) this.sellingPlanSelect.disabled = !subscriptionSelected;
      if (this.sellingPlanInput) {
        const previousPlanId = this.sellingPlanInput.value;
        const wasDisabled = this.sellingPlanInput.disabled;
        this.sellingPlanInput.value = subscriptionSelected ? selectedAllocation.id : '';
        this.sellingPlanInput.disabled = !subscriptionSelected;
        if (
          previousPlanId !== String(this.sellingPlanInput.value)
          || wasDisabled !== this.sellingPlanInput.disabled
        ) {
          this.sellingPlanInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      if (this.oneTimePrice) this.oneTimePrice.textContent = variant?.price || '';
      if (this.subscriptionPrice) {
        this.subscriptionPrice.textContent = selectedAllocation?.price
          || this.dataset.sellingPlanUnavailableText;
      }
      // It is only rewritten if it changes: restoring the same text in an aria-live region can make
      // it announce again. If it changes with the plan visible, it already announces the plan price
      // and updateStatus does not repeat it.
      let planStatusChanged = false;
      if (this.sellingPlanStatus) {
        const planStatusText = subscriptionSelected
          ? `${selectedAllocation.name}: ${selectedAllocation.price}`
          : oneTimeAvailable
            ? `${this.dataset.oneTimeText}: ${variant.price}`
            : this.dataset.sellingPlanUnavailableText;
        planStatusChanged = this.sellingPlanStatus.textContent !== planStatusText;
        if (planStatusChanged) this.sellingPlanStatus.textContent = planStatusText;
      }
      this.planStatusAnnouncedPrice = Boolean(subscriptionSelected && planStatusChanged
        && isFocusTargetUsable(this.sellingPlanStatus));
      if (this.perDeliveryPrice) {
        const showPerDelivery = Boolean(
          subscriptionSelected
          && selectedAllocation.per_delivery_price
          && selectedAllocation.per_delivery_price !== selectedAllocation.price,
        );
        this.perDeliveryPrice.hidden = !showPerDelivery;
        this.perDeliveryPrice.textContent = showPerDelivery
          ? this.dataset.perDeliveryTemplate.replace('[price]', selectedAllocation.per_delivery_price)
          : '';
      }
    }

    getPurchaseMode() {
      return this.querySelector('[data-purchase-option]:checked')?.dataset.purchaseOption || null;
    }

    isPurchaseOptionValid(variant) {
      if (!variant?.available) return false;
      // Without a plans block on the product page (the product has no groups to offer), a variant
      // that requires a plan cannot be bought either: Shopify answers 200 to /cart/add without
      // creating the line. It fails closed, like the Liquid.
      if (!this.sellingPlans) return !variant.requires_selling_plan;
      if (this.getPurchaseMode() === 'subscription') return Boolean(this.currentAllocation);
      return !variant.requires_selling_plan;
    }

    dispatchPurchaseOptionChange() {
      const variant = this.currentVariant;
      this.dispatchEvent(
        new CustomEvent('theme:purchase-option-change', {
          bubbles: true,
          detail: {
            variant,
            allocation: this.currentAllocation,
            price: this.currentAllocation?.price || variant?.price || '',
          },
        }),
      );
    }

    updateForms(variant, { resolvingVariant = Boolean(this.variantRequest) } = {}) {
      this.querySelectorAll('input[data-variant-id]').forEach((input) => {
        const nextValue = variant?.id || '';
        const disabled = !nextValue;
        const valueChanged = String(input.value) !== String(nextValue) || input.disabled !== disabled;
        input.value = nextValue;
        input.disabled = disabled;
        if (valueChanged) input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      const purchaseOptionValid = this.isPurchaseOptionValid(variant);
      this.querySelectorAll('[data-add-to-cart]').forEach((button) => {
        // Never re-enable a button whose form still has an add-to-cart request in flight.
        const cartAddPending = button.form?.dataset.cartAddPending === 'true';
        button.disabled = !purchaseOptionValid || cartAddPending;
        if (resolvingVariant || button.hasAttribute('aria-busy')) {
          button.setAttribute('aria-busy', String(resolvingVariant || cartAddPending));
        }
        const label = button.querySelector('[data-add-to-cart-text]');
        if (!label) return;

        if (resolvingVariant) {
          label.textContent = this.dataset.variantLoadingText;
        } else if (!variant) {
          label.textContent = this.dataset.unavailableText;
        } else if (!variant.available) {
          label.textContent = this.dataset.soldOutText;
        } else if (!purchaseOptionValid) {
          label.textContent = this.dataset.sellingPlanUnavailableText;
        } else {
          label.textContent = this.dataset.addToCartText;
        }
      });

      this.querySelectorAll('.product-form__dynamic-checkout').forEach((container) => {
        container.hidden = !purchaseOptionValid;
      });

      // The reason is only explained when it applies: an available variant that requires a plan and
      // has none assigned. Sold out or nonexistent is already said by the button label.
      const planMissing = Boolean(
        variant?.available
        && variant.requires_selling_plan
        && !(variant.selling_plan_allocations || []).length,
      );
      this.querySelectorAll('[data-plan-required-notice]').forEach((notice) => {
        notice.hidden = !planMissing;
      });
    }

    updatePrice(variant) {
      const priceSource = this.currentAllocation || variant;
      const currentPrice = this.querySelector('[data-current-price]');
      const comparePrice = this.querySelector('[data-compare-price]');
      const saleBadge = this.querySelector('[data-sale-badge]');
      const soldOutBadge = this.querySelector('[data-sold-out-badge]');
      const unitPrice = this.querySelector('[data-unit-price]');

      if (currentPrice) currentPrice.textContent = priceSource?.price || '';

      if (comparePrice) {
        comparePrice.hidden = !priceSource?.compare_at_price;
        comparePrice.textContent = priceSource?.compare_at_price || '';
      }

      if (saleBadge) saleBadge.hidden = !priceSource?.compare_at_price;

      // The screen reader labels follow the sale state of the selected variant, as the card already
      // does (product-card-variants). Without this, going from a variant on sale to one that is not
      // kept being read as "Sale price ... Regular price".
      const values = currentPrice?.closest('.price__values');
      const wrapper = currentPrice?.closest('[data-price-wrapper]');
      if (wrapper) wrapper.hidden = !variant;
      const varies = values && [...values.children].some((child) => child.tagName === 'SPAN'
        && !child.classList.contains('visually-hidden') && !child.hasAttribute('data-current-price'));
      if (values && wrapper?.dataset.labelSale && !varies) {
        const label = (text) => Object.assign(document.createElement('span'), { className: 'visually-hidden', textContent: text });
        values.querySelectorAll(':scope > .visually-hidden').forEach((node) => node.remove());
        if (priceSource?.compare_at_price) {
          currentPrice.before(label(wrapper.dataset.labelSale));
          comparePrice?.before(label(wrapper.dataset.labelRegular));
        } else {
          currentPrice.before(label(wrapper.dataset.labelRegular));
        }
      }
      if (soldOutBadge) soldOutBadge.hidden = variant?.available !== false;

      if (unitPrice) {
        const hasUnitPrice = Boolean(priceSource?.unit_price);
        unitPrice.hidden = !hasUnitPrice;

        if (hasUnitPrice) {
          const value = unitPrice.querySelector('[data-unit-price-value]');
          const reference = unitPrice.querySelector('[data-unit-price-reference]');
          if (value) value.textContent = priceSource.unit_price;
          if (reference) {
            const referenceValue = variant.unit_reference_value === 1 ? '' : variant.unit_reference_value;
            reference.textContent = `${referenceValue || ''}${variant.unit_reference_unit || ''}`;
          }
        }
      }

      this.updateLineTotal();
    }

    // Shows what the line will cost, without ever touching the unit price above it.
    updateLineTotal() {
      if (!this.lineTotal || !this.quantityInput) return;

      const label = this.lineTotal.querySelector('[data-line-total-label]');
      const current = this.lineTotal.querySelector('[data-line-total-current]');
      const compare = this.lineTotal.querySelector('[data-line-total-compare]');
      const compareValue = this.lineTotal.querySelector('[data-line-total-compare-value]');
      const priceSource = this.currentAllocation || this.currentVariant;
      let quantity = Number.parseInt(this.quantityInput.value, 10);
      const maxAttr = this.quantityInput.getAttribute('max');
      if (maxAttr !== null && maxAttr !== '' && Number.isFinite(Number(maxAttr))) {
        const maxVal = Number(maxAttr);
        if (quantity > maxVal) {
          quantity = maxVal;
          this.quantityInput.value = String(maxVal);
        }
      }
      const unitCents = Number(priceSource?.price_cents);

      const minQty = Number.parseInt(this.quantityInput.min, 10) || 1;
      const isFieldValid = !this.quantityInput.checkValidity || this.quantityInput.checkValidity();
      // A sold-out variant cannot be bought: announcing what 3 of them would cost is confusing.
      const showTotal = isFieldValid
        && this.currentVariant?.available !== false
        && priceSource?.price_cents != null
        && priceSource.price_cents !== ''
        && Number.isFinite(quantity)
        && (quantity > 1 || minQty > 1)
        && Number.isFinite(unitCents);

      if (!showTotal) {
        this.lineTotal.setAttribute('data-empty', '');
        if (label) label.textContent = '';
        if (current) current.textContent = '';
        if (compareValue) compareValue.textContent = '';
        if (compare) compare.hidden = true;
        return;
      }

      const compareCents = Number(priceSource?.compare_at_price_cents);
      const hasCompare = Number.isFinite(compareCents) && compareCents > unitCents;

      if (label) {
        label.textContent = (this.dataset.lineTotalTemplate || '')
          .replace('[quantity]', String(quantity));
      }
      if (current) current.textContent = formatMoney(unitCents * quantity, this.moneyFormat);
      if (compareValue) {
        compareValue.textContent = hasCompare
          ? formatMoney(compareCents * quantity, this.moneyFormat)
          : '';
      }
      if (compare) compare.hidden = !hasCompare;

      this.lineTotal.removeAttribute('data-empty');
    }

    updateQuantityRules(variant) {
      const quantityInput = this.querySelector('[data-quantity-input]');
      if (!quantityInput) return;

      const before = [
        quantityInput.value,
        quantityInput.getAttribute('min'),
        quantityInput.getAttribute('step'),
        quantityInput.getAttribute('max'),
      ].join('|');

      const minimum = Number(variant?.quantity_min) || 1;
      const increment = Math.abs(Number(variant?.quantity_increment)) || 1;
      quantityInput.min = minimum;
      quantityInput.step = increment;

      let effectiveMax = variant?.quantity_max ?? null;
      if (effectiveMax === null && variant?.inventory_management && variant.inventory_policy === 'deny') {
        const inventoryEl = this.querySelector('product-inventory') || this.closest('section')?.querySelector('product-inventory');
        // The JSON clamps stock to threshold + 1 on purpose, so as not to publish the real
        // inventory (variant-no-js-select, inventory_cap). Only a stock <= threshold is exact, so
        // the ceiling is only applied there. Without an inventory block the threshold is 0, like
        // the one the Liquid uses; with 1 the stock clamped to 1 limited every purchase.
        const threshold = inventoryEl ? (Number(inventoryEl.dataset.threshold) || 0) : 0;
        const qty = Number(variant.inventory_quantity);
        if (Number.isFinite(qty) && qty > 0 && qty <= threshold) {
          effectiveMax = qty;
        }
      }

      // Sold out: the quantity stays at the minimum and + is turned off (syncQuantityStepper reads
      // max). Without this the stepper kept going up on an item that cannot be bought.
      if (variant?.available !== true) effectiveMax = minimum;

      // The field's max is the last reachable step, not the raw limit: that way min, step and max
      // describe the same grid. If not even the minimum fits (inventory below the minimum), max =
      // min and both buttons are turned off.
      const gridMax = effectiveMax === null
        ? Infinity
        : Math.max(minimum, quantityGridMax(minimum, increment, Number(effectiveMax)));
      if (gridMax === Infinity) quantityInput.removeAttribute('max');
      else quantityInput.max = gridMax;

      // Available variant whose stock does not reach the minimum: the field stays at min but is
      // marked invalid, so the form's native validation blocks submission and announces the reason,
      // as the raw max used to. The buy button is not touched.
      const belowMinimum = variant?.available === true && effectiveMax !== null
        && quantityGridMax(minimum, increment, Number(effectiveMax)) < minimum;
      quantityInput.setCustomValidity(belowMinimum ? (this.dataset.unavailableText || 'Unavailable') : '');

      const current = Number(quantityInput.value);
      quantityInput.value = snapQuantity(Number.isFinite(current) ? current : minimum, minimum, increment, gridMax);

      const after = [
        quantityInput.value,
        quantityInput.getAttribute('min'),
        quantityInput.getAttribute('step'),
        quantityInput.getAttribute('max'),
      ].join('|');

      // A 'change' event communicates the new limit to the quantity selector, the same as typing.
      if (before !== after) quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    updateMedia(variant) {
      const productSection = this.closest('[data-section-id]');
      productSection?.querySelectorAll('[data-product-media-id]').forEach((media) => {
        media.toggleAttribute('data-selected', String(media.dataset.productMediaId) === String(variant?.featured_media_id));
      });
      // On narrow screens the gallery is a scrollable strip where the chosen media goes first
      // (order: -1): it scrolls back to the start so the variant change is visible.
      productSection?.querySelectorAll('.featured-product__gallery').forEach((gallery) => {
        if (gallery.scrollWidth > gallery.clientWidth && gallery.querySelector('[data-selected]')) {
          gallery.scrollTo({ left: 0 });
        }
      });
    }

    // An available variant change is announced with its price (the plan's if there is a
    // subscription), in a single atomic text: "[title], [price]: ...". The price is not repeated if
    // the plan state already announced it in this same change. A purchase option change does not
    // announce availability again if it did not change: the plan state announces that price.
    updateStatus(variant, { variantChanged = false } = {}) {
      const status = this.querySelector('[data-variant-status]');
      if (!status) return;

      const available = Boolean(variant?.available) && this.isPurchaseOptionValid(variant);
      const base = !variant
        ? this.dataset.unavailableText
        : !variant.available
          ? `${variant.title}: ${this.dataset.soldOutStatus}`
          : !available
            ? this.dataset.sellingPlanUnavailableText
            : `${variant.title}: ${this.dataset.availableStatus}`;
      const baseChanged = base !== this.statusBase;
      this.statusBase = base;

      let announcement = base;
      if (variantChanged) {
        // A money format with HTML (<span class=money>) must not be read out with its tags.
        const price = String((this.currentAllocation || variant)?.price || '').replace(/<[^>]*>/g, '').trim();
        const template = this.dataset.availablePriceStatus;
        if (available && price && template && !this.planStatusAnnouncedPrice) {
          announcement = template.replace(/\[(title|price)\]/g, (match, key) => (key === 'title' ? variant.title : price));
        }
      } else if (!baseChanged) {
        return;
      }
      if (status.textContent !== announcement) status.textContent = announcement;
    }

    updateUrl(variant) {
      if (!variant || !this.dataset.productUrl) return;

      const path = this.usesServerVariants ? window.location.href : this.dataset.productUrl;
      const url = new URL(path, document.baseURI);
      url.searchParams.delete('option_values');
      url.searchParams.set('variant', variant.id);
      if (this.currentAllocation) {
        url.searchParams.set('selling_plan', this.currentAllocation.id);
      } else {
        url.searchParams.delete('selling_plan');
      }
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }

  class ProductInventory extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.message = this.querySelector('[data-inventory-message]');
      const variants = this.closest('variant-selects');
      if (!variants || !this.message) return;

      this.listen(variants, 'theme:variant-change', (event) => {
        this.update(event.detail?.variant);
      });
    }

    update(variant) {
      const quantity = Number(variant?.inventory_quantity);
      let state = 'inStock';

      if (!variant) {
        state = 'unavailable';
      } else if (!variant.available) {
        state = 'soldOut';
      } else if (variant.inventory_management === 'shopify') {
        if (variant.inventory_policy === 'continue' && quantity <= 0) {
          state = 'preorder';
        } else if (quantity > 0 && quantity <= Number(this.dataset.threshold)) {
          state = 'lowStock';
        }
      }

      this.dataset.stockState = state.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      this.message.textContent = state === 'lowStock'
        ? (this.dataset.showCount === 'true'
          ? (quantity === 1 && this.dataset.lowStockTemplateOne
            ? this.dataset.lowStockTemplateOne
            : this.dataset.lowStockTemplate.replace('[count]', String(quantity)))
          : this.dataset.lowStockGeneric)
        : this.dataset[state];
    }
  }

  const recentViewsKey = 'theme:recently-viewed';
  const readRecentViews = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(recentViewsKey) || '[]');
      if (!Array.isArray(stored)) return [];
      return [...new Set(stored.map(String).filter((id) => /^\d{1,20}$/.test(id)))].slice(0, 8);
    } catch {
      return [];
    }
  };

  const rememberViewedProduct = () => {
    const productId = document.querySelector('[data-recently-viewed-product-id]')
      ?.dataset.recentlyViewedProductId;
    if (!/^\d{1,20}$/.test(productId || '')) return;
    try {
      localStorage.setItem(
        recentViewsKey,
        JSON.stringify([productId, ...readRecentViews().filter((id) => id !== productId)].slice(0, 8)),
      );
    } catch {
      // Storage can be unavailable in private contexts; the storefront remains usable.
    }
  };

  class RecentlyViewed extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.grid = this.querySelector('[data-recently-viewed-grid]');
      this.requestController = null;
      if (!this.grid || !this.dataset.sectionId || !this.dataset.searchUrl) return;

      this.listen(window, 'storage', (event) => {
        if (event.key === recentViewsKey) this.load();
      });
      this.load();
    }

    disconnectedCallback() {
      this.requestController?.abort();
      super.disconnectedCallback();
    }

    async load() {
      this.requestController?.abort();
      this.grid.replaceChildren();
      this.hidden = true;

      const ids = readRecentViews()
        .filter((id) => id !== this.dataset.currentProductId)
        .slice(0, Math.min(8, Number(this.dataset.productsToShow) || 4));
      if (ids.length === 0) return;

      const request = new AbortController();
      this.requestController = request;
      const params = new URLSearchParams({
        section_id: this.dataset.sectionId,
        type: 'product',
        q: ids.map((id) => `id:${id}`).join(' OR '),
      });
      this.setAttribute('aria-busy', 'true');

      try {
        const response = await fetch(`${this.dataset.searchUrl}?${params}`, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: request.signal,
        });
        if (!response.ok) throw new Error(String(response.status));

        const sectionHtml = await response.text();
        if (request !== this.requestController || !this.isConnected) return;
        const parsed = new DOMParser().parseFromString(sectionHtml, 'text/html');
        const source = parsed.querySelector('recently-viewed');
        if (!source) return;

        const cards = new Map(
          Array.from(source.querySelectorAll('[data-recently-viewed-card]'))
            .map((card) => [card.dataset.productId, card]),
        );
        const selected = ids.map((id) => cards.get(id)).filter(Boolean);
        if (selected.length === 0) return;

        selected.forEach((card) => {
          if (this.dataset.showSecondaryImage !== 'true') {
            card.querySelectorAll('.product-card__image--secondary').forEach((image) => image.remove());
            card.querySelectorAll('[data-has-secondary]').forEach((media) => media.removeAttribute('data-has-secondary'));
          }
          if (this.dataset.showVendor !== 'true') {
            card.querySelectorAll('.product-card__vendor').forEach((vendor) => vendor.remove());
          }
          if (this.dataset.showQuickAdd !== 'true') {
            card.querySelectorAll('.product-card__action').forEach((action) => action.remove());
            const variants = card.querySelector('product-card-variants');
            if (variants) variants.dataset.quickBuyMode = 'none';
          }
        });

        this.grid.replaceChildren(...selected);
        this.hidden = false;
      } catch (error) {
        if (error.name !== 'AbortError') this.hidden = true;
      } finally {
        if (request === this.requestController) this.setAttribute('aria-busy', 'false');
      }
    }
  }

  class StickyCartBar extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.productForm = document.getElementById(this.dataset.productFormId);
      this.primaryButton = this.productForm?.querySelector('[data-add-to-cart]');
      this.submitButton = this.querySelector('[data-sticky-submit]');
      this.variantOutput = this.querySelector('[data-sticky-variant]');
      this.priceOutput = this.querySelector('[data-sticky-price]');
      this.totalOutput = this.querySelector('[data-sticky-total]');
      this.label = this.querySelector('[data-sticky-label]');
      this.spinner = this.querySelector('[data-loading-icon]');
      this.variantSelects = this.closest('[data-section-id]')?.querySelector('variant-selects');

      if (!this.productForm || !this.primaryButton || !this.submitButton) return;

      // The bar appears when the form is no longer visible, so it has to say the same as the form:
      // how many units are added and how much they total. The quantity comes from the form's field
      // (inside it or associated with form="") and the total from the line total that
      // VariantSelects already paints, never from a second calculation.
      const quantityField = this.productForm.elements.namedItem('quantity');
      this.quantityInput = quantityField instanceof HTMLInputElement ? quantityField : null;
      this.lineTotal = this.closest('[data-section-id]')?.querySelector('[data-line-total]') || null;
      // The Liquid paints the one-time purchase price; with a plan already chosen on load
      // (?selling_plan= or a variant that requires a plan) VariantSelects has already decided the
      // plan price and does not emit the event again, so it is taken from its state.
      this.unitPrice = this.variantSelects?.currentAllocation?.price
        || this.priceOutput?.textContent.trim() || '';
      this.productTitle = this.querySelector('.sticky-cart-bar__title')?.textContent.trim() || '';

      if (this.quantityInput) {
        this.listen(this.quantityInput, 'input', () => this.renderQuantity());
        this.listen(this.quantityInput, 'change', () => this.renderQuantity());
      }
      if (this.lineTotal) {
        // The line total is rewritten after every change of quantity, variant or purchase plan:
        // observing it avoids depending on the order in which the listeners run.
        this.lineTotalObserver = new MutationObserver(() => this.renderQuantity());
        this.lineTotalObserver.observe(this.lineTotal, {
          attributes: true,
          attributeFilter: ['data-empty'],
          childList: true,
          characterData: true,
          subtree: true,
        });
      }

      this.setVisible(false);
      this.listen(this.submitButton, 'click', () => {
        if (!this.submitButton.disabled) this.productForm.requestSubmit(this.primaryButton);
      });

      if (this.variantSelects) {
        this.listen(this.variantSelects, 'theme:variant-change', (event) => {
          this.updateVariant(event.detail?.variant);
        });
        this.listen(this.variantSelects, 'theme:purchase-option-change', (event) => {
          this.unitPrice = event.detail?.price || '';
          this.renderQuantity();
          this.syncButtonState();
        });
      }

      this.buttonObserver = new MutationObserver(() => this.syncButtonState());
      this.buttonObserver.observe(this.primaryButton, {
        attributes: true,
        attributeFilter: ['aria-busy', 'disabled'],
        childList: true,
        subtree: true,
      });

      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(([entry]) => {
          this.setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
        });
        this.intersectionObserver.observe(this.primaryButton);
      } else {
        const updateVisibility = () => {
          const bounds = this.primaryButton.getBoundingClientRect();
          this.setVisible(bounds.bottom <= 0);
        };
        this.listen(window, 'scroll', updateVisibility, { passive: true });
        updateVisibility();
      }

      this.renderQuantity();
      this.syncButtonState();
    }

    disconnectedCallback() {
      this.intersectionObserver?.disconnect();
      this.buttonObserver?.disconnect();
      this.lineTotalObserver?.disconnect();
      this.setVisible(false);
      super.disconnectedCallback();
    }

    setVisible(visible) {
      // WCAG 2.4.3: inert on a subtree that has focus throws it to <body>.
      if (!visible && this.contains(document.activeElement)) this.handOffFocus();
      this.toggleAttribute('data-visible', visible);
      this.setAttribute('aria-hidden', String(!visible));
      this.inert = !visible;
      document.body.toggleAttribute('data-sticky-cart-visible', visible);
      // WCAG 2.4.11: with the bar visible, keyboard focus stops above it. It is the same mechanism
      // --header-offset uses above.
      document.documentElement.style.setProperty('--sticky-cart-offset', visible ? `${this.offsetHeight}px` : '0px');
    }

    // The bar is hidden because the main add-to-cart button is already on screen: focus moves to
    // it.
    handOffFocus() {
      const target = this.primaryButton && !this.primaryButton.disabled
        ? this.primaryButton
        : Array.from(this.productForm?.elements || []).find(
          (element) => !element.disabled && element.type !== 'hidden' && !this.contains(element)
            && element.checkVisibility?.() !== false,
        );
      target?.focus({ preventScroll: target === this.primaryButton });
    }

    updateVariant(variant) {
      if (this.variantOutput && !this.hasAttribute('data-single-variant')) {
        this.variantOutput.textContent = variant?.title || this.dataset.unavailableText;
      }
      this.unitPrice = variant?.price || '';
      this.renderQuantity();
      this.syncButtonState();
    }

    renderQuantity() {
      const quantity = Number.parseInt(this.quantityInput?.value || '', 10);
      const multiple = Number.isFinite(quantity) && quantity > 1;
      const total = this.lineTotal && !this.lineTotal.hasAttribute('data-empty')
        ? this.lineTotal.querySelector('[data-line-total-current]')?.textContent.trim() || ''
        : '';

      if (this.priceOutput) {
        this.priceOutput.textContent = multiple && this.unitPrice
          ? (this.dataset.quantityPriceTemplate || '')
            .replace('[quantity]', String(quantity))
            .replace('[price]', this.unitPrice)
          : this.unitPrice;
      }

      if (this.totalOutput) {
        const showTotal = multiple && total !== '';
        this.totalOutput.hidden = !showTotal;
        this.totalOutput.textContent = showTotal
          ? (this.dataset.totalTemplate || '').replace('[total]', total)
          : '';
      }

      this.syncAccessibleName();
    }

    syncAccessibleName() {
      const action = this.label?.textContent.trim();
      if (!action) {
        this.submitButton.removeAttribute('aria-label');
        return;
      }
      const quantity = Number.parseInt(this.quantityInput?.value || '', 10);
      const template = Number.isFinite(quantity) && quantity > 1 && this.dataset.quantityLabelTemplate
        ? this.dataset.quantityLabelTemplate
        : this.dataset.actionLabelTemplate;
      const values = { action, product: this.productTitle, quantity: String(quantity) };
      const name = template ? template.replace(/\[(action|product|quantity)\]/g, (_, token) => values[token]) : action;
      this.submitButton.setAttribute('aria-label', name);
    }

    syncButtonState() {
      if (!this.primaryButton || !this.submitButton) return;

      const busy = this.primaryButton.getAttribute('aria-busy') === 'true';
      const primaryLabel = this.primaryButton.querySelector('[data-add-to-cart-text]');
      this.submitButton.disabled = this.primaryButton.disabled;
      this.submitButton.setAttribute('aria-busy', String(busy));
      if (this.label && primaryLabel) this.label.textContent = primaryLabel.textContent.trim();
      if (this.spinner) this.spinner.hidden = !busy;
      this.syncAccessibleName();
    }
  }

  class SizeGuideModal extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-size-guide-open]');
      this.overlay = this.querySelector('[data-size-guide-overlay]');
      this.panel = this.querySelector('[data-size-guide-panel]');
      this.closeButton = this.querySelector('[data-size-guide-close]');
      this.unitButtons = Array.from(this.querySelectorAll('[data-size-guide-unit]'));
      this.unitPanels = Array.from(this.querySelectorAll('[data-size-guide-panel-unit]'));
      this.managedInertElements = [];
      this.releaseFocusTrap = null;
      this.returnFocusTarget = null;

      if (!this.trigger || !this.overlay || !this.panel || !this.closeButton) return;

      this.setClosedState();
      this.setUnit(this.dataset.defaultUnit || 'cm');
      this.listen(this.trigger, 'click', () => this.open());
      this.listen(this.closeButton, 'click', () => this.close(true));
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target === this.overlay) this.close(true);
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.close(true);
      });
      this.unitButtons.forEach((button) => {
        this.listen(button, 'click', () => this.setUnit(button.dataset.sizeGuideUnit));
        this.listen(button, 'keydown', (event) => this.handleUnitKeydown(event));
      });
    }

    disconnectedCallback() {
      this.close(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.hasAttribute('data-open');
    }

    setClosedState() {
      this.overlay.hidden = true;
      this.panel.inert = true;
      this.panel.setAttribute('aria-hidden', 'true');
      this.trigger.setAttribute('aria-expanded', 'false');
      this.removeAttribute('data-open');
    }

    open() {
      if (this.isOpen) return;

      const returnTarget = document.activeElement;
      closeOtherDialogs(this);

      this.returnFocusTarget = returnTarget;
      this.overlay.hidden = false;
      this.panel.inert = false;
      this.panel.setAttribute('aria-hidden', 'false');
      this.trigger.setAttribute('aria-expanded', 'true');
      this.setAttribute('data-open', '');
      // Via syncDialogScrollLocks, which measures the scrollbar before locking.
      syncDialogScrollLocks();
      this.applyBackgroundInert();
      this.releaseFocusTrap = trapFocus(this.panel, this.closeButton);
    }

    close(restoreFocus = false) {
      if (!this.overlay || !this.panel || !this.trigger) return;

      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      this.setClosedState();
      syncDialogScrollLocks();
      this.restoreBackgroundInert();

      if (restoreFocus && this.returnFocusTarget?.isConnected) {
        this.returnFocusTarget.focus();
      }
    }

    setUnit(unit, focus = false) {
      const selectedButton = this.unitButtons.find(
        (button) => button.dataset.sizeGuideUnit === unit,
      );
      if (!selectedButton) return;

      this.unitButtons.forEach((button) => {
        const selected = button === selectedButton;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      this.unitPanels.forEach((panel) => {
        panel.hidden = panel.dataset.sizeGuidePanelUnit !== unit;
      });
      if (focus) selectedButton.focus();
    }

    handleUnitKeydown(event) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

      event.preventDefault();
      const currentIndex = this.unitButtons.indexOf(event.currentTarget);
      let nextIndex = currentIndex;

      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = this.unitButtons.length - 1;
      if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + this.unitButtons.length) % this.unitButtons.length;
      }
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % this.unitButtons.length;

      this.setUnit(this.unitButtons[nextIndex].dataset.sizeGuideUnit, true);
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this;

      while (currentElement.parentElement) {
        const parentElement = currentElement.parentElement;

        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });

        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }
  }

  class GiftCardRecipient extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.toggle = this.querySelector('[data-recipient-toggle]');
      this.fields = this.querySelector('[data-recipient-fields]');
      this.email = this.querySelector('[data-recipient-email]');
      this.message = this.querySelector('[data-recipient-message]');
      this.characterCount = this.querySelector('[data-recipient-character-count]');
      this.timezoneOffset = this.querySelector('[data-recipient-offset]');
      this.status = this.querySelector('[data-recipient-status]');

      if (!this.toggle || !this.fields) return;

      this.listen(this.toggle, 'change', () => this.syncState(true));
      if (this.message) this.listen(this.message, 'input', () => this.updateCharacterCount());
      this.syncState(false);
      this.updateCharacterCount();
    }

    syncState(announce) {
      const enabled = this.toggle.checked;
      this.toggle.setAttribute('aria-expanded', String(enabled));
      this.fields.hidden = !enabled;
      this.toggleAttribute('data-enabled', enabled);

      this.querySelectorAll('[data-recipient-field]').forEach((field) => {
        field.disabled = !enabled;
      });
      if (this.email) {
        this.email.required = enabled;
        this.email.setAttribute('aria-required', String(enabled));
      }
      if (this.timezoneOffset) {
        this.timezoneOffset.disabled = !enabled;
        this.timezoneOffset.value = enabled ? String(new Date().getTimezoneOffset()) : '';
      }
      if (announce && this.status) {
        this.status.textContent = enabled
          ? this.dataset.enabledStatus
          : this.dataset.disabledStatus;
      }
    }

    updateCharacterCount() {
      if (!this.message || !this.characterCount) return;
      const remaining = Math.max(0, Number(this.message.maxLength) - this.message.value.length);
      this.characterCount.textContent = this.dataset.charactersTemplate.replace('[count]', remaining);
    }
  }

  class PickupAvailability extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.requestController = null;
      this.managedInertElements = [];
      this.releaseFocusTrap = null;
      this.returnFocusTarget = null;
      this.refreshElements();
      this.setClosedState();

      this.listen(this, 'click', (event) => this.handleClick(event));
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.close(true);
      });

      const variantSelects = this.closest('variant-selects');
      if (variantSelects) {
        this.listen(variantSelects, 'theme:variant-change', (event) => {
          this.updateForVariant(event.detail?.variant);
        });
      }
    }

    disconnectedCallback() {
      this.requestController?.abort();
      this.close(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.hasAttribute('data-open');
    }

    refreshElements() {
      this.trigger = this.querySelector('[data-pickup-open]');
      this.overlay = this.querySelector('[data-pickup-overlay]');
      this.panel = this.querySelector('[data-pickup-panel]');
      this.closeButton = this.querySelector('[data-pickup-close]');
    }

    handleClick(event) {
      const openButton = event.target.closest('[data-pickup-open]');
      if (openButton) {
        this.open(openButton);
        return;
      }

      const closeButton = event.target.closest('[data-pickup-close]');
      if (closeButton) {
        this.close(true);
        return;
      }

      if (event.target === this.overlay) this.close(true);
    }

    setClosedState() {
      if (!this.overlay || !this.panel) return;
      this.overlay.hidden = true;
      this.panel.inert = true;
      this.panel.setAttribute('aria-modal', 'false');
      this.panel.setAttribute('aria-hidden', 'true');
      this.trigger?.setAttribute('aria-expanded', 'false');
      this.removeAttribute('data-open');
    }

    open(trigger) {
      if (!this.overlay || !this.panel || this.isOpen) return;

      const returnTarget = trigger || document.activeElement;
      closeOtherDialogs(this);
      this.returnFocusTarget = returnTarget;
      this.overlay.hidden = false;
      this.panel.inert = false;
      this.panel.setAttribute('aria-modal', 'true');
      this.panel.setAttribute('aria-hidden', 'false');
      this.trigger?.setAttribute('aria-expanded', 'true');
      this.setAttribute('data-open', '');
      // Via syncDialogScrollLocks, which measures the scrollbar before locking.
      syncDialogScrollLocks();
      this.applyBackgroundInert();
      this.releaseFocusTrap = trapFocus(this.panel, this.closeButton || this.panel);
    }

    close(restoreFocus = false) {
      if (!this.overlay || !this.panel) return;

      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      this.setClosedState();
      syncDialogScrollLocks();
      this.restoreBackgroundInert();

      if (restoreFocus && this.returnFocusTarget?.isConnected) {
        this.returnFocusTarget.focus();
      }
    }

    async updateForVariant(variant) {
      this.close(false);
      this.requestController?.abort();

      if (!variant?.id || !this.dataset.productUrl || !this.dataset.sectionId) {
        this.hidden = true;
        return;
      }

      const requestController = new AbortController();
      this.requestController = requestController;
      this.setAttribute('aria-busy', 'true');

      try {
        const url = new URL(this.dataset.productUrl, document.baseURI);
        url.searchParams.set('variant', variant.id);
        url.searchParams.set('section_id', this.dataset.sectionId);
        const response = await fetch(url, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: requestController.signal,
        });
        if (!response.ok) throw new Error(this.dataset.updateError);

        const sectionHtml = await response.text();
        const documentFragment = new DOMParser().parseFromString(sectionHtml, 'text/html');
        const nextPickup = documentFragment.querySelector('pickup-availability');
        if (!nextPickup) throw new Error(this.dataset.updateError);

        this.innerHTML = nextPickup.innerHTML;
        this.dataset.variantId = String(variant.id);
        this.hidden = nextPickup.hidden || !this.querySelector('[data-pickup-content]');
        this.refreshElements();
        this.setClosedState();
      } catch (error) {
        if (error.name === 'AbortError') return;
        this.hidden = true;
      } finally {
        if (this.requestController === requestController) {
          this.requestController = null;
          this.setAttribute('aria-busy', 'false');
        }
      }
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this.overlay;

      while (currentElement?.parentElement) {
        const parentElement = currentElement.parentElement;

        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });

        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }
  }

  class ProductRecommendations extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.requestController = null;
      this.hasLoaded = Boolean(this.querySelector('[data-recommendations-content]'));

      if (this.hasLoaded || !this.dataset.url) {
        this.setAttribute('aria-busy', 'false');
        return;
      }

      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            this.intersectionObserver.disconnect();
            this.load();
          },
          { rootMargin: '0px 0px 200% 0px' },
        );
        this.intersectionObserver.observe(this);
      } else {
        this.load();
      }
    }

    disconnectedCallback() {
      this.intersectionObserver?.disconnect();
      this.requestController?.abort();
      super.disconnectedCallback();
    }

    async load() {
      if (this.hasLoaded) return;
      this.requestController?.abort();
      this.requestController = new AbortController();
      this.setAttribute('aria-busy', 'true');

      try {
        const response = await fetch(this.dataset.url, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: this.requestController.signal,
        });
        if (!response.ok) throw new Error(String(response.status));

        const sectionHtml = await response.text();
        const documentFragment = new DOMParser().parseFromString(sectionHtml, 'text/html');
        const nextRecommendations = documentFragment.querySelector('product-recommendations');
        const nextContent = nextRecommendations?.querySelector('[data-recommendations-content]');

        if (!nextContent) {
          this.hidden = true;
          this.hasLoaded = true;
          return;
        }

        this.innerHTML = nextRecommendations.innerHTML;
        this.hidden = false;
        this.hasLoaded = true;
      } catch (error) {
        if (error.name === 'AbortError') return;
        this.hidden = true;
      } finally {
        this.setAttribute('aria-busy', 'false');
      }
    }
  }

  // Product card with swatches and quick add. A single variant state (the committed color) feeds
  // photo, links, price and size selector. The cursor only previews the photo; a click, tap or the
  // keyboard commits the color. Adding to the cart is not duplicated here: the form carries
  // data-cart-add-form and the CartDrawer intercepts it just as on the product page.
  class ProductCardVariants extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.variantData = undefined;
      this.warmed = false;
      this.swatches = Array.from(this.querySelectorAll('[data-card-swatch]'));
      this.trigger = this.querySelector('[data-quick-buy-trigger]');
      this.dialog = this.querySelector('[data-quick-buy-panel]');
      this.form = this.dialog?.querySelector('[data-cart-add-form]') || null;
      this.idInput = this.querySelector('[data-quick-buy-id]');
      this.directButton = this.querySelector('[data-quick-buy-direct]');
      this.links = Array.from(this.querySelectorAll('[data-card-link]'));
      this.image = this.querySelector('.product-card__image--primary');
      this.defaultImage = this.image
        ? { src: this.image.getAttribute('src'), srcset: this.image.getAttribute('srcset'), alt: this.image.getAttribute('alt') }
        : null;
      this.loadedSources = new Set(this.defaultImage?.src ? [this.defaultImage.src] : []);
      this.imageRequest = 0;
      this.releaseFocusTrap = null;
      this.selectedValue = this.swatches
        .find((swatch) => swatch.getAttribute('aria-checked') === 'true')?.dataset.swatchValue ?? null;
      this.mobileQuery = window.matchMedia('(max-width: 47.99rem)');

      if (this.swatches.length > 0 && this.querySelector('[data-card-variants]')) this.bindSwatches();
      if (this.trigger && this.dialog) this.bindQuickBuy();
    }

    disconnectedCallback() {
      this.resizeObserver?.disconnect();
      if (this.isOpen) this.close(false);
      super.disconnectedCallback();
    }

    // The variants JSON can be large and most cards are never touched, so it is parsed the
    // first time something needs it instead of on page load.
    get data() {
      if (this.variantData === undefined) this.variantData = this.readData();
      return this.variantData;
    }

    readData() {
      const element = this.querySelector('[data-card-variants]');
      if (!element) return null;

      try {
        const data = JSON.parse(element.textContent);
        return Array.isArray(data.variants) ? data : null;
      } catch {
        return null;
      }
    }

    get isOpen() {
      return this.hasAttribute('data-open');
    }

    // ---------- swatches ----------

    bindSwatches() {
      const group = this.querySelector('[data-card-swatches]');

      this.swatches.forEach((swatch) => {
        this.listen(swatch, 'click', () => this.selectSwatch(swatch));
        // The cursor only previews: selecting on hover would change the variant for someone
        // crossing the row on the way to the buy button.
        this.listen(swatch, 'pointerenter', (event) => {
          if (event.pointerType === 'mouse') this.showImageFor(swatch.dataset.swatchValue);
        });
      });

      ['pointerenter', 'focusin', 'touchstart', 'pointerdown'].forEach((type) => {
        this.listen(this, type, () => this.warm(), { passive: true });
      });

      if (!group) return;
      this.listen(group, 'pointerleave', (event) => {
        if (event.pointerType === 'mouse') this.showImageFor(this.selectedValue);
      });
      this.listen(group, 'keydown', (event) => this.handleSwatchKeys(event));

      // How many swatches fit depends on the card width (2 or 4): the single tab stop has to be a
      // visible one.
      this.refreshTabStop();
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => this.refreshTabStop());
        this.resizeObserver.observe(group);
      }
    }

    // First interaction with the card (hover, focus, touch or click): parse the variants and
    // apply the selected color's image, links, price and quick buy state once.
    warm() {
      if (this.warmed || !this.isConnected) return;
      this.warmed = true;
      this.showImageFor(this.selectedValue);
      this.updateLinks(this.variantForSwatch(this.selectedValue));
      this.updatePrice(this.selectedValue);
      this.syncQuickBuy();
    }

    visibleSwatches() {
      return this.swatches.filter((swatch) => swatch.getClientRects().length > 0);
    }

    refreshTabStop() {
      const visible = this.visibleSwatches();
      const checked = visible.find((swatch) => swatch.getAttribute('aria-checked') === 'true');
      const stop = checked || visible[0];
      this.swatches.forEach((swatch) => { swatch.tabIndex = swatch === stop ? 0 : -1; });
    }

    // Radiogroup pattern: arrows move focus and selection, cycling among the visible ones; Tab
    // enters and leaves the group through a single swatch.
    handleSwatchKeys(event) {
      const visible = this.visibleSwatches();
      const current = visible.indexOf(event.target.closest('[data-card-swatch]'));
      if (current === -1) return;

      const rtl = getComputedStyle(this).direction === 'rtl';
      const steps = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };
      let next;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = visible.length - 1;
      else if (event.key in steps) next = (current + steps[event.key] + visible.length) % visible.length;
      else return;

      event.preventDefault();
      visible[next].focus();
      this.selectSwatch(visible[next]);
    }

    selectSwatch(swatch) {
      this.warmed = true;
      this.selectedValue = swatch.dataset.swatchValue;
      this.swatches.forEach((item) => item.setAttribute('aria-checked', String(item === swatch)));
      this.refreshTabStop();

      this.showImageFor(this.selectedValue);
      this.updateLinks(this.variantForSwatch(this.selectedValue));
      this.updatePrice(this.selectedValue);
      this.syncQuickBuy();
    }

    variantsForSwatch(value) {
      if (!this.data || value == null) return [];
      return this.data.variants.filter((variant) => variant.options[this.data.swatchIndex] === value);
    }

    variantForSwatch(value) {
      const variants = this.variantsForSwatch(value);
      return variants.find((variant) => variant.available) || variants[0] || null;
    }

    // The new photo is downloaded before swapping, so there is no flash or broken block; if the
    // shopper goes from A to B to C, only C ever gets painted. With no photo of its own for that
    // color, the card returns to the product photo.
    showImageFor(value) {
      if (!this.image || !this.defaultImage?.src) return;

      const withMedia = this.variantsForSwatch(value).find((variant) => variant.media && this.data.media?.[variant.media]);
      const isOwnMedia = Boolean(withMedia) && String(withMedia.media) !== this.dataset.featuredMediaId;
      const target = isOwnMedia ? this.data.media[withMedia.media] : this.defaultImage;
      const request = ++this.imageRequest;

      const apply = () => {
        if (request !== this.imageRequest || !this.image.isConnected) return;
        if (this.image.getAttribute('src') !== target.src) {
          if (target.srcset) this.image.setAttribute('srcset', target.srcset);
          else this.image.removeAttribute('srcset');
          this.image.setAttribute('src', target.src);
        }
        this.image.setAttribute('alt', target.alt || this.defaultImage.alt || '');
        this.toggleAttribute('data-variant-media', isOwnMedia);
      };

      if (this.loadedSources.has(target.src)) {
        apply();
        return;
      }

      const loader = new Image();
      loader.sizes = this.image.getAttribute('sizes') || '';
      if (target.srcset) loader.srcset = target.srcset;
      loader.src = target.src;
      loader.decode().then(() => {
        this.loadedSources.add(target.src);
        apply();
      }).catch(() => {});
    }

    updateLinks(variant) {
      if (!this.dataset.productUrl) return;
      const url = new URL(this.dataset.productUrl, window.location.origin);
      if (variant) url.searchParams.set('variant', String(variant.id));
      const href = `${url.pathname}${url.search}`;
      this.links.forEach((link) => link.setAttribute('href', href));
    }

    // Price of the committed color, with the same structure as snippets/price.liquid. The amounts
    // arrive already formatted by Liquid with the store's money_format.
    updatePrice(value) {
      const wrapper = this.querySelector('[data-price-wrapper]');
      const values = wrapper?.querySelector('.price__values');
      const variants = this.variantsForSwatch(value);
      if (!values || variants.length === 0) return;

      const cheapest = variants.reduce((low, variant) => (variant.cents < low.cents ? variant : low));
      const varies = variants.some((variant) => variant.cents !== cheapest.cents);
      const shown = varies ? cheapest : this.variantForSwatch(value);
      const onSale = Boolean(shown.compare);
      const hiddenLabel = (text) => {
        const label = document.createElement('span');
        label.className = 'visually-hidden';
        label.textContent = text;
        return label;
      };
      const current = document.createElement('span');
      current.dataset.currentPrice = '';
      current.textContent = shown.price;
      const compare = document.createElement('s');
      compare.className = 'price__compare';
      compare.dataset.comparePrice = '';
      compare.textContent = shown.compare || '';
      compare.hidden = varies || !onSale;

      const parts = [];
      if (varies) {
        const from = document.createElement('span');
        from.textContent = this.dataset.labelFrom;
        parts.push(from, current);
      } else if (onSale) {
        parts.push(hiddenLabel(this.dataset.labelSalePrice), current, hiddenLabel(this.dataset.labelRegularPrice));
      } else {
        parts.push(hiddenLabel(this.dataset.labelRegularPrice), current);
      }
      parts.push(compare);
      values.replaceChildren(...parts);

      const saleBadge = wrapper.querySelector('[data-sale-badge]');
      if (saleBadge) saleBadge.hidden = !onSale;
      const soldOutBadge = wrapper.querySelector('[data-sold-out-badge]');
      if (soldOutBadge) soldOutBadge.hidden = variants.some((variant) => variant.available);

      const unit = wrapper.querySelector('[data-unit-price]');
      if (unit) {
        unit.hidden = !shown.unit;
        const unitValue = unit.querySelector('[data-unit-price-value]');
        const unitReference = unit.querySelector('[data-unit-price-reference]');
        if (unitValue) unitValue.textContent = shown.unit || '';
        if (unitReference) unitReference.textContent = shown.unitReference || '';
      }
    }

    // ---------- quick add ----------

    // The CartDrawer also calls it when an add finishes: if the shopper changed color with the
    // request in flight, the state matches the current color.
    syncQuickBuy() {
      this.dialog?.removeAttribute('aria-busy');
      if (this.dataset.quickBuyMode === 'direct') this.syncDirect();
      else if (this.dataset.quickBuyMode === 'picker') this.syncPicker();
    }

    syncDirect() {
      const variant = this.variantForSwatch(this.selectedValue);
      if (!variant || !this.idInput || !this.directButton) return;
      if (this.directButton.getAttribute('aria-busy') === 'true') return;

      this.idInput.value = String(variant.id);
      this.directButton.disabled = !variant.available;
      const label = this.directButton.querySelector('[data-add-to-cart-text]');
      if (label) {
        label.textContent = variant.available
          ? this.directButton.dataset.labelAdd
          : this.directButton.dataset.labelSoldOut;
      }
    }

    syncPicker() {
      if (!this.dialog || !this.data || this.data.pickerIndex < 0) return;
      const { swatchIndex, pickerIndex, variants } = this.data;
      const offered = variants.filter((variant) => swatchIndex < 0 || variant.options[swatchIndex] === this.selectedValue);
      this.syncTrigger(offered.some((variant) => variant.available));
      // If the sizes of this color cost differently, each size shows its price: the size is the add
      // action, so the price has to be visible before the tap.
      const pricesVary = offered.some((variant) => variant.cents !== offered[0]?.cents);

      this.dialog.querySelectorAll('.quick-buy__value').forEach((button) => {
        const variant = offered.find((candidate) => candidate.options[pickerIndex] === button.dataset.optionValue);
        const available = Boolean(variant?.available);

        button.dataset.variantId = variant ? String(variant.id) : '';
        if (button.getAttribute('aria-busy') !== 'true') button.disabled = !available;
        if (available) button.removeAttribute('aria-disabled');
        else button.setAttribute('aria-disabled', 'true');

        const state = button.querySelector('[data-quick-buy-state]');
        if (state) {
          state.hidden = available;
          state.textContent = variant ? this.dialog.dataset.labelSoldOut : this.dialog.dataset.labelUnavailable;
        }

        const price = button.querySelector('[data-quick-buy-price]');
        if (price) {
          price.hidden = !(pricesVary && variant);
          price.textContent = pricesVary && variant ? variant.price : '';
        }
      });
    }

    // A color with no size available does not open a selector with no way out: the trigger says
    // "Sold out" and is inactive. When another color with stock is committed it goes back to "Quick
    // add". The card and its link to the product page stay accessible, and the price's sold-out
    // label is already set by updatePrice().
    syncTrigger(hasAvailable) {
      if (!this.trigger) return;
      this.trigger.disabled = !hasAvailable;
      const label = hasAvailable ? this.trigger.dataset.labelQuickAdd : this.trigger.dataset.labelSoldOut;
      if (label) this.trigger.textContent = label;
    }

    bindQuickBuy() {
      this.listen(this.trigger, 'click', () => {
        if (this.isOpen) this.close(true);
        else this.open();
      });

      this.listen(this.dialog, 'click', (event) => {
        if (event.target.closest('[data-quick-buy-close]')) {
          this.close(true);
          return;
        }

        // The click arrives before the submit that the CartDrawer intercepts, so the size id is
        // already in the form when it reads it.
        const value = event.target.closest('.quick-buy__value');
        if (value?.dataset.variantId && this.idInput) {
          if (this.form?.dataset.cartAddPending !== 'true') this.idInput.value = value.dataset.variantId;
          return;
        }

        // On mobile the modal <dialog> fills the backdrop: a click outside its box closes it.
        if (event.target === this.dialog && this.dialog.matches(':modal')) {
          const box = this.dialog.getBoundingClientRect();
          const inside = event.clientX >= box.left && event.clientX <= box.right
            && event.clientY >= box.top && event.clientY <= box.bottom;
          if (!inside) this.close(true);
        }
      });

      // With a size in flight, the others become inactive: a second tap cannot silently change the
      // pending variant or fire another add.
      if (this.form) {
        this.listen(this.form, 'submit', (event) => {
          if (this.form.dataset.cartAddPending === 'true') return;
          this.dialog.setAttribute('aria-busy', 'true');
          this.dialog.querySelectorAll('.quick-buy__value').forEach((button) => {
            if (button !== event.submitter) button.disabled = true;
          });
        });
      }

      // Escape in the modal fires cancel; it is closed through the same path to return focus.
      this.listen(this.dialog, 'cancel', (event) => {
        event.preventDefault();
        this.close(true);
      });
      this.listen(this.dialog, 'keydown', (event) => this.handlePanelKeys(event));
      this.listen(document, 'pointerdown', (event) => {
        if (!this.isOpen || this.dialog.matches(':modal')) return;
        if (this.dialog.contains(event.target) || this.trigger.contains(event.target)) return;
        this.close(false);
      });
      this.listen(this.mobileQuery, 'change', () => {
        if (this.isOpen) this.close(false);
      });
    }

    enabledValues() {
      return Array.from(this.dialog.querySelectorAll('.quick-buy__value:not([disabled])'));
    }

    handlePanelKeys(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.close(true);
        return;
      }

      const buttons = this.enabledValues();
      const current = buttons.indexOf(event.target);
      if (current === -1) return;

      const rtl = getComputedStyle(this).direction === 'rtl';
      const steps = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };
      let next;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else if (event.key in steps) next = (current + steps[event.key] + buttons.length) % buttons.length;
      else return;

      event.preventDefault();
      buttons[next].focus();
    }

    open() {
      if (this.isOpen || !this.dialog || this.trigger?.disabled) return;
      closeOtherDialogs(this);
      this.syncPicker();
      this.clearError();

      const modal = this.mobileQuery.matches;
      if (modal) this.dialog.showModal();
      else this.dialog.show();

      this.setAttribute('data-open', '');
      this.toggleAttribute('data-modal', modal);
      this.trigger.setAttribute('aria-expanded', 'true');
      syncDialogScrollLocks();

      // Focus does not leave the panel with Tab, neither in the mobile sheet nor over the card; it
      // is left with Escape, with Close or by choosing a size.
      const first = this.enabledValues()[0] || this.dialog.querySelector('[data-quick-buy-close]');
      first?.focus();
      this.releaseFocusTrap = trapFocus(this.dialog, first);
    }

    close(restoreFocus = false) {
      if (!this.dialog) return;
      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      if (this.dialog.open) this.dialog.close();

      this.removeAttribute('data-open');
      this.removeAttribute('data-modal');
      this.trigger?.setAttribute('aria-expanded', 'false');
      syncDialogScrollLocks();
      if (restoreFocus) this.trigger?.focus();
    }

    clearError() {
      const error = this.dialog?.querySelector('[data-product-form-error]');
      if (!error) return;
      error.hidden = true;
      error.textContent = '';
    }
  }

  // Cart drawer deadlines. The recommendations read is a complement:
  // when it is late, the cards the server already rendered stay. The adds (product form,
  // cross-sell, complete the look) and the note save are never retried: a missed deadline
  // leaves their result uncertain.
  const CART_RECOMMENDATIONS_TIMEOUT = 2000;
  const CART_ADD_TIMEOUT = 10000;
  const CART_NOTE_SAVE_TIMEOUT = 3000;
  // Deadline of the /cart.js read that settles a lost add response.
  const CART_RECONCILE_TIMEOUT = 5000;

  // Quantity per variant id, summed over lines: one variant can sit on several lines
  // (selling plans, line item properties).
  const quantitiesByVariant = (items) => items.reduce((map, item) => {
    const id = String(item?.variant_id ?? '');
    if (id) map.set(id, (map.get(id) || 0) + (Number(item.quantity) || 0));
    return map;
  }, new Map());

  // The same convention as CartDrawer.findLineFor: each line's title link carries
  // ?variant=, and the quantity field's defaultValue is what the server rendered (a typed,
  // unsent value does not count). null when the drawer cannot be read.
  const drawerQuantities = (drawer) => {
    if (!drawer?.querySelector?.('[data-cart-drawer-content]')) return null;
    const items = [];
    try {
      for (const row of drawer.querySelectorAll('[data-cart-item-key]')) {
        const href = row.querySelector('.cart-drawer-item__title a[href]')?.getAttribute('href');
        const variantId = href ? new URL(href, window.location.origin).searchParams.get('variant') : null;
        const quantity = Number(row.querySelector('[data-cart-quantity]')?.defaultValue);
        if (!variantId || !Number.isInteger(quantity)) return null;
        items.push({ variant_id: variantId, quantity });
      }
    } catch {
      return null;
    }
    return quantitiesByVariant(items);
  };

  // GET {cart_url}.js. Never throws: null means the cart could not be read.
  const readCartQuantities = async (cartUrl) => {
    const controller = new AbortController();
    const deadline = window.setTimeout(() => controller.abort(), CART_RECONCILE_TIMEOUT);
    try {
      const url = new URL(`${String(cartUrl || '/cart').replace(/\/$/, '')}.js`, window.location.origin);
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!response.ok) return null;
      const cart = await response.json();
      if (!cart || !Array.isArray(cart.items)) return null;
      return { items: cart.items, quantities: quantitiesByVariant(cart.items) };
    } catch {
      return null;
    } finally {
      window.clearTimeout(deadline);
    }
  };

  // Settles an add whose response was lost by comparing the cart before and after.
  // - applied: every requested variant grew by at least the requested quantity.
  // - not_applied: none moved, and the POST could not still land later. Without any
  //   response (network error, our own deadline) or with a 5xx page from Shopify or a
  //   gateway, the request may still be applied after the read.
  // - unknown: anything else, including a cart that could not be read. Never a retry prompt.
  const classifyAdd = (requested, before, after, mayStillLand) => {
    if (!before || !after || requested.size === 0) return 'unknown';
    let applied = 0;
    let untouched = 0;
    requested.forEach((quantity, id) => {
      if (!id) return;
      const delta = (after.get(id) || 0) - (before.get(id) || 0);
      if (delta >= quantity) applied += 1;
      else if (delta === 0) untouched += 1;
    });
    if (applied === requested.size) return 'applied';
    if (untouched === requested.size && !mayStillLand) return 'not_applied';
    return 'unknown';
  };

  class CartDrawer extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.overlay = this.querySelector('[data-cart-drawer-overlay]');
      this.panel = this.querySelector('[data-cart-drawer-panel]');
      this.managedInertElements = [];
      this.releaseFocusTrap = null;
      this.returnFocusTarget = null;
      this.requestController = null;
      this.crossSellController = null;
      this.pendingMutations = 0;
      // Depth of setDrawerBusy and the control that had focus when entering busy: disabling it
      // blurs it, and the re-render or the release needs it to give focus back.
      this.drawerBusyDepth = 0;
      this.busyFocus = null;
      // Focus target of a removal in progress (removed key and its neighbors).
      this.pendingRemoval = null;
      this.syncRevision = 0;
      this.renderedRevision = 0;
      this.syncAfterMutation = false;
      this.overlappingMutations = false;
      this.reconcileAfterMutation = false;
      // While the shopper works an inline option panel, late syncs and
      // recommendation responses must not touch the DOM; a skipped sync runs on release.
      this.interactionFrozen = false;
      this.skippedSync = false;
      this.recommendationGeneration = 0;
      this.recommendationKey = null;
      this.recommendationCache = new Map();
      this.recommendationWatch = null;
      this.crossSellVariantCache = new WeakMap();
      this.crossSellOriginals = new WeakMap();
      this.noteVersion = 0;
      this.noteSavePending = false;
      // The drawer HTML may no longer mirror the server (another tab, an unsettled add).
      this.cartSnapshotStale = false;

      if (!this.overlay || !this.panel) return;

      this.setClosedState();
      this.listen(document, 'click', (event) => this.handleDocumentClick(event));
      this.listen(document, 'submit', (event) => this.handleAddSubmit(event));
      this.listen(this, 'click', (event) => this.handleDrawerClick(event));
      this.listen(this, 'change', (event) => this.handleDrawerChange(event));
      this.listen(this, 'keydown', (event) => {
        if (event.key !== 'Enter') return;
        // Enter on an option radio would implicitly submit the empty options form and
        // reload the page. Space still selects natively; no key adds to the cart here.
        if (event.target.matches?.('[data-cross-sell-option]')) {
          event.preventDefault();
          return;
        }
        if (!event.target.matches?.('[data-cart-quantity]')) return;
        event.preventDefault();
        event.target.blur();
      });
      this.listen(this, 'submit', (event) => {
        if (event.target.id === `CartCrossSellOptions-${this.dataset.sectionId}`) event.preventDefault();
      });
      this.listen(this, 'focusin', (event) => this.freezeFromOptions(event));
      this.listen(this, 'pointerdown', (event) => this.freezeFromOptions(event));
      this.listen(this, 'input', (event) => {
        if (!event.target.matches('textarea[name="note"]')) return;
        event.target.dataset.dirty = 'true';
        this.noteVersion += 1;
      });
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target === this.overlay) dismissFromOverlay(event, () => this.close(true));
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.close(true);
      });
      // Theme editor only (these events are never dispatched on the storefront): show the
      // drawer while its section or one of its blocks is selected, close it on deselect.
      this.listen(document, 'shopify:section:select', (event) => {
        if (event.detail?.sectionId === this.dataset.sectionId) this.open();
      });
      this.listen(document, 'shopify:section:deselect', (event) => {
        if (event.detail?.sectionId === this.dataset.sectionId) this.close(false);
      });
      // The editor re-renders the section after a setting change; reopen the fresh element.
      this.listen(document, 'shopify:section:load', (event) => {
        if (event.detail?.sectionId === this.dataset.sectionId) this.open();
      });
      this.listen(this, 'shopify:block:select', () => this.open());
      // While the page is hidden another tab can change the cart.
      this.listen(document, 'visibilitychange', () => {
        if (document.visibilityState === 'hidden') this.cartSnapshotStale = true;
      });
    }

    disconnectedCallback() {
      this.requestController?.abort();
      this.crossSellController?.abort();
      this.recommendationWatch?.controller.abort();
      window.clearTimeout(this.rewardsTimer);
      this.close(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.hasAttribute('data-open');
    }

    setClosedState() {
      this.overlay.hidden = true;
      this.panel.inert = true;
      this.panel.setAttribute('aria-hidden', 'true');
      this.removeAttribute('data-open');
      this.pendingRemoval = null;
    }

    handleDocumentClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = event.target.closest('a[href]');
      if (!link || this.contains(link) || link.target === '_blank' || link.hasAttribute('download')) return;

      const linkUrl = new URL(link.href, window.location.origin);
      const cartUrl = new URL(this.dataset.cartUrl, window.location.origin);
      if (linkUrl.origin !== cartUrl.origin || linkUrl.pathname !== cartUrl.pathname) return;

      event.preventDefault();
      this.open(link);
    }

    handleAddSubmit(event) {
      const form = event.target.closest('[data-cart-add-form]');
      if (!form) return;
      if (event.submitter && event.submitter.name !== 'add') return;

      event.preventDefault();
      this.addItem(form, event.submitter).catch((error) => {
        this.showError(error.message, form);
      });
    }

    handleDrawerClick(event) {
      const closeButton = event.target.closest('[data-cart-drawer-close]');
      if (closeButton) {
        this.close(true);
        return;
      }

      if (event.target.closest('[data-cart-check]')) {
        this.checkCart();
        return;
      }

      const expandButton = event.target.closest('[data-cross-sell-expand]');
      if (expandButton) {
        this.expandCrossSell(expandButton);
        return;
      }

      const cancelButton = event.target.closest('[data-cross-sell-cancel]');
      if (cancelButton) {
        this.cancelCrossSell(cancelButton);
        return;
      }

      // The card's own title and image links also leave the drawer: same note save.
      const viewLink = event.target.closest(
        '[data-cross-sell-view], [data-cross-sell-item] .cart-cross-sell__title a, [data-cross-sell-item] a.cart-cross-sell__media',
      );
      if (viewLink) {
        this.handleCrossSellView(event, viewLink);
        return;
      }

      // View cart leaves the drawer too: same guarded note save as the card links.
      // Checkout is not routed here; the cart form posts the note natively.
      const viewCartLink = event.target.closest('[data-cart-view-cart]');
      if (viewCartLink) {
        this.handleCrossSellView(event, viewCartLink);
        return;
      }

      const crossSellButton = event.target.closest('[data-cross-sell-add]');
      if (crossSellButton) {
        this.addCrossSell(crossSellButton).catch((error) => {
          if (error.name === 'AbortError') return;
          this.showError(error.message);
          if (crossSellButton.isConnected && !crossSellButton.disabled) crossSellButton.focus();
        });
        return;
      }

      const removeButton = event.target.closest('[data-cart-remove]');
      if (!removeButton) return;
      const removeKey = removeButton.closest('[data-cart-item-key]')?.dataset.cartItemKey;
      if (!removeKey) return;

      this.changeLine(removeKey, 0).catch((error) => {
        if (error.name === 'AbortError') return;
        this.showError(error.message);
      });
    }

    handleDrawerChange(event) {
      // Option radios are not quantities: a change only recomputes its own card.
      const option = event.target.closest('[data-cross-sell-option]');
      if (option) {
        this.interactionFrozen = true;
        this.updateCrossSellState(option.closest('[data-cross-sell-item]'));
        return;
      }

      const quantityInput = event.target.closest('[data-cart-quantity]');
      // A field held by an in-flight mutation cannot fire another.
      if (!quantityInput || quantityInput.disabled) return;

      // It is snapped to the grid before anything is decided, so what is seen is what is sent. If
      // the snap leaves the quantity the line already has (defaultValue is what the server
      // painted), there is nothing to send and the field already shows the real quantity.
      snapQuantityField(quantityInput);
      if (quantityInput.value !== '0' && Number(quantityInput.value) === Number(quantityInput.defaultValue)) return;

      // An empty or malformed field used to fall through parseInt('') || 0 and silently
      // delete the line. Let the browser report it instead, and keep 0 as the one value
      // that is allowed to bypass min and remove the item on purpose.
      if (!quantityInput.checkValidity() && quantityInput.value !== '0') {
        quantityInput.reportValidity();
        return;
      }

      // The line is identified by its key, not its position: an index changes as soon as another
      // line disappears and the POST would modify a different product.
      const lineKey = quantityInput.closest('[data-cart-item-key]')?.dataset.cartItemKey;
      if (!lineKey) return;
      const quantity = Number(quantityInput.value);
      // Enter blurs the field before this change event fires, so focus sits on body: keep
      // the field as the restore target so the re-render does not drop focus to "Close".
      if (document.activeElement === document.body) this.busyFocus = quantityInput;
      this.changeLine(lineKey, quantity).catch((error) => {
        // beginMutation() aborts an in-flight section read, so a superseded request must
        // stay silent instead of showing the browser's own English abort text.
        if (error.name === 'AbortError') return;
        this.showError(error.message);
      });
    }

    open(trigger = null, initialFocus = null) {
      if (this.isOpen || !this.isConnected) return;

      // Resolved before the other dialogs close: making a panel inert blurs whatever
      // inside it holds focus, and a cart opened from the mobile menu must hand focus
      // back to the menu trigger rather than to a link that is about to disappear.
      let returnTarget = trigger || document.activeElement;
      const sourceMenu = returnTarget?.closest?.('theme-drawer[data-open]');
      const menuTrigger = sourceMenu?.querySelector('[data-drawer-trigger]');
      if (menuTrigger) returnTarget = menuTrigger;
      // Same with a card's quick add: its panel closes when the drawer opens, so focus returns to
      // the button that opened it and not to a hidden size.
      const quickBuy = returnTarget?.closest?.('product-card-variants');
      if (quickBuy?.dialog?.contains(returnTarget) && quickBuy.trigger) returnTarget = quickBuy.trigger;

      closeOtherDialogs(this);

      this.returnFocusTarget = returnTarget;
      this.overlay.hidden = false;
      this.panel.inert = false;
      this.panel.setAttribute('aria-hidden', 'false');
      this.setAttribute('data-open', '');
      // Via syncDialogScrollLocks, which measures the scrollbar before locking.
      syncDialogScrollLocks();
      this.applyBackgroundInert();
      this.releaseFocusTrap = trapFocus(
        this.panel,
        initialFocus?.isConnected ? initialFocus : this.querySelector('[data-cart-drawer-close]'),
      );
      this.syncCart().catch(() => {});
    }

    close(restoreFocus = false) {
      if (!this.overlay || !this.panel) return;

      this.pendingRemoval = null;
      this.clearMessages();
      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      this.setClosedState();
      syncDialogScrollLocks();
      this.restoreBackgroundInert();
      // Closing ends any option interaction; the next open re-renders fresh HTML.
      this.collapseCrossSells();
      this.releaseInteraction();

      if (restoreFocus && this.returnFocusTarget?.isConnected) {
        // Opened from the mobile menu: the menu decides the target (its trigger, or the desktop
        // navigation if it is no longer painted) and tracks focus across width changes.
        const menu = this.returnFocusTarget.matches('[data-drawer-trigger]')
          && this.returnFocusTarget.closest('theme-drawer');
        if (typeof menu?.returnFocus === 'function') menu.returnFocus();
        else this.returnFocusTarget.focus();
      }
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this;

      while (currentElement.parentElement) {
        const parentElement = currentElement.parentElement;

        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });

        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }

    // Cart quantities before an add. The drawer HTML is used when it is the last
    // thing the server rendered and nothing can have moved since; otherwise /cart.js is
    // read. The freshness test runs synchronously, so callers invoke this before
    // beginMutation() and await the promise just before their POST.
    async cartBaseline() {
      const fresh = !this.cartSnapshotStale && !this.pendingMutations
        && this.renderedRevision === this.syncRevision;
      const fromDrawer = fresh ? drawerQuantities(this) : null;
      if (fromDrawer) return fromDrawer;
      return (await readCartQuantities(this.dataset.cartUrl))?.quantities || null;
    }

    async addItem(form, submitter) {
      // Blocks a second submit while the first is in flight, which otherwise buys the
      // item twice. Switching variant mid-request used to re-enable the button through
      // updateForms; that path now reads this flag and leaves it disabled.
      if (form.dataset.cartAddPending === 'true') return;
      form.dataset.cartAddPending = 'true';
      const baseline = this.cartBaseline();
      const revision = this.beginMutation();
      this.clearMessages(form);
      this.setFormBusy(form, submitter, true);
      // Without a deadline a hung request kept the button disabled for good.
      const controller = new AbortController();
      let timedOut = false;
      const deadline = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, CART_ADD_TIMEOUT);

      try {
        const formData = new FormData(form);
        formData.set('sections', this.renderSectionIds().join(','));
        formData.set('sections_url', `${window.location.pathname}${window.location.search}`);
        const requestedId = String(formData.get('id') || '');
        const requested = new Map([[requestedId, Math.max(1, Number(formData.get('quantity')) || 1)]]);
        const before = await baseline;

        // A lost response (network error, deadline, or a body that is
        // not JSON, such as an HTML 429/5xx page) does not prove the add failed: Shopify may
        // have applied it. The cart is read before the shopper is told anything, so "try again"
        // only appears when the server answered, nothing was added and the request cannot
        // land later. A JSON answer, error or not, keeps the path below.
        let response = null;
        let result = null;
        try {
          response = await fetch(this.dataset.cartAddUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: formData,
            signal: controller.signal,
          });
          result = await response.json();
        } catch {
          result = null;
        }
        window.clearTimeout(deadline);

        let reconciledItems = null;
        if (!response || result === null || typeof result !== 'object') {
          const after = await readCartQuantities(this.dataset.cartUrl);
          const mayStillLand = timedOut || !response || response.status >= 500;
          const outcome = classifyAdd(requested, before, after?.quantities, mayStillLand);
          if (outcome === 'not_applied') throw new Error(this.dataset.errorMessage);
          if (outcome === 'unknown') {
            this.showUnconfirmedAdd(submitter);
            return;
          }
          reconciledItems = after.items;
          // The cart already confirms the add. A render that fails only leaves the drawer
          // stale, and endMutation() then fetches fresh HTML.
          await this.renderCartResponse({}, revision).catch(() => {});
        } else {
          if (!response.ok) throw new Error(result?.description || result?.message || this.dataset.errorMessage);

          await this.renderCartResponse(result, revision);

          // A 200 does not prove the line exists: with a variant that requires a selling plan
          // Shopify returns {} and the drawer announced a false success. Success is only announced
          // if the response carries the requested variant and, when this response was the one
          // painted, if the fresh cart has its line. If another mutation got ahead of it, the
          // response is enough.
          const renderedLine = this.findLineFor({ variant_id: requestedId });
          const renderedHere = this.renderedRevision === revision;
          if (!this.responseHasVariant(result, requestedId) || (renderedHere && !renderedLine)) {
            throw new Error(this.dataset.addFailedMessage || this.dataset.errorMessage);
          }
        }

        const addedItems = reconciledItems || (Array.isArray(result.items) ? result.items : [result]);
        const addedItem = addedItems.find((item) => String(item?.variant_id ?? item?.id ?? '') === requestedId);
        const productTitle = addedItem?.product_title || addedItem?.title || '';
        const variantTitle = addedItem?.variant_title === 'Default Title'
          ? ''
          : (addedItem?.variant_title || '');
        const itemDescription = [productTitle, variantTitle].filter(Boolean).join(' - ');
        this.showStatus(itemDescription
          ? `${this.dataset.addedMessage} ${itemDescription}`
          : this.dataset.addedMessage);
        // From a card, focus lands on the line that was just added.
        const addedLine = this.findLineFor({ variant_id: requestedId });
        this.open(submitter, form.hasAttribute('data-quick-buy-form') ? addedLine : null);
      } finally {
        window.clearTimeout(deadline);
        delete form.dataset.cartAddPending;
        this.setFormBusy(form, submitter, false);
        // Re-applies the availability state of whatever variant is selected now, which
        // may not be the one this request was submitted for.
        const variants = form.closest('variant-selects');
        if (variants?.isConnected) variants.updateForms(variants.currentVariant);
        const card = form.closest('product-card-variants');
        if (card?.isConnected) card.syncQuickBuy();
        this.endMutation();
      }
    }

    // An add whose outcome the cart could not settle: nothing invites a retry. The
    // drawer opens on the same notice and Check cart as an uncertain cross-sell add, and
    // endMutation() re-reads the cart even while an option panel is in use.
    showUnconfirmedAdd(trigger = null) {
      this.reconcileAfterMutation = true;
      this.cartSnapshotStale = true;
      this.showError(this.dataset.updateUnconfirmedMessage || this.dataset.errorMessage);
      const uncertain = this.querySelector('[data-cart-uncertain]');
      if (uncertain) uncertain.hidden = false;
      const checkButton = uncertain?.querySelector('[data-cart-check]') || null;
      if (!this.isOpen) this.open(trigger, checkButton);
      else checkButton?.focus();
    }

    // /cart/add.js returns the added line ({ variant_id }) or, with items[], { items: [...] }.
    responseHasVariant(result, variantId) {
      if (!variantId) return false;
      const items = Array.isArray(result?.items) ? result.items : [result];
      return items.some((item) => String(item?.variant_id ?? '') === variantId);
    }

    // /cart/add.js returns the added line; its link carries ?variant=, the same as item.url.
    findLineFor(result) {
      const variantId = String(result?.variant_id ?? result?.items?.[0]?.variant_id ?? '');
      if (!variantId) return null;
      return Array.from(this.querySelectorAll('.cart-drawer-item__title a[href]')).find((link) => {
        const url = new URL(link.getAttribute('href'), window.location.origin);
        return url.searchParams.get('variant') === variantId;
      }) || null;
    }

    // The add is never retried and its outcome is classified:
    // - confirmed failure: an HTTP error with a JSON body (422 and the like). The cart did
    //   not change, so the selection stays and focus lands on a usable control.
    // - uncertain: network error, deadline, abort, a body that is not JSON (an HTML 429 or
    //   5xx page) or a 200 that does not list the variant. The POST may have been applied:
    //   the shopper is told, Check cart is offered and endMutation() reconciles with fresh
    //   HTML even while a panel holds interactionFrozen.
    // - success: the option interaction ends and the response is rendered.
    async addCrossSell(button) {
      const variantId = Number(button.dataset.variantId);
      if (!variantId || button.disabled) return;

      const item = button.closest('[data-cross-sell-item]');
      const inPanel = Boolean(button.closest('[data-cross-sell-options]'));
      const revision = this.beginMutation();
      this.clearMessages();
      this.setCrossSellBusy(button, true);
      this.setDrawerBusy(true);
      // The button has an aria-label and turns disabled, so its hidden "Adding" text is
      // never read. The status region announces it; the outcome message replaces it.
      const addingText = button.querySelector('[data-cross-sell-adding]')?.textContent.trim();
      if (addingText) this.showStatus(addingText);
      // Its own controller: crossSellController belongs to the recommendations read and
      // beginMutation() aborts it, which must never cut an add short.
      const controller = new AbortController();
      const deadline = window.setTimeout(() => controller.abort(), CART_ADD_TIMEOUT);
      let outcome = 'uncertain';
      let failureMessage = '';

      try {
        let response = null;
        let result = null;
        try {
          response = await fetch(this.dataset.cartAddUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
              items: [{ id: variantId, quantity: 1 }],
              sections: this.renderSectionIds(),
              sections_url: `${window.location.pathname}${window.location.search}`,
            }),
            signal: controller.signal,
          });
          result = await response.json();
        } catch {
          result = null;
        }
        window.clearTimeout(deadline);

        if (response && result !== null && typeof result === 'object') {
          if (!response.ok) {
            outcome = 'failure';
            failureMessage = result.description || result.message || this.dataset.errorMessage;
          } else if (this.responseHasVariant(result, String(variantId))) {
            outcome = 'success';
          }
        }

        if (outcome === 'success') {
          this.interactionFrozen = false;
          this.skippedSync = false;
          // The JSON already confirms the add. A render that fails or is overtaken only
          // leaves the drawer stale, and endMutation() then fetches fresh HTML.
          await this.renderCartResponse(result, revision).catch(() => {});
          this.showStatus(this.dataset.addedMessage);

          const focusTarget = Array.from(this.querySelectorAll('[data-cross-sell-focus]')).find(
            (element) => Number(element.dataset.crossSellFocus) === variantId,
          );
          // The already-added recommendation stops being shown; focus moves to its cart line.
          (focusTarget || this.findLineFor({ variant_id: variantId }))?.focus({ preventScroll: true });
        }
      } finally {
        window.clearTimeout(deadline);
        this.setDrawerBusy(false);
        this.setCrossSellBusy(button, false);
        // The busy restore re-enabled the panel button blindly; the selection decides.
        if (inPanel && button.isConnected) this.updateCrossSellState(item);
        if (outcome === 'uncertain') this.reconcileAfterMutation = true;
        this.endMutation();
      }

      if (outcome !== 'success') {
        // The "Adding" announcement is over; the error region takes its place.
        const status = this.querySelector('[data-cart-status]');
        if (status) {
          status.hidden = true;
          status.textContent = '';
        }
      }
      if (outcome === 'failure') {
        this.showError(failureMessage);
        this.focusCrossSellControl(item, button);
      } else if (outcome === 'uncertain') {
        this.showError(this.dataset.updateUnconfirmedMessage || this.dataset.errorMessage);
        const uncertain = this.querySelector('[data-cart-uncertain]');
        if (uncertain) uncertain.hidden = false;
        const checkButton = uncertain?.querySelector('[data-cart-check]');
        if (checkButton && this.isOpen) checkButton.focus();
      }
    }

    // After a confirmed failure the selection stays: focus goes to the chosen option, the
    // add button or Cancel, whichever is usable, never to a disabled control.
    focusCrossSellControl(item, button) {
      if (!this.isOpen) return;
      const panel = button.closest('[data-cross-sell-options]');
      const candidates = panel
        ? [panel.querySelector('[data-cross-sell-option]:checked'), button, panel.querySelector('[data-cross-sell-cancel]')]
        : [button, item?.querySelector('.cart-cross-sell__title a')];
      const target = candidates.find((element) => element?.isConnected && !element.disabled && !element.closest('[hidden]'));
      (target || this.querySelector('[data-cart-drawer-close]'))?.focus();
    }

    freezeFromOptions(event) {
      if (event.target.closest?.('[data-cross-sell-options]')) this.interactionFrozen = true;
    }

    // Ends an option interaction. A sync skipped while frozen runs now, unless a mutation
    // is pending (its render or endMutation() brings fresh HTML) or the drawer is closed
    // (open() always syncs).
    releaseInteraction() {
      this.interactionFrozen = false;
      if (!this.skippedSync) {
        this.loadRecommendations();
        return;
      }
      this.skippedSync = false;
      if (this.isConnected && this.isOpen && !this.pendingMutations) this.syncCart().catch(() => {});
    }

    // Check cart, offered after an unconfirmed update: any option interaction ends and a
    // fresh read replaces the drawer body.
    checkCart() {
      // The button is about to hide; focus moves first so it does not fall to <body>.
      this.querySelector('[data-cart-drawer-close]')?.focus();
      this.clearMessages();
      this.collapseCrossSells();
      this.interactionFrozen = false;
      this.skippedSync = false;
      this.syncCart().catch((error) => {
        if (error.name === 'AbortError') return;
        this.showError(this.dataset.updateUnconfirmedMessage || this.dataset.errorMessage);
        const uncertain = this.querySelector('[data-cart-uncertain]');
        if (uncertain) uncertain.hidden = false;
      });
    }

    // One expanded card at a time. Another card collapses but keeps its selection; focus
    // stays on Choose options and the next Tab enters the panel.
    expandCrossSell(button) {
      const item = button.closest('[data-cross-sell-item]');
      const panel = item?.querySelector('[data-cross-sell-options]');
      if (!panel) return;
      // A second press closes the panel like a disclosure. Unlike Cancel it keeps the
      // selection; the interaction still ends, since no panel is left open.
      if (button.getAttribute('aria-expanded') === 'true') {
        panel.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        this.releaseInteraction();
        return;
      }
      this.collapseCrossSells(item);
      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      this.interactionFrozen = true;
      this.updateCrossSellState(item);
    }

    cancelCrossSell(control) {
      const item = control.closest('[data-cross-sell-item]');
      if (!item) return;
      const expandButton = item.querySelector('[data-cross-sell-expand]');
      // Focus leaves the panel before it hides, and before the release: a skipped sync may
      // re-render at once, and renderSection() maps this button to the same card.
      expandButton?.focus();
      const panel = item.querySelector('[data-cross-sell-options]');
      if (panel) panel.hidden = true;
      expandButton?.setAttribute('aria-expanded', 'false');
      this.resetCrossSell(item);
      this.releaseInteraction();
    }

    collapseCrossSells(exceptItem = null) {
      this.querySelectorAll('[data-cross-sell-item]').forEach((item) => {
        if (item === exceptItem) return;
        const panel = item.querySelector('[data-cross-sell-options]');
        if (panel) panel.hidden = true;
        item.querySelector('[data-cross-sell-expand]')?.setAttribute('aria-expanded', 'false');
      });
    }

    resetCrossSell(item) {
      item.querySelectorAll('[data-cross-sell-option]').forEach((radio) => {
        radio.checked = false;
      });
      this.updateCrossSellState(item);
    }

    crossSellVariants(panel) {
      if (this.crossSellVariantCache.has(panel)) return this.crossSellVariantCache.get(panel);
      let variants = [];
      try {
        const parsed = JSON.parse(panel.querySelector('[data-cross-sell-variants]')?.textContent || '[]');
        if (Array.isArray(parsed)) {
          variants = parsed.filter((variant) => variant && typeof variant === 'object' && Array.isArray(variant.options));
        }
      } catch {
        variants = [];
      }
      this.crossSellVariantCache.set(panel, variants);
      return variants;
    }

    // Quantity 1 must be valid on its own: available, min <= 1, increment 1, max empty or >= 1.
    isCrossSellPurchasable(variant) {
      if (!variant || variant.available !== true || !variant.id) return false;
      const min = variant.min == null ? 1 : Number(variant.min);
      const increment = variant.increment == null ? 1 : Number(variant.increment);
      const max = variant.max == null ? null : Number(variant.max);
      return min <= 1 && increment === 1 && (max === null || max >= 1);
    }

    // Recomputes one card from its variant JSON. A chip with no purchasable match given the
    // other selected options is marked unavailable (attribute plus hidden text). Add is
    // enabled only for a complete, existing, purchasable combination, which also sets the
    // variant price and image; a complete invalid combination shows the status instead.
    updateCrossSellState(item) {
      const panel = item?.querySelector('[data-cross-sell-options]');
      if (!panel) return;

      const variants = this.crossSellVariants(panel);
      const fieldsets = Array.from(panel.querySelectorAll('[data-option-position]'));
      const positions = fieldsets.map((fieldset) => Number(fieldset.dataset.optionPosition) - 1);
      const selected = fieldsets.map((fieldset) => fieldset.querySelector('[data-cross-sell-option]:checked')?.value ?? null);
      const fits = (variant, skip) => positions.every((position, index) => (
        index === skip || selected[index] === null || variant.options[position] === selected[index]
      ));

      fieldsets.forEach((fieldset, index) => {
        fieldset.querySelectorAll('[data-cross-sell-option]').forEach((radio) => {
          const purchasable = variants.some((variant) => this.isCrossSellPurchasable(variant)
            && variant.options[positions[index]] === radio.value
            && fits(variant, index));
          const chip = radio.closest('label');
          chip?.toggleAttribute('data-unavailable', !purchasable);
          const unavailableText = chip?.querySelector('[data-chip-unavailable]');
          if (unavailableText) unavailableText.hidden = purchasable;
        });
      });

      const complete = fieldsets.length > 0 && selected.every((value) => value !== null);
      const variant = complete ? variants.find((candidate) => fits(candidate, -1)) : null;
      const valid = Boolean(variant) && this.isCrossSellPurchasable(variant);
      const addButton = panel.querySelector('[data-cross-sell-add]');
      const status = panel.querySelector('[data-cross-sell-options-status]');

      if (addButton) {
        addButton.dataset.variantId = valid ? String(variant.id) : '';
        // While a busy state holds the button, the value it restores is what changes.
        if (addButton.dataset.wasDisabled !== undefined) addButton.dataset.wasDisabled = String(!valid);
        else addButton.disabled = !valid;
      }
      if (status) {
        const wasHidden = status.hidden;
        status.hidden = !complete || valid;
        // WCAG 4.1.3. The status appears without a focus change, so the drawer's live region
        // announces it once, when the selection turns complete and invalid.
        if (wasHidden && !status.hidden) this.showStatus(status.textContent.trim());
        if (addButton && status.id) {
          if (status.hidden) addButton.removeAttribute('aria-describedby');
          else addButton.setAttribute('aria-describedby', status.id);
        }
      }
      this.showCrossSellVariant(item, valid ? variant : null);
    }

    // Price and thumbnail follow the chosen variant; without one they return to what the
    // server rendered ("From" price, product image).
    showCrossSellVariant(item, variant) {
      const price = item.querySelector('[data-cross-sell-price]');
      const image = item.querySelector('.cart-cross-sell__media img');
      if (!this.crossSellOriginals.has(item)) {
        this.crossSellOriginals.set(item, {
          price: price?.textContent ?? '',
          src: image?.getAttribute('src') ?? null,
          srcset: image?.getAttribute('srcset') ?? null,
        });
      }
      const original = this.crossSellOriginals.get(item);
      const formatted = variant ? formatMoney(variant.price) : '';
      if (price) price.textContent = formatted || original.price;
      if (!image) return;

      if (variant && typeof variant.image === 'string' && variant.image) {
        image.removeAttribute('srcset');
        image.setAttribute('src', variant.image);
        return;
      }
      if (original.src !== null && image.getAttribute('src') !== original.src) image.setAttribute('src', original.src);
      if (original.srcset !== null && image.getAttribute('srcset') !== original.srcset) {
        image.setAttribute('srcset', original.srcset);
      }
    }

    // A re-render replaced the card that held focus. Land on the same control of the same
    // product when it is still offered (a control inside a panel maps to Choose options),
    // else on the card itself; null lets the caller fall back to the close button.
    crossSellFocusAfterRender(active, nextContent) {
      const item = active?.closest?.('[data-cross-sell-item]');
      if (!item) return null;
      const nextItem = Array.from(nextContent.querySelectorAll('[data-cross-sell-item]'))
        .find((candidate) => candidate.dataset.productId === item.dataset.productId);
      if (!nextItem) return null;

      let control = null;
      if (active.closest('[data-cross-sell-options]')) {
        control = nextItem.querySelector('[data-cross-sell-expand]');
      } else {
        const selector = ['[data-cross-sell-expand]', '[data-cross-sell-view]', '[data-cross-sell-add]']
          .find((candidate) => active.matches(candidate));
        control = selector ? nextItem.querySelector(selector) : null;
      }
      return control && !control.disabled && !control.closest('[hidden]') ? control : nextItem;
    }

    // A drawer link that leaves the drawer (View product, the card links, View cart) with an
    // unsaved note: save it first, and leave only once the server has the exact draft.
    // Modified clicks and new-tab links keep their native behaviour.
    handleCrossSellView(event, link) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      const note = this.querySelector('textarea[name="note"][data-dirty="true"]');
      if (!note && !this.noteSavePending) return;

      event.preventDefault();
      if (this.noteSavePending) return;
      this.saveNoteAndNavigate(link.href, note).catch(() => {});
    }

    // Note protocol. The draft counts as saved only when the server echoes the exact
    // text sent and no keystroke arrived meanwhile (noteVersion). Otherwise it stays dirty,
    // the drawer reconciles (renderSection keeps the dirty draft) and the shopper stays.
    // The note text is never stored locally or logged.
    async saveNoteAndNavigate(href, textarea) {
      this.noteSavePending = true;
      const sentVersion = this.noteVersion;
      const sentNote = textarea.value;
      const controller = new AbortController();
      const deadline = window.setTimeout(() => controller.abort(), CART_NOTE_SAVE_TIMEOUT);
      let confirmed = false;
      this.clearMessages();
      this.showStatus(this.dataset.savingNoteMessage);

      try {
        const response = await fetch(this.dataset.cartUpdateUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ note: sentNote }),
          keepalive: true,
          signal: controller.signal,
        });
        const result = await response.json();
        confirmed = response.ok && result !== null && typeof result === 'object' && (result.note ?? '') === sentNote;
      } catch {
        confirmed = false;
      } finally {
        window.clearTimeout(deadline);
        this.noteSavePending = false;
      }

      if (confirmed && this.noteVersion === sentVersion) {
        const current = this.querySelector('textarea[name="note"]');
        if (current && current.value === sentNote) delete current.dataset.dirty;
        window.location.assign(href);
        return;
      }

      this.clearMessages();
      this.showError(this.dataset.noteUnconfirmedMessage || this.dataset.errorMessage);
      if (this.isConnected) this.syncCart().catch(() => {});
    }

    // Source 2 (Search and Discovery). The server marks the slot as pending when native
    // complementary products were not resolved in its render. One GET per cart state
    // and anchor, cached and never retried for the same key; when it fails, the fallback
    // cards the server already rendered stay. Reads wait until no mutation is pending.
    loadRecommendations() {
      if (!this.isConnected || this.pendingMutations || !this.dataset.recommendationsUrl) return;
      const slot = this.querySelector('[data-cart-cross-sell-slot][data-recommendations-pending]');
      const anchor = slot?.dataset.anchorProductId || '';
      if (!/^\d+$/.test(anchor)) return;
      const key = this.recommendationsKey(slot);
      if (this.recommendationCache.has(key)) {
        this.applyRecommendations(key, this.recommendationCache.get(key));
        return;
      }
      if (this.recommendationKey === key) return;
      this.fetchRecommendations(key, anchor).catch(() => {});
    }

    async fetchRecommendations(key, anchor) {
      this.crossSellController?.abort();
      const controller = new AbortController();
      this.crossSellController = controller;
      this.recommendationKey = key;
      const generation = this.recommendationGeneration;
      let timedOut = false;
      const deadline = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, CART_RECOMMENDATIONS_TIMEOUT);
      let html = '';

      try {
        const url = new URL(this.dataset.recommendationsUrl, window.location.origin);
        url.searchParams.set('product_id', anchor);
        url.searchParams.set('intent', 'complementary');
        url.searchParams.set('section_id', this.dataset.sectionId);
        const response = await fetch(url, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: controller.signal,
        });
        if (response.ok) {
          const nextSlot = new DOMParser()
            .parseFromString(await response.text(), 'text/html')
            .querySelector('[data-cart-cross-sell-slot]');
          // A slot still pending, or built for another anchor, adds nothing to what is shown.
          if (nextSlot && !nextSlot.hasAttribute('data-recommendations-pending')
            && nextSlot.dataset.anchorProductId === anchor) {
            html = nextSlot.outerHTML;
          }
        }
      } catch (error) {
        // An abort that is not the deadline comes from beginMutation() or a disconnect:
        // that key is dead and nothing is cached for it.
        if (error.name === 'AbortError' && !timedOut) return;
      } finally {
        window.clearTimeout(deadline);
        if (this.crossSellController === controller) this.crossSellController = null;
        if (this.recommendationKey === key) this.recommendationKey = null;
      }

      if (generation !== this.recommendationGeneration) return;
      // Bounded: one entry per revision and anchor is enough to reopen without a new GET.
      if (this.recommendationCache.size >= 8) {
        this.recommendationCache.delete(this.recommendationCache.keys().next().value);
      }
      this.recommendationCache.set(key, html);
      this.applyRecommendations(key, html);
    }

    // Applies only when idle: same revision and anchor, no option interaction, no pending
    // mutation and focus outside the slot. Only the slot is replaced, never the drawer body
    // or footer.
    applyRecommendations(key, html) {
      if (!html || !this.isConnected || this.interactionFrozen || this.pendingMutations) return;
      const slot = this.querySelector('[data-cart-cross-sell-slot][data-recommendations-pending]');
      if (!slot || this.recommendationsKey(slot) !== key) return;
      if (slot.contains(document.activeElement)) {
        this.watchRecommendationsFocus(slot);
        return;
      }
      this.recommendationWatch?.controller.abort();
      this.recommendationWatch = null;
      const nextSlot = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-cart-cross-sell-slot]');
      if (nextSlot) slot.replaceWith(nextSlot);
    }

    // Revision in this tab plus the cart lines as rendered (key and server quantity), so a
    // change made in another tab also invalidates the cache, plus the anchor.
    recommendationsKey(slot) {
      const lines = Array.from(this.querySelectorAll('[data-cart-item-key]')).map((line) => (
        `${line.dataset.cartItemKey}x${line.querySelector('[data-cart-quantity]')?.defaultValue ?? ''}`
      ));
      return `${this.syncRevision}|${lines.join(',')}|${slot.dataset.anchorProductId || ''}`;
    }

    // Focus inside the slot blocks the swap. When focus leaves the slot, the cached result
    // gets another chance on the next tick; loadRecommendations() re-checks key, freeze and
    // pending mutations. One listener per slot, removed when it fires or on disconnect.
    watchRecommendationsFocus(slot) {
      if (this.recommendationWatch?.slot === slot) return;
      this.recommendationWatch?.controller.abort();
      const controller = new AbortController();
      const watch = { slot, controller };
      this.recommendationWatch = watch;
      slot.addEventListener('focusout', (event) => {
        if (event.relatedTarget instanceof Node && slot.contains(event.relatedTarget)) return;
        controller.abort();
        if (this.recommendationWatch === watch) this.recommendationWatch = null;
        window.setTimeout(() => {
          if (this.isConnected) this.loadRecommendations();
        }, 0);
      }, { signal: controller.signal });
    }

    // /cart/change.js receives the line key (id: item.key), stable even if the order changes. With
    // quantity 0 the removal is announced in the live region and focus moves to the next line, the
    // previous one, the empty cart notice or the title.
    async changeLine(key, quantity) {
      const lineRows = Array.from(this.querySelectorAll('[data-cart-item-key]'));
      const lineIndex = lineRows.findIndex((row) => row.dataset.cartItemKey === key);
      const removedRow = lineIndex === -1 ? null : lineRows[lineIndex];
      const revision = this.beginMutation();
      const removal = quantity === 0 && removedRow
        ? {
          key,
          title: removedRow.dataset.cartItemTitle || '',
          nextKey: lineRows[lineIndex + 1]?.dataset.cartItemKey || null,
          previousKey: lineRows[lineIndex - 1]?.dataset.cartItemKey || null,
        }
        : null;
      if (removal) this.pendingRemoval = removal;
      let applied = false;
      this.clearMessages();
      this.setDrawerBusy(true);

      try {
        const response = await fetchCommerce(this.dataset.cartChangeUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            id: key,
            quantity,
            sections: this.renderSectionIds(),
            sections_url: `${window.location.pathname}${window.location.search}`,
          }),
        }, this.dataset.errorMessage);
        // Shopify and upstream proxies answer 429/5xx with an HTML error page. Parsing it
        // as JSON throws "Unexpected token '<'" straight at the shopper, so the parse
        // failure is turned into the localized message instead. A deliberate abort keeps
        // its own name, because callers use it to stay silent.
        const result = await response.json().catch((error) => {
          if (error.name === 'AbortError') throw error;
          throw new Error(this.dataset.errorMessage);
        });

        if (!response.ok) throw new Error(result?.description || result?.message || this.dataset.errorMessage);

        applied = true;
        await this.renderCartResponse(result, revision);
        if (removal && this.isOpen) this.announceRemoval(removal, this.renderedRevision === revision);
      } finally {
        // If the removal failed or the drawer closed, nobody will consume its focus target. If it
        // was applied but its response was overtaken, the target waits for the render that reflects
        // it.
        if ((!applied || !this.isOpen) && this.pendingRemoval === removal) this.pendingRemoval = null;
        this.setDrawerBusy(false);
        this.endMutation();
      }
    }

    // The same control (field, plus, minus or remove) of the same line, by its key.
    lineControlAfterRender(control, nextContent) {
      const key = control?.closest?.('[data-cart-item-key]')?.dataset.cartItemKey;
      if (!key) return null;
      const row = Array.from(nextContent.querySelectorAll('[data-cart-item-key]'))
        .find((candidate) => candidate.dataset.cartItemKey === key);
      if (!row) return null;
      const selector = ['[data-cart-quantity]', '[data-cart-remove]'].find((candidate) => control.matches(candidate))
        || (control.dataset.quantityButton ? `[data-quantity-button="${control.dataset.quantityButton}"]` : null);
      return selector ? row.querySelector(selector) : null;
    }

    // The persistent [data-cart-status] region announces the removed line and the new count. The
    // text comes from a locale key with [title] as a placeholder.
    announceRemoval(removal, rendered) {
      if (!this.isOpen) return;
      const template = this.dataset.removedTemplate || '';
      if (!template) return;
      // The count is only reliable if this response was the one painted.
      const count = rendered
        ? this.querySelector('[data-cart-drawer-count]')?.textContent.trim() || ''
        : '';
      const message = template.replace('[title]', removal.title).trim();
      this.showStatus([message, count].filter(Boolean).join(' '));
    }

    // Focus target after removing a line, looked up in the freshly painted content: the next line,
    // otherwise the previous one, otherwise the empty cart notice and, as a last resort, the drawer
    // title (both with tabindex="-1"). Never the Close button. It only acts when the new HTML no
    // longer contains the removed line, and it is consumed on use.
    removalFocusTarget(nextContent) {
      const removal = this.pendingRemoval;
      if (!removal) return null;
      const rows = Array.from(nextContent.querySelectorAll('[data-cart-item-key]'));
      if (rows.some((row) => row.dataset.cartItemKey === removal.key)) return null;
      this.pendingRemoval = null;
      if (!this.isOpen) return null;
      const usable = (element) => element && !element.disabled && !element.closest('[hidden]');
      for (const key of [removal.nextKey, removal.previousKey]) {
        const row = key ? rows.find((candidate) => candidate.dataset.cartItemKey === key) : null;
        if (!row) continue;
        const control = [row.querySelector('.cart-drawer-item__title a[href]'), row.querySelector('[data-cart-remove]')]
          .find(usable);
        if (control) return control;
      }
      return nextContent.querySelector('[data-cart-empty-message]') || this.querySelector('#CartDrawerTitle');
    }

    // Returns the revision this mutation belongs to. Callers hand it back to
    // renderCartResponse so that a response overtaken by a newer mutation is dropped.
    beginMutation() {
      // Shopify can apply two overlapping requests in a different order than they were sent: the
      // last one's response then does not include the other line.
      if (this.pendingMutations) this.overlappingMutations = true;
      this.pendingMutations += 1;
      this.syncRevision += 1;
      this.requestController?.abort();
      // A mutation also invalidates any recommendations read started for the old cart.
      this.crossSellController?.abort();
      this.recommendationGeneration += 1;
      return this.syncRevision;
    }

    endMutation() {
      this.pendingMutations = Math.max(0, this.pendingMutations - 1);
      if (this.pendingMutations) return;
      this.syncAfterMutation = false;
      const overlapped = this.overlappingMutations;
      this.overlappingMutations = false;
      // An uncertain cross-sell add is reconciled even while an option panel holds
      // interactionFrozen; any other sync waits for the freeze to end.
      const reconcile = this.reconcileAfterMutation;
      this.reconcileAfterMutation = false;
      // A lone mutation that rendered already brought back server-fresh HTML. Overlapping
      // ones may have been applied out of order, and an unrendered latest revision (failed,
      // aborted or overtaken) is stale too: both earn one fresh read.
      if (!overlapped && this.renderedRevision === this.syncRevision) {
        this.loadRecommendations();
        return;
      }
      if (this.isConnected && this.isOpen) this.syncCart({ reconcile }).catch(() => {});
    }

    // Always re-renders on open. Comparing item_count alone missed same-count changes:
    // a line swapped for another in a second tab, a price change, or edited properties.
    async syncCart({ reconcile = false } = {}) {
      if (this.pendingMutations) {
        this.syncAfterMutation = true;
        return;
      }
      // While an option panel is in use a sync must not replace it: the skip is
      // remembered and releaseInteraction() runs it. A reconciling sync goes through.
      if (this.interactionFrozen && !reconcile) {
        this.skippedSync = true;
        return;
      }
      const revision = this.syncRevision;
      const sectionHtml = await this.requestSection();
      if (!this.isConnected || revision !== this.syncRevision || this.pendingMutations) return;
      if (this.interactionFrozen && !reconcile) {
        this.skippedSync = true;
        return;
      }
      this.skippedSync = false;
      if (reconcile) this.interactionFrozen = false;
      this.renderSection(sectionHtml);
      // If the cart changed in another tab, the background /cart page is stale too.
      this.renderCartPage(null, revision).catch(() => {});
    }

    async requestSection() {
      this.requestController?.abort();
      this.requestController = new AbortController();

      const url = new URL(this.dataset.cartUrl, window.location.origin);
      url.searchParams.set('section_id', this.dataset.sectionId);
      const response = await fetch(url, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        signal: this.requestController.signal,
      });

      if (!response.ok) throw new Error(this.dataset.errorMessage);
      return response.text();
    }

    // `revision` is what beginMutation() returned for this request. Shopify renders the
    // section at the moment it applies the change, so when several mutations are in
    // flight a slow response carries older HTML than a fast one. Painting it would show
    // a quantity the server has already moved past; a superseded response is dropped and
    // endMutation() decides whether the latest state still needs a fetch.
    async renderCartResponse(result, revision = this.syncRevision) {
      if (revision !== this.syncRevision) return;
      let sectionHtml = result.sections?.[this.dataset.sectionId];
      if (!sectionHtml) sectionHtml = await this.requestSection();
      if (revision !== this.syncRevision) return;
      // A reconciled mutation render ends any option interaction: it replaces the panel.
      this.interactionFrozen = false;
      this.skippedSync = false;
      this.renderSection(sectionHtml);
      await this.renderCartPage(result.sections, revision);
    }

    // On /cart the drawer and the cart page show the same purchase. If the drawer changes a line
    // and the page does not find out, the shopper sees two different carts until reloading. Each
    // mutation also requests the page's section in the same call, so both come from the same server
    // state and no second request is needed.
    cartPageSection() {
      return document.querySelector('[data-cart-page][data-section-id]');
    }

    renderSectionIds() {
      const pageSectionId = this.cartPageSection()?.dataset.sectionId;
      return pageSectionId && pageSectionId !== this.dataset.sectionId
        ? [this.dataset.sectionId, pageSectionId]
        : [this.dataset.sectionId];
    }

    // The page is refreshed as a complement: if it fails, the drawer is already painted correctly
    // and the page is fixed by the next mutation or on reload, without showing an error.
    async renderCartPage(sections, revision = this.syncRevision) {
      const page = this.cartPageSection();
      if (!page) return;

      const pageSectionId = page.dataset.sectionId;
      let pageHtml = sections?.[pageSectionId];

      if (!pageHtml) {
        try {
          const url = new URL(this.dataset.cartUrl, window.location.origin);
          url.searchParams.set('section_id', pageSectionId);
          const response = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
          if (!response.ok) return;
          pageHtml = await response.text();
        } catch {
          return;
        }
      }

      if (revision !== this.syncRevision) return;
      const nextPage = new DOMParser().parseFromString(pageHtml, 'text/html').querySelector('[data-cart-page]');
      const currentPage = this.cartPageSection();
      if (nextPage && currentPage?.isConnected) currentPage.replaceWith(nextPage);
    }

    renderSection(sectionHtml) {
      if (!sectionHtml) throw new Error(this.dataset.errorMessage);

      const documentFragment = new DOMParser().parseFromString(sectionHtml, 'text/html');
      const nextDrawer = documentFragment.querySelector('cart-drawer');
      const nextContent = nextDrawer?.querySelector('[data-cart-drawer-content]');
      const currentContent = this.querySelector('[data-cart-drawer-content]');

      if (!nextDrawer || !nextContent || !currentContent) throw new Error(this.dataset.errorMessage);

      // A re-render replaces the whole drawer body. Carry over an order note the shopper
      // has typed but not yet saved, and keep focus inside the drawer instead of dropping
      // it on document.body, which would strand keyboard and screen-reader users.
      const previousNote = currentContent.querySelector('textarea[name="note"][data-dirty="true"]');
      const nextNote = nextContent.querySelector('textarea[name="note"]');
      if (previousNote && nextNote) {
        nextNote.value = previousNote.value;
        nextNote.dataset.dirty = 'true';
      }

      const active = document.activeElement;
      const restoreFocus = this.isOpen && (currentContent.contains(active) || active === document.body);
      // The scrollable track lives inside the block that is replaced: without this, changing the
      // quantity of a line at the bottom of the list would send the track back to the very top.
      const previousScroll = currentContent.querySelector('[data-cart-scroll]')?.scrollTop || 0;

      this.recommendationWatch?.controller.abort();
      this.recommendationWatch = null;

      const previousRewards = currentContent.querySelector('.cart-rewards__message')?.textContent.trim() || '';
      currentContent.replaceWith(nextContent);
      // The rewards message is replaced along with the body, so it cannot be announced from its own
      // node: if it changed, it is queued for the persistent region.
      const nextRewards = nextContent.querySelector('.cart-rewards__message')?.textContent.trim() || '';
      if (nextRewards && nextRewards !== previousRewards) this.queueRewardsAnnouncement(nextRewards);

      const nextScroll = nextContent.querySelector('[data-cart-scroll]');
      if (nextScroll && previousScroll) nextScroll.scrollTop = previousScroll;

      // The pressed control is disabled for the duration of the mutation and the browser sends
      // focus to body; the one that had focus when entering busy is the one restored.
      const focusSource = active === document.body && this.busyFocus && currentContent.contains(this.busyFocus)
        ? this.busyFocus
        : active;
      const removalTarget = restoreFocus ? this.removalFocusTarget(nextContent) : null;
      if (!restoreFocus && this.pendingRemoval) {
        const rows = Array.from(nextContent.querySelectorAll('[data-cart-item-key]'));
        if (!rows.some((row) => row.dataset.cartItemKey === this.pendingRemoval.key)) {
          this.pendingRemoval = null;
        }
      }

      if (removalTarget) {
        removalTarget.focus();
      } else if (restoreFocus) {
        // Line ids are positional: the same control is first looked up within the same line (by its
        // key) and the id stays as a fallback.
        const restored = this.lineControlAfterRender(focusSource, nextContent)
          || (focusSource?.id ? nextContent.querySelector(`#${CSS.escape(focusSource.id)}`) : null);
        // The control may come back disabled from the server: the plus button turns off when the
        // line hits the inventory cap, which the client does not know. A focus() on a disabled
        // control does nothing and focus would fall to body, so the usable sibling of the same
        // stepper is looked up first.
        const target = restored && !restored.disabled
          ? restored
          : restored?.closest('[data-quantity-stepper]')?.querySelector('[data-quantity-button]:not([disabled])');
        (target || this.crossSellFocusAfterRender(focusSource, nextContent) || this.querySelector('[data-cart-drawer-close]'))?.focus();
      }
      this.dataset.itemCount = nextDrawer.dataset.itemCount;
      this.dataset.cartCountLabel = nextDrawer.dataset.cartCountLabel;

      const currentCount = this.querySelector('[data-cart-drawer-count]');
      const nextCount = nextDrawer.querySelector('[data-cart-drawer-count]');
      if (currentCount && nextCount) currentCount.textContent = nextCount.textContent;

      // Records which revision the visible HTML came from. endMutation() compares this
      // against syncRevision to decide whether a deferred sync still has anything to
      // fetch: if every mutation since the sync was requested has rendered, it does not.
      this.renderedRevision = this.syncRevision;
      // The drawer mirrors the server again: cartBaseline() may read it.
      this.cartSnapshotStale = false;

      this.updateHeaderCount();
      this.loadRecommendations();
    }

    updateHeaderCount() {
      const itemCount = Number(this.dataset.itemCount) || 0;

      document.querySelectorAll('a[href]').forEach((link) => {
        const linkUrl = new URL(link.href, window.location.origin);
        const cartUrl = new URL(this.dataset.cartUrl, window.location.origin);
        if (linkUrl.origin !== cartUrl.origin || linkUrl.pathname !== cartUrl.pathname) return;
        if (this.contains(link)) return;

        link.setAttribute('aria-label', this.dataset.cartCountLabel);
        let count = link.querySelector('.site-header__cart-count');

        // The "Show cart count" setting turned off must not switch on at the first add.
        if (itemCount > 0 && !count && link.hasAttribute('data-cart-count-enabled')) {
          count = document.createElement('span');
          count.className = 'site-header__cart-count';
          count.setAttribute('aria-hidden', 'true');
          link.append(count);
        }

        if (count) {
          count.textContent = itemCount;
          count.hidden = itemCount === 0;
        }
      });
    }

    setFormBusy(form, submitter, busy) {
      const button = submitter || form.querySelector('[data-add-to-cart]');
      if (!button) return;

      if (busy) button.dataset.wasDisabled = String(button.disabled);
      button.disabled = busy || button.dataset.wasDisabled === 'true';
      button.setAttribute('aria-busy', String(busy));

      const spinner = button.querySelector('[data-loading-icon]');
      if (spinner) spinner.hidden = !busy;
      if (!busy) delete button.dataset.wasDisabled;
    }

    // The +/- buttons and the quantity field become inactive for the duration of the mutation: a
    // second click no longer fires a parallel POST that Shopify could apply in a different order.
    // On release, each control recovers its previous state (wasDisabled) and is not forced to
    // active, so the disabled state of the extremes set by the server is not lost. If the response
    // already repainted the lines, the new controls arrive with the server's state and have nothing
    // to restore. It is reentrant: only the last exit releases.
    setDrawerBusy(busy) {
      this.drawerBusyDepth = Math.max(0, this.drawerBusyDepth + (busy ? 1 : -1));
      if (!busy && this.drawerBusyDepth > 0) return;

      this.panel.setAttribute('aria-busy', String(busy));
      if (busy) {
        // A nested mutation also disables the controls painted by the previous one.
        const active = document.activeElement;
        if (active && active !== document.body && this.panel.contains(active)) this.busyFocus = active;
      }
      this.querySelectorAll('[data-cart-quantity], [data-quantity-button], [data-cart-remove], [data-cross-sell-add], [data-cross-sell-expand], [data-cross-sell-cancel]').forEach((control) => {
        if (busy) {
          if (control.dataset.wasDisabled === undefined) {
            control.dataset.wasDisabled = String(control.disabled);
          }
          control.disabled = true;
          return;
        }

        if (control.dataset.wasDisabled === undefined) return;
        control.disabled = control.dataset.wasDisabled === 'true';
        delete control.dataset.wasDisabled;
      });
      if (busy) return;

      // Without a re-render (error or overtaken response) the control is still in the DOM but lost
      // focus when disabled: focus returns to it, or to the usable sibling of the stepper.
      const previousFocus = this.busyFocus;
      this.busyFocus = null;
      const current = document.activeElement;
      if (!this.isOpen || !previousFocus?.isConnected || (current && current !== document.body)) return;
      const target = previousFocus.disabled
        ? previousFocus.closest('[data-quantity-stepper]')?.querySelector('[data-quantity-button]:not([disabled])')
        : previousFocus;
      target?.focus();
    }

    setCrossSellBusy(button, busy) {
      if (!button) return;

      if (busy) button.dataset.wasDisabled = String(button.disabled);
      button.disabled = busy || button.dataset.wasDisabled === 'true';
      button.setAttribute('aria-busy', String(busy));
      const spinner = button.querySelector('[data-loading-icon]');
      if (spinner) spinner.hidden = !busy;
      const adding = button.querySelector('[data-cross-sell-adding]');
      if (adding) adding.hidden = !busy;
      if (!busy) delete button.dataset.wasDisabled;
    }

    clearMessages(form = null) {
      const localError = form?.querySelector('[data-product-form-error]');
      const drawerError = this.querySelector('[data-cart-error]');
      const status = this.querySelector('[data-cart-status]');

      [localError, drawerError, status].forEach((message) => {
        if (!message) return;
        message.hidden = true;
        message.textContent = '';
      });
      // The uncertain notice belongs to the error it explains, so it clears with it.
      const uncertain = this.querySelector('[data-cart-uncertain]');
      if (uncertain) uncertain.hidden = true;
    }

    showError(message, form = null) {
      const output = form?.querySelector('[data-product-form-error]') || this.querySelector('[data-cart-error]');
      if (!output) return;
      output.textContent = message || this.dataset.errorMessage;
      output.hidden = false;
    }

    // Holds the rewards message to announce it together with the notice of the change that caused
    // it; if no notice arrives right away, it is announced on its own, only once.
    queueRewardsAnnouncement(message) {
      window.clearTimeout(this.rewardsTimer);
      this.pendingRewards = message;
      this.rewardsTimer = window.setTimeout(() => {
        const pending = this.pendingRewards;
        this.pendingRewards = '';
        if (pending) this.showStatus(pending);
      }, 600);
    }

    showStatus(message) {
      const output = this.querySelector('[data-cart-status]');
      if (!output) return;
      if (this.pendingRewards) {
        window.clearTimeout(this.rewardsTimer);
        if (!message.includes(this.pendingRewards)) message = [message, this.pendingRewards].filter(Boolean).join(' ');
        this.pendingRewards = '';
      }
      // The region is shown empty and the text arrives later: a live region that appears already
      // containing text is not always announced (NVDA/JAWS with Chrome).
      output.textContent = '';
      output.hidden = false;
      window.setTimeout(() => {
        output.textContent = message;
      }, 100);
    }
  }

  class FacetFiltersForm extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.requestController = null;
      this.gridStorageKey = 'theme:grid-columns';
      this.priceTimer = null;
      this.pendingRequests = 0;
      this.focusOrigin = null;
      this.renderedSearch = this.filterSearch(window.location.search);
      // Filters of the latest request sent, painted or still in flight.
      this.requestedSearch = this.renderedSearch;

      // With JavaScript the filters apply as soon as they change, so the Apply button is
      // redundant and the stylesheet hides it. Without JavaScript the attribute is never
      // set and the form still works through that button.
      this.setAttribute('data-auto-apply', '');

      this.listen(this, 'submit', (event) => {
        const form = event.target.closest('[data-facet-form]');
        if (!form) return;
        event.preventDefault();
        clearTimeout(this.priceTimer);
        // Apply may be hidden, so it is never the fallback: focus goes back to the control
        // that was used (in Safari a clicked checkbox is not focused, so the change target
        // is remembered), or to the summary of its filter group.
        const origin = this.focusOrigin || event.submitter || document.activeElement;
        this.focusOrigin = null;
        this.renderForm(form, true, 'summary.facet__summary', { origin });
      });

      this.listen(this, 'change', (event) => {
        const target = event.target;
        if (target.matches('[data-facet-sort]') || target.matches('.facet input[type="checkbox"]')) {
          this.focusOrigin = target;
          target.form?.requestSubmit();
          this.focusOrigin = null;
          return;
        }

        if (target.matches('.facet input')) this.schedulePriceSubmit(target.form);
      });

      // Price fields wait until typing stops, so that editing the minimum and then the
      // maximum sends a single request carrying both values.
      this.listen(this, 'input', (event) => {
        const target = event.target;
        if (!target.matches?.('.facet input:not([type="checkbox"])')) return;
        // A response to an older state must not repaint the field being edited.
        this.requestController?.abort();
        this.requestedSearch = this.renderedSearch;
        this.schedulePriceSubmit(target.form);
      });

      this.listen(this, 'click', (event) => {
        // Active filter pills and "Clear all": they are links to url_to_remove that work without
        // JS; here they are refreshed via AJAX. Ctrl/Cmd/Shift/middle click still open the link as
        // the browser expects.
        const removeLink = event.target.closest('[data-facet-remove], [data-facet-clear-all]');
        if (removeLink) {
          if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey
            || event.shiftKey || event.altKey) return;
          event.preventDefault();
          this.renderUrl(removeLink.href, true, '[data-facet-remove], [data-facet-clear-all], [data-results-status]');
          return;
        }

        const button = event.target.closest('[data-grid-view]');
        if (!button) return;
        this.setGridView(button.dataset.gridView, true);
      });

      this.listen(window, 'popstate', () => {
        // Anchor navigation (a skip link) also fires popstate; only a change of the
        // filters themselves needs a refresh, and it must not move the focus.
        if (this.filterSearch(window.location.search) === this.renderedSearch) return;
        this.renderUrl(window.location.href, false, null, { moveFocus: false });
      });
      this.applyStoredGridView();

      // From 62rem the filters are always shown. The stylesheet does it with ::details-content
      // where supported; this keeps the panel really open where it is not.
      this.sidebarQuery = window.matchMedia('(min-width: 62rem)');
      this.autoOpened = false;
      this.listen(this.sidebarQuery, 'change', () => this.syncDisclosure());
      this.syncDisclosure();
    }

    schedulePriceSubmit(form) {
      clearTimeout(this.priceTimer);
      this.priceTimer = setTimeout(() => {
        if (!form?.isConnected) return;
        // A number field fires `change` when it loses focus, after the debounced `input`
        // already sent the same values: nothing new to request or announce.
        const parameters = new URLSearchParams(new FormData(form));
        Array.from(parameters.entries()).forEach(([key, value]) => {
          if (value === '') parameters.delete(key);
        });
        if (this.filterSearch(parameters.toString()) === this.requestedSearch) return;
        form.requestSubmit();
      }, 600);
    }

    filterSearch(search) {
      const parameters = new URLSearchParams(search);
      parameters.delete('section_id');
      return parameters.toString();
    }

    // Stable identity of a filter group across the HTML swap: the name of its first field.
    facetGroupKey(group) {
      return group.querySelector('input[name], select[name]')?.name
        || group.querySelector('summary')?.textContent.trim()
        || '';
    }

    syncDisclosure() {
      const disclosure = this.querySelector('.facets__disclosure');
      if (!disclosure) return;
      if (this.sidebarQuery.matches) {
        if (!disclosure.open) {
          disclosure.open = true;
          this.autoOpened = true;
        }
      } else if (this.autoOpened) {
        // Below that width the visitor decides: undo only what was opened for the sidebar.
        disclosure.open = false;
        this.autoOpened = false;
      }
    }

    disconnectedCallback() {
      this.requestController?.abort();
      clearTimeout(this.priceTimer);
      super.disconnectedCallback();
    }

    renderForm(form, pushState, focusFallback = 'button[type="submit"]', options = {}) {
      const url = new URL(form.action, window.location.origin);
      const parameters = new URLSearchParams(new FormData(form));

      Array.from(parameters.entries()).forEach(([key, value]) => {
        if (value === '') parameters.delete(key);
      });

      url.search = parameters.toString();
      this.renderUrl(url, pushState, focusFallback, options);
    }

    // focusFallback: selector that receives focus when the focused element does not survive the
    // repaint (the pill that was just removed has no id and does not exist in the new HTML).
    // options.origin: control that caused the change (may not have focus, as in Safari).
    // options.moveFocus: false leaves focus where it is unless it is lost in the repaint.
    async renderUrl(urlValue, pushState, focusFallback = null, options = {}) {
      const navigationUrl = new URL(urlValue, window.location.origin);
      // Only paints or navigates within the store itself.
      if (navigationUrl.origin !== window.location.origin) return;
      navigationUrl.searchParams.delete('section_id');
      const requestUrl = new URL(navigationUrl);
      requestUrl.searchParams.set('section_id', this.dataset.sectionId);
      const moveFocus = options.moveFocus !== false;

      this.requestController?.abort();
      this.requestController = new AbortController();
      this.requestedSearch = this.filterSearch(navigationUrl.search);
      this.pendingRequests += 1;
      this.setBusy(true);

      try {
        const response = await fetch(requestUrl, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: this.requestController.signal,
        });
        if (!response.ok) throw new Error(String(response.status));

        const sectionHtml = await response.text();
        const documentFragment = new DOMParser().parseFromString(sectionHtml, 'text/html');
        const nextElement = documentFragment.querySelector('facet-filters-form');
        if (!nextElement) throw new Error('invalid-section');

        // Everything about the focus is read now, just before the markup changes.
        const activeEl = document.activeElement;
        const origin = options.origin || activeEl;
        const focusWasInside = !activeEl || activeEl === document.body || this.contains(activeEl);
        const originGroup = origin?.closest?.('details.facet');
        const focusTarget = {
          id: origin?.id || '',
          name: origin?.name || '',
          value: origin?.type === 'checkbox' || origin?.type === 'radio' ? origin.value : null,
          groupKey: originGroup ? this.facetGroupKey(originGroup) : '',
        };
        // The mobile filter panel and every filter group are <details>; replacing the markup
        // would close them, so the state the visitor left is carried over.
        const openGroups = new Set(
          Array.from(this.querySelectorAll('details.facet[open]')).map((group) => this.facetGroupKey(group))
        );
        const disclosureWasOpen = Boolean(this.querySelector('.facets__disclosure')?.open) && !this.autoOpened;
        // A price field being edited keeps its node (value, caret and focus); only what
        // surrounds its group is replaced.
        const editedGroup = activeEl?.matches?.('.facet input:not([type="checkbox"])')
          ? activeEl.closest('details.facet')
          : null;
        const nextEditedGroup = editedGroup
          ? Array.from(nextElement.querySelectorAll('details.facet')).find(
            (group) => this.facetGroupKey(group) === this.facetGroupKey(editedGroup)
          )
          : null;

        if (editedGroup && nextEditedGroup && this.swapAround(editedGroup, nextEditedGroup, nextElement)) {
          // Focus never left the price field.
        } else {
          this.innerHTML = nextElement.innerHTML;
          this.autoOpened = false;
        }
        this.querySelectorAll('details.facet').forEach((group) => {
          group.open = openGroups.has(this.facetGroupKey(group));
        });
        if (disclosureWasOpen) {
          const disclosure = this.querySelector('.facets__disclosure');
          if (disclosure) disclosure.open = true;
        }
        this.syncDisclosure();
        this.applyStoredGridView();
        this.announceResultCount();
        this.renderedSearch = this.filterSearch(navigationUrl.search);
        if (pushState) window.history.pushState({}, '', navigationUrl);

        if (!editedGroup && (focusWasInside || options.origin) && (moveFocus || focusWasInside)) {
          requestAnimationFrame(() => this.restoreFocus(focusTarget, focusFallback, moveFocus));
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        window.location.assign(navigationUrl);
      } finally {
        this.pendingRequests -= 1;
        // An aborted request must not clear the busy state of the one that replaced it.
        if (this.pendingRequests <= 0) {
          this.pendingRequests = 0;
          this.setBusy(false);
        } else {
          // The freshly painted grid must not arrive without the busy state of the request still running.
          this.setBusy(true);
        }
      }
    }

    // Replaces the content around `keep` with the content around `counterpart` (its twin in
    // the freshly loaded markup), level by level up to this element, leaving `keep` and its
    // ancestors in place. Returns false, changing nothing, when the two trees do not line up.
    swapAround(keep, counterpart, nextRoot) {
      const levels = [];
      let oldNode = keep;
      let newNode = counterpart;
      while (oldNode !== this) {
        if (!oldNode.parentElement || !newNode.parentElement) return false;
        if (oldNode.localName !== newNode.localName) return false;
        levels.push([oldNode, newNode]);
        oldNode = oldNode.parentElement;
        newNode = newNode.parentElement;
      }
      if (newNode !== nextRoot) return false;

      levels.forEach(([current, next]) => {
        const parent = current.parentElement;
        const before = [];
        const after = [];
        let seen = false;
        next.parentElement.childNodes.forEach((node) => {
          if (node === next) seen = true;
          else (seen ? after : before).push(node);
        });
        Array.from(parent.childNodes).forEach((node) => {
          if (node !== current) node.remove();
        });
        before.forEach((node) => parent.insertBefore(node, current));
        after.forEach((node) => parent.append(node));
      });
      return true;
    }

    restoreFocus(target, focusFallback, moveFocus) {
      const group = target.groupKey
        ? Array.from(this.querySelectorAll('details.facet')).find(
          (details) => this.facetGroupKey(details) === target.groupKey
        )
        : null;
      const candidates = [];
      if (target.id) candidates.push(document.getElementById(target.id));
      if (target.name) {
        const valueSelector = target.value !== null ? `[value="${CSS.escape(target.value)}"]` : '';
        candidates.push(this.querySelector(`[name="${CSS.escape(target.name)}"]${valueSelector}`));
      }
      candidates.push(group?.querySelector('summary'));
      if (moveFocus) {
        if (focusFallback) candidates.push(this.querySelector(focusFallback));
        // Skip anything not rendered (the hidden Apply button): focus() on it is a no-op.
        candidates.push(
          ...Array.from(
            this.querySelectorAll('button[type="submit"], [data-facet-sort], summary.facet__summary, [data-results-status]')
          )
        );
      }

      for (const candidate of candidates) {
        if (!candidate || !this.contains(candidate) || candidate.disabled || candidate.getClientRects().length === 0) continue;
        candidate.focus({ preventScroll: true });
        if (document.activeElement === candidate) return;
      }
    }

    setBusy(busy) {
      const grid = this.querySelector('[data-product-grid]');
      if (grid) grid.setAttribute('aria-busy', String(busy));
    }

    // The result count lives inside the subtree this component replaces, so screen
    // readers lose the node it was announcing. Mirror the text into a region that
    // sits outside the swap and therefore keeps its identity.
    announceResultCount() {
      const liveRegion = this.parentElement?.querySelector(':scope > [data-facet-live-region]');
      if (!liveRegion) return;

      const status = this.querySelector('[data-results-status]');
      liveRegion.textContent = status?.textContent?.trim() || '';
    }

    applyStoredGridView() {
      let storedValue = null;

      try {
        storedValue = window.localStorage.getItem(this.gridStorageKey);
      } catch (_error) {
        storedValue = null;
      }

      const gridView = ['2', '4', 'list'].includes(storedValue)
        ? storedValue
        : this.dataset.defaultGridColumns;
      this.setGridView(gridView, false);
    }

    setGridView(value, persist) {
      const gridView = String(value);
      if (!['2', '4', 'list'].includes(gridView)) return;

      const productList = this.querySelector('[data-product-list]');
      if (!productList) return;

      productList.dataset.gridColumns = gridView;
      // Liquid prints the `sizes` of every view on the list (data-sizes-*), so the photos ask
      // for the width the chosen view really gives them. Cards come from the server with the
      // default view's value, which also covers the markup swapped in by filters and paging.
      const viewSizes = productList.getAttribute(`data-sizes-${gridView}`);
      if (viewSizes) {
        productList.querySelectorAll('.product-card__media img').forEach((image) => {
          if (image.getAttribute('sizes') !== viewSizes) image.setAttribute('sizes', viewSizes);
        });
      }
      this.querySelectorAll('[data-grid-view]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.gridView === gridView));
      });

      if (!persist) return;
      try {
        window.localStorage.setItem(this.gridStorageKey, gridView);
      } catch (_error) {
        // Storage can be unavailable in privacy-restricted browsing contexts.
      }
    }
  }

  // WCAG 2.2.2. The video only autoplays if the visitor did not ask to reduce motion and the
  // merchant did not turn animations off (data-animations="none"). In both cases the poster stays
  // and the button lets the visitor play it manually. userChoice stores the last explicit command
  // ('play' or 'pause'), which takes precedence over autoplay.
  class EditorialHero extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.video = this.querySelector('[data-editorial-hero-video]');
      if (!this.video) return;

      this.toggle = this.querySelector('[data-hero-video-toggle]');
      this.userChoice = null;
      this.mobileQuery = window.matchMedia('(max-width: 47.99rem)');
      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.listen(this.mobileQuery, 'change', () => this.syncPlayback());
      this.listen(this.reducedMotionQuery, 'change', () => this.syncPlayback());
      this.listen(document, 'visibilitychange', () => this.syncPlayback());
      this.listen(this.video, 'play', () => this.syncToggle());
      this.listen(this.video, 'pause', () => this.syncToggle());
      if (this.toggle) {
        this.listen(this.toggle, 'click', () => {
          this.userChoice = this.video.paused ? 'play' : 'pause';
          this.syncPlayback();
        });
      }
      this.syncToggle();
      this.syncPlayback();
    }

    get autoplayAllowed() {
      return !this.reducedMotionQuery.matches
        && document.documentElement.dataset.animations !== 'none';
    }

    syncToggle() {
      if (!this.toggle) return;
      const playing = !this.video.paused;
      const label = playing ? this.dataset.pauseLabel : this.dataset.playLabel;
      this.toggle.toggleAttribute('data-playing', playing);
      if (label) this.toggle.setAttribute('aria-label', label);
    }

    disconnectedCallback() {
      this.video?.pause();
      this.removeAttribute('data-video-active');
      super.disconnectedCallback();
    }

    hydrateVideo() {
      if (!this.video || this.video.dataset.sourcesLoaded === 'true') return;

      this.video.querySelectorAll('source[data-src]').forEach((source) => {
        source.src = source.dataset.src;
      });
      this.video.dataset.sourcesLoaded = 'true';
      this.video.load();
    }

    async syncPlayback() {
      if (!this.video) return;

      const mobilePlaybackAllowed = !this.mobileQuery.matches
        || this.dataset.enableVideoMobile === 'true';
      const wantsPlay = this.userChoice === 'play'
        || (this.userChoice === null && this.autoplayAllowed);
      const shouldPlay = mobilePlaybackAllowed
        && wantsPlay
        && document.visibilityState !== 'hidden';

      // With no video possible at this width there is nothing to control.
      if (this.toggle) this.toggle.hidden = !mobilePlaybackAllowed;

      if (!shouldPlay) {
        this.video.pause();
        // Paused keeps the frame already seen; with no video at this width the poster returns.
        if (!mobilePlaybackAllowed) this.removeAttribute('data-video-active');
        return;
      }

      this.hydrateVideo();
      try {
        await this.video.play();
        this.setAttribute('data-video-active', '');
      } catch (error) {
        this.removeAttribute('data-video-active');
      }
    }
  }

  class EditorialLookbook extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.activeTrigger = null;
      this.activePopover = null;
      this.releaseFocusTrap = null;
      this.triggers = Array.from(this.querySelectorAll('[data-lookbook-trigger]'));

      if (this.triggers.length === 0) return;

      this.listen(this, 'click', (event) => this.handleClick(event));
      this.listen(document, 'pointerdown', (event) => this.handleOutsidePointer(event));
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.activePopover || event.defaultPrevented) return;
        event.preventDefault();
        event.stopPropagation();
        this.close(true);
      });
      this.listen(window, 'resize', () => this.positionPopover());
      this.listen(window, 'scroll', () => this.positionPopover(), {
        capture: true,
        passive: true,
      });
      this.listen(this, 'shopify:block:select', (event) => {
        const hotspot = event.target.closest?.('[data-lookbook-hotspot]');
        const trigger = hotspot?.querySelector('[data-lookbook-trigger]');
        if (trigger) this.open(trigger);
      });
    }

    disconnectedCallback() {
      this.close(false);
      super.disconnectedCallback();
    }

    handleClick(event) {
      const closeButton = event.target.closest('[data-lookbook-close]');
      if (closeButton) {
        event.preventDefault();
        this.close(true);
        return;
      }

      const trigger = event.target.closest('[data-lookbook-trigger]');
      if (!trigger) return;

      if (trigger === this.activeTrigger) {
        this.close(true);
      } else {
        this.open(trigger);
      }
    }

    handleOutsidePointer(event) {
      if (!this.activePopover) return;
      if (this.activePopover.contains(event.target) || this.activeTrigger?.contains(event.target)) return;
      const trigger = this.activeTrigger;
      this.close(false);
      requestAnimationFrame(() => {
        const focusWasLost = document.activeElement === document.body
          || document.activeElement === document.documentElement;
        if (focusWasLost && trigger?.isConnected) trigger.focus();
      });
    }

    open(trigger) {
      const popoverId = trigger.getAttribute('aria-controls');
      const popover = popoverId ? document.getElementById(popoverId) : null;
      if (!popover || !this.contains(popover)) return;

      this.close(false);
      this.activeTrigger = trigger;
      this.activePopover = popover;
      trigger.setAttribute('aria-expanded', 'true');
      popover.hidden = false;
      popover.inert = false;
      popover.setAttribute('data-open', '');
      this.positionPopover();
      this.releaseFocusTrap = trapFocus(
        popover,
        popover.querySelector('[data-lookbook-close]'),
      );
    }

    close(restoreFocus) {
      if (!this.activePopover || !this.activeTrigger) return;

      const trigger = this.activeTrigger;
      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      trigger.setAttribute('aria-expanded', 'false');
      this.activePopover.hidden = true;
      this.activePopover.inert = true;
      this.activePopover.removeAttribute('data-open');
      this.activePopover.style.removeProperty('left');
      this.activePopover.style.removeProperty('top');
      this.activePopover = null;
      this.activeTrigger = null;

      if (restoreFocus && trigger.isConnected) trigger.focus();
    }

    positionPopover() {
      if (!this.activePopover || !this.activeTrigger) return;

      const triggerRect = this.activeTrigger.getBoundingClientRect();
      const popoverWidth = this.activePopover.offsetWidth;
      const popoverHeight = this.activePopover.offsetHeight;
      const margin = 16;
      const gap = 12;
      const preferredPosition = this.activePopover.dataset.position || 'right';
      let left = triggerRect.left + (triggerRect.width - popoverWidth) / 2;
      let top = triggerRect.bottom + gap;

      if (preferredPosition === 'top') top = triggerRect.top - popoverHeight - gap;
      if (preferredPosition === 'left') {
        left = triggerRect.left - popoverWidth - gap;
        top = triggerRect.top + (triggerRect.height - popoverHeight) / 2;
      }
      if (preferredPosition === 'right') {
        left = triggerRect.right + gap;
        top = triggerRect.top + (triggerRect.height - popoverHeight) / 2;
      }

      const maxLeft = Math.max(margin, window.innerWidth - popoverWidth - margin);
      const maxTop = Math.max(margin, window.innerHeight - popoverHeight - margin);
      left = Math.min(Math.max(left, margin), maxLeft);
      top = Math.min(Math.max(top, margin), maxTop);

      this.activePopover.style.left = `${Math.round(left)}px`;
      this.activePopover.style.top = `${Math.round(top)}px`;
    }
  }

  class CompleteTheLook extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.items = Array.from(this.querySelectorAll('[data-bundle-item]'));
      this.submitButton = this.querySelector('[data-complete-look-submit]');
      this.submitLabel = this.querySelector('[data-complete-look-label]');
      this.countOutput = this.querySelector('[data-bundle-count]');
      this.totalOutput = this.querySelector('[data-bundle-total]');
      this.statusOutput = this.querySelector('[data-bundle-status]');
      this.errorOutput = this.querySelector('[data-bundle-error]');
      this.requestController = null;
      this.busy = false;

      if (!this.submitButton) return;

      this.listen(this, 'change', (event) => {
        const item = event.target.closest('[data-bundle-item]');
        if (!item || !event.target.matches('[data-bundle-select], [data-bundle-variant]')) return;
        if (event.target.matches('[data-bundle-variant]')) this.updateItemPrice(item);
        this.clearMessages();
        this.updateSummary();
      });
      this.listen(this.submitButton, 'click', () => {
        this.addSelectedItems().catch((error) => {
          if (error.name === 'AbortError') return;
          this.showError(error.message);
        });
      });

      this.items.forEach((item) => this.updateItemPrice(item));
      this.updateSummary();
    }

    disconnectedCallback() {
      this.requestController?.abort();
      super.disconnectedCallback();
    }

    getVariantData(item) {
      const control = item.querySelector('[data-bundle-variant]');
      if (!control || control.disabled || !control.value) return null;

      const source = control instanceof HTMLSelectElement
        ? control.selectedOptions[0]
        : control;
      if (!source) return null;

      return {
        id: Number(control.value),
        price: Number(source.dataset.price) || 0,
        quantity: Math.max(1, Number(source.dataset.quantity) || 1),
        formattedPrice: source.dataset.priceFormatted || '',
        formattedComparePrice: source.dataset.compareFormatted || '',
      };
    }

    getSelectedItems() {
      return this.items.flatMap((item) => {
        const checkbox = item.querySelector('[data-bundle-select]');
        const variant = this.getVariantData(item);
        if (!checkbox?.checked || checkbox.disabled || !variant?.id) return [];
        return [{ ...variant, item }];
      });
    }

    updateItemPrice(item) {
      const variant = this.getVariantData(item);
      if (!variant) return;

      const currentPrice = item.querySelector('[data-current-price]');
      const comparePrice = item.querySelector('[data-compare-price]');
      if (currentPrice) currentPrice.textContent = variant.formattedPrice;
      if (comparePrice) {
        comparePrice.textContent = variant.formattedComparePrice;
        comparePrice.hidden = !variant.formattedComparePrice;
      }
    }

    updateSummary() {
      this.items.forEach((item) => {
        const checkbox = item.querySelector('[data-bundle-select]');
        item.toggleAttribute('data-selected', Boolean(checkbox?.checked && !checkbox.disabled));
      });

      const selectedItems = this.getSelectedItems();
      const count = selectedItems.length;
      const total = selectedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0,
      );
      const formattedTotal = formatMoney(total, this.dataset.moneyFormat);
      // The noun agrees with the total number of pieces in the look, not with the selected ones: "1
      // of 3 items selected".
      const countTemplate = this.items.length === 1
        ? this.dataset.selectedOneTemplate
        : this.dataset.selectedManyTemplate;

      if (this.countOutput) {
        this.countOutput.textContent = this.interpolate(countTemplate, {
          count,
          total: this.items.length,
        });
      }
      if (this.totalOutput) this.totalOutput.textContent = formattedTotal;
      if (this.submitLabel) {
        if (count === 0) {
          this.submitLabel.textContent = this.dataset.emptyLabel;
        } else {
          const buttonTemplate = count === 1
            ? this.dataset.addOneTemplate
            : this.dataset.addManyTemplate;
          this.submitLabel.textContent = this.interpolate(buttonTemplate, {
            count,
            total: formattedTotal,
          });
        }
      }
      this.submitButton.disabled = this.busy || count === 0;
    }

    interpolate(template = '', values = {}) {
      return Object.entries(values).reduce(
        (output, [key, value]) => output.replaceAll(`__${key}__`, String(value)),
        template,
      );
    }

    async addSelectedItems() {
      const selectedItems = this.getSelectedItems();
      if (selectedItems.length === 0 || this.busy) return;

      this.clearMessages();
      this.setBusy(true);
      this.requestController?.abort();
      const controller = new AbortController();
      this.requestController = controller;
      // The drawer adds' deadline. Only this timeout, not a deliberate abort, is
      // settled by reading the cart.
      let timedOut = false;
      const deadline = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, CART_ADD_TIMEOUT);
      const drawer = document.querySelector('cart-drawer');
      // Taken before beginMutation(). Without a drawer (cart type "page") /cart.js is read.
      const baseline = typeof drawer?.cartBaseline === 'function'
        ? drawer.cartBaseline()
        : readCartQuantities(this.dataset.cartUrl).then((cart) => cart?.quantities || null);
      const revision = drawer?.beginMutation?.();
      const requestBody = {
        items: selectedItems.map(({ id, quantity }) => ({ id, quantity })),
      };
      const requested = new Map();
      selectedItems.forEach(({ id, quantity }) => {
        const key = String(id);
        requested.set(key, (requested.get(key) || 0) + (Number(quantity) || 1));
      });

      if (drawer?.dataset.sectionId) {
        requestBody.sections = typeof drawer.renderSectionIds === 'function'
          ? drawer.renderSectionIds()
          : [drawer.dataset.sectionId];
        requestBody.sections_url = `${window.location.pathname}${window.location.search}`;
      }

      try {
        const before = await baseline;
        // See addItem: a lost response (network error, deadline, an HTML error page)
        // is settled by reading the cart before the shopper is invited to try again.
        let response = null;
        let result = null;
        try {
          response = await fetch(this.dataset.cartAddUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          });
          result = await response.json();
        } catch (error) {
          if (error.name === 'AbortError' && !timedOut) throw error;
          result = null;
        }
        window.clearTimeout(deadline);

        if (!response || result === null || typeof result !== 'object') {
          const after = await readCartQuantities(this.dataset.cartUrl);
          const mayStillLand = timedOut || !response || response.status >= 500;
          const outcome = classifyAdd(requested, before, after?.quantities, mayStillLand);
          if (outcome === 'not_applied') throw new Error(this.dataset.errorMessage);
          if (outcome === 'unknown' && typeof drawer?.showUnconfirmedAdd === 'function') {
            drawer.showUnconfirmedAdd(this.submitButton);
            return;
          }
          const canOpenDrawer = typeof drawer?.renderCartResponse === 'function'
            && typeof drawer.open === 'function';
          if (outcome === 'unknown' || !canOpenDrawer) {
            // The cart page shows what the server holds.
            window.location.assign(this.dataset.cartUrl);
            return;
          }
          await drawer.renderCartResponse({}, revision).catch(() => {});
          drawer.showStatus?.(this.dataset.addedMessage);
          drawer.open(this.submitButton);
          this.showStatus(this.dataset.addedMessage);
          return;
        }

        if (!response.ok) {
          throw new Error(result?.description || result?.message || this.dataset.errorMessage);
        }

        const canRenderDrawer = drawer
          && typeof drawer.renderCartResponse === 'function'
          && typeof drawer.open === 'function'
          && result.sections;

        if (!canRenderDrawer) {
          window.location.assign(this.dataset.cartUrl);
          return;
        }

        try {
          await drawer.renderCartResponse(result, revision);
        } catch (_error) {
          window.location.assign(this.dataset.cartUrl);
          return;
        }

        drawer.showStatus?.(this.dataset.addedMessage);
        drawer.open(this.submitButton);
        this.showStatus(this.dataset.addedMessage);
      } finally {
        window.clearTimeout(deadline);
        this.setBusy(false);
        drawer?.endMutation?.();
      }
    }

    setBusy(busy) {
      this.busy = busy;
      this.setAttribute('aria-busy', String(busy));
      this.querySelectorAll('[data-bundle-select], select[data-bundle-variant]').forEach((control) => {
        if (busy) {
          control.dataset.wasDisabled = String(control.disabled);
          control.disabled = true;
        } else if (control.dataset.wasDisabled !== undefined) {
          control.disabled = control.dataset.wasDisabled === 'true';
          delete control.dataset.wasDisabled;
        }
      });

      const spinner = this.submitButton.querySelector('[data-loading-icon]');
      if (spinner) spinner.hidden = !busy;
      this.submitButton.setAttribute('aria-busy', String(busy));
      if (busy) {
        this.submitButton.disabled = true;
      } else {
        this.updateSummary();
      }
    }

    clearMessages() {
      [this.statusOutput, this.errorOutput].forEach((output) => {
        if (!output) return;
        output.hidden = true;
        output.textContent = '';
      });
    }

    showStatus(message) {
      if (!this.statusOutput) return;
      this.statusOutput.textContent = message;
      this.statusOutput.hidden = false;
    }

    showError(message) {
      if (!this.errorOutput) return;
      this.errorOutput.textContent = message || this.dataset.errorMessage;
      this.errorOutput.hidden = false;
    }
  }

  class CuratedShowcase extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.tabs = Array.from(this.querySelectorAll('[data-curated-tab]'));
      this.panels = Array.from(this.querySelectorAll('[data-curated-panel]'));

      if (this.tabs.length === 0 || this.tabs.length !== this.panels.length) return;

      this.tabs.forEach((tab, index) => {
        this.listen(tab, 'click', () => this.activate(index));
        this.listen(tab, 'keydown', (event) => this.handleKeydown(event, index));
      });
      this.listen(this, 'shopify:block:select', (event) => {
        const panel = event.target.closest?.('[data-curated-panel]');
        const panelIndex = this.panels.indexOf(panel);
        if (panelIndex >= 0) this.activate(panelIndex, false);
      });

      const selectedIndex = this.tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
      this.activate(Math.max(0, selectedIndex), false);
    }

    activate(index, focus = false) {
      if (index < 0 || index >= this.tabs.length) return;

      this.tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      this.panels.forEach((panel, panelIndex) => {
        const selected = panelIndex === index;
        panel.hidden = !selected;
        panel.inert = !selected;
      });

      if (focus) this.tabs[index].focus();
    }

    handleKeydown(event, currentIndex) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

      event.preventDefault();
      let nextIndex = currentIndex;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = this.tabs.length - 1;
      if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
      }
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % this.tabs.length;
      this.activate(nextIndex, true);
    }
  }

  class MarqueeBanner extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.toggleButton = this.querySelector('[data-marquee-toggle]');
      this.toggleLabel = this.querySelector('[data-marquee-toggle-label]');

      if (!this.toggleButton) return;

      this.setPaused(false);
      this.listen(this.toggleButton, 'click', () => {
        this.setPaused(!this.hasAttribute('data-paused'));
      });
    }

    setPaused(paused) {
      this.toggleAttribute('data-paused', paused);
      this.toggleButton.setAttribute('aria-pressed', String(paused));
      const label = paused ? this.dataset.playLabel : this.dataset.pauseLabel;
      this.toggleButton.setAttribute('aria-label', label);
      if (this.toggleLabel) this.toggleLabel.textContent = label;
    }
  }

  class AnnouncementBar extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.items = Array.from(this.querySelectorAll('[data-announcement-item]'));
      this.previousButton = this.querySelector('[data-announcement-previous]');
      this.nextButton = this.querySelector('[data-announcement-next]');
      this.pauseButton = this.querySelector('[data-announcement-pause]');
      this.status = this.querySelector('[data-announcement-status]');
      this.activeIndex = Math.max(0, this.items.findIndex((item) => !item.hidden));
      this.autoRotate = this.dataset.autoRotate === 'true';
      this.interval = Math.max(3000, Number(this.dataset.interval) || 5000);
      this.userPaused = false;
      this.interactionPaused = false;
      this.editorSelected = false;
      this.timer = null;

      if (this.items.length <= 1) return;

      // Theme editor: show the selected announcement and hold rotation until it is deselected.
      this.listen(this, 'shopify:block:select', (event) => {
        const index = this.items.indexOf(event.target.closest?.('[data-announcement-item]'));
        this.editorSelected = true;
        this.clearTimer();
        if (index >= 0) this.setActive(index, false);
      });
      this.listen(this, 'shopify:block:deselect', () => {
        this.editorSelected = false;
        this.schedule();
      });

      this.listen(this.previousButton, 'click', () => this.changeBy(-1));
      this.listen(this.nextButton, 'click', () => this.changeBy(1));
      this.listen(this.pauseButton, 'click', () => {
        this.userPaused = !this.userPaused;
        this.updatePauseButton();
        this.schedule();
      });
      // Rotation resumes only once neither the pointer nor the keyboard focus is inside.
      this.pointerInside = false;
      this.listen(this, 'pointerenter', () => {
        this.pointerInside = true;
        this.interactionPaused = true;
        this.clearTimer();
      });
      this.listen(this, 'pointerleave', () => {
        this.pointerInside = false;
        if (this.contains(document.activeElement)) return;
        this.interactionPaused = false;
        this.schedule();
      });
      this.listen(this, 'focusin', () => {
        this.interactionPaused = true;
        this.clearTimer();
      });
      this.listen(this, 'focusout', () => {
        requestAnimationFrame(() => {
          // The frame can land after the Theme Editor has removed this section.
          if (!this.isConnected || this.pointerInside || this.contains(document.activeElement)) return;
          this.interactionPaused = false;
          this.schedule();
        });
      });
      this.listen(reducedMotionQuery, 'change', () => this.schedule());

      this.setActive(this.activeIndex, false);
      this.updatePauseButton();
      this.schedule();
    }

    disconnectedCallback() {
      this.clearTimer();
      super.disconnectedCallback();
    }

    changeBy(offset) {
      const nextIndex = (this.activeIndex + offset + this.items.length) % this.items.length;
      this.setActive(nextIndex, true);
      this.schedule();
    }

    setActive(index, announce) {
      this.activeIndex = index;
      this.items.forEach((item, itemIndex) => {
        const active = itemIndex === index;
        item.hidden = !active;
        item.setAttribute('aria-hidden', String(!active));
      });

      if (announce && this.status) {
        this.status.textContent = this.items[index]?.textContent.trim() || '';
      }
    }

    updatePauseButton() {
      if (!this.pauseButton) return;

      this.pauseButton.toggleAttribute('data-paused', this.userPaused);
      this.pauseButton.setAttribute(
        'aria-label',
        this.userPaused ? this.pauseButton.dataset.playLabel : this.pauseButton.dataset.pauseLabel,
      );
    }

    schedule() {
      this.clearTimer();
      if (!this.isConnected) return;
      if (!this.autoRotate || this.userPaused || this.interactionPaused || this.editorSelected || reducedMotionQuery.matches) return;

      this.timer = window.setTimeout(() => {
        this.setActive((this.activeIndex + 1) % this.items.length, false);
        this.schedule();
      }, this.interval);
    }

    clearTimer() {
      if (this.timer === null) return;
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  class FaqAccordion extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.items = Array.from(this.querySelectorAll('details'));

      this.items.forEach((item) => {
        this.listen(item, 'toggle', () => this.handleToggle(item));
      });
      this.listen(this, 'shopify:block:select', (event) => {
        const item = event.target.closest?.('details');
        if (!item || !this.contains(item)) return;
        item.open = true;
        item.querySelector('summary')?.focus();
      });
    }

    handleToggle(activeItem) {
      if (activeItem.open && this.hasAttribute('data-single-open')) {
        this.items.forEach((item) => {
          if (item !== activeItem) item.open = false;
        });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Anchor index that tracks scroll.
  //
  // Two consumers, one piece:
  // - Documentation: the Liquid already serves the list, because the anchor ids are a block setting
  // and the server knows them.
  // - Legal pages: the headings are written by the merchant in the page editor, so there are no ids
  // to emit and the list is built here.
  //
  // The element is born with [hidden] and only shown when it finds two or more targets: a one-entry
  // index guides no one, and without JavaScript an empty disclosure cannot stay on screen. The
  // content it points to reads in full regardless.
  // ---------------------------------------------------------------------------
  class AnchorNav extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.list = this.querySelector('[data-anchor-list]');
      this.targets = this.collectTargets();

      if (this.targets.length < 2) return;
      if (this.list && !this.list.children.length) this.buildList();

      this.links = new Map();
      this.querySelectorAll('[data-anchor-link]').forEach((link) => {
        const id = link.getAttribute('href')?.slice(1);
        if (id) this.links.set(id, link);
      });

      if (!this.links.size) return;

      this.hidden = false;
      this.watchTargets();
      // The legal pages' index lives inside an open <details>: on mobile it takes up half the
      // screen, so it closes itself when jumping to a section.
      this.listen(this, 'click', (event) => {
        if (!event.target.closest('[data-anchor-link]')) return;
        const disclosure = this.querySelector('[data-anchor-disclosure]');
        if (disclosure && window.matchMedia('(max-width: 61.99rem)').matches) {
          disclosure.open = false;
        }
      });
    }

    disconnectedCallback() {
      this.observer?.disconnect();
      super.disconnectedCallback();
    }

    collectTargets() {
      const source = this.dataset.anchorSource
        ? document.querySelector(this.dataset.anchorSource)
        : null;

      // Served mode: the targets are those the Liquid's links already point to.
      if (!source) {
        return Array.from(this.querySelectorAll('[data-anchor-link]'))
          .map((link) => document.getElementById(link.getAttribute('href')?.slice(1) || ''))
          .filter(Boolean);
      }

      // Built mode: the headings are numbered and given an id if they have none, which is normal in
      // text pasted from the page editor.
      const prefix = this.dataset.anchorPrefix || 'AnchorNavSection';
      return Array.from(source.querySelectorAll(this.dataset.anchorSelector || 'h2'))
        .filter((heading) => heading.textContent.trim())
        .map((heading, index) => {
          if (!heading.id) heading.id = `${prefix}-${index + 1}`;
          return heading;
        });
    }

    buildList() {
      const fragment = document.createDocumentFragment();

      this.targets.forEach((target) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${target.id}`;
        link.className = 'anchor-nav__link';
        link.textContent = target.textContent.trim();
        link.setAttribute('data-anchor-link', '');
        item.appendChild(link);
        fragment.appendChild(item);
      });

      this.list.appendChild(fragment);
    }

    watchTargets() {
      if (!('IntersectionObserver' in window)) return;

      this.visible = new Set();

      // -45% at the bottom: what occupies the top half of the window counts as "on screen", not
      // what has just peeked over the bottom edge.
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.visible.add(entry.target.id);
          else this.visible.delete(entry.target.id);
        });
        this.syncCurrent();
      }, { rootMargin: '0px 0px -45% 0px', threshold: 0 });

      this.targets.forEach((target) => this.observer.observe(target));
      this.listen(window, 'scroll', () => this.syncCurrent(), { passive: true });
    }

    // With several sections on screen the first one wins, not the last one the observer reported:
    // the order in which its calls arrive is not the page order.
    syncCurrent() {
      if (this.atBottom()) {
        this.setCurrent(this.targets[this.targets.length - 1].id);
        return;
      }

      const first = this.targets.find((target) => this.visible.has(target.id));
      if (first) this.setCurrent(first.id);
    }

    // A document's last section is usually shorter than the observer's bottom margin, so by itself
    // it would never reach "on screen" and its index entry would be dead. At the bottom of the
    // page, the last one is the one that applies.
    atBottom() {
      const scrolled = window.scrollY + window.innerHeight;
      return scrolled >= document.documentElement.scrollHeight - 2;
    }

    setCurrent(id) {
      const link = this.links.get(id);
      if (!link || link === this.currentLink) return;

      this.currentLink?.removeAttribute('aria-current');
      link.setAttribute('aria-current', 'true');
      this.currentLink = link;
    }
  }

  // docs-only:start
  // ---------------------------------------------------------------------------
  // Copying a documentation snippet.
  //
  // The button is born with [hidden] in the Liquid and only revealed here, once the browser is
  // known to have a clipboard. Without JavaScript, or in a context without permission, the snippet
  // can still be read and selected and no inert button is left on screen.
  // ---------------------------------------------------------------------------
  class CopyText extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-copy-trigger]');
      this.label = this.querySelector('[data-copy-label]');
      this.status = this.querySelector('[data-copy-status]');
      this.source = this.dataset.copySource
        ? this.querySelector(this.dataset.copySource) || document.querySelector(this.dataset.copySource)
        : null;

      if (!this.trigger || !this.source || !navigator.clipboard?.writeText) return;

      this.idleLabel = this.label?.textContent || '';
      this.trigger.hidden = false;
      this.listen(this.trigger, 'click', () => this.copy());
    }

    disconnectedCallback() {
      clearTimeout(this.resetTimer);
      super.disconnectedCallback();
    }

    // The success state lives in an attribute, not in loose classes: CSS decides how it looks
    // (checkmark, color) and JavaScript only says what happened.
    setCopied(copied) {
      this.toggleAttribute('data-copied', copied);
      if (this.label && this.dataset.copiedLabel) {
        this.label.textContent = copied ? this.dataset.copiedLabel : this.idleLabel;
      }
      // The announcement goes in a separate live region: changing only the button's label is not
      // read by a screen reader if focus was already on it.
      if (this.status) this.status.textContent = copied ? (this.dataset.copiedLabel || '') : '';
    }

    async copy() {
      try {
        await navigator.clipboard.writeText(this.source.textContent.trim());
      } catch {
        // A denied clipboard is not an error the merchant can resolve: the text is left as it was
        // and the snippet stays there to select by hand.
        return;
      }

      this.setCopied(true);

      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => this.setCopied(false), 2000);
    }
  }
  // docs-only:end

  // ---------------------------------------------------------------------------
  // Instant FAQ filter.
  //
  // Pure progressive enhancement: the field arrives hidden through the theme's js-only utility, so
  // without JavaScript the page shows all the questions and there is no search box that does not
  // search. It does not navigate, reload or touch the URL.
  //
  // Question and answer are compared without accents or case, so a query typed without
  // accents still matches the accented word.
  // ---------------------------------------------------------------------------
  const foldText = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  class FaqFilter extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.input = this.querySelector('[data-filter-input]');
      this.status = this.querySelector('[data-filter-status]');
      this.empty = this.querySelector('[data-filter-empty]');
      this.groups = Array.from(document.querySelectorAll('[data-filter-group]'));
      this.items = this.groups.flatMap((group) => Array.from(group.querySelectorAll('details')));

      if (!this.input || !this.items.length) return;

      // The text is indexed once: filtering on each keystroke should not cost a DOM walk per
      // question.
      this.index = this.items.map((item) => ({
        item,
        text: foldText(item.textContent || ''),
      }));

      this.listen(this.input, 'input', () => this.schedule());
      // Escape clears the field without taking focus out of it, which is what anyone who has used a
      // search box expects.
      this.listen(this.input, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.input.value) return;
        event.preventDefault();
        event.stopPropagation();
        this.input.value = '';
        this.apply();
      });
    }

    disconnectedCallback() {
      clearTimeout(this.debounce);
      super.disconnectedCallback();
    }

    schedule() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => this.apply(), 120);
    }

    apply() {
      const query = foldText(this.input.value.trim());

      if (!query) {
        this.index.forEach(({ item }) => { item.hidden = false; });
        this.groups.forEach((group) => { group.hidden = false; });
        if (this.empty) this.empty.hidden = true;
        if (this.status) this.status.textContent = '';
        return;
      }

      let matches = 0;
      this.index.forEach(({ item, text }) => {
        const hit = text.includes(query);
        item.hidden = !hit;
        if (hit) matches += 1;
      });

      // A category with no results is removed entirely: leaving its title hanging over an empty
      // list reads as a page failure.
      this.groups.forEach((group) => {
        group.hidden = !Array.from(group.querySelectorAll('details')).some((item) => !item.hidden);
      });

      if (this.empty) this.empty.hidden = matches > 0;
      if (this.status) {
        this.status.textContent = (this.dataset.filterCountTemplate || '')
          .replace('[count]', String(matches));
      }
    }
  }

  class PasswordModal extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-password-open]');
      this.overlay = this.querySelector('[data-password-overlay]');
      this.panel = this.querySelector('[data-password-panel]');
      this.closeButton = this.querySelector('[data-password-close]');
      this.passwordInput = this.querySelector('input[name="password"]');
      this.managedInertElements = [];
      this.releaseFocusTrap = null;
      this.returnFocusTarget = null;

      if (!this.trigger || !this.overlay || !this.panel || !this.closeButton) return;

      this.setClosedState();
      this.listen(this.trigger, 'click', () => this.open());
      this.listen(this.closeButton, 'click', () => this.close(true));
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target === this.overlay) this.close(true);
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.close(true);
      });

      if (this.querySelector('[data-password-error]')) {
        // Without the guard, a section removed in the Theme Editor before this frame runs
        // still opens and leaves body[data-modal-open] set with no modal to close it.
        requestAnimationFrame(() => {
          if (this.isConnected) this.open(this.passwordInput);
        });
      }
    }

    disconnectedCallback() {
      this.close(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.hasAttribute('data-open');
    }

    setClosedState() {
      this.overlay.hidden = true;
      this.panel.inert = true;
      this.panel.setAttribute('aria-modal', 'false');
      this.panel.setAttribute('aria-hidden', 'true');
      this.trigger.setAttribute('aria-expanded', 'false');
      this.removeAttribute('data-open');
    }

    open(initialFocus = null) {
      if (this.isOpen) return;

      const returnTarget = document.activeElement;
      closeOtherDialogs(this);
      this.returnFocusTarget = returnTarget;
      this.overlay.hidden = false;
      this.panel.inert = false;
      this.panel.setAttribute('aria-modal', 'true');
      this.panel.setAttribute('aria-hidden', 'false');
      this.trigger.setAttribute('aria-expanded', 'true');
      this.setAttribute('data-open', '');
      // Via syncDialogScrollLocks, which measures the scrollbar before locking.
      syncDialogScrollLocks();
      this.applyBackgroundInert();
      this.releaseFocusTrap = trapFocus(
        this.panel,
        initialFocus || this.passwordInput || this.closeButton,
      );
    }

    close(restoreFocus = false) {
      if (!this.overlay || !this.panel || !this.trigger) return;

      this.releaseFocusTrap?.();
      this.releaseFocusTrap = null;
      this.setClosedState();
      syncDialogScrollLocks();
      this.restoreBackgroundInert();

      if (restoreFocus && this.returnFocusTarget?.isConnected) {
        this.returnFocusTarget.focus();
      }
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this.overlay;

      while (currentElement.parentElement) {
        const parentElement = currentElement.parentElement;

        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });

        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }
  }

  class LocalizationForm extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.form = this.querySelector('form');
      if (!this.form) return;

      this.listen(this.form, 'submit', () => {
        this.form.setAttribute('aria-busy', 'true');
      });
    }
  }

  class PredictiveSearch extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.trigger = this.querySelector('[data-predictive-search-open]');
      this.overlay = this.querySelector('[data-predictive-search-overlay]');
      this.panel = this.querySelector('[data-predictive-search-panel]');
      this.form = this.querySelector('[data-predictive-search-form]');
      this.input = this.querySelector('[data-predictive-search-input]');
      this.results = this.querySelector('[data-predictive-search-results]');
      this.status = this.querySelector('[data-predictive-search-status]');
      this.footer = this.querySelector('[data-predictive-search-footer]');
      this.clearButton = this.querySelector('[data-predictive-search-clear]');
      this.closeButton = this.querySelector('[data-predictive-search-close]');
      this.managedInertElements = [];
      this.options = [];
      this.activeIndex = -1;
      this.searchTimer = null;
      this.requestController = null;
      this.releaseFocusTrap = null;

      if (!this.trigger || !this.overlay || !this.panel || !this.input || !this.results) return;

      this.setOpen(false);
      if (this.clearButton) this.clearButton.hidden = this.input.value.trim().length === 0;
      this.listen(this.trigger, 'click', () => this.setOpen(true));
      if (this.closeButton) {
        this.listen(this.closeButton, 'click', () => this.setOpen(false, true));
      }
      if (this.clearButton) {
        this.listen(this.clearButton, 'click', () => this.clearSearch());
      }
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target === this.overlay) this.setOpen(false, true);
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.setOpen(false, true);
      });
      this.listen(this.input, 'input', () => this.handleInput());
      this.listen(this.input, 'keydown', (event) => this.handleInputKeydown(event));
      this.listen(this.results, 'pointermove', (event) => {
        const option = event.target.closest('[role="option"]');
        if (!option || !this.results.contains(option)) return;
        this.setActiveOption(this.options.indexOf(option));
      });
    }

    disconnectedCallback() {
      window.clearTimeout(this.searchTimer);
      this.requestController?.abort();
      this.setOpen(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.trigger?.getAttribute('aria-expanded') === 'true';
    }

    setOpen(open, restoreFocus = false) {
      if (!this.trigger || !this.overlay || !this.panel || !this.input) return;

      if (open) closeOtherDialogs(this);
      this.trigger.setAttribute('aria-expanded', String(open));
      this.panel.setAttribute('aria-hidden', String(!open));
      this.panel.inert = !open;
      this.overlay.hidden = !open;
      this.toggleAttribute('data-open', open);
      syncDialogScrollLocks();

      if (open) {
        this.applyBackgroundInert();
        this.releaseFocusTrap = trapFocus(this.panel, this.input);
        // Closing empties the option list while the results stay in the DOM.
        this.collectOptions();
        this.updateComboboxState();
      } else {
        window.clearTimeout(this.searchTimer);
        this.requestController?.abort();
        this.requestController = null;
        this.releaseFocusTrap?.();
        this.releaseFocusTrap = null;
        this.restoreBackgroundInert();
        this.resetActiveOption();
        this.input.setAttribute('aria-expanded', 'false');
        if (restoreFocus && this.trigger.isConnected) this.trigger.focus();
      }
    }

    handleInput() {
      const query = this.input.value.trim();
      if (this.clearButton) this.clearButton.hidden = query.length === 0;
      this.clearFooter();
      window.clearTimeout(this.searchTimer);
      this.requestController?.abort();
      this.resetActiveOption();

      if (query.length < 2) {
        this.clearResults();
        return;
      }

      this.results.replaceChildren();
      this.results.hidden = true;
      this.results.setAttribute('aria-busy', 'true');
      this.input.setAttribute('aria-expanded', 'false');
      if (this.status) this.status.textContent = this.dataset.loadingText || '';
      this.searchTimer = window.setTimeout(() => this.fetchResults(query), 200);
    }

    async fetchResults(query) {
      this.requestController?.abort();
      const requestController = new AbortController();
      this.requestController = requestController;

      try {
        const endpoint = new URL(this.dataset.predictiveSearchUrl, window.location.origin);
        endpoint.pathname = `${endpoint.pathname.replace(/\/$/, '')}.json`;
        endpoint.searchParams.set('q', query);
        endpoint.searchParams.set('resources[type]', 'product,collection,page,article');
        endpoint.searchParams.set('resources[limit]', '8');
        endpoint.searchParams.set('resources[limit_scope]', 'all');
        endpoint.searchParams.set('resources[options][unavailable_products]', 'last');

        const response = await fetch(endpoint.toString(), {
          headers: { Accept: 'application/json' },
          signal: requestController.signal,
        });
        if (!response.ok) throw new Error(`Predictive search failed: ${response.status}`);

        const payload = await response.json();
        if (this.input.value.trim() !== query) return;
        this.renderResults(payload.resources?.results || {}, query);
      } catch (error) {
        if (error.name === 'AbortError') return;
        if (this.input.value.trim() === query) this.renderResults({}, query);
      } finally {
        if (this.requestController === requestController && this.input.value.trim() === query) {
          this.results.setAttribute('aria-busy', 'false');
          this.requestController = null;
        }
      }
    }

    renderResults(resultGroups, query) {
      const fragment = document.createDocumentFragment();
      let optionIndex = 0;
      let resultCount = 0;
      const groups = [
        ['products', this.dataset.productsHeading],
        ['collections', this.dataset.collectionsHeading],
        ['articles', this.dataset.articlesHeading],
        ['pages', this.dataset.pagesHeading],
      ];

      groups.forEach(([type, heading]) => {
        const items = Array.isArray(resultGroups[type]) ? resultGroups[type] : [];
        if (items.length === 0) return;

        const group = document.createElement('section');
        const headingElement = document.createElement('h2');
        const list = document.createElement('div');
        const headingId = `${this.results.id}-${type}-heading`;
        group.className = `predictive-search__group predictive-search__group--${type}`;
        group.setAttribute('role', 'group');
        group.setAttribute('aria-labelledby', headingId);
        headingElement.id = headingId;
        headingElement.className = 'predictive-search__group-title eyebrow';
        // Inside a listbox only option and group fit: the title names the group via aria-labelledby
        // and does not expose its own role (WAI-ARIA 1.2).
        headingElement.setAttribute('role', 'presentation');
        headingElement.textContent = heading || '';
        list.className = 'predictive-search__list';

        items.forEach((item) => {
          const option = type === 'products'
            ? this.createProductResult(item)
            : this.createTextResult(item, heading);
          option.id = `${this.results.id}-option-${optionIndex}`;
          option.setAttribute('role', 'option');
          option.setAttribute('aria-selected', 'false');
          option.tabIndex = -1;
          list.append(option);
          optionIndex += 1;
          resultCount += 1;
        });

        group.append(headingElement, list);
        fragment.append(group);
      });

      // The empty state and "View all" are not options: they go at the foot of the panel, outside
      // the listbox, so it contains only option and group (axe aria-required-children).
      const footer = document.createDocumentFragment();
      if (resultCount === 0) {
        const empty = document.createElement('p');
        empty.className = 'predictive-search__empty';
        empty.textContent = this.dataset.noResultsText || '';
        footer.append(empty);
      }

      const viewAll = document.createElement('a');
      viewAll.className = 'predictive-search__view-all button button--secondary';
      viewAll.href = this.createSearchUrl(query);
      viewAll.textContent = (this.dataset.viewAllTemplate || '').replace('[terms]', query);
      footer.append(viewAll);

      this.results.replaceChildren(fragment);
      if (this.footer) {
        this.footer.replaceChildren(footer);
        this.footer.hidden = false;
        this.results.hidden = resultCount === 0;
      } else {
        this.results.append(footer);
        this.results.hidden = false;
      }
      this.collectOptions();
      this.updateComboboxState();
      if (this.status) this.status.textContent = this.getResultsCountText(resultCount);
    }

    createProductResult(product) {
      const link = this.createResultLink(product.url, 'predictive-search__result predictive-search__result--product');
      const media = document.createElement('span');
      const imageUrl = product.featured_image?.url || product.image;
      media.className = 'predictive-search__media';

      if (imageUrl) {
        const image = document.createElement('img');
        // The suggestions API returns the original URL (1800px or more). Shopify's CDN serves any
        // width with ?width=: the 1x, 2x and 3x densities of a 72px thumbnail are requested instead
        // of downloading the whole original.
        const sizedUrl = (width) => {
          try {
            const url = new URL(imageUrl, window.location.origin);
            url.searchParams.set('width', String(width));
            return url.toString();
          } catch {
            return imageUrl;
          }
        };
        image.src = sizedUrl(144);
        image.srcset = [72, 144, 216].map((width) => `${sizedUrl(width)} ${width}w`).join(', ');
        image.sizes = '72px';
        image.alt = product.featured_image?.alt || '';
        image.loading = 'lazy';
        image.width = 72;
        image.height = 90;
        media.append(image);
      }

      const details = document.createElement('span');
      const title = document.createElement('span');
      const priceRow = document.createElement('span');
      const currentPrice = Number.parseFloat(product.price);
      const compareAtPrice = Number.parseFloat(product.compare_at_price_min || product.compare_at_price_max || 0);
      details.className = 'predictive-search__details';
      title.className = 'predictive-search__result-title';
      title.textContent = product.title || '';
      priceRow.className = 'predictive-search__price';

      // aria-label is not allowed on <s> (deletion role) and the reduced price had no label: they
      // are announced with visually hidden text, the same as price.liquid.
      const onSale = Number.isFinite(compareAtPrice) && compareAtPrice > currentPrice;
      const srLabel = (text) => {
        const label = document.createElement('span');
        label.className = 'visually-hidden';
        label.textContent = `${text} `;
        return label;
      };
      if (Number.isFinite(currentPrice)) {
        const price = document.createElement('span');
        if (onSale && this.dataset.salePriceText) price.append(srLabel(this.dataset.salePriceText));
        price.append(formatMoney(Math.round(currentPrice * 100), this.dataset.moneyFormat));
        priceRow.append(price);
      }
      if (onSale) {
        const regularPrice = document.createElement('s');
        if (this.dataset.regularPriceText) regularPrice.append(srLabel(this.dataset.regularPriceText));
        regularPrice.append(formatMoney(Math.round(compareAtPrice * 100), this.dataset.moneyFormat));
        priceRow.append(regularPrice);
      }

      const availability = document.createElement('span');
      availability.className = 'predictive-search__availability';
      availability.toggleAttribute('data-sold-out', product.available === false);
      availability.textContent = product.available === false
        ? this.dataset.soldOutText || ''
        : this.dataset.inStockText || '';
      details.append(title, priceRow, availability);
      link.append(media, details);
      return link;
    }

    createTextResult(item, heading) {
      const link = this.createResultLink(item.url, 'predictive-search__result predictive-search__result--text');
      const typeLabel = document.createElement('span');
      const title = document.createElement('span');
      typeLabel.className = 'predictive-search__result-type eyebrow';
      typeLabel.textContent = heading || '';
      title.className = 'predictive-search__result-title';
      title.textContent = item.title || '';
      link.append(typeLabel, title);
      return link;
    }

    createResultLink(url, className) {
      const link = document.createElement('a');
      link.className = className;
      try {
        const resultUrl = new URL(url, window.location.origin);
        link.href = resultUrl.origin === window.location.origin ? resultUrl.href : this.dataset.searchUrl;
      } catch (_error) {
        link.href = this.dataset.searchUrl;
      }
      return link;
    }

    createSearchUrl(query) {
      const url = new URL(this.dataset.searchUrl, window.location.origin);
      url.searchParams.set('q', query);
      url.searchParams.set('type', 'product,collection,page,article');
      url.searchParams.set('options[prefix]', 'last');
      return url.toString();
    }

    getResultsCountText(count) {
      if (count === 1) return this.dataset.resultsCountOne || '';
      return (this.dataset.resultsCountOther || '').replace('[count]', String(count));
    }

    handleInputKeydown(event) {
      if (event.isComposing || this.options.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.setActiveOption(this.activeIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.setActiveOption(this.activeIndex - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        this.setActiveOption(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        this.setActiveOption(this.options.length - 1);
      } else if (event.key === 'Enter' && this.activeIndex >= 0) {
        event.preventDefault();
        this.options[this.activeIndex].click();
      }
    }

    setActiveOption(index) {
      if (this.options.length === 0 || index < 0) index = this.options.length - 1;
      if (index >= this.options.length) index = 0;

      this.options.forEach((option, optionIndex) => {
        option.setAttribute('aria-selected', String(optionIndex === index));
      });
      this.activeIndex = index;
      const activeOption = this.options[index];
      if (!activeOption) return;
      this.input.setAttribute('aria-activedescendant', activeOption.id);
      activeOption.scrollIntoView({ block: 'nearest' });
    }

    collectOptions() {
      this.options = this.results.hidden ? [] : Array.from(this.results.querySelectorAll('[role="option"]'));
      this.options.forEach((option) => option.setAttribute('aria-selected', 'false'));
      this.activeIndex = -1;
      this.input?.removeAttribute('aria-activedescendant');
    }

    resetActiveOption() {
      this.options.forEach((option) => option.setAttribute('aria-selected', 'false'));
      this.options = [];
      this.activeIndex = -1;
      this.input?.removeAttribute('aria-activedescendant');
    }

    updateComboboxState() {
      if (!this.input) return;
      this.input.setAttribute('aria-expanded', String(this.isOpen && !this.results.hidden));
    }

    clearSearch() {
      this.input.value = '';
      if (this.clearButton) this.clearButton.hidden = true;
      this.requestController?.abort();
      window.clearTimeout(this.searchTimer);
      this.clearResults();
      this.input.focus();
    }

    clearResults() {
      this.resetActiveOption();
      this.results.replaceChildren();
      this.results.hidden = true;
      this.results.setAttribute('aria-busy', 'false');
      this.input.setAttribute('aria-expanded', 'false');
      if (this.status) this.status.textContent = '';
      this.clearFooter();
    }

    clearFooter() {
      if (!this.footer) return;
      this.footer.replaceChildren();
      this.footer.hidden = true;
    }

    applyBackgroundInert() {
      this.restoreBackgroundInert();
      let currentElement = this;

      while (currentElement.parentElement) {
        const parentElement = currentElement.parentElement;
        Array.from(parentElement.children).forEach((sibling) => {
          if (sibling === currentElement || sibling.contains(this)) return;
          this.managedInertElements.push({
            element: sibling,
            wasInert: sibling.hasAttribute('inert'),
          });
          sibling.setAttribute('inert', '');
        });
        if (parentElement === document.body) break;
        currentElement = parentElement;
      }
    }

    restoreBackgroundInert() {
      this.managedInertElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
      });
      this.managedInertElements = [];
    }
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reflectReducedMotion = ({ matches }) => {
    if (matches) {
      document.documentElement.dataset.reducedMotion = 'true';
    } else {
      delete document.documentElement.dataset.reducedMotion;
    }
  };

  reflectReducedMotion(reducedMotionQuery);
  reducedMotionQuery.addEventListener?.('change', reflectReducedMotion);

  // product-zoom.js is loaded separately, only on the product page, and extends these pieces
  // instead of copying them.
  window.ThemeCore = {
    initialized: true,
    ThemeElement,
    trapFocus,
    getFocusableElements,
    syncDialogScrollLocks,
  };

  if (!customElements.get('theme-disclosure')) {
    customElements.define('theme-disclosure', ThemeDisclosure);
  }

  if (!customElements.get('theme-drawer')) {
    customElements.define('theme-drawer', ThemeDrawer);
  }

  if (!customElements.get('variant-selects')) {
    customElements.define('variant-selects', VariantSelects);
  }

  if (!customElements.get('product-inventory')) {
    customElements.define('product-inventory', ProductInventory);
  }

  rememberViewedProduct();
  if (!customElements.get('recently-viewed')) {
    customElements.define('recently-viewed', RecentlyViewed);
  }

  if (!customElements.get('product-gallery')) {
    customElements.define('product-gallery', ProductGallery);
  }

  if (!customElements.get('sticky-cart-bar')) {
    customElements.define('sticky-cart-bar', StickyCartBar);
  }

  if (!customElements.get('size-guide-modal')) {
    customElements.define('size-guide-modal', SizeGuideModal);
  }

  if (!customElements.get('gift-card-recipient')) {
    customElements.define('gift-card-recipient', GiftCardRecipient);
  }

  if (!customElements.get('pickup-availability')) {
    customElements.define('pickup-availability', PickupAvailability);
  }

  if (!customElements.get('product-recommendations')) {
    customElements.define('product-recommendations', ProductRecommendations);
  }

  if (!customElements.get('cart-drawer')) {
    customElements.define('cart-drawer', CartDrawer);
  }

  if (!customElements.get('product-card-variants')) {
    customElements.define('product-card-variants', ProductCardVariants);
  }

  if (!customElements.get('facet-filters-form')) {
    customElements.define('facet-filters-form', FacetFiltersForm);
  }

  if (!customElements.get('editorial-lookbook')) {
    customElements.define('editorial-lookbook', EditorialLookbook);
  }

  if (!customElements.get('editorial-hero')) {
    customElements.define('editorial-hero', EditorialHero);
  }

  if (!customElements.get('complete-the-look')) {
    customElements.define('complete-the-look', CompleteTheLook);
  }

  if (!customElements.get('curated-showcase')) {
    customElements.define('curated-showcase', CuratedShowcase);
  }

  if (!customElements.get('marquee-banner')) {
    customElements.define('marquee-banner', MarqueeBanner);
  }

  if (!customElements.get('announcement-bar')) {
    customElements.define('announcement-bar', AnnouncementBar);
  }

  if (!customElements.get('faq-accordion')) {
    customElements.define('faq-accordion', FaqAccordion);
  }

  if (!customElements.get('anchor-nav')) {
    customElements.define('anchor-nav', AnchorNav);
  }

  // docs-only:start
  if (!customElements.get('copy-text')) {
    customElements.define('copy-text', CopyText);
  }
  // docs-only:end

  if (!customElements.get('faq-filter')) {
    customElements.define('faq-filter', FaqFilter);
  }

  if (!customElements.get('password-modal')) {
    customElements.define('password-modal', PasswordModal);
  }

  if (!customElements.get('localization-form')) {
    customElements.define('localization-form', LocalizationForm);
  }

  if (!customElements.get('predictive-search')) {
    customElements.define('predictive-search', PredictiveSearch);
  }

  // ---------------------------------------------------------------------------
  // Scroll reveal engine.
  //
  // Golden rule: content is born visible. CSS only hides a pending element when <html> carries
  // data-reveal-ready, and this code only sets that attribute if IntersectionObserver exists, the
  // merchant did not choose animations: none and the visitor did not ask to reduce motion. Without
  // JS, with broken JS or in any of those three cases, the store reads in full and not a single
  // element is hidden.
  //
  // This code does NOT know which engine animates, and must not. It only distributes choreography:
  // it marks with data-reveal="" what still has to enter, publishes its --reveal-index, sets
  // data-revealed on crossing the entry line and closes with data-reveal="done" when the gesture
  // ends. Whether the CSS scroll-driven animation or the fallback transition animates is decided by
  // the base.css cascade, and only by it: duplicating that logic in two languages is exactly what
  // is avoided.
  //
  // The editorial hero never enters: it is the LCP, and animating it costs the performance score
  // that store review looks at first.
  // ---------------------------------------------------------------------------
  const REVEAL_TARGETS = [
    // Homepage section headings. They go first because they intersect before their grids, so the
    // title announces and the cards respond. Page headings (collection, search, blog, listing) are
    // deliberately left out: they are the h1 and are above the fold; hiding them even for 680ms
    // delays primary content.
    '.lookbook__header',
    '.curated-showcase__header',
    '.complete-the-look__header',
    '.bento-discovery__header',
    '.product-recommendations__header',
    '.brand-manifesto__statement',
    // Content
    '.product-grid__item',
    '.bento-discovery__item',
    '.brand-manifesto__detail',
    '.brand-manifesto__media',
    '.complete-the-look__item',
    '.complete-the-look__media',
    '.curated-showcase__spotlight',
    '.lookbook__media',
    // The real wrapper in newsletter.liquid is .newsletter-section__inner; targeting that class is
    // what gives the section its entrance.
    '.newsletter-section__inner',
    // Brand story. The panel's TEXT enters, never its image: on that page the first block's
    // photograph is the LCP, and hiding it even for half a second is exactly what the motion golden
    // rule forbids.
    '.main-about__story-text',
    '.main-about__quote',
    '.main-about__value',
    '.main-about__gallery-item',
    // Standard sections. Cards, text and image enter; the slideshow and video are left out because
    // they are usually the first screen and their media already has its own motion.
    '.std-section__header',
    '.collection-list__card',
    '.blog-posts__card',
    '.rich-text__content',
    '.image-text__copy',
    '.image-text__media',
  ].join(', ');

  // Stagger cap. Without it, a grid of 40 products would take more than two seconds to finish
  // entering and the stagger would stop reading as rhythm.
  const REVEAL_STAGGER_CAP = 7;

  // Floor of the settle line, in % of the viewport. If the tokens lengthen the travel beyond what
  // fits (distance + 7 steps >= 94), the line falls to 0 or below: the settle observer's rootMargin
  // reaches -100%, its root box collapses and it never fires, so nothing would settle and every
  // element would undo itself on scrolling back up. 10% leaves a 70-100px band: even the lowest
  // target crosses it in a 60fps fling and it stays far from the collapse. A travel that does not
  // fit is cut off there, and the reveal transition finishes it as a fade: the worst case is a soft
  // close, not a lost element.
  const SETTLE_LINE_MIN = 10;

  const initScrollReveal = () => {
    const root = document.documentElement;
    if (!('IntersectionObserver' in window)) return;
    if (root.dataset.animations === 'none') return;
    if (reducedMotionQuery.matches) return;

    root.dataset.revealReady = 'true';

    // The two observation lines come from the base.css tokens, which are their only source: not a
    // single design number is repeated here. The settle line falls where the longest range an
    // element can travel ends (distance + stagger cap), so settling never cuts a gesture in
    // progress. With the default values: 100 - 6 - (32 + 7 x 4) = 34.
    const tokens = getComputedStyle(root);
    const token = (name, fallback) => {
      const value = parseFloat(tokens.getPropertyValue(name));
      return Number.isFinite(value) ? value : fallback;
    };
    const enterInset = token('--scroll-enter-inset', 6);
    const revealRange = token('--scroll-reveal-distance', 32)
      + REVEAL_STAGGER_CAP * token('--scroll-reveal-stagger', 4);
    const settleLine = Math.max(SETTLE_LINE_MIN, 100 - enterInset - revealRange);

    const pending = () => document.querySelectorAll('[data-reveal=""]');

    // Settling is closing: the element is fixed, visible, and leaves both observers. opacity is
    // moved, never visibility, so as not to alter the accessibility tree or the tab order while the
    // gesture runs.
    const settle = (node) => {
      node.dataset.reveal = 'done';
      node.setAttribute('data-revealed', '');
      enter.unobserve(node);
      settler.unobserve(node);
    };

    // End of travel: there is no scroll left ahead. This holds for a page that does not scroll
    // (short template, editor preview, empty state) and for a visitor who has touched the bottom.
    // There no scroll will come to reveal anything: the view timeline is inactive (or no longer
    // advances) and the fallback needs the element to cross the line.
    //
    // It is measured against offsetHeight (the LAYOUT height of <html>) and not against
    // scrollHeight: the hidden state shifts each pending element down with translateY, and when the
    // pending element is the last thing on the page that shift overflows the document and
    // fabricates up to 64px of scroll that did not exist (measured: 732px of layout, 785 of
    // scrollHeight). With scrollHeight a short page would seem to scroll because of the very
    // element being rescued and would never settle. On a page with a footer, both measures
    // coincide. Three numeric reads; the DOM is only queried when it is true.
    const atEnd = () => window.innerHeight + window.scrollY >= root.offsetHeight - 2;
    const settlePending = () => {
      if (!atEnd()) return;
      pending().forEach((node) => settle(node));
    };

    // Entry line. Decorates ONLY what is not visible yet: what is below the fold, or what has no
    // box (a tab panel with display: none, which will enter when the visitor opens it). What is
    // visible is released untouched, so not a single frame is hidden. What is already decorated
    // receives data-revealed as soon as it enters.
    const enter = new IntersectionObserver((entries) => {
      // One read per batch and BEFORE writing attributes: the observer has just measured, so layout
      // is clean and offsetHeight forces nothing. On a page that does not scroll the entry band IS
      // the view: whatever falls there is released without decorating, like what is visible.
      // Decorating it and settling it later would be too late: data-reveal="" is not fulfilled
      // without scroll, and the reveal rules' opacity: 0 would leave the element invisible on
      // screen.
      const ended = atEnd();

      entries.forEach((entry) => {
        const node = entry.target;

        if (entry.isIntersecting) {
          if (node.dataset.reveal === '') node.setAttribute('data-revealed', '');
          enter.unobserve(node);
          return;
        }

        if (node.hasAttribute('data-reveal')) return;

        const box = entry.boundingClientRect;
        const below = box.top >= (entry.rootBounds ? entry.rootBounds.bottom : window.innerHeight);
        const unlaid = box.width === 0 && box.height === 0;
        if ((!below && !unlaid) || ended) {
          enter.unobserve(node);
          return;
        }

        node.setAttribute('data-reveal', '');
        settler.observe(node);
      });
    }, {
      // The token's inset: the element starts when it truly enters the field of view, without
      // anticipating from outside the fold. 0.05: a peek is enough to trigger, so a tall element
      // does not wait to be half visible.
      rootMargin: `0px 0px -${enterInset}% 0px`,
      threshold: 0.05,
    });

    // Settle line: the choreography ended and the element is fixed. Only once.
    const settler = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.dataset.reveal === '') settle(entry.target);
      });
    }, {
      rootMargin: `0px 0px -${100 - settleLine}% 0px`,
      threshold: 0,
    });

    const register = (scope) => {
      const seen = new Map();

      scope.querySelectorAll(REVEAL_TARGETS).forEach((node) => {
        // Note: this guard means a data-reveal written by hand in the Liquid NEVER reaches the
        // observer, and the CSS would leave it hidden forever. Targets are declared above, in
        // REVEAL_TARGETS, not in the sections. The editorial hero is left out of the generic
        // reveal: it has its own entrance, without attributes.
        if (node.hasAttribute('data-reveal') || node.closest('.hero-editorial')) return;

        // The index is counted among siblings, so each grid staggers on its own instead of
        // inheriting the count of the previous section.
        const parent = node.parentElement;
        const index = seen.get(parent) ?? 0;
        seen.set(parent, index + 1);

        node.style.setProperty('--reveal-index', String(Math.min(index, REVEAL_STAGGER_CAP)));
        enter.observe(node);
      });
    };

    // WCAG 2.4.7 and 2.4.11: focus cannot land on something half revealed. The focus container is
    // settled and so is whatever covers it, because the lookbook's hotspot triggers are SIBLINGS of
    // .lookbook__media, not children: without the overlapping-boxes test a focused hotspot would
    // float over a still-clipped photo.
    document.addEventListener('focusin', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const rect = target.getBoundingClientRect();

      pending().forEach((node) => {
        if (node.contains(target)) {
          settle(node);
          return;
        }

        // What CONTAINS the focus is discarded: the skip link focuses <main>, and settling its
        // container would reveal the whole page at once.
        if (target.contains(node)) return;

        const box = node.getBoundingClientRect();
        const overlaps = box.top < rect.bottom
          && box.bottom > rect.top
          && box.left < rect.right
          && box.right > rect.left;
        if (overlaps) settle(node);
      });
    });

    // End-of-page guard. On a short page the range may never complete and the element would stay
    // halfway: on touching the end, whatever is pending is settled.
    window.addEventListener('scroll', settlePending, { passive: true });

    // The same guard when geometry changes, because scroll does not arrive if the page stopped
    // scrolling: the theme editor switches viewport, mobile rotates, the editor removes a section.
    // <html> is observed and not window: its box follows the viewport when the page is short
    // (min-height: 100% in base.css) and the content when it is long, so a single observation
    // covers both sides that decide whether there is travel. The callback runs after layout, so
    // offsetHeight forces nothing. What settles here was hidden below the fold: it appears as a
    // fade, never a flicker.
    if ('ResizeObserver' in window) {
      new ResizeObserver(settlePending).observe(root);
    } else {
      window.addEventListener('resize', settlePending, { passive: true });
    }

    register(document);
    // The theme editor replaces entire sections: what enters must also enter, and what leaves stops
    // being observed so as not to retain discarded nodes.
    document.addEventListener('shopify:section:load', (event) => register(event.target));
    document.addEventListener('shopify:section:unload', (event) => {
      event.target.querySelectorAll('[data-reveal]').forEach((node) => {
        enter.unobserve(node);
        settler.unobserve(node);
      });
    });
  };

  // ---------------------------------------------------------------------------
  // Condensed header on scroll down. It only writes when the state changes, so the passive listener
  // does not touch the DOM on the vast majority of scroll events.
  //
  // The header is sticky (declared by header.liquid on its section). Its real height is also
  // published here in --header-offset, which scroll-padding uses (anchors and keyboard focus never
  // end up under the header, WCAG 2.4.11) and the sticky columns of product, collection and
  // documentation. If the section is not sticky (no support or no JS) the offset is 0 and nothing
  // moves.
  // ---------------------------------------------------------------------------
  const initHeaderScrollState = () => {
    let header = null;
    let scrolled = null;
    let offset = null;

    const sync = () => {
      const next = window.scrollY > 40;
      if (!header || next === scrolled) return;
      scrolled = next;
      header.toggleAttribute('data-header-scrolled', next);
    };

    const publishOffset = () => {
      const stickyBox = header?.parentElement;
      const isSticky = stickyBox && getComputedStyle(stickyBox).position === 'sticky';
      const next = isSticky ? Math.round(stickyBox.getBoundingClientRect().height) : 0;
      if (next === offset) return;
      offset = next;
      document.documentElement.style.setProperty('--header-offset', `${next}px`);
    };

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(publishOffset) : null;

    const bind = () => {
      resizeObserver?.disconnect();
      header = document.querySelector('.site-header');
      scrolled = null;
      if (!header) return;
      if (header.parentElement) resizeObserver?.observe(header.parentElement);
      publishOffset();
      sync();
    };

    bind();
    window.addEventListener('scroll', sync, { passive: true });
    if (!resizeObserver) window.addEventListener('resize', publishOffset, { passive: true });
    // The theme editor replaces the whole section when a setting changes: without re-binding, the
    // attribute and the measurement would be applied to a node that is no longer on the page.
    document.addEventListener('shopify:section:load', (event) => {
      if (event.target.querySelector?.('.site-header')) bind();
    });
  };

  // ---------------------------------------------------------------------------
  // Cart quantity stepper (minus / plus).
  //
  // Delegated on document, not bound to each button: the drawer replaces its entire content on
  // every mutation, so there is no node to attach a listener to that survives the re-render.
  //
  // The button does NOT call changeLine: it writes the value and emits a 'change' on the field,
  // which is exactly what a visitor does when typing. From then on the already hardened path takes
  // over and a single implementation serves both surfaces:
  // - In the drawer, handleDrawerChange picks it up -> validation -> changeLine(), with the
  // per-mutation revision that discards overtaken responses.
  // - On the cart page, which is a form without JavaScript, the field is left edited awaiting
  // "Update cart", as if it had been typed.
  // ---------------------------------------------------------------------------
  const readQuantityRules = (input) => {
    const step = Math.abs(Number(input.getAttribute('step'))) || 1;
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));
    const rules = {
      step,
      min: Number.isFinite(min) ? min : 0,
      max: input.getAttribute('max') === null || !Number.isFinite(max) ? Infinity : max,
    };
    // Reachable ceiling on the grid; never below min, so with max < min the field stays at min and
    // both buttons turn off.
    rules.maxOnGrid = Math.max(rules.min, quantityGridMax(rules.min, step, rules.max));
    return rules;
  };

  // The only point that brings a hand-typed number to the nearest valid step (ties round down)
  // within [min, maxOnGrid]; see snapQuantity. It is called by document's 'change' and, before
  // deciding what to send, by the cart drawer, which listens on its own element and therefore
  // receives the event first. It is idempotent.
  const snapQuantityField = (input) => {
    // On a cart line, 0 is the command to remove it: it is respected as is, so the field shows what
    // is sent (the cart page form is novalidate).
    if (input.matches('[data-cart-quantity]') && input.value === '0') return;
    const { step, min, maxOnGrid } = readQuantityRules(input);
    // Empty field: it only rises to min if min > 0 (in the cart, min 0 leaves it).
    const current = Number(input.value);
    if (input.value.trim() === '') {
      if (current < min) input.value = String(min);
    } else if (Number.isFinite(current)) {
      const snapped = String(snapQuantity(current, min, step, maxOnGrid));
      if (snapped !== input.value) input.value = snapped;
    }
  };

  // Shopify does not accept any integer: valid values are min + n * increment. A field with min 2
  // and increment 2 cannot pass through 5, so the button moves along that grid instead of adding
  // and subtracting blindly. With floor going up and ceil going down, an off-grid value (typed by
  // hand) lands on the correct step.
  const nextQuantity = (input, direction) => {
    const { step, min, maxOnGrid } = readQuantityRules(input);
    const current = Number(input.value);
    const base = Number.isFinite(current) ? current : min;
    const offset = (base - min) / step;
    const index = direction > 0 ? Math.floor(offset) : Math.ceil(offset);
    return Math.min(maxOnGrid, Math.max(min, min + (index + direction) * step));
  };

  // A button is turned off exactly when pressing it would change nothing. Comparing against the
  // real jump, and not against bare min or max, is what keeps the state consistent even when the
  // value is off-grid.
  const syncQuantityStepper = (stepper) => {
    const input = stepper.querySelector('[data-quantity-input]');
    if (!input) return;

    const { min } = readQuantityRules(input);
    const current = Number(input.value);
    const value = Number.isFinite(current) ? current : min;

    stepper.querySelectorAll('[data-quantity-button]').forEach((button) => {
      const direction = button.dataset.quantityButton === 'increase' ? 1 : -1;
      const atLimit = nextQuantity(input, direction) === value;
      // While the drawer holds the button for a mutation (wasDisabled), the limit is saved for when
      // it releases it and the button stays inactive: the 'change' fired by the mutation itself
      // cannot reactivate it midway.
      if (button.dataset.wasDisabled !== undefined) {
        button.dataset.wasDisabled = String(atLimit);
        return;
      }
      button.disabled = atLimit;
    });
  };

  const initQuantitySteppers = () => {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-quantity-button]');
      if (!button || button.disabled) return;

      const stepper = button.closest('[data-quantity-stepper]');
      const input = stepper?.querySelector('[data-quantity-input]');
      if (!input) return;

      const direction = button.dataset.quantityButton === 'increase' ? 1 : -1;
      const next = nextQuantity(input, direction);
      if (String(next) === input.value) return;

      // It is noted BEFORE syncing: disabling a focused element makes the browser blur it
      // immediately, so afterwards there is no way to know whether focus was here. This order was
      // discovered by the minimum test, not by reading.
      const hadFocus = document.activeElement === button;

      input.value = String(next);
      syncQuantityStepper(stepper);

      // If the button just pressed reaches the limit and turns off, focus would fall to body: it is
      // passed to the sibling, which is the only move the keyboard has left.
      if (hadFocus && button.disabled) {
        stepper.querySelector('[data-quantity-button]:not([disabled])')?.focus();
      }

      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // The server already emits the correct state on every render; this covers what the server does
    // not see: the number the visitor types by hand ('input') and, on the product page, the
    // quantity grid that changes when another variant is chosen ('change', emitted by
    // updateQuantityRules).
    ['input', 'change'].forEach((type) => {
      document.addEventListener(type, (event) => {
        const input = event.target.closest?.('[data-quantity-input]');
        if (input && type === 'change') snapQuantityField(input);
        const stepper = event.target.closest?.('[data-quantity-stepper]');
        if (stepper) syncQuantityStepper(stepper);
      });
    });

    document.querySelectorAll('[data-quantity-stepper]').forEach(syncQuantityStepper);
  };

  // ---------------------------------------------------------------------------
  // Focus on the result of a just-submitted form.
  //
  // Shopify's native forms (contact, support, comments, password) reload the whole page on submit.
  // Focus returns to the top of the document and the live region announces nothing, because it does
  // not change after load: the visitor neither hears nor sees the result of what was just sent. The
  // markup already carried tabindex="-1" on those messages, waiting for exactly this.
  // ---------------------------------------------------------------------------
  const initFormMessageFocus = () => {
    const message = document.querySelector('.form-message[tabindex="-1"]');
    if (!message) return;

    // One frame of margin: focus moves when the page is already composed, not in the middle of the
    // first paint, which is when the browser can still readjust the scroll.
    requestAnimationFrame(() => {
      if (message.isConnected) message.focus();
    });
  };

  // The @view-transition rule in base.css only makes sense between theme pages. Towards checkout,
  // which does not participate, the browser aborts the transition and leaves an uncaught
  // InvalidStateError in the destination's console.
  window.addEventListener('pageswap', (event) => {
    if (!event.viewTransition) return;
    const url = event.activation?.entry?.url;
    const path = url ? new URL(url).pathname : '';
    if (!url || /^\/(checkouts?|cart\/c)\//.test(path)) event.viewTransition.skipTransition();
  });

  // The controls of the 3D viewer come from an external stylesheet. It is added here, once per
  // page and only when a viewer exists, so that it never blocks the first render (the markup keeps
  // a <noscript> copy for visitors without JavaScript).
  const initModelViewerStyles = () => {
    if (!document.querySelector('model-viewer') || document.getElementById('ModelViewerUIStyles')) return;
    const link = document.createElement('link');
    link.id = 'ModelViewerUIStyles';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css';
    document.head.append(link);
  };
  // The theme editor can add a section with a 3D model after the page has loaded.
  document.addEventListener('shopify:section:load', initModelViewerStyles);

  // The media strip of the featured product is only a scrolling region on narrow screens. The
  // markup keeps tabindex="0" so that it can be scrolled with the keyboard when JavaScript is
  // off; with JavaScript it stays in the tab order only while its content really overflows.
  const syncScrollableRegions = (root = document) => {
    if (typeof ResizeObserver === 'undefined') return;
    root.querySelectorAll('.featured-product__gallery[tabindex]').forEach((gallery) => {
      if (gallery.dataset.scrollWatch) return;
      gallery.dataset.scrollWatch = 'true';
      const sync = () => {
        if (gallery.scrollWidth > gallery.clientWidth) gallery.setAttribute('tabindex', '0');
        else gallery.removeAttribute('tabindex');
      };
      const observer = new ResizeObserver(sync);
      observer.observe(gallery);
      Array.from(gallery.children).forEach((child) => observer.observe(child));
      sync();
    });
  };
  document.addEventListener('shopify:section:load', (event) => syncScrollableRegions(event.target));

  initModelViewerStyles();
  syncScrollableRegions();
  initScrollReveal();
  initHeaderScrollState();
  initQuantitySteppers();
  initFormMessageFocus();
})();
