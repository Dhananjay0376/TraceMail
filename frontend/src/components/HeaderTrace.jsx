import React from 'react';
import { Mail, Shield, CheckCircle2, XCircle, AlertCircle, Globe, Lock, Link as LinkIcon, Paperclip, AlertTriangle } from 'lucide-react';

export default function HeaderTrace({ data }) {
  if (!data || !data.headers) return null;

  const { headers, domain_intel, evidence_seal, extracted_urls, attachments } = data;
  const auth = headers.auth_results || {};

  const renderAuthBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'pass') {
      return <span className="badge badge-green"><CheckCircle2 size={12} /> PASS</span>;
    } else if (s === 'fail') {
      return <span className="badge badge-red"><XCircle size={12} /> FAIL</span>;
    } else {
      return <span className="badge badge-amber"><AlertCircle size={12} /> {s.toUpperCase() || 'NONE'}</span>;
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Mail size={20} color="#60a5fa" /> Technical Header & Authentication Forensics
        </h2>
        {evidence_seal && (
          <span className="badge badge-green" title={`SHA-256: ${evidence_seal.sha256}`}>
            <Lock size={12} /> Chain-of-Custody Sealed
          </span>
        )}
      </div>

      {/* Chain-of-Custody Evidence Seal */}
      {evidence_seal && (
        <div style={{
          background: '#091e2b',
          border: '1px solid #0284c7',
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 16,
          fontSize: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#38bdf8', fontWeight: 600 }}>
            <span>Evidentiary Integrity Seal ({evidence_seal.parser_version})</span>
            <span>{evidence_seal.file_size_bytes} Bytes</span>
          </div>
          <div style={{ color: '#94a3b8', wordBreak: 'break-all', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <strong>SHA-256:</strong> {evidence_seal.sha256}
          </div>
        </div>
      )}

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
        <div style={{ marginBottom: 16 }}>
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

      {/* Extracted URLs Inspection */}
      {extracted_urls && extracted_urls.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <LinkIcon size={16} /> Extracted Hyperlinks ({extracted_urls.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {extracted_urls.map((u, i) => (
              <div key={i} style={{ background: '#0f172a', padding: '10px 12px', borderRadius: 6, fontSize: '0.8rem' }}>
                <div style={{ wordBreak: 'break-all', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>
                  {u.url}
                </div>
                {u.threat_flags?.length > 0 && (
                  <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {u.threat_flags.map((flag, fi) => (
                      <span key={fi} className="badge badge-red" style={{ fontSize: '0.7rem' }}>
                        <AlertTriangle size={10} /> {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachments Inspection */}
      {attachments && attachments.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Paperclip size={16} /> Attached Files ({attachments.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {attachments.map((a, i) => (
              <div key={i} style={{
                background: a.is_suspicious_extension ? '#450a0a' : '#0f172a',
                border: a.is_suspicious_extension ? '1px solid #dc2626' : '1px solid #1e293b',
                padding: '10px 12px',
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem'
              }}>
                <div>
                  <strong style={{ color: a.is_suspicious_extension ? '#fca5a5' : '#f1f5f9' }}>{a.filename}</strong>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{a.content_type} • {a.size_bytes} Bytes</div>
                </div>
                <span className={`badge ${a.is_suspicious_extension ? 'badge-red' : 'badge-green'}`}>
                  {a.threat_level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

