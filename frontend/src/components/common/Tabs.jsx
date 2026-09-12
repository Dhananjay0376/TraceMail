import React from 'react';

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div role="tablist" aria-label="Screen sections" className="flex items-center p-1.5 rounded-2xl bg-[#070c1b] border border-white/15 overflow-x-auto no-scrollbar gap-1.5 shadow-lg shadow-black/20 w-max max-w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded-xl border transition-all cursor-pointer whitespace-nowrap spring-hover ${
              isActive
                ? 'bg-gradient-to-r from-redrob-blue to-[#1d3fe8] text-white border-redrob-blue/60 shadow-redrob-glow'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
