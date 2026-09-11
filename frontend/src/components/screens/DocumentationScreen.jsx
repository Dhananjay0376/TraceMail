import React, { useState } from 'react';
import { BookOpen, Search, HelpCircle, ChevronDown, ChevronUp, Lock, Globe, Shield } from 'lucide-react';
import { MOCK_GLOSSARY } from '../../mock/mockData';

export default function DocumentationScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      q: "Why did an email with my CEO's name get flagged as high risk?",
      a: "Attackers frequently perform Display Name Spoofing or register lookalike domains (e.g. corp-company.com instead of company.com). Although the displayed name appears to be your CEO, our cryptographic engine discovered that the true sending server IP belongs to a foreign datacenter not authorized in your company's SPF/DMARC records.",
    },
    {
      q: "What is the difference between SPF, DKIM, and DMARC?",
      a: "Think of SPF as the list of approved post offices (IP addresses). DKIM is the tamper-evident wax seal proving the message wasn't altered on the way. DMARC is the rulebook telling mail servers what to do (e.g., REJECT the letter) if the post office or wax seal doesn't match.",
    },
    {
      q: "How does TraceMail determine the physical geolocation of an email?",
      a: "Every email headers stream contains chronological 'Received:' lines stamped by each mail transfer agent (MTA) server that handled the message. TraceMail parses this chain in reverse order, extracting the first external public IP address and resolving it against high-precision MaxMind GeoIP2 databases.",
    },
    {
      q: "Does TraceMail store the body or confidential contents of submitted emails?",
      a: "No. By default, TraceMail's forensic sandbox processes emails ephemerally in RAM. Only metadata (hashes, headers, and geolocation coordinates) are indexed for threat correlation. PII masking can also be enabled in Settings to sanitize sensitive data.",
    },
    {
      q: "What should an employee do if an email is marked 'FRAUD CONFIRMED'?",
      a: "Do not click any hyperlinks, do not download attachments, and do not reply. Inform your IT security team immediately or click 'Report to Security Helpdesk'. The security team can push an automated gateway block across the entire organization with one click.",
    },
  ];

  const filteredGlossary = MOCK_GLOSSARY.filter(
    (g) =>
      g.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.plainEnglish.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-6 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-redrob-blue/15 border border-redrob-blue/30 flex items-center justify-center text-redrob-blue">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Knowledge Base &amp; Forensic Glossary
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Plain-English explanations of email authentication, spoofing vectors, and forensic terminology.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative font-sans text-xs">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search glossary terms (SPF, DKIM, Typosquatting, Relays)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#0b1026] border border-white/10 text-white placeholder-slate-500 focus:border-redrob-blue focus:outline-none focus:ring-1 focus:ring-redrob-blue/40 text-xs shadow-inner"
        />
      </div>

      {/* Plain English Glossary */}
      <div className="space-y-4 font-sans">
        <h3 className="text-xs font-bold uppercase tracking-wider text-redrob-blue font-mono">
          Cybersecurity Protocols in Plain English
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map((g, i) => (
            <div
              key={i}
              className="p-6 rounded-[24px] bg-[#0b1026] border border-white/10 shadow-redrob-card space-y-2.5 hover:border-redrob-blue/40 transition-all duration-300 spring-hover"
            >
              <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <Lock className="w-4 h-4 text-redrob-blue" />
                <span>{g.term}</span>
              </h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{g.plainEnglish}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="space-y-4 font-sans">
        <h3 className="text-xs font-bold uppercase tracking-wider text-redrob-blue font-mono">
          Frequently Asked Questions (FAQ)
        </h3>

        <div className="divide-y divide-white/5 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card overflow-hidden">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="p-5 sm:p-6 transition-all">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <span className="font-bold text-white text-sm group-hover:text-redrob-blue transition-colors">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-redrob-blue shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <p className="mt-3 text-xs text-slate-300 font-sans leading-relaxed animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
