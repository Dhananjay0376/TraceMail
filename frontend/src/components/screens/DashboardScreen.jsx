import React, { useState } from 'react';
import {
  ShieldAlert,
  UploadCloud,
  FileSearch,
  Briefcase,
  AlertTriangle,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
  Inbox,
  ExternalLink,
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
  onToggleSidebar,
}) {
  const isEmployee = currentRole === 'employee';
  const isDemo = currentUser?.isDemo ?? false;
  const [showEmptyState, setShowEmptyState] = useState(isFirstTime && cases.length === 0);

  // Dynamic telemetry calculations based on session (Demo vs Real User)
  const statTotalScanned = isDemo ? MOCK_STATS.totalScanned.toLocaleString() : (cases.length > 0 ? (cases.length * 2).toString() : '0');
  const statScannedGrowth = isDemo ? MOCK_STATS.scannedGrowth : (cases.length > 0 ? '+1 new' : '0 new this week');
  const statCleanRate = isDemo ? MOCK_STATS.cleanRate : '100%';
  const statHighRisk = isDemo ? MOCK_STATS.highRiskCount : cases.filter(c => c.severity === 'critical' || c.severity === 'high').length;
  const statHighRiskGrowth = isDemo ? MOCK_STATS.highRiskGrowth : '0 new';
  const statActiveCases = isDemo ? (cases.length || MOCK_STATS.activeCases) : cases.length;
  const statCasesGrowth = isDemo ? MOCK_STATS.casesGrowth : (cases.length > 0 ? `${cases.length} in queue` : '0 active');
  const statAvgResponseTime = isDemo ? MOCK_STATS.avgResponseTime : (cases.length > 0 ? '1.2 min' : '0.0 min');
  const displayAlerts = isDemo ? alerts : alerts;

  // Decorative 3D Paper Cut Organic Wave Header Background
  const PaperCutHeader = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[36px] z-0">
      {/* Wave Layer 1: Dark Midnight Navy */}
      <svg
        className="absolute top-0 left-0 w-full h-full text-[#001D39] opacity-90"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path d="M0,0 L1200,0 L1200,240 C1050,310 900,180 750,260 C600,340 400,200 200,280 C100,320 0,260 0,260 Z" fill="currentColor" />
      </svg>

      {/* Wave Layer 2: Deep Ocean Blue */}
      <svg
        className="absolute top-0 left-0 w-full h-full text-[#0A4174]/70"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path d="M0,0 L1200,0 L1200,180 C1000,260 850,140 680,210 C500,280 320,160 150,220 C50,255 0,210 0,210 Z" fill="currentColor" />
      </svg>

      {/* Wave Layer 3: Steel Cyan Accent Cutout */}
      <svg
        className="absolute top-0 right-0 w-2/3 h-full text-[#49769F]/30"
        viewBox="0 0 800 400"
        preserveAspectRatio="none"
      >
        <path d="M200,0 C350,120 500,40 650,150 C750,220 800,180 800,180 L800,0 Z" fill="currentColor" />
      </svg>
    </div>
  );

  // Employee View
  if (isEmployee) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans bg-[#001D39]/40 rounded-[40px] p-4 sm:p-6 border border-[#49769F]/20">
        {/* Employee Hero Card with 3D Paper Cut Waves */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-r from-[#0A4174] via-[#49769F] to-[#4E8EA2] text-white relative overflow-hidden paper-cut-shadow">
          <PaperCutHeader />

          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#001D39] bg-[#BDD8E9] px-4 py-1.5 rounded-full shadow-md inline-block">
              Employee Security Sentinel
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight drop-shadow-md">
              Did you receive a suspicious email?
            </h1>
            <p className="text-[#BDD8E9] text-sm sm:text-base mt-3 leading-relaxed">
              Don't click any links or download attachments. Upload the message here and our forensic engine will verify if it's safe or dangerous in seconds.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">

              <button
                onClick={onOpenSubmit}
                className="px-7 py-3.5 rounded-full bg-[#BDD8E9] hover:bg-white text-[#001D39] font-mono font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 paper-pill shadow-xl spring-hover"
              >
                <UploadCloud className="w-4 h-4 text-[#0A4174]" />
                <span>+ Scan Suspicious Email</span>
              </button>

              <button
                onClick={() => onNavigate('docs')}
                className="px-6 py-3.5 rounded-full bg-[#001D39]/80 hover:bg-[#001D39] border border-[#7BBDE8]/30 text-[#BDD8E9] text-xs font-mono transition-all spring-hover paper-pill"
              >
                Learn What to Watch Out For
              </button>
            </div>
          </div>
        </div>

        {/* Employee Reported Emails Status */}
        <div className="p-7 rounded-[32px] bg-gradient-to-b from-[#0A4174]/90 to-[#001D39] border border-[#49769F]/30 paper-cut-shadow font-mono">
          <div className="flex items-center justify-between pb-5 border-b border-[#49769F]/30">
            <div>
              <h3 className="text-lg font-extrabold text-white font-sans tracking-tight">Your Recently Reported Emails</h3>
              <p className="text-xs text-[#6EA2B3] font-sans mt-0.5">
                Status of suspicious emails you submitted to the security operations center.
              </p>
            </div>
            <span className="text-xs text-[#001D39] font-extrabold bg-[#7BBDE8] px-3.5 py-1.5 rounded-full shadow-md">
              4 Verified Scans
            </span>
          </div>

          <div className="mt-5 space-y-3">
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
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#001D39]/80 border border-[#49769F]/20 hover:border-[#7BBDE8]/40 transition-all paper-cut-shadow"
              >
                <div>
                  <h4 className="text-sm font-bold text-white font-sans">{item.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-[#6EA2B3] mt-1">
                    <span>From: {item.sender}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'DANGEROUS'
                        ? 'bg-red-500/20 border-red-400/40 text-red-300'
                        : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                    }`}
                  >
                    {item.badge}
                  </span>

                  <button
                    onClick={() => onSelectSample(item.sampleId)}
                    className="px-4 py-1.5 rounded-full bg-[#7BBDE8] hover:bg-white text-[#001D39] text-xs font-extrabold transition-all cursor-pointer paper-pill spring-hover shadow-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Tip Card */}
        <div className="p-6 rounded-[28px] bg-gradient-to-r from-[#001D39] via-[#0A4174] to-[#001D39] border border-[#7BBDE8]/30 text-amber-200 text-xs leading-relaxed flex items-start gap-4 paper-cut-shadow">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold uppercase tracking-wider block mb-1 font-mono text-amber-300 text-sm">
              Cyber Tip of the Day: Executive Wire Verification
            </span>
            <span className="text-[#BDD8E9] font-sans text-xs">
              Real executives never request surprise wire transfers or bank changes exclusively over email. If you receive an urgent request demanding secrecy, always verify with them using their verified company phone number.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Security Analyst Full Dashboard with Image 1 Paper-Cut 3D theme & Image 2 Blue Palette Swatches
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Banner with Sculpted Paper Cut Curves */}
      <div className="relative p-6 sm:p-8 rounded-[36px] bg-gradient-to-r from-[#001D39] via-[#0A4174] to-[#49769F] border border-[#7BBDE8]/30 paper-cut-shadow overflow-hidden">
        <PaperCutHeader />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 font-mono">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#7BBDE8]/20 border border-[#7BBDE8]/40 text-[#BDD8E9] shadow-inner">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight drop-shadow">
                Threat Operations Command Center
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#BDD8E9] font-sans mt-2 max-w-2xl leading-relaxed">
              {currentUser?.org || 'Acme Bank Security Operations'} • Real-time heuristic mail telemetry, multi-hop forensic attribution, and case response.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">


            {showEmptyState ? (
              <button
                onClick={() => setShowEmptyState(false)}
                className="px-5 py-2.5 rounded-full border border-[#7BBDE8]/40 bg-[#0A4174]/80 text-[#BDD8E9] text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 paper-pill hover:bg-[#49769F]"
              >
                <Sparkles className="w-4 h-4 text-[#7BBDE8]" />
                <span>Load Telemetry</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('cases')}
                className="px-5 py-2.5 rounded-full border border-[#6EA2B3]/40 bg-[#001D39]/80 text-[#BDD8E9] text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 paper-pill hover:bg-[#0A4174] spring-hover"
              >
                <Briefcase className="w-4 h-4 text-[#7BBDE8]" />
                <span>Active Cases ({cases.length || MOCK_STATS.activeCases})</span>
              </button>
            )}

            <button
              onClick={onOpenSubmit}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7BBDE8] to-[#BDD8E9] hover:from-white hover:to-[#BDD8E9] text-[#001D39] font-mono font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 paper-pill shadow-lg spring-hover"
            >
              <UploadCloud className="w-4 h-4 text-[#001D39]" />
              <span>+ Analyze New Email</span>
            </button>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {showEmptyState ? (
        <div className="p-10 sm:p-16 rounded-[36px] bg-gradient-to-b from-[#0A4174] to-[#001D39] border border-[#7BBDE8]/30 paper-cut-shadow text-center space-y-6 max-w-3xl mx-auto my-6 relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-[#4E8EA2]/30 border border-[#7BBDE8]/40 text-[#BDD8E9] mx-auto flex items-center justify-center shadow-xl">
            <Inbox className="w-10 h-10 text-[#7BBDE8]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              No emails analyzed yet
            </h2>
            <p className="text-[#6EA2B3] text-sm max-w-lg mx-auto leading-relaxed font-sans">
              Your security sentinel perimeter is active and ready. Click below to scan your first suspicious email header or upload a .eml file.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenSubmit}
              className="px-8 py-3.5 rounded-full bg-[#7BBDE8] hover:bg-white text-[#001D39] font-mono font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 paper-pill shadow-xl spring-hover"
            >
              <UploadCloud className="w-4 h-4 text-[#001D39]" />
              <span>+ Scan Your First Email</span>
              <ArrowRight className="w-4 h-4 text-[#001D39]" />
            </button>

            <button
              onClick={() => setShowEmptyState(false)}
              className="px-6 py-3.5 rounded-full bg-[#001D39] hover:bg-[#0A4174] border border-[#49769F]/40 text-[#BDD8E9] font-mono text-xs transition-all cursor-pointer flex items-center gap-2 paper-pill"
            >
              <Sparkles className="w-4 h-4 text-[#7BBDE8]" />
              <span>Explore Demo Telemetry</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 4 Core Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
            <StatCard
              title="Total Scanned"
              value={statTotalScanned}
              growth={statScannedGrowth}
              subtitle={`Clean rate: ${statCleanRate}`}
              icon={FileSearch}
              color="blue"
            />
            <StatCard
              title="High-Risk & Fraud"
              value={statHighRisk}
              growth={statHighRiskGrowth}
              subtitle="Awaiting automated containment"
              icon={Flame}
              color="coral"
            />
            <StatCard
              title="Active Cases"
              value={statActiveCases}
              growth={statCasesGrowth}
              subtitle="P0 Priority Incidents"
              icon={Briefcase}
              color="violet"
            />
            <StatCard
              title="Avg. Response Time"
              value={statAvgResponseTime}
              growth={MOCK_STATS.responseGrowth}
              subtitle="Target: < 5.0 min"
              icon={Clock}
              color="lime"
            />
          </div>

          {/* Main Layout: Full Width Recent Alerts Table */}
          <div className="w-full p-6 sm:p-7 rounded-[32px] bg-gradient-to-b from-[#0A4174] to-[#001D39] border border-[#49769F]/30 paper-cut-shadow font-mono flex flex-col">
            <div className="flex items-center justify-between pb-5 border-b border-[#49769F]/30">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7BBDE8] animate-ping" />
                  Recent Alerts
                </h3>
                <p className="text-xs text-[#6EA2B3] font-sans mt-1">
                  Flagged inbound emails prioritized by fraud risk score.
                </p>
              </div>
              <button
                onClick={() => onNavigate('alerts')}
                className="px-4 py-1.5 rounded-full bg-[#49769F]/30 hover:bg-[#7BBDE8] hover:text-[#001D39] text-[#7BBDE8] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all paper-pill"
              >
                <span>View All Alerts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 flex-1">
              {displayAlerts.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#6EA2B3] font-sans rounded-2xl bg-[#00152b] border border-[#49769F]/20">
                  <p className="font-bold text-white text-sm mb-1">No active alerts</p>
                  <p>Your account has zero flagged threats. Use "+ Analyze New Email" to scan suspicious messages.</p>
                </div>
              ) : (
                displayAlerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-[#00152b] border border-[#49769F]/20 hover:border-[#7BBDE8]/40 transition-all paper-inset-well"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white truncate max-w-md font-sans">
                          {alert.title}
                        </span>
                        <span className="text-[10px] text-[#6EA2B3] shrink-0 font-mono">{alert.time}</span>
                      </div>
                      <div className="text-xs text-[#4E8EA2] truncate">
                        <span className="text-[#6EA2B3]/70">From: </span>
                        <span className="text-[#7BBDE8] font-mono">{alert.sender}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <RiskBadge score={alert.score} size="sm" />
                      <button
                        onClick={() => onSelectSample(alert.sampleId || 'sample-wire-fraud')}
                        className="px-3.5 py-1.5 rounded-full bg-[#7BBDE8] hover:bg-white text-[#001D39] text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 paper-pill spring-hover shadow-md"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-[#49769F]/30 flex items-center justify-between text-xs text-[#6EA2B3]">
              <span>Showing top active alerts</span>
              <span className="text-[#7BBDE8] font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7BBDE8] animate-pulse" />
                Perimeter Gateway: Online
              </span>
            </div>
          </div>

          {/* Shifted Section: World Map Widget Below Recent Alerts */}
          <div className="w-full mt-8 rounded-[32px] overflow-hidden border border-[#49769F]/30 paper-cut-shadow">
            <MiniWorldMap
              origins={displayAlerts.length > 0 ? MOCK_ATTACK_ORIGINS : []}
              onSelectOrigin={(orig) => onNavigate('result')}
            />
          </div>
        </>
      )}
    </div>
  );
}
