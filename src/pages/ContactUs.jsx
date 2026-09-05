import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faCircleCheck,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { FAQS } from '../data/mockData';
import { 
  validateEmail, 
  validateName, 
  sanitizeText 
} from '../utils/validation';

export const ContactUs = () => {
  const { showToast } = useApp();
  const [activeFaq, setActiveFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'order',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const fNameCheck = validateName(formData.firstName, 'First Name');
    if (!fNameCheck.isValid) newErrors.firstName = fNameCheck.error;

    const lNameCheck = validateName(formData.lastName, 'Last Name');
    if (!lNameCheck.isValid) newErrors.lastName = lNameCheck.error;

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) newErrors.email = emailCheck.error;

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a detailed inquiry of at least 10 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(Object.values(newErrors)[0], 'warning');
      return;
    }

    setErrors({});
    setSubmitted(true);
    showToast('Inquiry received. A private concierge will reply within 24h.', 'success');
  };

  return (
    <div className="pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-32 space-y-16 font-sans bg-[#FAF7F5] dark:bg-[#121316] text-[#181617] dark:text-[#EAE0E1] transition-colors">
      
      {/* Header Section */}
      <section className="text-center md:text-left max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#181617] dark:text-white font-serif font-bold tracking-tight">
          Private Concierge & Contact
        </h1>
        <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-400 leading-relaxed font-light">
          We are dedicated to providing an exceptional, confidential experience. Reach out with any inquiries regarding our collections, orders, or bespoke requests.
        </p>
      </section>

      {/* Grid: Form & FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#18191E] p-6 sm:p-10 rounded-2xl border border-[#B56571]/25 dark:border-white/10 relative overflow-hidden shadow-xl transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B56571]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <h2 className="text-xl text-[#181617] dark:text-white font-serif font-bold mb-6">
              Send a Confidential Message
            </h2>

            {submitted ? (
              <div className="p-8 bg-[#FAF7F5] dark:bg-[#121316] rounded-xl border border-[#B56571]/30 dark:border-[#D98A92]/30 text-center space-y-3">
                <FontAwesomeIcon icon={faCircleCheck} className="text-[#A33F4D] dark:text-[#D98A92] text-4xl" />
                <h3 className="text-lg text-[#181617] dark:text-white font-serif font-bold">Message Dispatched</h3>
                <p className="text-xs text-[#5C4F52] dark:text-neutral-300">
                  Our private client concierge will respond to <strong className="text-[#A33F4D] dark:text-[#D98A92] font-mono">{formData.email || 'your email'}</strong> via an encrypted communication channel.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ firstName: '', lastName: '', email: '', subject: 'order', message: '' });
                  }}
                  className="btn-gold px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer text-white"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#181617] dark:text-neutral-300 block font-medium">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value });
                        if (errors.firstName) setErrors({ ...errors, firstName: null });
                      }}
                      placeholder="Jane"
                      className={`w-full bg-[#FAF7F5] dark:bg-[#121316] border rounded-xl px-4 py-3 text-xs text-[#181617] dark:text-white focus:outline-none font-sans transition-all ${
                        errors.firstName ? 'border-red-500 ring-1 ring-red-500/50' : 'border-[#B56571]/25 dark:border-white/10 focus:border-[#B56571]'
                      }`}
                    />
                    {errors.firstName && <p className="text-[10px] text-red-500 font-mono">⚠ {errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#181617] dark:text-neutral-300 block font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value });
                        if (errors.lastName) setErrors({ ...errors, lastName: null });
                      }}
                      placeholder="Doe"
                      className={`w-full bg-[#FAF7F5] dark:bg-[#121316] border rounded-xl px-4 py-3 text-xs text-[#181617] dark:text-white focus:outline-none font-sans transition-all ${
                        errors.lastName ? 'border-red-500 ring-1 ring-red-500/50' : 'border-[#B56571]/25 dark:border-white/10 focus:border-[#B56571]'
                      }`}
                    />
                    {errors.lastName && <p className="text-[10px] text-red-500 font-mono">⚠ {errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#181617] dark:text-neutral-300 block font-medium">
                    Confidential Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    placeholder="jane.doe@example.com"
                    className={`w-full bg-[#FAF7F5] dark:bg-[#121316] border rounded-xl px-4 py-3 text-xs text-[#181617] dark:text-white focus:outline-none font-sans transition-all ${
                      errors.email ? 'border-red-500 ring-1 ring-red-500/50' : 'border-[#B56571]/25 dark:border-white/10 focus:border-[#B56571]'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-mono">⚠ {errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#181617] dark:text-neutral-300 block font-medium">Topic / Inquiry Type</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#FAF7F5] dark:bg-[#121316] border border-[#B56571]/25 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-sans"
                  >
                    <option value="order">Order Status & Discreet Tracking</option>
                    <option value="product">Artisanal Product Advice & Specifications</option>
                    <option value="custom">Bespoke / Custom Intimate Requests</option>
                    <option value="privacy">Confidentiality & Session Data Removal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#181617] dark:text-neutral-300 block font-medium">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: null });
                    }}
                    placeholder="How may our private concierge assist you?"
                    className={`w-full bg-[#FAF7F5] dark:bg-[#121316] border rounded-xl px-4 py-3 text-xs text-[#181617] dark:text-white focus:outline-none font-sans transition-all ${
                      errors.message ? 'border-red-500 ring-1 ring-red-500/50' : 'border-[#B56571]/25 dark:border-white/10 focus:border-[#B56571]'
                    }`}
                  />
                  {errors.message && <p className="text-[10px] text-red-500 font-mono">⚠ {errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full btn-gold py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all shadow-xl cursor-pointer text-white"
                >
                  Send Encrypted Inquiry
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#D98A92]" />
            <h2 className="text-xl sm:text-2xl text-[#181617] dark:text-white font-serif font-bold">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-xs text-[#5C4F52] dark:text-neutral-400 font-light pb-2">
            Discreet solutions to your most common privacy, delivery, and body-safe material questions.
          </p>

          <div className="space-y-3.5">
            {FAQS.map((faq, idx) => {
              const questionText = faq.question || faq.q || `Question ${idx + 1}`;
              const answerText = faq.answer || faq.a || 'Our confidential support team is available 24/7.';
              const isOpen = activeFaq === idx;

              return (
                <div 
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
                    isOpen 
                      ? 'bg-white dark:bg-[#1A1B22] border-[#B56571]/50 dark:border-[#D98A92]/50 ring-1 ring-[#B56571]/20' 
                      : 'bg-white/90 dark:bg-[#18191E]/90 hover:bg-white dark:hover:bg-[#1E1F27] border-[#B56571]/20 dark:border-white/10 hover:border-[#B56571]/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4.5 sm:p-5 text-left flex justify-between items-center gap-3 cursor-pointer group"
                  >
                    <span className={`text-xs sm:text-sm font-semibold leading-snug transition-colors ${
                      isOpen ? 'text-[#A33F4D] dark:text-[#F0B8BE]' : 'text-[#181617] dark:text-white group-hover:text-[#A33F4D] dark:group-hover:text-[#F0B8BE]'
                    }`}>
                      {questionText}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen 
                        ? 'bg-[#B56571] text-white rotate-180 shadow-xs' 
                        : 'bg-black/5 dark:bg-white/5 text-[#A33F4D] dark:text-[#D98A92] group-hover:bg-[#B56571]/20'
                    }`}>
                      <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className="text-[10px]" 
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4.5 sm:px-5 pb-5 pt-1 text-xs text-[#5C4F52] dark:text-neutral-300 font-light leading-relaxed animate-fade-in border-t border-black/[0.06] dark:border-white/10 space-y-2">
                      <p>{answerText}</p>
                      <div className="flex items-center space-x-2 pt-1 text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400">
                        <FontAwesomeIcon icon={faCircleCheck} className="text-[9px]" />
                        <span>Verified Sanctuary Protocol</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
