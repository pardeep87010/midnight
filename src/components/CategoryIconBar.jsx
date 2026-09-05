import React from 'react';
import { useApp } from '../context/AppContext';
import { STITCH_CATEGORIES } from '../data/mockData';

export const CategoryIconBar = () => {
  const { navigateTo } = useApp();

  return (
    <section className="py-8 px-margin-mobile bg-[#121316] border-b border-black/[0.08] dark:border-white/[0.06] relative z-20 transition-colors w-full overflow-hidden">
      {/* Soft Ambient Background from image (eliminates harsh zoomed lines) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 filter blur-[18px] scale-110 pointer-events-none"
        style={{ backgroundImage: `url('/bg/explore-8-departments-bg.jpg')` }}
      />
      {/* Smooth vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#121316]/90 via-transparent to-[#121316]/90 pointer-events-none" />

      <div className="max-w-container-max mx-auto relative z-10">
        
        {/* Centered Section Heading & Link */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="inline-flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4D80] animate-pulse" />
            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] font-bold text-[#F0B8BE] dark:text-[#D98A92]">
              EXPLORE OUR 8 PRIMARY DEPARTMENTS
            </span>
          </div>
          <div>
            <button 
              onClick={() => navigateTo('catalog', null, 'all')}
              className="text-[11px] sm:text-xs font-mono text-neutral-300 hover:text-[#FF4D80] hover:underline cursor-pointer transition-colors"
            >
              Explore Full Catalog →
            </button>
          </div>
        </div>

        {/* Centered Horizontal Department Strip */}
        <div className="flex items-center justify-start md:justify-center gap-4 sm:gap-6 lg:gap-7 overflow-x-auto hide-scrollbar pb-3 pt-1 px-1">
          {STITCH_CATEGORIES.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo('catalog', null, item.id)}
              className="flex flex-col items-center group shrink-0 focus:outline-none cursor-pointer text-center"
            >
              {/* Luxury Rounded Image Card */}
              <div className="w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] rounded-2xl bg-black/60 dark:bg-black/60 border border-[#B56571]/35 dark:border-white/15 backdrop-blur-md flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.4)] group-hover:border-[#FF4D80] group-hover:shadow-[0_12px_28px_rgba(255,77,128,0.35)] group-active:scale-95 transition-all duration-300 relative overflow-hidden p-1">
                {/* Subtle soft glow background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5E8E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
                
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Label */}
              <span className="mt-2.5 text-[11px] sm:text-xs font-semibold text-neutral-100 group-hover:text-[#FF4D80] transition-colors whitespace-nowrap tracking-tight font-sans max-w-[95px] truncate">
                {item.name}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
