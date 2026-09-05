import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXmark, 
  faWandMagicSparkles, 
  faHeart, 
  faSliders, 
  faCheck, 
  faArrowRight, 
  faRotateRight, 
  faBagShopping
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';

export const SensoryQuizModal = ({ isOpen, onClose }) => {
  const { navigateTo, addToCart, productsList } = useApp();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    target: '',
    sensation: '',
    experience: ''
  });
  const [recommendedProduct, setRecommendedProduct] = useState(null);

  if (!isOpen) return null;

  const handleSelectOption = (key, value) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calculate recommendation
      const list = productsList || [];
      let match = list[0] || null; // default
      if (updated.target === 'partner') {
        match = list.find(p => p.category === 'vibrators' && p.subcategory?.includes('Rabbit')) || list[0];
      } else if (updated.target === 'men' || updated.sensation === 'stroker') {
        match = list.find(p => p.category === 'male-masturbators') || list[0];
      } else if (updated.sensation === 'deep') {
        match = list.find(p => p.subcategory?.includes('Wand')) || list[0];
      } else if (updated.sensation === 'wellness') {
        match = list.find(p => p.category === 'air-pressure-suction') || list[0];
      }
      setRecommendedProduct(match);
      setStep(4);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({ target: '', sensation: '', experience: '' });
    setRecommendedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none font-sans">
      <div className="bg-[#141519] border border-[#B56571]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
        
        {/* Dedicated Background Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none rounded-3xl"
          style={{ backgroundImage: `url('/bg/explore-8-departments-bg.jpg')` }}
        />
        {/* Dark luxury vignette overlay so text and options are ultra legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/94 via-black/85 to-black/95 backdrop-blur-[1px] rounded-3xl pointer-events-none" />

        {/* Inner Content Layer */}
        <div className="relative z-10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-1 -right-1 text-neutral-400 hover:text-white transition-colors p-2 cursor-pointer rounded-full hover:bg-white/10"
            aria-label="Close Quiz"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1.5 mb-6 pr-6 pl-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F0B8BE] font-bold">
              Intimate Matching Assistant
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Find Your Ideal Ritual
            </h2>
            <p className="text-xs text-neutral-300 font-light">
              Answer 3 quick confidential questions to reveal your personalized match.
            </p>
          </div>

          {/* Progress Bar */}
          {step <= 3 && (
            <div className="w-full bg-white/10 h-1.5 rounded-full mb-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#D98A92] to-[#B56571] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-white text-center">
                1. Who is this intimate ritual for?
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => handleSelectOption('target', 'women')}
                  className="w-full p-4 rounded-xl border border-white/10 bg-black/50 hover:bg-[#B56571]/20 hover:border-[#D98A92]/60 backdrop-blur-md text-left text-xs font-semibold text-white transition-all cursor-pointer flex justify-between items-center group shadow-md"
                >
                  <span>For Myself (Female Anatomy / Clitoral & G-Spot)</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[#D98A92] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => handleSelectOption('target', 'men')}
                  className="w-full p-4 rounded-xl border border-white/10 bg-black/50 hover:bg-[#B56571]/20 hover:border-[#D98A92]/60 backdrop-blur-md text-left text-xs font-semibold text-white transition-all cursor-pointer flex justify-between items-center group shadow-md"
                >
                  <span>For Myself (Male Anatomy / Stroker & Prostate)</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[#D98A92] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => handleSelectOption('target', 'partner')}
                  className="w-full p-4 rounded-xl border border-white/10 bg-black/50 hover:bg-[#B56571]/20 hover:border-[#D98A92]/60 backdrop-blur-md text-left text-xs font-semibold text-white transition-all cursor-pointer flex justify-between items-center group shadow-md"
                >
                  <span>For Couples / Partner Exploration</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[#D98A92] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-white text-center">
                2. What type of sensation do you desire most?
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => handleSelectOption('sensation', 'touchless')}
                  className="w-full p-4 rounded-xl border border-white/10 bg-black/50 hover:bg-[#B56571]/20 hover:border-[#D98A92]/60 backdrop-blur-md text-left text-xs font-semibold text-white transition-all cursor-pointer flex justify-between items-center group shadow-md"
                >
                  <span>Air-Pulse Wave & Touchless Suction</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[#D98A92] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => handleSelectOption('sensation', 'deep')}
                  className="w-full p-4 rounded-xl border border-white/10 bg-black/50 hover:bg-[#B56571]/20 hover:border-[#D98A92]/60 backdrop-blur-md text-left text-xs font-semibold text-white transition-all cursor-pointer flex justify-between items-center group shadow-md"
                >
                  <span>Deep Rumbling Full-Body Wand Vibration</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[#D98A92] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => handleSelectOption('sensation', 'stroker')}
                  className="w-full p-4 rounded-xl border border-white/10 bg-black/50 hover:bg-[#B56571]/20 hover:border-[#D98A92]/60 backdrop-blur-md text-left text-xs font-semibold text-white transition-all cursor-pointer flex justify-between items-center group shadow-md"
                >
                  <span>Textured Thermal Auto-Stroking & Suction</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[#D98A92] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-white text-center">
                3. What is your preferred acoustic noise level?
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => handleSelectOption('experience', 'silent')}
                  className="w-full p-4 rounded-xl border border-white/10 bg-black/50 hover:bg-[#B56571]/20 hover:border-[#D98A92]/60 backdrop-blur-md text-left text-xs font-semibold text-white transition-all cursor-pointer flex justify-between items-center group shadow-md"
                >
                  <span>Whisper-Silent Under Door (&lt; 28 dB)</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[#D98A92] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => handleSelectOption('experience', 'moderate')}
                  className="w-full p-4 rounded-xl border border-white/10 bg-black/50 hover:bg-[#B56571]/20 hover:border-[#D98A92]/60 backdrop-blur-md text-left text-xs font-semibold text-white transition-all cursor-pointer flex justify-between items-center group shadow-md"
                >
                  <span>Maximum Power Output (Any sound level)</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[#D98A92] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && (
            recommendedProduct ? (
              <div className="space-y-5 animate-fade-in text-center">
                <div className="w-12 h-12 rounded-full bg-[#B56571]/20 border border-[#D98A92]/40 flex items-center justify-center mx-auto text-[#D98A92] shadow-lg">
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="text-xl" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#F0B8BE] uppercase font-bold tracking-widest">
                    99.8% Match Recommendation
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {recommendedProduct.name}
                  </h3>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto font-light">
                    {recommendedProduct.description}
                  </p>
                </div>

                <div className="p-4 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-4 text-left shadow-lg">
                  <img
                    src={recommendedProduct.images && recommendedProduct.images[0] ? recommendedProduct.images[0] : '/product-images/LELO%20Mona%20Wave%20Dual-Motor%20G-Spot%20Wand_0.webp'}
                    alt={recommendedProduct.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 bg-black shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#D98A92] font-mono block font-bold truncate">{recommendedProduct.subcategory}</span>
                    <span className="text-sm font-bold text-white font-mono">₹{recommendedProduct.price?.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-neutral-400 block truncate">{recommendedProduct.specs?.sound || '< 30 dB'} • {recommendedProduct.specs?.waterproof || 'IPX7 Waterproof'}</span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      addToCart(recommendedProduct, 1, 'Standard');
                      onClose();
                    }}
                    className="flex-1 bg-gradient-to-r from-[#B56571] to-[#8A434E] hover:from-[#A33F4D] hover:to-[#732C37] py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-xl text-white transition-all active:scale-95 border border-white/20"
                  >
                    <FontAwesomeIcon icon={faBagShopping} />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-4 py-3.5 rounded-full bg-black/50 border border-white/10 text-neutral-300 hover:text-white text-xs cursor-pointer hover:bg-white/10 transition-colors"
                    title="Retake Quiz"
                  >
                    <FontAwesomeIcon icon={faRotateRight} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-6">
                <p className="text-xs text-neutral-300">All products have been removed. Add products via Admin Portal to view recommendations.</p>
                <button onClick={onClose} className="bg-[#B56571] hover:bg-[#A33F4D] py-2.5 px-6 rounded-full text-xs font-bold text-white cursor-pointer transition-colors">Close</button>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};
