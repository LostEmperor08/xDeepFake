import React from 'react';
import {
  Layers,
  Fingerprint,
  GitBranch,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const roadmapPhases = [
    {
      phase: 'Phase 1',
      title: 'Repository Architecture & Ingestion Baseline',
      status: 'Implemented & Verified',
      current: true,
      items: [
        'Modular REST API foundation using FastAPI & Pydantic v2',
        'Strict binary magic-byte validation and container integrity checks',
        'Safe temporary filesystem isolation with UUID namespaces',
        'Streaming SHA-256 cryptographic digest computation',
        'Standardized forensic report schema (Evidence, Findings, ModuleResult)',
        'Decoupled model confidence vs holistic risk scoring architecture',
        'Dark forensic cybersecurity UI in React, TypeScript & Tailwind CSS',
      ],
    },
    {
      phase: 'Phase 2',
      title: 'Classical Digital Signal Processing & Header Forensics',
      status: 'Scheduled',
      current: false,
      items: [
        'Spatial Frequency Analysis (2D-FFT & DCT residual spectral anomalies)',
        'Error Level Analysis (ELA) with configurable quantization matrices',
        'PRNU sensor noise pattern extraction across homogeneous camera frames',
        'PyMuPDF object stream parsing and font embedding verification',
        'Librosa spectral flux and linear frequency cepstral coefficients (LFCC)',
        'EXIF, XMP and IPTC tampering history correlation',
      ],
    },
    {
      phase: 'Phase 3',
      title: 'Deep Neural Detectors & Pretrained FSD Models',
      status: 'Scheduled',
      current: false,
      items: [
        'Integration of pretrained Frequency-Spectrum Diffusion (FSD) detectors',
        'Diffusion model latent space footprint identification',
        'Facial landmark temporal jitter & boundary blending models',
        'Audio neural vocoder footprint extraction and voice clone classification',
        'Cross-modal Audio-Visual LipSync (AV-Sync) alignment tracking',
      ],
    },
    {
      phase: 'Phase 4',
      title: 'C2PA Manifest Cryptography & Enterprise Integration',
      status: 'Scheduled',
      current: false,
      items: [
        'Content Authenticity Initiative (CAI) / C2PA cryptographic signature verification',
        'Ledger-backed provenance cross-checking',
        'PDF certified forensic export with digital signing',
        'Asynchronous task queuing via Celery / Redis for large batch workflows',
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-12 animate-fadeIn">
      {/* Title */}
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-1">
          Forensic Framework & Philosophy
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-sans">
          Forensic Methodology & Architecture
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          DEEPFAKE X is engineered around the principle that media forensics cannot rely on uncalibrated,
          black-box neural classification. It correlates low-level physical signals, metadata provenance,
          and multimodal consistency into explainable indicators.
        </p>
      </div>

      {/* The Core Principle: Why Decoupled Scoring Matters */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-cyan-400" />
          The Probabilistic Pitfall: Decoupled Confidence Scoring
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Most deepfake detectors output an uncalibrated sigmoid activation value (e.g. 0.94) and label it as a
          "94% probability of deepfake". In reality, neural network outputs on out-of-distribution media
          (such as compressed social media uploads or varying lighting) frequently exhibit severe overconfidence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              1. Raw Model Metrics (Isolated)
            </span>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Individual detector outputs are captured as raw numerical observations with explicit limitations,
              rather than legal claims.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              2. Calibrated Holistic Risk
            </span>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Overall risk scores are derived by synthesizing multiple orthogonal forensic layers:
              file structure, spatial frequencies, temporal coherence, and provenance metadata.
            </p>
          </div>
        </div>
      </section>

      {/* The 6-Layer Forensic Architecture */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            The 6-Layer Forensic Inspection Framework
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Every submitted artifact traverses standardized forensic evaluation layers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: '1. Ingestion & Container',
              desc: 'SHA-256 cryptographic hashing, MIME validation, and magic byte header verification.',
            },
            {
              title: '2. Provenance & C2PA',
              desc: 'Cryptographic C2PA manifests, EXIF/XMP editing history, and camera quantization markers.',
            },
            {
              title: '3. Frequency Domain',
              desc: '2D-FFT, DCT quantization anomaly discovery, and high-frequency spectral residuals.',
            },
            {
              title: '4. Physical & Spatial',
              desc: 'Lighting vector coherence, face-swap blending boundaries, and PRNU sensor noise matching.',
            },
            {
              title: '5. Temporal & Acoustic',
              desc: 'Optical flow consistency, lip-sync audio-visual coherence, and vocoder spectral footprints.',
            },
            {
              title: '6. Report Synthesis',
              desc: 'Cross-evidence correlation, human-interpretable rationale compilation, and risk calibration.',
            },
          ].map((layer, idx) => (
            <div
              key={layer.title}
              className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-1.5"
            >
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                Layer 0{idx + 1}
              </span>
              <h4 className="text-sm font-semibold text-slate-200">{layer.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{layer.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Development Roadmap */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            Development Roadmap & Milestones
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Phased engineering progression ensuring verified foundations before neural detector deployment.
          </p>
        </div>

        <div className="space-y-4">
          {roadmapPhases.map((phase) => (
            <div
              key={phase.phase}
              className={`rounded-xl border p-5 transition-all ${
                phase.current
                  ? 'bg-slate-900/80 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">{phase.phase}</span>
                    <span className="text-slate-600">&bull;</span>
                    <h3 className="text-sm font-bold text-slate-200">{phase.title}</h3>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1 ${
                    phase.current
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {phase.current ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Clock className="w-3 h-3 text-slate-500" />
                  )}
                  {phase.status}
                </span>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
                {phase.items.map((it, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-500 font-mono mt-0.5">&rsaquo;</span>
                    <span className="leading-relaxed">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
