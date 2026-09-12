import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, XCircle, ArrowRight, Server, Key, AlertTriangle } from 'lucide-react';

export default function OAuthConsentScreen({ currentUser, onNavigate }) {
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState(null);

  // Parse URL search or hash parameters
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    let hashQuery = {};
    if (hash.includes('?')) {
      const hashParams = new URLSearchParams(hash.split('?')[1]);
      hashParams.forEach((val, key) => { hashQuery[key] = val; });
    }

    return {
      clientId: searchParams.get('client_id') || hashQuery.client_id || 'TraceMail Client App',
      redirectUri: searchParams.get('redirect_uri') || hashQuery.redirect_uri || '',
      scope: searchParams.get('scope') || hashQuery.scope || 'openid email profile gmail.readonly',
      state: searchParams.get('state') || hashQuery.state || '',
      responseType: searchParams.get('response_type') || hashQuery.response_type || 'code',
    };
  };

  const params = getQueryParams();

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setError(null);

    setTimeout(() => {
      if (params.redirectUri) {
        try {
          const redirectUrl = new URL(params.redirectUri);
          redirectUrl.searchParams.set('code', 'demo_oauth_auth_code_' + Math.random().toString(36).substring(2, 10));
          if (params.state) {
            redirectUrl.searchParams.set('state', params.state);
          }
          window.location.href = redirectUrl.toString();
        } catch (e) {
          setError('Invalid redirect_uri provided by application.');
          setIsAuthorizing(false);
        }
      } else {
        // Default internal redirect if no redirect URI is set
        if (onNavigate) onNavigate('dashboard');
      }
    }, 1000);
  };

  const handleDeny = () => {
    if (params.redirectUri) {
      try {
        const redirectUrl = new URL(params.redirectUri);
        redirectUrl.searchParams.set('error', 'access_denied');
        if (params.state) {
          redirectUrl.searchParams.set('state', params.state);
        }
        window.location.href = redirectUrl.toString();
      } catch (e) {
        if (onNavigate) onNavigate('dashboard');
      }
    } else {
      if (onNavigate) onNavigate('dashboard');
    }
  };

  const scopesList = params.scope.split(' ').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Decorative Header Aura */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Branding & Title */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 mb-2">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Authorization Request</h2>
          <p className="text-xs text-slate-400">
            An application is requesting permission to access your TraceMail Security account.
          </p>
        </div>

        {/* Client App Card */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Client ID:</span>
            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-blue-400">{params.clientId}</span>
          </div>
          {params.redirectUri && (
            <div className="flex items-center justify-between text-xs text-slate-400 overflow-hidden">
              <span className="font-semibold text-slate-300">Redirect URI:</span>
              <span className="font-mono truncate max-w-[200px] text-slate-400" title={params.redirectUri}>{params.redirectUri}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Logged in as:</span>
            <span className="text-slate-200 font-medium">{currentUser?.email || 'Active User'}</span>
          </div>
        </div>

        {/* Scopes Requested */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-blue-400" /> Permissions Requested
          </h3>
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 space-y-2 max-h-36 overflow-y-auto">
            {scopesList.map((scope, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-blue-300">{scope}</span>
                  <p className="text-[11px] text-slate-400">Allows access to {scope.replace('.', ' ')} features.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleDeny}
            disabled={isAuthorizing}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4 text-slate-400" />
            Deny
          </button>

          <button
            onClick={handleAuthorize}
            disabled={isAuthorizing}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isAuthorizing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Authorize & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
