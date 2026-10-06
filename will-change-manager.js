/**
 * Will-Change Manager - Task 12.4
 * Modern UI/UX Overhaul - Animation Performance Optimization
 *
 * Dynamically adds `will-change` to frequently animated elements just before
 * animation begins, and removes it once the animation completes. This avoids
 * the memory overhead of permanent `will-change` declarations on elements
 * that are only occasionally animated.
 *
 * Implements: Requirement 10.1
 */

/**
 * Add will-change to an element before animation, remove it after.
 * @param {HTMLElement} el - Target element
 * @param {string} properties - CSS properties string (e.g. 'transform, opacity')
 */
function setWillChange(el, properties) {
  if (!el) return;
  el.style.willChange = properties;
}

/**
 * Reset will-change to 'auto' after animation completes.
 * @param {HTMLElement} el - Target element
 */
function clearWillChange(el) {
  if (!el) return;
  el.style.willChange = 'auto';
}

/**
 * Manage will-change for a one-shot CSS animation.
 * Sets will-change before the animation fires, clears it on animationend.
 * @param {HTMLElement} el - Element carrying the animation class
 * @param {string} properties - CSS properties to hint
 */
function manageWillChangeForAnimation(el, properties) {
  if (!el) return;

  // Check reduced motion preference - skip will-change if animations are disabled
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  setWillChange(el, properties);

  function onEnd() {
    clearWillChange(el);
    el.removeEventListener('animationend', onEnd);
  }

  el.addEventListener('animationend', onEnd, { once: true });
}

/**
 * Manage will-change for CSS transitions triggered by hover/focus/active states.
 * Adds will-change on mouseenter/focusin, removes it on mouseleave/focusout.
 * @param {HTMLElement} el - Element with transition
 * @param {string} properties - CSS properties to hint
 */
function manageWillChangeForTransition(el, properties) {
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  el.addEventListener('mouseenter', () => setWillChange(el, properties));
  el.addEventListener('focusin',    () => setWillChange(el, properties));
  el.addEventListener('mouseleave', () => clearWillChange(el));
  el.addEventListener('focusout',   () => clearWillChange(el));
}

/**
 * Initialize will-change management for hover-lift cards.
 * Manages will-change dynamically instead of leaving it permanently set.
 */
function initHoverLiftWillChange() {
  document.querySelectorAll('.hover-lift').forEach(el => {
    if (el.dataset.willChangeManaged) return;
    manageWillChangeForTransition(el, 'transform, box-shadow');
    el.dataset.willChangeManaged = 'true';
  });
}

/**
 * Initialize will-change management for buttons with transitions.
 */
function initButtonWillChange() {
  document.querySelectorAll('.btn, button').forEach(el => {
    if (el.dataset.willChangeManaged) return;
    manageWillChangeForTransition(el, 'transform, box-shadow');
    el.dataset.willChangeManaged = 'true';
  });
}

/**
 * Initialize will-change management for glass-card elements.
 */
function initGlassCardWillChange() {
  document.querySelectorAll('.glass-card').forEach(el => {
    if (el.dataset.willChangeManaged) return;
    manageWillChangeForTransition(el, 'transform, box-shadow');
    el.dataset.willChangeManaged = 'true';
  });
}

/**
 * Initialize will-change management for slide-up animation elements.
 * These are typically applied dynamically (modals, panels).
 */
function initSlideUpWillChange() {
  document.querySelectorAll('.slide-up').forEach(el => {
    if (el.dataset.willChangeManaged) return;
    manageWillChangeForAnimation(el, 'transform, opacity');
    el.dataset.willChangeManaged = 'true';
  });
}

/**
 * Initialize will-change management for fade-in animation elements.
 */
function initFadeInWillChange() {
  document.querySelectorAll('.fade-in').forEach(el => {
    if (el.dataset.willChangeManaged) return;
    manageWillChangeForAnimation(el, 'opacity');
    el.dataset.willChangeManaged = 'true';
  });
}

/**
 * Initialize will-change management for skeleton/shimmer loaders.
 * Clears will-change when the skeleton is hidden (content loaded).
 * @param {HTMLElement} skeletonEl - The skeleton element
 */
function manageSkeltonWillChange(skeletonEl) {
  if (!skeletonEl) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Already set via CSS; observe for when skeleton is removed/hidden
  const observer = new MutationObserver(() => {
    if (skeletonEl.classList.contains('skeleton-hidden') ||
        skeletonEl.style.display === 'none' ||
        !document.contains(skeletonEl)) {
      clearWillChange(skeletonEl);
      observer.disconnect();
    }
  });

  observer.observe(skeletonEl.parentNode || document.body, {
    childList: true,
    subtree: false,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
}

/**
 * Initialize will-change management for all skeleton loaders on the page.
 */
function initSkeletonWillChange() {
  document.querySelectorAll('.skeleton, .shimmer').forEach(el => {
    if (el.dataset.willChangeManaged) return;
    manageSkeltonWillChange(el);
    el.dataset.willChangeManaged = 'true';
  });
}

/**
 * Observe the DOM for dynamically added animated elements and apply
 * will-change management to them automatically.
 */
function observeDynamicAnimatedElements() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        // Slide-up elements (modals, panels)
        if (node.classList.contains('slide-up')) {
          manageWillChangeForAnimation(node, 'transform, opacity');
          node.dataset.willChangeManaged = 'true';
        }

        // Fade-in elements
        if (node.classList.contains('fade-in')) {
          manageWillChangeForAnimation(node, 'opacity');
          node.dataset.willChangeManaged = 'true';
        }

        // Success notifications
        if (node.classList.contains('success-notification')) {
          // CSS already sets will-change; clear it after the slide-in finishes
          node.addEventListener('animationend', () => {
            // Only clear if we're in the stable (non-fade-out) state
            if (!node.classList.contains('fade-out')) {
              clearWillChange(node);
            }
          }, { once: true });
        }

        // Inline success / success badges
        if (node.classList.contains('inline-success') ||
            node.classList.contains('success-badge')) {
          manageWillChangeForAnimation(node, 'transform, opacity');
          node.dataset.willChangeManaged = 'true';
        }

        // Long-press confirmation
        if (node.classList.contains('long-press-confirmation')) {
          manageWillChangeForAnimation(node, 'transform, opacity');
          node.dataset.willChangeManaged = 'true';
        }

        // Hover-lift cards added dynamically
        if (node.classList.contains('hover-lift') && !node.dataset.willChangeManaged) {
          manageWillChangeForTransition(node, 'transform, box-shadow');
          node.dataset.willChangeManaged = 'true';
        }

        // Skeleton/shimmer loaders added dynamically
        if (node.classList.contains('skeleton') || node.classList.contains('shimmer')) {
          if (!node.dataset.willChangeManaged) {
            manageSkeltonWillChange(node);
            node.dataset.willChangeManaged = 'true';
          }
        }

        // Recurse into children
        node.querySelectorAll('.hover-lift:not([data-will-change-managed]), .slide-up:not([data-will-change-managed]), .fade-in:not([data-will-change-managed])').forEach(child => {
          if (!child.dataset.willChangeManaged) {
            if (child.classList.contains('hover-lift')) {
              manageWillChangeForTransition(child, 'transform, box-shadow');
            } else if (child.classList.contains('slide-up')) {
              manageWillChangeForAnimation(child, 'transform, opacity');
            } else if (child.classList.contains('fade-in')) {
              manageWillChangeForAnimation(child, 'opacity');
            }
            child.dataset.willChangeManaged = 'true';
          }
        });
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Initialize all will-change optimizations.
 * Called once on DOMContentLoaded.
 */
function initWillChangeManager() {
  // Skip all optimizations when user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[WillChangeManager] Reduced motion enabled - will-change management skipped');
    return;
  }

  initHoverLiftWillChange();
  initButtonWillChange();
  initGlassCardWillChange();
  initSlideUpWillChange();
  initFadeInWillChange();
  initSkeletonWillChange();
  observeDynamicAnimatedElements();

  console.log('[WillChangeManager] Initialized - will-change managed dynamically for performance');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWillChangeManager);
} else {
  initWillChangeManager();
}

// Export for use in other modules / tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setWillChange,
    clearWillChange,
    manageWillChangeForAnimation,
    manageWillChangeForTransition,
    manageSkeltonWillChange,
    initWillChangeManager,
  };
}
