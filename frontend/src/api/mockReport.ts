import { ForensicReport } from "../types/report";

export const MOCK_FORENSIC_REPORT: ForensicReport = {
  is_mock: true,
  job_id: "demo-dfx-8942-alpha",
  created_at: new Date(Date.now() - 45000).toISOString(),
  completed_at: new Date().toISOString(),
  status: "completed",
  current_stage: "Report Synthesis & Cross-Modal Corroboration",
  files: [
    {
      filename: "evidence_suspect_statement.mp4",
      media_type: "video",
      file_size_bytes: 8412940,
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    {
      filename: "identity_credential_verified.pdf",
      media_type: "document",
      file_size_bytes: 1420580,
      sha256: "7d793037a0760186574b0282f2f435e70ec0e5c613e5d84879fbbe0cfb1e42a0"
    }
  ],
  overall_assessment: "High Risk: Multiple Inconsistent Forensic Indicators & Synthetic Markers Detected",
  overall_risk_score: 82,
  overall_confidence: "high",
  key_findings: [
    "Image/Frame classifier flagged suspicious face-boundary blending in 7 of 15 extracted video frames.",
    "Audio track exhibits discontinuous high-frequency cut-offs consistent with neural voice synthesis.",
    "PDF document contains 3 distinct %%EOF revision markers with modified date stamps preceding creation date.",
    "Cross-Modal mismatch: Audio track duration is 14.82s while video stream is 15.20s (delta > 350ms)."
  ],
  limitations: [
    "No C2PA provenance manifest present; absence of credentials does not definitively prove malicious intent.",
    "Error Level Analysis (ELA) is sensitive to repeated social media JPEG recompression passes.",
    "Voice cloning detection relies on 4-second temporal windows; brief interjections may yield inconclusive confidence."
  ],
  modules: {
    image: {
      module: "image",
      status: "completed",
      verdict: "likely_ai_generated",
      risk_score: 79,
      confidence: "high",
      summary: "High frequency pixel grid inconsistencies and high confidence neural generator artifact score.",
      processing_ms: 640,
      scores: {
        ai_generator_classifier: 0.84,
        ela_inconsistency_index: 0.72,
        metadata_integrity_score: 0.15
      },
      warnings: [
        "Camera make and model EXIF attributes have been stripped.",
        "Detected Photoshop/Export metadata headers embedded in XMP block."
      ],
      evidence: [
        {
          check: "ELA Heatmap",
          severity: "high",
          title: "Localized Compression Discontinuity",
          detail: "High error variance detected around subject's eye sockets and mouth region compared to ambient background.",
          artifact_id: "ela-vis-001"
        },
        {
          check: "EXIF Inspection",
          severity: "medium",
          title: "Missing Camera Hardware Profile",
          detail: "Software field marked as 'Canva Design Generator / WebP Exporter'. Physical capture parameters absent.",
          limitation: "Social media uploads routinely strip hardware EXIF."
        }
      ]
    },
    video: {
      module: "video",
      status: "completed",
      verdict: "likely_manipulated",
      risk_score: 84,
      confidence: "high",
      summary: "Sampled keyframes exhibit face-box jitter and temporal score variance across cuts.",
      processing_ms: 1820,
      scores: {
        temporal_variance_score: 0.78,
        face_crop_boundary_score: 0.88,
        frame_consistency_score: 0.65
      },
      warnings: [
        "Variable frame rate detected; audio and video sync flags triggered."
      ],
      evidence: [
        {
          check: "Frame Sampling",
          severity: "high",
          title: "Suspicious Blending at Frame 00:04.2",
          detail: "Warped warping artifacts around jawline during rotational head movement.",
          timestamp_seconds: 4.2
        },
        {
          check: "Frame Sampling",
          severity: "high",
          title: "Temporal Texture Anomaly at Frame 00:09.6",
          detail: "Teeth synthesis failure and specular reflection mismatch between left and right iris.",
          timestamp_seconds: 9.6
        }
      ]
    },
    audio: {
      module: "audio",
      status: "completed",
      verdict: "likely_synthetic",
      risk_score: 81,
      confidence: "high",
      summary: "Synthetic speech artifacts detected in multiple 4-second audio analysis windows.",
      processing_ms: 910,
      scores: {
        wav2vec_synthetic_score: 0.86,
        spectral_flatness_score: 0.44,
        hf_energy_cutoff_ratio: 0.91
      },
      warnings: [
        "Sharp 8.2 kHz frequency roll-off typical of neural vocoder vocoding algorithms."
      ],
      evidence: [
        {
          check: "Log-Mel Spectrogram",
          severity: "high",
          title: "Atypical Pitch Transition (Window 2: 4.0s - 8.0s)",
          detail: "Robotic harmonic banding without natural human micro-tremors during vocal fry.",
          timestamp_seconds: 5.5
        }
      ]
    },
    document: {
      module: "document",
      status: "completed",
      verdict: "needs_review",
      risk_score: 68,
      confidence: "medium",
      summary: "Multiple post-creation %%EOF incremental updates with font mismatch on monetary sum.",
      processing_ms: 420,
      scores: {
        revision_anomaly_index: 0.80,
        font_consistency_score: 0.55
      },
      warnings: [
        "3 separate incremental revision xref tables detected.",
        "CreationDate is recorded after ModDate (Timestamp anomaly)."
      ],
      evidence: [
        {
          check: "Byte Stream Analysis",
          severity: "high",
          title: "3 %%EOF Revision Delimiters",
          detail: "The document contains multiple revision markers. Page 1 text stream was modified 42 minutes after initial compilation.",
          page_number: 1
        },
        {
          check: "Typography & Font Layer",
          severity: "medium",
          title: "Embedded Font Substitution",
          detail: "Main body uses Helvetica-Bold; table value 'USD 450,000' is rendered using non-standard ArialMT overlay.",
          page_number: 1
        }
      ]
    },
    cross_modal: {
      module: "provenance",
      status: "completed",
      verdict: "inconsistent",
      risk_score: 76,
      confidence: "high",
      summary: "Stream duration mismatch and unsynchronized speech envelope detected between video and audio tracks.",
      processing_ms: 310,
      scores: {
        temporal_sync_score: 0.41,
        stream_duration_delta_ms: 380
      },
      warnings: [
        "Audio stream terminates 380ms prior to final video keyframe."
      ],
      evidence: [
        {
          check: "Duration Delta",
          severity: "medium",
          title: "Audio/Video Track Length Discrepancy",
          detail: "Video stream length is 15.20s; extracted audio stream length is 14.82s. Indicates post-production track insertion."
        }
      ]
    }
  }
};
