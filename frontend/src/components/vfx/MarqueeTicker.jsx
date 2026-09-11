import React from 'react';
import { ShieldCheck, Zap, Globe, AlertTriangle, Cpu, Terminal, Lock } from 'lucide-react';

export default function MarqueeTicker({ className = '' }) {
  const tickerItems = [
    {
      icon: Zap,
      label: 'Zero-Day Phish Blocked',
      highlight: '320ms latency',
      tag: 'CRITICAL PREVENT',
      color: 'text-redrob-coral border-redrob-coral/30 bg-redrob-coral/10',
    },
    {
      icon: ShieldCheck,
      label: 'DMARC Enforcement Active',
      highlight: 'p=reject verified',
      tag: 'CRYPTOGRAPHY',
      color: 'text-redrob-lime border-redrob-lime/30 bg-redrob-lime/10',
    },
    {
      icon: Globe,
      label: 'Global Egress Origin Traced',
      highlight: 'Bucharest, RO [AS9009]',
      tag: 'GEOLOCATION',
      color: 'text-redrob-aqua border-redrob-aqua/30 bg-redrob-aqua/10',
    },
    {
      icon: AlertTriangle,
      label: 'CEO Wire Spoof Intercepted',
      highlight: 'Typosquatting score 98/100',
      tag: 'FRAUD SHIELD',
      color: 'text-redrob-amber border-redrob-amber/30 bg-redrob-amber/10',
    },
    {
      icon: Cpu,
      label: 'AI Neural Header Inspection',
      highlight: 'RFC 822 multi-hop pass',
      tag: 'DEEP FORENSICS',
      color: 'text-redrob-violet border-redrob-violet/30 bg-redrob-violet/10',
    },
    {
      icon: Lock,
      label: '14,289 Mailboxes Protected',
      highlight: 'Continuous perimeter watch',
      tag: 'SOC AUTOMATION',
      color: 'text-redrob-blue border-redrob-blue/30 bg-redrob-blue/10',
    },
    {
      icon: Terminal,
      label: 'IOC Threat Feed Synced',
      highlight: 'FIN7 / APT28 signatures',
      tag: 'INTELLIGENCE',
      color: 'text-redrob-aqua border-redrob-aqua/30 bg-redrob-aqua/10',
    },
  ];

  return (
    <div className={`w-full overflow-hidden py-3 bg-[#070c20]/60 border-y border-white/5 backdrop-blur-md marquee-mask ${className}`}>
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4 sm:gap-6 items-center">
        {/* Double the list to ensure infinite seamless loop */}
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0b1026] border border-white/10 hover:border-redrob-blue/50 shadow-sm transition-all shrink-0 cursor-default group"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${item.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-mono font-bold tracking-wide uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                {item.tag}:
              </span>
              <span className="text-xs font-semibold text-white">
                {item.label}
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                {item.highlight}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-redrob-blue animate-pulse ml-1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
