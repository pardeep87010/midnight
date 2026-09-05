import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faLock, 
  faTruck, 
  faPlus, 
  faMinus, 
  faBagShopping, 
  faShieldHalved, 
  faCheckCircle, 
  faBoxOpen, 
  faSpa, 
  faLocationDot, 
  faRotateRight, 
  faTag 
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { STITCH_PRODUCTS, VERIFIED_REVIEWS } from '../data/mockData';

export const ProductDetail = () => {
  const { selectedProductId, addToCart, navigateTo, showToast, productsList } = useApp();
  
  // Safe product resolution
  const product = (productsList || []).find(p => p.id === selectedProductId) || (productsList || [])[0];

  const [selectedColor, setSelectedColor] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('specs'); // specs, box, care, discreet

  useEffect(() => {
    if (product?.colors && product.colors.length > 0) {
      const firstColor = product.colors[0];
      setSelectedColor(typeof firstColor === 'object' ? firstColor.name : firstColor);
    } else {
      setSelectedColor('Standard');
    }
    setActiveImageIndex(0);
  }, [selectedProductId, product]);

  if (!product) {
    return (
      <div className="pt-32 px-margin-mobile max-w-lg mx-auto pb-28 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-[#FAF3F0] dark:bg-[#D98A92]/10 border border-[#B56571]/30 dark:border-[#D98A92]/30 flex items-center justify-center mx-auto text-[#A33F4D] dark:text-[#D98A92]">
          <FontAwesomeIcon icon={faBoxOpen} className="text-2xl" />
        </div>
        <h2 className="text-2xl text-[#181617] dark:text-white font-serif font-bold">Catalog Empty</h2>
        <p className="text-xs text-[#5C4F52] dark:text-neutral-400">All products have been removed. Add products via the Admin Panel to display instruments.</p>
        <button onClick={() => navigateTo('home')} className="btn-gold text-xs font-bold px-8 py-3 rounded-full text-white cursor-pointer shadow-md">
          Return to Home
        </button>
      </div>
    );
  }

  // Pin Code Estimator state
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length >= 3) {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      setDeliveryEstimate(`Guaranteed Discreet Delivery by ${date.toLocaleDateString('en-US', options)} (Free Express Dispatch)`);
      showToast('Delivery available for PIN ' + pincode, 'success');
    }
  };

  const handleAddBundle = () => {
    addToCart(product, 1, selectedColor);
    const lubeItem = (productsList || []).find(p => p.category === 'lubricants-care') || product;
    if (lubeItem && lubeItem.id !== product.id) {
      addToCart(lubeItem, 1, 'Standard');
    }
    showToast('Bundle added to bag with special discount!', 'success');
  };

  const productImages = product?.images && product.images.length > 0 
    ? product.images 
    : ['/product-images/LELO%20Mona%20Wave%20Dual-Motor%20G-Spot%20Wand_0.webp'];

  const specs = product?.specs || {
    sound: '< 28 dB (Whisper Silent)',
    material: 'Medical Liquid Silicone & ABS',
    battery: 'USB Fast Rechargeable',
    waterproof: 'IPX7 Waterproof',
    modes: 'Multi-Frequency Sensation Modes'
  };

  return (
    <div className="pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-28 space-y-14 font-sans bg-[#FAF7F5] dark:bg-[#121316] text-[#181617] dark:text-[#EAE0E1] transition-colors">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-[#7A696C] dark:text-neutral-400 font-medium">
        <button onClick={() => navigateTo('home')} className="hover:text-[#A33F4D] dark:hover:text-[#D98A92] cursor-pointer">Home</button>
        <span>/</span>
        <button onClick={() => navigateTo('catalog', null, product?.category || 'all')} className="hover:text-[#A33F4D] dark:hover:text-[#D98A92] capitalize cursor-pointer">
          {(product?.category || 'vibrators').replace('-', ' ')}
        </button>
        <span>/</span>
        <span className="text-[#A33F4D] dark:text-[#D98A92] truncate font-bold">{product?.name || 'Sensual Instrument'}</span>
      </div>

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative w-full h-[450px] sm:h-[530px] rounded-3xl overflow-hidden bg-white dark:bg-[#16171C] border border-[#B56571]/20 dark:border-white/[0.08] shadow-2xl">
            <img
              src={productImages[activeImageIndex] || productImages[0]}
              alt={product?.name || 'Product Image'}
              className="w-full h-full object-cover transition-all duration-700"
            />
            {/* Gallery Pagination Dots */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {productImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'bg-[#A33F4D] dark:bg-[#D98A92] w-6' : 'bg-black/20 dark:bg-white/40 w-2.5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {productImages.length > 1 && (
            <div className="flex gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#A33F4D] dark:border-[#D98A92] scale-105 shadow-lg' : 'border-black/10 dark:border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover bg-white dark:bg-black" />
                </button>
              ))}
            </div>
          )}

          {/* Discreet Statement Tag */}
          <div className="p-4 rounded-2xl satin-card flex items-center justify-between text-xs text-[#2A2426] dark:text-neutral-300">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faLock} className="text-[#A33F4D] dark:text-[#D98A92] text-sm" />
              <span>Statement Descriptor: <code className="text-[#A33F4D] dark:text-[#D98A92] font-mono font-bold">MB* SERVICES LLC</code></span>
            </div>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">100% Encrypted</span>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="md:col-span-6 space-y-6">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center space-x-1.5 bg-[#FAF3F0] dark:bg-black/60 backdrop-blur-md border border-[#B56571]/35 dark:border-[#D98A92]/30 px-3 py-1 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B56571] dark:bg-[#D98A92] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-[#A33F4D] dark:text-[#F0B8BE]">
                  {product?.badge || 'Top Choice'}
                </span>
              </div>
              {product?.discount && (
                <span className="bg-gradient-to-r from-[#B56571] to-[#8A434E] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-mono shadow-xs border border-white/20">
                  {product.discount}
                </span>
              )}
              <span className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono">
                Department: <strong className="text-[#181617] dark:text-white">{product?.subcategory || product?.category || 'Sensual'}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#181617] dark:text-white font-serif font-bold tracking-tight">
              {product?.name || 'Sensual Instrument'}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline space-x-3 mt-3">
              <span className="text-3xl text-[#A33F4D] dark:text-[#D98A92] font-serif font-bold font-mono">
                ₹{(product?.price || 2499).toLocaleString('en-IN')}
              </span>
              {product?.originalPrice && (
                <span className="text-base text-[#7A696C] dark:text-neutral-500 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                Inclusive of all taxes & plain packaging
              </span>
            </div>

            {/* Stars & Reviews */}
            <div className="flex items-center gap-1.5 mt-3 mb-2">
              <div className="flex text-[#A33F4D] dark:text-[#D98A92] text-xs">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} />
                ))}
              </div>
              <span className="text-xs text-[#5C4F52] dark:text-neutral-300 font-medium ml-1">
                {product?.rating || 5.0} / 5.0 ({product?.reviewsCount || 420} Verified Customer Reviews)
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
            {product?.description || 'Crafted with premium body-safe materials for effortless pleasure, whisper-quiet performance, and guaranteed confidential dispatch across India.'}
          </p>

          {/* Color / Finish Selector */}
          {product?.colors && product.colors.length > 0 && (
            <div className="space-y-3 pt-1">
              <h3 className="text-xs text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider font-semibold">
                Select Finish: <strong className="text-[#181617] dark:text-white">{selectedColor}</strong>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((c, i) => {
                  const colorName = typeof c === 'object' ? c.name : c;
                  const colorHex = typeof c === 'object' ? c.hex : '#B56571';
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(colorName)}
                      className={`w-10 h-10 rounded-full transition-all cursor-pointer ${
                        selectedColor === colorName 
                          ? 'ring-2 ring-[#A33F4D] dark:ring-[#D98A92] ring-offset-2 ring-offset-[#FAF7F5] dark:ring-offset-[#121316] scale-105 shadow-md' 
                          : 'ring-1 ring-black/20 dark:ring-white/20 hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: colorHex }}
                      title={colorName}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* PIN / ZIP Code Delivery Estimator */}
          <div className="p-4 bg-white dark:bg-[#18191E] rounded-2xl border border-[#B56571]/20 dark:border-white/[0.06] space-y-2.5 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#181617] dark:text-white">
              <FontAwesomeIcon icon={faTruck} className="text-[#A33F4D] dark:text-[#D98A92]" />
              <span>Check Delivery & Cash on Delivery (COD) Availability</span>
            </div>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-Digit PIN Code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 bg-[#FAF7F5] dark:bg-black/60 border border-[#B56571]/25 dark:border-white/10 rounded-lg px-3.5 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
              />
              <button
                type="submit"
                className="bg-[#FAF3F0] hover:bg-[#B56571] hover:text-white text-[#A33F4D] dark:bg-[#20222A] dark:text-[#D98A92] px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Check
              </button>
            </form>
            {deliveryEstimate && (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center space-x-1.5 animate-fade-in pt-1">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>{deliveryEstimate}</span>
              </p>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center bg-white dark:bg-[#18191E] rounded-full border border-[#B56571]/25 dark:border-white/10 shadow-xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faMinus} className="text-xs" />
              </button>
              <span className="text-xs px-3 font-mono font-bold text-[#181617] dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlus} className="text-xs" />
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity, selectedColor)}
              className="flex-1 btn-gold py-4 px-6 rounded-full font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xl text-white"
            >
              <FontAwesomeIcon icon={faBagShopping} className="text-sm" />
              <span>Add to Bag • ₹{((product?.price || 2499) * quantity).toLocaleString('en-IN')}</span>
            </button>
          </div>

          {/* Frequently Bought Together Bundle Offer */}
          {product?.bundle && (
            <div className="p-5 bg-white dark:bg-gradient-to-r dark:from-[#1E2028] dark:to-[#16171C] rounded-2xl border border-[#B56571]/25 dark:border-[#D98A92]/30 space-y-3 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#A33F4D] dark:text-[#D98A92] font-bold flex items-center space-x-1">
                  <FontAwesomeIcon icon={faTag} />
                  <span>Frequently Bought Together</span>
                </span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                  {product.bundle.savings}
                </span>
              </div>

              <h4 className="text-sm font-serif font-bold text-[#181617] dark:text-white">
                {product.bundle.name}
              </h4>

              <p className="text-[11px] text-[#5C4F52] dark:text-neutral-300 font-light">
                Includes {product.name} + {product.bundle.items?.join(' + ')}.
              </p>

              <div className="flex justify-between items-center pt-2">
                <div className="space-x-2">
                  <span className="text-base font-bold text-[#A33F4D] dark:text-[#D98A92] font-mono">₹{product.bundle.bundlePrice?.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-[#7A696C] dark:text-neutral-500 line-through font-mono">₹{product.bundle.bundleOriginal?.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={handleAddBundle}
                  className="bg-[#FAF3F0] hover:bg-[#B56571] hover:text-white border border-[#B56571]/30 text-[#A33F4D] dark:bg-white/[0.08] dark:border-[#D98A92]/40 dark:text-[#D98A92] px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  + Add Bundle
                </button>
              </div>
            </div>
          )}

          {/* Discreet Packaging Guarantee Notice */}
          <div className="p-4 rounded-2xl satin-card flex items-start space-x-3 text-xs text-[#2A2426] dark:text-neutral-300">
            <FontAwesomeIcon icon={faTruck} className="text-[#A33F4D] dark:text-[#D98A92] text-base shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#181617] dark:text-white block">Guaranteed Discreet Delivery & Anonymized Billing</span>
              <p className="text-[11px] text-[#5C4F52] dark:text-neutral-400 mt-0.5 leading-relaxed font-light">
                Arrives in a completely plain brown or black box with zero logos or mention of adult goods. Bank statement lists "MB* SERVICES LLC".
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Product Details Multi-Tab Section */}
      <div className="border-t border-black/[0.08] dark:border-white/10 pt-12 space-y-6">
        <div className="flex border-b border-black/[0.08] dark:border-white/10 space-x-6 overflow-x-auto hide-scrollbar text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-colors uppercase tracking-wider whitespace-nowrap cursor-pointer ${
              activeTab === 'specs' ? 'text-[#A33F4D] dark:text-[#D98A92] border-b-2 border-[#A33F4D] dark:border-[#D98A92] font-bold' : 'text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('box')}
            className={`pb-3 transition-colors uppercase tracking-wider whitespace-nowrap cursor-pointer ${
              activeTab === 'box' ? 'text-[#A33F4D] dark:text-[#D98A92] border-b-2 border-[#A33F4D] dark:border-[#D98A92] font-bold' : 'text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white'
            }`}
          >
            What's In The Box
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`pb-3 transition-colors uppercase tracking-wider whitespace-nowrap cursor-pointer ${
              activeTab === 'care' ? 'text-[#A33F4D] dark:text-[#D98A92] border-b-2 border-[#A33F4D] dark:border-[#D98A92] font-bold' : 'text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white'
            }`}
          >
            How To Use & Clean
          </button>
          <button
            onClick={() => setActiveTab('discreet')}
            className={`pb-3 transition-colors uppercase tracking-wider whitespace-nowrap cursor-pointer ${
              activeTab === 'discreet' ? 'text-[#A33F4D] dark:text-[#D98A92] border-b-2 border-[#A33F4D] dark:border-[#D98A92] font-bold' : 'text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white'
            }`}
          >
            Discreet Shipping Assurance
          </button>
        </div>

        {/* Tab 1: Specs */}
        {activeTab === 'specs' && (
          <div className="satin-card rounded-2xl p-6 sm:p-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#2A2426] dark:text-neutral-300">
              <div className="p-3.5 bg-[#FAF7F5] dark:bg-black/40 rounded-xl border border-[#B56571]/20 dark:border-white/5 flex justify-between">
                <span className="text-[#7A696C] dark:text-neutral-400">Acoustic Sound Level</span>
                <span className="text-[#A33F4D] dark:text-[#D98A92] font-mono font-bold">{specs.sound}</span>
              </div>
              <div className="p-3.5 bg-[#FAF7F5] dark:bg-black/40 rounded-xl border border-[#B56571]/20 dark:border-white/5 flex justify-between">
                <span className="text-[#7A696C] dark:text-neutral-400">Body Materials</span>
                <span className="text-[#181617] dark:text-white font-medium">{specs.material}</span>
              </div>
              <div className="p-3.5 bg-[#FAF7F5] dark:bg-black/40 rounded-xl border border-[#B56571]/20 dark:border-white/5 flex justify-between">
                <span className="text-[#7A696C] dark:text-neutral-400">Battery & Charging</span>
                <span className="text-[#181617] dark:text-white font-medium">{specs.battery}</span>
              </div>
              <div className="p-3.5 bg-[#FAF7F5] dark:bg-black/40 rounded-xl border border-[#B56571]/20 dark:border-white/5 flex justify-between">
                <span className="text-[#7A696C] dark:text-neutral-400">Waterproof Standard</span>
                <span className="text-[#181617] dark:text-white font-medium">{specs.waterproof}</span>
              </div>
              <div className="p-3.5 bg-[#FAF7F5] dark:bg-black/40 rounded-xl border border-[#B56571]/20 dark:border-white/5 flex justify-between">
                <span className="text-[#7A696C] dark:text-neutral-400">Vibration Modes</span>
                <span className="text-[#181617] dark:text-white font-medium">{specs.modes}</span>
              </div>
              {specs.dimensions && (
                <div className="p-3.5 bg-[#FAF7F5] dark:bg-black/40 rounded-xl border border-[#B56571]/20 dark:border-white/5 flex justify-between">
                  <span className="text-[#7A696C] dark:text-neutral-400">Dimensions</span>
                  <span className="text-[#181617] dark:text-white font-mono">{specs.dimensions}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: What's In The Box */}
        {activeTab === 'box' && (
          <div className="satin-card rounded-2xl p-6 sm:p-8 animate-fade-in space-y-4">
            <h4 className="text-sm font-bold text-[#181617] dark:text-white uppercase tracking-wider font-mono">
              Unboxing Contents:
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5C4F52] dark:text-neutral-300 font-light">
              {(product?.inTheBox || [
                'Primary Instrument Unit',
                'Magnetic USB Fast Charging Cable',
                'Satin Protective Storage Pouch',
                'Confidential User Manual & 1-Year Defect Warranty Card'
              ]).map((item, idx) => (
                <li key={idx} className="flex items-center space-x-2.5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#A33F4D] dark:text-[#D98A92] text-xs" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 3: Care */}
        {activeTab === 'care' && (
          <div className="satin-card rounded-2xl p-6 sm:p-8 animate-fade-in space-y-4 text-xs text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
            <h4 className="text-sm font-bold text-[#181617] dark:text-white uppercase tracking-wider font-mono">
              Recommended Care & Maintenance:
            </h4>
            <p>1. <strong>Lubrication:</strong> Use strictly water-based lubricants on silicone toys. Avoid silicone-based lubes on silicone instruments to prevent material degradation.</p>
            <p>2. <strong>Cleaning:</strong> Wash thoroughly with warm water and antibacterial toy mist or mild fragrance-free soap before and after every ritual.</p>
            <p>3. <strong>Storage:</strong> Pat dry with a clean lint-free cloth and store inside the included satin travel pouch in a cool, dust-free environment away from direct sunlight.</p>
          </div>
        )}

        {/* Tab 4: Discreet Shipping */}
        {activeTab === 'discreet' && (
          <div className="satin-card rounded-2xl p-6 sm:p-8 animate-fade-in space-y-3 text-xs text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
            <h4 className="text-sm font-bold text-[#181617] dark:text-white uppercase tracking-wider font-mono">
              100% Confidentiality Pledge:
            </h4>
            <p>• Shipped in completely unmarked, plain brown cardboard boxing with no logos, product photos, or adult descriptors.</p>
            <p>• Sender name on label: <code className="text-[#A33F4D] dark:text-[#D98A92] font-mono">MB Logistics</code>.</p>
            <p>• Billing descriptor on credit card/UPI summary: <code className="text-[#A33F4D] dark:text-[#D98A92] font-mono">MB* SERVICES LLC</code>.</p>
          </div>
        )}
      </div>

      {/* Verified Reviews Section */}
      <div className="border-t border-black/[0.08] dark:border-white/10 pt-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-serif font-bold text-[#181617] dark:text-white">
              Customer Reviews ({product?.reviewsCount || 420})
            </h3>
            <p className="text-xs text-[#7A696C] dark:text-neutral-400 mt-1 font-light">Real feedback from verified purchasers.</p>
          </div>
          <button
            onClick={() => showToast('Review submission window opens after order confirmation.', 'info')}
            className="bg-[#FAF3F0] hover:bg-[#B56571] hover:text-white border border-[#B56571]/30 text-[#A33F4D] dark:bg-white/[0.08] dark:border-[#D98A92]/40 dark:text-[#D98A92] px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer w-fit shadow-xs"
          >
            Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VERIFIED_REVIEWS.map((rev) => (
            <div key={rev.id} className="satin-card p-6 rounded-2xl space-y-3 shadow-lg">
              <div className="flex justify-between items-start">
                <div className="flex text-[#A33F4D] dark:text-[#D98A92] text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </div>
                <span className="text-[10px] text-[#7A696C] dark:text-neutral-500 font-mono">{rev.date}</span>
              </div>
              <h4 className="text-sm font-bold text-[#181617] dark:text-white font-serif">"{rev.title}"</h4>
              <p className="text-xs text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">{rev.content}</p>
              <div className="pt-2 border-t border-black/[0.06] dark:border-white/5 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#181617] dark:text-white">{rev.name}</span>
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-mono">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
