import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faXmark, 
  faBagShopping, 
  faUser, 
  faChevronRight, 
  faWandMagicSparkles, 
  faLock, 
  faTruck, 
  faMagnifyingGlass 
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { STITCH_CATEGORIES } from '../data/mockData';

export const Header = ({ onOpenQuiz }) => {
  const { 
    navigateTo, 
    cartCount, 
    currentPage, 
    user 
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Discreet Luxury Announcement Ribbon */}
      <div className="fixed top-0 w-full z-50 bg-[#F4EDE8] dark:bg-[#121316] border-b border-black/[0.06] dark:border-white/[0.06] text-[11px] font-mono text-[#5C4F52] dark:text-neutral-300 py-1.5 px-4 hidden md:flex items-center justify-between transition-colors">
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-1.5 text-[#A33F4D] dark:text-[#D98A92]">
            <FontAwesomeIcon icon={faLock} className="text-[10px]" />
            <strong className="text-[#181617] dark:text-white font-medium">100% Plain Unbranded Packaging</strong>
          </span>
          <span className="text-[#A33F4D]/30 dark:text-neutral-600">•</span>
          <span className="flex items-center space-x-1.5">
            <FontAwesomeIcon icon={faTruck} className="text-[#A33F4D] dark:text-[#D98A92] text-[10px]" />
            <span>Discreet Express Delivery Across India & Worldwide</span>
          </span>
          <span className="text-[#A33F4D]/30 dark:text-neutral-600">•</span>
          <span>Cash on Delivery (COD) Available Across India</span>
        </div>

        <div className="flex items-center space-x-5">
          <button 
            onClick={onOpenQuiz} 
            className="text-[#A33F4D] dark:text-[#D98A92] hover:text-[#B56571] dark:hover:text-[#F0B8BE] font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Pleasure Match Quiz</span>
            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[10px]" />
          </button>
          <span className="text-[#5C4F52] dark:text-neutral-400">
            Use code <strong className="text-[#181617] dark:text-white font-bold bg-[#FAF7F5] dark:bg-white/10 px-1.5 py-0.5 rounded border border-[#B56571]/25 dark:border-white/10">VIP10</strong> for 10% Off
          </span>
        </div>
      </div>

      {/* Desktop & Mobile Fixed Top Header */}
      <header className="fixed top-0 md:top-[33px] w-full z-50 luxury-glass-header h-16 md:h-20 flex justify-between items-center px-margin-mobile md:px-margin-desktop transition-all">
        
        {/* Left Menu / Navigation button */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-[#A33F4D] dark:text-[#D98A92] hover:text-[#181617] dark:hover:text-white transition-colors active:scale-95 duration-200 p-2 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="text-lg" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[12px] font-semibold uppercase tracking-wider">
            <button
              onClick={() => navigateTo('home')}
              className={`transition-colors ${currentPage === 'home' ? 'text-[#A33F4D] dark:text-[#D98A92] font-bold' : 'text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('catalog', null, 'vibrators')}
              className="text-[#5C4F52] dark:text-neutral-400 hover:text-[#A33F4D] dark:hover:text-[#D98A92] transition-colors"
            >
              Vibrators
            </button>
            <button
              onClick={() => navigateTo('catalog', null, 'dildos-insertables')}
              className="text-[#5C4F52] dark:text-neutral-400 hover:text-[#A33F4D] dark:hover:text-[#D98A92] transition-colors"
            >
              Dildos
            </button>
            <button
              onClick={() => navigateTo('catalog', null, 'male-masturbators')}
              className="text-[#5C4F52] dark:text-neutral-400 hover:text-[#A33F4D] dark:hover:text-[#D98A92] transition-colors"
            >
              Men Strokers
            </button>
            <button
              onClick={() => navigateTo('catalog', null, 'cock-rings')}
              className="text-[#5C4F52] dark:text-neutral-400 hover:text-[#A33F4D] dark:hover:text-[#D98A92] transition-colors"
            >
              Cock Rings
            </button>
            <button
              onClick={() => navigateTo('catalog', null, 'anal-toys')}
              className="text-[#5C4F52] dark:text-neutral-400 hover:text-[#A33F4D] dark:hover:text-[#D98A92] transition-colors"
            >
              Anal & Prostate
            </button>
            <button
              onClick={() => navigateTo('catalog', null, 'bdsm-kink')}
              className="text-[#5C4F52] dark:text-neutral-400 hover:text-[#A33F4D] dark:hover:text-[#D98A92] transition-colors"
            >
              BDSM & Kink
            </button>
          </nav>
        </div>

        {/* Brand Center Title */}
        <button
          onClick={() => navigateTo('home')}
          className="font-serif text-2xl md:text-3xl tracking-tight gold-gradient-text hover:opacity-90 transition-opacity font-bold cursor-pointer"
        >
          Midnight Bloom
        </button>

        {/* Right Icons: Search, Quiz Trigger, Admin, Profile & Shopping Bag */}
        <div className="flex items-center gap-2.5 md:gap-3.5">

          <button
            onClick={() => navigateTo('catalog')}
            className="text-[#5C4F52] dark:text-neutral-400 hover:text-[#A33F4D] dark:hover:text-[#D98A92] transition-colors p-2 hidden sm:flex items-center cursor-pointer"
            title="Search Catalog"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
          </button>

          <button
            onClick={onOpenQuiz}
            className="hidden sm:flex items-center space-x-1.5 bg-[#B56571]/15 dark:bg-[#D98A92]/10 hover:bg-[#B56571]/25 border border-[#B56571]/30 dark:border-[#D98A92]/30 text-[#A33F4D] dark:text-[#D98A92] px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[11px]" />
            <span>Ritual Quiz</span>
          </button>

          {user?.isLoggedIn && user?.email === '20092003pardeep@gmail.com' && user?.isAdmin && (
            <button
              onClick={() => navigateTo('admin')}
              className={`transition-colors text-xs font-mono px-2.5 py-1 rounded-full border cursor-pointer ${
                currentPage === 'admin' 
                  ? 'bg-[#B56571] text-white font-bold border-[#B56571]' 
                  : 'text-[#5C4F52] dark:text-neutral-400 border-[#B56571]/25 dark:border-white/10 hover:text-[#A33F4D] dark:hover:text-[#D98A92] hover:border-[#B56571]/40 bg-white dark:bg-white/[0.03]'
              }`}
              title="Admin Portal"
            >
              Admin
            </button>
          )}

          <button 
            onClick={() => navigateTo(user?.isLoggedIn ? 'profile' : 'login')}
            className="text-[#5C4F52] dark:text-neutral-400 hover:text-[#A33F4D] dark:hover:text-[#D98A92] transition-colors p-2 hidden sm:flex items-center cursor-pointer"
            title="Profile"
          >
            <FontAwesomeIcon icon={faUser} className="text-base" />
          </button>

          <button 
            onClick={() => navigateTo('cart')}
            className="text-[#A33F4D] dark:text-[#D98A92] hover:text-[#181617] dark:hover:text-white transition-colors active:scale-95 duration-200 p-2 relative cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <FontAwesomeIcon icon={faBagShopping} className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#B56571] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Drawer Overlay Menu for Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FAF7F5]/98 dark:bg-[#121316]/98 backdrop-blur-2xl pt-24 px-6 flex flex-col justify-between pb-10 animate-fade-in overflow-y-auto text-[#181617] dark:text-neutral-100">
          <div className="space-y-6 pt-2 max-w-lg mx-auto w-full">
            <div className="text-xs uppercase tracking-widest text-[#A33F4D] dark:text-[#D98A92] font-mono flex justify-between items-center border-b border-black/[0.08] dark:border-white/10 pb-3">
              <span>All 8 Departments (50 Luxury Instruments)</span>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-[#7A696C] hover:text-[#181617] dark:text-neutral-400 dark:hover:text-white p-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-lg" />
              </button>
            </div>


            
            <div className="flex flex-col space-y-3.5 text-base font-serif font-bold text-[#181617] dark:text-neutral-100">
              <button
                onClick={() => { navigateTo('catalog', null, 'all'); setIsMenuOpen(false); }}
                className="text-left text-[#A33F4D] dark:text-[#D98A92] hover:underline py-1 flex items-center justify-between cursor-pointer"
              >
                <span>✨ Browse Entire 50-Item Collection</span>
                <FontAwesomeIcon icon={faChevronRight} className="text-xs text-[#A33F4D] dark:text-[#D98A92]" />
              </button>

              {STITCH_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { navigateTo('catalog', null, cat.id); setIsMenuOpen(false); }}
                  className="text-left hover:text-[#A33F4D] dark:hover:text-[#D98A92] transition-colors py-1 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span>{cat.name}</span>
                    <span className="block text-[11px] font-sans font-normal text-[#5C4F52] dark:text-neutral-400">{cat.subtitle}</span>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="text-xs text-[#A33F4D]/50 dark:text-[#D98A92]/50" />
                </button>
              ))}

              <button
                onClick={() => { onOpenQuiz(); setIsMenuOpen(false); }}
                className="text-left text-[#A33F4D] dark:text-[#D98A92] hover:text-[#181617] dark:hover:text-white transition-colors py-2 flex items-center justify-between text-sm font-bold font-sans border-t border-black/[0.08] dark:border-white/10 pt-4 cursor-pointer"
              >
                <span>✨ Take the 30s Pleasure Match Quiz</span>
                <FontAwesomeIcon icon={faChevronRight} className="text-xs text-[#A33F4D] dark:text-[#D98A92]" />
              </button>
            </div>
          </div>

          <div className="border-t border-black/[0.08] dark:border-white/10 pt-4 max-w-lg mx-auto w-full flex justify-between items-center text-xs text-[#7A696C] dark:text-neutral-400 font-medium">
            <button onClick={() => { navigateTo('shipping'); setIsMenuOpen(false); }} className="hover:text-[#A33F4D] dark:hover:text-[#D98A92]">
              Discreet Shipping
            </button>
            <span>•</span>
            <button onClick={() => { navigateTo('privacy'); setIsMenuOpen(false); }} className="hover:text-[#A33F4D] dark:hover:text-[#D98A92]">
              Privacy Guarantee
            </button>
            <span>•</span>
            <button onClick={() => { navigateTo('terms'); setIsMenuOpen(false); }} className="hover:text-[#A33F4D] dark:hover:text-[#D98A92]">
              Terms
            </button>
          </div>
        </div>
      )}
    </>
  );
};
