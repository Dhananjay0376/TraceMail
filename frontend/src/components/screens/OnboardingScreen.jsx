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
  Lock,
  Zap,
  Globe,
  Radio,
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

  // Step 1 validation requirement
  const isStep1Valid = orgMode === 'create'
    ? Boolean(orgName.trim() && domain.trim())
    : Boolean(inviteCode.trim());

  const showInviteToast = (msg) => {
    setInviteToast(msg);
    setTimeout(() => setInviteToast(''), 4000);
  };

  const handleStep1Continue = () => {
    if (!isStep1Valid) {
      if (orgMode === 'create') {
        if (!orgName.trim() && !domain.trim()) {
          showInviteToast('⚠️ Please enter Organization Name and Protected Corporate Domain.');
        } else if (!orgName.trim()) {
          showInviteToast('⚠️ Please enter an Organization / Enterprise Name.');
        } else if (!domain.trim()) {
          showInviteToast('⚠️ Please enter a Protected Corporate Domain (e.g. acmebank.com).');
        }
      } else {
        showInviteToast('⚠️ Please enter your Organization Invite Code.');
      }
      return;
    }
    setStep(2);
  };

  const handleSelectStep = (s) => {
    if (s > 1 && !isStep1Valid) {
      showInviteToast('⚠️ Complete Step 1 details first to unlock remaining setup steps.');
      return;
    }
    setStep(s);
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
    if (!isStep1Valid) {
      showInviteToast('⚠️ Please complete Step 1 organization details before launching dashboard.');
      setStep(1);
      return;
    }
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

  const stepsList = [
    { id: 1, title: 'Organization Setup', desc: 'Enterprise domain & perimeter', icon: Building2 },
    { id: 2, title: 'Connect Mailbox', desc: 'MTA OAuth 2.0 / Exchange Graph', icon: Mail },
    { id: 3, title: 'Invite Team', desc: 'Collaborators & SOC roles', icon: Users },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Toast Alert Popup */}
      {inviteToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#0b1026] border border-amber-500/50 text-amber-300 text-xs font-mono shadow-2xl animate-bounce max-w-md flex items-center justify-between gap-3">
          <span>{inviteToast}</span>
          <button onClick={() => setInviteToast('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main 2-Column Split Container: Left Fixed Info Panel, Right Cards Panel */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: Static Setup Progress & Info Sidebar */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0b1026] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 font-mono shimmer-card">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-redrob-aqua font-bold uppercase tracking-widest mb-1">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>TraceMail SOC Setup</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Perimeter Setup
            </h2>
            <p className="text-slate-400 text-xs mt-2 font-sans leading-relaxed">
              Initialize your corporate cyber defense workspace, domain lookalike filters, and threat response team.
            </p>
          </div>

          {/* Vertical Step Indicators */}
          <div className="space-y-3 pt-2">
            {stepsList.map((st) => {
              const isLocked = st.id > 1 && !isStep1Valid;
              const isActive = step === st.id;
              const isDone = st.id === 1 && isStep1Valid;

              return (
                <div
                  key={st.id}
                  onClick={() => handleSelectStep(st.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    isActive
                      ? 'bg-redrob-blue/20 border-redrob-blue text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                      : isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                      : isLocked
                      ? 'bg-[#050814]/60 border-white/5 text-slate-500 cursor-not-allowed opacity-60'
                      : 'bg-[#050814] border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isActive
                      ? 'bg-redrob-blue text-white shadow-md shadow-blue-500/30'
                      : isLocked
                      ? 'bg-[#050814] text-slate-600 border border-white/10'
                      : 'bg-[#050814] text-slate-400 border border-white/10'
                  }`}>
                    {isDone ? <Check className="w-4 h-4 text-emerald-400" /> : isLocked ? <Lock className="w-3.5 h-3.5 text-amber-500/70" /> : st.id}
                  </div>

                  <div className="flex-1 min-w-0 font-sans">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold truncate">{st.title}</h4>
                      {isDone && <span className="text-[10px] text-emerald-400 font-mono">✓ Ready</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Defense Perimeter Status Checklist */}
          <div className="p-4 rounded-2xl bg-[#050814] border border-white/10 font-sans space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Active Perimeter Checks</span>
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isStep1Valid ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                <span>Domain Typo &amp; VIP Filter</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${connectedMailbox ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span>MTA Ingestion Connector</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${teamEmails.length > 0 ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span>SOC Analyst Invites ({teamEmails.length})</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Setup Cards Stack (Positioned on the Right Side) */}
        <div className="lg:col-span-8 w-full font-mono">
          <ScrollStack
            className="w-full"
            itemDistance={30}
            itemScale={0.03}
            itemStackDistance={15}
            stackPosition="5%"
            baseScale={0.94}
            blurAmount={1}
            maxUnlockedIndex={isStep1Valid ? 2 : 0}
          >
            {/* CARD 1: CREATE OR JOIN ORGANIZATION */}
            <ScrollStackItem itemClassName={`border transition-all duration-300 ${
              isStep1Valid ? 'border-emerald-500/40 bg-[#0b1026]/95 shadow-emerald-500/10' : 'border-blue-500/40 bg-[#0b1026]/95'
            }`}>
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${
                    isStep1Valid ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {isStep1Valid ? <Check className="w-4 h-4 text-emerald-400" /> : 1}
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Step 1 of 3 (Required)</span>
                    <h3 className="text-base font-extrabold text-white">Create or Join Organization</h3>
                  </div>
                </div>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono border ${
                  isStep1Valid ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  {isStep1Valid ? '✓ Step 1 Complete' : '⚠️ Required'}
                </span>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <p className="text-slate-300">
                  Welcome to TraceMail! Let's initialize your corporate cyber defense perimeter.
                </p>

                {/* Two Choice Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div
                    onClick={() => setOrgMode('create')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      orgMode === 'create'
                        ? 'bg-redrob-blue/20 border-redrob-blue shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                        : 'bg-[#050814] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-redrob-blue/20 flex items-center justify-center text-redrob-blue">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-bold text-white text-xs">Create a new organization</h3>
                    </div>
                    <p className="text-slate-400 text-[10px] mt-1.5 leading-relaxed">
                      Start a fresh security workspace and invite your analysts and security responders.
                    </p>
                  </div>

                  <div
                    onClick={() => setOrgMode('join')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      orgMode === 'join'
                        ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/50'
                        : 'bg-[#050814] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <KeyRound className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-bold text-white text-xs">Join an existing one</h3>
                    </div>
                    <p className="text-slate-400 text-[10px] mt-1.5 leading-relaxed">
                      Enter an invite code provided by your organization's security administrator.
                    </p>
                  </div>
                </div>

                {/* Dynamic Inputs */}
                {orgMode === 'create' ? (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium text-[11px] flex items-center justify-between">
                        <span>Organization / Enterprise Name <span className="text-red-400">*</span></span>
                        {!orgName.trim() && <span className="text-[10px] text-amber-400 font-mono">Required</span>}
                      </label>
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="e.g. Acme Bank Security Team"
                        className={`w-full px-3.5 py-2 rounded-xl bg-[#050814] border text-white focus:outline-none text-xs transition-all ${
                          !orgName.trim() ? 'border-amber-500/40 focus:border-amber-400' : 'border-emerald-500/40 focus:border-emerald-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium text-[11px] flex items-center justify-between">
                        <span>Protected Corporate Domain <span className="text-red-400">*</span></span>
                        {!domain.trim() && <span className="text-[10px] text-amber-400 font-mono">Required</span>}
                      </label>
                      <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="e.g. acmebank.com"
                        className={`w-full px-3.5 py-2 rounded-xl bg-[#050814] border text-white focus:outline-none text-xs font-mono transition-all ${
                          !domain.trim() ? 'border-amber-500/40 focus:border-amber-400' : 'border-emerald-500/40 focus:border-emerald-400'
                        }`}
                      />
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">
                        Used for automated DMARC validation, lookalike typo detection, and VIP impersonation checks.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium text-[11px] flex items-center justify-between">
                        <span>Organization Invite Code <span className="text-red-400">*</span></span>
                        {!inviteCode.trim() && <span className="text-[10px] text-amber-400 font-mono">Required</span>}
                      </label>
                      <input
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder="e.g. SEC-ACME-8924"
                        className={`w-full px-3.5 py-2 rounded-xl bg-[#050814] border text-white focus:outline-none text-xs font-mono uppercase tracking-widest transition-all ${
                          !inviteCode.trim() ? 'border-amber-500/40 focus:border-amber-400' : 'border-emerald-500/40 focus:border-emerald-400'
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleStep1Continue}
                    className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
                      isStep1Valid
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                        : 'bg-redrob-blue hover:bg-redrob-blueHover opacity-95 shadow-blue-500/20'
                    }`}
                  >
                    <span>{isStep1Valid ? 'Unlock & Continue' : 'Fill Fields to Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ScrollStackItem>

            {/* CARD 2: CONNECT MAILBOX */}
            <ScrollStackItem itemClassName={`border transition-all duration-300 relative ${
              !isStep1Valid ? 'border-white/10 bg-[#0b1026]/70 opacity-60' : 'border-purple-500/40 bg-[#0b1026]/95 shadow-purple-500/10'
            }`}>
              {!isStep1Valid && (
                <div className="absolute inset-0 bg-[#050814]/85 backdrop-blur-sm rounded-[24px] z-20 flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Card Locked</h4>
                    <p className="text-[11px] text-amber-300/90 max-w-xs mt-0.5 font-mono">
                      Please fill out Organization Name &amp; Protected Domain in Card 1 to unlock Mailbox Connection.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs border border-purple-500/30">
                    2
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Step 2 of 3</span>
                    <h3 className="text-base font-extrabold text-white">Connect Mailbox (Optional)</h3>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                  MTA Ingestion
                </span>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Want emails scanned automatically?</h4>
                  <p className="text-slate-300">
                    Connect your cloud email provider for real-time automated quarantine or skip to manual uploads.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div
                    onClick={isStep1Valid ? handleConnectGmail : undefined}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      connectedMailbox === 'gmail'
                        ? 'bg-redrob-blue/20 border-redrob-blue shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                        : 'bg-[#050814] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-red-400" />
                        <span className="font-bold text-white text-xs">Connect Gmail</span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-redrob-aqua border border-white/10 font-mono">
                        OAuth 2.0
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px] mt-1.5 leading-relaxed">
                      Real-time Google Workspace webhook ingestion and spam flag synchronization.
                    </p>
                  </div>

                  <div
                    onClick={isStep1Valid ? () => setConnectedMailbox('outlook') : undefined}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      connectedMailbox === 'outlook'
                        ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                        : 'bg-[#050814] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-white text-xs">Connect Outlook</span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-redrob-aqua border border-white/10 font-mono">
                        Microsoft 365
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px] mt-1.5 leading-relaxed">
                      Exchange Graph API connector with automated tenant quarantine actions.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-3.5 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
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
            <ScrollStackItem itemClassName={`border transition-all duration-300 relative ${
              !isStep1Valid ? 'border-white/10 bg-[#0b1026]/70 opacity-60' : 'border-emerald-500/40 bg-[#0b1026]/95 shadow-emerald-500/10'
            }`}>
              {!isStep1Valid && (
                <div className="absolute inset-0 bg-[#050814]/85 backdrop-blur-sm rounded-[24px] z-20 flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Card Locked</h4>
                    <p className="text-[11px] text-amber-300/90 max-w-xs mt-0.5 font-mono">
                      Please fill out Organization Name &amp; Protected Domain in Card 1 to unlock Team Invitations.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs border border-emerald-500/30">
                    3
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Step 3 of 3</span>
                    <h3 className="text-base font-extrabold text-white">Invite Team Members</h3>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                  Team Roles
                </span>
              </div>

              <div className="space-y-4 font-sans text-xs">
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
                    disabled={!isStep1Valid}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none text-xs font-mono"
                  />
                  <select
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    disabled={!isStep1Valid}
                    className="px-3 py-2 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none text-xs"
                  >
                    <option value="Security Analyst">Security Analyst</option>
                    <option value="Employee / Reporter">Employee / Reporter</option>
                    <option value="Lead Admin">Lead Admin</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddMember}
                    disabled={!isStep1Valid}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invite</span>
                  </button>
                </div>

                {/* Team List */}
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {teamEmails.length === 0 ? (
                    <div className="p-3 rounded-xl bg-[#050814]/50 border border-white/5 text-slate-500 text-center text-[10px]">
                      No invitations added yet. You can invite team members now or later from Settings.
                    </div>
                  ) : (
                    teamEmails.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#050814] border border-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-redrob-blue/20 text-redrob-blue flex items-center justify-center font-bold text-[9px]">
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

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
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
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-redrob-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-xl shadow-blue-500/20"
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
    </div>
  );
}
