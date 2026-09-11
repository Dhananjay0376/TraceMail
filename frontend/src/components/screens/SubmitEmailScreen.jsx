import React, { useState } from 'react';
import {
  UploadCloud,
  FileCode,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FileText,
  Check,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import Modal from '../common/Modal';
import { MOCK_SAMPLES } from '../../mock/mockData';

export default function SubmitEmailScreen({ onAnalyze, onSelectSample }) {
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'raw'
  const [rawText, setRawText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger analysis with file or raw headers
    onAnalyze({ file: selectedFile, rawText, sampleId: 'sample-wire-fraud' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0b1026] border border-white/10 text-redrob-blue text-xs font-mono font-bold mb-3 uppercase tracking-wider">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Automated Forensic Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Submit Email for Threat Ingestion
        </h1>
        <p className="text-slate-400 text-xs font-sans mt-2">
          Upload any suspicious RFC 822 email (.eml or .msg) or paste raw headers to uncover sender spoofing, lookalike domains, and multi-hop relay origins.
        </p>
      </div>

      {/* 1-Click Preloaded Forensic Samples Bar */}
      <div className="p-6 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card mb-8">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-redrob-aqua" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Demo Fast-Track: Select a Real Forensic Threat Scenario
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Instant Sandbox Replay</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {MOCK_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample.id)}
              className="p-3.5 rounded-2xl bg-[#050814] border border-white/5 hover:border-redrob-blue/50 transition-all text-left group cursor-pointer spring-hover"
            >
              <div className="flex items-center justify-between font-mono">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                    sample.verdictColor === 'red'
                      ? 'bg-redrob-coral/20 text-redrob-coral border-redrob-coral/40'
                      : sample.verdictColor === 'orange'
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      : 'bg-redrob-lime/20 text-redrob-lime border-redrob-lime/40'
                  }`}
                >
                  Score: {sample.riskScore}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-redrob-aqua transition-all" />
              </div>
              <h4 className="text-xs font-bold text-white mt-2 line-clamp-1">{sample.name}</h4>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5 line-clamp-2">
                {sample.subject}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Submission Form */}
      <div className="p-7 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card shimmer-card">
        {/* Toggle Mode: Upload vs Raw */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex p-1 rounded-full bg-[#050814] border border-white/10">
            <button
              onClick={() => setActiveMode('upload')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                activeMode === 'upload' ? 'bg-redrob-blue text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              File Drop (.eml / .msg)
            </button>
            <button
              onClick={() => setActiveMode('raw')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                activeMode === 'raw' ? 'bg-redrob-blue text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw RFC Headers
            </button>
          </div>

          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 text-xs text-redrob-aqua hover:text-white transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">How to export email headers?</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {activeMode === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-[24px] p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-redrob-aqua bg-redrob-blue/10'
                  : 'border-white/15 hover:border-redrob-blue/40 bg-[#050814]/60'
              }`}
            >
              <input
                type="file"
                accept=".eml,.msg,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="w-16 h-16 rounded-2xl bg-[#0b1026] border border-white/10 mx-auto flex items-center justify-center text-redrob-aqua mb-4 shadow-md">
                <UploadCloud className="w-8 h-8" />
              </div>

              {selectedFile ? (
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-redrob-lime" />
                    {selectedFile.name}
                  </span>
                  <p className="text-xs text-slate-400 font-mono">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Ready for deep forensic parse
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">
                    Drag and drop your suspicious email here
                  </p>
                  <p className="text-xs text-slate-400 font-sans">
                    Supports RFC 822 (.eml), Outlook (.msg), or exported text files up to 25MB
                  </p>
                  <span className="inline-block mt-3 text-xs text-redrob-blue font-bold underline font-mono">
                    or click to browse local files
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs text-slate-400 mb-2 font-mono">
                Paste raw RFC 822 email headers (e.g. Received, From, ARC-Authentication-Results):
              </label>
              <textarea
                rows={9}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Delivered-To: victim@company.com\nReceived: from unknown (unknown [185.220.101.44])\nFrom: "CEO Name" <s.jenkins@corp-apexdefense.com>\nSubject: Confidential Transfer Request`}
                className="w-full p-4 rounded-2xl bg-[#050814] border border-white/10 text-redrob-aqua font-mono text-xs focus:border-redrob-blue focus:outline-none leading-relaxed"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
              <span className="w-2 h-2 rounded-full bg-redrob-lime" />
              <span>Zero telemetry data leaked. Scanned in private memory sandbox.</span>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-redrob-blue to-[#1d3fe8] hover:shadow-redrob-glow text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all spring-hover"
            >
              <span>Execute Forensic Scan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Header Help Modal */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="How to Extract Raw Email Headers"
        subtitle="Step-by-step instructions for major email clients"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-[#050814] border border-white/10">
            <h4 className="font-bold text-redrob-blue mb-1">Gmail (Web)</h4>
            <p className="text-slate-300 font-sans leading-relaxed">
              1. Open the email in Gmail.<br />
              2. Click the three vertical dots (More options) next to the Reply button.<br />
              3. Click <strong>"Show original"</strong>.<br />
              4. Click <strong>"Download Original"</strong> (gives you a .eml file) or <strong>"Copy to clipboard"</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#050814] border border-white/10">
            <h4 className="font-bold text-redrob-blue mb-1">Microsoft Outlook (Desktop)</h4>
            <p className="text-slate-300 font-sans leading-relaxed">
              1. Double-click the email to open it in its own window.<br />
              2. Go to <strong>File → Properties</strong>.<br />
              3. Under <strong>"Internet headers"</strong>, select all and copy, or drag the email directly to your desktop as a .msg file.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#050814] border border-white/10">
            <h4 className="font-bold text-redrob-blue mb-1">Apple Mail (macOS)</h4>
            <p className="text-slate-300 font-sans leading-relaxed">
              1. Select the email.<br />
              2. Go to <strong>View → Message → Raw Source</strong> (or press ⌥⌘U).<br />
              3. Select all text and copy into the raw headers box.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
