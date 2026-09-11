import React, { useState } from 'react'
import { UploadCloud, FileText, X, AlertCircle, Loader2 } from 'lucide-react'

export default function UploadPanel({ isOpen, onClose, onAnalyzeFile, onAnalyzeText, loading }) {
  const [tab, setTab] = useState('file') // 'file' or 'text'
  const [dragActive, setDragActive] = useState(false)
  const [rawText, setRawText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setError(null)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async () => {
    setError(null)
    if (tab === 'file') {
      if (!selectedFile) {
        setError('Please select an .eml file to upload')
        return
      }
      try {
        await onAnalyzeFile(selectedFile)
        onClose()
      } catch (err) {
        setError(err.message || 'Analysis failed')
      }
    } else {
      if (!rawText.trim()) {
        setError('Please paste raw email headers and body text')
        return
      }
      try {
        await onAnalyzeText(rawText)
        onClose()
      } catch (err) {
        setError(err.message || 'Analysis failed')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0c1222] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <UploadCloud className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Ingest Email for Forensic Triage
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setTab('file')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              tab === 'file' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Upload .EML File</span>
          </button>
          <button
            onClick={() => setTab('text')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              tab === 'text' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Paste Raw Email</span>
          </button>
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* File Drag Drop Tab */}
        {tab === 'file' ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
              dragActive
                ? 'border-cyan-400 bg-cyan-950/20'
                : 'border-slate-700 bg-slate-900/40 hover:border-slate-600'
            }`}
          >
            <UploadCloud className="h-10 w-10 text-cyan-400 mb-2" />
            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-cyan-300 font-mono">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="text-xs text-red-400 hover:underline pt-1"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-200">
                  Drag and drop your <span className="text-cyan-400 font-mono">.eml</span> file here
                </p>
                <p className="text-xs text-slate-500">or click below to browse from your device</p>
                <label className="inline-block mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 cursor-pointer">
                  Browse File
                  <input
                    type="file"
                    accept=".eml,message/rfc822"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400">
              Raw RFC 5322 Email (Headers + Body):
            </label>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="From: sender@domain.com&#10;To: recipient@domain.com&#10;Subject: Urgent&#10;Received: from mail.server.com ([1.2.3.4])...&#10;&#10;Email body message here..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center space-x-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            <span>{loading ? 'Analyzing...' : 'Run Forensic Analysis'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
