import React, { useState } from 'react';
import { 
  Store, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Package, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Users,
  Award,
  Layers,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SellerPortal = () => {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    brandName: '',
    website: '',
    category: 'luxury-devices',
    applicantName: '',
    email: '',
    materialsCert: true,
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Merchant application submitted for clinical lab review.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-velour-900 border border-gold-500/30 px-4 py-1.5 rounded-full text-xs text-gold-300">
          <Store className="w-3.5 h-3.5 text-gold-400" />
          <span className="font-semibold">Artisan & Brand Marketplace Collective</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-velour-50">
          Showcase Your Intimacy Craft <br />
          <span className="gold-gradient-text italic font-normal">To A Discerning Global Audience.</span>
        </h1>
        <p className="text-xs sm:text-sm text-velour-300 leading-relaxed">
          Join the premier curated marketplace for luxury sensual wellness. We provide automated discreet fulfillment, zero-chargeback fraud protection, and a low 10% flat marketplace fee.
        </p>
      </div>

      {/* Seller Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-velour-900 border border-velour-800 rounded-2xl space-y-3 shadow-card-dark">
          <div className="w-10 h-10 rounded-xl bg-velour-850 border border-velour-700 flex items-center justify-center text-gold-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif font-bold text-velour-100">10% Flat Merchant Fee</h3>
          <p className="text-xs text-velour-400 leading-relaxed">
            No listing fees, no subscription costs, no hidden payment gateway markups. We only earn when your craft succeeds.
          </p>
        </div>

        <div className="p-6 bg-velour-900 border border-velour-800 rounded-2xl space-y-3 shadow-card-dark">
          <div className="w-10 h-10 rounded-xl bg-velour-850 border border-velour-700 flex items-center justify-center text-gold-400">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif font-bold text-velour-100">Discreet 3PL Fulfillment</h3>
          <p className="text-xs text-velour-400 leading-relaxed">
            Option to store inventory in our climate-controlled, sterile cleanroom warehouse for 24-hour plain shipping.
          </p>
        </div>

        <div className="p-6 bg-velour-900 border border-velour-800 rounded-2xl space-y-3 shadow-card-dark">
          <div className="w-10 h-10 rounded-xl bg-velour-850 border border-velour-700 flex items-center justify-center text-gold-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif font-bold text-velour-100">Lab Purity Verification Badge</h3>
          <p className="text-xs text-velour-400 leading-relaxed">
            Our medical testing team verifies and awards the official Velour Purity Seal to your listings for customer trust.
          </p>
        </div>
      </div>

      {/* Live Seller Dashboard Preview */}
      <div className="bg-velour-900 border border-velour-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-velour-800 pb-4 gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-gold-400 font-semibold">Live Vendor Dashboard Interface</span>
            <h3 className="text-lg font-serif font-bold text-velour-50">Maison Velour | Artisan Storefront</h3>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>STORE STATUS: CERTIFIED & ACTIVE</span>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-velour-850 rounded-xl border border-velour-800">
            <div className="text-[11px] text-velour-400">Monthly Gross Revenue</div>
            <div className="text-lg font-bold font-mono text-gold-300 mt-1">$48,920.00</div>
            <div className="text-[10px] text-emerald-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +18.4% vs last mo
            </div>
          </div>

          <div className="p-4 bg-velour-850 rounded-xl border border-velour-800">
            <div className="text-[11px] text-velour-400">Fulfilled Discreet Orders</div>
            <div className="text-lg font-bold font-mono text-velour-100 mt-1">384</div>
            <div className="text-[10px] text-emerald-400 flex items-center mt-1">
              <CheckCircle2 className="w-3 h-3 mr-1" /> 100% On-Time Delivery
            </div>
          </div>

          <div className="p-4 bg-velour-850 rounded-xl border border-velour-800">
            <div className="text-[11px] text-velour-400">Avg Customer Satisfaction</div>
            <div className="text-lg font-bold font-mono text-gold-400 mt-1">4.92 / 5.0</div>
            <div className="text-[10px] text-velour-400 mt-1">340 Verified Reviews</div>
          </div>

          <div className="p-4 bg-velour-850 rounded-xl border border-velour-800">
            <div className="text-[11px] text-velour-400">Next Payout (Weekly)</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-1">$12,410.00</div>
            <div className="text-[10px] text-velour-400 mt-1">Direct Bank Wire (Friday)</div>
          </div>
        </div>
      </div>

      {/* Seller Application Form */}
      <div className="max-w-2xl mx-auto bg-velour-900 border border-gold-500/30 rounded-3xl p-6 sm:p-10 space-y-6 shadow-card-dark">
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-serif font-bold text-velour-50">Apply for Artisan Certification</h3>
          <p className="text-xs text-velour-400">Submit your brand details for clinical safety review and curation onboarding.</p>
        </div>

        {submitted ? (
          <div className="p-6 bg-velour-950 rounded-2xl border border-emerald-500/40 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-serif font-bold text-velour-100">Application Received</h4>
            <p className="text-xs text-velour-300">
              Our safety review panel will contact you at <strong className="text-gold-300">{formData.email || 'your email'}</strong> within 48 business hours with next steps.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-velour-300 block mb-1">Brand or Artisan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atelier Intime"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-velour-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-velour-300 block mb-1">Official Website / Portfolio</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-velour-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-velour-300 block mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-velour-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-velour-300 block mb-1">Business Email</label>
                <input
                  type="email"
                  required
                  placeholder="merchant@brand.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-velour-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="text-velour-300 block mb-1">Primary Product Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-xs text-velour-100 focus:outline-none focus:border-gold-500"
              >
                <option value="luxury-devices">Luxury Sonic & Airwave Devices</option>
                <option value="couples-intimacy">Couples' Shared Intimacy & Sync</option>
                <option value="botanicals-elixirs">Organic Warming Elixirs & Botanicals</option>
                <option value="silk-bodywear">22-Momme Silk & Loungewear</option>
                <option value="massage-rituals">Soy Candles & Massage Rituals</option>
              </select>
            </div>

            <div>
              <label className="text-velour-300 block mb-1">Craftsmanship & Materials Statement</label>
              <textarea
                rows={3}
                placeholder="Describe your manufacturing standards, medical-grade silicone certifications, organic formulations, etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-velour-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="certCheck"
                checked={formData.materialsCert}
                onChange={(e) => setFormData({ ...formData, materialsCert: e.target.checked })}
                className="rounded bg-velour-800 border-velour-700 text-gold-500 focus:ring-gold-500/40"
              />
              <label htmlFor="certCheck" className="text-[11px] text-velour-300 cursor-pointer">
                I certify all products submitted are 100% phthalate-free, non-toxic, and meet body-safe standards.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 text-velour-950 font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-glow-gold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Merchant Application</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
