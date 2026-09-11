import React, { useState } from 'react';
import {
  Bell,
  Filter,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Search,
  ExternalLink,
  Trash2,
  AlertOctagon,
  ArrowRight,
} from 'lucide-react';
import RiskBadge from '../common/RiskBadge';
import { MOCK_ALERTS } from '../../mock/mockData';

export default function AlertsCenterScreen({ onSelectSample }) {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateStatus = (id, newStatus) => {
    // TODO: connect to backend API /api/alerts/:id/status
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (
      searchQuery &&
      !a.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !a.sender.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !a.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-redrob-blue/15 border border-redrob-blue/30 flex items-center justify-center text-redrob-blue">
              <Bell className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Threat Alerts &amp; Notification Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Real-time heuristic feed of incoming phishing attempts, spoofed domains, and IOC triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAlerts(alerts.map((a) => ({ ...a, status: 'acknowledged' })))}
            className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-sans text-white font-bold transition-all cursor-pointer shadow-sm"
          >
            Acknowledge All
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-5 rounded-[24px] bg-[#0b1026] border border-white/10 shadow-redrob-card flex flex-wrap items-center justify-between gap-4 font-sans text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sender, title, or alert ID..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 text-xs"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3.5 py-1.5 rounded-full uppercase text-[10px] font-bold transition-all cursor-pointer ${
                severityFilter === sev
                  ? 'bg-redrob-blue text-white shadow-redrob-glow'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Status:</span>
          {['all', 'unread', 'investigating', 'resolved', 'dismissed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full capitalize text-[10px] font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-redrob-blue text-white shadow-redrob-glow'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card overflow-hidden font-sans text-xs">
        <div className="divide-y divide-white/5">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:bg-white/[0.02] ${
                alert.status === 'unread' ? 'bg-redrob-blue/[0.04]' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 shrink-0">
                  <RiskBadge score={alert.score} size="sm" showScore={false} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-white text-sm">{alert.title}</span>
                    <span className="text-[10px] text-redrob-blue font-mono font-bold bg-redrob-blue/15 px-2 py-0.5 rounded-full border border-redrob-blue/30">
                      {alert.id}
                    </span>
                    {alert.status === 'unread' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-redrob-aqua/15 text-redrob-aqua text-[10px] font-bold border border-redrob-aqua/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-redrob-aqua animate-ping" />
                        Live
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-slate-400 text-xs font-mono">
                    <span>
                      Sender: <span className="text-slate-200">{alert.sender}</span>
                    </span>
                    <span>•</span>
                    <span>
                      Target: <span className="text-slate-300">{alert.recipient}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{alert.time}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => onSelectSample(alert.sampleId)}
                  className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-redrob-blue hover:text-white border border-white/10 text-redrob-blue font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                >
                  <span>Inspect Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                {alert.status !== 'dismissed' ? (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'dismissed')}
                    className="p-2 rounded-full bg-white/5 hover:bg-[#ff4050]/20 border border-white/10 text-slate-400 hover:text-[#ff6b78] cursor-pointer transition-all"
                    title="Dismiss Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Dismissed</span>
                )}
              </div>
            </div>
          ))}

          {filteredAlerts.length === 0 && (
            <div className="p-16 text-center text-slate-500 space-y-3">
              <ShieldAlert className="w-8 h-8 mx-auto opacity-40 text-redrob-blue" />
              <p>No alerts matching the selected filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
