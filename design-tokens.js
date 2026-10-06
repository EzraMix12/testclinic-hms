// design-tokens.js - Modern 2026 Design System
// Foundation design tokens for PulseClinic Hospital Management System
// Implements Requirements: 11.1, 11.2, 11.3, 3.5

const DesignTokens = {
  // Color System (Extended Tailwind Palette)
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#0ea5e9',  // sky-500
      600: '#0284c7',  // sky-600
      700: '#0369a1'   // sky-700
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      800: '#1e293b',
      900: '#0f172a'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.7)',
      dark: 'rgba(15, 23, 42, 0.7)'
    }
  },

  // Typography Scale (Modern 2026)
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace"
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem'  // 36px
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },

  // Spacing Scale (8px base grid system)
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem'   // 64px
  },

  // Border Radius (2026 Trend: Larger Radii)
  borderRadius: {
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    '2xl': '2rem',  // 32px
    full: '9999px'
  },

  // Shadows (Layered Depth)
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
  },

  // Animation Durations
  animation: {
    fast: '150ms',
    base: '250ms',
    slow: '350ms',
    slower: '500ms'
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Touch Target Sizes (WCAG 2.1 AAA)
  touchTarget: {
    min: '44px',        // Minimum for mobile
    comfortable: '48px' // Comfortable target size
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  }
};

// Export for use in components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DesignTokens;
}
