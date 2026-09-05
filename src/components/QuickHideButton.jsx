import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export const QuickHideButton = () => {
  const handleQuickExit = () => {
    // Instantly replace window location with Google for total privacy
    window.location.replace('https://www.google.com');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Pressing Escape triggers instant panic exit
      if (e.key === 'Escape') {
        handleQuickExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed bottom-24 md:bottom-6 left-5 z-40 animate-fade-in select-none font-sans">
      <button
        onClick={handleQuickExit}
        title="Instantly switch to Google (or press Esc key)"
        className="group flex items-center space-x-2 bg-[#18191E]/95 hover:bg-[#20222A] text-neutral-300 hover:text-white border border-white/10 hover:border-[#D98A92]/40 px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-md transition-all active:scale-95 text-xs font-mono cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-[#D98A92] animate-pulse"></span>
        <span className="font-semibold text-[11px] uppercase tracking-wider">Quick Exit</span>
        <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded border border-white/10 text-neutral-400 font-sans hidden sm:inline-block">
          Esc
        </span>
        <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-xs text-[#D98A92]/80 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
