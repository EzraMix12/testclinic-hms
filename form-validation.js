/**
 * Form Validation Module for PulseClinic Hospital Management System
 * Task 7: Form Validation and Feedback
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 15.2, 5.2, 5.6, 5.8
 */

// ========================================
// Validation Rules and Patterns
// ========================================

const ValidationRules = {
  // Phone number pattern (Philippine format)
  phone: /^(\+63|0)?9\d{9}$/,
  
  // Email pattern (basic)
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Name pattern (letters, spaces, hyphens)
  name: /^[a-zA-Z\s\-']+$/,
  
  // Number pattern
  number: /^\d+$/
};

// Error messages
const ErrorMessages = {
  required: 'This field is required',
  phone: 'Please enter a valid phone number (e.g., 09123456789)',
  email: 'Please enter a valid email address',
  name: 'Please enter a valid name (letters only)',
  number: 'Please enter a valid number',
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must be no more than ${max} characters`,
  min: (min) => `Must be at least ${min}`,
  max: (max) => `Must be no more than ${max}`
};

// ========================================
// ARIA Live Region for Screen Reader Announcements
// Subtask 7.4 - Requirement 14.5, 5.8
// ========================================

class AriaAnnouncer {
  constructor() {
    this.liveRegion = null;
    this.init();
  }
  
  init() {
    // Check if live region already exists
    this.liveRegion = document.getElementById('sr-announcements');
    
    // Create if it doesn't exist
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.id = 'sr-announcements';
      this.liveRegion.className = 'sr-announcements';
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.setAttribute('role', 'status');
      document.body.appendChild(this.liveRegion);
    }
  }
  
  announce(message) {
    // Clear previous message
    this.liveRegion.textContent = '';
    
    // Set new message after a brief delay to ensure screen readers detect the change
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  }
  
  clear() {
    this.liveRegion.textContent = '';
  }
}

// Global announcer instance
const announcer = new AriaAnnouncer();

// ========================================
// Form Validator Class
// ========================================

class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.fields = new Map();
    this.validationAttempted = false;
    
    if (!this.form) {
      console.error(`Form with id "${formId}" not found`);
      return;
    }
    
    this.init();
  }
  
  init() {
    // Initialize fields and add event listeners
    this.scanFields();
    this.attachEventListeners();
  }
  
  scanFields() {
    // Find all input, select, and textarea elements
    const inputs = this.form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Skip buttons and hidden inputs
      if (input.type === 'submit' || input.type === 'button' || input.type === 'hidden') {
        return;
      }
      
      // Store field configuration
      this.fields.set(input.id, {
        element: input,
        errorElement: null,
        rules: this.extractRules(input)
      });
      
      // Create error message container
      this.createErrorElement(input);
      
      // Mark required fields with visual indicator (Subtask 7.3)
      if (input.hasAttribute('required')) {
        this.markRequired(input);
      }
    });
  }
  
  extractRules(input) {
    const rules = {};
    
    // Required validation
    if (input.hasAttribute('required')) {
      rules.required = true;
    }
    
    // Type-based validation
    if (input.type === 'email') {
      rules.email = true;
    }
    
    if (input.type === 'tel' || input.getAttribute('data-validation') === 'phone') {
      rules.phone = true;
    }
    
    if (input.type === 'number') {
      rules.number = true;
      
      // Min/max for numbers
      if (input.hasAttribute('min')) {
        rules.min = parseInt(input.getAttribute('min'));
      }
      if (input.hasAttribute('max')) {
        rules.max = parseInt(input.getAttribute('max'));
      }
    }
    
    // Length validation
    if (input.hasAttribute('minlength')) {
      rules.minLength = parseInt(input.getAttribute('minlength'));
    }
    if (input.hasAttribute('maxlength')) {
      rules.maxLength = parseInt(input.getAttribute('maxlength'));
    }
    
    // Name validation
    if (input.getAttribute('data-validation') === 'name') {
      rules.name = true;
    }
    
    return rules;
  }
  
  // Subtask 7.1 - Create error message element
  createErrorElement(input) {
    const field = this.fields.get(input.id);
    if (!field) return;
    
    // Create error message span
    const errorElement = document.createElement('span');
    errorElement.id = `${input.id}-error`;
    errorElement.className = 'error-message hidden';
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'polite');
    
    // Insert after input element
    input.parentNode.insertBefore(errorElement, input.nextSibling);
    
    // Link input to error message via aria-describedby
    input.setAttribute('aria-describedby', errorElement.id);
    
    // Store reference
    field.errorElement = errorElement;
  }
  
  // Subtask 7.3 - Mark required fields with visual indicator
  markRequired(input) {
    // Find the label for this input
    const label = this.form.querySelector(`label[for="${input.id}"]`);
    
    if (label && !label.classList.contains('required')) {
      label.classList.add('required');
      
      // Add aria-required attribute to input
      input.setAttribute('aria-required', 'true');
    }
  }
  
  attachEventListeners() {
    // Real-time validation on blur (Subtask 7.2 - Requirement 14.3)
    this.fields.forEach((field, fieldId) => {
      const input = field.element;
      
      // Validate on blur
      input.addEventListener('blur', () => {
        if (this.validationAttempted || input.value.length > 0) {
          this.validateField(fieldId);
        }
      });
      
      // Real-time validation for format-specific fields (phone, email)
      if (field.rules.phone || field.rules.email) {
        input.addEventListener('input', () => {
          if (this.validationAttempted || input.value.length > 0) {
            this.validateField(fieldId);
          }
        });
      }
      
      // Clear error when user starts typing (Requirement 14.2)
      input.addEventListener('input', () => {
        if (field.errorElement && !field.errorElement.classList.contains('hidden')) {
          // Only clear if the field might be valid now
          const value = input.value.trim();
          if (value.length > 0 || !field.rules.required) {
            this.clearFieldError(fieldId);
          }
        }
      });
    });
    
    // Prevent form submission if validation fails
    this.form.addEventListener('submit', (e) => {
      this.validationAttempted = true;
      
      if (!this.validateForm()) {
        e.preventDefault();
        
        // Focus first invalid field (Subtask 7.4 - Requirement 14.5)
        this.focusFirstInvalidField();
      }
    });
  }
  
  // Validate single field
  validateField(fieldId) {
    const field = this.fields.get(fieldId);
    if (!field) return true;
    
    const input = field.element;
    const value = input.value.trim();
    const rules = field.rules;
    
    // Required validation
    if (rules.required && value.length === 0) {
      this.showFieldError(fieldId, ErrorMessages.required);
      return false;
    }
    
    // Skip other validations if field is empty and not required
    if (value.length === 0) {
      this.clearFieldError(fieldId);
      return true;
    }
    
    // Email validation
    if (rules.email && !ValidationRules.email.test(value)) {
      this.showFieldError(fieldId, ErrorMessages.email);
      return false;
    }
    
    // Phone validation (Subtask 7.2 - Requirement 14.3)
    if (rules.phone && !ValidationRules.phone.test(value)) {
      this.showFieldError(fieldId, ErrorMessages.phone);
      return false;
    }
    
    // Name validation
    if (rules.name && !ValidationRules.name.test(value)) {
      this.showFieldError(fieldId, ErrorMessages.name);
      return false;
    }
    
    // Number validation
    if (rules.number && !ValidationRules.number.test(value)) {
      this.showFieldError(fieldId, ErrorMessages.number);
      return false;
    }
    
    // Min/max for numbers
    if (rules.min !== undefined) {
      const numValue = parseFloat(value);
      if (numValue < rules.min) {
        this.showFieldError(fieldId, ErrorMessages.min(rules.min));
        return false;
      }
    }
    
    if (rules.max !== undefined) {
      const numValue = parseFloat(value);
      if (numValue > rules.max) {
        this.showFieldError(fieldId, ErrorMessages.max(rules.max));
        return false;
      }
    }
    
    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      this.showFieldError(fieldId, ErrorMessages.minLength(rules.minLength));
      return false;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      this.showFieldError(fieldId, ErrorMessages.maxLength(rules.maxLength));
      return false;
    }
    
    // All validations passed
    this.clearFieldError(fieldId);
    return true;
  }
  
  // Subtask 7.1 - Show error message (Requirement 14.1)
  showFieldError(fieldId, message) {
    const field = this.fields.get(fieldId);
    if (!field) return;
    
    const input = field.element;
    const errorElement = field.errorElement;
    
    // Add error class to input
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    
    // Show error message
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
  }
  
  // Subtask 7.1 - Clear error message (Requirement 14.2)
  clearFieldError(fieldId) {
    const field = this.fields.get(fieldId);
    if (!field) return;
    
    const input = field.element;
    const errorElement = field.errorElement;
    
    // Remove error class from input
    input.classList.remove('error');
    input.setAttribute('aria-invalid', 'false');
    
    // Hide error message
    errorElement.textContent = '';
    errorElement.classList.add('hidden');
  }
  
  // Validate entire form
  validateForm() {
    let isValid = true;
    const invalidFields = [];
    
    this.fields.forEach((field, fieldId) => {
      if (!this.validateField(fieldId)) {
        isValid = false;
        invalidFields.push(field.element);
      }
    });
    
    // Announce validation result to screen readers (Subtask 7.4)
    if (!isValid) {
      const errorCount = invalidFields.length;
      const message = `Form validation failed. ${errorCount} field${errorCount > 1 ? 's' : ''} ${errorCount > 1 ? 'have' : 'has'} errors. Please correct them and try again.`;
      announcer.announce(message);
    }
    
    return isValid;
  }
  
  // Subtask 7.4 - Focus first invalid field (Requirement 14.5)
  focusFirstInvalidField() {
    for (const [fieldId, field] of this.fields) {
      if (field.element.classList.contains('error')) {
        field.element.focus();
        
        // Scroll into view if necessary
        field.element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        break;
      }
    }
  }
  
  // Public method to manually trigger validation
  validate() {
    this.validationAttempted = true;
    return this.validateForm();
  }
  
  // Public method to reset form validation
  reset() {
    this.validationAttempted = false;
    
    this.fields.forEach((field, fieldId) => {
      this.clearFieldError(fieldId);
    });
    
    announcer.clear();
  }
}

// ========================================
// Utility Functions
// ========================================

/**
 * Initialize validation for a form
 * @param {string} formId - The ID of the form element
 * @returns {FormValidator} - The validator instance
 */
function initFormValidation(formId) {
  return new FormValidator(formId);
}

/**
 * Validate a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
function validatePhone(phone) {
  return ValidationRules.phone.test(phone);
}

/**
 * Validate an email
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function validateEmail(email) {
  return ValidationRules.email.test(email);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FormValidator,
    initFormValidation,
    validatePhone,
    validateEmail,
    ValidationRules,
    ErrorMessages
  };
}
