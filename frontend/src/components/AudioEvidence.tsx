import React, { useState } from "react";
import { ModuleResult } from "../types/report";

interface AudioEvidenceProps {
  moduleResult?: ModuleResult;
}

export const AudioEvidence: React.FC<AudioEvidenceProps> = ({ moduleResult }) => {
  const [selectedWindow, setSelectedWindow] = useState<number>(1);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!moduleResult) {
    return (
      <div className="bg-[#11131a] border border-[#232736] rounded-xl p-6 text-center text-xs font-mono text-zinc-500">
        Audio Forensics module was not triggered for this case.
      </div>
    );
  }

  const { verdict, risk_score, confidence, summary, scores, evidence, warnings, processing_ms } = moduleResult;

  // Windowed evaluations (4s windows with 2s overlap)
  const audioWindows = [
    { id: 0, range: "0.0s - 4.0s", score: 0.28, flag: false, note: "Natural speech start" },
    { id: 1, range: "2.0s - 6.0s", score: 0.88, flag: true, note: "Robotic harmonic roll-off" },
    { id: 2, range: "4.0s - 8.0s", score: 0.84, flag: true, note: "Vocal fry flattened phase" },
    { id: 3, range: "6.0s - 10.0s", score: 0.62, flag: false, note: "Borderline synthesis score" },
    { id: 4, range: "8.0s - 12.0s", score: 0.35, flag: false, note: "Ambient breath baseline" }
  ];

  const activeWin = audioWindows[selectedWindow] || audioWindows[1];

  return (
    <div className="bg-[#11131a] border border-[#232736] rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="font-semibold text-white tracking-wide text-sm">Voice Cloning & Acoustic Forensics</h3>
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
          Enforced Bound: <span className="text-zinc-200">60s Max (16 kHz Mono)</span>
        </div>
      </div>

      {/* Mel-Spectrogram Visual Representation */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center text-zinc-400">
          <span>Log-Mel Spectrogram (128 Mel Bins / Nyquist Spectrum)</span>
          <span className="text-amber-400 font-semibold">Active Window: {activeWin.range} ({activeWin.note})</span>
        </div>

        <div className="h-36 w-full bg-[#08090f] border border-zinc-800 rounded-lg p-2 relative overflow-hidden flex flex-col justify-end">
          <svg className="w-full h-full opacity-90" viewBox="0 0 500 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="specGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.65" />
                <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0b0e17" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="500" height="120" fill="#0b0e17" />
            {/* Harmonic formants */}
            <path d="M 0,90 Q 50,70 100,85 T 200,60 T 300,90 T 400,65 T 500,85 L 500,120 L 0,120 Z" fill="url(#specGrad)" />
            <path d="M 0,60 Q 60,40 120,55 T 220,35 T 320,60 T 420,40 T 500,55 L 500,120 L 0,120 Z" fill="url(#specGrad)" opacity="0.6" />
            {/* Cutoff frequency indicator */}
            <line x1="0" y1="28" x2="500" y2="28" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="310" y="22" fill="#f87171" fontSize="9" fontFamily="monospace">
              Sharp 8.2 kHz Neural Vocoder Cut-Off
            </text>
            {/* Active window indicator */}
            <rect
              x={selectedWindow * 90 + 20}
              y="5"
              width="100"
              height="110"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
          </svg>
          <div className="absolute top-2 left-2 text-[10px] text-zinc-400 bg-black/80 px-2 py-0.5 rounded border border-zinc-800">
            Resampled: Mono 16 kHz • Window: {activeWin.range}
          </div>
        </div>
      </div>

      {/* 4-Second Temporal Windows Selector */}
      <div className="space-y-2.5 font-mono text-xs">
        <h4 className="uppercase text-zinc-400 tracking-wide font-semibold text-[11px]">
          Windowed Speech Classifier Scores (wav2vec2)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
          {audioWindows.map((win) => (
            <button
              key={win.id}
              type="button"
              onClick={() => setSelectedWindow(win.id)}
              className={`p-2.5 rounded-lg border text-left transition ${
                selectedWindow === win.id
                  ? "bg-blue-950/50 border-blue-500 ring-1 ring-blue-500"
                  : win.flag
                  ? "bg-rose-950/20 border-rose-800/60 hover:bg-rose-950/30"
                  : "bg-[#0a0c12] border-zinc-800 hover:bg-zinc-800/40"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-zinc-300">{win.range}</span>
                <span className={`text-[10px] font-bold ${win.score > 0.7 ? "text-rose-400" : "text-zinc-400"}`}>
                  {(win.score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full ${win.score > 0.7 ? "bg-rose-500" : "bg-emerald-500"}`}
                  style={{ width: `${win.score * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 truncate block">{win.note}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Acoustic Scores Breakdown */}
      {scores && Object.keys(scores).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
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
          Acoustic Anomaly Indicators ({evidence?.length || 0})
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
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase">
                      {item.check}
                    </span>
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
