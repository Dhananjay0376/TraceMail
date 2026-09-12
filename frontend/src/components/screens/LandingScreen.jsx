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
    bg: 'from-[#061B2E] via-[#0A3E66] to-[#061B2E]',
    accent: '#2b52ff',
    subGradient: 'from-blue-400 via-sky-300 to-cyan-300',
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
    subGradient: 'from-cyan-400 via-teal-300 to-emerald-300',
    product: 'Geo Intelligence',
  },
  {
    label: 'TraceMail Attribution',
    headline: 'Connect the Dots.',
    sub: 'Unmask Coordinated Campaigns.',
    description:
      'Correlate isolated email threats into unified coordinated campaigns using graph network clustering and shared IOC fingerprints for total attribution.',
    bg: 'from-[#061B2E] via-[#0A3E66] to-[#061B2E]',
    accent: '#7c24ff',
    subGradient: 'from-purple-400 via-fuchsia-300 to-indigo-300',
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
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-base font-semibold text-gray-900 pr-4">{q}</span>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
          {isOpen ? (
            <Minus className="w-3.5 h-3.5 text-white" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-white" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 bg-white">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Formatted Description Renderer ──────────────────────────────────────────
function FormattedDescription({ text }) {
  const formatted = text
    .replace(/(RFC 822)/g, '<code class="font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-semibold">RFC 822</code>')
    .replace(/(MTA relay path|relay paths)/g, '<span class="text-white font-medium">$1</span>')
    .replace(/(TOR exit nodes)/g, '<code class="font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-semibold">TOR exit nodes</code>')
    .replace(/(bulletproof ASNs)/g, '<code class="font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300 font-semibold">bulletproof ASNs</code>')
    .replace(/(DMARC cryptographic signatures|DMARC)/g, '<code class="font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 font-semibold">$1</code>')
    .replace(/(IP geolocation intelligence)/g, '<span class="text-white font-medium">$1</span>')
    .replace(/(graph network clustering)/g, '<span class="text-white font-medium">$1</span>')
    .replace(/(IOC fingerprints)/g, '<code class="font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-semibold">IOC fingerprints</code>');

  return (
    <p
      className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-sans"
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
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
    <div className="min-h-screen bg-[#061B2E] text-gray-900 font-sans">

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

          {/* Main headline — authentic, high-impact cybersecurity typography */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 w-fit shadow-inner">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: slide.accent }} />
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-slate-200">
                {slide.label}
              </span>
            </div>

            <h1 className="mb-2">
              <span className="block font-league uppercase tracking-wider text-5xl sm:text-7xl lg:text-8xl text-white font-normal leading-none drop-shadow-md">
                {slide.headline}
              </span>
              <span className={`block font-besley font-medium text-2xl sm:text-4xl lg:text-5xl mt-3 leading-tight bg-gradient-to-r ${slide.subGradient || 'from-cyan-400 to-blue-400'} bg-clip-text text-transparent`}>
                {slide.sub}
              </span>
            </h1>

            <FormattedDescription text={slide.description} />

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
      <div className="relative z-20 bg-white border-y border-gray-100 py-2">
        <MarqueeTicker />
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 · TRUST BANNER — Horizontal Straight Loop
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-8">
          <p className="text-gray-500 text-base font-sans">
            Trusted by Organizations. Built for Cyber Defenders.
          </p>
        </div>
        <div className="w-full overflow-hidden marquee-mask">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-12 sm:gap-16 items-center py-2">
            {[
              'Accenture',
              'Deloitte',
              'IBM Security',
              'Cisco',
              'PwC',
              'KPMG',
              'CrowdStrike',
              'Accenture',
              'Deloitte',
              'IBM Security',
              'Cisco',
              'PwC',
              'KPMG',
              'CrowdStrike',
              'Accenture',
              'Deloitte',
              'IBM Security',
              'Cisco',
              'PwC',
              'KPMG',
              'CrowdStrike',
            ].map((name, idx) => (
              <div key={idx} className="flex items-center gap-12 sm:gap-16 shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-default">
                <span className="text-gray-900 font-bold text-xl sm:text-2xl tracking-tight font-sans">
                  {name}
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-500/40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 · PRODUCT SUITE GRID — White with dark cards
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-12">
            <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-3">
              Our Forensic Suite
            </h2>
            <p className="text-gray-500 text-base max-w-xl">
              Explore tools built for email security, threat attribution, compliance, and real-time intelligence.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={onStartAnalysis}
                className="px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all"
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
          <div className="text-center mt-12">
            <button
              onClick={onOpenDashboard}
              className="px-10 py-3.5 rounded-full border-2 border-gray-900 text-gray-900 font-bold text-sm hover:bg-gray-900 hover:text-white transition-all"
            >
              View More
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
          SECTION 5 · STATS COUNTER — White, massive typography
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-gray-600 text-lg font-sans mb-4 max-w-lg leading-snug">
            Security Teams Detecting Threats Faster, Smarter, and with Total Forensic Confidence Through TraceMail.
          </p>
          {/* Massive counter number */}
          <div className="overflow-hidden">
            <p
              className="text-[clamp(80px,15vw,180px)] font-extrabold text-gray-900 leading-none tracking-tight"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatCount(displayCount)}
            </p>
          </div>
          <p className="text-gray-500 text-xl font-sans mt-2">
            Email threats analyzed and neutralized.
          </p>

          {/* Supporting stats row */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-gray-100 pt-10">
            {[
              { value: '99.7%', label: 'Forensic accuracy rate' },
              { value: '<50ms', label: 'Analysis latency' },
              { value: '500+', label: 'Organizations protected' },
              { value: '24/7', label: 'Live threat monitoring' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-extrabold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 font-sans">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6 · HOW IT WORKS — 3-Step triaging pipeline
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Pill color="violet">Triaging Pipeline</Pill>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-4">
              From Suspicious Inbox to Court-Ready Dossier
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Ingest Suspicious Mail',
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
                desc: 'Obtain an instant score /100, export audit-ready PDF dossiers, and push 1-click gateway firewall block rules.',
                icon: ShieldAlert,
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.step} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-5xl font-extrabold text-gray-100">{st.step}</span>
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{st.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 7 · FAQ — Split layout (redrob style)
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Left panel */}
            <div className="lg:col-span-2">
              <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-2">
                Frequently
              </h2>
              <h2 className="text-5xl font-serif italic font-light text-gray-900 leading-tight mb-6">
                Asked Questions
              </h2>
              <p className="text-gray-500 text-base mb-10">
                Have questions? We've answered the ones people ask most about TraceMail.
              </p>

              {/* "Still have questions?" card */}
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-7">
                {/* Avatar cluster */}
                <div className="flex items-center gap-1 mb-5">
                  {['#2b52ff', '#7c24ff', '#00e3d8', '#ff4050'].map((color, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: color, marginLeft: i > 0 ? '-8px' : 0 }}
                    >
                      {['AC', 'JD', 'SK', 'You'][i]}
                    </div>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                <p className="text-sm text-gray-500 mb-6">Reach out, and our security team will guide you.</p>
                <button
                  onClick={onOpenAuth}
                  className="w-full px-5 py-3 rounded-full bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-all"
                >
                  Talk To Our Team
                </button>
              </div>
            </div>

            {/* Right accordion list */}
            <div className="lg:col-span-3 space-y-3">
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
      <footer className="bg-[#050814] border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
