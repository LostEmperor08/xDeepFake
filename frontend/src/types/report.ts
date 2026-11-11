/**
 * DEEPFAKE X - Shared API Contract and TypeScript Types
 * Aligned with FastAPI Pydantic schema specification (Page 14 of Hackathon Master Plan)
 */

export type ModuleStatus = "completed" | "partial" | "unavailable" | "skipped" | "failed";
export type Severity = "info" | "low" | "medium" | "high";
export type Confidence = "low" | "medium" | "high";

export interface Evidence {
  check: string;
  severity: Severity;
  title: string;
  detail: string;
  timestamp_seconds?: number | null;
  page_number?: number | null;
  region?: Record<string, number> | null;
  artifact_id?: string | null;
  limitation?: string | null;
}

export interface ModuleResult {
  module: "image" | "audio" | "document" | "video" | "provenance";
  status: ModuleStatus;
  verdict: string;
  risk_score: number | null; // 0-100 triage score
  confidence: Confidence;
  summary: string;
  scores: Record<string, number>;
  evidence: Evidence[];
  warnings: string[];
  processing_ms?: number | null;
}

export interface AnalyzedFile {
  filename: string;
  media_type: "image" | "audio" | "video" | "document" | "bundle";
  file_size_bytes: number;
  sha256: string;
  preview_url?: string;
}

export interface ForensicReport {
  job_id: string;
  created_at: string;
  completed_at?: string | null;
  status: "queued" | "processing" | "completed" | "partial" | "failed";
  current_stage?: string;
  files: AnalyzedFile[];
  overall_assessment: string;
  overall_risk_score: number; // 0-100 triage indicator
  overall_confidence: Confidence;
  modules: {
    image?: ModuleResult;
    audio?: ModuleResult;
    video?: ModuleResult;
    document?: ModuleResult;
    provenance?: ModuleResult;
    cross_modal?: ModuleResult;
  };
  key_findings: string[];
  limitations: string[];
  is_mock?: boolean; // Explicit indicator if dataset is demonstration/mock data
}

export interface JobStatusResponse {
  job_id: string;
  status: "queued" | "processing" | "completed" | "partial" | "failed";
  stage: string;
  completed_modules: string[];
  failed_modules: string[];
  error?: string | null;
}
