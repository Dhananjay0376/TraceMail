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
import ScrollStack, { ScrollStackItem } from '../vfx/ScrollStack';
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
    setTeamEmails([...teamEmails, { email: trimmed, role: newRoleInput }]);
    setNewEmailInput('');
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
    const onMessage = (event) => {
      if (event.data?.type === 'gmail_connected') {
        setConnectedMailbox('gmail');
        window.removeEventListener('message', onMessage);
      }
    };
    window.addEventListener('message', onMessage);
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
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-3xl font-mono relative">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-2 px-4 border-b border-white/10">
          <div>
            <span className="text-[10px] text-redrob-aqua font-bold uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Workspace Setup Wizard • React Bits Stack
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Initialize Defense Perimeter
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                  step === s
                    ? 'bg-redrob-blue text-white shadow-lg shadow-blue-500/30 scale-105 border border-blue-400/50'
                    : step > s
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-[#050814] text-slate-500 border border-white/10 hover:border-white/30'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </button>
            ))}
          </div>
        </div>

        {/* ScrollStack Component Wrapping the Setup Cards */}
        <ScrollStack
          className="w-full"
          itemDistance={50}
          itemScale={0.04}
          itemStackDistance={20}
          stackPosition="10%"
          baseScale={0.92}
          blurAmount={1.5}
        >
          {/* CARD 1: CREATE OR JOIN ORGANIZATION */}
          <ScrollStackItem itemClassName="border border-blue-500/30 bg-[#0b1026]/95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                  1
                </div>
                <div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Step 1 of 3</span>
                  <h3 className="text-lg font-extrabold text-white">Create or Join Organization</h3>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                Perimeter Setup
              </span>
            </div>

            <div className="space-y-5 font-sans text-xs">
              <p className="text-slate-300">
                Welcome to TraceMail! Let's initialize your corporate cyber defense perimeter.
              </p>

              {/* Two Choice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setOrgMode('create')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    orgMode === 'create'
                      ? 'bg-redrob-blue/20 border-redrob-blue shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
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
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    orgMode === 'join'
                      ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/50'
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

              {/* Dynamic Inputs */}
              {orgMode === 'create' ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium text-[11px]">Organization / Enterprise Name</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Acme Bank Security Team"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium text-[11px]">Protected Corporate Domain</label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="e.g. acmebank.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none text-xs font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      Used for automated DMARC validation, lookalike typo detection, and VIP impersonation checks.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium text-[11px]">Organization Invite Code</label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="e.g. SEC-ACME-8924"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none text-xs font-mono uppercase tracking-widest"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-500/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </ScrollStackItem>

          {/* CARD 2: CONNECT MAILBOX */}
          <ScrollStackItem itemClassName="border border-purple-500/30 bg-[#0b1026]/95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                  2
                </div>
                <div>
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Step 2 of 3</span>
                  <h3 className="text-lg font-extrabold text-white">Connect Mailbox (Optional)</h3>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                MTA Ingestion
              </span>
            </div>

            <div className="space-y-5 font-sans text-xs">
              <div>
                <h4 className="text-xs font-bold text-white mb-1">Want emails scanned automatically?</h4>
                <p className="text-slate-300">
                  Connect your cloud email provider for real-time automated quarantine or skip to manual uploads.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={handleConnectGmail}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    connectedMailbox === 'gmail'
                      ? 'bg-redrob-blue/20 border-redrob-blue shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
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
                  <p className="text-slate-400 text-[11px] mt-2 leading-relaxed">
                    Real-time Google Workspace webhook ingestion and spam flag synchronization.
                  </p>
                </div>

                <div
                  onClick={() => setConnectedMailbox('outlook')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    connectedMailbox === 'outlook'
                      ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
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
                  <p className="text-slate-400 text-[11px] mt-2 leading-relaxed">
                    Exchange Graph API connector with automated tenant quarantine actions.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setConnectedMailbox('manual');
                      setStep(3);
                    }}
                    className="text-xs text-slate-400 hover:text-redrob-aqua underline cursor-pointer"
                  >
                    Skip — I'll upload manually
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-500/20"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollStackItem>

          {/* CARD 3: INVITE TEAM MEMBERS */}
          <ScrollStackItem itemClassName="border border-emerald-500/30 bg-[#0b1026]/95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
                  3
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Step 3 of 3</span>
                  <h3 className="text-lg font-extrabold text-white">Invite Team Members</h3>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                Team Roles
              </span>
            </div>

            <div className="space-y-5 font-sans text-xs">
              <div>
                <p className="text-slate-300">
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
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none text-xs font-mono"
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
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
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
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {teamEmails.length === 0 ? (
                  <div className="p-3 rounded-xl bg-[#050814]/50 border border-white/5 text-slate-500 text-center text-[11px]">
                    No invitations added yet. You can invite team members now or later from Settings.
                  </div>
                ) : (
                  teamEmails.map((member, idx) => (
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
                          <span className="text-slate-400 text-[10px] block">{member.role}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleSkipAll}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Skip, I'll do this later
                </button>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-redrob-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-xl shadow-blue-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Launch Dashboard</span>
                </button>
              </div>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </div>
  );
}
