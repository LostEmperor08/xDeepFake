import React from "react";
import { FileUpload } from "../components/FileUpload";
import { AnalysisProgress } from "../components/AnalysisProgress";

interface DashboardProps {
  onAnalyze: (files: File[], isBundle: boolean, bundleLabel?: string) => void;
  isLoading: boolean;
  currentStage: string;
  jobId?: string;
  onCancelJob: () => void;
  onLoadSampleDemo: () => void;
  errorMessage: string | null;
  onRetry: () => void;
  onDismissError: () => void;
  onEnableMockAndRetry: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onAnalyze,
  isLoading,
  currentStage,
  jobId,
  onCancelJob,
  onLoadSampleDemo,
  errorMessage,
  onRetry,
  onDismissError,
  onEnableMockAndRetry
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Minimalist Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Multimodal Synthetic Media Forensics
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          One platform. Four media types. Multiple forensic signals. One explainable investigation report.
        </p>
      </div>

      {/* Prominent Inline Error Panel with Retry Option (No alert dialogs) */}
      {errorMessage && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-5 shadow-xl font-mono text-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 text-rose-300 font-bold text-sm">
              <span>⚠️</span>
              <span>Forensic Analysis Error</span>
            </div>
            <button
              type="button"
              onClick={onDismissError}
              className="text-zinc-500 hover:text-zinc-300 font-mono text-base"
              title="Dismiss error"
            >
              &times;
            </button>
          </div>

          <p className="text-rose-200/90 leading-relaxed bg-[#0a0c12]/60 p-3 rounded border border-rose-900/50">
            {errorMessage}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-zinc-400">
              Need to present immediately without backend? You can switch to Offline Demo Mode.
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onRetry}
                className="px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium transition"
              >
                Retry Analysis
              </button>
              <button
                type="button"
                onClick={onEnableMockAndRetry}
                className="px-3.5 py-1.5 rounded bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/50 text-amber-200 transition"
              >
                Enable Mock Mode & Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Upload Dropzone or Live Progress */}
      {isLoading ? (
        <AnalysisProgress
          currentStage={currentStage}
          jobId={jobId}
          onCancel={onCancelJob}
        />
      ) : (
        <div className="space-y-6">
          <FileUpload onAnalyze={onAnalyze} disabled={isLoading} />

          {/* Quick Demo Shortcuts for Hackathon Judges */}
          <div className="bg-[#11131a] border border-[#232736] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2 text-zinc-400">
              <span>⚡</span>
              <span>Fast-track judging demo (Zero-Latency):</span>
            </div>
            <button
              type="button"
              onClick={onLoadSampleDemo}
              className="px-3.5 py-1.5 rounded bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white transition font-mono font-medium"
            >
              Load Staged Multi-Modal Case (Demo Fixture)
            </button>
          </div>
        </div>
      )}

      {/* Feature Pillar Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        <div className="bg-[#11131a]/60 border border-zinc-800/80 p-3.5 rounded-lg text-center font-mono">
          <span className="text-base block mb-1">🖼️</span>
          <span className="text-xs font-semibold text-zinc-200 block">AI Image / ELA</span>
          <span className="text-[10px] text-zinc-500">EXIF & Error Levels</span>
        </div>
        <div className="bg-[#11131a]/60 border border-zinc-800/80 p-3.5 rounded-lg text-center font-mono">
          <span className="text-base block mb-1">🎬</span>
          <span className="text-xs font-semibold text-zinc-200 block">Video Forensics</span>
          <span className="text-[10px] text-zinc-500">Temporal 1fps Scrub</span>
        </div>
        <div className="bg-[#11131a]/60 border border-zinc-800/80 p-3.5 rounded-lg text-center font-mono">
          <span className="text-base block mb-1">🎵</span>
          <span className="text-xs font-semibold text-zinc-200 block">Voice Cloning</span>
          <span className="text-[10px] text-zinc-500">Log-Mel Spectrogram</span>
        </div>
        <div className="bg-[#11131a]/60 border border-zinc-800/80 p-3.5 rounded-lg text-center font-mono">
          <span className="text-base block mb-1">📄</span>
          <span className="text-xs font-semibold text-zinc-200 block">PDF Authenticity</span>
          <span className="text-[10px] text-zinc-500">%%EOF Revision Tree</span>
        </div>
      </div>
    </div>
  );
};
