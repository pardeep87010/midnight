import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBoxOpen,
  faBox,
  faFileCsv, 
  faPlus, 
  faTrash, 
  faPenToSquare, 
  faMagnifyingGlass, 
  faDownload, 
  faUpload, 
  faCheckCircle, 
  faTruck, 
  faLock, 
  faXmark, 
  faShieldHalved, 
  faArrowRight, 
  faBolt, 
  faEnvelope, 
  faRotateRight, 
  faEye, 
  faKey, 
  faDatabase, 
  faGlobe, 
  faCreditCard, 
  faPaperPlane, 
  faCheck,
  faSliders,
  faServer,
  faTag,
  faChartPie,
  faPrint,
  faUserCheck,
  faWarehouse,
  faReceipt,
  faPhone,
  faSun,
  faMoon,
  faUsers,
  faUserGear,
  faCalendarDay,
  faCalendarWeek,
  faAward,
  faCrown,
  faCoins,
  faClock,
  faLocationDot,
  faFilter,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { STITCH_CATEGORIES } from '../data/mockData';
import { CDN_CONFIG, handleImageError } from '../utils/cdnCache';
import { eventBus } from '../services/eventBus';
import { notificationService } from '../services/notificationService';
import { 
  validateName, 
  validatePositiveNumber, 
  sanitizeText, 
  validateEmail 
} from '../utils/validation';

export const AdminPanel = () => {
  const { 
    productsList, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    bulkImportProducts, 
    clearAllProducts,
    fetchProducts,
    ordersList, 
    fetchOrders,
    updateOrderStatus, 
    navigateTo, 
    showToast,
    theme,
    toggleTheme,
    user,
    setUser
  } = useApp();

  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // If not logged in as the special admin, render Admin Gate Login
  if (!user?.isLoggedIn || !user?.isAdmin || user?.email !== '20092003pardeep@gmail.com') {
    const handleAdminUnlock = async (e) => {
      e.preventDefault();
      setIsAuthenticating(true);
      const cleanEmail = adminEmailInput.trim().toLowerCase();
      const cleanPass = adminPasswordInput.trim();

      if (cleanEmail === '20092003pardeep@gmail.com' && cleanPass === 'Kumar870') {
        const adminUser = {
          name: 'Pardeep Kumar',
          email: '20092003pardeep@gmail.com',
          tier: 'Super Admin',
          points: 9999,
          maxPoints: 9999,
          isLoggedIn: true,
          isAdmin: true,
          role: 'admin'
        };
        setUser(adminUser);
        try {
          localStorage.setItem('mb_user', JSON.stringify(adminUser));
          localStorage.setItem('mb_admin_token', 'mb_admin_live_token_2026_sec_bloom');
        } catch (err) {}
        showToast('Super Admin authenticated successfully.', 'success');
      } else {
        showToast('Access Denied: Invalid administrator credentials.', 'error');
      }
      setIsAuthenticating(false);
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-28 bg-[#FAF7F5] dark:bg-[#121316] font-sans">
        <div className="w-full max-w-md bg-white dark:bg-[#16171C] border border-[#B56571]/30 dark:border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#B56571]/15 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center text-xl">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#181617] dark:text-white">Admin Portal Gate</h2>
            <p className="text-xs text-[#7A696C] dark:text-neutral-400">Strictly restricted to authorized administrative personnel.</p>
          </div>

          <form onSubmit={handleAdminUnlock} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#5C4F52] dark:text-neutral-300 block mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="20092003pardeep@gmail.com"
                className="w-full bg-[#FAF7F5] dark:bg-[#1F2026] border border-[#B56571]/25 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-[#181617] dark:text-white font-mono focus:outline-none focus:border-[#B56571]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#5C4F52] dark:text-neutral-300 block mb-1">Master Password</label>
              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#FAF7F5] dark:bg-[#1F2026] border border-[#B56571]/25 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-[#181617] dark:text-white font-mono focus:outline-none focus:border-[#B56571]"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full btn-gold py-3.5 rounded-full font-bold uppercase tracking-wider text-xs text-white shadow-xl cursor-pointer"
            >
              {isAuthenticating ? 'Verifying Credentials...' : 'Unlock Admin Portal'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-xs text-[#7A696C] hover:text-[#181617] dark:text-neutral-400 dark:hover:text-white underline cursor-pointer"
            >
              Return to Sanctuary Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('products'); // 'products', 'inventory', 'orders', 'coupons', 'events', 'env-config', 'csv-import'
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Pagination for 20-item chunking in Admin
  const [adminPage, setAdminPage] = useState(1);
  const adminPageSize = 20;

  // Modal State for Add / Edit Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productErrors, setProductErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    category: 'vibrators',
    subcategory: 'Bullet Vibrators',
    price: 2499,
    originalPrice: 3299,
    discount: '25% OFF',
    badge: 'Best Seller',
    stock: 45,
    subtitle: '',
    description: '',
    sound: '< 28 dB (Whisper Silent)',
    material: '100% Medical Liquid Silicone',
    battery: '120 min USB Rechargeable',
    waterproof: 'IPX7 100% Submersible',
    modes: '10 Speeds & Patterns',
    images: '',
    colors: 'Midnight Onyx:#1C1C1C, Rose Gold:#C5A880'
  });

  // Coupons Manager State (Fetched from backend database)
  const [coupons, setCoupons] = useState([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(1999);

  // Shipping Label Print Modal State
  const [printOrder, setPrintOrder] = useState(null);

  // CSV Import State
  const [csvFile, setCsvFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [importStatus, setImportStatus] = useState(null);

  // Event Bus & Notification Monitoring State
  const [eventLogs, setEventLogs] = useState([]);
  const [eventFilter, setEventFilter] = useState('all'); // 'all' | 'errors' | 'email' | 'auth' | 'payments'
  const [isRefreshingEvents, setIsRefreshingEvents] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [previewEmail, setPreviewEmail] = useState(null);

  // In-app luxury confirmation & inspector modals (No browser alert/confirm)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Confirm', isDanger: false });
  const [inspectPayloadModal, setInspectPayloadModal] = useState({ isOpen: false, title: '', payload: null });

  // Live ENV & API Keys State (Loaded securely from authenticated backend + local cache fallback)
  const [envConfig, setEnvConfig] = useState(() => {
    try {
      const cached = localStorage.getItem('mb_env_config');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ACTIVE_PAYMENT_GATEWAY: 'pay0_std',
          PAY0_STD_USER_TOKEN: '',
          PAY0_STD_SECRET_KEY: '',
          PAY0_STD_WEBHOOK_URL: '',
          PAY0_STD_REDIRECT_URL: '',
          PAY0_PRO_USER_TOKEN: '',
          PAY0_PRO_SECRET_KEY: '',
          PAY0_PRO_WEBHOOK_URL: '',
          PAY0_PRO_REDIRECT_URL: '',
          EMAIL_PROVIDER: 'resend',
          RESEND_API_KEY: (typeof atob !== 'undefined' ? atob('cmVfYWhtUHpENUVfQWhlNXV3ZEprdWpZNmJNR25wY21uZWFr') : ''),
          SMTP_HOST: 'smtp.resend.com',
          SMTP_PORT: '587',
          SMTP_USER: 'resend',
          SMTP_PASS: '',
          FROM_EMAIL: 'Midnight Bloom <orders@playnixclub.bet>',
          ADMIN_ALERT_EMAIL: '20092003pardeep@gmail.com',
          DATABASE_URL: '',
          REDIS_URL: '',
          CDN_DOMAIN: 'https://cdn.midnightbloom.com',
          EDGE_CACHE_POLICY: 'public, max-age=31536000, immutable',
          ...parsed
        };
      }
    } catch (e) {}
    return {
      ACTIVE_PAYMENT_GATEWAY: 'pay0_std',
      PAY0_STD_USER_TOKEN: '',
      PAY0_STD_SECRET_KEY: '',
      PAY0_STD_WEBHOOK_URL: '',
      PAY0_STD_REDIRECT_URL: '',
      PAY0_PRO_USER_TOKEN: '',
      PAY0_PRO_SECRET_KEY: '',
      PAY0_PRO_WEBHOOK_URL: '',
      PAY0_PRO_REDIRECT_URL: '',
      EMAIL_PROVIDER: 'resend',
      RESEND_API_KEY: (typeof atob !== 'undefined' ? atob('cmVfYWhtUHpENUVfQWhlNXV3ZEprdWpZNmJNR25wY21uZWFr') : ''),
      SMTP_HOST: 'smtp.resend.com',
      SMTP_PORT: '587',
      SMTP_USER: 'resend',
      SMTP_PASS: '',
      FROM_EMAIL: 'Midnight Bloom <orders@playnixclub.bet>',
      ADMIN_ALERT_EMAIL: '20092003pardeep@gmail.com',
      DATABASE_URL: '',
      REDIS_URL: '',
      CDN_DOMAIN: 'https://cdn.midnightbloom.com',
      EDGE_CACHE_POLICY: 'public, max-age=31536000, immutable'
    };
  });

  // Securely fetch active server configuration on admin access
  useEffect(() => {
    if (activeTab === 'env-config') {
      fetch('/api/config', {
        headers: {
          'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object') {
          setEnvConfig(prev => {
            const merged = { ...prev, ...data };
            // Ensure RESEND_API_KEY is not erased if server returns empty or missing key
            if (!merged.RESEND_API_KEY && prev.RESEND_API_KEY) {
              merged.RESEND_API_KEY = prev.RESEND_API_KEY;
            }
            return merged;
          });
        }
      })
      .catch(err => console.warn('Config fetch notice:', err));
    }
  }, [activeTab]);

  const [testEmailRecipient, setTestEmailRecipient] = useState('20092003pardeep@gmail.com');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  // ==========================================
  // EMAIL TEMPLATES & MARKETING CAMPAIGNS STATE
  // ==========================================
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('new_product');
  const [emailPreviewHtml, setEmailPreviewHtml] = useState('');
  const [emailPreviewSubject, setEmailPreviewSubject] = useState('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewDeviceMode, setPreviewDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [emailCampaignRecipient, setEmailCampaignRecipient] = useState('20092003pardeep@gmail.com');
  const [emailCustomMessage, setEmailCustomMessage] = useState('Engineered with 100% medical-grade velvet liquid silicone, WhisperQuiet™ acoustic dampening (<35dB), and IPX8 submersible waterproofing.');
  const [emailDiscountCode, setEmailDiscountCode] = useState('VIPDROP15');
  const [emailSelectedProduct, setEmailSelectedProduct] = useState('');
  const [isSendingTemplateEmail, setIsSendingTemplateEmail] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const fetchEmailPreview = async (templateType = selectedEmailTemplate) => {
    setIsLoadingPreview(true);
    try {
      const activeProd = productsList.find(p => p.id === emailSelectedProduct) || productsList[0] || {
        name: 'The Royale Dual Rabbit Vibrator',
        subtitle: 'Whisper-Quiet Dual Motor Luxury Massager',
        price: 4999,
        originalPrice: 6499,
        images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80']
      };

      const res = await fetch('/api/admin/preview-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        },
        body: JSON.stringify({
          templateType,
          sampleData: {
            productName: activeProd.name,
            subtitle: activeProd.subtitle || activeProd.name,
            price: activeProd.price,
            originalPrice: activeProd.originalPrice,
            image: Array.isArray(activeProd.images) && activeProd.images.length > 0 ? activeProd.images[0] : '',
            customMessage: emailCustomMessage,
            discountCode: emailDiscountCode
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailPreviewHtml(data.html);
        setEmailPreviewSubject(data.subject);
      }
    } catch (err) {
      console.warn('Failed to load email preview:', err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'email-templates') {
      fetchEmailPreview(selectedEmailTemplate);
    }
  }, [activeTab, selectedEmailTemplate, emailSelectedProduct, emailCustomMessage, emailDiscountCode]);

  const handleSendSampleTemplate = async () => {
    if (!emailCampaignRecipient || !emailCampaignRecipient.includes('@')) {
      showToast('Please enter a valid recipient email address', 'warning');
      return;
    }
    setIsSendingTemplateEmail(true);
    try {
      const activeProd = productsList.find(p => p.id === emailSelectedProduct) || productsList[0];
      const res = await fetch('/api/admin/send-template-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        },
        body: JSON.stringify({
          templateType: selectedEmailTemplate,
          recipientEmail: emailCampaignRecipient.trim(),
          customData: {
            productName: activeProd?.name,
            subtitle: activeProd?.subtitle,
            price: activeProd?.price,
            image: Array.isArray(activeProd?.images) && activeProd.images.length > 0 ? activeProd.images[0] : '',
            customMessage: emailCustomMessage,
            discountCode: emailDiscountCode
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'success');
      } else {
        showToast(data.error || 'Failed to dispatch sample template email.', 'error');
      }
    } catch (err) {
      showToast('Error sending email: ' + err.message, 'error');
    } finally {
      setIsSendingTemplateEmail(false);
    }
  };

  const handleBroadcastCampaign = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Broadcast Email Campaign',
      message: `Are you sure you want to broadcast the "${selectedEmailTemplate}" campaign to all registered members in your database?`,
      confirmText: 'Broadcast Now',
      isDanger: false,
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        setIsBroadcasting(true);
        try {
          const activeProd = productsList.find(p => p.id === emailSelectedProduct) || productsList[0];
          const res = await fetch('/api/admin/broadcast-marketing-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
            },
            body: JSON.stringify({
              campaignType: selectedEmailTemplate,
              product: {
                name: activeProd?.name,
                subtitle: activeProd?.subtitle,
                price: activeProd?.price,
                originalPrice: activeProd?.originalPrice,
                image: Array.isArray(activeProd?.images) && activeProd.images.length > 0 ? activeProd.images[0] : ''
              },
              customMessage: emailCustomMessage,
              discountCode: emailDiscountCode,
              customSubject: emailPreviewSubject
            })
          });

          const data = await res.json();
          if (res.ok && data.success) {
            showToast(data.message, 'success');
          } else {
            showToast(data.error || 'Failed to execute broadcast.', 'error');
          }
        } catch (err) {
          showToast('Broadcast error: ' + err.message, 'error');
        } finally {
          setIsBroadcasting(false);
        }
      }
    });
  };

  const handleSaveEnvConfig = async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('mb_env_config', JSON.stringify(envConfig));
      
      // Sync to backend SQLite database
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        },
        body: JSON.stringify(envConfig)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }

      showToast('Live environment configurations & API keys securely saved & synced!', 'success');
      eventBus.publish('ENV_CONFIG_UPDATED', { updatedBy: 'Admin', timestamp: new Date().toISOString() });
    } catch (err) {
      showToast('Failed to sync config with server: ' + err.message, 'error');
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailRecipient || !testEmailRecipient.includes('@')) {
      showToast('Please enter a valid recipient email address', 'warning');
      return;
    }
    setIsSendingTestEmail(true);
    try {
      const response = await fetch('/api/admin/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        },
        body: JSON.stringify({ toEmail: testEmailRecipient })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast(`Live test email dispatched to ${testEmailRecipient}! (Resend ID: ${data.id})`, 'success');
        const dummyOrder = {
          id: 'TEST-' + Math.floor(1000 + Math.random() * 9000),
          customerName: 'Executive VIP Member',
          customerEmail: testEmailRecipient,
          totalAmount: 4999,
          items: [{ product: { name: 'The Royale Dual Rabbit Vibrator' }, quantity: 1 }],
          shippingMethod: 'Discreet Express (Plain Box)'
        };
        await notificationService.sendOrderReceipt(dummyOrder);
        setSentNotifications(notificationService.getNotifications());
      } else {
        showToast(data.error || 'Failed to dispatch live email. Please check your RESEND_API_KEY.', 'error');
      }
    } catch (err) {
      showToast('Failed to dispatch test notification: ' + err.message, 'error');
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Fetch Coupons from Database
  const fetchAdminCoupons = async () => {
    setIsLoadingCoupons(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        headers: {
          'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCoupons(data);
        }
      }
    } catch (err) {
      console.warn('Failed to load coupons:', err);
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode.trim()) {
      showToast('Please enter a promo coupon code.', 'warning');
      return;
    }
    const cleanCode = newCouponCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (cleanCode.length < 3) {
      showToast('Coupon code must be at least 3 characters.', 'warning');
      return;
    }
    const percentVal = parseInt(newCouponPercent);
    if (isNaN(percentVal) || percentVal < 1 || percentVal > 90) {
      showToast('Discount percent must be between 1% and 90%.', 'warning');
      return;
    }
    const minOrderVal = parseInt(newCouponMinOrder);
    if (isNaN(minOrderVal) || minOrderVal < 0) {
      showToast('Minimum order amount must be 0 or greater.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        },
        body: JSON.stringify({
          code: cleanCode,
          discountPercent: percentVal,
          minOrder: minOrderVal
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Created new VIP promo code: ${cleanCode}!`, 'success');
        setNewCouponCode('');
        fetchAdminCoupons();
      } else {
        showToast(data.error || 'Failed to create coupon code.', 'error');
      }
    } catch (err) {
      showToast('Error creating coupon: ' + err.message, 'error');
    }
  };

  const toggleCoupon = async (code) => {
    try {
      const res = await fetch(`/api/admin/coupons/${code}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'info');
        setCoupons(prev => prev.map(c => c.code === code ? { ...c, isActive: data.isActive } : c));
      } else {
        showToast(data.error || 'Failed to update coupon status.', 'error');
      }
    } catch (err) {
      showToast('Error updating coupon', 'error');
    }
  };

  // ==========================================
  // USERS & CUSTOMERS DIRECTORY STATE & API HANDLERS
  // ==========================================
  const [adminUsers, setAdminUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    limit: 20,
    totalUsers: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [usersSummary, setUsersSummary] = useState({
    totalUsers: 0,
    googleUsers: 0,
    emailUsers: 0,
    todayUsers: 0,
    thisWeekUsers: 0,
    totalLTV: 0
  });
  const [usersSearch, setUsersSearch] = useState('');
  const [usersDateFilter, setUsersDateFilter] = useState('all'); // 'all', 'today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month'
  const [usersAuthProvider, setUsersAuthProvider] = useState('all'); // 'all', 'google', 'email'
  const [usersTierFilter, setUsersTierFilter] = useState('all');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Deep User Details Modal
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
  const [userModalTab, setUserModalTab] = useState('orders'); // 'orders', 'addresses', 'activity', 'edit'
  const [editUserForm, setEditUserForm] = useState({ name: '', phone: '', tier: 'Silver Member', points: 200 });
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  // Fetch Users with 20 per page load balancing
  const fetchAdminUsers = async (
    page = usersPagination.page,
    search = usersSearch,
    dateFilter = usersDateFilter,
    authProvider = usersAuthProvider,
    tier = usersTierFilter
  ) => {
    setIsLoadingUsers(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: '20',
        search: search.trim(),
        dateFilter,
        authProvider,
        tier
      });

      const res = await fetch(`/api/admin/users?${queryParams.toString()}`, {
        headers: {
          'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminUsers(data.users || []);
        setUsersPagination(data.pagination || { page: 1, limit: 20, totalUsers: 0, totalPages: 1 });
        if (data.summary) {
          setUsersSummary(data.summary);
        }
      } else {
        showToast(data.error || 'Failed to fetch registered users list', 'error');
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Sync users when entering Users tab or when filters change
  useEffect(() => {
    if (activeTab === 'users') {
      fetchAdminUsers(1, usersSearch, usersDateFilter, usersAuthProvider, usersTierFilter);
    }
  }, [activeTab, usersDateFilter, usersAuthProvider, usersTierFilter]);

  // View Deep User Details & Orders
  const handleViewUserDetails = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedUserDetail(data);
        setUserModalTab('orders');
        setEditUserForm({
          name: data.user.name || '',
          phone: data.user.phone || '',
          tier: data.user.tier || 'Silver Member',
          points: data.user.points || 200
        });
        setIsUserDetailModalOpen(true);
      } else {
        showToast(data.error || 'Could not load user profile details', 'error');
      }
    } catch (err) {
      showToast('Failed to load user details', 'error');
    }
  };

  // Update User Tier / Privileges
  const handleUpdateUserSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserDetail?.user?.id) return;
    setIsUpdatingUser(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUserDetail.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        },
        body: JSON.stringify(editUserForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`User ${editUserForm.name} updated successfully!`, 'success');
        setSelectedUserDetail(prev => ({
          ...prev,
          user: { ...prev.user, ...editUserForm }
        }));
        fetchAdminUsers(usersPagination.page);
        setUserModalTab('orders');
      } else {
        showToast(data.error || 'Failed to update user', 'error');
      }
    } catch (err) {
      showToast('Error updating user privileges', 'error');
    } finally {
      setIsUpdatingUser(false);
    }
  };

  // Delete User with safety confirmation
  const handleDeleteUser = (u) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Member: ${u.name}`,
      message: `Are you sure you want to permanently delete registered member "${u.name}" (${u.email})? This action cannot be reversed.`,
      confirmText: 'Delete User',
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users/${u.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
              'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
            }
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast(data.message || 'User removed from database', 'info');
            setIsUserDetailModalOpen(false);
            fetchAdminUsers(usersPagination.page);
          } else {
            showToast(data.error || 'Could not delete user', 'error');
          }
        } catch (err) {
          showToast('Error deleting user', 'error');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Synchronize orders, users, coupons when switching tabs
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'coupons') {
      fetchAdminCoupons();
    } else if (activeTab === 'users') {
      fetchAdminUsers(1, usersSearch, usersDateFilter, usersAuthProvider, usersTierFilter);
    } else if (activeTab === 'events') {
      refreshEventData();
    }
  }, [activeTab]);

  const refreshEventData = async () => {
    setIsRefreshingEvents(true);
    try {
      const res = await fetch('/api/events?limit=250', {
        headers: {
          'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
          'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
        }
      });
      if (res.ok) {
        const serverEvents = await res.json();
        if (Array.isArray(serverEvents)) {
          const formatted = serverEvents.map(evt => {
            let parsedPayload = evt.payload_json;
            try {
              if (typeof evt.payload_json === 'string') parsedPayload = JSON.parse(evt.payload_json);
            } catch (e) {}

            let summary = '';
            if (parsedPayload) {
              summary = parsedPayload.error || parsedPayload.reason || parsedPayload.message || parsedPayload.resendError || '';
              if (!summary && parsedPayload.email) {
                summary = `Email: ${parsedPayload.email}${parsedPayload.type ? ` (${parsedPayload.type})` : ''}`;
              } else if (!summary && parsedPayload.to) {
                summary = `To: ${parsedPayload.to}${parsedPayload.subject ? ` • ${parsedPayload.subject}` : ''}`;
              } else if (!summary && parsedPayload.userId) {
                summary = `User ID: ${parsedPayload.userId}${parsedPayload.name ? ` (${parsedPayload.name})` : ''}`;
              } else if (!summary && parsedPayload.orderId) {
                summary = `Order ID: ${parsedPayload.orderId}`;
              }
            }

            return {
              eventId: evt.id,
              eventType: evt.event_type,
              idempotencyKey: evt.idempotency_key,
              status: evt.status ? evt.status.toUpperCase() : 'DELIVERED',
              timestamp: evt.created_at || new Date().toISOString(),
              summary: summary || '—',
              payload: parsedPayload
            };
          });
          setEventLogs(formatted);
          setSentNotifications(notificationService.getNotifications());
          setIsRefreshingEvents(false);
          return;
        }
      }
    } catch (e) {}
    setEventLogs(eventBus.getLogs());
    setSentNotifications(notificationService.getNotifications());
    setIsRefreshingEvents(false);
  };

  const handleClearLogs = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Activity & Error Logs',
      message: 'Are you sure you want to permanently clear all activity and error logs from the database? This cannot be undone.',
      confirmText: 'Clear All Logs',
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch('/api/events', {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer mb_admin_live_token_2026_sec_bloom',
              'x-admin-token': 'mb_admin_live_token_2026_sec_bloom'
            }
          });
          if (res.ok) {
            showToast('All activity & error logs cleared successfully.', 'success');
            refreshEventData();
          } else {
            showToast('Failed to clear logs.', 'error');
          }
        } catch (e) {
          showToast('Failed to clear logs.', 'error');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  useEffect(() => {
    refreshEventData();
    const interval = setInterval(refreshEventData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProductErrors({});
    setFormData({
      name: '',
      category: 'vibrators',
      subcategory: 'Bullet Vibrators',
      price: 2499,
      originalPrice: 3299,
      discount: '25% OFF',
      badge: 'New Release',
      stock: 50,
      subtitle: 'Discreet luxury intimate wellness instrument',
      description: 'Crafted from body-safe medical silicone with whisper-quiet motor.',
      sound: '< 28 dB',
      material: '100% Medical Liquid Silicone',
      battery: '120 min USB',
      waterproof: 'IPX7 Waterproof',
      modes: '10 Modes',
      images: '/product-images/LELO%20Mona%20Wave%20Dual-Motor%20G-Spot%20Wand_0.webp',
      colors: 'Midnight Onyx:#1C1C1C, Rose Gold:#C5A880'
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (prod) => {
    setEditingProductId(prod.id);
    setProductErrors({});
    setFormData({
      name: prod.name || '',
      category: prod.category || 'vibrators',
      subcategory: prod.subcategory || '',
      price: prod.price || 0,
      originalPrice: prod.originalPrice || 0,
      discount: prod.discount || '',
      badge: prod.badge || '',
      stock: prod.stock || Math.floor(Math.random() * 40) + 15,
      subtitle: prod.subtitle || '',
      description: prod.description || '',
      sound: prod.specs?.sound || '< 30 dB',
      material: prod.specs?.material || '100% Medical Silicone',
      battery: prod.specs?.battery || '90 min USB',
      waterproof: prod.specs?.waterproof || 'IPX7 Waterproof',
      modes: prod.specs?.modes || '10 Speeds',
      images: Array.isArray(prod.images) ? prod.images.join('\n') : '',
      colors: Array.isArray(prod.colors) 
        ? prod.colors.map(c => `${typeof c === 'object' ? c.name : c}:${typeof c === 'object' ? c.hex : '#B56571'}`).join(', ') 
        : 'Midnight Onyx:#1C1C1C'
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const errors = {};

    const nameCheck = validateName(formData.name, 'Product Title');
    if (!nameCheck.isValid) errors.name = nameCheck.error;

    const priceCheck = validatePositiveNumber(formData.price, 'Selling Price', false);
    if (!priceCheck.isValid) errors.price = priceCheck.error;

    const origPriceCheck = validatePositiveNumber(formData.originalPrice, 'Original Price', true);
    if (!origPriceCheck.isValid) errors.originalPrice = origPriceCheck.error;

    const stockCheck = validatePositiveNumber(formData.stock, 'Stock Units', true);
    if (!stockCheck.isValid) errors.stock = stockCheck.error;

    if (Object.keys(errors).length > 0) {
      setProductErrors(errors);
      showToast(Object.values(errors)[0], 'warning');
      return;
    }

    setProductErrors({});

    const imagesArr = formData.images
      .split(/[\n,;]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const colorsArr = formData.colors
      .split(/[,;]/)
      .map(pair => {
        const [cName, cHex] = pair.split(':');
        return {
          name: (cName || 'Standard').trim(),
          hex: (cHex && cHex.trim().startsWith('#')) ? cHex.trim() : '#FFFFFF'
        };
      })
      .filter(c => c.name.length > 0);

    const productPayload = {
      name: sanitizeText(formData.name),
      category: formData.category,
      subcategory: sanitizeText(formData.subcategory),
      price: priceCheck.value,
      originalPrice: origPriceCheck.value,
      discount: sanitizeText(formData.discount),
      badge: sanitizeText(formData.badge),
      stock: parseInt(stockCheck.value),
      subtitle: sanitizeText(formData.subtitle),
      description: sanitizeText(formData.description),
      images: imagesArr.length > 0 ? imagesArr : ['/product-images/LELO%20Mona%20Wave%20Dual-Motor%20G-Spot%20Wand_0.webp'],
      colors: colorsArr.length > 0 ? colorsArr : [{ name: 'Midnight Onyx', hex: '#1C1C1C' }],
      specs: {
        sound: formData.sound,
        material: formData.material,
        battery: formData.battery,
        waterproof: formData.waterproof,
        modes: formData.modes
      }
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  // Handle CSV File Upload
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length <= 1) {
        showToast('The uploaded file contains no readable product rows. Please review our sample template.', 'warning');
        return;
      }

      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        // Robust CSV column parser handling quoted strings
        const row = [];
        let cur = '';
        let inQuotes = false;
        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            if (inQuotes && line[j + 1] === '"') {
              cur += '"';
              j++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            row.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        row.push(cur.trim());

        if (row.length < 3 || !row[0]) continue;

        const name = row[0] || `Product ${i}`;
        const category = row[1] || 'vibrators';
        const subcategory = row[2] || 'Luxury Instruments';
        const price = parseFloat(row[3]) || 2499;
        const originalPrice = parseFloat(row[4]) || Math.round(price * 1.25);
        const discount = row[5] || '20% OFF';
        const badge = row[6] || 'Featured';
        const stock = parseInt(row[7]) || 45;
        const subtitle = row[8] || 'Luxury intimate wellness instrument';
        const description = row[9] || 'Engineered with whisper-quiet motor and medical-grade materials.';
        const sound = row[10] || '< 28 dB';
        const material = row[11] || '100% Medical Liquid Silicone';
        const battery = row[12] || '120 min USB';
        const waterproof = row[13] || 'IPX7 Waterproof';
        const modes = row[14] || '10 Modes';
        const rawImages = row[15] || '';
        const rawColors = row[16] || '';

        const images = rawImages 
          ? rawImages.split(/[;|]/).map(s => s.trim()).filter(s => s.length > 0)
          : ['/product-images/LELO%20Mona%20Wave%20Dual-Motor%20G-Spot%20Wand_0.webp'];

        const colors = rawColors
          ? rawColors.split(',').map(pair => {
              const [cName, cHex] = pair.split(':');
              return {
                name: (cName || 'Midnight Onyx').trim(),
                hex: (cHex && cHex.trim().startsWith('#')) ? cHex.trim() : '#1C1C1C'
              };
            }).filter(c => c.name.length > 0)
          : [{ name: 'Midnight Onyx', hex: '#1C1C1C' }, { name: 'Rose Gold', hex: '#B76E79' }];

        parsed.push({
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name,
          category,
          subcategory,
          price,
          originalPrice,
          discount,
          badge,
          stock,
          subtitle,
          description,
          rating: 5.0,
          reviewsCount: Math.floor(Math.random() * 150) + 10,
          images: images.length > 0 ? images : ['/product-images/LELO%20Mona%20Wave%20Dual-Motor%20G-Spot%20Wand_0.webp'],
          colors: colors.length > 0 ? colors : [{ name: 'Midnight Onyx', hex: '#1C1C1C' }],
          specs: { sound, material, battery, waterproof, modes }
        });
      }

      setParsedRows(parsed);
      showToast(`Parsed ${parsed.length} products from CSV. Click Import to add to catalog!`, 'success');
    };
    reader.readAsText(file);
  };

  const handleExecuteBulkImport = async () => {
    if (parsedRows.length === 0) return;
    await bulkImportProducts(parsedRows);
    setParsedRows([]);
    setCsvFile(null);
    setActiveTab('products');
  };

  const adminFilteredProducts = productsList.filter(prod => {
    if (categoryFilter !== 'all' && prod.category !== categoryFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return prod.name?.toLowerCase().includes(q) || prod.subcategory?.toLowerCase().includes(q);
    }
    return true;
  });

  // 20-item chunking slice for Admin Table
  const totalAdminPages = Math.ceil(adminFilteredProducts.length / adminPageSize) || 1;
  const paginatedAdminProducts = adminFilteredProducts.slice((adminPage - 1) * adminPageSize, adminPage * adminPageSize);

  const totalRevenue = ordersList.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="pt-24 md:pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-32 space-y-8 font-sans bg-[#FAF7F5] dark:bg-[#090A0E] text-[#181617] dark:text-neutral-100 antialiased transition-colors">
      
      {/* 1. Header Bar with Clean Responsive Dark & Light Styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08] dark:border-neutral-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#A33F4D] dark:bg-[#D98A92] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#7A696C] dark:text-neutral-400 font-bold">
              ENTERPRISE PLATFORM CONSOLE • INR EDITION
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-[#181617] dark:text-white font-sans font-bold tracking-tight">
            Midnight Bloom Executive Portal
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer transition-all shadow-md active:scale-95"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>Add Single Item</span>
          </button>

          <button
            onClick={() => setActiveTab('csv-import')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs ${
              activeTab === 'csv-import'
                ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black font-bold'
                : 'bg-white dark:bg-[#18181B] hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#181617] dark:text-white border border-[#B56571]/25 dark:border-neutral-700'
            }`}
          >
            <FontAwesomeIcon icon={faFileCsv} className={activeTab === 'csv-import' ? 'text-white dark:text-black' : 'text-[#A33F4D] dark:text-neutral-400'} />
            <span>Bulk CSV</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs ${
              activeTab === 'coupons'
                ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black font-bold'
                : 'bg-white dark:bg-[#18181B] hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#181617] dark:text-white border border-[#B56571]/25 dark:border-neutral-700'
            }`}
          >
            <FontAwesomeIcon icon={faTag} className={activeTab === 'coupons' ? 'text-white dark:text-black' : 'text-[#A33F4D] dark:text-white'} />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs ${
              activeTab === 'events'
                ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black font-bold'
                : 'bg-white dark:bg-[#18181B] hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#181617] dark:text-white border border-[#B56571]/25 dark:border-neutral-700'
            }`}
          >
            <FontAwesomeIcon icon={faBolt} className={activeTab === 'events' ? 'text-white dark:text-black' : 'text-[#A33F4D] dark:text-white'} />
            <span>Event Bus</span>
          </button>

          <button
            onClick={() => setActiveTab('env-config')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs ${
              activeTab === 'env-config'
                ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black font-bold'
                : 'bg-white dark:bg-[#18181B] hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#181617] dark:text-white border border-[#B56571]/25 dark:border-neutral-700'
            }`}
          >
            <FontAwesomeIcon icon={faKey} className={activeTab === 'env-config' ? 'text-white dark:text-black' : 'text-[#A33F4D] dark:text-white'} />
            <span>ENV & Keys</span>
          </button>

          <button
            onClick={toggleTheme}
            className="bg-white dark:bg-[#18181B] hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#A33F4D] dark:text-[#D98A92] border border-[#B56571]/25 dark:border-neutral-700 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Grid in High-Contrast (INR) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 hover:border-[#B56571]/40 dark:hover:border-neutral-700 p-5 rounded-xl space-y-1.5 transition-all shadow-xs">
          <span className="text-[11px] font-mono text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider block font-medium">Gross Orders Volume</span>
          <h3 className="text-2xl font-mono font-bold text-[#181617] dark:text-white tracking-tight">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1 font-medium">
            <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
            <span>Pay0pro Gateway & COD Live</span>
          </span>
        </div>

        <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 hover:border-[#B56571]/40 dark:hover:border-neutral-700 p-5 rounded-xl space-y-1.5 transition-all shadow-xs">
          <span className="text-[11px] font-mono text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider block font-medium">Active Catalog Size</span>
          <h3 className="text-2xl font-mono font-bold text-[#181617] dark:text-white tracking-tight">{productsList.length} Instruments</h3>
          <span className="text-[11px] text-[#5C4F52] dark:text-neutral-300 font-mono">20-Item Edge CDN Loading</span>
        </div>

        <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 hover:border-[#B56571]/40 dark:hover:border-neutral-700 p-5 rounded-xl space-y-1.5 transition-all shadow-xs">
          <span className="text-[11px] font-mono text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider block font-medium">Live Customer Orders</span>
          <h3 className="text-2xl font-mono font-bold text-[#181617] dark:text-white tracking-tight">{ordersList.length} Dispatched</h3>
          <span className="text-[11px] text-[#5C4F52] dark:text-neutral-300 font-mono">100% Plain Packaging (India)</span>
        </div>

        <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 hover:border-[#B56571]/40 dark:hover:border-neutral-700 p-5 rounded-xl space-y-1.5 transition-all shadow-xs">
          <span className="text-[11px] font-mono text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider block font-medium">Event Bus Health</span>
          <h3 className="text-2xl font-mono font-bold text-[#181617] dark:text-white tracking-tight">0 Double Charges</h3>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">Idempotency & Retries Active</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex space-x-2 border-b border-black/[0.08] dark:border-neutral-800 pb-2 overflow-x-auto hide-scrollbar text-xs font-mono">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'products' ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black shadow-md' : 'text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white bg-transparent'
          }`}
        >
          Product Catalog ({productsList.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'orders' ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black shadow-md' : 'text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white bg-transparent'
          }`}
        >
          Orders & Fulfillment ({ordersList.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('users');
            fetchAdminUsers(1);
          }}
          className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'users' ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black shadow-md' : 'text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white bg-transparent'
          }`}
        >
          <FontAwesomeIcon icon={faUsers} />
          <span>Members & Users ({usersSummary.totalUsers || adminUsers.length || 'Directory'})</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'coupons' ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black shadow-md' : 'text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white bg-transparent'
          }`}
        >
          VIP Coupons Engine ({coupons.length})
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'events' ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black shadow-md' : 'text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white bg-transparent'
          }`}
        >
          <FontAwesomeIcon icon={faBolt} />
          <span>Activity & Error Logs ({eventLogs.length})</span>
          {eventLogs.filter(e => e.status === 'ERROR' || e.status === 'FAILED' || e.eventType?.includes('FAIL') || e.eventType?.includes('ERROR')).length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {eventLogs.filter(e => e.status === 'ERROR' || e.status === 'FAILED' || e.eventType?.includes('FAIL') || e.eventType?.includes('ERROR')).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('csv-import')}
          className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'csv-import' ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black shadow-md' : 'text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white bg-transparent'
          }`}
        >
          Excel / CSV Importer
        </button>

        <button
          onClick={() => {
            setActiveTab('email-templates');
            fetchEmailPreview(selectedEmailTemplate);
          }}
          className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'email-templates' ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black shadow-md' : 'text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white bg-transparent'
          }`}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <span>Email Templates & Broadcast</span>
        </button>

        <button
          onClick={() => setActiveTab('env-config')}
          className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'env-config' ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black shadow-md' : 'text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white bg-transparent'
          }`}
        >
          <FontAwesomeIcon icon={faKey} />
          <span>ENV & API Keys</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT CATALOG MANAGEMENT (WITH STOCK & INVENTORY) */}
      {activeTab === 'products' && (
        <div className="space-y-5 animate-fade-in font-sans">
          
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-[#0D0D11] p-3.5 rounded-xl border border-[#B56571]/20 dark:border-neutral-800 shadow-xs">
            <div className="relative flex-1 w-full">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A696C] dark:text-neutral-400 text-xs" />
              <input
                type="text"
                placeholder="Search products by title or subcategory..."
                value={searchFilter}
                onChange={(e) => { setSearchFilter(e.target.value); setAdminPage(1); }}
                className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg pl-9 pr-4 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] dark:focus:border-white font-sans"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs text-[#7A696C] dark:text-neutral-400 font-mono whitespace-nowrap">Department:</span>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setAdminPage(1); }}
                className="bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] dark:focus:border-white font-sans"
              >
                <option value="all">All ({productsList.length})</option>
                {STITCH_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#7A696C] dark:text-neutral-400 font-mono">
            <span>
              Database Items: <strong className="text-[#181617] dark:text-white font-bold">{productsList.length}</strong> | Showing <strong>{(adminPage - 1) * adminPageSize + 1} - {Math.min(adminPage * adminPageSize, adminFilteredProducts.length)}</strong> of <strong>{adminFilteredProducts.length}</strong>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setConfirmModal({
                    isOpen: true,
                    title: 'Wipe Complete Product Database',
                    message: 'Are you sure you want to WIPE ALL PRODUCTS from the database? This will clear all product rows and allow fresh commercial entry.',
                    confirmText: 'Wipe All Products',
                    isDanger: true,
                    onConfirm: () => {
                      clearAllProducts();
                      setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                  });
                }}
                className="px-3 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:text-red-300 dark:border-red-800/50 cursor-pointer font-mono transition-all text-[11px]"
                title="Wipe all products to start with a 100% clean blank database"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1.5" />
                <span>Wipe / Clear Database</span>
              </button>

              <button
                disabled={adminPage === 1}
                onClick={() => setAdminPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-md bg-white hover:bg-[#FAF3F0] text-[#181617] border border-[#B56571]/25 dark:bg-[#18181B] dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-700 disabled:opacity-30 cursor-pointer font-mono transition-all"
              >
                ← Prev 20
              </button>
              <span className="px-2.5 py-1 text-[#181617] dark:text-white font-bold font-mono">{adminPage} / {totalAdminPages}</span>
              <button
                disabled={adminPage === totalAdminPages}
                onClick={() => setAdminPage(p => Math.min(totalAdminPages, p + 1))}
                className="px-3 py-1 rounded-md bg-white hover:bg-[#FAF3F0] text-[#181617] border border-[#B56571]/25 dark:bg-[#18181B] dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-700 disabled:opacity-30 cursor-pointer font-mono transition-all"
              >
                Next 20 →
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0D0D11] rounded-xl overflow-hidden border border-[#B56571]/20 dark:border-neutral-800 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2A2426] dark:text-neutral-300">
                <thead className="bg-[#FAF3F0] dark:bg-[#141418] text-[#181617] dark:text-white font-mono uppercase tracking-wider text-[11px] border-b border-[#B56571]/20 dark:border-neutral-800">
                  <tr>
                    <th className="p-3.5">Image</th>
                    <th className="p-3.5">Product Title</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Price (INR)</th>
                    <th className="p-3.5">Stock / Inventory</th>
                    <th className="p-3.5">Acoustics & Specs</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B56571]/15 dark:divide-neutral-800/80 font-sans">
                  {paginatedAdminProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#FAF3F0] dark:hover:bg-white/[0.04] transition-colors">
                      <td className="p-3.5">
                        <img 
                          src={CDN_CONFIG.getOptimizedImageUrl(prod.images && prod.images[0] ? prod.images[0] : '/placeholder-product.svg')} 
                          alt="thumb" 
                          className="w-11 h-11 rounded-lg object-cover border border-[#B56571]/20 dark:border-neutral-800 bg-[#FAF3F0] dark:bg-black"
                          onError={handleImageError}
                        />
                      </td>
                      <td className="p-3.5">
                        <strong className="text-[#181617] dark:text-white font-semibold block text-sm">{prod.name}</strong>
                        <span className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono">{prod.subcategory}</span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-[#5C4F52] dark:text-neutral-300 uppercase">
                        {prod.category}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#181617] dark:text-white text-sm">
                        ₹{prod.price?.toLocaleString('en-IN')}
                        {prod.originalPrice && (
                          <span className="text-[#7A696C] dark:text-neutral-500 line-through text-xs ml-1 font-normal">₹{prod.originalPrice?.toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-[11px]">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          (prod.stock || 45) < 15 ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {prod.stock || 45} In Stock
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-[#7A696C] dark:text-neutral-400">
                        {prod.specs?.sound || '< 30 dB'} • {prod.specs?.material || 'Medical Silicone'}
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="text-[#7A696C] hover:text-[#181617] dark:text-neutral-400 dark:hover:text-white p-2 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} className="text-sm" />
                        </button>
                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Delete Product Entry',
                              message: `Are you sure you want to delete "${prod.name}"? This action cannot be undone.`,
                              confirmText: 'Delete',
                              isDanger: true,
                              onConfirm: () => {
                                deleteProduct(prod.id);
                                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                              }
                            });
                          }}
                          className="text-[#7A696C] hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 p-2 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & FULFILLMENT MANAGEMENT (ZERO KYC DISCREET DELIVERY) */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 rounded-xl p-6 space-y-6 animate-fade-in font-sans shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08] dark:border-neutral-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#181617] dark:text-white flex items-center space-x-2">
                <FontAwesomeIcon icon={faTruck} className="text-[#A33F4D] dark:text-[#D98A92]" />
                <span>Customer Orders & Discreet Fulfillment</span>
              </h3>
              <p className="text-xs text-[#5C4F52] dark:text-neutral-400 mt-1 font-light">
                Manage Indian customer shipments, 100% anonymous plain packaging dispatch (Zero KYC required), and generate tamper-proof delivery manifests.
              </p>
            </div>

            <button
              onClick={() => {
                fetchOrders();
                showToast('Orders synchronized with live database', 'info');
              }}
              className="bg-white dark:bg-[#18181B] hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#181617] dark:text-white px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-xs border border-[#B56571]/25 dark:border-neutral-700 transition-all active:scale-95"
            >
              <FontAwesomeIcon icon={faRotateRight} />
              <span>Refresh Orders</span>
            </button>
          </div>

          <div className="divide-y divide-[#B56571]/15 dark:divide-neutral-800">
            {ordersList.length === 0 ? (
              <p className="py-8 text-center text-[#7A696C] dark:text-neutral-500 font-mono text-xs">No orders recorded yet.</p>
            ) : (
              ordersList.map((order) => (
                <div key={order.id} className="py-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-mono font-bold text-[#181617] dark:text-white">{order.id}</span>
                      <span className="text-xs text-[#7A696C] dark:text-neutral-400 font-mono">• {order.date}</span>
                      <span className="text-xs text-[#181617] dark:text-white font-medium">{order.customerName} ({order.customerCity})</span>
                      <span className="bg-[#FAF3F0] dark:bg-white/10 text-[#7A696C] dark:text-neutral-300 border border-[#B56571]/20 dark:border-neutral-700 px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1">
                        <FontAwesomeIcon icon={faLock} className="text-[8px] text-[#A33F4D] dark:text-[#C5A880]" />
                        <span>Zero KYC • Anonymous Delivery</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        order.status === 'Delivered' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' :
                        order.status === 'Shipped' ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30' :
                        order.status === 'Processing' ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30' :
                        'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                      }`}>
                        {order.status}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-[#FAF7F5] dark:bg-[#18181B] text-[#181617] dark:text-white border border-[#B56571]/25 dark:border-neutral-700 rounded px-2.5 py-1 text-xs font-mono"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setPrintOrder(order)}
                        className="bg-white hover:bg-[#FAF3F0] text-[#181617] border border-[#B56571]/25 dark:bg-[#18181B] dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-700 px-3 py-1 rounded text-xs font-mono flex items-center space-x-1 cursor-pointer transition-all shadow-xs"
                        title="Print Label"
                      >
                        <FontAwesomeIcon icon={faPrint} />
                        <span>Manifest</span>
                      </button>
                    </div>
                  </div>

                  {/* Items Detail Panel with product images */}
                  <div className="bg-[#FAF7F5] dark:bg-black/50 p-3 rounded-lg border border-[#B56571]/15 dark:border-neutral-800/80 space-y-3">
                    {/* Items List with thumbnails */}
                    <div className="space-y-2">
                      {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          {/* Product Thumbnail */}
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name || 'Product'}
                              className="w-12 h-12 rounded-lg object-cover border border-[#B56571]/20 dark:border-neutral-700 shrink-0 bg-neutral-100 dark:bg-neutral-800"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-[#B56571]/20 dark:border-neutral-700 flex items-center justify-center shrink-0">
                              <FontAwesomeIcon icon={faBox} className="text-[#B56571]/50 text-lg" />
                            </div>
                          )}
                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#181617] dark:text-white truncate">{item.name || 'Luxury Item'}</p>
                            <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono">
                              Qty: {item.quantity || 1}
                              {item.color && item.color !== 'Standard' && <span> • {item.color}</span>}
                              <span className="ml-2 text-[#A33F4D] dark:text-[#D98A92] font-bold">₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                            </p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-xs text-[#7A696C] dark:text-neutral-400 font-mono italic">Item details loading…</p>
                      )}
                    </div>
                    {/* Order Footer: Address + Payment + Total */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#B56571]/15 dark:border-neutral-800/60 text-xs font-mono">
                      <div className="text-[#7A696C] dark:text-neutral-400 truncate">
                        <FontAwesomeIcon icon={faLocationDot} className="mr-1 text-[#A33F4D]/70" />
                        {order.shippingAddress || `${order.customerCity}, ${order.customerState}`}
                      </div>
                      <div className="flex items-center space-x-4 shrink-0">
                        <span className="text-[#7A696C] dark:text-neutral-400">Payment: <strong className="text-[#181617] dark:text-white">{order.paymentMode || order.paymentMethod || 'Cash on Delivery (COD)'}</strong></span>
                        <span className="text-[#181617] dark:text-white font-bold text-sm">Total: ₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VIP COUPONS & PROMO ENGINE */}
      {activeTab === 'coupons' && (
        <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 rounded-xl p-6 space-y-6 animate-fade-in font-sans shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08] dark:border-neutral-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#181617] dark:text-white flex items-center space-x-2">
                <FontAwesomeIcon icon={faTag} className="text-[#A33F4D] dark:text-[#D98A92]" />
                <span>VIP Coupons & Discount Engine</span>
              </h3>
              <p className="text-xs text-[#5C4F52] dark:text-neutral-400 mt-1 font-light">
                Create and manage marketing promo codes for Indian customers with live database usage tracking.
              </p>
            </div>

            <button
              onClick={() => {
                fetchAdminCoupons();
                showToast('VIP coupons synchronized from database', 'info');
              }}
              className="bg-white dark:bg-[#18181B] hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#181617] dark:text-white px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-xs border border-[#B56571]/25 dark:border-neutral-700 transition-all active:scale-95"
            >
              <FontAwesomeIcon icon={faRotateRight} className={isLoadingCoupons ? 'animate-spin' : ''} />
              <span>Refresh Coupons</span>
            </button>
          </div>

          <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#FAF7F5] dark:bg-black/50 p-4 rounded-xl border border-[#B56571]/15 dark:border-neutral-800 items-end">
            <div>
              <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. FESTIVE25"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                className="w-full bg-white dark:bg-[#0D0D11] border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Discount (% Off) *</label>
              <input
                type="number"
                required
                value={newCouponPercent}
                onChange={(e) => setNewCouponPercent(e.target.value)}
                className="w-full bg-white dark:bg-[#0D0D11] border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
              />
            </div>
            <div>
              <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Min Order Value (₹) *</label>
              <input
                type="number"
                required
                value={newCouponMinOrder}
                onChange={(e) => setNewCouponMinOrder(e.target.value)}
                className="w-full bg-white dark:bg-[#0D0D11] border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black px-4 py-2.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
            >
              + Create Coupon
            </button>
          </form>

          <div className="overflow-x-auto border border-[#B56571]/20 dark:border-neutral-800 rounded-lg">
            <table className="w-full text-left text-xs font-mono text-[#2A2426] dark:text-neutral-300">
              <thead className="bg-[#FAF3F0] dark:bg-[#141418] text-[#181617] dark:text-white uppercase text-[11px] border-b border-[#B56571]/20 dark:border-neutral-800">
                <tr>
                  <th className="p-3">Coupon Code</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Min Order Value</th>
                  <th className="p-3">Times Used</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B56571]/15 dark:divide-neutral-800 bg-white dark:bg-black">
                {isLoadingCoupons ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-xs font-mono text-[#7A696C] dark:text-neutral-400">
                      Loading VIP coupons from database...
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-xs font-mono text-[#7A696C] dark:text-neutral-400">
                      No promo coupons created yet. Use the form above to create your first discount code.
                    </td>
                  </tr>
                ) : (
                  coupons.map((c, i) => (
                    <tr key={i} className="hover:bg-[#FAF3F0] dark:hover:bg-white/[0.04] transition-colors">
                      <td className="p-3 font-bold text-[#181617] dark:text-white">{c.code}</td>
                      <td className="p-3">{c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.flatDiscount || 0} OFF`}</td>
                      <td className="p-3">₹{c.minOrder?.toLocaleString('en-IN')}</td>
                      <td className="p-3">{c.usageCount || 0} orders</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.isActive ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30'
                        }`}>
                          {c.isActive ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => toggleCoupon(c.code)}
                          className="text-[#A33F4D] dark:text-[#D98A92] hover:underline cursor-pointer font-bold"
                        >
                          {c.isActive ? 'Pause' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: EVENT BUS & NOTIFICATIONS AUDIT LOGS */}
      {activeTab === 'events' && (
        <div className="space-y-6 animate-fade-in font-sans">
          <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 rounded-xl p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08] dark:border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#181617] dark:text-white flex items-center space-x-2">
                  <FontAwesomeIcon icon={faBolt} className="text-[#A33F4D] dark:text-[#D98A92]" />
                  <span>Real-Time Activity, System & Error Logs</span>
                </h3>
                <p className="text-xs text-[#5C4F52] dark:text-neutral-400 mt-0.5 font-light">
                  Live audit trail tracking all user activities, OTP verification dispatches, transactional emails, and system errors in real time.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearLogs}
                  disabled={eventLogs.length === 0}
                  className="bg-white dark:bg-[#18181B] hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border border-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5"
                  title="Clear All Logs"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Clear Logs</span>
                </button>

                <button
                  onClick={refreshEventData}
                  disabled={isRefreshingEvents}
                  className="bg-white dark:bg-[#18181B] hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#181617] dark:text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border border-[#B56571]/25 dark:border-neutral-700 shadow-xs transition-all flex items-center space-x-1.5"
                  title="Refresh Logs"
                >
                  <FontAwesomeIcon icon={faRotateRight} className={isRefreshingEvents ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            {(() => {
              const errCount = eventLogs.filter(e => e.status === 'ERROR' || e.status === 'FAILED' || e.eventType?.includes('FAIL') || e.eventType?.includes('ERROR')).length;
              const emCount = eventLogs.filter(e => e.eventType?.includes('EMAIL') || e.eventType?.includes('OTP')).length;
              const auCount = eventLogs.filter(e => e.eventType?.includes('AUTH') || e.eventType?.includes('USER') || e.eventType?.includes('LOGIN')).length;
              const payCount = eventLogs.filter(e => e.eventType?.includes('PAY') || e.eventType?.includes('ORDER')).length;

              const filtered = eventLogs.filter(evt => {
                if (eventFilter === 'errors') {
                  return evt.status === 'ERROR' || evt.status === 'FAILED' || evt.eventType?.includes('FAIL') || evt.eventType?.includes('ERROR');
                }
                if (eventFilter === 'email') {
                  return evt.eventType?.includes('EMAIL') || evt.eventType?.includes('OTP');
                }
                if (eventFilter === 'auth') {
                  return evt.eventType?.includes('AUTH') || evt.eventType?.includes('USER') || evt.eventType?.includes('LOGIN');
                }
                if (eventFilter === 'payments') {
                  return evt.eventType?.includes('PAY') || evt.eventType?.includes('ORDER');
                }
                return true;
              });

              return (
                <>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="text-[#7A696C] dark:text-neutral-400 font-mono text-[11px] flex items-center gap-1 mr-1">
                      <FontAwesomeIcon icon={faFilter} className="text-[10px]" /> Filter:
                    </span>
                    <button
                      onClick={() => setEventFilter('all')}
                      className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                        eventFilter === 'all' 
                          ? 'bg-[#181617] text-white dark:bg-white dark:text-black font-bold' 
                          : 'bg-[#FAF3F0] dark:bg-neutral-800 text-[#5C4F52] dark:text-neutral-300 hover:text-[#181617]'
                      }`}
                    >
                      All ({eventLogs.length})
                    </button>
                    <button
                      onClick={() => setEventFilter('errors')}
                      className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        eventFilter === 'errors' 
                          ? 'bg-red-600 text-white font-bold' 
                          : 'bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
                      <span>Errors & Failures ({errCount})</span>
                    </button>
                    <button
                      onClick={() => setEventFilter('email')}
                      className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                        eventFilter === 'email' 
                          ? 'bg-[#A33F4D] text-white font-bold' 
                          : 'bg-[#FAF3F0] dark:bg-neutral-800 text-[#5C4F52] dark:text-neutral-300 hover:text-[#181617]'
                      }`}
                    >
                      ✉️ Email & OTP ({emCount})
                    </button>
                    <button
                      onClick={() => setEventFilter('auth')}
                      className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                        eventFilter === 'auth' 
                          ? 'bg-[#A33F4D] text-white font-bold' 
                          : 'bg-[#FAF3F0] dark:bg-neutral-800 text-[#5C4F52] dark:text-neutral-300 hover:text-[#181617]'
                      }`}
                    >
                      👤 Auth & Users ({auCount})
                    </button>
                    <button
                      onClick={() => setEventFilter('payments')}
                      className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                        eventFilter === 'payments' 
                          ? 'bg-[#A33F4D] text-white font-bold' 
                          : 'bg-[#FAF3F0] dark:bg-neutral-800 text-[#5C4F52] dark:text-neutral-300 hover:text-[#181617]'
                      }`}
                    >
                      💳 Payments ({payCount})
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-[#B56571]/20 dark:border-neutral-800 rounded-lg">
                    <table className="w-full text-left text-xs text-[#2A2426] dark:text-neutral-300 font-mono">
                      <thead className="bg-[#FAF3F0] dark:bg-[#141418] text-[#181617] dark:text-white uppercase tracking-wider text-[11px] border-b border-[#B56571]/20 dark:border-neutral-800">
                        <tr>
                          <th className="p-3">Event ID</th>
                          <th className="p-3">Topic / Type</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Summary / Message</th>
                          <th className="p-3">Timestamp</th>
                          <th className="p-3 text-right">Payload</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#B56571]/15 dark:divide-neutral-800 bg-white dark:bg-black text-[11px]">
                        {filtered.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-[#7A696C] dark:text-neutral-500 font-sans">
                              {eventFilter === 'errors' 
                                ? '🎉 No errors recorded! Everything is running smoothly.' 
                                : 'No events matching filter. User activities, email dispatches, and system events will appear here in real time.'}
                            </td>
                          </tr>
                        ) : (
                          filtered.map((evt, idx) => {
                            const isError = evt.status === 'ERROR' || evt.status === 'FAILED' || evt.eventType?.includes('FAIL') || evt.eventType?.includes('ERROR');
                            return (
                              <tr key={idx} className={`transition-colors ${isError ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-[#FAF3F0] dark:hover:bg-white/[0.04]'}`}>
                                <td className="p-3 text-[#7A696C] dark:text-neutral-400 font-mono text-[10px]">{evt.eventId}</td>
                                <td className="p-3 font-bold text-[#181617] dark:text-white">
                                  <span className={`px-2 py-0.5 rounded border text-[10px] ${
                                    isError 
                                      ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30 font-bold' 
                                      : 'bg-[#FAF3F0] dark:bg-neutral-800 border-[#B56571]/20 dark:border-neutral-700 text-[#A33F4D] dark:text-[#D98A92]'
                                  }`}>
                                    {evt.eventType}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isError ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30' :
                                    evt.status === 'DELIVERED' || evt.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' :
                                    evt.status === 'DUPLICATE_IGNORED' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30' :
                                    'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                                  }`}>
                                    {evt.status}
                                  </span>
                                </td>
                                <td className="p-3 text-[11px] max-w-sm truncate" title={evt.summary}>
                                  {isError ? (
                                    <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5 truncate">
                                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-xs shrink-0" />
                                      <span className="truncate">{evt.summary}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[#5C4F52] dark:text-neutral-300 truncate">{evt.summary}</span>
                                  )}
                                </td>
                                <td className="p-3 text-[#7A696C] dark:text-neutral-500 whitespace-nowrap">
                                  {new Date(evt.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => setInspectPayloadModal({
                                      isOpen: true,
                                      title: `Event Payload: ${evt.eventType || 'Event Data'}`,
                                      payload: evt.payload
                                    })}
                                    className="text-[#A33F4D] dark:text-[#D98A92] hover:underline font-bold text-xs cursor-pointer"
                                  >
                                    Inspect
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="border-b border-black/[0.08] dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-[#181617] dark:text-white flex items-center space-x-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#A33F4D] dark:text-[#D98A92]" />
                <span>Dispatched Confidential Notifications Log</span>
              </h3>
              <p className="text-xs text-[#5C4F52] dark:text-neutral-400 mt-0.5 font-light">
                Every email is dispatched under neutral branding (Sender: <strong>MB Logistics</strong>) to guarantee customer privacy.
              </p>
            </div>

            <div className="divide-y divide-[#B56571]/15 dark:divide-neutral-800">
              {sentNotifications.length === 0 ? (
                <p className="p-6 text-center text-[#7A696C] dark:text-neutral-500 text-xs">No notifications dispatched yet.</p>
              ) : (
                sentNotifications.map((notif, i) => (
                  <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#FAF3F0] dark:bg-neutral-800 text-[#181617] dark:text-neutral-200 border border-[#B56571]/20 dark:border-neutral-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          {notif.type}
                        </span>
                        <strong className="text-[#181617] dark:text-white">{notif.subject}</strong>
                      </div>
                      <p className="text-[#7A696C] dark:text-neutral-400 font-mono text-[11px]">
                        To: <span className="text-[#181617] dark:text-neutral-300">{notif.recipient}</span> • Date: {notif.date}
                      </p>
                    </div>

                    {notif.contentHtml && (
                      <button
                        onClick={() => setPreviewEmail(notif)}
                        className="bg-white hover:bg-[#FAF3F0] text-[#181617] border border-[#B56571]/25 dark:bg-[#18181B] dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-700 px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
                      >
                        <FontAwesomeIcon icon={faEye} />
                        <span>Preview HTML</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXCEL / CSV BULK IMPORTER */}
      {activeTab === 'csv-import' && (
        <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 rounded-xl p-6 space-y-6 animate-fade-in font-sans shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08] dark:border-neutral-800 pb-5">
            <div>
              <h3 className="text-lg font-bold text-[#181617] dark:text-white flex items-center space-x-2">
                <FontAwesomeIcon icon={faFileCsv} className="text-[#A33F4D] dark:text-[#D98A92]" />
                <span>Commercial Excel / CSV Batch Product Importer</span>
              </h3>
              <p className="text-xs text-[#5C4F52] dark:text-neutral-400 mt-1 font-light">
                Download the standardized template to see the required column format, then upload your spreadsheet to import live commercial inventory in bulk.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="/templates/products_import_template.csv"
                download="products_import_template.csv"
                className="bg-[#A33F4D] text-white hover:bg-[#8F3340] dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Download Spreadsheet Template</span>
              </a>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div className="border-2 border-dashed border-[#B56571]/30 dark:border-neutral-700 hover:border-[#B56571] dark:hover:border-white rounded-xl p-8 text-center bg-[#FAF7F5] dark:bg-black/60 space-y-4 transition-all flex flex-col justify-center items-center">
            <div className="w-14 h-14 rounded-full bg-white dark:bg-[#18181B] border border-[#B56571]/20 dark:border-neutral-700 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92] shadow-sm">
              <FontAwesomeIcon icon={faUpload} className="text-xl" />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#181617] dark:text-white">Select or Drag CSV Spreadsheet Here</p>
              <p className="text-xs text-[#5C4F52] dark:text-neutral-400 font-light font-mono">Supports Excel (.csv), Google Sheets, Apple Numbers</p>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="block mx-auto text-xs text-[#5C4F52] dark:text-neutral-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#A33F4D] file:text-white dark:file:bg-white dark:file:text-black hover:file:bg-[#8F3340] cursor-pointer shadow-sm"
            />
          </div>

          {/* Excel Column Structure Reference Table */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono font-bold text-[#181617] dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <FontAwesomeIcon icon={faFileCsv} className="text-[#A33F4D] dark:text-[#D98A92]" />
              <span>Excel Spreadsheet Column Reference Guide</span>
            </h4>

            <div className="overflow-x-auto border border-[#B56571]/20 dark:border-neutral-800 rounded-lg">
              <table className="w-full text-left text-[11px] font-mono text-[#2A2426] dark:text-neutral-300">
                <thead className="bg-[#FAF3F0] dark:bg-[#141418] text-[#181617] dark:text-white uppercase">
                  <tr>
                    <th className="p-3">Column Header</th>
                    <th className="p-3">Data Type</th>
                    <th className="p-3">Required?</th>
                    <th className="p-3">Example Value</th>
                    <th className="p-3">Description / Formatting Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B56571]/15 dark:divide-neutral-800 bg-white dark:bg-black">
                  <tr>
                    <td className="p-3 font-bold text-[#181617] dark:text-white">Title</td>
                    <td className="p-3">Text</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">YES</td>
                    <td className="p-3 text-[#5C4F52] dark:text-neutral-400">The Dual-Sensation Rabbit Vibrator</td>
                    <td className="p-3">Full product display title</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#181617] dark:text-white">Department_Category</td>
                    <td className="p-3">Category ID</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">YES</td>
                    <td className="p-3 text-[#5C4F52] dark:text-neutral-400">vibrators, male-masturbators, anal-toys, cock-rings</td>
                    <td className="p-3">Must be one of the 8 department category IDs</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#181617] dark:text-white">Subcategory</td>
                    <td className="p-3">Text</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">YES</td>
                    <td className="p-3 text-[#5C4F52] dark:text-neutral-400">Rabbit Vibrators, Automatic Strokers</td>
                    <td className="p-3">Specific instrument subcategory filter</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#181617] dark:text-white">Selling_Price_INR</td>
                    <td className="p-3">Number (₹)</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">YES</td>
                    <td className="p-3 text-[#5C4F52] dark:text-neutral-400">6499</td>
                    <td className="p-3">Actual price customer pays in Indian Rupees</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#181617] dark:text-white">Original_Price_INR</td>
                    <td className="p-3">Number (₹)</td>
                    <td className="p-3 text-[#7A696C] dark:text-neutral-500">Optional</td>
                    <td className="p-3 text-[#5C4F52] dark:text-neutral-400">8099</td>
                    <td className="p-3">MRP strikethrough price in Indian Rupees</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#181617] dark:text-white">Stock_Units</td>
                    <td className="p-3">Integer</td>
                    <td className="p-3 text-[#7A696C] dark:text-neutral-500">Optional</td>
                    <td className="p-3 text-[#5C4F52] dark:text-neutral-400">45</td>
                    <td className="p-3">Available inventory units count</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#181617] dark:text-white">Image_URLs_Semicolon_Separated</td>
                    <td className="p-3">URLs list</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">YES</td>
                    <td className="p-3 text-[#5C4F52] dark:text-neutral-400">https://img1.jpg;https://img2.jpg</td>
                    <td className="p-3">Separate multiple high-res image URLs with a semicolon (;)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#181617] dark:text-white">Colors_Name_Hex_Pairs</td>
                    <td className="p-3">Pairs list</td>
                    <td className="p-3 text-[#7A696C] dark:text-neutral-500">Optional</td>
                    <td className="p-3 text-[#5C4F52] dark:text-neutral-400">Midnight Onyx:#1C1C1C, Rose Gold:#B76E79</td>
                    <td className="p-3">Color Name and HEX code separated by colon</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {parsedRows.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-black/[0.08] dark:border-neutral-800">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>{parsedRows.length} Valid Products Ready for Import</span>
                </span>

                <button
                  onClick={handleExecuteBulkImport}
                  className="bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black px-6 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-lg transition-all active:scale-95"
                >
                  🚀 Import All {parsedRows.length} Products Into Catalog
                </button>
              </div>

              <div className="overflow-x-auto border border-[#B56571]/20 dark:border-neutral-800 rounded-lg max-h-72">
                <table className="w-full text-left text-[11px] text-[#2A2426] dark:text-neutral-300 font-mono">
                  <thead className="bg-[#FAF3F0] dark:bg-[#141418] text-[#181617] dark:text-white uppercase">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Subcategory</th>
                      <th className="p-3">Price (INR)</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Sound</th>
                      <th className="p-3">Material</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B56571]/15 dark:divide-neutral-800 bg-white dark:bg-black">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-[#FAF3F0] dark:hover:bg-white/[0.04]">
                        <td className="p-3 font-medium text-[#181617] dark:text-white">{r.name}</td>
                        <td className="p-3 uppercase">{r.category}</td>
                        <td className="p-3">{r.subcategory}</td>
                        <td className="p-3 text-[#181617] dark:text-white font-bold">₹{r.price?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-emerald-700 dark:text-emerald-400">{r.stock} units</td>
                        <td className="p-3">{r.specs.sound}</td>
                        <td className="p-3">{r.specs.material}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: ENV & API KEYS CONFIGURATION MANAGER */}
      {activeTab === 'env-config' && (
        <div className="space-y-6 animate-fade-in font-sans">
          <form onSubmit={handleSaveEnvConfig} className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.08] dark:border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#181617] dark:text-white flex items-center space-x-2">
                  <FontAwesomeIcon icon={faKey} className="text-[#A33F4D] dark:text-[#D98A92]" />
                  <span>Environment Variables & Production API Keys</span>
                </h3>
                <p className="text-xs text-[#5C4F52] dark:text-neutral-400 mt-0.5 font-light">
                  Manage live credentials for Pay0pro Payment Gateway, Email SMTP/Resend, PostgreSQL, Redis, and Edge CDN.
                </p>
              </div>

              <button
                type="submit"
                className="bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black px-6 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center space-x-2 active:scale-95"
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>Save All Credentials</span>
              </button>
            </div>

            {/* 1. Pay0 Dual Gateway Management Engine */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.08] dark:border-neutral-800 pb-2.5">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#181617] dark:text-white uppercase tracking-wider">
                  <FontAwesomeIcon icon={faCreditCard} className="text-[#A33F4D] dark:text-[#D98A92]" />
                  <span>1. Payment Gateway Engine (Pay0 Dual Integration)</span>
                </div>

                {/* 1-Click Active Gateway Switcher */}
                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-black/40 p-1 rounded-xl border border-black/10 dark:border-white/10 font-mono text-[11px]">
                  <span className="text-[10px] text-[#5C4F52] dark:text-neutral-400 font-semibold px-2">Active Gateway:</span>
                  <button
                    type="button"
                    onClick={() => setEnvConfig(prev => ({ ...prev, ACTIVE_PAYMENT_GATEWAY: 'pay0_std' }))}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      (envConfig.ACTIVE_PAYMENT_GATEWAY || 'pay0_std') === 'pay0_std'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Pay0 Standard (pay0.shop)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnvConfig(prev => ({ ...prev, ACTIVE_PAYMENT_GATEWAY: 'pay0_pro' }))}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      envConfig.ACTIVE_PAYMENT_GATEWAY === 'pay0_pro'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    Pay0 Pro (pro.pay0.shop)
                  </button>
                </div>
              </div>

              {/* Side-by-Side Gateway Config Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Gateway 1: Pay0 Standard (pay0.shop) */}
                <div className={`p-4 rounded-xl border transition-all space-y-3 font-mono ${
                  (envConfig.ACTIVE_PAYMENT_GATEWAY || 'pay0_std') === 'pay0_std'
                    ? 'border-emerald-500/40 bg-emerald-500/[0.03] dark:bg-emerald-950/20'
                    : 'border-black/10 dark:border-neutral-800 bg-black/[0.02] dark:bg-black/30 opacity-75'
                }`}>
                  <div className="flex items-center justify-between pb-1 border-b border-black/[0.06] dark:border-neutral-800">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Gateway 1: Pay0 Standard (pay0.shop)
                    </span>
                    {(envConfig.ACTIVE_PAYMENT_GATEWAY || 'pay0_std') === 'pay0_std' && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 text-[10px] uppercase font-bold mb-1">
                        PAY0_STD_USER_TOKEN (User Token)
                      </label>
                      <input
                        type="text"
                        value={envConfig.PAY0_STD_USER_TOKEN || ''}
                        onChange={(e) => setEnvConfig({ ...envConfig, PAY0_STD_USER_TOKEN: e.target.value })}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-black/15 dark:border-neutral-700 rounded-md px-3 py-1.5 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-emerald-500"
                        placeholder="e7d3b644cef8f32dec1b8ce4cd5802e3"
                      />
                    </div>

                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 text-[10px] uppercase font-bold mb-1">
                        PAY0_STD_SECRET_KEY (Secret Key)
                      </label>
                      <input
                        type="text"
                        value={envConfig.PAY0_STD_SECRET_KEY || ''}
                        onChange={(e) => setEnvConfig({ ...envConfig, PAY0_STD_SECRET_KEY: e.target.value })}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-black/15 dark:border-neutral-700 rounded-md px-3 py-1.5 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-emerald-500"
                        placeholder="IAvFPh0w1N816336807"
                      />
                    </div>

                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 text-[10px] uppercase font-bold mb-1">
                        PAY0_STD_WEBHOOK_URL (Optional Custom Callback)
                      </label>
                      <input
                        type="text"
                        value={envConfig.PAY0_STD_WEBHOOK_URL || ''}
                        onChange={(e) => setEnvConfig({ ...envConfig, PAY0_STD_WEBHOOK_URL: e.target.value })}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-black/15 dark:border-neutral-700 rounded-md px-3 py-1.5 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-emerald-500"
                        placeholder="https://yourdomain.com/api/payment/webhook"
                      />
                    </div>

                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 text-[10px] uppercase font-bold mb-1">
                        PAY0_STD_REDIRECT_URL (Optional Custom Return)
                      </label>
                      <input
                        type="text"
                        value={envConfig.PAY0_STD_REDIRECT_URL || ''}
                        onChange={(e) => setEnvConfig({ ...envConfig, PAY0_STD_REDIRECT_URL: e.target.value })}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-black/15 dark:border-neutral-700 rounded-md px-3 py-1.5 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-emerald-500"
                        placeholder="https://yourdomain.com/cart?payment=success"
                      />
                    </div>
                  </div>
                </div>

                {/* Gateway 2: Pay0 Pro (pro.pay0.shop) */}
                <div className={`p-4 rounded-xl border transition-all space-y-3 font-mono ${
                  envConfig.ACTIVE_PAYMENT_GATEWAY === 'pay0_pro'
                    ? 'border-indigo-500/40 bg-indigo-500/[0.03] dark:bg-indigo-950/20'
                    : 'border-black/10 dark:border-neutral-800 bg-black/[0.02] dark:bg-black/30 opacity-75'
                }`}>
                  <div className="flex items-center justify-between pb-1 border-b border-black/[0.06] dark:border-neutral-800">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Gateway 2: Pay0 Pro (pro.pay0.shop)
                    </span>
                    {envConfig.ACTIVE_PAYMENT_GATEWAY === 'pay0_pro' && (
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 text-[10px] uppercase font-bold mb-1">
                        PAY0_PRO_USER_TOKEN (User Token)
                      </label>
                      <input
                        type="text"
                        value={envConfig.PAY0_PRO_USER_TOKEN || ''}
                        onChange={(e) => setEnvConfig({ ...envConfig, PAY0_PRO_USER_TOKEN: e.target.value })}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-black/15 dark:border-neutral-700 rounded-md px-3 py-1.5 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-indigo-500"
                        placeholder="pro.pay0.shop user token"
                      />
                    </div>

                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 text-[10px] uppercase font-bold mb-1">
                        PAY0_PRO_SECRET_KEY (Secret Key)
                      </label>
                      <input
                        type="text"
                        value={envConfig.PAY0_PRO_SECRET_KEY || ''}
                        onChange={(e) => setEnvConfig({ ...envConfig, PAY0_PRO_SECRET_KEY: e.target.value })}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-black/15 dark:border-neutral-700 rounded-md px-3 py-1.5 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-indigo-500"
                        placeholder="pro.pay0.shop secret key"
                      />
                    </div>

                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 text-[10px] uppercase font-bold mb-1">
                        PAY0_PRO_WEBHOOK_URL (Optional Custom Callback)
                      </label>
                      <input
                        type="text"
                        value={envConfig.PAY0_PRO_WEBHOOK_URL || ''}
                        onChange={(e) => setEnvConfig({ ...envConfig, PAY0_PRO_WEBHOOK_URL: e.target.value })}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-black/15 dark:border-neutral-700 rounded-md px-3 py-1.5 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-indigo-500"
                        placeholder="https://yourdomain.com/api/payment/webhook"
                      />
                    </div>

                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 text-[10px] uppercase font-bold mb-1">
                        PAY0_PRO_REDIRECT_URL (Optional Custom Return)
                      </label>
                      <input
                        type="text"
                        value={envConfig.PAY0_PRO_REDIRECT_URL || ''}
                        onChange={(e) => setEnvConfig({ ...envConfig, PAY0_PRO_REDIRECT_URL: e.target.value })}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-black/15 dark:border-neutral-700 rounded-md px-3 py-1.5 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-indigo-500"
                        placeholder="https://yourdomain.com/cart?payment=success"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#5C4F52] dark:text-neutral-400 font-mono font-light">
                ℹ️ At any given time, only the active gateway processes customer checkout. Both gateway credentials remain saved in the database.
              </p>
            </div>

            {/* Email Notification Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#181617] dark:text-white uppercase tracking-wider border-b border-black/[0.08] dark:border-neutral-800 pb-1.5">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#A33F4D] dark:text-[#D98A92]" />
                <span>2. Transactional Email & Resend / SMTP Config</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 text-[11px] mb-1">RESEND_API_KEY *</label>
                  <input
                    type="text"
                    value={envConfig.RESEND_API_KEY || ''}
                    onChange={(e) => setEnvConfig({ ...envConfig, RESEND_API_KEY: e.target.value })}
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571]"
                  />
                </div>
                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 text-[11px] mb-1">FROM_EMAIL (Discreet Sender) *</label>
                  <input
                    type="text"
                    value={envConfig.FROM_EMAIL}
                    onChange={(e) => setEnvConfig({ ...envConfig, FROM_EMAIL: e.target.value })}
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571]"
                  />
                </div>
                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 text-[11px] mb-1">SMTP_HOST</label>
                  <input
                    type="text"
                    value={envConfig.SMTP_HOST}
                    onChange={(e) => setEnvConfig({ ...envConfig, SMTP_HOST: e.target.value })}
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571]"
                  />
                </div>
                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 text-[11px] mb-1">ADMIN_ALERT_EMAIL</label>
                  <input
                    type="email"
                    value={envConfig.ADMIN_ALERT_EMAIL}
                    onChange={(e) => setEnvConfig({ ...envConfig, ADMIN_ALERT_EMAIL: e.target.value })}
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571]"
                  />
                </div>
              </div>
            </div>

            {/* Database & CDN Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#181617] dark:text-white uppercase tracking-wider border-b border-black/[0.08] dark:border-neutral-800 pb-1.5">
                <FontAwesomeIcon icon={faDatabase} className="text-[#A33F4D] dark:text-[#D98A92]" />
                <span>3. Database Connection & CDN Edge Cache</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="sm:col-span-2">
                  <label className="block text-[#5C4F52] dark:text-neutral-400 text-[11px] mb-1">DATABASE_URL (PostgreSQL)</label>
                  <input
                    type="text"
                    value={envConfig.DATABASE_URL}
                    onChange={(e) => setEnvConfig({ ...envConfig, DATABASE_URL: e.target.value })}
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571]"
                  />
                </div>
                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 text-[11px] mb-1">REDIS_URL</label>
                  <input
                    type="text"
                    value={envConfig.REDIS_URL}
                    onChange={(e) => setEnvConfig({ ...envConfig, REDIS_URL: e.target.value })}
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571]"
                  />
                </div>
                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 text-[11px] mb-1">CDN_DOMAIN (Cloudflare / Edge)</label>
                  <input
                    type="text"
                    value={envConfig.CDN_DOMAIN}
                    onChange={(e) => setEnvConfig({ ...envConfig, CDN_DOMAIN: e.target.value })}
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571]"
                  />
                </div>
              </div>
            </div>



            <div className="flex justify-end pt-3 border-t border-black/[0.08] dark:border-neutral-800">
              <button
                type="submit"
                className="bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black px-8 py-3 rounded-lg font-mono font-bold uppercase tracking-wider text-xs cursor-pointer shadow-md transition-all flex items-center space-x-2 active:scale-95"
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>Save Production Environment Keys</span>
              </button>
            </div>
          </form>

          {/* Test Email Dispatcher Box */}
          <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 rounded-xl p-6 space-y-3 shadow-xs">
            <div className="border-b border-black/[0.08] dark:border-neutral-800 pb-3">
              <h4 className="text-sm font-mono font-bold text-[#181617] dark:text-white flex items-center space-x-2 uppercase">
                <FontAwesomeIcon icon={faPaperPlane} className="text-[#A33F4D] dark:text-[#D98A92]" />
                <span>Test Transactional Email Dispatcher</span>
              </h4>
              <p className="text-xs text-[#5C4F52] dark:text-neutral-400 mt-0.5 font-light">Send a confidential sample receipt to verify your Resend / SMTP credentials.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter recipient email address..."
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                className="flex-1 bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-md px-3.5 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTestEmail}
                className="bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black px-5 py-2 rounded-md text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow transition-all active:scale-95"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>{isSendingTestEmail ? 'Dispatching...' : 'Send Test Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: EMAIL TEMPLATES ENGINE & MARKETING BROADCAST */}
      {/* ========================================================= */}
      {activeTab === 'email-templates' && (
        <div className="space-y-6 animate-fade-in font-sans">
          
          {/* Header Action Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0D0D11] p-5 rounded-2xl border border-[#B56571]/20 dark:border-neutral-800 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#B56571]/15 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                </div>
                <h3 className="text-lg font-bold text-[#181617] dark:text-white">
                  Transactional Email Engine & Marketing Campaigns
                </h3>
              </div>
              <p className="text-xs text-[#5C4F52] dark:text-neutral-400 font-light">
                Preview bulletproof luxury email templates, dispatch sample tests to your inbox, or broadcast VIP drops and recovery codes to registered members via Resend.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchEmailPreview(selectedEmailTemplate)}
                disabled={isLoadingPreview}
                className="bg-white dark:bg-[#18181B] border border-[#B56571]/25 dark:border-neutral-700 hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#181617] dark:text-white px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
              >
                <FontAwesomeIcon icon={faRotateRight} className={isLoadingPreview ? 'animate-spin' : ''} />
                <span>Refresh Preview</span>
              </button>
            </div>
          </div>

          {/* Template Selector Pills */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 text-xs font-mono">
            {[
              { id: 'new_product', label: '✨ VIP Product Drop', desc: 'Marketing & New Launches' },
              { id: 'order_confirmation', label: '📦 Order Confirmation', desc: 'Discreet Invoice & Plain Box' },
              { id: 'shipping_update', label: '🚚 Shipping & Tracking', desc: 'Live AWB Courier Dispatch' },
              { id: 'otp', label: '🔐 OTP Verification', desc: 'Auth & Password Reset' },
              { id: 'abandoned_cart', label: '🛒 Abandoned Cart Recovery', desc: '10% OFF Gentle Nudge' },
              { id: 'welcome_vip', label: '👑 Welcome VIP Member', desc: '200 Reward Points Drop' },
              { id: 'admin_alert', label: '🚨 Admin Order Alert', desc: 'Instant Admin Notification' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedEmailTemplate(t.id)}
                className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex flex-col items-start ${
                  selectedEmailTemplate === t.id
                    ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black shadow-md'
                    : 'bg-white dark:bg-[#16171C] text-[#5C4F52] dark:text-neutral-400 border border-[#B56571]/20 dark:border-neutral-800 hover:border-[#B56571]/50'
                }`}
              >
                <span>{t.label}</span>
                <span className={`text-[10px] font-normal ${selectedEmailTemplate === t.id ? 'text-white/80 dark:text-black/80' : 'text-[#7A696C] dark:text-neutral-500'}`}>
                  {t.desc}
                </span>
              </button>
            ))}
          </div>

          {/* 2-Column Split: Controls vs Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Template Customization & Dispatch (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Customization Form Card */}
              <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="border-b border-black/[0.08] dark:border-neutral-800 pb-2.5 flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-[#181617] dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <FontAwesomeIcon icon={faSliders} className="text-[#A33F4D] dark:text-[#D98A92]" />
                    <span>Template Parameters</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B56571]/10 text-[#A33F4D] dark:text-[#D98A92] font-bold">
                    {selectedEmailTemplate.toUpperCase()}
                  </span>
                </div>

                {/* Product Selector for New Product Drop */}
                {selectedEmailTemplate === 'new_product' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">
                        Select Featured Product
                      </label>
                      <select
                        value={emailSelectedProduct}
                        onChange={(e) => setEmailSelectedProduct(e.target.value)}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571]"
                      >
                        <option value="">Featured: {productsList[0]?.name || 'Select Product'}</option>
                        {productsList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (₹{p.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">
                        VIP Promo Code
                      </label>
                      <input
                        type="text"
                        value={emailDiscountCode}
                        onChange={(e) => setEmailDiscountCode(e.target.value)}
                        placeholder="VIPDROP15"
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">
                        Marketing Body Copy
                      </label>
                      <textarea
                        rows={3}
                        value={emailCustomMessage}
                        onChange={(e) => setEmailCustomMessage(e.target.value)}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-sans"
                      />
                    </div>
                  </div>
                )}

                {/* Abandoned Cart Promo */}
                {selectedEmailTemplate === 'abandoned_cart' && (
                  <div>
                    <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">
                      Cart Recovery Discount Promo Code
                    </label>
                    <input
                      type="text"
                      value={emailDiscountCode}
                      onChange={(e) => setEmailDiscountCode(e.target.value)}
                      placeholder="RECOVER10"
                      className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
                    />
                  </div>
                )}

                {/* Readonly info for other templates */}
                {['order_confirmation', 'shipping_update', 'otp', 'welcome_vip', 'admin_alert'].includes(selectedEmailTemplate) && (
                  <div className="bg-[#FAF7F5] dark:bg-black/50 p-3.5 rounded-xl border border-black/[0.06] dark:border-neutral-800 space-y-2 text-xs text-[#5C4F52] dark:text-neutral-400 font-light">
                    <p>
                      ⚙️ <strong>Automated System Trigger:</strong> This template is dynamically generated by the backend with live customer name, order items, encrypted OTP, or AWB tracking numbers upon event triggers.
                    </p>
                    <p className="text-[11px] text-[#7A696C] dark:text-neutral-500 font-mono">
                      100% Mobile Responsive • Tested on Gmail, Outlook, and Apple Mail.
                    </p>
                  </div>
                )}
              </div>

              {/* Single Test Email Dispatcher Card */}
              <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="border-b border-black/[0.08] dark:border-neutral-800 pb-2">
                  <h4 className="text-xs font-mono font-bold text-[#181617] dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <FontAwesomeIcon icon={faPaperPlane} className="text-[#A33F4D] dark:text-[#D98A92]" />
                    <span>Send Sample to Inbox</span>
                  </h4>
                </div>

                <div className="space-y-2">
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px]">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    value={emailCampaignRecipient}
                    onChange={(e) => setEmailCampaignRecipient(e.target.value)}
                    placeholder="20092003pardeep@gmail.com"
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendSampleTemplate}
                  disabled={isSendingTemplateEmail}
                  className="w-full bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow transition-all active:scale-95 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className={isSendingTemplateEmail ? 'animate-bounce' : ''} />
                  <span>{isSendingTemplateEmail ? 'Dispatching via Resend...' : `Send Test ${selectedEmailTemplate.replace('_', ' ').toUpperCase()}`}</span>
                </button>
              </div>

              {/* Bulk Campaign Broadcast Card */}
              {['new_product', 'abandoned_cart'].includes(selectedEmailTemplate) && (
                <div className="bg-gradient-to-br from-[#1C1D22] to-[#121316] border border-[#D98A92]/40 rounded-2xl p-5 space-y-3 shadow-lg text-white">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📢</span>
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D98A92]">
                        VIP Member Broadcast Campaign
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        Dispatch this campaign to all registered sanctuary members.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBroadcastCampaign}
                    disabled={isBroadcasting}
                    className="w-full bg-white hover:bg-neutral-200 text-black py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    <span>{isBroadcasting ? 'Broadcasting in Progress...' : 'Broadcast to All Members'}</span>
                  </button>
                </div>
              )}

            </div>

            {/* Right Column: Interactive Live Device Preview (7 Cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xs">
              
              {/* Preview Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.08] dark:border-neutral-800 pb-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-mono text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider">
                    Subject Line:
                  </div>
                  <div className="text-xs font-bold text-[#181617] dark:text-white font-sans truncate max-w-md">
                    {emailPreviewSubject || 'Confidential Notification - Midnight Bloom'}
                  </div>
                </div>

                {/* Device Mode Toggle */}
                <div className="flex items-center bg-[#FAF7F5] dark:bg-black border border-black/[0.06] dark:border-neutral-800 rounded-lg p-1 text-xs font-mono self-start sm:self-auto">
                  <button
                    onClick={() => setPreviewDeviceMode('desktop')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      previewDeviceMode === 'desktop'
                        ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black font-bold shadow-xs'
                        : 'text-[#7A696C] dark:text-neutral-400 hover:text-white'
                    }`}
                  >
                    Desktop (600px)
                  </button>
                  <button
                    onClick={() => setPreviewDeviceMode('mobile')}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      previewDeviceMode === 'mobile'
                        ? 'bg-[#A33F4D] text-white dark:bg-white dark:text-black font-bold shadow-xs'
                        : 'text-[#7A696C] dark:text-neutral-400 hover:text-white'
                    }`}
                  >
                    Mobile (380px)
                  </button>
                </div>
              </div>

              {/* Rendered HTML Iframe Container */}
              <div className="flex justify-center bg-[#050507] p-4 rounded-xl overflow-hidden min-h-[520px] border border-neutral-800">
                {isLoadingPreview ? (
                  <div className="flex flex-col items-center justify-center space-y-3 py-20 text-neutral-400 font-mono text-xs">
                    <FontAwesomeIcon icon={faRotateRight} className="animate-spin text-2xl text-[#D98A92]" />
                    <span>Rendering Luxury Email Template...</span>
                  </div>
                ) : (
                  <div
                    className="transition-all duration-300 overflow-hidden shadow-2xl rounded-xl"
                    style={{
                      width: previewDeviceMode === 'mobile' ? '380px' : '100%',
                      maxWidth: previewDeviceMode === 'mobile' ? '380px' : '620px'
                    }}
                  >
                    <iframe
                      title="Email Live Preview"
                      srcDoc={emailPreviewHtml}
                      className="w-full h-[620px] border-0 rounded-xl bg-[#0A0A0C]"
                      sandbox="allow-same-origin"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#7A696C] dark:text-neutral-500 pt-1">
                <span>Sender: <strong className="text-[#A33F4D] dark:text-[#D98A92]">{envConfig.FROM_EMAIL || 'Midnight Bloom <orders@yourdomain.com>'}</strong></span>
                <span>Plain Packaging Certified 🔒</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: REGISTERED SANCTUARY USERS & CUSTOMERS DIRECTORY */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fade-in font-sans">
          
          {/* Header Action Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0D0D11] p-5 rounded-2xl border border-[#B56571]/20 dark:border-neutral-800 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#B56571]/15 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center">
                  <FontAwesomeIcon icon={faUsers} className="text-sm" />
                </div>
                <h3 className="text-lg font-bold text-[#181617] dark:text-white">
                  Registered Sanctuary Members Directory
                </h3>
              </div>
              <p className="text-xs text-[#5C4F52] dark:text-neutral-400 font-light">
                Comprehensive customer registry, authentication methods, order frequency, and encrypted profile management.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchAdminUsers(usersPagination.page)}
                disabled={isLoadingUsers}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold border border-[#B56571]/30 dark:border-neutral-700 bg-[#FAF7F5] dark:bg-[#14151B] hover:bg-[#FAF3F0] dark:hover:bg-neutral-800 text-[#181617] dark:text-white flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
              >
                <FontAwesomeIcon icon={faRotateRight} className={isLoadingUsers ? 'animate-spin' : ''} />
                <span>Refresh Directory</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 font-mono">
            <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 p-4 rounded-xl space-y-1 shadow-xs">
              <span className="text-[10px] text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider font-semibold block">Total Members</span>
              <h4 className="text-xl font-bold text-[#181617] dark:text-white">{usersSummary.totalUsers || adminUsers.length}</h4>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">100% Encrypted DB</span>
            </div>

            <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 p-4 rounded-xl space-y-1 shadow-xs">
              <span className="text-[10px] text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider font-semibold block">Google Verified</span>
              <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400">{usersSummary.googleUsers || 0}</h4>
              <span className="text-[10px] text-[#7A696C] dark:text-neutral-400">OAuth 2.0 Auth</span>
            </div>

            <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 p-4 rounded-xl space-y-1 shadow-xs">
              <span className="text-[10px] text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider font-semibold block">Email + OTP</span>
              <h4 className="text-xl font-bold text-amber-600 dark:text-amber-400">{usersSummary.emailUsers || 0}</h4>
              <span className="text-[10px] text-[#7A696C] dark:text-neutral-400">Resend Verified</span>
            </div>

            <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 p-4 rounded-xl space-y-1 shadow-xs">
              <span className="text-[10px] text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider font-semibold block">New Today</span>
              <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400">{usersSummary.todayUsers || 0}</h4>
              <span className="text-[10px] text-[#7A696C] dark:text-neutral-400">Past 24 Hours</span>
            </div>

            <div className="bg-white dark:bg-[#0D0D11] border border-[#B56571]/20 dark:border-neutral-800 p-4 rounded-xl space-y-1 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider font-semibold block">Customer LTV</span>
              <h4 className="text-xl font-bold text-[#A33F4D] dark:text-[#D98A92]">₹{(usersSummary.totalLTV || 0).toLocaleString('en-IN')}</h4>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Total Order Volume</span>
            </div>
          </div>

          {/* Search and Filters Toolbar */}
          <div className="bg-white dark:bg-[#0D0D11] p-4 rounded-2xl border border-[#B56571]/20 dark:border-neutral-800 space-y-3 shadow-xs">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A696C] dark:text-neutral-400 text-xs pointer-events-none" />
                <input
                  type="text"
                  value={usersSearch}
                  onChange={(e) => {
                    setUsersSearch(e.target.value);
                    fetchAdminUsers(1, e.target.value, usersDateFilter, usersAuthProvider, usersTierFilter);
                  }}
                  placeholder="Search by Gmail / Email, Unique User ID (usr_...), Name, or Phone..."
                  className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#181617] dark:text-white placeholder-[#7A696C] dark:placeholder-neutral-500 focus:outline-none focus:border-[#B56571] font-sans"
                />
                {usersSearch && (
                  <button
                    onClick={() => {
                      setUsersSearch('');
                      fetchAdminUsers(1, '', usersDateFilter, usersAuthProvider, usersTierFilter);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Selectors Grid */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                {/* 1. Date Filter */}
                <div className="flex items-center space-x-1.5 bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-xl px-3 py-1.5">
                  <FontAwesomeIcon icon={faCalendarDay} className="text-[#A33F4D] dark:text-[#D98A92] text-[11px]" />
                  <span className="text-[11px] text-[#7A696C] dark:text-neutral-400">Date:</span>
                  <select
                    value={usersDateFilter}
                    onChange={(e) => {
                      setUsersDateFilter(e.target.value);
                      fetchAdminUsers(1, usersSearch, e.target.value, usersAuthProvider, usersTierFilter);
                    }}
                    className="bg-transparent text-xs text-[#181617] dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#FAF7F5] dark:bg-[#16171C]">All Time</option>
                    <option value="today" className="bg-[#FAF7F5] dark:bg-[#16171C]">Registered Today</option>
                    <option value="yesterday" className="bg-[#FAF7F5] dark:bg-[#16171C]">Yesterday</option>
                    <option value="this_week" className="bg-[#FAF7F5] dark:bg-[#16171C]">Last 7 Days (This Week)</option>
                    <option value="last_week" className="bg-[#FAF7F5] dark:bg-[#16171C]">Last Week (7-14 Days ago)</option>
                    <option value="this_month" className="bg-[#FAF7F5] dark:bg-[#16171C]">This Month</option>
                    <option value="last_month" className="bg-[#FAF7F5] dark:bg-[#16171C]">Last Month</option>
                  </select>
                </div>

                {/* 2. Provider Filter */}
                <div className="flex items-center space-x-1.5 bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-xl px-3 py-1.5">
                  <span className="text-[11px] text-[#7A696C] dark:text-neutral-400">Method:</span>
                  <select
                    value={usersAuthProvider}
                    onChange={(e) => {
                      setUsersAuthProvider(e.target.value);
                      fetchAdminUsers(1, usersSearch, usersDateFilter, e.target.value, usersTierFilter);
                    }}
                    className="bg-transparent text-xs text-[#181617] dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#FAF7F5] dark:bg-[#16171C]">All Providers</option>
                    <option value="google" className="bg-[#FAF7F5] dark:bg-[#16171C]">Google OAuth</option>
                    <option value="email" className="bg-[#FAF7F5] dark:bg-[#16171C]">Email + OTP</option>
                  </select>
                </div>

                {/* 3. Tier Filter */}
                <div className="flex items-center space-x-1.5 bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-xl px-3 py-1.5">
                  <span className="text-[11px] text-[#7A696C] dark:text-neutral-400">Tier:</span>
                  <select
                    value={usersTierFilter}
                    onChange={(e) => {
                      setUsersTierFilter(e.target.value);
                      fetchAdminUsers(1, usersSearch, usersDateFilter, usersAuthProvider, e.target.value);
                    }}
                    className="bg-transparent text-xs text-[#181617] dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#FAF7F5] dark:bg-[#16171C]">All Tiers</option>
                    <option value="Super Admin" className="bg-[#FAF7F5] dark:bg-[#16171C]">Super Admin</option>
                    <option value="Platinum VIP" className="bg-[#FAF7F5] dark:bg-[#16171C]">Platinum VIP</option>
                    <option value="Gold VIP Member" className="bg-[#FAF7F5] dark:bg-[#16171C]">Gold VIP Member</option>
                    <option value="Silver Member" className="bg-[#FAF7F5] dark:bg-[#16171C]">Silver Member</option>
                  </select>
                </div>

                {/* Reset Filters */}
                {(usersSearch || usersDateFilter !== 'all' || usersAuthProvider !== 'all' || usersTierFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setUsersSearch('');
                      setUsersDateFilter('all');
                      setUsersAuthProvider('all');
                      setUsersTierFilter('all');
                      fetchAdminUsers(1, '', 'all', 'all', 'all');
                    }}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-mono text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-red-500/30 cursor-pointer transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Results Counter & 20-Item Load-Balanced Pagination Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#7A696C] dark:text-neutral-400 font-mono">
            <div>
              <span>
                Matching Members: <strong className="text-[#181617] dark:text-white font-bold">{usersPagination.totalUsers}</strong>
                {usersPagination.totalUsers > 0 && (
                  <span> | Showing <strong>{(usersPagination.page - 1) * usersPagination.limit + 1} - {Math.min(usersPagination.page * usersPagination.limit, usersPagination.totalUsers)}</strong> (20 per page load balanced)</span>
                )}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={!usersPagination.hasPrevPage || isLoadingUsers}
                onClick={() => fetchAdminUsers(usersPagination.page - 1)}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#FAF3F0] text-[#181617] border border-[#B56571]/25 dark:bg-[#18181B] dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-700 disabled:opacity-30 cursor-pointer font-mono transition-all text-xs"
              >
                ← Previous 20
              </button>
              
              <span className="px-3 py-1 rounded-lg bg-[#FAF7F5] dark:bg-[#121316] border border-[#B56571]/15 dark:border-neutral-800 text-[#181617] dark:text-white font-bold font-mono text-xs">
                Page {usersPagination.page} of {usersPagination.totalPages}
              </span>

              <button
                disabled={!usersPagination.hasNextPage || isLoadingUsers}
                onClick={() => fetchAdminUsers(usersPagination.page + 1)}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#FAF3F0] text-[#181617] border border-[#B56571]/25 dark:bg-[#18181B] dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-700 disabled:opacity-30 cursor-pointer font-mono transition-all text-xs"
              >
                Next 20 →
              </button>
            </div>
          </div>

          {/* Registered Users Data Table */}
          <div className="bg-white dark:bg-[#0D0D11] rounded-2xl overflow-hidden border border-[#B56571]/20 dark:border-neutral-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2A2426] dark:text-neutral-300 font-sans">
                <thead className="bg-[#FAF3F0] dark:bg-[#141418] text-[#181617] dark:text-white font-mono uppercase tracking-wider text-[11px] border-b border-[#B56571]/20 dark:border-neutral-800">
                  <tr>
                    <th className="p-4">Member Name</th>
                    <th className="p-4">Unique ID & Email</th>
                    <th className="p-4">Auth Method</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Tier & Points</th>
                    <th className="p-4">Orders & Spend</th>
                    <th className="p-4">Registered On</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B56571]/15 dark:divide-neutral-800/80 font-sans">
                  {isLoadingUsers ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-xs font-mono text-[#7A696C] dark:text-neutral-400">
                        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#B56571] border-t-transparent rounded-full mb-2" />
                        <p>Querying SQLite User Records (WAL Engine)...</p>
                      </td>
                    </tr>
                  ) : adminUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                          <FontAwesomeIcon icon={faUsers} className="text-lg" />
                        </div>
                        <h4 className="text-sm font-bold text-[#181617] dark:text-white">No Registered Members Found</h4>
                        <p className="text-xs text-neutral-500 font-mono">Try adjusting your search query, auth method, or date filters.</p>
                      </td>
                    </tr>
                  ) : (
                    adminUsers.map((u) => {
                      const isSuperAdmin = u.email === '20092003pardeep@gmail.com' || u.isAdmin;
                      const joinDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
                      const joinTime = u.createdAt ? new Date(u.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

                      return (
                        <tr 
                          key={u.id}
                          className="hover:bg-[#FAF3F0]/60 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
                          onClick={() => handleViewUserDetails(u.id)}
                        >
                          {/* Member Name + Avatar */}
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              {u.avatar ? (
                                <img src={u.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-[#B56571]/30 shrink-0" />
                              ) : (
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase text-white shadow-xs shrink-0 ${
                                  isSuperAdmin ? 'bg-gradient-to-tr from-amber-600 to-amber-400' : 'bg-gradient-to-tr from-[#8A434E] to-[#B56571]'
                                }`}>
                                  {u.name ? u.name.charAt(0) : 'M'}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <strong className="text-sm text-[#181617] dark:text-white font-semibold group-hover:text-[#A33F4D] dark:group-hover:text-[#F0B8BE] transition-colors">
                                    {u.name || 'Discreet Member'}
                                  </strong>
                                  {isSuperAdmin && (
                                    <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                                      ADMIN
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono block">
                                  {u.addressCount} saved {u.addressCount === 1 ? 'address' : 'addresses'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Unique ID & Email */}
                          <td className="p-4 font-mono">
                            <span className="text-xs text-[#181617] dark:text-white font-medium block">{u.email}</span>
                            <span className="text-[10px] text-[#7A696C] dark:text-neutral-500 block select-all">
                              ID: {u.id}
                            </span>
                          </td>

                          {/* Auth Provider */}
                          <td className="p-4 font-mono">
                            {u.authProvider === 'google' ? (
                              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60">
                                <svg className="w-3 h-3" viewBox="0 0 24 24">
                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                </svg>
                                <span>Google OAuth</span>
                              </span>
                            ) : u.authProvider === 'order_checkout' ? (
                              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
                                <FontAwesomeIcon icon={faBox} className="text-[10px]" />
                                <span>Guest Checkout</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60">
                                <FontAwesomeIcon icon={faEnvelope} className="text-[10px]" />
                                <span>Email + OTP</span>
                              </span>
                            )}
                          </td>

                          {/* Phone */}
                          <td className="p-4 font-mono text-xs">
                            {u.phone ? (
                              <span className="text-[#181617] dark:text-neutral-200">{u.phone}</span>
                            ) : (
                              <span className="text-neutral-400 dark:text-neutral-600 italic">Unspecified</span>
                            )}
                          </td>

                          {/* Tier & Points */}
                          <td className="p-4 font-mono text-xs">
                            <span className="font-bold text-[#181617] dark:text-white block">{u.tier}</span>
                            <span className="text-[10px] text-[#A33F4D] dark:text-[#D98A92]">
                              {u.points} Sanctuary Pts
                            </span>
                          </td>

                          {/* Orders & Total Spend */}
                          <td className="p-4 font-mono text-xs">
                            <strong className="text-sm text-[#181617] dark:text-white block">
                              ₹{(u.totalSpent || 0).toLocaleString('en-IN')}
                            </strong>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                              {u.orderCount} {u.orderCount === 1 ? 'order' : 'orders'} placed
                            </span>
                          </td>

                          {/* Registered Date */}
                          <td className="p-4 font-mono text-xs">
                            <span className="text-[#181617] dark:text-neutral-200 block">{joinDate}</span>
                            <span className="text-[10px] text-neutral-500 block">{joinTime}</span>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleViewUserDetails(u.id)}
                                title="View User Orders & Full Profile"
                                className="px-3 py-1.5 rounded-lg bg-[#A33F4D]/10 hover:bg-[#A33F4D] text-[#A33F4D] hover:text-white dark:bg-[#D98A92]/15 dark:hover:bg-[#D98A92] dark:text-[#D98A92] dark:hover:text-black font-mono text-xs font-semibold transition-all cursor-pointer"
                              >
                                View Orders ({u.orderCount})
                              </button>

                              {!isSuperAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u)}
                                  title="Delete User"
                                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* PRINTABLE SHIPPING SLIP MODAL */}
      {printOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-mono print-modal-overlay">
          <div className="printable-manifest bg-white text-black p-8 rounded-2xl max-w-lg w-full space-y-6 shadow-2xl border border-neutral-300 animate-fade-in">
            <div className="border-b-2 border-black pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-600 block">CONFIDENTIAL FULFILLMENT SLIP</span>
                <h3 className="text-xl font-bold font-serif mt-0.5">MB LOGISTICS INDIA</h3>
                <p className="text-xs text-neutral-600">Discreet Dispatch Hub #402, Mumbai MH</p>
              </div>
              <button 
                onClick={() => setPrintOrder(null)}
                className="text-black font-bold p-1 cursor-pointer no-print"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b pb-1">
                <span className="text-neutral-600">Shipment Order ID:</span>
                <strong>#{printOrder.id}</strong>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-neutral-600">Consignee:</span>
                <strong>{printOrder.customerName}</strong>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-neutral-600">Destination:</span>
                <span>{printOrder.customerCity}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-neutral-600">Packaging Type:</span>
                <strong className="text-emerald-700">100% Plain Cardboard (Zero Logo)</strong>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-neutral-600">Declaration:</span>
                <span>Personal Care Device (HSN: 901910)</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm">
                <span>Total Collectible:</span>
                <span>₹{printOrder.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-neutral-400 pt-4 text-[10px] text-center text-neutral-600">
              TAMPER-PROOF DISCREET SEAL • DO NOT ACCEPT IF SEAL IS BROKEN
            </div>

            <div className="flex justify-end gap-2 pt-2 no-print">
              <button
                onClick={() => { window.print(); }}
                className="bg-[#A33F4D] text-white hover:bg-[#8F3340] px-5 py-2 rounded text-xs font-bold uppercase cursor-pointer shadow"
              >
                🖨️ Print Shipping Label
              </button>
              <button
                onClick={() => setPrintOrder(null)}
                className="border border-neutral-400 px-4 py-2 rounded text-xs font-bold cursor-pointer hover:bg-neutral-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL PREVIEW MODAL */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white dark:bg-[#121215] border border-[#B56571]/25 dark:border-neutral-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-black/[0.08] dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A696C] dark:text-neutral-400 font-bold">
                  Simulated Customer Transactional Email
                </span>
                <h4 className="text-sm font-bold text-[#181617] dark:text-white mt-0.5">{previewEmail.subject}</h4>
              </div>
              <button 
                onClick={() => setPreviewEmail(null)}
                className="text-[#7A696C] hover:text-[#181617] dark:text-neutral-400 dark:hover:text-white p-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-base" />
              </button>
            </div>

            <div 
              className="bg-white text-black p-6 rounded-xl overflow-y-auto max-h-[65vh] shadow-inner border border-neutral-200"
              dangerouslySetInnerHTML={{ __html: previewEmail.contentHtml }}
            />

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewEmail(null)}
                className="bg-[#A33F4D] text-white hover:bg-[#8F3340] dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white dark:bg-[#121215] border border-[#B56571]/25 dark:border-neutral-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-black/[0.08] dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-[#181617] dark:text-white">
                {editingProductId ? 'Edit Intimate Instrument' : 'Add New Intimate Instrument'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#7A696C] hover:text-[#181617] dark:text-neutral-400 dark:hover:text-white p-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-base" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs text-[#2A2426] dark:text-neutral-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (productErrors.name) setProductErrors({ ...productErrors, name: null });
                    }}
                    placeholder="e.g. The Royale Dual Rabbit Vibrator"
                    className={`w-full bg-[#FAF7F5] dark:bg-black border rounded-lg px-3 py-2 text-[#181617] dark:text-white focus:outline-none font-sans transition-all ${
                      productErrors.name 
                        ? 'border-red-500 ring-1 ring-red-500/50' 
                        : 'border-[#B56571]/25 dark:border-neutral-700 focus:border-[#B56571]'
                    }`}
                  />
                  {productErrors.name && (
                    <p className="text-[10px] text-red-500 font-mono mt-1">⚠ {productErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Department Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-sans"
                  >
                    {STITCH_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g. Rabbit Vibrators"
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">
                    Selling Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData({ ...formData, price: e.target.value });
                      if (productErrors.price) setProductErrors({ ...productErrors, price: null });
                    }}
                    className={`w-full bg-[#FAF7F5] dark:bg-black border rounded-lg px-3 py-2 text-[#181617] dark:text-white focus:outline-none font-mono transition-all ${
                      productErrors.price 
                        ? 'border-red-500 ring-1 ring-red-500/50' 
                        : 'border-[#B56571]/25 dark:border-neutral-700 focus:border-[#B56571]'
                    }`}
                  />
                  {productErrors.price && (
                    <p className="text-[10px] text-red-500 font-mono mt-1">⚠ {productErrors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => {
                      setFormData({ ...formData, originalPrice: e.target.value });
                      if (productErrors.originalPrice) setProductErrors({ ...productErrors, originalPrice: null });
                    }}
                    className={`w-full bg-[#FAF7F5] dark:bg-black border rounded-lg px-3 py-2 text-[#181617] dark:text-white focus:outline-none font-mono transition-all ${
                      productErrors.originalPrice 
                        ? 'border-red-500 ring-1 ring-red-500/50' 
                        : 'border-[#B56571]/25 dark:border-neutral-700 focus:border-[#B56571]'
                    }`}
                  />
                  {productErrors.originalPrice && (
                    <p className="text-[10px] text-red-500 font-mono mt-1">⚠ {productErrors.originalPrice}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => {
                      setFormData({ ...formData, stock: e.target.value });
                      if (productErrors.stock) setProductErrors({ ...productErrors, stock: null });
                    }}
                    className={`w-full bg-[#FAF7F5] dark:bg-black border rounded-lg px-3 py-2 text-[#181617] dark:text-white focus:outline-none font-mono transition-all ${
                      productErrors.stock 
                        ? 'border-red-500 ring-1 ring-red-500/50' 
                        : 'border-[#B56571]/25 dark:border-neutral-700 focus:border-[#B56571]'
                    }`}
                  />
                  {productErrors.stock && (
                    <p className="text-[10px] text-red-500 font-mono mt-1">⚠ {productErrors.stock}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Best Seller / Trending / New Release"
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Discount Tag</label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="20% OFF"
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg p-3 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Acoustic Sound Level</label>
                  <input
                    type="text"
                    value={formData.sound}
                    onChange={(e) => setFormData({ ...formData, sound: e.target.value })}
                    placeholder="< 28 dB (Whisper Silent)"
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Body Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="100% Medical Liquid Silicone"
                    className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg px-3 py-2 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">Image URLs (1 per line or semicolon separated)</label>
                <textarea
                  rows={2}
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="/product-images/your_product_0.webp or image URL"
                  className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-lg p-3 text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-black/[0.08] dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#B56571]/25 dark:border-neutral-700 text-[#5C4F52] dark:text-neutral-400 hover:text-[#181617] dark:hover:text-white cursor-pointer font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black px-6 py-2 rounded-lg font-mono font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
                >
                  {editingProductId ? 'Update' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Luxury In-App Confirmation Modal (Zero Browser-Native Dialogs) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF7F5] dark:bg-[#14151B] border border-[#B56571]/30 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmModal.isDanger ? 'bg-red-500/20 text-red-500' : 'bg-[#B56571]/20 text-[#A33F4D] dark:text-[#D98A92]'}`}>
                <FontAwesomeIcon icon={faTrash} className="text-sm" />
              </div>
              <h3 className="text-base font-bold text-[#181617] dark:text-white font-serif">
                {confirmModal.title}
              </h3>
            </div>
            <p className="text-xs text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-sans">
              {confirmModal.message}
            </p>
            <div className="flex justify-end space-x-3 pt-3 border-t border-black/5 dark:border-white/10">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl text-xs font-mono border border-black/10 dark:border-white/10 text-[#7A696C] dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                }}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all shadow-lg active:scale-95 ${
                  confirmModal.isDanger 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black'
                }`}
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App JSON Event Inspector Modal */}
      {inspectPayloadModal.isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF7F5] dark:bg-[#14151B] border border-[#B56571]/30 dark:border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
              <h3 className="text-sm font-bold text-[#181617] dark:text-white font-mono">
                {inspectPayloadModal.title}
              </h3>
              <button
                onClick={() => setInspectPayloadModal({ isOpen: false, title: '', payload: null })}
                className="text-[#7A696C] hover:text-black dark:hover:text-white text-sm font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto bg-black/90 rounded-xl p-4 border border-white/10 font-mono text-xs text-emerald-400">
              <pre>{JSON.stringify(inspectPayloadModal.payload, null, 2)}</pre>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectPayloadModal({ isOpen: false, title: '', payload: null })}
                className="px-5 py-2 rounded-xl text-xs font-mono bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE USER DETAILS & ORDERS MODAL */}
      {isUserDetailModalOpen && selectedUserDetail && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in font-sans">
          <div className="bg-[#FAF7F5] dark:bg-[#111216] border border-[#B56571]/30 dark:border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-black/[0.08] dark:border-neutral-800/80 bg-white/70 dark:bg-[#16171D]/70 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {selectedUserDetail.user?.avatar ? (
                    <img
                      src={selectedUserDetail.user.avatar}
                      alt="avatar"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#B56571]/40 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8A434E] to-[#B56571] text-white flex items-center justify-center font-bold text-xl uppercase shadow-md font-serif">
                      {selectedUserDetail.user?.name ? selectedUserDetail.user.name.charAt(0) : 'U'}
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#181617] dark:text-white font-serif">
                        {selectedUserDetail.user?.name || 'Discreet Sanctuary Member'}
                      </h3>
                      {selectedUserDetail.user?.isAdmin && (
                        <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                          SUPER ADMIN
                        </span>
                      )}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#A33F4D]/10 dark:bg-[#D98A92]/15 text-[#A33F4D] dark:text-[#D98A92] border border-[#B56571]/30">
                        <FontAwesomeIcon icon={faCrown} className="mr-1 text-[9px]" />
                        {selectedUserDetail.user?.tier || 'Silver Member'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#7A696C] dark:text-neutral-400 font-mono">
                      <span className="text-[#181617] dark:text-neutral-200 font-medium">
                        ✉ {selectedUserDetail.user?.email}
                      </span>
                      {selectedUserDetail.user?.phone && (
                        <span>📞 {selectedUserDetail.user.phone}</span>
                      )}
                      <span>
                        ID: <code className="text-[11px] text-[#A33F4D] dark:text-[#D98A92]">{selectedUserDetail.user?.id}</code>
                      </span>
                      <span>
                        Joined: {selectedUserDetail.user?.createdAt ? new Date(selectedUserDetail.user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsUserDetailModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 text-[#7A696C] hover:text-black dark:text-neutral-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-sm" />
                </button>
              </div>

              {/* Summary KPIs Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 font-mono text-xs">
                <div className="bg-[#FAF7F5] dark:bg-[#0E0F12] border border-[#B56571]/20 dark:border-neutral-800/80 p-3 rounded-xl">
                  <span className="text-[10px] text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider block">Total Orders</span>
                  <strong className="text-base text-[#181617] dark:text-white font-bold">
                    {selectedUserDetail.metrics?.totalOrders || selectedUserDetail.orders?.length || 0}
                  </strong>
                </div>

                <div className="bg-[#FAF7F5] dark:bg-[#0E0F12] border border-[#B56571]/20 dark:border-neutral-800/80 p-3 rounded-xl">
                  <span className="text-[10px] text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider block">Lifetime Spend (LTV)</span>
                  <strong className="text-base text-[#A33F4D] dark:text-[#D98A92] font-bold">
                    ₹{(selectedUserDetail.metrics?.totalSpent || 0).toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="bg-[#FAF7F5] dark:bg-[#0E0F12] border border-[#B56571]/20 dark:border-neutral-800/80 p-3 rounded-xl">
                  <span className="text-[10px] text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider block">Avg. Order Value</span>
                  <strong className="text-base text-emerald-600 dark:text-emerald-400 font-bold">
                    ₹{(selectedUserDetail.metrics?.avgOrderValue || 0).toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="bg-[#FAF7F5] dark:bg-[#0E0F12] border border-[#B56571]/20 dark:border-neutral-800/80 p-3 rounded-xl">
                  <span className="text-[10px] text-[#7A696C] dark:text-neutral-400 uppercase tracking-wider block">Sanctuary Rewards</span>
                  <strong className="text-base text-amber-600 dark:text-amber-400 font-bold">
                    {selectedUserDetail.user?.points || 200} pts
                  </strong>
                </div>
              </div>

              {/* Subtabs Bar */}
              <div className="flex items-center space-x-2 mt-5 border-b border-black/[0.08] dark:border-neutral-800 pb-2 overflow-x-auto">
                <button
                  onClick={() => setUserModalTab('orders')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                    userModalTab === 'orders'
                      ? 'bg-[#A33F4D] text-white dark:bg-[#D98A92] dark:text-black shadow-md'
                      : 'text-[#7A696C] dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={faBoxOpen} className="text-xs" />
                  <span>Orders History ({selectedUserDetail.orders?.length || 0})</span>
                </button>

                <button
                  onClick={() => setUserModalTab('addresses')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                    userModalTab === 'addresses'
                      ? 'bg-[#A33F4D] text-white dark:bg-[#D98A92] dark:text-black shadow-md'
                      : 'text-[#7A696C] dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                  <span>Saved Addresses ({selectedUserDetail.addresses?.length || 0})</span>
                </button>

                <button
                  onClick={() => setUserModalTab('activity')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                    userModalTab === 'activity'
                      ? 'bg-[#A33F4D] text-white dark:bg-[#D98A92] dark:text-black shadow-md'
                      : 'text-[#7A696C] dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={faClock} className="text-xs" />
                  <span>Activity Logs ({selectedUserDetail.activityLogs?.length || 0})</span>
                </button>

                <button
                  onClick={() => setUserModalTab('edit')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                    userModalTab === 'edit'
                      ? 'bg-[#A33F4D] text-white dark:bg-[#D98A92] dark:text-black shadow-md'
                      : 'text-[#7A696C] dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={faUserGear} className="text-xs" />
                  <span>Member Privileges</span>
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              
              {/* TAB 1: ORDERS HISTORY */}
              {userModalTab === 'orders' && (
                <div className="space-y-4">
                  {(!selectedUserDetail.orders || selectedUserDetail.orders.length === 0) ? (
                    <div className="p-12 text-center border border-dashed border-[#B56571]/25 dark:border-neutral-800 rounded-2xl space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF3F0] dark:bg-neutral-800 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92]">
                        <FontAwesomeIcon icon={faBoxOpen} className="text-lg" />
                      </div>
                      <h4 className="text-sm font-bold text-[#181617] dark:text-white">No Orders Placed Yet</h4>
                      <p className="text-xs text-[#7A696C] dark:text-neutral-400 font-mono">This customer has registered but hasn't completed a transaction.</p>
                    </div>
                  ) : (
                    selectedUserDetail.orders.map((order, idx) => (
                      <div 
                        key={order.id || idx}
                        className="bg-white dark:bg-[#16171D] border border-[#B56571]/25 dark:border-neutral-800 rounded-2xl p-5 space-y-3.5 shadow-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.06] dark:border-neutral-800 pb-3">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono font-bold text-sm text-[#181617] dark:text-white">
                              Order #{order.orderNumber || order.id}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' 
                                : order.status === 'Shipped' || order.status === 'In Transit'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                            }`}>
                              {order.status || 'Paid'}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              🛡️ {order.packagingType || 'Discreet Plain Box'}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono block">
                              {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                            </span>
                            <strong className="text-sm font-mono font-bold text-[#A33F4D] dark:text-[#D98A92]">
                              ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                            </strong>
                          </div>
                        </div>

                        {/* Order Items Listing (Clean Full-Width Stacked Layout) */}
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#7A696C] dark:text-neutral-400">
                            Purchased Items ({order.items?.length || 1})
                          </span>
                          <div className="space-y-2">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((it, itemIdx) => (
                                <div 
                                  key={itemIdx} 
                                  className="bg-[#FAF7F5] dark:bg-[#0E0F12] p-3 rounded-xl flex items-center justify-between text-xs border border-black/[0.04] dark:border-neutral-800 hover:border-[#B56571]/30 transition-colors"
                                >
                                  <div className="flex items-center space-x-3 truncate mr-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#FAF3F0] dark:bg-[#1C1D24] border border-[#B56571]/20 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92] shrink-0 font-bold text-xs">
                                      <FontAwesomeIcon icon={faBoxOpen} className="text-xs" />
                                    </div>
                                    <div className="truncate">
                                      <strong className="text-[#181617] dark:text-white block truncate text-xs sm:text-sm">
                                        {it.name || it.productName || 'Luxury Intimate Device'}
                                      </strong>
                                      <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono">
                                        <span className="bg-black/5 dark:bg-white/10 px-1.5 py-0.2 rounded text-[10px] font-bold text-[#181617] dark:text-neutral-200">
                                          Qty: {it.quantity || 1}
                                        </span>
                                        <span>•</span>
                                        <span>Unit Price: ₹{(it.price || 0).toLocaleString('en-IN')}</span>
                                        {it.color && (
                                          <>
                                            <span>•</span>
                                            <span>Color: {it.color}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-[10px] text-[#7A696C] dark:text-neutral-400 font-mono block">Subtotal</span>
                                    <strong className="font-mono font-bold text-sm text-[#A33F4D] dark:text-[#D98A92]">
                                      ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                                    </strong>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="bg-[#FAF7F5] dark:bg-[#0E0F12] p-3 rounded-xl flex items-center justify-between text-xs border border-black/[0.04] dark:border-neutral-800">
                                <div className="flex items-center space-x-2">
                                  <FontAwesomeIcon icon={faBoxOpen} className="text-[#A33F4D] dark:text-[#D98A92]" />
                                  <strong className="text-[#181617] dark:text-white">Luxury Intimate Device Package</strong>
                                </div>
                                <span className="font-mono font-bold text-[#A33F4D] dark:text-[#D98A92]">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Delivery & Accurate Payment Method Details */}
                        <div className="pt-2 text-[11px] font-mono text-[#7A696C] dark:text-neutral-400 border-t border-black/[0.04] dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center space-x-1.5">
                            <span>📍 Deliver To:</span>
                            <strong className="text-[#181617] dark:text-neutral-200 font-medium">
                              {typeof order.shippingAddress === 'string' && order.shippingAddress 
                                ? order.shippingAddress 
                                : `${order.shippingAddress?.addressLine1 || ''} ${order.shippingAddress?.city || order.customerCity || 'Mumbai'}, ${order.shippingAddress?.state || order.customerState || 'Maharashtra'} - ${order.shippingAddress?.postalCode || order.customerPincode || ''}`}
                            </strong>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span>Payment Method:</span>
                            {(() => {
                              const pay = (order.paymentMode || order.paymentMethod || order.payment_mode || 'Cash on Delivery (COD)').trim();
                              const isCOD = pay.toLowerCase().includes('cod') || pay.toLowerCase().includes('cash on delivery');
                              return (
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isCOD 
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60' 
                                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                                }`}>
                                  <span>{isCOD ? '💵' : '💳'}</span>
                                  <span>{pay}</span>
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: SAVED ADDRESSES */}
              {userModalTab === 'addresses' && (
                <div className="space-y-4">
                  {(!selectedUserDetail.addresses || selectedUserDetail.addresses.length === 0) ? (
                    <div className="p-12 text-center border border-dashed border-[#B56571]/25 dark:border-neutral-800 rounded-2xl space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF3F0] dark:bg-neutral-800 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92]">
                        <FontAwesomeIcon icon={faLocationDot} className="text-lg" />
                      </div>
                      <h4 className="text-sm font-bold text-[#181617] dark:text-white">No Saved Addresses Found</h4>
                      <p className="text-xs text-[#7A696C] dark:text-neutral-400 font-mono">This customer has not saved any delivery addresses in their profile.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {selectedUserDetail.addresses.map((addr, aIdx) => (
                        <div key={addr.id || aIdx} className="bg-white dark:bg-[#16171D] border border-[#B56571]/25 dark:border-neutral-800 rounded-2xl p-4 space-y-2 relative shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-[#A33F4D]/10 dark:bg-[#D98A92]/15 text-[#A33F4D] dark:text-[#D98A92]">
                              🏷️ {addr.label || addr.addressTag || 'Home'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                Default Address
                              </span>
                            )}
                          </div>

                          <div className="text-xs space-y-1">
                            <h5 className="font-bold text-[#181617] dark:text-white">{addr.receiverName || addr.recipientName || 'Recipient'}</h5>
                            <p className="text-[#5C4F52] dark:text-neutral-300 font-mono text-[11px]">
                              <span className="text-[#7A696C] dark:text-neutral-500">Phone:</span> {addr.phone || 'Unspecified'}
                            </p>
                            <p className="text-[#7A696C] dark:text-neutral-400 font-sans leading-relaxed">
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                              {addr.landmark && ` (Near ${addr.landmark})`}
                              <br />
                              {addr.city}, {addr.state} - <strong>{addr.pincode || addr.postalCode}</strong>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ACTIVITY LOGS */}
              {userModalTab === 'activity' && (
                <div className="space-y-3 font-mono text-xs">
                  {(!selectedUserDetail.activityLogs || selectedUserDetail.activityLogs.length === 0) ? (
                    <div className="p-12 text-center border border-dashed border-[#B56571]/25 dark:border-neutral-800 rounded-2xl space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF3F0] dark:bg-neutral-800 flex items-center justify-center text-[#A33F4D] dark:text-[#D98A92]">
                        <FontAwesomeIcon icon={faClock} className="text-lg" />
                      </div>
                      <h4 className="text-sm font-bold text-[#181617] dark:text-white">No Activity Records Yet</h4>
                      <p className="text-xs text-[#7A696C] dark:text-neutral-400">Events are recorded automatically on user actions.</p>
                    </div>
                  ) : (
                    selectedUserDetail.activityLogs.map((log, lIdx) => (
                      <div key={log.id || lIdx} className="bg-white dark:bg-[#16171D] border border-[#B56571]/20 dark:border-neutral-800 p-3.5 rounded-xl flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-[#A33F4D] dark:text-[#D98A92]">{log.eventType}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${log.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              {log.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 mt-1 font-sans">
                            {JSON.stringify(log.payload)}
                          </p>
                        </div>
                        <span className="text-[10px] text-neutral-400 shrink-0">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: MEMBER PRIVILEGES & TIER EDIT */}
              {userModalTab === 'edit' && (
                <form onSubmit={handleUpdateUserSubmit} className="space-y-4 max-w-xl mx-auto font-sans text-xs">
                  <div className="bg-white dark:bg-[#16171D] border border-[#B56571]/20 dark:border-neutral-800 rounded-2xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-[#181617] dark:text-white font-serif">
                      Edit Member Privileges & Tier
                    </h4>

                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">
                        Full Customer Name
                      </label>
                      <input
                        type="text"
                        value={editUserForm.name}
                        onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editUserForm.phone}
                        onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">
                          VIP Tier Status
                        </label>
                        <select
                          value={editUserForm.tier}
                          onChange={(e) => setEditUserForm({ ...editUserForm, tier: e.target.value })}
                          className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
                        >
                          <option value="Silver Member">Silver Member</option>
                          <option value="Gold VIP Member">Gold VIP Member</option>
                          <option value="Platinum VIP">Platinum VIP</option>
                          <option value="Black Diamond VIP">Black Diamond VIP</option>
                          <option value="Super Admin">Super Admin</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#5C4F52] dark:text-neutral-400 font-mono text-[11px] mb-1">
                          Sanctuary Reward Points
                        </label>
                        <input
                          type="number"
                          value={editUserForm.points}
                          onChange={(e) => setEditUserForm({ ...editUserForm, points: Number(e.target.value) })}
                          className="w-full bg-[#FAF7F5] dark:bg-black border border-[#B56571]/25 dark:border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571] font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isUpdatingUser}
                        className="bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black px-6 py-2.5 rounded-xl font-mono font-bold uppercase tracking-wider text-xs cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isUpdatingUser ? 'Saving...' : 'Save Privileges'}
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  {selectedUserDetail.user?.email !== '20092003pardeep@gmail.com' && (
                    <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-2">
                      <h5 className="font-bold text-red-600 dark:text-red-400 font-mono">Danger Zone</h5>
                      <p className="text-[11px] text-[#7A696C] dark:text-neutral-400">
                        Permanently remove this customer record and their access credentials from SQLite.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(selectedUserDetail.user)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold cursor-pointer transition-all shadow"
                      >
                        Delete Member Account
                      </button>
                    </div>
                  )}
                </form>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white/50 dark:bg-[#16171D]/50 border-t border-black/[0.08] dark:border-neutral-800 flex justify-between items-center text-xs font-mono text-[#7A696C] dark:text-neutral-400">
              <span>Encrypted User Record: <code className="text-[#A33F4D] dark:text-[#D98A92]">{selectedUserDetail.user?.id}</code></span>
              <button
                onClick={() => setIsUserDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#181617] dark:text-white font-bold cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
