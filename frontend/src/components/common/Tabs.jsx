import React from 'react';

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex items-center p-1.5 rounded-full bg-[#0b1026] border border-white/10 overflow-x-auto no-scrollbar gap-1 shadow-sm w-max max-w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-full transition-all cursor-pointer whitespace-nowrap spring-hover ${
              isActive
                ? 'bg-gradient-to-r from-redrob-blue to-[#1d3fe8] text-white shadow-redrob-glow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
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
