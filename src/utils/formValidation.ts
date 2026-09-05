// Enterprise Form Validation & Input Sanitization Utilities

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. user@example.com).' };
  }
  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Mobile phone number is required.' };
  }
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  if (!/^\d{10}$/.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid 10-digit mobile number.' };
  }
  return { isValid: true };
};

export const validateAadhaar = (aadhaar: string): ValidationResult => {
  if (!aadhaar || !aadhaar.trim()) {
    return { isValid: false, error: 'Aadhaar Card number is required.' };
  }
  const cleanAadhaar = aadhaar.replace(/\s/g, '');
  if (!/^\d{12}$/.test(cleanAadhaar)) {
    return { isValid: false, error: 'Aadhaar number must contain exactly 12 digits.' };
  }
  return { isValid: true };
};

export const validatePan = (pan: string): ValidationResult => {
  if (!pan || !pan.trim()) {
    return { isValid: false, error: 'PAN Card number is required.' };
  }
  const cleanPan = pan.trim().toUpperCase();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
    return { isValid: false, error: 'Invalid PAN Card format (e.g. ABCDE1234F).' };
  }
  return { isValid: true };
};

export const validateAmount = (amount: number | string, label: string = 'Amount'): ValidationResult => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num <= 0) {
    return { isValid: false, error: `${label} must be a positive number greater than 0.` };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true };
};
