import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Volume2, 
  ShieldCheck, 
  Package, 
  Heart, 
  ShoppingBag, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickViewModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    wishlist, 
    toggleWishlist,
    navigateTo 
  } = useApp();

  const [selectedColor, setSelectedColor] = useState(
    quickViewProduct?.colors ? (typeof quickViewProduct.colors[0] === 'object' ? quickViewProduct.colors[0].name : quickViewProduct.colors[0]) : 'Standard'
  );

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white dark:bg-[#16171C] border border-[#B56571]/25 dark:border-[#D98A92]/30 rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-colors">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 p-2 text-[#7A696C] hover:text-[#181617] dark:text-neutral-400 dark:hover:text-white bg-[#FAF7F5] dark:bg-[#1F2026] rounded-full transition-colors z-10 cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Image Showcase */}
          <div className="relative rounded-2xl overflow-hidden bg-[#FAF7F5] dark:bg-[#121316] aspect-square border border-[#B56571]/20 dark:border-white/10 shadow-xs">
            <img
              src={quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
            {quickViewProduct.badge && (
              <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 bg-black/65 backdrop-blur-md border border-[#B56571]/35 dark:border-white/15 px-3 py-1 rounded-full shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D98A92] animate-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-[0.18em] font-bold text-[#F0B8BE] dark:text-[#EAE0E1]">
                  {quickViewProduct.badge}
                </span>
              </div>
            )}
            {quickViewProduct.discount && (
              <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-[#B56571] to-[#8A434E] text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md border border-white/20">
                {quickViewProduct.discount}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#A33F4D] dark:text-[#D98A92] font-semibold block font-mono">
                {quickViewProduct.subcategory || quickViewProduct.category}
              </span>
              <h2 className="text-xl font-serif font-bold text-[#181617] dark:text-white mt-1">
                {quickViewProduct.name}
              </h2>
              
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center text-[#A33F4D] dark:text-[#D98A92] text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#A33F4D] dark:fill-[#D98A92] mr-1" />
                  <span className="font-bold">{quickViewProduct.rating || 5.0}</span>
                  <span className="text-[#7A696C] dark:text-neutral-500 ml-1">({quickViewProduct.reviewsCount || 48} verified)</span>
                </div>
                <span className="text-[#7A696C] dark:text-neutral-600">•</span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> In Stock
                </span>
              </div>
            </div>

            {/* Price in INR */}
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-bold text-[#A33F4D] dark:text-[#D98A92] font-mono">
                ₹{quickViewProduct.price?.toLocaleString('en-IN')}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-[#7A696C] dark:text-neutral-500 line-through font-mono">
                  ₹{quickViewProduct.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
              {quickViewProduct.shortDescription || quickViewProduct.description}
            </p>

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => {
                  addToCart(quickViewProduct, 1, selectedColor);
                  setQuickViewProduct(null);
                }}
                className="flex-1 btn-gold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-xl font-bold uppercase tracking-wider text-white cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Discreet Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted 
                    ? 'border-[#B56571] text-[#A33F4D] bg-[#B56571]/15' 
                    : 'border-[#B56571]/25 dark:border-white/10 text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white bg-[#FAF7F5] dark:bg-[#1F2026]'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#A33F4D] text-[#A33F4D]' : ''}`} />
              </button>
            </div>

            {/* Full product page link */}
            <div className="text-center pt-1">
              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigateTo('product-detail', quickViewProduct.id);
                }}
                className="text-xs text-[#A33F4D] dark:text-[#D98A92] hover:underline flex items-center justify-center mx-auto space-x-1 font-semibold cursor-pointer"
              >
                <span>View Full Laboratory Specs & Discreet Packaging Proof</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
