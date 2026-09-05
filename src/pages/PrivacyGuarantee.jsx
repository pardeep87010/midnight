import React from 'react';
import { 
  ShieldCheck, 
  Package, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  HelpCircle, 
  Truck, 
  EyeOff, 
  Trash2,
  FileText,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyGuarantee = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-velour-900 border border-gold-500/30 px-4 py-1.5 rounded-full text-xs text-gold-300">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span className="font-semibold">The Velour Discretion Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-velour-50">
          Uncompromising Privacy, <br />
          <span className="gold-gradient-text italic font-normal">From Cart to Doorstep.</span>
        </h1>
        <p className="text-xs sm:text-sm text-velour-300 leading-relaxed">
          We understand that discretion isn't an optional add-on—it is fundamental. Here is exactly how we safeguard your personal privacy across packaging, billing, and data protection.
        </p>
      </div>

      {/* 4 Pillars Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Pillar 1: Plain Packaging */}
        <div className="bg-velour-900 border border-velour-800 rounded-3xl p-8 space-y-4 shadow-card-dark relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-velour-850 border border-velour-700 flex items-center justify-center text-gold-400">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-velour-100">
            1. 100% Unmarked Outer Packaging
          </h2>
          <p className="text-xs text-velour-300 leading-relaxed">
            Every shipment arrives in a plain brown or black cardboard box or neutral padded mailer with zero branding, logos, or sensual product titles.
          </p>
          <ul className="space-y-2 text-xs text-velour-400 pt-2 border-t border-velour-800">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Return Sender Label:</strong> Reads simply as <code className="text-gold-300 font-mono">VL Logistics</code></span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>No Promotional Inserts:</strong> We never include marketing flyers or coupons on the outside.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Acoustic Vibration Lock:</strong> All devices are locked in travel mode so they cannot activate in transit.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Anonymized Billing */}
        <div className="bg-velour-900 border border-velour-800 rounded-3xl p-8 space-y-4 shadow-card-dark relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-velour-850 border border-velour-700 flex items-center justify-center text-gold-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-velour-100">
            2. Neutral Bank Billing Descriptors
          </h2>
          <p className="text-xs text-velour-300 leading-relaxed">
            Neither "Velour", nor any adult or intimate product terminology will ever appear on your credit card, debit card, or banking statement.
          </p>
          <div className="p-3 bg-velour-950 rounded-xl border border-velour-800 text-xs space-y-1">
            <span className="text-[11px] text-velour-500 font-medium uppercase">How It Shows Up On Your Statement:</span>
            <div className="font-mono text-gold-300 text-xs font-bold">
              VL* SERVICES LLC NY • 800-555-0199
            </div>
          </div>
          <ul className="space-y-2 text-xs text-velour-400 pt-2 border-t border-velour-800">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Accepted by major banks with zero merchant category flags.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Cryptocurrency payments available for zero-trace settlement.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: Secure Delivery Locations */}
        <div className="bg-velour-900 border border-velour-800 rounded-3xl p-8 space-y-4 shadow-card-dark relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-velour-850 border border-velour-700 flex items-center justify-center text-gold-400">
            <Truck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-velour-100">
            3. Locker & P.O. Box Friendly
          </h2>
          <p className="text-xs text-velour-300 leading-relaxed">
            Don't want packages delivered to your home address? We seamlessly ship to 50,000+ secure locker hubs and pickup lockers across the country.
          </p>
          <ul className="space-y-2 text-xs text-velour-400 pt-2 border-t border-velour-800">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Amazon Hub Lockers, UPS Access Points, and FedEx Hold Locations.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Real-time private SMS delivery code notification.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 4: Zero Tracking & Data Purge */}
        <div className="bg-velour-900 border border-velour-800 rounded-3xl p-8 space-y-4 shadow-card-dark relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-velour-850 border border-velour-700 flex items-center justify-center text-gold-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-velour-100">
            4. Zero Data Selling & 30-Day Auto Purge
          </h2>
          <p className="text-xs text-velour-300 leading-relaxed">
            We never sell, rent, or trade your shopping history or email address to third-party ad networks. Browsing telemetry is strictly anonymized.
          </p>
          <ul className="space-y-2 text-xs text-velour-400 pt-2 border-t border-velour-800">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Option to purge customer record upon completed delivery.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>No physical catalogs or mailings sent to physical addresses.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Frequently Asked Discretion Questions */}
      <div className="bg-velour-900 border border-velour-800 rounded-3xl p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl font-serif font-bold text-velour-50">
          Frequently Asked Questions About Discretion
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-velour-300">
          <div className="space-y-2 bg-velour-850 p-4 rounded-xl">
            <h3 className="font-bold text-velour-100">Will delivery drivers know what is inside?</h3>
            <p className="text-velour-400 leading-relaxed">
              No. Delivery couriers (FedEx, UPS, USPS) scan generic barcodes labeled "Standard Consumer Logistics". There is zero mention of the contents.
            </p>
          </div>

          <div className="space-y-2 bg-velour-850 p-4 rounded-xl">
            <h3 className="font-bold text-velour-100">What if I need to return an item?</h3>
            <p className="text-velour-400 leading-relaxed">
              Defective items can be returned using prepaid plain shipping labels addressed to "VL Logistics Returns" within 30 days of receipt.
            </p>
          </div>

          <div className="space-y-2 bg-velour-850 p-4 rounded-xl">
            <h3 className="font-bold text-velour-100">How does the "Quick Escape" button work?</h3>
            <p className="text-velour-400 leading-relaxed">
              Pressing ESC or the Quick Escape button instantly overlays a full-screen financial analytics terminal over your session.
            </p>
          </div>

          <div className="space-y-2 bg-velour-850 p-4 rounded-xl">
            <h3 className="font-bold text-velour-100">Are the materials safe for sensitive skin?</h3>
            <p className="text-velour-400 leading-relaxed">
              100%. All silicone is medical-grade, non-porous, and certified hypoallergenic. All elixirs are paraben-free and vegan.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => navigateTo('catalog')}
            className="bg-gold-500 hover:bg-gold-400 text-velour-950 font-bold text-xs py-3 px-8 rounded-full shadow-glow-gold transition-all"
          >
            Start Browsing With Complete Discretion
          </button>
        </div>
      </div>

    </div>
  );
};
