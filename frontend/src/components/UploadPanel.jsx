import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, Send, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function UploadPanel({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [mode, setMode] = useState('file'); // 'file' or 'text'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    if (mode === 'file') {
      if (!file) {
        setError('Please select an .eml email file to upload.');
        setLoading(false);
        return;
      }
      formData.append('file', file);
    } else {
      if (!rawText.trim()) {
        setError('Please paste the email content or headers.');
        setLoading(false);
        return;
      }
      formData.append('raw_text', rawText);
    }

    try {
      const resp = await axios.post(`${API_BASE}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onAnalysisComplete(resp.data);
    } catch (err) {
      console.error('Analysis failed', err);
      setError(err.response?.data?.detail || 'Failed to analyze email. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Ingest & Analyze Email</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setMode('file')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: mode === 'file' ? '#2563eb' : '#1e293b',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Upload .EML
          </button>
          <button
            type="button"
            onClick={() => setMode('text')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: mode === 'text' ? '#2563eb' : '#1e293b',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Raw Text / Headers
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'file' ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              border: '2px dashed #3b82f6',
              borderRadius: 8,
              padding: '36px 20px',
              textAlign: 'center',
              backgroundColor: '#0f172a',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('eml-input').click()}
          >
            <UploadCloud size={40} color="#60a5fa" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontWeight: 600, color: '#f1f5f9' }}>
              {file ? file.name : 'Drag & drop an .eml email file here, or click to browse'}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>
              Supports RFC-822 / MIME format raw email files with complete headers
            </p>
            <input
              id="eml-input"
              type="file"
              accept=".eml,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div>
            <textarea
              rows={7}
              placeholder="Paste raw email content including headers (From, Return-Path, Received:, etc.)..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#e2e8f0',
                fontSize: '0.875rem'
              }}
            />
          </div>
        )}

        {error && (
          <div style={{ marginTop: 12, padding: 10, background: '#450a0a', border: '1px solid #b91c1c', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, color: '#fca5a5' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '12px 20px',
            backgroundColor: loading ? '#475569' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Forensic Inspection in Progress...
            </>
          ) : (
            <>
              <Send size={18} />
              Run Full Forensic Pipeline
            </>
          )}
        </button>
      </form>
    </div>
  );
}
