/**
 * User Session Management
 * Handles user authentication, session data, and user switching
 */

// Demo user accounts with their display information
const demoUsers = {
    doctor: { 
        username: 'dr.jenkins', 
        password: 'doctor123', 
        name: 'Dr. Sarah Jenkins',
        role: 'Doctor',
        avatar: 'fa-stethoscope',
        color: 'emerald'
    },
    receptionist: { 
        username: 'maria.r', 
        password: 'reception123', 
        name: 'Maria Rodriguez',
        role: 'Receptionist', 
        avatar: 'fa-user-nurse',
        color: 'sky'
    },
    admin: { 
        username: 'admin', 
        password: 'admin123', 
        name: 'System Administrator',
        role: 'Admin',
        avatar: 'fa-chart-line',
        color: 'purple'
    }
};

/**
 * Get current user session
 * @returns {Object|null} User session data or null if not logged in
 */
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('testclinic-user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error reading user session:', error);
        return null;
    }
}

/**
 * Check if user is logged in and redirect if not
 * @param {string} redirectTo - URL to redirect to if not logged in (default: login.html)
 */
function requireLogin(redirectTo = 'login.html') {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

/**
 * Update user display in the navigation
 * Should be called on page load for pages that show user info
 */
function updateUserDisplay() {
    const user = getCurrentUser();
    if (!user) return;

    // Find user display elements and update them
    const userDisplayElements = document.querySelectorAll('[data-user-display]');
    userDisplayElements.forEach(element => {
        element.textContent = user.name;
    });

    // Update user info in dropdown if it exists
    const userDropdownName = document.getElementById('user-dropdown-name');
    const userDropdownRole = document.getElementById('user-dropdown-role');
    const userDropdownAvatar = document.getElementById('user-dropdown-avatar');

    if (userDropdownName) userDropdownName.textContent = user.name;
    if (userDropdownRole) userDropdownRole.textContent = user.role || 'User';
    if (userDropdownAvatar) {
        // Update avatar based on user role
        const userData = Object.values(demoUsers).find(u => u.name === user.name);
        if (userData) {
            userDropdownAvatar.className = `fa-solid ${userData.avatar}`;
        }
    }
}

/**
 * Logout current user
 * @param {boolean} confirm - Whether to show confirmation dialog (default: true)
 */
function logout(confirm = true) {
    if (confirm && !window.confirm('Are you sure you want to logout?')) {
        return;
    }
    
    localStorage.removeItem('testclinic-user');
    window.location.href = 'login.html';
}

/**
 * Switch to a different user (for demo purposes)
 * @param {string} userType - Type of user (doctor, receptionist, admin)
 */
function switchUser(userType) {
    if (!demoUsers[userType]) {
        console.error('Invalid user type:', userType);
        return;
    }

    const userData = demoUsers[userType];
    
    // Store new user session
    localStorage.setItem('testclinic-user', JSON.stringify({
        role: userType,
        username: userData.username,
        name: userData.name,
        loginTime: new Date().toISOString()
    }));

    // Redirect based on role
    let redirectUrl = 'dashboard.html'; // default
    switch(userType) {
        case 'doctor':
            redirectUrl = 'emr.html';
            break;
        case 'receptionist':
            redirectUrl = 'dashboard.html';
            break;
        case 'admin':
            redirectUrl = 'analytics.html';
            break;
    }

    window.location.href = redirectUrl;
}

/**
 * Initialize user session management on page load
 * Call this in DOMContentLoaded event
 */
function initUserSession() {
    // Update user display
    updateUserDisplay();
    
    // Add event listeners for user dropdown
    const userDropdownToggle = document.getElementById('user-dropdown-toggle');
    const userDropdownMenu = document.getElementById('user-dropdown-menu');
    
    if (userDropdownToggle && userDropdownMenu) {
        userDropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleUserDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdownToggle.contains(e.target) && !userDropdownMenu.contains(e.target)) {
                closeUserDropdown();
            }
        });
    }

    // Add logout event listeners
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });

    // Add switch user event listeners
    const switchUserButtons = document.querySelectorAll('[data-switch-user]');
    switchUserButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const userType = this.getAttribute('data-switch-user');
            switchUser(userType);
        });
    });
}

/**
 * Toggle user dropdown menu
 */
function toggleUserDropdown() {
    const userDropdownMenu = document.getElementById('user-dropdown-menu');
    if (userDropdownMenu) {
        userDropdownMenu.classList.toggle('hidden');
    }
}

/**
 * Close user dropdown menu
 */
function closeUserDropdown() {
    const userDropdownMenu = document.getElementById('user-dropdown-menu');
    if (userDropdownMenu) {
        userDropdownMenu.classList.add('hidden');
    }
}

/**
 * Get user's role-based permissions (for future role-based access control)
 * @returns {Object} Permissions object
 */
function getUserPermissions() {
    const user = getCurrentUser();
    if (!user) return {};

    const permissions = {
        doctor: {
            canAccessEMR: true,
            canViewAnalytics: false,
            canManageUsers: false,
            canViewBilling: true
        },
        receptionist: {
            canAccessEMR: false,
            canViewAnalytics: false,
            canManageUsers: false,
            canViewBilling: true
        },
        admin: {
            canAccessEMR: true,
            canViewAnalytics: true,
            canManageUsers: true,
            canViewBilling: true
        }
    };

    return permissions[user.role] || {};
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.UserSession = {
        getCurrentUser,
        requireLogin,
        updateUserDisplay,
        logout,
        switchUser,
        initUserSession,
        getUserPermissions,
        toggleUserDropdown,
        closeUserDropdown
    };
}