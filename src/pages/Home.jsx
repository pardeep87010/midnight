import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMagnifyingGlass, 
  faSpa, 
  faArrowRight, 
  faCartPlus, 
  faTruckFast, 
  faLock, 
  faGem, 
  faEnvelope,
  faWandMagicSparkles,
  faStar,
  faShieldHalved,
  faHandHoldingHeart,
  faCheckCircle,
  faRotateRight,
  faBoxOpen,
  faCreditCard,
  faChevronDown,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { STITCH_CATEGORIES, STITCH_PRODUCTS, VERIFIED_REVIEWS, WELLNESS_GUIDES, FAQS } from '../data/mockData';
import { CategoryIconBar } from '../components/CategoryIconBar';
import { TopMenSection } from '../components/TopMenSection';
import { TopWomenSection } from '../components/TopWomenSection';
import { ArticleModal } from '../components/ArticleModal';

export const Home = ({ onOpenQuiz }) => {
  const { navigateTo, addToCart, searchQuery, setSearchQuery, productsList, showToast } = useApp();
  const videoRef = useRef(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.defaultMuted = true;
        videoRef.current.muted = true;
        videoRef.current.play().catch(error => {
          console.log("Autoplay paused by mobile battery saver:", error);
        });
      }
    };

    playVideo();

    // User touch / scroll unlock for mobile low-power mode
    const handleTouchOrScroll = () => {
      playVideo();
      window.removeEventListener('touchstart', handleTouchOrScroll);
      window.removeEventListener('scroll', handleTouchOrScroll);
    };

    window.addEventListener('touchstart', handleTouchOrScroll, { passive: true });
    window.addEventListener('scroll', handleTouchOrScroll, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchOrScroll);
      window.removeEventListener('scroll', handleTouchOrScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('catalog');
    }
  };

  return (
    <div className="relative w-full max-w-full overflow-x-hidden pt-16 md:pt-[33px] bg-[#FAF7F5] dark:bg-[#121316] font-sans text-[#181617] dark:text-[#EAE0E1] transition-colors">
      
      {/* 1. Cinematic Hero Section with Compressed Mobile & Desktop Video Background */}
      <section className="relative min-h-[96vh] sm:min-h-screen w-full max-w-full flex flex-col justify-between items-center overflow-hidden bg-[#121316]">
        
        {/* Background Video with Mobile Compression & Zero-Lag Poster */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          poster="/hero-poster.jpg"
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 scale-105 transition-transform duration-1000 pointer-events-none"
        >
          <source src="/hero-video-mobile.mp4" media="(max-width: 768px)" type="video/mp4" />
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Minimal Crystal Clear Tint Overlay (Reduced Blur for Maximum Visibility) */}
        <div className="absolute inset-0 hero-video-overlay bg-black/30 dark:bg-black/40 backdrop-blur-[0.5px] z-10 pointer-events-none" />
        <div className="absolute inset-0 hero-vignette bg-radial from-transparent via-black/15 to-black/70 z-10 pointer-events-none" />

        {/* Top Spacer to balance navbar */}
        <div className="pt-24 md:pt-28" />

        {/* Central Hero Content */}
        <div className="relative z-20 max-w-3xl mx-auto text-center space-y-6 animate-fade-in p-6 sm:p-10 rounded-3xl my-auto">
          
          <div className="inline-flex items-center space-x-2 bg-black/60 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#D98A92] animate-pulse" />
            <span className="text-[11px] sm:text-xs text-[#D98A92] uppercase tracking-[0.25em] font-mono font-bold">
              INDIA'S #1 LUXURY SENSUAL SANCTUARY
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl text-white font-serif font-bold tracking-tight leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Elevate Your <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Intimate Ritual.</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-neutral-200 max-w-xl mx-auto leading-relaxed font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Discover a curated collection of luxury, medical-grade sensual wellness instruments. Engineered for whisper-quiet performance, profound delight, and guaranteed 100% plain box discretion.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigateTo('catalog', null, 'all')}
              className="w-full sm:w-auto btn-gold text-xs sm:text-sm font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all cursor-pointer shadow-xl text-white"
            >
              Explore Collection
            </button>

            <button
              onClick={onOpenQuiz}
              className="w-full sm:w-auto bg-white/80 hover:bg-white dark:bg-white/[0.07] dark:hover:bg-white/[0.12] text-[#181617] dark:text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-full border border-[#B56571]/25 dark:border-white/[0.15] hover:border-[#B56571] dark:hover:border-[#D98A92]/50 transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2 backdrop-blur-md shadow-xs"
            >
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[#A33F4D] dark:text-[#D98A92] text-xs" />
              <span>Find Your Ritual Quiz</span>
            </button>
          </div>

          {/* Category Quick-Jump Ribbon */}
          <div className="pt-6 flex flex-wrap justify-center gap-2">
            {['Vibrators', 'Dildos', 'Pocket Pussies', 'Cock Rings', 'Prostate Massagers', 'BDSM & Kink'].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (tag === 'Vibrators') navigateTo('catalog', null, 'vibrators');
                  else if (tag === 'Dildos') navigateTo('catalog', null, 'dildos-insertables');
                  else if (tag === 'Pocket Pussies') navigateTo('catalog', null, 'male-masturbators');
                  else if (tag === 'Cock Rings') navigateTo('catalog', null, 'cock-rings');
                  else if (tag === 'Prostate Massagers') navigateTo('catalog', null, 'anal-toys');
                  else navigateTo('catalog', null, 'bdsm-kink');
                }}
                className="text-[11px] bg-white/70 hover:bg-[#FAF3F0] dark:bg-black/40 dark:hover:bg-[#D98A92]/20 text-[#5C4F52] dark:text-neutral-300 hover:text-[#181617] dark:hover:text-white border border-[#B56571]/20 dark:border-white/[0.08] hover:border-[#B56571] dark:hover:border-[#D98A92]/40 px-3.5 py-1 rounded-full backdrop-blur transition-all font-mono cursor-pointer shadow-xs"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="pb-3 flex flex-col items-center opacity-70 z-20 pointer-events-none">
          <div className="w-5 h-8 rounded-full border border-[#B56571]/50 dark:border-[#D98A92]/50 flex items-start justify-center p-1 backdrop-blur-sm">
            <div className="w-1 h-2 bg-[#B56571] dark:bg-[#D98A92] rounded-full animate-bounce" />
          </div>
        </div>

        {/* 2. "As Seen In" Luxury Press Endorsement Ticker - Glassmorphic Blur Overlay like Navbar */}
        <div className="w-full bg-black/35 backdrop-blur-2xl border-t border-white/10 py-4 sm:py-4.5 px-margin-mobile relative z-20 shadow-2xl">
          <div className="max-w-container-max mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F0B8BE] font-bold shrink-0 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D98A92]" />
              <span>AS FEATURED IN LUXURY PRESS:</span>
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 font-serif text-xs sm:text-sm tracking-widest uppercase text-neutral-200 font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              <span className="hover:text-white transition-colors cursor-default">VOGUE</span>
              <span className="hover:text-white transition-colors cursor-default">GQ</span>
              <span className="hover:text-white transition-colors cursor-default">COSMOPOLITAN</span>
              <span className="hover:text-white transition-colors cursor-default">ELLE</span>
              <span className="hover:text-white transition-colors cursor-default">FORBES WELLNESS</span>
            </div>
          </div>
        </div>

      </section>

      {/* 3. NEW: Interactive Category Icon Bar (Image 1 Style) */}
      <CategoryIconBar />

      {/* 4. 4 Pillars of Discreet Luxury */}
      <section className="bg-[#FAF7F5] dark:bg-[#16171C] py-12 px-margin-mobile relative z-20 border-b border-black/[0.06] dark:border-white/[0.06] transition-colors">
        <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="satin-card p-5 rounded-2xl text-center sm:text-left flex flex-col sm:flex-row items-center sm:space-x-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF3F0] dark:bg-white/[0.04] border border-[#B56571]/25 dark:border-[#D98A92]/30 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92] mb-3 sm:mb-0 shrink-0">
              <FontAwesomeIcon icon={faBoxOpen} className="text-lg" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#181617] dark:text-white">100% Plain Box</h4>
              <p className="text-[11px] text-[#5C4F52] dark:text-neutral-400">Zero adult logos or markings</p>
            </div>
          </div>

          <div className="satin-card p-5 rounded-2xl text-center sm:text-left flex flex-col sm:flex-row items-center sm:space-x-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF3F0] dark:bg-white/[0.04] border border-[#B56571]/25 dark:border-[#D98A92]/30 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92] mb-3 sm:mb-0 shrink-0">
              <FontAwesomeIcon icon={faCreditCard} className="text-lg" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#181617] dark:text-white">Discreet Statement</h4>
              <p className="text-[11px] text-[#5C4F52] dark:text-neutral-400">Billed as "MB* SERVICES LLC"</p>
            </div>
          </div>

          <div className="satin-card p-5 rounded-2xl text-center sm:text-left flex flex-col sm:flex-row items-center sm:space-x-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF3F0] dark:bg-white/[0.04] border border-[#B56571]/25 dark:border-[#D98A92]/30 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92] mb-3 sm:mb-0 shrink-0">
              <FontAwesomeIcon icon={faShieldHalved} className="text-lg" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#181617] dark:text-white">100% Body Safe</h4>
              <p className="text-[11px] text-[#5C4F52] dark:text-neutral-400">Medical liquid silicone & steel</p>
            </div>
          </div>

          <div className="satin-card p-5 rounded-2xl text-center sm:text-left flex flex-col sm:flex-row items-center sm:space-x-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF3F0] dark:bg-white/[0.04] border border-[#B56571]/25 dark:border-[#D98A92]/30 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92] mb-3 sm:mb-0 shrink-0">
              <FontAwesomeIcon icon={faTruckFast} className="text-lg" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#181617] dark:text-white">COD & Fast UPI</h4>
              <p className="text-[11px] text-[#5C4F52] dark:text-neutral-400">Express delivery across India</p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Luxury Search & Filter Bar */}
      <div className="px-margin-mobile py-6 bg-[#FAF7F5] dark:bg-[#121316] border-b border-black/[0.06] dark:border-white/[0.06] relative z-20 w-full max-w-full overflow-hidden transition-colors">
        <form onSubmit={handleSearch} className="relative max-w-container-max mx-auto">
          <FontAwesomeIcon 
            icon={faMagnifyingGlass} 
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A33F4D] dark:text-[#D98A92] opacity-80 text-sm" 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search our luxury collection: wands, pocket pussy, cock rings, prostate massagers, glass dildos..."
            className="w-full bg-white dark:bg-[#18191E] border border-[#B56571]/25 dark:border-white/[0.1] text-[#181617] dark:text-white font-sans py-3.5 pl-14 pr-6 rounded-full focus:outline-none focus:border-[#B56571] transition-colors placeholder:text-[#8A7A7D] dark:placeholder:text-neutral-500 text-xs sm:text-sm shadow-sm"
          />
        </form>
      </div>

      {/* 6. NEW: TOP MEN PRODUCTS (Image 2 Style) */}
      <TopMenSection />

      {/* 7. NEW: TOP WOMEN PRODUCTS (Image 3 Style) */}
      <TopWomenSection />

      {/* 8. Curated Departments Showcase (8 Departments) */}
      <section 
        className="py-24 px-margin-mobile relative z-20 w-full max-w-full overflow-hidden transition-colors bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/bg/explore-8-departments-bg.jpg')` }}
      >
        {/* Dark Luxury Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121316]/90 via-[#141519]/80 to-[#121316]/95 backdrop-blur-[1px]" />

        <div className="max-w-container-max mx-auto relative z-10">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs text-[#F0B8BE] dark:text-[#D98A92] font-mono uppercase tracking-[0.25em] font-bold">Curated Sensations</span>
            <h3 className="text-3xl sm:text-4xl text-white font-serif font-bold tracking-tight">
              Explore All 8 Departments
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-light">
              From whisper-quiet vibrators to automated male strokers and artisanal BDSM restraints.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {STITCH_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigateTo('catalog', null, cat.id)}
                className="group relative h-64 sm:h-96 rounded-2xl overflow-hidden block shadow-2xl cursor-pointer border border-[#B56571]/20 dark:border-white/[0.08] satin-card"
              >
                <img
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-1000 ease-out"
                  src={cat.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121316]/95 via-[#121316]/40 to-transparent group-hover:via-[#121316]/60 transition-colors duration-500"></div>
                
                <div className="absolute inset-x-2.5 sm:inset-x-4 bottom-2.5 sm:bottom-4 luxury-glass p-3 sm:p-5 rounded-xl flex flex-col justify-between transform transition-all duration-300">
                  <div>
                    <h4 className="text-sm sm:text-lg text-white tracking-wide mb-0.5 sm:mb-1 font-serif font-bold line-clamp-1">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#F0B8BE] dark:text-[#D98A92] font-semibold uppercase tracking-wider font-mono line-clamp-1">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-white/10 hidden sm:flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cat.subcategories.slice(0, 3).map((sub, i) => (
                      <span key={i} className="text-[9px] bg-black/70 px-2 py-0.5 rounded text-neutral-300 border border-white/5">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Trending Flagship Instruments (4:5 Aspect Ratio Cards) */}
      <section className="py-20 bg-[#FAF7F5] dark:bg-[#121316] border-y border-black/[0.06] dark:border-white/[0.06] relative z-20 w-full max-w-full overflow-hidden transition-colors">
        <div className="max-w-container-max mx-auto">
          <div className="px-margin-mobile flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs text-[#A33F4D] dark:text-[#D98A92] font-mono uppercase tracking-widest font-bold">Flagship Collection</span>
              <h3 className="text-2xl sm:text-4xl text-[#181617] dark:text-white font-serif font-bold tracking-tight mt-1">
                Trending Best Sellers
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-400">Over 110,000+ verified 5-star customer reviews across India.</p>
            </div>
            <button
              onClick={() => navigateTo('catalog')}
              className="text-xs sm:text-sm text-[#A33F4D] dark:text-[#D98A92] font-bold uppercase tracking-wider hover:underline inline-flex items-center transition-colors space-x-1.5 cursor-pointer font-mono"
            >
              <span>View All 50 Items</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
          </div>

          <div className="w-full max-w-full overflow-x-auto hide-scrollbar">
            {productsList.length === 0 ? (
              <div className="px-margin-mobile py-8">
                <div className="bg-white dark:bg-[#18191E] border border-[#B56571]/25 dark:border-white/10 rounded-2xl p-8 text-center max-w-lg mx-auto space-y-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#FAF3F0] dark:bg-[#D98A92]/10 border border-[#B56571]/30 dark:border-[#D98A92]/30 flex items-center justify-center mx-auto text-[#A33F4D] dark:text-[#D98A92]">
                    <FontAwesomeIcon icon={faBoxOpen} className="text-xl" />
                  </div>
                  <h4 className="text-base text-[#181617] dark:text-white font-serif font-bold">Catalog Awaiting Commercial Entry</h4>
                  <p className="text-xs text-[#5C4F52] dark:text-neutral-400">Database is active and clean. Use the Admin Portal to upload your real product catalog or import via Excel/CSV.</p>
                  <button
                    onClick={() => navigateTo('admin')}
                    className="btn-gold text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer shadow-md text-white"
                  >
                    Open Admin Portal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex px-margin-mobile gap-6 pb-8 snap-x w-max">
                {productsList.slice(0, 8).map((prod) => (
                  <div
                    key={prod.id}
                    className="snap-start shrink-0 w-[290px] satin-card rounded-2xl overflow-hidden group flex flex-col justify-between"
                  >
                    <div className="h-[320px] w-full relative overflow-hidden bg-[#FAF7F5] dark:bg-[#16171C]">
                      {/* Luxury Frosted Badges */}
                      {prod.badge && (
                        <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 bg-black/65 backdrop-blur-md border border-[#B56571]/35 dark:border-white/15 px-3 py-1 rounded-full shadow-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D98A92] animate-pulse" />
                          <span className="text-[9px] font-mono uppercase tracking-[0.18em] font-bold text-[#F0B8BE] dark:text-[#EAE0E1]">
                            {prod.badge}
                          </span>
                        </div>
                      )}
                      {prod.discount && (
                        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#B56571] to-[#8A434E] text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md border border-white/20">
                          {prod.discount}
                        </div>
                      )}

                      <img
                        alt={prod.name}
                        loading="lazy"
                        decoding="async"
                        onClick={() => navigateTo('product-detail', prod.id)}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 cursor-pointer"
                        src={prod.images && prod.images[0] ? prod.images[0] : '/product-images/LELO%20Mona%20Wave%20Dual-Motor%20G-Spot%20Wand_0.webp'}
                      />

                      <button
                        onClick={() => addToCart(prod, 1, prod.colors && prod.colors[0] ? (typeof prod.colors[0] === 'object' ? prod.colors[0].name : prod.colors[0]) : 'Standard')}
                        className="absolute bottom-3 right-3 bg-white/90 dark:bg-[#121316]/90 backdrop-blur text-[#A33F4D] dark:text-[#D98A92] w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#B56571] hover:text-white shadow-xl cursor-pointer"
                        title="Quick Add to Bag"
                      >
                        <FontAwesomeIcon icon={faCartPlus} className="text-sm" />
                      </button>
                    </div>

                  <div className="p-5 space-y-2.5">
                    {/* Star ratings */}
                    <div className="flex items-center space-x-1.5 text-[11px] text-[#A33F4D] dark:text-[#D98A92]">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon key={i} icon={faStar} className="text-[10px]" />
                        ))}
                      </div>
                      <span className="text-[#7A696C] dark:text-neutral-400 font-medium">({prod.reviewsCount || 48})</span>
                    </div>

                    <div className="flex justify-between items-start">
                      <h4 
                        onClick={() => navigateTo('product-detail', prod.id)}
                        className="text-base text-[#181617] dark:text-white hover:text-[#A33F4D] dark:hover:text-[#D98A92] cursor-pointer font-serif font-bold transition-colors line-clamp-1"
                      >
                        {prod.name}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-[#A33F4D] dark:text-[#D98A92] font-mono">₹{prod.price?.toLocaleString('en-IN')}</span>
                      {prod.originalPrice && (
                        <span className="text-xs text-[#7A696C] dark:text-neutral-500 line-through font-mono">₹{prod.originalPrice?.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#5C4F52] dark:text-neutral-400 line-clamp-2 leading-relaxed font-light">
                      {prod.description}
                    </p>

                    <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[10px] text-[#7A696C] dark:text-neutral-400 font-mono">
                      <span>{prod.specs?.sound || '< 30 dB'}</span>
                      <button 
                        onClick={() => navigateTo('product-detail', prod.id)}
                        className="text-[#A33F4D] dark:text-[#D98A92] hover:underline font-bold uppercase cursor-pointer"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </section>

      {/* 10. Interactive Pleasure Match Quiz Showcase */}
      <section className="py-20 px-margin-mobile bg-[#121316] border-b border-white/[0.06] relative z-20 transition-colors overflow-hidden">
        <div className="max-w-5xl mx-auto rounded-3xl relative overflow-hidden border border-[#B56571]/35 shadow-2xl">
          {/* Clean Dedicated Background Image Layer */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none rounded-3xl"
            style={{ backgroundImage: `url('/bg/explore-8-departments-bg.jpg')` }}
          />
          {/* Dark luxury vignette overlay so text is crisp and luminous */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/80 to-black/88 backdrop-blur-[1px] rounded-3xl pointer-events-none" />

          <div className="relative z-10 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3.5 text-center md:text-left max-w-xl">
              <span className="inline-flex items-center space-x-2 bg-black/60 backdrop-blur-md border border-[#B56571]/35 text-[#F0B8BE] font-mono text-xs uppercase tracking-[0.2em] font-bold px-3.5 py-1 rounded-full shadow-lg">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[#D98A92]" />
                <span>30-Second Matching Algorithm</span>
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                Find Your Ideal Sensual Match
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light">
                Take our confidential interactive quiz to receive personalized recommendations based on your anatomy, experience level, and desired sensation.
              </p>
            </div>

            <div className="shrink-0">
              <button
                onClick={onOpenQuiz}
                className="bg-gradient-to-r from-[#B56571] to-[#8A434E] hover:from-[#A33F4D] hover:to-[#732C37] text-white py-4 px-8 sm:py-4.5 sm:px-9 rounded-full font-bold uppercase tracking-wider text-xs whitespace-nowrap shadow-2xl cursor-pointer flex items-center space-x-2.5 active:scale-95 transition-all border border-white/20"
              >
                <span>Start Pleasure Quiz</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Social Proof & Verified Stories Wall */}
      <section 
        className="py-24 px-margin-mobile relative z-20 w-full max-w-full overflow-hidden transition-colors bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/bg/customer-love-stories-bg.jpg')` }}
      >
        {/* Dark Luxury Vignette Overlay for maximum legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121316]/90 via-[#141519]/80 to-[#121316]/95 backdrop-blur-[2px]" />

        <div className="max-w-container-max mx-auto relative z-10">
          <div className="text-center mb-12 space-y-2">
            <div className="flex items-center justify-center space-x-1 text-amber-400 text-sm mb-1">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} />
              ))}
            </div>
            <h3 className="text-3xl sm:text-4xl text-white font-serif font-bold tracking-tight">
              Customer Love & Verified Stories
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-light">
              Over 1,000,000+ intimate rituals delivered with 100% discretion across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VERIFIED_REVIEWS.map((rev) => (
              <div 
                key={rev.id}
                className="bg-black/60 dark:bg-[#16171C]/80 backdrop-blur-xl border border-[#B56571]/30 dark:border-white/10 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-2xl hover:border-[#B56571]/60 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex text-amber-400 text-xs">
                      {[...Array(rev.rating)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} />
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">{rev.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-serif">
                    "{rev.title}"
                  </h4>

                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    {rev.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-semibold text-white block">{rev.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{rev.product}</span>
                  </div>
                  <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full flex items-center space-x-1 font-mono">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[8px]" />
                    <span>Verified Buyer</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Educational Wellness Journal Articles */}
      <section className="py-20 px-margin-mobile bg-[#FAF3F0] dark:bg-[#121316] border-t border-black/[0.06] dark:border-white/[0.06] relative z-20 transition-colors">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
            <div>
              <span className="text-xs text-[#A33F4D] dark:text-[#D98A92] font-mono uppercase tracking-widest font-bold">Knowledge & Guides</span>
              <h3 className="text-2xl sm:text-3xl text-[#181617] dark:text-white font-serif font-bold tracking-tight mt-1">
                The Intimate Wellness Journal
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-400">Expert advice, body safety standards, and relationship exploration.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WELLNESS_GUIDES.map((guide) => (
              <div 
                key={guide.id}
                onClick={() => setSelectedArticle(guide)}
                className="satin-card rounded-2xl overflow-hidden group flex flex-col justify-between shadow-sm cursor-pointer hover:border-[#B56571]/50 dark:hover:border-[#D98A92]/40 transition-all"
              >
                <div className="h-48 overflow-hidden relative">
                  <span className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-black/80 backdrop-blur text-[#A33F4D] dark:text-[#D98A92] text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border border-[#B56571]/25 dark:border-white/10 shadow-xs">
                    {guide.category} • {guide.readTime}
                  </span>
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                </div>

                <div className="p-6 space-y-2">
                  <h4 className="text-base font-serif font-bold text-[#181617] dark:text-white group-hover:text-[#A33F4D] dark:group-hover:text-[#D98A92] transition-colors">
                    {guide.title}
                  </h4>
                  <p className="text-xs text-[#5C4F52] dark:text-neutral-400 leading-relaxed font-light">
                    {guide.summary}
                  </p>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArticle(guide);
                    }}
                    className="text-xs text-[#A33F4D] dark:text-[#D98A92] font-bold uppercase tracking-wider inline-flex items-center space-x-1.5 group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Read Article</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. Interactive FAQ Section with Modern Editorial UI */}
      <section className="py-24 px-margin-mobile relative z-20 overflow-hidden bg-[#121316] transition-colors">
        {/* Ambient Blur Background (60% Visibility, 30% Blur) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 pointer-events-none"
          style={{ 
            backgroundImage: `url('/bg/everything-you-need-to-know.avif')`,
            opacity: 0.6,
            filter: 'blur(8px)'
          }} 
        />
        {/* Soft dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121316]/65 via-black/45 to-[#121316]/85 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          
          {/* Section Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 bg-black/60 backdrop-blur-md border border-[#B56571]/35 px-4 py-1.5 rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D98A92] animate-pulse" />
              <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] font-bold text-[#F0B8BE]">
                Confidential Client Advisory & FAQ
              </span>
            </div>
            
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
              Everything You Need to Know
            </h3>
            
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto font-light leading-relaxed">
              Transparent answers regarding confidential plain packaging, billing anonymity, body-safe materials, and express dispatch.
            </p>
          </div>

          {/* Modern Editorial Accordion Cards */}
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const metaList = [
                { index: '01', topic: '100% Plain Packaging', badge: 'Guaranteed Discreet Dispatch' },
                { index: '02', topic: "Men's Collection & Toys", badge: 'Heated Strokers & Rings' },
                { index: '03', topic: 'Discreet Billing Statement', badge: 'Billed as MB* SERVICES' },
                { index: '04', topic: 'Medical Safety Standards', badge: '100% Platinum Liquid Silicone' },
                { index: '05', topic: 'Payment & Fast Delivery', badge: 'COD Available Across India' }
              ];
              const meta = metaList[idx] || { index: `0${idx + 1}`, topic: 'Client Service', badge: 'Verified Protocol' };
              const isOpen = activeFaq === idx;

              return (
                <div 
                  key={idx}
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className={`group rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-2xl border ${
                    isOpen
                      ? 'bg-black/85 border-[#B56571] shadow-[0_15px_40px_rgba(181,101,113,0.25)]'
                      : 'bg-black/55 hover:bg-black/75 border-white/10 hover:border-[#B56571]/50 shadow-xl'
                  }`}
                >
                  <div className="p-6 sm:p-7 space-y-3">
                    
                    {/* Top Row: Index + Topic Pill + Animated Action Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#D98A92]">
                          {meta.index}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.06] text-neutral-300 border border-white/10">
                          {meta.topic}
                        </span>
                      </div>

                      {/* Minimalist Rotating Toggle Button */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen 
                          ? 'bg-[#B56571] text-white shadow-md rotate-45' 
                          : 'bg-white/10 text-neutral-300 group-hover:bg-[#B56571]/30 group-hover:text-white'
                      }`}>
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                      </div>
                    </div>

                    {/* Question Title */}
                    <h4 className={`text-base sm:text-lg font-serif font-bold transition-colors pr-6 ${
                      isOpen ? 'text-[#F0B8BE]' : 'text-white group-hover:text-[#F0B8BE]'
                    }`}>
                      {faq.q}
                    </h4>

                    {/* Expanded Answer Content */}
                    {isOpen && (
                      <div className="mt-3 pt-4 border-t border-white/10 animate-fade-in space-y-3.5">
                        <div className="border-l-2 border-[#B56571] pl-4 sm:pl-5 py-1">
                          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light">
                            {faq.a}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-1 pl-4 sm:pl-5">
                          <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-[9px]" />
                            <span>{meta.badge}</span>
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 14. Authoritative SEO Guide Block */}
      <section className="py-24 px-margin-mobile relative z-20 overflow-hidden bg-[#121316] border-t border-white/[0.06]">
        {/* Dedicated Background Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url('/bg/kevin-turcios-AwIzqcSr1jo-unsplash.jpg')` }}
        />
        {/* Dark luxury vignette overlay for high contrast & elegant editorial depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121316]/90 via-black/82 to-[#121316]/95 backdrop-blur-[1px] pointer-events-none" />

        <div className="relative z-10 max-w-container-max mx-auto space-y-10 text-neutral-300">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center space-x-2 bg-black/60 backdrop-blur-md border border-[#B56571]/35 text-[#F0B8BE] font-mono text-xs uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full shadow-lg">
              India's Premier Adult Superstore
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              Buy Sex Toys Online in India – The Ultimate Guide to Adult Wellness
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Discover why over 1,000,000+ customers trust Midnight Bloom for 100% body-safe <strong className="text-[#F0B8BE]">sex toys</strong>, <strong className="text-[#F0B8BE]">adult toys</strong>, and intimate wellness essentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed font-light">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 hover:border-[#B56571]/50 p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xl transition-all">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F0B8BE]">
                High-Performance Sex Toys for Men in India
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                Looking for the best <strong className="text-white font-semibold">sex toys for men</strong>? Our curated catalog includes world-class <strong className="text-white font-semibold">pocket pussy</strong> masturbators, automated thrusting strokers with 40°C thermal warmth, vibrating <strong className="text-white font-semibold">cock rings</strong>, flexible <strong className="text-white font-semibold">penis rings</strong>, and textured <strong className="text-white font-semibold">penis sleeves</strong>.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                For deeper relaxation and endurance, explore our medical-grade <strong className="text-white font-semibold">prostate massagers</strong> engineered for hands-free stimulation. Every <strong className="text-white font-semibold">men sex toy</strong> is designed with body-safe hypoallergenic materials, rechargeable batteries, and whisper-quiet motors.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['pocket pussy', 'cock ring', 'penis ring', 'prostate massager', 'penis sleeve', 'men sex toys'].map((kw, i) => (
                  <span key={i} className="text-[10.5px] bg-black/70 text-[#F0B8BE] px-3 py-1 rounded-full font-mono border border-[#B56571]/30 shadow-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-xl border border-white/10 hover:border-[#B56571]/50 p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xl transition-all">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F0B8BE]">
                Luxury Sex Toys for Women & Couples
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                Experience transformative climax with our collection of <strong className="text-white font-semibold">sex toys for women</strong>. From touchless sonic air-pulse suction massagers to high-torque wand vibrators, dual-stimulation rabbits, and pelvic kegel exercise systems.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Keep the passion alive across any distance with long-distance Bluetooth app <strong className="text-white font-semibold">sextoys</strong> for couples. Pair your favorite <strong className="text-white font-semibold">sex toy</strong> with our 100% organic water-based botanical lubricants and antibacterial cleaning mists.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['sex toys india', 'sex toy india', 'adult toys', 'sextoys', 'sextoy', 'women sex toys'].map((kw, i) => (
                  <span key={i} className="text-[10.5px] bg-black/70 text-[#F0B8BE] px-3 py-1 rounded-full font-mono border border-[#B56571]/30 shadow-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. Luxury Newsletter & 10% Off Bar */}
      <section className="py-20 px-margin-mobile bg-[#FAF7F5] dark:bg-[#121316] border-t border-black/[0.06] dark:border-white/[0.06] relative overflow-hidden z-20 w-full max-w-full transition-colors">
        <div className="relative z-10 max-w-2xl mx-auto text-center luxury-glass p-8 sm:p-12 rounded-3xl border border-[#B56571]/30 dark:border-[#D98A92]/30 shadow-2xl">
          <FontAwesomeIcon icon={faEnvelope} className="text-[#A33F4D] dark:text-[#D98A92] mb-4 text-3xl" />
          <h3 className="text-2xl sm:text-3xl text-[#181617] dark:text-white mb-3 font-serif font-bold">
            Join the Inner Circle
          </h3>
          <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-300 mb-8 opacity-90 leading-relaxed font-light">
            Subscribe to receive early access to new collections, confidential intimacy editorial articles, and <strong className="text-[#A33F4D] dark:text-[#D98A92] font-semibold">10% off your first ritual</strong> with code <code className="bg-[#FAF3F0] dark:bg-black/60 px-2 py-0.5 rounded text-[#181617] dark:text-white font-mono font-bold border border-[#B56571]/25 dark:border-white/10">VIP10</code>.
          </p>
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              if (newsletterEmail.trim()) {
                showToast('Subscribed discreetly to Midnight Bloom. Welcome to the Inner Circle. Code VIP10 unlocked.', 'success'); 
                setNewsletterEmail('');
              }
            }} 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Your confidential email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="flex-1 bg-white dark:bg-black/60 border border-[#B56571]/25 dark:border-white/20 text-[#181617] dark:text-white py-3.5 px-6 rounded-full focus:outline-none focus:border-[#B56571] text-xs placeholder:text-[#8A7A7D] dark:placeholder:text-neutral-500 font-sans shadow-inner"
            />
            <button
              type="submit"
              className="btn-gold px-8 py-3.5 rounded-full whitespace-nowrap text-xs cursor-pointer shadow-xl text-white font-bold"
            >
              Get 10% Off
            </button>
          </form>
          <p className="text-[11px] text-[#7A696C] dark:text-neutral-500 mt-4">
            We never share or sell your email. 100% Zero-Spam Guarantee.
          </p>
        </div>
      </section>

      {/* Interactive Editorial Article Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

    </div>
  );
};
