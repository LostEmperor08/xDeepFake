/**
 * Multimodal Forensic Types & Schema Interfaces for DEEPFAKE X.
 * Reflects backend Pydantic models for type safety.
 */

export type Modality =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'provenance'
  | 'cross_modal';

export type RiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'inconclusive';

export type ModuleStatus =
  | 'completed'
  | 'analysis_not_implemented'
  | 'skipped'
  | 'failed';

export interface Evidence {
  id: string;
  label: string;
  description: string;
  modality: Modality;
  confidence?: number | null;
  source_layer: string;
  metadata?: Record<string, unknown>;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  risk_level: RiskLevel;
  category: string;
  evidence_refs: string[];
  explanation: string;
}

export interface ModuleResult {
  module: string;
  modality: Modality;
  status: ModuleStatus;
  risk_level: RiskLevel;
  model_confidence?: number | null;
  findings: Finding[];
  evidence: Evidence[];
  limitations: string[];
  processing_time_ms: number;
  details?: Record<string, unknown>;
}

export interface FileInfo {
  filename: string;
  size_bytes: number;
  mime_type: string;
  sha256: string;
  modality: Modality;
  extension: string;
}

export interface OverallScore {
  risk_score: number;
  risk_level: RiskLevel;
  authenticity_assessment: string;
  summary: string;
  confidence_breakdown?: Record<string, number>;
}

export interface AnalysisReport {
  report_id: string;
  file_info: FileInfo;
  created_at: string;
  completed_at: string;
  overall: OverallScore;
  modules: Record<string, ModuleResult>;
  cross_modal_correlation?: Record<string, unknown> | null;
  disclaimer: string;
}

export interface UploadResponse {
  job_id: string;
  status: string;
  message: string;
  file_info: FileInfo;
  report?: AnalysisReport | null;
}

export interface HealthResponse {
  status: string;
  uptime_seconds: number;
  app_name: string;
  version: string;
  environment: string;
  active_modules: string[];
}

export interface ModuleSummary {
  id: string;
  modality: Modality;
  phase: string;
  status: ModuleStatus;
  description: string;
}
