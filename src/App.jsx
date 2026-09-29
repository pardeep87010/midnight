import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AgeGateModal } from './components/AgeGateModal';
import { AuthModal } from './components/AuthModal';
import { QuickHideButton } from './components/QuickHideButton';
import { ErrorBoundary } from './components/ErrorBoundary';

// Eager load primary landing page for zero-latency First Contentful Paint
import { Home } from './pages/Home';

// Lazy load secondary routes & modals for instant initial bundle download
const Catalog = lazy(() => import('./pages/Catalog').then(m => ({ default: m.Catalog })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const ShippingInfo = lazy(() => import('./pages/ShippingInfo').then(m => ({ default: m.ShippingInfo })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsConditions = lazy(() => import('./pages/TermsConditions').then(m => ({ default: m.TermsConditions })));
const ContactUs = lazy(() => import('./pages/ContactUs').then(m => ({ default: m.ContactUs })));
const AdminPanel = lazy(() => import('./pages/AdminPanel').then(m => ({ default: m.AdminPanel })));
const MyOrders = lazy(() => import('./pages/MyOrders').then(m => ({ default: m.MyOrders })));
const SensoryQuizModal = lazy(() => import('./components/SensoryQuizModal').then(m => ({ default: m.SensoryQuizModal })));

// Ultra-lightweight fallback spinner
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="w-8 h-8 rounded-full border-2 border-[#B56571]/20 border-t-[#A33F4D] dark:border-t-[#D98A92] animate-spin" />
    <span className="text-xs font-mono uppercase tracking-widest text-[#7A696C] dark:text-neutral-400">Loading Secure Experience...</span>
  </div>
);

export const App = () => {
  const { currentPage } = useApp();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Meta Pixel dynamic PageView tracking on navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onOpenQuiz={() => setIsQuizOpen(true)} />;
      case 'catalog':
        return <Catalog onOpenQuiz={() => setIsQuizOpen(true)} />;
      case 'product-detail':
        return <ProductDetail />;
      case 'cart':
        return <Cart />;
      case 'admin':
        return <AdminPanel />;
      case 'profile':
        return <Profile />;
      case 'orders':
      case 'my-orders':
        return <MyOrders />;
      case 'shipping':
        return <ShippingInfo />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsConditions />;
      case 'contact':
        return <ContactUs />;
      default:
        return <Home onOpenQuiz={() => setIsQuizOpen(true)} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#FAF7F5] dark:bg-[#121316] text-[#181617] dark:text-[#EAE0E1] font-sans antialiased relative selection:bg-[#B56571]/30 selection:text-[#B56571] w-full max-w-full overflow-x-hidden transition-colors">
        {/* 18+ Age & Privacy Verification Modal */}
        <AgeGateModal />

        {/* Global Floating Auth Window (Login & Register with Split Video Showcase) */}
        <AuthModal />

        {/* Floating Quick Hide / Panic Exit Button */}
        <QuickHideButton />

        {/* Interactive Pleasure Match Quiz Modal */}
        {isQuizOpen && (
          <Suspense fallback={null}>
            <SensoryQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
          </Suspense>
        )}

        {/* Global Toast Notification */}
        <Toast />

        {/* Navigation Header */}
        <Header onOpenQuiz={() => setIsQuizOpen(true)} />

        {/* Dynamic Page Content with Suspense */}
        <main className="flex-1 w-full max-w-full">
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </main>

        {/* Mobile Fixed Navigation Bar */}
        <BottomNav />

        {/* Global Footer (Hidden on Profile, Cart, and Admin pages) */}
        {!['profile', 'cart', 'admin'].includes(currentPage) && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default App;

