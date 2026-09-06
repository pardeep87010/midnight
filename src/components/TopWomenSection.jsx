import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCartPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';

export const TopWomenSection = () => {
  const { navigateTo, addToCart, showToast, productsList } = useApp();

  const womenProducts = (productsList || []).filter(p => 
    p.category === 'vibrators' || p.category === 'air-pressure-suction' || p.category === 'dildos-insertables'
  ).slice(0, 5);

  if (!womenProducts || womenProducts.length === 0) {
    return null;
  }

  const handleAddToCart = (item) => {
    addToCart(item, 1, item.colors && item.colors[0] ? (typeof item.colors[0] === 'object' ? item.colors[0].name : item.colors[0]) : 'Standard');
    showToast(`Added "${item.name}" to your confidential bag!`, 'success');
  };

  return (
    <section className="py-16 px-margin-mobile bg-[#FAF3F0] dark:bg-[#141519] border-b border-black/[0.06] dark:border-white/[0.06] relative z-20 transition-colors w-full overflow-hidden">
      <div className="max-w-container-max mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold text-[#A33F4D] dark:text-[#D98A92]">
                FEMALE WELLNESS & CLITORAL SANCTUARY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl text-[#181617] dark:text-white font-serif font-bold tracking-tight uppercase">
              TOP WOMEN PRODUCTS
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-400 mt-1 font-light">
              Whisper-quiet air-pulse suction, dual rabbit wands & pelvic Kegel eggs crafted from 100% liquid silicone.
            </p>
          </div>

          <button
            onClick={() => navigateTo('catalog', null, 'vibrators')}
            className="text-xs font-bold text-[#A33F4D] dark:text-[#D98A92] uppercase tracking-wider hover:underline flex items-center justify-center space-x-1.5 cursor-pointer font-mono"
          >
            <span>View All Women Gear</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </button>
        </div>

        {/* 5-Column Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {womenProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#B56571]/20 dark:border-neutral-800 overflow-hidden group flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:border-[#B56571]/50 dark:hover:border-[#D98A92]/40 hover:-translate-y-1"
            >
              {/* Product Image Area */}
              <div className="relative aspect-square w-full bg-[#FAF7F5] dark:bg-[#121316] overflow-hidden">
                {/* Luxury Frosted Badge */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1.5 bg-black/65 backdrop-blur-md border border-[#B56571]/35 dark:border-white/15 px-2.5 py-0.5 rounded-full shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D98A92] animate-pulse" />
                  <span className="text-[8.5px] font-mono uppercase tracking-[0.15em] font-bold text-[#F0B8BE] dark:text-[#EAE0E1]">
                    {item.badge || 'SIGNATURE'}
                  </span>
                </div>
                {item.discount && (
                  <div className="absolute top-2.5 right-2.5 z-10 bg-gradient-to-r from-[#B56571] to-[#8A434E] text-white font-mono text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm border border-white/20">
                    {item.discount}
                  </div>
                )}

                <img
                  src={item.images && item.images[0] ? item.images[0] : item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  onClick={() => navigateTo('product-detail', item.id)}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 cursor-pointer"
                />
              </div>

              {/* Product Details */}
              <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2.5 bg-white dark:bg-[#18181B]">
                <div>
                  {/* Discount & Deal Badge Line */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="bg-[#B56571] text-white text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                      {item.discount || '25% off'}
                    </span>
                    <span className="text-[#A33F4D] dark:text-[#D98A92] text-[9px] sm:text-[10px] font-bold">
                      Limited time deal
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => navigateTo('product-detail', item.id)}
                    className="text-xs sm:text-sm font-semibold text-[#181617] dark:text-white font-sans line-clamp-2 hover:text-[#A33F4D] dark:hover:text-[#D98A92] cursor-pointer transition-colors leading-snug"
                  >
                    {item.name}
                  </h3>

                  {/* Price Comparison */}
                  <div className="flex items-baseline gap-1.5 flex-wrap mt-1 font-mono">
                    <span className="text-sm sm:text-base font-bold text-[#181617] dark:text-white">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-[10px] sm:text-xs text-[#7A696C] dark:text-neutral-400 line-through">
                        M.R.P: ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 text-[10px] text-[#A33F4D] dark:text-[#D98A92] pt-1">
                    <div className="flex text-amber-400 text-[9px]">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} />
                      ))}
                    </div>
                    <span className="text-[#7A696C] dark:text-neutral-400 font-medium">({item.reviewsCount || 420})</span>
                  </div>
                </div>

                {/* Add To Cart CTA Button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-[#FAF3F0] hover:bg-[#B56571] text-[#A33F4D] hover:text-white dark:bg-[#202026] dark:hover:bg-[#B56571] dark:text-neutral-200 dark:hover:text-white border border-[#B56571]/25 dark:border-white/10 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center space-x-1.5"
                >
                  <FontAwesomeIcon icon={faCartPlus} className="text-xs" />
                  <span>Add To Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
