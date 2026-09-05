import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faRotateRight, faHouse } from '@fortawesome/free-solid-svg-icons';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Midnight Bloom Handled Exception:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleResetSession = () => {
    try {
      localStorage.removeItem('mb_user');
      localStorage.removeItem('mb_admin_token');
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F5] dark:bg-[#090A0E] text-[#181617] dark:text-white flex items-center justify-center p-6 font-sans transition-colors">
          <div className="bg-white dark:bg-[#12141C] border border-[#B56571]/25 dark:border-white/10 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl animate-fade-in">
            
            {/* Elegant Shield Icon */}
            <div className="w-16 h-16 rounded-full bg-[#FAF3F0] dark:bg-white/[0.04] border border-[#B56571]/30 dark:border-[#D98A92]/30 flex items-center justify-center mx-auto text-[#A33F4D] dark:text-[#D98A92]">
              <FontAwesomeIcon icon={faShieldHalved} className="text-2xl" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A33F4D] dark:text-[#D98A92] font-bold block">
                SECURE CONCIERGE ASSURANCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#181617] dark:text-white tracking-tight">
                Private Session Interrupted
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4F52] dark:text-neutral-400 font-light leading-relaxed max-w-sm mx-auto">
                We encountered a momentary issue while processing this display. Your shopping bag, anonymity, and session data remain fully safeguarded.
              </p>
            </div>

            {/* Reassuring Recovery Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full btn-gold py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-95 text-white"
              >
                <FontAwesomeIcon icon={faRotateRight} />
                <span>Reload Session</span>
              </button>

              <button
                onClick={this.handleHome}
                className="w-full bg-[#FAF7F5] hover:bg-[#FAF3F0] text-[#181617] dark:bg-[#18181B] dark:hover:bg-neutral-800 dark:text-white border border-[#B56571]/25 dark:border-neutral-700 py-3 px-5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <FontAwesomeIcon icon={faHouse} />
                <span>Return to Catalog</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={this.handleResetSession}
                className="text-[11px] font-mono text-[#7A696C] dark:text-neutral-400 hover:text-[#A33F4D] dark:hover:text-[#D98A92] underline cursor-pointer transition-colors"
              >
                Clear cached session & restart fresh
              </button>
            </div>

            <div className="pt-2 border-t border-black/[0.06] dark:border-white/5">
              <span className="text-[10px] font-mono text-[#7A696C] dark:text-neutral-500">
                100% Confidential & Encrypted Infrastructure
              </span>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
