import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  ExternalLink,
  Shield,
  Layers,
  Database,
} from 'lucide-react';
import RiskBadge from '../common/RiskBadge';
import { MOCK_SAMPLES } from '../../mock/mockData';

export default function SearchHistoryScreen({ onSelectSample }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [dateRange, setDateRange] = useState('all');

  // Expanded mock historical archive
  const historicalScans = [
    ...MOCK_SAMPLES,
    {
      id: 'hist-1',
      name: 'Phishing Campaign Lure',
      subject: 'Notice: Payroll Direct Deposit Re-verification',
      sender: 'hr-support@corp-payroll-services.com',
      date: 'Sep 9, 2026',
      clientIp: '194.26.29.112',
      riskScore: 78,
      verdict: 'HIGH_RISK',
      verdictColor: 'orange',
      geo: { city: 'Frankfurt', country: 'Germany' },
    },
    {
      id: 'hist-2',
      name: 'Internal IT Maintenance Announcement',
      subject: 'Scheduled Maintenance Window: Saturday 02:00 UTC',
      sender: 'it-alerts@apexdefense.com',
      date: 'Sep 8, 2026',
      clientIp: '104.244.42.1',
      riskScore: 5,
      verdict: 'SAFE_LEGITIMATE',
      verdictColor: 'green',
      geo: { city: 'Ashburn', country: 'United States' },
    },
    {
      id: 'hist-3',
      name: 'DHL Package Tracking Delivery Notice',
      subject: 'Your shipment #DH-849184 is awaiting customs clearance',
      sender: 'notifications@dhl-express-tracking.su',
      date: 'Sep 7, 2026',
      clientIp: '185.176.27.18',
      riskScore: 89,
      verdict: 'FRAUD_CONFIRMED',
      verdictColor: 'red',
      geo: { city: 'St. Petersburg', country: 'Russia' },
    },
  ];

  const filtered = historicalScans.filter((item) => {
    if (item.riskScore < minScore) return false;
    if (
      searchTerm &&
      !item.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.sender.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.clientIp.includes(searchTerm)
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
              <Database className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Historical Threat Archive &amp; Deep Search
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Query across historical email telemetry by IP address, lookalike domain, sender, or cryptographic hash.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting forensic scan index as CSV...')}
          className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-sans text-white font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-redrob-blue" />
          <span>Export Index CSV</span>
        </button>
      </div>

      {/* Query Filter Controls */}
      <div className="p-6 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card space-y-4 font-sans text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="block text-slate-400 mb-1.5 font-medium">Search Keywords (Sender, IP, Subject, Hash)</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. 185.220.101.44 or corp-apexdefense or docusign..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#050814] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 transition-all text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-slate-400 font-medium">Min Risk Score Threshold</label>
              <span className="text-redrob-blue font-mono font-bold">{minScore}/100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full h-2 bg-[#050814] border border-white/10 rounded-lg appearance-none cursor-pointer accent-redrob-blue mt-2"
            />
          </div>
        </div>
      </div>

      {/* Table of Results */}
      <div className="p-6 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card font-sans text-xs overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] font-mono tracking-wider">
              <th className="pb-3">Subject &amp; Lure</th>
              <th className="pb-3">Sender Address</th>
              <th className="pb-3">Origin IP / Location</th>
              <th className="pb-3">Date Scanned</th>
              <th className="pb-3">Risk Verdict</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="py-4 font-bold text-white max-w-xs truncate">{item.subject}</td>
                <td className="py-4 text-redrob-blue font-mono truncate max-w-[180px]">{item.sender}</td>
                <td className="py-4 text-slate-300 font-mono">
                  <span>{item.clientIp}</span>
                  {item.geo && (
                    <span className="text-slate-500 text-[10px] block font-sans">
                      {item.geo.city}, {item.geo.country}
                    </span>
                  )}
                </td>
                <td className="py-4 text-slate-400 font-mono">{item.date}</td>
                <td className="py-4">
                  <RiskBadge score={item.riskScore} verdict={item.verdict} size="sm" />
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => onSelectSample(item.id.startsWith('sample') ? item.id : 'sample-wire-fraud')}
                    className="px-4 py-1 rounded-full bg-white/5 hover:bg-redrob-blue hover:text-white border border-white/10 text-redrob-blue text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    View Dossier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-16 text-center text-slate-500">
            No historical records matched your query filters.
          </div>
        )}
      </div>
    </div>
  );
}
