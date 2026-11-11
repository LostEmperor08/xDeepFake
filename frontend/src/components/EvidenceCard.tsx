import React from 'react';
import type { Evidence } from '../types/forensic';
import { Database, Binary } from 'lucide-react';

interface EvidenceCardProps {
  evidence: Evidence;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3.5 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400 shrink-0" />
          <h4 className="text-sm font-semibold text-slate-200">{evidence.label}</h4>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">
          <Binary className="w-3 h-3" />
          {evidence.source_layer}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-2 leading-relaxed">
        {evidence.description}
      </p>

      {evidence.confidence !== null && evidence.confidence !== undefined && (
        <div className="flex items-center gap-2 mb-2 text-xs">
          <span className="text-slate-500 font-mono">Detector Metric:</span>
          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, evidence.confidence * 100))}%` }}
            />
          </div>
          <span className="text-cyan-400 font-mono text-[11px]">
            {(evidence.confidence * 100).toFixed(1)}%
          </span>
        </div>
      )}

      {evidence.metadata && Object.keys(evidence.metadata).length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-800/80">
          <pre className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded overflow-x-auto max-h-32">
            {JSON.stringify(evidence.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
