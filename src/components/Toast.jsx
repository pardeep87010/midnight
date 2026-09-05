import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faCircleExclamation, 
  faTriangleExclamation, 
  faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;
  
  // Support both object { show, message, type } and string
  if (typeof toast === 'object') {
    if (!toast.show || !toast.message) return null;
  }

  const message = typeof toast === 'object' ? toast.message : toast;
  const type = (typeof toast === 'object' && toast.type) ? toast.type : 'info';

  const typeConfig = {
    success: {
      icon: faCheckCircle,
      textColor: 'text-white',
      badgeColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      dotColor: 'bg-emerald-400',
      label: 'CONFIRMED'
    },
    error: {
      icon: faCircleExclamation,
      textColor: 'text-white',
      badgeColor: 'text-red-400',
      borderColor: 'border-red-500/40',
      dotColor: 'bg-red-400',
      label: 'NOTICE'
    },
    warning: {
      icon: faTriangleExclamation,
      textColor: 'text-white',
      badgeColor: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      dotColor: 'bg-amber-400',
      label: 'ATTENTION'
    },
    info: {
      icon: faInfoCircle,
      textColor: 'text-white',
      badgeColor: 'text-[#D98A92]',
      borderColor: 'border-[#D98A92]/40',
      dotColor: 'bg-[#D98A92]',
      label: 'CONCIERGE'
    }
  };

  const current = typeConfig[type] || typeConfig.info;

  return (
    <div className={`fixed bottom-24 md:bottom-8 right-6 z-50 flex items-center space-x-3 bg-[#18191E]/95 backdrop-blur-xl border ${current.borderColor} text-white px-5 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] animate-fade-in text-xs font-sans max-w-md`}>
      <div className="flex items-center space-x-2 shrink-0">
        <FontAwesomeIcon icon={current.icon} className={`${current.badgeColor} text-sm`} />
        <span className={`text-[10px] font-mono font-bold tracking-wider ${current.badgeColor}`}>
          [{current.label}]
        </span>
      </div>
      <div className="border-l border-white/10 pl-3">
        <span className={`${current.textColor} font-medium leading-relaxed block`}>
          {message}
        </span>
      </div>
    </div>
  );
};
