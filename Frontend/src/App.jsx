import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import FraudScoreCard from './components/FraudScoreCard'
import GeoMap from './components/GeoMap'
import AuthBadgeBoard from './components/AuthBadgeBoard'
import HeaderTrace from './components/HeaderTrace'
import CampaignGraph from './components/CampaignGraph'
import CaseList from './components/CaseList'
import UploadPanel from './components/UploadPanel'
import ForensicReport from './components/ForensicReport'
import { Mail, Shield, AlertTriangle, Eye, Loader2, Sparkles, Terminal } from 'lucide-react'

// Base API URL (proxied in Vite or direct)
const API_BASE = '/api'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard', 'campaigns', 'cases'
  const [currentCase, setCurrentCase] = useState(null)
  const [cases, setCases] = useState([])
  const [samples, setSamples] = useState([])
  const [selectedSampleId, setSelectedSampleId] = useState('sample-1')
  const [campaignGraph, setCampaignGraph] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [errorNotice, setErrorNotice] = useState(null)

  // Fetch initial data
  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [samplesRes, casesRes, graphRes] = await Promise.all([
        axios.get(`${API_BASE}/samples`),
        axios.get(`${API_BASE}/cases`),
        axios.get(`${API_BASE}/campaigns/graph`)
      ])

      setSamples(samplesRes.data || [])
      setCases(casesRes.data || [])
      setCampaignGraph(graphRes.data || null)

      // If cases are preloaded, fetch full detail for the first case
      if (casesRes.data && casesRes.data.length > 0) {
        const firstCid = casesRes.data[0].case_id
        const detailRes = await axios.get(`${API_BASE}/cases/${firstCid}`)
        setCurrentCase(detailRes.data)
      }
    } catch (err) {
      console.error('Failed to load initial data:', err)
      setErrorNotice('Backend connection offline. Ensure the FastAPI backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  // Refresh case history & campaign graph
  const refreshHistoryAndGraph = async () => {
    try {
      const [casesRes, graphRes] = await Promise.all([
        axios.get(`${API_BASE}/cases`),
        axios.get(`${API_BASE}/campaigns/graph`)
      ])
      setCases(casesRes.data || [])
      setCampaignGraph(graphRes.data || null)
    } catch (err) {
      console.error('Failed to refresh data:', err)
    }
  }

  // 1-Click Sample Email Selector
  const handleSelectSample = async (sampleId) => {
    setSelectedSampleId(sampleId)
    setLoading(true)
    setErrorNotice(null)
    try {
      const sampleRes = await axios.get(`${API_BASE}/samples/${sampleId}`)
      const rawEml = sampleRes.data.raw_eml

      const formData = new FormData()
      formData.append('raw_eml', rawEml)

      const analyzeRes = await axios.post(`${API_BASE}/analyze`, formData)
      setCurrentCase(analyzeRes.data)
      setActiveTab('dashboard')
      await refreshHistoryAndGraph()
    } catch (err) {
      console.error('Failed to analyze sample:', err)
      setErrorNotice('Failed analyzing sample email.')
    } finally {
      setLoading(false)
    }
  }

  // Analyze uploaded .eml file
  const handleAnalyzeFile = async (file) => {
    setLoading(true)
    setErrorNotice(null)
    setSelectedSampleId(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post(`${API_BASE}/analyze`, formData)
      setCurrentCase(res.data)
      setActiveTab('dashboard')
      await refreshHistoryAndGraph()
    } catch (err) {
      console.error('Analysis failed:', err)
      throw new Error(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  // Analyze raw text
  const handleAnalyzeText = async (rawText) => {
    setLoading(true)
    setErrorNotice(null)
    setSelectedSampleId(null)
    try {
      const formData = new FormData()
      formData.append('raw_eml', rawText)
      const res = await axios.post(`${API_BASE}/analyze`, formData)
      setCurrentCase(res.data)
      setActiveTab('dashboard')
      await refreshHistoryAndGraph()
    } catch (err) {
      console.error('Analysis failed:', err)
      throw new Error(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  // Inspect case from history or campaign graph
  const handleSelectCase = async (caseId) => {
    setLoading(true)
    setErrorNotice(null)
    try {
      const res = await axios.get(`${API_BASE}/cases/${caseId}`)
      setCurrentCase(res.data)
      setActiveTab('dashboard')
    } catch (err) {
      console.error('Failed to load case:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Top Navbar with 1-Click Demo Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        samples={samples}
        onSelectSample={handleSelectSample}
        selectedSampleId={selectedSampleId}
        loading={loading}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Alert */}
        {errorNotice && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button
              onClick={() => setErrorNotice(null)}
              className="text-xs text-red-400 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Global Loading Spinner Banner */}
        {loading && (
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 flex items-center space-x-2 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            <span>Analyzing email RFC 5322 headers, running DistilBERT transformer, and geolocating origin route...</span>
          </div>
        )}

        {/* Tab 1: Forensic Analysis Dashboard */}
        {activeTab === 'dashboard' && currentCase && (
          <div className="space-y-6">
            {/* Top Row: Fraud Score Card + Origin GeoMap */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5">
                <FraudScoreCard
                  scoring={currentCase.fraud_scoring}
                  detection={currentCase.detection}
                  onOpenReport={() => setIsReportOpen(true)}
                />
              </div>

              <div className="lg:col-span-7">
                <GeoMap
                  hops={currentCase.relay_hops}
                  originGeo={currentCase.geolocation}
                  originIp={currentCase.origin_ip}
                />
              </div>
            </div>

            {/* Middle Row: Protocol Verification Badges */}
            <AuthBadgeBoard
              auth={currentCase.authentication}
              domainIntel={currentCase.domain_intel}
              replyDomainIntel={currentCase.reply_domain_intel}
              anomalies={currentCase.anomalies}
            />

            {/* Bottom Row: Relay Path Timeline & Email Body Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <HeaderTrace
                  hops={currentCase.relay_hops}
                  originIp={currentCase.origin_ip}
                />
              </div>

              {/* Message Payload & Header Inspector */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold uppercase text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-cyan-400" />
                      <span>Email Envelope & Content Inspector</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">
                      Ref: #{currentCase.case_id}
                    </span>
                  </div>

                  <div className="py-3 space-y-2 text-xs font-mono border-b border-slate-800/60">
                    <div>
                      <span className="text-slate-500">From: </span>
                      <span className="text-slate-200 font-semibold">{currentCase.sender.display_name} &lt;{currentCase.sender.email}&gt;</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Reply-To: </span>
                      <span className={currentCase.anomalies.reply_to_mismatch ? "text-red-400 font-bold" : "text-slate-300"}>
                        {currentCase.reply_to || 'None (same as From)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Subject: </span>
                      <span className="text-white font-sans font-bold">{currentCase.subject}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Date: </span>
                      <span className="text-slate-400">{currentCase.date}</span>
                    </div>
                  </div>

                  {/* Body Text Preview */}
                  <div className="mt-3 flex-1 flex flex-col">
                    <div className="text-[11px] uppercase font-bold text-slate-500 mb-1.5 flex items-center space-x-1">
                      <Terminal className="h-3 w-3" />
                      <span>Message Body Preview</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-sans text-slate-300 leading-relaxed overflow-y-auto max-h-48 whitespace-pre-wrap select-text">
                      {currentCase.full_body_text || currentCase.body_preview}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Campaign Correlation View */}
        {activeTab === 'campaigns' && (
          <CampaignGraph
            graphData={campaignGraph}
            onSelectCase={handleSelectCase}
          />
        )}

        {/* Tab 3: Historical Cases Directory */}
        {activeTab === 'cases' && (
          <CaseList
            cases={cases}
            onSelectCase={handleSelectCase}
            activeCaseId={currentCase?.case_id}
          />
        )}
      </main>

      {/* Evidentiary Chain-of-Custody Modal */}
      {isReportOpen && currentCase && (
        <ForensicReport
          caseData={currentCase}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      {/* Upload .EML Modal */}
      <UploadPanel
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAnalyzeFile={handleAnalyzeFile}
        onAnalyzeText={handleAnalyzeText}
        loading={loading}
      />
    </div>
  )
}
