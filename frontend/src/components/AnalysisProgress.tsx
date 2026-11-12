import React from "react";

interface AnalysisProgressProps {
  currentStage: string;
  jobId?: string;
  onCancel?: () => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  currentStage,
  jobId,
  onCancel
}) => {
  const PIPELINE_STAGES = [
    { title: "Upload & Payload Decoding", description: "Verifying file headers and calculating SHA-256 digests" },
    { title: "EXIF & Stream Descriptors", description: "Reading metadata, orientation, and container attributes" },
    { title: "Classical Forensic Checks", description: "Evaluating ELA heatmaps, audio spectrograms, and PDF xrefs" },
    { title: "Pretrained AI Models", description: "Running ViT, CNN detectors, and wav2vec2 speech classifiers" },
    { title: "Cross-Modal Corroboration", description: "Comparing track duration deltas and timestamp consistency" },
    { title: "Report & Triage Synthesis", description: "Aggregating evidence, confidence, and triage risk metrics" }
  ];

  const getStageIndex = (stageText: string): number => {
    const lower = stageText.toLowerCase();
    if (lower.includes("upload") || lower.includes("header") || lower.includes("initializ")) return 0;
    if (lower.includes("decod") || lower.includes("hash") || lower.includes("descriptor") || lower.includes("exif")) return 1;
    if (lower.includes("extract") || lower.includes("forensic") || lower.includes("ela") || lower.includes("spectrogram") || lower.includes("pymupdf")) return 2;
    if (lower.includes("model") || lower.includes("classifier") || lower.includes("infer") || lower.includes("ai")) return 3;
    if (lower.includes("cross") || lower.includes("modal") || lower.includes("sync") || lower.includes("corroborat")) return 4;
    return 5;
  };

  const activeIdx = getStageIndex(currentStage);

  return (
    <div className="bg-[#11131a] border border-[#232736] rounded-xl p-8 max-w-2xl mx-auto shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h3 className="font-semibold text-white tracking-wide text-sm flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping inline-block"></span>
            <span>Forensic Triage in Progress</span>
          </h3>
          {jobId && (
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Job Reference: <span className="text-blue-300 font-semibold">{jobId}</span>
            </p>
          )}
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-zinc-400 hover:text-rose-400 font-mono transition border border-zinc-800 hover:border-rose-900/60 px-2.5 py-1 rounded"
          >
            Cancel Job
          </button>
        )}
      </div>

      {/* Active Phase Callout */}
      <div className="bg-[#0a0c12] border border-blue-900/40 rounded-lg p-4 text-center">
        <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block mb-1">
          Active Forensic Stage
        </span>
        <span className="text-sm font-mono text-zinc-200 font-medium">
          {currentStage || "Executing pipeline..."}
        </span>
      </div>

      {/* Stage-by-Stage Forensic Pipeline List */}
      <div className="space-y-2.5 font-mono text-xs">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={idx}
              className={`flex items-start justify-between p-3 rounded-lg border transition ${
                isCurrent
                  ? "bg-blue-950/30 border-blue-600/70 text-blue-200"
                  : isDone
                  ? "bg-zinc-900/50 border-zinc-800/80 text-zinc-300"
                  : "bg-transparent border-zinc-800/30 text-zinc-600"
              }`}
            >
              <div className="flex items-start space-x-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white animate-pulse"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {isDone ? "✓" : idx + 1}
                </span>
                <div>
                  <div className="font-semibold text-zinc-200">{stage.title}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{stage.description}</div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono shrink-0 ml-2">
                {isDone ? (
                  <span className="text-emerald-400">Complete</span>
                ) : isCurrent ? (
                  <span className="text-blue-400">Active</span>
                ) : (
                  <span className="text-zinc-600">Pending</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-zinc-800/80 text-center text-[11px] text-zinc-500 font-mono">
        Multi-modal subsystems run with failure-isolation: partial results will be preserved if a single module fails.
      </div>
    </div>
  );
};
