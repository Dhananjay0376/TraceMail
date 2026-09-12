import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  UploadCloud,
  Globe2,
  Lock,
  Share2,
  ArrowRight,
  ArrowLeft,
  Cpu,
  FileCheck,
  AlertTriangle,
  Play,
  Zap,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Mail,
  Shield,
  Search,
  Activity,
} from 'lucide-react';
import MarqueeTicker from '../vfx/MarqueeTicker';

// ─── Hero Carousel Slides ─────────────────────────────────────────────────────
const heroSlides = [
  {
    label: 'TraceMail Forensics',
    headline: 'Stop email fraud before it costs you.',
    sub: 'Before It Reaches Your Workforce.',
    description:
      'Expose phishing, spoofing, and lookalike domains instantly. Reconstruct RFC 822 relay paths, audit DMARC cryptographic signatures, and generate court-ready forensic reports in seconds.',
    bg: 'from-[#061B2E] via-[#083B4B] to-[#061B2E]',
    accent: '#00e3d8',
    product: 'Email Forensics',
  },
  {
    label: 'TraceMail GeoIntel',
    headline: 'Trace Every Hop.',
    sub: 'Expose Every Attacker.',
    description:
      'Reconstruct the full RFC 822 MTA relay path exposing proxy concealment, TOR exit nodes, and bulletproof ASNs with multi-hop IP geolocation intelligence.',
    bg: 'from-[#061B2E] via-[#083B4B] to-[#061B2E]',
    accent: '#00e3d8',
    product: 'Geo Intelligence',
  },
  {
    label: 'TraceMail Attribution',
    headline: 'Connect the Dots.',
    sub: 'Unmask Coordinated Campaigns.',
    description:
      'Correlate isolated email threats into unified coordinated campaigns using graph network clustering and shared IOC fingerprints for total attribution.',
    bg: 'from-[#061B2E] via-[#083B4B] to-[#061B2E]',
    accent: '#00e3d8',
    product: 'Campaign Attribution',
  },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Is TraceMail free to start?',
    a: 'Yes. You can analyze up to 10 emails per month for free and experience full forensic capabilities before choosing a plan.',
  },
  {
    q: 'What email formats does TraceMail support?',
    a: 'TraceMail accepts .eml, .msg, and raw RFC 822 header text. You can paste headers directly from Outlook, Gmail, or any MTA.',
  },
  {
    q: 'Who is TraceMail built for?',
    a: 'Security analysts, SOC teams, enterprise IT departments, compliance officers, and any organization needing to verify email authenticity.',
  },
  {
    q: 'How does TraceMail perform forensic analysis?',
    a: 'Our AI engine extracts relay hops, audits DNS records (SPF/DKIM/DMARC), traces originating IPs, queries global threat feeds, and applies NLP-based phishing detection.',
  },
  {
    q: 'Can I export forensic reports?',
    a: 'Yes. TraceMail generates audit-ready PDF dossiers and JSON exports suitable for court submissions, compliance records, and incident response tickets.',
  },
  {
    q: 'Is my email data private?',
    a: 'All data is encrypted in transit and at rest. Email content is never stored after analysis completes. Your forensic reports are private to your organization.',
  },
  {
    q: 'Where should I start with TraceMail?',
    a: 'Click "Analyze Email Now" to upload a suspicious .eml file or try one of our preloaded CEO wire fraud samples to see the full forensic pipeline in action.',
  },
];

// ─── Reusable Pill Badge ──────────────────────────────────────────────────────
function Pill({ children, color = 'blue' }) {
  const colors = {
    blue: 'bg-[#2b52ff]/10 border-[#2b52ff]/30 text-[#2b52ff]',
    violet: 'bg-[#7c24ff]/10 border-[#7c24ff]/30 text-[#9650ff]',
    aqua: 'bg-[#00e3d8]/10 border-[#00e3d8]/30 text-[#00e3d8]',
  };
  return (
    <span
      className={`inline-block text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${colors[color]}`}
    >
      {children}
    </span>
  );
}

// ─── Product Suite Card ───────────────────────────────────────────────────────
function ProductCard({ title, description, gradientFrom, gradientTo, overlayIcon: Icon, ctaLabel, onClick, badge }) {
  return (
    <div className="relative rounded-[20px] overflow-hidden group cursor-pointer" onClick={onClick}>
      {/* Background gradient with cinematic look */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} transition-transform duration-700 group-hover:scale-105`}
      />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%20fill%3D%22none%22/%3E%3Cpath%20d%3D%22M40%200v40M0%2040h40%22%20stroke%3D%22%23fff%22%20stroke-width%3D%220.5%22/%3E%3C/svg%3E')]" />
      {/* Content */}
      <div className="relative z-10 p-7 flex flex-col min-h-[380px]">
        {/* Badge */}
        {badge && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-white/70 bg-white/10 border border-white/20 rounded-full px-2.5 py-1 w-fit mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#53e097] animate-pulse" />
            {badge}
          </span>
        )}
        {/* Mock UI widget floating in the card */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="w-full max-w-[220px] bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-5 h-5 text-white/80" />
              <span className="text-xs font-mono text-white/60">{title}</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 bg-white/20 rounded-full w-full" />
              <div className="h-2 bg-white/15 rounded-full w-4/5" />
              <div className="h-2 bg-white/10 rounded-full w-3/5" />
            </div>
            <div className="mt-3 h-8 bg-gradient-to-r from-white/5 to-transparent rounded-xl border border-white/10 flex items-center px-3">
              <span className="text-[10px] text-white/40 font-mono">LIVE ANALYSIS</span>
            </div>
          </div>
        </div>
        {/* Bottom content */}
        <div className="mt-auto">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-white/60 leading-relaxed mb-5">{description}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
            className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold font-mono uppercase tracking-wider hover:bg-white/90 transition-all"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden transition-all hover:border-cyan-500/30">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors group"
      >
        <span className="text-base font-semibold text-white/90 pr-4 group-hover:text-cyan-400 transition-colors">{q}</span>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all">
          {isOpen ? (
            <Minus className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-white" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-sm text-white/60 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LandingScreen({
  onStartAnalysis,
  onOpenAuth,
  onOpenDashboard,
  onOpenLogin,
  onOpenSignUp,
  onRequestDemo,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [countAnimated, setCountAnimated] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const statsRef = useRef(null);
  const TARGET_COUNT = 2500000;

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Animate stats counter on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countAnimated) {
          setCountAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = TARGET_COUNT / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= TARGET_COUNT) {
              setDisplayCount(TARGET_COUNT);
              clearInterval(timer);
            } else {
              setDisplayCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [countAnimated]);

  const formatCount = (n) =>
    n.toLocaleString('en-IN');

  const slide = heroSlides[currentSlide];

  return (
    <div className="min-h-screen bg-[#02050A] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-300">

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 · HERO CAROUSEL — Dark Cinematic
      ════════════════════════════════════════════════════════════ */}
      <section className={`relative min-h-screen bg-gradient-to-br ${slide.bg} overflow-hidden transition-all duration-700`}>
        {/* Animated ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] transition-all duration-1000"
            style={{ background: `radial-gradient(circle, ${slide.accent} 0%, transparent 70%)` }}
          />
          <div className="absolute bottom-1/3 left-1/5 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px] bg-[#7c24ff]" />
        </div>

        {/* Subtle scanline texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-4 pb-12 flex flex-col min-h-screen">

          <div className="flex-1 flex flex-col lg:flex-row items-center gap-12">
            {/* Main headline — massive editorial typography */}
            <div className="flex-1 flex flex-col justify-center max-w-2xl relative z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 w-fit mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">SIH 2024 EDITION</span>
              </div>
              <h1 className="mb-4">
                <span className="block font-league uppercase tracking-wider text-5xl sm:text-7xl lg:text-8xl text-white font-normal leading-none drop-shadow-md">
                  {slide.headline}
                </span>
                <span className="block font-besley italic font-medium text-3xl sm:text-5xl lg:text-6xl mt-3 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 drop-shadow-[0_0_15px_rgba(0,227,216,0.35)]">
                  {slide.sub}
                </span>
              </h1>

              <p className="mt-8 text-base sm:text-lg text-white/60 leading-relaxed font-sans max-w-xl">
                {slide.description}
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenSignUp || (() => onOpenAuth && onOpenAuth('signup'))}
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-white/90 transition-all shadow-xl cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  Sign Up Free
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onStartAnalysis}
                  className="flex items-center gap-2 px-7 py-4 rounded-full border border-white/20 text-white/90 hover:border-white/50 hover:text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-redrob-aqua" />
                  Try Interactive Scan
                </button>
                <button
                  onClick={onRequestDemo || (() => onOpenAuth && onOpenAuth('demo'))}
                  className="px-6 py-4 rounded-full text-white/50 hover:text-white text-sm transition-all font-sans cursor-pointer"
                >
                  Request Enterprise Demo
                </button>
              </div>
            </div>

            {/* Right Side - Interactive Globe Element */}
            <div 
              className="hidden lg:flex flex-1 justify-center items-center relative w-full max-w-[600px] aspect-square group"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / 20;
                const y = (e.clientY - rect.top - rect.height / 2) / 20;
                const vid = e.currentTarget.querySelector('video');
                if (vid) vid.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                const vid = e.currentTarget.querySelector('video');
                if (vid) vid.style.transform = `translate(0px, 0px) scale(1)`;
              }}
            >
              {/* Animated outer rings - Glow reduced */}
              <div className="absolute inset-2 rounded-full border border-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.05)] animate-[spin_60s_linear_infinite] pointer-events-none" />
              <div className="absolute inset-8 rounded-full border border-blue-500/5 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />
              
              {/* The Globe Core */}
              <div className="relative w-[85%] h-[85%] rounded-full overflow-hidden shadow-[0_0_40px_rgba(43,82,255,0.15)] border border-white/5 flex items-center justify-center">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute w-[180%] h-[180%] max-w-none object-cover opacity-90 mix-blend-screen pointer-events-none"
                  style={{ 
                    filter: 'contrast(1.2) brightness(1.1) hue-rotate(-10deg)',
                    transition: 'transform 0.2s ease-out'
                  }}
                >
                  <source src="/bg_video.mp4" type="video/mp4" />
                </video>
                
                {/* Inner shadow */}
                <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-30px_70px_rgba(0,0,0,0.9),inset_30px_30px_70px_rgba(255,255,255,0.1)] pointer-events-none mix-blend-multiply" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
              </div>

              {/* Floating tech accents */}
              <div className="absolute top-[15%] right-[10%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-ping pointer-events-none" />
              <div className="absolute bottom-[25%] left-[15%] w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse pointer-events-none" />
              
              {/* Center glow behind - reduced */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none -z-10" />
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 mt-8 mb-6">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? 'w-8 h-2 bg-white'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Bottom Product Preview Strip */}
          <div className="flex items-center gap-3 mt-2">
            {/* Left arrow */}
            <button
              onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Slide thumbnails */}
            <div className="flex-1 grid grid-cols-3 gap-3">
              {heroSlides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${
                    i === currentSlide
                      ? 'border-white/40 shadow-lg'
                      : 'border-white/10 opacity-50 hover:opacity-70'
                  }`}
                >
                  <div className={`h-16 bg-gradient-to-br ${s.bg} p-3 flex items-end`}>
                    <div className="text-left">
                      <span className="text-[10px] text-white/50 font-mono block">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold text-white">{s.product}</span>
                    </div>
                  </div>
                  {/* Active progress bar */}
                  {i === currentSlide && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                      <div
                        className="h-full bg-white animate-[progress_5s_linear_infinite]"
                        style={{ width: '100%', animation: 'progress 5s linear infinite' }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all flex-shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MARQUEE TICKER (between hero and trust)
      ════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 bg-[#02050A]/80 backdrop-blur-xl border-y border-white/10 py-3 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <MarqueeTicker />
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 · TRUST BANNER — Horizontal Straight Loop
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#040A15] relative py-16 border-b border-white/5 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-10">
          <p className="text-cyan-400 text-sm font-mono tracking-widest uppercase font-bold">
            Trusted by Elite Cyber Defenders
          </p>
        </div>
        <div className="w-full overflow-hidden mask-horizontal">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-12 sm:gap-16 items-center py-2">
            {[
              'Indian Cyber Crime Coordination',
              'CBI Cyber Cell',
              'CERT-In',
              'NCIIPC',
              'Defense Cyber Agency',
              'Data Security Council of India',
              'Indian Cyber Crime Coordination',
              'CBI Cyber Cell',
              'CERT-In',
              'NCIIPC',
              'Defense Cyber Agency',
            ].map((name, idx) => (
              <div key={idx} className="flex items-center gap-12 sm:gap-16 shrink-0 opacity-50 hover:opacity-100 hover:text-cyan-400 transition-all cursor-default">
                <span className="font-bold text-xl sm:text-2xl tracking-tight font-sans">
                  {name}
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 · PRODUCT SUITE GRID — Ultra Dark Glassmorphic
      ════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#02050A] py-28 overflow-hidden">
        {/* Ambient background grid and glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[50vw] h-[50vw] bg-purple-600/5 blur-[150px] rounded-full -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-cyan-600/5 blur-[150px] rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 mb-4">
              <span className="text-[10px] font-mono font-bold text-purple-300 tracking-wider">CORE ARSENAL</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">
              Our Forensic Suite
            </h2>
            <p className="text-white/60 text-lg max-w-2xl font-sans leading-relaxed">
              Explore tools built for email security, threat attribution, compliance, and real-time intelligence.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={onStartAnalysis}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 transition-all"
              >
                Explore TraceMail
              </button>
            </div>
          </div>

          {/* 3-col immersive card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <ProductCard
              title="AI Semantic Phishing Engine"
              description="Analyzes email body NLP semantics, social engineering urgency triggers, and executive impersonation signals with sub-50ms latency."
              gradientFrom="from-[#0a0f28]"
              gradientTo="to-[#1a2456]"
              overlayIcon={Cpu}
              ctaLabel="Explore"
              badge="NEURAL NLP"
              onClick={onStartAnalysis}
            />
            <ProductCard
              title="Multi-Hop IP Geolocation"
              description="Reconstructs the full RFC 822 MTA relay path, exposing proxy concealment, TOR exit nodes, and bulletproof ASNs."
              gradientFrom="from-[#0d1a12]"
              gradientTo="to-[#1a3523]"
              overlayIcon={Globe2}
              ctaLabel="Explore"
              badge="GEO TRACE"
              onClick={onStartAnalysis}
            />
            <ProductCard
              title="Cryptographic Auth Forensics"
              description="Validates SPF alignments, DKIM digital signatures, and DMARC enforcement policies with plain-English failure explanations."
              gradientFrom="from-[#1a0a28]"
              gradientTo="to-[#2d1555]"
              overlayIcon={Lock}
              ctaLabel="Explore"
              badge="CRYPTOGRAPHY"
              onClick={onStartAnalysis}
            />
          </div>

          {/* Second row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ProductCard
              title="Campaign Attribution Graph"
              description="Correlates isolated email threats into unified coordinated campaigns using graph network clustering and shared IOC fingerprints."
              gradientFrom="from-[#0a1528]"
              gradientTo="to-[#0d2140]"
              overlayIcon={Share2}
              ctaLabel="Explore"
              badge="IOC CLUSTERING"
              onClick={onStartAnalysis}
            />
            <ProductCard
              title="Forensic Case Management"
              description="Manage threats in a full Kanban board, generate court-ready PDF dossiers, and track investigation status across your SOC team."
              gradientFrom="from-[#1a1208]"
              gradientTo="to-[#2e200e]"
              overlayIcon={FileCheck}
              ctaLabel="Visit"
              badge="SOC WORKFLOW"
              onClick={onOpenDashboard}
            />
            <ProductCard
              title="Real-Time Threat Alerts"
              description="Get instant push alerts for incoming threats, zero-day phishing campaigns, and IOC feed matches across your organization's inboxes."
              gradientFrom="from-[#1a0808]"
              gradientTo="to-[#350f0f]"
              overlayIcon={AlertTriangle}
              ctaLabel="Visit"
              badge="LIVE INTELLIGENCE"
              onClick={onOpenDashboard}
            />
          </div>

          {/* View More */}
          <div className="text-center mt-16 relative z-10">
            <button
              onClick={onOpenDashboard}
              className="px-10 py-3.5 rounded-full border border-cyan-500/40 text-cyan-400 font-bold text-sm bg-cyan-500/5 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
            >
              View More Capabilities
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4 · DARK FEATURE GRID — "Everything We Build"
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0d0d0d] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-2">
              Everything We Build
            </h2>
            <h2 className="text-5xl sm:text-6xl font-serif italic font-light text-white leading-tight">
              Solves a Real Problem
            </h2>
            <p className="mt-6 text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
              Every TraceMail module solves practical email security challenges through purpose-built forensic experiences designed around real cyber defender needs.
            </p>
          </div>

          {/* 4-column feature info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10 rounded-2xl overflow-hidden">
            {/* Card 1 – Live Intelligence */}
            <div className="p-7 border-r border-white/10 last:border-r-0">
              <h3 className="text-lg font-bold text-white mb-3">Live Intelligence</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Every verdict is powered by continuously refreshed threat intelligence instead of outdated or static datasets.
              </p>
              {/* Mini widget */}
              <div className="bg-[#1a1a1a] rounded-xl p-3 space-y-2">
                {[
                  { label: 'SPF ALIGNED', status: 'FAIL', color: '#ff4050' },
                  { label: 'DKIM VERIFIED', status: 'PASS', color: '#53e097' },
                  { label: 'DMARC ENFORCED', status: 'REJECT', color: '#ff4050' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-mono">{item.label}</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: item.color }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 – Smarter Decisions */}
            <div className="p-7 border-r border-white/10">
              <h3 className="text-lg font-bold text-white mb-3">Smarter Decisions</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                From IP attribution to threat scoring, every interaction helps analysts make faster, more informed security decisions.
              </p>
              {/* Mini widget */}
              <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-around">
                <div className="text-center">
                  <span className="text-2xl font-extrabold text-[#53e097]">96</span>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">RISK SCORE</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-extrabold text-[#ff4050]">HIGH</span>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">THREAT LEVEL</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-extrabold text-[#ffb300]">94%</span>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">CONFIDENCE</p>
                </div>
              </div>
            </div>

            {/* Card 3 – Purpose-Built */}
            <div className="p-7 border-r border-white/10">
              <h3 className="text-lg font-bold text-white mb-3">Purpose-Built Experiences</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Each module solves a specific forensic challenge instead of combining unrelated features into one overwhelming experience.
              </p>
              {/* Integration icons */}
              <div className="grid grid-cols-4 gap-2">
                {[Shield, Globe2, Lock, Share2, Mail, Activity, Search, BarChart3].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4 – Built to Evolve */}
            <div className="p-7">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">ADAPTIVE FORENSICS</div>
              <h3 className="text-lg font-bold text-white mb-3">Built to Evolve</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                TraceMail continuously improves with changing threat landscapes, evolving attacker techniques, and emerging email security standards.
              </p>
              {/* Evolving tag cloud */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['AI-Powered', 'Zero-Day Ready', 'DMARC 2.0', 'ARC Ready', 'BEC Detection'].map((tag) => (
                  <span key={tag} className="text-[10px] text-gray-400 border border-white/10 rounded-full px-2.5 py-1 font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5 · STATS COUNTER — Neon Cyberpunk
      ════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#010308] py-32 border-y border-white/5" ref={statsRef}>
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(6,182,212,0.3) 0%, transparent 60%)' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-cyan-400 text-lg font-mono mb-6 uppercase tracking-widest font-bold">
            Live Global Impact
          </p>
          {/* Massive counter number */}
          <div className="overflow-hidden">
            <p
              className="text-[clamp(60px,12vw,160px)] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-blue-900 leading-none tracking-tight filter drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatCount(displayCount)}
            </p>
          </div>
          <p className="text-white/60 text-xl font-sans mt-6 max-w-xl mx-auto">
            Email threats analyzed, clustered, and neutralized by our AI engine.
          </p>

          {/* Supporting stats row */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '99.7%', label: 'Forensic accuracy rate', color: 'text-cyan-400' },
              { value: '<50ms', label: 'Analysis latency', color: 'text-purple-400' },
              { value: '500+', label: 'Organizations protected', color: 'text-blue-400' },
              { value: '24/7', label: 'Live threat monitoring', color: 'text-emerald-400' },
            ].map((stat) => (
              <div key={stat.label} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                <p className={`text-5xl font-extrabold ${stat.color} mb-3 drop-shadow-md`}>{stat.value}</p>
                <p className="text-sm text-white/50 font-sans uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6 · HOW IT WORKS — Dark Glassmorphic Pipeline
      ════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#02050A] py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <Pill color="aqua">Triaging Pipeline</Pill>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-6">
              From Suspicious Inbox to Court-Ready Dossier
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[50%] left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 -z-10" />
            
            {[
              {
                step: '01',
                title: 'Ingest Mail',
                desc: 'Drag-and-drop any .eml / .msg file or paste raw RFC headers directly from Outlook or Gmail.',
                icon: UploadCloud,
              },
              {
                step: '02',
                title: 'Forensic Synthesis',
                desc: 'Our engine extracts relay hops, audits DNS records, traces originating IPs, and queries global threat feeds.',
                icon: Zap,
              },
              {
                step: '03',
                title: 'Contain & Neutralize',
                desc: 'Obtain an instant score /100, export audit-ready PDF dossiers, and push 1-click gateway block rules.',
                icon: ShieldAlert,
              },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={st.step} className="bg-[#050B14]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:-translate-y-2 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-5xl font-extrabold text-white/10 group-hover:text-cyan-500/20 transition-colors">{st.step}</span>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{st.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 7 · FAQ — Dark Cyber Theme
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#010308] py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Left panel */}
            <div className="lg:col-span-2">
              <h2 className="text-5xl font-extrabold text-white leading-tight mb-2">
                Frequently
              </h2>
              <h2 className="text-5xl font-serif italic font-light text-cyan-400 leading-tight mb-6">
                Asked Questions
              </h2>
              <p className="text-white/50 text-base mb-10 leading-relaxed">
                Have questions? We've answered the ones people ask most about TraceMail's SIH implementation.
              </p>

              {/* "Still have questions?" card */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full" />
                
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Still have questions?</h3>
                <p className="text-sm text-white/50 mb-8 relative z-10">Reach out, and our security team will guide you.</p>
                <button
                  onClick={onOpenAuth}
                  className="w-full px-5 py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-cyan-400 transition-all relative z-10"
                >
                  Talk To Our Team
                </button>
              </div>
            </div>

            {/* Right accordion list */}
            <div className="lg:col-span-3 space-y-4">
              {faqs.map((item, i) => (
                <FAQItem
                  key={i}
                  q={item.q}
                  a={item.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 8 · CTA PRE-FOOTER — Full-bleed dark digital image
      ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] overflow-hidden flex items-center">
        {/* Full-bleed looping video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/cta-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            {/* Italic serif line — soft white/pink tint to echo the image glow */}
            <h2 className="text-5xl sm:text-7xl font-serif italic font-light text-white/80 leading-tight mb-3 drop-shadow-lg">
              Your Next Move
            </h2>
            {/* Bold headline — Playfair Display, pure white */}
            <h2
              className="text-5xl sm:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
            >
              Starts Here.
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-10 max-w-md font-medium">
              Choose from preloaded CEO wire fraud samples, DocuSign harvesters, or drop your own .eml file. It takes less than a minute.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onStartAnalysis}
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-white/90 transition-all shadow-xl"
              >
                <UploadCloud className="w-4 h-4" />
                Analyze Email Demo
              </button>
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 px-7 py-4 rounded-full border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/70 font-semibold text-sm transition-all"
              >
                Explore Analyst Dashboard
              </button>
            </div>
          </div>
          {/* Large watermark text */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
            <p className="text-[clamp(60px,12vw,180px)] font-extrabold text-white/[0.10] leading-none tracking-tight whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
              TraceMail
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 9 · FOOTER — Dark mega-nav
      ════════════════════════════════════════════════════════════ */}
      <footer className="relative bg-[#050814] border-t border-white/10 py-16 overflow-hidden">
        {/* Footer Background Ambient Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Bottom left blue glow */}
          <div className="absolute bottom-0 left-[10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full translate-y-1/3" />
          {/* Top right cyan glow */}
          <div className="absolute top-0 right-[15%] w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full -translate-y-1/2" />
          {/* Subtle Tech Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          {/* Scanline overlay */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2b52ff] via-[#3385ff] to-[#7c24ff] p-0.5 shadow-lg">
                  <div className="w-full h-full bg-[#050814] rounded-[10px] flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-[#00e3d8]" />
                  </div>
                </div>
                <span className="font-extrabold text-xl text-white">TraceMail</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs mb-6">
                AI-powered email forensics platform built for SOC teams, security analysts, and enterprise threat intelligence.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onStartAnalysis}
                  className="px-5 py-2.5 rounded-full bg-[#2b52ff] text-white text-xs font-bold hover:bg-[#1d3fe8] transition-all"
                >
                  Start Free Analysis
                </button>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">Products</h4>
              <ul className="space-y-3">
                {['Email Forensics', 'GeoIntel Tracing', 'DMARC Validator', 'Campaign Attribution', 'Threat Alerts', 'Case Management'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={onOpenDashboard}
                      className="text-gray-400 hover:text-white text-sm transition-colors text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {['About', 'Research', 'Case Studies', 'News', 'Blog', 'Careers'].map((item) => (
                  <li key={item}>
                    <button className="text-gray-400 hover:text-white text-sm transition-colors text-left">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'API Reference', 'Privacy Policy', 'Terms of Service', 'Support', 'Security'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={item === 'Documentation' ? () => onOpenDashboard() : undefined}
                      className="text-gray-400 hover:text-white text-sm transition-colors text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer bottom row */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-sans">
              © {new Date().getFullYear()} TraceMail. All rights reserved. Built for Cyber Defenders.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#53e097] animate-pulse" />
              <span className="text-xs text-gray-500 font-mono">THREAT INTEL: LIVE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
