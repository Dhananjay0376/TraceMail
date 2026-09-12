import React, { useState } from 'react';
import {
  ShieldAlert,
  UploadCloud,
  FileSearch,
  Briefcase,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Globe,
  ExternalLink,
  Sparkles,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import StatCard from '../common/StatCard';
import RiskBadge from '../common/RiskBadge';
import MiniWorldMap from '../map/MiniWorldMap';
import MagicBento from '../vfx/MagicBento';
import { MOCK_STATS, MOCK_ALERTS } from '../../mock/mockData';

export default function DashboardScreen({
  currentRole = 'analyst',
  currentUser,
  isFirstTime = false,
  cases = [],
  alerts = MOCK_ALERTS,
  onOpenSubmit,
  onSelectSample,
  onNavigate,
  onLoadDemoData,
}) {
  const isEmployee = currentRole === 'employee';
  const [showEmptyState, setShowEmptyState] = useState(isFirstTime && cases.length === 0);

  // Employee View
  if (isEmployee) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
        {/* Employee Hero Card */}
        <div className="p-8 rounded-[28px] bg-gradient-to-r from-redrob-blue/15 via-[#0b1026] to-[#070c20] border border-white/10 shadow-redrob-card relative overflow-hidden shimmer-card">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-redrob-blue bg-redrob-blue/10 px-3 py-1 rounded-full border border-redrob-blue/30 inline-block">
              Employee Security Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Did you receive a suspicious email?
            </h1>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              Don't click any links or download attachments. Upload the message here and our forensic engine will verify if it's safe or dangerous in seconds.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenSubmit}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-redrob-blue to-[#1d3fe8] hover:shadow-redrob-glow text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 spring-hover"
              >
                <UploadCloud className="w-4 h-4" />
                <span>+ Scan Suspicious Email</span>
              </button>

              <button
                onClick={() => onNavigate('docs')}
                className="px-5 py-3 rounded-full bg-[#0b1026] hover:bg-[#0f1738] border border-white/10 text-slate-200 text-xs font-mono transition-all spring-hover"
              >
                Learn What to Watch Out For
              </button>
            </div>
          </div>
        </div>

        {/* Employee Reported Emails Status */}
        <div className="p-6 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card font-mono">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white font-sans">Your Recently Reported Emails</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Status of suspicious emails you submitted to the security operations center.
              </p>
            </div>
            <span className="text-xs text-redrob-aqua font-bold bg-white/5 px-3 py-1 rounded-full border border-white/5">
              4 Verified Scans
            </span>
          </div>

          <div className="mt-4 divide-y divide-white/5">
            {[
              {
                title: 'URGENT: Wire Transfer Authorization',
                sender: 'ceo@acme-corp.org (Spoofed)',
                date: '10 mins ago',
                status: 'DANGEROUS',
                badge: 'CEO Fraud Impersonation — Blocked',
                sampleId: 'sample-wire-fraud',
              },
              {
                title: 'Security alert for your linked Google Account',
                sender: 'no-reply@accounts.google.com',
                date: '2 hours ago',
                status: 'SAFE',
                badge: 'Authentic Google Mail — Safe',
                sampleId: 'sample-google-legit',
              },
              {
                title: 'Please DocuSign: Q3 Consulting Master Agreement.pdf',
                sender: 'docusign@docus1gn-securesign.com',
                date: 'Yesterday',
                status: 'DANGEROUS',
                badge: 'Fake DocuSign Login Form — Blocked',
                sampleId: 'sample-docusign-phish',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-xl transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-white font-sans">{item.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>From: {item.sender}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'DANGEROUS'
                        ? 'bg-redrob-coral/15 border-redrob-coral/40 text-redrob-coral'
                        : 'bg-redrob-lime/15 border-redrob-lime/40 text-redrob-lime'
                    }`}
                  >
                    {item.badge}
                  </span>

                  <button
                    onClick={() => onSelectSample(item.sampleId)}
                    className="px-3 py-1 rounded-full bg-[#050814] hover:bg-white/10 text-redrob-blue text-xs font-bold transition-all cursor-pointer border border-white/5 spring-hover"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Tip Card */}
        <div className="p-6 rounded-[24px] bg-[#0b1026] border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-4 shadow-redrob-card">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block mb-1 font-mono text-amber-400">
              Cyber Tip of the Day: Executive Wire Verification
            </span>
            <span className="text-slate-300 font-sans">
              Real executives never request surprise wire transfers or bank changes exclusively over email. If you receive an urgent request demanding secrecy, always verify with them using their verified company phone number.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Security Analyst Full Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Banner with prominent + Analyze button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-redrob-blue" />
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Threat Operations Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {currentUser?.org || 'Acme Bank Security Operations'} • Real-time heuristic mail telemetry, multi-hop forensic attribution, and case response.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {showEmptyState ? (
            <button
              onClick={() => setShowEmptyState(false)}
              className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 bg-[#0b1026] text-slate-300 text-xs font-mono transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-redrob-aqua" />
              <span>Load Full Telemetry</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('cases')}
              className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 bg-[#0b1026] text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 spring-hover"
            >
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Active Cases ({cases.length || MOCK_STATS.activeCases})</span>
            </button>
          )}

          <button
            onClick={onOpenSubmit}
            className="px-6 py-2.5 rounded-full bg-redrob-blue hover:bg-redrob-blueHover shadow-redrob-glow text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 spring-hover"
          >
            <UploadCloud className="w-4 h-4" />
            <span>+ Analyze New Email</span>
          </button>
        </div>
      </div>

      {/* NEW USER FRIENDLY EMPTY STATE */}
      {showEmptyState ? (
        <div className="p-10 sm:p-16 rounded-[32px] bg-[#0b1026] border border-white/10 shadow-2xl text-center space-y-6 shimmer-card max-w-3xl mx-auto my-6">
          <div className="w-20 h-20 rounded-3xl bg-redrob-blue/15 border border-redrob-blue/30 text-redrob-blue mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Inbox className="w-10 h-10 text-redrob-aqua" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              No emails analyzed yet
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
              Your security sentinel perimeter is active and ready. Click below to scan your first suspicious email header or upload a .eml file.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenSubmit}
              className="px-8 py-3.5 rounded-full bg-redrob-blue hover:bg-redrob-blueHover shadow-redrob-glow text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 spring-hover"
            >
              <UploadCloud className="w-4 h-4" />
              <span>+ Scan Your First Email</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowEmptyState(false)}
              className="px-6 py-3.5 rounded-full bg-[#050814] hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-redrob-aqua" />
              <span>Explore Demo Telemetry</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 4 Core Summary Stat Cards */}
          <MagicBento
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono"
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt
            enableMagnetism
            clickEffect
            particleCount={7}
            spotlightRadius={260}
            glowColor="0, 227, 216"
          >
            <StatCard
              title="Total Scanned"
              value={MOCK_STATS.totalScanned.toLocaleString()}
              growth={MOCK_STATS.scannedGrowth}
              subtitle={`Clean rate: ${MOCK_STATS.cleanRate}`}
              icon={FileSearch}
              color="blue"
            />
            <StatCard
              title="High-Risk & Fraud"
              value={MOCK_STATS.highRiskCount}
              growth={MOCK_STATS.highRiskGrowth}
              subtitle="Awaiting automated containment"
              icon={Flame}
              color="coral"
            />
            <StatCard
              title="Active Cases"
              value={cases.length || MOCK_STATS.activeCases}
              growth={MOCK_STATS.casesGrowth}
              subtitle="P0 Priority Incidents"
              icon={Briefcase}
              color="violet"
            />
            <StatCard
              title="Avg. Response Time"
              value={MOCK_STATS.avgResponseTime}
              growth={MOCK_STATS.responseGrowth}
              subtitle="Target: < 5.0 min"
              icon={Clock}
              color="lime"
            />
          </MagicBento>

          {/* Main Grid: Recent Alerts Table & Mini World Map Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Recent Inbound Alerts Table */}
            <div className="lg:col-span-2 p-6 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card font-mono flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                    Recent Alerts
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Flagged inbound emails prioritized by fraud risk score.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('alerts')}
                  className="text-xs text-redrob-blue hover:text-redrob-aqua font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View All Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-4 divide-y divide-white/5 flex-1">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] p-2 rounded-xl transition-all"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate max-w-md font-sans">
                          {alert.title}
                        </span>
                        <span className="text-[10px] text-slate-500 shrink-0">{alert.time}</span>
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        <span className="text-slate-500">From: </span>
                        <span className="text-redrob-aqua font-mono">{alert.sender}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <RiskBadge score={alert.score} size="sm" />
                      <button
                        onClick={() => onSelectSample(alert.sampleId || 'sample-wire-fraud')}
                        className="px-3 py-1 rounded-full bg-[#050814] hover:bg-white/10 text-redrob-blue text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-white/5 spring-hover"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Showing top active alerts</span>
                <span className="text-redrob-lime font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-redrob-lime animate-pulse" />
                  Perimeter Gateway: Online
                </span>
              </div>
            </div>

            {/* Right 1 Col: Small World Map Widget */}
            <div className="lg:col-span-1 h-full">
              <MiniWorldMap onSelectOrigin={(orig) => onNavigate('result')} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
