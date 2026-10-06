/**
 * Animation Utilities - Task 11
 * Modern UI/UX Overhaul - Smooth Animations and Micro-interactions
 * 
 * Implements:
 * - Task 11.1: Hover lift effect (handled in CSS)
 * - Task 11.2: Loading success confirmation animations
 * - Task 11.3: Reduced motion support (handled in CSS)
 * - Task 11.4: Button press animation (handled in CSS)
 * 
 * Requirements: 9.3, 11.5, 4.3, 4.6, 10.1, 2.3
 */

/**
 * Show a success notification with checkmark
 * Task 11.2 - Display within 250ms of successful action
 * @param {string} message - Success message to display
 * @param {number} duration - How long to show notification (ms), default 3000ms
 */
function showSuccessNotification(message, duration = 3000) {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.setAttribute('role', 'status');
  notification.setAttribute('aria-live', 'polite');
  
  // Add checkmark icon and message
  notification.innerHTML = `
    <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
    <span>${message}</span>
  `;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Auto-dismiss after duration
  setTimeout(() => {
    notification.classList.add('fade-out');
    
    // Remove from DOM after fade-out animation
    const fadeOutDuration = prefersReducedMotion ? 10 : 250;
    setTimeout(() => {
      notification.remove();
    }, fadeOutDuration);
  }, duration);
  
  return notification;
}

/**
 * Show inline success checkmark for form actions
 * Task 11.2 - Requirement 9.3
 * @param {HTMLElement} element - Element to append success indicator to
 * @param {string} message - Optional message, defaults to "Success!"
 * @param {number} duration - How long to show indicator (ms), default 2000ms
 */
function showInlineSuccess(element, message = 'Success!', duration = 2000) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Create inline success element
  const successIndicator = document.createElement('span');
  successIndicator.className = 'inline-success';
  successIndicator.setAttribute('role', 'status');
  successIndicator.setAttribute('aria-live', 'polite');
  
  successIndicator.innerHTML = `
    <i class="fa-solid fa-check" aria-hidden="true"></i>
    <span>${message}</span>
  `;
  
  // Append to element
  element.appendChild(successIndicator);
  
  // Auto-remove after duration
  setTimeout(() => {
    successIndicator.style.opacity = '0';
    successIndicator.style.transition = prefersReducedMotion ? 'none' : 'opacity 250ms ease-out';
    
    setTimeout(() => {
      successIndicator.remove();
    }, prefersReducedMotion ? 10 : 250);
  }, duration);
  
  return successIndicator;
}

/**
 * Convert a button to show success state
 * Task 11.2 - Visual confirmation for button actions
 * @param {HTMLElement} button - Button element to show success on
 * @param {string} message - Success message, defaults to "Saved!"
 * @param {number} duration - How long to show success state (ms), default 2000ms
 */
function showButtonSuccess(button, message = 'Saved!', duration = 2000) {
  // Store original content
  const originalContent = button.innerHTML;
  const originalClasses = button.className;
  
  // Add success state
  button.className = button.className.replace(/btn-\w+/, 'btn-success');
  button.innerHTML = `
    <i class="fa-solid fa-check" aria-hidden="true"></i>
    <span>${message}</span>
  `;
  button.disabled = true;
  
  // Announce to screen readers
  const announcement = document.createElement('div');
  announcement.className = 'sr-announcements';
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  // Restore original state after duration
  setTimeout(() => {
    button.innerHTML = originalContent;
    button.className = originalClasses;
    button.disabled = false;
    announcement.remove();
  }, duration);
}

/**
 * Add success badge animation to an element
 * Task 11.2 - Requirement 11.5
 * @param {HTMLElement} element - Element to add badge to
 * @param {string} text - Badge text
 */
function addSuccessBadge(element, text = 'Complete') {
  const badge = document.createElement('span');
  badge.className = 'success-badge';
  badge.innerHTML = `
    <i class="fa-solid fa-check-circle" aria-hidden="true"></i>
    <span>${text}</span>
  `;
  
  element.appendChild(badge);
  return badge;
}

/**
 * Enhanced button press effect with haptic-like feedback
 * Task 11.4 - Already handled in CSS, this adds programmatic support
 * @param {HTMLElement} button - Button element
 */
function enhanceButtonPress(button) {
  button.addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.98)';
  });
  
  button.addEventListener('mouseup', function() {
    this.style.transform = '';
  });
  
  button.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
}

/**
 * Apply hover lift effect to cards programmatically
 * Task 11.1 - Already handled in CSS via .hover-lift class
 * This function is for dynamically created cards
 * @param {HTMLElement} card - Card element to enhance
 */
function enhanceCardHover(card) {
  if (!card.classList.contains('hover-lift')) {
    card.classList.add('hover-lift');
  }
}

/**
 * Check if user prefers reduced motion
 * Task 11.3 - Requirement 4.6
 * @returns {boolean} True if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Animate element with respect to motion preferences
 * Task 11.3 - Requirement 4.6
 * @param {HTMLElement} element - Element to animate
 * @param {string} animationClass - CSS animation class to apply
 * @param {number} duration - Animation duration in ms
 */
function animateWithMotionSupport(element, animationClass, duration = 250) {
  if (prefersReducedMotion()) {
    // Instant change, no animation
    return;
  }
  
  element.classList.add(animationClass);
  
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
}

/**
 * Initialize all animation enhancements on page load
 * Automatically applies animations to existing elements
 */
function initAnimationEnhancements() {
  // Enhance all buttons with .btn class
  document.querySelectorAll('.btn, button').forEach(button => {
    if (!button.hasAttribute('data-animation-enhanced')) {
      enhanceButtonPress(button);
      button.setAttribute('data-animation-enhanced', 'true');
    }
  });
  
  // Ensure all cards have hover-lift
  document.querySelectorAll('.glass-card').forEach(card => {
    enhanceCardHover(card);
  });
  
  // Log reduced motion preference for debugging
  if (prefersReducedMotion()) {
    console.log('[Animation Utils] Reduced motion is enabled - animations will be minimized');
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimationEnhancements);
} else {
  initAnimationEnhancements();
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showSuccessNotification,
    showInlineSuccess,
    showButtonSuccess,
    addSuccessBadge,
    enhanceButtonPress,
    enhanceCardHover,
    prefersReducedMotion,
    animateWithMotionSupport,
    initAnimationEnhancements
  };
}
