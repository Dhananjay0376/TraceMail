import React from 'react';

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex items-center p-1.5 rounded-full bg-[#00152b] border border-[#49769F]/30 overflow-x-auto no-scrollbar gap-1 shadow-md w-max max-w-full paper-pill">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-extrabold tracking-wider uppercase rounded-full transition-all cursor-pointer whitespace-nowrap paper-pill spring-hover ${
              isActive
                ? 'bg-[#7BBDE8] text-[#001D39] shadow-md border border-white'
                : 'text-[#6EA2B3] hover:text-white hover:bg-[#0A4174]'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-[#001D39] text-[#7BBDE8]' : 'bg-[#001D39]/50 text-[#BDD8E9]'
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

