import React, { useState } from "react";
import { ModuleResult } from "../types/report";

interface VideoTimelineProps {
  moduleResult?: ModuleResult;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({ moduleResult }) => {
  const [selectedFrameTime, setSelectedFrameTime] = useState<number>(4.2);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!moduleResult) {
    return (
      <div className="bg-[#11131a] border border-[#232736] rounded-xl p-6 text-center text-xs font-mono text-zinc-500">
        Video Forensics module was not triggered for this case.
      </div>
    );
  }

  const { verdict, risk_score, confidence, summary, scores, evidence, warnings, processing_ms } = moduleResult;

  // Sampled 1 fps frames across the 15s demonstration window
  const sampledFrames = [
    { time: 0.0, score: 0.15, flagged: false, label: "Baseline intro" },
    { time: 1.5, score: 0.22, flagged: false, label: "Normal lighting" },
    { time: 3.0, score: 0.48, flagged: false, label: "Subject motion" },
    { time: 4.2, score: 0.89, flagged: true, label: "Jaw Warp Artifact (Border Blurring)" },
    { time: 6.0, score: 0.35, flagged: false, label: "Static cut" },
    { time: 7.5, score: 0.42, flagged: false, label: "Head tilt" },
    { time: 9.6, score: 0.94, flagged: true, label: "Specular Iris & Teeth Mismatch" },
    { time: 11.0, score: 0.55, flagged: false, label: "Shadow transition" },
    { time: 13.0, score: 0.30, flagged: false, label: "Natural speech" },
    { time: 15.0, score: 0.25, flagged: false, label: "Terminal frame" }
  ];

  const currentFrame = sampledFrames.find((f) => f.time === selectedFrameTime) || sampledFrames[3];

  return (
    <div className="bg-[#11131a] border border-[#232736] rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="font-semibold text-white tracking-wide text-sm">Video Manipulation & Temporal Timeline</h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
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
          Enforced Bound: <span className="text-zinc-200">15s / 720p Max</span>
        </div>
      </div>

      {/* Frame Anomaly Timeline Scrubber */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center text-zinc-400">
          <span>Temporal Frame Sampling Strip (Click to Inspect Frame)</span>
          <span className="text-blue-400 font-semibold">
            Inspecting Frame @ {currentFrame.time.toFixed(1)}s ({currentFrame.label})
          </span>
        </div>

        {/* Interactive Timeline Bar */}
        <div className="relative h-16 bg-[#0a0c12] border border-zinc-800 rounded-lg p-2 flex items-center justify-between gap-1.5 overflow-x-auto">
          {sampledFrames.map((frame, idx) => {
            const isSelected = frame.time === selectedFrameTime;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedFrameTime(frame.time)}
                className={`flex-1 min-w-[50px] h-full rounded flex flex-col items-center justify-between py-1 transition relative ${
                  isSelected
                    ? "ring-2 ring-blue-500 bg-blue-950/60"
                    : frame.flagged
                    ? "bg-rose-950/30 hover:bg-rose-900/40"
                    : "bg-zinc-900/60 hover:bg-zinc-800"
                }`}
                title={`Frame ${frame.time}s: Score ${(frame.score * 100).toFixed(0)}%`}
              >
                <div
                  className={`w-full h-1.5 rounded-full ${
                    frame.score > 0.7
                      ? "bg-rose-500"
                      : frame.score > 0.4
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                <span className="text-[10px] text-zinc-400 font-bold">{frame.time}s</span>
                {frame.flagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#0a0c12]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sampled Keyframe Inspection Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frame SVG Canvas */}
        <div className="aspect-video bg-[#07080c] border border-zinc-800 rounded-lg p-3 flex flex-col items-center justify-center relative font-mono text-xs">
          <svg className="w-full h-full" viewBox="0 0 320 180">
            <rect width="320" height="180" fill="#0d0f17" rx="4" />
            <circle cx="160" cy="80" r="45" fill="#1e2230" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />
            {currentFrame.flagged ? (
              <>
                <rect x="110" y="35" width="100" height="90" fill="none" stroke="#ef4444" strokeWidth="2" />
                <text x="115" y="30" fill="#f87171" fontSize="9" fontFamily="monospace">
                  Temporal Warp Detected ({(currentFrame.score * 100).toFixed(0)}%)
                </text>
                <line x1="135" y1="105" x2="185" y2="105" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" />
              </>
            ) : (
              <text x="125" y="85" fill="#10b981" fontSize="10" fontFamily="monospace">
                Consistent Frame
              </text>
            )}
            <text x="115" y="150" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              {currentFrame.label}
            </text>
          </svg>
          <div className="absolute bottom-2 left-2 text-[10px] text-zinc-400 bg-black/70 px-2 py-0.5 rounded">
            Timecode: 00:0{currentFrame.time.toFixed(1)} / 00:15.0
          </div>
        </div>

        {/* Stream & Codec Metadata */}
        <div className="bg-[#0a0c12] border border-zinc-800 rounded-lg p-4 font-mono text-xs space-y-2.5">
          <h4 className="text-zinc-400 uppercase text-[11px] tracking-wide mb-1 font-semibold">
            ffprobe Stream Attributes
          </h4>
          <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-zinc-500">Video Stream Codec:</span>
            <span className="text-zinc-200">h264 (High) (avc1)</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-zinc-500">Resolution & Framerate:</span>
            <span className="text-zinc-200">1280x720 @ 29.97 fps</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-zinc-500">Audio Stream:</span>
            <span className="text-zinc-200">aac (LC), 44100 Hz, stereo</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-zinc-500">Temporal Face Jitter:</span>
            <span className="text-rose-400 font-bold">
              {scores?.temporal_variance_score ? `${(scores.temporal_variance_score * 100).toFixed(0)}% Variance` : "High"}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Evidentiary Flags */}
      <div className="space-y-2 font-mono text-xs border-t border-zinc-800/80 pt-4">
        <h4 className="uppercase text-zinc-400 tracking-wide font-semibold text-[11px]">
          Review-Worthy Video Clues ({evidence?.length || 0})
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
                    <span className="text-rose-400 font-bold">▸</span>
                    <span className="font-semibold text-zinc-200">{item.title}</span>
                    {item.timestamp_seconds !== null && item.timestamp_seconds !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-blue-300 border border-zinc-700">
                        {item.timestamp_seconds.toFixed(1)}s
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
