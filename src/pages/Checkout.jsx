import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  CreditCard, 
  Lock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Truck,
  Sparkles,
  Download,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { CDN_CONFIG, handleImageError } from '../utils/cdnCache';

export const Checkout = () => {
  const { 
    cart, 
    cartSubtotal, 
    clearCart, 
    navigateTo,
    showToast
  } = useApp();

  const [step, setStep] = useState(1); // 1: Delivery, 2: Packaging, 3: Payment, 4: Confirmed
  const [deliveryMethod, setDeliveryMethod] = useState('home'); // home, locker, po-box
  const [packagingTier, setPackagingTier] = useState('standard'); // standard, stealth-gift, eco-plain
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, apple, crypto
  const [orderNumber, setOrderNumber] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    email: 'jane.private@example.com',
    address: '742 Evergreen Terrace',
    city: 'New York',
    zip: '10001',
    lockerLocation: 'Amazon Hub Locker - Nexus (5th Ave, Manhattan)',
    cardNumber: '•••• •••• •••• 4242',
    expDate: '08/28',
    cvv: '•••'
  });

  const shippingCost = cartSubtotal > 100 ? 0 : 9.50;
  const packagingCost = packagingTier === 'stealth-gift' ? 8.00 : 0;
  const grandTotal = cartSubtotal + shippingCost + packagingCost;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteOrder = () => {
    const generatedOrder = `VL-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrder);
    setStep(4);
    clearCart();
    
    // Trigger confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-16 h-16 text-velour-600 mx-auto" />
        <h2 className="text-2xl font-serif font-bold text-velour-100">Your bag is empty</h2>
        <p className="text-xs text-velour-400">Add intimacy essentials to proceed to secure checkout.</p>
        <button
          onClick={() => navigateTo('catalog')}
          className="bg-gold-500 hover:bg-gold-400 text-velour-950 text-xs font-bold py-2.5 px-6 rounded-full"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Checkout Progress Stepper */}
      {step < 4 && (
        <div className="flex items-center justify-between border-b border-velour-800 pb-6">
          {[
            { num: 1, label: '1. Discreet Delivery' },
            { num: 2, label: '2. Stealth Packaging' },
            { num: 3, label: '3. Anonymized Payment' },
          ].map((s) => (
            <div 
              key={s.num}
              className={`flex items-center space-x-2 text-xs font-semibold ${
                step >= s.num ? 'text-gold-300' : 'text-velour-600'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                step >= s.num ? 'bg-gold-500 text-velour-950' : 'bg-velour-800 text-velour-500'
              }`}>
                {s.num}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: Delivery Address & Locker Pickup */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-velour-50">Choose Discreet Delivery Method</h2>
              <p className="text-xs text-velour-400 mt-1">Select direct home delivery, secure locker pickup, or P.O. Box.</p>
            </div>

            {/* Delivery Method Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'home', label: 'Standard Home', icon: MapPin, desc: 'Plain cardboard box' },
                { id: 'locker', label: 'Locker Pickup', icon: Lock, desc: 'Amazon/UPS Locker' },
                { id: 'po-box', label: 'P.O. Box', icon: Truck, desc: 'USPS Post Office' },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setDeliveryMethod(m.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      deliveryMethod === m.id
                        ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                        : 'border-velour-800 bg-velour-900 text-velour-400 hover:border-velour-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-2 text-gold-400" />
                    <div className="font-semibold text-xs text-velour-200">{m.label}</div>
                    <div className="text-[10px] text-velour-500">{m.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Address Form */}
            <div className="bg-velour-900 border border-velour-800 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-velour-300 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-velour-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-velour-300 block mb-1">Encrypted Email for Tracking</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-velour-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {deliveryMethod === 'locker' ? (
                <div>
                  <label className="text-xs text-velour-300 block mb-1">Nearest Secure Locker Station</label>
                  <select
                    name="lockerLocation"
                    value={formData.lockerLocation}
                    onChange={handleInputChange}
                    className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-xs text-velour-100 focus:outline-none focus:border-gold-500"
                  >
                    <option>Amazon Hub Locker - Nexus (5th Ave, Manhattan)</option>
                    <option>UPS Access Point - Broadway 24/7 (SoHo)</option>
                    <option>FedEx Hold Station - Grand Central Terminal</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-velour-300 block mb-1">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-velour-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-velour-300 block mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-velour-100 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="text-velour-300 block mb-1">Postal / ZIP Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 text-velour-100 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 text-velour-950 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-glow-gold"
            >
              <span>Continue to Stealth Packaging Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Summary */}
          <OrderSummaryBox 
            cart={cart} 
            subtotal={cartSubtotal} 
            shipping={shippingCost} 
            packaging={packagingCost} 
            total={grandTotal} 
          />
        </div>
      )}

      {/* STEP 2: Stealth Packaging Selection */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-velour-50">Select Packaging Tier</h2>
              <p className="text-xs text-velour-400 mt-1">All tiers are 100% unmarked externally. Zero brand references.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'standard',
                  title: 'Standard Plain Brown Box (Complimentary)',
                  price: 'FREE',
                  desc: 'Heavy-duty plain kraft cardboard box sealed with reinforced paper tape. Completely anonymous.',
                  badge: 'Most Popular'
                },
                {
                  id: 'stealth-gift',
                  title: 'Stealth Luxury Unmarked Gift Box (+ $8.00)',
                  price: '+$8.00',
                  desc: 'Plain outer box with an exquisite matte black satin gift box and velvet pouch inside. Perfect for gifting.',
                  badge: 'Luxury Experience'
                },
                {
                  id: 'eco-plain',
                  title: '100% Recycled Padded Stealth Mailer',
                  price: 'FREE',
                  desc: 'Biodegradable, carbon-neutral unmarked cushioned pouch with zero plastic.',
                  badge: 'Eco-Friendly'
                }
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setPackagingTier(tier.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    packagingTier === tier.id
                      ? 'border-gold-500 bg-gold-500/10 shadow-glow-gold'
                      : 'border-velour-800 bg-velour-900 hover:border-velour-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        packagingTier === tier.id ? 'border-gold-500 bg-gold-500' : 'border-velour-600'
                      }`}>
                        {packagingTier === tier.id && <div className="w-1.5 h-1.5 rounded-full bg-velour-950" />}
                      </div>
                      <span className="text-xs font-serif font-bold text-velour-100">{tier.title}</span>
                    </div>
                    <span className="text-xs font-mono text-gold-300 font-bold">{tier.price}</span>
                  </div>
                  <p className="text-xs text-velour-400 mt-2 pl-7 leading-relaxed">{tier.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="py-3.5 px-6 rounded-xl border border-velour-700 text-velour-300 text-xs font-medium hover:bg-velour-850 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 text-velour-950 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-glow-gold"
              >
                <span>Continue to Anonymized Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <OrderSummaryBox 
            cart={cart} 
            subtotal={cartSubtotal} 
            shipping={shippingCost} 
            packaging={packagingCost} 
            total={grandTotal} 
          />
        </div>
      )}

      {/* STEP 3: Anonymized Payment */}
      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-velour-50">Anonymized Encrypted Payment</h2>
              <p className="text-xs text-velour-400 mt-1">256-bit AES encrypted checkout. Your banking descriptor is 100% neutral.</p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Credit Card', desc: 'Discreet Descriptor' },
                { id: 'apple', label: 'Apple / Google Pay', desc: '1-Touch TouchID' },
                { id: 'crypto', label: 'Monero / BTC', desc: 'Zero-Trace Crypto' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === p.id
                      ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                      : 'border-velour-800 bg-velour-900 text-velour-400 hover:border-velour-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-velour-200">{p.label}</div>
                  <div className="text-[10px] text-velour-500 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="bg-velour-900 border border-velour-800 rounded-2xl p-6 space-y-4">
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-velour-300 block mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 font-mono text-velour-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-velour-300 block mb-1">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        name="expDate"
                        value={formData.expDate}
                        onChange={handleInputChange}
                        className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 font-mono text-velour-100 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="text-velour-300 block mb-1">CVV Code</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full bg-velour-800 border border-velour-700 rounded-lg p-2.5 font-mono text-velour-100 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Proof of descriptor banner */}
                <div className="p-3 bg-velour-950 rounded-xl border border-gold-500/25 text-[11px] space-y-1">
                  <div className="flex items-center text-gold-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-gold-400" />
                    Statement Proof Verification
                  </div>
                  <p className="text-velour-400">
                    Your charge will appear as: <code className="text-gold-300 font-mono font-bold bg-velour-850 px-1 py-0.5 rounded">VL* SERVICES NY</code> for <strong className="text-velour-200 font-mono">${grandTotal.toFixed(2)}</strong>.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="bg-velour-900 border border-velour-800 rounded-2xl p-6 text-xs text-velour-300 space-y-3">
                <div className="flex items-center space-x-2 text-gold-400 font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Monero (XMR) & Bitcoin (BTC) Private Gateway</span>
                </div>
                <p className="text-velour-400 text-[11px]">
                  Zero personal data logged on the blockchain. Instant transaction confirmation generated upon checkout completion.
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(2)}
                className="py-3.5 px-6 rounded-xl border border-velour-700 text-velour-300 text-xs font-medium hover:bg-velour-850 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleCompleteOrder}
                className="flex-1 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 text-velour-950 font-bold py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-glow-gold transform hover:-translate-y-0.5"
              >
                <Lock className="w-4 h-4 text-velour-950" />
                <span>Authorize Discreet Payment • ${grandTotal.toFixed(2)}</span>
              </button>
            </div>
          </div>

          <OrderSummaryBox 
            cart={cart} 
            subtotal={cartSubtotal} 
            shipping={shippingCost} 
            packaging={packagingCost} 
            total={grandTotal} 
          />
        </div>
      )}

      {/* STEP 4: Order Confirmed Screen */}
      {step === 4 && (
        <div className="max-w-2xl mx-auto bg-velour-900 border border-gold-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-velour-800 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-gold">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono text-gold-400 uppercase tracking-widest font-semibold">
              Order Confirmed & Securely Queued
            </span>
            <h1 className="text-3xl font-serif font-bold text-velour-50">
              Thank You for Your Order
            </h1>
            <p className="text-xs text-velour-300 max-w-md mx-auto">
              Your intimacy essentials are currently being hand-assembled in our sterile cleanroom and packed into an unmarked plain box.
            </p>
          </div>

          <div className="p-4 bg-velour-950 rounded-2xl border border-velour-800 text-xs text-left space-y-2">
            <div className="flex justify-between border-b border-velour-800 pb-2">
              <span className="text-velour-400">Order Reference:</span>
              <span className="text-gold-300 font-mono font-bold">{orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-velour-800 pb-2">
              <span className="text-velour-400">Packaging Type:</span>
              <span className="text-velour-100 capitalize">{packagingTier.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between border-b border-velour-800 pb-2">
              <span className="text-velour-400">Billing Line Descriptor:</span>
              <span className="text-gold-300 font-mono">VL* SERVICES LLC NY</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-velour-400">Estimated Delivery:</span>
              <span className="text-emerald-400 font-medium">In 2 Business Days via Discreet Courier</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => showToast('Encrypted receipt PDF generated and downloaded.', 'success')}
              className="flex-1 py-3 px-4 rounded-xl border border-velour-700 hover:bg-velour-850 text-velour-200 text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Encrypted Receipt</span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="flex-1 py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-velour-950 text-xs font-bold transition-all shadow-glow-gold"
            >
              Return to Discovery Home
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

const OrderSummaryBox = ({ cart, subtotal, shipping, packaging, total }) => {
  return (
    <div className="bg-velour-900 border border-velour-800 rounded-2xl p-5 space-y-4 h-fit shadow-card-dark">
      <h3 className="text-xs font-serif font-bold text-velour-100 uppercase tracking-wider border-b border-velour-800 pb-2">
        Discreet Bag Summary ({cart.length})
      </h3>

      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
        {cart.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3 text-xs">
            <img 
              src={CDN_CONFIG.getOptimizedImageUrl(item.product.images && item.product.images[0] ? item.product.images[0] : item.product.image)} 
              alt={item.product?.name || ''} 
              className="w-10 h-10 rounded-lg object-cover bg-velour-950 shrink-0" 
              onError={handleImageError}
            />
            <div className="flex-1 min-w-0">
              <div className="text-velour-200 font-medium truncate">{item.product.name}</div>
              <div className="text-[10px] text-velour-500">Qty: {item.quantity} • {item.selectedColor}</div>
            </div>
            <span className="font-mono text-gold-300 font-bold">${item.product.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-velour-800 pt-3 space-y-1.5 text-xs text-velour-400">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-mono text-velour-200">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discreet Courier</span>
          <span className="font-mono text-velour-200">
            {shipping === 0 ? <strong className="text-emerald-400">FREE</strong> : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        {packaging > 0 && (
          <div className="flex justify-between">
            <span>Stealth Gift Box</span>
            <span className="font-mono text-velour-200">+${packaging.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm text-velour-100 pt-2 border-t border-velour-800">
          <span>Total</span>
          <span className="font-serif text-gold-300 text-base">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
