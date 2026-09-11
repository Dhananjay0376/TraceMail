import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  Server,
  Key,
  AlertOctagon,
  FileCheck,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import Tabs from '../common/Tabs';
import { MOCK_USERS, MOCK_AUDIT_LOGS, MOCK_SYSTEM_HEALTH } from '../../mock/mockData';

export default function AdminPanelScreen() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(MOCK_USERS);

  const tabs = [
    { id: 'users', label: 'User Governance', icon: Users },
    { id: 'audit', label: 'SOC Audit Logs', icon: FileCheck },
    { id: 'health', label: 'System Telemetry & Health', icon: Activity },
  ];

  const handleToggleSuspend = (id) => {
    // TODO: connect to backend API /api/admin/users/:id/suspend
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-redrob-blue/15 border border-redrob-blue/30 flex items-center justify-center text-redrob-blue">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Enterprise Administration &amp; Governance
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Audit logs, access control lists, and low-latency heuristic model telemetry.
          </p>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-redrob-blue/15 border border-redrob-blue/40 text-redrob-blue font-mono text-xs font-bold self-start sm:self-auto">
          Admin Clearance: Verified
        </span>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: User Management Table */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card font-sans text-xs overflow-x-auto animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Enrolled Security Operators &amp; Employees
            </h3>
            <span className="text-redrob-blue font-mono font-bold">{users.length} Total Users</span>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] font-mono tracking-wider">
                <th className="pb-3">Name &amp; Email</th>
                <th className="pb-3">Assigned Role</th>
                <th className="pb-3">2FA Hardware Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Last Active</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4">
                    <span className="font-bold text-white text-sm block">{u.name}</span>
                    <span className="text-slate-400 text-xs font-mono">{u.email}</span>
                  </td>
                  <td className="py-4 font-bold text-redrob-blue font-mono">{u.role}</td>
                  <td className="py-4 text-slate-400">{u.mfa}</td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                        u.status === 'Active'
                          ? 'bg-redrob-lime/15 text-redrob-lime border-redrob-lime/30'
                          : 'bg-[#ff4050]/15 text-[#ff6b78] border-[#ff4050]/30'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 text-slate-500 font-mono">{u.lastActive}</td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleToggleSuspend(u.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                        u.status === 'Active'
                          ? 'bg-[#ff4050]/15 hover:bg-[#ff4050]/30 text-[#ff6b78] border border-[#ff4050]/40'
                          : 'bg-redrob-lime/15 hover:bg-redrob-lime/30 text-redrob-lime border border-redrob-lime/40'
                      }`}
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card font-sans text-xs overflow-x-auto animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Immutable SOC Action &amp; Forensic Audit Trail
            </h3>
            <span className="text-xs text-slate-400 font-mono">Tamper-Evident Ledger</span>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] font-mono tracking-wider">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Investigator</th>
                <th className="pb-3">Executed Action</th>
                <th className="pb-3">Telemetry Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {MOCK_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 text-slate-400 font-mono">{log.timestamp}</td>
                  <td className="py-4 font-bold text-redrob-blue font-mono">{log.user}</td>
                  <td className="py-4 font-bold text-white">{log.action}</td>
                  <td className="py-4 text-slate-300 font-mono text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: System Health & Telemetry */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans text-xs animate-fade-in">
          <div className="p-6 rounded-[24px] bg-[#0b1026] border border-white/10 shadow-redrob-card space-y-3.5 hover:border-redrob-blue/40 transition-all duration-300 spring-hover">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase font-bold text-[10px] font-mono tracking-wider">NLP Threat Engine</span>
              <span className="px-2.5 py-0.5 rounded-full bg-redrob-lime/15 text-redrob-lime font-bold border border-redrob-lime/30 text-[10px] font-mono">
                {MOCK_SYSTEM_HEALTH.aiModelEngine.status}
              </span>
            </div>
            <div className="text-lg font-bold text-white tracking-tight">{MOCK_SYSTEM_HEALTH.aiModelEngine.version}</div>
            <div className="text-slate-400 text-xs">
              Inference Latency: <span className="text-redrob-blue font-mono font-bold">{MOCK_SYSTEM_HEALTH.aiModelEngine.latency}</span>
            </div>
            <div className="text-slate-500 text-[10px] font-mono">Uptime: {MOCK_SYSTEM_HEALTH.aiModelEngine.uptime}</div>
          </div>

          <div className="p-6 rounded-[24px] bg-[#0b1026] border border-white/10 shadow-redrob-card space-y-3.5 hover:border-redrob-blue/40 transition-all duration-300 spring-hover">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase font-bold text-[10px] font-mono tracking-wider">MaxMind GeoIP2</span>
              <span className="px-2.5 py-0.5 rounded-full bg-redrob-lime/15 text-redrob-lime font-bold border border-redrob-lime/30 text-[10px] font-mono">
                {MOCK_SYSTEM_HEALTH.ipGeolocationDb.status}
              </span>
            </div>
            <div className="text-lg font-bold text-white tracking-tight">City &amp; ASN Telemetry</div>
            <div className="text-slate-400 text-xs">
              Query Latency: <span className="text-redrob-blue font-mono font-bold">{MOCK_SYSTEM_HEALTH.ipGeolocationDb.latency}</span>
            </div>
            <div className="text-slate-500 text-[10px] font-mono truncate">{MOCK_SYSTEM_HEALTH.ipGeolocationDb.database}</div>
          </div>

          <div className="p-6 rounded-[24px] bg-[#0b1026] border border-white/10 shadow-redrob-card space-y-3.5 hover:border-redrob-blue/40 transition-all duration-300 spring-hover">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase font-bold text-[10px] font-mono tracking-wider">Threat Intelligence</span>
              <span className="px-2.5 py-0.5 rounded-full bg-redrob-lime/15 text-redrob-lime font-bold border border-redrob-lime/30 text-[10px] font-mono">
                {MOCK_SYSTEM_HEALTH.threatIntelFeeds.status}
              </span>
            </div>
            <div className="text-lg font-bold text-white tracking-tight">4 Live Intelligence Feeds</div>
            <div className="text-slate-400 text-xs">
              Last Global Sync: <span className="text-redrob-blue font-mono font-bold">{MOCK_SYSTEM_HEALTH.threatIntelFeeds.lastSync}</span>
            </div>
            <div className="text-slate-500 text-[10px] font-mono truncate">{MOCK_SYSTEM_HEALTH.threatIntelFeeds.sources}</div>
          </div>
        </div>
      )}
    </div>
  );
}
