// Dark Mode Theme Toggle
// Persists user preference in localStorage

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
        
        if (theme === 'dark') {
            html.classList.add(DARK_CLASS);
            html.setAttribute('data-theme', 'dark');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        } else {
            html.classList.remove(DARK_CLASS);
            html.setAttribute('data-theme', 'light');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }
    
    // Toggle between themes
    function toggleTheme() {
        const currentTheme = getSavedTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        saveTheme(newTheme);
        applyTheme(newTheme);
    }
    
    // Initialize theme on page load
    function initTheme() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
        
        // Add event listener to toggle button
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
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
