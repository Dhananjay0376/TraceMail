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
} from 'lucide-react';

export default function OnboardingScreen({ onCompleteOnboarding, onSkip }) {
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState('Apex Cyber Defense Corp');
  const [domain, setDomain] = useState('apexdefense.com');
  const [connectedMailbox, setConnectedMailbox] = useState(null);
  const [teamEmails, setTeamEmails] = useState([
    { email: 'm.vance@apexdefense.com', role: 'Security Analyst' },
    { email: 'e.rostova@apexdefense.com', role: 'Security Analyst' },
  ]);

  const handleAddMember = () => {
    setTeamEmails([...teamEmails, { email: '', role: 'Employee / Reporter' }]);
  };

  const handleUpdateMember = (idx, field, value) => {
    const updated = [...teamEmails];
    updated[idx][field] = value;
    setTeamEmails(updated);
  };

  const handleFinish = () => {
    // TODO: connect to backend API /api/org/setup
    onCompleteOnboarding({ orgName, domain, connectedMailbox, teamEmails });
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0c1222] border border-slate-800 shadow-2xl p-6 sm:p-10 font-mono">
        {/* Progress Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
              Workspace Setup Wizard
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Initialize TraceMail Sentinel
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  step === s
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                    : step > s
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Create Organization */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 text-xs">
              <Building2 className="w-5 h-5 shrink-0" />
              <span>Define your organization's perimeter and corporate email domain.</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Organization / Enterprise Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Apex Cyber Defense Corp"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Protected Primary Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. apexdefense.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Used for strict DMARC, lookalike similarity, and CEO impersonation alerts.
                </p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Security Alert Sensitivity</label>
                <select className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none">
                  <option>High Alert (Flag & Contain any score &gt; 60)</option>
                  <option>Medium (Standard Corporate Guardrails &gt; 75)</option>
                  <option>Audit Only (Passive Log Mode)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-cyan-500/20"
              >
                <span>Continue to Mailbox Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Connect Mailbox */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 text-xs">
              <Mail className="w-5 h-5 shrink-0" />
              <span>Connect an inbound email gateway or skip to manual uploads.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {[
                { id: 'm365', name: 'Microsoft 365 Exchange', badge: 'Recommended', desc: 'Auto-scan inbox & automated quarantine rules' },
                { id: 'google', name: 'Google Workspace', badge: 'Popular', desc: 'Real-time Gmail add-on & reporting webhooks' },
                { id: 'imap', name: 'Custom IMAP / Gateway', badge: 'Enterprise', desc: 'Secure TLS mail ingestion via MTA journaling' },
                { id: 'manual', name: 'Manual Upload Only', badge: 'Zero Setup', desc: 'No credentials required. Drag & drop .eml files' },
              ].map((prov) => (
                <div
                  key={prov.id}
                  onClick={() => setConnectedMailbox(prov.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    connectedMailbox === prov.id
                      ? 'bg-cyan-500/10 border-cyan-500 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{prov.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {prov.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">{prov.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="text-xs text-slate-400 hover:text-cyan-400 underline cursor-pointer"
                >
                  Skip, I'll upload manually
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-cyan-500/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Invite Team Members */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 text-xs">
              <Users className="w-5 h-5 shrink-0" />
              <span>Invite analysts and employees to your security workspace.</span>
            </div>

            <div className="space-y-3 text-xs">
              {teamEmails.map((member, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleUpdateMember(idx, 'email', e.target.value)}
                    placeholder="analyst@apexdefense.com"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                  />
                  <select
                    value={member.role}
                    onChange={(e) => handleUpdateMember(idx, 'role', e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option>Security Analyst</option>
                    <option>Employee / Reporter</option>
                    <option>Incident Commander</option>
                  </select>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddMember}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
              >
                + Add Another Team Member
              </button>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleFinish}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-xl shadow-cyan-500/20"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Launch Security Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
