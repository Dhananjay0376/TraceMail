import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mexawvaenkiaikdbaxnz.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFub24iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDE3ODc2ODAwfQ.placeholder";
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || "";
const RESEND_FROM = import.meta.env.VITE_RESEND_FROM || "onboarding@resend.dev";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

// In-memory OTP store: email -> { code, expiresAt, password, name, org, role }
const otpStore = new Map();

function generateOtp() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(arr[0] % 900000 + 100000);
}

function getAvatarUrl(meta, email, name) {
  if (meta?.avatar_url) return meta.avatar_url;
  if (meta?.picture) return meta.picture;
  if (meta?.avatar) return meta.avatar;
  const displayName = name || email?.split("@")[0] || "User";
  return `https://unavatar.io/${encodeURIComponent(email || "")}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1d4ed8&color=fff`;
}

async function sendOtpViaResend(email, code, name) {
  const html = `<div style="font-family:sans-serif;background:#050814;color:#e2e8f0;padding:40px;border-radius:16px;max-width:480px;margin:auto"><div style="display:flex;align-items:center;gap:10px;margin-bottom:24px"><div style="width:36px;height:36px;background:linear-gradient(135deg,#1d4ed8,#7c3aed);border-radius:10px"></div><span style="font-weight:900;font-size:18px;color:white">TraceMail</span></div><h2 style="color:white;margin:0 0 8px">Verify your email address</h2><p style="color:#94a3b8;font-size:14px;margin:0 0 32px">Hi ${name || "there"}, enter this 6-digit code to complete your account setup:</p><div style="background:#0b1026;border:1px solid rgba(29,78,216,0.4);border-radius:14px;padding:28px;text-align:center;margin-bottom:24px"><div style="font-size:44px;font-weight:900;letter-spacing:14px;color:#60a5fa;font-family:monospace">${code}</div><p style="color:#475569;font-size:12px;margin:12px 0 0">Expires in 10 minutes &bull; Do not share this code</p></div><p style="color:#475569;font-size:12px">If you did not create a TraceMail account, you can safely ignore this email.</p></div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: RESEND_FROM, to: [email], subject: `${code} is your TraceMail verification code`, html }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Email delivery failed (${res.status})`);
  }
}

export async function signUpUser({ email, password, name, org, role = "analyst" }) {
  const code = generateOtp();
  otpStore.set(email.toLowerCase(), { code, expiresAt: Date.now() + 10 * 60 * 1000, password, name, org, role });
  await sendOtpViaResend(email, code, name);
  return { user: null, session: null, needsVerification: true };
}

export async function verifyEmailOtp({ email, token }) {
  const key = email.toLowerCase();
  const stored = otpStore.get(key);
  if (!stored) throw new Error("No verification code found. Please sign up again.");
  if (Date.now() > stored.expiresAt) { otpStore.delete(key); throw new Error("Code expired. Please sign up again."); }
  if (stored.code !== token) throw new Error("Incorrect verification code. Please try again.");
  otpStore.delete(key);

  let { data, error } = await supabase.auth.signUp({
    email,
    password: stored.password,
    options: { data: { full_name: stored.name, organization: stored.org, role: stored.role } },
  });

  if (error?.message?.toLowerCase().includes("already registered")) {
    const r2 = await supabase.auth.signInWithPassword({ email, password: stored.password });
    if (r2.error) throw new Error(r2.error.message);
    data = r2.data; error = null;
  }
  if (error) throw new Error(error.message);

  const meta = data.user?.user_metadata || {};
  const userName = meta.full_name || stored.name || email.split("@")[0];
  return {
    user: {
      id: data.user?.id,
      email: data.user?.email || email,
      name: userName,
      org: meta.organization || stored.org || "",
      role: meta.role || stored.role || "analyst",
      avatar: getAvatarUrl(meta, data.user?.email || email, userName),
    },
    session: data.session,
  };
}

export async function resendEmailOtp({ email }) {
  const key = email.toLowerCase();
  const stored = otpStore.get(key);
  if (!stored) throw new Error("No pending signup found. Please start over.");
  const code = generateOtp();
  otpStore.set(key, { ...stored, code, expiresAt: Date.now() + 10 * 60 * 1000 });
  await sendOtpViaResend(email, code, stored.name);
}

export async function signInUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  const meta = data.user?.user_metadata || {};
  const userName = meta.full_name || meta.name || data.user.email?.split("@")[0] || "Analyst";
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      name: userName,
      org: meta.organization || "Security Operations",
      role: meta.role || "analyst",
      avatar: getAvatarUrl(meta, data.user.email, userName),
      isFirstTime: false,
    },
    session: data.session,
  };
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/#dashboard`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentSession() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  } catch (err) {
    console.warn("Supabase getCurrentSession fallback:", err);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) return null;
    const meta = data.user.user_metadata || {};
    const userName = meta.full_name || meta.name || data.user.email?.split("@")[0] || "Analyst";
    return {
      id: data.user.id,
      email: data.user.email,
      name: userName,
      org: meta.organization || "",
      role: meta.role || "analyst",
      avatar: getAvatarUrl(meta, data.user.email, userName),
      isFirstTime: false,
    };
  } catch (err) {
    console.warn("Supabase getCurrentUser fallback:", err);
    return null;
  }
}

export async function sendPasswordReset({ email }) {
  const code = generateOtp();
  const html = `<div style="font-family:sans-serif;background:#050814;color:#e2e8f0;padding:40px;border-radius:16px;max-width:480px;margin:auto"><h2 style="color:white">Reset your TraceMail password</h2><p style="color:#94a3b8">Use this code to reset your password:</p><div style="background:#0b1026;border:1px solid rgba(239,68,68,0.4);border-radius:14px;padding:28px;text-align:center;margin:24px 0"><div style="font-size:44px;font-weight:900;letter-spacing:14px;color:#f87171;font-family:monospace">${code}</div><p style="color:#475569;font-size:12px;margin:12px 0 0">Expires in 10 minutes</p></div></div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: RESEND_FROM, to: [email], subject: `${code} — TraceMail Password Reset`, html }),
  });
  if (!res.ok) throw new Error("Failed to send password reset email.");
}

export async function signOutUser() {
  await supabase.auth.signOut();
}

export async function sendTeamInvitation({ email, role, inviterName, inviterOrg }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
  const html = `<div style="font-family:sans-serif;background:#050814;color:#e2e8f0;padding:40px;border-radius:16px;max-width:480px;margin:auto"><div style="display:flex;align-items:center;gap:10px;margin-bottom:24px"><div style="width:36px;height:36px;background:linear-gradient(135deg,#1d4ed8,#7c3aed);border-radius:10px"></div><span style="font-weight:900;font-size:18px;color:white">TraceMail</span></div><h2 style="color:white">You have been invited!</h2><p style="color:#94a3b8;font-size:14px">${inviterName} has invited you to join <b style="color:white">${inviterOrg}</b> on TraceMail as a <b style="color:#60a5fa">${role}</b>.</p><div style="margin:28px 0"><a href="${origin}/#home" style="background:#1d4ed8;color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:14px">Accept Invitation &rarr;</a></div><p style="color:#475569;font-size:12px">TraceMail is an AI-powered email fraud detection and forensic analysis platform.</p></div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: RESEND_FROM, to: [email], subject: `${inviterName} invited you to ${inviterOrg} on TraceMail`, html }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to send invitation.");
  }
  return await res.json();
}
