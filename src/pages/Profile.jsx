import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAward, 
  faPenToSquare, 
  faBoxOpen, 
  faLocationDot, 
  faShieldHalved, 
  faHeadset, 
  faCircleCheck,
  faChevronRight,
  faRightFromBracket,
  faUser,
  faTrashCan,
  faTriangleExclamation,
  faPlus,
  faPhone,
  faEnvelope,
  faHouse,
  faBuilding,
  faCheck,
  faStar,
  faTrash,
  faFloppyDisk,
  faLock,
  faTruckFast,
  faRotateRight,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';
import { 
  validateEmail, 
  validatePhone, 
  validatePincode, 
  validateName, 
  validateAddress,
  sanitizeText 
} from '../utils/validation';

export const Profile = () => {
  const { 
    user, 
    navigateTo, 
    showToast, 
    logout, 
    clearCart, 
    setUser, 
    updateProfile,
    savedAddresses,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    ordersList,
    fetchOrders
  } = useApp();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Profile Edit Modal State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Order History & Tracking State
  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(null);

  // Auto-sync orders whenever profile opens or user email changes
  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
    }
  }, [user?.email]);

  // Saved Addresses Management State
  const [showAddressManagerModal, setShowAddressManagerModal] = useState(false);
  const [showAddEditAddressModal, setShowAddEditAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressErrors, setAddressErrors] = useState({});
  const [addressForm, setAddressForm] = useState({
    receiverName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    label: 'Home',
    isDefault: false
  });

  // Filter orders for the current user
  const userOrders = (ordersList || []).filter(order => {
    if (user?.isAdmin) return true;
    if (!order.customerEmail || !user?.email) return false;
    return order.customerEmail.toLowerCase() === user.email.toLowerCase();
  });

  // If unauthenticated guest
  if (!user?.isLoggedIn) {
    return (
      <div 
        className="min-h-screen pt-28 md:pt-36 px-margin-mobile md:px-margin-desktop pb-32 font-sans relative bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center"
        style={{ backgroundImage: `url('/bg/profile-bg.jpg')` }}
      >
        <div className="relative z-10 max-w-md w-full mx-auto p-8 rounded-3xl bg-white/90 dark:bg-[#16171C]/90 backdrop-blur-xl border border-[#B56571]/30 dark:border-white/15 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-[#B56571]/15 border border-[#B56571]/35 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center mx-auto text-3xl shadow-sm">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl text-[#181617] dark:text-white font-serif font-bold">
              Private Sanctuary Access
            </h1>
            <p className="text-xs text-[#5C4F52] dark:text-neutral-300 font-light leading-relaxed">
              Please authenticate to view your encrypted order history, member benefits, and confidential preferences.
            </p>
          </div>
          <button
            onClick={() => navigateTo('login')}
            className="w-full bg-gradient-to-r from-[#B56571] to-[#8A434E] hover:from-[#A33F4D] hover:to-[#732C37] text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold cursor-pointer transition-all shadow-lg active:scale-95 border border-white/20"
          >
            Log In to Account
          </button>
        </div>
      </div>
    );
  }

  const userName = user?.name || 'Sanctuary Member';
  const userEmail = user?.email || 'member@midnightbloom.in';
  const userPhone = user?.phone || '';
  const userTier = user?.tier || (user?.isAdmin ? 'Super Admin' : 'Silver Member');
  const userPoints = typeof user?.points === 'number' ? user.points : (user?.isAdmin ? 9999 : 150);
  const userMaxPoints = typeof user?.maxPoints === 'number' && user.maxPoints > 0 ? user.maxPoints : (user?.isAdmin ? 9999 : 1000);
  const progressPercent = Math.min(100, Math.max(0, Math.round((userPoints / userMaxPoints) * 100)));

  const handleOpenEditProfile = () => {
    setProfileErrors({});
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const errors = {};

    const nameCheck = validateName(profileForm.name, 'Full Name / Discreet Alias');
    if (!nameCheck.isValid) {
      errors.name = nameCheck.error;
    }

    if (profileForm.phone) {
      const phoneCheck = validatePhone(profileForm.phone);
      if (!phoneCheck.isValid) {
        errors.phone = phoneCheck.error;
      }
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      showToast(Object.values(errors)[0], 'warning');
      return;
    }

    setProfileErrors({});
    updateProfile({
      name: sanitizeText(profileForm.name),
      phone: profileForm.phone ? validatePhone(profileForm.phone).value : ''
    });
    setShowEditProfileModal(false);
    showToast('Member profile updated successfully.', 'success');
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressErrors({});
    setAddressForm({
      receiverName: user?.name || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '',
      label: 'Home',
      isDefault: savedAddresses.length === 0
    });
    setShowAddEditAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressErrors({});
    setAddressForm({
      receiverName: addr.receiverName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || 'Mumbai',
      state: addr.state || 'Maharashtra',
      pincode: addr.pincode || '',
      label: addr.label || 'Home',
      isDefault: Boolean(addr.isDefault)
    });
    setShowAddEditAddressModal(true);
  };

  const handleSaveAddressForm = async (e) => {
    e.preventDefault();
    const errors = {};

    const nameCheck = validateName(addressForm.receiverName, 'Receiver Name');
    if (!nameCheck.isValid) errors.receiverName = nameCheck.error;

    const phoneCheck = validatePhone(addressForm.phone);
    if (!phoneCheck.isValid) errors.phone = phoneCheck.error;

    const addrCheck = validateAddress(addressForm.addressLine1, 'Street Address');
    if (!addrCheck.isValid) errors.addressLine1 = addrCheck.error;

    const cityCheck = validateName(addressForm.city, 'City');
    if (!cityCheck.isValid) errors.city = cityCheck.error;

    const stateCheck = validateName(addressForm.state, 'State');
    if (!stateCheck.isValid) errors.state = stateCheck.error;

    const pinCheck = validatePincode(addressForm.pincode);
    if (!pinCheck.isValid) errors.pincode = pinCheck.error;

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      showToast(Object.values(errors)[0], 'warning');
      return;
    }

    setAddressErrors({});
    const cleanPayload = {
      receiverName: sanitizeText(addressForm.receiverName),
      phone: phoneCheck.value,
      addressLine1: sanitizeText(addressForm.addressLine1),
      addressLine2: sanitizeText(addressForm.addressLine2 || ''),
      city: sanitizeText(addressForm.city),
      state: sanitizeText(addressForm.state),
      pincode: pinCheck.value,
      label: addressForm.label || 'Home',
      isDefault: Boolean(addressForm.isDefault)
    };

    if (editingAddressId) {
      await updateSavedAddress(editingAddressId, cleanPayload);
    } else {
      await addSavedAddress(cleanPayload);
    }
    setShowAddEditAddressModal(false);
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    try {
      localStorage.removeItem('mb_user');
      localStorage.removeItem('velour_age_verified');
      localStorage.removeItem('mb_admin_token');
      localStorage.removeItem('mb_cart');
      localStorage.removeItem('mb_saved_addresses');
      localStorage.removeItem('mb_env_config');
    } catch (e) {}

    clearCart();
    setUser({ isLoggedIn: false, name: '', email: '', phone: '', isAdmin: false });
    setShowDeleteModal(false);
    setIsDeleting(false);
    showToast('Your account and confidential session footprints have been permanently purged.', 'info');
    navigateTo('home');
  };

  return (
    <div 
      className="min-h-screen pt-32 sm:pt-36 md:pt-40 px-margin-mobile md:px-margin-desktop pb-36 font-sans relative bg-cover bg-center bg-no-repeat bg-fixed text-[#181617] dark:text-[#EAE0E1] transition-colors"
      style={{ backgroundImage: `url('/bg/profile-bg.jpg')` }}
    >
      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
      
      {/* Profile Header with Direct Edit Trigger */}
      <section className="flex flex-col items-center justify-center pt-4 pb-2">
        <div className="relative w-28 h-28 mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#8F3340] to-[#B56571] text-white flex items-center justify-center font-serif text-3xl font-bold border-2 border-[#B56571]/40 dark:border-[#D98A92]/40 shadow-[0_0_25px_rgba(181,101,113,0.25)] select-none">
            {userName ? userName.charAt(0).toUpperCase() : 'M'}
          </div>
          <button 
            onClick={handleOpenEditProfile}
            title="Edit Profile Details"
            className="absolute bottom-0 right-0 bg-white dark:bg-[#18191E] p-2 rounded-full border border-[#B56571]/30 dark:border-[#D98A92]/30 text-[#A33F4D] dark:text-[#D98A92] shadow-lg cursor-pointer hover:bg-[#FAF3F0] dark:hover:bg-[#20222A] hover:scale-110 transition-all active:scale-95"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
          </button>
        </div>
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl text-[#181617] dark:text-white font-serif font-bold">
              {userName}
            </h1>
            <button
              onClick={handleOpenEditProfile}
              className="text-xs text-[#A33F4D] dark:text-[#D98A92] hover:underline font-mono font-medium"
            >
              (Edit)
            </button>
          </div>
          <p className="text-xs text-[#7A696C] dark:text-[#9E8286] font-mono">{userEmail}{userPhone ? ` • ${userPhone}` : ''}</p>
        </div>
      </section>

      {/* Membership Tier Banner */}
      <section className="bg-white/90 dark:bg-[#18191E]/90 backdrop-blur-xl p-6 rounded-3xl border border-[#B56571]/30 dark:border-white/15 shadow-2xl space-y-4 transition-colors">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-[#A33F4D] dark:text-[#D98A92] uppercase tracking-widest font-semibold mb-1 font-mono">
              Membership Status
            </p>
            <h2 className="text-xl font-serif font-bold text-[#181617] dark:text-white">
              {userTier}
            </h2>
          </div>
          <FontAwesomeIcon icon={faAward} className="text-[#A33F4D] dark:text-[#D98A92] text-3xl" />
        </div>

        <div>
          <div className="flex justify-between text-xs text-[#5C4F52] dark:text-neutral-400 mb-2 font-mono">
            <span>Progress to Platinum Sanctuary</span>
            <span>{userPoints} / {userMaxPoints} pts</span>
          </div>
          <div className="w-full bg-[#FAF3F0] dark:bg-black/60 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#D98A92] to-[#B56571] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <ul className="space-y-2 pt-2 border-t border-black/[0.06] dark:border-white/5 text-xs text-[#5C4F52] dark:text-neutral-300">
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#A33F4D] dark:text-[#D98A92] text-xs" />
            <span>Complimentary Plain Express Courier on all orders</span>
          </li>
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#A33F4D] dark:text-[#D98A92] text-xs" />
            <span>Early Access to Limited Edition Artisanal Pieces</span>
          </li>
        </ul>
      </section>

      {/* Account Sanctuary Services & Actions */}
      <section className="space-y-3.5">
        <div className="px-1 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#F0B8BE] dark:text-[#D98A92]">
            Sanctuary Controls
          </span>
          <span className="text-[10px] font-mono text-[#7A696C] dark:text-neutral-400">Encrypted 256-bit</span>
        </div>

        {/* 1. Order History */}
        <button 
          onClick={() => setShowOrderHistoryModal(true)}
          className="w-full bg-white/90 dark:bg-[#18191E]/90 backdrop-blur-xl border border-[#B56571]/25 dark:border-white/10 hover:border-[#B56571]/60 hover:bg-white dark:hover:bg-[#20222A] p-4.5 sm:p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 group cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-[#B56571]/15 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center shrink-0 border border-[#B56571]/30 group-hover:scale-105 transition-transform shadow-xs">
              <FontAwesomeIcon icon={faBoxOpen} className="text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#181617] dark:text-white group-hover:text-[#A33F4D] dark:group-hover:text-[#F0B8BE] transition-colors">
                  Order History & Encrypted Tracking
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#B56571]/20 text-[#A33F4D] dark:text-[#D98A92]">
                  {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>
              <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-light mt-0.5">
                Live dispatch updates, plain box tracking & COD receipts
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#B56571] group-hover:text-white transition-all text-[#7A696C] dark:text-neutral-400">
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </div>
        </button>

        {/* 2. Saved Delivery Addresses (Interactive Address Manager) */}
        <button 
          onClick={() => setShowAddressManagerModal(true)}
          className="w-full bg-white/90 dark:bg-[#18191E]/90 backdrop-blur-xl border border-[#B56571]/25 dark:border-white/10 hover:border-[#B56571]/60 hover:bg-white dark:hover:bg-[#20222A] p-4.5 sm:p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 group cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-[#B56571]/15 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center shrink-0 border border-[#B56571]/30 group-hover:scale-105 transition-transform shadow-xs">
              <FontAwesomeIcon icon={faLocationDot} className="text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#181617] dark:text-white group-hover:text-[#A33F4D] dark:group-hover:text-[#F0B8BE] transition-colors">
                  Saved Plain Delivery Destinations
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#B56571]/20 text-[#A33F4D] dark:text-[#D98A92]">
                  {savedAddresses.length} saved
                </span>
              </div>
              <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-light mt-0.5">
                Add, edit, or set default delivery addresses for discreet checkout
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#B56571] group-hover:text-white transition-all text-[#7A696C] dark:text-neutral-400">
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </div>
        </button>

        {/* 3. Privacy & Session Anonymity */}
        <button 
          onClick={() => navigateTo('privacy')}
          className="w-full bg-white/90 dark:bg-[#18191E]/90 backdrop-blur-xl border border-[#B56571]/25 dark:border-white/10 hover:border-[#B56571]/60 hover:bg-white dark:hover:bg-[#20222A] p-4.5 sm:p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 group cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-[#B56571]/15 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center shrink-0 border border-[#B56571]/30 group-hover:scale-105 transition-transform shadow-xs">
              <FontAwesomeIcon icon={faShieldHalved} className="text-base" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#181617] dark:text-white group-hover:text-[#A33F4D] dark:group-hover:text-[#F0B8BE] transition-colors">
                Privacy & Session Anonymity Settings
              </h4>
              <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-light mt-0.5">
                Billing descriptor preferences & browser data privacy
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#B56571] group-hover:text-white transition-all text-[#7A696C] dark:text-neutral-400">
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </div>
        </button>

        {/* 4. Confidential Concierge */}
        <button 
          onClick={() => navigateTo('contact')}
          className="w-full bg-white/90 dark:bg-[#18191E]/90 backdrop-blur-xl border border-[#B56571]/25 dark:border-white/10 hover:border-[#B56571]/60 hover:bg-white dark:hover:bg-[#20222A] p-4.5 sm:p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 group cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-[#B56571]/15 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center shrink-0 border border-[#B56571]/30 group-hover:scale-105 transition-transform shadow-xs">
              <FontAwesomeIcon icon={faHeadset} className="text-base" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#181617] dark:text-white group-hover:text-[#A33F4D] dark:group-hover:text-[#F0B8BE] transition-colors">
                24/7 Confidential Concierge Assistance
              </h4>
              <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-light mt-0.5">
                Private support with product selection & discreet questions
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#B56571] group-hover:text-white transition-all text-[#7A696C] dark:text-neutral-400">
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </div>
        </button>

        {/* 5. Delete Account & Purge Data (Right to be Forgotten) */}
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-950/20 hover:bg-red-950/40 backdrop-blur-xl border border-red-500/25 hover:border-red-500/50 p-4.5 sm:p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 group cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30 group-hover:scale-105 transition-transform shadow-xs">
              <FontAwesomeIcon icon={faTrashCan} className="text-base" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-400 group-hover:text-red-300 transition-colors">
                Delete Account & Purge Confidential Data
              </h4>
              <p className="text-[11px] text-red-300/70 font-light mt-0.5">
                Right to be Forgotten: Permanently erase credentials, addresses & local session footprints
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all text-red-400">
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </div>
        </button>
      </section>

      {/* Standalone Luxury Logout Action Button */}
      <section className="pt-2">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full bg-white/90 dark:bg-[#18191E]/90 hover:bg-[#FAF3F0] dark:hover:bg-[#20222A] backdrop-blur-xl border border-[#B56571]/30 hover:border-[#D98A92]/70 dark:border-white/10 dark:hover:border-[#D98A92]/50 p-4.5 sm:p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-300 group cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-[#B56571]/15 text-[#A33F4D] dark:text-[#D98A92] group-hover:bg-[#B56571] group-hover:text-white flex items-center justify-center shrink-0 border border-[#B56571]/30 group-hover:scale-105 transition-all shadow-xs">
              <FontAwesomeIcon icon={faRightFromBracket} className="text-base" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#181617] dark:text-white group-hover:text-[#A33F4D] dark:group-hover:text-[#F0B8BE] transition-colors">
                End Private Session
              </h4>
              <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-light mt-0.5">
                Discreetly exit account & clear local encrypted session tokens
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#A33F4D] dark:text-[#D98A92] group-hover:underline px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            Sign Out
          </span>
        </button>
      </section>

      </div>

      {/* 🛡️ MODAL 1: Luxury Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF7F5] dark:bg-[#14151B] border border-[#B56571]/30 dark:border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#B56571]/20 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center">
                  <FontAwesomeIcon icon={faPenToSquare} className="text-sm" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#181617] dark:text-white font-serif">
                    Edit Member Profile
                  </h3>
                  <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono">
                    Confidential Alias & Contact
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#7A696C] hover:text-black dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#5C4F52] dark:text-neutral-300 mb-1.5">
                  Full Name / Discreet Alias <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, name: e.target.value });
                      if (profileErrors.name) setProfileErrors({ ...profileErrors, name: null });
                    }}
                    placeholder="e.g. Pardeep Kumar"
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl py-3 px-4 text-xs text-[#181617] dark:text-white focus:outline-none font-sans transition-all ${
                      profileErrors.name 
                        ? 'border-red-500 ring-1 ring-red-500/50' 
                        : 'border-[#B56571]/25 dark:border-white/15 focus:border-[#B56571]'
                    }`}
                  />
                </div>
                {profileErrors.name && (
                  <p className="text-[11px] text-red-500 font-mono mt-1 flex items-center gap-1">
                    <span>⚠</span> {profileErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#5C4F52] dark:text-neutral-300 mb-1.5">
                  Mobile Number (For Courier COD Delivery Updates)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, phone: e.target.value });
                      if (profileErrors.phone) setProfileErrors({ ...profileErrors, phone: null });
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl py-3 px-4 text-xs text-[#181617] dark:text-white focus:outline-none font-mono transition-all ${
                      profileErrors.phone 
                        ? 'border-red-500 ring-1 ring-red-500/50' 
                        : 'border-[#B56571]/25 dark:border-white/15 focus:border-[#B56571]'
                    }`}
                  />
                </div>
                {profileErrors.phone && (
                  <p className="text-[11px] text-red-500 font-mono mt-1 flex items-center gap-1">
                    <span>⚠</span> {profileErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-bold text-[#5C4F52] dark:text-neutral-300">
                    Confidential Email
                  </label>
                  <span className="text-[10px] font-mono text-[#A33F4D] dark:text-[#D98A92] flex items-center gap-1 font-bold">
                    <FontAwesomeIcon icon={faLock} className="text-[9px]" />
                    <span>Locked / Read-Only</span>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || profileForm.email}
                    disabled
                    readOnly
                    className="w-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 text-xs text-[#7A696C] dark:text-neutral-400 font-mono cursor-not-allowed select-none opacity-80"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A696C] dark:text-neutral-400">
                    <FontAwesomeIcon icon={faLock} className="text-xs" />
                  </div>
                </div>
                <p className="text-[10px] text-[#7A696C] dark:text-neutral-400 font-light mt-1.5 flex items-center gap-1">
                  <FontAwesomeIcon icon={faCircleInfo} className="text-[10px] text-[#A33F4D] dark:text-[#D98A92] shrink-0" />
                  <span>Account email is permanently linked to your authentication credentials & order history and cannot be altered.</span>
                </p>
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-black/5 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono border border-black/10 dark:border-white/10 text-[#7A696C] dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black cursor-pointer shadow-lg active:scale-95 flex items-center space-x-1.5"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📦 MODAL 2: Saved Delivery Addresses Manager Modal */}
      {showAddressManagerModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF7F5] dark:bg-[#14151B] border border-[#B56571]/30 dark:border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#B56571]/20 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center">
                  <FontAwesomeIcon icon={faLocationDot} className="text-sm" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#181617] dark:text-white font-serif">
                    Saved Plain Delivery Destinations
                  </h3>
                  <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono">
                    Encrypted Doorstep Addresses
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddressManagerModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#7A696C] hover:text-black dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-[#7A696C] dark:text-neutral-400">
                {savedAddresses.length} saved destination{savedAddresses.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleOpenAddAddress}
                className="btn-gold text-xs px-4 py-2 rounded-xl text-white font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Address List Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {savedAddresses.length === 0 ? (
                <div className="text-center py-10 space-y-3 bg-white/50 dark:bg-black/30 rounded-2xl border border-dashed border-[#B56571]/30">
                  <FontAwesomeIcon icon={faLocationDot} className="text-3xl text-[#7A696C] opacity-40" />
                  <p className="text-xs text-[#7A696C] dark:text-neutral-400">
                    No saved addresses yet. Add your first delivery destination!
                  </p>
                  <button
                    onClick={handleOpenAddAddress}
                    className="text-xs text-[#A33F4D] dark:text-[#D98A92] font-bold font-mono hover:underline cursor-pointer"
                  >
                    + Add Plain Delivery Address
                  </button>
                </div>
              ) : (
                savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? 'bg-white dark:bg-[#1C1E26] border-[#B56571] dark:border-[#D98A92] shadow-md'
                        : 'bg-white/70 dark:bg-[#16171D] border-black/5 dark:border-white/10 hover:border-[#B56571]/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#181617] dark:text-white font-sans">
                            {addr.receiverName}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[#7A696C] dark:text-neutral-300">
                            {addr.label || 'Home'}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5C4F52] dark:text-neutral-300 font-light leading-relaxed">
                          {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        </p>
                        <p className="text-xs text-[#7A696C] dark:text-neutral-400 font-mono">
                          {addr.city}, {addr.state} - <strong className="text-[#181617] dark:text-white">{addr.pincode}</strong>
                        </p>
                        <p className="text-[11px] text-[#A33F4D] dark:text-[#D98A92] font-mono">
                          📱 {addr.phone}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="p-2 text-xs text-[#7A696C] hover:text-emerald-500 transition-colors cursor-pointer font-mono"
                            title="Set as Default Address"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="p-2 text-xs text-[#7A696C] hover:text-[#181617] dark:hover:text-white transition-colors cursor-pointer"
                          title="Edit Address"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          onClick={() => deleteSavedAddress(addr.id)}
                          className="p-2 text-xs text-[#7A696C] hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete Address"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setShowAddressManagerModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-mono bg-white/10 hover:bg-white/20 text-[#181617] dark:text-white cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 MODAL 3: Add / Edit Single Delivery Address Modal */}
      {showAddEditAddressModal && (
        <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF7F5] dark:bg-[#14151B] border border-[#B56571]/30 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-[#181617] dark:text-white font-serif">
                {editingAddressId ? 'Edit Delivery Destination' : 'Add New Plain Delivery Destination'}
              </h3>
              <button 
                onClick={() => setShowAddEditAddressModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#7A696C] hover:text-black dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddressForm} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#5C4F52] dark:text-neutral-300 mb-1">
                    Receiver Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.receiverName}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, receiverName: e.target.value });
                      if (addressErrors.receiverName) setAddressErrors({ ...addressErrors, receiverName: null });
                    }}
                    placeholder="e.g. Aarav Sharma"
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl py-2.5 px-3 text-xs text-[#181617] dark:text-white focus:outline-none transition-all ${
                      addressErrors.receiverName
                        ? 'border-red-500 ring-1 ring-red-500/50'
                        : 'border-[#B56571]/25 dark:border-white/15 focus:border-[#B56571]'
                    }`}
                  />
                  {addressErrors.receiverName && (
                    <p className="text-[10px] text-red-500 font-mono mt-1">⚠ {addressErrors.receiverName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#5C4F52] dark:text-neutral-300 mb-1">
                    Mobile Number (For Delivery OTP/Call) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, phone: e.target.value });
                      if (addressErrors.phone) setAddressErrors({ ...addressErrors, phone: null });
                    }}
                    placeholder="e.g. 9876543210"
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl py-2.5 px-3 text-xs text-[#181617] dark:text-white focus:outline-none font-mono transition-all ${
                      addressErrors.phone
                        ? 'border-red-500 ring-1 ring-red-500/50'
                        : 'border-[#B56571]/25 dark:border-white/15 focus:border-[#B56571]'
                    }`}
                  />
                  {addressErrors.phone && (
                    <p className="text-[10px] text-red-500 font-mono mt-1">⚠ {addressErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5C4F52] dark:text-neutral-300 mb-1">
                  Street Address (House/Flat No, Apartment, Street) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine1}
                  onChange={(e) => {
                    setAddressForm({ ...addressForm, addressLine1: e.target.value });
                    if (addressErrors.addressLine1) setAddressErrors({ ...addressErrors, addressLine1: null });
                  }}
                  placeholder="e.g. Flat 402, Imperial Towers, 5th Main Road"
                  className={`w-full bg-white dark:bg-black/60 border rounded-xl py-2.5 px-3 text-xs text-[#181617] dark:text-white focus:outline-none transition-all ${
                    addressErrors.addressLine1
                      ? 'border-red-500 ring-1 ring-red-500/50'
                      : 'border-[#B56571]/25 dark:border-white/15 focus:border-[#B56571]'
                  }`}
                />
                {addressErrors.addressLine1 && (
                  <p className="text-[10px] text-red-500 font-mono mt-1">⚠ {addressErrors.addressLine1}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5C4F52] dark:text-neutral-300 mb-1">
                  Landmark / Building Name (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  placeholder="e.g. Near HDFC Bank / Behind Apollo Pharmacy"
                  className="w-full bg-white dark:bg-black/60 border border-[#B56571]/25 dark:border-white/15 rounded-xl py-2.5 px-3 text-xs text-[#181617] dark:text-white focus:outline-none focus:border-[#B56571]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#5C4F52] dark:text-neutral-300 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, city: e.target.value });
                      if (addressErrors.city) setAddressErrors({ ...addressErrors, city: null });
                    }}
                    placeholder="e.g. Mumbai"
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl py-2.5 px-3 text-xs text-[#181617] dark:text-white focus:outline-none transition-all ${
                      addressErrors.city
                        ? 'border-red-500 ring-1 ring-red-500/50'
                        : 'border-[#B56571]/25 dark:border-white/15 focus:border-[#B56571]'
                    }`}
                  />
                  {addressErrors.city && (
                    <p className="text-[10px] text-red-500 font-mono mt-1">⚠ {addressErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#5C4F52] dark:text-neutral-300 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, state: e.target.value });
                      if (addressErrors.state) setAddressErrors({ ...addressErrors, state: null });
                    }}
                    placeholder="e.g. Maharashtra"
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl py-2.5 px-3 text-xs text-[#181617] dark:text-white focus:outline-none transition-all ${
                      addressErrors.state
                        ? 'border-red-500 ring-1 ring-red-500/50'
                        : 'border-[#B56571]/25 dark:border-white/15 focus:border-[#B56571]'
                    }`}
                  />
                  {addressErrors.state && (
                    <p className="text-[10px] text-red-500 font-mono mt-1">⚠ {addressErrors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#5C4F52] dark:text-neutral-300 mb-1">
                    PIN Code (6 digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') });
                      if (addressErrors.pincode) setAddressErrors({ ...addressErrors, pincode: null });
                    }}
                    placeholder="e.g. 400018"
                    className={`w-full bg-white dark:bg-black/60 border rounded-xl py-2.5 px-3 text-xs text-[#181617] dark:text-white focus:outline-none font-mono transition-all ${
                      addressErrors.pincode
                        ? 'border-red-500 ring-1 ring-red-500/50'
                        : 'border-[#B56571]/25 dark:border-white/15 focus:border-[#B56571]'
                    }`}
                  />
                  {addressErrors.pincode && (
                    <p className="text-[10px] text-red-500 font-mono mt-1">⚠ {addressErrors.pincode}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5C4F52] dark:text-neutral-300 mb-1.5">
                  Address Type Label
                </label>
                <div className="flex gap-2">
                  {['Home', 'Work / Office', 'Private Locker', 'Other'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, label: lbl })}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono cursor-pointer border transition-all ${
                        addressForm.label === lbl
                          ? 'bg-[#B56571]/20 border-[#B56571] text-[#A33F4D] dark:text-[#D98A92] font-bold'
                          : 'border-black/10 dark:border-white/10 text-[#7A696C] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="addrDefaultToggle"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="rounded border-[#B56571]/40 text-[#B56571] focus:ring-[#B56571] cursor-pointer"
                />
                <label htmlFor="addrDefaultToggle" className="text-xs text-[#5C4F52] dark:text-neutral-300 cursor-pointer">
                  Set as default delivery address for 1-click COD checkout
                </label>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/10 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddEditAddressModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono border border-black/10 dark:border-white/10 text-[#7A696C] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-6 py-2 rounded-xl text-xs font-mono font-bold text-white cursor-pointer shadow-lg active:scale-95"
                >
                  {editingAddressId ? 'Save Changes' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Luxury In-App Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF7F5] dark:bg-[#14151B] border border-[#B56571]/30 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#B56571]/20 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#181617] dark:text-white font-serif">
                  End Private Session
                </h3>
                <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono">
                  Secure Disconnect
                </p>
              </div>
            </div>
            <p className="text-xs text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-sans">
              Are you sure you want to end your private session? Your cart and profile preferences remain encrypted for your next visit.
            </p>
            <div className="flex justify-end space-x-3 pt-3 border-t border-black/5 dark:border-white/10">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono border border-black/10 dark:border-white/10 text-[#7A696C] dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-[#A33F4D] hover:bg-[#8F3340] text-white dark:bg-[#D98A92] dark:hover:bg-[#C97981] dark:text-black cursor-pointer transition-all shadow-lg active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Luxury In-App Account Deletion Modal (Right to be Forgotten) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF7F5] dark:bg-[#14151B] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-sm" />
              </div>
              <div>
                <h3 className="text-base font-bold text-red-500 font-serif">
                  Permanent Account Deletion
                </h3>
                <p className="text-[10px] text-red-400/80 font-mono uppercase tracking-wider">
                  Zero Footprint • Irreversible Action
                </p>
              </div>
            </div>
            <p className="text-xs text-[#5C4F52] dark:text-neutral-300 leading-relaxed font-sans">
              This action will permanently purge your member profile (<span className="text-[#181617] dark:text-white font-semibold">{userEmail}</span>), wipe all saved delivery addresses, erase your shopping bag, and remove all encrypted session footprints.
            </p>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-300 flex items-start space-x-2">
              <FontAwesomeIcon icon={faShieldHalved} className="text-xs mt-0.5 shrink-0" />
              <span>In accordance with privacy and confidentiality rights, no recovery or data restoration will be possible after deletion.</span>
            </div>
            <div className="flex justify-end space-x-3 pt-3 border-t border-black/5 dark:border-white/10">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono border border-black/10 dark:border-white/10 text-[#7A696C] dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
              >
                Keep Account
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center space-x-1.5"
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                <span>{isDeleting ? 'Purging...' : 'Purge & Delete Forever'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📦 MODAL 4: Luxury Order History & Encrypted Tracking Modal */}
      {showOrderHistoryModal && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-[#FAF7F5] dark:bg-[#14151B] border border-[#B56571]/30 dark:border-white/10 rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#B56571]/20 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center">
                  <FontAwesomeIcon icon={faBoxOpen} className="text-base" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#181617] dark:text-white font-serif">
                      Order History & Plain Tracking
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#B56571]/20 text-[#A33F4D] dark:text-[#D98A92] border border-[#B56571]/30">
                      {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono">
                    Live Dispatch Updates • Cash on Delivery Receipts • 100% Plain Packaging
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    fetchOrders(user?.email);
                    showToast('Syncing order records with database...', 'info');
                  }}
                  title="Refresh Orders"
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-[#B56571]/20 flex items-center justify-center text-[#7A696C] hover:text-[#A33F4D] dark:hover:text-[#D98A92] cursor-pointer transition-all active:scale-95"
                >
                  <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
                </button>
                <button 
                  onClick={() => setShowOrderHistoryModal(false)}
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#7A696C] hover:text-black dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Orders Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {userOrders.length === 0 ? (
                <div className="text-center py-14 space-y-4 bg-white/50 dark:bg-black/30 rounded-2xl border border-dashed border-[#B56571]/30 p-6">
                  <div className="w-16 h-16 rounded-full bg-[#B56571]/10 text-[#A33F4D] dark:text-[#D98A92] flex items-center justify-center mx-auto text-2xl">
                    <FontAwesomeIcon icon={faBoxOpen} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#181617] dark:text-white font-serif">
                      No Orders Placed Yet
                    </h4>
                    <p className="text-xs text-[#7A696C] dark:text-neutral-400 max-w-sm mx-auto font-light leading-relaxed">
                      Orders placed under <span className="text-[#181617] dark:text-white font-mono font-bold">{userEmail}</span> will appear here with live tracking, plain courier dispatch notes, and COD receipts.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowOrderHistoryModal(false);
                      navigateTo('home');
                    }}
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white cursor-pointer shadow-lg active:scale-95"
                  >
                    Browse Exclusive Sanctuary Collection
                  </button>
                </div>
              ) : (
                userOrders.map((order) => {
                  const isExpanded = activeTrackingOrderId === order.id;
                  const orderDate = order.date || (order.createdAt ? order.createdAt.split('T')[0] : 'Recent');
                  const isDelivered = order.status === 'Delivered';
                  const isShipped = order.status === 'Shipped' || order.status === 'In Transit';

                  return (
                    <div 
                      key={order.id}
                      className="bg-white/90 dark:bg-[#18191E]/95 border border-[#B56571]/25 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 transition-all hover:border-[#B56571]/50"
                    >
                      {/* Order Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 dark:border-white/10 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs sm:text-sm font-bold font-mono text-[#181617] dark:text-white">
                            #{order.id}
                          </span>
                          <span className="text-[11px] font-mono text-[#7A696C] dark:text-neutral-400">
                            • {orderDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                            isDelivered
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : isShipped
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          }`}>
                            ● {order.status || 'Processing'}
                          </span>
                          <button
                            onClick={() => setActiveTrackingOrderId(isExpanded ? null : order.id)}
                            className="text-xs text-[#A33F4D] dark:text-[#D98A92] hover:underline font-mono cursor-pointer font-medium"
                          >
                            {isExpanded ? 'Hide Details ▲' : 'View Tracking & Items ▼'}
                          </button>
                        </div>
                      </div>

                      {/* Summary Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A696C] dark:text-neutral-400 block">
                            Payment Mode
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                            {order.paymentMode || 'Cash on Delivery (COD)'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A696C] dark:text-neutral-400 block">
                            Total Payable
                          </span>
                          <span className="font-bold text-[#181617] dark:text-white font-mono text-sm">
                            ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A696C] dark:text-neutral-400 block">
                            Packaging
                          </span>
                          <span className="text-[#5C4F52] dark:text-neutral-300 font-sans text-xs">
                            {order.packaging || '100% Plain Unbranded Box'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A696C] dark:text-neutral-400 block">
                            Items Ordered
                          </span>
                          <span className="text-[#181617] dark:text-white font-mono text-xs font-semibold">
                            {Array.isArray(order.items) ? order.items.length : 1} item{Array.isArray(order.items) && order.items.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Expandable Tracking & Items Details */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-black/5 dark:border-white/10 space-y-4 animate-fade-in">
                          
                          {/* Live Plain Courier Tracking Progression */}
                          <div className="p-4 rounded-xl bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 space-y-3">
                            <h5 className="text-xs font-bold text-[#181617] dark:text-white font-mono flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faTruckFast} className="text-[#A33F4D] dark:text-[#D98A92]" />
                                <span>Plain Discreet Courier Status:</span>
                              </span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                                Courier: MB Logistics Express
                              </span>
                            </h5>

                            {/* Tracking 4-Step Visual Progress Bar */}
                            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                              <div className="space-y-1">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-[10px]">
                                  ✓
                                </div>
                                <span className="text-[10px] font-mono text-[#181617] dark:text-white block font-semibold">Ordered</span>
                                <span className="text-[9px] text-[#7A696C] dark:text-neutral-400 block">Confirmed</span>
                              </div>

                              <div className="space-y-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] ${
                                  isShipped || isDelivered ? 'bg-emerald-500 text-white' : 'bg-[#B56571]/30 text-[#A33F4D] dark:text-[#D98A92] ring-2 ring-[#B56571]/40'
                                }`}>
                                  {isShipped || isDelivered ? '✓' : '2'}
                                </div>
                                <span className="text-[10px] font-mono text-[#181617] dark:text-white block font-semibold">Plain Sealed</span>
                                <span className="text-[9px] text-[#7A696C] dark:text-neutral-400 block">Unmarked Box</span>
                              </div>

                              <div className="space-y-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] ${
                                  isDelivered ? 'bg-emerald-500 text-white' : isShipped ? 'bg-[#B56571]/30 text-[#A33F4D] ring-2 ring-[#B56571]/40' : 'bg-black/10 dark:bg-white/10 text-[#7A696C]'
                                }`}>
                                  {isDelivered ? '✓' : '3'}
                                </div>
                                <span className="text-[10px] font-mono text-[#181617] dark:text-white block font-semibold">In Transit</span>
                                <span className="text-[9px] text-[#7A696C] dark:text-neutral-400 block">Express Air</span>
                              </div>

                              <div className="space-y-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] ${
                                  isDelivered ? 'bg-emerald-500 text-white' : 'bg-black/10 dark:bg-white/10 text-[#7A696C]'
                                }`}>
                                  {isDelivered ? '✓' : '4'}
                                </div>
                                <span className="text-[10px] font-mono text-[#181617] dark:text-white block font-semibold">Doorstep COD</span>
                                <span className="text-[9px] text-[#7A696C] dark:text-neutral-400 block">Delivered</span>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Address & Contact */}
                          <div className="p-3.5 rounded-xl bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/5 space-y-1 text-xs">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A696C] dark:text-neutral-400 block">
                              Plain Destination & Contact:
                            </span>
                            <p className="text-xs text-[#181617] dark:text-white font-semibold">
                              {order.customerName} {order.customerPhone ? `• 📱 ${order.customerPhone}` : ''}
                            </p>
                            <p className="text-xs text-[#5C4F52] dark:text-neutral-300 font-light">
                              {order.shippingAddress || `${order.customerCity || ''}, ${order.customerState || ''} - ${order.customerPincode || ''}`}
                            </p>
                          </div>

                          {/* Ordered Items List */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A696C] dark:text-neutral-400 block">
                              Package Items Breakdown:
                            </span>
                            <div className="space-y-1.5">
                              {Array.isArray(order.items) && order.items.length > 0 ? (
                                order.items.map((item, idx) => (
                                  <div 
                                    key={idx}
                                    className="flex justify-between items-center p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-xs"
                                  >
                                    <div>
                                      <span className="font-bold text-[#181617] dark:text-white block">
                                        {item.name}
                                      </span>
                                      <span className="text-[11px] text-[#7A696C] dark:text-neutral-400 font-mono">
                                        Variant: {item.color || 'Standard'} • Qty: {item.quantity || 1}
                                      </span>
                                    </div>
                                    <span className="font-mono font-bold text-[#181617] dark:text-white">
                                      ₹{Number((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="p-2 text-xs text-[#7A696C] dark:text-neutral-400 italic">
                                  Standard Luxury Order Items
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-black/5 dark:border-white/10 flex justify-between items-center shrink-0">
              <span className="text-[11px] font-mono text-[#7A696C] dark:text-neutral-400">
                Billing Descriptor: MB* SERVICES LLC
              </span>
              <button
                onClick={() => setShowOrderHistoryModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-mono bg-white/10 hover:bg-white/20 text-[#181617] dark:text-white cursor-pointer transition-colors"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
