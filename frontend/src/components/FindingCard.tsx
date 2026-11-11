import React, { useState } from 'react';
import type { Finding } from '../types/forensic';
import { RiskBadge } from './RiskBadge';
import { AlertCircle, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';

interface FindingCardProps {
  finding: Finding;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="text-sm font-semibold text-slate-100">{finding.title}</h4>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {finding.category}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{finding.description}</p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <RiskBadge level={finding.risk_level} size="sm" />
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Toggle forensic explanation"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5 text-xs animate-fadeIn">
          <div className="bg-slate-950/70 p-3 rounded border border-slate-800">
            <span className="text-cyan-400 font-mono text-[11px] uppercase tracking-wider block mb-1">
              Forensic Rationale
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">{finding.explanation}</p>
          </div>

          {finding.evidence_refs && finding.evidence_refs.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Correlated Evidence IDs:</span>
              <div className="flex gap-1.5 flex-wrap font-mono">
                {finding.evidence_refs.map((ref) => (
                  <span key={ref} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
