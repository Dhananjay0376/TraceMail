import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, Network } from 'lucide-react';

export default function FraudScoreCard({ data }) {
  if (!data) return null;

  const { fraud_score, detection, domain_intel, campaign, headers } = data;
  const score = fraud_score?.score || 0;
  const risk = fraud_score?.risk_level || 'Low';

  const getScoreColor = () => {
    if (score >= 75) return '#ef4444';
    if (score >= 45) return '#f59e0b';
    return '#10b981';
  };

  const badgeClass = score >= 60 ? 'badge badge-red' : score >= 30 ? 'badge badge-amber' : 'badge badge-green';

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Confidence-Based Risk Assessment
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 4 }}>
            Case ID: {data.id}
          </h2>
        </div>
        <span className={badgeClass}>
          {risk} Risk ({score}/100)
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24, margin: '20px 0' }}>
        <div style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          border: `6px solid ${getScoreColor()}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a'
        }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: getScoreColor() }}>{score}</span>
          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>/ 100</span>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {score >= 60 ? <ShieldAlert color="#ef4444" size={22} /> : <ShieldCheck color="#10b981" size={22} />}
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              AI Prediction: <span style={{ color: score >= 60 ? '#f87171' : '#34d399' }}>{detection?.label}</span>
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 4 }}>
            Model Confidence: {Math.round((detection?.confidence || 0) * 100)}% ({detection?.model_version})
          </p>
        </div>
      </div>

      {/* Campaign Correlation Alert */}
      {campaign && (
        <div style={{
          backgroundColor: '#3b0764',
          border: '1px solid #9333ea',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <Network color="#c084fc" size={24} />
          <div>
            <span style={{ fontWeight: 700, color: '#f3e8ff', fontSize: '0.9rem' }}>
              Multi-Case Campaign Detected: {campaign.campaign_id}
            </span>
            <p style={{ fontSize: '0.8rem', color: '#d8b4fe' }}>
              This email shares infrastructure (IP/Domain) with {campaign.related_cases_count} other recorded investigation(s).
            </p>
          </div>
        </div>
      )}

      {/* Explainable Score Breakdown */}
      <div>
        <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Info size={14} /> Explainable Risk Factors Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {fraud_score?.factors && fraud_score.factors.length > 0 ? (
            fraud_score.factors.map((f, i) => (
              <div key={i} style={{
                background: '#0f172a',
                padding: '8px 12px',
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.825rem'
              }}>
                <div>
                  <strong style={{ color: '#f1f5f9' }}>{f.name}</strong>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{f.reason}</div>
                </div>
                <span style={{ fontWeight: 700, color: '#f87171', paddingLeft: 12 }}>+{f.points} pts</span>
              </div>
            ))
          ) : (
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No significant anomaly points flagged.</div>
          )}
        </div>
      </div>
    </div>
  );
}
