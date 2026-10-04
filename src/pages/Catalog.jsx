import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCartPlus, 
  faStar, 
  faSliders, 
  faVolumeLow, 
  faXmark, 
  faSpinner,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { STITCH_CATEGORIES, STITCH_PRODUCTS } from '../data/mockData';
import { CDN_CONFIG, handleImageError } from '../utils/cdnCache';

export const Catalog = ({ onOpenQuiz }) => {
  const { 
    navigateTo, 
    addToCart, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    productsList 
  } = useApp();

  const [activeSort, setActiveSort] = useState('featured');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  
  // 20-item chunked pagination / infinite scroll state
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  const currentCategoryData = STITCH_CATEGORIES.find(c => c.id === selectedCategory);
  const activeProducts = productsList || [];

  const filteredProducts = activeProducts.filter(product => {
    if (!product) return false;
    if (selectedCategory && selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    if (selectedSubcategory && selectedSubcategory !== 'all' && product.subcategory !== selectedSubcategory) {
      return false;
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name?.toLowerCase().includes(q);
      const matchDesc = product.description?.toLowerCase().includes(q);
      const matchSub = product.subcategory?.toLowerCase().includes(q);
      const matchSubtitle = product.subtitle?.toLowerCase().includes(q);
      const matchKeywords = Array.isArray(product.keywords) && product.keywords.some(k => typeof k === 'string' && (k.toLowerCase().includes(q) || q.includes(k.toLowerCase())));
      if (!matchName && !matchDesc && !matchSub && !matchSubtitle && !matchKeywords) return false;
    }
    return true;
  }).sort((a, b) => {
    if (activeSort === 'price-low') return (a.price || 0) - (b.price || 0);
    if (activeSort === 'price-high') return (b.price || 0) - (a.price || 0);
    if (activeSort === 'rating') return (b.rating || 5) - (a.rating || 5);
    return 0;
  });

  // Reset pagination when category, subcategory, or search changes
  useEffect(() => {
    setVisibleCount(20);
  }, [selectedCategory, selectedSubcategory, searchQuery, activeSort]);

  // Infinite Scroll Intersection Observer (Loads next 20 items on scroll)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < filteredProducts.length && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 20, filteredProducts.length));
          setIsLoadingMore(false);
        }, 300); // 300ms smooth debounce
      }
    }, { rootMargin: '200px' });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [visibleCount, filteredProducts.length, isLoadingMore]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const getProductColor = (prod) => {
    if (prod?.colors && prod.colors.length > 0) {
      const first = prod.colors[0];
      return typeof first === 'object' ? (first.name || 'Standard') : first;
    }
    return 'Standard';
  };

  const availableSubcategories = React.useMemo(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const prodsInCat = activeProducts.filter(p => p.category === selectedCategory);
      return Array.from(new Set(prodsInCat.map(p => p.subcategory).filter(Boolean)));
    }
    return Array.from(new Set(activeProducts.map(p => p.subcategory).filter(Boolean)));
  }, [selectedCategory, activeProducts]);

  return (
    <div className="pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-28 space-y-10 font-sans bg-[#FAF7F5] dark:bg-[#121316] text-[#181617] dark:text-[#EAE0E1] transition-colors">
      
      {/* Breadcrumb & Department Hero */}
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center space-x-2 text-xs text-[#7A696C] dark:text-neutral-400 font-medium">
          <button onClick={() => navigateTo('home')} className="hover:text-[#A33F4D] dark:hover:text-[#D98A92] cursor-pointer">Home</button>
          <span>/</span>
          <span className="text-[#A33F4D] dark:text-[#D98A92] capitalize font-bold">
            {selectedCategory === 'all' ? `All ${activeProducts.length} Instruments` : currentCategoryData?.name || selectedCategory}
          </span>
          {selectedSubcategory !== 'all' && (
            <>
              <span>/</span>
              <span className="text-[#181617] dark:text-white">{selectedSubcategory}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#181617] dark:text-white font-serif font-bold tracking-tight">
          {selectedCategory === 'all' 
            ? 'The Luxury Sensual Collection' 
            : currentCategoryData?.name || 'Collection'}
        </h1>

        <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-400 leading-relaxed font-light">
          {selectedCategory === 'all'
            ? `Explore our collection of ${activeProducts.length} certified medical-grade luxury sensual instruments with whisper-quiet motors, multi-angle imagery, and guaranteed 100% plain packaging discretion.`
            : (currentCategoryData?.tagline || 'Engineered for whisper-quiet performance, anatomical stimulation, and 100% plain packaging discretion.')}
        </p>

        {searchQuery && searchQuery.trim() && (
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-[#1E2028] border border-[#B56571]/40 dark:border-[#D98A92]/40 px-3.5 py-1.5 rounded-full text-xs text-[#181617] dark:text-white shadow-xs">
            <span>Search Results for: <strong className="text-[#A33F4D] dark:text-[#D98A92]">"{searchQuery}"</strong> ({filteredProducts.length} items)</span>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white ml-1 cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
          </div>
        )}
      </div>

      {/* Primary Department Switch Tabs */}
      <div className="flex space-x-2.5 overflow-x-auto hide-scrollbar pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
        <button
          onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'btn-gold text-white shadow-md'
              : 'bg-white dark:bg-[#18191E] text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white border border-[#B56571]/20 dark:border-white/[0.06]'
          }`}
        >
          All Items ({activeProducts.length})
        </button>
        {STITCH_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory('all'); }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'btn-gold text-white shadow-md'
                : 'bg-white dark:bg-[#18191E] text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white border border-[#B56571]/20 dark:border-white/[0.06]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Subcategory Pills & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#18191E] p-4 rounded-2xl border border-[#B56571]/20 dark:border-white/[0.06] shadow-xs">
        
        {/* Subcategories */}
        <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono transition-all whitespace-nowrap cursor-pointer ${
              selectedSubcategory === 'all'
                ? 'bg-[#B56571] text-white font-bold shadow'
                : 'bg-[#FAF7F5] dark:bg-black/40 text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white border border-[#B56571]/20 dark:border-white/5'
            }`}
          >
            All Sub-Types
          </button>
          {availableSubcategories.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono transition-all whitespace-nowrap cursor-pointer ${
                selectedSubcategory === sub
                  ? 'bg-[#B56571] text-white font-bold shadow'
                  : 'bg-[#FAF7F5] dark:bg-black/40 text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white border border-[#B56571]/20 dark:border-white/5'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-3 text-xs text-[#5C4F52] dark:text-neutral-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faSliders} className="text-[#A33F4D] dark:text-[#D98A92]" />
            <span>Sort:</span>
          </span>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className="bg-[#FAF7F5] dark:bg-[#121316] border border-[#B56571]/25 dark:border-white/10 rounded-full px-4 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-sans cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="rating">Highest Rated (★ 5.0)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* Showing Count Status */}
      <div className="flex justify-between items-center text-xs text-[#7A696C] dark:text-neutral-400 font-mono">
        <span>
          Showing <strong className="text-[#181617] dark:text-white">{visibleProducts.length}</strong> of <strong className="text-[#A33F4D] dark:text-[#D98A92]">{filteredProducts.length}</strong> instruments
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#18191E] rounded-3xl p-8 space-y-5 border border-[#B56571]/20 dark:border-white/5 max-w-2xl mx-auto shadow-xl transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#FAF3F0] dark:bg-[#D98A92]/10 border border-[#B56571]/30 dark:border-[#D98A92]/30 flex items-center justify-center mx-auto text-[#A33F4D] dark:text-[#D98A92]">
            <FontAwesomeIcon icon={faBoxOpen} className="text-xl" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg text-[#181617] dark:text-white font-serif font-bold">
              No Instruments Found in This Category
            </h3>
            <p className="text-[#5C4F52] dark:text-neutral-400 text-xs max-w-md mx-auto leading-relaxed">
              No items match your active search query or department filter. Try resetting filters to explore all available products.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); setSearchQuery(''); }}
              className="btn-gold text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer shadow-md text-white"
            >
              Reset Filters & View All
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {visibleProducts.map((prod) => {
            const defaultColor = getProductColor(prod);
            const imageUrl = (prod?.images && prod.images[0]) ? prod.images[0] : '/product-images/LELO%20Mona%20Wave%20Dual-Motor%20G-Spot%20Wand_0.webp';
            const discountPct = prod.discount || (prod.originalPrice ? `${Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% off` : '20% off');

            return (
              <div
                key={prod.id}
                className="satin-card rounded-2xl overflow-hidden group flex flex-col justify-between animate-fade-in shadow-md hover:shadow-xl transition-all duration-300 border border-[#B56571]/20 dark:border-white/10"
              >
                {/* Image Container with CDN optimization */}
                <div className="aspect-square sm:aspect-[4/5] w-full relative overflow-hidden bg-[#FAF7F5] dark:bg-[#141519] flex items-center justify-center">
                  {/* Luxury Frosted Badges */}
                  {prod.badge && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex items-center space-x-1 bg-black/70 backdrop-blur-md border border-[#B56571]/35 dark:border-white/15 px-2 py-0.5 rounded-full shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D98A92] animate-pulse" />
                      <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider font-bold text-[#F0B8BE] dark:text-[#EAE0E1]">
                        {prod.badge}
                      </span>
                    </div>
                  )}

                  <img
                    alt={prod.name}
                    loading="lazy"
                    onClick={() => navigateTo('product-detail', prod.id)}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 cursor-pointer"
                    src={CDN_CONFIG.getOptimizedImageUrl(imageUrl)}
                    onError={handleImageError}
                  />
                  
                  <button
                    onClick={() => addToCart(prod, 1, defaultColor)}
                    className="hidden sm:flex absolute bottom-3 right-3 bg-white/90 dark:bg-[#121316]/90 backdrop-blur text-[#A33F4D] dark:text-[#D98A92] w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#B56571] hover:text-white shadow-xl cursor-pointer"
                    title="Add to Bag"
                  >
                    <FontAwesomeIcon icon={faCartPlus} className="text-sm" />
                  </button>
                </div>

                {/* Info Block (Optimized for 2-column mobile & desktop) */}
                <div className="p-3 sm:p-4 space-y-2 flex flex-col justify-between flex-1">
                  <div className="space-y-1.5">
                    {/* Deal / Discount Badge Strip */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-[#B56571] text-white text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                        {discountPct}
                      </span>
                      <span className="text-[#A33F4D] dark:text-[#D98A92] text-[9px] sm:text-[10px] font-bold">
                        Limited time deal
                      </span>
                    </div>

                    {/* Price Comparison */}
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-[#181617] dark:text-white font-mono">
                        ₹{(prod.price || 999).toLocaleString('en-IN')}
                      </span>
                      {prod.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-[#7A696C] dark:text-neutral-500 line-through font-mono">
                          ₹{prod.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => navigateTo('product-detail', prod.id)}
                      className="text-xs sm:text-sm text-[#181617] dark:text-white hover:text-[#A33F4D] dark:hover:text-[#D98A92] cursor-pointer font-sans font-semibold transition-colors line-clamp-2 leading-snug"
                    >
                      {prod.name}
                    </h3>

                    {/* Ratings */}
                    <div className="flex items-center space-x-1 text-[10px] text-[#A33F4D] dark:text-[#D98A92]">
                      <div className="flex text-amber-400 text-[9px]">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon key={i} icon={faStar} />
                        ))}
                      </div>
                      <span className="text-[#7A696C] dark:text-neutral-400 font-medium">({prod.reviewsCount || 420})</span>
                    </div>
                  </div>

                  {/* Add to Bag Button (Touch-optimized for mobile & desktop) */}
                  <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
                    <button
                      onClick={() => addToCart(prod, 1, defaultColor)}
                      className="w-full bg-[#FAF7F5] dark:bg-white/10 hover:bg-[#B56571] hover:text-white dark:hover:bg-[#B56571] text-[#A33F4D] dark:text-[#EAE0E1] border border-[#B56571]/30 dark:border-white/15 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faCartPlus} className="text-[10px]" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="py-6 flex justify-center items-center">
        {visibleCount < filteredProducts.length ? (
          <div className="flex items-center space-x-2 text-xs font-mono text-[#A33F4D] dark:text-[#D98A92]">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
            <span>Loading next 20 items...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <span className="text-xs font-mono text-[#7A696C] dark:text-neutral-500">
            ✓ All {filteredProducts.length} items loaded
          </span>
        ) : null}
      </div>

    </div>
  );
};
