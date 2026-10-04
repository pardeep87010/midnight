import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  RotateCcw, 
  Volume2, 
  ShoppingBag,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QUIZ_QUESTIONS, PRODUCTS } from '../data/mockData';
import { CDN_CONFIG, handleImageError } from '../utils/cdnCache';

export const AdvisorQuiz = () => {
  const { navigateTo, addToCart } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (questionId, option) => {
    const nextAnswers = { ...answers, [questionId]: option };
    setAnswers(nextAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
  };

  // Derive recommended products based on answers
  const recommendedProducts = (() => {
    const selectedCategory = answers[2]?.category;
    if (selectedCategory) {
      const matching = PRODUCTS.filter(p => p.category === selectedCategory);
      return matching.length > 0 ? matching : PRODUCTS.slice(0, 3);
    }
    return PRODUCTS.slice(0, 3);
  })();

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Top Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-velour-900 border border-gold-500/30 px-3.5 py-1 rounded-full text-xs text-gold-300">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Curated Intimacy Advisor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-velour-50">
          Find Your Perfect Sensory Match
        </h1>
        <p className="text-xs text-velour-400">
          Answer 4 confidential questions to receive personalized wellness recommendations.
        </p>
      </div>

      {!isCompleted ? (
        <div className="bg-[#141519] border border-[#B56571]/35 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden text-white">
          
          {/* Background Image Layer */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none rounded-3xl"
            style={{ backgroundImage: `url('/bg/explore-8-departments-bg.jpg')` }}
          />
          {/* Dark luxury overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/92 via-black/85 to-black/95 backdrop-blur-[1px] rounded-3xl pointer-events-none" />

          {/* Inner Content */}
          <div className="relative z-10 space-y-8">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-neutral-300 font-mono">
              <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D98A92] to-[#B56571] h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Title */}
          <div className="text-center space-y-2 py-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-velour-100">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(currentQ.id, opt)}
                className="p-4 rounded-xl border border-velour-700/80 bg-velour-850 hover:border-gold-500/60 hover:bg-gold-500/10 text-left text-xs sm:text-sm font-medium text-velour-200 hover:text-gold-300 transition-all flex items-center justify-between group shadow-sm"
              >
                <span>{opt.text}</span>
                <ArrowRight className="w-4 h-4 text-velour-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          {/* Navigation Back */}
          {currentStep > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-xs text-neutral-400 hover:text-white flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Question</span>
              </button>
            </div>
          )}

          </div>
        </div>
      ) : (
        /* Quiz Results Screen */
        <div className="space-y-8 animate-fade-in">
          <div className="bg-velour-900 border border-gold-500/40 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto shadow-glow-gold">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-gold-400 font-semibold">Your Tailored Intimacy Profile</span>
              <h2 className="text-2xl font-serif font-bold text-velour-50">
                Recommended Curations Just For You
              </h2>
            </div>

            <p className="text-xs text-velour-300 max-w-md mx-auto">
              Based on your preference for whisper-quiet acoustics, body-safe materials, and sensory style, our advisor matched you with the following:
            </p>

            <button
              onClick={restartQuiz}
              className="text-xs text-velour-400 hover:text-gold-300 flex items-center justify-center mx-auto space-x-1 pt-2"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Retake Quiz</span>
            </button>
          </div>

          {/* Recommended Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-velour-900 border border-velour-800 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-all flex flex-col justify-between p-5 space-y-4 shadow-card-dark"
              >
                <div className="space-y-3">
                  <div className="aspect-square rounded-xl overflow-hidden bg-velour-950">
                    <img 
                      src={CDN_CONFIG.getOptimizedImageUrl(product.images && product.images[0] ? product.images[0] : product.image)} 
                      alt={product.name || ''} 
                      className="w-full h-full object-cover" 
                      onError={handleImageError}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-gold-400 font-semibold">{product.brand}</span>
                    <h3 
                      onClick={() => navigateTo('product-detail', product.id)}
                      className="text-sm font-serif font-bold text-velour-100 hover:text-gold-300 cursor-pointer mt-0.5"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-velour-400 mt-1 line-clamp-2">{product.shortDescription}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-velour-800 flex items-center justify-between">
                  <span className="text-base font-serif font-bold text-gold-300">₹{product.price}</span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="bg-gold-500 hover:bg-gold-400 text-velour-950 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center space-x-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => navigateTo('catalog')}
              className="bg-velour-800 hover:bg-velour-700 text-gold-300 text-xs font-semibold px-6 py-3 rounded-full border border-gold-500/30"
            >
              Browse Complete Marketplace Catalog →
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
