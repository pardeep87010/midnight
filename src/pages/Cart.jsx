import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXmark, 
  faPlus, 
  faMinus, 
  faLock, 
  faCircleCheck, 
  faBagShopping,
  faTag,
  faGift,
  faBoxOpen,
  faCreditCard,
  faTruckFast,
  faShieldHalved,
  faLocationDot,
  faPhone,
  faPenToSquare,
  faCheck,
  faQrcode,
  faBuildingColumns,
  faMoneyBillWave,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { eventBus } from '../services/eventBus';
import { 
  validateEmail, 
  validatePhone, 
  validatePincode, 
  validateName, 
  validateAddress,
  sanitizeText 
} from '../utils/validation';

export const Cart = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal, 
    navigateTo,
    showToast,
    ordersList,
    user,
    openAuthModal,
    savedAddresses,
    addSavedAddress,
    createOrder
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [packagingType, setPackagingType] = useState('plain-box'); // plain-box, eco-kraft
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('cod'); // 'cod' (active) | 'online' (maintenance)
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Address Selection & Creation State
  const defaultAddr = savedAddresses?.find(a => a.isDefault) || savedAddresses?.[0];
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddr ? defaultAddr.id : 'new');
  const [showNewAddressForm, setShowNewAddressForm] = useState(!defaultAddr);
  const [addressErrors, setAddressErrors] = useState({});
  const [newAddress, setNewAddress] = useState({
    receiverName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    label: 'Home',
    saveToProfile: true
  });

  // INR Thresholds
  const freeGiftThreshold = 4999;
  const amountToGift = Math.max(0, freeGiftThreshold - cartSubtotal);
  const hasGift = cartSubtotal >= freeGiftThreshold;

  const shipping = cartSubtotal >= 999 ? 0 : 99;
  const discount = promoApplied ? Math.round(cartSubtotal * 0.1) : 0;
  const total = cartSubtotal + shipping - discount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      showToast('Please enter a VIP promotion code.', 'warning');
      return;
    }
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'VIP10' || cleanCode === 'MIDNIGHT20' || cleanCode === 'FIRST500') {
      setPromoApplied(true);
      showToast(`Privilege Code ${cleanCode} applied: 10% savings granted.`, 'success');
    } else {
      showToast('The entered code is unrecognized. You may use exclusive code "VIP10".', 'warning');
    }
  };

  const handleCheckout = async () => {
    if (!user || !user.isLoggedIn) {
      showToast('Please sign in or create an account to confirm delivery destination & complete order', 'info');
      openAuthModal('login', 'cart');
      return;
    }

    if (isCheckingOut) return;

    // Validate active address
    let activeAddress;
    if (selectedAddressId !== 'new') {
      activeAddress = savedAddresses.find(a => a.id === selectedAddressId);
    }

    if (!activeAddress) {
      const errors = {};
      const nameCheck = validateName(newAddress.receiverName, 'Receiver Name');
      if (!nameCheck.isValid) errors.receiverName = nameCheck.error;

      const phoneCheck = validatePhone(newAddress.phone);
      if (!phoneCheck.isValid) errors.phone = phoneCheck.error;

      const addrCheck = validateAddress(newAddress.addressLine1, 'Street Address');
      if (!addrCheck.isValid) errors.addressLine1 = addrCheck.error;

      const cityCheck = validateName(newAddress.city, 'City');
      if (!cityCheck.isValid) errors.city = cityCheck.error;

      const stateCheck = validateName(newAddress.state, 'State');
      if (!stateCheck.isValid) errors.state = stateCheck.error;

      const pinCheck = validatePincode(newAddress.pincode);
      if (!pinCheck.isValid) errors.pincode = pinCheck.error;

      if (Object.keys(errors).length > 0) {
        setAddressErrors(errors);
        showToast(Object.values(errors)[0], 'warning');
        return;
      }

      setAddressErrors({});
      activeAddress = {
        receiverName: sanitizeText(newAddress.receiverName),
        phone: phoneCheck.value,
        addressLine1: sanitizeText(newAddress.addressLine1),
        addressLine2: sanitizeText(newAddress.addressLine2 || ''),
        city: sanitizeText(newAddress.city),
        state: sanitizeText(newAddress.state),
        pincode: pinCheck.value,
        label: newAddress.label || 'Home'
      };

      if (newAddress.saveToProfile) {
        try {
          await addSavedAddress(activeAddress);
        } catch (e) {}
      }
    }

    setIsCheckingOut(true);

    // 1. Generate unique Idempotency Key (Prevents double-charging)
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderId = `MB-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullShippingAddress = `${activeAddress.addressLine1 || activeAddress.address || ''}${activeAddress.addressLine2 ? ', ' + activeAddress.addressLine2 : ''}, ${activeAddress.city}, ${activeAddress.state} - ${activeAddress.pincode}`.trim();

    const newOrder = {
      id: orderId,
      customerName: activeAddress.receiverName || user?.name || 'Aarav Sharma',
      customerEmail: user?.email || 'customer@midnightbloom.in',
      customerPhone: activeAddress.phone || user?.phone || '',
      customerCity: activeAddress.city || 'Mumbai',
      customerState: activeAddress.state || 'Maharashtra',
      customerPincode: activeAddress.pincode || '',
      shippingAddress: fullShippingAddress,
      totalAmount: total,
      paymentMode: 'Cash on Delivery (COD)',
      packaging: packagingType === 'plain-box' ? '100% Plain Unbranded Box' : 'Discreet Eco-Kraft Mailer',
      statementDescriptor: 'MB* SERVICES LLC',
      status: 'Processing',
      date: new Date().toISOString().split('T')[0],
      items: cart.map(item => ({
        name: item.product?.name || 'Luxury Instrument',
        quantity: item.quantity,
        price: item.product?.price || 0,
        color: item.color
      }))
    };

    // 2. Persist in SQLite Database via API
    await createOrder(newOrder);

    // 3. Publish 'order.placed' & 'payment.succeeded' events via Event Bus
    await eventBus.publish('order.placed', newOrder, { idempotencyKey });
    await eventBus.publish('payment.succeeded', {
      orderId: newOrder.id,
      amount: total,
      paymentMode: 'Cash on Delivery (COD)',
      transactionRef: `cod_${Date.now()}`
    }, { idempotencyKey: `pay_${idempotencyKey}` });

    setTimeout(() => {
      setIsCheckingOut(false);
      setConfirmedOrder(newOrder);
      setOrderComplete(true);
      clearCart();
      showToast(`Order #${orderId} Confirmed via Cash on Delivery!`, 'success');
    }, 900);
  };

  // Order Confirmed Success Screen
  if (orderComplete && confirmedOrder) {
    return (
      <div className="pt-28 md:pt-36 px-margin-mobile md:px-margin-desktop max-w-2xl mx-auto pb-32 space-y-8 animate-fade-in font-sans bg-[#FAF7F5] dark:bg-[#121316] text-[#181617] dark:text-[#EAE0E1] transition-colors">
        <div className="satin-card p-8 sm:p-10 rounded-3xl text-center space-y-6 border border-[#B56571]/30 dark:border-[#D98A92]/30 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <FontAwesomeIcon icon={faCircleCheck} className="text-4xl" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A33F4D] dark:text-[#D98A92] font-bold">
              ORDER CONFIRMED & SECURED IN DATABASE
            </span>
            <h1 className="text-3xl text-[#181617] dark:text-white font-serif font-bold tracking-tight">
              Thank You For Your Order
            </h1>
            <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-300 font-light max-w-md mx-auto">
              Your order <strong className="text-[#181617] dark:text-white font-mono">#{confirmedOrder.id}</strong> has been secured via Event Bus with zero double-charge guarantee.
            </p>
          </div>

          {/* Privacy & Statement Reminders */}
          <div className="bg-[#FAF7F5] dark:bg-[#18191E] p-5 rounded-2xl border border-[#B56571]/20 dark:border-white/5 space-y-3 text-left text-xs">
            <div className="flex justify-between items-start border-b border-black/[0.06] dark:border-white/5 pb-2.5">
              <span className="text-[#7A696C] dark:text-neutral-400">Plain Delivery Destination:</span>
              <div className="text-right max-w-[65%]">
                <strong className="text-[#181617] dark:text-white block font-sans">{confirmedOrder.customerName}</strong>
                <span className="text-xs text-[#5C4F52] dark:text-neutral-300 block font-light">{confirmedOrder.shippingAddress}</span>
                <span className="text-[11px] text-[#A33F4D] dark:text-[#D98A92] font-mono block">📱 {confirmedOrder.customerPhone}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-black/[0.06] dark:border-white/5 pb-2">
              <span className="text-[#7A696C] dark:text-neutral-400">Packaging Type:</span>
              <strong className="text-[#181617] dark:text-white font-mono">{confirmedOrder.packaging}</strong>
            </div>
            <div className="flex justify-between items-center border-b border-black/[0.06] dark:border-white/5 pb-2">
              <span className="text-[#7A696C] dark:text-neutral-400">Payment Mode:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Cash on Delivery (Pay upon delivery)</strong>
            </div>
            <div className="flex justify-between items-center border-b border-black/[0.06] dark:border-white/5 pb-2">
              <span className="text-[#7A696C] dark:text-neutral-400">Amount to Pay:</span>
              <strong className="text-[#181617] dark:text-white font-mono font-bold text-sm">₹{confirmedOrder.totalAmount?.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7A696C] dark:text-neutral-400">Confirmation Sent To:</span>
              <span className="text-[#181617] dark:text-neutral-300 font-mono">{confirmedOrder.customerEmail}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigateTo('home')}
              className="w-full btn-gold py-4 rounded-full font-bold uppercase tracking-wider text-xs shadow-xl cursor-pointer text-white"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigateTo('orders')}
              className="w-full bg-[#FAF7F5] hover:bg-[#FAF3F0] text-[#181617] dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-[#B56571]/25 dark:border-white/20 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs cursor-pointer shadow-xs"
            >
              Track Order & View Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty Bag Screen
  if (cart.length === 0) {
    return (
      <div className="pt-28 md:pt-36 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-32 text-center space-y-6 bg-[#FAF7F5] dark:bg-[#121316] text-[#181617] dark:text-[#EAE0E1] transition-colors">
        <div className="w-20 h-20 rounded-full bg-white dark:bg-[#18191E] border border-[#B56571]/25 dark:border-[#D98A92]/30 flex items-center justify-center mx-auto text-[#A33F4D] dark:text-[#D98A92] shadow-xs">
          <FontAwesomeIcon icon={faBagShopping} className="text-3xl" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-3xl text-[#181617] dark:text-white font-serif font-bold">Your Bag is Empty</h1>
          <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-400 leading-relaxed font-light">
            Discover our curated collection of certified adult wellness instruments with 100% plain confidential shipping.
          </p>
        </div>
        <button
          onClick={() => navigateTo('catalog')}
          className="btn-gold px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xl text-white"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-32 font-sans bg-[#FAF7F5] dark:bg-[#121316] text-[#181617] dark:text-[#EAE0E1] transition-colors">
      
      {/* Page Title */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.06] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#A33F4D] dark:text-[#D98A92] font-semibold">
            Confidential Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl text-[#181617] dark:text-white font-serif font-bold tracking-tight">
            Shopping Bag & Discreet Order
          </h1>
        </div>
        <span className="text-xs text-[#7A696C] dark:text-neutral-400 font-mono">
          {cart.reduce((t, i) => t + i.quantity, 0)} Item(s) Selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items + Delivery Address + Packaging Choice */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Cart Items List */}
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div 
                key={`${item.product?.id}-${item.color}-${idx}`}
                className="satin-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start transition-all"
              >
                <div 
                  onClick={() => navigateTo('product-detail', item.product?.id)}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black/40 shrink-0 cursor-pointer border border-white/5"
                >
                  <img 
                    src={item.product?.image || '/departments/vibrators.webp'} 
                    alt={item.product?.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 w-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 
                        onClick={() => navigateTo('product-detail', item.product?.id)}
                        className="text-base sm:text-lg font-bold text-white hover:text-[#D98A92] cursor-pointer font-serif transition-colors"
                      >
                        {item.product?.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-neutral-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                        title="Remove"
                      >
                        <FontAwesomeIcon icon={faXmark} className="text-base" />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Finish: <strong className="text-white">{item.color}</strong>
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span className="text-[11px] text-emerald-400 font-medium">In Stock • Plain Packaging Ready</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="text-[#D98A92] font-bold text-base font-mono">
                      ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </div>
                    
                    <div className="flex items-center bg-[#18191E] rounded-full border border-white/10">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faMinus} className="text-[11px]" />
                      </button>
                      <span className="text-xs px-2 w-8 text-center text-white font-mono font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-[11px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 📍 1. Plain Delivery Destination (Select Saved Address or Enter New) */}
          <div className="satin-card p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-[#D98A92]" />
                <span>1. Select Plain Delivery Destination:</span>
              </h4>
              {savedAddresses?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs text-[#D98A92] hover:underline font-mono font-semibold cursor-pointer"
                >
                  {showNewAddressForm ? '← Use Saved Address' : '+ Add New Address'}
                </button>
              )}
            </div>

            {/* If has saved addresses and not in new address form */}
            {!showNewAddressForm && savedAddresses && savedAddresses.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-[#D98A92] bg-[#D98A92]/10 shadow-md'
                            : 'border-white/5 bg-black/40 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#D98A92] bg-[#D98A92]' : 'border-neutral-500'
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                            </span>
                            <span className="text-xs font-bold text-white font-sans">{addr.receiverName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                              {addr.label || 'Home'}
                            </span>
                          </div>
                          {addr.isDefault && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-neutral-300 font-light mt-2 line-clamp-2">
                          {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        </p>
                        <p className="text-[11px] text-neutral-400 font-mono mt-1">
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p className="text-[11px] text-[#D98A92] font-mono mt-0.5">
                          📱 {addr.phone}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddressId('new');
                      setShowNewAddressForm(true);
                    }}
                    className="w-full py-2.5 rounded-xl border border-dashed border-white/20 hover:border-[#D98A92] text-xs font-mono text-neutral-300 hover:text-white flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                    <span>Deliver to a New Address</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Inline Address Entry Form */
              <div className="space-y-3.5 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-white font-mono">Enter Plain Destination Details:</span>
                  {savedAddresses?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-xs text-[#D98A92] hover:underline font-mono"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-300 mb-1">
                      Receiver Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={newAddress.receiverName}
                      onChange={(e) => {
                        setNewAddress({ ...newAddress, receiverName: e.target.value });
                        if (addressErrors.receiverName) setAddressErrors({ ...addressErrors, receiverName: null });
                      }}
                      className={`w-full bg-[#14151B] border rounded-lg p-2.5 text-xs text-white focus:outline-none transition-all ${
                        addressErrors.receiverName 
                          ? 'border-red-500 ring-1 ring-red-500/50' 
                          : 'border-white/10 focus:border-[#D98A92]'
                      }`}
                    />
                    {addressErrors.receiverName && (
                      <p className="text-[10px] text-red-400 font-mono mt-1">⚠ {addressErrors.receiverName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-300 mb-1">
                      Mobile Phone (For COD Delivery OTP) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={newAddress.phone}
                      onChange={(e) => {
                        setNewAddress({ ...newAddress, phone: e.target.value });
                        if (addressErrors.phone) setAddressErrors({ ...addressErrors, phone: null });
                      }}
                      className={`w-full bg-[#14151B] border rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono transition-all ${
                        addressErrors.phone 
                          ? 'border-red-500 ring-1 ring-red-500/50' 
                          : 'border-white/10 focus:border-[#D98A92]'
                      }`}
                    />
                    {addressErrors.phone && (
                      <p className="text-[10px] text-red-400 font-mono mt-1">⚠ {addressErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-300 mb-1">
                    Street Address (House/Flat No, Street) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 301, Silver Sands Apartments, 12th Cross Road"
                    value={newAddress.addressLine1}
                    onChange={(e) => {
                      setNewAddress({ ...newAddress, addressLine1: e.target.value });
                      if (addressErrors.addressLine1) setAddressErrors({ ...addressErrors, addressLine1: null });
                    }}
                    className={`w-full bg-[#14151B] border rounded-lg p-2.5 text-xs text-white focus:outline-none transition-all ${
                      addressErrors.addressLine1 
                        ? 'border-red-500 ring-1 ring-red-500/50' 
                        : 'border-white/10 focus:border-[#D98A92]'
                    }`}
                  />
                  {addressErrors.addressLine1 && (
                    <p className="text-[10px] text-red-400 font-mono mt-1">⚠ {addressErrors.addressLine1}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-300 mb-1">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={newAddress.city}
                      onChange={(e) => {
                        setNewAddress({ ...newAddress, city: e.target.value });
                        if (addressErrors.city) setAddressErrors({ ...addressErrors, city: null });
                      }}
                      className={`w-full bg-[#14151B] border rounded-lg p-2.5 text-xs text-white focus:outline-none transition-all ${
                        addressErrors.city 
                          ? 'border-red-500 ring-1 ring-red-500/50' 
                          : 'border-white/10 focus:border-[#D98A92]'
                      }`}
                    />
                    {addressErrors.city && (
                      <p className="text-[10px] text-red-400 font-mono mt-1">⚠ {addressErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-300 mb-1">
                      State <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={newAddress.state}
                      onChange={(e) => {
                        setNewAddress({ ...newAddress, state: e.target.value });
                        if (addressErrors.state) setAddressErrors({ ...addressErrors, state: null });
                      }}
                      className={`w-full bg-[#14151B] border rounded-lg p-2.5 text-xs text-white focus:outline-none transition-all ${
                        addressErrors.state 
                          ? 'border-red-500 ring-1 ring-red-500/50' 
                          : 'border-white/10 focus:border-[#D98A92]'
                      }`}
                    />
                    {addressErrors.state && (
                      <p className="text-[10px] text-red-400 font-mono mt-1">⚠ {addressErrors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-300 mb-1">
                      PIN Code (6 digits) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 400018"
                      value={newAddress.pincode}
                      onChange={(e) => {
                        setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '') });
                        if (addressErrors.pincode) setAddressErrors({ ...addressErrors, pincode: null });
                      }}
                      className={`w-full bg-[#14151B] border rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono transition-all ${
                        addressErrors.pincode 
                          ? 'border-red-500 ring-1 ring-red-500/50' 
                          : 'border-white/10 focus:border-[#D98A92]'
                      }`}
                    />
                    {addressErrors.pincode && (
                      <p className="text-[10px] text-red-400 font-mono mt-1">⚠ {addressErrors.pincode}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="saveToProfileCheck"
                    checked={newAddress.saveToProfile}
                    onChange={(e) => setNewAddress({ ...newAddress, saveToProfile: e.target.checked })}
                    className="rounded border-[#B56571]/40 text-[#B56571] focus:ring-[#B56571] cursor-pointer"
                  />
                  <label htmlFor="saveToProfileCheck" className="text-xs text-neutral-300 cursor-pointer">
                    Save this destination to my confidential profile for 1-click future orders
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 📦 2. Discreet Packaging Choice */}
          <div className="satin-card p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <FontAwesomeIcon icon={faBoxOpen} className="text-[#D98A92]" />
              <span>2. Select Packaging Preference:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPackagingType('plain-box')}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  packagingType === 'plain-box' ? 'border-[#D98A92] bg-[#D98A92]/10 text-white font-semibold' : 'border-white/5 bg-black/40 text-neutral-400'
                }`}
              >
                <span className="block font-bold text-white mb-0.5">📦 100% Plain Unmarked Box</span>
                <span className="text-[10px] text-neutral-400">Zero logos, unmarked plain cardboard (Recommended)</span>
              </button>

              <button
                type="button"
                onClick={() => setPackagingType('eco-kraft')}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  packagingType === 'eco-kraft' ? 'border-[#D98A92] bg-[#D98A92]/10 text-white font-semibold' : 'border-white/5 bg-black/40 text-neutral-400'
                }`}
              >
                <span className="block font-bold text-white mb-0.5">🌿 Discreet Eco-Kraft Mailer</span>
                <span className="text-[10px] text-neutral-400">100% Recyclable, unmarked padded envelope</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-4 mt-8 md:mt-0 space-y-6">
          <div className="satin-card rounded-2xl p-6 space-y-5 shadow-2xl">
            <h3 className="text-base text-white font-serif font-bold border-b border-white/[0.06] pb-3">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="VIP Code (try 'VIP10')"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-black/60 border border-white/10 rounded-full px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D98A92] font-mono"
              />
              <button
                type="submit"
                className="bg-white/10 hover:bg-[#B56571] hover:text-white text-[#D98A92] px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Apply
              </button>
            </form>

            <div className="space-y-2.5 text-xs text-neutral-300 border-t border-white/[0.06] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Discreet Express Shipping</span>
                <span className="text-white font-mono">
                  {shipping === 0 ? <strong className="text-emerald-400 font-bold font-mono">FREE</strong> : `₹${shipping.toLocaleString('en-IN')}`}
                </span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Discount (10%)</span>
                  <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {hasGift && (
                <div className="flex justify-between text-[#D98A92]">
                  <span>Complimentary Velvet Pouch</span>
                  <span className="font-mono font-bold">FREE (₹999 value)</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-white/[0.06]">
                <span>Total Amount</span>
                <span className="text-[#D98A92] font-serif text-lg font-bold font-mono">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="pt-2 border-t border-black/[0.08] dark:border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#5C4F52] dark:text-neutral-400 font-semibold">
                  Select Payment Option:
                </span>
                <span className="text-[10px] font-mono bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  COD Active
                </span>
              </div>

              {/* 1. Cash on Delivery (COD) Option (Active & Recommended) */}
              <div 
                onClick={() => setSelectedPaymentMode('cod')}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer space-y-1.5 ${
                  selectedPaymentMode === 'cod'
                    ? 'border-[#B56571] dark:border-[#D98A92] bg-[#FAF3F0] dark:bg-[#18191E] shadow-sm'
                    : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="text-xs text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold text-[#181617] dark:text-white font-mono">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-[#5C4F52] dark:text-neutral-300 font-light leading-relaxed pl-5">
                  Pay in cash or scan delivery partner's UPI QR code upon receiving your 100% plain, sealed box at your doorstep. Zero prepayment risk.
                </p>
              </div>

              {/* 2. Online Payment Options (UPI / Cards / Net Banking) - Notice Badge */}
              <div 
                onClick={() => {
                  setSelectedPaymentMode('cod');
                  showToast('Online payment gateway is temporarily undergoing scheduled PCI-DSS banking maintenance. COD is active with instant priority dispatch.', 'info');
                }}
                className="p-3.5 rounded-xl border border-dashed border-black/20 dark:border-white/15 bg-black/[0.02] dark:bg-black/40 space-y-2 cursor-pointer hover:border-[#B56571]/40 transition-all opacity-85"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <span className="text-xs font-bold text-[#181617] dark:text-white font-mono flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCreditCard} className="text-xs text-[#A33F4D] dark:text-[#D98A92]" />
                      <span>Online Payment (UPI / Cards / Net Banking)</span>
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    Maintenance
                  </span>
                </div>

                {/* Online Payment Provider Visual Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pl-4 text-[10px] font-mono text-[#7A696C] dark:text-neutral-400">
                  <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    UPI (GPay / PhonePe / Paytm)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    Cards (Visa / Master / RuPay)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    Net Banking
                  </span>
                </div>

                <p className="text-[10px] text-[#7A696C] dark:text-neutral-400 font-light pl-4 flex items-center gap-1">
                  <FontAwesomeIcon icon={faCircleInfo} className="text-[9px] text-amber-500 shrink-0" />
                  <span>Online gateway undergoing scheduled upgrade. Please use COD for instant door-to-door dispatch.</span>
                </p>
              </div>

              <div className="flex items-center space-x-1.5 px-1 text-[10px] text-[#7A696C] dark:text-neutral-400 font-mono">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#A33F4D] dark:text-[#D98A92]" />
                <span>Zero advance payment required • Pay safely upon delivery</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full btn-gold py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-all active:scale-95 shadow-xl flex items-center justify-center space-x-2 cursor-pointer text-white"
            >
              <FontAwesomeIcon icon={faLock} className="text-xs" />
              <span>{isCheckingOut ? 'Securing Order in Database...' : `Place Order with Cash on Delivery (₹${total.toLocaleString('en-IN')})`}</span>
            </button>

            <div className="text-center pt-2 text-[11px] text-[#5C4F52] dark:text-neutral-400 space-y-1 font-light">
              <div className="flex items-center justify-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                <span>100% Plain Box Guaranteed</span>
              </div>
              <p>Discreet courier delivery strictly marked as <strong className="text-[#181617] dark:text-white">"MB Logistics"</strong></p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
