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
  onOpenLogin,
  onOpenSignUp,
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
          ? 'bg-[#001D39]/90 border-[#49769F]/30 paper-cut-shadow'
          : 'bg-[#001D39]/95 border-[#49769F]/20'
      }`}
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Main Menu Trigger & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Main Menu Toggle Pill Button */}
            <button
              onClick={onToggleSidebar}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer border text-[10px] font-mono font-bold uppercase tracking-wider paper-pill spring-hover ${
                isSidebarOpen
                  ? 'bg-[#7BBDE8] text-[#001D39] border-white shadow-md'
                  : 'bg-[#0A4174] text-[#BDD8E9] border-[#49769F]/40 hover:bg-[#49769F]'
              }`}
              title={isSidebarOpen ? 'Collapse Main Menu' : 'Open Main Menu'}
              aria-label="Toggle Main Menu"
            >
              <Menu
                className={`w-3.5 h-3.5 text-[#7BBDE8] transition-transform duration-300 ${
                  isSidebarOpen ? 'rotate-90 text-[#001D39]' : ''
                }`}
              />
              <span className="hidden sm:inline">Main Menu</span>
            </button>

            {/* Brand Logo & Editorial Typography */}
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0A4174] via-[#49769F] to-[#7BBDE8] p-0.5 shadow-md group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-[#001D39] rounded-[10px] flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-[#7BBDE8] group-hover:text-white transition-all" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-sm sm:text-base text-white">
                    Trace<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7BBDE8] to-[#BDD8E9]">Mail</span>
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#0A4174] border border-[#7BBDE8]/30 text-[#BDD8E9] font-bold">
                    v2.0
                  </span>
                </div>
                <p className="text-[9px] text-[#6EA2B3] font-sans hidden md:block">
                  AI Forensic Intelligence
                </p>
              </div>
            </button>
          </div>

          {/* Center: Active View Breadcrumb Pill */}
          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-[#BDD8E9] bg-[#0A4174]/80 px-3.5 py-1 rounded-full border border-[#7BBDE8]/20 paper-pill shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#7BBDE8] animate-pulse" />
            <span className="text-[#6EA2B3]">View:</span>
            <span className="text-white font-bold tracking-wide">
              {activeLabel}
            </span>
          </div>

          {/* Right Action Area: Role Switcher, Quick Submit, Alerts, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher — only show when a real user is logged in */}
            {currentUser && (
              <div className="flex items-center p-0.5 rounded-full bg-[#00152b] border border-[#49769F]/30 paper-pill">
                <button
                  onClick={() => onRoleChange('employee')}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold transition-all cursor-pointer ${
                    currentRole === 'employee'
                      ? 'bg-[#7BBDE8] text-[#001D39] shadow font-extrabold'
                      : 'text-[#6EA2B3] hover:text-white'
                  }`}
                  title="Simplified non-technical employee view"
                >
                  Employee
                </button>
                <button
                  onClick={() => onRoleChange('analyst')}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold transition-all cursor-pointer ${
                    currentRole === 'analyst'
                      ? 'bg-[#0A4174] text-white border border-[#7BBDE8]/40 shadow font-extrabold'
                      : 'text-[#6EA2B3] hover:text-white'
                  }`}
                  title="Full forensic technical view"
                >
                  Analyst
                </button>
                <button
                  onClick={() => onRoleChange('admin')}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold transition-all cursor-pointer ${
                    currentRole === 'admin'
                      ? 'bg-[#49769F] text-white shadow font-extrabold'
                      : 'text-[#6EA2B3] hover:text-white'
                  }`}
                  title="Full admin governance view"
                >
                  Admin
                </button>
              </div>
            )}

            {/* Alerts Center Quick Icon Button */}
            {currentUser && currentRole !== 'employee' && (
              <button
                onClick={() => onNavigate('alerts')}
                className="relative p-2 rounded-full border border-[#49769F]/30 bg-[#0A4174]/80 text-[#BDD8E9] hover:text-white hover:bg-[#49769F] transition-all cursor-pointer paper-pill spring-hover"
                title="View Alerts Center"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-mono font-bold flex items-center justify-center shadow">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Upload CTA */}
            {currentUser && (
              <button
                onClick={onOpenSubmit}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#7BBDE8] hover:bg-white text-[#001D39] font-extrabold text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer paper-pill spring-hover shadow-sm"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#001D39]" />
                <span>+ Scan</span>
              </button>
            )}

            {/* ── NOT LOGGED IN: show Login + Sign Up buttons ── */}
            {!currentUser && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-1.5 rounded-full border border-[#49769F]/50 bg-[#0A4174]/60 text-[#BDD8E9] text-[10px] font-mono font-bold hover:bg-[#49769F] transition-all cursor-pointer paper-pill"
                >
                  Login
                </button>
                <button
                  onClick={onOpenSignUp}
                  className="px-4 py-1.5 rounded-full bg-[#7BBDE8] hover:bg-white text-[#001D39] text-[10px] font-mono font-bold transition-all cursor-pointer paper-pill shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* ── LOGGED IN USER (Demo or Real): show avatar dropdown ── */}
            {currentUser && (
              <div className="relative flex items-center gap-2">
                {currentUser.isDemo && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] font-mono font-bold tracking-wider uppercase hidden sm:inline-block">
                    Demo Mode
                  </span>
                )}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-[#49769F]/30 bg-[#0A4174] transition-all cursor-pointer paper-pill"
                >
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover border border-[#7BBDE8]/30"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-7 h-7 rounded-full bg-gradient-to-tr from-[#0A4174] to-[#7BBDE8] flex items-center justify-center text-white font-mono text-xs font-bold ${
                      currentUser?.avatar ? 'hidden' : 'flex'
                    }`}
                  >
                    {(currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#BDD8E9] pr-1" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#001D39] border border-[#49769F]/40 paper-cut-shadow p-2 z-50 animate-fade-in text-xs">
                    <div className="px-3 py-2 border-b border-[#49769F]/30 flex items-center gap-2.5">
                      {currentUser?.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt="Profile"
                          className="w-9 h-9 rounded-full object-cover border border-[#7BBDE8]/30 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0A4174] to-[#7BBDE8] flex items-center justify-center text-white font-mono text-xs font-bold shrink-0">
                          {(currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-bold truncate">
                          {currentUser?.name || currentUser?.email || 'User'}
                        </p>
                        <p className="text-[11px] text-[#6EA2B3] font-mono truncate">
                          {currentUser?.email || ''}
                        </p>
                        <p className="text-[10px] text-redrob-blue capitalize font-mono truncate mt-0.5">
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

                    <div className="pt-1 border-t border-white/10 space-y-1">
                      {currentUser?.isDemo && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenLogin && onOpenLogin();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sky-300 hover:bg-sky-500/10 transition-all text-left font-semibold"
                        >
                          <LogOut className="w-4 h-4 text-sky-400 rotate-180" />
                          <span>Login to Real Account</span>
                        </button>
                      )}
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
