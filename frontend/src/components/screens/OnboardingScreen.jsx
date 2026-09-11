import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
  UploadCloud,
  Check,
  KeyRound,
  Sparkles,
  Plus,
  Trash2,
} from 'lucide-react';

import { sendTeamInvitation } from '../../lib/supabase';

export default function OnboardingScreen({ onCompleteOnboarding, onSkip, currentUser }) {
  const [step, setStep] = useState(1);
  const [orgMode, setOrgMode] = useState('create'); // 'create' | 'join'
  const [orgName, setOrgName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [domain, setDomain] = useState('');
  const [connectedMailbox, setConnectedMailbox] = useState(null);
  const [teamEmails, setTeamEmails] = useState([]);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [newRoleInput, setNewRoleInput] = useState('Security Analyst');
  const [inviteToast, setInviteToast] = useState('');

  const showInviteToast = (msg) => {
    setInviteToast(msg);
    setTimeout(() => setInviteToast(''), 3500);
  };

  const handleAddMember = async (e) => {
    e && e.preventDefault();
    const trimmed = newEmailInput.trim();
    if (!trimmed) return;
    // Add to local list
    setTeamEmails([...teamEmails, { email: trimmed, role: newRoleInput }]);
    setNewEmailInput('');
    // Send real invitation email
    try {
      await sendTeamInvitation({
        email: trimmed,
        role: newRoleInput,
        inviterName: currentUser?.name || 'Your Admin',
        inviterOrg: orgName || currentUser?.org || 'TraceMail',
      });
      showInviteToast(`✅ Invitation sent to ${trimmed}`);
    } catch (err) {
      showInviteToast(`⚠️ Added ${trimmed} locally (email delivery failed)`);
    }
  };

  const handleRemoveMember = (idx) => {
    setTeamEmails(teamEmails.filter((_, i) => i !== idx));
  };

  const handleConnectGmail = (e) => {
    e.stopPropagation();
    window.open(
      'http://localhost:8000/api/auth/google/login',
      'gmail_connect',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );
    // Listen for postMessage from popup
    const onMessage = (event) => {
      if (event.data?.type === 'gmail_connected') {
        setConnectedMailbox('gmail');
        window.removeEventListener('message', onMessage);
      }
    };
    window.addEventListener('message', onMessage);
    // Optimistically mark as connected after a delay if no postMessage
    setTimeout(() => setConnectedMailbox('gmail'), 5000);
  };

  const handleFinish = () => {
    onCompleteOnboarding &&
      onCompleteOnboarding({
        orgName: orgMode === 'create' ? orgName : 'Joined Workspace',
        domain,
        connectedMailbox,
        teamEmails,
        isFirstTime: true,
      });
  };

  const handleSkipAll = () => {
    onSkip && onSkip({ isFirstTime: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl rounded-[32px] bg-[#0b1026] border border-white/10 shadow-2xl p-6 sm:p-10 font-mono relative overflow-hidden shimmer-card">
        {/* Progress Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <div>
            <span className="text-[10px] text-redrob-aqua font-bold uppercase tracking-widest">
              Workspace Setup Wizard • Step {step} of 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {step === 1
                ? 'Step 1 — Create or Join Organization'
                : step === 2
                ? 'Step 2 — Connect Mailbox (Optional)'
                : 'Step 3 — Invite Team Members'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-redrob-blue text-white shadow-lg shadow-blue-500/30'
                    : step > s
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-[#050814] text-slate-600 border border-white/10'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: CREATE OR JOIN ORGANIZATION */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in font-sans text-xs">
            <p className="text-slate-300">
              Welcome to TraceMail! Let's initialize your corporate cyber defense perimeter.
            </p>

            {/* Two Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setOrgMode('create')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  orgMode === 'create'
                    ? 'bg-redrob-blue/15 border-redrob-blue shadow-lg shadow-blue-500/10'
                    : 'bg-[#050814] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-redrob-blue/20 flex items-center justify-center text-redrob-blue">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Create a new organization</h3>
                </div>
                <p className="text-slate-400 text-[11px] mt-2 leading-relaxed">
                  Start a fresh security workspace and invite your analysts and security responders.
                </p>
              </div>

              <div
                onClick={() => setOrgMode('join')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  orgMode === 'join'
                    ? 'bg-redrob-blue/15 border-redrob-blue shadow-lg shadow-blue-500/10'
                    : 'bg-[#050814] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Join an existing one</h3>
                </div>
                <p className="text-slate-400 text-[11px] mt-2 leading-relaxed">
                  Enter an invite code provided by your organization's security administrator.
                </p>
              </div>
            </div>

            {/* Form Inputs based on choice */}
            {orgMode === 'create' ? (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Organization / Enterprise Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Acme Bank Security Team"
                    className="w-full px-4 py-3 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Protected Corporate Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. acmebank.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    Used for automated DMARC validation, lookalike typo detection, and VIP impersonation checks.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Organization Invite Code</label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="e.g. SEC-ACME-8924"
                    className="w-full px-4 py-3 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none text-xs font-mono uppercase tracking-widest"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-500/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CONNECT MAILBOX */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in font-sans text-xs">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Want emails scanned automatically?</h3>
              <p className="text-slate-400">
                Connect your cloud email provider for real-time automated quarantine or skip to manual uploads.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={handleConnectGmail}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  connectedMailbox === 'gmail'
                    ? 'bg-redrob-blue/15 border-redrob-blue shadow-lg shadow-blue-500/10'
                    : 'bg-[#050814] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-red-400" />
                    <span className="font-bold text-white text-sm">Connect Gmail</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-redrob-aqua border border-white/10 font-mono">
                    OAuth 2.0
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-2">
                  Real-time Google Workspace webhook ingestion and spam flag synchronization.
                </p>
              </div>

              <div
                onClick={() => setConnectedMailbox('outlook')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  connectedMailbox === 'outlook'
                    ? 'bg-redrob-blue/15 border-redrob-blue shadow-lg shadow-blue-500/10'
                    : 'bg-[#050814] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-white text-sm">Connect Outlook</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-redrob-aqua border border-white/10 font-mono">
                    Microsoft 365
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-2">
                  Exchange Graph API connector with automated tenant quarantine actions.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setConnectedMailbox('manual');
                    setStep(3);
                  }}
                  className="text-xs text-slate-400 hover:text-redrob-aqua underline cursor-pointer"
                >
                  Skip — I'll upload manually
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-500/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INVITE TEAM MEMBERS */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in font-sans text-xs">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Invite Team Members</h3>
              <p className="text-slate-400">
                Add security analysts and colleagues so they can collaborate on incident cases.
              </p>
            </div>

            {/* Quick Add Form */}
            <div className="flex gap-2">
              <input
                type="email"
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                placeholder="colleague@acmebank.com"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-600 focus:border-redrob-blue focus:outline-none text-xs font-mono"
              />
              <select
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none text-xs"
              >
                <option value="Security Analyst">Security Analyst</option>
                <option value="Employee / Reporter">Employee / Reporter</option>
                <option value="Lead Admin">Lead Admin</option>
              </select>
              <button
                type="button"
                onClick={handleAddMember}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Invite</span>
              </button>
            </div>

            {/* Invite Toast */}
            {inviteToast && (
              <div className="p-2.5 rounded-xl bg-redrob-blue/10 border border-redrob-blue/30 text-redrob-aqua text-[11px] font-mono animate-fade-in">
                {inviteToast}
              </div>
            )}

            {/* Team List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {teamEmails.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#050814] border border-white/5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-redrob-blue/20 text-redrob-blue flex items-center justify-center font-bold text-[10px]">
                      {member.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-white font-mono text-xs">{member.email}</span>
                      <span className="text-slate-500 text-[10px] block">{member.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(idx)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                onClick={handleSkipAll}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Skip, I'll do this later
              </button>

              <button
                onClick={handleFinish}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-redrob-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-xl shadow-blue-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Launch Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
