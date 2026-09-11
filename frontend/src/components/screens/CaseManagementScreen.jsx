import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  Clock,
  User,
  Plus,
  ArrowRight,
  ShieldAlert,
  Search,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Tag,
  Paperclip,
  Check,
  XCircle,
} from 'lucide-react';
import Modal from '../common/Modal';
import { MOCK_CASES } from '../../mock/mockData';

export default function CaseManagementScreen({
  cases = MOCK_CASES,
  onUpdateCases,
  onSelectCaseForInspect,
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [selectedCase, setSelectedCase] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [evidenceInput, setEvidenceInput] = useState('');

  const columns = [
    { id: 'new', label: 'New', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
    { id: 'investigating', label: 'Investigating', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
    { id: 'resolved', label: 'Resolved', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
  ];

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedCase) return;

    const updated = {
      ...selectedCase,
      timeline: [
        ...selectedCase.timeline,
        {
          time: 'Just now',
          author: 'Alex Chen (SOC Analyst)',
          text: newNoteText.trim(),
        },
      ],
    };

    setSelectedCase(updated);
    const updatedList = cases.map((c) => (c.id === updated.id ? updated : c));
    onUpdateCases && onUpdateCases(updatedList);
    setNewNoteText('');
  };

  const handleAddEvidence = (e) => {
    e.preventDefault();
    if (!evidenceInput.trim() || !selectedCase) return;

    const updated = {
      ...selectedCase,
      indicators: [...(selectedCase.indicators || []), evidenceInput.trim()],
      timeline: [
        ...selectedCase.timeline,
        {
          time: 'Just now',
          author: 'Alex Chen',
          text: `Attached new forensic indicator: ${evidenceInput.trim()}`,
        },
      ],
    };

    setSelectedCase(updated);
    const updatedList = cases.map((c) => (c.id === updated.id ? updated : c));
    onUpdateCases && onUpdateCases(updatedList);
    setEvidenceInput('');
    setIsAddingEvidence(false);
  };

  const handleMoveStatus = (caseId, newStatus) => {
    const updatedList = cases.map((c) =>
      c.id === caseId ? { ...c, status: newStatus, updatedAt: 'Just now' } : c
    );
    onUpdateCases && onUpdateCases(updatedList);
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase({ ...selectedCase, status: newStatus });
    }
  };

  const handleCloseCase = (caseId) => {
    handleMoveStatus(caseId, 'resolved');
  };

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.threatActor && c.threatActor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.sender && c.sender.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-redrob-blue/15 border border-redrob-blue/30 flex items-center justify-center text-redrob-blue">
              <Briefcase className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Case Management
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Group evidence, collaborate with security analysts, and track multi-stage email incident investigations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases, sender, or IOC..."
              className="pl-9 pr-4 py-2 rounded-full bg-[#0b1026] border border-white/10 text-xs text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 transition-all w-52 sm:w-64"
            />
          </div>

          {/* Kanban vs List Switcher */}
          <div className="flex p-1 rounded-full bg-[#0b1026] border border-white/10 text-xs shadow-inner">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-bold ${
                viewMode === 'kanban'
                  ? 'bg-redrob-blue text-white shadow-redrob-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-bold ${
                viewMode === 'list'
                  ? 'bg-redrob-blue text-white shadow-redrob-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View — New → Investigating → Resolved */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const colCases = filteredCases.filter((c) => (c.status || 'new') === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-[26px] bg-[#0b1026] border border-white/10 p-4 min-h-[520px] shadow-redrob-card"
              >
                {/* Column Title */}
                <div
                  className={`flex items-center justify-between p-3 rounded-full border mb-4 text-xs font-bold tracking-wide ${col.color}`}
                >
                  <span className="pl-2 uppercase font-mono">{col.label}</span>
                  <span className="w-6 h-6 rounded-full bg-black/40 text-white font-black flex items-center justify-center text-[11px]">
                    {colCases.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1">
                  {colCases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className="p-4 rounded-2xl bg-[#050814] hover:bg-[#0e1635] border border-white/10 hover:border-redrob-blue/50 transition-all duration-300 spring-hover cursor-pointer shadow-md space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-redrob-blue font-mono font-bold">{c.id}</span>
                        <span
                          className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                            c.riskScore >= 80 || c.severity === 'critical'
                              ? 'bg-red-500/20 text-red-400 border-red-500/40'
                              : c.riskScore >= 60 || c.severity === 'high'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          }`}
                        >
                          Risk: {c.riskScore || 85}/100
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug group-hover:text-redrob-aqua transition-colors">
                        {c.title}
                      </h4>

                      {c.sender && (
                        <p className="text-[11px] text-slate-400 truncate font-mono">
                          Sender: <span className="text-slate-300">{c.sender}</span>
                        </p>
                      )}

                      <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">{c.summary}</p>

                      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate max-w-[120px]">{c.assignedTo?.split('(')[0] || 'Shri'}</span>
                        <span className="text-redrob-aqua font-mono font-bold flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          <span>{c.linkedEmailsCount || 1} Evidence</span>
                        </span>
                      </div>
                    </div>
                  ))}

                  {colCases.length === 0 && (
                    <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center min-h-[160px]">
                      <span>No cases in this column</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="p-6 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card font-sans text-xs overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] font-mono tracking-wider">
                <th className="pb-3">Case ID</th>
                <th className="pb-3">Incident Title</th>
                <th className="pb-3">Risk / Severity</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Sender / Actor</th>
                <th className="pb-3">Assigned Lead</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 text-redrob-blue font-mono font-bold">{c.id}</td>
                  <td className="py-4 font-bold text-white max-w-xs truncate">{c.title}</td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        c.riskScore >= 80 || c.severity === 'critical'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}
                    >
                      {c.riskScore ? `${c.riskScore}/100` : c.severity}
                    </span>
                  </td>
                  <td className="py-4 uppercase text-slate-300 font-mono font-bold">{c.status || 'new'}</td>
                  <td className="py-4 text-slate-300 truncate max-w-[150px] font-mono">{c.sender || c.threatActor}</td>
                  <td className="py-4 text-slate-400 truncate max-w-[150px]">{c.assignedTo || 'Shri'}</td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => setSelectedCase(c)}
                      className="px-3.5 py-1 rounded-full bg-white/5 hover:bg-redrob-blue hover:text-white border border-white/10 text-redrob-blue text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCase && (
        <Modal
          isOpen={Boolean(selectedCase)}
          onClose={() => setSelectedCase(null)}
          title={`${selectedCase.id}: ${selectedCase.title}`}
          subtitle={`Threat Lead / Actor: ${selectedCase.threatActor || selectedCase.sender || 'Unknown Syndicate'}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 font-sans text-xs">
            {/* Status Switcher & Close Case Action */}
            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current Phase:</span>
                <span className="font-bold uppercase px-3 py-1 rounded-full bg-redrob-blue/20 border border-redrob-blue/40 text-redrob-blue font-mono">
                  {selectedCase.status || 'new'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 mr-1 text-[11px]">Move Phase:</span>
                {['new', 'investigating', 'resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleMoveStatus(selectedCase.id, st)}
                    className={`px-3 py-1 rounded-full uppercase text-[10px] font-mono transition-all cursor-pointer font-bold ${
                      (selectedCase.status || 'new') === st
                        ? 'bg-redrob-blue text-white shadow-redrob-glow'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}

                <button
                  onClick={() => handleCloseCase(selectedCase.id)}
                  className="px-3.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold uppercase text-[10px] font-mono transition-all border border-emerald-500/40 flex items-center gap-1 cursor-pointer ml-2"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Close Case</span>
                </button>
              </div>
            </div>

            {/* Case Summary */}
            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10 space-y-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">
                Executive Synopsis
              </span>
              <p className="text-slate-300 font-sans leading-relaxed text-sm">{selectedCase.summary}</p>
              {selectedCase.sampleId && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onSelectCaseForInspect && onSelectCaseForInspect(selectedCase.sampleId);
                      setSelectedCase(null);
                    }}
                    className="text-xs text-redrob-aqua hover:underline font-bold flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Linked Email Analysis Dossier</span>
                  </button>
                </div>
              )}
            </div>

            {/* Shared Indicators (IOCs) */}
            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">
                  Shared Indicators &amp; Forensic Evidence ({selectedCase.indicators?.length || 0})
                </span>
                <button
                  onClick={() => setIsAddingEvidence(!isAddingEvidence)}
                  className="text-xs text-redrob-blue hover:text-redrob-aqua font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Evidence</span>
                </button>
              </div>

              {isAddingEvidence && (
                <form onSubmit={handleAddEvidence} className="flex gap-2 pt-1 animate-fade-in">
                  <input
                    type="text"
                    value={evidenceInput}
                    onChange={(e) => setEvidenceInput(e.target.value)}
                    placeholder="Enter indicator (e.g. 185.220.101.44, rogue-bank.com, SHA256)..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#0b1026] border border-white/15 text-white text-xs font-mono focus:border-redrob-blue focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-redrob-blue hover:bg-blue-600 text-white font-bold text-xs"
                  >
                    Attach
                  </button>
                </form>
              )}

              <div className="flex flex-wrap gap-2">
                {(selectedCase.indicators || []).map((ioc, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono font-bold"
                  >
                    {ioc}
                  </span>
                ))}
              </div>
            </div>

            {/* Chronological Investigation Timeline & Notes */}
            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10 space-y-3">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">
                Investigation Timeline &amp; Analyst Notes
              </span>
              <div className="space-y-3 divide-y divide-white/5 max-h-56 overflow-y-auto">
                {(selectedCase.timeline || []).map((item, i) => (
                  <div key={i} className="pt-2.5 first:pt-0 flex items-start gap-3">
                    <span className="text-redrob-blue font-mono text-[11px] shrink-0 font-bold">{item.time}</span>
                    <div>
                      <span className="text-white font-bold mr-2">{item.author}:</span>
                      <span className="text-slate-300 font-sans leading-relaxed">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add analyst investigation comment..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-[#0b1026] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 transition-all text-xs"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold shadow-redrob-glow transition-all cursor-pointer text-xs"
                >
                  Post Note
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
