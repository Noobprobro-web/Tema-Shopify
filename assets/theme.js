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
  const DIALOGS_WITH_CLOSE = 'cart-drawer[data-open], size-guide-modal[data-open], pickup-availability[data-open], password-modal[data-open]';

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

  const syncDialogScrollLocks = () => {
    document.body.toggleAttribute('data-drawer-open', Boolean(document.querySelector('theme-drawer[data-open], cart-drawer[data-open]')));
    document.body.toggleAttribute('data-modal-open', Boolean(document.querySelector('size-guide-modal[data-open], pickup-availability[data-open], password-modal[data-open], predictive-search[data-open]')));
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
      this.listen(this, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen) return;
        event.preventDefault();
        event.stopPropagation();
        this.setOpen(false, true);
      });
    }

    get isOpen() {
      return this.trigger?.getAttribute('aria-expanded') === 'true';
    }

    setOpen(open, restoreFocus = false) {
      if (!this.trigger || !this.panel) return;

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
        if (event.target === this.overlay) this.setOpen(false, true);
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.setOpen(false, true);
      });
    }

    disconnectedCallback() {
      this.setOpen(false);
      super.disconnectedCallback();
    }

    get isOpen() {
      return this.trigger?.getAttribute('aria-expanded') === 'true';
    }

    setOpen(open, restoreFocus = false) {
      if (!this.trigger || !this.overlay || !this.panel) return;

      // Runs before this drawer touches body[data-drawer-open] or the inert background,
      // so a closing cart drawer cannot strip the state this one is about to set.
      if (open) closeOtherDialogs(this);

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
        if (restoreFocus) this.trigger.focus();
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
      if (this.dataset.layout !== 'thumbnails') return;

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

    selectMedia(mediaId, announce) {
      const selectedItem = this.items.find(
        (item) => String(item.dataset.productMediaId) === String(mediaId),
      );
      if (!selectedItem) return;

      this.items.forEach((item) => {
        const selected = item === selectedItem;
        item.hidden = !selected;
        item.toggleAttribute('data-selected', selected);
        if (!selected) item.querySelector('video')?.pause();
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
      this.variantData = this.getVariantData();

      if (this.variantData.length === 0) return;

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
          this.updateOptionAvailability();
          this.updateVariant();
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

      this.currentVariant = this.getInitialVariant();
      this.cachePurchaseOptionElements();
      this.updateSelectedOptionLabels();
      this.updateOptionAvailability();
      this.updatePurchaseOptions(this.currentVariant);
      this.updateForms(this.currentVariant);
      this.updatePrice(this.currentVariant);
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
      const variantId = this.querySelector('[data-variant-id]')?.value;
      return this.variantData.find((variant) => String(variant.id) === String(variantId))
        || this.variantData[0];
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

    updateOptionAvailability() {
      this.querySelectorAll('[data-option-position]').forEach((input) => {
        const optionIndex = Number(input.dataset.optionPosition) - 1;
        const isAvailable = this.variantData.some(
          (variant) => variant.available && variant.options[optionIndex] === input.value,
        );
        const unavailableLabel = this.querySelector(
          `label[for="${input.id}"] [data-unavailable-label]`,
        );

        input.disabled = !isAvailable;
        input.setAttribute('aria-disabled', String(!isAvailable));
        if (unavailableLabel) unavailableLabel.hidden = isAvailable;
      });
    }

    updateVariant() {
      const selectedOptions = this.getSelectedOptions();
      const variant = this.variantData.find(
        (candidate) =>
          candidate.options.length === selectedOptions.length &&
          candidate.options.every((option, index) => option === selectedOptions[index]),
      );

      this.currentVariant = variant;
      this.updatePurchaseOptions(variant);
      this.updateForms(variant);
      this.updatePrice(variant);
      this.updateQuantityRules(variant);
      this.updateMedia(variant);
      this.updateStatus(variant);
      this.updateUrl(variant);
      this.dispatchEvent(
        new CustomEvent('theme:variant-change', {
          bubbles: true,
          detail: { variant },
        }),
      );
      this.dispatchPurchaseOptionChange();
    }

    updatePurchaseSelection() {
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
      if (this.sellingPlanStatus) {
        if (subscriptionSelected) {
          this.sellingPlanStatus.textContent = `${selectedAllocation.name}: ${selectedAllocation.price}`;
        } else if (oneTimeAvailable) {
          this.sellingPlanStatus.textContent = `${this.dataset.oneTimeText}: ${variant.price}`;
        } else {
          this.sellingPlanStatus.textContent = this.dataset.sellingPlanUnavailableText;
        }
      }
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
      if (!this.sellingPlans) return true;
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

    updateForms(variant) {
      this.querySelectorAll('[data-variant-id]').forEach((input) => {
        const nextValue = variant?.id || '';
        const valueChanged = String(input.value) !== String(nextValue);
        input.value = nextValue;
        if (valueChanged) input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      const purchaseOptionValid = this.isPurchaseOptionValid(variant);
      this.querySelectorAll('[data-add-to-cart]').forEach((button) => {
        // Never re-enable a button whose form still has an add-to-cart request in flight.
        button.disabled = !purchaseOptionValid || button.form?.dataset.cartAddPending === 'true';
        const label = button.querySelector('[data-add-to-cart-text]');
        if (!label) return;

        if (!variant) {
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
    }

    updatePrice(variant) {
      const priceSource = this.currentAllocation || variant;
      const currentPrice = this.querySelector('[data-current-price]');
      const comparePrice = this.querySelector('[data-compare-price]');
      const saleBadge = this.querySelector('[data-sale-badge]');
      const soldOutBadge = this.querySelector('[data-sold-out-badge]');
      const unitPrice = this.querySelector('[data-unit-price]');

      if (currentPrice && priceSource) currentPrice.textContent = priceSource.price;

      if (comparePrice) {
        comparePrice.hidden = !priceSource?.compare_at_price;
        comparePrice.textContent = priceSource?.compare_at_price || '';
      }

      if (saleBadge) saleBadge.hidden = !priceSource?.compare_at_price;
      if (soldOutBadge) soldOutBadge.hidden = Boolean(variant?.available);

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
      const quantity = Number.parseInt(this.quantityInput.value, 10);
      const unitCents = Number(priceSource?.price_cents);

      const showTotal = priceSource?.price_cents != null
        && priceSource.price_cents !== ''
        && Number.isFinite(quantity)
        && quantity > 1
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
      if (!quantityInput || !variant) return;

      const before = [
        quantityInput.value,
        quantityInput.getAttribute('min'),
        quantityInput.getAttribute('step'),
        quantityInput.getAttribute('max'),
      ].join('|');

      quantityInput.min = variant.quantity_min;
      quantityInput.step = variant.quantity_increment;
      quantityInput.value = Math.max(Number(quantityInput.value), Number(variant.quantity_min));

      if (variant.quantity_max === null) {
        quantityInput.removeAttribute('max');
      } else {
        quantityInput.max = variant.quantity_max;
        quantityInput.value = Math.min(Number(quantityInput.value), Number(variant.quantity_max));
      }

      const after = [
        quantityInput.value,
        quantityInput.getAttribute('min'),
        quantityInput.getAttribute('step'),
        quantityInput.getAttribute('max'),
      ].join('|');

      // Cambiar de variante puede mover el minimo o el maximo, y con ellos la cantidad.
      // Nadie se enteraba: el total de linea lo calcula updatePrice(), que corre ANTES que
      // esto, asi que se quedaba anunciando la cantidad anterior; y el stepper no tenia
      // forma de saber que la rejilla habia cambiado bajo sus pies. Un 'change' avisa a
      // los dos por el mismo camino que usa el visitante al teclear.
      if (before !== after) quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    updateMedia(variant) {
      const productSection = this.closest('[data-section-id]');
      productSection?.querySelectorAll('[data-product-media-id]').forEach((media) => {
        media.toggleAttribute('data-selected', String(media.dataset.productMediaId) === String(variant?.featured_media_id));
      });
    }

    updateStatus(variant) {
      const status = this.querySelector('[data-variant-status]');
      if (!status) return;

      if (!variant) {
        status.textContent = this.dataset.unavailableText;
      } else if (!this.isPurchaseOptionValid(variant)) {
        status.textContent = this.dataset.sellingPlanUnavailableText;
      } else {
        const availability = variant.available
          ? this.dataset.availableStatus
          : this.dataset.soldOutStatus;
        status.textContent = `${variant.title}: ${availability}`;
      }
    }

    updateUrl(variant) {
      if (!variant || !this.dataset.productUrl) return;

      const url = new URL(this.dataset.productUrl, document.baseURI);
      url.searchParams.set('variant', variant.id);
      if (this.currentAllocation) {
        url.searchParams.set('selling_plan', this.currentAllocation.id);
      } else {
        url.searchParams.delete('selling_plan');
      }
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
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
      this.label = this.querySelector('[data-sticky-label]');
      this.spinner = this.querySelector('[data-loading-icon]');
      this.variantSelects = this.closest('[data-section-id]')?.querySelector('variant-selects');

      if (!this.productForm || !this.primaryButton || !this.submitButton) return;

      this.setVisible(false);
      this.listen(this.submitButton, 'click', () => {
        if (!this.submitButton.disabled) this.productForm.requestSubmit(this.primaryButton);
      });

      if (this.variantSelects) {
        this.listen(this.variantSelects, 'theme:variant-change', (event) => {
          this.updateVariant(event.detail?.variant);
        });
        this.listen(this.variantSelects, 'theme:purchase-option-change', (event) => {
          if (this.priceOutput) this.priceOutput.textContent = event.detail?.price || '';
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

      this.syncButtonState();
    }

    disconnectedCallback() {
      this.intersectionObserver?.disconnect();
      this.buttonObserver?.disconnect();
      this.setVisible(false);
      super.disconnectedCallback();
    }

    setVisible(visible) {
      this.toggleAttribute('data-visible', visible);
      this.setAttribute('aria-hidden', String(!visible));
      this.inert = !visible;
      document.body.toggleAttribute('data-sticky-cart-visible', visible);
    }

    updateVariant(variant) {
      if (this.variantOutput && !this.hasAttribute('data-single-variant')) {
        this.variantOutput.textContent = variant?.title || this.dataset.unavailableText;
      }
      if (this.priceOutput) this.priceOutput.textContent = variant?.price || '';
      this.syncButtonState();
    }

    syncButtonState() {
      if (!this.primaryButton || !this.submitButton) return;

      const busy = this.primaryButton.getAttribute('aria-busy') === 'true';
      const primaryLabel = this.primaryButton.querySelector('[data-add-to-cart-text]');
      this.submitButton.disabled = this.primaryButton.disabled;
      this.submitButton.setAttribute('aria-busy', String(busy));
      if (this.label && primaryLabel) this.label.textContent = primaryLabel.textContent.trim();
      if (this.spinner) this.spinner.hidden = !busy;
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
      document.body.setAttribute('data-modal-open', '');
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
      document.body.setAttribute('data-modal-open', '');
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
          { rootMargin: '0px 0px 300px 0px' },
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
      this.syncRevision = 0;
      this.renderedRevision = 0;
      this.syncAfterMutation = false;

      if (!this.overlay || !this.panel) return;

      this.setClosedState();
      this.listen(document, 'click', (event) => this.handleDocumentClick(event));
      this.listen(document, 'submit', (event) => this.handleAddSubmit(event));
      this.listen(this, 'click', (event) => this.handleDrawerClick(event));
      this.listen(this, 'change', (event) => this.handleDrawerChange(event));
      this.listen(this, 'input', (event) => {
        if (event.target.matches('textarea[name="note"]')) event.target.dataset.dirty = 'true';
      });
      this.listen(this.overlay, 'pointerdown', (event) => {
        if (event.target === this.overlay) this.close(true);
      });
      this.listen(document, 'keydown', (event) => {
        if (event.key !== 'Escape' || !this.isOpen || event.defaultPrevented) return;
        event.preventDefault();
        this.close(true);
      });
    }

    disconnectedCallback() {
      this.requestController?.abort();
      this.crossSellController?.abort();
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

      const crossSellButton = event.target.closest('[data-cross-sell-add]');
      if (crossSellButton) {
        this.addCrossSell(crossSellButton).catch((error) => {
          if (error.name === 'AbortError') return;
          this.showError(error.message);
          if (crossSellButton.isConnected) crossSellButton.focus();
        });
        return;
      }

      const removeButton = event.target.closest('[data-cart-remove]');
      if (!removeButton) return;

      this.changeLine(Number(removeButton.dataset.line), 0).catch((error) => {
        if (error.name === 'AbortError') return;
        this.showError(error.message);
      });
    }

    handleDrawerChange(event) {
      const quantityInput = event.target.closest('[data-cart-quantity]');
      if (!quantityInput) return;

      // An empty or malformed field used to fall through parseInt('') || 0 and silently
      // delete the line. Let the browser report it instead, and keep 0 as the one value
      // that is allowed to bypass min and remove the item on purpose.
      if (!quantityInput.checkValidity() && quantityInput.value !== '0') {
        quantityInput.reportValidity();
        return;
      }

      const quantity = Number(quantityInput.value);
      this.changeLine(Number(quantityInput.dataset.line), quantity).catch((error) => {
        // beginMutation() aborts an in-flight section read, so a superseded request must
        // stay silent instead of showing the browser's own English abort text.
        if (error.name === 'AbortError') return;
        this.showError(error.message);
      });
    }

    open(trigger = null) {
      if (this.isOpen || !this.isConnected) return;

      // Resolved before the other dialogs close: making a panel inert blurs whatever
      // inside it holds focus, and a cart opened from the mobile menu must hand focus
      // back to the menu trigger rather than to a link that is about to disappear.
      let returnTarget = trigger || document.activeElement;
      const sourceMenu = returnTarget?.closest?.('theme-drawer[data-open]');
      const menuTrigger = sourceMenu?.querySelector('[data-drawer-trigger]');
      if (menuTrigger) returnTarget = menuTrigger;

      closeOtherDialogs(this);

      this.returnFocusTarget = returnTarget;
      this.overlay.hidden = false;
      this.panel.inert = false;
      this.panel.setAttribute('aria-hidden', 'false');
      this.setAttribute('data-open', '');
      document.body.setAttribute('data-drawer-open', '');
      this.applyBackgroundInert();
      this.releaseFocusTrap = trapFocus(
        this.panel,
        this.querySelector('[data-cart-drawer-close]'),
      );
      this.syncCart().catch(() => {});
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

    async addItem(form, submitter) {
      // Blocks a second submit while the first is in flight, which otherwise buys the
      // item twice. Switching variant mid-request used to re-enable the button through
      // updateForms; that path now reads this flag and leaves it disabled.
      if (form.dataset.cartAddPending === 'true') return;
      form.dataset.cartAddPending = 'true';
      const revision = this.beginMutation();
      this.clearMessages(form);
      this.setFormBusy(form, submitter, true);

      try {
        const formData = new FormData(form);
        formData.set('sections', this.dataset.sectionId);
        formData.set('sections_url', `${window.location.pathname}${window.location.search}`);

        const response = await fetchCommerce(this.dataset.cartAddUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: formData,
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

        await this.renderCartResponse(result, revision);
        this.showStatus(this.dataset.addedMessage);
        this.open(submitter);
      } finally {
        delete form.dataset.cartAddPending;
        this.setFormBusy(form, submitter, false);
        // Re-applies the availability state of whatever variant is selected now, which
        // may not be the one this request was submitted for.
        const variants = form.closest('variant-selects');
        if (variants?.isConnected) variants.updateForms(variants.currentVariant);
        this.endMutation();
      }
    }

    async addCrossSell(button) {
      const variantId = Number(button.dataset.variantId);
      if (!variantId || button.disabled) return;

      const revision = this.beginMutation();
      this.clearMessages();
      this.setCrossSellBusy(button, true);
      this.setDrawerBusy(true);
      this.crossSellController?.abort();
      this.crossSellController = new AbortController();

      try {
        const response = await fetchCommerce(this.dataset.cartAddUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            items: [{ id: variantId, quantity: 1 }],
            sections: [this.dataset.sectionId],
            sections_url: `${window.location.pathname}${window.location.search}`,
          }),
          signal: this.crossSellController.signal,
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

        await this.renderCartResponse(result, revision);
        this.showStatus(this.dataset.addedMessage);

        const focusTarget = Array.from(this.querySelectorAll('[data-cross-sell-focus]')).find(
          (element) => Number(element.dataset.crossSellFocus) === variantId,
        );
        focusTarget?.focus({ preventScroll: true });
      } finally {
        this.setDrawerBusy(false);
        this.setCrossSellBusy(button, false);
        this.endMutation();
      }
    }

    async changeLine(line, quantity) {
      const revision = this.beginMutation();
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
            line,
            quantity,
            sections: [this.dataset.sectionId],
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

        await this.renderCartResponse(result, revision);
      } finally {
        this.setDrawerBusy(false);
        this.endMutation();
      }
    }

    // Returns the revision this mutation belongs to. Callers hand it back to
    // renderCartResponse so that a response overtaken by a newer mutation is dropped.
    beginMutation() {
      this.pendingMutations += 1;
      this.syncRevision += 1;
      this.requestController?.abort();
      return this.syncRevision;
    }

    endMutation() {
      this.pendingMutations = Math.max(0, this.pendingMutations - 1);
      if (this.pendingMutations) return;
      this.syncAfterMutation = false;
      // A mutation that rendered already brought back server-fresh HTML, so nothing is
      // left to fetch. Only an unrendered latest revision — a mutation that failed, was
      // aborted, or whose response lost the race to an older one — leaves the drawer
      // possibly stale and earns the extra request.
      if (this.renderedRevision === this.syncRevision) return;
      if (this.isConnected && this.isOpen) this.syncCart().catch(() => {});
    }

    // Always re-renders on open. Comparing item_count alone missed same-count changes:
    // a line swapped for another in a second tab, a price change, or edited properties.
    async syncCart() {
      if (this.pendingMutations) {
        this.syncAfterMutation = true;
        return;
      }
      const revision = this.syncRevision;
      const sectionHtml = await this.requestSection();
      if (!this.isConnected || revision !== this.syncRevision || this.pendingMutations) return;
      this.renderSection(sectionHtml);
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
      this.renderSection(sectionHtml);
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

      currentContent.replaceWith(nextContent);

      if (restoreFocus) {
        const restored = active?.id ? nextContent.querySelector(`#${CSS.escape(active.id)}`) : null;
        // El control puede volver deshabilitado desde el servidor: el boton mas se apaga
        // cuando la linea toca el tope de inventario, que el cliente no conoce. Un focus()
        // sobre un control deshabilitado no hace nada y el foco caeria al body, asi que se
        // busca primero el hermano utilizable del mismo stepper.
        const target = restored && !restored.disabled
          ? restored
          : restored?.closest('[data-quantity-stepper]')?.querySelector('[data-quantity-button]:not([disabled])');
        (target || this.querySelector('[data-cart-drawer-close]'))?.focus();
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

      this.updateHeaderCount();
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

        if (itemCount > 0 && !count) {
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

    setDrawerBusy(busy) {
      this.panel.setAttribute('aria-busy', String(busy));
      this.querySelectorAll('[data-cart-quantity], [data-cart-remove], [data-cross-sell-add]').forEach((control) => {
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
    }

    setCrossSellBusy(button, busy) {
      if (!button) return;

      if (busy) button.dataset.wasDisabled = String(button.disabled);
      button.disabled = busy || button.dataset.wasDisabled === 'true';
      button.setAttribute('aria-busy', String(busy));
      const spinner = button.querySelector('[data-loading-icon]');
      if (spinner) spinner.hidden = !busy;
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
    }

    showError(message, form = null) {
      const output = form?.querySelector('[data-product-form-error]') || this.querySelector('[data-cart-error]');
      if (!output) return;
      output.textContent = message || this.dataset.errorMessage;
      output.hidden = false;
    }

    showStatus(message) {
      const output = this.querySelector('[data-cart-status]');
      if (!output) return;
      output.textContent = message;
      output.hidden = false;
    }
  }

  class FacetFiltersForm extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.requestController = null;
      this.gridStorageKey = 'theme:grid-columns';

      this.listen(this, 'submit', (event) => {
        const form = event.target.closest('[data-facet-form]');
        if (!form) return;
        event.preventDefault();
        this.renderForm(form, true);
      });

      this.listen(this, 'change', (event) => {
        if (!event.target.matches('[data-facet-sort]')) return;
        event.target.form?.requestSubmit();
      });

      this.listen(this, 'click', (event) => {
        const button = event.target.closest('[data-grid-view]');
        if (!button) return;
        this.setGridView(button.dataset.gridView, true);
      });

      this.listen(window, 'popstate', () => this.renderUrl(window.location.href, false));
      this.applyStoredGridView();
    }

    disconnectedCallback() {
      this.requestController?.abort();
      super.disconnectedCallback();
    }

    renderForm(form, pushState) {
      const url = new URL(form.action, window.location.origin);
      const parameters = new URLSearchParams(new FormData(form));

      Array.from(parameters.entries()).forEach(([key, value]) => {
        if (value === '') parameters.delete(key);
      });

      url.search = parameters.toString();
      this.renderUrl(url, pushState);
    }

    async renderUrl(urlValue, pushState) {
      const navigationUrl = new URL(urlValue, window.location.origin);
      navigationUrl.searchParams.delete('section_id');
      const requestUrl = new URL(navigationUrl);
      requestUrl.searchParams.set('section_id', this.dataset.sectionId);
      const focusedId = document.activeElement?.id;

      this.requestController?.abort();
      this.requestController = new AbortController();
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

        this.innerHTML = nextElement.innerHTML;
        this.applyStoredGridView();
        this.announceResultCount();
        if (pushState) window.history.pushState({}, '', navigationUrl);

        if (focusedId) {
          requestAnimationFrame(() => document.getElementById(focusedId)?.focus());
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        window.location.assign(navigationUrl);
      } finally {
        this.setBusy(false);
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

      const gridView = ['2', '4'].includes(storedValue)
        ? storedValue
        : this.dataset.defaultGridColumns;
      this.setGridView(gridView, false);
    }

    setGridView(value, persist) {
      const gridView = String(value);
      if (!['2', '4'].includes(gridView)) return;

      const productList = this.querySelector('[data-product-list]');
      if (!productList) return;

      productList.dataset.gridColumns = gridView;
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

  class EditorialHero extends ThemeElement {
    connectedCallback() {
      this.startListening();
      this.video = this.querySelector('[data-editorial-hero-video]');
      if (!this.video) return;

      this.mobileQuery = window.matchMedia('(max-width: 47.99rem)');
      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.listen(this.mobileQuery, 'change', () => this.syncPlayback());
      this.listen(this.reducedMotionQuery, 'change', () => this.syncPlayback());
      this.listen(document, 'visibilitychange', () => this.syncPlayback());
      this.syncPlayback();
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
      const shouldPlay = mobilePlaybackAllowed
        && !this.reducedMotionQuery.matches
        && document.visibilityState !== 'hidden';

      if (!shouldPlay) {
        this.video.pause();
        this.removeAttribute('data-video-active');
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
      const countTemplate = count === 1
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
      this.requestController = new AbortController();
      const drawer = document.querySelector('cart-drawer');
      const revision = drawer?.beginMutation?.();
      const requestBody = {
        items: selectedItems.map(({ id, quantity }) => ({ id, quantity })),
      };

      if (drawer?.dataset.sectionId) {
        requestBody.sections = [drawer.dataset.sectionId];
        requestBody.sections_url = `${window.location.pathname}${window.location.search}`;
      }

      try {
        const response = await fetchCommerce(this.dataset.cartAddUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify(requestBody),
          signal: this.requestController.signal,
        }, this.dataset.errorMessage);
        // See addItem: an HTML error page must surface as the localized message, not as
        // a JSON SyntaxError, and an abort must stay an abort.
        const result = await response.json().catch((error) => {
          if (error.name === 'AbortError') throw error;
          throw new Error(this.dataset.errorMessage);
        });

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
      this.timer = null;

      if (this.items.length <= 1) return;

      this.listen(this.previousButton, 'click', () => this.changeBy(-1));
      this.listen(this.nextButton, 'click', () => this.changeBy(1));
      this.listen(this.pauseButton, 'click', () => {
        this.userPaused = !this.userPaused;
        this.updatePauseButton();
        this.schedule();
      });
      this.listen(this, 'pointerenter', () => {
        this.interactionPaused = true;
        this.clearTimer();
      });
      this.listen(this, 'pointerleave', () => {
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
          if (!this.isConnected || this.contains(document.activeElement)) return;
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
      if (!this.autoRotate || this.userPaused || this.interactionPaused || reducedMotionQuery.matches) return;

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
        this.syncItem(item);
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
      this.items.forEach((item) => this.syncItem(item));
    }

    syncItem(item) {
      item.querySelector('summary')?.setAttribute('aria-expanded', String(item.open));
    }
  }

  // ---------------------------------------------------------------------------
  // 4E-001. Indice de anclas con seguimiento del scroll.
  //
  // Dos consumidores, una sola pieza:
  //   - Documentacion: el Liquid ya sirve la lista, porque los ids de ancla son un
  //     ajuste del bloque y el servidor los conoce.
  //   - Paginas legales: los encabezados los escribe el comerciante en el editor de
  //     paginas, asi que no hay ids que emitir y la lista se construye aqui.
  //
  // El elemento nace con [hidden] y solo se muestra al encontrar dos destinos o mas: un
  // indice de una sola entrada no orienta a nadie, y sin JavaScript no puede quedarse en
  // pantalla un desplegable vacio. El contenido al que apunta se lee entero igual.
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
      // El indice de las paginas legales vive dentro de un <details> abierto: en movil
      // ocupa media pantalla, asi que se cierra solo al saltar a una seccion.
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

      // Modo servido: los destinos son los que ya apuntan los enlaces del Liquid.
      if (!source) {
        return Array.from(this.querySelectorAll('[data-anchor-link]'))
          .map((link) => document.getElementById(link.getAttribute('href')?.slice(1) || ''))
          .filter(Boolean);
      }

      // Modo construido: se numeran los encabezados y se les da id si no lo traen, que
      // es lo normal en texto pegado desde el editor de paginas.
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

      // -45% abajo: cuenta como "en pantalla" lo que ocupa la mitad superior de la
      // ventana, no lo que acaba de asomar por el borde inferior.
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

    // Con varios apartados en pantalla manda el primero, no el ultimo que aviso el
    // observador: el orden en que llegan sus llamadas no es el orden de la pagina.
    syncCurrent() {
      if (this.atBottom()) {
        this.setCurrent(this.targets[this.targets.length - 1].id);
        return;
      }

      const first = this.targets.find((target) => this.visible.has(target.id));
      if (first) this.setCurrent(first.id);
    }

    // El ultimo apartado de un documento suele ser mas corto que el margen inferior del
    // observador, asi que por si solo nunca llegaria a estar "en pantalla" y su entrada
    // del indice quedaria muerta. Al final de la pagina, el ultimo es el que toca.
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

  // ---------------------------------------------------------------------------
  // 4E-001. Copiado de un fragmento de la documentacion.
  //
  // El boton nace con [hidden] en el Liquid y solo se revela aqui, cuando consta que el
  // navegador tiene portapapeles. Sin JavaScript, o en un contexto sin permiso, el
  // fragmento se sigue leyendo y seleccionando y no queda un boton inerte en pantalla.
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

    async copy() {
      try {
        await navigator.clipboard.writeText(this.source.textContent.trim());
      } catch {
        // Un portapapeles denegado no es un error que el comerciante pueda resolver: se
        // deja el texto como estaba y el fragmento sigue ahi para seleccionarlo a mano.
        return;
      }

      const done = this.dataset.copiedLabel || this.idleLabel;
      if (this.label && this.dataset.copiedLabel) this.label.textContent = done;
      // El anuncio va en una region viva aparte: cambiar solo la etiqueta del boton no se
      // lee en un lector de pantalla si el foco ya estaba en el.
      if (this.status) this.status.textContent = this.dataset.copiedLabel || '';

      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => {
        if (this.label) this.label.textContent = this.idleLabel;
        if (this.status) this.status.textContent = '';
      }, 2000);
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
      document.body.setAttribute('data-modal-open', '');
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

      this.querySelectorAll('[data-localization-select]').forEach((select) => {
        this.listen(select, 'change', () => this.submitForm());
      });
    }

    submitForm() {
      if (!this.form || this.form.getAttribute('aria-busy') === 'true') return;
      this.form.setAttribute('aria-busy', 'true');

      if (typeof this.form.requestSubmit === 'function') {
        this.form.requestSubmit();
      } else {
        this.form.submit();
      }
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

      if (resultCount === 0) {
        const empty = document.createElement('p');
        empty.className = 'predictive-search__empty';
        empty.textContent = this.dataset.noResultsText || '';
        fragment.append(empty);
      }

      const viewAll = document.createElement('a');
      viewAll.className = 'predictive-search__view-all button button--secondary';
      viewAll.href = this.createSearchUrl(query);
      viewAll.textContent = (this.dataset.viewAllTemplate || '').replace('[terms]', query);
      fragment.append(viewAll);

      this.results.replaceChildren(fragment);
      this.results.hidden = false;
      this.options = Array.from(this.results.querySelectorAll('[role="option"]'));
      this.activeIndex = -1;
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
        image.src = imageUrl;
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

      if (Number.isFinite(currentPrice)) {
        const price = document.createElement('span');
        price.textContent = formatMoney(Math.round(currentPrice * 100), this.dataset.moneyFormat);
        priceRow.append(price);
      }
      if (Number.isFinite(compareAtPrice) && compareAtPrice > currentPrice) {
        const regularPrice = document.createElement('s');
        regularPrice.setAttribute('aria-label', this.dataset.regularPriceText || '');
        regularPrice.textContent = formatMoney(Math.round(compareAtPrice * 100), this.dataset.moneyFormat);
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

  window.ThemeCore = {
    initialized: true,
    ThemeElement,
    trapFocus,
    getFocusableElements,
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

  if (!customElements.get('copy-text')) {
    customElements.define('copy-text', CopyText);
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
  // B2. Motor de scroll reveal.
  //
  // Regla de oro: el contenido nace visible. El CSS solo oculta un elemento pendiente
  // cuando <html> lleva data-reveal-ready, y ese atributo lo pone este codigo unicamente
  // si hay IntersectionObserver, el comerciante no eligio animations: none y el visitante
  // no pidio reducir movimiento. Sin JS, con JS roto o en cualquiera de esos tres casos,
  // la tienda se lee entera y no queda un solo elemento escondido.
  //
  // El hero editorial no entra nunca: es el LCP, y animarlo cuesta la puntuacion de
  // rendimiento que la revision de Theme Store mira primero.
  // ---------------------------------------------------------------------------
  const REVEAL_TARGETS = [
    // Encabezados de seccion del homepage. Van primero porque intersectan antes que sus
    // rejillas, asi que el titulo anuncia y las tarjetas responden. Los encabezados de
    // pagina (colección, busqueda, blog, listado) se dejan fuera a proposito: son el h1
    // y estan sobre el pliegue; esconderlos aunque sea 680ms es retrasar contenido primario.
    '.lookbook__header',
    '.curated-showcase__header',
    '.complete-the-look__header',
    '.bento-discovery__header',
    '.product-recommendations__header',
    '.brand-manifesto__statement',
    // Contenido
    '.product-grid__item',
    '.bento-discovery__item',
    '.brand-manifesto__detail',
    '.brand-manifesto__media',
    '.complete-the-look__item',
    '.complete-the-look__media',
    '.curated-showcase__spotlight',
    '.lookbook__media',
    '.newsletter-section .newsletter__inner',
  ].join(', ');

  // Tope del escalonado. Sin el, una rejilla de 40 productos tardaria mas de dos segundos
  // en terminar de entrar y el escalonado dejaria de leerse como ritmo.
  const REVEAL_STAGGER_CAP = 7;

  const initScrollReveal = () => {
    const root = document.documentElement;
    if (!('IntersectionObserver' in window)) return;
    if (root.dataset.animations === 'none') return;
    if (reducedMotionQuery.matches) return;

    root.dataset.revealReady = 'true';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-revealed', '');
        observer.unobserve(entry.target);
      });
    }, {
      // -6%: el elemento arranca cuando de verdad entra en el campo visual, sin
      // anticiparse desde fuera del pliegue. 0.05: basta un asomo para disparar, asi que
      // un elemento alto no espera a estar medio visible.
      rootMargin: '0px 0px -6% 0px',
      threshold: 0.05,
    });

    const register = (scope) => {
      const nodes = Array.from(scope.querySelectorAll(REVEAL_TARGETS));
      const seen = new Map();

      nodes.forEach((node) => {
        if (node.hasAttribute('data-reveal') || node.closest('.hero-editorial')) return;

        // El indice se cuenta entre hermanos, para que cada rejilla escalone por su cuenta
        // en vez de heredar el conteo de la seccion anterior.
        const parent = node.parentElement;
        const index = seen.get(parent) ?? 0;
        seen.set(parent, index + 1);

        node.style.setProperty('--reveal-index', String(Math.min(index, REVEAL_STAGGER_CAP)));
        node.setAttribute('data-reveal', '');
        observer.observe(node);
      });
    };

    register(document);
    // El editor de temas reemplaza secciones enteras: lo que entra tambien debe entrar.
    document.addEventListener('shopify:section:load', (event) => register(event.target));
  };

  // ---------------------------------------------------------------------------
  // B7. Cabecera condensada al bajar. Solo escribe cuando el estado cambia, asi que el
  // listener pasivo no toca el DOM en la inmensa mayoria de los eventos de scroll.
  // ---------------------------------------------------------------------------
  const initHeaderScrollState = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let scrolled = null;
    const sync = () => {
      const next = window.scrollY > 40;
      if (next === scrolled) return;
      scrolled = next;
      header.toggleAttribute('data-header-scrolled', next);
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
  };

  // ---------------------------------------------------------------------------
  // 4D-002. Stepper de cantidad (menos / mas) del carrito.
  //
  // Delegado en document, no atado a cada boton: el cajon reemplaza su contenido
  // entero en cada mutacion, asi que no hay nodo al que atar un listener que
  // sobreviva al re-render.
  //
  // El boton NO llama a changeLine: escribe el valor y emite un 'change' sobre el
  // campo, que es exactamente lo que hace un visitante al teclear. De ahi en
  // adelante manda el camino ya endurecido y una sola implementacion sirve a las
  // dos superficies:
  //   - En el cajon lo recoge handleDrawerChange -> validacion -> changeLine(),
  //     con la revision por mutacion de 4D-001 que descarta respuestas superadas.
  //   - En la pagina de carrito, que es un formulario sin JavaScript, el campo
  //     queda editado a la espera de "Update cart", igual que si se hubiera escrito.
  // ---------------------------------------------------------------------------
  const readQuantityRules = (input) => {
    const step = Math.abs(Number(input.getAttribute('step'))) || 1;
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));
    return {
      step,
      min: Number.isFinite(min) ? min : 0,
      max: input.getAttribute('max') === null || !Number.isFinite(max) ? Infinity : max,
    };
  };

  // Shopify no acepta cualquier entero: los valores validos son min + n * incremento.
  // Un campo con min 2 e incremento 2 no puede pasar por 5, asi que el boton se mueve
  // por esa rejilla en lugar de sumar y restar a ciegas. Con floor al subir y ceil al
  // bajar, un valor fuera de rejilla (tecleado a mano) cae al escalon correcto.
  const nextQuantity = (input, direction) => {
    const { step, min, max } = readQuantityRules(input);
    const current = Number(input.value);
    const base = Number.isFinite(current) ? current : min;
    const offset = (base - min) / step;
    const index = direction > 0 ? Math.floor(offset) : Math.ceil(offset);
    return Math.min(max, Math.max(min, min + (index + direction) * step));
  };

  // Un boton se apaga exactamente cuando pulsarlo no cambiaria nada. Comparar contra el
  // salto real, y no contra min o max sueltos, es lo que mantiene el estado coherente
  // tambien cuando el valor esta fuera de la rejilla.
  const syncQuantityStepper = (stepper) => {
    const input = stepper.querySelector('[data-quantity-input]');
    if (!input) return;

    const { min } = readQuantityRules(input);
    const current = Number(input.value);
    const value = Number.isFinite(current) ? current : min;

    stepper.querySelectorAll('[data-quantity-button]').forEach((button) => {
      const direction = button.dataset.quantityButton === 'increase' ? 1 : -1;
      button.disabled = nextQuantity(input, direction) === value;
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

      // Se anota ANTES de sincronizar: al deshabilitar un elemento enfocado el navegador
      // lo desenfoca en el acto, asi que despues ya no hay forma de saber si el foco
      // estaba aqui. Este orden lo descubrio la prueba del minimo, no la lectura.
      const hadFocus = document.activeElement === button;

      input.value = String(next);
      syncQuantityStepper(stepper);

      // Si el boton recien pulsado toca el limite y se apaga, el foco caeria al body:
      // se pasa al hermano, que es el unico movimiento que le queda al teclado.
      if (hadFocus && button.disabled) {
        stepper.querySelector('[data-quantity-button]:not([disabled])')?.focus();
      }

      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // El servidor ya emite el estado correcto en cada render; esto cubre lo que el
    // servidor no ve: el numero que el visitante escribe a mano ('input') y, en la ficha
    // de producto, la rejilla de cantidades que cambia al elegir otra variante ('change',
    // emitido por updateQuantityRules).
    ['input', 'change'].forEach((type) => {
      document.addEventListener(type, (event) => {
        const stepper = event.target.closest?.('[data-quantity-stepper]');
        if (stepper) syncQuantityStepper(stepper);
      });
    });
  };

  // ---------------------------------------------------------------------------
  // 4E-001. Foco en el resultado de un formulario recien enviado.
  //
  // Los formularios nativos de Shopify (contacto, soporte, comentarios, contrasena)
  // recargan la pagina entera al enviarse. El foco vuelve al principio del documento y la
  // region viva no anuncia nada, porque no cambia despues de cargar: el visitante no oye
  // ni ve el resultado de lo que acaba de enviar. El markup ya traia tabindex="-1" en
  // esos mensajes desde su primera version, esperando justo esto.
  // ---------------------------------------------------------------------------
  const initFormMessageFocus = () => {
    const message = document.querySelector('.form-message[tabindex="-1"]');
    if (!message) return;

    // Un frame de margen: el foco se mueve cuando la pagina ya esta compuesta, no a mitad
    // del primer pintado, que es cuando el navegador todavia puede reajustar el scroll.
    requestAnimationFrame(() => {
      if (message.isConnected) message.focus();
    });
  };

  initScrollReveal();
  initHeaderScrollState();
  initQuantitySteppers();
  initFormMessageFocus();
})();
