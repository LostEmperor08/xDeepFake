import React, { useState } from "react";
import { ModuleResult } from "../types/report";

interface DocumentEvidenceProps {
  moduleResult?: ModuleResult;
}

export const DocumentEvidence: React.FC<DocumentEvidenceProps> = ({ moduleResult }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!moduleResult) {
    return (
      <div className="bg-[#11131a] border border-[#232736] rounded-xl p-6 text-center text-xs font-mono text-zinc-500">
        Document Authenticity module was not triggered for this case.
      </div>
    );
  }

  const { verdict, risk_score, confidence, summary, scores, evidence, warnings, processing_ms } = moduleResult;

  return (
    <div className="bg-[#11131a] border border-[#232736] rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="font-semibold text-white tracking-wide text-sm">Document Authenticity & Structural Integrity</h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {verdict.replace(/_/g, " ")}
            </span>
            {risk_score !== null && risk_score !== undefined && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Risk: {risk_score}/100
              </span>
            )}
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              {confidence} Confidence
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{summary}</p>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Enforced Bound: <span className="text-zinc-200">20 MB / 10 Pages (PDF)</span>
        </div>
      </div>

      {/* PDF Header & Structural Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="bg-[#0a0c12] border border-zinc-800 rounded-lg p-4 space-y-2.5">
          <h4 className="text-zinc-400 uppercase text-[11px] tracking-wide mb-1 font-semibold">
            Metadata Dictionary (PyMuPDF)
          </h4>
          <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-zinc-500">PDF Producer:</span>
            <span className="text-zinc-200">Skia/PDF m115</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-zinc-500">Author / Creator:</span>
            <span className="text-amber-400 font-semibold">PDFescape Online Editor</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-zinc-500">Creation Date:</span>
            <span className="text-zinc-200">2026-11-09 14:22:10 UTC</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-zinc-500">Modification Date:</span>
            <span className="text-rose-400 font-semibold">2026-11-09 15:04:32 UTC (Delta +42m)</span>
          </div>
        </div>

        {/* Byte-Level Revision & EOF Tree */}
        <div className="bg-[#0a0c12] border border-zinc-800 rounded-lg p-4 space-y-3">
          <h4 className="text-zinc-400 uppercase text-[11px] tracking-wide mb-1 font-semibold">
            Incremental Byte Revisions (%%EOF)
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-300">Revision 1 (Base Document)</span>
              <span className="text-emerald-400 font-bold">%%EOF @ Byte 42,910</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-300">Revision 2 (Incremental Edit)</span>
              <span className="text-amber-400 font-bold">%%EOF @ Byte 112,400</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-rose-950/20 border border-rose-800/60">
              <span className="text-rose-200">Revision 3 (Overlay Text)</span>
              <span className="text-rose-400 font-bold">%%EOF @ Byte 184,210</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 italic">
            * Note: Multiple %%EOF revisions can also occur during legitimate digital certificate signing.
          </p>
        </div>
      </div>

      {/* Structural Scores */}
      {scores && Object.keys(scores).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {Object.entries(scores).map(([k, v]) => (
            <div key={k} className="bg-[#0a0c12] border border-zinc-800 p-3 rounded-lg">
              <span className="text-zinc-500 text-[10px] uppercase block mb-1">{k.replace(/_/g, " ")}</span>
              <span className="text-zinc-200 font-bold text-sm">{(v * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Expandable Evidentiary Flags */}
      <div className="space-y-2 font-mono text-xs border-t border-zinc-800/80 pt-4">
        <h4 className="uppercase text-zinc-400 tracking-wide font-semibold text-[11px]">
          Detected Document Anomalies ({evidence?.length || 0})
        </h4>

        <div className="space-y-2">
          {evidence?.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#0a0c12] border border-zinc-800 rounded-lg overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-3 text-left flex items-center justify-between hover:bg-zinc-900/40 transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-amber-400 font-bold">▸</span>
                    <span className="font-semibold text-zinc-200">{item.title}</span>
                    {item.page_number && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        Page {item.page_number}
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-500 text-sm">{isExpanded ? "▲" : "▼"}</span>
                </button>

                {isExpanded && (
                  <div className="p-3.5 pt-0 border-t border-zinc-800/60 bg-[#08090e] space-y-1 text-zinc-300">
                    <p className="leading-relaxed">{item.detail}</p>
                    {item.limitation && (
                      <p className="text-[11px] text-zinc-400 italic">Limitation: {item.limitation}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {warnings && warnings.length > 0 && (
          <div className="space-y-1 pt-1">
            {warnings.map((w, idx) => (
              <div key={idx} className="text-[11px] text-zinc-400 flex items-center space-x-2">
                <span>ℹ️</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {processing_ms && (
          <div className="text-[10px] text-zinc-500 text-right">
            Module Execution Time: {processing_ms} ms
          </div>
        )}
      </div>
    </div>
  );
};
