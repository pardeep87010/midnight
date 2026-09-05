import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';

export const AgeGateModal = () => {
  const { isAgeVerified, verifyAge } = useApp();
  const [rememberMe, setRememberMe] = useState(true);

  if (isAgeVerified) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 dark:bg-black/90 backdrop-blur-md select-none transition-all font-sans">
      
      {/* Central Modal Card */}
      <div className="bg-white dark:bg-[#16171C] border border-[#B56571]/25 dark:border-[#D98A92]/30 rounded-[28px] max-w-[460px] w-full p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden text-center transition-colors">
        
        {/* Top Rose Shield Icon */}
        <div className="w-16 h-16 rounded-full border border-[#B56571]/40 dark:border-[#D98A92]/40 bg-[#FAF3F0] dark:bg-[#20222A] flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(181,101,113,0.25)]">
          <FontAwesomeIcon icon={faShieldHalved} className="text-2xl text-[#A33F4D] dark:text-[#D98A92]" />
        </div>

        {/* Tracking Caption */}
        <span className="text-[#A33F4D] dark:text-[#D98A92] font-mono text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase block mb-2">
          AGE & PRIVACY ASSURANCE
        </span>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-[34px] font-bold text-[#181617] dark:text-white tracking-tight mb-3">
          Welcome to Midnight Bloom
        </h2>

        {/* Subtitle */}
        <p className="text-[#5C4F52] dark:text-neutral-300 text-xs sm:text-sm font-light leading-relaxed mb-6 opacity-90 px-1">
          Midnight Bloom is a curated luxury sanctuary for sensual wellness, anatomical intimate instruments, and 100% confidential pleasure essentials.
        </p>

        {/* Inner Confidentiality Box */}
        <div className="bg-[#FAF7F5] dark:bg-[#1C1D24] border border-[#B56571]/20 dark:border-white/5 rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-1.5 shadow-xs">
          <div className="flex items-center space-x-2 text-[#181617] dark:text-white font-semibold text-xs sm:text-sm">
            <span className="w-2 h-2 rounded-full bg-[#A33F4D] dark:bg-[#D98A92] animate-pulse" />
            <span>100% Confidential & Discreet Browsing</span>
          </div>

          <p className="text-[#5C4F52] dark:text-neutral-400 text-xs leading-relaxed font-light pl-4">
            By entering, you certify that you are at least 18 years of age (or legal majority in your region) and consent to viewing adult wellness products.
          </p>
        </div>

        {/* Checkbox */}
        <div className="flex items-center justify-center space-x-2.5 mb-6">
          <input
            type="checkbox"
            id="ageRemember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded bg-[#FAF7F5] dark:bg-[#1C1D24] border border-[#B56571]/30 dark:border-neutral-700 text-[#A33F4D] dark:text-[#D98A92] focus:ring-0 cursor-pointer accent-[#B56571]"
          />
          <label 
            htmlFor="ageRemember" 
            className="text-[#2A2426] dark:text-neutral-300 text-xs font-medium cursor-pointer select-none"
          >
            Remember my verification on this device
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              window.location.href = 'https://www.google.com';
            }}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl border border-[#B56571]/25 dark:border-neutral-700/80 bg-[#FAF7F5] dark:bg-neutral-900/60 hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#5C4F52] dark:text-neutral-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
          >
            Exit to Google
          </button>

          <button
            onClick={() => verifyAge(rememberMe)}
            className="w-full sm:w-1/2 btn-gold py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-95 text-white"
          >
            <span>I Am 18+ / Enter</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>

      </div>

    </div>
  );
};
