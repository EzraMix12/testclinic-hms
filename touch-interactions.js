/**
 * Touch Interactions and Gestures Module
 * PulseClinic Hospital Management System
 * 
 * Task 9: Implement touch interactions and gestures
 * Requirements: 2.3, 2.4, 2.5
 * 
 * Features:
 * - 9.1: Swipe-to-dismiss for modals on touch devices
 * - 9.2: Immediate visual feedback (< 150ms) for touch interactions
 * - 9.3: Long-press gestures for contextual actions (delete/remove)
 */

(function() {
    'use strict';

    // ========================================
    // 9.2: Immediate Touch Feedback
    // Requirement 2.3: Provide immediate visual feedback within 150ms of tap
    // ========================================

    /**
     * Initialize immediate touch feedback for all interactive elements
     */
    function initTouchFeedback() {
        // Target all interactive elements
        const interactiveElements = document.querySelectorAll(
            'button:not([disabled]), a[href], .mobile-nav-link, .touch-target, .touch-target-lg, [role="button"]'
        );

        interactiveElements.forEach(element => {
            // Add touchstart listener for immediate feedback
            element.addEventListener('touchstart', function(e) {
                // Add active class immediately (< 150ms requirement)
                this.classList.add('touch-active');
            }, { passive: true });

            // Remove feedback on touchend
            element.addEventListener('touchend', function(e) {
                // Remove active class after brief delay
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 100);
            }, { passive: true });

            // Remove feedback if touch is canceled
            element.addEventListener('touchcancel', function(e) {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }

    // ========================================
    // 9.1: Swipe-to-Dismiss Modals
    // Requirement 2.4: Support swipe gestures for dismissing modals on touch devices
    // ========================================

    /**
     * Initialize swipe-to-dismiss functionality for modals
     */
    function initModalSwipe() {
        // Track modals on the page
        const modals = document.querySelectorAll('.modal-backdrop');

        modals.forEach(modal => {
            const modalContainer = modal.querySelector('.modal-container');
            if (!modalContainer) return;

            let startY = 0;
            let currentY = 0;
            let isDragging = false;
            let startTime = 0;

            // Touch start - record initial position
            modalContainer.addEventListener('touchstart', function(e) {
                // Only allow swipe from top portion of modal
                const rect = modalContainer.getBoundingClientRect();
                const touchY = e.touches[0].clientY;
                const relativeY = touchY - rect.top;

                // Allow swipe if touching top 50px (swipe handle area)
                if (relativeY <= 50) {
                    startY = e.touches[0].clientY;
                    startTime = Date.now();
                    isDragging = false;
                }
            }, { passive: true });

            // Touch move - track drag
            modalContainer.addEventListener('touchmove', function(e) {
                if (startY === 0) return;

                currentY = e.touches[0].clientY;
                const deltaY = currentY - startY;

                // Only allow downward swipes
                if (deltaY > 0) {
                    isDragging = true;
                    
                    // Apply transform with resistance
                    const resistance = 0.5; // Add some resistance for natural feel
                    const translateY = deltaY * resistance;
                    
                    modalContainer.style.transform = `translateY(${translateY}px)`;
                    
                    // Reduce opacity as user swipes down
                    const opacity = Math.max(0.5, 1 - (deltaY / 400));
                    modalContainer.style.opacity = opacity;

                    modalContainer.classList.add('swipe-dismissing');
                }
            }, { passive: true });

            // Touch end - determine if should dismiss
            modalContainer.addEventListener('touchend', function(e) {
                if (!isDragging) {
                    startY = 0;
                    return;
                }

                const deltaY = currentY - startY;
                const deltaTime = Date.now() - startTime;
                const velocity = deltaY / deltaTime; // pixels per ms

                // Dismiss if swiped down > 100px OR fast swipe velocity
                const shouldDismiss = deltaY > 100 || velocity > 0.5;

                if (shouldDismiss) {
                    // Animate out and close
                    modalContainer.style.transition = 'transform 250ms ease-out, opacity 250ms ease-out';
                    modalContainer.style.transform = 'translateY(100%)';
                    modalContainer.style.opacity = '0';

                    setTimeout(() => {
                        // Find and call the close function for this modal
                        if (typeof closeModal === 'function') {
                            closeModal();
                        } else if (typeof closePrintModal === 'function') {
                            closePrintModal();
                        }
                        
                        // Reset styles
                        resetModalSwipeStyles(modalContainer);
                    }, 250);
                } else {
                    // Snap back to original position
                    modalContainer.style.transition = 'transform 250ms ease-out, opacity 250ms ease-out';
                    modalContainer.style.transform = 'translateY(0)';
                    modalContainer.style.opacity = '1';

                    setTimeout(() => {
                        resetModalSwipeStyles(modalContainer);
                    }, 250);
                }

                // Reset tracking variables
                startY = 0;
                currentY = 0;
                isDragging = false;
                modalContainer.classList.remove('swipe-dismissing');
            }, { passive: true });

            // Touch cancel - reset state
            modalContainer.addEventListener('touchcancel', function(e) {
                resetModalSwipeStyles(modalContainer);
                startY = 0;
                currentY = 0;
                isDragging = false;
                modalContainer.classList.remove('swipe-dismissing');
            }, { passive: true });
        });
    }

    /**
     * Reset modal swipe styles
     * @param {HTMLElement} modalContainer - The modal container element
     */
    function resetModalSwipeStyles(modalContainer) {
        modalContainer.style.transition = '';
        modalContainer.style.transform = '';
        modalContainer.style.opacity = '';
    }

    // ========================================
    // 9.3: Long-Press Gestures
    // Requirement 2.5: Support long-press gestures for contextual actions
    // ========================================

    /**
     * Initialize long-press functionality for delete/remove actions
     */
    function initLongPress() {
        // Target delete/remove buttons throughout the system
        const deleteButtons = document.querySelectorAll(
            'button[onclick*="removeQ"], button[onclick*="deleteP"], button[onclick*="remove"], .btn-danger, [data-long-press]'
        );

        deleteButtons.forEach(button => {
            let pressTimer = null;
            let startX = 0;
            let startY = 0;
            let hasMoved = false;

            // Touch start - begin long-press timer
            button.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                hasMoved = false;

                // Visual feedback - subtle highlight
                this.classList.add('long-press-active');

                // Start 500ms timer for long-press
                pressTimer = setTimeout(() => {
                    if (!hasMoved) {
                        handleLongPress(this, e);
                    }
                }, 500);
            }, { passive: true });

            // Touch move - cancel if moved too much
            button.addEventListener('touchmove', function(e) {
                const moveThreshold = 10; // 10px movement threshold
                const deltaX = Math.abs(e.touches[0].clientX - startX);
                const deltaY = Math.abs(e.touches[0].clientY - startY);

                if (deltaX > moveThreshold || deltaY > moveThreshold) {
                    hasMoved = true;
                    clearTimeout(pressTimer);
                    this.classList.remove('long-press-active');
                }
            }, { passive: true });

            // Touch end - cancel timer
            button.addEventListener('touchend', function(e) {
                clearTimeout(pressTimer);
                this.classList.remove('long-press-active');
            }, { passive: true });

            // Touch cancel - cancel timer
            button.addEventListener('touchcancel', function(e) {
                clearTimeout(pressTimer);
                this.classList.remove('long-press-active');
            }, { passive: true });
        });
    }

    /**
     * Handle long-press activation
     * @param {HTMLElement} element - The element that was long-pressed
     * @param {TouchEvent} event - The touch event
     */
    function handleLongPress(element, event) {
        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50); // 50ms vibration
        }

        // Visual feedback
        element.classList.add('long-press-triggered');
        setTimeout(() => {
            element.classList.remove('long-press-triggered');
        }, 300);

        // Show confirmation UI
        showLongPressConfirmation(element, event);

        // Prevent default action
        event.preventDefault();
    }

    /**
     * Show confirmation UI for long-press action
     * @param {HTMLElement} element - The element that was long-pressed
     * @param {TouchEvent} event - The touch event
     */
    function showLongPressConfirmation(element, event) {
        // Create confirmation popup
        const confirmation = document.createElement('div');
        confirmation.className = 'long-press-confirmation';
        confirmation.setAttribute('role', 'dialog');
        confirmation.setAttribute('aria-modal', 'true');
        confirmation.setAttribute('aria-labelledby', 'long-press-title');

        // Position near the element
        const rect = element.getBoundingClientRect();
        const touchY = event.touches[0].clientY;
        const touchX = event.touches[0].clientX;

        // Position popup above the touch point
        confirmation.style.top = `${touchY - 120}px`;
        confirmation.style.left = `${Math.max(20, Math.min(window.innerWidth - 220, touchX - 100))}px`;

        // Build confirmation content
        confirmation.innerHTML = `
            <div class="long-press-confirmation-content">
                <p class="long-press-confirmation-text" id="long-press-title">
                    Confirm deletion?
                </p>
                <div class="long-press-confirmation-actions">
                    <button class="long-press-confirm-btn" data-action="confirm">
                        <i class="fa-solid fa-check"></i> Delete
                    </button>
                    <button class="long-press-cancel-btn" data-action="cancel">
                        <i class="fa-solid fa-xmark"></i> Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(confirmation);

        // Handle confirmation
        const confirmBtn = confirmation.querySelector('[data-action="confirm"]');
        const cancelBtn = confirmation.querySelector('[data-action="cancel"]');

        confirmBtn.addEventListener('click', function() {
            // Execute the original onclick function
            if (element.onclick) {
                element.onclick();
            } else if (element.getAttribute('onclick')) {
                // Execute onclick attribute
                eval(element.getAttribute('onclick'));
            }
            removeConfirmation(confirmation);
        });

        cancelBtn.addEventListener('click', function() {
            removeConfirmation(confirmation);
        });

        // Close on backdrop click
        setTimeout(() => {
            document.addEventListener('click', function closeOnOutside(e) {
                if (!confirmation.contains(e.target) && e.target !== element) {
                    removeConfirmation(confirmation);
                    document.removeEventListener('click', closeOnOutside);
                }
            });
        }, 100);

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(confirmation)) {
                removeConfirmation(confirmation);
            }
        }, 5000);

        // Focus the cancel button for accessibility
        setTimeout(() => {
            cancelBtn.focus();
        }, 100);
    }

    /**
     * Remove confirmation popup with animation
     * @param {HTMLElement} confirmation - The confirmation element
     */
    function removeConfirmation(confirmation) {
        confirmation.style.opacity = '0';
        confirmation.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.parentNode.removeChild(confirmation);
            }
        }, 200);
    }

    // ========================================
    // Refresh Touch Interactions
    // Call this after dynamically adding new content
    // ========================================

    /**
     * Reinitialize touch interactions (call after dynamic content updates)
     */
    function refreshTouchInteractions() {
        initTouchFeedback();
        initLongPress();
    }

    // Make refreshTouchInteractions globally available
    window.refreshTouchInteractions = refreshTouchInteractions;

    // ========================================
    // Initialize on DOM Ready
    // ========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTouchFeedback();
            initModalSwipe();
            initLongPress();
        });
    } else {
        // DOM already loaded
        initTouchFeedback();
        initModalSwipe();
        initLongPress();
    }

    // Reinitialize when modals are opened (use MutationObserver)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Check if modal was added
                    if (node.classList && (node.classList.contains('modal-backdrop') || node.querySelector('.modal-backdrop'))) {
                        initModalSwipe();
                    }
                    // Reinitialize touch feedback for new interactive elements
                    if (node.querySelector && node.querySelector('button, a[href]')) {
                        initTouchFeedback();
                        initLongPress();
                    }
                }
            });
        });
    });

    // Observe the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
