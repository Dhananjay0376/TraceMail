import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  FileSearch,
  Briefcase,
  Bell,
  Search,
  Settings,
  ShieldCheck,
  BookOpen,
  FileText,
  X,
  Pin,
  PinOff,
  ShieldAlert,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  isPinned,
  onTogglePin,
  currentScreen,
  onNavigate,
  currentRole,
  onRoleChange,
  unreadAlertsCount = 3,
  onOpenSubmit,
  onOpenLogout,
}) {
  const navSections = [
    {
      title: 'CORE FORENSICS',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          subtitle: 'Threat metrics & overview',
          icon: LayoutDashboard,
          analystOnly: false,
        },
        {
          id: 'submit',
          label: 'Submit Email',
          subtitle: 'Upload .eml or paste RFC headers',
          icon: UploadCloud,
          analystOnly: false,
        },
        {
          id: 'result',
          label: 'Analysis Result',
          subtitle: '6-tab forensic dossier & score',
          icon: FileSearch,
          analystOnly: false,
        },
      ],
    },
    {
      title: 'SOC OPERATIONS',
      items: [
        {
          id: 'cases',
          label: 'Case Queue',
          subtitle: 'Incident tracking & playbooks',
          icon: Briefcase,
          badge: 4,
          badgeColor: 'bg-redrob-blue/20 text-redrob-blue border-redrob-blue/40',
          analystOnly: true,
        },
        {
          id: 'alerts',
          label: 'Alerts Center',
          subtitle: 'Live threats & severity triage',
          icon: Bell,
          badge: unreadAlertsCount,
          badgeColor: 'bg-redrob-coral text-white font-bold',
          analystOnly: true,
        },
        {
          id: 'search',
          label: 'Search Archive',
          subtitle: 'Query past scans, IPs & senders',
          icon: Search,
          analystOnly: true,
        },
      ],
    },
    {
      title: 'SYSTEM & COMPLIANCE',
      items: [
        {
          id: 'report',
          label: 'Forensic Report',
          subtitle: 'Court-ready printable dossier',
          icon: FileText,
          analystOnly: true,
        },
        {
          id: 'settings',
          label: 'Settings',
          subtitle: 'API keys, 2FA & retention',
          icon: Settings,
          analystOnly: false,
        },
        {
          id: 'admin',
          label: 'Admin Panel',
          subtitle: 'User governance & SOC audit logs',
          icon: ShieldCheck,
          analystOnly: true,
          adminOnly: true,
        },
        {
          id: 'docs',
          label: 'Docs & FAQ',
          subtitle: 'Glossary & email threat guide',
          icon: BookOpen,
          analystOnly: false,
        },
      ],
    },
  ];

  const filteredSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (currentRole === 'employee' && item.analystOnly) return false;
        if (currentRole !== 'admin' && item.adminOnly) return false;
        return true;
      }),
    }))
    .filter((section) => section.items.length > 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Dim backdrop with blur for drawer mode */}
      {!isPinned && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* Main Left-Hand Side Navigation Drawer / Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-50 w-72 bg-[#080d1f] border-r border-white/10 shadow-2xl flex flex-col transition-all duration-300 ease-in-out font-sans ${
          isPinned ? 'lg:z-30' : 'z-50'
        }`}
      >
        {/* Sidebar Header: Brand & Main Menu Controls */}
        <div className="p-4 border-b border-white/10 bg-[#050814]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-redrob-blue to-redrob-violet p-0.5 shadow-md shadow-redrob-blue/20">
              <div className="w-full h-full bg-[#050814] rounded-[10px] flex items-center justify-center text-redrob-aqua">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-white tracking-wide">
                  MAIN MENU
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-redrob-aqua animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-slate-400 capitalize">
                {currentRole} Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Pin / Dock Toggle for Desktop */}
            <button
              onClick={onTogglePin}
              title={isPinned ? 'Unpin Sidebar (Drawer mode)' : 'Pin Sidebar to left'}
              className={`hidden lg:flex p-1.5 rounded-xl border transition-all cursor-pointer spring-hover ${
                isPinned
                  ? 'bg-redrob-blue/20 text-white border-redrob-blue/40 shadow-sm'
                  : 'bg-[#0b1026] text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
            </button>

            {/* Close Sidebar */}
            <button
              onClick={onClose}
              title="Close Menu"
              className="p-1.5 rounded-xl bg-[#0b1026] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Role Pill Bar */}
        <div className="px-4 py-2.5 bg-[#0b1026]/50 border-b border-white/5 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-mono text-[10px]">Active Mode:</span>
          <div className="flex items-center gap-1 bg-[#050814] p-0.5 rounded-full border border-white/10">
            <button
              onClick={() => onRoleChange('employee')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                currentRole === 'employee'
                  ? 'bg-redrob-lime text-slate-950 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Emp
            </button>
            <button
              onClick={() => onRoleChange('analyst')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                currentRole === 'analyst'
                  ? 'bg-redrob-blue text-white font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analyst
            </button>
            <button
              onClick={() => onRoleChange('admin')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                currentRole === 'admin'
                  ? 'bg-redrob-violet text-white font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Scrollable Nav Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {filteredSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                {section.title}
              </p>

              {section.items.map((item) => {
                const isActive = currentScreen === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all cursor-pointer relative spring-hover ${
                      isActive
                        ? 'bg-gradient-to-r from-redrob-blue/20 via-redrob-blue/10 to-redrob-violet/10 text-white border border-redrob-blue/40 shadow-redrob-glow'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {/* Active Bar indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-redrob-blue rounded-r-full shadow-redrob-glow" />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-redrob-blue text-white shadow-sm'
                            : 'bg-[#0b1026] text-slate-400 border border-white/5 group-hover:text-redrob-aqua group-hover:bg-[#0f1738]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p
                          className={`text-xs font-medium truncate ${
                            isActive ? 'text-white font-bold' : 'text-slate-200 group-hover:text-white'
                          }`}
                        >
                          {item.label}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate font-sans">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      {typeof item.badge === 'number' && item.badge > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                            item.badgeColor || 'bg-redrob-coral text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive
                            ? 'text-redrob-aqua translate-x-0.5'
                            : 'text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Quick Action & Footer */}
        <div className="p-3 border-t border-white/10 bg-[#050814]/90 space-y-2">
          {/* Analyze CTA with Redrob Blue */}
          <button
            onClick={onOpenSubmit}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-redrob-blue to-[#1d3fe8] hover:shadow-redrob-glow text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer spring-hover"
          >
            <UploadCloud className="w-4 h-4" />
            <span>+ Analyze Email</span>
          </button>

          {/* User Session Bar */}
          <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-slate-400">
            <div className="truncate">
              <span className="text-white font-semibold block truncate text-xs">
                {currentRole === 'employee' ? 'David Miller' : 'Alex Chen'}
              </span>
              <span className="text-[10px] text-redrob-blue truncate block font-mono">
                {currentRole === 'admin' ? 'SOC Admin' : currentRole === 'analyst' ? 'Lead Analyst' : 'Reporter'}
              </span>
            </div>
            <button
              onClick={onOpenLogout}
              title="Log Out Session"
              className="p-1.5 rounded-lg hover:bg-redrob-coral/20 hover:text-redrob-coral text-slate-400 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
