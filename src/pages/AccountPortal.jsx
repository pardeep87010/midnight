import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Heart, 
  Package, 
  MapPin, 
  ShieldCheck, 
  Trash2, 
  ShoppingBag, 
  Key, 
  CheckCircle2, 
  ArrowRight,
  EyeOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/mockData';
import { CDN_CONFIG, handleImageError } from '../utils/cdnCache';

export const AccountPortal = () => {
  const { 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    navigateTo, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('wishlist'); // wishlist, orders, addresses, security
  const [isPinLocked, setIsPinLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [userPin, setUserPin] = useState('1234');
  const [isUnlocked, setIsUnlocked] = useState(true);

  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  const mockOrders = [
    {
      id: 'VL-849201',
      date: 'Aug 21, 2026',
      status: 'Delivered (In Plain Box)',
      total: '$189.00',
      items: ['AERO Pulse | Sonic Airwave Stimulator'],
      tracking: '9400 1098 9482 1192',
      courier: 'Discreet FedEx Ground',
      descriptor: 'VL* SERVICES LLC'
    },
    {
      id: 'VL-719384',
      date: 'Jul 14, 2026',
      status: 'Delivered (Amazon Locker)',
      total: '$90.00',
      items: ['Solis Warming Botanical Serum', 'Ignite Soy Candle'],
      tracking: '9400 1192 4892 0019',
      courier: 'Amazon Hub Locker',
      descriptor: 'VL* SERVICES LLC'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-velour-800 pb-6 gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-velour-850 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-gold-400 font-semibold">Private & Encrypted Portal</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-velour-50">
              Personal Intimacy Account
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              showToast('Browsing history & cookies purged successfully.', 'info');
            }}
            className="text-xs text-velour-400 hover:text-rose-400 border border-velour-700 bg-velour-900 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
            title="Instant session wipe"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Session Cache</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 overflow-x-auto border-b border-velour-800 pb-1">
        {[
          { id: 'wishlist', label: `Private Wishlist (${wishlist.length})`, icon: Heart },
          { id: 'orders', label: 'Discreet Orders & Tracking', icon: Package },
          { id: 'addresses', label: 'Saved Plain Delivery Locations', icon: MapPin },
          { id: 'security', label: 'PIN Lock & Privacy Settings', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-gold-500/15 text-gold-300 border border-gold-500/40'
                  : 'text-velour-400 hover:text-velour-200 hover:bg-velour-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 bg-velour-900/40 rounded-2xl border border-velour-800 p-8 space-y-4">
              <Heart className="w-12 h-12 text-velour-600 mx-auto" />
              <h3 className="text-base font-serif font-bold text-velour-200">Your wishlist is empty</h3>
              <p className="text-xs text-velour-400">Save items you wish to privately review or purchase later.</p>
              <button
                onClick={() => navigateTo('catalog')}
                className="bg-gold-500 hover:bg-gold-400 text-velour-950 text-xs font-bold py-2 px-5 rounded-full"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-velour-900 border border-velour-800 rounded-2xl overflow-hidden p-4 flex flex-col justify-between space-y-3 shadow-card-dark"
                >
                  <div className="space-y-3">
                    <div className="aspect-square rounded-xl overflow-hidden bg-velour-950 relative">
                      <img 
                        src={CDN_CONFIG.getOptimizedImageUrl(product.images && product.images[0] ? product.images[0] : product.image)} 
                        alt={product.name || ''} 
                        className="w-full h-full object-cover" 
                        onError={handleImageError}
                      />
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-rose-400 hover:text-rose-300"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono text-gold-400">{product.brand}</span>
                      <h4 
                        onClick={() => navigateTo('product-detail', product.id)}
                        className="text-xs font-serif font-bold text-velour-100 hover:text-gold-300 cursor-pointer truncate"
                      >
                        {product.name}
                      </h4>
                      <div className="text-xs font-bold text-gold-300 mt-1">${product.price}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-velour-800 flex space-x-2">
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="flex-1 bg-gold-500 hover:bg-gold-400 text-velour-950 text-xs font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {mockOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 bg-velour-900 border border-velour-800 rounded-2xl space-y-3 shadow-card-dark"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-velour-800 pb-3 gap-2 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-gold-300">{ord.id}</span>
                  <span className="text-velour-500">•</span>
                  <span className="text-velour-400">{ord.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-medium">
                    {ord.status}
                  </span>
                  <span className="font-mono font-bold text-velour-100">{ord.total}</span>
                </div>
              </div>

              <div className="text-xs text-velour-300 space-y-1">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Package className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>{it}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-velour-400 bg-velour-950 p-3 rounded-xl gap-2">
                <div>
                  Tracking: <code className="text-gold-300 font-mono">{ord.tracking}</code> ({ord.courier})
                </div>
                <div>
                  Statement line: <code className="text-velour-300 font-mono">{ord.descriptor}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Saved Locations */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-velour-900 border border-gold-500/30 rounded-2xl space-y-3 shadow-card-dark">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-400 uppercase font-mono">Default Home (Plain Box)</span>
              <span className="text-[10px] bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded">Primary</span>
            </div>
            <div className="text-xs text-velour-200 space-y-0.5">
              <div className="font-bold">Jane Doe</div>
              <div className="text-velour-400">742 Evergreen Terrace</div>
              <div className="text-velour-400">New York, NY 10001</div>
            </div>
            <div className="text-[10px] text-emerald-400 font-medium pt-1">
              ✓ Marked for plain cardboard box packaging
            </div>
          </div>

          <div className="p-5 bg-velour-900 border border-velour-800 rounded-2xl space-y-3 shadow-card-dark">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-velour-300 uppercase font-mono">Secure Pickup Locker</span>
            </div>
            <div className="text-xs text-velour-200 space-y-0.5">
              <div className="font-bold">Amazon Hub Locker - Nexus</div>
              <div className="text-velour-400">5th Ave & 42nd St</div>
              <div className="text-velour-400">New York, NY 10018</div>
            </div>
            <div className="text-[10px] text-emerald-400 font-medium pt-1">
              ✓ 24/7 PIN pickup access
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Privacy & PIN Lock */}
      {activeTab === 'security' && (
        <div className="bg-velour-900 border border-velour-800 rounded-2xl p-6 space-y-6 max-w-xl shadow-card-dark">
          <div className="space-y-1">
            <h3 className="text-base font-serif font-bold text-velour-50">Private PIN Security Lock</h3>
            <p className="text-xs text-velour-400">Require a 4-digit PIN before showing your orders and intimate wishlist.</p>
          </div>

          <div className="p-4 bg-velour-850 rounded-xl space-y-3 border border-velour-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-velour-200 font-semibold">Enable PIN Protection</span>
              <input
                type="checkbox"
                checked={isPinLocked}
                onChange={(e) => {
                  setIsPinLocked(e.target.checked);
                  showToast(e.target.checked ? 'PIN lock enabled.' : 'PIN lock disabled.');
                }}
                className="rounded bg-velour-800 border-velour-700 text-gold-500 focus:ring-gold-500/40 cursor-pointer"
              />
            </div>
            {isPinLocked && (
              <div className="pt-2 text-xs space-y-2">
                <label className="text-velour-400 block">Current PIN Code</label>
                <input
                  type="password"
                  maxLength={4}
                  value={userPin}
                  onChange={(e) => setUserPin(e.target.value)}
                  className="bg-velour-950 border border-velour-700 rounded-lg px-3 py-2 text-gold-300 font-mono text-center tracking-widest text-sm w-32 focus:outline-none focus:border-gold-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
