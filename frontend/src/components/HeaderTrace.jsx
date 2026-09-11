import React from 'react';
import { Mail, Shield, CheckCircle2, XCircle, AlertCircle, Globe } from 'lucide-react';

export default function HeaderTrace({ data }) {
  if (!data || !data.headers) return null;

  const { headers, domain_intel } = data;
  const auth = headers.auth_results || {};

  const renderAuthBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'pass') {
      return <span className=\"badge badge-green\"><CheckCircle2 size={12} /> PASS</span>;
    } else if (s === 'fail') {
      return <span className=\"badge badge-red\"><XCircle size={12} /> FAIL</span>;
    } else {
      return <span className=\"badge badge-amber\"><AlertCircle size={12} /> {s.toUpperCase() || 'NONE'}</span>;
    }
  };

  return (
    <div className=\"card\">
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Mail size={20} color=\"#60a5fa\" /> Technical Header & Authentication Forensics
      </h2>

      {/* Header Metadata Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 12,
        marginBottom: 20
      }}>
        <div style={{ background: '#0f172a', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Display 'From' Header</div>
          <code style={{ fontSize: '0.85rem', color: '#38bdf8', wordBreak: 'break-all' }}>{headers.from_header || 'N/A'}</code>
        </div>
        <div style={{ background: '#0f172a', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Return-Path (Actual Envelope)</div>
          <code style={{ fontSize: '0.85rem', color: '#f59e0b', wordBreak: 'break-all' }}>{headers.return_path || 'N/A'}</code>
        </div>
        <div style={{ background: '#0f172a', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reply-To Target</div>
          <code style={{ fontSize: '0.85rem', color: '#e2e8f0', wordBreak: 'break-all' }}>{headers.reply_to || 'N/A'}</code>
        </div>
        <div style={{ background: '#0f172a', padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Message-ID</div>
          <code style={{ fontSize: '0.75rem', color: '#94a3b8', wordBreak: 'break-all' }}>{headers.message_id || 'N/A'}</code>
        </div>
      </div>

      {/* SPF, DKIM, DMARC Authentication Status */}
      <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Shield size={16} /> Domain Protocol Alignment Verification
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div style={{ background: '#0f172a', padding: 12, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6 }}>SPF Check</div>
          {renderAuthBadge(auth.spf_status)}
        </div>
        <div style={{ background: '#0f172a', padding: 12, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6 }}>DKIM Signature</div>
          {renderAuthBadge(auth.dkim_status)}
        </div>
        <div style={{ background: '#0f172a', padding: 12, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 6 }}>DMARC Policy</div>
          {renderAuthBadge(auth.dmarc_status)}
        </div>
      </div>

      {/* Domain WHOIS Intelligence */}
      {domain_intel && (
        <div>
          <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Globe size={16} /> Domain Intelligence & WHOIS Age
          </h3>
          <div style={{ background: '#0f172a', padding: 12, borderRadius: 8, fontSize: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <div><strong>Domain:</strong> <code style={{ color: '#38bdf8' }}>{domain_intel.domain}</code></div>
            <div><strong>Registrar:</strong> {domain_intel.registrar || 'Unknown'}</div>
            <div>
              <strong>Domain Age:</strong>{' '}
              <span style={{ color: domain_intel.is_new_domain ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                {domain_intel.age_days} days {domain_intel.is_new_domain ? '(NEW/SUSPICIOUS)' : '(Established)'}
              </span>
            </div>
            <div><strong>MX Records:</strong> {domain_intel.mx_records?.length > 0 ? domain_intel.mx_records.join(', ') : 'None'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
