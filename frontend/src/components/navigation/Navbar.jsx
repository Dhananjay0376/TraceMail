import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  UploadCloud,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import CardNav from './CardNav';

export default function Navbar({
  currentScreen,
  onNavigate,
  currentRole,
  onRoleChange,
  unreadAlertsCount = 3,
  onOpenLogout,
  onOpenSubmit,
  onOpenLogin,
  onOpenSignUp,
  isSidebarOpen,
  onToggleSidebar,
  currentUser,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cardNavItems = [
    {
      label: 'Core Forensics',
      bgColor: '#08172c',
      textColor: '#ffffff',
      links: [
        { label: 'Dashboard', href: '#dashboard', onClick: () => onNavigate('dashboard'), ariaLabel: 'Threat Dashboard' },
        { label: 'Submit Email', href: '#submit', onClick: () => onNavigate('submit'), ariaLabel: 'Submit Email Scan' },
        { label: 'Analysis Dossier', href: '#result', onClick: () => onNavigate('result'), ariaLabel: 'Analysis Result Dossier' },
      ],
    },
    {
      label: 'SOC Operations',
      bgColor: '#0f183e',
      textColor: '#ffffff',
      links: [
        { label: 'Case Queue', href: '#cases', onClick: () => onNavigate('cases'), ariaLabel: 'SOC Case Queue' },
        { label: 'Alerts Center', href: '#alerts', onClick: () => onNavigate('alerts'), ariaLabel: 'Threat Alerts Center' },
        { label: 'Search Archive', href: '#search', onClick: () => onNavigate('search'), ariaLabel: 'Search Archive' },
      ],
    },
    {
      label: 'System & Help',
      bgColor: '#18143a',
      textColor: '#ffffff',
      links: [
        { label: 'Forensic Report', href: '#report', onClick: () => onNavigate('report'), ariaLabel: 'Forensic Report' },
        { label: 'Security Settings', href: '#settings', onClick: () => onNavigate('settings'), ariaLabel: 'Security Settings' },
        { label: 'Docs & FAQ', href: '#docs', onClick: () => onNavigate('docs'), ariaLabel: 'Documentation and FAQ' },
      ],
    },
  ];

  const brandLogo = (
    <div
      onClick={() => onNavigate('landing')}
      className="flex items-center gap-2.5 group cursor-pointer text-left"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-redrob-blue via-[#3385ff] to-redrob-violet p-0.5 shadow-lg shadow-redrob-blue/20 group-hover:scale-105 transition-all">
        <div className="w-full h-full bg-[#050814] rounded-[10px] flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-redrob-aqua group-hover:text-white transition-all" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-sm sm:text-base text-white">
            Trace<span className="text-transparent bg-clip-text bg-gradient-to-r from-redrob-blue to-redrob-aqua">Mail</span>
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-redrob-blue/15 border border-redrob-blue/30 text-redrob-blue font-bold">
            v2.0
          </span>
        </div>
      </div>
    </div>
  );

  const profileDropdown = (
    <div className="relative shrink-0">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center gap-1.5 p-1 rounded-full border border-white/10 hover:border-white/20 bg-[#050814]/80 transition-all cursor-pointer"
      >
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name || 'User'}
            className="w-7 h-7 rounded-full object-cover border border-white/20"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div
          className={`w-7 h-7 rounded-full bg-gradient-to-tr from-redrob-blue to-redrob-violet flex items-center justify-center text-white font-mono text-xs font-bold ${
            currentUser?.avatar ? 'hidden' : 'flex'
          }`}
        >
          {currentRole === 'employee' ? 'EM' : currentRole === 'admin' ? 'AD' : (currentUser?.name || 'S').charAt(0).toUpperCase()}
        </div>
        {unreadAlertsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-redrob-coral text-white text-[8px] font-mono font-bold flex items-center justify-center shadow">
            {unreadAlertsCount}
          </span>
        )}
        <ChevronDown className="w-3 h-3 text-slate-400 pr-1" />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0b1026] border border-white/10 shadow-redrob-card p-2 z-50 animate-fade-in text-xs">
          <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2.5">
            {currentUser?.avatar && (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-white font-bold truncate">
                {currentRole === 'employee' ? 'David Miller' : (currentUser?.name || 'Shri')}
              </p>
              <p className="text-[11px] text-redrob-blue capitalize font-mono truncate">
                {currentRole === 'employee'
                  ? 'Employee / Reporter'
                  : currentRole === 'admin'
                  ? 'System Administrator'
                  : 'Lead Forensic Analyst'}
              </p>
            </div>
          </div>

          <div className="py-1">
            {/* Alerts inside profile dropdown */}
            <button
              onClick={() => {
                onNavigate('alerts');
                setIsUserMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <div className="relative">
                <Bell className="w-4 h-4 text-slate-400" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-redrob-coral text-white text-[7px] font-mono font-bold flex items-center justify-center">
                    {unreadAlertsCount}
                  </span>
                )}
              </div>
              <span>Alerts Center</span>
              {unreadAlertsCount > 0 && (
                <span className="ml-auto text-[9px] font-mono text-redrob-coral font-bold">{unreadAlertsCount} new</span>
              )}
            </button>
            <button
              onClick={() => {
                onNavigate('settings');
                setIsUserMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Security Settings</span>
            </button>
            <button
              onClick={() => {
                onNavigate('onboarding');
                setIsUserMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Org Setup Wizard</span>
            </button>
          </div>

          <div className="pt-1 border-t border-white/10">
            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                onOpenLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-redrob-coral hover:bg-redrob-coral/10 transition-all text-left font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050814]/40 border-b border-white/10 shadow-xl shadow-black/60'
          : 'bg-[#050814]/90 border-b border-white/10'
      }`}
      style={{
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(24px)',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(24px)',
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        {/* Full-width CardNav rectangle line containing Logo, + SCAN CTA, and Profile button */}
        <CardNav
          logo={brandLogo}
          logoAlt="TraceMail Logo"
          items={cardNavItems}
          baseColor="#0b1026"
          menuColor="#ffffff"
          buttonBgColor="#2b52ff"
          buttonTextColor="#ffffff"
          ctaText="+ Scan"
          onCtaClick={onOpenSubmit}
          rightContent={profileDropdown}
        />
      </div>
    </header>
  );
}
