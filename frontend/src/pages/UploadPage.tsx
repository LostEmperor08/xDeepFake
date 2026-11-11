import React, { useState, useRef } from 'react';
import { api } from '../api/client';
import type { AnalysisReport } from '../types/forensic';
import { formatBytes } from '../utils/formatters';
import {
  UploadCloud,
  FileCheck,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Loader2,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface UploadPageProps {
  onReportGenerated: (report: AnalysisReport) => void;
}

const SUPPORTED_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'mp4',
  'mov',
  'avi',
  'mkv',
  'wav',
  'mp3',
  'flac',
  'pdf',
];

const MAX_SIZE_MB = 50;

const ANALYSIS_PIPELINE_STAGES = [
  'Ingesting media and computing SHA-256 cryptographic digest...',
  'Verifying binary container headers and magic byte signatures...',
  'Routing artifact to primary forensic modality subsystem...',
  'Inspecting spatial/spectral layers and metadata streams...',
  'Synthesizing calibrated findings and compiling forensic report...',
];

export const UploadPage: React.FC<UploadPageProps> = ({ onReportGenerated }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !SUPPORTED_EXTENSIONS.includes(ext)) {
      return `File type '.${ext || 'unknown'}' is unsupported. Allowed formats: ${SUPPORTED_EXTENSIONS.join(
        ', '
      )}`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File exceeds maximum upload limit of ${MAX_SIZE_MB}MB (${formatBytes(file.size)}).`;
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setCurrentStageIdx(0);
    setUploadPercent(0);

    // Simulate multi-stage progression visualizer
    const stageInterval = setInterval(() => {
      setCurrentStageIdx((prev) => (prev < ANALYSIS_PIPELINE_STAGES.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const response = await api.analyzeMedia(selectedFile, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadPercent(percent);
        }
      });

      clearInterval(stageInterval);
      setCurrentStageIdx(ANALYSIS_PIPELINE_STAGES.length - 1);

      if (response.report) {
        // Brief pause to allow the user to see the complete stage
        setTimeout(() => {
          onReportGenerated(response.report!);
        }, 500);
      } else {
        throw new Error('Analysis completed without report generation.');
      }
    } catch (err: unknown) {
      clearInterval(stageInterval);
      setIsUploading(false);
      if (err && typeof err === 'object' && 'response' in err) {
        const axErr = err as { response?: { data?: { error?: { message?: string } } } };
        setErrorMessage(
          axErr.response?.data?.error?.message || 'Failed to analyze artifact. Server returned an error.'
        );
      } else {
        setErrorMessage((err as Error).message || 'Network error or server unreachable.');
      }
    }
  };

  const getFormatIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return <ImageIcon className="w-5 h-5 text-cyan-400" />;
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext || '')) return <Video className="w-5 h-5 text-purple-400" />;
    if (['wav', 'mp3', 'flac'].includes(ext || '')) return <Mic className="w-5 h-5 text-amber-400" />;
    if (ext === 'pdf') return <FileText className="w-5 h-5 text-rose-400" />;
    return <FileCheck className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-3">
          <UploadCloud className="w-7 h-7 text-cyan-400" />
          Artifact Ingestion & Forensic Intake
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Upload suspect media files to perform binary verification, layer extraction, and multi-modal evidence correlation.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 flex items-start gap-3 text-rose-300 text-xs animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Ingestion Blocked</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      {!isUploading ? (
        <div className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all p-10 sm:p-14 text-center cursor-pointer flex flex-col items-center justify-center gap-4 ${
              dragOver
                ? 'border-cyan-400 bg-cyan-950/20 shadow-xl shadow-cyan-500/10'
                : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.avi,.mkv,.wav,.mp3,.flac,.pdf"
            />

            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm sm:text-base font-semibold text-slate-200">
                Drag and drop media artifact here, or <span className="text-cyan-400 underline">browse files</span>
              </p>
              <p className="text-xs text-slate-500">
                Supports Images, Videos, Audio recordings, and PDF documents up to {MAX_SIZE_MB}MB
              </p>
            </div>

            {/* Formats Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 max-w-lg">
              {['JPG', 'PNG', 'WEBP', 'MP4', 'MOV', 'AVI', 'MKV', 'WAV', 'MP3', 'FLAC', 'PDF'].map((fmt) => (
                <span
                  key={fmt}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* Selected File Card */}
          {selectedFile && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                  {getFormatIcon(selectedFile.name)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 font-mono break-all">
                    {selectedFile.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <span>{formatBytes(selectedFile.size)}</span>
                    <span>&bull;</span>
                    <span>{selectedFile.type || 'binary/octet-stream'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={startAnalysis}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>Dispatch Forensic Ingest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Sandbox Security Notice */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 text-xs text-slate-400 flex items-start gap-3 font-mono">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 font-sans">
              <span className="font-semibold text-slate-300 font-mono text-[11px] block">
                Sandbox Environment Guarantee
              </span>
              <p className="text-[11px] text-slate-400">
                Uploaded artifacts are held in transient isolated memory/temp filesystem, verified for binary header integrity,
                and securely purged after feature extraction.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Progress & Pipeline Execution View */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 sm:p-10 space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Executing Forensic Inspection Pipeline
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Artifact: {selectedFile?.name} ({formatBytes(selectedFile?.size || 0)})
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>
                Pipeline Stage {currentStageIdx + 1} of {ANALYSIS_PIPELINE_STAGES.length}
                {uploadPercent > 0 && uploadPercent < 100 ? ` (Ingesting: ${uploadPercent}%)` : ''}
              </span>
              <span className="text-cyan-400">
                {Math.round(((currentStageIdx + 1) / ANALYSIS_PIPELINE_STAGES.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(((currentStageIdx + 1) / ANALYSIS_PIPELINE_STAGES.length) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Real-time Stage Timeline */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs space-y-3">
            {ANALYSIS_PIPELINE_STAGES.map((stageText, idx) => {
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              return (
                <div
                  key={stageText}
                  className={`flex items-start gap-2.5 transition-opacity ${
                    isCurrent
                      ? 'text-cyan-300 font-medium'
                      : isPast
                      ? 'text-slate-500'
                      : 'text-slate-700 opacity-50'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 shrink-0 animate-spin mt-0.5" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{stageText}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
