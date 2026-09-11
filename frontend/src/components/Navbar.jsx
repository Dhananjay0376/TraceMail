import React, { useState, useEffect } from 'react'
import { Shield, Radio, Sparkles, FolderArchive, Share2, UploadCloud, Layers } from 'lucide-react'

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  samples, 
  onSelectSample, 
  selectedSampleId,
  loading,
  onOpenUpload
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#0c1222]/35 border-slate-800 shadow-xl shadow-black/60'
          : 'bg-[#0c1222]/90 border-slate-800'
      }`}
      style={{
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(24px)',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(24px)',
      }}
    >
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold tracking-tight text-white font-mono">Trace<span className="text-cyan-400">Mail</span></span>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
                SIH26106
              </span>
            </div>
            <p className="text-[10px] text-slate-400">AI-Powered Email Forensics, Origin GeoTrace & Attribution Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Forensic Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'campaigns'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Campaign Correlation</span>
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'cases'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderArchive className="h-3.5 w-3.5" />
            <span>Case History</span>
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono">Engine Active</span>
          </div>

          <button
            onClick={onOpenUpload}
            className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload .EML</span>
          </button>
        </div>
      </div>

      {/* Quick Demo Case Selector Bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold pr-2 border-r border-slate-800">
            <Sparkles className="h-3.5 w-3.5" />
            <span>1-Click Test Scenarios:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {samples.map((s) => {
              const isSelected = selectedSampleId === s.id
              const isPhish = s.category.includes('Phishing') || s.category.includes('Harvesting')
              const isBec = s.category.includes('BEC')
              const isLegit = s.category.includes('Legitimate')
              
              let tagColor = 'bg-slate-800 text-slate-300 border-slate-700'
              if (isPhish) tagColor = isSelected ? 'bg-red-500 text-white border-red-400 font-semibold' : 'bg-red-950/40 text-red-300 border-red-800/50 hover:bg-red-900/40'
              else if (isBec) tagColor = isSelected ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold' : 'bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/40'
              else if (isLegit) tagColor = isSelected ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-semibold' : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/40'

              return (
                <button
                  key={s.id}
                  disabled={loading}
                  onClick={() => onSelectSample(s.id)}
                  className={`px-2.5 py-1 rounded-md text-xs border transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 ${tagColor}`}
                  title={s.description}
                >
                  <span className="font-medium">{s.title}</span>
                  <span className="text-[10px] opacity-75 font-mono">({s.origin_location.split(',')[0]})</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
