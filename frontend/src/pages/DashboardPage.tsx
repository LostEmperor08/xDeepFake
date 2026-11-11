import React from 'react';
import {
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  Cpu,
  Layers,
  ArrowRight,
  Fingerprint,
  Activity,
  Terminal,
} from 'lucide-react';

interface DashboardPageProps {
  onStartAnalysis: () => void;
  onViewMethodology: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartAnalysis,
  onViewMethodology,
}) => {
  const modalities = [
    {
      title: 'Image Forensics',
      modality: 'image',
      icon: ImageIcon,
      description:
        'Raster headers, spatial frequency (FFT/DCT), Error Level Analysis (ELA), and PRNU sensor noise pattern identification.',
      formats: 'JPG, PNG, WEBP',
      status: 'Phase 1 Ingest Ready',
    },
    {
      title: 'Video Forensics',
      modality: 'video',
      icon: Video,
      description:
        'Container atom consistency, temporal facial landmark jitter, optical flow continuity, and frame-boundary compression artifacts.',
      formats: 'MP4, MOV, AVI, MKV',
      status: 'Phase 1 Ingest Ready',
    },
    {
      title: 'Audio Forensics',
      modality: 'audio',
      icon: Mic,
      description:
        'Voice clone detection, linear frequency cepstral analysis (LFCC), vocoder phase discontinuities, and acoustic environment coherence.',
      formats: 'WAV, MP3, FLAC',
      status: 'Phase 1 Ingest Ready',
    },
    {
      title: 'Document Forensics',
      modality: 'document',
      icon: FileText,
      description:
        'PDF object stream inspection, font embedding discrepancies, synthetic layout generation, and incremental revision tampering.',
      formats: 'PDF',
      status: 'Phase 1 Ingest Ready',
    },
  ];

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Phase 1 Foundation Initialized & Verified
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight font-sans leading-tight">
            Multimodal Synthetic Media Forensics & Authenticity
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            DEEPFAKE X inspects images, video, audio, and PDF documents. It extracts verifiable
            cryptographic provenance, identifies suspicious generation artifacts, and synthesizes
            calibrated, explainable forensic reports.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartAnalysis}
              className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>Ingest & Verify Artifact</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onViewMethodology}
              className="px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Inspection Architecture</span>
            </button>
          </div>
        </div>
      </section>

      {/* Multimodal Inspection Subsystems */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Multimodal Forensic Subsystems
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Standardized forensic modules engineered for independent inspection and cross-modal correlation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modalities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.description}</p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Supported Formats:</span>
                  <span className="text-slate-300">{item.formats}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <Fingerprint className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">Decoupled Confidence Scoring</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Neural network raw scores are never displayed as absolute probabilities. Aggregate risk levels
            are calculated via calibrated multi-modal evidence synthesis.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
            <Activity className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">Explainable Findings</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every identified anomaly is tied to concrete empirical evidence, source layers, and human-readable
            forensic rationales rather than opaque binary classifications.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
            <Terminal className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">Defensive Validation</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ingestion strictly verifies binary magic headers, enforces size thresholds, sanitizes file paths,
            and runs inside isolated temporary sandbox directories.
          </p>
        </div>
      </section>
    </div>
  );
};
