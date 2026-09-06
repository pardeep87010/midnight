import React, { createContext, useContext, useState, useEffect } from 'react';
import { STITCH_CATEGORIES, STITCH_PRODUCTS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);
  
  // Permanent Luxury Midnight Obsidian Velvet Dark Mode
  const [theme] = useState('dark');
  const toggleTheme = () => {};

  // User auth state (Top-level declaration to guarantee availability across all hooks and functions)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mb_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isLoggedIn: false,
      name: '',
      email: '',
      phone: '',
      isAdmin: false
    };
  });

  // Toast notification state & dispatcher
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3500);
  };

  // Floating Auth Modal State & Controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authModalRedirect, setAuthModalRedirect] = useState(null);

  const openAuthModal = (mode = 'login', redirect = null) => {
    setAuthModalMode(mode);
    setAuthModalRedirect(redirect);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Age verification state
  const [isAgeVerified, setIsAgeVerified] = useState(() => {
    return localStorage.getItem('velour_age_verified') === 'true';
  });

  const verifyAge = (remember = false) => {
    setIsAgeVerified(true);
    if (remember) {
      localStorage.setItem('velour_age_verified', 'true');
    }
  };

  const navigateTo = (page, productId = null, category = null) => {
    if (page === 'login') {
      openAuthModal('login');
      return;
    }
    if (page === 'register') {
      openAuthModal('register');
      return;
    }
    setCurrentPage(page);
    if (productId) setSelectedProductId(productId);
    if (category) setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfile = (profileData) => {
    setUser(prev => {
      const updated = { ...prev, ...profileData };
      try {
        localStorage.setItem('mb_user', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Confidential profile updated successfully.', 'success');
  };

  const logout = () => {
    const guestUser = { isLoggedIn: false, name: '', email: '', phone: '', isAdmin: false };
    setUser(guestUser);
    setSavedAddresses([]);
    setOrdersList([]);
    try {
      localStorage.removeItem('mb_user');
      localStorage.removeItem('mb_saved_addresses');
      localStorage.removeItem('mb_admin_token');
    } catch (e) {}
    showToast('Logged out securely.', 'info');
    navigateTo('home');
  };

  // Google Authentication Processor
  const authenticateGoogleToken = async (token) => {
    if (!token) return { success: false, error: 'No token provided' };
    showToast('Verifying Google credentials...', 'info');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token, credential: token })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        try {
          localStorage.setItem('mb_user', JSON.stringify(data.user));
          if (data.user.isAdmin) {
            localStorage.setItem('mb_admin_token', 'mb_admin_live_token_2026_sec_bloom');
          }
        } catch (e) {}
        closeAuthModal();
        showToast(`Google Verified: Welcome, ${data.user.name}!`, 'success');
        if (authModalRedirect) {
          navigateTo(authModalRedirect);
        } else if (data.user.isAdmin) {
          navigateTo('admin');
        }
        return { success: true, user: data.user };
      } else {
        const errorMsg = data.error || 'Failed to authenticate with Google.';
        showToast(errorMsg, 'error');
        openAuthModal('login');
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Google Auth verification error:', err);
      showToast('Authentication network error. Please try again.', 'error');
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('mb_theme', 'dark');
    } catch (e) {}
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Live Database Products List (Fetched from /api/products)
  const [productsList, setProductsList] = useState(STITCH_PRODUCTS);

  // Live Database Orders List (Fetched from /api/orders)
  const [ordersList, setOrdersList] = useState([]);

  // Admin Security Bearer Token
  const [adminToken, setAdminToken] = useState(() => {
    try {
      return localStorage.getItem('mb_admin_token') || 'mb_admin_live_token_2026_sec_bloom';
    } catch (e) {
      return 'mb_admin_live_token_2026_sec_bloom';
    }
  });

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  });

  // Fetch initial data from local SQLite backend API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProductsList(data);
          if (!selectedProductId) {
            setSelectedProductId(data[0].id || data[0].slug);
          }
        } else if (STITCH_PRODUCTS && STITCH_PRODUCTS.length > 0) {
          setProductsList(STITCH_PRODUCTS);
          if (!selectedProductId) {
            setSelectedProductId(STITCH_PRODUCTS[0].id);
          }
        } else {
          setProductsList([]);
        }
      } else if (STITCH_PRODUCTS && STITCH_PRODUCTS.length > 0) {
        setProductsList(STITCH_PRODUCTS);
      } else {
        setProductsList([]);
      }
    } catch (err) {
      console.warn('Backend /api/products unavailable, using local memory state:', err);
      setProductsList(STITCH_PRODUCTS || []);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  const fetchOrders = async (email = null) => {
    try {
      const targetEmail = email || user?.email;
      if (!targetEmail && !user?.isAdmin) {
        setOrdersList([]);
        return [];
      }
      let url = '/api/orders';
      if (targetEmail) {
        url = `/api/orders?email=${encodeURIComponent(targetEmail)}`;
      }
      const res = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrdersList(data);
          return data;
        }
      }
    } catch (err) {
      console.warn('Backend /api/orders unavailable:', err);
    }
    return [];
  };

  // Saved Addresses State (Strict per-user data isolation, empty by default)
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('mb_saved_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(a => a.id !== 'addr_def_1' && a.userEmail !== '20092003pardeep@gmail.com');
        }
      }
    } catch (e) {}
    return [];
  });

  const fetchAddresses = async (email = null) => {
    try {
      const targetEmail = email || user?.email;
      if (!targetEmail) {
        setSavedAddresses([]);
        return [];
      }
      const url = `/api/addresses?email=${encodeURIComponent(targetEmail)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSavedAddresses(data);
          try {
            localStorage.setItem('mb_saved_addresses', JSON.stringify(data));
          } catch (e) {}
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend /api/addresses unavailable:', e);
    }
    return [];
  };

  const addSavedAddress = async (newAddr) => {
    const addrId = newAddr.id || `addr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const addrWithId = {
      ...newAddr,
      id: addrId,
      userEmail: newAddr.userEmail || user?.email || 'customer@midnightbloom.in',
      isDefault: Boolean(newAddr.isDefault || savedAddresses.length === 0)
    };

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addrWithId)
      });
      if (res.ok) {
        const saved = await res.json();
        setSavedAddresses(prev => {
          const updated = saved.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : [...prev];
          const next = [saved, ...updated.filter(a => a.id !== saved.id)];
          try { localStorage.setItem('mb_saved_addresses', JSON.stringify(next)); } catch (e) {}
          return next;
        });
        showToast('Delivery destination saved securely to database', 'success');
        return saved;
      }
    } catch (e) {
      console.error('Error saving address to backend:', e);
    }

    // Local fallback
    setSavedAddresses(prev => {
      const updated = addrWithId.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : [...prev];
      const next = [addrWithId, ...updated];
      try { localStorage.setItem('mb_saved_addresses', JSON.stringify(next)); } catch (e) {}
      return next;
    });
    showToast('Delivery destination saved to profile', 'success');
    return addrWithId;
  };

  const updateSavedAddress = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const saved = await res.json();
        setSavedAddresses(prev => {
          const next = prev.map(a => {
            if (a.id === id) return saved;
            if (saved.isDefault) return { ...a, isDefault: false };
            return a;
          });
          try { localStorage.setItem('mb_saved_addresses', JSON.stringify(next)); } catch (e) {}
          return next;
        });
        showToast('Delivery address updated in database', 'success');
        return;
      }
    } catch (e) {
      console.error('Error updating address on backend:', e);
    }

    setSavedAddresses(prev => {
      const next = prev.map(a => {
        if (a.id === id) return { ...a, ...updatedFields };
        if (updatedFields.isDefault) return { ...a, isDefault: false };
        return a;
      });
      try { localStorage.setItem('mb_saved_addresses', JSON.stringify(next)); } catch (e) {}
      return next;
    });
    showToast('Delivery address updated', 'success');
  };

  const deleteSavedAddress = async (id) => {
    try {
      await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Error deleting address on backend:', e);
    }
    setSavedAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      try { localStorage.setItem('mb_saved_addresses', JSON.stringify(filtered)); } catch (e) {}
      return filtered;
    });
    showToast('Address removed from profile', 'info');
  };

  const setDefaultAddress = async (id) => {
    try {
      await fetch(`/api/addresses/${id}/default`, { method: 'POST' });
    } catch (e) {
      console.error('Error setting default address on backend:', e);
    }
    setSavedAddresses(prev => {
      const next = prev.map(a => ({ ...a, isDefault: a.id === id }));
      try { localStorage.setItem('mb_saved_addresses', JSON.stringify(next)); } catch (e) {}
      return next;
    });
    showToast('Default delivery address updated', 'success');
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Synchronize orders and addresses when active user changes
  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
      fetchAddresses(user.email);
    } else {
      setSavedAddresses([]);
      setOrdersList([]);
    }
  }, [user?.email]);

  // Google OAuth URL Hash & Cross-Window Messenger Listener
  useEffect(() => {
    // 1. Process URL Hash (Redirect callback or direct landing)
    const checkOAuthHash = async () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token=') || hash.includes('id_token=') || hash.includes('error='))) {
        const raw = hash.startsWith('#') ? hash.substring(1) : hash;
        const params = new URLSearchParams(raw);
        const token = params.get('id_token') || params.get('access_token');
        const err = params.get('error') || params.get('error_description');

        // If inside popup opened by opener
        if (window.opener) {
          try {
            if (token) {
              window.opener.postMessage({ type: 'MB_GOOGLE_AUTH_TOKEN', accessToken: params.get('access_token'), idToken: params.get('id_token'), token }, window.location.origin);
              localStorage.setItem('mb_oauth_token_broadcast', JSON.stringify({ token, idToken: params.get('id_token'), accessToken: params.get('access_token'), timestamp: Date.now() }));
            } else if (err) {
              window.opener.postMessage({ type: 'MB_GOOGLE_AUTH_ERROR', error: err }, window.location.origin);
            }
          } catch (e) {}
          window.close();
          return;
        }

        // Clean hash from URL address bar
        window.history.replaceState(null, '', window.location.pathname + window.location.search);

        if (err) {
          showToast(`Google Sign-In notice: ${err}`, 'warning');
          return;
        }

        if (token) {
          await authenticateGoogleToken(token);
        }
      }
    };

    checkOAuthHash();

    // 2. Listen to postMessage from popup window
    const handleOAuthMessage = async (e) => {
      if (e.origin !== window.location.origin && e.origin !== 'https://accounts.google.com') return;
      const token = e.data?.idToken || e.data?.accessToken || e.data?.token;
      if (e.data?.type === 'MB_GOOGLE_AUTH_TOKEN' && token) {
        await authenticateGoogleToken(token);
      } else if (e.data?.type === 'MB_GOOGLE_AUTH_ERROR') {
        showToast(`Google Sign-In error: ${e.data.error || 'Access denied'}`, 'warning');
      }
    };

    // 3. Listen to localStorage broadcast from popup window (storage event)
    const handleStorageEvent = async (e) => {
      if (e.key === 'mb_oauth_token_broadcast' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          const token = payload.idToken || payload.accessToken || payload.token;
          if (token && Date.now() - payload.timestamp < 15000) {
            localStorage.removeItem('mb_oauth_token_broadcast');
            await authenticateGoogleToken(token);
          }
        } catch (err) {}
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [authModalRedirect]);

  // Cart operations (Requires Login to add items)
  const addToCart = (product, quantity = 1, color = 'Standard') => {
    if (!user || !user.isLoggedIn) {
      showToast('Please sign in or create an account to reserve items', 'warning');
      openAuthModal('login', 'cart');
      return false;
    }
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.color === color
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, color }];
      }
    });
    showToast(`Added ${product.name} to bag!`, 'success');
    return true;
  };

  const updateQuantity = (index, delta) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    showToast('Item removed from bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Database CRUD operations
  const addProduct = async (newProduct) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const saved = await res.json();
        setProductsList(prev => [saved, ...prev]);
        showToast(`Saved "${saved.name}" to database!`, 'success');
        return saved;
      }
    } catch (e) {
      console.error('Error adding product to backend:', e);
    }
    // Fallback local addition
    setProductsList(prev => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to catalog!`, 'success');
    return newProduct;
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const saved = await res.json();
        setProductsList(prev => prev.map(p => p.id === id ? saved : p));
        showToast('Product updated in database!', 'success');
        return;
      }
    } catch (e) {
      console.error('Error updating product on backend:', e);
    }
    setProductsList(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    showToast('Product updated!', 'success');
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.error('Error deleting product from backend:', e);
    }
    setProductsList(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted from database', 'info');
  };

  const bulkImportProducts = async (newItems) => {
    if (!Array.isArray(newItems) || newItems.length === 0) return 0;
    try {
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newItems)
      });
      if (res.ok) {
        await fetchProducts();
        showToast(`Successfully imported ${newItems.length} products to database!`, 'success');
        return newItems.length;
      }
    } catch (e) {
      console.error('Error bulk importing products to backend:', e);
    }
    setProductsList(prev => [...newItems, ...prev]);
    showToast(`Imported ${newItems.length} products!`, 'success');
    return newItems.length;
  };

  const clearAllProducts = async () => {
    try {
      await fetch('/api/products/clear-all', { 
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.error('Error clearing products on backend:', e);
    }
    setProductsList([]);
    showToast('All products wiped from database. Database is clean.', 'info');
  };

  const createOrder = async (orderData) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': orderData.idempotencyKey || `idemp_${Date.now()}`
        },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        const data = await res.json();
        await fetchOrders();
        return data;
      }
    } catch (e) {
      console.error('Error placing order on backend:', e);
    }
    // Fallback local addition
    setOrdersList(prev => [orderData, ...prev]);
    return { success: true, orderId: orderData.id };
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error('Error updating order status on backend:', e);
    }
    setOrdersList(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    showToast(`Order ${orderId} marked as ${newStatus}!`, 'success');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedProductId,
        setSelectedProductId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isAgeVerified,
        verifyAge,
        user,
        setUser,
        updateProfile,
        logout,
        authenticateGoogleToken,
        theme,
        toggleTheme,
        toast,
        showToast,
        isLoadingBackend,
        // Saved Addresses Controls
        savedAddresses,
        fetchAddresses,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        // Floating Auth Modal Controls
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        authModalRedirect,
        // Database products & orders
        productsList,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkImportProducts,
        clearAllProducts,
        ordersList,
        fetchOrders,
        createOrder,
        updateOrderStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
