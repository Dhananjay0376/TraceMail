import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Radio, Terminal, AlertTriangle, Layers } from 'lucide-react';

import UploadPanel from './components/UploadPanel';
import FraudScoreCard from './components/FraudScoreCard';
import HeaderTrace from './components/HeaderTrace';
import GeoMap from './components/GeoMap';
import CaseList from './components/CaseList';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [caseHistory, setCaseHistory] = useState([]);
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    // Check backend health
    axios.get(${API_BASE}/health)
      .then(() => setServerStatus('connected'))
      .catch(() => setServerStatus('disconnected'));

    // Fetch case history
    axios.get(${API_BASE}/cases)
      .then(res => setCaseHistory(res.data))
      .catch(() => {});
  }, []);

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setCaseHistory(prev => [data, ...prev.filter(c => c.id !== data.id)]);
  };

  return (
    <div>
      {/* Top Navbar */}
      <header style={{
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            padding: 8,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={24} color=\"#ffffff\" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: -0.5 }}>
              TraceMail <span style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>Forensic Intelligence</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              SIH 2026 PS26106 — Threat Detection, Relay Geolocation & Attribution
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
            <Radio size={14} color={serverStatus === 'connected' ? '#10b981' : '#ef4444'} />
            <span style={{ color: serverStatus === 'connected' ? '#34d399' : '#f87171' }}>
              {serverStatus === 'connected' ? 'API Online' : 'API Offline (Local Stub)'}
            </span>
          </div>
          <span className=\"badge badge-blue\">SIH 2026 Prototype</span>
        </div>
      </header>

      {/* Main Container */}
      <main className=\"container\">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
          <UploadPanel onAnalysisComplete={handleAnalysisComplete} />
          <CaseList
            cases={caseHistory}
            onSelectCase={(c) => setAnalysisData(c)}
            activeCaseId={analysisData?.id}
          />
        </div>

        {analysisData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Top Row: Score + Header Forensics */}
            <div className=\"grid-2\">
              <FraudScoreCard data={analysisData} />
              <HeaderTrace data={analysisData} />
            </div>

            {/* Bottom Row: Geolocation Map */}
            <GeoMap trace={analysisData.trace} />
          </div>
        )}
      </main>
    </div>
  );
}
