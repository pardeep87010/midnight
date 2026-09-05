import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Package, 
  CreditCard, 
  ArrowRight, 
  Sparkles,
  Lock,
  Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    navigateTo 
  } = useApp();

  const [packagingType, setPackagingType] = useState('plain-box');
  const [includeDiscreetPouch, setIncludeDiscreetPouch] = useState(true);

  if (!isCartOpen) return null;

  const shippingCost = cartSubtotal > 100 ? 0 : 9.50;
  const total = cartSubtotal + shippingCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-velour-900 border-l border-velour-800 text-velour-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-velour-800 flex items-center justify-between bg-velour-950">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gold-400" />
              <h2 className="font-serif text-lg font-bold text-velour-100">
                Discreet Shopping Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-velour-400 hover:text-velour-100 hover:bg-velour-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Discreet Statement Notification */}
          <div className="bg-velour-850 px-4 py-2.5 border-b border-velour-800 text-[11px] flex items-center justify-between text-velour-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Statement: <code className="text-gold-300 font-mono font-semibold">VL* SERVICES</code></span>
            </div>
            <span className="text-emerald-400 font-medium">100% Encrypted</span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-velour-800 flex items-center justify-center mx-auto text-velour-500">
                  <Package className="w-8 h-8" />
                </div>
                <p className="text-sm text-velour-400">Your intimate shopping bag is currently empty.</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('catalog');
                  }}
                  className="bg-gold-500 hover:bg-gold-400 text-velour-950 text-xs font-bold py-2.5 px-6 rounded-full transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div 
                  key={`${item.product.id}-${item.selectedColor}-${idx}`}
                  className="p-3.5 bg-velour-850 border border-velour-800 rounded-xl flex space-x-3.5"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-velour-950 border border-velour-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-medium text-velour-100 truncate pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-velour-500 hover:text-rose-400 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="text-[11px] text-gold-400/90 mt-0.5">
                        Finish: {item.selectedColor}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 bg-velour-800 rounded-lg border border-velour-700 p-0.5">
                        <button
                          onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                          className="p-1 text-velour-400 hover:text-velour-100 hover:bg-velour-700 rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                          className="p-1 text-velour-400 hover:text-velour-100 hover:bg-velour-700 rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold font-serif text-gold-300">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Packaging Preference in Cart */}
            {cart.length > 0 && (
              <div className="p-3.5 bg-velour-950 border border-gold-500/20 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-velour-200 flex items-center">
                    <Package className="w-3.5 h-3.5 text-gold-400 mr-1.5" />
                    Packaging Mode
                  </span>
                  <span className="text-[10px] text-gold-400 uppercase font-mono">100% Unmarked</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setPackagingType('plain-box')}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      packagingType === 'plain-box'
                        ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                        : 'border-velour-800 text-velour-400 hover:border-velour-700'
                    }`}
                  >
                    <div className="font-semibold text-[11px]">Plain Brown Box</div>
                    <div className="text-[9px] text-velour-500">Sturdy, zero labels</div>
                  </button>

                  <button
                    onClick={() => setPackagingType('stealth-gift')}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      packagingType === 'stealth-gift'
                        ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                        : 'border-velour-800 text-velour-400 hover:border-velour-700'
                    }`}
                  >
                    <div className="font-semibold text-[11px]">Unmarked Velvet Box</div>
                    <div className="text-[9px] text-velour-500">Luxury interior</div>
                  </button>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="pouch"
                    checked={includeDiscreetPouch}
                    onChange={(e) => setIncludeDiscreetPouch(e.target.checked)}
                    className="rounded bg-velour-800 border-velour-700 text-gold-500 focus:ring-gold-500/40"
                  />
                  <label htmlFor="pouch" className="text-[11px] text-velour-300 cursor-pointer flex items-center">
                    <Gift className="w-3 h-3 text-gold-400 mr-1" />
                    Include complimentary lockable velvet travel pouch
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-velour-800 bg-velour-950 space-y-3">
              <div className="space-y-1.5 text-xs text-velour-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-velour-100">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discreet Courier Delivery</span>
                  <span className="font-mono text-velour-100">
                    {shippingCost === 0 ? <strong className="text-emerald-400">FREE ($100+ perk)</strong> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-velour-50 pt-2 border-t border-velour-800">
                  <span>Estimated Total</span>
                  <span className="font-serif text-gold-300 text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('checkout');
                }}
                className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-velour-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-glow-gold"
              >
                <Lock className="w-3.5 h-3.5 text-velour-950" />
                <span>Proceed to Anonymized Checkout</span>
                <ArrowRight className="w-4 h-4 text-velour-950" />
              </button>

              <p className="text-[10px] text-center text-velour-500">
                Shipped within 24h in tamper-evident plain packaging. Zero marketing mailers.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
