import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXmark, 
  faShieldHalved, 
  faArrowRight, 
  faShareNodes
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { handleImageError } from '../utils/cdnCache';

export const ArticleModal = ({ article, isOpen, onClose }) => {
  const { navigateTo, showToast } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'success');
    }
  };

  const getArticleDetails = (id) => {
    switch (id) {
      case 1:
        return {
          subtitle: 'The Ultimate Guide to All Types of Adult Toys & How to Choose',
          author: 'Dr. Maya Sen, Clinical Sensual Wellness Consultant',
          date: 'Updated September 2026',
          categoryKey: 'all',
          sections: [
            {
              heading: '1. Understanding Your Desired Stimulation Type',
              content: 'Whether you are a beginner exploring adult wellness for the first time or an experienced connoisseur, selecting the right sensual instrument starts with anatomical preference:\n\n• Clitoral & External Vibrators: From pinpoint bullet vibrators to deep-rumble wand massagers and touchless air-pulse suction toys that use pressure waves to stimulate 8,000+ nerve endings without friction.\n• Internal G-Spot & Dual-Stimulation (Rabbits): Contoured curved heads that surge against the anterior vaginal wall paired with flexible external clitoral arms.\n• Male Strokers & Automatic Masturbators: Ergonomic textured sleeves with motorized reciprocating action and 40°C thermal warmth that mimic natural sensations.\n• Couples & App-Controlled Instruments: Flexible hands-free wear during intimacy or remote long-distance connection.'
            },
            {
              heading: '2. Material Safety: Medical-Grade vs Porous Materials',
              content: 'Your intimate health depends on non-porous, hypoallergenic materials:\n\n• 100% Platinum-Cured Liquid Silicone: Velvet-soft, body-safe, phthalate-free, non-porous, and compatible with water-based lubricants.\n• Borosilicate Laboratory Glass: Hypoallergenic, rigid, seamlessly smooth, temperature-responsive, and compatible with all lubricants.\n• Medical Stainless Steel: Heavy, non-porous, mirror-finished, and provides deep weighted sensation.'
            },
            {
              heading: '3. Noise Levels and Whisper-Quiet Motors',
              content: 'Midnight Bloom instruments are engineered with low-frequency brushless motors operating below 25 dB to 30 dB (quieter than a whisper), guaranteeing 100% quiet discretion in any living environment.'
            },
            {
              heading: '4. Cleaning, Care & Discreet Storage',
              content: 'Always wash your instruments before and after each ritual with warm water and antibacterial toy foam. Dry with a lint-free cloth and store in a breathable satin pouch away from direct sunlight.'
            }
          ]
        };
      case 2:
        return {
          subtitle: 'The Complete Guide to Adult Toys for Men: Strokers, Cock Rings & Prostate Massagers',
          author: 'Dr. Rahul Kapoor, Urological Wellness Specialist',
          date: 'Updated September 2026',
          categoryKey: 'male-masturbators',
          sections: [
            {
              heading: '1. The Evolution of Male Masturbators & Heated Strokers',
              content: 'Modern male wellness devices have evolved far beyond traditional manual sleeves:\n\n• Thermal Induction (40°C Warming): Internal heating elements warm the silicone sleeve to natural body temperature for immersive realism.\n• Reciprocating Automatic Thrusting: High-torque multi-speed motors provide rhythmic stroke velocities up to 350 rpm with variable suction vacuum chambers.\n• Textured Internal Ribbing: Spiral ridges, nodules, and soft chambers designed to stimulate both the glans and shaft.'
            },
            {
              heading: '2. Erection Rings & Vibrating Cock Rings',
              content: 'Cock rings are designed to temporarily restrict venous outflow while allowing arterial inflow:\n\n• Enhanced Stamina & Rigidity: Helps sustain firmer erections and prolong intimate encounters.\n• Dual Partner Stimulation: Vibrating bullet modules positioned on the upper ring stimulate your partner\'s clitoris during penetration.\n• Flexible Medical Silicone: Soft, stretchy, and safe for up to 20-30 minutes of continuous use.'
            },
            {
              heading: '3. The P-Spot: Prostate Massagers & Pelvic Health',
              content: 'The prostate (often called the male G-spot) is an intensely sensitive nerve cluster:\n\n• Contoured Ergonomics: Anatomically curved shafts designed for effortless target stimulation without strain.\n• Perineum Vibrator Base: Dual motors provide external vibration to the perineum while simultaneously stimulating the prostate internally.\n• Flared Safety Base: Every genuine anal/prostate toy is engineered with a wide flared base for absolute safety.'
            }
          ]
        };
      case 3:
        return {
          subtitle: 'Glass vs Silicone Dildos & Temperature Play Techniques',
          author: 'Elena Rostova, Intimate Sensation Designer',
          date: 'Updated September 2026',
          categoryKey: 'dildos-insertables',
          sections: [
            {
              heading: '1. The Elegance of Borosilicate Art Glass',
              content: 'Handcrafted borosilicate glass toys are functional works of intimate sculpture:\n\n• Complete Rigidity: Perfect for deep pinpoint G-spot or P-spot pressure without bending or flexing.\n• 100% Non-Porous & Hypoallergenic: Can be sanitized completely with boiling water or dishwasher safe.\n• Universal Lube Compatibility: Safe with water-based, silicone, or oil-based lubricants.'
            },
            {
              heading: '2. The Versatility of Liquid Silicone',
              content: 'Silicone remains the world\'s most popular material:\n\n• Warm & Supple Flexibility: Naturally adjusts to body heat and flexes with anatomical movement.\n• Satin-Touch Velvet Finish: Seamless texture that glides smoothly against sensitive tissue.\n• Strict Lubricant Rule: Always use 100% water-based lubricants with silicone toys to prevent surface degradation.'
            },
            {
              heading: '3. How to Master Temperature Play Safely',
              content: 'Glass toys conduct and retain temperature effortlessly:\n\n• Warm Sensation: Place your glass toy in a bowl of warm (not boiling) tap water for 3-5 minutes. Test the temperature on your inner wrist before intimate contact.\n• Cool Sensation: Place your glass toy in the refrigerator or a bowl of ice water for 5 minutes for tingling, crisp stimulation.\n• Never microwave glass toys or subject them to rapid thermal shock.'
            }
          ]
        };
      default:
        return {
          subtitle: article.title,
          author: 'Midnight Bloom Wellness Editorial',
          date: 'September 2026',
          categoryKey: 'all',
          sections: [
            {
              heading: 'Overview',
              content: article.summary
            }
          ]
        };
    }
  };

  const details = getArticleDetails(article.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF7F5] dark:bg-[#16171C] border border-[#B56571]/25 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8 transition-colors">
        
        {/* Top Floating Close & Share Bar */}
        <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            title="Share Article"
          >
            <FontAwesomeIcon icon={faShareNodes} className="text-sm" />
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            title="Close Article"
          >
            <FontAwesomeIcon icon={faXmark} className="text-base" />
          </button>
        </div>

        {/* Hero Article Cover Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#121316]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F5] dark:from-[#16171C] via-transparent to-black/40" />

          {/* Badge Over Cover */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs">
            <span className="bg-[#A33F4D] dark:bg-[#B56571] text-white font-mono text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
              {article.category} • {article.readTime}
            </span>
            <span className="text-[11px] font-mono text-white/90 bg-black/50 backdrop-blur px-2.5 py-1 rounded-full">
              {details.date}
            </span>
          </div>
        </div>

        {/* Article Body Content */}
        <div className="p-6 sm:p-10 space-y-8 max-h-[60vh] overflow-y-auto hide-scrollbar">
          
          {/* Header & Author Tag */}
          <div className="space-y-3 border-b border-black/[0.08] dark:border-white/10 pb-6">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#181617] dark:text-white leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center space-x-2 text-xs text-[#7A696C] dark:text-neutral-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Written by <strong>{details.author}</strong></span>
            </div>
          </div>

          {/* Quick Editorial Takeaway Box */}
          <div className="bg-[#FAF3F0] dark:bg-[#1E2028] border border-[#B56571]/25 dark:border-white/10 rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#A33F4D] dark:text-[#D98A92]">
              <FontAwesomeIcon icon={faShieldHalved} />
              <span>Editorial Key Takeaway</span>
            </div>
            <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
              {article.summary}
            </p>
          </div>

          {/* Detailed Body Sections */}
          <div className="space-y-6 text-[#2A2426] dark:text-neutral-300 text-xs sm:text-sm leading-relaxed font-light">
            {details.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2.5">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#181617] dark:text-white">
                  {sec.heading}
                </h3>
                <div className="whitespace-pre-line text-[#5C4F52] dark:text-neutral-300 space-y-2">
                  {sec.content}
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Products CTA */}
          <div className="pt-6 border-t border-black/[0.08] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-[#181617] dark:text-white block">
                Ready to elevate your intimate ritual?
              </span>
              <span className="text-[11px] text-[#7A696C] dark:text-neutral-400">
                Explore medical-grade instruments in 100% plain packaging.
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                navigateTo('catalog', null, details.categoryKey);
              }}
              className="btn-gold px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xl cursor-pointer flex items-center space-x-2 active:scale-95 whitespace-nowrap"
            >
              <span>Explore Collection</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
