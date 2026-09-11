import React, { useState } from 'react';
import { Lock, Mail, User, Building, KeyRound, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'otp', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('analyst');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to backend API /api/auth/login or /api/auth/signup

    if (mode === 'signup') {
      // Transition to OTP verification step
      setMode('otp');
      return;
    }

    // Success simulation
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onAuthSuccess && onAuthSuccess({ email, role, name: name || 'Demo User' });
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'login'
          ? 'Secure Analyst Authentication'
          : mode === 'signup'
          ? 'Create TraceMail Workspace Account'
          : mode === 'otp'
          ? 'Two-Factor Hardware/Email Verification'
          : 'Reset Your Credentials'
      }
      subtitle="Enterprise Zero-Trust Authentication Protocol"
      maxWidth="max-w-md"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3 animate-fade-in font-sans">
          <div className="w-16 h-16 rounded-2xl bg-redrob-lime/15 border border-redrob-lime/30 text-redrob-lime mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white tracking-tight">Identity Verified</h4>
          <p className="text-xs text-slate-400">Loading your forensic security session...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Chen"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Organization Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="Apex Cyber Defense Corp"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Workspace Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none text-xs"
                >
                  <option value="analyst">Security Operations Analyst (Full Telemetry)</option>
                  <option value="employee">Employee / Reporter (Simplified Verdicts)</option>
                  <option value="admin">System Administrator / Lead</option>
                </select>
              </div>
            </>
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Corporate Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@apexdefense.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 font-mono text-xs"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-400 font-medium">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-redrob-blue hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 text-xs"
                />
              </div>
            </div>
          )}

          {mode === 'otp' && (
            <div className="space-y-3 py-2">
              <p className="text-xs text-slate-300">
                Enter the 6-digit verification code sent to your registered device:
              </p>
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-2xl bg-[#050814] border border-white/15 text-redrob-blue focus:border-redrob-blue focus:outline-none font-mono"
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-500 text-center font-mono">
                Didn't receive code? <span className="text-redrob-blue cursor-pointer hover:underline">Resend in 30s</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold uppercase tracking-wider text-xs shadow-redrob-glow transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {mode === 'login'
                ? 'Sign In to Portal'
                : mode === 'signup'
                ? 'Continue to Verification'
                : mode === 'otp'
                ? 'Verify & Launch Session'
                : 'Send Reset Instructions'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick toggle between login and signup */}
          <div className="pt-3 text-center border-t border-white/10">
            {mode === 'login' ? (
              <p className="text-slate-400 text-xs">
                Need a new organization workspace?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-redrob-blue font-bold hover:underline"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p className="text-slate-400 text-xs">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-redrob-blue font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
}
