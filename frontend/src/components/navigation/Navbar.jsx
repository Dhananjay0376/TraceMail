import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Menu,
  UploadCloud,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function Navbar({
  currentScreen,
  onNavigate,
  currentRole,
  onRoleChange,
  unreadAlertsCount = 3,
  onOpenLogout,
  onOpenSubmit,
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

  const screenLabels = {
    landing: 'Platform Overview',
    dashboard: 'Threat Dashboard',
    submit: 'Submit Email Scan',
    loading: 'Forensic Analysis',
    result: 'Analysis Result Dossier',
    cases: 'SOC Case Queue',
    alerts: 'Threat Alerts Center',
    search: 'Search Archive',
    report: 'Forensic Report',
    settings: 'Security Settings',
    admin: 'SOC Administration',
    docs: 'Documentation & FAQ',
    onboarding: 'Perimeter Setup',
  };

  const activeLabel = screenLabels[currentScreen] || 'Forensic Platform';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#050814]/35 border-white/10 shadow-xl shadow-black/60'
          : 'bg-[#050814]/90 border-white/10'
      }`}
      style={{
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(24px)',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(24px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Main Menu Trigger & Redrob-Styled Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Main Menu Toggle Pill Button */}
            <button
              onClick={onToggleSidebar}
              className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all cursor-pointer border text-[10px] font-mono font-bold uppercase tracking-wider spring-hover ${
                isSidebarOpen
                  ? 'bg-redrob-blue/20 text-white border-redrob-blue/50 shadow-redrob-glow'
                  : 'bg-[#0b1026] text-slate-300 border-white/10 hover:border-redrob-blue/40 hover:text-white hover:bg-[#0f1738]'
              }`}
              title={isSidebarOpen ? 'Collapse Main Menu' : 'Open Main Menu'}
              aria-label="Toggle Main Menu"
            >
              <Menu
                className={`w-3.5 h-3.5 text-redrob-aqua transition-transform duration-300 ${
                  isSidebarOpen ? 'rotate-90 text-white' : ''
                }`}
              />
              <span className="hidden sm:inline">Main Menu</span>
            </button>

            {/* Brand Logo & Editorial Typography */}
            <button
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
                <p className="text-[9px] text-slate-400 font-sans hidden md:block">
                  AI Forensic Intelligence
                </p>
              </div>
            </button>
          </div>

          {/* Center: Active View Breadcrumb Pill */}
          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-[#0b1026]/90 px-3 py-1 rounded-full border border-white/10 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-redrob-aqua animate-pulse" />
            <span className="text-slate-400">View:</span>
            <span className="text-white font-bold tracking-wide">
              {activeLabel}
            </span>
          </div>

          {/* Right Action Area: Role Switcher, Quick Submit, Alerts, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher Pill Bar (Crucial for Demo!) */}
            <div className="flex items-center p-0.5 rounded-full bg-[#0b1026] border border-white/10">
              <button
                onClick={() => onRoleChange('employee')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold transition-all cursor-pointer ${
                  currentRole === 'employee'
                    ? 'bg-redrob-lime text-slate-950 shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Simplified non-technical employee view"
              >
                Employee
              </button>
              <button
                onClick={() => onRoleChange('analyst')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold transition-all cursor-pointer ${
                  currentRole === 'analyst'
                    ? 'bg-redrob-blue text-white shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Full forensic technical view"
              >
                Analyst
              </button>
              <button
                onClick={() => onRoleChange('admin')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold transition-all cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-redrob-violet text-white shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Full admin governance view"
              >
                Admin
              </button>
            </div>

            {/* Alerts Center Quick Icon Button */}
            {currentRole !== 'employee' && (
              <button
                onClick={() => onNavigate('alerts')}
                className="relative p-1.5 rounded-full border border-white/10 hover:border-redrob-blue/40 bg-[#0b1026] hover:text-white text-slate-300 transition-all cursor-pointer spring-hover"
                title="View Alerts Center"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-redrob-coral text-white text-[8px] font-mono font-bold flex items-center justify-center shadow">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Upload CTA with Redrob Blue */}
            <button
              onClick={onOpenSubmit}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-redrob-blue to-[#1d3fe8] hover:shadow-redrob-glow text-white font-bold text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer spring-hover"
            >
              <UploadCloud className="w-3 h-3" />
              <span>+ Scan</span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-white/10 hover:border-white/20 bg-[#0b1026] transition-all cursor-pointer"
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
          </div>
        </div>
      </div>
    </header>
  );
}
