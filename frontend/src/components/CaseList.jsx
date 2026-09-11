import React from 'react';
import { History, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function CaseList({ cases, onSelectCase, activeCaseId }) {
  if (!cases || cases.length === 0) {
    return (
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <History size={16} /> Recent Investigations
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>No past cases analyzed yet in this session.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <History size={16} /> Analyst Case History ({cases.length})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
        {cases.map((c) => {
          const score = c.fraud_score?.score || 0;
          const isSelected = c.id === activeCaseId;
          const badgeClass = score >= 60 ? 'badge badge-red' : score >= 30 ? 'badge badge-amber' : 'badge badge-green';
          return (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: isSelected ? '#1e293b' : '#0f172a',
                border: isSelected ? '1px solid #3b82f6' : '1px solid #1e293b',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f1f5f9' }}>{c.id}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.headers?.from_header || c.headers?.subject || 'Email Analysis'}
                </div>
              </div>
              <span className={badgeClass}>
                {score}/100
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
