import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Building,
  Radio,
  Users,
  Check,
  Smartphone,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import Tabs from '../common/Tabs';
import { MOCK_USERS } from '../../mock/mockData';

export default function SettingsScreen({ currentRole = 'analyst' }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);
  const [piiMasking, setPiiMasking] = useState(true);
  const [retentionDays, setRetentionDays] = useState('90');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXX');
  const [saveNotice, setSaveNotice] = useState(null);

  const tabs = [
    { id: 'profile', label: 'Profile & 2FA', icon: Shield },
    { id: 'org', label: 'Organization Policies', icon: Building },
    { id: 'integrations', label: 'Mailbox & SOC Integrations', icon: Radio },
    ...(currentRole === 'admin' ? [{ id: 'team', label: 'Team & Roles', icon: Users }] : []),
  ];

  const handleSave = (section) => {
    // TODO: connect to backend API /api/settings/update
    setSaveNotice(`${section} updated successfully.`);
    setTimeout(() => setSaveNotice(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-6 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-redrob-blue/15 border border-redrob-blue/30 flex items-center justify-center text-redrob-blue">
          <Settings className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Security &amp; Workspace Preferences
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Configure multi-factor authentication, perimeter telemetry policies, and SIEM connectors.
          </p>
        </div>
      </div>

      {saveNotice && (
        <div className="p-4 rounded-2xl bg-redrob-blue/15 border border-redrob-blue/40 text-white text-xs font-sans shadow-xl flex items-center gap-2.5 animate-fade-in">
          <Check className="w-4 h-4 text-redrob-blue" />
          <span className="font-medium">{saveNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Profile & Security Tab */}
      {activeTab === 'profile' && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card space-y-6 font-sans text-xs animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Analyst Identity &amp; Cryptographic Authentication
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Full Name</label>
              <input
                type="text"
                defaultValue="Alex Chen"
                className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                disabled
                defaultValue="a.chen@apexdefense.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#050814]/60 border border-white/5 text-slate-500 focus:outline-none cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* 2FA Toggle */}
          <div className="p-5 rounded-2xl bg-[#050814] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-redrob-blue/15 border border-redrob-blue/30 flex items-center justify-center text-redrob-blue">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Hardware 2FA / FIDO2 Security Keys</h4>
                <p className="text-slate-400 text-xs font-sans mt-0.5">
                  Require hardware YubiKey or biometric TouchID for all SOC sessions.
                </p>
              </div>
            </div>

            <button
              onClick={() => setTwoFaEnabled(!twoFaEnabled)}
              className={`px-5 py-2 rounded-full font-bold uppercase tracking-wider text-xs transition-all cursor-pointer ${
                twoFaEnabled
                  ? 'bg-redrob-lime text-slate-950 shadow-md'
                  : 'bg-white/10 text-slate-400'
              }`}
            >
              {twoFaEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleSave('Profile settings')}
              className="px-6 py-2.5 rounded-full bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-redrob-glow"
            >
              Save Profile Preferences
            </button>
          </div>
        </div>
      )}

      {/* Organization Policies Tab */}
      {activeTab === 'org' && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card space-y-6 font-sans text-xs animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Perimeter Security &amp; Retention Policies
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Corporate Monitored Domains</label>
              <textarea
                rows={3}
                defaultValue="apexdefense.com&#10;apex-telemetry.io&#10;corp-apex.com"
                className="w-full p-4 rounded-xl bg-[#050814] border border-white/10 text-redrob-blue font-mono focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Any incoming mail impersonating these domains triggers a P0 executive impersonation alert.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Forensic Log Retention Period</label>
                <select
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none"
                >
                  <option value="30">30 Days (Standard Audit)</option>
                  <option value="90">90 Days (Enterprise Security)</option>
                  <option value="365">365 Days (Compliance Strict)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">PII Data Masking in Reports</label>
                <select
                  value={piiMasking ? 'mask' : 'clear'}
                  onChange={(e) => setPiiMasking(e.target.value === 'mask')}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none"
                >
                  <option value="mask">Redact Social Security &amp; Card Numbers (Enabled)</option>
                  <option value="clear">Display Raw Unmasked Message (Full Forensics)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleSave('Organization policies')}
              className="px-6 py-2.5 rounded-full bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-redrob-glow"
            >
              Save Organization Rules
            </button>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card space-y-6 font-sans text-xs animate-fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Enterprise SIEM &amp; SOC Alert Connectors
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Microsoft 365 Exchange Gateway</div>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Automated mailbox scanning &amp; inline quarantine purge rules.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-redrob-lime/15 text-redrob-lime font-bold text-xs border border-redrob-lime/30 font-mono">
                Connected
              </span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Slack Incident Response Webhook</label>
              <input
                type="text"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Splunk / SIEM Ingestion API Key</label>
              <input
                type="password"
                defaultValue="tm_live_sec_8492041928491823"
                className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleSave('Integrations')}
              className="px-6 py-2.5 rounded-full bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-redrob-glow"
            >
              Save Integration Keys
            </button>
          </div>
        </div>
      )}

      {/* Team & Roles Tab (Admin only) */}
      {activeTab === 'team' && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card space-y-6 font-sans text-xs animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Workspace User Access Controls (RBAC)
            </h3>
            <button
              onClick={() => alert('Opening invitation modal...')}
              className="px-4 py-1.5 rounded-full bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold text-xs shadow-redrob-glow transition-all cursor-pointer"
            >
              + Invite Analyst
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {MOCK_USERS.map((u) => (
              <div key={u.id} className="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-white text-sm">{u.name}</span>
                  <span className="text-slate-400 text-xs block font-mono">{u.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-redrob-blue font-bold font-mono">{u.role}</span>
                  <span className="text-slate-500 text-[10px] font-mono">{u.mfa}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
