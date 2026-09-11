import React from 'react';

export default function AmbientAura() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-redrob-grid opacity-35" />

      {/* Top Left Electric Blue Ambient Orb */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-redrob-blue/20 via-redrob-blue/5 to-transparent blur-[120px] animate-float-slow" />

      {/* Top Right Violet Intelligence Orb */}
      <div className="absolute top-20 -right-40 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-redrob-violet/20 via-redrob-purple/5 to-transparent blur-[130px] animate-float-delayed" />

      {/* Bottom Center Aqua Accent Orb */}
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-t from-redrob-aqua/15 via-redrob-blue/5 to-transparent blur-[140px] animate-pulse-glow" />

      {/* Subtle top vignette */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#050814] to-transparent opacity-80" />
    </div>
  );
}
