import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, 
  faCreditCard, 
  faClock, 
  faSatellite, 
  faArrowRight 
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';

export const ShippingInfo = () => {
  const { navigateTo } = useApp();

  return (
    <div className="pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-32 space-y-16 font-sans bg-[#FAF7F5] dark:bg-[#121316] text-[#181617] dark:text-[#EAE0E1] transition-colors">
      
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs text-[#A33F4D] dark:text-[#D98A92] uppercase tracking-[0.25em] font-semibold font-mono">
          Privacy, Assured
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#181617] dark:text-white font-serif font-bold tracking-tight">
          Discreet Shipping Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-400 leading-relaxed font-light">
          Every order is treated with utmost confidentiality. From tamper-evident plain boxing to neutral bank descriptors, your personal rituals remain private.
        </p>
      </div>

      {/* Grid of Shipping Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Feature 1: Plain Packaging */}
        <div className="md:col-span-6 satin-card rounded-2xl p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3F0] dark:bg-[#20222A] border border-[#B56571]/25 dark:border-[#D98A92]/20 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92]">
            <FontAwesomeIcon icon={faBox} className="text-xl" />
          </div>
          <h3 className="text-xl text-[#181617] dark:text-white font-serif font-bold">100% Unmarked Outer Box</h3>
          <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
            Your items are shipped in sturdy, plain cardboard boxes or recycled padded mailers. There are zero external logos, product illustrations, or brand names.
          </p>
          <div className="pt-2 text-xs text-[#A33F4D] dark:text-[#D98A92] font-mono space-y-1 border-t border-black/[0.06] dark:border-white/5">
            <div>• Return Sender: "MB Logistics"</div>
            <div>• Customs declaration: "Personal Care Instrument"</div>
          </div>
        </div>

        {/* Feature 2: Bank Statement */}
        {/* Feature 2: Cash on Delivery (COD) */}
        <div className="md:col-span-6 satin-card rounded-2xl p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3F0] dark:bg-[#20222A] border border-[#B56571]/25 dark:border-[#D98A92]/20 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92]">
            <FontAwesomeIcon icon={faCreditCard} className="text-xl" />
          </div>
          <h3 className="text-xl text-[#181617] dark:text-white font-serif font-bold">Cash on Delivery (COD) Across India</h3>
          <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
            Zero advance online payment required. Pay safely at your doorstep with cash or scan delivery partner's UPI QR code upon receiving your sealed, unbranded parcel.
          </p>
          <div className="p-3 bg-[#FAF7F5] dark:bg-black/60 rounded-xl border border-[#B56571]/20 dark:border-white/10 text-xs font-mono text-[#A33F4D] dark:text-[#D98A92]">
            Payment Mode: <strong className="text-[#181617] dark:text-white">Cash on Delivery (Zero Prepayment Risk)</strong>
          </div>
        </div>

        {/* Feature 3: Timelines */}
        <div className="md:col-span-6 satin-card rounded-2xl p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3F0] dark:bg-[#20222A] border border-[#B56571]/25 dark:border-[#D98A92]/20 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92]">
            <FontAwesomeIcon icon={faClock} className="text-xl" />
          </div>
          <h3 className="text-xl text-[#181617] dark:text-white font-serif font-bold">Express Transit Times</h3>
          <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
            All orders are processed and dispatched within 24 hours from our climate-controlled fulfillment center.
          </p>
          <ul className="text-xs text-[#5C4F52] dark:text-neutral-300 space-y-1.5 font-light">
            <li>• Metro Cities (Mumbai, Delhi, Bangalore): 2–3 business days</li>
            <li>• Tier II & Regional Cities: 3–5 business days</li>
            <li>• Free express courier on all orders over ₹1,999</li>
          </ul>
        </div>

        {/* Feature 4: Confidential Tracking */}
        <div className="md:col-span-6 satin-card rounded-2xl p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3F0] dark:bg-[#20222A] border border-[#B56571]/25 dark:border-[#D98A92]/20 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92]">
            <FontAwesomeIcon icon={faSatellite} className="text-xl" />
          </div>
          <h3 className="text-xl text-[#181617] dark:text-white font-serif font-bold">Encrypted Live Tracking</h3>
          <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-light">
            You will receive a discreet SMS and encrypted email with a live tracking link. The courier driver will only see a standard package with recipient name and address.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('catalog')}
              className="text-xs font-bold text-[#A33F4D] dark:text-[#D98A92] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore The Catalog</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
