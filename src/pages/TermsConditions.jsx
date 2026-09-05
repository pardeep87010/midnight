import React from 'react';
import { useApp } from '../context/AppContext';

export const TermsConditions = () => {
  const { navigateTo } = useApp();

  return (
    <div className="pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto pb-32 space-y-8 font-sans bg-[#FAF7F5] dark:bg-[#121316] text-[#181617] dark:text-[#EAE0E1] transition-colors">
      <div className="border-b border-black/[0.08] dark:border-white/10 pb-6 space-y-2">
        <span className="text-xs text-[#A33F4D] dark:text-[#D98A92] uppercase tracking-widest font-mono font-bold">Legal & Policies</span>
        <h1 className="text-3xl sm:text-4xl text-[#181617] dark:text-white font-serif font-bold tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#7A696C] dark:text-neutral-400">Last updated: August 2026</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
        <section className="space-y-2">
          <h2 className="text-base text-[#181617] dark:text-white font-serif font-bold">1. Age Requirement (18+)</h2>
          <p>
            By accessing Midnight Bloom, you warrant and represent that you are at least 18 years old (or the legal age of majority in your jurisdiction) and possess the legal authority to enter into this agreement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base text-[#181617] dark:text-white font-serif font-bold">2. Intimate Hygiene & Final Sale Policy (No Returns / No Refunds)</h2>
          <p>
            Due to strict intimate personal hygiene, public health safety standards, and the direct anatomical contact nature of adult sensual wellness goods, all product sales are strictly final. Products <strong>cannot be returned, exchanged, replaced, or refunded</strong> once dispatched or delivered.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base text-[#181617] dark:text-white font-serif font-bold">3. Technical Manufacturer Warranty</h2>
          <p>
            All electronic luxury instruments carry a 1-year discreet internal motor/circuit manufacturer warranty covering non-physical technical malfunctions. Contact our 24/7 confidential concierge for technical assistance.
          </p>
        </section>
      </div>
    </div>
  );
};
