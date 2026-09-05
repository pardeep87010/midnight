import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faStore, 
  faUser, 
  faCartShopping, 
  faShieldHalved 
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';

export const BottomNav = () => {
  const { currentPage, navigateTo, cartCount, user } = useApp();

  return (
    <nav className="fixed bottom-0 w-full z-50 rounded-t-2xl luxury-glass shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.7)] flex justify-around items-center h-20 px-4 pb-2 md:hidden border-t border-black/[0.08] dark:border-white/10 font-sans transition-colors">
      
      {/* Tab: Home */}
      <button
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center justify-center active:scale-90 duration-150 p-2 w-14 cursor-pointer ${
          currentPage === 'home' ? 'text-[#A33F4D] dark:text-[#D98A92] font-bold' : 'text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white'
        }`}
      >
        <FontAwesomeIcon icon={faHouse} className="text-lg mb-1" />
        <span className="text-[10px] leading-tight tracking-wider uppercase font-semibold">Home</span>
      </button>

      {/* Tab: Shop / Collection */}
      <button
        onClick={() => navigateTo('catalog', null, 'all')}
        className={`flex flex-col items-center justify-center active:scale-90 duration-150 p-2 w-14 cursor-pointer ${
          currentPage === 'catalog' ? 'text-[#A33F4D] dark:text-[#D98A92] font-bold' : 'text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white'
        }`}
      >
        <FontAwesomeIcon icon={faStore} className="text-lg mb-1" />
        <span className="text-[10px] leading-tight tracking-wider uppercase font-semibold">Shop</span>
      </button>

      {/* Tab: Admin (Only visible to verified super admin) */}
      {user?.isLoggedIn && user?.email === '20092003pardeep@gmail.com' && user?.isAdmin && (
        <button
          onClick={() => navigateTo('admin')}
          className={`flex flex-col items-center justify-center active:scale-90 duration-150 p-2 w-14 cursor-pointer ${
            currentPage === 'admin' ? 'text-[#A33F4D] dark:text-[#D98A92] font-bold' : 'text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white'
          }`}
        >
          <FontAwesomeIcon icon={faShieldHalved} className="text-lg mb-1" />
          <span className="text-[10px] leading-tight tracking-wider uppercase font-semibold">Admin</span>
        </button>
      )}

      {/* Tab: Profile / Account */}
      <button
        onClick={() => navigateTo(user?.isLoggedIn ? 'profile' : 'login')}
        className={`flex flex-col items-center justify-center active:scale-90 duration-150 p-2 w-14 cursor-pointer ${
          currentPage === 'profile' || currentPage === 'login' ? 'text-[#A33F4D] dark:text-[#D98A92] font-bold' : 'text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white'
        }`}
      >
        <FontAwesomeIcon icon={faUser} className="text-lg mb-1" />
        <span className="text-[10px] leading-tight tracking-wider uppercase font-semibold">
          {user?.isLoggedIn ? 'Account' : 'Login'}
        </span>
      </button>

      {/* Tab: Cart */}
      <button
        onClick={() => navigateTo('cart')}
        className={`flex flex-col items-center justify-center active:scale-90 duration-150 p-2 w-14 relative cursor-pointer ${
          currentPage === 'cart' ? 'text-[#A33F4D] dark:text-[#D98A92] font-bold' : 'text-[#7A696C] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white'
        }`}
      >
        <FontAwesomeIcon icon={faCartShopping} className="text-lg mb-1" />
        {cartCount > 0 && (
          <span className="absolute top-2 right-2 bg-[#B56571] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] leading-tight tracking-wider uppercase font-semibold">Cart</span>
      </button>

    </nav>
  );
};
