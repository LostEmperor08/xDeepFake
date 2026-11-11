import React, { useState } from 'react';
import type { AnalysisReport } from '../types/forensic';
import { RiskBadge } from '../components/RiskBadge';
import { ModuleResultCard } from '../components/ModuleResultCard';
import { formatBytes, formatDate } from '../utils/formatters';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Layers,
  Code,
  Info,
  Binary,
} from 'lucide-react';

interface ReportPageProps {
  report: AnalysisReport;
  onReset: () => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({ report, onReset }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeTab, setActiveTab] = useState<'modules' | 'raw_json'>('modules');

  const copyHash = () => {
    navigator.clipboard.writeText(report.file_info.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const downloadJson = () => {
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepfake_x_report_${report.report_id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const moduleList = Object.values(report.modules);

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Explainable Forensic Report
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-xs font-mono text-slate-400">ID: {report.report_id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans">
            Forensic Assessment Synthesis
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={downloadJson}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onReset}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold tracking-wide uppercase transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Inspection</span>
          </button>
        </div>
      </div>

      {/* Holistic Risk Assessment & File Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Executive Verdict Card */}
        <div className="lg:col-span-1 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Threat Classification
              </span>
              <RiskBadge level={report.overall.risk_level} size="md" />
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl sm:text-5xl font-black font-mono text-slate-100">
                  {report.overall.risk_score.toFixed(0)}
                </span>
                <span className="text-sm font-mono text-slate-500">/ 100</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Calibrated Risk Score
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-200 block">
                {report.overall.authenticity_assessment}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {report.overall.summary}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>AI model confidences are isolated from holistic risk evaluation.</span>
          </div>
        </div>

        {/* File Ingestion Metadata Card */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-300 flex items-center gap-2">
              <Binary className="w-4 h-4 text-cyan-400" />
              Artifact Ingestion Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Filename</span>
                <span className="text-slate-200 font-semibold break-all">
                  {report.file_info.filename}
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Size & Modality</span>
                <span className="text-slate-200">
                  {formatBytes(report.file_info.size_bytes)} ({report.file_info.modality.toUpperCase()})
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">MIME Content Type</span>
                <span className="text-slate-200">{report.file_info.mime_type}</span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Ingest Timestamp</span>
                <span className="text-slate-200">{formatDate(report.created_at)}</span>
              </div>
            </div>

            {/* SHA-256 Digest */}
            <div className="bg-slate-950/90 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
              <div className="overflow-hidden">
                <span className="text-[11px] font-mono text-slate-500 block">
                  SHA-256 Cryptographic Hash
                </span>
                <span className="text-xs font-mono text-cyan-300 truncate block">
                  {report.file_info.sha256}
                </span>
              </div>
              <button
                onClick={copyHash}
                className="shrink-0 p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy SHA-256 Hash"
              >
                {copiedHash ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
            {report.disclaimer}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium transition-colors ${
            activeTab === 'modules'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Forensic Subsystems ({moduleList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('raw_json')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium transition-colors ${
            activeTab === 'raw_json'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Raw Structured JSON</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'modules' ? (
        <div className="space-y-4">
          {moduleList.map((mod) => (
            <ModuleResultCard key={mod.module} result={mod} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <pre className="text-xs font-mono text-slate-300 overflow-x-auto max-h-[600px] leading-relaxed">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
