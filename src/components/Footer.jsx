import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faLock, faTruck, faShieldHalved, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { SEO_POPULAR_KEYWORDS } from '../data/mockData';

export const Footer = () => {
  const { navigateTo, setSearchQuery, setSelectedCategory, user, currentPage } = useApp();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Footer video autoplay prevented:", error);
      });
    }
  }, [currentPage]);

  const handleKeywordClick = (item) => {
    setSelectedCategory('all');
    setSearchQuery(item.query);
    navigateTo('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simple, elegant luxury mirror-blur footer for Product Catalog and secondary pages
  if (['catalog', 'product-detail', 'shipping', 'privacy', 'terms', 'contact'].includes(currentPage)) {
    return (
      <footer className="relative w-full overflow-hidden mirror-glass-footer flex flex-col items-center pt-14 pb-28 md:pb-14 px-margin-mobile text-neutral-200 font-sans transition-all">
        {/* Dedicated Background Image Layer (Mirror Reflected & Blurred) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 pointer-events-none"
          style={{ 
            backgroundImage: `url('/bg/klara-kulikova-EP2Bg3Y2Ojg-unsplash.jpg')`,
            opacity: 0.65,
            filter: 'blur(10px) brightness(0.85) contrast(1.1)'
          }}
        />
        {/* Liquid Obsidian Mirror Sheen Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121316]/70 via-black/45 to-[#121316]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />

        <div className="relative z-10 max-w-container-max mx-auto w-full flex flex-col items-center space-y-8">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <h2 
              onClick={() => navigateTo('home')}
              className="font-serif text-2xl md:text-3xl text-white gold-gradient-text tracking-tight cursor-pointer hover:opacity-90 transition-opacity font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            >
              Midnight Bloom
            </h2>
            <p className="text-xs text-neutral-200 max-w-md mx-auto font-light leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Discreet Luxury Intimate Instruments & Sensual Wellness Across India
            </p>
          </div>

          {/* Discreet Trust Badges - Mirror Frosted Glass */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-[11px] font-mono">
            <span className="bg-white/10 dark:bg-black/60 border border-white/20 px-3.5 py-1.5 rounded-full flex items-center space-x-2 text-[#F0B8BE] backdrop-blur-xl shadow-lg">
              <FontAwesomeIcon icon={faLock} className="text-[#D98A92]" />
              <span>100% Plain Unbranded Box</span>
            </span>
            <span className="bg-white/10 dark:bg-black/60 border border-white/20 px-3.5 py-1.5 rounded-full flex items-center space-x-2 text-[#F0B8BE] backdrop-blur-xl shadow-lg">
              <FontAwesomeIcon icon={faTruck} className="text-[#D98A92]" />
              <span>Express Delivery India-wide</span>
            </span>
            <span className="bg-white/10 dark:bg-black/60 border border-white/20 px-3.5 py-1.5 rounded-full flex items-center space-x-2 text-[#F0B8BE] backdrop-blur-xl shadow-lg">
              <FontAwesomeIcon icon={faCreditCard} className="text-[#D98A92]" />
              <span>Cash on Delivery (COD)</span>
            </span>
            <span className="bg-white/10 dark:bg-black/60 border border-white/20 px-3.5 py-1.5 rounded-full flex items-center space-x-2 text-[#F0B8BE] backdrop-blur-xl shadow-lg">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[#D98A92]" />
              <span>100% Medical Silicone</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-5 sm:gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-300">
            <button 
              onClick={() => navigateTo('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo('catalog', null, 'vibrators')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Vibrators
            </button>
            <button 
              onClick={() => navigateTo('catalog', null, 'dildos-insertables')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Dildos
            </button>
            <button 
              onClick={() => navigateTo('catalog', null, 'male-masturbators')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Men Strokers
            </button>
            <button 
              onClick={() => navigateTo('catalog', null, 'cock-rings')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cock Rings
            </button>
            <button 
              onClick={() => navigateTo('catalog', null, 'anal-toys')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Anal & Prostate
            </button>
            <button 
              onClick={() => navigateTo('shipping')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Discreet Shipping
            </button>
            <button 
              onClick={() => navigateTo('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button 
              onClick={() => navigateTo('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button 
              onClick={() => navigateTo('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
            {user?.isLoggedIn && user?.email === '20092003pardeep@gmail.com' && user?.isAdmin && (
              <button 
                onClick={() => navigateTo('admin')}
                className="text-[#D98A92] hover:text-white transition-colors cursor-pointer font-mono font-bold"
              >
                Admin
              </button>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex gap-3">
            <a 
              href="#" 
              className="w-9 h-9 rounded-full border border-white/15 bg-black/50 backdrop-blur-md flex items-center justify-center text-[#D98A92] hover:text-white hover:bg-[#B56571] transition-all"
              title="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-xs" />
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-full border border-white/15 bg-black/50 backdrop-blur-md flex items-center justify-center text-[#D98A92] hover:text-white hover:bg-[#B56571] transition-all"
              title="X / Twitter"
            >
              <FontAwesomeIcon icon={faXTwitter} className="text-xs" />
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-white/10 w-full text-center">
            <p className="text-[11px] text-neutral-400 font-light">
              © {new Date().getFullYear()} Midnight Bloom. All rights reserved. 100% Body-Safe Medical Silicone Instruments. Strictly for adults 18+ years of age.
            </p>
          </div>

        </div>
      </footer>
    );
  }

  return (
    <footer className="relative w-full overflow-hidden mirror-glass-footer flex flex-col items-center pt-16 pb-28 md:pb-16 px-margin-mobile text-[#2A2426] dark:text-neutral-200 font-sans transition-all">
      
      {/* Background Vivid Ambient Footer Media (80% Visibility, Liquid Mirror Blur) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0 scale-105 transition-all duration-700 pointer-events-none"
        style={{
          opacity: 0.82,
          filter: 'blur(7px) brightness(0.9) contrast(1.1)'
        }}
      >
        <source src="/footer-video.mp4" type="video/mp4" />
        <source src="/fotter.mp4" type="video/mp4" />
      </video>

      {/* Specular Liquid Obsidian Mirror Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121316]/75 via-black/40 to-[#121316]/85 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/70 z-0 pointer-events-none" />

      {/* Brand Header & Tagline */}
      <div className="relative z-10 max-w-container-max mx-auto w-full text-center space-y-3 mb-10">
        <h2 
          onClick={() => navigateTo('home')}
          className="font-serif text-3xl md:text-4xl text-white gold-gradient-text tracking-tight cursor-pointer hover:opacity-90 transition-opacity font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
        >
          Midnight Bloom
        </h2>
        <p className="text-xs text-neutral-200 dark:text-neutral-300 max-w-xl mx-auto font-light leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
          India's #1 Luxury Adult Toys & Sensual Wellness Superstore. Dedicated to body-safe intimate wellness, whisper-quiet performance, and 100% plain, unmarked delivery across India.
        </p>
      </div>

      {/* SEO Popular Searches Directory (High-Volume Keywords Grid in Liquid Mirror Card) */}
      <div className="relative z-10 max-w-container-max mx-auto w-full mirror-glass-card rounded-3xl p-6 sm:p-8 mb-12 space-y-6 shadow-2xl">
        
        <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#A33F4D] dark:text-[#D98A92] font-bold block">
            Popular Searches & SEO Categories
          </span>
          <h3 className="text-sm font-serif font-bold text-[#181617] dark:text-white mt-1">
            Buy Sex Toys Online in India – Trending Keywords Directory
          </h3>
        </div>

        {/* 16 Target Keywords Clickable Cloud with Mirror Frosting */}
        <div className="flex flex-wrap gap-2 pt-1">
          {SEO_POPULAR_KEYWORDS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleKeywordClick(item)}
              className="text-[11px] bg-white/10 dark:bg-white/5 text-[#2A2426] dark:text-neutral-200 border border-white/15 hover:bg-[#B56571] hover:text-white dark:hover:bg-[#B56571] dark:hover:text-white hover:border-[#D98A92] px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-mono font-medium shadow-xs backdrop-blur-md"
            >
              {item.keyword}
            </button>
          ))}
        </div>

        {/* City-level Delivery Information */}
        <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#7A696C] dark:text-neutral-400 font-bold block">
            Discreet Express Delivery of Sex Toys Across India:
          </span>
          <p className="text-[11px] text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-sans font-light">
            Mumbai • Delhi NCR • Bengaluru • Hyderabad • Pune • Chennai • Kolkata • Ahmedabad • Jaipur • Chandigarh • Lucknow • Kochi • Surat • Indore • Goa & 20,000+ PIN Codes across India with 100% Plain Box Packaging & Cash on Delivery (COD).
          </p>
        </div>

        {/* SEO Editorial Paragraph */}
        <div className="pt-3 text-[11px] text-[#5C4F52] dark:text-neutral-300 leading-relaxed space-y-2 font-light">
          <p>
            <strong className="text-[#181617] dark:text-white">Why Buy Sex Toys from Midnight Bloom India?</strong> As India's premier sensual wellness marketplace, we showcase over 50+ curated adult toys and sex toys for men, women, and couples. Whether you are looking for automated <em>pocket pussy</em> strokers, vibrating <em>cock rings</em> and <em>penis rings</em>, ergonomic <em>prostate massagers</em>, <em>penis sleeves</em>, or touchless clitoral air-pulse massagers, every instrument is crafted from certified 100% medical-grade liquid silicone.
          </p>
          <p>
            All orders are dispatched in 100% plain, unmarked brown boxes with zero adult logos or labels. Your privacy is guaranteed with discreet courier descriptions ("MB Logistics") and neutral bank billing descriptors ("MB* SERVICES LLC").
          </p>
        </div>

      </div>

      {/* Navigation Links */}
      <div className="relative z-10 flex flex-wrap justify-center gap-6 sm:gap-8 mb-8 text-xs font-semibold">
        <button 
          onClick={() => navigateTo('home')}
          className="text-neutral-300 hover:text-white dark:text-neutral-200 dark:hover:text-white transition-colors uppercase tracking-widest cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
        >
          Home
        </button>
        <button 
          onClick={() => navigateTo('catalog', null, 'vibrators')}
          className="text-neutral-300 hover:text-white dark:text-neutral-200 dark:hover:text-white transition-colors uppercase tracking-widest cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
        >
          Vibrators
        </button>
        <button 
          onClick={() => navigateTo('catalog', null, 'dildos-insertables')}
          className="text-neutral-300 hover:text-white dark:text-neutral-200 dark:hover:text-white transition-colors uppercase tracking-widest cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
        >
          Dildos
        </button>
        <button 
          onClick={() => navigateTo('shipping')}
          className="text-neutral-300 hover:text-white dark:text-neutral-200 dark:hover:text-white transition-colors uppercase tracking-widest cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
        >
          Discreet Delivery
        </button>
        <button 
          onClick={() => navigateTo('privacy')}
          className="text-neutral-300 hover:text-white dark:text-neutral-200 dark:hover:text-white transition-colors uppercase tracking-widest cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
        >
          Privacy Policy
        </button>
        <button 
          onClick={() => navigateTo('terms')}
          className="text-neutral-300 hover:text-white dark:text-neutral-200 dark:hover:text-white transition-colors uppercase tracking-widest cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
        >
          Terms
        </button>
        <button 
          onClick={() => navigateTo('contact')}
          className="text-neutral-300 hover:text-white dark:text-neutral-200 dark:hover:text-white transition-colors uppercase tracking-widest cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
        >
          Contact
        </button>
        {user?.isLoggedIn && user?.email === '20092003pardeep@gmail.com' && user?.isAdmin && (
          <button 
            onClick={() => navigateTo('admin')}
            className="text-[#D98A92] hover:text-white hover:underline transition-colors uppercase tracking-widest cursor-pointer font-mono font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
          >
            Admin Portal
          </button>
        )}
      </div>

      {/* Social Icons */}
      <div className="relative z-10 flex gap-4 mb-8">
        <a 
          href="#" 
          className="w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center text-[#D98A92] hover:text-white hover:bg-[#B56571] transition-all shadow-md"
          title="Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} className="text-sm" />
        </a>
        <a 
          href="#" 
          className="w-10 h-10 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center text-[#D98A92] hover:text-white hover:bg-[#B56571] transition-all shadow-md"
          title="X / Twitter"
        >
          <FontAwesomeIcon icon={faXTwitter} className="text-sm" />
        </a>
      </div>

      <p className="relative z-10 text-xs text-neutral-300 dark:text-neutral-400 text-center font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
        © {new Date().getFullYear()} Midnight Bloom. All rights reserved. 100% Body-Safe Medical Silicone Sex Toys. Strictly for adults 18+ years of age.
      </p>
    </footer>
  );
};
