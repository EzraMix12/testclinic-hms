// Dark Mode Theme Toggle
// Persists user preference in localStorage
// Fully keyboard accessible with ARIA support

(function() {
    const THEME_KEY = 'testclinic-theme';
    const DARK_CLASS = 'dark-theme';
    
    // Get saved theme or default to light
    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY) || 'light';
    }
    
    // Save theme preference
    function saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }
    
    // Apply theme to document
    function applyTheme(theme) {
        const html = document.documentElement;
        const icon = document.getElementById('theme-icon');
        const toggleBtn = document.getElementById('theme-toggle');
        
        if (theme === 'dark') {
            html.classList.add(DARK_CLASS);
            html.setAttribute('data-theme', 'dark');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-label', 'Switch to light mode');
                toggleBtn.setAttribute('aria-pressed', 'true');
            }
        } else {
            html.classList.remove(DARK_CLASS);
            html.setAttribute('data-theme', 'light');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
                toggleBtn.setAttribute('aria-pressed', 'false');
            }
        }
    }
    
    // Toggle between themes
    function toggleTheme() {
        const currentTheme = getSavedTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        saveTheme(newTheme);
        applyTheme(newTheme);
        
        // Announce to screen readers
        const announcement = newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled';
        announceToScreenReader(announcement);
    }
    
    // Announce theme change to screen readers
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Initialize theme on page load
    function initTheme() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
        
        // Add event listener to toggle button
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            // Click handler
            toggleBtn.addEventListener('click', toggleTheme);
            
            // Keyboard handler (Enter or Space)
            toggleBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }
    }
    
    // Apply theme immediately to prevent flash
    applyTheme(getSavedTheme());
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
