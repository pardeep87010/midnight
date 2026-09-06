import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faTruckFast,
  faCircleCheck,
  faClock,
  faBan,
  faMagnifyingGlass,
  faChevronDown,
  faChevronUp,
  faReceipt,
  faRotateRight,
  faShieldHalved,
  faLock,
  faArrowLeft,
  faBagShopping,
  faCopy,
  faPrint,
  faHeadset,
  faLocationDot,
  faFileInvoice,
  faCircleInfo,
  faCircleXmark,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';

export const MyOrders = () => {
  const {
    user,
    ordersList,
    fetchOrders,
    navigateTo,
    addToCart,
    showToast,
    updateOrderStatus
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);
  const [guestOrderId, setGuestOrderId] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSearchingGuest, setIsSearchingGuest] = useState(false);
  const [guestFoundOrder, setGuestFoundOrder] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync orders on mount or user email change
  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
    } else {
      fetchOrders();
    }
  }, [user?.email]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders(user?.email || null);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Order status synchronized with dispatch server', 'info');
    }, 600);
  };

  // Filter orders for the active user session or guest search
  const displayedOrders = useMemo(() => {
    let list = [];

    if (user?.isLoggedIn && user?.email) {
      list = (ordersList || []).filter(order => {
        if (user?.isAdmin) return true;
        const ordEmail = (order.customerEmail || order.customer_email || order.email || '').toLowerCase();
        return ordEmail === user.email.toLowerCase();
      });
    } else if (guestFoundOrder) {
      list = [guestFoundOrder];
    } else {
      list = ordersList || [];
    }

    // Apply Status Filter
    if (selectedStatusFilter !== 'all') {
      list = list.filter(order => {
        const s = (order.status || 'processing').toLowerCase();
        if (selectedStatusFilter === 'processing') return s === 'processing' || s === 'placed' || s === 'pending';
        if (selectedStatusFilter === 'transit') return s === 'shipped' || s === 'in transit' || s === 'dispatched';
        if (selectedStatusFilter === 'delivered') return s === 'delivered' || s === 'completed';
        if (selectedStatusFilter === 'cancelled') return s === 'cancelled' || s === 'refunded';
        return true;
      });
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(order => {
        const id = String(order.id || '').toLowerCase();
        const address = JSON.stringify(order.shippingAddress || order.shipping_address || '').toLowerCase();
        const items = JSON.stringify(order.items || order.items_json || '').toLowerCase();
        return id.includes(q) || address.includes(q) || items.includes(q);
      });
    }

    return list;
  }, [ordersList, user, guestFoundOrder, selectedStatusFilter, searchQuery]);

  // Guest order lookup handler
  const handleGuestLookup = (e) => {
    e.preventDefault();
    if (!guestOrderId.trim()) {
      showToast('Please enter your Order ID (e.g. #MB-...)', 'warning');
      return;
    }

    setIsSearchingGuest(true);
    const cleanId = guestOrderId.trim().replace(/^#/, '').toLowerCase();
    const cleanEmail = guestEmail.trim().toLowerCase();

    const match = (ordersList || []).find(ord => {
      const id = String(ord.id || '').toLowerCase().replace(/^#/, '');
      const ordEmail = (ord.customerEmail || ord.customer_email || ord.email || '').toLowerCase();
      
      const idMatch = id.includes(cleanId) || cleanId.includes(id);
      if (cleanEmail) {
        return idMatch && ordEmail === cleanEmail;
      }
      return idMatch;
    });

    setTimeout(() => {
      setIsSearchingGuest(false);
      if (match) {
        setGuestFoundOrder(match);
        setExpandedOrderId(match.id);
        showToast('Confidential order records retrieved!', 'success');
      } else {
        showToast('No matching order found. Please verify Order ID and Email.', 'error');
      }
    }, 400);
  };

  const handleCopyAWB = (awb) => {
    if (navigator.clipboard && awb) {
      navigator.clipboard.writeText(awb);
      showToast('Tracking number copied: ' + awb, 'success');
    }
  };

  const handleBuyAgain = (item) => {
    const product = item.product || {
      id: item.id || item.productId || item.product_id,
      name: item.name || item.title || 'Artisanal Piece',
      price: item.price || 2999,
      image: item.image || '/images/default-toy.jpg'
    };
    addToCart(product, item.quantity || 1);
    showToast('Added ' + product.name + ' to private bag', 'success');
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you wish to cancel this order? This action is discreet and immediate.')) {
      updateOrderStatus(orderId, 'cancelled');
      showToast('Order #' + orderId + ' has been discreetly cancelled', 'info');
    }
  };

  // Helper to parse items safely
  const parseOrderItems = (order) => {
    if (Array.isArray(order.items) && order.items.length > 0) return order.items;
    if (order.items_json) {
      try {
        const parsed = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : order.items_json;
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn('Could not parse items_json', e);
      }
    }
    return [];
  };

  // Helper to format currency
  const formatPrice = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Helper to parse date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently Placed';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return String(dateStr);
    }
  };

  // Progress Stepper Step index calculator
  const getStepIndex = (status) => {
    const s = (status || 'processing').toLowerCase();
    if (s === 'cancelled' || s === 'refunded') return -1;
    if (s === 'delivered' || s === 'completed') return 4;
    if (s === 'shipped' || s === 'in transit' || s === 'dispatched') return 3;
    if (s === 'packed' || s === 'packing') return 2;
    return 1; // Placed / Processing / Pending
  };

  return (
    <div className="min-h-screen bg-[#121316] text-[#EAE0E1] font-sans antialiased pt-28 md:pt-36 pb-32 px-margin-mobile md:px-margin-desktop selection:bg-[#B56571]/30 selection:text-[#B56571]">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D98A92]">
              <button 
                onClick={() => navigateTo('home')} 
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
                Sanctuary Home
              </button>
              <span>/</span>
              <span>Encrypted Orders</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
              <span>My Orders & Plain Tracking</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#B56571]/20 text-[#D98A92] border border-[#B56571]/30">
                {displayedOrders.length} {displayedOrders.length === 1 ? 'Record' : 'Records'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl">
              Real-time unbranded parcel tracking, discreet billing receipts, and end-to-end encrypted dispatch records.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faRotateRight} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Updates'}</span>
            </button>
            <button
              onClick={() => navigateTo('catalog')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B56571] to-[#8A434E] hover:from-[#A33F4D] hover:to-[#732C37] text-white text-xs font-mono uppercase tracking-wider font-bold shadow-lg shadow-[#B56571]/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-white/15"
            >
              <FontAwesomeIcon icon={faBagShopping} />
              <span>Explore Sanctuary</span>
            </button>
          </div>
        </div>

        {/* Privacy & Discretion Promise Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#18191E] via-[#1E1F26] to-[#18191E] border border-[#B56571]/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#B56571]/15 border border-[#B56571]/30 text-[#D98A92] flex items-center justify-center shrink-0 text-xl shadow-inner">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>100% Plain Unbranded Outer Packaging Guaranteed</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  Zero Adult Branding
                </span>
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Shipped as standard goods by <strong>"MB Logistics"</strong> or <strong>"MB* SERVICES LLC"</strong>. No product descriptions visible on box.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 shrink-0">
            <FontAwesomeIcon icon={faShieldHalved} className="text-[#D98A92]" />
            <span>256-Bit SSL Encrypted Logistics</span>
          </div>
        </div>

        {/* Guest Order Lookup Form (Visible if unauthenticated or explicitly tracking guest parcel) */}
        {(!user?.isLoggedIn || guestFoundOrder) && (
          <div className="p-6 rounded-2xl bg-[#18191E] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#D98A92]" />
                <span>Guest Order Rapid Lookup</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">No Login Required</span>
            </div>
            <form onSubmit={handleGuestLookup} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={guestOrderId}
                  onChange={(e) => setGuestOrderId(e.target.value)}
                  placeholder="Enter Order ID (e.g. #MB-172554-9912)"
                  className="w-full bg-[#121316] border border-white/15 focus:border-[#D98A92] text-white text-xs px-4 py-3 rounded-xl outline-none font-mono transition-colors"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Order Email Address (Optional)"
                  className="w-full bg-[#121316] border border-white/15 focus:border-[#D98A92] text-white text-xs px-4 py-3 rounded-xl outline-none transition-colors"
                />
              </div>
              <div className="sm:col-span-3 flex gap-2">
                <button
                  type="submit"
                  disabled={isSearchingGuest}
                  className="flex-1 bg-[#B56571] hover:bg-[#A33F4D] text-white py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSearchingGuest ? 'Searching...' : 'Track Parcel'}
                </button>
                {guestFoundOrder && (
                  <button
                    type="button"
                    onClick={() => {
                      setGuestFoundOrder(null);
                      setGuestOrderId('');
                    }}
                    className="px-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs border border-white/10 transition-colors cursor-pointer"
                    title="Clear filter"
                  >
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Filter and Search Navigation Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Status Tab Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs font-mono">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'transit', label: 'In Transit' },
              { id: 'processing', label: 'Processing' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusFilter(tab.id)}
                className={'px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ' + (
                  selectedStatusFilter === tab.id
                    ? 'bg-[#B56571] text-white font-bold shadow-md shadow-[#B56571]/20'
                    : 'bg-[#18191E] text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[260px]">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, item, city..."
              className="w-full bg-[#18191E] border border-white/10 focus:border-[#D98A92] text-xs text-white pl-9 pr-8 py-2.5 rounded-xl outline-none transition-colors placeholder:text-neutral-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs cursor-pointer"
              >
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            )}
          </div>
        </div>

        {/* Orders List / Cards */}
        {displayedOrders.length === 0 ? (
          <div className="p-12 md:p-16 rounded-3xl bg-[#18191E]/70 border border-white/10 backdrop-blur-xl text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-[#B56571]/10 border border-[#B56571]/30 text-[#D98A92] flex items-center justify-center mx-auto text-3xl shadow-inner">
              <FontAwesomeIcon icon={faBoxOpen} />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-serif font-bold text-white">No Orders Found</h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                {searchQuery || selectedStatusFilter !== 'all'
                  ? 'No orders match your selected search criteria. Try clearing filters or searching with your order number.'
                  : 'You have not placed any discreet orders yet. Discover our curated catalog of medical-grade artisanal pleasure instruments.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {(searchQuery || selectedStatusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatusFilter('all');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => navigateTo('catalog')}
                className="px-6 py-2.5 rounded-xl bg-[#B56571] hover:bg-[#A33F4D] text-white text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-lg shadow-[#B56571]/20 cursor-pointer"
              >
                Browse Curated Catalog
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedOrders.map((order, idx) => {
              const items = parseOrderItems(order);
              const status = (order.status || 'processing').toLowerCase();
              const stepIndex = getStepIndex(status);
              const isExpanded = expandedOrderId === order.id || displayedOrders.length === 1;
              const awbNumber = order.awb || order.tracking_number || ('MB-IND-' + String(order.id || '9876').slice(-4) + '-EXP');
              const courier = order.courier || 'BlueDart Discreet Express';
              const totalAmount = order.total_amount || order.total || order.subtotal || 0;
              const shippingAddr = order.shippingAddress || order.shipping_address || {};

              // Status color configurations
              let statusBadgeBg = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
              let statusLabel = 'Processing & Plain Packing';
              let statusIcon = faClock;

              if (status === 'shipped' || status === 'in transit' || status === 'dispatched') {
                statusBadgeBg = 'bg-sky-500/15 text-sky-300 border-sky-500/30';
                statusLabel = 'In Transit with Courier';
                statusIcon = faTruckFast;
              } else if (status === 'delivered' || status === 'completed') {
                statusBadgeBg = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                statusLabel = 'Delivered Discreetly';
                statusIcon = faCircleCheck;
              } else if (status === 'cancelled' || status === 'refunded') {
                statusBadgeBg = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
                statusLabel = 'Cancelled';
                statusIcon = faBan;
              }

              return (
                <div
                  key={order.id || idx}
                  className="rounded-3xl bg-[#18191E]/95 border border-white/10 hover:border-[#B56571]/40 transition-all duration-300 shadow-2xl overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="p-5 sm:p-6 bg-white/[0.02] border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#B56571]/15 text-[#D98A92] flex items-center justify-center border border-[#B56571]/30 text-base">
                        <FontAwesomeIcon icon={faBoxOpen} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-mono font-bold text-white tracking-wide">
                            #{order.id}
                          </span>
                          <span className={'px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1.5 ' + statusBadgeBg}>
                            <FontAwesomeIcon icon={statusIcon} className="text-[10px]" />
                            <span>{statusLabel}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-400 font-light mt-0.5">
                          <span>Placed on {formatDate(order.created_at || order.createdAt || order.date)}</span>
                          <span>•</span>
                          <span className="font-mono text-[#D98A92] font-semibold">
                            {items.reduce((sum, it) => sum + (it.quantity || 1), 0)} items
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Total & Controls */}
                    <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                      <div className="text-left md:text-right">
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                          Total Amount
                        </span>
                        <span className="text-lg sm:text-xl font-mono font-bold text-white">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveReceiptOrder(order)}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono uppercase text-neutral-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="View Digital Invoice"
                        >
                          <FontAwesomeIcon icon={faReceipt} />
                          <span className="hidden sm:inline">Receipt</span>
                        </button>

                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className="p-2 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors flex items-center justify-center cursor-pointer"
                          aria-label="Toggle Details"
                        >
                          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4-Step Visual Progress Stepper (Only for active non-cancelled orders) */}
                  {stepIndex > 0 && (
                    <div className="px-6 py-6 bg-[#131418] border-b border-white/5">
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10 -z-0">
                          <div
                            className="h-full bg-gradient-to-r from-[#B56571] to-[#D98A92] transition-all duration-700"
                            style={{ width: (Math.max(0, (stepIndex - 1) / 3 * 100)) + '%' }}
                          />
                        </div>

                        {/* Stepper Points */}
                        <div className="grid grid-cols-4 relative z-10 text-center">
                          {/* Step 1: Confirmed */}
                          <div className="flex flex-col items-center space-y-2">
                            <div className={'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ' + (
                              stepIndex >= 1
                                ? 'bg-[#B56571] text-white shadow-md shadow-[#B56571]/40 border-2 border-white/30'
                                : 'bg-[#18191E] text-neutral-500 border border-white/10'
                            )}>
                              <FontAwesomeIcon icon={stepIndex > 1 ? faCircleCheck : faBoxOpen} />
                            </div>
                            <div>
                              <span className="block text-[11px] font-bold text-white">Confirmed</span>
                              <span className="hidden sm:block text-[10px] text-neutral-400">Order verified</span>
                            </div>
                          </div>

                          {/* Step 2: Plain Packaging */}
                          <div className="flex flex-col items-center space-y-2">
                            <div className={'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ' + (
                              stepIndex >= 2
                                ? 'bg-[#B56571] text-white shadow-md shadow-[#B56571]/40 border-2 border-white/30'
                                : 'bg-[#18191E] text-neutral-500 border border-white/10'
                            )}>
                              <FontAwesomeIcon icon={stepIndex > 2 ? faCircleCheck : faLock} />
                            </div>
                            <div>
                              <span className="block text-[11px] font-bold text-white">Plain Packing</span>
                              <span className="hidden sm:block text-[10px] text-neutral-400">Discreet box sealed</span>
                            </div>
                          </div>

                          {/* Step 3: Courier In Transit */}
                          <div className="flex flex-col items-center space-y-2">
                            <div className={'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ' + (
                              stepIndex >= 3
                                ? 'bg-[#B56571] text-white shadow-md shadow-[#B56571]/40 border-2 border-white/30'
                                : 'bg-[#18191E] text-neutral-500 border border-white/10'
                            )}>
                              <FontAwesomeIcon icon={stepIndex > 3 ? faCircleCheck : faTruckFast} />
                            </div>
                            <div>
                              <span className="block text-[11px] font-bold text-white">In Transit</span>
                              <span className="hidden sm:block text-[10px] text-neutral-400">Express logistics</span>
                            </div>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className="flex flex-col items-center space-y-2">
                            <div className={'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ' + (
                              stepIndex >= 4
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/40 border-2 border-white/30'
                                : 'bg-[#18191E] text-neutral-500 border border-white/10'
                            )}>
                              <FontAwesomeIcon icon={faCircleCheck} />
                            </div>
                            <div>
                              <span className="block text-[11px] font-bold text-white">Delivered</span>
                              <span className="hidden sm:block text-[10px] text-neutral-400">Private handover</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Live AWB Details Strip */}
                      <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-neutral-400">Logistics Carrier:</span>
                          <span className="font-semibold text-white">{courier}</span>
                          <span className="text-neutral-600">•</span>
                          <span className="text-neutral-400">AWB Tracking No:</span>
                          <button
                            onClick={() => handleCopyAWB(awbNumber)}
                            className="font-mono text-[#D98A92] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 px-2 py-0.5 rounded border border-white/10"
                            title="Click to copy tracking code"
                          >
                            <span>{awbNumber}</span>
                            <FontAwesomeIcon icon={faCopy} className="text-[10px]" />
                          </button>
                        </div>
                        <div className="text-neutral-400 text-[11px] font-mono">
                          Est. Arrival: <strong className="text-emerald-300">2 - 4 Business Days</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expanded Detailed Items & Delivery Section */}
                  {isExpanded && (
                    <div className="p-6 space-y-6">
                      {/* Items Grid */}
                      <div className="space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#D98A92] font-bold">
                          Ordered Items ({items.length})
                        </span>

                        <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                          {items.map((item, iIdx) => {
                            const itemPrice = item.price || item.product?.price || 0;
                            const itemQty = item.quantity || 1;
                            const itemName = item.name || item.title || item.product?.name || 'Artisanal Pleasure Piece';
                            const itemImg = item.image || item.product?.image || '/images/default-toy.jpg';
                            const itemCat = item.category || item.product?.category || 'Wellness';

                            return (
                              <div
                                key={iIdx}
                                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 relative flex items-center justify-center">
                                    <img
                                      src={itemImg}
                                      alt={itemName}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=300';
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D98A92] font-bold px-1.5 py-0.5 rounded bg-[#B56571]/10 border border-[#B56571]/20">
                                      {itemCat}
                                    </span>
                                    <h4 className="text-sm font-bold text-white">{itemName}</h4>
                                    <p className="text-xs text-neutral-400 font-mono">
                                      Qty: {itemQty} × {formatPrice(itemPrice)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                  <span className="text-sm font-mono font-bold text-white">
                                    {formatPrice(itemPrice * itemQty)}
                                  </span>
                                  <button
                                    onClick={() => handleBuyAgain(item)}
                                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#B56571] text-neutral-300 hover:text-white text-xs font-mono uppercase tracking-wider font-semibold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                                  >
                                    <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
                                    <span>Buy Again</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Delivery Address & Confidential Billing Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Plain Delivery Destination */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D98A92] font-bold">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span>Plain Delivery Destination</span>
                          </div>
                          <div className="text-xs text-neutral-300 space-y-1 font-light">
                            <p className="font-bold text-white">
                              {shippingAddr.receiverName || shippingAddr.fullName || shippingAddr.name || user?.name || 'Sanctuary Member'}
                            </p>
                            <p>{shippingAddr.addressLine1 || shippingAddr.address || 'Confidential Delivery Destination'}</p>
                            {shippingAddr.addressLine2 && <p>{shippingAddr.addressLine2}</p>}
                            <p>
                              {[shippingAddr.city, shippingAddr.state, shippingAddr.pincode].filter(Boolean).join(', ') || 'Mumbai, Maharashtra, India'}
                            </p>
                            {(shippingAddr.phone || user?.phone) && (
                              <p className="font-mono text-neutral-400">Phone: {shippingAddr.phone || user?.phone}</p>
                            )}
                          </div>
                        </div>

                        {/* Confidential Billing & Payment Summary */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D98A92] font-bold">
                            <FontAwesomeIcon icon={faShieldHalved} />
                            <span>Confidential Billing Descriptor</span>
                          </div>
                          <div className="text-xs text-neutral-300 space-y-1 font-light">
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Payment Mode:</span>
                              <span className="font-mono font-bold text-emerald-400 uppercase">
                                {order.payment_method || order.paymentMethod || 'Cash on Delivery (COD)'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Bank Statement Entry:</span>
                              <span className="font-mono text-white">"MB* SERVICES LLC"</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Packaging Type:</span>
                              <span className="font-mono text-emerald-300">Plain Kraft Outer Box</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-white/10 font-bold text-white">
                              <span>Grand Total:</span>
                              <span className="font-mono text-base text-[#D98A92]">{formatPrice(totalAmount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Order Actions (Cancel order / Support) */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <FontAwesomeIcon icon={faCircleInfo} className="text-[#D98A92]" />
                          <span>Need help with this order? Our support team responds discreetly within 2 hours.</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigateTo('contact')}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono uppercase text-neutral-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faHeadset} />
                            <span>Contact Support</span>
                          </button>

                          {(status === 'processing' || status === 'placed' || status === 'pending') && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-mono uppercase font-bold border border-rose-500/30 transition-all cursor-pointer active:scale-95"
                            >
                              <FontAwesomeIcon icon={faBan} className="mr-1.5" />
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Confidential Printable Receipt Modal */}
        {activeReceiptOrder && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#18191E] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
              
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D98A92] font-bold">
                    Official Confidential Invoice
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mt-1">
                    Receipt #{activeReceiptOrder.id}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Date: {formatDate(activeReceiptOrder.created_at || activeReceiptOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setActiveReceiptOrder(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Itemized Breakdown</span>
                <div className="space-y-2 divide-y divide-white/5 text-xs font-light">
                  {parseOrderItems(activeReceiptOrder).map((item, idx) => {
                    const price = item.price || item.product?.price || 0;
                    const qty = item.quantity || 1;
                    return (
                      <div key={idx} className="pt-2 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-white">{item.name || item.title || 'Artisanal Piece'}</p>
                          <p className="text-[11px] font-mono text-neutral-400">Qty: {qty} × {formatPrice(price)}</p>
                        </div>
                        <span className="font-mono font-bold text-white">{formatPrice(price * qty)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span>{formatPrice(activeReceiptOrder.total_amount || activeReceiptOrder.total || 0)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Plain Express Courier:</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Discreet Tax Descriptor:</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white">
                  <span>Total Paid:</span>
                  <span className="text-[#D98A92]">{formatPrice(activeReceiptOrder.total_amount || activeReceiptOrder.total || 0)}</span>
                </div>
              </div>

              {/* Confidential Footnote */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-neutral-400 space-y-1">
                <p>
                  <strong>Descriptor:</strong> This purchase appears as <em>"MB* SERVICES LLC"</em> on bank records.
                </p>
                <p>
                  <strong>Packaging:</strong> Outer container contains zero branding or reference to product contents.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPrint} />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setActiveReceiptOrder(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#B56571] hover:bg-[#A33F4D] text-white text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
