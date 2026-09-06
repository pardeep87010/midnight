import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXmark, 
  faEye, 
  faEyeSlash, 
  faEnvelope, 
  faLock, 
  faKey, 
  faArrowLeft, 
  faArrowRight,
  faRotateRight, 
  faShieldHalved,
  faAward,
  faTruck,
  faCircleCheck,
  faTriangleExclamation,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { validateEmail, validatePassword, validateOtp, validateName } from '../utils/validation';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode,
    setUser, 
    showToast, 
    navigateTo,
    authModalRedirect,
    authenticateGoogleToken 
  } = useApp();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  // Validation Errors State
  const [formErrors, setFormErrors] = useState({});
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register State (Full Name, Email, Password, Confirm Password, OTP)
  const [regStep, setRegStep] = useState(1); // 1: Info, 2: OTP
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regAgeConsent, setRegAgeConsent] = useState(true);
  const [regOtp, setRegOtp] = useState('');
  const [regTimer, setRegTimer] = useState(60);

  // Forgot Password State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [resetTimer, setResetTimer] = useState(60);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleSetupOpen, setIsGoogleSetupOpen] = useState(false);
  const [setupClientId, setSetupClientId] = useState('');
  const [setupClientSecret, setSetupClientSecret] = useState('');
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const videoRef = useRef(null);

  const prevIsOpenRef = useRef(false);

  // Sync mode with prop
  useEffect(() => {
    if (isAuthModalOpen) {
      if (!prevIsOpenRef.current) {
        setActiveTab(authModalMode === 'register' ? 'register' : 'login');
        setIsForgotPassword(false);
        setIsGoogleSetupOpen(false);
        setFormErrors({});
        setRegStep(1);
        setResetStep(1);
        setRegOtp('');
        setResetOtp('');
        setRegName('');
        setRegConfirmPassword('');
        setShowRegPassword(false);
        setShowRegConfirmPassword(false);
      }
      prevIsOpenRef.current = true;

      // Pre-populate stored Google Client ID if available
      try {
        const saved = localStorage.getItem('mb_env_config');
        if (saved) {
          const cfg = JSON.parse(saved);
          if (cfg.GOOGLE_CLIENT_ID && !cfg.GOOGLE_CLIENT_ID.includes('xxxxxxxx')) {
            setSetupClientId(cfg.GOOGLE_CLIENT_ID);
          }
          if (cfg.GOOGLE_CLIENT_SECRET && !cfg.GOOGLE_CLIENT_SECRET.includes('xxxxxxxx')) {
            setSetupClientSecret(cfg.GOOGLE_CLIENT_SECRET);
          }
        }
      } catch (e) {}
    } else {
      prevIsOpenRef.current = false;
    }
  }, [isAuthModalOpen, authModalMode]);

  // Timers
  useEffect(() => {
    let interval = null;
    if (isAuthModalOpen && activeTab === 'register' && regStep === 2 && regTimer > 0) {
      interval = setInterval(() => setRegTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isAuthModalOpen, activeTab, regStep, regTimer]);

  useEffect(() => {
    let interval = null;
    if (isAuthModalOpen && isForgotPassword && resetStep === 2 && resetTimer > 0) {
      interval = setInterval(() => setResetTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isAuthModalOpen, isForgotPassword, resetStep, resetTimer]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Complete Auth Success
  const handleAuthSuccess = (userObj, successMsg) => {
    setUser(userObj);
    try {
      localStorage.setItem('mb_user', JSON.stringify(userObj));
      if (userObj.isAdmin) {
        localStorage.setItem('mb_admin_token', 'mb_admin_live_token_2026_sec_bloom');
      }
    } catch (e) {}

    showToast(successMsg, 'success');
    closeAuthModal();

    if (authModalRedirect) {
      navigateTo(authModalRedirect);
    } else if (userObj.isAdmin) {
      navigateTo('admin');
    }
  };

  // Helper to extract configured Google Client ID
  const getValidGoogleClientId = () => {
    try {
      const saved = localStorage.getItem('mb_env_config');
      if (saved) {
        const cfg = JSON.parse(saved);
        if (cfg.GOOGLE_CLIENT_ID && !cfg.GOOGLE_CLIENT_ID.includes('xxxxxxxx') && cfg.GOOGLE_CLIENT_ID.trim().length > 10) {
          return cfg.GOOGLE_CLIENT_ID.trim();
        }
      }
    } catch (e) {}
    return '';
  };

  // Initialize Google Identity Services (GSI) One-Tap / ID Token listener when modal opens
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const clientId = getValidGoogleClientId();
    if (clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (res) => {
            if (res.credential) {
              setIsLoading(true);
              const authResult = await authenticateGoogleToken(res.credential);
              setIsLoading(false);
              if (!authResult?.success && authResult?.error) {
                setFormErrors({ general: authResult.error });
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });
      } catch (e) {
        console.warn('GSI ID init notice:', e);
      }
    }
  }, [isAuthModalOpen]);

  // Trigger Google Identity Services or OAuth 2.0 Account Picker Popup
  const triggerGoogleOAuth = (clientId) => {
    setIsLoading(true);
    setFormErrors({});

    // 1. If Google Identity Services (GSI) oauth2 token client is available
    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setIsLoading(false);
              const errTxt = tokenResponse.error_description || tokenResponse.error;
              showToast(`Google Sign-In notice: ${errTxt}`, 'warning');
              setFormErrors({ general: `Google notice: ${errTxt}` });
              return;
            }
            if (tokenResponse.access_token) {
              setIsLoading(true);
              const result = await authenticateGoogleToken(tokenResponse.access_token);
              setIsLoading(false);
              if (!result?.success && result?.error) {
                setFormErrors({ general: result.error });
              }
            }
          }
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        setIsLoading(false);
        return;
      } catch (err) {
        console.warn('GSI token client notice, fallback to OAuth URL:', err);
      }
    }

    // 2. Direct Fallback: Google OAuth 2.0 Web Popup with ID Token & Access Token
    try {
      const redirectUri = window.location.origin;
      const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token%20id_token&scope=openid%20email%20profile&nonce=${encodeURIComponent(nonce)}&prompt=select_account`;
      
      const width = 520;
      const height = 640;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        oauthUrl,
        'GoogleSignIn',
        `width=${width},height=${height},left=${left},top=${top},status=0,menubar=0,toolbar=0,location=1`
      );

      if (!popup) {
        showToast('Google popup was blocked. Please allow popups for this site.', 'warning');
        setFormErrors({ general: 'Google popup was blocked by your browser. Please allow popups and try again.' });
      }
    } catch (err) {
      showToast('Error opening Google authentication window.', 'error');
      setFormErrors({ general: 'Error opening Google authentication window. Please check your connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Main Google Auth Initiator
  const handleGoogleAuth = async () => {
    setFormErrors({});
    let clientId = getValidGoogleClientId();

    if (!clientId) {
      // Fetch from backend API
      try {
        const res = await fetch('/api/auth/google/client-id');
        const data = await res.json();
        if (data.clientId && !data.clientId.includes('xxxxxxxx') && data.clientId.trim().length > 10) {
          clientId = data.clientId.trim();
        }
      } catch (e) {}
    }

    if (!clientId) {
      // Open interactive setup dialog so user can enter Google Client ID
      setIsGoogleSetupOpen(true);
      return;
    }

    triggerGoogleOAuth(clientId);
  };

  // Save Google Client ID & immediately start Google Login
  const handleSaveGoogleConfigAndLogin = async (e) => {
    e.preventDefault();
    const cleanId = setupClientId.trim();
    if (!cleanId || cleanId.length < 10) {
      showToast('Please enter a valid Google Client ID', 'warning');
      return;
    }

    setIsConnectingGoogle(true);
    try {
      const existing = JSON.parse(localStorage.getItem('mb_env_config') || '{}');
      const updated = {
        ...existing,
        GOOGLE_CLIENT_ID: cleanId,
        ...(setupClientSecret.trim() ? { GOOGLE_CLIENT_SECRET: setupClientSecret.trim() } : {})
      };
      localStorage.setItem('mb_env_config', JSON.stringify(updated));

      // Sync to backend
      await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        },
        body: JSON.stringify({
          GOOGLE_CLIENT_ID: cleanId,
          ...(setupClientSecret.trim() ? { GOOGLE_CLIENT_SECRET: setupClientSecret.trim() } : {})
        })
      }).catch(err => console.warn('Backend sync notice:', err));

      setIsGoogleSetupOpen(false);
      showToast('Google Client ID connected! Opening Google Sign-In...', 'success');

      setTimeout(() => {
        triggerGoogleOAuth(cleanId);
      }, 300);
    } catch (err) {
      showToast('Failed to save Google Client ID', 'error');
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  // Clear field errors on input change
  const handleFieldChange = (field, val, setter) => {
    setter(val);
    if (formErrors[field] || formErrors.general) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        delete copy.general;
        return copy;
      });
    }
  };

  // Standard Login Submit with Backend Auth & Conflict Handling
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const emailCheck = validateEmail(loginEmail);
    const passCheck = validatePassword(loginPassword);

    const errors = {};
    if (!emailCheck.isValid) errors.loginEmail = emailCheck.error;
    if (!passCheck.isValid) errors.loginPassword = passCheck.error;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast(errors.loginEmail || errors.loginPassword, 'warning');
      return;
    }
    setFormErrors({});

    const cleanEmail = emailCheck.value;
    const cleanPassword = loginPassword.trim();

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        handleAuthSuccess(data.user, data.message || `Welcome back, ${data.user.name}.`);
      } else {
        const errorMsg = data.error || 'Invalid credentials. Please verify your email and password.';
        setFormErrors({ general: errorMsg });
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      const errMsg = 'Network error while signing in. Please verify your connection.';
      setFormErrors({ general: errMsg });
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Register Step 1: Validate Full Name, Email, Password, Confirm Password, Age Consent & Send OTP
  const handleRegisterSendOtp = async (e) => {
    e.preventDefault();
    const nameCheck = validateName(regName, 'Full Name / Alias');
    const emailCheck = validateEmail(regEmail);
    const passCheck = validatePassword(regPassword);

    const errors = {};
    if (!nameCheck.isValid) errors.regName = nameCheck.error;
    if (!emailCheck.isValid) errors.regEmail = emailCheck.error;
    if (!passCheck.isValid) errors.regPassword = passCheck.error;
    
    if (!regConfirmPassword) {
      errors.regConfirmPassword = 'Confirm password is required.';
    } else if (regPassword !== regConfirmPassword) {
      errors.regConfirmPassword = 'Passwords do not match. Please ensure both passwords are identical.';
    }

    if (!regAgeConsent) errors.regAgeConsent = 'You must certify you are 18+ to create an account.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast(errors.regName || errors.regEmail || errors.regPassword || errors.regConfirmPassword || errors.regAgeConsent, 'warning');
      return;
    }
    setFormErrors({});

    const cleanEmail = emailCheck.value;
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, type: 'register' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRegStep(2);
        setRegTimer(60);
        showToast(data.message || `Verification code dispatched to ${cleanEmail}.`, 'success');
      } else {
        const errorMsg = data.error || 'Failed to dispatch verification email.';
        setFormErrors({ general: errorMsg });
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      const errMsg = 'Error connecting to email verification service. Please try again.';
      setFormErrors({ general: errMsg });
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Register Step 2: Verify Real OTP & Create Account via Backend
  const handleRegisterVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCheck = validateOtp(regOtp);
    if (!otpCheck.isValid) {
      setFormErrors({ regOtp: otpCheck.error });
      showToast(otpCheck.error, 'warning');
      return;
    }
    setFormErrors({});

    setIsLoading(true);
    const cleanEmail = regEmail.trim().toLowerCase();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: regName.trim(),
          email: cleanEmail, 
          password: regPassword.trim(),
          confirmPassword: regConfirmPassword.trim(),
          otp: otpCheck.value 
        })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        handleAuthSuccess(data.user, data.message || `Account verified! Welcome, ${data.user.name}. 200 VIP Points added!`);
      } else {
        const errorMsg = data.error || 'Invalid OTP. Please check the 6-digit code and try again.';
        setFormErrors({ general: errorMsg, regOtp: errorMsg });
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      const errMsg = 'Error verifying registration. Please try again.';
      setFormErrors({ general: errMsg });
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password: Send OTP via Backend
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    const emailCheck = validateEmail(resetEmail);
    if (!emailCheck.isValid) {
      setFormErrors({ resetEmail: emailCheck.error });
      showToast(emailCheck.error, 'warning');
      return;
    }
    setFormErrors({});

    const cleanEmail = emailCheck.value;
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, type: 'reset' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetStep(2);
        setResetTimer(60);
        showToast(data.message || `Reset code sent to ${cleanEmail}.`, 'success');
      } else {
        const errorMsg = data.error || 'Failed to dispatch password reset code.';
        setFormErrors({ general: errorMsg, resetEmail: errorMsg });
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      const errMsg = 'Error connecting to reset service. Please try again.';
      setFormErrors({ general: errMsg });
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password: Reset Submit via Backend
  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    const otpCheck = validateOtp(resetOtp);
    const passCheck = validatePassword(resetNewPassword);

    const errors = {};
    if (!otpCheck.isValid) errors.resetOtp = otpCheck.error;
    if (!passCheck.isValid) errors.resetNewPassword = passCheck.error;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast(errors.resetOtp || errors.resetNewPassword, 'warning');
      return;
    }
    setFormErrors({});

    setIsLoading(true);
    const cleanEmail = resetEmail.trim().toLowerCase();
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          otp: otpCheck.value,
          newPassword: resetNewPassword.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Password updated successfully! Please sign in.', 'success');
        setLoginEmail(cleanEmail);
        setIsForgotPassword(false);
        setActiveTab('login');
      } else {
        const errorMsg = data.error || 'Invalid reset code or password update failed.';
        setFormErrors({ general: errorMsg });
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      const errMsg = 'Error resetting password. Please try again.';
      setFormErrors({ general: errMsg });
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-xl animate-fade-in font-sans">
      
      {/* Background Click to Dismiss */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      {/* Main Floating Modal Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-[#16171C] border border-[#B56571]/35 dark:border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col md:flex-row animate-scale-up">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: ATMOSPHERIC VIDEO SHOWCASE (DESKTOP ONLY) */}
        {/* ========================================================= */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative overflow-hidden flex-col justify-between p-8 sm:p-10 bg-black shrink-0">
          
          {/* Looping Atmospheric Background Video */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover scale-105 opacity-85 pointer-events-none"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            <source src="/footer-video.mp4" type="video/mp4" />
          </video>

          {/* Liquid Mirror Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-black/45 to-black/70 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/80 pointer-events-none z-10" />

          {/* Top Brand Header */}
          <div className="relative z-20 space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-black/60 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#D98A92] animate-pulse" />
              <span className="text-[10px] text-[#F0B8BE] uppercase tracking-[0.25em] font-mono font-bold">
                PRIVATE SANCTUARY
              </span>
            </div>
            <h3 className="font-serif text-3xl lg:text-4xl text-white font-bold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Midnight Bloom
            </h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              India's #1 Luxury Adult Toys & Sensual Wellness Superstore.
            </p>
          </div>

          {/* Bottom Trust & VIP Benefits Banner */}
          <div className="relative z-20 space-y-3 pt-6 border-t border-white/15 text-xs text-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-[#B56571]/20 border border-[#B56571]/35 flex items-center justify-center text-[#D98A92]">
                <FontAwesomeIcon icon={faLock} className="text-xs" />
              </div>
              <span className="font-medium">100% Plain Unbranded Outer Packaging</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-[#B56571]/20 border border-[#B56571]/35 flex items-center justify-center text-[#D98A92]">
                <FontAwesomeIcon icon={faAward} className="text-xs" />
              </div>
              <span className="font-medium">200 Welcome VIP Sanctuary Points</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-[#B56571]/20 border border-[#B56571]/35 flex items-center justify-center text-[#D98A92]">
                <FontAwesomeIcon icon={faTruck} className="text-xs" />
              </div>
              <span className="font-medium">Cash on Delivery Across 20,000+ Pincodes</span>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE AUTHENTICATION FORM */}
        {/* ========================================================= */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-6 sm:p-8 md:p-10 overflow-y-auto max-h-[92vh] flex flex-col justify-between relative bg-[#18191E]/98">
          
          {/* Top Close Button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-[#B56571] text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer z-30 shadow-md"
            aria-label="Close Authentication Window"
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>

          <div className="space-y-6">
            
            {/* Tab Switcher (Sign In vs Create Account) */}
            {!isForgotPassword && !isGoogleSetupOpen && (
              <div className="flex bg-black/50 p-1 rounded-2xl border border-white/10 max-w-xs mx-auto mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setAuthModalMode('login');
                  }}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-gradient-to-r from-[#B56571] to-[#8A434E] text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setAuthModalMode('register');
                  }}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-gradient-to-r from-[#B56571] to-[#8A434E] text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* ===================================================== */}
            {/* VIEW: GOOGLE OAUTH 2.0 CONNECT & SETUP DIALOG */}
            {/* ===================================================== */}
            {isGoogleSetupOpen && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto shadow-inner">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Google Sign-In Connection
                  </h3>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed max-w-sm mx-auto">
                    Apne Google Cloud Console ka <strong className="text-[#D98A92]">Google Client ID</strong> yahan enter karein taaki Google ka live account selector popup open ho sake.
                  </p>
                </div>

                <form onSubmit={handleSaveGoogleConfigAndLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300 block font-medium">Google Client ID</label>
                    <input
                      type="text"
                      required
                      value={setupClientId}
                      onChange={(e) => setSetupClientId(e.target.value)}
                      placeholder="e.g. 104829104829-xxxxxxx.apps.googleusercontent.com"
                      className="w-full bg-[#121316] border border-white/15 focus:border-[#B56571] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300 block font-medium">
                      Google Client Secret <span className="text-[10px] text-neutral-500">(Optional)</span>
                    </label>
                    <input
                      type="password"
                      value={setupClientSecret}
                      onChange={(e) => setSetupClientSecret(e.target.value)}
                      placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full bg-[#121316] border border-white/15 focus:border-[#B56571] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1 text-[11px] text-neutral-400">
                    <div className="flex items-center justify-between text-neutral-300 font-mono">
                      <span>Authorized JavaScript Origin:</span>
                    </div>
                    <code className="block bg-[#121316] p-1.5 rounded text-[10px] text-[#D98A92] font-mono break-all select-all">
                      {window.location.origin}
                    </code>
                  </div>

                  <button
                    type="submit"
                    disabled={isConnectingGoogle}
                    className="w-full btn-gold py-3.5 rounded-full font-bold uppercase tracking-wider text-xs text-white shadow-xl cursor-pointer"
                  >
                    {isConnectingGoogle ? 'CONNECTING GOOGLE...' : 'CONNECT & SIGN IN WITH GOOGLE'}
                  </button>
                </form>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      closeAuthModal();
                      navigateTo('admin');
                    }}
                    className="text-[#D98A92] hover:underline cursor-pointer"
                  >
                    Open Admin Panel (ENV Manager)
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGoogleSetupOpen(false)}
                    className="text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Back to Normal Sign In
                  </button>
                </div>
              </div>
            )}

            {/* ===================================================== */}
            {/* VIEW A: SIGN IN FORM */}
            {/* ===================================================== */}
            {activeTab === 'login' && !isForgotPassword && !isGoogleSetupOpen && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center space-y-1">
                  <h3 className="text-2xl sm:text-3xl text-white font-serif font-bold tracking-tight">
                    Welcome Back
                  </h3>
                  <p className="text-xs text-neutral-400 font-light">
                    Access your encrypted orders and member privileges.
                  </p>
                </div>

                {/* Conflict / General Error Alert Banner */}
                {formErrors.general && (
                  <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-2xl flex items-start space-x-3 text-red-200 text-xs animate-shake">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 mt-0.5 shrink-0 text-sm" />
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-red-200 leading-snug">{formErrors.general}</p>
                      {formErrors.general.toLowerCase().includes('google') && (
                        <button
                          type="button"
                          onClick={handleGoogleAuth}
                          className="text-xs font-bold text-[#D98A92] hover:text-white underline cursor-pointer flex items-center gap-1.5 pt-1"
                        >
                          <span>Click here to Sign In with Google</span>
                          <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 1-Click Google Sign In */}
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full bg-[#20222A] hover:bg-[#282B35] border border-white/15 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-xs active:scale-[0.98] font-medium text-xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsGoogleSetupOpen(true)}
                      className="text-[10px] text-neutral-500 hover:text-[#D98A92] cursor-pointer"
                    >
                      Configure Google Client ID ⚙️
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[10px] font-mono uppercase text-neutral-500">OR EMAIL SIGN IN</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300 block font-medium">Email / Gmail Address</label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => handleFieldChange('loginEmail', e.target.value, setLoginEmail)}
                        className={`w-full bg-[#121316] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none font-sans pl-10 ${
                          formErrors.loginEmail ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#B56571]'
                        }`}
                        placeholder="yourname@gmail.com"
                      />
                      <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 text-neutral-500 text-xs pointer-events-none" />
                    </div>
                    {formErrors.loginEmail && (
                      <p className="text-[11px] text-red-400 font-mono flex items-center gap-1 pt-0.5">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                        <span>{formErrors.loginEmail}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300 block font-medium">Password</label>
                    <div className="relative flex items-center">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => handleFieldChange('loginPassword', e.target.value, setLoginPassword)}
                        className={`w-full bg-[#121316] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none font-sans pl-10 pr-10 ${
                          formErrors.loginPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#B56571]'
                        }`}
                        placeholder="••••••••••••"
                      />
                      <FontAwesomeIcon icon={faLock} className="absolute left-3.5 text-neutral-500 text-xs pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 text-neutral-400 hover:text-[#D98A92] p-1 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={showLoginPassword ? faEyeSlash : faEye} className="text-xs" />
                      </button>
                    </div>
                    {formErrors.loginPassword && (
                      <p className="text-[11px] text-red-400 font-mono flex items-center gap-1 pt-0.5">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                        <span>{formErrors.loginPassword}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-[#121316] border-white/20 text-[#D98A92] accent-[#B56571]"
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(loginEmail);
                        setIsForgotPassword(true);
                        setResetStep(1);
                        setFormErrors({});
                      }}
                      className="text-[#D98A92] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-gold py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all active:scale-95 shadow-xl cursor-pointer text-white"
                  >
                    ENTER SANCTUARY
                  </button>
                </form>
              </div>
            )}

            {/* ===================================================== */}
            {/* VIEW B: FORGOT PASSWORD OTP RECOVERY */}
            {/* ===================================================== */}
            {isForgotPassword && !isGoogleSetupOpen && (
              <div className="space-y-5 animate-fade-in">
                {resetStep === 1 ? (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-2xl font-serif font-bold text-white">Reset Password</h3>
                      <p className="text-xs text-neutral-400 font-light">
                        We will send a confidential 6-digit OTP to your email.
                      </p>
                    </div>

                    {formErrors.general && (
                      <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-2xl flex items-start space-x-3 text-red-200 text-xs animate-shake">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 mt-0.5 shrink-0 text-sm" />
                        <p className="font-semibold text-red-200 leading-snug">{formErrors.general}</p>
                      </div>
                    )}

                    <form onSubmit={handleForgotSendOtp} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-300 block font-medium">Registered Email</label>
                        <input
                          type="email"
                          required
                          value={resetEmail}
                          onChange={(e) => handleFieldChange('resetEmail', e.target.value, setResetEmail)}
                          className={`w-full bg-[#121316] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none ${
                            formErrors.resetEmail ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#B56571]'
                          }`}
                          placeholder="yourname@gmail.com"
                        />
                        {formErrors.resetEmail && (
                          <p className="text-[11px] text-red-400 font-mono flex items-center gap-1 pt-0.5">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                            <span>{formErrors.resetEmail}</span>
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-gold py-3.5 rounded-full font-bold uppercase tracking-wider text-xs text-white cursor-pointer"
                      >
                        {isLoading ? 'SENDING CODE...' : 'SEND RESET OTP'}
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-xs text-neutral-400 hover:text-white flex items-center justify-center space-x-1.5 mx-auto cursor-pointer pt-2"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-2xl font-serif font-bold text-white">Set New Password</h3>
                      <p className="text-xs text-neutral-400 font-light">
                        Enter code sent to <strong className="text-[#D98A92]">{resetEmail}</strong>
                      </p>
                    </div>

                    {formErrors.general && (
                      <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-2xl flex items-start space-x-3 text-red-200 text-xs animate-shake">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 mt-0.5 shrink-0 text-sm" />
                        <p className="font-semibold text-red-200 leading-snug">{formErrors.general}</p>
                      </div>
                    )}

                    <form onSubmit={handleForgotResetSubmit} className="space-y-3.5">
                      <div className="space-y-1 text-center">
                        <label className="text-xs text-neutral-400 font-mono block">6-Digit Reset Code</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={resetOtp}
                          autoFocus
                          onChange={(e) => handleFieldChange('resetOtp', e.target.value.replace(/\D/g, ''), setResetOtp)}
                          className={`w-full bg-[#121316] border rounded-xl py-2.5 text-center text-xl tracking-[0.4em] font-mono font-bold text-white focus:outline-none ${
                            formErrors.resetOtp ? 'border-red-500' : 'border-[#B56571]/30 focus:border-[#B56571]'
                          }`}
                          placeholder="••••••"
                        />
                        {formErrors.resetOtp && (
                          <p className="text-[11px] text-red-400 font-mono flex items-center justify-center gap-1 pt-0.5">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                            <span>{formErrors.resetOtp}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-neutral-300 block font-medium">New Password (Min 6 chars)</label>
                        <div className="relative flex items-center">
                          <input
                            type={showResetNewPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={resetNewPassword}
                            onChange={(e) => handleFieldChange('resetNewPassword', e.target.value, setResetNewPassword)}
                            className={`w-full bg-[#121316] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none pr-10 ${
                              formErrors.resetNewPassword ? 'border-red-500' : 'border-white/10 focus:border-[#B56571]'
                            }`}
                            placeholder="••••••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                            className="absolute right-3 text-neutral-400 hover:text-[#D98A92] p-1 cursor-pointer"
                          >
                            <FontAwesomeIcon icon={showResetNewPassword ? faEyeSlash : faEye} className="text-xs" />
                          </button>
                        </div>
                        {formErrors.resetNewPassword && (
                          <p className="text-[11px] text-red-400 font-mono flex items-center gap-1 pt-0.5">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                            <span>{formErrors.resetNewPassword}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between text-xs text-neutral-400 font-mono">
                        <button type="button" onClick={() => setResetStep(1)} className="hover:text-white cursor-pointer">
                          Change Email
                        </button>
                        {resetTimer > 0 ? (
                          <span>Resend in <strong>{resetTimer}s</strong></span>
                        ) : (
                          <button type="button" onClick={handleForgotSendOtp} className="text-[#D98A92] hover:underline font-bold">
                            Resend Code
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || resetOtp.length < 6 || resetNewPassword.length < 6}
                        className="w-full btn-gold py-3.5 rounded-full font-bold uppercase tracking-wider text-xs text-white cursor-pointer"
                      >
                        RESET & UPDATE PASSWORD
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ===================================================== */}
            {/* VIEW C: CREATE ACCOUNT (REGISTER) FORM */}
            {/* ===================================================== */}
            {activeTab === 'register' && !isForgotPassword && !isGoogleSetupOpen && (
              <div className="space-y-5 animate-fade-in">
                
                {regStep === 1 ? (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-2xl sm:text-3xl text-white font-serif font-bold tracking-tight">
                        Create Private Account
                      </h3>
                      <p className="text-xs text-neutral-400 font-light">
                        Join to unlock 200 VIP Points and member-only pricing.
                      </p>
                    </div>

                    {/* Conflict / General Error Alert Banner */}
                    {formErrors.general && (
                      <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-2xl flex items-start space-x-3 text-red-200 text-xs animate-shake">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 mt-0.5 shrink-0 text-sm" />
                        <div className="space-y-1 flex-1">
                          <p className="font-semibold text-red-200 leading-snug">{formErrors.general}</p>
                          {formErrors.general.toLowerCase().includes('google') && (
                            <button
                              type="button"
                              onClick={handleGoogleAuth}
                              className="text-xs font-bold text-[#D98A92] hover:text-white underline cursor-pointer flex items-center gap-1.5 pt-1"
                            >
                              <span>Click here to Sign In with Google</span>
                              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                            </button>
                          )}
                          {formErrors.general.toLowerCase().includes('password') && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('login');
                                setAuthModalMode('login');
                                setLoginEmail(regEmail);
                                setFormErrors({});
                              }}
                              className="text-xs font-bold text-[#D98A92] hover:text-white underline cursor-pointer flex items-center gap-1.5 pt-1"
                            >
                              <span>Switch to Sign In</span>
                              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 1-Click Google Register */}
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        className="w-full bg-[#20222A] hover:bg-[#282B35] border border-white/15 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-3 transition-all cursor-pointer shadow-xs active:scale-[0.98] font-medium text-xs"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Continue with Google</span>
                      </button>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsGoogleSetupOpen(true)}
                          className="text-[10px] text-neutral-500 hover:text-[#D98A92] cursor-pointer"
                        >
                          Configure Google Client ID ⚙️
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-[10px] font-mono uppercase text-neutral-500">OR REGISTER WITH EMAIL</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <form onSubmit={handleRegisterSendOtp} className="space-y-3.5">
                      {/* Full Name / Alias Input */}
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-300 block font-medium">Full Name / Discreet Alias</label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => handleFieldChange('regName', e.target.value, setRegName)}
                            className={`w-full bg-[#121316] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none pl-10 ${
                              formErrors.regName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#B56571]'
                            }`}
                            placeholder="e.g. Rahul Sharma or Discreet Alias"
                          />
                          <FontAwesomeIcon icon={faUser} className="absolute left-3.5 text-neutral-500 text-xs pointer-events-none" />
                        </div>
                        {formErrors.regName && (
                          <p className="text-[11px] text-red-400 font-mono flex items-center gap-1 pt-0.5">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                            <span>{formErrors.regName}</span>
                          </p>
                        )}
                      </div>

                      {/* Email Address Input */}
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-300 block font-medium">Email / Gmail Address</label>
                        <div className="relative flex items-center">
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => handleFieldChange('regEmail', e.target.value, setRegEmail)}
                            className={`w-full bg-[#121316] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none pl-10 ${
                              formErrors.regEmail ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#B56571]'
                            }`}
                            placeholder="yourname@gmail.com"
                          />
                          <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 text-neutral-500 text-xs pointer-events-none" />
                        </div>
                        {formErrors.regEmail && (
                          <p className="text-[11px] text-red-400 font-mono flex items-center gap-1 pt-0.5">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                            <span>{formErrors.regEmail}</span>
                          </p>
                        )}
                      </div>

                      {/* Password Input */}
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-300 block font-medium">Create Password (Min 6 chars)</label>
                        <div className="relative flex items-center">
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={regPassword}
                            onChange={(e) => handleFieldChange('regPassword', e.target.value, setRegPassword)}
                            className={`w-full bg-[#121316] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none pl-10 pr-10 ${
                              formErrors.regPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#B56571]'
                            }`}
                            placeholder="••••••••••••"
                          />
                          <FontAwesomeIcon icon={faLock} className="absolute left-3.5 text-neutral-500 text-xs pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 text-neutral-400 hover:text-[#D98A92] p-1 cursor-pointer"
                          >
                            <FontAwesomeIcon icon={showRegPassword ? faEyeSlash : faEye} className="text-xs" />
                          </button>
                        </div>
                        {formErrors.regPassword && (
                          <p className="text-[11px] text-red-400 font-mono flex items-center gap-1 pt-0.5">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                            <span>{formErrors.regPassword}</span>
                          </p>
                        )}
                      </div>

                      {/* Confirm Password Input */}
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-300 block font-medium">Confirm Password</label>
                        <div className="relative flex items-center">
                          <input
                            type={showRegConfirmPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={regConfirmPassword}
                            onChange={(e) => handleFieldChange('regConfirmPassword', e.target.value, setRegConfirmPassword)}
                            className={`w-full bg-[#121316] border rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none pl-10 pr-10 ${
                              formErrors.regConfirmPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#B56571]'
                            }`}
                            placeholder="Re-enter identical password"
                          />
                          <FontAwesomeIcon icon={faLock} className="absolute left-3.5 text-neutral-500 text-xs pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                            className="absolute right-3 text-neutral-400 hover:text-[#D98A92] p-1 cursor-pointer"
                          >
                            <FontAwesomeIcon icon={showRegConfirmPassword ? faEyeSlash : faEye} className="text-xs" />
                          </button>
                        </div>
                        {formErrors.regConfirmPassword && (
                          <p className="text-[11px] text-red-400 font-mono flex items-center gap-1 pt-0.5">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                            <span>{formErrors.regConfirmPassword}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex items-start space-x-2 text-xs text-neutral-300">
                          <input
                            type="checkbox"
                            id="modalAgeConsent"
                            checked={regAgeConsent}
                            onChange={(e) => handleFieldChange('regAgeConsent', e.target.checked, setRegAgeConsent)}
                            className="mt-0.5 rounded bg-[#121316] border-white/20 text-[#D98A92] accent-[#B56571]"
                          />
                          <label htmlFor="modalAgeConsent" className="text-[11px] leading-snug cursor-pointer text-neutral-300">
                            I certify I am 18+ years of age and agree to private terms.
                          </label>
                        </div>
                        {formErrors.regAgeConsent && (
                          <p className="text-[11px] text-red-400 font-mono flex items-center gap-1 pt-0.5">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                            <span>{formErrors.regAgeConsent}</span>
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-gold py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all active:scale-95 shadow-xl cursor-pointer text-white"
                      >
                        {isLoading ? 'GENERATING OTP...' : 'SEND VERIFICATION OTP'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-2xl font-serif font-bold text-white">Enter 6-Digit Code</h3>
                      <p className="text-xs text-neutral-400 font-light">
                        We sent a code to <strong className="text-[#D98A92]">{regEmail}</strong>
                      </p>
                    </div>

                    {formErrors.general && (
                      <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-2xl flex items-start space-x-3 text-red-200 text-xs animate-shake">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 mt-0.5 shrink-0 text-sm" />
                        <p className="font-semibold text-red-200 leading-snug">{formErrors.general}</p>
                      </div>
                    )}

                    <form onSubmit={handleRegisterVerifyOtp} className="space-y-4">
                      <div className="space-y-1 text-center">
                        <label className="text-xs text-neutral-400 font-mono block">Verification OTP</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={regOtp}
                          autoFocus
                          onChange={(e) => handleFieldChange('regOtp', e.target.value.replace(/\D/g, ''), setRegOtp)}
                          className={`w-full bg-[#121316] border rounded-xl py-3 text-center text-2xl tracking-[0.4em] font-mono font-bold text-white focus:outline-none ${
                            formErrors.regOtp ? 'border-red-500' : 'border-[#B56571]/30 focus:border-[#B56571]'
                          }`}
                          placeholder="••••••"
                        />
                        {formErrors.regOtp && (
                          <p className="text-[11px] text-red-400 font-mono flex items-center justify-center gap-1 pt-0.5">
                            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                            <span>{formErrors.regOtp}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between text-xs text-neutral-400 font-mono">
                        <button type="button" onClick={() => setRegStep(1)} className="hover:text-white cursor-pointer">
                          Change Email
                        </button>
                        {regTimer > 0 ? (
                          <span>Resend in <strong>{regTimer}s</strong></span>
                        ) : (
                          <button type="button" onClick={handleRegisterSendOtp} className="text-[#D98A92] hover:underline font-bold">
                            Resend Code
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || regOtp.length < 6}
                        className="w-full btn-gold py-3.5 rounded-full font-bold uppercase tracking-wider text-xs text-white cursor-pointer"
                      >
                        {isLoading ? 'VERIFYING...' : 'ACTIVATE MEMBERSHIP (+200 PTS)'}
                      </button>
                    </form>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Footer Notice */}
          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              256-BIT ENCRYPTED SANCTUARY PROTOCOL
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
