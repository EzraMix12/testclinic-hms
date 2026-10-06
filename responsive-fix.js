/**
 * Responsive Layout Enforcer
 * Forces correct table/mobile-card behavior regardless of Tailwind CDN interference
 * 
 * This script runs after page load to ensure responsive layouts work correctly
 */

(function() {
    'use strict';
    
    function enforceResponsiveLayout() {
        const tables = document.querySelectorAll('.responsive-table');
        const mobileContainers = document.querySelectorAll('.mobile-cards-container');
        const mobileNavs = document.querySelectorAll('.mobile-bottom-nav');
        
        // Get current viewport width
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth < 768) {
            // Mobile: Hide tables, show mobile cards and nav
            tables.forEach(table => {
                table.style.display = 'none';
                table.style.setProperty('display', 'none', 'important');
            });
            
            mobileContainers.forEach(container => {
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '1rem';
                container.style.setProperty('display', 'flex', 'important');
            });
            
            mobileNavs.forEach(nav => {
                nav.style.display = 'flex';
                nav.style.setProperty('display', 'flex', 'important');
            });
            
        } else {
            // Desktop/Tablet: Show tables, hide mobile elements  
            tables.forEach(table => {
                table.style.display = 'table';
                table.style.setProperty('display', 'table', 'important');
            });
            
            mobileContainers.forEach(container => {
                container.style.display = 'none';
                container.style.setProperty('display', 'none', 'important');
            });
            
            mobileNavs.forEach(nav => {
                nav.style.display = 'none';
                nav.style.setProperty('display', 'none', 'important');
            });
        }
    }
    
    // Run immediately
    enforceResponsiveLayout();
    
    // Run after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enforceResponsiveLayout);
    }
    
    // Run after Tailwind finishes processing (delayed)
    setTimeout(enforceResponsiveLayout, 100);
    setTimeout(enforceResponsiveLayout, 500);
    
    // Run on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(enforceResponsiveLayout, 100);
    });
    
    // Watch for Tailwind dynamic changes with MutationObserver
    const observer = new MutationObserver(function(mutations) {
        let needsUpdate = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                needsUpdate = true;
            }
        });
        
        if (needsUpdate) {
            setTimeout(enforceResponsiveLayout, 50);
        }
    });
    
    // Start observing
    observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class', 'style']
    });
})();