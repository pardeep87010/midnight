import React from 'react';
import { useApp } from '../context/AppContext';

export const PrivacyPolicy = () => {
  const { navigateTo } = useApp();

  return (
    <div className="pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto pb-32 space-y-8 font-sans bg-[#FAF7F5] dark:bg-[#121316] text-[#181617] dark:text-[#EAE0E1] transition-colors">
      <div className="border-b border-black/[0.08] dark:border-white/10 pb-6 space-y-2">
        <span className="text-xs text-[#A33F4D] dark:text-[#D98A92] uppercase tracking-widest font-mono font-bold">Legal & Privacy</span>
        <h1 className="text-3xl sm:text-4xl text-[#181617] dark:text-white font-serif font-bold tracking-tight">
          Privacy Policy & Data Guarantee
        </h1>
        <p className="text-xs text-[#7A696C] dark:text-neutral-400">Last updated: August 2026</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="text-base text-[#181617] dark:text-white font-serif font-bold">1. Zero Selling of Personal Data</h2>
          <p>
            Midnight Bloom operates under an absolute privacy mandate. We never sell, rent, or lease customer data, shopping history, or email addresses to third-party ad exchanges, data brokers, or marketing networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base text-[#181617] dark:text-white font-serif font-bold">2. Anonymized Billing Practices</h2>
          <p>
            Credit card transactions are processed via 256-bit TLS encrypted gateways. The statement line descriptor is deliberately generic (e.g. <code className="text-[#A33F4D] dark:text-[#D98A92] font-mono font-bold">MB* SERVICES LLC</code>) to ensure total privacy on your banking statements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base text-[#181617] dark:text-white font-serif font-bold">3. Plain Packaging Assurance</h2>
          <p>
            Physical shipments are dispatched in unmarked cardboard boxes or recyclable mailers with no branding or product descriptions. Couriers only scan standard logistical tracking numbers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base text-[#181617] dark:text-white font-serif font-bold">4. Session Cache Purge</h2>
          <p>
            You may request an immediate purge of your customer records and delivery logs at any time through our client concierge or from your profile tab.
          </p>
        </section>
      </div>
    </div>
  );
};
