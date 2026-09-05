/**
 * Midnight Bloom - Universal Input Validation & Sanitization Framework
 * Ensures strict data integrity, XSS protection, and real-time field validation.
 */

// 1. Email Validation (RFC 5322 Compliant)
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email address is required.' };
  }
  const cleanEmail = email.trim();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@domain.com).' };
  }
  if (cleanEmail.length > 254) {
    return { isValid: false, error: 'Email address cannot exceed 254 characters.' };
  }
  return { isValid: true, error: null, value: cleanEmail.toLowerCase() };
};

// 2. Mobile Phone Validation (Indian 10-Digit)
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Mobile number is required for courier delivery updates.' };
  }
  const digitsOnly = phone.replace(/\D/g, '');
  
  let standard10 = digitsOnly;
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    standard10 = digitsOnly.slice(2);
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    standard10 = digitsOnly.slice(1);
  }

  const indianPhoneRegex = /^[6-9]\d{9}$/;
  if (!indianPhoneRegex.test(standard10)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).' 
    };
  }
  return { isValid: true, error: null, value: `+91 ${standard10}` };
};

// 3. Indian 6-Digit PIN Code Validation
export const validatePincode = (pincode) => {
  if (!pincode || typeof pincode !== 'string') {
    return { isValid: false, error: '6-digit PIN code is required.' };
  }
  const cleanPin = pincode.replace(/\D/g, '').trim();
  const pinRegex = /^[1-9][0-9]{5}$/;
  
  if (!pinRegex.test(cleanPin)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid 6-digit Indian PIN code (e.g. 400018).' 
    };
  }
  return { isValid: true, error: null, value: cleanPin };
};

// 4. Full Name / Alias Validation
export const validateName = (name, fieldLabel = 'Name') => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: `${fieldLabel} is required.` };
  }
  const cleanName = name.trim();
  if (cleanName.length < 2) {
    return { isValid: false, error: `${fieldLabel} must be at least 2 characters long.` };
  }
  if (cleanName.length > 60) {
    return { isValid: false, error: `${fieldLabel} cannot exceed 60 characters.` };
  }
  const nameRegex = /^[a-zA-Z\s.'\-]+$/;
  if (!nameRegex.test(cleanName)) {
    return { isValid: false, error: `${fieldLabel} should only contain letters and standard punctuation.` };
  }
  return { isValid: true, error: null, value: cleanName };
};

// 5. Password Validation & Strength Rating
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required.', strength: 'Weak' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.', strength: 'Weak' };
  }
  
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let strength = 'Weak';
  if (score >= 3) strength = 'Strong';
  else if (score >= 2) strength = 'Medium';

  return { isValid: true, error: null, strength, value: password };
};

// 6. Street Address Validation
export const validateAddress = (address, fieldLabel = 'Street Address') => {
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: `${fieldLabel} is required.` };
  }
  const cleanAddr = address.trim();
  if (cleanAddr.length < 5) {
    return { isValid: false, error: `${fieldLabel} must be at least 5 characters long for doorstep delivery.` };
  }
  if (cleanAddr.length > 250) {
    return { isValid: false, error: `${fieldLabel} cannot exceed 250 characters.` };
  }
  return { isValid: true, error: null, value: cleanAddr };
};

// 7. 6-Digit OTP Code Validation
export const validateOtp = (otp) => {
  if (!otp || typeof otp !== 'string') {
    return { isValid: false, error: 'Please enter the 6-digit verification code.' };
  }
  const cleanOtp = otp.replace(/\D/g, '').trim();
  if (cleanOtp.length !== 6) {
    return { isValid: false, error: 'Verification code must be exactly 6 digits.' };
  }
  return { isValid: true, error: null, value: cleanOtp };
};

// 8. Positive Number / Price / Stock Validation
export const validatePositiveNumber = (val, fieldLabel = 'Value', allowZero = false) => {
  const num = parseFloat(val);
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldLabel} must be a valid number.` };
  }
  if (!allowZero && num <= 0) {
    return { isValid: false, error: `${fieldLabel} must be greater than zero.` };
  }
  if (allowZero && num < 0) {
    return { isValid: false, error: `${fieldLabel} cannot be negative.` };
  }
  return { isValid: true, error: null, value: num };
};

// 9. Sanitization helper
export const sanitizeText = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
};