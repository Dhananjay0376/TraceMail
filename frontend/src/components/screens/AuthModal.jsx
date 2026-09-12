import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User,
  Building,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Phone,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import Modal from '../common/Modal';
import { signUpUser, resendEmailConfirmation, signInUser, sendPasswordReset, signInWithGoogle } from '../../lib/supabase';
import { DEMO_USER } from '../../mock/mockData';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'signup', 'otp', 'forgot', 'demo'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('analyst');
  const [phone, setPhone] = useState('');
  const [demoNotes, setDemoNotes] = useState('10k');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync mode when initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setIsSuccess(false);
      setErrorMessage('');
      setIsLoading(false);
    }
  }, [isOpen, initialMode]);

  // 30-second countdown for OTP resend
  useEffect(() => {
    let interval;
    if (mode === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  const handleResendConfirmation = async () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    setErrorMessage('');
    try {
      await resendEmailConfirmation({ email });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend the confirmation email. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
      if (!agreedTerms) {
        setErrorMessage('You must agree to the Terms of Service & Privacy Policy.');
        return;
      }
      setIsLoading(true);
      try {
        const result = await signUpUser({ email, password, name, org, role });
        if (result.needsVerification) {
          setResendTimer(30);
          setCanResend(false);
          setMode('otp');
        } else if (result.user) {
          // Auto-confirmed (e.g. email auth disabled)
          setSuccessMessage('Account created! Setting up your workspace...');
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onAuthSuccess && onAuthSuccess(result.user);
            onClose();
          }, 1200);
        }
      } catch (err) {
        setErrorMessage(err.message || 'Signup failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (mode === 'otp') {
      setIsLoading(true);
      try {
        const result = await signInUser({ email, password });
        setSuccessMessage('Email verified successfully! Setting up your workspace...');
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onAuthSuccess && onAuthSuccess(result.user);
          onClose();
        }, 1200);
      } catch (err) {
        setErrorMessage(err.message || 'Your email is not confirmed yet. Open the confirmation link in your inbox, then try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (mode === 'login') {
      setIsLoading(true);
      try {
        const result = await signInUser({ email, password });
        setSuccessMessage('Authentication confirmed. Launching security console...');
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onAuthSuccess && onAuthSuccess({
            id: result.user?.id,
            email: result.user?.email || email,
            name: result.user?.name || email.split('@')[0],
            org: result.user?.org || '',
            role: result.user?.role || 'analyst',
            avatar: result.user?.avatar,
            isFirstTime: false,
            isDemo: false,
          });
          onClose();
        }, 1000);
      } catch (err) {
        setErrorMessage(err.message || 'Invalid email or password.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (mode === 'demo') {
      setSuccessMessage('Logged into Demo Account (Shri)');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onAuthSuccess && onAuthSuccess(DEMO_USER);
        onClose();
      }, 1000);
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      try {
        await sendPasswordReset({ email });
        setSuccessMessage(`Password reset link sent to ${email}. Check your inbox.`);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setMode('login');
        }, 2500);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to send reset email.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (mode === 'demo') {
      setSuccessMessage('Thank you! Our enterprise security architect will contact you within 24 hours.');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
      return;
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      const result = await signInWithGoogle({ intent: mode === 'signup' ? 'signup' : 'login' });
      if (result?.user) {
        setSuccessMessage('Google Authentication confirmed. Launching security console...');
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onAuthSuccess && onAuthSuccess(result.user);
          onClose();
        }, 1000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup':
        return 'Create Your TraceMail Account';
      case 'otp':
        return 'Verify Your Work Email';
      case 'forgot':
        return 'Reset Your Password';
      case 'demo':
        return 'Request an Enterprise Demo';
      case 'login':
      default:
        return 'Sign In to TraceMail';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup':
        return 'Step 1 of 2: Organization Account Creation';
      case 'otp':
        return 'Step 2 of 2: Confirm Your Email Address';
      case 'forgot':
        return 'We will send secure recovery instructions to your email';
      case 'demo':
        return 'Experience high-volume AI threat triage tailored for your team';
      case 'login':
      default:
        return 'Enter your credentials to access your security operations dashboard';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      subtitle={getSubtitle()}
      maxWidth="max-w-md"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-4 animate-fade-in font-sans">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white tracking-tight">{successMessage}</h4>
          <p className="text-xs text-slate-400">Please wait while we establish your secure session...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SIGN UP FIELDS */}
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@acmebank.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 text-xs font-mono"
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
                    placeholder="Acme Bank Security Team"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-medium">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-[#050814] border-white/20 text-redrob-blue focus:ring-0"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-400 cursor-pointer">
                  I agree to the <span className="text-redrob-blue hover:underline">Terms of Service</span> and{' '}
                  <span className="text-redrob-blue hover:underline">Privacy Policy</span>.
                </label>
              </div>
            </>
          )}

          {/* OTP VERIFICATION FIELDS */}
          {mode === 'otp' && (
            <div className="space-y-4 py-2">
              <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-blue-200 text-xs leading-relaxed">
                We sent a confirmation link to <span className="font-mono font-bold text-white">{email || 'your email'}</span>.
                Open the link to verify your account, then return here and continue.
              </div>

              <div className="text-center pt-2">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    className="text-xs text-redrob-blue font-bold hover:underline cursor-pointer"
                  >
                    Resend Confirmation Email
                  </button>
                ) : (
                  <p className="text-[11px] text-slate-500 font-mono">
                    Resend confirmation email in <span className="text-slate-300 font-bold">{resendTimer}s</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* LOGIN FIELDS */}
          {mode === 'login' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@apexdefense.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-400 font-medium">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-redrob-blue hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {/* FORGOT PASSWORD FIELDS */}
          {mode === 'forgot' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter the email associated with your account and we'll send you a password reset link.
              </p>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@apexdefense.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* REQUEST DEMO FIELDS */}
          {mode === 'demo' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Miller"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan.miller@enterprise.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Organization / Enterprise Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="Global Financial Security Corp"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Expected Monthly Email Volume</label>
                <select
                  value={demoNotes}
                  onChange={(e) => setDemoNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-white focus:border-redrob-blue focus:outline-none text-xs"
                >
                  <option value="10k">10,000 - 50,000 emails / month</option>
                  <option value="100k">50,000 - 250,000 emails / month</option>
                  <option value="1m">250,000+ emails / month (Enterprise Dedicated MTA)</option>
                </select>
              </div>
            </>
          )}

          {/* GOOGLE SIGN-IN (login and signup only) */}
          {(mode === 'login' || mode === 'signup') && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 mt-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {/* Google SVG Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-slate-500 text-[11px] font-mono">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </>
          )}

          {/* SUBMIT ACTION BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold text-xs uppercase tracking-wider shadow-redrob-glow transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'signup'
                    ? 'Create Account'
                    : mode === 'otp'
                      ? 'I Verified My Email'
                      : mode === 'login'
                        ? 'Login to Security Dashboard'
                        : mode === 'forgot'
                          ? 'Send Reset Link'
                          : 'Request Enterprise Demo'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* BOTTOM NAVIGATION SWITCHES */}
          <div className="pt-3 text-center border-t border-white/10 space-y-1.5">
            {mode === 'login' && (
              <p className="text-slate-400 text-xs">
                New user?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-redrob-blue font-bold hover:underline"
                >
                  Sign Up for TraceMail
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p className="text-slate-400 text-xs">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-redrob-blue font-bold hover:underline"
                >
                  Login
                </button>
              </p>
            )}

            {(mode === 'forgot' || mode === 'otp' || mode === 'demo') && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto pt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
}
