import React, { useState } from 'react';
import type { ModuleResult } from '../types/forensic';
import { RiskBadge } from './RiskBadge';
import { EvidenceCard } from './EvidenceCard';
import { FindingCard } from './FindingCard';
import { getModalityLabel } from '../utils/formatters';
import {
  Clock,
  AlertTriangle,
  Info,
  Cpu,
  Layers,
} from 'lucide-react';

interface ModuleResultCardProps {
  result: ModuleResult;
}

export const ModuleResultCard: React.FC<ModuleResultCardProps> = ({ result }) => {
  const [openSection, setOpenSection] = useState<'findings' | 'evidence' | 'limitations' | null>(
    result.findings.length > 0 ? 'findings' : null
  );

  const isStub = result.status === 'analysis_not_implemented';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-bold text-slate-100">
              {getModalityLabel(result.modality)}
            </h3>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {result.module}
            </span>
            {isStub ? (
              <span className="text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                Phase 1 Baseline (ML Pending)
              </span>
            ) : (
              <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                Active Analysis
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge level={result.risk_level} size="sm" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 mb-4 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">Execution Status</span>
          <span className="font-mono text-slate-200 capitalize">
            {result.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px]">Detector Metric</span>
          <span className="font-mono text-cyan-400">
            {result.model_confidence !== null && result.model_confidence !== undefined
              ? `${(result.model_confidence * 100).toFixed(1)}% (Raw)`
              : 'N/A (Phase 1)'}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px]">Identified Findings</span>
          <span className="font-mono text-slate-200">{result.findings.length} indicators</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3" /> Processing Time
          </span>
          <span className="font-mono text-slate-200">{result.processing_time_ms} ms</span>
        </div>
      </div>

      {/* Accordion Controls */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3 text-xs">
        <button
          onClick={() => setOpenSection(openSection === 'findings' ? null : 'findings')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
            openSection === 'findings'
              ? 'bg-slate-800 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Findings ({result.findings.length})
        </button>

        <button
          onClick={() => setOpenSection(openSection === 'evidence' ? null : 'evidence')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
            openSection === 'evidence'
              ? 'bg-slate-800 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Evidence Items ({result.evidence.length})
        </button>

        <button
          onClick={() => setOpenSection(openSection === 'limitations' ? null : 'limitations')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
            openSection === 'limitations'
              ? 'bg-slate-800 text-cyan-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          Limitations ({result.limitations.length})
        </button>
      </div>

      {/* Accordion Content */}
      <div className="space-y-3">
        {openSection === 'findings' && (
          <div className="space-y-2 animate-fadeIn">
            {result.findings.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No suspicious indicators flagged by this subsystem.
              </p>
            ) : (
              result.findings.map((f) => <FindingCard key={f.id} finding={f} />)
            )}
          </div>
        )}

        {openSection === 'evidence' && (
          <div className="space-y-2 animate-fadeIn">
            {result.evidence.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No granular evidence points logged for this module.
              </p>
            ) : (
              result.evidence.map((ev) => <EvidenceCard key={ev.id} evidence={ev} />)
            )}
          </div>
        )}

        {openSection === 'limitations' && (
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 animate-fadeIn">
            <h5 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Known Module Constraints & Future Scope
            </h5>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
              {result.limitations.map((limit, idx) => (
                <li key={idx} className="leading-relaxed">
                  {limit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
