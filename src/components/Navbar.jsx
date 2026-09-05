import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Search, 
  EyeOff, 
  Menu, 
  X, 
  Sparkles,
  HelpCircle,
  Store,
  User,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

export const Navbar = () => {
  const { 
    currentPage, 
    navigateTo, 
    cartItemCount, 
    setIsCartOpen, 
    wishlist,
    setIsQuickEscapeActive,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('catalog');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Discreet Banner */}
      <div className="bg-velour-900 border-b border-velour-800 text-xs py-2 px-4 text-velour-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-gold-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-gold-400" />
              100% Plain Unmarked Packaging Guaranteed
            </span>
            <span className="hidden md:inline text-velour-500">•</span>
            <span className="hidden md:inline text-velour-400">
              Billing Descriptor: <code className="text-gold-300 font-mono text-[11px] bg-velour-800 px-1.5 py-0.5 rounded">VL* SERVICES LLC</code>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigateTo('privacy')}
              className="hover:text-gold-300 transition-colors hidden sm:flex items-center"
            >
              <Package className="w-3 h-3 mr-1" />
              Packaging Proof
            </button>
            
            {/* Quick Escape Panic Button */}
            <button
              onClick={() => setIsQuickEscapeActive(true)}
              className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-rose-100 px-2.5 py-1 rounded text-xs flex items-center font-medium transition-all shadow-sm group"
              title="Instantly disguise screen (Shortcut: ESC)"
            >
              <EyeOff className="w-3.5 h-3.5 mr-1.5 text-rose-400 group-hover:animate-pulse" />
              <span>Quick Escape</span>
              <kbd className="ml-1.5 px-1 py-0.2 bg-black/40 text-[10px] rounded text-rose-300 font-mono">ESC</kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header className="sticky top-0 z-40 bg-velour-950/90 backdrop-blur-xl border-b border-velour-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile menu trigger */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-velour-300 hover:text-gold-400 p-2"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-rose-400 flex items-center justify-center shadow-glow-gold">
                  <span className="text-velour-950 font-serif font-bold text-lg">V</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold tracking-widest gold-gradient-text uppercase block leading-none">
                    VELOUR
                  </span>
                  <span className="text-[9px] tracking-[0.25em] text-velour-400 uppercase font-sans font-semibold">
                    Sensual Collective
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigateTo('home')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'home' ? 'text-gold-400 font-semibold' : 'text-velour-300 hover:text-gold-300'
                }`}
              >
                Discovery
              </button>

              <button
                onClick={() => navigateTo('catalog', null, 'all')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'catalog' ? 'text-gold-400 font-semibold' : 'text-velour-300 hover:text-gold-300'
                }`}
              >
                Marketplace
              </button>

              <button
                onClick={() => navigateTo('advisor')}
                className={`text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                  currentPage === 'advisor' ? 'text-gold-400 font-semibold' : 'text-velour-300 hover:text-gold-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Intimacy Quiz</span>
              </button>

              <button
                onClick={() => navigateTo('privacy')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'privacy' ? 'text-gold-400 font-semibold' : 'text-velour-300 hover:text-gold-300'
                }`}
              >
                Discretion Guarantee
              </button>

              <button
                onClick={() => navigateTo('seller')}
                className={`text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                  currentPage === 'seller' ? 'text-gold-400 font-semibold' : 'text-velour-400 hover:text-velour-200'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-velour-400" />
                <span>Sell on Velour</span>
              </button>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-5">
              {/* Search Toggle */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search silent devices, oils, silk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-52 md:w-64 bg-velour-900 border border-gold-500/40 rounded-full px-4 py-1.5 text-xs text-velour-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                    <button 
                      type="button" 
                      onClick={() => setIsSearchOpen(false)}
                      className="ml-2 text-velour-400 hover:text-velour-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="text-velour-300 hover:text-gold-400 transition-colors p-1"
                    title="Search marketplace"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Account Button */}
              <button
                onClick={() => navigateTo('account')}
                className={`text-velour-300 hover:text-gold-400 transition-colors p-1 hidden sm:block ${
                  currentPage === 'account' ? 'text-gold-400' : ''
                }`}
                title="Private Account"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => navigateTo('account')}
                className="text-velour-300 hover:text-gold-400 transition-colors relative p-1"
                title="Saved Items"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-velour-950 font-semibold px-3.5 py-2 rounded-full flex items-center space-x-2 transition-all shadow-glow-gold"
              >
                <ShoppingBag className="w-4 h-4 text-velour-950" />
                <span className="text-xs font-bold">{cartItemCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-velour-900 border-b border-velour-800 px-4 pt-3 pb-6 space-y-3">
            <button
              onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-velour-200 hover:text-gold-300"
            >
              Discovery Home
            </button>
            <button
              onClick={() => { navigateTo('catalog'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-velour-200 hover:text-gold-300"
            >
              Shop Full Collection
            </button>
            <button
              onClick={() => { navigateTo('advisor'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-gold-400 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Intimacy Advisor Quiz</span>
            </button>
            <button
              onClick={() => { navigateTo('privacy'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-velour-200 hover:text-gold-300"
            >
              Discretion & Packaging Guarantee
            </button>
            <button
              onClick={() => { navigateTo('seller'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-velour-400 hover:text-velour-200"
            >
              Sell as Verified Merchant
            </button>
            <button
              onClick={() => { navigateTo('account'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-velour-200 hover:text-gold-300"
            >
              My Discreet Account & Orders
            </button>
          </div>
        )}
      </header>
    </>
  );
};
