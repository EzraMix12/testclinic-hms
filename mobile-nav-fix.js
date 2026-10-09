/**
 * Mobile Navigation Scroll Fix
 * Enhanced mobile navigation with proper horizontal scrolling
 * Addresses touch scrolling issues on mobile devices
 */

(function() {
    'use strict';

    let mobileNavContainer = null;
    let touchStartX = 0;
    let scrollLeft = 0;
    let isScrolling = false;

    /**
     * Initialize mobile navigation scrolling enhancements
     */
    function initMobileNavScrolling() {
        // Find the mobile navigation container
        mobileNavContainer = document.querySelector('nav[aria-label="Mobile Top Navigation"]') || 
                            document.querySelector('.md\\:hidden');

        if (!mobileNavContainer) {
            console.log('Mobile nav container not found');
            return;
        }

        console.log('Mobile nav container found:', mobileNavContainer);

        // Force enable scrolling properties
        forceMobileNavStyles();

        // Add touch event listeners for manual scrolling
        addTouchScrollListeners();

        // Add scroll indicators
        addScrollIndicators();
        
        // Monitor scroll state
        monitorScrollState();
    }

    /**
     * Force mobile navigation styles programmatically
     */
    function forceMobileNavStyles() {
        if (!mobileNavContainer) return;

        // Set critical CSS properties via JavaScript
        const styles = {
            'overflow-x': 'scroll',
            'overflow-y': 'hidden',
            '-webkit-overflow-scrolling': 'touch',
            'overscroll-behavior-x': 'contain',
            'touch-action': 'pan-x',
            'scroll-behavior': 'smooth',
            'scrollbar-width': 'none',
            '-ms-overflow-style': 'none',
            'will-change': 'scroll-position',
            'transform': 'translateZ(0)', // Force hardware acceleration
            'position': 'relative',
            'flex': '1',
            'margin': '0 0.5rem'
        };

        Object.keys(styles).forEach(property => {
            mobileNavContainer.style.setProperty(property, styles[property], 'important');
        });

        // Hide webkit scrollbar
        const style = document.createElement('style');
        style.textContent = `
            nav[aria-label="Mobile Top Navigation"]::-webkit-scrollbar,
            .md\\:hidden::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
            }
        `;
        document.head.appendChild(style);

        // Ensure the inner div has proper width
        const innerDiv = mobileNavContainer.querySelector('div');
        if (innerDiv) {
            innerDiv.style.setProperty('display', 'flex', 'important');
            innerDiv.style.setProperty('white-space', 'nowrap', 'important');
            innerDiv.style.setProperty('width', 'max-content', 'important');
            innerDiv.style.setProperty('min-width', '100%', 'important');
            innerDiv.style.setProperty('padding-right', '2rem', 'important');
        }

        console.log('Mobile nav styles applied');
    }

    /**
     * Add touch event listeners for enhanced scrolling
     */
    function addTouchScrollListeners() {
        if (!mobileNavContainer) return;

        // Touch start
        mobileNavContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].pageX;
            scrollLeft = this.scrollLeft;
            isScrolling = true;
            
            // Add visual feedback
            this.classList.add('scrolling');
        }, { passive: true });

        // Touch move - manual scrolling
        mobileNavContainer.addEventListener('touchmove', function(e) {
            if (!isScrolling) return;

            const x = e.touches[0].pageX;
            const walk = (touchStartX - x) * 2; // Multiply for faster scrolling
            this.scrollLeft = scrollLeft + walk;
        }, { passive: true });

        // Touch end
        mobileNavContainer.addEventListener('touchend', function(e) {
            isScrolling = false;
            this.classList.remove('scrolling');
        }, { passive: true });

        // Touch cancel
        mobileNavContainer.addEventListener('touchcancel', function(e) {
            isScrolling = false;
            this.classList.remove('scrolling');
        }, { passive: true });

        console.log('Touch listeners added');
    }

    /**
     * Add visual scroll indicators
     */
    function addScrollIndicators() {
        if (!mobileNavContainer) return;

        // Create left indicator
        const leftIndicator = document.createElement('div');
        leftIndicator.className = 'scroll-indicator scroll-indicator-left';
        leftIndicator.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        
        // Create right indicator
        const rightIndicator = document.createElement('div');
        rightIndicator.className = 'scroll-indicator scroll-indicator-right';
        rightIndicator.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

        // Add indicators to header
        const header = mobileNavContainer.closest('header');
        if (header) {
            header.style.position = 'relative';
            header.appendChild(leftIndicator);
            header.appendChild(rightIndicator);

            // Click handlers for indicators
            leftIndicator.addEventListener('click', () => {
                mobileNavContainer.scrollBy({ left: -100, behavior: 'smooth' });
            });

            rightIndicator.addEventListener('click', () => {
                mobileNavContainer.scrollBy({ left: 100, behavior: 'smooth' });
            });
        }

        console.log('Scroll indicators added');
    }

    /**
     * Monitor scroll state and update indicators
     */
    function monitorScrollState() {
        if (!mobileNavContainer) return;

        function updateIndicators() {
            const leftIndicator = document.querySelector('.scroll-indicator-left');
            const rightIndicator = document.querySelector('.scroll-indicator-right');
            
            if (!leftIndicator || !rightIndicator) return;

            const { scrollLeft, scrollWidth, clientWidth } = mobileNavContainer;
            
            // Show/hide left indicator
            if (scrollLeft > 10) {
                leftIndicator.style.opacity = '1';
                leftIndicator.style.pointerEvents = 'auto';
            } else {
                leftIndicator.style.opacity = '0';
                leftIndicator.style.pointerEvents = 'none';
            }

            // Show/hide right indicator
            if (scrollLeft < scrollWidth - clientWidth - 10) {
                rightIndicator.style.opacity = '1';
                rightIndicator.style.pointerEvents = 'auto';
            } else {
                rightIndicator.style.opacity = '0';
                rightIndicator.style.pointerEvents = 'none';
            }
        }

        // Listen for scroll events
        mobileNavContainer.addEventListener('scroll', updateIndicators, { passive: true });
        
        // Initial check
        setTimeout(updateIndicators, 100);

        console.log('Scroll monitoring initialized');
    }

    /**
     * Debug function to test scrolling
     */
    function debugMobileNav() {
        if (!mobileNavContainer) {
            console.log('❌ Mobile nav container not found');
            return;
        }

        console.log('🔍 Mobile Nav Debug Info:');
        console.log('Container:', mobileNavContainer);
        console.log('Container width:', mobileNavContainer.clientWidth);
        console.log('Scroll width:', mobileNavContainer.scrollWidth);
        console.log('Can scroll:', mobileNavContainer.scrollWidth > mobileNavContainer.clientWidth);
        console.log('Computed styles:', window.getComputedStyle(mobileNavContainer));
        
        // Test programmatic scrolling
        console.log('Testing scroll...');
        mobileNavContainer.scrollTo({ left: 50, behavior: 'smooth' });
        
        setTimeout(() => {
            console.log('Current scroll position:', mobileNavContainer.scrollLeft);
        }, 500);
    }

    // Make debug function globally available
    window.debugMobileNav = debugMobileNav;

    /**
     * Initialize when DOM is ready
     */
    function initialize() {
        // Wait a bit for other scripts and styles to load
        setTimeout(() => {
            initMobileNavScrolling();
            
            // Debug log
            console.log('Mobile nav fix initialized');
            
            // Test after short delay
            setTimeout(() => {
                debugMobileNav();
            }, 1000);
        }, 500);
    }

    // Initialize based on DOM state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Re-initialize on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth <= 767) {
                initMobileNavScrolling();
            }
        }, 250);
    });

})();